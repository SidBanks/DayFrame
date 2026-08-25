import type { BlockRecurrence, BlockTemplate } from "../core/blocks/types.js";
import type { ManualCalendarEvent } from "../core/calendar/types.js";
import type { ShiftCycle } from "../core/cycles/types.js";
import type { GenerateSchedulePreviewResult } from "../core/engine/generateSchedulePreview.js";
import type { LocalDateString, ShiftDefinition } from "../core/shifts/types.js";
import type { TimeString, Weekday } from "../core/time/types.js";
import type { BackupValidationFailureCategory, DayFrameBackup } from "./dayFrameBackup.js";
import type { DayFrameBackupV3 } from "./dayFrameBackupV3.js";
import type { DayFrameBackupV4 } from "./dayFrameBackupV4.js";
import type { DayFrameBackupV5 } from "./dayFrameBackupV5.js";
import type { DayFrameBackupV6 } from "./dayFrameBackupV6.js";
import type { GoalSurface } from "./goalSurface.js";
import type { MeasurementDefinitionSurface } from "./measurementDefinitionSurface.js";
import type { ProgressObservationSurface } from "./progressObservationSurface.js";
import type { GoalProgressQueryV1 } from "../core/progress/manualQuantityProgress.js";
import type { GoalProgressQueryResultV1 } from "./goalProgressQuery.js";
import type { SuggestedFixFeedback } from "../core/friction/types.js";
import type { AuthoredSnapshotValidationResult } from "../core/authored/validateDayFrameAuthoredSetup.js";
import type { IncarnatedSource, SourceIncarnationId } from "../core/authored/sourceIncarnation.js";
import type {
  AcceptPlanDecisionInput,
  PlanDecisionId,
  PlanDecisionIdAllocator,
  PlanDecisionV1,
} from "../core/decisions/planDecision.js";
import type {
  AcceptPlanDecisionResult,
  PlanDecisionIngressStatus,
  PlanDecisionRecoveryResult,
  PlanDecisionRetryResult,
  QuarantinedPlanDecision,
  RemovePlanDecisionResult,
} from "./planDecisionSurface.js";
import type { ExecutionHistorySurface } from "./executionHistorySurface.js";
import type {
  HistoricalPlanSurface,
  HistoricalPlanPublicationResult,
} from "./historicalPlanSurface.js";
import type { MaterializePlanPublicationResult } from "../core/historicalPlan/materializePlanPublication.js";
import type { DayFrameReadinessApi } from "./dayFrameReadiness.js";
import type { HistoricalCompletionDistributionQueryV1 } from "../core/historicalIntelligence/completionDistribution.js";
import type { HistoricalSchedulingRealizationQueryV1 } from "../core/historicalIntelligence/schedulingRealization.js";
import type {
  HistoricalCompletionDistributionQueryResultV1,
  GoalActivityQueryResultV1,
  HistoricalSchedulingRealizationQueryResultV1,
} from "./historicalIntelligenceQuery.js";
import type { GoalActivityQueryV1 } from "../core/historicalIntelligence/goalActivity.js";

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
  data: DayFrameAuthoredPattern;
};

type RuntimeIncarnation = IncarnatedSource;
export type ActiveShiftDefinition = ShiftDefinition & RuntimeIncarnation;
export type ActiveShiftSegment = ShiftCycle["segments"][number] & RuntimeIncarnation;
export type ActiveShiftSequenceEntry = NonNullable<ShiftCycle["sequence"]>[number] &
  RuntimeIncarnation;
export type ActiveShiftCycle = Omit<ShiftCycle, "segments" | "sequence"> &
  RuntimeIncarnation & {
    segments: ActiveShiftSegment[];
    sequence?: ActiveShiftSequenceEntry[];
  };
export type ActiveBlockTemplate = BlockTemplate & RuntimeIncarnation;
export type ActiveBlockRecurrence = BlockRecurrence & RuntimeIncarnation;
export type ActiveManualCalendarEvent = ManualCalendarEvent & RuntimeIncarnation;

