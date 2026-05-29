import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../cycles/resolveEffectiveSchedulePreferences.js";
import { getUserDayDate, getUserDayStart } from "../time/userDay.js";
import { getUserWeekStartDate } from "../time/userWeek.js";
import type { UserTimePreferences, Weekday } from "../time/types.js";
import type {
  BlockCandidate,
  BlockRecurrence,
  BlockTemplate,
  GenerateBlockCandidatesInput,
} from "./types.js";
import { getWeekdayFromDate } from "../time/userWeek.js";
import type { LocalDateString } from "../shifts/types.js";

export function generateBlockCandidates(input: GenerateBlockCandidatesInput): BlockCandidate[] {
  validatePlanningWindow(input.planningWindowStart, input.planningWindowEnd);
  const defaultSchedulingPreferences = getDefaultSchedulingPreferences(input);

  const templatesById = new Map<string, BlockTemplate>(
    input.blockTemplates.map((blockTemplate) => [blockTemplate.id, blockTemplate]),
  );
  const userDays = getOverlappingUserDays(
    input.planningWindowStart,
    input.planningWindowEnd,
    input.shiftCycle,
    defaultSchedulingPreferences,
  );
  const candidates: BlockCandidate[] = [];

  for (const recurrence of input.blockRecurrences) {
    const blockTemplate = templatesById.get(recurrence.blockTemplateId);

    if (!blockTemplate) {
      throw new RangeError(
        `Missing block template for recurrence ${recurrence.id}: ${recurrence.blockTemplateId}`,
      );
    }

    if (!blockTemplate.enabled) {
      continue;
    }

    candidates.push(
      ...generateCandidatesForRecurrence({
        blockTemplate,
        recurrence,
        userDays,
        shiftCycle: input.shiftCycle,
        defaultSchedulingPreferences,
      }),
    );
  }

  return candidates.sort(compareCandidates);
}

type GenerateCandidatesForRecurrenceInput = {
  blockTemplate: BlockTemplate;
  recurrence: BlockRecurrence;
  userDays: LocalDateString[];
  shiftCycle: GenerateBlockCandidatesInput["shiftCycle"];
  defaultSchedulingPreferences: UserTimePreferences;
};

function generateCandidatesForRecurrence(
  input: GenerateCandidatesForRecurrenceInput,
): BlockCandidate[] {
  const eligibleUserDays = input.userDays.filter((userDayDate) =>
    isWithinRecurrenceDateBounds(userDayDate, input.recurrence),
  );

  switch (input.recurrence.frequency) {
    case "daily":
      return eligibleUserDays.map((userDayDate) =>
        buildBlockCandidate(
          input.blockTemplate,
          input.recurrence,
          userDayDate,
          input.shiftCycle,
          input.defaultSchedulingPreferences,
        ),
      );
    case "weekly":
      return generateWeeklyCandidates(
        input.blockTemplate,
        input.recurrence,
        eligibleUserDays,
        input.shiftCycle,
        input.defaultSchedulingPreferences,
      );
    case "specificWeekdays":
      return generateSpecificWeekdayCandidates(
        input.blockTemplate,
        input.recurrence,
        eligibleUserDays,
        input.shiftCycle,
        input.defaultSchedulingPreferences,
      );
    case "timesPerUserWeek":
      return generateTimesPerUserWeekCandidates(
        input.blockTemplate,
        input.recurrence,
        eligibleUserDays,
        input.shiftCycle,
        input.defaultSchedulingPreferences,
      );
    case "perShiftSegment":
    case "custom":
      throw new RangeError(`Unsupported recurrence frequency: ${input.recurrence.frequency}`);
  }
}

function generateWeeklyCandidates(
  blockTemplate: BlockTemplate,
  recurrence: BlockRecurrence,
  eligibleUserDays: LocalDateString[],
  shiftCycle: GenerateBlockCandidatesInput["shiftCycle"],
  defaultSchedulingPreferences: UserTimePreferences,
): BlockCandidate[] {
  const firstDayByUserWeek = new Map<LocalDateString, LocalDateString>();

  for (const userDayDate of eligibleUserDays) {
    const userWeekStartDate = getUserWeekStartDateForUserDayDate(
      userDayDate,
      shiftCycle,
      defaultSchedulingPreferences,
    );

    if (!firstDayByUserWeek.has(userWeekStartDate)) {
      firstDayByUserWeek.set(userWeekStartDate, userDayDate);
    }
  }

  return [...firstDayByUserWeek.entries()].map(([, userDayDate]) =>
    buildBlockCandidate(
      blockTemplate,
      recurrence,
      userDayDate,
      shiftCycle,
      defaultSchedulingPreferences,
    ),
  );
}

