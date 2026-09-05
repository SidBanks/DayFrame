import { addUserDayLabels, resolveUserDayWindowForLabel } from "../core/time/canonicalUserDay.js";
import {
  assessRangeCoverage,
  intersectsRange,
  previewRangeFromLegacyInclusive,
  visibleInterval,
  type PlanningScopeCoverageV1,
  type ReviewScopeV1,
} from "../core/planning/planningScope.js";
import { assessPreviewReviewCoverage } from "../core/planning/reviewScope.js";
import type { DayFrameState } from "./types.js";
import type { ProposalSurface } from "./proposalSurface.js";
import type { RealizationSurface } from "./realizationSurface.js";
import type { HistoricalPlanSurface } from "./historicalPlanSurface.js";
import { capacityFingerprint } from "../core/planning/capacityFingerprint.js";

export type PlanningReviewReadModelV1 = {
  version: 1;
  sourceFingerprint: string;
  reviewScope: ReviewScopeV1;
  planningDataCoverage: PlanningScopeCoverageV1;
  preview: {
    availability: "available" | "unavailable";
    coverage: "covers" | "partiallyCovers" | "doesNotCover";
    freshness: "current" | "stale" | "unavailable";
  };
  scheduledReality: Array<{
    epistemicClass: "scheduledReality";
    fact: ReturnType<RealizationSurface["listRealizedScheduleFacts"]>[number];
    authoritativeInterval: { startsAt: string; endsAt: string };
    visibleInterval: { startsAt: string; endsAt: string };
  }>;
  derivedSchedule: Array<{
    epistemicClass: "derivedSchedule";
    scheduleClass: "work" | "commitment";
    fact:
      | NonNullable<DayFrameState["preview"]>["result"]["generatedWorkBlocks"][number]
      | NonNullable<DayFrameState["preview"]>["result"]["scheduledBlocks"][number];
    authoritativeInterval: { startsAt: string; endsAt: string };
    visibleInterval: { startsAt: string; endsAt: string };
  }>;
  acceptedLiabilities: Array<{
    epistemicClass: "acceptedAuthority";
    acceptedAllocationId: string;
    claim: ReturnType<
      ProposalSurface["listUnrealizedAcceptedAllocations"]
    >[number]["claims"][number];
    authoritativeInterval: { startsAt: string; endsAt: string };
    visibleInterval: { startsAt: string; endsAt: string };
  }>;
  proposals: Array<{
    epistemicClass: "proposed";
    proposal: ReturnType<ProposalSurface["listActionableProposals"]>[number];
    membership: "contained" | "intersecting";
  }>;
  unresolvedFrictionCount: number;
  publication: {
    epistemicClass: "historical";
    coverage: PlanningScopeCoverageV1;
    publishedUserDays: string[];
    missingUserDays: string[];
  };
};

