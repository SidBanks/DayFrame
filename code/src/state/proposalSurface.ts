import type { AllocationResultV1 } from "../core/planning/allocation.js";
import {
  claimsConflict,
  createModificationCandidate as buildCandidate,
  deriveOrdinaryProposal,
  emptyProposalAuthority,
  evaluateProposalFreshness,
  transitionProposal,
  validateProposalAuthority,
  type AcceptedAllocationV1,
  type ConstructiveProposalV1,
  type ProposalAuthorityV1,
  type ProposalDecisionV1,
  type ProposalGenerationResultV1,
  type ProposalHorizonV1,
  type ProposalModificationDeltaV1,
} from "../core/planning/proposal.js";
import type { IndexedDbCollectionStorage } from "../infrastructure/storage/indexedDbCollectionStorage.js";
import type { DayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";

const STORE = "proposalAuthority";
type Ingress =
  | { status: "initializing" | "accepted" }
  | { status: "protected"; reason: "readFailure" | "invalidAuthority" };
type Durability = "unknown" | "durable" | "pending" | "storageFailure";
type Command<T> =
  | { status: "accepted"; value: T; persistence: "durable" | "pending" }
  | {
      status: "rejected";
      reason:
        | "initializing"
        | "protected"
        | "authorityTransactionActive"
        | "notFound"
        | "notActionable"
        | "stale"
        | "invalidInput"
        | "conflictingClaim"
        | "allocationFailure"
        | "persistenceFailure";
    };

export function createProposalSurface(options: {
  storage: IndexedDbCollectionStorage;
  now?: () => string;
  allocateId?: () => string;
  canMutate?: () => boolean;
  notificationScheduler?: DayFrameNotificationScheduler;
  onAuthorityChanged?: () => void;
  onAcceptedAllocation?: (acceptedAllocationId: string) => Promise<unknown>;
  revalidate?: (
    proposal: ConstructiveProposalV1,
  ) => Promise<ProposalGenerationResultV1> | ProposalGenerationResultV1;
}) {
  const now = options.now ?? (() => new Date().toISOString()),
    allocate = options.allocateId ?? randomId;
  let authority = emptyProposalAuthority(),
    desired = clone(authority),
    ingress: Ingress = { status: "initializing" },
    durability: Durability = "unknown";
  const listeners = new Set<() => void>();
  const runtime: RuntimeAuthorityAdapter<{
    authority: ProposalAuthorityV1;
    desired: ProposalAuthorityV1;
    ingress: Ingress;
    durability: Durability;
  }> = {
    id: "proposals",
    captureRuntimeSnapshot: () => clone({ authority, desired, ingress, durability }),
    installRuntimeExact: (value) => {
      authority = clone(value.authority);
      desired = clone(value.desired);
      ingress = clone(value.ingress);
      durability = value.durability;
      notify();
    },
  };

  async function initializeProposals() {
    const loaded = await options.storage.getAll<unknown>(STORE);
    if (loaded.status === "failure") return protect("readFailure");
    const checked = validateProposalAuthority({
      version: 1,
      proposals: loaded.value.filter((value) => type(value) === "proposal"),
      candidates: loaded.value.filter((value) => type(value) === "proposalModificationCandidate"),
      decisions: loaded.value.filter((value) => type(value) === "proposalDecision"),
      acceptedAllocations: loaded.value.filter((value) => type(value) === "acceptedAllocation"),
    });
    if (checked.status === "invalid" || recordCount(checked.authority) !== loaded.value.length)
      return protect("invalidAuthority");
    authority = checked.authority;
    desired = clone(authority);
    ingress = { status: "accepted" };
    durability = "durable";
    notify();
    return { status: "ready" as const };
  }
  function deriveProposal(input: {
    allocation: AllocationResultV1;
    horizon: ProposalHorizonV1;
    allocationHorizon: ProposalHorizonV1;
    planningDataHorizon?: ProposalHorizonV1;
    generatedAt: string;
    predecessor?: Pick<ConstructiveProposalV1, "id" | "revision">;
  }) {
    return deriveOrdinaryProposal(input);
  }
  async function recordProposal(result: ProposalGenerationResultV1) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    if (result.status !== "proposed") return reject("invalidInput");
    const existing = authority.proposals.find(
      (value) => value.id === result.proposal.id && value.revision === result.proposal.revision,
    );
    if (existing) return accepted(existing);
    return commit(
      { ...authority, proposals: [...authority.proposals, clone(result.proposal)] },
      result.proposal,
    );
  }
  async function markProposalShown(id: string, revision: number) {
    return lifecycle(id, revision, "shown");
  }
  async function supersedeProposal(
    id: string,
    revision: number,
    successor: ConstructiveProposalV1,
  ) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    const proposal = exactProposal(id, revision);
    if (!proposal || !actionable(proposal)) return reject(proposal ? "notActionable" : "notFound");
    if (
      authority.proposals.some(
        (value) => value.id === successor.id && value.revision === successor.revision,
      )
    )
      return reject("invalidInput");
    const transitioned = transitionProposal(proposal, "superseded", successor);
    if (!transitioned) return reject("notActionable");
    return commit(
      { ...authority, proposals: [...authority.proposals, clone(successor), transitioned] },
      transitioned,
    );
  }
  async function lifecycle(
    id: string,
    revision: number,
    next: "shown" | "stale" | "expired" | "superseded" | "inapplicable",
    successor?: ConstructiveProposalV1,
  ) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    const proposal = exactProposal(id, revision);
    if (!proposal) return reject("notFound");
    const transitioned = transitionProposal(proposal, next, successor);
    if (!transitioned) return reject("notActionable");
    return commit(
      { ...authority, proposals: [...authority.proposals, transitioned] },
      transitioned,
    );
  }
  async function createModificationCandidate(
    proposalId: string,
    proposalRevision: number,
    optionId: string,
    delta: ProposalModificationDeltaV1,
  ) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    const proposal = exactProposal(proposalId, proposalRevision);
    if (!proposal || !actionable(proposal)) return reject(proposal ? "notActionable" : "notFound");
    const candidate = buildCandidate({ proposal, optionId, delta, createdAt: now() });
    if (!candidate) return reject("invalidInput");
    return commit({ ...authority, candidates: [...authority.candidates, candidate] }, candidate);
  }
  async function acceptProposalOption(input: {
    proposalId: string;
    proposalRevision: number;
    optionId: string;
    current?: ProposalGenerationResultV1;
  }) {
    return acceptChoice(input, undefined);
  }
  async function modifyAndAcceptCandidate(input: {
    proposalId: string;
    proposalRevision: number;
    candidateId: string;
    current?: ProposalGenerationResultV1;
  }) {
    const candidate = authority.candidates.find((value) => value.id === input.candidateId);
    if (!candidate || candidate.validation !== "valid" || !candidate.finalOption)
      return reject("invalidInput");
    return acceptChoice(
      {
        proposalId: input.proposalId,
        proposalRevision: input.proposalRevision,
        optionId: candidate.sourceOptionId,
        ...(input.current ? { current: input.current } : {}),
      },
      candidate,
    );
  }
  async function acceptChoice(
    input: {
      proposalId: string;
      proposalRevision: number;
      optionId: string;
      current?: ProposalGenerationResultV1;
    },
    candidate: ProposalAuthorityV1["candidates"][number] | undefined,
  ) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    const proposal = exactProposal(input.proposalId, input.proposalRevision);
    if (!proposal) return reject("notFound");
    if (!actionable(proposal) || rejectedOption(proposal, input.optionId))
      return reject("notActionable");
    const revalidated = options.revalidate
      ? await options.revalidate(clone(proposal))
      : input.current;
    if (!revalidated || evaluateProposalFreshness(proposal, revalidated).status !== "current")
      return staleProposal(proposal);
    const currentProposal = revalidated.status === "proposed" ? revalidated.proposal : undefined,
      currentOption = currentProposal?.options.find((value) => value.id === input.optionId),
      option = candidate?.finalOption ?? currentOption;
    if (!currentOption || !option) return reject("stale");
    if (
      authority.acceptedAllocations.some((accepted) =>
        claimsConflict(accepted.claims, option.claims),
      )
    )
      return staleProposal(proposal, "conflictingClaim");
    let decisionId: string, acceptedId: string;
    try {
      decisionId = allocate();
      acceptedId = allocate();
    } catch {
      return reject("allocationFailure");
    }
    const at = now(),
      decision: ProposalDecisionV1 = {
        recordType: "proposalDecision",
        version: 1,
        revision: 1,
        id: decisionId,
        proposalId: proposal.id,
        proposalRevision: proposal.revision,
        optionId: candidate ? candidate.sourceOptionId : option.id,
        ...(candidate ? { candidateId: candidate.id } : {}),
        decision: candidate ? "modifyAndAccept" : "accept",
        decidedAt: at,
        actor: { kind: "user" },
        acceptedScope: clone(option.scope),
        decisiveFingerprint: proposal.inputFingerprint,
        provenance: acceptedProvenance(),
      },
      acceptedAllocation:
        | AcceptedAllocationV1
        | import("../core/planning/proposal.js").AcceptedAllocationV2 = {
        recordType: "acceptedAllocation",
        version: 2,
        revision: 1,
        id: acceptedId,
        decisionId,
        proposalId: proposal.id,
        proposalRevision: proposal.revision,
        sourceOptionId: candidate ? candidate.sourceOptionId : option.id,
        ...(candidate ? { sourceCandidateId: candidate.id } : {}),
        acceptedAt: at,
        actor: { kind: "user" },
        scope: clone(option.scope),
        productiveMinutes: option.productiveMinutes,
        supportMinutes: option.supportMinutes,
        bufferMinutes: option.bufferMinutes,
        totalResourceMinutes: option.totalResourceMinutes,
        nominalResourceMinutes: option.nominalResourceMinutes,
        claims: clone(option.claims),
        resourceFootprints: clone(option.resourceFootprints),
        assignments: clone(option.assignments),
        decisiveSnapshot: {
          proposalInputFingerprint: proposal.inputFingerprint,
          sourceAllocationId: proposal.sourceAllocationId,
          sourceAllocationDependencyFingerprint: proposal.sourceAllocationDependencyFingerprint,
          capacityFingerprint: proposal.capacityFingerprint,
          option: clone(option),
        },
        realization: "unrealized",
        footprintCompleteness: "complete",
        provenance: acceptedProvenance(),
      },
      terminal = transitionProposal(proposal, "accepted")!;
    const proposals = [...authority.proposals, terminal];
    for (const latest of latestProposals(authority.proposals)) {
      if (latest.id === proposal.id || !actionable(latest)) continue;
      if (latest.options.some((value) => claimsConflict(value.claims, option.claims))) {
        const stale = transitionProposal(latest, "stale");
        if (stale) proposals.push(stale);
      }
    }
    const next = {
      ...authority,
      proposals,
      decisions: [...authority.decisions, decision],
      acceptedAllocations: [...authority.acceptedAllocations, acceptedAllocation],
    };
    const committed = await commit(next, { decision, acceptedAllocation });
    if (committed.status !== "accepted" || !options.onAcceptedAllocation) return committed;
    const realization = await options.onAcceptedAllocation(acceptedAllocation.id);
    return { ...committed, value: { ...committed.value, realization } };
  }
  async function rejectOption(input: {
    proposalId: string;
    proposalRevision: number;
    optionId: string;
  }) {
    return rejection(input, "rejectOption");
  }
  async function rejectProposal(input: { proposalId: string; proposalRevision: number }) {
    return rejection(input, "rejectProposal");
  }
  async function rejection(
    input: { proposalId: string; proposalRevision: number; optionId?: string },
    decisionType: "rejectOption" | "rejectProposal",
  ) {
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    const proposal = exactProposal(input.proposalId, input.proposalRevision);
    if (!proposal || !actionable(proposal)) return reject(proposal ? "notActionable" : "notFound");
    if (
      decisionType === "rejectOption" &&
      !proposal.options.some((value) => value.id === input.optionId)
    )
      return reject("notFound");
    let id: string;
    try {
      id = allocate();
    } catch {
      return reject("allocationFailure");
    }
    const decision: ProposalDecisionV1 = {
      recordType: "proposalDecision",
      version: 1,
      revision: 1,
      id,
      proposalId: proposal.id,
      proposalRevision: proposal.revision,
      ...(input.optionId ? { optionId: input.optionId } : {}),
      decision: decisionType,
      decidedAt: now(),
      actor: { kind: "user" },
      decisiveFingerprint: proposal.inputFingerprint,
      provenance: acceptedProvenance(),
    };
    const otherRejected = authority.decisions.filter(
      (value) =>
        value.proposalId === proposal.id &&
        value.proposalRevision === proposal.revision &&
        value.decision === "rejectOption",
    ).length;
    const terminal =
      decisionType === "rejectProposal" || otherRejected + 1 >= proposal.options.length
        ? transitionProposal(proposal, "rejected")
        : undefined;
    return commit(
      {
        ...authority,
        proposals: terminal ? [...authority.proposals, terminal] : authority.proposals,
        decisions: [...authority.decisions, decision],
      },
      decision,
    );
  }
  function exactProposal(id: string, revision: number) {
    return authority.proposals.find((value) => value.id === id && value.revision === revision);
  }
  function rejectedOption(proposal: ConstructiveProposalV1, optionId: string) {
    return authority.decisions.some(
      (value) =>
        value.proposalId === proposal.id &&
        value.proposalRevision === proposal.revision &&
        value.optionId === optionId &&
        value.decision === "rejectOption",
    );
  }
  async function commit<T>(next: ProposalAuthorityV1, value: T): Promise<Command<T>> {
    const checked = validateProposalAuthority(next);
    if (checked.status === "invalid") return reject("invalidInput");
    desired = checked.authority;
    if (!(await persist(desired))) return reject("persistenceFailure");
    authority = checked.authority;
    durability = "durable";
    options.onAuthorityChanged?.();
    notify();
    return accepted(value);
  }
  async function staleProposal(
    proposal: ConstructiveProposalV1,
    reason: "stale" | "conflictingClaim" = "stale",
  ) {
    const stale = transitionProposal(proposal, "stale");
    if (!stale) return reject("notActionable");
    const recorded = await commit(
      { ...authority, proposals: [...authority.proposals, stale] },
      stale,
    );
    return recorded.status === "accepted" ? reject(reason) : recorded;
  }
  async function persist(value: ProposalAuthorityV1) {
    const records = [
      ...value.proposals,
      ...value.candidates,
      ...value.decisions,
      ...value.acceptedAllocations,
    ];
    const result = await options.storage.mutate([
      { type: "clear", store: STORE },
      ...records.map((value) => ({ type: "put" as const, store: STORE, value })),
    ]);
    return result.status === "success";
  }
  function mutationBlocked() {
    if (ingress.status === "initializing") return reject("initializing");
    if (ingress.status === "protected") return reject("protected");
    if (options.canMutate && !options.canMutate()) return reject("authorityTransactionActive");
  }
  function accepted<T>(value: T): Command<T> {
    return {
      status: "accepted",
      value: clone(value),
      persistence: durability === "durable" ? "durable" : "pending",
    };
  }
  function protect(reason: "readFailure" | "invalidAuthority") {
    ingress = { status: "protected", reason };
    durability = "storageFailure";
    return { status: "protected" as const };
  }
  function notify() {
    options.notificationScheduler?.notify("proposals", () =>
      listeners.forEach((listener) => listener()),
    );
  }
  return {
    initializeProposals,
    deriveProposal,
    recordProposal,
    markProposalShown,
    supersedeProposal,
    createModificationCandidate,
    acceptProposalOption,
    modifyAndAcceptCandidate,
    rejectOption,
    rejectProposal,
    evaluateProposalFreshness,
    resolveProposalRevision: (id: string, revision: number) => {
      const proposal = exactProposal(id, revision);
      return proposal
        ? { status: "resolved" as const, proposal: clone(proposal) }
        : { status: "notFound" as const };
    },
    listActionableProposals: () =>
      latestProposals(authority.proposals).filter(actionable).map(clone),
    listProposalHistory: (limit = 100) =>
      clone(
        authority.proposals
          .slice()
          .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
          .slice(0, Math.max(0, limit)),
      ),
    resolveAcceptedAllocation: (id: string) => {
      const value = authority.acceptedAllocations.find((item) => item.id === id);
      return value
        ? { status: "resolved" as const, acceptedAllocation: clone(value) }
        : { status: "notFound" as const };
    },
    listUnrealizedAcceptedAllocations: () =>
      clone(authority.acceptedAllocations.filter((item) => item.realization === "unrealized")),
    exportProposalAuthority: () => clone(authority),
    replaceProposalAuthority: async (value: ProposalAuthorityV1) => {
      const checked = validateProposalAuthority(value);
      if (checked.status === "invalid") return { status: "invalid" as const };
      if (!(await persist(checked.authority))) return { status: "failure" as const };
      authority = checked.authority;
      desired = clone(authority);
      ingress = { status: "accepted" };
      durability = "durable";
      notify();
      return { status: "accepted" as const };
    },
    clearProposalAuthority: async () =>
      (await commit(emptyProposalAuthority(), undefined)).status === "accepted"
        ? { status: "removed" as const }
        : { status: "storageFailure" as const },
    getProposalIngressStatus: () => clone(ingress),
    getProposalDurabilityStatus: () => durability,
    retryProposalPersistence: async () => {
      const ok = await persist(desired);
      durability = ok ? "durable" : "storageFailure";
      return { status: ok ? ("durable" as const) : ("storageFailure" as const) };
    },
    subscribeProposals: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getProposalRuntimeAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return runtime;
    },
  };
}
function latestProposals(values: ConstructiveProposalV1[]) {
  const map = new Map<string, ConstructiveProposalV1>();
  for (const value of values)
    if (!map.has(value.id) || map.get(value.id)!.revision < value.revision)
      map.set(value.id, value);
  return [...map.values()].sort((a, b) => a.id.localeCompare(b.id));
}
function actionable(value: ConstructiveProposalV1) {
  return value.lifecycle === "generated" || value.lifecycle === "shown";
}
function recordCount(value: ProposalAuthorityV1) {
  return (
    value.proposals.length +
    value.candidates.length +
    value.decisions.length +
    value.acceptedAllocations.length
  );
}
function type(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as { recordType?: unknown }).recordType
    : undefined;
}
function acceptedProvenance() {
  return { version: 1, role: "acceptedAuthority", origin: { kind: "directAuthoring" } } as const;
}
function reject<T extends string>(reason: T) {
  return { status: "rejected" as const, reason };
}
function clone<T>(value: T): T {
  return structuredClone(value);
}
function randomId() {
  const value = globalThis.crypto?.randomUUID?.();
  if (!value) throw new Error("Identity allocation failed");
  return value;
}
export type ProposalSurface = ReturnType<typeof createProposalSurface>;
