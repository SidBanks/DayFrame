/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createDayFrameStore } from "../../state/dayFrameStore.js";
import { GoalSection } from "../GoalSection.js";
import { DayFrameApp } from "../DayFrameApp.js";
import { createGoalEditingContext } from "../goalEditingContext.js";
import * as workflow from "../../state/constructivePlanningWorkflow.js";
import type { DemandSessionShapeV1 } from "../../core/planning/goalDemand.js";
import type { DayFrameStore } from "../../state/types.js";
import type { GoalV1 } from "../../core/goals/goal.js";
import { GoalPlanningSection } from "../GoalPlanningSection.js";

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: new IDBFactory() });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("Priority-only editing preserves preferred minutes, absent maximum, and exact Demand/footprint history", async () => {
  const store = createDayFrameStore();
  await store.whenReady();
  const created = await store.createGoal({ title: "Session fidelity" });
  if (created.status !== "accepted") throw new Error("Goal fixture");
  const demand = await store.createDemand({
    goalId: created.goal.id,
    requestedEffort: { unit: "minutes", amount: 240 },
    horizon: {
      kind: "userDayInterval",
      startUserDayDate: "2030-05-06",
      endUserDayDateExclusive: "2030-05-13",
    },
    session: { mode: "splittable", minimumMinutes: 30, preferredMinutes: 60 },
    satisfaction: { kind: "target", allowPartial: false },
    cadence: { kind: "total" },
  });
  if (demand.status !== "accepted") throw new Error("Demand fixture");
  await store.setDemandResourceFootprintAssociation({
    demandId: demand.value.id,
    selection: { kind: "productiveOnly" },
  });
  const before = store.exportGoalPlanningAuthority();
  const revise = vi.spyOn(store, "reviseDemand");
  const associate = vi.spyOn(store, "setDemandResourceFootprintAssociation");
  render(
    <GoalPlanningSection
      goal={created.goal}
      store={store}
      state={store.getState()}
      onOpenReview={() => {}}
      now={() => new Date("2030-05-06T12:00:00.000Z")}
    />,
  );
  fireEvent.change(screen.getByLabelText("Goal planning priority"), { target: { value: "high" } });
  fireEvent.click(screen.getByRole("button", { name: /Save (planning intent|Requested Time)/ }));
  await screen.findByText(/(Planning intent|Requested Time) saved/);
  expect(store.listCurrentGoalDemands(created.goal.id)[0]?.session).toEqual({
    mode: "splittable",
    minimumMinutes: 30,
    preferredMinutes: 60,
  });
  expect(store.exportGoalPlanningAuthority().demands).toEqual(before.demands);
  expect(store.exportGoalPlanningAuthority().footprintAssociations).toEqual(
    before.footprintAssociations,
  );
  expect(revise).not.toHaveBeenCalled();
  expect(associate).not.toHaveBeenCalled();
});

const horizon = {
  kind: "userDayInterval",
  startUserDayDate: "2030-05-06",
  endUserDayDateExclusive: "2030-05-13",
} as const;
async function fixture(
  session: DemandSessionShapeV1 = { mode: "splittable", minimumMinutes: 30, preferredMinutes: 60 },
) {
  const store = createDayFrameStore();
  await store.whenReady();
  const g = await store.createGoal({ title: "Focused Goal" });
  if (g.status !== "accepted") throw Error("Goal fixture");
  const d = await store.createDemand({
    goalId: g.goal.id,
    requestedEffort: { unit: "minutes", amount: 240 },
    horizon,
    session,
    satisfaction: { kind: "target", allowPartial: true, minimumSatisfiedMinutes: 120 },
    cadence: { kind: "sessionCount", count: 4 },
  });
  if (d.status !== "accepted") throw Error("Demand fixture");
  await store.setDemandResourceFootprintAssociation({
    demandId: d.value.id,
    selection: { kind: "productiveOnly" },
  });
  return { store, goal: g.goal, demand: d.value };
}
function planning(store: DayFrameStore, goal: GoalV1, context = createGoalEditingContext()) {
  return (
    <GoalPlanningSection
      goal={goal}
      store={store}
      state={store.getState()}
      context={context}
      onOpenReview={() => {}}
      now={() => new Date("2030-05-06T12:00:00.000Z")}
    />
  );
}
const change = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
const saveRequest = () =>
  fireEvent.click(screen.getByRole("button", { name: "Save Requested Time" }));
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

