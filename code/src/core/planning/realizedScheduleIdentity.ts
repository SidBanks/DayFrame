import type { DraftScheduledBlock } from "../blocks/types.js";
import type { GoalId } from "../goals/goal.js";
import type { LocalDateString } from "../shifts/types.js";
import { capacityFingerprint } from "./capacityFingerprint.js";
import type { AcceptedAllocationV2 } from "./proposal.js";
import type {
  FootprintSourceV1,
  ProjectedResourceClaimV1,
  ProjectedResourceRoleV1,
} from "./demandResourceFootprint.js";
import type { PlanningFactId, PlanningRevision } from "./planningFoundation.js";

export const REALIZED_SCHEDULE_IDENTITY_POLICY_V1 = {
  id: "realized-schedule-identity",
  version: 1,
} as const;
export type RealizationId = string & { readonly __realizationId: unique symbol };
export type RealizedScheduleSubjectId = string & {
  readonly __realizedScheduleSubjectId: unique symbol;
};
export type AcceptedScheduleRoleV1 = "productiveGoalWork" | "supportActivity" | "bufferProtection";
export type AcceptedAllocationScheduleOriginV1 = {
  kind: "acceptedAllocation";
  realizationId: RealizationId;
  acceptedAllocationId: string;
  acceptedAllocationRevision: number;
  acceptedClaimId: string;
  proposalDecisionId: string;
  proposalId: string;
  proposalRevision: number;
  proposalOptionId: string;
};
export type RealizedScheduleLineageV1 = {
  candidateParentId: string;
  goalId: GoalId;
  demandId: PlanningFactId;
  demandRevision: PlanningRevision;
  demandProjectionId: string;
  productiveOpportunityId: string;
  requiredness: ProjectedResourceClaimV1["requiredness"];
  relationship: ProjectedResourceClaimV1["relationship"];
  source: FootprintSourceV1;
  specificationId?: PlanningFactId;
  specificationRevision?: PlanningRevision;
  associationId?: PlanningFactId;
  associationRevision?: PlanningRevision;
  variantId?: string;
  componentId?: string;
};
type RealizedScheduleFactBase<R extends AcceptedScheduleRoleV1> = {
  recordType: "realizedScheduleFact";
  version: 1;
  id: RealizedScheduleSubjectId;
  sourceKind: "acceptedAllocation";
  scheduleRole: R;
  origin: AcceptedAllocationScheduleOriginV1;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  userDayDate: LocalDateString;
  capacityIntervalId: string;
  placement: "fixedAcceptedGeometry";
  recurrence: "none";
  autonomousMovability: "prohibited";
  lineage: RealizedScheduleLineageV1;
};
export type ScheduledGoalWorkV1 = RealizedScheduleFactBase<"productiveGoalWork"> & {
  timeSemantics: "activity";
  executionEligibility: "eligible";
};
export type ScheduledSupportActivityV1 = RealizedScheduleFactBase<"supportActivity"> & {
  timeSemantics: "activity";
  executionEligibility: "eligible";
};
export type RealizedBufferProtectionV1 = RealizedScheduleFactBase<"bufferProtection"> & {
  timeSemantics: "protection";
  executionEligibility: "prohibited";
};
export type RealizedScheduleFactV1 =
  | ScheduledGoalWorkV1
  | ScheduledSupportActivityV1
  | RealizedBufferProtectionV1;
export type ScheduleReadFactV1 = DraftScheduledBlock | RealizedScheduleFactV1;
export type RealizedScheduleReferenceV1 = Pick<
  RealizedScheduleFactV1,
  "version" | "sourceKind" | "scheduleRole" | "startsAt" | "endsAt" | "userDayDate"
> & {
  scheduledSubjectId: RealizedScheduleSubjectId;
  realizationId: RealizationId;
  acceptedAllocationId: string;
  acceptedClaimId: string;
};
export type RealizedExecutionReferenceV1 = RealizedScheduleReferenceV1 & {
  scheduleRole: "productiveGoalWork" | "supportActivity";
};
export type RealizedScheduleConstructionResultV1 =
  | { status: "created"; fact: RealizedScheduleFactV1 }
  | {
      status: "invalid";
      reason:
        | "incompleteAcceptedAllocation"
        | "claimNotFound"
        | "invalidClaimRole"
        | "invalidGeometry"
        | "invalidLineage";
    };

