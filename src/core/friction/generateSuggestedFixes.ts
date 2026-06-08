import type { BlockCandidate, DraftScheduledBlock } from "../blocks/types.js";
import type { AnchorType } from "../anchors/types.js";
import type { GeneratedWorkBlock } from "../shifts/types.js";
import { parseTimeString } from "../time/userDay.js";
import type {
  FrictionPoint,
  GenerateSuggestedFixesInput,
  GenerateSuggestedFixesResult,
  SuggestedFix,
} from "./types.js";

type SchedulableContextBlock = {
  id: string;
  title: string;
  priority: number;
  category?: DraftScheduledBlock["category"] | BlockCandidate["category"];
  anchorType: AnchorType;
  placementType?: DraftScheduledBlock["placementType"] | BlockCandidate["placementType"];
  source: "shift" | "template" | "candidate" | "manual";
};

type SuggestedFixContext = {
  scheduledBlocksById: Map<string, DraftScheduledBlock>;
  generatedWorkBlocks: GeneratedWorkBlock[];
  dayBoundaryStartTime: `${number}:${number}`;
  getDayBoundaryStartTimeForUserDayDate?: (
    userDayDate: DraftScheduledBlock["userDayDate"],
  ) => `${number}:${number}`;
};

const FITNESS_LIKE_CATEGORIES = new Set(["fitness", "recovery", "optional"]);

export function generateSuggestedFixes(
  input: GenerateSuggestedFixesInput,
): GenerateSuggestedFixesResult {
  const scheduledBlocksById = new Map<string, DraftScheduledBlock>(
    input.scheduledBlocks.map((scheduledBlock) => [scheduledBlock.id, scheduledBlock]),
  );
  const generatedWorkBlocksById = new Map<string, GeneratedWorkBlock>(
    input.generatedWorkBlocks.map((workBlock) => [workBlock.id, workBlock]),
  );
  const unplacedCandidatesById = new Map<string, BlockCandidate>(
    input.unplacedCandidates.map((candidate) => [candidate.id, candidate]),
  );
  const suggestedFixContext: SuggestedFixContext = {
    scheduledBlocksById,
    generatedWorkBlocks: input.generatedWorkBlocks,
    dayBoundaryStartTime: input.dayBoundaryStartTime ?? "03:00",
    ...(input.getDayBoundaryStartTimeForUserDayDate
      ? { getDayBoundaryStartTimeForUserDayDate: input.getDayBoundaryStartTimeForUserDayDate }
      : {}),
  };

  return {
    frictionPoints: input.frictionPoints.map((frictionPoint) => {
      const contextBlocks = frictionPoint.affectedBlockIds
        .map((blockId) =>
          getContextBlock(
            blockId,
            scheduledBlocksById,
            generatedWorkBlocksById,
            unplacedCandidatesById,
          ),
        )
        .filter((contextBlock) => contextBlock !== null);

      return {
        ...frictionPoint,
        suggestedFixes: buildSuggestedFixes(frictionPoint, contextBlocks, suggestedFixContext),
      };
    }),
  };
}

function getContextBlock(
  blockId: string,
  scheduledBlocksById: Map<string, DraftScheduledBlock>,
  generatedWorkBlocksById: Map<string, GeneratedWorkBlock>,
  unplacedCandidatesById: Map<string, BlockCandidate>,
): SchedulableContextBlock | null {
  const scheduledBlock = scheduledBlocksById.get(blockId);

  if (scheduledBlock) {
    return {
      id: scheduledBlock.id,
      title: scheduledBlock.title,
      priority: scheduledBlock.priority,
      category: scheduledBlock.category,
      anchorType: getTemplateAnchorType(scheduledBlock),
      placementType: scheduledBlock.placementType,
      source: scheduledBlock.source === "manual" ? "manual" : "template",
    };
  }

  const workBlock = generatedWorkBlocksById.get(blockId);

  if (workBlock) {
    return {
      id: workBlock.id,
      title: workBlock.title,
      priority: 1,
      anchorType: workBlock.anchorType ?? "work",
      source: "shift",
    };
  }

  const candidate = unplacedCandidatesById.get(blockId);

  if (candidate) {
    return {
      id: candidate.id,
      title: candidate.title,
      priority: candidate.priority,
      category: candidate.category,
      anchorType:
        candidate.anchorType ?? deriveAnchorTypeFromPlacementType(candidate.placementType),
      placementType: candidate.placementType,
      source: "candidate",
    };
  }

  return null;
}