export function createPlanningScopeQuery(options: {
  getState: () => DayFrameState;
  proposals: Pick<ProposalSurface, "listActionableProposals" | "listUnrealizedAcceptedAllocations">;
  realizations: Pick<RealizationSurface, "listRealizedScheduleFacts">;
  historicalPlan: Pick<HistoricalPlanSurface, "getHistoricalPlanRange">;
}) {
  return async function queryPlanningReview(input: {
    reviewScope: ReviewScopeV1;
    historyAsOf: string;
  }): Promise<PlanningReviewReadModelV1> {
    const finalLabel = addUserDayLabels(input.reviewScope.endUserDayDateExclusive, -1);
    const history = await options.historicalPlan.getHistoricalPlanRange(
      input.reviewScope.startUserDayDate,
      finalLabel,
      input.historyAsOf,
    );
    const state = options.getState();
    const resolve = (date: ReviewScopeV1["startUserDayDate"]) =>
      resolveUserDayWindowForLabel({
        shiftCycles: state.shiftCycles,
        defaultSchedulingPreferences: state.schedulingPreferences,
        userDayDate: date,
      });
    const reviewStart = resolve(input.reviewScope.startUserDayDate).start.toISOString();
    const reviewEnd = resolve(finalLabel).end.toISOString();
    const bounds = { startsAt: reviewStart, endsAt: reviewEnd };
    const realized = options.realizations.listRealizedScheduleFacts();
    const realizedAllocations = new Set(realized.map((fact) => fact.origin.acceptedAllocationId));
    const scheduledReality = realized.flatMap((fact) => {
      const visible = visibleInterval(fact, bounds);
      return visible
        ? [
            {
              epistemicClass: "scheduledReality" as const,
              fact,
              authoritativeInterval: { startsAt: fact.startsAt, endsAt: fact.endsAt },
              visibleInterval: visible,
            },
          ]
        : [];
    });
    const derivedSchedule = state.preview
      ? [
          ...state.preview.result.generatedWorkBlocks.map((fact) => ({
            scheduleClass: "work" as const,
            fact,
          })),
          ...state.preview.result.scheduledBlocks.map((fact) => ({
            scheduleClass: "commitment" as const,
            fact,
          })),
        ].flatMap(({ scheduleClass, fact }) => {
          const interval = {
            startsAt: fact.startsAt.toISOString(),
            endsAt: fact.endsAt.toISOString(),
          };
          const visible = visibleInterval(interval, bounds);
          return visible
            ? [
                {
                  epistemicClass: "derivedSchedule" as const,
                  scheduleClass,
                  fact,
                  authoritativeInterval: interval,
                  visibleInterval: visible,
                },
              ]
            : [];
        })
      : [];
    const acceptedLiabilities = options.proposals
      .listUnrealizedAcceptedAllocations()
      .filter((accepted) => !realizedAllocations.has(accepted.id))
      .flatMap((accepted) =>
        accepted.claims.flatMap((claim) => {
          const visible = visibleInterval(claim, bounds);
          return visible
            ? [
                {
                  epistemicClass: "acceptedAuthority" as const,
                  acceptedAllocationId: accepted.id,
                  claim,
                  authoritativeInterval: { startsAt: claim.startsAt, endsAt: claim.endsAt },
                  visibleInterval: visible,
                },
              ]
            : [];
        }),
      );
    const proposals = options.proposals.listActionableProposals().flatMap((proposal) => {
      if (!intersectsRange(proposal.horizon as never, input.reviewScope)) return [];
      const contained =
        input.reviewScope.startUserDayDate <= proposal.horizon.startUserDayDate &&
        proposal.horizon.endUserDayDateExclusive <= input.reviewScope.endUserDayDateExclusive;
      return [
        {
          epistemicClass: "proposed" as const,
          proposal,
          membership: contained ? ("contained" as const) : ("intersecting" as const),
        },
      ];
    });
    const previewRange = state.preview
      ? (state.preview.scopeMetadata?.requestedPreviewRange ??
        previewRangeFromLegacyInclusive(state.preview))
      : undefined;
    const planningRange = state.preview?.scopeMetadata?.effectivePlanningDataHorizon.effective;
    const publishedUserDays =
      history.status === "available" ? history.days.map((result) => result.day.userDayDate) : [];
    const missingUserDays = history.status === "available" ? history.missingDays : [];
    const expectedDays = duration(input.reviewScope);
    const unresolvedFriction =
      state.preview?.result.frictionPoints?.filter((point) => !point.ignored) ?? [];
    const publicationCoverage: PlanningScopeCoverageV1 =
      history.status !== "available"
        ? "unknown"
        : publishedUserDays.length === expectedDays
          ? "complete"
          : publishedUserDays.length
            ? "partial"
            : "none";
    return {
      version: 1,
      sourceFingerprint: capacityFingerprint({
        preview: state.preview
          ? {
              generatedAt: state.preview.generatedAt,
              revisedAt: state.preview.revisedAt,
              isStale: state.preview.isStale,
              range: previewRange,
              friction: unresolvedFriction.map((point) => point.id).sort(),
            }
          : null,
        realized: scheduledReality.map(({ fact }) => fact).sort((a, b) => a.id.localeCompare(b.id)),
        accepted: acceptedLiabilities
          .map(({ acceptedAllocationId, claim }) => ({ acceptedAllocationId, claim }))
          .sort((a, b) => a.acceptedAllocationId.localeCompare(b.acceptedAllocationId)),
      }),
      reviewScope: structuredClone(input.reviewScope),
      planningDataCoverage: assessRangeCoverage(planningRange, input.reviewScope),
      preview: {
        availability: state.preview ? "available" : "unavailable",
        coverage: assessPreviewReviewCoverage(previewRange, input.reviewScope),
        freshness: state.preview ? (state.preview.isStale ? "stale" : "current") : "unavailable",
      },
      scheduledReality,
      derivedSchedule,
      acceptedLiabilities,
      proposals,
      unresolvedFrictionCount: unresolvedFriction.length,
      publication: {
        epistemicClass: "historical",
        coverage: publicationCoverage,
        publishedUserDays,
        missingUserDays,
      },
    };
  };
}

function duration(range: ReviewScopeV1) {
  let result = 0;
  for (
    let date = range.startUserDayDate;
    date < range.endUserDayDateExclusive;
    date = addUserDayLabels(date, 1)
  )
    result += 1;
  return result;
}
