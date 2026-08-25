import {
  projectHistoricalCompletionDistributionV1,
  validateHistoricalCompletionDistributionQuery,
  type HistoricalCompletionDistributionQueryV1,
  type HistoricalCompletionDistributionResultV1,
} from "../core/historicalIntelligence/completionDistribution.js";
import type { ExecutionHistorySurface } from "./executionHistorySurface.js";
import type { HistoricalPlanSurface } from "./historicalPlanSurface.js";
import type { LocalDateString } from "../core/shifts/types.js";
import {
  projectHistoricalSchedulingRealizationV1,
  type HistoricalSchedulingRealizationQueryV1,
  type HistoricalSchedulingRealizationResultV1,
} from "../core/historicalIntelligence/schedulingRealization.js";
import {
  projectGoalActivityV1,
  validateGoalActivityQueryV1,
  type GoalActivityQueryV1,
  type GoalActivityResultV1,
} from "../core/historicalIntelligence/goalActivity.js";
import type { GoalSurface } from "./goalSurface.js";

export type HistoricalCompletionDistributionQueryResultV1 =
  | HistoricalCompletionDistributionResultV1
  | {
      status: "unavailable";
      reason:
        | "historicalPlanProtected"
        | "historicalPlanUnavailable"
        | "executionHistoryProtected"
        | "executionHistoryQuarantined";
    };
export type HistoricalSchedulingRealizationQueryResultV1 =
  | HistoricalSchedulingRealizationResultV1
  | { status: "unavailable"; reason: "historicalPlanProtected" | "historicalPlanUnavailable" };
export type GoalActivityQueryResultV1 =
  | GoalActivityResultV1
  | {
      status: "unavailable";
      reason:
        | "goalProtected"
        | "goalUnavailable"
        | "goalNotFound"
        | "historicalPlanProtected"
        | "historicalPlanUnavailable";
    };

export function createGoalActivityQuery(options: {
  historicalPlan: Pick<HistoricalPlanSurface, "getHistoricalPlanRange">;
  executionHistory: Pick<
    ExecutionHistorySurface,
    "getExecutionHistory" | "getExecutionHistoryIngressStatus"
  >;
  goals: Pick<GoalSurface, "getGoal" | "getGoalIngressStatus">;
}) {
  return async function getGoalActivity(
    query: GoalActivityQueryV1,
  ): Promise<GoalActivityQueryResultV1> {
    const issues = validateGoalActivityQueryV1(query);
    if (issues.length) return { status: "invalidQuery", issues };
    const goalIngress = options.goals.getGoalIngressStatus();
    if (goalIngress.status === "protected")
      return { status: "unavailable", reason: "goalProtected" };
    if (goalIngress.status !== "accepted")
      return { status: "unavailable", reason: "goalUnavailable" };
    const goal = options.goals.getGoal(query.goalId);
    if (!goal) return { status: "unavailable", reason: "goalNotFound" };
    const range = await options.historicalPlan.getHistoricalPlanRange(
      query.startUserDayDate,
      query.endUserDayDate,
      query.evaluationAsOf,
    );
    if (range.status === "unavailableProtected")
      return { status: "unavailable", reason: "historicalPlanProtected" };
    if (range.status === "unavailable")
      return { status: "unavailable", reason: "historicalPlanUnavailable" };
    const executionIngress = options.executionHistory.getExecutionHistoryIngressStatus();
    const executionAvailable =
      executionIngress.status !== "recoveryRequired" &&
      !(executionIngress.status === "accepted" && executionIngress.quarantinedComponentCount > 0);
    return projectGoalActivityV1({
      query,
      goal,
      days: range.days.map(({ day, batchId, publishedAt }) => ({ day, batchId, publishedAt })),
      missingUserDayDates: range.missingDays as LocalDateString[],
      executionRecords: executionAvailable ? options.executionHistory.getExecutionHistory() : [],
      executionEvidenceAvailable: executionAvailable,
    });
  };
}

export function createHistoricalIntelligenceQuery(options: {
  historicalPlan: Pick<HistoricalPlanSurface, "getHistoricalPlanRange">;
  executionHistory: Pick<
    ExecutionHistorySurface,
    "getExecutionHistory" | "getExecutionHistoryIngressStatus"
  >;
}) {
  return async function getHistoricalCompletionDistribution(
    query: HistoricalCompletionDistributionQueryV1,
  ): Promise<HistoricalCompletionDistributionQueryResultV1> {
    const issues = validateHistoricalCompletionDistributionQuery(query);
    if (issues.length) return { status: "invalidQuery", issues };
    const executionIngress = options.executionHistory.getExecutionHistoryIngressStatus();
    if (executionIngress.status === "recoveryRequired") {
      return { status: "unavailable", reason: "executionHistoryProtected" };
    }
    if (executionIngress.status === "accepted" && executionIngress.quarantinedComponentCount > 0) {
      return { status: "unavailable", reason: "executionHistoryQuarantined" };
    }
    const range = await options.historicalPlan.getHistoricalPlanRange(
      query.startUserDayDate,
      query.endUserDayDate,
      query.evaluationAsOf,
    );
    if (range.status === "unavailableProtected") {
      return { status: "unavailable", reason: "historicalPlanProtected" };
    }
    if (range.status === "unavailable") {
      return { status: "unavailable", reason: "historicalPlanUnavailable" };
    }
    return projectHistoricalCompletionDistributionV1({
      query,
      days: range.days.map(({ day, batchId, publishedAt }) => ({ day, batchId, publishedAt })),
      missingUserDayDates: range.missingDays as LocalDateString[],
      executionRecords: options.executionHistory.getExecutionHistory(),
    });
  };
}

export function createHistoricalSchedulingRealizationQuery(options: {
  historicalPlan: Pick<HistoricalPlanSurface, "getHistoricalPlanRange">;
}) {
  return async function getHistoricalSchedulingRealization(
    query: HistoricalSchedulingRealizationQueryV1,
  ): Promise<HistoricalSchedulingRealizationQueryResultV1> {
    const issues = validateHistoricalCompletionDistributionQuery(query);
    if (issues.length) return { status: "invalidQuery", issues };
    const range = await options.historicalPlan.getHistoricalPlanRange(
      query.startUserDayDate,
      query.endUserDayDate,
      query.evaluationAsOf,
    );
    if (range.status === "unavailableProtected") {
      return { status: "unavailable", reason: "historicalPlanProtected" };
    }
    if (range.status === "unavailable") {
      return { status: "unavailable", reason: "historicalPlanUnavailable" };
    }
    return projectHistoricalSchedulingRealizationV1({
      query,
      days: range.days.map(({ day, batchId, publishedAt }) => ({ day, batchId, publishedAt })),
      missingUserDayDates: range.missingDays as LocalDateString[],
    });
  };
}
