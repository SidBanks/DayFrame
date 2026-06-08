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
  const deferredSleepCandidates: BlockCandidate[] = [];
  const deferredDowntimeCandidates: BlockCandidate[] = [];
  const unplacedCandidates: BlockCandidate[] = [];

  for (const blockCandidate of input.blockCandidates) {
    if (shouldDeferToDowntimePlacement(blockCandidate, input.generatedWorkBlocks)) {
      deferredDowntimeCandidates.push(blockCandidate);
      continue;
    }

    const scheduledBlock = placeBlockCandidate(blockCandidate, input);

    if (!scheduledBlock) {
      if (shouldDeferToSleepAnchorPropagation(blockCandidate, input.generatedWorkBlocks)) {
        deferredSleepCandidates.push(blockCandidate);
        continue;
      }

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

  placeDeferredSleepCandidates({
    deferredSleepCandidates,
    scheduledBlocks,
    unplacedCandidates,
    input,
  });
  placeDeferredDowntimeCandidates({
    deferredDowntimeCandidates,
    scheduledBlocks,
    unplacedCandidates,
    input,
  });

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

function placeOnDowntimeDay(
  blockCandidate: BlockCandidate,
  userDayStart: Date,
  userDayEnd: Date,
  scheduledBlocks: DraftScheduledBlock[],
): DraftScheduledBlock | null {
  const bufferBeforeMinutes = getBufferBeforeMinutes(blockCandidate);
  const bufferAfterMinutes = getBufferAfterMinutes(blockCandidate);
  const occupiedWindows = getOccupiedWindowsForUserDay(scheduledBlocks, userDayStart, userDayEnd);
  let startsAt = addMinutes(userDayStart, bufferBeforeMinutes);

  for (const occupiedWindow of occupiedWindows) {
    const endsAt = addMinutes(startsAt, blockCandidate.durationMinutes);

    if (
      addMinutes(endsAt, bufferAfterMinutes).getTime() <= occupiedWindow.occupiedStartsAt.getTime()
    ) {
      return buildScheduledBlock(blockCandidate, startsAt, endsAt);
    }

    startsAt = addMinutes(
      new Date(Math.max(startsAt.getTime(), occupiedWindow.occupiedEndsAt.getTime())),
      bufferBeforeMinutes,
    );
  }

  const endsAt = addMinutes(startsAt, blockCandidate.durationMinutes);

  if (addMinutes(endsAt, bufferAfterMinutes).getTime() > userDayEnd.getTime()) {
    return null;
  }

  return buildScheduledBlock(blockCandidate, startsAt, endsAt);
}

function placeDeferredSleepCandidates(input: {
  deferredSleepCandidates: BlockCandidate[];
  scheduledBlocks: DraftScheduledBlock[];
  unplacedCandidates: BlockCandidate[];
  input: PlaceBlockCandidatesInput;
}): void {
  for (const blockCandidate of input.deferredSleepCandidates) {
    const anchor = findNearestSleepAnchor(blockCandidate, input.scheduledBlocks);

    if (!anchor) {
      input.unplacedCandidates.push(blockCandidate);
      continue;
    }

    const propagatedScheduledBlock = buildPropagatedSleepBlock(blockCandidate, anchor, input.input);

    if (
      !overlapsPlanningWindow(
        propagatedScheduledBlock,
        input.input.planningWindowStart,
        input.input.planningWindowEnd,
      )
    ) {
      input.unplacedCandidates.push(blockCandidate);
      continue;
    }

    input.scheduledBlocks.push(propagatedScheduledBlock);
  }
}

function placeDeferredDowntimeCandidates(input: {
  deferredDowntimeCandidates: BlockCandidate[];
  scheduledBlocks: DraftScheduledBlock[];
  unplacedCandidates: BlockCandidate[];
  input: PlaceBlockCandidatesInput;
}): void {
  for (const blockCandidate of input.deferredDowntimeCandidates) {
    const dayBoundaryStartTime =
      input.input.getDayBoundaryStartTimeForUserDayDate?.(blockCandidate.userDayDate) ??
      input.input.dayBoundaryStartTime;
    const userDayStart = getUserDayStartFromDateString(
      blockCandidate.userDayDate,
      dayBoundaryStartTime,
    );
    const userDayEnd = addMinutes(userDayStart, 24 * 60);
    const scheduledBlock = placeOnDowntimeDay(
      blockCandidate,
      userDayStart,
      userDayEnd,
      input.scheduledBlocks,
    );

    if (!scheduledBlock) {
      input.unplacedCandidates.push(blockCandidate);
      continue;
    }

    if (
      !overlapsPlanningWindow(
        scheduledBlock,
        input.input.planningWindowStart,
        input.input.planningWindowEnd,
      )
    ) {
      input.unplacedCandidates.push(blockCandidate);
      continue;
    }

    input.scheduledBlocks.push(scheduledBlock);
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

function buildPropagatedSleepBlock(
  blockCandidate: BlockCandidate,
  anchor: DraftScheduledBlock,
  input: PlaceBlockCandidatesInput,
): DraftScheduledBlock {
  const targetDayBoundaryStartTime =
    input.getDayBoundaryStartTimeForUserDayDate?.(blockCandidate.userDayDate) ??
    input.dayBoundaryStartTime;
  const targetUserDayStart = getUserDayStartFromDateString(
    blockCandidate.userDayDate,
    targetDayBoundaryStartTime,
  );
  const anchorDayBoundaryStartTime =
    input.getDayBoundaryStartTimeForUserDayDate?.(anchor.userDayDate) ?? input.dayBoundaryStartTime;
  const anchorUserDayStart = getUserDayStartFromDateString(
    anchor.userDayDate,
    anchorDayBoundaryStartTime,
  );
  const startsAtOffsetMinutes = differenceInMinutes(anchorUserDayStart, anchor.startsAt);
  const startsAt = addMinutes(targetUserDayStart, startsAtOffsetMinutes);
  const endsAt = addMinutes(startsAt, blockCandidate.durationMinutes);

  return buildScheduledBlock(blockCandidate, startsAt, endsAt);
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

function differenceInMinutes(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / 60_000);
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

function getOccupiedWindowsForUserDay(
  scheduledBlocks: DraftScheduledBlock[],
  userDayStart: Date,
  userDayEnd: Date,
): Array<{ occupiedStartsAt: Date; occupiedEndsAt: Date }> {
  return scheduledBlocks
    .map((scheduledBlock) => {
      const occupiedStartsAt = addMinutes(
        scheduledBlock.startsAt,
        -(scheduledBlock.bufferBeforeMinutes ?? 0),
      );
      const occupiedEndsAt = addMinutes(scheduledBlock.endsAt, scheduledBlock.bufferAfterMinutes ?? 0);
      const clippedStartsAt =
        occupiedStartsAt.getTime() < userDayStart.getTime() ? userDayStart : occupiedStartsAt;
      const clippedEndsAt =
        occupiedEndsAt.getTime() > userDayEnd.getTime() ? userDayEnd : occupiedEndsAt;

      if (clippedStartsAt.getTime() >= clippedEndsAt.getTime()) {
        return null;
      }

      return {
        occupiedStartsAt: clippedStartsAt,
        occupiedEndsAt: clippedEndsAt,
      };
    })
    .filter(
      (
        occupiedWindow,
      ): occupiedWindow is { occupiedStartsAt: Date; occupiedEndsAt: Date } =>
        occupiedWindow !== null,
    )
    .sort((left, right) => left.occupiedStartsAt.getTime() - right.occupiedStartsAt.getTime());
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

function shouldDeferToSleepAnchorPropagation(
  blockCandidate: BlockCandidate,
  generatedWorkBlocks: PlaceBlockCandidatesInput["generatedWorkBlocks"],
): boolean {
  return (
    blockCandidate.category === "sleep" &&
    blockCandidate.preferredWindow === "beforeWork" &&
    blockCandidate.recurrenceFrequency === "daily" &&
    blockCandidate.placementType === "flexible" &&
    getFirstWorkBlockForUserDay(generatedWorkBlocks, blockCandidate.userDayDate) === null
  );
}

function shouldUseDowntimePlacementFallback(blockCandidate: BlockCandidate): boolean {
  return blockCandidate.placementType === "flexible" && blockCandidate.category !== "sleep";
}

function shouldDeferToDowntimePlacement(
  blockCandidate: BlockCandidate,
  generatedWorkBlocks: PlaceBlockCandidatesInput["generatedWorkBlocks"],
): boolean {
  return (
    shouldUseDowntimePlacementFallback(blockCandidate) &&
    (blockCandidate.preferredWindow === "beforeWork" ||
      blockCandidate.preferredWindow === "afterWork") &&
    getFirstWorkBlockForUserDay(generatedWorkBlocks, blockCandidate.userDayDate) === null
  );
}

function findNearestSleepAnchor(
  blockCandidate: BlockCandidate,
  scheduledBlocks: DraftScheduledBlock[],
): DraftScheduledBlock | null {
  const matchingAnchors = scheduledBlocks
    .filter((scheduledBlock) => isMatchingSleepAnchor(blockCandidate, scheduledBlock))
    .sort((left, right) => left.userDayDate.localeCompare(right.userDayDate));

  if (matchingAnchors.length === 0) {
    return null;
  }

  const previousAnchor =
    [...matchingAnchors]
      .reverse()
      .find((scheduledBlock) => scheduledBlock.userDayDate < blockCandidate.userDayDate) ?? null;

  if (previousAnchor) {
    return previousAnchor;
  }

  return (
    matchingAnchors.find(
      (scheduledBlock) => scheduledBlock.userDayDate > blockCandidate.userDayDate,
    ) ?? null
  );
}

function isMatchingSleepAnchor(
  blockCandidate: BlockCandidate,
  scheduledBlock: DraftScheduledBlock,
): boolean {
  return (
    scheduledBlock.templateId === blockCandidate.templateId &&
    scheduledBlock.category === "sleep" &&
    scheduledBlock.placementType === "flexible" &&
    scheduledBlock.anchorType === "flexibleTemplate"
  );
}
