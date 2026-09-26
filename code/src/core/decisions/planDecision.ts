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

/** Exact geometry and compatibility evidence; revocation retains the original acceptance. */
export type AcceptedSleepPlacementPayloadV1 = {
  version: 1;
  sleepStart: string;
  sleepEnd: string;
  footprintStart: string;
  footprintEnd: string;
  proofStartUserDayDate: LocalDateString;
  proofEndUserDayDateExclusive: LocalDateString;
  requirementRevision: number;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  dependencyFingerprint: string;
  revokedAt: string | null;
};
export type PlanDecisionV1 =
  | DecisionBase<"placeSleepOccurrence", AcceptedSleepPlacementPayloadV1>
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
  if (
    target.status === "valid" &&
    (target.reference.sourceKind === "sleepRequirement") !== (value.kind === "placeSleepOccurrence")
  )
    issues.push("Sleep targets require an exact Sleep placement decision.");
  if (
    value.kind === "placeSleepOccurrence" &&
    record(value.provenance) &&
    value.provenance.source === "suggestedFix" &&
    value.provenance.suggestedAction !== "moveBlock"
  )
    issues.push("Sleep supports placement only.");
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
  if (target.sourceKind === "sleepRequirement")
    return [
      "sleepRequirement",
      target.requirement.id,
      target.requirement.incarnationId,
      target.coordinate.userDayDate,
      target.coordinate.slot,
    ].join("|");
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
  if (kind === "placeSleepOccurrence") {
    exact(
      value,
      [
        "version",
        "sleepStart",
        "sleepEnd",
        "footprintStart",
        "footprintEnd",
        "proofStartUserDayDate",
        "proofEndUserDayDateExclusive",
        "requirementRevision",
        "durationMinutes",
        "bufferBeforeMinutes",
        "bufferAfterMinutes",
        "dependencyFingerprint",
        "revokedAt",
      ],
      "payload",
      issues,
    );
    if (value.version !== 1) issues.push("Unsupported Sleep payload version");
    if (
      !validDate(value.proofStartUserDayDate) ||
      !validDate(value.proofEndUserDayDateExclusive) ||
      String(value.proofStartUserDayDate) >= String(value.proofEndUserDayDateExclusive)
    )
      issues.push("Invalid Sleep proof scope");
    for (const k of ["sleepStart", "sleepEnd", "footprintStart", "footprintEnd"]) {
      const t = value[k];
      if (
        typeof t !== "string" ||
        !UTC_ISO.test(t) ||
        !Number.isFinite(Date.parse(t)) ||
        Date.parse(t) % 60000 !== 0
      )
        issues.push(`payload.${k} must be a minute-aligned UTC instant`);
    }
    for (const [k, min, max] of [
      ["requirementRevision", 1, Number.MAX_SAFE_INTEGER],
      ["durationMinutes", 1, 1440],
      ["bufferBeforeMinutes", 0, 1440],
      ["bufferAfterMinutes", 0, 1440],
    ] as const)
      if (
        !Number.isSafeInteger(value[k]) ||
        (value[k] as number) < min ||
        (value[k] as number) > max
      )
        issues.push(`payload.${k} is invalid`);
    if (typeof value.dependencyFingerprint !== "string" || !value.dependencyFingerprint.length)
      issues.push("Missing Sleep dependency evidence");
    if (
      value.revokedAt !== null &&
      (typeof value.revokedAt !== "string" ||
        !UTC_ISO.test(value.revokedAt) ||
        !Number.isFinite(Date.parse(value.revokedAt)))
    )
      issues.push("Invalid revocation instant");
    const t = (k: string) => Date.parse(value[k] as string);
    if (
      t("sleepEnd") - t("sleepStart") !== (value.durationMinutes as number) * 60000 ||
      t("sleepStart") - t("footprintStart") !== (value.bufferBeforeMinutes as number) * 60000 ||
      t("footprintEnd") - t("sleepEnd") !== (value.bufferAfterMinutes as number) * 60000
    )
      issues.push("Sleep geometry must preserve duration and both buffers");
  } else if (kind === "placeOccurrence") {
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

/** Revoked evidence may coexist with one live decision per occurrence. */
export function getPlanDecisionConflictKey(decision: PlanDecisionV1): string {
  return decision.kind === "placeSleepOccurrence" && decision.payload.revokedAt !== null
    ? `revoked:${decision.id}`
    : getPlanDecisionTargetKey(decision.target);
}
