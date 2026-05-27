import { describe, expect, it } from "vitest";

import { generateCycleWorkBlocks } from "../generateCycleWorkBlocks.js";
import type { ShiftCycle } from "../types.js";
import type { ShiftDefinition } from "../../shifts/types.js";

const baseTimestamps = {
  createdAt: "2026-05-01T00:00:00-05:00",
  updatedAt: "2026-05-01T00:00:00-05:00",
} as const;

const shiftDefinitions: ShiftDefinition[] = [
  {
    id: "shift_day",
    userId: "user_001",
    name: "Day Shift",
    startTime: "05:45",
    endTime: "14:15",
    workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    crossesMidnight: false,
    ...baseTimestamps,
  },
  {
    id: "shift_night",
    userId: "user_001",
    name: "Night Shift",
    startTime: "21:45",
    endTime: "06:15",
    workDays: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
    crossesMidnight: true,
    ...baseTimestamps,
  },
];

describe("generateCycleWorkBlocks", () => {
  it("generates work blocks from multiple shift segments in one planning window", () => {
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "May Rotation",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_day",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_day",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-15",
        },
        {
          id: "segment_night",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_night",
          startsOnDate: "2026-05-16",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    };

    const workBlocks = generateCycleWorkBlocks({
      shiftCycle,
      shiftDefinitions,
      planningWindowStart: new Date(2026, 4, 14, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 19, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(workBlocks.map((workBlock) => workBlock.shiftSegmentId)).toEqual([
      "segment_day",
      "segment_day",
      "segment_night",
      "segment_night",
    ]);
    expect(workBlocks.map((workBlock) => workBlock.startDate)).toEqual([
      "2026-05-14",
      "2026-05-15",
      "2026-05-17",
      "2026-05-18",
    ]);
  });

  it("does not generate blocks past a segment boundary", () => {
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Boundary Cycle",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_day",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_day",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-15",
        },
        {
          id: "segment_night",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_night",
          startsOnDate: "2026-05-16",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    };

    const workBlocks = generateCycleWorkBlocks({
      shiftCycle,
      shiftDefinitions,
      planningWindowStart: new Date(2026, 4, 15, 20, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 16, 12, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(workBlocks).toHaveLength(0);
  });

  it("includes an overnight block when its start date belongs to the active segment", () => {
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Night Cycle",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_night",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_night",
          startsOnDate: "2026-05-16",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    };

    const workBlocks = generateCycleWorkBlocks({
      shiftCycle,
      shiftDefinitions,
      planningWindowStart: new Date(2026, 4, 18, 1, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 18, 2, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(workBlocks).toHaveLength(1);
    expect(workBlocks[0]).toMatchObject({
      shiftSegmentId: "segment_night",
      startDate: "2026-05-17",
      endDate: "2026-05-18",
      crossesMidnight: true,
    });
  });

  it("rejects segments that reference a missing shift definition", () => {
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Broken Cycle",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_missing",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_missing",
          startsOnDate: "2026-05-16",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    };

    expect(() =>
      generateCycleWorkBlocks({
        shiftCycle,
        shiftDefinitions,
        planningWindowStart: new Date(2026, 4, 16, 0, 0, 0, 0),
        planningWindowEnd: new Date(2026, 4, 17, 0, 0, 0, 0),
        dayBoundaryStartTime: "03:00",
      }),
    ).toThrow(RangeError);
  });
});
