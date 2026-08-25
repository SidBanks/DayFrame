import type { GoalId } from "../core/goals/goal.js";
import {
  measurementPolicySupport,
  type GoalMeasurementDefinitionV1,
} from "../core/measurement/measurementDefinition.js";
import type { GoalProgressObservationV1 } from "../core/progressObservation/progressObservation.js";
import type { MeasurementDefinitionSurface } from "./measurementDefinitionSurface.js";
import type { ProgressObservationSurface } from "./progressObservationSurface.js";

type Definitions = Pick<
  MeasurementDefinitionSurface,
  | "listMeasurementDefinitionHistory"
  | "getMeasurementDefinitionRevision"
  | "getMeasurementDefinitionIngressStatus"
>;
type Observations = Pick<
  ProgressObservationSurface,
  "exportProgressObservationAuthority" | "getProgressObservationIngressStatus"
>;
export type GoalProgressObservationHistoryRecord = {
  observation: GoalProgressObservationV1;
  corrected: boolean;
  canCorrect: boolean;
  canRetract: boolean;
};
export type GoalProgressObservationHistoryPeriod = {
  definition: GoalMeasurementDefinitionV1;
  current: boolean;
  records: GoalProgressObservationHistoryRecord[];
};
export type GoalProgressObservationHistoryResult =
  | { status: "initializing"; source: "measurement" | "observations" }
  | { status: "protected"; source: "measurement" | "observations" }
  | {
      status: "available";
      goalId: GoalId;
      currentMeasurement: "none" | "inactive" | "supported" | "unsupported";
      currentDefinition?: GoalMeasurementDefinitionV1;
      periods: GoalProgressObservationHistoryPeriod[];
    };

export function createGoalProgressObservationHistoryQuery(options: {
  definitions: Definitions;
  observations: Observations;
}) {
  return (goalId: GoalId): GoalProgressObservationHistoryResult => {
    const definitionIngress = options.definitions.getMeasurementDefinitionIngressStatus();
    if (definitionIngress.status !== "accepted")
      return {
        status: definitionIngress.status,
        source: "measurement",
      };
    const observationIngress = options.observations.getProgressObservationIngressStatus();
    if (observationIngress.status !== "accepted")
      return {
        status: observationIngress.status,
        source: "observations",
      };
    const definitions = options.definitions.listMeasurementDefinitionHistory(goalId);
    const latestDefinition = definitions.at(-1);
    const currentDefinition = latestDefinition?.status === "active" ? latestDefinition : undefined;
    const currentMeasurement = !latestDefinition
      ? "none"
      : latestDefinition.status === "inactive"
        ? "inactive"
        : measurementPolicySupport(latestDefinition.policyRef) === "supported"
          ? "supported"
          : "unsupported";
    const revisions = options.observations
      .exportProgressObservationAuthority()
      .observations.filter((item) => item.goalId === goalId);
    const lineages = new Map<string, GoalProgressObservationV1[]>();
    for (const revision of revisions) {
      const lineage = lineages.get(revision.id) ?? [];
      lineage.push(revision);
      lineages.set(revision.id, lineage);
    }
    const records = [...lineages.values()].map((lineage) => {
      lineage.sort((a, b) => a.revision - b.revision);
      const observation = lineage.at(-1)!;
      return {
        observation: structuredClone(observation),
        corrected: lineage.length > 1 && observation.status === "active",
        canCorrect: observation.status === "active",
        canRetract: observation.status === "active",
      };
    });
    const definitionKeys = new Set(records.map(({ observation }) => key(observation)));
    if (currentDefinition)
      definitionKeys.add(`${currentDefinition.id}|${currentDefinition.revision}`);
    const periods = [...definitionKeys]
      .map((definitionKey) => {
        const [id, revision] = definitionKey.split("|");
        const definition = options.definitions.getMeasurementDefinitionRevision(
          id as never,
          Number(revision),
        );
        if (!definition) return undefined;
        return {
          definition,
          current:
            currentDefinition?.id === definition.id &&
            currentDefinition.revision === definition.revision,
          records: records
            .filter(({ observation }) => key(observation) === definitionKey)
            .sort(
              (a, b) =>
                b.observation.observedAt.localeCompare(a.observation.observedAt) ||
                a.observation.id.localeCompare(b.observation.id),
            ),
        };
      })
      .filter((period): period is GoalProgressObservationHistoryPeriod => !!period)
      .sort(
        (a, b) =>
          Number(b.current) - Number(a.current) || b.definition.revision - a.definition.revision,
      );
    return structuredClone({
      status: "available",
      goalId,
      currentMeasurement,
      ...(currentDefinition ? { currentDefinition } : {}),
      periods,
    });
  };
}

function key(observation: GoalProgressObservationV1) {
  return `${observation.definitionId}|${observation.definitionRevision}`;
}
