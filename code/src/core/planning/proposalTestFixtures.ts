import {
  ALLOCATION_POLICY_V1,
  type AllocationAlternativeV1,
  type AllocationResultV1,
} from "./allocation.js";

export const horizon = { startUserDayDate: "2026-09-04", endUserDayDateExclusive: "2026-09-05" };
export function alternative(
  id: string,
  demand = "demand-a",
  start = "2026-09-04T15:00:00.000Z",
): AllocationAlternativeV1 {
  const end = new Date(Date.parse(start) + 60 * 60_000).toISOString();
  const claim = {
    id: `claim-${id}`,
    role: "productive" as const,
    demandProjectionId: demand,
    capacityIntervalId: "capacity-a",
    productiveOpportunityId: `opportunity-${id}`,
    startsAt: start,
    endsAt: end,
    durationMinutes: 60,
    userDayDate: "2026-09-04" as const,
    requiredness: "required" as const,
    candidateParentId: `parent-${id}`,
    goalId: `goal-${demand}` as never,
    demandId: demand as never,
    demandRevision: 1 as never,
    source: { kind: "direct" as const },
    relationship: { kind: "productiveRoot" as const },
    dependencyFingerprint: `footprint-${id}`,
    provenance: {
      version: 1 as const,
      role: "derivedArtifact" as const,
      origin: { kind: "derivedFromDependencies" as const },
    },
  };
  const footprint = {
    version: 1 as const,
    id: `footprint-${id}`,
    candidateParentId: `parent-${id}`,
    productiveClaims: [claim],
    supportClaims: [],
    bufferClaims: [],
    omittedOptionalComponentIds: [],
    productiveMinutes: 60,
    supportMinutes: 0,
    bufferMinutes: 0,
    nominalResourceMinutes: 60,
    unionedResourceMinutes: 60,
    dependencyFingerprint: `footprint-${id}`,
    provenance: claim.provenance,
  };
  return {
    version: 1,
    id,
    competingSetId: "set",
    policy: ALLOCATION_POLICY_V1,
    assignments: [
      {
        demandProjectionId: demand,
        goalId: `goal-${demand}`,
        requestedMinutes: 90,
        attributedMinutes: 0,
        remainingRequestedMinutes: 90,
        assignedMinutes: 60,
        unmetMinutes: 30,
        outcome: "permittedPartial",
        priorityEvidence: [],
        partitions: [
          {
            id: `part-${id}`,
            demandProjectionId: demand,
            capacityIntervalId: "capacity-a",
            opportunityId: `opportunity-${id}`,
            startsAt: start,
            endsAt: end,
            durationMinutes: 60,
            userDayDate: "2026-09-04",
            sessionIndex: 0,
          },
        ],
        resourceFootprints: [footprint],
        reasons: [{ code: "partialSatisfactionApplied" }],
      },
    ],
    claimedMinutes: 60,
    productiveMinutes: 60,
    supportMinutes: 0,
    bufferMinutes: 0,
    nominalResourceMinutes: 60,
    unionedResourceMinutes: 60,
    resourceClaims: [claim],
    unallocatedCapacity: [],
    reasons: [],
    dependencyFingerprint: `alternative-${id}`,
    freshness: "current",
    provenance: {
      version: 1,
      role: "derivedArtifact",
      origin: { kind: "derivedFromDependencies" },
      algorithm: { id: "goal-allocation", version: 1 },
    },
  };
}
export function allocation(
  alternatives = [
    alternative("preferred"),
    alternative("other", "demand-b", "2026-09-04T17:00:00.000Z"),
  ],
): AllocationResultV1 {
  return {
    version: 1,
    id: "allocation",
    policy: ALLOCATION_POLICY_V1,
    competingSetId: "set",
    capacityFingerprint: "capacity",
    alternatives,
    preferredAlternativeId: "preferred",
    search: { examined: 2, limit: 512, truncated: false },
    dependencyFingerprint: "dependencies",
    freshness: "current",
    provenance: {
      version: 1,
      role: "derivedArtifact",
      origin: { kind: "derivedFromDependencies" },
      algorithm: { id: "goal-allocation", version: 1 },
    },
  };
}
