import { expect, it, vi, afterEach } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { allocation, alternative } from "../core/planning/proposalTestFixtures.js";
import { createProposalSurface } from "./proposalSurface.js";
import { createRealizationSurface } from "./realizationSurface.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createAcceptanceLifecycle } from "./acceptanceLifecycle.js";
afterEach(() => vi.restoreAllMocks());
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

// Each accepted target is produced by the actual Proposal command against a complete
// validated domain footprint. Overlap cases use independent Proposal fixtures: they
// test the realization resolver boundary, not a claim that UI can accept conflicting offers.
async function acceptance(
  id: string,
  start: string,
  supportStart: string,
  bufferStart: string,
  supportDay: `${number}-${number}-${number}` = "2026-09-04",
) {
  const base = alternative(id, `demand-${id}`, start),
    productive = base.resourceClaims[0]!;
  const support = {
    ...productive,
    id: `support-${id}`,
    role: "supportActivity" as const,
    componentId: "support",
    startsAt: supportStart,
    endsAt: new Date(Date.parse(supportStart) + 30 * 60_000).toISOString(),
    durationMinutes: 30,
    userDayDate: supportDay,
    relationship: { kind: "supportsProductive" as const, productiveClaimId: productive.id },
  };
  const buffer = {
    ...productive,
    id: `buffer-${id}`,
    role: "bufferProtection" as const,
    componentId: "buffer",
    startsAt: bufferStart,
    endsAt: new Date(Date.parse(bufferStart) + 15 * 60_000).toISOString(),
    durationMinutes: 15,
    userDayDate: supportDay,
    relationship: {
      kind: "protectsSupport" as const,
      supportClaimId: support.id,
      supportComponentId: "support",
    },
  };
  const footprint = {
    ...base.assignments[0]!.resourceFootprints[0]!,
    supportClaims: [support],
    bufferClaims: [buffer],
    supportMinutes: 30,
    bufferMinutes: 15,
    nominalResourceMinutes: 105,
    unionedResourceMinutes: 105,
  };
  const enriched = {
    ...base,
    assignments: [{ ...base.assignments[0]!, resourceFootprints: [footprint] }],
    resourceClaims: [productive, support, buffer],
    supportMinutes: 30,
    bufferMinutes: 15,
    nominalResourceMinutes: 105,
    unionedResourceMinutes: 105,
  };
  const store = createProposalSurface({
    storage: createDayFrameDurableDb({ indexedDB: new IDBFactory() }),
    allocateId: (() => {
      let n = 0;
      return () => `${id}-${++n}`;
    })(),
  });
  await store.initializeProposals();
  const horizon = { startUserDayDate: "2026-09-04", endUserDayDateExclusive: "2026-09-06" };
  const generated = store.deriveProposal({
    allocation: allocation([enriched]),
    horizon,
    allocationHorizon: horizon,
    generatedAt: "2026-09-04T12:00:00.000Z",
  });
  if (generated.status !== "proposed") throw Error(JSON.stringify(generated));
  expect((await store.recordProposal(generated)).status).toBe("accepted");
  const result = await store.acceptProposalOption({
    proposalId: generated.proposal.id,
    proposalRevision: 1,
    optionId: generated.proposal.preferredOptionId,
    current: generated,
  });
  if (result.status !== "accepted") throw Error(JSON.stringify(result));
  return result.value.acceptedAllocation;
}

