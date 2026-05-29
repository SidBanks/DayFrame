import { describe, expect, it } from "vitest";

import type { GeneratedWorkBlock } from "../../shifts/types.js";
import { placeBlockCandidates } from "../placeBlockCandidates.js";
import type { BlockCandidate } from "../types.js";

const baseCandidate: BlockCandidate = {
  id: "candidate_template_review_rec_review_2026-05-05",
  userId: "user_001",
  templateId: "template_review",
  recurrenceId: "rec_review",
  recurrenceFrequency: "daily",
  title: "Schedule Review",
  category: "review",
  placementType: "flexible",
  durationMinutes: 60,
  priority: 2,
  preferredWindow: "anyAvailable",
  rescheduleBehavior: "autoSameUserWeek",
  externalResources: [],
  userDayDate: "2026-05-05",
  userWeekStartDate: "2026-05-02",
};

describe("placeBlockCandidates", () => {
  it("places anyAvailable candidates at the user day start", () => {
    const result = placeBlockCandidates({
      blockCandidates: [baseCandidate],
      generatedWorkBlocks: [],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]).toMatchObject({
      id: "scheduled_candidate_template_review_rec_review_2026-05-05",
      source: "template",
      status: "planned",
      userDayDate: "2026-05-05",
    });
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 5, 3, 0, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 4, 0, 0, 0).getTime(),
    );
  });

  it("places fixed templates at their fixed start time within the user day", () => {
    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_fixed_breakfast",
          title: "Breakfast",
          placementType: "fixed",
          preferredWindow: "afterWaking",
          fixedStartTime: "07:00",
        },
      ],
      generatedWorkBlocks: [],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.anchorType).toBe("fixedTemplate");
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 5, 7, 0, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 8, 0, 0, 0).getTime(),
    );
  });

  it("places fixed times before the day boundary on the next calendar date within the same user day", () => {
    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_fixed_meds",
          title: "Medication",
          placementType: "fixed",
          preferredWindow: "afterWaking",
          fixedStartTime: "02:00",
          durationMinutes: 30,
        },
      ],
      generatedWorkBlocks: [],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 6, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 6, 2, 0, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 6, 2, 30, 0, 0).getTime(),
    );
  });

  it("places beforeWork candidates immediately before the first work block", () => {
    const workBlocks: GeneratedWorkBlock[] = [
      {
        id: "work_shift_day_2026-05-05",
        shiftDefinitionId: "shift_day",
        userId: "user_001",
        title: "Day Shift",
        startsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
        endsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
        startDate: "2026-05-05",
        endDate: "2026-05-05",
        userDayDate: "2026-05-05",
        crossesMidnight: false,
      },
    ];

    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_medication",
          title: "Medication",
          category: "health",
          durationMinutes: 30,
          preferredWindow: "beforeWork",
        },
      ],
      generatedWorkBlocks: workBlocks,
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.anchorType).toBe("flexibleTemplate");
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 5, 5, 15, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 5, 45, 0, 0).getTime(),
    );
  });

  it("places buffered sleep before work so the after-buffer ends before the shift starts", () => {
    const workBlocks: GeneratedWorkBlock[] = [
      {
        id: "work_shift_day_2026-05-05",
        shiftDefinitionId: "shift_day",
        userId: "user_001",
        title: "Day Shift",
        startsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
        endsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
        startDate: "2026-05-05",
        endDate: "2026-05-05",
        userDayDate: "2026-05-05",
        crossesMidnight: false,
      },
    ];

    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_sleep",
          templateId: "default_sleep",
          title: "Sleep",
          category: "sleep",
          durationMinutes: 480,
          preferredWindow: "beforeWork",
          bufferAfterMinutes: 60,
        },
      ],
      generatedWorkBlocks: workBlocks,
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 4, 20, 45, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 4, 45, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.bufferAfterMinutes).toBe(60);
  });

  it("places afterWork candidates immediately after the last work block", () => {
    const workBlocks: GeneratedWorkBlock[] = [
      {
        id: "work_shift_day_2026-05-05",
        shiftDefinitionId: "shift_day",
        userId: "user_001",
        title: "Day Shift",
        startsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
        endsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
        startDate: "2026-05-05",
        endDate: "2026-05-05",
        userDayDate: "2026-05-05",
        crossesMidnight: false,
      },
    ];

    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_workout",
          title: "Workout",
          category: "fitness",
          preferredWindow: "afterWork",
        },
      ],
      generatedWorkBlocks: workBlocks,
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 5, 14, 15, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 15, 15, 0, 0).getTime(),
    );
  });

  it("places buffered errands after work with time reserved before the block", () => {
    const workBlocks: GeneratedWorkBlock[] = [
      {
        id: "work_shift_day_2026-05-05",
        shiftDefinitionId: "shift_day",
        userId: "user_001",
        title: "Day Shift",
        startsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
        endsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
        startDate: "2026-05-05",
        endDate: "2026-05-05",
        userDayDate: "2026-05-05",
        crossesMidnight: false,
      },
    ];

    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_errands",
          templateId: "template_errands",
          title: "Errands",
          category: "admin",
          preferredWindow: "afterWork",
          bufferBeforeMinutes: 15,
          bufferAfterMinutes: 15,
        },
      ],
      generatedWorkBlocks: workBlocks,
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 5, 14, 30, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 15, 30, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.bufferBeforeMinutes).toBe(15);
    expect(result.scheduledBlocks[0]?.bufferAfterMinutes).toBe(15);
  });

  it("allows afterWork candidates for overnight shifts to extend into the next user-day window", () => {
    const workBlocks: GeneratedWorkBlock[] = [
      {
        id: "work_shift_night_2026-05-05",
        shiftDefinitionId: "shift_night",
        userId: "user_001",
        title: "Night Shift",
        startsAt: new Date(2026, 4, 5, 21, 45, 0, 0),
        endsAt: new Date(2026, 4, 6, 6, 15, 0, 0),
        startDate: "2026-05-05",
        endDate: "2026-05-06",
        userDayDate: "2026-05-05",
        crossesMidnight: true,
      },
    ];

    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_sleep_in",
          title: "Sleep In",
          category: "recovery",
          preferredWindow: "afterWork",
        },
      ],
      generatedWorkBlocks: workBlocks,
      planningWindowStart: new Date(2026, 4, 5, 3, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 9, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 6, 6, 15, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 6, 7, 15, 0, 0).getTime(),
    );
  });

  it("places beforeSleep candidates at the end of the user day", () => {
    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_wind_down",
          title: "Wind Down",
          category: "recovery",
          durationMinutes: 90,
          preferredWindow: "beforeSleep",
        },
      ],
      generatedWorkBlocks: [],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 12, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 6, 1, 30, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 6, 3, 0, 0, 0).getTime(),
    );
  });

  it("places 8-hour sleep before work using the full duration on a night-shift user day", () => {
    const workBlocks: GeneratedWorkBlock[] = [
      {
        id: "work_shift_night_2026-05-05",
        shiftDefinitionId: "shift_night",
        userId: "user_001",
        title: "Night Shift",
        startsAt: new Date(2026, 4, 5, 21, 45, 0, 0),
        endsAt: new Date(2026, 4, 6, 6, 15, 0, 0),
        startDate: "2026-05-05",
        endDate: "2026-05-06",
        userDayDate: "2026-05-05",
        crossesMidnight: true,
      },
    ];

    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_sleep_before_work",
          templateId: "default_sleep",
          title: "Sleep",
          category: "sleep",
          durationMinutes: 480,
          preferredWindow: "beforeWork",
        },
      ],
      generatedWorkBlocks: workBlocks,
      planningWindowStart: new Date(2026, 4, 5, 3, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 12, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 5, 13, 45, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 21, 45, 0, 0).getTime(),
    );
  });

  it("propagates daily before-work sleep onto a non-work day using the nearest previous anchor", () => {
    const workBlocks: GeneratedWorkBlock[] = [
      {
        id: "work_shift_night_2026-05-05",
        shiftDefinitionId: "shift_night",
        userId: "user_001",
        title: "Night Shift",
        startsAt: new Date(2026, 4, 5, 21, 45, 0, 0),
        endsAt: new Date(2026, 4, 6, 6, 15, 0, 0),
        startDate: "2026-05-05",
        endDate: "2026-05-06",
        userDayDate: "2026-05-05",
        crossesMidnight: true,
      },
    ];

    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_sleep_anchor",
          templateId: "default_sleep",
          recurrenceId: "rec_sleep",
          recurrenceFrequency: "daily",
          title: "Sleep",
          category: "sleep",
          durationMinutes: 510,
          preferredWindow: "beforeWork",
          bufferBeforeMinutes: 60,
          bufferAfterMinutes: 60,
          userDayDate: "2026-05-05",
        },
        {
          ...baseCandidate,
          id: "candidate_sleep_off_day",
          templateId: "default_sleep",
          recurrenceId: "rec_sleep",
          recurrenceFrequency: "daily",
          title: "Sleep",
          category: "sleep",
          durationMinutes: 510,
          preferredWindow: "beforeWork",
          bufferBeforeMinutes: 60,
          bufferAfterMinutes: 60,
          userDayDate: "2026-05-06",
        },
      ],
      generatedWorkBlocks: workBlocks,
      planningWindowStart: new Date(2026, 4, 5, 3, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 7, 3, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks.map((scheduledBlock) => scheduledBlock.userDayDate)).toEqual([
      "2026-05-05",
      "2026-05-06",
    ]);
    expect(result.scheduledBlocks[0]).toMatchObject({
      userDayDate: "2026-05-05",
      startsAt: new Date(2026, 4, 5, 12, 15, 0, 0),
      endsAt: new Date(2026, 4, 5, 20, 45, 0, 0),
    });
    expect(result.scheduledBlocks[1]).toMatchObject({
      userDayDate: "2026-05-06",
      startsAt: new Date(2026, 4, 6, 12, 15, 0, 0),
      endsAt: new Date(2026, 4, 6, 20, 45, 0, 0),
      bufferBeforeMinutes: 60,
      bufferAfterMinutes: 60,
      templateId: "default_sleep",
      priority: 2,
      category: "sleep",
    });
  });

  it("propagates daily before-work sleep onto the first visible non-work day using the nearest future anchor", () => {
    const workBlocks: GeneratedWorkBlock[] = [
      {
        id: "work_shift_night_2026-05-06",
        shiftDefinitionId: "shift_night",
        userId: "user_001",
        title: "Night Shift",
        startsAt: new Date(2026, 4, 6, 21, 45, 0, 0),
        endsAt: new Date(2026, 4, 7, 6, 15, 0, 0),
        startDate: "2026-05-06",
        endDate: "2026-05-07",
        userDayDate: "2026-05-06",
        crossesMidnight: true,
      },
    ];

    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_sleep_first_visible_off_day",
          templateId: "default_sleep",
          recurrenceId: "rec_sleep",
          recurrenceFrequency: "daily",
          title: "Sleep",
          category: "sleep",
          durationMinutes: 480,
          preferredWindow: "beforeWork",
          userDayDate: "2026-05-05",
        },
        {
          ...baseCandidate,
          id: "candidate_sleep_future_anchor",
          templateId: "default_sleep",
          recurrenceId: "rec_sleep",
          recurrenceFrequency: "daily",
          title: "Sleep",
          category: "sleep",
          durationMinutes: 480,
          preferredWindow: "beforeWork",
          userDayDate: "2026-05-06",
        },
      ],
      generatedWorkBlocks: workBlocks,
      planningWindowStart: new Date(2026, 4, 5, 3, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 7, 3, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks).toHaveLength(2);
    expect(result.scheduledBlocks[0]).toMatchObject({
      userDayDate: "2026-05-05",
      startsAt: new Date(2026, 4, 5, 13, 45, 0, 0),
      endsAt: new Date(2026, 4, 5, 21, 45, 0, 0),
    });
    expect(result.scheduledBlocks[1]).toMatchObject({
      userDayDate: "2026-05-06",
      startsAt: new Date(2026, 4, 6, 13, 45, 0, 0),
      endsAt: new Date(2026, 4, 6, 21, 45, 0, 0),
    });
  });

  it("keeps no-buffer placement behavior unchanged", () => {
    const workBlocks: GeneratedWorkBlock[] = [
      {
        id: "work_shift_day_2026-05-05",
        shiftDefinitionId: "shift_day",
        userId: "user_001",
        title: "Day Shift",
        startsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
        endsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
        startDate: "2026-05-05",
        endDate: "2026-05-05",
        userDayDate: "2026-05-05",
        crossesMidnight: false,
      },
    ];

    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_workout",
          title: "Workout",
          category: "fitness",
          preferredWindow: "afterWork",
        },
      ],
      generatedWorkBlocks: workBlocks,
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 5, 14, 15, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 15, 15, 0, 0).getTime(),
    );
  });

  it("places 8-hour sleep before the day boundary using the full duration", () => {
    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_sleep_before_boundary",
          templateId: "default_sleep",
          title: "Sleep",
          category: "sleep",
          durationMinutes: 480,
          preferredWindow: "beforeSleep",
        },
      ],
      generatedWorkBlocks: [],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 12, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 5, 19, 0, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 6, 3, 0, 0, 0).getTime(),
    );
  });

  it("places custom-window candidates at the custom start time when the duration fits", () => {
    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_meal_prep",
          title: "Meal Prep",
          category: "meal",
          durationMinutes: 90,
          preferredWindow: "custom",
          customWindowStartTime: "10:00",
          customWindowEndTime: "12:00",
        },
      ],
      generatedWorkBlocks: [],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 5, 10, 0, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 11, 30, 0, 0).getTime(),
    );
  });

  it("interprets custom times before the day boundary as part of the next calendar day", () => {
    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_sleep",
          title: "Sleep",
          category: "recovery",
          durationMinutes: 90,
          preferredWindow: "custom",
          customWindowStartTime: "01:00",
          customWindowEndTime: "02:30",
        },
      ],
      generatedWorkBlocks: [],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 12, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 6, 1, 0, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 6, 2, 30, 0, 0).getTime(),
    );
  });

  it("leaves beforeWork candidates unplaced when no work block exists for that user day", () => {
    const candidate = {
      ...baseCandidate,
      id: "candidate_before_work",
      recurrenceFrequency: "weekly" as const,
      preferredWindow: "beforeWork" as const,
    };

    const result = placeBlockCandidates({
      blockCandidates: [candidate],
      generatedWorkBlocks: [],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.scheduledBlocks).toHaveLength(0);
    expect(result.unplacedCandidates).toEqual([candidate]);
  });

  it("leaves custom candidates unplaced when the duration does not fit in the window", () => {
    const candidate = {
      ...baseCandidate,
      id: "candidate_custom_too_long",
      preferredWindow: "custom" as const,
      durationMinutes: 180,
      customWindowStartTime: "10:00" as const,
      customWindowEndTime: "12:00" as const,
    };

    const result = placeBlockCandidates({
      blockCandidates: [candidate],
      generatedWorkBlocks: [],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.scheduledBlocks).toHaveLength(0);
    expect(result.unplacedCandidates).toEqual([candidate]);
  });

  it("derives template anchor types from placement type instead of trusting incoming candidate anchors", () => {
    const result = placeBlockCandidates({
      blockCandidates: [
        {
          ...baseCandidate,
          id: "candidate_bad_anchor_fixed",
          placementType: "fixed",
          preferredWindow: "afterWaking",
          fixedStartTime: "07:00",
          anchorType: "work",
        },
        {
          ...baseCandidate,
          id: "candidate_bad_anchor_flexible",
          anchorType: "work",
        },
      ],
      generatedWorkBlocks: [],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks.map((scheduledBlock) => scheduledBlock.anchorType)).toEqual([
      "flexibleTemplate",
      "fixedTemplate",
    ]);
  });
});
