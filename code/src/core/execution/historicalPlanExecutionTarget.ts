import type {
  HistoricalPlanDayPublicationV1,
  HistoricalPlannedOccurrenceSnapshot,
} from "../historicalPlan/historicalPlan.js";
import {
  durableOccurrenceReferencesEqual,
  validateDurableOccurrenceReference,
} from "../occurrences/durableOccurrenceReference.js";
import { validateExecutionHistoricalSnapshot } from "./executionRecord.js";
import type { HistoricalExecutionTarget } from "./historicalExecutionTarget.js";

export type HistoricalPlanExecutionTargetResult =
  | { status: "materialized"; target: HistoricalExecutionTarget }
  | { status: "notReportable" }
  | { status: "invalidReference"; issues: string[] }
  | { status: "invalidSnapshot"; issues: string[] };

export function materializeHistoricalPlanExecutionTarget(input: {
  day: HistoricalPlanDayPublicationV1;
  occurrence: HistoricalPlannedOccurrenceSnapshot;
}): HistoricalPlanExecutionTargetResult {
  if (input.occurrence.version === 3 && input.occurrence.scheduleRole === "bufferProtection")
    return { status: "notReportable" };
  if (
    !input.day.occurrences.some(
      (candidate) =>
        candidate === input.occurrence ||
        durableOccurrenceReferencesEqual(candidate.reference, input.occurrence.reference),
    )
  )
    return { status: "notReportable" };
  const reference = validateDurableOccurrenceReference(input.occurrence.reference);
  if (reference.status !== "valid")
    return {
      status: "invalidReference",
      issues: reference.status === "invalid" ? reference.issues : ["unsupported reference version"],
    };
  const snapshot = validateExecutionHistoricalSnapshot({
    sourceFamily: input.occurrence.sourceFamily,
    title: input.occurrence.title,
    category: input.occurrence.category,
    userDay: {
      date: input.day.userDayDate,
      dayBoundaryStartTime: input.day.dayBoundaryStartTime,
      utcOffsetMinutes: input.day.utcOffsetMinutes,
    },
    plan: { ...input.occurrence.plan },
  });
  if (snapshot.status === "invalid") return { status: "invalidSnapshot", issues: snapshot.issues };
  return {
    status: "materialized",
    target: {
      reference: structuredClone(reference.reference),
      snapshot: snapshot.snapshot,
    },
  };
}
