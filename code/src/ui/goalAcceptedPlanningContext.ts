import type { GoalEditingContext } from "./goalEditingContext.js";
export type GoalInspectionRange = { start: string; end: string };
/** Navigation-only inclusive display range, consumed independently of Summary context. */
export function goalInspectionNavigation(context: GoalEditingContext, goalId: string) {
  return context.cell<{ range: GoalInspectionRange | null }>(
    `inspection-navigation:${goalId}`,
    () => ({ range: null }),
  );
}

/** Separate navigation intent: Activity uses inclusive labels and never changes G2's period. */
export function goalRecordedNavigation(context: GoalEditingContext, goalId: string) {
  return context.cell<{ range: GoalInspectionRange | null }>(
    `recorded-navigation:${goalId}`,
    () => ({ range: null }),
  );
}
