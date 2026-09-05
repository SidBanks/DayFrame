import type { AllocationAlternativeV1, AllocationResultV1 } from "./allocation.js";
import { capacityFingerprint } from "./capacityFingerprint.js";
import type { PlanningProvenanceV1 } from "./planningFoundation.js";
import type {
  ProjectedResourceClaimV1,
  ProjectedResourceFootprintV1,
} from "./demandResourceFootprint.js";
import type { ProposalHorizonV1 } from "./planningScope.js";
export type { ProposalHorizonV1 } from "./planningScope.js";

export const PROPOSAL_POLICY_V1 = {
  id: "constructive-proposal",
  version: 1,
  maximumOptions: 32,
  expiry: "dependency-or-horizon",
} as const;
export type ProposalLifecycleV1 =
  | "generated"
  | "shown"
  | "accepted"
  | "rejected"
  | "ignored"
  | "stale"
  | "expired"
  | "superseded"
  | "inapplicable";
export type ProposalClaimV1 = ProjectedResourceClaimV1;
export type ProposalScopeV1 = {
  context: { kind: "ordinary" };
  horizon: ProposalHorizonV1;
  acceptance: "oneOff";
  bundle: "independent" | "atomic";
  demandProjectionIds: string[];
  goalIds: string[];
  userDayDates: string[];
  capacityClaims: ProposalClaimV1[];
};
export type ProposalOptionV1 = {
  id: string;
  sourceAllocationId: string;
  sourceAlternativeId: string;
  rank: number;
  preferred: boolean;
  scope: ProposalScopeV1;
  productiveMinutes: number;
  supportMinutes: number;
  bufferMinutes: number;
  totalResourceMinutes: number;
  nominalResourceMinutes: number;
  resourceFootprints: ProjectedResourceFootprintV1[];
  assignments: AllocationAlternativeV1["assignments"];
  claims: ProposalClaimV1[];
  qualification: "fullyQualified" | "qualified";
  reasons: Array<{ code: "allocationPreferred" | "allocationAlternative" }>;
  assumptions: Array<{ code: "supportAndBufferNotRequired" }>;
  tradeoffs: Array<{ code: "unmetDemand"; demandProjectionId: string; minutes: number }>;
  exclusions: Array<{ code: "unallocatedCapacity"; minutes: number }>;
  rankingEvidence: { allocationRank: number; allocationAlternativeId: string };
  provenance: PlanningProvenanceV1;
};
export type ConstructiveProposalV1 = {
  recordType: "proposal";
  version: 1;
  id: string;
  revision: number;
  generatedAt: string;
  evaluationCutoff: string;
  lifecycle: ProposalLifecycleV1;
  context: { kind: "ordinary" };
  horizon: ProposalHorizonV1;
  scope: ProposalScopeV1;
  sourceAllocationId: string;
  sourceCompetingSetId: string;
  sourceAllocationDependencyFingerprint: string;
  capacityFingerprint: string;
  inputFingerprint: string;
  policy: typeof PROPOSAL_POLICY_V1;
  options: ProposalOptionV1[];
  preferredOptionId: string;
  predecessor?: { id: string; revision: number };
  successor?: {
    id: string;
    revision: number;
    reason: "regenerated" | "dependencyChanged" | "competingAcceptance";
  };
  qualification: "fullyQualified" | "qualified";
  reasons: Array<{ code: "allocationRecommendation" }>;
  provenance: PlanningProvenanceV1;
};
export type NoProposalV1 = {
  recordType: "noProposal";
  version: 1;
  id: string;
  generatedAt: string;
  evaluationCutoff?: string;
  context: { kind: "ordinary" };
  horizon: ProposalHorizonV1;
  inputFingerprint: string;
  policy: typeof PROPOSAL_POLICY_V1;
  reasons: Array<{
    code:
      | "noCapacity"
      | "noUnmetDemand"
      | "allSatisfied"
      | "noMinimumFit"
      | "compositionInfeasible"
      | "structurallyBlocked"
      | "policyAbstained"
      | "incompleteInput";
  }>;
  provenance: PlanningProvenanceV1;
};
export type ProposalGenerationResultV1 =
  | { status: "proposed"; proposal: ConstructiveProposalV1 }
  | { status: "noProposal"; result: NoProposalV1 }
  | {
      status: "invalid";
      reasons: Array<{ code: "invalidHorizon" | "horizonOutsideAllocation" | "invalidAllocation" }>;
    };