export type DayFrameState = {
  schedulingPreferences: DayFrameSchedulingPreferences;
  previewRange: DayFramePreviewRange;
  shiftDefinitions: ActiveShiftDefinition[];
  shiftCycles: ActiveShiftCycle[];
  blockTemplates: ActiveBlockTemplate[];
  blockRecurrences: ActiveBlockRecurrence[];
  manualEvents: ActiveManualCalendarEvent[];
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

export type ActiveDayFrameAuthoredSetup = DayFrameAuthoredSetup;

export type DayFrameAuthoredPattern = {
  schedulingPreferences: DayFrameSchedulingPreferences;
  previewRange: DayFramePreviewRange;
  shiftDefinitions: ShiftDefinition[];
  shiftCycles: ShiftCycle[];
  blockTemplates: BlockTemplate[];
  blockRecurrences: BlockRecurrence[];
  manualEvents: ManualCalendarEvent[];
};

export type DayFrameStoreInitialState = Partial<DayFrameAuthoredPattern> &
  Partial<Pick<DayFrameState, "savedProfiles" | "preview">>;

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
  DayFrameAuthoredPattern,
  | "schedulingPreferences"
  | "previewRange"
  | "shiftDefinitions"
  | "shiftCycles"
  | "blockTemplates"
  | "blockRecurrences"
>;

export type AuthoredSourceKind =
  | "blockTemplate"
  | "blockRecurrence"
  | "manualEvent"
  | "shiftDefinition"
  | "shiftCycle"
  | "shiftSegment"
  | "shiftSequenceEntry";

export type AuthoredSourceReference = {
  sourceKind: AuthoredSourceKind;
  sourceId: string;
  parentSourceId?: string;
};

export type SourceLifecycleOperation = AuthoredSourceReference & {
  operation: "create" | "update" | "delete" | "replace";
};

export type AuthoredSetupLifecycleTransaction = {
  operations: SourceLifecycleOperation[];
};

export type CommitAuthoredSetupTransactionInput = {
  authoredSetup: CommitAuthoredSetupInput;
  lifecycle: AuthoredSetupLifecycleTransaction;
};

export type ManualEventLifecycleMutation =
  | { operation: "create" | "update" | "replace"; event: ManualCalendarEvent }
  | { operation: "delete"; sourceId: string };

export type PersistenceWriteOutcome =
  | { status: "persisted" }
  | { status: "pending" }
  | { status: "unavailable" }
  | { status: "serializationFailure" }
  | { status: "storageFailure" };

export type PersistenceRemovalOutcome =
  | { status: "removed" }
  | { status: "pending" }
  | { status: "unavailable" }
  | { status: "storageFailure" };

export type ActivePersistenceOutcome =
  | PersistenceWriteOutcome
  | { status: "blocked"; reason: "activeLocalRecovery" };

export type ActiveRemovalOutcome =
  | PersistenceRemovalOutcome
  | { status: "blocked"; reason: "activeLocalRecovery" };

export type PersistenceMutationResult = {
  state: DayFrameState;
  persistence: PersistenceWriteOutcome;
};

export type ActivePersistenceMutationResult = {
  state: DayFrameState;
  persistence: ActivePersistenceOutcome;
};

export type AppliedStoreMutationResult = ActivePersistenceMutationResult & {
  status: "applied";
};

export type StoreMutationResult =
  | AppliedStoreMutationResult
  | {
      status: "rejected";
      reason: "invalidAuthoredState";
      validation: Extract<AuthoredSnapshotValidationResult, { status: "invalid" }>;
    };

export type HistoricalIngressRecoveryRequiredResult = {
  status: "recoveryRequired";
  reason: "invalidAuthoredState";
  validation: Extract<AuthoredSnapshotValidationResult, { status: "invalid" }>;
};

export type ProfileLoadResult =
  | (ActivePersistenceMutationResult & {
      status: "loaded";
      advisories: AuthoredSnapshotValidationResult["advisories"];
    })
  | HistoricalIngressRecoveryRequiredResult
  | {
      status: "activationFailed";
      reason: "allocationFailure" | "activeValidationFailure";
    };

export type BackupImportResult =
  | (ActivePersistenceMutationResult & {
      status: "instantiatedFromLegacy" | "restored";
      advisories: AuthoredSnapshotValidationResult["advisories"];
    })
  | {
      status: "rejected";
      reason: BackupValidationFailureCategory | "allocationFailure" | "activeLocalRecovery";
    };

export type BackupV3ExportResult =
  | { status: "exported"; backup: DayFrameBackupV3; semanticFingerprint: string }
  | { status: "initializing" | "restoreBusy" }
  | {
      status: "protectedSurface";
      surface: "active" | "profiles" | "planDecisions" | "executionHistory" | "historicalPlan";
    }
  | { status: "validationFailure" | "exportFailure"; reason: string };

export type BackupV3ImportResult =
  | { status: "restoredV3"; semanticFingerprint: string }
  | {
      status:
        | "invalidBackup"
        | "unsupportedVersion"
        | "initializing"
        | "restoreBusy"
        | "protectedCurrentState"
        | "stagingFailure"
        | "sourceChanged"
        | "persistenceFailure"
        | "rollbackCompleted"
        | "recoveryRequired";
      surface?: string;
    };
export type BackupV4ExportResult =
  | { status: "exported"; backup: DayFrameBackupV4; semanticFingerprint: string }
  | Exclude<BackupV3ExportResult, { status: "exported" }>
  | { status: "protectedSurface"; surface: "goals" };
export type BackupV4ImportResult =
  | { status: "restoredV4"; semanticFingerprint: string }
  | Exclude<BackupV3ImportResult, { status: "restoredV3" }>;
export type BackupV5ExportResult =
  | { status: "exported"; backup: DayFrameBackupV5; semanticFingerprint: string }
  | Exclude<BackupV4ExportResult, { status: "exported" }>
  | { status: "protectedSurface"; surface: "measurementDefinitions" };
export type BackupV5ImportResult =
  | { status: "restoredV5"; semanticFingerprint: string }
  | Exclude<BackupV4ImportResult, { status: "restoredV4" }>;
export type BackupV6ExportResult =
  | { status: "exported"; backup: DayFrameBackupV6; semanticFingerprint: string }
  | Exclude<BackupV5ExportResult, { status: "exported" }>
  | { status: "protectedSurface"; surface: "progressObservations" };
export type BackupV6ImportResult =
  | { status: "restoredV6"; semanticFingerprint: string }
  | Exclude<BackupV5ImportResult, { status: "restoredV5" }>;

export type FullClearAuthorityResults = {
  active: ActiveRemovalOutcome;
  profiles: PersistenceRemovalOutcome;
  planDecisions: PersistenceRemovalOutcome;
  executionHistory: PersistenceRemovalOutcome;
  historicalPlan: PersistenceRemovalOutcome;
  goals: PersistenceRemovalOutcome;
  measurementDefinitions: PersistenceRemovalOutcome;
  progressObservations: PersistenceRemovalOutcome;
};

export type ClearLocalDataResult = {
  status: "cleared" | "partiallyCleared" | "failed";
  authorities: FullClearAuthorityResults;
  previewCleared: true;
  state: DayFrameState;
  /** Compatibility aliases; `authorities` is the canonical eight-authority contract. */
  activeState: ActiveRemovalOutcome;
  profiles: PersistenceRemovalOutcome;
  planDecisions: PersistenceRemovalOutcome;
  executionHistory: PersistenceRemovalOutcome;
  historicalPlan: PersistenceRemovalOutcome;
  goals: PersistenceRemovalOutcome;
  measurementDefinitions: PersistenceRemovalOutcome;
  progressObservations: PersistenceRemovalOutcome;
  /** Compatibility aggregate; derived from `status`. */
  durability: "cleared" | "partiallyCleared" | "notCleared";
};

export type SurfaceDurabilityStatus =
  | "unknown"
  | "durable"
  | "pending"
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
      reason: "unknown" | "alreadyDurable" | "serializationFailure" | "recoveryProtected";
    };

