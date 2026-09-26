import type { DayFrameState } from "../state/types.js";
export function MyScheduleSurface({
  state,
  dirty,
  onWork,
  onSleep,
  onCommitments,
  onReview,
}: {
  state: DayFrameState;
  dirty: boolean;
  onWork: () => void;
  onSleep: () => void;
  onCommitments: () => void;
  onReview: () => void;
}) {
  const sleep = (state.sleepRequirements ?? []).reduce<
    NonNullable<DayFrameState["sleepRequirements"]>[number] | undefined
  >((a, b) => (!a || b.revision > a.revision ? b : a), undefined);
  const rotations = state.shiftCycles.filter((c) => c.mode === "repeatingSequence").length;
  return (
    <section className="df-panel df-my-schedule" aria-labelledby="my-schedule-heading">
      <h2 id="my-schedule-heading">My Schedule</h2>
      <p>
        Your recurring authored schedule. Save changes here, then review their effect in Review
        Plan.
      </p>
      {dirty && (
        <p role="status">
          Work or Commitment changes are in your setup draft and have not been saved. These
          summaries describe saved sources.
        </p>
      )}
      <div className="df-schedule-domains">
        <article>
          <h3>Work Pattern</h3>
          <p>
            {state.shiftDefinitions.length} shift definitions · {rotations} repeating rotations ·{" "}
            {state.shiftCycles.length - rotations} dated periods.
          </p>
          <p>
            Default day starts at {state.schedulingPreferences.dayBoundaryStartTime}. Week starts on{" "}
            {state.schedulingPreferences.weekStartsOn}. Dated periods may override these defaults.
          </p>
          <button className="df-secondary-button" onClick={onWork}>
            View / Edit Work Pattern
          </button>
        </article>
        <article>
          <h3>Sleep</h3>
          <p>
            {sleep
              ? `Latest configuration: ${sleep.enabled ? "enabled" : "disabled"} · ${Math.floor(sleep.durationMinutes / 60)} h ${sleep.durationMinutes % 60} min · from ${sleep.effectiveFrom}`
              : "No First-Class Sleep requirement configured."}
          </p>
          <p>
            Required Sleep is separate from Commitments. Its applicable dates and placement are
            reviewed in Sleep.
          </p>
          <button className="df-secondary-button" onClick={onSleep}>
            View / Edit Sleep
          </button>
        </article>
        <article>
          <h3>Commitments</h3>
          <p>
            {state.blockTemplates.filter((t) => t.enabled).length} enabled ·{" "}
            {state.blockTemplates.filter((t) => !t.enabled).length} disabled.
          </p>
          <p>Manage recurring obligations, placement and Work relationships.</p>
          <button className="df-secondary-button" onClick={onCommitments}>
            View / Manage Commitments
          </button>
        </article>
      </div>
      <button className="df-secondary-button" onClick={onReview}>
        Review Schedule
      </button>
      {state.preview?.isStale && (
        <p role="status">Your generated schedule needs review after authored changes.</p>
      )}
    </section>
  );
}
