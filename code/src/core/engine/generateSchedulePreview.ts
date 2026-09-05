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
import { getUserDayDate } from "../time/userDay.js";
import { resolveUserDayWindowForLabel } from "../time/canonicalUserDay.js";
import type { LocalDateString } from "../shifts/types.js";
import { createManualEventOccurrenceIdentity } from "../occurrences/occurrenceIdentity.js";
import type { PlanDecisionV1 } from "../decisions/planDecision.js";
import {
  finalizePlanDecisionResults,
  replayPlanDecisions,
  type PlanDecisionReplayResult,
} from "../decisions/replayPlanDecisions.js";
import { classifySuggestedFixes } from "../decisions/classifySuggestedFixes.js";
import type { DayFrameAuthoredSetup } from "../../state/types.js";
import type { CompositeOccurrenceV1 } from "../planning/commitmentComposition.js";
import type { RealizedScheduleFactV1 } from "../planning/realizedScheduleIdentity.js";
import { expandInstantPlanningWindowForBoundaryContext } from "../planning/planningScope.js";

export type GenerateSchedulePreviewInput = {
  shiftDefinitions: ShiftDefinition[];
  shiftCycles?: ShiftCycle[];
  blockTemplates: BlockTemplate[];
  blockRecurrences: BlockRecurrence[];
  manualEvents?: ManualCalendarEvent[];
  planningWindowStart: Date;
  planningWindowEnd: Date;
  dayBoundaryStartTime: TimeString;
  weekStartsOn: Weekday;
  generatedAt: string;
  planDecisions?: readonly PlanDecisionV1[];
  realizedScheduleFacts?: readonly RealizedScheduleFactV1[];
};

export type GenerateSchedulePreviewResult = {
  generatedWorkBlocks: GeneratedCycleWorkBlock[];
  blockCandidates: BlockCandidate[];
  scheduledBlocks: DraftScheduledBlock[];
  unplacedCandidates: BlockCandidate[];
  frictionPoints: FrictionPoint[];
  planDecisionResults: PlanDecisionReplayResult[];
  compositionResults?: CompositeOccurrenceV1[];
  realizedScheduleFacts?: RealizedScheduleFactV1[];
};

