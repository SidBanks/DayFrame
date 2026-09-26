/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { DayFrameApp } from "../DayFrameApp.js";
import { createReadyDayFrameTestStore } from "../../state/tests/dayFrameStoreTestUtils.js";
import { myScheduleFixture } from "./myScheduleFixtures.js";
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
const now = () => new Date("2026-09-21T12:00:00.000Z");
async function setup(count = 50) {
  const store = createReadyDayFrameTestStore(myScheduleFixture(count));
  await store.initializeComposition();
  render(<DayFrameApp store={store} getNow={now} />);
  fireEvent.click(screen.getByRole("button", { name: "My Schedule" }));
  return store;
}
it("provides three-domain landing and deterministic Back without writing", async () => {
  const store = await setup(),
    before = JSON.stringify(store.getState()),
    commit = vi.spyOn(store, "commitAuthoredSetupTransaction"),
    author = vi.spyOn(store, "authorSleepRequirement");
  expect(screen.getByRole("heading", { name: "Work Pattern" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Sleep" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Commitments" })).toBeInTheDocument();
  for (const name of ["Work Pattern", "Sleep", "Commitments"]) {
    fireEvent.click(
      within(screen.getByRole("navigation", { name: "My Schedule" })).getByRole("button", { name }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("button", { name: "View / Edit Sleep" })).toBeInTheDocument();
  }
  expect(JSON.stringify(store.getState())).toBe(before);
  expect(commit).not.toHaveBeenCalled();
  expect(author).not.toHaveBeenCalled();
});
it("50 Commitments are bounded; filters and focused duration editing preserve all hidden fields through canonical save", async () => {
  const store = await setup(),
    before = store.getState(),
    commit = vi.spyOn(store, "commitAuthoredSetupTransaction"),
    generate = vi.spyOn(store, "generatePreview"),
    accept = vi.spyOn(store, "acceptPlanDecision"),
    publish = vi.spyOn(store, "publishScheduleRange");
  fireEvent.click(screen.getByRole("button", { name: "View / Manage Commitments" }));
  expect(screen.getAllByRole("button", { name: /Edit commitment / })).toHaveLength(10);
  expect(screen.getByText(/Legacy Sleep Commitment/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Show more Commitments" }));
  expect(screen.getAllByRole("button", { name: /Edit commitment / })).toHaveLength(20);
  fireEvent.change(screen.getByLabelText("Search Commitments"), {
    target: { value: "Commitment 02" },
  });
  expect(screen.getAllByRole("button", { name: /Edit commitment / })).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: /Edit commitment Commitment 02/ }));
  expect(screen.getByLabelText("Duration hours")).toHaveValue(1);
  expect(screen.getByLabelText("Duration minutes")).toHaveValue(30);
  expect(screen.getByLabelText("Repeats")).toHaveValue("custom");
  fireEvent.change(screen.getByLabelText("Duration minutes"), { target: { value: "15" } });
  expect(store.getState()).toEqual(before);
  fireEvent.click(screen.getByRole("button", { name: "Update Commitment" }));
  expect(commit).not.toHaveBeenCalled();
  expect(store.getState()).toEqual(before);
  fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
  expect(commit).toHaveBeenCalledOnce();
  const after = store.getState();
  expect(after.blockTemplates[2]).toEqual({
    ...before.blockTemplates[2],
    durationMinutes: 75,
    updatedAt: after.blockTemplates[2]!.updatedAt,
  });
  expect(after.blockRecurrences).toEqual(before.blockRecurrences);
  expect(after.blockTemplates).toHaveLength(50);
  expect(generate).not.toHaveBeenCalled();
  expect(accept).not.toHaveBeenCalled();
  expect(publish).not.toHaveBeenCalled();
});
it("Work edits preserve rotation, dated overrides and overnight semantics, with explicit draft discard", async () => {
  const store = await setup(3),
    before = store.getState();
  fireEvent.click(screen.getByRole("button", { name: "View / Edit Work Pattern" }));
  expect(screen.getByLabelText("Day Boundary Start Time")).toHaveValue("03:00");
  fireEvent.change(screen.getByLabelText("Day Boundary Start Time"), {
    target: { value: "04:00" },
  });
  expect(store.getState()).toEqual(before);
  fireEvent.click(screen.getByRole("button", { name: "Discard unsaved setup changes" }));
  expect(screen.getByLabelText("Day Boundary Start Time")).toHaveValue("03:00");
  fireEvent.click(screen.getByRole("button", { name: "Edit Night shift" }));
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Night shift updated" } });
  fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
  expect(store.getState().shiftDefinitions[0]).toMatchObject({
    name: "Night shift updated",
    startTime: "22:00",
    endTime: "06:00",
    crossesMidnight: true,
  });
  const after = store.getState();
  expect(after.shiftCycles.map((c) => ({ ...c, updatedAt: "ignore" }))).toEqual(
    before.shiftCycles.map((c) => ({
      ...c,
      sequenceAnchorDate: c.sequenceAnchorDate ?? c.startsOnDate,
      updatedAt: "ignore",
    })),
  );
  expect(after.previewRange).toEqual(before.previewRange);
});
it("Sleep edits use their own command and preserve unsaved Work draft across domain navigation", async () => {
  const store = await setup(3),
    before = store.getState();
  fireEvent.click(screen.getByRole("button", { name: "View / Edit Work Pattern" }));
  fireEvent.change(screen.getByLabelText("Day Boundary Start Time"), {
    target: { value: "04:30" },
  });
  fireEvent.click(
    within(screen.getByRole("navigation", { name: "My Schedule" })).getByRole("button", {
      name: "Sleep",
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Configure Sleep" }));
  fireEvent.click(screen.getByRole("button", { name: "Save Sleep" }));
  expect(store.getState().sleepRequirements).toHaveLength(1);
  expect(store.getState().schedulingPreferences).toEqual(before.schedulingPreferences);
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  expect(screen.getByLabelText("Day Boundary Start Time")).toHaveValue("04:30");
});

it("support relationships remain exact read-only links through child editing", async () => {
  const store = createReadyDayFrameTestStore(myScheduleFixture(4));
  await store.initializeComposition();
  const [parent, child] = store.getState().blockTemplates.slice(1, 3);
  const result = await store.createAttachment({
    parent: { kind: "template", sourceId: parent!.id, incarnationId: parent!.incarnationId },
    child: { kind: "template", sourceId: child!.id, incarnationId: child!.incarnationId },
    slot: "prepare",
    order: 0,
    applicability: {},
    requiredness: "required",
    timing: { kind: "endsAtParentStart" },
    timingStrictness: "constraint",
    buffer: { beforeMinutes: 0, afterMinutes: 0 },
    goalSupport: "none",
  });
  expect(result.status).toBe("accepted");
  const before = store.exportCompositionAuthority();
  render(<DayFrameApp store={store} getNow={now} />);
  fireEvent.click(screen.getByRole("button", { name: "My Schedule" }));
  fireEvent.click(screen.getByRole("button", { name: "View / Manage Commitments" }));
  fireEvent.click(screen.getByRole("button", { name: /Edit commitment Commitment 02/ }));
  expect(screen.getByRole("heading", { name: "Support relationships" })).toBeInTheDocument();
  expect(screen.getByText(/Supports Commitment 01/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Duration minutes"), { target: { value: "20" } });
  fireEvent.click(screen.getByRole("button", { name: "Update Commitment" }));
  fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
  expect(store.exportCompositionAuthority()).toEqual(before);
});

it("focused placement changes require explicit clearing of incompatible clocks; cancellation and invalid duration preserve source", async () => {
  const store = await setup(3),
    before = store.getState();
  fireEvent.click(screen.getByRole("button", { name: "View / Manage Commitments" }));
  fireEvent.click(screen.getByRole("button", { name: /Edit commitment Commitment 02/ }));
  fireEvent.change(screen.getByLabelText("Duration hours"), { target: { value: "0" } });
  fireEvent.change(screen.getByLabelText("Duration minutes"), { target: { value: "0" } });
  fireEvent.click(screen.getByRole("button", { name: "Update Commitment" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Duration");
  expect(store.getState()).toEqual(before);
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(store.getState()).toEqual(before);
  fireEvent.click(screen.getByRole("button", { name: /Edit commitment Commitment 02/ }));
  fireEvent.change(screen.getByLabelText("Placement"), { target: { value: "fixed" } });
  fireEvent.change(screen.getByLabelText("Fixed start time"), { target: { value: "23:30" } });
  fireEvent.click(screen.getByRole("button", { name: "Clear custom window" }));
  fireEvent.click(screen.getByRole("button", { name: "Update Commitment" }));
  fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
  expect(store.getState().blockTemplates[2]).toMatchObject({
    placementType: "fixed",
    fixedStartTime: "23:30",
    durationMinutes: 90,
    requiresWorkAnchor: true,
  });
  expect(store.getState().blockTemplates[2]!.customWindowStartTime).toBeUndefined();
  expect(store.getState().blockRecurrences[2]).toEqual(before.blockRecurrences[2]);
});

it("returns focus to the list heading when a renamed item leaves the search results", async () => {
  await setup(3);
  fireEvent.click(screen.getByRole("button", { name: "View / Manage Commitments" }));
  fireEvent.change(screen.getByLabelText("Search Commitments"), {
    target: { value: "Commitment 02" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Edit commitment Commitment 02/ }));
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Renamed obligation" } });
  fireEvent.click(screen.getByRole("button", { name: "Update Commitment" }));
  await waitFor(() => expect(screen.getByRole("heading", { name: "Commitments" })).toHaveFocus());
  expect(screen.queryByRole("button", { name: /Edit commitment / })).toBeNull();
});
