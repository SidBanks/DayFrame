import { describe, expect, it } from "vitest";
import type {
  ExecutionRecordId,
  ExecutionRecordV1,
  ExecutionSubjectId,
} from "../execution/executionRecord.js";
import type { GoalV1 } from "../goals/goal.js";
import type {
  HistoricalPlanContext,
  HistoricalPlanDayPublicationV1,
} from "../historicalPlan/historicalPlan.js";
import type { DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import type { HistoricalPlanEvidenceV1 } from "./historicalPlanCoverage.js";
import {
  GOAL_ACTIVITY_POLICY_V1,
  projectGoalActivityV1,
  type GoalActivityQueryV1,
} from "./goalActivity.js";

const goalId = "11111111-1111-4111-8111-111111111111" as never;
const otherId = "22222222-2222-4222-8222-222222222222" as never;
const goal: GoalV1 = {
  version: 1,
  id: goalId,
  revision: 4,
  title: "Certification",
  status: "active",
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-20T00:00:00.000Z",
  targetDate: "2027-01-01",
  links: [],
};
const query: GoalActivityQueryV1 = {
  policy: GOAL_ACTIVITY_POLICY_V1,
  goalId,
  startUserDayDate: "2026-08-20",
  endUserDayDate: "2026-08-21",
  evaluationAsOf: "2026-08-23T00:00:00.000Z",
};
const ref = (slot: number) =>
  ({
    version: 1,
    sourceKind: "template",
    template: { id: "template", incarnationId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" },
    recurrence: { id: "recurrence", incarnationId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    coordinate: { frequency: "daily", scopeKind: "userDay", userDayDate: "2026-08-20", slot },
  }) as unknown as DurableOccurrenceReference;
const occurrence = (
  slot: number,
  plan: HistoricalPlanContext = {
    state: "scheduled",
    startsAt: `2026-08-20T${String(10 + slot).padStart(2, "0")}:00:00.000Z`,
    endsAt: `2026-08-20T${String(11 + slot).padStart(2, "0")}:00:00.000Z`,
  },
  membership: "linked" | "unlinked" | "legacy" = "linked",
) => ({
  version: 1 as const,
  reference: ref(slot),
  sourceFamily: "template" as const,
  title: `Item ${slot}`,
  category: "fitness" as const,
  plan,
  ...(membership === "legacy"
    ? {}
    : {
        goals:
          membership === "linked"
            ? [
                {
                  version: 1 as const,
                  goalId,
                  goalRevision: 2,
                  title: "Old title",
                  status: "active" as const,
                },
              ]
            : [],
      }),
});
const day = (
  date: LocalDateString,
  occurrences: HistoricalPlanDayPublicationV1["occurrences"] = [],
): HistoricalPlanEvidenceV1 => ({
  batchId: `batch-${date}`,
  publishedAt: "2026-08-22T00:00:00.000Z",
  day: {
    version: 1,
    userDayDate: date,
    dayBoundaryStartTime: "03:00",
    weekStartsOn: "monday",
    utcOffsetMinutes: -300,
    occurrences,
  },
});
const id = (kind: number, slot: number) =>
  `00000000-0000-4${kind}00-8${kind}00-${String(slot).padStart(12, "0")}`;
const assertion = (
  slot: number,
  outcome: "completed" | "partial" | "skipped",
  replaces?: ExecutionRecordId,
): ExecutionRecordV1 => ({
  version: 1,
  id: id(0, slot + (replaces ? 6 : 0)) as ExecutionRecordId,
  subjectId: id(1, slot) as ExecutionSubjectId,
  kind: "assertion",
  provenance: { kind: "userReported" },
  recordedAt: replaces ? "2026-08-22T15:00:00.000Z" : "2026-08-22T12:00:00.000Z",
  subject: { kind: "planned", reference: ref(slot) },
  snapshot: {
    sourceFamily: "template",
    title: `Item ${slot}`,
    category: "fitness",
    userDay: { date: "2026-08-20", dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
    plan: {
      state: "scheduled",
      startsAt: "2026-08-20T10:00:00.000Z",
      endsAt: "2026-08-20T11:00:00.000Z",
    },
  },
  outcome,
  ...(replaces ? { replacesRecordId: replaces } : {}),
});
const project = (
  days: HistoricalPlanEvidenceV1[],
  records: ExecutionRecordV1[] = [],
  missing: LocalDateString[] = [],
  available = true,
) =>
  projectGoalActivityV1({
    query,
    goal,
    days,
    executionRecords: records,
    missingUserDayDates: missing,
    executionEvidenceAvailable: available,
  });

describe("Goal Activity V1", () => {
  it("validates policy, Goal ID, range, and cutoff", () =>
    expect(
      projectGoalActivityV1({
        query: {
          ...query,
          goalId: "bad" as never,
          startUserDayDate: "bad" as never,
          evaluationAsOf: "now",
        },
        goal,
        days: [],
        missingUserDayDates: [],
        executionRecords: [],
      }),
    ).toEqual({
      status: "invalidQuery",
      issues: ["invalidStartUserDayDate", "invalidEvaluationAsOf", "invalidGoalId"],
    }));
  it("conserves all planning and execution categories", () => {
    const plans: HistoricalPlanContext[] = [
      {
        state: "scheduled",
        startsAt: "2026-08-20T10:00:00.000Z",
        endsAt: "2026-08-20T11:00:00.000Z",
      },
      { state: "unplaced" },
      { state: "omitted" },
      { state: "blocked" },
    ];
    const result = project(
      [
        day(
          "2026-08-20",
          plans.map((plan, index) => occurrence(index, plan)),
        ),
        day("2026-08-21"),
      ],
      [assertion(0, "partial")],
    );
    expect(result).toMatchObject({
      status: "available",
      planCoverage: { status: "complete" },
      goalLinkCoverage: { status: "complete" },
      planningDistribution: {
        linkedIntendedOccurrenceCount: 4,
        scheduled: 1,
        unplaced: 1,
        omitted: 1,
        blocked: 1,
      },
      executionDistribution: { linkedScheduledOccurrenceCount: 1, partial: 1 },
      reportingCoverage: { status: "complete" },
    });
  });
  it("distinguishes mixed legacy, known unlinked, and known linked evidence", () => {
    const result = project([
      day("2026-08-20", [
        occurrence(0, undefined, "legacy"),
        occurrence(1, undefined, "unlinked"),
        occurrence(2),
      ]),
      day("2026-08-21"),
    ]);
    expect(result).toMatchObject({
      status: "partialCoverage",
      goalLinkCoverage: {
        status: "incompleteCoverage",
        eligibleOccurrenceCount: 3,
        availableOccurrenceCount: 2,
        unavailableLegacyOccurrenceCount: 1,
      },
      planningDistribution: { linkedIntendedOccurrenceCount: 1 },
      provenance: {
        linked: [{ frozenGoal: { title: "Old title" } }],
        coverage: [{ reason: "goalProvenanceUnavailableLegacy" }, { reason: "knownUnlinked" }],
      },
    });
  });
  it("returns known zero for complete Goal-aware unlinked history and unavailable for entirely legacy history", () => {
    expect(
      project([day("2026-08-20", [occurrence(0, undefined, "unlinked")]), day("2026-08-21")]),
    ).toMatchObject({
      status: "available",
      goalLinkCoverage: { status: "complete" },
      planningDistribution: { status: "available", linkedIntendedOccurrenceCount: 0 },
      executionDistribution: { status: "notApplicable" },
      advisories: ["noLinkedActivity"],
    });
    expect(
      project([day("2026-08-20", [occurrence(0, undefined, "legacy")]), day("2026-08-21")]),
    ).toMatchObject({
      status: "unavailable",
      goalLinkCoverage: { status: "unavailable" },
      planningDistribution: { status: "unavailable" },
    });
  });
  it("keeps published-empty known zero distinct from missing plan coverage", () => {
    expect(project([day("2026-08-20"), day("2026-08-21")])).toMatchObject({
      status: "available",
      planCoverage: { status: "complete", publishedEmptyDayCount: 2 },
      goalLinkCoverage: { status: "complete", eligibleOccurrenceCount: 0 },
    });
    expect(project([], [], ["2026-08-20", "2026-08-21"])).toMatchObject({
      status: "unavailable",
      planCoverage: { status: "unavailable" },
    });
  });
  it("supports multi-Goal membership independently and ignores current links/title", () => {
    const shared = occurrence(0);
    shared.goals!.push({
      version: 1,
      goalId: otherId,
      goalRevision: 1,
      title: "Other",
      status: "active",
    });
    const changed = {
      ...goal,
      title: "Current rename",
      links: [
        {
          sourceKind: "blockTemplate" as const,
          id: "different",
          incarnationId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" as never,
        },
      ],
    };
    const result = projectGoalActivityV1({
      query,
      goal: changed,
      days: [day("2026-08-20", [shared]), day("2026-08-21")],
      missingUserDayDates: [],
      executionRecords: [],
    });
    expect(result).toMatchObject({
      goalContext: { title: "Current rename" },
      planningDistribution: { linkedIntendedOccurrenceCount: 1 },
      provenance: { linked: [{ frozenGoal: { title: "Old title" } }] },
    });
  });
  it("uses correction heads, retractions, and explicit cutoff", () => {
    const first = assertion(0, "partial");
    const corrected = assertion(0, "completed", first.id);
    const before = projectGoalActivityV1({
      query: { ...query, evaluationAsOf: "2026-08-22T13:00:00.000Z" },
      goal,
      days: [day("2026-08-20", [occurrence(0)]), day("2026-08-21")],
      missingUserDayDates: [],
      executionRecords: [corrected, first],
    });
    expect(before).toMatchObject({ executionDistribution: { partial: 1, completed: 0 } });
    expect(
      project([day("2026-08-20", [occurrence(0)]), day("2026-08-21")], [corrected, first]),
    ).toMatchObject({ executionDistribution: { completed: 1, partial: 0 } });
  });
  it("keeps planning evidence when execution is unavailable and is deterministic/clone-isolated", () => {
    const days = [day("2026-08-20", [occurrence(1), occurrence(0)]), day("2026-08-21")];
    const first = project(days, [], [], false);
    const second = project([...days].reverse(), [], [], false);
    expect(first).toEqual(second);
    expect(first).toMatchObject({
      status: "partialCoverage",
      planningDistribution: { status: "available", scheduled: 2 },
      executionDistribution: { status: "unavailable" },
      reportingCoverage: { status: "unavailable" },
      advisories: ["executionEvidenceUnavailable"],
    });
    if (first.status === "invalidQuery") return;
    first.provenance.linked[0]!.title = "changed";
    expect(project(days, [], [], false)).toEqual(second);
  });
});
