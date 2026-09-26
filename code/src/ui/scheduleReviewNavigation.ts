import type { GoalEditingContext } from "./goalEditingContext.js";

/** Explicit navigation intent only; Calendar browsing never updates this cell. */
export function scheduleReviewNavigation(context: GoalEditingContext) {
  return context.cell<{ range: { start: string; end: string } | null }>(
    "review-navigation",
    () => ({ range: null }),
  );
}
