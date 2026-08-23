import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactElement } from "react";
import { HISTORICAL_METRIC_POLICY_V1, type CompletionClassificationV1,
  type EligibleOccurrenceProvenanceV1, type HistoricalCompletionDistributionQueryV1 } from
  "../core/historicalIntelligence/completionDistribution.js";
import type { SchedulingRealizationCategoryV1, SchedulingRealizationProvenanceV1 } from
  "../core/historicalIntelligence/schedulingRealization.js";
import type { LocalDateString } from "../core/shifts/types.js";
import type { HistoricalCompletionDistributionQueryResultV1,
  HistoricalSchedulingRealizationQueryResultV1 } from "../state/historicalIntelligenceQuery.js";
import type { DayFrameStore } from "../state/types.js";
import { formatHumanTimeRange } from "./timeDisplay.js";

export type HistoricalIntelligenceSummaryStore = Pick<DayFrameStore,
  "getHistoricalCompletionDistribution" | "getHistoricalSchedulingRealization" |
  "subscribeHistory" | "subscribeExecutionHistory">;
type Completion = Extract<HistoricalCompletionDistributionQueryResultV1, { status: "projected" }>;
type Realization = Extract<HistoricalSchedulingRealizationQueryResultV1, { status: "projected" }>;
type Results = { completion: HistoricalCompletionDistributionQueryResultV1;
  realization: HistoricalSchedulingRealizationQueryResultV1 };
const outcomes: Array<{ value: CompletionClassificationV1; label: string }> = [
  { value: "completed", label: "Completed" }, { value: "partial", label: "Partial" },
  { value: "skipped", label: "Skipped" }, { value: "unknown", label: "Unknown" },
  { value: "notReported", label: "Not reported" },
];
const dispositions: Array<{ value: SchedulingRealizationCategoryV1; label: string }> = [
  { value: "scheduled", label: "Scheduled" }, { value: "unplaced", label: "Unplaced" },
  { value: "omitted", label: "Omitted" }, { value: "blocked", label: "Blocked" },
];
const systemNow = () => new Date();

