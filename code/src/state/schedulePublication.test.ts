import { describe, expect, it, vi } from "vitest";
import { publishScheduleRangeV1 } from "./schedulePublication.js";

const publicationRange = {
  version: 1,
  scopeType: "publicationRange",
  startUserDayDate: "2026-09-01",
  endUserDayDateExclusive: "2026-09-02",
  provenance: { source: "explicitPublication" },
} as const;

function review(overrides: Record<string, unknown> = {}) {
  return {
    version: 1,
    sourceFingerprint: "current",
    planningDataCoverage: "complete",
    preview: { availability: "available", freshness: "current", coverage: "covers" },
    scheduledReality: [],
    derivedSchedule: [],
    acceptedLiabilities: [],
    proposals: [],
    unresolvedFrictionCount: 0,
    publication: {
      epistemicClass: "historical",
      coverage: "none",
      publishedUserDays: [],
      missingUserDays: [],
    },
    ...overrides,
  } as never;
}

function options(value: unknown) {
  return {
    input: {
      publicationRange,
      expectedSourceFingerprint: "current",
      publishedAt: "2026-09-01T12:00:00.000Z",
    },
    getState: () =>
      ({
        schedulingPreferences: { weekStartsOn: "monday" },
        preview: null,
      }) as never,
    getAuthoredSetup: vi.fn() as never,
    listGoals: () => [],
    queryPlanningReview: vi.fn(async () => value as never),
    historicalPlan: { publishAtomically: vi.fn() },
    recordResult: vi.fn(),
  };
}

describe("explicit schedule publication eligibility", () => {
  it.each([
    [{ planningDataCoverage: "partial" }, "planningCoverageIncomplete"],
    [{ planningDataCoverage: "unknown" }, "planningCoverageIncomplete"],
    [
      {
        preview: {
          availability: "unavailable",
          freshness: "unavailable",
          coverage: "doesNotCover",
        },
      },
      "previewMissing",
    ],
    [
      { preview: { availability: "available", freshness: "stale", coverage: "covers" } },
      "previewStale",
    ],
    [
      { preview: { availability: "available", freshness: "current", coverage: "partiallyCovers" } },
      "previewRangeMismatch",
    ],
    [{ unresolvedFrictionCount: 1 }, "frictionUnresolved"],
    [{ acceptedLiabilities: [{}] }, "acceptedAllocationUnrealized"],
    [{ sourceFingerprint: "changed" }, "sourceChanged"],
  ])("rejects without persistence for %s", async (override, reason) => {
    const dependencies = options(review(override));
    expect(await publishScheduleRangeV1(dependencies)).toEqual({ status: "rejected", reason });
    expect(dependencies.historicalPlan.publishAtomically).not.toHaveBeenCalled();
  });

  it("rejects invalid ranges and bounded query failure", async () => {
    const invalid = options(review());
    invalid.input.publicationRange = {
      ...publicationRange,
      endUserDayDateExclusive: "2026-09-01",
    } as never;
    expect(await publishScheduleRangeV1(invalid)).toMatchObject({
      status: "rejected",
      reason: "invalidPublicationRange",
    });
    const failed = options(review());
    failed.queryPlanningReview.mockRejectedValueOnce(new Error("unavailable"));
    expect(await publishScheduleRangeV1(failed)).toMatchObject({
      status: "rejected",
      reason: "queryFailure",
    });
  });

  it("does not treat an actionable Proposal as a blocker", async () => {
    const dependencies = options(review({ proposals: [{}], sourceFingerprint: "changed" }));
    expect(await publishScheduleRangeV1(dependencies)).toEqual({
      status: "rejected",
      reason: "sourceChanged",
    });
  });
});
