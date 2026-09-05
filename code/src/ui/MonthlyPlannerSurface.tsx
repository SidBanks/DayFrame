import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { addUserDayLabels } from "../core/time/canonicalUserDay.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
import type { ReviewScopeV1 } from "../core/planning/planningScope.js";
import {
  projectLabelToDisplayedMonth,
  shiftDisplayedMonth,
  takeMonthlyPlannerTokens,
  type DisplayedMonth,
  type MonthlyPlannerCell,
  type MonthlyPlannerEvidence,
  type CommitmentTarget,
  type EventTarget,
} from "../core/monthlyPlanner/queryMonthlyPlanner.js";
import type { LocalDateString } from "../core/shifts/types.js";
import type { DayFrameReadiness } from "../state/dayFrameReadiness.js";
import {
  getInitialMonthlyPlannerView,
  queryMonthlyPlannerFromState,
} from "../state/monthlyPlannerQuery.js";
import type { DayFrameState } from "../state/types.js";
import type { PlanningReviewReadModelV1 } from "../state/planningScopeQuery.js";
import { formatHumanTimeRange } from "./timeDisplay.js";
import { PlanningReviewPanel } from "./PlanningReviewPanel.js";

export type MonthlyPlannerSurfaceProps = {
  state: DayFrameState;
  readiness: DayFrameReadiness;
  getNow: () => Date;
  onOpenPlanningSettings: () => void;
  onOpenWorkPattern: () => void;
  onOpenCommitmentLibrary: () => void;
  onOpenReview: () => void;
  onOpenAttention: (input: { frictionPointId: string; userDayDate: LocalDateString }) => void;
  onGenerateSchedule: () => void;
  previewState: "current" | "none" | "stale";
  isSetupDirty: boolean;
  generationMessage?: string;
  onAddCommitment: () => void;
  onAddEvent: (userDayDate: LocalDateString) => void;
  onEditCommitment: (target: CommitmentTarget) => void;
  onEditEvent: (target: EventTarget) => void;
  onEditWork: () => void;
  initialView?: { displayedMonth: DisplayedMonth; selectedLabel: LocalDateString };
  onViewChange?: (view: { displayedMonth: DisplayedMonth; selectedLabel: LocalDateString }) => void;
  contextualMessage?: string;
  contextualPlanContent?: ReactNode;
  contextualPlanWide?: boolean;
  onBackToDay?: () => void;
  queryPlanningReview?: (input: {
    reviewScope: ReviewScopeV1;
    historyAsOf: string;
  }) => Promise<PlanningReviewReadModelV1>;
};

