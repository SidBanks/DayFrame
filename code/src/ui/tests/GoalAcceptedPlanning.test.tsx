/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import {
  GoalAcceptedPlanningSection,
  type GoalAcceptedPlanningProps,
} from "../GoalAcceptedPlanningSection.js";
import { createGoalEditingContext } from "../goalEditingContext.js";
import { goalInspectionNavigation } from "../goalAcceptedPlanningContext.js";
import { networkSummaryFixture, largeSummaryFixture } from "./acceptedSummaryFixtures.js";
import { buildAcceptedPlanningEvidence } from "../../core/productEvidence/acceptedPlanningEvidence.js";
import { validateProposalAuthority } from "../../core/planning/proposal.js";
import { validateRealizationAuthority } from "../../core/planning/acceptedAllocationRealization.js";
import { available } from "../../core/productEvidence/evidence.js";
import { createDayFrameStore } from "../../state/dayFrameStore.js";
import { DayFrameApp } from "../DayFrameApp.js";
import type { AcceptedSummaryResult } from "../acceptedPlanningSummaryPresentation.js";
const now = () => new Date("2026-09-06T12:00:00.000Z");
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("indexedDB", new IDBFactory());
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function props(overrides: Partial<GoalAcceptedPlanningProps> = {}): GoalAcceptedPlanningProps {
  const subscribe = () => () => true;
  return {
    goalId: "goal-network",
    currentDay: "2026-09-06",
    context: createGoalEditingContext(),
    now,
    query: vi.fn(async () => networkSummaryFixture().evidence),
    store: {
      subscribeGoals: subscribe,
      subscribeGoalPlanning: subscribe,
      subscribeProposals: subscribe,
      subscribeExecutionHistory: subscribe,
      subscribeExecutionHistoryIngress: subscribe,
      subscribeHistory: subscribe,
    },
    onDay: vi.fn(),
    onReview: vi.fn(),
    ...overrides,
  };
}
const change = (name: string, value: string) =>
  fireEvent.change(screen.getByLabelText(name), { target: { value } });
async function open() {
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted planning" }));
  await screen.findByText(/3 readable accepted iterations/);
}
const iteration = (n = 1) =>
  fireEvent.click(screen.getByRole("button", { name: `Inspect accepted iteration ${n}` }));
const fact = () =>
  fireEvent.click(screen.getByRole("button", { name: /Inspect scheduled fact: Goal work/ }));
