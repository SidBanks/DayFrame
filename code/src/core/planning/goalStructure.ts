import type { GoalId, GoalStatus, GoalV1 } from "../goals/goal.js";
import { semanticFingerprint } from "../../infrastructure/restore/restoreStaging.js";
import {
  evaluatePlanningFreshness,
  fingerprintDependencies,
  isPlanningFactId,
  planningDependencyKind,
  planningRevision,
  validatePlanningProvenance,
  type DependencyFingerprintV1,
  type PlanningDependencyReferenceV1,
  type PlanningFactId,
  type PlanningFreshnessV1,
  type PlanningProvenanceV1,
  type PlanningRevision,
} from "./planningFoundation.js";

export const GOAL_STRUCTURE_VERSION = 1 as const;
export type GoalRelationshipKind = "contains" | "contributesTo" | "dependsOn";
export type GoalStructureRelationshipV1 = {
  recordType: "relationship";
  version: 1;
  id: PlanningFactId;
  revision: PlanningRevision;
  kind: GoalRelationshipKind;
  sourceGoalId: GoalId;
  target: { kind: "goal"; goalId: GoalId } | { kind: "milestone"; milestoneId: PlanningFactId };
  semantics:
    | { kind: "containment"; requiredness: "required" | "optional" }
    | { kind: "contribution"; mode: "nonAggregating" }
    | {
        kind: "dependency";
        strength: "hard" | "advisory";
        condition: "goalCompleted" | "milestoneSatisfied";
      };
  status: "active" | "retired";
  createdAt: string;
  updatedAt: string;
  effectiveFrom: string;
  effectiveTo?: string;
  provenance: PlanningProvenanceV1;
};
export type GoalStructureMilestoneV1 = {
  recordType: "milestone";
  version: 1;
  id: PlanningFactId;
  revision: PlanningRevision;
  ownerGoalId: GoalId;
  title: string;
  state: "active" | "satisfied" | "retired";
  satisfactionPolicy: { kind: "manual" };
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
  satisfiedAt?: string;
  retiredAt?: string;
  provenance: PlanningProvenanceV1;
};
export type GoalStructureAuthorityV1 = {
  version: 1;
  relationships: GoalStructureRelationshipV1[];
  milestones: GoalStructureMilestoneV1[];
};
export type GoalStructureIssue = {
  code:
    | "invalidRecord"
    | "missingEndpoint"
    | "selfRelationship"
    | "duplicateRelationship"
    | "multipleContainmentParents"
    | "containmentCycle"
    | "dependencyCycle"
    | "invalidMilestoneTarget";
  relationshipId?: string;
  path?: string[];
};
export type GoalStructureReason =
  | { version: 1; code: "goalStructure.goalLifecycle"; goalId: GoalId; status: GoalStatus }
  | {
      version: 1;
      code: "goalStructure.prerequisiteUnsatisfied" | "goalStructure.prerequisiteUnknown";
      relationshipId: PlanningFactId;
      relationshipRevision: PlanningRevision;
    }
  | {
      version: 1;
      code: "goalStructure.advisoryDependency";
      relationshipId: PlanningFactId;
      relationshipRevision: PlanningRevision;
    };
export type StructuralEligibilityV1 = {
  version: 1;
  goalId: GoalId;
  status: "eligible" | "ineligible" | "conditionallyEligible" | "unknown";
  reasons: GoalStructureReason[];
  dependencies: PlanningDependencyReferenceV1[];
  dependencyFingerprint: DependencyFingerprintV1;
};

export function emptyGoalStructureAuthority(): GoalStructureAuthorityV1 {
  return { version: 1, relationships: [], milestones: [] };
}
export function createDirectAuthoringProvenance(): PlanningProvenanceV1 {
  return { version: 1, role: "authoredAuthority", origin: { kind: "directAuthoring" } };
}
export function relationshipDependency(
  value: GoalStructureRelationshipV1,
): PlanningDependencyReferenceV1 {
  return {
    version: 1,
    kind: planningDependencyKind("goalstructure.relationship"),
    id: value.id,
    revision: value.revision,
  };
}
export function milestoneDependency(
  value: GoalStructureMilestoneV1,
): PlanningDependencyReferenceV1 {
  return {
    version: 1,
    kind: planningDependencyKind("goalstructure.milestone"),
    id: value.id,
    revision: value.revision,
  };
}
export function goalDependency(value: GoalV1): PlanningDependencyReferenceV1 {
  return {
    version: 1,
    kind: planningDependencyKind("goal.authority"),
    id: value.id as unknown as PlanningFactId,
    revision: planningRevision(value.revision),
  };
}

