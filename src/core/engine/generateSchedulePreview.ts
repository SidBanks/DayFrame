import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../cycles/resolveEffectiveSchedulePreferences.js";
import { generateBlockCandidates } from "../blocks/generateBlockCandidates.js";
import { placeBlockCandidates } from "../blocks/placeBlockCandidates.js";
import type { ManualCalendarEvent } from "../calendar/types.js";
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
  manualEvents?: ManualCalendarEvent[];
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
  const manualScheduledBlocks = buildManualEventScheduledBlocks(
    input.manualEvents ?? [],
    visibleUserDayDates,
    input.shiftCycle,
    input.dayBoundaryStartTime,
    input.weekStartsOn,
  );

  const frictionDetectionResult = detectScheduleFriction({
    generatedWorkBlocks,
    scheduledBlocks: [...placementResult.scheduledBlocks, ...manualScheduledBlocks],
    unplacedCandidates: placementResult.unplacedCandidates,
    detectedAt: input.generatedAt,
  });

  const suggestedFixesResult = generateSuggestedFixes({
    frictionPoints: frictionDetectionResult.frictionPoints,
    generatedWorkBlocks,
    scheduledBlocks: [...placementResult.scheduledBlocks, ...manualScheduledBlocks],
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
  const filteredGeneratedWorkBlocks = generatedWorkBlocks.filter(
    (workBlock) =>
      visibleUserDayDates.has(workBlock.userDayDate) &&
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
  const getDayBoundaryStartTimeForUserDayDate = (userDayDate: LocalDateString) =>
    resolveEffectiveSchedulePreferencesForUserDayDate({
      shiftCycle: input.shiftCycle,
      defaultSchedulingPreferences: {
        dayBoundaryStartTime: input.dayBoundaryStartTime,
        weekStartsOn: input.weekStartsOn,
      },
      userDayDate,
    }).dayBoundaryStartTime;
  const allScheduledBlocks = [...placementResult.scheduledBlocks, ...manualScheduledBlocks];
  const filteredScheduledBlocks = allScheduledBlocks.filter((scheduledBlock) =>
    overlapsVisibleUserDay(
      scheduledBlock.startsAt,
      scheduledBlock.endsAt,
      visibleUserDayDates,
      getDayBoundaryStartTimeForUserDayDate,
    ),
  );
  const filteredUnplacedCandidates = placementResult.unplacedCandidates.filter((candidate) =>
    visibleUserDayDates.has(candidate.userDayDate),
  );
  const visibleScheduledBlockIds = new Set(
    filteredScheduledBlocks.map((scheduledBlock) => scheduledBlock.id),
  );
  const visibleGeneratedWorkBlockIds = new Set(
    filteredGeneratedWorkBlocks.map((generatedWorkBlock) => generatedWorkBlock.id),
  );
  const visibleUnplacedCandidateIds = new Set(
    filteredUnplacedCandidates.map((candidate) => candidate.id),
  );
  const filteredFrictionPoints = suggestedFixesResult.frictionPoints.filter((frictionPoint) => {
    if (
      frictionPoint.affectedUserDayDate &&
      visibleUserDayDates.has(frictionPoint.affectedUserDayDate)
    ) {
      return true;
    }

    return frictionPoint.affectedBlockIds.some(
      (blockId) =>
        visibleScheduledBlockIds.has(blockId) ||
        visibleGeneratedWorkBlockIds.has(blockId) ||
        visibleUnplacedCandidateIds.has(blockId),
    );
  });

  return {
    generatedWorkBlocks: filteredGeneratedWorkBlocks,
    blockCandidates: filteredBlockCandidates,
    scheduledBlocks: filteredScheduledBlocks,
    unplacedCandidates: filteredUnplacedCandidates,
    frictionPoints: filteredFrictionPoints,
  };
}

function buildManualEventScheduledBlocks(
  manualEvents: ManualCalendarEvent[],
  visibleUserDayDates: Set<LocalDateString>,
  shiftCycle: ShiftCycle,
  dayBoundaryStartTime: TimeString,
  weekStartsOn: Weekday,
): DraftScheduledBlock[] {
  return manualEvents
    .filter((manualEvent) => visibleUserDayDates.has(manualEvent.userDayDate))
    .map((manualEvent) => {
      const effectiveDayBoundaryStartTime = resolveEffectiveSchedulePreferencesForUserDayDate({
        shiftCycle,
        defaultSchedulingPreferences: {
          dayBoundaryStartTime,
          weekStartsOn,
        },
        userDayDate: manualEvent.userDayDate,
      }).dayBoundaryStartTime;
      const userDayStart = getUserDayStartFromLocalDateString(
        manualEvent.userDayDate,
        effectiveDayBoundaryStartTime,
      );
      const startsAt =
        manualEvent.allDay || !manualEvent.startTime
          ? userDayStart
          : createDateTimeFromUserDay(manualEvent.userDayDate, manualEvent.startTime);
      const endsAt =
        manualEvent.allDay || !manualEvent.endTime
          ? addCalendarDays(userDayStart, 1)
          : createDateTimeFromUserDay(
              manualEvent.userDayDate,
              manualEvent.endTime,
              manualEvent.endTime <= (manualEvent.startTime ?? manualEvent.endTime),
            );

      return {
        id: manualEvent.id,
        userId: "user_001",
        source: "manual",
        isAllDay: manualEvent.allDay,
        title: manualEvent.title,
        category: "optional",
        anchorType: "manual",
        placementType: "fixed",
        startsAt,
        endsAt,
        userDayDate: manualEvent.userDayDate,
        userWeekStartDate: getUserWeekStartDate(manualEvent.userDayDate, weekStartsOn),
        priority: 2,
        status: "planned",
        externalResources: [],
      };
    });
}

function createDateTimeFromUserDay(
  userDayDate: LocalDateString,
  time: TimeString,
  nextDay = false,
): Date {
  const [year, month, day] = userDayDate.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(
    year ?? 2026,
    (month ?? 1) - 1,
    (day ?? 1) + (nextDay ? 1 : 0),
    hours ?? 0,
    minutes ?? 0,
    0,
    0,
  );
}

function getUserDayStartFromLocalDateString(
  userDayDate: LocalDateString,
  dayBoundaryStartTime: TimeString,
): Date {
  const [year, month, day] = userDayDate.split("-").map(Number);
  const [hours, minutes] = dayBoundaryStartTime.split(":").map(Number);

  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, hours ?? 0, minutes ?? 0, 0, 0);
}

function addCalendarDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function getUserWeekStartDate(
  userDayDate: LocalDateString,
  weekStartsOn: Weekday,
): LocalDateString {
  const [year, month, day] = userDayDate.split("-").map(Number);
  const date = new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);
  const weekdayIndex = date.getDay();
  const weekStartsOnIndex = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }[weekStartsOn];
  const offset = (weekdayIndex - weekStartsOnIndex + 7) % 7;

  date.setDate(date.getDate() - offset);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}` as LocalDateString;
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

function overlapsVisibleUserDay(
  startsAt: Date,
  endsAt: Date,
  visibleUserDayDates: Set<LocalDateString>,
  getDayBoundaryStartTimeForUserDayDate: (userDayDate: LocalDateString) => TimeString,
): boolean {
  for (const userDayDate of visibleUserDayDates) {
    const dayBoundaryStartTime = getDayBoundaryStartTimeForUserDayDate(userDayDate);
    const userDayStart = getUserDayStart(new Date(`${userDayDate}T12:00:00`), dayBoundaryStartTime);
    const userDayEnd = addDays(userDayStart, 1);

    if (startsAt.getTime() < userDayEnd.getTime() && endsAt.getTime() > userDayStart.getTime()) {
      return true;
    }
  }

  return false;
}
