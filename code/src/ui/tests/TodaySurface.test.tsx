/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  TodayAvailableReadModel,
  TodayOccurrence,
  TodayTimedOccurrence,
} from "../../core/today/buildTodayReadModel.js";
import type { TodayQueryResult } from "../../state/todayQuery.js";
import { TodaySurface, type TodaySurfaceProps } from "../TodaySurface.js";

afterEach(cleanup);
const INC = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as never;
const reference = (id: string) => ({
  version: 1 as const,
  sourceKind: "manualEvent" as const,
  manualEvent: { id, incarnationId: INC },
});
function item(
  id: string,
  execution: TodayOccurrence["execution"] = { coverage: "available", status: "notReported" },
): TodayOccurrence {
  return {
    occurrence: {
      version: 2,
      reference: reference(id),
      sourceFamily: "manualEvent",
      title: id,
      category: "optional",
      plan: {
        state: "scheduled",
        startsAt: "2026-08-24T14:00:00.000Z",
        endsAt: "2026-08-24T15:00:00.000Z",
      },
      timing: { kind: "timed" },
    },
    execution,
  };
}
function timed(
  id: string,
  temporalPosition: TodayTimedOccurrence["temporalPosition"],
  execution?: TodayOccurrence["execution"],
): TodayTimedOccurrence {
  return { ...item(id, execution), temporalPosition };
}
function available(overrides: Partial<TodayAvailableReadModel> = {}): TodayAvailableReadModel {
  return {
    status: "available",
    evaluationAsOf: "2026-08-24T15:30:00.000Z",
    userDay: {
      date: "2026-08-24",
      start: "2026-08-24T08:00:00.000Z",
      end: "2026-08-25T11:00:00.000Z",
      durationMinutes: 1620,
      dayBoundaryStartTime: "03:00",
      nextDayBoundaryStartTime: "06:00",
      weekStartsOn: "monday",
    },
    plan: {
      coverage: "available",
      batchId: "batch",
      publishedAt: "2026-08-24T12:00:00.000Z",
      durability: "durable",
    },
    executionCoverage: "available",
    allDay: [],
    timingUnavailableLegacy: [],
    timed: [],
    current: [],
    next: [],
    later: [],
    elapsed: [],
    planAttention: { unplaced: [], omitted: [], blocked: [] },
    ...overrides,
  };
}
function props(
  result: TodayQueryResult | Promise<TodayQueryResult>,
  overrides: Partial<TodaySurfaceProps> = {},
): TodaySurfaceProps {
  return {
    now: () => new Date("2026-08-24T15:30:00.000Z"),
    onOpenPlanner: vi.fn(),
    queryToday: vi.fn(async () => result),
    reportingStore: {
      recordExecution: vi.fn(() => ({
        status: "rejected" as const,
        reason: "allocationFailure" as const,
      })),
      correctExecutionRecord: vi.fn(() => ({
        status: "rejected" as const,
        reason: "allocationFailure" as const,
      })),
      retractExecutionRecord: vi.fn(() => ({
        status: "rejected" as const,
        reason: "allocationFailure" as const,
      })),
    },
    subscribeExecutionHistory: () => () => undefined,
    subscribeHistoricalPlan: () => () => undefined,
    ...overrides,
  };
}

