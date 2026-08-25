import { useEffect, useId, useRef, useState, type ReactElement, type RefObject } from "react";
import {
  MANUAL_QUANTITY_TARGET_POLICY_V1,
  MEASUREMENT_UNITS,
  isCanonicalUnsignedDecimal,
  measurementPolicySupport,
  type GoalMeasurementDefinitionV1,
  type MeasurementUnitId,
} from "../core/measurement/measurementDefinition.js";
import type { GoalV1 } from "../core/goals/goal.js";
import type { DayFrameStore } from "../state/types.js";

type Store = Pick<
  DayFrameStore,
  | "listMeasurementDefinitionHistory"
  | "getMeasurementDefinitionIngressStatus"
  | "getMeasurementDefinitionDurabilityStatus"
  | "subscribeMeasurementDefinitions"
  | "createMeasurementDefinition"
  | "reviseMeasurementDefinition"
  | "stopMeasuringGoal"
  | "restartMeasurement"
  | "retryMeasurementDefinitionPersistence"
>;
type Mode = "setup" | "change" | "restart" | null;
type Draft = { targetValue: string; unitId: MeasurementUnitId };
const blank: Draft = { targetValue: "", unitId: "count" };
const labels: Record<MeasurementUnitId, string> = {
  count: "Count",
  words: "Words",
  pages: "Pages",
  miles: "Miles",
  kilometers: "Kilometers",
  minutes: "Minutes",
};

