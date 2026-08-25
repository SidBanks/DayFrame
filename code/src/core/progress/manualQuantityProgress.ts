import { isGoalId, type GoalId, type GoalV1 } from "../goals/goal.js";
import {
  MANUAL_QUANTITY_TARGET_POLICY_V1,
  isCanonicalUnsignedDecimal,
  measurementPolicySupport,
  validatePolicyConfig,
  type GoalMeasurementDefinitionV1,
} from "../measurement/measurementDefinition.js";
import type { GoalProgressObservationV1 } from "../progressObservation/progressObservation.js";

export const MANUAL_QUANTITY_PROGRESS_V1 = { id: "manualQuantityProgress", version: 1 } as const;
export type GoalProgressQueryV1 = { goalId: GoalId; evaluationAsOf: string };
export type CurrentGoalProgressContextV1 = {
  id: GoalId;
  title: string;
  status: GoalV1["status"];
  description?: string;
  targetDate?: GoalV1["targetDate"];
};
export type ManualQuantityProgressAvailableV1 = {
  identity: typeof MANUAL_QUANTITY_PROGRESS_V1;
  query: GoalProgressQueryV1;
  status: "available";
  currentGoal: CurrentGoalProgressContextV1;
  definition: GoalMeasurementDefinitionV1;
  observation: GoalProgressObservationV1;
  quantity: { observedValue: string; targetValue: string; unitId: string };
  ratio: { numerator: string; denominator: string };
  percentage: string;
  comparison: "belowTarget" | "atTarget" | "aboveTarget";
  provenance: {
    goalId: GoalId;
    definitionId: string;
    definitionRevision: number;
    definitionEffectiveFrom: string;
    policyRef: { id: string; version: number };
    targetValue: string;
    unitId: string;
    observationId: string;
    observationRevision: number;
    observedAt: string;
    recordedAt: string;
    observedValue: string;
    evaluationAsOf: string;
  };
};
export type ManualQuantityProgressResultV1 =
  | ManualQuantityProgressAvailableV1
  | {
      identity: typeof MANUAL_QUANTITY_PROGRESS_V1;
      query: GoalProgressQueryV1;
      status: "goalNotFound";
    }
  | {
      identity: typeof MANUAL_QUANTITY_PROGRESS_V1;
      query: GoalProgressQueryV1;
      status: "notDefined";
      currentGoal: CurrentGoalProgressContextV1;
    }
  | {
      identity: typeof MANUAL_QUANTITY_PROGRESS_V1;
      query: GoalProgressQueryV1;
      status: "unsupportedPolicy";
      currentGoal: CurrentGoalProgressContextV1;
      definition: GoalMeasurementDefinitionV1;
      policyRef: { id: string; version: number };
    }
  | {
      identity: typeof MANUAL_QUANTITY_PROGRESS_V1;
      query: GoalProgressQueryV1;
      status: "insufficientEvidence";
      currentGoal: CurrentGoalProgressContextV1;
      definition: GoalMeasurementDefinitionV1;
      provenance: {
        goalId: GoalId;
        definitionId: string;
        definitionRevision: number;
        definitionEffectiveFrom: string;
        policyRef: { id: string; version: number };
        targetValue: string;
        unitId: string;
        evaluationAsOf: string;
      };
    }
  | {
      identity: typeof MANUAL_QUANTITY_PROGRESS_V1;
      query: GoalProgressQueryV1;
      status: "invalidAuthority";
      reason: "definitionConfig" | "observationBinding";
    }
  | {
      identity: typeof MANUAL_QUANTITY_PROGRESS_V1;
      query: unknown;
      status: "invalidQuery";
      issues: string[];
    };
