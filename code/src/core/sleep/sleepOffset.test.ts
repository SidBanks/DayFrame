import { afterAll, beforeAll, expect, it } from "vitest";
import { createInitialDayFrameState } from "../../state/createInitialDayFrameState.js";
import { requirement } from "./sleepTestFixtures.js";
import { resolveRequiredSleep } from "./resolveRequiredSleep.js";
import type { LocalDateString } from "../shifts/types.js";
const prior = process.env.TZ;
beforeAll(() => {
  process.env.TZ = "America/Chicago";
});
afterAll(() => {
  if (prior === undefined) delete process.env.TZ;
  else process.env.TZ = prior;
});
function query(day: LocalDateString, end: LocalDateString, duration: number) {
  const state = createInitialDayFrameState({
    schedulingPreferences: { dayBoundaryStartTime: "00:00", weekStartsOn: "monday" },
  });
  state.sleepRequirements = [
    {
      ...requirement(),
      effectiveFrom: day,
      effectiveUntilExclusive: end,
      durationMinutes: duration,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      window: { kind: "clock", startClock: "00:00", endClock: "00:00" },
    },
  ];
  return resolveRequiredSleep({
    authoredState: state,
    ownerRange: { startUserDayDate: day, endUserDayDateExclusive: end },
    authority: {
      status: "complete",
      planDecisions: [],
      realizedFacts: [],
      composition: { authority: { version: 1, relationships: [], decisions: [] }, sources: [] },
    },
  });
}
it("full civil day may be 23 hours: exact elapsed 24 hours is infeasible", () => {
  expect(new Date("2026-03-08T12:00:00").getTimezoneOffset()).toBe(300);
  const r = query("2026-03-08", "2026-03-09", 1440);
  expect(r.status).toBe("infeasible");
  if (r.status === "infeasible") expect(r.conflicts[0]!.category).toBe("emptyPhysicalDomain");
});
it("25-hour fold day preserves elapsed duration and enumerates physical minutes", () => {
  const r = query("2026-11-01", "2026-11-02", 1440);
  expect(r.status).toBe("satisfied");
  if (r.status !== "satisfied") return;
  expect(r.search.candidateCount).toBe(61);
  expect(Date.parse(r.occurrences[0]!.sleepEnd) - Date.parse(r.occurrences[0]!.sleepStart)).toBe(
    1440 * 60000,
  );
  expect(r.requiredOccurrences[0]!.derivationContext.offsetMinutes).toEqual([300, 360]);
});

it("a skipped civil label is incomplete temporal context, not infeasibility", () => {
  process.env.TZ = "Pacific/Apia";
  try {
    expect(query("2011-12-30", "2011-12-31", 60).status).toBe("contextIncomplete");
  } finally {
    process.env.TZ = "America/Chicago";
  }
});
