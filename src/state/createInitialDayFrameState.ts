import type { BlockRecurrence, BlockTemplate } from "../core/blocks/types.js";
import type { ManualCalendarEvent } from "../core/calendar/types.js";
import type { LocalDateString } from "../core/shifts/types.js";
import type { DayFramePreviewRange, DayFramePreviewRangePreset, DayFrameState } from "./types.js";

export type PersistedDayFrameState = Pick<
  DayFrameState,
  | "schedulingPreferences"
  | "previewRange"
  | "shiftDefinitions"
  | "shiftCycle"
  | "blockTemplates"
  | "blockRecurrences"
  | "manualEvents"
>;

export function createInitialDayFrameState(
  persistedState?: Partial<PersistedDayFrameState>,
): DayFrameState {
  const normalizedAuthoredSetup = normalizePersistedAuthoredSetup({
    shiftDefinitions: persistedState?.shiftDefinitions ?? [],
    shiftCycle: persistedState?.shiftCycle ?? null,
    blockTemplates: persistedState?.blockTemplates ?? [],
    blockRecurrences: persistedState?.blockRecurrences ?? [],
    manualEvents: persistedState?.manualEvents ?? [],
  });

  return {
    schedulingPreferences: {
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      ...persistedState?.schedulingPreferences,
    },
    previewRange: normalizePersistedPreviewRange(persistedState?.previewRange),
    shiftDefinitions: normalizedAuthoredSetup.shiftDefinitions,
    shiftCycle: normalizedAuthoredSetup.shiftCycle,
    blockTemplates: normalizedAuthoredSetup.blockTemplates,
    blockRecurrences: normalizedAuthoredSetup.blockRecurrences,
    manualEvents: normalizedAuthoredSetup.manualEvents,
    savedProfiles: [],
    preview: null,
  };
}

export function createDefaultPreviewRange(): DayFramePreviewRange {
  return {
    preset: "threeDays",
    startDate: "2026-05-04",
    endDate: "2026-05-06",
  };
}

export function normalizePersistedPreviewRange(
  previewRange?: Partial<DayFramePreviewRange> | null,
): DayFramePreviewRange {
  const defaultPreviewRange = createDefaultPreviewRange();

  if (!previewRange) {
    return defaultPreviewRange;
  }

  return {
    ...(previewRange.source ? { source: previewRange.source } : {}),
    preset: isPreviewRangePreset(previewRange.preset)
      ? previewRange.preset
      : defaultPreviewRange.preset,
    startDate:
      typeof previewRange.startDate === "string"
        ? (previewRange.startDate as LocalDateString)
        : defaultPreviewRange.startDate,
    endDate:
      typeof previewRange.endDate === "string"
        ? (previewRange.endDate as LocalDateString)
        : defaultPreviewRange.endDate,
  };
}

export function normalizePersistedAuthoredSetup(
  authoredSetup: Pick<
    DayFrameState,
    "shiftDefinitions" | "shiftCycle" | "blockTemplates" | "blockRecurrences" | "manualEvents"
  >,
): Pick<
  DayFrameState,
  "shiftDefinitions" | "shiftCycle" | "blockTemplates" | "blockRecurrences" | "manualEvents"
> {
  return {
    shiftDefinitions: authoredSetup.shiftDefinitions,
    shiftCycle: authoredSetup.shiftCycle,
    blockTemplates: normalizePersistedBlockTemplates(
      authoredSetup.blockTemplates,
      authoredSetup.blockRecurrences,
    ),
    blockRecurrences: authoredSetup.blockRecurrences,
    manualEvents: normalizePersistedManualEvents(authoredSetup.manualEvents),
  };
}

function normalizePersistedManualEvents(
  manualEvents: ManualCalendarEvent[],
): ManualCalendarEvent[] {
  return manualEvents.map((manualEvent) => ({ ...manualEvent }));
}

function normalizePersistedBlockTemplates(
  blockTemplates: BlockTemplate[],
  blockRecurrences: BlockRecurrence[],
): BlockTemplate[] {
  const hasDefaultSleepDailyRecurrence = blockRecurrences.some(
    (blockRecurrence) =>
      blockRecurrence.blockTemplateId === "default_sleep" && blockRecurrence.frequency === "daily",
  );

  return blockTemplates.map((blockTemplate) => {
    if (
      blockTemplate.id === "default_sleep" &&
      blockTemplate.enabled === false &&
      hasDefaultSleepDailyRecurrence &&
      blockTemplate.title === "Sleep" &&
      blockTemplate.category === "sleep" &&
      blockTemplate.durationMinutes === 480 &&
      (blockTemplate.preferredWindow === "beforeSleep" ||
        blockTemplate.preferredWindow === "beforeWork") &&
      blockTemplate.rescheduleBehavior === "autoSameUserWeek" &&
      blockTemplate.priority === 1 &&
      blockTemplate.requiresResource === false &&
      blockTemplate.externalResources.length === 0 &&
      (blockTemplate.bufferAfterMinutes === undefined || blockTemplate.bufferAfterMinutes === 60) &&
      blockTemplate.createdAt === blockTemplate.updatedAt
    ) {
      return {
        ...blockTemplate,
        enabled: true,
      };
    }

    return blockTemplate;
  });
}

function isPreviewRangePreset(value: unknown): value is DayFramePreviewRangePreset {
  return (
    value === "threeDays" ||
    value === "oneWeek" ||
    value === "twoWeeks" ||
    value === "oneMonth" ||
    value === "custom"
  );
}
