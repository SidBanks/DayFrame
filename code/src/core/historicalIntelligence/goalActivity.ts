import { buildExecutionHistoryItems } from "../execution/executionHistoryProjection.js";
import type { ExecutionRecordV1 } from "../execution/executionRecord.js";
import type { GoalId, GoalV1 } from "../goals/goal.js";
import {
  historicalGoalProvenanceCoverage,
  type HistoricalPlanContext,
  type HistoricalGoalProvenanceV1,
  type HistoricalPlannedOccurrenceSnapshot,
} from "../historicalPlan/historicalPlan.js";
import {
  durableOccurrenceReferencesEqual,
  type DurableOccurrenceReference,
} from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import {
  HISTORICAL_METRIC_POLICY_V1,
  validateHistoricalCompletionDistributionQuery,
  type HistoricalMetricPolicyV1,
} from "./completionDistribution.js";
import {
  resolveHistoricalPlanCoverageV1,
  type HistoricalPlanCoverageV1,
  type HistoricalPlanEvidenceV1,
} from "./historicalPlanCoverage.js";

export const GOAL_ACTIVITY_PROJECTION_V1 = { id: "goalActivity", version: 1 } as const;
export const GOAL_ACTIVITY_POLICY_V1 = {
  id: "goalActivityPolicy",
  version: 1,
  historicalPolicy: HISTORICAL_METRIC_POLICY_V1,
} as const;
export type GoalActivityPolicyV1 = typeof GOAL_ACTIVITY_POLICY_V1;
export type GoalActivityQueryV1 = {
  policy: GoalActivityPolicyV1;
  goalId: GoalId;
  startUserDayDate: LocalDateString;
  endUserDayDate: LocalDateString;
  evaluationAsOf: string;
};
export type GoalActivityQueryIssue =
  | "unsupportedPolicy"
  | "invalidGoalId"
  | "invalidStartUserDayDate"
  | "invalidEndUserDayDate"
  | "invalidRange"
  | "invalidEvaluationAsOf";
export type GoalActivityGoalContextV1 = Pick<
  GoalV1,
  "id" | "revision" | "title" | "status" | "createdAt"
> &
  Pick<GoalV1, "description" | "targetDate" | "measurementPolicy">;
export type GoalLinkCoverageV1 = {
  status: "complete" | "incompleteCoverage" | "unavailable";
  eligibleOccurrenceCount: number;
  availableOccurrenceCount: number;
  unavailableLegacyOccurrenceCount: number;
  unavailableUserDayDates: LocalDateString[];
};
export type GoalActivityPlanningDistributionV1 = {
  status: "available" | "unavailable";
  linkedIntendedOccurrenceCount: number;
  scheduled: number;
  unplaced: number;
  omitted: number;
  blocked: number;
};
export type GoalActivityExecutionDistributionV1 = {
  status: "available" | "notApplicable" | "unavailable";
  linkedScheduledOccurrenceCount: number;
  completed: number;
  partial: number;
  skipped: number;
  unknown: number;
  notReported: number;
};
export type GoalActivityReportingCoverageV1 = {
  status: "complete" | "incompleteCoverage" | "notApplicable" | "unavailable";
  eligibleCount: number;
  reportedCount: number;
  unknownCount: number;
  notReportedCount: number;
};
export type GoalActivityAdvisoryV1 =
  | "incompletePlanCoverage"
  | "goalLinksUnavailableForSomeHistory"
  | "goalLinksUnavailableForAllHistory"
  | "executionEvidenceUnavailable"
  | "noLinkedActivity"
  | "noLinkedScheduledActivity";
type OccurrenceBase = {
  userDayDate: LocalDateString;
  reference: DurableOccurrenceReference;
  sourceFamily: HistoricalPlannedOccurrenceSnapshot["sourceFamily"];
  title: string;
  category: HistoricalPlannedOccurrenceSnapshot["category"];
  plan: HistoricalPlanContext;
  batchId: string;
  publishedAt: string;
};
export type GoalActivityLinkedProvenanceV1 = OccurrenceBase & {
  frozenGoal: HistoricalGoalProvenanceV1;
  execution?: {
    classification: "completed" | "partial" | "skipped" | "unknown" | "notReported";
    subjectId?: string;
    currentRecordId?: string;
    recordedAt?: string;
  };
};
export type GoalActivityCoverageProvenanceV1 = OccurrenceBase & {
  reason: "knownUnlinked" | "goalProvenanceUnavailableLegacy";
};
export type GoalActivityResultV1 =
  | { status: "invalidQuery"; issues: GoalActivityQueryIssue[] }
  | {
      status: "available" | "partialCoverage" | "unavailable";
      projection: typeof GOAL_ACTIVITY_PROJECTION_V1;
      policy: GoalActivityPolicyV1;
      query: GoalActivityQueryV1;
      goalContext: GoalActivityGoalContextV1;
      planCoverage: HistoricalPlanCoverageV1;
      goalLinkCoverage: GoalLinkCoverageV1;
      reportingCoverage: GoalActivityReportingCoverageV1;
      planningDistribution: GoalActivityPlanningDistributionV1;
      executionDistribution: GoalActivityExecutionDistributionV1;
      advisories: GoalActivityAdvisoryV1[];
      provenance: {
        linked: GoalActivityLinkedProvenanceV1[];
        coverage: GoalActivityCoverageProvenanceV1[];
        missingPlanUserDayDates: LocalDateString[];
      };
    };

