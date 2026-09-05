import { addUserDayLabels } from "../time/canonicalUserDay.js";
import type { LocalDateString } from "../shifts/types.js";
import type { Weekday } from "../time/types.js";

export const CANONICAL_USER_DAY_RANGE_POLICY_V1 = {
  id: "canonical-user-day-range",
  version: 1,
  convention: "halfOpen",
} as const;

export type CanonicalUserDayRangeV1 = {
  version: 1;
  startUserDayDate: LocalDateString;
  endUserDayDateExclusive: LocalDateString;
};
export type PlanningDataHorizonV1 = CanonicalUserDayRangeV1 & {
  scopeType: "planningDataHorizon";
};
export type ProposalHorizonV1 = {
  startUserDayDate: string;
  endUserDayDateExclusive: string;
};
export type ReviewScopeKindV1 = "day" | "week" | "month" | "custom";
export type ReviewScopeV1 = CanonicalUserDayRangeV1 & {
  scopeType: "reviewScope";
  kind: ReviewScopeKindV1;
  id: string;
  policy: typeof CANONICAL_USER_DAY_RANGE_POLICY_V1;
  provenance: { source: "productDefault" | "navigation" | "explicit"; weekStartsOn?: Weekday };
};
export type PreviewRangeV1 = CanonicalUserDayRangeV1 & {
  scopeType: "previewRange";
  provenance: { source: "reviewScope" | "legacyPreviewRange"; reviewScopeId?: string };
};
export type PublicationRangeV1 = CanonicalUserDayRangeV1 & {
  scopeType: "publicationRange";
  provenance: { source: "explicitPublication" | "legacyHistoricalPlan" };
};
export type PlanningScopeCoverageV1 = "complete" | "partial" | "none" | "unknown";
export type PreviewReviewCoverageV1 = "covers" | "partiallyCovers" | "doesNotCover";
export type PlanningOperationV1 =
  | "demandProjection"
  | "capacity"
  | "feasibility"
  | "competition"
  | "allocation"
  | "proposal"
  | "reviewPlanner"
  | "previewGeneration"
  | "publication";
export type PlanningHorizonExpansionReasonV1 =
  | "canonicalUserDayBoundary"
  | "overnightWork"
  | "supportFootprint"
  | "bufferFootprint"
  | "acceptedLiability"
  | "realizedScheduleContext"
  | "publicationBoundaryContext";
export type PlanningDataHorizonResolutionV1 = {
  version: 1;
  operation: PlanningOperationV1;
  requested: PlanningDataHorizonV1;
  effective: PlanningDataHorizonV1;
  expansionReasons: PlanningHorizonExpansionReasonV1[];
  coverageRequirement: "complete";
};
export type PlanningScopeContextV1 = {
  version: 1;
  planningDataHorizon: PlanningDataHorizonResolutionV1;
  proposalHorizon?: ProposalHorizonV1;
  reviewScope?: ReviewScopeV1;
  previewRange?: PreviewRangeV1;
  publicationRange?: PublicationRangeV1;
};
export type EffectivePreviewGenerationContextV1 = {
  requestedPreviewRange: PreviewRangeV1;
  effectivePlanningDataHorizon: PlanningDataHorizonResolutionV1;
  sourceReviewScope?: ReviewScopeV1;
  canonicalRangePolicy: typeof CANONICAL_USER_DAY_RANGE_POLICY_V1;
};

export type RangeValidationResultV1 =
  | { status: "valid"; range: CanonicalUserDayRangeV1 }
  | { status: "invalid"; reasons: Array<"invalidStart" | "invalidEnd" | "emptyOrReversed"> };

export function validateCanonicalUserDayRange(value: unknown): RangeValidationResultV1 {
  const reasons: Array<"invalidStart" | "invalidEnd" | "emptyOrReversed"> = [];
  if (!record(value) || !validLocalDate(value.startUserDayDate)) reasons.push("invalidStart");
  if (!record(value) || !validLocalDate(value.endUserDayDateExclusive)) reasons.push("invalidEnd");
  if (
    record(value) &&
    typeof value.startUserDayDate === "string" &&
    typeof value.endUserDayDateExclusive === "string" &&
    value.startUserDayDate >= value.endUserDayDateExclusive
  )
    reasons.push("emptyOrReversed");
  return reasons.length
    ? { status: "invalid", reasons }
    : {
        status: "valid",
        range: {
          version: 1,
          startUserDayDate: (value as { startUserDayDate: LocalDateString }).startUserDayDate,
          endUserDayDateExclusive: (value as { endUserDayDateExclusive: LocalDateString })
            .endUserDayDateExclusive,
        },
      };
}

