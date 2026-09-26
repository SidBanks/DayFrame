import { lazy, Suspense, useRef, useState } from "react";
import type { DayFrameStore, DayFrameState } from "../state/types.js";
import type {
  SleepRequirementIntentV1,
  SleepRequirementV1,
  SleepClockWindowV1,
} from "../core/sleep/sleepRequirement.js";
import type { Weekday } from "../core/time/types.js";
import { DurationFields, durationLabel } from "./DurationFields.js";
const Legacy = lazy(() =>
  import("./LegacySleepConversionSection.js").then((m) => ({
    default: m.LegacySleepConversionSection,
  })),
);
type Store = Pick<
  DayFrameStore,
  | "getState"
  | "authorSleepRequirement"
  | "queryEffectiveSleepRequirement"
  | "reviewLegacySleepConversion"
  | "convertLegacySleepToFirstClass"
>;
const days: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
function intentOf(h: SleepRequirementV1): SleepRequirementIntentV1 {
  return {
    enabled: h.enabled,
    effectiveFrom: h.effectiveFrom,
    ...(h.effectiveUntilExclusive ? { effectiveUntilExclusive: h.effectiveUntilExclusive } : {}),
    weekdays: structuredClone(h.weekdays),
    durationMinutes: h.durationMinutes,
    bufferBeforeMinutes: h.bufferBeforeMinutes,
    bufferAfterMinutes: h.bufferAfterMinutes,
    window: structuredClone(h.window),
  };
}
export function SleepRequirementSection({
  store,
  state,
  ownerDay,
  setupDirty,
  onReview,
}: {
  store: Store;
  state: DayFrameState;
  ownerDay: string;
  setupDirty: boolean;
  onReview: () => void;
}) {
  const head = (state.sleepRequirements ?? []).reduce<SleepRequirementV1 | undefined>(
    (a, b) => (!a || b.revision > a.revision ? b : a),
    undefined,
  );
  const effective = store.queryEffectiveSleepRequirement(
    ownerDay as SleepRequirementV1["effectiveFrom"],
  );
  const [edit, setEdit] = useState<{
    head: SleepRequirementV1 | undefined;
    intent: SleepRequirementIntentV1;
  } | null>(null);
  const [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [legacy, setLegacy] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const blocked = effective.status === "protected" || effective.status === "invalid";
  const clockSource: SleepClockWindowV1 =
    edit?.intent.window.kind === "clock"
      ? edit.intent.window
      : (edit?.intent.window.offDay ?? { startClock: "22:00", endClock: "08:00" });
  const clock: SleepClockWindowV1 = {
    startClock: clockSource.startClock,
    endClock: clockSource.endClock,
    ...(clockSource.preferredStartClock
      ? { preferredStartClock: clockSource.preferredStartClock }
      : {}),
  };
  function patch(value: Partial<SleepRequirementIntentV1>) {
    if (edit) setEdit({ ...edit, intent: { ...edit.intent, ...value } });
  }
  function patchClock(value: Partial<SleepClockWindowV1>) {
    if (!edit) return;
    const next = { ...clock, ...value };
    if (!next.preferredStartClock) delete next.preferredStartClock;
    patch({
      window:
        edit.intent.window.kind === "clock"
          ? { kind: "clock", ...next }
          : { ...edit.intent.window, offDay: next },
    });
  }
  function begin() {
    setError("");
    setMessage("");
    setEdit({
      head: head ? structuredClone(head) : undefined,
      intent: head
        ? intentOf(head)
        : {
            enabled: true,
            effectiveFrom: ownerDay as SleepRequirementV1["effectiveFrom"],
            weekdays: "all",
            durationMinutes: 480,
            bufferBeforeMinutes: 0,
            bufferAfterMinutes: 0,
            window: { kind: "clock", startClock: "22:00", endClock: "08:00" },
          },
    });
  }
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!edit) return;
    const result = store.authorSleepRequirement({
      id: edit.head?.id ?? crypto.randomUUID(),
      expectedRevision: edit.head?.revision ?? null,
      ...(edit.head ? { expectedIncarnationId: edit.head.incarnationId } : {}),
      intent: edit.intent,
      recordedAt: new Date().toISOString(),
    });
    if (result.status !== "authored") {
      setError(
        result.status === "invalid"
          ? result.reason
          : result.status === "stale"
            ? "Sleep changed while you were editing. Cancel and reopen the latest requirement."
            : "Sleep cannot currently be changed safely.",
      );
      return;
    }
    setEdit(null);
    setError("");
    setMessage(
      result.persistence.status === "persisted"
        ? "Sleep saved. Review planning separately to see its effect."
        : "Sleep updated in this session, but local saving is not confirmed. Check storage status before leaving.",
    );
    heading.current?.focus();
  }
  return (
    <section className="df-panel df-sleep-editor df-my-schedule" aria-labelledby="sleep-heading">
      <h2 id="sleep-heading" ref={heading} tabIndex={-1}>
        Sleep
      </h2>
      <p>
        Required Sleep is not an ordinary Commitment and has no numeric priority. This edits
        recurring intent, not a single night's exception.
      </p>
      <p role="status">
        For {ownerDay}:{" "}
        {effective.status === "effective"
          ? "Configured — placement is evaluated in Review Schedule"
          : effective.status === "notConfigured"
            ? "No Sleep configured"
            : effective.status === "notApplicable"
              ? "Not applicable on this date"
              : effective.status === "disabled"
                ? "Disabled"
                : effective.status === "protected"
                  ? "Sleep information cannot currently be read safely"
                  : "Sleep configuration needs review"}
        .
      </p>
      {head && (
        <div>
          <h3>Latest authored configuration</h3>
          <p>
            {head.enabled ? "Enabled" : "Disabled"} · {durationLabel(head.durationMinutes)} Sleep ·
            before {durationLabel(head.bufferBeforeMinutes)} · after{" "}
            {durationLabel(head.bufferAfterMinutes)}.
          </p>
          <p>
            From {head.effectiveFrom}
            {head.effectiveUntilExclusive
              ? ` until ${head.effectiveUntilExclusive} (exclusive)`
              : " with no end date"}
            . {head.weekdays === "all" ? "Every weekday" : head.weekdays.join(", ")}.
          </p>
          <p>
            {head.window.kind === "clock"
              ? `Clock window ${head.window.startClock}–${head.window.endClock}`
              : `${head.window.kind === "beforeWork" ? "Before" : "After"} Work · ${durationLabel(head.window.spanMinutes)} window · off days ${head.window.offDay.startClock}–${head.window.offDay.endClock}`}
            . Windows crossing midnight retain their next-day meaning.
          </p>
        </div>
      )}
      {message && <p role="status">{message}</p>}
      {!edit ? (
        <button className="df-action-button" disabled={blocked} onClick={begin}>
          {head ? "Edit Sleep requirement" : "Configure Sleep"}
        </button>
      ) : (
        <form
          className="df-form-stack"
          onSubmit={save}
          aria-describedby={error ? "sleep-error" : undefined}
        >
          <h3>{edit.head ? "Edit Sleep requirement" : "Configure Sleep"}</h3>
          <p>
            Changes take effect from the authored date. Earlier revisions and accepted placements
            are retained.
          </p>
          <label className="df-checkbox-row">
            <input
              type="checkbox"
              checked={edit.intent.enabled}
              onChange={(e) => patch({ enabled: e.target.checked })}
            />
            Enabled requirement
          </label>
          <div className="df-grid">
            <DurationFields
              label="Sleep duration"
              value={edit.intent.durationMinutes}
              onChange={(durationMinutes) => patch({ durationMinutes })}
            />
            <DurationFields
              label="Before sleep"
              value={edit.intent.bufferBeforeMinutes}
              onChange={(bufferBeforeMinutes) => patch({ bufferBeforeMinutes })}
            />
            <DurationFields
              label="After sleep"
              value={edit.intent.bufferAfterMinutes}
              onChange={(bufferAfterMinutes) => patch({ bufferAfterMinutes })}
            />
          </div>
          <div className="df-grid">
            <label className="df-field">
              Effective from
              <input
                autoFocus
                type="date"
                required
                value={edit.intent.effectiveFrom}
                onChange={(e) =>
                  patch({ effectiveFrom: e.target.value as SleepRequirementV1["effectiveFrom"] })
                }
              />
            </label>
            <label className="df-field">
              Effective until (exclusive, optional)
              <input
                type="date"
                value={edit.intent.effectiveUntilExclusive ?? ""}
                onChange={(e) => {
                  const next = { ...edit.intent };
                  if (e.target.value)
                    next.effectiveUntilExclusive = e.target
                      .value as SleepRequirementV1["effectiveFrom"];
                  else delete next.effectiveUntilExclusive;
                  setEdit({ ...edit, intent: next });
                }}
              />
            </label>
          </div>
          <fieldset>
            <legend>Applicable weekdays</legend>
            <label className="df-checkbox-row">
              <input
                type="checkbox"
                checked={edit.intent.weekdays === "all"}
                onChange={(e) => patch({ weekdays: e.target.checked ? "all" : [...days] })}
              />
              Every day
            </label>
            {edit.intent.weekdays !== "all" &&
              days.map((day) => (
                <label className="df-checkbox-row" key={day}>
                  <input
                    type="checkbox"
                    checked={edit.intent.weekdays.includes(day)}
                    onChange={(e) =>
                      patch({
                        weekdays: days.filter((d) =>
                          d === day ? e.target.checked : edit.intent.weekdays.includes(d),
                        ),
                      })
                    }
                  />
                  {day}
                </label>
              ))}
          </fieldset>
          <label className="df-field">
            Sleep window
            <select
              value={edit.intent.window.kind}
              onChange={(e) =>
                patch({
                  window:
                    e.target.value === "clock"
                      ? { kind: "clock", ...clock }
                      : {
                          kind: e.target.value as "beforeWork" | "afterWork",
                          spanMinutes:
                            edit.intent.window.kind === "clock"
                              ? Math.max(
                                  600,
                                  edit.intent.durationMinutes +
                                    edit.intent.bufferBeforeMinutes +
                                    edit.intent.bufferAfterMinutes,
                                )
                              : edit.intent.window.spanMinutes,
                          offDay: { ...clock },
                        },
                })
              }
            >
              <option value="clock">Clock-based</option>
              <option value="beforeWork">Before Work</option>
              <option value="afterWork">After Work</option>
            </select>
          </label>
          {edit.intent.window.kind !== "clock" && (
            <DurationFields
              label="Work-relative window"
              value={edit.intent.window.spanMinutes}
              onChange={(spanMinutes) => {
                if (edit.intent.window.kind !== "clock")
                  patch({ window: { ...edit.intent.window, spanMinutes } });
              }}
            />
          )}
          <fieldset>
            <legend>
              {edit.intent.window.kind === "clock" ? "Clock window" : "Off-day fallback window"}
            </legend>
            <div className="df-grid">
              <label className="df-field">
                Window start
                <input
                  type="time"
                  required
                  value={clock.startClock}
                  onChange={(e) =>
                    patchClock({ startClock: e.target.value as SleepClockWindowV1["startClock"] })
                  }
                />
              </label>
              <label className="df-field">
                Window end
                <input
                  type="time"
                  required
                  value={clock.endClock}
                  onChange={(e) =>
                    patchClock({ endClock: e.target.value as SleepClockWindowV1["endClock"] })
                  }
                />
              </label>
              <label className="df-field">
                Preferred start (optional)
                <input
                  type="time"
                  value={clock.preferredStartClock ?? ""}
                  onChange={(e) =>
                    patchClock({
                      preferredStartClock: e.target.value as SleepClockWindowV1["startClock"],
                    })
                  }
                />
              </label>
            </div>
          </fieldset>
          {error && (
            <p id="sleep-error" role="alert">
              {error}
            </p>
          )}
          <div className="df-screen-actions">
            <button className="df-action-button" disabled={blocked} type="submit">
              Save Sleep
            </button>
            <button
              className="df-secondary-button"
              type="button"
              onClick={() => {
                setEdit(null);
                setError("");
                heading.current?.focus();
              }}
            >
              Cancel Sleep edits
            </button>
          </div>
        </form>
      )}
      <details>
        <summary>Placement and older Sleep Commitments</summary>
        <p>
          Accepted placements choose a lawful time for an occurrence. Changing this requirement does
          not remove them. Review stale placements and revoke them explicitly in Review Schedule.
        </p>
        <button className="df-secondary-button" onClick={onReview}>
          Review Sleep placements
        </button>
        <p>
          Legacy Sleep Commitments remain separate until explicitly reviewed and converted.
          Conversion changes the future and preserves the past.
        </p>
        <button
          className="df-secondary-button"
          aria-expanded={legacy}
          onClick={() => setLegacy((v) => !v)}
        >
          Review legacy Sleep conversion
        </button>
        {legacy && (
          <Suspense fallback={<p role="status">Loading conversion…</p>}>
            <Legacy store={store} disabled={setupDirty || !!edit} />
          </Suspense>
        )}
      </details>
    </section>
  );
}
