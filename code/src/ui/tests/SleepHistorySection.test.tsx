/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SleepHistorySection } from "../SleepHistorySection.js";
import type { DayFrameStore } from "../../state/types.js";
afterEach(cleanup);
function setup() {
  return {
    querySleepHistory: vi.fn<DayFrameStore["querySleepHistory"]>(async () => ({
      status: "available",
      coverage: [],
      publications: [],
      unplanned: [],
    })),
    recordSleepExecution: vi.fn<DayFrameStore["recordSleepExecution"]>(async () => ({
      status: "rejected",
      reason: "invalidInput",
    })),
  };
}
it("unplanned Sleep uses explicit physical actuals without fabricating publication", async () => {
  const store = setup();
  render(
    <SleepHistorySection
      store={store}
      start="2026-11-01"
      end="2026-11-01"
      asOf="2026-11-02T00:00:00.000Z"
    />,
  );
  await waitFor(() => expect(store.querySleepHistory).toHaveBeenCalled());
  fireEvent.click(screen.getByText("Record unplanned Sleep", { selector: "summary" }));
  fireEvent.change(screen.getByLabelText("Actual Sleep start"), {
    target: { value: "2026-11-01T01:30" },
  });
  fireEvent.change(screen.getByLabelText("UTC offset at actual start (optional)"), {
    target: { value: "-06:00" },
  });
  fireEvent.change(screen.getByLabelText("Elapsed minutes"), { target: { value: "120" } });
  fireEvent.click(screen.getByRole("button", { name: "Record unplanned Sleep" }));
  await waitFor(() =>
    expect(store.recordSleepExecution).toHaveBeenCalledWith({
      kind: "reportUnplanned",
      outcome: "completed",
      actualTime: { occurredAt: "2026-11-01T07:30:00.000Z", durationMinutes: 120 },
    }),
  );
});
it("protected Sleep history is explicit and cannot masquerade as absence", async () => {
  const store = setup();
  store.querySleepHistory.mockResolvedValue({ status: "unavailableProtected" });
  render(
    <SleepHistorySection
      store={store}
      start="2026-09-17"
      end="2026-09-17"
      asOf="2026-09-18T00:00:00.000Z"
    />,
  );
  await screen.findByText("Sleep history: unavailableProtected.");
  expect(screen.queryByText("noPublication")).not.toBeInTheDocument();
  expect(store.recordSleepExecution).not.toHaveBeenCalled();
});
