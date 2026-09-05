import { capacityFingerprint } from "./capacityFingerprint.js";
import type { AcceptedAllocationV2 } from "./proposal.js";
import {
  createRealizedScheduleFactValue,
  validateRealizedScheduleFact,
  type RealizationId,
  type RealizedScheduleFactV1,
} from "./realizedScheduleIdentity.js";

export const ACCEPTED_ALLOCATION_REALIZATION_POLICY_V1 = {
  id: "accepted-allocation-realization",
  version: 1,
} as const;

export type RealizationV1 = {
  recordType: "realization";
  version: 1;
  id: RealizationId;
  policy: typeof ACCEPTED_ALLOCATION_REALIZATION_POLICY_V1;
  acceptedAllocationId: string;
  acceptedAllocationRevision: number;
  proposalDecisionId: string;
  proposalId: string;
  proposalRevision: number;
  optionId: string;
  realizedAt: string;
  origin: "acceptedAllocation";
  result: "realized";
  scheduledGoalWorkIds: string[];
  scheduledSupportActivityIds: string[];
  realizedBufferProtectionIds: string[];
  acceptedClaimIds: string[];
  dependencyFingerprint: string;
  provenance: { version: 1; role: "realizationEvidence" };
};

export type RealizationAuthorityV1 = {
  version: 1;
  realizations: RealizationV1[];
  facts: RealizedScheduleFactV1[];
};

export type RealizationConflictV1 = {
  acceptedClaimId: string;
  conflictingSubjectId: string;
  conflictingSource: string;
  acceptedRole: RealizedScheduleFactV1["scheduleRole"];
  startsAt: string;
  endsAt: string;
  userDayDate: string;
};
export type RealizationConflictSubjectV1 = Pick<
  RealizedScheduleFactV1,
  "id" | "startsAt" | "endsAt" | "sourceKind"
> & { scheduleRole?: RealizedScheduleFactV1["scheduleRole"] };

export type RealizationReasonCodeV1 =
  | "alreadyRealized"
  | "acceptedAllocationIncomplete"
  | "acceptedAllocationInvalid"
  | "claimGeometryMismatch"
  | "claimIdentityMismatch"
  | "scheduleConflict"
  | "atomicPersistenceFailure";

export type RealizationCommandResultV1 = {
  status: "realized" | "alreadyRealized" | "conflicted" | "inapplicable" | "invalid" | "failed";
  acceptedAllocationId: string;
  realizationId?: RealizationId;
  scheduledGoalWorkIds: string[];
  scheduledSupportActivityIds: string[];
  bufferProtectionIds: string[];
  conflicts: RealizationConflictV1[];
  reasons: RealizationReasonCodeV1[];
  previewFreshnessImpact: "stale" | "none";
};

export function realizationIdForAcceptedAllocation(
  accepted: Pick<AcceptedAllocationV2, "id" | "revision">,
): RealizationId {
  return capacityFingerprint({
    policy: ACCEPTED_ALLOCATION_REALIZATION_POLICY_V1,
    acceptedAllocationId: accepted.id,
    acceptedAllocationRevision: accepted.revision,
  }) as RealizationId;
}