it.each([
  { mode: "splittable", minimumMinutes: 30 },
  { mode: "splittable", minimumMinutes: 30, maximumMinutes: 120 },
  { mode: "splittable", minimumMinutes: 30, preferredMinutes: 60 },
  { mode: "splittable", minimumMinutes: 30, preferredMinutes: 60, maximumMinutes: 120 },
] as DemandSessionShapeV1[])(
  "preserves optional absence/presence during a horizon edit: %j",
  async (session) => {
    const { store, goal, demand } = await fixture(session);
    const before = store.exportGoalPlanningAuthority();
    render(planning(store, goal));
    change("Plan through", "2030-05-14");
    saveRequest();
    await screen.findByText(/Requested Time saved/);
    const current = store.listCurrentGoalDemands(goal.id)[0]!;
    expect(current.session).toEqual(session);
    expect(current.satisfaction).toEqual(demand.satisfaction);
    expect(current.cadence).toEqual(demand.cadence);
    expect(store.exportGoalPlanningAuthority().demands[0]).toEqual(before.demands[0]);
    expect(store.exportGoalPlanningAuthority().footprintAssociations).toEqual(
      before.footprintAssociations,
    );
  },
);

it("explicitly authors and clears optional constraints, and rejects conflicts without erasing them", async () => {
  const { store, goal } = await fixture();
  render(planning(store, goal));
  fireEvent.click(screen.getByLabelText("Set maximum session duration"));
  change("Maximum session hours", "2");
  saveRequest();
  await screen.findByText(/Requested Time saved/);
  expect(store.listCurrentGoalDemands(goal.id)[0]!.session).toEqual({
    mode: "splittable",
    minimumMinutes: 30,
    preferredMinutes: 60,
    maximumMinutes: 120,
  });
  change("Minimum session hours", "3");
  saveRequest();
  await screen.findByText(/Preserved constraints may conflict/);
  expect(screen.getByLabelText("Minimum session hours")).toHaveValue(3);
  expect(store.listCurrentGoalDemands(goal.id)[0]!.revision).toBe(2);
  change("Minimum session hours", "0");
  fireEvent.click(screen.getByLabelText("Set maximum session duration"));
  fireEvent.click(screen.getByLabelText("Set preferred session duration"));
  saveRequest();
  await screen.findByText(/Requested Time saved/);
  expect(store.listCurrentGoalDemands(goal.id)[0]!.session).toEqual({
    mode: "splittable",
    minimumMinutes: 30,
  });
});

it("title editing preserves description, legacy measurement metadata and exact unavailable source links", async () => {
  const store = createDayFrameStore();
  await store.whenReady();
  const g = await store.createGoal({
    title: "Legacy Goal",
    description: "Keep verbatim",
    measurementPolicy: { id: "legacy.measurement", version: 7 },
    links: [
      {
        sourceKind: "blockTemplate",
        id: "unavailable",
        incarnationId: "11111111-1111-4111-8111-111111111111" as never,
      },
    ],
  });
  if (g.status !== "accepted") throw Error("fixture");
  render(<GoalSection store={store} state={store.getState()} initialGoalId={g.goal.id} />);
  fireEvent.click(screen.getByRole("button", { name: "Edit Goal" }));
  change("Goal title", "Renamed");
  fireEvent.click(screen.getByRole("button", { name: "Save Goal" }));
  await screen.findByRole("heading", { name: "Renamed" });
  const current = store.getGoal(g.goal.id)!;
  expect(current.description).toBe(g.goal.description);
  expect(current.measurementPolicy).toEqual(g.goal.measurementPolicy);
  expect(current.links).toEqual(g.goal.links);
  expect(store.getGoalLinkAvailability(g.goal.id)[0]?.status).toBe("unavailable");
});