export type ProposalModificationDeltaV1 = {
  claims: ProposalClaimV1[];
};
export type ProposalModificationCandidateV1 = {
  recordType: "proposalModificationCandidate";
  version: 1;
  revision: 1;
  id: string;
  sourceProposalId: string;
  sourceProposalRevision: number;
  sourceOptionId: string;
  createdAt: string;
  actor: { kind: "user" };
  delta: ProposalModificationDeltaV1;
  validation: "pending" | "valid" | "invalid";
  finalOption?: ProposalOptionV1;
  reasons: Array<{ code: "withinScope" | "outOfScope" | "overlappingClaim" | "invalidDuration" }>;
  provenance: PlanningProvenanceV1;
};
export type ProposalDecisionV1 = {
  recordType: "proposalDecision";
  version: 1;
  revision: 1;
  id: string;
  proposalId: string;
  proposalRevision: number;
  optionId?: string;
  candidateId?: string;
  decision: "accept" | "modifyAndAccept" | "rejectOption" | "rejectProposal";
  decidedAt: string;
  actor: { kind: "user" };
  acceptedScope?: ProposalScopeV1;
  decisiveFingerprint: string;
  provenance: PlanningProvenanceV1;
};
export type AcceptedAllocationV1 = {
  recordType: "acceptedAllocation";
  version: 1;
  revision: 1;
  id: string;
  decisionId: string;
  proposalId: string;
  proposalRevision: number;
  sourceOptionId: string;
  sourceCandidateId?: string;
  acceptedAt: string;
  actor: { kind: "user" };
  scope: ProposalScopeV1;
  productiveMinutes: number;
  supportMinutes: number;
  bufferMinutes: number;
  totalResourceMinutes: number;
  claims: ProposalClaimV1[];
  assignments: AllocationAlternativeV1["assignments"];
  decisiveSnapshot: {
    proposalInputFingerprint: string;
    sourceAllocationId: string;
    sourceAllocationDependencyFingerprint: string;
    capacityFingerprint: string;
    option: ProposalOptionV1;
  };
  realization: "unrealized";
  footprintCompleteness?: "legacyProductiveOnly";
  provenance: PlanningProvenanceV1;
};
export type AcceptedAllocationV2 = Omit<
  AcceptedAllocationV1,
  | "version"
  | "claims"
  | "productiveMinutes"
  | "supportMinutes"
  | "bufferMinutes"
  | "totalResourceMinutes"
  | "footprintCompleteness"
> & {
  version: 2;
  footprintCompleteness: "complete";
  claims: ProjectedResourceClaimV1[];
  resourceFootprints: ProjectedResourceFootprintV1[];
  productiveMinutes: number;
  supportMinutes: number;
  bufferMinutes: number;
  nominalResourceMinutes: number;
  totalResourceMinutes: number;
};
export type ProposalAuthorityV1 = {
  version: 1;
  proposals: ConstructiveProposalV1[];
  candidates: ProposalModificationCandidateV1[];
  decisions: ProposalDecisionV1[];
  acceptedAllocations: Array<AcceptedAllocationV1 | AcceptedAllocationV2>;
};

export function emptyProposalAuthority(): ProposalAuthorityV1 {
  return { version: 1, proposals: [], candidates: [], decisions: [], acceptedAllocations: [] };
}

