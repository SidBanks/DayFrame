import {
  PLAN_DECISION_VERSION,
  clonePlanDecision,
  createPlanDecisionId,
  getPlanDecisionTargetKey,
  isPlanDecisionId,
  validatePlanDecision,
  type AcceptPlanDecisionInput,
  type PlanDecisionId,
  type PlanDecisionIdAllocator,
  type PlanDecisionV1,
} from "../core/decisions/planDecision.js";
import { resolveDurableOccurrenceReference } from "../core/occurrences/durableOccurrenceReference.js";
import type {
  DayFrameAuthoredSetup,
  PersistenceRemovalOutcome,
  PersistenceWriteOutcome,
  SurfaceDurabilityStatus,
} from "./types.js";
import type { DayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";

export const DAYFRAME_PLAN_DECISIONS_STORAGE_KEY = "dayframe-plan-decisions-v1";
export const PLAN_DECISION_SURFACE_VERSION = 1 as const;

export type PlanDecisionEnvelopeV1 = {
  app: "DayFrame";
  surface: "planDecisions";
  version: typeof PLAN_DECISION_SURFACE_VERSION;
  decisions: unknown[];
};

export type QuarantinedPlanDecision = {
  quarantineId: string;
  reason:
    | "invalidDecision"
    | "unsupportedDecisionVersion"
    | "unsupportedTargetVersion"
    | "duplicateDecisionId"
    | "conflictingTarget";
  raw: unknown;
};

export type PlanDecisionIngressStatus =
  | { status: "noSource"; reason: "missing" | "storageUnavailable" | "resolvedByAbandonment" }
  | { status: "accepted"; quarantinedEntryCount: number }
  | {
      status: "recoveryRequired";
      reason: "readFailure" | "corruptJson" | "invalidEnvelope" | "unsupportedVersion";
      sourcePreserved: boolean;
    };

export type AcceptPlanDecisionResult =
  | {
      status: "accepted";
      decision: PlanDecisionV1;
      decisions: PlanDecisionV1[];
      persistence: PersistenceWriteOutcome;
    }
  | {
      status: "rejected";
      reason:
        | "protectedDecisionIngress"
        | "invalidTarget"
        | "unsupportedTargetVersion"
        | "targetSourceMissing"
        | "targetLifetimeMismatch"
        | "targetOccurrenceMissing"
        | "invalidPayload"
        | "unsupportedDecisionKind"
        | "allocationFailure";
    };

export type RemovePlanDecisionResult =
  | {
      status: "removed";
      decisionId: PlanDecisionId;
      decisions: PlanDecisionV1[];
      persistence: PersistenceWriteOutcome;
    }
  | { status: "notAttempted"; reason: "notFound" | "protectedDecisionIngress" };

export type PlanDecisionRetryResult =
  | { status: "attempted"; persistence: PersistenceWriteOutcome }
  | {
      status: "notAttempted";
      reason: "unknown" | "alreadyDurable" | "serializationFailure" | "recoveryProtected";
    };

export type PlanDecisionRecoveryResult =
  | { status: "resolved"; action: "replace" | "abandon"; persistence: { status: "persisted" } }
  | {
      status: "notResolved";
      action: "replace" | "abandon";
      persistence: Exclude<PersistenceWriteOutcome, { status: "persisted" }>;
    }
  | { status: "notAttempted"; reason: "noProtectedSource" | "sourceUnreadable" | "sourceChanged" };

export type PlanDecisionSurface = ReturnType<typeof createPlanDecisionSurface>;
export type PlanDecisionRuntimeSnapshot = {
  decisions: PlanDecisionV1[];
  quarantined: QuarantinedPlanDecision[];
  ingress: PlanDecisionIngressStatus;
  protectedRaw?: string;
  durability: SurfaceDurabilityStatus;
  desired: unknown[];
};

export function createPlanDecisionSurface(options: {
  getAuthoredSetup: () => DayFrameAuthoredSetup;
  allocatePlanDecisionId?: PlanDecisionIdAllocator;
  now?: () => string;
  serialize?: (value: unknown) => string;
  onAuthorityChanged?: () => void;
  notificationScheduler?: DayFrameNotificationScheduler;
}) {
  const loaded = load(getStorage());
  let decisions = loaded.decisions;
  let quarantined = loaded.quarantined;
  let ingress = loaded.ingress;
  let protectedRaw = loaded.protectedRaw;
  let durability: SurfaceDurabilityStatus = loaded.durability;
  let desired = cloneEntries(decisions, quarantined);
  const decisionListeners = new Set<(value: PlanDecisionV1[]) => void>();
  const durabilityListeners = new Set<(value: SurfaceDurabilityStatus) => void>();
  const ingressListeners = new Set<(value: PlanDecisionIngressStatus) => void>();
  const allocate = options.allocatePlanDecisionId ?? createPlanDecisionId;
  const now = options.now ?? (() => new Date().toISOString());
  const serialize = options.serialize ?? JSON.stringify;

  const runtimeAdapter: RuntimeAuthorityAdapter<PlanDecisionRuntimeSnapshot> = {
    id: "planDecisions",
    captureRuntimeSnapshot: () =>
      structuredClone({
        decisions,
        quarantined,
        ingress,
        ...(protectedRaw === undefined ? {} : { protectedRaw }),
        durability,
        desired,
      }),
    installRuntimeExact: (target) => {
      decisions = target.decisions.map(clonePlanDecision);
      quarantined = target.quarantined.map(cloneQuarantine);
      ingress = { ...target.ingress };
      protectedRaw = target.protectedRaw;
      durability = target.durability;
      desired = structuredClone(target.desired);
      options.notificationScheduler?.notify("planDecisions", () => {
        notifyDecisions();
        for (const listener of durabilityListeners) listener(durability);
        for (const listener of ingressListeners) listener(getPlanDecisionIngressStatus());
      });
    },
  };

  const getPlanDecisions = () => decisions.map(clonePlanDecision);
  const getQuarantinedPlanDecisions = () => quarantined.map(cloneQuarantine);
  const getPlanDecisionDurabilityStatus = () => durability;
  const getPlanDecisionIngressStatus = () => ({ ...ingress });

  function notifyDecisions(): void {
    for (const listener of decisionListeners) listener(getPlanDecisions());
  }
  function setDurability(value: SurfaceDurabilityStatus): void {
    if (durability === value) return;
    durability = value;
    for (const listener of durabilityListeners) listener(value);
  }
  function setIngress(value: PlanDecisionIngressStatus): void {
    ingress = value;
    for (const listener of ingressListeners) listener(getPlanDecisionIngressStatus());
  }
  function persist(): PersistenceWriteOutcome {
    const storage = getStorage();
    if (!storage) {
      setDurability("unavailable");
      return { status: "unavailable" };
    }
    let raw: string;
    try {
      raw = serialize(envelope(desired));
    } catch {
      setDurability("serializationFailure");
      return { status: "serializationFailure" };
    }
    try {
      storage.setItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY, raw);
      const reread = storage.getItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY);
      if (reread !== raw || !verifiedEnvelope(reread, desired)) throw new Error("verification");
      setDurability("durable");
      setIngress({ status: "accepted", quarantinedEntryCount: quarantined.length });
      return { status: "persisted" };
    } catch {
      setDurability("storageFailure");
      return { status: "storageFailure" };
    }
  }

  function acceptPlanDecision(input: AcceptPlanDecisionInput): AcceptPlanDecisionResult {
    if (ingress.status === "recoveryRequired")
      return { status: "rejected", reason: "protectedDecisionIngress" };
    let id: PlanDecisionId;
    try {
      id = allocate();
      if (!isPlanDecisionId(id) || decisions.some((decision) => decision.id === id))
        throw new Error("id");
    } catch {
      return { status: "rejected", reason: "allocationFailure" };
    }
    const candidate = {
      ...input,
      version: PLAN_DECISION_VERSION,
      id,
      acceptedAt: now(),
    } as PlanDecisionV1;
    const validation = validatePlanDecision(candidate);
    if (validation.status === "unsupportedTargetVersion")
      return { status: "rejected", reason: "unsupportedTargetVersion" };
    if (validation.status !== "valid") {
      const kind = (input as { kind?: unknown }).kind;
      return {
        status: "rejected",
        reason: ![
          "placeOccurrence",
          "omitOccurrence",
          "setOccurrenceDuration",
          "setOccurrencePriority",
        ].includes(String(kind))
          ? "unsupportedDecisionKind"
          : "invalidPayload",
      };
    }
    const resolution = resolveDurableOccurrenceReference(
      validation.decision.target,
      options.getAuthoredSetup(),
    );
    if (resolution.status !== "resolved") {
      const reasons = {
        sourceMissing: "targetSourceMissing",
        lifetimeMismatch: "targetLifetimeMismatch",
        occurrenceMissing: "targetOccurrenceMissing",
        invalidReference: "invalidTarget",
        unsupportedVersion: "unsupportedTargetVersion",
      } as const;
      return { status: "rejected", reason: reasons[resolution.status] };
    }
    const key = getPlanDecisionTargetKey(validation.decision.target);
    decisions = [
      ...decisions.filter((decision) => getPlanDecisionTargetKey(decision.target) !== key),
      validation.decision,
    ].sort(compareDecisions);
    desired = cloneEntries(decisions, quarantined);
    const persistence = persist();
    options.onAuthorityChanged?.();
    notifyDecisions();
    return {
      status: "accepted",
      decision: clonePlanDecision(validation.decision),
      decisions: getPlanDecisions(),
      persistence,
    };
  }

  function removePlanDecision(id: PlanDecisionId): RemovePlanDecisionResult {
    if (ingress.status === "recoveryRequired")
      return { status: "notAttempted", reason: "protectedDecisionIngress" };
    if (!decisions.some((decision) => decision.id === id))
      return { status: "notAttempted", reason: "notFound" };
    decisions = decisions.filter((decision) => decision.id !== id);
    desired = cloneEntries(decisions, quarantined);
    const persistence = persist();
    options.onAuthorityChanged?.();
    notifyDecisions();
    return { status: "removed", decisionId: id, decisions: getPlanDecisions(), persistence };
  }

  function retryPlanDecisionPersistence(): PlanDecisionRetryResult {
    if (ingress.status === "recoveryRequired")
      return { status: "notAttempted", reason: "recoveryProtected" };
    if (durability === "unknown") return { status: "notAttempted", reason: "unknown" };
    if (durability === "durable") return { status: "notAttempted", reason: "alreadyDurable" };
    if (durability === "serializationFailure")
      return { status: "notAttempted", reason: "serializationFailure" };
    return { status: "attempted", persistence: persist() };
  }

  function removeQuarantinedPlanDecision(quarantineId: string) {
    if (ingress.status === "recoveryRequired")
      return { status: "notAttempted", reason: "protectedDecisionIngress" } as const;
    if (!quarantined.some((entry) => entry.quarantineId === quarantineId))
      return { status: "notAttempted", reason: "notFound" } as const;
    quarantined = quarantined.filter((entry) => entry.quarantineId !== quarantineId);
    desired = cloneEntries(decisions, quarantined);
    const persistence = persist();
    return { status: "removed", quarantineId, persistence } as const;
  }

  function exportQuarantinedPlanDecision(quarantineId: string) {
    const entry = quarantined.find((candidate) => candidate.quarantineId === quarantineId);
    return entry
      ? ({ status: "exported", entry: cloneQuarantine(entry) } as const)
      : ({ status: "notAvailable", reason: "notFound" } as const);
  }
  function exportProtectedPlanDecisionSource() {
    return ingress.status === "recoveryRequired" && protectedRaw !== undefined
      ? ({ status: "exported", raw: protectedRaw } as const)
      : ({
          status: "notAvailable",
          reason: ingress.status === "recoveryRequired" ? "sourceUnreadable" : "noProtectedSource",
        } as const);
  }
  function recheck() {
    if (ingress.status !== "recoveryRequired") return "noProtectedSource" as const;
    const storage = getStorage();
    if (!storage) return "sourceUnreadable" as const;
    try {
      return storage.getItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY) === protectedRaw
        ? ("unchanged" as const)
        : ("sourceChanged" as const);
    } catch {
      return "sourceUnreadable" as const;
    }
  }
  function recover(action: "replace" | "abandon"): PlanDecisionRecoveryResult {
    const checked = recheck();
    if (checked !== "unchanged") return { status: "notAttempted", reason: checked };
    const priorDesired = desired;
    if (action === "abandon") desired = [];
    const persistence = persist();
    if (persistence.status !== "persisted") {
      desired = priorDesired;
      return { status: "notResolved", action, persistence };
    }
    if (action === "abandon") {
      const changed = decisions.length > 0;
      decisions = [];
      quarantined = [];
      desired = [];
      if (changed) options.onAuthorityChanged?.();
      notifyDecisions();
    }
    protectedRaw = undefined;
    setIngress({ status: "accepted", quarantinedEntryCount: quarantined.length });
    return { status: "resolved", action, persistence };
  }
  function clear(): PersistenceRemovalOutcome {
    desired = [];
    const storage = getStorage();
    if (!storage) {
      setDurability("unavailable");
      return { status: "unavailable" };
    }
    try {
      storage.removeItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY);
      decisions = [];
      quarantined = [];
      protectedRaw = undefined;
      setDurability("durable");
      setIngress({ status: "noSource", reason: "missing" });
      options.onAuthorityChanged?.();
      notifyDecisions();
      return { status: "removed" };
    } catch {
      setDurability("storageFailure");
      return { status: "storageFailure" };
    }
  }

  return {
    getPlanDecisions,
    getQuarantinedPlanDecisions,
    getPlanDecisionDurabilityStatus,
    getPlanDecisionIngressStatus,
    acceptPlanDecision,
    removePlanDecision,
    retryPlanDecisionPersistence,
    removeQuarantinedPlanDecision,
    exportQuarantinedPlanDecision,
    exportProtectedPlanDecisionSource,
    recheckProtectedPlanDecisionSource: recheck,
    replaceProtectedPlanDecisionCheckpoint: () => recover("replace"),
    abandonProtectedPlanDecisionCheckpoint: () => recover("abandon"),
    clearPlanDecisions: clear,
    subscribePlanDecisions(listener: (value: PlanDecisionV1[]) => void) {
      decisionListeners.add(listener);
      return () => decisionListeners.delete(listener);
    },
    subscribePlanDecisionDurability(listener: (value: SurfaceDurabilityStatus) => void) {
      durabilityListeners.add(listener);
      return () => durabilityListeners.delete(listener);
    },
    subscribePlanDecisionIngress(listener: (value: PlanDecisionIngressStatus) => void) {
      ingressListeners.add(listener);
      return () => ingressListeners.delete(listener);
    },
    getRuntimeAuthorityAdapter(capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid runtime authority capability.");
      return runtimeAdapter;
    },
  };
}

