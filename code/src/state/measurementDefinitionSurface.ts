import {
  createGoalMeasurementDefinitionId,
  definitionSemanticFingerprint,
  resolveMeasurementDefinition,
  validateMeasurementDefinitionAuthority,
  validatePolicyConfig,
  type GoalMeasurementDefinitionAuthorityV1,
  type GoalMeasurementDefinitionId,
  type GoalMeasurementDefinitionV1,
  type GoalMeasurementPolicyRef,
} from "../core/measurement/measurementDefinition.js";
import type { GoalId, GoalV1 } from "../core/goals/goal.js";
import {
  createDayFrameDurableDb,
  MEASUREMENT_DEFINITION_STORE,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import type { IndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import type { DayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";
export type MeasurementDefinitionIngress =
  | { status: "initializing" | "accepted" }
  | { status: "protected"; reason: "readFailure" | "invalidAuthority" };
type Durability = "unknown" | "durable" | "pending" | "storageFailure";
export type MeasurementDefinitionSnapshot = {
  authority: GoalMeasurementDefinitionAuthorityV1;
  desired: GoalMeasurementDefinitionAuthorityV1;
  ingress: MeasurementDefinitionIngress;
  durability: Durability;
};
export type MeasurementDefinitionCommandResult =
  | {
      status: "accepted";
      definition: GoalMeasurementDefinitionV1;
      persistence: "durable" | "pending";
    }
  | { status: "noOp"; definition: GoalMeasurementDefinitionV1 }
  | {
      status: "rejected";
      reason:
        | "initializing"
        | "protected"
        | "goalNotFound"
        | "lineageExists"
        | "notFound"
        | "staleRevision"
        | "alreadyInactive"
        | "invalidInput"
        | "allocationFailure"
        | "nonMonotonicTime"
        | "authorityTransactionActive";
    };
export function createMeasurementDefinitionSurface(options: {
  storage?: IndexedDbCollectionStorage;
  getGoal: (id: GoalId) => GoalV1 | undefined;
  allocateId?: () => GoalMeasurementDefinitionId;
  now?: () => string;
  notificationScheduler?: DayFrameNotificationScheduler;
  canMutate?: () => boolean;
}) {
  const storage = options.storage ?? createDayFrameDurableDb(),
    allocate = options.allocateId ?? createGoalMeasurementDefinitionId,
    now = options.now ?? (() => new Date().toISOString());
  let authority: GoalMeasurementDefinitionAuthorityV1 = { version: 1, definitions: [] },
    desired = structuredClone(authority),
    ingress: MeasurementDefinitionIngress = { status: "initializing" },
    durability: Durability = "unknown";
  const listeners = new Set<(value: GoalMeasurementDefinitionAuthorityV1) => void>();
  const runtime: RuntimeAuthorityAdapter<MeasurementDefinitionSnapshot> = {
    id: "measurementDefinitions",
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
    const read = await storage.getAll<unknown>(MEASUREMENT_DEFINITION_STORE);
    if (read.status === "failure") {
      ingress = { status: "protected", reason: "readFailure" };
      durability = "storageFailure";
      return { status: "protected" as const };
    }
    const checked = validateMeasurementDefinitionAuthority(
      { version: 1, definitions: read.value },
      (id) => !!options.getGoal(id),
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
  async function create(
    goalId: GoalId,
    policyRef: GoalMeasurementPolicyRef,
    config: unknown,
  ): Promise<MeasurementDefinitionCommandResult> {
    const denied = admit();
    if (denied) return denied;
    if (!options.getGoal(goalId)) return reject("goalNotFound");
    if (authority.definitions.some((x) => x.goalId === goalId)) return reject("lineageExists");
    const checked = validatePolicyConfig(policyRef, config);
    if (checked.status === "invalid" || checked.support === "unsupported")
      return reject("invalidInput");
    let id;
    try {
      id = allocate();
    } catch {
      return reject("allocationFailure");
    }
    const at = now();
    return append(make(id, goalId, 1, "active", policyRef, checked.config, at));
  }
  async function revise(
    id: GoalMeasurementDefinitionId,
    expectedRevision: number,
    policyRef: GoalMeasurementPolicyRef,
    config: unknown,
  ): Promise<MeasurementDefinitionCommandResult> {
    const current = find(id, expectedRevision);
    if ("status" in current) return current;
    const checked = validatePolicyConfig(policyRef, config);
    if (checked.status === "invalid" || checked.support === "unsupported")
      return reject("invalidInput");
    if (
      current.value.status === "active" &&
      definitionSemanticFingerprint({ ...current.value, policyRef, config: checked.config }) ===
        current.value.fingerprint
    )
      return { status: "noOp", definition: structuredClone(current.value) };
    return next(current.value, "active", policyRef, checked.config);
  }
  async function stop(
    id: GoalMeasurementDefinitionId,
    expectedRevision: number,
  ): Promise<MeasurementDefinitionCommandResult> {
    const current = find(id, expectedRevision);
    if ("status" in current) return current;
    if (current.value.status === "inactive") return reject("alreadyInactive");
    return next(current.value, "inactive", current.value.policyRef, current.value.config);
  }
  async function restart(
    id: GoalMeasurementDefinitionId,
    expectedRevision: number,
    policyRef?: GoalMeasurementPolicyRef,
    config?: unknown,
  ): Promise<MeasurementDefinitionCommandResult> {
    const current = find(id, expectedRevision);
    if ("status" in current) return current;
    if (current.value.status === "active")
      return { status: "noOp", definition: structuredClone(current.value) };
    const ref = policyRef ?? current.value.policyRef,
      checked = validatePolicyConfig(ref, config ?? current.value.config);
    if (checked.status === "invalid" || checked.support === "unsupported")
      return reject("invalidInput");
    return next(current.value, "active", ref, checked.config);
  }
  function next(
    current: GoalMeasurementDefinitionV1,
    status: "active" | "inactive",
    ref: GoalMeasurementPolicyRef,
    config: Record<string, unknown>,
  ) {
    const at = now();
    return at <= current.effectiveFrom
      ? Promise.resolve(reject("nonMonotonicTime"))
      : append(make(current.id, current.goalId, current.revision + 1, status, ref, config, at));
  }
  function make(
    id: GoalMeasurementDefinitionId,
    goalId: GoalId,
    revision: number,
    status: "active" | "inactive",
    policyRef: GoalMeasurementPolicyRef,
    config: Record<string, unknown>,
    at: string,
  ): GoalMeasurementDefinitionV1 {
    const base = {
      version: 1 as const,
      id,
      goalId,
      revision,
      status,
      policyRef: structuredClone(policyRef),
      config: structuredClone(config),
      effectiveFrom: at,
      createdAt: at,
    };
    return { ...base, fingerprint: definitionSemanticFingerprint(base) };
  }
  async function append(
    definition: GoalMeasurementDefinitionV1,
  ): Promise<MeasurementDefinitionCommandResult> {
    authority = {
      version: 1,
      definitions: [...authority.definitions, structuredClone(definition)],
    };
    desired = structuredClone(authority);
    durability = "pending";
    notify();
    const saved = await storage.put(MEASUREMENT_DEFINITION_STORE, definition);
    durability = saved.status === "success" ? "durable" : "storageFailure";
    notify();
    return {
      status: "accepted",
      definition: structuredClone(definition),
      persistence: saved.status === "success" ? "durable" : "pending",
    };
  }
  function find(
    id: GoalMeasurementDefinitionId,
    revision: number,
  ):
    | { value: GoalMeasurementDefinitionV1 }
    | Extract<MeasurementDefinitionCommandResult, { status: "rejected" }> {
    const denied = admit();
    if (denied) return denied;
    const value = authority.definitions
      .filter((x) => x.id === id)
      .sort((a, b) => a.revision - b.revision)
      .at(-1);
    if (!value) return reject("notFound");
    return value.revision === revision ? { value } : reject("staleRevision");
  }
  function admit():
    | Extract<MeasurementDefinitionCommandResult, { status: "rejected" }>
    | undefined {
    if (options.canMutate?.() === false) return reject("authorityTransactionActive");
    if (ingress.status !== "accepted")
      return reject(ingress.status === "initializing" ? "initializing" : "protected");
  }
  function reject(
    reason: Extract<MeasurementDefinitionCommandResult, { status: "rejected" }>["reason"],
  ) {
    return { status: "rejected" as const, reason };
  }
  function notify() {
    options.notificationScheduler?.notify("measurementDefinitions", () => {
      for (const listener of listeners) listener(structuredClone(authority));
    });
  }
  async function replaceDurable(value: GoalMeasurementDefinitionAuthorityV1) {
    const checked = validateMeasurementDefinitionAuthority(value, (id) => !!options.getGoal(id));
    if (checked.status === "invalid") return false;
    const result = await storage.mutate([
      { type: "clear", store: MEASUREMENT_DEFINITION_STORE },
      ...checked.authority.definitions.map((entry) => ({
        type: "put" as const,
        store: MEASUREMENT_DEFINITION_STORE,
        value: entry,
      })),
    ]);
    return result.status === "success";
  }
  async function clear() {
    const unresolvedEmpty = ingress.status === "initializing" && authority.definitions.length === 0;
    authority = { version: 1, definitions: [] };
    desired = structuredClone(authority);
    const result = await storage.clear(MEASUREMENT_DEFINITION_STORE);
    durability = result.status === "success" ? "durable" : "storageFailure";
    notify();
    return result.status === "success" || unresolvedEmpty
      ? { status: "removed" as const }
      : { status: "storageFailure" as const };
  }
  return {
    initializeMeasurementDefinitions: initialize,
    createMeasurementDefinition: create,
    reviseMeasurementDefinition: revise,
    stopMeasuringGoal: stop,
    restartMeasurement: restart,
    getCurrentMeasurementDefinition: (goalId: GoalId, asOf: string) =>
      resolveMeasurementDefinition(authority, goalId, asOf),
    getMeasurementDefinitionRevision: (id: GoalMeasurementDefinitionId, revision: number) =>
      structuredClone(authority.definitions.find((x) => x.id === id && x.revision === revision)),
    listMeasurementDefinitionHistory: (goalId: GoalId) =>
      structuredClone(
        authority.definitions
          .filter((x) => x.goalId === goalId)
          .sort((a, b) => a.revision - b.revision),
      ),
    exportMeasurementDefinitionAuthority: () => structuredClone(authority),
    getMeasurementDefinitionIngressStatus: () => structuredClone(ingress),
    getMeasurementDefinitionDurabilityStatus: () => durability,
    subscribeMeasurementDefinitions: (
      listener: (value: GoalMeasurementDefinitionAuthorityV1) => void,
    ) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    retryMeasurementDefinitionPersistence: async () => {
      const ok = await replaceDurable(desired);
      durability = ok ? "durable" : "storageFailure";
      notify();
      return ok ? { status: "durable" as const } : { status: "storageFailure" as const };
    },
    clearMeasurementDefinitions: clear,
    replaceDurable,
    getRuntimeAuthorityAdapter: (cap: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (cap !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) throw new Error("Invalid capability");
      return runtime;
    },
  };
}
export type MeasurementDefinitionSurface = ReturnType<typeof createMeasurementDefinitionSurface>;
