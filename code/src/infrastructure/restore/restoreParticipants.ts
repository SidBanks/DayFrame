import type { RestoreParticipantId } from "./restoreStaging.js";
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
  PROPOSAL_AUTHORITY_STORE,
  REALIZATION_AUTHORITY_STORE,
} from "../storage/dayFrameDurableDb.js";
import type { IndexedDbCollectionStorage } from "../storage/indexedDbCollectionStorage.js";
import { semanticFingerprint } from "./restoreStaging.js";

export type RestoreParticipantReadiness = "ready" | "notReady" | "protected" | "busy";
export type RestoreCheck = { status: "success" } | { status: "failure"; reason: string };

export type RestoreRuntimeTargetResult<T> =
  | { status: "valid"; target: T }
  | { status: "invalid"; reason: string };

export interface RestoreParticipantAdapter<TDurable = unknown, TRuntime = unknown> {
  readonly id: RestoreParticipantId;
  readonly durableKind: "localStorage" | "indexedDb";
  getReadiness(): RestoreParticipantReadiness;
  captureCurrentAuthority(): Promise<TDurable>;
  validatePayload(
    payload: unknown,
  ): { status: "valid"; payload: TDurable } | { status: "invalid"; reason: string };
  clonePayload(payload: TDurable): TDurable;
  fingerprint(payload: TDurable): string;
  captureSourceFingerprint(): Promise<string>;
  recheckSourceFingerprint(expected: string): Promise<RestoreCheck>;
  writeDurableTargetExact(payload: TDurable): Promise<RestoreCheck>;
  verifyDurableTarget(payload: TDurable): Promise<RestoreCheck>;
  buildRuntimeTargetFromDurable(payload: TDurable): Promise<RestoreRuntimeTargetResult<TRuntime>>;
}

export interface CombinedIndexedDbRestoreAdapter {
  replaceExact(payloads: {
    executionHistory: unknown;
    historicalPlan: unknown;
    goals: unknown;
    measurementDefinitions: unknown;
    progressObservations: unknown;
    goalStructure: unknown;
    goalPlanning: unknown;
    composition: unknown;
    proposals: unknown;
    realizations?: unknown;
  }): Promise<RestoreCheck>;
  verifyExact(payloads: {
    executionHistory: unknown;
    historicalPlan: unknown;
    goals: unknown;
    measurementDefinitions: unknown;
    progressObservations: unknown;
    goalStructure: unknown;
    goalPlanning: unknown;
    composition: unknown;
    proposals: unknown;
    realizations?: unknown;
  }): Promise<RestoreCheck>;
}
export interface ExecutionHistoryAntiResurrectionAdapter {
  writeExact(executionHistoryPayload: unknown): Promise<RestoreCheck>;
  verifyExact(executionHistoryPayload: unknown): Promise<RestoreCheck>;
}
export const EXECUTION_HISTORY_ANTI_RESURRECTION_KEY = "dayframe-execution-history-idb-established";

export function createExecutionHistoryAntiResurrectionAdapter(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
): ExecutionHistoryAntiResurrectionAdapter {
  function desired(payload: unknown): string | null | undefined {
    if (!record(payload) || !("antiResurrection" in payload)) return undefined;
    return payload.antiResurrection === null || typeof payload.antiResurrection === "string"
      ? payload.antiResurrection
      : undefined;
  }
  async function writeExact(payload: unknown): Promise<RestoreCheck> {
    const value = desired(payload);
    if (value === undefined) return { status: "failure", reason: "invalidAntiResurrectionState" };
    try {
      if (value === null) storage.removeItem(EXECUTION_HISTORY_ANTI_RESURRECTION_KEY);
      else storage.setItem(EXECUTION_HISTORY_ANTI_RESURRECTION_KEY, value);
    } catch {
      return { status: "failure", reason: "storageFailure" };
    }
    return verifyExact(payload);
  }
  async function verifyExact(payload: unknown): Promise<RestoreCheck> {
    const value = desired(payload);
    if (value === undefined) return { status: "failure", reason: "invalidAntiResurrectionState" };
    try {
      return storage.getItem(EXECUTION_HISTORY_ANTI_RESURRECTION_KEY) === value
        ? { status: "success" }
        : { status: "failure", reason: "antiResurrectionMismatch" };
    } catch {
      return { status: "failure", reason: "storageFailure" };
    }
  }
  return { writeExact, verifyExact };
}