export function buildPlanDecisionRuntimeTarget(
  value: unknown,
):
  | { status: "valid"; target: PlanDecisionRuntimeSnapshot; envelope: PlanDecisionEnvelopeV1 }
  | { status: "invalid"; reason: string } {
  if (
    !record(value) ||
    !exact(value, ["app", "surface", "version", "decisions"]) ||
    value.app !== "DayFrame" ||
    value.surface !== "planDecisions" ||
    value.version !== PLAN_DECISION_SURFACE_VERSION ||
    !Array.isArray(value.decisions)
  )
    return { status: "invalid", reason: "invalidEnvelope" };
  const decisions: PlanDecisionV1[] = [];
  const quarantined: QuarantinedPlanDecision[] = [];
  const ids = new Set<string>();
  const targets = new Set<string>();
  value.decisions.forEach((entry, index) => {
    const validation = validatePlanDecision(entry);
    let reason: QuarantinedPlanDecision["reason"] | undefined;
    if (validation.status === "unsupportedVersion") reason = "unsupportedDecisionVersion";
    else if (validation.status === "unsupportedTargetVersion") reason = "unsupportedTargetVersion";
    else if (validation.status === "invalid") reason = "invalidDecision";
    else {
      const target = getPlanDecisionTargetKey(validation.decision.target);
      if (ids.has(validation.decision.id)) reason = "duplicateDecisionId";
      else if (targets.has(target)) reason = "conflictingTarget";
      else {
        decisions.push(validation.decision);
        ids.add(validation.decision.id);
        targets.add(target);
      }
    }
    if (reason)
      quarantined.push({
        quarantineId: `plan-decision-quarantine-${index}`,
        reason,
        raw: cloneRaw(entry),
      });
  });
  const ordered = decisions.sort(compareDecisions);
  const desired = cloneEntries(ordered, quarantined);
  return {
    status: "valid",
    envelope: envelope(desired),
    target: {
      decisions: ordered.map(clonePlanDecision),
      quarantined: quarantined.map(cloneQuarantine),
      desired: structuredClone(desired),
      durability: "durable",
      ingress: { status: "accepted", quarantinedEntryCount: quarantined.length },
    },
  };
}

