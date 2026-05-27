import type { TimeString } from "../core/time/types.js";
import type { MouseEventHandler, ReactElement } from "react";

import type { DayFramePreview } from "../state/types.js";
import { DayVisualizer } from "./DayVisualizer.js";
import {
  formatHumanTimeRange,
  formatPlanningWindow,
  formatPreviewTimestamp,
} from "./timeDisplay.js";

export type PreviewScreenProps = {
  preview: DayFramePreview | null;
  getDayBoundaryStartTimeForUserDayDate: (userDayDate: string) => TimeString;
  onApplySuggestedFix: (input: {
    selectedFrictionPointId: string;
    selectedSuggestedFixId: string;
  }) => void;
  now?: Date;
};

type PreviewDayGroup = {
  userDayDate: string;
  workBlocks: DayFramePreview["result"]["generatedWorkBlocks"];
  scheduledBlocks: DayFramePreview["result"]["scheduledBlocks"];
  unplacedCandidates: DayFramePreview["result"]["unplacedCandidates"];
  frictionPoints: DayFramePreview["result"]["frictionPoints"];
};

export function PreviewScreen({
  preview,
  getDayBoundaryStartTimeForUserDayDate,
  onApplySuggestedFix,
  now = new Date(),
}: PreviewScreenProps): ReactElement {
  if (!preview) {
    return (
      <main className="df-screen">
        <section className="df-panel df-screen-header">
          <h1 className="df-screen-title">DayFrame Preview</h1>
          <p className="df-empty">No preview generated yet.</p>
          <p className="df-support">
            Generate a preview to see work blocks, placed life blocks, and any friction that still
            needs review.
          </p>
        </section>
      </main>
    );
  }

  const visibleFrictionPoints = getVisibleFrictionPoints(preview.result.frictionPoints);
  const dayGroups = buildDayGroups(preview);
  const frictionCounts = countFrictionBySeverity(visibleFrictionPoints);

  return (
    <main className="df-preview-layout">
      <header className="df-panel df-screen-header">
        <h1 className="df-screen-title">DayFrame Preview</h1>
        <p className="df-screen-subtitle">
          Review the draft schedule day by day, then apply suggested fixes if anything conflicts.
        </p>
        {preview.isStale ? (
          <p className="df-danger-message">Setup changed. Generate a new preview to see updates.</p>
        ) : null}
        {preview.actionFeedback ? (
          <p
            className={
              preview.actionFeedback.tone === "warning" ? "df-danger-message" : "df-support"
            }
          >
            {preview.actionFeedback.message}
          </p>
        ) : null}
      </header>

      <section aria-labelledby="preview-summary-heading" className="df-summary-bar">
        <h2 className="df-panel-title" id="preview-summary-heading">
          Summary
        </h2>
        <div className="df-summary-grid">
          <div className="df-summary-item">
            <strong>Planning Window</strong>
            <span>
              {formatPlanningWindow(preview.planningWindowStart, preview.planningWindowEnd)}
            </span>
          </div>
          <div className="df-summary-item">
            <strong>Generated</strong>
            <span>{formatPreviewTimestamp(preview.generatedAt, now)}</span>
          </div>
          <div className="df-summary-item">
            <strong>Revised</strong>
            <span>
              {preview.revisedAt
                ? formatPreviewTimestamp(preview.revisedAt, now)
                : "Not revised yet"}
            </span>
          </div>
          <div className="df-summary-item">
            <strong>Friction Counts</strong>
            <span>
              {visibleFrictionPoints.length} total, {frictionCounts.critical} critical,{" "}
              {frictionCounts.warning} warning
            </span>
          </div>
        </div>
      </section>

      <div className="df-day-list">
        {dayGroups.map((dayGroup) => (
          <section
            aria-labelledby={`day-group-${dayGroup.userDayDate}`}
            className="df-day-card"
            key={dayGroup.userDayDate}
          >
            <h2 className="df-panel-title" id={`day-group-${dayGroup.userDayDate}`}>
              {formatDayHeading(dayGroup.userDayDate)}
            </h2>

            <DayVisualizer
              dayBoundaryStartTime={getDayBoundaryStartTimeForUserDayDate(dayGroup.userDayDate)}
              scheduledBlocks={dayGroup.scheduledBlocks}
              selectedUserDayDate={dayGroup.userDayDate}
              workBlocks={dayGroup.workBlocks}
            />

            <div className="df-day-groups">
              <section aria-labelledby={`work-${dayGroup.userDayDate}`} className="df-day-group">
                <h3 className="df-group-title" id={`work-${dayGroup.userDayDate}`}>
                  Work
                </h3>
                {dayGroup.workBlocks.length === 0 ? (
                  <p className="df-empty">No work blocks.</p>
                ) : (
                  <ul className="df-plain-list">
                    {dayGroup.workBlocks.map((workBlock) => (
                      <li key={workBlock.id}>
                        {workBlock.title}{" "}
                        {formatHumanTimeRange(workBlock.startsAt, workBlock.endsAt)}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section
                aria-labelledby={`scheduled-${dayGroup.userDayDate}`}
                className="df-day-group"
              >
                <h3 className="df-group-title" id={`scheduled-${dayGroup.userDayDate}`}>
                  Scheduled
                </h3>
                {dayGroup.scheduledBlocks.length === 0 ? (
                  <p className="df-empty">No scheduled blocks.</p>
                ) : (
                  <ul className="df-plain-list">
                    {dayGroup.scheduledBlocks.map((scheduledBlock) => (
                      <li key={scheduledBlock.id}>
                        {scheduledBlock.title}{" "}
                        {formatHumanTimeRange(scheduledBlock.startsAt, scheduledBlock.endsAt)}
                        <span className="df-muted">
                          {" "}
                          {formatScheduledBlockDetails(scheduledBlock)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section
                aria-labelledby={`unplaced-${dayGroup.userDayDate}`}
                className="df-day-group"
              >
                <h3 className="df-group-title" id={`unplaced-${dayGroup.userDayDate}`}>
                  Unplaced
                </h3>
                {dayGroup.unplacedCandidates.length === 0 ? (
                  <p className="df-empty">No unplaced candidates.</p>
                ) : (
                  <ul className="df-plain-list">
                    {dayGroup.unplacedCandidates.map((candidate) => (
                      <li key={candidate.id}>
                        {candidate.title} - needs placement
                        <span className="df-muted"> {formatCandidateDetails(candidate)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section
                aria-labelledby={`friction-${dayGroup.userDayDate}`}
                className="df-day-group"
              >
                <h3 className="df-group-title" id={`friction-${dayGroup.userDayDate}`}>
                  Friction
                </h3>
                {dayGroup.frictionPoints.length === 0 ? (
                  <p className="df-empty">No friction detected.</p>
                ) : (
                  <ul className="df-plain-list">
                    {dayGroup.frictionPoints.map((frictionPoint) => (
                      <li key={frictionPoint.id}>
                        <div>{frictionPoint.title}</div>
                        <div className="df-muted">{frictionPoint.message}</div>
                        <div className="df-fix-list">
                          {frictionPoint.suggestedFixes.map((suggestedFix) => (
                            <button
                              className="df-fix-button"
                              key={suggestedFix.id}
                              onClick={createSuggestedFixHandler(
                                frictionPoint.id,
                                suggestedFix.id,
                                onApplySuggestedFix,
                              )}
                              type="button"
                            >
                              {suggestedFix.label}
                            </button>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function buildDayGroups(preview: DayFramePreview): PreviewDayGroup[] {
  const groups = new Map<string, PreviewDayGroup>();

  for (const workBlock of preview.result.generatedWorkBlocks) {
    getOrCreateDayGroup(groups, workBlock.userDayDate).workBlocks.push(workBlock);
  }

  for (const scheduledBlock of preview.result.scheduledBlocks) {
    getOrCreateDayGroup(groups, scheduledBlock.userDayDate).scheduledBlocks.push(scheduledBlock);
  }

  for (const candidate of preview.result.unplacedCandidates) {
    getOrCreateDayGroup(groups, candidate.userDayDate).unplacedCandidates.push(candidate);
  }

  for (const frictionPoint of getVisibleFrictionPoints(preview.result.frictionPoints)) {
    getOrCreateDayGroup(
      groups,
      frictionPoint.affectedUserDayDate ?? "unassigned",
    ).frictionPoints.push(frictionPoint);
  }

  return [...groups.values()].sort((left, right) =>
    left.userDayDate.localeCompare(right.userDayDate),
  );
}

function getOrCreateDayGroup(groups: Map<string, PreviewDayGroup>, userDayDate: string) {
  const existingGroup = groups.get(userDayDate);

  if (existingGroup) {
    return existingGroup;
  }

  const nextGroup = {
    userDayDate,
    workBlocks: [],
    scheduledBlocks: [],
    unplacedCandidates: [],
    frictionPoints: [],
  };

  groups.set(userDayDate, nextGroup);

  return nextGroup;
}

function countFrictionBySeverity(frictionPoints: DayFramePreview["result"]["frictionPoints"]): {
  critical: number;
  warning: number;
} {
  let critical = 0;
  let warning = 0;

  for (const frictionPoint of frictionPoints) {
    if (frictionPoint.severity === "critical") {
      critical += 1;
    } else if (frictionPoint.severity === "warning") {
      warning += 1;
    }
  }

  return {
    critical,
    warning,
  };
}

function getVisibleFrictionPoints(
  frictionPoints: DayFramePreview["result"]["frictionPoints"],
): DayFramePreview["result"]["frictionPoints"] {
  return frictionPoints.filter((frictionPoint) => !frictionPoint.ignored);
}

function formatDayHeading(userDayDate: string): string {
  const [year, month, day] = userDayDate.split("-").map(Number);
  const date = new Date(year!, (month ?? 1) - 1, day!, 12, 0, 0, 0);

  return `${date.toLocaleDateString("en-US", { weekday: "long" })}, ${userDayDate}`;
}

function createSuggestedFixHandler(
  selectedFrictionPointId: string,
  selectedSuggestedFixId: string,
  onApplySuggestedFix: PreviewScreenProps["onApplySuggestedFix"],
): MouseEventHandler<HTMLButtonElement> {
  return () => {
    onApplySuggestedFix({
      selectedFrictionPointId,
      selectedSuggestedFixId,
    });
  };
}

function formatScheduledBlockDetails(
  scheduledBlock: DayFramePreview["result"]["scheduledBlocks"][number],
): string {
  const details = [`Priority ${scheduledBlock.priority}`];

  if (scheduledBlock.status === "rescheduled") {
    details.push("rescheduled");
  }

  if (scheduledBlock.status === "skipped") {
    details.push("skipped");
  }

  return `(${details.join(", ")})`;
}

function formatCandidateDetails(
  candidate: DayFramePreview["result"]["unplacedCandidates"][number],
): string {
  return `(Priority ${candidate.priority})`;
}
