import {
  cloneExecutionRecord,
  correctExecutionAssertion,
  createExecutionAssertion,
  createExecutionRecordId,
  createExecutionSubjectId,
  isExecutionSubjectId,
  projectOccurrenceOutcome,
  retractExecutionRecord as createRetraction,
  validateExecutionRecord,
  validateExecutionRecordCollection,
  type CorrectExecutionAssertionInput,
  type CreateExecutionAssertionInput,
  type ExecutionCollectionIssueCode,
  type ExecutionConstructionProviders,
  type ExecutionRecordId,
  type ExecutionRecordIdAllocator,
  type ExecutionRecordV1,
  type ExecutionSubjectId,
  type ExecutionSubjectIdAllocator,
  type OccurrenceOutcome,
} from "../core/execution/executionRecord.js";
import {
  durableOccurrenceReferencesEqual,
  type DurableOccurrenceReference,
} from "../core/occurrences/durableOccurrenceReference.js";
import type {
  PersistenceRemovalOutcome,
  PersistenceWriteOutcome,
  SurfaceDurabilityStatus,
} from "./types.js";
import {
  createExecutionHistoryIndexedDb,
  EXECUTION_HISTORY_AUTHORITY_MARKER_KEY,
  type ExecutionHistoryIndexedDb,
} from "./executionHistoryIndexedDb.js";
import type { DayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";

export const DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY = "dayframe-execution-history-v1";
export const EXECUTION_HISTORY_SURFACE_VERSION = 1 as const;

export type ExecutionHistoryQuarantineReason =
  | ExecutionCollectionIssueCode
  | "unsupportedRecordVersion"
  | "orphanRecord";

export type QuarantinedExecutionHistoryComponent = {
  quarantineId: string;
  reason: ExecutionHistoryQuarantineReason;
  rawRecords: unknown[];
  knownSubjectIds: string[];
  knownRecordIds: string[];
};

export type ExecutionHistoryEnvelopeV1 = {
  app: "DayFrame";
  surface: "executionHistory";
  version: typeof EXECUTION_HISTORY_SURFACE_VERSION;
  records: ExecutionRecordV1[];
  quarantinedComponents: QuarantinedExecutionHistoryComponent[];
};

export type ExecutionHistoryIngressStatus =
  | { status: "noSource"; reason: "missing" | "storageUnavailable" | "resolvedByAbandonment" }
  | { status: "accepted"; quarantinedComponentCount: number }
  | {
      status: "recoveryRequired";
      reason:
        | "readFailure"
        | "corruptJson"
        | "invalidEnvelope"
        | "unsupportedVersion"
        | "establishedIndexedDbUnavailable"
        | "indexedDbCorrupt"
        | "migrationFailure";
      sourcePreserved: boolean;
    };

export type ExecutionHistoryMigrationStatus =
  | "initializing"
  | "legacyAuthority"
  | "migrating"
  | "readyIndexedDb"
  | "protected"
  | "unavailable";

export type RecordExecutionResult =
  | {
      status: "accepted";
      record: ExecutionRecordV1;
      records: ExecutionRecordV1[];
      persistence: PersistenceWriteOutcome;
    }
  | {
      status: "rejected";
      reason:
        | "protectedHistoryIngress"
        | "invalidInput"
        | "duplicatePlannedSubject"
        | "allocationFailure";
      issues?: string[];
    };

export type ReviseExecutionResult =
  | {
      status: "accepted";
      record: ExecutionRecordV1;
      records: ExecutionRecordV1[];
      persistence: PersistenceWriteOutcome;
    }
  | {
      status: "rejected";
      reason:
        | "protectedHistoryIngress"
        | "invalidInput"
        | "invalidReplacement"
        | "notCurrentHead"
        | "allocationFailure";
    };

export type ExecutionHistoryRetryResult =
  | { status: "attempted"; persistence: PersistenceWriteOutcome }
  | {
      status: "notAttempted";
      reason: "unknown" | "alreadyDurable" | "serializationFailure" | "recoveryProtected";
    };

export type ExecutionHistoryRecoveryResult =
  | { status: "resolved"; action: "replace" | "abandon"; persistence: { status: "persisted" } }
  | {
      status: "notResolved";
      action: "replace" | "abandon";
      persistence: Exclude<PersistenceWriteOutcome, { status: "persisted" }>;
    }
  | { status: "notAttempted"; reason: "noProtectedSource" | "sourceUnreadable" | "sourceChanged" };

export type ExecutionHistorySurface = ReturnType<typeof createExecutionHistorySurface>;
export type ExecutionHistoryRuntimeSnapshot = {
  records: ExecutionRecordV1[];
  quarantine: QuarantinedExecutionHistoryComponent[];
  ingress: ExecutionHistoryIngressStatus;
  protectedRaw?: string;
  durability: SurfaceDurabilityStatus;
  desired: { records: ExecutionRecordV1[]; quarantine: QuarantinedExecutionHistoryComponent[] };
  migrationStatus: ExecutionHistoryMigrationStatus;
  authorityMode: "legacy" | "indexedDb";
  pendingRecords: ExecutionRecordV1[];
  pendingQuarantineRemovals: string[];
  indexedProtectedEvidence?: string;
};

export function createExecutionHistorySurface(
  options: {
    allocateRecordId?: ExecutionRecordIdAllocator;
    allocateSubjectId?: ExecutionSubjectIdAllocator;
    now?: () => string;
    serialize?: (value: unknown) => string;
    indexedDb?: ExecutionHistoryIndexedDb;
    notificationScheduler?: DayFrameNotificationScheduler;
  } = {},
) {
  const legacyStorage = getStorage();
  const markerPresent = readAuthorityMarker(legacyStorage);
  const loaded = markerPresent ? emptyEstablishedLoad() : load(legacyStorage);
  let records = loaded.records;
  let quarantine = loaded.quarantine;
  let ingress = loaded.ingress;
  let protectedRaw = loaded.protectedRaw;
  let durability = loaded.durability;
  let desired = cloneAuthority(records, quarantine);
  const indexedDb = options.indexedDb ?? createExecutionHistoryIndexedDb();
  let migrationStatus: ExecutionHistoryMigrationStatus = "initializing";
  let authorityMode: "legacy" | "indexedDb" = "legacy";
  let pendingRecords: ExecutionRecordV1[] = [];
  let pendingQuarantineRemovals: string[] = [];
  let persistenceChain: Promise<void> = Promise.resolve();
  let initialization: Promise<void> | undefined;
  let indexedProtectedEvidence: string | undefined;
  const historyListeners = new Set<(value: ExecutionRecordV1[]) => void>();
  const durabilityListeners = new Set<(value: SurfaceDurabilityStatus) => void>();
  const ingressListeners = new Set<(value: ExecutionHistoryIngressStatus) => void>();
  const migrationListeners = new Set<(value: ExecutionHistoryMigrationStatus) => void>();
  const providers: ExecutionConstructionProviders = {
    allocateRecordId: options.allocateRecordId ?? createExecutionRecordId,
    allocateSubjectId: options.allocateSubjectId ?? createExecutionSubjectId,
    now: options.now ?? (() => new Date().toISOString()),
  };
  const serialize = options.serialize ?? JSON.stringify;
  const runtimeAdapter: RuntimeAuthorityAdapter<ExecutionHistoryRuntimeSnapshot> = {
    id: "executionHistory",
    captureRuntimeSnapshot: () =>
      structuredClone({
        records,
        quarantine,
        ingress,
        ...(protectedRaw === undefined ? {} : { protectedRaw }),
        durability,
        desired,
        migrationStatus,
        authorityMode,
        pendingRecords,
        pendingQuarantineRemovals,
        ...(indexedProtectedEvidence === undefined ? {} : { indexedProtectedEvidence }),
      }),
    installRuntimeExact: (target) => {
      records = target.records.map(cloneExecutionRecord);
      quarantine = target.quarantine.map(cloneQuarantine);
      ingress = { ...target.ingress };
      protectedRaw = target.protectedRaw;
      durability = target.durability;
      desired = cloneAuthority(target.desired.records, target.desired.quarantine);
      migrationStatus = target.migrationStatus;
      authorityMode = target.authorityMode;
      pendingRecords = target.pendingRecords.map(cloneExecutionRecord);
      pendingQuarantineRemovals = [...target.pendingQuarantineRemovals];
      indexedProtectedEvidence = target.indexedProtectedEvidence;
      options.notificationScheduler?.notify("executionHistory", () => {
        notifyHistory();
        for (const listener of durabilityListeners) listener(durability);
        for (const listener of ingressListeners) listener(getExecutionHistoryIngressStatus());
        for (const listener of migrationListeners) listener(migrationStatus);
      });
    },
  };

  function setMigrationStatus(value: ExecutionHistoryMigrationStatus) {
    if (migrationStatus === value) return;
    migrationStatus = value;
    for (const listener of migrationListeners) listener(value);
  }

  function initializeExecutionHistory(): Promise<void> {
    if (initialization) return initialization;
    initialization = initializeIndexedDbAuthority();
    return initialization;
  }

  async function initializeIndexedDbAuthority(): Promise<void> {
    const current = await indexedDb.readAuthority();
    if (current.status === "established") {
      adoptIndexedDb(current.envelope);
      return;
    }
    if (current.status === "protected") {
      indexedProtectedEvidence = current.evidence;
      setMigrationStatus("protected");
      setDurability("unknown");
      setIngress({ status: "recoveryRequired", reason: "indexedDbCorrupt", sourcePreserved: true });
      return;
    }
    if (current.status === "unavailable") {
      setMigrationStatus("unavailable");
      if (markerPresent) {
        setDurability("unavailable");
        setIngress({
          status: "recoveryRequired",
          reason: "establishedIndexedDbUnavailable",
          sourcePreserved: false,
        });
      }
      return;
    }
    if (ingress.status === "recoveryRequired") {
      setMigrationStatus("protected");
      return;
    }
    setMigrationStatus("migrating");
    const rawBefore = readLegacyRaw(legacyStorage);
    const fingerprint = fingerprintLegacy(rawBefore);
    if (current.status === "staged" && current.metadata.legacyFingerprint !== fingerprint) {
      setMigrationStatus("protected");
      setIngress({
        status: "recoveryRequired",
        reason: "migrationFailure",
        sourcePreserved: rawBefore !== undefined,
      });
      return;
    }
    if (current.status === "noAuthority") {
      const staged = await indexedDb.stageMigration(
        createExecutionHistoryEnvelope(records, quarantine),
        fingerprint,
      );
      if (staged.status === "failure") {
        setMigrationStatus("legacyAuthority");
        return;
      }
    }
    if (readLegacyRaw(legacyStorage) !== rawBefore) {
      setMigrationStatus("protected");
      setIngress({
        status: "recoveryRequired",
        reason: "migrationFailure",
        sourcePreserved: rawBefore !== undefined,
      });
      return;
    }
    if (!writeAuthorityMarker(legacyStorage)) {
      setMigrationStatus("legacyAuthority");
      return;
    }
    const established = await indexedDb.establishAuthority();
    if (established.status === "failure") {
      setMigrationStatus("protected");
      setIngress({ status: "recoveryRequired", reason: "migrationFailure", sourcePreserved: true });
      return;
    }
    const verified = await indexedDb.readAuthority();
    if (verified.status !== "established") {
      setMigrationStatus("protected");
      setIngress({ status: "recoveryRequired", reason: "migrationFailure", sourcePreserved: true });
      return;
    }
    adoptIndexedDb(verified.envelope);
  }

  function adoptIndexedDb(envelope: ExecutionHistoryEnvelopeV1) {
    records = envelope.records.map(cloneExecutionRecord);
    quarantine = envelope.quarantinedComponents.map(cloneQuarantine);
    desired = cloneAuthority(records, quarantine);
    authorityMode = "indexedDb";
    pendingRecords = [];
    pendingQuarantineRemovals = [];
    setDurability("durable");
    setIngress({ status: "accepted", quarantinedComponentCount: quarantine.length });
    setMigrationStatus("readyIndexedDb");
  }

  async function recheckProtectedExecutionHistoryIndexedDbSource() {
    if (!indexedProtectedEvidence) return "noProtectedSource" as const;
    const current = await indexedDb.physicalEvidence();
    return current === undefined
      ? ("sourceUnreadable" as const)
      : current === indexedProtectedEvidence
        ? ("unchanged" as const)
        : ("sourceChanged" as const);
  }
  async function recoverIndexedDb(action: "replace" | "abandon") {
    const checked = await recheckProtectedExecutionHistoryIndexedDbSource();
    if (checked !== "unchanged") return { status: "notAttempted" as const, reason: checked };
    const envelope =
      action === "abandon"
        ? createExecutionHistoryEnvelope([], [])
        : createExecutionHistoryEnvelope(records, quarantine);
    const result = await indexedDb.replaceAuthority(envelope);
    if (result.status === "failure")
      return {
        status: "notResolved" as const,
        action,
        persistence: { status: "storageFailure" as const },
      };
    indexedProtectedEvidence = undefined;
    adoptIndexedDb(envelope);
    notifyHistory();
    return { status: "resolved" as const, action, persistence: { status: "persisted" as const } };
  }
  function retryExecutionHistoryMigration() {
    if (migrationStatus === "readyIndexedDb")
      return Promise.resolve({
        status: "notAttempted" as const,
        reason: "alreadyEstablished" as const,
      });
    if (migrationStatus === "protected")
      return Promise.resolve({
        status: "notAttempted" as const,
        reason: "recoveryProtected" as const,
      });
    initialization = undefined;
    return initializeExecutionHistory().then(() => ({
      status:
        migrationStatus === "readyIndexedDb"
          ? ("established" as const)
          : ("notEstablished" as const),
    }));
  }

  const getExecutionHistory = () => records.map(cloneExecutionRecord);
  const getQuarantinedExecutionHistory = () => quarantine.map(cloneQuarantine);
  const getExecutionHistoryDurabilityStatus = () => durability;
  const getExecutionHistoryIngressStatus = () => ({ ...ingress });

  function setDurability(value: SurfaceDurabilityStatus): void {
    if (durability === value) return;
    durability = value;
    for (const listener of durabilityListeners) listener(value);
  }
  function setIngress(value: ExecutionHistoryIngressStatus): void {
    ingress = value;
    for (const listener of ingressListeners) listener(getExecutionHistoryIngressStatus());
  }
  function notifyHistory(): void {
    for (const listener of historyListeners) listener(getExecutionHistory());
  }
  function persist(): PersistenceWriteOutcome {
    if (authorityMode === "indexedDb") {
      setDurability("pending");
      schedulePendingPersistence();
      return { status: "pending" };
    }
    const storage = getStorage();
    if (!storage) {
      setDurability("unavailable");
      return { status: "unavailable" };
    }
    let raw: string;
    try {
      raw = serialize(createExecutionHistoryEnvelope(desired.records, desired.quarantine));
    } catch {
      setDurability("serializationFailure");
      return { status: "serializationFailure" };
    }
    try {
      storage.setItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY, raw);
      const reread = storage.getItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY);
      if (reread !== raw || !verifySerialized(reread, desired)) throw new Error("verification");
      setDurability("durable");
      setIngress({ status: "accepted", quarantinedComponentCount: quarantine.length });
      return { status: "persisted" };
    } catch {
      setDurability("storageFailure");
      return { status: "storageFailure" };
    }
  }
  async function persistPendingAuthority(): Promise<void> {
    if (!pendingRecords.length && !pendingQuarantineRemovals.length) {
      setDurability("durable");
      return;
    }
    const exact = pendingRecords.map(cloneExecutionRecord);
    const result = await indexedDb.appendRecords(exact);
    if (result.status === "failure") {
      setDurability(result.error.code === "unavailable" ? "unavailable" : "storageFailure");
      return;
    }
    pendingRecords = pendingRecords.filter(
      (record) => !exact.some((value) => value.id === record.id),
    );
    for (const quarantineId of [...pendingQuarantineRemovals]) {
      const removal = await indexedDb.removeQuarantine(quarantineId);
      if (removal.status === "failure") {
        setDurability("storageFailure");
        return;
      }
      pendingQuarantineRemovals = pendingQuarantineRemovals.filter(
        (value) => value !== quarantineId,
      );
    }
    setDurability(
      pendingRecords.length || pendingQuarantineRemovals.length ? "pending" : "durable",
    );
  }
  function schedulePendingPersistence(): void {
    persistenceChain = persistenceChain.then(persistPendingAuthority, persistPendingAuthority);
  }
  function acceptConstructed(
    result:
      | ReturnType<typeof createExecutionAssertion>
      | ReturnType<typeof correctExecutionAssertion>
      | ReturnType<typeof createRetraction>,
  ): RecordExecutionResult | ReviseExecutionResult {
    if (result.status !== "created") {
      return {
        status: "rejected",
        reason:
          result.status === "invalidInput"
            ? "invalidInput"
            : result.status === "notCurrentHead"
              ? "notCurrentHead"
              : result.status === "invalidReplacement"
                ? "invalidReplacement"
                : "allocationFailure",
      };
    }
    records = canonicalRecords([...records, result.record]);
    desired = cloneAuthority(records, quarantine);
    if (authorityMode === "indexedDb") pendingRecords.push(cloneExecutionRecord(result.record));
    const persistence = persist();
    notifyHistory();
    return {
      status: "accepted",
      record: cloneExecutionRecord(result.record),
      records: getExecutionHistory(),
      persistence,
    };
  }
  function recordExecution(input: CreateExecutionAssertionInput): RecordExecutionResult {
    if (ingress.status === "recoveryRequired")
      return { status: "rejected", reason: "protectedHistoryIngress" };
    if (input.subject.kind === "planned" && findSubjectByReference(input.subject.reference)) {
      return { status: "rejected", reason: "duplicatePlannedSubject" };
    }
    const result = createExecutionAssertion(input, providers);
    const accepted = acceptConstructed(result);
    if (accepted.status === "rejected" && result.status === "invalidInput")
      return { ...accepted, issues: result.issues } as RecordExecutionResult;
    return accepted as RecordExecutionResult;
  }
  function correctExecutionRecord(
    subjectId: ExecutionSubjectId,
    currentRecordId: ExecutionRecordId,
    input: CorrectExecutionAssertionInput,
  ): ReviseExecutionResult {
    if (ingress.status === "recoveryRequired")
      return { status: "rejected", reason: "protectedHistoryIngress" };
    if (
      !records.some((current) => current.subjectId === subjectId && current.id === currentRecordId)
    ) {
      return { status: "rejected", reason: "invalidReplacement" };
    }
    return acceptConstructed(
      correctExecutionAssertion(records, currentRecordId, input, providers),
    ) as ReviseExecutionResult;
  }
  function retractExecutionRecord(
    subjectId: ExecutionSubjectId,
    currentRecordId: ExecutionRecordId,
    note?: string,
  ): ReviseExecutionResult {
    if (ingress.status === "recoveryRequired")
      return { status: "rejected", reason: "protectedHistoryIngress" };
    if (
      !records.some((current) => current.subjectId === subjectId && current.id === currentRecordId)
    ) {
      return { status: "rejected", reason: "invalidReplacement" };
    }
    return acceptConstructed(
      createRetraction(records, currentRecordId, note, providers),
    ) as ReviseExecutionResult;
  }
  function getExecutionOutcome(
    subjectId: ExecutionSubjectId,
  ): OccurrenceOutcome | ReturnType<typeof projectOccurrenceOutcome> {
    return projectOccurrenceOutcome(records, subjectId);
  }
  function findExecutionSubjectByPlannedReference(
    reference: DurableOccurrenceReference,
  ): ExecutionSubjectId | undefined {
    return findSubjectByReference(reference);
  }
  function findSubjectByReference(
    reference: DurableOccurrenceReference,
  ): ExecutionSubjectId | undefined {
    const assertion = records.find(
      (current) =>
        current.kind === "assertion" &&
        current.subject.kind === "planned" &&
        durableOccurrenceReferencesEqual(current.subject.reference, reference),
    );
    return assertion?.subjectId;
  }
  function retryExecutionHistoryPersistence(): ExecutionHistoryRetryResult {
    if (ingress.status === "recoveryRequired")
      return { status: "notAttempted", reason: "recoveryProtected" };
    if (durability === "unknown") return { status: "notAttempted", reason: "unknown" };
    if (durability === "durable") return { status: "notAttempted", reason: "alreadyDurable" };
    if (durability === "serializationFailure")
      return { status: "notAttempted", reason: "serializationFailure" };
    return { status: "attempted", persistence: persist() };
  }
  function exportExecutionHistoryEnvelope(): ExecutionHistoryEnvelopeV1 {
    return createExecutionHistoryEnvelope(records, quarantine);
  }
  function exportQuarantinedExecutionHistory(quarantineId: string) {
    const entry = quarantine.find((current) => current.quarantineId === quarantineId);
    return entry
      ? ({ status: "exported", component: cloneQuarantine(entry) } as const)
      : ({ status: "notAvailable", reason: "notFound" } as const);
  }
  function exportProtectedExecutionHistorySource() {
    return ingress.status === "recoveryRequired" && protectedRaw !== undefined
      ? ({ status: "exported", raw: protectedRaw } as const)
      : ({
          status: "notAvailable",
          reason: ingress.status === "recoveryRequired" ? "sourceUnreadable" : "noProtectedSource",
        } as const);
  }
  function removeQuarantinedExecutionHistory(quarantineId: string) {
    if (ingress.status === "recoveryRequired")
      return { status: "notAttempted", reason: "protectedHistoryIngress" } as const;
    if (!quarantine.some((current) => current.quarantineId === quarantineId))
      return { status: "notAttempted", reason: "notFound" } as const;
    quarantine = quarantine.filter((current) => current.quarantineId !== quarantineId);
    desired = cloneAuthority(records, quarantine);
    const persistence =
      authorityMode === "indexedDb" ? ({ status: "pending" } as const) : persist();
    if (authorityMode === "indexedDb") {
      pendingQuarantineRemovals.push(quarantineId);
      setDurability("pending");
      schedulePendingPersistence();
    }
    notifyHistory();
    return { status: "removed", quarantineId, persistence } as const;
  }
  function recheckProtectedExecutionHistorySource() {
    if (ingress.status !== "recoveryRequired") return "noProtectedSource" as const;
    const storage = getStorage();
    if (!storage) return "sourceUnreadable" as const;
    try {
      return storage.getItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY) === protectedRaw
        ? ("unchanged" as const)
        : ("sourceChanged" as const);
    } catch {
      return "sourceUnreadable" as const;
    }
  }
  function recover(action: "replace" | "abandon"): ExecutionHistoryRecoveryResult {
    const checked = recheckProtectedExecutionHistorySource();
    if (checked !== "unchanged") return { status: "notAttempted", reason: checked };
    const priorDesired = desired;
    if (action === "abandon") desired = { records: [], quarantine: [] };
    const persistence = persist();
    if (persistence.status !== "persisted") {
      desired = priorDesired;
      return { status: "notResolved", action, persistence };
    }
    if (action === "abandon") {
      records = [];
      quarantine = [];
      notifyHistory();
    }
    protectedRaw = undefined;
    setIngress({ status: "accepted", quarantinedComponentCount: quarantine.length });
    return { status: "resolved", action, persistence };
  }
  async function clearExecutionHistory(): Promise<PersistenceRemovalOutcome> {
    records = [];
    quarantine = [];
    desired = { records: [], quarantine: [] };
    notifyHistory();
    const storage = getStorage();
    if (authorityMode === "indexedDb") {
      pendingRecords = [];
      pendingQuarantineRemovals = [];
      setDurability("pending");
      const result = await indexedDb.clearEstablishedAuthority();
      if (result.status === "success") {
        try {
          storage?.removeItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY);
        } catch {
          /* retained diagnostic evidence is safe behind marker */
        }
        setDurability("durable");
        setIngress({ status: "accepted", quarantinedComponentCount: 0 });
        return { status: "removed" };
      }
      setDurability("storageFailure");
      return { status: "storageFailure" };
    }
    if (!storage) {
      setDurability("unavailable");
      return { status: "unavailable" };
    }
    try {
      storage.removeItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY);
      protectedRaw = undefined;
      setDurability("durable");
      setIngress({ status: "noSource", reason: "missing" });
      notifyHistory();
      return { status: "removed" };
    } catch {
      setDurability("storageFailure");
      return { status: "storageFailure" };
    }
  }

  return {
    getExecutionHistory,
    getQuarantinedExecutionHistory,
    getExecutionHistoryDurabilityStatus,
    getExecutionHistoryIngressStatus,
    getExecutionOutcome,
    findExecutionSubjectByPlannedReference,
    recordExecution,
    correctExecutionRecord,
    retractExecutionRecord,
    retryExecutionHistoryPersistence,
    exportExecutionHistoryEnvelope,
    exportQuarantinedExecutionHistory,
    exportProtectedExecutionHistorySource,
    removeQuarantinedExecutionHistory,
    recheckProtectedExecutionHistorySource,
    replaceProtectedExecutionHistoryCheckpoint: () => recover("replace"),
    abandonProtectedExecutionHistoryCheckpoint: () => recover("abandon"),
    clearExecutionHistory,
    subscribeExecutionHistory(listener: (value: ExecutionRecordV1[]) => void) {
      historyListeners.add(listener);
      return () => historyListeners.delete(listener);
    },
    subscribeExecutionHistoryDurability(listener: (value: SurfaceDurabilityStatus) => void) {
      durabilityListeners.add(listener);
      return () => durabilityListeners.delete(listener);
    },
    subscribeExecutionHistoryIngress(listener: (value: ExecutionHistoryIngressStatus) => void) {
      ingressListeners.add(listener);
      return () => ingressListeners.delete(listener);
    },
    initializeExecutionHistory,
    getExecutionHistoryMigrationStatus: () => migrationStatus,
    subscribeExecutionHistoryMigration(listener: (value: ExecutionHistoryMigrationStatus) => void) {
      migrationListeners.add(listener);
      return () => migrationListeners.delete(listener);
    },
    retryExecutionHistoryMigration,
    waitForExecutionHistoryPersistence: () => persistenceChain,
    recheckProtectedExecutionHistoryIndexedDbSource,
    replaceProtectedExecutionHistoryIndexedDbCheckpoint: () => recoverIndexedDb("replace"),
    abandonProtectedExecutionHistoryIndexedDbCheckpoint: () => recoverIndexedDb("abandon"),
    getRuntimeAuthorityAdapter(capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid runtime authority capability.");
      return runtimeAdapter;
    },
  };
}

