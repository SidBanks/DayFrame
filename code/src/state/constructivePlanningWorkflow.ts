import type { DayFrameStore } from "./types.js";
import type { LocalDateString } from "../core/shifts/types.js";
import type { PlanningFactId } from "../core/planning/planningFoundation.js";
import { validateCanonicalUserDayRange } from "../core/planning/planningScope.js";

export type ConstructivePlanningStore = Pick<
  DayFrameStore,
  "evaluateCompetingAllocation" | "deriveProposal" | "recordProposal"
>;

/** Application orchestration only: all geometry, eligibility and ranking remain canonical. */
export async function evaluatePlanningRequest(
  store: ConstructivePlanningStore,
  input: {
    demandId: PlanningFactId;
    startUserDayDate: LocalDateString;
    endUserDayDateExclusive: LocalDateString;
    evaluationCutoff: string;
  },
) {
  if (validateCanonicalUserDayRange(input).status === "invalid")
    return { status: "invalidHorizon" as const };
  const evaluation = await store.evaluateCompetingAllocation(input);
  if (evaluation.status !== "evaluated") return evaluation;
  if (evaluation.capacity.foundation?.status === "nonAllocatable")
    return {
      status: "blocked" as const,
      reason: "sleepFoundationNonAllocatable" as const,
      foundation: evaluation.capacity.foundation,
    };
  const selected = evaluation.demands.find((item) => item.demand.demandId === input.demandId);
  if (!selected) return { status: "demandUnavailable" as const, evaluation };
  const allocations = evaluation.allocation.allocations.filter((allocation) =>
    evaluation.competition.sets.some(
      (set) =>
        set.id === allocation.competingSetId &&
        set.demandProjectionIds.includes(selected.demand.semanticId),
    ),
  );
  const outcomes = [];
  for (const allocation of allocations) {
    const horizon = {
      startUserDayDate: input.startUserDayDate,
      endUserDayDateExclusive: input.endUserDayDateExclusive,
    };
    const result = await store.deriveProposal({
      allocation,
      horizon,
      allocationHorizon: horizon,
      generatedAt: input.evaluationCutoff,
      evaluationCutoff: input.evaluationCutoff,
    });
    const recording = result.status === "proposed" ? await store.recordProposal(result) : undefined;
    outcomes.push({ result, recording });
  }
  // No eligible competing set is itself a typed canonical abstention. Do not invent
  // an Allocation or a durable Proposal to feed the derivation function.
  return { status: "evaluated" as const, evaluation, selected, outcomes };
}
export type PlanningRequestResult = Awaited<ReturnType<typeof evaluatePlanningRequest>>;
