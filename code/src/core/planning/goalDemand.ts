import type { GoalId, GoalV1 } from "../goals/goal.js";
import type { LocalDateString } from "../shifts/types.js";
import {
  isPlanningFactId,
  validatePlanningProvenance,
  type PlanningFactId,
  type PlanningProvenanceV1,
  type PlanningRevision,
} from "./planningFoundation.js";
import {
  validateDemandResourceAuthority,
  type DemandResourceFootprintAssociationV1,
  type DemandResourceFootprintSpecV1,
} from "./demandResourceFootprint.js";

export const GOAL_DEMAND_AUTHORITY_VERSION = 1 as const;
export const DEMAND_PROJECTION_POLICY = { id: "goal-demand-projection", version: 1 } as const;
export type DemandLifecycle = "active" | "suspended" | "expired" | "completed" | "retired";
export type UserDayHorizonV1 = {
  kind: "userDayInterval";
  startUserDayDate: LocalDateString;
  endUserDayDateExclusive: LocalDateString;
};
export type DemandSessionShapeV1 =
  | { mode: "indivisible"; exactMinutes: number }
  | {
      mode: "splittable";
      minimumMinutes: number;
      preferredMinutes?: number;
      maximumMinutes?: number;
    };
export type DemandSatisfactionV1 =
  | { kind: "minimum"; allowPartial: false }
  | { kind: "target" | "optional"; allowPartial: false }
  | { kind: "target" | "optional"; allowPartial: true; minimumSatisfiedMinutes: number };
export type DemandCadenceV1 = { kind: "total" } | { kind: "sessionCount"; count: number };
export type GoalDemandIntentV1 = {
  recordType: "demand";
  version: 1;
  id: PlanningFactId;
  revision: PlanningRevision;
  goalId: GoalId;
  lifecycle: DemandLifecycle;
  requestedEffort: { unit: "minutes"; amount: number };
  horizon: UserDayHorizonV1;
  session: DemandSessionShapeV1;
  satisfaction: DemandSatisfactionV1;
  cadence: DemandCadenceV1;
  createdAt: string;
  updatedAt: string;
  effectiveFrom: string;
  effectiveTo?: string;
  provenance: PlanningProvenanceV1;
};
export type GoalPriorityLevel = "low" | "normal" | "high" | "critical";
export type GoalPriorityV1 = {
  recordType: "priority";
  version: 1;
  id: PlanningFactId;
  revision: PlanningRevision;
  goalId: GoalId;
  level: GoalPriorityLevel;
  scope: { kind: "default" } | UserDayHorizonV1;
  status: "active" | "retired";
  createdAt: string;
  updatedAt: string;
  effectiveFrom: string;
  effectiveTo?: string;
  provenance: PlanningProvenanceV1;
};
export type GoalPlanningAuthorityV1 = {
  version: 1;
  demands: GoalDemandIntentV1[];
  priorities: GoalPriorityV1[];
};
export type GoalPlanningAuthorityV2 = {
  version: 2;
  demands: GoalDemandIntentV1[];
  priorities: GoalPriorityV1[];
  footprintSpecifications: DemandResourceFootprintSpecV1[];
  footprintAssociations: DemandResourceFootprintAssociationV1[];
};
export type GoalPlanningAuthority = GoalPlanningAuthorityV2;
export type GoalPlanningIssue = {
  code:
    | "invalidRecord"
    | "missingGoal"
    | "duplicateRevision"
    | "invalidRevisionHistory"
    | "conflictingPriority";
  recordId?: string;
};

