import { expect, it, vi } from "vitest";
import { prepared, at, range } from "./acceptanceLifecycleTestFixtures.js";
import {
  createReviewScope,
  publicationRangeFromReviewScope,
} from "../core/planning/reviewScope.js";
import { publicationBlockers } from "./publicationEligibility.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { hasCurrentAcceptanceReceipt } from "./acceptanceLifecycle.js";
import { deriveScheduleReviewReadiness } from "../ui/scheduleReviewReadiness.js";
it.each([
  "lostAck",
  "missingAck",
  "verification",
  "knownAbort",
  "healthyUnrealized",
  "realizationUncertain",
] as const)("publication protection boundary: %s", async (fault) => {
  const db = createDayFrameDurableDb();
  const { store, durable } = await prepared(true, {
    restoreIndexedDb: db,
    historicalPlanSurface: createHistoricalPlanSurface({ storage: db }),
  });
  store.setShiftDefinitions([
    {
      id: "day",
      userId: "u",
      name: "Day",
      startTime: "12:00",
      endTime: "13:00",
      workDays: ["thursday"],
      crossesMidnight: false,
      createdAt: at,
      updatedAt: at,
    },
  ]);
  store.setShiftCycles([
    {
      id: "cycle",
      userId: "u",
      name: "Cycle",
      type: "fixedSegments",
      startsOnDate: "2026-09-01",
      endsOnDate: "2026-09-30",
      segments: [
        {
          id: "segment",
          shiftCycleId: "cycle",
          shiftDefinitionId: "day",
          startsOnDate: "2026-09-01",
          endsOnDate: "2026-09-30",
        },
      ],
      createdAt: at,
      updatedAt: at,
    },
  ]);
  const evaluation = await store.evaluateCompetingAllocation({
    ...range,
    evaluationCutoff: at,
  });
  if (evaluation.status !== "evaluated") throw Error(JSON.stringify(evaluation));
  const generated = await store.deriveProposal({
    allocation: evaluation.allocation.allocations[0]!,
    horizon: range,
    allocationHorizon: range,
    generatedAt: at,
    evaluationCutoff: at,
  });
  if (generated.status !== "proposed") throw Error(JSON.stringify(generated));
  expect((await store.recordProposal(generated)).status).toBe("accepted");
  const input = {
    proposalId: generated.proposal.id,
    proposalRevision: generated.proposal.revision,
    optionId: generated.proposal.preferredOptionId,
  };
  store.generatePreview({
    rangeStartDate: range.startUserDayDate,
    rangeEndDate: range.startUserDayDate,
    planningWindowStart: new Date(2026, 8, 17, 0),
    planningWindowEnd: new Date(2026, 8, 18, 0),
    generatedAt: at,
  });
  const scope = createReviewScope({
    kind: "custom",
    anchorUserDayDate: range.startUserDayDate,
    weekStartsOn: "monday",
    customRange: range,
  });
  const query = { reviewScope: scope, historyAsOf: at };
  const before = await store.queryPlanningReview(query);
  expect(publicationBlockers(before)).toEqual([]);
  const historyBefore = await store.exportHistoricalPlan();
  const rawProposalBefore = await durable.getAll("proposalAuthority");
  const real = durable.mutate;
  let publicationAttempts = 0;
  let acceptanceAttempts = 0,
    acceptanceTransactions = 0,
    publicationTransactions = 0;
  vi.spyOn(durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    if (rows.some((r) => r.store === "historicalPlanBatches")) publicationAttempts++;
    const proposal = rows.some((r) => r.store === "proposalAuthority");
    if (proposal) acceptanceAttempts++;
    const realization = rows.some((r) => r.store === "realizationAuthority");
    if (proposal && fault === "knownAbort")
      return real(
        [
          ...rows,
          {
            type: "put",
            store: "proposalAuthority",
            value: { bad: "missing key" },
          },
        ],
        admit,
        (receipt) => {
          acceptanceTransactions++;
          observe?.(receipt);
        },
      );
    const result = await real(
      rows,
      realization && fault === "healthyUnrealized" ? () => false : admit,
      (receipt) => {
        if (proposal) acceptanceTransactions++;
        if (rows.some((r) => r.store === "historicalPlanBatches")) publicationTransactions++;
        observe?.(receipt);
      },
    );
    if ((proposal && fault === "lostAck") || (realization && fault === "realizationUncertain"))
      throw Error("Controlled loss of outward acknowledgment after actual native commit");
    if (proposal && fault === "missingAck") return new Promise(() => {});
    return result;
  });
  const read = durable.getAll;
  let corruptNextRead = fault === "verification";
  vi.spyOn(durable, "getAll").mockImplementation(async (...args) => {
    const result = await read(...args);
    if (
      corruptNextRead &&
      args[0] === "proposalAuthority" &&
      acceptanceTransactions &&
      result.status === "success"
    ) {
      corruptNextRead = false;
      return { status: "success", value: result.value.slice(1) };
    }
    return result;
  });
  const outcome = await store.acceptProposalOption(input);
  const gap = ["lostAck", "missingAck", "verification"].includes(fault);
  expect(outcome.status).toBe(
    gap ? "unconfirmed" : fault === "knownAbort" ? "rejected" : "accepted",
  );
  if (gap)
    expect(store.getProposalIngressStatus()).toMatchObject({
      status: "protected",
    });
  expect(hasCurrentAcceptanceReceipt(outcome)).toBe(true);
  if (gap) {
    expect(store.exportProposalAuthority().acceptedAllocations).toEqual([]);
    expect(store.exportRealizationAuthority().realizations).toEqual([]);
  }
  const rawProposal = await durable.getAll("proposalAuthority");
  const after = await store.queryPlanningReview(query);
  const readiness = deriveScheduleReviewReadiness({
    model: after,
    unresolvedFrictionCount: after.unresolvedFrictionCount,
    publicationRangeValid: true,
  });
  const published = await store.publishScheduleRange({
    publicationRange: publicationRangeFromReviewScope(scope),
    expectedSourceFingerprint: after.sourceFingerprint,
    publishedAt: at,
  });
  const history = await store.exportHistoricalPlan();
  const rawHistory = await durable.getAll("historicalPlanBatches");
  const rawHistoryDays = await durable.getAll("historicalPlanDays");
  expect(published.receipt?.isCurrent()).toBe(true);
  expect(publicationBlockers(after).length === 0).toBe(fault === "knownAbort");
  expect(readiness.publicationReady).toBe(fault === "knownAbort");
  expect(published.status).toBe(fault === "knownAbort" ? "published" : "rejected");
  expect(publicationTransactions).toBe(fault === "knownAbort" ? 1 : 0);
  if (gap) {
    const clear = store.clearLocalData();
    await expect(clear).rejects.toThrow();
    await clear.catch((error) => ({
      status: "rejected",
      message: String(error),
    }));
  }
  const rawAfter = await durable.getAll("proposalAuthority");
  expect(rawAfter).toEqual(rawProposal);
  const restarted = createDayFrameStore();
  await restarted.whenReady();
  const restartHistory = await restarted.exportHistoricalPlan();
  expect(restartHistory).toEqual(history);
  expect(await durable.getAll("historicalPlanBatches")).toEqual(rawHistory);
  expect(await durable.getAll("historicalPlanDays")).toEqual(rawHistoryDays);
  const restartedAccepted = restarted.exportProposalAuthority().acceptedAllocations;
  if (rawProposal.status !== "success") throw Error("Raw Proposal unavailable");
  expect(restartedAccepted).toEqual(
    rawProposal.value.filter(
      (row) =>
        !!row &&
        typeof row === "object" &&
        "recordType" in row &&
        row.recordType === "acceptedAllocation",
    ),
  );
  expect(restartedAccepted.length).toBe(fault === "knownAbort" ? 0 : 1);
  if (fault !== "knownAbort")
    expect(restartedAccepted[0]!.claims.map((c) => c.role).sort()).toEqual([
      "bufferProtection",
      "productive",
      "supportActivity",
    ]);
  restarted.generatePreview({
    rangeStartDate: range.startUserDayDate,
    rangeEndDate: range.startUserDayDate,
    planningWindowStart: new Date(2026, 8, 17, 0),
    planningWindowEnd: new Date(2026, 8, 18, 0),
    generatedAt: at,
  });
  const restartedReview = await restarted.queryPlanningReview(query);
  if (gap) expect(publicationBlockers(restartedReview)).toContain("acceptedAllocationUnrealized");
  expect(await durable.getAll("proposalAuthority")).toEqual(rawProposal);
  if (gap || fault === "realizationUncertain") {
    const source = gap ? "proposal" : "realization";
    const reason = fault === "verification" ? "verificationFailed" : "commitUnconfirmed";
    expect(published).toMatchObject({
      status: "rejected",
      reason: "publicationSourceUnqualified",
      sourceIssues: expect.arrayContaining([expect.objectContaining({ source, reason })]),
    });
    expect(readiness.blockers[0]).toMatchObject({
      code: "publicationSourceUnqualified",
      blocksReview: true,
      blocksPublication: true,
      sourceIssues: expect.arrayContaining([expect.objectContaining({ source, reason })]),
    });
    expect(after.publicationWitness.status).toBe("blocked");
    expect(after.acceptedLiabilities.coverage.status).not.toBe("complete");
    expect(history).toEqual(historyBefore);
    expect(publicationAttempts).toBe(0);
    const oldHash = await store.publishScheduleRange({
      publicationRange: publicationRangeFromReviewScope(scope),
      expectedSourceFingerprint: before.sourceFingerprint,
      publishedAt: at,
    });
    expect(oldHash).toMatchObject({
      reason: "publicationSourceUnqualified",
      sourceIssues: expect.arrayContaining([expect.objectContaining({ source, reason })]),
    });
    expect(publicationTransactions).toBe(0);
  }
  expect(acceptanceAttempts).toBe(1);
  expect(acceptanceTransactions).toBe(1);
  if (fault === "knownAbort") {
    expect(rawProposal).toEqual(rawProposalBefore);
    expect(after.sourceQualification.proposal).toMatchObject({
      status: "qualified",
      basis: "qualifiedPriorCommit",
      lastWrite: "knownNotWritten",
    });
  }
});