function load(storage: Storage | undefined) {
  if (!storage)
    return {
      decisions: [] as PlanDecisionV1[],
      quarantined: [] as QuarantinedPlanDecision[],
      ingress: { status: "noSource", reason: "storageUnavailable" } as PlanDecisionIngressStatus,
      durability: "unavailable" as SurfaceDurabilityStatus,
      protectedRaw: undefined as string | undefined,
    };
  let raw: string | null;
  try {
    raw = storage.getItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY);
  } catch {
    return {
      decisions: [],
      quarantined: [],
      ingress: {
        status: "recoveryRequired",
        reason: "readFailure",
        sourcePreserved: false,
      } as PlanDecisionIngressStatus,
      durability: "storageFailure" as SurfaceDurabilityStatus,
      protectedRaw: undefined,
    };
  }
  if (raw === null)
    return {
      decisions: [],
      quarantined: [],
      ingress: { status: "noSource", reason: "missing" } as PlanDecisionIngressStatus,
      durability: "unknown" as SurfaceDurabilityStatus,
      protectedRaw: undefined,
    };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return protectedLoad("corruptJson", raw);
  }
  if (
    !record(parsed) ||
    parsed.app !== "DayFrame" ||
    parsed.surface !== "planDecisions" ||
    !Array.isArray(parsed.decisions)
  )
    return protectedLoad("invalidEnvelope", raw);
  if (parsed.version !== PLAN_DECISION_SURFACE_VERSION)
    return protectedLoad("unsupportedVersion", raw);
  const decisions: PlanDecisionV1[] = [];
  const quarantined: QuarantinedPlanDecision[] = [];
  const ids = new Set<string>();
  const targets = new Set<string>();
  parsed.decisions.forEach((entry, index) => {
    const validation = validatePlanDecision(entry);
    let reason: QuarantinedPlanDecision["reason"] | undefined;
    if (validation.status === "unsupportedVersion") reason = "unsupportedDecisionVersion";
    else if (validation.status === "unsupportedTargetVersion") reason = "unsupportedTargetVersion";
    else if (validation.status === "invalid") reason = "invalidDecision";
    else {
      const target = getPlanDecisionTargetKey(validation.decision.target);
      if (ids.has(validation.decision.id)) reason = "duplicateDecisionId";
      else if (targets.has(target)) reason = "conflictingTarget";
      else {
        decisions.push(validation.decision);
        ids.add(validation.decision.id);
        targets.add(target);
      }
    }
    if (reason)
      quarantined.push({
        quarantineId: `plan-decision-quarantine-${index}`,
        reason,
        raw: cloneRaw(entry),
      });
  });
  return {
    decisions: decisions.sort(compareDecisions),
    quarantined,
    ingress: {
      status: "accepted",
      quarantinedEntryCount: quarantined.length,
    } as PlanDecisionIngressStatus,
    durability: "durable" as SurfaceDurabilityStatus,
    protectedRaw: undefined,
  };
}

