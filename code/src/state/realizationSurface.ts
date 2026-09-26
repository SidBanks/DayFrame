import { createAcceptanceLifecycle, type AcceptanceLifecycle } from "./acceptanceLifecycle.js";
import {
  persistAcceptanceMutation,
  exactAuthorityRows,
  captureAcceptanceProtectionEvidence,
  type AcceptanceProtectionEvidence,
} from "./acceptancePersistence.js";
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
  lifecycle?: AcceptanceLifecycle;
  initialRuntime?: {
    authority: RealizationAuthorityV1;
    ingress: "initializing" | "ready" | "protected";
  };
  sourceWitness?: () => string;
  prepareSources?: (
    accepted: AcceptedAllocationV2,
    at: string,
  ) => Promise<
    | {
        status: "eligible";
        schedule: readonly import("../core/planning/acceptedAllocationRealization.js").RealizationConflictSubjectV1[];
      }
    | { status: "reviewRequired" | "unavailable" }
  >;
  resolveAcceptedAllocation: (
    id: string,
  ) =>
    | { status: "resolved"; acceptedAllocation: AcceptedAllocationV2 | { version: 1 } }
    | { status: "notFound" };
  now?: () => string;
  checkFoundation?: (accepted: AcceptedAllocationV2) => "eligible" | "reviewRequired";
  currentSchedule?: () => readonly import("../core/planning/acceptedAllocationRealization.js").RealizationConflictSubjectV1[];
  onAuthorityChanged?: () => void;
}) {
  const lifecycle = options.lifecycle ?? createAcceptanceLifecycle();
  type Ingress = "initializing" | "ready" | "protected";
  let authority: RealizationAuthorityV1 = structuredClone(
      options.initialRuntime?.authority ?? emptyRealizationAuthority(),
    ),
    ingress: Ingress = options.initialRuntime?.ingress ?? "initializing";
  let protectionCause: "commitUnconfirmed" | "verificationFailed" | undefined;
  let protectionEvidence: AcceptanceProtectionEvidence | undefined;
  const runtime: RuntimeAuthorityAdapter<{
    authority: RealizationAuthorityV1;
    ingress: Ingress;
  }> = {
    id: "realizations",
    captureRuntimeSnapshot: () => structuredClone({ authority, ingress }),
    installRuntimeExact: (value) => {
      lifecycle.assertInstall();
      lifecycle.invalidate();
      protectionEvidence = undefined;
      authority = structuredClone(value.authority);
      ingress = value.ingress;
      protectionCause = undefined;
      lifecycle.observation.changed();
    },
  };

  async function initializeRealizations() {
    if (ingress === "protected") return { status: "protected" as const };
    const origin = lifecycle.origin();
    const previous = authority,
      previousIngress = ingress;
    if (!lifecycle.isQuiescent()) return { status: "busy" as const };
    const loaded = await options.storage.getAll<unknown>(REALIZATION_AUTHORITY_STORE);
    if (
      !lifecycle.current(origin) ||
      authority !== previous ||
      ingress !== previousIngress ||
      !lifecycle.isQuiescent()
    )
      return { status: "contextReplaced" as const };
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
    lifecycle.observation.changed();
    return { status: "ready" as const };
  }

  async function realizeAcceptedAllocation(
    acceptedAllocationId: string,
  ): Promise<RealizationCommandResultV1> {
    const origin = lifecycle.origin();
    const finish = (value: RealizationCommandResultV1) => lifecycle.result(value, origin);
    const refusal = (
      status: RealizationCommandResultV1["status"],
      reason: RealizationCommandResultV1["reasons"][number],
    ) => finish({ ...invalid(acceptedAllocationId), status, reasons: [reason] });
    if (!lifecycle.current(origin)) return refusal("rejected", "contextReplaced");
    const denied = lifecycle.acquire(origin);
    if (denied)
      return refusal(
        denied === "authorityProtected" ? "protected" : "rejected",
        denied === "busy" ? "realizationBusy" : denied,
      );
    // Every awaited physical mutation below owns its terminal waiting. No unresolved
    // transaction can reach this release; unresolved calls keep this invocation pending.
    try {
      if (ingress !== "ready")
        return refusal(
          ingress === "protected" ? "protected" : "rejected",
          ingress === "protected" ? "authorityProtected" : "authorityUnavailable",
        );
      const resolved = options.resolveAcceptedAllocation(acceptedAllocationId);
      if (resolved.status !== "resolved") return finish(invalid(acceptedAllocationId));
      if (resolved.acceptedAllocation.version !== 2)
        return refusal("inapplicable", "acceptedAllocationIncomplete");
      const accepted = structuredClone(resolved.acceptedAllocation);
      const base = authority;
      const exactTarget = () => {
        const current = options.resolveAcceptedAllocation(acceptedAllocationId);
        return (
          current.status === "resolved" &&
          JSON.stringify(current.acceptedAllocation) === JSON.stringify(accepted)
        );
      };
      const source = () =>
        options.sourceWitness?.() ?? JSON.stringify(options.currentSchedule?.() ?? []);
      const existing = base.realizations.find(
        (item) => item.acceptedAllocationId === acceptedAllocationId,
      );
      if (existing) {
        const verified = await verify(base);
        if (!lifecycle.current(origin)) return refusal("rejected", "contextReplaced");
        if (!verified || authority !== base || !exactTarget()) {
          protect();
          protectionEvidence = await captureAcceptanceProtectionEvidence(
            options.storage,
            REALIZATION_AUTHORITY_STORE,
            base,
          );
          return refusal("unconfirmed", "verificationFailedAfterCommit");
        }
        return finish(resultFor(existing, "alreadyRealized", "none", ["alreadyRealized"]));
      }
      const at = (options.now ?? (() => new Date().toISOString()))();
      const witness = source();
      const sources = await options.prepareSources?.(accepted, at);
      if (source() !== witness || !exactTarget()) return refusal("rejected", "sourceChanged");
      if (sources?.status === "unavailable") return refusal("inapplicable", "sourceUnavailable");
      if (
        sources?.status === "reviewRequired" ||
        (!sources && options.checkFoundation?.(accepted) === "reviewRequired")
      )
        return refusal("inapplicable", "sleepFoundationReviewRequired");
      const staged = stageAcceptedAllocationRealization({
        acceptedAllocation: accepted,
        realizedAt: at,
        currentSchedule: [
          ...base.facts,
          ...(sources?.status === "eligible"
            ? sources.schedule
            : (options.currentSchedule?.() ?? [])),
        ],
      });
      if (staged.status !== "staged") return finish(staged.result);
      const next = {
        version: 1 as const,
        realizations: [...base.realizations, staged.realization],
        facts: [...base.facts, ...staged.facts],
      };
      const checked = validateRealizationAuthority(next);
      if (checked.status === "invalid") return finish(invalid(acceptedAllocationId));
      let sourceChanged = false;
      const persisted = await persistAcceptanceMutation(
        options.storage,
        [
          { type: "put", store: REALIZATION_AUTHORITY_STORE, value: staged.realization },
          ...staged.facts.map((value) => ({
            type: "put" as const,
            store: REALIZATION_AUTHORITY_STORE,
            value,
          })),
        ],
        () => {
          sourceChanged = source() !== witness || !exactTarget();
          return (
            lifecycle.owns(origin) &&
            !lifecycle.admission() &&
            ingress === "ready" &&
            authority === base &&
            !sourceChanged
          );
        },
      );
      if (persisted === "notWritten")
        return sourceChanged
          ? refusal("rejected", "sourceChanged")
          : finish(failed(acceptedAllocationId));
      if (persisted === "uncertain") {
        protect("commitUnconfirmed");
        protectionEvidence = await captureAcceptanceProtectionEvidence(
          options.storage,
          REALIZATION_AUTHORITY_STORE,
          next,
        );
        return refusal("unconfirmed", "commitStateUncertain");
      }
      if (
        !(await verify(next)) ||
        authority !== base ||
        !exactTarget() ||
        !lifecycle.current(origin)
      ) {
        protect("verificationFailed");
        protectionEvidence = await captureAcceptanceProtectionEvidence(
          options.storage,
          REALIZATION_AUTHORITY_STORE,
          next,
        );
        return refusal("unconfirmed", "verificationFailedAfterCommit");
      }
      const reviewRequired = source() !== witness;
      authority = checked.authority;
      lifecycle.observation.changed();
      try {
        options.onAuthorityChanged?.();
      } catch {
        protect();
        protectionEvidence = await captureAcceptanceProtectionEvidence(
          options.storage,
          REALIZATION_AUTHORITY_STORE,
          next,
        );
        return refusal("unconfirmed", "verificationFailedAfterCommit");
      }
      return finish({
        ...resultFor(staged.realization, "realized", "stale", []),
        ...(reviewRequired ? { reviewRequired: true } : {}),
      });
    } finally {
      lifecycle.release(origin);
    }
  }

  async function verify(value: RealizationAuthorityV1) {
    try {
      const loaded = await options.storage.getAll<unknown>(REALIZATION_AUTHORITY_STORE);
      return (
        loaded.status === "success" &&
        exactAuthorityRows(loaded.value, [...value.realizations, ...value.facts]) &&
        relationshipsResolve(value)
      );
    } catch {
      return false;
    }
  }
  async function replace(value: RealizationAuthorityV1, epoch?: number) {
    if (epoch !== undefined && !lifecycle.coordinatorCurrent(epoch))
      return { status: "failure" as const };
    const checked = validateRealizationAuthority(structuredClone(value));
    if (checked.status === "invalid" || !relationshipsResolve(checked.authority))
      return { status: "invalid" as const };
    const persisted = await persistAcceptanceMutation(
      options.storage,
      [
        { type: "clear", store: REALIZATION_AUTHORITY_STORE },
        ...[...checked.authority.realizations, ...checked.authority.facts].map((value) => ({
          type: "put" as const,
          store: REALIZATION_AUTHORITY_STORE,
          value,
        })),
      ],
      () => epoch === undefined || lifecycle.coordinatorCurrent(epoch),
    );
    if (persisted === "notWritten") return { status: "failure" as const };
    if (persisted !== "committed" || !(await verify(checked.authority))) {
      protect();
      return { status: "failure" as const };
    }
    lifecycle.invalidate();
    authority = checked.authority;
    ingress = "ready";
    lifecycle.observation.changed();
    return { status: "accepted" as const };
  }

  return {
    getRealizationProtectionEvidence: (
      capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
    ) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return structuredClone(protectionEvidence);
    },
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
    replaceRealizationAuthority: (value: RealizationAuthorityV1) => {
      const frozen = structuredClone(value);
      return !lifecycle.current(lifecycle.origin()) || ingress === "protected"
        ? Promise.resolve({ status: "failure" as const })
        : lifecycle.replace((epoch) => replace(frozen, epoch));
    },
    clearRealizationAuthority: async () => {
      const result =
        !lifecycle.current(lifecycle.origin()) || ingress === "protected"
          ? { status: "failure" }
          : await lifecycle.replace((epoch) => replace(emptyRealizationAuthority(), epoch));
      return result.status === "accepted"
        ? { status: "removed" as const }
        : { status: "storageFailure" as const };
    },
    clearRealizationForCoordinator: async (
      capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
      epoch: number,
    ) => {
      if (
        capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY ||
        !lifecycle.coordinatorCurrent(epoch)
      )
        return { status: "storageFailure" as const };
      const result = await replace(emptyRealizationAuthority(), epoch);
      return result.status === "accepted"
        ? { status: "removed" as const }
        : { status: "storageFailure" as const };
    },
    getRealizationReviewEvidence: () => ({
      observation: lifecycle.observation,
      protectionCause,
      active: !lifecycle.isQuiescent(),
    }),
    getRealizationIngressStatus: () => ingress,
    getRealizationRuntimeAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return runtime;
    },
  };
  function protect(cause?: typeof protectionCause) {
    protectionCause = cause;
    ingress = "protected";
    lifecycle.observation.changed();
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
      if (
        staged.status !== "staged" ||
        JSON.stringify(staged.realization) !== JSON.stringify(realization)
      )
        return false;
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
