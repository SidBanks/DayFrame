/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createReadyDayFrameTestStore } from "../../state/tests/dayFrameStoreTestUtils.js";
import { MonthlyPlannerSurface } from "../MonthlyPlannerSurface.js";

afterEach(cleanup);

function renderMonth(options?: { now?: Date }) {
  const store = createReadyDayFrameTestStore({
    schedulingPreferences: { dayBoundaryStartTime: "04:00", weekStartsOn: "sunday" },
    previewRange: {
      source: "custom",
      preset: "custom",
      startDate: "2026-08-01",
      endDate: "2026-08-31",
    },
  });
  const openPlan = vi.fn();
  const openReview = vi.fn();
  const contextualActions = {
    onAddCommitment: vi.fn(),
    onAddEvent: vi.fn(),
    onEditCommitment: vi.fn(),
    onEditEvent: vi.fn(),
    onEditWork: vi.fn(),
    onGenerateSchedule: vi.fn(),
    onOpenAttention: vi.fn(),
  };
  const now = options?.now ?? new Date(2026, 7, 10, 12);
  render(
    <MonthlyPlannerSurface
      getNow={() => new Date(now)}
      {...contextualActions}
      onOpenCommitmentLibrary={vi.fn()}
      onOpenPlanningSettings={openPlan}
      onOpenReview={openReview}
      onOpenWorkPattern={vi.fn()}
      isSetupDirty={false}
      previewState="none"
      readiness={{ status: "ready" }}
      state={store.getState()}
    />,
  );
  return { store, openPlan, openReview, ...contextualActions };
}

describe("MonthlyPlannerSurface", () => {
  it("renders a labelled seven-column grid with one roving tab stop and canonical current selection", () => {
    renderMonth();
    expect(screen.getByRole("heading", { name: "August 2026" })).toBeInTheDocument();
    const grid = screen.getByRole("grid", { name: "August 2026" });
    expect(within(grid).getAllByRole("columnheader")).toHaveLength(7);
    const cells = within(grid).getAllByRole("gridcell");
    expect(cells).toHaveLength(42);
    expect(cells.filter((cell) => cell.tabIndex === 0)).toHaveLength(1);
    const current = within(grid).getByRole("gridcell", {
      name: /Monday, August 10.*Selected.*Current DayFrame day/,
    });
    expect(current).toHaveAttribute("aria-selected", "true");
    expect(current).toHaveAttribute("aria-current", "date");
    expect(screen.getByRole("heading", { name: "Monday, August 10, 2026" })).toBeInTheDocument();
  });

  it("uses canonical before-boundary current day rather than the civil label", () => {
    renderMonth({ now: new Date(2026, 7, 10, 2) });
    expect(screen.getByRole("heading", { name: "Sunday, August 9, 2026" })).toBeInTheDocument();
    expect(
      screen.getByRole("gridcell", { name: /Sunday, August 9.*Current DayFrame day/ }),
    ).toHaveAttribute("aria-current", "date");
  });

  it("navigates months, adjacent cells, and current DayFrame day without writes", () => {
    const { store } = renderMonth();
    const before = structuredClone(store.getState());
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByRole("heading", { name: "September 2026" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
    const adjacent = screen.getByRole("gridcell", { name: /Sunday, July 26/ });
    fireEvent.click(adjacent);
    expect(screen.getByRole("heading", { name: "July 2026" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Current DayFrame day" }));
    expect(screen.getByRole("heading", { name: "August 2026" })).toBeInTheDocument();
    expect(store.getState()).toEqual(before);
  });

  it("implements arrow, row, Home/End, Page, and Enter/Space selection with distinct focus", () => {
    renderMonth();
    const selected = screen.getByRole("gridcell", { name: /Monday, August 10.*Selected/ });
    selected.focus();
    fireEvent.keyDown(selected, { key: "ArrowRight" });
    let focused = screen.getByRole("gridcell", { name: /Tuesday, August 11/ });
    expect(focused).toHaveFocus();
    expect(focused).toHaveAttribute("aria-selected", "false");
    fireEvent.keyDown(focused, { key: "ArrowDown" });
    focused = screen.getByRole("gridcell", { name: /Tuesday, August 18/ });
    expect(focused).toHaveFocus();
    fireEvent.keyDown(focused, { key: "Home" });
    focused = screen.getByRole("gridcell", { name: /Sunday, August 16/ });
    expect(focused).toHaveFocus();
    fireEvent.keyDown(focused, { key: "End" });
    focused = screen.getByRole("gridcell", { name: /Saturday, August 22/ });
    expect(focused).toHaveFocus();
    fireEvent.keyDown(focused, { key: "Enter" });
    expect(focused).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(focused, { key: "PageDown" });
    expect(screen.getByRole("heading", { name: "September 2026" })).toBeInTheDocument();
  });

  it("presents uncovered truth, planning range, and read-only workflow handoffs", () => {
    const { openPlan, openReview, onAddCommitment, onAddEvent, onGenerateSchedule } = renderMonth();
    expect(screen.getByText("This month is not generated.")).toBeInTheDocument();
    expect(
      screen.getByText(/Not generated. No current schedule coverage exists/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/free|available capacity/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open Review Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: "Planning settings" }));
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Event" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Add Commitment" })[0]!);
    expect(openReview).toHaveBeenCalledTimes(1);
    expect(openPlan).toHaveBeenCalledTimes(1);
    expect(onAddEvent).toHaveBeenCalledWith("2026-08-10");
    expect(onAddCommitment).toHaveBeenCalledTimes(1);
    expect(onGenerateSchedule).toHaveBeenCalledTimes(1);
  });

  it("shows truthful protected and unavailable branches instead of a fake empty Month", () => {
    const store = createReadyDayFrameTestStore();
    const props = {
      getNow: () => new Date(2026, 7, 10, 12),
      onAddCommitment: vi.fn(),
      onAddEvent: vi.fn(),
      onEditCommitment: vi.fn(),
      onEditEvent: vi.fn(),
      onEditWork: vi.fn(),
      onGenerateSchedule: vi.fn(),
      onOpenAttention: vi.fn(),
      onOpenCommitmentLibrary: vi.fn(),
      onOpenPlanningSettings: vi.fn(),
      onOpenReview: vi.fn(),
      onOpenWorkPattern: vi.fn(),
      isSetupDirty: false,
      previewState: "none" as const,
      state: store.getState(),
    };
    const { rerender } = render(
      <MonthlyPlannerSurface
        {...props}
        readiness={{ status: "protected", reason: "authorityRecoveryRequired" }}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(/needs recovery/);
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    rerender(<MonthlyPlannerSurface {...props} readiness={{ status: "initializing" }} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/loading or unavailable/);
  });
});