export type ActiveLocalIngressStatus =
  | {
      status: "noSource";
      reason: "missing" | "storageUnavailable" | "resolvedByAbandonment";
    }
  | {
      status: "accepted";
      advisories: AuthoredSnapshotValidationResult["advisories"];
    }
  | {
      status: "recoveryRequired";
      reason:
        | "readFailure"
        | "corruptJson"
        | "structurallyInvalid"
        | "unsupportedVersion"
        | "migrationFailure"
        | "invalidAuthoredState";
      activationBlocked: true;
      sourceReadable: boolean;
      sourcePreserved: boolean;
      migrationFailureDetail?: ActiveMigrationFailureDetail;
      validation?: Extract<AuthoredSnapshotValidationResult, { status: "invalid" }>;
    };

export type ActiveMigrationFailureDetail =
  | "parseFailure"
  | "validationFailure"
  | "allocationFailure"
  | "constructionFailure"
  | "serializationFailure"
  | "writeFailure"
  | "rereadFailure"
  | "rereadValidationFailure"
  | "verificationFailure";

export type ProfileIngressStatus =
  | { status: "noSource"; reason: "missing" | "storageUnavailable" }
  | { status: "accepted"; quarantinedEntryCount: number }
  | {
      status: "recoveryRequired";
      reason:
        | "readFailure"
        | "corruptJson"
        | "invalidCollection"
        | "unsupportedVersion"
        | "migrationFailure"
        | "invalidV2";
      failureDetail?:
        | "serializationFailure"
        | "writeFailure"
        | "rereadFailure"
        | "rereadValidationFailure"
        | "verificationFailure";
      sourcePreserved: boolean;
    };