function load(storage: Storage | undefined) {
  const empty = {
    records: [] as ExecutionRecordV1[],
    quarantine: [] as QuarantinedExecutionHistoryComponent[],
  };
  if (!storage)
    return {
      ...empty,
      ingress: {
        status: "noSource",
        reason: "storageUnavailable",
      } as ExecutionHistoryIngressStatus,
      durability: "unavailable" as SurfaceDurabilityStatus,
      protectedRaw: undefined as string | undefined,
    };
  let raw: string | null;
  try {
    raw = storage.getItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY);
  } catch {
    return {
      ...empty,
      ingress: {
        status: "recoveryRequired",
        reason: "readFailure",
        sourcePreserved: false,
      } as ExecutionHistoryIngressStatus,
      durability: "storageFailure" as SurfaceDurabilityStatus,
      protectedRaw: undefined,
    };
  }
  if (raw === null)
    return {
      ...empty,
      ingress: { status: "noSource", reason: "missing" } as ExecutionHistoryIngressStatus,
      durability: "durable" as SurfaceDurabilityStatus,
      protectedRaw: undefined,
    };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return protectedLoad("corruptJson", raw);
  }
  if (
    !record(parsed) ||
    parsed.app !== "DayFrame" ||
    parsed.surface !== "executionHistory" ||
    !Array.isArray(parsed.records) ||
    !Array.isArray(parsed.quarantinedComponents) ||
    !exactKeys(parsed, ["app", "surface", "version", "records", "quarantinedComponents"])
  )
    return protectedLoad("invalidEnvelope", raw);
  if (parsed.version !== EXECUTION_HISTORY_SURFACE_VERSION)
    return protectedLoad("unsupportedVersion", raw);
  const existing = validateStoredQuarantine(parsed.quarantinedComponents);
  if (!existing) return protectedLoad("invalidEnvelope", raw);
  const isolated = isolateComponents(parsed.records);
  const quarantine = canonicalQuarantine([...existing, ...isolated.quarantine]);
  return {
    records: canonicalRecords(isolated.records),
    quarantine,
    ingress: {
      status: "accepted",
      quarantinedComponentCount: quarantine.length,
    } as ExecutionHistoryIngressStatus,
    durability: "durable" as SurfaceDurabilityStatus,
    protectedRaw: undefined,
  };
}

