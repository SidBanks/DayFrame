import { getUserDayDate } from "../time/userDay.js";
import {
  resolveUserDayWindowForLabel,
  resolveUserWeekStartDateForLabel,
} from "../time/canonicalUserDay.js";
import type { UserTimePreferences, Weekday } from "../time/types.js";
import type {
  BlockCandidate,
  BlockRecurrence,
  BlockTemplate,
  GenerateBlockCandidatesInput,
  RecurrenceFrequency,
} from "./types.js";
import { getWeekdayFromDate } from "../time/userWeek.js";
import type { LocalDateString } from "../shifts/types.js";
import { createTemplateOccurrenceIdentity } from "../occurrences/occurrenceIdentity.js";

export function generateBlockCandidates(input: GenerateBlockCandidatesInput): BlockCandidate[] {
  const shiftCycles = input.shiftCycles ?? [];
  validatePlanningWindow(input.planningWindowStart, input.planningWindowEnd);
  const defaultSchedulingPreferences = getDefaultSchedulingPreferences(input);

  const templatesById = new Map<string, BlockTemplate>(
    input.blockTemplates.map((blockTemplate) => [blockTemplate.id, blockTemplate]),
  );
  const userDays = getOverlappingUserDays(
    input.planningWindowStart,
    input.planningWindowEnd,
    shiftCycles,
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
        shiftCycles,
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
  shiftCycles: GenerateBlockCandidatesInput["shiftCycles"];
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
          input.shiftCycles,
          input.defaultSchedulingPreferences,
        ),
      );
    case "weekly":
      return generateWeeklyCandidates(
        input.blockTemplate,
        input.recurrence,
        input.userDays,
        input.shiftCycles,
        input.defaultSchedulingPreferences,
      );
    case "specificWeekdays":
      return generateSpecificWeekdayCandidates(
        input.blockTemplate,
        input.recurrence,
        eligibleUserDays,
        input.shiftCycles,
        input.defaultSchedulingPreferences,
      );
    case "timesPerUserWeek":
      return generateTimesPerUserWeekCandidates(
        input.blockTemplate,
        input.recurrence,
        input.userDays,
        input.shiftCycles,
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
  generationUserDays: LocalDateString[],
  shiftCycles: GenerateBlockCandidatesInput["shiftCycles"],
  defaultSchedulingPreferences: UserTimePreferences,
): BlockCandidate[] {
  const generationUserDaySet = new Set(generationUserDays);
  const canonicalWeekBuckets = collectCanonicalEffectiveWeekBuckets(
    generationUserDays,
    shiftCycles,
    defaultSchedulingPreferences,
  );

  return canonicalWeekBuckets.flatMap((canonicalDates) => {
    const userDayDate = canonicalDates.find((date) =>
      isWithinRecurrenceDateBounds(date, recurrence),
    );

    if (!userDayDate || !generationUserDaySet.has(userDayDate)) {
      return [];
    }

    return [
      buildBlockCandidate(
        blockTemplate,
        recurrence,
        userDayDate,
        shiftCycles,
        defaultSchedulingPreferences,
        0,
      ),
    ];
  });
}

function generateSpecificWeekdayCandidates(
  blockTemplate: BlockTemplate,
  recurrence: BlockRecurrence,
  eligibleUserDays: LocalDateString[],
  shiftCycles: GenerateBlockCandidatesInput["shiftCycles"],
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
        shiftCycles,
        defaultSchedulingPreferences,
      ),
    );
}

function generateTimesPerUserWeekCandidates(
  blockTemplate: BlockTemplate,
  recurrence: BlockRecurrence,
  generationUserDays: LocalDateString[],
  shiftCycles: GenerateBlockCandidatesInput["shiftCycles"],
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

  const generationUserDaySet = new Set(generationUserDays);
  const canonicalWeekBuckets = collectCanonicalEffectiveWeekBuckets(
    generationUserDays,
    shiftCycles,
    defaultSchedulingPreferences,
  );
  const candidates: BlockCandidate[] = [];

  for (const canonicalDates of canonicalWeekBuckets) {
    const occurrenceDates = canonicalDates
      .filter((date) => isWithinRecurrenceDateBounds(date, recurrence))
      .slice(0, recurrence.timesPerUserWeek);

    for (const [slot, userDayDate] of occurrenceDates.entries()) {
      if (!generationUserDaySet.has(userDayDate)) {
        continue;
      }

      candidates.push(
        buildBlockCandidate(
          blockTemplate,
          recurrence,
          userDayDate,
          shiftCycles,
          defaultSchedulingPreferences,
          slot,
        ),
      );
    }
  }

  return candidates;
}

