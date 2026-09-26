import { beforeEach, afterEach, expect, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import type { DayFrameStore } from "./types.js";
import type { SleepRequirementIntentV1 } from "../core/sleep/sleepRequirement.js";
// Canonical disposable fixture derived from the retained 9.29.3 diagnostic.
// Supporting setup derives a real allocation and Proposal from saved Goal/Demand/Sleep.
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
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-16T12:00:00.000Z"));
});
export const range = {
  startUserDayDate: "2026-09-17",
  endUserDayDateExclusive: "2026-09-18",
} as const;
export const at = "2026-09-16T12:00:00.000Z";
export function author(store: DayFrameStore, patch: Partial<SleepRequirementIntentV1> = {}) {
  const head = store.getState().sleepRequirements?.at(-1);
  const result = store.authorSleepRequirement({
    id: "sleep",
    expectedRevision: head?.revision ?? null,
    ...(head ? { expectedIncarnationId: head.incarnationId } : {}),
    recordedAt: at,
    intent: {
      enabled: true,
      effectiveFrom: "2026-09-01",
      weekdays: "all",
      durationMinutes: 120,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      window: { kind: "clock", startClock: "00:00", endClock: "02:00" },
      ...patch,
    },
  });
  expect(result.status).toBe("authored");
  return result;
}
async function start(options: Parameters<typeof createDayFrameStore>[1] = {}) {
  const durable = options.restoreIndexedDb ?? createDayFrameDurableDb();
  const store = createDayFrameStore(undefined, { ...options, restoreIndexedDb: durable });
  await store.whenReady();
  store.setSchedulingPreferences({
    dayBoundaryStartTime: "00:00",
    weekStartsOn: "monday",
  });
  author(store);
  const goal = await store.createGoal({ title: "Study" });
  if (goal.status !== "accepted") throw new Error("goal");
  const demand = await store.createDemand({
    goalId: goal.goal.id,
    requestedEffort: { unit: "minutes", amount: 60 },
    horizon: { kind: "userDayInterval", ...range },
    session: { mode: "indivisible", exactMinutes: 60 },
    satisfaction: { kind: "minimum", allowPartial: false },
    cadence: { kind: "total" },
  });
  if (demand.status !== "accepted") throw new Error("demand");
  await store.setDemandResourceFootprintAssociation({
    demandId: demand.value.id,
    selection: { kind: "productiveOnly" },
  });
  return { store, durable, demandId: demand.value.id };
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
export function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
export async function prepared(
  multiRole = false,
  options: Parameters<typeof createDayFrameStore>[1] = {},
) {
  const f = await start(options);
  if (multiRole) {
    const spec = await f.store.createDemandResourceFootprintSpec({
      name: "Required full footprint",
      variants: [
        {
          id: "study",
          name: "Study",
          components: [
            {
              id: "notes",
              role: "supportActivity",
              scope: "perSession",
              requiredness: "required",
              durationMinutes: 30,
              geometry: { kind: "startsAtProductiveEnd" },
              actor: "user",
              source: { kind: "direct" },
            },
            {
              id: "buffer",
              role: "bufferProtection",
              scope: "perSession",
              requiredness: "required",
              durationMinutes: 15,
              target: { kind: "supportComponent", componentId: "notes" },
              side: "after",
              source: { kind: "direct" },
            },
          ],
        },
      ],
    });
    if (spec.status !== "accepted") throw Error(JSON.stringify(spec));
    expect(
      (
        await f.store.setDemandResourceFootprintAssociation({
          demandId: f.demandId,
          expectedRevision: 1,
          selection: {
            kind: "specification",
            specificationId: spec.value.id,
            specificationRevision: spec.value.revision,
            variantId: "study",
            selectedOptionalComponentIds: [],
          },
        })
      ).status,
    ).toBe("accepted");
  }
  const evaluated = await f.store.evaluateCompetingAllocation({
    ...range,
    evaluationCutoff: at,
  });
  if (evaluated.status !== "evaluated") throw Error(JSON.stringify(evaluated));
  const generated = await f.store.deriveProposal({
    allocation: evaluated.allocation.allocations[0]!,
    horizon: range,
    allocationHorizon: range,
    generatedAt: at,
    evaluationCutoff: at,
  });
  if (generated.status !== "proposed") throw Error(JSON.stringify(generated));
  expect((await f.store.recordProposal(generated)).status).toBe("accepted");
  return {
    ...f,
    input: {
      proposalId: generated.proposal.id,
      proposalRevision: generated.proposal.revision,
      optionId: generated.proposal.preferredOptionId,
    },
  };
}
