import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../../authored/sourceIncarnation.js";
import { createManualEventOccurrenceIdentity, createTemplateOccurrenceIdentity,
  createWorkOccurrenceIdentity } from "../../occurrences/occurrenceIdentity.js";
import type { PlanDecisionId } from "../../decisions/planDecision.js";
import type { ExecutionRecordV1 } from "../executionRecord.js";
import type { DayFrameAuthoredSetup, DayFramePreview } from "../../../state/types.js";
import { materializeHistoricalExecutionTarget } from "../historicalExecutionTarget.js";
import { deriveCurrentPreviewReportingCoverage, deriveOutcomeSummary } from "../executionSummary.js";

const incarnation = (tail: string) => `00000000-0000-4000-8000-${tail}` as SourceIncarnationId;
const templateIdentity = createTemplateOccurrenceIdentity({ templateId: "template", recurrenceId: "recurrence",
  frequency: "daily", userDayDate: "2026-08-20", userWeekStartDate: "2026-08-16", slot: 0 });
const workIdentity = createWorkOccurrenceIdentity({ shiftDefinitionId: "shift", shiftCycleId: "cycle",
  shiftSegmentId: "segment", localStartDate: "2026-08-20" });
const manualIdentity = createManualEventOccurrenceIdentity("manual");
const state = { schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "sunday" },
  previewRange: { preset: "oneWeek", startDate: "2026-08-20", endDate: "2026-08-27" },
  shiftDefinitions: [{ id: "shift", incarnationId: incarnation("000000000001"), userId: "u", name: "Shift",
    startTime: "09:00", endTime: "17:00", workDays: ["thursday"], crossesMidnight: false,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }],
  shiftCycles: [{ id: "cycle", incarnationId: incarnation("000000000002"), name: "Cycle", cycleStartDate: "2026-08-20",
    cycleLengthDays: 1, active: true, segments: [{ id: "segment", incarnationId: incarnation("000000000003"),
      name: "Work", startDayOffset: 0, endDayOffset: 0, shiftDefinitionId: "shift" }],
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }],
  blockTemplates: [{ id: "template", incarnationId: incarnation("000000000004"), userId: "u", title: "Workout",
    category: "fitness", placementType: "flexible", durationMinutes: 60, priority: 3, preferredWindow: "anyAvailable",
    rescheduleBehavior: "askUser", requiresResource: false, externalResources: [], enabled: true,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }],
  blockRecurrences: [{ id: "recurrence", incarnationId: incarnation("000000000005"), blockTemplateId: "template", frequency: "daily" }],
  manualEvents: [{ id: "manual", incarnationId: incarnation("000000000006"), title: "Appointment", userDayDate: "2026-08-20",
    allDay: false, startTime: "18:00", endTime: "19:00", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }],
} as unknown as DayFrameAuthoredSetup;

function preview(overrides: Partial<DayFramePreview> = {}): DayFramePreview {
  return { result: { blockCandidates: [{ id: "candidate", occurrenceIdentity: templateIdentity, userId: "u", templateId: "template",
      recurrenceId: "recurrence", recurrenceFrequency: "daily", title: "Workout", category: "fitness", placementType: "flexible",
      durationMinutes: 60, priority: 3, preferredWindow: "anyAvailable", rescheduleBehavior: "askUser", externalResources: [],
      userDayDate: "2026-08-20", userWeekStartDate: "2026-08-16" }],
    scheduledBlocks: [{ id: "scheduled", occurrenceIdentity: templateIdentity, userId: "u", templateId: "template", source: "template",
      title: "Workout", category: "fitness", placementType: "flexible", startsAt: new Date("2026-08-20T15:00:00Z"),
      endsAt: new Date("2026-08-20T16:00:00Z"), userDayDate: "2026-08-20", userWeekStartDate: "2026-08-16",
      priority: 3, status: "planned", externalResources: [] },
    { id: "manual-runtime", occurrenceIdentity: manualIdentity, userId: "u", source: "manual", title: "Appointment", category: "optional",
      placementType: "fixed", startsAt: new Date("2026-08-20T23:00:00Z"), endsAt: new Date("2026-08-21T00:00:00Z"),
      userDayDate: "2026-08-20", userWeekStartDate: "2026-08-16", priority: 1, status: "planned", externalResources: [] }],
    generatedWorkBlocks: [{ id: "work-runtime", occurrenceIdentity: workIdentity, shiftDefinitionId: "shift", shiftCycleId: "cycle",
      shiftSegmentId: "segment", userId: "u", title: "Shift", startsAt: new Date("2026-08-20T14:00:00Z"),
      endsAt: new Date("2026-08-20T22:00:00Z"), startDate: "2026-08-20", endDate: "2026-08-20",
      userDayDate: "2026-08-20", crossesMidnight: false }], unplacedCandidates: [], frictionPoints: [], planDecisionResults: [] },
    rangeStartDate: "2026-08-20", rangeEndDate: "2026-08-27", planningWindowStart: new Date("2026-08-20T03:00:00Z"),
    planningWindowEnd: new Date("2026-08-28T03:00:00Z"), generatedAt: "2026-08-20T12:00:00Z", isStale: false, ...overrides };
}

