import { generateSchedulePreview } from "../core/engine/generateSchedulePreview.js";
import type { MaterializePlanPublicationResult } from "../core/historicalPlan/materializePlanPublication.js";
import { reviseSchedulePreview } from "../core/engine/reviseSchedulePreview.js";
import {
  addUserDayLabels,
  resolveUserDayContainingInstant,
  resolveUserDayWindowForLabel,
} from "../core/time/canonicalUserDay.js";
import {
  CANONICAL_USER_DAY_RANGE_POLICY_V1,
  previewRangeFromLegacyInclusive,
  resolvePlanningDataHorizon,
} from "../core/planning/planningScope.js";
import {
  cloneDayFrameAuthoredSetup,
  createDayFrameBackupV2,
  DayFrameBackupValidationError,
  validateDayFrameBackup,
} from "./dayFrameBackup.js";
import {
  cloneSavedProfiles,
  createDayFrameProfilesStorageV2,
  convertDayFrameProfilesStorageV1,
  createDayFrameSavedProfile,
  validateDayFrameProfilesStorageV2,
} from "./dayFrameProfiles.js";
import {
  createInitialDayFrameState,
  normalizePersistedDayFramePattern,
  type PersistedDayFrameState,
} from "./createInitialDayFrameState.js";
import {
  createSourceIncarnationId,
  type SourceIncarnationAllocator,
} from "../core/authored/sourceIncarnation.js";
import {
  createActiveV2,
  cloneActiveSetup,
  instantiateActiveSetup,
  projectActiveToPattern,
  validateIncarnationGraph,
  validateActiveV2,
} from "./activeV2.js";
import type { ManualCalendarEvent } from "../core/calendar/types.js";
import type {
  ApplyPreviewFixActionInput,
  ActiveLocalAbandonmentRecoveryResult,
  ActiveDayFrameAuthoredSetup,
  ActiveLocalIngressStatus,
  ActiveLocalReplacementRecoveryResult,
  ActivePersistenceOutcome,
  ActiveRemovalOutcome,
  BackupImportResult,
  BackupV3ExportResult,
  BackupV3ImportResult,
  BackupV4ExportResult,
  BackupV4ImportResult,
  BackupV5ImportResult,
  BackupV5ExportResult,
  BackupV6ImportResult,
  BackupV6ExportResult,
  BackupV7ImportResult,
  BackupV7ExportResult,
  BackupV8ImportResult,
  BackupV8ExportResult,
  BackupV9ImportResult,
  BackupV9ExportResult,
  BackupV10ImportResult,
  BackupV10ExportResult,
  BackupV11ImportResult,
  BackupV11ExportResult,
  BackupV12ExportResult,
  BackupV12ImportResult,
  CommitAuthoredSetupInput,
  CommitAuthoredSetupTransactionInput,
  ClearLocalDataResult,
  DayFramePreview,
  DayFrameAuthoredPattern,
  DayFramePreviewRange,
  DayFrameSavedProfile,
  DayFrameSchedulingPreferences,
  DayFrameState,
  DayFrameStoreInitialState,
  DayFrameStore,
  DurabilityRetryResult,
  GeneratePreviewActionInput,
  FullClearAuthorityResults,
  ManualEventLifecycleMutation,
  PersistenceRemovalOutcome,
  PersistenceWriteOutcome,
  ProfileMutationResult,
  ProfileProtectedRecoveryResult,
  QuarantinedProfileEntry,
  QuarantineRemovalResult,
  ProfileLoadResult,
  ProfileIngressStatus,
  PublishScheduleRangeInputV1,
  PublishScheduleRangeResultV1,
  StoreDesiredDurableCondition,
  StoreDurabilityStatus,
  StoreMutationResult,
  SurfaceDurabilityStatus,
} from "./types.js";
import {
  createHistoricalPlanSurface,
  type HistoricalPlanPublicationResult,
  type HistoricalPlanSurface,
} from "./historicalPlanSurface.js";
import { cloneOccurrenceIdentity } from "../core/occurrences/occurrenceIdentity.js";
import { validateDayFrameAuthoredSetup } from "../core/authored/validateDayFrameAuthoredSetup.js";
import type { DayFrameAuthoredSetup } from "./types.js";
import { createPlanDecisionSurface } from "./planDecisionSurface.js";
import type { PlanDecisionIdAllocator } from "../core/decisions/planDecision.js";
import { createExecutionHistorySurface } from "./executionHistorySurface.js";
import {
  createGoalActivityQuery,
  createHistoricalIntelligenceQuery,
  createHistoricalSchedulingRealizationQuery,
} from "./historicalIntelligenceQuery.js";
import type { ExecutionHistoryIndexedDb } from "./executionHistoryIndexedDb.js";
import {
  createBootstrapPlaceholderState,
  type DayFrameReadiness,
  type DayFrameReadyResult,
} from "./dayFrameReadiness.js";
import {
  DayFrameMutationAdmissionError,
  getDayFrameMutationAdmission,
} from "./dayFrameMutationAdmission.js";
import { createDayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import { buildExecutionHistoryItems } from "../core/execution/executionHistoryProjection.js";
import { historicalOccurrenceTimingSemantics } from "../core/historicalPlan/historicalPlan.js";
import { createDayFrameAuthorityTransaction } from "./dayFrameAuthorityTransaction.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  registerDayFrameRuntimeAuthorityController,
  type DayFrameRuntimeAuthorityController,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";
import type {
  ExecutionRecordIdAllocator,
  ExecutionSubjectIdAllocator,
} from "../core/execution/executionRecord.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import type { IndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import type { DayFrameRestoreComposition } from "./dayFrameRestoreComposition.js";
import {
  backupV3SemanticFingerprint,
  createDayFrameBackupV3,
  DayFrameBackupV3ValidationError,
  profilesV2BackupData,
  validateDayFrameBackupV3,
} from "./dayFrameBackupV3.js";
import {
  backupV4SemanticFingerprint,
  createDayFrameBackupV4,
  validateDayFrameBackupV4,
} from "./dayFrameBackupV4.js";
import {
  backupV5SemanticFingerprint,
  createDayFrameBackupV5,
  validateDayFrameBackupV5,
} from "./dayFrameBackupV5.js";
import { validateMeasurementDefinitionAuthority } from "../core/measurement/measurementDefinition.js";
import { createGoalSurface, type GoalSurface } from "./goalSurface.js";
import {
  createMeasurementDefinitionSurface,
  type MeasurementDefinitionSurface,
} from "./measurementDefinitionSurface.js";
import {
  createProgressObservationSurface,
  type ProgressObservationSurface,
} from "./progressObservationSurface.js";
import {
  backupV6SemanticFingerprint,
  createDayFrameBackupV6,
  validateDayFrameBackupV6,
} from "./dayFrameBackupV6.js";
import { validateProgressObservationAuthority } from "../core/progressObservation/progressObservation.js";
import { createGoalProgressQuery } from "./goalProgressQuery.js";
import { createGoalProgressObservationHistoryQuery } from "./goalProgressObservationHistoryQuery.js";
import type { GoalStructureAuthorityV1 } from "../core/planning/goalStructure.js";
import type { GoalStructureSurface } from "./goalStructureSurface.js";
import { createLazyGoalStructureSurface } from "./lazyGoalStructureSurface.js";
import type {
  GoalPlanningAuthorityV1,
  GoalPlanningAuthorityV2,
} from "../core/planning/goalDemand.js";
import type { GoalPlanningSurface } from "./goalPlanningSurface.js";
import { createLazyGoalPlanningSurface } from "./lazyGoalPlanningSurface.js";
import type { CompositionSurface } from "./compositionSurface.js";
import { createLazyCompositionSurface } from "./lazyCompositionSurface.js";
import { createLazyCapacitySurface } from "./lazyCapacitySurface.js";
import { createLazyAllocationSurface } from "./lazyAllocationSurface.js";
import type { ProposalSurface } from "./proposalSurface.js";
import type { ProposalAuthorityV1 } from "../core/planning/proposal.js";
import { createLazyProposalSurface } from "./lazyProposalSurface.js";
import { createLazyRealizationSurface } from "./lazyRealizationSurface.js";
import type {
  CompositionAuthorityV1,
  CompositionTemplateSourceV1,
} from "../core/planning/commitmentComposition.js";
import {
  backupV7SemanticFingerprint,
  createDayFrameBackupV7,
  validateDayFrameBackupV7,
} from "./dayFrameBackupV7.js";

const loadBackupV8 = () => import("./dayFrameBackupV8.js");
const loadBackupV9 = () => import("./dayFrameBackupV9.js");
const loadBackupV10 = () => import("./dayFrameBackupV10.js");
const loadBackupV11 = () => import("./dayFrameBackupV11.js");
const loadBackupV12 = () => import("./dayFrameBackupV12.js");
const loadRestoreComposition = () => import("./dayFrameRestoreComposition.js");
const executionRestorePayload = async (
  value: Parameters<
    typeof import("./dayFrameRestoreComposition.js").createExecutionHistoryDurableRestorePayload
  >[0],
) => (await loadRestoreComposition()).createExecutionHistoryDurableRestorePayload(value);
const historicalRestorePayload = async (
  value: Parameters<
    typeof import("./dayFrameRestoreComposition.js").createHistoricalPlanDurableRestorePayload
  >[0],
) => (await loadRestoreComposition()).createHistoricalPlanDurableRestorePayload(value);
const emptyCompositionAuthority = () => ({ version: 1 as const, relationships: [], decisions: [] });
const emptyGoalStructureAuthority = (): GoalStructureAuthorityV1 => ({
  version: 1,
  relationships: [],
  milestones: [],
});
const emptyGoalPlanningAuthority = (): GoalPlanningAuthorityV1 => ({
  version: 1,
  demands: [],
  priorities: [],
});
const migrateGoalPlanningAuthorityV1 = (
  value: GoalPlanningAuthorityV1,
): GoalPlanningAuthorityV2 => ({
  version: 2,
  demands: structuredClone(value.demands),
  priorities: structuredClone(value.priorities),
  footprintSpecifications: [],
  footprintAssociations: [],
});
const emptyProposalAuthority = (): ProposalAuthorityV1 => ({
  version: 1 as const,
  proposals: [],
  candidates: [],
  decisions: [],
  acceptedAllocations: [],
});
const recordCount = (value: ReturnType<typeof emptyProposalAuthority>) =>
  value.proposals.length +
  value.candidates.length +
  value.decisions.length +
  value.acceptedAllocations.length;

export const DAYFRAME_STORAGE_KEY = "dayframe-store-v1";
export const DAYFRAME_ACTIVE_V2_STORAGE_KEY = "dayframe-active-v2";
export const DAYFRAME_ACTIVE_V2_ESTABLISHED_KEY = "dayframe-active-v2-established";
export const DAYFRAME_PROFILES_STORAGE_KEY = "dayframe-profiles-v1";
export const DAYFRAME_PROFILES_V2_STORAGE_KEY = "dayframe-profiles-v2";
export const DAYFRAME_PROFILES_V2_ESTABLISHED_KEY = "dayframe-profiles-v2-established";

export type { PersistenceRemovalOutcome, PersistenceWriteOutcome } from "./types.js";

function describeQuarantinedProfile(raw: unknown, index: number): QuarantinedProfileEntry {
  const record =
    typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : undefined;
  let serialized: string;
  try {
    serialized = JSON.stringify(raw) ?? String(raw);
  } catch {
    serialized = String(raw);
  }
  let hash = 2166136261;
  for (const character of serialized) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return {
    quarantineId: `quarantine-${(hash >>> 0).toString(16)}-${index}`,
    reason: "invalidProfileEntry",
    ...(typeof record?.id === "string" ? { originalProfileId: record.id } : {}),
    ...(typeof record?.name === "string" ? { originalProfileName: record.name } : {}),
    raw: structuredClone(raw),
  };
}

function buildAuthoredCandidate(
  state: DayFrameState,
  proposed: Partial<DayFrameAuthoredPattern>,
): DayFrameAuthoredPattern {
  return {
    schedulingPreferences: proposed.schedulingPreferences ?? state.schedulingPreferences,
    previewRange: proposed.previewRange ?? state.previewRange,
    shiftDefinitions: proposed.shiftDefinitions ?? state.shiftDefinitions,
    shiftCycles: proposed.shiftCycles ?? state.shiftCycles,
    blockTemplates: proposed.blockTemplates ?? state.blockTemplates,
    blockRecurrences: proposed.blockRecurrences ?? state.blockRecurrences,
    manualEvents: proposed.manualEvents ?? state.manualEvents,
  };
}

function getValidationRejection(
  candidate: DayFrameAuthoredPattern,
): Extract<StoreMutationResult, { status: "rejected" }> | null {
  const validation = validateDayFrameAuthoredSetup(candidate);

  return validation.status === "invalid"
    ? {
        status: "rejected",
        reason: "invalidAuthoredState",
        validation,
      }
    : null;
}

function validateLifecycleOperations(
  operations: CommitAuthoredSetupTransactionInput["lifecycle"]["operations"],
): void {
  for (const operation of operations) {
    if (!operation.sourceId.trim()) {
      throw new RangeError("Lifecycle operations require a source ID.");
    }

    if (
      (operation.sourceKind === "shiftSegment" || operation.sourceKind === "shiftSequenceEntry") &&
      !operation.parentSourceId?.trim()
    ) {
      throw new RangeError("Nested lifecycle operations require a parent source ID.");
    }
  }
}

function authoredSourceReferenceKeys(setup: DayFrameAuthoredPattern): Set<string> {
  const keys = new Set<string>();
  const add = (kind: string, id: string, parentId = "") => {
    keys.add(`${kind}:${parentId}:${id}`);
  };

  setup.shiftDefinitions.forEach((source) => add("shiftDefinition", source.id));
  setup.shiftCycles.forEach((cycle) => {
    add("shiftCycle", cycle.id);
    cycle.segments.forEach((source) => add("shiftSegment", source.id, cycle.id));
    (cycle.sequence ?? []).forEach((source) => add("shiftSequenceEntry", source.id, cycle.id));
  });
  setup.blockTemplates.forEach((source) => add("blockTemplate", source.id));
  setup.blockRecurrences.forEach((source) => add("blockRecurrence", source.id));
  return keys;
}

function validateSetupLifecycleTransaction(
  previous: DayFrameAuthoredPattern,
  candidate: DayFrameAuthoredPattern,
  operations: CommitAuthoredSetupTransactionInput["lifecycle"]["operations"],
): void {
  validateLifecycleOperations(operations);
  const previousKeys = authoredSourceReferenceKeys(previous);
  const candidateKeys = authoredSourceReferenceKeys(candidate);
  const operationKinds = new Map<string, Set<(typeof operations)[number]["operation"]>>();

  for (const operation of operations) {
    if (operation.sourceKind === "manualEvent") {
      throw new RangeError("Setup lifecycle transactions cannot mutate manual events.");
    }
    const key = `${operation.sourceKind}:${operation.parentSourceId ?? ""}:${operation.sourceId}`;
    const operationMatchesSnapshot =
      (operation.operation === "create" && candidateKeys.has(key)) ||
      (operation.operation === "update" && previousKeys.has(key) && candidateKeys.has(key)) ||
      (operation.operation === "delete" && previousKeys.has(key)) ||
      (operation.operation === "replace" && (previousKeys.has(key) || candidateKeys.has(key)));
    if (!operationMatchesSnapshot) {
      throw new RangeError(`Lifecycle operation does not match authored snapshots: ${key}.`);
    }
    const kinds = operationKinds.get(key) ?? new Set();
    kinds.add(operation.operation);
    operationKinds.set(key, kinds);
  }

  for (const key of new Set([...previousKeys, ...candidateKeys])) {
    const existed = previousKeys.has(key);
    const exists = candidateKeys.has(key);
    const kinds = operationKinds.get(key) ?? new Set();
    const valid =
      (existed &&
        exists &&
        (kinds.has("update") ||
          kinds.has("replace") ||
          (kinds.has("delete") && kinds.has("create")))) ||
      (!existed && exists && (kinds.has("create") || kinds.has("replace"))) ||
      (existed && !exists && (kinds.has("delete") || kinds.has("replace")));

    if (!valid) {
      throw new RangeError(`Setup lifecycle provenance does not cover ${key}.`);
    }
  }
}

function preserveUpdatedIncarnations(
  candidate: DayFrameAuthoredSetup,
  previous: DayFrameAuthoredSetup,
  operations: CommitAuthoredSetupTransactionInput["lifecycle"]["operations"],
): void {
  const sources = (setup: DayFrameAuthoredSetup) => {
    const result = new Map<
      string,
      { incarnationId: DayFrameAuthoredSetup["shiftDefinitions"][number]["incarnationId"] }
    >();
    const add = (
      kind: string,
      source: {
        id: string;
        incarnationId: DayFrameAuthoredSetup["shiftDefinitions"][number]["incarnationId"];
      },
      parent = "",
    ) => result.set(`${kind}:${parent}:${source.id}`, source);
    setup.shiftDefinitions.forEach((source) => add("shiftDefinition", source));
    setup.shiftCycles.forEach((cycle) => {
      add("shiftCycle", cycle);
      cycle.segments.forEach((source) => add("shiftSegment", source, cycle.id));
      (cycle.sequence ?? []).forEach((source) => add("shiftSequenceEntry", source, cycle.id));
    });
    setup.blockTemplates.forEach((source) => add("blockTemplate", source));
    setup.blockRecurrences.forEach((source) => add("blockRecurrence", source));
    return result;
  };
  const oldSources = sources(previous);
  const newSources = sources(candidate);
  for (const operation of operations) {
    if (operation.operation !== "update") continue;
    const key = `${operation.sourceKind}:${operation.parentSourceId ?? ""}:${operation.sourceId}`;
    const oldSource = oldSources.get(key);
    const newSource = newSources.get(key);
    if (oldSource && newSource) newSource.incarnationId = oldSource.incarnationId;
  }
}

function mapWriteOutcomeToDurability(
  outcome: PersistenceWriteOutcome,
): Exclude<SurfaceDurabilityStatus, "unknown"> {
  return outcome.status === "persisted" ? "durable" : outcome.status;
}

function mapRemovalOutcomeToDurability(
  outcome: PersistenceRemovalOutcome,
): Exclude<SurfaceDurabilityStatus, "unknown" | "serializationFailure"> {
  return outcome.status === "removed" ? "durable" : outcome.status;
}

export function createDayFrameStore(
  initialState?: DayFrameStoreInitialState,
  options: {
    allocateSourceIncarnationId?: SourceIncarnationAllocator;
    serializeActiveV2?: (value: unknown) => string;
    serializeProfilesV2?: (value: unknown) => string;
    serializePlanDecisions?: (value: unknown) => string;
    allocatePlanDecisionId?: PlanDecisionIdAllocator;
    planDecisionClock?: () => string;
    serializeExecutionHistory?: (value: unknown) => string;
    allocateExecutionRecordId?: ExecutionRecordIdAllocator;
    allocateExecutionSubjectId?: ExecutionSubjectIdAllocator;
    executionHistoryClock?: () => string;
    executionHistoryIndexedDb?: ExecutionHistoryIndexedDb;
    historicalPlanSurface?: HistoricalPlanSurface;
    goalSurface?: GoalSurface;
    measurementDefinitionSurface?: MeasurementDefinitionSurface;
    progressObservationSurface?: ProgressObservationSurface;
    goalStructureSurface?: GoalStructureSurface;
    goalPlanningSurface?: GoalPlanningSurface;
    compositionSurface?: CompositionSurface;
    proposalSurface?: ProposalSurface;
    bootstrapMode?: "resolved-test";
    preBootstrapHook?: (context: {
      runtimeAuthority: DayFrameRuntimeAuthorityController;
    }) => Promise<
      | { status: "continue" }
      | {
          status: "protected";
          reason: "authorityRecoveryRequired";
        }
    >;
    restoreStorage?: Storage;
    restoreIndexedDb?: IndexedDbCollectionStorage;
    restoreTransactionId?: () => string;
    restoreClock?: () => string;
  } = {},
): DayFrameStore {
  let readiness: DayFrameReadiness =
    options.bootstrapMode === "resolved-test" ? { status: "ready" } : { status: "initializing" };
  const readinessListeners = new Set<(value: DayFrameReadiness) => void>();
  let settleReadiness: ((result: DayFrameReadyResult) => void) | undefined;
  const readinessPromise: Promise<DayFrameReadyResult> =
    readiness.status === "ready"
      ? Promise.resolve({ status: "ready" })
      : new Promise((resolve) => {
          settleReadiness = resolve;
        });
  const bootstrapPlaceholder = createBootstrapPlaceholderState();
  const notificationScheduler = createDayFrameNotificationScheduler();
  const allocateIncarnation = options.allocateSourceIncarnationId ?? createSourceIncarnationId;
  const activeLocalIngress = loadActiveLocalIngress(
    allocateIncarnation,
    options.serializeActiveV2 ?? ((value) => JSON.stringify(value)),
  );
  const profileIngress = loadPersistedProfiles(
    options.serializeProfilesV2 ?? ((value) => JSON.stringify(value)),
  );
  let state = mergeInitialState(
    activeLocalIngress.state,
    initialState,
    allocateIncarnation,
    profileIngress.profiles,
  );
  const planDecisionSurface = createPlanDecisionSurface({
    getAuthoredSetup: () => getActiveSetup(state),
    onAuthorityChanged: () => {
      if (state.preview && !state.preview.isStale) {
        state = { ...state, preview: markPreviewStale(state.preview) };
        notify();
      }
    },
    ...(options.allocatePlanDecisionId
      ? { allocatePlanDecisionId: options.allocatePlanDecisionId }
      : {}),
    ...(options.planDecisionClock ? { now: options.planDecisionClock } : {}),
    ...(options.serializePlanDecisions ? { serialize: options.serializePlanDecisions } : {}),
    notificationScheduler,
  });
  const executionHistorySurface = createExecutionHistorySurface({
    ...(options.allocateExecutionRecordId
      ? { allocateRecordId: options.allocateExecutionRecordId }
      : {}),
    ...(options.allocateExecutionSubjectId
      ? { allocateSubjectId: options.allocateExecutionSubjectId }
      : {}),
    ...(options.executionHistoryClock ? { now: options.executionHistoryClock } : {}),
    ...(options.serializeExecutionHistory ? { serialize: options.serializeExecutionHistory } : {}),
    ...(options.executionHistoryIndexedDb ? { indexedDb: options.executionHistoryIndexedDb } : {}),
    notificationScheduler,
  });
  const historicalPlanSurface =
    options.historicalPlanSurface ??
    createHistoricalPlanSurface({
      notificationScheduler,
    });
  let goalMutationAdmission = () => true;
  const goalSurface =
    options.goalSurface ??
    createGoalSurface({
      storage: options.restoreIndexedDb ?? createDayFrameDurableDb(),
      notificationScheduler,
      canMutate: () => goalMutationAdmission(),
      isLinkAvailable: (link) => {
        const setup = getActiveSetup(state);
        const sources =
          link.sourceKind === "blockTemplate"
            ? setup.blockTemplates
            : link.sourceKind === "blockRecurrence"
              ? setup.blockRecurrences
              : link.sourceKind === "manualEvent"
                ? setup.manualEvents
                : link.sourceKind === "shiftDefinition"
                  ? setup.shiftDefinitions
                  : link.sourceKind === "shiftCycle"
                    ? setup.shiftCycles
                    : link.sourceKind === "shiftSegment"
                      ? setup.shiftCycles.flatMap((cycle) => cycle.segments)
                      : setup.shiftCycles.flatMap((cycle) => cycle.sequence ?? []);
        return sources.some(
          (source) => source.id === link.id && source.incarnationId === link.incarnationId,
        );
      },
    });
  let measurementMutationAdmission = () => true;
  const measurementDefinitionSurface =
    options.measurementDefinitionSurface ??
    createMeasurementDefinitionSurface({
      storage: options.restoreIndexedDb ?? createDayFrameDurableDb(),
      getGoal: goalSurface.getGoal,
      notificationScheduler,
      canMutate: () => measurementMutationAdmission(),
    });
  let observationMutationAdmission = () => true;
  const progressObservationSurface =
    options.progressObservationSurface ??
    createProgressObservationSurface({
      storage: options.restoreIndexedDb ?? createDayFrameDurableDb(),
      getGoal: goalSurface.getGoal,
      getDefinition: measurementDefinitionSurface.getMeasurementDefinitionRevision,
      resolveDefinition: measurementDefinitionSurface.getCurrentMeasurementDefinition,
      dependenciesReady: () =>
        goalSurface.getGoalIngressStatus().status === "accepted" &&
        measurementDefinitionSurface.getMeasurementDefinitionIngressStatus().status === "accepted"
          ? "ready"
          : goalSurface.getGoalIngressStatus().status === "protected" ||
              measurementDefinitionSurface.getMeasurementDefinitionIngressStatus().status ===
                "protected"
            ? "protected"
            : "initializing",
      notificationScheduler,
      canMutate: () => observationMutationAdmission(),
    });
  let structureMutationAdmission = () => true;
  const goalStructureSurface =
    options.goalStructureSurface ??
    createLazyGoalStructureSurface({
      storage: options.restoreIndexedDb ?? createDayFrameDurableDb(),
      getGoal: goalSurface.getGoal,
      listGoals: goalSurface.listGoals,
      notificationScheduler,
      canMutate: () => structureMutationAdmission(),
    });
  let planningMutationAdmission = () => true;
  const goalPlanningSurface =
    options.goalPlanningSurface ??
    createLazyGoalPlanningSurface({
      storage: options.restoreIndexedDb ?? createDayFrameDurableDb(),
      getGoal: goalSurface.getGoal,
      listGoals: goalSurface.listGoals,
      getStructuralEligibility: goalStructureSurface.getStructuralEligibility,
      getUserDayResolver: () => ({
        shiftCycles: state.shiftCycles,
        defaultSchedulingPreferences: state.schedulingPreferences,
      }),
      notificationScheduler,
      canMutate: () => planningMutationAdmission(),
    });
  const listCompositionSources = (): CompositionTemplateSourceV1[] =>
    state.blockTemplates.map((source) => {
      const recurrence = state.blockRecurrences
        .filter((value) => value.blockTemplateId === source.id)
        .sort((a, b) => a.id.localeCompare(b.id))[0];
      return {
        kind: "template",
        sourceId: source.id,
        incarnationId: source.incarnationId,
        title: source.title,
        durationMinutes: source.durationMinutes,
        revisionToken: source.updatedAt,
        userId: source.userId,
        category: source.category,
        priority: source.priority,
        ...(source.bufferBeforeMinutes === undefined
          ? {}
          : { bufferBeforeMinutes: source.bufferBeforeMinutes }),
        ...(source.bufferAfterMinutes === undefined
          ? {}
          : { bufferAfterMinutes: source.bufferAfterMinutes }),
        ...(recurrence
          ? {
              recurrence: {
                id: recurrence.id,
                incarnationId: recurrence.incarnationId,
                frequency: recurrence.frequency,
              },
            }
          : {}),
      };
    });
  let compositionMutationAdmission = () => true;
  const compositionSurface =
    options.compositionSurface ??
    createLazyCompositionSurface({
      storage: options.restoreIndexedDb ?? createDayFrameDurableDb(),
      listSources: listCompositionSources,
      notificationScheduler,
      canMutate: () => compositionMutationAdmission(),
      onAuthorityChanged: () => {
        if (state.preview && !state.preview.isStale) {
          state = { ...state, preview: markPreviewStale(state.preview) };
          notify();
        }
      },
    });
  const queryGoalProgress = createGoalProgressQuery({
    goals: goalSurface,
    definitions: measurementDefinitionSurface,
    observations: progressObservationSurface,
  });
  let listRealizedScheduleFactsForCapacity = () =>
    [] as import("../core/planning/realizedScheduleIdentity.js").RealizedScheduleFactV1[];
  let listAcceptedAllocationsForCapacity = () =>
    [] as import("../core/planning/proposal.js").AcceptedAllocationV2[];
  const capacitySurface = createLazyCapacitySurface({
    getState: () => state,
    projectGoalDemand: goalPlanningSurface.projectGoalDemand,
    resolveDemandResourceFootprintAssociation:
      goalPlanningSurface.resolveDemandResourceFootprintAssociation,
    getIntegrity: () => (readiness.status === "protected" ? "protected" : "valid"),
    listRealizedScheduleFacts: () => listRealizedScheduleFactsForCapacity(),
    listAcceptedAllocations: () => listAcceptedAllocationsForCapacity(),
  });
  const allocationSurface = createLazyAllocationSurface({
    capacity: capacitySurface,
    goals: goalSurface,
    planning: goalPlanningSurface,
  });
  let proposalMutationAdmission = () => true;
  let realizeAcceptedAllocationAfterAcceptance: (id: string) => Promise<unknown> = async () => ({
    status: "notInitialized",
  });
  const proposalSurface =
    options.proposalSurface ??
    createLazyProposalSurface({
      storage: options.restoreIndexedDb ?? createDayFrameDurableDb(),
      notificationScheduler,
      canMutate: () => proposalMutationAdmission(),
      onAcceptedAllocation: (id) => realizeAcceptedAllocationAfterAcceptance(id),
      revalidate: async (proposal) => {
        const evaluated = await allocationSurface.evaluateCompetingAllocation({
          startUserDayDate: proposal.horizon
            .startUserDayDate as import("../core/shifts/types.js").LocalDateString,
          endUserDayDateExclusive: proposal.horizon
            .endUserDayDateExclusive as import("../core/shifts/types.js").LocalDateString,
          evaluationCutoff: proposal.evaluationCutoff,
        });
        if (evaluated.status !== "evaluated")
          return { status: "invalid" as const, reasons: [{ code: "invalidAllocation" as const }] };
        const allocation = evaluated.allocation.allocations.find(
          (value) => value.competingSetId === proposal.sourceCompetingSetId,
        );
        if (allocation) {
          const { deriveOrdinaryProposal } = await import("../core/planning/proposal.js");
          return deriveOrdinaryProposal({
            allocation,
            horizon: proposal.horizon,
            allocationHorizon: proposal.horizon,
            generatedAt: proposal.generatedAt,
            evaluationCutoff: proposal.evaluationCutoff,
          });
        }
        return { status: "invalid" as const, reasons: [{ code: "invalidAllocation" as const }] };
      },
    });
  const realizationSurface = createLazyRealizationSurface({
    storage: options.restoreIndexedDb ?? createDayFrameDurableDb(),
    resolveAcceptedAllocation: proposalSurface.resolveAcceptedAllocation as never,
    currentSchedule: () => [
      ...(state.preview?.result.generatedWorkBlocks.map((item) => ({
        id: item.id as never,
        startsAt: item.startsAt.toISOString(),
        endsAt: item.endsAt.toISOString(),
        sourceKind: "work" as never,
      })) ?? []),
      ...(state.preview?.result.scheduledBlocks.map((item) => ({
        id: item.id as never,
        startsAt: item.startsAt.toISOString(),
        endsAt: item.endsAt.toISOString(),
        sourceKind: item.source as never,
      })) ?? []),
    ],
    onAuthorityChanged: () => {
      if (state.preview && !state.preview.isStale) {
        state = { ...state, preview: markPreviewStale(state.preview) };
        notify();
      }
    },
  });
  listRealizedScheduleFactsForCapacity = realizationSurface.listRealizedScheduleFacts;
  realizeAcceptedAllocationAfterAcceptance = realizationSurface.realizeAcceptedAllocation;
  listAcceptedAllocationsForCapacity = () =>
    proposalSurface
      .exportProposalAuthority()
      .acceptedAllocations.filter(
        (value) => value.version === 2,
      ) as import("../core/planning/proposal.js").AcceptedAllocationV2[];
  async function queryPlanningReview(input: {
    reviewScope: import("../core/planning/planningScope.js").ReviewScopeV1;
    historyAsOf: string;
  }) {
    const { createPlanningScopeQuery } = await import("./planningScopeQuery.js");
    return createPlanningScopeQuery({
      getState: () => state,
      proposals: proposalSurface,
      realizations: realizationSurface,
      historicalPlan: historicalPlanSurface,
    })(input);
  }
  const queryGoalProgressObservationHistory = createGoalProgressObservationHistoryQuery({
    definitions: measurementDefinitionSurface,
    observations: progressObservationSurface,
  });
  const getHistoricalCompletionDistribution = createHistoricalIntelligenceQuery({
    historicalPlan: historicalPlanSurface,
    executionHistory: executionHistorySurface,
  });
  const getHistoricalSchedulingRealization = createHistoricalSchedulingRealizationQuery({
    historicalPlan: historicalPlanSurface,
  });
  const getGoalActivity = createGoalActivityQuery({
    historicalPlan: historicalPlanSurface,
    executionHistory: executionHistorySurface,
    goals: goalSurface,
  });
  async function queryToday(query: import("./todayQuery.js").TodayQuery) {
    const { createTodayQuery } = await import("./todayQuery.js");
    return createTodayQuery({
      getAuthoredSetup: () => getActiveSetup(state),
      historicalPlan: historicalPlanSurface,
      executionHistory: executionHistorySurface,
      resolveUserDayContainingInstant,
      buildExecutionHistoryItems,
      historicalOccurrenceTimingSemantics,
    })(query);
  }
  let lastHistoricalPlanPublicationResult:
    | HistoricalPlanPublicationResult
    | Exclude<MaterializePlanPublicationResult, { status: "materialized" }>
    | undefined;
  let activeLocalIngressStatus = activeLocalIngress.status;
  let protectedActiveSource = activeLocalIngress.protectedSource;
  let protectedActiveSourceKey = activeLocalIngress.protectedSourceKey;
  let profileIngressStatus = profileIngress.status;
  let quarantinedProfiles = profileIngress.quarantinedProfiles;
  let protectedProfileSource = profileIngress.protectedSource;
  let protectedProfileSourceKey = profileIngress.protectedSourceKey;
  let durabilityStatus: StoreDurabilityStatus = {
    activeState: activeLocalIngress.activeDurability,
    profiles: profileIngress.durability,
  };
  let desiredDurableCondition: StoreDesiredDurableCondition = {
    activeState: "snapshot",
    profiles: "snapshot",
  };
  const listeners = new Set<(state: DayFrameState) => void>();
  const durabilityListeners = new Set<(status: StoreDurabilityStatus) => void>();
  const activeLocalIngressListeners = new Set<(status: ActiveLocalIngressStatus) => void>();
  const profileIngressListeners = new Set<(status: ProfileIngressStatus) => void>();

  function captureActiveRuntime() {
    const activeState = cloneState(state);
    activeState.savedProfiles = [];
    return structuredClone({
      activeState,
      activeLocalIngressStatus,
      protectedActiveSource,
      protectedActiveSourceKey,
      durability: durabilityStatus.activeState,
      desired: desiredDurableCondition.activeState,
    });
  }
  function installActiveRuntime(target: ReturnType<typeof captureActiveRuntime>) {
    state = {
      ...structuredClone(target.activeState),
      savedProfiles: cloneSavedProfiles(state.savedProfiles),
    };
    activeLocalIngressStatus = structuredClone(target.activeLocalIngressStatus);
    protectedActiveSource = target.protectedActiveSource;
    protectedActiveSourceKey = target.protectedActiveSourceKey;
    durabilityStatus = { ...durabilityStatus, activeState: target.durability };
    desiredDurableCondition = { ...desiredDurableCondition, activeState: target.desired };
    notificationScheduler.notify("main", () => {
      const snapshot = getState();
      for (const listener of listeners) listener(snapshot);
    });
  }
  function captureProfilesRuntime() {
    return structuredClone({
      profiles: cloneSavedProfiles(state.savedProfiles),
      profileIngressStatus,
      quarantinedProfiles,
      protectedProfileSource,
      protectedProfileSourceKey,
      durability: durabilityStatus.profiles,
      desired: desiredDurableCondition.profiles,
    });
  }
  function installProfilesRuntime(target: ReturnType<typeof captureProfilesRuntime>) {
    state = { ...state, savedProfiles: cloneSavedProfiles(target.profiles) };
    profileIngressStatus = structuredClone(target.profileIngressStatus);
    quarantinedProfiles = structuredClone(target.quarantinedProfiles);
    protectedProfileSource = target.protectedProfileSource;
    protectedProfileSourceKey = target.protectedProfileSourceKey;
    durabilityStatus = { ...durabilityStatus, profiles: target.durability };
    desiredDurableCondition = { ...desiredDurableCondition, profiles: target.desired };
    notificationScheduler.notify("profiles", () => {
      for (const listener of profileIngressListeners) listener({ ...profileIngressStatus });
    });
  }
  const activeRuntimeAdapter: RuntimeAuthorityAdapter<ReturnType<typeof captureActiveRuntime>> = {
    id: "active",
    captureRuntimeSnapshot: captureActiveRuntime,
    installRuntimeExact: installActiveRuntime,
  };
  const profilesRuntimeAdapter: RuntimeAuthorityAdapter<ReturnType<typeof captureProfilesRuntime>> =
    {
      id: "profiles",
      captureRuntimeSnapshot: captureProfilesRuntime,
      installRuntimeExact: installProfilesRuntime,
    };
  const runtimeParticipants = [
    activeRuntimeAdapter,
    profilesRuntimeAdapter,
    planDecisionSurface.getRuntimeAuthorityAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY),
    executionHistorySurface.getRuntimeAuthorityAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY),
    historicalPlanSurface.getRuntimeAuthorityAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY),
    goalSurface.getRuntimeAuthorityAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY),
    measurementDefinitionSurface.getRuntimeAuthorityAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY),
    progressObservationSurface.getRuntimeAuthorityAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY),
    goalStructureSurface.getRuntimeAuthorityAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY),
    goalPlanningSurface.getRuntimeAuthorityAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY),
    compositionSurface.getCompositionRuntimeAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY),
    proposalSurface.getProposalRuntimeAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY),
    realizationSurface.getRealizationRuntimeAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY),
  ];
  const authorityTransaction = createDayFrameAuthorityTransaction({
    scheduler: notificationScheduler,
    participants: runtimeParticipants.map((participant) => ({
      id: participant.id,
      capture: () => participant.captureRuntimeSnapshot(),
      installExact: (value: unknown) => participant.installRuntimeExact(value as never),
    })),
  });
  goalMutationAdmission = () => authorityTransaction.getState().status === "inactive";
  measurementMutationAdmission = () => authorityTransaction.getState().status === "inactive";
  observationMutationAdmission = () => authorityTransaction.getState().status === "inactive";
  structureMutationAdmission = () => authorityTransaction.getState().status === "inactive";
  planningMutationAdmission = () => authorityTransaction.getState().status === "inactive";
  compositionMutationAdmission = () => authorityTransaction.getState().status === "inactive";
  proposalMutationAdmission = () => authorityTransaction.getState().status === "inactive";
  const restoreStorage = options.restoreStorage ?? getOptionalStorage();
  let restoreComposition: DayFrameRestoreComposition | undefined;
  async function initializeRestoreComposition() {
    if (!restoreStorage || restoreComposition) return;
    const module = await loadRestoreComposition();
    restoreComposition = module.createDayFrameRestoreComposition({
      storage: restoreStorage,
      indexedDb: options.restoreIndexedDb ?? createDayFrameDurableDb(),
      runtime: authorityTransaction,
      sources: {
        active: () => createActiveV2(getActiveSetup(state)),
        profiles: () => createDayFrameProfilesStorageV2(state.savedProfiles, quarantinedProfiles),
        planDecisions: () => ({
          app: "DayFrame",
          surface: "planDecisions",
          version: 1,
          decisions: [
            ...planDecisionSurface.getPlanDecisions(),
            ...planDecisionSurface
              .getQuarantinedPlanDecisions()
              .map((entry) => structuredClone(entry.raw)),
          ],
        }),
        executionHistory: executionHistorySurface.exportExecutionHistoryEnvelope,
        historicalPlan: historicalPlanSurface.exportHistoricalPlan,
        goals: goalSurface.exportAuthority,
        measurementDefinitions: measurementDefinitionSurface.exportMeasurementDefinitionAuthority,
        progressObservations: progressObservationSurface.exportProgressObservationAuthority,
        goalStructure: goalStructureSurface.exportGoalStructureAuthority,
        goalPlanning: goalPlanningSurface.exportGoalPlanningAuthority,
        composition: compositionSurface.exportCompositionAuthority,
        proposals: proposalSurface.exportProposalAuthority,
        realizations: realizationSurface.exportRealizationAuthority,
        readiness: (id) => {
          if (id === "active")
            return activeLocalIngressStatus.status === "recoveryRequired" ? "protected" : "ready";
          if (id === "profiles")
            return profileIngressStatus.status === "recoveryRequired" ? "protected" : "ready";
          if (id === "planDecisions")
            return planDecisionSurface.getPlanDecisionIngressStatus().status === "recoveryRequired"
              ? "protected"
              : "ready";
          if (id === "executionHistory")
            return executionHistorySurface.getExecutionHistoryIngressStatus().status ===
              "recoveryRequired"
              ? "protected"
              : "ready";
          if (id === "historicalPlan")
            return historicalPlanSurface.getStatus().status === "protected" ? "protected" : "ready";
          if (id === "goals")
            return goalSurface.getGoalIngressStatus().status === "protected"
              ? "protected"
              : goalSurface.getGoalIngressStatus().status === "initializing" &&
                  readiness.status !== "ready"
                ? "notReady"
                : "ready";
          if (id === "measurementDefinitions")
            return measurementDefinitionSurface.getMeasurementDefinitionIngressStatus().status ===
              "protected"
              ? "protected"
              : measurementDefinitionSurface.getMeasurementDefinitionIngressStatus().status ===
                    "initializing" && readiness.status !== "ready"
                ? "notReady"
                : "ready";
          if (id === "progressObservations")
            return progressObservationSurface.getProgressObservationIngressStatus().status ===
              "protected"
              ? "protected"
              : progressObservationSurface.getProgressObservationIngressStatus().status ===
                    "initializing" && readiness.status !== "ready"
                ? "notReady"
                : "ready";
          if (id === "goalStructure")
            return goalStructureSurface.getGoalStructureIngressStatus().status === "protected"
              ? "protected"
              : goalStructureSurface.getGoalStructureIngressStatus().status === "initializing" &&
                  readiness.status !== "ready"
                ? "notReady"
                : "ready";
          if (id === "goalPlanning")
            return goalPlanningSurface.getGoalPlanningIngressStatus().status === "protected"
              ? "protected"
              : goalPlanningSurface.getGoalPlanningIngressStatus().status === "initializing" &&
                  readiness.status !== "ready"
                ? "notReady"
                : "ready";
          if (id === "composition")
            return compositionSurface.getCompositionIngressStatus().status === "protected"
              ? "protected"
              : compositionSurface.getCompositionIngressStatus().status === "initializing" &&
                  readiness.status !== "ready"
                ? "notReady"
                : "ready";
          if (id === "realizations")
            return realizationSurface.getRealizationIngressStatus() === "protected"
              ? "protected"
              : realizationSurface.getRealizationIngressStatus() === "initializing" &&
                  readiness.status !== "ready"
                ? "notReady"
                : "ready";
          return proposalSurface.getProposalIngressStatus().status === "protected"
            ? "protected"
            : proposalSurface.getProposalIngressStatus().status === "initializing" &&
                readiness.status !== "ready"
              ? "notReady"
              : "ready";
        },
      },
      ...(options.restoreTransactionId ? { allocateId: options.restoreTransactionId } : {}),
      ...(options.restoreClock ? { now: options.restoreClock } : {}),
    });
    module.registerDayFrameRestoreComposition(storeProxy, restoreComposition);
  }

  function getState(): DayFrameState {
    return readiness.status === "ready" ? cloneState(state) : cloneState(bootstrapPlaceholder);
  }

  function getReadiness(): DayFrameReadiness {
    return { ...readiness };
  }
  function subscribeReadiness(listener: (value: DayFrameReadiness) => void) {
    readinessListeners.add(listener);
    return () => readinessListeners.delete(listener);
  }
  function whenReady() {
    return readinessPromise;
  }
  function transitionReadiness(next: Exclude<DayFrameReadiness, { status: "initializing" }>) {
    if (readiness.status !== "initializing") return;
    readiness = next;
    const terminal: DayFrameReadyResult =
      next.status === "ready" ? { status: "ready" } : { status: "protected", reason: next.reason };
    settleReadiness?.(terminal);
    settleReadiness = undefined;
    if (next.status === "ready") notify();
    for (const listener of readinessListeners) listener({ ...next });
  }

  function getDurabilityStatus(): StoreDurabilityStatus {
    return { ...durabilityStatus };
  }

  function getActiveLocalIngressStatus(): ActiveLocalIngressStatus {
    return cloneActiveLocalIngressStatus(activeLocalIngressStatus);
  }

  function getProfileIngressStatus(): ProfileIngressStatus {
    return { ...profileIngressStatus };
  }

  function getQuarantinedProfiles(): QuarantinedProfileEntry[] {
    return quarantinedProfiles.map((raw, index) => describeQuarantinedProfile(raw, index));
  }

  function exportProtectedProfileSource() {
    if (profileIngressStatus.status !== "recoveryRequired") {
      return { status: "notAvailable", reason: "noProtectedSource" } as const;
    }
    return protectedProfileSource === undefined
      ? ({ status: "notAvailable", reason: "sourceUnreadable" } as const)
      : ({ status: "exported", raw: protectedProfileSource } as const);
  }

  function exportQuarantinedProfile(quarantineId: string) {
    const entry = getQuarantinedProfiles().find(
      (candidate) => candidate.quarantineId === quarantineId,
    );
    return entry
      ? ({ status: "exported", entry } as const)
      : ({ status: "notAvailable", reason: "missingEntry" } as const);
  }

  function getDesiredDurableCondition(): StoreDesiredDurableCondition {
    return { ...desiredDurableCondition };
  }

  function subscribeDurability(listener: (status: StoreDurabilityStatus) => void): () => void {
    durabilityListeners.add(listener);

    return () => {
      durabilityListeners.delete(listener);
    };
  }

  function subscribeActiveLocalIngress(
    listener: (status: ActiveLocalIngressStatus) => void,
  ): () => void {
    activeLocalIngressListeners.add(listener);

    return () => {
      activeLocalIngressListeners.delete(listener);
    };
  }

  function subscribeProfileIngress(listener: (status: ProfileIngressStatus) => void): () => void {
    profileIngressListeners.add(listener);
    return () => profileIngressListeners.delete(listener);
  }

  function transitionProfileIngress(nextStatus: ProfileIngressStatus): void {
    profileIngressStatus = nextStatus;
    for (const listener of profileIngressListeners) listener(getProfileIngressStatus());
  }

  function updateDurabilityStatus(nextStatus: StoreDurabilityStatus): void {
    if (
      durabilityStatus.activeState === nextStatus.activeState &&
      durabilityStatus.profiles === nextStatus.profiles
    ) {
      return;
    }

    durabilityStatus = nextStatus;

    for (const listener of durabilityListeners) {
      listener(getDurabilityStatus());
    }
  }

  function transitionActiveLocalIngress(nextStatus: ActiveLocalIngressStatus): void {
    activeLocalIngressStatus = nextStatus;

    for (const listener of activeLocalIngressListeners) {
      listener(getActiveLocalIngressStatus());
    }
  }

  function retainActiveSnapshotIntent(): void {
    desiredDurableCondition = {
      ...desiredDurableCondition,
      activeState: "snapshot",
    };
  }

  function retainProfileSnapshotIntent(): void {
    desiredDurableCondition = {
      ...desiredDurableCondition,
      profiles: "snapshot",
    };
  }

  function retainActiveWriteOutcome(outcome: PersistenceWriteOutcome): void {
    updateDurabilityStatus({
      ...durabilityStatus,
      activeState: mapWriteOutcomeToDurability(outcome),
    });
  }

  function retainProfileWriteOutcome(outcome: PersistenceWriteOutcome): void {
    if (outcome.status === "persisted") {
      transitionProfileIngress({
        status: "accepted",
        quarantinedEntryCount: quarantinedProfiles.length,
      });
    }

    updateDurabilityStatus({
      ...durabilityStatus,
      profiles: mapWriteOutcomeToDurability(outcome),
    });
  }

  function isActiveCheckpointProtected(): boolean {
    return activeLocalIngressStatus.status === "recoveryRequired";
  }

  function persistActiveState(): ActivePersistenceOutcome {
    if (isActiveCheckpointProtected()) {
      return { status: "blocked", reason: "activeLocalRecovery" };
    }

    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);
    return persistence;
  }

  function removeActiveState(): ActiveRemovalOutcome {
    if (isActiveCheckpointProtected()) {
      return { status: "blocked", reason: "activeLocalRecovery" };
    }

    return clearPersistedState();
  }

  function getRetryIneligibilityReason(
    status: SurfaceDurabilityStatus,
  ): Extract<DurabilityRetryResult, { status: "notAttempted" }>["reason"] | undefined {
    switch (status) {
      case "unknown":
        return "unknown";
      case "durable":
        return "alreadyDurable";
      case "serializationFailure":
        return "serializationFailure";
      case "unavailable":
      case "storageFailure":
        return undefined;
    }
  }

  function retryActivePersistence(): DurabilityRetryResult {
    if (isActiveCheckpointProtected()) {
      return { status: "notAttempted", reason: "recoveryProtected" };
    }

    const reason = getRetryIneligibilityReason(durabilityStatus.activeState);

    if (reason) {
      return { status: "notAttempted", reason };
    }

    if (desiredDurableCondition.activeState === "snapshot") {
      const persistence = persistState(state);

      retainActiveWriteOutcome(persistence);
      return { status: "attempted", desiredCondition: "snapshot", persistence };
    }

    const persistence = clearPersistedState();

    updateDurabilityStatus({
      ...durabilityStatus,
      activeState: mapRemovalOutcomeToDurability(persistence),
    });
    return { status: "attempted", desiredCondition: "absent", persistence };
  }

  function recheckProtectedActiveSource(): "matches" | "sourceUnreadable" | "sourceChanged" {
    const currentSource = readActiveLocalSource(protectedActiveSourceKey ?? DAYFRAME_STORAGE_KEY);

    if (currentSource.status === "unreadable") {
      return "sourceUnreadable";
    }

    if (protectedActiveSource === undefined || currentSource.raw !== protectedActiveSource) {
      return "sourceChanged";
    }

    return "matches";
  }

  function replaceProtectedActiveCheckpointWithCurrentState(): ActiveLocalReplacementRecoveryResult {
    if (!isActiveCheckpointProtected()) {
      return { status: "notAttempted", reason: "notRecoveryRequired" };
    }

    const authoredSetup = getAuthoredSetup(state);
    const validation = validateDayFrameAuthoredSetup(authoredSetup);

    if (validation.status === "invalid") {
      return {
        status: "notAttempted",
        reason: "invalidReplacement",
        validation: cloneInvalidValidation(validation),
      };
    }

    const sourceRecheck = recheckProtectedActiveSource();

    if (sourceRecheck !== "matches") {
      return { status: "notAttempted", reason: sourceRecheck };
    }

    retainActiveSnapshotIntent();
    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);

    if (persistence.status !== "persisted") {
      return { status: "notResolved", resolution: "replaceWithCurrentState", persistence };
    }
    const verified = readActiveLocalSource(DAYFRAME_ACTIVE_V2_STORAGE_KEY);
    if (verified.status !== "readable" || verified.raw === null) {
      const verificationFailure = { status: "storageFailure" } as const;
      retainActiveWriteOutcome(verificationFailure);
      return {
        status: "notResolved",
        resolution: "replaceWithCurrentState",
        persistence: verificationFailure,
      };
    }
    try {
      const reread = validateActiveV2(JSON.parse(verified.raw) as unknown);
      if (JSON.stringify(reread.data) !== JSON.stringify(getActiveSetup(state))) {
        throw new RangeError("Recovery replacement verification mismatch.");
      }
    } catch {
      const verificationFailure = { status: "storageFailure" } as const;
      retainActiveWriteOutcome(verificationFailure);
      return {
        status: "notResolved",
        resolution: "replaceWithCurrentState",
        persistence: verificationFailure,
      };
    }

    protectedActiveSource = undefined;
    protectedActiveSourceKey = undefined;
    transitionActiveLocalIngress({
      status: "accepted",
      advisories: validation.advisories.map((advisory) => ({ ...advisory })),
    });

    return {
      status: "resolved",
      resolution: "replaceWithCurrentState",
      persistence,
      ingress: getActiveLocalIngressStatus() as Extract<
        ActiveLocalIngressStatus,
        { status: "accepted" }
      >,
    };
  }

  function abandonProtectedActiveCheckpointAndReset(): ActiveLocalAbandonmentRecoveryResult {
    if (!isActiveCheckpointProtected()) {
      return { status: "notAttempted", reason: "notRecoveryRequired" };
    }

    const sourceRecheck = recheckProtectedActiveSource();

    if (sourceRecheck !== "matches") {
      return { status: "notAttempted", reason: sourceRecheck };
    }

    desiredDurableCondition = { ...desiredDurableCondition, activeState: "absent" };
    const persistence = clearPersistedState();

    updateDurabilityStatus({
      ...durabilityStatus,
      activeState: mapRemovalOutcomeToDurability(persistence),
    });

    if (persistence.status !== "removed") {
      return { status: "notResolved", resolution: "abandonAndReset", persistence };
    }

    const savedProfiles = cloneSavedProfiles(state.savedProfiles);
    state = { ...createInitialDayFrameState(), savedProfiles };
    protectedActiveSource = undefined;
    protectedActiveSourceKey = undefined;
    transitionActiveLocalIngress({ status: "noSource", reason: "resolvedByAbandonment" });

    return {
      status: "resolved",
      resolution: "abandonAndReset",
      persistence,
      state: notify(),
      ingress: getActiveLocalIngressStatus() as Extract<
        ActiveLocalIngressStatus,
        { status: "noSource" }
      >,
    };
  }

  function retryProfilePersistence(): DurabilityRetryResult {
    if (profileIngressStatus.status === "recoveryRequired") {
      return { status: "notAttempted", reason: "recoveryProtected" };
    }
    const reason = getRetryIneligibilityReason(durabilityStatus.profiles);

    if (reason) {
      return { status: "notAttempted", reason };
    }

    if (desiredDurableCondition.profiles === "snapshot") {
      const persistence = persistProfiles(state.savedProfiles, quarantinedProfiles);

      retainProfileWriteOutcome(persistence);
      return { status: "attempted", desiredCondition: "snapshot", persistence };
    }

    const persistence = clearPersistedProfiles();

    updateDurabilityStatus({
      ...durabilityStatus,
      profiles: mapRemovalOutcomeToDurability(persistence),
    });
    return { status: "attempted", desiredCondition: "absent", persistence };
  }

  function recheckProtectedProfileSource():
    | "unchanged"
    | "sourceChanged"
    | "sourceUnreadable"
    | "noProtectedSource" {
    if (profileIngressStatus.status !== "recoveryRequired") return "noProtectedSource";
    if (protectedProfileSource === undefined || protectedProfileSourceKey === undefined) {
      return "sourceUnreadable";
    }
    try {
      const storage = getStorage();
      if (!storage) return "sourceUnreadable";
      return storage.getItem(protectedProfileSourceKey) === protectedProfileSource
        ? "unchanged"
        : "sourceChanged";
    } catch {
      return "sourceUnreadable";
    }
  }

  function writeVerifiedProfileCollection(
    profiles: DayFrameSavedProfile[],
    quarantine: unknown[],
  ): PersistenceWriteOutcome {
    let serialized: string;
    try {
      const envelope = createDayFrameProfilesStorageV2(profiles, quarantine);
      validateDayFrameProfilesStorageV2(envelope);
      serialized = JSON.stringify(envelope);
    } catch {
      return { status: "serializationFailure" };
    }
    let storage: StorageLike | undefined;
    try {
      storage = getStorage();
    } catch {
      return { status: "storageFailure" };
    }
    if (!storage) return { status: "unavailable" };
    try {
      storage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, serialized);
      const reread = storage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY);
      if (reread !== serialized) return { status: "storageFailure" };
      validateDayFrameProfilesStorageV2(JSON.parse(reread) as unknown);
      storage.setItem(DAYFRAME_PROFILES_V2_ESTABLISHED_KEY, "1");
      return { status: "persisted" };
    } catch {
      return { status: "storageFailure" };
    }
  }

  function replaceProtectedProfileCheckpointWithCurrentProfiles(): ProfileProtectedRecoveryResult {
    const recheck = recheckProtectedProfileSource();
    if (recheck !== "unchanged") return { status: "notAttempted", reason: recheck };
    const persistence = writeVerifiedProfileCollection(state.savedProfiles, quarantinedProfiles);
    retainProfileSnapshotIntent();
    retainProfileWriteOutcome(persistence);
    if (persistence.status !== "persisted") {
      return { status: "notResolved", action: "replace", persistence };
    }
    protectedProfileSource = undefined;
    protectedProfileSourceKey = undefined;
    return { status: "resolved", action: "replace", persistence };
  }

  function abandonProtectedProfileCheckpoint(): ProfileProtectedRecoveryResult {
    const recheck = recheckProtectedProfileSource();
    if (recheck !== "unchanged") return { status: "notAttempted", reason: recheck };
    const persistence = writeVerifiedProfileCollection([], []);
    retainProfileSnapshotIntent();
    if (persistence.status !== "persisted") {
      retainProfileWriteOutcome(persistence);
      return { status: "notResolved", action: "abandon", persistence };
    }
    state = { ...state, savedProfiles: [] };
    quarantinedProfiles = [];
    retainProfileWriteOutcome(persistence);
    protectedProfileSource = undefined;
    protectedProfileSourceKey = undefined;
    notify();
    return { status: "resolved", action: "abandon", persistence };
  }

  function removeQuarantinedProfile(quarantineId: string): QuarantineRemovalResult {
    if (profileIngressStatus.status === "recoveryRequired") {
      return { status: "notAttempted", reason: "profileRecovery" };
    }
    const index = getQuarantinedProfiles().findIndex(
      (entry) => entry.quarantineId === quarantineId,
    );
    if (index === -1) return { status: "notAttempted", reason: "missingEntry" };
    quarantinedProfiles = quarantinedProfiles.filter(
      (_, candidateIndex) => candidateIndex !== index,
    );
    retainProfileSnapshotIntent();
    const persistence = persistProfiles(state.savedProfiles, quarantinedProfiles);
    retainProfileWriteOutcome(persistence);
    if (persistence.status !== "persisted") {
      transitionProfileIngress({
        status: "accepted",
        quarantinedEntryCount: quarantinedProfiles.length,
      });
    }
    notify();
    return {
      status: "removed",
      quarantineId,
      persistence,
      remainingCount: quarantinedProfiles.length,
    };
  }

  function subscribe(listener: (state: DayFrameState) => void): () => void {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function commitAuthoredSetup(authoredSetup: CommitAuthoredSetupInput): StoreMutationResult {
    const candidate = buildAuthoredCandidate(state, authoredSetup);
    const rejection = getValidationRejection(candidate);

    if (rejection) {
      return rejection;
    }

    const activeCandidate = instantiateActiveSetup(candidate, allocateIncarnation);
    state = {
      ...state,
      schedulingPreferences: {
        ...authoredSetup.schedulingPreferences,
      },
      previewRange: {
        ...authoredSetup.previewRange,
      },
      shiftDefinitions: activeCandidate.shiftDefinitions,
      shiftCycles: activeCandidate.shiftCycles,
      blockTemplates: activeCandidate.blockTemplates,
      blockRecurrences: activeCandidate.blockRecurrences,
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistActiveState();

    return { status: "applied", state: notify(), persistence };
  }

  function commitAuthoredSetupTransaction(
    transaction: CommitAuthoredSetupTransactionInput,
  ): StoreMutationResult {
    validateSetupLifecycleTransaction(
      projectActiveToPattern(getActiveSetup(state)),
      buildAuthoredCandidate(state, transaction.authoredSetup),
      transaction.lifecycle.operations,
    );
    const prior = getActiveSetup(state);
    const candidate = buildAuthoredCandidate(state, transaction.authoredSetup);
    const rejection = getValidationRejection(candidate);
    if (rejection) return rejection;
    const active = instantiateActiveSetup(candidate, allocateIncarnation);
    preserveUpdatedIncarnations(active, prior, transaction.lifecycle.operations);
    state = {
      ...state,
      schedulingPreferences: active.schedulingPreferences,
      previewRange: active.previewRange,
      shiftDefinitions: active.shiftDefinitions,
      shiftCycles: active.shiftCycles,
      blockTemplates: active.blockTemplates,
      blockRecurrences: active.blockRecurrences,
      preview: markPreviewStale(state.preview),
    };
    retainActiveSnapshotIntent();
    const persistence = persistActiveState();
    return { status: "applied", state: notify(), persistence };
  }

  function setSchedulingPreferences(
    schedulingPreferences: Partial<DayFrameSchedulingPreferences>,
  ): StoreMutationResult {
    const candidate = buildAuthoredCandidate(state, {
      schedulingPreferences: {
        ...state.schedulingPreferences,
        ...schedulingPreferences,
      },
    });
    const rejection = getValidationRejection(candidate);

    if (rejection) {
      return rejection;
    }

    state = {
      ...state,
      schedulingPreferences: {
        ...state.schedulingPreferences,
        ...schedulingPreferences,
      },
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistActiveState();

    return { status: "applied", state: notify(), persistence };
  }

  function setPreviewRange(previewRange: DayFramePreviewRange): StoreMutationResult {
    const candidate = buildAuthoredCandidate(state, { previewRange });
    const rejection = getValidationRejection(candidate);

    if (rejection) {
      return rejection;
    }

    state = {
      ...state,
      previewRange: {
        ...previewRange,
      },
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistActiveState();

    return { status: "applied", state: notify(), persistence };
  }

  function setShiftDefinitions(
    shiftDefinitions: DayFrameAuthoredPattern["shiftDefinitions"],
  ): StoreMutationResult {
    const candidate = buildAuthoredCandidate(state, { shiftDefinitions });
    const rejection = getValidationRejection(candidate);

    if (rejection) {
      return rejection;
    }

    state = {
      ...state,
      shiftDefinitions: instantiateActiveSetup(candidate, allocateIncarnation).shiftDefinitions,
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistActiveState();

    return { status: "applied", state: notify(), persistence };
  }

  function setShiftCycles(
    shiftCycles: DayFrameAuthoredPattern["shiftCycles"],
  ): StoreMutationResult {
    const candidate = buildAuthoredCandidate(state, { shiftCycles });
    const rejection = getValidationRejection(candidate);

    if (rejection) {
      return rejection;
    }

    state = {
      ...state,
      shiftCycles: instantiateActiveSetup(candidate, allocateIncarnation).shiftCycles,
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistActiveState();

    return { status: "applied", state: notify(), persistence };
  }

  function setBlockTemplates(
    blockTemplates: DayFrameAuthoredPattern["blockTemplates"],
  ): StoreMutationResult {
    const candidate = buildAuthoredCandidate(state, { blockTemplates });
    const rejection = getValidationRejection(candidate);

    if (rejection) {
      return rejection;
    }

    state = {
      ...state,
      blockTemplates: instantiateActiveSetup(candidate, allocateIncarnation).blockTemplates,
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistActiveState();

    return { status: "applied", state: notify(), persistence };
  }

  function setBlockRecurrences(
    blockRecurrences: DayFrameAuthoredPattern["blockRecurrences"],
  ): StoreMutationResult {
    const candidate = buildAuthoredCandidate(state, { blockRecurrences });
    const rejection = getValidationRejection(candidate);

    if (rejection) {
      return rejection;
    }

    state = {
      ...state,
      blockRecurrences: instantiateActiveSetup(candidate, allocateIncarnation).blockRecurrences,
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistActiveState();

    return { status: "applied", state: notify(), persistence };
  }

  function setManualEvents(manualEvents: ManualCalendarEvent[]): StoreMutationResult {
    const candidate = buildAuthoredCandidate(state, { manualEvents });
    const activeEvents = instantiateActiveSetup(candidate, allocateIncarnation).manualEvents;
    return applyManualEvents(activeEvents);
  }

  function applyManualEvents(activeEvents: DayFrameState["manualEvents"]): StoreMutationResult {
    const candidate = buildAuthoredCandidate(state, { manualEvents: activeEvents });
    const rejection = getValidationRejection(candidate);

    if (rejection) {
      return rejection;
    }

    state = {
      ...state,
      manualEvents: cloneManualEvents(activeEvents),
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistActiveState();

    return { status: "applied", state: notify(), persistence };
  }

  function mutateManualEvent(mutation: ManualEventLifecycleMutation): StoreMutationResult {
    const currentIndex =
      mutation.operation === "delete"
        ? state.manualEvents.findIndex((event) => event.id === mutation.sourceId)
        : state.manualEvents.findIndex((event) => event.id === mutation.event.id);

    if (mutation.operation === "create") {
      if (currentIndex !== -1) {
        throw new RangeError("Cannot create a manual event whose source ID is already active.");
      }
      return applyManualEvents([
        ...state.manualEvents,
        { ...mutation.event, incarnationId: allocateIncarnation() },
      ]);
    }

    if (mutation.operation === "update") {
      if (currentIndex === -1) {
        throw new RangeError("Cannot update a missing manual event.");
      }
      return applyManualEvents(
        state.manualEvents.map((event, index) =>
          index === currentIndex
            ? { ...mutation.event, incarnationId: event.incarnationId }
            : event,
        ),
      );
    }

    if (mutation.operation === "replace") {
      return applyManualEvents(
        currentIndex === -1
          ? [...state.manualEvents, { ...mutation.event, incarnationId: allocateIncarnation() }]
          : state.manualEvents.map((event, index) =>
              index === currentIndex
                ? { ...mutation.event, incarnationId: allocateIncarnation() }
                : event,
            ),
      );
    }

    if (currentIndex === -1) {
      throw new RangeError("Cannot delete a missing manual event.");
    }
    return applyManualEvents(state.manualEvents.filter((_, index) => index !== currentIndex));
  }

  function saveProfile(input: { name: string; savedAt: string }): ProfileMutationResult {
    const trimmedName = input.name.trim();

    if (!trimmedName) {
      throw new RangeError("Profile name is required.");
    }
    if (profileIngressStatus.status === "recoveryRequired") {
      return {
        status: "blocked",
        reason: "profileRecovery",
        state: getState(),
        persistence: { status: "notAttempted", reason: "profileRecovery" },
      };
    }

    const existingProfile = state.savedProfiles.find((profile) => profile.name === trimmedName);
    const nextProfile = createDayFrameSavedProfile({
      id: existingProfile?.id ?? createProfileId(trimmedName),
      name: trimmedName,
      savedAt: input.savedAt,
      data: getAuthoredSetup(state),
    });

    state = {
      ...state,
      savedProfiles: existingProfile
        ? state.savedProfiles.map((profile) =>
            profile.id === existingProfile.id ? nextProfile : profile,
          )
        : [...state.savedProfiles, nextProfile],
    };

    retainProfileSnapshotIntent();
    const persistence = persistProfiles(state.savedProfiles, quarantinedProfiles);
    retainProfileWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function loadProfile(profileId: string): ProfileLoadResult {
    const profile = state.savedProfiles.find((currentProfile) => currentProfile.id === profileId);

    if (!profile) {
      throw new RangeError("Cannot load a missing saved profile.");
    }

    const clonedProfileData = cloneDayFrameAuthoredSetup(profile.data);
    const validation = validateDayFrameAuthoredSetup(clonedProfileData);

    if (validation.status === "invalid") {
      return {
        status: "recoveryRequired",
        reason: "invalidAuthoredState",
        validation,
      };
    }

    let activated: DayFrameState;
    try {
      activated = instantiateState(clonedProfileData, allocateIncarnation);
    } catch {
      return { status: "activationFailed", reason: "allocationFailure" };
    }

    state = {
      ...activated,
      savedProfiles: cloneSavedProfiles(state.savedProfiles),
      preview: null,
    };

    retainActiveSnapshotIntent();
    const persistence = persistActiveState();

    return {
      status: "loaded",
      state: notify(),
      persistence,
      advisories: validation.advisories,
    };
  }

  function deleteProfile(profileId: string): ProfileMutationResult {
    if (profileIngressStatus.status === "recoveryRequired") {
      return {
        status: "blocked",
        reason: "profileRecovery",
        state: getState(),
        persistence: { status: "notAttempted", reason: "profileRecovery" },
      };
    }
    state = {
      ...state,
      savedProfiles: state.savedProfiles.filter((profile) => profile.id !== profileId),
    };

    retainProfileSnapshotIntent();
    const persistence = persistProfiles(state.savedProfiles, quarantinedProfiles);
    retainProfileWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  async function clearLocalData(): Promise<ClearLocalDataResult> {
    const begun = authorityTransaction.begin("internalReplacement");
    if (begun.status !== "begun")
      throw new DayFrameMutationAdmissionError("authorityTransactionActive");
    state = createInitialDayFrameState();
    desiredDurableCondition = {
      activeState: "absent",
      profiles: "absent",
    };
    const activeState = removeActiveState();
    const profiles = clearPersistedProfiles();
    const planDecisions = planDecisionSurface.clearPlanDecisions();
    const executionHistoryPromise = executionHistorySurface.clearExecutionHistory();
    const historicalPlanPromise = historicalPlanSurface.clearHistoricalPlan();
    const goalsPromise = goalSurface.clearGoals();
    const measurementDefinitionsPromise =
      measurementDefinitionSurface.clearMeasurementDefinitions();
    const progressObservationsPromise = progressObservationSurface.clearProgressObservations();
    const goalStructurePromise = goalStructureSurface.clearGoalStructure();
    const goalPlanningPromise = goalPlanningSurface.clearGoalPlanning();
    const compositionPromise = compositionSurface.clearCompositionAuthority();
    const proposalsPromise = proposalSurface.clearProposalAuthority();
    const realizationsPromise = realizationSurface.clearRealizationAuthority();
    if (profiles.status === "removed") {
      transitionProfileIngress({ status: "noSource", reason: "missing" });
      quarantinedProfiles = [];
      protectedProfileSource = undefined;
      protectedProfileSourceKey = undefined;
    }
    updateDurabilityStatus({
      activeState:
        activeState.status === "blocked"
          ? durabilityStatus.activeState
          : mapRemovalOutcomeToDurability(activeState),
      profiles: mapRemovalOutcomeToDurability(profiles),
    });
    const [
      executionHistory,
      historicalRaw,
      goals,
      measurementDefinitions,
      progressObservations,
      goalStructure,
      goalPlanning,
      composition,
      proposals,
      realizations,
    ] = await Promise.all([
      executionHistoryPromise,
      historicalPlanPromise,
      goalsPromise,
      measurementDefinitionsPromise,
      progressObservationsPromise,
      goalStructurePromise,
      goalPlanningPromise,
      compositionPromise,
      proposalsPromise,
      realizationsPromise,
    ]);
    const historicalPlan: PersistenceRemovalOutcome =
      historicalRaw.status === "success" ? { status: "removed" } : { status: "storageFailure" };
    const authorities = {
      active: activeState,
      profiles,
      planDecisions,
      executionHistory,
      historicalPlan,
      goals,
      measurementDefinitions,
      progressObservations,
      goalStructure,
      goalPlanning,
      composition,
      proposals,
      realizations,
    } satisfies FullClearAuthorityResults;
    const successes = Object.values(authorities).filter(
      (value) => value.status === "removed",
    ).length;
    const status =
      successes === Object.keys(authorities).length
        ? ("cleared" as const)
        : successes === 0
          ? ("failed" as const)
          : ("partiallyCleared" as const);
    const committed = authorityTransaction.commit();
    if (committed.status !== "committed")
      throw new Error("Full-clear authority notification commit failed.");
    const snapshot = notify();
    return {
      status,
      authorities: structuredClone(authorities),
      previewCleared: true,
      state: snapshot,
      activeState,
      profiles,
      planDecisions,
      executionHistory,
      historicalPlan,
      goals,
      measurementDefinitions,
      progressObservations,
      goalStructure,
      goalPlanning,
      composition,
      proposals,
      realizations,
      durability: status === "failed" ? "notCleared" : status,
    };
  }

  function exportBackup(exportedAt: string) {
    return createDayFrameBackupV2(getActiveSetup(state), exportedAt);
  }

  async function exportBackupV3(
    exportedAt: string,
    allowGoals = false,
    allowMeasurementDefinitions = false,
  ): Promise<BackupV3ExportResult> {
    if (!allowGoals && goalSurface.listGoals().length)
      return {
        status: "exportFailure",
        reason: "Backup V3 cannot represent Goal authority; export Backup V4.",
      };
    if (
      !allowMeasurementDefinitions &&
      measurementDefinitionSurface.exportMeasurementDefinitionAuthority().definitions.length
    )
      return {
        status: "exportFailure",
        reason: "Backup V3 cannot represent Measurement Definition authority; export Backup V5.",
      };
    if (readiness.status !== "ready") return { status: "initializing" };
    if (
      !restoreComposition ||
      authorityTransaction.getState().status !== "inactive" ||
      restoreComposition.coordinator.getStatus() !== "idle"
    )
      return { status: "restoreBusy" };
    if (activeLocalIngressStatus.status === "recoveryRequired")
      return { status: "protectedSurface", surface: "active" };
    if (profileIngressStatus.status === "recoveryRequired")
      return { status: "protectedSurface", surface: "profiles" };
    if (planDecisionSurface.getPlanDecisionIngressStatus().status === "recoveryRequired")
      return { status: "protectedSurface", surface: "planDecisions" };
    if (executionHistorySurface.getExecutionHistoryIngressStatus().status === "recoveryRequired")
      return { status: "protectedSurface", surface: "executionHistory" };
    if (historicalPlanSurface.getStatus().status === "protected")
      return { status: "protectedSurface", surface: "historicalPlan" };
    try {
      const historical = await historicalPlanSurface.exportHistoricalPlan();
      if (historical.status !== "exported")
        return historical.status === "protected"
          ? { status: "protectedSurface", surface: "historicalPlan" }
          : { status: "exportFailure", reason: "historicalPlanUnavailable" };
      const backup = createDayFrameBackupV3(
        {
          active: { surfaceVersion: 2, data: getActiveSetup(state) },
          profiles: profilesV2BackupData(state.savedProfiles, quarantinedProfiles),
          planDecisions: {
            surfaceVersion: 1,
            decisions: planDecisionSurface.getPlanDecisions(),
            quarantinedDecisions: planDecisionSurface.getQuarantinedPlanDecisions(),
          },
          executionHistory: executionHistorySurface.exportExecutionHistoryEnvelope(),
          historicalPlan: { surfaceVersion: 1, batches: historical.batches },
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup: structuredClone(backup),
        semanticFingerprint: backupV3SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status:
          error instanceof DayFrameBackupV3ValidationError ? "validationFailure" : "exportFailure",
        reason: error instanceof Error ? error.message : "Backup V3 export failed.",
      };
    }
  }

  async function importBackupV3(backupValue: unknown): Promise<BackupV3ImportResult> {
    if (!restoreComposition) return { status: "persistenceFailure" };
    if (readiness.status !== "ready") return { status: "initializing" };
    let backup;
    try {
      backup = validateDayFrameBackupV3(structuredClone(backupValue));
    } catch {
      return { status: "invalidBackup" };
    }
    const target = {
      active: createActiveV2(backup.data.active.data),
      profiles: createDayFrameProfilesStorageV2(
        backup.data.profiles.profiles,
        backup.data.profiles.quarantinedProfiles,
      ),
      planDecisions: {
        app: "DayFrame" as const,
        surface: "planDecisions" as const,
        version: 1 as const,
        decisions: [
          ...backup.data.planDecisions.decisions,
          ...backup.data.planDecisions.quarantinedDecisions.map((entry) =>
            structuredClone(entry.raw),
          ),
        ],
      },
      executionHistory: await executionRestorePayload(backup.data.executionHistory),
      historicalPlan: await historicalRestorePayload(backup.data.historicalPlan.batches),
      goals: { version: 1 as const, goals: [] },
      measurementDefinitions: { version: 1 as const, definitions: [] },
      progressObservations: { version: 1 as const, observations: [] },
      goalStructure: emptyGoalStructureAuthority(),
      goalPlanning: emptyGoalPlanningAuthority(),
      composition: emptyCompositionAuthority(),
      proposals: emptyProposalAuthority(),
    };
    const result = await restoreComposition.coordinator.restore(target);
    if (result.status === "completed")
      return { status: "restoredV3", semanticFingerprint: backupV3SemanticFingerprint(backup) };
    if (result.status === "busy") return { status: "restoreBusy" };
    if (result.status === "participantNotReady")
      return {
        status: "initializing",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "participantProtected")
      return {
        status: "protectedCurrentState",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "invalidTarget")
      return {
        status: "invalidBackup",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "stagingFailed") return { status: "stagingFailure" };
    if (result.status === "sourceChanged") return { status: "sourceChanged" };
    if (result.status === "rolledBack") return { status: "rollbackCompleted" };
    if (result.status === "rollbackFailed" || result.status === "recoveryRequired")
      return { status: "recoveryRequired" };
    return { status: "persistenceFailure" };
  }

  async function exportBackupV4(
    exportedAt: string,
    allowMeasurementDefinitions = false,
  ): Promise<BackupV4ExportResult> {
    if (
      !allowMeasurementDefinitions &&
      measurementDefinitionSurface.exportMeasurementDefinitionAuthority().definitions.length
    )
      return {
        status: "exportFailure",
        reason: "Backup V4 cannot represent Measurement Definition authority; export Backup V5.",
      };
    const legacy = await exportBackupV3(exportedAt, true, true);
    if (legacy.status !== "exported") return legacy as BackupV4ExportResult;
    if (goalSurface.getGoalIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "goals" } as BackupV4ExportResult;
    try {
      const backup = createDayFrameBackupV4(
        { ...legacy.backup.data, goals: goalSurface.exportAuthority() },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV4SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V4 export failed.",
      };
    }
  }
  async function importBackupV4(value: unknown): Promise<BackupV4ImportResult> {
    let backup;
    try {
      backup = validateDayFrameBackupV4(value);
    } catch {
      return { status: "invalidBackup" };
    }
    if (!restoreComposition) return { status: "persistenceFailure" };
    const target = {
      active: createActiveV2(backup.data.active.data),
      profiles: createDayFrameProfilesStorageV2(
        backup.data.profiles.profiles,
        backup.data.profiles.quarantinedProfiles,
      ),
      planDecisions: {
        app: "DayFrame" as const,
        surface: "planDecisions" as const,
        version: 1 as const,
        decisions: [
          ...backup.data.planDecisions.decisions,
          ...backup.data.planDecisions.quarantinedDecisions.map((entry) =>
            structuredClone(entry.raw),
          ),
        ],
      },
      executionHistory: await executionRestorePayload(backup.data.executionHistory),
      historicalPlan: await historicalRestorePayload(backup.data.historicalPlan.batches),
      goals: backup.data.goals,
      measurementDefinitions: { version: 1 as const, definitions: [] },
      progressObservations: { version: 1 as const, observations: [] },
      goalStructure: emptyGoalStructureAuthority(),
      goalPlanning: emptyGoalPlanningAuthority(),
      composition: emptyCompositionAuthority(),
      proposals: emptyProposalAuthority(),
    };
    const result = await restoreComposition.coordinator.restore(target);
    if (result.status === "completed")
      return { status: "restoredV4", semanticFingerprint: backupV4SemanticFingerprint(backup) };
    if (result.status === "busy") return { status: "restoreBusy" };
    if (result.status === "participantNotReady")
      return {
        status: "initializing",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "participantProtected")
      return {
        status: "protectedCurrentState",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "invalidTarget")
      return {
        status: "invalidBackup",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "rolledBack") return { status: "rollbackCompleted" };
    if (result.status === "recoveryRequired" || result.status === "rollbackFailed")
      return { status: "recoveryRequired" };
    return { status: "persistenceFailure" };
  }

  async function importBackupFile(backupValue: unknown) {
    if (
      typeof backupValue === "object" &&
      backupValue !== null &&
      "version" in backupValue &&
      (backupValue as { version?: unknown }).version === 12
    )
      return importBackupV12(backupValue);
    if (
      typeof backupValue === "object" &&
      backupValue !== null &&
      "version" in backupValue &&
      (backupValue as { version?: unknown }).version === 11
    )
      return importBackupV11(backupValue);
    if (
      typeof backupValue === "object" &&
      backupValue !== null &&
      "version" in backupValue &&
      (backupValue as { version?: unknown }).version === 10
    )
      return importBackupV10(backupValue);
    if (
      typeof backupValue === "object" &&
      backupValue !== null &&
      "version" in backupValue &&
      (backupValue as { version?: unknown }).version === 9
    )
      return importBackupV9(backupValue);
    if (
      typeof backupValue === "object" &&
      backupValue !== null &&
      "version" in backupValue &&
      (backupValue as { version?: unknown }).version === 8
    )
      return importBackupV8(backupValue);
    if (
      typeof backupValue === "object" &&
      backupValue !== null &&
      "version" in backupValue &&
      (backupValue as { version?: unknown }).version === 7
    )
      return importBackupV7(backupValue);
    if (
      typeof backupValue === "object" &&
      backupValue !== null &&
      "version" in backupValue &&
      (backupValue as { version?: unknown }).version === 6
    )
      return importBackupV6(backupValue);
    if (
      typeof backupValue === "object" &&
      backupValue !== null &&
      "version" in backupValue &&
      (backupValue as { version?: unknown }).version === 5
    )
      return importBackupV5(backupValue);
    let validated;
    try {
      validated = validateDayFrameBackup(backupValue);
    } catch (error) {
      return {
        status: "rejected" as const,
        reason:
          error instanceof DayFrameBackupValidationError
            ? error.category
            : ("envelopeValidationFailure" as const),
      };
    }
    return validated.version === 4
      ? importBackupV4(validated)
      : validated.version === 3
        ? importBackupV3(validated)
        : importBackup(validated);
  }

  async function exportBackupV5(
    exportedAt: string,
    allowProgressObservations = false,
  ): Promise<BackupV5ExportResult> {
    if (
      !allowProgressObservations &&
      progressObservationSurface.exportProgressObservationAuthority().observations.length
    )
      return {
        status: "exportFailure",
        reason: "Backup V5 cannot represent Progress Observation authority; export Backup V6.",
      };
    const legacy = await exportBackupV4(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    if (measurementDefinitionSurface.getMeasurementDefinitionIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "measurementDefinitions" };
    try {
      const backup = createDayFrameBackupV5(
        {
          ...legacy.backup.data,
          measurementDefinitions:
            measurementDefinitionSurface.exportMeasurementDefinitionAuthority(),
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV5SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V5 export failed.",
      };
    }
  }
  async function importBackupV5(value: unknown): Promise<BackupV5ImportResult> {
    let backup;
    try {
      backup = validateDayFrameBackupV5(value);
    } catch {
      return { status: "invalidBackup" };
    }
    if (!restoreComposition) return { status: "persistenceFailure" };
    const goals = new Set(backup.data.goals.goals.map((goal) => goal.id));
    if (
      validateMeasurementDefinitionAuthority(backup.data.measurementDefinitions, (id) =>
        goals.has(id),
      ).status === "invalid"
    )
      return { status: "invalidBackup" };
    const target = {
      active: createActiveV2(backup.data.active.data),
      profiles: createDayFrameProfilesStorageV2(
        backup.data.profiles.profiles,
        backup.data.profiles.quarantinedProfiles,
      ),
      planDecisions: {
        app: "DayFrame" as const,
        surface: "planDecisions" as const,
        version: 1 as const,
        decisions: [
          ...backup.data.planDecisions.decisions,
          ...backup.data.planDecisions.quarantinedDecisions.map((entry) =>
            structuredClone(entry.raw),
          ),
        ],
      },
      executionHistory: await executionRestorePayload(backup.data.executionHistory),
      historicalPlan: await historicalRestorePayload(backup.data.historicalPlan.batches),
      goals: backup.data.goals,
      measurementDefinitions: backup.data.measurementDefinitions,
      progressObservations: { version: 1 as const, observations: [] },
      goalStructure: emptyGoalStructureAuthority(),
      goalPlanning: emptyGoalPlanningAuthority(),
      composition: emptyCompositionAuthority(),
      proposals: emptyProposalAuthority(),
    };
    const result = await restoreComposition.coordinator.restore(target);
    if (result.status === "completed")
      return { status: "restoredV5", semanticFingerprint: backupV5SemanticFingerprint(backup) };
    if (result.status === "busy") return { status: "restoreBusy" };
    if (result.status === "participantNotReady")
      return {
        status: "initializing",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "participantProtected")
      return {
        status: "protectedCurrentState",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "invalidTarget")
      return {
        status: "invalidBackup",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "rolledBack") return { status: "rollbackCompleted" };
    if (result.status === "recoveryRequired" || result.status === "rollbackFailed")
      return { status: "recoveryRequired" };
    return { status: "persistenceFailure" };
  }

  async function exportBackupV6(
    exportedAt: string,
    allowGoalStructure = false,
  ): Promise<BackupV6ExportResult> {
    const structure = goalStructureSurface.exportGoalStructureAuthority();
    if (!allowGoalStructure && (structure.relationships.length || structure.milestones.length))
      return {
        status: "exportFailure",
        reason: "Backup V6 cannot represent Goal Structure authority; export Backup V7.",
      };
    const legacy = await exportBackupV5(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    if (progressObservationSurface.getProgressObservationIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "progressObservations" };
    try {
      const backup = createDayFrameBackupV6(
        {
          ...legacy.backup.data,
          progressObservations: progressObservationSurface.exportProgressObservationAuthority(),
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV6SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V6 export failed.",
      };
    }
  }
  async function importBackupV6(value: unknown): Promise<BackupV6ImportResult> {
    let backup;
    try {
      backup = validateDayFrameBackupV6(value);
    } catch {
      return { status: "invalidBackup" };
    }
    if (!restoreComposition) return { status: "persistenceFailure" };
    const goals = new Set(backup.data.goals.goals.map((goal) => goal.id)),
      definitions = new Map(
        backup.data.measurementDefinitions.definitions.map((item) => [
          `${item.id}|${item.revision}`,
          item,
        ]),
      );
    if (
      validateProgressObservationAuthority(backup.data.progressObservations, {
        goalExists: (id) => goals.has(id),
        getDefinition: (id, revision) => definitions.get(`${id}|${revision}`),
      }).status === "invalid"
    )
      return { status: "invalidBackup" };
    const target = {
      active: createActiveV2(backup.data.active.data),
      profiles: createDayFrameProfilesStorageV2(
        backup.data.profiles.profiles,
        backup.data.profiles.quarantinedProfiles,
      ),
      planDecisions: {
        app: "DayFrame" as const,
        surface: "planDecisions" as const,
        version: 1 as const,
        decisions: [
          ...backup.data.planDecisions.decisions,
          ...backup.data.planDecisions.quarantinedDecisions.map((entry) =>
            structuredClone(entry.raw),
          ),
        ],
      },
      executionHistory: await executionRestorePayload(backup.data.executionHistory),
      historicalPlan: await historicalRestorePayload(backup.data.historicalPlan.batches),
      goals: backup.data.goals,
      measurementDefinitions: backup.data.measurementDefinitions,
      progressObservations: backup.data.progressObservations,
      goalStructure: emptyGoalStructureAuthority(),
      goalPlanning: emptyGoalPlanningAuthority(),
      composition: emptyCompositionAuthority(),
      proposals: emptyProposalAuthority(),
    };
    const result = await restoreComposition.coordinator.restore(target);
    if (result.status === "completed")
      return { status: "restoredV6", semanticFingerprint: backupV6SemanticFingerprint(backup) };
    if (result.status === "busy") return { status: "restoreBusy" };
    if (result.status === "participantNotReady")
      return {
        status: "initializing",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "participantProtected")
      return {
        status: "protectedCurrentState",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "invalidTarget")
      return {
        status: "invalidBackup",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "rolledBack") return { status: "rollbackCompleted" };
    if (result.status === "recoveryRequired" || result.status === "rollbackFailed")
      return { status: "recoveryRequired" };
    return { status: "persistenceFailure" };
  }

  async function exportBackupV7(
    exportedAt: string,
    allowGoalPlanning = false,
  ): Promise<BackupV7ExportResult> {
    const planning = goalPlanningSurface.exportGoalPlanningAuthority();
    if (!allowGoalPlanning && (planning.demands.length || planning.priorities.length))
      return {
        status: "exportFailure",
        reason: "Backup V7 cannot represent Goal Demand/Priority authority; export Backup V8.",
      };
    const legacy = await exportBackupV6(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    if (goalStructureSurface.getGoalStructureIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "goalStructure" };
    try {
      const backup = createDayFrameBackupV7(
        {
          ...legacy.backup.data,
          goalStructure: goalStructureSurface.exportGoalStructureAuthority(),
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV7SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V7 export failed.",
      };
    }
  }
  async function importBackupV7(value: unknown): Promise<BackupV7ImportResult> {
    let backup;
    try {
      backup = validateDayFrameBackupV7(value);
    } catch {
      return { status: "invalidBackup" };
    }
    if (!restoreComposition) return { status: "persistenceFailure" };
    const target = {
      active: createActiveV2(backup.data.active.data),
      profiles: createDayFrameProfilesStorageV2(
        backup.data.profiles.profiles,
        backup.data.profiles.quarantinedProfiles,
      ),
      planDecisions: {
        app: "DayFrame" as const,
        surface: "planDecisions" as const,
        version: 1 as const,
        decisions: [
          ...backup.data.planDecisions.decisions,
          ...backup.data.planDecisions.quarantinedDecisions.map((entry) =>
            structuredClone(entry.raw),
          ),
        ],
      },
      executionHistory: await executionRestorePayload(backup.data.executionHistory),
      historicalPlan: await historicalRestorePayload(backup.data.historicalPlan.batches),
      goals: backup.data.goals,
      measurementDefinitions: backup.data.measurementDefinitions,
      progressObservations: backup.data.progressObservations,
      goalStructure: backup.data.goalStructure,
      goalPlanning: emptyGoalPlanningAuthority(),
      composition: emptyCompositionAuthority(),
      proposals: emptyProposalAuthority(),
    };
    const result = await restoreComposition.coordinator.restore(target);
    if (result.status === "completed")
      return { status: "restoredV7", semanticFingerprint: backupV7SemanticFingerprint(backup) };
    if (result.status === "busy") return { status: "restoreBusy" };
    if (result.status === "participantNotReady")
      return {
        status: "initializing",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "participantProtected")
      return {
        status: "protectedCurrentState",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "invalidTarget")
      return {
        status: "invalidBackup",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "rolledBack") return { status: "rollbackCompleted" };
    if (result.status === "recoveryRequired" || result.status === "rollbackFailed")
      return { status: "recoveryRequired" };
    return { status: "persistenceFailure" };
  }

  async function exportBackupV8(
    exportedAt: string,
    allowComposition = false,
    allowResourceFootprints = false,
  ): Promise<BackupV8ExportResult> {
    const { backupV8SemanticFingerprint, createDayFrameBackupV8 } = await loadBackupV8();
    const legacy = await exportBackupV7(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    if (goalPlanningSurface.getGoalPlanningIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "goalPlanning" };
    const planning = goalPlanningSurface.exportGoalPlanningAuthority();
    if (
      !allowResourceFootprints &&
      (planning.footprintSpecifications.length || planning.footprintAssociations.length)
    )
      return { status: "exportFailure", reason: "V11" };
    if (
      !allowComposition &&
      (compositionSurface.exportCompositionAuthority().relationships.length ||
        compositionSurface.exportCompositionAuthority().decisions.length)
    )
      return {
        status: "exportFailure",
        reason: "V9",
      };
    try {
      const backup = createDayFrameBackupV8(
        {
          ...legacy.backup.data,
          goalPlanning: {
            version: 1,
            demands: planning.demands,
            priorities: planning.priorities,
          },
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV8SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "Backup V8 export failed.",
      };
    }
  }
  async function importBackupV8(value: unknown): Promise<BackupV8ImportResult> {
    const { backupV8SemanticFingerprint, validateDayFrameBackupV8 } = await loadBackupV8();
    let backup;
    try {
      backup = validateDayFrameBackupV8(value);
    } catch {
      return { status: "invalidBackup" };
    }
    return restoreModernBackup(
      backup.data,
      emptyCompositionAuthority(),
      emptyProposalAuthority(),
      "restoredV8",
      backupV8SemanticFingerprint(backup),
    ) as Promise<BackupV8ImportResult>;
  }
  async function exportBackupV9(
    exportedAt: string,
    allowProposals = false,
    allowResourceFootprints = false,
  ): Promise<BackupV9ExportResult> {
    const { createDayFrameBackupV9, backupV9SemanticFingerprint } = await loadBackupV9();
    const legacy = await exportBackupV8(exportedAt, true, allowResourceFootprints);
    if (legacy.status !== "exported") return legacy;
    if (compositionSurface.getCompositionIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "composition" };
    if (!allowProposals && recordCount(proposalSurface.exportProposalAuthority()))
      return { status: "exportFailure", reason: "V10" };
    try {
      const backup = createDayFrameBackupV9(
        { ...legacy.backup.data, composition: compositionSurface.exportCompositionAuthority() },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV9SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "V9 export failed.",
      };
    }
  }
  async function importBackupV9(value: unknown): Promise<BackupV9ImportResult> {
    const { validateDayFrameBackupV9, backupV9SemanticFingerprint } = await loadBackupV9();
    let backup;
    try {
      backup = validateDayFrameBackupV9(value);
    } catch {
      return { status: "invalidBackup" };
    }
    return restoreModernBackup(
      backup.data,
      backup.data.composition,
      emptyProposalAuthority(),
      "restoredV9",
      backupV9SemanticFingerprint(backup),
    ) as Promise<BackupV9ImportResult>;
  }
  async function exportBackupV10(
    exportedAt: string,
    allowResourceFootprints = false,
  ): Promise<BackupV10ExportResult> {
    await initializeRestoreComposition();
    const { createDayFrameBackupV10, backupV10SemanticFingerprint } = await loadBackupV10();
    const legacy = await exportBackupV9(exportedAt, true, allowResourceFootprints);
    if (legacy.status !== "exported") return legacy;
    if (proposalSurface.getProposalIngressStatus().status === "protected")
      return { status: "protectedSurface", surface: "proposals" };
    if (
      !allowResourceFootprints &&
      proposalSurface
        .exportProposalAuthority()
        .acceptedAllocations.some((accepted) => accepted.version === 2)
    )
      return { status: "exportFailure", reason: "V11" };
    try {
      const backup = createDayFrameBackupV10(
        { ...legacy.backup.data, proposals: proposalSurface.exportProposalAuthority() },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV10SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "V10 export failed.",
      };
    }
  }
  async function importBackupV10(value: unknown): Promise<BackupV10ImportResult> {
    const { validateDayFrameBackupV10, backupV10SemanticFingerprint } = await loadBackupV10();
    let backup;
    try {
      backup = validateDayFrameBackupV10(value);
    } catch {
      return { status: "invalidBackup" };
    }
    return restoreModernBackup(
      backup.data,
      backup.data.composition,
      backup.data.proposals,
      "restoredV10",
      backupV10SemanticFingerprint(backup),
    ) as Promise<BackupV10ImportResult>;
  }
  async function exportBackupV11(
    exportedAt: string,
    allowRealizations = false,
  ): Promise<BackupV11ExportResult> {
    await initializeRestoreComposition();
    const { createDayFrameBackupV11, backupV11SemanticFingerprint } = await loadBackupV11();
    const legacy = await exportBackupV10(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    try {
      if (!allowRealizations) {
        const { assertBackupV11DowngradeSafe } = await loadBackupV12();
        assertBackupV11DowngradeSafe(realizationSurface.exportRealizationAuthority());
      }
      const backup = createDayFrameBackupV11(
        {
          ...legacy.backup.data,
          goalPlanning: goalPlanningSurface.exportGoalPlanningAuthority(),
          proposals: proposalSurface.exportProposalAuthority(),
        },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV11SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "V11 export failed.",
      };
    }
  }
  async function exportBackupV12(exportedAt: string): Promise<BackupV12ExportResult> {
    await initializeRestoreComposition();
    const { createDayFrameBackupV12, backupV12SemanticFingerprint } = await loadBackupV12();
    const legacy = await exportBackupV11(exportedAt, true);
    if (legacy.status !== "exported") return legacy;
    if (realizationSurface.getRealizationIngressStatus() === "protected")
      return { status: "protectedSurface", surface: "realizations" };
    try {
      const backup = createDayFrameBackupV12(
        { ...legacy.backup.data, realizations: realizationSurface.exportRealizationAuthority() },
        exportedAt,
      );
      return {
        status: "exported",
        backup,
        semanticFingerprint: backupV12SemanticFingerprint(backup),
      };
    } catch (error) {
      return {
        status: "validationFailure",
        reason: error instanceof Error ? error.message : "V12 export failed.",
      };
    }
  }
  async function importBackupV11(value: unknown): Promise<BackupV11ImportResult> {
    const { validateDayFrameBackupV11, backupV11SemanticFingerprint } = await loadBackupV11();
    let backup;
    try {
      backup = validateDayFrameBackupV11(value);
    } catch {
      return { status: "invalidBackup" };
    }
    return restoreModernBackup(
      backup.data,
      backup.data.composition,
      backup.data.proposals,
      "restoredV11",
      backupV11SemanticFingerprint(backup),
      backup.data.goalPlanning,
    ) as Promise<BackupV11ImportResult>;
  }
  async function importBackupV12(value: unknown): Promise<BackupV12ImportResult> {
    const { validateDayFrameBackupV12, backupV12SemanticFingerprint } = await loadBackupV12();
    let backup;
    try {
      backup = validateDayFrameBackupV12(value);
    } catch {
      return { status: "invalidBackup" };
    }
    return restoreModernBackup(
      backup.data,
      backup.data.composition,
      backup.data.proposals,
      "restoredV12",
      backupV12SemanticFingerprint(backup),
      backup.data.goalPlanning,
      backup.data.realizations,
    ) as Promise<BackupV12ImportResult>;
  }
  async function restoreModernBackup(
    data: Omit<import("./dayFrameBackupV8.js").DayFrameBackupV8Data, "goalPlanning"> & {
      goalPlanning: GoalPlanningAuthorityV1 | GoalPlanningAuthorityV2;
    },
    composition: CompositionAuthorityV1,
    proposals: ReturnType<typeof emptyProposalAuthority>,
    successStatus: "restoredV8" | "restoredV9" | "restoredV10" | "restoredV11" | "restoredV12",
    fingerprint: string,
    goalPlanning: GoalPlanningAuthorityV2 = data.goalPlanning.version === 1
      ? migrateGoalPlanningAuthorityV1(data.goalPlanning)
      : data.goalPlanning,
    realizations: import("../core/planning/acceptedAllocationRealization.js").RealizationAuthorityV1 = {
      version: 1,
      realizations: [],
      facts: [],
    },
  ) {
    if (!restoreComposition) return { status: "persistenceFailure" as const };
    const result = await restoreComposition.coordinator.restore({
      active: createActiveV2(data.active.data),
      profiles: createDayFrameProfilesStorageV2(
        data.profiles.profiles,
        data.profiles.quarantinedProfiles,
      ),
      planDecisions: {
        app: "DayFrame",
        surface: "planDecisions",
        version: 1,
        decisions: [
          ...data.planDecisions.decisions,
          ...data.planDecisions.quarantinedDecisions.map((entry) => structuredClone(entry.raw)),
        ],
      },
      executionHistory: await executionRestorePayload(data.executionHistory),
      historicalPlan: await historicalRestorePayload(data.historicalPlan.batches),
      goals: data.goals,
      measurementDefinitions: data.measurementDefinitions,
      progressObservations: data.progressObservations,
      goalStructure: data.goalStructure,
      goalPlanning,
      composition,
      proposals,
      realizations,
    });
    if (result.status === "completed")
      return { status: successStatus, semanticFingerprint: fingerprint };
    if (result.status === "busy") return { status: "restoreBusy" };
    if (result.status === "participantNotReady")
      return {
        status: "initializing",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "participantProtected")
      return {
        status: "protectedCurrentState",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "invalidTarget")
      return {
        status: "invalidBackup",
        ...(result.participantId ? { surface: result.participantId } : {}),
      };
    if (result.status === "rolledBack") return { status: "rollbackCompleted" };
    if (result.status === "recoveryRequired" || result.status === "rollbackFailed")
      return { status: "recoveryRequired" };
    return { status: "persistenceFailure" };
  }

  function importBackup(backup: Parameters<typeof validateDayFrameBackup>[0]): BackupImportResult {
    let validatedBackup: ReturnType<typeof validateDayFrameBackup>;
    try {
      validatedBackup = validateDayFrameBackup(backup);
    } catch (error) {
      return {
        status: "rejected",
        reason:
          error instanceof DayFrameBackupValidationError
            ? error.category
            : "envelopeValidationFailure",
      };
    }
    if (validatedBackup.version === 3 || validatedBackup.version === 4)
      return { status: "rejected", reason: "unsupportedVersion" };
    const validation = validateDayFrameAuthoredSetup(validatedBackup.data);

    if (validation.status === "invalid") {
      return { status: "rejected", reason: "authoredValidationFailure" };
    }
    if (isActiveCheckpointProtected()) {
      return { status: "rejected", reason: "activeLocalRecovery" };
    }

    let restored: ActiveDayFrameAuthoredSetup;
    try {
      restored =
        validatedBackup.version === 2
          ? cloneActiveSetup(validatedBackup.data)
          : instantiateActiveSetup(
              cloneDayFrameAuthoredSetup(validatedBackup.data),
              allocateIncarnation,
            );
    } catch {
      return {
        status: "rejected",
        reason:
          validatedBackup.version === 1 ? "allocationFailure" : "incarnationValidationFailure",
      };
    }
    state = { ...restored, savedProfiles: cloneSavedProfiles(state.savedProfiles), preview: null };

    retainActiveSnapshotIntent();
    const persistence = persistActiveState();

    return {
      status: validatedBackup.version === 2 ? "restored" : "instantiatedFromLegacy",
      state: notify(),
      persistence,
      advisories: validation.advisories,
    };
  }

  function generatePreview(input: GeneratePreviewActionInput): DayFrameState {
    if (state.shiftCycles.length === 0) {
      throw new RangeError("Cannot generate preview without shiftCycles");
    }

    const previewResult = generateSchedulePreview({
      shiftDefinitions: cloneShiftDefinitions(state.shiftDefinitions),
      shiftCycles: cloneShiftCycles(state.shiftCycles),
      blockTemplates: cloneBlockTemplates(state.blockTemplates),
      blockRecurrences: compositionSurface.filterIndependentRecurrences(
        cloneBlockRecurrences(state.blockRecurrences),
      )!,
      manualEvents: cloneManualEvents(state.manualEvents),
      planningWindowStart: new Date(input.planningWindowStart),
      planningWindowEnd: new Date(input.planningWindowEnd),
      dayBoundaryStartTime: state.schedulingPreferences.dayBoundaryStartTime,
      weekStartsOn: state.schedulingPreferences.weekStartsOn,
      generatedAt: input.generatedAt,
      planDecisions: planDecisionSurface.getPlanDecisions(),
      realizedScheduleFacts: realizationSurface.listRealizedScheduleFacts(),
    });
    const compositionResults = compositionSurface.applyCompositionToSchedule({
      previewResult,
      planningWindowStart: input.planningWindowStart,
      planningWindowEnd: input.planningWindowEnd,
      generatedAt: input.generatedAt,
    });
    if (compositionResults?.length) previewResult.compositionResults = compositionResults;
    const requestedPreviewRange = previewRangeFromLegacyInclusive(input);
    const effectivePlanningDataHorizon = resolvePlanningDataHorizon({
      operation: "previewGeneration",
      requestedRange: requestedPreviewRange,
      boundaryContext: true,
      requiredContext: realizationSurface.listRealizedScheduleFacts().map((fact) => ({
        range: {
          startUserDayDate: fact.userDayDate,
          endUserDayDateExclusive: addUserDayLabels(fact.userDayDate, 1),
        },
        reason: "realizedScheduleContext" as const,
      })),
    });
    state = {
      ...state,
      preview: {
        result: previewResult,
        rangeStartDate: input.rangeStartDate,
        rangeEndDate: input.rangeEndDate,
        planningWindowStart: new Date(input.planningWindowStart),
        planningWindowEnd: new Date(input.planningWindowEnd),
        generatedAt: input.generatedAt,
        isStale: false,
        scopeMetadata: {
          requestedPreviewRange,
          effectivePlanningDataHorizon,
          ...(input.reviewScope ? { sourceReviewScope: structuredClone(input.reviewScope) } : {}),
          canonicalRangePolicy: CANONICAL_USER_DAY_RANGE_POLICY_V1,
        },
      },
    };

    return notify();
  }

  async function publishScheduleRange(
    input: PublishScheduleRangeInputV1,
  ): Promise<PublishScheduleRangeResultV1> {
    const { publishScheduleRangeV1 } = await import("./schedulePublication.js");
    return publishScheduleRangeV1({
      input,
      getState: () => state,
      getAuthoredSetup: () => getActiveSetup(state),
      listGoals: goalSurface.listGoals,
      queryPlanningReview,
      historicalPlan: historicalPlanSurface,
      recordResult: (result) => {
        lastHistoricalPlanPublicationResult = result;
      },
    });
  }

  function applySuggestedFixToPreview(input: ApplyPreviewFixActionInput): DayFrameState {
    if (!state.preview) {
      throw new RangeError("Cannot apply a suggested fix without a current preview");
    }

    if (state.preview.isStale) {
      return getState();
    }

    const revisedPreviewResult = reviseSchedulePreview({
      preview: clonePreviewResult(state.preview.result),
      selectedFrictionPointId: input.selectedFrictionPointId,
      selectedSuggestedFixId: input.selectedSuggestedFixId,
      dayBoundaryStartTime: state.schedulingPreferences.dayBoundaryStartTime,
      revisedAt: input.revisedAt,
      getUserDayWindowForUserDayDate: (userDayDate) =>
        resolveUserDayWindowForLabel({
          shiftCycles: state.shiftCycles,
          defaultSchedulingPreferences: state.schedulingPreferences,
          userDayDate,
        }),
    });

    state = {
      ...state,
      preview: {
        result: revisedPreviewResult.preview,
        rangeStartDate: state.preview.rangeStartDate,
        rangeEndDate: state.preview.rangeEndDate,
        planningWindowStart: new Date(state.preview.planningWindowStart),
        planningWindowEnd: new Date(state.preview.planningWindowEnd),
        generatedAt: state.preview.generatedAt,
        ...(revisedPreviewResult.didRevise
          ? { revisedAt: input.revisedAt }
          : state.preview.revisedAt
            ? { revisedAt: state.preview.revisedAt }
            : {}),
        ...(revisedPreviewResult.actionFeedback
          ? { actionFeedback: revisedPreviewResult.actionFeedback }
          : {}),
        ...(state.preview.scopeMetadata
          ? { scopeMetadata: structuredClone(state.preview.scopeMetadata) }
          : {}),
        isStale: state.preview.isStale,
      },
    };

    return notify();
  }

  function notify(): DayFrameState {
    const snapshot = getState();

    for (const listener of listeners) {
      listener(snapshot);
    }

    return snapshot;
  }

  async function bootstrapAuthority(): Promise<void> {
    try {
      await initializeRestoreComposition();
      const recovered = await restoreComposition?.coordinator.recoverAtStartup();
      if (recovered?.status === "recoveryRequired") {
        transitionReadiness({ status: "protected", reason: "authorityRecoveryRequired" });
        return;
      }
      const hook = await (options.preBootstrapHook?.({ runtimeAuthority: authorityTransaction }) ??
        Promise.resolve({ status: "continue" as const }));
      if (hook.status === "protected") {
        transitionReadiness({ status: "protected", reason: hook.reason });
        return;
      }
      await goalSurface.initializeGoals();
      await goalStructureSurface.initializeGoalStructure();
      await goalPlanningSurface.initializeGoalPlanning();
      await compositionSurface.initializeComposition();
      await proposalSurface.initializeProposals();
      await realizationSurface.initializeRealizations();
      await Promise.all([
        executionHistorySurface.initializeExecutionHistory(),
        historicalPlanSurface.initialize(),
        measurementDefinitionSurface.initializeMeasurementDefinitions(),
      ]);
      await progressObservationSurface.initializeProgressObservations();
      const executionStatus = executionHistorySurface.getExecutionHistoryMigrationStatus();
      const historicalStatus = historicalPlanSurface.getStatus();
      const protectedParticipant =
        activeLocalIngressStatus.status === "recoveryRequired" ||
        profileIngressStatus.status === "recoveryRequired" ||
        planDecisionSurface.getPlanDecisionIngressStatus().status === "recoveryRequired" ||
        executionStatus === "protected" ||
        executionStatus === "unavailable" ||
        historicalStatus.status === "protected" ||
        historicalStatus.status === "unavailable";
      const goalProtected = goalSurface.getGoalIngressStatus().status === "protected";
      const measurementProtected =
        measurementDefinitionSurface.getMeasurementDefinitionIngressStatus().status === "protected";
      const observationProtected =
        progressObservationSurface.getProgressObservationIngressStatus().status === "protected";
      const structureProtected =
        goalStructureSurface.getGoalStructureIngressStatus().status === "protected";
      const planningProtected =
        goalPlanningSurface.getGoalPlanningIngressStatus().status === "protected";
      const compositionProtected =
        compositionSurface.getCompositionIngressStatus().status === "protected";
      const proposalProtected = proposalSurface.getProposalIngressStatus().status === "protected";
      const realizationProtected = realizationSurface.getRealizationIngressStatus() === "protected";
      transitionReadiness(
        protectedParticipant ||
          goalProtected ||
          measurementProtected ||
          observationProtected ||
          structureProtected ||
          planningProtected ||
          compositionProtected ||
          proposalProtected ||
          realizationProtected
          ? { status: "protected", reason: "authorityInitializationFailed" }
          : { status: "ready" },
      );
    } catch {
      transitionReadiness({ status: "protected", reason: "authorityInitializationFailed" });
    }
  }

  function getLastHistoricalPlanPublicationResult() {
    return lastHistoricalPlanPublicationResult;
  }

  const api: DayFrameStore = {
    initializeRestoreAuthority: initializeRestoreComposition,
    getReadiness,
    subscribeReadiness,
    whenReady,
    getState,
    getDurabilityStatus,
    getActiveLocalIngressStatus,
    getProfileIngressStatus,
    getQuarantinedProfiles,
    exportProtectedProfileSource,
    exportQuarantinedProfile,
    recheckProtectedProfileSource,
    getDesiredDurableCondition,
    retryActivePersistence,
    retryProfilePersistence,
    subscribeDurability,
    subscribeActiveLocalIngress,
    subscribeProfileIngress,
    subscribe,
    replaceProtectedActiveCheckpointWithCurrentState,
    abandonProtectedActiveCheckpointAndReset,
    replaceProtectedProfileCheckpointWithCurrentProfiles,
    abandonProtectedProfileCheckpoint,
    removeQuarantinedProfile,
    commitAuthoredSetup,
    commitAuthoredSetupTransaction,
    setSchedulingPreferences,
    setPreviewRange,
    setShiftDefinitions,
    setShiftCycles,
    setBlockTemplates,
    setBlockRecurrences,
    setManualEvents,
    mutateManualEvent,
    saveProfile,
    loadProfile,
    deleteProfile,
    clearLocalData,
    exportBackup,
    importBackup,
    exportBackupV3,
    importBackupV3,
    importBackupFile,
    exportBackupV4,
    importBackupV4,
    exportBackupV5,
    importBackupV5,
    exportBackupV6,
    importBackupV6,
    exportBackupV7,
    importBackupV7,
    exportBackupV8,
    importBackupV8,
    exportBackupV9,
    importBackupV9,
    exportBackupV10,
    importBackupV10,
    exportBackupV11,
    importBackupV11,
    exportBackupV12,
    importBackupV12,
    generatePreview,
    publishScheduleRange,
    applySuggestedFixToPreview,
    getLastHistoricalPlanPublicationResult,
    initialize: historicalPlanSurface.initialize,
    retryPendingPublications: historicalPlanSurface.retryPendingPublications,
    getHistoricalPlanDay: historicalPlanSurface.getHistoricalPlanDay,
    getHistoricalPlanRange: historicalPlanSurface.getHistoricalPlanRange,
    getHistoricalCompletionDistribution,
    getHistoricalSchedulingRealization,
    getGoalActivity,
    queryGoalProgress,
    queryGoalProgressObservationHistory,
    queryToday,
    queryPlanningReview,
    ...capacitySurface,
    ...allocationSurface,
    exportHistoricalPlan: historicalPlanSurface.exportHistoricalPlan,
    abandonProtectedHistoricalPlan: historicalPlanSurface.abandonProtectedHistoricalPlan,
    exportProtectedSource: historicalPlanSurface.exportProtectedSource,
    recheckProtectedSource: historicalPlanSurface.recheckProtectedSource,
    getStatus: historicalPlanSurface.getStatus,
    getPendingPublications: historicalPlanSurface.getPendingPublications,
    subscribeStatus: historicalPlanSurface.subscribeStatus,
    subscribeHistory: historicalPlanSurface.subscribeHistory,
    ...planDecisionSurface,
    ...executionHistorySurface,
    ...goalSurface,
    ...measurementDefinitionSurface,
    ...progressObservationSurface,
    ...goalStructureSurface,
    ...goalPlanningSurface,
    ...compositionSurface,
    ...proposalSurface,
    ...realizationSurface,
  };
  const gatedMethods = new Set<PropertyKey>([
    "retryActivePersistence",
    "retryProfilePersistence",
    "replaceProtectedActiveCheckpointWithCurrentState",
    "abandonProtectedActiveCheckpointAndReset",
    "replaceProtectedProfileCheckpointWithCurrentProfiles",
    "abandonProtectedProfileCheckpoint",
    "removeQuarantinedProfile",
    "commitAuthoredSetup",
    "commitAuthoredSetupTransaction",
    "setSchedulingPreferences",
    "setPreviewRange",
    "setShiftDefinitions",
    "setShiftCycles",
    "setBlockTemplates",
    "setBlockRecurrences",
    "setManualEvents",
    "mutateManualEvent",
    "saveProfile",
    "loadProfile",
    "deleteProfile",
    "clearLocalData",
    "exportBackup",
    "importBackup",
    "generatePreview",
    "publishScheduleRange",
    "applySuggestedFixToPreview",
    "acceptPlanDecision",
    "removePlanDecision",
    "retryPlanDecisionPersistence",
    "removeQuarantinedPlanDecision",
    "replaceProtectedPlanDecisionCheckpoint",
    "abandonProtectedPlanDecisionCheckpoint",
    "recordExecution",
    "correctExecutionRecord",
    "retractExecutionRecord",
    "retryExecutionHistoryPersistence",
    "removeQuarantinedExecutionHistory",
    "replaceProtectedExecutionHistoryCheckpoint",
    "abandonProtectedExecutionHistoryCheckpoint",
    "retryExecutionHistoryMigration",
    "replaceProtectedExecutionHistoryIndexedDbCheckpoint",
    "abandonProtectedExecutionHistoryIndexedDbCheckpoint",
    "retryPendingPublications",
    "abandonProtectedHistoricalPlan",
  ]);
  const wrappers = new Map<PropertyKey, unknown>();
  const storeProxy = new Proxy(api, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver) as unknown;
      if (!gatedMethods.has(property) || typeof value !== "function") return value;
      if (!wrappers.has(property))
        wrappers.set(property, (...args: unknown[]) => {
          const admission = getDayFrameMutationAdmission(
            readiness,
            authorityTransaction.getState().status !== "inactive",
          );
          if (!admission.allowed) throw new DayFrameMutationAdmissionError(admission.reason);
          return (value as (...values: unknown[]) => unknown)(...args);
        });
      return wrappers.get(property);
    },
  });
  registerDayFrameRuntimeAuthorityController(storeProxy, authorityTransaction);
  if (options.bootstrapMode !== "resolved-test") void bootstrapAuthority();
  return storeProxy;
}

function getOptionalStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function mergeInitialState(
  baseState: DayFrameState,
  initialState?: DayFrameStoreInitialState,
  allocate: SourceIncarnationAllocator = createSourceIncarnationId,
  persistedProfiles: DayFrameSavedProfile[] = [],
): DayFrameState {
  if (!initialState) {
    return {
      ...baseState,
      savedProfiles: cloneSavedProfiles(persistedProfiles),
    };
  }

  const mergedPattern = {
    schedulingPreferences: {
      ...baseState.schedulingPreferences,
      ...initialState.schedulingPreferences,
    },
    previewRange: initialState.previewRange
      ? { ...baseState.previewRange, ...initialState.previewRange }
      : { ...baseState.previewRange },
    shiftDefinitions: initialState.shiftDefinitions
      ? initialState.shiftDefinitions
      : projectActiveToPattern(getActiveSetup(baseState)).shiftDefinitions,
    shiftCycles: initialState.shiftCycles
      ? initialState.shiftCycles
      : projectActiveToPattern(getActiveSetup(baseState)).shiftCycles,
    blockTemplates: initialState.blockTemplates
      ? initialState.blockTemplates
      : projectActiveToPattern(getActiveSetup(baseState)).blockTemplates,
    blockRecurrences: initialState.blockRecurrences
      ? initialState.blockRecurrences
      : projectActiveToPattern(getActiveSetup(baseState)).blockRecurrences,
    manualEvents: initialState.manualEvents
      ? initialState.manualEvents
      : projectActiveToPattern(getActiveSetup(baseState)).manualEvents,
  };
  const active = instantiateActiveSetup(mergedPattern, allocate);
  return {
    ...active,
    savedProfiles: initialState.savedProfiles
      ? cloneSavedProfiles(initialState.savedProfiles)
      : cloneSavedProfiles(persistedProfiles),
    preview: initialState.preview ? clonePreview(initialState.preview) : null,
  };
}

function instantiateState(
  pattern: import("./types.js").DayFrameAuthoredPattern,
  allocate: SourceIncarnationAllocator,
): DayFrameState {
  return { ...instantiateActiveSetup(pattern, allocate), savedProfiles: [], preview: null };
}

type ActiveLocalIngressRead = {
  state: DayFrameState;
  status: ActiveLocalIngressStatus;
  protectedSource?: string;
  protectedSourceKey?: string;
  activeDurability: SurfaceDurabilityStatus;
};

function loadActiveLocalIngress(
  allocate: SourceIncarnationAllocator,
  serializeActiveV2: (value: unknown) => string,
): ActiveLocalIngressRead {
  let storage: StorageLike | undefined;

  try {
    storage = getStorage();
  } catch {
    return createProtectedFallback("readFailure", false, false);
  }

  if (!storage) {
    return {
      state: createInitialDayFrameState(),
      status: { status: "noSource", reason: "storageUnavailable" },
      activeDurability: "unknown",
    };
  }

  let rawState: string | null;

  try {
    const rawV2 = storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY);
    if (rawV2 !== null) {
      try {
        const parsedV2 = JSON.parse(rawV2) as unknown;
        if (isObjectRecord(parsedV2) && parsedV2.version !== 2) {
          return createProtectedFallback(
            "unsupportedVersion",
            true,
            true,
            rawV2,
            DAYFRAME_ACTIVE_V2_STORAGE_KEY,
          );
        }
        const active = validateActiveV2(parsedV2);
        return {
          state: { ...active.data, savedProfiles: [], preview: null },
          status: { status: "accepted", advisories: [] },
          activeDurability: "durable",
        };
      } catch {
        return createProtectedFallback(
          "structurallyInvalid",
          true,
          true,
          rawV2,
          DAYFRAME_ACTIVE_V2_STORAGE_KEY,
        );
      }
    }
    if (storage.getItem(DAYFRAME_ACTIVE_V2_ESTABLISHED_KEY) === "1") {
      return {
        state: createInitialDayFrameState(),
        status: { status: "noSource", reason: "missing" },
        activeDurability: "unknown",
      };
    }
    rawState = storage.getItem(DAYFRAME_STORAGE_KEY);
  } catch {
    return createProtectedFallback("readFailure", false, false);
  }

  if (rawState === null) {
    return {
      state: createInitialDayFrameState(),
      status: { status: "noSource", reason: "missing" },
      activeDurability: "unknown",
    };
  }

  let parsedState: unknown;

  try {
    parsedState = JSON.parse(rawState) as unknown;
  } catch {
    return createProtectedFallback(
      "corruptJson",
      true,
      true,
      rawState,
      DAYFRAME_STORAGE_KEY,
      "parseFailure",
    );
  }

  if (!isPersistedStateRecord(parsedState)) {
    return createProtectedFallback("structurallyInvalid", true, true, rawState);
  }

  try {
    const pattern = normalizePersistedDayFramePattern(parsedState);
    const validation = validateDayFrameAuthoredSetup(pattern);

    if (validation.status === "invalid") {
      return {
        state: createInitialDayFrameState(),
        status: {
          status: "recoveryRequired",
          reason: "invalidAuthoredState",
          activationBlocked: true,
          sourceReadable: true,
          sourcePreserved: true,
          migrationFailureDetail: "validationFailure",
          validation,
        },
        protectedSource: rawState,
        protectedSourceKey: DAYFRAME_STORAGE_KEY,
        activeDurability: "unknown",
      };
    }

    let active: ReturnType<typeof instantiateActiveSetup>;
    try {
      active = instantiateActiveSetup(pattern, allocate);
    } catch {
      return createProtectedFallback(
        "migrationFailure",
        true,
        true,
        rawState,
        DAYFRAME_STORAGE_KEY,
        "allocationFailure",
      );
    }

    let envelope: ReturnType<typeof createActiveV2>;
    try {
      envelope = validateActiveV2(createActiveV2(active));
    } catch {
      return createProtectedFallback(
        "migrationFailure",
        true,
        true,
        rawState,
        DAYFRAME_STORAGE_KEY,
        "constructionFailure",
      );
    }

    let serialized: string;
    try {
      serialized = serializeActiveV2(envelope);
    } catch {
      return createProtectedFallback(
        "migrationFailure",
        true,
        true,
        rawState,
        DAYFRAME_STORAGE_KEY,
        "serializationFailure",
      );
    }

    try {
      storage.setItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY, serialized);
    } catch {
      return createProtectedFallback(
        "migrationFailure",
        true,
        true,
        rawState,
        DAYFRAME_STORAGE_KEY,
        "writeFailure",
      );
    }

    let reread: string | null;
    try {
      reread = storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY);
    } catch {
      return createProtectedFallback(
        "migrationFailure",
        false,
        true,
        serialized,
        DAYFRAME_ACTIVE_V2_STORAGE_KEY,
        "rereadFailure",
      );
    }
    if (reread === null) {
      return createProtectedFallback(
        "migrationFailure",
        true,
        false,
        serialized,
        DAYFRAME_ACTIVE_V2_STORAGE_KEY,
        "rereadFailure",
      );
    }
    try {
      validateActiveV2(JSON.parse(reread) as unknown);
    } catch {
      return createProtectedFallback(
        "migrationFailure",
        true,
        true,
        reread,
        DAYFRAME_ACTIVE_V2_STORAGE_KEY,
        "rereadValidationFailure",
      );
    }
    if (reread !== serialized) {
      return createProtectedFallback(
        "migrationFailure",
        true,
        true,
        reread,
        DAYFRAME_ACTIVE_V2_STORAGE_KEY,
        "verificationFailure",
      );
    }
    try {
      storage.setItem(DAYFRAME_ACTIVE_V2_ESTABLISHED_KEY, "1");
    } catch {
      return createProtectedFallback(
        "migrationFailure",
        true,
        true,
        reread,
        DAYFRAME_ACTIVE_V2_STORAGE_KEY,
        "writeFailure",
      );
    }
    return {
      state: { ...active, savedProfiles: [], preview: null },
      status: { status: "accepted", advisories: validation.advisories },
      activeDurability: "durable",
    };
  } catch (error) {
    if (!(error instanceof TypeError || error instanceof RangeError)) {
      throw error;
    }

    return createProtectedFallback("structurallyInvalid", true, true, rawState);
  }
}

function createProtectedFallback(
  reason: Extract<ActiveLocalIngressStatus, { status: "recoveryRequired" }>["reason"],
  sourceReadable: boolean,
  sourcePreserved: boolean,
  protectedSource?: string,
  protectedSourceKey = DAYFRAME_STORAGE_KEY,
  migrationFailureDetail?: Extract<
    ActiveLocalIngressStatus,
    { status: "recoveryRequired" }
  >["migrationFailureDetail"],
): ActiveLocalIngressRead {
  return {
    state: createInitialDayFrameState(),
    status: {
      status: "recoveryRequired",
      reason,
      activationBlocked: true,
      sourceReadable,
      sourcePreserved,
      ...(migrationFailureDetail ? { migrationFailureDetail } : {}),
    },
    ...(protectedSource === undefined ? {} : { protectedSource, protectedSourceKey }),
    activeDurability: "unknown",
  };
}

function readActiveLocalSource(
  key: string,
): { status: "readable"; raw: string | null } | { status: "unreadable" } {
  try {
    const storage = getStorage();

    if (!storage) {
      return { status: "unreadable" };
    }

    return { status: "readable", raw: storage.getItem(key) };
  } catch {
    return { status: "unreadable" };
  }
}

function cloneInvalidValidation(
  validation: Extract<ReturnType<typeof validateDayFrameAuthoredSetup>, { status: "invalid" }>,
): Extract<ReturnType<typeof validateDayFrameAuthoredSetup>, { status: "invalid" }> {
  return {
    status: "invalid",
    issues: validation.issues.map((issue) => ({ ...issue })),
    advisories: validation.advisories.map((advisory) => ({ ...advisory })),
  };
}

function isPersistedStateRecord(value: unknown): value is Partial<PersistedDayFrameState> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const state = value as Record<string, unknown>;
  const arrayFields = [
    "shiftDefinitions",
    "shiftCycles",
    "blockTemplates",
    "blockRecurrences",
    "manualEvents",
  ];

  return (
    arrayFields.every((field) => state[field] === undefined || Array.isArray(state[field])) &&
    (state.schedulingPreferences === undefined || isObjectRecord(state.schedulingPreferences)) &&
    (state.previewRange === undefined || isObjectRecord(state.previewRange)) &&
    (state.shiftCycle === undefined ||
      state.shiftCycle === null ||
      isObjectRecord(state.shiftCycle))
  );
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneActiveLocalIngressStatus(status: ActiveLocalIngressStatus): ActiveLocalIngressStatus {
  if (status.status === "accepted") {
    return {
      status: "accepted",
      advisories: status.advisories.map((advisory) => ({ ...advisory })),
    };
  }

  if (status.status === "recoveryRequired" && status.validation) {
    return {
      ...status,
      validation: {
        status: "invalid",
        issues: status.validation.issues.map((issue) => ({ ...issue })),
        advisories: status.validation.advisories.map((advisory) => ({ ...advisory })),
      },
    };
  }

  return { ...status };
}

export function persistState(state: DayFrameState): PersistenceWriteOutcome {
  const storageAccess = getStorageForPersistence();

  if (storageAccess.status !== "available") {
    return { status: storageAccess.status };
  }

  const { storage } = storageAccess;

  let serializedState: string;

  try {
    validateIncarnationGraph(getActiveSetup(state));
    serializedState = JSON.stringify(createActiveV2(getActiveSetup(state)));
  } catch {
    return { status: "serializationFailure" };
  }

  try {
    storage.setItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY, serializedState);
    storage.setItem(DAYFRAME_ACTIVE_V2_ESTABLISHED_KEY, "1");
    return { status: "persisted" };
  } catch {
    return { status: "storageFailure" };
  }
}

type ProfileIngressRead = {
  profiles: DayFrameSavedProfile[];
  quarantinedProfiles: unknown[];
  status: ProfileIngressStatus;
  durability: SurfaceDurabilityStatus;
  protectedSource?: string;
  protectedSourceKey?: string;
};

function loadPersistedProfiles(serializeV2: (value: unknown) => string): ProfileIngressRead {
  const empty = (
    status: ProfileIngressStatus,
    protectedSource?: string,
    protectedSourceKey?: string,
  ): ProfileIngressRead => ({
    profiles: [],
    quarantinedProfiles: [],
    status,
    durability: "unknown",
    ...(protectedSource !== undefined ? { protectedSource } : {}),
    ...(protectedSourceKey !== undefined ? { protectedSourceKey } : {}),
  });
  let storage: StorageLike | undefined;

  try {
    storage = getStorage();
  } catch {
    return empty({ status: "recoveryRequired", reason: "readFailure", sourcePreserved: false });
  }

  if (!storage) {
    return empty({ status: "noSource", reason: "storageUnavailable" });
  }

  let rawV2: string | null;
  try {
    rawV2 = storage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY);
  } catch {
    return empty({ status: "recoveryRequired", reason: "readFailure", sourcePreserved: false });
  }
  if (rawV2 !== null) {
    try {
      const parsed = JSON.parse(rawV2) as unknown;
      if (isObjectRecord(parsed) && parsed.version !== 2) {
        return empty(
          { status: "recoveryRequired", reason: "unsupportedVersion", sourcePreserved: true },
          rawV2,
          DAYFRAME_PROFILES_V2_STORAGE_KEY,
        );
      }
      const validated = validateDayFrameProfilesStorageV2(parsed);
      return {
        profiles: cloneSavedProfiles(validated.profiles),
        quarantinedProfiles: structuredClone(validated.quarantinedProfiles),
        status: { status: "accepted", quarantinedEntryCount: validated.quarantinedProfiles.length },
        durability: "durable",
      };
    } catch {
      return empty(
        { status: "recoveryRequired", reason: "invalidV2", sourcePreserved: true },
        rawV2,
        DAYFRAME_PROFILES_V2_STORAGE_KEY,
      );
    }
  }

  try {
    if (storage.getItem(DAYFRAME_PROFILES_V2_ESTABLISHED_KEY) === "1") {
      return empty({ status: "noSource", reason: "missing" });
    }
  } catch {
    return empty({ status: "recoveryRequired", reason: "readFailure", sourcePreserved: false });
  }

  let rawV1: string | null;
  try {
    rawV1 = storage.getItem(DAYFRAME_PROFILES_STORAGE_KEY);
  } catch {
    return empty({ status: "recoveryRequired", reason: "readFailure", sourcePreserved: false });
  }
  if (rawV1 === null) return empty({ status: "noSource", reason: "missing" });

  let converted: ReturnType<typeof convertDayFrameProfilesStorageV1>;
  try {
    converted = convertDayFrameProfilesStorageV1(JSON.parse(rawV1) as unknown);
  } catch (error) {
    return empty(
      {
        status: "recoveryRequired",
        reason: error instanceof SyntaxError ? "corruptJson" : "invalidCollection",
        sourcePreserved: true,
      },
      rawV1,
      DAYFRAME_PROFILES_STORAGE_KEY,
    );
  }
  const envelope = createDayFrameProfilesStorageV2(
    converted.profiles,
    converted.quarantinedProfiles,
  );
  let serialized: string;
  try {
    serialized = serializeV2(envelope);
  } catch {
    return empty(
      {
        status: "recoveryRequired",
        reason: "migrationFailure",
        failureDetail: "serializationFailure",
        sourcePreserved: true,
      },
      rawV1,
      DAYFRAME_PROFILES_STORAGE_KEY,
    );
  }
  try {
    storage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, serialized);
  } catch {
    return empty(
      {
        status: "recoveryRequired",
        reason: "migrationFailure",
        failureDetail: "writeFailure",
        sourcePreserved: true,
      },
      rawV1,
      DAYFRAME_PROFILES_STORAGE_KEY,
    );
  }
  let reread: string | null;
  try {
    reread = storage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY);
  } catch {
    return empty(
      {
        status: "recoveryRequired",
        reason: "migrationFailure",
        failureDetail: "rereadFailure",
        sourcePreserved: true,
      },
      rawV1,
      DAYFRAME_PROFILES_STORAGE_KEY,
    );
  }
  if (reread === null) {
    return empty(
      {
        status: "recoveryRequired",
        reason: "migrationFailure",
        failureDetail: "rereadFailure",
        sourcePreserved: true,
      },
      rawV1,
      DAYFRAME_PROFILES_STORAGE_KEY,
    );
  }
  try {
    validateDayFrameProfilesStorageV2(JSON.parse(reread) as unknown);
  } catch {
    return empty(
      {
        status: "recoveryRequired",
        reason: "migrationFailure",
        failureDetail: "rereadValidationFailure",
        sourcePreserved: true,
      },
      rawV1,
      DAYFRAME_PROFILES_STORAGE_KEY,
    );
  }
  if (reread !== serialized) {
    return empty(
      {
        status: "recoveryRequired",
        reason: "migrationFailure",
        failureDetail: "verificationFailure",
        sourcePreserved: true,
      },
      rawV1,
      DAYFRAME_PROFILES_STORAGE_KEY,
    );
  }
  try {
    storage.setItem(DAYFRAME_PROFILES_V2_ESTABLISHED_KEY, "1");
  } catch {
    return empty(
      {
        status: "recoveryRequired",
        reason: "migrationFailure",
        failureDetail: "writeFailure",
        sourcePreserved: true,
      },
      rawV1,
      DAYFRAME_PROFILES_STORAGE_KEY,
    );
  }
  return {
    profiles: cloneSavedProfiles(converted.profiles),
    quarantinedProfiles: structuredClone(converted.quarantinedProfiles),
    status: { status: "accepted", quarantinedEntryCount: converted.quarantinedProfiles.length },
    durability: "durable",
  };
}

function getAuthoredSetup(state: DayFrameState) {
  return projectActiveToPattern(getActiveSetup(state));
}

function getActiveSetup(state: DayFrameState): DayFrameAuthoredSetup {
  return {
    schedulingPreferences: state.schedulingPreferences,
    previewRange: state.previewRange,
    shiftDefinitions: state.shiftDefinitions,
    shiftCycles: state.shiftCycles,
    blockTemplates: state.blockTemplates,
    blockRecurrences: state.blockRecurrences,
    manualEvents: state.manualEvents,
  };
}

export function persistProfiles(
  profiles: DayFrameSavedProfile[],
  quarantinedProfiles: unknown[] = [],
): PersistenceWriteOutcome {
  const storageAccess = getStorageForPersistence();

  if (storageAccess.status !== "available") {
    return { status: storageAccess.status };
  }

  const { storage } = storageAccess;

  let serializedProfiles: string;

  try {
    serializedProfiles = JSON.stringify(
      createDayFrameProfilesStorageV2(profiles, quarantinedProfiles),
    );
  } catch {
    return { status: "serializationFailure" };
  }

  try {
    storage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, serializedProfiles);
    storage.setItem(DAYFRAME_PROFILES_V2_ESTABLISHED_KEY, "1");
    return { status: "persisted" };
  } catch {
    return { status: "storageFailure" };
  }
}

export function clearPersistedState(): PersistenceRemovalOutcome {
  const storageAccess = getStorageForPersistence();

  if (storageAccess.status !== "available") {
    return { status: storageAccess.status };
  }

  const { storage } = storageAccess;

  try {
    storage.removeItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY);
    storage.removeItem(DAYFRAME_STORAGE_KEY);
    storage.setItem(DAYFRAME_ACTIVE_V2_ESTABLISHED_KEY, "1");
    return { status: "removed" };
  } catch {
    return { status: "storageFailure" };
  }
}

export function clearPersistedProfiles(): PersistenceRemovalOutcome {
  const storageAccess = getStorageForPersistence();

  if (storageAccess.status !== "available") {
    return { status: storageAccess.status };
  }

  const { storage } = storageAccess;

  try {
    storage.removeItem(DAYFRAME_PROFILES_V2_STORAGE_KEY);
    storage.removeItem(DAYFRAME_PROFILES_STORAGE_KEY);
    storage.setItem(DAYFRAME_PROFILES_V2_ESTABLISHED_KEY, "1");
    return { status: "removed" };
  } catch {
    return { status: "storageFailure" };
  }
}

function getStorage(): StorageLike | undefined {
  if (!("localStorage" in globalThis)) {
    return undefined;
  }

  return globalThis.localStorage as StorageLike;
}

function getStorageForPersistence():
  | { status: "available"; storage: StorageLike }
  | { status: "unavailable" }
  | { status: "storageFailure" } {
  try {
    const storage = getStorage();

    return storage ? { status: "available", storage } : { status: "unavailable" };
  } catch {
    return { status: "storageFailure" };
  }
}

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function cloneState(state: DayFrameState): DayFrameState {
  return {
    schedulingPreferences: {
      ...state.schedulingPreferences,
    },
    previewRange: {
      ...state.previewRange,
    },
    shiftDefinitions: cloneShiftDefinitions(state.shiftDefinitions),
    shiftCycles: cloneShiftCycles(state.shiftCycles),
    blockTemplates: cloneBlockTemplates(state.blockTemplates),
    blockRecurrences: cloneBlockRecurrences(state.blockRecurrences),
    manualEvents: cloneManualEvents(state.manualEvents),
    savedProfiles: cloneSavedProfiles(state.savedProfiles),
    preview: state.preview ? clonePreview(state.preview) : null,
  };
}

function clonePreview(preview: DayFramePreview): DayFramePreview {
  return {
    result: clonePreviewResult(preview.result),
    rangeStartDate: preview.rangeStartDate,
    rangeEndDate: preview.rangeEndDate,
    planningWindowStart: new Date(preview.planningWindowStart),
    planningWindowEnd: new Date(preview.planningWindowEnd),
    generatedAt: preview.generatedAt,
    isStale: preview.isStale,
    ...(preview.revisedAt ? { revisedAt: preview.revisedAt } : {}),
    ...(preview.actionFeedback ? { actionFeedback: { ...preview.actionFeedback } } : {}),
    ...(preview.scopeMetadata ? { scopeMetadata: structuredClone(preview.scopeMetadata) } : {}),
  };
}

function markPreviewStale(preview: DayFramePreview | null): DayFramePreview | null {
  if (!preview) {
    return null;
  }

  return {
    ...clonePreview(preview),
    isStale: true,
  };
}

function createProfileId(name: string): string {
  const normalizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `profile_${normalizedName || "saved"}`;
}

function clonePreviewResult(result: DayFramePreview["result"]): DayFramePreview["result"] {
  return {
    generatedWorkBlocks: result.generatedWorkBlocks.map((generatedWorkBlock) => ({
      ...generatedWorkBlock,
      ...(generatedWorkBlock.occurrenceIdentity
        ? { occurrenceIdentity: cloneOccurrenceIdentity(generatedWorkBlock.occurrenceIdentity) }
        : {}),
      startsAt: new Date(generatedWorkBlock.startsAt),
      endsAt: new Date(generatedWorkBlock.endsAt),
    })),
    blockCandidates: result.blockCandidates.map((blockCandidate) => ({
      ...blockCandidate,
      ...(blockCandidate.occurrenceIdentity
        ? { occurrenceIdentity: cloneOccurrenceIdentity(blockCandidate.occurrenceIdentity) }
        : {}),
      externalResources: [...blockCandidate.externalResources],
    })),
    scheduledBlocks: result.scheduledBlocks.map((scheduledBlock) => ({
      ...scheduledBlock,
      ...(scheduledBlock.occurrenceIdentity
        ? { occurrenceIdentity: cloneOccurrenceIdentity(scheduledBlock.occurrenceIdentity) }
        : {}),
      startsAt: new Date(scheduledBlock.startsAt),
      endsAt: new Date(scheduledBlock.endsAt),
      externalResources: [...scheduledBlock.externalResources],
    })),
    unplacedCandidates: result.unplacedCandidates.map((blockCandidate) => ({
      ...blockCandidate,
      ...(blockCandidate.occurrenceIdentity
        ? { occurrenceIdentity: cloneOccurrenceIdentity(blockCandidate.occurrenceIdentity) }
        : {}),
      externalResources: [...blockCandidate.externalResources],
    })),
    frictionPoints: result.frictionPoints.map((frictionPoint) => ({
      ...frictionPoint,
      suggestedFixes: frictionPoint.suggestedFixes.map((suggestedFix) => ({
        ...suggestedFix,
        ...(suggestedFix.parameters ? { parameters: { ...suggestedFix.parameters } } : {}),
        ...(suggestedFix.decisionContext
          ? { decisionContext: { ...suggestedFix.decisionContext } }
          : {}),
      })),
    })),
    planDecisionResults: result.planDecisionResults.map((replayResult) =>
      structuredClone(replayResult),
    ),
    ...(result.realizedScheduleFacts
      ? { realizedScheduleFacts: structuredClone(result.realizedScheduleFacts) }
      : {}),
  };
}

function cloneShiftDefinitions(
  state: DayFrameState["shiftDefinitions"],
): DayFrameState["shiftDefinitions"] {
  return state.map((shiftDefinition) => ({
    ...shiftDefinition,
  }));
}

function cloneShiftCycles(shiftCycles: DayFrameState["shiftCycles"]): DayFrameState["shiftCycles"] {
  return shiftCycles.map((cycle) => ({
    ...cycle,
    segments: cycle.segments.map((segment) => ({
      ...segment,
      ...(segment.schedulePreferences
        ? { schedulePreferences: { ...segment.schedulePreferences } }
        : {}),
    })),
    sequence: (cycle.sequence ?? []).map((entry) => ({ ...entry })),
  }));
}

function cloneBlockTemplates(
  blockTemplates: DayFrameState["blockTemplates"],
): DayFrameState["blockTemplates"] {
  return blockTemplates.map((blockTemplate) => ({
    ...blockTemplate,
    requiresWorkAnchor: blockTemplate.requiresWorkAnchor ?? false,
    externalResources: blockTemplate.externalResources.map((externalResource) => ({
      ...externalResource,
      ...(externalResource.metadata ? { metadata: { ...externalResource.metadata } } : {}),
    })),
  }));
}

function cloneBlockRecurrences(
  blockRecurrences: DayFrameState["blockRecurrences"],
): DayFrameState["blockRecurrences"] {
  return blockRecurrences.map((blockRecurrence) => ({
    ...blockRecurrence,
    ...(blockRecurrence.weekdays ? { weekdays: [...blockRecurrence.weekdays] } : {}),
  }));
}

function cloneManualEvents(
  manualEvents: DayFrameState["manualEvents"],
): DayFrameState["manualEvents"] {
  return manualEvents.map((manualEvent) => ({
    ...manualEvent,
  }));
}
