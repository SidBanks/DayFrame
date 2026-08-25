/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  HISTORICAL_METRIC_POLICY_V1,
  projectHistoricalCompletionDistributionV1,
  type HistoricalCompletionDistributionQueryV1,
} from "../../core/historicalIntelligence/completionDistribution.js";
import { projectHistoricalSchedulingRealizationV1 } from "../../core/historicalIntelligence/schedulingRealization.js";
import type { HistoricalPlanDayPublicationV1 } from "../../core/historicalPlan/historicalPlan.js";
import type { HistoricalCompletionDistributionQueryResultV1 } from "../../state/historicalIntelligenceQuery.js";
import type { HistoricalSchedulingRealizationQueryResultV1 } from "../../state/historicalIntelligenceQuery.js";
import type { HistoricalIntelligenceSummaryStore } from "../HistoricalIntelligenceSummary.js";
import { HistoricalIntelligenceSummary } from "../HistoricalIntelligenceSummary.js";

afterEach(() => cleanup());

function occurrence(
  title: string,
  state: "scheduled" | "unplaced" | "omitted" | "blocked" = "scheduled",
) {
  return {
    reference: {
      version: 1,
      sourceKind: "manualEvent",
      manualEvent: {
        id: title,
        incarnationId: "00000000-0000-4000-8000-000000000001",
      },
    },
    sourceFamily: "manualEvent",
    title,
    category: "personal",
    plan:
      state === "scheduled"
        ? { state, startsAt: "2026-08-20T14:00:00.000Z", endsAt: "2026-08-20T15:00:00.000Z" }
        : { state },
  } as const;
}

function projected(options: { missing?: boolean; empty?: boolean; excluded?: boolean } = {}) {
  const query: HistoricalCompletionDistributionQueryV1 = {
    policy: HISTORICAL_METRIC_POLICY_V1,
    startUserDayDate: "2026-08-16",
    endUserDayDate: "2026-08-22",
    evaluationAsOf: "2026-08-22T17:00:00.000Z",
  };
  const occurrences = options.empty
    ? []
    : [
        occurrence("Reported shift"),
        ...(options.excluded ? [occurrence("Unplaced block", "unplaced")] : []),
      ];
  const day = {
    version: 1,
    userDayDate: "2026-08-20",
    dayBoundaryStartTime: "03:00",
    weekStartsOn: "monday",
    utcOffsetMinutes: -300,
    occurrences,
  } as unknown as HistoricalPlanDayPublicationV1;
  return projectHistoricalCompletionDistributionV1({
    query,
    days: [{ day, batchId: "batch-1", publishedAt: "2026-08-20T16:00:00.000Z" }],
    missingUserDayDates: options.missing ? ["2026-08-21"] : [],
    executionRecords: [],
  });
}

function realized(options: { missing?: boolean; empty?: boolean; excluded?: boolean } = {}) {
  const query: HistoricalCompletionDistributionQueryV1 = {
    policy: HISTORICAL_METRIC_POLICY_V1,
    startUserDayDate: "2026-08-16",
    endUserDayDate: "2026-08-22",
    evaluationAsOf: "2026-08-22T17:00:00.000Z",
  };
  const occurrences = options.empty
    ? []
    : [
        occurrence("Reported shift"),
        ...(options.excluded ? [occurrence("Unplaced block", "unplaced")] : []),
      ];
  const day = {
    version: 1,
    userDayDate: "2026-08-20",
    dayBoundaryStartTime: "03:00",
    weekStartsOn: "monday",
    utcOffsetMinutes: -300,
    occurrences,
  } as unknown as HistoricalPlanDayPublicationV1;
  return projectHistoricalSchedulingRealizationV1({
    query,
    days: [{ day, batchId: "batch-1", publishedAt: "2026-08-20T16:00:00.000Z" }],
    missingUserDayDates: options.missing ? ["2026-08-21"] : [],
  });
}

