import {
  canonicalGoal,
  createGoalId,
  goalFingerprint,
  linkKey,
  validateGoal,
  validateGoalAuthority,
  type GoalAuthorityV1,
  type GoalCommitmentLinkV1,
  type GoalId,
  type GoalMeasurementPolicyReferenceV1,
  type GoalStatus,
  type GoalV1,
} from "../core/goals/goal.js";
import { GOAL_AUTHORITY_STORE } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import type { IndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import type { DayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";
import type { LocalDateString } from "../core/shifts/types.js";

export type GoalIngressStatus =
  | { status: "initializing" | "accepted" }
  | { status: "protected"; reason: "readFailure" | "invalidAuthority" };
export type GoalDurabilityStatus = "unknown" | "durable" | "pending" | "storageFailure";
export type GoalRuntimeSnapshot = {
  authority: GoalAuthorityV1;
  ingress: GoalIngressStatus;
  durability: GoalDurabilityStatus;
  desired: GoalAuthorityV1;
};
export type GoalCommandResult =
  | { status: "accepted"; goal: GoalV1; persistence: "durable" | "pending" }
  | {
      status: "rejected";
      reason:
        | "initializing"
        | "protected"
        | "notFound"
        | "staleRevision"
        | "invalidInput"
        | "duplicateLink"
        | "linkNotFound"
        | "allocationFailure"
        | "authorityTransactionActive";
    };

export function createGoalSurface(
  options: {
    storage?: IndexedDbCollectionStorage;
    allocateGoalId?: () => GoalId;
    now?: () => string;
    notificationScheduler?: DayFrameNotificationScheduler;
    canMutate?: () => boolean;
    isLinkAvailable?: (link: GoalCommitmentLinkV1) => boolean;
  } = {},
) {
  const storage = options.storage ?? createDayFrameDurableDb();
  const allocate = options.allocateGoalId ?? createGoalId;
  const now = options.now ?? (() => new Date().toISOString());
  let authority: GoalAuthorityV1 = { version: 1, goals: [] };
  let desired = structuredClone(authority);
  let ingress: GoalIngressStatus = { status: "initializing" };
  let durability: GoalDurabilityStatus = "unknown";
  const listeners = new Set<(goals: GoalV1[]) => void>();
  const runtime: RuntimeAuthorityAdapter<GoalRuntimeSnapshot> = {
    id: "goals",
    captureRuntimeSnapshot: () => structuredClone({ authority, desired, ingress, durability }),
    installRuntimeExact: (target) => {
      authority = structuredClone(target.authority);
      desired = structuredClone(target.desired);
      ingress = structuredClone(target.ingress);
      durability = target.durability;
      scheduleNotify();
    },
  };
  async function initialize() {
    const result = await storage.getAll<unknown>(GOAL_AUTHORITY_STORE);
    if (result.status === "failure") {
      ingress = { status: "protected", reason: "readFailure" };
      durability = "storageFailure";
      return { status: "protected" as const };
    }
    const checked = validateGoalAuthority({ version: 1, goals: result.value });
    if (checked.status === "invalid") {
      ingress = { status: "protected", reason: "invalidAuthority" };
      durability = "storageFailure";
      return { status: "protected" as const };
    }
    authority = checked.authority;
    desired = structuredClone(authority);
    ingress = { status: "accepted" };
    durability = "durable";
    scheduleNotify();
    return { status: "ready" as const };
  }
  const listGoals = () => structuredClone(authority.goals);
  const getGoal = (id: GoalId) => structuredClone(authority.goals.find((g) => g.id === id));
  const getGoalsForCommitment = (link: GoalCommitmentLinkV1) =>
    listGoals().filter((g) => g.links.some((x) => linkKey(x) === linkKey(link)));
  const getGoalLinkAvailability = (id: GoalId) =>
    getGoal(id)?.links.map((link) => ({
      link,
      status:
        options.isLinkAvailable?.(link) === true
          ? ("available" as const)
          : ("unavailable" as const),
    })) ?? [];
  async function createGoal(input: {
    title: string;
    description?: string;
    targetDate?: LocalDateString;
    measurementPolicy?: GoalMeasurementPolicyReferenceV1;
    links?: GoalCommitmentLinkV1[];
  }): Promise<GoalCommandResult> {
    if (options.canMutate?.() === false)
      return { status: "rejected", reason: "authorityTransactionActive" };
    if (ingress.status !== "accepted") return blocked();
    let id: GoalId;
    try {
      id = allocate();
    } catch {
      return { status: "rejected", reason: "allocationFailure" };
    }
    const at = now();
    const candidate = {
      version: 1 as const,
      id,
      revision: 1,
      title: input.title,
      status: "active" as const,
      createdAt: at,
      updatedAt: at,
      links: input.links ?? [],
      ...(input.description === undefined ? {} : { description: input.description }),
      ...(input.targetDate === undefined ? {} : { targetDate: input.targetDate }),
      ...(input.measurementPolicy === undefined
        ? {}
        : { measurementPolicy: input.measurementPolicy }),
    };
    return acceptCandidate(candidate);
  }
  async function updateGoal(
    id: GoalId,
    expectedRevision: number,
    patch: {
      title?: string;
      description?: string | null;
      targetDate?: LocalDateString | null;
      measurementPolicy?: GoalMeasurementPolicyReferenceV1 | null;
    },
  ): Promise<GoalCommandResult> {
    const found = current(id, expectedRevision);
    if ("status" in found) return found;
    const candidate: GoalV1 = {
      ...found.goal,
      revision: found.goal.revision + 1,
      updatedAt: now(),
      ...(patch.title === undefined ? {} : { title: patch.title }),
    };
    assignOptional(candidate, "description", patch.description);
    assignOptional(candidate, "targetDate", patch.targetDate);
    assignOptional(candidate, "measurementPolicy", patch.measurementPolicy);
    return acceptCandidate(candidate);
  }
  async function setGoalStatus(
    id: GoalId,
    expectedRevision: number,
    status: GoalStatus,
  ): Promise<GoalCommandResult> {
    const found = current(id, expectedRevision);
    if ("status" in found) return found;
    const at = now();
    const candidate: GoalV1 = {
      ...found.goal,
      status,
      revision: found.goal.revision + 1,
      updatedAt: at,
    };
    delete candidate.completedAt;
    delete candidate.archivedAt;
    if (status === "completed") candidate.completedAt = at;
    if (status === "archived") candidate.archivedAt = at;
    return acceptCandidate(candidate);
  }
  async function linkCommitment(
    id: GoalId,
    expectedRevision: number,
    link: GoalCommitmentLinkV1,
  ): Promise<GoalCommandResult> {
    const found = current(id, expectedRevision);
    if ("status" in found) return found;
    if (found.goal.links.some((x) => linkKey(x) === linkKey(link)))
      return { status: "rejected", reason: "duplicateLink" };
    return acceptCandidate({
      ...found.goal,
      revision: found.goal.revision + 1,
      updatedAt: now(),
      links: [...found.goal.links, link],
    });
  }
  async function unlinkCommitment(
    id: GoalId,
    expectedRevision: number,
    link: GoalCommitmentLinkV1,
  ): Promise<GoalCommandResult> {
    const found = current(id, expectedRevision);
    if ("status" in found) return found;
    if (!found.goal.links.some((x) => linkKey(x) === linkKey(link)))
      return { status: "rejected", reason: "linkNotFound" };
    return acceptCandidate({
      ...found.goal,
      revision: found.goal.revision + 1,
      updatedAt: now(),
      links: found.goal.links.filter((x) => linkKey(x) !== linkKey(link)),
    });
  }
  async function acceptCandidate(raw: unknown): Promise<GoalCommandResult> {
    const checked = validateGoal(raw);
    if (checked.status === "invalid") return { status: "rejected", reason: "invalidInput" };
    authority = {
      version: 1,
      goals: [
        ...authority.goals.filter((g) => g.id !== checked.goal.id),
        canonicalGoal(checked.goal),
      ].sort((a, b) => a.id.localeCompare(b.id)),
    };
    desired = structuredClone(authority);
    durability = "pending";
    scheduleNotify();
    const persisted = await replaceDurable(authority);
    durability = persisted ? "durable" : "storageFailure";
    scheduleNotify();
    return {
      status: "accepted",
      goal: structuredClone(checked.goal),
      persistence: persisted ? "durable" : "pending",
    };
  }
  async function replaceDurable(value: GoalAuthorityV1) {
    const result = await storage.mutate([
      { type: "clear", store: GOAL_AUTHORITY_STORE },
      ...value.goals.map((goal) => ({
        type: "put" as const,
        store: GOAL_AUTHORITY_STORE,
        value: goal,
      })),
    ]);
    return result.status === "success";
  }
  async function retryGoalPersistence() {
    if (ingress.status !== "accepted") return blocked();
    const persisted = await replaceDurable(desired);
    durability = persisted ? "durable" : "storageFailure";
    scheduleNotify();
    return persisted ? { status: "durable" as const } : { status: "storageFailure" as const };
  }
  async function clearGoals() {
    const unresolvedEmpty = ingress.status === "initializing" && authority.goals.length === 0;
    authority = { version: 1, goals: [] };
    desired = structuredClone(authority);
    const result = await storage.clear(GOAL_AUTHORITY_STORE);
    durability = result.status === "success" ? "durable" : "storageFailure";
    scheduleNotify();
    return result.status === "success" || unresolvedEmpty
      ? { status: "removed" as const }
      : { status: "storageFailure" as const };
  }
  function current(
    id: GoalId,
    revision: number,
  ): { goal: GoalV1 } | Extract<GoalCommandResult, { status: "rejected" }> {
    if (options.canMutate?.() === false)
      return { status: "rejected", reason: "authorityTransactionActive" };
    if (ingress.status !== "accepted") return blocked();
    const goal = authority.goals.find((g) => g.id === id);
    if (!goal) return { status: "rejected", reason: "notFound" };
    if (goal.revision !== revision) return { status: "rejected", reason: "staleRevision" };
    return { goal };
  }
  function blocked(): Extract<GoalCommandResult, { status: "rejected" }> {
    return {
      status: "rejected",
      reason: ingress.status === "initializing" ? "initializing" : "protected",
    };
  }
  function scheduleNotify() {
    options.notificationScheduler?.notify("goals", () => {
      for (const listener of listeners) listener(listGoals());
    });
  }
  return {
    initializeGoals: initialize,
    listGoals,
    getGoal,
    getGoalsForCommitment,
    getGoalLinkAvailability,
    createGoal,
    updateGoal,
    completeGoal: (id: GoalId, r: number) => setGoalStatus(id, r, "completed"),
    archiveGoal: (id: GoalId, r: number) => setGoalStatus(id, r, "archived"),
    reactivateGoal: (id: GoalId, r: number) => setGoalStatus(id, r, "active"),
    linkCommitment,
    unlinkCommitment,
    retryGoalPersistence,
    clearGoals,
    getGoalIngressStatus: () => structuredClone(ingress),
    getGoalDurabilityStatus: () => durability,
    exportAuthority: () => structuredClone(authority),
    replaceDurable,
    getRuntimeAuthorityAdapter: (cap: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (cap !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) throw new Error("Invalid capability");
      return runtime;
    },
    subscribeGoals: (listener: (goals: GoalV1[]) => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    goalSemanticFingerprint: () => goalFingerprint(authority),
  };
}
function assignOptional<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K] | null | undefined,
) {
  if (value === undefined) return;
  if (value === null) delete target[key];
  else target[key] = value;
}
export type GoalSurface = ReturnType<typeof createGoalSurface>;