export function deriveOrdinaryProposal(input: {
  allocation: AllocationResultV1;
  horizon: ProposalHorizonV1;
  generatedAt: string;
  evaluationCutoff?: string;
  inputQualification?: "known" | "unknown" | "stale" | "inapplicable" | "notRequired";
  abstainReason?: NoProposalV1["reasons"][number]["code"];
  allocationHorizon: ProposalHorizonV1;
  planningDataHorizon?: ProposalHorizonV1;
  predecessor?: Pick<ConstructiveProposalV1, "id" | "revision">;
}): ProposalGenerationResultV1 {
  if (!validHorizon(input.horizon))
    return { status: "invalid", reasons: [{ code: "invalidHorizon" }] };
  if (!contains(input.allocationHorizon, input.horizon))
    return { status: "invalid", reasons: [{ code: "horizonOutsideAllocation" }] };
  const planningDataHorizon = input.planningDataHorizon ?? input.allocationHorizon;
  if (!validHorizon(planningDataHorizon) || !contains(planningDataHorizon, input.horizon))
    return { status: "invalid", reasons: [{ code: "horizonOutsideAllocation" }] };
  const inputFingerprint = proposalDependencyFingerprint(input.allocation, input.horizon, {
    qualification: input.inputQualification,
    abstainReason: input.abstainReason,
  });
  if (input.abstainReason) return noProposal(input, inputFingerprint, input.abstainReason);
  if (input.inputQualification === "unknown" || input.inputQualification === "stale")
    return noProposal(input, inputFingerprint, "incompleteInput");
  if (input.inputQualification === "inapplicable")
    return noProposal(input, inputFingerprint, "structurallyBlocked");
  if (input.allocation.freshness !== "current")
    return noProposal(input, inputFingerprint, "incompleteInput");
  const alternatives = input.allocation.alternatives
    .filter((alternative) =>
      alternative.assignments
        .flatMap((value) => value.partitions)
        .every(
          (claim) =>
            input.horizon.startUserDayDate <= claim.userDayDate &&
            claim.userDayDate < input.horizon.endUserDayDateExclusive,
        ),
    )
    .sort((left, right) => {
      const preferred =
        Number(right.id === input.allocation.preferredAlternativeId) -
        Number(left.id === input.allocation.preferredAlternativeId);
      return preferred || left.id.localeCompare(right.id);
    })
    .slice(0, PROPOSAL_POLICY_V1.maximumOptions);
  const footprintCoveredAlternatives = alternatives.filter((alternative) =>
    alternative.resourceClaims.every(
      (claim) =>
        planningDataHorizon.startUserDayDate <= claim.userDayDate &&
        claim.userDayDate < planningDataHorizon.endUserDayDateExclusive,
    ),
  );
  if (!alternatives.length) return noProposal(input, inputFingerprint, "noMinimumFit");
  if (!footprintCoveredAlternatives.length)
    return noProposal(input, inputFingerprint, "incompleteInput");
  if (
    alternatives.every((alternative) =>
      alternative.assignments.every((assignment) => assignment.remainingRequestedMinutes === 0),
    )
  )
    return noProposal(input, inputFingerprint, "allSatisfied");
  const options = footprintCoveredAlternatives.map((alternative, index) =>
    option(
      alternative,
      input.allocation.id,
      input.horizon,
      index,
      input.allocation.preferredAlternativeId,
    ),
  );
  if (!options.some((value) => value.productiveMinutes > 0))
    return noProposal(input, inputFingerprint, "noCapacity");
  const proposalSemantic = {
    policy: PROPOSAL_POLICY_V1,
    context: "ordinary",
    horizon: input.horizon,
    allocation: input.allocation.id,
    inputFingerprint,
    options: options.map((value) => value.id),
    predecessor: input.predecessor,
  };
  const id = capacityFingerprint(proposalSemantic);
  const scope = mergeScopes(
    options.map((value) => value.scope),
    input.horizon,
  );
  return {
    status: "proposed",
    proposal: {
      recordType: "proposal",
      version: 1,
      id,
      revision: 1,
      generatedAt: input.generatedAt,
      evaluationCutoff: input.evaluationCutoff ?? input.generatedAt,
      lifecycle: "generated",
      context: { kind: "ordinary" },
      horizon: clone(input.horizon),
      scope,
      sourceAllocationId: input.allocation.id,
      sourceCompetingSetId: input.allocation.competingSetId,
      sourceAllocationDependencyFingerprint: input.allocation.dependencyFingerprint,
      capacityFingerprint: input.allocation.capacityFingerprint,
      inputFingerprint,
      policy: PROPOSAL_POLICY_V1,
      options,
      preferredOptionId: options.find((value) => value.preferred)?.id ?? options[0]!.id,
      ...(input.predecessor ? { predecessor: clone(input.predecessor) } : {}),
      qualification: options.every((value) => value.qualification === "fullyQualified")
        ? "fullyQualified"
        : "qualified",
      reasons: [{ code: "allocationRecommendation" }],
      provenance: proposed(),
    },
  };
}

