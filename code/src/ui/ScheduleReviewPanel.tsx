import { createGoalEditingContext, type GoalEditingContext } from "./goalEditingContext.js";
import { useGoalEditingState } from "./useGoalEditingState.js";
import { addUserDayLabels } from "../core/time/canonicalUserDay.js";
import { publicationSourceMessage } from "./reviewSourceFeedback.js";
import { useReviewInvalidation } from "./useReviewInvalidation.js";
import { hasCurrentAcceptanceReceipt } from "../state/acceptanceLifecycle.js";
import type { ProposalSurface } from "../state/proposalSurface.js";
type ProposalOutcome =
  | Awaited<ReturnType<ProposalSurface["acceptProposalOption"]>>
  | Awaited<ReturnType<ProposalSurface["rejectProposal"]>>;
import { useEffect, useState, useRef, useMemo, type ReactElement, type ReactNode } from "react";
import type { LocalDateString } from "../core/shifts/types.js";
import type { ReviewScopeV1 } from "../core/planning/planningScope.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
import { publicationRangeFromReviewScope } from "../core/planning/reviewScope.js";
import type {
  PublishScheduleRangeResultV1,
  PublishScheduleRangeFailureReasonV1,
} from "../state/types.js";
import type { PlanningReviewReadModelV2 } from "../state/planningScopeQuery.js";
import { presentPlanningReview } from "./plannerReviewPresentation.js";
import type { RealizationCommandResultV1 } from "../core/planning/acceptedAllocationRealization.js";
import { realizationReasons, durationLabel } from "./planningResultCopy.js";
import { ScheduledGoalFacts } from "./ScheduledGoalFacts.js";
import { deriveScheduleReviewReadiness } from "./scheduleReviewReadiness.js";

export type ScheduleReviewQuery = (input: {
  reviewScope: ReviewScopeV1;
  historyAsOf: string;
}) => Promise<PlanningReviewReadModelV2>;

