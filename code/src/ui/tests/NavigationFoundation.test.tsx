/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { DayFrameApp } from "../DayFrameApp.js";
import { createDayFrameStore } from "../../state/dayFrameStore.js";
import { createDayFrameDurableDb } from "../../infrastructure/storage/dayFrameDurableDb.js";
async function ready(initial?: Parameters<typeof createDayFrameStore>[0]) {
  const store = createDayFrameStore(initial);
  expect(await store.whenReady()).toEqual({ status: "ready" });
  return store;
}

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: new IDBFactory() });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
const now = () => new Date(2030, 4, 6, 12);
const primary = () => within(screen.getByRole("navigation", { name: "App Sections" }));
const secondary = () => within(screen.getByRole("navigation", { name: "Planner modes" }));
const selectedDay = () =>
  document.querySelector(".df-foundation-day-nav time")?.getAttribute("datetime");

async function open(name: string) {
  fireEvent.click(secondary().getByRole("button", { name }));
  if (name === "Goals") await screen.findByRole("button", { name: "Add Goal" });
  if (name === "Review Schedule") await screen.findByRole("heading", { name: "Review Schedule" });
}

describe("Task 9.18 navigation foundation", () => {
  it("has exactly two primary destinations and four Planner destinations, mounting only selected content", async () => {
    render(<DayFrameApp store={await ready()} getNow={now} />);
    expect(
      primary()
        .getAllByRole("button")
        .map((b) => b.textContent),
    ).toEqual(["Planner", "Summary"]);
    expect(primary().getByRole("button", { name: "Planner" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      secondary()
        .getAllByRole("button")
        .map((b) => b.textContent),
    ).toEqual(["Calendar", "My Schedule", "Goals", "Review Schedule"]);
    expect(selectedDay()).toBe("2030-05-06");
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add Goal" })).not.toBeInTheDocument();
    await open("My Schedule");
    expect(screen.getByRole("heading", { name: "Work Pattern" })).toBeInTheDocument();
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    fireEvent.click(
      within(screen.getByRole("navigation", { name: "My Schedule" })).getByRole("button", {
        name: "Commitments",
      }),
    );
    expect(screen.getByRole("heading", { name: "Commitment Library" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Convert legacy Sleep setup" })).toBeInTheDocument();
    await open("Goals");
    expect(screen.queryByRole("heading", { name: "Planning Settings" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Commitment Library" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add Goal" }));
    expect(screen.getByLabelText("Goal title")).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await open("Review Schedule");
    expect(screen.getByRole("button", { name: "Generate Schedule" })).toBeInTheDocument();
    fireEvent.click(primary().getByRole("button", { name: "Summary" }));
    await screen.findByRole("heading", { name: "History" });
    expect(screen.queryByRole("navigation", { name: "Planner modes" })).not.toBeInTheDocument();
    fireEvent.click(primary().getByRole("button", { name: "Planner" }));
    expect(secondary().getByRole("button", { name: "Review Schedule" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("resolves both default and Today navigation against the effective segment boundary", async () => {
    let instant = new Date(2030, 4, 6, 5, 59);
    const store = await ready({
      schedulingPreferences: { dayBoundaryStartTime: "00:00", weekStartsOn: "monday" },
      shiftDefinitions: [
        {
          id: "shift",
          userId: "user",
          name: "Day shift",
          startTime: "09:00",
          endTime: "17:00",
          crossesMidnight: false,
          workDays: ["monday"],
          createdAt: "2030-05-01T00:00:00Z",
          updatedAt: "2030-05-01T00:00:00Z",
        },
      ],
      shiftCycles: [
        {
          id: "cycle",
          userId: "user",
          name: "Cycle",
          type: "fixedSegments",
          startsOnDate: "2030-05-01",
          endsOnDate: "2030-05-31",
          createdAt: "2030-05-01T00:00:00Z",
          updatedAt: "2030-05-01T00:00:00Z",
          segments: [
            {
              id: "segment",
              shiftCycleId: "cycle",
              shiftDefinitionId: "shift",
              startsOnDate: "2030-05-01",
              endsOnDate: "2030-05-31",
              schedulePreferences: { dayBoundaryStartTime: "06:00", weekStartsOn: "sunday" },
            },
          ],
        },
      ],
    });
    const query = vi.spyOn(store, "querySelectedDayEvidence");
    render(<DayFrameApp store={store} getNow={() => instant} />);
    expect(selectedDay()).toBe("2030-05-05");
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    await waitFor(() =>
      expect(query).toHaveBeenCalledWith({ ownerDay: "2030-05-05", asOf: instant.toISOString() }),
    );
    expect(primary().getByRole("button", { name: "Planner" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(selectedDay()).toBe("2030-05-05");
    await open("Calendar");
    instant = new Date(2030, 4, 6, 6, 1);
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(selectedDay()).toBe("2030-05-06");
    await waitFor(() =>
      expect(query).toHaveBeenLastCalledWith({
        ownerDay: "2030-05-06",
        asOf: instant.toISOString(),
      }),
    );
    expect(primary().queryByRole("button", { name: "Today" })).not.toBeInTheDocument();
    expect(await screen.findByText(/No schedule has been published/)).toBeInTheDocument();
  });

  it("preserves the selected month/day and subsection through Summary and explicit Back", async () => {
    const store = await ready();
    const authored = JSON.stringify(store.getState());
    render(<DayFrameApp store={store} getNow={now} />);
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    const selected = selectedDay();
    expect(selected).toBe("2030-06-06");
    await open("Goals");
    fireEvent.click(primary().getByRole("button", { name: "Summary" }));
    await screen.findByRole("heading", { name: "History" });
    fireEvent.click(primary().getByRole("button", { name: "Planner" }));
    expect(secondary().getByRole("button", { name: "Goals" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await open("Calendar");
    expect(selectedDay()).toBe(selected);
    expect(screen.getByRole("heading", { name: "June 2030" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(selectedDay()).toBe("2030-05-06");
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(selectedDay()).toBe(selected);
    expect(screen.getByRole("heading", { name: "June 2030" })).toBeInTheDocument();
    expect(JSON.stringify(store.getState())).toBe(authored);
  });

  it("keeps navigation observational across all durable owners after bootstrap", async () => {
    const db = createDayFrameDurableDb();
    const store = createDayFrameStore(undefined, { restoreIndexedDb: db });
    expect(await store.whenReady()).toEqual({ status: "ready" });
    const localWrites = vi.spyOn(Storage.prototype, "setItem");
    const writes = vi.spyOn(db, "mutate");
    const commands = [
      "commitAuthoredSetupTransaction",
      "acceptProposalOption",
      "realizeAcceptedAllocation",
      "acceptPlanDecision",
      "removePlanDecision",
      "publishScheduleRange",
      "recordExecution",
      "correctExecutionRecord",
      "retractExecutionRecord",
      "createProgressObservation",
      "createMeasurementDefinition",
      "authorSleepRequirement",
      "recordSleepExecution",
      "convertLegacySleepToFirstClass",
      "saveProfile",
      "generatePreview",
    ] as const;
    const spies = commands.map((name) => vi.spyOn(store, name));
    const before = JSON.stringify(store.getState());
    const decisions = store.getPlanDecisions();
    const execution = store.getExecutionHistory();
    render(<DayFrameApp store={store} getNow={now} />);
    await open("My Schedule");
    fireEvent.click(
      within(screen.getByRole("navigation", { name: "My Schedule" })).getByRole("button", {
        name: "Commitments",
      }),
    );
    await open("Goals");
    await open("Review Schedule");
    await screen.findByRole("heading", { name: "Review readiness" });
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    await screen.findByText(/No schedule has been published/);
    fireEvent.click(primary().getByRole("button", { name: "Summary" }));
    await screen.findByRole("heading", { name: "Sleep history" });
    fireEvent.click(screen.getByText("Settings and data", { selector: "summary" }));
    expect(screen.getByRole("button", { name: "Export Complete Backup" })).toBeVisible();
    await act(async () => {
      await store.exportHistoricalPlan();
    });
    expect(JSON.stringify(store.getState())).toBe(before);
    expect(store.getPlanDecisions()).toEqual(decisions);
    expect(store.getExecutionHistory()).toEqual(execution);
    for (const spy of spies) expect(spy).not.toHaveBeenCalled();
    expect(localWrites).not.toHaveBeenCalled();
    expect(writes).not.toHaveBeenCalled();
  });

  it("preserves protected published evidence through the Today compatibility path", async () => {
    const store = await ready();
    const evidence = await store.querySelectedDayEvidence({
      ownerDay: "2030-05-06",
      asOf: now().toISOString(),
    });
    if (evidence.status !== "projected") throw Error("fixture");
    vi.spyOn(store, "querySelectedDayEvidence").mockResolvedValue({
      ...evidence,
      published: { status: "protected", reason: "invalidBatch" },
      publicationCoverage: "protected",
    });
    render(<DayFrameApp store={store} getNow={now} />);
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(
      await screen.findByText(/Published schedule: information cannot currently be read safely/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/No schedule has been published/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Report outcome" })).not.toBeInTheDocument();
  });
});

it("Calendar opens an arbitrary day with real asOf, and Back restores the browsed month and chosen day", async () => {
  const store = await ready();
  const query = vi.spyOn(store, "querySelectedDayEvidence");
  const generate = vi.spyOn(store, "generatePreview"),
    publish = vi.spyOn(store, "publishScheduleRange");
  render(<DayFrameApp store={store} getNow={now} />);
  fireEvent.click(screen.getByRole("button", { name: "Next month" }));
  const cell = within(screen.getByRole("grid"))
    .getAllByRole("gridcell")
    .find((b) => b.getAttribute("aria-label")?.includes("June 12, 2030"))!;
  fireEvent.click(cell);
  await screen.findByRole("heading", { name: /June 12, 2030/ });
  await waitFor(() =>
    expect(query).toHaveBeenCalledWith({ ownerDay: "2030-06-12", asOf: now().toISOString() }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  expect(screen.getByRole("grid")).toBeInTheDocument();
  expect(selectedDay()).toBe("2030-06-12");
  expect(document.getElementById("month-heading")).toHaveTextContent("June 2030");
  expect(generate).not.toHaveBeenCalled();
  expect(publish).not.toHaveBeenCalled();
});
