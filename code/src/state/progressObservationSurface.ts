import type { GoalId, GoalV1 } from "../core/goals/goal.js";
import {
  MANUAL_QUANTITY_TARGET_POLICY_V1,
  type GoalMeasurementDefinitionId,
  type GoalMeasurementDefinitionV1,
} from "../core/measurement/measurementDefinition.js";
import {
  compareObservations,
  createGoalProgressObservationId,
  effectiveGoalObservations,
  effectiveObservationHead,
  isCanonicalInstant,
  isCanonicalObservationValue,
  isDefinitionActiveAt,
  latestEffectiveObservation,
  observationSemanticFingerprint,
  validateProgressObservationAuthority,
  type GoalProgressObservationAuthorityV1,
  type GoalProgressObservationId,
  type GoalProgressObservationV1,
} from "../core/progressObservation/progressObservation.js";
import {
  createDayFrameDurableDb,
  PROGRESS_OBSERVATION_STORE,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import type { IndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import type { DayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";
export type ProgressObservationIngress =
  | { status: "initializing" | "accepted" }
  | { status: "protected"; reason: "readFailure" | "invalidAuthority" | "dependencyProtected" };
type Durability = "unknown" | "durable" | "pending" | "storageFailure";
export type ProgressObservationSnapshot = {
  authority: GoalProgressObservationAuthorityV1;
  desired: GoalProgressObservationAuthorityV1;
  ingress: ProgressObservationIngress;
  durability: Durability;
};
export type ProgressObservationCommandResult =
  | {
      status: "accepted";
      observation: GoalProgressObservationV1;
      persistence: "durable" | "pending";
    }
  | { status: "noOp"; observation: GoalProgressObservationV1 }
  | {
      status: "rejected";
      reason:
        | "initializing"
        | "protected"
        | "goalNotFound"
        | "noActiveDefinition"
        | "staleDefinition"
        | "unsupportedPolicy"
        | "invalidValue"
        | "invalidObservedAt"
        | "futureObservedAt"
        | "conflictingObservationTime"
        | "notFound"
        | "staleRevision"
        | "retracted"
        | "invalidEpoch"
        | "nonMonotonicTime"
        | "allocationFailure"
        | "authorityTransactionActive";
    };
export function createProgressObservationSurface(options: {
  storage?: IndexedDbCollectionStorage;
  getGoal: (id: GoalId) => GoalV1 | undefined;
  getDefinition: (
    id: GoalMeasurementDefinitionId,
    revision: number,
  ) => GoalMeasurementDefinitionV1 | undefined;
  resolveDefinition: (
    goalId: GoalId,
    asOf: string,
  ) =>
    | { status: "available" | "unsupportedPolicy"; definition: GoalMeasurementDefinitionV1 }
    | { status: "notDefined" };
  dependenciesReady?: () => "ready" | "initializing" | "protected";
  allocateId?: () => GoalProgressObservationId;
  now?: () => string;
  notificationScheduler?: DayFrameNotificationScheduler;
  canMutate?: () => boolean;
}) {
  const storage = options.storage ?? createDayFrameDurableDb(),
    allocate = options.allocateId ?? createGoalProgressObservationId,
    now = options.now ?? (() => new Date().toISOString());
  let authority: GoalProgressObservationAuthorityV1 = { version: 1, observations: [] },
    desired = structuredClone(authority),
    ingress: ProgressObservationIngress = { status: "initializing" },
    durability: Durability = "unknown";
  const listeners = new Set<(value: GoalProgressObservationAuthorityV1) => void>();
  const refs = {
    goalExists: (id: GoalId) => !!options.getGoal(id),
    getDefinition: options.getDefinition,
  };
  const runtime: RuntimeAuthorityAdapter<ProgressObservationSnapshot> = {
    id: "progressObservations",
    captureRuntimeSnapshot: () => structuredClone({ authority, desired, ingress, durability }),
    installRuntimeExact: (target) => {
      authority = structuredClone(target.authority);
      desired = structuredClone(target.desired);
      ingress = structuredClone(target.ingress);
      durability = target.durability;
      notify();
    },
  };
  async function initialize() {
    const dependency = options.dependenciesReady?.() ?? "ready";
    if (dependency !== "ready") {
      ingress = { status: "protected", reason: "dependencyProtected" };
      durability = "storageFailure";
      return { status: "protected" as const };
    }
    const read = await storage.getAll<unknown>(PROGRESS_OBSERVATION_STORE);
    if (read.status === "failure") {
      ingress = { status: "protected", reason: "readFailure" };
      durability = "storageFailure";
      return { status: "protected" as const };
    }
    const checked = validateProgressObservationAuthority(
      { version: 1, observations: read.value },
      refs,
    );
    if (checked.status === "invalid") {
      ingress = { status: "protected", reason: "invalidAuthority" };
      durability = "storageFailure";
      return { status: "protected" as const };
    }
    authority = checked.authority;
    desired = structuredClone(authority);
    ingress = { status: "accepted" };
    durability = "durable";
    notify();
    return { status: "ready" as const };
  }
  async function create(input: {
    goalId: GoalId;
    observedAt: string;
    value: string;
    expectedDefinitionRevision: number;
  }): Promise<ProgressObservationCommandResult> {
    const denied = admit();
    if (denied) return denied;
    if (!options.getGoal(input.goalId)) return reject("goalNotFound");
    if (!isCanonicalInstant(input.observedAt)) return reject("invalidObservedAt");
    if (!isCanonicalObservationValue(input.value)) return reject("invalidValue");
    const recordedAt = now();
    if (input.observedAt > recordedAt) return reject("futureObservedAt");
    const resolved = options.resolveDefinition(input.goalId, input.observedAt);
    if (resolved.status === "notDefined") return reject("noActiveDefinition");
    if (resolved.definition.revision !== input.expectedDefinitionRevision)
      return reject("staleDefinition");
    if (
      resolved.status === "unsupportedPolicy" ||
      resolved.definition.policyRef.id !== MANUAL_QUANTITY_TARGET_POLICY_V1.id ||
      resolved.definition.policyRef.version !== 1
    )
      return reject("unsupportedPolicy");
    if (
      conflict(input.goalId, resolved.definition.id, resolved.definition.revision, input.observedAt)
    )
      return reject("conflictingObservationTime");
    let id;
    try {
      id = allocate();
    } catch {
      return reject("allocationFailure");
    }
    return append(
      make(
        id,
        1,
        input.goalId,
        resolved.definition,
        input.value,
        input.observedAt,
        recordedAt,
        "active",
      ),
    );
  }
  async function correct(input: {
    id: GoalProgressObservationId;
    expectedRevision: number;
    value: string;
    observedAt: string;
  }): Promise<ProgressObservationCommandResult> {
    const found = head(input.id, input.expectedRevision);
    if ("status" in found) return found;
    const current = found.value;
    if (current.status === "retracted") return reject("retracted");
    if (!isCanonicalInstant(input.observedAt)) return reject("invalidObservedAt");
    if (!isCanonicalObservationValue(input.value)) return reject("invalidValue");
    if (input.value === current.value && input.observedAt === current.observedAt)
      return { status: "noOp", observation: structuredClone(current) };
    const definition = options.getDefinition(current.definitionId, current.definitionRevision);
    if (!definition || !isDefinitionActiveAt(definition, input.observedAt, options.getDefinition))
      return reject("invalidEpoch");
    const recordedAt = now();
    if (input.observedAt > recordedAt) return reject("futureObservedAt");
    if (recordedAt <= current.recordedAt) return reject("nonMonotonicTime");
    if (
      conflict(
        current.goalId,
        current.definitionId,
        current.definitionRevision,
        input.observedAt,
        current.id,
      )
    )
      return reject("conflictingObservationTime");
    return append(
      make(
        current.id,
        current.revision + 1,
        current.goalId,
        definition,
        input.value,
        input.observedAt,
        recordedAt,
        "active",
      ),
    );
  }
  async function retract(
    id: GoalProgressObservationId,
    expectedRevision: number,
  ): Promise<ProgressObservationCommandResult> {
    const found = head(id, expectedRevision);
    if ("status" in found) return found;
    const current = found.value;
    if (current.status === "retracted")
      return { status: "noOp", observation: structuredClone(current) };
    const definition = options.getDefinition(current.definitionId, current.definitionRevision);
    if (!definition) return reject("invalidEpoch");
    const recordedAt = now();
    if (recordedAt <= current.recordedAt) return reject("nonMonotonicTime");
    return append(
      make(
        current.id,
        current.revision + 1,
        current.goalId,
        definition,
        current.value,
        current.observedAt,
        recordedAt,
        "retracted",
      ),
    );
  }
  function make(
    id: GoalProgressObservationId,
    revision: number,
    goalId: GoalId,
    definition: GoalMeasurementDefinitionV1,
    value: string,
    observedAt: string,
    recordedAt: string,
    status: "active" | "retracted",
  ): GoalProgressObservationV1 {
    const unitId = String(definition.config.unitId);
    const base = {
      version: 1 as const,
      id,
      revision,
      goalId,
      definitionId: definition.id,
      definitionRevision: definition.revision,
      unitId,
      value,
      observedAt,
      recordedAt,
      status,
    };
    return { ...base, fingerprint: observationSemanticFingerprint(base) };
  }
  async function append(
    observation: GoalProgressObservationV1,
  ): Promise<ProgressObservationCommandResult> {
    authority = {
      version: 1,
      observations: [...authority.observations, structuredClone(observation)].sort(
        compareObservations,
      ),
    };
    desired = structuredClone(authority);
    durability = "pending";
    notify();
    const saved = await storage.put(PROGRESS_OBSERVATION_STORE, observation);
    durability = saved.status === "success" ? "durable" : "storageFailure";
    notify();
    return {
      status: "accepted",
      observation: structuredClone(observation),
      persistence: saved.status === "success" ? "durable" : "pending",
    };
  }
  function head(
    id: GoalProgressObservationId,
    revision: number,
  ):
    | { value: GoalProgressObservationV1 }
    | Extract<ProgressObservationCommandResult, { status: "rejected" }> {
    const denied = admit();
    if (denied) return denied;
    const value = authority.observations
      .filter((x) => x.id === id)
      .sort((a, b) => a.revision - b.revision)
      .at(-1);
    if (!value) return reject("notFound");
    return value.revision === revision ? { value } : reject("staleRevision");
  }
  function conflict(
    goalId: GoalId,
    definitionId: GoalMeasurementDefinitionId,
    definitionRevision: number,
    observedAt: string,
    exclude?: GoalProgressObservationId,
  ) {
    return effectiveGoalObservations(authority, goalId, "9999-12-31T23:59:59.999Z").some(
      (item) =>
        item.id !== exclude &&
        item.definitionId === definitionId &&
        item.definitionRevision === definitionRevision &&
        item.observedAt === observedAt,
    );
  }
  function admit(): Extract<ProgressObservationCommandResult, { status: "rejected" }> | undefined {
    if (options.canMutate?.() === false) return reject("authorityTransactionActive");
    if (ingress.status !== "accepted")
      return reject(ingress.status === "initializing" ? "initializing" : "protected");
  }
  function reject(
    reason: Extract<ProgressObservationCommandResult, { status: "rejected" }>["reason"],
  ) {
    return { status: "rejected" as const, reason };
  }
  function notify() {
    options.notificationScheduler?.notify("progressObservations", () => {
      for (const listener of listeners) listener(structuredClone(authority));
    });
  }
  async function replaceDurable(value: GoalProgressObservationAuthorityV1) {
    const checked = validateProgressObservationAuthority(value, refs);
    if (checked.status === "invalid") return false;
    const result = await storage.mutate([
      { type: "clear", store: PROGRESS_OBSERVATION_STORE },
      ...checked.authority.observations.map((entry) => ({
        type: "put" as const,
        store: PROGRESS_OBSERVATION_STORE,
        value: entry,
      })),
    ]);
    return result.status === "success";
  }
  async function clear() {
    const unresolvedEmpty =
      ingress.status === "initializing" && authority.observations.length === 0;
    authority = { version: 1, observations: [] };
    desired = structuredClone(authority);
    const result = await storage.clear(PROGRESS_OBSERVATION_STORE);
    durability = result.status === "success" ? "durable" : "storageFailure";
    notify();
    return result.status === "success" || unresolvedEmpty
      ? { status: "removed" as const }
      : { status: "storageFailure" as const };
  }
  return {
    initializeProgressObservations: initialize,
    createProgressObservation: create,
    correctProgressObservation: correct,
    retractProgressObservation: retract,
    getProgressObservationRevision: (
      id: GoalProgressObservationId,
      revision: number,
    ): GoalProgressObservationV1 | undefined => {
      const value = authority.observations.find((x) => x.id === id && x.revision === revision);
      return value ? structuredClone(value) : undefined;
    },
    listProgressObservationHistory: (id: GoalProgressObservationId) =>
      structuredClone(
        authority.observations.filter((x) => x.id === id).sort((a, b) => a.revision - b.revision),
      ),
    getEffectiveProgressObservationHead: (id: GoalProgressObservationId, asOf: string) =>
      effectiveObservationHead(authority, id, asOf),
    listGoalProgressObservations: (goalId: GoalId, asOf: string) =>
      effectiveGoalObservations(authority, goalId, asOf),
    listDefinitionProgressObservations: (
      id: GoalMeasurementDefinitionId,
      revision: number,
      asOf: string,
    ): GoalProgressObservationV1[] => {
      const goalId = authority.observations.find(
        (x) => x.definitionId === id && x.definitionRevision === revision,
      )?.goalId;
      if (!goalId) return [];
      return effectiveGoalObservations(authority, goalId, asOf).filter(
        (x) => x.definitionId === id && x.definitionRevision === revision,
      );
    },
    getLatestProgressObservation: (
      goalId: GoalId,
      id: GoalMeasurementDefinitionId,
      revision: number,
      asOf: string,
    ) => {
      const value = latestEffectiveObservation(authority, goalId, id, revision, asOf);
      return value ? structuredClone(value) : undefined;
    },
    exportProgressObservationAuthority: () => structuredClone(authority),
    getProgressObservationIngressStatus: () => structuredClone(ingress),
    getProgressObservationDurabilityStatus: () => durability,
    subscribeProgressObservations: (
      listener: (value: GoalProgressObservationAuthorityV1) => void,
    ) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    retryProgressObservationPersistence: async () => {
      const ok = await replaceDurable(desired);
      durability = ok ? "durable" : "storageFailure";
      notify();
      return ok ? { status: "durable" as const } : { status: "storageFailure" as const };
    },
    clearProgressObservations: clear,
    replaceDurable,
    getRuntimeAuthorityAdapter: (cap: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (cap !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) throw new Error("Invalid capability");
      return runtime;
    },
  };
}
export type ProgressObservationSurface = ReturnType<typeof createProgressObservationSurface>;
