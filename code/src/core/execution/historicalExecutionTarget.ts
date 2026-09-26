import type { BlockCandidate, DraftScheduledBlock } from "../blocks/types.js";
import { resolveUserWeekStartDateForLabel } from "../time/canonicalUserDay.js";
import {
  createDurableOccurrenceReference,
  durableOccurrenceReferencesEqual,
  resolveDurableOccurrenceReference,
  validateDurableOccurrenceReference,
  type DurableOccurrenceReference,
} from "../occurrences/durableOccurrenceReference.js";
import type { OccurrenceIdentity } from "../occurrences/occurrenceIdentity.js";
import type { PlanDecisionReplayResult } from "../decisions/replayPlanDecisions.js";
import type { PlanDecisionV1 } from "../decisions/planDecision.js";
import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../cycles/resolveEffectiveSchedulePreferences.js";
import type { DayFrameAuthoredSetup, DayFramePreview } from "../../state/types.js";
import {
  validateExecutionHistoricalSnapshot,
  type ExecutionHistoricalSnapshot,
} from "./executionRecord.js";

export type HistoricalExecutionTarget = {
  reference: DurableOccurrenceReference;
  snapshot: ExecutionHistoricalSnapshot;
};

export type HistoricalExecutionTargetSelection =
  | { kind: "scheduledBlock"; blockId: string }
  | { kind: "unplacedCandidate"; candidateId: string }
  | { kind: "workBlock"; blockId: string }
  | { kind: "planDecision"; decisionId: PlanDecisionV1["id"] }
  | { kind: "historicalReference"; reference: DurableOccurrenceReference };

export type HistoricalExecutionTargetMaterialization =
  | { status: "materialized"; target: HistoricalExecutionTarget }
  | { status: "notReportable" }
  | { status: "stalePreview" }
  | { status: "tryOnlyPreview" }
  | { status: "unsupportedFamily" }
  | { status: "sourceMissing" }
  | { status: "lifetimeMismatch" }
  | { status: "occurrenceMissing" }
  | { status: "insufficientHistoricalContext" }
  | { status: "invalidSnapshot"; issues: string[] }
  | { status: "invalidReference"; issues: string[] };

export function materializeHistoricalExecutionTarget(input: {
  authoredSetup: DayFrameAuthoredSetup;
  selection: HistoricalExecutionTargetSelection;
  preview?: DayFramePreview | null;
}): HistoricalExecutionTargetMaterialization {
  if (input.selection.kind === "historicalReference") {
    return materializeHistoricalReference(input.selection.reference, input.authoredSetup);
  }
  const preview = input.preview;
  if (!preview) return { status: "insufficientHistoricalContext" };
  if (preview.isStale) return { status: "stalePreview" };
  if (preview.revisedAt !== undefined) return { status: "tryOnlyPreview" };
  switch (input.selection.kind) {
    case "scheduledBlock": {
      const blockId = input.selection.blockId;
      const block = preview.result.scheduledBlocks.find((current) => current.id === blockId);
      if (!block) return { status: "notReportable" };
      if (
        block.source === "importedCalendar" ||
        block.source === "rule" ||
        !block.occurrenceIdentity
      )
        return { status: "unsupportedFamily" };
      const previewCandidate = candidateForIdentity(
        preview.result.blockCandidates,
        block.occurrenceIdentity,
        input.authoredSetup,
      );
      return fromOccurrence(block.occurrenceIdentity, input.authoredSetup, {
        plan: {
          state: "scheduled",
          startsAt: block.startsAt.toISOString(),
          endsAt: block.endsAt.toISOString(),
        },
        userDayDate: block.userDayDate,
        placementInstant: block.startsAt,
        ...(previewCandidate ? { previewCandidate } : {}),
      });
    }
    case "workBlock": {
      const blockId = input.selection.blockId;
      const block = preview.result.generatedWorkBlocks.find((current) => current.id === blockId);
      if (!block?.occurrenceIdentity)
        return block ? { status: "unsupportedFamily" } : { status: "notReportable" };
      return fromOccurrence(block.occurrenceIdentity, input.authoredSetup, {
        plan: {
          state: "scheduled",
          startsAt: block.startsAt.toISOString(),
          endsAt: block.endsAt.toISOString(),
        },
        userDayDate: block.userDayDate,
        placementInstant: block.startsAt,
      });
    }
    case "unplacedCandidate": {
      const candidateId = input.selection.candidateId;
      const candidate = preview.result.unplacedCandidates.find(
        (current) => current.id === candidateId,
      );
      if (!candidate?.occurrenceIdentity)
        return candidate ? { status: "unsupportedFamily" } : { status: "notReportable" };
      const constructed = createDurableOccurrenceReference(
        candidate.occurrenceIdentity,
        input.authoredSetup,
      );
      if (constructed.status !== "created") return constructionFailure(constructed.status);
      const blocked = preview.result.planDecisionResults.some(
        (result) =>
          result.status === "blocked" &&
          durableOccurrenceReferencesEqual(result.target, constructed.reference),
      );
      return fromOccurrence(candidate.occurrenceIdentity, input.authoredSetup, {
        plan: { state: blocked ? "blocked" : "unplaced" },
        userDayDate: candidate.userDayDate,
        placementInstant: userDayNoon(candidate.userDayDate),
        previewCandidate: candidate,
      });
    }
    case "planDecision":
      return fromDecision(
        input.selection.decisionId,
        preview.result.planDecisionResults,
        preview.result.blockCandidates,
        input.authoredSetup,
        preview,
      );
  }
}

