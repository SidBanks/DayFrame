import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactElement } from "react";
import type { GoalV1 } from "../core/goals/goal.js";
import type { HistoricalIntelligenceSummaryStore } from "./HistoricalIntelligenceSummary.js";

export function GoalProgressSummary({
  goal,
  store,
  evaluationAsOf,
  onOpenPlanner,
  disclosure,
  showIdentity = false,
  refreshKey,
}: {
  goal: GoalV1;
  store: Pick<
    HistoricalIntelligenceSummaryStore,
    | "queryGoalProgress"
    | "listMeasurementDefinitionHistory"
    | "subscribeMeasurementDefinitions"
    | "subscribeProgressObservations"
  >;
  evaluationAsOf: string;
  onOpenPlanner?: () => void;
  disclosure?: { open: boolean; setOpen: (value: boolean) => void };
  showIdentity?: boolean;
  refreshKey?: number;
}): ReactElement {
  const [revision, setRevision] = useState(0);
  const [localDetail, setLocalDetail] = useState(false);
  const detail = disclosure?.open ?? localDetail;
  const setDetail = (value: boolean) =>
    disclosure ? disclosure.setOpen(value) : setLocalDetail(value);
  const detailRef = useRef<HTMLDivElement>(null),
    focusDetail = useRef(false);
  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1);
    const definitions = store.subscribeMeasurementDefinitions(refresh),
      observations = store.subscribeProgressObservations(refresh);
    return () => {
      definitions();
      observations();
    };
  }, [store]);
  useEffect(() => {
    if (!disclosure) setLocalDetail(false);
  }, [evaluationAsOf, goal.id]);
  useEffect(() => {
    if (detail && focusDetail.current) detailRef.current?.focus();
    focusDetail.current = false;
  }, [detail]);
  const read = useMemo(() => {
    try {
      const result = store.queryGoalProgress({ goalId: goal.id, evaluationAsOf });
      const stopped =
        result.status === "notDefined" &&
        store
          .listMeasurementDefinitionHistory(goal.id)
          .filter((item) => item.effectiveFrom <= evaluationAsOf)
          .at(-1)?.status === "inactive";
      return { result, stopped };
    } catch {
      return { result: undefined };
    }
  }, [store, goal, evaluationAsOf, revision, refreshKey]);
  const result = read.result;
  if (!result) {
    return (
      <ProgressShell>
        <p className="df-danger-message" role="alert">
          Progress could not be loaded. Refresh the history view to try again.
        </p>
      </ProgressShell>
    );
  }
  const handoff = (label: string) =>
    onOpenPlanner ? (
      <button className="df-link-button" type="button" onClick={onOpenPlanner}>
        {label}
      </button>
    ) : null;
  if (result.status === "goalProtected")
    return (
      <ProgressShell>
        <AuthorityState result={result} label="Goals" />
      </ProgressShell>
    );
  if (result.status === "definitionProtected")
    return (
      <ProgressShell>
        <AuthorityState result={result} label="Measurement settings" />
      </ProgressShell>
    );
  if (result.status === "observationProtected")
    return (
      <ProgressShell>
        <AuthorityState result={result} label="Measurement records" />
      </ProgressShell>
    );
  if (result.status === "goalNotFound")
    return (
      <ProgressShell>
        <p className="df-danger-message" role="alert">
          The selected Goal is no longer available.
        </p>
      </ProgressShell>
    );
  if (result.status === "invalidQuery" || result.status === "invalidAuthority")
    return (
      <ProgressShell>
        <p className="df-danger-message" role="alert">
          Progress is unavailable because its measurement evidence could not be interpreted safely.
        </p>
      </ProgressShell>
    );
  if (result.status === "notDefined") {
    const stopped = read.stopped;
    return (
      <ProgressShell>
        <p>
          {stopped ? "Measurement is currently stopped." : "No quantity measurement configured."}
        </p>
        {goal.status === "archived"
          ? handoff("Open Planner to Reactivate Goal")
          : handoff(
              stopped ? "Open Planner to Restart Measurement" : "Configure Measurement in Planner",
            )}
      </ProgressShell>
    );
  }
  if (result.status === "unsupportedPolicy")
    return (
      <ProgressShell>
        <p>This measurement method is not supported by this version of DayFrame.</p>
        {handoff("Open Planner")}
      </ProgressShell>
    );
  if (result.status === "insufficientEvidence") {
    const target = `${quantity(result.provenance.targetValue)} ${result.provenance.unitId}`;
    return (
      <ProgressShell>
        <p>
          <strong>Target:</strong> {target}
        </p>
        <p>No current value recorded.</p>
        {goal.status === "archived"
          ? handoff("Open Planner to Reactivate Goal")
          : handoff("Record Current Value in Planner")}
      </ProgressShell>
    );
  }
  if (result.status !== "available") {
    return (
      <ProgressShell>
        <p className="df-danger-message" role="alert">
          Progress is unavailable because its measurement evidence could not be interpreted safely.
        </p>
      </ProgressShell>
    );
  }
  const percentage = displayPercentage(result.percentage),
    comparison =
      result.comparison === "belowTarget"
        ? "Below target"
        : result.comparison === "atTarget"
          ? "At target"
          : "Above target";
  function activate(event: MouseEvent<HTMLButtonElement>) {
    focusDetail.current = event.detail === 0;
    setDetail(!detail);
  }
  return (
    <ProgressShell>
      <div
        className="df-progress-quantity"
        aria-label={`${quantity(result.quantity.observedValue)} of ${quantity(result.quantity.targetValue)} ${result.quantity.unitId}; ${result.percentage} percent${result.comparison === "belowTarget" && result.percentage === "100" ? "; rounded percentage, below target" : ""}`}
      >
        <strong>{quantity(result.quantity.observedValue)}</strong>
        <span>
          of {quantity(result.quantity.targetValue)} {result.quantity.unitId}
        </span>
      </div>
      <p className="df-progress-percentage">
        {result.comparison === "belowTarget" && percentage === "100"
          ? "Below 100% (canonical percentage rounds to 100%)"
          : `${percentage}%`}
      </p>
      <p>{comparison}</p>
      <p className="df-muted">Observed {formatInstant(result.observation.observedAt)}</p>
      <button
        type="button"
        className="df-link-button"
        aria-expanded={detail}
        aria-controls="goal-progress-details"
        onClick={activate}
      >
        How this Progress was calculated
      </button>
      {detail ? (
        <div
          id="goal-progress-details"
          className="df-progress-provenance"
          ref={detailRef}
          tabIndex={-1}
        >
          <h5>Measurement details</h5>
          {showIdentity && (
            <>
              <Detail
                label="Definition identity / revision"
                value={`${result.definition.id} / ${result.definition.revision}`}
              />
              <Detail label="Measurement epoch begins" value={result.definition.effectiveFrom} />
              <Detail
                label="Observation identity / revision"
                value={`${result.observation.id} / ${result.observation.revision}`}
              />
              <Detail label="Exact observation time" value={result.observation.observedAt} />
              <Detail label="Exact record time" value={result.observation.recordedAt} />
              <p>
                Values are absolute totals, not increments. This measurement epoch is independent of
                the Activity period. Current Goal title and status are current context, not
                reconstructed historical Goal state.
              </p>
            </>
          )}
          <Detail label="Measurement method" value="Quantity toward a target" />
          <Detail
            label="Target"
            value={`${quantity(result.provenance.targetValue)} ${result.quantity.unitId}`}
          />
          <Detail
            label="Recorded value"
            value={`${quantity(result.provenance.observedValue)} ${result.quantity.unitId}`}
          />
          <Detail label="Observed" value={formatInstant(result.provenance.observedAt)} />
          <Detail
            label="Recorded in DayFrame"
            value={formatInstant(result.provenance.recordedAt)}
          />
          <Detail
            label="Evaluation cutoff"
            value={formatInstant(result.provenance.evaluationAsOf)}
          />
          <p className="df-muted">
            This Progress uses the measurement target active at the evaluation cutoff. Exact
            calculated percentage: {result.percentage}%.
          </p>
        </div>
      ) : null}
      {handoff("Open Planner")}
    </ProgressShell>
  );
}
function ProgressShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="df-goal-progress" aria-labelledby="goal-progress-heading">
      <h4 id="goal-progress-heading">Progress</h4>
      <p className="df-muted">
        Progress compares the latest recorded value for this Goal with its active quantity target.
      </p>
      {children}
    </section>
  );
}
function AuthorityState({ result, label }: { result: { reason: string }; label: string }) {
  return result.reason === "initializing" ? (
    <p role="status">Loading Progress…</p>
  ) : (
    <p className="df-danger-message" role="alert">
      {label} are unavailable until stored data can be recovered safely.
    </p>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <strong>{label}</strong>
      <span>{value}</span>
    </p>
  );
}
export function quantity(value: string) {
  const [whole, fraction] = value.split(".");
  const grouped = whole!.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${grouped}.${fraction}` : grouped;
}
export function displayPercentage(value: string) {
  const [whole, fraction = ""] = value.split(".");
  const shown = fraction.slice(0, 2).replace(/0+$/g, "");
  return shown ? `${whole}.${shown}` : whole!;
}
function formatInstant(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}
