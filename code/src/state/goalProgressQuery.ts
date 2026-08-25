import {
  projectManualQuantityProgressV1,
  validateGoalProgressQueryV1,
  type GoalProgressQueryV1,
  type ManualQuantityProgressResultV1,
} from "../core/progress/manualQuantityProgress.js";
import type { GoalSurface } from "./goalSurface.js";
import type { MeasurementDefinitionSurface } from "./measurementDefinitionSurface.js";
import type { ProgressObservationSurface } from "./progressObservationSurface.js";
export type GoalProgressQueryResultV1 =
  | ManualQuantityProgressResultV1
  | {
      status: "goalProtected" | "definitionProtected" | "observationProtected";
      reason: string;
      query: GoalProgressQueryV1;
    };
export function createGoalProgressQuery(options: {
  goals: Pick<GoalSurface, "getGoal" | "getGoalIngressStatus">;
  definitions: Pick<
    MeasurementDefinitionSurface,
    "getCurrentMeasurementDefinition" | "getMeasurementDefinitionIngressStatus"
  >;
  observations: Pick<
    ProgressObservationSurface,
    "getLatestProgressObservation" | "getProgressObservationIngressStatus"
  >;
}) {
  return function queryGoalProgress(query: GoalProgressQueryV1): GoalProgressQueryResultV1 {
    const issues = validateGoalProgressQueryV1(query);
    if (issues.length) return projectManualQuantityProgressV1({ query });
    const goalIngress = options.goals.getGoalIngressStatus();
    if (goalIngress.status !== "accepted")
      return structuredClone({
        status: "goalProtected" as const,
        reason: goalIngress.status === "protected" ? goalIngress.reason : "initializing",
        query,
      });
    const definitionIngress = options.definitions.getMeasurementDefinitionIngressStatus();
    if (definitionIngress.status !== "accepted")
      return structuredClone({
        status: "definitionProtected" as const,
        reason:
          definitionIngress.status === "protected" ? definitionIngress.reason : "initializing",
        query,
      });
    const observationIngress = options.observations.getProgressObservationIngressStatus();
    if (observationIngress.status !== "accepted")
      return structuredClone({
        status: "observationProtected" as const,
        reason:
          observationIngress.status === "protected" ? observationIngress.reason : "initializing",
        query,
      });
    const goal = options.goals.getGoal(query.goalId);
    if (!goal) return projectManualQuantityProgressV1({ query });
    const definitionResolution = options.definitions.getCurrentMeasurementDefinition(
      query.goalId,
      query.evaluationAsOf,
    );
    const observation =
      definitionResolution.status === "notDefined"
        ? undefined
        : options.observations.getLatestProgressObservation(
            query.goalId,
            definitionResolution.definition.id,
            definitionResolution.definition.revision,
            query.evaluationAsOf,
          );
    return projectManualQuantityProgressV1({
      query,
      goal,
      definitionResolution,
      ...(observation ? { observation } : {}),
    });
  };
}
