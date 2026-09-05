import {
  stageAcceptedAllocationRealization,
  validateRealizationAuthority,
  type RealizationAuthorityV1,
  type RealizationCommandResultV1,
} from "../core/planning/acceptedAllocationRealization.js";
import type { AcceptedAllocationV2 } from "../core/planning/proposal.js";
import type { RealizedScheduleFactV1 } from "../core/planning/realizedScheduleIdentity.js";
import type { IndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import { REALIZATION_AUTHORITY_STORE } from "../infrastructure/storage/dayFrameDurableDb.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";

export function createRealizationSurface(options: {
  storage: IndexedDbCollectionStorage;
  resolveAcceptedAllocation: (
    id: string,
  ) =>
    | { status: "resolved"; acceptedAllocation: AcceptedAllocationV2 | { version: 1 } }
    | { status: "notFound" };
  now?: () => string;
  currentSchedule?: () => readonly import("../core/planning/acceptedAllocationRealization.js").RealizationConflictSubjectV1[];
  onAuthorityChanged?: () => void;
}) {
  type Ingress = "initializing" | "ready" | "protected";
  let authority: RealizationAuthorityV1 = emptyRealizationAuthority(),
    ingress: Ingress = "initializing";
  const runtime: RuntimeAuthorityAdapter<{
    authority: RealizationAuthorityV1;
    ingress: Ingress;
  }> = {
    id: "realizations",
    captureRuntimeSnapshot: () => structuredClone({ authority, ingress }),
    installRuntimeExact: (value) => {
      authority = structuredClone(value.authority);
      ingress = value.ingress;
    },
  };

  async function initializeRealizations() {
    const loaded = await options.storage.getAll<unknown>(REALIZATION_AUTHORITY_STORE);
    if (loaded.status === "failure") return protect();
    const checked = validateRealizationAuthority({
      version: 1,
      realizations: loaded.value.filter((item) => type(item) === "realization"),
      facts: loaded.value.filter((item) => type(item) === "realizedScheduleFact"),
    });
    if (
      checked.status === "invalid" ||
      checked.authority.realizations.length + checked.authority.facts.length !==
        loaded.value.length ||
      !relationshipsResolve(checked.authority)
    )
      return protect();
    authority = checked.authority;
    ingress = "ready";
    return { status: "ready" as const };
  }

  async function realizeAcceptedAllocation(
    acceptedAllocationId: string,
  ): Promise<RealizationCommandResultV1> {
    if (ingress !== "ready") return failed(acceptedAllocationId);
    const existing = authority.realizations.find(
      (item) => item.acceptedAllocationId === acceptedAllocationId,
    );
    if (existing) return resultFor(existing, "alreadyRealized", "none", ["alreadyRealized"]);
    const resolved = options.resolveAcceptedAllocation(acceptedAllocationId);
    if (resolved.status !== "resolved") return invalid(acceptedAllocationId);
    if (resolved.acceptedAllocation.version !== 2)
      return {
        ...invalid(acceptedAllocationId),
        status: "inapplicable",
        reasons: ["acceptedAllocationIncomplete"],
      };
    const staged = stageAcceptedAllocationRealization({
      acceptedAllocation: resolved.acceptedAllocation,
      realizedAt: (options.now ?? (() => new Date().toISOString()))(),
      currentSchedule: [...authority.facts, ...(options.currentSchedule?.() ?? [])],
    });
    if (staged.status !== "staged") return staged.result;
    const next = {
      version: 1 as const,
      realizations: [...authority.realizations, staged.realization],
      facts: [...authority.facts, ...staged.facts],
    };
    const checked = validateRealizationAuthority(next);
    if (checked.status === "invalid") return invalid(acceptedAllocationId);
    const persisted = await options.storage.mutate([
      { type: "put", store: REALIZATION_AUTHORITY_STORE, value: staged.realization },
      ...staged.facts.map((fact) => ({
        type: "put" as const,
        store: REALIZATION_AUTHORITY_STORE,
        value: fact,
      })),
    ]);
    if (persisted.status === "failure") return failed(acceptedAllocationId);
    authority = checked.authority;
    options.onAuthorityChanged?.();
    return resultFor(staged.realization, "realized", "stale", []);
  }

  return {
    initializeRealizations,
    realizeAcceptedAllocation,
    resolveRealization: (id: string) => {
      const value = authority.realizations.find((item) => item.id === id);
      return value
        ? { status: "resolved" as const, realization: structuredClone(value) }
        : { status: "notFound" as const };
    },
    getRealizationForAcceptedAllocation: (id: string) => {
      const value = authority.realizations.find((item) => item.acceptedAllocationId === id);
      return value
        ? { status: "resolved" as const, realization: structuredClone(value) }
        : { status: "notFound" as const };
    },
    listRealizations: () => structuredClone(authority.realizations),
    listRealizedScheduleFacts: () => structuredClone(authority.facts),
    listScheduledGoalWork: (range?: { startsAt: string; endsAt: string }) =>
      select("productiveGoalWork", range),
    listScheduledSupportActivities: (range?: { startsAt: string; endsAt: string }) =>
      select("supportActivity", range),
    listRealizedBufferProtections: (range?: { startsAt: string; endsAt: string }) =>
      select("bufferProtection", range),
    resolveScheduledAcceptedSubject: (id: string) => {
      const fact = authority.facts.find((item) => item.id === id);
      return fact
        ? { status: "resolved" as const, fact: structuredClone(fact) }
        : { status: "notFound" as const };
    },
    resolveAcceptedScheduleLineage: (id: string) => {
      const fact = authority.facts.find((item) => item.id === id);
      return fact
        ? {
            status: "resolved" as const,
            lineage: structuredClone(fact.lineage),
            origin: structuredClone(fact.origin),
          }
        : { status: "notFound" as const };
    },
    exportRealizationAuthority: () => structuredClone(authority),
    replaceRealizationAuthority: async (value: RealizationAuthorityV1) => {
      const checked = validateRealizationAuthority(value);
      if (checked.status === "invalid") return { status: "invalid" as const };
      const records = [...checked.authority.realizations, ...checked.authority.facts];
      const persisted = await options.storage.mutate([
        { type: "clear", store: REALIZATION_AUTHORITY_STORE },
        ...records.map((value) => ({
          type: "put" as const,
          store: REALIZATION_AUTHORITY_STORE,
          value,
        })),
      ]);
      if (persisted.status === "failure") return { status: "failure" as const };
      authority = checked.authority;
      ingress = "ready";
      return { status: "accepted" as const };
    },
    clearRealizationAuthority: async () => {
      const result = await options.storage.clear(REALIZATION_AUTHORITY_STORE);
      if (result.status === "failure") return { status: "storageFailure" as const };
      authority = emptyRealizationAuthority();
      return { status: "removed" as const };
    },
    getRealizationIngressStatus: () => ingress,
    getRealizationRuntimeAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return runtime;
    },
  };
  function protect() {
    ingress = "protected";
    return { status: "protected" as const };
  }
  function select(
    role: RealizedScheduleFactV1["scheduleRole"],
    range?: { startsAt: string; endsAt: string },
  ) {
    return structuredClone(
      authority.facts.filter(
        (fact) =>
          fact.scheduleRole === role &&
          (!range || (fact.startsAt < range.endsAt && range.startsAt < fact.endsAt)),
      ),
    );
  }
  function relationshipsResolve(value: RealizationAuthorityV1) {
    return value.realizations.every((realization) => {
      const resolved = options.resolveAcceptedAllocation(realization.acceptedAllocationId);
      if (resolved.status !== "resolved" || resolved.acceptedAllocation.version !== 2) return false;
      const staged = stageAcceptedAllocationRealization({
        acceptedAllocation: resolved.acceptedAllocation,
        realizedAt: realization.realizedAt,
        currentSchedule: [],
      });
      if (staged.status !== "staged" || staged.realization.id !== realization.id) return false;
      const owned = value.facts.filter((fact) => fact.origin.realizationId === realization.id);
      const ordered = (facts: RealizedScheduleFactV1[]) =>
        facts.slice().sort((left, right) => left.id.localeCompare(right.id));
      return JSON.stringify(ordered(staged.facts)) === JSON.stringify(ordered(owned));
    });
  }
}

