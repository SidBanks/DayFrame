import { expect, it, vi } from "vitest";
import { prepared, deferred, at } from "./acceptanceLifecycleTestFixtures.js";
import { createAcceptanceLifecycle, hasCurrentAcceptanceReceipt } from "./acceptanceLifecycle.js";
import { createRealizationSurface } from "./realizationSurface.js";
import { createProposalSurface } from "./proposalSurface.js";
import { createLazyProposalSurface } from "./lazyProposalSurface.js";
import { createLazyRealizationSurface } from "./lazyRealizationSurface.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY as capability } from "./dayFrameRuntimeAuthority.js";
import { allocation, horizon } from "../core/planning/proposalTestFixtures.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { IDBFactory } from "fake-indexeddb";

async function retained() {
  const f = await prepared(true),
    real = f.durable.mutate;
  const spy = vi
    .spyOn(f.durable, "mutate")
    .mockImplementation((rows, admit, observe) =>
      real(
        rows,
        rows.some((r) => r.store === "realizationAuthority") ? () => false : admit,
        observe,
      ),
    );
  expect((await f.store.acceptProposalOption(f.input)).status).toBe("accepted");
  spy.mockRestore();
  const lifecycle = createAcceptanceLifecycle();
  const owner = createRealizationSurface({
    storage: f.durable,
    lifecycle,
    resolveAcceptedAllocation: f.store.resolveAcceptedAllocation as never,
    now: () => at,
  });
  await owner.initializeRealizations();
  return {
    ...f,
    lifecycle,
    owner,
    id: f.store.exportProposalAuthority().acceptedAllocations[0]!.id,
  };
}

it.each([
  "throwBefore",
  "abort",
  "abortLost",
  "abortMissingAck",
  "throwAfter",
  "missingAck",
  "readFailure",
  "missingFact",
  "extraFact",
  "mismatchedFact",
] as const)("realization physical certainty: %s", async (fault) => {
  const f = await retained(),
    real = f.durable.mutate,
    read = f.durable.getAll;
  let delayed: (() => ReturnType<typeof real>) | undefined;
  let transactions = 0;
  vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    if (fault === "throwBefore") {
      delayed = () => real(rows, admit, observe);
      throw Error("before delegation");
    }
    if (fault === "abort" || fault === "abortLost" || fault === "abortMissingAck") {
      const aborted = await real(
        [...rows, { type: "put", store: "realizationAuthority", value: { bad: "missing key" } }],
        admit,
        observe,
      );
      if (fault === "abortLost") throw Error("aborted acknowledgment lost");
      if (fault === "abortMissingAck") return new Promise(() => {});
      return aborted;
    }
    const result = await real(rows, admit, (receipt) => {
      transactions++;
      observe?.(receipt);
    });
    if (fault === "throwAfter") throw Error("lost acknowledgment");
    if (fault === "missingAck") return new Promise(() => {});
    return result;
  });
  vi.spyOn(f.durable, "getAll").mockImplementation(async (...args) => {
    const result = await read(...args);
    if (args[0] !== "realizationAuthority" || !transactions) return result;
    if (fault === "readFailure")
      return { status: "failure", error: { code: "readFailed", operation: "verify" } };
    if (result.status !== "success") return result;
    if (fault === "missingFact") return { status: "success", value: result.value.slice(1) };
    if (fault === "extraFact")
      return { status: "success", value: [...result.value, result.value[0]] };
    if (fault === "mismatchedFact")
      return {
        status: "success",
        value: result.value.map((row, index) =>
          index ? row : { ...(row as object), realizedAt: "2001-01-01T00:00:00.000Z" },
        ),
      };
    return result;
  });
  const result = await f.owner.realizeAcceptedAllocation(f.id);
  const known =
    fault === "throwBefore" ||
    fault === "abort" ||
    fault === "abortLost" ||
    fault === "abortMissingAck";
  expect(result).toMatchObject({
    status: known ? "failed" : "unconfirmed",
    reasons: [
      known
        ? "atomicPersistenceFailure"
        : fault === "throwAfter" || fault === "missingAck"
          ? "commitStateUncertain"
          : "verificationFailedAfterCommit",
    ],
  });
  expect(f.lifecycle.isQuiescent()).toBe(true);
  expect(f.owner.listRealizedScheduleFacts()).toEqual([]);
  expect(f.store.exportProposalAuthority().acceptedAllocations).toHaveLength(1);
  if (delayed) expect((await delayed()).status).toBe("failure");
  expect(await read("realizationAuthority")).toMatchObject({
    status: "success",
    value: known ? [] : expect.any(Array),
  });
  if (!known) {
    expect(f.owner.getRealizationProtectionEvidence(capability)?.attempted).toBeDefined();
    expect(await f.owner.realizeAcceptedAllocation(f.id)).toMatchObject({
      status: "protected",
      reasons: ["authorityProtected"],
    });
  }
});

