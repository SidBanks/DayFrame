import { addUserDayLabels } from "../time/canonicalUserDay.js";
import type { LocalDateString } from "../shifts/types.js";
import type {
  PlanPublicationBatchV1,
  HistoricalPlanDayPublicationV1,
} from "../historicalPlan/historicalPlan.js";
import type { ExecutionHistoryItem } from "../execution/executionHistoryProjection.js";

/** Availability is scoped to a family. Unavailable families have no misleading empty payload. */
export type Evidence<T> =
  | { status: "available"; value: T }
  | { status: "protected" | "unavailable" | "incomplete" | "notApplicable"; reason: string };
export type PublicationEvidence = {
  batch: PlanPublicationBatchV1;
  day: HistoricalPlanDayPublicationV1;
  durability: "durable" | "pending";
};
export type HistoricalEvidence = Evidence<PublicationEvidence[]>;
export type ActualEvidence = Evidence<ExecutionHistoryItem[]>;
export const available = <T>(value: T): Evidence<T> => ({ status: "available", value });
export function validOwnerDay(value: string): value is LocalDateString {
  try {
    return addUserDayLabels(value as LocalDateString, 0) === value;
  } catch {
    return false;
  }
}
export function stableKey(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "undefined";
  if (Array.isArray(value)) return `[${value.map(stableKey).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableKey((value as Record<string, unknown>)[key])}`)
    .join(",")}}`;
}
export function byIdentity<T extends { id: string }>(a: T, b: T) {
  return a.id.localeCompare(b.id);
}
