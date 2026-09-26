import type { GoalId, GoalV1 } from "../goals/goal.js";
import { semanticFingerprint } from "../../infrastructure/restore/restoreStaging.js";
import { fingerprintDependencies } from "./planningFoundation.js";
import {
  queryStructuralEligibility,
  type GoalStructureAuthorityV1,
  type GoalStructureRelationshipV1,
  type StructuralEligibilityV1,
} from "./goalStructure.js";

export type TemporalIssue = {
  id: string;
  revision: number;
  reason: "invertedInterval" | "commandTimeOrder" | "lifecycleTimeOrder";
};
export function qualifyGoalStructure(authority: GoalStructureAuthorityV1) {
  const issues: TemporalIssue[] = [];
  for (const rows of [authority.relationships, authority.milestones]) {
    const previous = new Map<string, string>();
    for (const row of [...rows].sort(
      (a, b) => a.id.localeCompare(b.id) || a.revision - b.revision,
    )) {
      if (row.updatedAt < row.createdAt || (previous.get(row.id) ?? "") > row.updatedAt)
        issues.push({ id: row.id, revision: row.revision, reason: "commandTimeOrder" });
      previous.set(row.id, row.updatedAt);
      if (
        "effectiveFrom" in row &&
        row.effectiveTo !== undefined &&
        row.effectiveTo < row.effectiveFrom
      )
        issues.push({ id: row.id, revision: row.revision, reason: "invertedInterval" });
      if (
        "state" in row &&
        [row.satisfiedAt, row.retiredAt].some(
          (t) => t !== undefined && (t < row.createdAt || t > row.updatedAt),
        )
      )
        issues.push({ id: row.id, revision: row.revision, reason: "lifecycleTimeOrder" });
    }
  }
  return { status: issues.length ? ("protected" as const) : ("qualified" as const), issues };
}
export function structureCommandTime(
  authority: GoalStructureAuthorityV1,
  now: string,
  start?: string,
) {
  if (!validInstant(now)) return "invalidClock";
  if (
    [...authority.relationships, ...authority.milestones].some(
      (row) => now < row.createdAt || now < row.updatedAt,
    )
  )
    return "clockBeforeRecordedAuthority";
  if (start !== undefined && now < start) return "retirementBeforeEffectiveStart";
}
function validInstant(value: string) {
  return !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value;
}
export function relationshipApplicability(row: GoalStructureRelationshipV1, at: string) {
  const intervalPosition =
    row.effectiveTo !== undefined && row.effectiveTo < row.effectiveFrom
      ? "unknown"
      : row.effectiveTo === row.effectiveFrom
        ? "empty"
        : at < row.effectiveFrom
          ? "beforeStart"
          : row.effectiveTo !== undefined && at >= row.effectiveTo
            ? "atOrAfterEnd"
            : "inside";
  const applicability =
    intervalPosition === "unknown"
      ? "unknown"
      : row.status === "active" && intervalPosition === "inside"
        ? "applicable"
        : "notApplicable";
  return {
    id: row.id,
    revision: row.revision,
    status: row.status,
    effectiveFrom: row.effectiveFrom,
    ...(row.effectiveTo === undefined ? {} : { effectiveTo: row.effectiveTo }),
    intervalPosition,
    applicability,
    reason:
      intervalPosition === "unknown"
        ? "temporalAnomaly"
        : row.status === "retired"
          ? "retired"
          : intervalPosition === "inside"
            ? "activeInterval"
            : intervalPosition === "empty"
              ? "emptyInterval"
              : intervalPosition === "atOrAfterEnd"
                ? "ended"
                : intervalPosition,
  };
}
export type StructureEvaluationInput = {
  goalId: GoalId;
  evaluationInstant: string;
  basis: "currentAuthority";
};
export function evaluateGoalStructure(
  input: StructureEvaluationInput,
  authority: GoalStructureAuthorityV1,
  goals: GoalV1[],
  availability: "accepted" | "initializing" | "protected" = "accepted",
) {
  if (input.basis !== "currentAuthority")
    return {
      status: "unavailable" as const,
      reason: "historicalReconstructionUnsupported" as const,
    };
  if (!validInstant(input.evaluationInstant))
    return { status: "invalidQuery" as const, reason: "invalidInstant" as const };
  const temporal = qualifyGoalStructure(authority);
  const available = availability === "accepted";
  const qualified = available && temporal.status === "qualified";
  const latest = new Map<string, GoalStructureRelationshipV1>();
  for (const row of authority.relationships)
    if (!latest.has(row.id) || latest.get(row.id)!.revision < row.revision) latest.set(row.id, row);
  const relevant = [...latest.values()]
    .filter(
      (row) =>
        row.sourceGoalId === input.goalId ||
        (row.target.kind === "goal" && row.target.goalId === input.goalId),
    )
    .sort((a, b) => a.id.localeCompare(b.id));
  const records = relevant.map((row) => {
    const record = relationshipApplicability(row, input.evaluationInstant);
    return qualified ? record : { ...record, applicability: "unknown", reason: "temporalAnomaly" };
  });
  const applicable = new Set(
    records.filter((row) => row.applicability === "applicable").map((row) => row.id),
  );
  let legacy: StructuralEligibilityV1 = {
    version: 1,
    goalId: input.goalId,
    status: "unknown",
    reasons: [],
    dependencies: [],
    dependencyFingerprint: fingerprintDependencies([]),
  };
  if (qualified) {
    legacy = queryStructuralEligibility({
      goalId: input.goalId,
      goals,
      authority: {
        ...authority,
        relationships: [...latest.values()].filter((row) => applicable.has(row.id)),
      },
    });
    const reasons = legacy.reasons;
    if (
      !goals.some((g) => g.id === input.goalId) ||
      reasons.some((r) => r.code === "goalStructure.prerequisiteUnknown")
    )
      legacy.status = "unknown";
    else if (
      reasons.some(
        (r) =>
          r.code === "goalStructure.prerequisiteUnsatisfied" ||
          r.code === "goalStructure.goalLifecycle",
      )
    )
      legacy.status = "ineligible";
  }
  const boundary = qualified
    ? relevant
        .filter((row) => row.status === "active" && row.effectiveFrom > input.evaluationInstant)
        .map((row) => row.effectiveFrom)
        .sort()[0]
    : undefined;
  return {
    status: "evaluated" as const,
    value: {
      version: 2 as const,
      basis: "currentAuthority" as const,
      evaluatedAt: input.evaluationInstant,
      qualification: qualified
        ? ("qualified" as const)
        : available || availability === "protected"
          ? ("protected" as const)
          : ("unavailable" as const),
      eligibility: legacy.status,
      records: available
        ? { status: "available" as const, values: records }
        : { status: "unavailable" as const, reason: availability },
      reasons:
        available && temporal.status === "protected"
          ? temporal.issues.map((issue) => ({ code: "temporalAnomaly", record: issue }))
          : !available
            ? [{ code: availability }]
            : [
                ...(!goals.some((g) => g.id === input.goalId) ? [{ code: "missingGoal" }] : []),
                ...legacy.reasons.map((reason) => {
                  const code =
                    reason.code === "goalStructure.goalLifecycle"
                      ? "goalLifecycle"
                      : reason.code === "goalStructure.prerequisiteUnsatisfied"
                        ? "hardPrerequisiteUnsatisfied"
                        : reason.code === "goalStructure.prerequisiteUnknown"
                          ? "hardPrerequisiteUnknown"
                          : (() => {
                              const row = relevant.find(
                                (r) => "relationshipId" in reason && r.id === reason.relationshipId,
                              );
                              if (!row) return "advisoryPrerequisiteUnknown";
                              const target = row.target;
                              const goal =
                                target.kind === "goal"
                                  ? goals.find((g) => g.id === target.goalId)
                                  : undefined;
                              const milestone =
                                target.kind === "milestone"
                                  ? authority.milestones
                                      .filter((m) => m.id === target.milestoneId)
                                      .sort((a, b) => b.revision - a.revision)[0]
                                  : undefined;
                              return target.kind === "goal"
                                ? !goal || goal.status === "archived"
                                  ? "advisoryPrerequisiteUnknown"
                                  : "advisoryPrerequisiteUnmet"
                                : !milestone || milestone.state === "retired"
                                  ? "advisoryPrerequisiteUnknown"
                                  : "advisoryPrerequisiteUnmet";
                            })();
                  return {
                    code,
                    ...("relationshipId" in reason
                      ? {
                          record: {
                            id: reason.relationshipId,
                            revision: reason.relationshipRevision,
                          },
                        }
                      : {}),
                  };
                }),
              ],
      dependencies: legacy.dependencies,
      ...(available ? { authorityFingerprint: semanticFingerprint(authority) } : {}),
      ...(qualified
        ? {
            applicabilityFingerprint: semanticFingerprint({
              policy: "goal-structure-current-temporal-v1",
              records,
              eligibility: legacy.status,
              dependencies: legacy.dependencies,
            }),
          }
        : {}),
      ...(boundary ? { nextApplicabilityChangeAt: boundary } : {}),
      legacy,
    },
  };
}
export type StructureQueryResult = ReturnType<typeof evaluateGoalStructure>;
/** Pure adapter: deliberately does not sample a clock or serialize new reason codes. */
export function structureEligibilityV1(
  result: StructureQueryResult,
  goalId: GoalId,
): StructuralEligibilityV1 {
  return result.status === "evaluated" && result.value.legacy
    ? structuredClone(result.value.legacy)
    : {
        version: 1,
        goalId,
        status: "unknown",
        reasons: [],
        dependencies: [],
        dependencyFingerprint: fingerprintDependencies([]),
      };
}
export function structureEvaluationFreshness(
  before: StructureQueryResult,
  current: StructureQueryResult,
) {
  if (
    before.status !== "evaluated" ||
    current.status !== "evaluated" ||
    current.value.qualification !== "qualified" ||
    current.value.evaluatedAt < before.value.evaluatedAt
  )
    return "unknown";
  return before.value.authorityFingerprint === current.value.authorityFingerprint &&
    before.value.applicabilityFingerprint === current.value.applicabilityFingerprint
    ? "current"
    : "stale";
}
