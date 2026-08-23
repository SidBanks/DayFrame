import type { BlockCategory } from "../blocks/types.js";
import type { DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import type { TimeString, Weekday } from "../time/types.js";
import { validatePlanPublicationBatch } from "./historicalPlanValidation.js";

export const HISTORICAL_PLAN_SURFACE_VERSION = 1 as const;
export const PLAN_PUBLICATION_BATCH_VERSION = 1 as const;
export const HISTORICAL_PLAN_DAY_PUBLICATION_VERSION = 1 as const;
export const HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION = 1 as const;
export const HISTORICAL_PLAN_TITLE_MAX_LENGTH = 200;

export type PlanPublicationBatchId = string & { readonly __planPublicationBatchId: unique symbol };
export type PlanPublicationBatchIdAllocator = () => PlanPublicationBatchId;
export type HistoricalPlanSourceFamily = "template" | "work" | "manualEvent";
export type HistoricalPlanContext =
  | { state: "scheduled"; startsAt: string; endsAt: string }
  | { state: "unplaced" | "omitted" | "blocked" };

export type HistoricalPlannedOccurrenceSnapshotV1 = {
  version: typeof HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION;
  reference: DurableOccurrenceReference;
  sourceFamily: HistoricalPlanSourceFamily;
  title: string;
  category: BlockCategory;
  plan: HistoricalPlanContext;
};

export type HistoricalPlanDayPublicationV1 = {
  version: typeof HISTORICAL_PLAN_DAY_PUBLICATION_VERSION;
  userDayDate: LocalDateString;
  dayBoundaryStartTime: TimeString;
  weekStartsOn: Weekday;
  utcOffsetMinutes: number;
  occurrences: HistoricalPlannedOccurrenceSnapshotV1[];
};

export type PlanPublicationBatchV1 = {
  surfaceVersion: typeof HISTORICAL_PLAN_SURFACE_VERSION;
  version: typeof PLAN_PUBLICATION_BATCH_VERSION;
  id: PlanPublicationBatchId;
  publishedAt: string;
  range: { startUserDayDate: LocalDateString; endUserDayDate: LocalDateString };
  days: HistoricalPlanDayPublicationV1[];
};

export type HistoricalPlanConstructionProviders = {
  allocateBatchId?: PlanPublicationBatchIdAllocator;
  now?: () => string;
};

export type CreatePlanPublicationBatchInput = Omit<PlanPublicationBatchV1, "surfaceVersion" | "version" | "id" | "publishedAt">;
export type CreatePlanPublicationBatchResult =
  | { status: "created"; batch: PlanPublicationBatchV1 }
  | { status: "invalidInput"; issues: import("./historicalPlanValidation.js").HistoricalPlanValidationIssue[] }
  | { status: "allocationFailure"; reason: string };

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function isPlanPublicationBatchId(value: unknown): value is PlanPublicationBatchId {
  return typeof value === "string" && UUID_V4.test(value);
}

export function createPlanPublicationBatchId(): PlanPublicationBatchId {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (!randomUUID) throw new Error("Cryptographic UUID generation is unavailable for PlanPublicationBatchId.");
  const value = randomUUID.call(globalThis.crypto);
  if (!isPlanPublicationBatchId(value)) throw new Error("Cryptographic UUID generation returned an invalid PlanPublicationBatchId.");
  return value;
}

export function createPlanPublicationBatch(
  input: CreatePlanPublicationBatchInput,
  providers: HistoricalPlanConstructionProviders = {},
): CreatePlanPublicationBatchResult {
  try {
    const candidate: PlanPublicationBatchV1 = {
      surfaceVersion: HISTORICAL_PLAN_SURFACE_VERSION,
      version: PLAN_PUBLICATION_BATCH_VERSION,
      id: (providers.allocateBatchId ?? createPlanPublicationBatchId)(),
      publishedAt: (providers.now ?? (() => new Date().toISOString()))(),
      range: { ...input.range },
      days: input.days.map(cloneHistoricalPlanDay),
    };
    const validation = validatePlanPublicationBatch(candidate);
    return validation.status === "valid"
      ? { status: "created", batch: validation.batch }
      : { status: "invalidInput", issues: validation.issues };
  } catch (error) {
    return { status: "allocationFailure", reason: error instanceof Error ? error.message : "Unknown allocation failure" };
  }
}

export function cloneHistoricalPlanSnapshot(snapshot: HistoricalPlannedOccurrenceSnapshotV1): HistoricalPlannedOccurrenceSnapshotV1 {
  return { ...snapshot, reference: structuredClone(snapshot.reference), plan: { ...snapshot.plan } };
}

export function cloneHistoricalPlanDay(day: HistoricalPlanDayPublicationV1): HistoricalPlanDayPublicationV1 {
  return { ...day, occurrences: day.occurrences.map(cloneHistoricalPlanSnapshot) };
}

export function clonePlanPublicationBatch(batch: PlanPublicationBatchV1): PlanPublicationBatchV1 {
  return { ...batch, range: { ...batch.range }, days: batch.days.map(cloneHistoricalPlanDay) };
}
