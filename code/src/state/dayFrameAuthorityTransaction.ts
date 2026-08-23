import type { DayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";

export type AuthorityTransactionKind = "bootstrap" | "restore" | "internalReplacement";
export type AuthorityTransactionState = { status: "inactive" } |
  { status: "active" | "aborting" | "flushing"; kind: AuthorityTransactionKind; epoch: number };

export type RuntimeAuthorityParticipant<T = unknown> = {
  id: string;
  capture: () => T;
  installExact: (value: T) => void;
};

export function createDayFrameAuthorityTransaction(options: {
  scheduler: DayFrameNotificationScheduler;
  participants: readonly RuntimeAuthorityParticipant[];
}) {
  let epoch = 0;
  let state: AuthorityTransactionState = { status: "inactive" };
  let snapshot: Map<string, unknown> | undefined;

  function begin(kind: AuthorityTransactionKind = "internalReplacement") {
    if (state.status !== "inactive" || !options.scheduler.begin()) return { status: "busy" as const };
    const captured = new Map<string, unknown>();
    try {
      for (const participant of options.participants) {
        captured.set(participant.id, structuredClone(participant.capture()));
      }
    } catch {
      options.scheduler.abort();
      return { status: "snapshotFailed" as const };
    }
    snapshot = captured; state = { status: "active", kind, epoch: ++epoch };
    return { status: "begun" as const, epoch };
  }
  function commit() {
    if (state.status !== "active") return { status: "notActive" as const };
    const current = state; state = { ...current, status: "flushing" };
    try { options.scheduler.commit(); snapshot = undefined; state = { status: "inactive" }; return { status: "committed" as const }; }
    catch { state = current; return { status: "flushFailed" as const }; }
  }
  function install(participantId: string, value: unknown) {
    if (state.status !== "active") return { status: "notActive" as const };
    const participant = options.participants.find((current) => current.id === participantId);
    if (!participant) return { status: "unknownParticipant" as const };
    try { participant.installExact(structuredClone(value)); return { status: "installed" as const }; }
    catch { return { status: "installFailed" as const }; }
  }
  function abort() {
    if (state.status !== "active" || !snapshot) return { status: "notActive" as const };
    const current = state; state = { ...current, status: "aborting" };
    try {
      for (const participant of options.participants) participant.installExact(
        structuredClone(snapshot.get(participant.id)));
      options.scheduler.abort(); snapshot = undefined; state = { status: "inactive" };
      return { status: "aborted" as const };
    } catch { return { status: "abortFailed" as const }; }
  }
  function getState(): AuthorityTransactionState { return { ...state }; }
  function captureAll() { return Object.fromEntries(options.participants.map((participant) =>
    [participant.id, structuredClone(participant.capture())])); }
  return { begin, install, commit, abort, getState, captureAll };
}
