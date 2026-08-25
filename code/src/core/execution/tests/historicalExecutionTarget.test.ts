import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../../authored/sourceIncarnation.js";
import type { BlockCandidate, DraftScheduledBlock } from "../../blocks/types.js";
import { createDurableOccurrenceReference } from "../../occurrences/durableOccurrenceReference.js";
import {
  createManualEventOccurrenceIdentity,
  createTemplateOccurrenceIdentity,
  createWorkOccurrenceIdentity,
} from "../../occurrences/occurrenceIdentity.js";
import type { PlanDecisionId } from "../../decisions/planDecision.js";
import type { DayFrameAuthoredSetup, DayFramePreview } from "../../../state/types.js";
import { createExecutionHistorySurface } from "../../../state/executionHistorySurface.js";
import {
  isReportableScheduledBlock,
  materializeHistoricalExecutionTarget,
} from "../historicalExecutionTarget.js";

const incarnation = (tail: string) => `00000000-0000-4000-8000-${tail}` as SourceIncarnationId;
const templateIdentity = createTemplateOccurrenceIdentity({
  templateId: "template",
  recurrenceId: "recurrence",
  frequency: "daily",
  userDayDate: "2026-08-20",
  userWeekStartDate: "2026-08-16",
  slot: 0,
});
const workIdentity = createWorkOccurrenceIdentity({
  shiftDefinitionId: "shift",
  shiftCycleId: "cycle",
  shiftSegmentId: "segment",
  localStartDate: "2026-08-20",
});
const manualIdentity = createManualEventOccurrenceIdentity("manual");