it("keeps exact advanced resources, optional components and bounded priorities during unrelated edits", async () => {
  const { store, goal, demand } = await fixture();
  const spec = await store.createDemandResourceFootprintSpec({
    name: "Advanced",
    variants: [
      {
        id: "offset",
        name: "Offset geometry",
        components: [
          {
            id: "prep",
            role: "supportActivity",
            scope: "perSession",
            requiredness: "optional",
            durationMinutes: 15,
            geometry: {
              kind: "offsetFromProductiveStart",
              anchor: "componentEnd",
              offsetMinutes: -10,
            },
            actor: "user",
            source: { kind: "direct" },
          },
          {
            id: "before",
            role: "bufferProtection",
            scope: "perSession",
            requiredness: "required",
            durationMinutes: 5,
            target: { kind: "supportComponent", componentId: "prep" },
            side: "before",
            source: { kind: "direct" },
          },
        ],
      },
    ],
  });
  if (spec.status !== "accepted") throw Error("spec fixture");
  const a = await store.setDemandResourceFootprintAssociation({
    demandId: demand.id,
    expectedRevision: 1,
    selection: {
      kind: "specification",
      specificationId: spec.value.id,
      specificationRevision: spec.value.revision,
      variantId: "offset",
      selectedOptionalComponentIds: ["prep"],
    },
  });
  expect(a.status).toBe("accepted");
  const p = await store.createPriority({ goalId: goal.id, level: "critical", scope: horizon });
  expect(p.status).toBe("accepted");
  const before = store.exportGoalPlanningAuthority();
  render(planning(store, goal));
  change("Plan through", "2030-05-14");
  change("Goal planning priority", "low");
  saveRequest();
  await screen.findByText(/Requested Time saved/);
  const after = store.exportGoalPlanningAuthority();
  expect(after.footprintSpecifications).toEqual(before.footprintSpecifications);
  expect(after.footprintAssociations).toEqual(before.footprintAssociations);
  expect(after.priorities.filter((p) => p.scope.kind !== "default")).toEqual(before.priorities);
});

it("retains stale Goal and Demand drafts until explicit reload and never retries against newer revisions", async () => {
  const { store, goal, demand } = await fixture();
  const ui = render(<GoalSection store={store} state={store.getState()} initialGoalId={goal.id} />);
  fireEvent.click(screen.getByRole("button", { name: "Edit Goal" }));
  change("Goal title", "My draft");
  await act(async () => {
    await store.updateGoal(goal.id, goal.revision, { description: "Concurrent" });
  });
  const write = vi.spyOn(store, "updateGoal");
  fireEvent.click(screen.getByRole("button", { name: "Save Goal" }));
  expect(screen.getByLabelText("Goal title")).toHaveValue("My draft");
  expect(write).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Discard draft and reload saved Goal" }));
  expect(screen.getByLabelText("Goal title")).toHaveValue(goal.title);
  ui.unmount();
  render(planning(store, store.getGoal(goal.id)!));
  change("Plan through", "2030-05-15");
  await act(async () => {
    await store.reviseDemand(demand.id, demand.revision, {
      requestedEffort: { unit: "minutes", amount: 300 },
    });
  });
  const authority = store.exportGoalPlanningAuthority();
  saveRequest();
  await screen.findByText(/This request changed elsewhere/);
  expect(screen.getByLabelText("Plan through")).toHaveValue("2030-05-15");
  expect(store.exportGoalPlanningAuthority()).toEqual(authority);
  fireEvent.click(screen.getByRole("button", { name: "Discard draft and reload saved request" }));
  expect(screen.getByLabelText("Requested Time hours")).toHaveValue(5);
});

