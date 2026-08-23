import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { HISTORICAL_METRIC_POLICY_V1, type HistoricalCompletionDistributionQueryV1 } from
  "../core/historicalIntelligence/completionDistribution.js";
import type { PlanPublicationBatchV1 } from "../core/historicalPlan/historicalPlan.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { createHistoricalIntelligenceQuery } from "./historicalIntelligenceQuery.js";
import { createHistoricalSchedulingRealizationQuery } from "./historicalIntelligenceQuery.js";
import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";

const query: HistoricalCompletionDistributionQueryV1 = { policy: HISTORICAL_METRIC_POLICY_V1,
  startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-20",
  evaluationAsOf: "2026-08-22T00:00:00.000Z" };
const execution = { getExecutionHistory: () => [],
  getExecutionHistoryIngressStatus: () => ({ status: "accepted" as const, quarantinedComponentCount: 0 }) };
function batch(id: string, publishedAt: string, empty: boolean): PlanPublicationBatchV1 {
  return { surfaceVersion: 1, version: 1, id: id as never, publishedAt,
    range: { startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-20" }, days: [{ version: 1,
      userDayDate: "2026-08-20", dayBoundaryStartTime: "03:00", weekStartsOn: "monday",
      utcOffsetMinutes: -300, occurrences: empty ? [] : [{ version: 1, reference: { version: 1,
        sourceKind: "manualEvent", manualEvent: { id: "manual", incarnationId:
          "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" } } as never, sourceFamily: "manualEvent",
        title: "Appointment", category: "optional", plan: { state: "scheduled",
          startsAt: "2026-08-20T15:00:00.000Z", endsAt: "2026-08-20T16:00:00.000Z" } }] }] };
}

describe("Historical Intelligence application query", () => {
  it("uses the canonical HistoricalPlan evaluation cutoff for republication", async () => {
    const surface = createHistoricalPlanSurface({ storage: createDayFrameDurableDb({
      indexedDB: new IDBFactory(), name: "historical-intelligence-republication" }) });
    await surface.initialize();
    await surface.publish(batch("11111111-1111-4111-8111-111111111111", "2026-08-20T12:00:00.000Z", false));
    await surface.publish(batch("22222222-2222-4222-8222-222222222222", "2026-08-21T12:00:00.000Z", true));
    const get = createHistoricalIntelligenceQuery({ historicalPlan: surface, executionHistory: execution });
    expect(await get({ ...query, evaluationAsOf: "2026-08-21T00:00:00.000Z" })).toMatchObject({
      status: "projected", distribution: { eligibleScheduledCount: 1, notReported: 1 } });
    expect(await get(query)).toMatchObject({ status: "projected", planCoverage: {
      publishedEmptyDayCount: 1 }, distribution: { status: "notApplicable", eligibleScheduledCount: 0 } });
    surface.close();
  });

  it("propagates protected HistoricalPlan and ExecutionHistory rather than treating them as empty", async () => {
    const protectedPlan = { getHistoricalPlanRange: async () => ({ status: "unavailableProtected" as const,
      reason: "physicalMismatch" as const }) };
    expect(await createHistoricalIntelligenceQuery({ historicalPlan: protectedPlan,
      executionHistory: execution })(query)).toEqual({ status: "unavailable", reason: "historicalPlanProtected" });
    expect(await createHistoricalIntelligenceQuery({ historicalPlan: { getHistoricalPlanRange:
      async () => ({ status: "available" as const, days: [], missingDays: ["2026-08-20"] }) },
      executionHistory: { ...execution, getExecutionHistoryIngressStatus: () => ({
        status: "recoveryRequired" as const, reason: "corruptJson" as const,
        sourcePreserved: true }) } })(query))
      .toEqual({ status: "unavailable", reason: "executionHistoryProtected" });
    expect(await createHistoricalIntelligenceQuery({ historicalPlan: { getHistoricalPlanRange:
      async () => ({ status: "available" as const, days: [], missingDays: ["2026-08-20"] }) },
      executionHistory: { ...execution, getExecutionHistoryIngressStatus: () => ({
        status: "accepted" as const, quarantinedComponentCount: 1 }) } })(query))
      .toEqual({ status: "unavailable", reason: "executionHistoryQuarantined" });
  });

  it("derives unavailable history after full clear without a metric clear participant", async () => {
    const store = createReadyDayFrameTestStore();
    await store.clearLocalData();
    expect(await store.getHistoricalCompletionDistribution(query)).toMatchObject({ status: "projected",
      planCoverage: { status: "unavailable" }, distribution: { status: "unavailable" },
      limitations: ["noPlanCoverage"] });
    expect(await store.getHistoricalSchedulingRealization(query)).toMatchObject({ status: "projected",
      planCoverage: { status: "unavailable" }, distribution: { status: "unavailable" },
      limitations: ["noPlanCoverage"] });
  });

  it("uses cutoff republication while remaining independent of ExecutionHistory protection", async () => {
    const surface = createHistoricalPlanSurface({ storage: createDayFrameDurableDb({
      indexedDB: new IDBFactory(), name: "scheduling-realization-republication" }) });
    await surface.initialize();
    await surface.publish(batch("33333333-3333-4333-8333-333333333333", "2026-08-20T12:00:00.000Z", false));
    await surface.publish(batch("44444444-4444-4444-8444-444444444444", "2026-08-21T12:00:00.000Z", true));
    const get = createHistoricalSchedulingRealizationQuery({ historicalPlan: surface });
    expect(await get({ ...query, evaluationAsOf: "2026-08-21T00:00:00.000Z" })).toMatchObject({
      status: "projected", distribution: { intendedOccurrenceCount: 1, scheduled: 1 } });
    expect(await get(query)).toMatchObject({ status: "projected", distribution: {
      status: "notApplicable", intendedOccurrenceCount: 0 } });
    surface.close();
  });

  it("propagates only HistoricalPlan protection at its application boundary", async () => {
    const get = createHistoricalSchedulingRealizationQuery({ historicalPlan: { getHistoricalPlanRange:
      async () => ({ status: "unavailableProtected" as const, reason: "physicalMismatch" as const }) } });
    expect(await get(query)).toEqual({ status: "unavailable", reason: "historicalPlanProtected" });
  });
});
