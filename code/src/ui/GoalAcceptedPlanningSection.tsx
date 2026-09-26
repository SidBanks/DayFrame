import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { addUserDayLabels } from "../core/time/canonicalUserDay.js";
import { validOwnerDay } from "../core/productEvidence/evidence.js";
import type { LocalDateString } from "../core/shifts/types.js";
import type { DayFrameStore } from "../state/types.js";
import type { GoalEditingContext } from "./goalEditingContext.js";
import { useGoalEditingState } from "./useGoalEditingState.js";
import {
  goalInspectionNavigation,
  type GoalInspectionRange,
} from "./goalAcceptedPlanningContext.js";
import { AcceptedPlanningCoverage } from "./AcceptedPlanningCoverage.js";
import {
  acceptedMinutes,
  effort,
  factOutcome,
  iterationFacts,
  publicationLabel,
  type AcceptedSummaryResult,
  type AcceptedSummaryEvidence,
  type AcceptedSummaryFact,
} from "./acceptedPlanningSummaryPresentation.js";

type InspectorState = GoalInspectionRange & {
  open: boolean;
  draftStart: string;
  draftEnd: string;
  validation: string;
  iteration: string | null;
  fact: string | null;
  iterationLimit: number;
  factLimit: number;
  publicationLimit: number;
  publications: string[];
  references: string[];
  returnFocus: boolean;
};
export type GoalAcceptedPlanningProps = {
  goalId: string;
  currentDay: string;
  context: GoalEditingContext;
  query: DayFrameStore["queryAcceptedPlanningEvidence"];
  now: () => Date;
  store: Pick<
    DayFrameStore,
    | "subscribeGoals"
    | "subscribeGoalPlanning"
    | "subscribeProposals"
    | "subscribeExecutionHistory"
    | "subscribeExecutionHistoryIngress"
    | "subscribeHistory"
  >;
  onDay: (owner: string) => void;
  onReview: () => void;
};
function validRange(start: string, end: string) {
  return (
    validOwnerDay(start) &&
    validOwnerDay(end) &&
    start <= end &&
    (Date.parse(end + "T00:00:00Z") - Date.parse(start + "T00:00:00Z")) / 86400000 < 366
  );
}
function initial(currentDay: string): InspectorState {
  const start = currentDay.slice(0, 7) + "-01";
  const next = addUserDayLabels(start as LocalDateString, 32).slice(0, 7) + "-01";
  const end = addUserDayLabels(next as LocalDateString, -1);
  return {
    start,
    end,
    draftStart: start,
    draftEnd: end,
    open: false,
    validation: "",
    iteration: null,
    fact: null,
    iterationLimit: 10,
    factLimit: 10,
    publicationLimit: 10,
    publications: [],
    references: [],
    returnFocus: false,
  };
}
export function GoalAcceptedPlanningSection(props: GoalAcceptedPlanningProps) {
  const { goalId, context, query, store } = props;
  const [c, update] = useGoalEditingState(context, `accepted-inspection:${goalId}`, () =>
    initial(props.currentDay),
  );
  // Consume return intent only on a new mount, never in the outgoing surface.
  const returning = useRef(c.returnFocus);
  const navigation = goalInspectionNavigation(context, goalId);
  const incomingRange = navigation.get().range;
  const uid = useId(),
    heading = useRef<HTMLHeadingElement>(null);
  const [refresh, setRefresh] = useState(0);
  const sourceVersion = useRef(0);
  const generation = useRef(0),
    nowRef = useRef(props.now);
  nowRef.current = props.now;
  const [view, setView] = useState<{
    key: string;
    query: typeof query;
    context: GoalEditingContext;
    store: typeof store;
    asOf: string;
    result?: AcceptedSummaryResult;
    failed?: boolean;
    stale?: boolean;
  }>();
  const key = `${goalId}|${c.start}|${c.end}|${refresh}|${c.open}`;
  useEffect(() => {
    const range = navigation.get().range;
    if (range) {
      if (validRange(range.start, range.end))
        update({
          ...range,
          draftStart: range.start,
          draftEnd: range.end,
          open: true,
          iteration: null,
          fact: null,
          validation: "",
        });
      else
        update({ validation: "The linked period is invalid. Choose a period from 1 to 366 days." });
      navigation.update({ range: null });
    }
  }, [goalId, context, navigation, update]);
  useEffect(() => {
    const id = ++generation.current;
    if (!c.open || !context.isValid() || incomingRange) return;
    const asOf = nowRef.current().toISOString();
    const version = sourceVersion.current;
    const base = { key, query, context, store, asOf };
    setView(base);
    if (!validRange(c.start, c.end)) {
      setView({ ...base, failed: true });
      return;
    }
    void Promise.resolve()
      .then(() =>
        query({
          select: { kind: "goal", id: goalId },
          startUserDayDate: c.start,
          endUserDayDateExclusive: addUserDayLabels(c.end as LocalDateString, 1),
          asOf,
        }),
      )
      .then(
        (result) => {
          if (id === generation.current && context.isValid())
            setView({ ...base, result, stale: version !== sourceVersion.current });
        },
        () => {
          if (id === generation.current && context.isValid()) setView({ ...base, failed: true });
        },
      );
    return () => {
      generation.current++;
    };
  }, [key, goalId, c.start, c.end, c.open, refresh, query, context, incomingRange, store]);
  useEffect(() => {
    const stale = () => {
      sourceVersion.current++;
      setView((v) => (v ? { ...v, stale: true } : v));
    };
    const stops = [
      store.subscribeGoals(stale),
      store.subscribeGoalPlanning(stale),
      store.subscribeProposals(stale),
      store.subscribeExecutionHistory(stale),
      store.subscribeExecutionHistoryIngress(stale),
      store.subscribeHistory(stale),
    ];
    return () => stops.forEach((stop) => stop());
  }, [store]);
  const current =
    view?.key === key &&
    view.query === query &&
    view.context === context &&
    view.store === store &&
    context.isValid()
      ? view
      : undefined;
  const result = current?.result;
  const evidence = result?.status === "projected" ? result : undefined;
  useEffect(() => {
    if (returning.current && c.returnFocus && c.open && (result || current?.failed)) {
      returning.current = false;
      heading.current?.focus();
      update({ returnFocus: false });
    }
  }, [c.returnFocus, c.open, update, result, current?.failed]);
  function apply(event: FormEvent) {
    event.preventDefault();
    if (!validRange(c.draftStart, c.draftEnd)) {
      update({
        validation: "Choose a period from 1 to 366 days. The inspected period has not changed.",
      });
      return;
    }
    update({
      start: c.draftStart,
      end: c.draftEnd,
      validation: "",
      iteration: null,
      fact: null,
      iterationLimit: 10,
      factLimit: 10,
      publicationLimit: 10,
      publications: [],
      references: [],
    });
  }
  const toggle = (field: "references" | "publications", id: string) =>
    update({
      [field]: c[field].includes(id) ? c[field].filter((v) => v !== id) : [...c[field], id],
    });
  return (
    <section
      className="df-panel df-accepted-summary df-goal-inspection"
      aria-labelledby={uid + "-heading"}
    >
      <h3 id={uid + "-heading"} ref={heading} tabIndex={-1}>
        Accepted planning and scheduled work
      </h3>
      <p>
        Work from accepted planning for this Goal and period. This is saved evidence, independent of
        unsaved edits, and is not a complete Goal activity history.
      </p>
      <button
        type="button"
        className="df-secondary-button"
        aria-expanded={c.open}
        onClick={() => update({ open: !c.open })}
      >
        {c.open ? "Close accepted planning" : "Inspect accepted planning"}
      </button>
      {c.open && (
        <>
          <form className="df-accepted-range" onSubmit={apply}>
            <label>
              Period start
              <input
                aria-label="Goal inspection start date"
                type="date"
                required
                value={c.draftStart}
                aria-invalid={!!c.validation}
                aria-describedby={c.validation ? uid + "-error" : undefined}
                onChange={(e) => update({ draftStart: e.target.value })}
              />
            </label>
            <label>
              Period end (inclusive)
              <input
                aria-label="Goal inspection end date"
                type="date"
                required
                value={c.draftEnd}
                aria-invalid={!!c.validation}
                aria-describedby={c.validation ? uid + "-error" : undefined}
                onChange={(e) => update({ draftEnd: e.target.value })}
              />
            </label>
            <button className="df-secondary-button" type="submit">
              Apply inspection period
            </button>
          </form>
          {c.validation && (
            <p id={uid + "-error"} role="alert">
              {c.validation}
            </p>
          )}
          <p>
            Inspected period: {c.start} through {c.end}, inclusive. Other planning and Calendar
            ranges are unchanged.
          </p>
          <button
            type="button"
            className="df-secondary-button"
            onClick={() => setRefresh((n) => n + 1)}
          >
            Refresh Goal evidence
          </button>
          <p>This is an as-of snapshot, not live synchronization. Refresh to check for changes.</p>
          {current && (
            <p>
              Evidence as of <time dateTime={current.asOf}>{stamp(current.asOf)}</time>.
            </p>
          )}
          {current?.stale && (
            <p role="status">
              Relevant data changed. Refresh Goal evidence before relying on this snapshot.
            </p>
          )}
          {!result && !current?.failed && <p role="status">Loading Goal evidence…</p>}
          {(current?.failed || result?.status === "error") && (
            <p role="alert">
              Goal evidence could not be loaded. Try Refresh Goal evidence. This is not an
              empty-period result.
            </p>
          )}
          {result?.status === "invalidQuery" && (
            <p role="alert">
              This inspection period could not be queried. Check the dates and Refresh Goal
              evidence.
            </p>
          )}
          {evidence && (
            <GoalEvidence
              evidence={evidence}
              goalId={goalId}
              c={c}
              update={update}
              toggle={toggle}
              onDay={(owner) => {
                update({ returnFocus: true });
                props.onDay(owner);
              }}
            />
          )}
          <button
            type="button"
            className="df-secondary-button"
            onClick={() => {
              update({ returnFocus: true });
              props.onReview();
            }}
          >
            Review Schedule
          </button>
          <p>
            Accepted time, scheduled time, and reported Actual are separate. Measured Progress is
            not inferred.
          </p>
        </>
      )}
    </section>
  );
}
function stamp(value: string) {
  return value.replace("T", " ").replace(/\.\d+Z$/, " UTC");
}
const role = (f: AcceptedSummaryFact) =>
  f.role === "productiveGoalWork"
    ? "Goal work"
    : f.role === "supportActivity"
      ? "Support activity"
      : "Protected time · not an activity";