it("continues partial creation and persistence retry without duplicate requests, priority, specs or associations", async () => {
  const { store, goal } = await fixture();
  const create = vi.spyOn(store, "createDemand"),
    priority = vi.spyOn(store, "createPriority"),
    spec = vi.spyOn(store, "createDemandResourceFootprintSpec");
  const association = vi
    .spyOn(store, "setDemandResourceFootprintAssociation")
    .mockResolvedValueOnce({ status: "rejected", reason: "staleRevision" });
  render(planning(store, goal));
  change("Planning request", "");
  change("Plan from", "2030-05-06");
  change("Plan through", "2030-05-12");
  change("Session resources", "resources");
  change("Follow-up activity after each session minutes", "15");
  saveRequest();
  await screen.findByText(/Resource association was rejected/);
  expect(create).toHaveBeenCalledTimes(1);
  expect(priority).toHaveBeenCalledTimes(1);
  expect(spec).toHaveBeenCalledTimes(1);
  const durability = vi
    .spyOn(store, "getGoalPlanningDurabilityStatus")
    .mockReturnValue("storageFailure");
  const retry = vi
    .spyOn(store, "retryGoalPlanningPersistence")
    .mockResolvedValueOnce({ status: "storageFailure" });
  saveRequest();
  await screen.findByText(/accepted for this session but could not be saved/);
  saveRequest();
  await screen.findByText(/Requested Time saved/);
  expect(create).toHaveBeenCalledTimes(1);
  expect(priority).toHaveBeenCalledTimes(1);
  expect(spec).toHaveBeenCalledTimes(1);
  expect(association).toHaveBeenCalledTimes(2);
  expect(retry).toHaveBeenCalledTimes(2);
  durability.mockRestore();
  expect(store.listCurrentGoalDemands(goal.id)).toHaveLength(2);
});

it("guards repeated pending Goal creation and keeps late success after navigation", async () => {
  const store = createDayFrameStore();
  await store.whenReady();
  const context = createGoalEditingContext();
  const real = store.createGoal;
  const pending = deferred<Awaited<ReturnType<typeof real>>>();
  const create = vi.spyOn(store, "createGoal").mockImplementation(async (input) => {
    const result = await real(input);
    await pending.promise;
    return result;
  });
  const ui = render(<GoalSection store={store} state={store.getState()} context={context} />);
  fireEvent.click(screen.getByRole("button", { name: "Add Goal" }));
  change("Goal title", "Undated outcome");
  fireEvent.click(screen.getByRole("button", { name: "Save Goal" }));
  fireEvent.submit(screen.getByRole("form", { name: "Add Goal" }));
  await waitFor(() => expect(store.listGoals()).toHaveLength(1));
  ui.unmount();
  await act(async () => {
    pending.resolve({ status: "rejected", reason: "notFound" });
    await pending.promise;
  });
  render(<GoalSection store={store} state={store.getState()} context={context} />);
  await screen.findByRole("heading", { name: "Undated outcome" });
  expect(create).toHaveBeenCalledTimes(1);
  expect(store.listGoals()[0]).not.toHaveProperty("targetDate");
  expect(store.exportGoalPlanningAuthority().demands).toEqual([]);
});

