import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../core/authored/sourceIncarnation.js";
import { projectActiveToPattern, validateIncarnationGraph } from "./activeV2.js";
import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";
import type { AuthoredSourceKind, DayFrameAuthoredPattern, DayFrameState } from "./types.js";

const pattern: DayFrameAuthoredPattern = {
  schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "saturday" },
  previewRange: { preset: "threeDays", startDate: "2026-05-04", endDate: "2026-05-06" },
  shiftDefinitions: [
    {
      id: "shift-1",
      userId: "user-1",
      name: "Shift",
      startTime: "09:00",
      endTime: "17:00",
      workDays: ["monday"],
      crossesMidnight: false,
      createdAt: "2026-05-01T00:00:00Z",
      updatedAt: "2026-05-01T00:00:00Z",
    },
  ],
  shiftCycles: [
    {
      id: "cycle-1",
      userId: "user-1",
      name: "Cycle",
      type: "fixedSegments",
      mode: "manualSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      sequenceAnchorDate: "2026-05-01",
      createdAt: "2026-05-01T00:00:00Z",
      updatedAt: "2026-05-01T00:00:00Z",
      segments: [
        {
          id: "segment-1",
          shiftCycleId: "cycle-1",
          shiftDefinitionId: "shift-1",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
        },
      ],
      sequence: [{ id: "sequence-1", dayOffset: 0, shiftDefinitionId: "shift-1" }],
    },
  ],
  blockTemplates: [
    {
      id: "template-1",
      userId: "user-1",
      title: "Template",
      category: "admin",
      placementType: "flexible",
      durationMinutes: 30,
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
  blockRecurrences: [{ id: "recurrence-1", blockTemplateId: "template-1", frequency: "daily" }],
  manualEvents: [
    {
      id: "event-1",
      title: "Event",
      userDayDate: "2026-05-04",
      allDay: true,
      createdAt: "2026-05-01T00:00:00Z",
      updatedAt: "2026-05-01T00:00:00Z",
    },
  ],
};

function allocator() {
  let next = 1;
  return () => `00000000-0000-4000-8000-${String(next++).padStart(12, "0")}` as SourceIncarnationId;
}

function identities(state: DayFrameState) {
  const cycle = state.shiftCycles[0]!;
  return {
    shiftDefinition: state.shiftDefinitions[0]!.incarnationId,
    shiftCycle: cycle.incarnationId,
    shiftSegment: cycle.segments[0]!.incarnationId,
    shiftSequenceEntry: cycle.sequence![0]!.incarnationId,
    blockTemplate: state.blockTemplates[0]!.incarnationId,
    blockRecurrence: state.blockRecurrences[0]!.incarnationId,
    manualEvent: state.manualEvents[0]!.incarnationId,
  };
}

function setupInput(authored: DayFrameAuthoredPattern) {
  return {
    schedulingPreferences: authored.schedulingPreferences,
    previewRange: authored.previewRange,
    shiftDefinitions: authored.shiftDefinitions,
    shiftCycles: authored.shiftCycles,
    blockTemplates: authored.blockTemplates,
    blockRecurrences: authored.blockRecurrences,
  };
}

const setupOperations = (operation: "update" | "replace") =>
  [
    { sourceKind: "shiftDefinition", sourceId: "shift-1", operation },
    { sourceKind: "shiftCycle", sourceId: "cycle-1", operation },
    { sourceKind: "shiftSegment", parentSourceId: "cycle-1", sourceId: "segment-1", operation },
    {
      sourceKind: "shiftSequenceEntry",
      parentSourceId: "cycle-1",
      sourceId: "sequence-1",
      operation,
    },
    { sourceKind: "blockTemplate", sourceId: "template-1", operation },
    { sourceKind: "blockRecurrence", sourceId: "recurrence-1", operation },
  ] satisfies Array<{
    sourceKind: AuthoredSourceKind;
    sourceId: string;
    parentSourceId?: string;
    operation: "update" | "replace";
  }>;

describe("source incarnation lifecycle authority", () => {
  it("makes all seven runtime incarnations mandatory and preserves them on explicit update", () => {
    const store = createReadyDayFrameTestStore(pattern, {
      allocateSourceIncarnationId: allocator(),
    });
    const before = identities(store.getState());
    const authored = projectActiveToPattern(store.getState());
    const setup = setupInput(authored);

    const result = store.commitAuthoredSetupTransaction({
      authoredSetup: setup,
      lifecycle: { operations: setupOperations("update") },
    });
    expect(result.status).toBe("applied");
    expect(identities(store.getState())).toEqual(before);
    expect(() => validateIncarnationGraph(store.getState())).not.toThrow();
  });

  it("allocates fresh setup lifetimes on replace and preserves nested identity through reorder", () => {
    const store = createReadyDayFrameTestStore(pattern, {
      allocateSourceIncarnationId: allocator(),
    });
    const before = identities(store.getState());
    const authored = projectActiveToPattern(store.getState());
    const setup = setupInput(authored);
    store.commitAuthoredSetupTransaction({
      authoredSetup: setup,
      lifecycle: { operations: setupOperations("replace") },
    });
    const replaced = identities(store.getState());
    for (const kind of Object.keys(before).filter((key) => key !== "manualEvent") as Array<
      keyof typeof before
    >) {
      expect(replaced[kind], kind).not.toBe(before[kind]);
    }
  });

  it("implements create, update, replace, delete, and same-ID recreation for manual events", () => {
    const store = createReadyDayFrameTestStore(
      { ...pattern, manualEvents: [] },
      { allocateSourceIncarnationId: allocator() },
    );
    const event = pattern.manualEvents[0]!;
    store.mutateManualEvent({ operation: "create", event });
    const created = store.getState().manualEvents[0]!.incarnationId;
    store.mutateManualEvent({ operation: "update", event: { ...event, title: "Updated" } });
    expect(store.getState().manualEvents[0]!.incarnationId).toBe(created);
    store.mutateManualEvent({ operation: "replace", event });
    const replaced = store.getState().manualEvents[0]!.incarnationId;
    expect(replaced).not.toBe(created);
    store.mutateManualEvent({ operation: "delete", sourceId: event.id });
    expect(store.getState().manualEvents).toEqual([]);
    store.mutateManualEvent({ operation: "create", event });
    expect(store.getState().manualEvents[0]!.incarnationId).not.toBe(replaced);
  });
});
