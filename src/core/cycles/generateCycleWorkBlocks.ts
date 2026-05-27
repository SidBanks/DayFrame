import { generateWorkBlocks } from "../shifts/generateWorkBlocks.js";
import { resolveEffectiveSchedulePreferencesForDate } from "./resolveEffectiveSchedulePreferences.js";
import type { ShiftDefinition } from "../shifts/types.js";
import type {
  GenerateCycleWorkBlocksInput,
  GeneratedCycleWorkBlock,
  ShiftSegment,
} from "./types.js";

export function generateCycleWorkBlocks(
  input: GenerateCycleWorkBlocksInput,
): GeneratedCycleWorkBlock[] {
  validatePlanningWindow(input.planningWindowStart, input.planningWindowEnd);
  const defaultSchedulingPreferences = input.defaultSchedulingPreferences ?? {
    dayBoundaryStartTime: input.dayBoundaryStartTime ?? "03:00",
    weekStartsOn: "saturday",
  };

  const shiftDefinitionsById = new Map<string, ShiftDefinition>(
    input.shiftDefinitions.map((shiftDefinition) => [shiftDefinition.id, shiftDefinition]),
  );
  const cycleBlocks: GeneratedCycleWorkBlock[] = [];

  for (const segment of input.shiftCycle.segments) {
    const shiftDefinition = shiftDefinitionsById.get(segment.shiftDefinitionId);

    if (!shiftDefinition) {
      throw new RangeError(
        `Missing shift definition for segment ${segment.id}: ${segment.shiftDefinitionId}`,
      );
    }

    const segmentWindow = getSegmentPlanningWindow(
      segment,
      input.planningWindowStart,
      input.planningWindowEnd,
    );

    if (!segmentWindow) {
      continue;
    }

    const workBlocks = generateWorkBlocks({
      shiftDefinition,
      planningWindowStart: segmentWindow.start,
      planningWindowEnd: segmentWindow.end,
      dayBoundaryStartTime: resolveEffectiveSchedulePreferencesForDate({
        shiftCycle: input.shiftCycle,
        defaultSchedulingPreferences,
        date: new Date(`${segment.startsOnDate}T12:00:00`),
      }).dayBoundaryStartTime,
    });

    for (const workBlock of workBlocks) {
      cycleBlocks.push({
        ...workBlock,
        shiftCycleId: input.shiftCycle.id,
        shiftSegmentId: segment.id,
      });
    }
  }

  return cycleBlocks.sort((left, right) => left.startsAt.getTime() - right.startsAt.getTime());
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
