import { describe, expect, it } from "vitest";

import { getUserDay, getUserDayDate, isSameUserDay, parseTimeString } from "../userDay.js";

describe("userDay", () => {
  it("parseTimeString returns hours, minutes, and total minutes", () => {
    expect(parseTimeString("3:05")).toEqual({
      hours: 3,
      minutes: 5,
      totalMinutes: 185,
    });
  });

  it("parseTimeString rejects out-of-range values", () => {
    expect(() => parseTimeString("24:00")).toThrow(RangeError);
    expect(() => parseTimeString("9:60")).toThrow(RangeError);
  });

  it("midnight boundary behaves like normal calendar days", () => {
    const date = new Date(2026, 4, 1, 0, 30, 0, 0);

    expect(getUserDayDate(date, "0:00")).toBe("2026-05-01");
  });

  it("timestamps before the boundary belong to the previous user day", () => {
    const date = new Date(2026, 4, 1, 1, 30, 0, 0);

    expect(getUserDayDate(date, "3:00")).toBe("2026-04-30");
  });

  it("timestamps at the boundary begin a new user day", () => {
    const date = new Date(2026, 4, 1, 3, 0, 0, 0);
    const userDay = getUserDay(date, "3:00");

    expect(userDay.userDayDate).toBe("2026-05-01");
    expect(userDay.start.getTime()).toBe(new Date(2026, 4, 1, 3, 0, 0, 0).getTime());
    expect(userDay.end.getTime()).toBe(new Date(2026, 4, 2, 3, 0, 0, 0).getTime());
  });

  it("isSameUserDay respects the custom boundary across midnight", () => {
    const lateNight = new Date(2026, 4, 1, 23, 30, 0, 0);
    const earlyMorning = new Date(2026, 4, 2, 1, 15, 0, 0);

    expect(isSameUserDay(lateNight, earlyMorning, "3:00")).toBe(true);
  });
});
