import { describe, expect, it } from "vitest";
import type { DraftScheduledBlock } from "../blocks/types.js";
import type { FrictionPoint, SuggestedFixAction } from "../friction/types.js";
import type { DayFrameAuthoredSetup } from "../../state/types.js";
import { createPlanDecisionAcceptanceCandidate } from "./createPlanDecisionAcceptanceCandidate.js";

describe("createPlanDecisionAcceptanceCandidate", () => {
  it.each([
    ["moveBlock", "placeOccurrence", { userDayDate: "2026-05-05", startTime: "16:30" }],
    ["skipBlock", "omitOccurrence", {}],
    ["reduceDuration", "setOccurrenceDuration", { durationMinutes: 30 }],
    ["changePriority", "setOccurrencePriority", { priority: 3 }],
  ] as const)("maps %s to exact semantic %s input", (action, kind, payload) => {
    const original = block();
    const revised = {
      ...block(),
      startsAt: new Date(2026, 4, 5, 16, 30),
      endsAt:
        action === "reduceDuration" ? new Date(2026, 4, 5, 17, 0) : new Date(2026, 4, 5, 17, 30),
      priority: action === "changePriority" ? (3 as const) : (2 as const),
      status: action === "skipBlock" ? ("skipped" as const) : ("planned" as const),
    };
    const result = createPlanDecisionAcceptanceCandidate({
      suggestedFix: fix(action),
      frictionPoint: friction(action),
      originalPreview: preview([original]),
      revisedPreview: preview([revised]),
      authoredSetup: authored(),
    });
    expect(result).toMatchObject({
      status: "supported",
      candidate: {
        kind,
        payload,
        provenance: { source: "suggestedFix", suggestedAction: action },
        target: {
          sourceKind: "template",
          template: { id: "template" },
          recurrence: { id: "recurrence" },
        },
      },
    });
  });

  it.each(["changeFixedTime", "addResource", "convertToRecovery", "acceptConflict"] as const)(
    "keeps %s Try-only",
    (action) => {
      expect(
        createPlanDecisionAcceptanceCandidate({
          suggestedFix: fix(action),
          frictionPoint: friction(action),
          originalPreview: preview([block()]),
          revisedPreview: preview([block()]),
          authoredSetup: authored(),
        }),
      ).toEqual({ status: "unsupported", reason: "unsupportedAction" });
    },
  );
});

function block(): DraftScheduledBlock {
  return {
    id: "block",
    occurrenceIdentity: {
      version: 1,
      sourceKind: "template",
      frequency: "daily",
      templateId: "template",
      recurrenceId: "recurrence",
      scopeKind: "userDay",
      userDayDate: "2026-05-05",
      slot: 0,
    },
    userId: "user",
    templateId: "template",
    source: "template",
    title: "Block",
    category: "fitness",
    placementType: "flexible",
    startsAt: new Date(2026, 4, 5, 15, 0),
    endsAt: new Date(2026, 4, 5, 16, 0),
    userDayDate: "2026-05-05",
    userWeekStartDate: "2026-05-03",
    priority: 2,
    status: "planned",
    externalResources: [],
  };
}
function fix(action: SuggestedFixAction) {
  const prefix =
    action === "changePriority"
      ? "fix_change_priority_"
      : action === "moveBlock"
        ? "fix_move_"
        : action === "skipBlock"
          ? "fix_skip_"
          : action === "reduceDuration"
            ? "fix_reduce_"
            : "fix_other_";
  return { id: `${prefix}block`, label: action, action };
}
function friction(action: SuggestedFixAction): FrictionPoint {
  return {
    id: "friction",
    userId: "user",
    severity: "warning",
    title: "Friction",
    message: "Friction",
    affectedBlockIds: ["block"],
    suggestedFixes: [fix(action)],
    canIgnore: true,
    ignored: false,
    resolved: false,
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  };
}
function preview(scheduledBlocks: DraftScheduledBlock[]) {
  return {
    generatedWorkBlocks: [],
    blockCandidates: [],
    scheduledBlocks,
    unplacedCandidates: [],
    frictionPoints: [],
    planDecisionResults: [],
  };
}
function authored(): DayFrameAuthoredSetup {
  return {
    schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "sunday" },
    previewRange: { preset: "oneWeek", startDate: "2026-05-05", endDate: "2026-05-11" },
    shiftDefinitions: [],
    shiftCycles: [],
    blockTemplates: [
      {
        id: "template",
        incarnationId: "00000000-0000-4000-8000-000000000001",
        userId: "user",
        title: "Block",
        category: "fitness",
        placementType: "flexible",
        durationMinutes: 60,
        priority: 2,
        preferredWindow: "anyAvailable",
        rescheduleBehavior: "askUser",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        createdAt: "2026-05-01T00:00:00Z",
        updatedAt: "2026-05-01T00:00:00Z",
      },
    ],
    blockRecurrences: [
      {
        id: "recurrence",
        incarnationId: "00000000-0000-4000-8000-000000000002",
        blockTemplateId: "template",
        frequency: "daily",
      },
    ],
    manualEvents: [],
  } as unknown as DayFrameAuthoredSetup;
}