function deferred<T>() {
  let resolve!: (v: T) => void, reject!: (e: Error) => void;
  const promise = new Promise<T>((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
}

it("keeps return focus pending until navigation has left and the inspector is mounted again", async () => {
  const p = props();
  const first = render(<GoalAcceptedPlanningSection {...p} />);
  await open();
  const review = screen.getByRole("button", { name: "Review Schedule" });
  review.focus();
  // Controlled delayed navigation: the outgoing surface can render before it unmounts.
  fireEvent.click(review);
  expect(p.onReview).toHaveBeenCalledTimes(1);
  expect(review).toHaveFocus();
  first.unmount();
  render(<GoalAcceptedPlanningSection {...p} />);
  await screen.findByText(/3 readable accepted iterations/);
  expect(
    screen.getByRole("heading", { name: "Accepted planning and scheduled work" }),
  ).toHaveFocus();
  expect(p.query).toHaveBeenCalledTimes(2);
});

it("queries the exact selected Goal only on opening, uses the supplied canonical month and fresh asOf, and keeps range local", async () => {
  let clock = now();
  const p = props({ currentDay: "2026-08-31", now: () => clock });
  render(<GoalAcceptedPlanningSection {...p} />);
  expect(p.query).not.toHaveBeenCalled();
  await open();
  expect(p.query).toHaveBeenLastCalledWith({
    select: { kind: "goal", id: "goal-network" },
    startUserDayDate: "2026-08-01",
    endUserDayDateExclusive: "2026-09-01",
    asOf: clock.toISOString(),
  });
  iteration();
  fact();
  expect(p.query).toHaveBeenCalledTimes(1);
  change("Goal inspection start date", "2026-09-04");
  change("Goal inspection end date", "2026-09-04");
  clock = new Date("2026-09-07T12:00:00.000Z");
  fireEvent.click(screen.getByRole("button", { name: "Apply inspection period" }));
  await waitFor(() => expect(p.query).toHaveBeenCalledTimes(2));
  expect(p.query).toHaveBeenLastCalledWith({
    select: { kind: "goal", id: "goal-network" },
    startUserDayDate: "2026-09-04",
    endUserDayDateExclusive: "2026-09-05",
    asOf: clock.toISOString(),
  });
  fireEvent.click(screen.getByRole("button", { name: "Refresh Goal evidence" }));
  await waitFor(() => expect(p.query).toHaveBeenCalledTimes(3));
});

it.each([
  ["2026-09-05", "2026-09-04"],
  ["2025-01-01", "2026-01-02"],
  ["", "2026-09-04"],
])("rejects invalid/oversized period %s to %s without a query or clamping", async (start, end) => {
  const p = props();
  render(<GoalAcceptedPlanningSection {...p} />);
  await open();
  change("Goal inspection start date", start);
  change("Goal inspection end date", end);
  fireEvent.submit(
    screen.getByRole("button", { name: "Apply inspection period" }).closest("form")!,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("1 to 366 days");
  expect(screen.getByLabelText("Goal inspection start date")).toHaveAttribute("aria-describedby");
  expect(p.query).toHaveBeenCalledTimes(1);
  expect(screen.getByText(/Inspected period:/)).toHaveTextContent("2026-09-01 through 2026-09-30");
});

it("Network+ uses validated A=10h, B=20h, C=1h identities and separate roles, current/frozen names and outcomes", async () => {
  const f = networkSummaryFixture();
  if (f.input.proposals.status !== "available" || f.input.realizations.status !== "available")
    throw Error("fixture");
  expect(validateProposalAuthority(f.input.proposals.value).status).toBe("valid");
  expect(validateRealizationAuthority(f.input.realizations.value).status).toBe("valid");
  const original = JSON.stringify(f);
  const p = props({ query: vi.fn(async () => f.evidence) });
  render(<GoalAcceptedPlanningSection {...p} />);
  await open();
  expect(
    screen.getByRole("heading", { name: "Accepted iteration 1 · 10 h productive in period" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Accepted iteration 2 · 20 h productive in period" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Accepted iteration 3 · 1 h productive in period" }),
  ).toBeInTheDocument();
  expect(screen.getAllByText("Added to the Schedule")).toHaveLength(2);
  expect(screen.getByText("Accepted but not yet added to the Schedule")).toBeInTheDocument();
  expect(screen.getByText(/does not reserve Calendar time/)).toBeInTheDocument();
  expect(screen.getByText(/Readable scheduled-fact evidence/)).toHaveTextContent(
    "30 h productive; 1 h support; 0 h 30 min protected time",
  );
  iteration();
  expect(
    screen.getByRole("heading", { name: "Support activity · 0 h 30 min" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Outcome not recorded")).toBeInTheDocument();
  fact();
  fireEvent.click(screen.getByText(/Publication: /));
  expect(screen.getByText("Frozen title: Network+ Study")).toBeInTheDocument();
  expect(screen.getByText(/Current Goal name: Network\+ renamed/)).toBeInTheDocument();
  expect(screen.getByText(/Reported Actual: 40 minutes/)).toBeInTheDocument();
  expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument();
  expect(JSON.stringify(f)).toBe(original);
});

it.each(["corrected", "withdrawn"] as const)(
  "preserves %s outcomes without Progress inference",
  async (outcome) => {
    render(
      <GoalAcceptedPlanningSection
        {...props({ query: vi.fn(async () => networkSummaryFixture(outcome).evidence) })}
      />,
    );
    await open();
    iteration();
    expect(
      screen.getByText(
        outcome === "corrected"
          ? "Partially completed · corrected report"
          : "Report withdrawn · outcome not recorded",
      ),
    ).toBeInTheDocument();
    fact();
    expect(screen.getByText(/Actual is not measured Progress/)).toBeInTheDocument();
  },
);

it("distinguishes complete-empty, protected acceptance with retained facts, unknown realization and legacy coverage", async () => {
  const f = networkSummaryFixture();
  const empty = buildAcceptedPlanningEvidence({
    ...f.input,
    query: {
      ...f.input.query,
      startUserDayDate: "2026-10-01",
      endUserDayDateExclusive: "2026-10-02",
    },
  });
  if (empty.status !== "projected") throw Error("fixture");
  const p = props({ query: vi.fn(async () => ({ ...empty, currentSourceContext: [] })) });
  const ui = render(<GoalAcceptedPlanningSection {...p} />);
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted planning" }));
  await screen.findByText(/No accepted planning was found in this period/);
  const protectedResult = buildAcceptedPlanningEvidence({
    ...f.input,
    proposals: { status: "protected", reason: "test" },
    realizations: { status: "protected", reason: "test" },
    actual: { status: "protected", reason: "test" },
  });
  if (protectedResult.status !== "projected") throw Error("fixture");
  ui.rerender(
    <GoalAcceptedPlanningSection
      {...p}
      query={async () => ({ ...protectedResult, currentSourceContext: [] })}
    />,
  );
  await screen.findByRole("heading", { name: "Retained scheduled references" });
  expect(screen.queryByText(/No accepted planning was found/)).not.toBeInTheDocument();
  expect(
    screen.getAllByText(/Outcome information cannot currently be read safely/).length,
  ).toBeGreaterThan(0);
  const unknown = buildAcceptedPlanningEvidence({
    ...f.input,
    realizations: { status: "unavailable", reason: "test" },
    actual: { status: "unavailable", reason: "test" },
  });
  if (unknown.status !== "projected") throw Error("fixture");
  ui.rerender(
    <GoalAcceptedPlanningSection
      {...p}
      query={async () => ({ ...unknown, currentSourceContext: [] })}
    />,
  );
  await screen.findAllByText("Scheduling evidence unavailable or unknown");
  expect(screen.queryByText("Accepted but not yet added to the Schedule")).not.toBeInTheDocument();
  iteration();
  expect(screen.getAllByText("Outcome evidence unavailable.").length).toBeGreaterThan(0);
  const legacy = structuredClone(f.evidence);
  legacy.completeness = "partial";
  legacy.unresolvedHistorical = available([
    {
      batchId: "legacy" as never,
      publishedAt: now().toISOString(),
      snapshot: {} as never,
      reason: "legacyLineageUnavailable",
    },
  ]);
  ui.rerender(<GoalAcceptedPlanningSection {...p} query={async () => legacy} />);
  await screen.findByText(/Some older published work lacks/);
});

it("late Goal/range successes and failures cannot replace current evidence; owner and context replacement invalidate results", async () => {
  const a = deferred<AcceptedSummaryResult>(),
    b = deferred<AcceptedSummaryResult>(),
    c = deferred<AcceptedSummaryResult>();
  const query = vi
    .fn()
    .mockReturnValueOnce(a.promise)
    .mockReturnValueOnce(b.promise)
    .mockReturnValueOnce(c.promise);
  const p = props({ query });
  const ui = render(<GoalAcceptedPlanningSection {...p} />);
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted planning" }));
  await waitFor(() => expect(query).toHaveBeenCalledTimes(1));
  ui.rerender(<GoalAcceptedPlanningSection {...p} goalId="goal-B" />);
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted planning" }));
  await waitFor(() => expect(query).toHaveBeenCalledTimes(2));
  await act(async () => {
    b.resolve({ ...networkSummaryFixture().evidence, currentSourceContext: [] });
    await b.promise;
  });
  await screen.findByText(/3 readable accepted iterations/);
  await act(async () => {
    a.reject(Error("late A"));
    await a.promise.catch(() => {});
  });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  change("Goal inspection end date", "2026-09-10");
  fireEvent.click(screen.getByRole("button", { name: "Apply inspection period" }));
  await waitFor(() => expect(query).toHaveBeenCalledTimes(3));
  expect(screen.queryByText(/3 readable accepted iterations/)).not.toBeInTheDocument();
  const replacement = vi.fn(
    async () => ({ status: "error", reason: "evidenceQueryFailed" }) as const,
  );
  ui.rerender(<GoalAcceptedPlanningSection {...p} goalId="goal-B" query={replacement} />);
  await screen.findByText(/could not be loaded/);
  await act(async () => {
    c.resolve(networkSummaryFixture().evidence);
    await c.promise;
  });
  expect(screen.queryByText(/3 readable accepted iterations/)).not.toBeInTheDocument();
  p.context.invalidate();
  ui.rerender(
    <GoalAcceptedPlanningSection {...p} goalId="goal-B" context={createGoalEditingContext()} />,
  );
  expect(screen.queryByText(/could not be loaded/)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Inspect accepted planning" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

it("failed and invalidQuery results have actionable feedback and Refresh", async () => {
  const query = vi
    .fn()
    .mockRejectedValueOnce(Error("offline"))
    .mockResolvedValueOnce({ status: "invalidQuery", reason: "invalidRangeOrAsOf" })
    .mockResolvedValue(networkSummaryFixture().evidence);
  render(<GoalAcceptedPlanningSection {...props({ query })} />);
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted planning" }));
  await screen.findByText(/could not be loaded/);
  fireEvent.click(screen.getByRole("button", { name: "Refresh Goal evidence" }));
  await screen.findByText(/could not be queried/);
  fireEvent.click(screen.getByRole("button", { name: "Refresh Goal evidence" }));
  await screen.findByText(/3 readable accepted iterations/);
});

it("synthetic 60-iteration/360-fact density is bounded; reveal and disclosure persist without querying again", async () => {
  const e = largeSummaryFixture(20);
  if (e.iterations.status !== "available" || e.facts.status !== "available") throw Error("fixture");
  // Synthetic display stress only: reassign a single Goal and attach extra display facts/publications.
  for (const i of e.iterations.value)
    for (const claim of i.accepted.claims) claim.goalId = "goal-network" as never;
  for (const f of e.facts.value) f.lineage.goalId = "goal-network" as never;
  const first = e.iterations.value.find((i) => i.accepted.id === "accepted-A-0")!;
  const base = e.facts.value[0]!;
  e.facts.value = Array.from({ length: 360 }, (_, n) => ({
    ...structuredClone(base),
    fact: { ...base.fact, id: `density-${n}` as never },
    origin: {
      ...base.origin,
      acceptedAllocationId: first.accepted.id,
      acceptedAllocationRevision: 1,
    },
  }));
  if (base.publication.status !== "available") throw Error("publication");
  for (const f of e.facts.value)
    f.publication = available(
      Array.from({ length: 15 }, (_, n) => ({
        ...(base.publication.status === "available" ? base.publication.value[0]! : neverValue()),
        batchId: `publication-${n}` as never,
      })),
    );
  const p = props({ query: vi.fn(async () => e) });
  let ui = render(<GoalAcceptedPlanningSection {...p} />);
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted planning" }));
  await screen.findByText(/60 readable accepted iterations/);
  expect(document.querySelectorAll(".df-accepted-iteration")).toHaveLength(10);
  fireEvent.click(screen.getByRole("button", { name: "Show more accepted iterations" }));
  expect(document.querySelectorAll(".df-accepted-iteration")).toHaveLength(20);
  iteration();
  expect(document.querySelectorAll(".df-accepted-fact")).toHaveLength(10);
  fireEvent.click(screen.getByRole("button", { name: "Show more Goal scheduled facts" }));
  expect(document.querySelectorAll(".df-accepted-fact")).toHaveLength(20);
  fireEvent.click(screen.getAllByRole("button", { name: /Inspect scheduled fact:/ })[0]!);
  expect(screen.getAllByText(/Publication: /)).toHaveLength(10);
  fireEvent.click(screen.getByRole("button", { name: "Show more Goal publications" }));
  expect(screen.getAllByText(/Publication: /)).toHaveLength(15);
  expect(p.query).toHaveBeenCalledTimes(1);
  ui.unmount();
  ui = render(<GoalAcceptedPlanningSection {...p} />);
  await screen.findByText(/60 readable accepted iterations/);
  expect(document.querySelectorAll(".df-accepted-iteration")).toHaveLength(20);
  expect(document.querySelectorAll(".df-accepted-fact")).toHaveLength(20);
  expect(screen.getAllByText(/Publication: /)).toHaveLength(15);
  expect(p.query).toHaveBeenCalledTimes(2);
  ui.unmount();
});
function neverValue(): never {
  throw Error("fixture");
}

it("canonical current User Day sets first month and a 24-Goal list never fans out queries", async () => {
  const store = createDayFrameStore();
  await store.whenReady();
  store.setSchedulingPreferences({ dayBoundaryStartTime: "06:00", weekStartsOn: "monday" });
  for (let i = 0; i < 24; i++) await store.createGoal({ title: `Goal ${i}` });
  const before = JSON.stringify(store.getState());
  const query = vi.spyOn(store, "queryAcceptedPlanningEvidence");
  render(<DayFrameApp store={store} getNow={() => new Date(2026, 8, 1, 5, 59)} />);
  fireEvent.click(screen.getByRole("button", { name: "Goals" }));
  fireEvent.click(await screen.findByRole("button", { name: /^Goal 0/ }));
  fireEvent.click(await screen.findByRole("button", { name: "Inspect accepted planning" }));
  await waitFor(() => expect(query).toHaveBeenCalledTimes(1));
  expect(query.mock.calls[0]![0]).toMatchObject({
    startUserDayDate: "2026-08-01",
    endUserDayDateExclusive: "2026-09-01",
  });
  expect(JSON.stringify(store.getState())).toBe(before);
});

it("explicit navigation range is honored and complete context invalidation cannot replay a late query", async () => {
  const p = props();
  goalInspectionNavigation(p.context, p.goalId).update({
    range: { start: "2026-09-04", end: "2026-09-04" },
  });
  const pending = deferred<AcceptedSummaryResult>();
  p.query = vi.fn(() => pending.promise);
  const ui = render(<GoalAcceptedPlanningSection {...p} />);
  await waitFor(() => expect(p.query).toHaveBeenCalledTimes(1));
  expect(p.query).toHaveBeenCalledWith(
    expect.objectContaining({
      startUserDayDate: "2026-09-04",
      endUserDayDateExclusive: "2026-09-05",
    }),
  );
  p.context.invalidate();
  ui.rerender(<GoalAcceptedPlanningSection {...p} context={createGoalEditingContext()} />);
  await act(async () => {
    pending.resolve(networkSummaryFixture().evidence);
    await pending.promise;
  });
  expect(screen.queryByText(/3 readable accepted iterations/)).not.toBeInTheDocument();
});

it("cross-midnight scheduled evidence navigates with its canonical User Day, never an endpoint date", async () => {
  const p = props();
  render(<GoalAcceptedPlanningSection {...p} />);
  await open();
  iteration(2);
  fact();
  expect(screen.getAllByText(/2026-09-05 10:00:00 UTC/).length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole("button", { name: "Open Daily Planner for 2026-09-04" }));
  expect(p.onDay).toHaveBeenCalledWith("2026-09-04");
});
it("supported source notifications mark snapshots stale, including changes while a query is pending", async () => {
  const pending = deferred<AcceptedSummaryResult>();
  let notify = () => {};
  const p = props({
    query: vi
      .fn()
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValue(networkSummaryFixture().evidence),
  });
  p.store = {
    ...p.store,
    subscribeGoals: (listener) => {
      notify = () => listener([]);
      return () => {};
    },
  };
  render(<GoalAcceptedPlanningSection {...p} />);
  fireEvent.click(screen.getByRole("button", { name: "Inspect accepted planning" }));
  await waitFor(() => expect(p.query).toHaveBeenCalledTimes(1));
  act(() => notify());
  await act(async () => {
    pending.resolve(networkSummaryFixture().evidence);
    await pending.promise;
  });
  await screen.findByText(/Relevant data changed/);
  expect(p.query).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Refresh Goal evidence" }));
  await waitFor(() => expect(screen.queryByText(/Relevant data changed/)).not.toBeInTheDocument());
  expect(p.query).toHaveBeenCalledTimes(2);
});
