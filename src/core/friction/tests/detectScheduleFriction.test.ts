import { describe, expect, it } from "vitest";

import type { BlockCandidate, DraftScheduledBlock } from "../../blocks/types.js";
import type { GeneratedWorkBlock } from "../../shifts/types.js";
import { detectScheduleFriction } from "../detectScheduleFriction.js";

const detectedAt = "2026-05-02T08:00:00-05:00";

describe("detectScheduleFriction", () => {
  it("detects a warning overlap between work and a draft scheduled block", () => {
    const generatedWorkBlocks: GeneratedWorkBlock[] = [
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
    const scheduledBlocks: DraftScheduledBlock[] = [
      {
        id: "scheduled_candidate_workout",
        userId: "user_001",
        templateId: "template_workout",
        source: "template",
        title: "Workout",
        category: "fitness",
        startsAt: new Date(2026, 4, 5, 14, 0, 0, 0),
        endsAt: new Date(2026, 4, 5, 15, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
    ];

    const result = detectScheduleFriction({
      generatedWorkBlocks,
      scheduledBlocks,
      unplacedCandidates: [],
      detectedAt,
    });

    expect(result.frictionPoints).toHaveLength(1);
    expect(result.frictionPoints[0]).toMatchObject({
      severity: "warning",
      title: "Day Shift conflicts with Workout",
      affectedBlockIds: ["work_shift_day_2026-05-05", "scheduled_candidate_workout"],
      affectedUserDayDate: "2026-05-05",
      canIgnore: true,
    });
  });

  it("uses sleep-specific guidance when sleep overlaps a shift", () => {
    const generatedWorkBlocks: GeneratedWorkBlock[] = [
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
    const scheduledBlocks: DraftScheduledBlock[] = [
      {
        id: "scheduled_sleep",
        userId: "user_001",
        templateId: "default_sleep",
        source: "template",
        title: "Sleep",
        category: "sleep",
        startsAt: new Date(2026, 4, 5, 19, 0, 0, 0),
        endsAt: new Date(2026, 4, 6, 3, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 1,
        status: "planned",
        externalResources: [],
      },
    ];

    const result = detectScheduleFriction({
      generatedWorkBlocks,
      scheduledBlocks,
      unplacedCandidates: [],
      detectedAt,
    });

    expect(result.frictionPoints[0]?.message).toBe(
      "Work is locked by your shift setup. Sleep is flexible and can be moved. Try moving Sleep before work or reducing its buffer.",
    );
  });

  it("describes work as locked when it overlaps a fixed template", () => {
    const generatedWorkBlocks: GeneratedWorkBlock[] = [
      {
        id: "work_shift_day_2026-05-05",
        shiftDefinitionId: "shift_day",
        userId: "user_001",
        title: "Day Shift",
        anchorType: "work",
        startsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
        endsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
        startDate: "2026-05-05",
        endDate: "2026-05-05",
        userDayDate: "2026-05-05",
        crossesMidnight: false,
      },
    ];
    const scheduledBlocks: DraftScheduledBlock[] = [
      {
        id: "scheduled_workout",
        userId: "user_001",
        templateId: "template_workout",
        source: "template",
        title: "Workout",
        category: "fitness",
        anchorType: "fixedTemplate",
        placementType: "fixed",
        fixedStartTime: "06:00",
        startsAt: new Date(2026, 4, 5, 6, 0, 0, 0),
        endsAt: new Date(2026, 4, 5, 7, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
    ];

    const result = detectScheduleFriction({
      generatedWorkBlocks,
      scheduledBlocks,
      unplacedCandidates: [],
      detectedAt,
    });

    expect(result.frictionPoints[0]?.message).toBe(
      "Work is locked by your shift setup. Workout is fixed at 6:00 AM. Review the fixed start time or accept the conflict.",
    );
  });

  it("uses fixed-template guidance when a fixed block overlaps a flexible block", () => {
    const scheduledBlocks: DraftScheduledBlock[] = [
      {
        id: "scheduled_workout",
        userId: "user_001",
        templateId: "template_workout",
        source: "template",
        title: "Workout",
        category: "fitness",
        placementType: "fixed",
        fixedStartTime: "06:00",
        startsAt: new Date(2026, 4, 5, 6, 0, 0, 0),
        endsAt: new Date(2026, 4, 5, 7, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
      {
        id: "scheduled_sleep",
        userId: "user_001",
        templateId: "template_sleep",
        source: "template",
        title: "Sleep",
        category: "sleep",
        placementType: "flexible",
        startsAt: new Date(2026, 4, 5, 0, 30, 0, 0),
        endsAt: new Date(2026, 4, 5, 8, 30, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
    ];

    const result = detectScheduleFriction({
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
      detectedAt,
    });

    expect(result.frictionPoints[0]?.message).toBe(
      "Workout is fixed at 6:00 AM. Sleep is flexible and can be moved. Try moving Sleep or accepting the conflict.",
    );
  });

  it("uses fixed-vs-fixed guidance when two fixed blocks overlap", () => {
    const scheduledBlocks: DraftScheduledBlock[] = [
      {
        id: "scheduled_workout",
        userId: "user_001",
        templateId: "template_workout",
        source: "template",
        title: "Workout",
        category: "fitness",
        placementType: "fixed",
        fixedStartTime: "06:00",
        startsAt: new Date(2026, 4, 5, 6, 0, 0, 0),
        endsAt: new Date(2026, 4, 5, 7, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
      {
        id: "scheduled_medication",
        userId: "user_001",
        templateId: "template_medication",
        source: "template",
        title: "Medication",
        category: "health",
        placementType: "fixed",
        fixedStartTime: "06:30",
        startsAt: new Date(2026, 4, 5, 6, 30, 0, 0),
        endsAt: new Date(2026, 4, 5, 6, 45, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
    ];

    const result = detectScheduleFriction({
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
      detectedAt,
    });

    expect(result.frictionPoints[0]?.message).toBe(
      "Two fixed blocks overlap. Review one of their fixed start times or accept the conflict.",
    );
  });

  it("detects a critical conflict when two priority 1 scheduled blocks overlap", () => {
    const scheduledBlocks: DraftScheduledBlock[] = [
      {
        id: "scheduled_sleep",
        userId: "user_001",
        templateId: "template_sleep",
        source: "template",
        title: "Sleep",
        category: "sleep",
        startsAt: new Date(2026, 4, 5, 22, 0, 0, 0),
        endsAt: new Date(2026, 4, 6, 6, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 1,
        status: "planned",
        externalResources: [],
      },
      {
        id: "scheduled_medication",
        userId: "user_001",
        templateId: "template_medication",
        source: "template",
        title: "Medication",
        category: "health",
        startsAt: new Date(2026, 4, 5, 23, 0, 0, 0),
        endsAt: new Date(2026, 4, 5, 23, 30, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 1,
        status: "planned",
        externalResources: [],
      },
    ];

    const result = detectScheduleFriction({
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
      detectedAt,
    });

    expect(result.frictionPoints).toHaveLength(1);
    expect(result.frictionPoints[0]).toMatchObject({
      severity: "critical",
      title: "Sleep conflicts with Medication",
      canIgnore: false,
    });
    expect(result.frictionPoints[0]?.message).toContain("Two priority 1 blocks overlap");
  });

  it("creates friction points for unplaced candidates", () => {
    const unplacedCandidates: BlockCandidate[] = [
      {
        id: "candidate_template_review_rec_review_2026-05-05",
        userId: "user_001",
        templateId: "template_review",
        recurrenceId: "rec_review",
        recurrenceFrequency: "specificWeekdays",
        title: "Schedule Review",
        category: "review",
        placementType: "flexible",
        durationMinutes: 60,
        priority: 2,
        preferredWindow: "beforeWork",
        rescheduleBehavior: "autoSameUserWeek",
        externalResources: [],
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
      },
    ];

    const result = detectScheduleFriction({
      generatedWorkBlocks: [],
      scheduledBlocks: [],
      unplacedCandidates,
      detectedAt,
    });

    expect(result.frictionPoints).toHaveLength(1);
    expect(result.frictionPoints[0]).toMatchObject({
      severity: "warning",
      title: "Schedule Review could not be placed",
      affectedBlockIds: ["candidate_template_review_rec_review_2026-05-05"],
      canIgnore: true,
    });
  });

  it("uses informational friction for work-required candidates skipped on downtime days", () => {
    const unplacedCandidates: BlockCandidate[] = [
      {
        id: "candidate_commute",
        userId: "user_001",
        templateId: "template_commute",
        recurrenceId: "rec_commute",
        recurrenceFrequency: "specificWeekdays",
        title: "Commute",
        category: "admin",
        requiresWorkAnchor: true,
        placementType: "flexible",
        durationMinutes: 30,
        priority: 2,
        preferredWindow: "beforeWork",
        rescheduleBehavior: "autoSameUserWeek",
        externalResources: [],
        userDayDate: "2026-05-10",
        userWeekStartDate: "2026-05-09",
      },
    ];

    const result = detectScheduleFriction({
      generatedWorkBlocks: [],
      scheduledBlocks: [],
      unplacedCandidates,
      detectedAt,
    });

    expect(result.frictionPoints).toEqual([
      expect.objectContaining({
        kind: "workRequiredSkip",
        severity: "info",
        title: "Commute could not be scheduled",
        message: "This activity requires a work shift, but none exists on 2026-05-10.",
      }),
    ]);
  });

  it("treats transition buffers as occupied time during overlap detection", () => {
    const generatedWorkBlocks: GeneratedWorkBlock[] = [
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
    const scheduledBlocks: DraftScheduledBlock[] = [
      {
        id: "scheduled_candidate_errands",
        userId: "user_001",
        templateId: "template_errands",
        source: "template",
        title: "Errands",
        category: "admin",
        startsAt: new Date(2026, 4, 5, 14, 20, 0, 0),
        endsAt: new Date(2026, 4, 5, 15, 20, 0, 0),
        bufferBeforeMinutes: 15,
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 3,
        status: "planned",
        externalResources: [],
      },
    ];

    const result = detectScheduleFriction({
      generatedWorkBlocks,
      scheduledBlocks,
      unplacedCandidates: [],
      detectedAt,
    });

    expect(result.frictionPoints).toHaveLength(1);
    expect(result.frictionPoints[0]?.title).toBe("Day Shift conflicts with Errands");
  });

  it("returns no friction points when there are no overlaps or unplaced candidates", () => {
    const scheduledBlocks: DraftScheduledBlock[] = [
      {
        id: "scheduled_review",
        userId: "user_001",
        templateId: "template_review",
        source: "template",
        title: "Schedule Review",
        category: "review",
        startsAt: new Date(2026, 4, 5, 3, 0, 0, 0),
        endsAt: new Date(2026, 4, 5, 4, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
    ];

    const result = detectScheduleFriction({
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
      detectedAt,
    });

    expect(result.frictionPoints).toEqual([]);
  });
});
