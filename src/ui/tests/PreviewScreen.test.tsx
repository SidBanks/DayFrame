/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PreviewScreen } from "../PreviewScreen.js";
import type { DayFramePreview } from "../../state/types.js";

afterEach(() => {
  cleanup();
});

describe("PreviewScreen", () => {
  it("renders an empty state when no preview is available", () => {
    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        preview={null}
        onApplySuggestedFix={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "DayFrame Preview" })).toBeInTheDocument();
    expect(screen.getByText("No preview generated yet.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Generate a preview to see work blocks, placed life blocks, and any friction that still needs review.",
      ),
    ).toBeInTheDocument();
  });

  it("renders preview metadata, summary, and day groups", () => {
    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        preview={buildPreview()}
        onApplySuggestedFix={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Summary" })).toBeInTheDocument();
    expect(screen.getByText("Planning Window")).toBeInTheDocument();
    expect(screen.getByText("May 5-6, 2026")).toBeInTheDocument();
    expect(screen.getByText("Generated")).toBeInTheDocument();
    expect(screen.getByText("Today at 1:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Revised")).toBeInTheDocument();
    expect(screen.getByText("Today at 2:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Friction Counts")).toBeInTheDocument();
    expect(screen.getByText("1 total, 0 critical, 1 warning")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tuesday, 2026-05-05" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "Work" })).toHaveLength(2);
    expect(screen.getAllByRole("heading", { name: "Scheduled" })).toHaveLength(2);
    expect(screen.getAllByRole("heading", { name: "Unplaced" })).toHaveLength(2);
    expect(screen.getAllByRole("heading", { name: "Friction" })).toHaveLength(2);
    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(2);
    expect(screen.getByLabelText("Day visualizer for 2026-05-05")).toBeInTheDocument();
    expect(screen.getByText("Day Shift 5:45 AM - 2:15 PM")).toBeInTheDocument();
    expect(screen.getByText("Workout 2:15 PM - 3:15 PM")).toBeInTheDocument();
    expect(screen.getAllByText("(Priority 2)")).toHaveLength(2);
    expect(screen.getByText("Schedule Review - needs placement")).toBeInTheDocument();
    expect(screen.getByText("Workout conflicts with Work")).toBeInTheDocument();
  });

  it("renders manual events separately from generated scheduled blocks", () => {
    const preview = buildPreview();

    preview.result.scheduledBlocks.push({
      id: "manual_event_dinner",
      userId: "user_001",
      templateId: "manual_event_dinner",
      source: "manual",
      title: "Dinner Reservation",
      category: "admin",
      startsAt: new Date(2026, 4, 5, 18, 0, 0, 0),
      endsAt: new Date(2026, 4, 5, 19, 30, 0, 0),
      userDayDate: "2026-05-05",
      userWeekStartDate: "2026-05-02",
      priority: 2,
      status: "planned",
      externalResources: [],
    });

    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        preview={preview}
        onApplySuggestedFix={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("heading", { name: "Manual Events" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Dinner Reservation 6:00 PM - 7:30 PM")).toBeInTheDocument();
    expect(screen.getByText("(Manual event)")).toBeInTheDocument();
    expect(screen.getByText("Workout 2:15 PM - 3:15 PM")).toBeInTheDocument();
  });

  it("calls onApplySuggestedFix when the user clicks a suggested fix", () => {
    const onApplySuggestedFix = vi.fn();

    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        preview={buildPreview()}
        onApplySuggestedFix={onApplySuggestedFix}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Move block" }));

    expect(onApplySuggestedFix).toHaveBeenCalledTimes(1);
    expect(onApplySuggestedFix).toHaveBeenCalledWith({
      selectedFrictionPointId: "friction_conflict_1",
      selectedSuggestedFixId: "fix_move_scheduled_workout",
    });
  });

  it("renders preview action guidance when present", () => {
    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        preview={buildPreview(undefined, {
          message: "Edit this block's fixed start time in Setup, then generate a new preview.",
          tone: "info",
        })}
        onApplySuggestedFix={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Edit this block's fixed start time in Setup, then generate a new preview."),
    ).toBeInTheDocument();
  });

  it("renders preview range warnings after generation", () => {
    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        onApplySuggestedFix={vi.fn()}
        preview={buildPreview()}
        rangeWarnings={[
          {
            id: "previewHasNoWorkSchedule",
            message: "No work schedule applies to part of this preview range.",
          },
        ]}
      />,
    );

    expect(screen.getByText("Preview range warnings:")).toBeInTheDocument();
    expect(
      screen.getByText("No work schedule applies to part of this preview range."),
    ).toBeInTheDocument();
  });

  it("keeps a scheduled block visible on each visible day it overlaps across a user-day boundary", () => {
    const preview = buildPreview();

    preview.result.generatedWorkBlocks = [];
    preview.result.scheduledBlocks = [
      {
        id: "scheduled_sleep",
        userId: "user_001",
        templateId: "default_sleep",
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
    ];
    preview.result.unplacedCandidates = [];
    preview.result.frictionPoints = [];

    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        preview={preview}
        onApplySuggestedFix={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Tuesday, 2026-05-05" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Wednesday, 2026-05-06" })).toBeInTheDocument();
    expect(screen.getAllByText("Sleep 10:00 PM - 6:00 AM")).toHaveLength(2);
    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(2);
  });

  it("shows updated priority and rescheduled state in the visible preview", () => {
    const preview = buildPreview();

    preview.result.scheduledBlocks[0] = {
      ...preview.result.scheduledBlocks[0]!,
      priority: 4,
      status: "rescheduled",
    };

    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        preview={preview}
        onApplySuggestedFix={vi.fn()}
      />,
    );

    expect(screen.getByText("Workout 2:15 PM - 3:15 PM")).toBeInTheDocument();
    expect(screen.getByText("(Priority 4, rescheduled)")).toBeInTheDocument();
  });

  it("hides ignored friction from the visible preview summary and day groups", () => {
    const preview = buildPreview();

    preview.result.frictionPoints[0] = {
      ...preview.result.frictionPoints[0]!,
      ignored: true,
      resolved: true,
    };

    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        preview={preview}
        onApplySuggestedFix={vi.fn()}
      />,
    );

    expect(screen.getByText("0 total, 0 critical, 0 warning")).toBeInTheDocument();
    expect(screen.queryByText("Workout conflicts with Work")).not.toBeInTheDocument();
    expect(screen.getAllByText("No friction detected.")).toHaveLength(2);
  });

  it("shows cross-boundary conflict friction on a visible day without adding an out-of-range day card", () => {
    const preview = buildPreview();

    preview.rangeStartDate = "2026-05-05";
    preview.rangeEndDate = "2026-05-05";
    preview.result.generatedWorkBlocks = [
      {
        id: "work_shift_early_2026-05-05",
        shiftDefinitionId: "shift_early",
        shiftCycleId: "cycle_001",
        shiftSegmentId: "segment_early",
        userId: "user_001",
        title: "Early Shift",
        startsAt: new Date(2026, 4, 5, 3, 30, 0, 0),
        endsAt: new Date(2026, 4, 5, 11, 30, 0, 0),
        startDate: "2026-05-05",
        endDate: "2026-05-05",
        userDayDate: "2026-05-05",
        crossesMidnight: false,
      },
    ];
    preview.result.scheduledBlocks = [
      {
        id: "scheduled_maintenance",
        userId: "user_001",
        templateId: "template_maintenance",
        source: "template",
        title: "Maintenance",
        category: "maintenance",
        startsAt: new Date(2026, 4, 5, 2, 30, 0, 0),
        endsAt: new Date(2026, 4, 5, 4, 30, 0, 0),
        userDayDate: "2026-05-04",
        userWeekStartDate: "2026-05-02",
        priority: 2,
        status: "planned",
        externalResources: [],
      },
    ];
    preview.result.unplacedCandidates = [];
    preview.result.frictionPoints = [
      {
        id: "friction_conflict_cross_boundary",
        userId: "user_001",
        severity: "warning",
        title: "Maintenance conflicts with Early Shift",
        message: "Maintenance overlaps the visible work block and still needs review.",
        affectedBlockIds: ["scheduled_maintenance", "work_shift_early_2026-05-05"],
        affectedUserDayDate: "2026-05-04",
        affectedUserWeekStartDate: "2026-05-02",
        suggestedFixes: [
          {
            id: "fix_review_cross_boundary",
            label: "Review fixed time",
            action: "changeFixedTime",
          },
        ],
        canIgnore: true,
        ignored: false,
        resolved: false,
        createdAt: "2026-05-03T13:00:00-05:00",
        updatedAt: "2026-05-03T14:00:00-05:00",
      },
    ];

    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        preview={preview}
        onApplySuggestedFix={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Tuesday, 2026-05-05" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Monday, 2026-05-04" })).not.toBeInTheDocument();
    expect(screen.getByText("Maintenance conflicts with Early Shift")).toBeInTheDocument();
    expect(screen.getByText("Maintenance 2:30 AM - 4:30 AM")).toBeInTheDocument();
  });

  it("annotates preview days with local static holidays inside the visible range", () => {
    const preview = buildPreview();

    preview.rangeStartDate = "2026-05-25";
    preview.rangeEndDate = "2026-05-26";
    preview.planningWindowStart = new Date(2026, 4, 25, 0, 0, 0, 0);
    preview.planningWindowEnd = new Date(2026, 4, 26, 0, 0, 0, 0);
    preview.result.generatedWorkBlocks = [];
    preview.result.scheduledBlocks = [];
    preview.result.unplacedCandidates = [];
    preview.result.frictionPoints = [];

    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 24, 16, 0, 0, 0)}
        preview={preview}
        onApplySuggestedFix={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Monday, 2026-05-25" })).toBeInTheDocument();
    expect(screen.getByText("Memorial Day")).toBeInTheDocument();
    expect(screen.getByText("(Federal holiday)")).toBeInTheDocument();
    expect(screen.queryByText("Juneteenth National Independence Day")).not.toBeInTheDocument();
  });

  it("limits preview summary friction counts to the selected visible day range", () => {
    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        onApplySuggestedFix={vi.fn()}
        preview={buildPreview()}
        visibleRangeEndDate="2026-05-06"
        visibleRangeStartDate="2026-05-06"
      />,
    );

    expect(screen.getByText("0 total, 0 critical, 0 warning")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Wednesday, 2026-05-06" })).toBeInTheDocument();
    expect(screen.queryByText("Workout conflicts with Work")).not.toBeInTheDocument();
    expect(screen.getByText("No friction detected.")).toBeInTheDocument();
  });

  it("groups repeated equivalent friction patterns while keeping individual fixes available", () => {
    const onApplySuggestedFix = vi.fn();
    const preview = buildPreview([
      {
        id: "fix_move_scheduled_workout",
        label: "Move block",
        action: "moveBlock" as const,
      },
    ]);

    preview.result.frictionPoints.push({
      id: "friction_conflict_2",
      userId: "user_001",
      severity: "warning",
      title: "Workout conflicts with Work",
      message: "Workout overlaps work and needs review.",
      affectedBlockIds: [],
      affectedUserDayDate: "2026-05-06",
      affectedUserWeekStartDate: "2026-05-02",
      suggestedFixes: [
        {
          id: "fix_move_scheduled_workout_day_2",
          label: "Move block",
          action: "moveBlock",
        },
      ],
      canIgnore: true,
      ignored: false,
      resolved: false,
      createdAt: "2026-05-03T13:00:00-05:00",
      updatedAt: "2026-05-03T14:00:00-05:00",
    });

    render(
      <PreviewScreen
        getDayBoundaryStartTimeForUserDayDate={() => "03:00"}
        now={new Date(2026, 4, 3, 16, 0, 0, 0)}
        onApplySuggestedFix={onApplySuggestedFix}
        preview={preview}
      />,
    );

    expect(screen.getByRole("heading", { name: "Repeated Friction Patterns" })).toBeInTheDocument();
    expect(screen.getByText("Appears on 2 days")).toBeInTheDocument();

    const groupedSection = screen.getByRole("heading", {
      name: "Repeated Friction Patterns",
    }).parentElement;

    expect(groupedSection).not.toBeNull();
    fireEvent.click(within(groupedSection!).getAllByRole("button", { name: "Move block" })[0]!);

    expect(onApplySuggestedFix).toHaveBeenCalled();
  });
});

