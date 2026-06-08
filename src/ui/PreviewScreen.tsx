import type { LocalDateString } from "../core/shifts/types.js";
import type { TimeString } from "../core/time/types.js";
import type { MouseEventHandler, ReactElement } from "react";

import { getStaticHolidays } from "../core/calendar/getStaticHolidays.js";
import type { CalendarHoliday } from "../core/calendar/types.js";
import type { DayFramePreview } from "../state/types.js";
import type { PreviewRangeWarning } from "./previewRangeWarnings.js";
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
  rangeWarnings?: PreviewRangeWarning[];
  visibleRangeStartDate?: LocalDateString | null;
  visibleRangeEndDate?: LocalDateString | null;
  now?: Date;
};

type PreviewDayGroup = {
  userDayDate: string;
  holidays: CalendarHoliday[];
  workBlocks: DayFramePreview["result"]["generatedWorkBlocks"];
  scheduledBlocks: DayFramePreview["result"]["scheduledBlocks"];
  unplacedCandidates: DayFramePreview["result"]["unplacedCandidates"];
  frictionPoints: DayFramePreview["result"]["frictionPoints"];
};

type GroupedFrictionPattern = {
  key: string;
  title: string;
  message: string;
  severity: DayFramePreview["result"]["frictionPoints"][number]["severity"];
  occurrences: Array<{
    userDayDate: string;
    frictionPoint: DayFramePreview["result"]["frictionPoints"][number];
  }>;
};

