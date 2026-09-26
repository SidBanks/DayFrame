import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { DayFrameStore } from "../state/types.js";
import type { EventTarget } from "../core/monthlyPlanner/queryMonthlyPlanner.js";
import {
  actualInterval,
  currentRows,
  manualRows,
  publishedRows,
  roleLabel,
  rowOutcome,
  timeLabel,
  type DayResult,
  type DayEvidence,
  type DayRow,
} from "./dayWorksurfacePresentation.js";
import type { DayReportingStore } from "./DayOutcomeControl.js";
const loadControl = () => import("./DayOutcomeControl.js");
const DayOutcomeControl =
  import.meta.env.MODE === "test"
    ? (await loadControl()).DayOutcomeControl
    : lazy(() => loadControl().then((m) => ({ default: m.DayOutcomeControl })));
export type DayWorksurfaceProps = {
  ownerDay: string;
  now: () => Date;
  query: DayFrameStore["querySelectedDayEvidence"];
  store: DayReportingStore;
  refreshKey?: unknown;
  onReview: () => void;
  onWork: () => void;
  onGoal: (id: string) => void;
  onEditEvent: (target: EventTarget) => void;
  onAddEvent: () => void;
  onCompatibility?: () => void;
};
export function DayWorksurface(props: DayWorksurfaceProps) {
  const [view, setView] = useState<{ owner: string; result?: DayResult; error?: boolean }>({
    owner: props.ownerDay,
  });
  const [selected, setSelected] = useState<string | null>(null),
    [revision, setRevision] = useState(0);
  const request = useRef(0),
    heading = useRef<HTMLHeadingElement>(null);
  const refresh = () =>
    new Promise<void>((resolve) => {
      setRevision((v) => v + 1);
      resolve();
    });
  useEffect(() => {
    const id = ++request.current;
    setView((previous) =>
      previous.owner === props.ownerDay && previous.result?.status === "projected"
        ? previous
        : { owner: props.ownerDay },
    );
    void props.query({ ownerDay: props.ownerDay, asOf: props.now().toISOString() }).then(
      (result) => {
        if (request.current === id) setView({ owner: props.ownerDay, result });
      },
      () => {
        if (request.current === id) setView({ owner: props.ownerDay, error: true });
      },
    );
    return () => {
      request.current++;
    };
  }, [props.ownerDay, props.query, props.now, props.refreshKey, revision]);
  useEffect(() => {
    setSelected(null);
    heading.current?.focus();
  }, [props.ownerDay]);
  const result = view.owner === props.ownerDay ? view.result : undefined;
  const evidence = result?.status === "projected" ? result : undefined;
  function cards(rows: DayRow[]) {
    return (
      <ul className="df-day-agenda">
        {rows.map((row) => (
          <DayCard
            key={row.key}
            row={row}
            expanded={selected === row.key}
            onToggle={() => setSelected(selected === row.key ? null : row.key)}
            props={props}
            future={evidence?.mode === "future"}
            onSaved={refresh}
          />
        ))}
      </ul>
    );
  }
  return (
    <section className="df-day-workspace" aria-labelledby="day-workspace-heading">
      <header className="df-panel">
        <p className="df-workflow-eyebrow">
          {evidence
            ? evidence.mode === "current"
              ? "Today"
              : evidence.mode === "past"
                ? "Past day"
                : evidence.mode === "future"
                  ? "Future day"
                  : "Selected day"
            : "Selected day"}
        </p>
        <h2 ref={heading} tabIndex={-1} id="day-workspace-heading">
          {formatDate(props.ownerDay)}
        </h2>
        <button type="button" className="df-secondary-button" onClick={() => void refresh()}>
          Refresh day
        </button>
      </header>
      {!result && !view.error && <p role="status">Loading this day…</p>}
      {(view.error || result?.status === "error" || result?.status === "invalidQuery") && (
        <p role="alert">
          This day could not be loaded. Use Refresh day to try again, or go back to Calendar.
        </p>
      )}
      {evidence && (
        <>
          <DayNotices evidence={evidence} onReview={props.onReview} />
          <section className="df-panel">
            <h3>Day agenda</h3>
            {evidence.published.status === "available" && evidence.published.value.length > 0 ? (
              <>
                <p>Published schedule · outcomes shown separately.</p>
                {cards(publishedRows(evidence))}
                {publishedRows(evidence).length === 0 && (
                  <p>The published schedule has no items for this day.</p>
                )}
              </>
            ) : evidence.mode !== "past" ? (
              <>
                <p>
                  {evidence.publicationCoverage === "notPublished"
                    ? "Current schedule · not published."
                    : "Current schedule · publication status unavailable."}
                </p>
                {cards(currentRows(evidence))}
              </>
            ) : (
              <p>No readable published agenda is available for this past day.</p>
            )}
            {isEmpty(evidence) && <p>Nothing scheduled for this DayFrame day.</p>}
          </section>
          <section className="df-panel">
            <h3>Additional / manual activity</h3>
            {cards(manualRows(evidence))}
            <button type="button" className="df-secondary-button" onClick={props.onAddEvent}>
              Add Event
            </button>
          </section>
          {evidence.actual.status === "available" &&
            evidence.actual.value.some(
              (a) => a.subject.kind === "unplannedSleep" || a.subject.kind === "unplanned",
            ) && (
              <section className="df-panel">
                <h3>Unplanned actual activity</h3>
                {cards(
                  evidence.actual.value
                    .filter(
                      (a) => a.subject.kind === "unplannedSleep" || a.subject.kind === "unplanned",
                    )
                    .map((a) => ({
                      key: `actual:${a.subjectId}`,
                      title:
                        a.subject.kind === "unplannedSleep" ? "Unplanned Sleep" : a.snapshot.title,
                      role: a.subject.kind === "unplannedSleep" ? "Sleep" : "Actual activity",
                      owner: a.snapshot.userDay.date,
                      layer: "Reported actual",
                      ...actualInterval(a),
                      actual: a,
                    })),
                )}
              </section>
            )}
          <details className="df-panel">
            <summary>Schedule &amp; outcome details</summary>
            {(evidence.mode === "past" || evidence.publicationCoverage === "published") && (
              <>
                <h3>Current unpublished context</h3>
                <p>
                  This reflects current setup and accepted scheduling. It does not reconstruct the
                  past or replace the published schedule. The two schedules may differ.
                </p>
                {cards(currentRows(evidence))}
              </>
            )}
            <h3>Earlier publications</h3>
            {cards(publishedRows(evidence, false))}
            {evidence.actual.status === "available" && (
              <details>
                <summary>Recorded outcomes for this day ({evidence.actual.value.length})</summary>
                {evidence.actual.value.map((a) => (
                  <p key={a.subjectId}>
                    {a.snapshot.title}:{" "}
                    {rowOutcome({
                      key: a.subjectId,
                      title: a.snapshot.title,
                      role: "Actual",
                      owner: evidence.ownerDay,
                      layer: "Actual",
                      actual: a,
                    })}
                  </p>
                ))}
              </details>
            )}
            {evidence.currentCanonicalContext.status === "available" && (
              <p>
                Current day boundaries:{" "}
                {evidence.currentCanonicalContext.value.selected.start.toLocaleString()} –{" "}
                {evidence.currentCanonicalContext.value.selected.end.toLocaleString()}. Published
                boundaries remain frozen.
              </p>
            )}
            {props.onCompatibility && (
              <button type="button" className="df-secondary-button" onClick={props.onCompatibility}>
                Calendar editing tools
              </button>
            )}
          </details>
        </>
      )}
    </section>
  );
}
function DayCard({
  row,
  expanded,
  onToggle,
  props,
  future,
  onSaved,
}: {
  row: DayRow;
  expanded: boolean;
  onToggle: () => void;
  props: DayWorksurfaceProps;
  future: boolean;
  onSaved: () => Promise<void>;
}) {
  const button = useRef<HTMLButtonElement>(null);
  const actual =
    row.actual ??
    (row.publication?.actual.status === "available" ? row.publication.actual.value[0] : undefined);
  return (
    <li
      className={`df-day-card ${row.role === "bufferProtection" ? "df-day-protection" : row.role === "supportActivity" ? "df-day-support" : ""}`}
    >
      <p className="df-day-time">{timeLabel(row)}</p>
      <h4>{row.title}</h4>
      <p>
        {roleLabel(row.role)}
        {row.goalTitle ? ` · ${row.goalTitle}` : ""}
      </p>
      {row.relatedTo && <p>{row.relatedTo}</p>}
      <p>{rowOutcome(row)}</p>
      <button
        type="button"
        ref={button}
        className="df-secondary-button"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        {expanded ? "Close details" : "Details"}
        <span className="df-visually-hidden">: {row.title}</span>
      </button>
      {expanded && (
        <div className="df-day-detail">
          <p>{row.layer}</p>
          {row.detail && <p>{row.detail}</p>}
          <p>Day: {row.owner}</p>
          {row.fact && (
            <p>
              {row.role === "supportActivity"
                ? "Supports Goal work from the same accepted plan; this is not productive Goal work."
                : row.role === "bufferProtection"
                  ? "Reserved protection from an accepted plan; not an activity."
                  : "Scheduled from an accepted Goal plan."}
            </p>
          )}
          {row.publication?.snapshot.version === 4 && (
            <p>
              Sleep protection: {row.publication.snapshot.sleep.occurrence.bufferBeforeMinutes}{" "}
              minutes before and {row.publication.snapshot.sleep.occurrence.bufferAfterMinutes}{" "}
              after.
            </p>
          )}
          {actual?.currentOutcome.status !== "unknown" &&
            actual?.currentOutcome.record.actualTime && (
              <p>
                Actual:{" "}
                {actual.currentOutcome.record.actualTime.occurredAt
                  ? new Date(actual.currentOutcome.record.actualTime.occurredAt).toLocaleString()
                  : "start not recorded"}
                ; {actual.currentOutcome.record.actualTime.durationMinutes ?? "unknown"} elapsed
                minutes.
              </p>
            )}
          {row.role !== "bufferProtection" &&
            !future &&
            (row.publication?.reporting.status === "targetAvailable" || row.actual) && (
              <Suspense fallback={<p>Loading reporting controls…</p>}>
                <DayOutcomeControl
                  {...(row.publication ? { publication: row.publication } : {})}
                  {...(actual ? { actual } : {})}
                  store={props.store}
                  onSaved={onSaved}
                />
              </Suspense>
            )}
          {future && row.publication && <p>Outcome entry is not offered on future days.</p>}
          {row.goalId && (
            <button
              type="button"
              className="df-secondary-button"
              onClick={() => props.onGoal(row.goalId!)}
            >
              View Goal
            </button>
          )}
          {row.role === "Work" && (
            <button type="button" className="df-secondary-button" onClick={props.onWork}>
              View Work Pattern
            </button>
          )}
          {row.manual?.evidence.target.kind === "event" && (
            <button
              type="button"
              className="df-secondary-button"
              onClick={() => {
                if (row.manual?.evidence.target.kind === "event")
                  props.onEditEvent(row.manual.evidence.target);
              }}
            >
              Edit Manual Event
            </button>
          )}
          <button
            type="button"
            className="df-secondary-button"
            onClick={() => {
              onToggle();
              button.current?.focus();
            }}
          >
            Return to agenda
          </button>
        </div>
      )}
    </li>
  );
}
function DayNotices({ evidence: e, onReview }: { evidence: DayEvidence; onReview: () => void }) {
  const families = [
    ["Published schedule", e.published],
    ["Outcome evidence", e.actual],
    ["Manual activity", e.manual],
    ["Accepted schedule", e.realized],
  ] as const;
  const sleep =
    e.sleepPlanning.status === "available" ? e.sleepPlanning.value.status : e.sleepPlanning.status;
  const sleepMessage: Record<string, string> = {
    protected: "Sleep information cannot currently be read safely.",
    invalid: "Sleep setup needs review.",
    contextIncomplete: "Sleep planning context is incomplete.",
    searchIncomplete: "Sleep planning did not finish; a placement has not been confirmed.",
    infeasible: "Sleep cannot fit the current schedule. Review the schedule.",
    unavailable: "Sleep planning is unavailable.",
    incomplete: "Sleep planning is incomplete.",
  };
  const attention =
    e.planning.status === "available" && e.planning.value.attention.status === "available"
      ? e.planning.value.attention.value
      : null;
  return (
    <div className="df-day-notices">
      {families.map(
        ([label, value]) =>
          value.status !== "available" && (
            <p className="df-panel" role="status" key={label}>
              {label}:{" "}
              {value.status === "protected"
                ? "information cannot currently be read safely."
                : "information is unavailable or incomplete."}
            </p>
          ),
      )}
      {e.publicationCoverage === "notPublished" && (
        <p>No schedule has been published for this day.</p>
      )}
      {e.planning.status !== "available" ? (
        <p>
          Current schedule evidence unavailable
          {e.planning.reason === "noPreview"
            ? " — no generated schedule."
            : e.planning.reason === "outsidePreview"
              ? " — outside the generated range."
              : "."}{" "}
          Other readable activity remains available.
        </p>
      ) : (
        e.planning.value.freshness === "stale" && (
          <p>Current schedule needs review: it was generated before the latest changes.</p>
        )
      )}
      {sleepMessage[sleep] && <p role="status">{sleepMessage[sleep]}</p>}
      {((attention && (attention.friction.length > 0 || attention.unplaced.length > 0)) ||
        sleep === "infeasible" ||
        (e.planning.status === "available" && e.planning.value.freshness === "stale")) && (
        <section className="df-panel">
          <h3>Attention</h3>
          {attention?.friction.map((f) => (
            <p key={f.id}>
              {f.title}: {f.message}
            </p>
          ))}
          {attention?.unplaced.map((u) => (
            <p key={u.id}>{u.title} — not placed.</p>
          ))}
          <button type="button" className="df-secondary-button" onClick={onReview}>
            Review schedule
          </button>
        </section>
      )}
    </div>
  );
}
function isEmpty(e: DayEvidence) {
  return (
    e.published.status === "available" &&
    e.actual.status === "available" &&
    e.manual.status === "available" &&
    e.realized.status === "available" &&
    e.planning.status === "available" &&
    e.sleepPlanning.status === "available" &&
    ["notConfigured", "notApplicable", "satisfied"].includes(e.sleepPlanning.value.status) &&
    !publishedRows(e).length &&
    !currentRows(e).length &&
    !e.manual.value.length &&
    !e.actual.value.length
  );
}
function formatDate(label: string) {
  const [y, m, d] = label.split("-").map(Number);
  return new Date(y!, m! - 1, d!).toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
