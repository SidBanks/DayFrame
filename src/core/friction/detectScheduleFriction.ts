import type { BlockCandidate, DraftScheduledBlock } from "../blocks/types.js";
import type { AnchorType } from "../anchors/types.js";
import type { LocalDateString } from "../shifts/types.js";
import type { GeneratedWorkBlock } from "../shifts/types.js";
import type {
  DetectScheduleFrictionInput,
  DetectScheduleFrictionResult,
  FrictionPoint,
  FrictionSeverity,
  SuggestedFix,
} from "./types.js";

type SchedulableBlock = {
  id: string;
  userId: string;
  title: string;
  category?: "sleep";
  anchorType: AnchorType;
  placementType?: DraftScheduledBlock["placementType"];
  fixedStartTime?: DraftScheduledBlock["fixedStartTime"];
  startsAt: Date;
  endsAt: Date;
  occupiedStartsAt: Date;
  occupiedEndsAt: Date;
  userDayDate?: LocalDateString;
  userWeekStartDate?: LocalDateString;
  priority: number;
  source: "shift" | "template" | "manual";
};

const WORK_BLOCK_PRIORITY = 1;

export function detectScheduleFriction(
  input: DetectScheduleFrictionInput,
): DetectScheduleFrictionResult {
  // Friction is always derived from the current draft state, not from prior revisions or history.
  const frictionPoints: FrictionPoint[] = [];
  const schedulableBlocks = [
    ...input.generatedWorkBlocks.map(toSchedulableWorkBlock),
    ...input.scheduledBlocks.map(toSchedulableDraftBlock),
  ].sort(compareSchedulableBlocks);

  frictionPoints.push(...detectOverlapFrictionPoints(schedulableBlocks, input.detectedAt));
  frictionPoints.push(
    ...detectUnplacedCandidateFrictionPoints(input.unplacedCandidates, input.detectedAt),
  );
  frictionPoints.sort(compareFrictionPoints);

  return { frictionPoints };
}

function detectOverlapFrictionPoints(
  schedulableBlocks: SchedulableBlock[],
  detectedAt: string,
): FrictionPoint[] {
  const frictionPoints: FrictionPoint[] = [];

  for (let index = 0; index < schedulableBlocks.length; index += 1) {
    const currentBlock = schedulableBlocks[index]!;

    for (let compareIndex = index + 1; compareIndex < schedulableBlocks.length; compareIndex += 1) {
      const conflictingBlock = schedulableBlocks[compareIndex]!;

      if (conflictingBlock.occupiedStartsAt.getTime() >= currentBlock.occupiedEndsAt.getTime()) {
        break;
      }

      frictionPoints.push(buildConflictFrictionPoint(currentBlock, conflictingBlock, detectedAt));
    }
  }

  return frictionPoints;
}

function detectUnplacedCandidateFrictionPoints(
  unplacedCandidates: BlockCandidate[],
  detectedAt: string,
): FrictionPoint[] {
  return unplacedCandidates.map((candidate) => {
    const severity: FrictionSeverity = candidate.priority === 1 ? "critical" : "warning";

    return {
      id: `friction_unplaced_${candidate.id}`,
      userId: candidate.userId,
      severity,
      title: `${candidate.title} could not be placed`,
      message: `${candidate.title} did not receive a valid draft placement in this planning window.`,
      affectedBlockIds: [candidate.id],
      affectedUserDayDate: candidate.userDayDate,
      affectedUserWeekStartDate: candidate.userWeekStartDate,
      suggestedFixes: [
        {
          id: `fix_move_${candidate.id}`,
          label: "Move block",
          action: "moveBlock",
        },
        {
          id: `fix_skip_${candidate.id}`,
          label: "Skip block",
          action: "skipBlock",
        },
      ],
      canIgnore: severity !== "critical",
      ignored: false,
      resolved: false,
      createdAt: detectedAt,
      updatedAt: detectedAt,
    };
  });
}

function buildConflictFrictionPoint(
  left: SchedulableBlock,
  right: SchedulableBlock,
  detectedAt: string,
): FrictionPoint {
  const severity = getConflictSeverity(left.priority, right.priority);
  const affectedUserDayDate = left.userDayDate ?? right.userDayDate;
  const affectedUserWeekStartDate = left.userWeekStartDate ?? right.userWeekStartDate;
  const affectedDateFields = {
    ...(affectedUserDayDate !== undefined ? { affectedUserDayDate } : {}),
    ...(affectedUserWeekStartDate !== undefined ? { affectedUserWeekStartDate } : {}),
  };

  return {
    id: `friction_conflict_${left.id}_${right.id}`,
    userId: left.userId,
    severity,
    title: `${left.title} conflicts with ${right.title}`,
    message: buildConflictMessage(left, right, severity),
    affectedBlockIds: [left.id, right.id],
    suggestedFixes: buildConflictSuggestedFixes(left, right, severity),
    canIgnore: severity !== "critical",
    ignored: false,
    resolved: false,
    createdAt: detectedAt,
    updatedAt: detectedAt,
    ...affectedDateFields,
  };
}

