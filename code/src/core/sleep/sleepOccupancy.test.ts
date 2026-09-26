import { deriveFoundationalSchedule } from "../planning/deriveFoundationalSchedule.js";
import { deriveCapacity } from "../planning/capacity.js";
import { expect, it } from "vitest";
import { createInitialDayFrameState } from "../../state/createInitialDayFrameState.js";
import { requirement } from "./sleepTestFixtures.js";
import { resolveRequiredSleep } from "./resolveRequiredSleep.js";
import { capacityFingerprint } from "../planning/capacityFingerprint.js";
import {
  REALIZED_SCHEDULE_IDENTITY_POLICY_V1,
  validateRealizedScheduleFact,
} from "../planning/realizedScheduleIdentity.js";
import type { SleepFoundationAuthority } from "./sleepFoundationalOccupancy.js";
import type {
  AttachmentRelationshipV1,
  CompositionTemplateSourceV1,
} from "../planning/commitmentComposition.js";
const at = "2026-09-01T00:00:00.000Z";
function state() {
  const s = createInitialDayFrameState();
  s.sleepRequirements = [
    {
      ...requirement(),
      effectiveFrom: "2026-09-17",
      effectiveUntilExclusive: "2026-09-18",
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      window: { kind: "clock", startClock: "22:00", endClock: "08:00" },
    },
  ];
  return s;
}
function authority(): SleepFoundationAuthority {
  return {
    status: "complete",
    planDecisions: [],
    realizedFacts: [],
    composition: { authority: { version: 1, relationships: [], decisions: [] }, sources: [] },
  };
}
const ownerRange = {
  startUserDayDate: "2026-09-17",
  endUserDayDateExclusive: "2026-09-18",
} as const;
it.each(["productiveGoalWork", "supportActivity", "bufferProtection"] as const)(
  "canonical realized %s blocks with preserved lineage",
  (scheduleRole) => {
    const origin = {
      kind: "acceptedAllocation" as const,
      realizationId: "realized" as never,
      acceptedAllocationId: "accepted",
      acceptedAllocationRevision: 1,
      acceptedClaimId: "claim",
      proposalDecisionId: "decision",
      proposalId: "proposal",
      proposalRevision: 1,
      proposalOptionId: "option",
    };
    const raw = {
      recordType: "realizedScheduleFact",
      version: 1,
      id: capacityFingerprint({
        policy: REALIZED_SCHEDULE_IDENTITY_POLICY_V1,
        realizationId: origin.realizationId,
        acceptedAllocationId: origin.acceptedAllocationId,
        acceptedAllocationRevision: 1,
        acceptedClaimId: origin.acceptedClaimId,
        scheduleRole,
      }),
      sourceKind: "acceptedAllocation",
      scheduleRole,
      origin,
      startsAt: new Date("2026-09-17T22:00:00").toISOString(),
      endsAt: new Date("2026-09-18T08:00:00").toISOString(),
      durationMinutes: 600,
      userDayDate: "2026-09-17",
      capacityIntervalId: "capacity",
      placement: "fixedAcceptedGeometry",
      recurrence: "none",
      autonomousMovability: "prohibited",
      lineage: {
        candidateParentId: "parent",
        goalId: "goal",
        demandId: "demand",
        demandRevision: 1,
        demandProjectionId: "projection",
        productiveOpportunityId: "opportunity",
        requiredness: "required",
        relationship: { kind: "productiveRoot" },
        source: { kind: "direct" },
      },
      timeSemantics: scheduleRole === "bufferProtection" ? "protection" : "activity",
      executionEligibility: scheduleRole === "bufferProtection" ? "prohibited" : "eligible",
    };
    const validated = validateRealizedScheduleFact(raw);
    expect(validated.status).toBe("valid");
    if (validated.status !== "valid") throw new Error(JSON.stringify(validated));
    const fact = validated.fact;
    const auth = authority();
    auth.realizedFacts = [fact];
    const before = structuredClone(auth);
    const r = resolveRequiredSleep({ authoredState: state(), ownerRange, authority: auth });
    expect(r.status, JSON.stringify(r)).toBe("infeasible");
    if (r.status === "infeasible") {
      expect(r.conflicts[0]!.blockers[0]!.sourceReference).toEqual(fact);
      expect(r.conflicts[0]!.blockers[0]!.timeSemantics).toBe(fact.timeSemantics);
    }
    assertBlockedPlanning(state(), auth);
    expect(auth).toEqual(before);
  },
);
it("fixed parent support and protection derive through canonical composition, never Preview", () => {
  const template = {
    id: "parent",
    userId: "u",
    title: "Parent",
    category: "maintenance" as const,
    placementType: "fixed" as const,
    fixedStartTime: "08:00" as const,
    durationMinutes: 60,
    priority: 2 as const,
    preferredWindow: "anyAvailable" as const,
    rescheduleBehavior: "skip" as const,
    requiresResource: false,
    externalResources: [],
    enabled: true,
    createdAt: at,
    updatedAt: at,
  };
  const s = createInitialDayFrameState({
    blockTemplates: [
      template,
      { ...template, id: "child", title: "Support", durationMinutes: 420 },
    ],
    blockRecurrences: [{ id: "parent-rec", blockTemplateId: "parent", frequency: "daily" }],
  });
  s.sleepRequirements = state().sleepRequirements!;
  const sources: CompositionTemplateSourceV1[] = s.blockTemplates.map((t) => ({
    kind: "template",
    sourceId: t.id,
    incarnationId: t.incarnationId,
    title: t.title,
    durationMinutes: t.durationMinutes,
    revisionToken: t.updatedAt,
    userId: t.userId,
    category: t.category,
    priority: t.priority,
  }));
  const relationship: AttachmentRelationshipV1 = {
    recordType: "attachmentRelationship",
    version: 1,
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as never,
    revision: 1 as never,
    status: "active",
    parent: sources[0]!,
    child: sources[1]!,
    slot: "support",
    order: 0,
    applicability: {},
    requiredness: "required",
    timing: { kind: "endsAtParentStart" },
    timingStrictness: "constraint",
    buffer: { beforeMinutes: 180, afterMinutes: 0 },
    goalSupport: "none",
    createdAt: at,
    updatedAt: at,
    effectiveFrom: at,
    provenance: { version: 1, role: "authoredAuthority", origin: { kind: "directAuthoring" } },
  };
  const auth = authority();
  auth.composition = {
    authority: { version: 1, relationships: [relationship], decisions: [] },
    sources,
  };
  const r = resolveRequiredSleep({ authoredState: s, ownerRange, authority: auth });
  assertBlockedPlanning(s, auth);
  expect(r.status, JSON.stringify(r)).toBe("infeasible");
  if (r.status === "infeasible") {
    expect(r.conflicts[0]!.blockers.some((b) => b.authority === "supportActivity")).toBe(true);
    expect(r.conflicts[0]!.blockers.some((b) => b.authority === "protectedBuffer")).toBe(true);
  }
});

function assertBlockedPlanning(s: ReturnType<typeof state>, auth: SleepFoundationAuthority) {
  const planning = deriveFoundationalSchedule({ authoredState: s, ownerRange, authority: auth });
  expect(planning.foundation.status).toBe("nonAllocatable");
  const capacity = deriveCapacity({
    ...ownerRange,
    resolver: planning.resolver,
    schedule: {
      ...planning.schedule,
      foundation: planning.foundation,
      planningWindow: planning.planningWindow,
    },
  });
  expect(capacity.qualification).toMatchObject({
    allocability: "nonAllocatable",
    coverage: "unavailable",
  });
  expect(capacity.intervals).toEqual([]);
}
