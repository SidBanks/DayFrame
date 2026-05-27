import { describe, expect, it } from "vitest";

import { generateWorkBlocks } from "../generateWorkBlocks.js";
import type { ShiftDefinition } from "../types.js";

const baseTimestamps = {
  createdAt: "2026-05-01T00:00:00-05:00",
  updatedAt: "2026-05-01T00:00:00-05:00",
} as const;

describe("generateWorkBlocks", () => {
  it("generates day-shift work blocks on matching work days", () => {
    const shiftDefinition: ShiftDefinition = {
      id: "shift_day",
      userId: "user_001",
      name: "Day Shift",
      startTime: "05:45",
      endTime: "14:15",
      workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      crossesMidnight: false,
      ...baseTimestamps,
    };

    const workBlocks = generateWorkBlocks({
      shiftDefinition,
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 11, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(workBlocks).toHaveLength(5);
    expect(workBlocks[0]).toMatchObject({
      id: "work_shift_day_2026-05-04",
      shiftDefinitionId: "shift_day",
      title: "Day Shift",
      startDate: "2026-05-04",
      endDate: "2026-05-04",
      userDayDate: "2026-05-04",
      crossesMidnight: false,
    });
    expect(workBlocks[0]?.startsAt.getTime()).toBe(new Date(2026, 4, 4, 5, 45, 0, 0).getTime());
    expect(workBlocks[0]?.endsAt.getTime()).toBe(new Date(2026, 4, 4, 14, 15, 0, 0).getTime());
  });

  it("generates evening-shift work blocks without changing the end date", () => {
    const shiftDefinition: ShiftDefinition = {
      id: "shift_evening",
      userId: "user_001",
      name: "Evening Shift",
      startTime: "13:45",
      endTime: "22:15",
      workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      crossesMidnight: false,
      ...baseTimestamps,
    };

    const [workBlock] = generateWorkBlocks({
      shiftDefinition,
      planningWindowStart: new Date(2026, 4, 4, 12, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 4, 23, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(workBlock).toMatchObject({
      id: "work_shift_evening_2026-05-04",
      startDate: "2026-05-04",
      endDate: "2026-05-04",
      userDayDate: "2026-05-04",
      crossesMidnight: false,
    });
    expect(workBlock?.startsAt.getTime()).toBe(new Date(2026, 4, 4, 13, 45, 0, 0).getTime());
    expect(workBlock?.endsAt.getTime()).toBe(new Date(2026, 4, 4, 22, 15, 0, 0).getTime());
  });

  it("generates overnight night-shift work blocks across two calendar dates", () => {
    const shiftDefinition: ShiftDefinition = {
      id: "shift_night",
      userId: "user_001",
      name: "Night Shift",
      startTime: "21:45",
      endTime: "06:15",
      workDays: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
      crossesMidnight: true,
      ...baseTimestamps,
    };

    const [workBlock] = generateWorkBlocks({
      shiftDefinition,
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 4, 8, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(workBlock).toMatchObject({
      id: "work_shift_night_2026-05-03",
      startDate: "2026-05-03",
      endDate: "2026-05-04",
      userDayDate: "2026-05-03",
      crossesMidnight: true,
    });
    expect(workBlock?.startsAt.getTime()).toBe(new Date(2026, 4, 3, 21, 45, 0, 0).getTime());
    expect(workBlock?.endsAt.getTime()).toBe(new Date(2026, 4, 4, 6, 15, 0, 0).getTime());
  });

  it("only generates blocks for configured shift start days", () => {
    const shiftDefinition: ShiftDefinition = {
      id: "shift_night",
      userId: "user_001",
      name: "Night Shift",
      startTime: "21:45",
      endTime: "06:15",
      workDays: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
      crossesMidnight: true,
      ...baseTimestamps,
    };

    const workBlocks = generateWorkBlocks({
      shiftDefinition,
      planningWindowStart: new Date(2026, 4, 9, 7, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 10, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(workBlocks).toHaveLength(0);
  });

  it("filters out blocks that do not overlap the planning window", () => {
    const shiftDefinition: ShiftDefinition = {
      id: "shift_day",
      userId: "user_001",
      name: "Day Shift",
      startTime: "05:45",
      endTime: "14:15",
      workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      crossesMidnight: false,
      ...baseTimestamps,
    };

    const workBlocks = generateWorkBlocks({
      shiftDefinition,
      planningWindowStart: new Date(2026, 4, 4, 14, 15, 0, 0),
      planningWindowEnd: new Date(2026, 4, 4, 18, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(workBlocks).toHaveLength(0);
  });

  it("includes an overnight block that started before the window but overlaps it", () => {
    const shiftDefinition: ShiftDefinition = {
      id: "shift_night",
      userId: "user_001",
      name: "Night Shift",
      startTime: "21:45",
      endTime: "06:15",
      workDays: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
      crossesMidnight: true,
      ...baseTimestamps,
    };

    const [workBlock] = generateWorkBlocks({
      shiftDefinition,
      planningWindowStart: new Date(2026, 4, 4, 1, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 4, 2, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(workBlock).toMatchObject({
      id: "work_shift_night_2026-05-03",
      startDate: "2026-05-03",
      endDate: "2026-05-04",
      crossesMidnight: true,
    });
  });
});
