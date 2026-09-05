import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import type {
  CorrectExecutionAssertionInput,
  CreateExecutionAssertionInput,
  ExecutionReportedOutcome,
} from "../core/execution/executionRecord.js";
import type { TodayOccurrence, TodayTimedOccurrence } from "../core/today/buildTodayReadModel.js";
import type { DayFrameStore } from "../state/types.js";
import type { TodayQueryResult } from "../state/todayQuery.js";

export type TodayReportingStore = Pick<
  DayFrameStore,
  "recordExecution" | "correctExecutionRecord" | "retractExecutionRecord"
>;

export type TodaySurfaceProps = {
  now: () => Date;
  onOpenPlanner: () => void;
  queryToday: (query: { evaluationAsOf: string }) => Promise<TodayQueryResult>;
  reportingStore: TodayReportingStore;
  subscribeExecutionHistory: (listener: () => void) => () => void;
  subscribeHistoricalPlan: (listener: () => void) => () => void;
};
type ViewState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "settled"; result: TodayQueryResult };

export function TodaySurface(props: TodaySurfaceProps): ReactElement {
  const generation = useRef(0),
    mounted = useRef(true),
    evaluationAsOf = useRef<string | undefined>(undefined),
    refreshButton = useRef<HTMLButtonElement | null>(null),
    restoreRefreshFocus = useRef(false);
  const [view, setView] = useState<ViewState>({ status: "loading" });
  async function runQuery(cutoff: string, focusReference?: string) {
    const request = ++generation.current;
    evaluationAsOf.current = cutoff;
    setView({ status: "loading" });
    try {
      const result = await props.queryToday({ evaluationAsOf: cutoff });
      if (request === generation.current) {
        setView({ status: "settled", result });
        if (focusReference)
          requestAnimationFrame(() => {
            const actions = document.querySelectorAll<HTMLElement>("[data-today-action]");
            [...actions].find((action) => action.dataset.todayAction === focusReference)?.focus();
          });
      }
    } catch {
      if (request === generation.current) setView({ status: "error" });
    }
  }
  useEffect(() => {
    mounted.current = true;
    void runQuery(props.now().toISOString());
    const requery = () => evaluationAsOf.current && void runQuery(evaluationAsOf.current);
    const unsubscribePlan = props.subscribeHistoricalPlan(requery);
    const unsubscribeExecution = props.subscribeExecutionHistory(requery);
    return () => {
      mounted.current = false;
      generation.current += 1;
      unsubscribePlan();
      unsubscribeExecution();
    };
  }, [props.now, props.queryToday, props.subscribeExecutionHistory, props.subscribeHistoricalPlan]);
  useEffect(() => {
    if (view.status === "settled" && restoreRefreshFocus.current) {
      restoreRefreshFocus.current = false;
      refreshButton.current?.focus();
    }
  }, [view]);

  if (view.status === "loading") return <TodayLoading />;
  if (view.status === "error")
    return (
      <TodayMessage role="alert">
        Today could not be loaded. Refresh the page to try again.
      </TodayMessage>
    );
  const result = view.result;
  if (result.status === "invalidQuery")
    return <TodayMessage role="alert">Today could not evaluate the current time.</TodayMessage>;
  if (result.status === "historicalPlanProtected")
    return (
      <TodayMessage role="alert">
        Published plan evidence is protected and unavailable. Resolve HistoricalPlan recovery before
        relying on Today.
      </TodayMessage>
    );
  if (result.status === "planUnavailable")
    return (
      <TodayMessage>
        <p>No published plan is available for this user-day.</p>
        <button className="df-secondary-button" onClick={props.onOpenPlanner} type="button">
          Open Planner
        </button>
      </TodayMessage>
    );
  const hasAttention = Object.values(result.planAttention).some((items) => items.length);
  return (
    <main aria-labelledby="today-heading" className="df-product-surface df-today">
      <section className="df-panel df-today-header">
        <div className="df-screen-header">
          <p className="df-workflow-eyebrow">Current user-day</p>
          <h1 className="df-screen-title" id="today-heading">
            Today
          </h1>
          <p className="df-screen-subtitle">{formatUserDayDate(result.userDay.date)}</p>
          <p className="df-support">{formatInterval(result.userDay.start, result.userDay.end)}</p>
          {result.userDay.durationMinutes !== 1440 ? (
            <p className="df-support">
              This user-day spans {formatDuration(result.userDay.durationMinutes)} because its
              schedule boundary changes.
            </p>
          ) : null}
          <p className="df-support">As of {formatTime(result.evaluationAsOf)}</p>
        </div>
        <button
          aria-label="Refresh Today"
          autoFocus={restoreRefreshFocus.current}
          className="df-secondary-button"
          onClick={() => {
            restoreRefreshFocus.current = true;
            void runQuery(props.now().toISOString());
          }}
          ref={refreshButton}
          type="button"
        >
          Refresh
        </button>
      </section>
      {result.executionCoverage !== "available" ? (
        <section className="df-panel df-today-notice" role="alert">
          <h2>Outcome evidence unavailable</h2>
          <p>
            {result.executionCoverage === "unavailableProtected"
              ? "Execution evidence is protected. The published schedule remains available."
              : "Execution storage is unavailable. The published schedule remains available."}
          </p>
        </section>
      ) : null}
      {result.plan.coverage === "knownEmpty" ? (
        <section className="df-panel">
          <h2>Published plan</h2>
          <p>This published plan contains no occurrences for this user-day.</p>
        </section>
      ) : (
        <div className="df-today-sections">
          <OccurrenceSection
            heading="All day"
            items={result.allDay}
            onWriteAccepted={advanceAfterWrite}
            reportingStore={props.reportingStore}
            userDay={result.userDay}
          />
          {result.timingUnavailableLegacy.length ? (
            <OccurrenceSection
              description="These older published items do not preserve whether they were all-day or timed."
              heading="Timing unavailable"
              items={result.timingUnavailableLegacy}
              onWriteAccepted={advanceAfterWrite}
              reportingStore={props.reportingStore}
              showInterval
              userDay={result.userDay}
            />
          ) : null}
          <OccurrenceSection
            heading="Current"
            items={result.current}
            onWriteAccepted={advanceAfterWrite}
            reportingStore={props.reportingStore}
            showInterval
            userDay={result.userDay}
          />
          <OccurrenceSection
            heading="Next"
            items={result.next}
            onWriteAccepted={advanceAfterWrite}
            reportingStore={props.reportingStore}
            showInterval
            userDay={result.userDay}
          />
          <OccurrenceSection
            heading="Later"
            items={result.later}
            onWriteAccepted={advanceAfterWrite}
            reportingStore={props.reportingStore}
            showInterval
            userDay={result.userDay}
          />
          <OccurrenceSection
            heading="Earlier"
            items={result.elapsed}
            onWriteAccepted={advanceAfterWrite}
            reportingStore={props.reportingStore}
            showInterval
            userDay={result.userDay}
          />
        </div>
      )}
      {hasAttention ? (
        <section aria-labelledby="today-attention-heading" className="df-panel df-today-section">
          <div className="df-screen-header">
            <h2 id="today-attention-heading">Plan attention</h2>
            <p className="df-support">Published dispositions that are outside the timeline.</p>
          </div>
          <ul className="df-list df-today-list">
            {(["unplaced", "omitted", "blocked"] as const).flatMap((disposition) =>
              result.planAttention[disposition].map((occurrence) => (
                <li
                  className="df-today-item"
                  key={`${disposition}-${referenceLabel(occurrence.reference)}`}
                >
                  <strong>{occurrence.title}</strong>
                  <span>{capitalize(disposition)}</span>
                  <span className="df-support">{formatCategory(occurrence.category)}</span>
                </li>
              )),
            )}
          </ul>
          <button className="df-secondary-button" onClick={props.onOpenPlanner} type="button">
            Open Planner
          </button>
        </section>
      ) : null}
    </main>
  );

  function advanceAfterWrite(reference: string) {
    if (mounted.current) void runQuery(props.now().toISOString(), reference);
  }
}

