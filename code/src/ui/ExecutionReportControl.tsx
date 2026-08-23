import { useEffect, useState, type FormEvent, type ReactElement } from "react";
import { materializeHistoricalExecutionTarget, type HistoricalExecutionTarget,
  type HistoricalExecutionTargetSelection } from "../core/execution/historicalExecutionTarget.js";
import type { ExecutionAssertionRecordV1, ExecutionRecordV1 } from "../core/execution/executionRecord.js";
import type { DayFrameAuthoredSetup, DayFramePreview, DayFrameStore, SurfaceDurabilityStatus } from "../state/types.js";
import { buildExecutionReportInput, executionTargetsEqual, type ExecutionReportDraft } from "./executionReportingWorkflow.js";
import { formatHumanTimeRange } from "./timeDisplay.js";

export type ExecutionReportingStore = Pick<DayFrameStore, "getExecutionHistory" | "getQuarantinedExecutionHistory" | "getExecutionHistoryDurabilityStatus" |
  "getExecutionHistoryIngressStatus" | "findExecutionSubjectByPlannedReference" | "getExecutionOutcome" |
  "recordExecution" | "correctExecutionRecord" | "retractExecutionRecord" | "retryExecutionHistoryPersistence" |
  "subscribeExecutionHistory" | "subscribeExecutionHistoryDurability" | "subscribeExecutionHistoryIngress">;

type ExecutionReportControlProps = { store: ExecutionReportingStore } & (
  { authoredSetup: DayFrameAuthoredSetup; preview: DayFramePreview; selection: HistoricalExecutionTargetSelection; target?: never } |
  { target: HistoricalExecutionTarget; authoredSetup?: never; preview?: never; selection?: never }
);