function collectCanonicalEffectiveWeekBuckets(
  generationUserDays: LocalDateString[],
  shiftCycles: GenerateBlockCandidatesInput["shiftCycles"],
  defaultSchedulingPreferences: UserTimePreferences,
): LocalDateString[][] {
  const effectiveWeekKeys = new Set(
    generationUserDays.map((userDayDate) =>
      getUserWeekStartDateForUserDayDate(userDayDate, shiftCycles, defaultSchedulingPreferences),
    ),
  );

  return [...effectiveWeekKeys]
    .sort((left, right) => left.localeCompare(right))
    .map((effectiveWeekKey) =>
      collectCanonicalDatesForEffectiveWeekKey(
        effectiveWeekKey,
        shiftCycles,
        defaultSchedulingPreferences,
      ),
    );
}

function collectCanonicalDatesForEffectiveWeekKey(
  effectiveWeekKey: LocalDateString,
  shiftCycles: GenerateBlockCandidatesInput["shiftCycles"],
  defaultSchedulingPreferences: UserTimePreferences,
): LocalDateString[] {
  const canonicalDates: LocalDateString[] = [];

  // A normal effective user-week contains key + 0...6. The existing noon-based
  // preference resolver can map key + 7 back to key when the day boundary is
  // later than noon, so include that final bounded label as well.
  for (let dayOffset = 0; dayOffset <= 7; dayOffset += 1) {
    const userDayDate = addDaysToLocalDate(effectiveWeekKey, dayOffset);

    if (
      getUserWeekStartDateForUserDayDate(userDayDate, shiftCycles, defaultSchedulingPreferences) ===
      effectiveWeekKey
    ) {
      canonicalDates.push(userDayDate);
    }
  }

  return canonicalDates;
}

function buildBlockCandidate(
  blockTemplate: BlockTemplate,
  recurrence: BlockRecurrence,
  userDayDate: LocalDateString,
  shiftCycles: GenerateBlockCandidatesInput["shiftCycles"],
  defaultSchedulingPreferences: UserTimePreferences,
  occurrenceSlot = 0,
): BlockCandidate {
  const userWeekStartDate = getUserWeekStartDateForUserDayDate(
    userDayDate,
    shiftCycles,
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
    occurrenceIdentity: createTemplateOccurrenceIdentity({
      templateId: blockTemplate.id,
      recurrenceId: recurrence.id,
      frequency: recurrence.frequency as Extract<
        RecurrenceFrequency,
        "daily" | "specificWeekdays" | "weekly" | "timesPerUserWeek"
      >,
      userDayDate,
      userWeekStartDate,
      slot: occurrenceSlot,
    }),
    ...(getIncarnationId(blockTemplate) && getIncarnationId(recurrence)
      ? {
          commitmentNavigationIdentity: {
            templateId: blockTemplate.id,
            templateIncarnationId: getIncarnationId(blockTemplate)!,
            recurrenceId: recurrence.id,
            recurrenceIncarnationId: getIncarnationId(recurrence)!,
          },
        }
      : {}),
    userId: blockTemplate.userId,
    templateId: blockTemplate.id,
    recurrenceId: recurrence.id,
    recurrenceFrequency: recurrence.frequency,
    title: blockTemplate.title,
    category: blockTemplate.category,
    requiresWorkAnchor: blockTemplate.requiresWorkAnchor ?? false,
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

function getIncarnationId(value: object): string | undefined {
  return "incarnationId" in value && typeof value.incarnationId === "string"
    ? value.incarnationId
    : undefined;
}

function getOverlappingUserDays(
  planningWindowStart: Date,
  planningWindowEnd: Date,
  shiftCycles: GenerateBlockCandidatesInput["shiftCycles"],
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
    const window = resolveUserDayWindowForLabel({
      shiftCycles: shiftCycles ?? [],
      defaultSchedulingPreferences,
      userDayDate: localDate,
    });
    const { start: userDayStart, end: userDayEnd } = window;

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
  shiftCycles: GenerateBlockCandidatesInput["shiftCycles"],
  defaultSchedulingPreferences: UserTimePreferences,
): LocalDateString {
  return resolveUserWeekStartDateForLabel({
    shiftCycles: shiftCycles ?? [],
    defaultSchedulingPreferences,
    userDayDate,
  });
}

function getLocalDateString(date: Date): LocalDateString {
  return getUserDayDate(date, "00:00") as LocalDateString;
}

function addDaysToLocalDate(localDate: LocalDateString, days: number): LocalDateString {
  const [year, month, day] = localDate.split("-").map(Number);
  const date = new Date(year!, month! - 1, day! + days, 12, 0, 0, 0);

  return getLocalDateString(date);
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
