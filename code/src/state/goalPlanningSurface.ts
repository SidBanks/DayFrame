import type { GoalId, GoalV1 } from "../core/goals/goal.js";
import type { LocalDateString } from "../core/shifts/types.js";
import type { CanonicalUserDayResolverInput } from "../core/time/canonicalUserDay.js";
import {
  applicablePriorityForGoal,
  currentDemandsForGoal,
  directPlanningAuthoringProvenance,
  emptyGoalPlanningAuthority,
  resolveDemandRevision,
  resolvePriorityRevision,
  validateGoalPlanningAuthority,
  type DemandCadenceV1,
  type DemandLifecycle,
  type DemandSatisfactionV1,
  type DemandSessionShapeV1,
  type GoalDemandIntentV1,
  type GoalPlanningAuthorityV2,
  type GoalPriorityLevel,
  type GoalPriorityV1,
  type UserDayHorizonV1,
} from "../core/planning/goalDemand.js";
import {
  resolveDemandFootprintAssociation,
  type DemandResourceFootprintAssociationV1,
  type DemandResourceFootprintSpecV1,
} from "../core/planning/demandResourceFootprint.js";
import {
  createPlanningFactId,
  planningRevision,
  type PlanningFactId,
} from "../core/planning/planningFoundation.js";
import type { StructuralEligibilityV1 } from "../core/planning/goalStructure.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
import {
  GOAL_PLANNING_STORE,
  createDayFrameDurableDb,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import type { IndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import type { DayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";

export type GoalPlanningIngressStatus =
  | { status: "initializing" | "accepted" }
  | { status: "protected"; reason: "readFailure" | "invalidAuthority" };
export type GoalPlanningDurabilityStatus = "unknown" | "durable" | "pending" | "storageFailure";
export type GoalPlanningCommandResult<T> =
  | { status: "accepted"; value: T; persistence: "durable" | "pending"; changed: boolean }
  | {
      status: "rejected";
      reason:
        | "initializing"
        | "protected"
        | "notFound"
        | "staleRevision"
        | "missingGoal"
        | "invalidInput"
        | "conflict"
        | "allocationFailure"
        | "authorityTransactionActive"
        | "invalidTransition";
    };

export function createGoalPlanningSurface(options: {
  storage?: IndexedDbCollectionStorage;
  getGoal: (id: GoalId) => GoalV1 | undefined;
  listGoals: () => GoalV1[];
  getStructuralEligibility: (id: GoalId) => StructuralEligibilityV1;
  getUserDayResolver: () => CanonicalUserDayResolverInput;
  allocateId?: () => PlanningFactId;
  now?: () => string;
  notificationScheduler?: DayFrameNotificationScheduler;
  canMutate?: () => boolean;
}) {
  const storage = options.storage ?? createDayFrameDurableDb();
  const allocateId = options.allocateId ?? createPlanningFactId;
  const now = options.now ?? (() => new Date().toISOString());
  let authority = emptyGoalPlanningAuthority();
  let desired = structuredClone(authority);
  let ingress: GoalPlanningIngressStatus = { status: "initializing" };
  let durability: GoalPlanningDurabilityStatus = "unknown";
  const listeners = new Set<() => void>();
  const runtime: RuntimeAuthorityAdapter<{
    authority: GoalPlanningAuthorityV2;
    desired: GoalPlanningAuthorityV2;
    ingress: GoalPlanningIngressStatus;
    durability: GoalPlanningDurabilityStatus;
  }> = {
    id: "goalPlanning",
    captureRuntimeSnapshot: () => structuredClone({ authority, desired, ingress, durability }),
    installRuntimeExact: (target) => {
      authority = structuredClone(target.authority);
      desired = structuredClone(target.desired);
      ingress = structuredClone(target.ingress);
      durability = target.durability;
      notify();
    },
  };

  async function initializeGoalPlanning() {
    const loaded = await storage.getAll<unknown>(GOAL_PLANNING_STORE);
    if (loaded.status === "failure") return protect("readFailure");
    const demands = loaded.value.filter(
      (item): item is GoalDemandIntentV1 => recordType(item) === "demand",
    );
    const priorities = loaded.value.filter(
      (item): item is GoalPriorityV1 => recordType(item) === "priority",
    );
    const footprintSpecifications = loaded.value.filter(
      (item): item is DemandResourceFootprintSpecV1 =>
        recordType(item) === "demandResourceFootprintSpec",
    );
    const footprintAssociations = loaded.value.filter(
      (item): item is DemandResourceFootprintAssociationV1 =>
        recordType(item) === "demandResourceFootprintAssociation",
    );
    if (
      demands.length +
        priorities.length +
        footprintSpecifications.length +
        footprintAssociations.length !==
      loaded.value.length
    )
      return protect("invalidAuthority");
    const checked = validateGoalPlanningAuthority(
      { version: 2, demands, priorities, footprintSpecifications, footprintAssociations },
      options.listGoals(),
    );
    if (checked.status === "invalid") return protect("invalidAuthority");
    authority = checked.authority;
    desired = structuredClone(authority);
    ingress = { status: "accepted" };
    durability = "durable";
    notify();
    return { status: "ready" as const };
  }
  function protect(reason: "readFailure" | "invalidAuthority") {
    ingress = { status: "protected", reason };
    durability = "storageFailure";
    return { status: "protected" as const };
  }

  async function createDemand(input: {
    goalId: GoalId;
    requestedEffort: GoalDemandIntentV1["requestedEffort"];
    horizon: UserDayHorizonV1;
    session: DemandSessionShapeV1;
    satisfaction: DemandSatisfactionV1;
    cadence: DemandCadenceV1;
  }) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    const id = allocateIdSafely(allocateId);
    if (!id) return allocationFailure();
    const at = now();
    const candidate: GoalDemandIntentV1 = {
      recordType: "demand",
      version: 1,
      id,
      revision: planningRevision(1),
      ...structuredClone(input),
      lifecycle: "active",
      createdAt: at,
      updatedAt: at,
      effectiveFrom: at,
      provenance: directPlanningAuthoringProvenance(),
    };
    return accept({ ...authority, demands: [...authority.demands, candidate] }, candidate);
  }
  async function reviseDemand(
    id: PlanningFactId,
    expectedRevision: number,
    patch: Partial<
      Pick<
        GoalDemandIntentV1,
        "requestedEffort" | "horizon" | "session" | "satisfaction" | "cadence"
      >
    >,
  ) {
    const found = currentDemand(id, expectedRevision);
    if ("status" in found) return found;
    if (found.value.lifecycle === "retired") return rejected("invalidTransition");
    const semantic = {
      requestedEffort: patch.requestedEffort ?? found.value.requestedEffort,
      horizon: patch.horizon ?? found.value.horizon,
      session: patch.session ?? found.value.session,
      satisfaction: patch.satisfaction ?? found.value.satisfaction,
      cadence: patch.cadence ?? found.value.cadence,
    };
    if (
      semanticFingerprint(semantic) ===
      semanticFingerprint({
        requestedEffort: found.value.requestedEffort,
        horizon: found.value.horizon,
        session: found.value.session,
        satisfaction: found.value.satisfaction,
        cadence: found.value.cadence,
      })
    )
      return unchanged(found.value, durability);
    const candidate: GoalDemandIntentV1 = {
      ...found.value,
      ...structuredClone(semantic),
      revision: planningRevision(found.value.revision + 1),
      updatedAt: now(),
    };
    return accept({ ...authority, demands: [...authority.demands, candidate] }, candidate);
  }
  async function setDemandLifecycle(
    id: PlanningFactId,
    expectedRevision: number,
    lifecycle: DemandLifecycle,
  ) {
    const found = currentDemand(id, expectedRevision);
    if ("status" in found) return found;
    if (found.value.lifecycle === lifecycle) return unchanged(found.value, durability);
    if (!allowedDemandTransition(found.value.lifecycle, lifecycle))
      return rejected("invalidTransition");
    const at = now();
    const terminal = ["expired", "completed", "retired"].includes(lifecycle);
    const candidate: GoalDemandIntentV1 = {
      ...found.value,
      lifecycle,
      revision: planningRevision(found.value.revision + 1),
      updatedAt: at,
    };
    delete candidate.effectiveTo;
    if (terminal) candidate.effectiveTo = at;
    return accept({ ...authority, demands: [...authority.demands, candidate] }, candidate);
  }
  async function createPriority(input: {
    goalId: GoalId;
    level: GoalPriorityLevel;
    scope: GoalPriorityV1["scope"];
  }) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    const id = allocateIdSafely(allocateId);
    if (!id) return allocationFailure();
    const at = now();
    const candidate: GoalPriorityV1 = {
      recordType: "priority",
      version: 1,
      id,
      revision: planningRevision(1),
      ...structuredClone(input),
      status: "active",
      createdAt: at,
      updatedAt: at,
      effectiveFrom: at,
      provenance: directPlanningAuthoringProvenance(),
    };
    return accept({ ...authority, priorities: [...authority.priorities, candidate] }, candidate);
  }
  async function revisePriority(
    id: PlanningFactId,
    expectedRevision: number,
    patch: Partial<Pick<GoalPriorityV1, "level" | "scope">>,
  ) {
    const found = currentPriority(id, expectedRevision);
    if ("status" in found) return found;
    if (found.value.status === "retired") return rejected("invalidTransition");
    const semantic = {
      level: patch.level ?? found.value.level,
      scope: patch.scope ?? found.value.scope,
    };
    if (
      semanticFingerprint(semantic) ===
      semanticFingerprint({ level: found.value.level, scope: found.value.scope })
    )
      return unchanged(found.value, durability);
    const candidate: GoalPriorityV1 = {
      ...found.value,
      ...structuredClone(semantic),
      revision: planningRevision(found.value.revision + 1),
      updatedAt: now(),
    };
    return accept({ ...authority, priorities: [...authority.priorities, candidate] }, candidate);
  }
  async function retirePriority(id: PlanningFactId, expectedRevision: number) {
    const found = currentPriority(id, expectedRevision);
    if ("status" in found) return found;
    if (found.value.status === "retired") return unchanged(found.value, durability);
    const at = now();
    const candidate: GoalPriorityV1 = {
      ...found.value,
      status: "retired",
      revision: planningRevision(found.value.revision + 1),
      updatedAt: at,
      effectiveTo: at,
    };
    return accept({ ...authority, priorities: [...authority.priorities, candidate] }, candidate);
  }

  async function createDemandResourceFootprintSpec(input: {
    name: string;
    variants: DemandResourceFootprintSpecV1["variants"];
  }) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    const id = allocateIdSafely(allocateId);
    if (!id) return allocationFailure();
    const at = now();
    const candidate: DemandResourceFootprintSpecV1 = {
      recordType: "demandResourceFootprintSpec",
      version: 1,
      id,
      revision: planningRevision(1),
      status: "active",
      name: input.name,
      variants: structuredClone(input.variants),
      createdAt: at,
      updatedAt: at,
      provenance: directPlanningAuthoringProvenance(),
    };
    return accept(
      {
        ...authority,
        footprintSpecifications: [...authority.footprintSpecifications, candidate],
      },
      candidate,
    );
  }
  async function reviseDemandResourceFootprintSpec(
    id: PlanningFactId,
    expectedRevision: number,
    patch: Partial<Pick<DemandResourceFootprintSpecV1, "name" | "variants">>,
  ) {
    const found = current(authority.footprintSpecifications, id, expectedRevision);
    if ("status" in found) return found;
    if (found.value.status === "retired") return rejected("invalidTransition");
    const semantic = {
      name: patch.name ?? found.value.name,
      variants: patch.variants ?? found.value.variants,
    };
    if (
      semanticFingerprint(semantic) ===
      semanticFingerprint({ name: found.value.name, variants: found.value.variants })
    )
      return unchanged(found.value, durability);
    const candidate: DemandResourceFootprintSpecV1 = {
      ...found.value,
      ...structuredClone(semantic),
      revision: planningRevision(found.value.revision + 1),
      updatedAt: now(),
    };
    return accept(
      {
        ...authority,
        footprintSpecifications: [...authority.footprintSpecifications, candidate],
      },
      candidate,
    );
  }
  async function retireDemandResourceFootprintSpec(id: PlanningFactId, expectedRevision: number) {
    const found = current(authority.footprintSpecifications, id, expectedRevision);
    if ("status" in found) return found;
    if (found.value.status === "retired") return unchanged(found.value, durability);
    const at = now(),
      candidate: DemandResourceFootprintSpecV1 = {
        ...found.value,
        revision: planningRevision(found.value.revision + 1),
        status: "retired",
        updatedAt: at,
        effectiveTo: at,
      };
    return accept(
      {
        ...authority,
        footprintSpecifications: [...authority.footprintSpecifications, candidate],
      },
      candidate,
    );
  }
  async function setDemandResourceFootprintAssociation(input: {
    demandId: PlanningFactId;
    selection: DemandResourceFootprintAssociationV1["selection"];
    expectedRevision?: number;
  }) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    const demand = authority.demands.some((value) => value.id === input.demandId);
    if (!demand) return rejected("notFound");
    const existing = authority.footprintAssociations
      .filter((value) => value.demandId === input.demandId)
      .sort((a, b) => b.revision - a.revision)[0];
    if (existing && input.expectedRevision !== existing.revision) return rejected("staleRevision");
    if (!existing && input.expectedRevision !== undefined) return rejected("staleRevision");
    if (
      existing?.status === "active" &&
      semanticFingerprint(existing.selection) === semanticFingerprint(input.selection)
    )
      return unchanged(existing, durability);
    const at = now(),
      id = existing?.id ?? allocateIdSafely(allocateId);
    if (!id) return allocationFailure();
    const candidate: DemandResourceFootprintAssociationV1 = {
      recordType: "demandResourceFootprintAssociation",
      version: 1,
      id,
      revision: planningRevision((existing?.revision ?? 0) + 1),
      demandId: input.demandId,
      status: "active",
      selection: structuredClone(input.selection),
      createdAt: existing?.createdAt ?? at,
      updatedAt: at,
      provenance: directPlanningAuthoringProvenance(),
    };
    return accept(
      {
        ...authority,
        footprintAssociations: [...authority.footprintAssociations, candidate],
      },
      candidate,
    );
  }

  async function accept<T>(
    next: GoalPlanningAuthorityV2,
    value: T,
  ): Promise<GoalPlanningCommandResult<T>> {
    const checked = validateGoalPlanningAuthority(next, options.listGoals());
    if (checked.status === "invalid")
      return rejected(
        checked.issues.some((issue) => issue.code === "missingGoal")
          ? "missingGoal"
          : checked.issues.some((issue) => issue.code === "conflictingPriority")
            ? "conflict"
            : "invalidInput",
      );
    authority = checked.authority;
    desired = structuredClone(authority);
    durability = "pending";
    notify();
    const persisted = await replaceDurable(authority);
    durability = persisted ? "durable" : "storageFailure";
    notify();
    return {
      status: "accepted",
      value: structuredClone(value),
      persistence: persisted ? "durable" : "pending",
      changed: true,
    };
  }
  async function replaceDurable(value: GoalPlanningAuthorityV2) {
    const result = await storage.mutate([
      { type: "clear", store: GOAL_PLANNING_STORE },
      ...[
        ...value.demands,
        ...value.priorities,
        ...value.footprintSpecifications,
        ...value.footprintAssociations,
      ].map((value) => ({
        type: "put" as const,
        store: GOAL_PLANNING_STORE,
        value,
      })),
    ]);
    return result.status === "success";
  }
  function currentDemand(id: PlanningFactId, revision: number) {
    return current(authority.demands, id, revision);
  }
  function currentPriority(id: PlanningFactId, revision: number) {
    return current(authority.priorities, id, revision);
  }
  function mutationBlocked() {
    if (options.canMutate?.() === false) return rejected("authorityTransactionActive");
    return ingress.status === "accepted"
      ? undefined
      : rejected(ingress.status === "protected" ? "protected" : "initializing");
  }
  function notify() {
    options.notificationScheduler?.notify("goalPlanning", () =>
      listeners.forEach((listener) => listener()),
    );
  }

  return {
    initializeGoalPlanning,
    createDemand,
    reviseDemand,
    suspendDemand: (id: PlanningFactId, revision: number) =>
      setDemandLifecycle(id, revision, "suspended"),
    reactivateDemand: (id: PlanningFactId, revision: number) =>
      setDemandLifecycle(id, revision, "active"),
    completeDemand: (id: PlanningFactId, revision: number) =>
      setDemandLifecycle(id, revision, "completed"),
    expireDemand: (id: PlanningFactId, revision: number) =>
      setDemandLifecycle(id, revision, "expired"),
    retireDemand: (id: PlanningFactId, revision: number) =>
      setDemandLifecycle(id, revision, "retired"),
    createPriority,
    revisePriority,
    retirePriority,
    createDemandResourceFootprintSpec,
    reviseDemandResourceFootprintSpec,
    retireDemandResourceFootprintSpec,
    setDemandResourceFootprintAssociation,
    resolveDemandResourceFootprintAssociation: (demandId: PlanningFactId) =>
      resolveDemandFootprintAssociation({
        demandId,
        specifications: authority.footprintSpecifications,
        associations: authority.footprintAssociations,
      }),
    listCurrentGoalDemands: (goalId: GoalId) => currentDemandsForGoal(authority, goalId),
    getApplicableGoalPriority: (goalId: GoalId, date: LocalDateString) =>
      applicablePriorityForGoal(authority, goalId, date),
    getGoalDemandRevision: (id: PlanningFactId, revision: number) =>
      resolveDemandRevision(authority, id, revision),
    getGoalPriorityRevision: (id: PlanningFactId, revision: number) =>
      resolvePriorityRevision(authority, id, revision),
    projectGoalDemand: async (id: PlanningFactId, revision?: number) => {
      const { queryGoalDemandProjection } = await import("./goalDemandProjectionQuery.js");
      return queryGoalDemandProjection({
        authority,
        id,
        ...(revision === undefined ? {} : { revision }),
        getGoal: options.getGoal,
        getStructuralEligibility: options.getStructuralEligibility,
        getUserDayResolver: options.getUserDayResolver,
      });
    },
    exportGoalPlanningAuthority: () => structuredClone(authority),
    replaceGoalPlanningAuthority: async (value: GoalPlanningAuthorityV2) => {
      const checked = validateGoalPlanningAuthority(value, options.listGoals());
      if (checked.status === "invalid") return { status: "invalid" as const };
      if (!(await replaceDurable(checked.authority))) return { status: "failure" as const };
      authority = checked.authority;
      desired = structuredClone(authority);
      ingress = { status: "accepted" };
      durability = "durable";
      notify();
      return { status: "accepted" as const };
    },
    getGoalPlanningIngressStatus: () => structuredClone(ingress),
    getGoalPlanningDurabilityStatus: () => durability,
    retryGoalPlanningPersistence: async () => {
      const persisted = await replaceDurable(desired);
      durability = persisted ? "durable" : "storageFailure";
      notify();
      return persisted ? { status: "durable" as const } : { status: "storageFailure" as const };
    },
    clearGoalPlanning: async () => {
      const empty = emptyGoalPlanningAuthority();
      const persisted = await replaceDurable(empty);
      if (persisted) {
        authority = empty;
        desired = structuredClone(empty);
        ingress = { status: "accepted" };
        durability = "durable";
        notify();
      }
      return persisted ? { status: "removed" as const } : { status: "storageFailure" as const };
    },
    subscribeGoalPlanning: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getRuntimeAuthorityAdapter: (capability: symbol) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return runtime;
    },
  };
}

