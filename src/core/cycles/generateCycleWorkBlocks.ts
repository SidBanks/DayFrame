import { generateWorkBlocks } from "../shifts/generateWorkBlocks.js";
import { resolveEffectiveSchedulePreferencesForDate } from "./resolveEffectiveSchedulePreferences.js";
import type { GeneratedWorkBlock, LocalDateString, ShiftDefinition } from "../shifts/types.js";
import type {
  GenerateCycleWorkBlocksInput,
  GeneratedCycleWorkBlock,
  ShiftCycle,
  ShiftSegment,
} from "./types.js";
import {
  addDaysToLocalDate,
  getRepeatingSequenceDayForLocalDate,
  getShiftCycleEndDate,
  normalizeShiftCycles,
  resolveShiftCycleMode,
  validateShiftCycles,
} from "./shiftCycleUtils.js";
import { getUserDayDate, parseTimeString } from "../time/userDay.js";

export function generateCycleWorkBlocks(
  input: GenerateCycleWorkBlocksInput,
): GeneratedCycleWorkBlock[] {
  const shiftCycles = normalizeShiftCycles(
    input.shiftCycles ?? (input.shiftCycle ? [input.shiftCycle] : []),
  );
  validatePlanningWindow(input.planningWindowStart, input.planningWindowEnd);
  validateShiftCycles(shiftCycles);
  const defaultSchedulingPreferences = input.defaultSchedulingPreferences ?? {
    dayBoundaryStartTime: input.dayBoundaryStartTime ?? "03:00",
    weekStartsOn: "saturday",
  };

  const shiftDefinitionsById = new Map<string, ShiftDefinition>(
    input.shiftDefinitions.map((shiftDefinition) => [shiftDefinition.id, shiftDefinition]),
  );
  const cycleBlocks: GeneratedCycleWorkBlock[] = [];

  for (const shiftCycle of shiftCycles) {
    if (resolveShiftCycleMode(shiftCycle) === "repeatingSequence") {
      cycleBlocks.push(
        ...generateRepeatingSequenceWorkBlocks({
          shiftCycle,
          shiftDefinitionsById,
          planningWindowStart: input.planningWindowStart,
          planningWindowEnd: input.planningWindowEnd,
          shiftCycles,
          defaultSchedulingPreferences,
        }),
      );
      continue;
    }

    for (const segment of shiftCycle.segments) {
      cycleBlocks.push(
        ...generateManualSegmentWorkBlocks({
          segment,
          shiftCycle,
          shiftDefinitionsById,
          planningWindowStart: input.planningWindowStart,
          planningWindowEnd: input.planningWindowEnd,
          shiftCycles,
          defaultSchedulingPreferences,
        }),
      );
    }
  }

  return cycleBlocks.sort((left, right) => left.startsAt.getTime() - right.startsAt.getTime());
}

function generateManualSegmentWorkBlocks(input: {
  segment: ShiftSegment;
  shiftCycle: ShiftCycle;
  shiftDefinitionsById: Map<string, ShiftDefinition>;
  planningWindowStart: Date;
  planningWindowEnd: Date;
  shiftCycles: ShiftCycle[];
  defaultSchedulingPreferences: NonNullable<
    GenerateCycleWorkBlocksInput["defaultSchedulingPreferences"]
  >;
}): GeneratedCycleWorkBlock[] {
  const shiftDefinition = input.shiftDefinitionsById.get(input.segment.shiftDefinitionId);

  if (!shiftDefinition) {
    throw new RangeError(
      `Missing shift definition for segment ${input.segment.id}: ${input.segment.shiftDefinitionId}`,
    );
  }

  const segmentWindow = getSegmentPlanningWindow(
    input.segment,
    input.planningWindowStart,
    input.planningWindowEnd,
  );

  if (!segmentWindow) {
    return [];
  }

  return generateWorkBlocks({
    shiftDefinition,
    planningWindowStart: segmentWindow.start,
    planningWindowEnd: segmentWindow.end,
    dayBoundaryStartTime: resolveEffectiveSchedulePreferencesForDate({
      shiftCycles: input.shiftCycles,
      defaultSchedulingPreferences: input.defaultSchedulingPreferences,
      date: new Date(`${input.segment.startsOnDate}T12:00:00`),
    }).dayBoundaryStartTime,
  }).map((workBlock) => ({
    ...workBlock,
    shiftCycleId: input.shiftCycle.id,
    shiftSegmentId: input.segment.id,
  }));
}

