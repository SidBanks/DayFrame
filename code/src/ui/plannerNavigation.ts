import { useState } from "react";
import { resolveUserDayContainingInstant } from "../core/time/canonicalUserDay.js";
import type { DayFrameState } from "../state/types.js";
import type { MonthlyPlannerView } from "../state/monthlyPlannerQuery.js";

export type PrimarySurface = "planner" | "summary";
export type PlannerMode =
  | "month"
  | "mySchedule"
  | "sleep"
  | "workPattern"
  | "commitmentLibrary"
  | "goals"
  | "schedule"
  | "today"
  | "day";
export type NavigationDestination = {
  primary: PrimarySurface;
  planner: PlannerMode;
  ownerDay?: string;
};

/** Presentation context only. The canonical resolver owns the meaning of the date. */
export function currentPlannerView(state: DayFrameState, instant: Date): MonthlyPlannerView {
  const selectedLabel = resolveUserDayContainingInstant({
    shiftCycles: state.shiftCycles,
    defaultSchedulingPreferences: state.schedulingPreferences,
    instant,
  }).userDayDate;
  return {
    selectedLabel,
    displayedMonth: selectedLabel.slice(0, 7) as MonthlyPlannerView["displayedMonth"],
  };
}

/** No storage, domain commands, or evidence projections belong in navigation. */
export function usePlannerNavigation(initialView: () => MonthlyPlannerView) {
  const [calendarView, setCalendarView] = useState(initialView);
  const [navigation, setNavigation] = useState<{
    destination: NavigationDestination;
    back: Array<{ destination: NavigationDestination; calendarView: MonthlyPlannerView }>;
  }>({ destination: { primary: "planner", planner: "month" }, back: [] });
  function move(
    update: (previous: NavigationDestination) => NavigationDestination,
    returnView = calendarView,
  ) {
    setNavigation((previous) => {
      const destination = update(previous.destination);
      if (
        destination.primary === previous.destination.primary &&
        destination.planner === previous.destination.planner &&
        destination.ownerDay === previous.destination.ownerDay
      )
        return previous;
      return {
        destination,
        back: [...previous.back, { destination: previous.destination, calendarView: returnView }],
      };
    });
  }
  return {
    currentScreen: navigation.destination.primary,
    plannerMode: navigation.destination.planner,
    calendarView,
    setCalendarView,
    setCurrentScreen: (primary: PrimarySurface) => move((previous) => ({ ...previous, primary })),
    setPlannerMode: (planner: PlannerMode) =>
      move((previous) => ({ ...previous, primary: "planner", planner })),
    dayOwner: navigation.destination.ownerDay ?? calendarView.selectedLabel,
    openDay: (ownerDay: string, fromCalendar = false) =>
      move(
        () => ({ primary: "planner", planner: "day", ownerDay }),
        fromCalendar
          ? { ...calendarView, selectedLabel: ownerDay as MonthlyPlannerView["selectedLabel"] }
          : calendarView,
      ),
    canGoBack: navigation.back.length > 0,
    goBack: () => {
      const last = navigation.back.at(-1);
      if (!last) return;
      setCalendarView(last.calendarView);
      setNavigation({ destination: last.destination, back: navigation.back.slice(0, -1) });
    },
  };
}
