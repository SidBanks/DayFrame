import type { ExecutionRecordV1 } from "../execution/executionRecord.js";
import { buildExecutionHistoryItems } from "../execution/executionHistoryProjection.js";
import type { HistoricalPlanDayPublicationV1 } from "../historicalPlan/historicalPlan.js";
import { durableOccurrenceReferencesEqual, type DurableOccurrenceReference } from
  "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import { resolveHistoricalPlanCoverageV1, type HistoricalPlanCoverageV1,
  type HistoricalPlanEvidenceV1 } from "./historicalPlanCoverage.js";

export type { HistoricalPlanCoverageV1 } from "./historicalPlanCoverage.js";

export const HISTORICAL_METRIC_POLICY_V1 = {
  id: "historicalMetricPolicy",
  version: 1,
} as const;
export const COMPLETION_DISTRIBUTION_METRIC_V1 = {
  id: "completionDistribution",
  version: 1,
} as const;

export type HistoricalMetricPolicyV1 = typeof HISTORICAL_METRIC_POLICY_V1;
export type HistoricalCompletionDistributionQueryV1 = {
  policy: HistoricalMetricPolicyV1;
  startUserDayDate: LocalDateString;
  endUserDayDate: LocalDateString;
  evaluationAsOf: string;
};
export type HistoricalCompletionDistributionQueryIssue =
  | "unsupportedPolicy"
  | "invalidStartUserDayDate"
  | "invalidEndUserDayDate"
  | "invalidRange"
  | "invalidEvaluationAsOf";

export type EffectiveHistoricalPlanDayEvidence = HistoricalPlanEvidenceV1;
export type CompletionDistributionCountsV1 = {
  eligibleScheduledCount: number;
  completed: number;
  partial: number;
  skipped: number;
  unknown: number;
  notReported: number;
};
export type CompletionDistributionV1 = CompletionDistributionCountsV1 & {
  status: "available" | "notApplicable" | "unavailable";
};
export type CurrentOutcomeCoverageV1 =
  | { status: "available"; classifiedCount: number; eligibleCount: number }
  | { status: "notApplicable" | "unavailable"; classifiedCount: 0; eligibleCount: 0 };
export type CompletionClassificationV1 = "completed" | "partial" | "skipped" |
  "unknown" | "notReported";
export type HistoricalOccurrenceExplanationV1 = {
  userDayDate: LocalDateString;
  reference: DurableOccurrenceReference;
  sourceFamily: HistoricalPlanDayPublicationV1["occurrences"][number]["sourceFamily"];
  title: string;
  category: HistoricalPlanDayPublicationV1["occurrences"][number]["category"];
  plan: HistoricalPlanDayPublicationV1["occurrences"][number]["plan"];
  batchId: string;
  publishedAt: string;
};
export type EligibleOccurrenceProvenanceV1 = HistoricalOccurrenceExplanationV1 & {
  reason: "eligibleScheduled";
  classification: CompletionClassificationV1;
};
export type ExcludedOccurrenceProvenanceV1 = HistoricalOccurrenceExplanationV1 & {
  reason: "excludedUnplaced" | "excludedOmitted" | "excludedBlocked";
};
export type HistoricalCompletionDistributionLimitationV1 =
  | "incompletePlanCoverage"
  | "noPlanCoverage"
  | "zeroEligibleOccurrences";

export type HistoricalCompletionDistributionResultV1 =
  | { status: "invalidQuery"; issues: HistoricalCompletionDistributionQueryIssue[] }
  | {
      status: "projected";
      metric: typeof COMPLETION_DISTRIBUTION_METRIC_V1;
      policy: HistoricalMetricPolicyV1;
      query: HistoricalCompletionDistributionQueryV1;
      planCoverage: HistoricalPlanCoverageV1;
      distribution: CompletionDistributionV1;
      currentOutcomeCoverage: CurrentOutcomeCoverageV1;
      limitations: HistoricalCompletionDistributionLimitationV1[];
      provenance: {
        eligible: EligibleOccurrenceProvenanceV1[];
        excluded: ExcludedOccurrenceProvenanceV1[];
        missingPlanUserDayDates: LocalDateString[];
      };
    };

export function validateHistoricalCompletionDistributionQuery(
  query: HistoricalCompletionDistributionQueryV1,
): HistoricalCompletionDistributionQueryIssue[] {
  const issues: HistoricalCompletionDistributionQueryIssue[] = [];
  if (query.policy.id !== HISTORICAL_METRIC_POLICY_V1.id ||
      query.policy.version !== HISTORICAL_METRIC_POLICY_V1.version) issues.push("unsupportedPolicy");
  if (!validLocalDate(query.startUserDayDate)) issues.push("invalidStartUserDayDate");
  if (!validLocalDate(query.endUserDayDate)) issues.push("invalidEndUserDayDate");
  if (validLocalDate(query.startUserDayDate) && validLocalDate(query.endUserDayDate) &&
      query.startUserDayDate > query.endUserDayDate) issues.push("invalidRange");
  if (!canonicalUtc(query.evaluationAsOf)) issues.push("invalidEvaluationAsOf");
  return issues;
}

