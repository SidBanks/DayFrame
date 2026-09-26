import { queryEffectiveSleepRequirement } from "../sleep/sleepRequirement.js";
import { createPublishedSleepSnapshot } from "../sleep/publishedSleep.js";
import { deriveFoundationalSchedule } from "../planning/deriveFoundationalSchedule.js";
import type { SleepFoundationAuthority } from "../sleep/sleepFoundationalOccupancy.js";
import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../cycles/resolveEffectiveSchedulePreferences.js";
import {
  materializeHistoricalExecutionTarget,
  type HistoricalExecutionTargetSelection,
} from "../execution/historicalExecutionTarget.js";
import { durableOccurrenceReferencesEqual } from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import type { DayFrameAuthoredSetup, DayFramePreview } from "../../state/types.js";
import {
  HISTORICAL_PLAN_DAY_PUBLICATION_VERSION,
  HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_V2_VERSION,
  createHistoricalRealizedScheduleSnapshot,
  createPlanPublicationBatch,
  createPlanPublicationBatchId,
  isPlanPublicationBatchId,
  type HistoricalPlanConstructionProviders,
  type HistoricalPlanDayPublicationV1,
  type HistoricalOccurrenceTimingV2,
  type HistoricalPlannedOccurrenceSnapshot,
  type HistoricalPlannedOccurrenceSnapshotV2,
  type PlanPublicationBatchV1,
} from "./historicalPlan.js";
import type { GoalV1, GoalCommitmentLinkV1 } from "../goals/goal.js";
import {
  containsRange,
  previewRangeFromLegacyInclusive,
  type PublicationRangeV1,
} from "../planning/planningScope.js";
import { addUserDayLabels } from "../time/canonicalUserDay.js";

export type MaterializePlanPublicationResult =
  | { status: "materialized"; batch: PlanPublicationBatchV1 }
  | { status: "noPreview" | "stalePreview" | "tryPreview" }
  | { status: "inconsistentPlanContext"; detail: string }
  | { status: "unsupportedOccurrenceFamily"; detail: string }
  | { status: "invalidCandidate"; detail: string };