export function createRealizedScheduleFactValue(input: {
  acceptedAllocation: AcceptedAllocationV2;
  acceptedClaimId: string;
  realizationId: RealizationId;
}): RealizedScheduleConstructionResultV1 {
  const accepted = input.acceptedAllocation;
  if (accepted.version !== 2 || accepted.footprintCompleteness !== "complete")
    return { status: "invalid", reason: "incompleteAcceptedAllocation" };
  const claim = accepted.claims.find((value) => value.id === input.acceptedClaimId);
  if (!claim) return { status: "invalid", reason: "claimNotFound" };
  if (!validClaimRelationship(claim, accepted.claims))
    return { status: "invalid", reason: "invalidLineage" };
  if (
    !input.realizationId ||
    !Number.isFinite(Date.parse(claim.startsAt)) ||
    !Number.isFinite(Date.parse(claim.endsAt)) ||
    Date.parse(claim.endsAt) <= Date.parse(claim.startsAt) ||
    (Date.parse(claim.endsAt) - Date.parse(claim.startsAt)) / 60_000 !== claim.durationMinutes
  )
    return { status: "invalid", reason: "invalidGeometry" };
  const scheduleRole = scheduleRoleForClaim(claim.role);
  if (!scheduleRole) return { status: "invalid", reason: "invalidClaimRole" };
  const identity = {
    policy: REALIZED_SCHEDULE_IDENTITY_POLICY_V1,
    realizationId: input.realizationId,
    acceptedAllocationId: accepted.id,
    acceptedAllocationRevision: accepted.revision,
    acceptedClaimId: claim.id,
    scheduleRole,
  };
  const origin: AcceptedAllocationScheduleOriginV1 = {
      kind: "acceptedAllocation",
      realizationId: input.realizationId,
      acceptedAllocationId: accepted.id,
      acceptedAllocationRevision: accepted.revision,
      acceptedClaimId: claim.id,
      proposalDecisionId: accepted.decisionId,
      proposalId: accepted.proposalId,
      proposalRevision: accepted.proposalRevision,
      proposalOptionId: accepted.sourceOptionId,
    },
    lineage: RealizedScheduleLineageV1 = {
      candidateParentId: claim.candidateParentId,
      goalId: claim.goalId,
      demandId: claim.demandId,
      demandRevision: claim.demandRevision,
      demandProjectionId: claim.demandProjectionId,
      productiveOpportunityId: claim.productiveOpportunityId,
      requiredness: claim.requiredness,
      relationship: structuredClone(claim.relationship),
      source: structuredClone(claim.source),
      ...(claim.specificationId ? { specificationId: claim.specificationId } : {}),
      ...(claim.specificationRevision
        ? { specificationRevision: claim.specificationRevision }
        : {}),
      ...(claim.associationId ? { associationId: claim.associationId } : {}),
      ...(claim.associationRevision ? { associationRevision: claim.associationRevision } : {}),
      ...(claim.variantId ? { variantId: claim.variantId } : {}),
      ...(claim.componentId ? { componentId: claim.componentId } : {}),
    },
    base = {
      recordType: "realizedScheduleFact" as const,
      version: 1 as const,
      id: capacityFingerprint(identity) as RealizedScheduleSubjectId,
      sourceKind: "acceptedAllocation" as const,
      scheduleRole,
      origin,
      startsAt: claim.startsAt,
      endsAt: claim.endsAt,
      durationMinutes: claim.durationMinutes,
      userDayDate: claim.userDayDate,
      capacityIntervalId: claim.capacityIntervalId,
      placement: "fixedAcceptedGeometry" as const,
      recurrence: "none" as const,
      autonomousMovability: "prohibited" as const,
      lineage,
    };
  return {
    status: "created",
    fact:
      scheduleRole === "bufferProtection"
        ? { ...base, scheduleRole, timeSemantics: "protection", executionEligibility: "prohibited" }
        : {
            ...base,
            scheduleRole,
            timeSemantics: "activity",
            executionEligibility: "eligible",
          },
  };
}

export function realizedScheduleReference(
  fact: RealizedScheduleFactV1,
): RealizedScheduleReferenceV1 {
  return {
    version: 1,
    sourceKind: "acceptedAllocation",
    scheduledSubjectId: fact.id,
    realizationId: fact.origin.realizationId,
    acceptedAllocationId: fact.origin.acceptedAllocationId,
    acceptedClaimId: fact.origin.acceptedClaimId,
    scheduleRole: fact.scheduleRole,
    startsAt: fact.startsAt,
    endsAt: fact.endsAt,
    userDayDate: fact.userDayDate,
  };
}

export function executionReferenceForRealizedSchedule(
  fact: RealizedScheduleFactV1,
): { status: "eligible"; reference: RealizedExecutionReferenceV1 } | { status: "prohibited" } {
  if (fact.scheduleRole === "bufferProtection") return { status: "prohibited" };
  const reference = realizedScheduleReference(fact);
  return {
    status: "eligible",
    reference: {
      ...reference,
      scheduleRole: fact.scheduleRole,
    },
  };
}