function buildConflictMessage(
  left: SchedulableBlock,
  right: SchedulableBlock,
  severity: FrictionSeverity,
): string {
  if (containsManualEvent(left, right)) {
    const manualBlock = left.source === "manual" ? left : right;
    const otherBlock = manualBlock === left ? right : left;

    return `${manualBlock.title} is a manual calendar event. ${otherBlock.title} should be reviewed, moved, reduced, or accepted around it.`;
  }

  if (isSleepShiftConflict(left, right)) {
    return "Work is locked by your shift setup. Sleep is flexible and can be moved. Try moving Sleep before work or reducing its buffer.";
  }

  if (areBothFixedTemplateBlocks(left, right)) {
    return "Two fixed blocks overlap. Review one of their fixed start times or accept the conflict.";
  }

  if (isWorkFixedTemplateConflict(left, right)) {
    const fixedBlock = left.anchorType === "fixedTemplate" ? left : right;

    return `Work is locked by your shift setup. ${fixedBlock.title} is fixed at ${formatFixedBlockTime(fixedBlock)}. Review the fixed start time or accept the conflict.`;
  }

  const fixedTemplateConflict = getFixedTemplateConflict(left, right);

  if (fixedTemplateConflict) {
    return `${fixedTemplateConflict.fixed.title} is fixed at ${formatFixedBlockTime(fixedTemplateConflict.fixed)}. ${fixedTemplateConflict.other.title} is flexible and can be moved. Try moving ${fixedTemplateConflict.other.title} or accepting the conflict.`;
  }

  if (isWorkFlexibleTemplateConflict(left, right)) {
    const flexibleBlock = left.anchorType === "flexibleTemplate" ? left : right;

    return `Work is locked by your shift setup. ${flexibleBlock.title} is flexible and can be moved. Try moving or reducing ${flexibleBlock.title}.`;
  }

  if (severity === "critical") {
    return `Two priority 1 blocks overlap: ${left.title} and ${right.title}.`;
  }

  return `${left.title} overlaps ${right.title} and should be reviewed before schedule commit.`;
}

function buildConflictSuggestedFixes(
  left: SchedulableBlock,
  right: SchedulableBlock,
  severity: FrictionSeverity,
): SuggestedFix[] {
  if (containsManualEvent(left, right)) {
    const adjustableBlock = left.source === "manual" ? right : left;
    const fixes: SuggestedFix[] = [];

    if (adjustableBlock.anchorType === "flexibleTemplate") {
      fixes.push({
        id: `fix_move_${adjustableBlock.id}`,
        label: "Move block",
        action: "moveBlock",
      });
      fixes.push({
        id: `fix_reduce_${adjustableBlock.id}`,
        label: "Reduce duration",
        action: "reduceDuration",
      });
    }

    if (severity !== "critical") {
      fixes.push({
        id: `fix_accept_${left.id}_${right.id}`,
        label: "Accept conflict",
        action: "acceptConflict",
      });
    }

    return fixes;
  }

  if (isWorkFixedTemplateConflict(left, right) || areBothFixedTemplateBlocks(left, right)) {
    const fixedBlock = left.anchorType === "fixedTemplate" ? left : right;

    return [
      {
        id: `fix_change_fixed_time_${fixedBlock.id}`,
        label: "Review fixed time",
        action: "changeFixedTime",
      },
      ...(severity === "critical"
        ? []
        : [
            {
              id: `fix_accept_${left.id}_${right.id}`,
              label: "Accept conflict",
              action: "acceptConflict" as const,
            },
          ]),
    ];
  }

  if (severity === "critical") {
    return [
      {
        id: `fix_move_${right.id}`,
        label: "Move block",
        action: "moveBlock",
      },
      {
        id: `fix_change_priority_${right.id}`,
        label: "Change priority",
        action: "changePriority",
      },
    ];
  }

  return [
    {
      id: `fix_move_${right.id}`,
      label: "Move block",
      action: "moveBlock",
    },
    {
      id: `fix_accept_${left.id}_${right.id}`,
      label: "Accept conflict",
      action: "acceptConflict",
    },
  ];
}

function getConflictSeverity(leftPriority: number, rightPriority: number): FrictionSeverity {
  if (leftPriority === 1 && rightPriority === 1) {
    return "critical";
  }

  return "warning";
}

function toSchedulableWorkBlock(workBlock: GeneratedWorkBlock): SchedulableBlock {
  return {
    id: workBlock.id,
    userId: workBlock.userId,
    title: workBlock.title,
    anchorType: workBlock.anchorType ?? "work",
    startsAt: workBlock.startsAt,
    endsAt: workBlock.endsAt,
    occupiedStartsAt: workBlock.startsAt,
    occupiedEndsAt: workBlock.endsAt,
    userDayDate: workBlock.userDayDate,
    // Generated work blocks behave like locked priority-1 blocks during friction review.
    priority: WORK_BLOCK_PRIORITY,
    source: "shift",
  };
}