export function GoalMeasurementSection({
  goal,
  store,
}: {
  goal: GoalV1;
  store: Store;
}): ReactElement {
  const [history, setHistory] = useState(() => store.listMeasurementDefinitionHistory(goal.id));
  const [mode, setMode] = useState<Mode>(null);
  const [draft, setDraft] = useState<Draft>(blank);
  const [expected, setExpected] = useState<number | null>(null);
  const [confirmStop, setConfirmStop] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [targetError, setTargetError] = useState("");
  const targetRef = useRef<HTMLInputElement>(null),
    headingRef = useRef<HTMLHeadingElement>(null),
    openerRef = useRef<HTMLButtonElement | null>(null),
    cancelStopRef = useRef<HTMLButtonElement>(null);
  const targetErrorId = useId();
  const latest = history.at(-1);
  const ingress = store.getMeasurementDefinitionIngressStatus(),
    durability = store.getMeasurementDefinitionDurabilityStatus();
  useEffect(() => {
    setHistory(store.listMeasurementDefinitionHistory(goal.id));
    setMode(null);
    setDraft(blank);
    setExpected(null);
    setConfirmStop(false);
    setError("");
    setMessage("");
  }, [goal.id, store]);
  useEffect(
    () =>
      store.subscribeMeasurementDefinitions(() => {
        const next = store.listMeasurementDefinitionHistory(goal.id);
        setHistory(next);
        const current = next.at(-1);
        if (mode && expected !== null && current?.revision !== expected)
          setError(
            "This measurement changed while you were editing it. Review the latest settings and try again.",
          );
      }),
    [expected, goal.id, mode, store],
  );
  useEffect(() => {
    if (mode) targetRef.current?.focus();
  }, [mode]);
  useEffect(() => {
    if (confirmStop) cancelStopRef.current?.focus();
  }, [confirmStop]);
  function open(next: Exclude<Mode, null>, button: HTMLButtonElement) {
    openerRef.current = button;
    setError("");
    setMessage("");
    setTargetError("");
    setMode(next);
    setExpected(latest?.revision ?? null);
    setDraft(latest && supported(latest) ? config(latest) : blank);
  }
  function cancel() {
    setMode(null);
    setDraft(blank);
    setExpected(null);
    setTargetError("");
    setError("");
    openerRef.current?.focus();
  }
  function valid() {
    if (!isCanonicalUnsignedDecimal(draft.targetValue) || draft.targetValue === "0") {
      setTargetError(
        "Enter a positive quantity using up to 100 digits and an optional decimal point.",
      );
      targetRef.current?.focus();
      return false;
    }
    setTargetError("");
    return true;
  }
  async function save() {
    setError("");
    setMessage("");
    if (!valid()) return;
    const value = { targetValue: draft.targetValue, unitId: draft.unitId };
    const result =
      mode === "setup"
        ? await store.createMeasurementDefinition(goal.id, MANUAL_QUANTITY_TARGET_POLICY_V1, value)
        : latest && expected !== null && mode === "change"
          ? await store.reviseMeasurementDefinition(
              latest.id,
              expected,
              MANUAL_QUANTITY_TARGET_POLICY_V1,
              value,
            )
          : latest && expected !== null
            ? await store.restartMeasurement(
                latest.id,
                expected,
                MANUAL_QUANTITY_TARGET_POLICY_V1,
                value,
              )
            : { status: "rejected" as const, reason: "notFound" as const };
    if (result.status === "rejected") {
      setError(commandError(result.reason));
      return;
    }
    setMode(null);
    setExpected(null);
    setDraft(blank);
    if (result.status === "noOp") setMessage("Measurement settings are unchanged.");
    else
      setMessage(
        result.persistence === "durable"
          ? "Measurement saved."
          : "Measurement saved for this session; local saving needs attention.",
      );
    requestAnimationFrame(() => headingRef.current?.focus());
  }
  async function stop() {
    if (!latest) return;
    setError("");
    const result = await store.stopMeasuringGoal(latest.id, expected ?? latest.revision);
    if (result.status === "rejected") {
      setError(commandError(result.reason));
      return;
    }
    setConfirmStop(false);
    setMessage(
      result.status === "noOp" || result.persistence === "durable"
        ? "Measurement stopped."
        : "Measurement stopped for this session; local saving needs attention.",
    );
    requestAnimationFrame(() => headingRef.current?.focus());
  }
  return (
    <section className="df-goal-measurement" aria-labelledby={`measurement-${goal.id}`}>
      <h4 id={`measurement-${goal.id}`} ref={headingRef} tabIndex={-1}>
        Measurement
      </h4>
      {durability === "storageFailure" ? (
        <div className="df-danger-message" role="alert">
          <p>Measurement changes are available for this session but are not durably saved.</p>
          <button
            className="df-secondary-button"
            type="button"
            onClick={() => void store.retryMeasurementDefinitionPersistence()}
          >
            Retry Measurement save
          </button>
        </div>
      ) : null}
      {message ? (
        <p className="df-success-message" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="df-danger-message" role="alert">
          {error}
        </p>
      ) : null}
      {ingress.status === "initializing" ? (
        <p aria-live="polite">Loading Measurement…</p>
      ) : ingress.status === "protected" ? (
        <p role="alert" className="df-danger-message">
          Measurements need recovery before they can be viewed or changed. Stored measurement data
          was preserved.
        </p>
      ) : mode ? (
        <form
          className="df-measurement-form df-form-stack"
          aria-label={`${mode} Measurement`}
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <p>
            <strong>Quantity toward a target</strong>
          </p>
          <label>
            Quantity target
            <input
              ref={targetRef}
              type="text"
              inputMode="decimal"
              maxLength={100}
              value={draft.targetValue}
              aria-invalid={!!targetError}
              aria-describedby={targetError ? targetErrorId : undefined}
              onChange={(e) => setDraft({ ...draft, targetValue: e.target.value })}
            />
          </label>
          {targetError ? (
            <p id={targetErrorId} className="df-danger-message" role="alert">
              {targetError}
            </p>
          ) : null}
          <label>
            Unit
            <select
              value={draft.unitId}
              onChange={(e) => setDraft({ ...draft, unitId: e.target.value as MeasurementUnitId })}
            >
              {MEASUREMENT_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {labels[unit]}
                </option>
              ))}
            </select>
          </label>
          {mode === "change" ? (
            <>
              <p className="df-warning-message">
                Changing the target or unit starts a new measurement period. Previous records remain
                in history, but you'll need to record a new current value.
              </p>
              {latest && supported(latest) && config(latest).unitId !== draft.unitId ? (
                <p className="df-warning-message">
                  DayFrame does not convert previous values between units.
                </p>
              ) : null}
            </>
          ) : null}
          {mode === "restart" ? (
            <p className="df-warning-message">
              Restarting begins a new measurement period. You'll need to record a new current value.
            </p>
          ) : null}
          <div className="df-screen-actions">
            <button className="df-action-button" type="submit">
              {mode === "setup"
                ? "Start Measurement"
                : mode === "change"
                  ? "Save Measurement Changes"
                  : "Restart Measurement"}
            </button>
            <button className="df-secondary-button" type="button" onClick={cancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <Read
          goal={goal}
          latest={latest}
          confirmStop={confirmStop}
          cancelStopRef={cancelStopRef}
          open={open}
          setConfirmStop={(value) => {
            setConfirmStop(value);
            setExpected(value ? (latest?.revision ?? null) : null);
          }}
          stop={stop}
        />
      )}{" "}
    </section>
  );
}

