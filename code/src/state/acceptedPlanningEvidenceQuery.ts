import {
  buildAcceptedPlanningEvidence,
  evidenceRange,
  type AcceptedPlanningEvidenceQuery,
} from "../core/productEvidence/acceptedPlanningEvidence.js";
import { available, type HistoricalEvidence } from "../core/productEvidence/evidence.js";
import type { GoalSurface } from "./goalSurface.js";
import type { GoalPlanningSurface } from "./goalPlanningSurface.js";
import type { ProposalSurface } from "./proposalSurface.js";
import type { RealizationSurface } from "./realizationSurface.js";
import type { HistoricalPlanSurface } from "./historicalPlanSurface.js";
import type { ExecutionHistorySurface } from "./executionHistorySurface.js";
import { readDayActuals, readDayPublications } from "./productEvidenceSources.js";

export async function queryAcceptedPlanningEvidence(
  query: AcceptedPlanningEvidenceQuery,
  sources: {
    proposals: Pick<ProposalSurface, "getProposalIngressStatus" | "exportProposalAuthority">;
    realizations: Pick<
      RealizationSurface,
      "getRealizationIngressStatus" | "exportRealizationAuthority"
    >;
    goals: Pick<GoalSurface, "getGoal" | "getGoalIngressStatus">;
    demands: Pick<GoalPlanningSurface, "getGoalDemandRevision" | "getGoalPlanningIngressStatus">;
    historicalPlan: Pick<
      HistoricalPlanSurface,
      "getHistoricalPlanDayEvidence" | "getHistoricalPlanBatchEvidence"
    >;
    execution: Pick<
      ExecutionHistorySurface,
      | "getExecutionHistory"
      | "getExecutionHistoryIngressStatus"
      | "getExecutionHistoryMigrationStatus"
    >;
  },
) {
  const days = evidenceRange(query);
  if (!days) return { status: "invalidQuery", reason: "invalidRangeOrAsOf" } as const;
  try {
    const pi = sources.proposals.getProposalIngressStatus().status;
    const ri = sources.realizations.getRealizationIngressStatus();
    const proposals =
      pi === "accepted"
        ? available(sources.proposals.exportProposalAuthority())
        : {
            status: pi === "protected" ? ("protected" as const) : ("unavailable" as const),
            reason: "proposalAuthorityUnavailable",
          };
    const realizations =
      ri === "ready"
        ? available(sources.realizations.exportRealizationAuthority())
        : {
            status: ri === "protected" ? ("protected" as const) : ("unavailable" as const),
            reason: "realizationAuthorityUnavailable",
          };
    let history: HistoricalEvidence = available([]);
    for (const day of days) {
      const result = await readDayPublications(sources.historicalPlan, day, query.asOf);
      if (result.status !== "available") {
        history = result;
        break;
      }
      if (history.status === "available") history.value.push(...result.value);
    }
    const actual = await readDayActuals(
      sources.execution,
      new Set(days),
      query.asOf,
      history,
      sources.historicalPlan,
    );
    const projected = buildAcceptedPlanningEvidence({
      query,
      proposals,
      realizations,
      history,
      actual,
    });
    if (projected.status !== "projected") return projected;
    const references = new Map<
      string,
      { goalId: string; demandId: string; demandRevision: number }
    >();
    if (projected.iterations.status === "available")
      for (const iteration of projected.iterations.value)
        for (const ref of iteration.demands)
          references.set(`${ref.goalId}|${ref.demandId}|${ref.demandRevision}`, ref);
    if (projected.facts.status === "available")
      for (const { lineage } of projected.facts.value)
        references.set(`${lineage.goalId}|${lineage.demandId}|${lineage.demandRevision}`, lineage);
    const currentSourceContext = [...references.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, ref]) => {
        const gi = sources.goals.getGoalIngressStatus().status;
        const di = sources.demands.getGoalPlanningIngressStatus().status;
        const goal =
          gi === "accepted"
            ? sources.goals.getGoal(ref.goalId as Parameters<GoalSurface["getGoal"]>[0])
            : undefined;
        return {
          reference: ref,
          interpretation: "currentGoalAndExactDemandRevisionNotFrozenPublication" as const,
          goal: goal
            ? available(goal)
            : {
                status: gi === "protected" ? ("protected" as const) : ("unavailable" as const),
                reason: "currentGoalNotReadable",
              },
          demand:
            di === "accepted"
              ? sources.demands.getGoalDemandRevision(
                  ref.demandId as Parameters<GoalPlanningSurface["getGoalDemandRevision"]>[0],
                  ref.demandRevision,
                )
              : { status: di === "protected" ? ("protected" as const) : ("unavailable" as const) },
        };
      });
    return { ...projected, currentSourceContext };
  } catch {
    return { status: "error", reason: "evidenceQueryFailed" } as const;
  }
}
