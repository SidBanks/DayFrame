import type { ParsedTime, TimeString, UserDayRange } from "./types.ts";

const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const TIME_STRING_PATTERN = /^(\d{1,2}):(\d{1,2})$/;

export function parseTimeString(timeString: TimeString): ParsedTime {
  const match = TIME_STRING_PATTERN.exec(timeString);

  if (!match) {
    throw new RangeError(`Invalid time string: ${timeString}`);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours >= HOURS_PER_DAY ||
    minutes < 0 ||
    minutes >= MINUTES_PER_HOUR
  ) {
    throw new RangeError(`Invalid time string: ${timeString}`);
  }

  return {
    hours,
    minutes,
    totalMinutes: hours * MINUTES_PER_HOUR + minutes,
  };
}

export function getUserDayStart(date: Date, dayBoundaryStartTime: TimeString): Date {
  const parsedBoundary = parseTimeString(dayBoundaryStartTime);
  const boundaryOnCalendarDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    parsedBoundary.hours,
    parsedBoundary.minutes,
    0,
    0,
  );

  if (date.getTime() < boundaryOnCalendarDay.getTime()) {
    boundaryOnCalendarDay.setDate(boundaryOnCalendarDay.getDate() - 1);
  }

  return boundaryOnCalendarDay;
}

export function getUserDay(date: Date, dayBoundaryStartTime: TimeString): UserDayRange {
  const start = getUserDayStart(date, dayBoundaryStartTime);
  const end = new Date(start);

  end.setDate(end.getDate() + 1);

  return {
    userDayDate: formatLocalDate(start),
    start,
    end,
  };
}

export function getUserDayDate(date: Date, dayBoundaryStartTime: TimeString): string {
  return getUserDay(date, dayBoundaryStartTime).userDayDate;
}

export function isSameUserDay(left: Date, right: Date, dayBoundaryStartTime: TimeString): boolean {
  return getUserDayDate(left, dayBoundaryStartTime) === getUserDayDate(right, dayBoundaryStartTime);
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export { formatLocalDate };
