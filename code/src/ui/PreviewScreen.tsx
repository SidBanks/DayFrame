import type { LocalDateString } from "../core/shifts/types.js";
import type { TimeString } from "../core/time/types.js";
import type { MouseEventHandler, ReactElement } from "react";

import { getStaticHolidays } from "../core/calendar/getStaticHolidays.js";
import type { CalendarHoliday } from "../core/calendar/types.js";
import type { DayFramePreview } from "../state/types.js";
import type { DayFrameAuthoredSetup } from "../state/types.js";
import type { PreviewRangeWarning } from "./previewRangeWarnings.js";
import { DayVisualizer } from "./DayVisualizer.js";
import type { AcceptedDecisionViewModel } from "./acceptedDecisionPresentation.js";
import {
  formatHumanTimeRange,
  formatPlanningWindow,
  formatPreviewTimestamp,
} from "./timeDisplay.js";

export type PreviewScreenProps = {
  preview: DayFramePreview | null;
  getDayBoundaryStartTimeForUserDayDate: (userDayDate: string) => TimeString;
  getUserDayWindowForUserDayDate?: (userDayDate: string) => { start: Date; end: Date };
  onApplySuggestedFix: (input: {
    selectedFrictionPointId: string;
    selectedSuggestedFixId: string;
  }) => void;
  pendingPlanDecisionAcceptance?: boolean;
  onAcceptPlanDecision?: () => void;
  planDecisionFeedback?: { message: string; tone: "info" | "warning" } | null;
  planDecisionRetryAvailable?: boolean;
  onRetryPlanDecisionDurability?: () => void;
  acceptedDecisions?: AcceptedDecisionViewModel[];
  decisionRemovalProtected?: boolean;
  onRemoveAcceptedDecision?: (decisionId: AcceptedDecisionViewModel["decisionId"]) => void;
  rangeWarnings?: PreviewRangeWarning[];
  visibleRangeStartDate?: LocalDateString | null;
  visibleRangeEndDate?: LocalDateString | null;
  now?: Date;
  authoredSetup?: DayFrameAuthoredSetup;
  onAddEvent?: (userDayDate: LocalDateString) => void;
  onEditEvent?: (target: {
    logicalId: string;
    incarnationId?: string;
    userDayDate: LocalDateString;
  }) => void;
  onEditCommitment?: (target: {
    logicalId: string;
    incarnationId: string;
    recurrenceLogicalId: string;
    recurrenceIncarnationId: string;
  }) => void;
  onEditWork?: () => void;
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
  getUserDayWindowForUserDayDate,
  onApplySuggestedFix,
  pendingPlanDecisionAcceptance = false,
  onAcceptPlanDecision,
  planDecisionFeedback = null,
  planDecisionRetryAvailable = false,
  onRetryPlanDecisionDurability,
  acceptedDecisions = [],
  decisionRemovalProtected = false,
  onRemoveAcceptedDecision,
  rangeWarnings = [],
  visibleRangeStartDate = null,
  visibleRangeEndDate = null,
  now = new Date(),
  authoredSetup,
  onAddEvent,
  onEditEvent,
  onEditCommitment,
  onEditWork,
}: PreviewScreenProps): ReactElement {
  if (!preview) {
    return (
      <main className="df-screen">
        <section className="df-panel df-screen-header">
          <h2 className="df-screen-title">Schedule details</h2>
          <p className="df-empty">No schedule generated yet.</p>
          <p className="df-support">
            Generate a schedule to review work, placed commitments, and anything that still needs
            attention.
          </p>
          {planDecisionFeedback ? (
            <div
              className={
                planDecisionFeedback.tone === "warning" ? "df-danger-message" : "df-support"
              }
              role="status"
            >
              <p>{planDecisionFeedback.message}</p>
              {planDecisionRetryAvailable ? (
                <button
                  className="df-secondary-button"
                  onClick={onRetryPlanDecisionDurability}
                  type="button"
                >
                  Retry accepted choice save
                </button>
              ) : null}
            </div>
          ) : null}
          <AcceptedChoicesSection
            decisions={acceptedDecisions}
            onRemove={onRemoveAcceptedDecision}
            removalProtected={decisionRemovalProtected}
          />
        </section>
      </main>
    );
  }

  const dayGroups = buildDayGroups(
    preview,
    getDayBoundaryStartTimeForUserDayDate,
    visibleRangeStartDate,
    visibleRangeEndDate,
    getUserDayWindowForUserDayDate,
  );
  const visibleFrictionPoints = dayGroups.flatMap((dayGroup) => dayGroup.frictionPoints);
  const frictionCounts = countFrictionBySeverity(visibleFrictionPoints);
  const workDependentActivitiesSkipped = visibleFrictionPoints.filter(
    (frictionPoint) => frictionPoint.kind === "workRequiredSkip",
  ).length;
  const groupedFrictionPatterns = buildGroupedFrictionPatterns(dayGroups);

  return (
    <main className="df-preview-layout">
      <header className="df-panel df-screen-header">
        <h2 className="df-screen-title">Schedule details</h2>
        <p className="df-screen-subtitle">
          Review planned geometry for the selected user-day and try bounded resolution options when
          something conflicts.
        </p>
        {preview.isStale ? (
          <p className="df-danger-message">
            Your planning setup changed after this schedule was generated. Refresh the schedule to
            see those changes.
          </p>
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
        {pendingPlanDecisionAcceptance && !preview.isStale ? (
          <div className="df-confirmation">
            <p>You are trying this resolution option. It has not changed your saved plan.</p>
            <button className="df-primary-button" onClick={onAcceptPlanDecision} type="button">
              Apply Planning Change
            </button>
          </div>
        ) : null}
        {planDecisionFeedback ? (
          <div
            className={planDecisionFeedback.tone === "warning" ? "df-danger-message" : "df-support"}
            role="status"
          >
            <p>{planDecisionFeedback.message}</p>
            {planDecisionRetryAvailable ? (
              <button
                className="df-secondary-button"
                onClick={onRetryPlanDecisionDurability}
                type="button"
              >
                Retry accepted choice save
              </button>
            ) : null}
          </div>
        ) : null}
        <AcceptedChoicesSection
          decisions={acceptedDecisions}
          onRemove={onRemoveAcceptedDecision}
          removalProtected={decisionRemovalProtected}
        />
        {rangeWarnings.length > 0 ? (
          <div className="df-form-stack">
            <p className="df-warning-message">Planning range warnings:</p>
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
            <strong>Needs attention</strong>
            <span>
              {visibleFrictionPoints.length} total, {frictionCounts.critical} critical,{" "}
              {frictionCounts.warning} warning, {frictionCounts.info} info
            </span>
            <span>Work-dependent activities skipped: {workDependentActivitiesSkipped}</span>
          </div>
        </div>
      </section>

      {groupedFrictionPatterns.length > 0 ? (
        <section aria-labelledby="grouped-friction-heading" className="df-summary-bar">
          <h2 className="df-panel-title" id="grouped-friction-heading">
            Repeated schedule conflicts
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
                              disabled={preview.isStale}
                              key={suggestedFix.id}
                              onClick={createSuggestedFixHandler(
                                occurrence.frictionPoint.id,
                                suggestedFix.id,
                                onApplySuggestedFix,
                              )}
                              type="button"
                            >
                              {formatSuggestedFixLabel(suggestedFix)}
                            </button>
                          ))
                        ) : (
                          <span className="df-muted">
                            No resolution option is available. Review the related setup and refresh
                            the schedule.
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
            {onAddEvent ? (
              <button
                aria-label={`Add event to ${formatDayHeading(dayGroup.userDayDate)}`}
                className="df-secondary-button"
                onClick={() => onAddEvent(dayGroup.userDayDate as LocalDateString)}
                type="button"
              >
                Add Event
              </button>
            ) : null}
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
              {...(getUserDayWindowForUserDayDate
                ? {
                    userDayStart: getUserDayWindowForUserDayDate(dayGroup.userDayDate).start,
                    userDayEnd: getUserDayWindowForUserDayDate(dayGroup.userDayDate).end,
                  }
                : {})}
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
                          {onEditEvent
                            ? renderEventEditAction(scheduledBlock, authoredSetup, onEditEvent)
                            : null}
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
                  <div className="df-form-stack">
                    <p className="df-empty">Downtime Day</p>
                    <p className="df-muted">No work shift scheduled.</p>
                  </div>
                ) : (
                  <ul className="df-plain-list">
                    {dayGroup.workBlocks.map((workBlock) => (
                      <li key={workBlock.id}>
                        {workBlock.title}{" "}
                        {formatHumanTimeRange(workBlock.startsAt, workBlock.endsAt)}
                        {onEditWork ? (
                          <button
                            aria-label={`Edit work configuration for ${workBlock.title}`}
                            className="df-secondary-button"
                            onClick={onEditWork}
                            type="button"
                          >
                            Edit Work
                          </button>
                        ) : null}
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
                          {onEditCommitment
                            ? renderCommitmentEditAction(scheduledBlock, onEditCommitment)
                            : null}
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
                  Plan attention — Unplaced
                </h3>
                {dayGroup.unplacedCandidates.length === 0 ? (
                  <p className="df-empty">No unplaced commitments.</p>
                ) : (
                  <ul className="df-plain-list">
                    {dayGroup.unplacedCandidates.map((candidate) => (
                      <li key={candidate.id}>
                        {candidate.title} - needs placement
                        <span className="df-muted"> {formatCandidateDetails(candidate)}</span>
                        {onEditCommitment
                          ? renderCommitmentEditAction(candidate, onEditCommitment)
                          : null}
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
                  Needs attention
                </h3>
                {dayGroup.frictionPoints.length === 0 ? (
                  <p className="df-empty">No schedule conflicts detected.</p>
                ) : (
                  <ul className="df-plain-list">
                    {dayGroup.frictionPoints.map((frictionPoint) => (
                      <li
                        id={`review-friction-${frictionPoint.id}`}
                        key={frictionPoint.id}
                        tabIndex={-1}
                      >
                        <div>{frictionPoint.title}</div>
                        <div className="df-muted">{frictionPoint.message}</div>
                        <div className="df-fix-list">
                          {frictionPoint.suggestedFixes.length > 0 ? (
                            frictionPoint.suggestedFixes.map((suggestedFix) => (
                              <button
                                className="df-fix-button"
                                disabled={preview.isStale}
                                key={suggestedFix.id}
                                onClick={createSuggestedFixHandler(
                                  frictionPoint.id,
                                  suggestedFix.id,
                                  onApplySuggestedFix,
                                )}
                                type="button"
                              >
                                {formatSuggestedFixLabel(suggestedFix)}
                              </button>
                            ))
                          ) : (
                            <span className="df-muted">
                              No resolution option is available. Review the related setup and
                              refresh the schedule.
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

function AcceptedChoicesSection({
  decisions,
  onRemove,
  removalProtected,
}: {
  decisions: AcceptedDecisionViewModel[];
  onRemove: ((decisionId: AcceptedDecisionViewModel["decisionId"]) => void) | undefined;
  removalProtected: boolean;
}): ReactElement | null {
  if (decisions.length === 0) return null;
  return (
    <section aria-labelledby="accepted-choices-heading" className="df-accepted-choices">
      <h2 className="df-panel-title" id="accepted-choices-heading">
        Accepted choices ({decisions.length})
      </h2>
      {removalProtected ? (
        <p className="df-danger-message">
          Accepted choices are protected by recovery-required stored data.
        </p>
      ) : null}
      <ul className="df-accepted-choice-list">
        {decisions.map((decision) => (
          <li className="df-accepted-choice" key={decision.decisionId}>
            <div>
              <strong>{decision.summary}</strong>
              <p className="df-muted">{decision.occurrenceContext}</p>
              <p className="df-meta">Status: {decision.statusLabel}</p>
            </div>
            <button
              aria-label={`Remove accepted choice for ${decision.targetSummary}`}
              className="df-secondary-button"
              disabled={removalProtected}
              onClick={() => onRemove?.(decision.decisionId)}
              type="button"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function buildDayGroups(
  preview: DayFramePreview,
  getDayBoundaryStartTimeForUserDayDate: PreviewScreenProps["getDayBoundaryStartTimeForUserDayDate"],
  visibleRangeStartDate: PreviewScreenProps["visibleRangeStartDate"],
  visibleRangeEndDate: PreviewScreenProps["visibleRangeEndDate"],
  getUserDayWindowForUserDayDate?: PreviewScreenProps["getUserDayWindowForUserDayDate"],
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
          getUserDayWindowForUserDayDate?.(userDayDate),
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
      getUserDayWindowForUserDayDate,
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
  info: number;
  critical: number;
  warning: number;
} {
  let info = 0;
  let critical = 0;
  let warning = 0;

  for (const frictionPoint of frictionPoints) {
    if (frictionPoint.severity === "info") {
      info += 1;
    } else if (frictionPoint.severity === "critical") {
      critical += 1;
    } else if (frictionPoint.severity === "warning") {
      warning += 1;
    }
  }

  return {
    info,
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

function formatSuggestedFixLabel(
  suggestedFix: DayFramePreview["result"]["frictionPoints"][number]["suggestedFixes"][number],
): string {
  if (suggestedFix.decisionContext?.relationship === "superseding") {
    return `Revise accepted choice: ${suggestedFix.label}`;
  }
  if (suggestedFix.decisionContext?.relationship === "unblocking") {
    return `May unblock accepted choice: ${suggestedFix.label}`;
  }
  return suggestedFix.label;
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
  getUserDayWindowForUserDayDate?: PreviewScreenProps["getUserDayWindowForUserDayDate"],
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
          getUserDayWindowForUserDayDate?.(userDayDate),
        ),
    );

    if (overlapsScheduledBlock) {
      return userDayDate;
    }

    const overlapsWorkBlock = preview.result.generatedWorkBlocks.some(
      (workBlock) =>
        frictionPoint.affectedBlockIds.includes(workBlock.id) &&
        overlapsUserDay(
          workBlock.startsAt,
          workBlock.endsAt,
          userDayDate,
          dayBoundaryStartTime,
          getUserDayWindowForUserDayDate?.(userDayDate),
        ),
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
  canonicalWindow?: { start: Date; end: Date },
): boolean {
  const userDayStart =
    canonicalWindow?.start ?? getUserDayStartFromDateString(userDayDate, dayBoundaryStartTime);
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

function renderCommitmentEditAction(
  item:
    | DayFramePreview["result"]["scheduledBlocks"][number]
    | DayFramePreview["result"]["unplacedCandidates"][number],
  onEdit: (target: {
    logicalId: string;
    incarnationId: string;
    recurrenceLogicalId: string;
    recurrenceIncarnationId: string;
  }) => void,
): ReactElement | null {
  const identity = item.occurrenceIdentity;
  const navigationIdentity = item.commitmentNavigationIdentity;
  if (!identity || identity.sourceKind !== "template" || !navigationIdentity) return null;
  if (
    identity.templateId !== navigationIdentity.templateId ||
    identity.recurrenceId !== navigationIdentity.recurrenceId
  )
    return null;
  return (
    <button
      aria-label={`Edit commitment ${item.title}`}
      className="df-secondary-button"
      onClick={() =>
        onEdit({
          logicalId: navigationIdentity.templateId,
          incarnationId: navigationIdentity.templateIncarnationId,
          recurrenceLogicalId: navigationIdentity.recurrenceId,
          recurrenceIncarnationId: navigationIdentity.recurrenceIncarnationId,
        })
      }
      type="button"
    >
      Edit Commitment
    </button>
  );
}

function renderEventEditAction(
  item: DayFramePreview["result"]["scheduledBlocks"][number],
  authoredSetup: DayFrameAuthoredSetup | undefined,
  onEdit: (target: {
    logicalId: string;
    incarnationId?: string;
    userDayDate: LocalDateString;
  }) => void,
): ReactElement | null {
  const identity = item.occurrenceIdentity;
  if (!identity || identity.sourceKind !== "manualEvent" || !authoredSetup) return null;
  const event = authoredSetup.manualEvents.find((source) => source.id === identity.manualEventId);
  if (!event) return null;
  return (
    <button
      aria-label={`Edit event ${item.title}`}
      className="df-secondary-button"
      onClick={() =>
        onEdit({
          logicalId: event.id,
          userDayDate: event.userDayDate,
          ...(getIncarnationId(event) ? { incarnationId: getIncarnationId(event)! } : {}),
        })
      }
      type="button"
    >
      Edit Event
    </button>
  );
}

function getIncarnationId(value: object): string | undefined {
  return "incarnationId" in value && typeof value.incarnationId === "string"
    ? value.incarnationId
    : undefined;
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
