import type { GoalId, GoalV1 } from "../core/goals/goal.js";
import { projectDemandForUserDayResolver } from "../core/planning/goalDemandProjection.js";
import type { GoalPlanningAuthorityV1 } from "../core/planning/goalDemand.js";
import type { StructuralEligibilityV1 } from "../core/planning/goalStructure.js";
import type { PlanningFactId } from "../core/planning/planningFoundation.js";
import type { CanonicalUserDayResolverInput } from "../core/time/canonicalUserDay.js";

export function queryGoalDemandProjection(input: {
  authority: GoalPlanningAuthorityV1;
  id: PlanningFactId;
  revision?: number;
  getGoal: (id: GoalId) => GoalV1 | undefined;
  getStructuralEligibility: (id: GoalId) => StructuralEligibilityV1;
  getUserDayResolver: () => CanonicalUserDayResolverInput;
}) {
  const values = input.authority.demands
    .filter((item) => item.id === input.id)
    .sort((a, b) => b.revision - a.revision);
  const demand =
    input.revision === undefined
      ? values[0]
      : values.find((item) => item.revision === input.revision);
  if (!demand) return { status: "notFound" as const };
  const goal = input.getGoal(demand.goalId);
  if (!goal) return { status: "unknown" as const, reason: "missingGoal" as const };
  return {
    status: "projected" as const,
    projection: projectDemandForUserDayResolver({
      demand,
      goal,
      structuralEligibility: input.getStructuralEligibility(goal.id),
      resolver: input.getUserDayResolver(),
    }),
  };
}