export function emptyGoalPlanningAuthority(): GoalPlanningAuthorityV2 {
  return {
    version: 2,
    demands: [],
    priorities: [],
    footprintSpecifications: [],
    footprintAssociations: [],
  };
}
export function migrateGoalPlanningAuthorityV1(
  value: GoalPlanningAuthorityV1,
): GoalPlanningAuthorityV2 {
  return {
    version: 2,
    demands: structuredClone(value.demands),
    priorities: structuredClone(value.priorities),
    footprintSpecifications: [],
    footprintAssociations: [],
  };
}
export function downgradeGoalPlanningAuthorityV2(
  value: GoalPlanningAuthorityV2,
): GoalPlanningAuthorityV1 | undefined {
  return value.footprintSpecifications.length || value.footprintAssociations.length
    ? undefined
    : {
        version: 1,
        demands: structuredClone(value.demands),
        priorities: structuredClone(value.priorities),
      };
}
export function directPlanningAuthoringProvenance(): PlanningProvenanceV1 {
  return { version: 1, role: "authoredAuthority", origin: { kind: "directAuthoring" } };
}
export function priorityLevelRank(value: GoalPriorityLevel): number {
  return { low: 0, normal: 1, high: 2, critical: 3 }[value];
}
export function validateGoalPlanningAuthority(
  value: unknown,
  goals?: readonly GoalV1[],
):
  | { status: "valid"; authority: GoalPlanningAuthorityV2 }
  | { status: "invalid"; issues: GoalPlanningIssue[] } {
  if (
    !record(value) ||
    (value.version !== 1 && value.version !== 2) ||
    !Array.isArray(value.demands) ||
    !Array.isArray(value.priorities)
  )
    return { status: "invalid", issues: [{ code: "invalidRecord" }] };
  if (
    (value.version === 1 && Object.keys(value).sort().join() !== "demands,priorities,version") ||
    (value.version === 2 &&
      Object.keys(value).sort().join() !==
        "demands,footprintAssociations,footprintSpecifications,priorities,version")
  )
    return { status: "invalid", issues: [{ code: "invalidRecord" }] };
  const demands = value.demands.filter(validateDemand).map((item) => structuredClone(item));
  const priorities = value.priorities.filter(validatePriority).map((item) => structuredClone(item));
  const issues: GoalPlanningIssue[] = [];
  if (demands.length !== value.demands.length || priorities.length !== value.priorities.length)
    issues.push({ code: "invalidRecord" });
  const goalIds = new Set(goals?.map((goal) => goal.id) ?? []);
  for (const item of [...demands, ...priorities])
    if (goals && !goalIds.has(item.goalId)) issues.push({ code: "missingGoal", recordId: item.id });
  for (const records of [demands, priorities]) {
    const exact = new Set<string>();
    const byId = new Map<string, typeof records>();
    for (const item of records) {
      const key = `${item.id}|${item.revision}`;
      if (exact.has(key)) issues.push({ code: "duplicateRevision", recordId: item.id });
      exact.add(key);
      byId.set(item.id, [...(byId.get(item.id) ?? []), item] as typeof records);
    }
    for (const [id, history] of byId) {
      const ordered = [...history].sort((a, b) => a.revision - b.revision);
      if (ordered.some((item, index) => item.revision !== index + 1))
        issues.push({ code: "invalidRevisionHistory", recordId: id });
    }
  }
  const resource = validateDemandResourceAuthority({
    specifications: value.version === 2 ? value.footprintSpecifications : [],
    associations: value.version === 2 ? value.footprintAssociations : [],
    demandIds: new Set(demands.map((item) => item.id)),
  });
  if (resource.status === "invalid") issues.push({ code: "invalidRecord" });
  const activePriorities = latestById(priorities).filter((item) => item.status === "active");
  for (let index = 0; index < activePriorities.length; index++)
    for (let other = index + 1; other < activePriorities.length; other++) {
      const left = activePriorities[index]!;
      const right = activePriorities[other]!;
      if (left.goalId === right.goalId && scopesOverlap(left.scope, right.scope))
        issues.push({ code: "conflictingPriority", recordId: right.id });
    }
  return issues.length
    ? { status: "invalid", issues: canonicalIssues(issues) }
    : {
        status: "valid",
        authority: {
          version: 2,
          demands: demands.sort(compareRecord),
          priorities: priorities.sort(compareRecord),
          footprintSpecifications: resource.status === "valid" ? resource.specifications : [],
          footprintAssociations: resource.status === "valid" ? resource.associations : [],
        },
      };
}

export function validateDemand(value: unknown): value is GoalDemandIntentV1 {
  if (!record(value)) return false;
  const provenance = validatePlanningProvenance(value.provenance);
  if (
    !exactKeys(value, [
      "recordType",
      "version",
      "id",
      "revision",
      "goalId",
      "lifecycle",
      "requestedEffort",
      "horizon",
      "session",
      "satisfaction",
      "cadence",
      "createdAt",
      "updatedAt",
      "effectiveFrom",
      "effectiveTo",
      "provenance",
    ]) ||
    value.recordType !== "demand" ||
    value.version !== 1 ||
    !isPlanningFactId(value.id) ||
    !validRevision(value.revision) ||
    !validGoalId(value.goalId) ||
    !["active", "suspended", "expired", "completed", "retired"].includes(String(value.lifecycle)) ||
    !validEffort(value.requestedEffort) ||
    !validHorizon(value.horizon) ||
    !validSession(value.session, value.requestedEffort.amount) ||
    !validSatisfaction(value.satisfaction, value.requestedEffort.amount) ||
    !validCadence(value.cadence, value.session, value.requestedEffort.amount) ||
    !timestamp(value.createdAt) ||
    !timestamp(value.updatedAt) ||
    !timestamp(value.effectiveFrom) ||
    provenance.status !== "valid" ||
    provenance.provenance.role !== "authoredAuthority"
  )
    return false;
  return terminalCoherence(value.lifecycle, value.effectiveTo, value.updatedAt);
}

