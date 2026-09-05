import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { ALLOCATION_POLICY_V1, type AllocationResultV1 } from "../core/planning/allocation.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createDayFrameBackupV10 } from "./dayFrameBackupV10.js";
import { translateBackupV10ToV11, validateDayFrameBackupV11 } from "./dayFrameBackupV11.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createExecutionHistoryIndexedDb } from "./executionHistoryIndexedDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { createProposalSurface } from "./proposalSurface.js";
import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";

class MemoryStorage implements Storage {
  values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}
const horizon = { startUserDayDate: "2026-09-04", endUserDayDateExclusive: "2026-09-05" };
function allocation(): AllocationResultV1 {
  const partition = {
    id: "partition",
    demandProjectionId: "demand",
    capacityIntervalId: "capacity",
    opportunityId: "opportunity",
    startsAt: "2026-09-04T15:00:00.000Z",
    endsAt: "2026-09-04T16:00:00.000Z",
    durationMinutes: 60,
    userDayDate: "2026-09-04",
    sessionIndex: 0,
  };
  const resourceClaim = {
    id: "claim",
    role: "productive" as const,
    startsAt: partition.startsAt,
    endsAt: partition.endsAt,
    durationMinutes: partition.durationMinutes,
    userDayDate: partition.userDayDate as `${number}-${number}-${number}`,
    capacityIntervalId: partition.capacityIntervalId,
    requiredness: "required" as const,
    candidateParentId: partition.opportunityId,
    goalId: "goal",
    demandId: "demand",
    demandRevision: 1,
    demandProjectionId: partition.demandProjectionId,
    productiveOpportunityId: partition.opportunityId,
    source: { kind: "direct" as const },
    relationship: { kind: "productiveRoot" as const },
    dependencyFingerprint: "claim-dependency",
    provenance: {
      version: 1 as const,
      role: "derivedArtifact" as const,
      origin: { kind: "derivedFromDependencies" as const },
    },
  };
  const resourceFootprint = {
    version: 1 as const,
    id: "footprint",
    candidateParentId: partition.opportunityId,
    productiveClaims: [resourceClaim],
    supportClaims: [],
    bufferClaims: [],
    omittedOptionalComponentIds: [],
    productiveMinutes: 60,
    supportMinutes: 0,
    bufferMinutes: 0,
    nominalResourceMinutes: 60,
    unionedResourceMinutes: 60,
    dependencyFingerprint: "footprint-dependency",
    provenance: resourceClaim.provenance,
  };
  const alternative = {
    version: 1 as const,
    id: "alternative",
    competingSetId: "set",
    policy: ALLOCATION_POLICY_V1,
    assignments: [
      {
        demandProjectionId: "demand",
        goalId: "goal",
        requestedMinutes: 60,
        attributedMinutes: 0 as const,
        remainingRequestedMinutes: 60,
        assignedMinutes: 60,
        unmetMinutes: 0,
        outcome: "full" as const,
        priorityEvidence: [],
        partitions: [partition],
        resourceFootprints: [resourceFootprint],
        reasons: [{ code: "fullySatisfied" as const }],
      },
    ],
    claimedMinutes: 60,
    productiveMinutes: 60,
    supportMinutes: 0,
    bufferMinutes: 0,
    nominalResourceMinutes: 60,
    unionedResourceMinutes: 60,
    resourceClaims: [resourceClaim],
    unallocatedCapacity: [],
    reasons: [],
    dependencyFingerprint: "alternative-dependency",
    freshness: "current" as const,
    provenance: {
      version: 1 as const,
      role: "derivedArtifact" as const,
      origin: { kind: "derivedFromDependencies" as const },
      algorithm: { id: "goal-allocation", version: 1 },
    },
  };
  return {
    version: 1,
    id: "allocation",
    policy: ALLOCATION_POLICY_V1,
    competingSetId: "set",
    capacityFingerprint: "capacity-fingerprint",
    alternatives: [alternative as never],
    preferredAlternativeId: alternative.id,
    search: { examined: 1, limit: 512, truncated: false },
    dependencyFingerprint: "allocation-dependency",
    freshness: "current",
    provenance: alternative.provenance,
  };
}