export function validateGoalStructureAuthority(
  value: unknown,
  goals?: readonly GoalV1[],
):
  | { status: "valid"; authority: GoalStructureAuthorityV1 }
  | { status: "invalid"; issues: GoalStructureIssue[] } {
  if (
    !record(value) ||
    value.version !== 1 ||
    Object.keys(value).sort().join() !== "milestones,relationships,version" ||
    !Array.isArray(value.relationships) ||
    !Array.isArray(value.milestones)
  )
    return { status: "invalid", issues: [{ code: "invalidRecord" }] };
  const relationships = value.relationships
    .filter(validateRelationship)
    .map((item) => structuredClone(item));
  const milestones = value.milestones
    .filter(validateMilestone)
    .map((item) => structuredClone(item));
  if (
    relationships.length !== value.relationships.length ||
    milestones.length !== value.milestones.length
  )
    return { status: "invalid", issues: [{ code: "invalidRecord" }] };
  relationships.sort(compareRelationship);
  milestones.sort(compareMilestone);
  const issues: GoalStructureIssue[] = [];
  if (hasDuplicateRevisions(relationships) || hasDuplicateRevisions(milestones))
    issues.push({ code: "invalidRecord" });
  const goalIds = new Set(goals?.map((goal) => goal.id) ?? []);
  const currentMilestones = latestById(milestones);
  const milestoneIds = new Set(milestones.map((item) => item.id));
  for (const item of milestones)
    if (goals && !goalIds.has(item.ownerGoalId)) issues.push({ code: "missingEndpoint" });
  for (const item of relationships) {
    if (goals && !goalIds.has(item.sourceGoalId))
      issues.push({ code: "missingEndpoint", relationshipId: item.id });
    if (item.target.kind === "goal") {
      if (goals && !goalIds.has(item.target.goalId))
        issues.push({ code: "missingEndpoint", relationshipId: item.id });
      if (item.target.goalId === item.sourceGoalId)
        issues.push({ code: "selfRelationship", relationshipId: item.id });
    } else if (!milestoneIds.has(item.target.milestoneId)) {
      issues.push({ code: "missingEndpoint", relationshipId: item.id });
    }
  }
  const active = latestById(relationships).filter((item) => item.status === "active");
  for (const item of active) {
    if (item.target.kind === "milestone") {
      const milestoneId = item.target.milestoneId;
      const target = currentMilestones.find((milestone) => milestone.id === milestoneId);
      if (!target || target.state === "retired")
        issues.push({ code: "missingEndpoint", relationshipId: item.id });
    }
    if ((item.kind === "contains" || item.kind === "contributesTo") && item.target.kind !== "goal")
      issues.push({ code: "invalidMilestoneTarget", relationshipId: item.id });
    if (item.kind === "dependsOn" && item.semantics.kind === "dependency") {
      if (item.target.kind === "goal" && item.semantics.condition !== "goalCompleted")
        issues.push({ code: "invalidMilestoneTarget", relationshipId: item.id });
      if (item.target.kind === "milestone" && item.semantics.condition !== "milestoneSatisfied")
        issues.push({ code: "invalidMilestoneTarget", relationshipId: item.id });
    }
  }
  const semantic = new Map<string, GoalStructureRelationshipV1>();
  for (const item of active) {
    const key = relationshipSemanticKey(item);
    if (semantic.has(key)) issues.push({ code: "duplicateRelationship", relationshipId: item.id });
    semantic.set(key, item);
  }
  const containment = active.filter(
    (item) => item.kind === "contains" && item.target.kind === "goal",
  );
  const parents = new Set<string>();
  for (const item of containment) {
    const child = (item.target as { kind: "goal"; goalId: GoalId }).goalId;
    if (parents.has(child))
      issues.push({ code: "multipleContainmentParents", relationshipId: item.id });
    parents.add(child);
  }
  const containmentCycle = findCycle(containment.map(goalEdge));
  if (containmentCycle) issues.push({ code: "containmentCycle", path: containmentCycle });
  const dependencyCycle = findCycle(
    active.filter((item) => item.kind === "dependsOn" && item.target.kind === "goal").map(goalEdge),
  );
  if (dependencyCycle) issues.push({ code: "dependencyCycle", path: dependencyCycle });
  return issues.length
    ? { status: "invalid", issues: canonicalIssues(issues) }
    : { status: "valid", authority: { version: 1, relationships, milestones } };
}

