import { describe, expect, it } from "vitest";

import { getActiveShiftSegment } from "../getActiveShiftSegment.js";
import type { ShiftCycle } from "../types.js";

const baseTimestamps = {
  createdAt: "2026-05-01T00:00:00-05:00",
  updatedAt: "2026-05-01T00:00:00-05:00",
} as const;

describe("getActiveShiftSegment", () => {
  it("returns the segment active for a date inside its bounds", () => {
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Spring Cycle",
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

    expect(
      getActiveShiftSegment({
        shiftCycle,
        date: new Date(2026, 4, 20, 12, 0, 0, 0),
      }),
    ).toMatchObject({
      id: "segment_night",
      shiftDefinitionId: "shift_night",
    });
  });

  it("returns null when no segment is active for the date", () => {
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Spring Cycle",
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
      ],
      ...baseTimestamps,
    };

    expect(
      getActiveShiftSegment({
        shiftCycle,
        date: new Date(2026, 4, 20, 12, 0, 0, 0),
      }),
    ).toBeNull();
  });

  it("treats segment boundaries as inclusive", () => {
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Spring Cycle",
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
      ],
      ...baseTimestamps,
    };

    expect(
      getActiveShiftSegment({
        shiftCycle,
        date: new Date(2026, 4, 15, 23, 59, 0, 0),
      }),
    ).toMatchObject({
      id: "segment_day",
    });
  });

  it("rejects overlapping segments", () => {
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Spring Cycle",
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
          id: "segment_evening",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_evening",
          startsOnDate: "2026-05-15",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    };

    expect(() =>
      getActiveShiftSegment({
        shiftCycle,
        date: new Date(2026, 4, 15, 12, 0, 0, 0),
      }),
    ).toThrow(RangeError);
  });
});
