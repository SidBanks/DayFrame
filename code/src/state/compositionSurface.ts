import type {
  AttachmentRelationshipV1,
  CompositeDecisionV1,
  CompositionAuthorityV1,
  CompositionTemplateSourceV1,
} from "../core/planning/commitmentComposition.js";
import { projectCompositeOccurrence } from "../core/planning/commitmentComposition.js";
import type { PlanningFactId, PlanningRevision } from "../core/planning/planningFoundation.js";
import type { IndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import type { DayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import type { GenerateSchedulePreviewResult } from "../core/engine/generateSchedulePreview.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";

const COMPOSITION_AUTHORITY_STORE = "compositionAuthority";

export type CompositionIngressStatus =
  | { status: "initializing" | "accepted" }
  | { status: "protected"; reason: "readFailure" | "invalidAuthority" };
export type CompositionDurabilityStatus = "unknown" | "durable" | "pending" | "storageFailure";
type Command<T> =
  | { status: "accepted"; value: T; changed: boolean; persistence: "durable" | "pending" }
  | {
      status: "rejected";
      reason:
        | "initializing"
        | "protected"
        | "notFound"
        | "staleRevision"
        | "invalidInput"
        | "allocationFailure"
        | "authorityTransactionActive";
    };

export function createCompositionSurface(options: {
  storage: IndexedDbCollectionStorage;
  listSources: () => CompositionTemplateSourceV1[];
  allocateId?: () => PlanningFactId;
  now?: () => string;
  canMutate?: () => boolean;
  notificationScheduler?: DayFrameNotificationScheduler;
  onAuthorityChanged?: () => void;
}) {
  const storage = options.storage;
  const allocate = options.allocateId ?? allocatePlanningId;
  const now = options.now ?? (() => new Date().toISOString());
  const empty = (): CompositionAuthorityV1 => ({ version: 1, relationships: [], decisions: [] });
  let authority = empty(),
    desired = clone(authority);
  let ingress: CompositionIngressStatus = { status: "initializing" };
  let durability: CompositionDurabilityStatus = "unknown";
  const listeners = new Set<() => void>();
  const runtime: RuntimeAuthorityAdapter<{
    authority: CompositionAuthorityV1;
    desired: CompositionAuthorityV1;
    ingress: CompositionIngressStatus;
    durability: CompositionDurabilityStatus;
  }> = {
    id: "composition",
    captureRuntimeSnapshot: () => clone({ authority, desired, ingress, durability }),
    installRuntimeExact: (value) => {
      authority = clone(value.authority);
      desired = clone(value.desired);
      ingress = clone(value.ingress);
      durability = value.durability;
      notify();
    },
  };
  async function initializeComposition() {
    const { validateCompositionAuthority } =
      await import("../core/planning/commitmentComposition.js");
    const loaded = await storage.getAll<unknown>(COMPOSITION_AUTHORITY_STORE);
    if (loaded.status === "failure") return protect("readFailure");
    const checked = validateCompositionAuthority(
      {
        version: 1,
        relationships: loaded.value.filter((item) => type(item) === "attachmentRelationship"),
        decisions: loaded.value.filter((item) => type(item) === "compositeDecision"),
      },
      options.listSources(),
    );
    if (
      checked.status === "invalid" ||
      checked.authority.relationships.length + checked.authority.decisions.length !==
        loaded.value.length
    )
      return protect("invalidAuthority");
    authority = checked.authority;
    desired = clone(authority);
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
  async function createAttachment(
    input: Omit<
      AttachmentRelationshipV1,
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
    const id = allocateSafe();
    if (!id) return reject("allocationFailure");
    const at = now();
    const value: AttachmentRelationshipV1 = {
      recordType: "attachmentRelationship",
      version: 1,
      id,
      revision: revision(1),
      status: "active",
      ...clone(input),
      createdAt: at,
      updatedAt: at,
      effectiveFrom: at,
      provenance: authored(),
    };
    return accept({ ...authority, relationships: [...authority.relationships, value] }, value);
  }
  async function reviseAttachment(
    id: PlanningFactId,
    expectedRevision: number,
    patch: Partial<
      Pick<
        AttachmentRelationshipV1,
        | "slot"
        | "order"
        | "applicability"
        | "requiredness"
        | "timing"
        | "timingStrictness"
        | "buffer"
        | "goalSupport"
      >
    >,
  ) {
    const found = current(authority.relationships, id, expectedRevision);
    if ("status" in found) return found;
    const semantic = {
      slot: patch.slot ?? found.value.slot,
      order: patch.order ?? found.value.order,
      applicability: patch.applicability ?? found.value.applicability,
      requiredness: patch.requiredness ?? found.value.requiredness,
      timing: patch.timing ?? found.value.timing,
      timingStrictness: patch.timingStrictness ?? found.value.timingStrictness,
      buffer: patch.buffer ?? found.value.buffer,
      goalSupport: patch.goalSupport ?? found.value.goalSupport,
    };
    if (semanticFingerprint(semantic) === semanticFingerprint(pickRelation(found.value)))
      return unchanged(found.value);
    const value = {
      ...found.value,
      ...clone(semantic),
      revision: revision(found.value.revision + 1),
      updatedAt: now(),
    };
    return accept({ ...authority, relationships: [...authority.relationships, value] }, value);
  }
  async function retireAttachment(id: PlanningFactId, expectedRevision: number) {
    const found = current(authority.relationships, id, expectedRevision);
    if ("status" in found) return found;
    if (found.value.status === "retired") return unchanged(found.value);
    const at = now();
    const value: AttachmentRelationshipV1 = {
      ...found.value,
      revision: revision(found.value.revision + 1),
      status: "retired",
      updatedAt: at,
      effectiveTo: at,
    };
    return accept({ ...authority, relationships: [...authority.relationships, value] }, value);
  }
  async function acceptCompositeDecision(
    input: Omit<
      CompositeDecisionV1,
      | "recordType"
      | "version"
      | "id"
      | "revision"
      | "status"
      | "acceptedAt"
      | "updatedAt"
      | "provenance"
    >,
  ) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    const id = allocateSafe();
    if (!id) return reject("allocationFailure");
    const at = now();
    const value: CompositeDecisionV1 = {
      recordType: "compositeDecision",
      version: 1,
      id,
      revision: revision(1),
      status: "active",
      ...clone(input),
      acceptedAt: at,
      updatedAt: at,
      provenance: { version: 1, role: "acceptedAuthority", origin: { kind: "directAuthoring" } },
    };
    return accept({ ...authority, decisions: [...authority.decisions, value] }, value);
  }
  async function accept(
    next: CompositionAuthorityV1,
    value: AttachmentRelationshipV1 | CompositeDecisionV1,
  ): Promise<Command<typeof value>> {
    const { validateCompositionAuthority } =
      await import("../core/planning/commitmentComposition.js");
    const checked = validateCompositionAuthority(next, options.listSources());
    if (checked.status === "invalid") return reject("invalidInput");
    desired = checked.authority;
    const saved = await persist(desired);
    authority = checked.authority;
    durability = saved ? "durable" : "pending";
    options.onAuthorityChanged?.();
    notify();
    return {
      status: "accepted",
      value: clone(value),
      changed: true,
      persistence: durability === "durable" ? "durable" : "pending",
    };
  }
  async function persist(value: CompositionAuthorityV1) {
    const records = [...value.relationships, ...value.decisions];
    const result = await storage.mutate([
      { type: "clear", store: COMPOSITION_AUTHORITY_STORE },
      ...records.map((value) => ({
        type: "put" as const,
        store: COMPOSITION_AUTHORITY_STORE,
        value,
      })),
    ]);
    return result.status === "success";
  }
  function mutationBlocked() {
    if (ingress.status === "initializing") return reject("initializing");
    if (ingress.status === "protected") return reject("protected");
    if (options.canMutate && !options.canMutate()) return reject("authorityTransactionActive");
  }
  function notify() {
    options.notificationScheduler?.notify("composition", () =>
      listeners.forEach((listener) => listener()),
    );
  }
  function applyCompositionToSchedule(input: {
    previewResult: GenerateSchedulePreviewResult;
    planningWindowStart: Date;
    planningWindowEnd: Date;
    generatedAt: string;
  }) {
    const sources = options.listSources(),
      occupied = [
        ...input.previewResult.generatedWorkBlocks,
        ...input.previewResult.scheduledBlocks,
      ].map(({ id, startsAt, endsAt }) => ({ id, startsAt, endsAt }));
    const composites = input.previewResult.scheduledBlocks.flatMap((parent) => {
      const identity = parent.commitmentNavigationIdentity,
        parentSource =
          identity &&
          sources.find(
            (source) =>
              source.sourceId === identity.templateId &&
              source.incarnationId === identity.templateIncarnationId,
          );
      return parentSource
        ? [
            projectCompositeOccurrence({
              parent,
              parentSource,
              sources,
              authority,
              planningWindow: {
                startsAt: input.planningWindowStart,
                endsAt: input.planningWindowEnd,
              },
              occupied,
            }),
          ]
        : [];
    });
    input.previewResult.scheduledBlocks.push(
      ...composites.flatMap((value) => value.attachedOccurrences),
    );
    input.previewResult.frictionPoints.push(
      ...composites.flatMap((value) =>
        value.liabilities.map((liability) => ({
          id: `composition-${value.compositeId}-${liability.relationshipId}`,
          userId: "dayframe",
          kind: "compositionFailure" as const,
          severity: "critical" as const,
          title: "Required commitment support is unresolved",
          message: `Required attached activity could not be placed (${liability.reason}).`,
          affectedBlockIds: [value.parentOccurrenceId],
          suggestedFixes: [],
          canIgnore: false,
          ignored: false,
          resolved: false,
          createdAt: input.generatedAt,
          updatedAt: input.generatedAt,
        })),
      ),
    );
    return composites;
  }
  function filterIndependentRecurrences<T extends { blockTemplateId: string }>(recurrences: T[]) {
    const attached = new Set(
        latest(authority.relationships)
          .filter((value) => value.status === "active")
          .map((value) => `${value.child.sourceId}|${value.child.incarnationId}`),
      ),
      sources = options.listSources();
    return recurrences.filter((recurrence) => {
      const source = sources.find((value) => value.sourceId === recurrence.blockTemplateId);
      return !source || !attached.has(`${source.sourceId}|${source.incarnationId}`);
    });
  }
  return {
    initializeComposition,
    createAttachment,
    reviseAttachment,
    retireAttachment,
    acceptCompositeDecision,
    getAttachmentRevision: (id: PlanningFactId, revision: number) =>
      exact(authority.relationships, id, revision, "relationship"),
    getCompositeDecisionRevision: (id: PlanningFactId, revision: number) =>
      exact(authority.decisions, id, revision, "decision"),
    listCurrentAttachments: () =>
      latest(authority.relationships)
        .filter((item) => item.status === "active")
        .map(clone),
    projectCompositeOccurrence,
    applyCompositionToSchedule,
    filterIndependentRecurrences,
    exportCompositionAuthority: () => clone(authority),
    replaceCompositionAuthority: async (value: CompositionAuthorityV1) => {
      const { validateCompositionAuthority } =
        await import("../core/planning/commitmentComposition.js");
      const checked = validateCompositionAuthority(value, options.listSources());
      if (checked.status === "invalid") return { status: "invalid" as const };
      if (!(await persist(checked.authority))) return { status: "failure" as const };
      authority = checked.authority;
      desired = clone(authority);
      ingress = { status: "accepted" };
      durability = "durable";
      options.onAuthorityChanged?.();
      notify();
      return { status: "accepted" as const };
    },
    clearCompositionAuthority: async () => {
      const cleared = empty();
      const ok = await persist(cleared);
      if (ok) {
        authority = cleared;
        desired = clone(cleared);
        ingress = { status: "accepted" };
        durability = "durable";
        options.onAuthorityChanged?.();
        notify();
      }
      return ok ? { status: "removed" as const } : { status: "storageFailure" as const };
    },
    getCompositionIngressStatus: () => clone(ingress),
    getCompositionDurabilityStatus: () => durability,
    retryCompositionPersistence: async () => {
      const ok = await persist(desired);
      durability = ok ? "durable" : "storageFailure";
      return ok ? { status: "durable" as const } : { status: "storageFailure" as const };
    },
    subscribeComposition: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getCompositionRuntimeAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return runtime;
    },
  };
  function allocateSafe() {
    try {
      return allocate();
    } catch {
      return undefined;
    }
  }
  function unchanged<T>(value: T): Command<T> {
    return {
      status: "accepted",
      value: clone(value),
      changed: false,
      persistence: durability === "durable" ? "durable" : "pending",
    };
  }
}
function authored() {
  return { version: 1, role: "authoredAuthority", origin: { kind: "directAuthoring" } } as const;
}
function current<T extends { id: PlanningFactId; revision: number }>(
  values: T[],
  id: PlanningFactId,
  revision: number,
): { value: T } | { status: "rejected"; reason: "notFound" | "staleRevision" } {
  const found = latest(values).find((item) => item.id === id);
  return !found
    ? reject("notFound")
    : found.revision !== revision
      ? reject("staleRevision")
      : { value: found };
}
function exact<T extends { id: PlanningFactId; revision: number }>(
  values: T[],
  id: PlanningFactId,
  revision: number,
  key: "relationship" | "decision",
) {
  const value = values.find((item) => item.id === id && item.revision === revision);
  return value
    ? { status: "resolved" as const, [key]: clone(value) }
    : { status: "notFound" as const };
}
function latest<T extends { id: PlanningFactId; revision: number }>(values: T[]) {
  const map = new Map<PlanningFactId, T>();
  for (const value of values)
    if (!map.has(value.id) || map.get(value.id)!.revision < value.revision)
      map.set(value.id, value);
  return [...map.values()];
}
function pickRelation(value: AttachmentRelationshipV1) {
  return {
    slot: value.slot,
    order: value.order,
    applicability: value.applicability,
    requiredness: value.requiredness,
    timing: value.timing,
    timingStrictness: value.timingStrictness,
    buffer: value.buffer,
    goalSupport: value.goalSupport,
  };
}
function type(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as { recordType?: unknown }).recordType
    : undefined;
}
function reject<T extends string>(reason: T) {
  return { status: "rejected" as const, reason };
}
function clone<T>(value: T): T {
  return structuredClone(value);
}
function allocatePlanningId(): PlanningFactId {
  const value = globalThis.crypto?.randomUUID?.call(globalThis.crypto);
  if (!value) throw new Error("Planning identity allocation failed.");
  return value as PlanningFactId;
}
function revision(value: number): PlanningRevision {
  return value as PlanningRevision;
}
function semanticFingerprint(value: unknown): string {
  const input = canonical(value);
  let hash = 0xcbf29ce484222325n;
  for (let index = 0; index < input.length; index++) {
    hash ^= BigInt(input.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, "0");
}
function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key])}`)
    .join(",")}}`;
}
export type CompositionSurface = ReturnType<typeof createCompositionSurface>;
