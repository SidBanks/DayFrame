import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SourceIncarnationId } from "../core/authored/sourceIncarnation.js";
import type { DurableOccurrenceReference } from "../core/occurrences/durableOccurrenceReference.js";
import type { ExecutionHistoricalSnapshot, ExecutionRecordId, ExecutionSubjectId } from
  "../core/execution/executionRecord.js";
import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";
import {
  DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY,
  EXECUTION_HISTORY_SURFACE_VERSION,
  createExecutionHistorySurface,
} from "./executionHistorySurface.js";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  failWrite = false;
  failRead = false;
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  getItem(key: string) { if (this.failRead) throw new Error("read"); return this.values.get(key) ?? null; }
  removeItem(key: string) { if (this.failWrite) throw new Error("remove"); this.values.delete(key); }
  setItem(key: string, value: string) { if (this.failWrite) throw new Error("quota"); this.values.set(key, value); }
}

const recordIds = [
  "00000000-0000-4000-8000-000000000001",
  "00000000-0000-4000-8000-000000000002",
  "00000000-0000-4000-8000-000000000003",
  "00000000-0000-4000-8000-000000000004",
] as ExecutionRecordId[];
const subjectIds = [
  "10000000-0000-4000-8000-000000000001",
  "10000000-0000-4000-8000-000000000002",
] as ExecutionSubjectId[];
const reference: DurableOccurrenceReference = {
  version: 1, sourceKind: "template",
  template: { id: "template", incarnationId: "20000000-0000-4000-8000-000000000001" as SourceIncarnationId },
  recurrence: { id: "recurrence", incarnationId: "20000000-0000-4000-8000-000000000002" as SourceIncarnationId },
  coordinate: { frequency: "daily", scopeKind: "userDay", userDayDate: "2026-08-20", slot: 0 },
};
const snapshot: ExecutionHistoricalSnapshot = {
  sourceFamily: "template", title: "Workout", category: "fitness",
  userDay: { date: "2026-08-20", dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
  plan: { state: "scheduled", startsAt: "2026-08-20T15:00:00.000Z", endsAt: "2026-08-20T16:00:00.000Z" },
};

let storage: MemoryStorage;
beforeEach(() => {
  storage = new MemoryStorage();
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
});

function providers() {
  let recordIndex = 0;
  let subjectIndex = 0;
  let hour = 18;
  return {
    allocateRecordId: () => recordIds[recordIndex++]!,
    allocateSubjectId: () => subjectIds[subjectIndex++]!,
    now: () => `2026-08-20T${String(hour++).padStart(2, "0")}:00:00.000Z`,
  };
}

function storeProviders() {
  const value = providers();
  return { allocateExecutionRecordId: value.allocateRecordId,
    allocateExecutionSubjectId: value.allocateSubjectId, executionHistoryClock: value.now };
}

function plannedInput(outcome: "completed" | "partial" | "skipped" = "completed") {
  return { subject: { kind: "planned" as const, reference }, snapshot, outcome };
}

function validEnvelope() {
  const surface = createExecutionHistorySurface(providers());
  const accepted = surface.recordExecution(plannedInput());
  if (accepted.status !== "accepted") throw new Error("fixture failed");
  return surface.exportExecutionHistoryEnvelope();
}

describe("ExecutionHistory V1 ingress and envelope", () => {
  it("uses an independent key/version and treats no key as healthy empty history", () => {
    const surface = createExecutionHistorySurface();
    expect(surface.getExecutionHistory()).toEqual([]);
    expect(surface.getExecutionHistoryIngressStatus()).toEqual({ status: "noSource", reason: "missing" });
    expect(surface.getExecutionHistoryDurabilityStatus()).toBe("durable");
    expect(EXECUTION_HISTORY_SURFACE_VERSION).toBe(1);
  });

  it("rehydrates exact records and outcomes without source resolution or allocation", () => {
    const envelope = validEnvelope();
    const allocate = vi.fn(() => { throw new Error("must not allocate"); });
    const restarted = createExecutionHistorySurface({ allocateRecordId: allocate, allocateSubjectId: allocate });
    expect(restarted.getExecutionHistory()).toEqual(envelope.records);
    const record = restarted.getExecutionHistory()[0]!;
    expect(restarted.getExecutionOutcome(record.subjectId)).toMatchObject({ status: "completed" });
    expect(allocate).not.toHaveBeenCalled();
  });

  it.each([
    ["corruptJson", "{"],
    ["unsupportedVersion", JSON.stringify({ app: "DayFrame", surface: "executionHistory", version: 2, records: [], quarantinedComponents: [] })],
    ["invalidEnvelope", JSON.stringify({ app: "DayFrame", surface: "planDecisions", version: 1, records: [], quarantinedComponents: [] })],
  ])("protects whole-source %s and blocks ordinary writes", (reason, raw) => {
    storage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, raw);
    const surface = createExecutionHistorySurface(providers());
    expect(surface.getExecutionHistoryIngressStatus()).toMatchObject({ status: "recoveryRequired", reason });
    expect(surface.exportProtectedExecutionHistorySource()).toEqual({ status: "exported", raw });
    expect(surface.recordExecution(plannedInput())).toEqual({ status: "rejected", reason: "protectedHistoryIngress" });
    expect(surface.retryExecutionHistoryPersistence()).toEqual({ status: "notAttempted", reason: "recoveryProtected" });
  });

  it("uses source recheck for protected replace and abandon", () => {
    storage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, "{");
    const changed = createExecutionHistorySurface();
    storage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, "different");
    expect(changed.replaceProtectedExecutionHistoryCheckpoint()).toEqual({ status: "notAttempted", reason: "sourceChanged" });

    storage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, "{");
    const replace = createExecutionHistorySurface();
    expect(replace.replaceProtectedExecutionHistoryCheckpoint()).toMatchObject({ status: "resolved", action: "replace" });
    expect(createExecutionHistorySurface().getExecutionHistory()).toEqual([]);

    storage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, "{");
    const abandon = createExecutionHistorySurface();
    expect(abandon.abandonProtectedExecutionHistoryCheckpoint()).toMatchObject({ status: "resolved", action: "abandon" });
    expect(createExecutionHistorySurface().getExecutionHistoryIngressStatus()).toMatchObject({ status: "accepted" });
  });
});

