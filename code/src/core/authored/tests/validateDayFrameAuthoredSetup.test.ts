import { describe, expect, it } from "vitest";

import type { DayFrameAuthoredPattern } from "../../../state/types.js";
import { validateDayFrameAuthoredSetup } from "../validateDayFrameAuthoredSetup.js";

describe("validateDayFrameAuthoredSetup", () => {
  it("accepts a coherent snapshot deterministically without mutating it", () => {
    const setup = buildValidSetup();
    const before = structuredClone(setup);

    const first = validateDayFrameAuthoredSetup(setup);
    const second = validateDayFrameAuthoredSetup(setup);

    expect(first).toEqual({ status: "valid", advisories: [] });
    expect(second).toEqual(first);
    expect(setup).toEqual(before);
  });

  it("collects top-level and common nested duplicate IDs in rule order", () => {
    const setup = buildValidSetup();
    setup.shiftDefinitions.push({ ...setup.shiftDefinitions[0]! });
    setup.shiftCycles[0]!.sequence = [{ id: "segment_1", dayOffset: 0, shiftDefinitionId: null }];

    const result = validateDayFrameAuthoredSetup(setup);

    expect(result.status).toBe("invalid");
    if (result.status === "invalid") {
      expect(result.issues.map((currentIssue) => currentIssue.code)).toEqual([
        "duplicateSourceId",
        "duplicateWorkEntryId",
      ]);
    }
  });

  it("rejects invalid shift semantics and missing work-source references", () => {
    const setup = buildValidSetup();
    setup.shiftDefinitions[0]!.workDays = [];
    setup.shiftCycles[0]!.segments[0]!.shiftDefinitionId = "missing_shift";
    setup.shiftCycles[0]!.segments[0]!.shiftCycleId = "wrong_cycle";

    expect(issueCodes(setup)).toEqual([
      "invalidShiftDefinition",
      "cycleContainmentMismatch",
      "missingSourceReference",
    ]);
  });

  it("validates inactive segments and sequence entries", () => {
    const setup = buildValidSetup();
    setup.shiftCycles[0]!.sequence = [
      { id: "sequence_1", dayOffset: 1, shiftDefinitionId: "missing_shift" },
    ];

    expect(issueCodes(setup)).toEqual(["missingSourceReference", "invalidSequence"]);
  });

  it("rejects cycle and segment range violations", () => {
    const setup = buildValidSetup();
    setup.shiftCycles[0]!.segments.push({
      ...setup.shiftCycles[0]!.segments[0]!,
      id: "segment_2",
      startsOnDate: "2026-05-15",
      endsOnDate: "2026-06-02",
    });

    expect(issueCodes(setup)).toEqual(["invalidSegment", "overlappingSegment"]);
  });

  it("allows templates without recurrences and multiple recurrences per template", () => {
    const setup = buildValidSetup();
    setup.blockTemplates.push({
      ...setup.blockTemplates[0]!,
      id: "template_dormant",
      title: "Dormant",
    });
    setup.blockRecurrences.push({
      id: "rec_second",
      blockTemplateId: "template_1",
      frequency: "weekly",
    });

    expect(validateDayFrameAuthoredSetup(setup).status).toBe("valid");
  });

  it("rejects orphan and malformed supported recurrences", () => {
    const setup = buildValidSetup();
    setup.blockRecurrences = [
      {
        id: "rec_orphan",
        blockTemplateId: "missing_template",
        frequency: "specificWeekdays",
        weekdays: [],
      },
      {
        id: "rec_times",
        blockTemplateId: "template_1",
        frequency: "timesPerUserWeek",
        timesPerUserWeek: 0,
      },
    ];

    expect(issueCodes(setup)).toEqual([
      "missingSourceReference",
      "invalidRecurrence",
      "invalidRecurrence",
    ]);
  });

  it("accepts unsupported declared recurrence intent with advisories", () => {
    const setup = buildValidSetup();
    setup.blockRecurrences = [
      { id: "rec_segment", blockTemplateId: "template_1", frequency: "perShiftSegment" },
      { id: "rec_custom", blockTemplateId: "template_1", frequency: "custom" },
    ];

    expect(validateDayFrameAuthoredSetup(setup)).toEqual({
      status: "valid",
      advisories: [
        expect.objectContaining({
          code: "unsupportedRecurrenceFrequency",
          classification: "unsupported",
          sourceId: "rec_segment",
        }),
        expect.objectContaining({
          code: "unsupportedRecurrenceFrequency",
          classification: "unsupported",
          sourceId: "rec_custom",
        }),
      ],
    });
  });

  it("rejects invalid preferences and preview range", () => {
    const setup = buildValidSetup();
    setup.schedulingPreferences.dayBoundaryStartTime = "25:00";
    setup.previewRange.startDate = "2026-05-10";
    setup.previewRange.endDate = "2026-05-01";

    expect(issueCodes(setup)).toEqual(["invalidSchedulingPreference", "invalidPreviewRange"]);
  });

  it("validates timed and all-day manual-event shapes while preserving overnight times", () => {
    const setup = buildValidSetup();
    setup.manualEvents = [
      {
        id: "manual_overnight",
        title: "Overnight",
        userDayDate: "2026-05-05",
        allDay: false,
        startTime: "23:00",
        endTime: "01:00",
        createdAt: "2026-05-01T00:00:00Z",
        updatedAt: "2026-05-01T00:00:00Z",
      },
      {
        id: "manual_invalid_all_day",
        title: "All day",
        userDayDate: "2026-05-06",
        allDay: true,
        startTime: "09:00",
        createdAt: "2026-05-01T00:00:00Z",
        updatedAt: "2026-05-01T00:00:00Z",
      },
    ];

    expect(issueCodes(setup)).toEqual(["invalidManualEvent"]);
  });
});

function issueCodes(setup: DayFrameAuthoredPattern): string[] {
  const result = validateDayFrameAuthoredSetup(setup);

  expect(result.status).toBe("invalid");
  return result.status === "invalid" ? result.issues.map((currentIssue) => currentIssue.code) : [];
}

function buildValidSetup(): DayFrameAuthoredPattern {
  return {
    schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "saturday" },
    previewRange: {
      preset: "threeDays",
      startDate: "2026-05-04",
      endDate: "2026-05-06",
    },
    shiftDefinitions: [
      {
        id: "shift_1",
        userId: "user_1",
        name: "Day",
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
        id: "cycle_1",
        userId: "user_1",
        name: "May",
        type: "fixedSegments",
        mode: "manualSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [
          {
            id: "segment_1",
            shiftCycleId: "cycle_1",
            shiftDefinitionId: "shift_1",
            startsOnDate: "2026-05-01",
            endsOnDate: "2026-05-31",
          },
        ],
        sequence: [],
        sequenceAnchorDate: "2026-05-01",
        createdAt: "2026-05-01T00:00:00Z",
        updatedAt: "2026-05-01T00:00:00Z",
      },
    ],
    blockTemplates: [
      {
        id: "template_1",
        userId: "user_1",
        title: "Exercise",
        category: "fitness",
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
    blockRecurrences: [{ id: "rec_1", blockTemplateId: "template_1", frequency: "daily" }],
    manualEvents: [],
  };
}
