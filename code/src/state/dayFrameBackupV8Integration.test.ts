import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createExecutionHistoryIndexedDb } from "./executionHistoryIndexedDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createDayFrameBackupV7 } from "./dayFrameBackupV7.js";

class MemoryStorage implements Storage {
  values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("Backup V8 integration", () => {
  it("round-trips exact Demand/Priority history and imports V7 as empty authority", async () => {
    const local = new MemoryStorage(),
      factory = new IDBFactory(),
      name = "backup-v8-integration";
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: local });
    const setup = () => {
      const db = createDayFrameDurableDb({ indexedDB: factory, name });
      return createDayFrameStore(undefined, {
        restoreStorage: local,
        restoreIndexedDb: db,
        executionHistoryIndexedDb: createExecutionHistoryIndexedDb({ storage: db }),
        historicalPlanSurface: createHistoricalPlanSurface({ storage: db }),
      });
    };
    const store = setup();
    await store.whenReady();
    const goal = await store.createGoal({ title: "Study" });
    if (goal.status !== "accepted") throw new Error("goal");
    const demand = await store.createDemand({
      goalId: goal.goal.id,
      requestedEffort: { unit: "minutes", amount: 120 },
      horizon: {
        kind: "userDayInterval",
        startUserDayDate: "2026-09-07",
        endUserDayDateExclusive: "2026-09-14",
      },
      session: { mode: "splittable", minimumMinutes: 30 },
      satisfaction: { kind: "target", allowPartial: false },
      cadence: { kind: "total" },
    });
    const priority = await store.createPriority({
      goalId: goal.goal.id,
      level: "high",
      scope: { kind: "default" },
    });
    if (demand.status !== "accepted" || priority.status !== "accepted") throw new Error("planning");
    await store.reviseDemand(demand.value.id, 1, {
      requestedEffort: { unit: "minutes", amount: 180 },
      session: { mode: "splittable", minimumMinutes: 30 },
    });
    await store.revisePriority(priority.value.id, 1, { level: "critical" });
    const exported = await store.exportBackupV8("2026-09-04T12:00:00.000Z");
    expect(exported.status).toBe("exported");
    expect((await store.exportBackupV7("2026-09-04T12:00:00.000Z")).status).toBe("exportFailure");
    if (exported.status !== "exported") return;
    await store.retireDemand(demand.value.id, 2);
    await store.retirePriority(priority.value.id, 2);
    expect((await store.importBackupV8(exported.backup)).status).toBe("restoredV8");
    expect(store.getGoalDemandRevision(demand.value.id, 1)).toMatchObject({
      status: "resolved",
      demand: { requestedEffort: { amount: 120 } },
    });
    expect(store.getGoalDemandRevision(demand.value.id, 2)).toMatchObject({
      status: "resolved",
      demand: { requestedEffort: { amount: 180 } },
    });
    expect(store.getGoalPriorityRevision(priority.value.id, 2)).toMatchObject({
      status: "resolved",
      priority: { level: "critical" },
    });
    const restarted = setup();
    expect(await restarted.whenReady()).toEqual({ status: "ready" });
    expect(restarted.exportGoalPlanningAuthority()).toEqual(exported.backup.data.goalPlanning);
    const { goalPlanning: omitted, ...v7data } = exported.backup.data;
    void omitted;
    const v7 = createDayFrameBackupV7(v7data, exported.backup.exportedAt);
    expect((await restarted.importBackupV7(v7)).status).toBe("restoredV7");
    expect(restarted.exportGoalPlanningAuthority()).toEqual({
      version: 1,
      demands: [],
      priorities: [],
    });
  });
  it("rejects dangling Goal planning authority before restore", async () => {
    const local = new MemoryStorage(),
      db = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name: "backup-v8-dangling" });
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: local });
    const store = createDayFrameStore(undefined, {
      restoreStorage: local,
      restoreIndexedDb: db,
      executionHistoryIndexedDb: createExecutionHistoryIndexedDb({ storage: db }),
      historicalPlanSurface: createHistoricalPlanSurface({ storage: db }),
    });
    await store.whenReady();
    const goal = await store.createGoal({ title: "Dangling" });
    if (goal.status !== "accepted") throw new Error("goal");
    await store.createDemand({
      goalId: goal.goal.id,
      requestedEffort: { unit: "minutes", amount: 30 },
      horizon: {
        kind: "userDayInterval",
        startUserDayDate: "2026-09-07",
        endUserDayDateExclusive: "2026-09-08",
      },
      session: { mode: "indivisible", exactMinutes: 30 },
      satisfaction: { kind: "minimum", allowPartial: false },
      cadence: { kind: "total" },
    });
    const exported = await store.exportBackupV8("2026-09-04T12:00:00.000Z");
    if (exported.status !== "exported") throw new Error("backup");
    expect(
      await store.importBackupV8({
        ...exported.backup,
        data: {
          ...exported.backup.data,
          goals: { version: 1, goals: [] },
        },
      }),
    ).toEqual({ status: "invalidBackup" });
  });
});
