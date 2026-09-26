/* @vitest-environment jsdom */
import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { v14RestoreFixture } from "../ui/tests/v14RestoreFixture.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import {
  DAYFRAME_RESTORE_CAPABILITY,
  getDayFrameRestoreComposition,
} from "./dayFrameRestoreComposition.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  getDayFrameRuntimeAuthorityController,
} from "./dayFrameRuntimeAuthority.js";

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("indexedDB", new IDBFactory());
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
async function destination() {
  localStorage.clear();
  vi.stubGlobal("indexedDB", new IDBFactory());
  const db = createDayFrameDurableDb();
  const store = createDayFrameStore({}, { restoreIndexedDb: db });
  await store.whenReady();
  const goal = await store.createGoal({ title: "Destination B only" });
  if (goal.status !== "accepted") throw Error("B");
  localStorage.setItem("unrelated-independent-key", "B remains");
  return { store, db, goal: goal.goal };
}
async function data(store: ReturnType<typeof createDayFrameStore>) {
  const e = await store.exportBackupV14(new Date().toISOString());
  if (e.status !== "exported") throw Error(JSON.stringify(e));
  return e.backup.data;
}

async function equivalent(
  store: ReturnType<typeof createDayFrameStore>,
  expected: Awaited<ReturnType<typeof data>>,
) {
  const actual = await data(store);
  // IDB key order is not accepted chronology. Compare these unordered authority collections by exact identity.
  for (const key of ["proposals", "candidates", "decisions", "acceptedAllocations"] as const) {
    expect(actual.proposals[key]).toHaveLength(expected.proposals[key].length);
    expect([...actual.proposals[key]].sort((a, b) => a.id.localeCompare(b.id))).toEqual(
      [...expected.proposals[key]].sort((a, b) => a.id.localeCompare(b.id)),
    );
  }
  for (const key of ["realizations", "facts"] as const) {
    expect(actual.realizations[key]).toHaveLength(expected.realizations[key].length);
    expect([...actual.realizations[key]].sort((a, b) => a.id.localeCompare(b.id))).toEqual(
      [...expected.realizations[key]].sort((a, b) => a.id.localeCompare(b.id)),
    );
  }
  const remainingActual = { ...actual, proposals: undefined, realizations: undefined };
  const remainingExpected = { ...expected, proposals: undefined, realizations: undefined };
  expect(remainingActual).toEqual(remainingExpected);
  expect(actual.proposals.version).toBe(expected.proposals.version);
  expect(actual.realizations.version).toBe(expected.realizations.version);
}

it("all thirteen production participant callbacks support a receiver-sensitive native clone contract", async () => {
  const native = globalThis.structuredClone;
  function sensitive<T>(this: unknown, value: T): T {
    if (this !== undefined && this !== globalThis) throw new TypeError("Illegal invocation");
    return native(value);
  }
  expect(() => ({ clonePayload: sensitive }).clonePayload({})).toThrow("Illegal invocation");
  vi.stubGlobal("structuredClone", sensitive);
  const { store, backup } = await v14RestoreFixture();
  const composition = getDayFrameRestoreComposition(store, DAYFRAME_RESTORE_CAPABILITY);
  expect(Object.keys(composition.participants)).toHaveLength(13);
  for (const participant of Object.values(composition.participants)) {
    const value = { date: new Date("2026-09-01"), map: new Map([["a", 1]]), optional: undefined };
    const copy = participant.clonePayload(value as never);
    expect(copy).toEqual(value);
    expect(copy).not.toBe(value);
  }
  expect(await store.importBackupFile(backup)).toMatchObject({ status: "restoredV14" });
}, 20000);

it("V14 replaces B with exact A authority, preserves optional absence, distinct planning, Actual and Progress across reinitialization", async () => {
  const a = await v14RestoreFixture();
  const b = await destination();
  expect(await b.store.importBackupFile(a.backup)).toMatchObject({ status: "restoredV14" });
  expect(await data(b.store)).toEqual(a.backup.data);
  expect(b.store.getGoal(b.goal.id)).toBeUndefined();
  const request = b.store
    .exportGoalPlanningAuthority()
    .demands.find((d) => d.id === a.requestId && d.revision === 2)!;
  expect(request.session).toEqual({ mode: "splittable", minimumMinutes: 15, preferredMinutes: 45 });
  expect(request.session).not.toHaveProperty("maximumMinutes");
  expect(
    b.store
      .exportProposalAuthority()
      .acceptedAllocations.map((x) => x.id)
      .sort(),
  ).toEqual([...a.acceptedIds].sort());
  expect(b.store.exportRealizationAuthority().realizations).toHaveLength(2);
  expect(b.store.getExecutionHistory()[0]).toMatchObject({ actualTime: { durationMinutes: 47 } });
  expect(b.store.exportProgressObservationAuthority().observations[0]).toMatchObject({
    value: "17",
  });
  expect(b.store.getState().preview).toBeNull();
  expect(localStorage.getItem("unrelated-independent-key")).toBe("B remains");
  b.db.close();
  const restarted = createDayFrameStore();
  expect(await restarted.whenReady()).toEqual({ status: "ready" });
  await equivalent(restarted, a.backup.data);
  expect(localStorage.getItem("dayframe-restore-journal-v1")).toBeNull();
}, 20000);

