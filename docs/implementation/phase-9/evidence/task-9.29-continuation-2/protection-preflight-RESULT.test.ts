import { expect, it, vi } from "vitest";
import { writeFileSync } from "node:fs";
import {
  prepared,
  at,
  range,
} from "../../../../../code/src/state/acceptanceLifecycleTestFixtures.js";
import {
  createReviewScope,
  publicationRangeFromReviewScope,
} from "../../../../../code/src/core/planning/reviewScope.js";
import { publicationBlockers } from "../../../../../code/src/state/publicationEligibility.js";
import { createDayFrameDurableDb } from "../../../../../code/src/infrastructure/storage/dayFrameDurableDb.js";
import { createHistoricalPlanSurface } from "../../../../../code/src/state/historicalPlanSurface.js";
import { createDayFrameStore } from "../../../../../code/src/state/dayFrameStore.js";
import { hasCurrentAcceptanceReceipt } from "../../../../../code/src/state/acceptanceLifecycle.js";
import { deriveScheduleReviewReadiness } from "../../../../../code/src/ui/scheduleReviewReadiness.js";
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
  if (evaluation.status !== "evaluated")
    throw Error(JSON.stringify(evaluation));
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
  const real = durable.mutate;
  let acceptanceAttempts = 0,
    acceptanceTransactions = 0,
    publicationTransactions = 0;
  vi.spyOn(durable, "mutate").mockImplementation(
    async (rows, admit, observe) => {
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
          if (rows.some((r) => r.store === "historicalPlanBatches"))
            publicationTransactions++;
          observe?.(receipt);
        },
      );
      if (
        (proposal && fault === "lostAck") ||
        (realization && fault === "realizationUncertain")
      )
        throw Error(
          "Controlled loss of outward acknowledgment after actual native commit",
        );
      if (proposal && fault === "missingAck") return new Promise(() => {});
      return result;
    },
  );
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
  expect(publicationBlockers(after).length === 0).toBe(
    gap || fault === "knownAbort",
  );
  expect(readiness.publicationReady).toBe(gap || fault === "knownAbort");
  expect(published.status).toBe(
    gap || fault === "knownAbort" ? "published" : "rejected",
  );
  expect(publicationTransactions).toBe(gap || fault === "knownAbort" ? 1 : 0);
  let clearOutcome: unknown = { status: "notExercised" };
  if (gap) {
    const clear = store.clearLocalData();
    await expect(clear).rejects.toThrow();
    clearOutcome = await clear.catch((error) => ({
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
  const restartedAccepted =
    restarted.exportProposalAuthority().acceptedAllocations;
  if (rawProposal.status !== "success") throw Error("Raw Proposal unavailable");
  expect(restartedAccepted).toEqual(
    rawProposal.value.filter(
      (row: any) => row.recordType === "acceptedAllocation",
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
  if (gap)
    expect(publicationBlockers(restartedReview)).toContain(
      "acceptedAllocationUnrealized",
    );
  expect(await durable.getAll("proposalAuthority")).toEqual(rawProposal);
  const observation = {
    fault,
    clearOutcome,
    sourceFingerprintBefore: before.sourceFingerprint,
    sourceFingerprintAfter: after.sourceFingerprint,
    restartedBlockers: publicationBlockers(restartedReview),
    receiptCurrentAtDelivery: hasCurrentAcceptanceReceipt(outcome),
    publicationReceiptCurrent: published.receipt?.isCurrent(),
    rawHistory,
    rawHistoryDays,
    restartHistory,
    restartedAccepted,
    rawProposalPreserved:
      JSON.stringify(rawAfter) === JSON.stringify(rawProposal),
    beforeBlockers: publicationBlockers(before),
    outcome,
    proposalIngress: store.getProposalIngressStatus(),
    realizationIngress: store.getRealizationIngressStatus(),
    acceptanceAttempts,
    acceptanceTransactions,
    publicationTransactions,
    rawProposal,
    runtimeProposal: store.exportProposalAuthority(),
    runtimeRealization: store.exportRealizationAuthority(),
    afterBlockers: publicationBlockers(after),
    readiness,
    published,
    history,
  };
  writeFileSync(
    new URL(`./protection-${fault}-observation-RESULT.json`, import.meta.url),
    JSON.stringify(observation, null, 2),
  );
  console.log(
    JSON.stringify({
      afterBlockers: observation.afterBlockers,
      ready: readiness.publicationReady,
      published: published.status,
      acceptanceTransactions,
      publicationTransactions,
    }),
  );
});
