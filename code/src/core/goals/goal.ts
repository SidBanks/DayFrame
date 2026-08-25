import type { LocalDateString } from "../shifts/types.js";
import type { SourceIncarnationId } from "../authored/sourceIncarnation.js";

export const GOAL_VERSION = 1 as const;
export const GOAL_AUTHORITY_VERSION = 1 as const;
export type GoalId = string & { readonly __goalId: unique symbol };
export type GoalStatus = "active" | "completed" | "archived";
export type GoalCommitmentSourceKind =
  | "blockTemplate"
  | "blockRecurrence"
  | "manualEvent"
  | "shiftDefinition"
  | "shiftCycle"
  | "shiftSegment"
  | "shiftSequenceEntry";
export type GoalCommitmentLinkV1 = {
  sourceKind: GoalCommitmentSourceKind;
  id: string;
  incarnationId: SourceIncarnationId;
};
export type GoalMeasurementPolicyReferenceV1 = { id: string; version: number };
export type GoalV1 = {
  version: 1;
  id: GoalId;
  revision: number;
  title: string;
  description?: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  archivedAt?: string;
  targetDate?: LocalDateString;
  measurementPolicy?: GoalMeasurementPolicyReferenceV1;
  links: GoalCommitmentLinkV1[];
};
export type GoalAuthorityV1 = { version: 1; goals: GoalV1[] };
export type GoalValidation =
  | { status: "valid"; goal: GoalV1 }
  | { status: "invalid"; issues: string[] };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const POLICY_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/;
const kinds = new Set<GoalCommitmentSourceKind>([
  "blockTemplate",
  "blockRecurrence",
  "manualEvent",
  "shiftDefinition",
  "shiftCycle",
  "shiftSegment",
  "shiftSequenceEntry",
]);
export function isGoalId(value: unknown): value is GoalId {
  return typeof value === "string" && UUID.test(value);
}
export function createGoalId(): GoalId {
  const value = globalThis.crypto?.randomUUID?.();
  if (!isGoalId(value)) throw new Error("Cryptographic GoalId allocation failed.");
  return value;
}
export function validateGoal(value: unknown): GoalValidation {
  const issues: string[] = [];
  if (!record(value)) return { status: "invalid", issues: ["goal"] };
  const allowed = [
    "version",
    "id",
    "revision",
    "title",
    "description",
    "status",
    "createdAt",
    "updatedAt",
    "completedAt",
    "archivedAt",
    "targetDate",
    "measurementPolicy",
    "links",
  ];
  if (Object.keys(value).some((key) => !allowed.includes(key))) issues.push("unexpectedField");
  if (value.version !== 1) issues.push("version");
  if (!isGoalId(value.id)) issues.push("id");
  if (!Number.isSafeInteger(value.revision) || Number(value.revision) < 1) issues.push("revision");
  if (typeof value.title !== "string" || !value.title.trim() || value.title.length > 200)
    issues.push("title");
  if (
    value.description !== undefined &&
    (typeof value.description !== "string" || value.description.length > 2000)
  )
    issues.push("description");
  if (!["active", "completed", "archived"].includes(String(value.status))) issues.push("status");
  for (const key of ["createdAt", "updatedAt"] as const)
    if (!timestamp(value[key])) issues.push(key);
  if (value.completedAt !== undefined && !timestamp(value.completedAt)) issues.push("completedAt");
  if (value.archivedAt !== undefined && !timestamp(value.archivedAt)) issues.push("archivedAt");
  if (
    value.status === "completed"
      ? !timestamp(value.completedAt) || value.archivedAt !== undefined
      : value.completedAt !== undefined
  )
    issues.push("completedAtCoherence");
  if (
    value.status === "archived"
      ? !timestamp(value.archivedAt) || value.completedAt !== undefined
      : value.archivedAt !== undefined
  )
    issues.push("archivedAtCoherence");
  if (
    value.targetDate !== undefined &&
    (!DATE.test(String(value.targetDate)) ||
      Number.isNaN(Date.parse(`${value.targetDate}T00:00:00Z`)))
  )
    issues.push("targetDate");
  if (
    value.measurementPolicy !== undefined &&
    (!record(value.measurementPolicy) ||
      Object.keys(value.measurementPolicy).sort().join() !== "id,version" ||
      !POLICY_ID.test(String(value.measurementPolicy.id)) ||
      !Number.isSafeInteger(value.measurementPolicy.version) ||
      Number(value.measurementPolicy.version) < 1)
  )
    issues.push("measurementPolicy");
  if (!Array.isArray(value.links)) issues.push("links");
  else {
    const keys = new Set<string>();
    for (const link of value.links) {
      if (!validLink(link)) {
        issues.push("link");
        continue;
      }
      const key = linkKey(link);
      if (keys.has(key)) issues.push("duplicateLink");
      keys.add(key);
    }
  }
  if (issues.length) return { status: "invalid", issues: [...new Set(issues)] };
  return { status: "valid", goal: canonicalGoal(value as unknown as GoalV1) };
}
export function validateGoalAuthority(
  value: unknown,
): { status: "valid"; authority: GoalAuthorityV1 } | { status: "invalid"; issues: string[] } {
  if (
    !record(value) ||
    value.version !== 1 ||
    Object.keys(value).sort().join() !== "goals,version" ||
    !Array.isArray(value.goals)
  )
    return { status: "invalid", issues: ["authority"] };
  const goals: GoalV1[] = [];
  const ids = new Set<string>();
  const issues: string[] = [];
  for (const raw of value.goals) {
    const checked = validateGoal(raw);
    if (checked.status === "invalid") {
      issues.push(...checked.issues);
      continue;
    }
    if (ids.has(checked.goal.id)) issues.push("duplicateGoalId");
    ids.add(checked.goal.id);
    goals.push(checked.goal);
  }
  return issues.length
    ? { status: "invalid", issues: [...new Set(issues)] }
    : { status: "valid", authority: { version: 1, goals: goals.sort(compareGoals) } };
}
export function canonicalGoal(goal: GoalV1): GoalV1 {
  return structuredClone({
    ...goal,
    title: goal.title.trim(),
    links: [...goal.links].sort((a, b) => linkKey(a).localeCompare(linkKey(b))),
  });
}
export function goalFingerprint(authority: GoalAuthorityV1): string {
  const checked = validateGoalAuthority(authority);
  if (checked.status === "invalid") throw new RangeError(checked.issues.join(","));
  return JSON.stringify(checked.authority);
}
export function linkKey(link: GoalCommitmentLinkV1): string {
  return `${link.sourceKind}|${link.id}|${link.incarnationId}`;
}
function validLink(value: unknown): value is GoalCommitmentLinkV1 {
  return (
    record(value) &&
    Object.keys(value).sort().join() === "id,incarnationId,sourceKind" &&
    kinds.has(value.sourceKind as GoalCommitmentSourceKind) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.incarnationId === "string" &&
    value.incarnationId.length > 0
  );
}
function compareGoals(a: GoalV1, b: GoalV1) {
  return a.id.localeCompare(b.id);
}
function timestamp(value: unknown) {
  return (
    typeof value === "string" &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
