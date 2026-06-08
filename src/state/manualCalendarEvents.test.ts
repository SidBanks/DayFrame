import { describe, expect, it } from "vitest";

import { normalizeManualCalendarEvents } from "./manualCalendarEvents.js";

describe("manualCalendarEvents", () => {
  it("normalizes manual events using the current startTime and endTime fields", () => {
    expect(
      normalizeManualCalendarEvents([
        {
          id: "manual_event_1",
          title: "Doctor Appointment",
          userDayDate: "2026-05-06",
          allDay: false,
          startTime: "09:30",
          endTime: "10:30",
          notes: "Bring insurance card",
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ]),
    ).toEqual([
      {
        id: "manual_event_1",
        title: "Doctor Appointment",
        userDayDate: "2026-05-06",
        allDay: false,
        startTime: "09:30",
        endTime: "10:30",
        notes: "Bring insurance card",
        createdAt: "2026-05-03T00:00:00-05:00",
        updatedAt: "2026-05-03T00:00:00-05:00",
      },
    ]);
  });

  it("migrates legacy startsAt and endsAt fields from persisted data", () => {
    expect(
      normalizeManualCalendarEvents([
        {
          id: "manual_event_legacy",
          title: "Legacy Appointment",
          userDayDate: "2026-05-06",
          allDay: false,
          startsAt: "13:00",
          endsAt: "14:00",
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ]),
    ).toEqual([
      {
        id: "manual_event_legacy",
        title: "Legacy Appointment",
        userDayDate: "2026-05-06",
        allDay: false,
        startTime: "13:00",
        endTime: "14:00",
        createdAt: "2026-05-03T00:00:00-05:00",
        updatedAt: "2026-05-03T00:00:00-05:00",
      },
    ]);
  });

  it("drops invalid entries and removes time fields from all-day events", () => {
    expect(
      normalizeManualCalendarEvents([
        {
          id: "manual_event_all_day",
          title: "Birthday",
          userDayDate: "2026-05-06",
          allDay: true,
          startTime: "00:00",
          endTime: "23:59",
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
        {
          id: "manual_event_broken",
          title: "Broken",
          userDayDate: "2026-05-06",
        },
      ]),
    ).toEqual([
      {
        id: "manual_event_all_day",
        title: "Birthday",
        userDayDate: "2026-05-06",
        allDay: true,
        createdAt: "2026-05-03T00:00:00-05:00",
        updatedAt: "2026-05-03T00:00:00-05:00",
      },
    ]);
  });
});
