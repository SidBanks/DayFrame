import type { GetActiveShiftSegmentInput, ShiftCycle, ShiftSegment } from "./types.js";
import { formatLocalDate } from "../time/userDay.js";
import type { LocalDateString } from "../shifts/types.js";

export function getActiveShiftSegment(input: GetActiveShiftSegmentInput): ShiftSegment | null {
  validateShiftCycle(input.shiftCycle);

  const localDate = formatLocalDate(input.date) as LocalDateString;

  return (
    input.shiftCycle.segments.find((segment) => isDateWithinSegment(localDate, segment)) ?? null
  );
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