export function HistoricalIntelligenceSummary({ store, now = systemNow }: {
  store: HistoricalIntelligenceSummaryStore; now?: () => Date;
}): ReactElement {
  const initial = defaultWindow(now());
  const [draftStart, setDraftStart] = useState<LocalDateString>(initial.start);
  const [draftEnd, setDraftEnd] = useState<LocalDateString>(initial.end);
  const [range, setRange] = useState(initial);
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<SchedulingRealizationCategoryV1 | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<CompletionClassificationV1 | null>(null);
  const request = useRef(0);
  const planDetail = useRef<HTMLDivElement>(null); const outcomeDetail = useRef<HTMLDivElement>(null);
  const focusPlan = useRef(false); const focusOutcome = useRef(false);

  useEffect(() => {
    const history = store.subscribeHistory(() => setRevision((value) => value + 1));
    const execution = store.subscribeExecutionHistory(() => setRevision((value) => value + 1));
    return () => { history(); execution(); };
  }, [store]);
  useEffect(() => {
    const id = ++request.current; setLoading(true); setError(false); setResults(null);
    setSelectedPlan(null); setSelectedOutcome(null);
    const query: HistoricalCompletionDistributionQueryV1 = { policy: HISTORICAL_METRIC_POLICY_V1,
      startUserDayDate: range.start, endUserDayDate: range.end, evaluationAsOf: now().toISOString() };
    void Promise.all([store.getHistoricalCompletionDistribution(query),
      store.getHistoricalSchedulingRealization(query)]).then(([completion, realization]) => {
      if (request.current === id) { setResults({ completion, realization }); setLoading(false); }
    }, () => { if (request.current === id) { setError(true); setLoading(false); } });
  }, [now, range, revision, store]);
  useEffect(() => { if (selectedPlan && focusPlan.current) planDetail.current?.focus();
    focusPlan.current = false; }, [selectedPlan]);
  useEffect(() => { if (selectedOutcome && focusOutcome.current) outcomeDetail.current?.focus();
    focusOutcome.current = false; }, [selectedOutcome]);
  function submit(event: FormEvent) { event.preventDefault();
    if (draftStart <= draftEnd) setRange({ start: draftStart, end: draftEnd }); }

  const completion = results?.completion.status === "projected" ? results.completion : null;
  const realization = results?.realization.status === "projected" ? results.realization : null;
  const coverage = realization?.planCoverage ?? completion?.planCoverage;
  return <section aria-labelledby="historical-intelligence-heading" className="df-panel df-history-summary">
    <div className="df-screen-header"><p className="df-workflow-eyebrow">Summary</p>
      <h2 className="df-screen-title" id="historical-intelligence-heading">History</h2>
      <p className="df-screen-subtitle">See how intended work appeared in plan history and what was reported afterward for scheduled work.</p></div>
    <form className="df-history-range" onSubmit={submit}>
      <label className="df-field">Start date<input aria-label="History start date" type="date" value={draftStart}
        onChange={(event) => setDraftStart(event.target.value as LocalDateString)} /></label>
      <label className="df-field">End date<input aria-label="History end date" type="date" value={draftEnd}
        onChange={(event) => setDraftEnd(event.target.value as LocalDateString)} /></label>
      <button className="df-action-button" disabled={draftStart > draftEnd}>Update history</button>
    </form>
    <p className="df-muted">Showing {range.start} through {range.end}. Plan history is evaluated when this view refreshes.</p>
    {loading ? <p aria-live="polite" role="status">Loading history summary…</p> : null}
    {error ? <p className="df-danger-message" role="alert">History could not be loaded. Try refreshing this view.</p> : null}
    {!loading && (results?.completion.status === "invalidQuery" || results?.realization.status === "invalidQuery")
      ? <p className="df-danger-message" role="alert">Choose a valid historical date range.</p> : null}
    {!loading && coverage ? <div className="df-form-stack">
      <Coverage value={coverage} />
      <p className="df-muted">Scheduling realization describes how intended work appeared in the plan. Scheduled outcomes describe what was reported afterward for work that reached the schedule.</p>
      {realization ? <Planning value={realization} selected={selectedPlan} setSelected={setSelectedPlan}
        focus={focusPlan} detail={planDetail} /> : <UnavailableCard planning />}
      {completion ? <Execution value={completion} selected={selectedOutcome} setSelected={setSelectedOutcome}
        focus={focusOutcome} detail={outcomeDetail} /> : <UnavailableCard planning={false} />}
    </div> : null}
    {!loading && !coverage && results?.realization.status === "unavailable"
      ? <Unavailable reason={results.realization.reason} /> : null}
  </section>;
}

function Coverage({ value }: { value: Completion["planCoverage"] }) {
  return <section aria-labelledby="plan-history-coverage-heading" className="df-history-evidence-card">
    <h3 className="df-group-title" id="plan-history-coverage-heading">Plan history</h3>
    {value.status === "complete" ? <p>Plan history is available for all {value.expectedDayCount} requested days.</p> : null}
    {value.status === "incompleteCoverage" ? <p className="df-warning-message">Plan history is available for {value.publishedDayCount} of {value.expectedDayCount} days. Counts below describe known plan history only.</p> : null}
    {value.status === "unavailable" ? <p className="df-empty">DayFrame does not have authoritative plan history for this period yet.</p> : null}
    {value.status !== "unavailable" && value.publishedEmptyDayCount ? <p className="df-muted">{value.publishedEmptyDayCount} covered {plural(value.publishedEmptyDayCount, "day has", "days have")} no planned occurrences.</p> : null}
    {value.missingDayCount ? <details><summary>Missing plan dates ({value.missingDayCount})</summary>
      <ul className="df-plain-list">{value.missingUserDayDates.map((date) => <li key={date}>{date}</li>)}</ul></details> : null}
  </section>;
}

