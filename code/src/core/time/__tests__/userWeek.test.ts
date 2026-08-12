import { describe, expect, it } from "vitest";

import { getUserWeek, getUserWeekStartDate, isSameUserWeek } from "../userWeek.js";

describe("userWeek", () => {
  it("a custom saturday week start anchors the week correctly", () => {
    const date = new Date(2026, 4, 6, 12, 0, 0, 0);

    expect(
      getUserWeekStartDate(date, {
        dayBoundaryStartTime: "3:00",
        weekStartsOn: "saturday",
      }),
    ).toBe("2026-05-02");
  });

  it("time before the boundary on the nominal week-start day remains in the previous user week", () => {
    const date = new Date(2026, 4, 2, 1, 30, 0, 0);

    expect(
      getUserWeekStartDate(date, {
        dayBoundaryStartTime: "3:00",
        weekStartsOn: "saturday",
      }),
    ).toBe("2026-04-25");
  });

  it("time after the boundary on the week-start day begins the new user week", () => {
    const date = new Date(2026, 4, 2, 3, 0, 0, 0);
    const userWeek = getUserWeek(date, {
      dayBoundaryStartTime: "3:00",
      weekStartsOn: "saturday",
    });

    expect(userWeek.userWeekStartDate).toBe("2026-05-02");
    expect(userWeek.start.getTime()).toBe(new Date(2026, 4, 2, 3, 0, 0, 0).getTime());
    expect(userWeek.end.getTime()).toBe(new Date(2026, 4, 9, 3, 0, 0, 0).getTime());
  });

  it("isSameUserWeek uses the user's week start and day boundary together", () => {
    const firstDate = new Date(2026, 4, 8, 22, 0, 0, 0);
    const secondDate = new Date(2026, 4, 9, 1, 0, 0, 0);

    expect(
      isSameUserWeek(firstDate, secondDate, {
        dayBoundaryStartTime: "3:00",
        weekStartsOn: "saturday",
      }),
    ).toBe(true);
  });
});
