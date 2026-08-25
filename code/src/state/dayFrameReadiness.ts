import type { DayFrameState } from "./types.js";

export type DayFrameReadinessProtectionReason =
  | "authorityInitializationFailed"
  | "authorityRecoveryRequired";

export type DayFrameReadiness =
  | { status: "initializing" }
  | { status: "ready" }
  | { status: "protected"; reason: DayFrameReadinessProtectionReason };

export type DayFrameReadyResult =
  | { status: "ready" }
  | { status: "protected"; reason: DayFrameReadinessProtectionReason };

export type DayFrameReadinessApi = {
  getReadiness: () => DayFrameReadiness;
  subscribeReadiness: (listener: (readiness: DayFrameReadiness) => void) => () => void;
  whenReady: () => Promise<DayFrameReadyResult>;
};

/**
 * Structurally valid shell state for a future asynchronous bootstrap. It is never authored
 * authority: it has no source identities, profiles, or Preview and must never be persisted.
 */
export function createBootstrapPlaceholderState(): DayFrameState {
  const placeholder: DayFrameState = {
    schedulingPreferences: { dayBoundaryStartTime: "00:00", weekStartsOn: "monday" },
    previewRange: {
      source: "custom",
      preset: "custom",
      startDate: "1970-01-01",
      endDate: "1970-01-01",
    },
    shiftDefinitions: [],
    shiftCycles: [],
    blockTemplates: [],
    blockRecurrences: [],
    manualEvents: [],
    savedProfiles: [],
    preview: null,
  };
  bootstrapPlaceholders.add(placeholder);
  return placeholder;
}

const bootstrapPlaceholders = new WeakSet<object>();

export function isBootstrapPlaceholderState(value: unknown): boolean {
  return typeof value === "object" && value !== null && bootstrapPlaceholders.has(value);
}

export function isDayFrameReady(readiness: DayFrameReadiness): readiness is { status: "ready" } {
  return readiness.status === "ready";
}
