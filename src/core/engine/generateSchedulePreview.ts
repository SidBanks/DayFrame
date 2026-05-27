import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../cycles/resolveEffectiveSchedulePreferences.js";
import { generateBlockCandidates } from "../blocks/generateBlockCandidates.js";
import { placeBlockCandidates } from "../blocks/placeBlockCandidates.js";
import type {
  BlockCandidate,
  BlockRecurrence,
  BlockTemplate,
  DraftScheduledBlock,
} from "../blocks/types.js";
import { validateBlockTemplate } from "../blocks/validateBlockTemplate.js";
import { generateCycleWorkBlocks } from "../cycles/generateCycleWorkBlocks.js";
import type { ShiftCycle } from "../cycles/types.js";
import { detectScheduleFriction } from "../friction/detectScheduleFriction.js";
import { generateSuggestedFixes } from "../friction/generateSuggestedFixes.js";
import type { FrictionPoint } from "../friction/types.js";
import type { GeneratedCycleWorkBlock } from "../cycles/types.js";
import type { ShiftDefinition } from "../shifts/types.js";
import type { TimeString, Weekday } from "../time/types.js";
import { getUserDayDate, getUserDayStart } from "../time/userDay.js";
import type { LocalDateString } from "../shifts/types.js";

export type GenerateSchedulePreviewInput = {
  shiftDefinitions: ShiftDefinition[];
  shiftCycle: ShiftCycle;
  blockTemplates: BlockTemplate[];
  blockRecurrences: BlockRecurrence[];
  planningWindowStart: Date;
  planningWindowEnd: Date;
  dayBoundaryStartTime: TimeString;
  weekStartsOn: Weekday;
  generatedAt: string;
};

export type GenerateSchedulePreviewResult = {
  generatedWorkBlocks: GeneratedCycleWorkBlock[];
  blockCandidates: BlockCandidate[];
  scheduledBlocks: DraftScheduledBlock[];
  unplacedCandidates: BlockCandidate[];
  frictionPoints: FrictionPoint[];
};

export function generateSchedulePreview(
  input: GenerateSchedulePreviewInput,
): GenerateSchedulePreviewResult {
  validatePlanningWindow(input.planningWindowStart, input.planningWindowEnd);
  validateBlockTemplates(input.blockTemplates);
  const expandedPlanningWindow = expandPlanningWindow(
    input.planningWindowStart,
    input.planningWindowEnd,
  );
  const visibleUserDayDates = getOverlappingUserDayDates({
    planningWindowStart: input.planningWindowStart,
    planningWindowEnd: input.planningWindowEnd,
    shiftCycle: input.shiftCycle,
    dayBoundaryStartTime: input.dayBoundaryStartTime,
    weekStartsOn: input.weekStartsOn,
  });

  const generatedWorkBlocks = generateCycleWorkBlocks({
    shiftCycle: input.shiftCycle,
    shiftDefinitions: input.shiftDefinitions,
    planningWindowStart: new Date(expandedPlanningWindow.start),
    planningWindowEnd: new Date(expandedPlanningWindow.end),
    defaultSchedulingPreferences: {
      dayBoundaryStartTime: input.dayBoundaryStartTime,
      weekStartsOn: input.weekStartsOn,
    },
  });

  const blockCandidates = generateBlockCandidates({
    blockTemplates: input.blockTemplates.map(cloneBlockTemplate),
    blockRecurrences: input.blockRecurrences.map(cloneBlockRecurrence),
    planningWindowStart: new Date(expandedPlanningWindow.start),
    planningWindowEnd: new Date(expandedPlanningWindow.end),
    shiftCycle: input.shiftCycle,
    defaultSchedulingPreferences: {
      dayBoundaryStartTime: input.dayBoundaryStartTime,
      weekStartsOn: input.weekStartsOn,
    },
  });

  const placementResult = placeBlockCandidates({
    blockCandidates,
    generatedWorkBlocks,
    planningWindowStart: new Date(expandedPlanningWindow.start),
    planningWindowEnd: new Date(expandedPlanningWindow.end),
    dayBoundaryStartTime: input.dayBoundaryStartTime,
    getDayBoundaryStartTimeForUserDayDate: (userDayDate) =>
      resolveEffectiveSchedulePreferencesForUserDayDate({
        shiftCycle: input.shiftCycle,
        defaultSchedulingPreferences: {
          dayBoundaryStartTime: input.dayBoundaryStartTime,
          weekStartsOn: input.weekStartsOn,
        },
        userDayDate,
      }).dayBoundaryStartTime,
  });

  const frictionDetectionResult = detectScheduleFriction({
    generatedWorkBlocks,
    scheduledBlocks: placementResult.scheduledBlocks,
    unplacedCandidates: placementResult.unplacedCandidates,
    detectedAt: input.generatedAt,
  });

  const suggestedFixesResult = generateSuggestedFixes({
    frictionPoints: frictionDetectionResult.frictionPoints,
    generatedWorkBlocks,
    scheduledBlocks: placementResult.scheduledBlocks,
    unplacedCandidates: placementResult.unplacedCandidates,
    dayBoundaryStartTime: input.dayBoundaryStartTime,
    getDayBoundaryStartTimeForUserDayDate: (userDayDate) =>
      resolveEffectiveSchedulePreferencesForUserDayDate({
        shiftCycle: input.shiftCycle,
        defaultSchedulingPreferences: {
          dayBoundaryStartTime: input.dayBoundaryStartTime,
          weekStartsOn: input.weekStartsOn,
        },
        userDayDate,
      }).dayBoundaryStartTime,
  });
  const filteredGeneratedWorkBlocks = generatedWorkBlocks.filter((workBlock) =>
    overlapsVisiblePlanningWindow(
      workBlock.startsAt,
      workBlock.endsAt,
      input.planningWindowStart,
      input.planningWindowEnd,
    ),
  );
  const filteredBlockCandidates = blockCandidates.filter((candidate) =>
    visibleUserDayDates.has(candidate.userDayDate),
  );
  const filteredScheduledBlocks = placementResult.scheduledBlocks.filter((scheduledBlock) =>
    visibleUserDayDates.has(scheduledBlock.userDayDate),
  );
  const filteredUnplacedCandidates = placementResult.unplacedCandidates.filter((candidate) =>
    visibleUserDayDates.has(candidate.userDayDate),
  );
  const filteredFrictionPoints = suggestedFixesResult.frictionPoints.filter((frictionPoint) =>
    frictionPoint.affectedUserDayDate
      ? visibleUserDayDates.has(frictionPoint.affectedUserDayDate)
      : true,
  );

  return {
    generatedWorkBlocks: filteredGeneratedWorkBlocks,
    blockCandidates: filteredBlockCandidates,
    scheduledBlocks: filteredScheduledBlocks,
    unplacedCandidates: filteredUnplacedCandidates,
    frictionPoints: filteredFrictionPoints,
  };
}