export function validateGoalProgressQueryV1(value: unknown): string[] {
  if (!record(value)) return ["query"];
  const issues: string[] = [];
  if (Object.keys(value).sort().join() !== "evaluationAsOf,goalId") issues.push("fields");
  if (!isGoalId(value.goalId)) issues.push("goalId");
  if (!instant(value.evaluationAsOf)) issues.push("evaluationAsOf");
  return [...new Set(issues)];
}
export function compareCanonicalDecimals(left: string, right: string): number {
  const a = parse(left),
    b = parse(right),
    scale = Math.max(a.scale, b.scale),
    av = a.coefficient * power(scale - a.scale),
    bv = b.coefficient * power(scale - b.scale);
  return av < bv ? -1 : av > bv ? 1 : 0;
}
export function canonicalPercentage(observedValue: string, targetValue: string): string {
  if (
    !isCanonicalUnsignedDecimal(observedValue) ||
    !isCanonicalUnsignedDecimal(targetValue) ||
    targetValue === "0"
  )
    throw new RangeError("Canonical non-negative observed value and positive target are required.");
  const observed = parse(observedValue),
    target = parse(targetValue),
    numerator = observed.coefficient * power(target.scale) * 100n * 10000n,
    denominator = target.coefficient * power(observed.scale);
  let rounded = numerator / denominator;
  const remainder = numerator % denominator;
  if (remainder * 2n >= denominator) rounded++;
  const whole = rounded / 10000n,
    fraction = (rounded % 10000n).toString().padStart(4, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}
export function projectManualQuantityProgressV1(input: {
  query: unknown;
  goal?: GoalV1;
  definitionResolution?:
    | { status: "notDefined" }
    | { status: "available" | "unsupportedPolicy"; definition: GoalMeasurementDefinitionV1 };
  observation?: GoalProgressObservationV1;
}): ManualQuantityProgressResultV1 {
  const issues = validateGoalProgressQueryV1(input.query);
  if (issues.length)
    return clone({
      identity: MANUAL_QUANTITY_PROGRESS_V1,
      query: input.query,
      status: "invalidQuery",
      issues,
    });
  const query = clone(input.query as GoalProgressQueryV1);
  if (!input.goal)
    return clone({ identity: MANUAL_QUANTITY_PROGRESS_V1, query, status: "goalNotFound" });
  const currentGoal = context(input.goal),
    resolution = input.definitionResolution ?? { status: "notDefined" as const };
  if (resolution.status === "notDefined")
    return clone({
      identity: MANUAL_QUANTITY_PROGRESS_V1,
      query,
      status: "notDefined",
      currentGoal,
    });
  const definition = clone(resolution.definition);
  if (
    resolution.status === "unsupportedPolicy" ||
    measurementPolicySupport(definition.policyRef) === "unsupported"
  )
    return clone({
      identity: MANUAL_QUANTITY_PROGRESS_V1,
      query,
      status: "unsupportedPolicy",
      currentGoal,
      definition,
      policyRef: definition.policyRef,
    });
  const config = validatePolicyConfig(definition.policyRef, definition.config);
  if (
    config.status !== "valid" ||
    config.support !== "supported" ||
    definition.policyRef.id !== MANUAL_QUANTITY_TARGET_POLICY_V1.id ||
    definition.policyRef.version !== 1
  )
    return clone({
      identity: MANUAL_QUANTITY_PROGRESS_V1,
      query,
      status: "invalidAuthority",
      reason: "definitionConfig",
    });
  const targetValue = String(config.config.targetValue),
    unitId = String(config.config.unitId),
    observation = input.observation;
  if (!observation)
    return clone({
      identity: MANUAL_QUANTITY_PROGRESS_V1,
      query,
      status: "insufficientEvidence",
      currentGoal,
      definition,
      provenance: {
        goalId: query.goalId,
        definitionId: definition.id,
        definitionRevision: definition.revision,
        definitionEffectiveFrom: definition.effectiveFrom,
        policyRef: definition.policyRef,
        targetValue,
        unitId,
        evaluationAsOf: query.evaluationAsOf,
      },
    });
  if (
    observation.goalId !== query.goalId ||
    observation.definitionId !== definition.id ||
    observation.definitionRevision !== definition.revision ||
    observation.unitId !== unitId ||
    observation.status !== "active" ||
    observation.recordedAt > query.evaluationAsOf ||
    observation.observedAt > query.evaluationAsOf ||
    !isCanonicalUnsignedDecimal(observation.value)
  )
    return clone({
      identity: MANUAL_QUANTITY_PROGRESS_V1,
      query,
      status: "invalidAuthority",
      reason: "observationBinding",
    });
  const comparisonValue = compareCanonicalDecimals(observation.value, targetValue),
    comparison =
      comparisonValue < 0
        ? ("belowTarget" as const)
        : comparisonValue > 0
          ? ("aboveTarget" as const)
          : ("atTarget" as const);
  return clone({
    identity: MANUAL_QUANTITY_PROGRESS_V1,
    query,
    status: "available",
    currentGoal,
    definition,
    observation,
    quantity: { observedValue: observation.value, targetValue, unitId },
    ratio: { numerator: observation.value, denominator: targetValue },
    percentage: canonicalPercentage(observation.value, targetValue),
    comparison,
    provenance: {
      goalId: query.goalId,
      definitionId: definition.id,
      definitionRevision: definition.revision,
      definitionEffectiveFrom: definition.effectiveFrom,
      policyRef: definition.policyRef,
      targetValue,
      unitId,
      observationId: observation.id,
      observationRevision: observation.revision,
      observedAt: observation.observedAt,
      recordedAt: observation.recordedAt,
      observedValue: observation.value,
      evaluationAsOf: query.evaluationAsOf,
    },
  });
}
function context(goal: GoalV1): CurrentGoalProgressContextV1 {
  return clone({
    id: goal.id,
    title: goal.title,
    status: goal.status,
    ...(goal.description !== undefined ? { description: goal.description } : {}),
    ...(goal.targetDate !== undefined ? { targetDate: goal.targetDate } : {}),
  });
}
function parse(value: string) {
  if (!isCanonicalUnsignedDecimal(value)) throw new RangeError("Canonical decimal required.");
  const [whole, fraction = ""] = value.split(".");
  return { coefficient: BigInt(`${whole}${fraction}`), scale: fraction.length };
}
function power(value: number) {
  return 10n ** BigInt(value);
}
function instant(value: unknown) {
  return (
    typeof value === "string" &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function clone<T>(value: T): T {
  return structuredClone(value);
}
