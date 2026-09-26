import { createSourceObservation } from "./sourceObservation.js";
import type {
  PublicationSourceCheck,
  PublicationSourceFailure,
  ReviewRequired,
} from "./reviewSourceQualification.js";
import { withPublicationReceipt, type PublicationReceipt } from "./publicationReceipt.js";
import { hasSleepPublicationSeamConflict } from "../core/sleep/sleepPublicationSeams.js";
import {
  arePlanPublicationBatchesSemanticallyEqual,
  historicalPlanBatchStorageFingerprint,
  historicalPlanDayStorageFingerprint,
  historicalPlanDayFingerprint,
} from "../core/historicalPlan/historicalPlanFingerprint.js";
import {
  cloneHistoricalPlanDay,
  clonePlanPublicationBatch,
  type HistoricalPlanDayPublicationV1,
  type PlanPublicationBatchV1,
} from "../core/historicalPlan/historicalPlan.js";
import { getEffectiveHistoricalPlanDay } from "../core/historicalPlan/historicalPlanProjection.js";
import {
  validateHistoricalPlanCollection,
  validatePlanPublicationBatch,
} from "../core/historicalPlan/historicalPlanValidation.js";
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
  DurableTransactionReceipt,
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
export type PublicationOrigin = PublicationReceipt &
  Readonly<{ epoch: number; generation: number }>;
type PublicationRejection =
  | "contextReplaced"
  | "publicationBusy"
  | "historicalPlanProtected"
  | "historicalPlanUnavailable"
  | "sourceChanged";