function protectedLoad(
  reason: "corruptJson" | "invalidEnvelope" | "unsupportedVersion",
  raw: string,
) {
  return {
    decisions: [] as PlanDecisionV1[],
    quarantined: [] as QuarantinedPlanDecision[],
    ingress: {
      status: "recoveryRequired",
      reason,
      sourcePreserved: true,
    } as PlanDecisionIngressStatus,
    durability: "unknown" as SurfaceDurabilityStatus,
    protectedRaw: raw,
  };
}
function envelope(entries: unknown[]): PlanDecisionEnvelopeV1 {
  return {
    app: "DayFrame",
    surface: "planDecisions",
    version: 1,
    decisions: entries.map(cloneRaw),
  };
}
function verifiedEnvelope(raw: string | null, desired: unknown[]): boolean {
  if (raw === null) return false;
  try {
    const value = JSON.parse(raw) as unknown;
    return (
      record(value) &&
      value.app === "DayFrame" &&
      value.surface === "planDecisions" &&
      value.version === PLAN_DECISION_SURFACE_VERSION &&
      Array.isArray(value.decisions) &&
      JSON.stringify(value.decisions) === JSON.stringify(desired)
    );
  } catch {
    return false;
  }
}
function cloneEntries(decisions: PlanDecisionV1[], quarantine: QuarantinedPlanDecision[]) {
  return [...decisions.map(clonePlanDecision), ...quarantine.map((entry) => cloneRaw(entry.raw))];
}
function cloneQuarantine(entry: QuarantinedPlanDecision): QuarantinedPlanDecision {
  return { ...entry, raw: cloneRaw(entry.raw) };
}
function cloneRaw<T>(value: T): T {
  return value === undefined ? value : structuredClone(value);
}
function compareDecisions(left: PlanDecisionV1, right: PlanDecisionV1) {
  return (
    getPlanDecisionTargetKey(left.target).localeCompare(getPlanDecisionTargetKey(right.target)) ||
    left.id.localeCompare(right.id)
  );
}
function getStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function exact(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => key in value);
}
