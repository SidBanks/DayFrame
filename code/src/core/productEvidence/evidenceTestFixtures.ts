import {
  deriveOrdinaryProposal,
  type ConstructiveProposalV1,
  type AcceptedAllocationV2,
} from "../planning/proposal.js";
import { allocation, alternative, horizon } from "../planning/proposalTestFixtures.js";
import { stageAcceptedAllocationRealization } from "../planning/acceptedAllocationRealization.js";
import { createHistoricalRealizedScheduleSnapshot } from "../historicalPlan/historicalPlan.js";
import { available, type PublicationEvidence } from "./evidence.js";
export function acceptedFixture(
  id = "A",
  minutes = 600,
  start = "2026-09-04T02:00:00.000Z",
  collect: (proposal: ConstructiveProposalV1) => void = () => {},
): AcceptedAllocationV2 {
  const base = alternative(id),
    productive = {
      ...base.resourceClaims[0]!,
      goalId: "goal-network" as never,
      startsAt: start,
      endsAt: new Date(Date.parse(start) + minutes * 60000).toISOString(),
      durationMinutes: minutes,
    },
    support = {
      ...productive,
      id: `support-${id}`,
      role: "supportActivity" as const,
      componentId: "setup",
      startsAt: new Date(Date.parse(start) - 30 * 60000).toISOString(),
      endsAt: start,
      durationMinutes: 30,
      relationship: {
        kind: "supportsProductive" as const,
        productiveClaimId: productive.id,
      },
    },
    buffer = {
      ...productive,
      id: `buffer-${id}`,
      role: "bufferProtection" as const,
      componentId: "recovery",
      startsAt: productive.endsAt,
      endsAt: new Date(Date.parse(productive.endsAt) + 15 * 60000).toISOString(),
      durationMinutes: 15,
      relationship: {
        kind: "protectsSupport" as const,
        supportClaimId: support.id,
        supportComponentId: "setup",
      },
    },
    footprint = {
      ...base.assignments[0]!.resourceFootprints[0]!,
      productiveClaims: [productive],
      productiveMinutes: minutes,
      supportClaims: [support],
      bufferClaims: [buffer],
      supportMinutes: 30,
      bufferMinutes: 15,
      nominalResourceMinutes: minutes + 45,
      unionedResourceMinutes: minutes + 45,
    },
    enriched = {
      ...base,
      productiveMinutes: minutes,
      claimedMinutes: minutes,
      assignments: [
        {
          ...base.assignments[0]!,
          goalId: "goal-network",
          requestedMinutes: minutes,
          remainingRequestedMinutes: minutes,
          assignedMinutes: minutes,
          unmetMinutes: 0,
          outcome: "full" as const,
          partitions: [
            {
              ...base.assignments[0]!.partitions[0]!,
              startsAt: start,
              endsAt: productive.endsAt,
              durationMinutes: minutes,
            },
          ],
          resourceFootprints: [footprint],
        },
      ],
      supportMinutes: 30,
      bufferMinutes: 15,
      nominalResourceMinutes: minutes + 45,
      unionedResourceMinutes: minutes + 45,
      resourceClaims: [productive, support, buffer],
    },
    proposal = deriveOrdinaryProposal({
      allocation: allocation([enriched]),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "2026-09-04T12:00:00.000Z",
    });
  if (proposal.status !== "proposed") throw new Error("proposal fixture failed");
  collect(proposal.proposal);
  const option = proposal.proposal.options[0]!;
  return {
    recordType: "acceptedAllocation",
    version: 2,
    revision: 1,
    id: `accepted-${id}`,
    decisionId: `decision-${id}`,
    proposalId: proposal.proposal.id,
    proposalRevision: proposal.proposal.revision,
    sourceOptionId: option.id,
    acceptedAt: "2026-09-04T12:30:00.000Z",
    actor: { kind: "user" },
    scope: structuredClone(option.scope),
    productiveMinutes: minutes,
    supportMinutes: 30,
    bufferMinutes: 15,
    nominalResourceMinutes: minutes + 45,
    totalResourceMinutes: minutes + 45,
    claims: structuredClone(option.claims),
    resourceFootprints: structuredClone(option.resourceFootprints),
    assignments: structuredClone(option.assignments),
    decisiveSnapshot: {
      proposalInputFingerprint: proposal.proposal.inputFingerprint,
      sourceAllocationId: proposal.proposal.sourceAllocationId,
      sourceAllocationDependencyFingerprint:
        proposal.proposal.sourceAllocationDependencyFingerprint,
      capacityFingerprint: proposal.proposal.capacityFingerprint,
      option: structuredClone(option),
    },
    realization: "unrealized",
    footprintCompleteness: "complete",
    provenance: {
      version: 1,
      role: "acceptedAuthority",
      origin: { kind: "directAuthoring" },
    },
  };
}