export type HistoricalPlanPublicationResult = {
  readonly receipt?: PublicationReceipt;
} & (
  | ({ status: "rejected" } & PublicationSourceFailure)
  | ({ status: "publishedAndDurable"; batch: PlanPublicationBatchV1 } & ReviewRequired)
  | {
      status: "publishedPendingDurability";
      batch: PlanPublicationBatchV1;
      error: DurableStorageError;
    }
  | ({ status: "identicalNoOp" } & ReviewRequired)
  | { status: "identicalPending"; batchIds: string[] }
  | { status: "rejected"; reason: PublicationRejection }
  | { status: "publicationBlockedProtected" }
  | { status: "materializationUnavailable"; batch: PlanPublicationBatchV1 }
  | { status: "invalidCandidate" }
  | {
      status: "writeFailedBeforeCommit";
      batch: PlanPublicationBatchV1;
      error: DurableStorageError;
    }
  | {
      status: "verificationFailedAfterCommit" | "commitStateUncertain";
      batch: PlanPublicationBatchV1;
      error: DurableStorageError;
    }
);
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
  const reviewObservation = createSourceObservation();
  const storage = options.storage ?? createDayFrameDurableDb();
  let status: HistoricalPlanDurabilityStatus = { status: "initializing" };
  let pending: PlanPublicationBatchV1[] = [];
  let batchMetadata: PhysicalBatchRecord[] = [];
  let initialization: Promise<void> | undefined;
  let initializationOrigin: PublicationOrigin | undefined;
  let initializationMayFlush = true;
  let publicationChain: Promise<void> = Promise.resolve();
  let protectedEvidence: string | undefined;
  let protectedEvidenceLoading: Promise<void> | undefined;
  let generation = 0;
  let activeOrigin: PublicationOrigin | undefined;
  let replacing = false;
  let abandoning = false;
  let lifecycle:
    | {
        getEpoch: () => number;
        admission: () =>
          | "publicationBusy"
          | "historicalPlanProtected"
          | "historicalPlanUnavailable"
          | undefined;
        coordinatorCurrent: (epoch: number) => boolean;
        replace: (
          run: (
            epoch: number,
          ) => Promise<
            import("../infrastructure/storage/indexedDbCollectionStorage.js").DurableStorageResult<void>
          >,
        ) => Promise<
          import("../infrastructure/storage/indexedDbCollectionStorage.js").DurableStorageResult<void>
        >;
      }
    | undefined;
  const origins = new WeakSet<object>();
  const entryRejections = new WeakMap<object, PublicationRejection>();
  const entryContextRejections = new WeakMap<object, PublicationRejection>();
  const epoch = () => lifecycle?.getEpoch() ?? 0;
  function capturePublicationOrigin(): PublicationOrigin {
    const capturedGeneration = generation;
    const capturedEpoch = epoch();
    const origin: PublicationOrigin = Object.freeze({
      epoch: capturedEpoch,
      generation: capturedGeneration,
      isCurrent: () => generation === capturedGeneration && epoch() === capturedEpoch,
    });
    origins.add(origin);
    const context = currentContextRejection();
    if (context) entryContextRejections.set(origin, context);
    const rejection = currentRejection();
    if (rejection) entryRejections.set(origin, rejection);
    return origin;
  }
  function currentContextRejection(): PublicationRejection | undefined {
    return replacing ? "publicationBusy" : lifecycle?.admission();
  }
  function getPublicationContextRejection(
    origin: PublicationOrigin,
  ): PublicationRejection | undefined {
    if (!origins.has(origin) || !origin.isCurrent()) return "contextReplaced";
    return entryContextRejections.get(origin) ?? currentContextRejection();
  }
  function currentRejection(): PublicationRejection | undefined {
    const external = currentContextRejection();
    if (external) return external;
    if (status.status === "protected") return "historicalPlanProtected";
    if (status.status === "unavailable") return "historicalPlanUnavailable";
    return undefined;
  }
  function getPublicationRejection(origin: PublicationOrigin): PublicationRejection | undefined {
    if (!origins.has(origin) || !origin.isCurrent()) return "contextReplaced";
    return entryRejections.get(origin) ?? currentRejection();
  }
  function isHistoricalPlanQuiescent() {
    return !activeOrigin && !replacing;
  }
  function isHistoricalPlanProtected() {
    return status.status === "protected" && !abandoning;
  }
  function configureLifecycle(capability: symbol, value: NonNullable<typeof lifecycle>) {
    if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY || lifecycle)
      throw new Error("Invalid HistoricalPlan lifecycle capability.");
    lifecycle = value;
  }
  function invalidate() {
    generation++;
    initialization = undefined;
  }
  function staleRead() {
    return {
      status: "unavailable" as const,
      error: { code: "admissionDenied" as const, operation: "contextReplaced" },
    };
  }
  function enqueue<T extends object>(
    origin: PublicationOrigin,
    run: () => Promise<T>,
    rejected: (reason: PublicationRejection) => T,
    record?: (value: T) => void,
  ): Promise<T & { receipt: PublicationReceipt }> {
    const entry = getPublicationRejection(origin);
    if (entry) return Promise.resolve(withPublicationReceipt(rejected(entry), origin));
    const result = publicationChain.then(async () => {
      const denial = getPublicationRejection(origin);
      if (denial) return withPublicationReceipt(rejected(denial), origin);
      activeOrigin = origin;
      try {
        const value = await run();
        await protectedEvidenceLoading;
        const completed = withPublicationReceipt(value, origin);
        if (origin.isCurrent()) record?.(completed);
        return completed;
      } finally {
        // persistBatch owns physical-terminal waiting, including thrown acknowledgments.
        await protectedEvidenceLoading;
        activeOrigin = undefined;
      }
    });
    publicationChain = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }
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
      invalidate();
      initializationMayFlush = false;
      status = structuredClone(target.status);
      pending = target.pending.map(clonePlanPublicationBatch);
      batchMetadata = structuredClone(target.batchMetadata);
      reviewObservation.changed();
      protectedEvidence = target.protectedEvidence;
      protectedEvidenceLoading = undefined;
      const installed = capturePublicationOrigin();
      options.notificationScheduler?.notify("historicalPlan", () => {
        if (!installed.isCurrent()) return;
        for (const listener of statusListeners) listener(structuredClone(status));
        emitHistory({ type: "recoveryChanged" });
      });
    },
  };

  function initialize(): Promise<void> {
    if (initialization && initializationOrigin?.isCurrent()) return initialization;
    if (initializationOrigin && !initializationOrigin.isCurrent()) initializationMayFlush = false;
    const origin = capturePublicationOrigin();
    initializationOrigin = origin;
    initialization = (async () => {
      const opened = await storage.open();
      if (!origin.isCurrent()) return;
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
      if (!origin.isCurrent() || status.status === "protected") return;
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
    })();
    const initialized = initialization;
    void initialized.then(() => {
      if (
        initializationMayFlush &&
        origin.isCurrent() &&
        pending.length &&
        !activeOrigin &&
        !replacing &&
        !getPublicationRejection(origin)
      )
        void retryPendingPublications(origin);
    });
    return initialized;
  }

  function publicationDenied(
    reason: PublicationRejection,
    batch: PlanPublicationBatchV1,
  ): HistoricalPlanPublicationResult {
    if (reason === "historicalPlanProtected") return { status: "publicationBlockedProtected" };
    if (reason === "historicalPlanUnavailable")
      return { status: "materializationUnavailable", batch };
    return { status: "rejected", reason };
  }

  function publish(batchValue: PlanPublicationBatchV1): Promise<HistoricalPlanPublicationResult> {
    const origin = capturePublicationOrigin();
    let candidate: PlanPublicationBatchV1;
    try {
      candidate = structuredClone(batchValue);
    } catch {
      return Promise.resolve(
        withPublicationReceipt({ status: "invalidCandidate" as const }, origin),
      );
    }
    return enqueue<HistoricalPlanPublicationResult>(
      origin,
      () => publishOne(candidate, true),
      (reason) => publicationDenied(reason, candidate),
    );
  }

  async function publishOne(
    batchValue: PlanPublicationBatchV1,
    retainFailedForRetry: boolean,
    isCurrent?: () => boolean,
  ): Promise<HistoricalPlanPublicationResult> {
    if (isCurrent && !isCurrent()) return { status: "rejected", reason: "sourceChanged" };
    const checked = validatePlanPublicationBatch(batchValue);
    if (checked.status === "invalid") return { status: "invalidCandidate" };
    await initialize();
    if (status.status === "protected") return { status: "publicationBlockedProtected" };
    if (status.status === "unavailable")
      return {
        status: "materializationUnavailable",
        batch: clonePlanPublicationBatch(checked.batch),
      };
    if (isCurrent && !isCurrent()) return { status: "rejected", reason: "sourceChanged" };
    const classification = await candidateIsIdentical(checked.batch);
    if (isCurrent && !isCurrent()) return { status: "rejected", reason: "sourceChanged" };
    if (classification === "protected") return { status: "publicationBlockedProtected" };
    if (Array.isArray(classification))
      return { status: "identicalPending", batchIds: classification };
    if (classification === true) return { status: "identicalNoOp" };
    const existing = await exportHistoricalPlan();
    if (existing.status !== "exported") return { status: "publicationBlockedProtected" };
    if (
      hasSleepPublicationSeamConflict(checked.batch, existing.batches) ||
      validateHistoricalPlanCollection([...existing.batches, checked.batch]).status !== "valid"
    )
      return { status: "invalidCandidate" };
    if (isCurrent && !isCurrent()) return { status: "rejected", reason: "sourceChanged" };
    if (retainFailedForRetry) {
      pending.push(clonePlanPublicationBatch(checked.batch));
      setStatus({ status: "pending", pendingCount: pending.length });
      emitHistory({ type: "publicationAccepted", batchId: checked.batch.id });
    }
    if (isCurrent && !isCurrent()) return { status: "rejected", reason: "sourceChanged" };
    const persisted = await persistBatch(checked.batch, isCurrent);
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
    if (persisted.commitState !== "notWritten") {
      pending = pending.filter((current) => current.id !== checked.batch.id);
      return {
        status:
          persisted.commitState === "committed"
            ? "verificationFailedAfterCommit"
            : "commitStateUncertain",
        batch: clonePlanPublicationBatch(checked.batch),
        error: persisted.error,
      };
    }
    if (persisted.error.operation === "stalePublicationAuthority")
      return { status: "rejected", reason: "sourceChanged" };
    if ((status as HistoricalPlanDurabilityStatus).status === "protected")
      return { status: "publicationBlockedProtected" };
    if (!retainFailedForRetry)
      return {
        status: "writeFailedBeforeCommit",
        batch: clonePlanPublicationBatch(checked.batch),
        error: persisted.error,
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
    guard?: {
      isCurrent: () => boolean;
      checkSources?: () => PublicationSourceCheck;
      origin?: PublicationOrigin;
      recordResult?: (result: HistoricalPlanPublicationResult) => void;
    },
  ): Promise<HistoricalPlanPublicationResult> {
    const origin = guard?.origin ?? capturePublicationOrigin();
    let candidate: PlanPublicationBatchV1;
    try {
      candidate = structuredClone(batchValue);
    } catch {
      return Promise.resolve(
        withPublicationReceipt({ status: "invalidCandidate" as const }, origin),
      );
    }
    let denial: Exclude<PublicationSourceCheck, { status: "current" }> | undefined;
    const current = () => {
      if (denial) return false;
      const checked = guard?.checkSources?.();
      if (checked?.status === "rejected") denial = checked;
      else if (guard?.isCurrent && !guard.isCurrent())
        denial = { status: "rejected", reason: "sourceChanged" };
      return !denial;
    };
    return enqueue<HistoricalPlanPublicationResult>(
      origin,
      async () => {
        const result = await publishOne(candidate, false, current);
        if (result.status === "rejected" && result.reason === "sourceChanged" && denial)
          return denial;
        if (result.status === "publishedAndDurable" || result.status === "identicalNoOp") {
          if (!current())
            return {
              ...result,
              reviewRequired: true,
              ...(denial && "sourceIssues" in denial ? { sourceIssues: denial.sourceIssues } : {}),
            };
        }
        return result;
      },
      (reason) => {
        if (!getPublicationContextRejection(origin)) {
          current();
          if (denial?.reason === "publicationSourceUnqualified") return denial;
        }
        return publicationDenied(reason, candidate);
      },
      guard?.recordResult,
    );
  }

  type RetryResult = {
    status: "durable" | "failed" | "notAttempted";
    pendingCount: number;
    reason?: PublicationRejection;
    readonly receipt?: PublicationReceipt;
  };
  function retryPendingPublications(origin = capturePublicationOrigin()): Promise<RetryResult> {
    return enqueue<RetryResult>(origin, retryOne, (reason) => ({
      status: "notAttempted",
      pendingCount: pending.length,
      reason,
    }));
  }
  async function retryOne(): Promise<RetryResult> {
    await initialize();
    if (status.status === "protected" || status.status === "unavailable" || !pending.length)
      return { status: "notAttempted", pendingCount: pending.length };
    for (const batch of [...pending].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))) {
      const result = await persistBatch(batch);
      if (result.status === "failure") {
        if (
          result.commitState !== "notWritten" ||
          (status as HistoricalPlanDurabilityStatus).status === "protected"
        ) {
          if (result.commitState !== "notWritten")
            pending = pending.filter((current) => current.id !== batch.id);
          return { status: "notAttempted", pendingCount: pending.length };
        }
        setStatus({ status: "failed", pendingCount: pending.length, error: result.error });
        return { status: "failed", pendingCount: pending.length };
      }
      pending = pending.filter((current) => current.id !== batch.id);
      upsertMetadata(toBatchRecord(batch));
    }
    setStatus({ status: "ready", pendingCount: 0 });
    return { status: "durable", pendingCount: 0 };
  }

  async function persistBatch(
    batch: PlanPublicationBatchV1,
    isCurrent?: () => boolean,
  ): Promise<
    | { status: "success"; value: undefined }
    | {
        status: "failure";
        error: DurableStorageError;
        commitState: "notWritten" | "committed" | "unknown";
      }
  > {
    let commitState: "notWritten" | "committed" | "unknown" = "notWritten";
    const origin = activeOrigin;
    let admissionOpen = true;
    const receipts: DurableTransactionReceipt[] = [];
    const admit = () =>
      admissionOpen &&
      !!origin &&
      activeOrigin === origin &&
      !getPublicationContextRejection(origin) &&
      (isCurrent?.() ?? true) &&
      !getPublicationRejection(origin);
    const failed = (error: DurableStorageError) => {
      if (commitState !== "notWritten") protect("physicalMismatch");
      return { status: "failure" as const, error, commitState };
    };
    try {
      const existing = await storage.get<PhysicalBatchRecord>(
        HISTORICAL_PLAN_BATCH_STORE,
        batch.id,
      );
      if (existing.status === "failure") return failed(existing.error);
      if (existing.value) {
        const reconstructed = await readPhysicalBatch(existing.value);
        if (isCurrent && !isCurrent())
          return failed({ code: "constraintViolation", operation: "stalePublicationAuthority" });
        if (
          reconstructed.status === "success" &&
          reconstructed.batch.id === batch.id &&
          reconstructed.batch.publishedAt === batch.publishedAt &&
          arePlanPublicationBatchesSemanticallyEqual(reconstructed.batch, batch)
        )
          return { status: "success", value: undefined };
        protect("conflictingBatchId");
        return failed({ code: "constraintViolation", operation: "persistHistoricalPlanBatch" });
      }
      if (isCurrent && !isCurrent())
        return failed({ code: "constraintViolation", operation: "stalePublicationAuthority" });
      // Until the transaction returns its terminal result, an exception leaves commit knowledge unknown.
      commitState = "unknown";
      let signalUnconfirmed!: () => void;
      const unconfirmed = new Promise<never>((_, reject) => {
        signalUnconfirmed = () =>
          reject(new Error("Physical transaction ended without an acknowledgment."));
      });
      const result = await Promise.race([
        storage.mutate(
          [
            { type: "put", store: HISTORICAL_PLAN_BATCH_STORE, value: toBatchRecord(batch) },
            ...batch.days.map((day) => ({
              type: "put" as const,
              store: HISTORICAL_PLAN_DAY_STORE,
              value: toDayRecord(batch, day),
            })),
          ],
          admit,
          (receipt) => {
            receipts.push(receipt);
            // After proven native termination, allow normal promise delivery to drain.
            // A task checkpoint is not a cancellation timeout: a missing acknowledgment
            // remains uncertain, and terminal proof is still required before release.
            void receipt.terminal.then(() => {
              const channel = new MessageChannel();
              channel.port1.onmessage = () => {
                channel.port1.close();
                channel.port2.close();
                signalUnconfirmed();
              };
              channel.port2.postMessage(null);
            });
          },
        ),
        unconfirmed,
      ]);
      admissionOpen = false;
      await Promise.all(receipts.map((receipt) => receipt.terminal));
      if (result.status === "failure") {
        // The storage adapter returns failure only after a failed/aborted atomic transaction.
        commitState = "notWritten";
        return failed(
          result.error.code === "admissionDenied" && isCurrent && !isCurrent()
            ? { code: "admissionDenied", operation: "stalePublicationAuthority" }
            : result.error,
        );
      }
      commitState = "committed";
      const verified = await storage.get<PhysicalBatchRecord>(
        HISTORICAL_PLAN_BATCH_STORE,
        batch.id,
      );
      if (verified.status === "failure") return failed(verified.error);
      if (!verified.value)
        return failed({ code: "readFailed", operation: "verifyHistoricalPlanBatch" });
      const reconstructed = await readPhysicalBatch(verified.value);
      if (
        reconstructed.status !== "success" ||
        reconstructed.batch.id !== batch.id ||
        reconstructed.batch.publishedAt !== batch.publishedAt ||
        !arePlanPublicationBatchesSemanticallyEqual(reconstructed.batch, batch)
      )
        return failed({ code: "readFailed", operation: "verifyHistoricalPlanBatch" });
      return { status: "success", value: undefined };
    } catch {
      admissionOpen = false;
      // Protection is truthful immediately, but replacement stays excluded until native terminal.
      const failure = failed({ code: "readFailed", operation: "persistHistoricalPlanBatch" });
      await Promise.all(receipts.map((receipt) => receipt.terminal));
      return failure;
    } finally {
      admissionOpen = false;
      await Promise.all(receipts.map((receipt) => receipt.terminal));
    }
  }

  async function getHistoricalPlanDay(
    userDayDate: string,
    asOf: string,
  ): Promise<HistoricalPlanDayReadResult> {
    const origin = capturePublicationOrigin();
    await initialize();
    if (!origin.isCurrent()) return staleRead();
    if (status.status === "protected")
      return { status: "unavailableProtected", reason: status.reason };
    if (status.status === "unavailable") return { status: "unavailable", error: status.error };
    const durable = await readDurableDayCandidates(userDayDate, asOf);
    if (!origin.isCurrent()) return staleRead();
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
    const origin = capturePublicationOrigin();
    const values = dates(start, end);
    if (!values) return { status: "unavailableProtected", reason: "invalidBatch" };
    const days: Array<Extract<HistoricalPlanDayReadResult, { status: "available" }>> = [];
    const missingDays: string[] = [];
    for (const date of values) {
      const result = await getHistoricalPlanDay(date, asOf);
      if (!origin.isCurrent()) return staleRead();
      if (result.status === "available") days.push(result);
      else if (result.status === "unavailableNoPublication") missingDays.push(date);
      else return result;
    }
    return { status: "available", days, missingDays };
  }

  /** Read all retained publications for one owner, using the existing validated day index. */
  async function getHistoricalPlanDayEvidence(userDayDate: string, asOf: string) {
    const origin = capturePublicationOrigin();
    await initialize();
    if (!origin.isCurrent()) return staleRead();
    if (status.status === "protected")
      return { status: "unavailableProtected", reason: status.reason } as const;
    if (status.status === "unavailable")
      return { status: "unavailable", error: status.error } as const;
    const durable = await readDurableDayCandidates(userDayDate, asOf);
    if (!origin.isCurrent()) return staleRead();
    if (durable.status !== "success") return durable.result;
    const candidates = [
      ...durable.candidates,
      ...pending.flatMap((batch) =>
        batch.publishedAt <= asOf
          ? batch.days
              .filter((day) => day.userDayDate === userDayDate)
              .map((day) => ({ batch, day, durability: "pending" as const }))
          : [],
      ),
    ].sort(
      (a, b) =>
        a.batch.publishedAt.localeCompare(b.batch.publishedAt) ||
        a.batch.id.localeCompare(b.batch.id),
    );
    // A pending verification may coexist with the same durable batch. It is one publication,
    // retaining the pending durability qualification just like the effective-day reader.
    const unique = [
      ...new Map(candidates.map((candidate) => [candidate.batch.id, candidate])).values(),
    ];
    return { status: "available", publications: structuredClone(unique) } as const;
  }

  /** Exact immutable publication lookup for execution-reference validation; no history export. */
  async function getHistoricalPlanBatchEvidence(batchId: string) {
    const origin = capturePublicationOrigin();
    await initialize();
    if (!origin.isCurrent()) return staleRead();
    if (status.status === "protected")
      return { status: "unavailableProtected", reason: status.reason } as const;
    if (status.status === "unavailable")
      return { status: "unavailable", error: status.error } as const;
    const pendingBatch = pending.find((batch) => batch.id === batchId);
    if (pendingBatch)
      return { status: "available", batch: clonePlanPublicationBatch(pendingBatch) } as const;
    const metadata = await storage.get<PhysicalBatchRecord>(HISTORICAL_PLAN_BATCH_STORE, batchId);
    if (!origin.isCurrent()) return staleRead();
    if (metadata.status === "failure")
      return { status: "unavailable", error: metadata.error } as const;
    if (!metadata.value) return { status: "notFound" } as const;
    const reconstructed = await readPhysicalBatch(metadata.value);
    if (!origin.isCurrent()) return staleRead();
    if (reconstructed.status !== "success")
      return { status: "unavailableProtected", reason: reconstructed.reason } as const;
    return { status: "available", batch: clonePlanPublicationBatch(reconstructed.batch) } as const;
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
    const origin = capturePublicationOrigin();
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
    if (!origin.isCurrent()) return { status: "failure", result: staleRead() };
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
      if (!origin.isCurrent()) return { status: "failure", result: staleRead() };
      if (metadata.status === "failure")
        return { status: "failure", result: { status: "unavailable", error: metadata.error } };
      if (!metadata.value) return protect("physicalMismatch");
      const reconstructed = await readPhysicalBatch(metadata.value);
      if (!origin.isCurrent()) return { status: "failure", result: staleRead() };
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
      metadata.fingerprint !== historicalPlanBatchStorageFingerprint(checked.batch) ||
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
  ): Promise<boolean | "protected" | string[]> {
    const pendingIds = new Set<string>();
    for (const day of batch.days) {
      const result = await getHistoricalPlanDay(day.userDayDate, batch.publishedAt);
      if (result.status === "unavailableProtected" || result.status === "unavailable")
        return "protected";
      if (
        result.status !== "available" ||
        historicalPlanDayFingerprint(result.day) !== historicalPlanDayFingerprint(day)
      )
        return false;
      if (result.durability === "pending") pendingIds.add(result.batchId);
    }
    return pendingIds.size ? [...pendingIds] : true;
  }

  /** Capture membership synchronously. Reads never incorporate later appended metadata or pending images. */
  function readReviewCollection() {
    const origin = capturePublicationOrigin();
    const metadata = structuredClone(batchMetadata),
      overlays = pending.map(clonePlanPublicationBatch);
    const capturedStatus = structuredClone(status),
      token = reviewObservation.token();
    return (async () => {
      if (capturedStatus.status === "protected")
        return { status: "protected" as const, reason: capturedStatus.reason };
      if (capturedStatus.status === "initializing" || capturedStatus.status === "unavailable")
        return {
          status: "unavailable" as const,
          reason:
            capturedStatus.status === "unavailable" ? capturedStatus.error.code : "initializing",
        };
      const batches: PlanPublicationBatchV1[] = [];
      for (const record of metadata) {
        const result = await readPhysicalBatch(record);
        if (!origin.isCurrent())
          return { status: "stale" as const, reason: "contextReplaced" as const };
        if (result.status !== "success")
          return { status: "protected" as const, reason: result.reason };
        if (token !== reviewObservation.token())
          return { status: "stale" as const, reason: "sourceChanged" as const };
        batches.push(result.batch);
      }
      if (!origin.isCurrent())
        return { status: "stale" as const, reason: "contextReplaced" as const };
      if (token !== reviewObservation.token())
        return { status: "stale" as const, reason: "sourceChanged" as const };
      if (validateHistoricalPlanCollection([...batches, ...overlays]).status !== "valid") {
        protect("physicalMismatch");
        return { status: "protected" as const, reason: "physicalMismatch" as const };
      }
      return {
        status: "available" as const,
        batches: [...batches, ...overlays].map(clonePlanPublicationBatch),
        pendingIds: overlays.map((batch) => batch.id),
      };
    })();
  }

  async function exportHistoricalPlan() {
    const origin = capturePublicationOrigin();
    await initialize();
    if (!origin.isCurrent()) return staleRead();
    if (status.status === "protected")
      return { status: "protected" as const, reason: status.reason };
    const batches: PlanPublicationBatchV1[] = [];
    for (const metadata of batchMetadata) {
      const value = await readPhysicalBatch(metadata);
      if (!origin.isCurrent()) return staleRead();
      if (value.status !== "success") return { status: "protected" as const, reason: value.reason };
      batches.push(value.batch);
    }
    if (validateHistoricalPlanCollection([...batches, ...pending]).status !== "valid") {
      protect("physicalMismatch");
      return { status: "protected" as const, reason: "physicalMismatch" as const };
    }
    return {
      status: "exported" as const,
      surfaceVersion: 1,
      batches: [...batches, ...pending]
        .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))
        .map(clonePlanPublicationBatch),
    };
  }

  function clearDenied() {
    return {
      status: "failure" as const,
      error: { code: "admissionDenied" as const, operation: "clearHistoricalPlan" },
    };
  }
  async function clearPhysical(admit: () => boolean) {
    const receipts: DurableTransactionReceipt[] = [];
    let open = true;
    try {
      const result = await storage.mutate(
        [
          { type: "clear", store: HISTORICAL_PLAN_BATCH_STORE },
          { type: "clear", store: HISTORICAL_PLAN_DAY_STORE },
        ],
        () => open && admit(),
        (receipt) => {
          receipts.push(receipt);
        },
      );
      open = false;
      await Promise.all(receipts.map((receipt) => receipt.terminal));
      if (result.status === "failure") return result;
      invalidate();
      pending = [];
      batchMetadata = [];
      protectedEvidence = undefined;
      protectedEvidenceLoading = undefined;
      initialization = Promise.resolve();
      setStatus({ status: "ready", pendingCount: 0 });
      emitHistory({ type: "historyCleared" });
      return result;
    } finally {
      open = false;
      await Promise.all(receipts.map((receipt) => receipt.terminal));
    }
  }
  async function clearHistoricalPlanForCoordinator(capability: symbol, expectedEpoch: number) {
    if (
      capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY ||
      !lifecycle?.coordinatorCurrent(expectedEpoch) ||
      activeOrigin
    )
      return clearDenied();
    invalidate();
    return clearPhysical(
      () => lifecycle?.coordinatorCurrent(expectedEpoch) === true && !activeOrigin,
    );
  }
  async function replaceHistoricalPlan(abandon: boolean) {
    if (!isHistoricalPlanQuiescent() || (status.status === "protected" && !abandon))
      return clearDenied();
    abandoning = abandon;
    const run = async (coordinatorEpoch?: number) => {
      replacing = true;
      invalidate();
      try {
        if (abandon && (await recheckProtectedSource()) !== "unchanged") return clearDenied();
        return await clearPhysical(
          () =>
            coordinatorEpoch === undefined ||
            lifecycle?.coordinatorCurrent(coordinatorEpoch) === true,
        );
      } finally {
        replacing = false;
      }
    };
    try {
      return lifecycle ? await lifecycle.replace(run) : await run();
    } finally {
      abandoning = false;
    }
  }
  function clearHistoricalPlan() {
    return replaceHistoricalPlan(false);
  }
  async function abandonProtectedHistoricalPlan() {
    if (status.status !== "protected") return { status: "notAttempted" as const };
    const result = await replaceHistoricalPlan(true);
    if (result.status === "failure")
      return result.error.code === "admissionDenied"
        ? { status: "sourceChanged" as const }
        : { status: "failed" as const, error: result.error };
    emitHistory({ type: "recoveryChanged" });
    return { status: "resolved" as const };
  }

  async function recheckProtectedSource(): Promise<
    "unchanged" | "sourceChanged" | "sourceUnreadable" | "noProtectedSource"
  > {
    if (status.status !== "protected" || (!protectedEvidence && !protectedEvidenceLoading))
      return "noProtectedSource";
    const origin = capturePublicationOrigin();
    await protectedEvidenceLoading;
    if (!origin.isCurrent()) return "sourceChanged";
    const expected = protectedEvidence;
    const current = await readPhysicalEvidence();
    if (!origin.isCurrent()) return "sourceChanged";
    if (expected === undefined || current === undefined) return "sourceUnreadable";
    return expected === current ? "unchanged" : "sourceChanged";
  }

  async function exportProtectedSource() {
    if (status.status !== "protected") return { status: "notAvailable" as const };
    const origin = capturePublicationOrigin();
    const value = await readPhysicalEvidence();
    return !origin.isCurrent() || value === undefined
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
    reviewObservation.changed();
    for (const listener of statusListeners) listener(structuredClone(next));
  }
  function emitHistory(event: HistoricalPlanEvent) {
    reviewObservation.changed();
    for (const listener of historyListeners) listener({ ...event });
  }
  function protect(reason: HistoricalPlanProtectionReason): {
    status: "failure";
    result: HistoricalPlanDayReadResult;
  } {
    const origin = capturePublicationOrigin();
    if (!protectedEvidence && !protectedEvidenceLoading) {
      const loading = readPhysicalEvidence()
        .catch(() => undefined)
        .then((value) => {
          if (!origin.isCurrent() || protectedEvidenceLoading !== loading) return;
          protectedEvidence = value;
          protectedEvidenceLoading = undefined;
        });
      protectedEvidenceLoading = loading;
    }
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
    getHistoricalPlanReviewObservation: () => reviewObservation,
    readReviewCollection,
    capturePublicationOrigin,
    getPublicationRejection,
    getPublicationContextRejection,
    configureLifecycle,
    isHistoricalPlanQuiescent,
    isHistoricalPlanProtected,
    clearHistoricalPlanForCoordinator,
    initialize,
    publish,
    publishAtomically,
    retryPendingPublications,
    getHistoricalPlanDay,
    getHistoricalPlanRange,
    getHistoricalPlanDayEvidence,
    getHistoricalPlanBatchEvidence,
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
      metadata.fingerprint !== historicalPlanBatchStorageFingerprint(checked.batch) ||
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
    fingerprint: historicalPlanBatchStorageFingerprint(batch),
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
    fingerprint: historicalPlanDayStorageFingerprint(day),
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
    value.fingerprint === historicalPlanDayStorageFingerprint(day)
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
