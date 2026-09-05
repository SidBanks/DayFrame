import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { allocation, horizon } from "../core/planning/proposalTestFixtures.js";
import { createProposalSurface } from "./proposalSurface.js";
import { createRealizationSurface } from "./realizationSurface.js";

async function setup(name: string) {
  const storage = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name });
  let next = 0;
  const proposals = createProposalSurface({
    storage,
    now: () => "2026-09-04T12:00:00.000Z",
    allocateId: () => `authority-${++next}`,
  });
  await proposals.initializeProposals();
  const generated = proposals.deriveProposal({
    allocation: allocation(),
    horizon,
    allocationHorizon: horizon,
    generatedAt: "2026-09-04T12:00:00.000Z",
  });
  if (generated.status !== "proposed") throw new Error("expected proposal");
  await proposals.recordProposal(generated);
  const accepted = await proposals.acceptProposalOption({
    proposalId: generated.proposal.id,
    proposalRevision: generated.proposal.revision,
    optionId: generated.proposal.preferredOptionId,
    current: generated,
  });
  if (accepted.status !== "accepted") throw new Error("expected acceptance");
  const acceptedId = accepted.value.acceptedAllocation.id;
  return { storage, proposals, acceptedId };
}

describe("Accepted Allocation realization authority", () => {
  it("atomically persists one deterministic realization and is restart-idempotent", async () => {
    const { storage, proposals, acceptedId } = await setup("realization-idempotent");
    const create = () =>
      createRealizationSurface({
        storage,
        resolveAcceptedAllocation: proposals.resolveAcceptedAllocation as never,
        now: () => "2026-09-04T12:30:00.000Z",
      });
    const first = create();
    await first.initializeRealizations();
    const realized = await first.realizeAcceptedAllocation(acceptedId);
    expect(realized).toMatchObject({
      status: "realized",
      scheduledGoalWorkIds: [expect.any(String)],
    });
    expect(first.listRealizedScheduleFacts()).toHaveLength(1);

    const restarted = create();
    await restarted.initializeRealizations();
    expect(await restarted.realizeAcceptedAllocation(acceptedId)).toMatchObject({
      status: "alreadyRealized",
      realizationId: realized.realizationId,
    });
    expect(restarted.listRealizedScheduleFacts()).toHaveLength(1);
  });

  it("fails closed on a current schedule conflict and writes no partial footprint", async () => {
    const { storage, proposals, acceptedId } = await setup("realization-conflict");
    const surface = createRealizationSurface({
      storage,
      resolveAcceptedAllocation: proposals.resolveAcceptedAllocation as never,
      now: () => "2026-09-04T12:30:00.000Z",
      currentSchedule: () => [
        {
          id: "work-conflict" as never,
          startsAt: "2026-09-04T15:30:00.000Z",
          endsAt: "2026-09-04T16:30:00.000Z",
          sourceKind: "work" as never,
        },
      ],
    });
    await surface.initializeRealizations();
    expect(await surface.realizeAcceptedAllocation(acceptedId)).toMatchObject({
      status: "conflicted",
      reasons: ["scheduleConflict"],
      conflicts: [{ conflictingSubjectId: "work-conflict" }],
    });
    expect(surface.exportRealizationAuthority()).toEqual({
      version: 1,
      realizations: [],
      facts: [],
    });
  });

  it("keeps runtime and durable authority empty when the atomic write aborts", async () => {
    const { storage, proposals, acceptedId } = await setup("realization-atomic-failure");
    const failing = {
      ...storage,
      mutate: async () => ({
        status: "failure" as const,
        error: { code: "transactionAborted" as const, operation: "mutate" },
      }),
    };
    const surface = createRealizationSurface({
      storage: failing,
      resolveAcceptedAllocation: proposals.resolveAcceptedAllocation as never,
      now: () => "2026-09-04T12:30:00.000Z",
    });
    await surface.initializeRealizations();
    expect(await surface.realizeAcceptedAllocation(acceptedId)).toMatchObject({
      status: "failed",
      reasons: ["atomicPersistenceFailure"],
    });
    expect(surface.listRealizedScheduleFacts()).toEqual([]);
    const durable = await storage.getAll("realizationAuthority");
    expect(durable.status === "success" ? durable.value : "read-failed").toEqual([]);
  });
});
