/** Ephemeral presentation only. Never serialized or used as canonical authority. */
export type EditingCell<T> = {
  get: () => T;
  update: (patch: Partial<T> | ((value: T) => Partial<T>)) => void;
  subscribe: (listener: () => void) => () => void;
};
export function createGoalEditingContext() {
  const cells = new Map<string, unknown>();
  let valid = true;
  return {
    isValid: () => valid,
    move: (from: string, to: string) => {
      if (cells.has(from)) {
        cells.set(to, cells.get(from));
        cells.delete(from);
      }
    },
    invalidate: () => {
      valid = false;
    },
    cell<T>(key: string, initial: () => T): EditingCell<T> {
      if (!cells.has(key)) {
        let value = initial();
        const listeners = new Set<() => void>();
        cells.set(key, {
          get: () => value,
          update: (patch: Partial<T> | ((current: T) => Partial<T>)) => {
            if (!valid) return;
            value = { ...value, ...(typeof patch === "function" ? patch(value) : patch) };
            listeners.forEach((listener) => listener());
          },
          subscribe: (listener: () => void) => {
            listeners.add(listener);
            return () => {
              listeners.delete(listener);
            };
          },
        });
      }
      return cells.get(key) as EditingCell<T>;
    },
  };
}
export type GoalEditingContext = ReturnType<typeof createGoalEditingContext>;
