import { RESTORE_METADATA_STORE, RESTORE_PAYLOAD_STORE } from "../storage/dayFrameDurableDb.js";
import type { IndexedDbCollectionStorage } from "../storage/indexedDbCollectionStorage.js";
import type { RestoreTransactionId } from "./restoreIdentity.js";
import { isRestoreTransactionId } from "./restoreIdentity.js";

export const RESTORE_LOCAL_STAGE_KEY = "dayframe-restore-local-stage-v1";
export const RESTORE_PARTICIPANT_IDS = [
  "active",
  "profiles",
  "planDecisions",
  "executionHistory",
  "historicalPlan",
  "goals",
  "measurementDefinitions",
  "progressObservations",
] as const;
export type RestoreParticipantId = (typeof RESTORE_PARTICIPANT_IDS)[number];
export type RestoreSide = "target" | "recovery";
export type RestorePayloadSet = Record<RestoreParticipantId, unknown>;
export type RestoreFingerprints = Record<RestoreParticipantId, string>;

type PayloadRecord = {
  transactionId: RestoreTransactionId;
  side: RestoreSide;
  participantId: RestoreParticipantId;
  fingerprint: string;
  payload: unknown;
};
type MetadataRecord = {
  transactionId: RestoreTransactionId;
  version: 1;
  targetFingerprint: string;
  recoveryFingerprint: string;
  targetParticipants: RestoreFingerprints;
  recoveryParticipants: RestoreFingerprints;
  sourceFingerprints: RestoreFingerprints;
};
export type RestoreLocalStageV1 = {
  app: "DayFrame";
  surface: "restore-local-stage";
  version: 1;
  transactionId: RestoreTransactionId;
  target: Pick<RestorePayloadSet, "active" | "profiles" | "planDecisions">;
  recovery: Pick<RestorePayloadSet, "active" | "profiles" | "planDecisions">;
  targetFingerprints: Pick<RestoreFingerprints, "active" | "profiles" | "planDecisions">;
  recoveryFingerprints: Pick<RestoreFingerprints, "active" | "profiles" | "planDecisions">;
};

