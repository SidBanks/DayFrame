import type { LocalDateString } from "../shifts/types.js";

import type { CalendarHoliday } from "./types.js";

const staticHolidays: CalendarHoliday[] = [
  {
    id: "us-2025-new-years-day",
    date: "2025-01-01",
    name: "New Year's Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2025-mlk-day",
    date: "2025-01-20",
    name: "Martin Luther King Jr. Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2025-presidents-day",
    date: "2025-02-17",
    name: "Presidents Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2025-memorial-day",
    date: "2025-05-26",
    name: "Memorial Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2025-juneteenth",
    date: "2025-06-19",
    name: "Juneteenth National Independence Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2025-independence-day",
    date: "2025-07-04",
    name: "Independence Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2025-labor-day",
    date: "2025-09-01",
    name: "Labor Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2025-columbus-day",
    date: "2025-10-13",
    name: "Columbus Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2025-veterans-day",
    date: "2025-11-11",
    name: "Veterans Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2025-thanksgiving-day",
    date: "2025-11-27",
    name: "Thanksgiving Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2025-christmas-day",
    date: "2025-12-25",
    name: "Christmas Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2026-new-years-day",
    date: "2026-01-01",
    name: "New Year's Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2026-mlk-day",
    date: "2026-01-19",
    name: "Martin Luther King Jr. Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2026-presidents-day",
    date: "2026-02-16",
    name: "Presidents Day",
    region: "US",
    type: "federal",
  },
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
  {
    id: "us-2026-independence-day",
    date: "2026-07-04",
    name: "Independence Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2026-labor-day",
    date: "2026-09-07",
    name: "Labor Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2026-columbus-day",
    date: "2026-10-12",
    name: "Columbus Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2026-veterans-day",
    date: "2026-11-11",
    name: "Veterans Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2026-thanksgiving-day",
    date: "2026-11-26",
    name: "Thanksgiving Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2026-christmas-day",
    date: "2026-12-25",
    name: "Christmas Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2027-new-years-day",
    date: "2027-01-01",
    name: "New Year's Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2027-mlk-day",
    date: "2027-01-18",
    name: "Martin Luther King Jr. Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2027-presidents-day",
    date: "2027-02-15",
    name: "Presidents Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2027-memorial-day",
    date: "2027-05-31",
    name: "Memorial Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2027-juneteenth",
    date: "2027-06-18",
    name: "Juneteenth National Independence Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2027-independence-day",
    date: "2027-07-05",
    name: "Independence Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2027-labor-day",
    date: "2027-09-06",
    name: "Labor Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2027-columbus-day",
    date: "2027-10-11",
    name: "Columbus Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2027-veterans-day",
    date: "2027-11-11",
    name: "Veterans Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2027-thanksgiving-day",
    date: "2027-11-25",
    name: "Thanksgiving Day",
    region: "US",
    type: "federal",
  },
  {
    id: "us-2027-christmas-day",
    date: "2027-12-24",
    name: "Christmas Day",
    region: "US",
    type: "federal",
  },
];

export function getStaticHolidays(input: {
  startDate: LocalDateString;
  endDate: LocalDateString;
  region?: string;
}): CalendarHoliday[] {
  if (input.startDate > input.endDate) {
    return [];
  }

  const region = input.region ?? "US";

  return staticHolidays
    .filter(
      (holiday) =>
        holiday.region === region &&
        holiday.date >= input.startDate &&
        holiday.date <= input.endDate,
    )
    .map((holiday) => ({ ...holiday }))
    .sort((left, right) =>
      left.date === right.date
        ? left.name.localeCompare(right.name)
        : left.date.localeCompare(right.date),
    );
}
