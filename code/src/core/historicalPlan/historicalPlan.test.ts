import { describe, expect, it, vi } from "vitest";
import type { DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import {
  HISTORICAL_PLAN_DAY_PUBLICATION_VERSION, HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION,
  HISTORICAL_PLAN_SURFACE_VERSION, PLAN_PUBLICATION_BATCH_VERSION, createPlanPublicationBatch,
  isPlanPublicationBatchId, type HistoricalPlanDayPublicationV1, type PlanPublicationBatchV1,
} from "./historicalPlan.js";
import { areHistoricalPlanDaysSemanticallyEqual, historicalPlanDayFingerprint } from "./historicalPlanFingerprint.js";
import { appendPlanPublicationBatch, classifyPublicationCandidate, getEffectiveHistoricalPlanDay, getEffectiveHistoricalPlanRange } from "./historicalPlanProjection.js";
import { validateHistoricalPlanCollection, validatePlanPublicationBatch } from "./historicalPlanValidation.js";

const ID1 = "11111111-1111-4111-8111-111111111111";
const ID2 = "22222222-2222-4222-8222-222222222222";
const INC1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const INC2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function reference(date: LocalDateString = "2026-08-20", incarnationId = INC1): DurableOccurrenceReference {
  return { version: 1, sourceKind: "work", cycle: { id: "cycle", incarnationId },
    entry: { id: "entry", incarnationId: INC1, kind: "segment" }, shiftDefinition: { id: "shift", incarnationId: INC1 },
    coordinate: { localStartDate: date, slot: 0 } } as DurableOccurrenceReference;
}
function day(date: LocalDateString = "2026-08-20", overrides: Partial<HistoricalPlanDayPublicationV1> = {}): HistoricalPlanDayPublicationV1 {
  return { version: HISTORICAL_PLAN_DAY_PUBLICATION_VERSION, userDayDate: date,
    dayBoundaryStartTime: "03:00", weekStartsOn: "monday", utcOffsetMinutes: -300,
    occurrences: [{ version: HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION, reference: reference(date),
      sourceFamily: "work", title: "Shift", category: "work",
      plan: { state: "scheduled", startsAt: `${date}T13:00:00.000Z`, endsAt: `${date}T21:00:00.000Z` } }], ...overrides };
}
function batch(id = ID1, publishedAt = "2026-08-19T12:00:00.000Z", days = [day()]): PlanPublicationBatchV1 {
  return { surfaceVersion: HISTORICAL_PLAN_SURFACE_VERSION, version: PLAN_PUBLICATION_BATCH_VERSION, id,
    publishedAt, range: { startUserDayDate: days[0]!.userDayDate, endUserDayDate: days[days.length - 1]!.userDayDate }, days } as PlanPublicationBatchV1;
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
    const input = { range: { startUserDayDate: "2026-08-20" as LocalDateString, endUserDayDate: "2026-08-21" as LocalDateString }, days: [second, day()] };
    const result = createPlanPublicationBatch(input, { allocateBatchId: () => ID1 as never, now: () => "2026-08-19T12:00:00.000Z" });
    expect(result.status).toBe("created");
    if (result.status !== "created") return;
    expect(result.batch.days.map((value) => value.userDayDate)).toEqual(["2026-08-20", "2026-08-21"]);
    input.days[0]!.weekStartsOn = "friday";
    expect(result.batch.days[1]!.weekStartsOn).toBe("monday");
  });
  it("returns allocationFailure without throwing", () => {
    expect(createPlanPublicationBatch({ range: { startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-20" }, days: [day()] },
      { allocateBatchId: () => { throw new Error("no entropy"); } }).status).toBe("allocationFailure");
  });
});