export function projectHistoricalCompletionDistributionV1(input: {
  query: HistoricalCompletionDistributionQueryV1;
  days: readonly EffectiveHistoricalPlanDayEvidence[];
  missingUserDayDates: readonly LocalDateString[];
  executionRecords: readonly ExecutionRecordV1[];
}): HistoricalCompletionDistributionResultV1 {
  const issues = validateHistoricalCompletionDistributionQuery(input.query);
  if (issues.length) return { status: "invalidQuery", issues };
  const resolved = resolveHistoricalPlanCoverageV1({
    startUserDayDate: input.query.startUserDayDate, endUserDayDate: input.query.endUserDayDate,
    evaluationAsOf: input.query.evaluationAsOf, days: input.days,
    missingUserDayDates: input.missingUserDayDates });
  const planCoverage = resolved.coverage;
  const days = resolved.days;
  const missing = planCoverage.missingUserDayDates;
  const items = buildExecutionHistoryItems(input.executionRecords);
  const eligible: EligibleOccurrenceProvenanceV1[] = [];
  const excluded: ExcludedOccurrenceProvenanceV1[] = [];
  for (const evidence of days) for (const occurrence of evidence.day.occurrences) {
    const explanation = explain(evidence, occurrence);
    if (occurrence.plan.state !== "scheduled") {
      excluded.push({ ...explanation, reason: occurrence.plan.state === "unplaced"
        ? "excludedUnplaced" : occurrence.plan.state === "omitted"
          ? "excludedOmitted" : "excludedBlocked" });
      continue;
    }
    const item = items.find((candidate) => candidate.subject.kind === "planned" &&
      durableOccurrenceReferencesEqual(candidate.subject.reference, occurrence.reference));
    const classification: CompletionClassificationV1 = !item ? "notReported"
      : item.currentOutcome.status === "unknown" ? "unknown" : item.currentOutcome.status;
    eligible.push({ ...explanation, reason: "eligibleScheduled", classification });
  }
  eligible.sort(compareProvenance);
  excluded.sort(compareProvenance);
  const counts: CompletionDistributionCountsV1 = {
    eligibleScheduledCount: eligible.length,
    completed: eligible.filter((value) => value.classification === "completed").length,
    partial: eligible.filter((value) => value.classification === "partial").length,
    skipped: eligible.filter((value) => value.classification === "skipped").length,
    unknown: eligible.filter((value) => value.classification === "unknown").length,
    notReported: eligible.filter((value) => value.classification === "notReported").length,
  };
  const unavailable = planCoverage.status === "unavailable";
  const zero = counts.eligibleScheduledCount === 0;
  const distribution: CompletionDistributionV1 = { ...counts,
    status: unavailable ? "unavailable" : zero ? "notApplicable" : "available" };
  const currentOutcomeCoverage: CurrentOutcomeCoverageV1 = unavailable
    ? { status: "unavailable", classifiedCount: 0, eligibleCount: 0 }
    : zero ? { status: "notApplicable", classifiedCount: 0, eligibleCount: 0 }
      : { status: "available", classifiedCount: counts.completed + counts.partial + counts.skipped,
          eligibleCount: counts.eligibleScheduledCount };
  const limitations: HistoricalCompletionDistributionLimitationV1[] = [
    ...(planCoverage.status === "incompleteCoverage" ? ["incompletePlanCoverage" as const] : []),
    ...(unavailable ? ["noPlanCoverage" as const] : []),
    ...(!unavailable && zero ? ["zeroEligibleOccurrences" as const] : []),
  ];
  return structuredClone({ status: "projected", metric: COMPLETION_DISTRIBUTION_METRIC_V1,
    policy: HISTORICAL_METRIC_POLICY_V1, query: input.query, planCoverage, distribution,
    currentOutcomeCoverage, limitations, provenance: { eligible, excluded,
      missingPlanUserDayDates: missing } });
}

function explain(evidence: EffectiveHistoricalPlanDayEvidence,
  occurrence: HistoricalPlanDayPublicationV1["occurrences"][number]): HistoricalOccurrenceExplanationV1 {
  return { userDayDate: evidence.day.userDayDate, reference: structuredClone(occurrence.reference),
    sourceFamily: occurrence.sourceFamily, title: occurrence.title, category: occurrence.category,
    plan: { ...occurrence.plan }, batchId: evidence.batchId, publishedAt: evidence.publishedAt };
}
function compareProvenance(left: HistoricalOccurrenceExplanationV1,
  right: HistoricalOccurrenceExplanationV1): number {
  const start = (value: HistoricalOccurrenceExplanationV1) => value.plan.state === "scheduled"
    ? value.plan.startsAt : "";
  return left.userDayDate.localeCompare(right.userDayDate) || start(left).localeCompare(start(right)) ||
    JSON.stringify(left.reference).localeCompare(JSON.stringify(right.reference));
}
function validLocalDate(value: string): value is LocalDateString {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
function canonicalUtc(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && (parsed.toISOString() === value ||
    (!value.includes(".") && `${value.slice(0, -1)}.000Z` === parsed.toISOString()));
}
