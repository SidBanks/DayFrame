import { useEffect, useId, useRef, useState, type ReactElement, type RefObject } from "react";
import type { GoalV1 } from "../core/goals/goal.js";
import {
  isCanonicalObservationValue,
  type GoalProgressObservationV1,
} from "../core/progressObservation/progressObservation.js";
import type {
  GoalProgressObservationHistoryPeriod,
  GoalProgressObservationHistoryRecord,
  GoalProgressObservationHistoryResult,
} from "../state/goalProgressObservationHistoryQuery.js";
import type { DayFrameStore } from "../state/types.js";
type Store = Pick<
  DayFrameStore,
  | "queryGoalProgressObservationHistory"
  | "subscribeMeasurementDefinitions"
  | "subscribeProgressObservations"
  | "getProgressObservationDurabilityStatus"
  | "retryProgressObservationPersistence"
  | "createProgressObservation"
  | "correctProgressObservation"
  | "retractProgressObservation"
>;
type Draft = { value: string; observedLocal: string };
type Editing =
  | { kind: "record"; period: GoalProgressObservationHistoryPeriod }
  | { kind: "correct"; record: GoalProgressObservationV1 }
  | null;
export function GoalProgressReportingSection({
  goal,
  store,
}: {
  goal: GoalV1;
  store: Store;
}): ReactElement {
  const [history, setHistory] = useState<GoalProgressObservationHistoryResult>(() =>
    store.queryGoalProgressObservationHistory(goal.id),
  );
  const [editing, setEditing] = useState<Editing>(null);
  const [draft, setDraft] = useState<Draft>({
    value: "",
    observedLocal: localDateTime(new Date()),
  });
  const [remove, setRemove] = useState<GoalProgressObservationV1 | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [valueError, setValueError] = useState(""),
    [timeError, setTimeError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null),
    valueRef = useRef<HTMLInputElement>(null),
    timeRef = useRef<HTMLInputElement>(null),
    openerRef = useRef<HTMLButtonElement | null>(null),
    removeCancelRef = useRef<HTMLButtonElement>(null);
  const valueHelpId = useId(),
    timeErrorId = useId();
  const durability = store.getProgressObservationDurabilityStatus();
  useEffect(() => {
    setHistory(store.queryGoalProgressObservationHistory(goal.id));
    setEditing(null);
    setRemove(null);
    setError("");
    setMessage("");
  }, [goal.id, store]);
  useEffect(() => {
    const refresh = () => setHistory(store.queryGoalProgressObservationHistory(goal.id));
    const first = store.subscribeMeasurementDefinitions(refresh),
      second = store.subscribeProgressObservations(refresh);
    return () => {
      first();
      second();
    };
  }, [goal.id, store]);
  useEffect(() => {
    if (editing) valueRef.current?.focus();
  }, [editing]);
  useEffect(() => {
    if (remove) removeCancelRef.current?.focus();
  }, [remove]);
  function openRecord(button: HTMLButtonElement, period: GoalProgressObservationHistoryPeriod) {
    openerRef.current = button;
    clearFeedback();
    setDraft({ value: "", observedLocal: localDateTime(new Date()) });
    setEditing({ kind: "record", period: structuredClone(period) });
  }
  function openCorrection(button: HTMLButtonElement, record: GoalProgressObservationV1) {
    openerRef.current = button;
    clearFeedback();
    setDraft({ value: record.value, observedLocal: localDateTime(new Date(record.observedAt)) });
    setEditing({ kind: "correct", record });
  }
  function cancel() {
    setEditing(null);
    setRemove(null);
    setValueError("");
    setTimeError("");
    setError("");
    openerRef.current?.focus();
  }
  function clearFeedback() {
    setError("");
    setMessage("");
    setValueError("");
    setTimeError("");
  }
  function canonicalTime() {
    const parsed = parseLocalDateTime(draft.observedLocal);
    if (!parsed) {
      setTimeError("Enter a valid observed date and time.");
      timeRef.current?.focus();
      return undefined;
    }
    return parsed;
  }
  async function save() {
    clearFeedback();
    if (!isCanonicalObservationValue(draft.value)) {
      setValueError("Enter a quantity using up to 100 digits and an optional decimal point.");
      valueRef.current?.focus();
      return;
    }
    const observedAt = canonicalTime();
    if (!observedAt || !editing) return;
    const kind = editing.kind;
    if (
      kind === "record" &&
      (history.status !== "available" ||
        history.currentDefinition?.id !== editing.period.definition.id ||
        history.currentDefinition.revision !== editing.period.definition.revision)
    ) {
      setError(
        "The measurement changed while you were recording this value. Review the latest measurement and try again.",
      );
      return;
    }
    const result =
      kind === "record"
        ? await store.createProgressObservation({
            goalId: goal.id,
            value: draft.value,
            observedAt,
            expectedDefinitionRevision: editing.period.definition.revision,
          })
        : await store.correctProgressObservation({
            id: editing.record.id,
            expectedRevision: editing.record.revision,
            value: draft.value,
            observedAt,
          });
    if (result.status === "rejected") {
      const mapped = commandError(result.reason);
      setError(mapped.message);
      if (mapped.field === "time") timeRef.current?.focus();
      return;
    }
    setEditing(null);
    setMessage(
      result.status === "noOp"
        ? "The record is unchanged."
        : result.persistence === "durable"
          ? kind === "record"
            ? "Value recorded."
            : "Correction saved."
          : "Record saved for this session; local saving needs attention.",
    );
    requestAnimationFrame(() => headingRef.current?.focus());
  }
  async function confirmRemove() {
    if (!remove) return;
    setError("");
    const result = await store.retractProgressObservation(remove.id, remove.revision);
    if (result.status === "rejected") {
      setError(commandError(result.reason).message);
      return;
    }
    setRemove(null);
    setMessage(
      result.status === "noOp" || result.persistence === "durable"
        ? "Invalid record removed from current measurement history."
        : "Record removed for this session; local saving needs attention.",
    );
    requestAnimationFrame(() => headingRef.current?.focus());
  }
  return (
    <section className="df-goal-reporting" aria-labelledby={`reporting-${goal.id}`}>
      <h4 id={`reporting-${goal.id}`} ref={headingRef} tabIndex={-1}>
        Progress Reporting
      </h4>
      {durability === "storageFailure" ? (
        <div className="df-danger-message" role="alert">
          <p>Measurement records are available for this session but are not durably saved.</p>
          <button
            type="button"
            className="df-secondary-button"
            onClick={() => void store.retryProgressObservationPersistence()}
          >
            Retry record save
          </button>
        </div>
      ) : null}
      {message ? (
        <p role="status" className="df-success-message">
          {message}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="df-danger-message">
          {error}
        </p>
      ) : null}
      {history.status === "initializing" ? (
        <p aria-live="polite">Loading measurement records…</p>
      ) : history.status === "protected" ? (
        <p role="alert" className="df-danger-message">
          Measurement records need recovery before they can be viewed or changed. Stored records
          were preserved.
        </p>
      ) : (
        <Available
          goal={goal}
          history={history}
          editing={editing}
          draft={draft}
          valueRef={valueRef}
          timeRef={timeRef}
          valueHelpId={valueHelpId}
          timeErrorId={timeErrorId}
          valueError={valueError}
          timeError={timeError}
          remove={remove}
          removeCancelRef={removeCancelRef}
          setDraft={setDraft}
          openRecord={openRecord}
          openCorrection={openCorrection}
          setRemove={(record, button) => {
            openerRef.current = button;
            setRemove(record);
          }}
          save={save}
          cancel={cancel}
          confirmRemove={confirmRemove}
        />
      )}
    </section>
  );
}
type AvailableProps = {
  goal: GoalV1;
  history: Extract<GoalProgressObservationHistoryResult, { status: "available" }>;
  editing: Editing;
  draft: Draft;
  valueRef: RefObject<HTMLInputElement | null>;
  timeRef: RefObject<HTMLInputElement | null>;
  valueHelpId: string;
  timeErrorId: string;
  valueError: string;
  timeError: string;
  remove: GoalProgressObservationV1 | null;
  removeCancelRef: RefObject<HTMLButtonElement | null>;
  setDraft: (draft: Draft) => void;
  openRecord: (button: HTMLButtonElement, period: GoalProgressObservationHistoryPeriod) => void;
  openCorrection: (button: HTMLButtonElement, record: GoalProgressObservationV1) => void;
  setRemove: (record: GoalProgressObservationV1, button: HTMLButtonElement) => void;
  save: () => Promise<void>;
  cancel: () => void;
  confirmRemove: () => Promise<void>;
};
function Available(props: AvailableProps) {
  const { goal, history } = props;
  const current = history.periods.find((period) => period.current);
  const archived = goal.status === "archived";
  if (props.editing) {
    const editing = props.editing;
    const period =
      editing.kind === "record"
        ? editing.period
        : history.periods.find(
            (item) =>
              item.definition.id === editing.record.definitionId &&
              item.definition.revision === editing.record.definitionRevision,
          );
    if (!period) return <p role="alert">This measurement period is no longer available.</p>;
    return <ObservationForm {...props} period={period} />;
  }
  return (
    <>
      {history.currentMeasurement === "none" ? (
        <p>Set up Measurement before recording a value.</p>
      ) : history.currentMeasurement === "inactive" ? (
        <p>Measurement is stopped. Restart it before recording a new current value.</p>
      ) : history.currentMeasurement === "unsupported" ? (
        <p>
          This measurement method is not supported by this version of DayFrame. Existing records are
          preserved.
        </p>
      ) : current ? (
        <>
          <p>
            <strong>Current measurement</strong>
          </p>
          <p>Target: {target(current)}</p>
          {archived ? (
            <p className="df-support">
              Reactivate this Goal to record or maintain measurement records.
            </p>
          ) : (
            <button
              className="df-secondary-button"
              type="button"
              onClick={(e) => props.openRecord(e.currentTarget, current)}
            >
              {current.records.some((item) => item.observation.status === "active")
                ? "Record New Value"
                : "Record Current Value"}
            </button>
          )}
        </>
      ) : null}
      <History {...props} archived={archived} />
    </>
  );
}
function ObservationForm(props: AvailableProps & { period: GoalProgressObservationHistoryPeriod }) {
  const correction = props.editing?.kind === "correct";
  return (
    <form
      className="df-observation-form df-form-stack"
      aria-label={correction ? "Correct measurement record" : "Record current value"}
      onSubmit={(e) => {
        e.preventDefault();
        void props.save();
      }}
    >
      <p>
        <strong>{correction ? "Correct Record" : "Record a measured value"}</strong>
      </p>
      <p>Goal: {props.goal.title}</p>
      <p>Target: {target(props.period)}</p>
      <label htmlFor={`${props.valueHelpId}-input`}>Current value</label>
      <span className="df-observation-value">
        <input
          id={`${props.valueHelpId}-input`}
          ref={props.valueRef}
          type="text"
          inputMode="decimal"
          maxLength={100}
          value={props.draft.value}
          aria-invalid={!!props.valueError}
          aria-describedby={props.valueError ? `${props.valueHelpId}-error` : props.valueHelpId}
          onChange={(e) => props.setDraft({ ...props.draft, value: e.target.value })}
        />
        <span>{unit(props.period.definition)}</span>
      </span>
      <p id={props.valueHelpId} className="df-support">
        Enter the current total, not the amount added since your last record.
      </p>
      {props.valueError ? (
        <p id={`${props.valueHelpId}-error`} role="alert" className="df-danger-message">
          {props.valueError}
        </p>
      ) : null}
      <label>
        Observed date/time
        <input
          ref={props.timeRef}
          type="datetime-local"
          step="0.001"
          value={props.draft.observedLocal}
          aria-invalid={!!props.timeError}
          aria-describedby={props.timeError ? props.timeErrorId : undefined}
          onChange={(e) => props.setDraft({ ...props.draft, observedLocal: e.target.value })}
        />
      </label>
      {props.timeError ? (
        <p id={props.timeErrorId} role="alert" className="df-danger-message">
          {props.timeError}
        </p>
      ) : null}
      <div className="df-screen-actions">
        <button type="submit" className="df-action-button">
          {correction ? "Save Correction" : "Record Value"}
        </button>
        <button type="button" className="df-secondary-button" onClick={props.cancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
function History(props: AvailableProps & { archived: boolean }) {
  const periods = props.history.periods.filter((period) => period.records.length);
  return (
    <div className="df-observation-history">
      <h5>Measurement records</h5>
      {periods.length === 0 ? (
        <p className="df-support">No measurement records yet.</p>
      ) : (
        periods.map((period) => (
          <section
            key={`${period.definition.id}|${period.definition.revision}`}
            className="df-observation-period"
            aria-label={
              period.current ? "Current measurement period" : "Previous measurement period"
            }
          >
            <h6>{period.current ? "Current measurement period" : "Previous measurement period"}</h6>
            <p className="df-support">Target: {target(period)}</p>
            <ul className="df-observation-list">
              {period.records.map((item) => (
                <RecordRow
                  key={item.observation.id}
                  item={item}
                  period={period}
                  readOnly={props.archived}
                  openCorrection={props.openCorrection}
                  setRemove={props.setRemove}
                />
              ))}
            </ul>
          </section>
        ))
      )}
      {props.remove ? (
        <div
          className="df-measurement-confirm"
          role="alertdialog"
          aria-labelledby="remove-record-title"
          aria-describedby="remove-record-copy"
        >
          <h6 id="remove-record-title">Remove this record?</h6>
          <p id="remove-record-copy">
            It will no longer count as current measurement evidence. Its history will still be
            preserved.
          </p>
          <div className="df-screen-actions">
            <button
              type="button"
              className="df-secondary-button"
              onClick={() => void props.confirmRemove()}
            >
              Remove Invalid Record
            </button>
            <button
              ref={props.removeCancelRef}
              type="button"
              className="df-secondary-button"
              onClick={props.cancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
function RecordRow({
  item,
  period,
  readOnly,
  openCorrection,
  setRemove,
}: {
  item: GoalProgressObservationHistoryRecord;
  period: GoalProgressObservationHistoryPeriod;
  readOnly: boolean;
  openCorrection: (button: HTMLButtonElement, record: GoalProgressObservationV1) => void;
  setRemove: (record: GoalProgressObservationV1, button: HTMLButtonElement) => void;
}) {
  const record = item.observation,
    label = `${record.value} ${unit(period.definition)} observed ${formatInstant(record.observedAt)}`;
  return (
    <li
      className={`df-observation-record${record.status === "retracted" ? " df-observation-record--removed" : ""}`}
    >
      <strong>
        {record.value} {unit(period.definition)}
      </strong>
      <span>Observed {formatInstant(record.observedAt)}</span>
      {item.corrected ? <span>Corrected</span> : null}
      {record.status === "retracted" ? (
        <span>Removed from measurement</span>
      ) : !readOnly ? (
        <div className="df-screen-actions">
          <button
            type="button"
            className="df-secondary-button"
            aria-label={`Correct record: ${label}`}
            onClick={(e) => openCorrection(e.currentTarget, record)}
          >
            Correct Record
          </button>
          <button
            type="button"
            className="df-secondary-button"
            aria-label={`Remove invalid record: ${label}`}
            onClick={(e) => setRemove(record, e.currentTarget)}
          >
            Remove Invalid Record
          </button>
        </div>
      ) : null}
    </li>
  );
}
function unit(definition: GoalProgressObservationHistoryPeriod["definition"]) {
  return String(definition.config.unitId);
}
function target(period: GoalProgressObservationHistoryPeriod) {
  return `${String(period.definition.config.targetValue)} ${unit(period.definition)}`;
}
function localDateTime(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 23);
}
function parseLocalDateTime(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/.test(value)) return;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return;
  const [day, time] = value.split("T"),
    [year, month, dateOfMonth] = day!.split("-").map(Number),
    [hour, minute] = time!.split(":").map(Number);
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== dateOfMonth ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  )
    return;
  return date.toISOString();
}
function formatInstant(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}
function commandError(reason: string): { message: string; field?: "time" } {
  if (reason === "futureObservedAt")
    return { message: "Observed date/time cannot be in the future.", field: "time" };
  if (reason === "invalidObservedAt")
    return { message: "Enter a valid observed date and time.", field: "time" };
  if (reason === "invalidEpoch")
    return {
      message:
        "This record belongs to a different measurement period at that time. Record a new value instead.",
      field: "time",
    };
  if (reason === "conflictingObservationTime")
    return {
      message:
        "A measurement already exists for this time. Record a different time or correct the existing record.",
      field: "time",
    };
  if (reason === "staleDefinition")
    return {
      message:
        "The measurement changed while you were recording this value. Review the latest measurement and try again.",
    };
  if (reason === "staleRevision")
    return {
      message:
        "This record changed while you were correcting it. Review the latest record and try again.",
    };
  if (reason === "protected" || reason === "initializing")
    return { message: "Measurement records need recovery before they can be changed." };
  if (reason === "invalidValue") return { message: "Check the current value and try again." };
  return { message: "The measurement record could not be saved." };
}
