import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { createDayFrameDurableDb, EXECUTION_HISTORY_METADATA_STORE, EXECUTION_HISTORY_RECORD_STORE,
  HISTORICAL_PLAN_BATCH_STORE, RESTORE_METADATA_STORE } from "../storage/dayFrameDurableDb.js";
import { createIndexedDbCollectionStorage } from "../storage/indexedDbCollectionStorage.js";
import { createRestoreTransactionId, isRestoreTransactionId } from "./restoreIdentity.js";
import { createRestoreJournalStorage, type RestoreJournalV1 } from "./restoreJournal.js";
import { createRestoreIndexedDbStaging, createRestoreLocalStaging, fingerprintPayloads,
  semanticFingerprint, wholeFingerprint, type RestorePayloadSet } from "./restoreStaging.js";
import { createCombinedIndexedDbRestoreAdapter, createExecutionHistoryAntiResurrectionAdapter,
  EXECUTION_HISTORY_ANTI_RESURRECTION_KEY } from "./restoreParticipants.js";
import { createRestoreCoordinator, createRestorePreBootstrapHook } from "./restoreCoordinator.js";

const RAW_UUID = "123e4567-e89b-42d3-a456-426614174000";
const UUID = createRestoreTransactionId(() => RAW_UUID);
class MemoryStorage implements Pick<Storage, "getItem" | "setItem" | "removeItem"> {
  values = new Map<string, string>(); failAt = -1; writes = 0;
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { if (this.writes++ === this.failAt) throw new Error("write failed"); this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}
const payloads = (suffix: string): RestorePayloadSet => ({ active: { value: `active-${suffix}` }, profiles: { value: `profiles-${suffix}` },
  planDecisions: { value: `decisions-${suffix}` }, executionHistory: { value: `execution-${suffix}` }, historicalPlan: { value: `history-${suffix}` } });

describe("restore identity and strict journal", () => {
  it("accepts only canonical UUID-v4 identity and validates transitions with reread", () => {
    expect(createRestoreTransactionId(() => RAW_UUID)).toBe(UUID); expect(isRestoreTransactionId(UUID.toUpperCase())).toBe(false);
    expect(() => createRestoreTransactionId(() => "invalid")).toThrow();
    const storage = new MemoryStorage(); const journalStore = createRestoreJournalStorage(storage); const prints = fingerprintPayloads(payloads("target"));
    const journal: RestoreJournalV1 = { app: "DayFrame", surface: "restore-journal", version: 1, transactionId: UUID,
      stage: "prepared", mode: "ordinary", targetFingerprint: wholeFingerprint(prints), recoveryFingerprint: wholeFingerprint(prints),
      createdAt: "2026-08-22T12:00:00.000Z", updatedAt: "2026-08-22T12:00:00.000Z" };
    expect(journalStore.write(journal)).toEqual({ status: "success" });
    expect(journalStore.write({ ...journal, stage: "localStorageCommitted" })).toMatchObject({ status: "failure", reason: "invalidTransition" });
    storage.values.set("dayframe-restore-journal-v1", JSON.stringify({ ...journal, extra: true }));
    expect(journalStore.read()).toEqual({ status: "failure", reason: "invalidJournal" });
  });
});

describe("durable restore staging and combined replacement", () => {
  it("stages clone-isolated target and recovery payloads and verifies whole fingerprints", async () => {
    const db = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name: "restore-stage-test" });
    const stage = createRestoreIndexedDbStaging(db); const target = payloads("target"); const recovery = payloads("recovery");
    expect((await stage.stage(UUID, target, recovery)).status).toBe("success");
    (target.active as { value: string }).value = "mutated";
    expect(await stage.read(UUID)).toMatchObject({ status: "success", target: { active: { value: "active-target" } } });
    expect(await db.get(RESTORE_METADATA_STORE, UUID)).toMatchObject({ status: "success", value: { version: 1 } });
  });