function validatePlanningWindow(planningWindowStart: Date, planningWindowEnd: Date): void {
  if (planningWindowStart.getTime() >= planningWindowEnd.getTime()) {
    throw new RangeError("planningWindowStart must be before planningWindowEnd");
  }
}

function validateBlockTemplates(blockTemplates: BlockTemplate[]): void {
  for (const blockTemplate of blockTemplates) {
    const validationResult = validateBlockTemplate(blockTemplate);

    if (!validationResult.isValid) {
      throw new RangeError(
        `Invalid block template ${blockTemplate.id}: ${validationResult.errors.join("; ")}`,
      );
    }
  }
}

function cloneBlockTemplate(blockTemplate: BlockTemplate): BlockTemplate {
  return {
    ...blockTemplate,
    externalResources: [...blockTemplate.externalResources],
  };
}

function cloneBlockRecurrence(blockRecurrence: BlockRecurrence): BlockRecurrence {
  return {
    ...blockRecurrence,
    ...(blockRecurrence.weekdays ? { weekdays: [...blockRecurrence.weekdays] } : {}),
  };
}

function expandPlanningWindow(
  planningWindowStart: Date,
  planningWindowEnd: Date,
): { start: Date; end: Date } {
  return {
    start: addDays(planningWindowStart, -1),
    end: addDays(planningWindowEnd, 1),
  };
}

function getOverlappingUserDayDates(input: {
  planningWindowStart: Date;
  planningWindowEnd: Date;
  shiftCycle: ShiftCycle;
  dayBoundaryStartTime: TimeString;
  weekStartsOn: Weekday;
}): Set<LocalDateString> {
  const userDayDates = new Set<LocalDateString>();
  const currentDate = new Date(
    input.planningWindowStart.getFullYear(),
    input.planningWindowStart.getMonth(),
    input.planningWindowStart.getDate() - 1,
    12,
    0,
    0,
    0,
  );
  const lastDate = new Date(
    input.planningWindowEnd.getFullYear(),
    input.planningWindowEnd.getMonth(),
    input.planningWindowEnd.getDate(),
    12,
    0,
    0,
    0,
  );

  while (currentDate.getTime() <= lastDate.getTime()) {
    const userDayDate = getUserDayDate(currentDate, "00:00") as LocalDateString;
    const preferences = resolveEffectiveSchedulePreferencesForUserDayDate({
      shiftCycle: input.shiftCycle,
      defaultSchedulingPreferences: {
        dayBoundaryStartTime: input.dayBoundaryStartTime,
        weekStartsOn: input.weekStartsOn,
      },
      userDayDate,
    });
    const userDayStart = getUserDayStart(
      new Date(`${userDayDate}T12:00:00`),
      preferences.dayBoundaryStartTime,
    );
    const userDayEnd = addDays(userDayStart, 1);

    if (
      userDayStart.getTime() < input.planningWindowEnd.getTime() &&
      userDayEnd.getTime() > input.planningWindowStart.getTime()
    ) {
      userDayDates.add(userDayDate);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return userDayDates;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60_000);
}

function overlapsVisiblePlanningWindow(
  startsAt: Date,
  endsAt: Date,
  planningWindowStart: Date,
  planningWindowEnd: Date,
): boolean {
  return (
    startsAt.getTime() < planningWindowEnd.getTime() &&
    endsAt.getTime() > planningWindowStart.getTime()
  );
}
