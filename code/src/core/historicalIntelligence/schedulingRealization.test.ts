import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../authored/sourceIncarnation.js";
import type { HistoricalPlanContext, HistoricalPlanDayPublicationV1 } from
  "../historicalPlan/historicalPlan.js";
import type { DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import { HISTORICAL_METRIC_POLICY_V1 } from "./completionDistribution.js";
import type { HistoricalPlanEvidenceV1 } from "./historicalPlanCoverage.js";
import { projectHistoricalSchedulingRealizationV1,
  type HistoricalSchedulingRealizationQueryV1 } from "./schedulingRealization.js";

const inc = (value: string) => value as SourceIncarnationId;
const query: HistoricalSchedulingRealizationQueryV1 = { policy: HISTORICAL_METRIC_POLICY_V1,
  startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-21",
  evaluationAsOf: "2026-08-22T00:00:00.000Z" };
const reference = (slot: number, incarnation = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa") => ({
  version: 1, sourceKind: "template", template: { id: "template", incarnationId: inc(incarnation) },
  recurrence: { id: "recurrence", incarnationId: inc("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb") },
  coordinate: { frequency: "daily", scopeKind: "userDay", userDayDate: "2026-08-20", slot },
}) as DurableOccurrenceReference;
const occurrence = (slot: number, plan: HistoricalPlanContext) => ({ version: 1 as const,
  reference: reference(slot), sourceFamily: "template" as const, title: `Item ${slot}`,
  category: "fitness" as const, plan });
function day(date: LocalDateString, occurrences: HistoricalPlanDayPublicationV1["occurrences"] = []):
  HistoricalPlanEvidenceV1 {
  return { batchId: `batch-${date}`, publishedAt: "2026-08-21T00:00:00.000Z",
    day: { version: 1 as const, userDayDate: date, dayBoundaryStartTime: "03:00",
      weekStartsOn: "monday" as const, utcOffsetMinutes: -300, occurrences } };
}
function project(days: ReturnType<typeof day>[], missing: LocalDateString[] = []) {
  return projectHistoricalSchedulingRealizationV1({ query, days, missingUserDayDates: missing });
}

describe("Scheduling Realization Projection V1", () => {
  it("validates the shared policy, date window, and evaluation cutoff", () => {
    expect(projectHistoricalSchedulingRealizationV1({ query: { ...query,
      startUserDayDate: "bad" as LocalDateString, evaluationAsOf: "now" }, days: [],
      missingUserDayDates: [] })).toEqual({ status: "invalidQuery",
      issues: ["invalidStartUserDayDate", "invalidEvaluationAsOf"] });
  });

  it("classifies all four HistoricalPlan dispositions exactly once and conserves the denominator", () => {
    const result = project([day("2026-08-20", [
      occurrence(0, { state: "scheduled", startsAt: "2026-08-20T10:00:00.000Z",
        endsAt: "2026-08-20T11:00:00.000Z" }),
      occurrence(1, { state: "unplaced" }), occurrence(2, { state: "omitted" }),
      occurrence(3, { state: "blocked" }),
    ]), day("2026-08-21")]);
    expect(result).toMatchObject({ status: "projected", metric: { id: "schedulingRealization", version: 1 },
      policy: HISTORICAL_METRIC_POLICY_V1, planCoverage: { status: "complete", expectedDayCount: 2,
        publishedDayCount: 2, publishedEmptyDayCount: 1 }, distribution: { status: "available",
        intendedOccurrenceCount: 4, scheduled: 1, unplaced: 1, omitted: 1, blocked: 1 } });
    if (result.status === "projected") expect(result.distribution.intendedOccurrenceCount).toBe(
      result.distribution.scheduled + result.distribution.unplaced + result.distribution.omitted +
      result.distribution.blocked);
  });

  it("distinguishes published-empty, incomplete, and unavailable coverage", () => {
    expect(project([day("2026-08-20"), day("2026-08-21")])).toMatchObject({ status: "projected",
      planCoverage: { status: "complete", publishedEmptyDayCount: 2 },
      distribution: { status: "notApplicable", intendedOccurrenceCount: 0 },
      limitations: ["zeroIntendedOccurrences"] });
    expect(project([day("2026-08-20", [occurrence(0, { state: "unplaced" })])], ["2026-08-21"]))
      .toMatchObject({ status: "projected", planCoverage: { status: "incompleteCoverage" },
        distribution: { status: "available", intendedOccurrenceCount: 1 },
        limitations: ["incompletePlanCoverage"] });
    expect(project([], ["2026-08-20", "2026-08-21"])).toMatchObject({ status: "projected",
      planCoverage: { status: "unavailable" }, distribution: { status: "unavailable" },
      limitations: ["noPlanCoverage"] });
  });

  it("preserves exact incarnations and frozen state-specific provenance without inventing reasons", () => {
    const old = occurrence(0, { state: "blocked" });
    const recreated = { ...occurrence(0, { state: "blocked" }), reference: reference(0,
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc") };
    const result = project([day("2026-08-20", [recreated, old]), day("2026-08-21")]);
    expect(result).toMatchObject({ status: "projected", distribution: { intendedOccurrenceCount: 2,
      blocked: 2 }, provenance: { occurrences: [{ planningDisposition: "blocked",
        plan: { state: "blocked" } }, { planningDisposition: "blocked", plan: { state: "blocked" } }] } });
    if (result.status !== "projected") return;
    expect(new Set(result.provenance.occurrences.map((value) =>
      value.reference.sourceKind === "template" ? value.reference.template.incarnationId : "")).size).toBe(2);
    expect(result.provenance.occurrences.every((value) => !("reason" in value))).toBe(true);
  });

  it("is deterministic, clone-isolated, and reproducible after durable JSON authority roundtrip", () => {
    const days = [day("2026-08-20", [occurrence(2, { state: "omitted" }),
      occurrence(0, { state: "scheduled", startsAt: "2026-08-20T12:00:00.000Z",
        endsAt: "2026-08-20T13:00:00.000Z" })]), day("2026-08-21")];
    const first = project(days); const second = project([...days].reverse());
    expect(first).toEqual(second);
    expect(project(JSON.parse(JSON.stringify(days)))).toEqual(second);
    if (first.status !== "projected") return;
    first.provenance.occurrences[0]!.title = "mutated";
    (first.provenance.occurrences[0]!.reference as { sourceKind: string }).sourceKind = "changed";
    expect(project(days)).toEqual(second);
    expect(days[0]!.day.occurrences[0]!.title).toBe("Item 2");
  });

  it("has no current Active, Preview, ExecutionHistory, or completion input", () => {
    const input = { query, days: [day("2026-08-20", [occurrence(0, { state: "unplaced" })]),
      day("2026-08-21")], missingUserDayDates: [] };
    const baseline = projectHistoricalSchedulingRealizationV1(input);
    const unrelatedRuntimeAuthorities = { active: { revision: 99 }, preview: { id: "draft" },
      executionHistory: [{ outcome: "completed" }], completionProjection: { completed: 500 } };
    unrelatedRuntimeAuthorities.active.revision = 100;
    expect(projectHistoricalSchedulingRealizationV1(input)).toEqual(baseline);
  });
});
