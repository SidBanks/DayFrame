import { publishScheduleRangeV1 } from "./schedulePublication.js";
import {
  DAYFRAME_RESTORE_CAPABILITY,
  getDayFrameRestoreComposition,
} from "./dayFrameRestoreComposition.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import {
  createDayFrameDurableDb,
  HISTORICAL_PLAN_BATCH_STORE,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import { beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
import { publicationBlockers } from "./publicationEligibility.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY as capability,
  getDayFrameRuntimeAuthorityController,
} from "./dayFrameRuntimeAuthority.js";
class MemoryStorage implements Storage {
  values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  key(i: number) {
    return [...this.values.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.values.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.values.set(k, v);
  }
  removeItem(k: string) {
    this.values.delete(k);
  }
  clear() {
    this.values.clear();
  }
}
beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
  vi.stubGlobal("indexedDB", new IDBFactory());
});
const at = "2026-09-17T23:59:00.000Z";
const day = "2026-09-17";
async function setup(
  historicalPlanSurface?: ReturnType<typeof createHistoricalPlanSurface>,
  restoreIndexedDb?: ReturnType<typeof createDayFrameDurableDb>,
) {
  const store = createDayFrameStore(
    {},
    {
      executionHistoryClock: () => at,
      ...(historicalPlanSurface ? { historicalPlanSurface } : {}),
      ...(restoreIndexedDb ? { restoreIndexedDb } : {}),
    },
  );
  await store.whenReady();
  store.setSchedulingPreferences({
    dayBoundaryStartTime: "00:00",
    weekStartsOn: "monday",
  });
  expect(
    store.authorSleepRequirement({
      id: "sleep",
      expectedRevision: null,
      recordedAt: "2026-09-01T00:00:00.000Z",
      intent: {
        enabled: true,
        effectiveFrom: "2026-09-01",
        weekdays: "all",
        durationMinutes: 120,
        bufferBeforeMinutes: 30,
        bufferAfterMinutes: 30,
        window: { kind: "clock", startClock: "00:00", endClock: "08:00" },
      },
    }).status,
  ).toBe("authored");
  store.setShiftDefinitions([
    {
      id: "day",
      userId: "u",
      name: "Day",
      startTime: "12:00",
      endTime: "13:00",
      workDays: ["thursday"],
      crossesMidnight: false,
      createdAt: at,
      updatedAt: at,
    },
  ]);
  store.setShiftCycles([
    {
      id: "cycle",
      userId: "u",
      name: "Cycle",
      type: "fixedSegments",
      startsOnDate: "2026-09-01",
      endsOnDate: "2027-01-01",
      segments: [
        {
          id: "segment",
          shiftCycleId: "cycle",
          shiftDefinitionId: "day",
          startsOnDate: "2026-09-01",
          endsOnDate: "2027-01-01",
        },
      ],
      createdAt: at,
      updatedAt: at,
    },
  ]);
  return store;
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
async function eligible(store: Awaited<ReturnType<typeof setup>>) {
  store.generatePreview({
    rangeStartDate: day,
    rangeEndDate: day,
    planningWindowStart: new Date(`${day}T00:00:00`),
    planningWindowEnd: new Date("2026-09-18T00:00:00"),
    generatedAt: "2026-09-16T00:00:00.000Z",
  });
  const publicationRange = {
    version: 1,
    scopeType: "publicationRange",
    startUserDayDate: day,
    endUserDayDateExclusive: "2026-09-18",
    provenance: { source: "explicitPublication" },
  } as const;
  const review = await store.queryPlanningReview({
    reviewScope: createReviewScope({
      kind: "custom",
      anchorUserDayDate: day,
      weekStartsOn: "monday",
      source: "explicit",
      customRange: publicationRange,
    }),
    historyAsOf: at,
  });
  expect(publicationBlockers(review)).toEqual([]);
  return { publicationRange, publishedAt: at, expectedSourceFingerprint: review.sourceFingerprint };
}

it.each(["clear", "restore"] as const)(
  "leased delayed publication denies %s; explicit retry survives restart",
  async (replacement) => {
    const db = createDayFrameDurableDb();
    const owner = createHistoricalPlanSurface({ storage: db });
    const store = await setup(owner);
    const input = await eligible(store);
    const backup = await store.exportBackupV14(at);
    if (backup.status !== "exported") throw Error(backup.status);
    const entered = deferred();
    const release = deferred();
    const original = db.mutate;
    let attempts = 0;
    let transactions = 0;
    vi.spyOn(db, "mutate").mockImplementation(async (rows, admit, observe) => {
      if (rows.some((row) => row.type === "put" && row.store === HISTORICAL_PLAN_BATCH_STORE)) {
        attempts++;
        expect(admit).toBeTypeOf("function");
        entered.resolve();
        await release.promise;
      }
      return original(rows, admit, (receipt) => {
        transactions++;
        observe?.(receipt);
      });
    });
    const publication = store.publishScheduleRange(input);
    await entered.promise;
    const controller = getDayFrameRuntimeAuthorityController(store, capability);
    const epoch = controller.getEpoch?.();
    const state = store.getState();
    if (replacement === "clear")
      await expect(store.clearLocalData()).rejects.toMatchObject({
        reason: "authorityTransactionActive",
      });
    else
      expect(await store.importBackupV14(backup.backup)).toMatchObject({ status: "restoreBusy" });
    expect(controller.getEpoch?.()).toBe(epoch);
    expect(store.getState()).toEqual(state);
    expect(attempts).toBe(1);
    expect(transactions).toBe(0);
    release.resolve();
    const outcome = await publication;
    expect(outcome.status).toBe("published");
    expect(outcome.receipt?.isCurrent()).toBe(true);
    expect(transactions).toBe(1);
    const history = await store.exportHistoricalPlan();
    expect(history.status === "exported" && history.batches.length).toBe(1);
    const result =
      replacement === "clear"
        ? await store.clearLocalData()
        : await store.importBackupV14(backup.backup);
    expect(result.status).toBe(replacement === "clear" ? "cleared" : "restoredV14");
    expect(outcome.receipt?.isCurrent()).toBe(false);
    expect(await store.exportHistoricalPlan()).toMatchObject({ status: "exported", batches: [] });
    const restarted = createDayFrameStore();
    await restarted.whenReady();
    expect(await restarted.exportHistoricalPlan()).toEqual(await store.exportHistoricalPlan());
    if (replacement === "restore") {
      expect((await store.publishScheduleRange(await eligible(store))).status).toBe("published");
    }
  },
);

it("replacement before lazy dispatch rejects old intent; identical restore never renews it", async () => {
  const store = await setup();
  const input = await eligible(store);
  const backup = await store.exportBackupV14(at);
  if (backup.status !== "exported") throw Error(backup.status);
  const controller = getDayFrameRuntimeAuthorityController(store, capability);
  const old = store.publishScheduleRange(input);
  expect(controller.begin("restore").status).toBe("begun");
  expect(controller.abort().status).toBe("aborted");
  expect(await old).toMatchObject({ status: "rejected", reason: "contextReplaced" });
  expect(await store.importBackupV14(backup.backup)).toMatchObject({ status: "restoredV14" });
  expect(await store.exportHistoricalPlan()).toMatchObject({ status: "exported", batches: [] });
});

it("a new call during active replacement returns publicationBusy with a receipt", async () => {
  const store = await setup();
  const input = await eligible(store);
  const controller = getDayFrameRuntimeAuthorityController(store, capability);
  controller.begin("restore");
  const outcome = await store.publishScheduleRange(input);
  expect(outcome).toMatchObject({ status: "rejected", reason: "publicationBusy" });
  expect(outcome.receipt).toBeDefined();
  controller.abort();
});

it.each(["identicalRestore", "rollback", "recoveryRequired"] as const)(
  "Review preparation cannot cross %s lifetime",
  async (mode) => {
    const owner = createHistoricalPlanSurface();
    const store = await setup(owner);
    const input = await eligible(store);
    const backup = await store.exportBackupV14(at);
    if (backup.status !== "exported") throw Error(backup.status);
    const origin = owner.capturePublicationOrigin();
    const entered = deferred();
    const release = deferred();
    const recorded = vi.fn();
    const old = publishScheduleRangeV1({
      input,
      origin,
      getState: store.getState,
      getAuthoredSetup: () => backup.backup.data.active.data,
      listGoals: store.listGoals,
      historicalPlan: owner,
      recordResult: recorded,
      queryPlanningReview: async (query) => {
        const value = await store.queryPlanningReview(query);
        entered.resolve();
        await release.promise;
        return value;
      },
    });
    await entered.promise;
    const composition = getDayFrameRestoreComposition(store, DAYFRAME_RESTORE_CAPABILITY);
    if (mode === "rollback") {
      const write = composition.participants.active.writeDurableTargetExact;
      let calls = 0;
      vi.spyOn(composition.participants.active, "writeDurableTargetExact").mockImplementation(
        async (target) =>
          ++calls <= 2
            ? { status: "failure", reason: "controlled forward failure" }
            : write(target),
      );
    }
    if (mode === "recoveryRequired")
      vi.spyOn(getDayFrameRuntimeAuthorityController(store, capability), "install").mockReturnValue(
        { status: "installFailed" },
      );
    expect((await store.importBackupV14(backup.backup)).status).toBe(
      mode === "identicalRestore"
        ? "restoredV14"
        : mode === "rollback"
          ? "rollbackCompleted"
          : "recoveryRequired",
    );
    release.resolve();
    expect(await old).toMatchObject({ status: "rejected", reason: "contextReplaced" });
    expect(recorded).not.toHaveBeenCalled();
    if (mode === "recoveryRequired")
      expect(store.getReadiness()).toMatchObject({ status: "protected" });
    else expect(await store.exportHistoricalPlan()).toMatchObject({ batches: [] });
  },
);

it("Structure and publication both exclude replacement; settling only one is insufficient", async () => {
  const db = createDayFrameDurableDb();
  const owner = createHistoricalPlanSurface({ storage: db });
  const store = await setup(owner, db);
  const a = await store.createGoal({ title: "A" });
  const b = await store.createGoal({ title: "B" });
  if (a.status !== "accepted" || b.status !== "accepted") throw Error("goals");
  const input = await eligible(store);
  const original = db.mutate;
  const publicationEntered = deferred();
  const publicationRelease = deferred();
  const structureEntered = deferred();
  const structureRelease = deferred();
  vi.spyOn(db, "mutate").mockImplementation(async (rows, admit, observe) => {
    if (rows.some((row) => row.store === HISTORICAL_PLAN_BATCH_STORE)) {
      publicationEntered.resolve();
      await publicationRelease.promise;
    }
    if (rows.some((row) => row.store === "goalStructure")) {
      structureEntered.resolve();
      await structureRelease.promise;
    }
    return original(rows, admit, observe);
  });
  const publication = store.publishScheduleRange(input);
  await publicationEntered.promise;
  const structure = store.createRelationship({
    sourceGoalId: a.goal.id,
    target: { kind: "goal", goalId: b.goal.id },
    kind: "dependsOn",
    semantics: { kind: "dependency", strength: "hard", condition: "goalCompleted" },
  });
  await structureEntered.promise;
  const runtime = getDayFrameRuntimeAuthorityController(store, capability);
  const epoch = runtime.getEpoch?.();
  expect(runtime.begin()).toEqual({ status: "busy" });
  publicationRelease.resolve();
  await publication;
  expect(runtime.begin()).toEqual({ status: "busy" });
  expect(runtime.getEpoch?.()).toBe(epoch);
  structureRelease.resolve();
  expect(await structure).toMatchObject({ status: "accepted" });
  expect(runtime.begin().status).toBe("begun");
  runtime.abort();
});

it("failed snapshot invalidates old publication without clearing preserved data or poisoning initialization", async () => {
  const owner = createHistoricalPlanSurface();
  const store = await setup(owner);
  const input = await eligible(store);
  const saved = store.getState();
  const runtime = getDayFrameRuntimeAuthorityController(store, capability);
  const old = store.publishScheduleRange(input);
  const capture = vi
    .spyOn(owner.getRuntimeAuthorityAdapter(capability), "captureRuntimeSnapshot")
    .mockImplementationOnce(() => {
      throw Error("controlled snapshot failure");
    });
  expect(runtime.begin("restore")).toEqual({ status: "snapshotFailed" });
  expect(await old).toMatchObject({ status: "rejected", reason: "contextReplaced" });
  expect(store.getState()).toEqual(saved);
  capture.mockRestore();
  expect((await store.publishScheduleRange(input)).status).toBe("published");
});

it("terminally protected history denies replacement as protected rather than permanently busy", async () => {
  const db = createDayFrameDurableDb();
  const owner = createHistoricalPlanSurface({ storage: db });
  const store = await setup(owner);
  const input = await eligible(store);
  const backup = await store.exportBackupV14(at);
  if (backup.status !== "exported") throw Error(backup.status);
  const get = db.get;
  let reads = 0;
  vi.spyOn(db, "get").mockImplementation(async (...args) =>
    args[0] === HISTORICAL_PLAN_BATCH_STORE && ++reads === 2
      ? { status: "failure", error: { code: "readFailed", operation: "verification" } }
      : get(...args),
  );
  expect(await store.publishScheduleRange(input)).toMatchObject({
    status: "rejected",
    reason: "verificationFailedAfterCommit",
  });
  expect(owner.isHistoricalPlanQuiescent()).toBe(true);
  expect(getDayFrameRuntimeAuthorityController(store, capability).begin()).toEqual({
    status: "protected",
    participantId: "historicalPlan",
  });
  await expect(store.clearLocalData()).rejects.toMatchObject({ reason: "protected" });
  expect(await store.importBackupV14(backup.backup)).toMatchObject({
    status: "protectedCurrentState",
    surface: "historicalPlan",
  });
});
