import { writeFileSync } from "node:fs";
import { createHistoricalPlanSurface } from "../../../../../code/src/state/historicalPlanSurface.js";
import {
  createDayFrameDurableDb,
  HISTORICAL_PLAN_BATCH_STORE,
} from "../../../../../code/src/infrastructure/storage/dayFrameDurableDb.js";
import {
  beforeEach,
  expect,
  it,
  vi,
} from "../../../../../code/node_modules/vitest/dist/index.js";
import { IDBFactory } from "../../../../../code/node_modules/fake-indexeddb/build/esm/index.js";
import { createDayFrameStore } from "../../../../../code/src/state/dayFrameStore.js";
import { createReviewScope } from "../../../../../code/src/core/planning/reviewScope.js";
import { publicationBlockers } from "../../../../../code/src/state/publicationEligibility.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY as capability,
  getDayFrameRuntimeAuthorityController,
} from "../../../../../code/src/state/dayFrameRuntimeAuthority.js";
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
) {
  const store = createDayFrameStore(
    {},
    { executionHistoryClock: () => at, historicalPlanSurface },
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

it.each(["clear", "restore"] as const)(
  "diagnostic: delayed physical publication crosses successful %s",
  async (replacement) => {
    const db = createDayFrameDurableDb();
    const historicalPlanSurface = createHistoricalPlanSurface({ storage: db });
    const store = await setup(historicalPlanSurface);
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
    const reviewScope = createReviewScope({
      kind: "custom",
      anchorUserDayDate: day,
      weekStartsOn: "monday",
      source: "explicit",
      customRange: publicationRange,
    });
    const review = await store.queryPlanningReview({
      reviewScope,
      historyAsOf: at,
    });
    expect(publicationBlockers(review)).toEqual([]);
    expect(await store.exportHistoricalPlan()).toMatchObject({
      status: "exported",
      batches: [],
    });
    const backup = await store.exportBackupV14(at);
    if (backup.status !== "exported") throw Error(JSON.stringify(backup));
    const controller = getDayFrameRuntimeAuthorityController(store, capability);
    let release!: () => void;
    let reached!: () => void;
    let physicalAdmissionSupplied = false;
    const gate = new Promise<void>((r) => (release = r));
    const entered = new Promise<void>((r) => (reached = r));
    const original = db.mutate;
    vi.spyOn(db, "mutate").mockImplementation(async (rows, admit) => {
      if (
        rows.some(
          (row) =>
            row.type === "put" && row.store === HISTORICAL_PLAN_BATCH_STORE,
        )
      ) {
        physicalAdmissionSupplied = typeof admit === "function";
        reached();
        await gate;
      }
      return original(rows, admit);
    });
    const pending = store.publishScheduleRange({
      publicationRange,
      publishedAt: at,
      expectedSourceFingerprint: review.sourceFingerprint,
    });
    await entered;
    const epochBefore = controller.getEpoch?.();
    const replaced =
      replacement === "clear"
        ? await store.clearLocalData()
        : await store.importBackupV14(backup.backup);
    expect(replaced.status).toBe(
      replacement === "clear" ? "cleared" : "restoredV14",
    );
    expect(store.getState().preview).toBeNull();
    expect(await store.exportHistoricalPlan()).toMatchObject({
      status: "exported",
      batches: [],
    });
    const historyBeforeRelease = await store.exportHistoricalPlan();
    release();
    const outcome = await pending;
    const history = await store.exportHistoricalPlan();

    expect(physicalAdmissionSupplied).toBe(false);
    expect(outcome.status).toBe("published");
    expect(history.status === "exported" && history.batches.length).toBe(1);
    const restarted = createDayFrameStore();
    await restarted.whenReady();
    const persisted = await restarted.exportHistoricalPlan();
    expect(persisted.status === "exported" && persisted.batches.length).toBe(1);
    expect(persisted).toEqual(history);
    writeFileSync(
      new URL(
        `./publication-${replacement}-observations-RESULT.json`,
        import.meta.url,
      ),
      JSON.stringify(
        {
          fixture:
            "Canonical Sleep and Work authored through production store; fake IndexedDB and memory localStorage; controlled delay before real physical mutate",
          replacement,
          replaced,
          physicalAdmissionSupplied,
          historyBeforeRelease,
          epochBefore,
          epochAfter: controller.getEpoch?.(),
          outcome,
          historyAfterLateWrite: history,
          historyAfterRestart: persisted,
        },
        null,
        2,
      ) + "\n",
    );
  },
);