it("live native receipt remains leased through an outward throw until actual terminal", async () => {
  const f = await retained(),
    real = f.durable.mutate,
    entered = deferred(),
    terminal = deferred();
  vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    await real(rows, admit, (receipt) =>
      observe?.({
        terminal: receipt.terminal.then(async (state) => {
          entered.resolve();
          await terminal.promise;
          return state;
        }),
      }),
    );
    throw Error("lost");
  });
  const pending = f.owner.realizeAcceptedAllocation(f.id);
  await entered.promise;
  expect(f.lifecycle.isQuiescent()).toBe(false);
  expect(await f.owner.clearRealizationAuthority()).toEqual({ status: "storageFailure" });
  expect(await f.owner.realizeAcceptedAllocation(f.id)).toMatchObject({
    reasons: ["realizationBusy"],
  });
  terminal.resolve();
  expect(await pending).toMatchObject({ status: "unconfirmed", reasons: ["commitStateUncertain"] });
  expect(f.lifecycle.isQuiescent()).toBe(true);
});

it("unresolved native terminal never releases its fence", async () => {
  const f = await retained(),
    entered = deferred();
  vi.spyOn(f.durable, "mutate").mockImplementation(async (_rows, _admit, observe) => {
    observe?.({ terminal: new Promise(() => {}) });
    entered.resolve();
    throw Error("lost");
  });
  void f.owner.realizeAcceptedAllocation(f.id);
  await entered.promise;
  await Promise.resolve();
  expect(f.lifecycle.isQuiescent()).toBe(false);
  expect(await f.owner.clearRealizationAuthority()).toEqual({ status: "storageFailure" });
});

it("verification and synchronous notification both retain replacement exclusion", async () => {
  const f = await retained(),
    entered = deferred(),
    release = deferred(),
    read = f.durable.getAll;
  const notify = vi.fn(() => expect(f.lifecycle.isQuiescent()).toBe(false));
  const owner = createRealizationSurface({
    storage: f.durable,
    lifecycle: f.lifecycle,
    resolveAcceptedAllocation: f.store.resolveAcceptedAllocation as never,
    onAuthorityChanged: notify,
  });
  await owner.initializeRealizations();
  vi.spyOn(f.durable, "getAll").mockImplementation(async (...args) => {
    entered.resolve();
    await release.promise;
    return read(...args);
  });
  const pending = owner.realizeAcceptedAllocation(f.id);
  await entered.promise;
  expect(await owner.clearRealizationAuthority()).toEqual({ status: "storageFailure" });
  release.resolve();
  expect((await pending).status).toBe("realized");
  expect(notify).toHaveBeenCalledOnce();
});

it.each(["proposals", "realizations"] as const)(
  "stale %s initialization cannot replace installed authority or protection",
  async (kind) => {
    const storage = createDayFrameDurableDb({ indexedDB: new IDBFactory() });
    const lifecycle = createAcceptanceLifecycle(),
      entered = deferred(),
      release = deferred(),
      read = storage.getAll;
    const owner =
      kind === "proposals"
        ? createProposalSurface({ storage, lifecycle })
        : createRealizationSurface({
            storage,
            lifecycle,
            resolveAcceptedAllocation: () => ({ status: "notFound" }),
          });
    const adapter =
      "getProposalRuntimeAdapter" in owner
        ? owner.getProposalRuntimeAdapter(capability)
        : owner.getRealizationRuntimeAdapter(capability);
    const snapshot = adapter.captureRuntimeSnapshot();
    vi.spyOn(storage, "getAll").mockImplementation(async (...args) => {
      const result = await read(...args);
      entered.resolve();
      await release.promise;
      return result;
    });
    const pending =
      "initializeProposals" in owner ? owner.initializeProposals() : owner.initializeRealizations();
    await entered.promise;
    adapter.installRuntimeExact(snapshot as never);
    release.resolve();
    expect(await pending).toEqual({ status: "contextReplaced" });
    expect(adapter.captureRuntimeSnapshot()).toEqual(snapshot);
  },
);