function isolateComponents(rawRecords: unknown[]): {
  records: ExecutionRecordV1[];
  quarantine: QuarantinedExecutionHistoryComponent[];
} {
  const groups = new Map<string, { raw: unknown[]; indexes: number[] }>();
  rawRecords.forEach((raw, index) => {
    const key =
      record(raw) && isExecutionSubjectId(raw.subjectId) ? raw.subjectId : `orphan:${index}`;
    const group = groups.get(key) ?? { raw: [], indexes: [] };
    group.raw.push(cloneRaw(raw));
    group.indexes.push(index);
    groups.set(key, group);
  });
  const quarantineKeys = new Map<string, ExecutionHistoryQuarantineReason>();
  const claimedRecordIds = new Map<string, string[]>();
  const replacementClaims: { from: string; targetId: string }[] = [];
  for (const [key, group] of groups) {
    if (key.startsWith("orphan:")) {
      quarantineKeys.set(key, "orphanRecord");
      continue;
    }
    for (const raw of group.raw) {
      if (record(raw) && typeof raw.id === "string")
        claimedRecordIds.set(raw.id, [...(claimedRecordIds.get(raw.id) ?? []), key]);
      if (record(raw) && typeof raw.replacesRecordId === "string")
        replacementClaims.push({ from: key, targetId: raw.replacesRecordId });
    }
  }
  for (const keys of claimedRecordIds.values())
    if (new Set(keys).size > 1 || keys.length > 1) {
      for (const key of keys) quarantineKeys.set(key, "duplicateRecordId");
    }
  for (const claim of replacementClaims) {
    const targets = claimedRecordIds.get(claim.targetId) ?? [];
    for (const target of targets)
      if (target !== claim.from) {
        quarantineKeys.set(claim.from, "crossSubjectReplacement");
        quarantineKeys.set(target, "crossSubjectReplacement");
      }
  }
  const planned: { key: string; reference: DurableOccurrenceReference }[] = [];
  for (const [key, group] of groups) {
    for (const raw of group.raw)
      if (
        record(raw) &&
        raw.kind === "assertion" &&
        record(raw.subject) &&
        raw.subject.kind === "planned" &&
        record(raw.subject.reference)
      ) {
        const validation = validateExecutionRecord(raw);
        if (
          validation.status === "valid" &&
          validation.record.kind === "assertion" &&
          validation.record.subject.kind === "planned"
        ) {
          planned.push({ key, reference: validation.record.subject.reference });
          break;
        }
      }
  }
  for (let left = 0; left < planned.length; left += 1)
    for (let right = left + 1; right < planned.length; right += 1) {
      if (
        planned[left]!.key !== planned[right]!.key &&
        durableOccurrenceReferencesEqual(planned[left]!.reference, planned[right]!.reference)
      ) {
        if (!quarantineKeys.has(planned[left]!.key))
          quarantineKeys.set(planned[left]!.key, "duplicatePlannedReference");
        if (!quarantineKeys.has(planned[right]!.key))
          quarantineKeys.set(planned[right]!.key, "duplicatePlannedReference");
      }
    }
  const valid: ExecutionRecordV1[] = [];
  for (const [key, group] of groups) {
    if (quarantineKeys.has(key)) continue;
    const validation = validateExecutionRecordCollection(group.raw);
    if (validation.status === "valid") valid.push(...validation.records);
    else quarantineKeys.set(key, mapIssue(validation.issues[0]?.code, group.raw));
  }
  const quarantine = [...quarantineKeys].map(([key, reason]) => {
    const group = groups.get(key)!;
    return makeQuarantine(group.raw, reason, group.indexes[0] ?? 0);
  });
  return { records: valid, quarantine };
}

