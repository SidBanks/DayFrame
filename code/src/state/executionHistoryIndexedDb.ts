import { cloneExecutionRecord, type ExecutionRecordV1 } from "../core/execution/executionRecord.js";
import { durableReferenceKey } from "../core/historicalPlan/historicalPlanFingerprint.js";
import { createDayFrameDurableDb, EXECUTION_HISTORY_METADATA_STORE, EXECUTION_HISTORY_QUARANTINE_STORE,
  EXECUTION_HISTORY_RECORD_STORE } from "../infrastructure/storage/dayFrameDurableDb.js";
import type { DurableStorageError, IndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import { createExecutionHistoryEnvelope, validateExecutionHistoryEnvelope, type ExecutionHistoryEnvelopeV1,
  type QuarantinedExecutionHistoryComponent } from "./executionHistorySurface.js";

export const EXECUTION_HISTORY_AUTHORITY_MARKER_KEY = "dayframe-execution-history-idb-established";
export const EXECUTION_HISTORY_METADATA_KEY = "executionHistory";

export type PhysicalExecutionRecord = { recordId: string; subjectId: string; recordedAt: string;
  plannedReferenceKey: string; recordVersion: number; record: ExecutionRecordV1 };
export type ExecutionHistoryMetadata = { surface: typeof EXECUTION_HISTORY_METADATA_KEY; version: 1;
  authorityState: "staged" | "established"; legacyFingerprint: string; recordCount: number; quarantineCount: number };

export type ExecutionHistoryIndexedDbRead =
  | { status: "noAuthority" }
  | { status: "staged" | "established"; envelope: ExecutionHistoryEnvelopeV1; metadata: ExecutionHistoryMetadata }
  | { status: "protected"; reason: "invalidMetadata" | "invalidRecord" | "physicalMismatch" | "unsupportedVersion"; evidence: string }
  | { status: "unavailable"; error: DurableStorageError };

export function createExecutionHistoryIndexedDb(options: { storage?: IndexedDbCollectionStorage } = {}) {
  const storage = options.storage ?? createDayFrameDurableDb();

  async function readEnvelope(allowIsolation = true): Promise<{ status: "success"; envelope: ExecutionHistoryEnvelopeV1 } |
    { status: "failure"; result: Extract<ExecutionHistoryIndexedDbRead, { status: "protected" | "unavailable" }> }> {
    const recordsResult = await storage.getAll<PhysicalExecutionRecord>(EXECUTION_HISTORY_RECORD_STORE);
    const quarantineResult = await storage.getAll<QuarantinedExecutionHistoryComponent>(EXECUTION_HISTORY_QUARANTINE_STORE);
    if (recordsResult.status === "failure") return { status: "failure", result: { status: "unavailable", error: recordsResult.error } };
    if (quarantineResult.status === "failure") return { status: "failure", result: { status: "unavailable", error: quarantineResult.error } };
    const rawRecords: unknown[] = [];
    for (const wrapper of recordsResult.value) {
      if (!record(wrapper) || !exact(wrapper, ["recordId", "subjectId", "recordedAt", "plannedReferenceKey", "recordVersion", "record"])) return { status: "failure", result: protectedResult("physicalMismatch", await physicalEvidence()) };
      if (!record(wrapper.record) || wrapper.record.id !== wrapper.recordId || wrapper.record.subjectId !== wrapper.subjectId ||
          wrapper.record.recordedAt !== wrapper.recordedAt || wrapper.record.version !== wrapper.recordVersion) return { status: "failure", result: protectedResult("physicalMismatch", await physicalEvidence()) };
      rawRecords.push(structuredClone(wrapper.record));
    }
    const validation = validateExecutionHistoryEnvelope({ app: "DayFrame", surface: "executionHistory", version: 1,
      records: rawRecords, quarantinedComponents: quarantineResult.value });
    if (validation.status !== "valid") return { status: "failure", result: protectedResult(validation.reason === "unsupportedVersion" ? "unsupportedVersion" : "invalidRecord", await physicalEvidence()) };
    const existingIds = new Set(quarantineResult.value.map((value) => value.quarantineId));
    const derived = validation.envelope.quarantinedComponents.filter((value) => !existingIds.has(value.quarantineId));
    if (derived.length && allowIsolation) {
      const validIds = new Set<string>(validation.envelope.records.map((value) => value.id));
      const metadata = await storage.get<ExecutionHistoryMetadata>(EXECUTION_HISTORY_METADATA_STORE, EXECUTION_HISTORY_METADATA_KEY);
      if (metadata.status === "failure" || !metadata.value || !validMetadata(metadata.value)) return { status: "failure", result: protectedResult("invalidMetadata", await physicalEvidence()) };
      const isolated = await storage.mutate([
        ...recordsResult.value.filter((value) => !validIds.has(value.recordId)).map((value) => ({ type: "delete" as const, store: EXECUTION_HISTORY_RECORD_STORE, key: value.recordId })),
        ...derived.map((value) => ({ type: "put" as const, store: EXECUTION_HISTORY_QUARANTINE_STORE, value })),
        { type: "put", store: EXECUTION_HISTORY_METADATA_STORE, value: { ...metadata.value,
          recordCount: validation.envelope.records.length, quarantineCount: validation.envelope.quarantinedComponents.length } },
      ]);
      if (isolated.status === "failure") return { status: "failure", result: { status: "unavailable", error: isolated.error } };
      return readEnvelope(false);
    }
    return { status: "success", envelope: validation.envelope };
  }

  async function readAuthority(): Promise<ExecutionHistoryIndexedDbRead> {
    const opened = await storage.open(); if (opened.status === "failure") return { status: "unavailable", error: opened.error };
    const metadataResult = await storage.get<ExecutionHistoryMetadata>(EXECUTION_HISTORY_METADATA_STORE, EXECUTION_HISTORY_METADATA_KEY);
    if (metadataResult.status === "failure") return { status: "unavailable", error: metadataResult.error };
    if (!metadataResult.value) return { status: "noAuthority" };
    let metadata = metadataResult.value;
    if (!validMetadata(metadata)) return protectedResult("invalidMetadata", await physicalEvidence());
    const loaded = await readEnvelope();
    if (loaded.status !== "success") return loaded.result;
    const refreshed = await storage.get<ExecutionHistoryMetadata>(EXECUTION_HISTORY_METADATA_STORE, EXECUTION_HISTORY_METADATA_KEY);
    if (refreshed.status === "failure") return { status: "unavailable", error: refreshed.error };
    if (!refreshed.value || !validMetadata(refreshed.value)) return protectedResult("invalidMetadata", await physicalEvidence());
    metadata = refreshed.value;
    if (loaded.envelope.records.length !== metadata.recordCount || loaded.envelope.quarantinedComponents.length !== metadata.quarantineCount) {
      return protectedResult("physicalMismatch", await physicalEvidence());
    }
    return { status: metadata.authorityState, envelope: loaded.envelope, metadata: structuredClone(metadata) };
  }

  async function stageMigration(envelope: ExecutionHistoryEnvelopeV1, legacyFingerprint: string) {
    const validation = validateExecutionHistoryEnvelope(envelope); if (validation.status !== "valid") return failure("writeFailed", "stageExecutionHistoryMigration");
    const metadata: ExecutionHistoryMetadata = { surface: EXECUTION_HISTORY_METADATA_KEY, version: 1, authorityState: "staged",
      legacyFingerprint, recordCount: validation.envelope.records.length, quarantineCount: validation.envelope.quarantinedComponents.length };
    const result = await storage.mutate([{ type: "clear", store: EXECUTION_HISTORY_RECORD_STORE }, { type: "clear", store: EXECUTION_HISTORY_QUARANTINE_STORE },
      ...validation.envelope.records.map((record) => ({ type: "put" as const, store: EXECUTION_HISTORY_RECORD_STORE, value: physicalRecord(record) })),
      ...validation.envelope.quarantinedComponents.map((component) => ({ type: "put" as const, store: EXECUTION_HISTORY_QUARANTINE_STORE, value: structuredClone(component) })),
      { type: "put", store: EXECUTION_HISTORY_METADATA_STORE, value: metadata }]);
    if (result.status === "failure") return result;
    const verified = await readAuthority();
    return (verified.status === "staged" && envelopeEqual(verified.envelope, validation.envelope)) ? result : failure("readFailed", "verifyExecutionHistoryMigration");
  }

  async function establishAuthority() {
    const current = await readAuthority();
    if (current.status !== "staged" && current.status !== "established") return current.status === "unavailable" ? current : failure("writeFailed", "establishExecutionHistoryAuthority");
    if (current.status === "established") return { status: "success" as const, value: undefined };
    const metadata = { ...current.metadata, authorityState: "established" as const };
    const written = await storage.put(EXECUTION_HISTORY_METADATA_STORE, metadata); if (written.status === "failure") return written;
    const reread = await readAuthority(); return reread.status === "established" && envelopeEqual(reread.envelope, current.envelope)
      ? { status: "success" as const, value: undefined } : failure("readFailed", "verifyExecutionHistoryAuthority");
  }

  async function appendRecords(records: readonly ExecutionRecordV1[]) {
    const authority = await readAuthority(); if (authority.status !== "established") return failure("writeFailed", "appendExecutionHistoryRecords");
    for (const record of records) {
      const existing = await storage.get<PhysicalExecutionRecord>(EXECUTION_HISTORY_RECORD_STORE, record.id);
      if (existing.status === "failure") return existing;
      if (existing.value && !physicalRecordEqual(existing.value, record)) return failure("constraintViolation", "appendExecutionHistoryRecords");
    }
    const missing: ExecutionRecordV1[] = [];
    for (const record of records) { const existing = await storage.get<PhysicalExecutionRecord>(EXECUTION_HISTORY_RECORD_STORE, record.id); if (existing.status === "failure") return existing; if (!existing.value) missing.push(record); }
    const desired = createExecutionHistoryEnvelope([...authority.envelope.records, ...missing], authority.envelope.quarantinedComponents);
    const metadata = { ...authority.metadata, recordCount: desired.records.length };
    const committed = await storage.mutate([
      ...missing.map((record) => ({ type: "put" as const, store: EXECUTION_HISTORY_RECORD_STORE, value: physicalRecord(record) })),
      { type: "put", store: EXECUTION_HISTORY_METADATA_STORE, value: metadata },
    ]); if (committed.status === "failure") return committed;
    const verified = await readAuthority(); return verified.status === "established" && envelopeEqual(verified.envelope, desired)
      ? { status: "success" as const, value: undefined } : failure("readFailed", "verifyExecutionHistoryAppend");
  }

  async function replaceAuthority(envelope: ExecutionHistoryEnvelopeV1) {
    const validation = validateExecutionHistoryEnvelope(envelope); if (validation.status !== "valid") return failure("writeFailed", "replaceExecutionHistoryAuthority");
    const prior = await readAuthority(); const fingerprint = prior.status === "staged" || prior.status === "established" ? prior.metadata.legacyFingerprint : "recovery";
    const staged = await stageMigration(validation.envelope, fingerprint); if (staged.status === "failure") return staged;
    return establishAuthority();
  }

  async function removeQuarantine(quarantineId: string) {
    const authority = await readAuthority(); if (authority.status !== "established") return failure("readFailed", "removeExecutionHistoryQuarantine");
    const expected = authority.envelope.quarantinedComponents.filter((value) => value.quarantineId !== quarantineId);
    const metadata = { ...authority.metadata, quarantineCount: expected.length };
    const removed = await storage.mutate([{ type: "delete", store: EXECUTION_HISTORY_QUARANTINE_STORE, key: quarantineId },
      { type: "put", store: EXECUTION_HISTORY_METADATA_STORE, value: metadata }]); if (removed.status === "failure") return removed;
    const verified = await readAuthority(); return verified.status === "established" && verified.envelope.quarantinedComponents.length === expected.length
      ? { status: "success" as const, value: undefined } : failure("readFailed", "verifyExecutionHistoryQuarantineRemoval");
  }

  async function clearEstablishedAuthority() { return replaceAuthority(createExecutionHistoryEnvelope([], [])); }
  async function physicalEvidence(): Promise<string | undefined> {
    const metadata = await storage.getAll<unknown>(EXECUTION_HISTORY_METADATA_STORE); const records = await storage.getAll<unknown>(EXECUTION_HISTORY_RECORD_STORE); const quarantine = await storage.getAll<unknown>(EXECUTION_HISTORY_QUARANTINE_STORE);
    return metadata.status === "success" && records.status === "success" && quarantine.status === "success" ? JSON.stringify({ metadata: metadata.value, records: records.value, quarantine: quarantine.value }) : undefined;
  }
  function close() { storage.close(); }
  return { readAuthority, stageMigration, establishAuthority, appendRecords, replaceAuthority,
    removeQuarantine, clearEstablishedAuthority, physicalEvidence, close };
}

export type ExecutionHistoryIndexedDb = ReturnType<typeof createExecutionHistoryIndexedDb>;
export function createPhysicalExecutionRecord(record: ExecutionRecordV1): PhysicalExecutionRecord { return { recordId: record.id, subjectId: record.subjectId, recordedAt: record.recordedAt,
  plannedReferenceKey: record.kind === "assertion" && record.subject.kind === "planned" ? durableReferenceKey(record.subject.reference) : "", recordVersion: record.version,
  record: cloneExecutionRecord(record) }; }
const physicalRecord = createPhysicalExecutionRecord;
function physicalRecordEqual(value: PhysicalExecutionRecord, record: ExecutionRecordV1) { const expected = physicalRecord(record); return exact(value, ["recordId", "subjectId", "recordedAt", "plannedReferenceKey", "recordVersion", "record"]) && JSON.stringify(value) === JSON.stringify(expected); }
function envelopeEqual(left: ExecutionHistoryEnvelopeV1, right: ExecutionHistoryEnvelopeV1) { return JSON.stringify(createExecutionHistoryEnvelope(left.records, left.quarantinedComponents)) === JSON.stringify(createExecutionHistoryEnvelope(right.records, right.quarantinedComponents)); }
function validMetadata(value: unknown): value is ExecutionHistoryMetadata { return record(value) && exact(value, ["surface", "version", "authorityState", "legacyFingerprint", "recordCount", "quarantineCount"]) && value.surface === EXECUTION_HISTORY_METADATA_KEY && value.version === 1 && (value.authorityState === "staged" || value.authorityState === "established") && typeof value.legacyFingerprint === "string" && Number.isSafeInteger(value.recordCount) && Number.isSafeInteger(value.quarantineCount); }
function exact(value: Record<string, unknown>, keys: string[]) { const expected = new Set(keys); return Object.keys(value).length === keys.length && Object.keys(value).every((key) => expected.has(key)); }
function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function failure(code: DurableStorageError["code"], operation: string) { return { status: "failure" as const, error: { code, operation } }; }
function protectedResult(reason: Extract<ExecutionHistoryIndexedDbRead, { status: "protected" }>["reason"], evidence?: string): Extract<ExecutionHistoryIndexedDbRead, { status: "protected" }> { return { status: "protected", reason, evidence: evidence ?? "unreadable" }; }
