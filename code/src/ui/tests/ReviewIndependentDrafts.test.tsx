/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { v14RestoreFixture as fixture } from "./v14RestoreFixture.js";
import { DayFrameApp } from "../DayFrameApp.js";
afterEach(cleanup);
it("Review and Summary preserve Measurement and Observation corrections at their original revisions", async () => {
  const { store, goalId } = await fixture();
  const measurement = store.listMeasurementDefinitionHistory(goalId).at(-1)!;
  const observation = store.exportProgressObservationAuthority().observations[0]!;
  const revise = vi.spyOn(store, "reviseMeasurementDefinition"),
    correct = vi.spyOn(store, "correctProgressObservation");
  render(<DayFrameApp store={store} />);
  fireEvent.click(screen.getByRole("button", { name: "Goals" }));
  fireEvent.click(await screen.findByRole("button", { name: /Source A restored Goal/ }));
  fireEvent.click(await screen.findByRole("button", { name: "Change Measurement" }));
  fireEvent.change(screen.getByLabelText("Quantity target"), { target: { value: "999" } });
  fireEvent.click(screen.getByRole("button", { name: /Correct record: 17 words/ }));
  fireEvent.change(screen.getByLabelText("Current value"), { target: { value: "23" } });
  fireEvent.click(
    within(screen.getByRole("navigation", { name: "Planner modes" })).getByRole("button", {
      name: "Review Schedule",
    }),
  );
  await screen.findByRole("heading", { name: "Review readiness" });
  fireEvent.click(screen.getByRole("button", { name: "Refresh review" }));
  fireEvent.click(screen.getByRole("button", { name: "Summary" }));
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  fireEvent.click(screen.getByRole("button", { name: "Goals" }));
  expect(await screen.findByLabelText("Quantity target")).toHaveValue("999");
  expect(screen.getByLabelText("Current value")).toHaveValue("23");
  expect(revise).not.toHaveBeenCalled();
  expect(correct).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Save Correction" }));
  await waitFor(() =>
    expect(correct).toHaveBeenCalledWith(
      expect.objectContaining({
        id: observation.id,
        expectedRevision: observation.revision,
        value: "23",
      }),
    ),
  );
  fireEvent.click(screen.getByRole("button", { name: "Save Measurement Changes" }));
  await waitFor(() =>
    expect(revise).toHaveBeenCalledWith(measurement.id, measurement.revision, expect.anything(), {
      targetValue: "999",
      unitId: "words",
    }),
  );
});
