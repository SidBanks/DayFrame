import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createExecutionHistoryIndexedDb } from "./executionHistoryIndexedDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createDayFrameBackupV6 } from "./dayFrameBackupV6.js";

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

describe("Backup V7 integration", () => {
  it("restores Goal Structure authority and exact revision history atomically", async () => {
    const local = new MemoryStorage();
    const factory = new IDBFactory();
    const name = "backup-v7-integration";
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
    const parent = await store.createGoal({ title: "Publish a book" });
    const child = await store.createGoal({ title: "Draft manuscript" });
    if (parent.status !== "accepted" || child.status !== "accepted") throw new Error("goal");
    const relationship = await store.createRelationship({
      kind: "contains",
      sourceGoalId: parent.goal.id,
      target: { kind: "goal", goalId: child.goal.id },
      semantics: { kind: "containment", requiredness: "required" },
    });
    const milestone = await store.createMilestone({
      ownerGoalId: parent.goal.id,
      title: "First draft complete",
    });
    expect(relationship.status).toBe("accepted");
    expect(milestone.status).toBe("accepted");
    if (relationship.status !== "accepted" || milestone.status !== "accepted") return;
    const revised = await store.reviseRelationship(relationship.value.id, 1, {
      semantics: { kind: "containment", requiredness: "optional" },
    });
    expect(revised.status).toBe("accepted");
    const backup = await store.exportBackupV7(new Date().toISOString());
    expect(backup.status).toBe("exported");
    expect((await store.exportBackupV6(new Date().toISOString())).status).toBe("exportFailure");
    if (backup.status !== "exported") return;
    await store.retireRelationship(relationship.value.id, 2);
    await store.reviseMilestone(milestone.value.id, 1, { state: "satisfied" });
    expect((await store.importBackupV7(backup.backup)).status).toBe("restoredV7");
    expect(store.getGoalStructureRelationshipRevision(relationship.value.id, 1)).toMatchObject({
      status: "resolved",
      relationship: { semantics: { requiredness: "required" } },
    });
    expect(store.getGoalStructureRelationshipRevision(relationship.value.id, 2)).toMatchObject({
      status: "resolved",
      relationship: { semantics: { requiredness: "optional" }, status: "active" },
    });
    expect(store.getGoalStructureRelationshipRevision(relationship.value.id, 3)).toEqual({
      status: "notFound",
    });
    expect(store.getGoalStructureMilestoneRevision(milestone.value.id, 1)).toMatchObject({
      status: "resolved",
      milestone: { state: "active" },
    });
    const restarted = setup();
    expect(await restarted.whenReady()).toEqual({ status: "ready" });
    expect(restarted.exportGoalStructureAuthority()).toEqual(backup.backup.data.goalStructure);
    const { goalStructure: _omitted, ...legacyData } = backup.backup.data;
    void _omitted;
    const legacy = createDayFrameBackupV6(legacyData, backup.backup.exportedAt);
    expect((await restarted.importBackupV6(legacy)).status).toBe("restoredV6");
    expect(restarted.exportGoalStructureAuthority()).toEqual({
      version: 1,
      relationships: [],
      milestones: [],
    });
  });
});
