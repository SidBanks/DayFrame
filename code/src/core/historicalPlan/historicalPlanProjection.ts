import {
  cloneHistoricalPlanDay,
  clonePlanPublicationBatch,
  type HistoricalPlanDayPublicationV1,
  type PlanPublicationBatchV1,
} from "./historicalPlan.js";
import { areHistoricalPlanDaysSemanticallyEqual } from "./historicalPlanFingerprint.js";
import {
  validateHistoricalPlanCollection,
  validatePlanPublicationBatch,
  type HistoricalPlanValidationIssue,
} from "./historicalPlanValidation.js";

export type EffectiveHistoricalPlanDayResult =
  | {
      status: "available";
      day: HistoricalPlanDayPublicationV1;
      batchId: string;
      publishedAt: string;
    }
  | { status: "unavailableNoPublication"; userDayDate: string }
  | { status: "invalid"; issues: HistoricalPlanValidationIssue[] };
export type EffectiveHistoricalPlanRangeResult =
  | {
      status: "projected";
      days: Array<Extract<EffectiveHistoricalPlanDayResult, { status: "available" }>>;
      missingDays: string[];
    }
  | { status: "invalid"; issues: HistoricalPlanValidationIssue[] };
export type AppendPlanPublicationBatchResult =
  | { status: "appended"; batches: PlanPublicationBatchV1[] }
  | { status: "identicalNoOp"; batches: PlanPublicationBatchV1[] }
  | { status: "nonMonotonicPublicationTime"; batches: PlanPublicationBatchV1[] }
  | { status: "invalid"; issues: HistoricalPlanValidationIssue[] };

export function getEffectiveHistoricalPlanDay(input: {
  batches: readonly PlanPublicationBatchV1[];
  userDayDate: string;
  asOf: string;
}): EffectiveHistoricalPlanDayResult {
  const validation = validateHistoricalPlanCollection(input.batches);
  if (validation.status === "invalid") return validation;
  if (!canonicalUtc(input.asOf) || !localDate(input.userDayDate))
    return {
      status: "invalid",
      issues: [{ code: !canonicalUtc(input.asOf) ? "invalidPublishedAt" : "invalidDayContext" }],
    };
  const candidates = validation.batches.flatMap((batch) =>
    batch.publishedAt <= input.asOf
      ? batch.days
          .filter((day) => day.userDayDate === input.userDayDate)
          .map((day) => ({ batch, day }))
      : [],
  );
  if (!candidates.length)
    return { status: "unavailableNoPublication", userDayDate: input.userDayDate };
  candidates.sort((a, b) => a.batch.publishedAt.localeCompare(b.batch.publishedAt));
  const latest = candidates[candidates.length - 1]!;
  return {
    status: "available",
    day: cloneHistoricalPlanDay(latest.day),
    batchId: latest.batch.id,
    publishedAt: latest.batch.publishedAt,
  };
}

export function getEffectiveHistoricalPlanRange(input: {
  batches: readonly PlanPublicationBatchV1[];
  startUserDayDate: string;
  endUserDayDate: string;
  asOf: string;
}): EffectiveHistoricalPlanRangeResult {
  if (
    !localDate(input.startUserDayDate) ||
    !localDate(input.endUserDayDate) ||
    input.startUserDayDate > input.endUserDayDate
  )
    return { status: "invalid", issues: [{ code: "invalidRange" }] };
  const days: Array<Extract<EffectiveHistoricalPlanDayResult, { status: "available" }>> = [];
  const missingDays: string[] = [];
  for (const date of dates(input.startUserDayDate, input.endUserDayDate)) {
    const result = getEffectiveHistoricalPlanDay({
      batches: input.batches,
      userDayDate: date,
      asOf: input.asOf,
    });
    if (result.status === "invalid") return result;
    if (result.status === "available") days.push(result);
    else missingDays.push(date);
  }
  return { status: "projected", days, missingDays };
}

export function classifyPublicationCandidate(
  existing: readonly PlanPublicationBatchV1[],
  candidate: PlanPublicationBatchV1,
): "identicalNoOp" | "meaningfulPublication" | "invalid" {
  const candidateValidation = validatePlanPublicationBatch(candidate);
  if (candidateValidation.status === "invalid") return "invalid";
  const collectionValidation = validateHistoricalPlanCollection(existing);
  if (collectionValidation.status === "invalid") return "invalid";
  return candidateValidation.batch.days.every((day) => {
    const prior = getEffectiveHistoricalPlanDay({
      batches: collectionValidation.batches,
      userDayDate: day.userDayDate,
      asOf: candidate.publishedAt,
    });
    return prior.status === "available" && areHistoricalPlanDaysSemanticallyEqual(prior.day, day);
  })
    ? "identicalNoOp"
    : "meaningfulPublication";
}

export function appendPlanPublicationBatch(
  existing: readonly PlanPublicationBatchV1[],
  candidate: PlanPublicationBatchV1,
): AppendPlanPublicationBatchResult {
  const existingValidation = validateHistoricalPlanCollection(existing);
  if (existingValidation.status === "invalid") return existingValidation;
  const candidateValidation = validatePlanPublicationBatch(candidate);
  if (candidateValidation.status === "invalid") return candidateValidation;
  const copy = existingValidation.batches.map(clonePlanPublicationBatch);
  const latest = copy.reduce<string | undefined>(
    (value, batch) =>
      value === undefined || batch.publishedAt > value ? batch.publishedAt : value,
    undefined,
  );
  if (latest && candidateValidation.batch.publishedAt < latest)
    return { status: "nonMonotonicPublicationTime", batches: copy };
  if (classifyPublicationCandidate(copy, candidateValidation.batch) === "identicalNoOp")
    return { status: "identicalNoOp", batches: copy };
  const combined = validateHistoricalPlanCollection([...copy, candidateValidation.batch]);
  if (combined.status === "invalid") return combined;
  combined.batches.sort(
    (a, b) => a.publishedAt.localeCompare(b.publishedAt) || a.id.localeCompare(b.id),
  );
  return { status: "appended", batches: combined.batches.map(clonePlanPublicationBatch) };
}

function canonicalUtc(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
  )
    return false;
  const date = new Date(value);
  return (
    !Number.isNaN(date.getTime()) &&
    (date.toISOString() === value ||
      (!value.includes(".") && `${value.slice(0, -1)}.000Z` === date.toISOString()))
  );
}
function localDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}
function dates(start: string, end: string): string[] {
  const result: string[] = [];
  for (
    let at = Date.parse(`${start}T00:00:00Z`);
    at <= Date.parse(`${end}T00:00:00Z`);
    at += 86_400_000
  )
    result.push(new Date(at).toISOString().slice(0, 10));
  return result;
}
