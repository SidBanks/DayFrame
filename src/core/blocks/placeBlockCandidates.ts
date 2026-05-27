import { parseTimeString } from "../time/userDay.js";
import type { AnchorType } from "../anchors/types.js";
import type { LocalDateString } from "../shifts/types.js";
import type {
  BlockCandidate,
  DraftScheduledBlock,
  PlaceBlockCandidatesInput,
  PlaceBlockCandidatesResult,
} from "./types.js";

export function placeBlockCandidates(input: PlaceBlockCandidatesInput): PlaceBlockCandidatesResult {
  validatePlanningWindow(input.planningWindowStart, input.planningWindowEnd);

  const scheduledBlocks: DraftScheduledBlock[] = [];
  const unplacedCandidates: BlockCandidate[] = [];

  for (const blockCandidate of input.blockCandidates) {
    const scheduledBlock = placeBlockCandidate(blockCandidate, input);

    if (!scheduledBlock) {
      unplacedCandidates.push(blockCandidate);
      continue;
    }

    if (
      !overlapsPlanningWindow(scheduledBlock, input.planningWindowStart, input.planningWindowEnd)
    ) {
      unplacedCandidates.push(blockCandidate);
      continue;
    }

    scheduledBlocks.push(scheduledBlock);
  }

  scheduledBlocks.sort(compareScheduledBlocks);
  unplacedCandidates.sort((left, right) => left.id.localeCompare(right.id));

  return {
    scheduledBlocks,
    unplacedCandidates,
  };
}

function placeBlockCandidate(
  blockCandidate: BlockCandidate,
  input: PlaceBlockCandidatesInput,
): DraftScheduledBlock | null {
  const dayBoundaryStartTime =
    input.getDayBoundaryStartTimeForUserDayDate?.(blockCandidate.userDayDate) ??
    input.dayBoundaryStartTime;
  const userDayStart = getUserDayStartFromDateString(
    blockCandidate.userDayDate,
    dayBoundaryStartTime,
  );
  const userDayEnd = new Date(userDayStart.getTime());

  userDayEnd.setDate(userDayEnd.getDate() + 1);

  if (blockCandidate.placementType === "fixed") {
    if (blockCandidate.fixedStartTime === undefined) {
      return null;
    }

    const startsAt = applyTimeToUserDay(
      userDayStart,
      dayBoundaryStartTime,
      blockCandidate.fixedStartTime,
    );
    const endsAt = addMinutes(startsAt, blockCandidate.durationMinutes);

    return buildScheduledBlock(blockCandidate, startsAt, endsAt);
  }

  switch (blockCandidate.preferredWindow) {
    case "afterWaking":
    case "anyAvailable":
      // Transition buffers shift the visible block while still reserving occupied space around it.
      return buildScheduledBlock(
        blockCandidate,
        addMinutes(userDayStart, getBufferBeforeMinutes(blockCandidate)),
        addMinutes(
          addMinutes(userDayStart, getBufferBeforeMinutes(blockCandidate)),
          blockCandidate.durationMinutes,
        ),
      );
    case "beforeSleep": {
      const endsAt = addMinutes(userDayEnd, -getBufferAfterMinutes(blockCandidate));
      const startsAt = addMinutes(endsAt, -blockCandidate.durationMinutes);

      return buildScheduledBlock(blockCandidate, startsAt, endsAt);
    }
    case "beforeWork": {
      const firstWorkBlock = getFirstWorkBlockForUserDay(
        input.generatedWorkBlocks,
        blockCandidate.userDayDate,
      );

      if (!firstWorkBlock) {
        return null;
      }

      const endsAt = addMinutes(firstWorkBlock.startsAt, -getBufferAfterMinutes(blockCandidate));
      const startsAt = addMinutes(endsAt, -blockCandidate.durationMinutes);

      return buildScheduledBlock(blockCandidate, startsAt, endsAt);
    }
    case "afterWork": {
      const lastWorkBlock = getLastWorkBlockForUserDay(
        input.generatedWorkBlocks,
        blockCandidate.userDayDate,
      );

      if (!lastWorkBlock) {
        return null;
      }

      const startsAt = addMinutes(lastWorkBlock.endsAt, getBufferBeforeMinutes(blockCandidate));
      const endsAt = addMinutes(startsAt, blockCandidate.durationMinutes);

      return buildScheduledBlock(blockCandidate, startsAt, endsAt);
    }
    case "custom": {
      if (
        blockCandidate.customWindowStartTime === undefined ||
        blockCandidate.customWindowEndTime === undefined
      ) {
        return null;
      }

      const customWindowStart = applyTimeToUserDay(
        userDayStart,
        dayBoundaryStartTime,
        blockCandidate.customWindowStartTime,
      );
      const customWindowEnd = applyTimeToUserDay(
        userDayStart,
        dayBoundaryStartTime,
        blockCandidate.customWindowEndTime,
      );

      if (customWindowEnd.getTime() <= customWindowStart.getTime()) {
        return null;
      }

      const startsAt = addMinutes(customWindowStart, getBufferBeforeMinutes(blockCandidate));
      const endsAt = addMinutes(startsAt, blockCandidate.durationMinutes);

      if (
        addMinutes(endsAt, getBufferAfterMinutes(blockCandidate)).getTime() >
        customWindowEnd.getTime()
      ) {
        return null;
      }

      return buildScheduledBlock(blockCandidate, customWindowStart, endsAt);
    }
  }
}

