import { describe, expect, it } from "vitest";

import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";
import {
  getInitialMonthlyPlannerView,
  queryMonthlyPlannerFromState,
} from "./monthlyPlannerQuery.js";

describe("monthlyPlannerQuery adapter", () => {
  it("derives the initial Month and selection from the canonical current user-day", () => {
    const state = createReadyDayFrameTestStore({
      schedulingPreferences: { dayBoundaryStartTime: "04:00", weekStartsOn: "monday" },
    }).getState();
    expect(getInitialMonthlyPlannerView(state, new Date(2026, 7, 1, 2))).toEqual({
      displayedMonth: "2026-07",
      selectedLabel: "2026-07-31",
    });
  });

  it("adapts current Active/Preview inputs and explicit readiness without writes", () => {
    const store = createReadyDayFrameTestStore();
    const state = store.getState();
    const base = {
      state,
      evaluationInstant: new Date(2026, 7, 10, 12),
      displayedMonth: "2026-08" as const,
      selectedLabel: "2026-08-10" as const,
    };
    expect(queryMonthlyPlannerFromState({ ...base, readiness: { status: "ready" } }).kind).toBe(
      "available",
    );
    expect(
      queryMonthlyPlannerFromState({
        ...base,
        readiness: { status: "protected", reason: "authorityRecoveryRequired" },
      }).kind,
    ).toBe("protected");
    expect(
      queryMonthlyPlannerFromState({ ...base, readiness: { status: "initializing" } }).kind,
    ).toBe("unavailable");
    expect(store.getState()).toEqual(state);
  });
});
