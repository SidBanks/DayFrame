import { useEffect, useState, type FormEvent, type ReactElement } from "react";
import type { ExecutionAssertionRecordV1, ExecutionRecordId, ExecutionRecordV1 } from "../core/execution/executionRecord.js";
import type { SurfaceDurabilityStatus } from "../state/types.js";
import type { ExecutionReportingStore } from "./ExecutionReportControl.js";
import { buildExecutionHistoryItems, type ExecutionHistoryItem } from "../core/execution/executionHistoryProjection.js";
import { buildExecutionCorrectionInput, type ExecutionReportDraft } from "./executionReportingWorkflow.js";
import { formatHumanTimeRange } from "./timeDisplay.js";

export function ExecutionHistoryPanel({ store }: { store: ExecutionReportingStore }): ReactElement {
  const [records, setRecords] = useState<ExecutionRecordV1[]>(store.getExecutionHistory());
  const [durability, setDurability] = useState<SurfaceDurabilityStatus>(store.getExecutionHistoryDurabilityStatus());
  const [ingress, setIngress] = useState(store.getExecutionHistoryIngressStatus());
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmingRetraction, setConfirmingRetraction] = useState(false);
  const [openedHeadId, setOpenedHeadId] = useState<ExecutionRecordId | null>(null);
  const [draft, setDraft] = useState<ExecutionReportDraft>(emptyDraft());
  const [message, setMessage] = useState("");
  useEffect(() => {
    const a = store.subscribeExecutionHistory(setRecords);
    const b = store.subscribeExecutionHistoryDurability(setDurability);
    const c = store.subscribeExecutionHistoryIngress(setIngress);
    return () => { a(); b(); c(); };
  }, [store]);
  const items = buildExecutionHistoryItems(records);
  const item = items.find((candidate) => candidate.subjectId === selected);
  const protectedIngress = ingress.status === "recoveryRequired";
  const saveFailed = durability !== "durable" && durability !== "unknown";

  function openEditor(current: ExecutionHistoryItem): void {
    const assertion = current.currentOutcome.status === "unknown" ? undefined : current.currentOutcome.record;
    setDraft(assertion ? draftFrom(assertion) : { ...emptyDraft(), outcome: "completed" });
    setOpenedHeadId(current.currentRecord.id); setEditing(true); setConfirmingRetraction(false); setMessage("");
  }

  function submit(event: FormEvent): void {
    event.preventDefault();
    if (!item || !openedHeadId) return;
    if (item.currentRecord.id !== openedHeadId) {
      setEditing(false); setMessage("This history item changed. Review the current report before correcting it."); return;
    }
    const built = buildExecutionCorrectionInput(item.snapshot, item.subject, draft);
    if (built.status === "invalid") { setMessage(built.message); return; }
    const result = store.correctExecutionRecord(item.subjectId, openedHeadId, {
      snapshot: built.input.snapshot, outcome: built.input.outcome,
      ...(built.input.actualTime ? { actualTime: built.input.actualTime } : {}),
      ...(built.input.note ? { note: built.input.note } : {}),
      ...(item.currentOutcome.status === "unknown" ? { subject: built.input.subject } : {}),
    });
    if (result.status === "rejected") {
      setEditing(false); setMessage(result.reason === "notCurrentHead" ? "This history item changed. Review its current report." : "The correction could not be recorded."); return;
    }
    setEditing(false); setMessage(result.persistence.status === "persisted" ? "History updated." : "History changed for this session, but saving failed.");
  }

  function retract(current: ExecutionHistoryItem): void {
    const result = store.retractExecutionRecord(current.subjectId, current.currentRecord.id);
    setConfirmingRetraction(false);
    setMessage(result.status === "accepted" ? (result.persistence.status === "persisted" ? "Report retracted." : "History changed for this session, but saving failed.") : "The report could not be retracted.");
  }

  return <section aria-labelledby="execution-history-heading" className="df-summary-bar df-execution-history">
    <h2 className="df-panel-title" id="execution-history-heading">Execution history</h2>
    {protectedIngress ? <p className="df-danger-message" role="status">Execution history needs recovery before it can be changed.</p> : null}
    {items.length === 0 ? <p className="df-empty">No outcomes reported yet.</p> : <ul className="df-plain-list df-history-list">
      {items.map((current) => <li key={current.subjectId}>
        <button aria-label={`Review history for ${current.snapshot.title}`} className="df-history-item"
          onClick={() => { setSelected(current.subjectId); setEditing(false); setMessage(""); }} type="button">
          <strong>{current.snapshot.title}</strong><span>{formatDate(current.snapshot.userDay.date)}</span>
          <span aria-label={`Current outcome: ${outcomeLabel(current)}`}>{outcomeLabel(current)}</span>
        </button>
      </li>)}
    </ul>}
    {item ? <div className="df-history-detail">
      <h3>{item.snapshot.title}</h3>
      <section aria-labelledby="history-planned-heading"><h4 id="history-planned-heading">Planned</h4>
        <p>{plannedContext(item)} · {formatDate(item.snapshot.userDay.date)}</p></section>
      <section aria-labelledby="history-reported-heading"><h4 id="history-reported-heading">Reported</h4>
        <p><strong>{outcomeLabel(item)}</strong></p>{currentEvidence(item)}</section>
      {!protectedIngress ? <div>{item.currentOutcome.status === "unknown"
        ? <button className="df-primary-button" onClick={() => openEditor(item)} type="button">Report outcome</button>
        : <><button className="df-primary-button" onClick={() => openEditor(item)} type="button">Correct report</button>{" "}
          <button className="df-secondary-button" onClick={() => setConfirmingRetraction(true)} type="button">Retract report</button></>}
      </div> : null}
      {confirmingRetraction ? <div className="df-confirmation" role="alert"><p>Retract this report? Earlier revisions will remain in history.</p>
        <button className="df-primary-button" onClick={() => retract(item)} type="button">Confirm retraction</button>{" "}
        <button className="df-secondary-button" onClick={() => setConfirmingRetraction(false)} type="button">Cancel</button></div> : null}
      {editing ? <CorrectionForm draft={draft} planned={item.subject.kind === "planned"} setDraft={setDraft} submit={submit} /> : null}
      <details><summary>{item.revisions.length} {item.revisions.length === 1 ? "revision" : "revisions"}</summary>
        <ol>{item.revisions.map((revision, index) => <li key={revision.id}>{revisionLabel(revision, index)} · {formatTimestamp(revision.recordedAt)}
          {revision.kind === "assertion" ? <>{revision.actualTime?.occurredAt ? ` · Reported time ${formatTimestamp(revision.actualTime.occurredAt)}` : ""}
            {revision.actualTime?.durationMinutes ? ` · Reported duration ${revision.actualTime.durationMinutes} minutes` : ""}
            {revision.note ? <p>{revision.note}</p> : null}</> : null}</li>)}</ol>
      </details>
    </div> : null}
    {message ? <p role="status">{message}</p> : null}
    {saveFailed ? <div className="df-danger-message" role="status"><p>History changed for this session, but saving failed.</p>
      {durability !== "serializationFailure" && !protectedIngress ? <button className="df-secondary-button" onClick={() => {
        const result = store.retryExecutionHistoryPersistence(); setMessage(result.status === "attempted" && result.persistence.status === "persisted" ? "Execution history saved." : "Saving still failed.");
      }} type="button">Retry saving</button> : null}</div> : null}
  </section>;
}

