import { describe, expect, it } from "vitest";
import type { CapacityResultV1 } from "./capacity.js";
import type { CompetingDemandInputV1 } from "./competingDemand.js";
import { deriveCompetingDemandSets } from "./competingDemand.js";
import { allocateCompetingDemandSet, evaluateAllocationFreshness } from "./allocation.js";

const capacity = {
  fingerprint: "capacity",
  query: {
    startUserDayDate: "2026-09-07",
    endUserDayDateExclusive: "2026-09-08",
    requestedStartsAt: "2026-09-07T04:00:00.000Z",
    requestedEndsAt: "2026-09-08T04:00:00.000Z",
    coveredStartsAt: "2026-09-07T04:00:00.000Z",
    coveredEndsAt: "2026-09-08T04:00:00.000Z",
  },
  qualification: { freshness: "current", coverage: "complete" },
  intervals: [
    {
      id: "capacity-1",
      startsAt: "2026-09-07T09:00:00.000Z",
      endsAt: "2026-09-07T11:00:00.000Z",
      durationMinutes: 120,
      userDayDate: "2026-09-07",
      allocability: "allocatable",
    },
  ],
} as unknown as CapacityResultV1;

function entry(
  id: string,
  goalId: string,
  level: "low" | "normal" | "high" | "critical",
  startsAt = "2026-09-07T09:00:00.000Z",
  endsAt = "2026-09-07T10:00:00.000Z",
): CompetingDemandInputV1 {
  const opportunity = {
    id: `op-${id}`,
    capacityIntervalId: "capacity-1",
    startsAt,
    endsAt,
    durationMinutes: (Date.parse(endsAt) - Date.parse(startsAt)) / 60_000,
    userDayDate: "2026-09-07",
  };
  const claim = {
    ...opportunity,
    role: "productive" as const,
    requiredness: "required" as const,
    candidateParentId: opportunity.id,
    goalId,
    demandId: id,
    demandRevision: 1,
    demandProjectionId: id,
    productiveOpportunityId: opportunity.id,
    source: { kind: "direct" as const },
    relationship: { kind: "productiveRoot" as const },
    dependencyFingerprint: `footprint-${id}`,
    provenance: {
      version: 1 as const,
      role: "derivedArtifact" as const,
      origin: { kind: "derivedFromDependencies" as const },
    },
  };
  const resourceFootprint = {
    version: 1 as const,
    id: `footprint-${id}`,
    candidateParentId: opportunity.id,
    productiveClaims: [claim],
    supportClaims: [],
    bufferClaims: [],
    omittedOptionalComponentIds: [],
    productiveMinutes: opportunity.durationMinutes,
    supportMinutes: 0,
    bufferMinutes: 0,
    nominalResourceMinutes: opportunity.durationMinutes,
    unionedResourceMinutes: opportunity.durationMinutes,
    dependencyFingerprint: `footprint-${id}`,
    provenance: claim.provenance,
  };
  return {
    demand: {
      semanticId: id,
      goalId,
      requestedEffort: { amount: opportunity.durationMinutes },
    } as never,
    feasibility: {
      id: `feas-${id}`,
      capacityFingerprint: capacity.fingerprint,
      classification: "feasible",
      opportunitySets: [
        {
          id: `set-${id}`,
          opportunities: [{ ...opportunity, resourceFootprint }],
          totalCompatibleMinutes: opportunity.durationMinutes,
          satisfaction: "full",
          sessionCount: 1,
          unmetMinutes: 0,
        },
      ],
    } as never,
    priorities: [
      {
        id: `priority-${id}`,
        revision: 1,
        goalId,
        level,
        scope: { kind: "default" },
      } as never,
    ],
  };
}
function compete(entries: CompetingDemandInputV1[]) {
  return deriveCompetingDemandSets({
    capacity,
    demands: entries,
    evaluationCutoff: "2026-09-04T12:00:00.000Z",
  });
}