export type ExecutionHistoryPhysicalAuthority = {
  records: unknown[];
  quarantine: unknown[];
  metadata: unknown[];
  antiResurrection?: unknown;
};
export type HistoricalPlanPhysicalAuthority = { batches: unknown[]; days: unknown[] };

export function createCombinedIndexedDbRestoreAdapter(
  storage: IndexedDbCollectionStorage,
): CombinedIndexedDbRestoreAdapter {
  function payloads(value: {
    executionHistory: unknown;
    historicalPlan: unknown;
    goals: unknown;
    measurementDefinitions: unknown;
    progressObservations: unknown;
    goalStructure: unknown;
    goalPlanning: unknown;
    composition: unknown;
    proposals: unknown;
    realizations?: unknown;
  }) {
    if (
      !physicalExecution(value.executionHistory) ||
      !physicalHistorical(value.historicalPlan) ||
      !record(value.goals) ||
      !Array.isArray(value.goals.goals) ||
      !record(value.measurementDefinitions) ||
      !Array.isArray(value.measurementDefinitions.definitions) ||
      !record(value.progressObservations) ||
      !Array.isArray(value.progressObservations.observations) ||
      !record(value.goalStructure) ||
      !Array.isArray(value.goalStructure.relationships) ||
      !Array.isArray(value.goalStructure.milestones) ||
      !record(value.goalPlanning) ||
      !Array.isArray(value.goalPlanning.demands) ||
      !Array.isArray(value.goalPlanning.priorities) ||
      (value.goalPlanning.version === 2 &&
        (!Array.isArray(value.goalPlanning.footprintSpecifications) ||
          !Array.isArray(value.goalPlanning.footprintAssociations))) ||
      !record(value.composition) ||
      !Array.isArray(value.composition.relationships) ||
      !Array.isArray(value.composition.decisions) ||
      !record(value.proposals) ||
      !Array.isArray(value.proposals.proposals) ||
      !Array.isArray(value.proposals.candidates) ||
      !Array.isArray(value.proposals.decisions) ||
      !Array.isArray(value.proposals.acceptedAllocations) ||
      (value.realizations !== undefined &&
        (!record(value.realizations) ||
          !Array.isArray(value.realizations.realizations) ||
          !Array.isArray(value.realizations.facts)))
    )
      return undefined;
    return {
      execution: {
        records: value.executionHistory.records,
        quarantine: value.executionHistory.quarantine,
        metadata: value.executionHistory.metadata,
      },
      historical: value.historicalPlan,
      goals: value.goals.goals,
      measurementDefinitions: value.measurementDefinitions.definitions,
      progressObservations: value.progressObservations.observations,
      goalStructure: [...value.goalStructure.relationships, ...value.goalStructure.milestones],
      goalPlanning: [
        ...value.goalPlanning.demands,
        ...value.goalPlanning.priorities,
        ...(Array.isArray(value.goalPlanning.footprintSpecifications)
          ? value.goalPlanning.footprintSpecifications
          : []),
        ...(Array.isArray(value.goalPlanning.footprintAssociations)
          ? value.goalPlanning.footprintAssociations
          : []),
      ],
      composition: [...value.composition.relationships, ...value.composition.decisions],
      proposals: [
        ...value.proposals.proposals,
        ...value.proposals.candidates,
        ...value.proposals.decisions,
        ...value.proposals.acceptedAllocations,
      ],
      realizations: value.realizations
        ? [
            ...(value.realizations.realizations as unknown[]),
            ...(value.realizations.facts as unknown[]),
          ]
        : [],
    };
  }
  async function replaceExact(value: {
    executionHistory: unknown;
    historicalPlan: unknown;
    goals: unknown;
    measurementDefinitions: unknown;
    progressObservations: unknown;
    goalStructure: unknown;
    goalPlanning: unknown;
    composition: unknown;
    proposals: unknown;
    realizations?: unknown;
  }): Promise<RestoreCheck> {
    const checked = payloads(value);
    if (!checked) return { status: "failure", reason: "invalidPhysicalPayload" };
    const result = await storage.mutate([
      { type: "clear", store: EXECUTION_HISTORY_RECORD_STORE },
      { type: "clear", store: EXECUTION_HISTORY_QUARANTINE_STORE },
      { type: "clear", store: EXECUTION_HISTORY_METADATA_STORE },
      { type: "clear", store: HISTORICAL_PLAN_BATCH_STORE },
      { type: "clear", store: HISTORICAL_PLAN_DAY_STORE },
      { type: "clear", store: GOAL_AUTHORITY_STORE },
      { type: "clear", store: MEASUREMENT_DEFINITION_STORE },
      { type: "clear", store: PROGRESS_OBSERVATION_STORE },
      { type: "clear", store: GOAL_STRUCTURE_STORE },
      { type: "clear", store: GOAL_PLANNING_STORE },
      { type: "clear", store: COMPOSITION_AUTHORITY_STORE },
      { type: "clear", store: PROPOSAL_AUTHORITY_STORE },
      { type: "clear", store: REALIZATION_AUTHORITY_STORE },
      ...checked.execution.records.map((entry) => ({
        type: "put" as const,
        store: EXECUTION_HISTORY_RECORD_STORE,
        value: entry,
      })),
      ...checked.execution.quarantine.map((entry) => ({
        type: "put" as const,
        store: EXECUTION_HISTORY_QUARANTINE_STORE,
        value: entry,
      })),
      ...checked.execution.metadata.map((entry) => ({
        type: "put" as const,
        store: EXECUTION_HISTORY_METADATA_STORE,
        value: entry,
      })),
      ...checked.historical.batches.map((entry) => ({
        type: "put" as const,
        store: HISTORICAL_PLAN_BATCH_STORE,
        value: entry,
      })),
      ...checked.historical.days.map((entry) => ({
        type: "put" as const,
        store: HISTORICAL_PLAN_DAY_STORE,
        value: entry,
      })),
      ...checked.goals.map((entry: unknown) => ({
        type: "put" as const,
        store: GOAL_AUTHORITY_STORE,
        value: entry,
      })),
      ...checked.measurementDefinitions.map((entry: unknown) => ({
        type: "put" as const,
        store: MEASUREMENT_DEFINITION_STORE,
        value: entry,
      })),
      ...checked.progressObservations.map((entry: unknown) => ({
        type: "put" as const,
        store: PROGRESS_OBSERVATION_STORE,
        value: entry,
      })),
      ...checked.goalStructure.map((entry: unknown) => ({
        type: "put" as const,
        store: GOAL_STRUCTURE_STORE,
        value: entry,
      })),
      ...checked.goalPlanning.map((entry: unknown) => ({
        type: "put" as const,
        store: GOAL_PLANNING_STORE,
        value: entry,
      })),
      ...checked.composition.map((entry: unknown) => ({
        type: "put" as const,
        store: COMPOSITION_AUTHORITY_STORE,
        value: entry,
      })),
      ...checked.proposals.map((entry: unknown) => ({
        type: "put" as const,
        store: PROPOSAL_AUTHORITY_STORE,
        value: entry,
      })),
      ...checked.realizations.map((entry: unknown) => ({
        type: "put" as const,
        store: REALIZATION_AUTHORITY_STORE,
        value: entry,
      })),
    ]);
    return result.status === "success"
      ? { status: "success" }
      : { status: "failure", reason: result.error.code };
  }
  async function verifyExact(value: {
    executionHistory: unknown;
    historicalPlan: unknown;
    goals: unknown;
    measurementDefinitions: unknown;
    progressObservations: unknown;
    goalStructure: unknown;
    goalPlanning: unknown;
    composition: unknown;
    proposals: unknown;
    realizations?: unknown;
  }): Promise<RestoreCheck> {
    const expected = payloads(value);
    if (!expected) return { status: "failure", reason: "invalidPhysicalPayload" };
    const [
      records,
      quarantine,
      metadata,
      batches,
      days,
      goals,
      measurementDefinitions,
      progressObservations,
      goalStructure,
      goalPlanning,
      composition,
      proposals,
      realizations,
    ] = await Promise.all([
      storage.getAll<unknown>(EXECUTION_HISTORY_RECORD_STORE),
      storage.getAll<unknown>(EXECUTION_HISTORY_QUARANTINE_STORE),
      storage.getAll<unknown>(EXECUTION_HISTORY_METADATA_STORE),
      storage.getAll<unknown>(HISTORICAL_PLAN_BATCH_STORE),
      storage.getAll<unknown>(HISTORICAL_PLAN_DAY_STORE),
      storage.getAll<unknown>(GOAL_AUTHORITY_STORE),
      storage.getAll<unknown>(MEASUREMENT_DEFINITION_STORE),
      storage.getAll<unknown>(PROGRESS_OBSERVATION_STORE),
      storage.getAll<unknown>(GOAL_STRUCTURE_STORE),
      storage.getAll<unknown>(GOAL_PLANNING_STORE),
      storage.getAll<unknown>(COMPOSITION_AUTHORITY_STORE),
      storage.getAll<unknown>(PROPOSAL_AUTHORITY_STORE),
      storage.getAll<unknown>(REALIZATION_AUTHORITY_STORE),
    ]);
    if (
      [
        records,
        quarantine,
        metadata,
        batches,
        days,
        goals,
        measurementDefinitions,
        progressObservations,
        goalStructure,
        goalPlanning,
        composition,
        proposals,
        realizations,
      ].some((result) => result.status === "failure")
    )
      return { status: "failure", reason: "readFailed" };
    const actual = {
      execution: {
        records: successValue(records),
        quarantine: successValue(quarantine),
        metadata: successValue(metadata),
      },
      historical: { batches: successValue(batches), days: successValue(days) },
      goals: successValue(goals),
      measurementDefinitions: successValue(measurementDefinitions),
      progressObservations: successValue(progressObservations),
      goalStructure: successValue(goalStructure),
      goalPlanning: successValue(goalPlanning),
      composition: successValue(composition),
      proposals: successValue(proposals),
      realizations: successValue(realizations),
    };
    return semanticFingerprint(sortedPhysical(actual)) ===
      semanticFingerprint(sortedPhysical(expected))
      ? { status: "success" }
      : { status: "failure", reason: "physicalMismatch" };
  }
  return { replaceExact, verifyExact };
}