function buildSuggestedFixes(
  frictionPoint: FrictionPoint,
  contextBlocks: SchedulableContextBlock[],
  context: SuggestedFixContext,
): SuggestedFix[] {
  if (contextBlocks.length === 1 && contextBlocks[0]?.source === "candidate") {
    return buildUnplacedCandidateFixes(contextBlocks[0], frictionPoint.canIgnore);
  }

  if (contextBlocks.length >= 2) {
    return buildConflictFixes(contextBlocks, frictionPoint.canIgnore, context);
  }

  return frictionPoint.suggestedFixes;
}

function buildUnplacedCandidateFixes(
  candidate: SchedulableContextBlock,
  canIgnore: boolean,
): SuggestedFix[] {
  const fixes: SuggestedFix[] = [
    {
      id: `fix_move_${candidate.id}`,
      label: "Move block",
      action: "moveBlock",
    },
  ];

  if (candidate.category && FITNESS_LIKE_CATEGORIES.has(candidate.category)) {
    fixes.push({
      id: `fix_convert_${candidate.id}`,
      label: "Convert to recovery",
      action: "convertToRecovery",
    });
  }

  fixes.push({
    id: `fix_skip_${candidate.id}`,
    label: "Skip block",
    action: "skipBlock",
  });

  if (canIgnore) {
    fixes.push({
      id: `fix_accept_${candidate.id}`,
      label: "Accept conflict",
      action: "acceptConflict",
    });
  }

  return fixes;
}

function buildConflictFixes(
  contextBlocks: SchedulableContextBlock[],
  canIgnore: boolean,
  context: SuggestedFixContext,
): SuggestedFix[] {
  const sortedBlocks = [...contextBlocks].sort(compareContextBlocksForFixes);
  const anchorBlock = sortedBlocks[0]!;
  const priorityTarget = selectPriorityTargetBlock(sortedBlocks);
  const movableTarget = selectMoveTargetBlock(sortedBlocks, context);
  const fixedTemplateTarget = selectFixedTemplateTargetBlock(sortedBlocks);
  const fixes: SuggestedFix[] = [];

  if (movableTarget) {
    fixes.push({
      id: `fix_move_${movableTarget.id}`,
      label: "Move block",
      action: "moveBlock",
    });
  }

  if (
    priorityTarget?.category &&
    priorityTarget.anchorType === "flexibleTemplate" &&
    priorityTarget.source === "template" &&
    FITNESS_LIKE_CATEGORIES.has(priorityTarget.category)
  ) {
    fixes.push({
      id: `fix_convert_${priorityTarget.id}`,
      label: "Convert to recovery",
      action: "convertToRecovery",
    });
  }

  if (priorityTarget && canReduceDuration(priorityTarget, context)) {
    fixes.push({
      id: `fix_reduce_${priorityTarget.id}`,
      label: "Reduce duration",
      action: "reduceDuration",
    });
  }

  if (
    fixedTemplateTarget &&
    (containsWorkBlock(contextBlocks) ||
      areAllFixedTemplateBlocks(contextBlocks) ||
      movableTarget !== null)
  ) {
    fixes.push({
      id: `fix_change_fixed_time_${fixedTemplateTarget.id}`,
      label: "Review fixed time",
      action: "changeFixedTime",
    });
  }

  if (priorityTarget && canChangePriority(priorityTarget, context)) {
    fixes.push({
      id: `fix_change_priority_${priorityTarget.id}`,
      label: "Change priority",
      action: "changePriority",
    });
  }

  if (canIgnore) {
    const acceptTargetBlockId =
      priorityTarget && priorityTarget.id !== anchorBlock.id
        ? priorityTarget.id
        : (sortedBlocks.find((block) => block.id !== anchorBlock.id)?.id ?? anchorBlock.id);

    fixes.push({
      id: `fix_accept_${anchorBlock.id}_${acceptTargetBlockId}`,
      label: "Accept conflict",
      action: "acceptConflict",
    });
  }

  if (fixes.length === 0 && fixedTemplateTarget) {
    fixes.push({
      id: `fix_change_fixed_time_${fixedTemplateTarget.id}`,
      label: "Review fixed time",
      action: "changeFixedTime",
    });
  }

  return dedupeSuggestedFixes(fixes);
}

