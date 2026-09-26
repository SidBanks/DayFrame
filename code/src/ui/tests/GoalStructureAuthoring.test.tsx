/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore } from "../../state/dayFrameStore.js";
import {
  createDayFrameDurableDb,
  GOAL_STRUCTURE_STORE,
} from "../../infrastructure/storage/dayFrameDurableDb.js";
import { GoalStructureSection } from "../GoalStructureSection.js";
import { createGoalEditingContext } from "../goalEditingContext.js";
import type { GoalV1 } from "../../core/goals/goal.js";
import type { DayFrameStore } from "../../state/types.js";
import { DayFrameApp } from "../DayFrameApp.js";
import { v14RestoreFixture } from "./v14RestoreFixture.js";
import { goalInspectionCanonicalFixture } from "./goalInspectionCanonicalFixture.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  getDayFrameRuntimeAuthorityController,
} from "../../state/dayFrameRuntimeAuthority.js";
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("indexedDB", new IDBFactory());
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-24T12:00:00.000Z"));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole("button", { name }));
const change = (name: string, value: string) =>
  fireEvent.change(screen.getByLabelText(name), { target: { value } });
it("Review Schedule and Daily Planner returns preserve the focused Structure editor and independent request", async () => {
  vi.setSystemTime(new Date("2026-09-23T12:00:00.000Z"));
  const { store } = await goalInspectionCanonicalFixture();
  vi.setSystemTime(new Date("2026-09-23T13:00:00.000Z"));
  render(<DayFrameApp store={store} getNow={() => new Date()} />);
  click("Goals");
  fireEvent.click(await screen.findByRole("button", { name: /Network\+ renamed/ }));
  await screen.findByLabelText("Requested Time hours");
  change("Requested Time hours", "7");
  fireEvent.click(await screen.findByRole("button", { name: "Open Structure" }));
  await screen.findByText(/No current structural prerequisite/);
  click("Create Milestone");
  change("Milestone title", "Retained across planner views");
  const before = store.exportGoalPlanningAuthority();
  const create = vi.spyOn(store, "createMilestone");
  fireEvent.click(
    within(screen.getByRole("navigation", { name: "Planner modes" })).getByRole("button", {
      name: "Review Schedule",
    }),
  );
  await screen.findByRole("button", { name: "Back" });
  click("Back");
  await screen.findByLabelText("Milestone title");
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Retained across planner views");
  click("Inspect accepted planning");
  await screen.findByText(/3 readable accepted iterations/);
  click("Inspect accepted iteration 1");
  click(/Inspect scheduled fact: Goal work/);
  click(/Open Daily Planner for/);
  await screen.findByRole("heading", { name: /Day agenda/ });
  click("Back");
  await screen.findByLabelText("Milestone title");
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Retained across planner views");
  expect(screen.getByLabelText("Requested Time hours")).toHaveValue(7);
  await waitFor(() =>
    expect(
      screen.getByRole("heading", { name: "Accepted planning and scheduled work" }),
    ).toHaveFocus(),
  );
  expect(create).not.toHaveBeenCalled();
  expect(store.exportGoalPlanningAuthority()).toEqual(before);
});
async function fixture(count = 3) {
  const db = createDayFrameDurableDb();
  const store = createDayFrameStore(undefined, { restoreIndexedDb: db });
  await store.whenReady();
  const goals: GoalV1[] = [];
  for (let i = 0; i < count; i++) {
    const r = await store.createGoal({ title: i < 2 ? "Duplicate Goal" : `Goal ${i}` });
    if (r.status !== "accepted") throw Error("fixture");
    goals.push(r.goal);
  }
  return { store, goals, db };
}
async function mount(store: DayFrameStore, goal: GoalV1, context = createGoalEditingContext()) {
  const props = { store, goal, context, onGoal: vi.fn() };
  const result = render(<GoalStructureSection {...props} />);
  click("Open Structure");
  await screen.findByText(/No current structural prerequisite/);
  return { ...result, props };
}
async function save() {
  click("Save Structure");
  await waitFor(() =>
    expect(screen.queryByRole("form", { name: "Structure editor" })).not.toBeInTheDocument(),
  );
}
async function relation(
  kind: "contains" | "contributesTo" | "dependsOn",
  target: string,
  strength = "hard",
) {
  click(
    kind === "contains"
      ? "Link Subgoal"
      : kind === "contributesTo"
        ? "Add contribution"
        : "Add prerequisite",
  );
  change("Existing endpoint", target);
  if (kind === "contains")
    change("Subgoal requiredness", strength === "optional" ? "optional" : "required");
  if (kind === "dependsOn") change("Prerequisite strength", strength);
  await save();
}
it("authors required/optional containment, directional contributions and hard/advisory conditions without other authority writes", async () => {
  const f = await fixture();
  await mount(f.store, f.goals[0]!);
  const before = {
    goals: f.store.listGoals(),
    planning: f.store.exportGoalPlanningAuthority(),
    proposals: f.store.exportProposalAuthority(),
    realized: f.store.exportRealizationAuthority(),
  };
  await relation("contains", f.goals[1]!.id);
  let row = f.store.listGoalStructureRelationships(f.goals[0]!.id)[0]!;
  click(`Edit relationship ${row.id}`);
  change("Subgoal requiredness", "optional");
  await save();
  expect(f.store.getGoalStructureRelationshipRevision(row.id, 1)).toMatchObject({
    relationship: { semantics: { requiredness: "required" } },
  });
  expect(f.store.listGoalStructureRelationships(f.goals[0]!.id)[0]).toMatchObject({
    revision: 2,
    semantics: { requiredness: "optional" },
  });
  await relation("contributesTo", f.goals[1]!.id);
  await relation("contributesTo", f.goals[2]!.id);
  await relation("dependsOn", f.goals[1]!.id);
  await screen.findByText(/A hard prerequisite has not been satisfied\./);
  row = f.store.listGoalStructureRelationships(f.goals[0]!.id).find((r) => r.kind === "dependsOn")!;
  click(`Edit relationship ${row.id}`);
  change("Prerequisite strength", "advisory");
  await save();
  await screen.findByText(/An advisory prerequisite is unmet\./);
  expect({
    goals: f.store.listGoals(),
    planning: f.store.exportGoalPlanningAuthority(),
    proposals: f.store.exportProposalAuthority(),
    realized: f.store.exportRealizationAuthority(),
  }).toEqual(before);
  await act(async () => {
    await f.store.completeGoal(f.goals[1]!.id, 1);
  });
  await screen.findByText(/No current structural prerequisite/);
});
it("manual checkpoint transitions preserve dates, satisfaction facts, narrow patches and exact previous revisions", async () => {
  const f = await fixture();
  await mount(f.store, f.goals[0]!);
  click("Create Milestone");
  change("Milestone title", "Exam");
  change("Milestone target date (optional)", "2026-10-01");
  await save();
  let m = f.store.listGoalStructureMilestones(f.goals[0]!.id)[0]!;
  click(`Edit Milestone: Exam · ${m.id}`);
  change("Checkpoint state", "satisfied");
  await save();
  m = f.store.listGoalStructureMilestones(f.goals[0]!.id)[0]!;
  const satisfied = structuredClone(m);
  vi.setSystemTime(new Date("2026-09-25T12:00:00.000Z"));
  const spy = vi.spyOn(f.store, "reviseMilestone");
  click(`Edit Milestone: Exam · ${m.id}`);
  change("Milestone title", "Renamed exam");
  await save();
  expect(spy).toHaveBeenLastCalledWith(m.id, 2, { title: "Renamed exam" });
  m = f.store.listGoalStructureMilestones(f.goals[0]!.id)[0]!;
  expect(m.satisfiedAt).toBe(satisfied.satisfiedAt);
  expect(m.targetDate).toBe("2026-10-01");
  expect(f.store.getGoalStructureMilestoneRevision(m.id, 2)).toEqual({
    status: "resolved",
    milestone: satisfied,
  });
  click(`Edit Milestone: Renamed exam · ${m.id}`);
  await save();
  expect(f.store.listGoalStructureMilestones(f.goals[0]!.id)[0]!.revision).toBe(3);
  click(`Edit Milestone: Renamed exam · ${m.id}`);
  change("Milestone target date (optional)", "");
  change("Checkpoint state", "retired");
  await save();
  expect(f.store.listGoalStructureMilestones(f.goals[0]!.id)[0]).toMatchObject({
    state: "retired",
    retiredAt: "2026-09-25T12:00:00.000Z",
  });
  expect(f.store.listGoalStructureMilestones(f.goals[0]!.id)[0]).not.toHaveProperty("targetDate");
  click(`Edit Milestone: Renamed exam · ${m.id}`);
  change("Checkpoint state", "active");
  await save();
  expect(f.store.listGoalStructureMilestones(f.goals[0]!.id)[0]).not.toHaveProperty("retiredAt");
});
it("Milestone prerequisite uses owning Goal labels and referenced retirement rejects without erasing the draft", async () => {
  const f = await fixture();
  const made = await f.store.createMilestone({ ownerGoalId: f.goals[1]!.id, title: "Checkpoint" });
  if (made.status !== "accepted") throw Error("fixture");
  const mounted = await mount(f.store, f.goals[0]!);
  click("Add prerequisite");
  change("Prerequisite condition", "milestoneSatisfied");
  expect(
    screen.getByRole("option", { name: /Checkpoint — owned by Duplicate Goal/ }),
  ).toBeInTheDocument();
  change("Existing endpoint", made.value.id);
  change("Prerequisite strength", "hard");
  await save();
  await screen.findByText(/A hard prerequisite has not been satisfied\./);
  mounted.rerender(<GoalStructureSection {...mounted.props} goal={f.goals[1]!} />);
  click("Open Structure");
  await screen.findByRole("button", { name: /Edit Milestone: Checkpoint/ });
  click(/Edit Milestone: Checkpoint/);
  change("Checkpoint state", "retired");
  click("Save Structure");
  await screen.findByRole("alert");
  expect(screen.getByLabelText("Checkpoint state")).toHaveValue("retired");
  expect(f.store.listGoalStructureMilestones(f.goals[1]!.id)[0]!.state).toBe("active");
  change("Checkpoint state", "satisfied");
  await save();
  expect(f.store.getStructuralEligibility(f.goals[0]!.id).status).toBe("eligible");
});
it.each(["self", "duplicate", "multi-parent", "containment-cycle", "dependency-cycle"])(
  "%s rejection preserves the entered endpoint and prior graph",
  async (kind) => {
    const f = await fixture();
    const [a, b, c] = f.goals as [GoalV1, GoalV1, GoalV1];
    const contains = (source: GoalV1, target: GoalV1) =>
      f.store.createRelationship({
        kind: "contains",
        sourceGoalId: source.id,
        target: { kind: "goal", goalId: target.id },
        semantics: { kind: "containment", requiredness: "required" },
      });
    const selected = a;
    let target = b,
      relationship: "contains" | "dependsOn" = "contains";
    if (kind === "self") target = a;
    if (kind === "duplicate") await contains(a, b);
    if (kind === "multi-parent") {
      await contains(c, b);
    }
    if (kind === "containment-cycle") {
      await contains(b, a);
    }
    if (kind === "dependency-cycle") {
      relationship = "dependsOn";
      await f.store.createRelationship({
        kind: "dependsOn",
        sourceGoalId: b.id,
        target: { kind: "goal", goalId: a.id },
        semantics: { kind: "dependency", strength: "hard", condition: "goalCompleted" },
      });
    }
    const before = f.store.exportGoalStructureAuthority();
    await mount(f.store, selected);
    click(relationship === "contains" ? "Link Subgoal" : "Add prerequisite");
    change("Existing endpoint", target.id);
    change(
      relationship === "contains" ? "Subgoal requiredness" : "Prerequisite strength",
      relationship === "contains" ? "required" : "hard",
    );
    click("Save Structure");
    await screen.findByRole("alert");
    expect(screen.getByLabelText("Existing endpoint")).toHaveValue(target.id);
    expect(f.store.exportGoalStructureAuthority()).toEqual(before);
  },
);
it("allows a non-aggregating contribution cycle through ordinary controls", async () => {
  const f = await fixture();
  await f.store.createRelationship({
    kind: "contributesTo",
    sourceGoalId: f.goals[1]!.id,
    target: { kind: "goal", goalId: f.goals[0]!.id },
    semantics: { kind: "contribution", mode: "nonAggregating" },
  });
  await mount(f.store, f.goals[0]!);
  await relation("contributesTo", f.goals[1]!.id);
  expect(f.store.exportGoalStructureAuthority().relationships).toHaveLength(2);
});
it("retains stale and clock-rejected drafts at the original revision", async () => {
  const f = await fixture();
  await mount(f.store, f.goals[0]!);
  click("Create Milestone");
  change("Milestone title", "M");
  await save();
  const m = f.store.listGoalStructureMilestones(f.goals[0]!.id)[0]!;
  click(`Edit Milestone: M · ${m.id}`);
  change("Milestone title", "Draft");
  await act(async () => {
    await f.store.reviseMilestone(m.id, 1, { title: "External" });
  });
  click("Save Structure");
  await screen.findByText(/This record changed/);
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Draft");
  click("Cancel Structure edit");
  click(`Edit Milestone: External · ${m.id}`);
  change("Milestone title", "Clock draft");
  vi.setSystemTime(new Date("2026-09-23T12:00:00.000Z"));
  click("Save Structure");
  await screen.findByText(/The clock cannot support/);
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Clock draft");
});
it("accepted storage failure retries exact identity; unresolved submission is suppressed before repaint", async () => {
  const f = await fixture();
  await mount(f.store, f.goals[0]!);
  const write = f.db.mutate;
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  vi.spyOn(f.db, "mutate").mockImplementation(async (ops, admit) => {
    if (ops.some((o) => o.store === GOAL_STRUCTURE_STORE)) {
      await gate;
      return { status: "failure", error: { code: "writeFailed", operation: "test" } };
    }
    return write(ops, admit);
  });
  const create = vi.spyOn(f.store, "createMilestone");
  click("Create Milestone");
  change("Milestone title", "Retained");
  const form = screen.getByRole("form", { name: "Structure editor" });
  fireEvent.submit(form);
  fireEvent.submit(form);
  await waitFor(() => expect(create).toHaveBeenCalledTimes(1));
  await act(async () => release());
  await screen.findByText(/Available for this session/);
  expect(f.store.exportGoalStructureAuthority().milestones).toHaveLength(1);
  const id = f.store.exportGoalStructureAuthority().milestones[0]!.id;
  vi.restoreAllMocks();
  click("Retry Structure save");
  await screen.findByText(/Structure saved durably/);
  expect(f.store.exportGoalStructureAuthority().milestones.map((m) => m.id)).toEqual([id]);
});
it("bounds 24 canonical Goals and more than ten valid rows, with identity-based disclosure", async () => {
  const f = await fixture(24);
  for (const g of f.goals.slice(1, 14)) {
    await f.store.createRelationship({
      kind: "contributesTo",
      sourceGoalId: f.goals[0]!.id,
      target: { kind: "goal", goalId: g.id },
      semantics: { kind: "contribution", mode: "nonAggregating" },
    });
    await f.store.createMilestone({ ownerGoalId: f.goals[0]!.id, title: `M ${g.id}` });
  }
  await mount(f.store, f.goals[0]!);
  const contributions = screen.getByRole("region", { name: "Contributions" }),
    milestones = screen.getByRole("region", { name: "Manual Milestones" });
  expect(within(contributions).getAllByRole("listitem")).toHaveLength(10);
  expect(within(milestones).getAllByRole("listitem")).toHaveLength(10);
  click("Show more contributions");
  click("Show more Milestones");
  expect(within(contributions).getAllByRole("listitem")).toHaveLength(13);
  click("Link Subgoal");
  expect(within(screen.getByLabelText("Existing endpoint")).getAllByRole("option")).toHaveLength(
    11,
  );
  click("Show more endpoints");
  expect(within(screen.getByLabelText("Existing endpoint")).getAllByRole("option")).toHaveLength(
    21,
  );
  change("Search Structure endpoints", f.goals[1]!.id);
  expect(within(screen.getByLabelText("Existing endpoint")).getAllByRole("option")).toHaveLength(2);
});
it("related navigation retains Structure, Goal and Requested Time drafts; rejected V14 import retains them and successful restore displaces them", async () => {
  const f = await v14RestoreFixture();
  render(<DayFrameApp store={f.store} />);
  click("Goals");
  click(
    await screen
      .findByRole("button", { name: /Source A restored Goal/ })
      .then((b) => b.textContent!),
  );
  await screen.findByLabelText("Requested Time hours");
  change("Requested Time hours", "7");
  click("Edit Goal");
  change("Goal title", "Goal draft");
  click(await screen.findByRole("button", { name: "Open Structure" }).then((b) => b.textContent!));
  await screen.findByRole("button", { name: /Open related Goal:/ });
  click("Create Milestone");
  change("Milestone title", "Structure draft");
  click(/Open related Goal:/);
  await screen.findByRole("button", { name: "Back to previous Goal and drafts" });
  click("Back to previous Goal and drafts");
  await screen.findByLabelText("Milestone title");
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Structure draft");
  expect(screen.getByLabelText("Goal title")).toHaveValue("Goal draft");
  const upload = (text: string) =>
    fireEvent.change(screen.getByLabelText("Import Setup Backup File"), {
      target: { files: [{ text: async () => text }] },
    });
  upload("{bad");
  await screen.findByText(/Backup file is not valid JSON/);
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Structure draft");
  // Await the real replacement operation, then assert the UI outcome. The DOM
  // polling deadline is not a deadline for the complete multi-owner restore.
  const originalImport = f.store.importBackupFile;
  let settled!: () => void;
  const finished = new Promise<void>((resolve) => {
    settled = resolve;
  });
  const imported = vi.spyOn(f.store, "importBackupFile").mockImplementationOnce(async (input) => {
    try {
      return await originalImport(input);
    } finally {
      settled();
    }
  });
  await act(async () => {
    upload(JSON.stringify(f.backup));
    await finished;
  });
  expect(await imported.mock.results[0]!.value).toMatchObject({ status: "restoredV14" });
  await screen.findByText(/Complete backup restored across setup/);
  click("Goals");
  click(
    await screen
      .findByRole("button", { name: /Source A restored Goal/ })
      .then((b) => b.textContent!),
  );
  await screen.findByLabelText("Requested Time hours");
  expect(screen.getByLabelText("Requested Time hours")).toHaveValue(1);
  expect(screen.queryByLabelText("Milestone title")).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Goal title")).not.toBeInTheDocument();
});
it("busy coordinator rejection preserves the draft and protected readiness removes authoring", async () => {
  const f = await fixture();
  await mount(f.store, f.goals[0]!);
  click("Create Milestone");
  change("Milestone title", "Busy draft");
  const runtime = getDayFrameRuntimeAuthorityController(
    f.store,
    DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  );
  runtime.begin("restore");
  click("Save Structure");
  await screen.findByText(/Structure is busy/);
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Busy draft");
  runtime.abort();
});