export function proposalDependencyFingerprint(
  allocation: AllocationResultV1,
  horizon: ProposalHorizonV1,
  qualification?: unknown,
) {
  return capacityFingerprint({
    proposalPolicy: PROPOSAL_POLICY_V1,
    allocationPolicy: allocation.policy,
    allocationId: allocation.id,
    allocationDependency: allocation.dependencyFingerprint,
    capacity: allocation.capacityFingerprint,
    horizon,
    qualification,
  });
}

export function evaluateProposalFreshness(
  proposal: ConstructiveProposalV1,
  current: ProposalGenerationResultV1,
) {
  return current.status === "proposed" &&
    current.proposal.inputFingerprint === proposal.inputFingerprint &&
    current.proposal.options.some((value) => value.id === proposal.preferredOptionId)
    ? { status: "current" as const }
    : { status: "stale" as const, reasons: [{ code: "dependencyMismatch" as const }] };
}

export function createModificationCandidate(input: {
  proposal: ConstructiveProposalV1;
  optionId: string;
  delta: ProposalModificationDeltaV1;
  createdAt: string;
}): ProposalModificationCandidateV1 | undefined {
  const source = input.proposal.options.find((value) => value.id === input.optionId);
  if (!source) return undefined;
  const claims = normalizedClaims(input.delta.claims),
    withinScope = claims.every((claim) =>
      source.scope.capacityClaims.some((allowed) => sameClaim(claim, allowed)),
    ),
    nonoverlapping = claims.every(
      (claim, index) =>
        !claims
          .slice(index + 1)
          .some(
            (other) =>
              !(claim.role === "bufferProtection" && other.role === "bufferProtection") &&
              overlap(claim, other),
          ),
    ),
    durations = claims.every(
      (claim) => claim.durationMinutes > 0 && duration(claim) === claim.durationMinutes,
    ),
    preservesRequired = source.claims
      .filter((claim) => claim.requiredness === "required")
      .every((claim) => claims.some((selected) => sameClaim(claim, selected))),
    valid = withinScope && nonoverlapping && durations && preservesRequired,
    finalOption = valid ? modifiedOption(source, claims) : undefined;
  const semantic = {
    proposal: input.proposal.id,
    revision: input.proposal.revision,
    option: source.id,
    claims,
  };
  return {
    recordType: "proposalModificationCandidate",
    version: 1,
    revision: 1,
    id: capacityFingerprint(semantic),
    sourceProposalId: input.proposal.id,
    sourceProposalRevision: input.proposal.revision,
    sourceOptionId: source.id,
    createdAt: input.createdAt,
    actor: { kind: "user" },
    delta: { claims },
    validation: valid ? "valid" : "invalid",
    ...(finalOption ? { finalOption } : {}),
    reasons: [
      {
        code: !withinScope
          ? "outOfScope"
          : !nonoverlapping
            ? "overlappingClaim"
            : !durations
              ? "invalidDuration"
              : "withinScope",
      },
    ],
    provenance: authored(),
  };
}

