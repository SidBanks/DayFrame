import { isSourceIncarnationId, type SourceIncarnationId } from "../authored/sourceIncarnation.js";
import { generateBlockCandidates } from "../blocks/generateBlockCandidates.js";
import { generateCycleWorkBlocks } from "../cycles/generateCycleWorkBlocks.js";
import { resolveShiftCycleMode } from "../cycles/shiftCycleUtils.js";
import type { LocalDateString } from "../shifts/types.js";
import type { DayFrameAuthoredSetup } from "../../state/types.js";
import type {
  ManualEventOccurrenceIdentity,
  OccurrenceIdentity,
  TemplateOccurrenceIdentity,
  WorkOccurrenceIdentity,
} from "./occurrenceIdentity.js";

export const DURABLE_OCCURRENCE_REFERENCE_VERSION = 1 as const;

type SourceLifetime = { id: string; incarnationId: SourceIncarnationId };

export type DurableTemplateOccurrenceReference = {
  version: typeof DURABLE_OCCURRENCE_REFERENCE_VERSION;
  sourceKind: "template";
  template: SourceLifetime;
  recurrence: SourceLifetime;
  coordinate:
    | {
        frequency: "daily" | "specificWeekdays";
        scopeKind: "userDay";
        userDayDate: LocalDateString;
        slot: number;
      }
    | {
        frequency: "weekly" | "timesPerUserWeek";
        scopeKind: "userWeek";
        userWeekStartDate: LocalDateString;
        slot: number;
      };
};

export type DurableWorkOccurrenceReference = {
  version: typeof DURABLE_OCCURRENCE_REFERENCE_VERSION;
  sourceKind: "work";
  cycle: SourceLifetime;
  entry: SourceLifetime & { kind: "segment" | "sequenceEntry" };
  shiftDefinition: SourceLifetime;
  coordinate: { localStartDate: LocalDateString; slot: 0 };
};

export type DurableManualEventOccurrenceReference = {
  version: typeof DURABLE_OCCURRENCE_REFERENCE_VERSION;
  sourceKind: "manualEvent";
  manualEvent: SourceLifetime;
};

export type DurableOccurrenceReference =
  | DurableTemplateOccurrenceReference
  | DurableWorkOccurrenceReference
  | DurableManualEventOccurrenceReference;

export type DurableOccurrenceReferenceValidation =
  | { status: "valid"; reference: DurableOccurrenceReference }
  | { status: "invalid"; issues: string[] }
  | { status: "unsupportedVersion"; version: unknown };

export type DurableOccurrenceReferenceConstruction =
  | { status: "created"; reference: DurableOccurrenceReference }
  | { status: "unsupportedOccurrence"; sourceKind: string }
  | { status: "missingSourceLineage"; component: DurableOccurrenceLineageComponent };

export type DurableOccurrenceLineageComponent =
  | "template"
  | "recurrence"
  | "cycle"
  | "entry"
  | "shiftDefinition"
  | "manualEvent";

export type DurableOccurrenceResolution =
  | {
      status: "resolved";
      reference: DurableOccurrenceReference;
      occurrenceIdentity: OccurrenceIdentity;
    }
  | { status: "sourceMissing"; component: DurableOccurrenceLineageComponent }
  | { status: "lifetimeMismatch"; component: DurableOccurrenceLineageComponent }
  | { status: "occurrenceMissing" }
  | { status: "invalidReference"; issues: string[] }
  | { status: "unsupportedVersion"; version: unknown };

export function createDurableOccurrenceReference(
  identity: OccurrenceIdentity,
  state: DayFrameAuthoredSetup,
): DurableOccurrenceReferenceConstruction {
  switch (identity.sourceKind) {
    case "template":
      return createDurableTemplateOccurrenceReference(identity, state);
    case "work":
      return createDurableWorkOccurrenceReference(identity, state);
    case "manualEvent":
      return createDurableManualEventOccurrenceReference(identity, state);
    default:
      return {
        status: "unsupportedOccurrence",
        sourceKind: String((identity as { sourceKind?: unknown }).sourceKind),
      };
  }
}

