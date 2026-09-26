import { createAcceptanceLifecycle } from "./acceptanceLifecycle.js";
import type { ProposalAuthorityV1 } from "../core/planning/proposal.js";
import type { ProposalSurface, createProposalSurface } from "./proposalSurface.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY } from "./dayFrameRuntimeAuthority.js";
import { createLazySurface } from "./lazySurface.js";

export function createLazyProposalSurface(
  options: Parameters<typeof createProposalSurface>[0],
): ProposalSurface {
  const lifecycle = options.lifecycle ?? createAcceptanceLifecycle();
  let installed = options.initialRuntime;
  let surface: ProposalSurface | undefined;
  let loading: Promise<ProposalSurface>;
  const load = () =>
    (loading ??= import("./proposalSurface.js").then((module) => {
      surface = module.createProposalSurface({
        ...options,
        lifecycle,
        ...(installed === undefined
          ? {}
          : {
              initialRuntime: installed as NonNullable<
                Parameters<typeof createProposalSurface>[0]["initialRuntime"]
              >,
            }),
      });
      return surface;
    }));
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
    listActionableProposals: () => {
      if (surface) return surface.listActionableProposals();
      const latest = new Map<string, ProposalAuthorityV1["proposals"][number]>();
      for (const value of installed?.authority.proposals ?? [])
        if (!latest.has(value.id) || latest.get(value.id)!.revision < value.revision)
          latest.set(value.id, value);
      return structuredClone(
        [...latest.values()]
          .sort((a, b) => a.id.localeCompare(b.id))
          .filter((value) => value.lifecycle === "generated" || value.lifecycle === "shown"),
      );
    },
    listProposalHistory: (limit = 100) =>
      surface?.listProposalHistory(limit) ??
      structuredClone(
        (installed?.authority.proposals ?? [])
          .slice()
          .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
          .slice(0, Math.max(0, limit)),
      ),
    listUnrealizedAcceptedAllocations: () =>
      surface?.listUnrealizedAcceptedAllocations() ??
      structuredClone(
        (installed?.authority.acceptedAllocations ?? []).filter(
          (item) => item.realization === "unrealized",
        ),
      ),
    // Realization consumes this lookup synchronously after proposal bootstrap.
    resolveAcceptedAllocation: (id: string) => {
      if (surface) return surface.resolveAcceptedAllocation(id);
      const value = installed?.authority.acceptedAllocations.find((item) => item.id === id);
      return value
        ? { status: "resolved", acceptedAllocation: structuredClone(value) }
        : { status: "notFound" };
    },
    exportProposalAuthority: () =>
      surface?.exportProposalAuthority() ??
      structuredClone(installed?.authority ?? emptyProposalAuthority()),
    getProposalIngressStatus: () =>
      surface?.getProposalIngressStatus() ??
      structuredClone(installed?.ingress ?? { status: "initializing" }),
    getProposalDurabilityStatus: () =>
      surface?.getProposalDurabilityStatus() ?? installed?.durability ?? "unknown",
  };
  const keys = [
    "getProposalReviewEvidence",
    "getProposalLifecycle",
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
    "getProposalProtectionEvidence",
    "getProposalRuntimeAdapter",
    "clearProposalForCoordinator",
  ];
  const dispatch = Object.fromEntries(
    [
      "initializeProposals",
      "recordProposal",
      "markProposalShown",
      "supersedeProposal",
      "createModificationCandidate",
      "acceptProposalOption",
      "modifyAndAcceptCandidate",
      "rejectOption",
      "rejectProposal",
      "retryProposalPersistence",
      "replaceProposalAuthority",
      "clearProposalAuthority",
    ].map((key) => [
      key,
      (...args: unknown[]) => {
        const origin = lifecycle.origin(),
          input = structuredClone(args);
        const invoke = (owner: ProposalSurface) =>
          lifecycle.enter(origin, () =>
            (owner[key as keyof ProposalSurface] as (...values: unknown[]) => unknown)(...input),
          );
        return surface ? invoke(surface) : load().then(invoke);
      },
    ]),
  );
  return createLazySurface(keys, load, {
    ...sync,
    getProposalReviewEvidence: () =>
      surface?.getProposalReviewEvidence() ?? {
        observation: lifecycle.observation,
        provenPriorCommit:
          installed?.ingress.status === "accepted" && installed?.durability === "durable",
        protectionCause: undefined,
        active: !lifecycle.isQuiescent(),
      },
    ...dispatch,
    getProposalLifecycle: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return lifecycle;
    },
    subscribeProposals: (listener: () => void) => lifecycle.observation.subscribe(listener),
    getProposalProtectionEvidence: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return surface?.getProposalProtectionEvidence(capability);
    },
    getProposalRuntimeAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return {
        id: "proposals" as const,
        captureRuntimeSnapshot: () =>
          surface?.getProposalRuntimeAdapter(capability).captureRuntimeSnapshot() ??
          installed ?? {
            authority: emptyProposalAuthority(),
            desired: emptyProposalAuthority(),
            ingress: { status: "initializing" as const },
            durability: "unknown" as const,
          },
        installRuntimeExact: (value: never) => {
          lifecycle.assertInstall();
          lifecycle.invalidate();
          installed = structuredClone(value);
          surface?.getProposalRuntimeAdapter(capability).installRuntimeExact(value);
          lifecycle.observation.changed();
        },
      };
    },
  });
}

export type { ProposalAuthorityV1 };