export function validateProposalAuthority(
  value: unknown,
): { status: "valid"; authority: ProposalAuthorityV1 } | { status: "invalid"; issues: string[] } {
  if (
    !record(value) ||
    value.version !== 1 ||
    !arrays(value, ["proposals", "candidates", "decisions", "acceptedAllocations"])
  )
    return { status: "invalid", issues: ["invalidAuthority"] };
  const authority = clone(value) as ProposalAuthorityV1;
  const proposals = new Map(
    authority.proposals
      .filter(record)
      .map((item) => [`${item.id}|${item.revision}`, item as ConstructiveProposalV1]),
  );
  if (
    proposals.size !== authority.proposals.length ||
    authority.proposals.some((item) => !record(item) || !validProposal(item))
  )
    return { status: "invalid", issues: ["invalidProposal"] };
  if (
    authority.candidates.some(
      (item) =>
        !record(item) || !proposals.has(`${item.sourceProposalId}|${item.sourceProposalRevision}`),
    )
  )
    return { status: "invalid", issues: ["missingCandidateProposal"] };
  const decisions = new Map<string, ProposalDecisionV1>();
  for (const decision of authority.decisions) {
    if (!record(decision)) return { status: "invalid", issues: ["invalidDecisionReference"] };
    const proposal = proposals.get(`${decision.proposalId}|${decision.proposalRevision}`);
    if (
      !proposal ||
      decisions.has(decision.id) ||
      (decision.optionId && !proposal.options.some((item) => item.id === decision.optionId)) ||
      (decision.candidateId &&
        !authority.candidates.some((item) => item.id === decision.candidateId))
    )
      return { status: "invalid", issues: ["invalidDecisionReference"] };
    decisions.set(decision.id, decision);
  }
  const claimKeys = new Set<string>();
  for (const accepted of authority.acceptedAllocations) {
    if (!record(accepted) || !Array.isArray(accepted.claims))
      return { status: "invalid", issues: ["invalidAcceptedAllocation"] };
    const decision = decisions.get(accepted.decisionId);
    if (
      !decision ||
      !["accept", "modifyAndAccept"].includes(decision.decision) ||
      accepted.claims.some(
        (claim) => !accepted.scope.capacityClaims.some((allowed) => sameClaim(claim, allowed)),
      )
    )
      return { status: "invalid", issues: ["invalidAcceptedAllocation"] };
    if (accepted.version === 2 && !validCompleteAcceptedAllocation(accepted))
      return { status: "invalid", issues: ["invalidCompleteFootprint"] };
    if (accepted.version !== 1 && accepted.version !== 2)
      return { status: "invalid", issues: ["invalidAcceptedAllocationVersion"] };
    for (const claim of accepted.claims) {
      const key = claimKey(claim);
      if ([...claimKeys].some((value) => claimKeyOverlap(value, key)))
        return { status: "invalid", issues: ["duplicateAcceptedClaim"] };
      claimKeys.add(key);
    }
  }
  return { status: "valid", authority };
}

export function transitionProposal(
  proposal: ConstructiveProposalV1,
  lifecycle: ProposalLifecycleV1,
  successor?: ConstructiveProposalV1,
): ConstructiveProposalV1 | undefined {
  const allowed: Record<ProposalLifecycleV1, ProposalLifecycleV1[]> = {
    generated: ["shown", "accepted", "rejected", "stale", "expired", "superseded", "inapplicable"],
    shown: ["accepted", "rejected", "ignored", "stale", "expired", "superseded", "inapplicable"],
    accepted: [],
    rejected: [],
    ignored: [],
    stale: [],
    expired: [],
    superseded: [],
    inapplicable: [],
  };
  if (!allowed[proposal.lifecycle].includes(lifecycle)) return undefined;
  return {
    ...clone(proposal),
    revision: proposal.revision + 1,
    lifecycle,
    ...(lifecycle === "superseded" && successor
      ? { successor: { id: successor.id, revision: successor.revision, reason: "regenerated" } }
      : {}),
  };
}

export function claimsConflict(left: ProposalClaimV1[], right: ProposalClaimV1[]) {
  return left.some((a) =>
    right.some(
      (b) =>
        a.capacityIntervalId === b.capacityIntervalId &&
        !(a.role === "bufferProtection" && b.role === "bufferProtection") &&
        overlap(a, b),
    ),
  );
}

