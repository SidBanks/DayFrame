import { useMemo, useSyncExternalStore } from "react";
/** React reads a stable external-store revision; old Ready state cannot survive invalidation. */
export function useReviewInvalidation(subscribe?: (listener: () => void) => () => void) {
  const store = useMemo(() => {
    let revision = 0;
    return {
      get: () => revision,
      subscribe: (listener: () => void) =>
        subscribe?.(() => {
          revision++;
          listener();
        }) ?? (() => undefined),
    };
  }, [subscribe]);
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
