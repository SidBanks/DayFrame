import type { GoalId } from "../goals/goal.js";
import {
  isCanonicalUnsignedDecimal,
  isGoalMeasurementDefinitionId,
  type GoalMeasurementDefinitionId,
  type GoalMeasurementDefinitionV1,
} from "../measurement/measurementDefinition.js";
import { semanticFingerprint } from "../../infrastructure/restore/restoreStaging.js";

export type GoalProgressObservationId = string & {
  readonly __goalProgressObservationId: unique symbol;
};
export type GoalProgressObservationV1 = {
  version: 1;
  id: GoalProgressObservationId;
  revision: number;
  goalId: GoalId;
  definitionId: GoalMeasurementDefinitionId;
  definitionRevision: number;
  unitId: string;
  value: string;
  observedAt: string;
  recordedAt: string;
  status: "active" | "retracted";
  fingerprint: string;
};
export type GoalProgressObservationAuthorityV1 = {
  version: 1;
  observations: GoalProgressObservationV1[];
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export function isGoalProgressObservationId(value: unknown): value is GoalProgressObservationId {
  return typeof value === "string" && UUID.test(value);
}
export function createGoalProgressObservationId(): GoalProgressObservationId {
  const value = globalThis.crypto?.randomUUID?.();
  if (!isGoalProgressObservationId(value))
    throw new Error("Cryptographic GoalProgressObservationId allocation failed.");
  return value;
}
export function isCanonicalObservationValue(value: unknown): value is string {
  return isCanonicalUnsignedDecimal(value);
}
export function observationSemanticFingerprint(
  value: Pick<
    GoalProgressObservationV1,
    "version" | "status" | "definitionId" | "definitionRevision" | "unitId" | "value" | "observedAt"
  >,
) {
  return semanticFingerprint({
    version: value.version,
    status: value.status,
    definitionId: value.definitionId,
    definitionRevision: value.definitionRevision,
    unitId: value.unitId,
    value: value.value,
    observedAt: value.observedAt,
  });
}
export function compareObservations(a: GoalProgressObservationV1, b: GoalProgressObservationV1) {
  return (
    a.goalId.localeCompare(b.goalId) ||
    a.definitionId.localeCompare(b.definitionId) ||
    a.definitionRevision - b.definitionRevision ||
    a.observedAt.localeCompare(b.observedAt) ||
    a.id.localeCompare(b.id) ||
    a.revision - b.revision
  );
}
export function validateProgressObservation(
  value: unknown,
):
  | { status: "valid"; observation: GoalProgressObservationV1 }
  | { status: "invalid"; issues: string[] } {
  if (!record(value)) return { status: "invalid", issues: ["observation"] };
  const issues: string[] = [];
  if (
    Object.keys(value).sort().join() !==
    "definitionId,definitionRevision,fingerprint,goalId,id,observedAt,recordedAt,revision,status,unitId,value,version"
  )
    issues.push("fields");
  if (value.version !== 1) issues.push("version");
  if (!isGoalProgressObservationId(value.id)) issues.push("id");
  if (typeof value.goalId !== "string" || !UUID.test(value.goalId)) issues.push("goalId");
  if (!isGoalMeasurementDefinitionId(value.definitionId)) issues.push("definitionId");
  if (!Number.isSafeInteger(value.definitionRevision) || Number(value.definitionRevision) < 1)
    issues.push("definitionRevision");
  if (!Number.isSafeInteger(value.revision) || Number(value.revision) < 1) issues.push("revision");
  if (typeof value.unitId !== "string" || value.unitId.length < 1 || value.unitId.length > 100)
    issues.push("unitId");
  if (!isCanonicalObservationValue(value.value)) issues.push("value");
  if (value.status !== "active" && value.status !== "retracted") issues.push("status");
  if (!timestamp(value.observedAt)) issues.push("observedAt");
  if (!timestamp(value.recordedAt)) issues.push("recordedAt");
  if (
    timestamp(value.observedAt) &&
    timestamp(value.recordedAt) &&
    String(value.observedAt) > String(value.recordedAt)
  )
    issues.push("futureObservedAt");
  const candidate = {
    version: 1 as const,
    id: value.id as GoalProgressObservationId,
    revision: Number(value.revision),
    goalId: value.goalId as GoalId,
    definitionId: value.definitionId as GoalMeasurementDefinitionId,
    definitionRevision: Number(value.definitionRevision),
    unitId: String(value.unitId),
    value: String(value.value),
    observedAt: String(value.observedAt),
    recordedAt: String(value.recordedAt),
    status: value.status as "active" | "retracted",
    fingerprint: String(value.fingerprint),
  };
  if (
    typeof value.fingerprint !== "string" ||
    value.fingerprint !== observationSemanticFingerprint(candidate)
  )
    issues.push("fingerprint");
  return issues.length
    ? { status: "invalid", issues: [...new Set(issues)] }
    : { status: "valid", observation: structuredClone(candidate) };
}
export function validateProgressObservationAuthority(
  value: unknown,
  refs?: {
    goalExists: (id: GoalId) => boolean;
    getDefinition: (
      id: GoalMeasurementDefinitionId,
      revision: number,
    ) => GoalMeasurementDefinitionV1 | undefined;
  },
):
  | { status: "valid"; authority: GoalProgressObservationAuthorityV1 }
  | { status: "invalid"; issues: string[] } {
  if (
    !record(value) ||
    value.version !== 1 ||
    Object.keys(value).sort().join() !== "observations,version" ||
    !Array.isArray(value.observations)
  )
    return { status: "invalid", issues: ["authority"] };
  const observations: GoalProgressObservationV1[] = [],
    issues: string[] = [];
  for (const raw of value.observations) {
    const checked = validateProgressObservation(raw);
    if (checked.status === "invalid") {
      issues.push(...checked.issues);
      continue;
    }
    observations.push(checked.observation);
  }
  const groups = new Map<string, GoalProgressObservationV1[]>(),
    seen = new Set<string>();
  for (const item of observations) {
    const key = `${item.id}|${item.revision}`;
    if (seen.has(key)) issues.push("duplicateRevision");
    seen.add(key);
    const group = groups.get(item.id) ?? [];
    group.push(item);
    groups.set(item.id, group);
    if (refs) {
      if (!refs.goalExists(item.goalId)) issues.push("orphanGoal");
      const definition = refs.getDefinition(item.definitionId, item.definitionRevision);
      if (!definition) issues.push("missingDefinition");
      else {
        if (definition.goalId !== item.goalId) issues.push("goalMismatch");
        const unit =
          typeof definition.config.unitId === "string" ? definition.config.unitId : undefined;
        if (unit !== item.unitId) issues.push("unitMismatch");
        if (!definitionActiveAt(definition, item.observedAt, refs.getDefinition))
          issues.push("definitionEpochMismatch");
      }
    }
  }
  for (const group of groups.values()) {
    group.sort((a, b) => a.revision - b.revision);
    const first = group[0];
    for (let index = 0; index < group.length; index++) {
      const item = group[index]!;
      if (item.revision !== index + 1) issues.push("revisionSequence");
      if (index && item.recordedAt <= group[index - 1]!.recordedAt) issues.push("recordedOrder");
      if (
        first &&
        (item.goalId !== first.goalId ||
          item.definitionId !== first.definitionId ||
          item.definitionRevision !== first.definitionRevision ||
          item.unitId !== first.unitId)
      )
        issues.push("bindingChanged");
      if (index && group[index - 1]!.status === "retracted") issues.push("revisionAfterRetraction");
    }
  }
  observations.sort(compareObservations);
  const heads = [...groups.values()]
    .map((group) => group.at(-1)!)
    .filter((item) => item.status === "active");
  const conflicts = new Set<string>();
  for (const head of heads) {
    const key = `${head.goalId}|${head.definitionId}|${head.definitionRevision}|${head.observedAt}`;
    if (conflicts.has(key)) issues.push("sameTimeConflict");
    conflicts.add(key);
  }
  return issues.length
    ? { status: "invalid", issues: [...new Set(issues)] }
    : { status: "valid", authority: { version: 1, observations: structuredClone(observations) } };
}
export function effectiveObservationHead(
  authority: GoalProgressObservationAuthorityV1,
  id: GoalProgressObservationId,
  evaluationAsOf: string,
): GoalProgressObservationV1 | undefined {
  const head = authority.observations
    .filter((item) => item.id === id && item.recordedAt <= evaluationAsOf)
    .sort((a, b) => a.revision - b.revision)
    .at(-1);
  return head ? structuredClone(head) : undefined;
}
export function effectiveGoalObservations(
  authority: GoalProgressObservationAuthorityV1,
  goalId: GoalId,
  evaluationAsOf: string,
): GoalProgressObservationV1[] {
  const ids = new Set<GoalProgressObservationId>(
    authority.observations.filter((item) => item.goalId === goalId).map((item) => item.id),
  );
  return [...ids]
    .map((id) => effectiveObservationHead(authority, id, evaluationAsOf))
    .filter((item): item is GoalProgressObservationV1 => !!item && item.status === "active")
    .sort(compareObservations)
    .map((item) => structuredClone(item));
}
export function latestEffectiveObservation(
  authority: GoalProgressObservationAuthorityV1,
  goalId: GoalId,
  definitionId: GoalMeasurementDefinitionId,
  definitionRevision: number,
  evaluationAsOf: string,
): GoalProgressObservationV1 | undefined {
  return effectiveGoalObservations(authority, goalId, evaluationAsOf)
    .filter(
      (item) =>
        item.definitionId === definitionId &&
        item.definitionRevision === definitionRevision &&
        item.observedAt <= evaluationAsOf,
    )
    .sort(
      (a, b) =>
        a.observedAt.localeCompare(b.observedAt) ||
        a.recordedAt.localeCompare(b.recordedAt) ||
        a.id.localeCompare(b.id),
    )
    .at(-1);
}
function definitionActiveAt(
  definition: GoalMeasurementDefinitionV1,
  at: string,
  get: (
    id: GoalMeasurementDefinitionId,
    revision: number,
  ) => GoalMeasurementDefinitionV1 | undefined,
) {
  if (definition.status !== "active" || definition.effectiveFrom > at) return false;
  const next = get(definition.id, definition.revision + 1);
  return !next || at < next.effectiveFrom;
}
export function isDefinitionActiveAt(
  definition: GoalMeasurementDefinitionV1,
  at: string,
  get: (
    id: GoalMeasurementDefinitionId,
    revision: number,
  ) => GoalMeasurementDefinitionV1 | undefined,
) {
  return definitionActiveAt(definition, at, get);
}
export function isCanonicalInstant(value: unknown): value is string {
  return timestamp(value);
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
