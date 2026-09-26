import type { DayFramePreview } from "../state/types.js";
import { formatHumanTimeRange } from "./timeDisplay.js";

export type ReviewTrialContext = {
  original: DayFramePreview;
  frictionId: string;
  fixId: string;
};

export function ReviewTrial({
  trial,
  current,
  onDiscard,
}: {
  trial: ReviewTrialContext;
  current: DayFramePreview;
  onDiscard: () => void;
}) {
  const point = trial.original.result.frictionPoints.find((point) => point.id === trial.frictionId);
  const fix = point?.suggestedFixes.find((fix) => fix.id === trial.fixId);
  if (!point || !fix) return null;
  const sleep =
    fix.sleepPlacement?.target.sourceKind === "sleepRequirement" ? fix.sleepPlacement : undefined;
  return (
    <section className="df-panel" aria-label="Provisional correction">
      <h3>Inspect this Try</h3>
      <p>
        {point.title}: {fix.label}. This is provisional until you explicitly apply the planning
        change.
      </p>
      {current.isStale && (
        <p role="alert">
          Saved sources changed. Generate an updated schedule and Try again before accepting.
        </p>
      )}
      {sleep && sleep.target.sourceKind === "sleepRequirement" ? (
        <>
          <p>
            Sleep owner day: {sleep.target.coordinate.userDayDate}. Required duration:{" "}
            {sleep.payload.durationMinutes} minutes, continuously; protection before:{" "}
            {sleep.payload.bufferBeforeMinutes} minutes; after: {sleep.payload.bufferAfterMinutes}{" "}
            minutes.
          </p>
          <p>
            Before Try: {trial.original.result.foundation?.sleep?.status ?? "unavailable"}. After
            Try: {current.result.foundation?.sleep?.status ?? "unavailable"}.
          </p>
          <p>
            Proposed Sleep:{" "}
            {formatHumanTimeRange(
              new Date(sleep.payload.sleepStart),
              new Date(sleep.payload.sleepEnd),
            )}
            . Full protected footprint:{" "}
            {formatHumanTimeRange(
              new Date(sleep.payload.footprintStart),
              new Date(sleep.payload.footprintEnd),
            )}
            .
          </p>
          <p>
            The existing Sleep command rechecks the exact occurrence, requirement, lawful window and
            complete protection before acceptance.
          </p>
        </>
      ) : (
        <>
          {(
            [
              ["Before Try", trial.original],
              ["After Try", current],
            ] as const
          ).map(([label, snapshot]) => (
            <div key={label}>
              <h4>{label}</h4>
              <ul>
                {point.affectedBlockIds.map((id) => {
                  const block = [
                    ...snapshot.result.scheduledBlocks,
                    ...snapshot.result.generatedWorkBlocks,
                  ].find((block) => block.id === id);
                  const unplaced = snapshot.result.unplacedCandidates.find(
                    (block) => block.id === id,
                  );
                  return (
                    <li key={id}>
                      {block
                        ? `${block.title}: ${block.userDayDate}, ${formatHumanTimeRange(block.startsAt, block.endsAt)}`
                        : unplaced
                          ? `${unplaced.title}: not placed`
                          : "Placement evidence for this occurrence is unavailable in this snapshot."}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </>
      )}
      <details>
        <summary>Exact correction evidence</summary>
        <p>
          Conflict: {trial.frictionId}; option: {trial.fixId}.
        </p>
        {sleep?.target.sourceKind === "sleepRequirement" && (
          <p>
            Requirement: {sleep.target.requirement.id}; lifetime:{" "}
            {sleep.target.requirement.incarnationId}.
          </p>
        )}
      </details>
      <button type="button" className="df-secondary-button" onClick={onDiscard}>
        Discard Try and regenerate
      </button>
    </section>
  );
}