export function stageAcceptedAllocationRealization(input: {
  acceptedAllocation: AcceptedAllocationV2;
  realizedAt: string;
  currentSchedule: readonly RealizationConflictSubjectV1[];
}):
  | { status: "staged"; realization: RealizationV1; facts: RealizedScheduleFactV1[] }
  | { status: "inapplicable" | "invalid" | "conflicted"; result: RealizationCommandResultV1 } {
  const accepted = input.acceptedAllocation;
  const empty = (
    status: "inapplicable" | "invalid" | "conflicted",
    reasons: RealizationReasonCodeV1[],
    conflicts: RealizationConflictV1[] = [],
  ) => ({
    status,
    result: {
      status,
      acceptedAllocationId: accepted.id,
      scheduledGoalWorkIds: [],
      scheduledSupportActivityIds: [],
      bufferProtectionIds: [],
      conflicts,
      reasons,
      previewFreshnessImpact: "none" as const,
    },
  });
  if (accepted.version !== 2 || accepted.footprintCompleteness !== "complete")
    return empty("inapplicable", ["acceptedAllocationIncomplete"]);
  if (
    !Number.isFinite(Date.parse(input.realizedAt)) ||
    new Set(accepted.claims.map((claim) => claim.id)).size !== accepted.claims.length
  )
    return empty("invalid", ["acceptedAllocationInvalid"]);
  const realizationId = realizationIdForAcceptedAllocation(accepted);
  const facts: RealizedScheduleFactV1[] = [];
  for (const claim of accepted.claims) {
    const created = createRealizedScheduleFactValue({
      acceptedAllocation: accepted,
      acceptedClaimId: claim.id,
      realizationId,
    });
    if (created.status !== "created")
      return empty("invalid", [
        created.reason === "invalidGeometry" ? "claimGeometryMismatch" : "claimIdentityMismatch",
      ]);
    facts.push(created.fact);
  }
  const conflicts = findRealizationConflicts(facts, input.currentSchedule);
  if (conflicts.length) return empty("conflicted", ["scheduleConflict"], conflicts);
  const scheduledGoalWorkIds = facts
    .filter((fact) => fact.scheduleRole === "productiveGoalWork")
    .map((fact) => fact.id);
  const scheduledSupportActivityIds = facts
    .filter((fact) => fact.scheduleRole === "supportActivity")
    .map((fact) => fact.id);
  const realizedBufferProtectionIds = facts
    .filter((fact) => fact.scheduleRole === "bufferProtection")
    .map((fact) => fact.id);
  return {
    status: "staged",
    realization: {
      recordType: "realization",
      version: 1,
      id: realizationId,
      policy: ACCEPTED_ALLOCATION_REALIZATION_POLICY_V1,
      acceptedAllocationId: accepted.id,
      acceptedAllocationRevision: accepted.revision,
      proposalDecisionId: accepted.decisionId,
      proposalId: accepted.proposalId,
      proposalRevision: accepted.proposalRevision,
      optionId: accepted.sourceOptionId,
      realizedAt: input.realizedAt,
      origin: "acceptedAllocation",
      result: "realized",
      scheduledGoalWorkIds,
      scheduledSupportActivityIds,
      realizedBufferProtectionIds,
      acceptedClaimIds: facts.map((fact) => fact.origin.acceptedClaimId),
      dependencyFingerprint: capacityFingerprint({ accepted, facts }),
      provenance: { version: 1, role: "realizationEvidence" },
    },
    facts,
  };
}

export function findRealizationConflicts(
  incoming: readonly RealizedScheduleFactV1[],
  current: readonly RealizationConflictSubjectV1[],
): RealizationConflictV1[] {
  const result: RealizationConflictV1[] = [];
  for (const accepted of incoming)
    for (const existing of current) {
      const overlap = accepted.startsAt < existing.endsAt && existing.startsAt < accepted.endsAt;
      const compatibleBuffers =
        accepted.scheduleRole === "bufferProtection" &&
        existing.scheduleRole === "bufferProtection";
      if (overlap && !compatibleBuffers)
        result.push({
          acceptedClaimId: accepted.origin.acceptedClaimId,
          conflictingSubjectId: existing.id,
          conflictingSource: existing.sourceKind,
          acceptedRole: accepted.scheduleRole,
          startsAt: new Date(
            Math.max(Date.parse(accepted.startsAt), Date.parse(existing.startsAt)),
          ).toISOString(),
          endsAt: new Date(
            Math.min(Date.parse(accepted.endsAt), Date.parse(existing.endsAt)),
          ).toISOString(),
          userDayDate: accepted.userDayDate,
        });
    }
  return result.sort(
    (a, b) =>
      a.acceptedClaimId.localeCompare(b.acceptedClaimId) ||
      a.conflictingSubjectId.localeCompare(b.conflictingSubjectId),
  );
}

export function validateRealizationAuthority(
  value: unknown,
):
  | { status: "valid"; authority: RealizationAuthorityV1 }
  | { status: "invalid"; issues: string[] } {
  if (
    !record(value) ||
    value.version !== 1 ||
    !Array.isArray(value.realizations) ||
    !Array.isArray(value.facts)
  )
    return { status: "invalid", issues: ["invalid realization authority envelope"] };
  const issues: string[] = [];
  const facts: RealizedScheduleFactV1[] = [];
  for (const fact of value.facts) {
    const checked = validateRealizedScheduleFact(fact);
    if (checked.status === "invalid") issues.push(...checked.issues);
    else facts.push(checked.fact);
  }
  const realizations = value.realizations.filter(
    (item): item is RealizationV1 =>
      record(item) &&
      item.recordType === "realization" &&
      item.version === 1 &&
      item.result === "realized",
  );
  if (realizations.length !== value.realizations.length) issues.push("invalid realization record");
  if (new Set(realizations.map((item) => item.acceptedAllocationId)).size !== realizations.length)
    issues.push("duplicate successful realization");
  for (const realization of realizations) {
    const owned = facts.filter((fact) => fact.origin.realizationId === realization.id);
    const ids = new Set(owned.map((fact) => fact.id));
    if (
      ![
        ...realization.scheduledGoalWorkIds,
        ...realization.scheduledSupportActivityIds,
        ...realization.realizedBufferProtectionIds,
      ].every((id) => ids.has(id as RealizedScheduleFactV1["id"]))
    )
      issues.push("realization fact relationship is incomplete");
  }
  return issues.length
    ? { status: "invalid", issues }
    : { status: "valid", authority: structuredClone({ version: 1, realizations, facts }) };
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
