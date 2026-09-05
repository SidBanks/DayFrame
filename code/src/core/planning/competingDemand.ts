import type { GoalPriorityV1 } from "./goalDemand.js";
import type { DemandProjectionV1 } from "./goalDemandProjection.js";
import type { GoalFeasibilityResultV1, FeasibleOpportunityV1 } from "./goalFeasibility.js";
import type { CapacityResultV1 } from "./capacity.js";
import type { PlanningProvenanceV1 } from "./planningFoundation.js";
import { capacityFingerprint } from "./capacityFingerprint.js";
import type { ProjectedResourceRoleV1 } from "./demandResourceFootprint.js";

export const COMPETITION_POLICY_V1 = { id: "competing-demand", version: 1 } as const;
export type CompetingDemandInputV1 = {
  demand: DemandProjectionV1;
  feasibility: GoalFeasibilityResultV1;
  priorities: GoalPriorityV1[];
};
export type CompetitionClaimV1 = {
  id: string;
  role: ProjectedResourceRoleV1;
  demandProjectionId: string;
  goalId: string;
  opportunityId: string;
  capacityIntervalId: string;
  startsAt: string;
  endsAt: string;
  userDayDate: string;
};
export type CompetitionEdgeV1 = {
  leftDemandProjectionId: string;
  rightDemandProjectionId: string;
  overlappingClaimPairs: Array<{ leftOpportunityId: string; rightOpportunityId: string }>;
};
export type CompetingDemandSetV1 = {
  version: 1;
  id: string;
  policy: typeof COMPETITION_POLICY_V1;
  horizon: CapacityResultV1["query"];
  capacityFingerprint: string;
  demandProjectionIds: string[];
  goalIds: string[];
  feasibilityIds: string[];
  priorityReferences: Array<{ id: string; revision: number; goalId: string }>;
  claims: CompetitionClaimV1[];
  edges: CompetitionEdgeV1[];
  kind: "singleton" | "competing";
  freshness: "current" | "stale";
  coverage: "complete" | "unavailable";
  reasons: Array<{
    code: "staleInput" | "incompatibleCapacity" | "noClaim";
    demandProjectionId?: string;
  }>;
  dependencyFingerprint: string;
  provenance: PlanningProvenanceV1;
};
export type CompetingDemandResultV1 = {
  version: 1;
  id: string;
  policy: typeof COMPETITION_POLICY_V1;
  capacityFingerprint: string;
  horizon: CapacityResultV1["query"];
  sets: CompetingDemandSetV1[];
  noncompetitive: Array<{ demandProjectionId: string; reason: "noClaim" | "ineligibleInput" }>;
  dependencyFingerprint: string;
  provenance: PlanningProvenanceV1;
};

export function deriveCompetingDemandSets(input: {
  capacity: CapacityResultV1;
  demands: readonly CompetingDemandInputV1[];
  evaluationCutoff: string;
}): CompetingDemandResultV1 {
  const eligible: Array<{ input: CompetingDemandInputV1; claims: CompetitionClaimV1[] }> = [],
    noncompetitive: CompetingDemandResultV1["noncompetitive"] = [];
  for (const item of [...input.demands].sort((a, b) =>
    a.demand.semanticId.localeCompare(b.demand.semanticId),
  )) {
    const compatible =
      item.feasibility.capacityFingerprint === input.capacity.fingerprint &&
      !["unknown", "stale", "unavailableCoverage", "structurallyIneligible", "infeasible"].includes(
        item.feasibility.classification,
      );
    const claims = compatible ? claimsFor(item) : [];
    if (claims.length) eligible.push({ input: item, claims });
    else
      noncompetitive.push({
        demandProjectionId: item.demand.semanticId,
        reason: compatible ? "noClaim" : "ineligibleInput",
      });
  }
  const edges = allEdges(eligible),
    components = connectedComponents(
      eligible.map((item) => item.input.demand.semanticId),
      edges,
    ),
    sets = components.map((ids) =>
      buildSet(ids, eligible, edges, input.capacity, input.evaluationCutoff),
    );
  const dependencyFingerprint = capacityFingerprint({
    policy: COMPETITION_POLICY_V1,
    cutoff: input.evaluationCutoff,
    capacity: input.capacity.fingerprint,
    demands: input.demands
      .map((item) => [
        item.demand.semanticId,
        item.feasibility.id,
        item.priorities
          .map((value) => [value.id, value.revision] as const)
          .sort(([left], [right]) => left.localeCompare(right)),
      ])
      .sort(),
  });
  const base = {
    version: 1 as const,
    policy: COMPETITION_POLICY_V1,
    capacityFingerprint: input.capacity.fingerprint,
    horizon: structuredClone(input.capacity.query),
    sets,
    noncompetitive,
    dependencyFingerprint,
    provenance: derived(COMPETITION_POLICY_V1),
  };
  return { ...base, id: capacityFingerprint(base) };
}

