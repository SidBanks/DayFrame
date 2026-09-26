import {
  getPlanDecisionTargetKey,
  validatePlanDecision,
  type AcceptPlanDecisionInput,
  type PlanDecisionId,
  type PlanDecisionV1,
} from "../decisions/planDecision.js";
import { capacityFingerprint } from "../planning/capacityFingerprint.js";
import type { FrictionPoint, SuggestedFix } from "../friction/types.js";
import type { SleepOccurrenceReferenceV1 } from "../occurrences/sleepOccurrenceReference.js";
import type { SleepResolutionV1 } from "./sleepResolution.js";
import { resolveRequiredSleep, type ResolveRequiredSleepInput } from "./resolveRequiredSleep.js";

export type SleepPlacementTryInput = { target: SleepOccurrenceReferenceV1; sleepStart: string };
export type SleepPlacementTryResult =
  | {
      status: "available";
      candidate: Extract<AcceptPlanDecisionInput, { kind: "placeSleepOccurrence" }>;
      resolution: SleepResolutionV1;
    }
  | { status: "unavailable"; reason: string; resolution: SleepResolutionV1 };
const trialId = "00000000-0000-4000-8000-000000000914" as PlanDecisionId;
export function sleepCorrectionFingerprint(input: ResolveRequiredSleepInput): string {
  const sort = <T>(values: readonly T[]) =>
    [...values].sort((a, b) => capacityFingerprint(a).localeCompare(capacityFingerprint(b)));
  const state = input.authoredState;
  const authority = input.authority;
  return capacityFingerprint({
    authoredState: {
      ...state,
      shiftDefinitions: sort(state.shiftDefinitions),
      shiftCycles: sort(state.shiftCycles),
      blockTemplates: sort(state.blockTemplates),
      blockRecurrences: sort(state.blockRecurrences),
      manualEvents: sort(state.manualEvents),
      sleepRequirements: sort(state.sleepRequirements ?? []),
    },
    authority: {
      ...authority,
      planDecisions: sort(authority.planDecisions),
      realizedFacts: sort(authority.realizedFacts),
      composition: {
        ...authority.composition,
        sources: sort(authority.composition.sources),
        authority: {
          ...authority.composition.authority,
          relationships: sort(authority.composition.authority.relationships),
          decisions: sort(authority.composition.authority.decisions),
        },
      },
    },
  });
}
/** Pure counterfactual. The fingerprint binds Accept to the complete captured authority. */
export function trySleepPlacement(
  input: ResolveRequiredSleepInput,
  placement: SleepPlacementTryInput,
): SleepPlacementTryResult {
  const current = resolveRequiredSleep(input);
  const occurrences =
    "requiredOccurrences" in current
      ? current.requiredOccurrences
      : current.unconstrainedOccurrences;
  const occurrence = occurrences?.find(
    (o) => getPlanDecisionTargetKey(o.reference) === getPlanDecisionTargetKey(placement.target),
  );
  const start = Date.parse(placement.sleepStart);
  if (!occurrence || !Number.isFinite(start) || start % 60000 !== 0)
    return {
      status: "unavailable",
      reason: "occurrenceOrGeometryUnavailable",
      resolution: current,
    };
  const candidate: Extract<AcceptPlanDecisionInput, { kind: "placeSleepOccurrence" }> = {
    kind: "placeSleepOccurrence",
    target: structuredClone(occurrence.reference),
    provenance: { source: "user" },
    payload: {
      version: 1,
      proofStartUserDayDate: input.ownerRange.startUserDayDate,
      proofEndUserDayDateExclusive: input.ownerRange.endUserDayDateExclusive,
      sleepStart: new Date(start).toISOString(),
      sleepEnd: new Date(start + occurrence.durationMinutes * 60000).toISOString(),
      footprintStart: new Date(start - occurrence.bufferBeforeMinutes * 60000).toISOString(),
      footprintEnd: new Date(
        start + (occurrence.durationMinutes + occurrence.bufferAfterMinutes) * 60000,
      ).toISOString(),
      durationMinutes: occurrence.durationMinutes,
      bufferBeforeMinutes: occurrence.bufferBeforeMinutes,
      bufferAfterMinutes: occurrence.bufferAfterMinutes,
      requirementRevision: occurrence.requirementRevision,
      dependencyFingerprint: sleepCorrectionFingerprint(input),
      revokedAt: null,
    },
  };
  const decision: PlanDecisionV1 = {
    ...candidate,
    version: 1,
    id: trialId,
    acceptedAt: "2026-01-01T00:00:00.000Z",
  };
  if (validatePlanDecision(decision).status !== "valid")
    return { status: "unavailable", reason: "invalidPlacement", resolution: current };
  const resolution = resolveRequiredSleep({
    ...input,
    authority: {
      ...input.authority,
      planDecisions: [
        ...input.authority.planDecisions.filter(
          (d) =>
            d.kind !== "placeSleepOccurrence" ||
            getPlanDecisionTargetKey(d.target) !== getPlanDecisionTargetKey(placement.target),
        ),
        decision,
      ],
    },
  });
  return resolution.status === "satisfied"
    ? { status: "available", candidate, resolution }
    : { status: "unavailable", reason: "completeJointValidationFailed", resolution };
}

