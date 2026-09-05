import { describe, expect, it } from "vitest";
import { createExecutionAssertion } from "../execution/executionRecord.js";
import { materializeHistoricalPlanExecutionTarget } from "../execution/historicalPlanExecutionTarget.js";
import {
  createHistoricalRealizedScheduleSnapshot,
  createPlanPublicationBatch,
} from "../historicalPlan/historicalPlan.js";
import { validatePlanPublicationBatch } from "../historicalPlan/historicalPlanValidation.js";
import { deriveOrdinaryProposal, type AcceptedAllocationV2 } from "./proposal.js";
import { allocation, alternative, horizon } from "./proposalTestFixtures.js";
import {
  createRealizedScheduleFactValue,
  executionReferenceForRealizedSchedule,
  realizedScheduleReference,
  validateRealizedScheduleFact,
  type RealizationId,
  type RealizedScheduleFactV1,
} from "./realizedScheduleIdentity.js";

const realizationId = "realization-1" as RealizationId;

function accepted(): AcceptedAllocationV2 {
  const base = alternative("identity"),
    productive = base.resourceClaims[0]!,
    support = {
      ...productive,
      id: "support-claim",
      role: "supportActivity" as const,
      componentId: "setup",
      startsAt: "2026-09-04T14:30:00.000Z",
      endsAt: "2026-09-04T15:00:00.000Z",
      durationMinutes: 30,
      relationship: {
        kind: "supportsProductive" as const,
        productiveClaimId: productive.id,
      },
    },
    buffer = {
      ...productive,
      id: "buffer-claim",
      role: "bufferProtection" as const,
      componentId: "recovery",
      startsAt: "2026-09-04T16:00:00.000Z",
      endsAt: "2026-09-04T16:15:00.000Z",
      durationMinutes: 15,
      relationship: {
        kind: "protectsSupport" as const,
        supportClaimId: support.id,
        supportComponentId: "setup",
      },
    },
    footprint = {
      ...base.assignments[0]!.resourceFootprints[0]!,
      supportClaims: [support],
      bufferClaims: [buffer],
      supportMinutes: 30,
      bufferMinutes: 15,
      nominalResourceMinutes: 105,
      unionedResourceMinutes: 105,
    },
    enriched = {
      ...base,
      assignments: [{ ...base.assignments[0]!, resourceFootprints: [footprint] }],
      supportMinutes: 30,
      bufferMinutes: 15,
      nominalResourceMinutes: 105,
      unionedResourceMinutes: 105,
      resourceClaims: [productive, support, buffer],
    },
    proposal = deriveOrdinaryProposal({
      allocation: allocation([enriched]),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "2026-09-04T12:00:00.000Z",
    });
  if (proposal.status !== "proposed") throw new Error("proposal fixture failed");
  const option = proposal.proposal.options[0]!;
  return {
    recordType: "acceptedAllocation",
    version: 2,
    revision: 1,
    id: "accepted-allocation",
    decisionId: "proposal-decision",
    proposalId: proposal.proposal.id,
    proposalRevision: proposal.proposal.revision,
    sourceOptionId: option.id,
    acceptedAt: "2026-09-04T12:30:00.000Z",
    actor: { kind: "user" },
    scope: structuredClone(option.scope),
    productiveMinutes: 60,
    supportMinutes: 30,
    bufferMinutes: 15,
    nominalResourceMinutes: 105,
    totalResourceMinutes: 105,
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

function facts() {
  const authority = accepted();
  return authority.claims.map((claim) => {
    const result = createRealizedScheduleFactValue({
      acceptedAllocation: authority,
      acceptedClaimId: claim.id,
      realizationId,
    });
    if (result.status !== "created") throw new Error(result.reason);
    return result.fact;
  });
}

describe("Realized Schedule Identity Foundation V1", () => {
  it("constructs distinct deterministic Goal-work, support, and Buffer identities", () => {
    const first = facts(),
      second = facts();
    expect(first).toEqual(second);
    expect(first.map((fact) => fact.scheduleRole)).toEqual([
      "supportActivity",
      "productiveGoalWork",
      "bufferProtection",
    ]);
    expect(first.map((fact) => fact.sourceKind)).toEqual([
      "acceptedAllocation",
      "acceptedAllocation",
      "acceptedAllocation",
    ]);
    expect(first.every((fact) => validateRealizedScheduleFact(fact).status === "valid")).toBe(true);
    expect(first).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          scheduleRole: "productiveGoalWork",
          placement: "fixedAcceptedGeometry",
          recurrence: "none",
          executionEligibility: "eligible",
          lineage: expect.objectContaining({ relationship: { kind: "productiveRoot" } }),
        }),
        expect.objectContaining({
          scheduleRole: "supportActivity",
          executionEligibility: "eligible",
          lineage: expect.objectContaining({
            componentId: "setup",
            relationship: expect.objectContaining({ kind: "supportsProductive" }),
          }),
        }),
        expect.objectContaining({
          scheduleRole: "bufferProtection",
          timeSemantics: "protection",
          executionEligibility: "prohibited",
          lineage: expect.objectContaining({
            componentId: "recovery",
            relationship: expect.objectContaining({ kind: "protectsSupport" }),
          }),
        }),
      ]),
    );
    expect(JSON.parse(JSON.stringify(first))).toEqual(first);
  });

  it("makes Goal work and support valid stable execution references while prohibiting Buffer", () => {
    const [support, productive, buffer] = facts() as [
      RealizedScheduleFactV1,
      RealizedScheduleFactV1,
      RealizedScheduleFactV1,
    ];
    for (const fact of [productive, support]) {
      const eligible = executionReferenceForRealizedSchedule(fact);
      expect(eligible.status).toBe("eligible");
      if (eligible.status !== "eligible") continue;
      const result = createExecutionAssertion(
        {
          subject: { kind: "planned", reference: eligible.reference },
          snapshot: {
            sourceFamily: "acceptedAllocation",
            title: "Accepted activity",
            category: "optional",
            userDay: {
              date: fact.userDayDate,
              dayBoundaryStartTime: "04:00",
              utcOffsetMinutes: -300,
            },
            plan: { state: "scheduled", startsAt: fact.startsAt, endsAt: fact.endsAt },
          },
          outcome: "completed",
        },
        {
          allocateRecordId: () => "11111111-1111-4111-8111-111111111111" as never,
          allocateSubjectId: () => "22222222-2222-4222-8222-222222222222" as never,
          now: () => "2026-09-04T18:00:00.000Z",
        },
      );
      expect(result.status).toBe("created");
    }
    expect(executionReferenceForRealizedSchedule(buffer).status).toBe("prohibited");
    expect(
      createExecutionAssertion(
        {
          subject: { kind: "planned", reference: realizedScheduleReference(buffer) },
          snapshot: {
            sourceFamily: "acceptedAllocation",
            title: "Buffer",
            category: "recovery",
            userDay: {
              date: buffer.userDayDate,
              dayBoundaryStartTime: "04:00",
              utcOffsetMinutes: -300,
            },
            plan: { state: "scheduled", startsAt: buffer.startsAt, endsAt: buffer.endsAt },
          },
          outcome: "completed",
        },
        {
          allocateRecordId: () => "33333333-3333-4333-8333-333333333333" as never,
          allocateSubjectId: () => "44444444-4444-4444-8444-444444444444" as never,
          now: () => "2026-09-04T18:00:00.000Z",
        },
      ),
    ).toMatchObject({
      status: "invalidInput",
      issues: expect.arrayContaining(["Buffer protection is not an execution subject"]),
    });
  });

  it("publishes immutable accepted lineage for all roles and keeps Buffer non-reportable", () => {
    const values = facts(),
      snapshots = values.map((fact) =>
        createHistoricalRealizedScheduleSnapshot({
          fact,
          title: fact.scheduleRole,
          category: fact.scheduleRole === "bufferProtection" ? "recovery" : "optional",
        }),
      ),
      result = createPlanPublicationBatch(
        {
          range: { startUserDayDate: "2026-09-04", endUserDayDate: "2026-09-04" },
          days: [
            {
              version: 1,
              userDayDate: "2026-09-04",
              dayBoundaryStartTime: "04:00",
              weekStartsOn: "monday",
              utcOffsetMinutes: -300,
              occurrences: snapshots,
            },
          ],
        },
        {
          allocateBatchId: () => "55555555-5555-4555-8555-555555555555" as never,
          now: () => "2026-09-04T18:00:00.000Z",
        },
      );
    expect(result.status).toBe("created");
    if (result.status !== "created") return;
    expect(validatePlanPublicationBatch(result.batch).status).toBe("valid");
    expect(result.batch.days[0]!.occurrences.map((item) => item.sourceFamily)).toEqual([
      "acceptedAllocation",
      "acceptedAllocation",
      "acceptedAllocation",
    ]);
    const buffer = result.batch.days[0]!.occurrences.find(
      (item) => item.version === 3 && item.scheduleRole === "bufferProtection",
    )!;
    expect(
      materializeHistoricalPlanExecutionTarget({ day: result.batch.days[0]!, occurrence: buffer }),
    ).toEqual({ status: "notReportable" });
    const activity = result.batch.days[0]!.occurrences.find(
      (item) => item.version === 3 && item.scheduleRole === "productiveGoalWork",
    )!;
    expect(
      materializeHistoricalPlanExecutionTarget({
        day: result.batch.days[0]!,
        occurrence: activity,
      }),
    ).toMatchObject({
      status: "materialized",
      target: { reference: { sourceKind: "acceptedAllocation" } },
    });
  });
});