const uuid = (tail: string) => `00000000-0000-4000-8000-${tail}`;
function record(subject: string, outcome: "completed" | "partial" | "skipped", date: string, family = "unplanned",
  replaces?: string): ExecutionRecordV1 {
  return { version: 1, id: uuid(subject), subjectId: uuid(`1${subject.slice(1)}`), kind: "assertion", provenance: { kind: "userReported" },
    recordedAt: "2026-09-01T12:00:00Z", subject: { kind: "unplanned" }, outcome,
    snapshot: { sourceFamily: family, title: "Historical", category: "optional", userDay: { date, dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
      plan: { state: "unplanned" } }, ...(replaces ? { replacesRecordId: uuid(replaces) } : {}) } as unknown as ExecutionRecordV1;
}

describe("execution summary", () => {
  it("counts each current subject once, scopes by frozen user-day, and reclassifies corrections/retractions", () => {
    const plannedTarget = materializeHistoricalExecutionTarget({ authoredSetup: state, preview: preview(),
      selection: { kind: "scheduledBlock", blockId: "scheduled" } });
    if (plannedTarget.status !== "materialized") throw new Error("fixture did not materialize");
    const completed = record("000000000001", "completed", "2026-08-20");
    const partial = record("000000000002", "partial", "2026-08-21");
    const skipped = { ...record("000000000003", "skipped", "2026-08-22"),
      subject: { kind: "planned", reference: plannedTarget.target.reference }, snapshot: plannedTarget.target.snapshot } as ExecutionRecordV1;
    const corrected = { ...record("000000000004", "partial", "2026-08-20"), subjectId: completed.subjectId,
      replacesRecordId: completed.id } as ExecutionRecordV1;
    const retracted = { version: 1, id: uuid("000000000005"), subjectId: skipped.subjectId, kind: "retraction",
      provenance: { kind: "userReported" }, recordedAt: "2026-09-02T12:00:00Z", replacesRecordId: skipped.id } as unknown as ExecutionRecordV1;
    const result = deriveOutcomeSummary({ records: [retracted, partial, corrected, skipped, completed],
      startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-22" });
    expect(result).toMatchObject({ status: "available", summary: { completed: 0, partial: 2, skipped: 0,
      knownNotReportedSubjects: 1, totalSubjects: 3, bySourceFamily: { unplanned: { partial: 2 }, template: { knownNotReportedSubjects: 1 } } } });
  });

  it("returns explicit invalid range and zeros for empty history", () => {
    expect(deriveOutcomeSummary({ records: [], startUserDayDate: "2026-08-22", endUserDayDate: "2026-08-20" })).toEqual({ status: "invalidRange" });
    expect(deriveOutcomeSummary({ records: [] })).toMatchObject({ status: "available", summary: { totalSubjects: 0 } });
  });

  it("derives fresh coverage, excludes unsupported imported blocks, and is runtime-order independent", () => {
    const current = preview();
    const imported = { ...current.result.scheduledBlocks[0]!, id: "imported", source: "importedCalendar" as const };
    delete imported.occurrenceIdentity;
    current.result.scheduledBlocks.push(imported);
    const target = materializeHistoricalExecutionTarget({ authoredSetup: state, preview: current,
      selection: { kind: "scheduledBlock", blockId: "scheduled" } });
    if (target.status !== "materialized") throw new Error("fixture did not materialize");
    const history = { ...record("000000000001", "completed", "2026-08-20"),
      subject: { kind: "planned", reference: target.target.reference }, snapshot: target.target.snapshot } as ExecutionRecordV1;
    expect(deriveCurrentPreviewReportingCoverage({ authoredSetup: state, preview: current, records: [history] }))
      .toEqual({ status: "available", coverage: { eligibleOccurrences: 3, reportedOccurrences: 1, unreportedOccurrences: 2 } });
    current.result.scheduledBlocks.reverse();
    expect(deriveCurrentPreviewReportingCoverage({ authoredSetup: state, preview: current, records: [history] }))
      .toEqual({ status: "available", coverage: { eligibleOccurrences: 3, reportedOccurrences: 1, unreportedOccurrences: 2 } });
  });

  it("deduplicates overlapping representations and treats a retracted subject as unreported", () => {
    const current = preview();
    current.result.unplacedCandidates = [current.result.blockCandidates[0]!];
    const ref = materializeHistoricalExecutionTarget({ authoredSetup: state, preview: current,
      selection: { kind: "scheduledBlock", blockId: "scheduled" } });
    if (ref.status !== "materialized") throw new Error("fixture did not materialize");
    current.result.planDecisionResults = [{ decisionId: "30000000-0000-4000-8000-000000000001" as PlanDecisionId,
      kind: "omitOccurrence", target: ref.target.reference, status: "applied" }];
    const assertion = { ...record("000000000001", "completed", "2026-08-20"), subject: { kind: "planned", reference: ref.target.reference },
      snapshot: ref.target.snapshot } as ExecutionRecordV1;
    const retraction = { version: 1, id: uuid("000000000002"), subjectId: assertion.subjectId, kind: "retraction", provenance: { kind: "userReported" },
      recordedAt: "2026-08-21T12:00:00Z", replacesRecordId: assertion.id } as unknown as ExecutionRecordV1;
    expect(deriveCurrentPreviewReportingCoverage({ authoredSetup: state, preview: current, records: [retraction, assertion] }))
      .toEqual({ status: "available", coverage: { eligibleOccurrences: 3, reportedOccurrences: 0, unreportedOccurrences: 3 } });
  });

  it("returns explicit no, stale, and Try Preview availability", () => {
    expect(deriveCurrentPreviewReportingCoverage({ authoredSetup: state, preview: null, records: [] })).toEqual({ status: "unavailable", reason: "noPreview" });
    expect(deriveCurrentPreviewReportingCoverage({ authoredSetup: state, preview: preview({ isStale: true }), records: [] })).toEqual({ status: "unavailable", reason: "stalePreview" });
    expect(deriveCurrentPreviewReportingCoverage({ authoredSetup: state, preview: preview({ revisedAt: "2026-08-20T13:00:00Z" }), records: [] })).toEqual({ status: "unavailable", reason: "tryPreview" });
  });

  it("does not join an old lifetime and fails closed for inconsistent current context", () => {
    const current = preview();
    const target = materializeHistoricalExecutionTarget({ authoredSetup: state, preview: current,
      selection: { kind: "scheduledBlock", blockId: "scheduled" } });
    if (target.status !== "materialized" || target.target.reference.sourceKind !== "template") throw new Error("fixture did not materialize");
    const oldReference = structuredClone(target.target.reference);
    oldReference.template.incarnationId = incarnation("000000000099");
    const oldHistory = { ...record("000000000001", "completed", "2026-08-20"),
      subject: { kind: "planned", reference: oldReference }, snapshot: target.target.snapshot } as ExecutionRecordV1;
    expect(deriveCurrentPreviewReportingCoverage({ authoredSetup: state, preview: current, records: [oldHistory] }))
      .toMatchObject({ status: "available", coverage: { eligibleOccurrences: 3, reportedOccurrences: 0 } });
    const inconsistent = { ...state, blockTemplates: [] };
    expect(deriveCurrentPreviewReportingCoverage({ authoredSetup: inconsistent, preview: current, records: [] }))
      .toEqual({ status: "unavailable", reason: "inconsistentPlanContext" });
  });
});
