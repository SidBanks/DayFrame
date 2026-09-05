import { useEffect, useState, type ReactElement } from "react";
import type { ReviewScopeV1 } from "../core/planning/planningScope.js";
import type { PlanningReviewReadModelV1 } from "../state/planningScopeQuery.js";
import { presentPlanningReview } from "./plannerReviewPresentation.js";
import { formatHumanTimeRange } from "./timeDisplay.js";

export function PlanningReviewPanel({
  reviewScope,
  historyAsOf,
  query,
  refreshKey,
  selectedDay,
}: {
  reviewScope: ReviewScopeV1;
  historyAsOf: string;
  query: (input: {
    reviewScope: ReviewScopeV1;
    historyAsOf: string;
  }) => Promise<PlanningReviewReadModelV1>;
  refreshKey: unknown;
  selectedDay?: string;
}): ReactElement {
  const [result, setResult] = useState<PlanningReviewReadModelV1 | "loading" | "error">("loading");
  useEffect(() => {
    let current = true;
    setResult("loading");
    void query({ reviewScope, historyAsOf }).then(
      (value) => current && setResult(value),
      () => current && setResult("error"),
    );
    return () => {
      current = false;
    };
  }, [historyAsOf, query, refreshKey, reviewScope.id]);
  if (result === "loading")
    return (
      <section aria-busy="true" aria-label="Planning review" className="df-panel">
        <h3>Planning review</h3>
        <p>Loading scheduled reality, proposals, and coverage…</p>
      </section>
    );
  if (result === "error")
    return (
      <section className="df-panel" role="alert">
        <h3>Planning review unavailable</h3>
        <p>Schedule knowledge could not be loaded. This is not an empty period.</p>
      </section>
    );
  const presentation = presentPlanningReview(result);
  const groups = selectedDay
    ? presentation.groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.userDayDate === selectedDay),
        }))
        .filter((group) => group.items.length)
    : presentation.groups;
  return (
    <section aria-labelledby="planning-review-heading" className="df-panel df-planning-review">
      <div className="df-screen-header">
        <p className="df-workflow-eyebrow">Canonical planning review</p>
        <h3 id="planning-review-heading">
          {selectedDay ? "Selected-day planning truth" : "Planning truth for this period"}
        </h3>
        <p className="df-support">
          {reviewScope.startUserDayDate} through {reviewScope.endUserDayDateExclusive} (exclusive)
        </p>
      </div>
      <div aria-live="polite" className="df-form-stack" role="status">
        <p
          className={
            presentation.coverage.tone === "complete" ? "df-support" : "df-warning-message"
          }
        >
          {presentation.coverage.label}
        </p>
        <p
          className={presentation.preview.tone === "current" ? "df-support" : "df-warning-message"}
        >
          {presentation.preview.label}
        </p>
        <p className="df-support">{presentation.publication.label}</p>
      </div>
      {presentation.isKnownEmpty ? (
        <p className="df-empty">Nothing is scheduled or proposed in this period.</p>
      ) : null}
      {groups.map((group) => (
        <section className="df-month-agenda-section" key={group.kind}>
          <h4>{group.heading}</h4>
          <ul className="df-plain-list df-month-agenda">
            {group.items.map((item) => (
              <li data-planner-kind={item.kind} key={item.id}>
                <strong>{item.heading}</strong>
                <span>{item.detail}</span>
                {item.startsAt && item.endsAt ? (
                  <span>
                    {formatHumanTimeRange(new Date(item.startsAt), new Date(item.endsAt))}
                  </span>
                ) : (
                  <span>Proposal begins {item.userDayDate}</span>
                )}
                {item.fullStartsAt && item.startsAt !== item.fullStartsAt ? (
                  <span className="df-support">Continues across the Review Scope boundary.</span>
                ) : null}
                {item.action === "decide" ? (
                  <span className="df-support">
                    Open Review Schedule to accept or reject this Proposal.
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {!presentation.isKnownEmpty && groups.length === 0 ? (
        <p className="df-support">
          No known items intersect the selected day. Coverage status above still applies.
        </p>
      ) : null}
    </section>
  );
}