export function generateSchedulePreview(
  input: GenerateSchedulePreviewInput,
): GenerateSchedulePreviewResult {
  const shiftCycles = input.shiftCycles ?? [];
  const defaultSchedulingPreferences = {
    dayBoundaryStartTime: input.dayBoundaryStartTime,
    weekStartsOn: input.weekStartsOn,
  };
  const getCanonicalUserDayWindow = (userDayDate: LocalDateString) =>
    resolveUserDayWindowForLabel({ shiftCycles, defaultSchedulingPreferences, userDayDate });
  validatePlanningWindow(input.planningWindowStart, input.planningWindowEnd);
  validateBlockTemplates(input.blockTemplates);
  const expandedPlanningWindow = expandInstantPlanningWindowForBoundaryContext(
    input.planningWindowStart,
    input.planningWindowEnd,
  );
  const visibleUserDayDates = getOverlappingUserDayDates({
    planningWindowStart: input.planningWindowStart,
    planningWindowEnd: input.planningWindowEnd,
    shiftCycles,
    dayBoundaryStartTime: input.dayBoundaryStartTime,
    weekStartsOn: input.weekStartsOn,
  });

  const generatedWorkBlocks = generateCycleWorkBlocks({
    shiftCycles,
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
    shiftCycles,
    defaultSchedulingPreferences: {
      dayBoundaryStartTime: input.dayBoundaryStartTime,
      weekStartsOn: input.weekStartsOn,
    },
  });

  const manualScheduledBlocks = buildManualEventScheduledBlocks(
    input.manualEvents ?? [],
    visibleUserDayDates,
    shiftCycles,
    input.dayBoundaryStartTime,
    input.weekStartsOn,
  );
  const authoredSetup = {
    schedulingPreferences: {
      dayBoundaryStartTime: input.dayBoundaryStartTime,
      weekStartsOn: input.weekStartsOn,
    },
    previewRange: { preset: "custom", startDate: "2000-01-01", endDate: "2000-01-01" },
    shiftDefinitions: input.shiftDefinitions,
    shiftCycles,
    blockTemplates: input.blockTemplates,
    blockRecurrences: input.blockRecurrences,
    manualEvents: input.manualEvents ?? [],
  } as unknown as DayFrameAuthoredSetup;
  const replay = replayPlanDecisions({
    decisions: input.planDecisions ?? [],
    authoredSetup,
    blockCandidates,
    planningWindowStart: input.planningWindowStart,
    planningWindowEnd: input.planningWindowEnd,
    dayBoundaryStartTime: input.dayBoundaryStartTime,
    weekStartsOn: input.weekStartsOn,
  });
  const placementResult = placeBlockCandidates({
    blockCandidates: replay.blockCandidates,
    generatedWorkBlocks,
    planningWindowStart: new Date(expandedPlanningWindow.start),
    planningWindowEnd: new Date(expandedPlanningWindow.end),
    visiblePlanningWindowStart: new Date(input.planningWindowStart),
    visiblePlanningWindowEnd: new Date(input.planningWindowEnd),
    dayBoundaryStartTime: input.dayBoundaryStartTime,
    getDayBoundaryStartTimeForUserDayDate: (userDayDate) =>
      resolveEffectiveSchedulePreferencesForUserDayDate({
        shiftCycles,
        defaultSchedulingPreferences: {
          dayBoundaryStartTime: input.dayBoundaryStartTime,
          weekStartsOn: input.weekStartsOn,
        },
        userDayDate,
      }).dayBoundaryStartTime,
    getUserDayWindowForUserDayDate: getCanonicalUserDayWindow,
    hardPlacementCandidateIds: replay.hardPlacementCandidateIds,
    additionalOccupiedBlocks: manualScheduledBlocks,
    fixedAuthorityOccupiedBlocks: (input.realizedScheduleFacts ?? []).map((fact) => ({
      startsAt: new Date(fact.startsAt),
      endsAt: new Date(fact.endsAt),
    })),
  });
  const planDecisionResults = finalizePlanDecisionResults(
    replay.pendingResults,
    replay.exactDecisionCandidateIds,
    placementResult.scheduledBlocks,
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
        shiftCycles,
        defaultSchedulingPreferences: {
          dayBoundaryStartTime: input.dayBoundaryStartTime,
          weekStartsOn: input.weekStartsOn,
        },
        userDayDate,
      }).dayBoundaryStartTime,
    getUserDayWindowForUserDayDate: getCanonicalUserDayWindow,
  });
  const decisionAwareFrictionPoints = classifySuggestedFixes({
    frictionPoints: suggestedFixesResult.frictionPoints,
    generatedWorkBlocks,
    blockCandidates: replay.blockCandidates,
    scheduledBlocks: [...placementResult.scheduledBlocks, ...manualScheduledBlocks],
    unplacedCandidates: placementResult.unplacedCandidates,
    decisions: input.planDecisions ?? [],
    replayResults: planDecisionResults,
    authoredSetup,
    dayBoundaryStartTime: input.dayBoundaryStartTime,
    classifiedAt: input.generatedAt,
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
  const filteredBlockCandidates = replay.blockCandidates.filter((candidate) =>
    visibleUserDayDates.has(candidate.userDayDate),
  );
  const allScheduledBlocks = [...placementResult.scheduledBlocks, ...manualScheduledBlocks];
  const filteredScheduledBlocks = allScheduledBlocks.filter((scheduledBlock) =>
    overlapsVisibleUserDay(
      scheduledBlock.startsAt,
      scheduledBlock.endsAt,
      visibleUserDayDates,
      getCanonicalUserDayWindow,
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
  const filteredFrictionPoints = decisionAwareFrictionPoints.filter((frictionPoint) => {
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
    planDecisionResults,
    ...(input.realizedScheduleFacts?.length
      ? { realizedScheduleFacts: structuredClone([...input.realizedScheduleFacts]) }
      : {}),
  };
}

function buildManualEventScheduledBlocks(
  manualEvents: ManualCalendarEvent[],
  visibleUserDayDates: Set<LocalDateString>,
  shiftCycles: ShiftCycle[],
  dayBoundaryStartTime: TimeString,
  weekStartsOn: Weekday,
): DraftScheduledBlock[] {
  return manualEvents
    .filter((manualEvent) => visibleUserDayDates.has(manualEvent.userDayDate))
    .map((manualEvent) => {
      const canonicalWindow = resolveUserDayWindowForLabel({
        shiftCycles,
        defaultSchedulingPreferences: {
          dayBoundaryStartTime,
          weekStartsOn,
        },
        userDayDate: manualEvent.userDayDate,
      });
      const userDayStart = canonicalWindow.start;
      const startsAt =
        manualEvent.allDay || !manualEvent.startTime
          ? userDayStart
          : createDateTimeFromUserDay(manualEvent.userDayDate, manualEvent.startTime);
      const endsAt =
        manualEvent.allDay || !manualEvent.endTime
          ? canonicalWindow.end
          : createDateTimeFromUserDay(
              manualEvent.userDayDate,
              manualEvent.endTime,
              manualEvent.endTime <= (manualEvent.startTime ?? manualEvent.endTime),
            );

      return {
        id: manualEvent.id,
        occurrenceIdentity: createManualEventOccurrenceIdentity(manualEvent.id),
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

function getOverlappingUserDayDates(input: {
  planningWindowStart: Date;
  planningWindowEnd: Date;
  shiftCycles: ShiftCycle[];
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
    const canonicalWindow = resolveUserDayWindowForLabel({
      shiftCycles: input.shiftCycles,
      defaultSchedulingPreferences: {
        dayBoundaryStartTime: input.dayBoundaryStartTime,
        weekStartsOn: input.weekStartsOn,
      },
      userDayDate,
    });
    const { start: userDayStart, end: userDayEnd } = canonicalWindow;

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
  getCanonicalUserDayWindow: (userDayDate: LocalDateString) => { start: Date; end: Date },
): boolean {
  for (const userDayDate of visibleUserDayDates) {
    const { start: userDayStart, end: userDayEnd } = getCanonicalUserDayWindow(userDayDate);

    if (startsAt.getTime() < userDayEnd.getTime() && endsAt.getTime() > userDayStart.getTime()) {
      return true;
    }
  }

  return false;
}
