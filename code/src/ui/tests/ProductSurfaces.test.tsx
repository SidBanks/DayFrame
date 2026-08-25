/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlannerSurface } from "../PlannerSurface.js";
import { TodaySurface } from "../TodaySurface.js";

afterEach(cleanup);

describe("product surface boundaries", () => {
  it("composes the existing Planner mode contract without owning its content state", () => {
    const openPlan = vi.fn();
    const openSchedule = vi.fn();
    const { rerender } = render(
      <PlannerSurface
        isSetupDirty={false}
        mode="plan"
        onOpenPlan={openPlan}
        onOpenSchedule={openSchedule}
        planContent={<p>Existing Plan content</p>}
        previewState="none"
        scheduleContent={<p>Existing Schedule content</p>}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Planner" })).toBeInTheDocument();
    expect(screen.getByText("Existing Plan content")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Review Schedule" }));
    expect(openSchedule).toHaveBeenCalledTimes(1);

    rerender(
      <PlannerSurface
        isSetupDirty
        mode="schedule"
        onOpenPlan={openPlan}
        onOpenSchedule={openSchedule}
        planContent={<p>Existing Plan content</p>}
        previewState="stale"
        scheduleContent={<p>Existing Schedule content</p>}
      />,
    );
    expect(screen.getByText("Existing Schedule content")).toBeInTheDocument();
    expect(screen.getByText(/Plan has unsaved changes/)).toBeInTheDocument();
  });

  it("keeps Today truthful and free of mutation controls", async () => {
    render(
      <TodaySurface
        now={() => new Date("2026-08-24T15:00:00.000Z")}
        onOpenPlanner={vi.fn()}
        queryToday={async () => ({
          status: "planUnavailable",
          reason: "noPublication",
          evaluationAsOf: "2026-08-24T15:00:00.000Z",
          userDayDate: "2026-08-24",
        })}
        reportingStore={{
          recordExecution: vi.fn(() => ({
            status: "rejected" as const,
            reason: "allocationFailure" as const,
          })),
          correctExecutionRecord: vi.fn(() => ({
            status: "rejected" as const,
            reason: "allocationFailure" as const,
          })),
          retractExecutionRecord: vi.fn(() => ({
            status: "rejected" as const,
            reason: "allocationFailure" as const,
          })),
        }}
        subscribeExecutionHistory={() => () => undefined}
        subscribeHistoricalPlan={() => () => undefined}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Today" })).toBeInTheDocument();
    expect(await screen.findByText(/No published plan is available/)).toBeInTheDocument();
    expect(screen.queryByText(/nothing scheduled/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /complete|partial|skip|move|resolve|record/i }),
    ).not.toBeInTheDocument();
  });
});