export function MonthlyPlannerSurface({
  state,
  readiness,
  getNow,
  onOpenPlanningSettings,
  onOpenWorkPattern,
  onOpenCommitmentLibrary,
  onOpenReview,
  onOpenAttention,
  onGenerateSchedule,
  previewState,
  isSetupDirty,
  generationMessage = "",
  onAddCommitment,
  onAddEvent,
  onEditCommitment,
  onEditEvent,
  onEditWork,
  initialView: preservedView,
  onViewChange,
  contextualMessage = "",
  contextualPlanContent = null,
  contextualPlanWide = false,
  onBackToDay,
  queryPlanningReview,
}: MonthlyPlannerSurfaceProps): ReactElement {
  const [evaluationInstant, setEvaluationInstant] = useState(() => getNow());
  const [initial] = useState(() => getInitialMonthlyPlannerView(state, evaluationInstant));
  const [displayedMonth, setDisplayedMonth] = useState<DisplayedMonth>(
    preservedView?.displayedMonth ?? initial.displayedMonth,
  );
  const [selectedLabel, setSelectedLabel] = useState<LocalDateString>(
    preservedView?.selectedLabel ?? initial.selectedLabel,
  );
  const [focusedLabel, setFocusedLabel] = useState<LocalDateString>(
    preservedView?.selectedLabel ?? initial.selectedLabel,
  );
  const dayRefs = useRef(new Map<LocalDateString, HTMLButtonElement>());
  const pendingFocus = useRef<LocalDateString | null>(null);
  const result = queryMonthlyPlannerFromState({
    state,
    readiness,
    evaluationInstant,
    displayedMonth,
    selectedLabel,
  });
  const monthReviewScope = createReviewScope({
    kind: "month",
    anchorUserDayDate: `${displayedMonth}-01` as LocalDateString,
    weekStartsOn: state.schedulingPreferences.weekStartsOn,
    source: "navigation",
  });

  useEffect(() => {
    if (!pendingFocus.current) return;
    const target = dayRefs.current.get(pendingFocus.current);
    if (!target) return;
    target.focus();
    pendingFocus.current = null;
  });
  useEffect(() => {
    onViewChange?.({ displayedMonth, selectedLabel });
  }, [displayedMonth, onViewChange, selectedLabel]);
  useEffect(() => {
    document.getElementById("month-heading")?.focus();
  }, []);

  if (result.kind !== "available") {
    const copy =
      result.kind === "protected"
        ? "Planner data needs recovery before Month can show schedule truth."
        : result.kind === "unavailable"
          ? "Planner data is still loading or unavailable."
          : "Month could not be projected. Reload DayFrame to try again.";
    return (
      <section className="df-panel" role="alert">
        <h2>Month unavailable</h2>
        <p>{copy}</p>
      </section>
    );
  }

  const model = result.model;
  const visibleFocusedLabel = model.cells.some((cell) => cell.label === focusedLabel)
    ? focusedLabel
    : (model.cells.find((cell) => cell.isInDisplayedMonth)?.label ?? model.gridStartLabel);

  function moveToMonth(offset: number, focusControl = false): void {
    const nextMonth = shiftDisplayedMonth(displayedMonth, offset);
    const nextSelected = projectLabelToDisplayedMonth(selectedLabel, nextMonth);
    const nextFocused = projectLabelToDisplayedMonth(focusedLabel, nextMonth);
    setDisplayedMonth(nextMonth);
    setSelectedLabel(nextSelected);
    setFocusedLabel(nextFocused);
    if (!focusControl) pendingFocus.current = nextFocused;
  }

  function selectLabel(label: LocalDateString): void {
    setSelectedLabel(label);
    setFocusedLabel(label);
    if (label.slice(0, 7) !== displayedMonth)
      setDisplayedMonth(label.slice(0, 7) as DisplayedMonth);
  }

  function moveFocus(offset: number): void {
    const target = addUserDayLabels(focusedLabel, offset);
    setFocusedLabel(target);
    if (!model.cells.some((cell) => cell.label === target)) {
      setDisplayedMonth(target.slice(0, 7) as DisplayedMonth);
    }
    pendingFocus.current = target;
  }

  function handleGridKey(event: KeyboardEvent<HTMLButtonElement>, cellIndex: number): void {
    let handled = true;
    switch (event.key) {
      case "ArrowLeft":
        moveFocus(-1);
        break;
      case "ArrowRight":
        moveFocus(1);
        break;
      case "ArrowUp":
        moveFocus(-7);
        break;
      case "ArrowDown":
        moveFocus(7);
        break;
      case "Home":
        moveFocus(-(cellIndex % 7));
        break;
      case "End":
        moveFocus(6 - (cellIndex % 7));
        break;
      case "PageUp":
        moveToMonth(-1);
        break;
      case "PageDown":
        moveToMonth(1);
        break;
      case "Enter":
      case " ":
        selectLabel(focusedLabel);
        break;
      default:
        handled = false;
    }
    if (handled) event.preventDefault();
  }

  function goToCurrentUserDay(): void {
    const nextInstant = getNow();
    const next = getInitialMonthlyPlannerView(state, nextInstant);
    setEvaluationInstant(nextInstant);
    setDisplayedMonth(next.displayedMonth);
    setSelectedLabel(next.selectedLabel);
    setFocusedLabel(next.selectedLabel);
    pendingFocus.current = next.selectedLabel;
  }

  return (
    <section aria-labelledby="month-heading" className="df-month-surface">
      <div className="df-panel df-month-header">
        <div>
          <p className="df-workflow-eyebrow">Monthly Planner</p>
          <h2 aria-live="polite" className="df-screen-title" id="month-heading" tabIndex={-1}>
            {formatMonthHeading(model.displayedMonth.year, model.displayedMonth.month)}
          </h2>
          <p className="df-support">Select a date to review its canonical DayFrame day.</p>
        </div>
        <div className="df-month-actions">
          <button className="df-action-button" onClick={onAddCommitment} type="button">
            Add Commitment
          </button>
          <button className="df-secondary-button" onClick={onOpenWorkPattern} type="button">
            Work Pattern
          </button>
          <button className="df-secondary-button" onClick={onOpenCommitmentLibrary} type="button">
            Commitment Library
          </button>
          <button
            aria-label="Previous month"
            className="df-secondary-button"
            onClick={() => moveToMonth(-1, true)}
            type="button"
          >
            Previous
          </button>
          <button className="df-secondary-button" onClick={goToCurrentUserDay} type="button">
            Current DayFrame day
          </button>
          <button
            aria-label="Next month"
            className="df-secondary-button"
            onClick={() => moveToMonth(1, true)}
            type="button"
          >
            Next
          </button>
        </div>
        <MonthStatus
          generationMessage={generationMessage}
          isSetupDirty={isSetupDirty}
          model={model}
          onGenerateSchedule={onGenerateSchedule}
          onOpenReview={onOpenReview}
          previewState={previewState}
        />
      </div>

      <div className="df-month-layout">
        <section aria-label="Month calendar" className="df-panel df-month-calendar">
          <div aria-labelledby="month-heading" className="df-month-grid" role="grid">
            <div className="df-month-weekdays" role="row">
              {model.weekdayColumns.map((column) => (
                <div className="df-month-weekday" key={column.weekday} role="columnheader">
                  <span aria-hidden="true">{column.weekday.slice(0, 3)}</span>
                  <span className="df-visually-hidden">{column.weekday}</span>
                </div>
              ))}
            </div>
            {Array.from({ length: model.cells.length / 7 }, (_, rowIndex) => (
              <div className="df-month-week" key={model.cells[rowIndex * 7]!.label} role="row">
                {model.cells.slice(rowIndex * 7, rowIndex * 7 + 7).map((cell, columnIndex) => {
                  const cellIndex = rowIndex * 7 + columnIndex;
                  const selected = cell.label === selectedLabel;
                  return (
                    <MonthCell
                      cell={cell}
                      focused={cell.label === visibleFocusedLabel}
                      key={cell.label}
                      onFocus={() => setFocusedLabel(cell.label)}
                      onKeyDown={(event) => handleGridKey(event, cellIndex)}
                      onSelect={() => selectLabel(cell.label)}
                      ref={(node) => {
                        if (node) dayRefs.current.set(cell.label, node);
                        else dayRefs.current.delete(cell.label);
                      }}
                      selected={selected}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        <SelectedDayWorkspace
          contextualPlanContent={contextualPlanContent}
          contextualPlanWide={contextualPlanWide}
          contextualMessage={contextualMessage}
          onAddCommitment={onAddCommitment}
          onAddEvent={onAddEvent}
          onEditCommitment={onEditCommitment}
          onEditEvent={onEditEvent}
          onEditWork={onEditWork}
          onOpenAttention={onOpenAttention}
          onOpenPlanningSettings={onOpenPlanningSettings}
          {...(onBackToDay ? { onBackToDay } : {})}
          selectedDay={model.selectedDay}
        />
      </div>
      {queryPlanningReview ? (
        <PlanningReviewPanel
          historyAsOf={evaluationInstant.toISOString()}
          query={queryPlanningReview}
          refreshKey={state}
          reviewScope={monthReviewScope}
          selectedDay={selectedLabel}
        />
      ) : null}
    </section>
  );
}

function MonthCell({
  cell,
  focused,
  selected,
  onSelect,
  onFocus,
  onKeyDown,
  ref,
}: {
  cell: MonthlyPlannerCell;
  focused: boolean;
  selected: boolean;
  onSelect: () => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  ref: (node: HTMLButtonElement | null) => void;
}): ReactElement {
  const tokenBudget = takeMonthlyPlannerTokens(cell.tokens, 3);
  return (
    <button
      aria-current={cell.isCurrentUserDay ? "date" : undefined}
      aria-label={buildCellLabel(cell, selected)}
      aria-selected={selected}
      className={buildCellClass(cell, selected)}
      onClick={onSelect}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      ref={ref}
      role="gridcell"
      tabIndex={focused ? 0 : -1}
      type="button"
    >
      <span className="df-month-date-number">{Number(cell.label.slice(-2))}</span>
      <span aria-hidden="true" className="df-month-cell-indicators">
        {cell.tokens.length > 0 ? `${cell.tokens.length} planned` : coverageShortLabel(cell)}
        {cell.counts.friction > 0 || cell.counts.unplaced > 0 ? " · !" : ""}
      </span>
      <span aria-hidden="true" className="df-month-tokens">
        {tokenBudget.visible.map((token) => (
          <span className={`df-month-token df-month-token--${token.kind}`} key={token.id}>
            {tokenLabel(token)}
          </span>
        ))}
        {tokenBudget.overflowCount > 0 ? (
          <span className="df-month-overflow">+{tokenBudget.overflowCount} more</span>
        ) : null}
        {cell.tokens.length === 0 ? (
          <span className="df-month-empty-label">{coverageShortLabel(cell)}</span>
        ) : null}
      </span>
    </button>
  );
}

function MonthStatus({
  model,
  onOpenReview,
  onGenerateSchedule,
  previewState,
  isSetupDirty,
  generationMessage,
}: {
  model: Extract<ReturnType<typeof queryMonthlyPlannerFromState>, { kind: "available" }>["model"];
  onOpenReview: () => void;
  onGenerateSchedule: () => void;
  previewState: "current" | "none" | "stale";
  isSetupDirty: boolean;
  generationMessage: string;
}): ReactElement {
  const status =
    model.status === "fullyCoveredStale"
      ? "This schedule is based on older saved planning inputs."
      : model.status === "partialCoverage"
        ? `Schedule generated for part of this month. ${model.coverageSummary.uncovered} dates are not generated.`
        : model.status === "noCoverage"
          ? "This month is not generated."
          : "Schedule coverage is current for this month.";
  return (
    <div
      aria-live="polite"
      className="df-month-status"
      id="month-schedule-status"
      role="status"
      tabIndex={-1}
    >
      <p>{status}</p>
      {isSetupDirty ? (
        <p className="df-warning-message">
          Plan has unsaved changes. Save Setup before refreshing the schedule.
        </p>
      ) : null}
      {model.attention.frictionCount > 0 || model.attention.unplacedCount > 0 ? (
        <p>
          Needs attention: {model.attention.frictionCount} schedule issues,{" "}
          {model.attention.unplacedCount} unplaced.
        </p>
      ) : null}
      <p>
        Planning range: {formatDateLabel(model.planningRange.startDate)}–
        {formatDateLabel(model.planningRange.endDate)}. Month navigation does not change it.
      </p>
      <button className="df-secondary-button" onClick={onOpenReview} type="button">
        Open Review Schedule
      </button>
      {previewState !== "current" ? (
        <button
          className="df-action-button"
          disabled={isSetupDirty}
          onClick={onGenerateSchedule}
          type="button"
        >
          {previewState === "stale" ? "Refresh Schedule" : "Generate Schedule"}
        </button>
      ) : null}
      {generationMessage ? <p className="df-danger-message">{generationMessage}</p> : null}
    </div>
  );
}

function SelectedDayWorkspace({
  selectedDay,
  onOpenPlanningSettings,
  onAddCommitment,
  onAddEvent,
  onEditCommitment,
  onEditEvent,
  onEditWork,
  onOpenAttention,
  contextualMessage,
  contextualPlanContent,
  contextualPlanWide,
  onBackToDay,
}: {
  selectedDay: Extract<
    ReturnType<typeof queryMonthlyPlannerFromState>,
    { kind: "available" }
  >["model"]["selectedDay"];
  onOpenPlanningSettings: () => void;
  onAddCommitment: () => void;
  onAddEvent: (userDayDate: LocalDateString) => void;
  onEditCommitment: (target: CommitmentTarget) => void;
  onEditEvent: (target: EventTarget) => void;
  onEditWork: () => void;
  onOpenAttention: (input: { frictionPointId: string; userDayDate: LocalDateString }) => void;
  contextualMessage: string;
  contextualPlanContent: ReactNode;
  contextualPlanWide: boolean;
  onBackToDay?: () => void;
}): ReactElement {
  if (!selectedDay) {
    return (
      <aside className="df-panel df-month-selected-day">
        <h3>Select a date</h3>
        <p>Choose a Month cell to review its DayFrame day.</p>
      </aside>
    );
  }
  const allDay = selectedDay.occurrences.filter((item) => item.kind === "allDayEvent");
  const planned = selectedDay.occurrences.filter((item) => item.kind !== "allDayEvent");
  const unusualDuration = selectedDay.canonical.durationMinutes !== 24 * 60;
  if (contextualPlanContent) {
    return (
      <aside
        aria-label="Monthly Planner contextual authoring"
        className={`df-panel df-month-selected-day df-month-contextual-editor${
          contextualPlanWide ? " df-month-contextual-editor--wide" : ""
        }`}
      >
        <button className="df-secondary-button" onClick={onBackToDay} type="button">
          Back to day
        </button>
        {contextualMessage ? (
          <p className="df-warning-message" role="status">
            {contextualMessage}
          </p>
        ) : null}
        {contextualPlanContent}
      </aside>
    );
  }
  return (
    <aside aria-labelledby="selected-day-heading" className="df-panel df-month-selected-day">
      <div className="df-screen-header">
        <p className="df-workflow-eyebrow">Selected DayFrame day</p>
        <h3 className="df-panel-title" id="selected-day-heading" tabIndex={-1}>
          {formatLongDate(selectedDay.label)}
        </h3>
        <p className="df-support">
          {formatHumanTimeRange(selectedDay.canonical.start, selectedDay.canonical.end)}
          {unusualDuration ? ` · ${formatDuration(selectedDay.canonical.durationMinutes)}` : ""}
        </p>
        {selectedDay.weekStartTransition.differsFromDisplayAnchor ? (
          <p className="df-support">
            This day uses a different canonical week start than the displayed Month columns.
          </p>
        ) : null}
      </div>
      <p
        className={
          selectedDay.coverage.kind === "coveredStale" ? "df-warning-message" : "df-support"
        }
      >
        {selectedCoverageLabel(selectedDay.coverage)}
      </p>
      {contextualMessage ? (
        <p className="df-warning-message" role="status" tabIndex={-1}>
          {contextualMessage}
        </p>
      ) : null}
      <div className="df-screen-actions" aria-label="Selected day actions">
        <button
          className="df-action-button"
          onClick={() => onAddEvent(selectedDay.label)}
          type="button"
        >
          Add Event
        </button>
        <button className="df-secondary-button" onClick={onAddCommitment} type="button">
          Add Commitment
        </button>
      </div>
      {allDay.length > 0 ? (
        <EvidenceList
          heading="All day"
          items={allDay}
          onEditCommitment={onEditCommitment}
          onEditEvent={onEditEvent}
          onEditWork={onEditWork}
        />
      ) : null}
      {planned.length > 0 ? (
        <EvidenceList
          heading="Planned items"
          items={planned}
          onEditCommitment={onEditCommitment}
          onEditEvent={onEditEvent}
          onEditWork={onEditWork}
        />
      ) : selectedDay.coverage.kind === "uncovered" ? null : (
        <p className="df-empty">No planned items in this generated schedule.</p>
      )}
      {selectedDay.friction.length > 0 ? (
        <section className="df-month-attention">
          <h4>Needs attention</h4>
          <ul className="df-plain-list">
            {selectedDay.friction.map((item) => (
              <li className="df-list-card" key={item.id}>
                <strong>{item.title}</strong>
                <span>{item.message}</span>
                {item.resolutionOptions.length > 0 ? (
                  <span className="df-support">
                    {item.resolutionOptions.length} canonical resolution option
                    {item.resolutionOptions.length === 1 ? "" : "s"} available.
                  </span>
                ) : (
                  <span className="df-support">No canonical resolution option available.</span>
                )}
                <button
                  aria-label={`Resolve ${item.title} in Review Schedule`}
                  className="df-secondary-button"
                  onClick={() =>
                    onOpenAttention({
                      frictionPointId: item.target.frictionPointId,
                      userDayDate: selectedDay.label,
                    })
                  }
                  type="button"
                >
                  Review resolution options
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {selectedDay.unplaced.length > 0 ? (
        <section className="df-month-attention">
          <h4>Not placed</h4>
          <ul className="df-plain-list">
            {selectedDay.unplaced.map((item) => (
              <li key={item.id}>
                {item.title} — not placed in the generated schedule.
                {item.target.commitment?.availability === "current" ? (
                  <button
                    aria-label={`Edit commitment ${item.title}`}
                    className="df-secondary-button"
                    onClick={() => onEditCommitment(item.target.commitment!)}
                    type="button"
                  >
                    Edit Commitment
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <button className="df-secondary-button" onClick={onOpenPlanningSettings} type="button">
        Planning settings
      </button>
    </aside>
  );
}

function EvidenceList({
  heading,
  items,
  onEditCommitment,
  onEditEvent,
  onEditWork,
}: {
  heading: string;
  items: MonthlyPlannerEvidence[];
  onEditCommitment: (target: CommitmentTarget) => void;
  onEditEvent: (target: EventTarget) => void;
  onEditWork: () => void;
}): ReactElement {
  return (
    <section className="df-month-agenda-section">
      <h4>{heading}</h4>
      <ul className="df-plain-list df-month-agenda">
        {items.map((item) => (
          <li key={item.id}>
            <strong>{evidenceKindLabel(item.kind)}</strong>
            <span>{item.title}</span>
            {item.kind === "allDayEvent" || !item.startsAt || !item.endsAt ? (
              <span>All day</span>
            ) : (
              <span>{formatHumanTimeRange(item.startsAt, item.endsAt)}</span>
            )}
            <EvidenceAction
              item={item}
              onEditCommitment={onEditCommitment}
              onEditEvent={onEditEvent}
              onEditWork={onEditWork}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function EvidenceAction({
  item,
  onEditCommitment,
  onEditEvent,
  onEditWork,
}: {
  item: MonthlyPlannerEvidence;
  onEditCommitment: (target: CommitmentTarget) => void;
  onEditEvent: (target: EventTarget) => void;
  onEditWork: () => void;
}): ReactElement | null {
  if (item.target.kind === "event")
    return (
      <button
        aria-label={`Edit event ${item.title}`}
        className="df-secondary-button"
        onClick={() => onEditEvent(item.target as EventTarget)}
        type="button"
      >
        Edit Event
      </button>
    );
  if (item.target.kind === "commitment") {
    if (item.target.availability !== "current")
      return <span className="df-warning-message">Source is no longer available to edit.</span>;
    return (
      <button
        aria-label={`Edit commitment ${item.title}`}
        className="df-secondary-button"
        onClick={() => onEditCommitment(item.target as CommitmentTarget)}
        type="button"
      >
        Edit Commitment
      </button>
    );
  }
  if (item.target.kind === "work")
    return (
      <button
        aria-label="Edit Work"
        className="df-secondary-button"
        onClick={onEditWork}
        type="button"
      >
        Edit Work
      </button>
    );
  return null;
}

function buildCellLabel(cell: MonthlyPlannerCell, selected: boolean): string {
  const states = [
    formatLongDate(cell.label),
    selected ? "Selected" : "",
    cell.isCurrentUserDay ? "Current DayFrame day" : "",
    cell.coverage.kind === "uncovered"
      ? "Not generated"
      : cell.coverage.kind === "coveredStale"
        ? "Generated schedule is stale"
        : cell.coverage.generatedEmpty
          ? "Generated schedule has no planned items"
          : "Generated schedule available",
    `${cell.evidence.length} planned items`,
    cell.counts.friction > 0 ? `${cell.counts.friction} needs attention` : "",
    cell.counts.unplaced > 0 ? `${cell.counts.unplaced} unplaced` : "",
  ];
  return states.filter(Boolean).join(". ");
}

function buildCellClass(cell: MonthlyPlannerCell, selected: boolean): string {
  return [
    "df-month-cell",
    !cell.isInDisplayedMonth ? "is-adjacent" : "",
    cell.isCurrentUserDay ? "is-current" : "",
    selected ? "is-selected" : "",
    cell.coverage.kind === "uncovered" ? "is-uncovered" : "",
    cell.coverage.kind === "coveredStale" ? "is-stale" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function coverageShortLabel(cell: MonthlyPlannerCell): string {
  if (cell.coverage.kind === "uncovered") return "Not generated";
  if (cell.coverage.kind === "coveredStale") return "Stale";
  return cell.coverage.generatedEmpty ? "Generated · No items" : "Generated";
}

function selectedCoverageLabel(coverage: MonthlyPlannerCell["coverage"]): string {
  if (coverage.kind === "uncovered")
    return "Not generated. No current schedule coverage exists for this day.";
  if (coverage.kind === "coveredStale")
    return "Generated schedule based on older saved planning inputs.";
  return coverage.generatedEmpty
    ? "Generated schedule · No planned items."
    : "Generated current schedule.";
}

function tokenLabel(token: MonthlyPlannerEvidence): string {
  if (token.kind === "allDayEvent") return `${token.title} · All day`;
  if (token.kind === "work") return "Work";
  return token.title;
}

function evidenceKindLabel(kind: MonthlyPlannerEvidence["kind"]): string {
  return {
    allDayEvent: "Event",
    timedEvent: "Event",
    work: "Work",
    commitment: "Commitment",
    sleep: "Sleep",
    attention: "Needs attention",
  }[kind];
}

function formatMonthHeading(year: number, month: number): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1, 12),
  );
}

function formatLongDate(label: LocalDateString): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${label}T12:00:00`));
}

function formatDateLabel(label: LocalDateString): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${label}T12:00:00`));
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours}-hour DayFrame day` : `${hours}h ${remainder}m DayFrame day`;
}
