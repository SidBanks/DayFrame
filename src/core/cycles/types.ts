import type { TimeString, UserTimePreferences, Weekday } from "../time/types.js";
import type { GeneratedWorkBlock, LocalDateString, ShiftDefinition } from "../shifts/types.js";

export type ShiftCycleType = "fixedSegments";
export type ShiftCycleMode = "manualSegments" | "repeatingSequence";

export type ShiftSegmentSchedulePreferences = {
  dayBoundaryStartTime?: TimeString;
  weekStartsOn?: Weekday;
};

export type ShiftSegment = {
  id: string;
  shiftCycleId: string;
  shiftDefinitionId: string;
  startsOnDate: LocalDateString;
  endsOnDate: LocalDateString;
  schedulePreferences?: ShiftSegmentSchedulePreferences;
  transitionStrategyId?: string;
  notes?: string;
};

export type ShiftCycleSequenceDay = {
  id: string;
  dayOffset: number;
  shiftDefinitionId: string | null;
};

export type ShiftCycle = {
  id: string;
  userId: string;
  name: string;
  type: ShiftCycleType;
  mode?: ShiftCycleMode;
  startsOnDate: LocalDateString;
  endsOnDate?: LocalDateString;
  segments: ShiftSegment[];
  sequence?: ShiftCycleSequenceDay[];
  sequenceAnchorDate?: LocalDateString;
  createdAt: string;
  updatedAt: string;
};

export type GetActiveShiftSegmentInput = {
  shiftCycles?: ShiftCycle[];
  shiftCycle?: ShiftCycle;
  date: Date;
};

export type GenerateCycleWorkBlocksInput = {
  shiftCycles?: ShiftCycle[];
  shiftCycle?: ShiftCycle;
  shiftDefinitions: ShiftDefinition[];
  planningWindowStart: Date;
  planningWindowEnd: Date;
  dayBoundaryStartTime?: TimeString;
  defaultSchedulingPreferences?: UserTimePreferences;
};

export type GeneratedCycleWorkBlock = GeneratedWorkBlock & {
  shiftCycleId: string;
  shiftSegmentId: string;
};
