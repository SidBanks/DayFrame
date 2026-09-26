import type {
  ExecutionActualTimeEvidence,
  ExecutionRecordId,
  ExecutionReportedOutcome,
  ExecutionSubjectId,
} from "../core/execution/executionRecord.js";
import {
  publishedSleepExecutionTarget,
  validateSleepExecutionPublications,
} from "../core/sleep/sleepExecution.js";
import type { HistoricalPlanSurface } from "./historicalPlanSurface.js";
import type { createExecutionHistorySurface } from "./executionHistorySurface.js";
import type { CanonicalUserDayWindow } from "../core/time/canonicalUserDay.js";

export type SleepExecutionCommand =
  | {
      kind: "reportPublished";
      publicationBatchId: string;
      snapshotId: string;
      outcome: ExecutionReportedOutcome;
      actualTime?: ExecutionActualTimeEvidence;
      note?: string;
    }
  | {
      kind: "reportUnplanned";
      outcome: "completed" | "partial";
      actualTime: Required<ExecutionActualTimeEvidence>;
      note?: string;
    }
  | {
      kind: "correct";
      subjectId: ExecutionSubjectId;
      currentRecordId: ExecutionRecordId;
      outcome: ExecutionReportedOutcome;
      actualTime?: ExecutionActualTimeEvidence;
      note?: string;
    }
  | {
      kind: "retract";
      subjectId: ExecutionSubjectId;
      currentRecordId: ExecutionRecordId;
      note?: string;
    };
export async function executeSleepCommand(
  input: SleepExecutionCommand,
  dependencies: {
    historicalPlan: HistoricalPlanSurface;
    execution: ReturnType<typeof createExecutionHistorySurface>;
    resolveOwner: (instant: Date) => CanonicalUserDayWindow;
    withWrite: <T>(write: () => T) => T;
    isCurrent: () => boolean;
  },
) {
  const reject = () => ({ status: "rejected", reason: "invalidInput" }) as const;
  const history = await dependencies.historicalPlan.exportHistoricalPlan();
  if (
    !dependencies.isCurrent() ||
    history.status !== "exported" ||
    dependencies.historicalPlan.getStatus().status !== "ready"
  )
    return reject();
  const ingress = dependencies.execution.getExecutionHistoryIngressStatus();
  const migration = dependencies.execution.getExecutionHistoryMigrationStatus();
  if (
    ingress.status === "recoveryRequired" ||
    (ingress.status === "accepted" && ingress.quarantinedComponentCount > 0) ||
    ["protected", "unavailable", "initializing", "migrating"].includes(migration)
  )
    return reject();
  const records = dependencies.execution.getExecutionHistory();
  if (!validateSleepExecutionPublications(records, history.batches)) return reject();
  if (input.kind === "reportPublished") {
    const batch = history.batches.find((batch) => batch.id === input.publicationBatchId);
    const snapshot = batch?.days
      .flatMap((day) => day.occurrences)
      .find((snapshot) => snapshot.version === 4 && snapshot.sleep.snapshotId === input.snapshotId);
    if (!snapshot || snapshot.version !== 4) return reject();
    return dependencies.withWrite(() =>
      dependencies.execution.recordExecution({
        ...publishedSleepExecutionTarget(snapshot),
        outcome: input.outcome,
        ...(input.actualTime ? { actualTime: input.actualTime } : {}),
        ...(input.note === undefined ? {} : { note: input.note }),
      }),
    );
  }
  if (input.kind === "reportUnplanned") {
    let owner: CanonicalUserDayWindow;
    try {
      owner = dependencies.resolveOwner(new Date(input.actualTime.occurredAt));
    } catch {
      return reject();
    }
    return dependencies.withWrite(() =>
      dependencies.execution.recordExecution({
        subject: { kind: "unplannedSleep", version: 1 },
        snapshot: {
          sourceFamily: "unplannedSleep",
          title: "Unplanned Sleep",
          category: "sleep",
          userDay: {
            date: owner.userDayDate,
            dayBoundaryStartTime: owner.dayBoundaryStartTime,
            utcOffsetMinutes: -owner.start.getTimezoneOffset(),
          },
          plan: { state: "unplanned" },
        },
        outcome: input.outcome,
        actualTime: input.actualTime,
        ...(input.note === undefined ? {} : { note: input.note }),
      }),
    );
  }
  const origin = records.find(
    (record) => record.subjectId === input.subjectId && record.kind === "assertion",
  );
  if (
    !origin ||
    origin.kind !== "assertion" ||
    !["publishedSleep", "unplannedSleep"].includes(origin.subject.kind)
  )
    return reject();
  if (input.kind === "retract")
    return dependencies.withWrite(() =>
      dependencies.execution.retractExecutionRecord(
        input.subjectId,
        input.currentRecordId,
        input.note,
      ),
    );
  return dependencies.withWrite(() =>
    dependencies.execution.correctExecutionRecord(input.subjectId, input.currentRecordId, {
      subject: origin.subject,
      snapshot: origin.snapshot,
      outcome: input.outcome,
      ...(input.actualTime ? { actualTime: input.actualTime } : {}),
      ...(input.note === undefined ? {} : { note: input.note }),
    }),
  );
}
