import { parseTimeString } from "../time/userDay.js";
import type { BlockCandidate, DraftScheduledBlock } from "../blocks/types.js";
import type { GeneratedWorkBlock } from "../shifts/types.js";
import type { LocalDateString } from "../shifts/types.js";
import type {
  ApplySuggestedFixInput,
  ApplySuggestedFixResult,
  FrictionPoint,
  SuggestedFix,
} from "./types.js";

const MINIMUM_DURATION_MINUTES = 15;
const DURATION_REDUCTION_MINUTES = 30;

export function applySuggestedFix(input: ApplySuggestedFixInput): ApplySuggestedFixResult {
  const selectedFrictionPoint = input.frictionPoints.find(
    (frictionPoint) => frictionPoint.id === input.selectedFrictionPointId,
  );

  if (!selectedFrictionPoint) {
    throw new RangeError(`Unknown friction point: ${input.selectedFrictionPointId}`);
  }

  const selectedSuggestedFix = selectedFrictionPoint.suggestedFixes.find(
    (suggestedFix) => suggestedFix.id === input.selectedSuggestedFixId,
  );

  if (!selectedSuggestedFix) {
    throw new RangeError(
      `Unknown suggested fix ${input.selectedSuggestedFixId} for friction point ${input.selectedFrictionPointId}`,
    );
  }

  let scheduledBlocks = input.scheduledBlocks.map(cloneScheduledBlock);
  let unplacedCandidates = input.unplacedCandidates.map(cloneBlockCandidate);
  let didApplyChange = selectedSuggestedFix.action === "acceptConflict";
  let actionFeedback: ApplySuggestedFixResult["actionFeedback"];

  switch (selectedSuggestedFix.action) {
    case "acceptConflict":
      break;
    case "skipBlock":
      ({ scheduledBlocks, unplacedCandidates, didApplyChange } = applySkipBlock(
        selectedFrictionPoint,
        selectedSuggestedFix,
        scheduledBlocks,
        unplacedCandidates,
      ));
      break;
    case "reduceDuration":
      ({ scheduledBlocks, unplacedCandidates, didApplyChange } = applyReduceDuration(
        selectedFrictionPoint,
        selectedSuggestedFix,
        scheduledBlocks,
        unplacedCandidates,
      ));
      break;
    case "convertToRecovery":
      ({ scheduledBlocks, unplacedCandidates, didApplyChange } = applyConvertToRecovery(
        selectedFrictionPoint,
        selectedSuggestedFix,
        scheduledBlocks,
        unplacedCandidates,
      ));
      break;
    case "changePriority":
      ({ scheduledBlocks, unplacedCandidates, didApplyChange } = applyChangePriority(
        selectedFrictionPoint,
        selectedSuggestedFix,
        scheduledBlocks,
        unplacedCandidates,
      ));
      break;
    case "changeFixedTime":
      didApplyChange = false;
      actionFeedback = {
        message:
          "Edit this block's fixed start time in Template Editor, then generate a new preview.",
        tone: "info",
      };
      break;
    case "moveBlock":
      ({ scheduledBlocks, unplacedCandidates, didApplyChange } = applyMoveBlock(
        input,
        selectedFrictionPoint,
        selectedSuggestedFix,
        scheduledBlocks,
        unplacedCandidates,
      ));
      break;
    case "addResource":
      throw new RangeError("addResource is not supported in draft preview revisions yet");
  }

  const frictionPoints = input.frictionPoints.map((frictionPoint) => {
    if (frictionPoint.id !== selectedFrictionPoint.id) {
      return { ...frictionPoint };
    }

    if (selectedSuggestedFix.action === "acceptConflict") {
      return {
        ...frictionPoint,
        ignored: true,
        resolved: true,
        updatedAt: input.revisedAt,
      };
    }

    return {
      ...frictionPoint,
      ignored: false,
      resolved: didApplyChange,
      updatedAt: input.revisedAt,
    };
  });

  scheduledBlocks.sort(compareScheduledBlocks);
  unplacedCandidates.sort((left, right) => left.id.localeCompare(right.id));

  if (
    !didApplyChange &&
    selectedSuggestedFix.action !== "acceptConflict" &&
    selectedSuggestedFix.action !== "changeFixedTime" &&
    !actionFeedback
  ) {
    actionFeedback = {
      message: "No safe automatic change is available for this conflict.",
      tone: "warning",
    };
  }

  return {
    frictionPoints,
    scheduledBlocks,
    unplacedCandidates,
    ...(actionFeedback ? { actionFeedback } : {}),
    didRevise: selectedSuggestedFix.action === "acceptConflict" || didApplyChange,
  };
}