describe("component quarantine", () => {
  it("preserves valid independent subjects and quarantines malformed/unsupported components", () => {
    const envelope = validEnvelope();
    const valid = envelope.records[0] as Record<string, unknown>;
    const malformed = { version: 1, id: recordIds[2], subjectId: subjectIds[1], kind: "assertion" };
    const unsupported = { ...valid, version: 2, id: recordIds[3], subjectId: "10000000-0000-4000-8000-000000000003" };
    storage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify({ ...envelope,
      records: [valid, malformed, unsupported] }));
    const loaded = createExecutionHistorySurface();
    expect(loaded.getExecutionHistory()).toHaveLength(1);
    expect(loaded.getQuarantinedExecutionHistory()).toHaveLength(2);
    expect(loaded.getExecutionHistoryIngressStatus()).toEqual({ status: "accepted", quarantinedComponentCount: 2 });
  });

  it("quarantines all duplicate-planned and duplicate-ID implicated subjects", () => {
    const envelope = validEnvelope();
    const first = envelope.records[0] as Record<string, unknown>;
    const duplicatePlanned = { ...structuredClone(first), id: recordIds[1], subjectId: subjectIds[1] };
    storage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify({ ...envelope, records: [first, duplicatePlanned] }));
    const plannedConflict = createExecutionHistorySurface();
    expect(plannedConflict.getExecutionHistory()).toEqual([]);
    expect(plannedConflict.getQuarantinedExecutionHistory()).toHaveLength(2);
    expect(plannedConflict.getQuarantinedExecutionHistory().every((entry) => entry.reason === "duplicatePlannedReference")).toBe(true);

    const second = { ...structuredClone(first), subjectId: subjectIds[1] };
    storage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify({ ...envelope, records: [first, second] }));
    const idConflict = createExecutionHistorySurface();
    expect(idConflict.getExecutionHistory()).toEqual([]);
    expect(idConflict.getQuarantinedExecutionHistory().every((entry) => entry.reason === "duplicateRecordId")).toBe(true);
  });

  it("quarantines both sides of cross-subject replacement", () => {
    const envelope = validEnvelope();
    const first = envelope.records[0] as Record<string, unknown>;
    const otherRoot = { ...structuredClone(first), id: recordIds[1], subjectId: subjectIds[1],
      subject: { kind: "unplanned" }, snapshot: { ...snapshot, sourceFamily: "unplanned", plan: { state: "unplanned" } } };
    const cross = { ...structuredClone(first), id: recordIds[2], subjectId: subjectIds[1],
      replacesRecordId: first.id, subject: otherRoot.subject, snapshot: otherRoot.snapshot,
      recordedAt: "2026-08-20T19:00:00.000Z" };
    storage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify({ ...envelope, records: [first, otherRoot, cross] }));
    const loaded = createExecutionHistorySurface();
    expect(loaded.getExecutionHistory()).toEqual([]);
    expect(loaded.getQuarantinedExecutionHistory()).toHaveLength(2);
  });

  it("persists, exports, clone-isolates, and explicitly removes quarantine", () => {
    const envelope = validEnvelope();
    storage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, JSON.stringify({ ...envelope, records: [...envelope.records, { bad: true }] }));
    const loaded = createExecutionHistorySurface(providers());
    const quarantine = loaded.getQuarantinedExecutionHistory();
    quarantine[0]!.rawRecords.push("mutated");
    expect(loaded.getQuarantinedExecutionHistory()[0]!.rawRecords).not.toContain("mutated");
    const id = loaded.getQuarantinedExecutionHistory()[0]!.quarantineId;
    expect(loaded.exportQuarantinedExecutionHistory(id).status).toBe("exported");
    expect(loaded.removeQuarantinedExecutionHistory(id)).toMatchObject({ status: "removed", persistence: { status: "persisted" } });
    expect(createExecutionHistorySurface().getQuarantinedExecutionHistory()).toEqual([]);
  });
});

