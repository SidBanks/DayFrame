import { IDBFactory } from "fake-indexeddb";
import { expect, it, vi, afterEach } from "vitest";
import { allocation, horizon } from "../core/planning/proposalTestFixtures.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createProposalSurface } from "./proposalSurface.js";
import { createAcceptanceLifecycle, hasCurrentAcceptanceReceipt } from "./acceptanceLifecycle.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY as capability } from "./dayFrameRuntimeAuthority.js";

afterEach(() => vi.restoreAllMocks());
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
async function fixture() {
  const storage = createDayFrameDurableDb({ indexedDB: new IDBFactory() }),
    lifecycle = createAcceptanceLifecycle();
  let n = 0,
    source = "A";
  const accepted = vi.fn(async () => ({
    status: "failed" as const,
    acceptedAllocationId: "unused",
    scheduledGoalWorkIds: [],
    scheduledSupportActivityIds: [],
    bufferProtectionIds: [],
    conflicts: [],
    reasons: ["atomicPersistenceFailure" as const],
    previewFreshnessImpact: "none" as const,
  }));
  const owner = createProposalSurface({
    storage,
    lifecycle,
    allocateId: () => `identity-${++n}`,
    sourceWitness: () => source,
    onAcceptedAllocation: accepted,
  });
  await owner.initializeProposals();
  const generated = owner.deriveProposal({
    allocation: allocation(),
    horizon,
    allocationHorizon: horizon,
    generatedAt: "2026-09-04T12:00:00.000Z",
  });
  if (generated.status !== "proposed") throw Error("fixture");
  await owner.recordProposal(generated);
  const input = {
    proposalId: generated.proposal.id,
    proposalRevision: 1,
    optionId: generated.proposal.preferredOptionId,
    current: generated,
  };
  return {
    storage,
    lifecycle,
    owner,
    generated,
    input,
    accepted,
    setSource: () => {
      source = "B";
    },
  };
}

it("every common writer alias rejects busy without computing a deferred candidate", async () => {
  const f = await fixture(),
    entered = deferred(),
    release = deferred(),
    real = f.storage.mutate;
  const spy = vi.spyOn(f.storage, "mutate").mockImplementation(async (...args) => {
    entered.resolve();
    await release.promise;
    return real(...args);
  });
  const first = f.owner.markProposalShown(f.input.proposalId, 1);
  await entered.promise;
  const commands = [
    () => f.owner.recordProposal(f.generated),
    () => f.owner.markProposalShown(f.input.proposalId, 1),
    () => f.owner.supersedeProposal(f.input.proposalId, 1, f.generated.proposal),
    () => f.owner.createModificationCandidate(f.input.proposalId, 1, f.input.optionId, {} as never),
    () => f.owner.rejectOption(f.input),
    () => f.owner.rejectProposal(f.input),
    () => f.owner.acceptProposalOption(f.input),
    () => f.owner.modifyAndAcceptCandidate({ ...f.input, candidateId: "invalid" }),
    () => f.owner.retryProposalPersistence(),
  ];
  for (const command of commands) {
    const result = await command();
    expect(result).toMatchObject({ status: "rejected", reason: "proposalBusy" });
    expect(hasCurrentAcceptanceReceipt(result)).toBe(true);
  }
  expect(spy).toHaveBeenCalledOnce();
  expect(await f.owner.clearProposalAuthority()).toEqual({ status: "storageFailure" });
  release.resolve();
  expect((await first).status).toBe("accepted");
  expect(f.owner.listProposalHistory()).toHaveLength(2);
});

