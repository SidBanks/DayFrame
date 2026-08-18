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
>;

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

export type CommitAuthoredSetupInput = Pick<
  DayFrameAuthoredSetup,
  | "schedulingPreferences"
  | "previewRange"
  | "shiftDefinitions"
  | "shiftCycles"
  | "blockTemplates"
  | "blockRecurrences"
>;

export type PersistenceWriteOutcome =
  | { status: "persisted" }
  | { status: "unavailable" }
  | { status: "serializationFailure" }
  | { status: "storageFailure" };

export type PersistenceRemovalOutcome =
  | { status: "removed" }
  | { status: "unavailable" }
  | { status: "storageFailure" };

export type StoreMutationResult = {
  state: DayFrameState;
  persistence: PersistenceWriteOutcome;
};

export type ClearLocalDataResult = {
  state: DayFrameState;
  activeState: PersistenceRemovalOutcome;
  profiles: PersistenceRemovalOutcome;
  durability: "cleared" | "partiallyCleared" | "notCleared";
};

export type SurfaceDurabilityStatus =
  | "unknown"
  | "durable"
  | "unavailable"
  | "serializationFailure"
  | "storageFailure";

export type StoreDurabilityStatus = {
  activeState: SurfaceDurabilityStatus;
  profiles: SurfaceDurabilityStatus;
};

export type DesiredDurableCondition = "snapshot" | "absent";

export type StoreDesiredDurableCondition = {
  activeState: DesiredDurableCondition;
  profiles: DesiredDurableCondition;
};

export type DurabilityRetryResult =
  | {
      status: "attempted";
      desiredCondition: "snapshot";
      persistence: PersistenceWriteOutcome;
    }
  | {
      status: "attempted";
      desiredCondition: "absent";
      persistence: PersistenceRemovalOutcome;
    }
  | {
      status: "notAttempted";
      reason: "unknown" | "alreadyDurable" | "serializationFailure";
    };

export type DayFrameStore = {
  getState: () => DayFrameState;
  getDurabilityStatus: () => StoreDurabilityStatus;
  getDesiredDurableCondition: () => StoreDesiredDurableCondition;
  retryActivePersistence: () => DurabilityRetryResult;
  retryProfilePersistence: () => DurabilityRetryResult;
  subscribeDurability: (listener: (status: StoreDurabilityStatus) => void) => () => void;
  subscribe: (listener: (state: DayFrameState) => void) => () => void;
  commitAuthoredSetup: (authoredSetup: CommitAuthoredSetupInput) => StoreMutationResult;
  setSchedulingPreferences: (
    schedulingPreferences: Partial<DayFrameSchedulingPreferences>,
  ) => StoreMutationResult;
  setPreviewRange: (previewRange: DayFramePreviewRange) => StoreMutationResult;
  setShiftDefinitions: (shiftDefinitions: ShiftDefinition[]) => StoreMutationResult;
  setShiftCycles: (shiftCycles: ShiftCycle[]) => StoreMutationResult;
  setBlockTemplates: (blockTemplates: BlockTemplate[]) => StoreMutationResult;
  setBlockRecurrences: (blockRecurrences: BlockRecurrence[]) => StoreMutationResult;
  setManualEvents: (manualEvents: ManualCalendarEvent[]) => StoreMutationResult;
  saveProfile: (input: { name: string; savedAt: string }) => StoreMutationResult;
  loadProfile: (profileId: string) => StoreMutationResult;
  deleteProfile: (profileId: string) => StoreMutationResult;
  clearLocalData: () => ClearLocalDataResult;
  exportBackup: (exportedAt: string) => DayFrameBackupV1;
  importBackup: (backup: DayFrameBackupV1) => StoreMutationResult;
  generatePreview: (input: GeneratePreviewActionInput) => DayFrameState;
  applySuggestedFixToPreview: (input: ApplyPreviewFixActionInput) => DayFrameState;
};