describe("Backup V10/V11 integration", () => {
  it("exports explicit empty Proposal authority from the resolved-ready fixture", async () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: new MemoryStorage(),
    });
    expect(
      await createReadyDayFrameTestStore().exportBackupV10("2026-09-04T12:00:00.000Z"),
    ).toMatchObject({ status: "exported", backup: { version: 10 } });
  });
  it("round-trips complete accepted authority in V11 and refuses lossy V10/V9", async () => {
    const local = new MemoryStorage(),
      factory = new IDBFactory(),
      name = "backup-v10";
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: local });
    const setup = () => {
      const db = createDayFrameDurableDb({ indexedDB: factory, name });
      return createDayFrameStore(undefined, {
        restoreStorage: local,
        restoreIndexedDb: db,
        executionHistoryIndexedDb: createExecutionHistoryIndexedDb({ storage: db }),
        historicalPlanSurface: createHistoricalPlanSurface({ storage: db }),
        proposalSurface: createProposalSurface({ storage: db }),
      });
    };
    const store = setup();
    await store.whenReady();
    const generated = store.deriveProposal({
      allocation: allocation(),
      horizon,
      allocationHorizon: horizon,
      generatedAt: "2026-09-04T12:00:00.000Z",
    });
    if (!generated || generated.status !== "proposed") throw new Error("expected proposal");
    await store.recordProposal(generated);
    const scheduleBefore = JSON.stringify(store.getState());
    const progressBefore = store.exportProgressObservationAuthority();
    await store.acceptProposalOption({
      proposalId: generated.proposal.id,
      proposalRevision: 1,
      optionId: generated.proposal.preferredOptionId,
      current: generated,
    });
    expect(JSON.stringify(store.getState())).toBe(scheduleBefore);
    expect(store.exportProgressObservationAuthority()).toEqual(progressBefore);
    expect((await store.exportBackupV9("2026-09-04T12:00:00.000Z")).status).toBe("exportFailure");
    expect((await store.exportBackupV10("2026-09-04T12:00:00.000Z")).status).toBe("exportFailure");
    const exported = await store.exportBackupV11("2026-09-04T12:00:00.000Z");
    expect(exported.status).toBe("exported");
    if (exported.status !== "exported") return;
    await store.clearLocalData();
    expect((await store.importBackupV11(exported.backup)).status).toBe("restoredV11");
    expect(store.exportProposalAuthority()).toEqual(exported.backup.data.proposals);
    expect(exported.backup.data.proposals.acceptedAllocations[0]).toMatchObject({
      version: 2,
      footprintCompleteness: "complete",
      productiveMinutes: 60,
      supportMinutes: 0,
      bufferMinutes: 0,
    });
    const accepted = exported.backup.data.proposals.acceptedAllocations[0]!;
    if (accepted.version !== 2) throw new Error("expected complete acceptance");
    const {
      resourceFootprints: omittedFootprints,
      nominalResourceMinutes: omittedNominal,
      footprintCompleteness: omittedCompleteness,
      version: omittedVersion,
      ...legacyAccepted
    } = accepted;
    void omittedFootprints;
    void omittedNominal;
    void omittedCompleteness;
    void omittedVersion;
    const legacy = createDayFrameBackupV10(
      {
        ...exported.backup.data,
        goalPlanning: {
          version: 1,
          demands: exported.backup.data.goalPlanning.demands,
          priorities: exported.backup.data.goalPlanning.priorities,
        },
        proposals: {
          ...exported.backup.data.proposals,
          acceptedAllocations: [{ ...legacyAccepted, version: 1 }],
        },
      },
      exported.backup.exportedAt,
    );
    expect(translateBackupV10ToV11(legacy).data.proposals.acceptedAllocations[0]).toMatchObject({
      version: 1,
      footprintCompleteness: "legacyProductiveOnly",
    });
    const malformed = structuredClone(exported.backup);
    const malformedAccepted = malformed.data.proposals.acceptedAllocations[0]!;
    if (malformedAccepted.version === 2) malformedAccepted.supportMinutes = 99;
    expect(() => validateDayFrameBackupV11(malformed)).toThrow(
      "Backup V11 Proposal authority is invalid.",
    );
  });
});