function compareContextBlocksForFixes(
  left: SchedulableContextBlock,
  right: SchedulableContextBlock,
): number {
  const leftAnchorStrength = getAnchorStrength(left);
  const rightAnchorStrength = getAnchorStrength(right);

  if (leftAnchorStrength !== rightAnchorStrength) {
    return rightAnchorStrength - leftAnchorStrength;
  }

  if (left.priority !== right.priority) {
    return left.priority - right.priority;
  }

  if (left.source !== right.source) {
    return left.source.localeCompare(right.source);
  }

  return left.id.localeCompare(right.id);
}

function selectMoveTargetBlock(
  contextBlocks: SchedulableContextBlock[],
  context: SuggestedFixContext,
): SchedulableContextBlock | null {
  const movableBlocks = contextBlocks
    .filter((block) => canMoveBlock(block, context))
    .sort(compareTargetsForAdjustment);

  return movableBlocks[0] ?? null;
}

function selectFixedTemplateTargetBlock(
  contextBlocks: SchedulableContextBlock[],
): SchedulableContextBlock | null {
  const fixedBlocks = contextBlocks
    .filter((block) => block.anchorType === "fixedTemplate")
    .sort(compareTargetsForAdjustment);

  return fixedBlocks[0] ?? null;
}

function selectPriorityTargetBlock(
  contextBlocks: SchedulableContextBlock[],
): SchedulableContextBlock | null {
  const adjustableBlocks = contextBlocks
    .filter((block) => block.source !== "shift" && block.source !== "manual")
    .sort(compareTargetsForAdjustment);

  return adjustableBlocks[0] ?? null;
}

function compareTargetsForAdjustment(
  left: SchedulableContextBlock,
  right: SchedulableContextBlock,
): number {
  const leftMovableRank = getMovableRank(left);
  const rightMovableRank = getMovableRank(right);

  if (leftMovableRank !== rightMovableRank) {
    return leftMovableRank - rightMovableRank;
  }

  if (left.priority !== right.priority) {
    return right.priority - left.priority;
  }

  return left.id.localeCompare(right.id);
}

function getAnchorStrength(block: SchedulableContextBlock): number {
  if (block.anchorType === "work") {
    return 3;
  }

  if (block.anchorType === "manual") {
    return 2.5;
  }

  if (block.anchorType === "fixedTemplate") {
    return 2;
  }

  return 1;
}

function getMovableRank(block: SchedulableContextBlock): number {
  if (isMovableBlock(block)) {
    return 0;
  }

  if (block.anchorType === "fixedTemplate") {
    return 1;
  }

  if (block.anchorType === "manual") {
    return 2;
  }

  if (block.anchorType === "work") {
    return 3;
  }

  return 3;
}

function isMovableBlock(block: SchedulableContextBlock): boolean {
  return block.anchorType === "flexibleTemplate";
}

function canMoveBlock(block: SchedulableContextBlock, context: SuggestedFixContext): boolean {
  if (!isMovableBlock(block) || block.source !== "template") {
    return false;
  }

  const scheduledBlock = context.scheduledBlocksById.get(block.id);

  if (!scheduledBlock || scheduledBlock.placementType === "fixed") {
    return false;
  }

  return findFirstAvailableGapStartForScheduledBlock(scheduledBlock, context) !== null;
}

function canReduceDuration(block: SchedulableContextBlock, context: SuggestedFixContext): boolean {
  if (block.source !== "template" || block.anchorType !== "flexibleTemplate") {
    return false;
  }

  const scheduledBlock = context.scheduledBlocksById.get(block.id);

  if (!scheduledBlock) {
    return false;
  }

  return (
    getDurationMinutes(scheduledBlock.startsAt, scheduledBlock.endsAt) >
    reduceDurationMinutes(getDurationMinutes(scheduledBlock.startsAt, scheduledBlock.endsAt))
  );
}

function canChangePriority(block: SchedulableContextBlock, context: SuggestedFixContext): boolean {
  if (block.source !== "template" || block.anchorType !== "flexibleTemplate") {
    return false;
  }

  const scheduledBlock = context.scheduledBlocksById.get(block.id);

  return scheduledBlock !== undefined && scheduledBlock.priority < 5;
}

function containsWorkBlock(contextBlocks: SchedulableContextBlock[]): boolean {
  return contextBlocks.some((block) => block.anchorType === "work");
}