function option(
  alternative: AllocationAlternativeV1,
  allocationId: string,
  horizon: ProposalHorizonV1,
  rank: number,
  preferredId?: string,
): ProposalOptionV1 {
  const assignments = clone(alternative.assignments),
    resourceFootprints = assignments.flatMap((value) => value.resourceFootprints),
    claims = normalizedClaims(alternative.resourceClaims),
    productiveMinutes = alternative.productiveMinutes,
    supportMinutes = alternative.supportMinutes,
    bufferMinutes = alternative.bufferMinutes,
    scope = scopeFor(claims, assignments, horizon);
  const semantic = {
    allocation: alternative.id,
    scope,
    productiveMinutes,
    supportMinutes,
    bufferMinutes,
    nominalResourceMinutes: alternative.nominalResourceMinutes,
    totalResourceMinutes: alternative.unionedResourceMinutes,
  };
  return {
    id: capacityFingerprint(semantic),
    sourceAllocationId: allocationId,
    sourceAlternativeId: alternative.id,
    rank,
    preferred: alternative.id === preferredId,
    scope,
    productiveMinutes,
    supportMinutes,
    bufferMinutes,
    nominalResourceMinutes: alternative.nominalResourceMinutes,
    totalResourceMinutes: alternative.unionedResourceMinutes,
    resourceFootprints,
    assignments,
    claims,
    qualification: "fullyQualified",
    reasons: [
      { code: alternative.id === preferredId ? "allocationPreferred" : "allocationAlternative" },
    ],
    assumptions:
      supportMinutes === 0 && bufferMinutes === 0 ? [{ code: "supportAndBufferNotRequired" }] : [],
    tradeoffs: assignments
      .filter((value) => value.unmetMinutes > 0)
      .map((value) => ({
        code: "unmetDemand",
        demandProjectionId: value.demandProjectionId,
        minutes: value.unmetMinutes,
      })),
    exclusions: [
      {
        code: "unallocatedCapacity",
        minutes: alternative.unallocatedCapacity.reduce(
          (sum, value) => sum + value.durationMinutes,
          0,
        ),
      },
    ],
    rankingEvidence: { allocationRank: rank, allocationAlternativeId: alternative.id },
    provenance: proposed(),
  };
}
function modifiedOption(source: ProposalOptionV1, claims: ProposalClaimV1[]): ProposalOptionV1 {
  const productiveMinutes = roleMinutes(claims, "productive"),
    supportMinutes = roleMinutes(claims, "supportActivity"),
    bufferMinutes = roleMinutes(claims, "bufferProtection"),
    scope = scopeFor(claims, source.assignments, source.scope.horizon),
    semantic = { source: source.id, claims };
  return {
    ...clone(source),
    id: capacityFingerprint(semantic),
    preferred: false,
    scope,
    claims,
    productiveMinutes,
    supportMinutes,
    bufferMinutes,
    nominalResourceMinutes: productiveMinutes + supportMinutes + bufferMinutes,
    totalResourceMinutes: unionMinutes(claims),
    resourceFootprints: source.resourceFootprints.map((footprint) => {
      const retained = claims.filter(
          (claim) => claim.candidateParentId === footprint.candidateParentId,
        ),
        productiveClaims = retained.filter((claim) => claim.role === "productive"),
        supportClaims = retained.filter((claim) => claim.role === "supportActivity"),
        bufferClaims = retained.filter((claim) => claim.role === "bufferProtection"),
        productive = roleMinutes(retained, "productive"),
        support = roleMinutes(retained, "supportActivity"),
        buffer = roleMinutes(retained, "bufferProtection");
      return {
        ...clone(footprint),
        productiveClaims,
        supportClaims,
        bufferClaims,
        productiveMinutes: productive,
        supportMinutes: support,
        bufferMinutes: buffer,
        nominalResourceMinutes: productive + support + buffer,
        unionedResourceMinutes: unionMinutes(retained),
      };
    }),
  };
}

