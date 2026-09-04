import type { DayFrameRuntimeAuthorityController } from "./dayFrameRuntimeAuthority.js";
import type { DayFrameStore } from "./types.js";
import { createRestoreCoordinator } from "../infrastructure/restore/restoreCoordinator.js";
import { createRestoreJournalStorage } from "../infrastructure/restore/restoreJournal.js";
import {
  createRestoreIndexedDbStaging,
  createRestoreLocalStaging,
  semanticFingerprint,
} from "../infrastructure/restore/restoreStaging.js";
import {
  createCombinedIndexedDbRestoreAdapter,
  createExecutionHistoryAntiResurrectionAdapter,
  type RestoreParticipantAdapter,
  type RestoreParticipantReadiness,
} from "../infrastructure/restore/restoreParticipants.js";
import type { IndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import {
  EXECUTION_HISTORY_METADATA_STORE,
  EXECUTION_HISTORY_QUARANTINE_STORE,
  EXECUTION_HISTORY_RECORD_STORE,
  HISTORICAL_PLAN_BATCH_STORE,
  HISTORICAL_PLAN_DAY_STORE,
  GOAL_AUTHORITY_STORE,
  MEASUREMENT_DEFINITION_STORE,
  PROGRESS_OBSERVATION_STORE,
  GOAL_STRUCTURE_STORE,
  GOAL_PLANNING_STORE,
  COMPOSITION_AUTHORITY_STORE,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import type { DayFrameActiveV2 } from "./activeV2.js";
import type { DayFrameProfilesStorageV2 } from "./dayFrameProfiles.js";
import {
  DAYFRAME_PLAN_DECISIONS_STORAGE_KEY,
  type PlanDecisionEnvelopeV1,
} from "./planDecisionSurface.js";
import {
  createPhysicalExecutionRecord,
  EXECUTION_HISTORY_METADATA_KEY,
  type ExecutionHistoryMetadata,
} from "./executionHistoryIndexedDb.js";
import type { ExecutionHistoryEnvelopeV1 } from "./executionHistorySurface.js";
import {
  createPhysicalHistoricalPlanBatchRecord,
  createPhysicalHistoricalPlanDayRecord,
} from "./historicalPlanSurface.js";
import type { PlanPublicationBatchV1 } from "../core/historicalPlan/historicalPlan.js";
import {
  restoreTranslators,
  type RestoreDurablePayloadMap,
  type RestoreRuntimeTargetMap,
} from "./dayFrameRestoreTranslation.js";
import type { GoalAuthorityV1 } from "../core/goals/goal.js";
import type { GoalMeasurementDefinitionAuthorityV1 } from "../core/measurement/measurementDefinition.js";
import type { GoalProgressObservationAuthorityV1 } from "../core/progressObservation/progressObservation.js";
import type { GoalStructureAuthorityV1 } from "../core/planning/goalStructure.js";
import type { GoalPlanningAuthorityV1 } from "../core/planning/goalDemand.js";
import type { CompositionAuthorityV1 } from "../core/planning/commitmentComposition.js";

const DAYFRAME_ACTIVE_V2_STORAGE_KEY = "dayframe-active-v2";
const DAYFRAME_PROFILES_V2_STORAGE_KEY = "dayframe-profiles-v2";

export type DayFrameRestoreAuthoritySources = {
  active(): DayFrameActiveV2;
  profiles(): DayFrameProfilesStorageV2;
  planDecisions(): PlanDecisionEnvelopeV1;
  executionHistory(): ExecutionHistoryEnvelopeV1;
  historicalPlan(): Promise<
    { status: "exported"; batches: PlanPublicationBatchV1[] } | { status: string }
  >;
  goals(): GoalAuthorityV1;
  measurementDefinitions(): GoalMeasurementDefinitionAuthorityV1;
  progressObservations(): GoalProgressObservationAuthorityV1;
  goalStructure(): GoalStructureAuthorityV1;
  goalPlanning(): GoalPlanningAuthorityV1;
  composition(): CompositionAuthorityV1;
  readiness(id: keyof RestoreDurablePayloadMap): RestoreParticipantReadiness;
};

export const DAYFRAME_RESTORE_CAPABILITY: unique symbol = Symbol("DayFrameRestoreCapability");
type DayFrameRestoreComposition = ReturnType<typeof createDayFrameRestoreComposition>;
const compositions = new WeakMap<object, DayFrameRestoreComposition>();
export function registerDayFrameRestoreComposition(
  store: object,
  composition: DayFrameRestoreComposition,
): void {
  compositions.set(store, composition);
}
export function getDayFrameRestoreComposition(
  store: DayFrameStore,
  capability: typeof DAYFRAME_RESTORE_CAPABILITY,
): DayFrameRestoreComposition {
  if (capability !== DAYFRAME_RESTORE_CAPABILITY) throw new Error("Invalid restore capability.");
  const composition = compositions.get(store);
  if (!composition) throw new Error("Restore composition is unavailable.");
  return composition;
}

export function createDayFrameRestoreComposition(options: {
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">;
  indexedDb: IndexedDbCollectionStorage;
  runtime: DayFrameRuntimeAuthorityController;
  sources: DayFrameRestoreAuthoritySources;
  allocateId?: () => string;
  now?: () => string;
}) {
  const adapters = createRegistry(options);
  const coordinator = createRestoreCoordinator({
    participants: Object.values(adapters),
    runtime: options.runtime,
    combinedIndexedDb: createCombinedIndexedDbRestoreAdapter(options.indexedDb),
    antiResurrection: createExecutionHistoryAntiResurrectionAdapter(options.storage),
    journal: createRestoreJournalStorage(options.storage),
    durableStage: createRestoreIndexedDbStaging(options.indexedDb),
    localStage: createRestoreLocalStaging(options.storage),
    ...(options.allocateId ? { allocateId: options.allocateId } : {}),
    ...(options.now ? { now: options.now } : {}),
  });
  return { coordinator, participants: adapters };
}

function createRegistry(options: Parameters<typeof createDayFrameRestoreComposition>[0]) {
  const local = <K extends "active" | "profiles" | "planDecisions">(
    id: K,
    key: string,
    capture: () => RestoreDurablePayloadMap[K],
    translate: (value: unknown) =>
      | {
          status: "valid";
          durable: RestoreDurablePayloadMap[K];
          target: RestoreRuntimeTargetMap[K];
        }
      | { status: "invalid"; reason: string },
  ): RestoreParticipantAdapter<RestoreDurablePayloadMap[K], RestoreRuntimeTargetMap[K]> => ({
    id,
    durableKind: "localStorage",
    getReadiness: () => options.sources.readiness(id),
    captureCurrentAuthority: async () => capture(),
    validatePayload: (value) => {
      const checked = translate(value);
      return checked.status === "valid" ? { status: "valid", payload: checked.durable } : checked;
    },
    clonePayload: structuredClone,
    fingerprint: semanticFingerprint,
    captureSourceFingerprint: async () => sourceFingerprint(options.storage, key),
    recheckSourceFingerprint: async (expected) =>
      sourceFingerprint(options.storage, key) === expected ? success() : failure("sourceChanged"),
    writeDurableTargetExact: async (payload) => writeLocal(options.storage, key, payload),
    verifyDurableTarget: async (payload) => verifyLocal(options.storage, key, payload),
    buildRuntimeTargetFromDurable: async (payload) => {
      const checked = translate(payload);
      return checked.status === "valid" ? { status: "valid", target: checked.target } : checked;
    },
  });
  const active = local(
    "active",
    DAYFRAME_ACTIVE_V2_STORAGE_KEY,
    options.sources.active,
    restoreTranslators.active,
  );
  const profiles = local(
    "profiles",
    DAYFRAME_PROFILES_V2_STORAGE_KEY,
    options.sources.profiles,
    restoreTranslators.profiles,
  );
  const planDecisions = local(
    "planDecisions",
    DAYFRAME_PLAN_DECISIONS_STORAGE_KEY,
    options.sources.planDecisions,
    restoreTranslators.planDecisions,
  );
  const executionHistory: RestoreParticipantAdapter<
    RestoreDurablePayloadMap["executionHistory"],
    RestoreRuntimeTargetMap["executionHistory"]
  > = {
    id: "executionHistory",
    durableKind: "indexedDb",
    getReadiness: () => options.sources.readiness("executionHistory"),
    captureCurrentAuthority: async () => executionPhysical(options.sources.executionHistory()),
    validatePayload: (value) => {
      const checked = restoreTranslators.executionHistory(value);
      return checked.status === "valid" ? { status: "valid", payload: checked.durable } : checked;
    },
    clonePayload: structuredClone,
    fingerprint: semanticFingerprint,
    captureSourceFingerprint: () =>
      indexedFingerprint(options.indexedDb, [
        EXECUTION_HISTORY_RECORD_STORE,
        EXECUTION_HISTORY_QUARANTINE_STORE,
        EXECUTION_HISTORY_METADATA_STORE,
      ]),
    recheckSourceFingerprint: async (expected) =>
      (await indexedFingerprint(options.indexedDb, [
        EXECUTION_HISTORY_RECORD_STORE,
        EXECUTION_HISTORY_QUARANTINE_STORE,
        EXECUTION_HISTORY_METADATA_STORE,
      ])) === expected
        ? success()
        : failure("sourceChanged"),
    writeDurableTargetExact: async () => success(),
    verifyDurableTarget: async () => success(),
    buildRuntimeTargetFromDurable: async (payload) => {
      const checked = restoreTranslators.executionHistory(payload);
      return checked.status === "valid" ? { status: "valid", target: checked.target } : checked;
    },
  };
  const historicalPlan: RestoreParticipantAdapter<
    RestoreDurablePayloadMap["historicalPlan"],
    RestoreRuntimeTargetMap["historicalPlan"]
  > = {
    id: "historicalPlan",
    durableKind: "indexedDb",
    getReadiness: () => options.sources.readiness("historicalPlan"),
    captureCurrentAuthority: async () => {
      const exported = await options.sources.historicalPlan();
      if (exported.status !== "exported" || !("batches" in exported))
        throw new Error("HistoricalPlan unavailable");
      return historicalPhysical(exported.batches);
    },
    validatePayload: (value) => {
      const checked = restoreTranslators.historicalPlan(value);
      return checked.status === "valid" ? { status: "valid", payload: checked.durable } : checked;
    },
    clonePayload: structuredClone,
    fingerprint: semanticFingerprint,
    captureSourceFingerprint: () =>
      indexedFingerprint(options.indexedDb, [
        HISTORICAL_PLAN_BATCH_STORE,
        HISTORICAL_PLAN_DAY_STORE,
      ]),
    recheckSourceFingerprint: async (expected) =>
      (await indexedFingerprint(options.indexedDb, [
        HISTORICAL_PLAN_BATCH_STORE,
        HISTORICAL_PLAN_DAY_STORE,
      ])) === expected
        ? success()
        : failure("sourceChanged"),
    writeDurableTargetExact: async () => success(),
    verifyDurableTarget: async () => success(),
    buildRuntimeTargetFromDurable: async (payload) => {
      const checked = restoreTranslators.historicalPlan(payload);
      return checked.status === "valid" ? { status: "valid", target: checked.target } : checked;
    },
  };
  const goals: RestoreParticipantAdapter<
    RestoreDurablePayloadMap["goals"],
    RestoreRuntimeTargetMap["goals"]
  > = {
    id: "goals",
    durableKind: "indexedDb",
    getReadiness: () => options.sources.readiness("goals"),
    captureCurrentAuthority: async () => options.sources.goals(),
    validatePayload: (value) => {
      const checked = restoreTranslators.goals(value);
      return checked.status === "valid" ? { status: "valid", payload: checked.durable } : checked;
    },
    clonePayload: structuredClone,
    fingerprint: semanticFingerprint,
    captureSourceFingerprint: () => indexedFingerprint(options.indexedDb, [GOAL_AUTHORITY_STORE]),
    recheckSourceFingerprint: async (expected) =>
      (await indexedFingerprint(options.indexedDb, [GOAL_AUTHORITY_STORE])) === expected
        ? success()
        : failure("sourceChanged"),
    writeDurableTargetExact: async () => success(),
    verifyDurableTarget: async () => success(),
    buildRuntimeTargetFromDurable: async (payload) => {
      const checked = restoreTranslators.goals(payload);
      return checked.status === "valid" ? { status: "valid", target: checked.target } : checked;
    },
  };
  const measurementDefinitions: RestoreParticipantAdapter<
    RestoreDurablePayloadMap["measurementDefinitions"],
    RestoreRuntimeTargetMap["measurementDefinitions"]
  > = {
    id: "measurementDefinitions",
    durableKind: "indexedDb",
    getReadiness: () => options.sources.readiness("measurementDefinitions"),
    captureCurrentAuthority: async () => options.sources.measurementDefinitions(),
    validatePayload: (value) => {
      const checked = restoreTranslators.measurementDefinitions(value);
      return checked.status === "valid" ? { status: "valid", payload: checked.durable } : checked;
    },
    clonePayload: structuredClone,
    fingerprint: semanticFingerprint,
    captureSourceFingerprint: () =>
      indexedFingerprint(options.indexedDb, [MEASUREMENT_DEFINITION_STORE]),
    recheckSourceFingerprint: async (expected) =>
      (await indexedFingerprint(options.indexedDb, [MEASUREMENT_DEFINITION_STORE])) === expected
        ? success()
        : failure("sourceChanged"),
    writeDurableTargetExact: async () => success(),
    verifyDurableTarget: async () => success(),
    buildRuntimeTargetFromDurable: async (payload) => {
      const checked = restoreTranslators.measurementDefinitions(payload);
      return checked.status === "valid" ? { status: "valid", target: checked.target } : checked;
    },
  };
  const progressObservations: RestoreParticipantAdapter<
    RestoreDurablePayloadMap["progressObservations"],
    RestoreRuntimeTargetMap["progressObservations"]
  > = {
    id: "progressObservations",
    durableKind: "indexedDb",
    getReadiness: () => options.sources.readiness("progressObservations"),
    captureCurrentAuthority: async () => options.sources.progressObservations(),
    validatePayload: (value) => {
      const checked = restoreTranslators.progressObservations(value);
      return checked.status === "valid" ? { status: "valid", payload: checked.durable } : checked;
    },
    clonePayload: structuredClone,
    fingerprint: semanticFingerprint,
    captureSourceFingerprint: () =>
      indexedFingerprint(options.indexedDb, [PROGRESS_OBSERVATION_STORE]),
    recheckSourceFingerprint: async (expected) =>
      (await indexedFingerprint(options.indexedDb, [PROGRESS_OBSERVATION_STORE])) === expected
        ? success()
        : failure("sourceChanged"),
    writeDurableTargetExact: async () => success(),
    verifyDurableTarget: async () => success(),
    buildRuntimeTargetFromDurable: async (payload) => {
      const checked = restoreTranslators.progressObservations(payload);
      return checked.status === "valid" ? { status: "valid", target: checked.target } : checked;
    },
  };
  const goalStructure: RestoreParticipantAdapter<
    RestoreDurablePayloadMap["goalStructure"],
    RestoreRuntimeTargetMap["goalStructure"]
  > = {
    id: "goalStructure",
    durableKind: "indexedDb",
    getReadiness: () => options.sources.readiness("goalStructure"),
    captureCurrentAuthority: async () => options.sources.goalStructure(),
    validatePayload: (value) => {
      const checked = restoreTranslators.goalStructure(value);
      return checked.status === "valid" ? { status: "valid", payload: checked.durable } : checked;
    },
    clonePayload: structuredClone,
    fingerprint: semanticFingerprint,
    captureSourceFingerprint: () => indexedFingerprint(options.indexedDb, [GOAL_STRUCTURE_STORE]),
    recheckSourceFingerprint: async (expected) =>
      (await indexedFingerprint(options.indexedDb, [GOAL_STRUCTURE_STORE])) === expected
        ? success()
        : failure("sourceChanged"),
    writeDurableTargetExact: async () => success(),
    verifyDurableTarget: async () => success(),
    buildRuntimeTargetFromDurable: async (payload) => {
      const checked = restoreTranslators.goalStructure(payload);
      return checked.status === "valid" ? { status: "valid", target: checked.target } : checked;
    },
  };
  const goalPlanning: RestoreParticipantAdapter<
    RestoreDurablePayloadMap["goalPlanning"],
    RestoreRuntimeTargetMap["goalPlanning"]
  > = {
    id: "goalPlanning",
    durableKind: "indexedDb",
    getReadiness: () => options.sources.readiness("goalPlanning"),
    captureCurrentAuthority: async () => options.sources.goalPlanning(),
    validatePayload: (value) => {
      const checked = restoreTranslators.goalPlanning(value);
      return checked.status === "valid" ? { status: "valid", payload: checked.durable } : checked;
    },
    clonePayload: structuredClone,
    fingerprint: semanticFingerprint,
    captureSourceFingerprint: () => indexedFingerprint(options.indexedDb, [GOAL_PLANNING_STORE]),
    recheckSourceFingerprint: async (expected) =>
      (await indexedFingerprint(options.indexedDb, [GOAL_PLANNING_STORE])) === expected
        ? success()
        : failure("sourceChanged"),
    writeDurableTargetExact: async () => success(),
    verifyDurableTarget: async () => success(),
    buildRuntimeTargetFromDurable: async (payload) => {
      const checked = restoreTranslators.goalPlanning(payload);
      if (checked.status !== "valid") return checked;
      const { validateGoalPlanningAuthority } = await import("../core/planning/goalDemand.js");
      const strict = validateGoalPlanningAuthority(checked.durable);
      return strict.status === "valid"
        ? {
            status: "valid",
            target: {
              ...checked.target,
              authority: strict.authority,
              desired: structuredClone(strict.authority),
            },
          }
        : { status: "invalid", reason: "invalidGoalPlanning" };
    },
  };
  const composition: RestoreParticipantAdapter<
    RestoreDurablePayloadMap["composition"],
    RestoreRuntimeTargetMap["composition"]
  > = {
    id: "composition",
    durableKind: "indexedDb",
    getReadiness: () => options.sources.readiness("composition"),
    captureCurrentAuthority: async () => options.sources.composition(),
    validatePayload: (value) => {
      const checked = restoreTranslators.composition(value);
      return checked.status === "valid" ? { status: "valid", payload: checked.durable } : checked;
    },
    clonePayload: structuredClone,
    fingerprint: semanticFingerprint,
    captureSourceFingerprint: () =>
      indexedFingerprint(options.indexedDb, [COMPOSITION_AUTHORITY_STORE]),
    recheckSourceFingerprint: async (expected) =>
      (await indexedFingerprint(options.indexedDb, [COMPOSITION_AUTHORITY_STORE])) === expected
        ? success()
        : failure("sourceChanged"),
    writeDurableTargetExact: async () => success(),
    verifyDurableTarget: async () => success(),
    buildRuntimeTargetFromDurable: async (payload) => {
      const checked = restoreTranslators.composition(payload);
      if (checked.status !== "valid") return checked;
      const { validateCompositionAuthority } =
        await import("../core/planning/commitmentComposition.js");
      const strict = validateCompositionAuthority(checked.durable);
      return strict.status === "valid"
        ? {
            status: "valid",
            target: {
              ...checked.target,
              authority: strict.authority,
              desired: structuredClone(strict.authority),
            },
          }
        : { status: "invalid", reason: "invalidComposition" };
    },
  };
  return {
    active,
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
  };
}

export function createExecutionHistoryDurableRestorePayload(
  envelope: ExecutionHistoryEnvelopeV1,
): RestoreDurablePayloadMap["executionHistory"] {
  const metadata: ExecutionHistoryMetadata = {
    surface: EXECUTION_HISTORY_METADATA_KEY,
    version: 1,
    authorityState: "established",
    legacyFingerprint: "restore-capture",
    recordCount: envelope.records.length,
    quarantineCount: envelope.quarantinedComponents.length,
  };
  return {
    records: envelope.records.map(createPhysicalExecutionRecord),
    quarantine: structuredClone(envelope.quarantinedComponents),
    metadata: [metadata],
    antiResurrection: "1",
  };
}
export function createHistoricalPlanDurableRestorePayload(
  batches: PlanPublicationBatchV1[],
): RestoreDurablePayloadMap["historicalPlan"] {
  return {
    batches: batches.map(createPhysicalHistoricalPlanBatchRecord),
    days: batches.flatMap((batch) =>
      batch.days.map((day) => createPhysicalHistoricalPlanDayRecord(batch, day)),
    ),
  };
}
const executionPhysical = createExecutionHistoryDurableRestorePayload;
const historicalPhysical = createHistoricalPlanDurableRestorePayload;
async function indexedFingerprint(storage: IndexedDbCollectionStorage, stores: string[]) {
  const values: unknown[] = [];
  for (const store of stores) {
    const result = await storage.getAll<unknown>(store);
    if (result.status === "failure") return "unreadable";
    values.push([store, result.value]);
  }
  return semanticFingerprint(values);
}
function sourceFingerprint(storage: Pick<Storage, "getItem">, key: string) {
  try {
    return semanticFingerprint(storage.getItem(key));
  } catch {
    return "unreadable";
  }
}
async function writeLocal(
  storage: Pick<Storage, "setItem" | "getItem">,
  key: string,
  payload: unknown,
) {
  try {
    storage.setItem(key, JSON.stringify(payload));
    return verifyLocal(storage, key, payload);
  } catch {
    return failure("storageFailure");
  }
}
async function verifyLocal(storage: Pick<Storage, "getItem">, key: string, payload: unknown) {
  try {
    const raw = storage.getItem(key);
    return raw !== null && semanticFingerprint(JSON.parse(raw)) === semanticFingerprint(payload)
      ? success()
      : failure("mismatch");
  } catch {
    return failure("storageFailure");
  }
}
function success() {
  return { status: "success" as const };
}
function failure(reason: string) {
  return { status: "failure" as const, reason };
}
