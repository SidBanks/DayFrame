import type { BlockRecurrence, BlockTemplate } from "../core/blocks/types.js";
import type { ShiftCycle } from "../core/cycles/types.js";
import type { LocalDateString, ShiftDefinition } from "../core/shifts/types.js";
import type { DayFramePreviewRange } from "../state/types.js";

export type PreviewRangeWarning = {
  id:
    | "previewOutsideCycle"
    | "previewOutsideSegmentCoverage"
    | "previewHasNoWorkSchedule"
    | "previewMayBeEmpty";
  message: string;
};

export function getPreviewRangeWarnings(input: {
  previewRange: DayFramePreviewRange;
  shiftCycle: ShiftCycle | null;
  shiftDefinitions: ShiftDefinition[];
  blockTemplates: BlockTemplate[];
  blockRecurrences: BlockRecurrence[];
}): PreviewRangeWarning[] {
  if (!input.shiftCycle) {
    return [];
  }

  const warnings: PreviewRangeWarning[] = [];
  const previewDates = getInclusiveDates(input.previewRange.startDate, input.previewRange.endDate);

  if (previewDates.length === 0) {
    return warnings;
  }

  const cycleEndDate = input.shiftCycle.endsOnDate ?? "9999-12-31";
  const overlapsCycle = rangesOverlap(
    input.previewRange.startDate,
    input.previewRange.endDate,
    input.shiftCycle.startsOnDate,
    cycleEndDate as LocalDateString,
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
  let hasSegmentCoverageGap = false;
  let hasWorkScheduleGap = false;
  let hasAnyWorkCoverage = false;

  for (const previewDate of previewDates) {
    const activeSegment = findActiveSegmentForDate(input.shiftCycle, previewDate);
    const activeShiftDefinition = activeSegment
      ? (input.shiftDefinitions.find(
          (shiftDefinition) => shiftDefinition.id === activeSegment.shiftDefinitionId,
        ) ?? null)
      : null;

    activeSegmentsByDate.set(previewDate, activeSegment);

    if (
      overlapsCycle &&
      isDateWithinRange(previewDate, input.shiftCycle.startsOnDate, cycleEndDate)
    ) {
      if (!activeSegment) {
        hasSegmentCoverageGap = true;
      }
    }

    if (!activeSegment || !activeShiftDefinition) {
      hasWorkScheduleGap = true;
      continue;
    }

    const weekday = getWeekdayForLocalDate(previewDate);

    if (!activeShiftDefinition.workDays.includes(weekday)) {
      hasWorkScheduleGap = true;
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

  if (hasWorkScheduleGap) {
    warnings.push({
      id: "previewHasNoWorkSchedule",
      message: "No work schedule applies to part of this preview range.",
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

function findActiveSegmentForDate(
  shiftCycle: ShiftCycle,
  date: LocalDateString,
): ShiftCycle["segments"][number] | null {
  return (
    shiftCycle.segments.find(
      (segment) => segment.startsOnDate <= date && segment.endsOnDate >= date,
    ) ?? null
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

function getWeekdayForLocalDate(localDate: LocalDateString): ShiftDefinition["workDays"][number] {
  const [year, month, day] = localDate.split("-").map(Number);
  const weekday = new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0).getDay();

  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][
    weekday
  ] as ShiftDefinition["workDays"][number];
}
