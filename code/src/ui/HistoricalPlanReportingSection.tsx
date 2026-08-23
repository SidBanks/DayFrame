import { useEffect, useRef, useState, type ReactElement } from "react";
import type { DayFrameStore } from "../state/types.js";
import { materializeHistoricalPlanExecutionTarget } from "../core/execution/historicalPlanExecutionTarget.js";
import type { HistoricalPlanDayReadResult } from "../state/historicalPlanSurface.js";
import { ExecutionReportControl, type ExecutionReportingStore } from "./ExecutionReportControl.js";
import { formatHumanTimeRange } from "./timeDisplay.js";

export type HistoricalPlanReportingStore = ExecutionReportingStore & Partial<Pick<DayFrameStore,
  "getHistoricalPlanDay" | "getStatus" | "subscribeHistory">>;

const systemNow = () => new Date();

export function HistoricalPlanReportingSection({ initialDate, store, now = systemNow }: {
  initialDate: string; store: HistoricalPlanReportingStore; now?: () => Date;
}): ReactElement {
  const [date, setDate] = useState(initialDate);
  const [result, setResult] = useState<HistoricalPlanDayReadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [authorityRevision, setAuthorityRevision] = useState(0);
  const request = useRef(0);
  const query = store.getHistoricalPlanDay;
  useEffect(() => {
    const current = ++request.current;
    if (!query) { setResult(null); setLoading(false); return; }
    setLoading(true); setResult(null);
    void query(date, now().toISOString()).then((value) => {
      if (request.current === current) { setResult(value); setLoading(false); }
    }, () => {
      if (request.current === current) { setResult({ status: "unavailable",
        error: { code: "readFailed", operation: "queryHistoricalPlanForReporting" } }); setLoading(false); }
    });
  }, [date, query, now, authorityRevision]);
  useEffect(() => {
    const unsubscribe = store.subscribeHistory?.(() => setAuthorityRevision((value) => value + 1));
    return () => { unsubscribe?.(); };
  }, [store]);

  return <section aria-labelledby="historical-plan-reporting-heading" className="df-summary-bar">
    <h2 className="df-panel-title" id="historical-plan-reporting-heading">Report a past planned occurrence</h2>
    <p className="df-muted">Record what happened to something DayFrame previously had in a planned schedule.</p>
    <label className="df-field">Past planned date
      <input aria-label="Past planned date" onChange={(event) => setDate(event.target.value)} type="date" value={date} />
    </label>
    {!query ? <p className="df-muted">Historical plan reporting is unavailable.</p> : null}
    {loading ? <p aria-live="polite">Loading the past planned schedule…</p> : null}
    {!loading && result?.status === "unavailableNoPublication" ?
      <p className="df-empty">No published plan history is available for this day.</p> : null}
    {!loading && result?.status === "available" && result.day.occurrences.length === 0 ?
      <p className="df-empty">No occurrences were published for this day.</p> : null}
    {!loading && (result?.status === "unavailableProtected" || result?.status === "unavailable") ?
      <p className="df-danger-message" role="status">Published plan history is unavailable until its stored authority can be read safely.</p> : null}
    {!loading && result?.status === "available" && result.day.occurrences.length > 0 ?
      <ul className="df-plain-list df-history-list">{result.day.occurrences.map((occurrence) => {
        const materialized = materializeHistoricalPlanExecutionTarget({ day: result.day, occurrence });
        const key = JSON.stringify(occurrence.reference);
        return <li key={key}><div className="df-history-detail">
          <strong>{occurrence.title}</strong><span> · {planLabel(occurrence.plan)}</span>
          {materialized.status === "materialized" ?
            <ExecutionReportControl store={store} target={materialized.target} /> :
            <span className="df-danger-message"> Reporting unavailable.</span>}
        </div></li>;
      })}</ul> : null}
  </section>;
}

function planLabel(plan: import("../core/historicalPlan/historicalPlan.js").HistoricalPlanContext): string {
  if (plan.state === "scheduled") return `Scheduled ${formatHumanTimeRange(new Date(plan.startsAt), new Date(plan.endsAt))}`;
  if (plan.state === "unplaced") return "Not placed in the schedule";
  if (plan.state === "omitted") return "Omitted from the plan";
  return "Accepted placement was blocked";
}