export function materializePlanPublication(input: {
  authoredSetup: DayFrameAuthoredSetup;
  sleepAuthority?: SleepFoundationAuthority;
  preview?: DayFramePreview | null;
  providers?: HistoricalPlanConstructionProviders;
  goals?: readonly GoalV1[];
  publicationRange?: PublicationRangeV1;
}): MaterializePlanPublicationResult {
  let preview = input.preview;
  if (!preview) return { status: "noPreview" };
  if (preview.isStale) return { status: "stalePreview" };
  if (preview.revisedAt !== undefined) return { status: "tryPreview" };
  const previewRange =
    preview.scopeMetadata?.requestedPreviewRange ?? previewRangeFromLegacyInclusive(preview);
  const publicationRange = input.publicationRange ?? {
    version: 1 as const,
    scopeType: "publicationRange" as const,
    startUserDayDate: previewRange.startUserDayDate,
    endUserDayDateExclusive: previewRange.endUserDayDateExclusive,
    provenance: { source: "explicitPublication" as const },
  };
  if (!containsRange(previewRange, publicationRange))
    return {
      status: "inconsistentPlanContext",
      detail: "publication range is not completely covered by current schedule materialization",
    };
  const publicationEndInclusive = addUserDayLabels(publicationRange.endUserDayDateExclusive, -1);
  const dates = enumerateDates(publicationRange.startUserDayDate, publicationEndInclusive);
  if (!dates) return { status: "invalidCandidate", detail: "requested range is invalid" };
  const hasSleep =
    (input.authoredSetup.sleepRequirements?.length ?? 0) > 0 ||
    input.sleepAuthority?.planDecisions.some((d) => d.kind === "placeSleepOccurrence") ||
    !!preview.result.foundation;
  if (hasSleep) {
    if (!input.sleepAuthority)
      return { status: "inconsistentPlanContext", detail: "Current Sleep authority is required" };
    const fresh = deriveFoundationalSchedule({
      authoredState:
        input.authoredSetup as import("../../state/types.js").ActiveDayFrameAuthoredSetup,
      authority: input.sleepAuthority,
      ownerRange: {
        startUserDayDate: previewRange.startUserDayDate,
        endUserDayDateExclusive: previewRange.endUserDayDateExclusive,
      },
      generatedAt: preview.generatedAt,
    });
    if (fresh.foundation.status !== "allocatable")
      return {
        status: "inconsistentPlanContext",
        detail: "Sleep foundation is not publication eligible",
      };
    preview = { ...preview, result: fresh.schedule };
  }
  let batchId: import("./historicalPlan.js").PlanPublicationBatchId;
  try {
    batchId = (input.providers?.allocateBatchId ?? createPlanPublicationBatchId)();
  } catch {
    return { status: "invalidCandidate", detail: "Publication identity allocation failed" };
  }
  if (!isPlanPublicationBatchId(batchId))
    return { status: "invalidCandidate", detail: "Publication identity is invalid" };
  const days = new Map<string, HistoricalPlanDayPublicationV1>();
  for (const userDayDate of dates) {
    const preferences = resolveEffectiveSchedulePreferencesForUserDayDate({
      shiftCycles: input.authoredSetup.shiftCycles,
      defaultSchedulingPreferences: input.authoredSetup.schedulingPreferences,
      userDayDate,
    });
    days.set(userDayDate, {
      version:
        preview.result.foundation || input.sleepAuthority?.status === "complete"
          ? 2
          : HISTORICAL_PLAN_DAY_PUBLICATION_VERSION,
      ...(preview.result.foundation || input.sleepAuthority?.status === "complete"
        ? {
            sleepCoverage: (() => {
              const status = queryEffectiveSleepRequirement(
                input.authoredSetup.sleepRequirements ?? [],
                userDayDate,
              ).status;
              return status === "effective"
                ? ("satisfied" as const)
                : status === "notConfigured"
                  ? ("notConfigured" as const)
                  : ("notApplicable" as const);
            })(),
          }
        : {}),
      userDayDate,
      dayBoundaryStartTime: preferences.dayBoundaryStartTime,
      weekStartsOn: preferences.weekStartsOn,
      utcOffsetMinutes: -new Date(`${userDayDate}T12:00:00`).getTimezoneOffset(),
      occurrences: [],
    });
  }
  const selections: HistoricalExecutionTargetSelection[] = [
    ...preview.result.scheduledBlocks
      .filter(
        (block) =>
          block.userDayDate >= publicationRange.startUserDayDate &&
          block.userDayDate < publicationRange.endUserDayDateExclusive,
      )
      .filter((block) => block.source !== "importedCalendar" && block.source !== "rule")
      .map((block) => ({ kind: "scheduledBlock" as const, blockId: block.id })),
    ...preview.result.generatedWorkBlocks
      .filter(
        (block) =>
          block.userDayDate >= publicationRange.startUserDayDate &&
          block.userDayDate < publicationRange.endUserDayDateExclusive,
      )
      .map((block) => ({ kind: "workBlock" as const, blockId: block.id })),
    ...preview.result.unplacedCandidates
      .filter(
        (candidate) =>
          candidate.userDayDate >= publicationRange.startUserDayDate &&
          candidate.userDayDate < publicationRange.endUserDayDateExclusive,
      )
      .map((candidate) => ({ kind: "unplacedCandidate" as const, candidateId: candidate.id })),
    ...preview.result.planDecisionResults
      .filter((result) => result.kind === "omitOccurrence" && result.status === "applied")
      .map((result) => ({ kind: "planDecision" as const, decisionId: result.decisionId })),
  ];
  for (const selection of selections) {
    const result = materializeHistoricalExecutionTarget({
      authoredSetup: input.authoredSetup,
      preview,
      selection,
    });
    if (result.status === "unsupportedFamily" || result.status === "notReportable") {
      return {
        status: "unsupportedOccurrenceFamily",
        detail: `${selection.kind}:${result.status}`,
      };
    }
    if (result.status !== "materialized")
      return { status: "inconsistentPlanContext", detail: `${selection.kind}:${result.status}` };
    const containingDay = days.get(result.target.snapshot.userDay.date);
    // Resolve omission evidence before range filtering; missing context must still fail closed.
    if (
      !containingDay &&
      selection.kind === "planDecision" &&
      result.target.snapshot.plan.state === "omitted"
    )
      continue;
    if (!containingDay)
      return {
        status: "inconsistentPlanContext",
        detail: "occurrence lies outside requested visible range",
      };
    const snapshot: HistoricalPlannedOccurrenceSnapshotV2 = {
      version: HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_V2_VERSION,
      reference: structuredClone(result.target.reference),
      sourceFamily: result.target.snapshot.sourceFamily as "template" | "work" | "manualEvent",
      title: result.target.snapshot.title,
      category: result.target.snapshot.category,
      plan: { ...result.target.snapshot.plan } as HistoricalPlannedOccurrenceSnapshotV2["plan"],
      timing: timingForSelection(selection, preview),
      ...(selection.kind === "scheduledBlock"
        ? (() => {
            const composition = preview.result.scheduledBlocks.find(
              (block) => block.id === selection.blockId,
            )?.composition;
            return composition ? { composition: structuredClone(composition) } : {};
          })()
        : {}),
      ...goalProvenance(result.target.reference, input.goals ?? []),
    };
    const existing = containingDay.occurrences.find((value) =>
      durableOccurrenceReferencesEqual(value.reference, snapshot.reference),
    );
    if (!existing) containingDay.occurrences.push(snapshot);
    else if (!mergeEquivalentSnapshot(existing, snapshot))
      return {
        status: "inconsistentPlanContext",
        detail: "duplicate occurrence representations disagree",
      };
  }
  for (const fact of preview.result.realizedScheduleFacts ?? []) {
    if (
      fact.userDayDate < publicationRange.startUserDayDate ||
      fact.userDayDate >= publicationRange.endUserDayDateExclusive
    )
      continue;
    const containingDay = days.get(fact.userDayDate);
    if (!containingDay)
      return {
        status: "inconsistentPlanContext",
        detail: "realized fact lies outside requested visible range",
      };
    const goal = (input.goals ?? []).find((value) => value.id === fact.lineage.goalId);
    containingDay.occurrences.push(
      createHistoricalRealizedScheduleSnapshot({
        fact,
        title:
          fact.scheduleRole === "productiveGoalWork"
            ? (goal?.title ?? "Goal work")
            : fact.scheduleRole === "supportActivity"
              ? "Goal support"
              : "Goal buffer protection",
        category:
          fact.scheduleRole === "productiveGoalWork"
            ? "work"
            : fact.scheduleRole === "supportActivity"
              ? "admin"
              : "maintenance",
        ...(goal
          ? {
              goals: [
                {
                  version: 1,
                  goalId: goal.id,
                  goalRevision: goal.revision,
                  title: goal.title,
                  status: goal.status,
                  ...(goal.measurementPolicy
                    ? { measurementPolicy: { ...goal.measurementPolicy } }
                    : {}),
                },
              ],
            }
          : {}),
      }),
    );
  }
  const sleep = preview.result.foundation?.sleep;
  if (sleep?.status === "satisfied")
    for (const occurrence of sleep.occurrences) {
      const day = days.get(occurrence.ownerDay);
      if (!day) continue;
      const requirement = input.authoredSetup.sleepRequirements?.find(
        (r) =>
          r.id === occurrence.reference.requirement.id &&
          r.incarnationId === occurrence.reference.requirement.incarnationId &&
          r.revision === occurrence.requirementRevision,
      );
      if (!requirement)
        return {
          status: "inconsistentPlanContext",
          detail: "Missing frozen Sleep requirement revision",
        };
      const acceptedPlacement =
        input.sleepAuthority?.planDecisions.find(
          (d): d is Extract<typeof d, { kind: "placeSleepOccurrence" }> =>
            d.kind === "placeSleepOccurrence" &&
            d.payload.revokedAt === null &&
            durableOccurrenceReferencesEqual(d.target, occurrence.reference),
        ) ?? null;
      day.occurrences.push(
        createPublishedSleepSnapshot({
          publicationBatchId: batchId,
          publicationRange: {
            startUserDayDate: publicationRange.startUserDayDate,
            endUserDayDate: publicationEndInclusive,
          },
          requirement,
          occurrence,
          acceptedPlacement,
        }),
      );
    }
  const construction = createPlanPublicationBatch(
    {
      range: {
        startUserDayDate: publicationRange.startUserDayDate,
        endUserDayDate: publicationEndInclusive,
      },
      days: [...days.values()],
    },
    { ...input.providers, allocateBatchId: () => batchId },
  );
  return construction.status === "created"
    ? { status: "materialized", batch: construction.batch }
    : {
        status: "invalidCandidate",
        detail:
          construction.status === "allocationFailure"
            ? construction.reason
            : construction.issues.map((issue) => issue.code).join(","),
      };
}
function goalProvenance(
  reference: import("../occurrences/durableOccurrenceReference.js").DurableOccurrenceReference,
  goals: readonly GoalV1[],
) {
  const matches = goals
    .filter((goal) => goal.links.some((link) => matchesReference(link, reference)))
    .map((goal) => ({
      version: 1 as const,
      goalId: goal.id,
      goalRevision: goal.revision,
      title: goal.title,
      status: goal.status,
      ...(goal.measurementPolicy ? { measurementPolicy: { ...goal.measurementPolicy } } : {}),
    }))
    .sort((a, b) => a.goalId.localeCompare(b.goalId));
  return { goals: matches };
}
function matchesReference(
  link: GoalCommitmentLinkV1,
  reference: import("../occurrences/durableOccurrenceReference.js").DurableOccurrenceReference,
) {
  if (reference.sourceKind === "acceptedAllocation" || reference.sourceKind === "sleepRequirement")
    return false;
  const lifetimes =
    reference.sourceKind === "template"
      ? [
          ["blockTemplate", reference.template],
          ["blockRecurrence", reference.recurrence],
        ]
      : reference.sourceKind === "manualEvent"
        ? [["manualEvent", reference.manualEvent]]
        : [
            ["shiftCycle", reference.cycle],
            [
              reference.entry.kind === "segment" ? "shiftSegment" : "shiftSequenceEntry",
              reference.entry,
            ],
            ["shiftDefinition", reference.shiftDefinition],
          ];
  return lifetimes.some(
    ([kind, lifetime]) =>
      link.sourceKind === kind &&
      link.id === (lifetime as { id: string }).id &&
      link.incarnationId === (lifetime as { incarnationId: string }).incarnationId,
  );
}

