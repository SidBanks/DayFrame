import type { BlockRecurrence, BlockTemplate } from "../core/blocks/types.js";
import { generateCycleWorkBlocks } from "../core/cycles/generateCycleWorkBlocks.js";
import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../core/cycles/resolveEffectiveSchedulePreferences.js";
import type { ShiftCycle } from "../core/cycles/types.js";
import type { LocalDateString, ShiftDefinition } from "../core/shifts/types.js";
import { parseTimeString } from "../core/time/userDay.js";
import type { DayFramePreviewRange, DayFrameSchedulingPreferences } from "../state/types.js";

export type PreviewRangeWarning = {
  id: "previewOutsideCycle" | "previewOutsideSegmentCoverage" | "previewMayBeEmpty";
  message: string;
};

export function getPreviewRangeWarnings(input: {
  previewRange: DayFramePreviewRange;
  schedulingPreferences: DayFrameSchedulingPreferences;
  shiftCycles: ShiftCycle[];
  shiftDefinitions: ShiftDefinition[];
  blockTemplates: BlockTemplate[];
  blockRecurrences: BlockRecurrence[];
}): PreviewRangeWarning[] {
  if (input.shiftCycles.length === 0) {
    return [];
  }

  const warnings: PreviewRangeWarning[] = [];
  const previewDates = getInclusiveDates(input.previewRange.startDate, input.previewRange.endDate);

  if (previewDates.length === 0) {
    return warnings;
  }

  const cycleRange = getShiftCyclesRange(input.shiftCycles);

  if (!cycleRange) {
    return warnings;
  }

  const overlapsCycle = rangesOverlap(
    input.previewRange.startDate,
    input.previewRange.endDate,
    cycleRange.startDate,
    cycleRange.endDate,
  );

  if (!overlapsCycle) {
    warnings.push({
      id: "previewOutsideCycle",
      message: "This preview range does not overlap the active cycle.",
    });
  }

  const activeSegmentsByDate = new Map<
    LocalDateString,
    NonNullable<ShiftCycle["segments"][number]> | null
  >();
  const visibleUserDayWindows = buildVisibleUserDayWindows(
    previewDates,
    input.shiftCycles,
    input.schedulingPreferences,
  );
  const generatedWorkBlocks = generateCycleWorkBlocks({
    shiftCycles: input.shiftCycles,
    shiftDefinitions: input.shiftDefinitions,
    planningWindowStart: visibleUserDayWindows.start,
    planningWindowEnd: visibleUserDayWindows.end,
    defaultSchedulingPreferences: input.schedulingPreferences,
  });
  let hasSegmentCoverageGap = false;
  let hasAnyWorkCoverage = false;

  for (const previewDate of previewDates) {
    const activeSegment = findActiveSegmentForDate(input.shiftCycles, previewDate);
    const activeShiftDefinition = activeSegment
      ? (input.shiftDefinitions.find(
          (shiftDefinition) => shiftDefinition.id === activeSegment.shiftDefinitionId,
        ) ?? null)
      : null;

    activeSegmentsByDate.set(previewDate, activeSegment);

    if (overlapsCycle && isDateWithinRange(previewDate, cycleRange.startDate, cycleRange.endDate)) {
      if (!activeSegment) {
        hasSegmentCoverageGap = true;
      }
    }

    if (!activeSegment || !activeShiftDefinition) {
      continue;
    }
    const visibleUserDayWindow = visibleUserDayWindows.byDate.get(previewDate)!;
    const overlapsWorkBlock = generatedWorkBlocks.some(
      (workBlock) =>
        workBlock.userDayDate === previewDate ||
        overlapsUserDayWindow(
          workBlock.startsAt,
          workBlock.endsAt,
          visibleUserDayWindow.start,
          visibleUserDayWindow.end,
        ),
    );

    if (!overlapsWorkBlock) {
      continue;
    }

    hasAnyWorkCoverage = true;
  }

  if (hasSegmentCoverageGap) {
    warnings.push({
      id: "previewOutsideSegmentCoverage",
      message: "No cycle segment is active during part of this preview range.",
    });
  }

  const hasRecurringBlocksInRange = input.blockTemplates.some((template) => {
    if (!template.enabled) {
      return false;
    }

    const recurrence = input.blockRecurrences.find(
      (currentRecurrence) => currentRecurrence.blockTemplateId === template.id,
    );

    if (!recurrence) {
      return false;
    }

    const recurrenceStartDate = recurrence.startsOnDate ?? input.previewRange.startDate;
    const recurrenceEndDate = recurrence.endsOnDate ?? input.previewRange.endDate;

    return rangesOverlap(
      input.previewRange.startDate,
      input.previewRange.endDate,
      recurrenceStartDate,
      recurrenceEndDate,
    );
  });

  if (!hasAnyWorkCoverage && !hasRecurringBlocksInRange) {
    warnings.push({
      id: "previewMayBeEmpty",
      message: "This preview may generate little or no schedule data.",
    });
  }

  return warnings;
}

