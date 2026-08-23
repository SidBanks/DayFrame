import { cloneDurableOccurrenceReference, type DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import { cloneHistoricalPlanDay, type HistoricalPlanDayPublicationV1, type HistoricalPlannedOccurrenceSnapshotV1, type PlanPublicationBatchV1 } from "./historicalPlan.js";

export function durableReferenceKey(reference: DurableOccurrenceReference): string {
  if (reference.sourceKind === "manualEvent") return stable({ version: reference.version, sourceKind: reference.sourceKind, manualEvent: reference.manualEvent });
  if (reference.sourceKind === "work") return stable({ version: reference.version, sourceKind: reference.sourceKind, cycle: reference.cycle, entry: reference.entry, shiftDefinition: reference.shiftDefinition, coordinate: reference.coordinate });
  return stable({ version: reference.version, sourceKind: reference.sourceKind, template: reference.template, recurrence: reference.recurrence, coordinate: reference.coordinate });
}

export function historicalPlanSnapshotFingerprint(snapshot: HistoricalPlannedOccurrenceSnapshotV1): string {
  return stable({ reference: cloneDurableOccurrenceReference(snapshot.reference), sourceFamily: snapshot.sourceFamily,
    title: snapshot.title, category: snapshot.category, plan: snapshot.plan });
}

export function historicalPlanDayFingerprint(day: HistoricalPlanDayPublicationV1): string {
  return stable({ version: day.version, userDayDate: day.userDayDate, dayBoundaryStartTime: day.dayBoundaryStartTime,
    weekStartsOn: day.weekStartsOn, utcOffsetMinutes: day.utcOffsetMinutes,
    occurrences: [...day.occurrences].sort(compareSnapshots).map((snapshot) => JSON.parse(historicalPlanSnapshotFingerprint(snapshot))) });
}

export function historicalPlanBatchFingerprint(batch: PlanPublicationBatchV1): string {
  return stable({ surfaceVersion: batch.surfaceVersion, version: batch.version, range: batch.range,
    days: [...batch.days].sort((a, b) => a.userDayDate.localeCompare(b.userDayDate)).map((day) => JSON.parse(historicalPlanDayFingerprint(day))) });
}

export function areHistoricalPlanSnapshotsSemanticallyEqual(left: HistoricalPlannedOccurrenceSnapshotV1, right: HistoricalPlannedOccurrenceSnapshotV1): boolean {
  return historicalPlanSnapshotFingerprint(left) === historicalPlanSnapshotFingerprint(right);
}
export function areHistoricalPlanDaysSemanticallyEqual(left: HistoricalPlanDayPublicationV1, right: HistoricalPlanDayPublicationV1): boolean {
  return historicalPlanDayFingerprint(left) === historicalPlanDayFingerprint(right);
}
export function arePlanPublicationBatchesSemanticallyEqual(left: PlanPublicationBatchV1, right: PlanPublicationBatchV1): boolean {
  return historicalPlanBatchFingerprint(left) === historicalPlanBatchFingerprint(right);
}

export function canonicalizeHistoricalPlanDay(day: HistoricalPlanDayPublicationV1): HistoricalPlanDayPublicationV1 {
  const result = cloneHistoricalPlanDay(day); result.occurrences.sort(compareSnapshots); return result;
}

function compareSnapshots(left: HistoricalPlannedOccurrenceSnapshotV1, right: HistoricalPlannedOccurrenceSnapshotV1): number {
  return durableReferenceKey(left.reference).localeCompare(durableReferenceKey(right.reference));
}
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(",")}}`;
  return JSON.stringify(value);
}