export function assertRestoreParticipants(participants: readonly RestoreParticipantAdapter[]) {
  const expected = [
    "active",
    "profiles",
    "planDecisions",
    "executionHistory",
    "historicalPlan",
    "goals",
    "measurementDefinitions",
    "progressObservations",
    "goalStructure",
    "goalPlanning",
    "composition",
    "proposals",
    "realizations",
  ];
  const actual = participants.map((value) => value.id).sort();
  if (
    new Set(actual).size !== expected.length ||
    JSON.stringify(actual) !== JSON.stringify([...expected].sort())
  )
    throw new Error("Restore requires exactly one adapter for each authority participant.");
  const indexed = participants
    .filter((value) => value.durableKind === "indexedDb")
    .map((value) => value.id)
    .sort();
  if (
    JSON.stringify(indexed) !==
    JSON.stringify(
      [
        "executionHistory",
        "goals",
        "historicalPlan",
        "measurementDefinitions",
        "progressObservations",
        "goalStructure",
        "goalPlanning",
        "composition",
        "proposals",
        "realizations",
      ].sort(),
    )
  )
    throw new Error("Durable collection authorities use combined IndexedDB replacement.");
}

function physicalExecution(value: unknown): value is ExecutionHistoryPhysicalAuthority {
  return (
    record(value) &&
    (exact(value, ["records", "quarantine", "metadata"]) ||
      exact(value, ["records", "quarantine", "metadata", "antiResurrection"])) &&
    Array.isArray(value.records) &&
    Array.isArray(value.quarantine) &&
    Array.isArray(value.metadata)
  );
}
function physicalHistorical(value: unknown): value is HistoricalPlanPhysicalAuthority {
  return (
    record(value) &&
    exact(value, ["batches", "days"]) &&
    Array.isArray(value.batches) &&
    Array.isArray(value.days)
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function exact(value: Record<string, unknown>, keys: string[]) {
  return Object.keys(value).length === keys.length && keys.every((key) => key in value);
}
function successValue<T>(value: { status: "success"; value: T } | { status: "failure" }): T {
  return value.status === "success" ? value.value : ([] as T);
}
function sortedPhysical<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, entry) =>
      Array.isArray(entry)
        ? [...entry].sort((left, right) =>
            semanticFingerprint(left).localeCompare(semanticFingerprint(right)),
          )
        : entry,
    ),
  ) as T;
}
