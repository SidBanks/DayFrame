import { describe, expect, it } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createExecutionHistoryIndexedDb } from "./executionHistoryIndexedDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { MANUAL_QUANTITY_TARGET_POLICY_V1 } from "../core/measurement/measurementDefinition.js";
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
describe("Backup V6 integration", () => {
  it("roundtrips immutable observation history and legacy V5 clears it", async () => {
    const local = new MemoryStorage(),
      factory = new IDBFactory(),
      name = "backup-v6-integration";
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
    const goal = await store.createGoal({ title: "Write book" });
    if (goal.status !== "accepted") throw new Error("goal");
    const definition = await store.createMeasurementDefinition(
      goal.goal.id,
      MANUAL_QUANTITY_TARGET_POLICY_V1,
      { targetValue: "50000", unitId: "words" },
    );
    if (definition.status !== "accepted") throw new Error("definition");
    const created = await store.createProgressObservation({
      goalId: goal.goal.id,
      observedAt: definition.definition.effectiveFrom,
      value: "12400",
      expectedDefinitionRevision: 1,
    });
    expect(created.status).toBe("accepted");
    if (created.status !== "accepted") return;
    const backup = await store.exportBackupV6(new Date().toISOString());
    expect(backup.status).toBe("exported");
    expect((await store.exportBackupV5(new Date().toISOString())).status).toBe("exportFailure");
    if (backup.status !== "exported") return;
    await store.retractProgressObservation(created.observation.id, 1);
    expect((await store.importBackupV6(backup.backup)).status).toBe("restoredV6");
    expect(store.listProgressObservationHistory(created.observation.id)).toHaveLength(1);
    const v5 = {
      ...backup.backup,
      version: 5,
      data: {
        active: backup.backup.data.active,
        profiles: backup.backup.data.profiles,
        planDecisions: backup.backup.data.planDecisions,
        executionHistory: backup.backup.data.executionHistory,
        historicalPlan: backup.backup.data.historicalPlan,
        goals: backup.backup.data.goals,
        measurementDefinitions: backup.backup.data.measurementDefinitions,
      },
    };
    expect((await store.importBackupV5(v5)).status).toBe("restoredV5");
    expect(store.listProgressObservationHistory(created.observation.id)).toEqual([]);
    const restarted = setup();
    expect(await restarted.whenReady()).toEqual({ status: "ready" });
    expect(restarted.exportProgressObservationAuthority().observations).toEqual([]);
  });
});