it.each(["abort", "lost", "verify"] as const)(
  "acceptance %s preserves exact desired or protection without automatic realization",
  async (fault) => {
    const f = await fixture(),
      real = f.storage.mutate,
      read = f.storage.getAll;
    const spy = vi.spyOn(f.storage, "mutate").mockImplementation(async (rows, admit, observe) => {
      if (fault === "abort")
        return real(
          [...rows, { type: "put", store: "proposalAuthority", value: { invalid: true } }],
          admit,
          observe,
        );
      const result = await real(rows, admit, observe);
      if (fault === "lost") throw Error("lost acknowledgment");
      return result;
    });
    const readSpy = vi
      .spyOn(f.storage, "getAll")
      .mockImplementation(async (...args) =>
        fault === "verify" ? { status: "success", value: [] } : read(...args),
      );
    const result = await f.owner.acceptProposalOption(f.input);
    expect(result).toMatchObject(
      fault === "abort"
        ? { status: "rejected", reason: "persistenceFailure" }
        : {
            status: "unconfirmed",
            reason: fault === "lost" ? "commitStateUncertain" : "verificationFailedAfterCommit",
          },
    );
    expect(f.accepted).not.toHaveBeenCalled();
    expect(f.owner.exportProposalAuthority().acceptedAllocations).toEqual([]);
    const desired = f.owner.getProposalRuntimeAdapter(capability).captureRuntimeSnapshot().desired;
    expect(desired.acceptedAllocations).toHaveLength(1);
    spy.mockRestore();
    readSpy.mockRestore();
    if (fault === "abort") {
      expect(await f.owner.retryProposalPersistence()).toMatchObject({ status: "durable" });
      expect(f.owner.exportProposalAuthority()).toEqual(desired);
      expect(f.accepted).not.toHaveBeenCalled();
      const physical = await read("proposalAuthority");
      expect(physical.status === "success" && physical.value.length).toBe(
        desired.proposals.length + desired.decisions.length + desired.acceptedAllocations.length,
      );
    } else {
      expect(await f.owner.retryProposalPersistence()).toMatchObject({
        status: "rejected",
        reason: "protected",
      });
      expect(await f.owner.initializeProposals()).toEqual({ status: "protected" });
    }
  },
);

it("a superseded desired retry origin cannot persist the later version", async () => {
  const f = await fixture(),
    old = f.lifecycle.capture();
  await f.owner.markProposalShown(f.input.proposalId, 1);
  const spy = vi.spyOn(f.storage, "mutate");
  expect(await f.lifecycle.enter(old, () => f.owner.retryProposalPersistence())).toMatchObject({
    status: "rejected",
    reason: "contextReplaced",
  });
  expect(spy).not.toHaveBeenCalled();
});

it("source changes while Proposal storage opens deny transaction creation and stale desired retry", async () => {
  const f = await fixture(),
    entered = deferred(),
    release = deferred(),
    real = f.storage.mutate;
  let transactions = 0;
  vi.spyOn(f.storage, "mutate").mockImplementation(async (rows, admit, observe) => {
    entered.resolve();
    await release.promise;
    return real(rows, admit, (receipt) => {
      transactions++;
      observe?.(receipt);
    });
  });
  const pending = f.owner.acceptProposalOption(f.input);
  await entered.promise;
  f.setSource();
  release.resolve();
  expect(await pending).toMatchObject({ status: "rejected", reason: "sourceChanged" });
  expect(transactions).toBe(0);
  expect(await f.owner.retryProposalPersistence()).toMatchObject({
    status: "rejected",
    reason: "sourceChanged",
  });
  expect(f.accepted).not.toHaveBeenCalled();
});

it("post-commit notification exception protects without another transaction or auto-handoff", async () => {
  const f = await fixture(),
    spy = vi.spyOn(f.storage, "mutate");
  f.owner.subscribeProposals(() => {
    expect(f.lifecycle.isQuiescent()).toBe(false);
    throw Error("subscriber");
  });
  expect(await f.owner.acceptProposalOption(f.input)).toMatchObject({
    status: "unconfirmed",
    reason: "verificationFailedAfterCommit",
  });
  expect(spy).toHaveBeenCalledOnce();
  expect(f.lifecycle.isQuiescent()).toBe(true);
  expect(f.owner.getProposalIngressStatus().status).toBe("protected");
  expect(f.accepted).not.toHaveBeenCalled();
});
