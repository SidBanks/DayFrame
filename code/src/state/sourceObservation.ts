/** Observation only: never a command lease, receipt, or persisted authority. */
export function createSourceObservation() {
  let token = Object.freeze({});
  const listeners = new Set<() => void>();
  return {
    token: () => token,
    changed() {
      token = Object.freeze({});
      for (const listener of listeners) {
        // An inspection subscriber cannot change the outcome of an owner command.
        try {
          listener();
        } catch {
          /* isolated observer */
        }
      }
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
export type SourceObservation = ReturnType<typeof createSourceObservation>;
