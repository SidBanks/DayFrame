/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { DayFrameApp } from "../DayFrameApp.js";
import { v14RestoreFixture } from "./v14RestoreFixture.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  getDayFrameRuntimeAuthorityController,
} from "../../state/dayFrameRuntimeAuthority.js";
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("indexedDB", new IDBFactory());
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-23T12:00:00Z"));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
const change = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
async function setup() {
  const f = await v14RestoreFixture();
  vi.setSystemTime(new Date("2026-09-23T13:00:00Z"));
  const g = f.store.getGoal(f.goalId)!;
  await f.store.updateGoal(g.id, g.revision, { title: "Destination B" });
  vi.spyOn(f.store, "queryAcceptedPlanningEvidence");
  render(<DayFrameApp store={f.store} />);
  fireEvent.click(screen.getByRole("button", { name: "Goals" }));
  fireEvent.click(await screen.findByRole("button", { name: /Destination B/ }));
  await screen.findByLabelText("Requested Time hours");
  return f;
}
async function importText(text: string) {
  fireEvent.change(await screen.findByLabelText("Import Setup Backup File"), {
    target: { files: [{ text: async () => text }] },
  });
}
it("cancellation and rejected inputs preserve drafts/disclosures; successful V14 restore invalidates pending Goal evidence", async () => {
  const f = await setup();
  change("Requested Time hours", "7");
  fireEvent.click(screen.getByRole("button", { name: "Edit Goal" }));
  change("Goal title", "Unwritten Goal draft");
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted planning" }));
  await screen.findByText(/3 readable accepted iterations/);
  change("Goal inspection start date", "2026-09-04");
  change("Goal inspection end date", "2026-09-06");
  fireEvent.click(screen.getByRole("button", { name: "Apply inspection period" }));
  await screen.findByText(/3 readable accepted iterations/);
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted iteration 1" }));
  const before = await f.store.exportBackupV14(new Date().toISOString());
  const imported = vi.spyOn(f.store, "importBackupFile");
  fireEvent.change(screen.getByLabelText("Import Setup Backup File"), { target: { files: [] } });
  await act(async () => {});
  expect(imported).not.toHaveBeenCalled();
  for (const text of ["{bad", JSON.stringify({ version: 999 }), JSON.stringify({ version: 14 })]) {
    await importText(text);
    await screen.findByRole("alert");
    expect(screen.getByRole("button", { name: "Import Setup Backup" })).toHaveFocus();
    expect(screen.getByLabelText("Goal title")).toHaveValue("Unwritten Goal draft");
    expect(screen.getByLabelText("Goal inspection end date")).toHaveValue("2026-09-06");
    expect(screen.getByRole("button", { name: "Close accepted iteration 1" })).toBeInTheDocument();
  }
  const after = await f.store.exportBackupV14(new Date().toISOString());
  expect(after).toEqual(before);
  const result = await f.store.queryAcceptedPlanningEvidence({
    select: { kind: "goal", id: f.goalId },
    startUserDayDate: "2026-09-04",
    endUserDayDateExclusive: "2026-09-07",
    asOf: new Date().toISOString(),
  });
  let resolve!: (v: typeof result) => void;
  const query = vi.spyOn(f.store, "queryAcceptedPlanningEvidence").mockImplementationOnce(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  query.mockClear();
  fireEvent.click(screen.getByRole("button", { name: "Refresh Goal evidence" }));
  await waitFor(() => expect(resolve).toBeDefined());
  await importText(JSON.stringify(f.backup));
  await screen.findByText(/Complete backup restored across setup/, {}, { timeout: 10000 });
  await act(async () => resolve(result));
  fireEvent.click(screen.getByRole("button", { name: "Goals" }));
  fireEvent.click(await screen.findByRole("button", { name: /Source A restored Goal/ }));
  expect(screen.queryByLabelText("Goal title")).not.toBeInTheDocument();
  expect(screen.queryByText(/readable accepted iterations/)).not.toBeInTheDocument();
  await screen.findByLabelText("Requested Time hours");
  expect(screen.getByLabelText("Requested Time hours")).toHaveValue(1);
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted planning" }));
  await screen.findByText(/3 readable accepted iterations/);
  expect(screen.getByLabelText("Goal inspection start date")).toHaveValue("2026-09-01");
  expect(query).toHaveBeenCalledTimes(2);
}, 20000);
it("a late accepted Requested Time continuation cannot append Priority to restored authority", async () => {
  const f = await setup();
  let release!: () => void;
  const pending = new Promise<void>((r) => {
    release = r;
  });
  const real = f.store.reviseDemand;
  vi.spyOn(f.store, "reviseDemand").mockImplementation(async (...args) => {
    const r = await real(...args);
    await pending;
    return r;
  });
  const priority = vi.spyOn(f.store, "revisePriority");
  change("Requested Time hours", "7");
  change("Goal planning priority", "critical");
  fireEvent.click(screen.getByRole("button", { name: "Save Requested Time" }));
  await waitFor(() =>
    expect(
      f.store.exportGoalPlanningAuthority().demands.some((d) => d.requestedEffort.amount === 420),
    ).toBe(true),
  );
  await importText(JSON.stringify(f.backup));
  await screen.findByText(/Complete backup restored across setup/, {}, { timeout: 10000 });
  await act(async () => release());
  expect(priority).not.toHaveBeenCalled();
  expect(f.store.exportGoalPlanningAuthority()).toEqual(f.backup.data.goalPlanning);
}, 20000);
it("a post-mutation injected failure shows the existing recovery boundary and invalidates editing", async () => {
  const f = await setup();
  fireEvent.click(screen.getByRole("button", { name: "Edit Goal" }));
  change("Goal title", "Unsafe old draft");
  const runtime = getDayFrameRuntimeAuthorityController(
    f.store,
    DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  );
  vi.spyOn(runtime, "install").mockReturnValue({ status: "installFailed" });
  await importText(JSON.stringify(f.backup));
  await waitFor(
    () =>
      expect(f.store.getReadiness()).toEqual({
        status: "protected",
        reason: "authorityRecoveryRequired",
      }),
    { timeout: 10000 },
  );
  expect(screen.queryByRole("button", { name: "Save Goal" })).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Goal title")).not.toBeInTheDocument();
}, 20000);
