import { describe, expect, it } from "vitest";
import type { ExecutionRecordV1 } from "../execution/executionRecord.js";
import { buildExecutionHistoryItems } from "../execution/executionHistoryProjection.js";
import type {
  HistoricalPlanContext,
  HistoricalPlanDayPublicationV1,
  HistoricalPlannedOccurrenceSnapshot,
} from "../historicalPlan/historicalPlan.js";
import { historicalOccurrenceTimingSemantics } from "../historicalPlan/historicalPlan.js";
import type { DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { CanonicalUserDayWindow } from "../time/canonicalUserDay.js";
import { buildTodayReadModel, type BuildTodayReadModelInput } from "./buildTodayReadModel.js";

const INC = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as never;
const reference = (id: string): DurableOccurrenceReference => ({
  version: 1,
  sourceKind: "manualEvent",
  manualEvent: { id, incarnationId: INC },
});
const scheduled = (startsAt: string, endsAt: string): HistoricalPlanContext => ({
  state: "scheduled",
  startsAt,
  endsAt,
});
function occurrence(
  id: string,
  plan: HistoricalPlanContext,
  timing: "allDay" | "timed" | "legacy" = "timed",
): HistoricalPlannedOccurrenceSnapshot {
  const base = {
    reference: reference(id),
    sourceFamily: "manualEvent" as const,
    title: id,
    category: "optional" as const,
    plan,
  };
  return timing === "legacy"
    ? { version: 1, ...base }
    : { version: 2, ...base, timing: { kind: timing } };
}
const window: CanonicalUserDayWindow = {
  userDayDate: "2026-08-24",
  start: new Date("2026-08-24T08:00:00.000Z"),
  end: new Date("2026-08-25T11:00:00.000Z"),
  durationMinutes: 1620,
  dayBoundaryStartTime: "03:00",
  nextDayBoundaryStartTime: "06:00",
  weekStartsOn: "monday",
};
function day(occurrences: HistoricalPlannedOccurrenceSnapshot[]): HistoricalPlanDayPublicationV1 {
  return {
    version: 1,
    userDayDate: "2026-08-24",
    dayBoundaryStartTime: "03:00",
    weekStartsOn: "monday",
    utcOffsetMinutes: -300,
    occurrences,
  };
}
function input(
  occurrences: HistoricalPlannedOccurrenceSnapshot[],
  records: ExecutionRecordV1[] = [],
  evaluationAsOf = "2026-08-24T15:00:00.000Z",
): BuildTodayReadModelInput {
  return {
    evaluationAsOf,
    userDay: window,
    plan: {
      occurrences: day(occurrences).occurrences.map((value) => ({
        occurrence: value,
        timing: historicalOccurrenceTimingSemantics(value),
      })),
      batchId: "11111111-1111-4111-8111-111111111111",
      publishedAt: "2026-08-24T12:00:00.000Z",
      durability: "durable",
    },
    execution: {
      coverage: "available",
      items: buildExecutionHistoryItems(
        records.filter((record) => Date.parse(record.recordedAt) <= Date.parse(evaluationAsOf)),
      ),
    },
  };
}
function assertion(
  id: string,
  subjectId: string,
  occurrenceId: string,
  outcome: "completed" | "partial" | "skipped",
  recordedAt: string,
  replacesRecordId?: string,
): ExecutionRecordV1 {
  return {
    version: 1,
    id: id as never,
    subjectId: subjectId as never,
    kind: "assertion",
    subject: { kind: "planned", reference: reference(occurrenceId) },
    snapshot: {
      sourceFamily: "manualEvent",
      title: occurrenceId,
      category: "optional",
      userDay: { date: "2026-08-24", dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
      plan: scheduled("2026-08-24T14:00:00.000Z", "2026-08-24T16:00:00.000Z"),
    },
    outcome,
    provenance: { kind: "userReported" },
    recordedAt,
    ...(replacesRecordId ? { replacesRecordId: replacesRecordId as never } : {}),
  };
}

describe("buildTodayReadModel", () => {
  it("separates timing knowledge, plan attention, overlapping current, tied next, later, and elapsed", () => {
    const values = [
      occurrence(
        "all-day",
        scheduled("2026-08-24T08:00:00.000Z", "2026-08-25T11:00:00.000Z"),
        "allDay",
      ),
      occurrence(
        "legacy",
        scheduled("2026-08-24T09:00:00.000Z", "2026-08-24T10:00:00.000Z"),
        "legacy",
      ),
      occurrence("elapsed", scheduled("2026-08-24T12:00:00.000Z", "2026-08-24T13:00:00.000Z")),
      occurrence("current-b", scheduled("2026-08-24T14:30:00.000Z", "2026-08-24T16:30:00.000Z")),
      occurrence("current-a", scheduled("2026-08-24T14:00:00.000Z", "2026-08-24T16:00:00.000Z")),
      occurrence("next-b", scheduled("2026-08-24T17:00:00.000Z", "2026-08-24T18:30:00.000Z")),
      occurrence("next-a", scheduled("2026-08-24T17:00:00.000Z", "2026-08-24T18:00:00.000Z")),
      occurrence("later", scheduled("2026-08-24T19:00:00.000Z", "2026-08-24T20:00:00.000Z")),
      occurrence("unplaced", { state: "unplaced" }),
      occurrence("omitted", { state: "omitted" }),
      occurrence("blocked", { state: "blocked" }),
    ];
    const result = buildTodayReadModel(input(values));
    expect(result.userDay).toMatchObject({
      durationMinutes: 1620,
      dayBoundaryStartTime: "03:00",
      nextDayBoundaryStartTime: "06:00",
    });
    expect(result.allDay.map((value) => value.occurrence.title)).toEqual(["all-day"]);
    expect(result.timingUnavailableLegacy.map((value) => value.occurrence.title)).toEqual([
      "legacy",
    ]);
    expect(result.current.map((value) => value.occurrence.title)).toEqual([
      "current-a",
      "current-b",
    ]);
    expect(result.next.map((value) => value.occurrence.title)).toEqual(["next-a", "next-b"]);
    expect(result.later.map((value) => value.occurrence.title)).toEqual(["later"]);
    expect(result.elapsed.map((value) => value.occurrence.title)).toEqual(["elapsed"]);
    expect(result.elapsed[0]!.execution).toEqual({ coverage: "available", status: "notReported" });
    expect(
      Object.fromEntries(
        Object.entries(result.planAttention).map(([key, list]) => [
          key,
          list.map((value) => value.title),
        ]),
      ),
    ).toEqual({ unplaced: ["unplaced"], omitted: ["omitted"], blocked: ["blocked"] });
  });

  it("keeps temporal position orthogonal to explicit execution outcomes", () => {
    const records = [
      assertion(
        "10000000-0000-4000-8000-000000000001",
        "20000000-0000-4000-8000-000000000001",
        "current",
        "completed",
        "2026-08-24T14:45:00.000Z",
      ),
      assertion(
        "10000000-0000-4000-8000-000000000002",
        "20000000-0000-4000-8000-000000000002",
        "future",
        "completed",
        "2026-08-24T14:50:00.000Z",
      ),
    ];
    const result = buildTodayReadModel(
      input(
        [
          occurrence("current", scheduled("2026-08-24T14:00:00.000Z", "2026-08-24T16:00:00.000Z")),
          occurrence("future", scheduled("2026-08-24T17:00:00.000Z", "2026-08-24T18:00:00.000Z")),
        ],
        records,
      ),
    );
    expect(result.current[0]).toMatchObject({
      temporalPosition: "current",
      execution: { status: "completed" },
    });
    expect(result.next[0]).toMatchObject({
      temporalPosition: "upcoming",
      execution: { status: "completed" },
    });
  });

  it("applies correction and retraction only when their knowledge time enters the cutoff", () => {
    const subject = "20000000-0000-4000-8000-000000000001";
    const first = assertion(
      "10000000-0000-4000-8000-000000000001",
      subject,
      "event",
      "partial",
      "2026-08-24T14:00:00.000Z",
    );
    const corrected = assertion(
      "10000000-0000-4000-8000-000000000002",
      subject,
      "event",
      "completed",
      "2026-08-24T15:00:00.000Z",
      first.id,
    );
    const retracted: ExecutionRecordV1 = {
      version: 1,
      id: "10000000-0000-4000-8000-000000000003" as never,
      subjectId: subject as never,
      kind: "retraction",
      provenance: { kind: "userReported" },
      recordedAt: "2026-08-24T16:00:00.000Z",
      replacesRecordId: corrected.id,
    };
    const planned = [
      occurrence("event", scheduled("2026-08-24T12:00:00.000Z", "2026-08-24T20:00:00.000Z")),
    ];
    expect(
      buildTodayReadModel(input(planned, [retracted, corrected, first], "2026-08-24T14:30:00.000Z"))
        .current[0]!.execution,
    ).toMatchObject({ status: "partial" });
    expect(
      buildTodayReadModel(input(planned, [first, retracted, corrected], "2026-08-24T15:30:00.000Z"))
        .current[0]!.execution,
    ).toMatchObject({ status: "completed" });
    expect(
      buildTodayReadModel(input(planned, [corrected, first, retracted], "2026-08-24T16:30:00.000Z"))
        .current[0]!.execution,
    ).toEqual({ coverage: "available", status: "notReported" });
  });

  it("does not migrate reports to a visually similar new exact reference and isolates clones", () => {
    const old = assertion(
      "10000000-0000-4000-8000-000000000001",
      "20000000-0000-4000-8000-000000000001",
      "old",
      "completed",
      "2026-08-24T14:00:00.000Z",
    );
    const source = occurrence(
      "new",
      scheduled("2026-08-24T14:00:00.000Z", "2026-08-24T16:00:00.000Z"),
    );
    source.title = "Same";
    const result = buildTodayReadModel(input([source], [old]));
    expect(result.current[0]!.execution).toEqual({ coverage: "available", status: "notReported" });
    result.current[0]!.occurrence.title = "changed";
    expect(source.title).toBe("Same");
  });

  it("is independent of occurrence and execution input order and preserves protected execution", () => {
    const values = [
      occurrence("b", scheduled("2026-08-24T14:00:00.000Z", "2026-08-24T16:00:00.000Z")),
      occurrence("a", scheduled("2026-08-24T14:00:00.000Z", "2026-08-24T16:00:00.000Z")),
    ];
    expect(buildTodayReadModel(input(values))).toEqual(
      buildTodayReadModel(input([...values].reverse())),
    );
    const protectedResult = buildTodayReadModel({
      ...input(values),
      execution: { coverage: "unavailableProtected" },
    });
    expect(
      protectedResult.current.every((value) => value.execution.coverage === "unavailableProtected"),
    ).toBe(true);
  });

  it("represents a published empty plan as available known-empty", () => {
    expect(buildTodayReadModel(input([]))).toMatchObject({
      status: "available",
      plan: { coverage: "knownEmpty" },
      allDay: [],
      timed: [],
      current: [],
      next: [],
      later: [],
      elapsed: [],
    });
  });
});
