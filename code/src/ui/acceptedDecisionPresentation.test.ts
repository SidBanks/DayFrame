import { describe, expect, it } from "vitest";
import type { PlanDecisionV1 } from "../core/decisions/planDecision.js";
import type { DayFramePreview, DayFrameState } from "../state/types.js";
import { buildAcceptedDecisionViewModels } from "./acceptedDecisionPresentation.js";

describe("buildAcceptedDecisionViewModels", () => {
  it("presents all four semantic decision kinds with occurrence context", () => {
    const decisions = [decision("placeOccurrence"), decision("omitOccurrence"),
      decision("setOccurrenceDuration"), decision("setOccurrencePriority")];
    const models = buildAcceptedDecisionViewModels({ decisions, preview: null, authoredSetup: state() });
    expect(models.map((model) => model.summary)).toEqual([
      "Place Workout on 2026-05-05 at 9:00 AM",
      "Omit Workout",
      "Use 30 minutes for Workout",
      "Use priority 5 for Workout",
    ]);
    expect(models.every((model) => model.status === "notEvaluated")).toBe(true);
    expect(models[0]?.occurrenceContext).toBe("Occurrence on 2026-05-05");
  });

  it.each([
    ["applied", "Applied"], ["blocked", "Blocked"], ["outsideWindow", "Outside this preview"],
    ["staleSourceMissing", "Stale"], ["staleLifetime", "Stale"],
    ["staleOccurrenceMissing", "Stale"], ["inapplicable", "Not currently applicable"],
  ] as const)("maps fresh %s replay evidence", (status, copy) => {
    const current = decision("omitOccurrence");
    const preview = freshPreview(current, status);
    expect(buildAcceptedDecisionViewModels({ decisions: [current], preview, authoredSetup: state() })[0])
      .toMatchObject({ status, statusLabel: expect.stringContaining(copy) });
  });

  it("does not expose old replay truth from a stale Preview and handles missing fresh results", () => {
    const current = decision("omitOccurrence");
    const stale = freshPreview(current, "applied"); stale.isStale = true;
    expect(buildAcceptedDecisionViewModels({ decisions: [current], preview: stale, authoredSetup: state() })[0]?.status)
      .toBe("regenerateToEvaluate");
    const fresh = freshPreview(current, "applied"); fresh.result.planDecisionResults = [];
    expect(buildAcceptedDecisionViewModels({ decisions: [current], preview: fresh, authoredSetup: state() })[0]?.status)
      .toBe("unableToEvaluate");
  });

  it("uses a non-retargeting fallback when the source lifetime is unavailable", () => {
    const current = decision("omitOccurrence");
    expect(buildAcceptedDecisionViewModels({ decisions: [current], preview: null,
      authoredSetup: { ...state(), blockTemplates: [] } })[0]?.summary).toBe("Omit previous template occurrence");
  });
});

function decision(kind: PlanDecisionV1["kind"]): PlanDecisionV1 {
  const base = { version: 1 as const, id: ({ placeOccurrence: "00000000-0000-4000-8000-000000000001",
    omitOccurrence: "00000000-0000-4000-8000-000000000002", setOccurrenceDuration: "00000000-0000-4000-8000-000000000003",
    setOccurrencePriority: "00000000-0000-4000-8000-000000000004" }[kind]), acceptedAt: "2026-05-01T00:00:00Z",
    target: { version: 1 as const, sourceKind: "template" as const,
      template: { id: "template", incarnationId: "00000000-0000-4000-8000-000000000011" },
      recurrence: { id: "recurrence", incarnationId: "00000000-0000-4000-8000-000000000012" },
      coordinate: { frequency: "daily" as const, scopeKind: "userDay" as const, userDayDate: "2026-05-05" as const, slot: 0 } },
    provenance: { source: "user" as const } };
  if (kind === "placeOccurrence") return { ...base, kind, payload: { userDayDate: "2026-05-05", startTime: "09:00" } } as unknown as PlanDecisionV1;
  if (kind === "omitOccurrence") return { ...base, kind, payload: {} } as unknown as PlanDecisionV1;
  if (kind === "setOccurrenceDuration") return { ...base, kind, payload: { durationMinutes: 30 } } as unknown as PlanDecisionV1;
  return { ...base, kind, payload: { priority: 5 } } as unknown as PlanDecisionV1;
}
function state(): DayFrameState { return { blockTemplates: [{ id: "template",
  incarnationId: "00000000-0000-4000-8000-000000000011", title: "Workout" }], manualEvents: [],
  shiftDefinitions: [] } as unknown as DayFrameState; }
function freshPreview(current: PlanDecisionV1, status: string): DayFramePreview { return { result: {
  generatedWorkBlocks: [], blockCandidates: [], scheduledBlocks: [], unplacedCandidates: [], frictionPoints: [],
  planDecisionResults: [{ decisionId: current.id, kind: current.kind, target: current.target, status,
    ...(status === "blocked" ? { reason: "exactPlacementUnavailable" } : {}),
    ...(status === "inapplicable" ? { reason: "unsupportedTargetFamily" } : {}) } as never] },
  rangeStartDate: "2026-05-05", rangeEndDate: "2026-05-06", planningWindowStart: new Date(2026, 4, 5),
  planningWindowEnd: new Date(2026, 4, 7), generatedAt: "2026-05-01T00:00:00Z", isStale: false }; }