it.each(["nonoverlap", "activityOverlap", "bufferOverlap"] as const)(
  "distinct attempts: %s rejects concurrent B then rechecks the settled base",
  async (kind) => {
    const a = await acceptance(
      "A",
      "2026-09-04T15:00:00.000Z",
      "2026-09-04T14:30:00.000Z",
      "2026-09-04T16:00:00.000Z",
    );
    const b = await acceptance(
      "B",
      kind === "activityOverlap" ? "2026-09-04T15:30:00.000Z" : "2026-09-04T18:00:00.000Z",
      kind === "activityOverlap" ? "2026-09-04T15:00:00.000Z" : "2026-09-04T17:30:00.000Z",
      kind === "bufferOverlap" ? "2026-09-04T16:00:00.000Z" : "2026-09-04T19:00:00.000Z",
    );
    const storage = createDayFrameDurableDb({ indexedDB: new IDBFactory() }),
      real = storage.mutate,
      entered = deferred(),
      release = deferred();
    const targets = [a, b];
    const owner = createRealizationSurface({
      storage,
      resolveAcceptedAllocation: (id) => ({
        status: "resolved",
        acceptedAllocation: targets.find((value) => value.id === id)!,
      }),
    });
    await owner.initializeRealizations();
    const spy = vi.spyOn(storage, "mutate").mockImplementation(async (...args) => {
      entered.resolve();
      await release.promise;
      return real(...args);
    });
    const pending = owner.realizeAcceptedAllocation(a.id);
    await entered.promise;
    expect(await owner.realizeAcceptedAllocation(b.id)).toMatchObject({
      status: "rejected",
      reasons: ["realizationBusy"],
    });
    release.resolve();
    expect((await pending).status).toBe("realized");
    const before = owner.exportRealizationAuthority();
    expect((await owner.realizeAcceptedAllocation(b.id)).status).toBe(
      kind === "activityOverlap" ? "conflicted" : "realized",
    );
    expect(owner.listRealizedScheduleFacts()).toEqual(expect.arrayContaining(before.facts));
    expect(owner.listRealizedScheduleFacts()).toHaveLength(kind === "activityOverlap" ? 3 : 6);
    expect(spy).toHaveBeenCalledTimes(kind === "activityOverlap" ? 1 : 2);
  },
);

it("complete adjacent-owner-day footprint survives exact readback and fresh already-realized verification", async () => {
  const accepted = await acceptance(
    "adjacent",
    "2026-09-04T22:30:00.000Z",
    "2026-09-05T00:00:00.000Z",
    "2026-09-05T00:30:00.000Z",
    "2026-09-05",
  );
  const storage = createDayFrameDurableDb({ indexedDB: new IDBFactory() });
  const owner = createRealizationSurface({
    storage,
    resolveAcceptedAllocation: () => ({ status: "resolved", acceptedAllocation: accepted }),
  });
  await owner.initializeRealizations();
  expect((await owner.realizeAcceptedAllocation(accepted.id)).status).toBe("realized");
  const authority = owner.exportRealizationAuthority();
  expect(new Set(authority.facts.map((f) => f.userDayDate))).toEqual(
    new Set(["2026-09-04", "2026-09-05"]),
  );
  const spy = vi.spyOn(storage, "mutate");
  expect((await owner.realizeAcceptedAllocation(accepted.id)).status).toBe("alreadyRealized");
  expect(spy).not.toHaveBeenCalled();
  expect(owner.exportRealizationAuthority()).toEqual(authority);
});

it("identical installed bytes cannot renew old intent, but a fresh explicit call verifies current authority", async () => {
  const accepted = await acceptance(
    "identical",
    "2026-09-04T15:00:00.000Z",
    "2026-09-04T14:30:00.000Z",
    "2026-09-04T16:00:00.000Z",
  );
  const storage = createDayFrameDurableDb({ indexedDB: new IDBFactory() }),
    lifecycle = createAcceptanceLifecycle();
  const owner = createRealizationSurface({
    storage,
    lifecycle,
    resolveAcceptedAllocation: () => ({ status: "resolved", acceptedAllocation: accepted }),
  });
  await owner.initializeRealizations();
  await owner.realizeAcceptedAllocation(accepted.id);
  const old = lifecycle.capture(),
    authority = owner.exportRealizationAuthority();
  expect((await owner.replaceRealizationAuthority(authority)).status).toBe("accepted");
  expect(
    await lifecycle.enter(old, () => owner.realizeAcceptedAllocation(accepted.id)),
  ).toMatchObject({ reasons: ["contextReplaced"] });
  expect((await owner.realizeAcceptedAllocation(accepted.id)).status).toBe("alreadyRealized");
});
