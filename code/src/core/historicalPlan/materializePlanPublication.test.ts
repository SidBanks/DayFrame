import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../authored/sourceIncarnation.js";
import type { DraftScheduledBlock } from "../blocks/types.js";
import type { PlanDecisionId } from "../decisions/planDecision.js";
import { createDurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import { createManualEventOccurrenceIdentity, createTemplateOccurrenceIdentity } from "../occurrences/occurrenceIdentity.js";
import type { DayFrameAuthoredSetup, DayFramePreview } from "../../state/types.js";
import { materializePlanPublication } from "./materializePlanPublication.js";

const inc = (tail: string) => `00000000-0000-4000-8000-${tail}` as SourceIncarnationId;
const daily = createTemplateOccurrenceIdentity({ templateId: "template", recurrenceId: "daily", frequency: "daily",
  userDayDate: "2026-08-20", userWeekStartDate: "2026-08-16", slot: 0 });
const weekly = createTemplateOccurrenceIdentity({ templateId: "template", recurrenceId: "weekly", frequency: "weekly",
  userDayDate: "2026-08-20", userWeekStartDate: "2026-08-16", slot: 0 });
const manual = createManualEventOccurrenceIdentity("manual");
const authored = { schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "sunday" },
  previewRange: { preset: "custom", startDate: "2026-08-20", endDate: "2026-08-21" }, shiftDefinitions: [], shiftCycles: [],
  blockTemplates: [{ id: "template", incarnationId: inc("000000000001"), userId: "u", title: "Workout", category: "fitness",
    placementType: "flexible", durationMinutes: 60, priority: 3, preferredWindow: "anyAvailable", rescheduleBehavior: "askUser",
    requiresResource: false, externalResources: [], enabled: true, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }],
  blockRecurrences: [{ id: "daily", incarnationId: inc("000000000002"), blockTemplateId: "template", frequency: "daily" },
    { id: "weekly", incarnationId: inc("000000000003"), blockTemplateId: "template", frequency: "weekly" }],
  manualEvents: [{ id: "manual", incarnationId: inc("000000000004"), title: "Appointment", userDayDate: "2026-08-20", allDay: false,
    startTime: "20:00", endTime: "21:00", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }] } as unknown as DayFrameAuthoredSetup;
const candidate = (identity = daily) => ({ id: `candidate-${identity.slot}-${identity.frequency}`,
  occurrenceIdentity: identity, userId: "u", templateId: "template", recurrenceId: identity.recurrenceId,
  recurrenceFrequency: identity.frequency, title: "Workout", category: "fitness", placementType: "flexible", durationMinutes: 60,
  priority: 3, preferredWindow: "anyAvailable", rescheduleBehavior: "askUser", externalResources: [], userDayDate: "2026-08-20",
  userWeekStartDate: "2026-08-16" });
const scheduled = (identity = daily, id = "scheduled"): DraftScheduledBlock => ({ ...candidate(identity), id, source: "template", status: "planned",
  startsAt: new Date("2026-08-20T23:30:00.000Z"), endsAt: new Date("2026-08-21T00:30:00.000Z") } as DraftScheduledBlock);
function preview(overrides: Partial<DayFramePreview> = {}): DayFramePreview { return { result: { generatedWorkBlocks: [],
  blockCandidates: [candidate()], scheduledBlocks: [scheduled()], unplacedCandidates: [], frictionPoints: [], planDecisionResults: [] },
  rangeStartDate: "2026-08-20", rangeEndDate: "2026-08-21", planningWindowStart: new Date("2026-08-20T03:00:00Z"),
  planningWindowEnd: new Date("2026-08-22T03:00:00Z"), generatedAt: "2026-08-20T12:00:00.000Z", isStale: false, ...overrides } as DayFramePreview; }
const providers = { allocateBatchId: () => "11111111-1111-4111-8111-111111111111" as never, now: () => "2026-08-20T12:01:00.000Z" };

describe("HistoricalPlan publication materialization", () => {
  it("rejects no-preview, stale, and Try authority", () => {
    expect(materializePlanPublication({ authoredSetup: authored, preview: null }).status).toBe("noPreview");
    expect(materializePlanPublication({ authoredSetup: authored, preview: preview({ isStale: true }) }).status).toBe("stalePreview");
    expect(materializePlanPublication({ authoredSetup: authored, preview: preview({ revisedAt: "2026-08-20T12:00:01.000Z" }) }).status).toBe("tryPreview");
  });
  it("publishes exact requested range with explicit empty days and overnight geometry", () => {
    const result = materializePlanPublication({ authoredSetup: authored, preview: preview(), providers });
    expect(result.status).toBe("materialized"); if (result.status !== "materialized") return;
    expect(result.batch.days).toHaveLength(2); expect(result.batch.days[1]!.occurrences).toEqual([]);
    expect(result.batch.days[0]!.occurrences[0]!.plan).toEqual({ state: "scheduled", startsAt: "2026-08-20T23:30:00.000Z", endsAt: "2026-08-21T00:30:00.000Z" });
  });
  it("assigns manual and user-week reference forms to fresh Preview containing day", () => {
    const current = preview(); current.result.blockCandidates.push(candidate(weekly) as never);
    current.result.scheduledBlocks = [scheduled(weekly, "weekly"), { ...scheduled(daily, "manual"), occurrenceIdentity: manual,
      source: "manual", title: "Appointment", category: "optional" } as never];
    const result = materializePlanPublication({ authoredSetup: authored, preview: current, providers });
    expect(result.status).toBe("materialized"); if (result.status !== "materialized") return;
    expect(result.batch.days[0]!.occurrences.map((value) => value.sourceFamily).sort()).toEqual(["manualEvent", "template"]);
  });
  it("materializes unplaced, blocked, and omitted state without intervals", () => {
    const current = preview(); current.result.scheduledBlocks = []; current.result.unplacedCandidates = [candidate() as never];
    const reference = createDurableOccurrenceReference(daily, authored); if (reference.status !== "created") throw new Error("fixture");
    const blockedId = "30000000-0000-4000-8000-000000000001" as PlanDecisionId;
    current.result.planDecisionResults = [{ decisionId: blockedId, kind: "placeOccurrence", target: reference.reference, status: "blocked", reason: "exactPlacementUnavailable" }];
    let result = materializePlanPublication({ authoredSetup: authored, preview: current, providers });
    expect(result.status === "materialized" && result.batch.days[0]!.occurrences[0]!.plan).toEqual({ state: "blocked" });
    const omitId = "30000000-0000-4000-8000-000000000002" as PlanDecisionId;
    current.result.unplacedCandidates = []; current.result.planDecisionResults = [{ decisionId: omitId, kind: "omitOccurrence", target: reference.reference, status: "applied" }];
    result = materializePlanPublication({ authoredSetup: authored, preview: current, providers });
    expect(result.status === "materialized" && result.batch.days[0]!.occurrences[0]!.plan).toEqual({ state: "omitted" });
  });
  it("excludes hidden imported/synthetic items without adding unsupported identity", () => {
    const current = preview(); current.result.scheduledBlocks.push({ ...scheduled(), id: "imported", occurrenceIdentity: undefined, source: "importedCalendar" } as never);
    const result = materializePlanPublication({ authoredSetup: authored, preview: current, providers });
    expect(result.status).toBe("materialized"); if (result.status === "materialized") expect(result.batch.days[0]!.occurrences).toHaveLength(1);
  });
});
