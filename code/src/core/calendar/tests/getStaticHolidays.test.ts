import { describe, expect, it } from "vitest";

import { getStaticHolidays } from "../getStaticHolidays.js";

describe("getStaticHolidays", () => {
  it("returns holidays inside an inclusive preview range", () => {
    expect(
      getStaticHolidays({
        startDate: "2026-05-25",
        endDate: "2026-06-19",
      }),
    ).toEqual([
      {
        id: "us-2026-memorial-day",
        date: "2026-05-25",
        name: "Memorial Day",
        region: "US",
        type: "federal",
      },
      {
        id: "us-2026-juneteenth",
        date: "2026-06-19",
        name: "Juneteenth National Independence Day",
        region: "US",
        type: "federal",
      },
    ]);
  });

  it("returns an empty list when no holidays overlap the range", () => {
    expect(
      getStaticHolidays({
        startDate: "2026-05-02",
        endDate: "2026-05-04",
      }),
    ).toEqual([]);
  });

  it("returns an empty list for an inverted date range", () => {
    expect(
      getStaticHolidays({
        startDate: "2026-06-20",
        endDate: "2026-06-19",
      }),
    ).toEqual([]);
  });
});