function toSchedulableDraftBlock(scheduledBlock: DraftScheduledBlock): SchedulableBlock {
  return {
    id: scheduledBlock.id,
    userId: scheduledBlock.userId,
    title: scheduledBlock.title,
    ...(scheduledBlock.category === "sleep" ? { category: "sleep" as const } : {}),
    anchorType: getTemplateAnchorType(scheduledBlock),
    ...(scheduledBlock.placementType !== undefined
      ? { placementType: scheduledBlock.placementType }
      : {}),
    ...(scheduledBlock.fixedStartTime !== undefined
      ? { fixedStartTime: scheduledBlock.fixedStartTime }
      : {}),
    startsAt: scheduledBlock.startsAt,
    endsAt: scheduledBlock.endsAt,
    occupiedStartsAt: addMinutes(
      scheduledBlock.startsAt,
      -(scheduledBlock.bufferBeforeMinutes ?? 0),
    ),
    occupiedEndsAt: addMinutes(scheduledBlock.endsAt, scheduledBlock.bufferAfterMinutes ?? 0),
    userDayDate: scheduledBlock.userDayDate,
    userWeekStartDate: scheduledBlock.userWeekStartDate,
    priority: scheduledBlock.priority,
    source: scheduledBlock.source === "manual" ? "manual" : "template",
  };
}

function compareSchedulableBlocks(left: SchedulableBlock, right: SchedulableBlock): number {
  if (left.occupiedStartsAt.getTime() !== right.occupiedStartsAt.getTime()) {
    return left.occupiedStartsAt.getTime() - right.occupiedStartsAt.getTime();
  }

  if (left.occupiedEndsAt.getTime() !== right.occupiedEndsAt.getTime()) {
    return left.occupiedEndsAt.getTime() - right.occupiedEndsAt.getTime();
  }

  return left.id.localeCompare(right.id);
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function isSleepShiftConflict(left: SchedulableBlock, right: SchedulableBlock): boolean {
  return (
    ((left.category === "sleep" && right.source === "shift") ||
      (right.category === "sleep" && left.source === "shift")) &&
    (left.title.includes("Shift") || right.title.includes("Shift"))
  );
}

function containsManualEvent(left: SchedulableBlock, right: SchedulableBlock): boolean {
  return left.source === "manual" || right.source === "manual";
}

function areBothFixedTemplateBlocks(left: SchedulableBlock, right: SchedulableBlock): boolean {
  return left.anchorType === "fixedTemplate" && right.anchorType === "fixedTemplate";
}

function getFixedTemplateConflict(
  left: SchedulableBlock,
  right: SchedulableBlock,
): { fixed: SchedulableBlock; other: SchedulableBlock } | null {
  if (left.anchorType === "fixedTemplate" && right.anchorType === "flexibleTemplate") {
    return { fixed: left, other: right };
  }

  if (right.anchorType === "fixedTemplate" && left.anchorType === "flexibleTemplate") {
    return { fixed: right, other: left };
  }

  return null;
}

function isWorkFixedTemplateConflict(left: SchedulableBlock, right: SchedulableBlock): boolean {
  return (
    (left.anchorType === "work" && right.anchorType === "fixedTemplate") ||
    (right.anchorType === "work" && left.anchorType === "fixedTemplate")
  );
}

function isWorkFlexibleTemplateConflict(left: SchedulableBlock, right: SchedulableBlock): boolean {
  return (
    (left.anchorType === "work" && right.anchorType === "flexibleTemplate") ||
    (right.anchorType === "work" && left.anchorType === "flexibleTemplate")
  );
}

function getTemplateAnchorType(
  block: Pick<DraftScheduledBlock, "anchorType" | "placementType">,
): AnchorType {
  if (block.anchorType) {
    return block.anchorType;
  }

  return block.placementType === "fixed" ? "fixedTemplate" : "flexibleTemplate";
}

function formatFixedBlockTime(block: SchedulableBlock): string {
  if (block.fixedStartTime) {
    const [hoursString, minutesString] = block.fixedStartTime.split(":");
    const hours = Number(hoursString);
    const minutes = Number(minutesString);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
  }

  return block.startsAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function compareFrictionPoints(left: FrictionPoint, right: FrictionPoint): number {
  if (left.severity !== right.severity) {
    return compareSeverity(left.severity) - compareSeverity(right.severity);
  }

  return left.id.localeCompare(right.id);
}

function compareSeverity(severity: FrictionSeverity): number {
  switch (severity) {
    case "critical":
      return 0;
    case "warning":
      return 1;
    case "info":
      return 2;
  }
}