export function validateRealizedScheduleFact(
  value: unknown,
): { status: "valid"; fact: RealizedScheduleFactV1 } | { status: "invalid"; issues: string[] } {
  if (!record(value)) return { status: "invalid", issues: ["fact must be an object"] };
  const issues: string[] = [];
  if (
    value.recordType !== "realizedScheduleFact" ||
    value.version !== 1 ||
    value.sourceKind !== "acceptedAllocation"
  )
    issues.push("invalid identity discriminator");
  const role = value.scheduleRole;
  if (!isScheduleRole(role)) issues.push("invalid schedule role");
  if (
    role === "bufferProtection"
      ? value.timeSemantics !== "protection" || value.executionEligibility !== "prohibited"
      : value.timeSemantics !== "activity" || value.executionEligibility !== "eligible"
  )
    issues.push("role/time/execution semantics mismatch");
  if (!record(value.origin) || value.origin.kind !== "acceptedAllocation")
    issues.push("accepted-allocation origin is required");
  else {
    for (const key of [
      "realizationId",
      "acceptedAllocationId",
      "acceptedClaimId",
      "proposalDecisionId",
      "proposalId",
      "proposalOptionId",
    ])
      if (typeof value.origin[key] !== "string" || !value.origin[key])
        issues.push(`origin.${key} is required`);
    if (
      !Number.isSafeInteger(value.origin.acceptedAllocationRevision) ||
      Number(value.origin.acceptedAllocationRevision) < 1 ||
      !Number.isSafeInteger(value.origin.proposalRevision) ||
      Number(value.origin.proposalRevision) < 1
    )
      issues.push("origin revisions are invalid");
  }
  if (!record(value.lineage) || !record(value.lineage.relationship))
    issues.push("accepted claim lineage is required");
  if (
    typeof value.startsAt !== "string" ||
    typeof value.endsAt !== "string" ||
    !Number.isFinite(Date.parse(value.startsAt)) ||
    !Number.isFinite(Date.parse(value.endsAt)) ||
    Date.parse(value.endsAt) <= Date.parse(value.startsAt) ||
    (Date.parse(value.endsAt) - Date.parse(value.startsAt)) / 60_000 !== value.durationMinutes
  )
    issues.push("invalid exact geometry");
  if (value.placement !== "fixedAcceptedGeometry" || value.recurrence !== "none")
    issues.push("placement or recurrence semantics are invalid");
  if (
    record(value.origin) &&
    isScheduleRole(role) &&
    typeof value.id === "string" &&
    value.id !==
      capacityFingerprint({
        policy: REALIZED_SCHEDULE_IDENTITY_POLICY_V1,
        realizationId: value.origin.realizationId,
        acceptedAllocationId: value.origin.acceptedAllocationId,
        acceptedAllocationRevision: value.origin.acceptedAllocationRevision,
        acceptedClaimId: value.origin.acceptedClaimId,
        scheduleRole: role,
      })
  )
    issues.push("scheduled subject identity is not deterministic");
  return issues.length
    ? { status: "invalid", issues }
    : { status: "valid", fact: structuredClone(value) as RealizedScheduleFactV1 };
}

export function validateRealizedScheduleReference(
  value: unknown,
): value is RealizedScheduleReferenceV1 {
  return (
    record(value) &&
    value.version === 1 &&
    value.sourceKind === "acceptedAllocation" &&
    typeof value.scheduledSubjectId === "string" &&
    !!value.scheduledSubjectId &&
    typeof value.realizationId === "string" &&
    !!value.realizationId &&
    typeof value.acceptedAllocationId === "string" &&
    !!value.acceptedAllocationId &&
    typeof value.acceptedClaimId === "string" &&
    !!value.acceptedClaimId &&
    isScheduleRole(value.scheduleRole) &&
    typeof value.startsAt === "string" &&
    typeof value.endsAt === "string" &&
    Number.isFinite(Date.parse(value.startsAt)) &&
    Number.isFinite(Date.parse(value.endsAt)) &&
    Date.parse(value.endsAt) > Date.parse(value.startsAt) &&
    typeof value.userDayDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.userDayDate) &&
    Object.keys(value).sort().join() ===
      "acceptedAllocationId,acceptedClaimId,endsAt,realizationId,scheduleRole,scheduledSubjectId,sourceKind,startsAt,userDayDate,version"
  );
}

function scheduleRoleForClaim(role: ProjectedResourceRoleV1): AcceptedScheduleRoleV1 | undefined {
  return role === "productive"
    ? "productiveGoalWork"
    : role === "supportActivity" || role === "bufferProtection"
      ? role
      : undefined;
}
function validClaimRelationship(
  claim: ProjectedResourceClaimV1,
  claims: ProjectedResourceClaimV1[],
) {
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
function isScheduleRole(value: unknown): value is AcceptedScheduleRoleV1 {
  return ["productiveGoalWork", "supportActivity", "bufferProtection"].includes(String(value));
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
