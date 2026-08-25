import type { GoalId } from "../goals/goal.js";
import { semanticFingerprint } from "../../infrastructure/restore/restoreStaging.js";
export type GoalMeasurementDefinitionId = string & {
  readonly __goalMeasurementDefinitionId: unique symbol;
};
export type CanonicalUnsignedDecimalString = string & {
  readonly __canonicalUnsignedDecimal: unique symbol;
};
export type MeasurementUnitId = "count" | "words" | "pages" | "miles" | "kilometers" | "minutes";
export type GoalMeasurementPolicyRef = { id: string; version: number };
export type GoalMeasurementDefinitionV1 = {
  version: 1;
  id: GoalMeasurementDefinitionId;
  goalId: GoalId;
  revision: number;
  status: "active" | "inactive";
  policyRef: GoalMeasurementPolicyRef;
  config: Record<string, unknown>;
  effectiveFrom: string;
  createdAt: string;
  fingerprint: string;
};
export type GoalMeasurementDefinitionAuthorityV1 = {
  version: 1;
  definitions: GoalMeasurementDefinitionV1[];
};
export const MANUAL_QUANTITY_TARGET_POLICY_V1 = { id: "manualQuantityTarget", version: 1 } as const;
export const MEASUREMENT_UNITS: readonly MeasurementUnitId[] = [
  "count",
  "words",
  "pages",
  "miles",
  "kilometers",
  "minutes",
];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const POLICY = /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/;
const DECIMAL = /^(?:0|[1-9]\d*)(?:\.\d*[1-9])?$/;
export function isGoalMeasurementDefinitionId(
  value: unknown,
): value is GoalMeasurementDefinitionId {
  return typeof value === "string" && UUID.test(value);
}
export function createGoalMeasurementDefinitionId(): GoalMeasurementDefinitionId {
  const value = globalThis.crypto?.randomUUID?.();
  if (!isGoalMeasurementDefinitionId(value))
    throw new Error("Cryptographic GoalMeasurementDefinitionId allocation failed.");
  return value;
}
export function isCanonicalUnsignedDecimal(
  value: unknown,
): value is CanonicalUnsignedDecimalString {
  return typeof value === "string" && value.length <= 100 && DECIMAL.test(value);
}
export function measurementPolicySupport(ref: GoalMeasurementPolicyRef) {
  return ref.id === MANUAL_QUANTITY_TARGET_POLICY_V1.id && ref.version === 1
    ? ("supported" as const)
    : ("unsupported" as const);
}
export function validatePolicyConfig(
  ref: GoalMeasurementPolicyRef,
  config: unknown,
):
  | { status: "valid"; config: Record<string, unknown>; support: "supported" | "unsupported" }
  | { status: "invalid" } {
  if (!record(config) || !jsonSafe(config)) return { status: "invalid" };
  if (measurementPolicySupport(ref) === "unsupported")
    return { status: "valid", config: structuredClone(config), support: "unsupported" };
  if (
    Object.keys(config).sort().join() !== "targetValue,unitId" ||
    !isCanonicalUnsignedDecimal(config.targetValue) ||
    config.targetValue === "0" ||
    !MEASUREMENT_UNITS.includes(config.unitId as MeasurementUnitId)
  )
    return { status: "invalid" };
  return {
    status: "valid",
    config: { targetValue: config.targetValue, unitId: config.unitId },
    support: "supported",
  };
}
export function definitionSemanticFingerprint(
  input: Pick<GoalMeasurementDefinitionV1, "version" | "status" | "policyRef" | "config">,
) {
  return semanticFingerprint({
    version: input.version,
    status: input.status,
    policyRef: input.policyRef,
    config: input.config,
  });
}
export function validateMeasurementDefinition(value: unknown):
  | {
      status: "valid";
      definition: GoalMeasurementDefinitionV1;
      support: "supported" | "unsupported";
    }
  | { status: "invalid"; issues: string[] } {
  if (!record(value)) return { status: "invalid", issues: ["definition"] };
  const issues: string[] = [];
  if (
    Object.keys(value).sort().join() !==
    "config,createdAt,effectiveFrom,fingerprint,goalId,id,policyRef,revision,status,version"
  )
    issues.push("fields");
  if (value.version !== 1) issues.push("version");
  if (!isGoalMeasurementDefinitionId(value.id)) issues.push("id");
  if (typeof value.goalId !== "string" || !UUID.test(value.goalId)) issues.push("goalId");
  if (!Number.isSafeInteger(value.revision) || Number(value.revision) < 1) issues.push("revision");
  if (value.status !== "active" && value.status !== "inactive") issues.push("status");
  if (
    !record(value.policyRef) ||
    Object.keys(value.policyRef).sort().join() !== "id,version" ||
    !POLICY.test(String(value.policyRef.id)) ||
    !Number.isSafeInteger(value.policyRef.version) ||
    Number(value.policyRef.version) < 1
  )
    issues.push("policyRef");
  const checked = issues.includes("policyRef")
    ? { status: "invalid" as const }
    : validatePolicyConfig(value.policyRef as GoalMeasurementPolicyRef, value.config);
  if (checked.status === "invalid") issues.push("config");
  if (!timestamp(value.effectiveFrom)) issues.push("effectiveFrom");
  if (!timestamp(value.createdAt)) issues.push("createdAt");
  if (value.createdAt !== value.effectiveFrom) issues.push("saveTime");
  const candidate = {
    version: 1 as const,
    id: value.id as GoalMeasurementDefinitionId,
    goalId: value.goalId as GoalId,
    revision: Number(value.revision),
    status: value.status as "active" | "inactive",
    policyRef: structuredClone(value.policyRef) as GoalMeasurementPolicyRef,
    config: checked.status === "valid" ? checked.config : {},
    effectiveFrom: String(value.effectiveFrom),
    createdAt: String(value.createdAt),
    fingerprint: String(value.fingerprint),
  };
  if (
    typeof value.fingerprint !== "string" ||
    value.fingerprint !== definitionSemanticFingerprint(candidate)
  )
    issues.push("fingerprint");
  return issues.length
    ? { status: "invalid", issues: [...new Set(issues)] }
    : {
        status: "valid",
        definition: structuredClone(candidate),
        support: checked.status === "valid" ? checked.support : "unsupported",
      };
}
export function validateMeasurementDefinitionAuthority(
  value: unknown,
  goalExists?: (id: GoalId) => boolean,
):
  | { status: "valid"; authority: GoalMeasurementDefinitionAuthorityV1 }
  | { status: "invalid"; issues: string[] } {
  if (
    !record(value) ||
    value.version !== 1 ||
    Object.keys(value).sort().join() !== "definitions,version" ||
    !Array.isArray(value.definitions)
  )
    return { status: "invalid", issues: ["authority"] };
  const definitions: GoalMeasurementDefinitionV1[] = [];
  const issues: string[] = [];
  for (const raw of value.definitions) {
    const checked = validateMeasurementDefinition(raw);
    if (checked.status === "invalid") {
      issues.push(...checked.issues);
      continue;
    }
    if (goalExists && !goalExists(checked.definition.goalId)) issues.push("orphanGoal");
    definitions.push(checked.definition);
  }
  const idsByGoal = new Map<string, string>();
  const seen = new Set<string>();
  for (const item of definitions) {
    const prior = idsByGoal.get(item.goalId);
    if (prior && prior !== item.id) issues.push("multipleLineages");
    idsByGoal.set(item.goalId, item.id);
    const key = `${item.id}|${item.revision}`;
    if (seen.has(key)) issues.push("duplicateRevision");
    seen.add(key);
  }
  definitions.sort(compareDefinitions);
  for (const id of new Set(definitions.map((item) => item.id))) {
    const group = definitions.filter((item) => item.id === id);
    for (let i = 0; i < group.length; i++) {
      if (group[i]!.revision !== i + 1) issues.push("revisionSequence");
      if (i && group[i]!.effectiveFrom <= group[i - 1]!.effectiveFrom)
        issues.push("effectiveOrder");
    }
  }
  return issues.length
    ? { status: "invalid", issues: [...new Set(issues)] }
    : { status: "valid", authority: { version: 1, definitions: structuredClone(definitions) } };
}
export function resolveMeasurementDefinition(
  authority: GoalMeasurementDefinitionAuthorityV1,
  goalId: GoalId,
  asOf: string,
) {
  const eligible = authority.definitions
    .filter((item) => item.goalId === goalId && item.effectiveFrom <= asOf)
    .sort(compareDefinitions);
  const value = eligible.at(-1);
  return !value || value.status === "inactive"
    ? { status: "notDefined" as const }
    : {
        status:
          measurementPolicySupport(value.policyRef) === "supported"
            ? ("available" as const)
            : ("unsupportedPolicy" as const),
        definition: structuredClone(value),
      };
}
export function compareDefinitions(a: GoalMeasurementDefinitionV1, b: GoalMeasurementDefinitionV1) {
  return a.goalId.localeCompare(b.goalId) || a.id.localeCompare(b.id) || a.revision - b.revision;
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
function jsonSafe(value: unknown): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(jsonSafe);
  return (
    record(value) && Object.keys(value).every((key) => key.length <= 100 && jsonSafe(value[key]))
  );
}
