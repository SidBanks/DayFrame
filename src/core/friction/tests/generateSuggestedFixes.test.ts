import { describe, expect, it } from "vitest";

import type { BlockCandidate, DraftScheduledBlock } from "../../blocks/types.js";
import type { GeneratedWorkBlock } from "../../shifts/types.js";
import { generateSuggestedFixes } from "../generateSuggestedFixes.js";
import type { FrictionPoint } from "../types.js";

describe("generateSuggestedFixes", () => {
  it("builds tailored warning fixes for a work-vs-workout conflict", () => {
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
        id: "scheduled_workout",
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
    const frictionPoints: FrictionPoint[] = [
      {
        id: "friction_conflict_work_shift_day_2026-05-05_scheduled_workout",
        userId: "user_001",
        severity: "warning",
        title: "Day Shift conflicts with Workout",
        message: "Day Shift overlaps Workout and should be reviewed before schedule commit.",
        affectedBlockIds: ["work_shift_day_2026-05-05", "scheduled_workout"],
        affectedUserDayDate: "2026-05-05",
        affectedUserWeekStartDate: "2026-05-02",
        suggestedFixes: [],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: "2026-05-03T08:00:00-05:00",
        updatedAt: "2026-05-03T08:00:00-05:00",
      },
    ];

    const result = generateSuggestedFixes({
      frictionPoints,
      generatedWorkBlocks,
      scheduledBlocks,
      unplacedCandidates: [],
    });

    expect(result.frictionPoints[0]?.suggestedFixes).toEqual([
      { id: "fix_move_scheduled_workout", label: "Move block", action: "moveBlock" },
      {
        id: "fix_convert_scheduled_workout",
        label: "Convert to recovery",
        action: "convertToRecovery",
      },
      {
        id: "fix_reduce_scheduled_workout",
        label: "Reduce duration",
        action: "reduceDuration",
      },
      {
        id: "fix_change_priority_scheduled_workout",
        label: "Change priority",
        action: "changePriority",
      },
      {
        id: "fix_accept_work_shift_day_2026-05-05_scheduled_workout",
        label: "Accept conflict",
        action: "acceptConflict",
      },
    ]);
  });

  it("treats work as stronger than a fixed template and does not suggest moving either block", () => {
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
    const frictionPoints: FrictionPoint[] = [
      {
        id: "friction_conflict_work_fixed",
        userId: "user_001",
        severity: "warning",
        title: "Day Shift conflicts with Workout",
        message: "Needs review.",
        affectedBlockIds: ["work_shift_day_2026-05-05", "scheduled_workout"],
        suggestedFixes: [],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: "2026-05-03T08:00:00-05:00",
        updatedAt: "2026-05-03T08:00:00-05:00",
      },
    ];

    const result = generateSuggestedFixes({
      frictionPoints,
      generatedWorkBlocks,
      scheduledBlocks,
      unplacedCandidates: [],
    });

    expect(result.frictionPoints[0]?.suggestedFixes).toEqual([
      {
        id: "fix_change_fixed_time_scheduled_workout",
        label: "Review fixed time",
        action: "changeFixedTime",
      },
      {
        id: "fix_accept_work_shift_day_2026-05-05_scheduled_workout",
        label: "Accept conflict",
        action: "acceptConflict",
      },
    ]);
  });

  it("builds critical conflict fixes without an accept option", () => {
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
    const frictionPoints: FrictionPoint[] = [
      {
        id: "friction_conflict_scheduled_sleep_scheduled_medication",
        userId: "user_001",
        severity: "critical",
        title: "Sleep conflicts with Medication",
        message: "Two priority 1 blocks overlap: Sleep and Medication.",
        affectedBlockIds: ["scheduled_sleep", "scheduled_medication"],
        affectedUserDayDate: "2026-05-05",
        affectedUserWeekStartDate: "2026-05-02",
        suggestedFixes: [],
        canIgnore: false,
        ignored: false,
        resolved: false,
        createdAt: "2026-05-03T08:00:00-05:00",
        updatedAt: "2026-05-03T08:00:00-05:00",
      },
    ];

    const result = generateSuggestedFixes({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
    });

    expect(result.frictionPoints[0]?.suggestedFixes).toEqual([
      {
        id: "fix_reduce_scheduled_medication",
        label: "Reduce duration",
        action: "reduceDuration",
      },
      {
        id: "fix_change_priority_scheduled_medication",
        label: "Change priority",
        action: "changePriority",
      },
    ]);
  });

  it("does not show Move block when a flexible block has no later same-day gap", () => {
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
        templateId: "template_sleep",
        source: "template",
        title: "Sleep",
        category: "sleep",
        placementType: "flexible",
        startsAt: new Date(2026, 4, 5, 20, 0, 0, 0),
        endsAt: new Date(2026, 4, 6, 4, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
    ];
    const frictionPoints: FrictionPoint[] = [
      {
        id: "friction_conflict_work_sleep",
        userId: "user_001",
        severity: "warning",
        title: "Night Shift conflicts with Sleep",
        message: "Needs review.",
        affectedBlockIds: ["work_shift_night_2026-05-05", "scheduled_sleep"],
        suggestedFixes: [],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: "2026-05-03T08:00:00-05:00",
        updatedAt: "2026-05-03T08:00:00-05:00",
      },
    ];

    const result = generateSuggestedFixes({
      frictionPoints,
      generatedWorkBlocks,
      scheduledBlocks,
      unplacedCandidates: [],
    });

    expect(result.frictionPoints[0]?.suggestedFixes).toEqual([
      {
        id: "fix_reduce_scheduled_sleep",
        label: "Reduce duration",
        action: "reduceDuration",
      },
      {
        id: "fix_change_priority_scheduled_sleep",
        label: "Change priority",
        action: "changePriority",
      },
      {
        id: "fix_accept_work_shift_night_2026-05-05_scheduled_sleep",
        label: "Accept conflict",
        action: "acceptConflict",
      },
    ]);
  });

  it("shows Move block when a flexible block has a later same-day gap", () => {
    const scheduledBlocks: DraftScheduledBlock[] = [
      {
        id: "scheduled_review",
        userId: "user_001",
        templateId: "template_review",
        source: "template",
        title: "Review",
        category: "review",
        placementType: "flexible",
        startsAt: new Date(2026, 4, 5, 4, 0, 0, 0),
        endsAt: new Date(2026, 4, 5, 5, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
      {
        id: "scheduled_workout",
        userId: "user_001",
        templateId: "template_workout",
        source: "template",
        title: "Workout",
        category: "fitness",
        placementType: "flexible",
        startsAt: new Date(2026, 4, 5, 14, 0, 0, 0),
        endsAt: new Date(2026, 4, 5, 15, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
    ];
    const frictionPoints: FrictionPoint[] = [
      {
        id: "friction_conflict_workout_review",
        userId: "user_001",
        severity: "warning",
        title: "Workout conflicts with Review",
        message: "Needs review.",
        affectedBlockIds: ["scheduled_workout", "scheduled_review"],
        suggestedFixes: [],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: "2026-05-03T08:00:00-05:00",
        updatedAt: "2026-05-03T08:00:00-05:00",
      },
    ];

    const result = generateSuggestedFixes({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
    });

    expect(result.frictionPoints[0]?.suggestedFixes[0]).toEqual({
      id: "fix_move_scheduled_review",
      label: "Move block",
      action: "moveBlock",
    });
  });

  it("does not suggest moving a fixed-vs-fixed conflict first", () => {
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
        priority: 1,
        status: "planned",
        externalResources: [],
      },
    ];
    const frictionPoints: FrictionPoint[] = [
      {
        id: "friction_conflict_fixed_fixed",
        userId: "user_001",
        severity: "warning",
        title: "Workout conflicts with Medication",
        message: "Needs review.",
        affectedBlockIds: ["scheduled_workout", "scheduled_medication"],
        suggestedFixes: [],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: "2026-05-03T08:00:00-05:00",
        updatedAt: "2026-05-03T08:00:00-05:00",
      },
    ];

    const result = generateSuggestedFixes({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
    });

    expect(result.frictionPoints[0]?.suggestedFixes).toEqual([
      {
        id: "fix_change_fixed_time_scheduled_workout",
        label: "Review fixed time",
        action: "changeFixedTime",
      },
      {
        id: "fix_accept_scheduled_medication_scheduled_workout",
        label: "Accept conflict",
        action: "acceptConflict",
      },
    ]);
  });

  it("builds safe options for an unplaced candidate", () => {
    const unplacedCandidates: BlockCandidate[] = [
      {
        id: "candidate_workout",
        userId: "user_001",
        templateId: "template_workout",
        recurrenceId: "rec_workout",
        recurrenceFrequency: "specificWeekdays",
        title: "Workout",
        category: "fitness",
        placementType: "flexible",
        durationMinutes: 60,
        priority: 2,
        preferredWindow: "afterWork",
        rescheduleBehavior: "autoSameUserWeek",
        externalResources: [],
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
      },
    ];
    const frictionPoints: FrictionPoint[] = [
      {
        id: "friction_unplaced_candidate_workout",
        userId: "user_001",
        severity: "warning",
        title: "Workout could not be placed",
        message: "Workout did not receive a valid draft placement in this planning window.",
        affectedBlockIds: ["candidate_workout"],
        affectedUserDayDate: "2026-05-05",
        affectedUserWeekStartDate: "2026-05-02",
        suggestedFixes: [],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: "2026-05-03T08:00:00-05:00",
        updatedAt: "2026-05-03T08:00:00-05:00",
      },
    ];

    const result = generateSuggestedFixes({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks: [],
      unplacedCandidates,
    });

    expect(result.frictionPoints[0]?.suggestedFixes).toEqual([
      { id: "fix_move_candidate_workout", label: "Move block", action: "moveBlock" },
      {
        id: "fix_convert_candidate_workout",
        label: "Convert to recovery",
        action: "convertToRecovery",
      },
      { id: "fix_skip_candidate_workout", label: "Skip block", action: "skipBlock" },
      {
        id: "fix_accept_candidate_workout",
        label: "Accept conflict",
        action: "acceptConflict",
      },
    ]);
  });

  it("falls back to the existing suggested fixes when no context is available", () => {
    const frictionPoints: FrictionPoint[] = [
      {
        id: "friction_unknown",
        userId: "user_001",
        severity: "info",
        title: "Unknown issue",
        message: "An issue needs review.",
        affectedBlockIds: ["missing_id"],
        suggestedFixes: [
          {
            id: "fix_existing",
            label: "Accept conflict",
            action: "acceptConflict",
          },
        ],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: "2026-05-03T08:00:00-05:00",
        updatedAt: "2026-05-03T08:00:00-05:00",
      },
    ];

    const result = generateSuggestedFixes({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks: [],
      unplacedCandidates: [],
    });

    expect(result.frictionPoints[0]?.suggestedFixes).toEqual([
      {
        id: "fix_existing",
        label: "Accept conflict",
        action: "acceptConflict",
      },
    ]);
  });
});
