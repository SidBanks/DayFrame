import { applySuggestedFix } from "../friction/applySuggestedFix.js";
import { detectScheduleFriction } from "../friction/detectScheduleFriction.js";
import { generateSuggestedFixes } from "../friction/generateSuggestedFixes.js";
import type { SuggestedFixFeedback } from "../friction/types.js";
import type { TimeString } from "../time/types.js";
import type { LocalDateString } from "../shifts/types.js";
import type { GenerateSchedulePreviewResult } from "./generateSchedulePreview.js";
import { cloneOccurrenceIdentity } from "../occurrences/occurrenceIdentity.js";

export type ReviseSchedulePreviewInput = {
  preview: GenerateSchedulePreviewResult;
  selectedFrictionPointId: string;
  selectedSuggestedFixId: string;
  dayBoundaryStartTime: TimeString;
  revisedAt: string;
  getUserDayWindowForUserDayDate?: (userDayDate: LocalDateString) => { start: Date; end: Date };
};

export type ReviseSchedulePreviewActionResult = {
  preview: GenerateSchedulePreviewResult;
  actionFeedback?: SuggestedFixFeedback;
  didRevise: boolean;
};
export type ReviseSchedulePreviewResult = ReviseSchedulePreviewActionResult;

export function reviseSchedulePreview(
  input: ReviseSchedulePreviewInput,
): ReviseSchedulePreviewActionResult {
  const appliedFixResult = applySuggestedFix({
    frictionPoints: input.preview.frictionPoints,
    generatedWorkBlocks: input.preview.generatedWorkBlocks,
    scheduledBlocks: input.preview.scheduledBlocks,
    unplacedCandidates: input.preview.unplacedCandidates,
    selectedFrictionPointId: input.selectedFrictionPointId,
    selectedSuggestedFixId: input.selectedSuggestedFixId,
    dayBoundaryStartTime: input.dayBoundaryStartTime,
    revisedAt: input.revisedAt,
    ...(input.getUserDayWindowForUserDayDate
      ? { getUserDayWindowForUserDayDate: input.getUserDayWindowForUserDayDate }
      : {}),
  });

  if (!appliedFixResult.didRevise) {
    return {
      preview: clonePreviewResult(input.preview),
      ...(appliedFixResult.actionFeedback
        ? { actionFeedback: appliedFixResult.actionFeedback }
        : {}),
      didRevise: false,
    };
  }

  const frictionDetectionResult = detectScheduleFriction({
    generatedWorkBlocks: input.preview.generatedWorkBlocks,
    scheduledBlocks: appliedFixResult.scheduledBlocks,
    unplacedCandidates: appliedFixResult.unplacedCandidates,
    detectedAt: input.revisedAt,
  });

  const suggestedFixesResult = generateSuggestedFixes({
    frictionPoints: frictionDetectionResult.frictionPoints,
    generatedWorkBlocks: input.preview.generatedWorkBlocks,
    scheduledBlocks: appliedFixResult.scheduledBlocks,
    unplacedCandidates: appliedFixResult.unplacedCandidates,
    dayBoundaryStartTime: input.dayBoundaryStartTime,
    ...(input.getUserDayWindowForUserDayDate
      ? { getUserDayWindowForUserDayDate: input.getUserDayWindowForUserDayDate }
      : {}),
  });

  return {
    preview: {
      generatedWorkBlocks: input.preview.generatedWorkBlocks.map((generatedWorkBlock) => ({
        ...generatedWorkBlock,
        ...(generatedWorkBlock.occurrenceIdentity
          ? { occurrenceIdentity: cloneOccurrenceIdentity(generatedWorkBlock.occurrenceIdentity) }
          : {}),
        startsAt: new Date(generatedWorkBlock.startsAt),
        endsAt: new Date(generatedWorkBlock.endsAt),
      })),
      blockCandidates: input.preview.blockCandidates.map((blockCandidate) => ({
        ...blockCandidate,
        ...(blockCandidate.occurrenceIdentity
          ? { occurrenceIdentity: cloneOccurrenceIdentity(blockCandidate.occurrenceIdentity) }
          : {}),
        externalResources: [...blockCandidate.externalResources],
      })),
      scheduledBlocks: appliedFixResult.scheduledBlocks,
      unplacedCandidates: appliedFixResult.unplacedCandidates,
      frictionPoints: mergeResolvedFrictionState(
        suggestedFixesResult.frictionPoints,
        appliedFixResult.frictionPoints,
      ),
      planDecisionResults: input.preview.planDecisionResults.map((result) =>
        structuredClone(result),
      ),
    },
    didRevise: true,
  };
}

