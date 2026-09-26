import { expect, vi } from "vitest";
import { prepared, at, range } from "./acceptanceLifecycleTestFixtures.js";
import {
  createReviewScope,
  publicationRangeFromReviewScope,
} from "../core/planning/reviewScope.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
export { at, range } from "./acceptanceLifecycleTestFixtures.js";
export async function publicationFixture() {
  const db = createDayFrameDurableDb();
  const history = createHistoricalPlanSurface({ storage: db });
  const { store, durable } = await prepared(true, {
    restoreIndexedDb: db,
    historicalPlanSurface: history,
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
  const generate = () =>
    store.generatePreview({
      rangeStartDate: range.startUserDayDate,
      rangeEndDate: range.startUserDayDate,
      planningWindowStart: new Date(2026, 8, 17, 0),
      planningWindowEnd: new Date(2026, 8, 18, 0),
      generatedAt: at,
    });
  let attempts = 0,
    transactions = 0;
  const mutate = durable.mutate;
  vi.spyOn(durable, "mutate").mockImplementation((rows, admit, observe) => {
    const publication = rows.some((row) => row.store === "historicalPlanBatches");
    if (publication) attempts++;
    return mutate(rows, admit, (receipt) => {
      if (publication) transactions++;
      observe?.(receipt);
    });
  });
  const command = async () => ({
    publicationRange: publicationRangeFromReviewScope(scope),
    expectedSourceFingerprint: (await store.queryPlanningReview(query)).sourceFingerprint,
    publishedAt: at,
  });
  return {
    store,
    durable,
    history,
    input,
    query,
    generate,
    command,
    counts: () => ({ attempts, transactions }),
  };
}
