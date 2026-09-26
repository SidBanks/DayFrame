/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { DayWorksurface, type DayWorksurfaceProps } from "../DayWorksurface.js";
import { buildSelectedDayEvidence } from "../../core/productEvidence/selectedDayEvidence.js";
import { lineageFixture } from "../../core/productEvidence/evidenceTestFixtures.js";
import { available } from "../../core/productEvidence/evidence.js";
import { createBootstrapPlaceholderState } from "../../state/dayFrameReadiness.js";
import { createDayFrameStore } from "../../state/dayFrameStore.js";
import { createReviewScope } from "../../core/planning/reviewScope.js";
import type { DayEvidence, DayResult } from "../dayWorksurfacePresentation.js";
import { publishedRows, currentRows } from "../dayWorksurfacePresentation.js";
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("indexedDB", new IDBFactory());
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
const now = () => new Date("2026-09-20T12:00:00.000Z");
function fixture(): DayEvidence {
  const f = lineageFixture();
  const result = buildSelectedDayEvidence({
    query: { ownerDay: "2026-09-04", asOf: now().toISOString() },
    state: createBootstrapPlaceholderState(),
    authoredStatus: "available",
    realized: available(f.facts),
    sleep: { status: "notApplicable", reason: "fixture" },
    history: f.input.history,
    actual: available([]),
  });
  if (result.status !== "projected") throw Error();
  return result;
}
function props(result: DayResult = fixture()): DayWorksurfaceProps {
  return {
    ownerDay: "2026-09-04",
    now,
    query: vi.fn(async () => result),
    store: {
      recordExecution: vi.fn(() => ({
        status: "rejected" as const,
        reason: "invalidInput" as const,
      })),
      correctExecutionRecord: vi.fn(() => ({
        status: "rejected" as const,
        reason: "invalidInput" as const,
      })),
      retractExecutionRecord: vi.fn(() => ({
        status: "rejected" as const,
        reason: "invalidInput" as const,
      })),
      recordSleepExecution: vi.fn(async () => ({
        status: "rejected" as const,
        reason: "invalidInput" as const,
      })),
    },
    onReview: vi.fn(),
    onWork: vi.fn(),
    onGoal: vi.fn(),
    onAddEvent: vi.fn(),
    onEditEvent: vi.fn(),
  };
}
it("latest selected owner wins when A resolves after B; real asOf never becomes selected date", async () => {
  let a!: (r: DayResult) => void, b!: (r: DayResult) => void;
  const query = vi
    .fn()
    .mockImplementationOnce(() => new Promise((r) => (a = r)))
    .mockImplementationOnce(() => new Promise((r) => (b = r)));
  const p = { ...props(), query };
  const view = render(<DayWorksurface {...p} />);
  expect(screen.getByText("Loading this day…")).toBeInTheDocument();
  view.rerender(<DayWorksurface {...p} ownerDay="2026-09-05" />);
  await act(async () => b({ ...fixture(), ownerDay: "2026-09-05" }));
  await act(async () => a(fixture()));
  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("September 5");
  expect(query.mock.calls).toEqual([
    [{ ownerDay: "2026-09-04", asOf: now().toISOString() }],
    [{ ownerDay: "2026-09-05", asOf: now().toISOString() }],
  ]);
});
it("orders lawful accepted facts deterministically, keeps support/protection distinct and expands only one item", async () => {
  const e = fixture();
  const p = props(e);
  render(<DayWorksurface {...p} />);
  await screen.findByText("Published schedule · outcomes shown separately.");
  const rows = publishedRows(e);
  expect(rows.map((r) => r.start)).toEqual([...rows.map((r) => r.start)].sort());
  expect(rows.some((r) => r.role === "supportActivity")).toBe(true);
  expect(rows.some((r) => r.role === "bufferProtection")).toBe(true);
  const details = screen.getAllByRole("button", { name: /^Details:/ });
  fireEvent.click(details[0]!);
  expect(document.querySelectorAll(".df-day-detail")).toHaveLength(1);
  fireEvent.click(details[1]!);
  expect(document.querySelectorAll(".df-day-detail")).toHaveLength(1);
  const buffer = [...document.querySelectorAll<HTMLElement>(".df-day-protection")][0]!;
  fireEvent.click(within(buffer).getByRole("button", { name: /Details/ }));
  expect(within(buffer).queryByRole("button", { name: "Report outcome" })).toBeNull();
  fireEvent.click(within(buffer).getByRole("button", { name: "Return to agenda" }));
  expect(within(buffer).getByRole("button", { name: /Details/ })).toHaveFocus();
  for (const fn of Object.values(p.store)) expect(fn).not.toHaveBeenCalled();
});
it.each(["protected", "unavailable"] as const)(
  "%s history is not empty, and independent evidence remains visible",
  async (status) => {
    const e = fixture();
    render(
      <DayWorksurface
        {...props({ ...e, published: { status, reason: "fixture" }, publicationCoverage: status })}
      />,
    );
    expect(
      await screen.findByText(
        status === "protected"
          ? /Published schedule: information cannot/
          : /Published schedule: information is unavailable/,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Nothing scheduled for this DayFrame day.")).toBeNull();
    expect(screen.getByRole("button", { name: "Add Event" })).toBeInTheDocument();
  },
);
it.each(["error", "invalidQuery"] as const)(
  "%s is a retryable error, not an empty day",
  async (status) => {
    render(
      <DayWorksurface
        {...props(
          status === "error"
            ? { status, reason: "evidenceQueryFailed" }
            : { status, reason: "invalidOwnerDayOrAsOf" },
        )}
      />,
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("could not be loaded");
    expect(screen.queryByText("Nothing scheduled for this DayFrame day.")).toBeNull();
  },
);
it("rejected reporting leaves prior truth and does not request a false success refresh", async () => {
  const p = props();
  render(<DayWorksurface {...p} />);
  await screen.findByText("Published schedule · outcomes shown separately.");
  const row = [...document.querySelectorAll<HTMLElement>(".df-day-card")].find((r) =>
    r.textContent?.includes("Goal work"),
  )!;
  fireEvent.click(within(row).getByRole("button", { name: /Details/ }));
  fireEvent.click(within(row).getByRole("button", { name: "Report outcome" }));
  fireEvent.click(within(row).getByRole("button", { name: "Save outcome" }));
  await screen.findByText(/The report could not be saved/);
  expect(p.query).toHaveBeenCalledTimes(1);
  expect(within(row).getByText("Outcome not recorded")).toBeInTheDocument();
  expect(p.store.recordExecution).toHaveBeenCalledTimes(1);
});
async function publishedStore() {
  const store = createDayFrameStore({}, { executionHistoryClock: () => now().toISOString() });
  await store.whenReady();
  store.setSchedulingPreferences({ dayBoundaryStartTime: "00:00", weekStartsOn: "monday" });
  store.authorSleepRequirement({
    id: "sleep",
    expectedRevision: null,
    recordedAt: "2026-09-01T00:00:00.000Z",
    intent: {
      enabled: true,
      effectiveFrom: "2026-09-01",
      weekdays: "all",
      durationMinutes: 120,
      bufferBeforeMinutes: 30,
      bufferAfterMinutes: 30,
      window: { kind: "clock", startClock: "00:00", endClock: "08:00" },
    },
  });
  store.setShiftDefinitions([
    {
      id: "work",
      userId: "u",
      name: "Work",
      startTime: "12:00",
      endTime: "13:00",
      crossesMidnight: false,
      workDays: ["thursday"],
      createdAt: now().toISOString(),
      updatedAt: now().toISOString(),
    },
  ]);
  store.setShiftCycles([
    {
      id: "cycle",
      userId: "u",
      name: "Cycle",
      type: "fixedSegments",
      startsOnDate: "2026-09-01",
      endsOnDate: "2026-10-01",
      createdAt: now().toISOString(),
      updatedAt: now().toISOString(),
      segments: [
        {
          id: "seg",
          shiftCycleId: "cycle",
          shiftDefinitionId: "work",
          startsOnDate: "2026-09-01",
          endsOnDate: "2026-10-01",
        },
      ],
    },
  ]);
  const day = "2026-09-17";
  store.generatePreview({
    rangeStartDate: day,
    rangeEndDate: day,
    planningWindowStart: new Date(day + "T00:00:00"),
    planningWindowEnd: new Date("2026-09-18T00:00:00"),
    generatedAt: "2026-09-16T00:00:00.000Z",
  });
  const reviewScope = createReviewScope({
    kind: "day",
    anchorUserDayDate: day,
    weekStartsOn: "monday",
    source: "explicit",
  });
  const review = await store.queryPlanningReview({ reviewScope, historyAsOf: now().toISOString() });
  expect(
    await store.publishScheduleRange({
      publicationRange: {
        version: 1,
        scopeType: "publicationRange",
        startUserDayDate: day,
        endUserDayDateExclusive: "2026-09-18",
        provenance: { source: "explicitPublication" },
      },
      publishedAt: "2026-09-16T12:00:00.000Z",
      expectedSourceFingerprint: review.sourceFingerprint,
    }),
  ).toMatchObject({ status: "published" });
  return store;
}
it.each(["Work", "Sleep"])(
  "%s report, correction and retraction refresh G1 while frozen publication stays identical",
  async (subject) => {
    const store = await publishedStore(),
      before = await store.exportHistoricalPlan();
    const query = vi.fn(store.querySelectedDayEvidence);
    render(<DayWorksurface {...props()} ownerDay="2026-09-17" query={query} store={store} />);
    await screen.findByText("Published schedule · outcomes shown separately.");
    const row = [...document.querySelectorAll<HTMLElement>(".df-day-card")].find(
      (r) => r.querySelector("h4")?.textContent === subject,
    )!;
    fireEvent.click(within(row).getByRole("button", { name: /Details/ }));
    fireEvent.click(
      within(row).getByRole("button", {
        name: subject === "Sleep" ? "Report actual Sleep" : "Report outcome",
      }),
    );
    fireEvent.change(within(row).getByLabelText("Outcome"), { target: { value: "skipped" } });
    fireEvent.click(within(row).getByRole("button", { name: "Save outcome" }));
    await waitFor(() => expect(query).toHaveBeenCalledTimes(2));
    await within(row).findByText("Didn't do it", { selector: "p" });
    fireEvent.click(within(row).getByRole("button", { name: "Correct or withdraw report" }));
    fireEvent.change(within(row).getByLabelText("Outcome"), { target: { value: "completed" } });
    if (subject === "Sleep") {
      fireEvent.change(within(row).getByLabelText("Actual start"), {
        target: { value: "2026-09-17T01:00" },
      });
      fireEvent.change(within(row).getByLabelText("Elapsed minutes"), { target: { value: "90" } });
    }
    fireEvent.click(within(row).getByRole("button", { name: "Save outcome" }));
    await within(row).findByText("Completed · corrected report");
    fireEvent.click(within(row).getByRole("button", { name: "Correct or withdraw report" }));
    fireEvent.click(within(row).getByRole("button", { name: "Withdraw report" }));
    fireEvent.click(within(row).getByRole("button", { name: "Confirm withdrawal" }));
    await within(row).findByText("Report withdrawn · outcome not recorded");
    expect(query).toHaveBeenCalledTimes(4);
    expect(await store.exportHistoricalPlan()).toEqual(before);
  },
);
it("no Preview stays readable; current stale context and a truly empty generated day are distinct", async () => {
  const store = createDayFrameStore();
  await store.whenReady();
  let e = await store.querySelectedDayEvidence({
    ownerDay: "2026-09-04",
    asOf: now().toISOString(),
  });
  if (e.status !== "projected") throw Error();
  const v = render(<DayWorksurface {...props(e)} />);
  await screen.findByText(/no generated schedule/);
  expect(screen.queryByText("Nothing scheduled for this DayFrame day.")).toBeNull();
  v.unmount();
  store.setShiftCycles([
    {
      id: "off",
      userId: "u",
      name: "Off",
      type: "fixedSegments",
      startsOnDate: "2026-09-01",
      endsOnDate: "2026-10-01",
      createdAt: now().toISOString(),
      updatedAt: now().toISOString(),
      segments: [],
    },
  ]);
  store.generatePreview({
    rangeStartDate: "2026-09-04",
    rangeEndDate: "2026-09-04",
    planningWindowStart: new Date("2026-09-04T00:00:00"),
    planningWindowEnd: new Date("2026-09-05T00:00:00"),
    generatedAt: now().toISOString(),
  });
  e = await store.querySelectedDayEvidence({ ownerDay: "2026-09-04", asOf: now().toISOString() });
  if (e.status !== "projected") throw Error();
  render(<DayWorksurface {...props(e)} />);
  await screen.findByText("Nothing scheduled for this DayFrame day.");
  cleanup();
  if (e.planning.status !== "available") throw Error();
  render(
    <DayWorksurface
      {...props({ ...e, planning: available({ ...e.planning.value, freshness: "stale" }) })}
    />,
  );
  await screen.findByText(/generated before the latest changes/);
  expect(currentRows(e)).toEqual([]);
});

it("future publication targets do not offer execution actions", async () => {
  const p = props({ ...fixture(), mode: "future" });
  render(<DayWorksurface {...p} />);
  await screen.findByText("Published schedule · outcomes shown separately.");
  fireEvent.click(screen.getAllByRole("button", { name: /^Details:/ })[0]!);
  expect(screen.getByText("Outcome entry is not offered on future days.")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Report outcome" })).toBeNull();
});
it("manual events remain authored without Preview and edit by the G1 target", async () => {
  const store = createDayFrameStore();
  await store.whenReady();
  store.setManualEvents([
    {
      id: "manual",
      title: "Dentist",
      userDayDate: "2026-09-04",
      allDay: false,
      startTime: "09:00",
      endTime: "10:00",
      createdAt: now().toISOString(),
      updatedAt: now().toISOString(),
    },
  ]);
  const result = await store.querySelectedDayEvidence({
    ownerDay: "2026-09-04",
    asOf: now().toISOString(),
  });
  const p = props(result);
  render(<DayWorksurface {...p} />);
  await screen.findByText("Dentist");
  fireEvent.click(screen.getByRole("button", { name: "Details: Dentist" }));
  expect(screen.getAllByText("Authored activity · not an outcome").length).toBeGreaterThan(0);
  expect(screen.queryByRole("button", { name: "Report outcome" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Edit Manual Event" }));
  expect(p.onEditEvent).toHaveBeenCalledWith(
    expect.objectContaining({ kind: "event", eventId: "manual", availability: "current" }),
  );
  expect(p.store.recordExecution).not.toHaveBeenCalled();
});
it("Goal navigation uses retained identity rather than a title search", async () => {
  const p = props();
  render(<DayWorksurface {...p} />);
  await screen.findByText("Published schedule · outcomes shown separately.");
  const row = [...document.querySelectorAll<HTMLElement>(".df-day-card")].find((r) =>
    r.textContent?.includes("Goal work"),
  )!;
  fireEvent.click(within(row).getByRole("button", { name: /Details/ }));
  fireEvent.click(within(row).getByRole("button", { name: "View Goal" }));
  expect(p.onGoal).toHaveBeenCalledWith("goal-network");
});
it("native protected Sleep inside an available family is still shown as unreadable", async () => {
  const e = fixture();
  render(
    <DayWorksurface
      {...props({
        ...e,
        sleepPlanning: available({
          version: 1,
          status: "protected",
          reason: "sourceProtected",
          ownerRange: { startUserDayDate: "2026-09-04", endUserDayDateExclusive: "2026-09-05" },
        }),
      })}
    />,
  );
  expect(
    await screen.findByText("Sleep information cannot currently be read safely."),
  ).toBeInTheDocument();
  expect(screen.queryByText("Nothing scheduled for this DayFrame day.")).toBeNull();
});
