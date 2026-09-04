import type { GoalId, GoalV1 } from "../goals/goal.js";
import {
  resolveUserDayStartForLabel,
  type CanonicalUserDayResolverInput,
} from "../time/canonicalUserDay.js";
import { semanticFingerprint } from "../../infrastructure/restore/restoreStaging.js";
import {
  evaluatePlanningFreshness,
  fingerprintDependencies,
  planningDependencyKind,
  planningRevision,
  validateCanonicalUserDayCoverage,
  type CanonicalUserDayCoverageV1,
  type DependencyFingerprintV1,
  type PlanningDependencyReferenceV1,
  type PlanningFactId,
  type PlanningFreshnessV1,
  type PlanningProvenanceV1,
  type PlanningRevision,
} from "./planningFoundation.js";
import {
  DEMAND_PROJECTION_POLICY,
  validateDemand,
  type DemandCadenceV1,
  type DemandLifecycle,
  type DemandSatisfactionV1,
  type DemandSessionShapeV1,
  type GoalDemandIntentV1,
} from "./goalDemand.js";
import {
  goalDependency,
  type GoalStructureReason,
  type StructuralEligibilityV1,
} from "./goalStructure.js";

export type DemandProjectionReasonV1 =
  | GoalStructureReason
  | { version: 1; code: "demand.lifecycleInapplicable"; lifecycle: DemandLifecycle }
  | { version: 1; code: "demand.goalLifecycleInapplicable"; status: GoalV1["status"] };
export type DemandProjectionV1 = {
  version: 1;
  semanticId: string;
  demandId: PlanningFactId;
  demandRevision: PlanningRevision;
  goalId: GoalId;
  goalRevision: PlanningRevision;
  policy: typeof DEMAND_PROJECTION_POLICY;
  coverage: CanonicalUserDayCoverageV1;
  requestedEffort: { unit: "minutes"; amount: number };
  session: DemandSessionShapeV1;
  satisfaction: DemandSatisfactionV1;
  cadence: DemandCadenceV1;
  structuralEligibility: StructuralEligibilityV1["status"];
  applicability: "applicable" | "conditional" | "inapplicable" | "unknown";
  reasons: DemandProjectionReasonV1[];
  dependencies: PlanningDependencyReferenceV1[];
  dependencyFingerprint: DependencyFingerprintV1;
  provenance: PlanningProvenanceV1;
};

export function demandDependency(value: GoalDemandIntentV1): PlanningDependencyReferenceV1 {
  return {
    version: 1,
    kind: planningDependencyKind("goal.demand"),
    id: value.id,
    revision: value.revision,
  };
}

export function projectDemand(input: {
  demand: GoalDemandIntentV1;
  goal: GoalV1;
  structuralEligibility: StructuralEligibilityV1;
  coverage: CanonicalUserDayCoverageV1;
}): DemandProjectionV1 {
  if (
    !validateDemand(input.demand) ||
    input.demand.goalId !== input.goal.id ||
    input.structuralEligibility.goalId !== input.goal.id
  )
    throw new RangeError("Invalid Demand projection input.");
  if (
    validateCanonicalUserDayCoverage(input.coverage).status === "invalid" ||
    input.coverage.startUserDayDate !== input.demand.horizon.startUserDayDate ||
    input.coverage.endUserDayDateExclusive !== input.demand.horizon.endUserDayDateExclusive
  )
    throw new RangeError("Invalid canonical Demand coverage.");
  const coverage = structuredClone(input.coverage);
  const dependencies = [
    demandDependency(input.demand),
    goalDependency(input.goal),
    ...input.structuralEligibility.dependencies,
  ];
  const reasons: DemandProjectionReasonV1[] = [...input.structuralEligibility.reasons];
  let applicability: DemandProjectionV1["applicability"] =
    input.structuralEligibility.status === "eligible"
      ? "applicable"
      : input.structuralEligibility.status === "conditionallyEligible"
        ? "conditional"
        : input.structuralEligibility.status === "unknown"
          ? "unknown"
          : "inapplicable";
  if (input.demand.lifecycle !== "active") {
    applicability = "inapplicable";
    reasons.push({
      version: 1,
      code: "demand.lifecycleInapplicable",
      lifecycle: input.demand.lifecycle,
    });
  }
  if (input.goal.status !== "active") {
    applicability = input.goal.status === "archived" ? "unknown" : "inapplicable";
    reasons.push({
      version: 1,
      code: "demand.goalLifecycleInapplicable",
      status: input.goal.status,
    });
  }
  const dependencyFingerprint = fingerprintDependencies(dependencies);
  const semantic = {
    version: 1 as const,
    demandId: input.demand.id,
    demandRevision: input.demand.revision,
    goalId: input.goal.id,
    goalRevision: planningRevision(input.goal.revision),
    policy: DEMAND_PROJECTION_POLICY,
    coverage,
    requestedEffort: input.demand.requestedEffort,
    session: input.demand.session,
    satisfaction: input.demand.satisfaction,
    cadence: input.demand.cadence,
    structuralEligibility: input.structuralEligibility.status,
    applicability,
    reasons: [...reasons].sort(reasonCompare),
    dependencyFingerprint,
  };
  return {
    ...structuredClone(semantic),
    semanticId: semanticFingerprint(semantic),
    dependencies: structuredClone(dependencies),
    provenance: {
      version: 1,
      role: "derivedArtifact",
      origin: { kind: "derivedFromDependencies" },
      algorithm: DEMAND_PROJECTION_POLICY,
    },
  };
}

export function projectDemandForUserDayResolver(input: {
  demand: GoalDemandIntentV1;
  goal: GoalV1;
  structuralEligibility: StructuralEligibilityV1;
  resolver: CanonicalUserDayResolverInput;
}) {
  const start = resolveUserDayStartForLabel({
    ...input.resolver,
    userDayDate: input.demand.horizon.startUserDayDate,
  });
  const end = resolveUserDayStartForLabel({
    ...input.resolver,
    userDayDate: input.demand.horizon.endUserDayDateExclusive,
  });
  return projectDemand({
    demand: input.demand,
    goal: input.goal,
    structuralEligibility: input.structuralEligibility,
    coverage: {
      version: 1,
      kind: "canonicalUserDayInterval",
      startUserDayDate: input.demand.horizon.startUserDayDate,
      endUserDayDateExclusive: input.demand.horizon.endUserDayDateExclusive,
      startsAt: start.start.toISOString(),
      endsAt: end.start.toISOString(),
      startDayBoundaryTime: start.dayBoundaryStartTime,
      endDayBoundaryTime: end.dayBoundaryStartTime,
    },
  });
}

export function evaluateDemandProjectionFreshness(
  projection: DemandProjectionV1,
  input?: {
    demand: GoalDemandIntentV1;
    goal: GoalV1;
    structuralEligibility: StructuralEligibilityV1;
  },
): PlanningFreshnessV1 {
  if (!input) return evaluatePlanningFreshness({ dependencyKind: "goal.demandProjection" });
  const current = fingerprintDependencies([
    demandDependency(input.demand),
    goalDependency(input.goal),
    ...input.structuralEligibility.dependencies,
  ]);
  return evaluatePlanningFreshness({
    stored: projection.dependencyFingerprint,
    current,
    dependencyKind: "goal.demandProjection",
  });
}

function reasonCompare(a: DemandProjectionReasonV1, b: DemandProjectionReasonV1) {
  return `${a.code}|${"relationshipId" in a ? a.relationshipId : ""}`.localeCompare(
    `${b.code}|${"relationshipId" in b ? b.relationshipId : ""}`,
  );
}
