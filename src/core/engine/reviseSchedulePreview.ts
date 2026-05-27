import { applySuggestedFix } from "../friction/applySuggestedFix.js";
import { detectScheduleFriction } from "../friction/detectScheduleFriction.js";
import { generateSuggestedFixes } from "../friction/generateSuggestedFixes.js";
import type { SuggestedFixFeedback } from "../friction/types.js";
import type { TimeString } from "../time/types.js";
import type { GenerateSchedulePreviewResult } from "./generateSchedulePreview.js";

export type ReviseSchedulePreviewInput = {
  preview: GenerateSchedulePreviewResult;
  selectedFrictionPointId: string;
  selectedSuggestedFixId: string;
  dayBoundaryStartTime: TimeString;
  revisedAt: string;
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
  });

  return {
    preview: {
      generatedWorkBlocks: input.preview.generatedWorkBlocks.map((generatedWorkBlock) => ({
        ...generatedWorkBlock,
        startsAt: new Date(generatedWorkBlock.startsAt),
        endsAt: new Date(generatedWorkBlock.endsAt),
      })),
      blockCandidates: input.preview.blockCandidates.map((blockCandidate) => ({
        ...blockCandidate,
        externalResources: [...blockCandidate.externalResources],
      })),
      scheduledBlocks: appliedFixResult.scheduledBlocks,
      unplacedCandidates: appliedFixResult.unplacedCandidates,
      frictionPoints: mergeResolvedFrictionState(
        suggestedFixesResult.frictionPoints,
        appliedFixResult.frictionPoints,
      ),
    },
    didRevise: true,
  };
}

function clonePreviewResult(preview: GenerateSchedulePreviewResult): GenerateSchedulePreviewResult {
  return {
    generatedWorkBlocks: preview.generatedWorkBlocks.map((generatedWorkBlock) => ({
      ...generatedWorkBlock,
      startsAt: new Date(generatedWorkBlock.startsAt),
      endsAt: new Date(generatedWorkBlock.endsAt),
    })),
    blockCandidates: preview.blockCandidates.map((blockCandidate) => ({
      ...blockCandidate,
      externalResources: [...blockCandidate.externalResources],
    })),
    scheduledBlocks: preview.scheduledBlocks.map((scheduledBlock) => ({
      ...scheduledBlock,
      startsAt: new Date(scheduledBlock.startsAt),
      endsAt: new Date(scheduledBlock.endsAt),
      externalResources: [...scheduledBlock.externalResources],
    })),
    unplacedCandidates: preview.unplacedCandidates.map((blockCandidate) => ({
      ...blockCandidate,
      externalResources: [...blockCandidate.externalResources],
    })),
    frictionPoints: preview.frictionPoints.map((frictionPoint) => ({
      ...frictionPoint,
      suggestedFixes: frictionPoint.suggestedFixes.map((suggestedFix) => ({
        ...suggestedFix,
        ...(suggestedFix.parameters ? { parameters: { ...suggestedFix.parameters } } : {}),
      })),
    })),
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
