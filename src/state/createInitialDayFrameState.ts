import type { BlockRecurrence, BlockTemplate } from "../core/blocks/types.js";
import type { DayFrameState } from "./types.js";

export type PersistedDayFrameState = Pick<
  DayFrameState,
  | "schedulingPreferences"
  | "shiftDefinitions"
  | "shiftCycle"
  | "blockTemplates"
  | "blockRecurrences"
>;

export function createInitialDayFrameState(
  persistedState?: Partial<PersistedDayFrameState>,
): DayFrameState {
  const normalizedAuthoredSetup = normalizePersistedAuthoredSetup({
    shiftDefinitions: persistedState?.shiftDefinitions ?? [],
    shiftCycle: persistedState?.shiftCycle ?? null,
    blockTemplates: persistedState?.blockTemplates ?? [],
    blockRecurrences: persistedState?.blockRecurrences ?? [],
  });

  return {
    schedulingPreferences: {
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      ...persistedState?.schedulingPreferences,
    },
    shiftDefinitions: normalizedAuthoredSetup.shiftDefinitions,
    shiftCycle: normalizedAuthoredSetup.shiftCycle,
    blockTemplates: normalizedAuthoredSetup.blockTemplates,
    blockRecurrences: normalizedAuthoredSetup.blockRecurrences,
    savedProfiles: [],
    preview: null,
  };
}

export function normalizePersistedAuthoredSetup(
  authoredSetup: Pick<
    DayFrameState,
    "shiftDefinitions" | "shiftCycle" | "blockTemplates" | "blockRecurrences"
  >,
): Pick<DayFrameState, "shiftDefinitions" | "shiftCycle" | "blockTemplates" | "blockRecurrences"> {
  return {
    shiftDefinitions: authoredSetup.shiftDefinitions,
    shiftCycle: authoredSetup.shiftCycle,
    blockTemplates: normalizePersistedBlockTemplates(
      authoredSetup.blockTemplates,
      authoredSetup.blockRecurrences,
    ),
    blockRecurrences: authoredSetup.blockRecurrences,
  };
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