function buildScheduledBlock(
  blockCandidate: BlockCandidate,
  startsAt: Date,
  endsAt: Date,
): DraftScheduledBlock {
  const anchorType: AnchorType =
    blockCandidate.placementType === "fixed" ? "fixedTemplate" : "flexibleTemplate";

  return {
    id: `scheduled_${blockCandidate.id}`,
    userId: blockCandidate.userId,
    templateId: blockCandidate.templateId,
    source: "template",
    title: blockCandidate.title,
    category: blockCandidate.category,
    anchorType,
    placementType: blockCandidate.placementType,
    ...(blockCandidate.fixedStartTime !== undefined
      ? { fixedStartTime: blockCandidate.fixedStartTime }
      : {}),
    startsAt,
    endsAt,
    ...(blockCandidate.bufferBeforeMinutes !== undefined
      ? { bufferBeforeMinutes: blockCandidate.bufferBeforeMinutes }
      : {}),
    ...(blockCandidate.bufferAfterMinutes !== undefined
      ? { bufferAfterMinutes: blockCandidate.bufferAfterMinutes }
      : {}),
    userDayDate: blockCandidate.userDayDate,
    userWeekStartDate: blockCandidate.userWeekStartDate,
    priority: blockCandidate.priority,
    status: "planned",
    externalResources: blockCandidate.externalResources,
  };
}

function getUserDayStartFromDateString(
  userDayDate: LocalDateString,
  dayBoundaryStartTime: PlaceBlockCandidatesInput["dayBoundaryStartTime"],
): Date {
  const parsedBoundary = parseTimeString(dayBoundaryStartTime);
  const date = parseLocalDate(userDayDate);

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    parsedBoundary.hours,
    parsedBoundary.minutes,
    0,
    0,
  );
}

function getFirstWorkBlockForUserDay<T extends { userDayDate: LocalDateString; startsAt: Date }>(
  generatedWorkBlocks: T[],
  userDayDate: LocalDateString,
): T | null {
  const matchingBlocks = generatedWorkBlocks
    .filter((workBlock) => workBlock.userDayDate === userDayDate)
    .sort((left, right) => left.startsAt.getTime() - right.startsAt.getTime());

  return matchingBlocks[0] ?? null;
}

function getLastWorkBlockForUserDay<T extends { userDayDate: LocalDateString; endsAt: Date }>(
  generatedWorkBlocks: T[],
  userDayDate: LocalDateString,
): T | null {
  const matchingBlocks = generatedWorkBlocks
    .filter((workBlock) => workBlock.userDayDate === userDayDate)
    .sort((left, right) => left.endsAt.getTime() - right.endsAt.getTime());

  return matchingBlocks.at(-1) ?? null;
}

function parseLocalDate(value: LocalDateString): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new RangeError(`Invalid local date string: ${value}`);
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 0, 0, 0, 0);
}

function applyTimeToUserDay(
  userDayStart: Date,
  dayBoundaryStartTime: PlaceBlockCandidatesInput["dayBoundaryStartTime"],
  timeString: `${number}:${number}`,
): Date {
  const parsedTime = parseTimeString(timeString);
  const parsedBoundary = parseTimeString(dayBoundaryStartTime);

  const result = new Date(
    userDayStart.getFullYear(),
    userDayStart.getMonth(),
    userDayStart.getDate(),
    parsedTime.hours,
    parsedTime.minutes,
    0,
    0,
  );

  if (parsedTime.totalMinutes < parsedBoundary.totalMinutes) {
    result.setDate(result.getDate() + 1);
  }

  return result;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function getBufferBeforeMinutes(blockCandidate: BlockCandidate): number {
  return blockCandidate.bufferBeforeMinutes ?? 0;
}

function getBufferAfterMinutes(blockCandidate: BlockCandidate): number {
  return blockCandidate.bufferAfterMinutes ?? 0;
}

function overlapsPlanningWindow(
  scheduledBlock: DraftScheduledBlock,
  planningWindowStart: Date,
  planningWindowEnd: Date,
): boolean {
  return (
    scheduledBlock.startsAt.getTime() < planningWindowEnd.getTime() &&
    scheduledBlock.endsAt.getTime() > planningWindowStart.getTime()
  );
}

function validatePlanningWindow(planningWindowStart: Date, planningWindowEnd: Date): void {
  if (planningWindowStart.getTime() >= planningWindowEnd.getTime()) {
    throw new RangeError("planningWindowStart must be before planningWindowEnd");
  }
}

function compareScheduledBlocks(left: DraftScheduledBlock, right: DraftScheduledBlock): number {
  if (left.startsAt.getTime() !== right.startsAt.getTime()) {
    return left.startsAt.getTime() - right.startsAt.getTime();
  }

  if (left.priority !== right.priority) {
    return left.priority - right.priority;
  }

  return left.id.localeCompare(right.id);
}
