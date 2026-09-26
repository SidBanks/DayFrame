import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY as capability } from "./dayFrameRuntimeAuthority.js";
import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it, vi } from "vitest";
import {
  HISTORICAL_PLAN_DAY_PUBLICATION_VERSION,
  HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION,
  HISTORICAL_PLAN_SURFACE_VERSION,
  PLAN_PUBLICATION_BATCH_VERSION,
  type PlanPublicationBatchV1,
} from "../core/historicalPlan/historicalPlan.js";
import type { DurableOccurrenceReference } from "../core/occurrences/durableOccurrenceReference.js";
import {
  createDayFrameDurableDb,
  HISTORICAL_PLAN_BATCH_STORE,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";

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

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
function fixture() {
  const db = createDayFrameDurableDb({
    indexedDB: new IDBFactory(),
    name: `lifecycle-${database++}`,
  });
  const owner = createHistoricalPlanSurface({ storage: db });
  return { db, owner };
}

describe("publication lifecycle and supported queue", () => {
  it("healthy B submitted after A's native transaction starts queues and deduplicates durably", async () => {
    const { db, owner } = fixture();
    await owner.initialize();
    const mutate = db.mutate;
    let attempts = 0;
    let transactions = 0;
    let second: ReturnType<typeof owner.publishAtomically> | undefined;
    vi.spyOn(db, "mutate").mockImplementation((rows, admit, observe) => {
      attempts++;
      return mutate(rows, admit, (receipt) => {
        transactions++;
        observe?.(receipt);
        expect(owner.isHistoricalPlanQuiescent()).toBe(false);
        second = owner.publishAtomically(batch());
      });
    });
    const first = await owner.publishAtomically(batch());
    expect(first.status).toBe("publishedAndDurable");
    expect(second).toBeDefined();
    expect((await second)?.status).toBe("identicalNoOp");
    expect(attempts).toBe(1);
    expect(transactions).toBe(1);
    expect(first.receipt?.isCurrent()).toBe(true);
    expect(owner.isHistoricalPlanQuiescent()).toBe(true);
  });

  it("waiting B has no lease and rejects before dedup after A settles and clear begins", async () => {
    const { db, owner } = fixture();
    await owner.initialize();
    const entered = deferred();
    const release = deferred();
    const mutate = db.mutate;
    vi.spyOn(db, "mutate").mockImplementation(async (...args) => {
      if (args[0].some((row) => row.type === "put")) {
        entered.resolve();
        await release.promise;
      }
      return mutate(...args);
    });
    const first = owner.publishAtomically(batch());
    await entered.promise;
    const second = owner.publishAtomically(batch());
    release.resolve();
    expect((await first).status).toBe("publishedAndDurable");
    const clear = owner.clearHistoricalPlan();
    expect(await second).toMatchObject({ status: "rejected", reason: "contextReplaced" });
    expect((await clear).status).toBe("success");
    expect(await owner.exportHistoricalPlan()).toMatchObject({ batches: [] });
  });

  it("known atomic abort adds no overlay; legacy pending duplicate is not durable and exact retry preserves identity", async () => {
    const { db, owner } = fixture();
    await owner.initialize();
    const mutate = db.mutate;
    const failing = vi.spyOn(db, "mutate").mockImplementation((rows, admit, observe) =>
      mutate(
        [
          ...rows,
          {
            type: "put",
            store: HISTORICAL_PLAN_BATCH_STORE,
            value: { batchId: "bad", uncloneable: () => {} },
          },
        ],
        admit,
        observe,
      ),
    );
    expect((await owner.publishAtomically(batch())).status).toBe("writeFailedBeforeCommit");
    expect(owner.getPendingPublications()).toEqual([]);
    expect((await owner.publish(batch())).status).toBe("publishedPendingDurability");
    expect(owner.getPendingPublications()).toEqual([batch()]);
    const calls = failing.mock.calls.length;
    expect(await owner.publishAtomically(batch())).toMatchObject({
      status: "identicalPending",
      batchIds: [batch().id],
    });
    expect(failing).toHaveBeenCalledTimes(calls);
    failing.mockRestore();
    expect((await owner.retryPendingPublications()).status).toBe("durable");
    expect(await owner.exportHistoricalPlan()).toMatchObject({ batches: [batch()] });
    expect(owner.getPendingPublications()).toEqual([]);
  });

  it("throw before delegation closes physical admission and keeps protected settled outcome", async () => {
    const { db, owner } = fixture();
    await owner.initialize();
    const mutate = db.mutate;
    const release = deferred();
    let delayed: ReturnType<typeof mutate> | undefined;
    let transactions = 0;
    vi.spyOn(db, "mutate").mockImplementation((rows, admit, observe) => {
      delayed = release.promise.then(() =>
        mutate(rows, admit, (receipt) => {
          transactions++;
          observe?.(receipt);
        }),
      );
      throw Error("lost wrapper before native start");
    });
    expect((await owner.publishAtomically(batch())).status).toBe("commitStateUncertain");
    expect(owner.isHistoricalPlanQuiescent()).toBe(true);
    expect(owner.isHistoricalPlanProtected()).toBe(true);
    release.resolve();
    expect(await delayed).toMatchObject({ status: "failure", error: { code: "admissionDenied" } });
    expect(transactions).toBe(0);
    expect(await db.getAll(HISTORICAL_PLAN_BATCH_STORE)).toMatchObject({ value: [] });
  });

  it("outward throw after native start retains fence through delayed terminal observation and releases to protected", async () => {
    const { db, owner } = fixture();
    await owner.initialize();
    const mutate = db.mutate;
    const started = deferred();
    const terminal = deferred();
    let native: ReturnType<typeof mutate> | undefined;
    vi.spyOn(db, "mutate").mockImplementation(async (rows, admit, observe) => {
      native = mutate(rows, admit, (receipt) => {
        observe?.({ terminal: terminal.promise.then(() => receipt.terminal) });
        started.resolve();
      });
      await started.promise;
      throw Error("lost outward acknowledgment");
    });
    const operation = owner.publishAtomically(batch());
    await started.promise;
    await native; // Actual transaction completed; delivery of its terminal receipt is deliberately delayed.
    expect(owner.isHistoricalPlanQuiescent()).toBe(false);
    expect((await owner.clearHistoricalPlan()).status).toBe("failure");
    terminal.resolve();
    expect((await operation).status).toBe("commitStateUncertain");
    expect(owner.isHistoricalPlanQuiescent()).toBe(true);
    expect(owner.isHistoricalPlanProtected()).toBe(true);
    expect(owner.getPendingPublications()).toEqual([]);
  });

  it("verification remains leased; acknowledged verification failure remains distinct", async () => {
    const { db, owner } = fixture();
    await owner.initialize();
    const get = db.get;
    const entered = deferred();
    const release = deferred();
    let reads = 0;
    vi.spyOn(db, "get").mockImplementation(async (...args) => {
      if (args[0] === HISTORICAL_PLAN_BATCH_STORE && ++reads === 2) {
        entered.resolve();
        await release.promise;
        return {
          status: "failure",
          error: { code: "readFailed", operation: "controlledVerification" },
        };
      }
      return get(...args);
    });
    const operation = owner.publishAtomically(batch());
    await entered.promise;
    expect((await owner.clearHistoricalPlan()).status).toBe("failure");
    expect(owner.isHistoricalPlanQuiescent()).toBe(false);
    release.resolve();
    expect((await operation).status).toBe("verificationFailedAfterCommit");
    expect(owner.isHistoricalPlanQuiescent()).toBe(true);
    expect(owner.isHistoricalPlanProtected()).toBe(true);
  });

  it("delayed initialization cannot install displaced metadata or reopen protection", async () => {
    const { db, owner } = fixture();
    const getAll = db.getAll;
    const entered = deferred();
    const release = deferred();
    vi.spyOn(db, "getAll").mockImplementationOnce(async (...args) => {
      const value = await getAll(...args);
      entered.resolve();
      await release.promise;
      return value;
    });
    const initializing = owner.initialize();
    await entered.promise;
    expect((await owner.clearHistoricalPlan()).status).toBe("success");
    release.resolve();
    await initializing;
    expect(await owner.exportHistoricalPlan()).toMatchObject({ batches: [] });
    expect(owner.getStatus()).toEqual({ status: "ready", pendingCount: 0 });
  });

  it("stale metadata read returns explicit unavailable instead of protecting replacement", async () => {
    const { db, owner } = fixture();
    await owner.publishAtomically(batch());
    const query = db.queryIndex;
    const entered = deferred();
    const release = deferred();
    vi.spyOn(db, "queryIndex").mockImplementationOnce(async (...args) => {
      const value = await query(...args);
      entered.resolve();
      await release.promise;
      return value;
    });
    const reading = owner.getHistoricalPlanDay("2026-08-20", "2026-08-21T00:00:00.000Z");
    await entered.promise;
    await owner.clearHistoricalPlan();
    release.resolve();
    expect(await reading).toMatchObject({
      status: "unavailable",
      error: { operation: "contextReplaced" },
    });
    expect(owner.getStatus()).toMatchObject({ status: "ready" });
  });
});

it("native terminal observation settles a permanently lost outward promise as uncertain", async () => {
  const { db, owner } = fixture();
  await owner.initialize();
  const mutate = db.mutate;
  vi.spyOn(db, "mutate").mockImplementation((rows, admit, observe) => {
    void mutate(rows, admit, observe);
    return new Promise(() => {}); // Controlled lost acknowledgment; native adapter still runs.
  });
  expect((await owner.publishAtomically(batch())).status).toBe("commitStateUncertain");
  expect(owner.isHistoricalPlanQuiescent()).toBe(true);
  expect(owner.isHistoricalPlanProtected()).toBe(true);
  expect(await db.getAll(HISTORICAL_PLAN_BATCH_STORE)).toMatchObject({
    status: "success",
    value: [expect.objectContaining({ batchId: batch().id })],
  });
});

it("queued old retry is discarded on replacement; abort-restored pending needs a fresh explicit retry", async () => {
  const { db, owner } = fixture();
  await owner.initialize();
  const mutation = vi.spyOn(db, "mutate").mockResolvedValue({
    status: "failure",
    error: { code: "transactionAborted", operation: "controlledAbort" },
  });
  expect((await owner.publish(batch())).status).toBe("publishedPendingDurability");
  mutation.mockRestore();
  const adapter = owner.getRuntimeAuthorityAdapter(capability);
  const saved = adapter.captureRuntimeSnapshot();
  const oldRetry = owner.retryPendingPublications();
  adapter.installRuntimeExact({
    status: { status: "ready", pendingCount: 0 },
    pending: [],
    batchMetadata: [],
  });
  adapter.installRuntimeExact(saved); // Exact abort restoration, new generation.
  expect(await oldRetry).toMatchObject({ status: "notAttempted", reason: "contextReplaced" });
  expect(owner.getPendingPublications()).toEqual([batch()]);
  expect(await db.getAll(HISTORICAL_PLAN_BATCH_STORE)).toMatchObject({ value: [] });
  expect((await owner.retryPendingPublications()).status).toBe("durable");
  expect(await owner.exportHistoricalPlan()).toMatchObject({ batches: [batch()] });
});

it("stale protection capture and deferred notification cannot replace installed evidence", async () => {
  const { db } = fixture();
  const { createDayFrameNotificationScheduler } =
    await import("./dayFrameNotificationScheduler.js");
  const scheduler = createDayFrameNotificationScheduler();
  const owner = createHistoricalPlanSurface({ storage: db, notificationScheduler: scheduler });
  await owner.publishAtomically(batch());
  const adapter = owner.getRuntimeAuthorityAdapter(capability);
  const saved = adapter.captureRuntimeSnapshot();
  const getAll = db.getAll;
  const entered = deferred();
  const release = deferred();
  vi.spyOn(db, "getAll").mockImplementationOnce(async (...args) => {
    const value = await getAll(...args);
    entered.resolve();
    await release.promise;
    return value;
  });
  const metadata = await db.get<Record<string, unknown>>(HISTORICAL_PLAN_BATCH_STORE, batch().id);
  if (metadata.status !== "success" || !metadata.value) throw Error("fixture");
  await db.put(HISTORICAL_PLAN_BATCH_STORE, { ...metadata.value, fingerprint: "corrupt" });
  expect((await owner.getHistoricalPlanDay("2026-08-20", "2026-08-21T00:00:00.000Z")).status).toBe(
    "unavailableProtected",
  );
  await entered.promise;
  const callbacks: Array<() => void> = [];
  vi.spyOn(scheduler, "notify").mockImplementation((_channel, callback) => {
    callbacks.push(callback);
  });
  scheduler.begin();
  adapter.installRuntimeExact(saved);
  adapter.installRuntimeExact({
    status: { status: "protected", reason: "physicalMismatch" },
    pending: [],
    batchMetadata: [],
    protectedEvidence: "new evidence",
  });
  const notify = vi.fn();
  owner.subscribeStatus(notify);
  release.resolve();
  await Promise.resolve();
  await Promise.resolve();
  callbacks[0]?.();
  expect(notify).not.toHaveBeenCalled();
  callbacks[1]?.();
  scheduler.commit();
  expect(adapter.captureRuntimeSnapshot()).toMatchObject({
    protectedEvidence: "new evidence",
    status: { status: "protected" },
  });
  expect(notify).toHaveBeenCalledTimes(1);
  expect(notify).toHaveBeenCalledWith({ status: "protected", reason: "physicalMismatch" });
});

it("coordinator clear rejects public/incorrect capability and unmatched epoch", async () => {
  const { owner } = fixture();
  await owner.publishAtomically(batch());
  expect((await owner.clearHistoricalPlanForCoordinator(Symbol("forged"), 0)).status).toBe(
    "failure",
  );
  expect((await owner.clearHistoricalPlanForCoordinator(capability, 0)).status).toBe("failure");
  expect(await owner.exportHistoricalPlan()).toMatchObject({ batches: [batch()] });
});

it("lease precedes asynchronous owner checks and database opening", async () => {
  const { db, owner } = fixture();
  const open = db.open;
  const entered = deferred();
  const release = deferred();
  vi.spyOn(db, "open").mockImplementationOnce(async () => {
    entered.resolve();
    await release.promise;
    return open();
  });
  const mutation = vi.spyOn(db, "mutate");
  const publication = owner.publishAtomically(batch());
  await entered.promise;
  expect(owner.isHistoricalPlanQuiescent()).toBe(false);
  expect((await owner.clearHistoricalPlan()).status).toBe("failure");
  expect(mutation).not.toHaveBeenCalled();
  release.resolve();
  expect((await publication).status).toBe("publishedAndDurable");
});

it("source validity is checked before a durable no-op as well as at physical admission", async () => {
  const { db, owner } = fixture();
  await owner.publishAtomically(batch());
  const mutation = vi.spyOn(db, "mutate");
  expect(await owner.publishAtomically(batch(), { isCurrent: () => false })).toMatchObject({
    status: "rejected",
    reason: "sourceChanged",
  });
  expect(mutation).not.toHaveBeenCalled();
});

it("settlement recording and synchronous history notifications remain inside the lease", async () => {
  const { owner } = fixture();
  const observed: boolean[] = [];
  owner.subscribeHistory(() => observed.push(owner.isHistoricalPlanQuiescent()));
  const recorded = vi.fn(() => observed.push(owner.isHistoricalPlanQuiescent()));
  expect(
    (await owner.publishAtomically(batch(), { isCurrent: () => true, recordResult: recorded }))
      .status,
  ).toBe("publishedAndDurable");
  expect(recorded).toHaveBeenCalledOnce();
  expect(observed).toEqual([false, false]);
  expect(owner.isHistoricalPlanQuiescent()).toBe(true);
});

it("successful clear discards pending data and the already queued old retry without a physical retry call", async () => {
  const { db, owner } = fixture();
  await owner.initialize();
  const failing = vi.spyOn(db, "mutate").mockResolvedValueOnce({
    status: "failure",
    error: { code: "transactionAborted", operation: "knownAbort" },
  });
  expect((await owner.publish(batch())).status).toBe("publishedPendingDurability");
  failing.mockRestore();
  const mutate = vi.spyOn(db, "mutate");
  const old = owner.retryPendingPublications();
  const clearing = owner.clearHistoricalPlan();
  expect(await old).toMatchObject({ status: "notAttempted", reason: "contextReplaced" });
  expect((await clearing).status).toBe("success");
  expect(mutate).toHaveBeenCalledTimes(1);
  expect(mutate.mock.calls[0]![0].every((row) => row.type === "clear")).toBe(true);
  expect(owner.getPendingPublications()).toEqual([]);
  expect(await owner.exportHistoricalPlan()).toMatchObject({ batches: [] });
});

it("a settlement callback exception does not poison the supported queue or release before terminal verification", async () => {
  const { owner } = fixture();
  const first = owner.publishAtomically(batch(), {
    isCurrent: () => true,
    recordResult: () => {
      throw Error("consumer failed");
    },
  });
  const second = owner.publishAtomically(batch());
  await expect(first).rejects.toThrow("consumer failed");
  expect((await second).status).toBe("identicalNoOp");
  expect(owner.isHistoricalPlanQuiescent()).toBe(true);
});
