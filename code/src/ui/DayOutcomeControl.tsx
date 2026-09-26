import { useRef, useState } from "react";
import type { DayFrameStore } from "../state/types.js";
import type { ExecutionHistoryItem } from "../core/execution/executionHistoryProjection.js";
import type { ExecutionReportedOutcome } from "../core/execution/executionRecord.js";
import type { HistoricalExecutionTarget } from "../core/execution/historicalExecutionTarget.js";
import type { PublishedItem } from "./dayWorksurfacePresentation.js";
import {
  buildExecutionReportInput,
  buildExecutionCorrectionInput,
} from "./executionReportingWorkflow.js";
export type DayReportingStore = Pick<
  DayFrameStore,
  "recordExecution" | "correctExecutionRecord" | "retractExecutionRecord" | "recordSleepExecution"
>;
export function DayOutcomeControl({
  publication,
  actual,
  store,
  onSaved,
}: {
  publication?: PublishedItem;
  actual?: ExecutionHistoryItem;
  store: DayReportingStore;
  onSaved: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [confirm, setConfirm] = useState(false);
  const [outcome, setOutcome] = useState<ExecutionReportedOutcome>("completed"),
    [start, setStart] = useState(""),
    [minutes, setMinutes] = useState(""),
    [offset, setOffset] = useState(""),
    [note, setNote] = useState("");
  const trigger = useRef<HTMLButtonElement>(null),
    lock = useRef(false);
  const report = publication?.reporting;
  const sleep =
    publication?.snapshot.version === 4 ||
    actual?.subject.kind === "publishedSleep" ||
    actual?.subject.kind === "unplannedSleep";
  const existing =
    actual ??
    (publication?.actual.status === "available" ? publication.actual.value[0] : undefined);
  if (publication && report?.status !== "targetAvailable")
    return <p>Reporting is unavailable for this item.</p>;
  function close() {
    setOpen(false);
    setConfirm(false);
    trigger.current?.focus();
  }
  async function save(retract = false) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setMessage("");
    try {
      let result;
      if (sleep) {
        const actualTime =
          outcome === "skipped" || retract
            ? undefined
            : {
                occurredAt: new Date(start + offset).toISOString(),
                durationMinutes: Number(minutes),
              };
        if (retract && existing)
          result = await store.recordSleepExecution({
            kind: "retract",
            subjectId: existing.subjectId,
            currentRecordId: existing.currentRecord.id,
          });
        else if (existing)
          result = await store.recordSleepExecution({
            kind: "correct",
            subjectId: existing.subjectId,
            currentRecordId: existing.currentRecord.id,
            outcome,
            ...(actualTime ? { actualTime } : {}),
            ...(note ? { note } : {}),
          });
        else if (
          report?.status === "targetAvailable" &&
          "subject" in report.target &&
          report.target.subject.kind === "publishedSleep"
        )
          result = await store.recordSleepExecution({
            kind: "reportPublished",
            publicationBatchId: report.target.subject.publicationBatchId,
            snapshotId: report.target.subject.snapshotId,
            outcome,
            ...(actualTime ? { actualTime } : {}),
            ...(note ? { note } : {}),
          });
      } else if (retract && existing)
        result = store.retractExecutionRecord(existing.subjectId, existing.currentRecord.id);
      else {
        const draft = { outcome, occurredAtLocal: start, durationMinutes: minutes, note };
        const built = existing
          ? buildExecutionCorrectionInput(existing.snapshot, existing.subject, draft)
          : report?.status === "targetAvailable" && "reference" in report.target
            ? buildExecutionReportInput(report.target as HistoricalExecutionTarget, draft)
            : null;
        if (!built || built.status === "invalid") {
          setMessage(built?.message ?? "Reporting is unavailable.");
          return;
        }
        result = existing
          ? store.correctExecutionRecord(existing.subjectId, existing.currentRecord.id, built.input)
          : store.recordExecution(built.input);
      }
      if (result?.status !== "accepted") {
        setMessage(
          "The report could not be saved. The item may have changed. Refresh and review it before trying again.",
        );
        return;
      }
      setMessage(
        result.persistence.status === "persisted"
          ? "Report saved."
          : result.persistence.status === "pending"
            ? "Report accepted for this session. Saving continues in the background."
            : "Report accepted for this session; saving failed.",
      );
      close();
      await onSaved();
    } catch {
      setMessage(
        "The report could not be saved. Check the actual time and elapsed minutes, then try again.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="df-day-report">
      <button
        type="button"
        className="df-secondary-button"
        ref={trigger}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {existing ? "Correct or withdraw report" : sleep ? "Report actual Sleep" : "Report outcome"}
      </button>
      {open && (
        <form
          className="df-form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <p>This changes the recorded outcome. The published schedule stays unchanged.</p>
          <label className="df-field">
            Outcome
            <select
              value={outcome}
              disabled={busy}
              onChange={(e) => {
                const v = e.target.value as ExecutionReportedOutcome;
                setOutcome(v);
                if (v === "skipped") {
                  setStart("");
                  setMinutes("");
                }
              }}
            >
              <option value="completed">Completed</option>
              <option value="partial">Partially completed</option>
              {actual?.subject.kind !== "unplannedSleep" &&
                actual?.subject.kind !== "unplanned" && (
                  <option value="skipped">Didn't do it</option>
                )}
            </select>
          </label>
          {outcome !== "skipped" && (
            <>
              <label className="df-field">
                Actual start{sleep ? "" : " (optional)"}
                <input
                  type="datetime-local"
                  required={sleep}
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </label>
              {sleep && (
                <label className="df-field">
                  UTC offset at actual start (optional)
                  <input
                    placeholder="-06:00"
                    value={offset}
                    onChange={(e) => setOffset(e.target.value)}
                  />
                </label>
              )}
              <label className="df-field">
                Elapsed minutes{sleep ? "" : " (optional)"}
                <input
                  type="number"
                  inputMode="numeric"
                  required={sleep}
                  min="1"
                  max="1440"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
              </label>
            </>
          )}
          <label className="df-field">
            Note (optional)
            <textarea maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
          <button className="df-primary-button" type="submit" disabled={busy}>
            Save outcome
          </button>
          <button type="button" className="df-secondary-button" disabled={busy} onClick={close}>
            Cancel
          </button>
          {existing && existing.currentRecord.kind !== "retraction" && (
            <button
              type="button"
              className="df-secondary-button"
              disabled={busy}
              onClick={() => setConfirm(true)}
            >
              Withdraw report
            </button>
          )}
          {confirm && (
            <div role="group" aria-label="Confirm withdrawal">
              <p>
                Withdraw this report? The current outcome will become unknown. This does not mean
                you didn't do it.
              </p>
              <button type="button" disabled={busy} onClick={() => void save(true)}>
                Confirm withdrawal
              </button>
              <button type="button" onClick={() => setConfirm(false)}>
                Keep report
              </button>
            </div>
          )}
        </form>
      )}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
