import {
  createIndexedDbCollectionStorage,
  DAYFRAME_DURABLE_DB_NAME,
  DAYFRAME_DURABLE_DB_VERSION,
  type IndexedDbCollectionStorage,
} from "./indexedDbCollectionStorage.js";

export const HISTORICAL_PLAN_BATCH_STORE = "historicalPlanBatches";
export const HISTORICAL_PLAN_DAY_STORE = "historicalPlanDays";
export const HISTORICAL_PLAN_DAY_DATE_INDEX = "byUserDayDate";
export const HISTORICAL_PLAN_DAY_AS_OF_INDEX = "byUserDayAndPublishedAt";
export const HISTORICAL_PLAN_DAY_BATCH_INDEX = "byBatchId";
export const HISTORICAL_PLAN_BATCH_TIME_INDEX = "byPublishedAt";
export const EXECUTION_HISTORY_RECORD_STORE = "executionHistoryRecords";
export const EXECUTION_HISTORY_QUARANTINE_STORE = "executionHistoryQuarantine";
export const EXECUTION_HISTORY_METADATA_STORE = "executionHistoryMetadata";
export const EXECUTION_HISTORY_SUBJECT_INDEX = "bySubjectId";
export const EXECUTION_HISTORY_RECORDED_AT_INDEX = "byRecordedAt";
export const EXECUTION_HISTORY_PLANNED_REFERENCE_INDEX = "byPlannedReferenceKey";
export const RESTORE_METADATA_STORE = "restoreMetadata";
export const RESTORE_PAYLOAD_STORE = "restorePayloads";
export const GOAL_AUTHORITY_STORE = "goals";
export const MEASUREMENT_DEFINITION_STORE = "measurementDefinitions";
export const PROGRESS_OBSERVATION_STORE = "progressObservations";
export const GOAL_STRUCTURE_STORE = "goalStructure";
export const GOAL_PLANNING_STORE = "goalPlanning";
export const COMPOSITION_AUTHORITY_STORE = "compositionAuthority";

export function createDayFrameDurableDb(
  options: { indexedDB?: IDBFactory; name?: string } = {},
): IndexedDbCollectionStorage {
  return createIndexedDbCollectionStorage({
    schema: {
      name: options.name ?? DAYFRAME_DURABLE_DB_NAME,
      version: DAYFRAME_DURABLE_DB_VERSION,
      stores: [
        {
          name: HISTORICAL_PLAN_BATCH_STORE,
          keyPath: "batchId",
          indexes: [{ name: HISTORICAL_PLAN_BATCH_TIME_INDEX, keyPath: "publishedAt" }],
        },
        {
          name: HISTORICAL_PLAN_DAY_STORE,
          keyPath: ["batchId", "userDayDate"],
          indexes: [
            { name: HISTORICAL_PLAN_DAY_DATE_INDEX, keyPath: "userDayDate" },
            { name: HISTORICAL_PLAN_DAY_AS_OF_INDEX, keyPath: ["userDayDate", "publishedAt"] },
            { name: HISTORICAL_PLAN_DAY_BATCH_INDEX, keyPath: "batchId" },
          ],
        },
        {
          name: EXECUTION_HISTORY_RECORD_STORE,
          keyPath: "recordId",
          indexes: [
            { name: EXECUTION_HISTORY_SUBJECT_INDEX, keyPath: "subjectId" },
            { name: EXECUTION_HISTORY_RECORDED_AT_INDEX, keyPath: "recordedAt" },
            { name: EXECUTION_HISTORY_PLANNED_REFERENCE_INDEX, keyPath: "plannedReferenceKey" },
          ],
        },
        { name: EXECUTION_HISTORY_QUARANTINE_STORE, keyPath: "quarantineId" },
        { name: EXECUTION_HISTORY_METADATA_STORE, keyPath: "surface" },
        { name: RESTORE_METADATA_STORE, keyPath: "transactionId" },
        { name: RESTORE_PAYLOAD_STORE, keyPath: ["transactionId", "side", "participantId"] },
        { name: GOAL_AUTHORITY_STORE, keyPath: "id" },
        {
          name: MEASUREMENT_DEFINITION_STORE,
          keyPath: ["id", "revision"],
          indexes: [{ name: "byGoalId", keyPath: "goalId" }],
        },
        {
          name: PROGRESS_OBSERVATION_STORE,
          keyPath: ["id", "revision"],
          indexes: [
            { name: "byGoalId", keyPath: "goalId" },
            { name: "byDefinitionRevision", keyPath: ["definitionId", "definitionRevision"] },
            { name: "byObservedAt", keyPath: "observedAt" },
          ],
        },
        {
          name: GOAL_STRUCTURE_STORE,
          keyPath: ["recordType", "id", "revision"],
          indexes: [{ name: "byGoalStructureId", keyPath: ["recordType", "id"] }],
        },
        {
          name: GOAL_PLANNING_STORE,
          keyPath: ["recordType", "id", "revision"],
          indexes: [{ name: "byGoalPlanningId", keyPath: ["recordType", "id"] }],
        },
        {
          name: COMPOSITION_AUTHORITY_STORE,
          keyPath: ["recordType", "id", "revision"],
          indexes: [{ name: "byCompositionId", keyPath: ["recordType", "id"] }],
        },
      ],
    },
    ...(options.indexedDB ? { indexedDB: options.indexedDB } : {}),
  });
}