function mapIssue(
  code: ExecutionCollectionIssueCode | undefined,
  raw: unknown[],
): ExecutionHistoryQuarantineReason {
  if (raw.some((value) => validateExecutionRecord(value).status === "unsupportedVersion"))
    return "unsupportedRecordVersion";
  return code ?? "invalidRecord";
}

function makeQuarantine(
  rawRecords: unknown[],
  reason: ExecutionHistoryQuarantineReason,
  index: number,
): QuarantinedExecutionHistoryComponent {
  const serialized = safeStringify(rawRecords);
  let hash = 2166136261;
  for (const character of serialized) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return {
    quarantineId: `execution-history-quarantine-${(hash >>> 0).toString(16)}-${index}`,
    reason,
    rawRecords: cloneRaw(rawRecords),
    knownSubjectIds: unique(
      rawRecords.flatMap((value) =>
        record(value) && typeof value.subjectId === "string" ? [value.subjectId] : [],
      ),
    ),
    knownRecordIds: unique(
      rawRecords.flatMap((value) =>
        record(value) && typeof value.id === "string" ? [value.id] : [],
      ),
    ),
  };
}

export function createExecutionHistoryEnvelope(
  records: readonly ExecutionRecordV1[],
  quarantine: readonly QuarantinedExecutionHistoryComponent[],
): ExecutionHistoryEnvelopeV1 {
  return {
    app: "DayFrame",
    surface: "executionHistory",
    version: EXECUTION_HISTORY_SURFACE_VERSION,
    records: canonicalRecords(records).map(cloneExecutionRecord),
    quarantinedComponents: canonicalQuarantine(quarantine),
  };
}