export function lineageFixture() {
  const proposals: ConstructiveProposalV1[] = [];
  const collect = (p: ConstructiveProposalV1) => proposals.push(p);
  const a = acceptedFixture("A", 600, "2026-09-04T02:00:00.000Z", collect),
    b = acceptedFixture("B", 1200, "2026-09-04T14:00:00.000Z", collect),
    unrealized = acceptedFixture("C", 60, "2026-09-04T00:00:00.000Z", collect);
  const stage = (acceptedAllocation: AcceptedAllocationV2) => {
    const result = stageAcceptedAllocationRealization({
      acceptedAllocation,
      realizedAt: "2026-09-04T12:45:00.000Z",
      currentSchedule: [],
    });
    if (result.status !== "staged") throw Error(JSON.stringify(result));
    return result;
  };
  const stages = [stage(a), stage(b)];
  const facts = stages.flatMap((s) => s.facts);
  const day = {
    version: 1 as const,
    userDayDate: "2026-09-04" as const,
    dayBoundaryStartTime: "03:00" as const,
    weekStartsOn: "monday" as const,
    utcOffsetMinutes: -300,
    occurrences: facts.map((fact) =>
      createHistoricalRealizedScheduleSnapshot({
        fact,
        title: "Network+ Study",
        category: "work",
        goals: [],
      }),
    ),
  };
  const publication: PublicationEvidence = {
    day,
    durability: "durable",
    batch: {
      surfaceVersion: 1,
      version: 1,
      id: "11111111-1111-4111-8111-111111111111" as never,
      publishedAt: "2026-09-04T13:00:00.000Z",
      range: { startUserDayDate: day.userDayDate, endUserDayDate: day.userDayDate },
      days: [day],
    },
  };
  return {
    a,
    b,
    unrealized,
    facts,
    publication,
    input: {
      query: {
        startUserDayDate: "2026-09-04",
        endUserDayDateExclusive: "2026-09-05",
        asOf: "2026-09-06T00:00:00.000Z",
      },
      proposals: available({
        version: 1 as const,
        proposals,
        candidates: [],
        decisions: [a, b, unrealized].map((accepted) => ({
          recordType: "proposalDecision" as const,
          version: 1 as const,
          revision: 1 as const,
          id: accepted.decisionId,
          proposalId: accepted.proposalId,
          proposalRevision: accepted.proposalRevision,
          optionId: accepted.sourceOptionId,
          decision: "accept" as const,
          decidedAt: accepted.acceptedAt,
          actor: { kind: "user" as const },
          acceptedScope: accepted.scope,
          decisiveFingerprint: accepted.decisiveSnapshot.proposalInputFingerprint,
          provenance: accepted.provenance,
        })),
        acceptedAllocations: [b, unrealized, a],
      }),
      realizations: available({
        version: 1 as const,
        realizations: stages.map((s) => s.realization),
        facts,
      }),
      history: available([publication]),
      actual: available([]),
    },
  };
}