function applySkipBlock(
  frictionPoint: FrictionPoint,
  suggestedFix: SuggestedFix,
  scheduledBlocks: DraftScheduledBlock[],
  unplacedCandidates: BlockCandidate[],
): Pick<ApplySuggestedFixResult, "scheduledBlocks" | "unplacedCandidates"> & {
  didApplyChange: boolean;
} {
  const targetBlockId = getSingleTargetBlockId(frictionPoint, suggestedFix);
  const scheduledBlockIndex = scheduledBlocks.findIndex(
    (scheduledBlock) => scheduledBlock.id === targetBlockId,
  );

  if (scheduledBlockIndex >= 0) {
    const scheduledBlock = scheduledBlocks[scheduledBlockIndex]!;

    scheduledBlocks[scheduledBlockIndex] = {
      ...scheduledBlock,
      status: "skipped",
    };

    return { scheduledBlocks, unplacedCandidates, didApplyChange: true };
  }

  return {
    scheduledBlocks,
    unplacedCandidates: unplacedCandidates.filter((candidate) => candidate.id !== targetBlockId),
    didApplyChange: unplacedCandidates.some((candidate) => candidate.id === targetBlockId),
  };
}

function applyReduceDuration(
  frictionPoint: FrictionPoint,
  suggestedFix: SuggestedFix,
  scheduledBlocks: DraftScheduledBlock[],
  unplacedCandidates: BlockCandidate[],
): Pick<ApplySuggestedFixResult, "scheduledBlocks" | "unplacedCandidates"> & {
  didApplyChange: boolean;
} {
  const targetBlockId = getSingleTargetBlockId(frictionPoint, suggestedFix);
  const scheduledBlockIndex = scheduledBlocks.findIndex(
    (scheduledBlock) => scheduledBlock.id === targetBlockId,
  );

  if (scheduledBlockIndex >= 0) {
    const scheduledBlock = scheduledBlocks[scheduledBlockIndex]!;
    const newDurationMinutes = reduceDurationMinutes(
      getDurationMinutes(scheduledBlock.startsAt, scheduledBlock.endsAt),
    );

    scheduledBlocks[scheduledBlockIndex] = {
      ...scheduledBlock,
      endsAt: addMinutes(scheduledBlock.startsAt, newDurationMinutes),
    };

    return {
      scheduledBlocks,
      unplacedCandidates,
      didApplyChange:
        newDurationMinutes !== getDurationMinutes(scheduledBlock.startsAt, scheduledBlock.endsAt),
    };
  }

  return { scheduledBlocks, unplacedCandidates, didApplyChange: false };
}

function applyConvertToRecovery(
  frictionPoint: FrictionPoint,
  suggestedFix: SuggestedFix,
  scheduledBlocks: DraftScheduledBlock[],
  unplacedCandidates: BlockCandidate[],
): Pick<ApplySuggestedFixResult, "scheduledBlocks" | "unplacedCandidates"> & {
  didApplyChange: boolean;
} {
  const targetBlockId = getSingleTargetBlockId(frictionPoint, suggestedFix);
  const scheduledBlockIndex = scheduledBlocks.findIndex(
    (scheduledBlock) => scheduledBlock.id === targetBlockId,
  );

  if (scheduledBlockIndex >= 0) {
    const scheduledBlock = scheduledBlocks[scheduledBlockIndex]!;

    scheduledBlocks[scheduledBlockIndex] = {
      ...scheduledBlock,
      category: "recovery",
      title: toRecoveryTitle(scheduledBlock.title),
    };

    return {
      scheduledBlocks,
      unplacedCandidates,
      didApplyChange:
        scheduledBlock.category !== "recovery" ||
        scheduledBlock.title !== toRecoveryTitle(scheduledBlock.title),
    };
  }

  const candidateIndex = unplacedCandidates.findIndex(
    (candidate) => candidate.id === targetBlockId,
  );

  if (candidateIndex >= 0) {
    const candidate = unplacedCandidates[candidateIndex]!;

    unplacedCandidates[candidateIndex] = {
      ...candidate,
      category: "recovery",
      title: toRecoveryTitle(candidate.title),
    };

    return {
      scheduledBlocks,
      unplacedCandidates,
      didApplyChange:
        candidate.category !== "recovery" || candidate.title !== toRecoveryTitle(candidate.title),
    };
  }

  return { scheduledBlocks, unplacedCandidates, didApplyChange: false };
}

