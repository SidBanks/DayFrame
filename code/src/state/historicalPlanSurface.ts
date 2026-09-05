import {
  arePlanPublicationBatchesSemanticallyEqual,
  historicalPlanBatchFingerprint,
  historicalPlanDayFingerprint,
} from "../core/historicalPlan/historicalPlanFingerprint.js";
import {
  cloneHistoricalPlanDay,
  clonePlanPublicationBatch,
  type HistoricalPlanDayPublicationV1,
  type PlanPublicationBatchV1,
} from "../core/historicalPlan/historicalPlan.js";
import { getEffectiveHistoricalPlanDay } from "../core/historicalPlan/historicalPlanProjection.js";
import { validatePlanPublicationBatch } from "../core/historicalPlan/historicalPlanValidation.js";
import {
  createDayFrameDurableDb,
  HISTORICAL_PLAN_BATCH_STORE,
  HISTORICAL_PLAN_DAY_BATCH_INDEX,
  HISTORICAL_PLAN_DAY_AS_OF_INDEX,
  HISTORICAL_PLAN_DAY_DATE_INDEX,
  HISTORICAL_PLAN_DAY_STORE,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import type {
  DurableStorageError,
  IndexedDbCollectionStorage,
} from "../infrastructure/storage/indexedDbCollectionStorage.js";
import type { DayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  type RuntimeAuthorityAdapter,
} from "./dayFrameRuntimeAuthority.js";

export type HistoricalPlanDurabilityStatus =
  | { status: "initializing" }
  | { status: "ready"; pendingCount: 0 }
  | { status: "pending"; pendingCount: number }
  | { status: "failed"; pendingCount: number; error: DurableStorageError }
  | { status: "protected"; reason: HistoricalPlanProtectionReason }
  | { status: "unavailable"; error: DurableStorageError };
export type HistoricalPlanProtectionReason =
  | "invalidBatchMetadata"
  | "invalidBatch"
  | "physicalMismatch"
  | "conflictingBatchId"
  | "unsupportedVersion";
export type HistoricalPlanPublicationResult =
  | { status: "publishedAndDurable"; batch: PlanPublicationBatchV1 }
  | {
      status: "publishedPendingDurability";
      batch: PlanPublicationBatchV1;
      error: DurableStorageError;
    }
  | { status: "identicalNoOp" }
  | { status: "publicationBlockedProtected" }
  | { status: "materializationUnavailable"; batch: PlanPublicationBatchV1 }
  | { status: "invalidCandidate" };
export type HistoricalPlanDayReadResult =
  | {
      status: "available";
      day: HistoricalPlanDayPublicationV1;
      batchId: string;
      publishedAt: string;
      durability: "durable" | "pending";
    }
  | { status: "unavailableNoPublication"; userDayDate: string }
  | { status: "unavailableProtected"; reason: HistoricalPlanProtectionReason }
  | { status: "unavailable"; error: DurableStorageError };
export type HistoricalPlanRangeReadResult =
  | {
      status: "available";
      days: Array<Extract<HistoricalPlanDayReadResult, { status: "available" }>>;
      missingDays: string[];
    }
  | Extract<HistoricalPlanDayReadResult, { status: "unavailableProtected" | "unavailable" }>;
export type HistoricalPlanEvent =
  | { type: "publicationAccepted"; batchId: string }
  | { type: "historyCleared" }
  | { type: "recoveryChanged" };

export type PhysicalHistoricalPlanBatchRecord = {
  batchId: string;
  publishedAt: string;
  surfaceVersion: number;
  batchVersion: number;
  rangeStart: string;
  rangeEnd: string;
  dayDates: string[];
  fingerprint: string;
};
export type PhysicalHistoricalPlanDayRecord = {
  batchId: string;
  publishedAt: string;
  userDayDate: string;
  fingerprint: string;
  dayPublication: HistoricalPlanDayPublicationV1;
};
type PhysicalBatchRecord = PhysicalHistoricalPlanBatchRecord;
type PhysicalDayRecord = PhysicalHistoricalPlanDayRecord;
export type HistoricalPlanRuntimeSnapshot = {
  status: HistoricalPlanDurabilityStatus;
  pending: PlanPublicationBatchV1[];
  batchMetadata: PhysicalBatchRecord[];
  protectedEvidence?: string;
};

export function createHistoricalPlanSurface(
  options: {
    storage?: IndexedDbCollectionStorage;
    notificationScheduler?: DayFrameNotificationScheduler;
  } = {},
) {
  const storage = options.storage ?? createDayFrameDurableDb();
  let status: HistoricalPlanDurabilityStatus = { status: "initializing" };
  let pending: PlanPublicationBatchV1[] = [];
  let batchMetadata: PhysicalBatchRecord[] = [];
  let initialization: Promise<void> | undefined;
  let publicationChain: Promise<void> = Promise.resolve();
  let protectedEvidence: string | undefined;
  let protectedEvidenceLoading: Promise<void> | undefined;
  const statusListeners = new Set<(value: HistoricalPlanDurabilityStatus) => void>();
  const historyListeners = new Set<(event: HistoricalPlanEvent) => void>();
  const runtimeAdapter: RuntimeAuthorityAdapter<HistoricalPlanRuntimeSnapshot> = {
    id: "historicalPlan",
    captureRuntimeSnapshot: () => {
      if (protectedEvidenceLoading)
        throw new Error("HistoricalPlan protection evidence is still loading.");
      return structuredClone({
        status,
        pending,
        batchMetadata,
        ...(protectedEvidence === undefined ? {} : { protectedEvidence }),
      });
    },
    installRuntimeExact: (target) => {
      status = structuredClone(target.status);
      pending = target.pending.map(clonePlanPublicationBatch);
      batchMetadata = structuredClone(target.batchMetadata);
      protectedEvidence = target.protectedEvidence;
      protectedEvidenceLoading = undefined;
      options.notificationScheduler?.notify("historicalPlan", () => {
        for (const listener of statusListeners) listener(structuredClone(status));
        emitHistory({ type: "recoveryChanged" });
      });
    },
  };

  function initialize(): Promise<void> {
    if (initialization) return initialization;
    initialization = (async () => {
      const opened = await storage.open();
      if (opened.status === "failure") {
        setStatus({
          status: opened.error.code === "unavailable" ? "unavailable" : "protected",
          ...(opened.error.code === "unavailable"
            ? { error: opened.error }
            : { reason: "physicalMismatch" as const }),
        } as HistoricalPlanDurabilityStatus);
        return;
      }
      const loaded = await storage.getAll<PhysicalBatchRecord>(HISTORICAL_PLAN_BATCH_STORE);
      if (loaded.status === "failure") {
        setStatus({ status: "unavailable", error: loaded.error });
        return;
      }
      if (!loaded.value.every(validBatchMetadata)) {
        setStatus({ status: "protected", reason: "invalidBatchMetadata" });
        return;
      }
      batchMetadata = structuredClone(loaded.value).sort(compareMetadata);
      setStatus(
        pending.length
          ? { status: "pending", pendingCount: pending.length }
          : { status: "ready", pendingCount: 0 },
      );
      if (pending.length) await retryPendingPublications();
    })();
    return initialization;
  }

  function publish(batchValue: PlanPublicationBatchV1): Promise<HistoricalPlanPublicationResult> {
    const result = publicationChain.then(() => publishOne(batchValue, true));
    publicationChain = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  async function publishOne(
    batchValue: PlanPublicationBatchV1,
    retainFailedForRetry: boolean,
  ): Promise<HistoricalPlanPublicationResult> {
    const checked = validatePlanPublicationBatch(batchValue);
    if (checked.status === "invalid") return { status: "invalidCandidate" };
    await initialize();
    if (status.status === "protected") return { status: "publicationBlockedProtected" };
    if (status.status === "unavailable")
      return {
        status: "materializationUnavailable",
        batch: clonePlanPublicationBatch(checked.batch),
      };
    const classification = await candidateIsIdentical(checked.batch);
    if (classification === "protected") return { status: "publicationBlockedProtected" };
    if (classification === true) return { status: "identicalNoOp" };
    if (retainFailedForRetry) {
      pending.push(clonePlanPublicationBatch(checked.batch));
      setStatus({ status: "pending", pendingCount: pending.length });
      emitHistory({ type: "publicationAccepted", batchId: checked.batch.id });
    }
    const persisted = await persistBatch(checked.batch);
    if (persisted.status === "success") {
      pending = pending.filter((current) => current.id !== checked.batch.id);
      upsertMetadata(toBatchRecord(checked.batch));
      setStatus(
        pending.length
          ? { status: "pending", pendingCount: pending.length }
          : { status: "ready", pendingCount: 0 },
      );
      if (!retainFailedForRetry)
        emitHistory({ type: "publicationAccepted", batchId: checked.batch.id });
      return { status: "publishedAndDurable", batch: clonePlanPublicationBatch(checked.batch) };
    }
    if (!retainFailedForRetry)
      return {
        status: "materializationUnavailable",
        batch: clonePlanPublicationBatch(checked.batch),
      };
    setStatus({ status: "failed", pendingCount: pending.length, error: persisted.error });
    return {
      status: "publishedPendingDurability",
      batch: clonePlanPublicationBatch(checked.batch),
      error: persisted.error,
    };
  }

  function publishAtomically(
    batchValue: PlanPublicationBatchV1,
  ): Promise<HistoricalPlanPublicationResult> {
    const result = publicationChain.then(() => publishOne(batchValue, false));
    publicationChain = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  async function retryPendingPublications(): Promise<{
    status: "durable" | "failed" | "notAttempted";
    pendingCount: number;
  }> {
    await initialize();
    if (status.status === "protected" || status.status === "unavailable" || !pending.length)
      return { status: "notAttempted", pendingCount: pending.length };
    for (const batch of [...pending].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))) {
      const result = await persistBatch(batch);
      if (result.status === "failure") {
        setStatus({ status: "failed", pendingCount: pending.length, error: result.error });
        return { status: "failed", pendingCount: pending.length };
      }
      pending = pending.filter((current) => current.id !== batch.id);
      upsertMetadata(toBatchRecord(batch));
    }
    setStatus({ status: "ready", pendingCount: 0 });
    return { status: "durable", pendingCount: 0 };
  }

  async function persistBatch(batch: PlanPublicationBatchV1) {
    const existing = await storage.get<PhysicalBatchRecord>(HISTORICAL_PLAN_BATCH_STORE, batch.id);
    if (existing.status === "failure") return existing;
    if (existing.value) {
      const reconstructed = await readPhysicalBatch(existing.value);
      if (
        reconstructed.status === "success" &&
        reconstructed.batch.id === batch.id &&
        reconstructed.batch.publishedAt === batch.publishedAt &&
        arePlanPublicationBatchesSemanticallyEqual(reconstructed.batch, batch)
      )
        return { status: "success" as const, value: undefined };
      setStatus({ status: "protected", reason: "conflictingBatchId" });
      return {
        status: "failure" as const,
        error: { code: "constraintViolation" as const, operation: "persistHistoricalPlanBatch" },
      };
    }
    const result = await storage.mutate([
      { type: "put", store: HISTORICAL_PLAN_BATCH_STORE, value: toBatchRecord(batch) },
      ...batch.days.map((day) => ({
        type: "put" as const,
        store: HISTORICAL_PLAN_DAY_STORE,
        value: toDayRecord(batch, day),
      })),
    ]);
    if (result.status === "failure") return result;
    const verified = await storage.get<PhysicalBatchRecord>(HISTORICAL_PLAN_BATCH_STORE, batch.id);
    if (verified.status === "failure") return verified;
    if (!verified.value)
      return {
        status: "failure" as const,
        error: { code: "readFailed" as const, operation: "verifyHistoricalPlanBatch" },
      };
    const reconstructed = await readPhysicalBatch(verified.value);
    if (
      reconstructed.status !== "success" ||
      reconstructed.batch.id !== batch.id ||
      reconstructed.batch.publishedAt !== batch.publishedAt ||
      !arePlanPublicationBatchesSemanticallyEqual(reconstructed.batch, batch)
    ) {
      setStatus({ status: "protected", reason: "physicalMismatch" });
      return {
        status: "failure" as const,
        error: { code: "readFailed" as const, operation: "verifyHistoricalPlanBatch" },
      };
    }
    return { status: "success" as const, value: undefined };
  }

  async function getHistoricalPlanDay(
    userDayDate: string,
    asOf: string,
  ): Promise<HistoricalPlanDayReadResult> {
    await initialize();
    if (status.status === "protected")
      return { status: "unavailableProtected", reason: status.reason };
    if (status.status === "unavailable") return { status: "unavailable", error: status.error };
    const durable = await readDurableDayCandidates(userDayDate, asOf);
    if (durable.status !== "success") return durable.result;
    const pendingCandidates = pending.flatMap((batch) =>
      batch.publishedAt <= asOf
        ? batch.days.filter((day) => day.userDayDate === userDayDate).map((day) => ({ batch, day }))
        : [],
    );
    const candidates = [
      ...durable.candidates,
      ...pendingCandidates.map(({ batch, day }) => ({
        batch,
        day,
        durability: "pending" as const,
      })),
    ];
    candidates.sort((a, b) => a.batch.publishedAt.localeCompare(b.batch.publishedAt));
    const latest = candidates[candidates.length - 1];
    return latest
      ? {
          status: "available",
          day: cloneHistoricalPlanDay(latest.day),
          batchId: latest.batch.id,
          publishedAt: latest.batch.publishedAt,
          durability: latest.durability,
        }
      : { status: "unavailableNoPublication", userDayDate };
  }

  async function getHistoricalPlanRange(
    start: string,
    end: string,
    asOf: string,
  ): Promise<HistoricalPlanRangeReadResult> {
    const values = dates(start, end);
    if (!values) return { status: "unavailableProtected", reason: "invalidBatch" };
    const days: Array<Extract<HistoricalPlanDayReadResult, { status: "available" }>> = [];
    const missingDays: string[] = [];
    for (const date of values) {
      const result = await getHistoricalPlanDay(date, asOf);
      if (result.status === "available") days.push(result);
      else if (result.status === "unavailableNoPublication") missingDays.push(date);
      else return result;
    }
    return { status: "available", days, missingDays };
  }

  async function readDurableDayCandidates(
    userDayDate: string,
    asOf: string,
  ): Promise<
    | {
        status: "success";
        candidates: Array<{
          batch: PlanPublicationBatchV1;
          day: HistoricalPlanDayPublicationV1;
          durability: "durable";
        }>;
      }
    | { status: "failure"; result: HistoricalPlanDayReadResult }
  > {
    const keyRange = globalThis.IDBKeyRange;
    const records = keyRange
      ? await storage.queryIndex<PhysicalDayRecord>({
          store: HISTORICAL_PLAN_DAY_STORE,
          index: HISTORICAL_PLAN_DAY_AS_OF_INDEX,
          query: keyRange.bound([userDayDate, ""], [userDayDate, asOf]),
          direction: "prev",
        })
      : await storage.queryIndex<PhysicalDayRecord>({
          store: HISTORICAL_PLAN_DAY_STORE,
          index: HISTORICAL_PLAN_DAY_DATE_INDEX,
          query: userDayDate,
        });
    if (records.status === "failure")
      return { status: "failure", result: { status: "unavailable", error: records.error } };
    const relevant = records.value
      .filter((record) => typeof record.publishedAt === "string" && record.publishedAt <= asOf)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    const candidates: Array<{
      batch: PlanPublicationBatchV1;
      day: HistoricalPlanDayPublicationV1;
      durability: "durable";
    }> = [];
    for (const record of relevant) {
      const metadata = await storage.get<PhysicalBatchRecord>(
        HISTORICAL_PLAN_BATCH_STORE,
        record.batchId,
      );
      if (metadata.status === "failure")
        return { status: "failure", result: { status: "unavailable", error: metadata.error } };
      if (!metadata.value) return protect("physicalMismatch");
      const reconstructed = await readPhysicalBatch(metadata.value);
      if (reconstructed.status !== "success") return protect(reconstructed.reason);
      const day = reconstructed.batch.days.find((value) => value.userDayDate === userDayDate);
      if (!day || !validDayRecord(record, reconstructed.batch, day))
        return protect("physicalMismatch");
      candidates.push({ batch: reconstructed.batch, day, durability: "durable" });
    }
    const pure = getEffectiveHistoricalPlanDay({
      batches: candidates.map((value) => value.batch),
      userDayDate,
      asOf,
    });
    if (pure.status === "invalid") return protect("invalidBatch");
    return { status: "success", candidates };
  }

  async function readPhysicalBatch(
    metadata: PhysicalBatchRecord,
  ): Promise<
    | { status: "success"; batch: PlanPublicationBatchV1 }
    | { status: "failure"; reason: HistoricalPlanProtectionReason }
  > {
    if (!validBatchMetadata(metadata)) return { status: "failure", reason: "invalidBatchMetadata" };
    const daysResult = await storage.queryIndex<PhysicalDayRecord>({
      store: HISTORICAL_PLAN_DAY_STORE,
      index: HISTORICAL_PLAN_DAY_BATCH_INDEX,
      query: metadata.batchId,
    });
    if (daysResult.status === "failure") return { status: "failure", reason: "physicalMismatch" };
    const days = daysResult.value.map((record) => record.dayPublication);
    const candidate = {
      surfaceVersion: metadata.surfaceVersion,
      version: metadata.batchVersion,
      id: metadata.batchId,
      publishedAt: metadata.publishedAt,
      range: { startUserDayDate: metadata.rangeStart, endUserDayDate: metadata.rangeEnd },
      days,
    };
    const checked = validatePlanPublicationBatch(candidate);
    if (checked.status === "invalid")
      return {
        status: "failure",
        reason: checked.issues.some((issue) => issue.code === "unsupportedVersion")
          ? "unsupportedVersion"
          : "invalidBatch",
      };
    if (
      metadata.fingerprint !== historicalPlanBatchFingerprint(checked.batch) ||
      metadata.dayDates.join("|") !== checked.batch.days.map((day) => day.userDayDate).join("|") ||
      daysResult.value.some((record) => {
        const day = checked.batch.days.find((value) => value.userDayDate === record.userDayDate);
        return !day || !validDayRecord(record, checked.batch, day);
      })
    )
      return { status: "failure", reason: "physicalMismatch" };
    return { status: "success", batch: checked.batch };
  }

  async function candidateIsIdentical(
    batch: PlanPublicationBatchV1,
  ): Promise<boolean | "protected"> {
    for (const day of batch.days) {
      const result = await getHistoricalPlanDay(day.userDayDate, batch.publishedAt);
      if (result.status === "unavailableProtected" || result.status === "unavailable")
        return "protected";
      if (
        result.status !== "available" ||
        historicalPlanDayFingerprint(result.day) !== historicalPlanDayFingerprint(day)
      )
        return false;
    }
    return true;
  }

  async function exportHistoricalPlan() {
    await initialize();
    if (status.status === "protected")
      return { status: "protected" as const, reason: status.reason };
    const batches: PlanPublicationBatchV1[] = [];
    for (const metadata of batchMetadata) {
      const value = await readPhysicalBatch(metadata);
      if (value.status !== "success") return { status: "protected" as const, reason: value.reason };
      batches.push(value.batch);
    }
    return {
      status: "exported" as const,
      surfaceVersion: 1,
      batches: [...batches, ...pending]
        .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))
        .map(clonePlanPublicationBatch),
    };
  }

  async function clearHistoricalPlan() {
    await initialize();
    const result = await storage.mutate([
      { type: "clear", store: HISTORICAL_PLAN_BATCH_STORE },
      { type: "clear", store: HISTORICAL_PLAN_DAY_STORE },
    ]);
    if (result.status === "failure") return result;
    pending = [];
    batchMetadata = [];
    setStatus({ status: "ready", pendingCount: 0 });
    emitHistory({ type: "historyCleared" });
    return result;
  }

  async function abandonProtectedHistoricalPlan() {
    if (status.status !== "protected") return { status: "notAttempted" as const };
    if ((await recheckProtectedSource()) !== "unchanged")
      return { status: "sourceChanged" as const };
    const result = await clearHistoricalPlan();
    if (result.status === "failure") return { status: "failed" as const, error: result.error };
    emitHistory({ type: "recoveryChanged" });
    return { status: "resolved" as const };
  }

  async function recheckProtectedSource(): Promise<
    "unchanged" | "sourceChanged" | "sourceUnreadable" | "noProtectedSource"
  > {
    if (status.status !== "protected" || (!protectedEvidence && !protectedEvidenceLoading))
      return "noProtectedSource";
    await protectedEvidenceLoading;
    const expected = protectedEvidence;
    const current = await readPhysicalEvidence();
    if (expected === undefined || current === undefined) return "sourceUnreadable";
    return expected === current ? "unchanged" : "sourceChanged";
  }

  async function exportProtectedSource() {
    if (status.status !== "protected") return { status: "notAvailable" as const };
    const value = await readPhysicalEvidence();
    return value === undefined
      ? { status: "notAvailable" as const }
      : { status: "exported" as const, value };
  }

  async function readPhysicalEvidence(): Promise<string | undefined> {
    const batches = await storage.getAll<unknown>(HISTORICAL_PLAN_BATCH_STORE);
    const days = await storage.getAll<unknown>(HISTORICAL_PLAN_DAY_STORE);
    if (batches.status === "failure" || days.status === "failure") return undefined;
    return JSON.stringify({ batches: batches.value, days: days.value });
  }

  function getStatus(): HistoricalPlanDurabilityStatus {
    return structuredClone(status);
  }
  function getPendingPublications(): PlanPublicationBatchV1[] {
    return pending.map(clonePlanPublicationBatch);
  }
  function subscribeStatus(listener: (value: HistoricalPlanDurabilityStatus) => void) {
    statusListeners.add(listener);
    return () => statusListeners.delete(listener);
  }
  function subscribeHistory(listener: (event: HistoricalPlanEvent) => void) {
    historyListeners.add(listener);
    return () => historyListeners.delete(listener);
  }
  function close() {
    storage.close();
  }
  function setStatus(next: HistoricalPlanDurabilityStatus) {
    status = next;
    for (const listener of statusListeners) listener(structuredClone(next));
  }
  function emitHistory(event: HistoricalPlanEvent) {
    for (const listener of historyListeners) listener({ ...event });
  }
  function protect(reason: HistoricalPlanProtectionReason): {
    status: "failure";
    result: HistoricalPlanDayReadResult;
  } {
    if (!protectedEvidence && !protectedEvidenceLoading)
      protectedEvidenceLoading = readPhysicalEvidence().then((value) => {
        protectedEvidence = value;
        protectedEvidenceLoading = undefined;
      });
    setStatus({ status: "protected", reason });
    return { status: "failure", result: { status: "unavailableProtected", reason } };
  }
  function upsertMetadata(value: PhysicalBatchRecord) {
    batchMetadata = [
      ...batchMetadata.filter((item) => item.batchId !== value.batchId),
      structuredClone(value),
    ].sort(compareMetadata);
  }

  return {
    initialize,
    publish,
    publishAtomically,
    retryPendingPublications,
    getHistoricalPlanDay,
    getHistoricalPlanRange,
    exportHistoricalPlan,
    exportProtectedSource,
    recheckProtectedSource,
    clearHistoricalPlan,
    abandonProtectedHistoricalPlan,
    getStatus,
    getPendingPublications,
    subscribeStatus,
    subscribeHistory,
    close,
    getRuntimeAuthorityAdapter(capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid runtime authority capability.");
      return runtimeAdapter;
    },
  };
}

