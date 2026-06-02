import type { LocalDateString } from "../shifts/types.js";
import type { TimeString } from "../time/types.js";

export type CalendarHoliday = {
  id: string;
  date: LocalDateString;
  name: string;
  region: string;
  type: "federal" | "local" | "observance";
};

export type ManualCalendarEvent = {
  id: string;
  title: string;
  userDayDate: LocalDateString;
  startsAt?: TimeString;
  endsAt?: TimeString;
  allDay: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
