import type {
  ClearLocalDataResult,
  DurabilityRetryResult,
  PersistenceRemovalOutcome,
  PersistenceWriteOutcome,
  StoreDurabilityStatus,
  StoreMutationResult,
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
};

const writeOutcomeCategories = {
  persisted: "durableSuccess",
  unavailable: "retryableUnavailable",
  serializationFailure: "recoveryRequired",
  storageFailure: "retryableStorageFailure",
} satisfies Record<PersistenceWriteOutcome["status"], DurabilitySemanticCategory>;

const removalOutcomeCategories = {
  removed: "durableSuccess",
  unavailable: "retryableUnavailable",
  storageFailure: "retryableStorageFailure",
} satisfies Record<PersistenceRemovalOutcome["status"], DurabilitySemanticCategory>;

const retainedStatusCategories = {
  unknown: "internalNoOp",
  durable: "durableSuccess",
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

export function classifySurfaceDurabilityStatus(
  status: SurfaceDurabilityStatus,
): DurabilitySemanticCategory {
  return retainedStatusCategories[status];
}

export function classifyStoreMutationResult(
  result: StoreMutationResult,
): DurabilitySemanticCategory {
  return classifyPersistenceWriteOutcome(result.persistence);
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
    default:
      return assertNever(result.reason);
  }
}

export function classifyClearLocalDataResult(
  result: ClearLocalDataResult,
): ClearDurabilitySemanticClassification {
  return {
    aggregate: clearAggregateCategories[result.durability],
    activeState: classifyPersistenceRemovalOutcome(result.activeState),
    profiles: classifyPersistenceRemovalOutcome(result.profiles),
  };
}

function assertNever(value: never): never {
  throw new TypeError(`Unhandled durability semantic value: ${String(value)}`);
}
