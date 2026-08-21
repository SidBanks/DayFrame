import { describe, expect, it } from "vitest";

import { createInitialDayFrameState } from "../../state/createInitialDayFrameState.js";
import {
  buildSetupDraft,
  buildSetupLifecycleTransaction,
  createSetupDraftSourceReference,
  recordSetupDraftSourceCreated,
  recordSetupDraftSourceDeleted,
} from "../SetupScreen.js";

const timestamp = "2026-08-20T12:00:00.000Z";

function createDraft() {
  return buildSetupDraft(
    createInitialDayFrameState({
      shiftDefinitions: [
        {
          id: "shift_1",
          userId: "user_001",
          name: "Shift",
          startTime: "09:00",
          endTime: "17:00",
          workDays: ["monday"],
          crossesMidnight: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      shiftCycles: [
        {
          id: "cycle_001",
          userId: "user_001",
          name: "Cycle",
          type: "fixedSegments",
          mode: "manualSegments",
          startsOnDate: "2026-08-01",
          endsOnDate: "2026-08-31",
          segments: [
            {
              id: "segment_1",
              shiftCycleId: "cycle_001",
              shiftDefinitionId: "shift_1",
              startsOnDate: "2026-08-01",
              endsOnDate: "2026-08-31",
            },
          ],
          sequence: [{ id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: "shift_1" }],
          sequenceAnchorDate: "2026-08-01",
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      blockTemplates: [
        {
          id: "template_1",
          userId: "user_001",
          title: "Template",
          category: "optional",
          placementType: "flexible",
          durationMinutes: 60,
          priority: 3,
          preferredWindow: "anyAvailable",
          rescheduleBehavior: "askUser",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      blockRecurrences: [
        { id: "rec_template_1", blockTemplateId: "template_1", frequency: "daily" },
      ],
    }),
    timestamp,
  );
}

describe("Setup lifecycle provenance", () => {
  it("classifies existing top-level and nested sources as continuity-preserving updates", () => {
    const operations = buildSetupLifecycleTransaction(createDraft()).operations;

    expect(operations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ operation: "update", sourceKind: "shiftDefinition" }),
        expect.objectContaining({ operation: "update", sourceKind: "shiftCycle" }),
        expect.objectContaining({ operation: "update", sourceKind: "shiftSegment" }),
        expect.objectContaining({ operation: "update", sourceKind: "shiftSequenceEntry" }),
        expect.objectContaining({ operation: "update", sourceKind: "blockTemplate" }),
        expect.objectContaining({ operation: "update", sourceKind: "blockRecurrence" }),
      ]),
    );
  });

  it.each([
    ["shiftDefinition", "shift_1", undefined],
    ["shiftCycle", "cycle_001", undefined],
    ["shiftSegment", "segment_1", "cycle_001"],
    ["shiftSequenceEntry", "sequence_day_1", "cycle_001"],
    ["blockTemplate", "template_1", undefined],
    ["blockRecurrence", "rec_template_1", undefined],
  ] as const)(
    "retains delete plus create for same-ID %s replacement",
    (sourceKind, sourceId, parentSourceId) => {
      const reference = createSetupDraftSourceReference(sourceKind, sourceId, parentSourceId);
      const deleted = recordSetupDraftSourceDeleted(createDraft(), reference);
      const recreated = recordSetupDraftSourceCreated(deleted, reference);
      const matching = buildSetupLifecycleTransaction(recreated).operations.filter(
        (operation) =>
          operation.sourceKind === sourceKind &&
          operation.sourceId === sourceId &&
          operation.parentSourceId === parentSourceId,
      );

      expect(matching.map((operation) => operation.operation)).toEqual(["delete", "create"]);
    },
  );

  it("treats create then delete in one abandoned draft lineage as no authoritative operation", () => {
    const reference = createSetupDraftSourceReference("shiftDefinition", "shift_2");
    const created = recordSetupDraftSourceCreated(createDraft(), reference);
    const deleted = recordSetupDraftSourceDeleted(created, reference);

    expect(deleted.lifecycle).toEqual({ created: [], deleted: [] });
    expect(buildSetupLifecycleTransaction(createDraft()).operations).toEqual(
      buildSetupLifecycleTransaction(deleted).operations,
    );
  });

  it("keeps nested reorder in the update lifecycle", () => {
    const draft = createDraft();
    draft.shiftCycles[0]!.sequence = [...draft.shiftCycles[0]!.sequence!].reverse();

    expect(
      buildSetupLifecycleTransaction(draft).operations.find(
        (operation) => operation.sourceKind === "shiftSequenceEntry",
      )?.operation,
    ).toBe("update");
  });
});