it("attributes late request saves to A, keeps B fields, and ignores late A evaluation", async () => {
  const { store, goal, demand } = await fixture();
  const b = await store.createDemand({
    goalId: goal.id,
    horizon: demand.horizon,
    session: demand.session,
    satisfaction: demand.satisfaction,
    cadence: demand.cadence,
    requestedEffort: { unit: "minutes", amount: 360 },
  });
  if (b.status !== "accepted") throw Error("fixture B");
  await store.setDemandResourceFootprintAssociation({
    demandId: b.value.id,
    selection: { kind: "productiveOnly" },
  });
  const real = store.reviseDemand;
  const gate = deferred<void>();
  const revise = vi.spyOn(store, "reviseDemand").mockImplementation(async (...args) => {
    await gate.promise;
    return real(...args);
  });
  render(planning(store, goal));
  change("Planning request", demand.id);
  change("Requested Time hours", "5");
  saveRequest();
  saveRequest();
  change("Planning request", b.value.id);
  await act(async () => {
    gate.resolve();
    await gate.promise;
  });
  await waitFor(() =>
    expect(store.listCurrentGoalDemands(goal.id).find((d) => d.id === demand.id)?.revision).toBe(2),
  );
  expect(screen.getByLabelText("Requested Time hours")).toHaveValue(6);
  expect(revise).toHaveBeenCalledTimes(1);
  change("Planning request", demand.id);
  await screen.findByText(/Requested Time saved/);
  expect(screen.getByLabelText("Requested Time hours")).toHaveValue(5);
  const evaluation = deferred<Awaited<ReturnType<typeof workflow.evaluatePlanningRequest>>>();
  vi.spyOn(workflow, "evaluatePlanningRequest").mockReturnValue(evaluation.promise);
  fireEvent.click(screen.getByRole("button", { name: "Evaluate planning opportunity" }));
  change("Planning request", b.value.id);
  await act(async () => {
    evaluation.resolve({ status: "blocked", reason: "late A evidence" } as never);
    await evaluation.promise;
  });
  expect(screen.queryByText(/late A evidence/)).not.toBeInTheDocument();
  expect(screen.getByLabelText("Requested Time hours")).toHaveValue(6);
});

it("bounds 24 Goals deterministically; search/filter/reveal preserve drafts and do not write authority", async () => {
  const store = createDayFrameStore();
  await store.whenReady();
  for (let i = 23; i >= 0; i--) {
    const g = await store.createGoal({ title: `Goal ${String(i).padStart(2, "0")}` });
    if (g.status !== "accepted") throw Error("fixture");
    if (i >= 16) await store.archiveGoal(g.goal.id, g.goal.revision);
    else if (i >= 12) await store.completeGoal(g.goal.id, g.goal.revision);
  }
  const goals = store.listGoals(),
    authority = store.exportGoalPlanningAuthority();
  const context = createGoalEditingContext();
  let ui = render(<GoalSection store={store} state={store.getState()} context={context} />);
  const rows = () => [...document.querySelectorAll(".df-goal-list-button")];
  expect(rows()).toHaveLength(10);
  expect(rows()[0]).toHaveTextContent("Goal 00");
  fireEvent.click(screen.getByRole("button", { name: "Show more Goals" }));
  expect(rows()).toHaveLength(20);
  ui.unmount();
  ui = render(<GoalSection store={store} state={store.getState()} context={context} />);
  expect(rows()).toHaveLength(20);
  fireEvent.click(rows()[0]!);
  fireEvent.click(screen.getByRole("button", { name: "Edit Goal" }));
  change("Goal title", "Unfinished draft");
  change("Search Goals", "23");
  expect(screen.getByText(/selected Goal remains open outside/)).toBeInTheDocument();
  expect(screen.getByLabelText("Goal title")).toHaveValue("Unfinished draft");
  expect(rows()).toHaveLength(1);
  expect(rows()[0]).toBeDisabled();
  change("Goal status", "active");
  expect(screen.getByText(/No Goals match/)).toBeInTheDocument();
  ui.unmount();
  render(<GoalSection store={store} state={store.getState()} context={context} />);
  expect(screen.getByLabelText("Goal title")).toHaveValue("Unfinished draft");
  expect(screen.getByLabelText("Search Goals")).toHaveValue("23");
  expect(screen.getByLabelText("Goal status")).toHaveValue("active");
  expect(store.listGoals()).toEqual(goals);
  expect(store.exportGoalPlanningAuthority()).toEqual(authority);
});

