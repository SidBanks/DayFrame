import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  getDayFrameRuntimeAuthorityController,
} from "../../state/dayFrameRuntimeAuthority.js";
import { buildExecutionReportInput } from "../executionReportingWorkflow.js";
import { definitionSemanticFingerprint } from "../../core/measurement/measurementDefinition.js";
import { createGoalActivityQuery } from "../../state/historicalIntelligenceQuery.js";
import { currentPlannerView } from "../plannerNavigation.js";
/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore } from "../../state/dayFrameStore.js";
import { createGoalEditingContext } from "../goalEditingContext.js";
import { GoalRecordedInspection } from "../GoalRecordedInspection.js";
import { DayFrameApp } from "../DayFrameApp.js";
import { goalRecordedCanonicalFixture } from "./goalRecordedCanonicalFixture.js";
import type { GoalActivityQueryResultV1 } from "../../state/historicalIntelligenceQuery.js";
import { MANUAL_QUANTITY_TARGET_POLICY_V1 as policy } from "../../core/measurement/measurementDefinition.js";
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole("button", { name }));
const change = (name: string, value: string) =>
  fireEvent.change(screen.getByLabelText(name), { target: { value } });
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("indexedDB", new IDBFactory());
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-23T12:00:00.000Z"));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
async function basic(value?: string) {
  const store = createDayFrameStore();
  await store.whenReady();
  const g = await store.createGoal({ title: "Measured Goal" });
  if (g.status !== "accepted") throw Error("Goal");
  const d = await store.createMeasurementDefinition(g.goal.id, policy, {
    targetValue: "100",
    unitId: "words",
  });
  if (d.status !== "accepted") throw Error("definition");
  if (value !== undefined) {
    const o = await store.createProgressObservation({
      goalId: g.goal.id,
      value,
      observedAt: new Date().toISOString(),
      expectedDefinitionRevision: 1,
    });
    if (o.status !== "accepted") throw Error(JSON.stringify(o));
  }
  return { store, goal: g.goal, definition: d.definition };
}
async function mount(f: Awaited<ReturnType<typeof basic>>) {
  const props = {
    goal: f.goal,
    store: f.store,
    context: createGoalEditingContext(),
    currentDay: "2026-09-23",
    now: vi.fn(() => new Date()),
    onDay: vi.fn(),
  };
  const mounted = render(<GoalRecordedInspection {...props} />);
  click("Inspect recorded Progress and Activity");
  await screen.findByText(/Policy: goalActivityPolicy/);
  return { ...mounted, props };
}
it("queries only the selected Goal with a shared cutoff and inclusive range; invalid intent never queries or writes", async () => {
  const f = await basic("17");
  const p = vi.spyOn(f.store, "queryGoalProgress"),
    a = vi.spyOn(f.store, "getGoalActivity");
  const m = await mount(f);
  expect(p).toHaveBeenLastCalledWith({
    goalId: f.goal.id,
    evaluationAsOf: "2026-09-23T12:00:00.000Z",
  });
  expect(a).toHaveBeenLastCalledWith(
    expect.objectContaining({
      goalId: f.goal.id,
      startUserDayDate: "2026-09-01",
      endUserDayDate: "2026-09-30",
      evaluationAsOf: "2026-09-23T12:00:00.000Z",
    }),
  );
  expect(m.props.now).toHaveBeenCalledTimes(1);
  const counts = [p.mock.calls.length, a.mock.calls.length];
  change("Activity start User Day", "2026-10-01");
  click("Apply Activity period");
  expect(screen.getByRole("alert")).toHaveTextContent("applied period is unchanged");
  expect([p.mock.calls.length, a.mock.calls.length]).toEqual(counts);
  change("Activity start User Day", "2024-01-01");
  click("Apply Activity period");
  expect(a).toHaveBeenCalledTimes(counts[1]!);
  change("Activity start User Day", "2026-09-10");
  change("Activity end User Day (inclusive)", "2026-09-11");
  click("Apply Activity period");
  await waitFor(() =>
    expect(a).toHaveBeenLastCalledWith(
      expect.objectContaining({ startUserDayDate: "2026-09-10", endUserDayDate: "2026-09-11" }),
    ),
  );
  expect(screen.getByLabelText("17 of 100 words; 17 percent")).toBeVisible();
  expect(f.store.exportProgressObservationAuthority().observations).toHaveLength(1);
});
it.each([undefined, "0", "40", "100", "120", "99.999999"])(
  "presents canonical value %s without invented zero, summation, clamp or false target attainment",
  async (value) => {
    const f = await basic(value);
    await mount(f);
    if (value === undefined) {
      expect(screen.getByText("No current value recorded.")).toBeVisible();
      expect(screen.queryByText("0%")).not.toBeInTheDocument();
    } else {
      expect(
        screen.getByText(
          value === "99.999999" ? "Below 100% (canonical percentage rounds to 100%)" : `${value}%`,
          { selector: ".df-progress-percentage" },
        ),
      ).toBeVisible();
      click("How this Progress was calculated");
      expect(screen.getByText(f.definition.id + " / 1")).toBeVisible();
    }
  },
);
it("retains the cutoff on notification, resolves absolute backdated correction/retraction and epoch changes only canonically", async () => {
  const f = await basic("17");
  await mount(f);
  const old = f.store.exportProgressObservationAuthority().observations[0]!;
  vi.setSystemTime(new Date("2026-09-23T13:00:00.000Z"));
  await act(async () => {
    expect(
      await f.store.createProgressObservation({
        goalId: f.goal.id,
        value: "20",
        observedAt: "2026-09-23T12:30:00.000Z",
        expectedDefinitionRevision: 1,
      }),
    ).toMatchObject({ status: "accepted" });
  });
  expect(screen.getByText("17%")).toBeVisible();
  click("Refresh recorded evidence");
  await screen.findByText("20%");
  const current = f.store
    .exportProgressObservationAuthority()
    .observations.find((o) => o.id !== old.id)!;
  vi.setSystemTime(new Date("2026-09-23T14:00:00.000Z"));
  await act(async () => {
    await f.store.correctProgressObservation({
      id: current.id,
      expectedRevision: 1,
      value: "30",
      observedAt: current.observedAt,
    });
  });
  expect(screen.getByText("20%")).toBeVisible();
  click("Refresh recorded evidence");
  await screen.findByText("30%");
  vi.setSystemTime(new Date("2026-09-23T15:00:00.000Z"));
  await act(async () => {
    await f.store.retractProgressObservation(current.id, 2);
  });
  click("Refresh recorded evidence");
  await screen.findByText("17%");
  vi.setSystemTime(new Date("2026-09-23T16:00:00.000Z"));
  await act(async () => {
    await f.store.reviseMeasurementDefinition(f.definition.id, 1, policy, {
      targetValue: "200",
      unitId: "pages",
    });
  });
  expect(screen.getByText("17%")).toBeVisible();
  click("Refresh recorded evidence");
  await screen.findByText("No current value recorded.");
  vi.setSystemTime(new Date("2026-09-23T17:00:00.000Z"));
  await act(async () => {
    await f.store.stopMeasuringGoal(f.definition.id, 2);
  });
  click("Refresh recorded evidence");
  await screen.findByText("Measurement is currently stopped.");
  vi.setSystemTime(new Date("2026-09-23T18:00:00.000Z"));
  await act(async () => {
    await f.store.restartMeasurement(f.definition.id, 3, policy, {
      targetValue: "100",
      unitId: "words",
    });
  });
  click("Refresh recorded evidence");
  await screen.findByText("No current value recorded.");
});
it("bounds valid historical rows and coverage, includes modern frozen Goal work and opens exact User Day across midnight", async () => {
  const f = await goalRecordedCanonicalFixture();
  const m = render(
    <GoalRecordedInspection
      goal={f.goal}
      store={f.store}
      context={createGoalEditingContext()}
      currentDay="2026-09-23"
      now={() => new Date()}
      onDay={vi.fn()}
    />,
  );
  click("Inspect recorded Progress and Activity");
  await screen.findByText(/Policy: goalActivityPolicy/);
  change("Activity start User Day", "2026-09-10");
  change("Activity end User Day (inclusive)", "2026-09-11");
  click("Apply Activity period");
  await screen.findByRole("button", { name: "Scheduled: 13" });
  click("Scheduled: 13");
  expect(screen.getAllByRole("button", { name: "Open Activity day 2026-09-10" })).toHaveLength(10);
  click("Show more Activity rows");
  expect(screen.getAllByRole("button", { name: "Open Activity day 2026-09-10" })).toHaveLength(13);
  expect(screen.getByText(/1 covered day has/)).toBeVisible();
  expect(screen.getByText(/legacy unavailable/)).toBeVisible();
  expect(screen.getByText("Linked intended occurrences: 16")).toBeVisible();
  expect(screen.getByRole("button", { name: "Unplaced: 1" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Omitted: 1" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Blocked: 1" })).toBeVisible();
  const before = await f.store.getGoalActivity({
    goalId: f.goalId,
    startUserDayDate: "2026-09-04",
    endUserDayDate: "2026-09-05",
    evaluationAsOf: new Date().toISOString(),
    policy: {
      id: "goalActivityPolicy",
      version: 1,
      historicalPolicy: { id: "historicalMetricPolicy", version: 1 },
    },
  });
  expect(before).toMatchObject({
    provenance: {
      linked: expect.arrayContaining([
        expect.objectContaining({ sourceFamily: "acceptedAllocation" }),
      ]),
    },
  });
  m.unmount();
});
it("isolates delayed Goal/range/owner success and failure; Activity failure does not erase Progress", async () => {
  const f = await basic("17");
  let reject!: (e: Error) => void;
  const original = f.store.getGoalActivity;
  vi.spyOn(f.store, "getGoalActivity").mockImplementationOnce(
    () =>
      new Promise((_r, r) => {
        reject = r;
      }),
  );
  const props = {
    goal: f.goal,
    store: f.store,
    context: createGoalEditingContext(),
    currentDay: "2026-09-23",
    now: () => new Date(),
    onDay: vi.fn(),
  };
  const m = render(<GoalRecordedInspection {...props} />);
  click("Inspect recorded Progress and Activity");
  await waitFor(() => expect(reject).toBeDefined());
  change("Activity start User Day", "2026-09-10");
  click("Apply Activity period");
  await screen.findByText(/Policy: goalActivityPolicy/);
  await act(async () => reject(Error("old range")));
  expect(screen.queryByText(/could not be loaded/)).not.toBeInTheDocument();
  vi.spyOn(f.store, "getGoalActivity").mockRejectedValueOnce(Error("current failure"));
  click("Refresh recorded evidence");
  await screen.findByText(/Goal Activity could not be loaded/);
  expect(screen.getByText("17%")).toBeVisible();
  vi.spyOn(f.store, "getGoalActivity").mockImplementation(original);
  const g = await f.store.createGoal({ title: "B" });
  if (g.status !== "accepted") throw Error("B");
  let resolve!: (v: GoalActivityQueryResultV1) => void;
  vi.spyOn(f.store, "getGoalActivity").mockImplementationOnce(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  click("Refresh recorded evidence");
  await waitFor(() => expect(resolve).toBeDefined());
  m.rerender(<GoalRecordedInspection {...props} goal={g.goal} />);
  click("Inspect recorded Progress and Activity");
  await screen.findByText("No quantity measurement configured.");
  await act(async () =>
    resolve(
      await original({
        goalId: f.goal.id,
        startUserDayDate: "2026-09-01",
        endUserDayDate: "2026-09-30",
        evaluationAsOf: new Date().toISOString(),
        policy: {
          id: "goalActivityPolicy",
          version: 1,
          historicalPolicy: { id: "historicalMetricPolicy", version: 1 },
        },
      }),
    ),
  );
  expect(screen.queryByText("17%")).not.toBeInTheDocument();
});
async function openApp(f: Awaited<ReturnType<typeof goalRecordedCanonicalFixture>>) {
  render(<DayFrameApp store={f.store} getNow={() => new Date()} />);
  click("Goals");
  fireEvent.click(await screen.findByRole("button", { name: /Recorded evidence Goal/ }));
  fireEvent.click(
    await screen.findByRole("button", { name: "Inspect recorded Progress and Activity" }),
  );
  await screen.findByText(/Policy: goalActivityPolicy/);
}
it("real reporting and Daily Planner return preserve independent drafts and refresh only canonical evidence", async () => {
  const f = await goalRecordedCanonicalFixture();
  vi.setSystemTime(new Date("2026-09-23T13:00:00.000Z"));
  await openApp(f);
  const inspector = () =>
    within(screen.getByRole("region", { name: "Recorded Progress and Activity" }));
  change("Requested Time hours", "7");
  click("Edit Goal");
  change("Goal title", "Unwritten Goal draft");
  click("Open Structure");
  await screen.findByRole("button", { name: "Create Milestone" });
  click("Create Milestone");
  change("Milestone title", "Unwritten checkpoint");
  click("Open Measurement controls");
  expect(screen.getByRole("heading", { name: "Measurement" })).toHaveFocus();
  click("Change Measurement");
  change("Quantity target", "555");
  click("Open value reporting and correction history");
  click("Record New Value");
  change("Current value", "25");
  click("Return to recorded inspection");
  expect(screen.getByLabelText("Current value")).toHaveValue("25");
  expect(screen.getByLabelText("Quantity target")).toHaveValue("555");
  click(/Open related Goal:/);
  await screen.findByRole("button", { name: "Back to previous Goal and drafts" });
  click("Back to previous Goal and drafts");
  await screen.findByLabelText("Current value");
  expect(screen.getByLabelText("Current value")).toHaveValue("25");
  expect(screen.getByLabelText("Quantity target")).toHaveValue("555");
  const record = vi.spyOn(f.store, "createProgressObservation");
  click("Record Value");
  await screen.findByText("Value recorded.");
  click("Refresh recorded evidence");
  await waitFor(() => expect(inspector().getByText("25%")).toBeVisible());
  expect(record).toHaveBeenCalledTimes(1);
  change("Activity start User Day", "2026-09-10");
  change("Activity end User Day (inclusive)", "2026-09-11");
  click("Apply Activity period");
  await screen.findByRole("button", { name: "Scheduled: 13" });
  click("Scheduled: 13");
  click("Show more Activity rows");
  const progress = f.store.exportProgressObservationAuthority();
  const planned = f.store.exportGoalPlanningAuthority();
  fireEvent.click(screen.getAllByRole("button", { name: "Open Activity day 2026-09-10" })[0]!);
  await screen.findByRole("heading", { name: /Day agenda/ });
  fireEvent.click(
    (await screen.findAllByRole("button", { name: /Details: Historical linked work 00/ }))[0]!,
  );
  click("Report outcome");
  click("Save outcome");
  await waitFor(() => expect(f.store.getExecutionHistory().length).toBeGreaterThan(1));
  click("Back");
  await screen.findByRole("button", { name: "Scheduled: 13" });
  await waitFor(() =>
    expect(screen.getByRole("heading", { name: "Recorded Progress and Activity" })).toHaveFocus(),
  );
  expect(screen.getAllByRole("button", { name: "Open Activity day 2026-09-10" })).toHaveLength(13);
  expect(await screen.findByRole("button", { name: "Reported completed: 1" })).toBeVisible();
  expect(inspector().getByText("25%")).toBeVisible();
  expect(screen.getByLabelText("Goal title")).toHaveValue("Unwritten Goal draft");
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Unwritten checkpoint");
  expect(screen.getByLabelText("Quantity target")).toHaveValue("555");
  expect(f.store.exportProgressObservationAuthority()).toEqual(progress);
  expect(f.store.exportGoalPlanningAuthority()).toEqual(planned);
  click("Open value reporting and correction history");
  fireEvent.click(screen.getAllByRole("button", { name: /Correct record: 25/ })[0]!);
  change("Current value", "30");
  vi.setSystemTime(new Date("2026-09-23T14:00:00.000Z"));
  click("Save Correction");
  await screen.findByText("Correction saved.");
  click("Return to recorded inspection");
  await waitFor(() => expect(inspector().getByText("30%")).toBeVisible());
  expect(await screen.findByRole("button", { name: "Reported completed: 1" })).toBeVisible();
  click("Open value reporting and correction history");
  fireEvent.click(screen.getAllByRole("button", { name: /Remove invalid record: 30/ })[0]!);
  vi.setSystemTime(new Date("2026-09-23T15:00:00.000Z"));
  click("Remove Invalid Record");
  await screen.findByText("Invalid record removed from current measurement history.");
  click("Return to recorded inspection");
  await waitFor(() => expect(inspector().getByText("17%")).toBeVisible());
  expect(await screen.findByRole("button", { name: "Reported completed: 1" })).toBeVisible();
}, 20000);
it("rejected V14 import retains all new contexts; complete restore and clear invalidate them; profile is independent", async () => {
  const f = await goalRecordedCanonicalFixture();
  await openApp(f);
  click("How this Progress was calculated");
  click("Record New Value");
  change("Current value", "88");
  click("Change Measurement");
  change("Quantity target", "555");
  await act(async () => {
    f.store.loadProfile(f.store.getState().savedProfiles[0]!.id);
  });
  expect(screen.getByLabelText("Current value")).toHaveValue("88");
  expect(screen.getByLabelText("Quantity target")).toHaveValue("555");
  const upload = async (text: string) => {
    await act(async () => {
      fireEvent.change(screen.getByLabelText("Import Setup Backup File"), {
        target: { files: [{ text: async () => text }] },
      });
    });
  };
  await upload("{bad");
  await screen.findByText(/Backup file is not valid JSON/);
  expect(screen.getByLabelText("Current value")).toHaveValue("88");
  const original = f.store.importBackupFile;
  let done!: () => void;
  const completion = new Promise<void>((r) => {
    done = r;
  });
  vi.spyOn(f.store, "importBackupFile").mockImplementationOnce(async (input) => {
    try {
      return await original(input);
    } finally {
      done();
    }
  });
  await act(async () => {
    await upload(JSON.stringify(f.backup));
    await completion;
  });
  await screen.findByText(/Complete backup restored across setup/);
  click("Goals");
  fireEvent.click(await screen.findByRole("button", { name: /Recorded evidence Goal/ }));
  expect(screen.queryByLabelText("Current value")).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Quantity target")).not.toBeInTheDocument();
  expect(screen.queryByText("Measurement details")).not.toBeInTheDocument();
  fireEvent.click(
    await screen.findByRole("button", { name: "Inspect recorded Progress and Activity" }),
  );
  await screen.findByText(/Policy: goalActivityPolicy/);
  click("Clear Local Data");
  click("Confirm Clear Local Data");
  await screen.findByText("Local DayFrame setup data cleared from this device.");
  click("Goals");
  expect(
    screen.queryByRole("region", { name: "Recorded Progress and Activity" }),
  ).not.toBeInTheDocument();
}, 20000);
it("known empty, missing plan, frozen membership and multi-Goal evidence remain distinct after current edits", async () => {
  const f = await goalRecordedCanonicalFixture();
  const context = createGoalEditingContext();
  render(
    <GoalRecordedInspection
      goal={f.goal}
      store={f.store}
      context={context}
      currentDay="2026-09-23"
      now={() => new Date()}
      onDay={vi.fn()}
    />,
  );
  click("Inspect recorded Progress and Activity");
  await screen.findByText(/Policy: goalActivityPolicy/);
  change("Activity start User Day", "2026-09-11");
  change("Activity end User Day (inclusive)", "2026-09-11");
  click("Apply Activity period");
  await screen.findByText("No Goal-linked activity was recorded in this range.");
  expect(screen.getByRole("button", { name: "Scheduled: 0" })).toBeVisible();
  change("Activity start User Day", "2026-09-12");
  change("Activity end User Day (inclusive)", "2026-09-12");
  click("Apply Activity period");
  await waitFor(() =>
    expect(screen.queryByRole("button", { name: "Scheduled: 0" })).not.toBeInTheDocument(),
  );
  expect(
    screen.queryByText("No Goal-linked activity was recorded in this range."),
  ).not.toBeInTheDocument();
  const q = {
    goalId: f.goal.id,
    startUserDayDate: "2026-09-10" as const,
    endUserDayDate: "2026-09-10" as const,
    evaluationAsOf: new Date().toISOString(),
    policy: {
      id: "goalActivityPolicy",
      version: 1,
      historicalPolicy: { id: "historicalMetricPolicy", version: 1 },
    } as const,
  };
  const before = await f.store.getGoalActivity(q);
  const observations = f.store.exportProgressObservationAuthority();
  await act(async () => {
    await f.store.updateGoal(f.goal.id, f.goal.revision, { title: "Renamed current Goal" });
    const g = f.store.getGoal(f.goal.id)!;
    await f.store.unlinkCommitment(g.id, g.revision, g.links[0]!);
    const milestone = await f.store.createMilestone({
      ownerGoalId: g.id,
      title: "Manual checkpoint",
    });
    if (milestone.status !== "accepted") throw Error("milestone");
    await f.store.reviseMilestone(milestone.value.id, milestone.value.revision, {
      state: "satisfied",
    });
  });
  const after = await f.store.getGoalActivity(q);
  expect(after).toMatchObject({
    provenance: "provenance" in before ? before.provenance : undefined,
  });
  expect(f.store.exportProgressObservationAuthority()).toEqual(observations);
  const child = f.store.listGoals().find((g) => g.id !== f.goal.id)!;
  expect(await f.store.getGoalActivity({ ...q, goalId: child.id })).toMatchObject({
    planningDistribution: { linkedIntendedOccurrenceCount: 16 },
  });
});
it("a replaced owner/context cannot receive an old Activity continuation", async () => {
  const f = await basic("17");
  const original = f.store.getGoalActivity;
  let resolve!: (r: GoalActivityQueryResultV1) => void;
  vi.spyOn(f.store, "getGoalActivity").mockImplementationOnce(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  const context = createGoalEditingContext(),
    props = {
      goal: f.goal,
      store: f.store,
      context,
      currentDay: "2026-09-23",
      now: () => new Date(),
      onDay: vi.fn(),
    };
  const m = render(<GoalRecordedInspection {...props} />);
  click("Inspect recorded Progress and Activity");
  await waitFor(() => expect(resolve).toBeDefined());
  context.invalidate();
  const next = createGoalEditingContext();
  const replacement = createDayFrameStore();
  await replacement.whenReady();
  m.rerender(<GoalRecordedInspection {...props} store={replacement} context={next} />);
  await act(async () =>
    resolve(
      await original({
        goalId: f.goal.id,
        startUserDayDate: "2026-09-01",
        endUserDayDate: "2026-09-30",
        evaluationAsOf: new Date().toISOString(),
        policy: {
          id: "goalActivityPolicy",
          version: 1,
          historicalPolicy: { id: "historicalMetricPolicy", version: 1 },
        },
      }),
    ),
  );
  expect(screen.queryByText("17%")).not.toBeInTheDocument();
  expect(screen.queryByText(/Policy: goalActivityPolicy/)).not.toBeInTheDocument();
});
it.each(["goalProtected", "definitionProtected", "observationProtected"] as const)(
  "%s immediately replaces cached Progress while Activity remains independently readable",
  async (status) => {
    const f = await basic("17");
    const m = await mount(f);
    vi.spyOn(f.store, "queryGoalProgress").mockImplementation((q) => ({
      status,
      reason: "invalidAuthority",
      query: q,
    }));
    click("Refresh recorded evidence");
    await screen.findByText(/unavailable until stored data can be recovered/);
    expect(screen.queryByText("17%")).not.toBeInTheDocument();
    await screen.findByText(/Policy: goalActivityPolicy/);
    m.unmount();
  },
);
it("Structure-only temporal protection does not suppress independent Progress or Activity", async () => {
  const f = await goalRecordedCanonicalFixture();
  const backup = structuredClone(f.backup),
    row = backup.data.goalStructure.relationships[0]!;
  backup.data.goalStructure.relationships.push({
    ...row,
    revision: 2 as never,
    status: "retired",
    effectiveTo: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  });
  expect(await f.store.importBackupFile(backup)).toMatchObject({ status: "restoredV14" });
  await openApp(f);
  expect(
    within(screen.getByRole("region", { name: "Recorded Progress and Activity" })).getByText("17%"),
  ).toBeVisible();
  expect(screen.getByText(/Policy: goalActivityPolicy/)).toBeVisible();
});
it("execution protection invalidates cached counts immediately but keeps canonical planning and measured Progress", async () => {
  const f = await goalRecordedCanonicalFixture();
  let notify!: () => void;
  vi.spyOn(f.store, "subscribeExecutionHistoryIngress").mockImplementation((listener) => {
    notify = () =>
      listener({ status: "recoveryRequired", reason: "corruptJson", sourcePreserved: true });
    return () => true;
  });
  render(
    <GoalRecordedInspection
      goal={f.goal}
      store={f.store}
      context={createGoalEditingContext()}
      currentDay="2026-09-23"
      now={() => new Date()}
      onDay={vi.fn()}
    />,
  );
  click("Inspect recorded Progress and Activity");
  await screen.findByText(/Policy: goalActivityPolicy/);
  const protectedQuery = createGoalActivityQuery({
    historicalPlan: f.store,
    goals: f.store,
    executionHistory: {
      getExecutionHistory: f.store.getExecutionHistory,
      getExecutionHistoryIngressStatus: () => ({
        status: "recoveryRequired",
        reason: "corruptJson",
        sourcePreserved: true,
      }),
    },
  });
  vi.spyOn(f.store, "getGoalActivity").mockImplementation(protectedQuery);
  act(() => notify());
  expect(
    screen.queryByRole("group", { name: "Execution Goal Activity counts" }),
  ).not.toBeInTheDocument();
  await screen.findByText(
    /Planning activity is available, but reported outcomes cannot be interpreted/,
  );
  expect(screen.getByText("17%")).toBeVisible();
  expect(screen.getByRole("group", { name: "Planning Goal Activity counts" })).toBeVisible();
});
it("defaults from the canonical User Day across midnight rather than the civil month", async () => {
  const f = await basic();
  const a = vi.spyOn(f.store, "getGoalActivity");
  const instant = new Date(2026, 8, 1, 1, 0, 0);
  f.store.commitAuthoredSetup({
    ...f.store.getState(),
    schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "monday" },
  });
  render(
    <GoalRecordedInspection
      goal={f.goal}
      store={f.store}
      context={createGoalEditingContext()}
      currentDay={(at) => currentPlannerView(f.store.getState(), at).selectedLabel}
      now={() => instant}
      onDay={vi.fn()}
    />,
  );
  expect(a).not.toHaveBeenCalled();
  click("Inspect recorded Progress and Activity");
  await waitFor(() =>
    expect(a).toHaveBeenCalledWith(
      expect.objectContaining({
        startUserDayDate: "2026-08-01",
        endUserDayDate: "2026-08-31",
        evaluationAsOf: instant.toISOString(),
      }),
    ),
  );
});
it("Summary handoff honors an independent Activity period and returns to preserved Summary selection, cutoff and provenance", async () => {
  const f = await goalRecordedCanonicalFixture();
  render(<DayFrameApp store={f.store} getNow={() => new Date()} />);
  click("Summary");
  await screen.findByLabelText("History start date");
  change("History start date", "2026-09-10");
  change("History end date", "2026-09-11");
  click("Update history");
  await screen.findByLabelText("Goal");
  change("Goal", f.goalId);
  await screen.findByText("17%");
  click("How this Progress was calculated");
  const query = vi.spyOn(f.store, "queryGoalProgress");
  click("Inspect this Goal");
  fireEvent.click(
    await screen.findByRole("button", { name: "Inspect recorded Progress and Activity" }),
  );
  await screen.findByText(/Policy: goalActivityPolicy/);
  expect(screen.getByLabelText("Activity start User Day")).toHaveValue("2026-09-10");
  expect(screen.getByLabelText("Activity end User Day (inclusive)")).toHaveValue("2026-09-11");
  change("Activity start User Day", "2026-09-11");
  click("Apply Activity period");
  await screen.findByText("No Goal-linked activity was recorded in this range.");
  vi.setSystemTime(new Date("2026-09-24T12:00:00.000Z"));
  click("Back");
  await screen.findByLabelText("Goal");
  expect(screen.getByLabelText("Goal")).toHaveValue(f.goalId);
  expect(screen.getByLabelText("History start date")).toHaveValue("2026-09-10");
  expect(screen.getByLabelText("History end date")).toHaveValue("2026-09-11");
  await screen.findByText("Measurement details");
  expect(query).toHaveBeenLastCalledWith({
    goalId: f.goalId,
    evaluationAsOf: "2026-09-23T12:00:00.000Z",
  });
}, 20000);
it("preserves an unsupported definition through actual V14 import without inventing a measured value", async () => {
  const f = await basic();
  const exported = await f.store.exportBackupV14(new Date().toISOString());
  if (exported.status !== "exported") throw Error("export");
  const definition = exported.backup.data.measurementDefinitions.definitions[0]!;
  definition.policyRef = { id: "futureMeasurement", version: 1 };
  definition.config = { target: "uninterpreted" };
  definition.fingerprint = definitionSemanticFingerprint(definition);
  expect(await f.store.importBackupFile(exported.backup)).toMatchObject({ status: "restoredV14" });
  await mount(f);
  expect(
    screen.getByText("This measurement method is not supported by this version of DayFrame."),
  ).toBeVisible();
  expect(screen.queryByText("0%")).not.toBeInTheDocument();
});
it.each(["goalProtected", "definitionProtected", "observationProtected"] as const)(
  "%s initialization is loading rather than absence or recorded zero",
  async (status) => {
    const f = await basic();
    vi.spyOn(f.store, "queryGoalProgress").mockImplementation((query) => ({
      status,
      reason: "initializing",
      query,
    }));
    await mount(f);
    expect(screen.getByText("Loading Progress…")).toBeVisible();
    expect(screen.queryByText("No current value recorded.")).not.toBeInTheDocument();
  },
);
it("a Progress query or definition-history failure stays local to Progress", async () => {
  const f = await basic("17");
  await mount(f);
  vi.spyOn(f.store, "queryGoalProgress").mockImplementation(() => {
    throw Error("controlled query failure");
  });
  click("Refresh recorded evidence");
  await screen.findByText(/Progress could not be loaded/);
  await screen.findByText(/Policy: goalActivityPolicy/);
});
it("completed-below-target and active-at-target remain independent current Goal facts", async () => {
  const f = await basic("40");
  await f.store.completeGoal(f.goal.id, f.goal.revision);
  f.goal = f.store.getGoal(f.goal.id)!;
  await mount(f);
  expect(screen.getByText("40%")).toBeVisible();
  expect(f.store.getGoal(f.goal.id)?.status).toBe("completed");
});
it("canonical completed, partial, skipped, withdrawn and never-reported categories retain separate counts", async () => {
  const f = await goalRecordedCanonicalFixture();
  const day = await f.store.querySelectedDayEvidence({
    ownerDay: "2026-09-10",
    asOf: new Date().toISOString(),
  });
  if (day.status !== "projected" || day.published.status !== "available") throw Error("day");
  for (const [n, outcome] of ["completed", "partial", "skipped", "completed"].entries()) {
    const item = day.published.value
      .flatMap((p) => p.items)
      .find((i) => i.snapshot.title === `Historical linked work 0${n}`)!;
    if (item.reporting.status !== "targetAvailable" || !("reference" in item.reporting.target))
      throw Error("report target");
    const built = buildExecutionReportInput(item.reporting.target, {
      outcome: outcome as "completed" | "partial" | "skipped",
      occurredAtLocal: "",
      durationMinutes: "",
      note: "",
    });
    if (built.status !== "valid") throw Error(built.message);
    const result = f.store.recordExecution(built.input);
    if (result.status !== "accepted") throw Error(JSON.stringify(result));
    if (n === 3)
      expect(
        f.store.retractExecutionRecord(result.record.subjectId, result.record.id),
      ).toMatchObject({ status: "accepted" });
  }
  render(
    <GoalRecordedInspection
      goal={f.goal}
      store={f.store}
      context={createGoalEditingContext()}
      currentDay="2026-09-23"
      navigationRange={{ start: "2026-09-10", end: "2026-09-11" }}
      now={() => new Date()}
      onDay={vi.fn()}
    />,
  );
  click("Inspect recorded Progress and Activity");
  for (const name of [
    "Reported completed: 1",
    "Partial: 1",
    "Skipped: 1",
    "Unknown: 1",
    "Not reported: 9",
  ])
    expect(await screen.findByRole("button", { name })).toBeVisible();
  expect(screen.getByText("17%")).toBeVisible();
  expect(screen.getByText("Linked scheduled occurrences: 13")).toBeVisible();
});
it("a 24-Goal catalog does not fan out inspection queries", async () => {
  const f = await basic("17");
  for (let n = 0; n < 23; n++) await f.store.createGoal({ title: `Other ${n}` });
  const progress = vi.spyOn(f.store, "queryGoalProgress"),
    activity = vi.spyOn(f.store, "getGoalActivity");
  render(<DayFrameApp store={f.store} />);
  click("Goals");
  await screen.findByRole("button", { name: /Measured Goal/ });
  expect(progress).not.toHaveBeenCalled();
  expect(activity).not.toHaveBeenCalled();
  click(/Measured Goal/);
  fireEvent.click(
    await screen.findByRole("button", { name: "Inspect recorded Progress and Activity" }),
  );
  await screen.findByText(/Policy: goalActivityPolicy/);
  expect(new Set(progress.mock.calls.map(([q]) => q.goalId))).toEqual(new Set([f.goal.id]));
  expect(new Set(activity.mock.calls.map(([q]) => q.goalId))).toEqual(new Set([f.goal.id]));
});
it("aborted coordinator work preserves drafts; recovery-required readiness removes the open inspector", async () => {
  const f = await goalRecordedCanonicalFixture();
  await openApp(f);
  click("Record New Value");
  change("Current value", "88");
  const runtime = getDayFrameRuntimeAuthorityController(
    f.store,
    DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  );
  await act(async () => {
    runtime.begin("restore");
    runtime.abort();
  });
  expect(screen.getByLabelText("Current value")).toHaveValue("88");
  expect(screen.getByRole("region", { name: "Recorded Progress and Activity" })).toBeVisible();
  vi.spyOn(runtime, "install").mockReturnValue({ status: "installFailed" });
  const original = f.store.importBackupFile;
  let finish!: () => void;
  const completed = new Promise<void>((resolve) => {
    finish = resolve;
  });
  vi.spyOn(f.store, "importBackupFile").mockImplementationOnce(async (data) => {
    try {
      return await original(data);
    } finally {
      finish();
    }
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText("Import Setup Backup File"), {
      target: { files: [{ text: async () => JSON.stringify(f.backup) }] },
    });
    await completed;
  });
  expect(f.store.getReadiness().status).toBe("protected");
  expect(
    screen.queryByRole("region", { name: "Recorded Progress and Activity" }),
  ).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Current value")).not.toBeInTheDocument();
});