export function emptyRealizationAuthority(): RealizationAuthorityV1 {
  return { version: 1, realizations: [], facts: [] };
}
function type(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as { recordType?: unknown }).recordType
    : undefined;
}
function invalid(id: string): RealizationCommandResultV1 {
  return {
    status: "invalid",
    acceptedAllocationId: id,
    scheduledGoalWorkIds: [],
    scheduledSupportActivityIds: [],
    bufferProtectionIds: [],
    conflicts: [],
    reasons: ["acceptedAllocationInvalid"],
    previewFreshnessImpact: "none",
  };
}
function failed(id: string): RealizationCommandResultV1 {
  return { ...invalid(id), status: "failed", reasons: ["atomicPersistenceFailure"] };
}
function resultFor(
  value: RealizationAuthorityV1["realizations"][number],
  status: "realized" | "alreadyRealized",
  impact: "stale" | "none",
  reasons: RealizationCommandResultV1["reasons"],
): RealizationCommandResultV1 {
  return {
    status,
    realizationId: value.id,
    acceptedAllocationId: value.acceptedAllocationId,
    scheduledGoalWorkIds: [...value.scheduledGoalWorkIds],
    scheduledSupportActivityIds: [...value.scheduledSupportActivityIds],
    bufferProtectionIds: [...value.realizedBufferProtectionIds],
    conflicts: [],
    reasons,
    previewFreshnessImpact: impact,
  };
}
export type RealizationSurface = ReturnType<typeof createRealizationSurface>;