describe("store-owned report, correction, retraction, and durability", () => {
  it("appends planned/unplanned reports, prevents duplicate planned subjects and rejects unplanned skip", () => {
    const surface = createExecutionHistorySurface(providers());
    const first = surface.recordExecution(plannedInput());
    expect(first.status).toBe("accepted");
    expect(surface.recordExecution(plannedInput())).toEqual({ status: "rejected", reason: "duplicatePlannedSubject" });
    expect(surface.findExecutionSubjectByPlannedReference(reference)).toBe(subjectIds[0]);
    const unplannedSnapshot = { ...snapshot, sourceFamily: "unplanned" as const, plan: { state: "unplanned" as const } };
    expect(surface.recordExecution({ subject: { kind: "unplanned" }, snapshot: unplannedSnapshot, outcome: "partial" }).status).toBe("accepted");
    expect(surface.recordExecution({ subject: { kind: "unplanned" }, snapshot: unplannedSnapshot, outcome: "skipped" })).toMatchObject({ status: "rejected", reason: "invalidInput" });
  });

  it("appends correction/retraction/restoration and rejects stale heads", () => {
    const surface = createExecutionHistorySurface(providers());
    const first = surface.recordExecution(plannedInput());
    if (first.status !== "accepted") throw new Error("fixture failed");
    const corrected = surface.correctExecutionRecord(first.record.subjectId, first.record.id,
      { snapshot, outcome: "partial", actualTime: { durationMinutes: 20 } });
    expect(corrected.status).toBe("accepted");
    expect(surface.correctExecutionRecord(first.record.subjectId, first.record.id, { snapshot, outcome: "completed" }))
      .toEqual({ status: "rejected", reason: "notCurrentHead" });
    if (corrected.status !== "accepted") return;
    const retracted = surface.retractExecutionRecord(first.record.subjectId, corrected.record.id, "incorrect");
    expect(surface.getExecutionOutcome(first.record.subjectId)).toEqual({ status: "unknown" });
    if (retracted.status !== "accepted") return;
    const restored = surface.correctExecutionRecord(first.record.subjectId, retracted.record.id, { snapshot, outcome: "completed" });
    expect(restored.status).toBe("accepted");
    expect(surface.getExecutionOutcome(first.record.subjectId)).toMatchObject({ status: "completed" });
  });

  it("keeps runtime authority after quota failure and retries exact desired checkpoint without allocation", () => {
    const allocateRecord = vi.fn(() => recordIds[0]!);
    const allocateSubject = vi.fn(() => subjectIds[0]!);
    const now = vi.fn(() => "2026-08-20T18:00:00.000Z");
    const surface = createExecutionHistorySurface({ allocateRecordId: allocateRecord,
      allocateSubjectId: allocateSubject, now });
    storage.failWrite = true;
    const result = surface.recordExecution(plannedInput());
    expect(result).toMatchObject({ status: "accepted", persistence: { status: "storageFailure" } });
    expect(surface.getExecutionHistory()).toHaveLength(1);
    const exact = surface.getExecutionHistory();
    storage.failWrite = false;
    expect(surface.retryExecutionHistoryPersistence()).toEqual({ status: "attempted", persistence: { status: "persisted" } });
    expect(surface.getExecutionHistory()).toEqual(exact);
    expect(allocateRecord).toHaveBeenCalledTimes(1);
    expect(allocateSubject).toHaveBeenCalledTimes(1);
    expect(now).toHaveBeenCalledTimes(1);
  });

  it("clone-isolates history subscriptions and separates durability-only retry notifications", () => {
    const surface = createExecutionHistorySurface(providers());
    const history = vi.fn((value) => { if (value[0]?.kind === "assertion") value[0].snapshot.title = "mutated"; });
    const durability = vi.fn();
    surface.subscribeExecutionHistory(history);
    surface.subscribeExecutionHistoryDurability(durability);
    storage.failWrite = true;
    surface.recordExecution(plannedInput());
    expect(surface.getExecutionHistory()[0]).toMatchObject({ snapshot: { title: "Workout" } });
    storage.failWrite = false;
    surface.retryExecutionHistoryPersistence();
    expect(history).toHaveBeenCalledTimes(1);
    expect(durability).toHaveBeenCalled();
  });
});