function fromDecision(
  decisionId: PlanDecisionV1["id"],
  replayResults: readonly PlanDecisionReplayResult[],
  candidates: readonly BlockCandidate[],
  authoredSetup: DayFrameAuthoredSetup,
  preview: DayFramePreview,
): HistoricalExecutionTargetMaterialization {
  const replay = replayResults.find((current) => current.decisionId === decisionId);
  if (!replay) return { status: "notReportable" };
  const state =
    replay.kind === "omitOccurrence" && replay.status === "applied"
      ? ("omitted" as const)
      : replay.kind === "placeOccurrence" && replay.status === "blocked"
        ? ("blocked" as const)
        : undefined;
  if (!state) return { status: "notReportable" };
  let candidate:
    | Pick<BlockCandidate, "occurrenceIdentity" | "userDayDate" | "title" | "category">
    | undefined;
  const evidence = preview.result.omissionEvidence;
  if (state === "omitted" && evidence) {
    if (replay.target.sourceKind !== "template") return { status: "unsupportedFamily" };
    const resolution = resolveDurableOccurrenceReference(replay.target, authoredSetup);
    if (resolution.status !== "resolved") return resolutionFailure(replay.target, authoredSetup);
    if (
      evidence.generatedAt !== preview.generatedAt ||
      evidence.planningWindowStart !== preview.planningWindowStart.toISOString() ||
      evidence.planningWindowEnd !== preview.planningWindowEnd.toISOString()
    )
      return { status: "insufficientHistoricalContext" };
    const matches = evidence.occurrences.filter((entry) => entry.decisionId === decisionId);
    if (matches.length !== 1) return { status: "insufficientHistoricalContext" };
    const entry = matches[0]!;
    if (
      !durableOccurrenceReferencesEqual(entry.target, replay.target) ||
      entry.occurrenceIdentity.sourceKind !== "template" ||
      (entry.occurrenceIdentity.scopeKind === "userDay"
        ? entry.occurrenceIdentity.userDayDate !== entry.userDayDate
        : entry.occurrenceIdentity.userWeekStartDate !==
          resolveUserWeekStartDateForLabel({
            shiftCycles: authoredSetup.shiftCycles,
            defaultSchedulingPreferences: authoredSetup.schedulingPreferences,
            userDayDate: entry.userDayDate,
          }))
    )
      return { status: "insufficientHistoricalContext" };
    const reference = createDurableOccurrenceReference(entry.occurrenceIdentity, authoredSetup);
    if (
      reference.status !== "created" ||
      !durableOccurrenceReferencesEqual(reference.reference, replay.target)
    )
      return { status: "insufficientHistoricalContext" };
    candidate = entry;
  } else candidate = candidateForReference(candidates, replay.target, authoredSetup);
  if (!candidate?.occurrenceIdentity) return resolutionFailure(replay.target, authoredSetup);
  return fromOccurrence(candidate.occurrenceIdentity, authoredSetup, {
    plan: { state },
    userDayDate: candidate.userDayDate,
    placementInstant: userDayNoon(candidate.userDayDate),
    previewCandidate: candidate,
  });
}

function materializeHistoricalReference(
  reference: DurableOccurrenceReference,
  authoredSetup: DayFrameAuthoredSetup,
): HistoricalExecutionTargetMaterialization {
  const validation = validateDurableOccurrenceReference(reference);
  if (validation.status === "invalid")
    return { status: "invalidReference", issues: validation.issues };
  if (validation.status === "unsupportedVersion")
    return { status: "invalidReference", issues: ["unsupported reference version"] };
  const resolution = resolveDurableOccurrenceReference(validation.reference, authoredSetup);
  if (resolution.status !== "resolved")
    return mapResolution(
      resolution.status,
      resolution.status === "invalidReference" ? resolution.issues : undefined,
    );
  // Current source continuity cannot establish past mutable title/category or lost heuristic placement.
  return { status: "insufficientHistoricalContext" };
}