export function buildExecutionHistoryRuntimeTarget(
  envelopeValue: unknown,
):
  | { status: "valid"; target: ExecutionHistoryRuntimeSnapshot }
  | { status: "invalid"; reason: string } {
  const checked = validateExecutionHistoryEnvelope(envelopeValue);
  if (checked.status === "invalid") return checked;
  const { records, quarantinedComponents: quarantine } = checked.envelope;
  return {
    status: "valid",
    target: {
      records: records.map(cloneExecutionRecord),
      quarantine: quarantine.map(cloneQuarantine),
      desired: cloneAuthority(records, quarantine),
      pendingRecords: [],
      pendingQuarantineRemovals: [],
      durability: "durable",
      ingress: { status: "accepted", quarantinedComponentCount: quarantine.length },
      authorityMode: "indexedDb",
      migrationStatus: "readyIndexedDb",
    },
  };
}

export function validateExecutionHistoryEnvelope(
  value: unknown,
):
  | { status: "valid"; envelope: ExecutionHistoryEnvelopeV1 }
  | { status: "invalid"; reason: "invalidEnvelope" | "unsupportedVersion" } {
  if (
    !record(value) ||
    value.app !== "DayFrame" ||
    value.surface !== "executionHistory" ||
    !Array.isArray(value.records) ||
    !Array.isArray(value.quarantinedComponents) ||
    !exactKeys(value, ["app", "surface", "version", "records", "quarantinedComponents"])
  )
    return { status: "invalid", reason: "invalidEnvelope" };
  if (value.version !== EXECUTION_HISTORY_SURFACE_VERSION)
    return { status: "invalid", reason: "unsupportedVersion" };
  const existing = validateStoredQuarantine(value.quarantinedComponents);
  if (!existing) return { status: "invalid", reason: "invalidEnvelope" };
  const isolated = isolateComponents(value.records);
  return {
    status: "valid",
    envelope: createExecutionHistoryEnvelope(
      isolated.records,
      canonicalQuarantine([...existing, ...isolated.quarantine]),
    ),
  };
}

