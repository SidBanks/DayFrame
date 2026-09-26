import type { RealizedScheduleFactV1 } from "../planning/realizedScheduleIdentity.js";

export function realizedFactOccupancy(facts: readonly RealizedScheduleFactV1[] = []) {
  return facts.map((fact) => ({
    startsAt: new Date(fact.startsAt),
    endsAt: new Date(fact.endsAt),
  }));
}

export function getOpenWindowsWithinSearchWindow(
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

export function getOccupiedWindowsForRange(
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

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

/** Authority classification for foundational queries. Never classify by title/category. */
export type PhysicalAuthorityV1 =
  | "work"
  | "fixedCommitment"
  | "acceptedPlacement"
  | "manualEvent"
  | "realizedGoalWork"
  | "supportActivity"
  | "protectedBuffer"
  | "movableCommitment"
  | "goalDemand"
  | "proposal"
  | "acceptedUnrealized"
  | "previewOnly";
export type FoundationalOccupancyV1 = {
  id: string;
  authority: PhysicalAuthorityV1;
  timeSemantics: "activity" | "protection";
  startsAt: string;
  endsAt: string;
  sourceReference: unknown;
};
export function constrainsFoundationalFeasibility(authority: PhysicalAuthorityV1): boolean {
  return [
    "work",
    "fixedCommitment",
    "acceptedPlacement",
    "manualEvent",
    "realizedGoalWork",
    "supportActivity",
    "protectedBuffer",
  ].includes(authority);
}