function fromOccurrence(
  identity: OccurrenceIdentity,
  authoredSetup: DayFrameAuthoredSetup,
  context: {
    plan: ExecutionHistoricalSnapshot["plan"];
    userDayDate: string;
    placementInstant: Date;
    previewCandidate?: Pick<BlockCandidate, "title" | "category">;
  },
): HistoricalExecutionTargetMaterialization {
  if (identity.sourceKind === "sleepRequirement") return { status: "sourceMissing" };
  const construction = createDurableOccurrenceReference(identity, authoredSetup);
  if (construction.status !== "created") return constructionFailure(construction.status);
  const referenceValidation = validateDurableOccurrenceReference(construction.reference);
  if (referenceValidation.status !== "valid")
    return {
      status: "invalidReference",
      issues:
        referenceValidation.status === "invalid"
          ? referenceValidation.issues
          : ["unsupported reference version"],
    };
  const source = sourceContext(identity, authoredSetup, context.previewCandidate);
  if (!source) return { status: "sourceMissing" };
  const preferences = resolveEffectiveSchedulePreferencesForUserDayDate({
    shiftCycles: authoredSetup.shiftCycles,
    defaultSchedulingPreferences: authoredSetup.schedulingPreferences,
    userDayDate: context.userDayDate as DayFrameAuthoredSetup["previewRange"]["startDate"],
  });
  const snapshot: ExecutionHistoricalSnapshot = {
    sourceFamily: identity.sourceKind,
    title: source.title,
    category: source.category,
    userDay: {
      date: context.userDayDate as ExecutionHistoricalSnapshot["userDay"]["date"],
      dayBoundaryStartTime: preferences.dayBoundaryStartTime,
      utcOffsetMinutes: -context.placementInstant.getTimezoneOffset(),
    },
    plan: { ...context.plan },
  };
  const snapshotValidation = validateExecutionHistoricalSnapshot(snapshot);
  if (snapshotValidation.status === "invalid")
    return { status: "invalidSnapshot", issues: snapshotValidation.issues };
  return {
    status: "materialized",
    target: {
      reference: structuredClone(referenceValidation.reference),
      snapshot: snapshotValidation.snapshot,
    },
  };
}

function sourceContext(
  identity: OccurrenceIdentity,
  state: DayFrameAuthoredSetup,
  candidate?: Pick<BlockCandidate, "title" | "category">,
): { title: string; category: ExecutionHistoricalSnapshot["category"] } | undefined {
  if (identity.sourceKind === "template") {
    const template = state.blockTemplates.find((current) => current.id === identity.templateId);
    return template
      ? {
          title: candidate?.title ?? template.title,
          category: candidate?.category ?? template.category,
        }
      : undefined;
  }
  if (identity.sourceKind === "work") {
    const shift = state.shiftDefinitions.find(
      (current) => current.id === identity.shiftDefinitionId,
    );
    return shift ? { title: shift.name, category: "work" } : undefined;
  }
  if (identity.sourceKind === "sleepRequirement") return undefined;
  const event = state.manualEvents.find((current) => current.id === identity.manualEventId);
  return event ? { title: event.title, category: "optional" } : undefined;
}

function candidateForIdentity(
  candidates: readonly BlockCandidate[],
  identity: OccurrenceIdentity,
  state: DayFrameAuthoredSetup,
): BlockCandidate | undefined {
  const constructed = createDurableOccurrenceReference(identity, state);
  return constructed.status === "created"
    ? candidateForReference(candidates, constructed.reference, state)
    : undefined;
}

function candidateForReference(
  candidates: readonly BlockCandidate[],
  reference: DurableOccurrenceReference,
  state: DayFrameAuthoredSetup,
): BlockCandidate | undefined {
  return candidates.find((candidate) => {
    if (!candidate.occurrenceIdentity) return false;
    const constructed = createDurableOccurrenceReference(candidate.occurrenceIdentity, state);
    return (
      constructed.status === "created" &&
      durableOccurrenceReferencesEqual(constructed.reference, reference)
    );
  });
}

function resolutionFailure(
  reference: DurableOccurrenceReference,
  state: DayFrameAuthoredSetup,
): HistoricalExecutionTargetMaterialization {
  const resolution = resolveDurableOccurrenceReference(reference, state);
  return resolution.status === "resolved"
    ? { status: "insufficientHistoricalContext" }
    : mapResolution(
        resolution.status,
        resolution.status === "invalidReference" ? resolution.issues : undefined,
      );
}

function mapResolution(
  status: Exclude<ReturnType<typeof resolveDurableOccurrenceReference>["status"], "resolved">,
  issues?: string[],
): HistoricalExecutionTargetMaterialization {
  if (status === "sourceMissing") return { status: "sourceMissing" };
  if (status === "lifetimeMismatch") return { status: "lifetimeMismatch" };
  if (status === "occurrenceMissing") return { status: "occurrenceMissing" };
  return { status: "invalidReference", issues: issues ?? ["unsupported reference"] };
}

function constructionFailure(
  status: "unsupportedOccurrence" | "missingSourceLineage",
): HistoricalExecutionTargetMaterialization {
  return status === "unsupportedOccurrence"
    ? { status: "unsupportedFamily" }
    : { status: "sourceMissing" };
}

function userDayNoon(date: string): Date {
  return new Date(`${date}T12:00:00`);
}

export function isReportableScheduledBlock(block: DraftScheduledBlock): boolean {
  return (
    (block.source === "template" || block.source === "manual") &&
    block.occurrenceIdentity !== undefined
  );
}
