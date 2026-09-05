import { describe, expect, it } from "vitest";
import { presentPlanningReview } from "../plannerReviewPresentation.js";

function model(overrides: Record<string, unknown> = {}) {
  return {
    version: 1,
    planningDataCoverage: "complete",
    preview: { availability: "available", coverage: "covers", freshness: "current" },
    publication: {
      epistemicClass: "historical",
      coverage: "none",
      publishedUserDays: [],
      missingUserDays: [],
    },
    derivedSchedule: [],
    scheduledReality: [],
    acceptedLiabilities: [],
    proposals: [],
    ...overrides,
  } as never;
}

describe("Planner review presentation", () => {
  it("preserves Goal work, support, Buffer, accepted, and Proposal as separate semantic classes", () => {
    const baseFact = {
      id: "fact",
      userDayDate: "2026-09-05",
      startsAt: "2026-09-05T14:00:00Z",
      endsAt: "2026-09-05T15:00:00Z",
    };
    const interval = { startsAt: baseFact.startsAt, endsAt: baseFact.endsAt };
    const result = presentPlanningReview(
      model({
        scheduledReality: ["productiveGoalWork", "supportActivity", "bufferProtection"].map(
          (scheduleRole, index) => ({
            epistemicClass: "scheduledReality",
            fact: { ...baseFact, id: `fact-${index}`, scheduleRole },
            authoritativeInterval: interval,
            visibleInterval: interval,
          }),
        ),
        acceptedLiabilities: [
          {
            epistemicClass: "acceptedAuthority",
            acceptedAllocationId: "accepted",
            claim: { ...baseFact, id: "claim", role: "productive" },
            authoritativeInterval: interval,
            visibleInterval: interval,
          },
        ],
        proposals: [
          {
            epistemicClass: "proposed",
            membership: "contained",
            proposal: {
              id: "proposal",
              revision: 1,
              horizon: { startUserDayDate: "2026-09-05", endUserDayDateExclusive: "2026-09-06" },
              options: [{}],
            },
          },
        ],
      }),
    );
    expect(result.groups.map((group) => group.kind)).toEqual([
      "goalWork",
      "supportActivity",
      "bufferProtection",
      "acceptedUnrealized",
      "proposal",
    ]);
    expect(
      result.groups.find((group) => group.kind === "bufferProtection")?.items[0],
    ).toMatchObject({
      detail: expect.stringContaining("not an executable activity"),
      action: "inspect",
    });
    expect(result.groups.find((group) => group.kind === "proposal")?.items[0]?.action).toBe(
      "decide",
    );
  });

  it("allows true empty only with complete coverage and keeps Preview coverage separate from freshness", () => {
    expect(presentPlanningReview(model()).isKnownEmpty).toBe(true);
    const unknown = presentPlanningReview(
      model({
        planningDataCoverage: "unknown",
        preview: { availability: "available", coverage: "doesNotCover", freshness: "current" },
      }),
    );
    expect(unknown.isKnownEmpty).toBe(false);
    expect(unknown.coverage.label).toMatch(/not treated as an empty schedule/);
    expect(unknown.preview.label).toMatch(/does not cover.*current/);
  });
});