export function ScheduleReviewPanel(props: {
  context?: GoalEditingContext;
  corrections?: ReactNode;
  onGoal?: (id: string) => void;
  onDay?: (day: string) => void;
  startUserDayDate: LocalDateString;
  endUserDayDateExclusive: LocalDateString;
  weekStartsOn: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
  historyAsOf: string;
  refreshKey?: unknown;
  subscribeReview?: (listener: () => void) => () => void;
  goalNames?: Readonly<Record<string, string>>;
  onRetryRealization?: (id: string) => Promise<RealizationCommandResultV1>;
  query: ScheduleReviewQuery;
  unresolvedFrictionCount: number;
  onGeneratePreview: () => void;
  onOpenFriction: () => void;
  onAcceptProposal: (input: {
    proposalId: string;
    proposalRevision: number;
    optionId: string;
  }) => Promise<ProposalOutcome>;
  onRejectProposal: (input: {
    proposalId: string;
    proposalRevision: number;
  }) => Promise<ProposalOutcome>;
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
  const revision = useReviewInvalidation(props.subscribeReview);
  const readRevision = useRef(revision);
  const readContext = useRef({ query: props.query, scope: reviewScope.id });
  const [result, setResult] = useState<PlanningReviewReadModelV2 | "loading" | "error">("loading");
  const [localContext] = useState(createGoalEditingContext);
  const presentationContext = props.context ?? localContext;
  const [operation, updateOperation] = useGoalEditingState(
    presentationContext,
    "review-operation",
    () => ({ pending: null as string | null }),
  );
  const [feedback, updateFeedback] = useGoalEditingState(
    presentationContext,
    `review-feedback:${reviewScope.id}`,
    () => ({
      refresh: 0,
      historyAsOf: props.historyAsOf,
      mutationMessage: "",
      publicationMessage: null as { tone: "success" | "failure"; text: string } | null,
      proposalResult: null as ProposalOutcome | null,
      realizationResult: null as RealizationCommandResultV1 | null,
      publicationResult: null as PublishScheduleRangeResultV1 | null,
      offerLimit: 10,
      scheduledLimit: 10,
      acceptedLimit: 10,
      disclosures: {} as Record<string, boolean>,
      requireReview: false,
    }),
  );
  const { refresh, historyAsOf, mutationMessage, publicationMessage } = feedback;
  const readIdentity = useRef({ refresh: -1, historyAsOf: "", key: props.refreshKey });
  const pending = operation.pending;
  const setPending = (pending: string | null) => updateOperation({ pending });
  const setMutationMessage = (mutationMessage: string) => updateFeedback({ mutationMessage });
  const setPublicationMessage = (publicationMessage: typeof feedback.publicationMessage) =>
    updateFeedback({ publicationMessage });
  const setHistoryAsOf = (historyAsOf: string) => updateFeedback({ historyAsOf });
  const setRefresh = (next: (value: number) => number) =>
    updateFeedback((value) => ({ refresh: next(value.refresh) }));
  const controller = useMemo(
    () =>
      presentationContext
        .cell("review-controller", () => ({
          request: { current: null as object | null },
          context: { current: { query: props.query, scope: reviewScope.id } },
        }))
        .get(),
    [presentationContext],
  );
  const request = controller.request;
  const requestContext = controller.context;
  requestContext.current = { query: props.query, scope: reviewScope.id };
  useEffect(() => {
    let current = true;
    setResult("loading");
    void props.query({ reviewScope, historyAsOf }).then(
      (value) => {
        if (current) {
          readIdentity.current = { refresh, historyAsOf, key: props.refreshKey };
          readRevision.current = revision;
          readContext.current = { query: props.query, scope: reviewScope.id };
          setResult(value);
        }
      },
      () => {
        if (current) {
          readIdentity.current = { refresh, historyAsOf, key: props.refreshKey };
          readRevision.current = revision;
          readContext.current = { query: props.query, scope: reviewScope.id };
          setResult("error");
        }
      },
    );
    return () => {
      current = false;
    };
  }, [historyAsOf, props.query, refresh, reviewScope.id, props.refreshKey, revision]);
  if (
    result === "loading" ||
    readIdentity.current.refresh !== refresh ||
    readIdentity.current.historyAsOf !== historyAsOf ||
    readIdentity.current.key !== props.refreshKey ||
    readRevision.current !== revision ||
    readContext.current.query !== props.query ||
    readContext.current.scope !== reviewScope.id
  )
    return (
      <section className="df-panel df-schedule-review-summary">
        <p aria-busy="true">Loading review readiness…</p>
        <div key="corrections">{props.corrections}</div>
      </section>
    );
  if (result === "error")
    return (
      <section className="df-panel df-schedule-review-summary">
        <div role="alert">
          <h3>Review state unavailable</h3>
          <p>This period cannot be considered ready while planning truth is unavailable.</p>
          <button
            type="button"
            className="df-secondary-button"
            onClick={() => setRefresh((value) => value + 1)}
          >
            Refresh review
          </button>
        </div>
        <div key="corrections">{props.corrections}</div>
      </section>
    );
  const readiness = deriveScheduleReviewReadiness({
    model: result,
    unresolvedFrictionCount: props.unresolvedFrictionCount,
    publicationRangeValid: true,
  });
  const presentation = presentPlanningReview(result);
  async function decide(id: string, action: () => Promise<ProposalOutcome>) {
    if (request.current || feedback.requireReview) return;
    const token = {},
      context = requestContext.current;
    request.current = token;
    const current = () =>
      presentationContext.isValid() &&
      request.current === token &&
      requestContext.current.query === context.query &&
      requestContext.current.scope === context.scope;
    setPending(id);
    updateFeedback({ proposalResult: null, realizationResult: null });
    setMutationMessage("");
    try {
      const outcome = await action();
      updateFeedback({ proposalResult: outcome, realizationResult: null });
      if (!current() || !hasCurrentAcceptanceReceipt(outcome)) return;
      setMutationMessage(decisionMessage(outcome));
      setRefresh((value) => value + 1);
    } catch {
      if (current()) updateFeedback({ requireReview: true });
      if (current())
        setMutationMessage(
          "The decision result could not be confirmed. Review current authority before retrying.",
        );
    } finally {
      if (request.current === token) {
        request.current = null;
        setPending(null);
      }
    }
  }
  async function retryRealization(id: string) {
    if (!props.onRetryRealization || request.current || feedback.requireReview) return;
    const token = {},
      context = requestContext.current;
    request.current = token;
    const current = () =>
      presentationContext.isValid() &&
      request.current === token &&
      requestContext.current.query === context.query &&
      requestContext.current.scope === context.scope;
    setPending(id);
    updateFeedback({ proposalResult: null, realizationResult: null, mutationMessage: "" });
    try {
      const outcome = await props.onRetryRealization(id);
      updateFeedback({ realizationResult: outcome, proposalResult: null });
      if (!current() || !hasCurrentAcceptanceReceipt(outcome)) return;
      setMutationMessage(realizationMessage(outcome));
      setRefresh((value) => value + 1);
    } catch {
      if (current()) updateFeedback({ requireReview: true });
      if (current())
        setMutationMessage(
          "Scheduling could not be confirmed. Review current authority before retrying; do not accept again.",
        );
    } finally {
      if (request.current === token) {
        request.current = null;
        setPending(null);
      }
    }
  }
  async function publish() {
    if (
      request.current ||
      feedback.requireReview ||
      !readiness.publicationReady ||
      readRevision.current !== revision
    )
      return;
    const token = {},
      context = requestContext.current;
    request.current = token;
    const current = () =>
      presentationContext.isValid() &&
      request.current === token &&
      requestContext.current.query === context.query &&
      requestContext.current.scope === context.scope;
    const publishedAt = props.getPublishedAt();
    let belongsToCurrentContext = current;
    setPending("publication");
    updateFeedback({ publicationResult: null });
    setPublicationMessage(null);
    try {
      const outcome = await props.onPublish({
        publicationRange: publicationRangeFromReviewScope(reviewScope),
        expectedSourceFingerprint:
          result === "loading" || result === "error" ? "" : result.sourceFingerprint,
        publishedAt,
      });
      updateFeedback({ publicationResult: outcome });
      belongsToCurrentContext = () => current() && (outcome.receipt?.isCurrent() ?? false);
      if (!belongsToCurrentContext()) return;
      if (outcome.status === "published" || outcome.status === "alreadyPublished") {
        setPublicationMessage({
          tone: "success",
          text: outcome.reviewRequired
            ? "Schedule saved. Required sources changed after admission; review the current schedule before another publication."
            : outcome.status === "published"
              ? "Schedule published. This immutable historical record does not lock future schedule changes."
              : "This exact publication was already recorded.",
        });
        setHistoryAsOf(publishedAt);
      } else {
        setPublicationMessage({
          tone: "failure",
          text:
            outcome.reason === "publicationSourceUnqualified"
              ? publicationSourceMessage(outcome.sourceIssues)
              : publicationFailureMessage(outcome.reason),
        });
      }
    } catch {
      if (!current()) return;
      updateFeedback({ requireReview: true });
      setPublicationMessage({
        tone: "failure",
        text: "The publication result could not be confirmed. History may have been saved. Do not publish again until its status can be verified.",
      });
    } finally {
      if (belongsToCurrentContext()) setRefresh((value) => value + 1);
      if (request.current === token) {
        request.current = null;
        setPending(null);
      }
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
          {reviewScope.startUserDayDate} through{" "}
          {addUserDayLabels(reviewScope.endUserDayDateExclusive, -1)} (inclusive)
        </p>
      </div>
      <button
        type="button"
        className="df-secondary-button"
        disabled={pending !== null}
        onClick={() => {
          updateFeedback({ requireReview: false });
          setHistoryAsOf(props.getPublishedAt());
          setRefresh((value) => value + 1);
        }}
      >
        Refresh review
      </button>
      {feedback.requireReview && (
        <p role="alert">
          The operation outcome is unconfirmed. Refresh review to inspect current authority before
          another command.
        </p>
      )}
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
          <dt>
            {result.acceptedLiabilities.availability === "available"
              ? "Accepted awaiting realization"
              : "Readable accepted claims"}
          </dt>
          <dd>
            {result.acceptedLiabilities.coverage.status === "complete"
              ? result.acceptedLiabilities.records.length
              : "Unknown total; readable claims shown below"}
          </dd>
        </div>
        <div>
          <dt>Proposals</dt>
          <dd>
            {result.proposals.coverage.status === "complete"
              ? result.proposals.records.length
              : "Unknown total"}
          </dd>
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
        {mutationMessage &&
        (!feedback.proposalResult || hasCurrentAcceptanceReceipt(feedback.proposalResult)) &&
        (!feedback.realizationResult || hasCurrentAcceptanceReceipt(feedback.realizationResult)) ? (
          <p role="status">{mutationMessage}</p>
        ) : null}
        {publicationMessage &&
        (!feedback.publicationResult || feedback.publicationResult.receipt?.isCurrent()) ? (
          <p role={publicationMessage.tone === "failure" ? "alert" : "status"}>
            {publicationMessage.text}
          </p>
        ) : null}
      </div>
      {result.proposals.records.length > feedback.offerLimit && (
        <button
          type="button"
          className="df-secondary-button"
          onClick={() => updateFeedback({ offerLimit: feedback.offerLimit + 10 })}
        >
          Show more offers
        </button>
      )}
      {result.proposals.records.length ? (
        <section>
          <h4>
            {result.proposals.availability === "available"
              ? "Constructive Proposals"
              : "Readable prior Proposal records"}
          </h4>
          <ul className="df-plain-list">
            {result.proposals.records
              .slice(0, feedback.offerLimit)
              .map(({ proposal, membership }) => {
                const option =
                  proposal.options.find((value) => value.preferred) ?? proposal.options[0];
                const key = `${proposal.id}:${proposal.revision}`;
                return (
                  <li className="df-list-card" key={key}>
                    <strong>
                      Proposal for {proposal.horizon.startUserDayDate}–
                      {addUserDayLabels(
                        proposal.horizon.endUserDayDateExclusive as LocalDateString,
                        -1,
                      )}{" "}
                      (inclusive)
                    </strong>
                    <details open={!!feedback.disclosures[key]}>
                      <summary
                        onClick={(event) => {
                          event.preventDefault();
                          updateFeedback({
                            disclosures: {
                              ...feedback.disclosures,
                              [key]: !feedback.disclosures[key],
                            },
                          });
                        }}
                      >
                        Decision identity and scope
                      </summary>
                      <p>
                        Proposal {proposal.id}, revision {proposal.revision}; preferred option{" "}
                        {option?.id ?? "unavailable"}. Acceptance covers the complete option.
                      </p>
                    </details>
                    {membership === "intersecting" && (
                      <p className="df-warning-message">
                        Accepting decides the complete option, including work outside this review
                        period.
                      </p>
                    )}
                    <span>
                      {proposal.options.length} bounded option
                      {proposal.options.length === 1 ? "" : "s"}. A Proposal does not own schedule
                      time.
                    </span>
                    {option ? (
                      <details open={!!feedback.disclosures[key + ":claims"]}>
                        <summary
                          onClick={(event) => {
                            event.preventDefault();
                            updateFeedback({
                              disclosures: {
                                ...feedback.disclosures,
                                [key + ":claims"]: !feedback.disclosures[key + ":claims"],
                              },
                            });
                          }}
                        >
                          Requested Time and full option effects
                        </summary>
                        <ul>
                          {(option.assignments ?? []).map((assignment) => (
                            <li key={assignment.demandProjectionId}>
                              {props.goalNames?.[assignment.goalId] ?? "Goal"}: Requested Time{" "}
                              {durationLabel(assignment.requestedMinutes)}; offered effort:{" "}
                              {durationLabel(assignment.assignedMinutes)}; unallocated:{" "}
                              {durationLabel(assignment.unmetMinutes)}.
                              {props.onGoal && (
                                <button
                                  type="button"
                                  className="df-secondary-button"
                                  data-review-return={`offer-goal:${key}:${assignment.demandProjectionId}`}
                                  onClick={() => props.onGoal?.(assignment.goalId)}
                                >
                                  Inspect Goal planning
                                </button>
                              )}
                            </li>
                          ))}
                          {(option.claims ?? []).map((claim) => (
                            <li key={claim.id}>
                              {claim.role === "productive"
                                ? "Goal work"
                                : claim.role === "supportActivity"
                                  ? "Support activity"
                                  : "Protected Buffer (not an activity)"}
                              : {claim.userDayDate},{" "}
                              {new Date(claim.startsAt).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                              –
                              {new Date(claim.endsAt).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : null}
                    <div className="df-screen-actions">
                      {option ? (
                        <button
                          disabled={
                            pending !== null ||
                            feedback.requireReview ||
                            result.queryState !== "current" ||
                            result.proposals.availability !== "available"
                          }
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
                        disabled={
                          pending !== null ||
                          feedback.requireReview ||
                          result.queryState !== "current" ||
                          result.proposals.availability !== "available"
                        }
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
      {result.acceptedLiabilities.records.length ? (
        <section>
          <h4>
            {result.acceptedLiabilities.availability === "available"
              ? "Accepted authority awaiting realization"
              : "Readable accepted authority"}
          </h4>
          <p>
            {result.acceptedLiabilities.availability === "available"
              ? "Accepted resource intent has not reached scheduled reality. Inspect or resolve the schedule before publication. Acceptance is saved; retry scheduling without accepting again."
              : "Current realization coverage is unknown. These readable accepted claims do not establish which work remains unscheduled. Inspect current authority before retrying."}
          </p>
          {new Set(result.acceptedLiabilities.records.map((item) => item.acceptedAllocationId))
            .size > feedback.acceptedLimit && (
            <button
              type="button"
              className="df-secondary-button"
              onClick={() => updateFeedback({ acceptedLimit: feedback.acceptedLimit + 10 })}
            >
              Show more accepted work
            </button>
          )}
          {props.onRetryRealization
            ? [
                ...new Set(
                  result.acceptedLiabilities.records.map((item) => item.acceptedAllocationId),
                ),
              ]
                .slice(0, feedback.acceptedLimit)
                .map((id) => (
                  <button
                    type="button"
                    className="df-secondary-button"
                    key={id}
                    disabled={
                      pending !== null ||
                      feedback.requireReview ||
                      result.queryState !== "current" ||
                      result.acceptedLiabilities.availability !== "available"
                    }
                    onClick={() => void retryRealization(id)}
                  >
                    Retry scheduling accepted work
                  </button>
                ))
            : null}
        </section>
      ) : null}
      {result.scheduledReality.availability !== "available" ? (
        <p className="df-warning-message">
          Readable prior schedule facts follow. Current schedule-authority coverage is incomplete.
        </p>
      ) : null}
      {props.onGoal &&
        [
          ...new Set([
            ...result.scheduledReality.records.map((item) => item.fact.lineage.goalId),
            ...result.acceptedLiabilities.records.map((item) => item.claim.goalId),
          ]),
        ]
          .slice(0, feedback.acceptedLimit)
          .map((id) => (
            <button
              type="button"
              className="df-secondary-button"
              key={id}
              data-review-return={`goal:${id}`}
              onClick={() => props.onGoal?.(id)}
            >
              Inspect accepted planning: {props.goalNames?.[id] ?? "Goal"}
            </button>
          ))}
      <ScheduledGoalFacts
        qualified={
          result.scheduledReality.availability === "available" &&
          result.scheduledReality.coverage.status === "complete"
        }
        goalNames={props.goalNames ?? {}}
        facts={result.scheduledReality.records
          .slice(0, feedback.scheduledLimit)
          .map((item) => item.fact)}
      />
      {result.scheduledReality.records.length > feedback.scheduledLimit && (
        <button
          type="button"
          className="df-secondary-button"
          onClick={() => updateFeedback({ scheduledLimit: feedback.scheduledLimit + 10 })}
        >
          Show more scheduled work
        </button>
      )}
      <div key="corrections">{props.corrections}</div>
      <section aria-label="Build review">
        <h3>Build this Schedule</h3>
        <p>
          Records immutable schedule evidence for later reporting for {reviewScope.startUserDayDate}{" "}
          through {addUserDayLabels(reviewScope.endUserDayDateExclusive, -1)}. This does not accept
          offers, schedule missing work, or save editor drafts.
        </p>
        <p>
          Saved schedule: {result.preview.freshness}; coverage: {result.preview.coverage}. Required
          Sleep and source protection are included in the canonical readiness above.
        </p>
        <div className="df-screen-actions">
          {readiness.blockers.some(
            (item) => item.action === "generatePreview" || item.action === "refreshPreview",
          ) ? (
            <button className="df-action-button" onClick={props.onGeneratePreview} type="button">
              {result.preview.availability === "unavailable"
                ? "Generate Preview"
                : "Refresh Preview"}
            </button>
          ) : null}
          {props.unresolvedFrictionCount ? (
            <button className="df-secondary-button" onClick={props.onOpenFriction} type="button">
              Resolve schedule conflicts
            </button>
          ) : null}
          <button
            className="df-action-button"
            disabled={!readiness.publicationReady || pending !== null || feedback.requireReview}
            onClick={() => void publish()}
            type="button"
          >
            {pending === "publication"
              ? "Building…"
              : `Build this Schedule: ${reviewScope.startUserDayDate}–${addUserDayLabels(reviewScope.endUserDayDateExclusive, -1)}`}
          </button>
        </div>
        {props.onDay &&
          feedback.publicationResult?.receipt?.isCurrent() &&
          (feedback.publicationResult.status === "published" ||
            feedback.publicationResult.status === "alreadyPublished") && (
            <button
              type="button"
              className="df-secondary-button"
              data-review-return={`built-day:${reviewScope.startUserDayDate}`}
              onClick={() => props.onDay?.(reviewScope.startUserDayDate)}
            >
              Open built day: {reviewScope.startUserDayDate}
            </button>
          )}
      </section>
    </section>
  );
}

function publicationFailureMessage(
  reason: Exclude<PublishScheduleRangeFailureReasonV1, "publicationSourceUnqualified">,
) {
  if (reason === "contextReplaced")
    return "The schedule context changed. Review the current schedule before publishing.";
  if (reason === "publicationBusy")
    return "Authority replacement is still finishing. Publication was not started. Review again after it finishes.";
  if (reason === "pendingPublication")
    return "This matching publication is pending persistence, not durably published. Its existing persistence status must be resolved before publishing again.";
  if (reason === "sourceChanged")
    return "The schedule changed since this review. Refresh the Preview and review again before publishing.";
  if (reason === "previewMissing" || reason === "previewStale" || reason === "previewRangeMismatch")
    return "Preview is no longer current for this range. Refresh it and review again.";
  if (reason === "frictionUnresolved") return "Resolve schedule conflicts before publishing.";
  if (reason === "acceptedAllocationUnrealized")
    return "Accepted scheduling authority must be realized before publishing.";
  if (reason === "historicalPlanProtected")
    return "Saved plan history is protected. Publication is blocked until it can be read safely.";
  if (reason === "historicalPlanUnavailable")
    return "Saved plan history is unavailable. Publication cannot proceed safely.";
  if (reason === "verificationFailedAfterCommit")
    return "The plan was written, but verification failed. History is protected; do not publish again until the saved plan can be verified.";
  if (reason === "commitStateUncertain" || reason === "persistenceFailure")
    return "The publication result could not be confirmed. History may have been saved. Do not publish again until its status can be verified.";
  if (reason === "writeFailedBeforeCommit")
    return "The publication transaction failed before committing. No new plan was saved.";
  if (reason === "tryPreview")
    return "Accept or discard the trial change, then refresh and review before publishing.";
  const remaining: Record<typeof reason, string> = {
    invalidPublicationRange: "The publication period is invalid. Review its dates before building.",
    planningCoverageIncomplete: "Planning information does not cover this publication period.",
    queryFailure: "Current Review evidence could not be read. Publication was not started.",
    materializationFailure:
      "The saved schedule could not supply complete publication evidence. Review the current blockers before building.",
  };
  return remaining[reason];
}

function realizationMessage(outcome: RealizationCommandResultV1): string {
  if (outcome.status === "realized" || outcome.status === "alreadyRealized")
    return outcome.reviewRequired
      ? "Accepted work was saved. The current schedule needs review."
      : "Accepted work is scheduled. Refresh the schedule and review it before explicit publication.";
  const reason = outcome.reasons.map((value) => realizationReasons[value]).join(" ");
  if (
    outcome.status === "unconfirmed" ||
    outcome.status === "protected" ||
    outcome.status === "rejected"
  )
    return reason;
  return `Acceptance is saved, but scheduling has not completed. ${reason}`;
}
function decisionMessage(value: ProposalOutcome): string {
  switch (value.status) {
    case "unconfirmed":
      return value.reason === "commitStateUncertain"
        ? "The decision may have been saved, but its outcome is unconfirmed. Authority is protected; do not accept again."
        : "The decision write completed, but verification failed. Authority is protected; scheduling was not started.";
    case "rejected": {
      if (value.reason === "stale" || value.reason === "conflictingClaim")
        return "This Proposal is out of date. Evaluate the planning opportunity again before accepting. No new acceptance was made.";
      if (value.reason === "proposalBusy")
        return "Another decision is finishing. Try again after it settles.";
      if (value.reason === "contextReplaced")
        return "The decision belongs to an earlier state. Review the current state.";
      if (value.reason === "sourceChanged")
        return "Saved planning information changed. Review it before deciding again.";
      if (value.reason === "protected" || value.reason === "authorityProtected")
        return "Decision authority is protected. Its evidence has been preserved.";
      if (value.reason === "replacementBusy" || value.reason === "authorityTransactionActive")
        return "Clear or restore is in progress. Wait for it to finish.";
      const remaining: Record<typeof value.reason, string> = {
        authorityUnavailable:
          "Decision authority is unavailable. Review again when it can be read safely.",
        initializing:
          "Decision authority is still loading. Wait for the current evidence before deciding.",
        notFound: "This Proposal revision is no longer available. Review current offers.",
        notActionable:
          "This Proposal revision no longer supports that decision. Review current offers.",
        invalidInput:
          "The decision input could not be validated. Review the current Proposal before deciding.",
        allocationFailure:
          "A decision identity could not be allocated. The decision was not recorded.",
        persistenceFailure: "The decision was not recorded; existing authority is unchanged.",
      };
      return remaining[value.reason];
    }
    case "accepted":
      if ("realization" in value.value && !hasCurrentAcceptanceReceipt(value.value.realization))
        return "Decision recorded. Its scheduling outcome belongs to an earlier context; review current authority before taking another action.";
      if ("realization" in value.value)
        return `Decision recorded. ${realizationMessage(value.value.realization as RealizationCommandResultV1)}`;
      return "Decision recorded. Review state refreshed.";
  }
}
