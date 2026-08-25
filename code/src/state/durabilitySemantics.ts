import type {
  ActivePersistenceMutationResult,
  ActivePersistenceOutcome,
  ActiveRemovalOutcome,
  ClearLocalDataResult,
  DurabilityRetryResult,
  PersistenceRemovalOutcome,
  PersistenceWriteOutcome,
  StoreDurabilityStatus,
  PersistenceMutationResult,
  SurfaceDurabilityStatus,
} from "./types.js";

export type DurabilitySemanticCategory =
  | "durableSuccess"
  | "retryableUnavailable"
  | "retryableStorageFailure"
  | "recoveryRequired"
  | "internalNoOp";

export type StoreDurabilitySemanticClassification = {
  activeState: DurabilitySemanticCategory;
  profiles: DurabilitySemanticCategory;
};

export type ClearDurabilityAggregateSemantic =
  | "durableSuccess"
  | "partialDurabilityFailure"
  | "durabilityFailure";

export type ClearDurabilitySemanticClassification = {
  aggregate: ClearDurabilityAggregateSemantic;
  activeState: DurabilitySemanticCategory;
  profiles: DurabilitySemanticCategory;
  planDecisions: DurabilitySemanticCategory;
  executionHistory: DurabilitySemanticCategory;
  historicalPlan: DurabilitySemanticCategory;
  goals: DurabilitySemanticCategory;
  measurementDefinitions: DurabilitySemanticCategory;
};

const writeOutcomeCategories = {
  persisted: "durableSuccess",
  pending: "internalNoOp",
  unavailable: "retryableUnavailable",
  serializationFailure: "recoveryRequired",
  storageFailure: "retryableStorageFailure",
} satisfies Record<PersistenceWriteOutcome["status"], DurabilitySemanticCategory>;

const removalOutcomeCategories = {
  removed: "durableSuccess",
  pending: "internalNoOp",
  unavailable: "retryableUnavailable",
  storageFailure: "retryableStorageFailure",
} satisfies Record<PersistenceRemovalOutcome["status"], DurabilitySemanticCategory>;

const retainedStatusCategories = {
  unknown: "internalNoOp",
  durable: "durableSuccess",
  pending: "internalNoOp",
  unavailable: "retryableUnavailable",
  serializationFailure: "recoveryRequired",
  storageFailure: "retryableStorageFailure",
} satisfies Record<SurfaceDurabilityStatus, DurabilitySemanticCategory>;

const clearAggregateCategories = {
  cleared: "durableSuccess",
  partiallyCleared: "partialDurabilityFailure",
  notCleared: "durabilityFailure",
} satisfies Record<ClearLocalDataResult["durability"], ClearDurabilityAggregateSemantic>;

export function classifyPersistenceWriteOutcome(
  outcome: PersistenceWriteOutcome,
): DurabilitySemanticCategory {
  return writeOutcomeCategories[outcome.status];
}

export function classifyPersistenceRemovalOutcome(
  outcome: PersistenceRemovalOutcome,
): DurabilitySemanticCategory {
  return removalOutcomeCategories[outcome.status];
}

export function classifyActivePersistenceOutcome(
  outcome: ActivePersistenceOutcome,
): DurabilitySemanticCategory {
  return outcome.status === "blocked" ? "internalNoOp" : classifyPersistenceWriteOutcome(outcome);
}

function classifyActiveRemovalOutcome(outcome: ActiveRemovalOutcome): DurabilitySemanticCategory {
  return outcome.status === "blocked" ? "internalNoOp" : classifyPersistenceRemovalOutcome(outcome);
}

export function classifySurfaceDurabilityStatus(
  status: SurfaceDurabilityStatus,
): DurabilitySemanticCategory {
  return retainedStatusCategories[status];
}

export function classifyStoreMutationResult(
  result: PersistenceMutationResult,
): DurabilitySemanticCategory {
  return classifyPersistenceWriteOutcome(result.persistence);
}

export function classifyActiveStoreMutationResult(
  result: ActivePersistenceMutationResult,
): DurabilitySemanticCategory {
  return classifyActivePersistenceOutcome(result.persistence);
}

export function classifyStoreDurabilityStatus(
  status: StoreDurabilityStatus,
): StoreDurabilitySemanticClassification {
  return {
    activeState: classifySurfaceDurabilityStatus(status.activeState),
    profiles: classifySurfaceDurabilityStatus(status.profiles),
  };
}

export function classifyDurabilityRetryResult(
  result: DurabilityRetryResult,
): DurabilitySemanticCategory {
  if (result.status === "attempted") {
    return result.desiredCondition === "snapshot"
      ? classifyPersistenceWriteOutcome(result.persistence)
      : classifyPersistenceRemovalOutcome(result.persistence);
  }

  switch (result.reason) {
    case "alreadyDurable":
      return "durableSuccess";
    case "unknown":
      return "internalNoOp";
    case "serializationFailure":
      return "recoveryRequired";
    case "recoveryProtected":
      return "internalNoOp";
    default:
      return assertNever(result.reason);
  }
}

export function classifyClearLocalDataResult(
  result: ClearLocalDataResult,
): ClearDurabilitySemanticClassification {
  return {
    aggregate: clearAggregateCategories[result.durability],
    activeState: classifyActiveRemovalOutcome(result.activeState),
    profiles: classifyPersistenceRemovalOutcome(result.profiles),
    planDecisions: classifyPersistenceRemovalOutcome(result.planDecisions),
    executionHistory: classifyPersistenceRemovalOutcome(result.executionHistory),
    historicalPlan: classifyPersistenceRemovalOutcome(result.historicalPlan),
    goals: classifyPersistenceRemovalOutcome(result.goals),
    measurementDefinitions: classifyPersistenceRemovalOutcome(result.measurementDefinitions),
  };
}

function assertNever(value: never): never {
  throw new TypeError(`Unhandled durability semantic value: ${String(value)}`);
}
