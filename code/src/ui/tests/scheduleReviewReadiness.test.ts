import { describe, expect, it } from "vitest";
import { deriveScheduleReviewReadiness } from "../scheduleReviewReadiness.js";

function model(overrides: Record<string, unknown> = {}) {
  return {
    version: 1,
    planningDataCoverage: "complete",
    preview: { availability: "available", coverage: "covers", freshness: "current" },
    scheduledReality: [],
    derivedSchedule: [],
    acceptedLiabilities: [],
    proposals: [],
    publication: {
      epistemicClass: "historical",
      coverage: "none",
      publishedUserDays: [],
      missingUserDays: [],
    },
    ...overrides,
  } as never;
}

describe("schedule review readiness", () => {
  it("derives ready separately from publication history", () => {
    expect(
      deriveScheduleReviewReadiness({
        model: model(),
        unresolvedFrictionCount: 0,
        publicationRangeValid: true,
      }),
    ).toMatchObject({ reviewReady: true, publicationReady: true, blockers: [] });
  });

  it("fails closed with deterministic explainable blocker ordering", () => {
    const result = deriveScheduleReviewReadiness({
      model: model({
        planningDataCoverage: "unknown",
        preview: { availability: "available", coverage: "partiallyCovers", freshness: "stale" },
        acceptedLiabilities: [{ acceptedAllocationId: "accepted" }],
      }),
      unresolvedFrictionCount: 2,
      publicationRangeValid: false,
    });
    expect(result.publicationReady).toBe(false);
    expect(result.blockers.map((item) => item.code)).toEqual([
      "planningCoverageUnknown",
      "previewStale",
      "previewRangeMismatch",
      "frictionUnresolved",
      "acceptedAllocationUnrealized",
      "publicationRangeInvalid",
    ]);
    expect(result.blockers.every((item) => item.message.length > 0)).toBe(true);
  });

  it("treats an actionable Proposal as decision attention but not a publication blocker", () => {
    const result = deriveScheduleReviewReadiness({
      model: model({ proposals: [{}] }),
      unresolvedFrictionCount: 0,
      publicationRangeValid: true,
    });
    expect(result).toMatchObject({
      reviewReady: true,
      publicationReady: true,
      warnings: [{ code: "proposalDecisionPending", blocksPublication: false }],
    });
  });
});
