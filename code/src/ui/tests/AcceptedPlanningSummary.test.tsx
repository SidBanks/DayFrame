/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { useState } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import {
  AcceptedPlanningSummary,
  type AcceptedPlanningSummaryProps,
} from "../AcceptedPlanningSummary.js";
import { initialAcceptedSummaryContext } from "../acceptedPlanningSummaryContext.js";
import { networkSummaryFixture, largeSummaryFixture } from "./acceptedSummaryFixtures.js";
import { buildAcceptedPlanningEvidence } from "../../core/productEvidence/acceptedPlanningEvidence.js";
import { available } from "../../core/productEvidence/evidence.js";
import {
  acceptedGoalGroups,
  acceptedMinutes,
  iterationFacts,
  type AcceptedSummaryResult,
  type AcceptedSummaryEvidence,
} from "../acceptedPlanningSummaryPresentation.js";
const now = () => new Date("2026-09-06T12:00:00.000Z");
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
const defaultQuery = async () => networkSummaryFixture().evidence;
function Harness(props: Partial<AcceptedPlanningSummaryProps> = {}) {
  const [context, setContext] = useState({
    ...initialAcceptedSummaryContext(now()),
    start: "2026-09-04",
    end: "2026-09-04",
  });
  return (
    <AcceptedPlanningSummary
      query={defaultQuery}
      now={now}
      context={context}
      onContextChange={setContext}
      onGoal={() => {}}
      onDay={() => {}}
      onReview={() => {}}
      {...props}
    />
  );
}
async function openGoal() {
  fireEvent.click(await screen.findByRole("button", { name: /^Inspect planning:/ }));
}
it("Network+ 10h, 20h and unrealized 1h remain three exact decisions; display totals never merge them", async () => {
  const { evidence } = networkSummaryFixture();
  const original = JSON.stringify(evidence);
  const query = vi.fn(async () => evidence);
  render(<Harness query={query} />);
  await openGoal();
  expect(
    screen.getByText(/3 distinct accepted iterations · 31 h accepted productive time/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/30 h accepted productive time belongs to the scheduled iterations/),
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Planning iteration 1 · 10 h" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Planning iteration 2 · 20 h" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Planning iteration 3 · 1 h" })).toBeInTheDocument();
  expect(screen.getByText(/Accepted — awaiting scheduling/)).toBeInTheDocument();
  const group = acceptedGoalGroups(evidence)[0]!;
  expect(
    group.iterations.map((i) => [i.accepted.id, acceptedMinutes(evidence, i, group.id)]),
  ).toEqual([
    ["accepted-A", 600],
    ["accepted-B", 1200],
    ["accepted-C", 60],
  ]);
  for (const i of group.iterations)
    expect(
      iterationFacts(evidence, i, group.id).every(
        (f) => f.origin.acceptedAllocationId === i.accepted.id,
      ),
    ).toBe(true);
  expect(query).toHaveBeenCalledTimes(1);
  expect(JSON.stringify(evidence)).toBe(original);
  expect(screen.queryByText(/\d+%/)).toBeNull();
});
it("shows exact published/actual context, frozen title after Goal rename, distinct roles and missing outcomes", async () => {
  const onDay = vi.fn();
  render(<Harness onDay={onDay} />);
  await openGoal();
  fireEvent.click(screen.getByRole("button", { name: "Inspect iteration 1" }));
  expect(screen.getByRole("heading", { name: "Goal work · 10 h" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Preparation · 0 h 30 min" })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Protected time · not an activity · 0 h 15 min" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Completed")).toBeInTheDocument();
  expect(screen.getByText("Outcome not recorded")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Inspect scheduled detail: Goal work/ }));
  expect(screen.getByText("Frozen title: Network+ Study")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Network+ renamed" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "View day" }));
  expect(onDay).toHaveBeenCalledWith("2026-09-04");
  fireEvent.click(screen.getByRole("button", { name: "Return to scheduled work" }));
  expect(screen.getByRole("button", { name: /Inspect scheduled detail: Goal work/ })).toHaveFocus();
  fireEvent.click(screen.getByRole("button", { name: "Inspect iteration 2" }));
  expect(screen.queryByText("Completed")).toBeNull();
  expect(screen.getAllByText("Outcome not recorded")).toHaveLength(2);
});
it.each(["protected", "unavailable"] as const)(
  "%s scheduling never becomes accepted-but-unrealized",
  async (status) => {
    const f = networkSummaryFixture();
    const result = buildAcceptedPlanningEvidence({
      ...f.input,
      realizations: { status, reason: "fixture" },
    });
    if (result.status !== "projected") throw Error();
    render(
      <Harness
        query={async () => ({ ...result, currentSourceContext: f.evidence.currentSourceContext })}
      />,
    );
    await openGoal();
    expect(screen.queryByText(/Accepted — awaiting scheduling/)).toBeNull();
    expect(
      screen.getByText(
        /0 scheduled · 0 awaiting scheduling · 3 with scheduling evidence unavailable/,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("No accepted planning in this period.")).toBeNull();
  },
);
it("complete empty differs from partial and legacy-lineage uncertainty", async () => {
  const f = networkSummaryFixture();
  const empty: AcceptedSummaryEvidence = {
    ...f.evidence,
    iterations: available([]),
    facts: { ...available([]), coverage: "complete" },
    unresolvedHistorical: available([]),
    lookup: "notFoundInRange",
    currentSourceContext: [],
  };
  const v = render(<Harness query={async () => empty} />);
  await screen.findByText("No accepted planning in this period.");
  v.unmount();
  render(
    <Harness
      query={async () => ({
        ...empty,
        completeness: "partial",
        lookup: "unknown",
        sourceCoverage: { ...empty.sourceCoverage, historical: "protected" },
      })}
    />,
  );
  await screen.findByText(/Published schedules: information cannot currently be read safely/);
  expect(screen.queryByText("No accepted planning in this period.")).toBeNull();
});
it("range requests are bounded independent views and late A cannot overwrite B", async () => {
  let a!: (r: AcceptedSummaryResult) => void, b!: (r: AcceptedSummaryResult) => void;
  const query = vi
    .fn()
    .mockImplementationOnce(() => new Promise((r) => (a = r)))
    .mockImplementationOnce(() => new Promise((r) => (b = r)));
  render(<Harness query={query} />);
  expect(screen.getByText("Loading accepted planning…")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Accepted planning end date"), {
    target: { value: "2026-09-05" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Apply planning period" }));
  const newest = networkSummaryFixture().evidence;
  newest.currentSourceContext[0]!.goal = available({
    ...(newest.currentSourceContext[0]!.goal.status === "available"
      ? newest.currentSourceContext[0]!.goal.value
      : ({} as never)),
    title: "New range result",
  });
  await act(async () => b(newest));
  await act(async () => a(networkSummaryFixture().evidence));
  expect(screen.getByRole("heading", { name: "New range result" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Network+ renamed" })).toBeNull();
  expect(query.mock.calls).toEqual([
    [
      {
        startUserDayDate: "2026-09-04",
        endUserDayDateExclusive: "2026-09-05",
        asOf: now().toISOString(),
      },
    ],
    [
      {
        startUserDayDate: "2026-09-04",
        endUserDayDateExclusive: "2026-09-06",
        asOf: now().toISOString(),
      },
    ],
  ]);
});
it("20 Goals / 60 iterations / 360 facts use incremental disclosure without per-row queries", async () => {
  const query = vi.fn(async () => largeSummaryFixture());
  render(<Harness query={query} />);
  await waitFor(() =>
    expect(screen.getAllByRole("button", { name: /^Inspect planning:/ })).toHaveLength(10),
  );
  expect(screen.queryByRole("button", { name: /^Inspect iteration/ })).toBeNull();
  expect(screen.queryByRole("button", { name: /^Inspect scheduled detail/ })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Show more Goals" }));
  expect(screen.getAllByRole("button", { name: /^Inspect planning:/ })).toHaveLength(20);
  fireEvent.click(screen.getAllByRole("button", { name: /^Inspect planning:/ })[0]!);
  expect(screen.getAllByRole("button", { name: /^Inspect iteration/ })).toHaveLength(3);
  fireEvent.click(screen.getByRole("button", { name: "Inspect iteration 1" }));
  expect(screen.getAllByRole("button", { name: /^Inspect scheduled detail/ })).toHaveLength(9);
  expect(query).toHaveBeenCalledTimes(1);
});
it("Goal and scheduling filters preserve acceptance identity and do not fetch or mutate", async () => {
  const query = vi.fn(async () => networkSummaryFixture().evidence),
    onGoal = vi.fn(),
    onReview = vi.fn();
  render(<Harness query={query} onGoal={onGoal} onReview={onReview} />);
  await openGoal();
  fireEvent.click(screen.getByRole("button", { name: "View Goal" }));
  expect(onGoal).toHaveBeenCalledWith("goal-network");
  fireEvent.change(screen.getByLabelText("Scheduling state"), {
    target: { value: "acceptedButUnrealized" },
  });
  await openGoal();
  expect(screen.getByRole("heading", { name: "Planning iteration 3 · 1 h" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Planning iteration 1 · 10 h" })).toBeNull();
  expect(query).toHaveBeenCalledTimes(1);
});
it.each(["error", "invalidQuery"] as const)(
  "%s provides retry instead of empty",
  async (status) => {
    render(
      <Harness
        query={async () =>
          status === "error"
            ? { status, reason: "evidenceQueryFailed" }
            : { status, reason: "invalidRangeOrAsOf" }
        }
      />,
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("could not be loaded");
    expect(screen.queryByText("No accepted planning in this period.")).toBeNull();
  },
);
it("Proposal lifecycle does not revoke accepted decisions or invent currentness", async () => {
  const f = networkSummaryFixture();
  if (f.evidence.iterations.status !== "available") throw Error();
  f.evidence.iterations.value[0]!.currentness.proposalLifecycle = "superseded";
  render(<Harness query={async () => f.evidence} />);
  await openGoal();
  fireEvent.click(screen.getByRole("button", { name: "Inspect iteration 1" }));
  expect(screen.getByText(/Proposal status does not revoke it/)).toBeInTheDocument();
  expect(screen.getByText("superseded")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Planning iteration 1 · 10 h" })).toBeInTheDocument();
});

it("keeps retained facts when accepted authority is protected and does not reconstruct acceptance", async () => {
  const f = networkSummaryFixture();
  const result = buildAcceptedPlanningEvidence({
    ...f.input,
    proposals: { status: "protected", reason: "fixture" },
  });
  if (result.status !== "projected") throw Error();
  render(
    <Harness
      query={async () => ({ ...result, currentSourceContext: f.evidence.currentSourceContext })}
    />,
  );
  await openGoal();
  expect(screen.getByText("Retained scheduled work")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Inspect iteration/ })).toBeNull();
  expect(screen.queryByText("No accepted planning in this period.")).toBeNull();
  expect(screen.getByText(/full accepted decision is unavailable/)).toBeInTheDocument();
});

it("scopes display totals to each Goal and owner range without rewriting multi-Goal acceptance", () => {
  const f = networkSummaryFixture().evidence;
  if (f.iterations.status !== "available") throw Error();
  const a = f.iterations.value[0]!;
  const claim = a.accepted.claims.find((c) => c.role === "productive")!;
  a.accepted.claims.push(
    { ...claim, goalId: "other-goal" as never, durationMinutes: 90 },
    { ...claim, userDayDate: "2026-10-01" as never, durationMinutes: 300 },
  );
  const groups = acceptedGoalGroups(f);
  expect(acceptedMinutes(f, a, "goal-network")).toBe(600);
  expect(acceptedMinutes(f, a, "other-goal")).toBe(90);
  expect(groups.find((g) => g.id === "other-goal")!.iterations[0]).toBe(a);
});

it("ignores new clock callback identities during disclosures", async () => {
  const query = vi.fn(defaultQuery);
  const v = render(<Harness query={query} now={() => now()} />);
  await openGoal();
  v.rerender(<Harness query={query} now={() => now()} />);
  expect(query).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("heading", { name: "Planning iteration 1 · 10 h" })).toBeInTheDocument();
});

it.each(["corrected", "withdrawn"] as const)(
  "shows %s actual without converting duration to Progress",
  async (outcome) => {
    const query = async () => networkSummaryFixture(outcome).evidence;
    render(<Harness query={query} />);
    await openGoal();
    fireEvent.click(screen.getByRole("button", { name: "Inspect iteration 1" }));
    expect(
      screen.getByText(
        outcome === "corrected"
          ? "Partially completed · corrected report"
          : "Report withdrawn · outcome not recorded",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\d+%/)).toBeNull();
  },
);

it("legal older publication without retained lineage remains unknown instead of empty", async () => {
  const f = networkSummaryFixture();
  if (f.input.history.status !== "available" || !f.input.history.value.length) throw Error();
  const publication = structuredClone(f.input.history.value[0]!);
  const source = publication.day.occurrences.find(
    (s) => s.version === 3 && s.scheduleRole === "productiveGoalWork",
  )!;
  if (source.version !== 3) throw Error();
  publication.day.occurrences = [
    {
      version: 1,
      reference: source.reference,
      sourceFamily: source.sourceFamily,
      title: source.title,
      category: source.category,
      plan: source.plan,
    },
  ];
  publication.batch.days = [publication.day];
  const result = buildAcceptedPlanningEvidence({
    ...f.input,
    history: available([publication]),
    proposals: available({
      version: 1,
      proposals: [],
      candidates: [],
      decisions: [],
      acceptedAllocations: [],
    }),
    realizations: available({ version: 1, realizations: [], facts: [] }),
  });
  if (result.status !== "projected") throw Error();
  render(<Harness query={async () => ({ ...result, currentSourceContext: [] })} />);
  expect(
    await screen.findByText(/older published work lacks the retained planning links/),
  ).toBeInTheDocument();
  expect(screen.queryByText("No accepted planning in this period.")).toBeNull();
});

it("rejects a range wider than 366 days without another evidence request", async () => {
  const query = vi.fn(defaultQuery);
  render(<Harness query={query} />);
  await openGoal();
  fireEvent.change(screen.getByLabelText("Accepted planning end date"), {
    target: { value: "2028-09-04" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Apply planning period" }));
  expect(screen.getByRole("alert")).toHaveTextContent("1 to 366 days");
  expect(query).toHaveBeenCalledTimes(1);
});