export function validateGoalActivityQueryV1(query: GoalActivityQueryV1): GoalActivityQueryIssue[] {
  const base = validateHistoricalCompletionDistributionQuery({
    policy: query.policy.historicalPolicy as HistoricalMetricPolicyV1,
    startUserDayDate: query.startUserDayDate,
    endUserDayDate: query.endUserDayDate,
    evaluationAsOf: query.evaluationAsOf,
  });
  const issues = base as GoalActivityQueryIssue[];
  if (
    query.policy.id !== GOAL_ACTIVITY_POLICY_V1.id ||
    query.policy.version !== 1 ||
    query.policy.historicalPolicy.id !== HISTORICAL_METRIC_POLICY_V1.id ||
    query.policy.historicalPolicy.version !== 1
  )
    issues.unshift("unsupportedPolicy");
  if (
    typeof query.goalId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(query.goalId)
  )
    issues.push("invalidGoalId");
  return [...new Set(issues)];
}

export function projectGoalActivityV1(input: {
  query: GoalActivityQueryV1;
  goal: GoalV1;
  days: readonly HistoricalPlanEvidenceV1[];
  missingUserDayDates: readonly LocalDateString[];
  executionRecords: readonly ExecutionRecordV1[];
  executionEvidenceAvailable?: boolean;
}): GoalActivityResultV1 {
  const issues = validateGoalActivityQueryV1(input.query);
  if (issues.length) return { status: "invalidQuery", issues };
  const resolved = resolveHistoricalPlanCoverageV1({
    startUserDayDate: input.query.startUserDayDate,
    endUserDayDate: input.query.endUserDayDate,
    evaluationAsOf: input.query.evaluationAsOf,
    days: input.days,
    missingUserDayDates: input.missingUserDayDates,
  });
  const eligible = resolved.days.flatMap((evidence) =>
    evidence.day.occurrences.map((occurrence) => ({ evidence, occurrence })),
  );
  const available = eligible.filter(
    ({ occurrence }) => historicalGoalProvenanceCoverage(occurrence) === "available",
  );
  const legacy = eligible.filter(
    ({ occurrence }) => historicalGoalProvenanceCoverage(occurrence) === "unavailableLegacy",
  );
  const goalLinkCoverage: GoalLinkCoverageV1 = {
    status:
      legacy.length === 0
        ? "complete"
        : available.length === 0
          ? "unavailable"
          : "incompleteCoverage",
    eligibleOccurrenceCount: eligible.length,
    availableOccurrenceCount: available.length,
    unavailableLegacyOccurrenceCount: legacy.length,
    unavailableUserDayDates: [
      ...new Set(legacy.map(({ evidence }) => evidence.day.userDayDate)),
    ].sort(),
  };
  const linked = available.flatMap(({ evidence, occurrence }) => {
    const frozenGoal = occurrence.goals?.find((goal) => goal.goalId === input.query.goalId);
    return frozenGoal ? [{ evidence, occurrence, frozenGoal }] : [];
  });
  const planningCounts = { scheduled: 0, unplaced: 0, omitted: 0, blocked: 0 };
  for (const item of linked) planningCounts[item.occurrence.plan.state]++;
  const planningUnavailable =
    resolved.coverage.status === "unavailable" || goalLinkCoverage.status === "unavailable";
  const planningDistribution: GoalActivityPlanningDistributionV1 = {
    status: planningUnavailable ? "unavailable" : "available",
    linkedIntendedOccurrenceCount: linked.length,
    ...planningCounts,
  };
  const executionAvailable = input.executionEvidenceAvailable !== false;
  const records = input.executionRecords.filter(
    (record) => record.recordedAt <= input.query.evaluationAsOf,
  );
  const historyItems = executionAvailable ? buildExecutionHistoryItems(records) : [];
  const linkedProvenance: GoalActivityLinkedProvenanceV1[] = [];
  const executionCounts = { completed: 0, partial: 0, skipped: 0, unknown: 0, notReported: 0 };
  let linkedScheduled = 0;
  for (const { evidence, occurrence, frozenGoal } of linked) {
    const base = explain(evidence, occurrence);
    if (occurrence.plan.state !== "scheduled") {
      linkedProvenance.push({ ...base, frozenGoal: structuredClone(frozenGoal) });
      continue;
    }
    linkedScheduled++;
    const item = historyItems.find(
      (candidate) =>
        candidate.subject.kind === "planned" &&
        durableOccurrenceReferencesEqual(candidate.subject.reference, occurrence.reference),
    );
    const classification = !executionAvailable
      ? undefined
      : !item
        ? ("notReported" as const)
        : item.currentOutcome.status === "unknown"
          ? ("unknown" as const)
          : item.currentOutcome.status;
    if (classification) executionCounts[classification]++;
    linkedProvenance.push({
      ...base,
      frozenGoal: structuredClone(frozenGoal),
      ...(classification
        ? {
            execution: {
              classification,
              ...(item
                ? {
                    subjectId: item.subjectId,
                    currentRecordId: item.currentRecord.id,
                    recordedAt: item.currentRecord.recordedAt,
                  }
                : {}),
            },
          }
        : {}),
    });
  }
  const executionDistribution: GoalActivityExecutionDistributionV1 = {
    status:
      !executionAvailable || planningUnavailable
        ? "unavailable"
        : linkedScheduled === 0
          ? "notApplicable"
          : "available",
    linkedScheduledOccurrenceCount: linkedScheduled,
    ...executionCounts,
  };
  const reported = executionCounts.completed + executionCounts.partial + executionCounts.skipped;
  const reportingCoverage: GoalActivityReportingCoverageV1 = {
    status:
      !executionAvailable || planningUnavailable
        ? "unavailable"
        : linkedScheduled === 0
          ? "notApplicable"
          : reported === linkedScheduled
            ? "complete"
            : "incompleteCoverage",
    eligibleCount: linkedScheduled,
    reportedCount: reported,
    unknownCount: executionCounts.unknown,
    notReportedCount: executionCounts.notReported,
  };
  const coverage: GoalActivityCoverageProvenanceV1[] = [
    ...available.flatMap(({ evidence, occurrence }) =>
      occurrence.goals!.some((goal) => goal.goalId === input.query.goalId)
        ? []
        : [{ ...explain(evidence, occurrence), reason: "knownUnlinked" as const }],
    ),
    ...legacy.map(({ evidence, occurrence }) => ({
      ...explain(evidence, occurrence),
      reason: "goalProvenanceUnavailableLegacy" as const,
    })),
  ];
  linkedProvenance.sort(compare);
  coverage.sort(compare);
  const status = planningUnavailable
    ? "unavailable"
    : resolved.coverage.status === "incompleteCoverage" ||
        goalLinkCoverage.status === "incompleteCoverage" ||
        reportingCoverage.status === "incompleteCoverage" ||
        reportingCoverage.status === "unavailable"
      ? "partialCoverage"
      : "available";
  const advisories: GoalActivityAdvisoryV1[] = [];
  if (resolved.coverage.status === "incompleteCoverage") advisories.push("incompletePlanCoverage");
  if (goalLinkCoverage.status === "incompleteCoverage")
    advisories.push("goalLinksUnavailableForSomeHistory");
  if (goalLinkCoverage.status === "unavailable")
    advisories.push("goalLinksUnavailableForAllHistory");
  if (!executionAvailable) advisories.push("executionEvidenceUnavailable");
  if (!planningUnavailable && linked.length === 0) advisories.push("noLinkedActivity");
  if (!planningUnavailable && linked.length > 0 && linkedScheduled === 0)
    advisories.push("noLinkedScheduledActivity");
  return structuredClone({
    status,
    projection: GOAL_ACTIVITY_PROJECTION_V1,
    policy: GOAL_ACTIVITY_POLICY_V1,
    query: input.query,
    goalContext: goalContext(input.goal),
    planCoverage: resolved.coverage,
    goalLinkCoverage,
    reportingCoverage,
    planningDistribution,
    executionDistribution,
    advisories,
    provenance: {
      linked: linkedProvenance,
      coverage,
      missingPlanUserDayDates: resolved.coverage.missingUserDayDates,
    },
  });
}
function goalContext(goal: GoalV1): GoalActivityGoalContextV1 {
  return {
    id: goal.id,
    revision: goal.revision,
    title: goal.title,
    status: goal.status,
    createdAt: goal.createdAt,
    ...(goal.description === undefined ? {} : { description: goal.description }),
    ...(goal.targetDate === undefined ? {} : { targetDate: goal.targetDate }),
    ...(goal.measurementPolicy === undefined
      ? {}
      : { measurementPolicy: { ...goal.measurementPolicy } }),
  };
}
function explain(
  evidence: HistoricalPlanEvidenceV1,
  occurrence: HistoricalPlannedOccurrenceSnapshot,
): OccurrenceBase {
  return {
    userDayDate: evidence.day.userDayDate,
    reference: structuredClone(occurrence.reference),
    sourceFamily: occurrence.sourceFamily,
    title: occurrence.title,
    category: occurrence.category,
    plan: { ...occurrence.plan },
    batchId: evidence.batchId,
    publishedAt: evidence.publishedAt,
  };
}
function compare(a: OccurrenceBase, b: OccurrenceBase) {
  const start = (value: OccurrenceBase) =>
    value.plan.state === "scheduled" ? value.plan.startsAt : "";
  return (
    a.userDayDate.localeCompare(b.userDayDate) ||
    start(a).localeCompare(start(b)) ||
    JSON.stringify(a.reference).localeCompare(JSON.stringify(b.reference))
  );
}