export function createDurableTemplateOccurrenceReference(
  identity: TemplateOccurrenceIdentity,
  state: DayFrameAuthoredSetup,
): DurableOccurrenceReferenceConstruction {
  const template = state.blockTemplates.find((source) => source.id === identity.templateId);
  if (!template) return { status: "missingSourceLineage", component: "template" };
  const recurrence = state.blockRecurrences.find((source) => source.id === identity.recurrenceId);
  if (!recurrence || recurrence.blockTemplateId !== template.id) {
    return { status: "missingSourceLineage", component: "recurrence" };
  }
  const coordinate =
    identity.scopeKind === "userDay"
      ? {
          frequency: identity.frequency,
          scopeKind: "userDay" as const,
          userDayDate: identity.userDayDate,
          slot: identity.slot,
        }
      : {
          frequency: identity.frequency,
          scopeKind: "userWeek" as const,
          userWeekStartDate: identity.userWeekStartDate,
          slot: identity.slot,
        };
  return {
    status: "created",
    reference: {
      version: DURABLE_OCCURRENCE_REFERENCE_VERSION,
      sourceKind: "template",
      template: lifetime(template),
      recurrence: lifetime(recurrence),
      coordinate,
    },
  };
}

export function createDurableWorkOccurrenceReference(
  identity: WorkOccurrenceIdentity,
  state: DayFrameAuthoredSetup,
): DurableOccurrenceReferenceConstruction {
  const cycle = state.shiftCycles.find((source) => source.id === identity.shiftCycleId);
  if (!cycle) return { status: "missingSourceLineage", component: "cycle" };
  const isSequence = resolveShiftCycleMode(cycle) === "repeatingSequence";
  const entry = isSequence
    ? cycle.sequence?.find((source) => source.id === identity.shiftSegmentId)
    : cycle.segments.find((source) => source.id === identity.shiftSegmentId);
  if (!entry) return { status: "missingSourceLineage", component: "entry" };
  const shiftDefinition = state.shiftDefinitions.find(
    (source) => source.id === identity.shiftDefinitionId,
  );
  if (!shiftDefinition) return { status: "missingSourceLineage", component: "shiftDefinition" };
  return {
    status: "created",
    reference: {
      version: DURABLE_OCCURRENCE_REFERENCE_VERSION,
      sourceKind: "work",
      cycle: lifetime(cycle),
      entry: { ...lifetime(entry), kind: isSequence ? "sequenceEntry" : "segment" },
      shiftDefinition: lifetime(shiftDefinition),
      coordinate: { localStartDate: identity.localStartDate, slot: 0 },
    },
  };
}

export function createDurableManualEventOccurrenceReference(
  identity: ManualEventOccurrenceIdentity,
  state: DayFrameAuthoredSetup,
): DurableOccurrenceReferenceConstruction {
  const manualEvent = state.manualEvents.find((source) => source.id === identity.manualEventId);
  if (!manualEvent) return { status: "missingSourceLineage", component: "manualEvent" };
  return {
    status: "created",
    reference: {
      version: DURABLE_OCCURRENCE_REFERENCE_VERSION,
      sourceKind: "manualEvent",
      manualEvent: lifetime(manualEvent),
    },
  };
}

export function validateDurableOccurrenceReference(
  value: unknown,
): DurableOccurrenceReferenceValidation {
  if (!isRecord(value)) return { status: "invalid", issues: ["reference must be an object"] };
  if (value.version !== DURABLE_OCCURRENCE_REFERENCE_VERSION) {
    return typeof value.version === "number"
      ? { status: "unsupportedVersion", version: value.version }
      : { status: "invalid", issues: ["version must be 1"] };
  }
  const issues: string[] = [];
  if (value.sourceKind === "template") validateTemplate(value, issues);
  else if (value.sourceKind === "work") validateWork(value, issues);
  else if (value.sourceKind === "manualEvent") validateManual(value, issues);
  else issues.push("sourceKind is unsupported");
  return issues.length > 0
    ? { status: "invalid", issues }
    : {
        status: "valid",
        reference: cloneDurableOccurrenceReference(value as DurableOccurrenceReference),
      };
}