export function semanticFingerprint(value: unknown): string {
  const input = canonical(value);
  let hash = 0xcbf29ce484222325n;
  for (let index = 0; index < input.length; index++) {
    hash ^= BigInt(input.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, "0");
}
export function wholeFingerprint(values: RestoreFingerprints): string {
  return semanticFingerprint(RESTORE_PARTICIPANT_IDS.map((id) => [id, values[id]]));
}
export function fingerprintPayloads(payloads: RestorePayloadSet): RestoreFingerprints {
  return Object.fromEntries(
    RESTORE_PARTICIPANT_IDS.map((id) => [id, semanticFingerprint(payloads[id])]),
  ) as RestoreFingerprints;
}

export function createRestoreIndexedDbStaging(storage: IndexedDbCollectionStorage) {
  async function stage(
    transactionId: RestoreTransactionId,
    target: RestorePayloadSet,
    recovery: RestorePayloadSet,
    sourceFingerprints: RestoreFingerprints = fingerprintPayloads(recovery),
    suppliedTargetFingerprints: RestoreFingerprints = fingerprintPayloads(target),
    suppliedRecoveryFingerprints: RestoreFingerprints = fingerprintPayloads(recovery),
  ) {
    let targetClone: RestorePayloadSet;
    let recoveryClone: RestorePayloadSet;
    try {
      targetClone = structuredClone(target);
      recoveryClone = structuredClone(recovery);
    } catch {
      return { status: "failure" as const, reason: "cloneFailure" as const };
    }
    const targetParticipants = structuredClone(suppliedTargetFingerprints);
    const recoveryParticipants = structuredClone(suppliedRecoveryFingerprints);
    const metadata: MetadataRecord = {
      transactionId,
      version: 1,
      targetFingerprint: wholeFingerprint(targetParticipants),
      recoveryFingerprint: wholeFingerprint(recoveryParticipants),
      targetParticipants,
      recoveryParticipants,
      sourceFingerprints: structuredClone(sourceFingerprints),
    };
    const records: PayloadRecord[] = (["target", "recovery"] as const).flatMap((side) =>
      RESTORE_PARTICIPANT_IDS.map((participantId) => ({
        transactionId,
        side,
        participantId,
        fingerprint:
          side === "target"
            ? targetParticipants[participantId]
            : recoveryParticipants[participantId],
        payload: structuredClone((side === "target" ? targetClone : recoveryClone)[participantId]),
      })),
    );
    const written = await storage.mutate([
      { type: "put", store: RESTORE_METADATA_STORE, value: metadata },
      ...records.map((value) => ({ type: "put" as const, store: RESTORE_PAYLOAD_STORE, value })),
    ]);
    if (written.status === "failure")
      return {
        status: "failure" as const,
        reason: "storageFailure" as const,
        error: written.error,
      };
    const checked = await read(transactionId);
    return checked.status === "success" &&
      checked.metadata.targetFingerprint === metadata.targetFingerprint &&
      checked.metadata.recoveryFingerprint === metadata.recoveryFingerprint
      ? checked
      : { status: "failure" as const, reason: "verificationFailed" as const };
  }
  async function read(transactionId: RestoreTransactionId) {
    const metadataResult = await storage.get<MetadataRecord>(RESTORE_METADATA_STORE, transactionId);
    const all = await storage.getAll<PayloadRecord>(RESTORE_PAYLOAD_STORE);
    if (metadataResult.status === "failure" || all.status === "failure" || !metadataResult.value)
      return { status: "failure" as const, reason: "missingStage" as const };
    const records = all.value.filter((value) => value.transactionId === transactionId);
    if (
      !validMetadata(metadataResult.value) ||
      records.length !== RESTORE_PARTICIPANT_IDS.length * 2
    )
      return { status: "failure" as const, reason: "invalidStage" as const };
    const metadata = metadataResult.value;
    const payload = (side: RestoreSide) =>
      Object.fromEntries(
        RESTORE_PARTICIPANT_IDS.map((id) => {
          const found = records.find((value) => value.side === side && value.participantId === id);
          if (!found) throw new Error("invalid stage");
          return [id, structuredClone(found.payload)];
        }),
      ) as RestorePayloadSet;
    try {
      const target = payload("target");
      const recovery = payload("recovery");
      if (
        RESTORE_PARTICIPANT_IDS.some(
          (id) =>
            records.find((value) => value.side === "target" && value.participantId === id)
              ?.fingerprint !== metadata.targetParticipants[id] ||
            records.find((value) => value.side === "recovery" && value.participantId === id)
              ?.fingerprint !== metadata.recoveryParticipants[id],
        )
      )
        throw new Error("invalid stage");
      return { status: "success" as const, target, recovery, metadata: structuredClone(metadata) };
    } catch {
      return { status: "failure" as const, reason: "invalidStage" as const };
    }
  }
  async function cleanup(transactionId: RestoreTransactionId) {
    const all = await storage.getAll<PayloadRecord>(RESTORE_PAYLOAD_STORE);
    if (all.status === "failure") return all;
    return storage.mutate([
      { type: "delete", store: RESTORE_METADATA_STORE, key: transactionId },
      ...all.value
        .filter((value) => value.transactionId === transactionId)
        .map((value) => ({
          type: "delete" as const,
          store: RESTORE_PAYLOAD_STORE,
          key: [value.transactionId, value.side, value.participantId],
        })),
    ]);
  }
  return { stage, read, cleanup };
}

export function createRestoreLocalStaging(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
) {
  function write(value: RestoreLocalStageV1) {
    if (!validLocal(value)) return { status: "failure" as const, reason: "invalidStage" as const };
    try {
      storage.setItem(RESTORE_LOCAL_STAGE_KEY, JSON.stringify(value));
    } catch {
      return { status: "failure" as const, reason: "storageFailure" as const };
    }
    const readBack = read();
    return readBack.status === "success" &&
      semanticFingerprint(readBack.value) === semanticFingerprint(value)
      ? readBack
      : { status: "failure" as const, reason: "verificationFailed" as const };
  }
  function read() {
    let raw: string | null;
    try {
      raw = storage.getItem(RESTORE_LOCAL_STAGE_KEY);
    } catch {
      return { status: "failure" as const, reason: "storageFailure" as const };
    }
    if (raw === null) return { status: "absent" as const };
    try {
      const value: unknown = JSON.parse(raw);
      return validLocal(value)
        ? { status: "success" as const, value: structuredClone(value) }
        : { status: "failure" as const, reason: "invalidStage" as const };
    } catch {
      return { status: "failure" as const, reason: "invalidStage" as const };
    }
  }
  function cleanup(transactionId: RestoreTransactionId) {
    const current = read();
    if (current.status === "success" && current.value.transactionId !== transactionId)
      return { status: "failure" as const };
    try {
      storage.removeItem(RESTORE_LOCAL_STAGE_KEY);
      return { status: "success" as const };
    } catch {
      return { status: "failure" as const };
    }
  }
  return { write, read, cleanup };
}

function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value as object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key])}`)
    .join(",")}}`;
}
function validMetadata(value: MetadataRecord) {
  return (
    value.version === 1 &&
    RESTORE_PARTICIPANT_IDS.every(
      (id) =>
        typeof value.targetParticipants[id] === "string" &&
        typeof value.recoveryParticipants[id] === "string" &&
        typeof value.sourceFingerprints[id] === "string",
    ) &&
    value.targetFingerprint === wholeFingerprint(value.targetParticipants) &&
    value.recoveryFingerprint === wholeFingerprint(value.recoveryParticipants)
  );
}
function validLocal(value: unknown): value is RestoreLocalStageV1 {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  if (
    Object.keys(item).length !== 8 ||
    item.app !== "DayFrame" ||
    item.surface !== "restore-local-stage" ||
    item.version !== 1 ||
    !isRestoreTransactionId(item.transactionId)
  )
    return false;
  const keys = ["active", "profiles", "planDecisions"];
  if (
    !["target", "recovery", "targetFingerprints", "recoveryFingerprints"].every(
      (key) =>
        record(item[key]) &&
        Object.keys(item[key] as object).length === keys.length &&
        keys.every((id) => id in (item[key] as object)),
    )
  )
    return false;
  const target = item.target as Record<string, unknown>;
  const recovery = item.recovery as Record<string, unknown>;
  const targetFingerprints = item.targetFingerprints as Record<string, unknown>;
  const recoveryFingerprints = item.recoveryFingerprints as Record<string, unknown>;
  return keys.every(
    (id) =>
      targetFingerprints[id] === semanticFingerprint(target[id]) &&
      recoveryFingerprints[id] === semanticFingerprint(recovery[id]),
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
