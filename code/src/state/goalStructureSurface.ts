import type { GoalId, GoalV1 } from "../core/goals/goal.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
import {
  createPlanningFactId,
  planningRevision,
  type PlanningFactId,
} from "../core/planning/planningFoundation.js";
import {
  createDirectAuthoringProvenance,
  currentMilestonesForGoal,
  currentRelationshipsForGoal,
  emptyGoalStructureAuthority,
  queryStructuralEligibility,
  resolveMilestoneRevision,
  resolveRelationshipRevision,
  validateGoalStructureAuthority,
  type GoalStructureAuthorityV1,
  type GoalStructureMilestoneV1,
  type GoalStructureRelationshipV1,
} from "../core/planning/goalStructure.js";
import {
  GOAL_STRUCTURE_STORE,
  createDayFrameDurableDb,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import type { IndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import type { DayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";

export type GoalStructureIngressStatus =
  | { status: "initializing" | "accepted" }
  | { status: "protected"; reason: "readFailure" | "invalidAuthority" };
export type GoalStructureDurabilityStatus = "unknown" | "durable" | "pending" | "storageFailure";
export type GoalStructureRuntimeSnapshot = {
  authority: GoalStructureAuthorityV1;
  desired: GoalStructureAuthorityV1;
  ingress: GoalStructureIngressStatus;
  durability: GoalStructureDurabilityStatus;
};
export type GoalStructureCommandResult<T> =
  | { status: "accepted"; value: T; persistence: "durable" | "pending"; changed: boolean }
  | {
      status: "rejected";
      reason:
        | "initializing"
        | "protected"
        | "notFound"
        | "staleRevision"
        | "missingEndpoint"
        | "invalidInput"
        | "invalidGraph"
        | "allocationFailure"
        | "authorityTransactionActive";
    };

export function createGoalStructureSurface(options: {
  storage?: IndexedDbCollectionStorage;
  getGoal: (id: GoalId) => GoalV1 | undefined;
  listGoals: () => GoalV1[];
  allocateId?: () => PlanningFactId;
  now?: () => string;
  notificationScheduler?: DayFrameNotificationScheduler;
  canMutate?: () => boolean;
}) {
  const storage = options.storage ?? createDayFrameDurableDb();
  const allocateId = options.allocateId ?? createPlanningFactId;
  const now = options.now ?? (() => new Date().toISOString());
  let authority = emptyGoalStructureAuthority();
  let desired = structuredClone(authority);
  let ingress: GoalStructureIngressStatus = { status: "initializing" };
  let durability: GoalStructureDurabilityStatus = "unknown";
  const listeners = new Set<() => void>();
  const runtime: RuntimeAuthorityAdapter<GoalStructureRuntimeSnapshot> = {
    id: "goalStructure",
    captureRuntimeSnapshot: () => structuredClone({ authority, desired, ingress, durability }),
    installRuntimeExact: (target) => {
      authority = structuredClone(target.authority);
      desired = structuredClone(target.desired);
      ingress = structuredClone(target.ingress);
      durability = target.durability;
      notify();
    },
  };
  async function initializeGoalStructure() {
    const result = await storage.getAll<unknown>(GOAL_STRUCTURE_STORE);
    if (result.status === "failure") return protect("readFailure");
    const relationships = result.value.filter(
      (item): item is GoalStructureRelationshipV1 =>
        typeof item === "object" &&
        item !== null &&
        (item as { recordType?: unknown }).recordType === "relationship",
    );
    const milestones = result.value.filter(
      (item): item is GoalStructureMilestoneV1 =>
        typeof item === "object" &&
        item !== null &&
        (item as { recordType?: unknown }).recordType === "milestone",
    );
    if (relationships.length + milestones.length !== result.value.length)
      return protect("invalidAuthority");
    const checked = validateGoalStructureAuthority(
      { version: 1, relationships, milestones },
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
  async function createRelationship(
    input: Omit<
      GoalStructureRelationshipV1,
      | "recordType"
      | "version"
      | "id"
      | "revision"
      | "status"
      | "createdAt"
      | "updatedAt"
      | "effectiveFrom"
      | "effectiveTo"
      | "provenance"
    >,
  ) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    let id: PlanningFactId;
    try {
      id = allocateId();
    } catch {
      return { status: "rejected" as const, reason: "allocationFailure" as const };
    }
    const at = now();
    const candidate: GoalStructureRelationshipV1 = {
      ...structuredClone(input),
      recordType: "relationship",
      version: 1,
      id,
      revision: planningRevision(1),
      status: "active",
      createdAt: at,
      updatedAt: at,
      effectiveFrom: at,
      provenance: createDirectAuthoringProvenance(),
    };
    return accept(
      { ...authority, relationships: [...authority.relationships, candidate] },
      candidate,
      true,
    );
  }
  async function reviseRelationship(
    id: PlanningFactId,
    expectedRevision: number,
    patch: Partial<
      Pick<GoalStructureRelationshipV1, "kind" | "sourceGoalId" | "target" | "semantics">
    >,
  ) {
    const found = currentRelationship(id, expectedRevision);
    if ("status" in found) return found;
    const semantic = {
      kind: patch.kind ?? found.value.kind,
      sourceGoalId: patch.sourceGoalId ?? found.value.sourceGoalId,
      target: patch.target ?? found.value.target,
      semantics: patch.semantics ?? found.value.semantics,
    };
    if (
      semanticFingerprint(semantic) ===
      semanticFingerprint({
        kind: found.value.kind,
        sourceGoalId: found.value.sourceGoalId,
        target: found.value.target,
        semantics: found.value.semantics,
      })
    )
      return {
        status: "accepted" as const,
        value: found.value,
        persistence: durability === "durable" ? ("durable" as const) : ("pending" as const),
        changed: false,
      };
    const candidate: GoalStructureRelationshipV1 = {
      ...found.value,
      ...structuredClone(semantic),
      revision: planningRevision(found.value.revision + 1),
      updatedAt: now(),
    } as GoalStructureRelationshipV1;
    return accept(
      { ...authority, relationships: [...authority.relationships, candidate] },
      candidate,
      true,
    );
  }
  async function retireRelationship(id: PlanningFactId, expectedRevision: number) {
    const found = currentRelationship(id, expectedRevision);
    if ("status" in found) return found;
    if (found.value.status === "retired")
      return {
        status: "accepted" as const,
        value: found.value,
        persistence: durability === "durable" ? ("durable" as const) : ("pending" as const),
        changed: false,
      };
    const at = now();
    const candidate: GoalStructureRelationshipV1 = {
      ...found.value,
      revision: planningRevision(found.value.revision + 1),
      status: "retired",
      updatedAt: at,
      effectiveTo: at,
    };
    return accept(
      { ...authority, relationships: [...authority.relationships, candidate] },
      candidate,
      true,
    );
  }
  async function createMilestone(input: {
    ownerGoalId: GoalId;
    title: string;
    targetDate?: string;
  }) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    let id: PlanningFactId;
    try {
      id = allocateId();
    } catch {
      return { status: "rejected" as const, reason: "allocationFailure" as const };
    }
    const at = now();
    const candidate: GoalStructureMilestoneV1 = {
      recordType: "milestone",
      version: 1,
      id,
      revision: planningRevision(1),
      ownerGoalId: input.ownerGoalId,
      title: input.title.trim(),
      state: "active",
      satisfactionPolicy: { kind: "manual" },
      ...(input.targetDate ? { targetDate: input.targetDate } : {}),
      createdAt: at,
      updatedAt: at,
      provenance: createDirectAuthoringProvenance(),
    };
    return accept(
      { ...authority, milestones: [...authority.milestones, candidate] },
      candidate,
      true,
    );
  }
  async function reviseMilestone(
    id: PlanningFactId,
    expectedRevision: number,
    patch: {
      title?: string;
      targetDate?: string | null;
      state?: "active" | "satisfied" | "retired";
    },
  ) {
    const found = currentMilestone(id, expectedRevision);
    if ("status" in found) return found;
    const state = patch.state ?? found.value.state;
    const at = now();
    const semantic = {
      ownerGoalId: found.value.ownerGoalId,
      title: (patch.title ?? found.value.title).trim(),
      targetDate:
        patch.targetDate === null ? undefined : (patch.targetDate ?? found.value.targetDate),
      state,
      satisfactionPolicy: found.value.satisfactionPolicy,
    };
    if (
      semanticFingerprint(semantic) ===
      semanticFingerprint({
        ownerGoalId: found.value.ownerGoalId,
        title: found.value.title,
        targetDate: found.value.targetDate,
        state: found.value.state,
        satisfactionPolicy: found.value.satisfactionPolicy,
      })
    )
      return {
        status: "accepted" as const,
        value: found.value,
        persistence: durability === "durable" ? ("durable" as const) : ("pending" as const),
        changed: false,
      };
    const candidate: GoalStructureMilestoneV1 = {
      ...found.value,
      title: semantic.title,
      state,
      revision: planningRevision(found.value.revision + 1),
      updatedAt: at,
      ...(semantic.targetDate ? { targetDate: semantic.targetDate } : {}),
    };
    delete candidate.targetDate;
    if (semantic.targetDate) candidate.targetDate = semantic.targetDate;
    delete candidate.satisfiedAt;
    delete candidate.retiredAt;
    if (state === "satisfied") candidate.satisfiedAt = at;
    if (state === "retired") candidate.retiredAt = at;
    return accept(
      { ...authority, milestones: [...authority.milestones, candidate] },
      candidate,
      true,
    );
  }
  async function accept<T>(
    next: GoalStructureAuthorityV1,
    value: T,
    changed: boolean,
  ): Promise<GoalStructureCommandResult<T>> {
    const checked = validateGoalStructureAuthority(next, options.listGoals());
    if (checked.status === "invalid")
      return {
        status: "rejected",
        reason: checked.issues.some((issue) => issue.code === "missingEndpoint")
          ? "missingEndpoint"
          : "invalidGraph",
      };
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
      changed,
    };
  }
  async function replaceDurable(value: GoalStructureAuthorityV1) {
    const records = [...value.relationships, ...value.milestones];
    const result = await storage.mutate([
      { type: "clear", store: GOAL_STRUCTURE_STORE },
      ...records.map((record) => ({
        type: "put" as const,
        store: GOAL_STRUCTURE_STORE,
        value: record,
      })),
    ]);
    return result.status === "success";
  }
  function currentRelationship(id: PlanningFactId, expectedRevision: number) {
    const values = authority.relationships
      .filter((item) => item.id === id)
      .sort((a, b) => b.revision - a.revision);
    const value = values[0];
    if (!value) return { status: "rejected" as const, reason: "notFound" as const };
    return value.revision === expectedRevision
      ? { value: structuredClone(value) }
      : { status: "rejected" as const, reason: "staleRevision" as const };
  }
  function currentMilestone(id: PlanningFactId, expectedRevision: number) {
    const values = authority.milestones
      .filter((item) => item.id === id)
      .sort((a, b) => b.revision - a.revision);
    const value = values[0];
    if (!value) return { status: "rejected" as const, reason: "notFound" as const };
    return value.revision === expectedRevision
      ? { value: structuredClone(value) }
      : { status: "rejected" as const, reason: "staleRevision" as const };
  }
  function mutationBlocked() {
    if (options.canMutate?.() === false)
      return { status: "rejected" as const, reason: "authorityTransactionActive" as const };
    return ingress.status === "accepted"
      ? undefined
      : {
          status: "rejected" as const,
          reason:
            ingress.status === "protected" ? ("protected" as const) : ("initializing" as const),
        };
  }
  function notify() {
    options.notificationScheduler?.notify("goalStructure", () =>
      listeners.forEach((listener) => listener()),
    );
  }
  return {
    initializeGoalStructure,
    createRelationship,
    reviseRelationship,
    retireRelationship,
    createMilestone,
    reviseMilestone,
    listGoalStructureRelationships: (goalId: GoalId) =>
      currentRelationshipsForGoal(authority, goalId),
    listGoalStructureMilestones: (goalId: GoalId) => currentMilestonesForGoal(authority, goalId),
    getStructuralEligibility: (goalId: GoalId) =>
      queryStructuralEligibility({ goalId, goals: options.listGoals(), authority }),
    getGoalStructureRelationshipRevision: (id: PlanningFactId, revision: number) =>
      resolveRelationshipRevision(authority, id, planningRevision(revision)),
    getGoalStructureMilestoneRevision: (id: PlanningFactId, revision: number) =>
      resolveMilestoneRevision(authority, id, planningRevision(revision)),
    exportGoalStructureAuthority: () => structuredClone(authority),
    getGoalStructureIngressStatus: () => structuredClone(ingress),
    getGoalStructureDurabilityStatus: () => durability,
    replaceGoalStructureAuthority: async (value: GoalStructureAuthorityV1) => {
      const checked = validateGoalStructureAuthority(value, options.listGoals());
      if (checked.status === "invalid") return { status: "invalid" as const };
      const persisted = await replaceDurable(checked.authority);
      if (!persisted) return { status: "failure" as const };
      authority = checked.authority;
      desired = structuredClone(authority);
      ingress = { status: "accepted" };
      durability = "durable";
      notify();
      return { status: "accepted" as const };
    },
    retryGoalStructurePersistence: async () => {
      const persisted = await replaceDurable(desired);
      durability = persisted ? "durable" : "storageFailure";
      notify();
      return persisted ? { status: "durable" as const } : { status: "storageFailure" as const };
    },
    clearGoalStructure: async () => {
      const empty = emptyGoalStructureAuthority();
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
    subscribeGoalStructure: (listener: () => void) => {
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

export type GoalStructureSurface = ReturnType<typeof createGoalStructureSurface>;
