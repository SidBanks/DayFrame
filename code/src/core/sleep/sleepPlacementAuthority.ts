import { getPlanDecisionTargetKey, type PlanDecisionV1 } from "../decisions/planDecision.js";
import type { SleepResolutionV1, ScheduledSleepOccurrenceV1 } from "./sleepResolution.js";
import { solveRequiredSleep } from "./solveRequiredSleep.js";

export type SleepPlacementReviewV1 = {
  decisionId: string;
  target: PlanDecisionV1["target"];
  status: "applicable" | "reviewRequired" | "inapplicable" | "revoked";
  reason:
    | "compatible"
    | "revoked"
    | "sourceOrOccurrenceUnavailable"
    | "incompatibleRequirement"
    | "pinConflict"
    | "underlyingInfeasibility"
    | "unresolvedFoundation";
};
export type SleepPlacementEvidenceV1 = {
  placementReviews?: SleepPlacementReviewV1[];
  underlyingStatus?: SleepResolutionV1["status"];
  /** Diagnostic only: never qualifies Capacity or becomes a planning witness. */
  unconstrainedOccurrences?: ScheduledSleepOccurrenceV1[];
};

/** Both searches use the same full domains, blockers and deterministic solver. */
export function solveSleepPlacementAuthority(
  input: Parameters<typeof solveRequiredSleep>[0],
  decisions: readonly PlanDecisionV1[],
): SleepResolutionV1 {
  const baseline = solveRequiredSleep(input);
  const reviews: SleepPlacementReviewV1[] = [];
  const exactPlacements: NonNullable<
    Parameters<typeof solveRequiredSleep>[0]["exactPlacements"]
  >[number][] = [];
  for (const d of [...decisions].sort((a, b) => a.id.localeCompare(b.id))) {
    if (d.kind !== "placeSleepOccurrence" || d.target.sourceKind !== "sleepRequirement") continue;
    const p = d.payload;
    const day = d.target.coordinate.userDayDate;
    const occurrence = input.occurrences.find(
      (o) => getPlanDecisionTargetKey(o.reference) === getPlanDecisionTargetKey(d.target),
    );
    const relevant =
      occurrence ||
      (day >= input.ownerRange.startUserDayDate &&
        day < input.ownerRange.endUserDayDateExclusive) ||
      (Date.parse(p.footprintStart) < Date.parse(input.physicalContext.endsAt) &&
        Date.parse(p.footprintEnd) > Date.parse(input.physicalContext.startsAt));
    if (!relevant) continue;
    const base = { decisionId: d.id, target: structuredClone(d.target) };
    if (p.revokedAt !== null) {
      reviews.push({ ...base, status: "revoked", reason: "revoked" });
      continue;
    }
    if (!occurrence) {
      reviews.push({ ...base, status: "inapplicable", reason: "sourceOrOccurrenceUnavailable" });
      continue;
    }
    const w = occurrence.derivationContext.physicalWindow;
    if (
      p.durationMinutes !== occurrence.durationMinutes ||
      p.bufferBeforeMinutes !== occurrence.bufferBeforeMinutes ||
      p.bufferAfterMinutes !== occurrence.bufferAfterMinutes ||
      Date.parse(p.footprintStart) < Date.parse(w.startsAt) ||
      Date.parse(p.footprintEnd) > Date.parse(w.endsAt)
    ) {
      reviews.push({ ...base, status: "reviewRequired", reason: "incompatibleRequirement" });
      continue;
    }
    exactPlacements.push({ reference: occurrence.reference, sleepStart: p.sleepStart });
    reviews.push({ ...base, status: "applicable", reason: "compatible" });
  }
  if (!reviews.some((r) => r.status !== "revoked"))
    return { ...baseline, placementReviews: reviews };
  const constrained = reviews.some(
    (r) => r.status === "inapplicable" || r.status === "reviewRequired",
  )
    ? undefined
    : solveRequiredSleep({ ...input, exactPlacements });
  if (constrained?.status === "satisfied")
    return { ...constrained, placementReviews: reviews, underlyingStatus: baseline.status };
  for (const r of reviews)
    if (r.status === "applicable") {
      r.status = "reviewRequired";
      r.reason =
        baseline.status === "infeasible"
          ? "underlyingInfeasibility"
          : baseline.status === "satisfied" && constrained?.status === "infeasible"
            ? "pinConflict"
            : "unresolvedFoundation";
    }
  if (baseline.status === "infeasible")
    return { ...baseline, placementReviews: reviews, underlyingStatus: baseline.status };
  return {
    version: 1,
    ownerRange: structuredClone(input.ownerRange),
    status: "contextIncomplete",
    reason: "acceptedSleepPlacementReviewRequired",
    placementReviews: reviews,
    underlyingStatus: baseline.status,
    ...(baseline.status === "satisfied" ? { unconstrainedOccurrences: baseline.occurrences } : {}),
  };
}
