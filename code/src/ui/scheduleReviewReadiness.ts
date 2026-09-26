import { sourceIssues, type PublicationSourceIssue } from "../state/reviewSourceQualification.js";
import { publicationSourceMessage } from "./reviewSourceFeedback.js";
import { publicationBlockers } from "../state/publicationEligibility.js";
import type { PlanningReviewReadModelV2 } from "../state/planningScopeQuery.js";

export type ScheduleReviewReasonCodeV1 =
  | "publicationSourceUnqualified"
  | "sourceChanged"
  | "contextReplaced"
  | "planningCoverageIncomplete"
  | "planningCoverageUnknown"
  | "previewMissing"
  | "previewStale"
  | "previewRangeMismatch"
  | "frictionUnresolved"
  | "acceptedAllocationUnrealized"
  | "publicationRangeInvalid"
  | "proposalDecisionPending"
  | "historicalPlanProtected"
  | "historicalPlanUnavailable"
  | "tryPreview"
  | "materializationFailure";
export type ScheduleReviewAttentionV1 = {
  sourceIssues?: readonly PublicationSourceIssue[];
  code: ScheduleReviewReasonCodeV1;
  attention: "blocking" | "warning" | "informational";
  blocksReview: boolean;
  blocksPublication: boolean;
  message: string;
  action?:
    | "generatePreview"
    | "refreshPreview"
    | "resolveFriction"
    | "inspectAccepted"
    | "decideProposal";
};
export type ScheduleReviewReadinessV1 = {
  version: 1;
  reviewReady: boolean;
  publicationReady: boolean;
  blockers: ScheduleReviewAttentionV1[];
  warnings: ScheduleReviewAttentionV1[];
  informational: ScheduleReviewAttentionV1[];
};

const order: ScheduleReviewReasonCodeV1[] = [
  "contextReplaced",
  "publicationSourceUnqualified",
  "sourceChanged",
  "planningCoverageUnknown",
  "planningCoverageIncomplete",
  "previewMissing",
  "previewStale",
  "previewRangeMismatch",
  "frictionUnresolved",
  "acceptedAllocationUnrealized",
  "publicationRangeInvalid",
  "historicalPlanProtected",
  "historicalPlanUnavailable",
  "tryPreview",
  "materializationFailure",
  "proposalDecisionPending",
];

export function deriveScheduleReviewReadiness(input: {
  model: PlanningReviewReadModelV2;
  unresolvedFrictionCount: number;
  publicationRangeValid: boolean;
}): ScheduleReviewReadinessV1 {
  const attention: ScheduleReviewAttentionV1[] = [];
  const blockers = publicationBlockers({
    ...input.model,
    unresolvedFrictionCount: Math.max(
      input.unresolvedFrictionCount,
      input.model.unresolvedFrictionCount ?? 0,
    ),
  });
  for (const code of blockers) {
    switch (code) {
      case "publicationSourceUnqualified": {
        const issues = sourceIssues(input.model.sourceQualification);
        attention.push({ ...reason(code, publicationSourceMessage(issues)), sourceIssues: issues });
        break;
      }
      case "sourceChanged":
      case "contextReplaced":
        attention.push(
          reason(
            code,
            "Required sources changed during Review. Refresh this review before publishing.",
          ),
        );
        break;
      case "planningCoverageIncomplete":
        attention.push(
          input.model.planningDataCoverage === "partial"
            ? reason(code, "Planning data covers only part of this period.")
            : reason(
                "planningCoverageUnknown",
                "Planning-data coverage is unknown for this period.",
              ),
        );
        break;
      case "previewMissing":
        attention.push(
          reason(code, "Generate a Preview for this review period.", "generatePreview"),
        );
        break;
      case "previewStale":
        attention.push(
          reason(
            code,
            "Setup or schedule changed; refresh Preview before review.",
            "refreshPreview",
          ),
        );
        break;
      case "previewRangeMismatch":
        attention.push(
          reason(code, "Preview does not cover the full Review Scope.", "generatePreview"),
        );
        break;
      case "frictionUnresolved":
        attention.push(
          reason(code, "Resolve schedule conflicts before publishing.", "resolveFriction"),
        );
        break;
      case "acceptedAllocationUnrealized":
        attention.push(
          reason(code, "Accepted resource claims are awaiting realization.", "inspectAccepted"),
        );
        break;
      case "historicalPlanProtected":
        attention.push({
          ...reason(
            code,
            "Saved plan history is protected. Publication is blocked until it can be read safely.",
          ),
          blocksReview: false,
        });
        break;
      case "historicalPlanUnavailable":
        attention.push({
          ...reason(
            code,
            "Saved plan history is unavailable or not yet durable. Publication cannot proceed safely.",
          ),
          blocksReview: false,
        });
        break;
      case "tryPreview":
        attention.push({
          ...reason(
            code,
            "This schedule contains a trial change. Accept or discard it, then refresh before publishing.",
            "refreshPreview",
          ),
          blocksReview: false,
        });
        break;
      case "materializationFailure":
        attention.push({
          ...reason(
            code,
            "This schedule cannot be saved as a published plan. Refresh and review the schedule.",
            "refreshPreview",
          ),
          blocksReview: false,
        });
        break;
    }
  }
  if (!input.publicationRangeValid)
    attention.push(reason("publicationRangeInvalid", "The explicit Publication Range is invalid."));
  if (
    input.model.proposals.availability === "available" &&
    input.model.proposals.coverage.status === "complete" &&
    input.model.proposals.records.length > 0
  )
    attention.push({
      code: "proposalDecisionPending",
      attention: "warning",
      blocksReview: false,
      blocksPublication: false,
      message: `${input.model.proposals.records.length} constructive Proposal${input.model.proposals.records.length === 1 ? " is" : "s are"} awaiting a decision.`,
      action: "decideProposal",
    });
  attention.sort((a, b) => order.indexOf(a.code) - order.indexOf(b.code));
  const blockingAttention = attention.filter((value) => value.attention === "blocking");
  return {
    version: 1,
    reviewReady: !blockingAttention.some((value) => value.blocksReview),
    publicationReady: !blockingAttention.some((value) => value.blocksPublication),
    blockers: blockingAttention,
    warnings: attention.filter((value) => value.attention === "warning"),
    informational: attention.filter((value) => value.attention === "informational"),
  };
}

function reason(
  code: Exclude<ScheduleReviewReasonCodeV1, "proposalDecisionPending">,
  message: string,
  action?: ScheduleReviewAttentionV1["action"],
): ScheduleReviewAttentionV1 {
  return {
    code,
    attention: "blocking",
    blocksReview: true,
    blocksPublication: true,
    message,
    ...(action ? { action } : {}),
  };
}