describe("DayFrame store integration and independence", () => {
  it("exposes history outside DayFrameState without notifying state subscribers or changing Preview", () => {
    const store = createReadyDayFrameTestStore(undefined, storeProviders());
    const stateListener = vi.fn();
    store.subscribe(stateListener);
    const before = store.getState();
    expect(store.recordExecution(plannedInput()).status).toBe("accepted");
    expect(stateListener).not.toHaveBeenCalled();
    expect(store.getState()).toEqual(before);
    expect("executionHistory" in store.getState()).toBe(false);
  });

  it("profile/backup/PlanDecision-free operations preserve history and export excludes derived state", () => {
    const store = createReadyDayFrameTestStore(undefined, storeProviders());
    const accepted = store.recordExecution(plannedInput());
    if (accepted.status !== "accepted") throw new Error("fixture failed");
    const before = store.getExecutionHistory();
    store.saveProfile({ name: "profile", savedAt: "2026-08-20T20:00:00.000Z" });
    store.exportBackup("2026-08-20T20:00:00.000Z");
    expect(store.getExecutionHistory()).toEqual(before);
    const serialized = JSON.stringify(store.exportExecutionHistoryEnvelope());
    expect(serialized).not.toMatch(/OccurrenceOutcome|durability|preview|planDecisions/);
  });

  it("full clear removes valid history/quarantine and prevents restart resurrection", async () => {
    const store = createReadyDayFrameTestStore(undefined, storeProviders());
    store.recordExecution(plannedInput());
    const result = await store.clearLocalData();
    expect(result.executionHistory).toEqual({ status: "removed" });
    expect(result.durability).toBe("cleared");
    expect(store.getExecutionHistory()).toEqual([]);
    expect(storage.getItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY)).toBeNull();
    expect(createExecutionHistorySurface().getExecutionHistory()).toEqual([]);
  });

  it("full-clear failure clears session authority and reports unresolved durable removal", async () => {
    const store = createReadyDayFrameTestStore(undefined, storeProviders());
    store.recordExecution(plannedInput());
    storage.failWrite = true;
    const result = await store.clearLocalData();
    expect(result.executionHistory).toEqual({ status: "storageFailure" });
    expect(result.durability).toBe("partiallyCleared");
    expect(store.getExecutionHistory()).toEqual([]);
    expect(store.getExecutionHistoryDurabilityStatus()).toBe("storageFailure");
  });
});
