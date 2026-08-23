import type { DayFrameReadiness, DayFrameReadyResult } from "../dayFrameReadiness.js";
import { createDayFrameStore } from "../dayFrameStore.js";
import type { DayFrameStore, DayFrameStoreInitialState } from "../types.js";
import { IDBFactory } from "fake-indexeddb";

/** Explicit fixture for tests whose subject is unrelated to bootstrap timing. */
export function createReadyDayFrameTestStore(
  initialState?: DayFrameStoreInitialState,
  options?: Parameters<typeof createDayFrameStore>[1],
): DayFrameStore {
  if (!options?.historicalPlanSurface) Object.defineProperty(globalThis, "indexedDB",
    { configurable: true, value: new IDBFactory() });
  const store = createDayFrameStore(initialState, { ...options, bootstrapMode: "resolved-test" });
  if (store.getReadiness().status !== "ready") {
    throw new Error("The resolved-ready fixture requires ready participants.");
  }
  return store;
}

export async function waitForDayFrameStoreReady(
  store: Pick<DayFrameStore, "whenReady">,
): Promise<DayFrameReadyResult> {
  return store.whenReady();
}

export function createControllableReadinessStore(base: DayFrameStore,
  initial: DayFrameReadiness = { status: "initializing" }) {
  let readiness = structuredClone(initial);
  const listeners = new Set<(value: DayFrameReadiness) => void>();
  let settle: ((value: DayFrameReadyResult) => void) | undefined;
  const initialTerminal = terminal(readiness);
  let readyPromise: Promise<DayFrameReadyResult> = initialTerminal
    ? Promise.resolve(initialTerminal)
    : new Promise<DayFrameReadyResult>((resolve) => { settle = resolve; });
  const store: DayFrameStore = {
    ...base,
    getReadiness: () => structuredClone(readiness),
    subscribeReadiness: (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    whenReady: () => readyPromise,
  };
  return {
    store,
    transition(next: DayFrameReadiness) {
      if (JSON.stringify(next) === JSON.stringify(readiness)) return;
      readiness = structuredClone(next);
      for (const listener of listeners) listener(structuredClone(readiness));
      const result = terminal(readiness);
      if (result) { settle?.(result); settle = undefined; readyPromise = Promise.resolve(result); }
    },
  };
}

function terminal(value: DayFrameReadiness): DayFrameReadyResult | undefined {
  return value.status === "ready" ? { status: "ready" }
    : value.status === "protected" ? { status: "protected", reason: value.reason } : undefined;
}
