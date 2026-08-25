import { parseTimeString } from "../time/userDay.js";
import type { AnchorType } from "../anchors/types.js";
import type { LocalDateString } from "../shifts/types.js";
import type {
  BlockCandidate,
  DraftScheduledBlock,
  PlaceBlockCandidatesInput,
  PlaceBlockCandidatesResult,
} from "./types.js";
import { cloneOccurrenceIdentity } from "../occurrences/occurrenceIdentity.js";

export function placeBlockCandidates(input: PlaceBlockCandidatesInput): PlaceBlockCandidatesResult {
  validatePlanningWindow(input.planningWindowStart, input.planningWindowEnd);

  const scheduledBlocks: DraftScheduledBlock[] = [];
  const deferredSleepCandidates: BlockCandidate[] = [];
  const unplacedCandidates: BlockCandidate[] = [];
  const sortedBlockCandidates = [...input.blockCandidates].sort((left, right) => {
    const hardDifference =
      Number(input.hardPlacementCandidateIds?.has(right.id) ?? false) -
      Number(input.hardPlacementCandidateIds?.has(left.id) ?? false);
    return hardDifference || compareBlockCandidates(left, right);
  });

  for (const blockCandidate of sortedBlockCandidates) {
    if (
      blockCandidate.requiresWorkAnchor === true &&
      !hasWorkBlockForUserDay(input.generatedWorkBlocks, blockCandidate.userDayDate)
    ) {
      continue;
    }

    const scheduledBlock = placeBlockCandidate(blockCandidate, scheduledBlocks, input);

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

  scheduledBlocks.sort(compareScheduledBlocks);
  unplacedCandidates.sort((left, right) => left.id.localeCompare(right.id));

  return {
    scheduledBlocks,
    unplacedCandidates,
  };
}

function placeBlockCandidate(
  blockCandidate: BlockCandidate,
  scheduledBlocks: DraftScheduledBlock[],
  input: PlaceBlockCandidatesInput,
): DraftScheduledBlock | null {
  const canonicalWindow = input.getUserDayWindowForUserDayDate?.(blockCandidate.userDayDate);
  const dayBoundaryStartTime =
    canonicalWindow?.dayBoundaryStartTime ??
    input.getDayBoundaryStartTimeForUserDayDate?.(blockCandidate.userDayDate) ??
    input.dayBoundaryStartTime;
  const userDayStart =
    canonicalWindow?.start ??
    getUserDayStartFromDateString(blockCandidate.userDayDate, dayBoundaryStartTime);
  const userDayEnd =
    canonicalWindow?.end ??
    new Date(
      userDayStart.getFullYear(),
      userDayStart.getMonth(),
      userDayStart.getDate() + 1,
      userDayStart.getHours(),
      userDayStart.getMinutes(),
      0,
      0,
    );
  const placementBounds = getPlacementBoundsForUserDay(
    blockCandidate.userDayDate,
    input,
    userDayStart,
  );

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

    if (input.hardPlacementCandidateIds?.has(blockCandidate.id)) {
      const occupied = [
        ...getPlacementOccupiedBlocks(scheduledBlocks, input.generatedWorkBlocks, input),
        ...(input.additionalOccupiedBlocks ?? []),
      ];
      if (
        occupied.some(
          (block) =>
            startsAt.getTime() < block.endsAt.getTime() &&
            endsAt.getTime() > block.startsAt.getTime(),
        )
      )
        return null;
    }

    return buildScheduledBlock(blockCandidate, startsAt, endsAt);
  }

  return placeFlexibleCandidate(
    blockCandidate,
    scheduledBlocks,
    input,
    userDayStart,
    userDayEnd,
    placementBounds,
  );
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

    const propagatedScheduledBlock = placePropagatedSleepBlock(
      blockCandidate,
      anchor,
      input.scheduledBlocks,
      input.input,
    );

    if (!propagatedScheduledBlock) {
      input.unplacedCandidates.push(blockCandidate);
      continue;
    }

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

function buildScheduledBlock(
  blockCandidate: BlockCandidate,
  startsAt: Date,
  endsAt: Date,
): DraftScheduledBlock {
  const anchorType: AnchorType =
    blockCandidate.placementType === "fixed" ? "fixedTemplate" : "flexibleTemplate";

  return {
    id: `scheduled_${blockCandidate.id}`,
    ...(blockCandidate.occurrenceIdentity
      ? { occurrenceIdentity: cloneOccurrenceIdentity(blockCandidate.occurrenceIdentity) }
      : {}),
    ...(blockCandidate.commitmentNavigationIdentity
      ? { commitmentNavigationIdentity: { ...blockCandidate.commitmentNavigationIdentity } }
      : {}),
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

function placePropagatedSleepBlock(
  blockCandidate: BlockCandidate,
  anchor: DraftScheduledBlock,
  scheduledBlocks: DraftScheduledBlock[],
  input: PlaceBlockCandidatesInput,
): DraftScheduledBlock | null {
  const targetWindow = input.getUserDayWindowForUserDayDate?.(blockCandidate.userDayDate);
  const targetDayBoundaryStartTime =
    targetWindow?.dayBoundaryStartTime ??
    input.getDayBoundaryStartTimeForUserDayDate?.(blockCandidate.userDayDate) ??
    input.dayBoundaryStartTime;
  const targetUserDayStart =
    targetWindow?.start ??
    getUserDayStartFromDateString(blockCandidate.userDayDate, targetDayBoundaryStartTime);
  const anchorDayBoundaryStartTime =
    input.getDayBoundaryStartTimeForUserDayDate?.(anchor.userDayDate) ?? input.dayBoundaryStartTime;
  const anchorUserDayStart = getUserDayStartFromDateString(
    anchor.userDayDate,
    anchorDayBoundaryStartTime,
  );
  const placementBounds = getPlacementBoundsForUserDay(
    blockCandidate.userDayDate,
    input,
    targetUserDayStart,
  );
  const startsAtOffsetMinutes = differenceInMinutes(anchorUserDayStart, anchor.startsAt);
  const preferredStart = addMinutes(targetUserDayStart, startsAtOffsetMinutes);
  const searchWindow = {
    windowStart: placementBounds.start,
    windowEnd: new Date(
      Math.max(
        placementBounds.end.getTime(),
        addMinutes(
          preferredStart,
          blockCandidate.durationMinutes + getBufferAfterMinutes(blockCandidate),
        ).getTime(),
      ),
    ),
    preferredStart,
  };
  const occupiedWindows = getOccupiedWindowsForRange(
    getPlacementOccupiedBlocks(scheduledBlocks, input.generatedWorkBlocks, input),
    placementBounds.start,
    searchWindow.windowEnd,
  );
  const startsAt = findBestAvailableStart(blockCandidate, occupiedWindows, searchWindow);

  if (!startsAt) {
    return null;
  }

  return buildScheduledBlock(
    blockCandidate,
    startsAt,
    addMinutes(startsAt, blockCandidate.durationMinutes),
  );
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

function hasWorkBlockForUserDay<T extends { userDayDate: LocalDateString }>(
  generatedWorkBlocks: T[],
  userDayDate: LocalDateString,
): boolean {
  return generatedWorkBlocks.some((workBlock) => workBlock.userDayDate === userDayDate);
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

function placeFlexibleCandidate(
  blockCandidate: BlockCandidate,
  scheduledBlocks: DraftScheduledBlock[],
  input: PlaceBlockCandidatesInput,
  userDayStart: Date,
  userDayEnd: Date,
  placementBounds: { start: Date; end: Date },
): DraftScheduledBlock | null {
  const searchWindow = getPlacementSearchWindow(
    blockCandidate,
    input,
    userDayStart,
    userDayEnd,
    placementBounds,
  );

  if (!searchWindow) {
    return null;
  }

  const occupiedWindows = getOccupiedWindowsForRange(
    getPlacementOccupiedBlocks(scheduledBlocks, input.generatedWorkBlocks, input),
    new Date(Math.min(userDayStart.getTime(), searchWindow.windowStart.getTime())),
    new Date(Math.max(userDayEnd.getTime(), searchWindow.windowEnd.getTime())),
  );
  const startsAt = findBestAvailableStart(blockCandidate, occupiedWindows, searchWindow);

  if (!startsAt) {
    return null;
  }

  return buildScheduledBlock(
    blockCandidate,
    startsAt,
    addMinutes(startsAt, blockCandidate.durationMinutes),
  );
}

function getPlacementSearchWindow(
  blockCandidate: BlockCandidate,
  input: PlaceBlockCandidatesInput,
  userDayStart: Date,
  userDayEnd: Date,
  placementBounds: { start: Date; end: Date },
): { windowStart: Date; windowEnd: Date; preferredStart: Date } | null {
  switch (blockCandidate.preferredWindow) {
    case "afterWaking":
      return {
        windowStart: placementBounds.start,
        windowEnd: placementBounds.end,
        preferredStart: addMinutes(placementBounds.start, getBufferBeforeMinutes(blockCandidate)),
      };
    case "anyAvailable": {
      return {
        windowStart: placementBounds.start,
        windowEnd: placementBounds.end,
        preferredStart: addMinutes(placementBounds.start, getBufferBeforeMinutes(blockCandidate)),
      };
    }
    case "beforeSleep": {
      const preferredEnd = addMinutes(placementBounds.end, -getBufferAfterMinutes(blockCandidate));

      return {
        windowStart: placementBounds.start,
        windowEnd: placementBounds.end,
        preferredStart: addMinutes(preferredEnd, -blockCandidate.durationMinutes),
      };
    }
    case "beforeWork": {
      const firstWorkBlock = getFirstWorkBlockForUserDay(
        input.generatedWorkBlocks,
        blockCandidate.userDayDate,
      );

      if (!firstWorkBlock) {
        if (blockCandidate.category === "sleep") {
          return null;
        }

        return {
          windowStart: placementBounds.start,
          windowEnd: placementBounds.end,
          preferredStart: addMinutes(placementBounds.start, getBufferBeforeMinutes(blockCandidate)),
        };
      }

      const visibleWorkStart = new Date(
        Math.max(firstWorkBlock.startsAt.getTime(), placementBounds.start.getTime()),
      );
      const preferredEnd = addMinutes(visibleWorkStart, -getBufferAfterMinutes(blockCandidate));

      return {
        windowStart: addMinutes(visibleWorkStart, -(24 * 60)),
        windowEnd: visibleWorkStart,
        preferredStart: addMinutes(preferredEnd, -blockCandidate.durationMinutes),
      };
    }
    case "afterWork": {
      const lastWorkBlock = getLastWorkBlockForUserDay(
        input.generatedWorkBlocks,
        blockCandidate.userDayDate,
      );

      if (!lastWorkBlock) {
        return {
          windowStart: placementBounds.start,
          windowEnd: placementBounds.end,
          preferredStart: addMinutes(
            placementBounds.start,
            Math.max(
              getBufferBeforeMinutes(blockCandidate),
              Math.floor((differenceInMinutes(placementBounds.start, placementBounds.end) * 2) / 3),
            ),
          ),
        };
      }

      const visiblePlanningWindowEnd = input.visiblePlanningWindowEnd ?? input.planningWindowEnd;
      const preferredStart = addMinutes(
        lastWorkBlock.endsAt,
        getBufferBeforeMinutes(blockCandidate),
      );
      const unclippedWindowEnd = new Date(
        Math.max(
          placementBounds.end.getTime(),
          addMinutes(
            lastWorkBlock.endsAt,
            blockCandidate.durationMinutes + getBufferAfterMinutes(blockCandidate),
          ).getTime(),
        ),
      );

      return {
        windowStart: lastWorkBlock.endsAt,
        windowEnd:
          input.visiblePlanningWindowStart && input.visiblePlanningWindowEnd
            ? new Date(Math.min(unclippedWindowEnd.getTime(), visiblePlanningWindowEnd.getTime()))
            : unclippedWindowEnd,
        preferredStart,
      };
    }
    case "custom": {
      if (
        blockCandidate.customWindowStartTime === undefined ||
        blockCandidate.customWindowEndTime === undefined
      ) {
        return null;
      }

      const dayBoundaryStartTime =
        input.getDayBoundaryStartTimeForUserDayDate?.(blockCandidate.userDayDate) ??
        input.dayBoundaryStartTime;
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

      return {
        windowStart: new Date(
          Math.max(customWindowStart.getTime(), placementBounds.start.getTime()),
        ),
        windowEnd: new Date(Math.min(customWindowEnd.getTime(), placementBounds.end.getTime())),
        preferredStart: addMinutes(
          new Date(Math.max(customWindowStart.getTime(), placementBounds.start.getTime())),
          getBufferBeforeMinutes(blockCandidate),
        ),
      };
    }
  }
}

function findBestAvailableStart(
  blockCandidate: BlockCandidate,
  occupiedWindows: Array<{ occupiedStartsAt: Date; occupiedEndsAt: Date }>,
  searchWindow: { windowStart: Date; windowEnd: Date; preferredStart: Date },
): Date | null {
  const bufferBeforeMinutes = getBufferBeforeMinutes(blockCandidate);
  const bufferAfterMinutes = getBufferAfterMinutes(blockCandidate);
  const latestStart = addMinutes(
    searchWindow.windowEnd,
    -(blockCandidate.durationMinutes + bufferAfterMinutes),
  );

  if (latestStart.getTime() < searchWindow.windowStart.getTime()) {
    return null;
  }

  const openWindows = getOpenWindowsWithinSearchWindow(occupiedWindows, searchWindow);
  let bestStart: Date | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const openWindow of openWindows) {
    const candidateWindowStart = addMinutes(openWindow.windowStart, bufferBeforeMinutes);
    const candidateWindowEnd = addMinutes(
      openWindow.windowEnd,
      -(blockCandidate.durationMinutes + bufferAfterMinutes),
    );

    if (candidateWindowEnd.getTime() < candidateWindowStart.getTime()) {
      continue;
    }

    const clampedPreferredStart = new Date(
      Math.min(
        Math.max(searchWindow.preferredStart.getTime(), candidateWindowStart.getTime()),
        candidateWindowEnd.getTime(),
      ),
    );
    const distance = Math.abs(
      clampedPreferredStart.getTime() - searchWindow.preferredStart.getTime(),
    );

    if (
      distance < bestDistance ||
      (distance === bestDistance &&
        bestStart !== null &&
        clampedPreferredStart.getTime() < bestStart.getTime())
    ) {
      bestStart = clampedPreferredStart;
      bestDistance = distance;
    }

    if (bestStart === null) {
      bestStart = clampedPreferredStart;
      bestDistance = distance;
    }
  }

  return bestStart;
}

function getOpenWindowsWithinSearchWindow(
  occupiedWindows: Array<{ occupiedStartsAt: Date; occupiedEndsAt: Date }>,
  searchWindow: { windowStart: Date; windowEnd: Date },
): Array<{ windowStart: Date; windowEnd: Date }> {
  const openWindows: Array<{ windowStart: Date; windowEnd: Date }> = [];
  let cursor = new Date(searchWindow.windowStart);

  for (const occupiedWindow of occupiedWindows) {
    if (occupiedWindow.occupiedEndsAt.getTime() <= searchWindow.windowStart.getTime()) {
      continue;
    }

    if (occupiedWindow.occupiedStartsAt.getTime() >= searchWindow.windowEnd.getTime()) {
      break;
    }

    const blockedStart = new Date(
      Math.max(occupiedWindow.occupiedStartsAt.getTime(), searchWindow.windowStart.getTime()),
    );
    const blockedEnd = new Date(
      Math.min(occupiedWindow.occupiedEndsAt.getTime(), searchWindow.windowEnd.getTime()),
    );

    if (cursor.getTime() < blockedStart.getTime()) {
      openWindows.push({
        windowStart: new Date(cursor),
        windowEnd: blockedStart,
      });
    }

    if (cursor.getTime() < blockedEnd.getTime()) {
      cursor = blockedEnd;
    }
  }

  if (cursor.getTime() < searchWindow.windowEnd.getTime()) {
    openWindows.push({
      windowStart: cursor,
      windowEnd: new Date(searchWindow.windowEnd),
    });
  }

  return openWindows;
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

function getOccupiedWindowsForRange(
  scheduledBlocks: Array<{
    startsAt: Date;
    endsAt: Date;
    bufferBeforeMinutes?: number;
    bufferAfterMinutes?: number;
  }>,
  rangeStart: Date,
  rangeEnd: Date,
): Array<{ occupiedStartsAt: Date; occupiedEndsAt: Date }> {
  return scheduledBlocks
    .map((scheduledBlock) => {
      const occupiedStartsAt = addMinutes(
        scheduledBlock.startsAt,
        -(scheduledBlock.bufferBeforeMinutes ?? 0),
      );
      const occupiedEndsAt = addMinutes(
        scheduledBlock.endsAt,
        scheduledBlock.bufferAfterMinutes ?? 0,
      );
      const clippedStartsAt =
        occupiedStartsAt.getTime() < rangeStart.getTime() ? rangeStart : occupiedStartsAt;
      const clippedEndsAt =
        occupiedEndsAt.getTime() > rangeEnd.getTime() ? rangeEnd : occupiedEndsAt;

      if (clippedStartsAt.getTime() >= clippedEndsAt.getTime()) {
        return null;
      }

      return {
        occupiedStartsAt: clippedStartsAt,
        occupiedEndsAt: clippedEndsAt,
      };
    })
    .filter(
      (occupiedWindow): occupiedWindow is { occupiedStartsAt: Date; occupiedEndsAt: Date } =>
        occupiedWindow !== null,
    )
    .sort((left, right) => left.occupiedStartsAt.getTime() - right.occupiedStartsAt.getTime());
}

function getPlacementBoundsForUserDay(
  userDayDate: LocalDateString,
  input: PlaceBlockCandidatesInput,
  userDayStart: Date,
): { start: Date; end: Date } {
  const userDayEnd =
    input.getUserDayWindowForUserDayDate?.(userDayDate).end ??
    new Date(
      userDayStart.getFullYear(),
      userDayStart.getMonth(),
      userDayStart.getDate() + 1,
      userDayStart.getHours(),
      userDayStart.getMinutes(),
      0,
      0,
    );

  return {
    start: userDayStart,
    end: userDayEnd,
  };
}

function getPlacementOccupiedBlocks(
  scheduledBlocks: DraftScheduledBlock[],
  generatedWorkBlocks: PlaceBlockCandidatesInput["generatedWorkBlocks"],
  input: PlaceBlockCandidatesInput,
): Array<{
  startsAt: Date;
  endsAt: Date;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
}> {
  if (!input.visiblePlanningWindowStart || !input.visiblePlanningWindowEnd) {
    return scheduledBlocks;
  }

  return [
    ...scheduledBlocks,
    ...generatedWorkBlocks.map((generatedWorkBlock) => ({
      startsAt: generatedWorkBlock.startsAt,
      endsAt: generatedWorkBlock.endsAt,
    })),
  ];
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

function compareBlockCandidates(left: BlockCandidate, right: BlockCandidate): number {
  if (left.userDayDate !== right.userDayDate) {
    return left.userDayDate.localeCompare(right.userDayDate);
  }

  if (left.priority !== right.priority) {
    return left.priority - right.priority;
  }

  const leftWindowRank = getPreferredWindowRank(left.preferredWindow);
  const rightWindowRank = getPreferredWindowRank(right.preferredWindow);

  if (leftWindowRank !== rightWindowRank) {
    return leftWindowRank - rightWindowRank;
  }

  return left.id.localeCompare(right.id);
}

function getPreferredWindowRank(preferredWindow: BlockCandidate["preferredWindow"]): number {
  switch (preferredWindow) {
    case "beforeWork":
      return 1;
    case "afterWaking":
      return 2;
    case "custom":
      return 3;
    case "anyAvailable":
      return 4;
    case "afterWork":
      return 5;
    case "beforeSleep":
      return 6;
  }
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
