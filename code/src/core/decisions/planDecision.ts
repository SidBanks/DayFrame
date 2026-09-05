import {
  cloneDurableOccurrenceReference,
  durableOccurrenceReferencesEqual,
  validateDurableOccurrenceReference,
  type DurableOccurrenceReference,
} from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import type { TimeString } from "../time/types.js";

export const PLAN_DECISION_VERSION = 1 as const;
export type PlanDecisionId = string & { readonly __planDecisionId: unique symbol };
export type PlanDecisionIdAllocator = () => PlanDecisionId;

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const UTC_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

export function isPlanDecisionId(value: unknown): value is PlanDecisionId {
  return typeof value === "string" && UUID_V4.test(value);
}

export function createPlanDecisionId(): PlanDecisionId {
  const value = globalThis.crypto?.randomUUID?.call(globalThis.crypto);
  if (!isPlanDecisionId(value)) throw new Error("Cryptographic UUID-v4 allocation is unavailable.");
  return value;
}

export type PlanDecisionProvenance =
  | { source: "user" }
  | {
      source: "suggestedFix";
      suggestedAction: "moveBlock" | "skipBlock" | "reduceDuration" | "changePriority";
    };

type DecisionBase<K extends string, P> = {
  version: typeof PLAN_DECISION_VERSION;
  id: PlanDecisionId;
  kind: K;
  target: DurableOccurrenceReference;
  payload: P;
  acceptedAt: string;
  provenance: PlanDecisionProvenance;
};

export type PlanDecisionV1 =
  | DecisionBase<"placeOccurrence", { userDayDate: LocalDateString; startTime: TimeString }>
  | DecisionBase<"omitOccurrence", Record<string, never>>
  | DecisionBase<"setOccurrenceDuration", { durationMinutes: number }>
  | DecisionBase<"setOccurrencePriority", { priority: 1 | 2 | 3 | 4 | 5 }>;

export type AcceptPlanDecisionInput = PlanDecisionV1 extends infer D
  ? D extends PlanDecisionV1
    ? Omit<D, "version" | "id" | "acceptedAt">
    : never
  : never;

export type PlanDecisionValidation =
  | { status: "valid"; decision: PlanDecisionV1 }
  | { status: "invalid"; issues: string[] }
  | { status: "unsupportedVersion"; version: unknown }
  | { status: "unsupportedTargetVersion"; version: unknown };

export function validatePlanDecision(value: unknown): PlanDecisionValidation {
  if (!record(value)) return { status: "invalid", issues: ["decision must be an object"] };
  if (value.version !== PLAN_DECISION_VERSION) {
    return typeof value.version === "number"
      ? { status: "unsupportedVersion", version: value.version }
      : { status: "invalid", issues: ["version must be 1"] };
  }
  const issues: string[] = [];
  exact(
    value,
    ["version", "id", "kind", "target", "payload", "acceptedAt", "provenance"],
    "decision",
    issues,
  );
  if (!isPlanDecisionId(value.id)) issues.push("id must be a canonical UUID v4");
  if (
    typeof value.acceptedAt !== "string" ||
    !UTC_ISO.test(value.acceptedAt) ||
    Number.isNaN(Date.parse(value.acceptedAt))
  )
    issues.push("acceptedAt must be canonical UTC ISO-8601");
  validateProvenance(value.provenance, issues);
  const target = validateDurableOccurrenceReference(value.target);
  if (target.status === "unsupportedVersion")
    return { status: "unsupportedTargetVersion", version: target.version };
  if (target.status === "invalid") issues.push(...target.issues.map((issue) => `target: ${issue}`));
  validatePayload(value.kind, value.payload, issues);
  if (issues.length > 0 || target.status !== "valid") return { status: "invalid", issues };
  return { status: "valid", decision: clonePlanDecision(value as PlanDecisionV1) };
}

export function clonePlanDecision(decision: PlanDecisionV1): PlanDecisionV1 {
  return {
    ...decision,
    target: cloneDurableOccurrenceReference(decision.target),
    payload: { ...decision.payload },
    provenance: { ...decision.provenance },
  } as PlanDecisionV1;
}

export function planDecisionRecordsEqual(left: PlanDecisionV1, right: PlanDecisionV1): boolean {
  return left.id === right.id && planDecisionsSemanticallyEquivalent(left, right);
}

