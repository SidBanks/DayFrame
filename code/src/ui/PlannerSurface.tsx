import type { ReactElement, ReactNode } from "react";

export type PlannerMode = "month" | "workPattern" | "commitmentLibrary" | "schedule";

export type PlannerSurfaceProps = {
  isSetupDirty: boolean;
  mode: PlannerMode;
  onOpenMonth: () => void;
  onOpenWorkPattern: () => void;
  onOpenCommitmentLibrary: () => void;
  onOpenSchedule: () => void;
  monthContent: ReactNode;
  workPatternContent: ReactNode;
  commitmentLibraryContent: ReactNode;
  previewState: "current" | "none" | "stale";
  scheduleContent: ReactNode;
};

export function PlannerSurface({
  isSetupDirty,
  mode,
  onOpenMonth,
  onOpenWorkPattern,
  onOpenCommitmentLibrary,
  onOpenSchedule,
  monthContent,
  workPatternContent,
  commitmentLibraryContent,
  previewState,
  scheduleContent,
}: PlannerSurfaceProps): ReactElement {
  return (
    <main aria-labelledby="planner-heading" className="df-product-surface">
      <section className="df-panel df-planner-header">
        <div className="df-screen-header">
          <p className="df-workflow-eyebrow">Operational workspace</p>
          <h1 className="df-screen-title" id="planner-heading">
            Planner
          </h1>
          <p className="df-screen-subtitle">
            Author your plan, then generate and review a derived schedule.
          </p>
        </div>
        <nav aria-label="Planner modes" className="df-planner-mode-nav">
          <button
            aria-pressed={mode === "month"}
            className={mode === "month" ? "df-action-button is-active" : "df-action-button"}
            onClick={onOpenMonth}
            type="button"
          >
            Month
          </button>
          <button
            aria-pressed={mode === "commitmentLibrary"}
            className={
              mode === "commitmentLibrary" ? "df-secondary-button is-active" : "df-secondary-button"
            }
            onClick={onOpenCommitmentLibrary}
            type="button"
          >
            Commitment Library
          </button>
          <button
            aria-pressed={mode === "workPattern"}
            className={
              mode === "workPattern" ? "df-secondary-button is-active" : "df-secondary-button"
            }
            onClick={onOpenWorkPattern}
            type="button"
          >
            Work Pattern
          </button>
          <button
            aria-pressed={mode === "schedule"}
            className={
              mode === "schedule" ? "df-secondary-button is-active" : "df-secondary-button"
            }
            onClick={onOpenSchedule}
            type="button"
          >
            Review Schedule
          </button>
        </nav>
        <p className={isSetupDirty ? "df-warning-message" : "df-support"}>
          {isSetupDirty
            ? "Plan has unsaved changes. Schedule actions continue to use the saved plan."
            : previewState === "stale"
              ? "Schedule needs refresh because the saved planning setup changed."
              : previewState === "current"
                ? "Schedule is up to date."
                : "Generate a schedule to review how your commitments fit together."}
        </p>
      </section>
      {mode === "month"
        ? monthContent
        : mode === "workPattern"
          ? workPatternContent
          : mode === "commitmentLibrary"
            ? commitmentLibraryContent
            : scheduleContent}
    </main>
  );
}