type EvidenceProps = {
  evidence: AcceptedSummaryEvidence;
  goalId: string;
  c: InspectorState;
  update: (patch: Partial<InspectorState>) => void;
  toggle: (field: "references" | "publications", id: string) => void;
  onDay: (owner: string) => void;
};
function GoalEvidence(props: EvidenceProps) {
  const { evidence: e, goalId, c, update, toggle } = props;
  const iterations =
    e.iterations.status === "available"
      ? [...e.iterations.value].sort(
          (a, b) =>
            a.accepted.acceptedAt.localeCompare(b.accepted.acceptedAt) ||
            a.accepted.id.localeCompare(b.accepted.id) ||
            a.accepted.revision - b.accepted.revision,
        )
      : [];
  const facts = e.facts.status === "available" ? e.facts.value : [];
  const retained = facts.filter(
    (f) =>
      !iterations.some(
        (i) =>
          i.accepted.id === f.origin.acceptedAllocationId &&
          i.accepted.revision === f.origin.acceptedAllocationRevision,
      ),
  );
  const current = e.currentSourceContext.find(
    (s) => s.reference.goalId === goalId && s.goal.status === "available",
  );
  return (
    <>
      <AcceptedPlanningCoverage evidence={e} />
      {current?.goal.status === "available" ? (
        <p>
          Current Goal name: {current.goal.value.title}. Historical names appear with their
          publications.
        </p>
      ) : (
        <p>
          This snapshot supplies no readable current Goal context. Readable historical evidence
          remains available below.
        </p>
      )}
      {e.completeness === "complete" && e.lookup === "notFoundInRange" ? (
        <p>
          No accepted planning was found in this period. This does not describe other periods or
          Goal completion.
        </p>
      ) : !iterations.length && !facts.length ? (
        <p>
          No readable records in this view. Unavailable evidence does not establish that no work
          exists.
        </p>
      ) : null}
      <p>
        {iterations.length} readable accepted iterations. Quantities below are scoped to this Goal's
        claims in the inspected period; they are not merged acceptances.
      </p>
      {e.facts.status === "available" && (
        <p>
          Readable scheduled-fact evidence in this period:{" "}
          {effort(
            facts
              .filter((f) => f.role === "productiveGoalWork")
              .reduce((s, f) => s + f.fact.durationMinutes, 0),
          )}{" "}
          productive;{" "}
          {effort(
            facts
              .filter((f) => f.role === "supportActivity")
              .reduce((s, f) => s + f.fact.durationMinutes, 0),
          )}{" "}
          support;{" "}
          {effort(
            facts
              .filter((f) => f.role === "bufferProtection")
              .reduce((s, f) => s + f.fact.durationMinutes, 0),
          )}{" "}
          protected time. Includes current or retained published facts;{" "}
          {e.facts.coverage === "partial"
            ? "coverage is incomplete, so these are readable quantities only"
            : "coverage of these sources is complete"}
          . These are not Actual or Progress totals.
        </p>
      )}
      <ul className="df-accepted-list">
        {iterations.slice(0, c.iterationLimit).map((i, index) => {
          const id = `${i.accepted.id}:${i.accepted.revision}`;
          const selected = c.iteration === id;
          const ownFacts = iterationFacts(e, i, goalId);
          return (
            <li className="df-accepted-iteration" key={id}>
              <h4>
                Accepted iteration {index + 1} · {effort(acceptedMinutes(e, i, goalId))} productive
                in period
              </h4>
              <p>Accepted {stamp(i.accepted.acceptedAt)}.</p>
              <p>
                {i.realizationState === "realized"
                  ? "Added to the Schedule"
                  : i.realizationState === "acceptedButUnrealized"
                    ? "Accepted but not yet added to the Schedule"
                    : "Scheduling evidence unavailable or unknown"}
              </p>
              {i.realizationState === "acceptedButUnrealized" && (
                <p>This accepted iteration does not reserve Calendar time.</p>
              )}
              {i.realizationState === "unknown" && (
                <p>
                  Scheduling may have happened;{" "}
                  {i.realization.status === "protected"
                    ? "its evidence is protected"
                    : "its evidence is unavailable"}
                  . This is not an unscheduled claim.
                </p>
              )}
              {i.accepted.footprintCompleteness === "legacyProductiveOnly" && (
                <p>Older planning has incomplete support/protection detail.</p>
              )}
              <button
                type="button"
                className="df-secondary-button"
                aria-expanded={selected}
                onClick={() =>
                  update({
                    iteration: selected ? null : id,
                    fact: null,
                    factLimit: 10,
                    publicationLimit: 10,
                  })
                }
              >
                {selected ? "Close" : "Inspect"} accepted iteration {index + 1}
              </button>
              {selected && (
                <div className="df-accepted-detail">
                  <p>
                    {ownFacts.length} readable scheduled facts in this period. Publication is
                    separate from scheduling.
                  </p>
                  <InspectionFacts {...props} facts={ownFacts} />
                  <details open={c.references.includes(id)}>
                    <summary
                      onClick={(e) => {
                        e.preventDefault();
                        toggle("references", id);
                      }}
                    >
                      Accepted planning references
                    </summary>
                    <p>
                      No replacement or revocation is inferred from later planning, Goal status, or
                      Proposal lifecycle.
                    </p>
                    <dl>
                      <dt>Accepted identity / revision</dt>
                      <dd>
                        {i.accepted.id} / {i.accepted.revision}
                      </dd>
                      <dt>Decision</dt>
                      <dd>
                        {i.accepted.decisionId} ({i.decision.status})
                      </dd>
                      <dt>Proposal / revision</dt>
                      <dd>
                        {i.accepted.proposalId} / {i.accepted.proposalRevision} ({i.proposal.status}
                        )
                      </dd>
                      <dt>Current Proposal lifecycle</dt>
                      <dd>{i.currentness.proposalLifecycle}</dd>
                      <dt>Realization</dt>
                      <dd>
                        {i.realization.status === "available"
                          ? i.realization.value.id
                          : i.realization.status}
                      </dd>
                    </dl>
                    {i.demands
                      .filter((d) => d.goalId === goalId)
                      .map((d) => (
                        <p key={`${d.demandId}:${d.demandRevision}`}>
                          Requested Time reference: {d.demandId} / revision {d.demandRevision}.
                        </p>
                      ))}
                  </details>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {iterations.length > c.iterationLimit && (
        <button
          type="button"
          className="df-secondary-button"
          onClick={() => update({ iterationLimit: c.iterationLimit + 10 })}
        >
          Show more accepted iterations
        </button>
      )}
      {retained.length > 0 && (
        <>
          <h4>Retained scheduled references</h4>
          <p>
            Full accepted planning is unavailable. These references do not reconstruct missing
            acceptances.
          </p>
          <InspectionFacts {...props} facts={retained} />
        </>
      )}
    </>
  );
}
function InspectionFacts(props: EvidenceProps & { facts: AcceptedSummaryFact[] }) {
  const { facts, c, update, toggle, onDay } = props;
  const ordered = [...facts].sort(
    (a, b) => a.fact.startsAt.localeCompare(b.fact.startsAt) || a.fact.id.localeCompare(b.fact.id),
  );
  return (
    <>
      <ul className="df-accepted-list">
        {ordered.slice(0, c.factLimit).map((f) => {
          const selected = c.fact === f.fact.id;
          return (
            <li className="df-accepted-fact" key={f.fact.id}>
              <h5>
                {role(f)} · {effort(f.fact.durationMinutes)}
              </h5>
              <p>
                User Day: {f.fact.userDayDate}.{" "}
                <time dateTime={f.fact.startsAt}>{stamp(f.fact.startsAt)}</time> –{" "}
                <time dateTime={f.fact.endsAt}>{stamp(f.fact.endsAt)}</time>.
              </p>
              <p>{publicationLabel(f)}</p>
              <p>{factOutcome(f)}</p>
              <p>
                {f.realization.status === "available"
                  ? "Realization record available."
                  : "Current realization is not verified; retained references may still be readable."}{" "}
                {f.verification === "retainedReferenceOnly"
                  ? "The full planning chain cannot currently be verified."
                  : "Exact planning lineage is resolved."}
              </p>
              <button
                type="button"
                className="df-secondary-button"
                aria-expanded={selected}
                onClick={() => update({ fact: selected ? null : f.fact.id, publicationLimit: 10 })}
              >
                {selected ? "Close" : "Inspect"} scheduled fact: {role(f)}, {f.fact.userDayDate}
              </button>
              {selected && (
                <div className="df-accepted-detail">
                  {f.publication.status === "available" && (
                    <>
                      {f.publication.value.slice(0, c.publicationLimit).map((p) => {
                        const id = `${f.fact.id}:${p.batchId}:${p.frozenDay.userDayDate}`;
                        return (
                          <details key={id} open={c.publications.includes(id)}>
                            <summary
                              onClick={(e) => {
                                e.preventDefault();
                                toggle("publications", id);
                              }}
                            >
                              Publication: {stamp(p.publishedAt)}
                            </summary>
                            <p>Frozen title: {p.frozenSnapshot.title}</p>
                            {p.frozenSnapshot.goals?.map((g) => (
                              <p key={g.goalId}>Goal name at publication: {g.title}</p>
                            ))}
                            <p>
                              Published User Day: {p.frozenDay.userDayDate}; boundary{" "}
                              {p.frozenDay.dayBoundaryStartTime}; UTC offset{" "}
                              {p.frozenDay.utcOffsetMinutes} minutes. Current Goal edits do not
                              rewrite this snapshot.
                            </p>
                            <p>Publication identity: {p.batchId}.</p>
                          </details>
                        );
                      })}
                      {f.publication.value.length > c.publicationLimit && (
                        <button
                          className="df-secondary-button"
                          type="button"
                          onClick={() => update({ publicationLimit: c.publicationLimit + 10 })}
                        >
                          Show more Goal publications
                        </button>
                      )}
                    </>
                  )}
                  {f.execution.status === "available" &&
                    f.execution.value.map((a) => (
                      <p key={a.subjectId}>
                        {a.revisions.length} retained report revisions.{" "}
                        {a.currentOutcome.status !== "unknown" && a.currentOutcome.record.actualTime
                          ? `Reported Actual: ${a.currentOutcome.record.actualTime.durationMinutes ?? "unknown"} minutes; start ${a.currentOutcome.record.actualTime.occurredAt ?? "not recorded"}.`
                          : "No effective Actual duration is supplied."}{" "}
                        Actual is not measured Progress.
                      </p>
                    ))}
                  <button
                    type="button"
                    className="df-secondary-button"
                    onClick={() => onDay(f.fact.userDayDate)}
                  >
                    Open Daily Planner for {f.fact.userDayDate}
                  </button>
                  <details open={c.references.includes(f.fact.id)}>
                    <summary
                      onClick={(e) => {
                        e.preventDefault();
                        toggle("references", f.fact.id);
                      }}
                    >
                      Scheduled fact references
                    </summary>
                    <dl>
                      <dt>Scheduled fact</dt>
                      <dd>{f.fact.id}</dd>
                      <dt>Accepted identity / revision</dt>
                      <dd>
                        {f.origin.acceptedAllocationId} / {f.origin.acceptedAllocationRevision}
                      </dd>
                      <dt>Realization</dt>
                      <dd>{f.origin.realizationId}</dd>
                      <dt>Requested Time / revision</dt>
                      <dd>
                        {f.lineage.demandId} / {f.lineage.demandRevision}
                      </dd>
                      <dt>Resource component</dt>
                      <dd>{f.lineage.componentId ?? "Productive work"}</dd>
                    </dl>
                  </details>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {facts.length > c.factLimit && (
        <button
          className="df-secondary-button"
          type="button"
          onClick={() => update({ factLimit: c.factLimit + 10 })}
        >
          Show more Goal scheduled facts
        </button>
      )}
    </>
  );
}
