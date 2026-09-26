import { useRef, type SetStateAction } from "react";
import { createGoalEditingContext, type GoalEditingContext } from "./goalEditingContext.js";
import { useGoalEditingState } from "./useGoalEditingState.js";
const owners = new WeakMap<object, number>();
let nextOwner = 0;
export function presentationOwner(owner: object) {
  let id = owners.get(owner);
  if (id === undefined) {
    id = ++nextOwner;
    owners.set(owner, id);
  }
  return id;
}
/** Ephemeral drafts only; no query, command, storage or implicit revision rebase. */
export function useGoalPresentationState<T>(
  context: GoalEditingContext | undefined,
  owner: object,
  key: string,
  initial: T | (() => T),
) {
  const local = useRef<GoalEditingContext | null>(null);
  if (!local.current) local.current = createGoalEditingContext();
  const [cell, update] = useGoalEditingState(
    context ?? local.current,
    `${presentationOwner(owner)}:${key}`,
    () => ({ value: typeof initial === "function" ? (initial as () => T)() : initial }),
  );
  const set = (value: SetStateAction<T>) =>
    update((previous) => ({
      value: typeof value === "function" ? (value as (previous: T) => T)(previous.value) : value,
    }));
  return [cell.value, set] as const;
}