function Planning({ value, selected, setSelected, focus, detail }: { value: Realization;
  selected: SchedulingRealizationCategoryV1 | null;
  setSelected: (value: SchedulingRealizationCategoryV1 | null) => void;
  focus: { current: boolean }; detail: { current: HTMLDivElement | null } }) {
  const evidence = selected ? value.provenance.occurrences.filter((item) => item.planningDisposition === selected) : [];
  return <section aria-labelledby="scheduling-realization-heading" className="df-history-evidence-card">
    <p className="df-workflow-eyebrow">Planning</p><h3 className="df-group-title" id="scheduling-realization-heading">Scheduling realization</h3>
    <p className="df-muted">Shows how intended work was represented in the historical schedule.</p>
    {value.distribution.status === "notApplicable" ? <p className="df-empty">No intended occurrences were recorded for this range.</p> : <>
      <p>{value.distribution.intendedOccurrenceCount} intended {plural(value.distribution.intendedOccurrenceCount, "occurrence", "occurrences")} in known plan history.</p>
      <div aria-label="Scheduling realization counts" className="df-history-distribution" role="group">
        {dispositions.map((item) => <Category key={item.value} label={item.label}
          count={value.distribution[item.value]} expanded={selected === item.value}
          controls="realization-category-details" className={item.value} onActivate={(keyboard) => {
            focus.current = keyboard; setSelected(selected === item.value ? null : item.value); }} />)}
      </div>{selected ? <div aria-live="polite" id="realization-category-details" ref={detail} tabIndex={-1}>
        <h4 className="df-group-title">{dispositionLabel(selected)} planning evidence</h4>
        <p className="df-muted">{dispositionExplanation(selected)}</p>
        {evidence.length ? <ul className="df-history-detail-list">{evidence.map((item) =>
          <PlanOccurrence key={`${item.userDayDate}:${JSON.stringify(item.reference)}`} value={item} />)}</ul>
          : <p className="df-empty">No occurrences in this category.</p>}</div> : null}
    </>}
  </section>;
}

function Execution({ value, selected, setSelected, focus, detail }: { value: Completion;
  selected: CompletionClassificationV1 | null; setSelected: (value: CompletionClassificationV1 | null) => void;
  focus: { current: boolean }; detail: { current: HTMLDivElement | null } }) {
  const evidence = selected ? value.provenance.eligible.filter((item) => item.classification === selected) : [];
  return <><section aria-labelledby="scheduled-outcomes-heading" className="df-history-evidence-card">
    <p className="df-workflow-eyebrow">Execution</p><h3 className="df-group-title" id="scheduled-outcomes-heading">Scheduled outcomes</h3>
    <p className="df-muted">Shows what was reported for intended work that reached the schedule.</p>
    {value.distribution.status === "notApplicable" ? <p className="df-empty">Plan history exists, but there are no scheduled occurrences available for completion analysis in this period.</p> : <>
      <p>{value.distribution.eligibleScheduledCount} scheduled {plural(value.distribution.eligibleScheduledCount, "occurrence", "occurrences")} in known plan history.</p>
      <div aria-label="Completion distribution counts" className="df-history-distribution" role="group">
        {outcomes.map((item) => <Category key={item.value} label={item.label} count={value.distribution[item.value]}
          expanded={selected === item.value} controls="history-category-details" className={item.value}
          onActivate={(keyboard) => { focus.current = keyboard; setSelected(selected === item.value ? null : item.value); }} />)}
      </div><h4 className="df-group-title">Reporting coverage for these dates</h4>
      {value.currentOutcomeCoverage.status === "available" ? <p>{value.currentOutcomeCoverage.classifiedCount} of {value.currentOutcomeCoverage.eligibleCount} scheduled occurrences have a current completed, partial, or skipped report.</p> : null}
      {selected ? <div aria-live="polite" id="history-category-details" ref={detail} tabIndex={-1}>
        <h4 className="df-group-title">{outcomeLabel(selected)} details</h4><p className="df-muted">{outcomeExplanation(selected)}</p>
        {evidence.length ? <ul className="df-history-detail-list">{evidence.map((item) =>
          <OutcomeOccurrence key={`${item.userDayDate}:${JSON.stringify(item.reference)}`} value={item} />)}</ul>
          : <p className="df-empty">No occurrences in this category.</p>}</div> : null}
    </>}</section>
    {value.provenance.excluded.length ? <details className="df-history-evidence-card"><summary>Not included in completion analysis ({value.provenance.excluded.length})</summary>
      <ul className="df-history-detail-list">{value.provenance.excluded.map((item) => <li key={`${item.userDayDate}:${JSON.stringify(item.reference)}`}>
        <strong>{item.title}</strong><span>{item.userDayDate} · {item.category}</span><span>{exclusionCopy(item.reason)}</span></li>)}</ul></details> : null}</>;
}

