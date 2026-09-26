import type { SourceIncarnationId } from "../../core/authored/sourceIncarnation.js";
import { v14RestoreFixture } from "./v14RestoreFixture.js";
import type {
  PlanPublicationBatchV1,
  HistoricalPlannedOccurrenceSnapshot,
} from "../../core/historicalPlan/historicalPlan.js";
import { validatePlanPublicationBatch } from "../../core/historicalPlan/historicalPlanValidation.js";
/** Validated historical fixture, not an authoring/persistence or storage-performance simulation. */
export async function goalRecordedCanonicalFixture() {
  const f = await v14RestoreFixture("Recorded evidence Goal");
  const backup = structuredClone(f.backup);
  const frozen = {
    version: 1 as const,
    goalId: f.goalId,
    goalRevision: 1,
    title: "Original frozen name",
    status: "active" as const,
  };
  const occurrences: HistoricalPlannedOccurrenceSnapshot[] = Array.from({ length: 29 }, (_, n) => ({
    version: 1,
    reference: {
      version: 1,
      sourceKind: "manualEvent",
      manualEvent: {
        id: `evidence-${n}`,
        incarnationId:
          `00000000-0000-4000-8000-${String(n + 1).padStart(12, "0")}` as SourceIncarnationId,
      },
    },
    sourceFamily: "manualEvent",
    title: `Historical linked work ${String(n).padStart(2, "0")}`,
    category: "work",
    plan:
      n < 13
        ? {
            state: "scheduled",
            startsAt: new Date(Date.parse("2026-09-11T06:00:00.000Z") + n * 60000).toISOString(),
            endsAt: new Date(
              Date.parse("2026-09-11T06:00:00.000Z") + (n + 1) * 60000,
            ).toISOString(),
          }
        : { state: n === 13 ? "unplaced" : n === 14 ? "omitted" : "blocked" },
    ...(n === 28
      ? {}
      : {
          goals:
            n < 16
              ? [
                  frozen,
                  { ...frozen, goalId: backup.data.goals.goals.find((g) => g.id !== f.goalId)!.id },
                ]
              : [],
        }),
  }));
  const batch: PlanPublicationBatchV1 = {
    version: 1,
    surfaceVersion: 1,
    id: "99999999-9999-4999-8999-999999999928" as PlanPublicationBatchV1["id"],
    publishedAt: new Date().toISOString(),
    range: { startUserDayDate: "2026-09-10", endUserDayDate: "2026-09-11" },
    days: [
      {
        version: 1,
        userDayDate: "2026-09-10",
        dayBoundaryStartTime: "03:00",
        weekStartsOn: "monday",
        utcOffsetMinutes: -300,
        occurrences,
      },
      {
        version: 1,
        userDayDate: "2026-09-11",
        dayBoundaryStartTime: "03:00",
        weekStartsOn: "monday",
        utcOffsetMinutes: -300,
        occurrences: [],
      },
    ],
  };
  const checked = validatePlanPublicationBatch(batch);
  if (checked.status !== "valid") throw Error(JSON.stringify(checked));
  backup.data.historicalPlan.batches.push(checked.batch);
  const imported = await f.store.importBackupFile(backup);
  if (imported.status !== "restoredV14") throw Error(JSON.stringify(imported));
  return { ...f, backup, goal: f.store.getGoal(f.goalId)! };
}