export function planDecisionsSemanticallyEquivalent(
  left: PlanDecisionV1,
  right: PlanDecisionV1,
): boolean {
  return (
    left.version === right.version &&
    left.kind === right.kind &&
    left.acceptedAt === right.acceptedAt &&
    durableOccurrenceReferencesEqual(left.target, right.target) &&
    canonicalObject(left.payload) === canonicalObject(right.payload) &&
    canonicalObject(left.provenance) === canonicalObject(right.provenance)
  );
}

export function getPlanDecisionTargetKey(target: DurableOccurrenceReference): string {
  if (target.sourceKind === "acceptedAllocation")
    return [
      "acceptedAllocation",
      target.realizationId,
      target.acceptedAllocationId,
      target.acceptedClaimId,
      target.scheduleRole,
      target.scheduledSubjectId,
    ].join("|");
  if (target.sourceKind === "manualEvent")
    return ["manualEvent", target.manualEvent.id, target.manualEvent.incarnationId].join("|");
  if (target.sourceKind === "work")
    return [
      "work",
      target.cycle.id,
      target.cycle.incarnationId,
      target.entry.kind,
      target.entry.id,
      target.entry.incarnationId,
      target.shiftDefinition.id,
      target.shiftDefinition.incarnationId,
      target.coordinate.localStartDate,
      target.coordinate.slot,
    ].join("|");
  const coordinate =
    target.coordinate.scopeKind === "userDay"
      ? [
          target.coordinate.frequency,
          "userDay",
          target.coordinate.userDayDate,
          target.coordinate.slot,
        ]
      : [
          target.coordinate.frequency,
          "userWeek",
          target.coordinate.userWeekStartDate,
          target.coordinate.slot,
        ];
  return [
    "template",
    target.template.id,
    target.template.incarnationId,
    target.recurrence.id,
    target.recurrence.incarnationId,
    ...coordinate,
  ].join("|");
}

function validatePayload(kind: unknown, value: unknown, issues: string[]): void {
  if (!record(value)) {
    issues.push("payload must be an object");
    return;
  }
  if (kind === "placeOccurrence") {
    exact(value, ["userDayDate", "startTime"], "payload", issues);
    if (!validDate(value.userDayDate)) issues.push("payload.userDayDate is invalid");
    if (typeof value.startTime !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value.startTime))
      issues.push("payload.startTime is invalid");
  } else if (kind === "omitOccurrence") {
    exact(value, [], "payload", issues);
  } else if (kind === "setOccurrenceDuration") {
    exact(value, ["durationMinutes"], "payload", issues);
    if (
      !Number.isSafeInteger(value.durationMinutes) ||
      (value.durationMinutes as number) < 1 ||
      (value.durationMinutes as number) > 1440
    )
      issues.push("payload.durationMinutes must be 1..1440");
  } else if (kind === "setOccurrencePriority") {
    exact(value, ["priority"], "payload", issues);
    if (![1, 2, 3, 4, 5].includes(value.priority as number))
      issues.push("payload.priority is invalid");
  } else issues.push("kind is unsupported");
}

function validateProvenance(value: unknown, issues: string[]): void {
  if (!record(value)) {
    issues.push("provenance must be an object");
    return;
  }
  if (value.source === "user") exact(value, ["source"], "provenance", issues);
  else if (value.source === "suggestedFix") {
    exact(value, ["source", "suggestedAction"], "provenance", issues);
    if (
      !["moveBlock", "skipBlock", "reduceDuration", "changePriority"].includes(
        value.suggestedAction as string,
      )
    )
      issues.push("provenance.suggestedAction is invalid");
  } else issues.push("provenance.source is invalid");
}

function validDate(value: unknown): boolean {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function canonicalObject(value: object): string {
  return JSON.stringify(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)));
}

function exact(
  value: Record<string, unknown>,
  keys: string[],
  path: string,
  issues: string[],
): void {
  const expected = new Set(keys);
  for (const key of Object.keys(value))
    if (!expected.has(key)) issues.push(`${path}.${key} is not allowed`);
  for (const key of keys) if (!(key in value)) issues.push(`${path}.${key} is required`);
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