function current<T extends { id: PlanningFactId; revision: number }>(
  values: T[],
  id: PlanningFactId,
  expected: number,
) {
  const value = values.filter((item) => item.id === id).sort((a, b) => b.revision - a.revision)[0];
  if (!value) return rejected("notFound");
  return value.revision === expected
    ? { value: structuredClone(value) }
    : rejected("staleRevision");
}
function allowedDemandTransition(from: DemandLifecycle, to: DemandLifecycle) {
  if (from === "retired") return false;
  if (to === "retired") return true;
  if (from === "active") return ["suspended", "expired", "completed"].includes(to);
  return from === "suspended" && to === "active";
}
function recordType(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as { recordType?: unknown }).recordType
    : undefined;
}
function allocateFailureReason() {
  return "allocationFailure" as const;
}
function allocationFailure() {
  return rejected(allocateFailureReason());
}
function rejected(
  reason: Exclude<GoalPlanningCommandResult<never>, { status: "accepted" }>["reason"],
) {
  return { status: "rejected" as const, reason };
}
function unchanged<T>(
  value: T,
  durability: GoalPlanningDurabilityStatus,
): GoalPlanningCommandResult<T> {
  return {
    status: "accepted",
    value: structuredClone(value),
    persistence: durability === "durable" ? "durable" : "pending",
    changed: false,
  };
}
function allocateIdSafely(allocate: () => PlanningFactId) {
  try {
    return allocate();
  } catch {
    return undefined;
  }
}

export type GoalPlanningSurface = ReturnType<typeof createGoalPlanningSurface>;