export function PreviewScreen({
  preview,
  getDayBoundaryStartTimeForUserDayDate,
  onApplySuggestedFix,
  rangeWarnings = [],
  visibleRangeStartDate = null,
  visibleRangeEndDate = null,
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

  const dayGroups = buildDayGroups(
    preview,
    getDayBoundaryStartTimeForUserDayDate,
    visibleRangeStartDate,
    visibleRangeEndDate,
  );
  const visibleFrictionPoints = dayGroups.flatMap((dayGroup) => dayGroup.frictionPoints);
  const frictionCounts = countFrictionBySeverity(visibleFrictionPoints);
  const groupedFrictionPatterns = buildGroupedFrictionPatterns(dayGroups);

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
        {rangeWarnings.length > 0 ? (
          <div className="df-form-stack">
            <p className="df-warning-message">Preview range warnings:</p>
            <ul className="df-plain-list">
              {rangeWarnings.map((warning) => (
                <li key={warning.id}>{warning.message}</li>
              ))}
            </ul>
          </div>
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
              {formatPlanningWindow(
                createDateFromLocalDate(preview.rangeStartDate),
                createDateFromLocalDate(preview.rangeEndDate),
              )}
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

      {groupedFrictionPatterns.length > 0 ? (
        <section aria-labelledby="grouped-friction-heading" className="df-summary-bar">
          <h2 className="df-panel-title" id="grouped-friction-heading">
            Repeated Friction Patterns
          </h2>
          <div className="df-form-stack">
            {groupedFrictionPatterns.map((pattern) => (
              <details className="df-grouped-friction" key={pattern.key}>
                <summary>
                  <strong>{pattern.title}</strong>
                  <span className="df-muted"> Appears on {pattern.occurrences.length} days</span>
                </summary>
                <p className="df-muted">{pattern.message}</p>
                <ul className="df-plain-list">
                  {pattern.occurrences.map((occurrence) => (
                    <li key={`${pattern.key}-${occurrence.frictionPoint.id}`}>
                      <div>{formatDayHeading(occurrence.userDayDate)}</div>
                      <div className="df-fix-list">
                        {occurrence.frictionPoint.suggestedFixes.length > 0 ? (
                          occurrence.frictionPoint.suggestedFixes.map((suggestedFix) => (
                            <button
                              className="df-fix-button"
                              key={suggestedFix.id}
                              onClick={createSuggestedFixHandler(
                                occurrence.frictionPoint.id,
                                suggestedFix.id,
                                onApplySuggestedFix,
                              )}
                              type="button"
                            >
                              {suggestedFix.label}
                            </button>
                          ))
                        ) : (
                          <span className="df-muted">
                            No automatic fix is available. Review the related setup and regenerate
                            the preview.
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>
      ) : null}

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
            {dayGroup.holidays.length > 0 ? (
              <div
                aria-label={`Holiday annotations for ${dayGroup.userDayDate}`}
                className="df-day-holiday-list"
              >
                {dayGroup.holidays.map((holiday) => (
                  <span className="df-day-holiday-chip" key={holiday.id}>
                    {holiday.name}
                    <span className="df-day-holiday-type">
                      {" "}
                      {formatHolidayTypeLabel(holiday.type)}
                    </span>
                  </span>
                ))}
              </div>
            ) : null}

            <DayVisualizer
              dayBoundaryStartTime={getDayBoundaryStartTimeForUserDayDate(dayGroup.userDayDate)}
              scheduledBlocks={dayGroup.scheduledBlocks}
              selectedUserDayDate={dayGroup.userDayDate}
              workBlocks={dayGroup.workBlocks}
            />

            <div className="df-day-groups">
              <section aria-labelledby={`manual-${dayGroup.userDayDate}`} className="df-day-group">
                <h3 className="df-group-title" id={`manual-${dayGroup.userDayDate}`}>
                  Manual Events
                </h3>
                {dayGroup.scheduledBlocks.filter(
                  (scheduledBlock) => scheduledBlock.source === "manual",
                ).length === 0 ? (
                  <p className="df-empty">No manual events.</p>
                ) : (
                  <ul className="df-plain-list">
                    {dayGroup.scheduledBlocks
                      .filter((scheduledBlock) => scheduledBlock.source === "manual")
                      .map((scheduledBlock) => (
                        <li className="df-manual-event-item" key={scheduledBlock.id}>
                          {scheduledBlock.title}{" "}
                          {scheduledBlock.isAllDay
                            ? "All day"
                            : formatHumanTimeRange(scheduledBlock.startsAt, scheduledBlock.endsAt)}
                          <span className="df-muted"> (Manual event)</span>
                        </li>
                      ))}
                  </ul>
                )}
              </section>

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
                {dayGroup.scheduledBlocks.filter(
                  (scheduledBlock) => scheduledBlock.source !== "manual",
                ).length === 0 ? (
                  <p className="df-empty">No scheduled blocks.</p>
                ) : (
                  <ul className="df-plain-list">
                    {dayGroup.scheduledBlocks
                      .filter((scheduledBlock) => scheduledBlock.source !== "manual")
                      .map((scheduledBlock) => (
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
                          {frictionPoint.suggestedFixes.length > 0 ? (
                            frictionPoint.suggestedFixes.map((suggestedFix) => (
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
                            ))
                          ) : (
                            <span className="df-muted">
                              No automatic fix is available. Review the related setup and regenerate
                              the preview.
                            </span>
                          )}
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

function buildDayGroups(
  preview: DayFramePreview,
  getDayBoundaryStartTimeForUserDayDate: PreviewScreenProps["getDayBoundaryStartTimeForUserDayDate"],
  visibleRangeStartDate: PreviewScreenProps["visibleRangeStartDate"],
  visibleRangeEndDate: PreviewScreenProps["visibleRangeEndDate"],
): PreviewDayGroup[] {
  const groups = new Map<string, PreviewDayGroup>();
  const visibleUserDayDates = getVisibleUserDayDates(
    visibleRangeStartDate ?? preview.rangeStartDate,
    visibleRangeEndDate ?? preview.rangeEndDate,
  );

  for (const userDayDate of visibleUserDayDates) {
    getOrCreateDayGroup(groups, userDayDate);
  }

  for (const holiday of getStaticHolidays({
    startDate: visibleRangeStartDate ?? preview.rangeStartDate,
    endDate: visibleRangeEndDate ?? preview.rangeEndDate,
  })) {
    getOrCreateDayGroup(groups, holiday.date).holidays.push(holiday);
  }

  for (const workBlock of preview.result.generatedWorkBlocks) {
    if (visibleUserDayDates.includes(workBlock.userDayDate)) {
      getOrCreateDayGroup(groups, workBlock.userDayDate).workBlocks.push(workBlock);
    }
  }

  for (const scheduledBlock of preview.result.scheduledBlocks) {
    for (const userDayDate of visibleUserDayDates) {
      if (
        overlapsUserDay(
          scheduledBlock.startsAt,
          scheduledBlock.endsAt,
          userDayDate,
          getDayBoundaryStartTimeForUserDayDate(userDayDate),
        )
      ) {
        getOrCreateDayGroup(groups, userDayDate).scheduledBlocks.push(scheduledBlock);
      }
    }
  }

  for (const candidate of preview.result.unplacedCandidates) {
    if (visibleUserDayDates.includes(candidate.userDayDate)) {
      getOrCreateDayGroup(groups, candidate.userDayDate).unplacedCandidates.push(candidate);
    }
  }

  for (const frictionPoint of getVisibleFrictionPoints(preview.result.frictionPoints)) {
    const resolvedUserDayDate = resolveFrictionGroupUserDayDate(
      frictionPoint,
      preview,
      visibleUserDayDates,
      getDayBoundaryStartTimeForUserDayDate,
    );

    if (resolvedUserDayDate) {
      getOrCreateDayGroup(groups, resolvedUserDayDate).frictionPoints.push(frictionPoint);
    }
  }

  return [...groups.values()].sort((left, right) =>
    left.userDayDate.localeCompare(right.userDayDate),
  );
}

function getVisibleUserDayDates(
  startDate: LocalDateString,
  endDate: LocalDateString,
): LocalDateString[] {
  const visibleUserDayDates: LocalDateString[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    visibleUserDayDates.push(currentDate);
    currentDate = addDaysToLocalDate(currentDate, 1);
  }

  return visibleUserDayDates;
}

function getOrCreateDayGroup(groups: Map<string, PreviewDayGroup>, userDayDate: string) {
  const existingGroup = groups.get(userDayDate);

  if (existingGroup) {
    return existingGroup;
  }

  const nextGroup = {
    userDayDate,
    holidays: [],
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

function buildGroupedFrictionPatterns(dayGroups: PreviewDayGroup[]): GroupedFrictionPattern[] {
  const groups = new Map<string, GroupedFrictionPattern>();

  for (const dayGroup of dayGroups) {
    for (const frictionPoint of dayGroup.frictionPoints) {
      const key = createGroupedFrictionKey(frictionPoint);
      const existingGroup = groups.get(key);

      if (existingGroup) {
        existingGroup.occurrences.push({
          userDayDate: dayGroup.userDayDate,
          frictionPoint,
        });
        continue;
      }

      groups.set(key, {
        key,
        title: frictionPoint.title,
        message: frictionPoint.message,
        severity: frictionPoint.severity,
        occurrences: [
          {
            userDayDate: dayGroup.userDayDate,
            frictionPoint,
          },
        ],
      });
    }
  }

  return [...groups.values()]
    .filter((group) => group.occurrences.length > 1)
    .sort((left, right) => right.occurrences.length - left.occurrences.length);
}

function createGroupedFrictionKey(
  frictionPoint: DayFramePreview["result"]["frictionPoints"][number],
): string {
  return [
    frictionPoint.severity,
    frictionPoint.title,
    frictionPoint.message,
    frictionPoint.suggestedFixes
      .map((suggestedFix) => `${suggestedFix.action}:${suggestedFix.label}`)
      .join("|"),
  ].join("::");
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

function createDateFromLocalDate(userDayDate: string): Date {
  const [year, month, day] = userDayDate.split("-").map(Number);

  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);
}

function resolveFrictionGroupUserDayDate(
  frictionPoint: DayFramePreview["result"]["frictionPoints"][number],
  preview: DayFramePreview,
  visibleUserDayDates: string[],
  getDayBoundaryStartTimeForUserDayDate: PreviewScreenProps["getDayBoundaryStartTimeForUserDayDate"],
): string | null {
  for (const userDayDate of visibleUserDayDates) {
    const dayBoundaryStartTime = getDayBoundaryStartTimeForUserDayDate(userDayDate);

    const overlapsScheduledBlock = preview.result.scheduledBlocks.some(
      (scheduledBlock) =>
        frictionPoint.affectedBlockIds.includes(scheduledBlock.id) &&
        overlapsUserDay(
          scheduledBlock.startsAt,
          scheduledBlock.endsAt,
          userDayDate,
          dayBoundaryStartTime,
        ),
    );

    if (overlapsScheduledBlock) {
      return userDayDate;
    }

    const overlapsWorkBlock = preview.result.generatedWorkBlocks.some(
      (workBlock) =>
        frictionPoint.affectedBlockIds.includes(workBlock.id) &&
        overlapsUserDay(workBlock.startsAt, workBlock.endsAt, userDayDate, dayBoundaryStartTime),
    );

    if (overlapsWorkBlock) {
      return userDayDate;
    }

    const containsUnplacedCandidate = preview.result.unplacedCandidates.some(
      (candidate) =>
        frictionPoint.affectedBlockIds.includes(candidate.id) &&
        candidate.userDayDate === userDayDate,
    );

    if (containsUnplacedCandidate) {
      return userDayDate;
    }
  }

  if (
    frictionPoint.affectedUserDayDate &&
    visibleUserDayDates.includes(frictionPoint.affectedUserDayDate)
  ) {
    return frictionPoint.affectedUserDayDate;
  }

  return null;
}

function overlapsUserDay(
  startsAt: Date,
  endsAt: Date,
  userDayDate: string,
  dayBoundaryStartTime: TimeString,
): boolean {
  const userDayStart = getUserDayStartFromDateString(userDayDate, dayBoundaryStartTime);
  const userDayEnd = new Date(userDayStart);

  userDayEnd.setDate(userDayEnd.getDate() + 1);

  return startsAt.getTime() < userDayEnd.getTime() && endsAt.getTime() > userDayStart.getTime();
}

function getUserDayStartFromDateString(
  userDayDate: string,
  dayBoundaryStartTime: TimeString,
): Date {
  const [year, month, day] = userDayDate.split("-").map(Number);
  const [hours, minutes] = dayBoundaryStartTime.split(":").map(Number);

  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, hours ?? 0, minutes ?? 0, 0, 0);
}

function addDaysToLocalDate(localDate: LocalDateString, days: number): LocalDateString {
  const [year, month, day] = localDate.split("-").map(Number);
  const nextDate = new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);

  nextDate.setDate(nextDate.getDate() + days);

  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(
    nextDate.getDate(),
  ).padStart(2, "0")}` as LocalDateString;
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

function formatHolidayTypeLabel(holidayType: CalendarHoliday["type"]): string {
  if (holidayType === "federal") {
    return "(Federal holiday)";
  }

  if (holidayType === "local") {
    return "(Local holiday)";
  }

  return "(Observance)";
}
