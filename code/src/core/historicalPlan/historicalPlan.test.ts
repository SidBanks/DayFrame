import { describe, expect, it, vi } from "vitest";
import type { DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import {
  HISTORICAL_PLAN_DAY_PUBLICATION_VERSION,
  HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION,
  HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_V2_VERSION,
  HISTORICAL_PLAN_SURFACE_VERSION,
  PLAN_PUBLICATION_BATCH_VERSION,
  createPlanPublicationBatch,
  cloneHistoricalPlanSnapshot,
  historicalGoalProvenanceCoverage,
  historicalOccurrenceTimingSemantics,
  isPlanPublicationBatchId,
  type HistoricalPlanDayPublicationV1,
  type HistoricalPlannedOccurrenceSnapshotV2,
  type PlanPublicationBatchV1,
} from "./historicalPlan.js";
import {
  areHistoricalPlanDaysSemanticallyEqual,
  historicalPlanDayFingerprint,
  historicalPlanSnapshotFingerprint,
} from "./historicalPlanFingerprint.js";
import {
  appendPlanPublicationBatch,
  classifyPublicationCandidate,
  getEffectiveHistoricalPlanDay,
  getEffectiveHistoricalPlanRange,
} from "./historicalPlanProjection.js";
import {
  validateHistoricalPlanCollection,
  validatePlanPublicationBatch,
} from "./historicalPlanValidation.js";

const ID1 = "11111111-1111-4111-8111-111111111111";
const ID2 = "22222222-2222-4222-8222-222222222222";
const INC1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const INC2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function reference(
  date: LocalDateString = "2026-08-20",
  incarnationId = INC1,
): DurableOccurrenceReference {
  return {
    version: 1,
    sourceKind: "work",
    cycle: { id: "cycle", incarnationId },
    entry: { id: "entry", incarnationId: INC1, kind: "segment" },
    shiftDefinition: { id: "shift", incarnationId: INC1 },
    coordinate: { localStartDate: date, slot: 0 },
  } as DurableOccurrenceReference;
}
function day(
  date: LocalDateString = "2026-08-20",
  overrides: Partial<HistoricalPlanDayPublicationV1> = {},
): HistoricalPlanDayPublicationV1 {
  return {
    version: HISTORICAL_PLAN_DAY_PUBLICATION_VERSION,
    userDayDate: date,
    dayBoundaryStartTime: "03:00",
    weekStartsOn: "monday",
    utcOffsetMinutes: -300,
    occurrences: [
      {
        version: HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION,
        reference: reference(date),
        sourceFamily: "work",
        title: "Shift",
        category: "work",
        plan: {
          state: "scheduled",
          startsAt: `${date}T13:00:00.000Z`,
          endsAt: `${date}T21:00:00.000Z`,
        },
      },
    ],
    ...overrides,
  };
}
function batch(
  id = ID1,
  publishedAt = "2026-08-19T12:00:00.000Z",
  days = [day()],
): PlanPublicationBatchV1 {
  return {
    surfaceVersion: HISTORICAL_PLAN_SURFACE_VERSION,
    version: PLAN_PUBLICATION_BATCH_VERSION,
    id,
    publishedAt,
    range: {
      startUserDayDate: days[0]!.userDayDate,
      endUserDayDate: days[days.length - 1]!.userDayDate,
    },
    days,
  } as PlanPublicationBatchV1;
}
function v2Day(kind: "allDay" | "timed"): HistoricalPlanDayPublicationV1 {
  const result = day();
  result.occurrences = [
    {
      ...result.occurrences[0]!,
      version: HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_V2_VERSION,
      timing: { kind },
    } as HistoricalPlannedOccurrenceSnapshotV2,
  ];
  return result;
}

describe("HistoricalPlan V1 identity and construction", () => {
  it("accepts only canonical lowercase UUID-v4 batch IDs", () => {
    expect(isPlanPublicationBatchId(ID1)).toBe(true);
    expect(isPlanPublicationBatchId("abcdefab-cdef-4abc-8abc-abcdefabcdef")).toBe(true);
    expect(isPlanPublicationBatchId("ABCDEFAB-CDEF-4ABC-8ABC-ABCDEFABCDEF")).toBe(false);
    expect(isPlanPublicationBatchId("11111111-1111-3111-8111-111111111111")).toBe(false);
  });
  it("injects ID/time, canonicalizes days and snapshots, and clone-isolates", () => {
    const second = day("2026-08-21", { occurrences: [] });
    const input = {
      range: {
        startUserDayDate: "2026-08-20" as LocalDateString,
        endUserDayDate: "2026-08-21" as LocalDateString,
      },
      days: [second, day()],
    };
    const result = createPlanPublicationBatch(input, {
      allocateBatchId: () => ID1 as never,
      now: () => "2026-08-19T12:00:00.000Z",
    });
    expect(result.status).toBe("created");
    if (result.status !== "created") return;
    expect(result.batch.days.map((value) => value.userDayDate)).toEqual([
      "2026-08-20",
      "2026-08-21",
    ]);
    input.days[0]!.weekStartsOn = "friday";
    expect(result.batch.days[1]!.weekStartsOn).toBe("monday");
  });
  it("returns allocationFailure without throwing", () => {
    expect(
      createPlanPublicationBatch(
        { range: { startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-20" }, days: [day()] },
        {
          allocateBatchId: () => {
            throw new Error("no entropy");
          },
        },
      ).status,
    ).toBe("allocationFailure");
  });
});

describe("HistoricalPlan V1 strict validation", () => {
  it("strictly validates V1 and both V2 timing kinds while rejecting crossed shapes", () => {
    expect(validatePlanPublicationBatch(batch()).status).toBe("valid");
    expect(validatePlanPublicationBatch(batch(ID1, undefined, [v2Day("timed")])).status).toBe(
      "valid",
    );
    expect(validatePlanPublicationBatch(batch(ID1, undefined, [v2Day("allDay")])).status).toBe(
      "valid",
    );
    const v1WithTiming = structuredClone(day()) as unknown as {
      occurrences: Array<Record<string, unknown>>;
    };
    v1WithTiming.occurrences[0]!.timing = { kind: "timed" };
    const missing = v2Day("timed") as unknown as { occurrences: Array<Record<string, unknown>> };
    delete missing.occurrences[0]!.timing;
    const unknown = v2Day("timed") as unknown as { occurrences: Array<Record<string, unknown>> };
    unknown.occurrences[0]!.timing = { kind: "unknown" };
    const extra = v2Day("allDay") as unknown as { occurrences: Array<Record<string, unknown>> };
    extra.occurrences[0]!.timing = { kind: "allDay", extra: true };
    const future = v2Day("timed") as unknown as { occurrences: Array<Record<string, unknown>> };
    future.occurrences[0]!.version = 3;
    for (const value of [v1WithTiming, missing, unknown, extra, future]) {
      expect(
        validatePlanPublicationBatch(
          batch(ID1, undefined, [value as unknown as HistoricalPlanDayPublicationV1]),
        ).status,
      ).toBe("invalid");
    }
  });
  it("accepts complete batches including explicit empty days and JSON roundtrips", () => {
    const value = batch(ID1, "2026-08-19T12:00:00.000Z", [
      day("2026-08-20"),
      day("2026-08-21", { occurrences: [] }),
    ]);
    value.range.endUserDayDate = "2026-08-21";
    expect(validatePlanPublicationBatch(JSON.parse(JSON.stringify(value))).status).toBe("valid");
  });
  it.each([
    [
      "missingDay",
      () => ({
        ...batch(),
        range: { startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-21" },
      }),
    ],
    [
      "extraDay",
      () => ({
        ...batch(),
        days: [day("2026-08-19")],
        range: { startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-20" },
      }),
    ],
    ["duplicateDay", () => ({ ...batch(), days: [day(), day()] })],
  ])("rejects %s coverage", (code, make) => {
    const result = validatePlanPublicationBatch(make());
    expect(result.status === "invalid" && result.issues.some((issue) => issue.code === code)).toBe(
      true,
    );
  });
  it("rejects unknown keys, invalid state shapes, intervals, family mismatches, and wrong-day references", () => {
    const cases: unknown[] = [];
    cases.push({ ...batch(), surprise: true });
    const nonScheduled = day();
    (nonScheduled.occurrences[0]!.plan as object & { startsAt: string }).startsAt = "x";
    cases.push(batch(ID1, undefined, [nonScheduled]));
    const interval = day();
    interval.occurrences[0]!.plan = {
      state: "scheduled",
      startsAt: "2026-08-20T15:00:00.000Z",
      endsAt: "2026-08-20T14:00:00.000Z",
    };
    cases.push(batch(ID1, undefined, [interval]));
    const family = day();
    family.occurrences[0]!.sourceFamily = "template";
    cases.push(batch(ID1, undefined, [family]));
    const wrongDay = day();
    wrongDay.occurrences[0]!.reference = reference("2026-08-19");
    cases.push(batch(ID1, undefined, [wrongDay]));
    expect(cases.every((value) => validatePlanPublicationBatch(value).status === "invalid")).toBe(
      true,
    );
  });
  it("rejects duplicate references within and across days", () => {
    const sameDay = day();
    sameDay.occurrences.push(structuredClone(sameDay.occurrences[0]!));
    expect(validatePlanPublicationBatch(batch(ID1, undefined, [sameDay])).status).toBe("invalid");
    const next = day("2026-08-21");
    next.occurrences[0]!.reference = reference("2026-08-20");
    const value = batch(ID1, undefined, [day(), next]);
    value.range.endUserDayDate = "2026-08-21";
    const result = validatePlanPublicationBatch(value);
    expect(
      result.status === "invalid" &&
        result.issues.some((issue) => issue.code === "crossDayDuplicateReference"),
    ).toBe(true);
  });
  it("rejects duplicate IDs and conflicting same-time authority", () => {
    expect(validateHistoricalPlanCollection([batch(), batch()]).status).toBe("invalid");
    const changed = day();
    changed.occurrences[0]!.title = "Changed";
    const result = validateHistoricalPlanCollection([
      batch(ID1),
      batch(ID2, "2026-08-19T12:00:00.000Z", [changed]),
    ]);
    expect(
      result.status === "invalid" &&
        result.issues.some((issue) => issue.code === "ambiguousPublishedAtTie"),
    ).toBe(true);
  });
});

describe("HistoricalPlan V1 fingerprints, dedup, and projection", () => {
  it("preserves explicit timing semantics, clone isolation, JSON, and fingerprint distinctions", () => {
    const legacy = day().occurrences[0]!;
    const timed = v2Day("timed").occurrences[0]!;
    const allDay = v2Day("allDay").occurrences[0]!;
    expect(historicalOccurrenceTimingSemantics(legacy)).toEqual({ coverage: "unavailableLegacy" });
    expect(historicalOccurrenceTimingSemantics(timed)).toEqual({
      coverage: "available",
      kind: "timed",
    });
    expect(historicalOccurrenceTimingSemantics(allDay)).toEqual({
      coverage: "available",
      kind: "allDay",
    });
    expect(new Set([legacy, timed, allDay].map(historicalPlanSnapshotFingerprint)).size).toBe(3);
    const clone = cloneHistoricalPlanSnapshot(allDay);
    expect(historicalPlanSnapshotFingerprint(clone)).toBe(
      historicalPlanSnapshotFingerprint(allDay),
    );
    if (clone.version === 2) clone.timing.kind = "timed";
    expect(historicalOccurrenceTimingSemantics(allDay)).toEqual({
      coverage: "available",
      kind: "allDay",
    });
    for (const snapshot of [legacy, timed, allDay]) {
      const roundtrip = JSON.parse(JSON.stringify(snapshot));
      expect(historicalPlanSnapshotFingerprint(roundtrip)).toBe(
        historicalPlanSnapshotFingerprint(snapshot),
      );
    }
  });
  it("selects legacy and changed V2 timing only at each republication cutoff", () => {
    const legacy = batch(ID1, "2026-08-20T08:00:00.000Z", [day()]);
    const allDay = batch(ID2, "2026-08-20T12:00:00.000Z", [v2Day("allDay")]);
    const timed = batch("33333333-3333-4333-8333-333333333333", "2026-08-20T16:00:00.000Z", [
      v2Day("timed"),
    ]);
    const at = (asOf: string) =>
      getEffectiveHistoricalPlanDay({
        batches: [legacy, allDay, timed],
        userDayDate: "2026-08-20",
        asOf,
      });
    const before = at("2026-08-20T10:00:00.000Z");
    const middle = at("2026-08-20T13:00:00.000Z");
    const after = at("2026-08-20T17:00:00.000Z");
    expect(
      before.status === "available" &&
        historicalOccurrenceTimingSemantics(before.day.occurrences[0]!),
    ).toEqual({ coverage: "unavailableLegacy" });
    expect(
      middle.status === "available" &&
        historicalOccurrenceTimingSemantics(middle.day.occurrences[0]!),
    ).toEqual({ coverage: "available", kind: "allDay" });
    expect(
      after.status === "available" &&
        historicalOccurrenceTimingSemantics(after.day.occurrences[0]!),
    ).toEqual({ coverage: "available", kind: "timed" });
    expect(historicalOccurrenceTimingSemantics(legacy.days[0]!.occurrences[0]!)).toEqual({
      coverage: "unavailableLegacy",
    });
  });
  it("distinguishes legacy unavailable provenance from Goal-aware known empty", () => {
    const legacy = day();
    const aware = structuredClone(legacy);
    aware.occurrences[0]!.goals = [];
    expect(historicalGoalProvenanceCoverage(legacy.occurrences[0]!)).toBe("unavailableLegacy");
    expect(historicalGoalProvenanceCoverage(aware.occurrences[0]!)).toBe("available");
    expect(historicalPlanDayFingerprint(legacy)).not.toBe(historicalPlanDayFingerprint(aware));
    expect(JSON.parse(JSON.stringify(aware)).occurrences[0].goals).toEqual([]);
  });
  it("validates and canonicalizes Goal-aware empty and linked provenance", () => {
    const aware = day();
    aware.occurrences[0]!.goals = [];
    expect(validatePlanPublicationBatch(batch(ID1, undefined, [aware])).status).toBe("valid");
    const malformed = structuredClone(aware) as unknown as {
      occurrences: Array<Record<string, unknown>>;
    };
    malformed.occurrences[0]!.goals = [{ version: 2 }];
    expect(
      validatePlanPublicationBatch(
        batch(ID1, undefined, [malformed as unknown as HistoricalPlanDayPublicationV1]),
      ).status,
    ).toBe("invalid");
  });
  it("preserves legacy, empty, and linked provenance across republication cutoffs", () => {
    const legacy = batch(ID1, "2026-08-19T12:00:00.000Z");
    const emptyDay = day();
    emptyDay.occurrences[0]!.goals = [];
    const empty = batch(ID2, "2026-08-20T12:00:00.000Z", [emptyDay]);
    const linkedDay = structuredClone(emptyDay);
    linkedDay.occurrences[0]!.goals = [
      {
        version: 1,
        goalId: "33333333-3333-4333-8333-333333333333" as never,
        goalRevision: 1,
        title: "Goal",
        status: "active",
      },
    ];
    const linked = batch("44444444-4444-4444-8444-444444444444", "2026-08-21T12:00:00.000Z", [
      linkedDay,
    ]);
    const unlinked = batch("55555555-5555-4555-8555-555555555555", "2026-08-22T12:00:00.000Z", [
      emptyDay,
    ]);
    const at = (asOf: string) =>
      getEffectiveHistoricalPlanDay({
        batches: [legacy, empty, linked, unlinked],
        userDayDate: "2026-08-20",
        asOf,
      });
    const first = at("2026-08-19T23:00:00.000Z");
    const second = at("2026-08-20T23:00:00.000Z");
    const third = at("2026-08-21T23:00:00.000Z");
    const fourth = at("2026-08-22T23:00:00.000Z");
    expect(
      first.status === "available" && historicalGoalProvenanceCoverage(first.day.occurrences[0]!),
    ).toBe("unavailableLegacy");
    expect(second.status === "available" && second.day.occurrences[0]!.goals).toEqual([]);
    expect(third.status === "available" && third.day.occurrences[0]!.goals?.[0]?.title).toBe(
      "Goal",
    );
    expect(fourth.status === "available" && fourth.day.occurrences[0]!.goals).toEqual([]);
    expect(legacy.days[0]!.occurrences[0]!.goals).toBeUndefined();
  });
  it("is order-independent and excludes publication identity/time", () => {
    const first = day();
    const secondOccurrence = structuredClone(first.occurrences[0]!);
    secondOccurrence.reference = reference("2026-08-20", INC2);
    secondOccurrence.title = "Second";
    first.occurrences.push(secondOccurrence);
    const reversed = structuredClone(first);
    reversed.occurrences.reverse();
    expect(historicalPlanDayFingerprint(first)).toBe(historicalPlanDayFingerprint(reversed));
    expect(areHistoricalPlanDaysSemanticallyEqual(first, reversed)).toBe(true);
    expect(historicalPlanDayFingerprint(first)).not.toContain(ID1);
  });
  it.each(["title", "interval", "state", "added", "removed"])(
    "detects meaningful %s changes",
    (kind) => {
      const candidate = day();
      if (kind === "title") candidate.occurrences[0]!.title = "New";
      if (kind === "interval")
        (candidate.occurrences[0]!.plan as { endsAt: string }).endsAt = "2026-08-20T22:00:00.000Z";
      if (kind === "state") candidate.occurrences[0]!.plan = { state: "omitted" };
      if (kind === "added") {
        const extra = structuredClone(candidate.occurrences[0]!);
        extra.reference = reference("2026-08-20", INC2);
        candidate.occurrences.push(extra);
      }
      if (kind === "removed") candidate.occurrences = [];
      expect(
        classifyPublicationCandidate(
          [batch()],
          batch(ID2, "2026-08-19T13:00:00.000Z", [candidate]),
        ),
      ).toBe("meaningfulPublication");
    },
  );
  it("deduplicates an entirely identical batch without allocation or mutation", () => {
    const existing = [batch()];
    const candidate = batch(ID2, "2026-08-19T13:00:00.000Z");
    expect(classifyPublicationCandidate(existing, candidate)).toBe("identicalNoOp");
    const result = appendPlanPublicationBatch(existing, candidate);
    expect(result.status).toBe("identicalNoOp");
    expect(existing).toHaveLength(1);
  });
  it("appends a full mixed batch when any requested day changes", () => {
    const original = batch(ID1, "2026-08-19T12:00:00.000Z", [
      day(),
      day("2026-08-21", { occurrences: [] }),
    ]);
    original.range.endUserDayDate = "2026-08-21";
    const changed = day("2026-08-21", { occurrences: [] });
    changed.weekStartsOn = "sunday";
    const candidate = batch(ID2, "2026-08-19T13:00:00.000Z", [day(), changed]);
    candidate.range.endUserDayDate = "2026-08-21";
    const result = appendPlanPublicationBatch([original], candidate);
    expect(result.status).toBe("appended");
    if (result.status === "appended") expect(result.batches[1]!.days).toHaveLength(2);
  });
  it("selects latest at explicit asOf and preserves removal by absence", () => {
    const removed = batch(ID2, "2026-08-19T13:00:00.000Z", [
      day("2026-08-20", { occurrences: [] }),
    ]);
    expect(
      getEffectiveHistoricalPlanDay({
        batches: [removed, batch()],
        userDayDate: "2026-08-20",
        asOf: "2026-08-19T12:30:00.000Z",
      }).status,
    ).toBe("available");
    const later = getEffectiveHistoricalPlanDay({
      batches: [removed, batch()],
      userDayDate: "2026-08-20",
      asOf: "2026-08-19T14:00:00.000Z",
    });
    expect(later.status === "available" && later.day.occurrences).toHaveLength(0);
  });
  it("returns explicit gaps in day and range projections", () => {
    expect(
      getEffectiveHistoricalPlanDay({
        batches: [],
        userDayDate: "2026-08-20",
        asOf: "2026-08-20T00:00:00.000Z",
      }).status,
    ).toBe("unavailableNoPublication");
    const range = getEffectiveHistoricalPlanRange({
      batches: [batch()],
      startUserDayDate: "2026-08-20",
      endUserDayDate: "2026-08-21",
      asOf: "2026-08-20T00:00:00.000Z",
    });
    expect(range.status === "projected" && range.missingDays).toEqual(["2026-08-21"]);
  });
  it("rejects non-monotonic append and does not read current clock", () => {
    const now = vi.spyOn(Date, "now");
    expect(
      appendPlanPublicationBatch([batch()], batch(ID2, "2026-08-19T11:00:00.000Z")).status,
    ).toBe("nonMonotonicPublicationTime");
    expect(now).not.toHaveBeenCalled();
    now.mockRestore();
  });
  it("returns clone-isolated projections", () => {
    const source = batch();
    const result = getEffectiveHistoricalPlanDay({
      batches: [source],
      userDayDate: "2026-08-20",
      asOf: "2026-08-20T00:00:00.000Z",
    });
    if (result.status !== "available") throw new Error("expected available");
    result.day.occurrences[0]!.title = "mutated";
    expect(source.days[0]!.occurrences[0]!.title).toBe("Shift");
  });
});
