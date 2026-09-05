import type { DayFrameStore } from "./types.js";

export const DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY: unique symbol = Symbol(
  "DayFrameRuntimeAuthorityCapability",
);

export type RuntimeAuthorityAdapter<T = unknown> = {
  id:
    | "active"
    | "profiles"
    | "planDecisions"
    | "executionHistory"
    | "historicalPlan"
    | "goals"
    | "measurementDefinitions"
    | "progressObservations"
    | "goalStructure"
    | "goalPlanning"
    | "composition"
    | "proposals"
    | "realizations";
  captureRuntimeSnapshot: () => T;
  installRuntimeExact: (target: T) => void;
};

export type DayFrameRuntimeAuthorityController = {
  begin: (
    kind?: "bootstrap" | "restore" | "internalReplacement",
  ) => { status: "begun"; epoch: number } | { status: "busy" | "snapshotFailed" };
  install: (
    participantId: RuntimeAuthorityAdapter["id"],
    target: unknown,
  ) => { status: "installed" } | { status: "notActive" | "unknownParticipant" | "installFailed" };
  commit: () => { status: "committed" | "notActive" | "flushFailed" };
  abort: () => { status: "aborted" | "notActive" | "abortFailed" };
  getState: () => { status: string };
  captureAll: () => Record<string, unknown>;
};

const controllers = new WeakMap<object, DayFrameRuntimeAuthorityController>();

export function registerDayFrameRuntimeAuthorityController(
  store: object,
  controller: DayFrameRuntimeAuthorityController,
): void {
  controllers.set(store, controller);
}

export function getDayFrameRuntimeAuthorityController(
  store: DayFrameStore,
  capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
): DayFrameRuntimeAuthorityController {
  if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
    throw new Error("Invalid runtime authority capability.");
  const controller = controllers.get(store);
  if (!controller) throw new Error("Runtime authority controller is unavailable.");
  return controller;
}
