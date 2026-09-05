import type { CapacityIntervalV1, CapacityResultV1 } from "./capacity.js";
import type { GoalPriorityV1 } from "./goalDemand.js";
import type { OpportunitySetV1, FeasibleOpportunityV1 } from "./goalFeasibility.js";
import type { CompetingDemandInputV1, CompetingDemandSetV1 } from "./competingDemand.js";
import { capacityFingerprint } from "./capacityFingerprint.js";
import type { PlanningProvenanceV1 } from "./planningFoundation.js";
import type {
  ProjectedResourceClaimV1,
  ProjectedResourceFootprintV1,
} from "./demandResourceFootprint.js";

export const ALLOCATION_POLICY_V1 = {
  id: "goal-allocation",
  version: 1,
  maximumAlternatives: 32,
  tieBreak: "semantic-id",
} as const;
export type AllocationReasonV1 = {
  code:
    | "higherPriorityClaim"
    | "equalPriorityTieBreak"
    | "insufficientNonOverlappingCapacity"
    | "minimumSatisfactionNotMet"
    | "partialSatisfactionApplied"
    | "partialSatisfactionDisallowed"
    | "opportunityConsumed"
    | "sessionConstraint"
    | "fullySatisfied"
    | "noCompatibleOpportunity"
    | "unallocatedNoEligibleDemand"
    | "searchBoundReached";
};
export type ProvisionalSessionPartitionV1 = {
  id: string;
  demandProjectionId: string;
  capacityIntervalId: string;
  opportunityId: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  userDayDate: string;
  sessionIndex: number;
};
export type DemandAllocationV1 = {
  demandProjectionId: string;
  goalId: string;
  requestedMinutes: number;
  attributedMinutes: 0;
  remainingRequestedMinutes: number;
  assignedMinutes: number;
  unmetMinutes: number;
  outcome: "full" | "permittedPartial" | "unsatisfied";
  priorityEvidence: Array<{
    id: string;
    revision: number;
    level: GoalPriorityV1["level"];
    scope: GoalPriorityV1["scope"];
  }>;
  partitions: ProvisionalSessionPartitionV1[];
  resourceFootprints: ProjectedResourceFootprintV1[];
  reasons: AllocationReasonV1[];
};
export type AllocationAlternativeV1 = {
  version: 1;
  id: string;
  competingSetId: string;
  policy: typeof ALLOCATION_POLICY_V1;
  assignments: DemandAllocationV1[];
  claimedMinutes: number;
  productiveMinutes: number;
  supportMinutes: number;
  bufferMinutes: number;
  nominalResourceMinutes: number;
  unionedResourceMinutes: number;
  resourceClaims: ProjectedResourceClaimV1[];
  unallocatedCapacity: Array<{
    capacityIntervalId: string;
    startsAt: string;
    endsAt: string;
    durationMinutes: number;
    userDayDate: string;
  }>;
  reasons: AllocationReasonV1[];
  dependencyFingerprint: string;
  freshness: "current" | "stale";
  provenance: PlanningProvenanceV1;
};
export type AllocationResultV1 = {
  version: 1;
  id: string;
  policy: typeof ALLOCATION_POLICY_V1;
  competingSetId: string;
  capacityFingerprint: string;
  alternatives: AllocationAlternativeV1[];
  preferredAlternativeId?: string;
  search: { examined: number; limit: number; truncated: boolean };
  dependencyFingerprint: string;
  freshness: "current" | "stale";
  provenance: PlanningProvenanceV1;
};

