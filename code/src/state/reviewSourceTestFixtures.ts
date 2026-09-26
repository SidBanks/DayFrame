import { createInitialDayFrameState } from "./createInitialDayFrameState.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
import {
  bindReviewSources,
  qualified,
  qualifiedFamily,
  type ReviewSourceSnapshot,
  type SourceQualifications,
} from "./reviewSourceQualification.js";
import type { PlanningReviewReadModelV2 } from "./planningScopeQuery.js";
/** Explicit qualified, empty test authority. Production callers must use owner capture. */
export function qualifiedSourcesFixture(): SourceQualifications {
  return {
    proposal: qualified("verifiedCommitted", "verified"),
    realization: qualified("verifiedCommitted", "verified"),
    activeSetup: qualified(),
    planDecision: qualified(),
    composition: qualified(),
    goal: qualified(),
    sleepFoundation: qualified(),
    historicalPlan: qualified("verifiedCommitted", "verified"),
  };
}
export function sourceSnapshotFixture(
  overrides: Partial<ReviewSourceSnapshot> = {},
): ReviewSourceSnapshot {
  const state = createInitialDayFrameState(),
    qualification = qualifiedSourcesFixture();
  return {
    state,
    setup: state,
    goals: [],
    sleep: {
      status: "complete",
      planDecisions: [],
      realizedFacts: [],
      composition: { authority: { version: 1, relationships: [], decisions: [] }, sources: [] },
    },
    proposals: [],
    accepted: [],
    realized: [],
    qualification,
    check: () => ({ status: "current" }),
    checkQuery: () => ({ status: "current" }),
    currentQualification: () => qualification,
    ...overrides,
  };
}
export function reviewModelFixture(
  overrides: Record<string, unknown> = {},
): PlanningReviewReadModelV2 {
  const snapshot = sourceSnapshotFixture();
  const model: PlanningReviewReadModelV2 = {
    version: 2,
    sourceQualification: snapshot.qualification,
    queryState: "current",
    publicationWitness: { status: "publishable" },
    sourceFingerprint: "current",
    reviewScope: createReviewScope({
      kind: "day",
      anchorUserDayDate: "2026-09-05",
      weekStartsOn: "monday",
    }),
    planningDataCoverage: "complete",
    preview: {
      availability: "available",
      coverage: "covers",
      freshness: "current",
      revision: "generated",
    },
    derivedSchedule: [],
    scheduledReality: qualifiedFamily([], snapshot.qualification.realization),
    acceptedLiabilities: qualifiedFamily([], snapshot.qualification.proposal),
    proposals: qualifiedFamily([], snapshot.qualification.proposal),
    unresolvedFrictionCount: 0,
    publication: {
      epistemicClass: "historical",
      availability: { status: "available" },
      materialization: { status: "eligible" },
      coverage: "none",
      publishedUserDays: [],
      missingUserDays: [],
    },
    ...overrides,
  };
  for (const key of ["scheduledReality", "acceptedLiabilities", "proposals"] as const) {
    const records = overrides[key];
    if (Array.isArray(records))
      Object.assign(model, {
        [key]: qualifiedFamily(
          records,
          snapshot.qualification[key === "scheduledReality" ? "realization" : "proposal"],
        ),
      });
  }
  bindReviewSources(model, snapshot);
  return model;
}
