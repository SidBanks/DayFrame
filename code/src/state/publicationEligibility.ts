import { qualificationFailure } from "./reviewSourceQualification.js";
import type { PlanningReviewReadModelV2 } from "./planningScopeQuery.js";

/** Shared, deterministic preconditions for Review and explicit publication. */
export function publicationBlockers(model: PlanningReviewReadModelV2) {
  const blockers: Array<
    | "publicationSourceUnqualified"
    | "contextReplaced"
    | "sourceChanged"
    | "planningCoverageIncomplete"
    | "previewMissing"
    | "previewStale"
    | "previewRangeMismatch"
    | "frictionUnresolved"
    | "acceptedAllocationUnrealized"
    | "historicalPlanProtected"
    | "historicalPlanUnavailable"
    | "tryPreview"
    | "materializationFailure"
  > = [];
  if (model.queryState === "contextReplaced") blockers.push("contextReplaced");
  if (qualificationFailure(model.sourceQualification))
    blockers.push("publicationSourceUnqualified");
  if (
    model.publicationWitness.status === "blocked" &&
    model.queryState === "current" &&
    !qualificationFailure(model.sourceQualification) &&
    model.publication.availability.status === "available"
  )
    blockers.push("sourceChanged");
  if (model.queryState === "sourceChanged") blockers.push("sourceChanged");
  if (model.planningDataCoverage !== "complete") blockers.push("planningCoverageIncomplete");
  if (model.preview.availability !== "available") blockers.push("previewMissing");
  else {
    if (model.preview.freshness !== "current") blockers.push("previewStale");
    if (model.preview.coverage !== "covers") blockers.push("previewRangeMismatch");
    if (model.preview.revision === "try") blockers.push("tryPreview");
  }
  if (model.unresolvedFrictionCount > 0) blockers.push("frictionUnresolved");
  if (
    model.sourceQualification.realization.status === "qualified" &&
    model.acceptedLiabilities.records.length > 0
  )
    blockers.push("acceptedAllocationUnrealized");
  if (model.publication.availability?.status === "protected")
    blockers.push("historicalPlanProtected");
  else if (model.publication.availability?.status !== "available")
    blockers.push("historicalPlanUnavailable");
  if (
    model.publication.materialization?.status !== "eligible" &&
    !blockers.some((code) =>
      ["previewMissing", "previewStale", "previewRangeMismatch", "tryPreview"].includes(code),
    )
  )
    blockers.push("materializationFailure");
  return blockers;
}