export function validatePriority(value: unknown): value is GoalPriorityV1 {
  if (!record(value)) return false;
  const provenance = validatePlanningProvenance(value.provenance);
  return (
    exactKeys(value, [
      "recordType",
      "version",
      "id",
      "revision",
      "goalId",
      "level",
      "scope",
      "status",
      "createdAt",
      "updatedAt",
      "effectiveFrom",
      "effectiveTo",
      "provenance",
    ]) &&
    value.recordType === "priority" &&
    value.version === 1 &&
    isPlanningFactId(value.id) &&
    validRevision(value.revision) &&
    validGoalId(value.goalId) &&
    ["low", "normal", "high", "critical"].includes(String(value.level)) &&
    validPriorityScope(value.scope) &&
    ["active", "retired"].includes(String(value.status)) &&
    timestamp(value.createdAt) &&
    timestamp(value.updatedAt) &&
    timestamp(value.effectiveFrom) &&
    provenance.status === "valid" &&
    provenance.provenance.role === "authoredAuthority" &&
    terminalCoherence(value.status, value.effectiveTo, value.updatedAt)
  );
}

export function currentDemandsForGoal(
  authority: GoalPlanningAuthorityV1 | GoalPlanningAuthorityV2,
  goalId: GoalId,
) {
  return latestById(authority.demands)
    .filter((item) => item.goalId === goalId && item.lifecycle === "active")
    .sort(compareRecord)
    .map((item) => structuredClone(item));
}
export function applicablePriorityForGoal(
  authority: GoalPlanningAuthorityV1 | GoalPlanningAuthorityV2,
  goalId: GoalId,
  userDayDate: LocalDateString,
) {
  const current = latestById(authority.priorities).filter(
    (item) =>
      item.goalId === goalId && item.status === "active" && scopeContains(item.scope, userDayDate),
  );
  const bounded = current.find((item) => item.scope.kind === "userDayInterval");
  const selected = bounded ?? current.find((item) => item.scope.kind === "default");
  return selected ? structuredClone(selected) : undefined;
}
export function resolveDemandRevision(
  authority: GoalPlanningAuthorityV1 | GoalPlanningAuthorityV2,
  id: PlanningFactId,
  revision: number,
) {
  const value = authority.demands.find((item) => item.id === id && item.revision === revision);
  return value
    ? { status: "resolved" as const, demand: structuredClone(value) }
    : { status: "notFound" as const };
}
export function resolvePriorityRevision(
  authority: GoalPlanningAuthorityV1 | GoalPlanningAuthorityV2,
  id: PlanningFactId,
  revision: number,
) {
  const value = authority.priorities.find((item) => item.id === id && item.revision === revision);
  return value
    ? { status: "resolved" as const, priority: structuredClone(value) }
    : { status: "notFound" as const };
}

