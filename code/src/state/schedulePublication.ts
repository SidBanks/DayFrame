import {
  checkReviewSources,
  getReviewSources,
  qualificationFailure,
} from "./reviewSourceQualification.js";
import { withPublicationReceipt } from "./publicationReceipt.js";
import type { PublicationOrigin } from "./historicalPlanSurface.js";
import { capacityFingerprint } from "../core/planning/capacityFingerprint.js";
import { publicationBlockers } from "./publicationEligibility.js";
import {
  materializePlanPublication,
  type MaterializePlanPublicationResult,
} from "../core/historicalPlan/materializePlanPublication.js";
import type { GoalV1 } from "../core/goals/goal.js";
import type { ReviewScopeV1 } from "../core/planning/planningScope.js";
import { validateCanonicalUserDayRange } from "../core/planning/planningScope.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
import type {
  HistoricalPlanPublicationResult,
  HistoricalPlanSurface,
} from "./historicalPlanSurface.js";
import type { PlanningReviewReadModelV2 } from "./planningScopeQuery.js";
import type {
  DayFrameAuthoredSetup,
  DayFrameState,
  PublishScheduleRangeInputV1,
  PublishScheduleRangeResultV1,
} from "./types.js";

export async function publishScheduleRangeV1(options: {
  input: PublishScheduleRangeInputV1;
  origin?: PublicationOrigin;
  getState: () => DayFrameState;
  getAuthoredSetup: () => DayFrameAuthoredSetup;
  getSleepAuthority?: () => import("../core/sleep/sleepFoundationalOccupancy.js").SleepFoundationAuthority;
  listGoals: () => GoalV1[];
  queryPlanningReview: (input: {
    reviewScope: ReviewScopeV1;
    historyAsOf: string;
  }) => Promise<PlanningReviewReadModelV2>;
  historicalPlan: Pick<HistoricalPlanSurface, "publishAtomically">;
  recordResult: (
    result:
      | HistoricalPlanPublicationResult
      | Exclude<MaterializePlanPublicationResult, { status: "materialized" }>,
  ) => void;
}): Promise<PublishScheduleRangeResultV1> {
  const input = structuredClone(options.input);
  const origin = options.origin;
  const result = await execute();
  if (result.status === "rejected" && result.reason === "publicationSourceUnqualified")
    options.recordResult(result);
  return origin ? withPublicationReceipt(result, origin) : result;

  async function execute(): Promise<PublishScheduleRangeResultV1> {
    if (origin && !origin.isCurrent()) return { status: "rejected", reason: "contextReplaced" };
    if (validateCanonicalUserDayRange(input.publicationRange).status === "invalid")
      return { status: "rejected", reason: "invalidPublicationRange" };
    const currentAuthorityFingerprint = () =>
      capacityFingerprint({
        setup: options.getAuthoredSetup(),
        preview: options.getState().preview,
        goals: options.listGoals(),
        sleep: options.getSleepAuthority?.() ?? null,
      });
    const capturedAuthority = currentAuthorityFingerprint();
    const state = options.getState();
    const reviewScope = createReviewScope({
      kind: "custom",
      anchorUserDayDate: input.publicationRange.startUserDayDate,
      weekStartsOn: state.schedulingPreferences.weekStartsOn,
      source: "explicit",
      customRange: input.publicationRange,
    });
    let review: PlanningReviewReadModelV2;
    try {
      review = await options.queryPlanningReview({ reviewScope, historyAsOf: input.publishedAt });
    } catch {
      return {
        status: "rejected",
        reason: origin && !origin.isCurrent() ? "contextReplaced" : "queryFailure",
      };
    }
    if (origin && !origin.isCurrent()) return { status: "rejected", reason: "contextReplaced" };
    if (review.queryState === "contextReplaced")
      return { status: "rejected", reason: "contextReplaced" };
    const qualification = qualificationFailure(review.sourceQualification);
    if (qualification) return qualification;
    if (review.queryState === "sourceChanged")
      return { status: "rejected", reason: "sourceChanged" };
    const sourceCheck = checkReviewSources(review);
    if (sourceCheck.status === "rejected") return sourceCheck;
    if (currentAuthorityFingerprint() !== capturedAuthority)
      return { status: "rejected", reason: "sourceChanged" };
    const blocker = publicationBlockers(review)[0];
    if (blocker === "publicationSourceUnqualified")
      return qualificationFailure(review.sourceQualification)!;
    if (blocker) return { status: "rejected", reason: blocker };
    if (review.sourceFingerprint !== input.expectedSourceFingerprint)
      return { status: "rejected", reason: "sourceChanged" };
    const sources = getReviewSources(review)!;
    const materialized = materializePlanPublication({
      authoredSetup: sources.setup,
      sleepAuthority: sources.sleep,
      preview: sources.state.preview,
      goals: sources.goals,
      publicationRange: input.publicationRange,
      providers: { now: () => input.publishedAt },
    });
    if (materialized.status !== "materialized") {
      options.recordResult(materialized);
      return { status: "rejected", reason: "materializationFailure" };
    }
    const persisted = await options.historicalPlan.publishAtomically(materialized.batch, {
      isCurrent: () => true,
      checkSources: () => checkReviewSources(review),
      ...(origin ? { origin } : {}),
      recordResult: options.recordResult,
    });
    if (!origin) options.recordResult(persisted);
    if (persisted.status === "rejected") return persisted;
    if (persisted.status === "identicalPending")
      return { status: "rejected", reason: "pendingPublication" };
    if (persisted.status === "publishedAndDurable")
      return {
        status: "published",
        batchId: persisted.batch.id,
        publishedAt: persisted.batch.publishedAt,
        ...(persisted.reviewRequired ? { reviewRequired: true as const } : {}),
        ...(persisted.sourceIssues ? { sourceIssues: persisted.sourceIssues } : {}),
      };
    if (persisted.status === "identicalNoOp")
      return {
        status: "alreadyPublished",
        ...(persisted.reviewRequired ? { reviewRequired: true as const } : {}),
        ...(persisted.sourceIssues ? { sourceIssues: persisted.sourceIssues } : {}),
      };
    const reason =
      persisted.status === "publicationBlockedProtected"
        ? "historicalPlanProtected"
        : persisted.status === "verificationFailedAfterCommit"
          ? "verificationFailedAfterCommit"
          : persisted.status === "commitStateUncertain"
            ? "commitStateUncertain"
            : persisted.status === "writeFailedBeforeCommit"
              ? "writeFailedBeforeCommit"
              : persisted.status === "materializationUnavailable"
                ? "historicalPlanUnavailable"
                : "materializationFailure";
    return { status: "rejected", reason };
  }
}
