import { describe, expect, it } from "vitest";
import type { HistoricalPlanDayReadResult } from "./historicalPlanSurface.js";
import { createTodayQuery } from "./todayQuery.js";
import { createInitialDayFrameState } from "./createInitialDayFrameState.js";
import { resolveUserDayContainingInstant } from "../core/time/canonicalUserDay.js";
import { buildExecutionHistoryItems } from "../core/execution/executionHistoryProjection.js";
import { historicalOccurrenceTimingSemantics } from "../core/historicalPlan/historicalPlan.js";
import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";

const emptyPlan: HistoricalPlanDayReadResult = {
  status: "available",
  day: {
    version: 1,
    userDayDate: "2026-08-24",
    dayBoundaryStartTime: "03:00",
    weekStartsOn: "monday",
    utcOffsetMinutes: -300,
    occurrences: [],
  },
  batchId: "11111111-1111-4111-8111-111111111111",
  publishedAt: "2026-08-24T12:00:00.000Z",
  durability: "durable",
};
function setup(
  plan: HistoricalPlanDayReadResult = emptyPlan,
  execution: "available" | "protected" | "unavailable" = "available",
) {
  const calls: Array<[string, string]> = [];
  const state = createInitialDayFrameState();
  state.schedulingPreferences = { dayBoundaryStartTime: "03:00", weekStartsOn: "monday" };
  const query = createTodayQuery({
    getAuthoredSetup: () => state,
    historicalPlan: {
      getHistoricalPlanDay: async (date, asOf) => {
        calls.push([date, asOf]);
        return structuredClone(plan);
      },
    },
    executionHistory: {
      getExecutionHistory: () => [],
      getExecutionHistoryIngressStatus: () =>
        execution === "protected"
          ? { status: "recoveryRequired", reason: "invalidEnvelope", sourcePreserved: true }
          : { status: "accepted", quarantinedComponentCount: 0 },
      getExecutionHistoryMigrationStatus: () =>
        execution === "unavailable"
          ? "unavailable"
          : execution === "protected"
            ? "protected"
            : "readyIndexedDb",
    },
    resolveUserDayContainingInstant,
    buildExecutionHistoryItems,
    historicalOccurrenceTimingSemantics,
  });
  return { query, calls };
}

describe("Today application query", () => {
  it("is exposed through the canonical DayFrame store boundary", async () => {
    const store = createReadyDayFrameTestStore();
    expect(await store.queryToday({ evaluationAsOf: "invalid" })).toEqual({
      status: "invalidQuery",
      reason: "invalidEvaluationAsOf",
    });
  });

  it("rejects malformed evaluation instants without consulting authority", async () => {
    const { query, calls } = setup();
    expect(await query({ evaluationAsOf: "today" })).toEqual({
      status: "invalidQuery",
      reason: "invalidEvaluationAsOf",
    });
    expect(calls).toEqual([]);
  });

  it("derives the canonical containing user-day and uses one instant for both cutoffs", async () => {
    const { query, calls } = setup();
    const result = await query({ evaluationAsOf: "2026-08-24T07:30:00.000Z" });
    expect(calls).toEqual([["2026-08-23", "2026-08-24T07:30:00.000Z"]]);
    expect(result).toMatchObject({
      status: "available",
      evaluationAsOf: "2026-08-24T07:30:00.000Z",
      userDay: { date: "2026-08-23" },
    });
  });

  it("distinguishes missing, protected, and storage-unavailable plans", async () => {
    expect(
      await setup({ status: "unavailableNoPublication", userDayDate: "2026-08-24" }).query({
        evaluationAsOf: "2026-08-24T15:00:00.000Z",
      }),
    ).toMatchObject({ status: "planUnavailable", reason: "noPublication" });
    expect(
      await setup({ status: "unavailableProtected", reason: "physicalMismatch" }).query({
        evaluationAsOf: "2026-08-24T15:00:00.000Z",
      }),
    ).toMatchObject({ status: "historicalPlanProtected", reason: "physicalMismatch" });
    expect(
      await setup({
        status: "unavailable",
        error: { code: "unavailable", operation: "query" },
      }).query({ evaluationAsOf: "2026-08-24T15:00:00.000Z" }),
    ).toMatchObject({ status: "planUnavailable", reason: "storageUnavailable" });
  });

  it("keeps plan available while execution is independently protected or unavailable", async () => {
    expect(
      await setup(emptyPlan, "protected").query({ evaluationAsOf: "2026-08-24T15:00:00.000Z" }),
    ).toMatchObject({ status: "available", executionCoverage: "unavailableProtected" });
    expect(
      await setup(emptyPlan, "unavailable").query({ evaluationAsOf: "2026-08-24T15:00:00.000Z" }),
    ).toMatchObject({ status: "available", executionCoverage: "unavailable" });
  });
});
