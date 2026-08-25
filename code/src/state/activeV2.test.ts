import { describe, expect, it } from "vitest";
import {
  createActiveV2,
  instantiateActiveSetup,
  projectActiveToPattern,
  validateActiveV2,
} from "./activeV2.js";
import type { DayFrameAuthoredPattern } from "./types.js";
import { isSourceIncarnationId } from "../core/authored/sourceIncarnation.js";

const pattern: DayFrameAuthoredPattern = {
  schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "saturday" },
  previewRange: { preset: "threeDays", startDate: "2026-05-04", endDate: "2026-05-06" },
  shiftDefinitions: [],
  shiftCycles: [],
  blockTemplates: [],
  blockRecurrences: [],
  manualEvents: [
    {
      id: "event-1",
      title: "Appointment",
      userDayDate: "2026-05-04",
      allDay: true,
      createdAt: "2026-05-01T00:00:00Z",
      updatedAt: "2026-05-01T00:00:00Z",
    },
  ],
};

describe("Active V2 source incarnations", () => {
  it("instantiates canonical injected incarnations and strips them from V1 projections", () => {
    const active = instantiateActiveSetup(
      pattern,
      () => "00000000-0000-4000-8000-000000000001" as never,
    );

    expect(active.manualEvents[0]?.incarnationId).toBe("00000000-0000-4000-8000-000000000001");
    expect(projectActiveToPattern(active)).toEqual(pattern);
    expect(validateActiveV2(createActiveV2(active))).toEqual(createActiveV2(active));
  });

  it("rejects noncanonical and duplicate incarnation values", () => {
    expect(() => instantiateActiveSetup(pattern, () => "not-a-uuid" as never)).toThrow(
      /canonical UUID v4/,
    );
    const duplicatePattern = {
      ...pattern,
      manualEvents: [...pattern.manualEvents, { ...pattern.manualEvents[0]!, id: "event-2" }],
    };
    expect(() =>
      instantiateActiveSetup(
        duplicatePattern,
        () => "00000000-0000-4000-8000-000000000001" as never,
      ),
    ).toThrow(/globally unique/);
  });

  it.each([
    ["00000000-0000-4000-8000-000000000001", true],
    ["00000000-0000-4000-8000-00000000000A", false],
    ["00000000-0000-3000-8000-000000000001", false],
    ["not-a-uuid", false],
    ["", false],
  ])("validates canonical UUID-v4 value %s", (value, expected) => {
    expect(isSourceIncarnationId(value)).toBe(expected);
  });

  it("rejects duplicate incarnation across top-level and nested source kinds", () => {
    const graphPattern: DayFrameAuthoredPattern = {
      ...pattern,
      shiftCycles: [
        {
          id: "cycle-1",
          userId: "user-1",
          name: "Cycle",
          type: "fixedSegments",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
          createdAt: "2026-05-01T00:00:00Z",
          updatedAt: "2026-05-01T00:00:00Z",
          segments: [
            {
              id: "segment-1",
              shiftCycleId: "cycle-1",
              shiftDefinitionId: "shift-1",
              startsOnDate: "2026-05-01",
              endsOnDate: "2026-05-31",
            },
          ],
        },
      ],
      shiftDefinitions: [
        {
          id: "shift-1",
          userId: "user-1",
          name: "Shift",
          startTime: "09:00",
          endTime: "17:00",
          workDays: ["monday"],
          crossesMidnight: false,
          createdAt: "2026-05-01T00:00:00Z",
          updatedAt: "2026-05-01T00:00:00Z",
        },
      ],
    };
    expect(() =>
      instantiateActiveSetup(graphPattern, () => "00000000-0000-4000-8000-000000000001" as never),
    ).toThrow(/globally unique/);
  });
});