function fakeStore(
  results: HistoricalCompletionDistributionQueryResultV1[],
  realizationResults: HistoricalSchedulingRealizationQueryResultV1[] = [realized()],
) {
  type HistoryListener = Parameters<HistoricalIntelligenceSummaryStore["subscribeHistory"]>[0];
  type ExecutionListener = Parameters<
    HistoricalIntelligenceSummaryStore["subscribeExecutionHistory"]
  >[0];
  const history = new Set<HistoryListener>();
  const execution = new Set<ExecutionListener>();
  const get = vi.fn(async (query: HistoricalCompletionDistributionQueryV1) => {
    void query;
    return results.shift() ?? projected();
  });
  const getRealization = vi.fn(async (query: HistoricalCompletionDistributionQueryV1) => {
    void query;
    return realizationResults.shift() ?? realized();
  });
  return {
    store: {
      getHistoricalCompletionDistribution: get,
      getHistoricalSchedulingRealization: getRealization,
      getGoalActivity: vi.fn(),
      listGoals: () => [],
      getGoalIngressStatus: () => ({ status: "accepted" as const }),
      subscribeGoals: () => () => undefined,
      queryGoalProgress: vi.fn(),
      listMeasurementDefinitionHistory: () => [],
      subscribeMeasurementDefinitions: () => () => undefined,
      subscribeProgressObservations: () => () => undefined,
      subscribeHistory: (listener: HistoryListener) => {
        history.add(listener);
        return () => history.delete(listener);
      },
      subscribeExecutionHistory: (listener: ExecutionListener) => {
        execution.add(listener);
        return () => execution.delete(listener);
      },
    } as unknown as HistoricalIntelligenceSummaryStore,
    get,
    getRealization,
  };
}

