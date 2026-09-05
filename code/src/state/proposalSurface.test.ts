import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { allocation, horizon } from "../core/planning/proposalTestFixtures.js";
import { createProposalSurface } from "./proposalSurface.js";

function surface(name: string) {
  let next = 0;
  return createProposalSurface({
    storage: createDayFrameDurableDb({ indexedDB, name }),
    now: () => "2026-09-04T12:00:00.000Z",
    allocateId: () => `authority-${++next}`,
  });
}

describe("Proposal authority surface", () => {
  it("atomically records, accepts, freezes authority, and prevents double claims", async () => {
    const value = surface("proposal-accept");
    await value.initializeProposals();
    const generated = value.deriveProposal({
      allocation: allocation(),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "2026-09-04T12:00:00.000Z",
    });
    if (generated.status !== "proposed") throw new Error("expected proposal");
    await value.recordProposal(generated);
    const before = JSON.stringify(allocation());
    const accepted = await value.acceptProposalOption({
      proposalId: generated.proposal.id,
      proposalRevision: 1,
      optionId: generated.proposal.preferredOptionId,
      current: generated,
    });
    expect(accepted).toMatchObject({
      status: "accepted",
      value: {
        decision: { decision: "accept" },
        acceptedAllocation: { realization: "unrealized" },
      },
    });
    expect(value.exportProposalAuthority()).toMatchObject({
      decisions: [{ decision: "accept" }],
      acceptedAllocations: [{ productiveMinutes: 60, supportMinutes: 0, bufferMinutes: 0 }],
    });
    expect(JSON.stringify(allocation())).toBe(before);

    const competing = value.deriveProposal({
      allocation: { ...allocation(), id: "allocation-2" },
      horizon,
      allocationHorizon: horizon,
      generatedAt: "2026-09-04T12:00:00.000Z",
    });
    if (competing.status !== "proposed") throw new Error("expected proposal");
    await value.recordProposal(competing);
    expect(
      await value.acceptProposalOption({
        proposalId: competing.proposal.id,
        proposalRevision: 1,
        optionId: competing.proposal.preferredOptionId,
        current: competing,
      }),
    ).toMatchObject({ status: "rejected", reason: "conflictingClaim" });
  });

  it("persists rejection without Accepted Allocation and rejects later acceptance", async () => {
    const value = surface("proposal-reject");
    await value.initializeProposals();
    const generated = value.deriveProposal({
      allocation: allocation(),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "now",
    });
    if (generated.status !== "proposed") throw new Error("expected proposal");
    await value.recordProposal(generated);
    expect(
      (await value.rejectProposal({ proposalId: generated.proposal.id, proposalRevision: 1 }))
        .status,
    ).toBe("accepted");
    expect(value.exportProposalAuthority().acceptedAllocations).toEqual([]);
    expect(
      await value.acceptProposalOption({
        proposalId: generated.proposal.id,
        proposalRevision: 2,
        optionId: generated.proposal.preferredOptionId,
        current: generated,
      }),
    ).toMatchObject({ status: "rejected", reason: "notActionable" });
  });

  it("durably stales changed input without partially accepting", async () => {
    const value = surface("proposal-stale");
    await value.initializeProposals();
    const generated = value.deriveProposal({
      allocation: allocation(),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "now",
    });
    if (generated.status !== "proposed") throw new Error("expected proposal");
    await value.recordProposal(generated);
    const changed = value.deriveProposal({
      allocation: { ...allocation(), dependencyFingerprint: "changed" },
      horizon,
      allocationHorizon: horizon,
      generatedAt: "now",
    });
    expect(
      await value.acceptProposalOption({
        proposalId: generated.proposal.id,
        proposalRevision: 1,
        optionId: generated.proposal.preferredOptionId,
        current: changed,
      }),
    ).toMatchObject({ status: "rejected", reason: "stale" });
    expect(value.listActionableProposals()).toEqual([]);
    expect(value.exportProposalAuthority()).toMatchObject({
      decisions: [],
      acceptedAllocations: [],
      proposals: [
        { revision: 1, lifecycle: "generated" },
        { revision: 2, lifecycle: "stale" },
      ],
    });
  });

  it("records option rejection only and prevents that option from later acceptance", async () => {
    const value = surface("proposal-option-reject");
    await value.initializeProposals();
    const generated = value.deriveProposal({
      allocation: allocation(),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "now",
    });
    if (generated.status !== "proposed") throw new Error("expected proposal");
    await value.recordProposal(generated);
    const option = generated.proposal.options[0]!;
    expect(
      (
        await value.rejectOption({
          proposalId: generated.proposal.id,
          proposalRevision: 1,
          optionId: option.id,
        })
      ).status,
    ).toBe("accepted");
    expect(value.exportProposalAuthority().acceptedAllocations).toEqual([]);
    expect(
      await value.acceptProposalOption({
        proposalId: generated.proposal.id,
        proposalRevision: 1,
        optionId: option.id,
        current: generated,
      }),
    ).toMatchObject({ status: "rejected", reason: "notActionable" });
  });

  it("atomically links a successor while retaining immutable predecessor history", async () => {
    const value = surface("proposal-successor");
    await value.initializeProposals();
    const first = value.deriveProposal({
      allocation: allocation(),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "first",
    });
    if (first.status !== "proposed") throw new Error("expected proposal");
    await value.recordProposal(first);
    const successor = value.deriveProposal({
      allocation: { ...allocation(), id: "successor-allocation" },
      horizon,
      allocationHorizon: horizon,
      generatedAt: "second",
      predecessor: { id: first.proposal.id, revision: 1 },
    });
    if (successor.status !== "proposed") throw new Error("expected successor");
    expect((await value.supersedeProposal(first.proposal.id, 1, successor.proposal)).status).toBe(
      "accepted",
    );
    expect(value.resolveProposalRevision(first.proposal.id, 1)).toMatchObject({
      status: "resolved",
      proposal: { lifecycle: "generated" },
    });
    expect(value.resolveProposalRevision(first.proposal.id, 2)).toMatchObject({
      status: "resolved",
      proposal: { lifecycle: "superseded", successor: { id: successor.proposal.id } },
    });
  });

  it("creates then explicitly modify-and-accepts a valid candidate", async () => {
    const value = surface("proposal-modify");
    await value.initializeProposals();
    const generated = value.deriveProposal({
      allocation: allocation(),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "now",
    });
    if (generated.status !== "proposed") throw new Error("expected proposal");
    await value.recordProposal(generated);
    const option = generated.proposal.options[0]!;
    const created = await value.createModificationCandidate(generated.proposal.id, 1, option.id, {
      claims: option.claims,
    });
    if (created.status !== "accepted") throw new Error("expected candidate");
    expect(value.exportProposalAuthority().acceptedAllocations).toEqual([]);
    expect(
      (
        await value.modifyAndAcceptCandidate({
          proposalId: generated.proposal.id,
          proposalRevision: 1,
          candidateId: created.value.id,
          current: generated,
        })
      ).status,
    ).toBe("accepted");
    expect(value.exportProposalAuthority().decisions[0]?.decision).toBe("modifyAndAccept");
  });

  it("protects malformed persisted references and round-trips valid authority", async () => {
    const dbName = "proposal-restart";
    const first = surface(dbName);
    await first.initializeProposals();
    const generated = first.deriveProposal({
      allocation: allocation(),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "now",
    });
    if (generated.status !== "proposed") throw new Error("expected proposal");
    await first.recordProposal(generated);
    const second = surface(dbName);
    expect(await second.initializeProposals()).toEqual({ status: "ready" });
    expect(second.resolveProposalRevision(generated.proposal.id, 1).status).toBe("resolved");
  });
});
