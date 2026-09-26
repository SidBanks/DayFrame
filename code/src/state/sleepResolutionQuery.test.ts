import { beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore } from "./dayFrameStore.js";
import { requirement } from "../core/sleep/sleepTestFixtures.js";
import { materializePlanPublication } from "../core/historicalPlan/materializePlanPublication.js";

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
let storage: MemoryStorage;
beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("indexedDB", new IDBFactory());
});
it("store Sleep query is disposable, non-persisting and qualifies downstream planning without creating historical authority", async () => {
  const store = createDayFrameStore();
  await store.whenReady();
  const at = "2099-09-01T00:00:00.000Z";
  store.setShiftDefinitions([
    {
      id: "day",
      userId: "u",
      name: "Day",
      startTime: "09:00",
      endTime: "17:00",
      crossesMidnight: false,
      workDays: ["thursday", "friday"],
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
      endsOnDate: "2026-09-30",
      segments: [
        {
          id: "segment",
          shiftCycleId: "cycle",
          shiftDefinitionId: "day",
          startsOnDate: "2026-09-01",
          endsOnDate: "2026-09-30",
        },
      ],
      createdAt: at,
      updatedAt: at,
    },
  ]);
  const previewInput = {
    rangeStartDate: "2026-09-17" as const,
    rangeEndDate: "2026-09-18" as const,
    planningWindowStart: new Date("2026-09-17T03:00:00"),
    planningWindowEnd: new Date("2026-09-19T03:00:00"),
    generatedAt: at,
  };
  store.generatePreview(previewInput);
  const ownerRange = {
    startUserDayDate: "2026-09-17" as const,
    endUserDayDateExclusive: "2026-09-19" as const,
  };
  const goal = await store.createGoal({ title: "Study" });
  if (goal.status !== "accepted") throw new Error("goal");
  const demand = await store.createDemand({
    goalId: goal.goal.id,
    requestedEffort: { unit: "minutes", amount: 60 },
    horizon: { kind: "userDayInterval", ...ownerRange },
    session: { mode: "indivisible", exactMinutes: 60 },
    satisfaction: { kind: "minimum", allowPartial: false },
    cadence: { kind: "total" },
  });
  if (demand.status !== "accepted") throw new Error("demand");
  expect(
    (
      await store.setDemandResourceFootprintAssociation({
        demandId: demand.value.id,
        selection: { kind: "productiveOnly" },
      })
    ).status,
  ).toBe("accepted");
  const beforeCapacity = await store.queryCapacity(ownerRange);
  if (beforeCapacity.status !== "derived") throw new Error("capacity");
  const beforeFeasibility = await store.evaluateGoalDemandFeasibility({
    demandId: demand.value.id,
    capacity: beforeCapacity.capacity,
  });
  await store.createPriority({
    goalId: goal.goal.id,
    level: "critical",
    scope: { kind: "default" },
  });
  const allocationQuery = { ...ownerRange, evaluationCutoff: at };
  const beforeAllocation = await store.evaluateCompetingAllocation(allocationQuery);
  expect(beforeAllocation.status).toBe("evaluated");
  const proposals = async () => {
    const evaluated = await store.evaluateCompetingAllocation(allocationQuery);
    if (evaluated.status !== "evaluated") throw new Error("allocation");
    return Promise.all(
      evaluated.allocation.allocations.map((allocation) =>
        store.deriveProposal({
          allocation,
          horizon: ownerRange,
          allocationHorizon: ownerRange,
          generatedAt: at,
          evaluationCutoff: at,
        }),
      ),
    );
  };
  const beforeProposals = await proposals();
  expect(beforeProposals.length, JSON.stringify(beforeAllocation)).toBeGreaterThan(0);
  const beforeToday = await store.queryToday({ evaluationAsOf: at });
  const beforePreview = store.getState().preview;
  const providers = {
    now: () => at,
    allocateBatchId: () => "11111111-1111-4111-8111-111111111111" as never,
  };
  const beforePublication = materializePlanPublication({
    authoredSetup: store.getState(),
    preview: beforePreview,
    providers,
  });
  const r = requirement();
  const authored = store.authorSleepRequirement({
    id: r.id,
    expectedRevision: null,
    intent: {
      enabled: true,
      effectiveFrom: r.effectiveFrom,
      weekdays: r.weekdays,
      durationMinutes: r.durationMinutes,
      window: r.window,
      bufferBeforeMinutes: r.bufferBeforeMinutes,
      bufferAfterMinutes: r.bufferAfterMinutes,
    },
    recordedAt: at,
  });
  expect(authored.status).toBe("authored");
  const backup = await store.exportBackupV13(at);
  expect(backup.status).toBe("exported");
  const state = store.getState(),
    raw = [...storage.values];
  const writes = vi.spyOn(storage, "setItem");
  const solution = await store.resolveRequiredSleep({ ownerRange });
  expect(solution.status).toBe("satisfied");
  expect(await store.resolveRequiredSleep({ ownerRange })).toEqual(solution);
  expect(store.getState()).toEqual(state);
  expect(writes).not.toHaveBeenCalled();
  expect([...storage.values]).toEqual(raw);
  expect(await store.exportBackupV13(at)).toEqual(backup);
  store.generatePreview(previewInput);
  expect(store.getState().preview!.result.foundation?.sleep.status).toBe("satisfied");
  expect(store.getState().preview!.result.generatedWorkBlocks).toEqual(
    beforePreview!.result.generatedWorkBlocks,
  );
  expect(await store.queryCapacity(ownerRange)).not.toEqual(beforeCapacity);
  expect(await store.evaluateCompetingAllocation(allocationQuery)).not.toEqual(beforeAllocation);
  expect(await proposals()).not.toEqual(beforeProposals);
  expect(await store.queryToday({ evaluationAsOf: at })).toEqual(beforeToday);
  expect(
    await store.evaluateGoalDemandFeasibility({
      demandId: demand.value.id,
      capacity: beforeCapacity.capacity,
    }),
  ).not.toEqual(beforeFeasibility);
  expect(
    materializePlanPublication({
      authoredSetup: store.getState(),
      preview: store.getState().preview,
      providers,
    }),
  ).toMatchObject({
    status: "inconsistentPlanContext",
    detail: "Current Sleep authority is required",
  });
  expect(beforePublication.status).toBe("materialized");
});
it("store reports protected Sleep authority instead of feasible neutral fallback", async () => {
  storage.setItem(
    "dayframe-active-v2",
    JSON.stringify({ app: "DayFrame", surface: "active", version: 999 }),
  );
  const store = createDayFrameStore();
  await store.whenReady();
  expect(
    (
      await store.resolveRequiredSleep({
        ownerRange: { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-18" },
      })
    ).status,
  ).toBe("protected");
});