it("Goals → Review Schedule → Back retains request draft, disclosures, search and focus without planning writes", async () => {
  const { store, goal } = await fixture();
  const before = store.exportGoalPlanningAuthority();
  const evaluate = vi.spyOn(store, "evaluateCompetingAllocation"),
    propose = vi.spyOn(store, "recordProposal");
  render(<DayFrameApp store={store} getNow={() => new Date("2030-05-06T12:00:00.000Z")} />);
  fireEvent.click(screen.getByRole("button", { name: "Goals" }));
  await screen.findByRole("button", { name: new RegExp(goal.title) });
  fireEvent.click(screen.getByRole("button", { name: new RegExp(goal.title) }));
  change("Search Goals", "Focused");
  change("Goal status", "active");
  await screen.findByLabelText("Requested Time hours");
  change("Requested Time hours", "7");
  const details = screen.getByText("Session details and constraints")
    .parentElement as HTMLDetailsElement;
  details.open = true;
  fireEvent(details, new Event("toggle"));
  fireEvent.click(
    within(screen.getByRole("navigation", { name: "Planner modes" })).getByRole("button", {
      name: "Review Schedule",
    }),
  );
  await screen.findByRole("button", { name: "Back" });
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  await screen.findByLabelText("Requested Time hours");
  expect(screen.getByLabelText("Requested Time hours")).toHaveValue(7);
  expect(screen.getByText("Session details and constraints").parentElement).toHaveAttribute("open");
  expect(screen.getByLabelText("Search Goals")).toHaveValue("Focused");
  expect(screen.getByLabelText("Goal status")).toHaveValue("active");
  expect(screen.getByRole("heading", { name: goal.title })).toHaveFocus();
  expect(store.exportGoalPlanningAuthority()).toEqual(before);
  expect(evaluate).not.toHaveBeenCalled();
  expect(propose).not.toHaveBeenCalled();
});

it("completion is explicit and preserves planning and measured Progress authority", async () => {
  const { store, goal } = await fixture();
  const m = await store.createMeasurementDefinition(
    goal.id,
    { id: "manualQuantityTarget", version: 1 },
    { targetValue: "12", unitId: "count" },
  );
  expect(m.status).toBe("accepted");
  const before = {
    planning: store.exportGoalPlanningAuthority(),
    progress: store.exportProgressObservationAuthority(),
    measurement: store.listMeasurementDefinitionHistory(goal.id),
    state: store.getState(),
  };
  render(<GoalSection store={store} state={store.getState()} initialGoalId={goal.id} />);
  fireEvent.click(screen.getByRole("button", { name: "Mark Complete" }));
  await screen.findByText("Goal marked complete.");
  expect(store.getGoal(goal.id)?.status).toBe("completed");
  expect({
    planning: store.exportGoalPlanningAuthority(),
    progress: store.exportProgressObservationAuthority(),
    measurement: store.listMeasurementDefinitionHistory(goal.id),
    state: store.getState(),
  }).toEqual(before);
});

it("invalidated context, cleared/missing requests and protected owners cannot replay retained drafts", async () => {
  const { store, goal } = await fixture();
  const context = createGoalEditingContext();
  const ui = render(planning(store, goal, context));
  change("Requested Time hours", "9");
  context.invalidate();
  const revise = vi.spyOn(store, "reviseDemand");
  saveRequest();
  expect(revise).not.toHaveBeenCalled();
  ui.unmount();
  const next = createGoalEditingContext();
  const second = render(planning(store, goal, next));
  change("Requested Time hours", "8");
  vi.spyOn(store, "getGoalPlanningIngressStatus").mockReturnValue({
    status: "protected",
    reason: "invalidAuthority",
  });
  second.rerender(planning(store, goal, next));
  expect(screen.getByRole("button", { name: "Save Requested Time" })).toBeDisabled();
  expect(screen.getByLabelText("Requested Time hours")).toHaveValue(8);
  expect(revise).not.toHaveBeenCalled();
});