function clonePreviewResult(preview: GenerateSchedulePreviewResult): GenerateSchedulePreviewResult {
  return {
    generatedWorkBlocks: preview.generatedWorkBlocks.map((generatedWorkBlock) => ({
      ...generatedWorkBlock,
      ...(generatedWorkBlock.occurrenceIdentity
        ? { occurrenceIdentity: cloneOccurrenceIdentity(generatedWorkBlock.occurrenceIdentity) }
        : {}),
      startsAt: new Date(generatedWorkBlock.startsAt),
      endsAt: new Date(generatedWorkBlock.endsAt),
    })),
    blockCandidates: preview.blockCandidates.map((blockCandidate) => ({
      ...blockCandidate,
      ...(blockCandidate.occurrenceIdentity
        ? { occurrenceIdentity: cloneOccurrenceIdentity(blockCandidate.occurrenceIdentity) }
        : {}),
      externalResources: [...blockCandidate.externalResources],
    })),
    scheduledBlocks: preview.scheduledBlocks.map((scheduledBlock) => ({
      ...scheduledBlock,
      ...(scheduledBlock.occurrenceIdentity
        ? { occurrenceIdentity: cloneOccurrenceIdentity(scheduledBlock.occurrenceIdentity) }
        : {}),
      startsAt: new Date(scheduledBlock.startsAt),
      endsAt: new Date(scheduledBlock.endsAt),
      externalResources: [...scheduledBlock.externalResources],
    })),
    unplacedCandidates: preview.unplacedCandidates.map((blockCandidate) => ({
      ...blockCandidate,
      ...(blockCandidate.occurrenceIdentity
        ? { occurrenceIdentity: cloneOccurrenceIdentity(blockCandidate.occurrenceIdentity) }
        : {}),
      externalResources: [...blockCandidate.externalResources],
    })),
    frictionPoints: preview.frictionPoints.map((frictionPoint) => ({
      ...frictionPoint,
      suggestedFixes: frictionPoint.suggestedFixes.map((suggestedFix) => ({
        ...suggestedFix,
        ...(suggestedFix.parameters ? { parameters: { ...suggestedFix.parameters } } : {}),
        ...(suggestedFix.decisionContext
          ? { decisionContext: { ...suggestedFix.decisionContext } }
          : {}),
      })),
    })),
    planDecisionResults: preview.planDecisionResults.map((result) => structuredClone(result)),
    ...(preview.realizedScheduleFacts
      ? { realizedScheduleFacts: structuredClone(preview.realizedScheduleFacts) }
      : {}),
  };
}

function mergeResolvedFrictionState(
  refreshedFrictionPoints: GenerateSchedulePreviewResult["frictionPoints"],
  revisedFrictionPoints: GenerateSchedulePreviewResult["frictionPoints"],
): GenerateSchedulePreviewResult["frictionPoints"] {
  const revisedFrictionPointsById = new Map(
    revisedFrictionPoints.map((frictionPoint) => [frictionPoint.id, frictionPoint]),
  );

  return refreshedFrictionPoints.map((frictionPoint) => {
    const revisedFrictionPoint = revisedFrictionPointsById.get(frictionPoint.id);

    if (!revisedFrictionPoint) {
      return frictionPoint;
    }

    if (!revisedFrictionPoint.ignored) {
      return frictionPoint;
    }

    return {
      ...frictionPoint,
      ignored: revisedFrictionPoint.ignored,
      resolved: revisedFrictionPoint.resolved,
      updatedAt: revisedFrictionPoint.updatedAt,
    };
  });
}