function TodayLoading() {
  return (
    <main aria-labelledby="today-heading" className="df-product-surface">
      <h1 className="df-screen-title" id="today-heading">
        Today
      </h1>
      <section className="df-panel" role="status">
        Loading Today…
      </section>
    </main>
  );
}
function TodayMessage({ children, role }: { children: ReactNode; role?: "alert" }) {
  return (
    <main aria-labelledby="today-heading" className="df-product-surface">
      <section className="df-panel df-screen-header" role={role}>
        <h1 className="df-screen-title" id="today-heading">
          Today
        </h1>
        {children}
      </section>
    </main>
  );
}
function OccurrenceSection({
  description,
  heading,
  items,
  onWriteAccepted,
  reportingStore,
  showInterval = false,
  userDay,
}: {
  description?: string;
  heading: string;
  items: Array<TodayOccurrence | TodayTimedOccurrence>;
  onWriteAccepted: (reference: string) => void;
  reportingStore: TodayReportingStore;
  showInterval?: boolean;
  userDay: Extract<TodayQueryResult, { status: "available" }>["userDay"];
}) {
  if (!items.length) return null;
  const id = `today-${heading.toLowerCase().replace(/\s+/g, "-")}-heading`;
  return (
    <section aria-labelledby={id} className="df-panel df-today-section">
      <div className="df-screen-header">
        <h2 id={id}>{heading}</h2>
        {description ? <p className="df-support">{description}</p> : null}
      </div>
      <ul className="df-list df-today-list">
        {items.map((item) => (
          <li className="df-today-item" key={referenceLabel(item.occurrence.reference)}>
            {showInterval && item.occurrence.plan.state === "scheduled" ? (
              <span className="df-today-time">
                {formatInterval(item.occurrence.plan.startsAt, item.occurrence.plan.endsAt)}
              </span>
            ) : null}
            <strong>{item.occurrence.title}</strong>
            <span className="df-support">{formatCategory(item.occurrence.category)}</span>
            <span className="df-today-outcome">{formatOutcome(item.execution)}</span>
            {item.execution.coverage === "available" ? (
              <TodayOutcomeControl
                item={item}
                onWriteAccepted={onWriteAccepted}
                store={reportingStore}
                userDay={userDay}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function TodayOutcomeControl({
  item,
  onWriteAccepted,
  store,
  userDay,
}: {
  item: TodayOccurrence | TodayTimedOccurrence;
  onWriteAccepted: (reference: string) => void;
  store: TodayReportingStore;
  userDay: Extract<TodayQueryResult, { status: "available" }>["userDay"];
}) {
  const key = referenceLabel(item.occurrence.reference);
  const [expanded, setExpanded] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const actionRef = useRef<HTMLButtonElement | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const execution = item.execution;
  const reported =
    execution.coverage === "available" && execution.status !== "notReported"
      ? execution.record
      : undefined;

  async function report(outcome: ExecutionReportedOutcome) {
    if (pending) return;
    setPending(true);
    setError("");
    await Promise.resolve();
    try {
      const input = reported
        ? ({
            snapshot: structuredClone(reported.snapshot),
            subject: structuredClone(reported.subject),
            outcome,
          } satisfies CorrectExecutionAssertionInput)
        : ({
            subject: { kind: "planned", reference: structuredClone(item.occurrence.reference) },
            snapshot: {
              sourceFamily: item.occurrence.sourceFamily,
              title: item.occurrence.title,
              category: item.occurrence.category,
              userDay: {
                date: userDay.date as never,
                dayBoundaryStartTime: userDay.dayBoundaryStartTime as never,
                utcOffsetMinutes: -new Date(userDay.start).getTimezoneOffset(),
              },
              plan: structuredClone(item.occurrence.plan),
            },
            outcome,
          } satisfies CreateExecutionAssertionInput);
      const result = reported
        ? store.correctExecutionRecord(reported.subjectId, reported.id, input)
        : store.recordExecution(input);
      if (result.status === "accepted") {
        setExpanded(false);
        if (mounted.current) onWriteAccepted(key);
        return;
      }
      setError(writeError(result.reason));
    } catch {
      setError("The outcome could not be saved. Try again.");
    } finally {
      setPending(false);
      if (mounted.current) requestAnimationFrame(() => actionRef.current?.focus());
    }
  }

  async function remove() {
    if (!reported || pending) return;
    setPending(true);
    setError("");
    await Promise.resolve();
    try {
      const result = store.retractExecutionRecord(reported.subjectId, reported.id);
      if (result.status === "accepted") {
        setConfirmRemove(false);
        if (mounted.current) onWriteAccepted(key);
        return;
      }
      setError(writeError(result.reason));
    } catch {
      setError("The report could not be removed. Try again.");
    } finally {
      setPending(false);
      if (mounted.current) requestAnimationFrame(() => actionRef.current?.focus());
    }
  }

  return (
    <div className="df-today-reporting">
      <div className="df-today-report-actions">
        <button
          aria-expanded={expanded}
          className="df-secondary-button"
          data-today-action={key}
          disabled={pending}
          onClick={() => {
            setExpanded(!expanded);
            setConfirmRemove(false);
            setError("");
          }}
          ref={actionRef}
          type="button"
        >
          {reported ? "Change Outcome" : "Record Outcome"}
        </button>
        {reported ? (
          <button
            className="df-secondary-button"
            disabled={pending}
            onClick={() => {
              setConfirmRemove(true);
              setExpanded(false);
              setError("");
            }}
            type="button"
          >
            Remove Report
          </button>
        ) : null}
      </div>
      {expanded ? (
        <div
          aria-label={`Report outcome for ${item.occurrence.title}`}
          className="df-today-outcome-choices"
          role="group"
        >
          {(["completed", "partial", "skipped"] as const).map((outcome) => (
            <button
              className="df-secondary-button"
              disabled={pending}
              key={outcome}
              onClick={() => void report(outcome)}
              type="button"
            >
              {capitalize(outcome)}
            </button>
          ))}
        </div>
      ) : null}
      {confirmRemove ? (
        <div className="df-today-remove-confirmation">
          <p>
            This removes the current reported outcome from Today. Its history remains preserved.
          </p>
          <div className="df-today-report-actions">
            <button
              className="df-danger-button"
              disabled={pending}
              onClick={() => void remove()}
              type="button"
            >
              Remove Report
            </button>
            <button
              className="df-secondary-button"
              disabled={pending}
              onClick={() => {
                setConfirmRemove(false);
                actionRef.current?.focus();
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      {pending ? <p role="status">Saving outcome…</p> : null}
      {error ? (
        <p className="df-danger-message" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function writeError(reason: string) {
  return reason === "notCurrentHead" ||
    reason === "invalidReplacement" ||
    reason === "duplicatePlannedSubject"
    ? "This outcome changed. Refresh Today and try again."
    : reason === "protectedHistoryIngress"
      ? "Outcome reporting is unavailable until execution-history recovery is resolved."
      : "The outcome could not be saved. Try again.";
}
function formatOutcome(execution: TodayOccurrence["execution"]) {
  return execution.coverage !== "available"
    ? "Outcome unavailable"
    : execution.status === "notReported"
      ? "Not reported"
      : `Reported ${execution.status}`;
}
function formatUserDayDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}
function formatInterval(start: string, end: string) {
  const format = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `${format.format(new Date(start))} – ${format.format(new Date(end))}`;
}
function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(
    new Date(value),
  );
}
function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60),
    remainder = minutes % 60;
  return remainder ? `${hours} hours ${remainder} minutes` : `${hours} hours`;
}
function formatCategory(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}
function capitalize(value: string) {
  return value[0]!.toUpperCase() + value.slice(1);
}
function referenceLabel(reference: TodayOccurrence["occurrence"]["reference"]) {
  if (reference.sourceKind === "acceptedAllocation")
    return `${reference.sourceKind}-${reference.realizationId}-${reference.acceptedClaimId}-${reference.scheduledSubjectId}`;
  if (reference.sourceKind === "manualEvent")
    return `${reference.sourceKind}-${reference.manualEvent.id}-${reference.manualEvent.incarnationId}`;
  if (reference.sourceKind === "work")
    return `${reference.sourceKind}-${reference.cycle.id}-${reference.entry.id}-${reference.coordinate.localStartDate}`;
  return `${reference.sourceKind}-${reference.template.id}-${reference.recurrence.id}-${JSON.stringify(reference.coordinate)}`;
}
