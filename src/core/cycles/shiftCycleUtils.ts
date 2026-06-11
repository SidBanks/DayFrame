import type { LocalDateString } from "../shifts/types.js";
import type { ShiftCycle, ShiftCycleMode, ShiftCycleSequenceDay, ShiftSegment } from "./types.js";

export function resolveShiftCycleMode(shiftCycle: ShiftCycle): ShiftCycleMode {
  return shiftCycle.mode ?? "manualSegments";
}

export function normalizeShiftCycle(shiftCycle: ShiftCycle): ShiftCycle {
  const mode = resolveShiftCycleMode(shiftCycle);

  return {
    ...shiftCycle,
    mode,
    sequenceAnchorDate: shiftCycle.sequenceAnchorDate ?? shiftCycle.startsOnDate,
    sequence: shiftCycle.sequence ? cloneSequenceDays(shiftCycle.sequence) : [],
    segments: cloneSegments(shiftCycle.segments),
  };
}

export function normalizeShiftCycles(shiftCycles: ShiftCycle[]): ShiftCycle[] {
  return shiftCycles.map(normalizeShiftCycle);
}

export function cloneShiftCycle(shiftCycle: ShiftCycle): ShiftCycle {
  return normalizeShiftCycle(shiftCycle);
}

export function cloneShiftCycles(shiftCycles: ShiftCycle[]): ShiftCycle[] {
  return normalizeShiftCycles(shiftCycles);
}

export function getShiftCycleEndDate(shiftCycle: ShiftCycle): LocalDateString {
  return shiftCycle.endsOnDate ?? shiftCycle.startsOnDate;
}

export function isDateWithinCycle(date: LocalDateString, shiftCycle: ShiftCycle): boolean {
  return shiftCycle.startsOnDate <= date && date <= getShiftCycleEndDate(shiftCycle);
}

export function validateShiftCycles(shiftCycles: ShiftCycle[]): void {
  const normalizedShiftCycles = normalizeShiftCycles(shiftCycles);

  for (const shiftCycle of normalizedShiftCycles) {
    validateShiftCycle(shiftCycle);
  }

  const sortedShiftCycles = [...normalizedShiftCycles].sort((left, right) =>
    left.startsOnDate.localeCompare(right.startsOnDate),
  );

  for (let index = 1; index < sortedShiftCycles.length; index += 1) {
    const previousCycle = sortedShiftCycles[index - 1]!;
    const currentCycle = sortedShiftCycles[index]!;

    if (getShiftCycleEndDate(previousCycle) >= currentCycle.startsOnDate) {
      throw new RangeError("shiftCycles must not overlap");
    }
  }
}

export function validateShiftCycle(shiftCycle: ShiftCycle): void {
  validateLocalDateOrder(
    shiftCycle.startsOnDate,
    getShiftCycleEndDate(shiftCycle),
    `shiftCycle ${shiftCycle.id} startsOnDate must be on or before endsOnDate`,
  );

  const mode = resolveShiftCycleMode(shiftCycle);

  if (mode === "repeatingSequence") {
    validateRepeatingSequenceCycle(shiftCycle);
    return;
  }

  validateManualSegmentsCycle(shiftCycle);
}

export function getRepeatingSequenceDayForLocalDate(
  shiftCycle: ShiftCycle,
  localDate: LocalDateString,
): ShiftCycleSequenceDay | null {
  const normalizedShiftCycle = normalizeShiftCycle(shiftCycle);

  if (resolveShiftCycleMode(normalizedShiftCycle) !== "repeatingSequence") {
    return null;
  }

  if (!isDateWithinCycle(localDate, normalizedShiftCycle)) {
    return null;
  }

  const sequence = normalizedShiftCycle.sequence ?? [];

  if (sequence.length === 0) {
    return null;
  }

  const anchorDate = normalizedShiftCycle.sequenceAnchorDate ?? normalizedShiftCycle.startsOnDate;
  const sortedSequence = [...sequence].sort((left, right) => left.dayOffset - right.dayOffset);
  const daysSinceAnchor = getLocalDateDiff(anchorDate, localDate);
  const sequenceIndex =
    ((daysSinceAnchor % sortedSequence.length) + sortedSequence.length) % sortedSequence.length;

  return sortedSequence[sequenceIndex] ?? null;
}

export function getLocalDateDiff(startDate: LocalDateString, endDate: LocalDateString): number {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60_000));
}

export function addDaysToLocalDate(localDate: LocalDateString, days: number): LocalDateString {
  const date = parseLocalDate(localDate);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

function validateManualSegmentsCycle(shiftCycle: ShiftCycle): void {
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

function validateRepeatingSequenceCycle(shiftCycle: ShiftCycle): void {
  if (!shiftCycle.sequenceAnchorDate) {
    throw new RangeError("repeatingSequence cycles require sequenceAnchorDate");
  }

  validateLocalDateOrder(
    shiftCycle.sequenceAnchorDate,
    getShiftCycleEndDate(shiftCycle),
    `shiftCycle ${shiftCycle.id} sequenceAnchorDate must be on or before endsOnDate`,
  );

  const sequence = shiftCycle.sequence ?? [];

  if (sequence.length === 0) {
    throw new RangeError("repeatingSequence cycles require at least one sequence day");
  }

  const seenOffsets = new Set<number>();

  for (const sequenceDay of sequence) {
    if (!Number.isInteger(sequenceDay.dayOffset)) {
      throw new RangeError("shiftCycle sequence dayOffset must be an integer");
    }

    if (sequenceDay.dayOffset < 0) {
      throw new RangeError("shiftCycle sequence dayOffset must not be negative");
    }

    if (seenOffsets.has(sequenceDay.dayOffset)) {
      throw new RangeError("shiftCycle sequence dayOffsets must be unique");
    }

    seenOffsets.add(sequenceDay.dayOffset);
  }

  const sortedOffsets = [...seenOffsets].sort((left, right) => left - right);

  for (let index = 0; index < sortedOffsets.length; index += 1) {
    if (sortedOffsets[index] !== index) {
      throw new RangeError("shiftCycle sequence dayOffsets must be contiguous from 0");
    }
  }
}

function cloneSegments(segments: ShiftSegment[]): ShiftSegment[] {
  return segments.map((segment) => ({
    ...segment,
    ...(segment.schedulePreferences
      ? {
          schedulePreferences: {
            ...segment.schedulePreferences,
          },
        }
      : {}),
  }));
}

function cloneSequenceDays(sequenceDays: ShiftCycleSequenceDay[]): ShiftCycleSequenceDay[] {
  return sequenceDays.map((sequenceDay) => ({
    ...sequenceDay,
  }));
}

function parseLocalDate(localDate: LocalDateString): Date {
  const [year, month, day] = localDate.split("-").map(Number);

  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);
}

function formatLocalDate(date: Date): LocalDateString {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}` as LocalDateString;
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
