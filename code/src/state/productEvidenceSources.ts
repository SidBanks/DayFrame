import { buildExecutionHistoryItems } from "../core/execution/executionHistoryProjection.js";
import { validateSleepExecutionPublications } from "../core/sleep/sleepExecution.js";
import {
  available,
  type HistoricalEvidence,
  type ActualEvidence,
} from "../core/productEvidence/evidence.js";
import type { HistoricalPlanSurface } from "./historicalPlanSurface.js";
import type { ExecutionHistorySurface } from "./executionHistorySurface.js";

export async function readDayPublications(
  history: Pick<HistoricalPlanSurface, "getHistoricalPlanDayEvidence">,
  ownerDay: string,
  asOf: string,
): Promise<HistoricalEvidence> {
  const result = await history.getHistoricalPlanDayEvidence(ownerDay, asOf);
  if (result.status === "available" && "publications" in result)
    return available([...result.publications]);
  if (result.status === "unavailableProtected")
    return { status: "protected", reason: result.reason };
  return { status: "unavailable", reason: "historicalReadUnavailable" };
}
/** Filter whole subject chains before projection, preserving corrections/retractions and frozen owners. */
export async function readDayActuals(
  execution: Pick<
    ExecutionHistorySurface,
    | "getExecutionHistory"
    | "getExecutionHistoryIngressStatus"
    | "getExecutionHistoryMigrationStatus"
  >,
  ownerDays: ReadonlySet<string>,
  asOf: string,
  history: HistoricalEvidence,
  publications: Pick<HistoricalPlanSurface, "getHistoricalPlanBatchEvidence">,
): Promise<ActualEvidence> {
  const ingress = execution.getExecutionHistoryIngressStatus();
  const migration = execution.getExecutionHistoryMigrationStatus();
  if (
    ingress.status === "recoveryRequired" ||
    migration === "protected" ||
    (ingress.status === "accepted" && ingress.quarantinedComponentCount > 0)
  )
    return { status: "protected", reason: "executionProtected" };
  if (["initializing", "migrating", "unavailable"].includes(migration))
    return { status: "unavailable", reason: "executionUnavailable" };
  const all = execution.getExecutionHistory();
  const subjects = new Set(
    all
      .filter((r) => r.kind === "assertion" && ownerDays.has(r.snapshot.userDay.date))
      .map((r) => r.subjectId),
  );
  const records = all.filter((r) => subjects.has(r.subjectId) && r.recordedAt <= asOf);
  // Preserve existing global Sleep reference protection, including outside this day/as-of.
  // Exact batch reads avoid exporting/scanning unrelated publication history.
  const required = new Set(
    all.flatMap((r) =>
      r.kind === "assertion" && r.subject.kind === "publishedSleep"
        ? [r.subject.publicationBatchId]
        : [],
    ),
  );
  const batches = new Map(
    history.status === "available" ? history.value.map((p) => [p.batch.id as string, p.batch]) : [],
  );
  for (const id of [...required].sort()) {
    if (batches.has(id)) continue;
    const read = await publications.getHistoricalPlanBatchEvidence(id);
    if (read.status !== "available")
      return {
        status: read.status === "unavailable" ? "unavailable" : "protected",
        reason: "sleepPublicationEvidenceUnavailable",
      };
    batches.set(id, read.batch);
  }
  if (required.size && !validateSleepExecutionPublications(all, [...batches.values()]))
    return { status: "protected", reason: "sleepPublicationMismatch" };
  return available(buildExecutionHistoryItems(records));
}
