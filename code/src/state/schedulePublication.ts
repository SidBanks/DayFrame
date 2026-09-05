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
import type { PlanningReviewReadModelV1 } from "./planningScopeQuery.js";
import type {
  DayFrameAuthoredSetup,
  DayFrameState,
  PublishScheduleRangeInputV1,
  PublishScheduleRangeResultV1,
} from "./types.js";

export async function publishScheduleRangeV1(options: {
  input: PublishScheduleRangeInputV1;
  getState: () => DayFrameState;
  getAuthoredSetup: () => DayFrameAuthoredSetup;
  listGoals: () => GoalV1[];
  queryPlanningReview: (input: {
    reviewScope: ReviewScopeV1;
    historyAsOf: string;
  }) => Promise<PlanningReviewReadModelV1>;
  historicalPlan: Pick<HistoricalPlanSurface, "publishAtomically">;
  recordResult: (
    result:
      | HistoricalPlanPublicationResult
      | Exclude<MaterializePlanPublicationResult, { status: "materialized" }>,
  ) => void;
}): Promise<PublishScheduleRangeResultV1> {
  const { input } = options;
  if (validateCanonicalUserDayRange(input.publicationRange).status === "invalid")
    return { status: "rejected", reason: "invalidPublicationRange" };
  const state = options.getState();
  const reviewScope = createReviewScope({
    kind: "custom",
    anchorUserDayDate: input.publicationRange.startUserDayDate,
    weekStartsOn: state.schedulingPreferences.weekStartsOn,
    source: "explicit",
    customRange: input.publicationRange,
  });
  let review: PlanningReviewReadModelV1;
  try {
    review = await options.queryPlanningReview({ reviewScope, historyAsOf: input.publishedAt });
  } catch {
    return { status: "rejected", reason: "queryFailure" };
  }
  if (review.planningDataCoverage !== "complete")
    return { status: "rejected", reason: "planningCoverageIncomplete" };
  if (review.preview.availability === "unavailable")
    return { status: "rejected", reason: "previewMissing" };
  if (review.preview.freshness !== "current") return { status: "rejected", reason: "previewStale" };
  if (review.preview.coverage !== "covers")
    return { status: "rejected", reason: "previewRangeMismatch" };
  if (review.unresolvedFrictionCount) return { status: "rejected", reason: "frictionUnresolved" };
  if (review.acceptedLiabilities.length)
    return { status: "rejected", reason: "acceptedAllocationUnrealized" };
  if (review.sourceFingerprint !== input.expectedSourceFingerprint)
    return { status: "rejected", reason: "sourceChanged" };
  const materialized = materializePlanPublication({
    authoredSetup: options.getAuthoredSetup(),
    preview: options.getState().preview,
    goals: options.listGoals(),
    publicationRange: input.publicationRange,
    providers: { now: () => input.publishedAt },
  });
  if (materialized.status !== "materialized") {
    options.recordResult(materialized);
    return { status: "rejected", reason: "materializationFailure" };
  }
  const persisted = await options.historicalPlan.publishAtomically(materialized.batch);
  options.recordResult(persisted);
  if (persisted.status === "publishedAndDurable")
    return {
      status: "published",
      batchId: persisted.batch.id,
      publishedAt: persisted.batch.publishedAt,
    };
  if (persisted.status === "identicalNoOp") return { status: "alreadyPublished" };
  return { status: "rejected", reason: "persistenceFailure" };
}
