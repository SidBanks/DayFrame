/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
    expect(screen.getByRole("heading", { name: "Work" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Scheduled" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Unplaced" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Friction" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Day Visualizer" })).toBeInTheDocument();
    expect(screen.getByLabelText("Day visualizer for 2026-05-05")).toBeInTheDocument();
    expect(screen.getByText("Day Shift 5:45 AM - 2:15 PM")).toBeInTheDocument();
    expect(screen.getByText("Workout 2:15 PM - 3:15 PM")).toBeInTheDocument();
    expect(screen.getAllByText("(Priority 2)")).toHaveLength(2);
    expect(screen.getByText("Schedule Review - needs placement")).toBeInTheDocument();
    expect(screen.getByText("Workout conflicts with Work")).toBeInTheDocument();
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
          message:
            "Edit this block's fixed start time in Template Editor, then generate a new preview.",
          tone: "info",
        })}
        onApplySuggestedFix={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        "Edit this block's fixed start time in Template Editor, then generate a new preview.",
      ),
    ).toBeInTheDocument();
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
    expect(screen.getByText("No friction detected.")).toBeInTheDocument();
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
    planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
    planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
    generatedAt: "2026-05-03T13:00:00-05:00",
    revisedAt: "2026-05-03T14:00:00-05:00",
    ...(actionFeedback ? { actionFeedback } : {}),
    isStale: false,
  };
}