function generateSpecificWeekdayCandidates(
  blockTemplate: BlockTemplate,
  recurrence: BlockRecurrence,
  eligibleUserDays: LocalDateString[],
  shiftCycle: GenerateBlockCandidatesInput["shiftCycle"],
  defaultSchedulingPreferences: UserTimePreferences,
): BlockCandidate[] {
  if (!recurrence.weekdays || recurrence.weekdays.length === 0) {
    throw new RangeError("specificWeekdays recurrence requires at least one weekday");
  }

  return eligibleUserDays
    .filter((userDayDate) => recurrence.weekdays?.includes(getWeekdayFromLocalDate(userDayDate)))
    .map((userDayDate) =>
      buildBlockCandidate(
        blockTemplate,
        recurrence,
        userDayDate,
        shiftCycle,
        defaultSchedulingPreferences,
      ),
    );
}

function generateTimesPerUserWeekCandidates(
  blockTemplate: BlockTemplate,
  recurrence: BlockRecurrence,
  eligibleUserDays: LocalDateString[],
  shiftCycle: GenerateBlockCandidatesInput["shiftCycle"],
  defaultSchedulingPreferences: UserTimePreferences,
): BlockCandidate[] {
  if (
    recurrence.timesPerUserWeek === undefined ||
    !Number.isInteger(recurrence.timesPerUserWeek) ||
    recurrence.timesPerUserWeek <= 0
  ) {
    throw new RangeError(
      "timesPerUserWeek recurrence requires a positive integer timesPerUserWeek",
    );
  }

  const userDaysByWeek = new Map<LocalDateString, LocalDateString[]>();

  for (const userDayDate of eligibleUserDays) {
    const userWeekStartDate = getUserWeekStartDateForUserDayDate(
      userDayDate,
      shiftCycle,
      defaultSchedulingPreferences,
    );
    const weekDays = userDaysByWeek.get(userWeekStartDate) ?? [];

    weekDays.push(userDayDate);
    userDaysByWeek.set(userWeekStartDate, weekDays);
  }

  const candidates: BlockCandidate[] = [];

  for (const weekDays of userDaysByWeek.values()) {
    for (
      let index = 0;
      index < Math.min(weekDays.length, recurrence.timesPerUserWeek);
      index += 1
    ) {
      candidates.push(
        buildBlockCandidate(
          blockTemplate,
          recurrence,
          weekDays[index]!,
          shiftCycle,
          defaultSchedulingPreferences,
        ),
      );
    }
  }

  return candidates;
}

function buildBlockCandidate(
  blockTemplate: BlockTemplate,
  recurrence: BlockRecurrence,
  userDayDate: LocalDateString,
  shiftCycle: GenerateBlockCandidatesInput["shiftCycle"],
  defaultSchedulingPreferences: UserTimePreferences,
): BlockCandidate {
  const userWeekStartDate = getUserWeekStartDateForUserDayDate(
    userDayDate,
    shiftCycle,
    defaultSchedulingPreferences,
  );
  const customWindowFields =
    blockTemplate.customWindowStartTime !== undefined &&
    blockTemplate.customWindowEndTime !== undefined
      ? {
          customWindowStartTime: blockTemplate.customWindowStartTime,
          customWindowEndTime: blockTemplate.customWindowEndTime,
        }
      : {};
  const fixedStartTimeFields =
    blockTemplate.fixedStartTime !== undefined
      ? {
          fixedStartTime: blockTemplate.fixedStartTime,
        }
      : {};

  return {
    id: `candidate_${blockTemplate.id}_${recurrence.id}_${userDayDate}`,
    userId: blockTemplate.userId,
    templateId: blockTemplate.id,
    recurrenceId: recurrence.id,
    recurrenceFrequency: recurrence.frequency,
    title: blockTemplate.title,
    category: blockTemplate.category,
    anchorType: blockTemplate.placementType === "fixed" ? "fixedTemplate" : "flexibleTemplate",
    placementType: blockTemplate.placementType,
    durationMinutes: blockTemplate.durationMinutes,
    ...(blockTemplate.bufferBeforeMinutes !== undefined
      ? { bufferBeforeMinutes: blockTemplate.bufferBeforeMinutes }
      : {}),
    ...(blockTemplate.bufferAfterMinutes !== undefined
      ? { bufferAfterMinutes: blockTemplate.bufferAfterMinutes }
      : {}),
    priority: blockTemplate.priority,
    preferredWindow: blockTemplate.preferredWindow,
    rescheduleBehavior: blockTemplate.rescheduleBehavior,
    externalResources: blockTemplate.externalResources,
    userDayDate,
    userWeekStartDate,
    ...fixedStartTimeFields,
    ...customWindowFields,
  };
}