export function canonicalUserDayRange(input: {
  startUserDayDate: LocalDateString;
  endUserDayDateExclusive: LocalDateString;
}): CanonicalUserDayRangeV1 {
  const result = validateCanonicalUserDayRange(input);
  if (result.status === "invalid") throw new RangeError(result.reasons.join(","));
  return result.range;
}

export function containsRange(
  parent: Pick<CanonicalUserDayRangeV1, "startUserDayDate" | "endUserDayDateExclusive">,
  child: Pick<CanonicalUserDayRangeV1, "startUserDayDate" | "endUserDayDateExclusive">,
) {
  return (
    parent.startUserDayDate <= child.startUserDayDate &&
    child.endUserDayDateExclusive <= parent.endUserDayDateExclusive
  );
}

export function intersectsRange(
  left: Pick<CanonicalUserDayRangeV1, "startUserDayDate" | "endUserDayDateExclusive">,
  right: Pick<CanonicalUserDayRangeV1, "startUserDayDate" | "endUserDayDateExclusive">,
) {
  return (
    left.startUserDayDate < right.endUserDayDateExclusive &&
    right.startUserDayDate < left.endUserDayDateExclusive
  );
}

export function equalRange(
  left: Pick<CanonicalUserDayRangeV1, "startUserDayDate" | "endUserDayDateExclusive">,
  right: Pick<CanonicalUserDayRangeV1, "startUserDayDate" | "endUserDayDateExclusive">,
) {
  return (
    left.startUserDayDate === right.startUserDayDate &&
    left.endUserDayDateExclusive === right.endUserDayDateExclusive
  );
}

export function intersectRange(
  left: CanonicalUserDayRangeV1,
  right: CanonicalUserDayRangeV1,
): CanonicalUserDayRangeV1 | undefined {
  if (!intersectsRange(left, right)) return undefined;
  return canonicalUserDayRange({
    startUserDayDate:
      left.startUserDayDate > right.startUserDayDate
        ? left.startUserDayDate
        : right.startUserDayDate,
    endUserDayDateExclusive:
      left.endUserDayDateExclusive < right.endUserDayDateExclusive
        ? left.endUserDayDateExclusive
        : right.endUserDayDateExclusive,
  });
}

export function userDayRangeDuration(range: CanonicalUserDayRangeV1) {
  let count = 0;
  for (
    let value = range.startUserDayDate;
    value < range.endUserDayDateExclusive;
    value = addUserDayLabels(value, 1)
  )
    count += 1;
  return count;
}

export function expandCanonicalUserDayRange(
  range: CanonicalUserDayRangeV1,
  expansion: { beforeUserDays?: number; afterUserDays?: number },
) {
  const before = expansion.beforeUserDays ?? 0,
    after = expansion.afterUserDays ?? 0;
  if (!Number.isInteger(before) || !Number.isInteger(after) || before < 0 || after < 0)
    throw new RangeError("Range expansion must use non-negative whole user-days.");
  return canonicalUserDayRange({
    startUserDayDate: addUserDayLabels(range.startUserDayDate, -before),
    endUserDayDateExclusive: addUserDayLabels(range.endUserDayDateExclusive, after),
  });
}

export function assessRangeCoverage(
  available: CanonicalUserDayRangeV1 | undefined,
  requested: CanonicalUserDayRangeV1,
): PlanningScopeCoverageV1 {
  if (!available) return "unknown";
  if (containsRange(available, requested)) return "complete";
  return intersectsRange(available, requested) ? "partial" : "none";
}

export function previewRangeFromLegacyInclusive(input: {
  rangeStartDate: LocalDateString;
  rangeEndDate: LocalDateString;
}): PreviewRangeV1 {
  return {
    ...canonicalUserDayRange({
      startUserDayDate: input.rangeStartDate,
      endUserDayDateExclusive: addUserDayLabels(input.rangeEndDate, 1),
    }),
    scopeType: "previewRange",
    provenance: { source: "legacyPreviewRange" },
  };
}

