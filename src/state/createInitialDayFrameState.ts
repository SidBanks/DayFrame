import type { BlockRecurrence, BlockTemplate } from "../core/blocks/types.js";
import type { LocalDateString } from "../core/shifts/types.js";
import type { DayFramePreviewRange, DayFramePreviewRangePreset, DayFrameState } from "./types.js";
import { normalizeManualCalendarEvents } from "./manualCalendarEvents.js";

export type PersistedDayFrameState = Pick<
  DayFrameState,
  | "schedulingPreferences"
  | "previewRange"
  | "shiftDefinitions"
  | "shiftCycles"
  | "blockTemplates"
  | "blockRecurrences"
  | "manualEvents"
> & {
  shiftCycle?: DayFrameState["shiftCycles"][number] | null;
};

type LegacyPersistedDayFrameState = Partial<
  PersistedDayFrameState & {
    shiftCycle?: DayFrameState["shiftCycles"][number] | null;
  }
>;

export function createInitialDayFrameState(
  persistedState?: LegacyPersistedDayFrameState,
): DayFrameState {
  const normalizedAuthoredSetup = normalizePersistedAuthoredSetup({
    shiftDefinitions: persistedState?.shiftDefinitions ?? [],
    shiftCycles: normalizePersistedShiftCycles(persistedState),
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
    shiftCycles: normalizedAuthoredSetup.shiftCycles,
    shiftCycle: normalizedAuthoredSetup.shiftCycles[0] ?? null,
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
    "shiftDefinitions" | "shiftCycles" | "blockTemplates" | "blockRecurrences" | "manualEvents"
  >,
): Pick<
  DayFrameState,
  "shiftDefinitions" | "shiftCycles" | "blockTemplates" | "blockRecurrences" | "manualEvents"
> {
  return {
    shiftDefinitions: authoredSetup.shiftDefinitions,
    shiftCycles: authoredSetup.shiftCycles,
    blockTemplates: normalizePersistedBlockTemplates(
      authoredSetup.blockTemplates,
      authoredSetup.blockRecurrences,
    ),
    blockRecurrences: authoredSetup.blockRecurrences,
    manualEvents: normalizePersistedManualEvents(authoredSetup.manualEvents),
  };
}

function normalizePersistedManualEvents(manualEvents: unknown): DayFrameState["manualEvents"] {
  return normalizeManualCalendarEvents(manualEvents);
}

function normalizePersistedShiftCycles(
  persistedState?: LegacyPersistedDayFrameState,
): DayFrameState["shiftCycles"] {
  if (Array.isArray(persistedState?.shiftCycles)) {
    return persistedState.shiftCycles;
  }

  return persistedState?.shiftCycle ? [persistedState.shiftCycle] : [];
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
    const normalizedBlockTemplate = {
      ...blockTemplate,
      requiresWorkAnchor: blockTemplate.requiresWorkAnchor ?? false,
    };

    if (
      normalizedBlockTemplate.id === "default_sleep" &&
      normalizedBlockTemplate.enabled === false &&
      hasDefaultSleepDailyRecurrence &&
      normalizedBlockTemplate.title === "Sleep" &&
      normalizedBlockTemplate.category === "sleep" &&
      normalizedBlockTemplate.durationMinutes === 480 &&
      (normalizedBlockTemplate.preferredWindow === "beforeSleep" ||
        normalizedBlockTemplate.preferredWindow === "beforeWork") &&
      normalizedBlockTemplate.rescheduleBehavior === "autoSameUserWeek" &&
      normalizedBlockTemplate.priority === 1 &&
      normalizedBlockTemplate.requiresResource === false &&
      normalizedBlockTemplate.externalResources.length === 0 &&
      (normalizedBlockTemplate.bufferAfterMinutes === undefined ||
        normalizedBlockTemplate.bufferAfterMinutes === 60) &&
      normalizedBlockTemplate.createdAt === normalizedBlockTemplate.updatedAt
    ) {
      return {
        ...normalizedBlockTemplate,
        enabled: true,
      };
    }

    return normalizedBlockTemplate;
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