export function cloneDurableOccurrenceReference(
  reference: DurableOccurrenceReference,
): DurableOccurrenceReference {
  if (reference.sourceKind === "template")
    return {
      ...reference,
      template: { ...reference.template },
      recurrence: { ...reference.recurrence },
      coordinate: { ...reference.coordinate },
    };
  if (reference.sourceKind === "work")
    return {
      ...reference,
      cycle: { ...reference.cycle },
      entry: { ...reference.entry },
      shiftDefinition: { ...reference.shiftDefinition },
      coordinate: { ...reference.coordinate },
    };
  return { ...reference, manualEvent: { ...reference.manualEvent } };
}

export function durableOccurrenceReferencesEqual(
  left: DurableOccurrenceReference,
  right: DurableOccurrenceReference,
): boolean {
  if (left.version !== right.version || left.sourceKind !== right.sourceKind) return false;
  if (left.sourceKind === "manualEvent" && right.sourceKind === "manualEvent") {
    return lifetimesEqual(left.manualEvent, right.manualEvent);
  }
  if (left.sourceKind === "work" && right.sourceKind === "work") {
    return (
      lifetimesEqual(left.cycle, right.cycle) &&
      lifetimesEqual(left.entry, right.entry) &&
      left.entry.kind === right.entry.kind &&
      lifetimesEqual(left.shiftDefinition, right.shiftDefinition) &&
      left.coordinate.localStartDate === right.coordinate.localStartDate &&
      left.coordinate.slot === right.coordinate.slot
    );
  }
  if (left.sourceKind === "template" && right.sourceKind === "template") {
    if (
      !lifetimesEqual(left.template, right.template) ||
      !lifetimesEqual(left.recurrence, right.recurrence) ||
      left.coordinate.frequency !== right.coordinate.frequency ||
      left.coordinate.scopeKind !== right.coordinate.scopeKind ||
      left.coordinate.slot !== right.coordinate.slot
    )
      return false;
    return left.coordinate.scopeKind === "userDay" && right.coordinate.scopeKind === "userDay"
      ? left.coordinate.userDayDate === right.coordinate.userDayDate
      : left.coordinate.scopeKind === "userWeek" &&
          right.coordinate.scopeKind === "userWeek" &&
          left.coordinate.userWeekStartDate === right.coordinate.userWeekStartDate;
  }
  return false;
}

export function resolveDurableOccurrenceReference(
  value: unknown,
  state: DayFrameAuthoredSetup,
): DurableOccurrenceResolution {
  const validation = validateDurableOccurrenceReference(value);
  if (validation.status === "invalid")
    return { status: "invalidReference", issues: validation.issues };
  if (validation.status === "unsupportedVersion") return validation;
  const reference = validation.reference;
  if (reference.sourceKind === "manualEvent") {
    const event = state.manualEvents.find((source) => source.id === reference.manualEvent.id);
    const failure = compareLifetime(event, reference.manualEvent, "manualEvent");
    return (
      failure ?? {
        status: "resolved",
        reference,
        occurrenceIdentity: { version: 1, sourceKind: "manualEvent", manualEventId: event!.id },
      }
    );
  }
  if (reference.sourceKind === "template") return resolveTemplate(reference, state);
  return resolveWork(reference, state);
}

