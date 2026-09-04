import { describe, expect, it } from "vitest";
import type { DemandProjectionV1 } from "./goalDemandProjection.js";
import type { CapacityResultV1 } from "./capacity.js";
import { evaluateGoalFeasibility } from "./goalFeasibility.js";

function demand(patch: Partial<DemandProjectionV1> = {}): DemandProjectionV1 {
  return {
    version: 1,
    semanticId: "demand",
    demandId: "d" as never,
    demandRevision: 1 as never,
    goalId: "g" as never,
    goalRevision: 1 as never,
    policy: { id: "goal-demand-projection", version: 1 },
    coverage: {
      version: 1,
      kind: "canonicalUserDayInterval",
      startUserDayDate: "2026-09-07",
      endUserDayDateExclusive: "2026-09-08",
      startsAt: "2026-09-07T04:00:00.000Z",
      endsAt: "2026-09-08T04:00:00.000Z",
      startDayBoundaryTime: "04:00",
      endDayBoundaryTime: "04:00",
    },
    requestedEffort: { unit: "minutes", amount: 90 },
    session: { mode: "indivisible", exactMinutes: 90 },
    satisfaction: { kind: "minimum", allowPartial: false },
    cadence: { kind: "total" },
    structuralEligibility: "eligible",
    applicability: "applicable",
    reasons: [],
    dependencies: [],
    dependencyFingerprint: {
      version: 1,
      algorithm: "fnv1a64-canonical-v1",
      ordering: "set",
      value: "d",
    },
    provenance: {
      version: 1,
      role: "derivedArtifact",
      origin: { kind: "derivedFromDependencies" },
    },
    ...patch,
  };
}
function capacity(durations: number[]): CapacityResultV1 {
  const intervals = durations.map((duration, index) => ({
    version: 1 as const,
    id: `c${index}`,
    startsAt: `2026-09-07T${String(5 + index * 3).padStart(2, "0")}:00:00.000Z`,
    endsAt: new Date(
      Date.parse(`2026-09-07T${String(5 + index * 3).padStart(2, "0")}:00:00.000Z`) +
        duration * 60_000,
    ).toISOString(),
    durationMinutes: duration,
    userDayDate: "2026-09-07" as const,
    userDayWindow: { startsAt: "2026-09-07T04:00:00.000Z", endsAt: "2026-09-08T04:00:00.000Z" },
    coverage: "complete" as const,
    allocability: "allocatable" as const,
    reasons: [],
    adjacentExclusions: { before: [], after: [] },
    dependencyFingerprint: {
      version: 1 as const,
      algorithm: "fnv1a64-canonical-v1" as const,
      ordering: "set" as const,
      value: "cap",
    },
    provenance: {
      version: 1 as const,
      role: "derivedArtifact" as const,
      origin: { kind: "derivedFromDependencies" as const },
    },
  }));
  return {
    version: 1,
    queryId: "q",
    fingerprint: "cap",
    policy: { id: "capacity", version: 1 },
    generalAvailabilityPolicy: { id: "neutral-geometric-openings", version: 1 },
    query: {
      startUserDayDate: "2026-09-07",
      endUserDayDateExclusive: "2026-09-08",
      requestedStartsAt: "2026-09-07T04:00:00.000Z",
      requestedEndsAt: "2026-09-08T04:00:00.000Z",
      coveredStartsAt: "2026-09-07T04:00:00.000Z",
      coveredEndsAt: "2026-09-08T04:00:00.000Z",
    },
    qualification: {
      freshness: "current",
      coverage: "complete",
      integrity: "valid",
      liability: "resolved",
      allocability: "allocatable",
    },
    userDays: [],
    intervals,
    exclusions: [],
    liabilities: [],
    summary: {
      totalEligibleMinutes: durations.reduce((a, b) => a + b, 0),
      fullyAllocatableMinutes: durations.reduce((a, b) => a + b, 0),
      qualifiedMinutes: 0,
      longestAllocatableMinutes: Math.max(0, ...durations),
      intervalCount: durations.length,
      perUserDay: [],
      liabilityMinutes: 0,
    },
    dependencyFingerprint: {
      version: 1,
      algorithm: "fnv1a64-canonical-v1",
      ordering: "set",
      value: "cap",
    },
    provenance: {
      version: 1,
      role: "derivedArtifact",
      origin: { kind: "derivedFromDependencies" },
    },
  };
}