function CorrectionForm({ draft, planned, setDraft, submit }: { draft: ExecutionReportDraft; planned: boolean;
  setDraft: (draft: ExecutionReportDraft) => void; submit: (event: FormEvent) => void }): ReactElement {
  const outcomes = planned ? ["completed", "partial", "skipped"] as const : ["completed", "partial"] as const;
  return <form className="df-form-stack" onSubmit={submit}><fieldset className="df-fieldset"><legend>Correct outcome</legend>
    {outcomes.map((outcome) => <label key={outcome}><input checked={draft.outcome === outcome} name="history-correction-outcome"
      onChange={() => setDraft({ ...draft, outcome, ...(outcome === "skipped" ? { occurredAtLocal: "", durationMinutes: "" } : {}) })} type="radio" /> {outcome === "completed" ? "Complete" : outcome === "partial" ? "Partial" : "Skip"}</label>)}</fieldset>
    {draft.outcome !== "skipped" ? <><label className="df-field">Reported date and time (optional)<input onChange={(event) => setDraft({ ...draft, occurredAtLocal: event.target.value })} type="datetime-local" value={draft.occurredAtLocal} /></label>
      <label className="df-field">Reported duration in minutes (optional)<input max="1440" min="1" onChange={(event) => setDraft({ ...draft, durationMinutes: event.target.value })} type="number" value={draft.durationMinutes} /></label></> : null}
    <label className="df-field">Note (optional)<textarea maxLength={2000} onChange={(event) => setDraft({ ...draft, note: event.target.value })} value={draft.note} /></label>
    <button className="df-primary-button" type="submit">Save correction</button></form>;
}

function emptyDraft(): ExecutionReportDraft { return { outcome: "completed", occurredAtLocal: "", durationMinutes: "", note: "" }; }
function draftFrom(record: ExecutionAssertionRecordV1): ExecutionReportDraft { return { outcome: record.outcome,
  occurredAtLocal: record.actualTime?.occurredAt ? toLocalInput(record.actualTime.occurredAt) : "",
  durationMinutes: record.actualTime?.durationMinutes?.toString() ?? "", note: record.note ?? "" }; }
function toLocalInput(iso: string): string { const date = new Date(iso); const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`; }
function outcomeLabel(item: ExecutionHistoryItem): string { const status = item.currentOutcome.status;
  return status === "completed" ? "Completed" : status === "partial" ? "Partial" : status === "skipped" ? "Skipped" : "Not reported"; }
function plannedContext(item: ExecutionHistoryItem): string { const plan = item.snapshot.plan; if (plan.state === "scheduled") return `Scheduled ${formatHumanTimeRange(new Date(plan.startsAt), new Date(plan.endsAt))}`;
  if (plan.state === "unplaced") return "Not placed in the schedule"; if (plan.state === "omitted") return "Omitted from the plan";
  if (plan.state === "blocked") return "Accepted placement was blocked"; return "Unplanned activity"; }
function currentEvidence(item: ExecutionHistoryItem): ReactElement | null { if (item.currentOutcome.status === "unknown") return null;
  const record = item.currentOutcome.record; return <>{record.actualTime?.occurredAt ? <p>Reported time: {formatTimestamp(record.actualTime.occurredAt)}</p> : null}
    {record.actualTime?.durationMinutes ? <p>Reported duration: {record.actualTime.durationMinutes} minutes</p> : null}{record.note ? <p>Note: {record.note}</p> : null}</>; }
function revisionLabel(record: ExecutionRecordV1, index: number): string { if (record.kind === "retraction") return "Retracted report";
  return `${index === 0 ? "Initial report" : "Corrected report"}: ${record.outcome === "completed" ? "Completed" : record.outcome === "partial" ? "Partial" : "Skipped"}`; }
function formatDate(value: string): string { return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
function formatTimestamp(value: string): string { return new Date(value).toLocaleString(); }
