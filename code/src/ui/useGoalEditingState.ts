import { useSyncExternalStore } from "react";
import type { GoalEditingContext } from "./goalEditingContext.js";

export function useGoalEditingState<T>(context: GoalEditingContext, key: string, initial: () => T) {
  const cell = context.cell(key, initial);
  return [useSyncExternalStore(cell.subscribe, cell.get), cell.update, cell.get] as const;
}
