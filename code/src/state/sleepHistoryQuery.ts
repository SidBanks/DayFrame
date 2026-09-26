import { buildExecutionHistoryItems } from "../core/execution/executionHistoryProjection.js";
import { validateSleepExecutionPublications } from "../core/sleep/sleepExecution.js";
import type { HistoricalPlanSurface } from "./historicalPlanSurface.js";
import type { createExecutionHistorySurface } from "./executionHistorySurface.js";
import type { HistoricalPlanDayPublicationV1 } from "../core/historicalPlan/historicalPlan.js";
import { isCanonicalTodayEvaluationInstant } from "../core/today/buildTodayReadModel.js";
export type SleepHistoryQuery = {
  startUserDayDate: string;
  endUserDayDateExclusive: string;
  asOf: string;
};
/** Frozen publications and user assertions only. No current setup, timezone, or planning dependency. */
export async function querySleepHistory(
  query: SleepHistoryQuery,
  dependencies: {
    historicalPlan: HistoricalPlanSurface;
    execution: ReturnType<typeof createExecutionHistorySurface>;
  },
) {
  if (
    !validDate(query.startUserDayDate) ||
    !validDate(query.endUserDayDateExclusive) ||
    query.startUserDayDate >= query.endUserDayDateExclusive ||
    !isCanonicalTodayEvaluationInstant(query.asOf)
  )
    return { status: "invalidQuery" } as const;
  const history = await dependencies.historicalPlan.exportHistoricalPlan();
  if (
    history.status !== "exported" ||
    dependencies.historicalPlan.getStatus().status === "protected"
  )
    return { status: "unavailableProtected" } as const;
  if (dependencies.historicalPlan.getStatus().status !== "ready")
    return { status: "unavailable" } as const;
  const ingress = dependencies.execution.getExecutionHistoryIngressStatus(),
    migration = dependencies.execution.getExecutionHistoryMigrationStatus();
  if (
    ingress.status === "recoveryRequired" ||
    migration === "protected" ||
    (ingress.status === "accepted" && ingress.quarantinedComponentCount > 0)
  )
    return { status: "unavailableProtected" } as const;
  if (["initializing", "migrating", "unavailable"].includes(migration))
    return { status: "unavailable" } as const;
  const records = dependencies.execution.getExecutionHistory();
  if (!validateSleepExecutionPublications(records, history.batches))
    return { status: "unavailableProtected" } as const;
  const items = buildExecutionHistoryItems(
    records.filter((record) => record.recordedAt <= query.asOf),
  );
  const effective = new Map<string, { batchId: string; day: HistoricalPlanDayPublicationV1 }>();
  const batches = history.batches
    .filter((batch) => batch.publishedAt <= query.asOf)
    .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  for (const batch of batches)
    for (const day of batch.days)
      if (inRange(day.userDayDate)) effective.set(day.userDayDate, { batchId: batch.id, day });
  const publications = batches.flatMap((batch) =>
    batch.days
      .filter((day) => inRange(day.userDayDate))
      .flatMap((day) =>
        day.occurrences
          .filter((snapshot) => snapshot.version === 4)
          .map((snapshot) => {
            const execution = items.find(
              (item) =>
                item.subject.kind === "publishedSleep" &&
                item.subject.publicationBatchId === batch.id &&
                item.subject.snapshotId === snapshot.sleep.snapshotId,
            );
            const actual =
              execution?.currentOutcome.status !== "unknown"
                ? execution?.currentOutcome.record.actualTime
                : undefined;
            const comparison =
              actual?.occurredAt && actual.durationMinutes
                ? {
                    plannedDurationMinutes: snapshot.sleep.occurrence.durationMinutes,
                    actualDurationMinutes: actual.durationMinutes,
                    durationDifferenceMinutes:
                      actual.durationMinutes - snapshot.sleep.occurrence.durationMinutes,
                    startDifferenceMinutes:
                      (Date.parse(actual.occurredAt) - Date.parse(snapshot.plan.startsAt)) / 60000,
                    actualStart: actual.occurredAt,
                    actualEnd: new Date(
                      Date.parse(actual.occurredAt) + actual.durationMinutes * 60000,
                    ).toISOString(),
                  }
                : null;
            return {
              comparison,
              snapshot: structuredClone(snapshot),
              publicationBatchId: batch.id,
              publishedAt: batch.publishedAt,
              superseded: effective.get(day.userDayDate)?.batchId !== batch.id,
              execution: execution ? structuredClone(execution) : null,
              actualState: !execution
                ? "unknown"
                : execution.currentRecord.kind === "retraction"
                  ? "retracted"
                  : execution.revisions.length > 1
                    ? "corrected"
                    : execution.currentOutcome.status,
            };
          }),
      ),
  );
  const coverage = [];
  for (
    let day = query.startUserDayDate;
    day < query.endUserDayDateExclusive;
    day = new Date(Date.parse(day) + 86400000).toISOString().slice(0, 10)
  ) {
    if (coverage.length >= 366) return { status: "invalidQuery" } as const;
    const authority = effective.get(day);
    coverage.push({
      ownerDay: day,
      status: authority ? (authority.day.sleepCoverage ?? "legacyUnavailable") : "noPublication",
    });
  }
  return {
    status: "available",
    coverage,
    publications,
    unplanned: items
      .filter(
        (item) => item.subject.kind === "unplannedSleep" && inRange(item.snapshot.userDay.date),
      )
      .map((item) => structuredClone(item)),
  } as const;
  function inRange(day: string) {
    return day >= query.startUserDayDate && day < query.endUserDayDateExclusive;
  }
}
function validDate(date: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(Date.parse(date)) &&
    new Date(date).toISOString().slice(0, 10) === date
  );
}