function areAllFixedTemplateBlocks(contextBlocks: SchedulableContextBlock[]): boolean {
  return (
    contextBlocks.length > 0 && contextBlocks.every((block) => block.anchorType === "fixedTemplate")
  );
}

function dedupeSuggestedFixes(suggestedFixes: SuggestedFix[]): SuggestedFix[] {
  const seenIds = new Set<string>();

  return suggestedFixes.filter((suggestedFix) => {
    if (seenIds.has(suggestedFix.id)) {
      return false;
    }

    seenIds.add(suggestedFix.id);
    return true;
  });
}

function getTemplateAnchorType(
  block: Pick<DraftScheduledBlock, "anchorType" | "placementType">,
): AnchorType {
  if (block.anchorType) {
    return block.anchorType;
  }

  return deriveAnchorTypeFromPlacementType(block.placementType);
}

function deriveAnchorTypeFromPlacementType(
  placementType: DraftScheduledBlock["placementType"] | BlockCandidate["placementType"],
): AnchorType {
  return placementType === "fixed" ? "fixedTemplate" : "flexibleTemplate";
}

function findFirstAvailableGapStartForScheduledBlock(
  scheduledBlock: DraftScheduledBlock,
  context: SuggestedFixContext,
): Date | null {
  const dayBoundaryStartTime =
    context.getDayBoundaryStartTimeForUserDayDate?.(scheduledBlock.userDayDate) ??
    context.dayBoundaryStartTime;
  const userDayStart = getUserDayStartFromLocalDateString(
    scheduledBlock.userDayDate,
    dayBoundaryStartTime,
  );
  const userDayEnd = addMinutes(userDayStart, 24 * 60);
  const occupiedBlocks = [
    ...context.generatedWorkBlocks.filter(
      (workBlock) => workBlock.userDayDate === scheduledBlock.userDayDate,
    ),
    ...[...context.scheduledBlocksById.values()].filter(
      (candidateBlock) =>
        candidateBlock.userDayDate === scheduledBlock.userDayDate &&
        candidateBlock.id !== scheduledBlock.id,
    ),
  ].sort((left, right) => getOccupiedStart(left).getTime() - getOccupiedStart(right).getTime());
  const minimumGapDurationMs =
    ((scheduledBlock.bufferBeforeMinutes ?? 0) +
      getDurationMinutes(scheduledBlock.startsAt, scheduledBlock.endsAt) +
      (scheduledBlock.bufferAfterMinutes ?? 0)) *
    60_000;
  let cursor = addMinutes(scheduledBlock.endsAt, scheduledBlock.bufferAfterMinutes ?? 0);

  if (cursor.getTime() < userDayStart.getTime()) {
    cursor = userDayStart;
  }

  for (const occupiedBlock of occupiedBlocks) {
    const occupiedBlockStart = getOccupiedStart(occupiedBlock);
    const occupiedBlockEnd = getOccupiedEnd(occupiedBlock);

    if (occupiedBlockEnd.getTime() <= cursor.getTime()) {
      continue;
    }

    if (occupiedBlockStart.getTime() - cursor.getTime() >= minimumGapDurationMs) {
      return addMinutes(cursor, scheduledBlock.bufferBeforeMinutes ?? 0);
    }

    if (occupiedBlockStart.getTime() <= cursor.getTime()) {
      cursor = new Date(Math.max(cursor.getTime(), occupiedBlockEnd.getTime()));
    }
  }

  if (userDayEnd.getTime() - cursor.getTime() >= minimumGapDurationMs) {
    return addMinutes(cursor, scheduledBlock.bufferBeforeMinutes ?? 0);
  }

  return null;
}

function getUserDayStartFromLocalDateString(
  userDayDate: DraftScheduledBlock["userDayDate"],
  dayBoundaryStartTime: `${number}:${number}`,
): Date {
  const parsedBoundary = parseTimeString(dayBoundaryStartTime);
  const [year, month, day] = userDayDate.split("-").map(Number);

  return new Date(year!, month! - 1, day!, parsedBoundary.hours, parsedBoundary.minutes, 0, 0);
}

function getDurationMinutes(startsAt: Date, endsAt: Date): number {
  return Math.max(15, Math.round((endsAt.getTime() - startsAt.getTime()) / 60_000));
}

function reduceDurationMinutes(durationMinutes: number): number {
  return Math.max(15, durationMinutes - 30);
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
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
