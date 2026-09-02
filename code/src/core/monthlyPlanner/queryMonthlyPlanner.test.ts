import { describe, expect, it } from "vitest";

import type { ShiftCycle } from "../cycles/types.js";
import type { SourceIncarnationId } from "../authored/sourceIncarnation.js";
import type { ActiveManualCalendarEvent, DayFramePreview } from "../../state/types.js";
import {
  projectLabelToDisplayedMonth,
  queryMonthlyPlanner,
  shiftDisplayedMonth,
  takeMonthlyPlannerTokens,
  type MonthlyPlannerQueryInput,
} from "./queryMonthlyPlanner.js";

const TEMPLATE_INC = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const RECURRENCE_INC = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const EVENT_INC = "cccccccc-cccc-4ccc-8ccc-cccccccccccc" as SourceIncarnationId;

function emptyPreview(input?: Partial<DayFramePreview>): DayFramePreview {
  return {
    rangeStartDate: "2026-08-01",
    rangeEndDate: "2026-08-31",
    planningWindowStart: new Date(2026, 7, 1, 4),
    planningWindowEnd: new Date(2026, 8, 1, 4),
    generatedAt: "2026-08-01T00:00:00.000Z",
    isStale: false,
    result: {
      generatedWorkBlocks: [],
      blockCandidates: [],
      scheduledBlocks: [],
      unplacedCandidates: [],
      frictionPoints: [],
      planDecisionResults: [],
    },
    ...input,
  };
}

function baseInput(overrides?: Partial<MonthlyPlannerQueryInput>): MonthlyPlannerQueryInput {
  return {
    displayedMonth: "2026-08",
    selectedLabel: "2026-08-10",
    evaluationInstant: new Date(2026, 7, 10, 2),
    temporal: {
      defaultSchedulingPreferences: {
        dayBoundaryStartTime: "04:00",
        weekStartsOn: "sunday",
      },
      shiftCycles: [],
    },
    planningRange: { startDate: "2026-08-01", endDate: "2026-08-31" },
    preview: emptyPreview(),
    manualEvents: [],
    currentCommitmentSources: {
      templates: [{ id: "template", incarnationId: TEMPLATE_INC }],
      recurrences: [{ id: "recurrence", incarnationId: RECURRENCE_INC }],
    },
    ...overrides,
  };
}

function model(input = baseInput()) {
  const result = queryMonthlyPlanner(input);
  expect(result.kind).toBe("available");
  if (result.kind !== "available") throw new Error(result.reason);
  return result.model;
}

function transitionCycle(
  first: "sunday" | "monday",
  second: "sunday" | "monday",
  firstBoundary: "03:00" | "06:00" = "03:00",
  secondBoundary: "03:00" | "06:00" = "06:00",
): ShiftCycle {
  return {
    id: "cycle",
    userId: "user",
    name: "transition",
    type: "fixedSegments",
    mode: "manualSegments",
    startsOnDate: "2026-08-01",
    endsOnDate: "2026-08-31",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    segments: [
      {
        id: "first",
        shiftCycleId: "cycle",
        shiftDefinitionId: "shift",
        startsOnDate: "2026-08-01",
        endsOnDate: "2026-08-14",
        schedulePreferences: { weekStartsOn: first, dayBoundaryStartTime: firstBoundary },
      },
      {
        id: "second",
        shiftCycleId: "cycle",
        shiftDefinitionId: "shift",
        startsOnDate: "2026-08-15",
        endsOnDate: "2026-08-31",
        schedulePreferences: { weekStartsOn: second, dayBoundaryStartTime: secondBoundary },
      },
    ],
  };
}

