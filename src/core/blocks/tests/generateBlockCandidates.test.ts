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

  it("generates one weekly candidate per overlapping user week", () => {
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
      "2026-05-02",
      "2026-05-09",
      "2026-05-16",
    ]);
    expect(candidates.map((candidate) => candidate.userDayDate)).toEqual([
      "2026-05-08",
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
