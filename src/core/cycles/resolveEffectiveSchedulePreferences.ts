import type { LocalDateString } from "../shifts/types.js";
import type { UserTimePreferences } from "../time/types.js";
import { getActiveShiftSegment } from "./getActiveShiftSegment.js";
import type { ShiftCycle } from "./types.js";

export function resolveEffectiveSchedulePreferencesForDate(input: {
  shiftCycles: ShiftCycle[];
  defaultSchedulingPreferences: UserTimePreferences;
  date: Date;
}): UserTimePreferences {
  if (input.shiftCycles.length === 0) {
    return {
      ...input.defaultSchedulingPreferences,
    };
  }

  const activeSegment = getActiveShiftSegment({
    shiftCycles: input.shiftCycles,
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
  shiftCycles: ShiftCycle[];
  defaultSchedulingPreferences: UserTimePreferences;
  userDayDate: LocalDateString;
}): UserTimePreferences {
  return resolveEffectiveSchedulePreferencesForDate({
    shiftCycles: input.shiftCycles,
    defaultSchedulingPreferences: input.defaultSchedulingPreferences,
    date: new Date(`${input.userDayDate}T12:00:00`),
  });
}