export function queryStructuralEligibility(input: {
  goalId: GoalId;
  goals: readonly GoalV1[];
  authority: GoalStructureAuthorityV1;
}): StructuralEligibilityV1 {
  const checked = validateGoalStructureAuthority(input.authority, input.goals);
  if (checked.status === "invalid") throw new RangeError("Invalid Goal Structure authority.");
  const goal = input.goals.find((item) => item.id === input.goalId);
  const current = latestById(checked.authority.relationships).filter(
    (item) =>
      item.status === "active" && item.kind === "dependsOn" && item.sourceGoalId === input.goalId,
  );
  const milestones = latestById(checked.authority.milestones);
  const dependencies: PlanningDependencyReferenceV1[] = [
    ...(goal ? [goalDependency(goal)] : []),
    ...current.flatMap((relationship) => {
      const targetReference = relationship.target;
      const target =
        targetReference.kind === "goal"
          ? input.goals.find((item) => item.id === targetReference.goalId)
          : milestones.find((item) => item.id === targetReference.milestoneId);
      return [
        relationshipDependency(relationship),
        ...(target
          ? ["status" in target ? goalDependency(target) : milestoneDependency(target)]
          : []),
      ];
    }),
  ];
  const reasons: GoalStructureReason[] = [];
  let status: StructuralEligibilityV1["status"] = "eligible";
  if (!goal || goal.status !== "active") {
    status = goal ? "ineligible" : "unknown";
    if (goal)
      reasons.push({
        version: 1,
        code: "goalStructure.goalLifecycle",
        goalId: goal.id,
        status: goal.status,
      });
  }
  for (const edge of current) {
    const targetReference = edge.target;
    const target =
      targetReference.kind === "goal"
        ? input.goals.find((item) => item.id === targetReference.goalId)
        : milestones.find((item) => item.id === targetReference.milestoneId);
    const satisfied =
      target && ("status" in target ? target.status === "completed" : target.state === "satisfied");
    const unknown =
      !target || ("status" in target ? target.status === "archived" : target.state === "retired");
    if (edge.semantics.kind !== "dependency" || satisfied) continue;
    if (edge.semantics.strength === "advisory") {
      if (status === "eligible") status = "conditionallyEligible";
      reasons.push({
        version: 1,
        code: "goalStructure.advisoryDependency",
        relationshipId: edge.id,
        relationshipRevision: edge.revision,
      });
    } else if (unknown) {
      status = "unknown";
      reasons.push({
        version: 1,
        code: "goalStructure.prerequisiteUnknown",
        relationshipId: edge.id,
        relationshipRevision: edge.revision,
      });
    } else {
      status = "ineligible";
      reasons.push({
        version: 1,
        code: "goalStructure.prerequisiteUnsatisfied",
        relationshipId: edge.id,
        relationshipRevision: edge.revision,
      });
    }
  }
  return {
    version: 1,
    goalId: input.goalId,
    status,
    reasons: reasons.sort((a, b) => reasonKey(a).localeCompare(reasonKey(b))),
    dependencies,
    dependencyFingerprint: fingerprintDependencies(dependencies),
  };
}
export function evaluateStructuralEligibilityFreshness(
  evidence: StructuralEligibilityV1,
  authority?: GoalStructureAuthorityV1,
  goals?: readonly GoalV1[],
): PlanningFreshnessV1 {
  if (!authority || !goals)
    return evaluatePlanningFreshness({ dependencyKind: "goalstructure.eligibility" });
  const relationships = new Map(
    latestById(authority.relationships).map((item) => [item.id as string, item]),
  );
  const milestones = new Map(
    latestById(authority.milestones).map((item) => [item.id as string, item]),
  );
  const currentGoals = new Map(goals.map((item) => [item.id as string, item]));
  const refs: PlanningDependencyReferenceV1[] = [];
  for (const reference of evidence.dependencies) {
    const current =
      reference.kind === "goalstructure.relationship"
        ? relationships.get(reference.id)
        : reference.kind === "goalstructure.milestone"
          ? milestones.get(reference.id)
          : reference.kind === "goal.authority"
            ? currentGoals.get(reference.id)
            : undefined;
    if (!current)
      return evaluatePlanningFreshness({
        stored: evidence.dependencyFingerprint,
        dependencyKind: String(reference.kind),
      });
    refs.push(
      "kind" in current
        ? relationshipDependency(current)
        : "state" in current
          ? milestoneDependency(current)
          : goalDependency(current),
    );
  }
  return evaluatePlanningFreshness({
    stored: evidence.dependencyFingerprint,
    current: fingerprintDependencies(refs),
    dependencyKind: "goalstructure.eligibility",
  });
}
export function resolveRelationshipRevision(
  authority: GoalStructureAuthorityV1,
  id: PlanningFactId,
  revision: PlanningRevision,
) {
  const value = authority.relationships.find(
    (item) => item.id === id && item.revision === revision,
  );
  return value
    ? { status: "resolved" as const, relationship: structuredClone(value) }
    : { status: "notFound" as const };
}
export function resolveMilestoneRevision(
  authority: GoalStructureAuthorityV1,
  id: PlanningFactId,
  revision: PlanningRevision,
) {
  const value = authority.milestones.find((item) => item.id === id && item.revision === revision);
  return value
    ? { status: "resolved" as const, milestone: structuredClone(value) }
    : { status: "notFound" as const };
}
export function currentRelationshipsForGoal(authority: GoalStructureAuthorityV1, goalId: GoalId) {
  return latestById(authority.relationships)
    .filter(
      (item) =>
        item.sourceGoalId === goalId ||
        (item.target.kind === "goal" && item.target.goalId === goalId),
    )
    .sort(compareRelationship)
    .map((item) => structuredClone(item));
}
export function currentMilestonesForGoal(authority: GoalStructureAuthorityV1, goalId: GoalId) {
  return latestById(authority.milestones)
    .filter((item) => item.ownerGoalId === goalId)
    .sort(compareMilestone)
    .map((item) => structuredClone(item));
}
export function goalStructureFingerprint(authority: GoalStructureAuthorityV1) {
  return semanticFingerprint({
    version: 1,
    relationships: authority.relationships,
    milestones: authority.milestones,
  });
}
export function validateRelationship(value: unknown): value is GoalStructureRelationshipV1 {
  if (!record(value)) return false;
  const provenance = validatePlanningProvenance(value.provenance);
  const allowed = [
    "recordType",
    "version",
    "id",
    "revision",
    "kind",
    "sourceGoalId",
    "target",
    "semantics",
    "status",
    "createdAt",
    "updatedAt",
    "effectiveFrom",
    "effectiveTo",
    "provenance",
  ];
  if (
    Object.keys(value).some((key) => !allowed.includes(key)) ||
    value.recordType !== "relationship" ||
    value.version !== 1 ||
    !isPlanningFactId(value.id) ||
    !validRevision(value.revision) ||
    !validGoalId(value.sourceGoalId) ||
    !record(value.target) ||
    !record(value.semantics) ||
    !timestamp(value.createdAt) ||
    !timestamp(value.updatedAt) ||
    !timestamp(value.effectiveFrom) ||
    provenance.status !== "valid" ||
    (provenance.status === "valid" && provenance.provenance.role !== "authoredAuthority")
  )
    return false;
  if (
    value.effectiveTo !== undefined &&
    (!timestamp(value.effectiveTo) || value.status !== "retired")
  )
    return false;
  if (
    value.status === "retired"
      ? value.effectiveTo !== value.updatedAt
      : value.status !== "active" || value.effectiveTo !== undefined
  )
    return false;
  if (
    value.target.kind === "goal"
      ? !validGoalId(value.target.goalId) ||
        Object.keys(value.target).sort().join() !== "goalId,kind"
      : value.target.kind === "milestone"
        ? !isPlanningFactId(value.target.milestoneId) ||
          Object.keys(value.target).sort().join() !== "kind,milestoneId"
        : true
  )
    return false;
  if (value.kind === "contains")
    return (
      value.target.kind === "goal" &&
      value.semantics.kind === "containment" &&
      ["required", "optional"].includes(String(value.semantics.requiredness)) &&
      Object.keys(value.semantics).sort().join() === "kind,requiredness"
    );
  if (value.kind === "contributesTo")
    return (
      value.target.kind === "goal" &&
      value.semantics.kind === "contribution" &&
      value.semantics.mode === "nonAggregating" &&
      Object.keys(value.semantics).sort().join() === "kind,mode"
    );
  return (
    value.kind === "dependsOn" &&
    value.semantics.kind === "dependency" &&
    ["hard", "advisory"].includes(String(value.semantics.strength)) &&
    ["goalCompleted", "milestoneSatisfied"].includes(String(value.semantics.condition)) &&
    Object.keys(value.semantics).sort().join() === "condition,kind,strength"
  );
}
export function validateMilestone(value: unknown): value is GoalStructureMilestoneV1 {
  if (!record(value)) return false;
  const provenance = validatePlanningProvenance(value.provenance);
  const allowed = [
    "recordType",
    "version",
    "id",
    "revision",
    "ownerGoalId",
    "title",
    "state",
    "satisfactionPolicy",
    "targetDate",
    "createdAt",
    "updatedAt",
    "satisfiedAt",
    "retiredAt",
    "provenance",
  ];
  if (
    Object.keys(value).some((key) => !allowed.includes(key)) ||
    value.recordType !== "milestone" ||
    value.version !== 1 ||
    !isPlanningFactId(value.id) ||
    !validRevision(value.revision) ||
    !validGoalId(value.ownerGoalId) ||
    typeof value.title !== "string" ||
    !value.title.trim() ||
    value.title.length > 200 ||
    !record(value.satisfactionPolicy) ||
    Object.keys(value.satisfactionPolicy).sort().join() !== "kind" ||
    value.satisfactionPolicy.kind !== "manual" ||
    !timestamp(value.createdAt) ||
    !timestamp(value.updatedAt) ||
    provenance.status !== "valid" ||
    (provenance.status === "valid" && provenance.provenance.role !== "authoredAuthority")
  )
    return false;
  if (value.targetDate !== undefined && !localDate(value.targetDate)) return false;
  if (value.state === "active")
    return value.satisfiedAt === undefined && value.retiredAt === undefined;
  if (value.state === "satisfied")
    return timestamp(value.satisfiedAt) && value.retiredAt === undefined;
  return value.state === "retired" && timestamp(value.retiredAt) && value.satisfiedAt === undefined;
}

