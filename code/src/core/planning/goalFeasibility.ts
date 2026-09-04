import { capacityFingerprint as semanticFingerprint } from "./capacityFingerprint.js";
import type { DemandProjectionV1 } from "./goalDemandProjection.js";
import type { CapacityIntervalV1, CapacityResultV1 } from "./capacity.js";
import type { PlanningProvenanceV1 } from "./planningFoundation.js";

export const GOAL_FEASIBILITY_POLICY_V1 = {
  id: "goal-specific-feasibility",
  version: 1,
  maximumOpportunitySets: 64,
} as const;
export type FeasibilityReasonV1 = {
  code:
    | "insufficientTotalDuration"
    | "insufficientContiguousDuration"
    | "sessionCountMismatch"
    | "partialBelowMinimum"
    | "structurallyIneligible"
    | "conditionalStructuralEligibility"
    | "staleCapacity"
    | "incompleteCapacityCoverage"
    | "unresolvedCapacityLiability"
    | "capacityUnavailable"
    | "demandInapplicable";
};
export type FeasibleOpportunityV1 = {
  id: string;
  capacityIntervalId: string;
  capacityFingerprint: string;
  demandProjectionId: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  userDayDate: CapacityIntervalV1["userDayDate"];
  hardConstraintCompatibility: "compatible";
  preference: "preferredDuration" | "neutral";
};
export type OpportunitySetV1 = {
  id: string;
  opportunities: FeasibleOpportunityV1[];
  totalCompatibleMinutes: number;
  sessionCount: number;
  satisfaction: "full" | "permittedPartial";
  unmetMinutes: number;
};
export type GoalFeasibilityResultV1 = {
  version: 1;
  id: string;
  policy: typeof GOAL_FEASIBILITY_POLICY_V1;
  demandProjectionId: string;
  capacityFingerprint: string;
  classification:
    | "feasible"
    | "partiallyFeasible"
    | "infeasible"
    | "structurallyIneligible"
    | "conditionallyEligible"
    | "unknown"
    | "stale"
    | "unavailableCoverage";
  opportunitySets: OpportunitySetV1[];
  compatibleMinutes: number;
  unsatisfiedMinutes: number;
  reasons: FeasibilityReasonV1[];
  coverage: CapacityResultV1["query"];
  dependencyFingerprint: string;
  provenance: PlanningProvenanceV1;
};

export function evaluateGoalFeasibility(input: {
  demand: DemandProjectionV1;
  capacity: CapacityResultV1;
}): GoalFeasibilityResultV1 {
  const demand = input.demand,
    capacity = input.capacity,
    reason: FeasibilityReasonV1[] = [];
  let terminal: GoalFeasibilityResultV1["classification"] | undefined;
  if (
    demand.coverage.startUserDayDate !== capacity.query.startUserDayDate ||
    demand.coverage.endUserDayDateExclusive !== capacity.query.endUserDayDateExclusive ||
    demand.coverage.startsAt !== capacity.query.requestedStartsAt ||
    demand.coverage.endsAt !== capacity.query.requestedEndsAt ||
    capacity.qualification.coverage !== "complete"
  ) {
    terminal = "unavailableCoverage";
    reason.push({ code: "incompleteCapacityCoverage" });
  } else if (capacity.qualification.integrity !== "valid") {
    terminal = "unknown";
    reason.push({ code: "capacityUnavailable" });
  } else if (capacity.qualification.freshness !== "current") {
    terminal = "stale";
    reason.push({ code: "staleCapacity" });
  } else if (demand.structuralEligibility === "ineligible") {
    terminal = "structurallyIneligible";
    reason.push({ code: "structurallyIneligible" });
  } else if (demand.structuralEligibility === "unknown" || demand.applicability === "unknown") {
    terminal = "unknown";
  } else if (demand.applicability === "inapplicable") {
    terminal = "infeasible";
    reason.push({ code: "demandInapplicable" });
  }
  if (capacity.qualification.liability === "unresolved")
    reason.push({ code: "unresolvedCapacityLiability" });
  const usable = capacity.intervals.filter(
    (item) => item.allocability === "allocatable" && item.coverage === "complete",
  );
  const sets = terminal ? [] : enumerateSets(demand, capacity, usable);
  const requested = demand.requestedEffort.amount,
    compatible = Math.max(0, ...sets.map((item) => item.totalCompatibleMinutes));
  if (!terminal && demand.structuralEligibility === "conditionallyEligible") {
    terminal = "conditionallyEligible";
    reason.push({ code: "conditionalStructuralEligibility" });
  }
  if (!terminal) {
    const full = sets.some((item) => item.satisfaction === "full"),
      partial = sets.some((item) => item.satisfaction === "permittedPartial");
    terminal = full ? "feasible" : partial ? "partiallyFeasible" : "infeasible";
    if (!full && !partial) {
      reason.push({
        code:
          demand.session.mode === "indivisible"
            ? "insufficientContiguousDuration"
            : demand.cadence.kind === "sessionCount"
              ? "sessionCountMismatch"
              : "insufficientTotalDuration",
      });
    }
  }
  const dependencyFingerprint = semanticFingerprint({
    policy: GOAL_FEASIBILITY_POLICY_V1,
    demand: demand.semanticId,
    capacity: capacity.fingerprint,
  });
  const base = {
    version: 1 as const,
    policy: GOAL_FEASIBILITY_POLICY_V1,
    demandProjectionId: demand.semanticId,
    capacityFingerprint: capacity.fingerprint,
    classification: terminal,
    opportunitySets: sets,
    compatibleMinutes: compatible,
    unsatisfiedMinutes: Math.max(0, requested - compatible),
    reasons: reason,
    coverage: structuredClone(capacity.query),
    dependencyFingerprint,
    provenance: {
      version: 1 as const,
      role: "derivedArtifact" as const,
      origin: { kind: "derivedFromDependencies" as const },
      algorithm: { id: GOAL_FEASIBILITY_POLICY_V1.id, version: 1 },
    },
  };
  return { ...base, id: semanticFingerprint(base) };
}