function resolveTemplate(
  reference: DurableTemplateOccurrenceReference,
  state: DayFrameAuthoredSetup,
): DurableOccurrenceResolution {
  const template = state.blockTemplates.find((source) => source.id === reference.template.id);
  const templateFailure = compareLifetime(template, reference.template, "template");
  if (templateFailure) return templateFailure;
  const recurrence = state.blockRecurrences.find((source) => source.id === reference.recurrence.id);
  const recurrenceFailure = compareLifetime(recurrence, reference.recurrence, "recurrence");
  if (recurrenceFailure) return recurrenceFailure;
  if (
    recurrence!.blockTemplateId !== template!.id ||
    recurrence!.frequency !== reference.coordinate.frequency
  ) {
    return { status: "occurrenceMissing" };
  }
  const anchor =
    reference.coordinate.scopeKind === "userDay"
      ? reference.coordinate.userDayDate
      : reference.coordinate.userWeekStartDate;
  const candidates = generateBlockCandidates({
    blockTemplates: [template!],
    blockRecurrences: [recurrence!],
    shiftCycles: state.shiftCycles,
    defaultSchedulingPreferences: state.schedulingPreferences,
    planningWindowStart: dateOffset(anchor, -2),
    planningWindowEnd: dateOffset(anchor, 10),
  });
  const identity = candidates
    .map((candidate) => candidate.occurrenceIdentity)
    .find(
      (candidate) =>
        candidate?.sourceKind === "template" && templateCoordinateMatches(reference, candidate),
    );
  return identity
    ? { status: "resolved", reference, occurrenceIdentity: identity }
    : { status: "occurrenceMissing" };
}

function resolveWork(
  reference: DurableWorkOccurrenceReference,
  state: DayFrameAuthoredSetup,
): DurableOccurrenceResolution {
  const cycle = state.shiftCycles.find((source) => source.id === reference.cycle.id);
  const cycleFailure = compareLifetime(cycle, reference.cycle, "cycle");
  if (cycleFailure) return cycleFailure;
  const entry =
    reference.entry.kind === "segment"
      ? cycle!.segments.find((source) => source.id === reference.entry.id)
      : cycle!.sequence?.find((source) => source.id === reference.entry.id);
  const entryFailure = compareLifetime(entry, reference.entry, "entry");
  if (entryFailure) return entryFailure;
  const shift = state.shiftDefinitions.find((source) => source.id === reference.shiftDefinition.id);
  const shiftFailure = compareLifetime(shift, reference.shiftDefinition, "shiftDefinition");
  if (shiftFailure) return shiftFailure;
  const blocks = generateCycleWorkBlocks({
    shiftCycles: [cycle!],
    shiftDefinitions: [shift!],
    defaultSchedulingPreferences: state.schedulingPreferences,
    planningWindowStart: dateOffset(reference.coordinate.localStartDate, -1),
    planningWindowEnd: dateOffset(reference.coordinate.localStartDate, 2),
  });
  const identity = blocks
    .map((block) => block.occurrenceIdentity)
    .find(
      (candidate) =>
        candidate?.sourceKind === "work" &&
        candidate.shiftCycleId === reference.cycle.id &&
        candidate.shiftSegmentId === reference.entry.id &&
        candidate.shiftDefinitionId === reference.shiftDefinition.id &&
        candidate.localStartDate === reference.coordinate.localStartDate &&
        candidate.slot === 0,
    );
  return identity
    ? { status: "resolved", reference, occurrenceIdentity: identity }
    : { status: "occurrenceMissing" };
}

function templateCoordinateMatches(
  reference: DurableTemplateOccurrenceReference,
  identity: TemplateOccurrenceIdentity,
): boolean {
  if (
    identity.frequency !== reference.coordinate.frequency ||
    identity.slot !== reference.coordinate.slot ||
    identity.templateId !== reference.template.id ||
    identity.recurrenceId !== reference.recurrence.id ||
    identity.scopeKind !== reference.coordinate.scopeKind
  )
    return false;
  return identity.scopeKind === "userDay" && reference.coordinate.scopeKind === "userDay"
    ? identity.userDayDate === reference.coordinate.userDayDate
    : identity.scopeKind === "userWeek" &&
        reference.coordinate.scopeKind === "userWeek" &&
        identity.userWeekStartDate === reference.coordinate.userWeekStartDate;
}

function compareLifetime(
  source: { incarnationId: SourceIncarnationId } | undefined,
  expected: SourceLifetime,
  component: DurableOccurrenceLineageComponent,
): Extract<DurableOccurrenceResolution, { status: "sourceMissing" | "lifetimeMismatch" }> | null {
  if (!source) return { status: "sourceMissing", component };
  return source.incarnationId === expected.incarnationId
    ? null
    : { status: "lifetimeMismatch", component };
}