describe("Competing Demand and Allocation V1", () => {
  it("derives exact overlap edges, connected components, and deterministic identities", () => {
    const a = entry("a", "goal-a", "normal"),
      b = entry("b", "goal-b", "normal", "2026-09-07T09:30:00.000Z", "2026-09-07T10:30:00.000Z"),
      c = entry("c", "goal-c", "normal", "2026-09-07T10:15:00.000Z", "2026-09-07T11:00:00.000Z");
    const first = compete([c, a, b]);
    expect(first.sets).toHaveLength(1);
    expect(first.sets[0]).toMatchObject({
      kind: "competing",
      demandProjectionIds: ["a", "b", "c"],
    });
    expect(first.sets[0]!.edges).toHaveLength(2);
    expect(first).toEqual(compete([a, b, c]));
  });
  it("emits singleton components and does not create edges for disjoint claims", () => {
    const result = compete([
      entry("a", "goal-a", "normal", "2026-09-07T09:00:00.000Z", "2026-09-07T10:00:00.000Z"),
      entry("b", "goal-b", "normal", "2026-09-07T10:00:00.000Z", "2026-09-07T11:00:00.000Z"),
    ]);
    expect(result.sets.map((set) => set.kind)).toEqual(["singleton", "singleton"]);
  });
  it("uses exact scoped Goal Priority only when claims compete", () => {
    const highA = [entry("a", "goal-a", "high"), entry("b", "goal-b", "low")],
      highB = [entry("a", "goal-a", "low"), entry("b", "goal-b", "high")];
    const allocationA = allocateCompetingDemandSet({
        set: compete(highA).sets[0]!,
        capacity,
        demands: highA,
      }),
      allocationB = allocateCompetingDemandSet({
        set: compete(highB).sets[0]!,
        capacity,
        demands: highB,
      });
    const winner = (result: typeof allocationA) =>
      result.alternatives[0]!.assignments.find((item) => item.outcome === "full")!
        .demandProjectionId;
    expect(winner(allocationA)).toBe("a");
    expect(winner(allocationB)).toBe("b");
    expect(capacity.fingerprint).toBe("capacity");
    expect(
      allocationA.alternatives[0]!.assignments.find((item) => item.outcome === "unsatisfied")!
        .reasons,
    ).toEqual([{ code: "higherPriorityClaim" }]);
  });
  it("uses semantic ID as an equal-priority technical tie-break", () => {
    const entries = [entry("b", "goal-b", "normal"), entry("a", "goal-a", "normal")],
      result = allocateCompetingDemandSet({
        set: compete(entries).sets[0]!,
        capacity,
        demands: entries,
      });
    expect(
      result.alternatives[0]!.assignments.find((item) => item.outcome === "full")!
        .demandProjectionId,
    ).toBe("a");
  });
  it("conserves Capacity and reports exact unallocated portions without mutation", () => {
    const entries = [entry("a", "goal-a", "normal")],
      before = structuredClone(capacity),
      result = allocateCompetingDemandSet({
        set: compete(entries).sets[0]!,
        capacity,
        demands: entries,
      }),
      preferred = result.alternatives[0]!;
    expect(preferred.claimedMinutes).toBe(60);
    expect(preferred.unallocatedCapacity).toEqual([
      {
        capacityIntervalId: "capacity-1",
        startsAt: "2026-09-07T10:00:00.000Z",
        endsAt: "2026-09-07T11:00:00.000Z",
        durationMinutes: 60,
        userDayDate: "2026-09-07",
      },
    ]);
    expect(capacity).toEqual(before);
  });
  it("keeps concurrent Demands of one Goal independent", () => {
    const entries = [entry("a1", "goal", "normal"), entry("a2", "goal", "normal")];
    expect(compete(entries).sets[0]!.demandProjectionIds).toEqual(["a1", "a2"]);
  });
  it("stales Allocation when a material Capacity dependency changes", () => {
    const entries = [entry("a", "goal-a", "normal")],
      set = compete(entries).sets[0]!,
      result = allocateCompetingDemandSet({ set, capacity, demands: entries });
    expect(evaluateAllocationFreshness(result, { set, capacity, demands: entries })).toEqual({
      status: "current",
    });
    expect(
      evaluateAllocationFreshness(result, {
        set,
        capacity: { ...capacity, fingerprint: "changed" },
        demands: entries,
      }).status,
    ).toBe("stale");
  });
});