/** Infeasibility cannot have a lawful move under identical hard authority. Review fixes
 * instead replace a pin with a freshly joint-validated unpinned diagnostic placement. */
export function detectSleepFriction(
  resolution: SleepResolutionV1,
  detectedAt: string,
  input?: ResolveRequiredSleepInput,
): FrictionPoint[] {
  const review =
    resolution.placementReviews?.filter(
      (r) => r.status === "reviewRequired" || r.status === "inapplicable",
    ) ?? [];
  if (resolution.status !== "infeasible" && !review.length) return [];
  const evidence =
    resolution.status === "infeasible"
      ? {
          kind: "provenIncompatibility" as const,
          conflicts: resolution.conflicts,
          occurrences: resolution.requiredOccurrences,
          proofScope: resolution.ownerRange,
          dependencyFingerprint: resolution.dependencyFingerprint,
        }
      : {
          kind: "acceptedPlacementReview" as const,
          reviews: review,
          proofScope: resolution.ownerRange,
          underlyingStatus: resolution.underlyingStatus,
          dependencyFingerprint: input
            ? sleepCorrectionFingerprint(input)
            : capacityFingerprint(resolution),
        };
  const fixes: SuggestedFix[] = [];
  if (input && resolution.status !== "infeasible")
    for (const r of [...review]
      .sort((a, b) =>
        getPlanDecisionTargetKey(a.target).localeCompare(getPlanDecisionTargetKey(b.target)),
      )
      .slice(0, 8)) {
      const alternative = resolution.unconstrainedOccurrences?.find(
        (o) => getPlanDecisionTargetKey(o.reference) === getPlanDecisionTargetKey(r.target),
      );
      if (!alternative) continue;
      const tried = trySleepPlacement(input, {
        target: alternative.reference,
        sleepStart: alternative.sleepStart,
      });
      if (tried.status === "available") {
        const candidate = {
          ...tried.candidate,
          provenance: { source: "suggestedFix" as const, suggestedAction: "moveBlock" as const },
        };
        fixes.push({
          id: `sleep-fix:${capacityFingerprint(candidate)}`,
          label: `Try Sleep at ${alternative.sleepStart}`,
          action: "moveBlock",
          sleepPlacement: candidate,
        });
      }
    }
  const distance = (fix: SuggestedFix) => {
    const placement = fix.sleepPlacement!;
    const o = resolution.unconstrainedOccurrences?.find(
      (o) => getPlanDecisionTargetKey(o.reference) === getPlanDecisionTargetKey(placement.target),
    );
    return o
      ? Math.abs(
          Date.parse(placement.payload.sleepStart) -
            Date.parse(o.derivationContext.preferredSleepStart),
        )
      : 0;
  };
  const key = capacityFingerprint(evidence);
  return [
    {
      id: `sleep-friction:${key}`,
      userId: "local",
      kind: "sleep",
      severity: "critical",
      title:
        resolution.status === "infeasible"
          ? "Required Sleep cannot fit"
          : "Accepted Sleep placement needs review",
      message:
        resolution.status === "infeasible"
          ? "The complete joint search proved that required Sleep and its protection cannot fit around current hard commitments."
          : "Planning is blocked until this accepted placement is corrected or explicitly revoked.",
      affectedBlockIds: [],
      suggestedFixes: fixes.sort(
        (a, b) =>
          distance(a) - distance(b) ||
          a.sleepPlacement!.payload.sleepStart.localeCompare(
            b.sleepPlacement!.payload.sleepStart,
          ) ||
          getPlanDecisionTargetKey(a.sleepPlacement!.target).localeCompare(
            getPlanDecisionTargetKey(b.sleepPlacement!.target),
          ),
      ),
      canIgnore: false,
      ignored: false,
      resolved: false,
      createdAt: detectedAt,
      updatedAt: detectedAt,
      sleepEvidence: evidence,
    },
  ];
}
