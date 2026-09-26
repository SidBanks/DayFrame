import { useState } from "react";
import type { DayFrameStore } from "../state/types.js";
import { discoverLegacySleep } from "../core/sleep/legacySleepConversion.js";
import type { ConversionReview, ConversionRequest } from "../core/sleep/legacySleepConversion.js";
import type { SleepRequirementIntentV1 } from "../core/sleep/sleepRequirement.js";
import { addUserDayLabels } from "../core/time/canonicalUserDay.js";
export type LegacySleepConversionStore = Pick<
  DayFrameStore,
  "getState" | "reviewLegacySleepConversion" | "convertLegacySleepToFirstClass"
>;
export function LegacySleepConversionSection({
  store,
  disabled = false,
}: {
  store: LegacySleepConversionStore;
  disabled?: boolean;
}) {
  const candidates = discoverLegacySleep(store.getState());
  const [selected, setSelected] = useState("");
  const [cutover, setCutover] = useState("");
  const [kind, setKind] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [preferred, setPreferred] = useState("");
  const [span, setSpan] = useState("");
  const [review, setReview] = useState<ConversionReview | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const candidate = candidates.find((c) => c.recurrence.incarnationId === selected);
  const invalidate = () => {
    setReview(null);
    setConfirmed(false);
    setMessage("");
  };
  async function reviewConversion() {
    if (!candidate) return;
    setBusy(true);
    setMessage("");
    try {
      const { template: t, recurrence: r } = candidate;
      const clock = {
        startClock: start,
        endClock: end,
        ...(preferred ? { preferredStartClock: preferred } : {}),
      };
      const intent = {
        enabled: true,
        effectiveFrom: cutover,
        ...(r.endsOnDate ? { effectiveUntilExclusive: addUserDayLabels(r.endsOnDate, 1) } : {}),
        weekdays: r.frequency === "daily" ? "all" : r.weekdays,
        durationMinutes: t.durationMinutes,
        bufferBeforeMinutes: t.bufferBeforeMinutes ?? 0,
        bufferAfterMinutes: t.bufferAfterMinutes ?? 0,
        window:
          kind === "clock"
            ? { kind, ...clock }
            : { kind, spanMinutes: span ? Number(span) : NaN, offDay: clock },
      } as SleepRequirementIntentV1;
      const request: ConversionRequest = {
        selection: candidate.selection,
        cutover: cutover as ConversionRequest["cutover"],
        ...(kind && start && end ? { intent } : {}),
      };
      setReview(await store.reviewLegacySleepConversion(request));
      setConfirmed(false);
    } catch {
      setMessage("The review could not be loaded. Try again.");
    } finally {
      setBusy(false);
    }
  }
  async function convert() {
    if (!review || !confirmed || disabled) return;
    setBusy(true);
    try {
      const result = await store.convertLegacySleepToFirstClass({
        request: review.request,
        expectedFingerprint: review.fingerprint,
        commandId: crypto.randomUUID(),
        confirmed: true,
      });
      setMessage(
        result.status === "rejected"
          ? result.reason
          : "Converted and saved. Regenerate planning to see required Sleep; publish it when ready. Past history is unchanged.",
      );
      setReview(null);
      setConfirmed(false);
    } catch {
      setMessage("Conversion could not be completed. Review the saved setup before retrying.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section aria-label="Convert legacy Sleep setup">
      <h2>Convert legacy Sleep setup</h2>
      <p>
        Your existing Sleep schedule may use DayFrame’s older scheduling model. Review it before
        converting to required Sleep. Past Sleep history will not be changed.
      </p>
      {disabled && <p>Save or discard your unsaved setup changes before converting.</p>}
      {!candidates.length ? (
        <p>No legacy Sleep schedules found.</p>
      ) : (
        <fieldset disabled={disabled || busy}>
          <label>
            Old Sleep schedule
            <select
              value={selected}
              onChange={(e) => {
                invalidate();
                setSelected(e.target.value);
                const c = candidates.find((c) => c.recurrence.incarnationId === e.target.value);
                const t = c?.template;
                setKind(
                  t?.preferredWindow === "beforeWork" || t?.preferredWindow === "afterWork"
                    ? t.preferredWindow
                    : t?.preferredWindow === "custom"
                      ? "clock"
                      : "",
                );
                setStart(t?.customWindowStartTime ?? "");
                setEnd(t?.customWindowEndTime ?? "");
                setPreferred(t?.fixedStartTime ?? "");
                setSpan("");
              }}
            >
              <option value="">Choose a schedule</option>
              {candidates.map((c) => (
                <option key={c.recurrence.incarnationId} value={c.recurrence.incarnationId}>
                  {c.title} — {c.recurrence.id}
                </option>
              ))}
            </select>
          </label>
          {candidate && (
            <>
              <p>
                {candidate.template.durationMinutes} minutes;{" "}
                {candidate.template.bufferBeforeMinutes ?? 0} minutes before and{" "}
                {candidate.template.bufferAfterMinutes ?? 0} after. Repeats:{" "}
                {candidate.recurrence.frequency}
                {candidate.recurrence.weekdays
                  ? ` (${candidate.recurrence.weekdays.join(", ")})`
                  : ""}
                . Starts: {candidate.recurrence.startsOnDate ?? "no start limit"}; ends:{" "}
                {candidate.recurrence.endsOnDate ?? "no end limit"}. Legacy priority{" "}
                {candidate.template.priority} will not carry over.
              </p>
              <details>
                <summary>Technical source details</summary>
                <pre>{JSON.stringify(candidate, null, 2)}</pre>
              </details>
              <label>
                Start required Sleep on user day
                <input
                  type="date"
                  value={cutover}
                  onChange={(e) => {
                    invalidate();
                    setCutover(e.target.value);
                  }}
                />
              </label>
              <label>
                Required Sleep window
                <select
                  value={kind}
                  onChange={(e) => {
                    invalidate();
                    setKind(e.target.value);
                  }}
                >
                  <option value="">Choose a window</option>
                  <option value="clock">Clock window</option>
                  <option value="beforeWork">Before Work</option>
                  <option value="afterWork">After Work</option>
                </select>
              </label>
              {kind && kind !== "clock" && (
                <label>
                  Work-relative window span (minutes)
                  <input
                    type="number"
                    min="1"
                    value={span}
                    onChange={(e) => {
                      invalidate();
                      setSpan(e.target.value);
                    }}
                  />
                </label>
              )}
              <p>{kind === "clock" ? "Legal clock window" : "Required off-day fallback window"}</p>
              <label>
                Window start
                <input
                  type="time"
                  value={start}
                  onChange={(e) => {
                    invalidate();
                    setStart(e.target.value);
                  }}
                />
              </label>
              <label>
                Window end
                <input
                  type="time"
                  value={end}
                  onChange={(e) => {
                    invalidate();
                    setEnd(e.target.value);
                  }}
                />
              </label>
              <label>
                Preferred start (optional)
                <input
                  type="time"
                  value={preferred}
                  onChange={(e) => {
                    invalidate();
                    setPreferred(e.target.value);
                  }}
                />
              </label>
              <button type="button" onClick={() => void reviewConversion()}>
                Review conversion
              </button>
            </>
          )}
          {review && (
            <div aria-label="Conversion review">
              <p>
                {review.status === "convertible" ? "Ready for your confirmation" : review.status}
              </p>
              {review.reasons.map((reason) => (
                <p key={reason}>{reason}</p>
              ))}
              {review.proposed && (
                <>
                  <p>
                    Required Sleep: {review.proposed.durationMinutes} minutes, with{" "}
                    {review.proposed.bufferBeforeMinutes} minutes before and{" "}
                    {review.proposed.bufferAfterMinutes} after. Window:{" "}
                    {review.proposed.window.kind === "clock"
                      ? `${review.proposed.window.startClock}–${review.proposed.window.endClock}`
                      : `${review.proposed.window.spanMinutes} minutes ${review.proposed.window.kind === "beforeWork" ? "before Work" : "after Work"}; off days ${review.proposed.window.offDay.startClock}–${review.proposed.window.offDay.endClock}`}
                    . Applies:{" "}
                    {review.proposed.weekdays === "all"
                      ? "every user day"
                      : review.proposed.weekdays.join(", ")}
                    . Ends:{" "}
                    {review.proposed.effectiveUntilExclusive
                      ? `before ${review.proposed.effectiveUntilExclusive}`
                      : "no end limit"}
                    .
                  </p>
                  <p>
                    From {review.proposed.effectiveFrom}, this old schedule will stop generating
                    occurrences and required Sleep will begin with the duration, buffers, weekdays
                    and window shown above. Past published schedules and reported Sleep stay
                    unchanged. Conversion does not publish or report Sleep.
                  </p>
                  <label>
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                    />
                    I confirm this future change and the reviewed required Sleep window.
                  </label>
                  <button
                    type="button"
                    disabled={!confirmed || review.status !== "convertible"}
                    onClick={() => void convert()}
                  >
                    Confirm conversion
                  </button>
                </>
              )}
              {review.conversion && (
                <p>
                  Converted from {review.conversion.cutover}. The original conversion record is
                  retained.
                </p>
              )}
            </div>
          )}
        </fieldset>
      )}
      {message && <p role="status">{message}</p>}
    </section>
  );
}