function applyChangePriority(
  frictionPoint: FrictionPoint,
  suggestedFix: SuggestedFix,
  scheduledBlocks: DraftScheduledBlock[],
  unplacedCandidates: BlockCandidate[],
): Pick<ApplySuggestedFixResult, "scheduledBlocks" | "unplacedCandidates"> & {
  didApplyChange: boolean;
} {
  const targetBlockId = getChangePriorityTargetBlockId(frictionPoint, suggestedFix);
  const scheduledBlockIndex = scheduledBlocks.findIndex(
    (scheduledBlock) => scheduledBlock.id === targetBlockId,
  );

  if (scheduledBlockIndex >= 0) {
    const scheduledBlock = scheduledBlocks[scheduledBlockIndex]!;

    scheduledBlocks[scheduledBlockIndex] = {
      ...scheduledBlock,
      priority: increasePriorityNumber(scheduledBlock.priority),
    };

    return {
      scheduledBlocks,
      unplacedCandidates,
      didApplyChange: scheduledBlocks[scheduledBlockIndex]!.priority !== scheduledBlock.priority,
    };
  }

  return { scheduledBlocks, unplacedCandidates, didApplyChange: false };
}

function applyMoveBlock(
  input: ApplySuggestedFixInput,
  frictionPoint: FrictionPoint,
  suggestedFix: SuggestedFix,
  scheduledBlocks: DraftScheduledBlock[],
  unplacedCandidates: BlockCandidate[],
): Pick<ApplySuggestedFixResult, "scheduledBlocks" | "unplacedCandidates"> & {
  didApplyChange: boolean;
} {
  const targetBlockId = getSingleTargetBlockId(frictionPoint, suggestedFix);
  const scheduledBlockIndex = scheduledBlocks.findIndex(
    (scheduledBlock) => scheduledBlock.id === targetBlockId,
  );

  if (scheduledBlockIndex >= 0) {
    const scheduledBlock = scheduledBlocks[scheduledBlockIndex]!;

    if (scheduledBlock.placementType === "fixed") {
      return { scheduledBlocks, unplacedCandidates, didApplyChange: false };
    }

    const movedBlock = moveScheduledBlockWithinUserDay(
      scheduledBlock,
      scheduledBlocks,
      input.generatedWorkBlocks,
      input.dayBoundaryStartTime,
    );

    scheduledBlocks[scheduledBlockIndex] = movedBlock;

    return {
      scheduledBlocks,
      unplacedCandidates,
      didApplyChange:
        movedBlock.startsAt.getTime() !== scheduledBlock.startsAt.getTime() ||
        movedBlock.endsAt.getTime() !== scheduledBlock.endsAt.getTime() ||
        movedBlock.status !== scheduledBlock.status,
    };
  }

  const candidateIndex = unplacedCandidates.findIndex(
    (candidate) => candidate.id === targetBlockId,
  );

  if (candidateIndex >= 0) {
    const candidate = unplacedCandidates[candidateIndex]!;

    if (candidate.placementType === "fixed") {
      return { scheduledBlocks, unplacedCandidates, didApplyChange: false };
    }

    const scheduledBlock = placeCandidateInFirstAvailableGap(
      candidate,
      scheduledBlocks,
      input.generatedWorkBlocks,
      input.dayBoundaryStartTime,
    );

    if (scheduledBlock) {
      return {
        scheduledBlocks: [...scheduledBlocks, scheduledBlock],
        unplacedCandidates: unplacedCandidates.filter(
          (unplacedCandidate) => unplacedCandidate.id !== targetBlockId,
        ),
        didApplyChange: true,
      };
    }
  }

  return { scheduledBlocks, unplacedCandidates, didApplyChange: false };
}

