import { IDBFactory } from "fake-indexeddb";
import { afterEach, describe, expect, it } from "vitest";
import { createDayFrameBackupV3, backupV3SemanticFingerprint,
  validateDayFrameBackupV3 } from "./dayFrameBackupV3.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createExecutionHistoryIndexedDb } from "./executionHistoryIndexedDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  get length() { return this.values.size; } clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

afterEach(() => { delete (globalThis as { localStorage?: unknown }).localStorage; });

function emptyBackup(exportedAt = "2026-08-22T12:00:00.000Z") {
  return createDayFrameBackupV3({ active: { surfaceVersion: 2, data: {
    schedulingPreferences: { dayBoundaryStartTime: "00:00", weekStartsOn: "monday" },
    previewRange: { source: "custom", preset: "custom", startDate: "2026-08-22",
      endDate: "2026-08-22" }, shiftDefinitions: [], shiftCycles: [], blockTemplates: [],
    blockRecurrences: [], manualEvents: [] } }, profiles: { surfaceVersion: 2,
    profiles: [], quarantinedProfiles: [] }, planDecisions: { surfaceVersion: 1,
    decisions: [], quarantinedDecisions: [] }, executionHistory: { app: "DayFrame",
    surface: "executionHistory", version: 1, records: [], quarantinedComponents: [] },
    historicalPlan: { surfaceVersion: 1, batches: [] } }, exportedAt);
}

describe("Backup V3 domain format", () => {
  it("strictly validates, clone-isolates, JSON-roundtrips, and excludes exportedAt from identity", () => {
    const first = emptyBackup(); const parsed = validateDayFrameBackupV3(
      JSON.parse(JSON.stringify(first)));
    expect(parsed).toEqual(first);
    expect(backupV3SemanticFingerprint(first)).toBe(backupV3SemanticFingerprint(
      emptyBackup("2026-08-23T12:00:00.000Z")));
    parsed.data.active.data.schedulingPreferences.dayBoundaryStartTime = "05:00";
    expect(first.data.active.data.schedulingPreferences.dayBoundaryStartTime).toBe("00:00");
  });

  it("rejects wrong app, extra keys, noncanonical time, and invalid nested authority", () => {
    const backup = emptyBackup();
    expect(() => validateDayFrameBackupV3({ ...backup, app: "Other" })).toThrow();
    expect(() => validateDayFrameBackupV3({ ...backup, extra: true })).toThrow();
    expect(() => validateDayFrameBackupV3({ ...backup,
      exportedAt: "2026-08-22T07:00:00-05:00" })).toThrow();
    expect(() => validateDayFrameBackupV3({ ...backup, data: { ...backup.data,
      historicalPlan: { surfaceVersion: 1, batches: [{ bad: true }] } } })).toThrow();
  });
});

describe("Backup V3 five-surface integration", () => {
  it("exports, completely restores through the coordinator, and survives restart", async () => {
    const local = new MemoryStorage(); Object.defineProperty(globalThis, "localStorage",
      { configurable: true, value: local });
    const factory = new IDBFactory(); const name = "backup-v3-roundtrip";
    const setup = () => { const db = createDayFrameDurableDb({ indexedDB: factory, name });
      return { db, store: createDayFrameStore(undefined, { restoreStorage: local,
        restoreIndexedDb: db, executionHistoryIndexedDb:
          createExecutionHistoryIndexedDb({ storage: db }), historicalPlanSurface:
          createHistoricalPlanSurface({ storage: db }) }) }; };
    const first = setup(); expect(await first.store.whenReady()).toEqual({ status: "ready" });
    expect(first.store.setSchedulingPreferences({ dayBoundaryStartTime: "02:00" }).status)
      .toBe("applied");
    const exported = await first.store.exportBackupV3("2026-08-22T12:00:00.000Z");
    expect(exported.status).toBe("exported");
    if (exported.status !== "exported") throw new Error("Expected V3 export.");
    expect(first.store.setSchedulingPreferences({ dayBoundaryStartTime: "03:00" }).status)
      .toBe("applied");
    const restored = await first.store.importBackupV3(JSON.parse(JSON.stringify(exported.backup)));
    expect(restored).toEqual({ status: "restoredV3",
      semanticFingerprint: exported.semanticFingerprint });
    expect(first.store.getState().schedulingPreferences.dayBoundaryStartTime).toBe("02:00");
    expect(first.store.getState().preview).toBeNull();
    expect(first.store.getExecutionHistory()).toEqual([]);
    expect(first.store.getPendingPublications()).toEqual([]);
    const restarted = setup(); expect(await restarted.store.whenReady()).toEqual({ status: "ready" });
    const afterRestart = await restarted.store.exportBackupV3("2026-08-23T12:00:00.000Z");
    expect(afterRestart).toMatchObject({ status: "exported",
      semanticFingerprint: exported.semanticFingerprint });
    expect(local.getItem("dayframe-execution-history-idb-established")).toBe("1");
  });

  it("does not mutate authority when complete V3 validation fails", async () => {
    const local = new MemoryStorage(); Object.defineProperty(globalThis, "localStorage",
      { configurable: true, value: local });
    const db = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name: "backup-v3-invalid" });
    const store = createDayFrameStore(undefined, { restoreStorage: local, restoreIndexedDb: db,
      executionHistoryIndexedDb: createExecutionHistoryIndexedDb({ storage: db }),
      historicalPlanSurface: createHistoricalPlanSurface({ storage: db }) });
    await store.whenReady(); const before = store.getState();
    expect(await store.importBackupV3({ ...emptyBackup(), extra: true })).toEqual({
      status: "invalidBackup" });
    expect(store.getState()).toEqual(before);
  });
});
