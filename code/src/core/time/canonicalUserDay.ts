import type { ShiftCycle } from "../cycles/types.js";
import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../cycles/resolveEffectiveSchedulePreferences.js";
import type { LocalDateString } from "../shifts/types.js";
import type { TimeString, UserTimePreferences } from "./types.js";
import { formatLocalDate, parseTimeString } from "./userDay.js";

export type CanonicalUserDayStart = {
  userDayDate: LocalDateString;
  start: Date;
  dayBoundaryStartTime: TimeString;
  weekStartsOn: UserTimePreferences["weekStartsOn"];
};

export type CanonicalUserDayWindow = CanonicalUserDayStart & {
  end: Date;
  nextDayBoundaryStartTime: TimeString;
  durationMinutes: number;
};

export type CanonicalUserDayResolverInput = {
  shiftCycles: ShiftCycle[];
  defaultSchedulingPreferences: UserTimePreferences;
};

export function addUserDayLabels(userDayDate: LocalDateString, days: number): LocalDateString {
  if (!Number.isInteger(days)) throw new RangeError("days must be an integer");
  const date = parseLocalDate(userDayDate);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date) as LocalDateString;
}

export function resolveUserDayStartForLabel(
  input: CanonicalUserDayResolverInput & { userDayDate: LocalDateString },
): CanonicalUserDayStart {
  const preferences = resolveEffectiveSchedulePreferencesForUserDayDate(input);
  const boundary = parseTimeString(preferences.dayBoundaryStartTime);
  const date = parseLocalDate(input.userDayDate);
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    boundary.hours,
    boundary.minutes,
    0,
    0,
  );

  return {
    userDayDate: input.userDayDate,
    start,
    dayBoundaryStartTime: preferences.dayBoundaryStartTime,
    weekStartsOn: preferences.weekStartsOn,
  };
}

export function resolveUserDayWindowForLabel(
  input: CanonicalUserDayResolverInput & { userDayDate: LocalDateString },
): CanonicalUserDayWindow {
  const current = resolveUserDayStartForLabel(input);
  const next = resolveUserDayStartForLabel({
    ...input,
    userDayDate: addUserDayLabels(input.userDayDate, 1),
  });

  if (next.start.getTime() <= current.start.getTime()) {
    throw new RangeError(`Canonical user-day starts are not increasing at ${input.userDayDate}`);
  }

  return {
    ...current,
    end: new Date(next.start),
    nextDayBoundaryStartTime: next.dayBoundaryStartTime,
    durationMinutes: (next.start.getTime() - current.start.getTime()) / 60_000,
  };
}

/**
 * The local label containing the instant plus its predecessor are sufficient:
 * start(label) is within that civil date, so an instant before it can only belong
 * to the preceding label; otherwise it belongs to that label.
 */
export function resolveUserDayContainingInstant(
  input: CanonicalUserDayResolverInput & { instant: Date },
): CanonicalUserDayWindow {
  if (Number.isNaN(input.instant.getTime())) throw new RangeError("instant must be valid");
  const localLabel = formatLocalDate(input.instant) as LocalDateString;
  const localWindow = resolveUserDayWindowForLabel({ ...input, userDayDate: localLabel });
  if (
    localWindow.start.getTime() <= input.instant.getTime() &&
    input.instant.getTime() < localWindow.end.getTime()
  ) {
    return localWindow;
  }

  const previous = resolveUserDayWindowForLabel({
    ...input,
    userDayDate: addUserDayLabels(localLabel, -1),
  });
  if (
    previous.start.getTime() <= input.instant.getTime() &&
    input.instant.getTime() < previous.end.getTime()
  ) {
    return previous;
  }

  throw new RangeError(
    `Instant is not bracketed by canonical user-day starts: ${input.instant.toISOString()}`,
  );
}

export function resolveUserWeekStartDateForLabel(
  input: CanonicalUserDayResolverInput & { userDayDate: LocalDateString },
): LocalDateString {
  const start = resolveUserDayStartForLabel(input);
  const weekdayIndex = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ].indexOf(start.weekStartsOn);
  const labelDate = parseLocalDate(input.userDayDate);
  const offset = (labelDate.getDay() - weekdayIndex + 7) % 7;
  return addUserDayLabels(input.userDayDate, -offset);
}

function parseLocalDate(value: LocalDateString): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError(`Invalid local date string: ${value}`);
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0, 0);
  if (formatLocalDate(date) !== value) throw new RangeError(`Invalid local date string: ${value}`);
  return date;
}
