import { describe, expect, it } from "vitest";

import type { GenerateSchedulePreviewResult } from "../generateSchedulePreview.js";
import { reviseSchedulePreview } from "../reviseSchedulePreview.js";

describe("reviseSchedulePreview", () => {
  it("applies a reduce-duration fix and refreshes friction detection", () => {
    const preview: GenerateSchedulePreviewResult = {
      generatedWorkBlocks: [],
      blockCandidates: [],
      scheduledBlocks: [
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
        {
          id: "scheduled_errands",
          userId: "user_001",
          templateId: "template_errands",
          source: "template",
          title: "Errands",
          category: "admin",
          startsAt: new Date(2026, 4, 5, 14, 30, 0, 0),
          endsAt: new Date(2026, 4, 5, 15, 30, 0, 0),
          userDayDate: "2026-05-05",
          userWeekStartDate: "2026-05-02",
          priority: 3,
          status: "planned",
          externalResources: [],
        },
      ],
      unplacedCandidates: [],
      frictionPoints: [
        {
          id: "friction_conflict_scheduled_workout_scheduled_errands",
          userId: "user_001",
          severity: "warning",
          title: "Workout conflicts with Errands",
          message: "Workout overlaps Errands and should be reviewed before schedule commit.",
          affectedBlockIds: ["scheduled_workout", "scheduled_errands"],
          affectedUserDayDate: "2026-05-05",
          affectedUserWeekStartDate: "2026-05-02",
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
          createdAt: "2026-05-03T10:00:00-05:00",
          updatedAt: "2026-05-03T10:00:00-05:00",
        },
      ],
    };

    const result = reviseSchedulePreview({
      preview,
      selectedFrictionPointId: "friction_conflict_scheduled_workout_scheduled_errands",
      selectedSuggestedFixId: "fix_reduce_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt: "2026-05-03T11:00:00-05:00",
    });

    expect(result.preview.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 14, 30, 0, 0).getTime(),
    );
    expect(result.preview.frictionPoints).toEqual([]);
    expect(result.didRevise).toBe(true);
    expect(preview.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 15, 0, 0, 0).getTime(),
    );
  });

  it("applies a move fix to an unplaced candidate and refreshes the preview", () => {
    const preview: GenerateSchedulePreviewResult = {
      generatedWorkBlocks: [
        {
          id: "work_shift_day_2026-05-05",
          shiftDefinitionId: "shift_day",
          shiftCycleId: "cycle_001",
          shiftSegmentId: "segment_day",
          userId: "user_001",
          title: "Day Shift",
          startsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
          endsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
          startDate: "2026-05-05",
          endDate: "2026-05-05",
          userDayDate: "2026-05-05",
          crossesMidnight: false,
        },
      ],
      blockCandidates: [
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
      ],
      scheduledBlocks: [
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
      ],
      unplacedCandidates: [
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
      ],
      frictionPoints: [
        {
          id: "friction_unplaced_candidate_workout",
          userId: "user_001",
          severity: "warning",
          title: "Workout could not be placed",
          message: "Workout did not receive a valid draft placement in this planning window.",
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
          createdAt: "2026-05-03T10:00:00-05:00",
          updatedAt: "2026-05-03T10:00:00-05:00",
        },
      ],
    };

    const result = reviseSchedulePreview({
      preview,
      selectedFrictionPointId: "friction_unplaced_candidate_workout",
      selectedSuggestedFixId: "fix_move_candidate_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt: "2026-05-03T11:00:00-05:00",
    });

    expect(result.preview.unplacedCandidates).toHaveLength(0);
    expect(result.preview.scheduledBlocks).toHaveLength(2);
    expect(result.preview.scheduledBlocks[1]).toMatchObject({
      id: "scheduled_candidate_workout",
      status: "rescheduled",
    });
    expect(result.preview.frictionPoints).toEqual([]);
    expect(result.didRevise).toBe(true);
  });

  it("accepts a conflict and keeps it ignored in the refreshed preview state", () => {
    const preview: GenerateSchedulePreviewResult = {
      generatedWorkBlocks: [
        {
          id: "work_shift_day_2026-05-05",
          shiftDefinitionId: "shift_day",
          shiftCycleId: "cycle_001",
          shiftSegmentId: "segment_day",
          userId: "user_001",
          title: "Day Shift",
          startsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
          endsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
          startDate: "2026-05-05",
          endDate: "2026-05-05",
          userDayDate: "2026-05-05",
          crossesMidnight: false,
        },
      ],
      blockCandidates: [],
      scheduledBlocks: [
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
      ],
      unplacedCandidates: [],
      frictionPoints: [
        {
          id: "friction_conflict_work_shift_day_2026-05-05_scheduled_workout",
          userId: "user_001",
          severity: "warning",
          title: "Day Shift conflicts with Workout",
          message: "Needs review.",
          affectedBlockIds: ["work_shift_day_2026-05-05", "scheduled_workout"],
          suggestedFixes: [
            {
              id: "fix_accept_work_shift_day_2026-05-05_scheduled_workout",
              label: "Accept conflict",
              action: "acceptConflict",
            },
          ],
          canIgnore: true,
          ignored: false,
          resolved: false,
          createdAt: "2026-05-03T10:00:00-05:00",
          updatedAt: "2026-05-03T10:00:00-05:00",
        },
      ],
    };

    const result = reviseSchedulePreview({
      preview,
      selectedFrictionPointId: "friction_conflict_work_shift_day_2026-05-05_scheduled_workout",
      selectedSuggestedFixId: "fix_accept_work_shift_day_2026-05-05_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt: "2026-05-03T11:00:00-05:00",
    });

    expect(result.preview.frictionPoints).toHaveLength(1);
    expect(result.preview.frictionPoints[0]).toMatchObject({
      ignored: true,
      resolved: true,
      updatedAt: "2026-05-03T11:00:00-05:00",
    });
    expect(result.didRevise).toBe(true);
  });

  it("preserves the original preview inputs", () => {
    const preview: GenerateSchedulePreviewResult = {
      generatedWorkBlocks: [],
      blockCandidates: [],
      scheduledBlocks: [
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
      ],
      unplacedCandidates: [],
      frictionPoints: [
        {
          id: "friction_conflict_1",
          userId: "user_001",
          severity: "warning",
          title: "Conflict",
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
          createdAt: "2026-05-03T10:00:00-05:00",
          updatedAt: "2026-05-03T10:00:00-05:00",
        },
      ],
    };
    const originalPreview = structuredClone(preview);

    reviseSchedulePreview({
      preview,
      selectedFrictionPointId: "friction_conflict_1",
      selectedSuggestedFixId: "fix_skip_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt: "2026-05-03T11:00:00-05:00",
    });

    expect(preview).toEqual(originalPreview);
  });

  it("keeps unresolved friction after a revision when overlap still remains", () => {
    const preview: GenerateSchedulePreviewResult = {
      generatedWorkBlocks: [],
      blockCandidates: [],
      scheduledBlocks: [
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
        {
          id: "scheduled_errands",
          userId: "user_001",
          templateId: "template_errands",
          source: "template",
          title: "Errands",
          category: "admin",
          startsAt: new Date(2026, 4, 5, 14, 20, 0, 0),
          endsAt: new Date(2026, 4, 5, 15, 20, 0, 0),
          userDayDate: "2026-05-05",
          userWeekStartDate: "2026-05-02",
          priority: 3,
          status: "planned",
          externalResources: [],
        },
      ],
      unplacedCandidates: [],
      frictionPoints: [
        {
          id: "friction_conflict_scheduled_workout_scheduled_errands",
          userId: "user_001",
          severity: "warning",
          title: "Workout conflicts with Errands",
          message: "Workout overlaps Errands and should be reviewed before schedule commit.",
          affectedBlockIds: ["scheduled_workout", "scheduled_errands"],
          affectedUserDayDate: "2026-05-05",
          affectedUserWeekStartDate: "2026-05-02",
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
          createdAt: "2026-05-03T10:00:00-05:00",
          updatedAt: "2026-05-03T10:00:00-05:00",
        },
      ],
    };
    const revisedAt = "2026-05-03T11:45:00-05:00";

    const result = reviseSchedulePreview({
      preview,
      selectedFrictionPointId: "friction_conflict_scheduled_workout_scheduled_errands",
      selectedSuggestedFixId: "fix_reduce_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt,
    });

    expect(result.preview.scheduledBlocks[0]?.endsAt.getTime()).toBe(
      new Date(2026, 4, 5, 14, 30, 0, 0).getTime(),
    );
    expect(result.preview.frictionPoints).toHaveLength(1);
    expect(result.preview.frictionPoints[0]).toMatchObject({
      affectedUserDayDate: "2026-05-05",
      createdAt: revisedAt,
      updatedAt: revisedAt,
    });
    expect(result.preview.frictionPoints[0]?.suggestedFixes.length).toBeGreaterThan(0);
    expect(result.didRevise).toBe(true);
  });

  it("uses revisedAt consistently when refreshed friction remains", () => {
    const preview: GenerateSchedulePreviewResult = {
      generatedWorkBlocks: [],
      blockCandidates: [],
      scheduledBlocks: [
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
        {
          id: "scheduled_errands",
          userId: "user_001",
          templateId: "template_errands",
          source: "template",
          title: "Errands",
          category: "admin",
          startsAt: new Date(2026, 4, 5, 14, 25, 0, 0),
          endsAt: new Date(2026, 4, 5, 15, 25, 0, 0),
          userDayDate: "2026-05-05",
          userWeekStartDate: "2026-05-02",
          priority: 3,
          status: "planned",
          externalResources: [],
        },
      ],
      unplacedCandidates: [],
      frictionPoints: [
        {
          id: "friction_conflict_scheduled_workout_scheduled_errands",
          userId: "user_001",
          severity: "warning",
          title: "Workout conflicts with Errands",
          message: "Workout overlaps Errands and should be reviewed before schedule commit.",
          affectedBlockIds: ["scheduled_workout", "scheduled_errands"],
          affectedUserDayDate: "2026-05-05",
          affectedUserWeekStartDate: "2026-05-02",
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
          createdAt: "2026-05-03T10:00:00-05:00",
          updatedAt: "2026-05-03T10:00:00-05:00",
        },
      ],
    };
    const revisedAt = "2026-05-03T12:00:00-05:00";

    const result = reviseSchedulePreview({
      preview,
      selectedFrictionPointId: "friction_conflict_scheduled_workout_scheduled_errands",
      selectedSuggestedFixId: "fix_reduce_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt,
    });

    expect(result.preview.frictionPoints[0]).toMatchObject({
      createdAt: revisedAt,
      updatedAt: revisedAt,
    });
    expect(result.didRevise).toBe(true);
  });

  it("returns review guidance for review-fixed-time without marking the preview revised", () => {
    const preview: GenerateSchedulePreviewResult = {
      generatedWorkBlocks: [
        {
          id: "work_shift_day_2026-05-05",
          shiftDefinitionId: "shift_day",
          shiftCycleId: "cycle_001",
          shiftSegmentId: "segment_day",
          userId: "user_001",
          title: "Day Shift",
          startsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
          endsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
          startDate: "2026-05-05",
          endDate: "2026-05-05",
          userDayDate: "2026-05-05",
          crossesMidnight: false,
        },
      ],
      blockCandidates: [],
      scheduledBlocks: [
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
      ],
      unplacedCandidates: [],
      frictionPoints: [
        {
          id: "friction_conflict_work_fixed",
          userId: "user_001",
          severity: "warning",
          title: "Day Shift conflicts with Workout",
          message: "Needs review.",
          affectedBlockIds: ["work_shift_day_2026-05-05", "scheduled_workout"],
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
          createdAt: "2026-05-03T10:00:00-05:00",
          updatedAt: "2026-05-03T10:00:00-05:00",
        },
      ],
    };

    const result = reviseSchedulePreview({
      preview,
      selectedFrictionPointId: "friction_conflict_work_fixed",
      selectedSuggestedFixId: "fix_change_fixed_time_scheduled_workout",
      dayBoundaryStartTime: "03:00",
      revisedAt: "2026-05-03T11:00:00-05:00",
    });

    expect(result.preview).toEqual(preview);
    expect(result.didRevise).toBe(false);
    expect(result.actionFeedback).toEqual({
      message:
        "Edit this block's fixed start time in Template Editor, then generate a new preview.",
      tone: "info",
    });
  });
});