function generateRepeatingSequenceWorkBlocks(input: {
  shiftCycle: ShiftCycle;
  shiftDefinitionsById: Map<string, ShiftDefinition>;
  planningWindowStart: Date;
  planningWindowEnd: Date;
  shiftCycles: ShiftCycle[];
  defaultSchedulingPreferences: NonNullable<
    GenerateCycleWorkBlocksInput["defaultSchedulingPreferences"]
  >;
}): GeneratedCycleWorkBlock[] {
  const cycleBlocks: GeneratedCycleWorkBlock[] = [];
  let currentDate = input.shiftCycle.startsOnDate;
  const endDate = getShiftCycleEndDate(input.shiftCycle);

  while (currentDate <= endDate) {
    const sequenceDay = getRepeatingSequenceDayForLocalDate(input.shiftCycle, currentDate);

    if (sequenceDay?.shiftDefinitionId) {
      const shiftDefinition = input.shiftDefinitionsById.get(sequenceDay.shiftDefinitionId);

      if (!shiftDefinition) {
        throw new RangeError(
          `Missing shift definition for sequence day ${sequenceDay.id}: ${sequenceDay.shiftDefinitionId}`,
        );
      }

      const dayBoundaryStartTime = resolveEffectiveSchedulePreferencesForDate({
        shiftCycles: input.shiftCycles,
        defaultSchedulingPreferences: input.defaultSchedulingPreferences,
        date: new Date(`${currentDate}T12:00:00`),
      }).dayBoundaryStartTime;
      const workBlock = createWorkBlockForLocalDate(
        currentDate,
        shiftDefinition,
        dayBoundaryStartTime,
      );

      if (
        overlapsPlanningWindow(
          workBlock.startsAt,
          workBlock.endsAt,
          input.planningWindowStart,
          input.planningWindowEnd,
        )
      ) {
        cycleBlocks.push({
          ...workBlock,
          shiftCycleId: input.shiftCycle.id,
          shiftSegmentId: sequenceDay.id,
        });
      }
    }

    currentDate = addDaysToLocalDate(currentDate, 1);
  }

  return cycleBlocks;
}

function validatePlanningWindow(planningWindowStart: Date, planningWindowEnd: Date): void {
  if (planningWindowStart.getTime() >= planningWindowEnd.getTime()) {
    throw new RangeError("planningWindowStart must be before planningWindowEnd");
  }
}

function getSegmentPlanningWindow(
  segment: ShiftSegment,
  planningWindowStart: Date,
  planningWindowEnd: Date,
): { start: Date; end: Date } | null {
  const segmentStart = new Date(`${segment.startsOnDate}T00:00:00`);
  const segmentEndExclusive = new Date(`${segment.endsOnDate}T00:00:00`);

  // Segment dates are inclusive, so the exclusive cutoff is the next calendar date.
  segmentEndExclusive.setDate(segmentEndExclusive.getDate() + 1);

  const start = new Date(Math.max(segmentStart.getTime(), planningWindowStart.getTime()));
  const end = new Date(Math.min(segmentEndExclusive.getTime(), planningWindowEnd.getTime()));

  if (start.getTime() >= end.getTime()) {
    return null;
  }

  return { start, end };
}

function createWorkBlockForLocalDate(
  localDate: LocalDateString,
  shiftDefinition: ShiftDefinition,
  dayBoundaryStartTime: GenerateCycleWorkBlocksInput["dayBoundaryStartTime"],
): GeneratedWorkBlock {
  const [year, month, day] = localDate.split("-").map(Number);
  const startTime = parseTimeString(shiftDefinition.startTime);
  const endTime = parseTimeString(shiftDefinition.endTime);
  const startsAt = new Date(
    year ?? 2026,
    (month ?? 1) - 1,
    day ?? 1,
    startTime.hours,
    startTime.minutes,
    0,
    0,
  );
  const endsAt = new Date(
    year ?? 2026,
    (month ?? 1) - 1,
    day ?? 1,
    endTime.hours,
    endTime.minutes,
    0,
    0,
  );
  const crossesMidnight = endTime.totalMinutes <= startTime.totalMinutes;

  if (crossesMidnight) {
    endsAt.setDate(endsAt.getDate() + 1);
  }

  return {
    id: `work_${shiftDefinition.id}_${localDate}`,
    shiftDefinitionId: shiftDefinition.id,
    userId: shiftDefinition.userId,
    title: shiftDefinition.name,
    anchorType: "work",
    startsAt,
    endsAt,
    startDate: localDate,
    endDate: `${endsAt.getFullYear()}-${String(endsAt.getMonth() + 1).padStart(2, "0")}-${String(
      endsAt.getDate(),
    ).padStart(2, "0")}` as LocalDateString,
    userDayDate: getUserDayDate(startsAt, dayBoundaryStartTime ?? "03:00") as LocalDateString,
    crossesMidnight,
  };
}

function overlapsPlanningWindow(
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