function buildPreview(
  suggestedFixes = [
    {
      id: "fix_move_scheduled_workout",
      label: "Move block",
      action: "moveBlock" as const,
    },
  ],
  actionFeedback?: DayFramePreview["actionFeedback"],
): DayFramePreview {
  return {
    result: {
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
          startsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
          endsAt: new Date(2026, 4, 5, 15, 15, 0, 0),
          userDayDate: "2026-05-05",
          userWeekStartDate: "2026-05-02",
          priority: 2,
          status: "planned",
          externalResources: [],
        },
      ],
      unplacedCandidates: [
        {
          id: "candidate_review",
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
      ],
      frictionPoints: [
        {
          id: "friction_conflict_1",
          userId: "user_001",
          severity: "warning",
          title: "Workout conflicts with Work",
          message: "Workout overlaps work and needs review.",
          affectedBlockIds: ["scheduled_workout", "work_shift_day_2026-05-05"],
          affectedUserDayDate: "2026-05-05",
          affectedUserWeekStartDate: "2026-05-02",
          suggestedFixes: [...suggestedFixes],
          canIgnore: true,
          ignored: false,
          resolved: false,
          createdAt: "2026-05-03T13:00:00-05:00",
          updatedAt: "2026-05-03T14:00:00-05:00",
        },
      ],
    },
    rangeStartDate: "2026-05-05",
    rangeEndDate: "2026-05-06",
    planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
    planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
    generatedAt: "2026-05-03T13:00:00-05:00",
    revisedAt: "2026-05-03T14:00:00-05:00",
    ...(actionFeedback ? { actionFeedback } : {}),
    isStale: false,
  };
}
