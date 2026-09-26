import {
  createAcceptanceLifecycle,
  type AcceptanceLifecycle,
  type AcceptanceOrigin,
} from "./acceptanceLifecycle.js";
import {
  persistAcceptanceMutation,
  exactAuthorityRows,
  captureAcceptanceProtectionEvidence,
  type AcceptanceProtectionEvidence,
} from "./acceptancePersistence.js";
import type { RealizationCommandResultV1 } from "../core/planning/acceptedAllocationRealization.js";
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
export type ProposalRuntimeSnapshot = {
  authority: ProposalAuthorityV1;
  desired: ProposalAuthorityV1;
  ingress: Ingress;
  durability: Durability;
};
export type ProposalCommand<T> =
  | { status: "unconfirmed"; reason: "commitStateUncertain" | "verificationFailedAfterCommit" }
  | { status: "accepted"; value: T; persistence: "durable" | "pending" }
  | {
      status: "rejected";
      reason:
        | "proposalBusy"
        | "contextReplaced"
        | "sourceChanged"
        | "authorityUnavailable"
        | "authorityProtected"
        | "replacementBusy"
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
  lifecycle?: AcceptanceLifecycle;
  initialRuntime?: ProposalRuntimeSnapshot;
  sourceWitness?: () => string;
  now?: () => string;
  allocateId?: () => string;
  canMutate?: () => boolean;
  notificationScheduler?: DayFrameNotificationScheduler;
  onAuthorityChanged?: () => void;
  onAcceptedAllocation?: (
    acceptedAllocationId: string,
    origin: AcceptanceOrigin,
  ) => Promise<RealizationCommandResultV1>;
  qualifyFoundation?: (
    input: Parameters<typeof deriveOrdinaryProposal>[0],
  ) => "known" | "unknown" | "stale";
  revalidate?: (
    proposal: ConstructiveProposalV1,
    acceptanceInstant: string,
  ) => Promise<ProposalGenerationResultV1> | ProposalGenerationResultV1;
}) {
  const lifecycle = options.lifecycle ?? createAcceptanceLifecycle();
  const source = () => options.sourceWitness?.() ?? "";
  const now = options.now ?? (() => new Date().toISOString()),
    allocate = options.allocateId ?? randomId;
  let authority = clone(options.initialRuntime?.authority ?? emptyProposalAuthority()),
    desired = clone(options.initialRuntime?.desired ?? authority),
    ingress: Ingress = clone(options.initialRuntime?.ingress ?? { status: "initializing" }),
    durability: Durability = options.initialRuntime?.durability ?? "unknown";
  let provenPriorCommit = ingress.status === "accepted" && durability === "durable";
  let protectionCause: "commitUnconfirmed" | "verificationFailed" | undefined;
  let desiredWitness: string | undefined;
  let protectionEvidence: AcceptanceProtectionEvidence | undefined;
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
      lifecycle.assertInstall();
      lifecycle.invalidate();
      protectionEvidence = undefined;
      lifecycle.supersedeDesired();
      authority = clone(value.authority);
      desired = clone(value.desired);
      desiredWitness = undefined;
      ingress = clone(value.ingress);
      durability = value.durability;
      provenPriorCommit = ingress.status === "accepted" && durability === "durable";
      protectionCause = undefined;
      notify();
    },
  };

  async function initializeProposals() {
    if (ingress.status === "protected") return { status: "protected" as const };
    const origin = lifecycle.origin();
    const base = authority,
      previousIngress = ingress;
    if (!lifecycle.isQuiescent()) return { status: "busy" as const };
    const loaded = await options.storage.getAll<unknown>(STORE);
    if (
      !lifecycle.current(origin) ||
      authority !== base ||
      ingress !== previousIngress ||
      !lifecycle.isQuiescent()
    )
      return { status: "contextReplaced" as const };
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
    provenPriorCommit = true;
    notify();
    return { status: "ready" as const };
  }
  function deriveProposal(input: Parameters<typeof deriveOrdinaryProposal>[0]) {
    const qualification = options.qualifyFoundation?.(input);
    return deriveOrdinaryProposal(
      qualification && qualification !== "known"
        ? { ...input, inputQualification: qualification }
        : input,
    );
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
    return transitionLifecycle(id, revision, "shown");
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
  async function transitionLifecycle(
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
    input = clone(input);
    const origin = lifecycle.origin();
    const finish = <T extends object>(value: T) => lifecycle.result(value, origin);
    if (!lifecycle.current(origin)) return finish(reject("contextReplaced"));
    if (!lifecycle.isQuiescent()) return finish(reject("proposalBusy"));
    const blocked = mutationBlocked();
    if (blocked) return blocked;
    const proposal = exactProposal(input.proposalId, input.proposalRevision);
    if (!proposal) return reject("notFound");
    if (!actionable(proposal) || rejectedOption(proposal, input.optionId))
      return reject("notActionable");
    const witness = source();
    const at = now();
    const revalidated = options.revalidate
      ? await options.revalidate(clone(proposal), at)
      : input.current;
    if (!lifecycle.current(origin)) return finish(reject("contextReplaced"));
    const afterRead = mutationBlocked();
    if (afterRead) return finish(afterRead);
    if (source() !== witness) return finish(reject("sourceChanged"));
    const denial = lifecycle.acquire(origin);
    if (denial) return finish(reject(denial === "busy" ? "proposalBusy" : denial));
    let committed;
    try {
      if (exactProposal(input.proposalId, input.proposalRevision) !== proposal)
        return reject("notActionable");
      if (!revalidated || evaluateProposalFreshness(proposal, revalidated).status !== "current")
        return await staleProposal(proposal);
      const currentProposal = revalidated.status === "proposed" ? revalidated.proposal : undefined,
        currentOption = currentProposal?.options.find((value) => value.id === input.optionId),
        option = candidate?.finalOption ?? currentOption;
      if (!currentOption || !option) return reject("stale");
      if (
        authority.acceptedAllocations.some((accepted) =>
          claimsConflict(accepted.claims, option.claims),
        )
      )
        return await staleProposal(proposal, "conflictingClaim");
      let decisionId: string, acceptedId: string;
      try {
        decisionId = allocate();
        acceptedId = allocate();
      } catch {
        return reject("allocationFailure");
      }
      const decision: ProposalDecisionV1 = {
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
      committed = await commit(next, { decision, acceptedAllocation });
    } finally {
      lifecycle.release(origin);
    }
    if (committed.status !== "accepted" || !options.onAcceptedAllocation) return finish(committed);
    const realization = await options.onAcceptedAllocation(
      committed.value.acceptedAllocation.id,
      origin,
    );
    return finish({
      status: "accepted" as const,
      persistence: committed.persistence,
      value: {
        decision: committed.value.decision,
        acceptedAllocation: committed.value.acceptedAllocation,
        realization,
      },
    });
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
  async function commit<T>(next: ProposalAuthorityV1, value: T): Promise<ProposalCommand<T>> {
    const origin = lifecycle.active();
    if (!origin || !lifecycle.owns(origin)) return reject("contextReplaced");
    const checked = validateProposalAuthority(next);
    if (checked.status === "invalid") return reject("invalidInput");
    const base = authority,
      witness = source();
    lifecycle.supersedeDesired();
    desired = checked.authority;
    desiredWitness = witness;
    const intended = desired;
    let sourceChanged = false;
    const persisted = await persist(intended, () => {
      sourceChanged = source() !== witness;
      return (
        lifecycle.owns(origin) &&
        !lifecycle.admission() &&
        !mutationBlocked() &&
        authority === base &&
        desired === intended &&
        !sourceChanged
      );
    });
    if (persisted === "notWritten") {
      durability = "storageFailure";
      return reject(sourceChanged ? "sourceChanged" : "persistenceFailure");
    }
    if (persisted === "uncertain") {
      protect("readFailure", "commitUnconfirmed");
      protectionEvidence = await captureAcceptanceProtectionEvidence(
        options.storage,
        STORE,
        intended,
      );
      return { status: "unconfirmed", reason: "commitStateUncertain" };
    }
    if (
      !(await verify(intended)) ||
      authority !== base ||
      desired !== intended ||
      !lifecycle.current(origin)
    ) {
      protect("invalidAuthority", "verificationFailed");
      protectionEvidence = await captureAcceptanceProtectionEvidence(
        options.storage,
        STORE,
        intended,
      );
      return { status: "unconfirmed", reason: "verificationFailedAfterCommit" };
    }
    authority = checked.authority;
    durability = "durable";
    provenPriorCommit = true;
    try {
      options.onAuthorityChanged?.();
      notify();
    } catch {
      protect("invalidAuthority");
      protectionEvidence = await captureAcceptanceProtectionEvidence(
        options.storage,
        STORE,
        intended,
      );
      return { status: "unconfirmed", reason: "verificationFailedAfterCommit" };
    }
    return accepted(value);
  }
  function deliver<A extends unknown[], T extends object>(run: (...args: A) => Promise<T>) {
    return async (...args: A) => {
      const origin = lifecycle.origin(),
        input = clone(args);
      if (!lifecycle.current(origin)) return lifecycle.result(reject("contextReplaced"), origin);
      if (!lifecycle.isQuiescent()) return lifecycle.result(reject("proposalBusy"), origin);
      const value = await lifecycle.enter(origin, () => run(...input));
      return Object.hasOwn(value, "receipt") ? value : lifecycle.result(value, origin);
    };
  }
  function write<A extends unknown[], T extends object>(run: (...args: A) => Promise<T>) {
    return async (...args: A) => {
      const input = clone(args),
        origin = lifecycle.origin();
      const finish = <R extends object>(value: R) => lifecycle.result(value, origin);
      const denied = lifecycle.acquire(origin);
      if (denied) return finish(reject(denied === "busy" ? "proposalBusy" : denied));
      try {
        const blocked = mutationBlocked();
        return finish(blocked ?? (await run(...input)));
      } finally {
        lifecycle.release(origin);
      }
    };
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
  function records(value: ProposalAuthorityV1) {
    return [
      ...value.proposals,
      ...value.candidates,
      ...value.decisions,
      ...value.acceptedAllocations,
    ];
  }
  async function persist(value: ProposalAuthorityV1, admit: () => boolean) {
    return persistAcceptanceMutation(
      options.storage,
      [
        { type: "clear", store: STORE },
        ...records(value).map((value) => ({ type: "put" as const, store: STORE, value })),
      ],
      admit,
    );
  }
  async function verify(value: ProposalAuthorityV1) {
    try {
      const read = await options.storage.getAll<unknown>(STORE);
      return read.status === "success" && exactAuthorityRows(read.value, records(value));
    } catch {
      return false;
    }
  }
  async function replace(value: ProposalAuthorityV1, epoch?: number) {
    if (epoch !== undefined && !lifecycle.coordinatorCurrent(epoch))
      return { status: "failure" as const };
    const checked = validateProposalAuthority(clone(value));
    if (checked.status === "invalid") return { status: "invalid" as const };
    const persisted = await persist(
      checked.authority,
      () => epoch === undefined || lifecycle.coordinatorCurrent(epoch),
    );
    if (persisted === "notWritten") return { status: "failure" as const };
    if (persisted !== "committed" || !(await verify(checked.authority))) {
      protect("invalidAuthority");
      return { status: "failure" as const };
    }
    lifecycle.invalidate();
    authority = checked.authority;
    desired = clone(authority);
    ingress = { status: "accepted" };
    durability = "durable";
    provenPriorCommit = true;
    notify();
    return { status: "accepted" as const };
  }
  function mutationBlocked() {
    if (ingress.status === "initializing") return reject("initializing");
    if (ingress.status === "protected") return reject("protected");
    if (options.canMutate && !options.canMutate()) return reject("authorityTransactionActive");
  }
  function accepted<T>(value: T): ProposalCommand<T> {
    return {
      status: "accepted",
      value: clone(value),
      persistence: durability === "durable" ? "durable" : "pending",
    };
  }
  function protect(reason: "readFailure" | "invalidAuthority", cause?: typeof protectionCause) {
    protectionCause = cause;
    provenPriorCommit = false;
    ingress = { status: "protected", reason };
    durability = "storageFailure";
    lifecycle.observation.changed();
    return { status: "protected" as const };
  }
  function notify() {
    lifecycle.observation.changed();
    const origin = lifecycle.capture(),
      installed = authority,
      protection = ingress;
    const emit = () => {
      if (lifecycle.current(origin) && authority === installed && ingress === protection)
        listeners.forEach((listener) => listener());
    };
    if (options.notificationScheduler) options.notificationScheduler.notify("proposals", emit);
    else emit();
  }
  return {
    getProposalProtectionEvidence: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return structuredClone(protectionEvidence);
    },
    getProposalLifecycle: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return lifecycle;
    },
    initializeProposals,
    deriveProposal,
    recordProposal: write(recordProposal),
    markProposalShown: write(markProposalShown),
    supersedeProposal: write(supersedeProposal),
    createModificationCandidate: write(createModificationCandidate),
    acceptProposalOption: deliver(acceptProposalOption),
    modifyAndAcceptCandidate: deliver(modifyAndAcceptCandidate),
    rejectOption: write(rejectOption),
    rejectProposal: write(rejectProposal),
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
    replaceProposalAuthority: (value: ProposalAuthorityV1) => {
      const frozen = clone(value);
      return !lifecycle.current(lifecycle.origin()) || ingress.status === "protected"
        ? Promise.resolve({ status: "failure" as const })
        : lifecycle.replace((epoch) => replace(frozen, epoch));
    },
    clearProposalAuthority: async () => {
      const result =
        !lifecycle.current(lifecycle.origin()) || ingress.status === "protected"
          ? { status: "failure" }
          : await lifecycle.replace((epoch) => replace(emptyProposalAuthority(), epoch));
      return result.status === "accepted"
        ? { status: "removed" as const }
        : { status: "storageFailure" as const };
    },
    clearProposalForCoordinator: async (
      capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
      epoch: number,
    ) => {
      if (
        capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY ||
        !lifecycle.coordinatorCurrent(epoch)
      )
        return { status: "storageFailure" as const };
      const result = await replace(emptyProposalAuthority(), epoch);
      return result.status === "accepted"
        ? { status: "removed" as const }
        : { status: "storageFailure" as const };
    },
    getProposalReviewEvidence: () => ({
      observation: lifecycle.observation,
      provenPriorCommit,
      protectionCause,
      active: !lifecycle.isQuiescent(),
    }),
    getProposalIngressStatus: () => clone(ingress),
    getProposalDurabilityStatus: () => durability,
    retryProposalPersistence: write(async () => {
      const origin = lifecycle.active()!;
      if (origin.desiredVersion !== lifecycle.desiredVersion()) return reject("contextReplaced");
      const intended = desired;
      if (desiredWitness !== undefined && source() !== desiredWitness)
        return reject("sourceChanged");
      const result = await commit(intended, undefined);
      return result.status === "accepted" ? { status: "durable" as const } : result;
    }),
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