function lifetime(source: { id: string; incarnationId: SourceIncarnationId }): SourceLifetime {
  return { id: source.id, incarnationId: source.incarnationId };
}

function lifetimesEqual(left: SourceLifetime, right: SourceLifetime): boolean {
  return left.id === right.id && left.incarnationId === right.incarnationId;
}

function validateTemplate(value: Record<string, unknown>, issues: string[]): void {
  exactKeys(
    value,
    ["version", "sourceKind", "template", "recurrence", "coordinate"],
    "reference",
    issues,
  );
  validateLifetime(value.template, "template", issues);
  validateLifetime(value.recurrence, "recurrence", issues);
  if (!isRecord(value.coordinate)) {
    issues.push("coordinate must be an object");
    return;
  }
  const coordinate = value.coordinate;
  if (coordinate.scopeKind === "userDay") {
    exactKeys(coordinate, ["frequency", "scopeKind", "userDayDate", "slot"], "coordinate", issues);
    if (coordinate.frequency !== "daily" && coordinate.frequency !== "specificWeekdays")
      issues.push("invalid user-day frequency");
    validateDate(coordinate.userDayDate, "coordinate.userDayDate", issues);
  } else if (coordinate.scopeKind === "userWeek") {
    exactKeys(
      coordinate,
      ["frequency", "scopeKind", "userWeekStartDate", "slot"],
      "coordinate",
      issues,
    );
    if (coordinate.frequency !== "weekly" && coordinate.frequency !== "timesPerUserWeek")
      issues.push("invalid user-week frequency");
    validateDate(coordinate.userWeekStartDate, "coordinate.userWeekStartDate", issues);
  } else issues.push("coordinate.scopeKind is invalid");
  validateSlot(coordinate.slot, false, issues);
}

function validateWork(value: Record<string, unknown>, issues: string[]): void {
  exactKeys(
    value,
    ["version", "sourceKind", "cycle", "entry", "shiftDefinition", "coordinate"],
    "reference",
    issues,
  );
  validateLifetime(value.cycle, "cycle", issues);
  validateLifetime(value.shiftDefinition, "shiftDefinition", issues);
  validateLifetime(value.entry, "entry", issues, ["kind"]);
  if (
    isRecord(value.entry) &&
    value.entry.kind !== "segment" &&
    value.entry.kind !== "sequenceEntry"
  )
    issues.push("entry.kind is invalid");
  if (!isRecord(value.coordinate)) {
    issues.push("coordinate must be an object");
    return;
  }
  exactKeys(value.coordinate, ["localStartDate", "slot"], "coordinate", issues);
  validateDate(value.coordinate.localStartDate, "coordinate.localStartDate", issues);
  validateSlot(value.coordinate.slot, true, issues);
}

function validateManual(value: Record<string, unknown>, issues: string[]): void {
  exactKeys(value, ["version", "sourceKind", "manualEvent"], "reference", issues);
  validateLifetime(value.manualEvent, "manualEvent", issues);
}

function validateLifetime(
  value: unknown,
  path: string,
  issues: string[],
  extra: string[] = [],
): void {
  if (!isRecord(value)) {
    issues.push(`${path} must be an object`);
    return;
  }
  exactKeys(value, ["id", "incarnationId", ...extra], path, issues);
  if (typeof value.id !== "string" || value.id.length === 0)
    issues.push(`${path}.id must be non-empty`);
  if (!isSourceIncarnationId(value.incarnationId))
    issues.push(`${path}.incarnationId must be a canonical UUID v4`);
}

function validateSlot(value: unknown, zeroOnly: boolean, issues: string[]): void {
  if (!Number.isSafeInteger(value) || (value as number) < 0 || (zeroOnly && value !== 0))
    issues.push("coordinate.slot is invalid");
}

function validateDate(value: unknown, path: string, issues: string[]): void {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    issues.push(`${path} is invalid`);
    return;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value)
    issues.push(`${path} is invalid`);
}

function exactKeys(
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function dateOffset(value: LocalDateString, days: number): Date {
  const result = new Date(`${value}T00:00:00`);
  result.setDate(result.getDate() + days);
  return result;
}
