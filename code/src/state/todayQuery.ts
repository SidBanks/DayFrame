import {
  buildTodayReadModel,
  isCanonicalTodayEvaluationInstant,
  type TodayAvailableReadModel,
} from "../core/today/buildTodayReadModel.js";
import type { buildExecutionHistoryItems } from "../core/execution/executionHistoryProjection.js";
import type { historicalOccurrenceTimingSemantics } from "../core/historicalPlan/historicalPlan.js";
import type { resolveUserDayContainingInstant } from "../core/time/canonicalUserDay.js";
import type { ExecutionRecordV1 } from "../core/execution/executionRecord.js";
import type { DayFrameAuthoredSetup } from "./types.js";
import type {
  ExecutionHistoryIngressStatus,
  ExecutionHistoryMigrationStatus,
} from "./executionHistorySurface.js";
import type { HistoricalPlanDayReadResult } from "./historicalPlanSurface.js";

export type TodayQuery = { evaluationAsOf: string };
export type TodayQueryResult =
  | TodayAvailableReadModel
  | {
      status: "planUnavailable";
      reason: "noPublication" | "storageUnavailable";
      evaluationAsOf: string;
      userDayDate: string;
    }
  | {
      status: "historicalPlanProtected";
      reason: Extract<HistoricalPlanDayReadResult, { status: "unavailableProtected" }>["reason"];
      evaluationAsOf: string;
      userDayDate: string;
    }
  | { status: "invalidQuery"; reason: "invalidEvaluationAsOf" };

export function createTodayQuery(dependencies: {
  getAuthoredSetup: () => DayFrameAuthoredSetup;
  historicalPlan: {
    getHistoricalPlanDay: (
      userDayDate: string,
      asOf: string,
    ) => Promise<HistoricalPlanDayReadResult>;
  };
  executionHistory: {
    getExecutionHistory: () => ExecutionRecordV1[];
    getExecutionHistoryIngressStatus: () => ExecutionHistoryIngressStatus;
    getExecutionHistoryMigrationStatus: () => ExecutionHistoryMigrationStatus;
  };
  resolveUserDayContainingInstant: typeof resolveUserDayContainingInstant;
  buildExecutionHistoryItems: typeof buildExecutionHistoryItems;
  historicalOccurrenceTimingSemantics: typeof historicalOccurrenceTimingSemantics;
}) {
  return async function queryToday(query: TodayQuery): Promise<TodayQueryResult> {
    if (!isCanonicalTodayEvaluationInstant(query.evaluationAsOf))
      return { status: "invalidQuery", reason: "invalidEvaluationAsOf" };
    const evaluationInstant = new Date(query.evaluationAsOf);
    let userDay;
    try {
      const setup = dependencies.getAuthoredSetup();
      userDay = dependencies.resolveUserDayContainingInstant({
        shiftCycles: setup.shiftCycles,
        defaultSchedulingPreferences: setup.schedulingPreferences,
        instant: evaluationInstant,
      });
    } catch {
      return { status: "invalidQuery", reason: "invalidEvaluationAsOf" };
    }
    const plan = await dependencies.historicalPlan.getHistoricalPlanDay(
      userDay.userDayDate,
      query.evaluationAsOf,
    );
    const unavailableContext = {
      evaluationAsOf: query.evaluationAsOf,
      userDayDate: userDay.userDayDate,
    };
    if (plan.status === "unavailableProtected")
      return {
        ...unavailableContext,
        status: "historicalPlanProtected",
        reason: plan.reason,
      };
    if (plan.status === "unavailableNoPublication" || plan.status === "unavailable")
      return {
        ...unavailableContext,
        status: "planUnavailable",
        reason: plan.status === "unavailable" ? "storageUnavailable" : "noPublication",
      };
    const ingress = dependencies.executionHistory.getExecutionHistoryIngressStatus();
    const migration = dependencies.executionHistory.getExecutionHistoryMigrationStatus();
    const execution =
      ingress.status === "recoveryRequired" || migration === "protected"
        ? ({ coverage: "unavailableProtected" } as const)
        : migration === "initializing" || migration === "migrating" || migration === "unavailable"
          ? ({ coverage: "unavailable" } as const)
          : ({
              coverage: "available",
              items: dependencies.buildExecutionHistoryItems(
                dependencies.executionHistory
                  .getExecutionHistory()
                  .filter((record) => Date.parse(record.recordedAt) <= evaluationInstant.getTime()),
              ),
            } as const);
    return buildTodayReadModel({
      evaluationAsOf: query.evaluationAsOf,
      userDay,
      plan: {
        ...plan,
        occurrences: plan.day.occurrences.map((occurrence) => ({
          occurrence,
          timing: dependencies.historicalOccurrenceTimingSemantics(occurrence),
        })),
      },
      execution,
    });
  };
}
