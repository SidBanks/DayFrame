/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { DraftScheduledBlock } from "../../core/blocks/types.js";
import { DayVisualizer } from "../DayVisualizer.js";
import type { GeneratedWorkBlock } from "../../core/shifts/types.js";

afterEach(() => {
  cleanup();
});

describe("DayVisualizer", () => {
  it("scales and labels a longer canonical user-day using its actual window", () => {
    render(
      <DayVisualizer
        dayBoundaryStartTime="03:00"
        scheduledBlocks={[
          {
            ...buildScheduledBlock(),
            startsAt: new Date(2026, 4, 6, 3),
            endsAt: new Date(2026, 4, 6, 6),
          },
        ]}
        selectedUserDayDate="2026-05-05"
        userDayStart={new Date(2026, 4, 5, 3)}
        userDayEnd={new Date(2026, 4, 6, 6)}
        workBlocks={[]}
      />,
    );
    expect(screen.getByText("A read-only view across this 27-hour user-day.")).toBeInTheDocument();
    const block = screen.getByLabelText("Scheduled block: Workout, 3:00 AM - 6:00 AM");
    expect(Number.parseFloat((block as HTMLElement).style.top)).toBeCloseTo(88.89, 1);
    expect(Number.parseFloat((block as HTMLElement).style.height)).toBeCloseTo(11.11, 1);
  });

  it("renders an empty state when the selected day has no blocks", () => {
    render(
      <DayVisualizer
        dayBoundaryStartTime="03:00"
        scheduledBlocks={[]}
        selectedUserDayDate="2026-05-05"
        workBlocks={[]}
      />,
    );

    expect(screen.getByLabelText("Day visualizer for 2026-05-05")).toBeInTheDocument();
    expect(screen.getByText("No work or scheduled blocks on this day.")).toBeInTheDocument();
  });

  it("renders work and scheduled blocks for the selected day", () => {
    render(
      <DayVisualizer
        dayBoundaryStartTime="03:00"
        scheduledBlocks={[buildScheduledBlock()]}
        selectedUserDayDate="2026-05-05"
        workBlocks={[buildWorkBlock()]}
      />,
    );

    expect(screen.getByLabelText("Work block: Day Shift, 5:45 AM - 2:15 PM")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Scheduled block: Workout, 2:15 PM - 3:15 PM"),
    ).toBeInTheDocument();
    expect(screen.getByText("3:00 AM")).toBeInTheDocument();
    expect(screen.getByText("2:00 AM")).toBeInTheDocument();
  });

  it("marks overlapping blocks with overlap styling", () => {
    render(
      <DayVisualizer
        dayBoundaryStartTime="03:00"
        scheduledBlocks={[
          buildScheduledBlock(),
          {
            ...buildScheduledBlock(),
            id: "scheduled_focus",
            title: "Deep Focus",
            startsAt: new Date(2026, 4, 5, 14, 30, 0, 0),
            endsAt: new Date(2026, 4, 5, 16, 0, 0, 0),
          },
        ]}
        selectedUserDayDate="2026-05-05"
        workBlocks={[]}
      />,
    );

    const workoutBlock = screen.getByLabelText("Scheduled block: Workout, 2:15 PM - 3:15 PM");
    const focusBlock = screen.getByLabelText("Scheduled block: Deep Focus, 2:30 PM - 4:00 PM");

    expect(workoutBlock).toHaveClass("df-day-visualizer-block--overlap");
    expect(focusBlock).toHaveClass("df-day-visualizer-block--overlap");
  });

  it("renders overnight blocks that extend past midnight within the same user day", () => {
    render(
      <DayVisualizer
        dayBoundaryStartTime="03:00"
        scheduledBlocks={[
          {
            ...buildScheduledBlock(),
            id: "scheduled_sleep",
            title: "Sleep",
            startsAt: new Date(2026, 4, 5, 19, 0, 0, 0),
            endsAt: new Date(2026, 4, 6, 3, 0, 0, 0),
          },
        ]}
        selectedUserDayDate="2026-05-05"
        workBlocks={[]}
      />,
    );

    expect(screen.getByLabelText("Scheduled block: Sleep, 7:00 PM - 3:00 AM")).toBeInTheDocument();
  });

  it("renders 8-hour sleep with a visual height based on the full block duration", () => {
    render(
      <DayVisualizer
        dayBoundaryStartTime="03:00"
        scheduledBlocks={[
          {
            ...buildScheduledBlock(),
            id: "scheduled_sleep",
            title: "Sleep",
            category: "sleep",
            startsAt: new Date(2026, 4, 5, 19, 0, 0, 0),
            endsAt: new Date(2026, 4, 6, 3, 0, 0, 0),
          },
        ]}
        selectedUserDayDate="2026-05-05"
        workBlocks={[]}
      />,
    );

    const sleepBlock = screen.getByLabelText("Scheduled block: Sleep, 7:00 PM - 3:00 AM");
    const height = Number.parseFloat((sleepBlock as HTMLElement).style.height);

    expect(height).toBeCloseTo(33.33, 1);
    expect(sleepBlock).toHaveAttribute("title", "Sleep: 7:00 PM - 3:00 AM");
  });

  it("keeps work full-width while overlaying overlapping sleep for night-shift layouts", () => {
    render(
      <DayVisualizer
        dayBoundaryStartTime="03:00"
        scheduledBlocks={[
          {
            ...buildScheduledBlock(),
            id: "scheduled_sleep",
            title: "Sleep",
            category: "sleep",
            startsAt: new Date(2026, 4, 5, 12, 15, 0, 0),
            endsAt: new Date(2026, 4, 5, 20, 45, 0, 0),
          },
        ]}
        selectedUserDayDate="2026-05-05"
        workBlocks={[
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
          {
            id: "work_shift_overlap_2026-05-05",
            shiftDefinitionId: "shift_overlap",
            userId: "user_001",
            title: "Prep Shift",
            startsAt: new Date(2026, 4, 5, 20, 0, 0, 0),
            endsAt: new Date(2026, 4, 5, 22, 30, 0, 0),
            startDate: "2026-05-05",
            endDate: "2026-05-05",
            userDayDate: "2026-05-05",
            crossesMidnight: false,
          },
        ]}
      />,
    );

    const workBlock = screen.getByLabelText("Work block: Prep Shift, 8:00 PM - 10:30 PM");
    const sleepBlock = screen.getByLabelText("Scheduled block: Sleep, 12:15 PM - 8:45 PM");

    expect(workBlock).toHaveClass("df-day-visualizer-block--work");
    expect(sleepBlock).toHaveClass("df-day-visualizer-block--scheduled-overlay");
    expect((workBlock as HTMLElement).style.width).toBe("calc(100% - 12px)");
    expect((sleepBlock as HTMLElement).style.width).toBe("calc(76% - 12px)");
  });
});

function buildWorkBlock(): GeneratedWorkBlock {
  return {
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
  };
}

function buildScheduledBlock(): DraftScheduledBlock {
  return {
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
  };
}
