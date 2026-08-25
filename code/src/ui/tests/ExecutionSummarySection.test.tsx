/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type {
  ExecutionRecordId,
  ExecutionSubjectId,
} from "../../core/execution/executionRecord.js";
import { createReadyDayFrameTestStore } from "../../state/tests/dayFrameStoreTestUtils.js";
import { DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY } from "../../state/executionHistorySurface.js";
import { ExecutionSummarySection } from "../ExecutionSummarySection.js";

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

describe("ExecutionSummarySection", () => {
  it("renders categorical all-history counts and explicit no-Preview coverage without percentages", () => {
    const store = createReadyDayFrameTestStore(undefined, {
      allocateExecutionRecordId: () => "00000000-0000-4000-8000-000000000001" as ExecutionRecordId,
      allocateExecutionSubjectId: () =>
        "00000000-0000-4000-8000-000000000002" as ExecutionSubjectId,
      executionHistoryClock: () => "2026-08-21T12:00:00.000Z",
    });
    store.recordExecution({
      subject: { kind: "unplanned" },
      outcome: "partial",
      snapshot: {
        sourceFamily: "unplanned",
        title: "Extra activity",
        category: "optional",
        userDay: { date: "2026-08-20", dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
        plan: { state: "unplanned" },
      },
    });
    const { container } = render(
      <ExecutionSummarySection authoredSetup={store.getState()} preview={null} store={store} />,
    );
    expect(screen.getByRole("heading", { name: "Reported outcomes" })).toBeInTheDocument();
    expect(screen.getByText("Across all execution history")).toBeInTheDocument();
    expect(
      screen.getByText("Generate a preview to see current reporting coverage."),
    ).toBeInTheDocument();
    expect(container.textContent).not.toContain("%");
    expect(container.textContent).not.toMatch(/adherence|success rate|goal progress/i);
  });

  it("suppresses safe-empty counts when history ingress is protected", () => {
    localStorage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, "not-json");
    const store = createReadyDayFrameTestStore();
    render(
      <ExecutionSummarySection authoredSetup={store.getState()} preview={null} store={store} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Execution history needs recovery before outcomes can be summarized.",
    );
    expect(screen.queryByText("No outcomes reported in this period.")).not.toBeInTheDocument();
  });
});
