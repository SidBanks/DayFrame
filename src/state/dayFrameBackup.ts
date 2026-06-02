import { normalizePersistedPreviewRange } from "./createInitialDayFrameState.js";
import type { DayFrameAuthoredSetup } from "./types.js";

export type DayFrameBackupV1 = {
  app: "DayFrame";
  version: 1;
  exportedAt: string;
  data: DayFrameAuthoredSetup;
};

export function createDayFrameBackup(
  authoredSetup: DayFrameAuthoredSetup,
  exportedAt: string,
): DayFrameBackupV1 {
  return {
    app: "DayFrame",
    version: 1,
    exportedAt,
    data: cloneDayFrameAuthoredSetup(authoredSetup),
  };
}

export function parseDayFrameBackupJson(json: string): DayFrameBackupV1 {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json) as unknown;
  } catch {
    throw new RangeError("Backup file is not valid JSON.");
  }

  return validateDayFrameBackup(parsed);
}

export function validateDayFrameBackup(value: unknown): DayFrameBackupV1 {
  if (!isRecord(value)) {
    throw new RangeError("Backup file must contain a DayFrame backup object.");
  }

  if (value.app !== "DayFrame") {
    throw new RangeError("Backup file is not a DayFrame backup.");
  }

  if (value.version !== 1) {
    throw new RangeError("Backup file version is not supported.");
  }

  if (typeof value.exportedAt !== "string") {
    throw new RangeError("Backup file must include an exportedAt timestamp.");
  }

  if (!isRecord(value.data)) {
    throw new RangeError("Backup file must include authored setup data.");
  }

  const authoredSetup = normalizeAuthoredSetup(value.data);

  return {
    app: "DayFrame",
    version: 1,
    exportedAt: value.exportedAt,
    data: cloneDayFrameAuthoredSetup(authoredSetup),
  };
}

export function cloneDayFrameAuthoredSetup(
  authoredSetup: DayFrameAuthoredSetup,
): DayFrameAuthoredSetup {
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
    shiftCycle: authoredSetup.shiftCycle
      ? {
          ...authoredSetup.shiftCycle,
          segments: authoredSetup.shiftCycle.segments.map((segment) => ({
            ...segment,
            ...(segment.schedulePreferences
              ? {
                  schedulePreferences: {
                    ...segment.schedulePreferences,
                  },
                }
              : {}),
          })),
        }
      : null,
    blockTemplates: authoredSetup.blockTemplates.map((blockTemplate) => ({
      ...blockTemplate,
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

  if (!(value.shiftCycle === null || isRecord(value.shiftCycle))) {
    throw new RangeError("Backup file must include a valid shiftCycle.");
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

function normalizeAuthoredSetup(value: Record<string, unknown>): DayFrameAuthoredSetup {
  validateAuthoredSetup(value);
  const schedulingPreferences = value.schedulingPreferences as Record<string, unknown>;

  return {
    schedulingPreferences: {
      dayBoundaryStartTime:
        schedulingPreferences.dayBoundaryStartTime as DayFrameAuthoredSetup["schedulingPreferences"]["dayBoundaryStartTime"],
      weekStartsOn:
        schedulingPreferences.weekStartsOn as DayFrameAuthoredSetup["schedulingPreferences"]["weekStartsOn"],
    },
    previewRange: normalizePersistedPreviewRange(
      value.previewRange as Partial<DayFrameAuthoredSetup["previewRange"]> | undefined,
    ),
    shiftDefinitions: value.shiftDefinitions as DayFrameAuthoredSetup["shiftDefinitions"],
    shiftCycle: value.shiftCycle as DayFrameAuthoredSetup["shiftCycle"],
    blockTemplates: value.blockTemplates as DayFrameAuthoredSetup["blockTemplates"],
    blockRecurrences: value.blockRecurrences as DayFrameAuthoredSetup["blockRecurrences"],
    manualEvents: (value.manualEvents ?? []) as DayFrameAuthoredSetup["manualEvents"],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
