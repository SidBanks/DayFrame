/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, it, expect, vi } from "vitest";
import { DayFrameApp } from "../DayFrameApp.js";
import { createReadyDayFrameTestStore } from "../../state/tests/dayFrameStoreTestUtils.js";
import { networkSummaryFixture } from "./acceptedSummaryFixtures.js";
afterEach(cleanup);
it("Summary range/filter/lineage survive Day and Goal drill-down and Back without changing Calendar or authority", async () => {
  const store = createReadyDayFrameTestStore();
  await store.initializeGoals();
  const state = JSON.stringify(store.getState());
  const query = vi
    .spyOn(store, "queryAcceptedPlanningEvidence")
    .mockResolvedValue(networkSummaryFixture().evidence);
  render(<DayFrameApp store={store} getNow={() => new Date("2026-09-06T12:00:00.000Z")} />);
  fireEvent.click(screen.getByRole("button", { name: "Summary" }));
  const summary = await screen.findByRole("region", { name: "Accepted planning" });
  const ui = within(summary);
  await ui.findByRole("heading", { name: "Network+ renamed" });
  fireEvent.change(ui.getByLabelText("Accepted planning start date"), {
    target: { value: "2026-09-04" },
  });
  fireEvent.change(ui.getByLabelText("Accepted planning end date"), {
    target: { value: "2026-09-04" },
  });
  fireEvent.click(ui.getByRole("button", { name: "Apply planning period" }));
  fireEvent.change(ui.getByLabelText("Scheduling state"), { target: { value: "realized" } });
  fireEvent.click(await ui.findByRole("button", { name: /Inspect planning:/ }));
  fireEvent.click(ui.getByRole("button", { name: "Inspect iteration 1" }));
  fireEvent.click(ui.getByRole("button", { name: /Inspect scheduled detail: Goal work/ }));
  fireEvent.click(ui.getByRole("button", { name: "View day" }));
  await screen.findByRole("heading", { name: /Day agenda/ });
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  await screen.findByText("Frozen title: Network+ Study");
  expect(screen.getByLabelText("Accepted planning start date")).toHaveValue("2026-09-04");
  expect(screen.getByLabelText("Scheduling state")).toHaveValue("realized");
  fireEvent.click(screen.getByRole("button", { name: "View Goal" }));
  await screen.findByText(/The linked Goal is no longer available/);
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  await screen.findByText("Frozen title: Network+ Study");
  expect(JSON.stringify(store.getState())).toBe(state);
  expect(query).toHaveBeenCalledTimes(4);
});
