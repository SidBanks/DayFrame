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
import { deriveScheduleReviewReadiness } from "../../../../../code/src/ui/scheduleReviewReadiness.js";
it("observes publication readiness after an unconfirmed physically committed Proposal acceptance", async () => {
  const { store, durable } = await prepared(true);
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
      const result = await real(rows, admit, (receipt) => {
        if (proposal) acceptanceTransactions++;
        if (rows.some((r) => r.store === "historicalPlanBatches"))
          publicationTransactions++;
        observe?.(receipt);
      });
      if (proposal)
        throw Error(
          "Controlled loss of outward acknowledgment after actual native commit",
        );
      return result;
    },
  );
  const outcome = await store.acceptProposalOption(input);
  expect(outcome).toMatchObject({
    status: "unconfirmed",
    reason: "commitStateUncertain",
  });
  expect(store.getProposalIngressStatus()).toMatchObject({
    status: "protected",
  });
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
  const observation = {
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
    new URL("./protection-preflight-observation-RESULT.json", import.meta.url),
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
