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
    const query = createPlanningScopeQuery({
      getState: () =>
        ({
          schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "monday" },
          shiftCycles: [],
          preview: {
            isStale: true,
            rangeStartDate: "2026-09-04",
            rangeEndDate: "2026-09-04",
            result: { generatedWorkBlocks: [], scheduledBlocks: [] },
          },
        }) as never,
      proposals: {
        listActionableProposals: () => [],
        listUnrealizedAcceptedAllocations: () => [],
      } as never,
      realizations: { listRealizedScheduleFacts: () => [fact] } as never,
      historicalPlan: {
        getHistoricalPlanRange: async () => ({
          status: "available",
          days: [],
          missingDays: ["2026-09-04"],
        }),
      } as never,
    });
    const result = await query({ reviewScope: review, historyAsOf: "2026-09-06T00:00:00.000Z" });
    expect(result.planningDataCoverage).toBe("unknown");
    expect(result.preview).toEqual({
      availability: "available",
      coverage: "covers",
      freshness: "stale",
    });
    expect(result.publication.coverage).toBe("none");
    expect(result.scheduledReality[0]).toMatchObject({
      fact: { id: "fact", startsAt: fact.startsAt, endsAt: fact.endsAt },
      authoritativeInterval: { startsAt: fact.startsAt, endsAt: fact.endsAt },
      visibleInterval: { startsAt: "2026-09-04T08:00:00.000Z", endsAt: "2026-09-05T08:00:00.000Z" },
    });
  });
});
