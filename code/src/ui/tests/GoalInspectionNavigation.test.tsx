/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { writeFileSync } from "node:fs";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { DayFrameApp } from "../DayFrameApp.js";
import { goalInspectionCanonicalFixture } from "./goalInspectionCanonicalFixture.js";
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-23T12:00:00.000Z"));
  localStorage.clear();
  vi.stubGlobal("indexedDB", new IDBFactory());
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
async function fixture() {
  const result = await goalInspectionCanonicalFixture();
  // Keep the canonical period and report clock deterministic while IDB uses real timers.
  vi.setSystemTime(new Date("2026-09-23T13:00:00.000Z"));
  return result;
}
it("real G2 → Daily Planner → report → Back refreshes outcomes while retaining Requested Time and Goal drafts", async () => {
  const { store, goal } = await fixture();
  if (process.env.DAYFRAME_925_BACKUP_RESULT) {
    const exported = await store.exportBackupV14(new Date().toISOString());
    if (exported.status !== "exported") throw Error(JSON.stringify(exported));
    writeFileSync(process.env.DAYFRAME_925_BACKUP_RESULT, JSON.stringify(exported.backup, null, 2));
  }

  const query = vi.spyOn(store, "queryAcceptedPlanningEvidence"),
    day = vi.spyOn(store, "querySelectedDayEvidence");
  const before = store.exportGoalPlanningAuthority();
  const writes = [
    "updateGoal",
    "reviseDemand",
    "createDemand",
    "createPriority",
    "revisePriority",
    "recordProposal",
    "acceptProposalOption",
    "realizeAcceptedAllocation",
    "publishScheduleRange",
    "recordExecution",
    "correctExecutionRecord",
    "retractExecutionRecord",
  ] as const;
  const spies = writes.map((name) => vi.spyOn(store, name));
  render(<DayFrameApp store={store} getNow={() => new Date()} />);
  fireEvent.click(screen.getByRole("button", { name: "Goals" }));
  fireEvent.click(await screen.findByRole("button", { name: /Network\+ renamed/ }));
  await screen.findByLabelText("Requested Time hours");
  fireEvent.change(screen.getByLabelText("Requested Time hours"), { target: { value: "7" } });
  fireEvent.click(await screen.findByRole("button", { name: "Inspect accepted planning" }));
  await screen.findByText(/3 readable accepted iterations/, {}, { timeout: 10000 });
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted iteration 1" }));
  fireEvent.click(screen.getByRole("button", { name: /Inspect scheduled fact: Goal work/ }));
  fireEvent.click(screen.getByText(/Publication: /));
  expect(screen.getByText(/Goal name at publication: Network\+ original/)).toBeInTheDocument();
  const dayButton = screen.getByRole("button", { name: /Open Daily Planner for/ });
  const owner = dayButton.textContent!.replace("Open Daily Planner for ", "");
  fireEvent.click(dayButton);
  await screen.findByRole("heading", { name: /Day agenda/ });
  expect(day).toHaveBeenCalledWith(expect.objectContaining({ ownerDay: owner }));
  for (const spy of spies) expect(spy).not.toHaveBeenCalled();
  // Existing Daily Planner owns the explicit report. The inspector has no reporting command.
  const details = await screen.findAllByRole("button", { name: /Details:/ });
  const target =
    details.find((b) => b.closest("li")?.textContent?.includes("Goal work")) ?? details[0]!;
  fireEvent.click(target);
  fireEvent.click(await screen.findByRole("button", { name: "Report outcome" }));
  fireEvent.click(screen.getByRole("button", { name: "Save outcome" }));
  await waitFor(() => expect(store.getExecutionHistory().length).toBeGreaterThan(0));
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  await screen.findByText(/3 readable accepted iterations/, {}, { timeout: 10000 });
  expect(query).toHaveBeenCalledTimes(2);
  expect(screen.getByText("Completed", { selector: ".df-goal-inspection p" })).toBeInTheDocument();
  expect(screen.getByLabelText("Requested Time hours")).toHaveValue(7);
  expect(
    screen.getByRole("heading", { name: "Accepted planning and scheduled work" }),
  ).toHaveFocus();
  expect(screen.getByText(/Goal name at publication: Network\+ original/)).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Edit Goal" }));
  fireEvent.change(screen.getByLabelText("Goal title"), {
    target: { value: "Unrelated Goal draft" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Open Daily Planner for/ }));
  await screen.findByRole("heading", { name: /Day agenda/ });
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  await screen.findByText(/3 readable accepted iterations/, {}, { timeout: 10000 });
  expect(screen.getByLabelText("Goal title")).toHaveValue("Unrelated Goal draft");
  expect(store.getGoal(goal.id)?.title).toBe("Network+ renamed");
  expect(store.exportGoalPlanningAuthority()).toEqual(before);
}, 20000);

