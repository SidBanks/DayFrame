import { useEffect, useState } from "react";
import type { DayFrameStore } from "../state/types.js";
import type { querySleepHistory } from "../state/sleepHistoryQuery.js";
export function SleepHistorySection({
  store,
  start,
  end,
  asOf,
}: {
  store: Pick<DayFrameStore, "querySleepHistory" | "recordSleepExecution">;
  start: string;
  end: string;
  asOf: string;
}) {
  const [result, setResult] = useState<Awaited<ReturnType<typeof querySleepHistory>> | null>(null);
  const [actualOffset, setActualOffset] = useState("");
  const [busy, setBusy] = useState(false);
  const [actualStart, setActualStart] = useState(""),
    [minutes, setMinutes] = useState(""),
    [message, setMessage] = useState(""),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let live = true;
    setResult(null);
    void store
      .querySleepHistory({
        startUserDayDate: start,
        endUserDayDateExclusive: new Date(Date.parse(end) + 86400000).toISOString().slice(0, 10),
        asOf,
      })
      .then(
        (value) => {
          if (live) setResult(value);
        },
        () => {
          if (live) setResult({ status: "unavailable" });
        },
      );
    return () => {
      live = false;
    };
  }, [store, start, end, asOf, revision]);
  async function report() {
    if (busy) return;
    setBusy(true);
    try {
      const value = await store.recordSleepExecution({
        kind: "reportUnplanned",
        outcome: "completed",
        actualTime: {
          occurredAt: new Date(actualStart + actualOffset).toISOString(),
          durationMinutes: Number(minutes),
        },
      });
      setMessage(
        value.status === "accepted"
          ? "Unplanned Sleep recorded."
          : "Sleep report could not be saved.",
      );
      if (value.status === "accepted") setRevision((n) => n + 1);
    } catch {
      setMessage("Enter a valid actual start and elapsed minutes.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section aria-label="Sleep history">
      <h2>Sleep history</h2>
      <p>Published Sleep and explicitly reported actuals. Unreported Sleep remains unknown.</p>
      {!result ? (
        <p>Loading Sleep history…</p>
      ) : result.status !== "available" ? (
        <p>Sleep history: {result.status}.</p>
      ) : (
        <>
          <ul>
            {result.coverage
              .filter((day) => !["satisfied"].includes(day.status))
              .map((day) => (
                <li key={day.ownerDay}>
                  {day.ownerDay}: {day.status}
                </li>
              ))}
          </ul>
          <ul>
            {result.publications.map((row) => (
              <li key={row.snapshot.sleep.snapshotId}>
                {row.snapshot.sleep.occurrence.ownerDay}: planned {row.snapshot.plan.startsAt} –{" "}
                {row.snapshot.plan.endsAt}; actual {row.actualState}
                {row.actualState === "corrected"
                  ? ` (${row.execution?.currentOutcome.status})`
                  : ""}
                {row.superseded ? " (superseded publication)" : ""}
                {row.execution?.currentOutcome.status !== "unknown" &&
                row.execution?.currentOutcome.record.actualTime
                  ? `; reported ${row.execution.currentOutcome.record.actualTime.occurredAt}, ${row.execution.currentOutcome.record.actualTime.durationMinutes} elapsed minutes`
                  : ""}
                <SleepHistoryReport
                  store={store}
                  item={row.execution}
                  publication={{
                    publicationBatchId: row.publicationBatchId,
                    snapshotId: row.snapshot.sleep.snapshotId,
                  }}
                  onSaved={() => setRevision((n) => n + 1)}
                />
              </li>
            ))}
          </ul>
          <ul>
            {result.unplanned.map((item) => (
              <li key={item.subjectId}>
                {item.snapshot.userDay.date}: unplanned Sleep —{" "}
                {item.currentRecord.kind === "retraction"
                  ? "retracted"
                  : item.currentOutcome.status}
                {item.currentOutcome.status !== "unknown" && item.currentOutcome.record.actualTime
                  ? `; ${item.currentOutcome.record.actualTime.occurredAt}, ${item.currentOutcome.record.actualTime.durationMinutes} elapsed minutes`
                  : ""}
                <SleepHistoryReport
                  store={store}
                  item={item}
                  onSaved={() => setRevision((n) => n + 1)}
                />
              </li>
            ))}
          </ul>
        </>
      )}
      <details>
        <summary>Record unplanned Sleep</summary>
        <label>
          Actual Sleep start
          <input
            type="datetime-local"
            value={actualStart}
            onChange={(e) => setActualStart(e.target.value)}
          />
        </label>
        <label>
          UTC offset at actual start (optional)
          <input
            value={actualOffset}
            placeholder="-06:00"
            onChange={(event) => setActualOffset(event.target.value)}
          />
        </label>
        <label>
          Elapsed minutes
          <input
            type="number"
            min="1"
            max="1440"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </label>
        <button type="button" disabled={busy} onClick={() => void report()}>
          Record unplanned Sleep
        </button>
        <p role="status">{message}</p>
      </details>
    </section>
  );
}

function SleepHistoryReport({
  store,
  item,
  publication,
  onSaved,
}: {
  store: Pick<DayFrameStore, "recordSleepExecution">;
  item: import("../core/execution/executionHistoryProjection.js").ExecutionHistoryItem | null;
  publication?: { publicationBatchId: string; snapshotId: string };
  onSaved: () => void;
}) {
  const [offset, setOffset] = useState("");
  const [start, setStart] = useState(""),
    [minutes, setMinutes] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function save(outcome: "completed" | "partial" | "skipped" | "retract") {
    if (busy) return;
    setBusy(true);
    try {
      const actualTime =
        outcome === "skipped" || outcome === "retract"
          ? undefined
          : {
              occurredAt: new Date(start + offset).toISOString(),
              durationMinutes: Number(minutes),
            };
      const command: import("../state/sleepExecutionCommand.js").SleepExecutionCommand =
        outcome === "retract" && item
          ? { kind: "retract", subjectId: item.subjectId, currentRecordId: item.currentRecord.id }
          : outcome !== "retract" && item
            ? {
                kind: "correct",
                subjectId: item.subjectId,
                currentRecordId: item.currentRecord.id,
                outcome,
                ...(actualTime ? { actualTime } : {}),
              }
            : outcome !== "retract" && publication
              ? {
                  kind: "reportPublished",
                  ...publication,
                  outcome,
                  ...(actualTime ? { actualTime } : {}),
                }
              : (() => {
                  throw Error();
                })();
      const result = await store.recordSleepExecution(command);
      setMessage(
        result.status === "accepted" ? "Sleep report saved." : "Sleep report could not be saved.",
      );
      if (result.status === "accepted") onSaved();
    } catch {
      setMessage("Enter a valid actual start and elapsed minutes.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <details>
      <summary>{item ? "Correct or retract Sleep report" : "Report actual Sleep"}</summary>
      <label>
        Actual Sleep start
        <input
          type="datetime-local"
          value={start}
          onChange={(event) => setStart(event.target.value)}
        />
      </label>
      <label>
        UTC offset at actual start (optional)
        <input
          value={offset}
          placeholder="-06:00"
          onChange={(event) => setOffset(event.target.value)}
        />
      </label>
      <label>
        Actual elapsed minutes
        <input
          type="number"
          min="1"
          max="1440"
          value={minutes}
          onChange={(event) => setMinutes(event.target.value)}
        />
      </label>
      <button type="button" disabled={busy} onClick={() => void save("completed")}>
        Save actual Sleep
      </button>
      <button type="button" disabled={busy} onClick={() => void save("partial")}>
        Save partial Sleep
      </button>
      {publication ? (
        <button type="button" disabled={busy} onClick={() => void save("skipped")}>
          Record skipped Sleep
        </button>
      ) : null}
      {item && item.currentRecord.kind !== "retraction" ? (
        <button type="button" disabled={busy} onClick={() => void save("retract")}>
          Retract Sleep report
        </button>
      ) : null}
      <p role="status">{message}</p>
    </details>
  );
}
