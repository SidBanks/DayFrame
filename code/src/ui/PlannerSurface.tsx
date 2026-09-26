import type { ReactElement, ReactNode } from "react";

import type { PlannerMode } from "./plannerNavigation.js";
export type { PlannerMode } from "./plannerNavigation.js";

export type PlannerSurfaceProps = {
  mode: PlannerMode;
  onOpenMonth: () => void;
  onOpenMySchedule?: () => void;
  onOpenSleep?: () => void;
  myScheduleContent?: ReactNode;
  sleepContent?: ReactNode;
  onOpenWorkPattern: () => void;
  onOpenCommitmentLibrary: () => void;
  onOpenSchedule: () => void;
  onOpenGoals?: () => void;
  onOpenToday?: () => void;
  goalsContent?: ReactNode;
  todayContent?: ReactNode;
  selectedDay?: string;
  monthContent: ReactNode;
  workPatternContent: ReactNode;
  commitmentLibraryContent: ReactNode;
  scheduleContent: ReactNode;
};

export function PlannerSurface({
  mode,
  onOpenMonth,
  onOpenWorkPattern,
  onOpenMySchedule,
  onOpenSleep,
  myScheduleContent,
  sleepContent,
  onOpenCommitmentLibrary,
  onOpenSchedule,
  onOpenGoals,
  onOpenToday,
  goalsContent,
  todayContent,
  selectedDay,
  monthContent,
  workPatternContent,
  commitmentLibraryContent,
  scheduleContent,
}: PlannerSurfaceProps): ReactElement {
  return (
    <main
      aria-labelledby="planner-heading"
      className={`df-product-surface${mode === "day" ? " df-day-mode" : ""}`}
    >
      <section className="df-panel df-planner-header">
        <h1 className="df-screen-title" id="planner-heading">
          Planner
        </h1>
        <nav aria-label="Planner modes" className="df-foundation-secondary">
          <button
            className="df-secondary-button"
            aria-pressed={mode === "month" || mode === "today" || mode === "day"}
            onClick={onOpenMonth}
            type="button"
          >
            Calendar
          </button>
          <button
            className="df-secondary-button"
            aria-pressed={["mySchedule", "workPattern", "sleep", "commitmentLibrary"].includes(
              mode,
            )}
            onClick={onOpenMySchedule ?? onOpenWorkPattern}
            type="button"
          >
            My Schedule
          </button>
          <button
            className="df-secondary-button"
            aria-pressed={mode === "goals"}
            onClick={onOpenGoals}
            type="button"
          >
            Goals
          </button>
          <button
            className="df-secondary-button"
            aria-pressed={mode === "schedule"}
            onClick={onOpenSchedule}
            type="button"
          >
            Review Schedule
          </button>
        </nav>
        {["mySchedule", "workPattern", "sleep", "commitmentLibrary"].includes(mode) ? (
          <nav aria-label="My Schedule" className="df-foundation-secondary">
            <button
              className="df-secondary-button"
              aria-pressed={mode === "workPattern"}
              onClick={onOpenWorkPattern}
              type="button"
            >
              Work Pattern
            </button>
            <button
              className="df-secondary-button"
              aria-pressed={mode === "sleep"}
              onClick={onOpenSleep}
              type="button"
            >
              Sleep
            </button>
            <button
              className="df-secondary-button"
              aria-pressed={mode === "commitmentLibrary"}
              onClick={onOpenCommitmentLibrary}
              type="button"
            >
              Commitments
            </button>
          </nav>
        ) : null}
        <div className="df-foundation-day-nav">
          {selectedDay ? (
            <span>
              Selected day: <time dateTime={selectedDay}>{selectedDay}</time>
            </span>
          ) : null}
          {onOpenToday ? (
            <button
              className="df-secondary-button"
              aria-pressed={mode === "today"}
              onClick={onOpenToday}
              type="button"
            >
              Today
            </button>
          ) : null}
        </div>
      </section>
      {mode === "mySchedule"
        ? myScheduleContent
        : mode === "sleep"
          ? sleepContent
          : mode === "goals"
            ? goalsContent
            : mode === "today" || mode === "day"
              ? todayContent
              : mode === "month"
                ? monthContent
                : mode === "workPattern"
                  ? workPatternContent
                  : mode === "commitmentLibrary"
                    ? commitmentLibraryContent
                    : scheduleContent}
    </main>
  );
}