function validCompleteAcceptedAllocation(value: AcceptedAllocationV2) {
  if (
    value.footprintCompleteness !== "complete" ||
    !Array.isArray(value.resourceFootprints) ||
    value.claims.some((claim) => !validResourceClaim(claim)) ||
    value.resourceFootprints.some((footprint) => !validResourceFootprint(footprint))
  )
    return false;
  const footprintClaims = value.resourceFootprints.flatMap((footprint) => [
    ...footprint.productiveClaims,
    ...footprint.supportClaims,
    ...footprint.bufferClaims,
  ]);
  return (
    sameClaimSet(value.claims, value.scope.capacityClaims) &&
    value.claims.every((claim) => validClaimRelationship(claim, value.claims)) &&
    sameClaimSet(value.claims, footprintClaims) &&
    sameClaimSet(value.claims, value.decisiveSnapshot.option.claims) &&
    value.productiveMinutes === roleMinutes(value.claims, "productive") &&
    value.supportMinutes === roleMinutes(value.claims, "supportActivity") &&
    value.bufferMinutes === roleMinutes(value.claims, "bufferProtection") &&
    value.nominalResourceMinutes ===
      value.productiveMinutes + value.supportMinutes + value.bufferMinutes &&
    value.totalResourceMinutes === unionMinutes(value.claims)
  );
}
function validResourceFootprint(value: ProjectedResourceFootprintV1) {
  const claims = [...value.productiveClaims, ...value.supportClaims, ...value.bufferClaims];
  return (
    value.version === 1 &&
    value.productiveClaims.every(
      (claim) => claim.role === "productive" && validResourceClaim(claim),
    ) &&
    value.supportClaims.every(
      (claim) => claim.role === "supportActivity" && validResourceClaim(claim),
    ) &&
    value.bufferClaims.every(
      (claim) => claim.role === "bufferProtection" && validResourceClaim(claim),
    ) &&
    claims.every((claim) => claim.candidateParentId === value.candidateParentId) &&
    value.productiveMinutes === roleMinutes(claims, "productive") &&
    value.supportMinutes === roleMinutes(claims, "supportActivity") &&
    value.bufferMinutes === roleMinutes(claims, "bufferProtection") &&
    value.nominalResourceMinutes ===
      value.productiveMinutes + value.supportMinutes + value.bufferMinutes &&
    value.unionedResourceMinutes === unionMinutes(claims)
  );
}
function validResourceClaim(value: ProjectedResourceClaimV1) {
  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    ["productive", "supportActivity", "bufferProtection"].includes(value.role) &&
    ["required", "selectedOptional"].includes(value.requiredness) &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.userDayDate) &&
    typeof value.capacityIntervalId === "string" &&
    typeof value.candidateParentId === "string" &&
    Number.isFinite(Date.parse(value.startsAt)) &&
    Number.isFinite(Date.parse(value.endsAt)) &&
    value.durationMinutes > 0 &&
    duration(value) === value.durationMinutes &&
    typeof value.relationship === "object" &&
    value.relationship !== null
  );
}
function validClaimRelationship(claim: ProposalClaimV1, claims: ProposalClaimV1[]) {
  const relation = claim.relationship;
  if (claim.role === "productive") return relation.kind === "productiveRoot";
  if (claim.role === "supportActivity")
    return (
      relation.kind === "supportsProductive" &&
      claims.some(
        (candidate) =>
          candidate.id === relation.productiveClaimId &&
          candidate.role === "productive" &&
          candidate.candidateParentId === claim.candidateParentId,
      )
    );
  const targetId =
    relation.kind === "protectsProductive"
      ? relation.productiveClaimId
      : relation.kind === "protectsSupport"
        ? relation.supportClaimId
        : undefined;
  return claims.some(
    (candidate) =>
      candidate.id === targetId &&
      candidate.candidateParentId === claim.candidateParentId &&
      (relation.kind === "protectsProductive"
        ? candidate.role === "productive"
        : relation.kind === "protectsSupport" &&
          candidate.role === "supportActivity" &&
          candidate.componentId === relation.supportComponentId),
  );
}
function sameClaimSet(left: ProposalClaimV1[], right: ProposalClaimV1[]) {
  return (
    left.length === right.length &&
    left.every((claim) => right.some((candidate) => sameClaim(claim, candidate)))
  );
}
function scopeFor(
  claims: ProposalClaimV1[],
  assignments: AllocationAlternativeV1["assignments"],
  horizon: ProposalHorizonV1,
): ProposalScopeV1 {
  const active = assignments.filter((value) => value.assignedMinutes > 0);
  return {
    context: { kind: "ordinary" },
    horizon: clone(horizon),
    acceptance: "oneOff",
    bundle: active.length > 1 ? "atomic" : "independent",
    demandProjectionIds: unique(active.map((value) => value.demandProjectionId)),
    goalIds: unique(active.map((value) => value.goalId)),
    userDayDates: unique(claims.map((value) => value.userDayDate)),
    capacityClaims: normalizedClaims(claims),
  };
}
function mergeScopes(scopes: ProposalScopeV1[], horizon: ProposalHorizonV1): ProposalScopeV1 {
  return {
    context: { kind: "ordinary" },
    horizon: clone(horizon),
    acceptance: "oneOff",
    bundle: scopes.some((value) => value.bundle === "atomic") ? "atomic" : "independent",
    demandProjectionIds: unique(scopes.flatMap((value) => value.demandProjectionIds)),
    goalIds: unique(scopes.flatMap((value) => value.goalIds)),
    userDayDates: unique(scopes.flatMap((value) => value.userDayDates)),
    capacityClaims: normalizedClaims(scopes.flatMap((value) => value.capacityClaims)),
  };
}
function noProposal(
  input: { allocation: AllocationResultV1; horizon: ProposalHorizonV1; generatedAt: string },
  fingerprint: string,
  code: NoProposalV1["reasons"][number]["code"],
): ProposalGenerationResultV1 {
  const base = {
    recordType: "noProposal" as const,
    version: 1 as const,
    generatedAt: input.generatedAt,
    evaluationCutoff: input.generatedAt,
    context: { kind: "ordinary" as const },
    horizon: clone(input.horizon),
    inputFingerprint: fingerprint,
    policy: PROPOSAL_POLICY_V1,
    reasons: [{ code }],
    provenance: derived(),
  };
  return { status: "noProposal", result: { ...base, id: capacityFingerprint(base) } };
}
function validProposal(value: ConstructiveProposalV1) {
  return (
    value.recordType === "proposal" &&
    value.version === 1 &&
    value.revision > 0 &&
    value.policy.id === PROPOSAL_POLICY_V1.id &&
    value.options.length > 0 &&
    value.options.some((item) => item.id === value.preferredOptionId) &&
    validHorizon(value.horizon)
  );
}
function normalizedClaims(values: ProposalClaimV1[]) {
  return clone(values).sort((a, b) =>
    `${a.capacityIntervalId}|${a.startsAt}|${a.endsAt}|${a.role}|${a.id}`.localeCompare(
      `${b.capacityIntervalId}|${b.startsAt}|${b.endsAt}|${b.role}|${b.id}`,
    ),
  );
}
function roleMinutes(values: ProposalClaimV1[], role: ProposalClaimV1["role"]) {
  return values
    .filter((value) => value.role === role)
    .reduce((sum, value) => sum + value.durationMinutes, 0);
}
function unionMinutes(values: ProposalClaimV1[]) {
  const intervals = values
    .map((value) => [Date.parse(value.startsAt), Date.parse(value.endsAt)] as const)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let sum = 0,
    start: number | undefined,
    end: number | undefined;
  for (const value of intervals) {
    if (start === undefined) [start, end] = value;
    else if (value[0] <= end!) end = Math.max(end!, value[1]);
    else {
      sum += (end! - start) / 60_000;
      [start, end] = value;
    }
  }
  return start === undefined ? 0 : sum + (end! - start) / 60_000;
}
function unique(values: string[]) {
  return [...new Set(values)].sort();
}
function validHorizon(value: ProposalHorizonV1) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value.startUserDayDate) &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.endUserDayDateExclusive) &&
    value.startUserDayDate < value.endUserDayDateExclusive
  );
}
function contains(outer: ProposalHorizonV1, inner: ProposalHorizonV1) {
  return (
    outer.startUserDayDate <= inner.startUserDayDate &&
    inner.endUserDayDateExclusive <= outer.endUserDayDateExclusive
  );
}
function duration(value: ProposalClaimV1) {
  return (Date.parse(value.endsAt) - Date.parse(value.startsAt)) / 60_000;
}
function overlap(a: ProposalClaimV1, b: ProposalClaimV1) {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}
function sameClaim(a: ProposalClaimV1, b: ProposalClaimV1) {
  return (
    a.capacityIntervalId === b.capacityIntervalId &&
    a.startsAt === b.startsAt &&
    a.endsAt === b.endsAt &&
    a.demandProjectionId === b.demandProjectionId &&
    a.role === b.role &&
    a.id === b.id
  );
}
function claimKey(value: ProposalClaimV1) {
  return `${value.capacityIntervalId}|${value.startsAt}|${value.endsAt}|${value.role}`;
}
function claimKeyOverlap(left: string, right: string) {
  const [li, ls, le, lr] = left.split("|"),
    [ri, rs, re, rr] = right.split("|");
  return (
    li === ri && !(lr === "bufferProtection" && rr === "bufferProtection") && ls! < re! && rs! < le!
  );
}
function arrays(value: Record<string, unknown>, keys: string[]) {
  return keys.every((key) => Array.isArray(value[key]));
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function clone<T>(value: T): T {
  return structuredClone(value);
}
function proposed(): PlanningProvenanceV1 {
  return {
    version: 1,
    role: "derivedArtifact",
    origin: { kind: "derivedFromDependencies" },
    algorithm: { id: PROPOSAL_POLICY_V1.id, version: 1 },
  };
}
function derived(): PlanningProvenanceV1 {
  return proposed();
}
function authored(): PlanningProvenanceV1 {
  return { version: 1, role: "authoredAuthority", origin: { kind: "directAuthoring" } };
}
