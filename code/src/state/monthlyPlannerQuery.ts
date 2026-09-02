import { resolveUserDayContainingInstant } from "../core/time/canonicalUserDay.js";
import {
  queryMonthlyPlanner,
  type DisplayedMonth,
  type MonthlyPlannerQueryResult,
} from "../core/monthlyPlanner/queryMonthlyPlanner.js";
import type { LocalDateString } from "../core/shifts/types.js";
import type { DayFrameReadiness } from "./dayFrameReadiness.js";
import type { DayFrameState } from "./types.js";

export type MonthlyPlannerView = {
  displayedMonth: DisplayedMonth;
  selectedLabel: LocalDateString;
};

export function getInitialMonthlyPlannerView(
  state: DayFrameState,
  evaluationInstant: Date,
): MonthlyPlannerView {
  const current = resolveUserDayContainingInstant({
    shiftCycles: state.shiftCycles,
    defaultSchedulingPreferences: state.schedulingPreferences,
    instant: evaluationInstant,
  }).userDayDate;
  return { displayedMonth: current.slice(0, 7) as DisplayedMonth, selectedLabel: current };
}

export function queryMonthlyPlannerFromState(input: {
  state: DayFrameState;
  readiness: DayFrameReadiness;
  evaluationInstant: Date;
  displayedMonth: DisplayedMonth;
  selectedLabel: LocalDateString;
}): MonthlyPlannerQueryResult {
  return queryMonthlyPlanner({
    displayedMonth: input.displayedMonth,
    selectedLabel: input.selectedLabel,
    evaluationInstant: input.evaluationInstant,
    temporal: {
      defaultSchedulingPreferences: input.state.schedulingPreferences,
      shiftCycles: input.state.shiftCycles,
    },
    planningRange: input.state.previewRange,
    preview: input.state.preview,
    manualEvents: input.state.manualEvents,
    currentCommitmentSources: {
      templates: input.state.blockTemplates,
      recurrences: input.state.blockRecurrences,
    },
    availability:
      input.readiness.status === "protected"
        ? "protected"
        : input.readiness.status === "initializing"
          ? "unavailable"
          : "available",
  });
}
