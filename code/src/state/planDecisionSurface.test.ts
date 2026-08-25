import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PlanDecisionId } from "../core/decisions/planDecision.js";
import { createDurableOccurrenceReference } from "../core/occurrences/durableOccurrenceReference.js";
import { createManualEventOccurrenceIdentity } from "../core/occurrences/occurrenceIdentity.js";
import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";
import { DAYFRAME_PLAN_DECISIONS_STORAGE_KEY } from "./planDecisionSurface.js";

const decisionId = (n: number) =>
  `10000000-0000-4000-8000-${String(n).padStart(12, "0")}` as PlanDecisionId;
const manual = {
  id: "manual",
  title: "Event",
  userDayDate: "2026-08-20" as const,
  allDay: true,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

let storage: ReturnType<typeof createStorage>;
beforeEach(() => {
  storage = createStorage();
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
});

function storeWithManual(id = 1) {
  let next = id;
  return createReadyDayFrameTestStore(
    { manualEvents: [manual] },
    {
      allocatePlanDecisionId: () => decisionId(next++),
      planDecisionClock: () => "2026-08-20T12:00:00.000Z",
    },
  );
}

function manualTarget(store: ReturnType<typeof storeWithManual>) {
  const result = createDurableOccurrenceReference(
    createManualEventOccurrenceIdentity("manual"),
    store.getState(),
  );
  if (result.status !== "created") throw new Error("target missing");
  return result.reference;
}

describe("store-owned PlanDecision surface", () => {
  it("accepts, persists, notifies only decision subscribers, and supersedes cross-kind", () => {
    const store = storeWithManual();
    const target = manualTarget(store);
    const stateListener = vi.fn();
    const decisionListener = vi.fn();
    store.subscribe(stateListener);
    store.subscribePlanDecisions(decisionListener);
    const first = store.acceptPlanDecision({
      kind: "omitOccurrence",
      target,
      payload: {},
      provenance: { source: "user" },
    });
    expect(first.status).toBe("accepted");
    expect(first.status === "accepted" && first.persistence.status).toBe("persisted");
    expect(stateListener).not.toHaveBeenCalled();
    expect(decisionListener).toHaveBeenCalledTimes(1);
    const second = store.acceptPlanDecision({
      kind: "setOccurrencePriority",
      target,
      payload: { priority: 1 },
      provenance: { source: "suggestedFix", suggestedAction: "changePriority" },
    });
    expect(second.status).toBe("accepted");
    expect(store.getPlanDecisions()).toHaveLength(1);
    expect(store.getPlanDecisions()[0]).toMatchObject({
      id: decisionId(2),
      kind: "setOccurrencePriority",
    });
  });

  it("rejects stale targets and retains valid stale decisions on startup", () => {
    const original = storeWithManual();
    const target = manualTarget(original);
    original.acceptPlanDecision({
      kind: "omitOccurrence",
      target,
      payload: {},
      provenance: { source: "user" },
    });
    const current = createReadyDayFrameTestStore({ manualEvents: [] });
    expect(current.getPlanDecisions()).toHaveLength(1);
    expect(
      current.acceptPlanDecision({
        kind: "omitOccurrence",
        target,
        payload: {},
        provenance: { source: "user" },
      }),
    ).toEqual({ status: "rejected", reason: "targetSourceMissing" });
  });

  it("keeps runtime authority after write failure and retries the exact desired record", () => {
    const store = storeWithManual();
    const target = manualTarget(store);
    const setItem = vi.spyOn(storage, "setItem").mockImplementationOnce(() => {
      throw new Error("write");
    });
    const result = store.acceptPlanDecision({
      kind: "omitOccurrence",
      target,
      payload: {},
      provenance: { source: "user" },
    });
    expect(result.status === "accepted" && result.persistence.status).toBe("storageFailure");
    const before = store.getPlanDecisions();
    setItem.mockRestore();
    expect(store.retryPlanDecisionPersistence().status).toBe("attempted");
    expect(store.getPlanDecisions()).toEqual(before);
    vi.restoreAllMocks();
  });

  it("quarantines invalid, duplicate-ID, and duplicate-target entries deterministically", () => {
    const store = storeWithManual();
    const target = manualTarget(store);
    const valid = {
      version: 1,
      id: decisionId(1),
      kind: "omitOccurrence",
      target,
      payload: {},
      acceptedAt: "2026-08-20T12:00:00.000Z",
      provenance: { source: "user" },
    };
    storage.setItem(
      DAYFRAME_PLAN_DECISIONS_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        surface: "planDecisions",
        version: 1,
        decisions: [valid, { ...valid }, { ...valid, id: decisionId(2) }, { bad: true }],
      }),
    );
    const loaded = createReadyDayFrameTestStore();
    expect(loaded.getPlanDecisions()).toHaveLength(1);
    expect(loaded.getQuarantinedPlanDecisions().map((entry) => entry.reason)).toEqual([
      "duplicateDecisionId",
      "conflictingTarget",
      "invalidDecision",
    ]);
  });

  it("protects malformed whole-surface input and requires source-safe recovery", () => {
    storage.setItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY, "not-json");
    const store = storeWithManual();
    expect(store.getPlanDecisionIngressStatus().status).toBe("recoveryRequired");
    expect(
      store.acceptPlanDecision({
        kind: "omitOccurrence",
        target: manualTarget(store),
        payload: {},
        provenance: { source: "user" },
      }),
    ).toEqual({ status: "rejected", reason: "protectedDecisionIngress" });
    storage.setItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY, "changed");
    expect(store.replaceProtectedPlanDecisionCheckpoint()).toEqual({
      status: "notAttempted",
      reason: "sourceChanged",
    });
  });

  it("removes explicitly and integrates the decision surface into full clear", async () => {
    const store = storeWithManual();
    const target = manualTarget(store);
    const accepted = store.acceptPlanDecision({
      kind: "omitOccurrence",
      target,
      payload: {},
      provenance: { source: "user" },
    });
    if (accepted.status !== "accepted") throw new Error("accept failed");
    expect(store.removePlanDecision(accepted.decision.id).status).toBe("removed");
    expect(store.removePlanDecision(accepted.decision.id)).toEqual({
      status: "notAttempted",
      reason: "notFound",
    });
    store.acceptPlanDecision({
      kind: "omitOccurrence",
      target,
      payload: {},
      provenance: { source: "user" },
    });
    const cleared = await store.clearLocalData();
    expect(cleared.planDecisions.status).toBe("removed");
    expect(storage.getItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY)).toBeNull();
  });

  it("retains session removal after persistence failure and retries the absent decision", () => {
    const store = storeWithManual();
    const target = manualTarget(store);
    const accepted = store.acceptPlanDecision({
      kind: "omitOccurrence",
      target,
      payload: {},
      provenance: { source: "user" },
    });
    if (accepted.status !== "accepted") throw new Error("accept failed");
    const setItem = vi.spyOn(storage, "setItem").mockImplementationOnce(() => {
      throw new Error("write");
    });
    const removed = store.removePlanDecision(accepted.decision.id);
    expect(removed.status === "removed" && removed.persistence.status).toBe("storageFailure");
    expect(store.getPlanDecisions()).toEqual([]);
    setItem.mockRestore();
    expect(store.retryPlanDecisionPersistence()).toMatchObject({
      status: "attempted",
      persistence: { status: "persisted" },
    });
    expect(JSON.parse(storage.getItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY)!).decisions).toEqual([]);
  });
});

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
    clear: () => values.clear(),
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
  } satisfies Storage;
}