describe("HistoricalPlan V1 strict validation", () => {
  it("accepts complete batches including explicit empty days and JSON roundtrips", () => {
    const value = batch(ID1, "2026-08-19T12:00:00.000Z", [day("2026-08-20"), day("2026-08-21", { occurrences: [] })]);
    value.range.endUserDayDate = "2026-08-21";
    expect(validatePlanPublicationBatch(JSON.parse(JSON.stringify(value))).status).toBe("valid");
  });
  it.each([
    ["missingDay", () => ({ ...batch(), range: { startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-21" } })],
    ["extraDay", () => ({ ...batch(), days: [day("2026-08-19")], range: { startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-20" } })],
    ["duplicateDay", () => ({ ...batch(), days: [day(), day()] })],
  ])("rejects %s coverage", (code, make) => {
    const result = validatePlanPublicationBatch(make());
    expect(result.status === "invalid" && result.issues.some((issue) => issue.code === code)).toBe(true);
  });
  it("rejects unknown keys, invalid state shapes, intervals, family mismatches, and wrong-day references", () => {
    const cases: unknown[] = [];
    cases.push({ ...batch(), surprise: true });
    const nonScheduled = day(); (nonScheduled.occurrences[0]!.plan as object & { startsAt: string }).startsAt = "x"; cases.push(batch(ID1, undefined, [nonScheduled]));
    const interval = day(); interval.occurrences[0]!.plan = { state: "scheduled", startsAt: "2026-08-20T15:00:00.000Z", endsAt: "2026-08-20T14:00:00.000Z" }; cases.push(batch(ID1, undefined, [interval]));
    const family = day(); family.occurrences[0]!.sourceFamily = "template"; cases.push(batch(ID1, undefined, [family]));
    const wrongDay = day(); wrongDay.occurrences[0]!.reference = reference("2026-08-19"); cases.push(batch(ID1, undefined, [wrongDay]));
    expect(cases.every((value) => validatePlanPublicationBatch(value).status === "invalid")).toBe(true);
  });
  it("rejects duplicate references within and across days", () => {
    const sameDay = day(); sameDay.occurrences.push(structuredClone(sameDay.occurrences[0]!));
    expect(validatePlanPublicationBatch(batch(ID1, undefined, [sameDay])).status).toBe("invalid");
    const next = day("2026-08-21"); next.occurrences[0]!.reference = reference("2026-08-20");
    const value = batch(ID1, undefined, [day(), next]); value.range.endUserDayDate = "2026-08-21";
    const result = validatePlanPublicationBatch(value);
    expect(result.status === "invalid" && result.issues.some((issue) => issue.code === "crossDayDuplicateReference")).toBe(true);
  });
  it("rejects duplicate IDs and conflicting same-time authority", () => {
    expect(validateHistoricalPlanCollection([batch(), batch()]).status).toBe("invalid");
    const changed = day(); changed.occurrences[0]!.title = "Changed";
    const result = validateHistoricalPlanCollection([batch(ID1), batch(ID2, "2026-08-19T12:00:00.000Z", [changed])]);
    expect(result.status === "invalid" && result.issues.some((issue) => issue.code === "ambiguousPublishedAtTie")).toBe(true);
  });
});

describe("HistoricalPlan V1 fingerprints, dedup, and projection", () => {
  it("is order-independent and excludes publication identity/time", () => {
    const first = day(); const secondOccurrence = structuredClone(first.occurrences[0]!);
    secondOccurrence.reference = reference("2026-08-20", INC2); secondOccurrence.title = "Second";
    first.occurrences.push(secondOccurrence);
    const reversed = structuredClone(first); reversed.occurrences.reverse();
    expect(historicalPlanDayFingerprint(first)).toBe(historicalPlanDayFingerprint(reversed));
    expect(areHistoricalPlanDaysSemanticallyEqual(first, reversed)).toBe(true);
    expect(historicalPlanDayFingerprint(first)).not.toContain(ID1);
  });
  it.each(["title", "interval", "state", "added", "removed"])("detects meaningful %s changes", (kind) => {
    const candidate = day();
    if (kind === "title") candidate.occurrences[0]!.title = "New";
    if (kind === "interval") (candidate.occurrences[0]!.plan as { endsAt: string }).endsAt = "2026-08-20T22:00:00.000Z";
    if (kind === "state") candidate.occurrences[0]!.plan = { state: "omitted" };
    if (kind === "added") { const extra = structuredClone(candidate.occurrences[0]!); extra.reference = reference("2026-08-20", INC2); candidate.occurrences.push(extra); }
    if (kind === "removed") candidate.occurrences = [];
    expect(classifyPublicationCandidate([batch()], batch(ID2, "2026-08-19T13:00:00.000Z", [candidate]))).toBe("meaningfulPublication");
  });
  it("deduplicates an entirely identical batch without allocation or mutation", () => {
    const existing = [batch()]; const candidate = batch(ID2, "2026-08-19T13:00:00.000Z");
    expect(classifyPublicationCandidate(existing, candidate)).toBe("identicalNoOp");
    const result = appendPlanPublicationBatch(existing, candidate);
    expect(result.status).toBe("identicalNoOp"); expect(existing).toHaveLength(1);
  });
  it("appends a full mixed batch when any requested day changes", () => {
    const original = batch(ID1, "2026-08-19T12:00:00.000Z", [day(), day("2026-08-21", { occurrences: [] })]); original.range.endUserDayDate = "2026-08-21";
    const changed = day("2026-08-21", { occurrences: [] }); changed.weekStartsOn = "sunday";
    const candidate = batch(ID2, "2026-08-19T13:00:00.000Z", [day(), changed]); candidate.range.endUserDayDate = "2026-08-21";
    const result = appendPlanPublicationBatch([original], candidate);
    expect(result.status).toBe("appended"); if (result.status === "appended") expect(result.batches[1]!.days).toHaveLength(2);
  });
  it("selects latest at explicit asOf and preserves removal by absence", () => {
    const removed = batch(ID2, "2026-08-19T13:00:00.000Z", [day("2026-08-20", { occurrences: [] })]);
    expect(getEffectiveHistoricalPlanDay({ batches: [removed, batch()], userDayDate: "2026-08-20", asOf: "2026-08-19T12:30:00.000Z" }).status).toBe("available");
    const later = getEffectiveHistoricalPlanDay({ batches: [removed, batch()], userDayDate: "2026-08-20", asOf: "2026-08-19T14:00:00.000Z" });
    expect(later.status === "available" && later.day.occurrences).toHaveLength(0);
  });
  it("returns explicit gaps in day and range projections", () => {
    expect(getEffectiveHistoricalPlanDay({ batches: [], userDayDate: "2026-08-20", asOf: "2026-08-20T00:00:00.000Z" }).status).toBe("unavailableNoPublication");
    const range = getEffectiveHistoricalPlanRange({ batches: [batch()], startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-21", asOf: "2026-08-20T00:00:00.000Z" });
    expect(range.status === "projected" && range.missingDays).toEqual(["2026-08-21"]);
  });
  it("rejects non-monotonic append and does not read current clock", () => {
    const now = vi.spyOn(Date, "now");
    expect(appendPlanPublicationBatch([batch()], batch(ID2, "2026-08-19T11:00:00.000Z")).status).toBe("nonMonotonicPublicationTime");
    expect(now).not.toHaveBeenCalled(); now.mockRestore();
  });
  it("returns clone-isolated projections", () => {
    const source = batch(); const result = getEffectiveHistoricalPlanDay({ batches: [source], userDayDate: "2026-08-20", asOf: "2026-08-20T00:00:00.000Z" });
    if (result.status !== "available") throw new Error("expected available");
    result.day.occurrences[0]!.title = "mutated";
    expect(source.days[0]!.occurrences[0]!.title).toBe("Shift");
  });
});
