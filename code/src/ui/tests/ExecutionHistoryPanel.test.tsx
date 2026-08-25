/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type {
  ExecutionRecordId,
  ExecutionSubjectId,
} from "../../core/execution/executionRecord.js";
import { createReadyDayFrameTestStore } from "../../state/tests/dayFrameStoreTestUtils.js";
import { ExecutionHistoryPanel } from "../ExecutionHistoryPanel.js";

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

describe("ExecutionHistoryPanel", () => {
  it("shows durable frozen history without Preview and corrects, retracts, and re-reports immutably", () => {
    let record = 1;
    const store = createReadyDayFrameTestStore(undefined, {
      allocateExecutionRecordId: () =>
        `00000000-0000-4000-8000-${String(record++).padStart(12, "0")}` as ExecutionRecordId,
      allocateExecutionSubjectId: () =>
        "00000000-0000-4000-8000-000000000100" as ExecutionSubjectId,
      executionHistoryClock: () => `2026-08-2${record}T12:00:00.000Z`,
    });
    const accepted = store.recordExecution({
      subject: { kind: "unplanned" },
      outcome: "completed",
      snapshot: {
        sourceFamily: "unplanned",
        title: "Archived activity",
        category: "optional",
        userDay: { date: "2026-08-20", dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
        plan: { state: "unplanned" },
      },
    });
    expect(accepted.status).toBe("accepted");
    render(<ExecutionHistoryPanel store={store} />);
    expect(screen.getByRole("heading", { name: "Report history" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Review history for Archived activity" }));
    expect(screen.getByText("Unplanned activity · Aug 20, 2026")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Correct report" }));
    fireEvent.click(screen.getByRole("radio", { name: "Partial" }));
    expect(screen.queryByRole("radio", { name: "Skip" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save correction" }));
    expect(screen.getByLabelText("Current outcome: Partial")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retract report" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm retraction" }));
    expect(screen.getByLabelText("Current outcome: Not reported")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Report outcome" }));
    fireEvent.click(screen.getByRole("button", { name: "Save correction" }));
    expect(screen.getByLabelText("Current outcome: Completed")).toBeInTheDocument();
    expect(store.getExecutionHistory()).toHaveLength(4);
    expect(new Set(store.getExecutionHistory().map((entry) => entry.subjectId))).toHaveLength(1);
  });

  it("has a truthful empty state", () => {
    render(<ExecutionHistoryPanel store={createReadyDayFrameTestStore()} />);
    expect(screen.getByText("No outcomes reported yet.")).toBeInTheDocument();
  });
});