it.each(["clear", "restore"] as const)(
  "%s replaces app editing context so a prior draft cannot replay",
  async (operation) => {
    const { store, goal } = await fixture();
    const exported = await store.exportBackupV14("2030-05-06T12:00:00.000Z");
    if (exported.status !== "exported") throw Error(JSON.stringify(exported));
    render(<DayFrameApp store={store} getNow={() => new Date("2030-05-06T12:00:00.000Z")} />);
    fireEvent.click(screen.getByRole("button", { name: "Goals" }));
    fireEvent.click(await screen.findByRole("button", { name: new RegExp(goal.title) }));
    fireEvent.click(screen.getByRole("button", { name: "Edit Goal" }));
    change("Goal title", "Must not replay");
    fireEvent.click(screen.getByRole("button", { name: "My Schedule" }));
    if (operation === "clear") {
      fireEvent.click(await screen.findByRole("button", { name: "Clear Local Data" }));
      fireEvent.click(screen.getByRole("button", { name: "Confirm Clear Local Data" }));
      await screen.findByText("Local DayFrame setup data cleared from this device.");
    } else {
      fireEvent.change(await screen.findByLabelText("Import Setup Backup File"), {
        target: { files: [{ text: async () => JSON.stringify(exported.backup) }] },
      });
      await screen.findByText(/Complete backup restored across setup/);
    }
    fireEvent.click(screen.getByRole("button", { name: "Goals" }));
    await screen.findByRole("heading", { name: "Goals" });
    expect(screen.queryByLabelText("Goal title")).not.toBeInTheDocument();
    expect(store.listGoals().some((g) => g.title === "Must not replay")).toBe(false);
    expect(store.listGoals()).toHaveLength(operation === "clear" ? 0 : 1);
  },
);

it("profile load and rejected complete import keep independent Goal drafts", async () => {
  const { store, goal } = await fixture();
  store.saveProfile({ name: "Independent setup", savedAt: "2030-05-06T12:00:00.000Z" });
  render(<DayFrameApp store={store} getNow={() => new Date("2030-05-06T12:00:00.000Z")} />);
  fireEvent.click(screen.getByRole("button", { name: "Goals" }));
  fireEvent.click(await screen.findByRole("button", { name: new RegExp(goal.title) }));
  fireEvent.click(screen.getByRole("button", { name: "Edit Goal" }));
  change("Goal title", "Retained Goal draft");
  fireEvent.click(screen.getByRole("button", { name: "My Schedule" }));
  const imported = vi.spyOn(store, "importBackupFile");
  fireEvent.change(await screen.findByLabelText("Import Setup Backup File"), {
    target: { files: [{ text: async () => JSON.stringify({ version: 14 }) }] },
  });
  await waitFor(() => expect(imported).toHaveBeenCalled());
  await act(async () => {
    await imported.mock.results[0]!.value;
  });
  fireEvent.click(screen.getByRole("button", { name: "Goals" }));
  expect(await screen.findByLabelText("Goal title")).toHaveValue("Retained Goal draft");
  const profile = store.getState().savedProfiles[0]!;
  await act(async () => {
    store.loadProfile(profile.id);
  });
  expect(screen.getByLabelText("Goal title")).toHaveValue("Retained Goal draft");
  expect(store.getGoal(goal.id)?.title).toBe(goal.title);
});

it("Priority-only editing an existing request without resource evidence does not require or invent an association", async () => {
  const { store, goal, demand } = await fixture();
  const added = await store.createDemand({
    goalId: goal.id,
    requestedEffort: demand.requestedEffort,
    horizon,
    session: demand.session,
    satisfaction: demand.satisfaction,
    cadence: demand.cadence,
  });
  if (added.status !== "accepted") throw Error("fixture");
  const before = store.exportGoalPlanningAuthority();
  render(planning(store, goal));
  change("Planning request", added.value.id);
  change("Goal planning priority", "critical");
  saveRequest();
  await screen.findByText(/Requested Time saved/);
  const after = store.exportGoalPlanningAuthority();
  expect(after.demands).toEqual(before.demands);
  expect(after.footprintAssociations).toEqual(before.footprintAssociations);
  expect(store.resolveDemandResourceFootprintAssociation(added.value.id).status).toBe(
    "unspecified",
  );
});
