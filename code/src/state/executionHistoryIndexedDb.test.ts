import { IDBFactory } from "fake-indexeddb";
import { beforeEach, describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../core/authored/sourceIncarnation.js";
import { createExecutionAssertion, type ExecutionRecordId, type ExecutionSubjectId } from "../core/execution/executionRecord.js";
import type { DurableOccurrenceReference } from "../core/occurrences/durableOccurrenceReference.js";
import { createDayFrameDurableDb, EXECUTION_HISTORY_RECORD_STORE, HISTORICAL_PLAN_BATCH_STORE } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createIndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import { createExecutionHistoryIndexedDb, EXECUTION_HISTORY_AUTHORITY_MARKER_KEY } from "./executionHistoryIndexedDb.js";
import { createExecutionHistoryEnvelope, createExecutionHistorySurface, DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY,
  type ExecutionHistoryEnvelopeV1 } from "./executionHistorySurface.js";

class MemoryStorage implements Storage {
  values = new Map<string, string>(); failWrite = false;
  get length() { return this.values.size; } clear() { this.values.clear(); } key(index: number) { return [...this.values.keys()][index] ?? null; }
  getItem(key: string) { return this.values.get(key) ?? null; } removeItem(key: string) { if (this.failWrite) throw new Error("write"); this.values.delete(key); }
  setItem(key: string, value: string) { if (this.failWrite) throw new Error("write"); this.values.set(key, value); }
}
const recordId = "00000000-0000-4000-8000-000000000001" as ExecutionRecordId;
const subjectId = "10000000-0000-4000-8000-000000000001" as ExecutionSubjectId;
const reference: DurableOccurrenceReference = { version: 1, sourceKind: "template",
  template: { id: "template", incarnationId: "20000000-0000-4000-8000-000000000001" as SourceIncarnationId },
  recurrence: { id: "recurrence", incarnationId: "20000000-0000-4000-8000-000000000002" as SourceIncarnationId },
  coordinate: { frequency: "daily", scopeKind: "userDay", userDayDate: "2026-08-20", slot: 0 } };
const input = { subject: { kind: "planned" as const, reference }, snapshot: { sourceFamily: "template" as const, title: "Workout", category: "fitness" as const,
  userDay: { date: "2026-08-20" as const, dayBoundaryStartTime: "03:00" as const, utcOffsetMinutes: -300 },
  plan: { state: "scheduled" as const, startsAt: "2026-08-20T15:00:00.000Z", endsAt: "2026-08-20T16:00:00.000Z" } },
  outcome: "completed" as const, actualTime: { occurredAt: "2026-08-20T15:10:00.000Z", durationMinutes: 50 }, note: "exact note" };
function envelope(): ExecutionHistoryEnvelopeV1 { const result = createExecutionAssertion(input, { allocateRecordId: () => recordId,
  allocateSubjectId: () => subjectId, now: () => "2026-08-20T18:00:00.000Z" }); if (result.status !== "created") throw new Error("fixture"); return createExecutionHistoryEnvelope([result.record], []); }
let local: MemoryStorage; let database = 0;
beforeEach(() => { local = new MemoryStorage(); Object.defineProperty(globalThis, "localStorage", { configurable: true, value: local }); });
function setup(factory = new IDBFactory(), name = `execution-history-${database++}`) { const storage = createDayFrameDurableDb({ indexedDB: factory, name }); return { factory, name, storage, indexed: createExecutionHistoryIndexedDb({ storage }) }; }

describe("ExecutionHistory V1 IndexedDB migration", () => {
  it("migrates exact valid records without allocating and retains legacy evidence", async () => {
    const legacy = envelope(); local.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify(legacy)); const { indexed } = setup();
    const surface = createExecutionHistorySurface({ indexedDb: indexed, allocateRecordId: () => { throw new Error("allocate"); }, allocateSubjectId: () => { throw new Error("allocate"); } });
    await surface.initializeExecutionHistory();
    expect(surface.getExecutionHistoryMigrationStatus()).toBe("readyIndexedDb");
    expect(surface.getExecutionHistory()).toEqual(legacy.records);
    expect(local.getItem(EXECUTION_HISTORY_AUTHORITY_MARKER_KEY)).toBe("1");
    expect(local.getItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY)).toBe(JSON.stringify(legacy));
  });
  it("preserves correction-chain fields, actual evidence, notes, references, and quarantine", async () => {
    const legacy = envelope(); legacy.quarantinedComponents = [{ quarantineId: "q1", reason: "orphanRecord", rawRecords: [{ malformed: true }], knownSubjectIds: [], knownRecordIds: [] }];
    local.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify(legacy)); const { indexed } = setup(); const surface = createExecutionHistorySurface({ indexedDb: indexed });
    await surface.initializeExecutionHistory(); expect(surface.exportExecutionHistoryEnvelope()).toEqual(legacy);
    expect(surface.getExecutionHistory()[0]).toMatchObject({ note: "exact note", actualTime: { durationMinutes: 50 }, subject: { reference } });
    expect(surface.getQuarantinedExecutionHistory()).toEqual(legacy.quarantinedComponents);
  });
  it("establishes empty authority when no legacy key and never resurrects later stale local data", async () => {
    const factory = new IDBFactory(); const name = `execution-history-${database++}`; const setupValue = setup(factory, name);
    const first = createExecutionHistorySurface({ indexedDb: setupValue.indexed }); await first.initializeExecutionHistory();
    expect(first.getExecutionHistory()).toEqual([]); expect(local.getItem(EXECUTION_HISTORY_AUTHORITY_MARKER_KEY)).toBe("1");
    local.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify(envelope())); setupValue.indexed.close();
    const restarted = createExecutionHistorySurface({ indexedDb: setup(factory, name).indexed }); await restarted.initializeExecutionHistory();
    expect(restarted.getExecutionHistory()).toEqual([]); expect(restarted.getExecutionHistoryMigrationStatus()).toBe("readyIndexedDb");
  });
  it("uses IndexedDB-first startup despite changed retained legacy evidence", async () => {
    const factory = new IDBFactory(); const name = `execution-history-${database++}`; local.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify(envelope()));
    const first = setup(factory, name); const surface = createExecutionHistorySurface({ indexedDb: first.indexed }); await surface.initializeExecutionHistory(); first.indexed.close();
    local.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify(createExecutionHistoryEnvelope([], [])));
    const restarted = createExecutionHistorySurface({ indexedDb: setup(factory, name).indexed }); await restarted.initializeExecutionHistory();
    expect(restarted.getExecutionHistory()).toHaveLength(1);
  });
  it("does not switch writers when the anti-resurrection marker cannot be established", async () => {
    local.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify(envelope())); local.failWrite = true;
    const { indexed } = setup(); const surface = createExecutionHistorySurface({ indexedDb: indexed }); await surface.initializeExecutionHistory();
    expect(surface.getExecutionHistoryMigrationStatus()).toBe("legacyAuthority"); expect(local.getItem(EXECUTION_HISTORY_AUTHORITY_MARKER_KEY)).toBeNull();
    expect(surface.getExecutionHistory()).toHaveLength(1);
  });
  it("appends ordinary reports transactionally and verifies them after switch", async () => {
    const { indexed, storage } = setup(); const surface = createExecutionHistorySurface({ indexedDb: indexed,
      allocateRecordId: () => recordId, allocateSubjectId: () => subjectId, now: () => "2026-08-20T18:00:00.000Z" }); await surface.initializeExecutionHistory();
    const result = surface.recordExecution(input); expect(result).toMatchObject({ status: "accepted", persistence: { status: "pending" } });
    expect(surface.getExecutionHistoryDurabilityStatus()).toBe("pending"); await surface.waitForExecutionHistoryPersistence();
    expect(surface.getExecutionHistoryDurabilityStatus()).toBe("durable");
    expect(await storage.getAll(EXECUTION_HISTORY_RECORD_STORE)).toMatchObject({ status: "success", value: [{ recordId }] });
    expect(local.getItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY)).toBeNull();
  });
  it("persists correction and retraction chains in accepted order", async () => {
    const ids = [recordId, "00000000-0000-4000-8000-000000000002", "00000000-0000-4000-8000-000000000003"] as ExecutionRecordId[]; let index = 0; let hour = 18;
    const { indexed } = setup(); const surface = createExecutionHistorySurface({ indexedDb: indexed, allocateRecordId: () => ids[index++]!,
      allocateSubjectId: () => subjectId, now: () => `2026-08-20T${hour++}:00:00.000Z` }); await surface.initializeExecutionHistory();
    const first = surface.recordExecution(input); if (first.status !== "accepted") throw new Error("fixture");
    const corrected = surface.correctExecutionRecord(subjectId, first.record.id, { ...input, outcome: "partial" }); if (corrected.status !== "accepted") throw new Error("fixture");
    expect(surface.retractExecutionRecord(subjectId, corrected.record.id)).toMatchObject({ status: "accepted", persistence: { status: "pending" } });
    await surface.waitForExecutionHistoryPersistence(); expect(surface.getExecutionHistory()).toHaveLength(3); expect(surface.getExecutionHistoryDurabilityStatus()).toBe("durable");
  });
  it("retains exact pending runtime evidence on write failure and retries without allocation", async () => {
    const base = setup(); let fail = false; const storage = { ...base.storage, mutate: async (mutations: Parameters<typeof base.storage.mutate>[0]) => fail
      ? { status: "failure" as const, error: { code: "quotaExceeded" as const, operation: "mutate" } } : base.storage.mutate(mutations) };
    const indexed = createExecutionHistoryIndexedDb({ storage }); const surface = createExecutionHistorySurface({ indexedDb: indexed,
      allocateRecordId: () => recordId, allocateSubjectId: () => subjectId, now: () => "2026-08-20T18:00:00.000Z" }); await surface.initializeExecutionHistory(); fail = true;
    expect(surface.recordExecution(input)).toMatchObject({ status: "accepted", persistence: { status: "pending" } }); await surface.waitForExecutionHistoryPersistence();
    expect(surface.getExecutionHistory()).toHaveLength(1); expect(surface.getExecutionHistoryDurabilityStatus()).toBe("storageFailure");
    fail = false; expect(surface.retryExecutionHistoryPersistence()).toMatchObject({ status: "attempted", persistence: { status: "pending" } }); await surface.waitForExecutionHistoryPersistence();
    expect(surface.getExecutionHistoryDurabilityStatus()).toBe("durable");
  });
  it("protects corrupt established IndexedDB and does not fall back to valid legacy", async () => {
    local.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify(envelope())); const base = setup(); const first = createExecutionHistorySurface({ indexedDb: base.indexed }); await first.initializeExecutionHistory();
    const rows = await base.storage.getAll<Record<string, unknown>>(EXECUTION_HISTORY_RECORD_STORE); if (rows.status !== "success") throw new Error("fixture");
    await base.storage.put(EXECUTION_HISTORY_RECORD_STORE, { ...rows.value[0], subjectId: "mismatch" }); base.indexed.close();
    const restarted = createExecutionHistorySurface({ indexedDb: createExecutionHistoryIndexedDb({ storage: base.storage }) }); await restarted.initializeExecutionHistory();
    expect(restarted.getExecutionHistory()).toEqual([]); expect(restarted.getExecutionHistoryIngressStatus()).toMatchObject({ status: "recoveryRequired", reason: "indexedDbCorrupt" });
  });
  it("isolates a domain-invalid subject component while keeping IndexedDB authority established", async () => {
    local.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify(envelope())); const base = setup(); const first = createExecutionHistorySurface({ indexedDb: base.indexed }); await first.initializeExecutionHistory();
    const rows = await base.storage.getAll<Record<string, unknown>>(EXECUTION_HISTORY_RECORD_STORE); if (rows.status !== "success") throw new Error("fixture");
    const wrapper = structuredClone(rows.value[0]!); (wrapper.record as { outcome: string }).outcome = "unknown"; await base.storage.put(EXECUTION_HISTORY_RECORD_STORE, wrapper); base.indexed.close();
    const restarted = createExecutionHistorySurface({ indexedDb: createExecutionHistoryIndexedDb({ storage: base.storage }) }); await restarted.initializeExecutionHistory();
    expect(restarted.getExecutionHistoryMigrationStatus()).toBe("readyIndexedDb"); expect(restarted.getExecutionHistory()).toEqual([]);
    expect(restarted.getQuarantinedExecutionHistory()).toHaveLength(1);
  });
  it("marker prevents fallback when established IndexedDB is unavailable", async () => {
    local.setItem(EXECUTION_HISTORY_AUTHORITY_MARKER_KEY, "1"); local.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify(envelope()));
    const unavailable = createExecutionHistoryIndexedDb({ storage: createDayFrameDurableDb({ indexedDB: { open() { throw new DOMException("blocked", "SecurityError"); } } as unknown as IDBFactory, name: `execution-history-${database++}` }) });
    const surface = createExecutionHistorySurface({ indexedDb: unavailable }); await surface.initializeExecutionHistory();
    expect(surface.getExecutionHistory()).toEqual([]); expect(surface.getExecutionHistoryIngressStatus()).toMatchObject({ reason: "establishedIndexedDbUnavailable" });
  });
  it("full clear establishes durable empty authority, removes legacy data, and retains anti-resurrection marker", async () => {
    const factory = new IDBFactory(); const name = `execution-history-${database++}`; local.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify(envelope()));
    const firstSetup = setup(factory, name); const first = createExecutionHistorySurface({ indexedDb: firstSetup.indexed }); await first.initializeExecutionHistory();
    expect(await first.clearExecutionHistory()).toEqual({ status: "removed" });
    expect(local.getItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY)).toBeNull(); expect(local.getItem(EXECUTION_HISTORY_AUTHORITY_MARKER_KEY)).toBe("1"); firstSetup.indexed.close();
    local.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify(envelope())); const restarted = createExecutionHistorySurface({ indexedDb: setup(factory, name).indexed }); await restarted.initializeExecutionHistory();
    expect(restarted.getExecutionHistory()).toEqual([]);
  });
  it("ExecutionHistory clear preserves HistoricalPlan stores", async () => {
    const { indexed, storage } = setup(); const surface = createExecutionHistorySurface({ indexedDb: indexed }); await surface.initializeExecutionHistory();
    await storage.put(HISTORICAL_PLAN_BATCH_STORE, { batchId: "kept", publishedAt: "2026-08-20T00:00:00.000Z" }); await surface.clearExecutionHistory();
    expect(await storage.get(HISTORICAL_PLAN_BATCH_STORE, "kept")).toMatchObject({ status: "success", value: { batchId: "kept" } });
  });
  it("upgrades v1 to v2 without changing HistoricalPlan data", async () => {
    const factory = new IDBFactory(); const name = `execution-history-${database++}`;
    const v1 = createIndexedDbCollectionStorage({ indexedDB: factory, schema: { name, version: 1, stores: [
      { name: "historicalPlanBatches", keyPath: "batchId" }, { name: "historicalPlanDays", keyPath: ["batchId", "userDayDate"] }] } });
    await v1.put(HISTORICAL_PLAN_BATCH_STORE, { batchId: "kept", publishedAt: "2026-08-20T00:00:00.000Z" }); v1.close();
    const v2 = createDayFrameDurableDb({ indexedDB: factory, name }); expect((await v2.open()).status).toBe("success");
    expect(await v2.get(HISTORICAL_PLAN_BATCH_STORE, "kept")).toMatchObject({ status: "success", value: { batchId: "kept" } });
  });
});
