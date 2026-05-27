import type { BlockRecurrence, BlockTemplate } from "../core/blocks/types.js";
import type { ShiftCycle } from "../core/cycles/types.js";
import type { GenerateSchedulePreviewResult } from "../core/engine/generateSchedulePreview.js";
import type { ShiftDefinition } from "../core/shifts/types.js";
import type { TimeString, Weekday } from "../core/time/types.js";
import type { DayFrameBackupV1 } from "./dayFrameBackup.js";
import type { SuggestedFixFeedback } from "../core/friction/types.js";

export type DayFrameSchedulingPreferences = {
  dayBoundaryStartTime: TimeString;
  weekStartsOn: Weekday;
};

export type DayFramePreview = {
  result: GenerateSchedulePreviewResult;
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
  shiftDefinitions: ShiftDefinition[];
  shiftCycle: ShiftCycle | null;
  blockTemplates: BlockTemplate[];
  blockRecurrences: BlockRecurrence[];
  savedProfiles: DayFrameSavedProfile[];
  preview: DayFramePreview | null;
};

export type DayFrameAuthoredSetup = Pick<
  DayFrameState,
  | "schedulingPreferences"
  | "shiftDefinitions"
  | "shiftCycle"
  | "blockTemplates"
  | "blockRecurrences"
>;

export type GeneratePreviewActionInput = {
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
  setShiftDefinitions: (shiftDefinitions: ShiftDefinition[]) => DayFrameState;
  setShiftCycle: (shiftCycle: ShiftCycle | null) => DayFrameState;
  setBlockTemplates: (blockTemplates: BlockTemplate[]) => DayFrameState;
  setBlockRecurrences: (blockRecurrences: BlockRecurrence[]) => DayFrameState;
  saveProfile: (input: { name: string; savedAt: string }) => DayFrameState;
  loadProfile: (profileId: string) => DayFrameState;
  deleteProfile: (profileId: string) => DayFrameState;
  clearLocalData: () => void;
  exportBackup: (exportedAt: string) => DayFrameBackupV1;
  importBackup: (backup: DayFrameBackupV1) => DayFrameState;
  generatePreview: (input: GeneratePreviewActionInput) => DayFrameState;
  applySuggestedFixToPreview: (input: ApplyPreviewFixActionInput) => DayFrameState;
};