describe("HistoricalIntelligenceSummary", () => {
  it("renders the canonical four-state planning projection beside unchanged execution outcomes", async () => {
    const query: HistoricalCompletionDistributionQueryV1 = {
      policy: HISTORICAL_METRIC_POLICY_V1,
      startUserDayDate: "2026-08-16",
      endUserDayDate: "2026-08-22",
      evaluationAsOf: "2026-08-22T17:00:00.000Z",
    };
    const day = {
      version: 1,
      userDayDate: "2026-08-20",
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "monday",
      utcOffsetMinutes: -300,
      occurrences: [
        occurrence("Placed item"),
        occurrence("Loose item", "unplaced"),
        occurrence("Frozen omission", "omitted"),
        occurrence("Frozen block", "blocked"),
      ],
    } as unknown as HistoricalPlanDayPublicationV1;
    const realization = projectHistoricalSchedulingRealizationV1({
      query,
      days: [{ day, batchId: "batch-all", publishedAt: "2026-08-20T16:00:00.000Z" }],
      missingUserDayDates: [],
    });
    const controlled = fakeStore([projected({ excluded: true })], [realization]);
    const { container } = render(
      <HistoricalIntelligenceSummary
        now={() => new Date("2026-08-22T17:00:00.000Z")}
        store={controlled.store}
      />,
    );
    expect(
      await screen.findByRole("heading", { name: "Scheduling realization" }),
    ).toBeInTheDocument();
    for (const label of ["Scheduled", "Unplaced", "Omitted", "Blocked"]) {
      expect(screen.getByRole("button", { name: `${label}: 1` })).toBeInTheDocument();
    }
    expect(screen.getByText(/4 intended occurrences/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Scheduled outcomes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Not reported: 1" })).toBeInTheDocument();
    expect(screen.getByText(/Reporting coverage for these dates/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Blocked: 1" }), { detail: 0 });
    expect(screen.getByText("Blocked planning evidence").parentElement).toHaveFocus();
    expect(screen.getByText("Frozen block")).toBeInTheDocument();
    expect(screen.getByText(/no reason is inferred/)).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/success rate|capacity|adherence|%/i);
    expect(controlled.get.mock.calls[0]?.[0]).toEqual(controlled.getRealization.mock.calls[0]?.[0]);
  });

  it("uses a deliberate seven-day range and explicit evaluation cutoff", async () => {
    const controlled = fakeStore([projected()]);
    render(
      <HistoricalIntelligenceSummary
        now={() => new Date("2026-08-22T17:00:00.000Z")}
        store={controlled.store}
      />,
    );
    await screen.findByText(/scheduled occurrence in known plan history/);
    expect(screen.getByLabelText("History start date")).toHaveValue("2026-08-16");
    expect(screen.getByLabelText("History end date")).toHaveValue("2026-08-22");
    expect(controlled.get.mock.calls[0]?.[0]).toMatchObject({
      startUserDayDate: "2026-08-16",
      endUserDayDate: "2026-08-22",
      evaluationAsOf: "2026-08-22T17:00:00.000Z",
    });
  });

  it("shows all five categorical counts and drill-down provenance without a score", async () => {
    const controlled = fakeStore([projected({ excluded: true })]);
    const { container } = render(
      <HistoricalIntelligenceSummary
        now={() => new Date("2026-08-22T17:00:00.000Z")}
        store={controlled.store}
      />,
    );
    await screen.findByRole("button", { name: "Not reported: 1" });
    for (const label of ["Completed", "Partial", "Skipped", "Unknown"]) {
      expect(screen.getByRole("button", { name: `${label}: 0` })).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole("button", { name: "Not reported: 1" }));
    expect(screen.getByText("Reported shift")).toBeInTheDocument();
    expect(screen.getByText(/No current execution report exists/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Not included in completion analysis/));
    expect(screen.getByText("Unplaced block")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/score|adherence|recommendation|%/i);
  });

  it("distinguishes incomplete coverage, published-empty history, and zero eligibility", async () => {
    const controlled = fakeStore(
      [projected({ missing: true, empty: true })],
      [realized({ missing: true, empty: true })],
    );
    render(
      <HistoricalIntelligenceSummary
        now={() => new Date("2026-08-22T17:00:00.000Z")}
        store={controlled.store}
      />,
    );
    expect(
      await screen.findByText(/Counts below describe known plan history only/),
    ).toBeInTheDocument();
    expect(screen.getByText(/covered day has no planned occurrences/)).toBeInTheDocument();
    expect(
      screen.getByText(/no scheduled occurrences available for completion analysis/),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Missing plan dates/));
    expect(screen.getByText("2026-08-21")).toBeInTheDocument();
  });

  it.each(["historicalPlanProtected", "executionHistoryQuarantined"] as const)(
    "suppresses counts for %s",
    async (reason) => {
      const controlled = fakeStore(
        [{ status: "unavailable", reason }],
        [reason === "historicalPlanProtected" ? { status: "unavailable", reason } : realized()],
      );
      render(<HistoricalIntelligenceSummary store={controlled.store} />);
      expect(
        await screen.findByText(/protected until|execution evidence cannot be safely included/),
      ).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Completed/ })).not.toBeInTheDocument();
    },
  );

  it("refreshes on both authorities and clears stale projected content while loading", async () => {
    let resolveNext!: (value: HistoricalCompletionDistributionQueryResultV1) => void;
    type HistoryListener = Parameters<HistoricalIntelligenceSummaryStore["subscribeHistory"]>[0];
    type ExecutionListener = Parameters<
      HistoricalIntelligenceSummaryStore["subscribeExecutionHistory"]
    >[0];
    const history = new Set<HistoryListener>();
    const execution = new Set<ExecutionListener>();
    const get = vi
      .fn()
      .mockResolvedValueOnce(projected())
      .mockImplementationOnce(
        () =>
          new Promise<HistoricalCompletionDistributionQueryResultV1>((resolve) => {
            resolveNext = resolve;
          }),
      )
      .mockResolvedValueOnce({ status: "unavailable", reason: "historicalPlanUnavailable" });
    const store = {
      getHistoricalCompletionDistribution: get,
      getHistoricalSchedulingRealization: vi.fn().mockResolvedValue(realized()),
      getGoalActivity: vi.fn(),
      listGoals: () => [],
      getGoalIngressStatus: () => ({ status: "accepted" as const }),
      subscribeGoals: () => () => undefined,
      queryGoalProgress: vi.fn(),
      listMeasurementDefinitionHistory: () => [],
      subscribeMeasurementDefinitions: () => () => undefined,
      subscribeProgressObservations: () => () => undefined,
      subscribeHistory: (listener: HistoryListener) => {
        history.add(listener);
        return () => history.delete(listener);
      },
      subscribeExecutionHistory: (listener: ExecutionListener) => {
        execution.add(listener);
        return () => execution.delete(listener);
      },
    };
    render(
      <HistoricalIntelligenceSummary
        now={() => new Date("2026-08-22T17:00:00.000Z")}
        store={store}
      />,
    );
    await screen.findByRole("button", { name: "Not reported: 1" });
    history.forEach((listener) => listener({} as Parameters<HistoryListener>[0]));
    expect(await screen.findByText("Loading history summary…")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Not reported: 1" })).not.toBeInTheDocument();
    execution.forEach((listener) => listener([]));
    await waitFor(() =>
      expect(screen.getByText(/execution evidence cannot be safely included/)).toBeInTheDocument(),
    );
    resolveNext(projected());
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Not reported: 1" })).not.toBeInTheDocument(),
    );
  });

  it("moves keyboard focus to expanded category evidence without moving pointer focus", async () => {
    const controlled = fakeStore([projected()]);
    render(
      <HistoricalIntelligenceSummary
        now={() => new Date("2026-08-22T17:00:00.000Z")}
        store={controlled.store}
      />,
    );
    const category = await screen.findByRole("button", { name: "Not reported: 1" });

    fireEvent.click(category, { detail: 1 });
    expect(document.activeElement).not.toBe(screen.getByText("Not reported details").parentElement);
    fireEvent.click(category, { detail: 1 });
    category.focus();
    fireEvent.click(category, { detail: 0 });
    expect(screen.getByText("Not reported details").parentElement).toHaveFocus();
  });
});
