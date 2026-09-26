import { sourceSnapshotFixture } from "./reviewSourceTestFixtures.js";
import { describe, expect, it } from "vitest";
import { createReviewScope } from "../core/planning/reviewScope.js";
import { createPlanningScopeQuery } from "./planningScopeQuery.js";

const review = createReviewScope({
  kind: "day",
  anchorUserDayDate: "2026-09-04",
  weekStartsOn: "monday",
});

describe("planning scope review query", () => {
  it("keeps coverage distinct from freshness and clips display without mutating fact authority", async () => {
    const fact = {
      id: "fact",
      startsAt: "2026-09-04T02:00:00.000Z",
      endsAt: "2026-09-05T08:00:00.000Z",
      origin: { acceptedAllocationId: "accepted" },
    };
    const state = {
      schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "monday" },
      shiftCycles: [],
      preview: {
        isStale: true,
        rangeStartDate: "2026-09-04",
        rangeEndDate: "2026-09-04",
        result: { generatedWorkBlocks: [], scheduledBlocks: [] },
      },
    } as never;
    const query = createPlanningScopeQuery({
      captureSources: () =>
        sourceSnapshotFixture({ state, setup: state, realized: [fact] as never }),
      getState: () => state,
      proposals: {
        listActionableProposals: () => [],
        listUnrealizedAcceptedAllocations: () => [],
      } as never,
      realizations: { listRealizedScheduleFacts: () => [fact] } as never,
      historicalPlan: {
        readReviewCollection: async () => ({ status: "available", batches: [], pendingIds: [] }),
      } as never,
    });
    const result = await query({ reviewScope: review, historyAsOf: "2026-09-06T00:00:00.000Z" });
    expect(result.planningDataCoverage).toBe("unknown");
    expect(result.preview).toEqual({
      availability: "available",
      revision: "generated",
      coverage: "covers",
      freshness: "stale",
    });
    expect(result.publication.coverage).toBe("none");
    expect(result.scheduledReality.records[0]).toMatchObject({
      fact: { id: "fact", startsAt: fact.startsAt, endsAt: fact.endsAt },
      authoritativeInterval: { startsAt: fact.startsAt, endsAt: fact.endsAt },
      visibleInterval: { startsAt: "2026-09-04T08:00:00.000Z", endsAt: "2026-09-05T08:00:00.000Z" },
    });
  });
});

describe("Task 9.9 historical availability projection", () => {
  it.each(["healthyMissing", "protected", "unavailable", "try"] as const)(
    "retains %s independently of coverage",
    async (kind) => {
      const { createInitialDayFrameState } = await import("./createInitialDayFrameState.js");
      const state = createInitialDayFrameState();
      state.preview = {
        planningWindowStart: new Date(2026, 8, 4, 3),
        planningWindowEnd: new Date(2026, 8, 5, 3),
        rangeStartDate: "2026-09-04",
        rangeEndDate: "2026-09-04",
        generatedAt: "2026-09-04T12:00:00.000Z",
        isStale: false,
        ...(kind === "try" ? { revisedAt: "2026-09-04T13:00:00.000Z" } : {}),
        result: {
          generatedWorkBlocks: [],
          blockCandidates: [],
          scheduledBlocks: [],
          unplacedCandidates: [],
          frictionPoints: [],
          planDecisionResults: [],
        },
      };
      const query = createPlanningScopeQuery({
        captureSources: () => sourceSnapshotFixture({ state, setup: state }),
        getState: () => state,
        proposals: {
          listActionableProposals: () => [],
          listUnrealizedAcceptedAllocations: () => [],
        },
        realizations: { listRealizedScheduleFacts: () => [] },
        historicalPlan: {
          readReviewCollection: async () =>
            kind === "protected"
              ? { status: "protected", reason: "physicalMismatch" }
              : kind === "unavailable"
                ? { status: "unavailable", reason: "readFailed" }
                : { status: "available", batches: [], pendingIds: [] },
        },
      });
      const model = await query({ reviewScope: review, historyAsOf: "2026-09-06T00:00:00.000Z" });
      expect(model.publication.coverage).toBe(
        kind === "protected" || kind === "unavailable" ? "unknown" : "none",
      );
      expect(model.publication.availability.status).toBe(
        kind === "protected" ? "protected" : kind === "unavailable" ? "unavailable" : "available",
      );
      expect(model.publication.materialization).toEqual(
        kind === "try" ? { status: "blocked", reason: "tryPreview" } : { status: "eligible" },
      );
    },
  );
});
