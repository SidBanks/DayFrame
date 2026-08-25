import type { CSSProperties, ReactElement } from "react";

import type { DraftScheduledBlock } from "../core/blocks/types.js";
import type { GeneratedWorkBlock } from "../core/shifts/types.js";
import { parseTimeString } from "../core/time/userDay.js";
import { formatHumanTime, formatHumanTimeRange } from "./timeDisplay.js";

export type DayVisualizerProps = {
  selectedUserDayDate: string;
  dayBoundaryStartTime: `${number}:${number}`;
  userDayStart?: Date;
  userDayEnd?: Date;
  workBlocks: GeneratedWorkBlock[];
  scheduledBlocks: DraftScheduledBlock[];
};

type VisualizerBlock = {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  kind: "work" | "scheduled" | "manual";
  startMinutes: number;
  endMinutes: number;
  lane: number;
  laneCount: number;
  overlapsScheduled: boolean;
  overlapsWork: boolean;
};

export function DayVisualizer({
  selectedUserDayDate,
  dayBoundaryStartTime,
  userDayStart,
  userDayEnd,
  workBlocks,
  scheduledBlocks,
}: DayVisualizerProps): ReactElement {
  const dayStart =
    userDayStart ?? getUserDayStartFromDateString(selectedUserDayDate, dayBoundaryStartTime);
  const dayEnd =
    userDayEnd ??
    new Date(
      dayStart.getFullYear(),
      dayStart.getMonth(),
      dayStart.getDate() + 1,
      dayStart.getHours(),
      dayStart.getMinutes(),
      0,
      0,
    );
  const durationMinutes = differenceInMinutes(dayStart, dayEnd);
  if (durationMinutes <= 0)
    throw new RangeError("DayVisualizer requires an increasing user-day window");
  const blocks = buildVisualizerBlocks(dayStart, dayEnd, workBlocks, scheduledBlocks);

  return (
    <section aria-label={`Day visualizer for ${selectedUserDayDate}`} className="df-day-visualizer">
      <header className="df-day-visualizer-header">
        <div>
          <h3 className="df-group-title">Day Visualizer</h3>
          <p className="df-meta">
            A read-only view across this {formatDuration(durationMinutes)} user-day.
          </p>
        </div>
      </header>

      {blocks.length === 0 ? (
        <div className="df-day-visualizer-empty">
          <p className="df-empty">No work or scheduled blocks on this day.</p>
        </div>
      ) : (
        <div className="df-day-visualizer-grid">
          <div
            aria-hidden="true"
            className="df-day-visualizer-hours"
            style={{
              gridTemplateRows: `repeat(${Math.ceil(durationMinutes / 60)}, minmax(28px, 1fr))`,
            }}
          >
            {buildHourLabels(dayStart, dayEnd).map((hourLabel) => (
              <div className="df-day-visualizer-hour" key={hourLabel.key}>
                {hourLabel.label}
              </div>
            ))}
          </div>

          <div
            className="df-day-visualizer-track"
            style={{ minHeight: `${durationMinutes / 2}px` }}
          >
            {buildHourLines(durationMinutes).map((minuteOffset) => (
              <div
                aria-hidden="true"
                className="df-day-visualizer-hour-line"
                key={minuteOffset}
                style={{ top: `${(minuteOffset / durationMinutes) * 100}%` }}
              />
            ))}

            {blocks.map((block) => (
              <article
                aria-label={`${capitalizeKind(block.kind)} block: ${block.title}, ${formatHumanTimeRange(block.startsAt, block.endsAt)}`}
                className={[
                  "df-day-visualizer-block",
                  `df-day-visualizer-block--${block.kind}`,
                  block.endMinutes - block.startMinutes <= 75
                    ? "df-day-visualizer-block--compact"
                    : "",
                  block.overlapsScheduled || block.overlapsWork
                    ? "df-day-visualizer-block--overlap"
                    : "",
                  block.overlapsScheduled ? "df-day-visualizer-block--scheduled-stack" : "",
                  block.kind === "scheduled" && block.overlapsWork
                    ? "df-day-visualizer-block--scheduled-overlay"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={block.id}
                style={buildBlockStyle(block, durationMinutes)}
                title={`${block.title}: ${formatHumanTimeRange(block.startsAt, block.endsAt)}`}
              >
                <strong>{block.title}</strong>
                <span>{formatHumanTimeRange(block.startsAt, block.endsAt)}</span>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function buildVisualizerBlocks(
  dayStart: Date,
  dayEnd: Date,
  workBlocks: GeneratedWorkBlock[],
  scheduledBlocks: DraftScheduledBlock[],
): VisualizerBlock[] {
  const baseWorkBlocks = workBlocks
    .map((block) =>
      createBaseBlock(
        block.id,
        block.title,
        block.startsAt,
        block.endsAt,
        "work",
        dayStart,
        dayEnd,
      ),
    )
    .filter(
      (
        block,
      ): block is Omit<
        VisualizerBlock,
        "lane" | "laneCount" | "overlapsScheduled" | "overlapsWork"
      > => block !== null,
    );
  const baseScheduledBlocks = scheduledBlocks
    .map((block) =>
      createBaseBlock(
        block.id,
        block.title,
        block.startsAt,
        block.endsAt,
        block.source === "manual" ? "manual" : "scheduled",
        dayStart,
        dayEnd,
      ),
    )
    .filter(
      (
        block,
      ): block is Omit<
        VisualizerBlock,
        "lane" | "laneCount" | "overlapsScheduled" | "overlapsWork"
      > => block !== null,
    );
  const scheduledWithLanes = assignOverlapLanes(baseScheduledBlocks);
  const visualizerBlocks = [
    ...baseWorkBlocks.map((block) => ({
      ...block,
      lane: 0,
      laneCount: 1,
      overlapsScheduled: scheduledWithLanes.some((scheduledBlock) =>
        blocksOverlap(block, scheduledBlock),
      ),
      overlapsWork: false,
    })),
    ...scheduledWithLanes.map((block) => ({
      ...block,
      overlapsWork: baseWorkBlocks.some((workBlock) => blocksOverlap(block, workBlock)),
    })),
  ].sort((left, right) => {
    if (left.startMinutes !== right.startMinutes) {
      return left.startMinutes - right.startMinutes;
    }

    if (left.kind !== right.kind) {
      const rank = { work: 0, scheduled: 1, manual: 2 };

      return rank[left.kind] - rank[right.kind];
    }

    return left.endMinutes - right.endMinutes;
  });

  return visualizerBlocks;
}

function createBaseBlock(
  id: string,
  title: string,
  startsAt: Date,
  endsAt: Date,
  kind: VisualizerBlock["kind"],
  dayStart: Date,
  dayEnd: Date,
): Omit<VisualizerBlock, "lane" | "laneCount" | "overlapsScheduled" | "overlapsWork"> | null {
  const clippedStart = startsAt < dayStart ? dayStart : startsAt;
  const clippedEnd = endsAt > dayEnd ? dayEnd : endsAt;
  const startMinutes = differenceInMinutes(dayStart, clippedStart);
  const endMinutes = differenceInMinutes(dayStart, clippedEnd);

  if (endMinutes <= startMinutes) {
    return null;
  }

  return {
    id,
    title,
    startsAt,
    endsAt,
    kind,
    startMinutes,
    endMinutes,
  };
}

function assignOverlapLanes(
  blocks: Array<Omit<VisualizerBlock, "lane" | "laneCount" | "overlapsScheduled" | "overlapsWork">>,
): VisualizerBlock[] {
  const laneEndMinutes: number[] = [];
  const overlapGroups: number[][] = [];
  let activeIndices: number[] = [];
  let currentGroup: number[] = [];

  const visualizerBlocks: VisualizerBlock[] = [];

  for (const block of blocks) {
    activeIndices = activeIndices.filter(
      (index) => visualizerBlocks[index]!.endMinutes > block.startMinutes,
    );

    if (activeIndices.length === 0 && currentGroup.length > 0) {
      overlapGroups.push(currentGroup);
      currentGroup = [];
      laneEndMinutes.length = 0;
    }

    let lane = 0;

    while ((laneEndMinutes[lane] ?? -1) > block.startMinutes) {
      lane += 1;
    }

    laneEndMinutes[lane] = block.endMinutes;

    const nextBlock: VisualizerBlock = {
      ...block,
      lane,
      laneCount: 1,
      overlapsScheduled: false,
      overlapsWork: false,
    };

    const blockIndex = visualizerBlocks.push(nextBlock) - 1;
    activeIndices.push(blockIndex);
    currentGroup.push(blockIndex);
  }

  if (currentGroup.length > 0) {
    overlapGroups.push(currentGroup);
  }

  for (const group of overlapGroups) {
    const laneCount = group.reduce(
      (currentMax, index) => Math.max(currentMax, visualizerBlocks[index]!.lane + 1),
      1,
    );
    const overlaps = group.length > 1;

    for (const index of group) {
      visualizerBlocks[index] = {
        ...visualizerBlocks[index]!,
        laneCount,
        overlapsScheduled: overlaps,
      };
    }
  }

  return visualizerBlocks;
}

function buildBlockStyle(block: VisualizerBlock, durationMinutes: number): CSSProperties {
  const inset = 6;
  const availableWidth = block.kind === "work" ? 100 : block.overlapsWork ? 76 : 100;
  const baseLeft = block.kind === "work" ? 0 : block.overlapsWork ? 24 : 0;
  const laneWidth = availableWidth / block.laneCount;

  return {
    top: `${(block.startMinutes / durationMinutes) * 100}%`,
    height: `${((block.endMinutes - block.startMinutes) / durationMinutes) * 100}%`,
    left: `calc(${baseLeft + laneWidth * block.lane}% + ${inset}px)`,
    width: `calc(${laneWidth}% - ${inset * 2}px)`,
  };
}

function blocksOverlap(
  left: Pick<VisualizerBlock, "startMinutes" | "endMinutes">,
  right: Pick<VisualizerBlock, "startMinutes" | "endMinutes">,
): boolean {
  return left.startMinutes < right.endMinutes && left.endMinutes > right.startMinutes;
}

function buildHourLabels(dayStart: Date, dayEnd: Date): Array<{ key: number; label: string }> {
  const count = Math.ceil((dayEnd.getTime() - dayStart.getTime()) / 3_600_000);
  return Array.from({ length: count }, (_, hourOffset) => {
    const hour = new Date(dayStart.getTime() + hourOffset * 3_600_000);
    return { key: hour.getTime(), label: formatHumanTime(hour) };
  });
}

function buildHourLines(durationMinutes: number): number[] {
  const lines = Array.from(
    { length: Math.floor(durationMinutes / 60) + 1 },
    (_, hour) => hour * 60,
  );
  if (lines.at(-1) !== durationMinutes) lines.push(durationMinutes);
  return lines;
}

function formatDuration(durationMinutes: number): string {
  const hours = durationMinutes / 60;
  return Number.isInteger(hours) ? `${hours}-hour` : `${durationMinutes}-minute`;
}

function differenceInMinutes(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / 60000);
}

function capitalizeKind(kind: VisualizerBlock["kind"]): string {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

function getUserDayStartFromDateString(
  userDayDate: string,
  dayBoundaryStartTime: `${number}:${number}`,
): Date {
  const parsedBoundary = parseTimeString(dayBoundaryStartTime);
  const [year, month, day] = userDayDate.split("-").map(Number);

  return new Date(
    year!,
    (month ?? 1) - 1,
    day!,
    parsedBoundary.hours,
    parsedBoundary.minutes,
    0,
    0,
  );
}
