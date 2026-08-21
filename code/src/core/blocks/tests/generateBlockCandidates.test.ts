import { describe, expect, it } from "vitest";

import { generateBlockCandidates } from "../generateBlockCandidates.js";
import type { BlockRecurrence, BlockTemplate } from "../types.js";

const baseTemplate: BlockTemplate = {
  id: "template_workout",
  userId: "user_001",
  title: "Workout",
  category: "fitness",
  placementType: "flexible",
  durationMinutes: 60,
  priority: 2,
  preferredWindow: "afterWork",
  rescheduleBehavior: "autoSameUserWeek",
  requiresResource: false,
  externalResources: [],
  enabled: true,
  createdAt: "2026-05-02T00:00:00-05:00",
  updatedAt: "2026-05-02T00:00:00-05:00",
};

describe("generateBlockCandidates", () => {
  it("generates daily candidates across overlapping user days", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_daily_walk",
      blockTemplateId: "template_workout",
      frequency: "daily",
    };

    const candidates = generateBlockCandidates({
      blockTemplates: [baseTemplate],
      blockRecurrences: [recurrence],
      planningWindowStart: new Date(2026, 4, 5, 1, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 7, 2, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
    });

    expect(candidates.map((candidate) => candidate.userDayDate)).toEqual([
      "2026-05-04",
      "2026-05-05",
      "2026-05-06",
    ]);
  });

  it("generates daily sleep candidates for each overlapping preview user day", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_sleep",
      blockTemplateId: "default_sleep",
      frequency: "daily",
    };

    const candidates = generateBlockCandidates({
      blockTemplates: [
        {
          ...baseTemplate,
          id: "default_sleep",
          title: "Sleep",
          category: "sleep",
          durationMinutes: 480,
          bufferAfterMinutes: 60,
          preferredWindow: "beforeSleep",
        },
      ],
      blockRecurrences: [recurrence],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 7, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
    });

    expect(candidates).toHaveLength(4);
    expect(candidates.every((candidate) => candidate.durationMinutes === 480)).toBe(true);
    expect(candidates.every((candidate) => candidate.bufferAfterMinutes === 60)).toBe(true);
    expect(candidates.map((candidate) => candidate.userDayDate)).toEqual([
      "2026-05-04",
      "2026-05-05",
      "2026-05-06",
      "2026-05-07",
    ]);
  });

  it("generates only canonical weekly occurrences that overlap the generation domain", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_meal_prep",
      blockTemplateId: "template_workout",
      frequency: "weekly",
    };

    const candidates = generateBlockCandidates({
      blockTemplates: [baseTemplate],
      blockRecurrences: [recurrence],
      planningWindowStart: new Date(2026, 4, 8, 12, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 19, 12, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
    });

    expect(candidates.map((candidate) => candidate.userWeekStartDate)).toEqual([
      "2026-05-09",
      "2026-05-16",
    ]);
    expect(candidates.map((candidate) => candidate.userDayDate)).toEqual([
      "2026-05-09",
      "2026-05-16",
    ]);
  });

  it("generates candidates for specific weekdays only", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_review",
      blockTemplateId: "template_workout",
      frequency: "specificWeekdays",
      weekdays: ["sunday", "wednesday"],
    };

    const candidates = generateBlockCandidates({
      blockTemplates: [baseTemplate],
      blockRecurrences: [recurrence],
      planningWindowStart: new Date(2026, 4, 3, 12, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 11, 12, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
    });

    expect(candidates.map((candidate) => candidate.userDayDate)).toEqual([
      "2026-05-03",
      "2026-05-06",
      "2026-05-10",
    ]);
  });

  it("generates a deterministic number of candidates per user week", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_strength",
      blockTemplateId: "template_workout",
      frequency: "timesPerUserWeek",
      timesPerUserWeek: 2,
    };

    const candidates = generateBlockCandidates({
      blockTemplates: [baseTemplate],
      blockRecurrences: [recurrence],
      planningWindowStart: new Date(2026, 4, 9, 3, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 18, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
    });

    expect(candidates.map((candidate) => candidate.userDayDate)).toEqual([
      "2026-05-09",
      "2026-05-10",
      "2026-05-16",
      "2026-05-17",
    ]);
  });

  it("does not replace an earlier canonical weekly occurrence in a narrow midweek window", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_weekly",
      blockTemplateId: baseTemplate.id,
      frequency: "weekly",
    };
    const fullWeek = generateCandidateDates(
      recurrence,
      new Date(2026, 4, 9, 3),
      new Date(2026, 4, 16, 3),
    );
    const narrowWindow = generateCandidateDates(
      recurrence,
      new Date(2026, 4, 13, 3),
      new Date(2026, 4, 16, 3),
    );

    expect(fullWeek).toEqual(["2026-05-09"]);
    expect(narrowWindow).toEqual([]);
  });

  it.each<[number, string[]]>([
    [1, ["2026-05-09"]],
    [2, ["2026-05-09", "2026-05-10"]],
    [3, ["2026-05-09", "2026-05-10", "2026-05-11"]],
    [
      7,
      [
        "2026-05-09",
        "2026-05-10",
        "2026-05-11",
        "2026-05-12",
        "2026-05-13",
        "2026-05-14",
        "2026-05-15",
      ],
    ],
    [
      9,
      [
        "2026-05-09",
        "2026-05-10",
        "2026-05-11",
        "2026-05-12",
        "2026-05-13",
        "2026-05-14",
        "2026-05-15",
      ],
    ],
  ])("allocates %i times-per-week occurrences from canonical dates", (count, expectedDates) => {
    expect(
      generateCandidateDates(
        {
          id: `rec_${count}_times`,
          blockTemplateId: baseTemplate.id,
          frequency: "timesPerUserWeek",
          timesPerUserWeek: count,
        },
        new Date(2026, 4, 9, 3),
        new Date(2026, 4, 16, 3),
      ),
    ).toEqual(expectedDates);
  });

  it("does not repack times-per-week slots into a partial requested window", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_twice_weekly",
      blockTemplateId: baseTemplate.id,
      frequency: "timesPerUserWeek",
      timesPerUserWeek: 2,
    };

    expect(
      generateCandidateDates(recurrence, new Date(2026, 4, 13, 3), new Date(2026, 4, 16, 3)),
    ).toEqual([]);
    expect(
      generateCandidateDates(recurrence, new Date(2026, 4, 10, 3), new Date(2026, 4, 14, 3)),
    ).toEqual(["2026-05-10"]);
  });

  it("allocates canonical occurrences from an inclusive midweek recurrence start", () => {
    const weekly: BlockRecurrence = {
      id: "rec_weekly_bounded_start",
      blockTemplateId: baseTemplate.id,
      frequency: "weekly",
      startsOnDate: "2026-05-13",
    };
    const twiceWeekly: BlockRecurrence = {
      ...weekly,
      id: "rec_twice_bounded_start",
      frequency: "timesPerUserWeek",
      timesPerUserWeek: 2,
    };

    expect(
      generateCandidateDates(weekly, new Date(2026, 4, 9, 3), new Date(2026, 4, 16, 3)),
    ).toEqual(["2026-05-13"]);
    expect(
      generateCandidateDates(twiceWeekly, new Date(2026, 4, 9, 3), new Date(2026, 4, 16, 3)),
    ).toEqual(["2026-05-13", "2026-05-14"]);
    expect(
      generateCandidateDates(twiceWeekly, new Date(2026, 4, 15, 3), new Date(2026, 4, 16, 3)),
    ).toEqual([]);
  });

  it("preserves canonical slot ordering through an inclusive partial last week", () => {
    const weekly: BlockRecurrence = {
      id: "rec_weekly_bounded_end",
      blockTemplateId: baseTemplate.id,
      frequency: "weekly",
      endsOnDate: "2026-05-12",
    };
    const threeTimes: BlockRecurrence = {
      ...weekly,
      id: "rec_three_bounded_end",
      frequency: "timesPerUserWeek",
      timesPerUserWeek: 3,
    };

    expect(
      generateCandidateDates(weekly, new Date(2026, 4, 9, 3), new Date(2026, 4, 13, 3)),
    ).toEqual(["2026-05-09"]);
    expect(
      generateCandidateDates(threeTimes, new Date(2026, 4, 11, 3), new Date(2026, 4, 13, 3)),
    ).toEqual(["2026-05-11"]);
  });

  it("emits no week-scoped occurrence when a discovered bucket has no recurrence-valid dates", () => {
    expect(
      generateCandidateDates(
        {
          id: "rec_future_week",
          blockTemplateId: baseTemplate.id,
          frequency: "weekly",
          startsOnDate: "2026-05-16",
          endsOnDate: "2026-05-22",
        },
        new Date(2026, 4, 9, 3),
        new Date(2026, 4, 16, 3),
      ),
    ).toEqual([]);
  });

  it("does not let the engine-style one-day buffer choose a replacement weekly occurrence", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_buffered_weekly",
      blockTemplateId: baseTemplate.id,
      frequency: "weekly",
    };

    // Visible Wednesday-Friday, with the same one-day expansion used by the engine.
    expect(
      generateCandidateDates(recurrence, new Date(2026, 4, 12, 3), new Date(2026, 4, 16, 3)),
    ).toEqual([]);
  });

  it("uses the configured global week start for canonical allocation", () => {
    expect(
      generateCandidateDates(
        {
          id: "rec_monday_week",
          blockTemplateId: baseTemplate.id,
          frequency: "timesPerUserWeek",
          timesPerUserWeek: 2,
        },
        new Date(2026, 4, 11, 3),
        new Date(2026, 4, 18, 3),
        { weekStartsOn: "monday" },
      ),
    ).toEqual(["2026-05-11", "2026-05-12"]);
  });

  it("discovers irregular effective week buckets without duplicates or replacements", () => {
    const shiftCycles = [
      {
        id: "cycle_transition",
        userId: "user_001",
        name: "Transition",
        type: "fixedSegments" as const,
        mode: "manualSegments" as const,
        startsOnDate: "2026-05-09" as const,
        endsOnDate: "2026-05-22" as const,
        segments: [
          {
            id: "segment_saturday",
            shiftCycleId: "cycle_transition",
            shiftDefinitionId: "shift_day",
            startsOnDate: "2026-05-09" as const,
            endsOnDate: "2026-05-12" as const,
            schedulePreferences: { weekStartsOn: "saturday" as const },
          },
          {
            id: "segment_monday",
            shiftCycleId: "cycle_transition",
            shiftDefinitionId: "shift_day",
            startsOnDate: "2026-05-13" as const,
            endsOnDate: "2026-05-22" as const,
            schedulePreferences: { weekStartsOn: "monday" as const },
          },
        ],
        createdAt: "2026-05-01T00:00:00-05:00",
        updatedAt: "2026-05-01T00:00:00-05:00",
      },
    ];
    const recurrence: BlockRecurrence = {
      id: "rec_transition",
      blockTemplateId: baseTemplate.id,
      frequency: "weekly",
    };

    expect(
      generateCandidateDates(recurrence, new Date(2026, 4, 9, 3), new Date(2026, 4, 16, 3), {
        shiftCycles,
      }),
    ).toEqual(["2026-05-09", "2026-05-13"]);
    expect(
      generateCandidateDates(recurrence, new Date(2026, 4, 14, 3), new Date(2026, 4, 16, 3), {
        shiftCycles,
      }),
    ).toEqual([]);
  });

  it("keeps canonical selection deterministic across recurrence input order", () => {
    const recurrences: BlockRecurrence[] = [
      {
        id: "rec_z_weekly",
        blockTemplateId: baseTemplate.id,
        frequency: "weekly",
      },
      {
        id: "rec_a_weekly",
        blockTemplateId: baseTemplate.id,
        frequency: "weekly",
      },
    ];
    const input = {
      blockTemplates: [baseTemplate],
      planningWindowStart: new Date(2026, 4, 9, 3),
      planningWindowEnd: new Date(2026, 4, 16, 3),
      dayBoundaryStartTime: "04:00" as const,
      weekStartsOn: "saturday" as const,
    };

    const forward = generateBlockCandidates({ ...input, blockRecurrences: recurrences });
    const reverse = generateBlockCandidates({
      ...input,
      blockRecurrences: [...recurrences].reverse(),
    });

    expect(reverse.map((candidate) => candidate.id)).toEqual(
      forward.map((candidate) => candidate.id),
    );
    expect(new Set(forward.map((candidate) => candidate.id)).size).toBe(forward.length);
  });

  it("respects recurrence start and end date bounds", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_bounded",
      blockTemplateId: "template_workout",
      frequency: "daily",
      startsOnDate: "2026-05-05",
      endsOnDate: "2026-05-06",
    };

    const candidates = generateBlockCandidates({
      blockTemplates: [baseTemplate],
      blockRecurrences: [recurrence],
      planningWindowStart: new Date(2026, 4, 4, 12, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 8, 12, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
    });

    expect(candidates.map((candidate) => candidate.userDayDate)).toEqual([
      "2026-05-05",
      "2026-05-06",
    ]);
  });

  it("skips disabled templates", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_disabled",
      blockTemplateId: "template_disabled",
      frequency: "daily",
    };

    const candidates = generateBlockCandidates({
      blockTemplates: [
        {
          ...baseTemplate,
          id: "template_disabled",
          enabled: false,
        },
      ],
      blockRecurrences: [recurrence],
      planningWindowStart: new Date(2026, 4, 4, 12, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 12, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
    });

    expect(candidates).toHaveLength(0);
  });

  it("carries requiresWorkAnchor onto generated candidates", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_commute",
      blockTemplateId: "template_commute",
      frequency: "daily",
    };

    const candidates = generateBlockCandidates({
      blockTemplates: [
        {
          ...baseTemplate,
          id: "template_commute",
          title: "Commute",
          requiresWorkAnchor: true,
          preferredWindow: "beforeWork",
        },
      ],
      blockRecurrences: [recurrence],
      planningWindowStart: new Date(2026, 4, 4, 12, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 12, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
    });

    expect(candidates.every((candidate) => candidate.requiresWorkAnchor === true)).toBe(true);
  });

  it("rejects specificWeekdays without weekdays", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_bad_weekdays",
      blockTemplateId: "template_workout",
      frequency: "specificWeekdays",
    };

    expect(() =>
      generateBlockCandidates({
        blockTemplates: [baseTemplate],
        blockRecurrences: [recurrence],
        planningWindowStart: new Date(2026, 4, 4, 12, 0, 0, 0),
        planningWindowEnd: new Date(2026, 4, 5, 12, 0, 0, 0),
        dayBoundaryStartTime: "03:00",
        weekStartsOn: "saturday",
      }),
    ).toThrow(RangeError);
  });
});

function generateCandidateDates(
  recurrence: BlockRecurrence,
  planningWindowStart: Date,
  planningWindowEnd: Date,
  options: {
    weekStartsOn?:
      | "sunday"
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday";
    shiftCycles?: Parameters<typeof generateBlockCandidates>[0]["shiftCycles"];
  } = {},
): string[] {
  return generateBlockCandidates({
    blockTemplates: [baseTemplate],
    blockRecurrences: [recurrence],
    planningWindowStart,
    planningWindowEnd,
    dayBoundaryStartTime: "03:00",
    weekStartsOn: options.weekStartsOn ?? "saturday",
    ...(options.shiftCycles ? { shiftCycles: options.shiftCycles } : {}),
  }).map((candidate) => candidate.userDayDate);
}
