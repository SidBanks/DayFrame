import { useEffect, useRef, useState, type MouseEvent, type ReactElement } from "react";
import {
  GOAL_ACTIVITY_POLICY_V1,
  type GoalActivityLinkedProvenanceV1,
  type GoalActivityResultV1,
} from "../core/historicalIntelligence/goalActivity.js";
import type { GoalStatus, GoalV1 } from "../core/goals/goal.js";
import type { LocalDateString } from "../core/shifts/types.js";
import type { GoalActivityQueryResultV1 } from "../state/historicalIntelligenceQuery.js";
import type { HistoricalIntelligenceSummaryStore } from "./HistoricalIntelligenceSummary.js";
import { formatHumanTimeRange } from "./timeDisplay.js";
import { GoalProgressSummary } from "./GoalProgressSummary.js";

type Available = Extract<
  GoalActivityResultV1,
  { status: "available" | "partialCoverage" | "unavailable" }
>;
type PlanningCategory = "scheduled" | "unplaced" | "omitted" | "blocked";
type ExecutionCategory = "completed" | "partial" | "skipped" | "unknown" | "notReported";
type Detail =
  | { kind: "planning"; category: PlanningCategory }
  | { kind: "execution"; category: ExecutionCategory }
  | null;
const planning: { value: PlanningCategory; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "unplaced", label: "Unplaced" },
  { value: "omitted", label: "Omitted" },
  { value: "blocked", label: "Blocked" },
];
const execution: { value: ExecutionCategory; label: string }[] = [
  { value: "completed", label: "Reported completed" },
  { value: "partial", label: "Partial" },
  { value: "skipped", label: "Skipped" },
  { value: "unknown", label: "Unknown" },
  { value: "notReported", label: "Not reported" },
];
const lifecycle: { value: GoalStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export function GoalActivitySummary({
  store,
  range,
  evaluationAsOf,
  onOpenPlanner,
}: {
  store: HistoricalIntelligenceSummaryStore;
  range: { start: LocalDateString; end: LocalDateString };
  evaluationAsOf: string;
  onOpenPlanner?: () => void;
}): ReactElement {
  const [goals, setGoals] = useState(() => store.listGoals());
  const [ingress, setIngress] = useState(() => store.getGoalIngressStatus());
  const [selectedId, setSelectedId] = useState("");
  const [result, setResult] = useState<GoalActivityQueryResultV1 | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [detail, setDetail] = useState<Detail>(null);
  const request = useRef(0);
  const detailRef = useRef<HTMLDivElement>(null);
  const focusDetail = useRef(false);
  useEffect(
    () =>
      store.subscribeGoals((next) => {
        setGoals(next);
        setIngress(store.getGoalIngressStatus());
      }),
    [store],
  );
  const selected = goals.find((goal) => goal.id === selectedId);
  useEffect(() => {
    if (selectedId && !selected) {
      request.current++;
      setSelectedId("");
      setResult(null);
      setDetail(null);
    }
  }, [selected, selectedId]);
  useEffect(() => {
    if (!selected) {
      setResult(null);
      setLoading(false);
      return;
    }
    const id = ++request.current;
    setLoading(true);
    setError(false);
    setResult(null);
    setDetail(null);
    void store
      .getGoalActivity({
        policy: GOAL_ACTIVITY_POLICY_V1,
        goalId: selected.id,
        startUserDayDate: range.start,
        endUserDayDate: range.end,
        evaluationAsOf,
      })
      .then(
        (next) => {
          if (request.current === id) {
            setResult(next);
            setLoading(false);
          }
        },
        () => {
          if (request.current === id) {
            setError(true);
            setLoading(false);
          }
        },
      );
  }, [evaluationAsOf, range.end, range.start, selected?.id, selected?.revision, store]);
  useEffect(() => {
    if (detail && focusDetail.current) detailRef.current?.focus();
    focusDetail.current = false;
  }, [detail]);
  function activate(next: Exclude<Detail, null>, event: MouseEvent<HTMLButtonElement>) {
    focusDetail.current = event.detail === 0;
    setDetail(detail?.kind === next.kind && detail.category === next.category ? null : next);
  }
  return (
    <section
      aria-labelledby="goal-activity-heading"
      className="df-history-evidence-card df-goal-activity"
    >
      <p className="df-workflow-eyebrow">Goals</p>
      <h3 className="df-group-title" id="goal-activity-heading">
        Selected Goal
      </h3>
      <p className="df-muted">
        Choose one Goal to inspect measured Progress and the separate historical Activity linked to
        it.
      </p>
      {ingress.status === "initializing" ? <p role="status">Loading Goals…</p> : null}
      {ingress.status === "protected" ? (
        <p className="df-danger-message" role="alert">
          Goals are unavailable until stored Goal data can be recovered safely.
        </p>
      ) : null}
      {ingress.status === "accepted" && goals.length === 0 ? (
        <>
          <p className="df-empty">No Goals yet. Goals can be created in Planner.</p>
          {onOpenPlanner ? (
            <button className="df-secondary-button" onClick={onOpenPlanner} type="button">
              Open Planner
            </button>
          ) : null}
        </>
      ) : null}
      {ingress.status === "accepted" && goals.length > 0 ? (
        <label className="df-field df-goal-activity-selector">
          Goal
          <select
            value={selectedId}
            onChange={(event) => {
              request.current++;
              setSelectedId(event.target.value);
              setResult(null);
              setDetail(null);
            }}
          >
            <option value="">Choose a Goal</option>
            {lifecycle.map((group) => {
              const items = goals.filter((goal) => goal.status === group.value).sort(goalOrder);
              return items.length ? (
                <optgroup key={group.value} label={group.label}>
                  {items.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </optgroup>
              ) : null;
            })}
          </select>
        </label>
      ) : null}
      {selected ? (
        <div className="df-goal-activity-context">
          <h4 className="df-group-title">{selected.title}</h4>
          <p>{statusLabel(selected.status)}</p>
          {selected.description ? <p>{selected.description}</p> : null}
          {selected.targetDate ? <p>Target date: {selected.targetDate}</p> : null}
        </div>
      ) : null}
      {selected ? (
        <GoalProgressSummary
          evaluationAsOf={evaluationAsOf}
          goal={selected}
          {...(onOpenPlanner ? { onOpenPlanner } : {})}
          store={store}
        />
      ) : null}
      {selected ? (
        <>
          <h4 className="df-group-title">Activity</h4>
          <p className="df-muted">
            Progress reflects recorded measurement toward this Goal's quantity target. Activity
            reflects historical work linked to the Goal.
          </p>
        </>
      ) : null}
      {loading ? (
        <p aria-live="polite" role="status">
          Loading Goal Activity…
        </p>
      ) : null}
      {error ? (
        <p className="df-danger-message" role="alert">
          Goal Activity could not be loaded. Refresh the history view to try again.
        </p>
      ) : null}
      {!loading && result?.status === "invalidQuery" ? (
        <p className="df-danger-message" role="alert">
          Goal Activity is unavailable for this date range.
        </p>
      ) : null}
      {!loading && result?.status === "unavailable" && "reason" in result ? (
        <Unavailable reason={result.reason} />
      ) : null}
      {!loading &&
      result &&
      result.status !== "invalidQuery" &&
      !(result.status === "unavailable" && "reason" in result) ? (
        <Activity
          value={result as Available}
          detail={detail}
          activate={activate}
          detailRef={detailRef}
        />
      ) : null}
    </section>
  );
}

function Activity({
  value,
  detail,
  activate,
  detailRef,
}: {
  value: Available;
  detail: Detail;
  activate: (next: Exclude<Detail, null>, event: MouseEvent<HTMLButtonElement>) => void;
  detailRef: { current: HTMLDivElement | null };
}) {
  const frozenTitles = [
    ...new Set(
      value.provenance.linked
        .map((item) => item.frozenGoal.title)
        .filter((title) => title !== value.goalContext.title),
    ),
  ];
  const evidence =
    detail?.kind === "planning"
      ? value.provenance.linked.filter((item) => item.plan.state === detail.category)
      : detail?.kind === "execution"
        ? value.provenance.linked.filter(
            (item) => item.execution?.classification === detail.category,
          )
        : [];
  const plan = value.planCoverage;
  const links = value.goalLinkCoverage;
  const reports = value.reportingCoverage;
  return (
    <div className="df-goal-activity-result">
      {frozenTitles.map((title) => (
        <p className="df-muted" key={title}>
          Goal at the time: {title}
        </p>
      ))}
      <div aria-label="Goal Activity coverage" className="df-goal-coverage">
        <CoverageRow
          label="Plan coverage"
          text={
            plan.status === "complete"
              ? `${plan.publishedDayCount} of ${plan.expectedDayCount} days available`
              : plan.status === "incompleteCoverage"
                ? `${plan.publishedDayCount} of ${plan.expectedDayCount} days available; ${plan.missingDayCount} missing`
                : "Unavailable"
          }
        />
        <CoverageRow
          label="Goal-link coverage"
          text={
            links.status === "complete"
              ? `${links.availableOccurrenceCount} eligible occurrences captured`
              : links.status === "incompleteCoverage"
                ? `${links.availableOccurrenceCount} captured; ${links.unavailableLegacyOccurrenceCount} legacy unavailable`
                : "Unavailable — Goal relationships were not recorded for this period"
          }
        />
        <CoverageRow
          label="Reporting coverage"
          text={
            reports.status === "notApplicable"
              ? "Not applicable — no Goal-linked work reached the schedule in this range."
              : reports.status === "unavailable"
                ? "Unavailable"
                : `${reports.reportedCount} of ${reports.eligibleCount} linked scheduled occurrences reported`
          }
        />
      </div>
      {plan.publishedEmptyDayCount ? (
        <p className="df-muted">
          {plan.publishedEmptyDayCount} covered{" "}
          {plan.publishedEmptyDayCount === 1 ? "day has" : "days have"} no planned occurrences.
        </p>
      ) : null}
      {links.status === "incompleteCoverage" ? (
        <p className="df-warning-message">
          Some history predates Goal-link tracking, so Goal relationships are unavailable for those
          records.
        </p>
      ) : null}
      {links.status === "unavailable" ? (
        <p className="df-warning-message">Goal relationships were not recorded for this period.</p>
      ) : null}
      {value.advisories.includes("noLinkedActivity") ? (
        <p className="df-empty">No Goal-linked activity was recorded in this range.</p>
      ) : null}
      <Distribution
        heading="Planning"
        description="How intended work linked to this Goal appeared in the historical plan."
        denominator={`Linked intended occurrences: ${value.planningDistribution.linkedIntendedOccurrenceCount}`}
        unavailable={value.planningDistribution.status === "unavailable"}
        items={planning.map((item) => ({ ...item, count: value.planningDistribution[item.value] }))}
        detail={detail}
        kind="planning"
        activate={activate}
      />
      {value.executionDistribution.status === "unavailable" ? (
        <section>
          <h4 className="df-group-title">Execution</h4>
          <p className="df-danger-message" role="status">
            Planning activity is available, but reported outcomes cannot be interpreted right now.
          </p>
        </section>
      ) : (
        <Distribution
          heading="Execution"
          description="What was reported for Goal-linked work that reached the schedule."
          denominator={`Linked scheduled occurrences: ${value.executionDistribution.linkedScheduledOccurrenceCount}`}
          unavailable={false}
          items={execution.map((item) => ({
            ...item,
            count: value.executionDistribution[item.value],
          }))}
          detail={detail}
          kind="execution"
          activate={activate}
        />
      )}
      {detail ? (
        <div aria-live="polite" id="goal-activity-category-details" ref={detailRef} tabIndex={-1}>
          <h5 className="df-group-title">{categoryLabel(detail)} evidence</h5>
          <p className="df-muted">{categoryExplanation(detail)}</p>
          {evidence.length ? (
            <ul className="df-history-detail-list">
              {evidence.map((item) => (
                <Evidence
                  currentGoalTitle={value.goalContext.title}
                  key={`${item.userDayDate}:${JSON.stringify(item.reference)}`}
                  value={item}
                />
              ))}
            </ul>
          ) : (
            <p className="df-empty">No occurrences in this category.</p>
          )}
        </div>
      ) : null}
      {value.provenance.coverage.length ? (
        <details>
          <summary>Goal-link coverage details ({value.provenance.coverage.length})</summary>
          <ul className="df-history-detail-list">
            {value.provenance.coverage.map((item) => (
              <li key={`${item.reason}:${item.userDayDate}:${JSON.stringify(item.reference)}`}>
                <strong>{item.title}</strong>
                <span>
                  {item.userDayDate} · {item.category}
                </span>
                <span>
                  {item.reason === "knownUnlinked"
                    ? "Goal relationships were captured; this occurrence was not linked to the selected Goal."
                    : "Goal relationships are unavailable for this legacy occurrence."}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      <p className="df-muted">
        An occurrence can support more than one Goal; Goal Activity does not allocate work
        exclusively between Goals.
      </p>
    </div>
  );
}
function Distribution({
  heading,
  description,
  denominator,
  unavailable,
  items,
  detail,
  kind,
  activate,
}: {
  heading: string;
  description: string;
  denominator: string;
  unavailable: boolean;
  items: { value: PlanningCategory | ExecutionCategory; label: string; count: number }[];
  detail: Detail;
  kind: "planning" | "execution";
  activate: (next: Exclude<Detail, null>, event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <section>
      <h4 className="df-group-title">{heading}</h4>
      <p className="df-muted">{description}</p>
      {unavailable ? (
        <p className="df-empty">Unavailable</p>
      ) : (
        <>
          <p>{denominator}</p>
          <div
            aria-label={`${heading} Goal Activity counts`}
            className="df-history-distribution"
            role="group"
          >
            {items.map((item) => {
              const next = { kind, category: item.value } as Exclude<Detail, null>;
              return (
                <button
                  aria-controls="goal-activity-category-details"
                  aria-expanded={detail?.kind === kind && detail.category === item.value}
                  aria-label={`${item.label}: ${item.count}`}
                  className={`df-history-category df-history-category--${item.value}`}
                  key={item.value}
                  onClick={(event) => activate(next, event)}
                  type="button"
                >
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
function Evidence({
  value,
  currentGoalTitle,
}: {
  value: GoalActivityLinkedProvenanceV1;
  currentGoalTitle: string;
}) {
  const time =
    value.plan.state === "scheduled"
      ? ` · ${formatHumanTimeRange(new Date(value.plan.startsAt), new Date(value.plan.endsAt))}`
      : "";
  return (
    <li>
      <strong>{value.title}</strong>
      <span>
        {value.userDayDate}
        {time}
      </span>
      <span>
        {value.category} ·{" "}
        {value.sourceFamily === "manualEvent" ? "manual event" : value.sourceFamily}
      </span>
      {value.frozenGoal.title !== currentGoalTitle ? (
        <span>Goal at the time: {value.frozenGoal.title}</span>
      ) : null}
    </li>
  );
}
function CoverageRow({ label, text }: { label: string; text: string }) {
  return (
    <p>
      <strong>{label}</strong>
      <span>{text}</span>
    </p>
  );
}
function Unavailable({
  reason,
}: {
  reason:
    | "goalProtected"
    | "goalUnavailable"
    | "goalNotFound"
    | "historicalPlanProtected"
    | "historicalPlanUnavailable";
}) {
  const copy =
    reason === "goalProtected" || reason === "goalUnavailable"
      ? "Goals are unavailable until stored Goal data can be recovered safely."
      : reason === "goalNotFound"
        ? "The selected Goal is no longer available."
        : "Goal Activity is unavailable until stored plan history can be recovered safely.";
  return (
    <p className="df-danger-message" role="alert">
      {copy}
    </p>
  );
}
function goalOrder(a: GoalV1, b: GoalV1) {
  return a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
}
function statusLabel(value: GoalStatus) {
  return value === "active" ? "Active" : value === "completed" ? "Completed" : "Archived";
}
function categoryLabel(value: Exclude<Detail, null>) {
  return (
    [...planning, ...execution].find((item) => item.value === value.category)?.label ??
    value.category
  );
}
function categoryExplanation(value: Exclude<Detail, null>) {
  if (value.kind === "planning") {
    if (value.category === "scheduled")
      return "Supporting work received a scheduled placement; this does not describe execution.";
    if (value.category === "unplaced")
      return "Supporting work remained without a scheduled placement.";
    return `The frozen historical planning disposition was ${value.category}; no reason is inferred.`;
  }
  if (value.category === "partial")
    return "These occurrences were reported partial; no fractional completion value is assigned.";
  if (value.category === "skipped")
    return "These occurrences were reported skipped; no reason or Goal failure is inferred.";
  if (value.category === "completed")
    return "These occurrences have a completed report; this does not mean the Goal is complete.";
  if (value.category === "unknown")
    return "A prior observation was withdrawn, so the current outcome is unknown.";
  return "No current execution report exists for these scheduled occurrences.";
}
