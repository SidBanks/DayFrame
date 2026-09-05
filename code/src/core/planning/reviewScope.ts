import type { LocalDateString } from "../shifts/types.js";
import { addUserDayLabels } from "../time/canonicalUserDay.js";
import type { Weekday } from "../time/types.js";
import { capacityFingerprint } from "./capacityFingerprint.js";
import {
  CANONICAL_USER_DAY_RANGE_POLICY_V1,
  canonicalUserDayRange,
  containsRange,
  intersectsRange,
  type CanonicalUserDayRangeV1,
  type PreviewRangeV1,
  type PublicationRangeV1,
  type PreviewReviewCoverageV1,
  type ReviewScopeKindV1,
  type ReviewScopeV1,
} from "./planningScope.js";

export function assessPreviewReviewCoverage(
  preview: PreviewRangeV1 | undefined,
  review: ReviewScopeV1,
): PreviewReviewCoverageV1 {
  if (!preview || !intersectsRange(preview, review)) return "doesNotCover";
  return containsRange(preview, review) ? "covers" : "partiallyCovers";
}

export function createReviewScope(input: {
  kind: ReviewScopeKindV1;
  anchorUserDayDate: LocalDateString;
  weekStartsOn: Weekday;
  source?: ReviewScopeV1["provenance"]["source"];
  customRange?: Pick<CanonicalUserDayRangeV1, "startUserDayDate" | "endUserDayDateExclusive">;
}): ReviewScopeV1 {
  let range: CanonicalUserDayRangeV1;
  if (input.kind === "day")
    range = canonicalUserDayRange({
      startUserDayDate: input.anchorUserDayDate,
      endUserDayDateExclusive: addUserDayLabels(input.anchorUserDayDate, 1),
    });
  else if (input.kind === "week") {
    const start = startOfWeek(input.anchorUserDayDate, input.weekStartsOn);
    range = canonicalUserDayRange({
      startUserDayDate: start,
      endUserDayDateExclusive: addUserDayLabels(start, 7),
    });
  } else if (input.kind === "month") {
    const start = `${input.anchorUserDayDate.slice(0, 7)}-01` as LocalDateString;
    const date = new Date(`${start}T12:00:00Z`);
    date.setUTCMonth(date.getUTCMonth() + 1);
    range = canonicalUserDayRange({
      startUserDayDate: start,
      endUserDayDateExclusive: date.toISOString().slice(0, 10) as LocalDateString,
    });
  } else {
    if (!input.customRange) throw new RangeError("Custom review scope requires a range.");
    range = canonicalUserDayRange(input.customRange);
  }
  const semantic = {
    policy: CANONICAL_USER_DAY_RANGE_POLICY_V1,
    kind: input.kind,
    range,
    weekStartsOn: input.weekStartsOn,
  };
  return {
    ...range,
    scopeType: "reviewScope",
    kind: input.kind,
    id: capacityFingerprint(semantic),
    policy: CANONICAL_USER_DAY_RANGE_POLICY_V1,
    provenance: {
      source: input.source ?? "navigation",
      ...(input.kind === "week" ? { weekStartsOn: input.weekStartsOn } : {}),
    },
  };
}

export function previewRangeFromReviewScope(review: ReviewScopeV1): PreviewRangeV1 {
  return {
    version: 1,
    scopeType: "previewRange",
    startUserDayDate: review.startUserDayDate,
    endUserDayDateExclusive: review.endUserDayDateExclusive,
    provenance: { source: "reviewScope", reviewScopeId: review.id },
  };
}

export function publicationRangeFromReviewScope(review: ReviewScopeV1): PublicationRangeV1 {
  const range = canonicalUserDayRange(review);
  return {
    ...range,
    scopeType: "publicationRange",
    provenance: { source: "explicitPublication" },
  };
}

function startOfWeek(anchor: LocalDateString, weekStartsOn: Weekday): LocalDateString {
  const names: Weekday[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const date = new Date(`${anchor}T12:00:00Z`);
  return addUserDayLabels(anchor, -((date.getUTCDay() - names.indexOf(weekStartsOn) + 7) % 7));
}
