import { describe, expect, it } from "vitest";

import type { BlockCandidate, DraftScheduledBlock } from "../../blocks/types.js";
import type { GeneratedWorkBlock } from "../../shifts/types.js";
import { applySuggestedFix } from "../applySuggestedFix.js";
import type { FrictionPoint } from "../types.js";

const revisedAt = "2026-05-03T09:00:00-05:00";

describe("applySuggestedFix", () => {
  it("marks a friction point ignored and resolved for acceptConflict", () => {
    const frictionPoints: FrictionPoint[] = [
      {
        id: "friction_conflict_1",
        userId: "user_001",
        severity: "warning",
        title: "Conflict",
        message: "Needs review.",
        affectedBlockIds: ["work_1", "scheduled_1"],
        suggestedFixes: [
          {
            id: "fix_accept_work_1_scheduled_1",
            label: "Accept conflict",
            action: "acceptConflict",
          },
        ],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: revisedAt,
        updatedAt: revisedAt,
      },
    ];

    const result = applySuggestedFix({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks: [],
      unplacedCandidates: [],
      selectedFrictionPointId: "friction_conflict_1",
      selectedSuggestedFixId: "fix_accept_work_1_scheduled_1",
      dayBoundaryStartTime: "03:00",
      revisedAt,
    });

    expect(result.frictionPoints[0]).toMatchObject({
      ignored: true,
      resolved: true,
      updatedAt: revisedAt,
    });
    expect(frictionPoints[0]?.ignored).toBe(false);
  });

  it("marks a scheduled block as skipped for skipBlock", () => {
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
        id: "friction_unplaced_1",
        userId: "user_001",
        severity: "warning",
        title: "Workout could not be placed",
        message: "Needs review.",
        affectedBlockIds: ["scheduled_workout"],
        suggestedFixes: [
          {
            id: "fix_skip_scheduled_workout",
            label: "Skip block",
            action: "skipBlock",
          },
        ],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: revisedAt,
        updatedAt: revisedAt,
      },
    ];

    const result = applySuggestedFix({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
      selectedFrictionPointId: "friction_unplaced_1",
      selectedSuggestedFixId: "fix_skip_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt,
    });

    expect(result.scheduledBlocks[0]).toMatchObject({
      id: "scheduled_workout",
      status: "skipped",
    });
    expect(result.frictionPoints[0]?.resolved).toBe(true);
    expect(scheduledBlocks[0]?.status).toBe("planned");
  });

  it("reduces duration on a scheduled block", () => {
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
        id: "friction_conflict_1",
        userId: "user_001",
        severity: "warning",
        title: "Conflict",
        message: "Needs review.",
        affectedBlockIds: ["scheduled_workout"],
        suggestedFixes: [
          {
            id: "fix_reduce_scheduled_workout",
            label: "Reduce duration",
            action: "reduceDuration",
          },
        ],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: revisedAt,
        updatedAt: revisedAt,
      },
    ];

    const result = applySuggestedFix({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
      selectedFrictionPointId: "friction_conflict_1",
      selectedSuggestedFixId: "fix_reduce_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt,
    });

    expect(result.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 14, 30, 0, 0).getTime(),
    );
  });

  it("converts a scheduled fitness block into a recovery block", () => {
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
        id: "friction_conflict_1",
        userId: "user_001",
        severity: "warning",
        title: "Conflict",
        message: "Needs review.",
        affectedBlockIds: ["scheduled_workout"],
        suggestedFixes: [
          {
            id: "fix_convert_scheduled_workout",
            label: "Convert to recovery",
            action: "convertToRecovery",
          },
        ],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: revisedAt,
        updatedAt: revisedAt,
      },
    ];

    const result = applySuggestedFix({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
      selectedFrictionPointId: "friction_conflict_1",
      selectedSuggestedFixId: "fix_convert_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt,
    });

    expect(result.scheduledBlocks[0]).toMatchObject({
      category: "recovery",
      title: "Recovery: Workout",
    });
    expect(result.scheduledBlocks[0]?.category).toBe("recovery");
  });

  it("changes priority on the second affected block", () => {
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
        id: "friction_conflict_critical",
        userId: "user_001",
        severity: "critical",
        title: "Critical conflict",
        message: "Needs review.",
        affectedBlockIds: ["scheduled_sleep", "scheduled_medication"],
        suggestedFixes: [
          {
            id: "fix_change_priority_scheduled_medication",
            label: "Change priority",
            action: "changePriority",
          },
        ],
        canIgnore: false,
        ignored: false,
        resolved: false,
        createdAt: revisedAt,
        updatedAt: revisedAt,
      },
    ];

    const result = applySuggestedFix({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
      selectedFrictionPointId: "friction_conflict_critical",
      selectedSuggestedFixId: "fix_change_priority_scheduled_medication",
      dayBoundaryStartTime: "03:00",
      revisedAt,
    });

    expect(result.scheduledBlocks[1]?.priority).toBe(2);
  });

  it("does not move a fixed scheduled block and leaves the friction unresolved", () => {
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
    ];
    const frictionPoints: FrictionPoint[] = [
      {
        id: "friction_conflict_fixed_workout",
        userId: "user_001",
        severity: "warning",
        title: "Workout conflicts with Sleep",
        message: "Needs review.",
        affectedBlockIds: ["scheduled_workout"],
        suggestedFixes: [
          {
            id: "fix_move_scheduled_workout",
            label: "Move block",
            action: "moveBlock",
          },
        ],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: revisedAt,
        updatedAt: revisedAt,
      },
    ];

    const result = applySuggestedFix({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
      selectedFrictionPointId: "friction_conflict_fixed_workout",
      selectedSuggestedFixId: "fix_move_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt,
    });

    expect(result.scheduledBlocks[0]?.startsAt.getTime()).toBe(
      scheduledBlocks[0]!.startsAt.getTime(),
    );
    expect(result.frictionPoints[0]?.resolved).toBe(false);
  });

  it("moves an unplaced candidate into the first available gap", () => {
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
    const unplacedCandidates: BlockCandidate[] = [
      {
        id: "candidate_workout",
        userId: "user_001",
        templateId: "template_workout",
        recurrenceId: "rec_workout",
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
        message: "Needs review.",
        affectedBlockIds: ["candidate_workout"],
        affectedUserDayDate: "2026-05-05",
        affectedUserWeekStartDate: "2026-05-02",
        suggestedFixes: [
          {
            id: "fix_move_candidate_workout",
            label: "Move block",
            action: "moveBlock",
          },
        ],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: revisedAt,
        updatedAt: revisedAt,
      },
    ];

    const result = applySuggestedFix({
      frictionPoints,
      generatedWorkBlocks,
      scheduledBlocks,
      unplacedCandidates,
      selectedFrictionPointId: "friction_unplaced_candidate_workout",
      selectedSuggestedFixId: "fix_move_candidate_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt,
    });

    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.scheduledBlocks).toHaveLength(2);
    expect(result.scheduledBlocks[1]).toMatchObject({
      id: "scheduled_candidate_workout",
      status: "rescheduled",
      title: "Workout",
    });
    expect(result.scheduledBlocks[1]?.startsAt.getTime()).toBe(
      new Date(2026, 4, 5, 4, 0, 0, 0).getTime(),
    );
    expect(result.scheduledBlocks[1]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 5, 0, 0, 0).getTime(),
    );
  });

  it("leaves a scheduled block in place when no valid same-day gap exists for moveBlock", () => {
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
        startsAt: new Date(2026, 4, 5, 3, 0, 0, 0),
        endsAt: new Date(2026, 4, 5, 4, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
      {
        id: "scheduled_buffer",
        userId: "user_001",
        templateId: "template_buffer",
        source: "template",
        title: "Buffer",
        category: "admin",
        startsAt: new Date(2026, 4, 5, 4, 0, 0, 0),
        endsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 3,
        status: "planned",
        externalResources: [],
      },
      {
        id: "scheduled_night",
        userId: "user_001",
        templateId: "template_night",
        source: "template",
        title: "Night Routine",
        category: "recovery",
        startsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
        endsAt: new Date(2026, 4, 6, 3, 0, 0, 0),
        userDayDate: "2026-05-05",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
    ];
    const frictionPoints: FrictionPoint[] = [
      {
        id: "friction_conflict_move_block",
        userId: "user_001",
        severity: "warning",
        title: "Workout conflicts with Buffer",
        message: "Needs review.",
        affectedBlockIds: ["scheduled_workout", "scheduled_buffer"],
        affectedUserDayDate: "2026-05-05",
        affectedUserWeekStartDate: "2026-05-02",
        suggestedFixes: [
          {
            id: "fix_move_scheduled_workout",
            label: "Move block",
            action: "moveBlock",
          },
        ],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: revisedAt,
        updatedAt: revisedAt,
      },
    ];

    const result = applySuggestedFix({
      frictionPoints,
      generatedWorkBlocks,
      scheduledBlocks,
      unplacedCandidates: [],
      selectedFrictionPointId: "friction_conflict_move_block",
      selectedSuggestedFixId: "fix_move_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt,
    });

    expect(result.scheduledBlocks[0]).toMatchObject({
      id: "scheduled_workout",
      startsAt: new Date(2026, 4, 5, 3, 0, 0, 0),
      endsAt: new Date(2026, 4, 5, 4, 0, 0, 0),
      status: "planned",
    });
    expect(result.actionFeedback).toEqual({
      message: "No safe automatic change is available for this conflict.",
      tone: "warning",
    });
    expect(result.didRevise).toBe(false);
  });

  it("treats changeFixedTime as a review action without throwing or mutating preview data", () => {
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
        id: "friction_conflict_fixed",
        userId: "user_001",
        severity: "warning",
        title: "Workout conflicts with Work",
        message: "Needs review.",
        affectedBlockIds: ["scheduled_workout", "work_shift_day_2026-05-05"],
        suggestedFixes: [
          {
            id: "fix_change_fixed_time_scheduled_workout",
            label: "Review fixed time",
            action: "changeFixedTime",
          },
        ],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: revisedAt,
        updatedAt: revisedAt,
      },
    ];

    const result = applySuggestedFix({
      frictionPoints,
      generatedWorkBlocks: [],
      scheduledBlocks,
      unplacedCandidates: [],
      selectedFrictionPointId: "friction_conflict_fixed",
      selectedSuggestedFixId: "fix_change_fixed_time_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt,
    });

    expect(result.scheduledBlocks[0]).toMatchObject({
      id: "scheduled_workout",
      anchorType: "fixedTemplate",
      placementType: "fixed",
      fixedStartTime: "06:00",
      startsAt: new Date(2026, 4, 5, 6, 0, 0, 0),
      endsAt: new Date(2026, 4, 5, 7, 0, 0, 0),
      status: "planned",
    });
    expect(result.frictionPoints[0]).toMatchObject({
      id: "friction_conflict_fixed",
      resolved: false,
      ignored: false,
      updatedAt: revisedAt,
    });
    expect(result.actionFeedback).toEqual({
      message:
        "Edit this block's fixed start time in Template Editor, then generate a new preview.",
      tone: "info",
    });
    expect(result.didRevise).toBe(false);
  });
});
