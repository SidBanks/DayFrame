import type { FrictionPoint } from "../core/friction/types.js";
import type { DayFramePreview } from "../state/types.js";
import type { GoalEditingContext } from "./goalEditingContext.js";
import { useGoalEditingState } from "./useGoalEditingState.js";

/** Group only when the Preview carries exact source-lifetime evidence. */
export function groupReviewConflicts(preview: DayFramePreview) {
  const groups = new Map<string, FrictionPoint[]>();
  const blocks = [...preview.result.scheduledBlocks, ...preview.result.unplacedCandidates];
  for (const point of preview.result.frictionPoints.filter((point) => !point.ignored)) {
    const sources = point.affectedBlockIds.map(
      (id) => blocks.find((block) => block.id === id)?.commitmentNavigationIdentity,
    );
    const key =
      point.kind && sources.length && sources.every(Boolean)
        ? JSON.stringify([
            point.kind,
            sources,
            [...new Set(point.suggestedFixes.map((fix) => fix.action))].sort(),
          ])
        : JSON.stringify(["occurrence", point.id]);
    const group = groups.get(key) ?? [];
    group.push(point);
    groups.set(key, group);
  }
  return [...groups].map(([key, occurrences]) => ({ key, occurrences }));
}

export function ReviewConflicts({
  preview,
  context,
  onTry,
  onInspect,
}: {
  preview: DayFramePreview | null;
  context: GoalEditingContext;
  onTry: (input: { selectedFrictionPointId: string; selectedSuggestedFixId: string }) => void;
  onInspect: (day?: string) => void;
}) {
  const [view, update] = useGoalEditingState(context, "review-conflicts", () => ({
    limit: 10,
    filter: "",
    day: "",
    selected: {} as Record<string, string>,
  }));
  if (!preview) return null;
  const groups = groupReviewConflicts(preview)
    .map(({ key, occurrences }) => ({
      key,
      occurrences: occurrences.filter(
        (point) =>
          (!view.filter ||
            point.title.toLocaleLowerCase().includes(view.filter.toLocaleLowerCase())) &&
          (!view.day || point.affectedUserDayDate === view.day),
      ),
    }))
    .filter(({ occurrences }) => occurrences.length > 0);
  return (
    <section className="df-panel" aria-labelledby="review-conflicts-heading">
      <h3 id="review-conflicts-heading" tabIndex={-1}>
        Conflicts and corrective decisions
      </h3>
      <p>
        Try one exact occurrence, inspect the result, then explicitly accept. Similar conflicts are
        separate decisions.
      </p>
      {preview.isStale && (
        <p role="status">
          The generated schedule changed. Generate an updated schedule before trying a correction.
        </p>
      )}
      <div className="df-history-range">
        <label className="df-field">
          Filter conflicts by subject
          <input value={view.filter} onChange={(event) => update({ filter: event.target.value })} />
        </label>
        <label className="df-field">
          Filter conflicts by day
          <input
            type="date"
            value={view.day}
            onChange={(event) => update({ day: event.target.value })}
          />
        </label>
      </div>
      <p>
        {groups.length} matching conflict groups. Filters do not change acceptance or Build scope.
      </p>
      <ul className="df-plain-list">
        {groups.slice(0, view.limit).map(({ key, occurrences }) => {
          const selected =
            occurrences.find((point) => point.id === view.selected[key]) ?? occurrences[0]!;
          const dates = occurrences
            .flatMap((point) => (point.affectedUserDayDate ? [point.affectedUserDayDate] : []))
            .sort();
          return (
            <li className="df-list-card" key={key}>
              <strong>{selected.title}</strong>
              <p>
                {occurrences.length} occurrence{occurrences.length === 1 ? "" : "s"}
                {dates.length
                  ? `; ${dates[0]} through ${dates.at(-1)}`
                  : "; inspect exact source context below"}
                .
              </p>
              {occurrences.length > 1 && (
                <label className="df-field">
                  Occurrence to inspect
                  <select
                    value={selected.id}
                    onChange={(event) =>
                      update({ selected: { ...view.selected, [key]: event.target.value } })
                    }
                  >
                    {occurrences.map((point) => (
                      <option key={point.id} value={point.id}>
                        {point.affectedUserDayDate ?? point.id}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <p>{selected.message}</p>
              <div className="df-screen-actions">
                {selected.suggestedFixes.map((fix) => (
                  <button
                    className="df-secondary-button"
                    type="button"
                    key={fix.id}
                    disabled={preview.isStale}
                    onClick={() => {
                      onTry({
                        selectedFrictionPointId: selected.id,
                        selectedSuggestedFixId: fix.id,
                      });
                      onInspect(
                        fix.sleepPlacement?.target.sourceKind === "sleepRequirement"
                          ? fix.sleepPlacement.target.coordinate.userDayDate
                          : selected.affectedUserDayDate,
                      );
                    }}
                  >
                    Try: {fix.label}
                  </button>
                ))}
                <button
                  className="df-secondary-button"
                  type="button"
                  onClick={() => onInspect(selected.affectedUserDayDate)}
                >
                  Inspect occurrence and source
                </button>
              </div>
              {!selected.suggestedFixes.length && (
                <p>
                  No supported correction is available. Inspect the source and its existing editor.
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {groups.length > view.limit && (
        <button
          type="button"
          className="df-secondary-button"
          onClick={() => update({ limit: view.limit + 10 })}
        >
          Show more conflicts
        </button>
      )}
    </section>
  );
}
