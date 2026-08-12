import type { GetActiveShiftSegmentInput, ShiftCycle, ShiftSegment } from "./types.js";
import { formatLocalDate } from "../time/userDay.js";
import type { LocalDateString } from "../shifts/types.js";
import {
  isDateWithinCycle,
  resolveShiftCycleMode,
  validateShiftCycles,
} from "./shiftCycleUtils.js";

export function getActiveShiftSegment(input: GetActiveShiftSegmentInput): ShiftSegment | null {
  const shiftCycles = input.shiftCycles ?? [];
  const localDate = formatLocalDate(input.date) as LocalDateString;
  const activeShiftCycle = getActiveShiftCycleForLocalDate(shiftCycles, localDate);

  if (!activeShiftCycle) {
    return null;
  }

  if (resolveShiftCycleMode(activeShiftCycle) !== "manualSegments") {
    return null;
  }

  return (
    activeShiftCycle.segments.find((segment) => isDateWithinSegment(localDate, segment)) ?? null
  );
}

export function getActiveShiftCycleForLocalDate(
  shiftCycles: ShiftCycle[],
  localDate: LocalDateString,
): ShiftCycle | null {
  validateShiftCycles(shiftCycles);
  const matchingCycles = shiftCycles.filter((shiftCycle) =>
    isDateWithinCycle(localDate, shiftCycle),
  );

  return matchingCycles[0] ?? null;
}

function isDateWithinSegment(date: LocalDateString, segment: ShiftSegment): boolean {
  return segment.startsOnDate <= date && date <= segment.endsOnDate;
}