it.each(["proposals", "realizations"] as const)(
  "%s lazy install before module dispatch retains target and invalidates old command",
  async (kind) => {
    const storage = createDayFrameDurableDb({ indexedDB: new IDBFactory() });
    if (kind === "proposals") {
      const owner = createLazyProposalSurface({ storage });
      const adapter = owner.getProposalRuntimeAdapter(capability),
        snapshot = adapter.captureRuntimeSnapshot();
      const pending = owner.rejectProposal({ proposalId: "missing", proposalRevision: 1 });
      adapter.installRuntimeExact({
        ...snapshot,
        ingress: { status: "accepted" },
        durability: "durable",
      });
      expect(owner.getProposalIngressStatus().status).toBe("accepted");
      expect(owner.exportProposalAuthority()).toEqual(snapshot.authority);
      expect(await pending).toMatchObject({ status: "rejected", reason: "contextReplaced" });
      expect(owner.getProposalIngressStatus().status).toBe("accepted");
    } else {
      const owner = createLazyRealizationSurface({
        storage,
        resolveAcceptedAllocation: () => ({ status: "notFound" }),
      });
      const adapter = owner.getRealizationRuntimeAdapter(capability),
        snapshot = adapter.captureRuntimeSnapshot();
      const pending = owner.realizeAcceptedAllocation("missing");
      adapter.installRuntimeExact({ ...snapshot, ingress: "ready" });
      expect(owner.getRealizationIngressStatus()).toBe("ready");
      expect(owner.exportRealizationAuthority()).toEqual(snapshot.authority);
      expect(await pending).toMatchObject({ status: "rejected", reasons: ["contextReplaced"] });
      expect(owner.getRealizationIngressStatus()).toBe("ready");
    }
  },
);

it("replacement at the exact released acceptance handoff makes the outer historical and inner displaced", async () => {
  const storage = createDayFrameDurableDb({ indexedDB: new IDBFactory() }),
    proposals = createAcceptanceLifecycle(),
    realizations = createAcceptanceLifecycle();
  const realizer = createRealizationSurface({
    storage,
    lifecycle: realizations,
    resolveAcceptedAllocation: (id) => owner.resolveAcceptedAllocation(id) as never,
  });
  await realizer.initializeRealizations();
  const owner = createProposalSurface({
    storage,
    lifecycle: proposals,
    allocateId: (() => {
      let n = 0;
      return () => `id-${++n}`;
    })(),
    onAcceptedAllocation: async (id, parent) => {
      expect(proposals.isQuiescent()).toBe(true);
      expect((await owner.clearProposalAuthority()).status).toBe("removed");
      return realizations.enter(realizations.capture(parent), () =>
        realizer.realizeAcceptedAllocation(id),
      );
    },
  });
  await owner.initializeProposals();
  const generated = owner.deriveProposal({
    allocation: allocation(),
    horizon,
    allocationHorizon: horizon,
    generatedAt: at,
  });
  if (generated.status !== "proposed") throw Error("fixture");
  await owner.recordProposal(generated);
  const outcome = await owner.acceptProposalOption({
    proposalId: generated.proposal.id,
    proposalRevision: 1,
    optionId: generated.proposal.preferredOptionId,
    current: generated,
  });
  expect(outcome).toMatchObject({
    status: "accepted",
    value: { realization: { status: "rejected", reasons: ["contextReplaced"] } },
  });
  expect(hasCurrentAcceptanceReceipt(outcome)).toBe(false);
  expect(owner.exportProposalAuthority().acceptedAllocations).toEqual([]);
  expect(await storage.getAll("realizationAuthority")).toEqual({ status: "success", value: [] });
});
