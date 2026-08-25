import { describe, expect, it } from "vitest";
import type { ShiftCycle } from "../../cycles/types.js";
import type { LocalDateString } from "../../shifts/types.js";
import {
  resolveUserDayContainingInstant,
  resolveUserDayWindowForLabel,
} from "../canonicalUserDay.js";

const defaults = { dayBoundaryStartTime: "03:00" as const, weekStartsOn: "monday" as const };

function cycles(boundaries: Record<string, `${number}:${number}`>): ShiftCycle[] {
  const dates = Object.keys(boundaries).sort();
  return [
    {
      id: "cycle",
      userId: "user",
      name: "transition",
      type: "fixedSegments",
      mode: "manualSegments",
      startsOnDate: dates[0] as LocalDateString,
      endsOnDate: dates.at(-1) as LocalDateString,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      segments: dates.map((date, index) => ({
        id: `segment-${index}`,
        shiftCycleId: "cycle",
        shiftDefinitionId: `shift-${index}`,
        startsOnDate: date as LocalDateString,
        endsOnDate: date as LocalDateString,
        schedulePreferences: { dayBoundaryStartTime: boundaries[date]! },
      })),
    },
  ];
}

describe("canonical piecewise user-days", () => {
  it.each([
    ["03:00", "03:00", 24 * 60],
    ["03:00", "06:00", 27 * 60],
    ["06:00", "03:00", 21 * 60],
    ["00:00", "12:00", 36 * 60],
    ["12:00", "00:00", 12 * 60],
  ] as const)("resolves %s to %s as consecutive starts", (left, right, durationMinutes) => {
    const window = resolveUserDayWindowForLabel({
      shiftCycles: cycles({ "2026-08-22": left, "2026-08-23": right }),
      defaultSchedulingPreferences: defaults,
      userDayDate: "2026-08-22",
    });
    expect(window.start.getHours()).toBe(Number(left.slice(0, 2)));
    expect(window.end.getHours()).toBe(Number(right.slice(0, 2)));
    expect(window.durationMinutes).toBe(durationMinutes);
  });

  it("assigns exact starts to the incoming label without gaps or overlaps", () => {
    const shiftCycles = cycles({
      "2026-08-21": "03:00",
      "2026-08-22": "03:00",
      "2026-08-23": "06:00",
      "2026-08-24": "03:00",
    });
    const atEnd = resolveUserDayContainingInstant({
      shiftCycles,
      defaultSchedulingPreferences: defaults,
      instant: new Date(2026, 7, 23, 6, 0),
    });
    const beforeEnd = resolveUserDayContainingInstant({
      shiftCycles,
      defaultSchedulingPreferences: defaults,
      instant: new Date(2026, 7, 23, 5, 59),
    });
    expect(atEnd.userDayDate).toBe("2026-08-23");
    expect(beforeEnd.userDayDate).toBe("2026-08-22");
  });

  it("returns clone-isolated dates", () => {
    const input = {
      shiftCycles: [],
      defaultSchedulingPreferences: defaults,
      userDayDate: "2026-08-22" as LocalDateString,
    };
    const first = resolveUserDayWindowForLabel(input);
    first.end.setFullYear(2000);
    expect(resolveUserDayWindowForLabel(input).end.getFullYear()).toBe(2026);
  });

  it("keeps starts increasing across supported local DST transitions", () => {
    const spring = resolveUserDayWindowForLabel({
      shiftCycles: [],
      defaultSchedulingPreferences: defaults,
      userDayDate: "2026-03-07",
    });
    const fall = resolveUserDayWindowForLabel({
      shiftCycles: [],
      defaultSchedulingPreferences: defaults,
      userDayDate: "2026-10-31",
    });
    expect(spring.end.getTime()).toBeGreaterThan(spring.start.getTime());
    expect(fall.end.getTime()).toBeGreaterThan(fall.start.getTime());
    // America/Chicago is the repository execution timezone; do not require these
    // elapsed values in hosts that run the suite in a different local timezone.
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === "America/Chicago") {
      expect(spring.durationMinutes).toBe(23 * 60);
      expect(fall.durationMinutes).toBe(25 * 60);
    }
  });
});