function validateStoredQuarantine(
  values: unknown[],
): QuarantinedExecutionHistoryComponent[] | undefined {
  const result: QuarantinedExecutionHistoryComponent[] = [];
  for (const value of values) {
    if (
      !record(value) ||
      !exactKeys(value, [
        "quarantineId",
        "reason",
        "rawRecords",
        "knownSubjectIds",
        "knownRecordIds",
      ]) ||
      typeof value.quarantineId !== "string" ||
      typeof value.reason !== "string" ||
      !Array.isArray(value.rawRecords) ||
      !Array.isArray(value.knownSubjectIds) ||
      !value.knownSubjectIds.every((entry) => typeof entry === "string") ||
      !Array.isArray(value.knownRecordIds) ||
      !value.knownRecordIds.every((entry) => typeof entry === "string")
    )
      return undefined;
    result.push(cloneQuarantine(value as unknown as QuarantinedExecutionHistoryComponent));
  }
  return result;
}

function verifySerialized(
  raw: string | null,
  desired: { records: ExecutionRecordV1[]; quarantine: QuarantinedExecutionHistoryComponent[] },
): boolean {
  if (raw === null) return false;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      !record(parsed) ||
      parsed.app !== "DayFrame" ||
      parsed.surface !== "executionHistory" ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.records) ||
      !Array.isArray(parsed.quarantinedComponents)
    )
      return false;
    const recordsValidation = validateExecutionRecordCollection(parsed.records);
    const storedQuarantine = validateStoredQuarantine(parsed.quarantinedComponents);
    return (
      recordsValidation.status === "valid" &&
      storedQuarantine !== undefined &&
      JSON.stringify(
        createExecutionHistoryEnvelope(recordsValidation.records, storedQuarantine),
      ) === JSON.stringify(createExecutionHistoryEnvelope(desired.records, desired.quarantine))
    );
  } catch {
    return false;
  }
}

