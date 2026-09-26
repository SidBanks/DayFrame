import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { GoalV1 } from "../core/goals/goal.js";
import type { LocalDateString } from "../core/shifts/types.js";
import { GOAL_ACTIVITY_POLICY_V1 } from "../core/historicalIntelligence/goalActivity.js";
import type { GoalActivityQueryResultV1 } from "../state/historicalIntelligenceQuery.js";
import type { DayFrameStore } from "../state/types.js";
import type { GoalEditingContext } from "./goalEditingContext.js";
import { useGoalEditingState } from "./useGoalEditingState.js";
import { presentationOwner } from "./useGoalPresentationState.js";
import { Activity, Unavailable, type Available, type Detail } from "./GoalActivitySummary.js";
import { GoalProgressSummary } from "./GoalProgressSummary.js";

type Store = Pick<
  DayFrameStore,
  | "getGoalActivity"
  | "queryGoalProgress"
  | "listMeasurementDefinitionHistory"
  | "subscribeGoals"
  | "subscribeMeasurementDefinitions"
  | "subscribeProgressObservations"
  | "subscribeHistory"
  | "subscribeStatus"
  | "subscribeExecutionHistory"
  | "subscribeExecutionHistoryIngress"
  | "getStatus"
  | "getGoalIngressStatus"
