export const DAYFRAME_NOTIFICATION_CHANNELS = [
  "main",
  "profiles",
  "planDecisions",
  "executionHistory",
  "historicalPlan",
  "goals",
  "measurementDefinitions",
  "progressObservations",
  "goalStructure",
  "goalPlanning",
  "composition",
  "durability",
  "readiness",
] as const;
export type DayFrameNotificationChannel = (typeof DAYFRAME_NOTIFICATION_CHANNELS)[number];

export function createDayFrameNotificationScheduler() {
  let deferred = false;
  let flushing = false;
  const dirty = new Map<DayFrameNotificationChannel, () => void>();

  function notify(channel: DayFrameNotificationChannel, callback: () => void): void {
    if (deferred || flushing) {
      dirty.set(channel, callback);
      return;
    }
    callback();
  }
  function begin(): boolean {
    if (deferred || flushing) return false;
    deferred = true;
    return true;
  }
  function commit(): void {
    if (!deferred) throw new Error("No notification transaction is active.");
    deferred = false;
    flushing = true;
    try {
      for (const channel of DAYFRAME_NOTIFICATION_CHANNELS) {
        const callback = dirty.get(channel);
        dirty.delete(channel);
        if (callback) callback();
      }
    } finally {
      flushing = false;
    }
    // Mutations attempted by callbacks are deferred until the coherent flush finishes.
    if (dirty.size) {
      const remaining = [...dirty.values()];
      dirty.clear();
      for (const callback of remaining) callback();
    }
  }
  function abort(): void {
    deferred = false;
    dirty.clear();
  }
  function getState() {
    return { deferred, flushing, dirtyChannels: [...dirty.keys()] };
  }
  return { notify, begin, commit, abort, getState };
}

export type DayFrameNotificationScheduler = ReturnType<typeof createDayFrameNotificationScheduler>;
