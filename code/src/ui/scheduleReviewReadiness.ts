import type { PlanningReviewReadModelV1 } from "../state/planningScopeQuery.js";

export type ScheduleReviewReasonCodeV1 =
  | "planningCoverageIncomplete"
  | "planningCoverageUnknown"
  | "previewMissing"
  | "previewStale"
  | "previewRangeMismatch"
  | "frictionUnresolved"
  | "acceptedAllocationUnrealized"
  | "publicationRangeInvalid"
  | "proposalDecisionPending";
export type ScheduleReviewAttentionV1 = {
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
  "planningCoverageUnknown",
  "planningCoverageIncomplete",
  "previewMissing",
  "previewStale",
  "previewRangeMismatch",
  "frictionUnresolved",
  "acceptedAllocationUnrealized",
  "publicationRangeInvalid",
  "proposalDecisionPending",
];

export function deriveScheduleReviewReadiness(input: {
  model: PlanningReviewReadModelV1;
  unresolvedFrictionCount: number;
  publicationRangeValid: boolean;
}): ScheduleReviewReadinessV1 {
  const attention: ScheduleReviewAttentionV1[] = [];
  if (input.model.planningDataCoverage === "unknown" || input.model.planningDataCoverage === "none")
    attention.push(
      reason("planningCoverageUnknown", "Planning-data coverage is unknown for this period."),
    );
  else if (input.model.planningDataCoverage === "partial")
    attention.push(
      reason("planningCoverageIncomplete", "Planning data covers only part of this period."),
    );
  if (input.model.preview.availability === "unavailable")
    attention.push(
      reason("previewMissing", "Generate a Preview for this review period.", "generatePreview"),
    );
  else {
    if (input.model.preview.freshness === "stale")
      attention.push(
        reason(
          "previewStale",
          "Setup or schedule changed; refresh Preview before review.",
          "refreshPreview",
        ),
      );
    if (input.model.preview.coverage !== "covers")
      attention.push(
        reason(
          "previewRangeMismatch",
          "Preview does not cover the full Review Scope.",
          "generatePreview",
        ),
      );
  }
  if (input.unresolvedFrictionCount > 0)
    attention.push(
      reason(
        "frictionUnresolved",
        `${input.unresolvedFrictionCount} unresolved schedule conflict${input.unresolvedFrictionCount === 1 ? "" : "s"} require attention.`,
        "resolveFriction",
      ),
    );
  if (input.model.acceptedLiabilities.length > 0)
    attention.push(
      reason(
        "acceptedAllocationUnrealized",
        `${input.model.acceptedLiabilities.length} accepted resource claim${input.model.acceptedLiabilities.length === 1 ? " is" : "s are"} awaiting realization.`,
        "inspectAccepted",
      ),
    );
  if (!input.publicationRangeValid)
    attention.push(reason("publicationRangeInvalid", "The explicit Publication Range is invalid."));
  if (input.model.proposals.length > 0)
    attention.push({
      code: "proposalDecisionPending",
      attention: "warning",
      blocksReview: false,
      blocksPublication: false,
      message: `${input.model.proposals.length} constructive Proposal${input.model.proposals.length === 1 ? " is" : "s are"} awaiting a decision.`,
      action: "decideProposal",
    });
  attention.sort((a, b) => order.indexOf(a.code) - order.indexOf(b.code));
  const blockers = attention.filter((value) => value.attention === "blocking");
  return {
    version: 1,
    reviewReady: !blockers.some((value) => value.blocksReview),
    publicationReady: !blockers.some((value) => value.blocksPublication),
    blockers,
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