export type QuarantinedProfileEntry = {
  quarantineId: string;
  reason: "invalidProfileEntry";
  originalProfileId?: string;
  originalProfileName?: string;
  raw: unknown;
};

export type ProfileMutationResult =
  | PersistenceMutationResult
  | {
      status: "blocked";
      reason: "profileRecovery";
      state: DayFrameState;
      persistence: { status: "notAttempted"; reason: "profileRecovery" };
    };

export type ProfileProtectedRecoveryResult =
  | { status: "resolved"; action: "replace" | "abandon"; persistence: { status: "persisted" } }
  | {
      status: "notResolved";
      action: "replace" | "abandon";
      persistence: Exclude<PersistenceWriteOutcome, { status: "persisted" }>;
    }
  | {
      status: "notAttempted";
      reason: "noProtectedSource" | "sourceUnreadable" | "sourceChanged" | "invalidCurrentState";
    };

export type QuarantineRemovalResult =
  | {
      status: "removed";
      quarantineId: string;
      persistence: PersistenceWriteOutcome;
      remainingCount: number;
    }
  | { status: "notAttempted"; reason: "missingEntry" | "profileRecovery" };

type ActiveLocalRecoveryNotAttempted = {
  status: "notAttempted";
  reason: "notRecoveryRequired" | "sourceUnreadable" | "sourceChanged";
};

export type ActiveLocalReplacementRecoveryResult =
  | {
      status: "resolved";
      resolution: "replaceWithCurrentState";
      persistence: { status: "persisted" };
      ingress: Extract<ActiveLocalIngressStatus, { status: "accepted" }>;
    }
  | {
      status: "notResolved";
      resolution: "replaceWithCurrentState";
      persistence: Exclude<PersistenceWriteOutcome, { status: "persisted" }>;
    }
  | ActiveLocalRecoveryNotAttempted
  | {
      status: "notAttempted";
      reason: "invalidReplacement";
      validation: Extract<AuthoredSnapshotValidationResult, { status: "invalid" }>;
    };