function canonicalRecords(records: readonly ExecutionRecordV1[]): ExecutionRecordV1[] {
  const bySubject = new Map<string, ExecutionRecordV1[]>();
  for (const current of records)
    bySubject.set(current.subjectId, [...(bySubject.get(current.subjectId) ?? []), current]);
  const ordered: ExecutionRecordV1[] = [];
  for (const subjectId of [...bySubject.keys()].sort()) {
    const group = bySubject.get(subjectId)!;
    const byPrevious = new Map<string | undefined, ExecutionRecordV1>();
    for (const current of group) byPrevious.set(current.replacesRecordId, current);
    let current = byPrevious.get(undefined);
    const seen = new Set<string>();
    while (current && !seen.has(current.id)) {
      ordered.push(cloneExecutionRecord(current));
      seen.add(current.id);
      current = byPrevious.get(current.id);
    }
    for (const remainder of group
      .filter((entry) => !seen.has(entry.id))
      .sort((a, b) => a.id.localeCompare(b.id)))
      ordered.push(cloneExecutionRecord(remainder));
  }
  return ordered;
}

function canonicalQuarantine(
  values: readonly QuarantinedExecutionHistoryComponent[],
): QuarantinedExecutionHistoryComponent[] {
  return values
    .map(cloneQuarantine)
    .sort((left, right) => left.quarantineId.localeCompare(right.quarantineId));
}
function cloneAuthority(
  records: ExecutionRecordV1[],
  quarantine: QuarantinedExecutionHistoryComponent[],
) {
  return {
    records: records.map(cloneExecutionRecord),
    quarantine: quarantine.map(cloneQuarantine),
  };
}
function cloneQuarantine(
  value: QuarantinedExecutionHistoryComponent,
): QuarantinedExecutionHistoryComponent {
  return {
    ...value,
    rawRecords: cloneRaw(value.rawRecords),
    knownSubjectIds: [...value.knownSubjectIds],
    knownRecordIds: [...value.knownRecordIds],
  };
}
function protectedLoad(
  reason: "corruptJson" | "invalidEnvelope" | "unsupportedVersion",
  raw: string,
) {
  return {
    records: [] as ExecutionRecordV1[],
    quarantine: [] as QuarantinedExecutionHistoryComponent[],
    ingress: {
      status: "recoveryRequired",
      reason,
      sourcePreserved: true,
    } as ExecutionHistoryIngressStatus,
    durability: "unknown" as SurfaceDurabilityStatus,
    protectedRaw: raw,
  };
}
function exactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => key in value);
}
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}
function unique(values: string[]): string[] {
  return [...new Set(values)].sort();
}
function cloneRaw<T>(value: T): T {
  return value === undefined ? value : structuredClone(value);
}
function getStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readAuthorityMarker(storage: Storage | undefined): boolean {
  try {
    return storage?.getItem(EXECUTION_HISTORY_AUTHORITY_MARKER_KEY) === "1";
  } catch {
    return false;
  }
}
function writeAuthorityMarker(storage: Storage | undefined): boolean {
  if (!storage) return false;
  try {
    storage.setItem(EXECUTION_HISTORY_AUTHORITY_MARKER_KEY, "1");
    return storage.getItem(EXECUTION_HISTORY_AUTHORITY_MARKER_KEY) === "1";
  } catch {
    return false;
  }
}
function readLegacyRaw(storage: Storage | undefined): string | null | undefined {
  if (!storage) return undefined;
  try {
    return storage.getItem(DAYFRAME_EXECUTION_HISTORY_STORAGE_KEY);
  } catch {
    return undefined;
  }
}
function fingerprintLegacy(raw: string | null | undefined): string {
  const value = raw === null ? "missing" : raw === undefined ? "unreadable" : raw;
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}
function emptyEstablishedLoad() {
  return {
    records: [] as ExecutionRecordV1[],
    quarantine: [] as QuarantinedExecutionHistoryComponent[],
    ingress: { status: "noSource", reason: "missing" } as ExecutionHistoryIngressStatus,
    durability: "unknown" as SurfaceDurabilityStatus,
    protectedRaw: undefined as string | undefined,
  };
}
