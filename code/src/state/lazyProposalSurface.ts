import type { ProposalAuthorityV1 } from "../core/planning/proposal.js";
import type { ProposalSurface, createProposalSurface } from "./proposalSurface.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY } from "./dayFrameRuntimeAuthority.js";
import { createLazySurface } from "./lazySurface.js";

export function createLazyProposalSurface(
  options: Parameters<typeof createProposalSurface>[0],
): ProposalSurface {
  let surface: ProposalSurface | undefined;
  let loading: Promise<ProposalSurface>;
  const load = () =>
    (loading ??= import("./proposalSurface.js").then(
      (module) => (surface = module.createProposalSurface(options)),
    ));
  const emptyProposalAuthority = (): ProposalAuthorityV1 => ({
    version: 1,
    proposals: [],
    candidates: [],
    decisions: [],
    acceptedAllocations: [],
  });
  const sync: Record<string, (...args: never[]) => unknown> = {
    deriveProposal: (...args) =>
      surface && (surface.deriveProposal as (...values: never[]) => unknown)(...args),
    evaluateProposalFreshness: (...args) =>
      surface && (surface.evaluateProposalFreshness as (...values: never[]) => unknown)(...args),
    listActionableProposals: () => surface?.listActionableProposals() ?? [],
    listProposalHistory: (...args) => surface?.listProposalHistory(...args) ?? [],
    listUnrealizedAcceptedAllocations: () => surface?.listUnrealizedAcceptedAllocations() ?? [],
    exportProposalAuthority: () => surface?.exportProposalAuthority() ?? emptyProposalAuthority(),
    getProposalIngressStatus: () =>
      surface?.getProposalIngressStatus() ?? { status: "initializing" },
    getProposalDurabilityStatus: () => surface?.getProposalDurabilityStatus() ?? "unknown",
  };
  const keys = [
    "initializeProposals",
    "deriveProposal",
    "recordProposal",
    "markProposalShown",
    "supersedeProposal",
    "createModificationCandidate",
    "acceptProposalOption",
    "modifyAndAcceptCandidate",
    "rejectOption",
    "rejectProposal",
    "evaluateProposalFreshness",
    "resolveProposalRevision",
    "listActionableProposals",
    "listProposalHistory",
    "resolveAcceptedAllocation",
    "listUnrealizedAcceptedAllocations",
    "exportProposalAuthority",
    "replaceProposalAuthority",
    "clearProposalAuthority",
    "getProposalIngressStatus",
    "getProposalDurabilityStatus",
    "retryProposalPersistence",
    "subscribeProposals",
    "getProposalRuntimeAdapter",
  ];
  return createLazySurface(keys, load, {
    ...sync,
    subscribeProposals: (listener: () => void) =>
      surface?.subscribeProposals(listener) ?? (() => undefined),
    getProposalRuntimeAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return {
        id: "proposals" as const,
        captureRuntimeSnapshot: () =>
          surface?.getProposalRuntimeAdapter(capability).captureRuntimeSnapshot() ?? {
            authority: emptyProposalAuthority(),
            desired: emptyProposalAuthority(),
            ingress: { status: "initializing" as const },
            durability: "unknown" as const,
          },
        installRuntimeExact: (value: never) =>
          surface?.getProposalRuntimeAdapter(capability).installRuntimeExact(value),
      };
    },
  });
}

export type { ProposalAuthorityV1 };
