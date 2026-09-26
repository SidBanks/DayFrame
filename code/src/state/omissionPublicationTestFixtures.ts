import { expect } from "vitest";
import { publicationFixture, at } from "./publicationSourceTestFixtures.js";
import { createPlanDecisionAcceptanceCandidate } from "../core/decisions/createPlanDecisionAcceptanceCandidate.js";
import { materializePlanPublication } from "../core/historicalPlan/materializePlanPublication.js";
import { getReviewSources } from "./reviewSourceQualification.js";

export { at } from "./publicationSourceTestFixtures.js";
export async function omissionFixture(pendingProposal = false) {
  const f = await publicationFixture();
  let pendingResult: Awaited<ReturnType<typeof f.store.deriveProposal>> | undefined;
  if (pendingProposal) {
    const range = {
      startUserDayDate: "2026-09-17",
      endUserDayDateExclusive: "2026-09-18",
    } as const;
    const evaluated = await f.store.evaluateCompetingAllocation({ ...range, evaluationCutoff: at });
    if (evaluated.status !== "evaluated") throw Error(JSON.stringify(evaluated));
    const proposed = await f.store.deriveProposal({
      allocation: evaluated.allocation.allocations[0]!,
      horizon: range,
      allocationHorizon: range,
      generatedAt: at,
      predecessor: { id: f.input.proposalId, revision: f.input.proposalRevision },
      evaluationCutoff: at,
    });
    if (proposed.status !== "proposed") throw Error(JSON.stringify(proposed));
    expect(proposed.proposal.id).not.toBe(f.input.proposalId);
    pendingResult = proposed;
  }
  const accepted = await f.store.acceptProposalOption(f.input);
  expect(accepted.status).toBe("accepted");
  expect(f.store.listRealizedScheduleFacts()).toHaveLength(3);
  f.store.setPreviewRange({
    source: "custom",
    preset: "custom",
    startDate: "2026-09-17",
    endDate: "2026-09-17",
  });
  f.store.setBlockTemplates([
    {
      id: "routine",
      userId: "u",
      title: "Routine",
      category: "maintenance",
      placementType: "flexible",
      customWindowStartTime: "14:15",
      customWindowEndTime: "15:15",
      durationMinutes: 60,
      priority: 2,
      preferredWindow: "custom",
      rescheduleBehavior: "askUser",
      requiresResource: false,
      externalResources: [],
      enabled: true,
      createdAt: at,
      updatedAt: at,
    },
  ]);
  f.store.setBlockRecurrences([{ id: "daily", blockTemplateId: "routine", frequency: "daily" }]);
  f.generate();
  const addConflict = () => {
    f.store.setManualEvents([
      {
        id: "appointment",
        title: "Fixed appointment",
        userDayDate: "2026-09-17",
        allDay: false,
        startTime: "14:30",
        endTime: "15:30",
        createdAt: at,
        updatedAt: at,
      },
    ]);
    f.generate();
  };
  const trial = () => {
    const state = f.store.getState(),
      original = state.preview!;
    const point = original.result.frictionPoints.find((p) =>
      p.suggestedFixes.some((f) => f.action === "skipBlock"),
    )!;
    const fix = point.suggestedFixes.find((f) => f.action === "skipBlock")!;
    const revised = f.store.applySuggestedFixToPreview({
      selectedFrictionPointId: point.id,
      selectedSuggestedFixId: fix.id,
      revisedAt: at,
    }).preview!;
    const mapped = createPlanDecisionAcceptanceCandidate({
      suggestedFix: fix,
      frictionPoint: point,
      originalPreview: original.result,
      revisedPreview: revised.result,
      authoredSetup: state,
    });
    if (mapped.status !== "supported") throw Error(JSON.stringify(mapped));
    return { original, revised, candidate: mapped.candidate };
  };
  const accept = () => {
    const tried = trial(),
      result = f.store.acceptPlanDecision(tried.candidate);
    if (result.status !== "accepted") throw Error(JSON.stringify(result));
    f.generate();
    return { ...tried, decision: result.decision };
  };
  const materialize = async () => {
    const review = await f.store.queryPlanningReview(f.query),
      snapshot = getReviewSources(review)!;
    return {
      review,
      snapshot,
      result: materializePlanPublication({
        authoredSetup: snapshot.setup,
        preview: snapshot.state.preview,
        goals: snapshot.goals,
        sleepAuthority: snapshot.sleep,
        publicationRange: (await f.command()).publicationRange,
        providers: { now: () => at },
      }),
    };
  };
  return { ...f, pendingResult, addConflict, trial, accept, materialize };
}