describe("TodaySurface", () => {
  it("renders variable-day chronology, outcomes, legacy timing, and attention without inference or writes", async () => {
    const allDay = item("All-day plan", {
      coverage: "available",
      status: "completed",
      record: {} as never,
    });
    allDay.occurrence = {
      ...allDay.occurrence,
      version: 2,
      timing: { kind: "allDay" },
    } as never;
    const legacy = item("Legacy plan");
    legacy.occurrence = { ...legacy.occurrence, version: 1 } as never;
    const current = [
      timed("Current A", "current"),
      timed("Current B", "current", {
        coverage: "available",
        status: "partial",
        record: {} as never,
      }),
    ];
    const next = [timed("Next A", "upcoming"), timed("Next B", "upcoming")];
    const later = [
      timed("Later plan", "upcoming", {
        coverage: "available",
        status: "skipped",
        record: {} as never,
      }),
    ];
    const elapsed = [timed("Earlier plan", "elapsed")];
    const unplaced = {
      ...item("Unplaced").occurrence,
      plan: { state: "unplaced" as const },
    } as never;
    const omitted = {
      ...item("Omitted").occurrence,
      plan: { state: "omitted" as const },
    } as never;
    const blocked = {
      ...item("Blocked").occurrence,
      plan: { state: "blocked" as const },
    } as never;
    render(
      <TodaySurface
        {...props(
          available({
            allDay: [allDay],
            timingUnavailableLegacy: [legacy],
            current,
            next,
            later,
            elapsed,
            timed: [...current, ...next, ...later, ...elapsed],
            planAttention: { unplaced: [unplaced], omitted: [omitted], blocked: [blocked] },
          }),
        )}
      />,
    );
    expect(await screen.findByText("All-day plan")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Today" })).toBeInTheDocument();
    for (const heading of [
      "All day",
      "Timing unavailable",
      "Current",
      "Next",
      "Later",
      "Earlier",
      "Plan attention",
    ])
      expect(screen.getByRole("heading", { level: 2, name: heading })).toBeInTheDocument();
    expect(screen.getByText(/spans 27 hours/)).toBeInTheDocument();
    expect(screen.getByText("Reported completed")).toBeInTheDocument();
    expect(screen.getByText("Reported partial")).toBeInTheDocument();
    expect(screen.getByText("Reported skipped")).toBeInTheDocument();
    expect(screen.getAllByText("Not reported").length).toBeGreaterThan(0);
    expect(
      within(
        screen.getByRole("heading", { name: "Plan attention" }).closest("section")!,
      ).getAllByText("Unplaced"),
    ).toHaveLength(2);
    expect(document.body).not.toHaveTextContent(
      /underway|in progress|missed|failed|you're free|nothing to do|recommendation|capacity/i,
    );
    expect(
      screen.queryByRole("button", {
        name: /^(move|reschedule|add event|resolve friction|record goal value|edit commitment)$/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("records an exact occurrence once, advances the cutoff, and restores local focus", async () => {
    const occurrence = timed("Same title", "elapsed");
    const other = timed("Same title", "elapsed");
    other.occurrence.reference = reference("other") as never;
    const record = {
      id: "record-1",
      subjectId: "subject-1",
      subject: { kind: "planned", reference: occurrence.occurrence.reference },
      snapshot: {
        sourceFamily: "manualEvent",
        title: "Same title",
        category: "optional",
        userDay: { date: "2026-08-24", dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
        plan: occurrence.occurrence.plan,
      },
      outcome: "completed",
    } as never;
    const queryToday = vi
      .fn()
      .mockResolvedValueOnce(
        available({ elapsed: [occurrence, other], timed: [occurrence, other] }),
      )
      .mockResolvedValue(
        available({
          evaluationAsOf: "2026-08-24T15:31:00.000Z",
          elapsed: [
            timed("Same title", "elapsed", { coverage: "available", status: "completed", record }),
            other,
          ],
        }),
      );
    const recordExecution = vi.fn(() => ({
      status: "accepted" as const,
      record,
      records: [record],
      persistence: { status: "persisted" as const },
    }));
    const now = vi
      .fn()
      .mockReturnValueOnce(new Date("2026-08-24T15:30:00.000Z"))
      .mockReturnValue(new Date("2026-08-24T15:31:00.000Z"));
    render(
      <TodaySurface
        {...props(available(), {
          now,
          queryToday,
          reportingStore: {
            ...props(available()).reportingStore,
            recordExecution,
          },
        })}
      />,
    );
    const actions = await screen.findAllByRole("button", { name: "Record Outcome" });
    fireEvent.click(actions[0]!);
    const completed = screen.getByRole("button", { name: "Completed" });
    fireEvent.click(completed);
    fireEvent.click(completed);
    await screen.findByText("Reported completed");
    expect(recordExecution).toHaveBeenCalledTimes(1);
    const submitted = (
      recordExecution.mock.calls as unknown as Array<[{ subject: { reference: unknown } }]>
    )[0]![0];
    expect(submitted.subject.reference).toEqual(occurrence.occurrence.reference);
    expect(submitted.subject.reference).not.toEqual(other.occurrence.reference);
    expect(queryToday).toHaveBeenLastCalledWith({
      evaluationAsOf: "2026-08-24T15:31:00.000Z",
    });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Change Outcome" })).toHaveFocus(),
    );
  });

  it.each([
    ["Completed", "completed"],
    ["Partial", "partial"],
    ["Skipped", "skipped"],
  ] as const)("maps the %s first-report choice to governed %s evidence", async (label, outcome) => {
    const recordExecution = vi.fn(() => ({
      status: "rejected" as const,
      reason: "allocationFailure" as const,
    }));
    const occurrence = timed(`${label} item`, "elapsed");
    render(
      <TodaySurface
        {...props(available({ elapsed: [occurrence], timed: [occurrence] }), {
          reportingStore: {
            ...props(available()).reportingStore,
            recordExecution,
          },
        })}
      />,
    );
    fireEvent.click(await screen.findByRole("button", { name: "Record Outcome" }));
    fireEvent.click(screen.getByRole("button", { name: label }));
    await waitFor(() =>
      expect(recordExecution).toHaveBeenCalledWith(expect.objectContaining({ outcome })),
    );
  });

  it("uses append-only correction and confirmed retraction, with conflict retry copy", async () => {
    const existing = timed("Reported item", "current", {
      coverage: "available",
      status: "completed",
      record: {
        id: "record-current",
        subjectId: "subject-current",
        subject: { kind: "planned", reference: reference("frozen-old-source") },
        snapshot: {
          sourceFamily: "manualEvent",
          title: "Frozen title",
          category: "optional",
          userDay: { date: "2026-08-24", dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
          plan: {
            state: "scheduled",
            startsAt: "2026-08-24T14:00:00.000Z",
            endsAt: "2026-08-24T15:00:00.000Z",
          },
        },
        outcome: "completed",
      } as never,
    });
    const correctExecutionRecord = vi.fn(() => ({
      status: "rejected" as const,
      reason: "notCurrentHead" as const,
    }));
    const retractExecutionRecord = vi.fn(() => ({
      status: "rejected" as const,
      reason: "invalidReplacement" as const,
    }));
    render(
      <TodaySurface
        {...props(available({ current: [existing], timed: [existing] }), {
          reportingStore: {
            ...props(available()).reportingStore,
            correctExecutionRecord,
            retractExecutionRecord,
          },
        })}
      />,
    );
    fireEvent.click(await screen.findByRole("button", { name: "Change Outcome" }));
    fireEvent.click(screen.getByRole("button", { name: "Partial" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/outcome changed/i);
    expect(correctExecutionRecord).toHaveBeenCalledWith(
      "subject-current",
      "record-current",
      expect.objectContaining({
        outcome: "partial",
        subject: expect.objectContaining({
          reference: reference("frozen-old-source"),
        }),
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove Report" }));
    expect(screen.getByText(/history remains preserved/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "Remove Report" })[1]!);
    await waitFor(() =>
      expect(retractExecutionRecord).toHaveBeenCalledWith("subject-current", "record-current"),
    );
  });

  it("distinguishes known-empty, missing, plan-protected, and execution-protected states", async () => {
    const { rerender } = render(
      <TodaySurface
        {...props(
          available({
            plan: {
              coverage: "knownEmpty",
              batchId: "batch",
              publishedAt: "2026-08-24T12:00:00.000Z",
              durability: "durable",
            },
          }),
        )}
      />,
    );
    expect(await screen.findByText(/published plan contains no occurrences/)).toBeInTheDocument();
    rerender(
      <TodaySurface
        key="missing"
        {...props({
          status: "planUnavailable",
          reason: "noPublication",
          evaluationAsOf: "2026-08-24T15:30:00.000Z",
          userDayDate: "2026-08-24",
        })}
      />,
    );
    expect(await screen.findByText(/No published plan is available/)).toBeInTheDocument();
    rerender(
      <TodaySurface
        key="protected"
        {...props({
          status: "historicalPlanProtected",
          reason: "physicalMismatch",
          evaluationAsOf: "2026-08-24T15:30:00.000Z",
          userDayDate: "2026-08-24",
        })}
      />,
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Published plan evidence is protected/,
    );
    rerender(
      <TodaySurface
        key="execution"
        {...props(
          available({
            executionCoverage: "unavailableProtected",
            current: [timed("Visible schedule", "current", { coverage: "unavailableProtected" })],
          }),
        )}
      />,
    );
    expect(await screen.findByText("Visible schedule")).toBeInTheDocument();
    expect(screen.getByText("Outcome unavailable", { selector: "span" })).toBeInTheDocument();
    expect(screen.queryByText("Not reported")).not.toBeInTheDocument();
  });

  it("displays a shortened canonical user-day without 24-hour framing", async () => {
    render(
      <TodaySurface
        {...props(
          available({
            userDay: {
              date: "2026-08-24",
              start: "2026-08-24T11:00:00.000Z",
              end: "2026-08-25T08:00:00.000Z",
              durationMinutes: 1260,
              dayBoundaryStartTime: "06:00",
              nextDayBoundaryStartTime: "03:00",
              weekStartsOn: "monday",
            },
          }),
        )}
      />,
    );
    expect(await screen.findByText(/spans 21 hours/)).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/24-hour day/i);
  });

  it("refreshes with a new explicit instant and keeps focus on Refresh", async () => {
    const queryToday = vi.fn(async ({ evaluationAsOf }: { evaluationAsOf: string }) =>
      available({ evaluationAsOf }),
    );
    const now = vi
      .fn()
      .mockReturnValueOnce(new Date("2026-08-24T15:00:00.000Z"))
      .mockReturnValueOnce(new Date("2026-08-24T16:00:00.000Z"));
    render(<TodaySurface {...props(available(), { now, queryToday })} />);
    const refresh = await screen.findByRole("button", { name: "Refresh Today" });
    refresh.focus();
    fireEvent.click(refresh);
    await waitFor(() =>
      expect(queryToday).toHaveBeenLastCalledWith({ evaluationAsOf: "2026-08-24T16:00:00.000Z" }),
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Refresh Today" })).toHaveFocus(),
    );
  });

  it("requeries authority changes at the same cutoff and rejects stale responses", async () => {
    const listeners: Array<() => void> = [];
    const deferred: Array<(value: TodayQueryResult) => void> = [];
    const queryToday = vi.fn((query: { evaluationAsOf: string }) => {
      void query;
      return new Promise<TodayQueryResult>((resolve) => deferred.push(resolve));
    });
    render(
      <TodaySurface
        {...props(available(), {
          queryToday,
          subscribeHistoricalPlan: (listener) => {
            listeners.push(listener);
            return () => undefined;
          },
        })}
      />,
    );
    deferred[0]!(available());
    await screen.findByRole("button", { name: "Refresh Today" });
    listeners[0]!();
    listeners[0]!();
    expect(queryToday.mock.calls.at(-1)?.[0]).toEqual({
      evaluationAsOf: "2026-08-24T15:30:00.000Z",
    });
    deferred[2]!(available({ current: [timed("Newest", "current")] }));
    expect(await screen.findByText("Newest")).toBeInTheDocument();
    deferred[1]!(available({ current: [timed("Stale", "current")] }));
    await waitFor(() => expect(screen.queryByText("Stale")).not.toBeInTheDocument());
  });

  it("ignores a query that resolves after unmount", async () => {
    let resolve!: (value: TodayQueryResult) => void;
    const pending = new Promise<TodayQueryResult>((done) => {
      resolve = done;
    });
    const { unmount } = render(<TodaySurface {...props(pending)} />);
    unmount();
    resolve(available());
    await Promise.resolve();
    expect(screen.queryByText("Current user-day")).not.toBeInTheDocument();
  });
});
