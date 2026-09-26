import { capacityFingerprint } from "../planning/capacityFingerprint.js";
import { durableOccurrenceReferencesEqual } from "../occurrences/durableOccurrenceReference.js";
import type { PlanPublicationBatchV1 } from "../historicalPlan/historicalPlan.js";
import {
  validateExecutionRecordCollection,
  type ExecutionHistoricalSnapshot,
  type ExecutionRecordV1,
  type ExecutionSubject,
} from "../execution/executionRecord.js";
import type { HistoricalPublishedSleepSnapshotV4 } from "./publishedSleep.js";

export function publishedSleepExecutionTarget(snapshot: HistoricalPublishedSleepSnapshotV4): {
  subject: Extract<ExecutionSubject, { kind: "publishedSleep" }>;
  snapshot: ExecutionHistoricalSnapshot;
} {
  const occurrence = snapshot.sleep.occurrence;
  return {
    subject: {
      kind: "publishedSleep",
      version: 1,
      publicationBatchId: snapshot.sleep.publicationBatchId,
      snapshotId: snapshot.sleep.snapshotId,
      reference: structuredClone(snapshot.reference),
    },
    snapshot: {
      sourceFamily: "sleepRequirement",
      title: "Sleep",
      category: "sleep",
      userDay: {
        date: occurrence.ownerDay,
        dayBoundaryStartTime: occurrence.derivationContext
          .dayBoundaryStartTime as ExecutionHistoricalSnapshot["userDay"]["dayBoundaryStartTime"],
        utcOffsetMinutes: snapshot.sleep.ownerUtcOffsetMinutes,
      },
      plan: structuredClone(snapshot.plan),
    },
  };
}
/** References immutable publication evidence only; authored lifetimes are intentionally irrelevant. */
export function validateSleepExecutionPublications(
  records: readonly ExecutionRecordV1[],
  batches: readonly PlanPublicationBatchV1[],
): boolean {
  if (validateExecutionRecordCollection(records).status !== "valid") return false;
  const snapshots = new Map<string, HistoricalPublishedSleepSnapshotV4>();
  for (const batch of batches)
    for (const day of batch.days)
      for (const snapshot of day.occurrences)
        if (snapshot.version === 4)
          snapshots.set(`${batch.id}|${snapshot.sleep.snapshotId}`, snapshot);
  return records.every((record) => {
    if (record.kind !== "assertion" || record.subject.kind !== "publishedSleep") return true;
    const snapshot = snapshots.get(
      `${record.subject.publicationBatchId}|${record.subject.snapshotId}`,
    );
    return (
      !!snapshot &&
      durableOccurrenceReferencesEqual(record.subject.reference, snapshot.reference) &&
      capacityFingerprint(record.snapshot) ===
        capacityFingerprint(publishedSleepExecutionTarget(snapshot).snapshot)
    );
  });
}
