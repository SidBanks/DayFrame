import { describe, expect, it } from "vitest";
import type { DraftScheduledBlock, BlockCandidate } from "../blocks/types.js";
import { deriveCapacity } from "./capacity.js";

const resolver = {
  shiftCycles: [],
  defaultSchedulingPreferences: {
    dayBoundaryStartTime: "04:00" as const,
    weekStartsOn: "monday" as const,
  },
};
const window = {
  startsAt: new Date("2026-09-07T04:00:00"),
  endsAt: new Date("2026-09-09T04:00:00"),
};
function block(
  id: string,
  start: string,
  end: string,
  buffers: [number, number] = [0, 0],
): DraftScheduledBlock {
  return {
    id,
    userId: "u",
    source: "manual",
    title: id,
    category: "maintenance",
    startsAt: new Date(start),
    endsAt: new Date(end),
    bufferBeforeMinutes: buffers[0],
    bufferAfterMinutes: buffers[1],
    userDayDate: "2026-09-07",
    userWeekStartDate: "2026-09-07",
    priority: 3,
    status: "planned",
    externalResources: [],
  };
}
function capacity(
  scheduledBlocks: DraftScheduledBlock[] = [],
  unplacedCandidates: BlockCandidate[] = [],
) {
  return deriveCapacity({
    startUserDayDate: "2026-09-07",
    endUserDayDateExclusive: "2026-09-08",
    resolver,
    schedule: {
      scheduledBlocks,
      generatedWorkBlocks: [],
      unplacedCandidates,
      planningWindow: window,
    },
  });
}

describe("Capacity V1", () => {
  it("represents accepted authority once: liability before realization, exclusion after", () => {
    const claim = {
      id: "accepted-claim",
      startsAt: "2026-09-07T10:00:00.000Z",
      endsAt: "2026-09-07T11:00:00.000Z",
      durationMinutes: 60,
      userDayDate: "2026-09-07",
    };
    const before = deriveCapacity({
      startUserDayDate: "2026-09-07",
      endUserDayDateExclusive: "2026-09-08",
      resolver,
      schedule: {
        scheduledBlocks: [],
        generatedWorkBlocks: [],
        unplacedCandidates: [],
        planningWindow: window,
        acceptedUnrealizedClaims: [claim as never],
      },
    });
    expect(before.liabilities).toMatchObject([{ kind: "acceptedAllocation", demandedMinutes: 60 }]);
    expect(before.summary.liabilityMinutes).toBe(60);

    const after = deriveCapacity({
      startUserDayDate: "2026-09-07",
      endUserDayDateExclusive: "2026-09-08",
      resolver,
      schedule: {
        scheduledBlocks: [],
        generatedWorkBlocks: [],
        unplacedCandidates: [],
        planningWindow: window,
        realizedScheduleFacts: [
          {
            ...claim,
            id: "scheduled-goal",
            sourceKind: "acceptedAllocation",
            scheduleRole: "productiveGoalWork",
          } as never,
        ],
      },
    });
    expect(after.liabilities).toEqual([]);
    expect(after.summary.totalEligibleMinutes).toBe(1380);
  });
  it("returns one full neutral-policy interval for an empty canonical user-day", () => {
    const result = capacity();
    expect(result.intervals).toMatchObject([
      {
        startsAt: new Date("2026-09-07T04:00:00").toISOString(),
        endsAt: new Date("2026-09-08T04:00:00").toISOString(),
        durationMinutes: 1440,
        userDayDate: "2026-09-07",
        allocability: "allocatable",
      },
    ]);
    expect(result.summary.fullyAllocatableMinutes).toBe(1440);
  });
  it("unions overlapping occupied and protected intervals without double subtraction", () => {
    const result = capacity([
      block("a", "2026-09-07T10:00:00", "2026-09-07T11:00:00", [30, 30]),
      block("b", "2026-09-07T10:30:00", "2026-09-07T12:00:00", [0, 15]),
    ]);
    expect(result.summary.totalEligibleMinutes).toBe(1440 - 165);
    expect(result.intervals).toHaveLength(2);
    expect(result.exclusions.filter((item) => item.kind === "buffer")).toHaveLength(3);
  });
  it("splits touching openings at canonical user-day boundaries", () => {
    const result = deriveCapacity({
      startUserDayDate: "2026-09-07",
      endUserDayDateExclusive: "2026-09-09",
      resolver,
      schedule: {
        scheduledBlocks: [],
        generatedWorkBlocks: [],
        unplacedCandidates: [],
        planningWindow: window,
      },
    });
    expect(result.intervals).toHaveLength(2);
    expect(result.intervals[0]!.endsAt).toBe(result.intervals[1]!.startsAt);
    expect(result.intervals.map((item) => item.userDayDate)).toEqual(["2026-09-07", "2026-09-08"]);
  });
  it("keeps unplaced liability visible but removes affected openings from fully allocatable totals", () => {
    const candidate = {
      id: "unplaced",
      durationMinutes: 60,
      userDayDate: "2026-09-07",
    } as unknown as BlockCandidate;
    const result = capacity([], [candidate]);
    expect(result.qualification).toMatchObject({
      liability: "unresolved",
      allocability: "qualified",
    });
    expect(result.summary).toMatchObject({
      fullyAllocatableMinutes: 0,
      qualifiedMinutes: 1440,
      liabilityMinutes: 60,
    });
    expect(result.intervals[0]!.reasons[0]).toMatchObject({ code: "unresolvedOrdinaryCommitment" });
  });
  it("is deterministic, demand-neutral, and does not mutate schedule input", () => {
    const schedule = {
      scheduledBlocks: [block("a", "2026-09-07T10:00:00", "2026-09-07T11:00:00")],
      generatedWorkBlocks: [],
      unplacedCandidates: [],
      planningWindow: window,
    };
    const before = structuredClone(schedule);
    const first = deriveCapacity({
      startUserDayDate: "2026-09-07",
      endUserDayDateExclusive: "2026-09-08",
      resolver,
      schedule,
    });
    const second = deriveCapacity({
      startUserDayDate: "2026-09-07",
      endUserDayDateExclusive: "2026-09-08",
      resolver,
      schedule,
    });
    expect(first).toEqual(second);
    expect(schedule).toEqual(before);
    expect(JSON.stringify(first)).not.toContain("goalId");
  });
  it("marks stale and clipped Preview truth non-allocatable or qualified rather than zero", () => {
    const result = deriveCapacity({
      startUserDayDate: "2026-09-07",
      endUserDayDateExclusive: "2026-09-08",
      resolver,
      schedule: {
        scheduledBlocks: [],
        generatedWorkBlocks: [],
        unplacedCandidates: [],
        isStale: true,
        planningWindow: { startsAt: new Date("2026-09-07T05:00:00"), endsAt: window.endsAt },
      },
    });
    expect(result.qualification).toMatchObject({
      freshness: "stale",
      coverage: "partial",
      allocability: "nonAllocatable",
    });
    expect(result.summary.totalEligibleMinutes).toBe(1380);
    expect(result.summary.fullyAllocatableMinutes).toBe(0);
  });
});
