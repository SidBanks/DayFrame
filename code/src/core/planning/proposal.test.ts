import { describe, expect, it } from "vitest";
import {
  createModificationCandidate,
  deriveOrdinaryProposal,
  emptyProposalAuthority,
  evaluateProposalFreshness,
  transitionProposal,
  validateProposalAuthority,
} from "./proposal.js";
import { allocation, horizon } from "./proposalTestFixtures.js";

describe("Constructive Proposal V1", () => {
  it("maps preferred and materially distinct Allocation alternatives deterministically", () => {
    const first = deriveOrdinaryProposal({
      allocation: allocation(),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "2026-09-04T12:00:00.000Z",
    });
    const reordered = deriveOrdinaryProposal({
      allocation: allocation(allocation().alternatives.slice().reverse()),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "2026-09-04T12:00:00.000Z",
    });
    expect(first).toEqual(reordered);
    expect(first.status).toBe("proposed");
    if (first.status !== "proposed") return;
    expect(first.proposal.options).toHaveLength(2);
    expect(first.proposal.options[0]).toMatchObject({
      preferred: true,
      productiveMinutes: 60,
      supportMinutes: 0,
      bufferMinutes: 0,
      totalResourceMinutes: 60,
    });
    expect(first.proposal.scope.acceptance).toBe("oneOff");
  });

  it("separates invalid horizon from typed No-Proposal", () => {
    expect(
      deriveOrdinaryProposal({
        allocation: allocation(),
        horizon: { ...horizon, endUserDayDateExclusive: "2026-09-04" },
        allocationHorizon: horizon,
        generatedAt: "now",
      }).status,
    ).toBe("invalid");
    expect(
      deriveOrdinaryProposal({
        allocation: allocation([]),
        horizon,
        allocationHorizon: horizon,
        generatedAt: "now",
      }),
    ).toMatchObject({ status: "noProposal", result: { reasons: [{ code: "noMinimumFit" }] } });
  });

  it("propagates support and Buffer costs instead of applying the legacy zero assumption", () => {
    const source = allocation().alternatives[0]!,
      productive = source.resourceClaims[0]!,
      support = {
        ...productive,
        id: "support",
        role: "supportActivity" as const,
        componentId: "setup",
        startsAt: "2026-09-04T14:30:00.000Z",
        endsAt: "2026-09-04T15:00:00.000Z",
        durationMinutes: 30,
        relationship: { kind: "supportsProductive" as const, productiveClaimId: productive.id },
      },
      buffer = {
        ...productive,
        id: "buffer",
        role: "bufferProtection" as const,
        componentId: "recovery",
        startsAt: "2026-09-04T16:00:00.000Z",
        endsAt: "2026-09-04T16:15:00.000Z",
        durationMinutes: 15,
        relationship: {
          kind: "protectsSupport" as const,
          supportClaimId: "support",
          supportComponentId: "setup",
        },
      },
      footprint = {
        ...source.assignments[0]!.resourceFootprints[0]!,
        supportClaims: [support],
        bufferClaims: [buffer],
        supportMinutes: 30,
        bufferMinutes: 15,
        nominalResourceMinutes: 105,
        unionedResourceMinutes: 105,
      },
      enriched = {
        ...source,
        assignments: [{ ...source.assignments[0]!, resourceFootprints: [footprint] }],
        supportMinutes: 30,
        bufferMinutes: 15,
        nominalResourceMinutes: 105,
        unionedResourceMinutes: 105,
        resourceClaims: [productive, support, buffer],
      };
    const result = deriveOrdinaryProposal({
      allocation: allocation([enriched]),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "now",
    });
    expect(result).toMatchObject({
      status: "proposed",
      proposal: {
        options: [
          {
            productiveMinutes: 60,
            supportMinutes: 30,
            bufferMinutes: 15,
            totalResourceMinutes: 105,
            assumptions: [],
            claims: [
              { role: "supportActivity" },
              { role: "productive" },
              { role: "bufferProtection" },
            ],
          },
        ],
      },
    });
  });

  it("allows overhead outside Proposal Horizon only when Planning Data Horizon covers the full footprint", () => {
    const source = allocation().alternatives[0]!;
    const productive = source.resourceClaims[0]!;
    const support = {
      ...productive,
      id: "outside-support",
      role: "supportActivity" as const,
      userDayDate: "2026-09-03",
      startsAt: "2026-09-03T23:30:00.000Z",
      endsAt: "2026-09-04T00:00:00.000Z",
      relationship: { kind: "supportsProductive" as const, productiveClaimId: productive.id },
    };
    const enriched = { ...source, resourceClaims: [productive, support] };
    const wider = {
      startUserDayDate: "2026-09-03",
      endUserDayDateExclusive: horizon.endUserDayDateExclusive,
    };
    expect(
      deriveOrdinaryProposal({
        allocation: allocation([enriched as never]),
        horizon,
        allocationHorizon: horizon,
        planningDataHorizon: wider,
        generatedAt: "now",
      }),
    ).toMatchObject({
      status: "proposed",
      proposal: {
        horizon,
        options: [
          {
            claims: expect.arrayContaining([expect.objectContaining({ id: "outside-support" })]),
          },
        ],
      },
    });
    expect(
      deriveOrdinaryProposal({
        allocation: allocation([enriched as never]),
        horizon,
        allocationHorizon: horizon,
        planningDataHorizon: horizon,
        generatedAt: "now",
      }),
    ).toMatchObject({ status: "noProposal", result: { reasons: [{ code: "incompleteInput" }] } });
  });

  it.each([
    ["policyAbstained", "policyAbstained"],
    ["compositionInfeasible", "compositionInfeasible"],
    ["noUnmetDemand", "noUnmetDemand"],
  ] as const)(
    "returns typed %s No-Proposal without treating it as an error",
    (reason, expected) => {
      expect(
        deriveOrdinaryProposal({
          allocation: allocation(),
          horizon,
          allocationHorizon: horizon,
          generatedAt: "now",
          abstainReason: reason,
        }),
      ).toMatchObject({ status: "noProposal", result: { reasons: [{ code: expected }] } });
    },
  );

  it("abstains on unknown decisive input and structurally inapplicable input", () => {
    expect(
      deriveOrdinaryProposal({
        allocation: allocation(),
        horizon,
        allocationHorizon: horizon,
        generatedAt: "now",
        inputQualification: "unknown",
      }),
    ).toMatchObject({ status: "noProposal", result: { reasons: [{ code: "incompleteInput" }] } });
    expect(
      deriveOrdinaryProposal({
        allocation: allocation(),
        horizon,
        allocationHorizon: horizon,
        generatedAt: "now",
        inputQualification: "inapplicable",
      }),
    ).toMatchObject({
      status: "noProposal",
      result: { reasons: [{ code: "structurallyBlocked" }] },
    });
  });

  it("rejects Proposal horizons outside upstream coverage", () => {
    expect(
      deriveOrdinaryProposal({
        allocation: allocation(),
        horizon: { startUserDayDate: "2026-09-03", endUserDayDateExclusive: "2026-09-05" },
        allocationHorizon: horizon,
        generatedAt: "now",
      }),
    ).toMatchObject({ status: "invalid", reasons: [{ code: "horizonOutsideAllocation" }] });
  });

  it("creates a distinct bounded modification candidate without acceptance", () => {
    const result = deriveOrdinaryProposal({
      allocation: allocation(),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "now",
    });
    if (result.status !== "proposed") throw new Error("expected proposal");
    const option = result.proposal.options[0]!;
    const candidate = createModificationCandidate({
      proposal: result.proposal,
      optionId: option.id,
      delta: { claims: option.claims },
      createdAt: "later",
    });
    expect(candidate).toMatchObject({
      validation: "valid",
      sourceOptionId: option.id,
      actor: { kind: "user" },
    });
    expect(candidate!.id).not.toBe(option.id);
    expect(
      createModificationCandidate({
        proposal: result.proposal,
        optionId: option.id,
        delta: { claims: [{ ...option.claims[0]!, startsAt: "2026-09-04T14:00:00.000Z" }] },
        createdAt: "later",
      }),
    ).toMatchObject({ validation: "invalid", reasons: [{ code: "outOfScope" }] });
  });

  it("enforces lifecycle actionability and dependency freshness", () => {
    const result = deriveOrdinaryProposal({
      allocation: allocation(),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "now",
    });
    if (result.status !== "proposed") throw new Error("expected proposal");
    expect(transitionProposal(result.proposal, "shown")?.lifecycle).toBe("shown");
    const terminal = transitionProposal(result.proposal, "rejected")!;
    expect(transitionProposal(terminal, "accepted")).toBeUndefined();
    expect(evaluateProposalFreshness(result.proposal, result)).toEqual({ status: "current" });
    expect(
      evaluateProposalFreshness(
        result.proposal,
        deriveOrdinaryProposal({
          allocation: { ...allocation(), dependencyFingerprint: "changed" },
          horizon,
          allocationHorizon: horizon,
          generatedAt: "now",
        }),
      ).status,
    ).toBe("stale");
  });

  it("validates exact authority references and rejects duplicate accepted claims", () => {
    expect(validateProposalAuthority(emptyProposalAuthority()).status).toBe("valid");
    expect(
      validateProposalAuthority({
        ...emptyProposalAuthority(),
        decisions: [
          {
            recordType: "proposalDecision",
            version: 1,
            revision: 1,
            id: "decision",
            proposalId: "missing",
            proposalRevision: 1,
            decision: "rejectProposal",
            decidedAt: "now",
            actor: { kind: "user" },
            decisiveFingerprint: "x",
            provenance: {
              version: 1,
              role: "acceptedAuthority",
              origin: { kind: "directAuthoring" },
            },
          },
        ],
      }).status,
    ).toBe("invalid");
  });
});