it("refresh uses one explicit instant, retains draft revisions, and never samples the legacy wrapper", async () => {
  const f = await fixture();
  const query = vi.spyOn(f.store, "queryGoalStructure"),
    legacy = vi.spyOn(f.store, "getStructuralEligibility");
  const clock = vi.fn(() => new Date("2026-09-24T12:00:00.000Z"));
  render(
    <GoalStructureSection
      store={f.store}
      goal={f.goals[0]!}
      context={createGoalEditingContext()}
      onGoal={() => {}}
      now={clock}
    />,
  );
  click("Open Structure");
  await screen.findByText(/No current structural prerequisite/);
  expect(clock).toHaveBeenCalledTimes(1);
  expect(query).toHaveBeenCalledExactlyOnceWith({
    goalId: f.goals[0]!.id,
    evaluationInstant: "2026-09-24T12:00:00.000Z",
    basis: "currentAuthority",
  });
  expect(legacy).not.toHaveBeenCalled();
  click("Create Milestone");
  change("Milestone title", "Retained on refresh");
  expect(clock).toHaveBeenCalledTimes(1);
  click("Refresh Structure evidence");
  await waitFor(() => expect(clock).toHaveBeenCalledTimes(2));
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Retained on refresh");
  expect(f.store.exportGoalStructureAuthority().milestones).toEqual([]);
});
it("available future and retired rows remain visible, and unavailable evidence is never an empty claim", async () => {
  const f = await fixture();
  const r = await f.store.createRelationship({
    kind: "dependsOn",
    sourceGoalId: f.goals[0]!.id,
    target: { kind: "goal", goalId: f.goals[1]!.id },
    semantics: { kind: "dependency", strength: "hard", condition: "goalCompleted" },
  });
  if (r.status !== "accepted") throw Error("fixture");
  const a = f.store.exportGoalStructureAuthority();
  a.relationships[0]!.effectiveFrom = "2026-09-25T12:00:00.000Z";
  await f.store.replaceGoalStructureAuthority(a);
  await mount(f.store, f.goals[0]!);
  expect(screen.getByText(/Record active. Applicability: does not apply/)).toBeInTheDocument();
  vi.setSystemTime(new Date("2026-09-25T12:00:00.000Z"));
  click("Refresh Structure evidence");
  await screen.findByText(/A hard prerequisite has not been satisfied/);
  click(`Retire relationship ${r.value.id}`);
  click("Confirm relationship retirement");
  await screen.findByText(/Record retired. Applicability: does not apply/);
  const query = f.store.queryGoalStructure;
  vi.spyOn(f.store, "queryGoalStructure").mockImplementation((input) => {
    const result = query(input);
    if (result.status !== "evaluated") return result;
    return {
      ...result,
      value: {
        ...result.value,
        qualification: "unavailable",
        eligibility: "unknown",
        records: { status: "unavailable", reason: "initializing" },
      },
    };
  });
  click("Refresh Structure evidence");
  await screen.findByText(/This is not evidence of an empty Structure/);
  expect(screen.queryByRole("region", { name: "Prerequisites" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create Milestone" })).toBeDisabled();
});
it("late accepted completion stays with the original Goal; invalidated context ignores it", async () => {
  const f = await fixture();
  const context = createGoalEditingContext();
  const mounted = await mount(f.store, f.goals[0]!, context);
  const create = f.store.createMilestone;
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  vi.spyOn(f.store, "createMilestone").mockImplementation(async (input) => {
    const result = await create(input);
    await gate;
    return result;
  });
  click("Create Milestone");
  change("Milestone title", "Only A");
  click("Save Structure");
  await waitFor(() => expect(f.store.listGoalStructureMilestones(f.goals[0]!.id)).toHaveLength(1));
  mounted.rerender(<GoalStructureSection {...mounted.props} goal={f.goals[1]!} />);
  click("Open Structure");
  await screen.findByText(/No current structural prerequisite/);
  await act(async () => release());
  expect(screen.queryByText(/Structure accepted \(/)).not.toBeInTheDocument();
  expect(f.store.listGoalStructureMilestones(f.goals[1]!.id)).toEqual([]);
  mounted.rerender(<GoalStructureSection {...mounted.props} />);
  await screen.findByText(/Structure accepted \(/);
});
it("actual anomaly preservation import shows retained rows with ordinary writes disabled; recovery invalidates the new editor", async () => {
  const f = await v14RestoreFixture();
  const source = structuredClone(f.backup);
  const row = source.data.goalStructure.relationships[0]!;
  source.data.goalStructure.relationships.push({
    ...row,
    revision: 2 as never,
    status: "retired",
    effectiveTo: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  });
  // Legacy-valid builder: latest revision is coherent; the retained middle revision is anomalous.
  source.data.goalStructure.relationships.push({
    ...row,
    revision: 3 as never,
    status: "retired",
    effectiveTo: "2026-09-25T12:00:00.000Z",
    updatedAt: "2026-09-25T12:00:00.000Z",
  });
  render(<DayFrameApp store={f.store} />);
  const upload = async (data: unknown) => {
    const original = f.store.importBackupFile;
    let settled!: () => void;
    const finished = new Promise<void>((resolve) => {
      settled = resolve;
    });
    const imported = vi.spyOn(f.store, "importBackupFile").mockImplementationOnce(async (input) => {
      try {
        return await original(input);
      } finally {
        settled();
      }
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText("Import Setup Backup File"), {
        target: { files: [{ text: async () => JSON.stringify(data) }] },
      });
      await finished;
    });
    imported.mockRestore();
  };
  await upload(source);
  await screen.findByText(/Structure records and history were preserved/);
  click("Goals");
  fireEvent.click(await screen.findByRole("button", { name: /Source A restored Goal/ }));
  fireEvent.click(await screen.findByRole("button", { name: "Open Structure" }));
  await screen.findByText(/Ordinary Structure changes and retry are blocked/);
  expect(screen.getByRole("button", { name: "Create Milestone" })).toBeDisabled();
  expect(screen.getByText(/Record retired. Applicability: unknown/)).toBeInTheDocument();
  expect(f.store.exportGoalStructureAuthority()).toEqual(source.data.goalStructure);
  const runtime = getDayFrameRuntimeAuthorityController(
    f.store,
    DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  );
  vi.spyOn(runtime, "install").mockReturnValue({ status: "installFailed" });
  await upload(f.backup);
  await waitFor(() => expect(f.store.getReadiness().status).toBe("protected"));
  expect(screen.queryByRole("button", { name: "Create Milestone" })).not.toBeInTheDocument();
});
it("missing endpoint and unsupported condition rejections retain input without invented graph details", async () => {
  const f = await fixture();
  await mount(f.store, f.goals[0]!);
  click("Add prerequisite");
  change("Existing endpoint", f.goals[1]!.id);
  change("Prerequisite strength", "hard");
  vi.spyOn(f.store, "createRelationship").mockResolvedValueOnce({
    status: "rejected",
    reason: "missingEndpoint",
  });
  click("Save Structure");
  await screen.findByText(/selected record or endpoint is unavailable/);
  expect(screen.getByLabelText("Existing endpoint")).toHaveValue(f.goals[1]!.id);
  vi.restoreAllMocks();
  const select = screen.getByLabelText("Prerequisite condition");
  const option = document.createElement("option");
  option.value = "unsupported";
  option.textContent = "Unsupported input fixture";
  select.append(option);
  fireEvent.change(select, { target: { value: "unsupported" } });
  change("Existing endpoint", f.goals[1]!.id);
  click("Save Structure");
  await screen.findByText(/rejected by Structure validation/);
  expect(f.store.exportGoalStructureAuthority().relationships).toEqual([]);
});

it("UI prerequisite changes only affect the next explicit planning evaluation", async () => {
  const f = await v14RestoreFixture();
  const g = await f.store.createGoal({ title: "Planning workflow" });
  if (g.status !== "accepted") throw Error("goal");
  const d = await f.store.createDemand({
    goalId: g.goal.id,
    requestedEffort: { unit: "minutes", amount: 60 },
    horizon: {
      kind: "userDayInterval",
      startUserDayDate: "2026-09-25",
      endUserDayDateExclusive: "2026-09-26",
    },
    session: { mode: "indivisible", exactMinutes: 60 },
    satisfaction: { kind: "target", allowPartial: false },
    cadence: { kind: "total" },
  });
  if (d.status !== "accepted") throw Error("demand");
  await f.store.setDemandResourceFootprintAssociation({
    demandId: d.value.id,
    selection: { kind: "productiveOnly" },
  });
  const evaluate = vi.spyOn(f.store, "evaluateCompetingAllocation");
  render(<DayFrameApp store={f.store} />);
  click("Goals");
  fireEvent.click(await screen.findByRole("button", { name: /Planning workflow/ }));
  await screen.findByLabelText("Requested Time hours");
  fireEvent.click(await screen.findByRole("button", { name: "Open Structure" }));
  await screen.findByText(/No current structural prerequisite/);
  click("Create Milestone");
  change("Milestone title", "Prerequisite checkpoint");
  await save();
  const m = f.store.listGoalStructureMilestones(g.goal.id)[0]!;
  const acceptedBefore = f.store.exportProposalAuthority().acceptedAllocations;
  click("Add prerequisite");
  change("Prerequisite condition", "milestoneSatisfied");
  change("Existing endpoint", m.id);
  change("Prerequisite strength", "hard");
  await save();
  expect(evaluate).not.toHaveBeenCalled();
  const before = f.store.exportProposalAuthority();
  click("Evaluate planning opportunity");
  await screen.findByText(/No proposal is available/);
  expect(evaluate).toHaveBeenCalledTimes(1);
  expect(f.store.exportProposalAuthority()).toEqual(before);
  click(`Edit Milestone: Prerequisite checkpoint · ${m.id}`);
  change("Checkpoint state", "satisfied");
  await save();
  expect(evaluate).toHaveBeenCalledTimes(1);
  expect(f.store.exportProposalAuthority()).toEqual(before);
  click("Evaluate planning opportunity");
  await screen.findByText(/Proposal saved for review/);
  expect(evaluate).toHaveBeenCalledTimes(2);
  expect(f.store.exportProposalAuthority().acceptedAllocations).toEqual(acceptedBefore);
  expect(f.store.getGoal(g.goal.id)?.status).toBe("active");
});
it("UI-authored retirement retains exact history through reload and supported backup replacement", async () => {
  const f = await fixture();
  await mount(f.store, f.goals[0]!);
  await relation("contributesTo", f.goals[1]!.id);
  const original = f.store.listGoalStructureRelationships(f.goals[0]!.id)[0]!;
  click(`Retire relationship ${original.id}`);
  click("Confirm relationship retirement");
  await screen.findByText(/Record retired/);
  const authority = f.store.exportGoalStructureAuthority();
  const exported = await f.store.exportBackupV14(new Date().toISOString());
  if (exported.status !== "exported") throw Error("export");
  const reload = createDayFrameStore();
  await reload.whenReady();
  expect(reload.exportGoalStructureAuthority()).toEqual(authority);
  expect(reload.getGoalStructureRelationshipRevision(original.id, 1)).toEqual({
    status: "resolved",
    relationship: original,
  });
  expect(await reload.importBackupFile(exported.backup)).toMatchObject({ status: "restoredV14" });
  expect(reload.exportGoalStructureAuthority()).toEqual(authority);
});

it("a queued read failure for A cannot appear beneath B after selection changes", async () => {
  const f = await fixture();
  const context = createGoalEditingContext();
  const query = f.store.queryGoalStructure;
  vi.spyOn(f.store, "queryGoalStructure").mockImplementation((input) => {
    if (input.goalId === f.goals[0]!.id) throw Error("controlled A read failure");
    return query(input);
  });
  const props = { store: f.store, context, onGoal: () => {} };
  const mounted = render(<GoalStructureSection {...props} goal={f.goals[0]!} />);
  click("Open Structure");
  mounted.rerender(<GoalStructureSection {...props} goal={f.goals[1]!} />);
  click("Open Structure");
  await screen.findByText(/No current structural prerequisite/);
  expect(screen.queryByText(/could not be read/)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create Milestone" })).toBeEnabled();
});
it("an aborted import transaction keeps a draft but a late accepted result cannot resurrect invalidated context", async () => {
  const f = await fixture();
  const context = createGoalEditingContext();
  const mounted = await mount(f.store, f.goals[0]!, context);
  click("Create Milestone");
  change("Milestone title", "Original draft");
  const runtime = getDayFrameRuntimeAuthorityController(
    f.store,
    DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  );
  runtime.begin("restore");
  runtime.abort();
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Original draft");
  const create = f.store.createMilestone;
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  vi.spyOn(f.store, "createMilestone").mockImplementation(async (input) => {
    const result = await create(input);
    await gate;
    return result;
  });
  click("Save Structure");
  await waitFor(() => expect(f.store.listGoalStructureMilestones(f.goals[0]!.id)).toHaveLength(1));
  context.invalidate();
  const replacement = createGoalEditingContext();
  mounted.rerender(<GoalStructureSection {...mounted.props} context={replacement} />);
  await act(async () => release());
  expect(screen.queryByLabelText("Milestone title")).not.toBeInTheDocument();
  expect(screen.queryByText(/Structure accepted \(/)).not.toBeInTheDocument();
});

it("loading a setup profile keeps Structure intent and independent authority", async () => {
  const f = await v14RestoreFixture();
  const goal = f.store.getGoal(f.goalId)!;
  await mount(f.store, goal);
  click("Create Milestone");
  change("Milestone title", "Keep through profile");
  const before = f.store.exportGoalStructureAuthority();
  await act(async () => {
    f.store.loadProfile(f.store.getState().savedProfiles[0]!.id);
  });
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Keep through profile");
  expect(f.store.exportGoalStructureAuthority()).toEqual(before);
});

it("successful full clear invalidates the app-owned Structure editor", async () => {
  const f = await v14RestoreFixture();
  render(<DayFrameApp store={f.store} />);
  click("Goals");
  fireEvent.click(await screen.findByRole("button", { name: /Source A restored Goal/ }));
  fireEvent.click(await screen.findByRole("button", { name: "Open Structure" }));
  await screen.findByRole("button", { name: /Open related Goal:/ });
  click("Create Milestone");
  change("Milestone title", "Must not survive clear");
  click("Clear Local Data");
  click("Confirm Clear Local Data");
  await screen.findByText("Local DayFrame setup data cleared from this device.");
  click("Goals");
  await screen.findByRole("heading", { name: "Goals" });
  expect(screen.queryByLabelText("Milestone title")).not.toBeInTheDocument();
  expect(f.store.listGoals()).toHaveLength(0);
  expect(f.store.exportGoalStructureAuthority().milestones).toHaveLength(0);
});

it("a different store owner cannot inherit a pending editor or its late outcome", async () => {
  const f = await fixture();
  const mounted = await mount(f.store, f.goals[0]!);
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  const original = f.store.createMilestone;
  vi.spyOn(f.store, "createMilestone").mockImplementation(async (input) => {
    const result = await original(input);
    await gate;
    return result;
  });
  click("Create Milestone");
  change("Milestone title", "Old owner");
  click("Save Structure");
  await waitFor(() => expect(f.store.listGoalStructureMilestones(f.goals[0]!.id)).toHaveLength(1));
  const replacement = createDayFrameStore();
  await replacement.whenReady();
  mounted.rerender(<GoalStructureSection {...mounted.props} store={replacement} />);
  await act(async () => release());
  expect(screen.queryByLabelText("Milestone title")).not.toBeInTheDocument();
  expect(screen.queryByText(/Structure accepted \(/)).not.toBeInTheDocument();
  click("Open Structure");
  await screen.findByText(/No current structural prerequisite/);
  expect(screen.getByRole("button", { name: /Edit Milestone: Old owner/ })).toBeEnabled();
});
