import { createInitialDayFrameState } from "../../state/createInitialDayFrameState.js";
import { requirement } from "./sleepTestFixtures.js";
import { deriveFoundationalSchedule } from "../planning/deriveFoundationalSchedule.js";
import { materializePlanPublication } from "../historicalPlan/materializePlanPublication.js";
import type { SleepFoundationAuthority } from "./sleepFoundationalOccupancy.js";
import type { DayFramePreview } from "../../state/types.js";
import type { LocalDateString } from "../shifts/types.js";
const authority: SleepFoundationAuthority = {
  status: "complete",
  planDecisions: [],
  realizedFacts: [],
  composition: { authority: { version: 1, relationships: [], decisions: [] }, sources: [] },
};
export function fixture(
  day: LocalDateString = "2026-09-17",
  startClock: "22:00" | "00:00" = "22:00",
) {
  const state = createInitialDayFrameState({
    schedulingPreferences: { dayBoundaryStartTime: "00:00", weekStartsOn: "monday" },
  });
  state.sleepRequirements = [
    {
      ...requirement(),
      durationMinutes: 120,
      bufferBeforeMinutes: 30,
      bufferAfterMinutes: 30,
      window: { kind: "clock", startClock, endClock: "08:00" },
    },
  ];
  const end = new Date(Date.parse(day) + 86400000).toISOString().slice(0, 10) as LocalDateString;
  const generatedAt = "2026-09-16T00:00:00.000Z";
  const schedule = deriveFoundationalSchedule({
    authoredState: state,
    authority,
    ownerRange: { startUserDayDate: day, endUserDayDateExclusive: end },
    generatedAt,
  }).schedule;
  const preview = {
    rangeStartDate: day,
    rangeEndDate: day,
    generatedAt,
    isStale: false,
    result: schedule,
  } as DayFramePreview;
  const input = {
    authoredSetup: state,
    sleepAuthority: structuredClone(authority),
    preview,
    providers: {
      allocateBatchId: () => `00000000-0000-4000-8000-0000000000${day.slice(-2)}` as never,
      now: () => `${day}T00:00:00.000Z`,
    },
  };
  return input;
}
export function published(input = fixture()) {
  const result = materializePlanPublication(input);
  if (result.status !== "materialized") throw Error(JSON.stringify(result));
  return result.batch;
}
