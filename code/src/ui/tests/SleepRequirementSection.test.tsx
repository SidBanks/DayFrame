import { createDayFrameStore } from "../../state/dayFrameStore.js";
import { myScheduleFixture } from "./myScheduleFixtures.js";
/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { useEffect, useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SleepRequirementSection } from "../SleepRequirementSection.js";
import { createReadyDayFrameTestStore } from "../../state/tests/dayFrameStoreTestUtils.js";
import type { DayFrameStore } from "../../state/types.js";
const ownerDay = "2026-09-21";
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
function Harness({ store }: { store: DayFrameStore }) {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(setState), [store]);
  return (
    <SleepRequirementSection
      store={store}
      state={state}
      ownerDay={ownerDay}
      setupDirty={false}
      onReview={() => {}}
    />
  );
}
it("has no implicit requirement; drafts/cancel do not write and canonical save adds one primary revision", () => {
  const store = createReadyDayFrameTestStore(),
    author = vi.spyOn(store, "authorSleepRequirement"),
    generate = vi.spyOn(store, "generatePreview");
  const before = JSON.stringify(store.getState());
  render(<Harness store={store} />);
  expect(screen.getByText(/No Sleep configured/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Configure Sleep" }));
  fireEvent.change(screen.getByLabelText("Sleep duration hours"), { target: { value: "7" } });
  fireEvent.change(screen.getByLabelText("Sleep duration minutes"), { target: { value: "30" } });
  expect(JSON.stringify(store.getState())).toBe(before);
  fireEvent.click(screen.getByRole("button", { name: "Cancel Sleep edits" }));
  expect(author).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Configure Sleep" }));
  fireEvent.change(screen.getByLabelText("Sleep duration minutes"), { target: { value: "15" } });
  fireEvent.change(screen.getByLabelText("Before sleep minutes"), { target: { value: "20" } });
  fireEvent.change(screen.getByLabelText("After sleep minutes"), { target: { value: "10" } });
  fireEvent.click(screen.getByRole("button", { name: "Save Sleep" }));
  expect(author).toHaveBeenCalledOnce();
  expect(store.getState().sleepRequirements?.[0]).toMatchObject({
    revision: 1,
    durationMinutes: 495,
    bufferBeforeMinutes: 20,
    bufferAfterMinutes: 10,
  });
  expect(generate).not.toHaveBeenCalled();
  expect(screen.queryByLabelText("Priority")).toBeNull();
  expect(screen.queryByRole("button", { name: /Skip Sleep|Shorten Sleep|Split Sleep/ })).toBeNull();
});
it.each(["beforeWork", "afterWork"] as const)(
  "round-trips %s window, off-day fallback, weekdays and effective dates; invalid save stays a draft",
  (kind) => {
    const store = createReadyDayFrameTestStore();
    render(<Harness store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Configure Sleep" }));
    fireEvent.change(screen.getByLabelText("Sleep window"), { target: { value: kind } });
    fireEvent.change(screen.getByLabelText("Window start"), { target: { value: "23:30" } });
    fireEvent.change(screen.getByLabelText("Window end"), { target: { value: "09:30" } });
    fireEvent.change(screen.getByLabelText("Preferred start (optional)"), {
      target: { value: "00:30" },
    });
    fireEvent.click(screen.getByLabelText("Every day"));
    fireEvent.click(screen.getByLabelText("sunday"));
    fireEvent.change(screen.getByLabelText("Effective until (exclusive, optional)"), {
      target: { value: "2026-10-01" },
    });
    fireEvent.change(screen.getByLabelText("Work-relative window hours"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Sleep" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid Sleep Work-relative");
    expect(store.getState().sleepRequirements ?? []).toHaveLength(0);
    fireEvent.change(screen.getByLabelText("Work-relative window hours"), {
      target: { value: "12" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Sleep" }));
    expect(store.getState().sleepRequirements?.[0]).toMatchObject({
      weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      effectiveUntilExclusive: "2026-10-01",
      window: {
        kind,
        spanMinutes: 720,
        offDay: { startClock: "23:30", endClock: "09:30", preferredStartClock: "00:30" },
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Edit Sleep requirement" }));
    expect(screen.getByLabelText("Window start")).toHaveValue("23:30");
    fireEvent.click(screen.getByLabelText("Enabled requirement"));
    fireEvent.click(screen.getByRole("button", { name: "Save Sleep" }));
    expect(store.getState().sleepRequirements).toHaveLength(2);
    expect(store.getState().sleepRequirements?.[1]?.enabled).toBe(false);
  },
);
it("retains a rejected stale edit without installing optimistic authority", () => {
  const store = createReadyDayFrameTestStore();
  render(<Harness store={store} />);
  fireEvent.click(screen.getByRole("button", { name: "Configure Sleep" }));
  const before = JSON.stringify(store.getState());
  vi.spyOn(store, "authorSleepRequirement").mockReturnValue({ status: "stale" });
  fireEvent.click(screen.getByRole("button", { name: "Save Sleep" }));
  expect(screen.getByRole("alert")).toHaveTextContent("changed while you were editing");
  expect(JSON.stringify(store.getState())).toBe(before);
  expect(screen.getByLabelText("Sleep duration hours")).toHaveValue(8);
});
it("protected evidence is not no configuration and cannot open a writer", () => {
  const store = createReadyDayFrameTestStore();
  vi.spyOn(store, "queryEffectiveSleepRequirement").mockReturnValue({ status: "protected" });
  render(<Harness store={store} />);
  expect(screen.getByText(/cannot currently be read safely/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Configure Sleep" })).toBeDisabled();
});

it("editing the requirement retains accepted occurrence-placement evidence exactly", async () => {
  createReadyDayFrameTestStore();
  const fixture = myScheduleFixture(0);
  const store = createDayFrameStore({
    ...fixture,
    shiftDefinitions: fixture.shiftDefinitions!.map((s) => ({
      ...s,
      startTime: "12:00",
      endTime: "13:00",
      crossesMidnight: false,
    })),
  });
  await store.whenReady();
  store.setSchedulingPreferences({ dayBoundaryStartTime: "00:00", weekStartsOn: "monday" });
  const authored = store.authorSleepRequirement({
    id: "primary-sleep",
    expectedRevision: null,
    recordedAt: "2026-09-01T00:00:00.000Z",
    intent: {
      enabled: true,
      effectiveFrom: "2026-09-01",
      weekdays: "all",
      durationMinutes: 120,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      window: { kind: "clock", startClock: "00:00", endClock: "08:00" },
    },
  });
  expect(authored.status).toBe("authored");
  const ownerRange = {
    startUserDayDate: "2026-09-21",
    endUserDayDateExclusive: "2026-09-22",
  } as const;
  const r = await store.resolveRequiredSleep({ ownerRange });
  if (r.status !== "satisfied") throw Error(r.status);
  const t = store.trySleepPlacement({
    ownerRange,
    target: r.occurrences.find((o) => o.membership === "requested")!.reference,
    sleepStart: new Date(2026, 8, 21, 2).toISOString(),
  });
  if (t.status !== "available") throw Error(JSON.stringify(t));
  expect(store.acceptPlanDecision(t.candidate).status).toBe("accepted");
  const before = store.getPlanDecisions();
  render(<Harness store={store} />);
  fireEvent.click(screen.getByRole("button", { name: "Edit Sleep requirement" }));
  fireEvent.change(screen.getByLabelText("Sleep duration hours"), { target: { value: "3" } });
  fireEvent.click(screen.getByRole("button", { name: "Save Sleep" }));
  expect(store.getState().sleepRequirements?.at(-1)?.durationMinutes).toBe(180);
  expect(store.getPlanDecisions()).toEqual(before);
});
