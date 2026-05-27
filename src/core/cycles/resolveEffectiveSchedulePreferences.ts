import type { LocalDateString } from "../shifts/types.js";
import type { UserTimePreferences } from "../time/types.js";
import { getActiveShiftSegment } from "./getActiveShiftSegment.js";
import type { ShiftCycle } from "./types.js";

export function resolveEffectiveSchedulePreferencesForDate(input: {
  shiftCycle: ShiftCycle | null;
  defaultSchedulingPreferences: UserTimePreferences;
  date: Date;
}): UserTimePreferences {
  if (!input.shiftCycle) {
    return {
      ...input.defaultSchedulingPreferences,
    };
  }

  const activeSegment = getActiveShiftSegment({
    shiftCycle: input.shiftCycle,
    date: input.date,
  });

  return {
    dayBoundaryStartTime:
      activeSegment?.schedulePreferences?.dayBoundaryStartTime ??
      input.defaultSchedulingPreferences.dayBoundaryStartTime,
    weekStartsOn:
      activeSegment?.schedulePreferences?.weekStartsOn ??
      input.defaultSchedulingPreferences.weekStartsOn,
  };
}

export function resolveEffectiveSchedulePreferencesForUserDayDate(input: {
  shiftCycle: ShiftCycle | null;
  defaultSchedulingPreferences: UserTimePreferences;
  userDayDate: LocalDateString;
}): UserTimePreferences {
  return resolveEffectiveSchedulePreferencesForDate({
    shiftCycle: input.shiftCycle,
    defaultSchedulingPreferences: input.defaultSchedulingPreferences,
    date: new Date(`${input.userDayDate}T12:00:00`),
  });
}
