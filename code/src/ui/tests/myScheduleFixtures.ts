import type { DayFrameStoreInitialState } from "../../state/types.js";
export function myScheduleFixture(count = 50): DayFrameStoreInitialState {
  const at = "2026-09-01T00:00:00.000Z";
  const blockTemplates = Array.from({ length: count }, (_, i) => ({
    id: `commitment-${i}`,
    userId: "u",
    title:
      i === 0
        ? "Legacy Sleep"
        : `Commitment ${String(i).padStart(2, "0")} — A long recurring obligation with important supporting details`,
    category: i === 0 ? ("sleep" as const) : ("admin" as const),
    requiresWorkAnchor: i % 2 === 0,
    placementType: "flexible" as const,
    durationMinutes: 90,
    bufferBeforeMinutes: 15,
    bufferAfterMinutes: 10,
    priority: 3 as const,
    preferredWindow: "custom" as const,
    customWindowStartTime: "22:00" as const,
    customWindowEndTime: "02:00" as const,
    rescheduleBehavior: "askUser" as const,
    requiresResource: true,
    externalResources: [
      {
        id: `resource-${i}`,
        type: "note" as const,
        label: "Retain me",
        value: "Exact resource",
        metadata: { custom: "unchanged" },
        createdAt: at,
        updatedAt: at,
      },
    ],
    enabled: i % 3 !== 0,
    createdAt: at,
    updatedAt: at,
  }));
  return {
    schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "monday" },
    previewRange: { preset: "custom", startDate: "2026-09-21", endDate: "2026-09-23" },
    blockTemplates,
    blockRecurrences: blockTemplates.map((t, i) => ({
      id: `rec-${i}`,
      blockTemplateId: t.id,
      frequency:
        i === 2 ? "custom" : i === 3 ? "perShiftSegment" : i === 1 ? "specificWeekdays" : "daily",
      ...(i === 1 ? { weekdays: ["monday" as const, "thursday" as const] } : {}),
      startsOnDate: "2026-09-01",
      endsOnDate: "2026-12-31",
    })),
    shiftDefinitions: [
      {
        id: "night",
        userId: "u",
        name: "Night shift",
        startTime: "22:00",
        endTime: "06:00",
        crossesMidnight: true,
        workDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        createdAt: at,
        updatedAt: at,
      },
    ],
    shiftCycles: [
      {
        id: "dated",
        userId: "u",
        name: "Dated Work period",
        type: "fixedSegments",
        mode: "manualSegments",
        startsOnDate: "2026-09-01",
        endsOnDate: "2026-09-10",
        segments: [
          {
            id: "segment-a",
            shiftCycleId: "dated",
            shiftDefinitionId: "night",
            startsOnDate: "2026-09-01",
            endsOnDate: "2026-09-05",
            schedulePreferences: { dayBoundaryStartTime: "12:00", weekStartsOn: "wednesday" },
          },
          {
            id: "segment-b",
            shiftCycleId: "dated",
            shiftDefinitionId: "night",
            startsOnDate: "2026-09-06",
            endsOnDate: "2026-09-10",
          },
        ],
        createdAt: at,
        updatedAt: at,
      },
      {
        id: "rotation",
        userId: "u",
        name: "Repeating Work rotation",
        type: "fixedSegments",
        mode: "repeatingSequence",
        startsOnDate: "2026-09-11",
        endsOnDate: "2026-10-31",
        sequenceAnchorDate: "2026-09-11",
        sequence: [
          { id: "on", dayOffset: 0, shiftDefinitionId: "night" },
          { id: "off", dayOffset: 1, shiftDefinitionId: null },
        ],
        segments: [],
        createdAt: at,
        updatedAt: at,
      },
    ],
  };
}
