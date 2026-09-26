import type { SetupDraftEntry } from "./setupDraft.js";
import type { BlockTemplate } from "../core/blocks/types.js";
import { DurationFields } from "./DurationFields.js";
export function CommitmentAdvancedFields({
  entry,
  onChange,
}: {
  entry: SetupDraftEntry;
  onChange: (entry: SetupDraftEntry) => void;
}) {
  const t = entry.template;
  const patch = (p: Partial<BlockTemplate>) => onChange({ ...entry, template: { ...t, ...p } });
  return (
    <details className="df-commitment-advanced">
      <summary>Advanced options for this Commitment</summary>
      <div className="df-form-stack">
        <label className="df-field">
          Placement
          <select
            value={t.placementType}
            onChange={(e) =>
              patch({ placementType: e.target.value as BlockTemplate["placementType"] })
            }
          >
            <option value="flexible">Flexible</option>
            <option value="fixed">Fixed start</option>
          </select>
        </label>
        {(t.placementType === "fixed" || t.fixedStartTime !== undefined) && (
          <label className="df-field">
            Fixed start time
            <input
              type="time"
              value={t.fixedStartTime ?? ""}
              onChange={(e) =>
                patch({
                  fixedStartTime: e.target.value as NonNullable<BlockTemplate["fixedStartTime"]>,
                })
              }
            />
          </label>
        )}
        {(t.preferredWindow === "custom" ||
          t.customWindowStartTime !== undefined ||
          t.customWindowEndTime !== undefined) && (
          <div className="df-grid">
            {(["customWindowStartTime", "customWindowEndTime"] as const).map((key, index) => (
              <label className="df-field" key={key}>
                {index === 0 ? "Custom window start" : "Custom window end"}
                <input
                  type="time"
                  value={t[key] ?? ""}
                  onChange={(e) => patch({ [key]: e.target.value })}
                />
              </label>
            ))}
          </div>
        )}
        <p>
          Clock windows may cross midnight. When changing placement, explicitly clear clock fields
          that no longer apply.
        </p>
        <div className="df-screen-actions">
          <button
            type="button"
            className="df-secondary-button"
            onClick={() => {
              const next = { ...t };
              delete next.fixedStartTime;
              onChange({ ...entry, template: next });
            }}
          >
            Clear fixed start
          </button>
          <button
            type="button"
            className="df-secondary-button"
            onClick={() => {
              const next = { ...t };
              delete next.customWindowStartTime;
              delete next.customWindowEndTime;
              onChange({ ...entry, template: next });
            }}
          >
            Clear custom window
          </button>
        </div>
        <label className="df-checkbox-row">
          <input
            type="checkbox"
            checked={t.requiresWorkAnchor ?? false}
            onChange={(e) => patch({ requiresWorkAnchor: e.target.checked })}
          />
          Requires a Work shift
        </label>
        <label className="df-field">
          Priority
          <select
            value={t.priority}
            onChange={(e) =>
              patch({ priority: Number(e.target.value) as BlockTemplate["priority"] })
            }
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <div className="df-grid">
          <DurationFields
            label="Buffer before"
            value={t.bufferBeforeMinutes ?? 0}
            onChange={(bufferBeforeMinutes) => patch({ bufferBeforeMinutes })}
          />
          <DurationFields
            label="Buffer after"
            value={t.bufferAfterMinutes ?? 0}
            onChange={(bufferAfterMinutes) => patch({ bufferAfterMinutes })}
          />
        </div>
        <label className="df-field">
          Reschedule behavior
          <select
            value={t.rescheduleBehavior}
            onChange={(e) =>
              patch({ rescheduleBehavior: e.target.value as BlockTemplate["rescheduleBehavior"] })
            }
          >
            {["autoSameDay", "autoSameUserWeek", "askUser", "skip"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <div className="df-grid">
          {(["startsOnDate", "endsOnDate"] as const).map((key, index) => (
            <label className="df-field" key={key}>
              {index === 0 ? "Recurrence starts" : "Recurrence ends"}
              <input
                type="date"
                value={entry.recurrence[key] ?? ""}
                onChange={(e) => {
                  const recurrence = { ...entry.recurrence };
                  if (e.target.value)
                    recurrence[key] = e.target.value as NonNullable<typeof recurrence.startsOnDate>;
                  else delete recurrence[key];
                  onChange({ ...entry, recurrence });
                }}
              />
            </label>
          ))}
        </div>
        <p>
          {t.externalResources.length} linked resources retained. Detailed resource editing remains
          available in Advanced Commitment Fields below. Support relationships are preserved
          separately.
        </p>
      </div>
    </details>
  );
}
