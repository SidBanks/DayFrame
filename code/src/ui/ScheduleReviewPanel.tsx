import { useEffect, useState, type ReactElement } from "react";
import type { LocalDateString } from "../core/shifts/types.js";
import type { ReviewScopeV1 } from "../core/planning/planningScope.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
import { publicationRangeFromReviewScope } from "../core/planning/reviewScope.js";
import type { PublishScheduleRangeResultV1 } from "../state/types.js";
import type { PlanningReviewReadModelV1 } from "../state/planningScopeQuery.js";
import { presentPlanningReview } from "./plannerReviewPresentation.js";
import { deriveScheduleReviewReadiness } from "./scheduleReviewReadiness.js";

export type ScheduleReviewQuery = (input: {
  reviewScope: ReviewScopeV1;
  historyAsOf: string;
}) => Promise<PlanningReviewReadModelV1>;

export function ScheduleReviewPanel(props: {
  startUserDayDate: LocalDateString;
  endUserDayDateExclusive: LocalDateString;
  weekStartsOn: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
  historyAsOf: string;
  query: ScheduleReviewQuery;
  unresolvedFrictionCount: number;
  onGeneratePreview: () => void;
  onOpenFriction: () => void;
  onAcceptProposal: (input: {
    proposalId: string;
    proposalRevision: number;
    optionId: string;
  }) => Promise<unknown>;
  onRejectProposal: (input: { proposalId: string; proposalRevision: number }) => Promise<unknown>;
  onPublish: (input: {
    publicationRange: ReturnType<typeof publicationRangeFromReviewScope>;
    expectedSourceFingerprint: string;
    publishedAt: string;
  }) => Promise<PublishScheduleRangeResultV1>;
  getPublishedAt: () => string;
}): ReactElement {
  const reviewScope = createReviewScope({
    kind: "custom",
    anchorUserDayDate: props.startUserDayDate,
    weekStartsOn: props.weekStartsOn,
    source: "navigation",
    customRange: {
      startUserDayDate: props.startUserDayDate,
      endUserDayDateExclusive: props.endUserDayDateExclusive,
    },
  });
  const [result, setResult] = useState<PlanningReviewReadModelV1 | "loading" | "error">("loading");
  const [refresh, setRefresh] = useState(0);
  const [pending, setPending] = useState<string | null>(null);
  const [mutationMessage, setMutationMessage] = useState("");
  const [publicationMessage, setPublicationMessage] = useState<{
    tone: "success" | "failure";
    text: string;
  } | null>(null);
  const [historyAsOf, setHistoryAsOf] = useState(props.historyAsOf);
  useEffect(() => {
    let current = true;
    setResult("loading");
    void props.query({ reviewScope, historyAsOf }).then(
      (value) => current && setResult(value),
      () => current && setResult("error"),
    );
    return () => {
      current = false;
    };
  }, [historyAsOf, props.query, refresh, reviewScope.id]);
  if (result === "loading")
    return (
      <section aria-busy="true" className="df-panel">
        Loading review readiness…
      </section>
    );
  if (result === "error")
    return (
      <section className="df-panel" role="alert">
        <h3>Review state unavailable</h3>
        <p>This period cannot be considered ready while planning truth is unavailable.</p>
      </section>
    );
  const readiness = deriveScheduleReviewReadiness({
    model: result,
    unresolvedFrictionCount: props.unresolvedFrictionCount,
    publicationRangeValid: true,
  });
  const presentation = presentPlanningReview(result);
  async function decide(id: string, action: () => Promise<unknown>) {
    setPending(id);
    setMutationMessage("");
    try {
      const outcome = await action();
      setMutationMessage(
        commandAccepted(outcome)
          ? "Decision recorded. Review state refreshed."
          : "The decision was not recorded; existing authority is unchanged.",
      );
    } catch {
      setMutationMessage("The decision could not be completed; existing authority is unchanged.");
    } finally {
      setPending(null);
      setRefresh((value) => value + 1);
    }
  }
  async function publish() {
    const publishedAt = props.getPublishedAt();
    setPending("publication");
    setPublicationMessage(null);
    try {
      const outcome = await props.onPublish({
        publicationRange: publicationRangeFromReviewScope(reviewScope),
        expectedSourceFingerprint:
          result === "loading" || result === "error" ? "" : result.sourceFingerprint,
        publishedAt,
      });
      if (outcome.status === "published" || outcome.status === "alreadyPublished") {
        setPublicationMessage({
          tone: "success",
          text:
            outcome.status === "published"
              ? "Schedule published. This immutable historical record does not lock future schedule changes."
              : "This exact publication was already recorded.",
        });
        setHistoryAsOf(publishedAt);
      } else {
        setPublicationMessage({ tone: "failure", text: publicationFailureMessage(outcome.reason) });
      }
    } catch {
      setPublicationMessage({
        tone: "failure",
        text: "Publication failed without changing schedule history. Try again.",
      });
    } finally {
      setPending(null);
      setRefresh((value) => value + 1);
    }
  }
  return (
    <section
      aria-labelledby="review-readiness-heading"
      className="df-panel df-schedule-review-summary"
    >
      <div className="df-screen-header">
        <p className="df-workflow-eyebrow">Review workflow</p>
        <h3 id="review-readiness-heading">Review readiness</h3>
        <p>
          {reviewScope.startUserDayDate} through {reviewScope.endUserDayDateExclusive} (exclusive)
        </p>
      </div>
      <dl className="df-summary-grid">
        <div>
          <dt>Planning data</dt>
          <dd>{result.planningDataCoverage}</dd>
        </div>
        <div>
          <dt>Preview coverage</dt>
          <dd>{result.preview.coverage}</dd>
        </div>
        <div>
          <dt>Preview freshness</dt>
          <dd>{result.preview.freshness}</dd>
        </div>
        <div>
          <dt>Schedule conflicts</dt>
          <dd>{props.unresolvedFrictionCount}</dd>
        </div>
        <div>
          <dt>Accepted awaiting realization</dt>
          <dd>{result.acceptedLiabilities.length}</dd>
        </div>
        <div>
          <dt>Proposals</dt>
          <dd>{result.proposals.length}</dd>
        </div>
      </dl>
      <div aria-live="polite">
        <h4>{readiness.publicationReady ? "Ready to publish" : "Not ready to publish"}</h4>
        {readiness.publicationReady ? (
          <p>
            This period satisfies the current derived publication-readiness policy. Publishing
            remains an explicit action.
          </p>
        ) : (
          <ul className="df-plain-list">
            {readiness.blockers.map((item) => (
              <li key={item.code}>{item.message}</li>
            ))}
          </ul>
        )}
        {readiness.warnings.map((item) => (
          <p className="df-warning-message" key={item.code}>
            {item.message}
          </p>
        ))}
        <p className="df-support">{presentation.publication.label}</p>
        {mutationMessage ? <p>{mutationMessage}</p> : null}
        {publicationMessage ? (
          <p role={publicationMessage.tone === "failure" ? "alert" : "status"}>
            {publicationMessage.text}
          </p>
        ) : null}
      </div>
      <div className="df-screen-actions">
        {readiness.blockers.some(
          (item) => item.action === "generatePreview" || item.action === "refreshPreview",
        ) ? (
          <button className="df-action-button" onClick={props.onGeneratePreview} type="button">
            {result.preview.availability === "unavailable" ? "Generate Preview" : "Refresh Preview"}
          </button>
        ) : null}
        {props.unresolvedFrictionCount ? (
          <button className="df-secondary-button" onClick={props.onOpenFriction} type="button">
            Resolve schedule conflicts
          </button>
        ) : null}
        <button
          className="df-action-button"
          disabled={!readiness.publicationReady || pending !== null}
          onClick={() => void publish()}
          type="button"
        >
          {pending === "publication"
            ? "Publishing…"
            : `${result.publication.publishedUserDays.length ? "Publish current schedule again" : "Publish schedule"}: ${reviewScope.startUserDayDate}–${reviewScope.endUserDayDateExclusive} (exclusive)`}
        </button>
      </div>
      {result.acceptedLiabilities.length ? (
        <section>
          <h4>Accepted authority awaiting realization</h4>
          <p>
            Accepted resource intent has not reached scheduled reality. Inspect or resolve the
            schedule before publication.
          </p>
        </section>
      ) : null}
      {result.proposals.length ? (
        <section>
          <h4>Constructive Proposals</h4>
          <ul className="df-plain-list">
            {result.proposals.map(({ proposal }) => {
              const option =
                proposal.options.find((value) => value.preferred) ?? proposal.options[0];
              const key = `${proposal.id}:${proposal.revision}`;
              return (
                <li className="df-list-card" key={key}>
                  <strong>
                    Proposal for {proposal.horizon.startUserDayDate}–
                    {proposal.horizon.endUserDayDateExclusive}
                  </strong>
                  <span>
                    {proposal.options.length} bounded option
                    {proposal.options.length === 1 ? "" : "s"}. A Proposal does not own schedule
                    time.
                  </span>
                  <div className="df-screen-actions">
                    {option ? (
                      <button
                        disabled={pending !== null}
                        onClick={() =>
                          void decide(key, () =>
                            props.onAcceptProposal({
                              proposalId: proposal.id,
                              proposalRevision: proposal.revision,
                              optionId: option.id,
                            }),
                          )
                        }
                        type="button"
                      >
                        Accept preferred option
                      </button>
                    ) : null}
                    <button
                      disabled={pending !== null}
                      onClick={() =>
                        void decide(key, () =>
                          props.onRejectProposal({
                            proposalId: proposal.id,
                            proposalRevision: proposal.revision,
                          }),
                        )
                      }
                      type="button"
                    >
                      Reject Proposal
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <p className="df-support">No actionable Proposal intersects this Review Scope.</p>
      )}
    </section>
  );
}

function publicationFailureMessage(reason: string) {
  if (reason === "sourceChanged")
    return "The schedule changed since this review. Refresh the Preview and review again before publishing.";
  if (reason === "previewMissing" || reason === "previewStale" || reason === "previewRangeMismatch")
    return "Preview is no longer current for this range. Refresh it and review again.";
  if (reason === "frictionUnresolved") return "Resolve schedule conflicts before publishing.";
  if (reason === "acceptedAllocationUnrealized")
    return "Accepted scheduling authority must be realized before publishing.";
  return "Publication failed without changing schedule history. Review the blockers and try again.";
}

function commandAccepted(value: unknown) {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    (value as { status: string }).status === "accepted"
  );
}
