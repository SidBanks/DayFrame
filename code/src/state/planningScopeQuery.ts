import {
  bindReviewSources,
  qualifiedFamily,
  qualificationFailure,
  unqualified,
  type QualifiedFamily,
  type SourceQualifications,
  type ReviewSourceSnapshot,
} from "./reviewSourceQualification.js";
import { getEffectiveHistoricalPlanRange } from "../core/historicalPlan/historicalPlanProjection.js";
import { hasSleepPublicationSeamConflict } from "../core/sleep/sleepPublicationSeams.js";
import { historicalPlanBatchFingerprint } from "../core/historicalPlan/historicalPlanFingerprint.js";
import {
  materializePlanPublication,
  type MaterializePlanPublicationResult,
} from "../core/historicalPlan/materializePlanPublication.js";
import { publicationRangeFromReviewScope } from "../core/planning/reviewScope.js";
import type { HistoricalPlanProtectionReason } from "./historicalPlanSurface.js";
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

export type PlanningReviewReadModelV2 = {
  version: 2;
  sourceQualification: SourceQualifications;
  queryState: "current" | "sourceChanged" | "contextReplaced";
  publicationWitness: { status: "publishable" | "blocked" };
  sourceFingerprint: string;
  reviewScope: ReviewScopeV1;
  planningDataCoverage: PlanningScopeCoverageV1;
  preview: {
    availability: "available" | "unavailable";
    revision: "generated" | "try";
    coverage: "covers" | "partiallyCovers" | "doesNotCover";
    freshness: "current" | "stale" | "unavailable";
  };
  scheduledReality: QualifiedFamily<{
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
  acceptedLiabilities: QualifiedFamily<{
    epistemicClass: "acceptedAuthority";
    acceptedAllocationId: string;
    claim: ReturnType<
      ProposalSurface["listUnrealizedAcceptedAllocations"]
    >[number]["claims"][number];
    authoritativeInterval: { startsAt: string; endsAt: string };
    visibleInterval: { startsAt: string; endsAt: string };
  }>;
  proposals: QualifiedFamily<{
    epistemicClass: "proposed";
    proposal: ReturnType<ProposalSurface["listActionableProposals"]>[number];
    membership: "contained" | "intersecting";
  }>;
  unresolvedFrictionCount: number;
  publication: {
    epistemicClass: "historical";
    availability:
      | { status: "available" }
      | { status: "protected"; reason: HistoricalPlanProtectionReason }
      | { status: "unavailable"; reason: string };
    materialization:
      | { status: "eligible" }
      | {
          status: "blocked";
          reason: Exclude<MaterializePlanPublicationResult, { status: "materialized" }>["status"];
        };
    coverage: PlanningScopeCoverageV1;
    publishedUserDays: string[];
    missingUserDays: string[];
  };
};

export function createPlanningScopeQuery(options: {
  captureSources: () => ReviewSourceSnapshot;
  getState: () => DayFrameState;
  getSleepAuthority?: () => import("../core/sleep/sleepFoundationalOccupancy.js").SleepFoundationAuthority;
  proposals: Pick<ProposalSurface, "listActionableProposals" | "listUnrealizedAcceptedAllocations">;
  realizations: Pick<RealizationSurface, "listRealizedScheduleFacts">;
  historicalPlan: Pick<HistoricalPlanSurface, "readReviewCollection">;
}) {
  return async function queryPlanningReview(input: {
    reviewScope: ReviewScopeV1;
    historyAsOf: string;
  }): Promise<PlanningReviewReadModelV2> {
    const finalLabel = addUserDayLabels(input.reviewScope.endUserDayDateExclusive, -1);
    const snapshot = options.captureSources();
    const collection = await options.historicalPlan.readReviewCollection();
    const afterRead = snapshot.checkQuery();
    const state = snapshot.state;
    const range =
      collection.status === "available"
        ? getEffectiveHistoricalPlanRange({
            batches: collection.batches,
            startUserDayDate: input.reviewScope.startUserDayDate,
            endUserDayDate: finalLabel,
            asOf: input.historyAsOf,
          })
        : undefined;
    const history =
      range?.status === "projected" && collection.status === "available"
        ? {
            status: "available" as const,
            days: range.days.map((day) => ({
              ...day,
              durability: collection.pendingIds.some((id) => id === day.batchId)
                ? "pending"
                : "durable",
            })),
            missingDays: range.missingDays,
          }
        : undefined;
    const resolve = (date: ReviewScopeV1["startUserDayDate"]) =>
      resolveUserDayWindowForLabel({
        shiftCycles: state.shiftCycles,
        defaultSchedulingPreferences: state.schedulingPreferences,
        userDayDate: date,
      });
    const reviewStart = resolve(input.reviewScope.startUserDayDate).start.toISOString();
    const reviewEnd = resolve(finalLabel).end.toISOString();
    const bounds = { startsAt: reviewStart, endsAt: reviewEnd };
    const realized = snapshot.realized;
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
    const acceptedLiabilities = snapshot.accepted
      .filter(
        (accepted) =>
          snapshot.qualification.realization.status !== "qualified" ||
          !realizedAllocations.has(accepted.id),
      )
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
    const proposals = snapshot.proposals.flatMap((proposal) => {
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
      history?.status === "available" ? history.days.map((result) => result.day.userDayDate) : [];
    const missingUserDays = history?.status === "available" ? history.missingDays : [];
    const expectedDays = duration(input.reviewScope);
    const unresolvedFriction =
      state.preview?.result.frictionPoints?.filter((point) => !point.ignored) ?? [];
    const publicationCoverage: PlanningScopeCoverageV1 =
      history?.status !== "available"
        ? "unknown"
        : publishedUserDays.length === expectedDays
          ? "complete"
          : publishedUserDays.length
            ? "partial"
            : "none";
    // Dry-run the canonical materializer with deterministic providers; never writes or allocates authority.
    let materialized: MaterializePlanPublicationResult = qualificationFailure(
      snapshot.qualification,
    )
      ? {
          status: "inconsistentPlanContext",
          detail: "Required publication sources are unqualified",
        }
      : materializePlanPublication({
          authoredSetup: snapshot.setup,
          sleepAuthority: snapshot.sleep,
          goals: snapshot.goals,
          preview: state.preview,
          publicationRange: publicationRangeFromReviewScope(input.reviewScope),
          providers: {
            now: () => input.historyAsOf,
            allocateBatchId: () => "00000000-0000-4000-8000-000000000099" as never,
          },
        });
    if (
      materialized.status === "materialized" &&
      collection.status === "available" &&
      hasSleepPublicationSeamConflict(materialized.batch, collection.batches)
    )
      materialized = {
        status: "inconsistentPlanContext",
        detail: "Sleep publication conflicts with an effective neighboring day",
      };
    const availability: PlanningReviewReadModelV2["publication"]["availability"] =
      collection.status === "protected"
        ? { status: "protected", reason: collection.reason }
        : !history
          ? {
              status: "unavailable",
              reason: collection.status === "available" ? "invalidRange" : collection.reason,
            }
          : history.days.some((day) => day.durability !== "durable")
            ? { status: "unavailable", reason: "pendingDurability" }
            : { status: "available" };
    const afterDerivation = snapshot.checkQuery();
    const check = afterRead.status === "rejected" ? afterRead : afterDerivation;
    const queryState =
      check.status === "rejected"
        ? check.reason === "contextReplaced"
          ? "contextReplaced"
          : "sourceChanged"
        : collection.status === "stale"
          ? collection.reason
          : "current";
    const sourceQualification: SourceQualifications = {
      ...(queryState === "current" ? snapshot.qualification : snapshot.currentQualification()),
      historicalPlan:
        availability.status === "available"
          ? snapshot.qualification.historicalPlan
          : unqualified(
              "historicalPlan",
              availability.status === "protected"
                ? "protected"
                : availability.reason === "pendingDurability"
                  ? "pendingDurability"
                  : "readUnavailable",
              availability.reason,
            ),
    };
    const model: PlanningReviewReadModelV2 = {
      version: 2,
      sourceQualification,
      queryState,
      publicationWitness: {
        status:
          queryState === "current" &&
          !qualificationFailure(sourceQualification) &&
          availability.status === "available"
            ? "publishable"
            : "blocked",
      },
      sourceFingerprint:
        "review-qualified-v2:" +
        capacityFingerprint({
          scope: {
            startUserDayDate: input.reviewScope.startUserDayDate,
            endUserDayDateExclusive: input.reviewScope.endUserDayDateExclusive,
          },
          qualification: sourceQualification,
          goals: snapshot.goals,
          planningCoverage: assessRangeCoverage(planningRange, input.reviewScope),
          previewCoverage: assessPreviewReviewCoverage(previewRange, input.reviewScope),
          publicationTruth:
            materialized.status === "materialized"
              ? historicalPlanBatchFingerprint(materialized.batch)
              : materialized.status,
          preview: state.preview
            ? {
                revision: state.preview.revisedAt === undefined ? "generated" : "try",
                isStale: state.preview.isStale,
                foundation: state.preview.result.foundation,
                range: previewRange,
                friction: unresolvedFriction.map((point) => point.id).sort(),
              }
            : null,
          realized: scheduledReality
            .map(({ fact }) => fact)
            .sort((a, b) => a.id.localeCompare(b.id)),
          accepted: acceptedLiabilities
            .map(({ acceptedAllocationId, claim }) => ({ acceptedAllocationId, claim }))
            .sort((a, b) => a.acceptedAllocationId.localeCompare(b.acceptedAllocationId)),
        }),
      reviewScope: structuredClone(input.reviewScope),
      planningDataCoverage:
        state.preview?.result.foundation?.status === "nonAllocatable"
          ? "unknown"
          : assessRangeCoverage(planningRange, input.reviewScope),
      preview: {
        availability: state.preview ? "available" : "unavailable",
        revision: state.preview?.revisedAt !== undefined ? "try" : "generated",
        coverage: assessPreviewReviewCoverage(previewRange, input.reviewScope),
        freshness: state.preview ? (state.preview.isStale ? "stale" : "current") : "unavailable",
      },
      scheduledReality: qualifiedFamily(scheduledReality, sourceQualification.realization),
      derivedSchedule,
      acceptedLiabilities: qualifiedFamily(
        acceptedLiabilities,
        sourceQualification.proposal.status === "unqualified"
          ? sourceQualification.proposal
          : sourceQualification.realization,
      ),
      proposals: qualifiedFamily(proposals, sourceQualification.proposal),
      unresolvedFrictionCount: unresolvedFriction.length,
      publication: {
        epistemicClass: "historical",
        availability,
        materialization:
          materialized.status === "materialized"
            ? { status: "eligible" }
            : { status: "blocked", reason: materialized.status },
        coverage: publicationCoverage,
        publishedUserDays,
        missingUserDays,
      },
    };
    if (queryState === "current") bindReviewSources(model, snapshot);
    return model;
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