export function allocateCompetingDemandSet(input: {
  set: CompetingDemandSetV1;
  capacity: CapacityResultV1;
  demands: readonly CompetingDemandInputV1[];
}): AllocationResultV1 {
  const members = input.demands
    .filter((item) => input.set.demandProjectionIds.includes(item.demand.semanticId))
    .sort((a, b) => a.demand.semanticId.localeCompare(b.demand.semanticId));
  const alternatives: AllocationAlternativeV1[] = [];
  let examined = 0,
    truncated = false;
  search(0, [], []);
  const ranked = alternatives
      .sort((a, b) => compareAlternatives(a, b))
      .slice(0, ALLOCATION_POLICY_V1.maximumAlternatives),
    dependencyFingerprint = dependencyFor(input.set, input.capacity, members);
  const base = {
    version: 1 as const,
    policy: ALLOCATION_POLICY_V1,
    competingSetId: input.set.id,
    capacityFingerprint: input.capacity.fingerprint,
    alternatives: ranked,
    ...(ranked[0] ? { preferredAlternativeId: ranked[0].id } : {}),
    search: { examined, limit: ALLOCATION_POLICY_V1.maximumAlternatives * 16, truncated },
    dependencyFingerprint,
    freshness: input.set.freshness,
    provenance: derived(),
  };
  return { ...base, id: capacityFingerprint(base) };

  function search(
    index: number,
    selections: Array<{ member: CompetingDemandInputV1; set?: OpportunitySetV1 }>,
    claims: FeasibleOpportunityV1[],
  ) {
    if (examined >= ALLOCATION_POLICY_V1.maximumAlternatives * 16) {
      truncated = true;
      return;
    }
    if (index === members.length) {
      examined++;
      if (!maximal(selections, claims)) return;
      alternatives.push(buildAlternative(input.set, input.capacity, selections, truncated));
      return;
    }
    const member = members[index]!;
    for (const set of member.feasibility.opportunitySets)
      if (
        !set.opportunities.some((claim) => claims.some((used) => opportunityConflict(claim, used)))
      )
        search(index + 1, [...selections, { member, set }], [...claims, ...set.opportunities]);
    search(index + 1, [...selections, { member }], claims);
  }
  function maximal(
    selections: Array<{ member: CompetingDemandInputV1; set?: OpportunitySetV1 }>,
    claims: FeasibleOpportunityV1[],
  ) {
    return !selections.some(
      ({ member, set }) =>
        !set &&
        member.feasibility.opportunitySets.some(
          (candidate) =>
            !candidate.opportunities.some((claim) =>
              claims.some((used) => opportunityConflict(claim, used)),
            ),
        ),
    );
  }
}