describe("Goal-Specific Feasibility V1", () => {
  it("requires one contiguous opportunity for indivisible Demand", () => {
    expect(
      evaluateGoalFeasibility({ demand: demand(), capacity: capacity([30, 30, 30]) }),
    ).toMatchObject({
      classification: "infeasible",
      compatibleMinutes: 0,
      reasons: [{ code: "insufficientContiguousDuration" }],
    });
    expect(evaluateGoalFeasibility({ demand: demand(), capacity: capacity([120]) })).toMatchObject({
      classification: "feasible",
      compatibleMinutes: 90,
      opportunitySets: [{ sessionCount: 1, satisfaction: "full" }],
    });
  });
  it("builds deterministic legal splittable sets with minimum and maximum sessions", () => {
    const projected = demand({
      session: { mode: "splittable", minimumMinutes: 30, preferredMinutes: 45, maximumMinutes: 60 },
      cadence: { kind: "total" },
    });
    const first = evaluateGoalFeasibility({ demand: projected, capacity: capacity([60, 45]) });
    expect(first).toMatchObject({ classification: "feasible", compatibleMinutes: 90 });
    expect(first).toEqual(
      evaluateGoalFeasibility({ demand: projected, capacity: capacity([60, 45]) }),
    );
  });
  it("reports permitted partial satisfaction without allocating Capacity", () => {
    const cap = capacity([60]),
      before = structuredClone(cap);
    const result = evaluateGoalFeasibility({
      demand: demand({
        session: { mode: "splittable", minimumMinutes: 30 },
        satisfaction: { kind: "target", allowPartial: true, minimumSatisfiedMinutes: 45 },
      }),
      capacity: cap,
    });
    expect(result).toMatchObject({
      classification: "partiallyFeasible",
      compatibleMinutes: 60,
      unsatisfiedMinutes: 30,
    });
    expect(cap).toEqual(before);
  });
  it("preserves structural, stale, and unavailable-coverage causes", () => {
    expect(
      evaluateGoalFeasibility({
        demand: demand({ structuralEligibility: "ineligible", applicability: "inapplicable" }),
        capacity: capacity([120]),
      }).classification,
    ).toBe("structurallyIneligible");
    expect(
      evaluateGoalFeasibility({
        demand: demand(),
        capacity: {
          ...capacity([120]),
          qualification: { ...capacity([120]).qualification, freshness: "stale" },
        },
      }).classification,
    ).toBe("stale");
    expect(
      evaluateGoalFeasibility({
        demand: demand(),
        capacity: {
          ...capacity([120]),
          qualification: { ...capacity([120]).qualification, coverage: "partial" },
        },
      }).classification,
    ).toBe("unavailableCoverage");
  });
  it("allows separate Goals to reference the same unchanged Capacity", () => {
    const cap = capacity([120]);
    const a = evaluateGoalFeasibility({
      demand: demand({ semanticId: "a", goalId: "a" as never }),
      capacity: cap,
    });
    const b = evaluateGoalFeasibility({
      demand: demand({ semanticId: "b", goalId: "b" as never }),
      capacity: cap,
    });
    expect(a.opportunitySets[0]!.opportunities[0]!.capacityIntervalId).toBe("c0");
    expect(b.opportunitySets[0]!.opportunities[0]!.capacityIntervalId).toBe("c0");
    expect(cap.fingerprint).toBe("cap");
  });
});
