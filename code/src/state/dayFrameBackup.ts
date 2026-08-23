import { normalizePersistedPreviewRange } from "./createInitialDayFrameState.js";
import { normalizeManualCalendarEvents } from "./manualCalendarEvents.js";
import type { ActiveDayFrameAuthoredSetup, DayFrameAuthoredPattern } from "./types.js";
import { cloneActiveSetup, validateIncarnationGraph } from "./activeV2.js";
import { validateDayFrameAuthoredSetup } from "../core/authored/validateDayFrameAuthoredSetup.js";
import {
  cloneShiftCycles,
  normalizeShiftCycles as normalizeCycleArray,
} from "../core/cycles/shiftCycleUtils.js";
import { DAYFRAME_BACKUP_V3_VERSION, validateDayFrameBackupV3,
  type DayFrameBackupV3 } from "./dayFrameBackupV3.js";

export type DayFrameBackupV1 = {
  app: "DayFrame";
  version: 1;
  exportedAt: string;
  data: DayFrameAuthoredPattern;
};

export const DAYFRAME_BACKUP_V2_VERSION = 2 as const;

export type DayFrameBackupV2 = {
  app: "DayFrame";
  surface: "backup";
  version: typeof DAYFRAME_BACKUP_V2_VERSION;
  exportedAt: string;
  data: ActiveDayFrameAuthoredSetup;
};

export type DayFrameBackup = DayFrameBackupV1 | DayFrameBackupV2 | DayFrameBackupV3;

export type BackupValidationFailureCategory = "parseFailure" | "unsupportedVersion" |
  "envelopeValidationFailure" | "authoredValidationFailure" | "incarnationValidationFailure";

export class DayFrameBackupValidationError extends RangeError {
  constructor(public readonly category: BackupValidationFailureCategory, message: string) {
    super(message);
    this.name = "DayFrameBackupValidationError";
  }
}

export function createDayFrameBackupV2(
  authoredSetup: ActiveDayFrameAuthoredSetup,
  exportedAt: string,
): DayFrameBackupV2 {
  return {
    app: "DayFrame",
    surface: "backup",
    version: DAYFRAME_BACKUP_V2_VERSION,
    exportedAt,
    data: cloneActiveSetup(authoredSetup),
  };
}

export function createDayFrameBackupV1(authoredSetup: DayFrameAuthoredPattern,
  exportedAt: string): DayFrameBackupV1 {
  return { app: "DayFrame", version: 1, exportedAt,
    data: cloneDayFrameAuthoredSetup(authoredSetup) };
}

/** Historical Backup V1 fixture/compatibility creator. Current production export uses V2. */
export const createDayFrameBackup = createDayFrameBackupV1;

export function parseDayFrameBackupJson(json: string): DayFrameBackup {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json) as unknown;
  } catch {
    throw new DayFrameBackupValidationError("parseFailure", "Backup file is not valid JSON.");
  }

  return validateDayFrameBackup(parsed);
}

export function validateDayFrameBackup(value: unknown): DayFrameBackup {
  if (!isRecord(value)) {
    throw new DayFrameBackupValidationError("envelopeValidationFailure",
      "Backup file must contain a DayFrame backup object.");
  }

  if (value.app !== "DayFrame") {
    throw new DayFrameBackupValidationError("envelopeValidationFailure",
      "Backup file is not a DayFrame backup.");
  }
  if (value.version === 1) return validateDayFrameBackupV1(value);
  if (value.version === DAYFRAME_BACKUP_V2_VERSION) return validateDayFrameBackupV2(value);
  if (value.version === DAYFRAME_BACKUP_V3_VERSION) return validateDayFrameBackupV3(value);
  throw new DayFrameBackupValidationError("unsupportedVersion",
    "Backup file version is not supported.");
}

export function validateDayFrameBackupV1(value: unknown): DayFrameBackupV1 {
  if (!isRecord(value) || value.app !== "DayFrame" || value.version !== 1) {
    throw new DayFrameBackupValidationError("envelopeValidationFailure",
      "Backup V1 envelope is invalid.");
  }

  if (typeof value.exportedAt !== "string") {
    throw new DayFrameBackupValidationError("envelopeValidationFailure",
      "Backup file must include an exportedAt timestamp.");
  }

  if (!isRecord(value.data)) {
    throw new DayFrameBackupValidationError("envelopeValidationFailure",
      "Backup file must include authored setup data.");
  }

  let authoredSetup: DayFrameAuthoredPattern;
  try {
    authoredSetup = normalizeAuthoredSetup(value.data);
  } catch {
    throw new DayFrameBackupValidationError("authoredValidationFailure",
      "Backup V1 authored state is invalid.");
  }

  return {
    app: "DayFrame",
    version: 1,
    exportedAt: value.exportedAt,
    data: cloneDayFrameAuthoredSetup(authoredSetup),
  };
}

