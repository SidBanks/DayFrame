import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../authored/sourceIncarnation.js";
import type {
  ExecutionRecordId,
  ExecutionRecordV1,
  ExecutionSubjectId,
} from "../execution/executionRecord.js";
import type {
  HistoricalPlanContext,
  HistoricalPlanDayPublicationV1,
} from "../historicalPlan/historicalPlan.js";
import type { DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import {
  HISTORICAL_METRIC_POLICY_V1,
  projectHistoricalCompletionDistributionV1,
  type EffectiveHistoricalPlanDayEvidence,
  type HistoricalCompletionDistributionQueryV1,
} from "./completionDistribution.js";

const inc = (value: string) => value as SourceIncarnationId;
const query: HistoricalCompletionDistributionQueryV1 = {
  policy: HISTORICAL_METRIC_POLICY_V1,
  startUserDayDate: "2026-08-20",
  endUserDayDate: "2026-08-21",
  evaluationAsOf: "2026-08-22T00:00:00.000Z",
};
const reference = (slot: number, incarnation = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa") =>
  ({
    version: 1,
    sourceKind: "template",
    template: { id: "template", incarnationId: inc(incarnation) },
    recurrence: { id: "recurrence", incarnationId: inc("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb") },
    coordinate: { frequency: "daily", scopeKind: "userDay", userDayDate: "2026-08-20", slot },
  }) as DurableOccurrenceReference;
const occurrence = (
  slot: number,
  plan: HistoricalPlanContext = {
    state: "scheduled",
    startsAt: `2026-08-20T${String(10 + slot).padStart(2, "0")}:00:00.000Z`,
    endsAt: `2026-08-20T${String(11 + slot).padStart(2, "0")}:00:00.000Z`,
  },
) => ({
  version: 1 as const,
  reference: reference(slot),
  sourceFamily: "template" as const,
  title: `Item ${slot}`,
  category: "fitness" as const,
  plan,
});
function day(
  date: LocalDateString,
  occurrences: HistoricalPlanDayPublicationV1["occurrences"] = [],
): EffectiveHistoricalPlanDayEvidence {
  return {
    batchId: `batch-${date}`,
    publishedAt: "2026-08-21T00:00:00.000Z",
    day: {
      version: 1,
      userDayDate: date,
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "monday",
      utcOffsetMinutes: -300,
      occurrences,
    },
  };
}
const id = (prefix: number, slot: number) =>
  `00000000-0000-4${prefix}00-8${prefix}00-${String(slot).padStart(12, "0")}`;
function assertion(
  slot: number,
  outcome: "completed" | "partial" | "skipped",
  options: {
    subjectSlot?: number;
    replaces?: ExecutionRecordId;
    referenceValue?: DurableOccurrenceReference;
  } = {},
): ExecutionRecordV1 {
  const subjectSlot = options.subjectSlot ?? slot;
  return {
    version: 1,
    id: id(0, slot) as ExecutionRecordId,
    subjectId: id(1, subjectSlot) as ExecutionSubjectId,
    kind: "assertion",
    provenance: { kind: "userReported" },
    recordedAt: `2026-08-21T${String(10 + slot).padStart(2, "0")}:00:00.000Z`,
    subject: { kind: "planned", reference: options.referenceValue ?? reference(subjectSlot) },
    snapshot: {
      sourceFamily: "template",
      title: `Item ${subjectSlot}`,
      category: "fitness",
      userDay: { date: "2026-08-20", dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
      plan: {
        state: "scheduled",
        startsAt: "2026-08-20T10:00:00.000Z",
        endsAt: "2026-08-20T11:00:00.000Z",
      },
    },
    outcome,
    ...(options.replaces ? { replacesRecordId: options.replaces } : {}),
  };
}
function retraction(
  slot: number,
  subjectSlot: number,
  replaces: ExecutionRecordId,
): ExecutionRecordV1 {
  return {
    version: 1,
    id: id(2, slot) as ExecutionRecordId,
    subjectId: id(1, subjectSlot) as ExecutionSubjectId,
    kind: "retraction",
    provenance: { kind: "userReported" },
    recordedAt: `2026-08-22T${String(10 + slot).padStart(2, "0")}:00:00.000Z`,
    replacesRecordId: replaces,
  };
}
function project(
  days: EffectiveHistoricalPlanDayEvidence[],
  records: ExecutionRecordV1[] = [],
  missing: LocalDateString[] = [],
) {
  return projectHistoricalCompletionDistributionV1({
    query,
    days,
    executionRecords: records,
    missingUserDayDates: missing,
  });
}

describe("Historical Coverage and Completion Distribution V1", () => {
  it("validates the explicit policy, dates, range, and evaluation cutoff", () => {
    expect(
      projectHistoricalCompletionDistributionV1({
        query: { ...query, startUserDayDate: "bad" as LocalDateString, evaluationAsOf: "now" },
        days: [],
        missingUserDayDates: [],
        executionRecords: [],
      }),
    ).toEqual({
      status: "invalidQuery",
      issues: ["invalidStartUserDayDate", "invalidEvaluationAsOf"],
    });
    expect(
      projectHistoricalCompletionDistributionV1({
        query: { ...query, startUserDayDate: "2026-08-22", endUserDayDate: "2026-08-20" },
        days: [],
        missingUserDayDates: [],
        executionRecords: [],
      }),
    ).toEqual({ status: "invalidQuery", issues: ["invalidRange"] });
  });

  it("classifies every outcome once and conserves the scheduled denominator", () => {
    const occurrences = [0, 1, 2, 3, 4].map((slot) => occurrence(slot));
    const first = assertion(0, "completed");
    const partial = assertion(1, "partial");
    const skipped = assertion(2, "skipped");
    const withdrawn = assertion(3, "completed");
    const result = project(
      [day("2026-08-20", occurrences), day("2026-08-21")],
      [skipped, retraction(8, 3, withdrawn.id), partial, withdrawn, first],
    );
    expect(result).toMatchObject({
      status: "projected",
      planCoverage: {
        status: "complete",
        expectedDayCount: 2,
        publishedDayCount: 2,
        publishedEmptyDayCount: 1,
        missingDayCount: 0,
      },
      distribution: {
        status: "available",
        eligibleScheduledCount: 5,
        completed: 1,
        partial: 1,
        skipped: 1,
        unknown: 1,
        notReported: 1,
      },
      currentOutcomeCoverage: {
        status: "available",
        classifiedCount: 3,
        eligibleCount: 5,
      },
    });
    if (result.status === "projected")
      expect(result.distribution.eligibleScheduledCount).toBe(
        result.distribution.completed +
          result.distribution.partial +
          result.distribution.skipped +
          result.distribution.unknown +
          result.distribution.notReported,
      );
  });

  it("keeps all non-scheduled plan states excluded with deterministic reasons", () => {
    const result = project([
      day("2026-08-20", [
        occurrence(0),
        occurrence(1, { state: "unplaced" }),
        occurrence(2, { state: "omitted" }),
        occurrence(3, { state: "blocked" }),
      ]),
      day("2026-08-21"),
    ]);
    expect(result).toMatchObject({
      status: "projected",
      distribution: {
        eligibleScheduledCount: 1,
        notReported: 1,
      },
      provenance: {
        excluded: [
          { reason: "excludedUnplaced" },
          { reason: "excludedOmitted" },
          { reason: "excludedBlocked" },
        ],
      },
    });
  });

  it("distinguishes published-empty, incomplete, and entirely unavailable coverage", () => {
    expect(project([day("2026-08-20"), day("2026-08-21")])).toMatchObject({
      status: "projected",
      planCoverage: { status: "complete", publishedEmptyDayCount: 2 },
      distribution: { status: "notApplicable", eligibleScheduledCount: 0 },
      currentOutcomeCoverage: { status: "notApplicable" },
      limitations: ["zeroEligibleOccurrences"],
    });
    expect(project([day("2026-08-20", [occurrence(0)])], [], ["2026-08-21"])).toMatchObject({
      status: "projected",
      planCoverage: { status: "incompleteCoverage", missingUserDayDates: ["2026-08-21"] },
      limitations: ["incompletePlanCoverage"],
    });
    expect(project([], [], ["2026-08-20", "2026-08-21"])).toMatchObject({
      status: "projected",
      planCoverage: { status: "unavailable", expectedDayCount: 2, missingDayCount: 2 },
      distribution: { status: "unavailable" },
      currentOutcomeCoverage: { status: "unavailable" },
      limitations: ["noPlanCoverage"],
    });
  });

  it("uses the corrected head without changing eligibility", () => {
    const original = assertion(0, "partial");
    const corrected = assertion(7, "completed", { subjectSlot: 0, replaces: original.id });
    expect(
      project([day("2026-08-20", [occurrence(0)]), day("2026-08-21")], [corrected, original]),
    ).toMatchObject({
      status: "projected",
      distribution: {
        eligibleScheduledCount: 1,
        completed: 1,
        partial: 0,
      },
    });
  });

  it("does not join a recreated incarnation with the same logical IDs", () => {
    const old = assertion(0, "completed", {
      referenceValue: reference(0, "cccccccc-cccc-4ccc-8ccc-cccccccccccc"),
    });
    expect(project([day("2026-08-20", [occurrence(0)]), day("2026-08-21")], [old])).toMatchObject({
      status: "projected",
      distribution: { completed: 0, notReported: 1 },
    });
  });

  it("is input-order deterministic, user-day scoped, and clone-isolated", () => {
    const overnight = occurrence(0, {
      state: "scheduled",
      startsAt: "2026-08-21T02:30:00.000Z",
      endsAt: "2026-08-21T04:00:00.000Z",
    });
    const days = [day("2026-08-20", [occurrence(1), overnight]), day("2026-08-21")];
    const records = [assertion(0, "completed"), assertion(1, "partial")];
    const first = project(days, records);
    const second = project([...days].reverse(), [...records].reverse());
    expect(first).toEqual(second);
    if (first.status !== "projected") return;
    first.provenance.eligible[0]!.title = "mutated";
    (first.provenance.eligible[0]!.reference as { sourceKind: string }).sourceKind = "changed";
    expect(project(days, records)).toEqual(second);
    expect(days[0]!.day.occurrences[0]!.title).toBe("Item 1");
  });

  it("reproduces semantic output after JSON authority roundtrip", () => {
    const days = [day("2026-08-20", [occurrence(0)]), day("2026-08-21")];
    const records = [assertion(0, "completed")];
    expect(project(JSON.parse(JSON.stringify(days)), JSON.parse(JSON.stringify(records)))).toEqual(
      project(days, records),
    );
  });
});
