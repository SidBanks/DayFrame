import type { HistoricalPlanContext, HistoricalPlanDayPublicationV1 } from
  "../historicalPlan/historicalPlan.js";
import type { DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import { HISTORICAL_METRIC_POLICY_V1, validateHistoricalCompletionDistributionQuery,
  type HistoricalCompletionDistributionQueryIssue,
  type HistoricalCompletionDistributionQueryV1, type HistoricalMetricPolicyV1 } from
  "./completionDistribution.js";
import { resolveHistoricalPlanCoverageV1, type HistoricalPlanCoverageV1,
  type HistoricalPlanEvidenceV1 } from "./historicalPlanCoverage.js";

export const SCHEDULING_REALIZATION_METRIC_V1 = {
  id: "schedulingRealization",
  version: 1,
} as const;

export type HistoricalSchedulingRealizationQueryV1 = HistoricalCompletionDistributionQueryV1;
export type SchedulingRealizationCategoryV1 = HistoricalPlanContext["state"];
export type SchedulingRealizationCountsV1 = {
  intendedOccurrenceCount: number;
  scheduled: number;
  unplaced: number;
  omitted: number;
  blocked: number;
};
export type SchedulingRealizationDistributionV1 = SchedulingRealizationCountsV1 & {
  status: "available" | "notApplicable" | "unavailable";
};
export type SchedulingRealizationLimitationV1 = "incompletePlanCoverage" |
  "noPlanCoverage" | "zeroIntendedOccurrences";
export type SchedulingRealizationProvenanceV1 = {
  userDayDate: LocalDateString;
  reference: DurableOccurrenceReference;
  sourceFamily: HistoricalPlanDayPublicationV1["occurrences"][number]["sourceFamily"];
  title: string;
  category: HistoricalPlanDayPublicationV1["occurrences"][number]["category"];
  planningDisposition: SchedulingRealizationCategoryV1;
  plan: HistoricalPlanContext;
  batchId: string;
  publishedAt: string;
};

export type HistoricalSchedulingRealizationResultV1 =
  | { status: "invalidQuery"; issues: HistoricalCompletionDistributionQueryIssue[] }
  | {
      status: "projected";
      metric: typeof SCHEDULING_REALIZATION_METRIC_V1;
      policy: HistoricalMetricPolicyV1;
      query: HistoricalSchedulingRealizationQueryV1;
      planCoverage: HistoricalPlanCoverageV1;
      distribution: SchedulingRealizationDistributionV1;
      limitations: SchedulingRealizationLimitationV1[];
      provenance: {
        occurrences: SchedulingRealizationProvenanceV1[];
        missingPlanUserDayDates: LocalDateString[];
      };
    };

export function projectHistoricalSchedulingRealizationV1(input: {
  query: HistoricalSchedulingRealizationQueryV1;
  days: readonly HistoricalPlanEvidenceV1[];
  missingUserDayDates: readonly LocalDateString[];
}): HistoricalSchedulingRealizationResultV1 {
  const issues = validateHistoricalCompletionDistributionQuery(input.query);
  if (issues.length) return { status: "invalidQuery", issues };
  const resolved = resolveHistoricalPlanCoverageV1({
    startUserDayDate: input.query.startUserDayDate,
    endUserDayDate: input.query.endUserDayDate,
    evaluationAsOf: input.query.evaluationAsOf,
    days: input.days,
    missingUserDayDates: input.missingUserDayDates,
  });
  const occurrences: SchedulingRealizationProvenanceV1[] = [];
  for (const evidence of resolved.days) for (const occurrence of evidence.day.occurrences) {
    occurrences.push({
      userDayDate: evidence.day.userDayDate,
      reference: structuredClone(occurrence.reference),
      sourceFamily: occurrence.sourceFamily,
      title: occurrence.title,
      category: occurrence.category,
      planningDisposition: occurrence.plan.state,
      plan: { ...occurrence.plan },
      batchId: evidence.batchId,
      publishedAt: evidence.publishedAt,
    });
  }
  occurrences.sort(compareProvenance);
  const counts: SchedulingRealizationCountsV1 = {
    intendedOccurrenceCount: occurrences.length,
    scheduled: occurrences.filter((value) => value.planningDisposition === "scheduled").length,
    unplaced: occurrences.filter((value) => value.planningDisposition === "unplaced").length,
    omitted: occurrences.filter((value) => value.planningDisposition === "omitted").length,
    blocked: occurrences.filter((value) => value.planningDisposition === "blocked").length,
  };
  const unavailable = resolved.coverage.status === "unavailable";
  const zero = counts.intendedOccurrenceCount === 0;
  const distribution: SchedulingRealizationDistributionV1 = {
    ...counts,
    status: unavailable ? "unavailable" : zero ? "notApplicable" : "available",
  };
  const limitations: SchedulingRealizationLimitationV1[] = [
    ...(resolved.coverage.status === "incompleteCoverage"
      ? ["incompletePlanCoverage" as const] : []),
    ...(unavailable ? ["noPlanCoverage" as const] : []),
    ...(!unavailable && zero ? ["zeroIntendedOccurrences" as const] : []),
  ];
  return structuredClone({
    status: "projected",
    metric: SCHEDULING_REALIZATION_METRIC_V1,
    policy: HISTORICAL_METRIC_POLICY_V1,
    query: input.query,
    planCoverage: resolved.coverage,
    distribution,
    limitations,
    provenance: { occurrences, missingPlanUserDayDates: resolved.coverage.missingUserDayDates },
  });
}

function compareProvenance(left: SchedulingRealizationProvenanceV1,
  right: SchedulingRealizationProvenanceV1): number {
  const start = (value: SchedulingRealizationProvenanceV1) =>
    value.plan.state === "scheduled" ? value.plan.startsAt : "";
  return left.userDayDate.localeCompare(right.userDayDate) ||
    start(left).localeCompare(start(right)) ||
    JSON.stringify(left.reference).localeCompare(JSON.stringify(right.reference));
}