it("invalid/future V14 admission and a participant capture failure leave B unchanged; supported retry succeeds", async () => {
  const a = await v14RestoreFixture();
  const b = await destination();
  const before = await data(b.store);
  const invalid = structuredClone(a.backup);
  invalid.data.goals.goals = [];
  expect(await b.store.importBackupFile(invalid)).toEqual({ status: "invalidBackup" });
  expect(await b.store.importBackupFile({ ...a.backup, version: 999 })).toMatchObject({
    status: "rejected",
    reason: "unsupportedVersion",
  });
  expect(await data(b.store)).toEqual(before);
  const c = getDayFrameRestoreComposition(b.store, DAYFRAME_RESTORE_CAPABILITY);
  const capture = vi
    .spyOn(c.participants.goals, "captureCurrentAuthority")
    .mockRejectedValueOnce(Error("injected capture"));
  expect(await b.store.importBackupFile(a.backup)).toEqual({ status: "persistenceFailure" });
  expect(c.coordinator.getStatus()).toBe("idle");
  expect(await data(b.store)).toEqual(before);
  capture.mockRestore();
  expect(await b.store.importBackupFile(a.backup)).toMatchObject({ status: "restoredV14" });
}, 20000);

it("an injected atomic IndexedDB commit failure aborts safely and a later explicit import can retry", async () => {
  const a = await v14RestoreFixture();
  const b = await destination();
  const before = await data(b.store);
  const mutate = b.db.mutate;
  const injected = vi
    .spyOn(b.db, "mutate")
    .mockImplementation(async (changes) =>
      changes.some((c) => c.type === "clear" && c.store === "goals")
        ? { status: "failure", error: { code: "transactionAborted", operation: "mutate" } }
        : mutate(changes),
    );
  expect(await b.store.importBackupFile(a.backup)).toEqual({ status: "persistenceFailure" });
  expect(await data(b.store)).toEqual(before);
  injected.mockRestore();
  expect(await b.store.importBackupFile(a.backup)).toMatchObject({ status: "restoredV14" });
  expect(await data(b.store)).toEqual(a.backup.data);
}, 20000);

it("local target write failure rolls back exact B rather than reporting success", async () => {
  const a = await v14RestoreFixture();
  const b = await destination();
  const before = await data(b.store);
  const c = getDayFrameRestoreComposition(b.store, DAYFRAME_RESTORE_CAPABILITY);
  const write = c.participants.active.writeDurableTargetExact;
  let calls = 0;
  vi.spyOn(c.participants.active, "writeDurableTargetExact").mockImplementation(async (p) =>
    ++calls <= 2 ? { status: "failure", reason: "injected local write" } : write(p),
  );
  expect(await b.store.importBackupFile(a.backup)).toEqual({ status: "rollbackCompleted" });
  expect(await data(b.store)).toEqual(before);
  expect(c.coordinator.getStatus()).toBe("idle");
}, 20000);

it("post-commit runtime installation failure retains recovery protection, blocks authoring, and survives restart", async () => {
  const a = await v14RestoreFixture();
  const b = await destination();
  const runtime = getDayFrameRuntimeAuthorityController(
    b.store,
    DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  );
  vi.spyOn(runtime, "install").mockReturnValue({ status: "installFailed" });
  expect(await b.store.importBackupFile(a.backup)).toEqual({ status: "recoveryRequired" });
  expect(
    getDayFrameRestoreComposition(b.store, DAYFRAME_RESTORE_CAPABILITY).coordinator.getStatus(),
  ).toBe("recoveryRequired");
  expect(b.store.getReadiness()).toEqual({
    status: "protected",
    reason: "authorityRecoveryRequired",
  });
  expect(await b.store.createGoal({ title: "Must not author during recovery" })).toMatchObject({
    status: "rejected",
    reason: "authorityTransactionActive",
  });
  expect(await b.store.importBackupFile(a.backup)).toEqual({ status: "restoreBusy" });
  vi.restoreAllMocks();
  b.db.close();
  const restarted = createDayFrameStore();
  await restarted.whenReady();
  // Existing journal resumes the committed target, with no new recovery command or data rebuild.
  await equivalent(restarted, a.backup.data);
}, 20000);

it("failed rollback remains recovery-required across restart and does not unlock ordinary import or authoring", async () => {
  const a = await v14RestoreFixture();
  const b = await destination();
  const c = getDayFrameRestoreComposition(b.store, DAYFRAME_RESTORE_CAPABILITY);
  vi.spyOn(c.participants.active, "writeDurableTargetExact").mockResolvedValue({
    status: "failure",
    reason: "injected forward and rollback failure",
  });
  expect(await b.store.importBackupFile(a.backup)).toEqual({ status: "recoveryRequired" });
  expect(await b.store.createGoal({ title: "Blocked" })).toMatchObject({ status: "rejected" });
  expect(JSON.parse(localStorage.getItem("dayframe-restore-journal-v1")!).stage).toBe(
    "recoveryRequired",
  );
  vi.restoreAllMocks();
  b.db.close();
  const restarted = createDayFrameStore();
  expect(await restarted.whenReady()).toEqual({
    status: "protected",
    reason: "authorityRecoveryRequired",
  });
  expect(await restarted.createGoal({ title: "Still blocked" })).toMatchObject({
    status: "rejected",
  });
  expect((await restarted.importBackupFile(a.backup)).status).not.toBe("restoredV14");
}, 20000);

it("protected participant admission never overwrites the protected destination", async () => {
  const a = await v14RestoreFixture();
  const b = await destination();
  const before = await data(b.store);
  const c = getDayFrameRestoreComposition(b.store, DAYFRAME_RESTORE_CAPABILITY);
  const readiness = vi.spyOn(c.participants.goals, "getReadiness").mockReturnValue("protected");
  expect(await b.store.importBackupFile(a.backup)).toEqual({
    status: "protectedCurrentState",
    surface: "goals",
  });
  readiness.mockRestore();
  expect(await data(b.store)).toEqual(before);
  expect(c.coordinator.getStatus()).toBe("idle");
}, 20000);