export function validateDayFrameBackupV2(value: unknown): DayFrameBackupV2 {
  if (!isRecord(value) || value.app !== "DayFrame" || value.surface !== "backup" ||
      value.version !== DAYFRAME_BACKUP_V2_VERSION || typeof value.exportedAt !== "string" ||
      !isRecord(value.data) || "shiftCycle" in value.data || !Array.isArray(value.data.shiftCycles)) {
    throw new DayFrameBackupValidationError("envelopeValidationFailure",
      "Backup V2 envelope is invalid.");
  }
  const data = value.data as unknown as ActiveDayFrameAuthoredSetup;
  try {
    validateIncarnationGraph(data);
  } catch {
    throw new DayFrameBackupValidationError("incarnationValidationFailure",
      "Backup V2 source incarnation graph is invalid.");
  }
  let validation: ReturnType<typeof validateDayFrameAuthoredSetup>;
  try {
    validation = validateDayFrameAuthoredSetup(data);
  } catch {
    throw new DayFrameBackupValidationError("authoredValidationFailure",
      "Backup V2 authored state is invalid.");
  }
  if (validation.status === "invalid") {
    throw new DayFrameBackupValidationError("authoredValidationFailure",
      "Backup V2 authored state is invalid.");
  }
  return { app: "DayFrame", surface: "backup", version: DAYFRAME_BACKUP_V2_VERSION,
    exportedAt: value.exportedAt, data: cloneActiveSetup(data) };
}

export function cloneDayFrameAuthoredSetup(
  authoredSetup: DayFrameAuthoredPattern,
): DayFrameAuthoredPattern {
  return {
    schedulingPreferences: {
      ...authoredSetup.schedulingPreferences,
    },
    previewRange: {
      ...authoredSetup.previewRange,
    },
    shiftDefinitions: authoredSetup.shiftDefinitions.map((shiftDefinition) => ({
      ...shiftDefinition,
    })),
    shiftCycles: cloneShiftCycles(authoredSetup.shiftCycles),
    blockTemplates: authoredSetup.blockTemplates.map((blockTemplate) => ({
      ...blockTemplate,
      requiresWorkAnchor: blockTemplate.requiresWorkAnchor ?? false,
      externalResources: blockTemplate.externalResources.map((externalResource) => ({
        ...externalResource,
        ...(externalResource.metadata ? { metadata: { ...externalResource.metadata } } : {}),
      })),
    })),
    blockRecurrences: authoredSetup.blockRecurrences.map((blockRecurrence) => ({
      ...blockRecurrence,
      ...(blockRecurrence.weekdays ? { weekdays: [...blockRecurrence.weekdays] } : {}),
    })),
    manualEvents: authoredSetup.manualEvents.map((manualEvent) => ({
      ...manualEvent,
    })),
  };
}

function validateAuthoredSetup(value: Record<string, unknown>): void {
  if (!isRecord(value.schedulingPreferences)) {
    throw new RangeError("Backup file must include schedulingPreferences.");
  }

  if (typeof value.schedulingPreferences.dayBoundaryStartTime !== "string") {
    throw new RangeError("Backup file must include a dayBoundaryStartTime.");
  }

  if (typeof value.schedulingPreferences.weekStartsOn !== "string") {
    throw new RangeError("Backup file must include a weekStartsOn value.");
  }

  if (value.previewRange !== undefined && !isRecord(value.previewRange)) {
    throw new RangeError("Backup file previewRange must be a valid object.");
  }

  if (!Array.isArray(value.shiftDefinitions)) {
    throw new RangeError("Backup file must include shiftDefinitions.");
  }

  if (
    value.shiftCycles !== undefined &&
    !Array.isArray(value.shiftCycles) &&
    !(value.shiftCycle === null || isRecord(value.shiftCycle))
  ) {
    throw new RangeError("Backup file must include valid shiftCycles.");
  }

  if (!Array.isArray(value.blockTemplates)) {
    throw new RangeError("Backup file must include blockTemplates.");
  }

  if (!Array.isArray(value.blockRecurrences)) {
    throw new RangeError("Backup file must include blockRecurrences.");
  }

  if (value.manualEvents !== undefined && !Array.isArray(value.manualEvents)) {
    throw new RangeError("Backup file manualEvents must be a valid array.");
  }
}

function normalizeAuthoredSetup(value: Record<string, unknown>): DayFrameAuthoredPattern {
  validateAuthoredSetup(value);
  const schedulingPreferences = value.schedulingPreferences as Record<string, unknown>;

  return {
    schedulingPreferences: {
      dayBoundaryStartTime:
        schedulingPreferences.dayBoundaryStartTime as DayFrameAuthoredPattern["schedulingPreferences"]["dayBoundaryStartTime"],
      weekStartsOn:
        schedulingPreferences.weekStartsOn as DayFrameAuthoredPattern["schedulingPreferences"]["weekStartsOn"],
    },
    previewRange: normalizePersistedPreviewRange(
      value.previewRange as Partial<DayFrameAuthoredPattern["previewRange"]> | undefined,
    ),
    shiftDefinitions: value.shiftDefinitions as DayFrameAuthoredPattern["shiftDefinitions"],
    shiftCycles: normalizeAuthoredShiftCycles(value),
    blockTemplates: value.blockTemplates as DayFrameAuthoredPattern["blockTemplates"],
    blockRecurrences: value.blockRecurrences as DayFrameAuthoredPattern["blockRecurrences"],
    manualEvents: normalizeManualCalendarEvents(value.manualEvents),
  };
}

function normalizeAuthoredShiftCycles(
  value: Record<string, unknown>,
): DayFrameAuthoredPattern["shiftCycles"] {
  if (Array.isArray(value.shiftCycles)) {
    return normalizeCycleArray(value.shiftCycles as DayFrameAuthoredPattern["shiftCycles"]);
  }

  return value.shiftCycle && isRecord(value.shiftCycle)
    ? normalizeCycleArray([
        value.shiftCycle as NonNullable<DayFrameAuthoredPattern["shiftCycles"]>[number],
      ])
    : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
