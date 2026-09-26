import type { ActiveDayFrameAuthoredSetup } from "../../state/types.js";
import { createCurrentActive as createActiveV3 } from "../../state/activeV4.js";
import { generateCycleWorkBlocks } from "../cycles/generateCycleWorkBlocks.js";
import { addUserDayLabels, resolveUserDayWindowForLabel } from "../time/canonicalUserDay.js";
import { isSleepOwnerDate } from "./sleepRequirement.js";
import { deriveSleepOccurrence, interval } from "./deriveSleepOccurrences.js";
import {
  deriveSleepBlockingOccupancy,
  SleepContextIncompleteError,
  type SleepFoundationAuthority,
} from "./sleepFoundationalOccupancy.js";
import { solveSleepPlacementAuthority } from "./sleepPlacementAuthority.js";
import type { SleepOccurrenceV1, SleepOwnerRange, SleepResolutionV1 } from "./sleepResolution.js";

export type ResolveRequiredSleepInput = {
  authoredState: ActiveDayFrameAuthoredSetup;
  ownerRange: SleepOwnerRange;
  authority: SleepFoundationAuthority;
  budget?: number;
};
/** Finite H plus directly intersecting guard domains, with complete authoritative snapshots. */
export function resolveRequiredSleep(input: ResolveRequiredSleepInput): SleepResolutionV1 {
  const failure = (
    status: "invalid" | "protected" | "contextIncomplete",
    reason: string,
  ): SleepResolutionV1 => ({
    version: 1,
    status,
    reason,
    ownerRange: structuredClone(input.ownerRange),
  });
  if (input.authority.status === "protected")
    return failure("protected", "Protected foundational authority");
  if (input.authority.status !== "complete")
    return failure("contextIncomplete", "Foundational authority coverage unavailable");
  try {
    const state = createActiveV3(input.authoredState).data;
    const range = input.ownerRange;
    if (
      !isSleepOwnerDate(range.startUserDayDate) ||
      !isSleepOwnerDate(range.endUserDayDateExclusive) ||
      range.startUserDayDate >= range.endUserDayDateExclusive
    )
      return failure("invalid", "Invalid owner range");
    const count =
      (Date.parse(range.endUserDayDateExclusive) - Date.parse(range.startUserDayDate)) / 86_400_000;
    if (count > 366)
      return failure("contextIncomplete", "Supported query limit is 366 owner labels");
    const resolver = {
      shiftCycles: state.shiftCycles,
      defaultSchedulingPreferences: state.schedulingPreferences,
    };
    const start = resolveUserDayWindowForLabel({
      ...resolver,
      userDayDate: range.startUserDayDate,
    }).start;
    const end = resolveUserDayWindowForLabel({
      ...resolver,
      userDayDate: addUserDayLabels(range.endUserDayDateExclusive, -1),
    }).end;
    // Span + owner/civil clock carry + overnight Work + offset safety. Not a one-day view pad.
    // Local offsets are required to be within ±24h; the 6 civil-day allowance covers both extremes.
    const span = Math.max(
      0,
      ...state.sleepRequirements.map((r) => (r.window.kind === "clock" ? 0 : r.window.spanMinutes)),
    );
    const pad = Math.ceil(span / 1440) + 6;
    const first = addUserDayLabels(range.startUserDayDate, -pad),
      last = addUserDayLabels(range.endUserDayDateExclusive, pad);
    const workStart = new Date(`${addUserDayLabels(first, -pad)}T00:00:00`),
      workEnd = new Date(`${addUserDayLabels(last, pad)}T00:00:00`);
    for (let day = new Date(workStart); day <= workEnd; day.setDate(day.getDate() + 1))
      if (Math.abs(day.getTimezoneOffset()) > 1440)
        throw new SleepContextIncompleteError("Unsupported timezone offset");
    const work = generateCycleWorkBlocks({
      shiftDefinitions: state.shiftDefinitions,
      shiftCycles: state.shiftCycles,
      defaultSchedulingPreferences: state.schedulingPreferences,
      planningWindowStart: workStart,
      planningWindowEnd: workEnd,
    });
    const occurrences: SleepOccurrenceV1[] = [];
    for (let label = first; label < last; label = addUserDayLabels(label, 1)) {
      const requested = label >= range.startUserDayDate && label < range.endUserDayDateExclusive;
      const occurrence = deriveSleepOccurrence(
        state,
        label,
        work,
        requested ? "requested" : "guard",
      );
      if (!occurrence) continue;
      const w = occurrence.derivationContext.physicalWindow;
      if (
        requested ||
        (Date.parse(w.startsAt) < end.getTime() && Date.parse(w.endsAt) > start.getTime())
      )
        occurrences.push(occurrence);
    }
    const physical = interval(
      new Date(
        Math.min(
          start.getTime(),
          ...occurrences.map((o) => Date.parse(o.derivationContext.physicalWindow.startsAt)),
        ),
      ),
      new Date(
        Math.max(
          end.getTime(),
          ...occurrences.map((o) => Date.parse(o.derivationContext.physicalWindow.endsAt)),
        ),
      ),
    );
    if (
      Date.parse(physical.startsAt) < workStart.getTime() ||
      Date.parse(physical.endsAt) > workEnd.getTime()
    )
      throw new SleepContextIncompleteError("Work coverage does not cover full Sleep domains");
    const occupancy = deriveSleepBlockingOccupancy(state, work, input.authority, physical);
    return solveSleepPlacementAuthority(
      {
        ownerRange: range,
        occurrences,
        occupancy,
        physicalContext: physical,
        ...(input.budget === undefined ? {} : { budget: input.budget }),
        configured: state.sleepRequirements.length > 0,
      },
      input.authority.planDecisions,
    );
  } catch (error) {
    return failure(
      error instanceof SleepContextIncompleteError ||
        (error instanceof Error &&
          /Unresolvable|Canonical user-day|Instant is not bracketed|Invalid time value|Invalid local date string/.test(
            error.message,
          ))
        ? "contextIncomplete"
        : "invalid",
      error instanceof Error ? error.message : "Invalid Sleep inputs",
    );
  }
}