export function publicationRangeFromLegacyInclusive(input: {
  startUserDayDate: LocalDateString;
  endUserDayDate: LocalDateString;
}): PublicationRangeV1 {
  return {
    ...canonicalUserDayRange({
      startUserDayDate: input.startUserDayDate,
      endUserDayDateExclusive: addUserDayLabels(input.endUserDayDate, 1),
    }),
    scopeType: "publicationRange",
    provenance: { source: "legacyHistoricalPlan" },
  };
}

export function resolvePlanningDataHorizon(input: {
  operation: PlanningOperationV1;
  requestedRange: Pick<CanonicalUserDayRangeV1, "startUserDayDate" | "endUserDayDateExclusive">;
  requiredContext?: Array<{
    range: Pick<CanonicalUserDayRangeV1, "startUserDayDate" | "endUserDayDateExclusive">;
    reason: PlanningHorizonExpansionReasonV1;
  }>;
  boundaryContext?: boolean;
}): PlanningDataHorizonResolutionV1 {
  const requestedRange = canonicalUserDayRange(input.requestedRange);
  let start = requestedRange.startUserDayDate,
    end = requestedRange.endUserDayDateExclusive;
  const reasons = new Set<PlanningHorizonExpansionReasonV1>();
  if (input.boundaryContext) {
    start = addUserDayLabels(start, -1);
    end = addUserDayLabels(end, 1);
    reasons.add("canonicalUserDayBoundary");
  }
  for (const context of input.requiredContext ?? []) {
    const checked = canonicalUserDayRange(context.range);
    if (checked.startUserDayDate < start) start = checked.startUserDayDate;
    if (checked.endUserDayDateExclusive > end) end = checked.endUserDayDateExclusive;
    if (!containsRange(requestedRange, checked)) reasons.add(context.reason);
  }
  const requested: PlanningDataHorizonV1 = {
      ...requestedRange,
      scopeType: "planningDataHorizon",
    },
    effective: PlanningDataHorizonV1 = {
      ...canonicalUserDayRange({ startUserDayDate: start, endUserDayDateExclusive: end }),
      scopeType: "planningDataHorizon",
    },
    expansionReasons = [...reasons].sort();
  return {
    version: 1,
    operation: input.operation,
    requested,
    effective,
    expansionReasons,
    coverageRequirement: "complete",
  };
}

export function validatePlanningScopeContext(
  context: PlanningScopeContextV1,
): { status: "valid" } | { status: "invalid"; reasons: string[] } {
  const reasons: string[] = [];
  if (!containsRange(context.planningDataHorizon.effective, context.planningDataHorizon.requested))
    reasons.push("effectivePlanningHorizonDoesNotCoverRequested");
  if (
    context.proposalHorizon &&
    !containsRange(
      context.planningDataHorizon.effective,
      context.proposalHorizon as Pick<
        CanonicalUserDayRangeV1,
        "startUserDayDate" | "endUserDayDateExclusive"
      >,
    )
  )
    reasons.push("proposalHorizonOutsidePlanningData");
  return reasons.length ? { status: "invalid", reasons } : { status: "valid" };
}

export function intervalIntersectsUserDayRange(
  value: { startsAt: string; endsAt: string },
  range: CanonicalUserDayRangeV1,
  resolveWindow: (date: LocalDateString) => { start: Date; end: Date },
) {
  const start = resolveWindow(range.startUserDayDate).start.toISOString();
  const endLabel = addUserDayLabels(range.endUserDayDateExclusive, -1);
  const end = resolveWindow(endLabel).end.toISOString();
  return value.startsAt < end && start < value.endsAt;
}

export function visibleInterval(
  value: { startsAt: string; endsAt: string },
  bounds: { startsAt: string; endsAt: string },
) {
  if (!(value.startsAt < bounds.endsAt && bounds.startsAt < value.endsAt)) return undefined;
  return {
    startsAt: value.startsAt > bounds.startsAt ? value.startsAt : bounds.startsAt,
    endsAt: value.endsAt < bounds.endsAt ? value.endsAt : bounds.endsAt,
  };
}

export function expandInstantPlanningWindowForBoundaryContext(
  planningWindowStart: Date,
  planningWindowEnd: Date,
) {
  const start = new Date(planningWindowStart);
  start.setDate(start.getDate() - 1);
  const end = new Date(planningWindowEnd);
  end.setDate(end.getDate() + 1);
  return {
    start,
    end,
  };
}

function validLocalDate(value: unknown): value is LocalDateString {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
