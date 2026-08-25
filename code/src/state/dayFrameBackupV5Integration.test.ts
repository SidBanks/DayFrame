import { describe, expect, it } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createExecutionHistoryIndexedDb } from "./executionHistoryIndexedDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { MANUAL_QUANTITY_TARGET_POLICY_V1 } from "../core/measurement/measurementDefinition.js";
class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
}
describe("Backup V5 integration", () => {
  it("roundtrips Measurement Definition history atomically and survives restart", async () => {
    const local = new MemoryStorage();
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: local });
    const factory = new IDBFactory(),
      name = "backup-v5-integration";
    const setup = () => {
      const db = createDayFrameDurableDb({ indexedDB: factory, name });
      return createDayFrameStore(undefined, {
        restoreStorage: local as unknown as Storage,
        restoreIndexedDb: db,
        executionHistoryIndexedDb: createExecutionHistoryIndexedDb({ storage: db }),
        historicalPlanSurface: createHistoricalPlanSurface({ storage: db }),
      });
    };
    const first = setup();
    expect(await first.whenReady()).toEqual({ status: "ready" });
    const goal = await first.createGoal({ title: "Write book" });
    expect(goal.status).toBe("accepted");
    if (goal.status !== "accepted") return;
    const created = await first.createMeasurementDefinition(
      goal.goal.id,
      MANUAL_QUANTITY_TARGET_POLICY_V1,
      { targetValue: "50000", unitId: "words" },
    );
    expect(created.status).toBe("accepted");
    const exported = await first.exportBackupV5("2026-08-23T18:00:00.000Z");
    expect(exported.status).toBe("exported");
    expect((await first.exportBackupV4("2026-08-23T18:00:00.000Z")).status).toBe("exportFailure");
    if (exported.status !== "exported" || created.status !== "accepted") return;
    await first.stopMeasuringGoal(created.definition.id, 1);
    expect((await first.importBackupV5(exported.backup)).status).toBe("restoredV5");
    expect(first.listMeasurementDefinitionHistory(goal.goal.id)).toHaveLength(1);
    const restarted = setup();
    expect(await restarted.whenReady()).toEqual({ status: "ready" });
    expect(restarted.listMeasurementDefinitionHistory(goal.goal.id)).toHaveLength(1);
  });
  it("legacy V4 restore clears pre-existing definitions instead of creating hybrid state", async () => {
    const local = new MemoryStorage();
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: local });
    const db = createDayFrameDurableDb({
      indexedDB: new IDBFactory(),
      name: "backup-v4-clears-measurement",
    });
    const store = createDayFrameStore(undefined, {
      restoreStorage: local as unknown as Storage,
      restoreIndexedDb: db,
      executionHistoryIndexedDb: createExecutionHistoryIndexedDb({ storage: db }),
      historicalPlanSurface: createHistoricalPlanSurface({ storage: db }),
    });
    await store.whenReady();
    const goal = await store.createGoal({ title: "Read" });
    if (goal.status !== "accepted") return;
    await store.createMeasurementDefinition(goal.goal.id, MANUAL_QUANTITY_TARGET_POLICY_V1, {
      targetValue: "12",
      unitId: "count",
    });
    const v5 = await store.exportBackupV5("2026-08-23T18:00:00.000Z");
    if (v5.status !== "exported") return;
    const v4 = {
      ...v5.backup,
      version: 4,
      data: {
        active: v5.backup.data.active,
        profiles: v5.backup.data.profiles,
        planDecisions: v5.backup.data.planDecisions,
        executionHistory: v5.backup.data.executionHistory,
        historicalPlan: v5.backup.data.historicalPlan,
        goals: v5.backup.data.goals,
      },
    };
    expect((await store.importBackupV4(v4)).status).toBe("restoredV4");
    expect(store.listMeasurementDefinitionHistory(goal.goal.id)).toEqual([]);
  });
});