function Category({ label, count, expanded, controls, className, onActivate }: { label: string; count: number;
  expanded: boolean; controls: string; className: string; onActivate: (keyboard: boolean) => void }) {
  return <button aria-controls={controls} aria-expanded={expanded} aria-label={`${label}: ${count}`}
    className={`df-history-category df-history-category--${className}`}
    onClick={(event: MouseEvent<HTMLButtonElement>) => onActivate(event.detail === 0)} type="button">
    <span>{label}</span><strong>{count}</strong></button>;
}
function PlanOccurrence({ value }: { value: SchedulingRealizationProvenanceV1 }) {
  const time = value.plan.state === "scheduled" ? ` · ${formatHumanTimeRange(new Date(value.plan.startsAt), new Date(value.plan.endsAt))}` : "";
  return <li><strong>{value.title}</strong><span>{value.userDayDate}{time}</span>
    <span>{value.category} · {sourceLabel(value.sourceFamily)} · {dispositionLabel(value.planningDisposition)}</span></li>;
}
function OutcomeOccurrence({ value }: { value: EligibleOccurrenceProvenanceV1 }) {
  const time = value.plan.state === "scheduled" ? ` · ${formatHumanTimeRange(new Date(value.plan.startsAt), new Date(value.plan.endsAt))}` : "";
  return <li><strong>{value.title}</strong><span>{value.userDayDate}{time}</span><span>{value.category} · {sourceLabel(value.sourceFamily)}</span></li>;
}
function UnavailableCard({ planning }: { planning: boolean }) { return <section className="df-history-evidence-card">
  <p className="df-workflow-eyebrow">{planning ? "Planning" : "Execution"}</p>
  <h3 className="df-group-title">{planning ? "Scheduling realization" : "Scheduled outcomes"}</h3>
  <p className="df-danger-message" role="status">{planning ? "Scheduling realization is temporarily unavailable."
    : "Scheduled outcomes are unavailable because execution evidence cannot be safely included."}</p></section>; }
function Unavailable({ reason }: { reason: "historicalPlanProtected" | "historicalPlanUnavailable" }) {
  return <p className="df-danger-message" role="status">{reason === "historicalPlanProtected"
    ? "History summary is protected until stored historical authority can be recovered safely."
    : "History summary is temporarily unavailable because stored plan history could not be read."}</p>;
}
function defaultWindow(value: Date) { const end = localDate(value); const start = new Date(value);
  start.setDate(start.getDate() - 6); return { start: localDate(start), end }; }
function localDate(value: Date) { return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}` as LocalDateString; }
function plural(count: number, one: string, many: string) { return count === 1 ? one : many; }
function outcomeLabel(value: CompletionClassificationV1) { return outcomes.find((item) => item.value === value)!.label; }
function dispositionLabel(value: SchedulingRealizationCategoryV1) { return dispositions.find((item) => item.value === value)!.label; }
function dispositionExplanation(value: SchedulingRealizationCategoryV1) {
  if (value === "scheduled") return "DayFrame stored a time placement for these intended occurrences. This does not describe completion.";
  if (value === "unplaced") return "These intended occurrences remained without a scheduled placement.";
  return `The frozen historical planning disposition was ${value}; no reason is inferred.`;
}
function outcomeExplanation(value: CompletionClassificationV1) {
  if (value === "unknown") return "A previous report existed, but the current observation was withdrawn.";
  if (value === "notReported") return "No current execution report exists for these scheduled occurrences.";
  if (value === "partial") return "These occurrences were reported partial; no fractional completion value is assigned.";
  if (value === "skipped") return "These occurrences were reported skipped; DayFrame does not infer a reason.";
  return "These occurrences currently have a completed report.";
}
function exclusionCopy(reason: "excludedUnplaced" | "excludedOmitted" | "excludedBlocked") {
  return reason === "excludedUnplaced" ? "DayFrame did not have a scheduled placement for this occurrence."
    : reason === "excludedOmitted" ? "This occurrence was omitted from the effective historical plan."
      : "This occurrence was blocked from placement."; }
function sourceLabel(value: "template" | "work" | "manualEvent") {
  return value === "manualEvent" ? "manual event" : value; }