function Read({
  goal,
  latest,
  confirmStop,
  cancelStopRef,
  open,
  setConfirmStop,
  stop,
}: {
  goal: GoalV1;
  latest: GoalMeasurementDefinitionV1 | undefined;
  confirmStop: boolean;
  cancelStopRef: RefObject<HTMLButtonElement | null>;
  open: (mode: "setup" | "change" | "restart", button: HTMLButtonElement) => void;
  setConfirmStop: (value: boolean) => void;
  stop: () => Promise<void>;
}) {
  const archived = goal.status === "archived";
  if (!latest)
    return (
      <>
        <p>This Goal is not currently measured with a quantity target.</p>
        {archived ? (
          <p className="df-support">Reactivate this Goal to set up measurement.</p>
        ) : (
          <button
            className="df-secondary-button"
            type="button"
            onClick={(e) => open("setup", e.currentTarget)}
          >
            Set up Measurement
          </button>
        )}
      </>
    );
  if (!supported(latest))
    return (
      <p>
        This measurement method is not supported by this version of DayFrame. Its settings have been
        preserved.
      </p>
    );
  const value = config(latest);
  if (latest.status === "inactive")
    return (
      <>
        <p>
          <strong>Measurement stopped.</strong>
        </p>
        <p>Previous measurement settings and records are preserved.</p>
        <p>
          <strong>Last measurement:</strong> {format(value)}
        </p>
        {archived ? (
          <p className="df-support">Reactivate this Goal to restart measurement.</p>
        ) : (
          <button
            className="df-secondary-button"
            type="button"
            onClick={(e) => open("restart", e.currentTarget)}
          >
            Restart Measurement
          </button>
        )}
      </>
    );
  return (
    <>
      <p>
        <strong>Quantity toward a target</strong>
      </p>
      <p className="df-measurement-target">
        <strong>Target</strong>
        <span>{format(value)}</span>
      </p>
      <p className="df-support">Changing the target or unit starts a new measurement period.</p>
      {archived ? (
        <p className="df-support">Reactivate this Goal to change or stop measurement.</p>
      ) : confirmStop ? (
        <div
          className="df-measurement-confirm"
          role="alertdialog"
          aria-labelledby="stop-measurement-title"
          aria-describedby="stop-measurement-copy"
        >
          <h5 id="stop-measurement-title">Stop measuring this Goal?</h5>
          <p id="stop-measurement-copy">
            The Goal remains unchanged. Previous measurement settings and records are preserved.
          </p>
          <div className="df-screen-actions">
            <button className="df-secondary-button" type="button" onClick={() => void stop()}>
              Stop Measuring
            </button>
            <button
              ref={cancelStopRef}
              className="df-secondary-button"
              type="button"
              onClick={() => setConfirmStop(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="df-screen-actions">
          <button
            className="df-secondary-button"
            type="button"
            onClick={(e) => open("change", e.currentTarget)}
          >
            Change Measurement
          </button>
          <button
            className="df-secondary-button"
            type="button"
            onClick={() => setConfirmStop(true)}
          >
            Stop Measuring
          </button>
        </div>
      )}
    </>
  );
}
function supported(value: GoalMeasurementDefinitionV1) {
  return measurementPolicySupport(value.policyRef) === "supported";
}
function config(value: GoalMeasurementDefinitionV1): Draft {
  return {
    targetValue: String(value.config.targetValue),
    unitId: value.config.unitId as MeasurementUnitId,
  };
}
function format(value: Draft) {
  return `${value.targetValue} ${labels[value.unitId].toLocaleLowerCase()}`;
}
function commandError(reason: string) {
  return reason === "staleRevision"
    ? "This measurement changed while you were editing it. Review the latest settings and try again."
    : reason === "protected" || reason === "initializing"
      ? "Measurements need recovery before they can be changed."
      : reason === "authorityTransactionActive"
        ? "Measurement changes are temporarily unavailable while DayFrame replaces saved authority."
        : reason === "invalidInput"
          ? "Check the quantity target and unit and try again."
          : reason === "goalNotFound" || reason === "notFound"
            ? "This Goal or measurement changed. Select it again and retry."
            : "The measurement change could not be completed.";
}
