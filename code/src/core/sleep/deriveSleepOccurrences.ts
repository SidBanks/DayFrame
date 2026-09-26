import type { ActiveDayFrameAuthoredSetup } from "../../state/types.js";
import type { GeneratedCycleWorkBlock } from "../cycles/types.js";
import { createDurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import { createSleepOccurrenceReference } from "../occurrences/sleepOccurrenceReference.js";
import { resolveUserDayWindowForLabel } from "../time/canonicalUserDay.js";
import { parseTimeString } from "../time/userDay.js";
import type { LocalDateString } from "../shifts/types.js";
import { queryEffectiveSleepRequirement, type SleepClockWindowV1 } from "./sleepRequirement.js";
import type { SleepInterval, SleepOccurrenceV1 } from "./sleepResolution.js";

export const MINUTE = 60_000;
export function localClock(label: LocalDateString, clock: string, nextDay = false): Date {
  const { hours, minutes } = parseTimeString(clock as `${number}:${number}`);
  const date = new Date(`${label}T12:00:00`);
  date.setDate(date.getDate() + Number(nextDay));
  date.setHours(hours, minutes, 0, 0);
  if (!Number.isFinite(date.getTime())) throw new RangeError("Unresolvable local clock");
  return date;
}
export function clockWindow(label: LocalDateString, boundary: string, clock: SleepClockWindowV1) {
  const start = localClock(
    label,
    clock.startClock,
    parseTimeString(clock.startClock).totalMinutes <
      parseTimeString(boundary as `${number}:${number}`).totalMinutes,
  );
  const end = new Date(start);
  const endClock = parseTimeString(clock.endClock);
  end.setHours(endClock.hours, endClock.minutes, 0, 0);
  if (end <= start) end.setDate(end.getDate() + 1);
  const preferred = new Date(start);
  if (clock.preferredStartClock) {
    const value = parseTimeString(clock.preferredStartClock);
    preferred.setHours(value.hours, value.minutes, 0, 0);
    if (preferred < start) preferred.setDate(preferred.getDate() + 1);
  }
  return { start, end, preferred, hasPreference: clock.preferredStartClock !== undefined };
}
export function interval(start: Date, end: Date): SleepInterval {
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start)
    throw new RangeError("Unresolvable temporal interval");
  return { startsAt: start.toISOString(), endsAt: end.toISOString() };
}
export function deriveSleepOccurrence(
  state: ActiveDayFrameAuthoredSetup,
  ownerDay: LocalDateString,
  work: readonly GeneratedCycleWorkBlock[],
  membership: SleepOccurrenceV1["membership"],
): SleepOccurrenceV1 | undefined {
  const effective = queryEffectiveSleepRequirement(state.sleepRequirements ?? [], ownerDay);
  if (effective.status === "invalid") throw new RangeError(effective.reason);
  if (effective.status !== "effective") return undefined;
  const r = effective.requirement;
  const day = resolveUserDayWindowForLabel({
    shiftCycles: state.shiftCycles,
    defaultSchedulingPreferences: state.schedulingPreferences,
    userDayDate: ownerDay,
  });
  const sameOwner = work
    .filter((w) => w.userDayDate === ownerDay)
    .map((w) => {
      if (!w.occurrenceIdentity) throw new RangeError("Missing Work identity");
      const ref = createDurableOccurrenceReference(w.occurrenceIdentity, state);
      if (ref.status !== "created") throw new RangeError("Missing Work lineage");
      return { reference: ref.reference, interval: interval(w.startsAt, w.endsAt) };
    })
    .sort(
      (a, b) =>
        a.interval.startsAt.localeCompare(b.interval.startsAt) ||
        JSON.stringify(a.reference).localeCompare(JSON.stringify(b.reference)),
    );
  const anchor =
    r.window.kind === "afterWork"
      ? [...sameOwner].sort(
          (a, b) =>
            b.interval.endsAt.localeCompare(a.interval.endsAt) ||
            JSON.stringify(a.reference).localeCompare(JSON.stringify(b.reference)),
        )[0]
      : sameOwner[0];
  let start: Date, end: Date, preferred: Date;
  let provenance: SleepOccurrenceV1["derivationContext"]["windowProvenance"] = r.window.kind;
  if (r.window.kind === "clock" || !anchor) {
    const clock = r.window.kind === "clock" ? r.window : r.window.offDay;
    const window = clockWindow(ownerDay, day.dayBoundaryStartTime, clock);
    start = window.start;
    end = window.end;
    preferred = window.hasPreference
      ? window.preferred
      : new Date(start.getTime() + r.bufferBeforeMinutes * MINUTE);
    if (r.window.kind !== "clock") provenance = "offDay";
  } else if (r.window.kind === "beforeWork") {
    end = new Date(anchor.interval.startsAt);
    start = new Date(end.getTime() - r.window.spanMinutes * MINUTE);
    preferred = new Date(end.getTime() - (r.durationMinutes + r.bufferAfterMinutes) * MINUTE);
  } else {
    start = new Date(anchor.interval.endsAt);
    end = new Date(start.getTime() + r.window.spanMinutes * MINUTE);
    preferred = new Date(start.getTime() + r.bufferBeforeMinutes * MINUTE);
  }
  const earliest = start.getTime() + r.bufferBeforeMinutes * MINUTE;
  const latest = end.getTime() - (r.durationMinutes + r.bufferAfterMinutes) * MINUTE;
  if (latest >= earliest)
    preferred = new Date(Math.max(earliest, Math.min(latest, preferred.getTime())));
  return {
    version: 1,
    reference: createSleepOccurrenceReference(r, ownerDay),
    ownerDay,
    membership,
    requirementRevision: r.revision,
    durationMinutes: r.durationMinutes,
    bufferBeforeMinutes: r.bufferBeforeMinutes,
    bufferAfterMinutes: r.bufferAfterMinutes,
    windowIntent: structuredClone(r.window),
    derivationContext: {
      version: 1,
      ownerWindow: interval(day.start, day.end),
      dayBoundaryStartTime: day.dayBoundaryStartTime,
      nextDayBoundaryStartTime: day.nextDayBoundaryStartTime,
      weekStartsOn: day.weekStartsOn,
      work: sameOwner,
      ...(r.window.kind !== "clock" && anchor ? { anchor } : {}),
      offDay: sameOwner.length === 0,
      windowProvenance: provenance,
      physicalWindow: interval(start, end),
      preferredSleepStart: preferred.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offsetMinutes: [start.getTimezoneOffset(), end.getTimezoneOffset()],
      clockPolicy: "localDate-compatible-earlier-fold-forward-gap",
    },
  };
}
