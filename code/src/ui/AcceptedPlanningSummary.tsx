import { AcceptedPlanningCoverage } from "./AcceptedPlanningCoverage.js";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { addUserDayLabels } from "../core/time/canonicalUserDay.js";
import type { DayFrameStore } from "../state/types.js";
import type { AcceptedSummaryContext } from "./acceptedPlanningSummaryContext.js";
import {
  acceptedGoalGroups,
  acceptedMinutes,
  effort,
  factOutcome,
  factRole,
  iterationFacts,
  publicationLabel,
  schedulingLabel,
  type AcceptedSummaryFact,
  type AcceptedSummaryResult,
} from "./acceptedPlanningSummaryPresentation.js";
export type AcceptedPlanningSummaryProps = {
  query: DayFrameStore["queryAcceptedPlanningEvidence"];
  now: () => Date;
  context: AcceptedSummaryContext;
  onContextChange: (context: AcceptedSummaryContext) => void;
  onGoal: (id: string) => void;
  onDay: (owner: string) => void;
  onReview: () => void;
};
export function AcceptedPlanningSummary(props: AcceptedPlanningSummaryProps) {
  const { context: c } = props,
    uid = useId();
  const [start, setStart] = useState(c.start),
    [end, setEnd] = useState(c.end),
    [validation, setValidation] = useState("");
  const [revision, setRevision] = useState(0),
    [view, setView] = useState<{ key: string; result?: AcceptedSummaryResult; failed?: boolean }>({
      key: "",
    });
  const request = useRef(0);
  const nowRef = useRef(props.now);
  nowRef.current = props.now;
  const key = `${c.start}|${c.end}|${revision}`;
  useEffect(() => {
    const id = ++request.current;
    setView({ key });
    let exclusive: string;
    try {
      exclusive = addUserDayLabels(c.end as Parameters<typeof addUserDayLabels>[0], 1);
    } catch {
      setView({ key, failed: true });
      return;
    }
    void props
      .query({
        startUserDayDate: c.start,
        endUserDayDateExclusive: exclusive,
        asOf: nowRef.current().toISOString(),
      })
      .then(
        (result) => {
          if (id === request.current) setView({ key, result });
        },
        () => {
          if (id === request.current) setView({ key, failed: true });
        },
      );
    return () => {
      request.current++;
    };
  }, [c.start, c.end, revision, props.query, key]);
  const result = view.key === key ? view.result : undefined;
  const e = result?.status === "projected" ? result : undefined;
  function change(patch: Partial<AcceptedSummaryContext>) {
    props.onContextChange({ ...c, ...patch });
  }
  function applyRange(event: FormEvent) {
    event.preventDefault();
    const a = Date.parse(start + "T00:00:00Z"),
      b = Date.parse(end + "T00:00:00Z");
    if (!Number.isFinite(a) || !Number.isFinite(b) || a > b || (b - a) / 86400000 >= 366) {
      setValidation("Choose a period from 1 to 366 days.");
      return;
    }
    setValidation("");
    change({
      start,
      end,
      goal: null,
      iteration: null,
      fact: null,
      goalLimit: 10,
      iterationLimit: 10,
      factLimit: 10,
    });
  }
  const groups = e ? acceptedGoalGroups(e) : [];
  const shown = groups.filter(
    (g) =>
      c.filter === "all" ||
      g.iterations.some((i) => i.realizationState === c.filter) ||
      (c.filter === "unknown" && g.retained.length > 0),
  );
  const close = (patch: Partial<AcceptedSummaryContext>, id: string) => {
    change(patch);
    document.getElementById(id)?.focus();
  };
  return (
    <section className="df-panel df-accepted-summary" aria-labelledby={`${uid}-heading`}>
      <header>
        <p className="df-workflow-eyebrow">Summary</p>
        <h2 id={`${uid}-heading`}>Accepted planning</h2>
        <p>Inspect the planning you accepted, its scheduled work, and recorded outcomes.</p>
      </header>
      <form className="df-accepted-range" onSubmit={applyRange}>
        <label className="df-field">
          Period start
          <input
            aria-label="Accepted planning start date"
            type="date"
            required
            value={start}
            onChange={(event) => setStart(event.target.value)}
          />
        </label>
        <label className="df-field">
          Period end
          <input
            aria-label="Accepted planning end date"
            type="date"
            required
            value={end}
            onChange={(event) => setEnd(event.target.value)}
          />
        </label>
        <button type="submit" className="df-secondary-button">
          Apply planning period
        </button>
      </form>
      <p className="df-support">
        Viewing {c.start} through {c.end}, inclusive. This changes only this Summary view. Planning
        time is not Goal Progress.
      </p>
      {validation && <p role="alert">{validation}</p>}
      <div className="df-accepted-toolbar">
        <label className="df-field">
          Scheduling state
          <select
            value={c.filter}
            onChange={(event) =>
              change({
                filter: event.target.value as AcceptedSummaryContext["filter"],
                goal: null,
                iteration: null,
                fact: null,
                goalLimit: 10,
              })
            }
          >
            <option value="all">All accepted planning</option>
            <option value="realized">Scheduled</option>
            <option value="acceptedButUnrealized">Awaiting scheduling</option>
            <option value="unknown">Evidence unavailable</option>
          </select>
        </label>
        <button
          type="button"
          className="df-secondary-button"
          onClick={() => setRevision((v) => v + 1)}
        >
          Refresh accepted planning
        </button>
      </div>
      {!result && !(view.key === key && view.failed) && (
        <p role="status">Loading accepted planning…</p>
      )}
      {((view.key === key && view.failed) ||
        result?.status === "error" ||
        result?.status === "invalidQuery") && (
        <p role="alert">
          Accepted planning could not be loaded. Check the period and try Refresh accepted planning.
        </p>
      )}
      {e && (
        <>
          <AcceptedPlanningCoverage evidence={e} />
          {e.completeness === "complete" && !groups.length && e.lookup === "notFoundInRange" ? (
            <p>No accepted planning in this period.</p>
          ) : !shown.length ? (
            <p>
              No readable planning matches this view. Unavailable evidence is not evidence of
              absence.
            </p>
          ) : null}
          <ul className="df-accepted-list">
            {shown.slice(0, c.goalLimit).map((g) => {
              const groupId = `${uid}-goal-${encodeURIComponent(g.id)}`;
              const iterations = g.iterations.filter(
                (i) => c.filter === "all" || i.realizationState === c.filter,
              );
              const minutes = g.iterations.reduce((sum, i) => sum + acceptedMinutes(e, i, g.id), 0);
              const scheduled = g.iterations.filter((i) => i.realizationState === "realized");
              const waiting = g.iterations.filter(
                (i) => i.realizationState === "acceptedButUnrealized",
              );
              const unknown = g.iterations.filter((i) => i.realizationState === "unknown");
              return (
                <li className="df-accepted-group" key={g.id}>
                  <h3>{g.title}</h3>
                  {g.currentName && <p className="df-support">Current Goal name</p>}
                  <p>
                    Readable evidence: {g.iterations.length} distinct accepted iteration
                    {g.iterations.length === 1 ? "" : "s"} · {effort(minutes)} accepted productive
                    time for this Goal in this period.
                  </p>
                  <p>
                    {scheduled.length} scheduled · {waiting.length} awaiting scheduling
                    {unknown.length
                      ? ` · ${unknown.length} with scheduling evidence unavailable`
                      : ""}
                  </p>
                  {scheduled.length > 0 && (
                    <p>
                      {effort(scheduled.reduce((sum, i) => sum + acceptedMinutes(e, i, g.id), 0))}{" "}
                      accepted productive time belongs to the scheduled iterations. This is not a
                      completion total.
                    </p>
                  )}
                  <button
                    id={groupId}
                    type="button"
                    className="df-secondary-button"
                    aria-expanded={c.goal === g.id}
                    onClick={() =>
                      change({
                        goal: c.goal === g.id ? null : g.id,
                        iteration: null,
                        fact: null,
                        iterationLimit: 10,
                        factLimit: 10,
                      })
                    }
                  >
                    {c.goal === g.id ? "Close planning" : "Inspect planning"}
                    <span className="df-visually-hidden">: {g.title}</span>
                  </button>
                  {c.goal === g.id && (
                    <div className="df-accepted-detail">
                      <button
                        type="button"
                        className="df-secondary-button"
                        onClick={() => props.onGoal(g.id)}
                      >
                        View Goal
                      </button>
                      <ul className="df-accepted-list">
                        {iterations.slice(0, c.iterationLimit).map((i) => {
                          const identity = `${i.accepted.id}:${i.accepted.revision}`;
                          const buttonId = `${groupId}-${encodeURIComponent(identity)}`;
                          const ordinal = g.iterations.indexOf(i) + 1;
                          const facts = iterationFacts(e, i, g.id);
                          return (
                            <li className="df-accepted-iteration" key={identity}>
                              <h4>
                                Planning iteration {ordinal} · {effort(acceptedMinutes(e, i, g.id))}
                              </h4>
                              <p>
                                Accepted {new Date(i.accepted.acceptedAt).toLocaleString()} ·{" "}
                                {schedulingLabel(i.realizationState)}
                              </p>
                              {i.realizationState === "acceptedButUnrealized" && (
                                <p>
                                  Accepted planning has not yet been scheduled. It does not reserve
                                  calendar time.
                                </p>
                              )}
                              {i.accepted.footprintCompleteness === "legacyProductiveOnly" && (
                                <p>Older planning: support and protection detail is incomplete.</p>
                              )}
                              <button
                                id={buttonId}
                                aria-label={`${c.iteration === identity ? "Close iteration" : "Inspect iteration"} ${ordinal}`}
                                type="button"
                                className="df-secondary-button"
                                aria-expanded={c.iteration === identity}
                                onClick={() =>
                                  change({
                                    iteration: c.iteration === identity ? null : identity,
                                    fact: null,
                                    factLimit: 10,
                                  })
                                }
                              >
                                {c.iteration === identity ? "Close iteration" : "Inspect iteration"}
                                <span className="df-visually-hidden"> {ordinal}</span>
                              </button>
                              {c.iteration === identity && (
                                <div className="df-accepted-detail">
                                  <p>
                                    {facts.length} retained scheduled facts for this Goal and
                                    period. Scheduled work and publication are separate.
                                  </p>
                                  {i.realizationState === "unknown" && (
                                    <p>
                                      Scheduling information is{" "}
                                      {i.realization.status === "protected"
                                        ? "protected and cannot currently be read safely"
                                        : "unavailable"}
                                      . This is not an awaiting-scheduling claim.
                                    </p>
                                  )}
                                  {e.facts.status !== "available" ||
                                  (e.facts.status === "available" &&
                                    e.facts.coverage === "partial") ? (
                                    <p>
                                      Scheduled-work coverage is incomplete. Readable facts may not
                                      be the whole set.
                                    </p>
                                  ) : null}
                                  <FactList
                                    facts={facts}
                                    context={c}
                                    change={change}
                                    onDay={props.onDay}
                                    prefix={buttonId}
                                  />
                                  <button
                                    type="button"
                                    className="df-secondary-button"
                                    onClick={props.onReview}
                                  >
                                    View schedule review
                                  </button>
                                  <details>
                                    <summary>Planning references</summary>
                                    <p>
                                      This accepted decision is retained. Proposal status does not
                                      revoke it. No replacement or merging of accepted decisions is
                                      inferred.
                                    </p>
                                    <dl>
                                      <dt>Accepted decision</dt>
                                      <dd>
                                        {i.accepted.id} · revision {i.accepted.revision}
                                      </dd>
                                      <dt>Proposal</dt>
                                      <dd>
                                        {i.accepted.proposalId} · revision{" "}
                                        {i.accepted.proposalRevision}
                                      </dd>
                                      <dt>Proposal status</dt>
                                      <dd>{i.currentness.proposalLifecycle}</dd>
                                    </dl>
                                    {i.proposal.status !== "available" && (
                                      <p>Proposal detail unavailable.</p>
                                    )}
                                    {i.decision.status !== "available" && (
                                      <p>Acceptance-decision detail unavailable.</p>
                                    )}
                                  </details>
                                  <button
                                    type="button"
                                    className="df-secondary-button"
                                    onClick={() => close({ iteration: null, fact: null }, buttonId)}
                                  >
                                    Return to iterations
                                  </button>
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
                          onClick={() => change({ iterationLimit: c.iterationLimit + 10 })}
                        >
                          Show more iterations
                        </button>
                      )}
                      {g.retained.length > 0 && (
                        <>
                          <h4>Retained scheduled work</h4>
                          <p>
                            The full accepted decision is unavailable. These retained references are
                            not reconstructed acceptances.
                          </p>
                          <FactList
                            facts={g.retained}
                            context={c}
                            change={change}
                            onDay={props.onDay}
                            prefix={`${groupId}-retained`}
                          />
                        </>
                      )}
                      <button
                        type="button"
                        className="df-secondary-button"
                        onClick={() => close({ goal: null, iteration: null, fact: null }, groupId)}
                      >
                        Return to Goals
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {shown.length > c.goalLimit && (
            <button
              type="button"
              className="df-secondary-button"
              onClick={() => change({ goalLimit: c.goalLimit + 10 })}
            >
              Show more Goals
            </button>
          )}
        </>
      )}
    </section>
  );
}
function FactList({
  facts,
  context: c,
  change,
  onDay,
  prefix,
}: {
  facts: AcceptedSummaryFact[];
  context: AcceptedSummaryContext;
  change: (patch: Partial<AcceptedSummaryContext>) => void;
  onDay: (owner: string) => void;
  prefix: string;
}) {
  return (
    <>
      <ul className="df-accepted-list">
        {facts.slice(0, c.factLimit).map((f) => {
          const buttonId = `${prefix}-fact-${encodeURIComponent(f.fact.id)}`;
          return (
            <li className={`df-accepted-fact df-accepted-${f.role}`} key={f.fact.id}>
              <h5>
                {factRole(f.role)} · {effort(f.fact.durationMinutes)}
              </h5>
              <p>
                {f.fact.userDayDate} · {new Date(f.fact.startsAt).toLocaleString()} –{" "}
                {new Date(f.fact.endsAt).toLocaleString()}
              </p>
              <p>{publicationLabel(f)}</p>
              <p>{factOutcome(f)}</p>
              {f.verification === "retainedReferenceOnly" && (
                <p>
                  Retained reference only; the full planning chain cannot currently be verified.
                </p>
              )}
              <button
                id={buttonId}
                type="button"
                className="df-secondary-button"
                aria-expanded={c.fact === f.fact.id}
                onClick={() => change({ fact: c.fact === f.fact.id ? null : f.fact.id })}
              >
                {c.fact === f.fact.id ? "Close scheduled detail" : "Inspect scheduled detail"}
                <span className="df-visually-hidden">
                  : {factRole(f.role)}, {f.fact.userDayDate}
                </span>
              </button>
              {c.fact === f.fact.id && (
                <div className="df-accepted-detail">
                  {f.publication.status === "available" && (
                    <PublicationList publications={f.publication.value} />
                  )}
                  {f.execution.status === "available" &&
                    f.execution.value.map((a) => (
                      <p key={a.subjectId}>
                        {a.revisions.length} retained report revision
                        {a.revisions.length === 1 ? "" : "s"}.
                        {a.currentOutcome.status !== "unknown" && a.currentOutcome.record.actualTime
                          ? ` Actual: ${a.currentOutcome.record.actualTime.occurredAt ?? "start not recorded"}; ${a.currentOutcome.record.actualTime.durationMinutes ?? "unknown"} minutes.`
                          : ""}{" "}
                        Actual time is not Goal Progress.
                      </p>
                    ))}
                  <button
                    type="button"
                    className="df-secondary-button"
                    onClick={() => onDay(f.fact.userDayDate)}
                  >
                    View day
                  </button>
                  <details>
                    <summary>Scheduled-work references</summary>
                    <dl>
                      <dt>Scheduled fact</dt>
                      <dd>{f.fact.id}</dd>
                      <dt>Accepted decision</dt>
                      <dd>
                        {f.origin.acceptedAllocationId} · revision{" "}
                        {f.origin.acceptedAllocationRevision}
                      </dd>
                      <dt>Demand revision</dt>
                      <dd>
                        {f.lineage.demandId} · {f.lineage.demandRevision}
                      </dd>
                    </dl>
                  </details>
                  <button
                    type="button"
                    className="df-secondary-button"
                    onClick={() => {
                      change({ fact: null });
                      document.getElementById(buttonId)?.focus();
                    }}
                  >
                    Return to scheduled work
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {facts.length > c.factLimit && (
        <button
          type="button"
          className="df-secondary-button"
          onClick={() => change({ factLimit: c.factLimit + 10 })}
        >
          Show more scheduled work
        </button>
      )}
    </>
  );
}

function PublicationList({
  publications,
}: {
  publications: Extract<AcceptedSummaryFact["publication"], { status: "available" }>["value"];
}) {
  const [limit, setLimit] = useState(10);
  return (
    <>
      {publications.slice(0, limit).map((p, index) => (
        <details key={`${p.batchId}:${index}`}>
          <summary>Published {new Date(p.publishedAt).toLocaleString()}</summary>
          <p>Frozen title: {p.frozenSnapshot.title}</p>
          {p.frozenSnapshot.goals?.map((g) => (
            <p key={g.goalId}>Goal name at publication: {g.title}</p>
          ))}
          <p>
            Published day: {p.frozenDay.userDayDate}. This snapshot is unchanged by current Goal
            edits.
          </p>
        </details>
      ))}
      {publications.length > limit && (
        <button
          type="button"
          className="df-secondary-button"
          onClick={() => setLimit((v) => v + 10)}
        >
          Show more publications
        </button>
      )}
    </>
  );
}