describe("queryMonthlyPlanner", () => {
  it("rejects malformed month, label, instant, range, and impossible Preview range", () => {
    expect(queryMonthlyPlanner(baseInput({ displayedMonth: "2026-13" })).kind).toBe("invalidQuery");
    expect(queryMonthlyPlanner(baseInput({ selectedLabel: "2026-02-31" })).kind).toBe(
      "invalidQuery",
    );
    expect(queryMonthlyPlanner(baseInput({ evaluationInstant: new Date("invalid") })).kind).toBe(
      "invalidQuery",
    );
    expect(
      queryMonthlyPlanner(
        baseInput({ planningRange: { startDate: "2026-09-01", endDate: "2026-08-01" } }),
      ).kind,
    ).toBe("invalidQuery");
    expect(
      queryMonthlyPlanner(baseInput({ preview: emptyPreview({ rangeStartDate: "2026-09-01" }) }))
        .kind,
    ).toBe("invalidQuery");
  });

  it("returns explicit protected and unavailable result branches", () => {
    expect(queryMonthlyPlanner(baseInput({ availability: "protected" }))).toEqual({
      kind: "protected",
      reason: "planningAuthorityProtected",
    });
    expect(queryMonthlyPlanner(baseInput({ availability: "unavailable" }))).toEqual({
      kind: "unavailable",
      reason: "planningAuthorityUnavailable",
    });
  });

  it("builds a contiguous Sunday-first 42-cell grid with explicit adjacent cells", () => {
    const result = model();
    expect(result.displayWeekAnchor).toBe("sunday");
    expect(result.weekdayColumns.map((column) => column.weekday)).toEqual([
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ]);
    expect(result.cells).toHaveLength(42);
    expect(result.gridStartLabel).toBe("2026-07-26");
    expect(result.gridEndLabel).toBe("2026-09-05");
    expect(result.cells[0]).toMatchObject({ membership: "previous", isInDisplayedMonth: false });
    expect(result.cells.at(-1)).toMatchObject({ membership: "next", isInDisplayedMonth: false });
    for (let index = 1; index < result.cells.length; index += 1) {
      const previous = new Date(`${result.cells[index - 1]!.label}T12:00:00`);
      previous.setDate(previous.getDate() + 1);
      expect(result.cells[index]!.label).toBe(previous.toISOString().slice(0, 10));
    }
  });

  it("uses 35 cells for a five-row month and keeps every core label once", () => {
    const result = model(
      baseInput({ displayedMonth: "2026-02", selectedLabel: null, preview: null }),
    );
    expect(result.cells).toHaveLength(35);
    expect(result.cells.filter((cell) => cell.isInDisplayedMonth)).toHaveLength(28);
    expect(new Set(result.cells.map((cell) => cell.label)).size).toBe(35);
  });

  it("anchors Monday columns independently of canonical per-label transitions", () => {
    const result = model(
      baseInput({
        selectedLabel: "2026-08-20",
        temporal: {
          defaultSchedulingPreferences: { dayBoundaryStartTime: "04:00", weekStartsOn: "sunday" },
          shiftCycles: [transitionCycle("monday", "sunday")],
        },
      }),
    );
    expect(result.displayWeekAnchor).toBe("monday");
    expect(result.weekdayColumns[0]!.weekday).toBe("monday");
    expect(result.selectedDay?.weekStartTransition).toEqual({
      differsFromDisplayAnchor: true,
      displayWeekAnchor: "monday",
      selectedDayWeekStart: "sunday",
    });
  });

  it("keeps Sunday columns during a Sunday to Monday transition", () => {
    const result = model(
      baseInput({
        selectedLabel: "2026-08-20",
        temporal: {
          defaultSchedulingPreferences: { dayBoundaryStartTime: "04:00", weekStartsOn: "monday" },
          shiftCycles: [transitionCycle("sunday", "monday")],
        },
      }),
    );
    expect(result.displayWeekAnchor).toBe("sunday");
    expect(result.weekdayColumns[0]!.weekday).toBe("sunday");
    expect(result.selectedDay?.canonical.weekStartsOn).toBe("monday");
  });

  it("resolves variable-duration selected windows and transition metadata", () => {
    const result = model(
      baseInput({
        selectedLabel: "2026-08-14",
        temporal: {
          defaultSchedulingPreferences: { dayBoundaryStartTime: "04:00", weekStartsOn: "sunday" },
          shiftCycles: [transitionCycle("sunday", "monday", "03:00", "06:00")],
        },
      }),
    );
    expect(result.selectedDay?.canonical.durationMinutes).toBe(27 * 60);
    expect(result.selectedDay?.boundaryTransition).toMatchObject({
      currentBoundaryStartTime: "03:00",
      nextBoundaryStartTime: "06:00",
      differsFromNext: true,
    });
  });

  it("marks the canonical previous user-day before the civil day's boundary", () => {
    const result = model();
    expect(result.currentUserDayLabel).toBe("2026-08-09");
    expect(result.cells.find((cell) => cell.label === "2026-08-09")?.isCurrentUserDay).toBe(true);
    expect(result.selectedDay?.isCurrentUserDay).toBe(false);
  });

  it("distinguishes covered fresh empty, uncovered, stale, full, partial, and no coverage", () => {
    const fresh = model();
    expect(fresh.cells.find((cell) => cell.label === "2026-08-10")?.coverage).toEqual({
      kind: "coveredFresh",
      generatedEmpty: true,
    });
    expect(fresh.cells.find((cell) => cell.label === "2026-09-01")?.coverage).toEqual({
      kind: "uncovered",
    });
    expect(fresh.status).toBe("fullyCoveredFresh");

    const partial = model(
      baseInput({
        preview: emptyPreview({ rangeStartDate: "2026-08-10", rangeEndDate: "2026-08-20" }),
      }),
    );
    expect(partial.status).toBe("partialCoverage");

    const stale = model(baseInput({ preview: emptyPreview({ isStale: true }) }));
    expect(stale.status).toBe("fullyCoveredStale");
    expect(stale.cells.find((cell) => cell.label === "2026-08-10")?.coverage.kind).toBe(
      "coveredStale",
    );
    expect(model(baseInput({ preview: null })).status).toBe("noCoverage");
  });

  it("projects all-day and timed Events from current authored authority exactly once", () => {
    const events: ActiveManualCalendarEvent[] = [
      {
        id: "all-day",
        incarnationId: EVENT_INC,
        title: "Holiday",
        userDayDate: "2026-08-10",
        allDay: true,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "timed",
        incarnationId: EVENT_INC,
        title: "Overnight",
        userDayDate: "2026-08-10",
        allDay: false,
        startTime: "20:00",
        endTime: "20:00",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ];
    const result = model(baseInput({ manualEvents: events }));
    const cell = result.cells.find((value) => value.label === "2026-08-10")!;
    expect(cell.evidence.map((item) => item.kind)).toEqual(["allDayEvent", "timedEvent"]);
    expect(cell.evidence[0]?.target).toMatchObject({
      kind: "event",
      eventId: "all-day",
      eventIncarnationId: EVENT_INC,
    });
    const timedEvent = cell.evidence[1]!;
    expect(timedEvent.endsAt!.getTime() - timedEvent.startsAt!.getTime()).toBe(24 * 60 * 60 * 1000);
    expect(
      result.cells.flatMap((value) => value.evidence).filter((item) => item.id.includes("all-day")),
    ).toHaveLength(1);
  });

  it("projects Work, Sleep, Commitments, exact identities, and one authoritative owning cell", () => {
    const preview = emptyPreview();
    preview.result.generatedWorkBlocks.push({
      id: "work-1",
      shiftDefinitionId: "shift",
      shiftCycleId: "cycle",
      shiftSegmentId: "segment",
      userId: "user",
      title: "Work",
      startsAt: new Date(2026, 7, 10, 8),
      endsAt: new Date(2026, 7, 10, 16),
      startDate: "2026-08-10",
      endDate: "2026-08-10",
      userDayDate: "2026-08-10",
      crossesMidnight: false,
    });
    for (const [id, category, start] of [
      ["sleep-1", "sleep", 22],
      ["commitment-1", "fitness", 17],
    ] as const) {
      preview.result.scheduledBlocks.push({
        id,
        userId: "user",
        templateId: "template",
        source: "template",
        title: category,
        category,
        startsAt: new Date(2026, 7, 10, start),
        endsAt: new Date(2026, 7, 10, start + 1),
        userDayDate: "2026-08-10",
        userWeekStartDate: "2026-08-09",
        priority: 2,
        status: "planned",
        externalResources: [],
        commitmentNavigationIdentity: {
          templateId: "template",
          templateIncarnationId: TEMPLATE_INC,
          recurrenceId: "recurrence",
          recurrenceIncarnationId: RECURRENCE_INC,
        },
      });
    }
    const result = model(baseInput({ preview }));
    const evidence = result.cells.find((cell) => cell.label === "2026-08-10")!.evidence;
    expect(evidence.map((item) => item.kind)).toEqual(["work", "commitment", "sleep"]);
    expect(evidence.find((item) => item.kind === "work")?.target).toEqual({ kind: "work" });
    expect(evidence.find((item) => item.kind === "commitment")?.target).toMatchObject({
      kind: "commitment",
      availability: "current",
      templateIncarnationId: TEMPLATE_INC,
      recurrenceIncarnationId: RECURRENCE_INC,
    });
    expect(
      result.cells.flatMap((cell) => cell.evidence).filter((item) => item.id.includes("sleep-1")),
    ).toHaveLength(1);
  });

  it("marks removed or recreated Commitment sources stale without retargeting", () => {
    const preview = emptyPreview();
    preview.result.scheduledBlocks.push({
      id: "old",
      userId: "user",
      templateId: "template",
      source: "template",
      title: "Old source",
      category: "fitness",
      startsAt: new Date(2026, 7, 10, 10),
      endsAt: new Date(2026, 7, 10, 11),
      userDayDate: "2026-08-10",
      userWeekStartDate: "2026-08-09",
      priority: 2,
      status: "planned",
      externalResources: [],
      commitmentNavigationIdentity: {
        templateId: "template",
        templateIncarnationId: TEMPLATE_INC,
        recurrenceId: "recurrence",
        recurrenceIncarnationId: RECURRENCE_INC,
      },
    });
    const result = model(
      baseInput({
        preview,
        currentCommitmentSources: {
          templates: [{ id: "template", incarnationId: "replacement" }],
          recurrences: [],
        },
      }),
    );
    expect(result.selectedDay?.occurrences[0]?.target).toMatchObject({
      availability: "staleSource",
      templateIncarnationId: TEMPLATE_INC,
      recurrenceIncarnationId: RECURRENCE_INC,
    });
  });

  it("projects friction and unplaced evidence without recommendation or capacity semantics", () => {
    const preview = emptyPreview();
    preview.result.unplacedCandidates.push({
      id: "candidate",
      userId: "user",
      templateId: "template",
      recurrenceId: "recurrence",
      recurrenceFrequency: "daily",
      title: "Read",
      category: "optional",
      placementType: "flexible",
      durationMinutes: 30,
      priority: 2,
      preferredWindow: "anyAvailable",
      rescheduleBehavior: "askUser",
      externalResources: [],
      userDayDate: "2026-08-10",
      userWeekStartDate: "2026-08-09",
      commitmentNavigationIdentity: {
        templateId: "template",
        templateIncarnationId: TEMPLATE_INC,
        recurrenceId: "recurrence",
        recurrenceIncarnationId: RECURRENCE_INC,
      },
    });
    preview.result.frictionPoints.push({
      id: "friction",
      userId: "user",
      severity: "warning",
      title: "Needs attention",
      message: "Could not place",
      affectedBlockIds: ["candidate"],
      suggestedFixes: [{ id: "fix", label: "Move Read", action: "moveBlock" }],
      canIgnore: true,
      ignored: false,
      resolved: false,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    });
    const result = model(baseInput({ preview }));
    expect(result.attention).toMatchObject({ frictionCount: 1, unplacedCount: 1 });
    expect(result.selectedDay?.friction[0]?.target).toEqual({
      kind: "friction",
      frictionPointId: "friction",
    });
    expect(result.selectedDay?.friction[0]).toMatchObject({
      message: "Could not place",
      resolutionOptions: [{ id: "fix", label: "Move Read" }],
    });
    expect(result.selectedDay?.unplaced[0]?.target.commitment).toMatchObject({
      availability: "current",
    });
    expect(JSON.stringify(result)).not.toMatch(/capacity|recommendation/i);
  });

  it("leaves ambiguous multi-day friction at Month level rather than guessing a cell", () => {
    const preview = emptyPreview();
    preview.result.generatedWorkBlocks.push(
      ...["2026-08-10", "2026-08-11"].map((userDayDate, index) => ({
        id: `work-${index}`,
        shiftDefinitionId: "shift",
        shiftCycleId: "cycle",
        shiftSegmentId: "segment",
        userId: "user",
        title: "Work",
        startsAt: new Date(2026, 7, 10 + index, 8),
        endsAt: new Date(2026, 7, 10 + index, 16),
        startDate: userDayDate as `2026-08-${number}`,
        endDate: userDayDate as `2026-08-${number}`,
        userDayDate: userDayDate as `2026-08-${number}`,
        crossesMidnight: false,
      })),
    );
    preview.result.frictionPoints.push({
      id: "ambiguous",
      userId: "user",
      severity: "warning",
      title: "Cross-day",
      message: "Cross-day",
      affectedBlockIds: ["work-0", "work-1"],
      suggestedFixes: [],
      canIgnore: true,
      ignored: false,
      resolved: false,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    });
    const result = model(baseInput({ preview }));
    expect(result.cells.flatMap((cell) => cell.friction)).toHaveLength(0);
    expect(result.attention.frictionCount).toBe(1);
  });

  it("is deterministic under input permutation and owns all returned mutable data", () => {
    const events: ActiveManualCalendarEvent[] = [
      {
        id: "z",
        incarnationId: EVENT_INC,
        title: "Zed",
        userDayDate: "2026-08-10",
        allDay: false,
        startTime: "10:00",
        endTime: "11:00",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "a",
        incarnationId: EVENT_INC,
        title: "Alpha",
        userDayDate: "2026-08-10",
        allDay: true,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ];
    const preview = emptyPreview();
    preview.result.scheduledBlocks.push(
      ...["z", "a"].map((id, index) => ({
        id: `scheduled-${id}`,
        userId: "user",
        templateId: "template",
        source: "template" as const,
        title: id,
        category: "fitness" as const,
        startsAt: new Date(2026, 7, 10, 14 - index),
        endsAt: new Date(2026, 7, 10, 15 - index),
        userDayDate: "2026-08-10" as const,
        userWeekStartDate: "2026-08-09" as const,
        priority: 2 as const,
        status: "planned" as const,
        externalResources: [],
        commitmentNavigationIdentity: {
          templateId: "template",
          templateIncarnationId: TEMPLATE_INC,
          recurrenceId: "recurrence",
          recurrenceIncarnationId: RECURRENCE_INC,
        },
      })),
    );
    preview.result.unplacedCandidates.push(
      ...["z", "a"].map((id) => ({
        id: `candidate-${id}`,
        userId: "user",
        templateId: "template",
        recurrenceId: "recurrence",
        recurrenceFrequency: "daily" as const,
        title: id,
        category: "optional" as const,
        placementType: "flexible" as const,
        durationMinutes: 30,
        priority: 2 as const,
        preferredWindow: "anyAvailable" as const,
        rescheduleBehavior: "askUser" as const,
        externalResources: [],
        userDayDate: "2026-08-10" as const,
        userWeekStartDate: "2026-08-09" as const,
      })),
    );
    preview.result.frictionPoints.push(
      ...["z", "a"].map((id) => ({
        id: `friction-${id}`,
        userId: "user",
        severity: "warning" as const,
        title: id,
        message: id,
        affectedBlockIds: [`candidate-${id}`],
        affectedUserDayDate: "2026-08-10" as const,
        suggestedFixes: [],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      })),
    );
    const reversedPreview = structuredClone(preview);
    reversedPreview.result.scheduledBlocks.reverse();
    reversedPreview.result.unplacedCandidates.reverse();
    reversedPreview.result.frictionPoints.reverse();
    const left = model(baseInput({ manualEvents: events, preview }));
    const right = model(
      baseInput({ manualEvents: [...events].reverse(), preview: reversedPreview }),
    );
    expect(left).toEqual(right);

    const sourceStart = events[0]!.startTime;
    left.cells[0]!.tokens.push(left.cells[0]!.tokens[0]!);
    left.cells.find((cell) => cell.label === "2026-08-10")!.evidence[0]!.title = "mutated";
    left.selectedDay!.occurrences[0]!.target.kind = "work";
    expect(events[0]!.startTime).toBe(sourceStart);
    expect(model(baseInput({ manualEvents: events, preview }))).toEqual(right);
  });

  it("provides deterministic overflow without viewport policy", () => {
    const tokens = model().cells[0]!.tokens;
    expect(takeMonthlyPlannerTokens(tokens, 0)).toEqual({
      visible: [],
      overflowCount: tokens.length,
    });
    expect(takeMonthlyPlannerTokens(tokens, tokens.length + 1).overflowCount).toBe(0);
    expect(() => takeMonthlyPlannerTokens(tokens, -1)).toThrow(RangeError);
  });

  it("provides pure clamped navigation helpers", () => {
    expect(shiftDisplayedMonth("2026-01", -1)).toBe("2025-12");
    expect(shiftDisplayedMonth("2026-12", 1)).toBe("2027-01");
    expect(projectLabelToDisplayedMonth("2026-01-31", "2026-02")).toBe("2026-02-28");
    expect(projectLabelToDisplayedMonth("2024-01-31", "2024-02")).toBe("2024-02-29");
  });

  it("keeps displayed month independent from planning range and Preview coverage", () => {
    const input = baseInput({
      displayedMonth: "2027-01",
      selectedLabel: "2027-01-15",
      preview: emptyPreview(),
    });
    const before = structuredClone(input.planningRange);
    const result = model(input);
    expect(result.cells.every((cell) => cell.coverage.kind === "uncovered")).toBe(true);
    expect(input.planningRange).toEqual(before);
    expect(result.planningRange).toEqual(before);
  });
});