export type HistoricalPlanSurface = ReturnType<typeof createHistoricalPlanSurface>;
export function buildHistoricalPlanRuntimeTarget(
  value: unknown,
):
  | { status: "valid"; target: HistoricalPlanRuntimeSnapshot; batches: PlanPublicationBatchV1[] }
  | { status: "invalid"; reason: HistoricalPlanProtectionReason } {
  if (
    !record(value) ||
    !exact(value, ["batches", "days"]) ||
    !Array.isArray(value.batches) ||
    !Array.isArray(value.days)
  )
    return { status: "invalid", reason: "physicalMismatch" };
  if (!value.batches.every(validBatchMetadata))
    return { status: "invalid", reason: "invalidBatchMetadata" };
  const days = value.days as unknown[];
  const batches: PlanPublicationBatchV1[] = [];
  const seenBatchIds = new Set<string>();
  let matchedDayCount = 0;
  for (const metadata of value.batches as PhysicalBatchRecord[]) {
    if (seenBatchIds.has(metadata.batchId))
      return { status: "invalid", reason: "conflictingBatchId" };
    seenBatchIds.add(metadata.batchId);
    const physicalDays = days.filter(
      (item): item is PhysicalDayRecord => record(item) && item.batchId === metadata.batchId,
    );
    matchedDayCount += physicalDays.length;
    if (physicalDays.length !== metadata.dayDates.length)
      return { status: "invalid", reason: "physicalMismatch" };
    const candidate = {
      surfaceVersion: metadata.surfaceVersion,
      version: metadata.batchVersion,
      id: metadata.batchId,
      publishedAt: metadata.publishedAt,
      range: { startUserDayDate: metadata.rangeStart, endUserDayDate: metadata.rangeEnd },
      days: physicalDays
        .sort((a, b) => a.userDayDate.localeCompare(b.userDayDate))
        .map((item) => item.dayPublication),
    };
    const checked = validatePlanPublicationBatch(candidate);
    if (checked.status === "invalid") return { status: "invalid", reason: "invalidBatch" };
    if (
      metadata.fingerprint !== historicalPlanBatchFingerprint(checked.batch) ||
      metadata.dayDates.join("|") !== checked.batch.days.map((day) => day.userDayDate).join("|") ||
      physicalDays.some((item) => {
        const day = checked.batch.days.find((entry) => entry.userDayDate === item.userDayDate);
        return !day || !validDayRecord(item, checked.batch, day);
      })
    )
      return { status: "invalid", reason: "physicalMismatch" };
    batches.push(checked.batch);
  }
  if (matchedDayCount !== days.length) return { status: "invalid", reason: "physicalMismatch" };
  const metadata = structuredClone(value.batches as PhysicalBatchRecord[]).sort(compareMetadata);
  return {
    status: "valid",
    batches: batches.map(clonePlanPublicationBatch),
    target: {
      status: { status: "ready", pendingCount: 0 },
      pending: [],
      batchMetadata: metadata,
    },
  };
}
export function createPhysicalHistoricalPlanBatchRecord(
  batch: PlanPublicationBatchV1,
): PhysicalBatchRecord {
  return {
    batchId: batch.id,
    publishedAt: batch.publishedAt,
    surfaceVersion: batch.surfaceVersion,
    batchVersion: batch.version,
    rangeStart: batch.range.startUserDayDate,
    rangeEnd: batch.range.endUserDayDate,
    dayDates: batch.days.map((day) => day.userDayDate),
    fingerprint: historicalPlanBatchFingerprint(batch),
  };
}
export function createPhysicalHistoricalPlanDayRecord(
  batch: PlanPublicationBatchV1,
  day: HistoricalPlanDayPublicationV1,
): PhysicalDayRecord {
  return {
    batchId: batch.id,
    publishedAt: batch.publishedAt,
    userDayDate: day.userDayDate,
    fingerprint: historicalPlanDayFingerprint(day),
    dayPublication: cloneHistoricalPlanDay(day),
  };
}
const toBatchRecord = createPhysicalHistoricalPlanBatchRecord;
const toDayRecord = createPhysicalHistoricalPlanDayRecord;
function validBatchMetadata(value: unknown): value is PhysicalBatchRecord {
  if (!record(value)) return false;
  const keys = [
    "batchId",
    "publishedAt",
    "surfaceVersion",
    "batchVersion",
    "rangeStart",
    "rangeEnd",
    "dayDates",
    "fingerprint",
  ];
  return (
    exact(value, keys) &&
    typeof value.batchId === "string" &&
    typeof value.publishedAt === "string" &&
    value.surfaceVersion === 1 &&
    value.batchVersion === 1 &&
    typeof value.rangeStart === "string" &&
    typeof value.rangeEnd === "string" &&
    Array.isArray(value.dayDates) &&
    value.dayDates.every((day) => typeof day === "string") &&
    typeof value.fingerprint === "string"
  );
}
function validDayRecord(
  value: PhysicalDayRecord,
  batch: PlanPublicationBatchV1,
  day: HistoricalPlanDayPublicationV1,
): boolean {
  return (
    record(value) &&
    exact(value, ["batchId", "publishedAt", "userDayDate", "fingerprint", "dayPublication"]) &&
    value.batchId === batch.id &&
    value.publishedAt === batch.publishedAt &&
    value.userDayDate === day.userDayDate &&
    value.fingerprint === historicalPlanDayFingerprint(day)
  );
}
function exact(value: Record<string, unknown>, keys: string[]): boolean {
  const expected = new Set(keys);
  return (
    Object.keys(value).length === keys.length &&
    Object.keys(value).every((key) => expected.has(key))
  );
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function compareMetadata(a: PhysicalBatchRecord, b: PhysicalBatchRecord) {
  return a.publishedAt.localeCompare(b.publishedAt);
}
function dates(start: string, end: string): string[] | null {
  const first = Date.parse(`${start}T00:00:00Z`);
  const last = Date.parse(`${end}T00:00:00Z`);
  if (!Number.isFinite(first) || !Number.isFinite(last) || first > last) return null;
  const values: string[] = [];
  for (let at = first; at <= last; at += 86_400_000)
    values.push(new Date(at).toISOString().slice(0, 10));
  return values;
}