export function ExecutionReportControl(props: ExecutionReportControlProps): ReactElement {
  const { store } = props;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ExecutionReportDraft>({ outcome: "completed", occurredAtLocal: "", durationMinutes: "", note: "" });
  const [retainedTarget, setRetainedTarget] = useState<HistoricalExecutionTarget | null>(null);
  const [records, setRecords] = useState<ExecutionRecordV1[]>(store.getExecutionHistory());
  const [durability, setDurability] = useState<SurfaceDurabilityStatus>(store.getExecutionHistoryDurabilityStatus());
  const [ingress, setIngress] = useState(store.getExecutionHistoryIngressStatus());
  const [message, setMessage] = useState("");
  useEffect(() => {
    const a = store.subscribeExecutionHistory(setRecords);
    const b = store.subscribeExecutionHistoryDurability(setDurability);
    const c = store.subscribeExecutionHistoryIngress(setIngress);
    return () => { a(); b(); c(); };
  }, [store]);
  const contextKey = "target" in props ? JSON.stringify(props.target)
    : `${props.preview.generatedAt}:${props.preview.revisedAt ?? ""}:${props.preview.isStale}:${JSON.stringify(props.selection)}`;
  useEffect(() => { setOpen(false); setRetainedTarget(null); setMessage(""); }, [contextKey]);

  const materialized = "target" in props ? { status: "materialized" as const, target: structuredClone(props.target) }
    : materializeHistoricalExecutionTarget({ authoredSetup: props.authoredSetup, preview: props.preview,
        selection: props.selection });
  const target = materialized.status === "materialized" ? materialized.target : null;
  const subjectId = target ? store.findExecutionSubjectByPlannedReference(target.reference) : undefined;
  const outcome = subjectId ? store.getExecutionOutcome(subjectId) : { status: "unknown" as const };
  const current = outcome.status === "completed" || outcome.status === "partial" || outcome.status === "skipped"
    ? outcome.record : undefined;
  const currentHead = subjectId ? [...records].reverse().find((record) => record.subjectId === subjectId) : undefined;
  const saveFailed = durability !== "durable" && durability !== "unknown";

  function submit(event: FormEvent): void {
    event.preventDefault();
    if (!retainedTarget || !target || !executionTargetsEqual(retainedTarget, target)) {
      setMessage("The planned context changed. Review it before reporting."); setOpen(false); setRetainedTarget(null); return;
    }
    const built = buildExecutionReportInput(target, draft);
    if (built.status === "invalid") { setMessage(built.message); return; }
    const existing = store.findExecutionSubjectByPlannedReference(target.reference);
    const existingOutcome = existing ? store.getExecutionOutcome(existing) : { status: "unknown" as const };
    const historicalAssertion = existing ? [...records].reverse().find((record): record is ExecutionAssertionRecordV1 =>
      record.subjectId === existing && record.kind === "assertion") : undefined;
    const result = existing && existingOutcome.status === "unknown" && currentHead
      ? store.correctExecutionRecord(existing, currentHead.id, { snapshot: historicalAssertion?.snapshot ?? built.input.snapshot,
          subject: historicalAssertion?.subject ?? built.input.subject, outcome: built.input.outcome,
          ...(built.input.actualTime ? { actualTime: built.input.actualTime } : {}), ...(built.input.note ? { note: built.input.note } : {}) })
      : store.recordExecution(built.input);
    if (result.status === "rejected") { setMessage(result.reason === "duplicatePlannedSubject" ? "This occurrence already has a report." : "The report could not be recorded."); return; }
    setOpen(false); setRetainedTarget(null); setMessage(result.persistence.status === "persisted" ? "Report recorded." : "Recorded for this session; saving failed.");
  }

  function undo(): void {
    if (!subjectId || !current) return;
    const result = store.retractExecutionRecord(subjectId, current.id);
    setMessage(result.status === "accepted" ? (result.persistence.status === "persisted" ? "Report undone." : "Undone for this session; saving failed.") : "The report could not be undone.");
  }

  if (!target) return <span className="df-muted"> Reporting unavailable.</span>;
  if (ingress.status === "recoveryRequired") return <span className="df-danger-message"> Reporting is unavailable until execution-history recovery is resolved.</span>;
  return <div className="df-execution-report">
    {current ? <div role="status"><strong>{label(current)}</strong> · {context(current)}
      <button className="df-secondary-button" onClick={undo} type="button">Undo report</button></div> :
      <button className="df-secondary-button" onClick={() => { setOpen(true); setRetainedTarget(structuredClone(target)); setMessage(""); }} type="button">Report outcome</button>}
    {open ? <form className="df-form-stack" onSubmit={submit}>
      <p><strong>{target.snapshot.title}</strong> · {snapshotContext(target)}</p>
      <fieldset className="df-fieldset"><legend>Outcome</legend>{(["completed", "partial", "skipped"] as const).map((value) =>
        <label key={value}><input checked={draft.outcome === value} name={`outcome-${contextKey}`} onChange={() => setDraft({ ...draft, outcome: value, ...(value === "skipped" ? { occurredAtLocal: "", durationMinutes: "" } : {}) })} type="radio" /> {value === "completed" ? "Complete" : value === "partial" ? "Partial" : "Skip"}</label>)}</fieldset>
      {draft.outcome !== "skipped" ? <><label className="df-field">Actual date and time (optional)<input onChange={(event) => setDraft({ ...draft, occurredAtLocal: event.target.value })} type="datetime-local" value={draft.occurredAtLocal} /></label>
        <label className="df-field">Duration in minutes (optional)<input max="1440" min="1" onChange={(event) => setDraft({ ...draft, durationMinutes: event.target.value })} type="number" value={draft.durationMinutes} /></label></> : null}
      <label className="df-field">Note (optional)<textarea maxLength={2000} onChange={(event) => setDraft({ ...draft, note: event.target.value })} value={draft.note} /></label>
      <div><button className="df-primary-button" type="submit">Submit report</button> <button className="df-secondary-button" onClick={() => setOpen(false)} type="button">Cancel</button></div>
    </form> : null}
    {message ? <p role="status">{message}</p> : null}
    {saveFailed ? <div className="df-danger-message" role="status"><p>Execution history saving failed; the session outcome is still active.</p>{durability !== "serializationFailure" ? <button className="df-secondary-button" onClick={() => { const result = store.retryExecutionHistoryPersistence(); setMessage(result.status === "attempted" && result.persistence.status === "persisted" ? "Execution history saved." : "Saving still failed."); }} type="button">Retry saving</button> : null}</div> : null}
  </div>;
}

function label(record: ExecutionAssertionRecordV1): string { return record.outcome === "completed" ? "Completed" : record.outcome === "partial" ? "Partially completed" : "Skipped"; }
function context(record: ExecutionAssertionRecordV1): string { return `${record.snapshot.title}, ${record.snapshot.userDay.date}, ${record.snapshot.plan.state}`; }
function snapshotContext(target: HistoricalExecutionTarget): string { const plan = target.snapshot.plan; return plan.state === "scheduled" ? `${target.snapshot.userDay.date}, ${formatHumanTimeRange(new Date(plan.startsAt), new Date(plan.endsAt))}` : `${target.snapshot.userDay.date}, ${plan.state}`; }