export function allocateAllCompetitionSets(input: {
  sets: readonly CompetingDemandSetV1[];
  capacity: CapacityResultV1;
  demands: readonly CompetingDemandInputV1[];
}) {
  const allocations = [...input.sets]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((set) =>
      allocateCompetingDemandSet({ set, capacity: input.capacity, demands: input.demands }),
    );
  return {
    version: 1 as const,
    id: capacityFingerprint({
      policy: ALLOCATION_POLICY_V1,
      allocations: allocations.map((value) => value.id),
    }),
    allocations,
    provenance: derived(),
  };
}
export function resolveAllocationAlternative(result: AllocationResultV1, id: string) {
  const alternative = result.alternatives.find((value) => value.id === id);
  return alternative
    ? { status: "resolved" as const, alternative: structuredClone(alternative) }
    : { status: "notFound" as const };
}
export function evaluateAllocationFreshness(
  result: AllocationResultV1,
  input: {
    set: CompetingDemandSetV1;
    capacity: CapacityResultV1;
    demands: readonly CompetingDemandInputV1[];
  },
) {
  const members = input.demands.filter((item) =>
    input.set.demandProjectionIds.includes(item.demand.semanticId),
  );
  return result.dependencyFingerprint === dependencyFor(input.set, input.capacity, members)
    ? { status: "current" as const }
    : { status: "stale" as const, reasons: [{ code: "dependencyMismatch" as const }] };
}
function buildAlternative(
  set: CompetingDemandSetV1,
  capacity: CapacityResultV1,
  selections: Array<{ member: CompetingDemandInputV1; set?: OpportunitySetV1 }>,
  truncated: boolean,
): AllocationAlternativeV1 {
  const used = selections.flatMap((value) => value.set?.opportunities ?? []),
    assignments = selections.map(({ member, set: selected }) => assignment(member, selected));
  for (const assignmentValue of assignments.filter((value) => value.outcome === "unsatisfied")) {
    const selection = selections.find(
      (value) => value.member.demand.semanticId === assignmentValue.demandProjectionId,
    );
    const blocker = selections.find(
      (value) =>
        value.set &&
        selection?.member.feasibility.opportunitySets.some((candidate) =>
          candidate.opportunities.some((claim) =>
            value.set!.opportunities.some((usedClaim) => opportunityConflict(claim, usedClaim)),
          ),
        ),
    );
    if (blocker?.set) {
      const date = blocker.set.opportunities[0]!.userDayDate,
        blockedPriority = priorityAt(assignmentValue.priorityEvidence, date),
        blockerAssignment = assignments.find(
          (value) => value.demandProjectionId === blocker.member.demand.semanticId,
        )!,
        blockerPriority = priorityAt(blockerAssignment.priorityEvidence, date);
      assignmentValue.reasons = [
        {
          code:
            priorityRank(blockerPriority) > priorityRank(blockedPriority)
              ? "higherPriorityClaim"
              : "equalPriorityTieBreak",
        },
      ];
    }
  }
  const resourceClaims = used.flatMap((value) => allClaims(value.resourceFootprint)),
    productiveMinutes = resourceClaims
      .filter((value) => value.role === "productive")
      .reduce((sum, value) => sum + value.durationMinutes, 0),
    supportMinutes = resourceClaims
      .filter((value) => value.role === "supportActivity")
      .reduce((sum, value) => sum + value.durationMinutes, 0),
    bufferMinutes = resourceClaims
      .filter((value) => value.role === "bufferProtection")
      .reduce((sum, value) => sum + value.durationMinutes, 0),
    unionedResourceMinutes = unionMinutes(resourceClaims),
    unallocatedCapacity = capacity.intervals
      .filter((item) => item.allocability === "allocatable")
      .flatMap((item) => subtract(item, resourceClaims));
  const semantic = {
    set: set.id,
    policy: ALLOCATION_POLICY_V1,
    assignments: assignments.map((item) => [
      item.demandProjectionId,
      item.partitions.map((value) => value.id),
      item.outcome,
    ]),
    unallocatedCapacity,
    resourceClaims: resourceClaims.map((value) => value.id).sort(),
    productiveMinutes,
    supportMinutes,
    bufferMinutes,
    unionedResourceMinutes,
  };
  const dependencyFingerprint = capacityFingerprint(semantic),
    reasons: AllocationReasonV1[] = [
      ...(unallocatedCapacity.length ? [{ code: "unallocatedNoEligibleDemand" as const }] : []),
      ...(truncated ? [{ code: "searchBoundReached" as const }] : []),
    ];
  return {
    version: 1,
    id: capacityFingerprint({ ...semantic, dependencyFingerprint }),
    competingSetId: set.id,
    policy: ALLOCATION_POLICY_V1,
    assignments,
    claimedMinutes: assignments.reduce((sum, item) => sum + item.assignedMinutes, 0),
    productiveMinutes,
    supportMinutes,
    bufferMinutes,
    nominalResourceMinutes: productiveMinutes + supportMinutes + bufferMinutes,
    unionedResourceMinutes,
    resourceClaims: structuredClone(resourceClaims).sort(resourceClaimCompare),
    unallocatedCapacity,
    reasons,
    dependencyFingerprint,
    freshness: set.freshness,
    provenance: derived(),
  };
}
function assignment(
  member: CompetingDemandInputV1,
  selected?: OpportunitySetV1,
): DemandAllocationV1 {
  const requested = member.demand.requestedEffort.amount,
    assigned = selected?.totalCompatibleMinutes ?? 0,
    outcome = assigned >= requested ? "full" : assigned > 0 ? "permittedPartial" : "unsatisfied";
  const reasons: AllocationReasonV1[] =
    outcome === "full"
      ? [{ code: "fullySatisfied" }]
      : outcome === "permittedPartial"
        ? [{ code: "partialSatisfactionApplied" }]
        : [
            {
              code: member.feasibility.opportunitySets.length
                ? "opportunityConsumed"
                : "noCompatibleOpportunity",
            },
          ];
  return {
    demandProjectionId: member.demand.semanticId,
    goalId: member.demand.goalId,
    requestedMinutes: requested,
    attributedMinutes: 0,
    remainingRequestedMinutes: requested,
    assignedMinutes: assigned,
    unmetMinutes: Math.max(0, requested - assigned),
    outcome,
    priorityEvidence: member.priorities
      .map((value) => ({
        id: value.id,
        revision: value.revision,
        level: value.level,
        scope: structuredClone(value.scope),
      }))
      .sort((a, b) => `${a.id}|${a.revision}`.localeCompare(`${b.id}|${b.revision}`)),
    partitions: (selected?.opportunities ?? []).map((item, index) => ({
      id: capacityFingerprint({ demand: member.demand.semanticId, opportunity: item.id, index }),
      demandProjectionId: member.demand.semanticId,
      capacityIntervalId: item.capacityIntervalId,
      opportunityId: item.id,
      startsAt: item.startsAt,
      endsAt: item.endsAt,
      durationMinutes: item.durationMinutes,
      userDayDate: item.userDayDate,
      sessionIndex: index,
    })),
    resourceFootprints: structuredClone(
      (selected?.opportunities ?? []).map((item) => item.resourceFootprint),
    ).sort((a, b) => a.id.localeCompare(b.id)),
    reasons,
  };
}
function compareAlternatives(a: AllocationAlternativeV1, b: AllocationAlternativeV1) {
  const scoreA = score(a),
    scoreB = score(b);
  for (let index = 0; index < scoreA.length; index++)
    if (scoreA[index] !== scoreB[index]) return scoreB[index]! - scoreA[index]!;
  const tieA = tieSignature(a),
    tieB = tieSignature(b);
  if (tieA !== tieB) return tieA.localeCompare(tieB);
  return a.id.localeCompare(b.id);
}
function tieSignature(value: AllocationAlternativeV1) {
  return [...value.assignments]
    .sort((a, b) => a.demandProjectionId.localeCompare(b.demandProjectionId))
    .map(
      (item) =>
        `${item.outcome === "full" ? 0 : item.outcome === "permittedPartial" ? 1 : 2}:${item.demandProjectionId}`,
    )
    .join("|");
}
function score(value: AllocationAlternativeV1) {
  const priority = ["critical", "high", "normal", "low"] as const;
  return [
    ...priority.map((level) =>
      value.assignments.reduce(
        (sum, assignment) =>
          sum +
          assignment.partitions
            .filter((part) => priorityAt(assignment.priorityEvidence, part.userDayDate) === level)
            .reduce((total, part) => total + part.durationMinutes, 0),
        0,
      ),
    ),
    value.assignments.filter((item) => item.outcome === "full").length,
    value.assignments.filter((item) => item.outcome === "permittedPartial").length,
    value.claimedMinutes,
    -value.assignments.reduce((sum, item) => sum + item.partitions.length, 0),
  ];
}
function priorityAt(values: DemandAllocationV1["priorityEvidence"], date: string) {
  const bounded = values.find(
    (item) =>
      item.scope.kind === "userDayInterval" &&
      item.scope.startUserDayDate <= date &&
      date < item.scope.endUserDayDateExclusive,
  );
  return (bounded ?? values.find((item) => item.scope.kind === "default"))?.level ?? "normal";
}
function priorityRank(value: GoalPriorityV1["level"]) {
  return { low: 0, normal: 1, high: 2, critical: 3 }[value];
}
function dependencyFor(
  set: CompetingDemandSetV1,
  capacity: CapacityResultV1,
  members: readonly CompetingDemandInputV1[],
) {
  return capacityFingerprint({
    policy: ALLOCATION_POLICY_V1,
    set: set.id,
    capacity: capacity.fingerprint,
    demands: members
      .slice()
      .sort((left, right) => left.demand.semanticId.localeCompare(right.demand.semanticId))
      .map((item) => [
        item.demand.semanticId,
        item.feasibility.id,
        item.priorities
          .map((value) => [value.id, value.revision] as const)
          .sort(([left], [right]) => left.localeCompare(right)),
      ]),
  });
}
function subtract(interval: CapacityIntervalV1, used: ProjectedResourceClaimV1[]) {
  const claims = used
    .filter((item) => item.capacityIntervalId === interval.id)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  let cursor = interval.startsAt;
  const output: AllocationAlternativeV1["unallocatedCapacity"] = [];
  for (const claim of claims) {
    if (cursor < claim.startsAt) output.push(part(interval, cursor, claim.startsAt));
    if (claim.endsAt > cursor) cursor = claim.endsAt;
  }
  if (cursor < interval.endsAt) output.push(part(interval, cursor, interval.endsAt));
  return output;
}
function allClaims(value: ProjectedResourceFootprintV1) {
  return [...value.productiveClaims, ...value.supportClaims, ...value.bufferClaims];
}
function opportunityConflict(left: FeasibleOpportunityV1, right: FeasibleOpportunityV1) {
  return allClaims(left.resourceFootprint).some((a) =>
    allClaims(right.resourceFootprint).some(
      (b) => !(a.role === "bufferProtection" && b.role === "bufferProtection") && overlap(a, b),
    ),
  );
}
function unionMinutes(values: ProjectedResourceClaimV1[]) {
  const sorted = values
    .map((value) => [Date.parse(value.startsAt), Date.parse(value.endsAt)] as const)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let result = 0,
    start: number | undefined,
    end: number | undefined;
  for (const value of sorted) {
    if (start === undefined) [start, end] = value;
    else if (value[0] <= end!) end = Math.max(end!, value[1]);
    else {
      result += (end! - start) / 60_000;
      [start, end] = value;
    }
  }
  return start === undefined ? 0 : result + (end! - start) / 60_000;
}
function resourceClaimCompare(a: ProjectedResourceClaimV1, b: ProjectedResourceClaimV1) {
  return `${a.startsAt}|${a.endsAt}|${a.role}|${a.id}`.localeCompare(
    `${b.startsAt}|${b.endsAt}|${b.role}|${b.id}`,
  );
}
function part(interval: CapacityIntervalV1, startsAt: string, endsAt: string) {
  return {
    capacityIntervalId: interval.id,
    startsAt,
    endsAt,
    durationMinutes: (Date.parse(endsAt) - Date.parse(startsAt)) / 60_000,
    userDayDate: interval.userDayDate,
  };
}
function overlap(a: { startsAt: string; endsAt: string }, b: { startsAt: string; endsAt: string }) {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}
function derived(): PlanningProvenanceV1 {
  return {
    version: 1,
    role: "derivedArtifact",
    origin: { kind: "derivedFromDependencies" },
    algorithm: { id: ALLOCATION_POLICY_V1.id, version: 1 },
  };
}