  it("atomically replaces both IndexedDB authorities and preserves exact physical records", async () => {
    const db = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name: "restore-combined-test" });
    const combined = createCombinedIndexedDbRestoreAdapter(db);
    const target = { executionHistory: { records: [{ recordId: "r1" }], quarantine: [], metadata: [{ surface: "executionHistory" }] },
      historicalPlan: { batches: [{ batchId: "b1" }], days: [] } };
    expect(await combined.replaceExact(target)).toEqual({ status: "success" });
    expect(await combined.verifyExact(target)).toEqual({ status: "success" });
    expect(await db.get(EXECUTION_HISTORY_RECORD_STORE, "r1")).toMatchObject({ value: { recordId: "r1" } });
    expect(await db.get(HISTORICAL_PLAN_BATCH_STORE, "b1")).toMatchObject({ value: { batchId: "b1" } });
    const invalid = { ...target, executionHistory: { ...target.executionHistory, records: [{ missingKey: true }] } };
    expect((await combined.replaceExact(invalid)).status).toBe("failure");
    expect(await db.get(EXECUTION_HISTORY_METADATA_STORE, "executionHistory")).toMatchObject({ value: { surface: "executionHistory" } });
  });

  it("writes, removes, and reread-verifies the exact anti-resurrection marker", async () => {
    const storage = new MemoryStorage(); const marker = createExecutionHistoryAntiResurrectionAdapter(storage);
    expect(await marker.writeExact({ antiResurrection: "established" })).toEqual({ status: "success" });
    expect(storage.getItem(EXECUTION_HISTORY_ANTI_RESURRECTION_KEY)).toBe("established");
    expect(await marker.writeExact({ antiResurrection: null })).toEqual({ status: "success" });
    expect(storage.getItem(EXECUTION_HISTORY_ANTI_RESURRECTION_KEY)).toBeNull();
  });

  it("upgrades the shared physical database additively without losing existing authority", async () => {
    const factory = new IDBFactory(); const name = "restore-upgrade-preservation-test";
    const v2 = createIndexedDbCollectionStorage({ indexedDB: factory, schema: { name, version: 2, stores: [
      { name: HISTORICAL_PLAN_BATCH_STORE, keyPath: "batchId" }, { name: EXECUTION_HISTORY_RECORD_STORE, keyPath: "recordId" },
    ] } });
    await v2.put(HISTORICAL_PLAN_BATCH_STORE, { batchId: "preserved-batch" });
    await v2.put(EXECUTION_HISTORY_RECORD_STORE, { recordId: "preserved-record" });
    const v3 = createDayFrameDurableDb({ indexedDB: factory, name }); expect((await v3.open()).status).toBe("success");
    expect(await v3.get(HISTORICAL_PLAN_BATCH_STORE, "preserved-batch")).toMatchObject({ value: { batchId: "preserved-batch" } });
    expect(await v3.get(EXECUTION_HISTORY_RECORD_STORE, "preserved-record")).toMatchObject({ value: { recordId: "preserved-record" } });
    expect(await v3.getAll(RESTORE_METADATA_STORE)).toEqual({ status: "success", value: [] });
  });
});

