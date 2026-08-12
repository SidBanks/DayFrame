import type { UserTimePreferences, UserWeekRange, Weekday } from "./types.ts";
import { formatLocalDate, getUserDayStart } from "./userDay.js";

const WEEKDAY_TO_INDEX: Record<Weekday, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export function getUserWeekStart(date: Date, preferences: UserTimePreferences): Date {
  const userDayStart = getUserDayStart(date, preferences.dayBoundaryStartTime);
  const dayIndex = userDayStart.getDay();
  const weekStartIndex = WEEKDAY_TO_INDEX[preferences.weekStartsOn];
  const daysSinceWeekStart = (dayIndex - weekStartIndex + 7) % 7;
  const userWeekStart = new Date(userDayStart);

  userWeekStart.setDate(userWeekStart.getDate() - daysSinceWeekStart);

  return userWeekStart;
}

export function getUserWeek(date: Date, preferences: UserTimePreferences): UserWeekRange {
  const start = getUserWeekStart(date, preferences);
  const end = new Date(start);

  end.setDate(end.getDate() + 7);

  return {
    userWeekStartDate: formatLocalDate(start),
    start,
    end,
  };
}

export function getUserWeekStartDate(date: Date, preferences: UserTimePreferences): string {
  return getUserWeek(date, preferences).userWeekStartDate;
}

export function isSameUserWeek(left: Date, right: Date, preferences: UserTimePreferences): boolean {
  return getUserWeekStartDate(left, preferences) === getUserWeekStartDate(right, preferences);
}

export function getWeekdayIndex(weekday: Weekday): number {
  return WEEKDAY_TO_INDEX[weekday];
}

const WEEKDAY_BY_INDEX = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const satisfies readonly Weekday[];

export function getWeekdayFromDate(date: Date): Weekday {
  return WEEKDAY_BY_INDEX[date.getDay()]!;
}