function moveScheduledBlockWithinUserDay(
  scheduledBlock: DraftScheduledBlock,
  scheduledBlocks: DraftScheduledBlock[],
  generatedWorkBlocks: GeneratedWorkBlock[],
  dayBoundaryStartTime: ApplySuggestedFixInput["dayBoundaryStartTime"],
): DraftScheduledBlock {
  const durationMinutes = getDurationMinutes(scheduledBlock.startsAt, scheduledBlock.endsAt);
  const targetStart = findFirstAvailableGapStart({
    userDayDate: scheduledBlock.userDayDate,
    durationMinutes,
    bufferBeforeMinutes: scheduledBlock.bufferBeforeMinutes ?? 0,
    bufferAfterMinutes: scheduledBlock.bufferAfterMinutes ?? 0,
    scheduledBlocks: scheduledBlocks.filter((block) => block.id !== scheduledBlock.id),
    generatedWorkBlocks,
    dayBoundaryStartTime,
    searchStartAt: addMinutes(scheduledBlock.endsAt, scheduledBlock.bufferAfterMinutes ?? 0),
  });

  if (!targetStart) {
    return scheduledBlock;
  }

  return {
    ...scheduledBlock,
    startsAt: targetStart,
    endsAt: addMinutes(targetStart, durationMinutes),
    status: "rescheduled",
  };
}

function placeCandidateInFirstAvailableGap(
  candidate: BlockCandidate,
  scheduledBlocks: DraftScheduledBlock[],
  generatedWorkBlocks: GeneratedWorkBlock[],
  dayBoundaryStartTime: ApplySuggestedFixInput["dayBoundaryStartTime"],
): DraftScheduledBlock | null {
  const targetStart = findFirstAvailableGapStart({
    userDayDate: candidate.userDayDate,
    durationMinutes: candidate.durationMinutes,
    bufferBeforeMinutes: candidate.bufferBeforeMinutes ?? 0,
    bufferAfterMinutes: candidate.bufferAfterMinutes ?? 0,
    scheduledBlocks,
    generatedWorkBlocks,
    dayBoundaryStartTime,
  });

  if (!targetStart) {
    return null;
  }

  return {
    id: `scheduled_${candidate.id}`,
    userId: candidate.userId,
    templateId: candidate.templateId,
    source: "template",
    title: candidate.title,
    category: candidate.category,
    placementType: candidate.placementType,
    ...(candidate.fixedStartTime !== undefined ? { fixedStartTime: candidate.fixedStartTime } : {}),
    startsAt: targetStart,
    endsAt: addMinutes(targetStart, candidate.durationMinutes),
    ...(candidate.bufferBeforeMinutes !== undefined
      ? { bufferBeforeMinutes: candidate.bufferBeforeMinutes }
      : {}),
    ...(candidate.bufferAfterMinutes !== undefined
      ? { bufferAfterMinutes: candidate.bufferAfterMinutes }
      : {}),
    userDayDate: candidate.userDayDate,
    userWeekStartDate: candidate.userWeekStartDate,
    priority: candidate.priority,
    status: "rescheduled",
    externalResources: [...candidate.externalResources],
  };
}

type FindGapInput = {
  userDayDate: LocalDateString;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  scheduledBlocks: DraftScheduledBlock[];
  generatedWorkBlocks: GeneratedWorkBlock[];
  dayBoundaryStartTime: ApplySuggestedFixInput["dayBoundaryStartTime"];
  searchStartAt?: Date;
};

function findFirstAvailableGapStart(input: FindGapInput): Date | null {
  const userDayStart = getUserDayStartFromLocalDateString(
    input.userDayDate,
    input.dayBoundaryStartTime,
  );
  const userDayEnd = addMinutes(userDayStart, 24 * 60);
  const occupiedBlocks = [
    ...input.generatedWorkBlocks.filter((workBlock) => workBlock.userDayDate === input.userDayDate),
    ...input.scheduledBlocks.filter(
      (scheduledBlock) => scheduledBlock.userDayDate === input.userDayDate,
    ),
  ].sort((left, right) => getOccupiedStart(left).getTime() - getOccupiedStart(right).getTime());
  const minimumGapDurationMs =
    (input.bufferBeforeMinutes + input.durationMinutes + input.bufferAfterMinutes) * 60_000;
  let cursor =
    input.searchStartAt && input.searchStartAt.getTime() > userDayStart.getTime()
      ? new Date(input.searchStartAt)
      : userDayStart;

  for (const occupiedBlock of occupiedBlocks) {
    const occupiedBlockStart = getOccupiedStart(occupiedBlock);
    const occupiedBlockEnd = getOccupiedEnd(occupiedBlock);

    if (occupiedBlockEnd.getTime() <= cursor.getTime()) {
      continue;
    }

    if (occupiedBlockStart.getTime() - cursor.getTime() >= minimumGapDurationMs) {
      return addMinutes(cursor, input.bufferBeforeMinutes);
    }

    if (occupiedBlockStart.getTime() <= cursor.getTime()) {
      cursor = new Date(Math.max(cursor.getTime(), occupiedBlockEnd.getTime()));
    }
  }

  if (userDayEnd.getTime() - cursor.getTime() >= minimumGapDurationMs) {
    return addMinutes(cursor, input.bufferBeforeMinutes);
  }

  return null;
}