describe("restore coordinator", () => {
  function harness(options: { sourceChanges?: boolean; invalidRuntime?: boolean;
    failTargetLocal?: boolean } = {}) {
    const journalStorage = new MemoryStorage(); const localStorage = new MemoryStorage(); let current = payloads("recovery");
    let transaction = false; const installed: string[] = [];
    const participants = (["active", "profiles", "planDecisions", "executionHistory", "historicalPlan"] as const).map((id) => ({ id,
      durableKind: (id === "executionHistory" || id === "historicalPlan" ? "indexedDb" : "localStorage") as "indexedDb" | "localStorage",
      getReadiness: () => "ready" as const, captureCurrentAuthority: async () => structuredClone(current[id]),
      validatePayload: (value: unknown) => typeof value === "object" && value !== null ? { status: "valid" as const, payload: structuredClone(value) } : { status: "invalid" as const, reason: "invalid" },
      clonePayload: structuredClone, fingerprint: semanticFingerprint, captureSourceFingerprint: async () => semanticFingerprint(current[id]),
      recheckSourceFingerprint: async (expected: string) => !options.sourceChanges && expected === semanticFingerprint(current[id]) ? { status: "success" as const } : { status: "failure" as const, reason: "changed" },
      writeDurableTargetExact: async (value: unknown) => {
        if (options.failTargetLocal && id !== "executionHistory" && id !== "historicalPlan" &&
            (value as { value?: string }).value?.endsWith("target"))
          return { status: "failure" as const, reason: "injected" };
        current = { ...current, [id]: structuredClone(value) }; return { status: "success" as const }; },
      verifyDurableTarget: async (value: unknown) => semanticFingerprint(current[id]) === semanticFingerprint(value) ? { status: "success" as const } : { status: "failure" as const, reason: "mismatch" },
      buildRuntimeTargetFromDurable: async (value: unknown) => options.invalidRuntime &&
        (value as { value?: string }).value?.endsWith("target")
        ? { status: "invalid" as const, reason: "injected" }
        : { status: "valid" as const, target: { runtimeValue:
          (value as { value: string }).value } },
    }));
    const durable = new Map<string, { target: RestorePayloadSet; recovery: RestorePayloadSet }>();
    const runtime = { begin: () => { transaction = true; return { status: "begun" as const, epoch: 1 }; },
      install: (id: string) => { if (!transaction) return { status: "notActive" as const }; installed.push(id); return { status: "installed" as const }; },
      commit: () => { transaction = false; return { status: "committed" as const }; }, abort: () => { transaction = false; return { status: "aborted" as const }; },
      getState: () => ({ status: transaction ? "active" : "inactive" }), captureAll: () => ({}) };
    const coordinator = createRestoreCoordinator({ participants, runtime, allocateId: () => RAW_UUID,
      antiResurrection: { writeExact: async () => ({ status: "success" }), verifyExact: async () => ({ status: "success" }) },
      now: () => "2026-08-22T12:00:00.000Z", journal: createRestoreJournalStorage(journalStorage), localStage: createRestoreLocalStaging(localStorage),
      durableStage: { stage: async (id, target, recovery) => { durable.set(id, { target: structuredClone(target), recovery: structuredClone(recovery) });
          return { status: "success" }; }, read: async (id) => { const value = durable.get(id); if (!value) return { status: "failure" as const, reason: "missing" };
          const targetFingerprint = wholeFingerprint(fingerprintPayloads(value.target)); const recoveryFingerprint = wholeFingerprint(fingerprintPayloads(value.recovery));
          return { status: "success" as const, ...structuredClone(value), metadata: { targetFingerprint, recoveryFingerprint } }; },
        cleanup: async (id) => { durable.delete(id); return { status: "success" }; } },
      combinedIndexedDb: { replaceExact: async ({ executionHistory, historicalPlan }) => { current = { ...current, executionHistory: structuredClone(executionHistory), historicalPlan: structuredClone(historicalPlan) }; return { status: "success" }; },
        verifyExact: async (value) => semanticFingerprint({ executionHistory: current.executionHistory, historicalPlan: current.historicalPlan }) === semanticFingerprint(value) ? { status: "success" } : { status: "failure", reason: "mismatch" } },
    });
    return { coordinator, current: () => current, installed, journalStorage };
  }

  it("commits all five durable targets then installs one coherent runtime transaction", async () => {
    const test = harness(); expect(await test.coordinator.restore(payloads("target"))).toEqual({ status: "completed" });
    expect(test.current()).toEqual(payloads("target")); expect(test.installed).toEqual(["active", "profiles", "planDecisions", "executionHistory", "historicalPlan"]);
    expect(test.journalStorage.values.size).toBe(0); expect(test.coordinator.getStatus()).toBe("idle");
  });

  it("rejects a changed source before the first live authority write", async () => {
    const test = harness({ sourceChanges: true }); expect(await test.coordinator.restore(payloads("target"))).toEqual({ status: "sourceChanged" });
    expect(test.current()).toEqual(payloads("recovery")); expect(test.installed).toEqual([]);
  });

  it("rejects an untranslatable target before the first live durable write", async () => {
    const test = harness({ invalidRuntime: true });
    expect(await test.coordinator.restore(payloads("target"))).toEqual({ status: "invalidTarget",
      participantId: "active" });
    expect(test.current()).toEqual(payloads("recovery")); expect(test.installed).toEqual([]);
  });

  it("translates verified recovery authority after a durable rollback", async () => {
    const test = harness({ failTargetLocal: true });
    expect(await test.coordinator.restore(payloads("target"))).toEqual({ status: "rolledBack" });
    expect(test.current()).toEqual(payloads("recovery"));
    expect(test.installed).toEqual(["active", "profiles", "planDecisions",
      "executionHistory", "historicalPlan"]);
  });

  it("maps startup recovery-required evidence to the pre-bootstrap protection hook", async () => {
    const hook = createRestorePreBootstrapHook({ recoverAtStartup: async () => ({ status: "recoveryRequired" }) });
    expect(await hook()).toEqual({ status: "protected", reason: "authorityRecoveryRequired" });
  });
});
