import { describe, expect, it } from "vitest";
import type { PlanDecisionId } from "./planDecision.js";
import { createDurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import { createReadyDayFrameTestStore } from "../../state/tests/dayFrameStoreTestUtils.js";
import type { DayFrameAuthoredPattern } from "../../state/types.js";
import { evaluatePlanDecisionApplicability } from "./replayPlanDecisions.js";

const pattern: DayFrameAuthoredPattern = {
  schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "monday" },
  previewRange: { preset: "threeDays", startDate: "2026-08-17", endDate: "2026-08-19" },
  shiftDefinitions: [{ id: "shift", userId: "user", name: "Work", startTime: "08:00",
    endTime: "09:00", workDays: ["monday"], crossesMidnight: false,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }],
  shiftCycles: [{ id: "cycle", userId: "user", name: "Cycle", type: "fixedSegments",
    mode: "manualSegments", startsOnDate: "2026-08-01", endsOnDate: "2026-08-31",
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
    segments: [{ id: "segment", shiftCycleId: "cycle", shiftDefinitionId: "shift",
      startsOnDate: "2026-08-01", endsOnDate: "2026-08-31" }] }],
  blockTemplates: [{ id: "template", userId: "user", title: "Task", category: "admin",
    placementType: "flexible", durationMinutes: 30, priority: 3,
    preferredWindow: "anyAvailable", rescheduleBehavior: "askUser", requiresResource: false,
    externalResources: [], enabled: true, createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z" }],
  blockRecurrences: [{ id: "recurrence", blockTemplateId: "template", frequency: "daily" }],
  manualEvents: [],
};
const range = { rangeStartDate: "2026-08-17" as const, rangeEndDate: "2026-08-18" as const,
  planningWindowStart: new Date("2026-08-17T03:00:00"),
  planningWindowEnd: new Date("2026-08-19T03:00:00"), generatedAt: "2026-08-17T00:00:00Z" };

function store(seed = pattern) {
  let next = 1;
  return createReadyDayFrameTestStore(seed, {
    allocatePlanDecisionId: () => `10000000-0000-4000-8000-${String(next++).padStart(12, "0")}` as PlanDecisionId,
    planDecisionClock: () => "2026-08-17T01:00:00.000Z",
  });
}

function targetForTemplate(current: ReturnType<typeof store>) {
  const preview = current.generatePreview(range);
  const identity = preview.preview!.result.blockCandidates.find((candidate) =>
    candidate.occurrenceIdentity?.sourceKind === "template")!.occurrenceIdentity!;
  const result = createDurableOccurrenceReference(identity, current.getState());
  if (result.status !== "created") throw new Error("target unavailable");
  return result.reference;
}

describe("PlanDecision deterministic replay", () => {
  it.each([
    ["omitOccurrence", {}, (result: ReturnType<ReturnType<typeof store>["getState"]>) =>
      expect(result.preview!.result.scheduledBlocks.some((block) =>
        block.templateId === "template" && block.userDayDate === "2026-08-17")).toBe(false)],
    ["setOccurrenceDuration", { durationMinutes: 45 }, (result: ReturnType<ReturnType<typeof store>["getState"]>) => {
      const block = result.preview!.result.scheduledBlocks.find((candidate) => candidate.templateId === "template")!;
      expect((block.endsAt.getTime() - block.startsAt.getTime()) / 60_000).toBe(45);
    }],
    ["setOccurrencePriority", { priority: 1 }, (result: ReturnType<ReturnType<typeof store>["getState"]>) =>
      expect(result.preview!.result.scheduledBlocks.find((block) => block.templateId === "template")!.priority).toBe(1)],
    ["placeOccurrence", { userDayDate: "2026-08-17", startTime: "10:00" },
      (result: ReturnType<ReturnType<typeof store>["getState"]>) =>
        expect(result.preview!.result.scheduledBlocks.find((block) => block.templateId === "template")!.startsAt.getHours()).toBe(10)],
  ] as const)("applies %s before/through placement", (kind, payload, assertResult) => {
    const current = store(); const target = targetForTemplate(current);
    const accepted = current.acceptPlanDecision({ kind, target, payload,
      provenance: { source: "user" } } as Parameters<typeof current.acceptPlanDecision>[0]);
    expect(accepted.status).toBe("accepted");
    expect(current.getState().preview!.isStale).toBe(true);
    const result = current.generatePreview(range);
    assertResult(result);
    expect(result.preview!.isStale).toBe(false);
    expect(result.preview!.result.planDecisionResults).toMatchObject([{ status: "applied", kind }]);
  });

  it("blocks an exact placement against an anchored manual event without fallback", () => {
    const current = store({ ...pattern, manualEvents: [{ id: "manual", title: "Busy",
      userDayDate: "2026-08-17", allDay: false, startTime: "10:00", endTime: "11:00",
      createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }] });
    const target = targetForTemplate(current);
    current.acceptPlanDecision({ kind: "placeOccurrence", target,
      payload: { userDayDate: "2026-08-17", startTime: "10:00" }, provenance: { source: "user" } });
    const result = current.generatePreview(range).preview!.result;
    expect(result.planDecisionResults[0]).toMatchObject({ status: "blocked",
      reason: "exactPlacementUnavailable" });
    expect(result.unplacedCandidates.some((candidate) => candidate.templateId === "template")).toBe(true);
  });

  it("classifies anchored work decisions inapplicable and leaves work unchanged", () => {
    const current = store(); const preview = current.generatePreview(range);
    const work = preview.preview!.result.generatedWorkBlocks[0]!;
    const constructed = createDurableOccurrenceReference(work.occurrenceIdentity!, current.getState());
    if (constructed.status !== "created") throw new Error("target unavailable");
    current.acceptPlanDecision({ kind: "omitOccurrence", target: constructed.reference,
      payload: {}, provenance: { source: "user" } });
    const result = current.generatePreview(range).preview!.result;
    expect(result.planDecisionResults[0]).toMatchObject({ status: "inapplicable",
      reason: "unsupportedTargetFamily" });
    expect(result.generatedWorkBlocks).not.toHaveLength(0);
  });

  it("does not stale Preview for durability-only retry", () => {
    const current = store(); const target = targetForTemplate(current);
    current.acceptPlanDecision({ kind: "omitOccurrence", target, payload: {}, provenance: { source: "user" } });
    current.generatePreview(range);
    current.retryPlanDecisionPersistence();
    expect(current.getState().preview!.isStale).toBe(false);
  });

  it("distinguishes missing, mismatched, and occurrence-removed stale authority", () => {
    const current = store(); const target = targetForTemplate(current);
    const accepted = current.acceptPlanDecision({ kind: "omitOccurrence", target, payload: {},
      provenance: { source: "user" } });
    if (accepted.status !== "accepted") throw new Error("accept failed");
    expect(evaluatePlanDecisionApplicability(accepted.decision, {
      ...current.getState(), blockTemplates: [],
    })).toEqual({ status: "staleSourceMissing" });
    expect(evaluatePlanDecisionApplicability(accepted.decision, store().getState()))
      .toEqual({ status: "staleLifetime" });
    expect(evaluatePlanDecisionApplicability(accepted.decision, {
      ...current.getState(), blockRecurrences: current.getState().blockRecurrences.map((source) => ({
        ...source, startsOnDate: "2026-08-18" as const,
      })),
    })).toEqual({ status: "staleOccurrenceMissing" });
  });
});
