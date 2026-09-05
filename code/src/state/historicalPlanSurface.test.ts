import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import {
  HISTORICAL_PLAN_DAY_PUBLICATION_VERSION,
  HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_V2_VERSION,
  HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION,
  HISTORICAL_PLAN_SURFACE_VERSION,
  PLAN_PUBLICATION_BATCH_VERSION,
  type PlanPublicationBatchV1,
} from "../core/historicalPlan/historicalPlan.js";
import type { DurableOccurrenceReference } from "../core/occurrences/durableOccurrenceReference.js";
import {
  createDayFrameDurableDb,
  HISTORICAL_PLAN_BATCH_STORE,
  HISTORICAL_PLAN_DAY_STORE,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";
import {
  createReviewScope,
  publicationRangeFromReviewScope,
} from "../core/planning/reviewScope.js";

let database = 0;
const INC = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
function batch(
  id = "11111111-1111-4111-8111-111111111111",
  publishedAt = "2026-08-19T12:00:00.000Z",
  empty = false,
): PlanPublicationBatchV1 {
  const reference = {
    version: 1,
    sourceKind: "work",
    cycle: { id: "cycle", incarnationId: INC },
    entry: { id: "entry", incarnationId: INC, kind: "segment" },
    shiftDefinition: { id: "shift", incarnationId: INC },
    coordinate: { localStartDate: "2026-08-20", slot: 0 },
  } as unknown as DurableOccurrenceReference;
  return {
    surfaceVersion: HISTORICAL_PLAN_SURFACE_VERSION,
    version: PLAN_PUBLICATION_BATCH_VERSION,
    id: id as never,
    publishedAt,
    range: { startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-20" },
    days: [
      {
        version: HISTORICAL_PLAN_DAY_PUBLICATION_VERSION,
        userDayDate: "2026-08-20",
        dayBoundaryStartTime: "03:00",
        weekStartsOn: "monday",
        utcOffsetMinutes: -300,
        occurrences: empty
          ? []
          : [
              {
                version: HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION,
                reference,
                sourceFamily: "work",
                title: "Shift",
                category: "work",
                plan: {
                  state: "scheduled",
                  startsAt: "2026-08-20T13:00:00.000Z",
                  endsAt: "2026-08-20T21:00:00.000Z",
                },
              },
            ],
      },
    ],
  };
}
function v2Batch(
  id: string,
  publishedAt: string,
  kind: "allDay" | "timed",
): PlanPublicationBatchV1 {
  const value = structuredClone(batch(id, publishedAt));
  value.days[0]!.occurrences[0] = {
    ...value.days[0]!.occurrences[0]!,
    version: HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_V2_VERSION,
    timing: { kind },
  };
  return value;
}
function setup() {
  const storage = createDayFrameDurableDb({
    indexedDB: new IDBFactory(),
    name: `historical-plan-${database++}`,
  });
  return { storage, surface: createHistoricalPlanSurface({ storage }) };
}

describe("HistoricalPlan IndexedDB authority", () => {
  it("publishes only after explicit authorization of a fresh reviewed Preview", async () => {
    const { surface } = setup();
    await surface.initialize();
    const timestamps = { createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" };
    const store = createReadyDayFrameTestStore(
      {
        shiftDefinitions: [
          {
            id: "shift",
            userId: "u",
            name: "Day",
            startTime: "08:00",
            endTime: "16:00",
            workDays: ["monday"],
            crossesMidnight: false,
            ...timestamps,
          },
        ],
        shiftCycles: [
          {
            id: "cycle",
            userId: "u",
            name: "Cycle",
            type: "fixedSegments",
            startsOnDate: "2026-05-01",
            segments: [
              {
                id: "segment",
                shiftCycleId: "cycle",
                shiftDefinitionId: "shift",
                startsOnDate: "2026-05-01",
                endsOnDate: "2026-05-31",
              },
            ],
            ...timestamps,
          },
        ],
      },
      { historicalPlanSurface: surface },
    );
    expect(
      (await surface.exportHistoricalPlan()).status === "exported" &&
        ((await surface.exportHistoricalPlan()) as { batches: unknown[] }).batches,
    ).toHaveLength(0);
    const state = store.generatePreview({
      rangeStartDate: "2026-05-04",
      rangeEndDate: "2026-05-04",
      planningWindowStart: new Date("2026-05-04T03:00:00"),
      planningWindowEnd: new Date("2026-05-05T03:00:00"),
      generatedAt: "2026-05-04T12:00:00.000Z",
    });
    expect(state.preview?.isStale).toBe(false);
    expect(
      (await surface.exportHistoricalPlan()).status === "exported" &&
        ((await surface.exportHistoricalPlan()) as { batches: unknown[] }).batches,
    ).toHaveLength(0);
    const reviewScope = createReviewScope({
      kind: "day",
      anchorUserDayDate: "2026-05-04",
      weekStartsOn: "monday",
    });
    const review = await store.queryPlanningReview({
      reviewScope,
      historyAsOf: "2026-05-04T13:00:00.000Z",
    });
    const command = {
      publicationRange: publicationRangeFromReviewScope(reviewScope),
      expectedSourceFingerprint: review.sourceFingerprint,
      publishedAt: "2026-05-04T13:00:00.000Z",
    };
    expect(await store.publishScheduleRange(command)).toMatchObject({ status: "published" });
    expect(await store.publishScheduleRange(command)).toEqual({ status: "alreadyPublished" });
    expect(
      await store.publishScheduleRange({ ...command, expectedSourceFingerprint: "old-review" }),
    ).toEqual({ status: "rejected", reason: "sourceChanged" });
    expect(
      await store.publishScheduleRange({
        ...command,
        publishedAt: "2026-05-04T14:00:00.000Z",
      }),
    ).toEqual({ status: "alreadyPublished" });
    const exported = await surface.exportHistoricalPlan();
    expect(exported.status === "exported" && exported.batches).toHaveLength(1);
    surface.close();
  });
  it("starts with an empty ready ledger and explicit query gap", async () => {
    const { surface } = setup();
    await surface.initialize();
    expect(surface.getStatus()).toEqual({ status: "ready", pendingCount: 0 });
    expect(await surface.getHistoricalPlanDay("2026-08-20", "2026-08-20T00:00:00.000Z")).toEqual({
      status: "unavailableNoPublication",
      userDayDate: "2026-08-20",
    });
    surface.close();
  });
  it("atomically persists, verifies, queries, exports, and restarts", async () => {
    const factory = new IDBFactory();
    const name = `historical-plan-${database++}`;
    const firstStorage = createDayFrameDurableDb({ indexedDB: factory, name });
    const first = createHistoricalPlanSurface({ storage: firstStorage });
    await first.initialize();
    expect((await first.publish(batch())).status).toBe("publishedAndDurable");
    expect(
      await first.getHistoricalPlanDay("2026-08-20", "2026-08-20T00:00:00.000Z"),
    ).toMatchObject({
      status: "available",
      durability: "durable",
      day: { occurrences: [{ title: "Shift" }] },
    });
    expect(await first.exportHistoricalPlan()).toMatchObject({
      status: "exported",
      batches: [{ id: batch().id }],
    });
    first.close();
    const restarted = createHistoricalPlanSurface({
      storage: createDayFrameDurableDb({ indexedDB: factory, name }),
    });
    await restarted.initialize();
    expect(
      await restarted.getHistoricalPlanDay("2026-08-20", "2026-08-20T00:00:00.000Z"),
    ).toMatchObject({ status: "available" });
    restarted.close();
  });
  it("keeps explicit atomic publication out of runtime and history when persistence fails", async () => {
    const { storage } = setup();
    const surface = createHistoricalPlanSurface({
      storage: {
        ...storage,
        mutate: async () => ({
          status: "failure" as const,
          error: { code: "writeFailed" as const, operation: "testAtomicPublication" },
        }),
      },
    });
    await surface.initialize();
    expect((await surface.publishAtomically(batch())).status).toBe("materializationUnavailable");
    expect(surface.getPendingPublications()).toEqual([]);
    expect(await surface.getHistoricalPlanDay("2026-08-20", "2026-08-21T00:00:00.000Z")).toEqual({
      status: "unavailableNoPublication",
      userDayDate: "2026-08-20",
    });
    surface.close();
  });
  it("preserves mixed V1/V2 timing provenance through IndexedDB restart and export", async () => {
    const factory = new IDBFactory();
    const name = `historical-plan-${database++}`;
    const first = createHistoricalPlanSurface({
      storage: createDayFrameDurableDb({ indexedDB: factory, name }),
    });
    await first.initialize();
    await first.publish(batch());
    await first.publish(
      v2Batch("22222222-2222-4222-8222-222222222222", "2026-08-19T13:00:00.000Z", "allDay"),
    );
    first.close();
    const restarted = createHistoricalPlanSurface({
      storage: createDayFrameDurableDb({ indexedDB: factory, name }),
    });
    await restarted.initialize();
    const legacy = await restarted.getHistoricalPlanDay("2026-08-20", "2026-08-19T12:30:00.000Z");
    const current = await restarted.getHistoricalPlanDay("2026-08-20", "2026-08-19T13:30:00.000Z");
    expect(legacy.status === "available" && legacy.day.occurrences[0]).toMatchObject({
      version: 1,
    });
    expect(current.status === "available" && current.day.occurrences[0]).toMatchObject({
      version: 2,
      timing: { kind: "allDay" },
    });
    const exported = await restarted.exportHistoricalPlan();
    expect(
      exported.status === "exported" &&
        exported.batches.map((item) => item.days[0]!.occurrences[0]),
    ).toEqual([
      expect.objectContaining({ version: 1 }),
      expect.objectContaining({ version: 2, timing: { kind: "allDay" } }),
    ]);
    restarted.close();
  });
  it("deduplicates identical authority and appends meaningful removal", async () => {
    const { surface } = setup();
    await surface.initialize();
    await surface.publish(batch());
    expect(
      await surface.publish(
        batch("22222222-2222-4222-8222-222222222222", "2026-08-19T13:00:00.000Z"),
      ),
    ).toEqual({ status: "identicalNoOp" });
    expect(
      (
        await surface.publish(
          batch("22222222-2222-4222-8222-222222222222", "2026-08-19T13:00:00.000Z", true),
        )
      ).status,
    ).toBe("publishedAndDurable");
    expect(
      await surface.getHistoricalPlanDay("2026-08-20", "2026-08-19T12:30:00.000Z"),
    ).toMatchObject({ status: "available", day: { occurrences: [{}] } });
    expect(
      await surface.getHistoricalPlanDay("2026-08-20", "2026-08-19T14:00:00.000Z"),
    ).toMatchObject({ status: "available", day: { occurrences: [] } });
    surface.close();
  });
  it("retains failed writes as ordered pending session authority and retries exact IDs/time", async () => {
    const real = createDayFrameDurableDb({
      indexedDB: new IDBFactory(),
      name: `historical-plan-${database++}`,
    });
    let fail = true;
    const storage = {
      ...real,
      mutate: async (mutations: Parameters<typeof real.mutate>[0]) =>
        fail
          ? {
              status: "failure" as const,
              error: { code: "quotaExceeded" as const, operation: "mutate" },
            }
          : real.mutate(mutations),
    };
    const surface = createHistoricalPlanSurface({ storage });
    await surface.initialize();
    const value = batch();
    expect(await surface.publish(value)).toMatchObject({
      status: "publishedPendingDurability",
      error: { code: "quotaExceeded" },
    });
    expect(
      await surface.getHistoricalPlanDay("2026-08-20", "2026-08-20T00:00:00.000Z"),
    ).toMatchObject({ status: "available", durability: "pending", batchId: value.id });
    fail = false;
    expect(await surface.retryPendingPublications()).toEqual({
      status: "durable",
      pendingCount: 0,
    });
    expect(
      await surface.getHistoricalPlanDay("2026-08-20", "2026-08-20T00:00:00.000Z"),
    ).toMatchObject({ status: "available", durability: "durable", batchId: value.id });
    surface.close();
  });
  it("preserves multiple failed revisions and stops ordered retry at the first failure", async () => {
    const real = createDayFrameDurableDb({
      indexedDB: new IDBFactory(),
      name: `historical-plan-${database++}`,
    });
    let failures = 2;
    const storage = {
      ...real,
      mutate: async (mutations: Parameters<typeof real.mutate>[0]) =>
        failures-- > 0
          ? {
              status: "failure" as const,
              error: { code: "writeFailed" as const, operation: "mutate" },
            }
          : real.mutate(mutations),
    };
    const surface = createHistoricalPlanSurface({ storage });
    await surface.initialize();
    await surface.publish(batch());
    await surface.publish(
      batch("22222222-2222-4222-8222-222222222222", "2026-08-19T13:00:00.000Z", true),
    );
    expect(surface.getPendingPublications().map((value) => value.id)).toEqual([
      "11111111-1111-4111-8111-111111111111",
      "22222222-2222-4222-8222-222222222222",
    ]);
    expect(await surface.retryPendingPublications()).toEqual({
      status: "durable",
      pendingCount: 0,
    });
    surface.close();
  });
  it("treats an uncertain prior commit as idempotently durable", async () => {
    const { storage, surface } = setup();
    await surface.initialize();
    const value = batch();
    await surface.publish(value);
    const second = createHistoricalPlanSurface({ storage });
    await second.initialize();
    expect(await second.publish(value)).toEqual({ status: "identicalNoOp" });
    second.close();
  });
  it("protects corrupt latest authority instead of falling back", async () => {
    const { storage, surface } = setup();
    await surface.initialize();
    await surface.publish(batch());
    const records = await storage.getAll<Record<string, unknown>>(HISTORICAL_PLAN_DAY_STORE);
    if (records.status !== "success") throw new Error("fixture");
    const corrupt = structuredClone(records.value[0]!);
    (corrupt.dayPublication as { occurrences: unknown[] }).occurrences = [{ invalid: true }];
    await storage.put(HISTORICAL_PLAN_DAY_STORE, corrupt); // preserve wrapper fingerprint to force mismatch
    expect(
      await surface.getHistoricalPlanDay("2026-08-20", "2026-08-20T00:00:00.000Z"),
    ).toMatchObject({ status: "unavailableProtected" });
    expect(surface.getStatus()).toMatchObject({ status: "protected" });
    surface.close();
  });
  it("detects orphan day records and protects the surface", async () => {
    const { storage, surface } = setup();
    await surface.initialize();
    await surface.publish(batch());
    const records = await storage.getAll<Record<string, unknown>>(HISTORICAL_PLAN_DAY_STORE);
    if (records.status !== "success") throw new Error("fixture");
    const orphan = { ...records.value[0], batchId: "99999999-9999-4999-8999-999999999999" };
    await storage.put(HISTORICAL_PLAN_DAY_STORE, orphan);
    expect(
      await surface.getHistoricalPlanDay("2026-08-20", "2026-08-20T00:00:00.000Z"),
    ).toMatchObject({ status: "unavailableProtected" });
    surface.close();
  });
  it("source-rechecks protected evidence before destructive abandonment", async () => {
    const { storage, surface } = setup();
    await surface.initialize();
    await surface.publish(batch());
    const records = await storage.getAll<Record<string, unknown>>(HISTORICAL_PLAN_DAY_STORE);
    if (records.status !== "success") throw new Error("fixture");
    const corrupt = structuredClone(records.value[0]!);
    (corrupt.dayPublication as { occurrences: unknown[] }).occurrences = [];
    await storage.put(HISTORICAL_PLAN_DAY_STORE, corrupt);
    await surface.getHistoricalPlanDay("2026-08-20", "2026-08-20T00:00:00.000Z");
    expect(await surface.recheckProtectedSource()).toBe("unchanged");
    await storage.clear(HISTORICAL_PLAN_DAY_STORE);
    expect(await surface.abandonProtectedHistoricalPlan()).toEqual({ status: "sourceChanged" });
    surface.close();
  });
  it("clears both stores and runtime authority only after durable success", async () => {
    const { storage, surface } = setup();
    await surface.initialize();
    await surface.publish(batch());
    expect((await surface.clearHistoricalPlan()).status).toBe("success");
    expect(await storage.getAll(HISTORICAL_PLAN_BATCH_STORE)).toEqual({
      status: "success",
      value: [],
    });
    expect(await storage.getAll(HISTORICAL_PLAN_DAY_STORE)).toEqual({
      status: "success",
      value: [],
    });
    surface.close();
  });
  it("emits bounded status and history events rather than whole-ledger snapshots", async () => {
    const { surface } = setup();
    await surface.initialize();
    const statuses: string[] = [];
    const events: string[] = [];
    surface.subscribeStatus((value) => statuses.push(value.status));
    surface.subscribeHistory((event) => events.push(event.type));
    await surface.publish(batch());
    expect(statuses).toEqual(["pending", "ready"]);
    expect(events).toEqual(["publicationAccepted"]);
    surface.close();
  });
});
