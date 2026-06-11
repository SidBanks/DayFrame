import type { BlockRecurrence, BlockTemplate } from "../core/blocks/types.js";
import type { ManualCalendarEvent } from "../core/calendar/types.js";
import type { ShiftCycle } from "../core/cycles/types.js";
import type { GenerateSchedulePreviewResult } from "../core/engine/generateSchedulePreview.js";
import type { LocalDateString, ShiftDefinition } from "../core/shifts/types.js";
import type { TimeString, Weekday } from "../core/time/types.js";
import type { DayFrameBackupV1 } from "./dayFrameBackup.js";
import type { SuggestedFixFeedback } from "../core/friction/types.js";

export type DayFrameSchedulingPreferences = {
  dayBoundaryStartTime: TimeString;
  weekStartsOn: Weekday;
};

export type DayFramePreviewRangePreset =
  | "threeDays"
  | "oneWeek"
  | "twoWeeks"
  | "oneMonth"
  | "custom";

export type DayFramePreviewRangeSource = "preset" | "custom" | "cycle";

export type DayFramePreviewRange = {
  source?: DayFramePreviewRangeSource;
  preset: DayFramePreviewRangePreset;
  startDate: LocalDateString;
  endDate: LocalDateString;
};

export type DayFramePreview = {
  result: GenerateSchedulePreviewResult;
  rangeStartDate: LocalDateString;
  rangeEndDate: LocalDateString;
  planningWindowStart: Date;
  planningWindowEnd: Date;
  generatedAt: string;
  revisedAt?: string;
  actionFeedback?: SuggestedFixFeedback;
  isStale: boolean;
};

export type DayFrameSavedProfile = {
  id: string;
  name: string;
  savedAt: string;
  data: DayFrameAuthoredSetup;
};

export type DayFrameState = {
  schedulingPreferences: DayFrameSchedulingPreferences;
  previewRange: DayFramePreviewRange;
  shiftDefinitions: ShiftDefinition[];
  shiftCycles: ShiftCycle[];
  shiftCycle?: ShiftCycle | null;
  blockTemplates: BlockTemplate[];
  blockRecurrences: BlockRecurrence[];
  manualEvents: ManualCalendarEvent[];
  savedProfiles: DayFrameSavedProfile[];
  preview: DayFramePreview | null;
};

export type DayFrameAuthoredSetup = Pick<
  DayFrameState,
  | "schedulingPreferences"
  | "previewRange"
  | "shiftDefinitions"
  | "shiftCycles"
  | "blockTemplates"
  | "blockRecurrences"
  | "manualEvents"
> & {
  shiftCycle?: ShiftCycle | null;
};

export type GeneratePreviewActionInput = {
  rangeStartDate: LocalDateString;
  rangeEndDate: LocalDateString;
  planningWindowStart: Date;
  planningWindowEnd: Date;
  generatedAt: string;
};

export type ApplyPreviewFixActionInput = {
  selectedFrictionPointId: string;
  selectedSuggestedFixId: string;
  revisedAt: string;
};

export type DayFrameStore = {
  getState: () => DayFrameState;
  subscribe: (listener: (state: DayFrameState) => void) => () => void;
  setSchedulingPreferences: (
    schedulingPreferences: Partial<DayFrameSchedulingPreferences>,
  ) => DayFrameState;
  setPreviewRange: (previewRange: DayFramePreviewRange) => DayFrameState;
  setShiftDefinitions: (shiftDefinitions: ShiftDefinition[]) => DayFrameState;
  setShiftCycle: (shiftCycle: ShiftCycle | null) => DayFrameState;
  setShiftCycles: (shiftCycles: ShiftCycle[]) => DayFrameState;
  setBlockTemplates: (blockTemplates: BlockTemplate[]) => DayFrameState;
  setBlockRecurrences: (blockRecurrences: BlockRecurrence[]) => DayFrameState;
  setManualEvents: (manualEvents: ManualCalendarEvent[]) => DayFrameState;
  saveProfile: (input: { name: string; savedAt: string }) => DayFrameState;
  loadProfile: (profileId: string) => DayFrameState;
  deleteProfile: (profileId: string) => DayFrameState;
  clearLocalData: () => void;
  exportBackup: (exportedAt: string) => DayFrameBackupV1;
  importBackup: (backup: DayFrameBackupV1) => DayFrameState;
  generatePreview: (input: GeneratePreviewActionInput) => DayFrameState;
  applySuggestedFixToPreview: (input: ApplyPreviewFixActionInput) => DayFrameState;
};
