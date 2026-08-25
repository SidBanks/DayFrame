/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createReadyDayFrameTestStore } from "../../state/tests/dayFrameStoreTestUtils.js";
import { GoalSection } from "../GoalSection.js";

afterEach(cleanup);
describe("Planner Goal V1 workflow", () => {
  it("records, corrects, and removes absolute measured values without changing Goal or Measurement", async () => {
    const store = createReadyDayFrameTestStore();
    await store.initializeGoals();
    await store.initializeMeasurementDefinitions();
    await store.initializeProgressObservations();
    const created = await store.createGoal({ title: "Read books" });
    if (created.status !== "accepted") throw new Error("fixture");
    const measurement = await store.createMeasurementDefinition(
      created.goal.id,
      { id: "manualQuantityTarget", version: 1 },
      { targetValue: "12", unitId: "count" },
    );
    if (measurement.status !== "accepted") throw new Error("fixture");
    const goalBefore = structuredClone(store.getGoal(created.goal.id));
    const definitionsBefore = store.listMeasurementDefinitionHistory(created.goal.id);
    const previewBefore = structuredClone(store.getState().preview);
    render(<GoalSection store={store} state={store.getState()} />);
    fireEvent.click(screen.getByRole("button", { name: /Read books/ }));
    fireEvent.click(screen.getByRole("button", { name: "Record Current Value" }));
    const value = screen.getByLabelText("Current value");
    expect(value).toHaveFocus();
    expect(
      screen.getByText("Enter the current total, not the amount added since your last record."),
    ).toBeInTheDocument();
    fireEvent.change(value, { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: "Record Value" }));
    expect(await screen.findByText("Value recorded.")).toBeInTheDocument();
    expect(screen.getByText(/^0 count$/)).toBeInTheDocument();
    expect(store.getGoal(created.goal.id)).toEqual(goalBefore);
    expect(store.listMeasurementDefinitionHistory(created.goal.id)).toEqual(definitionsBefore);
    expect(store.getState().preview).toEqual(previewBefore);

    fireEvent.click(screen.getByRole("button", { name: /Correct record: 0 count/ }));
    expect(screen.getByLabelText("Current value")).toHaveValue("0");
    fireEvent.change(screen.getByLabelText("Current value"), { target: { value: "15" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Correction" }));
    expect(await screen.findByText("Correction saved.")).toBeInTheDocument();
    expect(screen.getByText("Corrected")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Remove invalid record: 15 count/ }));
    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus();
    fireEvent.click(within(dialog).getByRole("button", { name: "Remove Invalid Record" }));
    expect(await screen.findByText("Removed from measurement")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Correct record:/ })).not.toBeInTheDocument();
    expect(
      store.listProgressObservationHistory(
        store.exportProgressObservationAuthority().observations[0]!.id,
      ),
    ).toHaveLength(3);
  });

  it("configures, changes, stops, and restarts quantity measurement in Goal detail", async () => {
    const store = createReadyDayFrameTestStore();
    await store.initializeGoals();
    await store.initializeMeasurementDefinitions();
    const created = await store.createGoal({ title: "Write a book" });
    if (created.status !== "accepted") throw new Error("fixture");
    const goalBefore = structuredClone(store.getGoal(created.goal.id));
    const setupBefore = structuredClone(store.getState());
    render(<GoalSection store={store} state={store.getState()} />);
    fireEvent.click(screen.getByRole("button", { name: /Write a book/ }));
    expect(
      screen.getByText("This Goal is not currently measured with a quantity target."),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Set up Measurement" }));
    const target = screen.getByLabelText("Quantity target");
    expect(target).toHaveFocus();
    fireEvent.change(target, { target: { value: "50000" } });
    fireEvent.change(screen.getByLabelText("Unit"), { target: { value: "words" } });
    fireEvent.click(screen.getByRole("button", { name: "Start Measurement" }));
    expect(await screen.findByText("50000 words")).toBeInTheDocument();
    expect(store.getGoal(created.goal.id)).toEqual(goalBefore);
    expect(store.getState()).toEqual(setupBefore);

    fireEvent.click(screen.getByRole("button", { name: "Change Measurement" }));
    expect(screen.getByLabelText("Quantity target")).toHaveValue("50000");
    fireEvent.change(screen.getByLabelText("Unit"), { target: { value: "pages" } });
    expect(
      screen.getByText("DayFrame does not convert previous values between units."),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save Measurement Changes" }));
    expect(await screen.findByText("50000 pages")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Stop Measuring" }));
    expect(screen.getByRole("alertdialog")).toHaveTextContent("The Goal remains unchanged");
    fireEvent.click(
      within(screen.getByRole("alertdialog")).getByRole("button", { name: "Stop Measuring" }),
    );
    expect(
      await screen.findByText("Previous measurement settings and records are preserved."),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Restart Measurement" }));
    expect(screen.getByLabelText("Quantity target")).toHaveValue("50000");
    fireEvent.click(screen.getByRole("button", { name: "Restart Measurement" }));
    await waitFor(() =>
      expect(store.listMeasurementDefinitionHistory(created.goal.id)).toHaveLength(4),
    );
  });

  it("creates and edits a Goal independently of the scheduling plan and Preview", async () => {
    const store = createReadyDayFrameTestStore();
    await store.initializeGoals();
    const before = store.getState();
    render(<GoalSection store={store} state={before} />);
    fireEvent.click(screen.getByRole("button", { name: "Add Goal" }));
    fireEvent.change(screen.getByLabelText("Goal title"), { target: { value: "Earn Security+" } });
    fireEvent.change(screen.getByLabelText(/Target date/), { target: { value: "2027-01-15" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Goal" }));
    await screen.findByText("Goal saved.");
    expect(screen.getByRole("button", { name: /Earn Security\+/ })).toBeInTheDocument();
    expect(store.getState()).toEqual(before);
    fireEvent.click(screen.getByRole("button", { name: /Earn Security\+/ }));
    fireEvent.click(screen.getByRole("button", { name: "Edit Goal" }));
    fireEvent.change(screen.getByLabelText("Goal title"), { target: { value: "Pass Security+" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Goal" }));
    await screen.findByRole("heading", { name: "Pass Security+" });
    expect(store.listGoals()[0]).toMatchObject({
      title: "Pass Security+",
      targetDate: "2027-01-15",
    });
  });

  it("links, unlinks, completes, and reactivates without mutating commitments", async () => {
    const store = createReadyDayFrameTestStore({
      blockTemplates: [
        {
          id: "study",
          userId: "user_001",
          title: "Study",
          category: "work",
          requiresWorkAnchor: false,
          placementType: "flexible",
          durationMinutes: 60,
          bufferAfterMinutes: 0,
          priority: 1,
          preferredWindow: "anyAvailable",
          rescheduleBehavior: "askUser",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-08-23T12:00:00.000Z",
          updatedAt: "2026-08-23T12:00:00.000Z",
        },
      ],
      blockRecurrences: [],
    });
    await store.initializeGoals();
    const created = await store.createGoal({ title: "Certification" });
    if (created.status !== "accepted") throw new Error("fixture");
    const before = structuredClone(store.getState().blockTemplates);
    render(<GoalSection store={store} state={store.getState()} />);
    fireEvent.click(screen.getByRole("button", { name: /Certification/ }));
    fireEvent.change(screen.getByLabelText("Link an existing commitment"), {
      target: {
        value: screen.getByRole("option", { name: /Template: Study/ }).getAttribute("value"),
      },
    });
    await waitFor(() => expect(store.listGoals()[0]?.links).toHaveLength(1));
    expect(store.getState().blockTemplates).toEqual(before);
    const links = screen.getByRole("heading", { name: "Supporting commitments" }).parentElement!;
    fireEvent.click(within(links).getByRole("button", { name: /Unlink Study/ }));
    await waitFor(() => expect(store.listGoals()[0]?.links).toHaveLength(0));
    fireEvent.click(screen.getByRole("button", { name: "Mark Complete" }));
    await screen.findByText("Goal marked complete.");
    fireEvent.click(screen.getByRole("button", { name: /Certification/ }));
    fireEvent.click(screen.getByRole("button", { name: "Reactivate Goal" }));
    await screen.findByText("Goal reactivated.");
    expect(store.listGoals()[0]?.status).toBe("active");
  });
});