function latestById<T extends { id: PlanningFactId; revision: PlanningRevision }>(
  values: T[],
): T[] {
  const map = new Map<PlanningFactId, T>();
  for (const item of values)
    if (!map.has(item.id) || map.get(item.id)!.revision < item.revision) map.set(item.id, item);
  return [...map.values()];
}
function hasDuplicateRevisions<T extends { id: PlanningFactId; revision: PlanningRevision }>(
  values: T[],
) {
  const keys = values.map((item) => `${item.id}|${item.revision}`);
  return new Set(keys).size !== keys.length;
}
function compareRelationship(a: GoalStructureRelationshipV1, b: GoalStructureRelationshipV1) {
  return a.id.localeCompare(b.id) || a.revision - b.revision;
}
function compareMilestone(a: GoalStructureMilestoneV1, b: GoalStructureMilestoneV1) {
  return a.id.localeCompare(b.id) || a.revision - b.revision;
}
function relationshipSemanticKey(item: GoalStructureRelationshipV1) {
  return `${item.kind}|${item.sourceGoalId}|${item.target.kind}|${item.target.kind === "goal" ? item.target.goalId : item.target.milestoneId}`;
}
function goalEdge(item: GoalStructureRelationshipV1): [string, string] {
  if (item.target.kind !== "goal") throw new Error("goal edge");
  return [item.sourceGoalId, item.target.goalId];
}
function findCycle(edges: [string, string][]): string[] | undefined {
  const graph = new Map<string, string[]>();
  for (const [from, to] of edges) graph.set(from, [...(graph.get(from) ?? []), to].sort());
  const visiting = new Set<string>(),
    visited = new Set<string>(),
    path: string[] = [];
  const walk = (node: string): string[] | undefined => {
    if (visiting.has(node)) return [...path.slice(path.indexOf(node)), node];
    if (visited.has(node)) return;
    visiting.add(node);
    path.push(node);
    for (const next of graph.get(node) ?? []) {
      const found = walk(next);
      if (found) return found;
    }
    path.pop();
    visiting.delete(node);
    visited.add(node);
  };
  for (const node of [...graph.keys()].sort()) {
    const found = walk(node);
    if (found) return found;
  }
}
function canonicalIssues(issues: GoalStructureIssue[]) {
  const keyed = new Map(
    issues.map((issue) => [
      `${issue.code}|${issue.relationshipId ?? ""}|${issue.path?.join("|") ?? ""}`,
      issue,
    ]),
  );
  return [...keyed.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, issue]) => issue);
}
function reasonKey(reason: GoalStructureReason) {
  return `${reason.code}|${"relationshipId" in reason ? reason.relationshipId : reason.goalId}`;
}
function validRevision(value: unknown): value is PlanningRevision {
  return Number.isSafeInteger(value) && Number(value) >= 1;
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
function localDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