function validEffort(value: unknown): value is GoalDemandIntentV1["requestedEffort"] {
  return (
    record(value) &&
    exactKeys(value, ["unit", "amount"]) &&
    value.unit === "minutes" &&
    positiveInteger(value.amount)
  );
}
function validHorizon(value: unknown): value is UserDayHorizonV1 {
  return (
    record(value) &&
    exactKeys(value, ["kind", "startUserDayDate", "endUserDayDateExclusive"]) &&
    value.kind === "userDayInterval" &&
    localDate(value.startUserDayDate) &&
    localDate(value.endUserDayDateExclusive) &&
    value.startUserDayDate < value.endUserDayDateExclusive
  );
}
function validPriorityScope(value: unknown): value is GoalPriorityV1["scope"] {
  return (
    record(value) && (value.kind === "default" ? exactKeys(value, ["kind"]) : validHorizon(value))
  );
}
function validSession(value: unknown, total: unknown): value is DemandSessionShapeV1 {
  if (!record(value) || !positiveInteger(total)) return false;
  if (value.mode === "indivisible")
    return exactKeys(value, ["mode", "exactMinutes"]) && value.exactMinutes === total;
  if (
    value.mode !== "splittable" ||
    !exactKeys(value, ["mode", "minimumMinutes", "preferredMinutes", "maximumMinutes"])
  )
    return false;
  if (!positiveInteger(value.minimumMinutes) || value.minimumMinutes > total) return false;
  if (
    value.preferredMinutes !== undefined &&
    (!positiveInteger(value.preferredMinutes) ||
      value.preferredMinutes < value.minimumMinutes ||
      value.preferredMinutes > total)
  )
    return false;
  return (
    value.maximumMinutes === undefined ||
    (positiveInteger(value.maximumMinutes) &&
      value.maximumMinutes >= (value.preferredMinutes ?? value.minimumMinutes) &&
      value.maximumMinutes <= total)
  );
}
function validSatisfaction(value: unknown, total: unknown): value is DemandSatisfactionV1 {
  if (
    !record(value) ||
    !positiveInteger(total) ||
    !["minimum", "target", "optional"].includes(String(value.kind)) ||
    typeof value.allowPartial !== "boolean"
  )
    return false;
  if (value.kind === "minimum" && value.allowPartial) return false;
  if (!value.allowPartial) return exactKeys(value, ["kind", "allowPartial"]);
  return (
    exactKeys(value, ["kind", "allowPartial", "minimumSatisfiedMinutes"]) &&
    positiveInteger(value.minimumSatisfiedMinutes) &&
    value.minimumSatisfiedMinutes <= total
  );
}
function validCadence(value: unknown, session: unknown, total: unknown): value is DemandCadenceV1 {
  if (!record(value)) return false;
  if (value.kind === "total") return exactKeys(value, ["kind"]);
  if (
    value.kind !== "sessionCount" ||
    !exactKeys(value, ["kind", "count"]) ||
    !positiveInteger(value.count) ||
    !record(session) ||
    !positiveInteger(total)
  )
    return false;
  const minimum = session.mode === "indivisible" ? session.exactMinutes : session.minimumMinutes;
  return positiveInteger(minimum) && value.count * minimum <= total;
}
function terminalCoherence(status: unknown, effectiveTo: unknown, updatedAt: unknown) {
  const terminal = status === "retired" || status === "expired" || status === "completed";
  return terminal ? timestamp(effectiveTo) && effectiveTo === updatedAt : effectiveTo === undefined;
}
function scopesOverlap(left: GoalPriorityV1["scope"], right: GoalPriorityV1["scope"]) {
  if (left.kind === "default" || right.kind === "default") return left.kind === right.kind;
  return (
    left.startUserDayDate < right.endUserDayDateExclusive &&
    right.startUserDayDate < left.endUserDayDateExclusive
  );
}
function scopeContains(scope: GoalPriorityV1["scope"], date: LocalDateString) {
  return (
    scope.kind === "default" ||
    (scope.startUserDayDate <= date && date < scope.endUserDayDateExclusive)
  );
}
function latestById<T extends { id: PlanningFactId; revision: PlanningRevision }>(values: T[]) {
  const current = new Map<PlanningFactId, T>();
  for (const item of values)
    if (!current.has(item.id) || current.get(item.id)!.revision < item.revision)
      current.set(item.id, item);
  return [...current.values()];
}
function compareRecord(
  a: { id: PlanningFactId; revision: PlanningRevision },
  b: { id: PlanningFactId; revision: PlanningRevision },
) {
  return a.id.localeCompare(b.id) || a.revision - b.revision;
}
function canonicalIssues(issues: GoalPlanningIssue[]) {
  return [
    ...new Map(issues.map((issue) => [`${issue.code}|${issue.recordId ?? ""}`, issue])).entries(),
  ]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, issue]) => issue);
}
function exactKeys(value: Record<string, unknown>, allowed: string[]) {
  return (
    Object.keys(value).every((key) => allowed.includes(key)) &&
    Object.keys(value).sort().join() ===
      allowed
        .filter((key) => value[key] !== undefined)
        .sort()
        .join()
  );
}
function positiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) > 0;
}
function validRevision(value: unknown): value is PlanningRevision {
  return positiveInteger(value);
}
function validGoalId(value: unknown): value is GoalId {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value)
  );
}
function timestamp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}
function localDate(value: unknown): value is LocalDateString {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