function getOverlappingUserDays(
  planningWindowStart: Date,
  planningWindowEnd: Date,
  shiftCycle: GenerateBlockCandidatesInput["shiftCycle"],
  defaultSchedulingPreferences: UserTimePreferences,
): LocalDateString[] {
  const userDays: LocalDateString[] = [];
  const currentDate = new Date(
    planningWindowStart.getFullYear(),
    planningWindowStart.getMonth(),
    planningWindowStart.getDate() - 1,
    12,
    0,
    0,
    0,
  );
  const lastDate = new Date(
    planningWindowEnd.getFullYear(),
    planningWindowEnd.getMonth(),
    planningWindowEnd.getDate(),
    12,
    0,
    0,
    0,
  );

  while (currentDate.getTime() <= lastDate.getTime()) {
    const localDate = getLocalDateString(currentDate);
    const preferences = resolveEffectiveSchedulePreferencesForUserDayDate({
      shiftCycle: shiftCycle ?? null,
      defaultSchedulingPreferences,
      userDayDate: localDate,
    });
    const userDayStart = getUserDayStartFromLocalDate(localDate, preferences.dayBoundaryStartTime);
    const userDayEnd = new Date(userDayStart);

    userDayEnd.setDate(userDayEnd.getDate() + 1);

    if (
      userDayStart.getTime() < planningWindowEnd.getTime() &&
      userDayEnd.getTime() > planningWindowStart.getTime() &&
      !userDays.includes(localDate)
    ) {
      userDays.push(localDate);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return userDays;
}

function validatePlanningWindow(planningWindowStart: Date, planningWindowEnd: Date): void {
  if (planningWindowStart.getTime() >= planningWindowEnd.getTime()) {
    throw new RangeError("planningWindowStart must be before planningWindowEnd");
  }
}

function isWithinRecurrenceDateBounds(
  userDayDate: LocalDateString,
  recurrence: BlockRecurrence,
): boolean {
  if (recurrence.startsOnDate && userDayDate < recurrence.startsOnDate) {
    return false;
  }

  if (recurrence.endsOnDate && userDayDate > recurrence.endsOnDate) {
    return false;
  }

  return true;
}

function getUserWeekStartDateForUserDayDate(
  userDayDate: LocalDateString,
  shiftCycle: GenerateBlockCandidatesInput["shiftCycle"],
  defaultSchedulingPreferences: UserTimePreferences,
): LocalDateString {
  const preferences = resolveEffectiveSchedulePreferencesForUserDayDate({
    shiftCycle: shiftCycle ?? null,
    defaultSchedulingPreferences,
    userDayDate,
  });
  const anchorDate = getUserDayStartFromLocalDate(userDayDate, preferences.dayBoundaryStartTime);

  return getUserWeekStartDate(anchorDate, preferences) as LocalDateString;
}

function getUserDayStartFromLocalDate(
  userDayDate: LocalDateString,
  dayBoundaryStartTime: UserTimePreferences["dayBoundaryStartTime"],
): Date {
  const [year, month, day] = userDayDate.split("-").map(Number);
  const dayStart = new Date(year!, (month ?? 1) - 1, day!, 12, 0, 0, 0);

  return getUserDayStart(dayStart, dayBoundaryStartTime);
}

function getLocalDateString(date: Date): LocalDateString {
  return getUserDayDate(date, "00:00") as LocalDateString;
}

function getWeekdayFromLocalDate(localDate: LocalDateString): Weekday {
  return getWeekdayFromDate(new Date(`${localDate}T12:00:00`));
}

function getDefaultSchedulingPreferences(input: GenerateBlockCandidatesInput): UserTimePreferences {
  return (
    input.defaultSchedulingPreferences ?? {
      dayBoundaryStartTime: input.dayBoundaryStartTime ?? "03:00",
      weekStartsOn: input.weekStartsOn ?? "saturday",
    }
  );
}

function compareCandidates(left: BlockCandidate, right: BlockCandidate): number {
  if (left.userDayDate < right.userDayDate) {
    return -1;
  }

  if (left.userDayDate > right.userDayDate) {
    return 1;
  }

  if (left.priority < right.priority) {
    return -1;
  }

  if (left.priority > right.priority) {
    return 1;
  }

  return left.id.localeCompare(right.id);
}
