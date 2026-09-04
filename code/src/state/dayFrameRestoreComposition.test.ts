import { IDBFactory } from "fake-indexeddb";
import { afterEach, describe, expect, it } from "vitest";
import {
  createDayFrameDurableDb,
  EXECUTION_HISTORY_METADATA_STORE,
  HISTORICAL_PLAN_BATCH_STORE,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import {
  createRestoreIndexedDbStaging,
  fingerprintPayloads,
  semanticFingerprint,
  wholeFingerprint,
  type RestorePayloadSet,
} from "../infrastructure/restore/restoreStaging.js";
import {
  createRestoreJournalStorage,
  type RestoreJournalV1,
} from "../infrastructure/restore/restoreJournal.js";
import { createRestoreTransactionId } from "../infrastructure/restore/restoreIdentity.js";
import { createCombinedIndexedDbRestoreAdapter } from "../infrastructure/restore/restoreParticipants.js";
import {
  createExecutionHistoryIndexedDb,
  EXECUTION_HISTORY_METADATA_KEY,
} from "./executionHistoryIndexedDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createActiveV2 } from "./activeV2.js";
import { createDayFrameProfilesStorageV2 } from "./dayFrameProfiles.js";
import {
  DAYFRAME_RESTORE_CAPABILITY,
  getDayFrameRestoreComposition,
} from "./dayFrameRestoreComposition.js";
import {
  translateExecutionHistoryRestorePayload,
  translateHistoricalPlanRestorePayload,
} from "./dayFrameRestoreTranslation.js";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
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

afterEach(() => {
  delete (globalThis as { localStorage?: unknown }).localStorage;
});

describe("durable-to-runtime restore translation", () => {
  it("normalizes ExecutionHistory and HistoricalPlan into settled runtime authority", () => {
    const execution = translateExecutionHistoryRestorePayload({
      records: [],
      quarantine: [],
      metadata: [
        {
          surface: EXECUTION_HISTORY_METADATA_KEY,
          version: 1,
          authorityState: "established",
          legacyFingerprint: "test",
          recordCount: 0,
          quarantineCount: 0,
        },
      ],
      antiResurrection: "1",
    });
    expect(execution).toMatchObject({
      status: "valid",
      target: {
        records: [],
        quarantine: [],
        pendingRecords: [],
        pendingQuarantineRemovals: [],
        durability: "durable",
        authorityMode: "indexedDb",
        migrationStatus: "readyIndexedDb",
      },
    });
    const historical = translateHistoricalPlanRestorePayload({ batches: [], days: [] });
    expect(historical).toEqual({
      status: "valid",
      durable: { batches: [], days: [] },
      target: { status: { status: "ready", pendingCount: 0 }, pending: [], batchMetadata: [] },
    });
  });

  it("rejects invalid physical authority rather than synthesizing healthy runtime state", () => {
    expect(
      translateExecutionHistoryRestorePayload({ records: [], quarantine: [], metadata: [] }),
    ).toMatchObject({ status: "invalid" });
    expect(
      translateHistoricalPlanRestorePayload({ batches: [{ batchId: "bad" }], days: [] }),
    ).toMatchObject({ status: "invalid" });
  });
});

describe("real five-participant restore composition", () => {
  it("replaces durable authority and installs translated settled runtime authority", async () => {
    const local = new MemoryStorage();
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: local });
    const db = createDayFrameDurableDb({
      indexedDB: new IDBFactory(),
      name: "real-five-participant-restore",
    });
    const store = createReadyDayFrameTestStore(undefined, {
      restoreStorage: local,
      restoreIndexedDb: db,
      executionHistoryIndexedDb: createExecutionHistoryIndexedDb({ storage: db }),
      historicalPlanSurface: createHistoricalPlanSurface({ storage: db }),
      restoreTransactionId: () => "123e4567-e89b-42d3-a456-426614174000",
      restoreClock: () => "2026-08-22T12:00:00.000Z",
    });
    const current = store.getState();
    const activeData = {
      schedulingPreferences: {
        ...current.schedulingPreferences,
        dayBoundaryStartTime: "03:00" as const,
      },
      previewRange: current.previewRange,
      shiftDefinitions: current.shiftDefinitions,
      shiftCycles: current.shiftCycles,
      blockTemplates: current.blockTemplates,
      blockRecurrences: current.blockRecurrences,
      manualEvents: current.manualEvents,
    };
    const target = {
      active: createActiveV2(activeData),
      profiles: createDayFrameProfilesStorageV2([], []),
      planDecisions: {
        app: "DayFrame" as const,
        surface: "planDecisions" as const,
        version: 1 as const,
        decisions: [],
      },
      executionHistory: {
        records: [],
        quarantine: [],
        metadata: [
          {
            surface: EXECUTION_HISTORY_METADATA_KEY,
            version: 1 as const,
            authorityState: "established" as const,
            legacyFingerprint: "restore",
            recordCount: 0,
            quarantineCount: 0,
          },
        ],
        antiResurrection: "1" as const,
      },
      historicalPlan: { batches: [], days: [] },
      goals: { version: 1 as const, goals: [] },
      measurementDefinitions: { version: 1 as const, definitions: [] },
      progressObservations: { version: 1 as const, observations: [] },
      goalStructure: { version: 1 as const, relationships: [], milestones: [] },
      goalPlanning: { version: 1 as const, demands: [], priorities: [] },
      composition: { version: 1 as const, relationships: [], decisions: [] },
    };
    const composition = getDayFrameRestoreComposition(store, DAYFRAME_RESTORE_CAPABILITY);
    expect(await composition.coordinator.restore(target)).toEqual({ status: "completed" });
    expect(store.getState().schedulingPreferences.dayBoundaryStartTime).toBe("03:00");
    expect(store.getExecutionHistoryMigrationStatus()).toBe("readyIndexedDb");
    expect(store.getExecutionHistoryDurabilityStatus()).toBe("durable");
    expect(store.getPendingPublications()).toEqual([]);
    expect(store.getStatus()).toEqual({ status: "ready", pendingCount: 0 });
    expect(
      await db.get(EXECUTION_HISTORY_METADATA_STORE, EXECUTION_HISTORY_METADATA_KEY),
    ).toMatchObject({ status: "success", value: { authorityState: "established" } });
    expect(await db.getAll(HISTORICAL_PLAN_BATCH_STORE)).toEqual({ status: "success", value: [] });
    expect(local.getItem("dayframe-execution-history-idb-established")).toBe("1");
  });

  it("finishes an interrupted IndexedDB-forward stage before ordinary readiness", async () => {
    const local = new MemoryStorage();
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: local });
    const factory = new IDBFactory();
    const name = "real-forward-startup-restore";
    const db = createDayFrameDurableDb({ indexedDB: factory, name });
    const first = createReadyDayFrameTestStore(undefined, {
      restoreStorage: local,
      restoreIndexedDb: db,
      executionHistoryIndexedDb: createExecutionHistoryIndexedDb({ storage: db }),
      historicalPlanSurface: createHistoricalPlanSurface({ storage: db }),
    });
    const composition = getDayFrameRestoreComposition(first, DAYFRAME_RESTORE_CAPABILITY);
    const recovery = Object.fromEntries(
      await Promise.all(
        Object.values(composition.participants).map(async (participant) => [
          participant.id,
          await participant.captureCurrentAuthority(),
        ]),
      ),
    ) as RestorePayloadSet;
    const active = structuredClone(recovery.active) as {
      data: {
        schedulingPreferences: {
          dayBoundaryStartTime: string;
        };
      };
    };
    active.data.schedulingPreferences.dayBoundaryStartTime = "04:00";
    const target = { ...structuredClone(recovery), active } as RestorePayloadSet;
    const id = createRestoreTransactionId(() => "123e4567-e89b-42d3-a456-426614174001");
    const source = Object.fromEntries(
      await Promise.all(
        Object.values(composition.participants).map(async (participant) => [
          participant.id,
          await participant.captureSourceFingerprint(),
        ]),
      ),
    ) as ReturnType<typeof fingerprintPayloads>;
    const targetPrints = Object.fromEntries(
      Object.values(composition.participants).map((participant) => [
        participant.id,
        semanticFingerprint(target[participant.id]),
      ]),
    ) as ReturnType<typeof fingerprintPayloads>;
    const recoveryPrints = Object.fromEntries(
      Object.values(composition.participants).map((participant) => [
        participant.id,
        semanticFingerprint(recovery[participant.id]),
      ]),
    ) as ReturnType<typeof fingerprintPayloads>;
    expect(
      (
        await createRestoreIndexedDbStaging(db).stage(
          id,
          target,
          recovery,
          source,
          targetPrints,
          recoveryPrints,
        )
      ).status,
    ).toBe("success");
    const journals = createRestoreJournalStorage(local);
    const base = {
      app: "DayFrame",
      surface: "restore-journal",
      version: 1,
      transactionId: id,
      mode: "ordinary",
      targetFingerprint: wholeFingerprint(targetPrints),
      recoveryFingerprint: wholeFingerprint(recoveryPrints),
      createdAt: "2026-08-22T12:00:00.000Z",
      updatedAt: "2026-08-22T12:00:00.000Z",
    } as const;
    expect(journals.write({ ...base, stage: "prepared" })).toEqual({ status: "success" });
    expect(journals.write({ ...base, stage: "staged" })).toEqual({ status: "success" });
    expect(
      (
        await createCombinedIndexedDbRestoreAdapter(db).replaceExact({
          executionHistory: target.executionHistory,
          historicalPlan: target.historicalPlan,
          goals: target.goals,
          measurementDefinitions: target.measurementDefinitions,
          progressObservations: target.progressObservations,
          goalStructure: target.goalStructure,
          goalPlanning: target.goalPlanning,
          composition: target.composition,
        })
      ).status,
    ).toBe("success");
    expect(journals.write({ ...base, stage: "indexedDbCommitted" } as RestoreJournalV1)).toEqual({
      status: "success",
    });
    const restartDb = createDayFrameDurableDb({ indexedDB: factory, name });
    const restarted = createDayFrameStore(undefined, {
      restoreStorage: local,
      restoreIndexedDb: restartDb,
      executionHistoryIndexedDb: createExecutionHistoryIndexedDb({ storage: restartDb }),
      historicalPlanSurface: createHistoricalPlanSurface({ storage: restartDb }),
    });
    expect(restarted.getReadiness()).toEqual({ status: "initializing" });
    expect(await restarted.whenReady()).toEqual({ status: "ready" });
    expect(restarted.getState().schedulingPreferences.dayBoundaryStartTime).toBe("04:00");
    expect(restarted.getExecutionHistoryMigrationStatus()).toBe("readyIndexedDb");
    expect(journals.read()).toEqual({ status: "absent" });
  });

  it("protects startup when journal evidence is invalid", async () => {
    const local = new MemoryStorage();
    local.setItem("dayframe-restore-journal-v1", "{bad");
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: local });
    const db = createDayFrameDurableDb({
      indexedDB: new IDBFactory(),
      name: "invalid-restore-journal",
    });
    const store = createDayFrameStore(undefined, {
      restoreStorage: local,
      restoreIndexedDb: db,
      executionHistoryIndexedDb: createExecutionHistoryIndexedDb({ storage: db }),
      historicalPlanSurface: createHistoricalPlanSurface({ storage: db }),
    });
    expect(await store.whenReady()).toEqual({
      status: "protected",
      reason: "authorityRecoveryRequired",
    });
  });
});
