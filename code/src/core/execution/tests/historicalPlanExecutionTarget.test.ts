import { describe, expect, it } from "vitest";
import type { DurableOccurrenceReference } from "../../occurrences/durableOccurrenceReference.js";
import type {
  HistoricalPlanContext,
  HistoricalPlanDayPublicationV1,
} from "../../historicalPlan/historicalPlan.js";
import { materializeHistoricalPlanExecutionTarget } from "../historicalPlanExecutionTarget.js";

const reference = {
  version: 1,
  sourceKind: "work",
  cycle: { id: "old-cycle", incarnationId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" },
  entry: {
    id: "old-segment",
    incarnationId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    kind: "segment",
  },
  shiftDefinition: { id: "old-shift", incarnationId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" },
  coordinate: { localStartDate: "2026-08-20", slot: 0 },
} as unknown as DurableOccurrenceReference;

function day(plan: HistoricalPlanContext): HistoricalPlanDayPublicationV1 {
  return {
    version: 1,
    userDayDate: "2026-08-20",
    dayBoundaryStartTime: "03:00",
    weekStartsOn: "monday",
    utcOffsetMinutes: -300,
    occurrences: [
      {
        version: 1,
        reference: structuredClone(reference),
        sourceFamily: "work",
        title: "Old shift",
        category: "work",
        plan,
      },
    ],
  };
}

describe("HistoricalPlan-backed execution target", () => {
  it.each([
    [
      "scheduled",
      {
        state: "scheduled",
        startsAt: "2026-08-20T13:00:00.000Z",
        endsAt: "2026-08-20T21:00:00.000Z",
      },
    ],
    ["unplaced", { state: "unplaced" }],
    ["omitted", { state: "omitted" }],
    ["blocked", { state: "blocked" }],
  ] as const)("materializes the reportable %s state from frozen authority", (_name, plan) => {
    const published = day(plan);
    const result = materializeHistoricalPlanExecutionTarget({
      day: published,
      occurrence: published.occurrences[0]!,
    });
    expect(result).toEqual({
      status: "materialized",
      target: {
        reference,
        snapshot: {
          sourceFamily: "work",
          title: "Old shift",
          category: "work",
          userDay: { date: "2026-08-20", dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
          plan,
        },
      },
    });
  });

  it("is clone-isolated and needs no current Active, Profile, or Preview", () => {
    const published = day({ state: "unplaced" });
    const result = materializeHistoricalPlanExecutionTarget({
      day: published,
      occurrence: published.occurrences[0]!,
    });
    expect(result.status).toBe("materialized");
    if (result.status !== "materialized") return;
    (
      result.target.reference as Extract<DurableOccurrenceReference, { sourceKind: "work" }>
    ).cycle.incarnationId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd" as never;
    result.target.snapshot.title = "Changed";
    expect(published.occurrences[0]!.reference).toEqual(reference);
    expect(published.occurrences[0]!.title).toBe("Old shift");
  });

  it("preserves the old incarnation after deletion/recreation and a restart or Backup V3 JSON roundtrip", () => {
    const durableDay = JSON.parse(
      JSON.stringify(day({ state: "omitted" })),
    ) as HistoricalPlanDayPublicationV1;
    const result = materializeHistoricalPlanExecutionTarget({
      day: durableDay,
      occurrence: durableDay.occurrences[0]!,
    });
    expect(result.status).toBe("materialized");
    if (result.status !== "materialized") return;
    expect(result.target.reference).toEqual(reference);
    expect(
      (result.target.reference as Extract<DurableOccurrenceReference, { sourceKind: "work" }>).cycle
        .incarnationId,
    ).toBe("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    expect(result.target.snapshot).toMatchObject({
      title: "Old shift",
      plan: { state: "omitted" },
    });
  });
});
