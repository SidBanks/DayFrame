/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { GoalActivityQueryResultV1 } from "../../state/historicalIntelligenceQuery.js";
import type { GoalId, GoalV1 } from "../../core/goals/goal.js";
import type { GoalActivityQueryV1 } from "../../core/historicalIntelligence/goalActivity.js";
import type { HistoricalIntelligenceSummaryStore } from "../HistoricalIntelligenceSummary.js";
import { GoalActivitySummary } from "../GoalActivitySummary.js";

afterEach(cleanup);
const goalId = "00000000-0000-4000-8000-000000000010" as GoalId;
const goal = {
  version: 1 as const,
  id: goalId,
  revision: 1,
  title: "Ship portfolio",
  description: "Publish the case studies",
  targetDate: "2026-11-30" as const,
  status: "active" as const,
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
  links: [],
} as GoalV1;
function result(
  options: {
    executionProtected?: boolean;
    legacy?: boolean;
    zero?: boolean;
    frozenTitle?: string;
  } = {},
): GoalActivityQueryResultV1 {
  const zero = options.zero ?? false;
  const linked = zero
    ? []
    : [
        {
          userDayDate: "2026-08-20" as const,
          reference: {
            version: 1 as const,
            sourceKind: "manualEvent" as const,
            manualEvent: {
              id: "work",
              incarnationId: "00000000-0000-4000-8000-000000000011" as const,
            },
          },
          sourceFamily: "manualEvent" as const,
          title: "Portfolio work",
          category: "personal",
          plan: {
            state: "scheduled" as const,
            startsAt: "2026-08-20T14:00:00.000Z",
            endsAt: "2026-08-20T15:00:00.000Z",
          },
          batchId: "batch",
          publishedAt: "2026-08-20T16:00:00.000Z",
          frozenGoal: {
            version: 1 as const,
            goalId,
            title: options.frozenTitle ?? goal.title,
            status: "active" as const,
          },
          ...(options.executionProtected
            ? {}
            : { execution: { classification: "notReported" as const } }),
        },
      ];
  return {
    status: options.legacy ? "partialCoverage" : "available",
    projection: { id: "goalActivity", version: 1 },
    policy: {
      id: "goalActivityPolicy",
      version: 1,
      historicalPolicy: { id: "historicalMetricPolicy", version: 1 },
    },
    query: {
      policy: {
        id: "goalActivityPolicy",
        version: 1,
        historicalPolicy: { id: "historicalMetricPolicy", version: 1 },
      },
      goalId,
      startUserDayDate: "2026-08-16",
      endUserDayDate: "2026-08-22",
      evaluationAsOf: "2026-08-22T17:00:00.000Z",
    },
    goalContext: goal,
    planCoverage: {
      status: "complete",
      expectedDayCount: 7,
      publishedDayCount: 7,
      publishedEmptyDayCount: 0,
      missingDayCount: 0,
      missingUserDayDates: [],
    },
    goalLinkCoverage: {
      status: options.legacy ? "incompleteCoverage" : "complete",
      eligibleOccurrenceCount: options.legacy ? 2 : 1,
      availableOccurrenceCount: 1,
      unavailableLegacyOccurrenceCount: options.legacy ? 1 : 0,
      unavailableUserDayDates: options.legacy ? ["2026-08-19"] : [],
    },
    reportingCoverage: {
      status: options.executionProtected
        ? "unavailable"
        : zero
          ? "notApplicable"
          : "incompleteCoverage",
      eligibleCount: zero ? 0 : 1,
      reportedCount: 0,
      unknownCount: 0,
      notReportedCount: zero ? 0 : 1,
    },
    planningDistribution: {
      status: "available",
      linkedIntendedOccurrenceCount: zero ? 0 : 1,
      scheduled: zero ? 0 : 1,
      unplaced: 0,
      omitted: 0,
      blocked: 0,
    },
    executionDistribution: {
      status: options.executionProtected ? "unavailable" : zero ? "notApplicable" : "available",
      linkedScheduledOccurrenceCount: zero ? 0 : 1,
      completed: 0,
      partial: 0,
      skipped: 0,
      unknown: 0,
      notReported: zero ? 0 : 1,
    },
    advisories: [
      ...(options.legacy ? ["goalLinksUnavailableForSomeHistory" as const] : []),
      ...(options.executionProtected ? ["executionEvidenceUnavailable" as const] : []),
      ...(zero ? ["noLinkedActivity" as const] : []),
    ],
    provenance: {
      linked,
      coverage: options.legacy
        ? [
            {
              userDayDate: "2026-08-19",
              reference: {
                version: 1,
                sourceKind: "manualEvent",
                manualEvent: {
                  id: "legacy",
                  incarnationId: "00000000-0000-4000-8000-000000000012",
                },
              },
              sourceFamily: "manualEvent",
              title: "Legacy work",
              category: "personal",
              plan: { state: "unplaced" },
              batchId: "batch",
              publishedAt: "2026-08-20T16:00:00.000Z",
              reason: "goalProvenanceUnavailableLegacy",
            },
          ]
        : [],
      missingPlanUserDayDates: [],
    },
  } as unknown as GoalActivityQueryResultV1;
}
function store(
  get = vi.fn(async (query: GoalActivityQueryV1) => {
    void query;
    return result();
  }),
  goals: GoalV1[] = [goal],
  ingress:
    | { status: "accepted" }
    | { status: "initializing" }
    | { status: "protected"; reason: "readFailure" | "invalidAuthority" } = { status: "accepted" },
) {
  return {
    getGoalActivity: get,
    listGoals: () => goals,
    getGoalIngressStatus: () => ingress,
    subscribeGoals: () => () => undefined,
    queryGoalProgress: (query: unknown) => ({
      identity: { id: "manualQuantityProgress", version: 1 },
      query,
      status: "notDefined",
      currentGoal: goal,
    }),
    listMeasurementDefinitionHistory: () => [],
    subscribeMeasurementDefinitions: () => () => undefined,
    subscribeProgressObservations: () => () => undefined,
  } as unknown as HistoricalIntelligenceSummaryStore;
}
const props = {
  range: { start: "2026-08-16" as const, end: "2026-08-22" as const },
  evaluationAsOf: "2026-08-22T17:00:00.000Z",
};
describe("GoalActivitySummary", () => {
  it("requires explicit selection and renders grouped current context, coverage, categories, and evidence", async () => {
    const get = vi.fn(async (query: GoalActivityQueryV1) => {
      void query;
      return result({ legacy: true, frozenTitle: "Old portfolio title" });
    });
    render(<GoalActivitySummary {...props} store={store(get)} />);
    expect(screen.getByRole("combobox", { name: "Goal" })).toHaveValue("");
    expect(screen.getByRole("group", { name: "Active" })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "Goal" }), { target: { value: goalId } });
    expect(await screen.findByText("Publish the case studies")).toBeInTheDocument();
    expect(screen.getByText("Target date: 2026-11-30")).toBeInTheDocument();
    expect(screen.getByText(/Some history predates Goal-link tracking/)).toBeInTheDocument();
    expect(screen.getByText("Goal at the time: Old portfolio title")).toBeInTheDocument();
    const category = screen.getByRole("button", { name: "Scheduled: 1" });
    category.focus();
    fireEvent.click(category, { detail: 0 });
    expect(screen.getByText("Scheduled evidence").parentElement).toHaveFocus();
    expect(screen.getByText("Portfolio work")).toBeInTheDocument();
    expect(get.mock.calls[0]?.[0]).toMatchObject({
      evaluationAsOf: props.evaluationAsOf,
      startUserDayDate: props.range.start,
    });
  });
  it("distinguishes known zero and preserves planning when execution is protected", async () => {
    const get = vi.fn(async (query: GoalActivityQueryV1) => {
      void query;
      return result({ zero: true });
    });
    get
      .mockResolvedValueOnce(result({ zero: true }))
      .mockResolvedValueOnce(result({ executionProtected: true }));
    render(<GoalActivitySummary {...props} store={store(get)} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: goalId } });
    expect(
      await screen.findByText("No Goal-linked activity was recorded in this range."),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "" } });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: goalId } });
    expect(await screen.findByText(/reported outcomes cannot be interpreted/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Scheduled: 1" })).toBeInTheDocument();
  });
  it("rejects a stale result after the selected Goal disappears", async () => {
    let resolve!: (value: GoalActivityQueryResultV1) => void;
    const get = vi.fn((query: GoalActivityQueryV1) => {
      void query;
      return new Promise<GoalActivityQueryResultV1>((done) => {
        resolve = done;
      });
    });
    let listener!: (goals: GoalV1[]) => void;
    const value = {
      ...store(get),
      subscribeGoals: (next: (goals: GoalV1[]) => void) => {
        listener = next;
        return () => undefined;
      },
    };
    render(<GoalActivitySummary {...props} store={value} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: goalId } });
    listener([]);
    resolve(result());
    await waitFor(() => expect(screen.queryByText("Portfolio work")).not.toBeInTheDocument());
    expect(screen.getByText(/No Goals yet/)).toBeInTheDocument();
  });
  it("shows initialization, protection, no-Goals, and navigation-only handoff", () => {
    const open = vi.fn();
    const { rerender } = render(
      <GoalActivitySummary
        {...props}
        key="initializing"
        onOpenPlanner={open}
        store={store(vi.fn(), [], { status: "initializing" })}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading Goals");
    rerender(
      <GoalActivitySummary
        {...props}
        key="protected"
        onOpenPlanner={open}
        store={store(vi.fn(), [], { status: "protected", reason: "readFailure" })}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("recovered safely");
    rerender(
      <GoalActivitySummary
        {...props}
        key="empty"
        onOpenPlanner={open}
        store={store(vi.fn(), [])}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open Planner" }));
    expect(open).toHaveBeenCalledOnce();
  });
});