export function resolveCompetingDemandSet(result: CompetingDemandResultV1, id: string) {
  const set = result.sets.find((value) => value.id === id);
  return set
    ? { status: "resolved" as const, set: structuredClone(set) }
    : { status: "notFound" as const };
}
function claimsFor(item: CompetingDemandInputV1) {
  const values = item.feasibility.opportunitySets
    .flatMap((set) => set.opportunities)
    .flatMap((value) =>
      [
        ...value.resourceFootprint.productiveClaims,
        ...value.resourceFootprint.supportClaims,
        ...value.resourceFootprint.bufferClaims,
      ].map((resource) => claim(item, value, resource)),
    );
  return [...new Map(values.map((value) => [value.id, value])).values()].sort(claimCompare);
}
function claim(
  item: CompetingDemandInputV1,
  value: FeasibleOpportunityV1,
  resource: FeasibleOpportunityV1["resourceFootprint"]["productiveClaims"][number],
): CompetitionClaimV1 {
  return {
    id: resource.id,
    role: resource.role,
    demandProjectionId: item.demand.semanticId,
    goalId: item.demand.goalId,
    opportunityId: value.id,
    capacityIntervalId: resource.capacityIntervalId,
    startsAt: resource.startsAt,
    endsAt: resource.endsAt,
    userDayDate: resource.userDayDate,
  };
}
function allEdges(values: Array<{ input: CompetingDemandInputV1; claims: CompetitionClaimV1[] }>) {
  const edges: CompetitionEdgeV1[] = [];
  for (let left = 0; left < values.length; left++)
    for (let right = left + 1; right < values.length; right++) {
      const pairs = values[left]!.claims.flatMap((a) =>
        values[right]!.claims.filter(
          (b) => !(a.role === "bufferProtection" && b.role === "bufferProtection") && overlap(a, b),
        ).map((b) => ({
          leftOpportunityId: a.opportunityId,
          rightOpportunityId: b.opportunityId,
        })),
      );
      if (pairs.length)
        edges.push({
          leftDemandProjectionId: values[left]!.input.demand.semanticId,
          rightDemandProjectionId: values[right]!.input.demand.semanticId,
          overlappingClaimPairs: pairs.sort((a, b) =>
            `${a.leftOpportunityId}|${a.rightOpportunityId}`.localeCompare(
              `${b.leftOpportunityId}|${b.rightOpportunityId}`,
            ),
          ),
        });
    }
  return edges;
}
function connectedComponents(ids: string[], edges: CompetitionEdgeV1[]) {
  const unseen = new Set(ids),
    output: string[][] = [];
  while (unseen.size) {
    const root = [...unseen].sort()[0]!,
      queue = [root],
      component: string[] = [];
    unseen.delete(root);
    while (queue.length) {
      const current = queue.shift()!;
      component.push(current);
      for (const edge of edges) {
        const next =
          edge.leftDemandProjectionId === current
            ? edge.rightDemandProjectionId
            : edge.rightDemandProjectionId === current
              ? edge.leftDemandProjectionId
              : undefined;
        if (next && unseen.delete(next)) queue.push(next);
      }
    }
    output.push(component.sort());
  }
  return output.sort((a, b) => a[0]!.localeCompare(b[0]!));
}
function buildSet(
  ids: string[],
  values: Array<{ input: CompetingDemandInputV1; claims: CompetitionClaimV1[] }>,
  edges: CompetitionEdgeV1[],
  capacity: CapacityResultV1,
  evaluationCutoff: string,
): CompetingDemandSetV1 {
  const members = values.filter((item) => ids.includes(item.input.demand.semanticId)),
    claims = members.flatMap((item) => item.claims).sort(claimCompare),
    memberEdges = edges.filter(
      (edge) =>
        ids.includes(edge.leftDemandProjectionId) && ids.includes(edge.rightDemandProjectionId),
    );
  const refs = members
    .flatMap((item) =>
      item.input.priorities.map((value) => ({
        id: value.id,
        revision: value.revision,
        goalId: value.goalId,
      })),
    )
    .sort((a, b) => `${a.id}|${a.revision}`.localeCompare(`${b.id}|${b.revision}`));
  const semantic = {
    policy: COMPETITION_POLICY_V1,
    capacity: capacity.fingerprint,
    horizon: capacity.query,
    demands: ids,
    feasibility: members.map((item) => item.input.feasibility.id).sort(),
    refs,
    edges: memberEdges,
    evaluationCutoff,
  };
  const dependencyFingerprint = capacityFingerprint(semantic);
  return {
    version: 1,
    id: capacityFingerprint({ ...semantic, dependencyFingerprint }),
    policy: COMPETITION_POLICY_V1,
    horizon: structuredClone(capacity.query),
    capacityFingerprint: capacity.fingerprint,
    demandProjectionIds: ids,
    goalIds: [...new Set(members.map((item) => item.input.demand.goalId))].sort(),
    feasibilityIds: members.map((item) => item.input.feasibility.id).sort(),
    priorityReferences: refs,
    claims,
    edges: memberEdges,
    kind: ids.length === 1 ? "singleton" : "competing",
    freshness: capacity.qualification.freshness,
    coverage: capacity.qualification.coverage === "complete" ? "complete" : "unavailable",
    reasons: [],
    dependencyFingerprint,
    provenance: derived(COMPETITION_POLICY_V1),
  };
}
function overlap(a: { startsAt: string; endsAt: string }, b: { startsAt: string; endsAt: string }) {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}
function claimCompare(a: CompetitionClaimV1, b: CompetitionClaimV1) {
  return `${a.startsAt}|${a.endsAt}|${a.role}|${a.demandProjectionId}|${a.id}`.localeCompare(
    `${b.startsAt}|${b.endsAt}|${b.role}|${b.demandProjectionId}|${b.id}`,
  );
}
function derived(policy: { id: string; version: number }): PlanningProvenanceV1 {
  return {
    version: 1,
    role: "derivedArtifact",
    origin: { kind: "derivedFromDependencies" },
    algorithm: policy,
  };
}
