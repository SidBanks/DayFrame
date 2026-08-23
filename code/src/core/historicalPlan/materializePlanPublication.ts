import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../cycles/resolveEffectiveSchedulePreferences.js";
import { materializeHistoricalExecutionTarget, type HistoricalExecutionTargetSelection } from "../execution/historicalExecutionTarget.js";
import { durableOccurrenceReferencesEqual } from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import type { DayFrameAuthoredSetup, DayFramePreview } from "../../state/types.js";
import { HISTORICAL_PLAN_DAY_PUBLICATION_VERSION, HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION,
  createPlanPublicationBatch, type HistoricalPlanConstructionProviders, type HistoricalPlanDayPublicationV1,
  type HistoricalPlannedOccurrenceSnapshotV1, type PlanPublicationBatchV1 } from "./historicalPlan.js";

export type MaterializePlanPublicationResult =
  | { status: "materialized"; batch: PlanPublicationBatchV1 }
  | { status: "noPreview" | "stalePreview" | "tryPreview" }
  | { status: "inconsistentPlanContext"; detail: string }
  | { status: "unsupportedOccurrenceFamily"; detail: string }
  | { status: "invalidCandidate"; detail: string };

export function materializePlanPublication(input: {
  authoredSetup: DayFrameAuthoredSetup;
  preview?: DayFramePreview | null;
  providers?: HistoricalPlanConstructionProviders;
}): MaterializePlanPublicationResult {
  const preview = input.preview;
  if (!preview) return { status: "noPreview" };
  if (preview.isStale) return { status: "stalePreview" };
  if (preview.revisedAt !== undefined) return { status: "tryPreview" };
  const dates = enumerateDates(preview.rangeStartDate, preview.rangeEndDate);
  if (!dates) return { status: "invalidCandidate", detail: "requested range is invalid" };
  const days = new Map<string, HistoricalPlanDayPublicationV1>();
  for (const userDayDate of dates) {
    const preferences = resolveEffectiveSchedulePreferencesForUserDayDate({
      shiftCycles: input.authoredSetup.shiftCycles,
      defaultSchedulingPreferences: input.authoredSetup.schedulingPreferences,
      userDayDate,
    });
    days.set(userDayDate, { version: HISTORICAL_PLAN_DAY_PUBLICATION_VERSION, userDayDate,
      dayBoundaryStartTime: preferences.dayBoundaryStartTime, weekStartsOn: preferences.weekStartsOn,
      utcOffsetMinutes: -new Date(`${userDayDate}T12:00:00`).getTimezoneOffset(), occurrences: [] });
  }
  const selections: HistoricalExecutionTargetSelection[] = [
    ...preview.result.scheduledBlocks.filter((block) => block.userDayDate >= preview.rangeStartDate && block.userDayDate <= preview.rangeEndDate)
      .filter((block) => block.source !== "importedCalendar" && block.source !== "rule")
      .map((block) => ({ kind: "scheduledBlock" as const, blockId: block.id })),
    ...preview.result.generatedWorkBlocks.filter((block) => block.userDayDate >= preview.rangeStartDate && block.userDayDate <= preview.rangeEndDate)
      .map((block) => ({ kind: "workBlock" as const, blockId: block.id })),
    ...preview.result.unplacedCandidates.filter((candidate) => candidate.userDayDate >= preview.rangeStartDate && candidate.userDayDate <= preview.rangeEndDate)
      .map((candidate) => ({ kind: "unplacedCandidate" as const, candidateId: candidate.id })),
    ...preview.result.planDecisionResults.filter((result) => result.kind === "omitOccurrence" && result.status === "applied")
      .map((result) => ({ kind: "planDecision" as const, decisionId: result.decisionId })),
  ];
  for (const selection of selections) {
    const result = materializeHistoricalExecutionTarget({ authoredSetup: input.authoredSetup, preview, selection });
    if (result.status === "unsupportedFamily" || result.status === "notReportable") {
      return { status: "unsupportedOccurrenceFamily", detail: `${selection.kind}:${result.status}` };
    }
    if (result.status !== "materialized") return { status: "inconsistentPlanContext", detail: `${selection.kind}:${result.status}` };
    const containingDay = days.get(result.target.snapshot.userDay.date);
    if (!containingDay) return { status: "inconsistentPlanContext", detail: "occurrence lies outside requested visible range" };
    const snapshot: HistoricalPlannedOccurrenceSnapshotV1 = {
      version: HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION,
      reference: structuredClone(result.target.reference), sourceFamily: result.target.snapshot.sourceFamily as "template" | "work" | "manualEvent",
      title: result.target.snapshot.title, category: result.target.snapshot.category, plan: { ...result.target.snapshot.plan } as HistoricalPlannedOccurrenceSnapshotV1["plan"],
    };
    const existing = containingDay.occurrences.find((value) => durableOccurrenceReferencesEqual(value.reference, snapshot.reference));
    if (!existing) containingDay.occurrences.push(snapshot);
    else if (!mergeEquivalentSnapshot(existing, snapshot)) return { status: "inconsistentPlanContext", detail: "duplicate occurrence representations disagree" };
  }
  const construction = createPlanPublicationBatch({ range: { startUserDayDate: preview.rangeStartDate, endUserDayDate: preview.rangeEndDate }, days: [...days.values()] }, input.providers);
  return construction.status === "created" ? { status: "materialized", batch: construction.batch }
    : { status: "invalidCandidate", detail: construction.status === "allocationFailure" ? construction.reason : construction.issues.map((issue) => issue.code).join(",") };
}

function mergeEquivalentSnapshot(existing: HistoricalPlannedOccurrenceSnapshotV1, candidate: HistoricalPlannedOccurrenceSnapshotV1): boolean {
  if (existing.sourceFamily !== candidate.sourceFamily || existing.title !== candidate.title || existing.category !== candidate.category) return false;
  if (JSON.stringify(existing.plan) === JSON.stringify(candidate.plan)) return true;
  if (existing.plan.state === "unplaced" && candidate.plan.state === "blocked") { existing.plan = { state: "blocked" }; return true; }
  if (existing.plan.state === "blocked" && candidate.plan.state === "unplaced") return true;
  return false;
}
function enumerateDates(start: LocalDateString, end: LocalDateString): LocalDateString[] | null {
  const first = Date.parse(`${start}T00:00:00Z`); const last = Date.parse(`${end}T00:00:00Z`);
  if (!Number.isFinite(first) || !Number.isFinite(last) || first > last) return null;
  const result: LocalDateString[] = []; for (let at = first; at <= last; at += 86_400_000) result.push(new Date(at).toISOString().slice(0, 10) as LocalDateString); return result;
}