function enumerateSets(
  demand: DemandProjectionV1,
  capacity: CapacityResultV1,
  intervals: CapacityIntervalV1[],
) {
  const requested = demand.requestedEffort.amount;
  if (demand.session.mode === "indivisible") {
    const exactMinutes = demand.session.exactMinutes;
    return intervals
      .filter((item) => item.durationMinutes >= exactMinutes)
      .slice(0, GOAL_FEASIBILITY_POLICY_V1.maximumOpportunitySets)
      .map((item) =>
        makeSet(demand, capacity, [slice(item, exactMinutes, demand, capacity)], requested),
      );
  }
  const output: OpportunitySetV1[] = [];
  for (
    let offset = 0;
    offset < intervals.length && output.length < GOAL_FEASIBILITY_POLICY_V1.maximumOpportunitySets;
    offset++
  ) {
    let remaining = requested;
    const slices: FeasibleOpportunityV1[] = [];
    for (const item of [...intervals.slice(offset), ...intervals.slice(0, offset)]) {
      if (remaining < demand.session.minimumMinutes) break;
      const amount = Math.min(
        remaining,
        item.durationMinutes,
        demand.session.maximumMinutes ?? remaining,
      );
      if (amount < demand.session.minimumMinutes) continue;
      slices.push(slice(item, amount, demand, capacity));
      remaining -= amount;
      if (remaining === 0) break;
      if (demand.cadence.kind === "sessionCount" && slices.length === demand.cadence.count) break;
    }
    if (demand.cadence.kind === "sessionCount" && slices.length !== demand.cadence.count) continue;
    const total = slices.reduce((sum, item) => sum + item.durationMinutes, 0),
      minimum = demand.satisfaction.allowPartial
        ? demand.satisfaction.minimumSatisfiedMinutes
        : requested;
    if (total >= minimum) output.push(makeSet(demand, capacity, slices, requested));
  }
  return [...new Map(output.map((item) => [item.id, item])).values()].sort((a, b) =>
    a.id.localeCompare(b.id),
  );
}
function slice(
  interval: CapacityIntervalV1,
  amount: number,
  demand: DemandProjectionV1,
  capacity: CapacityResultV1,
): FeasibleOpportunityV1 {
  const endsAt = new Date(Date.parse(interval.startsAt) + amount * 60_000).toISOString();
  const semantic = {
    capacityIntervalId: interval.id,
    demandProjectionId: demand.semanticId,
    startsAt: interval.startsAt,
    endsAt,
  };
  return {
    id: semanticFingerprint({ policy: GOAL_FEASIBILITY_POLICY_V1, ...semantic }),
    ...semantic,
    capacityFingerprint: capacity.fingerprint,
    durationMinutes: amount,
    userDayDate: interval.userDayDate,
    hardConstraintCompatibility: "compatible",
    preference:
      demand.session.mode === "splittable" && demand.session.preferredMinutes === amount
        ? "preferredDuration"
        : "neutral",
  };
}
function makeSet(
  demand: DemandProjectionV1,
  capacity: CapacityResultV1,
  opportunities: FeasibleOpportunityV1[],
  requested: number,
): OpportunitySetV1 {
  const total = opportunities.reduce((sum, item) => sum + item.durationMinutes, 0),
    semantic = {
      demand: demand.semanticId,
      capacity: capacity.fingerprint,
      opportunities: opportunities.map((item) => item.id),
    };
  return {
    id: semanticFingerprint({ policy: GOAL_FEASIBILITY_POLICY_V1, ...semantic }),
    opportunities,
    totalCompatibleMinutes: total,
    sessionCount: opportunities.length,
    satisfaction: total >= requested ? "full" : "permittedPartial",
    unmetMinutes: Math.max(0, requested - total),
  };
}