function mergeEquivalentSnapshot(
  existing: HistoricalPlannedOccurrenceSnapshot,
  candidate: HistoricalPlannedOccurrenceSnapshot,
): boolean {
  if (
    existing.sourceFamily !== candidate.sourceFamily ||
    existing.title !== candidate.title ||
    existing.category !== candidate.category
  )
    return false;
  if (
    existing.version !== candidate.version ||
    (existing.version === 2 &&
      candidate.version === 2 &&
      existing.timing.kind !== candidate.timing.kind)
  )
    return false;
  if (JSON.stringify(existing.plan) === JSON.stringify(candidate.plan)) return true;
  if (existing.plan.state === "unplaced" && candidate.plan.state === "blocked") {
    existing.plan = { state: "blocked" };
    return true;
  }
  if (existing.plan.state === "blocked" && candidate.plan.state === "unplaced") return true;
  return false;
}
function timingForSelection(
  selection: HistoricalExecutionTargetSelection,
  preview: DayFramePreview,
): HistoricalOccurrenceTimingV2 {
  if (selection.kind !== "scheduledBlock") return { kind: "timed" };
  const block = preview.result.scheduledBlocks.find((value) => value.id === selection.blockId);
  if (!block) throw new RangeError(`Missing scheduled block timing source: ${selection.blockId}`);
  return { kind: block.isAllDay === true ? "allDay" : "timed" };
}
function enumerateDates(start: LocalDateString, end: LocalDateString): LocalDateString[] | null {
  const first = Date.parse(`${start}T00:00:00Z`);
  const last = Date.parse(`${end}T00:00:00Z`);
  if (!Number.isFinite(first) || !Number.isFinite(last) || first > last) return null;
  const result: LocalDateString[] = [];
  for (let at = first; at <= last; at += 86_400_000)
    result.push(new Date(at).toISOString().slice(0, 10) as LocalDateString);
  return result;
}
