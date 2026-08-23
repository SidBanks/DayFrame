import { IDBFactory } from "fake-indexeddb";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createExecutionHistoryIndexedDb } from "./executionHistoryIndexedDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

afterEach(() => { delete (globalThis as { localStorage?: unknown }).localStorage; });

describe("five-authority full-clear settlement", () => {
  it("does not return a terminal result while HistoricalPlan clear is pending", async () => {
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: new MemoryStorage() });
    const base = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name: "delayed-historical-clear" });
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const mutate = vi.fn(async (mutations: Parameters<typeof base.mutate>[0]) => {
      await gate; return base.mutate(mutations);
    });
    const store = createReadyDayFrameTestStore(undefined, {
      historicalPlanSurface: createHistoricalPlanSurface({ storage: { ...base, mutate } }),
    });
    let settled = false; const clearing = store.clearLocalData().then((result) => { settled = true; return result; });
    await Promise.resolve();
    expect(settled).toBe(false);
    expect(store.getState().preview).toBeNull();
    release();
    const result = await clearing;
    expect(result.status).toBe("cleared");
    expect(result.authorities.historicalPlan).toEqual({ status: "removed" });
  });

  it("does not return a terminal result while established ExecutionHistory clear is pending", async () => {
    const local = new MemoryStorage(); Object.defineProperty(globalThis, "localStorage",
      { configurable: true, value: local });
    const factory = new IDBFactory(); const db = createDayFrameDurableDb({ indexedDB: factory,
      name: "delayed-execution-clear" });
    const baseIndexed = createExecutionHistoryIndexedDb({ storage: db });
    let release!: () => void; const gate = new Promise<void>((resolve) => { release = resolve; });
    const indexed = { ...baseIndexed, clearEstablishedAuthority: async () => {
      await gate; return baseIndexed.clearEstablishedAuthority();
    } };
    const store = createDayFrameStore(undefined, { restoreStorage: local, restoreIndexedDb: db,
      executionHistoryIndexedDb: indexed,
      historicalPlanSurface: createHistoricalPlanSurface({ storage: db }) });
    expect(await store.whenReady()).toEqual({ status: "ready" });
    let settled = false; const clearing = store.clearLocalData().then((result) => { settled = true; return result; });
    await Promise.resolve(); expect(settled).toBe(false);
    release(); const result = await clearing;
    expect(result.status).toBe("cleared");
    expect(result.authorities.executionHistory).toEqual({ status: "removed" });
  });

  it("classifies mixed and all-failed terminal outcomes from all five enumerable authorities", async () => {
    const local = new MemoryStorage(); Object.defineProperty(globalThis, "localStorage",
      { configurable: true, value: local });
    const failingStorage = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name: "failed-historical-clear" });
    const historicalPlanSurface = createHistoricalPlanSurface({ storage: { ...failingStorage,
      mutate: async () => ({ status: "failure" as const, error: {
        code: "writeFailed" as const, operation: "clearHistoricalPlan" } }) } });
    const mixed = await createReadyDayFrameTestStore(undefined, { historicalPlanSurface }).clearLocalData();
    expect(mixed.status).toBe("partiallyCleared");
    expect(mixed.authorities.historicalPlan).toEqual({ status: "storageFailure" });
    expect(Object.keys(mixed.authorities)).toEqual([
      "active", "profiles", "planDecisions", "executionHistory", "historicalPlan",
    ]);

    delete (globalThis as { localStorage?: unknown }).localStorage;
    const allFailedSurface = createHistoricalPlanSurface({ storage: { ...failingStorage,
      mutate: async () => ({ status: "failure" as const, error: {
        code: "writeFailed" as const, operation: "clearHistoricalPlan" } }) } });
    const failed = await createReadyDayFrameTestStore(undefined, {
      historicalPlanSurface: allFailedSurface }).clearLocalData();
    expect(failed.status).toBe("failed");
    expect(failed.durability).toBe("notCleared");
  });
});