function buildVisibleUserDayWindows(
  previewDates: LocalDateString[],
  shiftCycles: ShiftCycle[],
  schedulingPreferences: DayFrameSchedulingPreferences,
): {
  byDate: Map<LocalDateString, { start: Date; end: Date }>;
  start: Date;
  end: Date;
} {
  const byDate = new Map<LocalDateString, { start: Date; end: Date }>();
  let earliestStart: Date | null = null;
  let latestEnd: Date | null = null;

  for (const previewDate of previewDates) {
    const dayBoundaryStartTime = resolveEffectiveSchedulePreferencesForUserDayDate({
      shiftCycles,
      defaultSchedulingPreferences: schedulingPreferences,
      userDayDate: previewDate,
    }).dayBoundaryStartTime;
    const start = createUserDayStart(previewDate, dayBoundaryStartTime);
    const end = addDaysToDate(start, 1);

    byDate.set(previewDate, {
      start,
      end,
    });

    if (earliestStart === null || start.getTime() < earliestStart.getTime()) {
      earliestStart = start;
    }

    if (latestEnd === null || end.getTime() > latestEnd.getTime()) {
      latestEnd = end;
    }
  }

  return {
    byDate,
    start: earliestStart ?? new Date(),
    end: latestEnd ?? new Date(),
  };
}

function findActiveSegmentForDate(
  shiftCycles: ShiftCycle[],
  date: LocalDateString,
): ShiftCycle["segments"][number] | null {
  for (const shiftCycle of shiftCycles) {
    const activeSegment =
      shiftCycle.segments.find(
        (segment) => segment.startsOnDate <= date && segment.endsOnDate >= date,
      ) ?? null;

    if (activeSegment) {
      return activeSegment;
    }
  }

  return null;
}

function getShiftCyclesRange(
  shiftCycles: ShiftCycle[],
): { startDate: LocalDateString; endDate: LocalDateString } | null {
  if (shiftCycles.length === 0) {
    return null;
  }

  return shiftCycles.reduce(
    (currentRange, shiftCycle) => ({
      startDate:
        shiftCycle.startsOnDate < currentRange.startDate
          ? shiftCycle.startsOnDate
          : currentRange.startDate,
      endDate:
        (shiftCycle.endsOnDate ?? shiftCycle.startsOnDate) > currentRange.endDate
          ? (shiftCycle.endsOnDate ?? shiftCycle.startsOnDate)
          : currentRange.endDate,
    }),
    {
      startDate: shiftCycles[0]!.startsOnDate,
      endDate: shiftCycles[0]!.endsOnDate ?? shiftCycles[0]!.startsOnDate,
    },
  );
}

function rangesOverlap(
  leftStart: LocalDateString,
  leftEnd: LocalDateString,
  rightStart: LocalDateString,
  rightEnd: LocalDateString,
): boolean {
  return leftStart <= rightEnd && leftEnd >= rightStart;
}

function isDateWithinRange(
  date: LocalDateString,
  rangeStart: LocalDateString,
  rangeEnd: LocalDateString,
): boolean {
  return date >= rangeStart && date <= rangeEnd;
}

function getInclusiveDates(
  startDate: LocalDateString,
  endDate: LocalDateString,
): LocalDateString[] {
  if (startDate > endDate) {
    return [];
  }

  const dates: LocalDateString[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return dates;
}

function addDays(localDate: LocalDateString, days: number): LocalDateString {
  const [year, month, day] = localDate.split("-").map(Number);
  const nextDate = new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);

  nextDate.setDate(nextDate.getDate() + days);

  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(
    nextDate.getDate(),
  ).padStart(2, "0")}` as LocalDateString;
}

function createUserDayStart(
  userDayDate: LocalDateString,
  dayBoundaryStartTime: DayFrameSchedulingPreferences["dayBoundaryStartTime"],
): Date {
  const [year, month, day] = userDayDate.split("-").map(Number);
  const parsedBoundary = parseTimeString(dayBoundaryStartTime);

  return new Date(
    year ?? 2026,
    (month ?? 1) - 1,
    day ?? 1,
    parsedBoundary.hours,
    parsedBoundary.minutes,
    0,
    0,
  );
}

function overlapsUserDayWindow(
  startsAt: Date,
  endsAt: Date,
  userDayStart: Date,
  userDayEnd: Date,
): boolean {
  return startsAt.getTime() < userDayEnd.getTime() && endsAt.getTime() > userDayStart.getTime();
}

function addDaysToDate(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}