export type ActiveLocalAbandonmentRecoveryResult =
  | {
      status: "resolved";
      resolution: "abandonAndReset";
      persistence: { status: "removed" };
      state: DayFrameState;
      ingress: Extract<ActiveLocalIngressStatus, { status: "noSource" }>;
    }
  | {
      status: "notResolved";
      resolution: "abandonAndReset";
      persistence: Exclude<PersistenceRemovalOutcome, { status: "removed" }>;
    }
  | ActiveLocalRecoveryNotAttempted;

export type DayFrameStore = DayFrameReadinessApi & {
  getState: () => DayFrameState;
  getDurabilityStatus: () => StoreDurabilityStatus;
  getActiveLocalIngressStatus: () => ActiveLocalIngressStatus;
  getProfileIngressStatus: () => ProfileIngressStatus;
  getQuarantinedProfiles: () => QuarantinedProfileEntry[];
  exportProtectedProfileSource: () =>
    | { status: "exported"; raw: string }
    | { status: "notAvailable"; reason: "noProtectedSource" | "sourceUnreadable" };
  exportQuarantinedProfile: (
    quarantineId: string,
  ) =>
    | { status: "exported"; entry: QuarantinedProfileEntry }
    | { status: "notAvailable"; reason: "missingEntry" };
  recheckProtectedProfileSource: () =>
    | "unchanged"
    | "sourceChanged"
    | "sourceUnreadable"
    | "noProtectedSource";
  getDesiredDurableCondition: () => StoreDesiredDurableCondition;
  retryActivePersistence: () => DurabilityRetryResult;
  retryProfilePersistence: () => DurabilityRetryResult;
  subscribeDurability: (listener: (status: StoreDurabilityStatus) => void) => () => void;
  subscribeActiveLocalIngress: (listener: (status: ActiveLocalIngressStatus) => void) => () => void;
  subscribeProfileIngress: (listener: (status: ProfileIngressStatus) => void) => () => void;
  subscribe: (listener: (state: DayFrameState) => void) => () => void;
  getPlanDecisions: () => PlanDecisionV1[];
  getQuarantinedPlanDecisions: () => QuarantinedPlanDecision[];
  getPlanDecisionDurabilityStatus: () => SurfaceDurabilityStatus;
  getPlanDecisionIngressStatus: () => PlanDecisionIngressStatus;
  subscribePlanDecisions: (listener: (decisions: PlanDecisionV1[]) => void) => () => void;
  subscribePlanDecisionDurability: (
    listener: (status: SurfaceDurabilityStatus) => void,
  ) => () => void;
  subscribePlanDecisionIngress: (
    listener: (status: PlanDecisionIngressStatus) => void,
  ) => () => void;
  acceptPlanDecision: (input: AcceptPlanDecisionInput) => AcceptPlanDecisionResult;
  removePlanDecision: (id: PlanDecisionId) => RemovePlanDecisionResult;
  retryPlanDecisionPersistence: () => PlanDecisionRetryResult;
  removeQuarantinedPlanDecision: (quarantineId: string) => unknown;
  exportQuarantinedPlanDecision: (quarantineId: string) => unknown;
  exportProtectedPlanDecisionSource: () => unknown;
  recheckProtectedPlanDecisionSource: () =>
    | "unchanged"
    | "sourceChanged"
    | "sourceUnreadable"
    | "noProtectedSource";
  replaceProtectedPlanDecisionCheckpoint: () => PlanDecisionRecoveryResult;
  abandonProtectedPlanDecisionCheckpoint: () => PlanDecisionRecoveryResult;
  replaceProtectedActiveCheckpointWithCurrentState: () => ActiveLocalReplacementRecoveryResult;
  abandonProtectedActiveCheckpointAndReset: () => ActiveLocalAbandonmentRecoveryResult;
  replaceProtectedProfileCheckpointWithCurrentProfiles: () => ProfileProtectedRecoveryResult;
  abandonProtectedProfileCheckpoint: () => ProfileProtectedRecoveryResult;
  removeQuarantinedProfile: (quarantineId: string) => QuarantineRemovalResult;
  commitAuthoredSetupTransaction: (
    transaction: CommitAuthoredSetupTransactionInput,
  ) => StoreMutationResult;
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
  mutateManualEvent: (mutation: ManualEventLifecycleMutation) => StoreMutationResult;
  saveProfile: (input: { name: string; savedAt: string }) => ProfileMutationResult;
  loadProfile: (profileId: string) => ProfileLoadResult;
  deleteProfile: (profileId: string) => ProfileMutationResult;
  clearLocalData: () => Promise<ClearLocalDataResult>;
  exportBackup: (exportedAt: string) => Extract<DayFrameBackup, { version: 2 }>;
  importBackup: (backup: unknown) => BackupImportResult;
  exportBackupV3: (exportedAt: string) => Promise<BackupV3ExportResult>;
  importBackupV3: (backup: unknown) => Promise<BackupV3ImportResult>;
  importBackupFile: (
    backup: unknown,
  ) => Promise<
    | BackupImportResult
    | BackupV3ImportResult
    | BackupV4ImportResult
    | BackupV5ImportResult
    | BackupV6ImportResult
  >;
  exportBackupV4: (exportedAt: string) => Promise<BackupV4ExportResult>;
  importBackupV4: (backup: unknown) => Promise<BackupV4ImportResult>;
  exportBackupV5: (exportedAt: string) => Promise<BackupV5ExportResult>;
  importBackupV5: (backup: unknown) => Promise<BackupV5ImportResult>;
  exportBackupV6: (exportedAt: string) => Promise<BackupV6ExportResult>;
  importBackupV6: (backup: unknown) => Promise<BackupV6ImportResult>;
  generatePreview: (input: GeneratePreviewActionInput) => DayFrameState;
  applySuggestedFixToPreview: (input: ApplyPreviewFixActionInput) => DayFrameState;
  getLastHistoricalPlanPublicationResult: () =>
    | HistoricalPlanPublicationResult
    | Exclude<MaterializePlanPublicationResult, { status: "materialized" }>
    | undefined;
  getHistoricalCompletionDistribution: (
    query: HistoricalCompletionDistributionQueryV1,
  ) => Promise<HistoricalCompletionDistributionQueryResultV1>;
  getHistoricalSchedulingRealization: (
    query: HistoricalSchedulingRealizationQueryV1,
  ) => Promise<HistoricalSchedulingRealizationQueryResultV1>;
  getGoalActivity: (query: GoalActivityQueryV1) => Promise<GoalActivityQueryResultV1>;
  queryGoalProgress: (query: GoalProgressQueryV1) => GoalProgressQueryResultV1;
  queryGoalProgressObservationHistory: (
    goalId: import("../core/goals/goal.js").GoalId,
  ) => import("./goalProgressObservationHistoryQuery.js").GoalProgressObservationHistoryResult;
  queryToday: (
    query: import("./todayQuery.js").TodayQuery,
  ) => Promise<import("./todayQuery.js").TodayQueryResult>;
} & Omit<ExecutionHistorySurface, "clearExecutionHistory" | "getRuntimeAuthorityAdapter"> &
  Pick<
    HistoricalPlanSurface,
    | "initialize"
    | "retryPendingPublications"
    | "getHistoricalPlanDay"
    | "getHistoricalPlanRange"
    | "exportHistoricalPlan"
    | "abandonProtectedHistoricalPlan"
    | "getStatus"
    | "getPendingPublications"
    | "exportProtectedSource"
    | "recheckProtectedSource"
    | "subscribeStatus"
    | "subscribeHistory"
  > &
  Omit<GoalSurface, "clearGoals" | "getRuntimeAuthorityAdapter" | "replaceDurable"> &
  Omit<
    MeasurementDefinitionSurface,
    "clearMeasurementDefinitions" | "getRuntimeAuthorityAdapter" | "replaceDurable"
  > &
  Omit<
    ProgressObservationSurface,
    "clearProgressObservations" | "getRuntimeAuthorityAdapter" | "replaceDurable"
  >;

export type { SourceIncarnationId };
export type { PlanDecisionId, PlanDecisionIdAllocator, PlanDecisionV1 };
