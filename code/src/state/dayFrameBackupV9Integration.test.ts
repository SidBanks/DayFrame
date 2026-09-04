import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createExecutionHistoryIndexedDb } from "./executionHistoryIndexedDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createDayFrameBackupV8 } from "./dayFrameBackupV8.js";

class MemoryStorage implements Storage {
  values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(k: string) {
    return this.values.get(k) ?? null;
  }
  key(i: number) {
    return [...this.values.keys()][i] ?? null;
  }
  removeItem(k: string) {
    this.values.delete(k);
  }
  setItem(k: string, v: string) {
    this.values.set(k, v);
  }
}
const template = (id: string) => ({
  id,
  userId: "u",
  title: id,
  category: "maintenance" as const,
  placementType: "fixed" as const,
  durationMinutes: 30,
  priority: 3 as const,
  preferredWindow: "anyAvailable" as const,
  fixedStartTime: "09:00" as const,
  rescheduleBehavior: "askUser" as const,
  requiresResource: false,
  externalResources: [],
  enabled: true,
  createdAt: "2026-09-04T12:00:00.000Z",
  updatedAt: "2026-09-04T12:00:00.000Z",
});

describe("Backup V9 integration", () => {
  it("round-trips exact Composition history, refuses lossy V8 export, and restores V8 empty", async () => {
    const local = new MemoryStorage(),
      factory = new IDBFactory(),
      name = "backup-v9";
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
    store.setBlockTemplates([template("parent"), template("child")]);
    const [parent, child] = store.getState().blockTemplates;
    const created = await store.createAttachment({
      parent: { kind: "template", sourceId: parent!.id, incarnationId: parent!.incarnationId },
      child: { kind: "template", sourceId: child!.id, incarnationId: child!.incarnationId },
      slot: "before",
      order: 0,
      applicability: {},
      requiredness: "required",
      timing: { kind: "endsAtParentStart" },
      timingStrictness: "constraint",
      buffer: { beforeMinutes: 0, afterMinutes: 10 },
      goalSupport: "none",
    });
    expect(created.status).toBe("accepted");
    if (created.status !== "accepted") return;
    await store.reviseAttachment(created.value.id, 1, { requiredness: "optional" });
    expect((await store.exportBackupV8("2026-09-04T12:00:00.000Z")).status).toBe("exportFailure");
    const exported = await store.exportBackupV9("2026-09-04T12:00:00.000Z");
    expect(exported.status).toBe("exported");
    if (exported.status !== "exported") return;
    await store.retireAttachment(created.value.id, 2);
    expect((await store.importBackupV9(exported.backup)).status).toBe("restoredV9");
    expect(store.getAttachmentRevision(created.value.id, 1)).toMatchObject({
      status: "resolved",
      relationship: { requiredness: "required" },
    });
    expect(store.exportCompositionAuthority()).toEqual(exported.backup.data.composition);
    const { composition: omitted, ...legacy } = exported.backup.data;
    void omitted;
    const v8 = createDayFrameBackupV8(legacy, exported.backup.exportedAt);
    expect((await store.importBackupV8(v8)).status).toBe("restoredV8");
    expect(store.exportCompositionAuthority()).toEqual({
      version: 1,
      relationships: [],
      decisions: [],
    });
  });
});