function getSingleTargetBlockId(frictionPoint: FrictionPoint, suggestedFix: SuggestedFix): string {
  const prefixes = ["fix_move_", "fix_skip_", "fix_reduce_", "fix_convert_"];

  for (const prefix of prefixes) {
    if (!suggestedFix.id.startsWith(prefix)) {
      continue;
    }

    const candidateTargetId = suggestedFix.id.slice(prefix.length);
    const matchingBlockId = frictionPoint.affectedBlockIds.find(
      (blockId) => blockId === candidateTargetId,
    );

    if (matchingBlockId) {
      return matchingBlockId;
    }
  }

  if (frictionPoint.affectedBlockIds.length === 1) {
    return frictionPoint.affectedBlockIds[0]!;
  }

  throw new RangeError(`Unable to determine target block for suggested fix ${suggestedFix.id}`);
}

function getChangePriorityTargetBlockId(
  frictionPoint: FrictionPoint,
  suggestedFix: SuggestedFix,
): string {
  if (suggestedFix.id.startsWith("fix_change_priority_")) {
    return suggestedFix.id.slice("fix_change_priority_".length);
  }

  if (frictionPoint.affectedBlockIds.length >= 2) {
    return frictionPoint.affectedBlockIds[1]!;
  }

  throw new RangeError(`changePriority requires a target block on ${frictionPoint.id}`);
}

function getUserDayStartFromLocalDateString(
  userDayDate: LocalDateString,
  dayBoundaryStartTime: ApplySuggestedFixInput["dayBoundaryStartTime"],
): Date {
  const parsedBoundary = parseTimeString(dayBoundaryStartTime);
  const [year, month, day] = userDayDate.split("-").map(Number);

  // User-day ownership and same-day moves are anchored to the configured day boundary.
  return new Date(year!, month! - 1, day!, parsedBoundary.hours, parsedBoundary.minutes, 0, 0);
}

function getDurationMinutes(startsAt: Date, endsAt: Date): number {
  return Math.max(
    MINIMUM_DURATION_MINUTES,
    Math.round((endsAt.getTime() - startsAt.getTime()) / 60_000),
  );
}

function reduceDurationMinutes(durationMinutes: number): number {
  return Math.max(MINIMUM_DURATION_MINUTES, durationMinutes - DURATION_REDUCTION_MINUTES);
}

function increasePriorityNumber(priority: number): 1 | 2 | 3 | 4 | 5 {
  return Math.min(5, priority + 1) as 1 | 2 | 3 | 4 | 5;
}

function toRecoveryTitle(title: string): string {
  return title.startsWith("Recovery: ") ? title : `Recovery: ${title}`;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function cloneScheduledBlock(scheduledBlock: DraftScheduledBlock): DraftScheduledBlock {
  return {
    ...scheduledBlock,
    startsAt: new Date(scheduledBlock.startsAt),
    endsAt: new Date(scheduledBlock.endsAt),
    externalResources: [...scheduledBlock.externalResources],
  };
}

function cloneBlockCandidate(blockCandidate: BlockCandidate): BlockCandidate {
  return {
    ...blockCandidate,
    externalResources: [...blockCandidate.externalResources],
  };
}

function getOccupiedStart(
  block: Pick<DraftScheduledBlock, "startsAt" | "bufferBeforeMinutes"> | GeneratedWorkBlock,
): Date {
  return addMinutes(
    block.startsAt,
    -("bufferBeforeMinutes" in block ? (block.bufferBeforeMinutes ?? 0) : 0),
  );
}

function getOccupiedEnd(
  block: Pick<DraftScheduledBlock, "endsAt" | "bufferAfterMinutes"> | GeneratedWorkBlock,
): Date {
  return addMinutes(
    block.endsAt,
    "bufferAfterMinutes" in block ? (block.bufferAfterMinutes ?? 0) : 0,
  );
}

function compareScheduledBlocks(left: DraftScheduledBlock, right: DraftScheduledBlock): number {
  if (left.startsAt.getTime() !== right.startsAt.getTime()) {
    return left.startsAt.getTime() - right.startsAt.getTime();
  }

  return left.id.localeCompare(right.id);
}
