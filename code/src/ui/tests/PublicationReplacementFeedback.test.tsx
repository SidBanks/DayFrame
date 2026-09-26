/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { DayFrameApp } from "../DayFrameApp.js";
import { goalInspectionCanonicalFixture } from "./goalInspectionCanonicalFixture.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY as capability,
  getDayFrameRuntimeAuthorityController,
} from "../../state/dayFrameRuntimeAuthority.js";
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
it("busy full clear keeps independent Goal, Requested Time and Structure drafts and explains that clear did not start", async () => {
  const { store } = await goalInspectionCanonicalFixture();
  render(<DayFrameApp store={store} />);
  fireEvent.click(screen.getByRole("button", { name: "Goals" }));
  fireEvent.click(await screen.findByRole("button", { name: /Network\+ renamed/ }));
  fireEvent.change(await screen.findByLabelText("Requested Time hours"), {
    target: { value: "7" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Edit Goal" }));
  fireEvent.change(screen.getByLabelText("Goal title"), {
    target: { value: "Preserved Goal draft" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Open Structure" }));
  fireEvent.click(await screen.findByRole("button", { name: "Create Milestone" }));
  fireEvent.change(screen.getByLabelText("Milestone title"), {
    target: { value: "Preserved Structure draft" },
  });
  const controller = getDayFrameRuntimeAuthorityController(store, capability);
  const before = store.getState();
  expect(controller.begin().status).toBe("begun");
  fireEvent.click(screen.getByText("Settings and data", { selector: "summary" }));
  fireEvent.click(screen.getByRole("button", { name: "Clear Local Data" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm Clear Local Data" }));
  expect(await screen.findByText(/Clear was not started/)).toBeVisible();
  expect(screen.getByLabelText("Goal title")).toHaveValue("Preserved Goal draft");
  fireEvent.click(
    within(screen.getByRole("form", { name: "Edit Goal" })).getByRole("button", { name: "Cancel" }),
  );
  expect(await screen.findByLabelText("Requested Time hours")).toHaveValue(7);
  expect(screen.getByLabelText("Milestone title")).toHaveValue("Preserved Structure draft");
  expect(store.getState()).toEqual(before);
  controller.abort();
});
