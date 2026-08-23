import { isRestoreTransactionId, type RestoreTransactionId } from "./restoreIdentity.js";

export const RESTORE_JOURNAL_VERSION = 1 as const;
export const RESTORE_JOURNAL_KEY = "dayframe-restore-journal-v1";
export const RESTORE_STAGES = ["prepared", "staged", "indexedDbCommitted", "localStorageCommitted",
  "verified", "finalized", "rollbackPrepared", "rollbackIndexedDbCommitted",
  "rollbackLocalStorageCommitted", "rollbackVerified", "recoveryRequired"] as const;
export type RestoreStage = typeof RESTORE_STAGES[number];
export type RestoreMode = "ordinary" | "recoveryReplacement";
export type RestoreJournalV1 = { app: "DayFrame"; surface: "restore-journal"; version: 1;
  transactionId: RestoreTransactionId; stage: RestoreStage; mode: RestoreMode;
  targetFingerprint: string; recoveryFingerprint: string; createdAt: string; updatedAt: string };

const transitions: Record<RestoreStage, readonly RestoreStage[]> = {
  prepared: ["staged"], staged: ["indexedDbCommitted", "rollbackPrepared"],
  indexedDbCommitted: ["localStorageCommitted", "rollbackPrepared", "recoveryRequired"],
  localStorageCommitted: ["verified", "rollbackPrepared", "recoveryRequired"],
  verified: ["finalized", "recoveryRequired"], finalized: [],
  rollbackPrepared: ["rollbackIndexedDbCommitted", "recoveryRequired"],
  rollbackIndexedDbCommitted: ["rollbackLocalStorageCommitted", "recoveryRequired"],
  rollbackLocalStorageCommitted: ["rollbackVerified", "recoveryRequired"],
  rollbackVerified: ["finalized", "recoveryRequired"], recoveryRequired: [],
};

export function validateRestoreJournal(value: unknown): { status: "valid"; journal: RestoreJournalV1 } | { status: "invalid" } {
  if (!record(value) || !exact(value, ["app", "surface", "version", "transactionId", "stage", "mode",
    "targetFingerprint", "recoveryFingerprint", "createdAt", "updatedAt"])) return { status: "invalid" };
  if (value.app !== "DayFrame" || value.surface !== "restore-journal" || value.version !== RESTORE_JOURNAL_VERSION ||
    !isRestoreTransactionId(value.transactionId) || !RESTORE_STAGES.includes(value.stage as RestoreStage) ||
    (value.mode !== "ordinary" && value.mode !== "recoveryReplacement") || !fingerprint(value.targetFingerprint) ||
    !fingerprint(value.recoveryFingerprint) || !timestamp(value.createdAt) || !timestamp(value.updatedAt)) return { status: "invalid" };
  return { status: "valid", journal: structuredClone(value) as RestoreJournalV1 };
}

export function canTransitionRestoreJournal(from: RestoreStage, to: RestoreStage): boolean {
  return transitions[from].includes(to);
}

export function createRestoreJournalStorage(storage: Pick<Storage, "getItem" | "setItem" | "removeItem">) {
  function read() {
    let raw: string | null;
    try { raw = storage.getItem(RESTORE_JOURNAL_KEY); } catch { return { status: "failure" as const, reason: "storageFailure" as const }; }
    if (raw === null) return { status: "absent" as const };
    try { const checked = validateRestoreJournal(JSON.parse(raw)); return checked.status === "valid"
      ? { status: "present" as const, journal: checked.journal } : { status: "failure" as const, reason: "invalidJournal" as const }; }
    catch { return { status: "failure" as const, reason: "invalidJournal" as const }; }
  }
  function write(journal: RestoreJournalV1) {
    if (validateRestoreJournal(journal).status !== "valid") return { status: "failure" as const, reason: "invalidJournal" as const };
    const current = read();
    if (current.status === "failure") return current;
    if (current.status === "present" && (current.journal.transactionId !== journal.transactionId ||
      (current.journal.stage !== journal.stage && !canTransitionRestoreJournal(current.journal.stage, journal.stage))))
      return { status: "failure" as const, reason: "invalidTransition" as const };
    try { storage.setItem(RESTORE_JOURNAL_KEY, JSON.stringify(journal)); } catch { return { status: "failure" as const, reason: "storageFailure" as const }; }
    const verified = read(); return verified.status === "present" && JSON.stringify(verified.journal) === JSON.stringify(journal)
      ? { status: "success" as const } : { status: "failure" as const, reason: "verificationFailed" as const };
  }
  function clear(transactionId: RestoreTransactionId) {
    const current = read(); if (current.status !== "present" || current.journal.transactionId !== transactionId)
      return { status: "failure" as const, reason: "journalMismatch" as const };
    try { storage.removeItem(RESTORE_JOURNAL_KEY); } catch { return { status: "failure" as const, reason: "storageFailure" as const }; }
    return read().status === "absent" ? { status: "success" as const }
      : { status: "failure" as const, reason: "verificationFailed" as const };
  }
  return { read, write, clear };
}

function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function exact(value: Record<string, unknown>, keys: string[]) { return Object.keys(value).length === keys.length && keys.every((key) => key in value); }
function fingerprint(value: unknown) { return typeof value === "string" && /^[0-9a-f]{16,128}$/.test(value); }
function timestamp(value: unknown) { return typeof value === "string" && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value; }
