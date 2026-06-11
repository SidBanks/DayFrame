import type { GetActiveShiftSegmentInput, ShiftCycle, ShiftSegment } from "./types.js";
import { formatLocalDate } from "../time/userDay.js";
import type { LocalDateString } from "../shifts/types.js";

export function getActiveShiftSegment(input: GetActiveShiftSegmentInput): ShiftSegment | null {
  const shiftCycles = input.shiftCycles ?? (input.shiftCycle ? [input.shiftCycle] : []);
  const localDate = formatLocalDate(input.date) as LocalDateString;
  const activeShiftCycle = getActiveShiftCycleForLocalDate(shiftCycles, localDate);

  if (!activeShiftCycle) {
    return null;
  }

  return activeShiftCycle.segments.find((segment) => isDateWithinSegment(localDate, segment)) ?? null;
}

export function getActiveShiftCycleForLocalDate(
  shiftCycles: ShiftCycle[],
  localDate: LocalDateString,
): ShiftCycle | null {
  validateShiftCycles(shiftCycles);
  const matchingCycles = shiftCycles.filter((shiftCycle) => isDateWithinCycle(localDate, shiftCycle));

  if (matchingCycles.length > 1) {
    throw new RangeError("shiftCycles must not overlap");
  }

  return matchingCycles[0] ?? null;
}

function validateShiftCycles(shiftCycles: ShiftCycle[]): void {
  for (const shiftCycle of shiftCycles) {
    validateShiftCycle(shiftCycle);
  }
}

function validateShiftCycle(shiftCycle: ShiftCycle): void {
  if (shiftCycle.segments.length === 0) {
    return;
  }

  const sortedSegments = [...shiftCycle.segments].sort(compareSegmentsByStartDate);

  for (let index = 0; index < sortedSegments.length; index += 1) {
    const currentSegment = sortedSegments[index]!;

    validateLocalDateOrder(
      currentSegment.startsOnDate,
      currentSegment.endsOnDate,
      `segment ${currentSegment.id} startsOnDate must be on or before endsOnDate`,
    );

    if (index === 0) {
      continue;
    }

    const previousSegment = sortedSegments[index - 1]!;

    if (previousSegment.endsOnDate >= currentSegment.startsOnDate) {
      throw new RangeError("shiftCycle segments must not overlap");
    }
  }
}

function isDateWithinSegment(date: LocalDateString, segment: ShiftSegment): boolean {
  return segment.startsOnDate <= date && date <= segment.endsOnDate;
}

function isDateWithinCycle(date: LocalDateString, shiftCycle: ShiftCycle): boolean {
  const cycleEndDate = shiftCycle.endsOnDate ?? shiftCycle.startsOnDate;

  return shiftCycle.startsOnDate <= date && date <= cycleEndDate;
}

function compareSegmentsByStartDate(left: ShiftSegment, right: ShiftSegment): number {
  if (left.startsOnDate < right.startsOnDate) {
    return -1;
  }

  if (left.startsOnDate > right.startsOnDate) {
    return 1;
  }

  return 0;
}

function validateLocalDateOrder(
  startDate: LocalDateString,
  endDate: LocalDateString,
  errorMessage: string,
): void {
  if (startDate > endDate) {
    throw new RangeError(errorMessage);
  }
}
