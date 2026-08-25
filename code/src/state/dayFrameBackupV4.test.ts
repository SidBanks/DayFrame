import { describe, expect, it } from "vitest";
import {
  createDayFrameBackupV4,
  translateBackupV3ToV4,
  validateDayFrameBackupV4,
} from "./dayFrameBackupV4.js";
import { createDayFrameBackupV3 } from "./dayFrameBackupV3.js";
import { createInitialDayFrameState } from "./createInitialDayFrameState.js";
import { createActiveV2 } from "./activeV2.js";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createExecutionHistoryIndexedDb } from "./executionHistoryIndexedDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
class MemoryStorage {
  values = new Map<string, string>();
  getItem(k: string) {
    return this.values.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.values.set(k, v);
  }
  removeItem(k: string) {
    this.values.delete(k);
  }
}
const data = () => {
  const state = createInitialDayFrameState();
  const active = createActiveV2(state);
  return {
    active: { surfaceVersion: 2 as const, data: active.data },
    profiles: { surfaceVersion: 2 as const, profiles: [], quarantinedProfiles: [] },
    planDecisions: { surfaceVersion: 1 as const, decisions: [], quarantinedDecisions: [] },
    executionHistory: {
      app: "DayFrame" as const,
      surface: "executionHistory" as const,
      version: 1 as const,
      records: [],
      quarantinedComponents: [],
    },
    historicalPlan: { surfaceVersion: 1 as const, batches: [] },
  };
};
const historicalStates = () => ({
  surfaceVersion: 1 as const,
  batches: [
    undefined,
    [],
    [
      {
        version: 1,
        goalId: "22222222-2222-4222-8222-222222222222",
        goalRevision: 1,
        title: "Goal",
        status: "active",
      },
    ],
  ].map((goals, index) => ({
    surfaceVersion: 1 as const,
    version: 1 as const,
    id: `${index + 1}${index + 1}${index + 1}${index + 1}${index + 1}${index + 1}${index + 1}${index + 1}-${index + 1}${index + 1}${index + 1}${index + 1}-4${index + 1}${index + 1}${index + 1}-8${index + 1}${index + 1}${index + 1}-${String(index + 1).repeat(12)}` as never,
    publishedAt: `2026-08-2${index}T12:00:00.000Z`,
    range: { startUserDayDate: "2026-08-20" as const, endUserDayDate: "2026-08-20" as const },
    days: [
      {
        version: 1 as const,
        userDayDate: "2026-08-20" as const,
        dayBoundaryStartTime: "03:00" as const,
        weekStartsOn: "monday" as const,
        utcOffsetMinutes: -300,
        occurrences: [
          {
            version: 1 as const,
            reference: {
              version: 1 as const,
              sourceKind: "manualEvent" as const,
              manualEvent: {
                id: "event",
                incarnationId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as never,
              },
            },
            sourceFamily: "manualEvent" as const,
            title: "Event",
            category: "optional" as const,
            plan: {
              state: "scheduled" as const,
              startsAt: "2026-08-20T13:00:00.000Z",
              endsAt: "2026-08-20T14:00:00.000Z",
            },
            ...(goals === undefined ? {} : { goals: goals as never }),
          },
        ],
      },
    ],
  })),
});
describe("Backup V4", () => {
  it("roundtrips complete authority and rejects invalid Goals", () => {
    const backup = createDayFrameBackupV4(
      { ...data(), goals: { version: 1, goals: [] } },
      "2026-08-23T12:00:00.000Z",
    );
    expect(validateDayFrameBackupV4(JSON.parse(JSON.stringify(backup)))).toEqual(backup);
    expect(() =>
      validateDayFrameBackupV4({
        ...backup,
        data: { ...backup.data, goals: { version: 1, goals: [{ id: "bad" }] } },
      }),
    ).toThrow();
  });
  it("preserves legacy, Goal-aware empty, and linked HistoricalPlan provenance", () => {
    const backup = createDayFrameBackupV4(
      { ...data(), historicalPlan: historicalStates(), goals: { version: 1, goals: [] } },
      "2026-08-23T12:00:00.000Z",
    );
    const restored = validateDayFrameBackupV4(JSON.parse(JSON.stringify(backup)));
    const occurrences = restored.data.historicalPlan.batches.map(
      (batch) => batch.days[0]!.occurrences[0]!,
    );
    expect(occurrences[0]!.goals).toBeUndefined();
    expect(occurrences[1]!.goals).toEqual([]);
    expect(occurrences[2]!.goals).toHaveLength(1);
  });
  it("translates Backup V3 explicitly to empty Goal authority", () => {
    const old = createDayFrameBackupV3(data(), "2026-08-23T12:00:00.000Z");
    expect(translateBackupV3ToV4(old).data.goals).toEqual({ version: 1, goals: [] });
  });
});
describe("Backup V4 integration", () => {
  it("roundtrips Goal authority atomically and survives restart", async () => {
    const local = new MemoryStorage();
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: local });
    const factory = new IDBFactory();
    const name = "backup-v4-integration";
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
    const created = await first.createGoal({ title: "Earn Security+" });
    expect(created.status).toBe("accepted");
    const exported = await first.exportBackupV4("2026-08-23T12:00:00.000Z");
    expect(exported.status).toBe("exported");
    expect((await first.exportBackupV3("2026-08-23T12:00:00.000Z")).status).toBe("exportFailure");
    if (exported.status !== "exported" || created.status !== "accepted") return;
    await first.updateGoal(created.goal.id, 1, { title: "Changed" });
    expect((await first.importBackupV4(exported.backup)).status).toBe("restoredV4");
    expect(first.getGoal(created.goal.id)?.title).toBe("Earn Security+");
    const restarted = setup();
    expect(await restarted.whenReady()).toEqual({ status: "ready" });
    expect(restarted.getGoal(created.goal.id)?.title).toBe("Earn Security+");
  });
});