const state = {
  schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "sunday" },
  previewRange: { preset: "oneWeek", startDate: "2026-08-20", endDate: "2026-08-27" },
  shiftDefinitions: [
    {
      id: "shift",
      incarnationId: incarnation("000000000001"),
      userId: "u",
      name: "Night shift",
      startTime: "22:00",
      endTime: "06:00",
      workDays: ["thursday"],
      crossesMidnight: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  ],
  shiftCycles: [
    {
      id: "cycle",
      incarnationId: incarnation("000000000002"),
      name: "Cycle",
      cycleStartDate: "2026-08-20",
      cycleLengthDays: 1,
      active: true,
      segments: [
        {
          id: "segment",
          incarnationId: incarnation("000000000003"),
          name: "Work",
          startDayOffset: 0,
          endDayOffset: 0,
          shiftDefinitionId: "shift",
        },
      ],
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  ],
  blockTemplates: [
    {
      id: "template",
      incarnationId: incarnation("000000000004"),
      userId: "u",
      title: "Workout",
      category: "fitness",
      placementType: "flexible",
      durationMinutes: 60,
      priority: 3,
      preferredWindow: "anyAvailable",
      rescheduleBehavior: "askUser",
      requiresResource: false,
      externalResources: [],
      enabled: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  ],
  blockRecurrences: [
    {
      id: "recurrence",
      incarnationId: incarnation("000000000005"),
      blockTemplateId: "template",
      frequency: "daily",
    },
  ],
  manualEvents: [
    {
      id: "manual",
      incarnationId: incarnation("000000000006"),
      title: "Appointment",
      userDayDate: "2026-08-20",
      allDay: false,
      startTime: "23:30",
      endTime: "01:00",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  ],
} as unknown as DayFrameAuthoredSetup;

function candidate(): BlockCandidate {
  return {
    id: "candidate-runtime",
    occurrenceIdentity: templateIdentity,
    userId: "u",
    templateId: "template",
    recurrenceId: "recurrence",
    recurrenceFrequency: "daily",
    title: "Workout",
    category: "fitness",
    placementType: "flexible",
    durationMinutes: 60,
    priority: 3,
    preferredWindow: "anyAvailable",
    rescheduleBehavior: "askUser",
    externalResources: [],
    userDayDate: "2026-08-20",
    userWeekStartDate: "2026-08-16",
  };
}

function scheduled(id = "scheduled-runtime"): DraftScheduledBlock {
  return {
    id,
    occurrenceIdentity: templateIdentity,
    userId: "u",
    templateId: "template",
    source: "template",
    title: "Workout",
    category: "fitness",
    placementType: "flexible",
    startsAt: new Date("2026-08-20T23:30:00.000Z"),
    endsAt: new Date("2026-08-21T00:30:00.000Z"),
    userDayDate: "2026-08-20",
    userWeekStartDate: "2026-08-16",
    priority: 3,
    status: "planned",
    externalResources: [],
  };
}

function preview(overrides: Partial<DayFramePreview> = {}): DayFramePreview {
  return {
    result: {
      generatedWorkBlocks: [],
      blockCandidates: [candidate()],
      scheduledBlocks: [scheduled()],
      unplacedCandidates: [],
      frictionPoints: [],
      planDecisionResults: [],
    },
    rangeStartDate: "2026-08-20",
    rangeEndDate: "2026-08-27",
    planningWindowStart: new Date("2026-08-20T03:00:00.000Z"),
    planningWindowEnd: new Date("2026-08-28T03:00:00.000Z"),
    generatedAt: "2026-08-20T12:00:00.000Z",
    isStale: false,
    ...overrides,
  };
}

describe("historical execution target materialization", () => {
  it("materializes a fresh scheduled template with exact overnight interval and no execution claims", () => {
    const current = preview();
    const result = materializeHistoricalExecutionTarget({
      authoredSetup: state,
      preview: current,
      selection: { kind: "scheduledBlock", blockId: "scheduled-runtime" },
    });
    expect(result.status).toBe("materialized");
    if (result.status !== "materialized") return;
    expect(result.target.snapshot).toMatchObject({
      sourceFamily: "template",
      title: "Workout",
      category: "fitness",
      userDay: { date: "2026-08-20", dayBoundaryStartTime: "03:00" },
      plan: {
        state: "scheduled",
        startsAt: "2026-08-20T23:30:00.000Z",
        endsAt: "2026-08-21T00:30:00.000Z",
      },
    });
    expect(JSON.stringify(result.target)).not.toMatch(
      /outcome|actualTime|note|provenance|subjectId|recordedAt/,
    );
    expect(isReportableScheduledBlock(current.result.scheduledBlocks[0]!)).toBe(true);
  });

  it("is runtime-ID independent and clone/JSON safe", () => {
    const one = materializeHistoricalExecutionTarget({
      authoredSetup: state,
      preview: preview(),
      selection: { kind: "scheduledBlock", blockId: "scheduled-runtime" },
    });
    const changed = preview();
    changed.result.scheduledBlocks = [scheduled("different-runtime")];
    const two = materializeHistoricalExecutionTarget({
      authoredSetup: state,
      preview: changed,
      selection: { kind: "scheduledBlock", blockId: "different-runtime" },
    });
    expect(one).toEqual(two);
    if (one.status === "materialized") {
      const parsed = JSON.parse(JSON.stringify(one.target));
      one.target.snapshot.title = "mutated";
      expect(state.blockTemplates[0]!.title).toBe("Workout");
      expect(parsed.snapshot.title).toBe("Workout");
    }
  });

  it("materializes unplaced and blocked candidates without fictional intervals", () => {
    const unplaced = preview();
    unplaced.result.scheduledBlocks = [];
    unplaced.result.unplacedCandidates = [candidate()];
    const ordinary = materializeHistoricalExecutionTarget({
      authoredSetup: state,
      preview: unplaced,
      selection: { kind: "unplacedCandidate", candidateId: "candidate-runtime" },
    });
    expect(ordinary).toMatchObject({
      status: "materialized",
      target: { snapshot: { plan: { state: "unplaced" } } },
    });
    const ref = createDurableOccurrenceReference(templateIdentity, state);
    if (ref.status !== "created") throw new Error("fixture failed");
    unplaced.result.planDecisionResults = [
      {
        decisionId: "30000000-0000-4000-8000-000000000001" as PlanDecisionId,
        kind: "placeOccurrence",
        target: ref.reference,
        status: "blocked",
        reason: "exactPlacementUnavailable",
      },
    ];
    const blocked = materializeHistoricalExecutionTarget({
      authoredSetup: state,
      preview: unplaced,
      selection: { kind: "unplacedCandidate", candidateId: "candidate-runtime" },
    });
    expect(blocked).toMatchObject({
      status: "materialized",
      target: { snapshot: { plan: { state: "blocked" } } },
    });
    if (blocked.status === "materialized")
      expect(Object.keys(blocked.target.snapshot.plan)).toEqual(["state"]);
  });

  it("materializes applicable omission through decision/reference correlation", () => {
    const current = preview();
    current.result.scheduledBlocks = [];
    const ref = createDurableOccurrenceReference(templateIdentity, state);
    if (ref.status !== "created") throw new Error("fixture failed");
    const decisionId = "30000000-0000-4000-8000-000000000002" as PlanDecisionId;
    current.result.planDecisionResults = [
      { decisionId, kind: "omitOccurrence", target: ref.reference, status: "applied" },
    ];
    const result = materializeHistoricalExecutionTarget({
      authoredSetup: state,
      preview: current,
      selection: { kind: "planDecision", decisionId },
    });
    expect(result).toMatchObject({
      status: "materialized",
      target: { snapshot: { plan: { state: "omitted" } } },
    });
  });

  it("materializes work and manual-event scheduled families", () => {
    const current = preview();
    current.result.generatedWorkBlocks = [
      {
        id: "work-runtime",
        occurrenceIdentity: workIdentity,
        shiftDefinitionId: "shift",
        shiftCycleId: "cycle",
        shiftSegmentId: "segment",
        userId: "u",
        title: "Night shift",
        startsAt: new Date("2026-08-20T22:00:00.000Z"),
        endsAt: new Date("2026-08-21T06:00:00.000Z"),
        startDate: "2026-08-20",
        endDate: "2026-08-21",
        userDayDate: "2026-08-20",
        crossesMidnight: true,
      },
    ];
    const manualBase = scheduled("manual-runtime");
    delete manualBase.templateId;
    current.result.scheduledBlocks.push({
      ...manualBase,
      occurrenceIdentity: manualIdentity,
      source: "manual",
      title: "Appointment",
      category: "optional",
    });
    const work = materializeHistoricalExecutionTarget({
      authoredSetup: state,
      preview: current,
      selection: { kind: "workBlock", blockId: "work-runtime" },
    });
    const manual = materializeHistoricalExecutionTarget({
      authoredSetup: state,
      preview: current,
      selection: { kind: "scheduledBlock", blockId: "manual-runtime" },
    });
    expect(work).toMatchObject({
      status: "materialized",
      target: { snapshot: { sourceFamily: "work", category: "work" } },
    });
    expect(manual).toMatchObject({
      status: "materialized",
      target: { snapshot: { sourceFamily: "manualEvent", title: "Appointment" } },
    });
  });

  it("rejects imported/synthetic lineage and stale/Try-only preview evidence", () => {
    const imported = preview();
    const importedBase = scheduled();
    delete importedBase.occurrenceIdentity;
    imported.result.scheduledBlocks = [{ ...importedBase, source: "importedCalendar" }];
    expect(
      materializeHistoricalExecutionTarget({
        authoredSetup: state,
        preview: imported,
        selection: { kind: "scheduledBlock", blockId: "scheduled-runtime" },
      }),
    ).toEqual({ status: "unsupportedFamily" });
    expect(
      materializeHistoricalExecutionTarget({
        authoredSetup: state,
        preview: preview({ isStale: true }),
        selection: { kind: "scheduledBlock", blockId: "scheduled-runtime" },
      }),
    ).toEqual({ status: "stalePreview" });
    expect(
      materializeHistoricalExecutionTarget({
        authoredSetup: state,
        preview: preview({ revisedAt: "2026-08-20T13:00:00.000Z" }),
        selection: { kind: "scheduledBlock", blockId: "scheduled-runtime" },
      }),
    ).toEqual({ status: "tryOnlyPreview" });
  });

  it("distinguishes missing, recreated lifetime, occurrence loss, and lost historical context", () => {
    const refResult = createDurableOccurrenceReference(templateIdentity, state);
    if (refResult.status !== "created") throw new Error("fixture failed");
    const deleted = { ...state, blockTemplates: [] };
    expect(
      materializeHistoricalExecutionTarget({
        authoredSetup: deleted,
        selection: { kind: "historicalReference", reference: refResult.reference },
      }),
    ).toEqual({ status: "sourceMissing" });
    const recreated = structuredClone(state);
    recreated.blockTemplates[0]!.incarnationId = incarnation("000000000099");
    expect(
      materializeHistoricalExecutionTarget({
        authoredSetup: recreated,
        selection: { kind: "historicalReference", reference: refResult.reference },
      }),
    ).toEqual({ status: "lifetimeMismatch" });
    const missingOccurrence = structuredClone(state);
    missingOccurrence.blockRecurrences[0]!.frequency = "weekly";
    expect(
      materializeHistoricalExecutionTarget({
        authoredSetup: missingOccurrence,
        selection: { kind: "historicalReference", reference: refResult.reference },
      }),
    ).toEqual({ status: "occurrenceMissing" });
    expect(
      materializeHistoricalExecutionTarget({
        authoredSetup: state,
        selection: { kind: "historicalReference", reference: refResult.reference },
      }),
    ).toEqual({ status: "insufficientHistoricalContext" });
  });

  it("feeds ExecutionHistory directly without materialization-side writes or identity allocation", () => {
    const result = materializeHistoricalExecutionTarget({
      authoredSetup: state,
      preview: preview(),
      selection: { kind: "scheduledBlock", blockId: "scheduled-runtime" },
    });
    expect(result.status).toBe("materialized");
    if (result.status !== "materialized") return;
    const surface = createExecutionHistorySurface({
      allocateRecordId: () => "40000000-0000-4000-8000-000000000001" as never,
      allocateSubjectId: () => "50000000-0000-4000-8000-000000000001" as never,
      now: () => "2026-08-20T20:00:00.000Z",
    });
    expect(surface.getExecutionHistory()).toEqual([]);
    expect(
      surface.recordExecution({
        subject: { kind: "planned", reference: result.target.reference },
        snapshot: result.target.snapshot,
        outcome: "completed",
      }).status,
    ).toBe("accepted");
  });
});