>;
type Range = { start: string; end: string };
type State = Range & {
  open: boolean;
  draftStart: string;
  draftEnd: string;
  error: string;
  cutoff: string;
  detail: Detail;
  rows: number;
  coverage: number;
  coverageOpen: boolean;
  provenance: boolean;
  missing: number;
  missingOpen: boolean;
  returnFocus: boolean;
  reporting: boolean;
};
export function validActivityRange(start: string, end: string) {
  const valid = (s: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(s) &&
    Number.isFinite(Date.parse(s + "T00:00:00Z")) &&
    new Date(s + "T00:00:00Z").toISOString().slice(0, 10) === s;
  return (
    valid(start) &&
    valid(end) &&
    start <= end &&
    (Date.parse(end) - Date.parse(start)) / 86400000 < 366
  );
}
function month(day: string): Range {
  const start = day.slice(0, 7) + "-01";
  const date = new Date(start + "T00:00:00Z");
  date.setUTCMonth(date.getUTCMonth() + 1, 0);
  return { start, end: date.toISOString().slice(0, 10) };
}
export function GoalRecordedInspection({
  goal,
  store,
  context,
  currentDay,
  now,
  onDay,
  navigationRange,
  onNavigationConsumed,
}: {
  goal: GoalV1;
  store: Store;
  context: GoalEditingContext;
  currentDay: string | ((instant: Date) => string);
  now: () => Date;
  onDay: (day: string) => void;
  navigationRange?: Range;
  onNavigationConsumed?: () => void;
}) {
  const [c, update, get] = useGoalEditingState<State>(
    context,
    `recorded:${presentationOwner(store)}:${goal.id}`,
    () => {
      const range =
        navigationRange && validActivityRange(navigationRange.start, navigationRange.end)
          ? navigationRange
          : typeof currentDay === "string"
            ? month(currentDay)
            : { start: "", end: "" };
      return {
        ...range,
        draftStart: range.start,
        draftEnd: range.end,
        open: false,
        error: "",
        cutoff: "",
        detail: null,
        rows: 10,
        coverage: 10,
        coverageOpen: false,
        provenance: false,
        missing: 10,
        missingOpen: false,
        returnFocus: false,
        reporting: false,
      };
    },
  );
  useEffect(() => {
    if (!navigationRange) return;
    if (validActivityRange(navigationRange.start, navigationRange.end))
      update({
        ...navigationRange,
        draftStart: navigationRange.start,
        draftEnd: navigationRange.end,
        detail: null,
        rows: 10,
        coverage: 10,
      });
    onNavigationConsumed?.();
  }, [navigationRange]);
  const [revision, setRevision] = useState(0);
  const generation = useRef(0),
    nowRef = useRef(now),
    heading = useRef<HTMLHeadingElement>(null),
    detailRef = useRef<HTMLDivElement>(null);
  nowRef.current = now;
  const uid = useId();
  const [view, setView] = useState<{
    key: string;
    store: Store;
    context: GoalEditingContext;
    value?: GoalActivityQueryResultV1;
    error?: boolean;
  }>();
  const key = `${goal.id}|${c.start}|${c.end}|${c.cutoff}|${revision}|${c.open}`;
  // Re-entry is an explicit inspection refresh; subscriptions below retain the cutoff.
  useEffect(() => {
    if (get().open) update({ cutoff: nowRef.current().toISOString() });
    return () => {
      generation.current++;
    };
  }, [goal.id, store, context]);
  useEffect(() => {
    const invalidate = () => {
      generation.current++;
      setRevision((v) => v + 1);
    };
    const stops = [
      store.subscribeGoals(invalidate),
      store.subscribeMeasurementDefinitions(invalidate),
      store.subscribeProgressObservations(invalidate),
      store.subscribeHistory(invalidate),
      store.subscribeStatus(invalidate),
      store.subscribeExecutionHistory(invalidate),
      store.subscribeExecutionHistoryIngress(invalidate),
    ];
    return () => stops.forEach((stop) => stop());
  }, [store]);
  useEffect(() => {
    if (!c.open || !c.cutoff || !context.isValid()) return;
    const request = ++generation.current;
    let active = true;
    void Promise.resolve()
      .then(() =>
        store.getGoalActivity({
          policy: GOAL_ACTIVITY_POLICY_V1,
          goalId: goal.id,
          startUserDayDate: c.start as LocalDateString,
          endUserDayDate: c.end as LocalDateString,
          evaluationAsOf: c.cutoff,
        }),
      )
      .then(
        (value) => {
          if (active && request === generation.current && context.isValid())
            setView({ key, store, context, value });
        },
        () => {
          if (active && request === generation.current && context.isValid())
            setView({ key, store, context, error: true });
        },
      );
    return () => {
      active = false;
    };
  }, [key, store, context]);
  useEffect(() => {
    if (c.open && c.returnFocus && view?.key === key) {
      heading.current?.focus();
      update({ returnFocus: false });
    }
  }, [c.open, c.returnFocus, key, view]);
  const disclosure = useMemo(
    () => ({ open: c.provenance, setOpen: (provenance: boolean) => update({ provenance }) }),
    [c.provenance, update],
  );
  function refresh() {
    generation.current++;
    update({ cutoff: nowRef.current().toISOString(), returnFocus: true, reporting: false });
    setRevision((v) => v + 1);
  }
  function handoff(kind: "measurement" | "reporting") {
    update({ reporting: true });
    document.getElementById(`${kind}-${goal.id}`)?.focus();
    document.getElementById(`${kind}-${goal.id}`)?.scrollIntoView?.({ block: "center" });
  }
  const current =
    view?.key === key && view.store === store && view.context === context && context.isValid()
      ? view
      : undefined;
  const ingress = store.getGoalIngressStatus(),
    planStatus = store.getStatus();
  const value = current?.value;
  const available =
    value &&
    value.status !== "invalidQuery" &&
    !(value.status === "unavailable" && "reason" in value)
      ? (value as Available)
      : undefined;
  return (
    <section
      className="df-panel df-recorded-inspection"
      aria-label="Recorded Progress and Activity"
    >
      <h3 ref={heading} tabIndex={-1}>
        Recorded Progress and Activity
      </h3>
      <p>Recorded measurement and linked historical work are independent evidence.</p>
      <button
        type="button"
        aria-expanded={c.open}
        onClick={() => {
          if (c.open) update({ open: false });
          else {
            const instant = nowRef.current();
            const range = c.start
              ? { start: c.start, end: c.end }
              : month(typeof currentDay === "function" ? currentDay(instant) : currentDay);
            update({
              ...range,
              draftStart: c.start ? c.draftStart : range.start,
              draftEnd: c.start ? c.draftEnd : range.end,
              open: true,
              cutoff: instant.toISOString(),
              returnFocus: true,
            });
          }
        }}
      >
        {c.open ? "Close recorded inspection" : "Inspect recorded Progress and Activity"}
      </button>
      {c.open && (
        <>
          <p>
            Knowledge cutoff: <time dateTime={c.cutoff}>{c.cutoff}</time>. Not continuously live;
            later records may require Refresh. This shared cutoff does not guarantee an atomic
            cross-authority snapshot.
          </p>
          <button type="button" onClick={refresh}>
            Refresh recorded evidence
          </button>
          <GoalProgressSummary
            goal={goal}
            store={store}
            evaluationAsOf={c.cutoff}
            disclosure={disclosure}
            refreshKey={revision}
            showIdentity
          />
          <div className="df-screen-actions">
            <button type="button" onClick={() => handoff("measurement")}>
              Open Measurement controls
            </button>
            <button type="button" onClick={() => handoff("reporting")}>
              Open value reporting and correction history
            </button>
            {c.reporting && (
              <button type="button" onClick={refresh}>
                Return to recorded inspection
              </button>
            )}
          </div>
          <p>
            Reporting history shows current lineage heads, independently of this cutoff. Existing
            controls decide whether recording, correction or retraction is permitted; navigation
            saves nothing.
          </p>
          <h4>Goal Activity</h4>
          <p>
            Published work with this Goal's frozen identity in the inclusive User Day period below,
            known at the cutoff. Current links, names and Structure do not rewrite membership.
            Published productive work, support and protection entries are included when they carry
            that identity. Counts do not imply reportability. Unpublished and unrealized work is not
            a complete activity ledger.
          </p>
          <button
            type="button"
            onClick={() => {
              const section =
                heading.current
                  ?.closest(".df-goals-section")
                  ?.querySelector(".df-goal-inspection") ??
                document.querySelector(".df-goal-inspection");
              const button = Array.from(section?.querySelectorAll("button") ?? []).find(
                (b) => b.textContent === "Inspect accepted planning",
              );
              button?.click();
              section?.querySelector<HTMLElement>("h3")?.focus();
            }}
          >
            Open accepted planning and scheduled work
          </button>
          <form
            className="df-form-stack"
            aria-label="Activity period"
            aria-describedby={c.error ? uid : undefined}
            onSubmit={(event) => {
              event.preventDefault();
              if (!validActivityRange(c.draftStart, c.draftEnd)) {
                update({
                  error:
                    "Choose 1–366 inclusive User Days in date order. The applied period is unchanged.",
                });
                return;
              }
              update({
                start: c.draftStart,
                end: c.draftEnd,
                error: "",
                cutoff: nowRef.current().toISOString(),
                detail: null,
                rows: 10,
                coverage: 10,
                missing: 10,
              });
              setRevision((v) => v + 1);
            }}
          >
            <label>
              Activity start User Day
              <input
                type="date"
                value={c.draftStart}
                onChange={(e) => update({ draftStart: e.target.value })}
              />
            </label>
            <label>
              Activity end User Day (inclusive)
              <input
                type="date"
                value={c.draftEnd}
                onChange={(e) => update({ draftEnd: e.target.value })}
              />
            </label>
            <button type="submit">Apply Activity period</button>
            {c.error && (
              <p id={uid} role="alert">
                {c.error}
              </p>
            )}
          </form>
          <p>
            Applied Activity period: {c.start} through {c.end}, inclusive. This does not filter
            Progress observations or change their target.
          </p>
          {ingress.status !== "accepted" ? (
            <Unavailable reason="goalProtected" />
          ) : planStatus.status === "protected" ? (
            <Unavailable reason="historicalPlanProtected" />
          ) : (
            <>
              {!current && <p role="status">Loading Goal Activity…</p>}
              {current?.error && (
                <p role="alert">
                  Goal Activity could not be loaded. Progress remains independent. Use Refresh to
                  try again.
                </p>
              )}
              {value?.status === "invalidQuery" && (
                <p role="alert">Activity is unavailable for this query.</p>
              )}
              {value?.status === "unavailable" && "reason" in value && (
                <Unavailable reason={value.reason} />
              )}
              {available && (
                <>
                  <p>
                    Policy: {available.policy.id}@{available.policy.version}. Counts describe this
                    published population, not all work performed.
                  </p>
                  <Activity
                    value={available}
                    detail={c.detail}
                    detailRef={detailRef}
                    activate={(next, event) => {
                      update({
                        detail:
                          c.detail?.kind === next.kind && c.detail.category === next.category
                            ? null
                            : next,
                        rows: 10,
                      });
                      if (event.detail === 0)
                        requestAnimationFrame(() => detailRef.current?.focus());
                    }}
                    bounds={{
                      rows: c.rows,
                      coverage: c.coverage,
                      coverageOpen: c.coverageOpen,
                      moreRows: () => update({ rows: c.rows + 10 }),
                      moreCoverage: () => update({ coverage: c.coverage + 10 }),
                      setCoverageOpen: (coverageOpen) => update({ coverageOpen }),
                    }}
                    onDay={(day) => {
                      update({ returnFocus: true });
                      onDay(day);
                    }}
                  />
                  {available.provenance.missingPlanUserDayDates.length > 0 && (
                    <details
                      open={c.missingOpen}
                      onToggle={(event) => {
                        if (event.currentTarget.open !== c.missingOpen)
                          update({ missingOpen: event.currentTarget.open });
                      }}
                    >
                      <summary>
                        Missing plan days ({available.provenance.missingPlanUserDayDates.length})
                      </summary>
                      <ul>
                        {available.provenance.missingPlanUserDayDates
                          .slice(0, c.missing)
                          .map((day) => (
                            <li key={day}>{day}</li>
                          ))}
                      </ul>
                      {available.provenance.missingPlanUserDayDates.length > c.missing && (
                        <button type="button" onClick={() => update({ missing: c.missing + 10 })}>
                          Show more missing days
                        </button>
                      )}
                    </details>
                  )}
                </>
              )}
            </>
          )}
          <p>
            Opening an Activity day shows the current Daily Planner. Later publication or correction
            may differ from this retained evidence. A day link does not promise a historical
            reporting target; unplaced or omitted work gains no reporting action here.
          </p>
        </>
      )}
    </section>
  );
}
