import type { DayFrameAuthoredSetup, DayFramePreview } from "../../state/types.js";
import {
  durableOccurrenceReferencesEqual,
  type DurableOccurrenceReference,
} from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import { buildExecutionHistoryItems } from "./executionHistoryProjection.js";
import type { ExecutionRecordV1, ExecutionSnapshotFamily } from "./executionRecord.js";
import {
  materializeHistoricalExecutionTarget,
  type HistoricalExecutionTargetSelection,
} from "./historicalExecutionTarget.js";

export type OutcomeCounts = {
  completed: number;
  partial: number;
  skipped: number;
  knownNotReportedSubjects: number;
  totalSubjects: number;
};
export type OutcomeSummary = OutcomeCounts & {
  bySourceFamily: Record<ExecutionSnapshotFamily, OutcomeCounts>;
};
export type OutcomeSummaryResult =
  | { status: "available"; summary: OutcomeSummary }
  | { status: "invalidRange" };
export type CurrentPlanReportingCoverage = {
  eligibleOccurrences: number;
  reportedOccurrences: number;
  unreportedOccurrences: number;
};
export type CurrentPlanReportingCoverageResult =
  | { status: "available"; coverage: CurrentPlanReportingCoverage }
  | {
      status: "unavailable";
      reason: "noPreview" | "stalePreview" | "tryPreview" | "inconsistentPlanContext";
    };

export function deriveOutcomeSummary(input: {
  records: readonly ExecutionRecordV1[];
  startUserDayDate?: LocalDateString;
  endUserDayDate?: LocalDateString;
}): OutcomeSummaryResult {
  if (
    (input.startUserDayDate && !validDate(input.startUserDayDate)) ||
    (input.endUserDayDate && !validDate(input.endUserDayDate)) ||
    (input.startUserDayDate &&
      input.endUserDayDate &&
      input.startUserDayDate > input.endUserDayDate)
  ) {
    return { status: "invalidRange" };
  }
  const summary = emptySummary();
  for (const item of buildExecutionHistoryItems(input.records)) {
    const date = item.snapshot.userDay.date;
    if (
      (input.startUserDayDate && date < input.startUserDayDate) ||
      (input.endUserDayDate && date > input.endUserDayDate)
    )
      continue;
    increment(summary, item.currentOutcome.status);
    increment(summary.bySourceFamily[item.snapshot.sourceFamily], item.currentOutcome.status);
  }
  return { status: "available", summary };
}

export function deriveCurrentPreviewReportingCoverage(input: {
  authoredSetup: DayFrameAuthoredSetup;
  preview: DayFramePreview | null;
  records: readonly ExecutionRecordV1[];
}): CurrentPlanReportingCoverageResult {
  const preview = input.preview;
  if (!preview) return { status: "unavailable", reason: "noPreview" };
  if (preview.isStale) return { status: "unavailable", reason: "stalePreview" };
  if (preview.revisedAt !== undefined) return { status: "unavailable", reason: "tryPreview" };
  const references: DurableOccurrenceReference[] = [];
  for (const selection of selections(preview)) {
    const result = materializeHistoricalExecutionTarget({
      authoredSetup: input.authoredSetup,
      preview,
      selection,
    });
    if (result.status === "materialized") {
      if (
        result.target.snapshot.userDay.date < preview.rangeStartDate ||
        result.target.snapshot.userDay.date > preview.rangeEndDate
      )
        continue;
      if (
        !references.some((reference) =>
          durableOccurrenceReferencesEqual(reference, result.target.reference),
        )
      ) {
        references.push(result.target.reference);
      }
      continue;
    }
    if (
      result.status === "sourceMissing" ||
      result.status === "lifetimeMismatch" ||
      result.status === "occurrenceMissing" ||
      result.status === "invalidSnapshot" ||
      result.status === "invalidReference" ||
      result.status === "insufficientHistoricalContext"
    ) {
      return { status: "unavailable", reason: "inconsistentPlanContext" };
    }
  }
  const historyItems = buildExecutionHistoryItems(input.records);
  let reportedOccurrences = 0;
  for (const reference of references) {
    const item = historyItems.find(
      (candidate) =>
        candidate.subject.kind === "planned" &&
        durableOccurrenceReferencesEqual(candidate.subject.reference, reference),
    );
    if (item && item.currentOutcome.status !== "unknown") reportedOccurrences += 1;
  }
  return {
    status: "available",
    coverage: {
      eligibleOccurrences: references.length,
      reportedOccurrences,
      unreportedOccurrences: references.length - reportedOccurrences,
    },
  };
}

function selections(preview: DayFramePreview): HistoricalExecutionTargetSelection[] {
  return [
    ...preview.result.scheduledBlocks.map((block) => ({
      kind: "scheduledBlock" as const,
      blockId: block.id,
    })),
    ...preview.result.generatedWorkBlocks.map((block) => ({
      kind: "workBlock" as const,
      blockId: block.id,
    })),
    ...preview.result.unplacedCandidates.map((candidate) => ({
      kind: "unplacedCandidate" as const,
      candidateId: candidate.id,
    })),
    ...preview.result.planDecisionResults.map((result) => ({
      kind: "planDecision" as const,
      decisionId: result.decisionId,
    })),
  ];
}

function counts(): OutcomeCounts {
  return { completed: 0, partial: 0, skipped: 0, knownNotReportedSubjects: 0, totalSubjects: 0 };
}
function emptySummary(): OutcomeSummary {
  return {
    ...counts(),
    bySourceFamily: {
      template: counts(),
      work: counts(),
      manualEvent: counts(),
      acceptedAllocation: counts(),
      unplanned: counts(),
    },
  };
}
function increment(
  target: OutcomeCounts,
  status: "completed" | "partial" | "skipped" | "unknown",
): void {
  if (status === "unknown") target.knownNotReportedSubjects += 1;
  else target[status] += 1;
  target.totalSubjects += 1;
}
function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