it("Summary → Goal → Day → Back keeps independent periods and predictable return context", async () => {
  const { store } = await fixture();
  const query = vi.spyOn(store, "queryAcceptedPlanningEvidence");
  render(<DayFrameApp store={store} getNow={() => new Date()} />);
  fireEvent.click(screen.getByRole("button", { name: "Summary" }));
  await screen.findByLabelText("Accepted planning start date");
  fireEvent.change(screen.getByLabelText("Accepted planning start date"), {
    target: { value: "2026-09-04" },
  });
  fireEvent.change(screen.getByLabelText("Accepted planning end date"), {
    target: { value: "2026-09-06" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Apply planning period" }));
  fireEvent.click(await screen.findByRole("button", { name: /Inspect planning:/ }));
  fireEvent.click(screen.getByRole("button", { name: "View Goal" }));
  await screen.findByText(/3 readable accepted iterations/, {}, { timeout: 10000 });
  expect(screen.getByLabelText("Goal inspection start date")).toHaveValue("2026-09-04");
  expect(screen.getByLabelText("Goal inspection end date")).toHaveValue("2026-09-06");
  expect(query.mock.calls.filter(([q]) => q.select?.kind === "goal")).toHaveLength(1);
  fireEvent.change(screen.getByLabelText("Goal inspection end date"), {
    target: { value: "2026-09-04" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Apply inspection period" }));
  await screen.findByText(/1 readable accepted iterations/);
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted iteration 1" }));
  fireEvent.click(screen.getByRole("button", { name: /Inspect scheduled fact: Goal work/ }));
  fireEvent.click(screen.getByRole("button", { name: /Open Daily Planner/ }));
  await screen.findByRole("heading", { name: /Day agenda/ });
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  await screen.findByText(/1 readable accepted iterations/);
  expect(screen.getByLabelText("Goal inspection end date")).toHaveValue("2026-09-04");
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  await screen.findByLabelText("Accepted planning start date");
  expect(screen.getByLabelText("Accepted planning end date")).toHaveValue("2026-09-06");
  expect(
    await screen.findByRole("button", { name: "Close planning: Network+ renamed" }),
  ).toBeInTheDocument();
}, 20000);

it.each(["clear", "restore"] as const)(
  "%s invalidates pending Goal inspection at the real application boundary",
  async (operation) => {
    const { store } = await fixture();
    const exported = await store.exportBackupV14(new Date().toISOString());
    if (exported.status !== "exported") throw Error(JSON.stringify(exported));
    let resolve!: (v: Awaited<ReturnType<typeof store.queryAcceptedPlanningEvidence>>) => void;
    const result = await store.queryAcceptedPlanningEvidence({
      startUserDayDate: "2026-09-01",
      endUserDayDateExclusive: "2026-10-01",
      asOf: new Date().toISOString(),
    });
    vi.spyOn(store, "queryAcceptedPlanningEvidence").mockImplementation(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    render(<DayFrameApp store={store} getNow={() => new Date()} />);
    fireEvent.click(screen.getByRole("button", { name: "Goals" }));
    fireEvent.click(await screen.findByRole("button", { name: /Network\+ renamed/ }));
    fireEvent.click(await screen.findByRole("button", { name: "Inspect accepted planning" }));
    await waitFor(() => expect(resolve).toBeDefined());
    fireEvent.click(screen.getByRole("button", { name: "My Schedule" }));
    if (operation === "clear") {
      fireEvent.click(await screen.findByRole("button", { name: "Clear Local Data" }));
      fireEvent.click(screen.getByRole("button", { name: "Confirm Clear Local Data" }));
      await screen.findByText("Local DayFrame setup data cleared from this device.");
    } else {
      fireEvent.change(await screen.findByLabelText("Import Setup Backup File"), {
        target: { files: [{ text: async () => JSON.stringify(exported.backup) }] },
      });
      await screen.findByText(/Complete backup restored across setup/, {}, { timeout: 10000 });
    }
    await act(async () => {
      resolve(result);
    });
    fireEvent.click(screen.getByRole("button", { name: "Goals" }));
    await screen.findByRole("heading", { name: "Goals" });
    expect(screen.queryByText(/readable accepted iterations/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Loading Goal evidence/)).not.toBeInTheDocument();
  },
  20000,
);
