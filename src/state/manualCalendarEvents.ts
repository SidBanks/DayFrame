import type { ManualCalendarEvent } from "../core/calendar/types.js";
import type { LocalDateString } from "../core/shifts/types.js";
import type { TimeString } from "../core/time/types.js";

type LegacyManualCalendarEvent = {
  id?: unknown;
  title?: unknown;
  userDayDate?: unknown;
  allDay?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  startsAt?: unknown;
  endsAt?: unknown;
  notes?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export function normalizeManualCalendarEvents(value: unknown): ManualCalendarEvent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((manualEvent) => normalizeManualCalendarEvent(manualEvent));
}

function normalizeManualCalendarEvent(value: unknown): ManualCalendarEvent[] {
  if (!isRecord(value)) {
    return [];
  }

  const legacyEvent = value as LegacyManualCalendarEvent;

  if (
    typeof legacyEvent.id !== "string" ||
    typeof legacyEvent.title !== "string" ||
    typeof legacyEvent.userDayDate !== "string" ||
    typeof legacyEvent.allDay !== "boolean" ||
    typeof legacyEvent.createdAt !== "string" ||
    typeof legacyEvent.updatedAt !== "string"
  ) {
    return [];
  }

  const startTime = normalizeOptionalTimeString(legacyEvent.startTime ?? legacyEvent.startsAt);
  const endTime = normalizeOptionalTimeString(legacyEvent.endTime ?? legacyEvent.endsAt);
  const notes = typeof legacyEvent.notes === "string" ? legacyEvent.notes : undefined;

  return [
    {
      id: legacyEvent.id,
      title: legacyEvent.title,
      userDayDate: legacyEvent.userDayDate as LocalDateString,
      allDay: legacyEvent.allDay,
      ...(legacyEvent.allDay
        ? {}
        : {
            ...(startTime ? { startTime } : {}),
            ...(endTime ? { endTime } : {}),
          }),
      ...(notes ? { notes } : {}),
      createdAt: legacyEvent.createdAt,
      updatedAt: legacyEvent.updatedAt,
    },
  ];
}

function normalizeOptionalTimeString(value: unknown): TimeString | undefined {
  if (typeof value !== "string" || !/^\d{2}:\d{2}$/.test(value)) {
    return undefined;
  }

  return value as TimeString;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
