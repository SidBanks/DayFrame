import { describe, expect, it } from "vitest";

import { generateSchedulePreview } from "../generateSchedulePreview.js";
import type { BlockRecurrence, BlockTemplate } from "../../blocks/types.js";
import type { ShiftCycle } from "../../cycles/types.js";
import type { ShiftDefinition } from "../../shifts/types.js";

const baseTimestamps = {
  createdAt: "2026-05-03T00:00:00-05:00",
  updatedAt: "2026-05-03T00:00:00-05:00",
} as const;

describe("generateSchedulePreview", () => {
  it("runs the full preview pipeline and returns draft schedule output", () => {
    const shiftDefinitions: ShiftDefinition[] = [
      {
        id: "shift_day",
        userId: "user_001",
        name: "Day Shift",
        startTime: "05:45",
        endTime: "14:15",
        workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        crossesMidnight: false,
        ...baseTimestamps,
      },
    ];
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Day Rotation",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_day",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_day",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    };
    const blockTemplates: BlockTemplate[] = [
      {
        id: "template_workout",
        userId: "user_001",
        title: "Workout",
        category: "fitness",
        placementType: "flexible",
        durationMinutes: 60,
        priority: 2,
        preferredWindow: "afterWork",
        rescheduleBehavior: "autoSameUserWeek",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        ...baseTimestamps,
      },
      {
        id: "template_review",
        userId: "user_001",
        title: "Schedule Review",
        category: "review",
        placementType: "flexible",
        durationMinutes: 60,
        priority: 2,
        preferredWindow: "beforeWork",
        rescheduleBehavior: "autoSameUserWeek",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        ...baseTimestamps,
      },
    ];
    const blockRecurrences: BlockRecurrence[] = [
      {
        id: "rec_workout",
        blockTemplateId: "template_workout",
        frequency: "specificWeekdays",
        weekdays: ["monday"],
      },
      {
        id: "rec_review",
        blockTemplateId: "template_review",
        frequency: "specificWeekdays",
        weekdays: ["monday"],
      },
    ];

    const result = generateSchedulePreview({
      shiftDefinitions,
      shiftCycle,
      blockTemplates,
      blockRecurrences,
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.generatedWorkBlocks).toHaveLength(2);
    expect(result.blockCandidates).toHaveLength(2);
    expect(result.scheduledBlocks).toHaveLength(2);
    expect(result.unplacedCandidates).toHaveLength(0);
    expect(result.frictionPoints).toHaveLength(0);
    expect(result.scheduledBlocks.map((scheduledBlock) => scheduledBlock.title)).toEqual([
      "Schedule Review",
      "Workout",
    ]);
  });

  it("does not generate sleep when the sleep template is disabled", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [],
      shiftCycle: {
        id: "cycle_001",
        userId: "user_001",
        name: "Empty Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [],
        ...baseTimestamps,
      },
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 480,
          priority: 1,
          preferredWindow: "beforeSleep",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: false,
          ...baseTimestamps,
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "daily",
        },
      ],
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.blockCandidates).toEqual([]);
    expect(result.scheduledBlocks).toEqual([]);
  });

  it("does generate sleep when the sleep template is enabled", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [],
      shiftCycle: {
        id: "cycle_001",
        userId: "user_001",
        name: "Empty Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [],
        ...baseTimestamps,
      },
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 480,
          priority: 1,
          preferredWindow: "beforeSleep",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          ...baseTimestamps,
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "daily",
        },
      ],
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.blockCandidates.length).toBeGreaterThan(0);
    expect(result.scheduledBlocks.every((scheduledBlock) => scheduledBlock.title === "Sleep")).toBe(
      true,
    );
  });

  it("returns friction with suggested fixes when the preview contains conflicts", () => {
    const shiftDefinitions: ShiftDefinition[] = [
      {
        id: "shift_day",
        userId: "user_001",
        name: "Day Shift",
        startTime: "05:45",
        endTime: "14:15",
        workDays: ["monday"],
        crossesMidnight: false,
        ...baseTimestamps,
      },
    ];
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Day Rotation",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_day",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_day",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    };
    const blockTemplates: BlockTemplate[] = [
      {
        id: "template_workout",
        userId: "user_001",
        title: "Workout",
        category: "fitness",
        placementType: "flexible",
        durationMinutes: 60,
        priority: 2,
        preferredWindow: "afterWork",
        rescheduleBehavior: "autoSameUserWeek",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        ...baseTimestamps,
      },
      {
        id: "template_errands",
        userId: "user_001",
        title: "Errands",
        category: "admin",
        placementType: "flexible",
        durationMinutes: 60,
        priority: 3,
        preferredWindow: "afterWork",
        rescheduleBehavior: "autoSameDay",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        ...baseTimestamps,
      },
    ];
    const blockRecurrences: BlockRecurrence[] = [
      {
        id: "rec_workout",
        blockTemplateId: "template_workout",
        frequency: "specificWeekdays",
        weekdays: ["monday"],
      },
      {
        id: "rec_errands",
        blockTemplateId: "template_errands",
        frequency: "specificWeekdays",
        weekdays: ["monday"],
      },
    ];

    const result = generateSchedulePreview({
      shiftDefinitions,
      shiftCycle,
      blockTemplates,
      blockRecurrences,
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.frictionPoints).toHaveLength(1);
    expect(result.frictionPoints[0]).toMatchObject({
      severity: "warning",
      affectedUserDayDate: "2026-05-04",
    });
    expect(result.frictionPoints[0]?.title).toContain("Errands");
    expect(result.frictionPoints[0]?.title).toContain("Workout");
    expect(
      result.frictionPoints[0]?.suggestedFixes.map((suggestedFix) => suggestedFix.action),
    ).toEqual(["moveBlock", "reduceDuration", "acceptConflict"]);
  });

  it("does not mutate the input arrays", () => {
    const shiftDefinitions: ShiftDefinition[] = [
      {
        id: "shift_day",
        userId: "user_001",
        name: "Day Shift",
        startTime: "05:45",
        endTime: "14:15",
        workDays: ["monday"],
        crossesMidnight: false,
        ...baseTimestamps,
      },
    ];
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Day Rotation",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_day",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_day",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    };
    const blockTemplates: BlockTemplate[] = [
      {
        id: "template_review",
        userId: "user_001",
        title: "Schedule Review",
        category: "review",
        placementType: "flexible",
        durationMinutes: 60,
        priority: 2,
        preferredWindow: "beforeWork",
        rescheduleBehavior: "autoSameUserWeek",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        ...baseTimestamps,
      },
    ];
    const blockRecurrences: BlockRecurrence[] = [
      {
        id: "rec_review",
        blockTemplateId: "template_review",
        frequency: "specificWeekdays",
        weekdays: ["monday"],
      },
    ];
    const originalShiftDefinitions = structuredClone(shiftDefinitions);
    const originalShiftCycle = structuredClone(shiftCycle);
    const originalBlockTemplates = structuredClone(blockTemplates);
    const originalBlockRecurrences = structuredClone(blockRecurrences);

    generateSchedulePreview({
      shiftDefinitions,
      shiftCycle,
      blockTemplates,
      blockRecurrences,
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(shiftDefinitions).toEqual(originalShiftDefinitions);
    expect(shiftCycle).toEqual(originalShiftCycle);
    expect(blockTemplates).toEqual(originalBlockTemplates);
    expect(blockRecurrences).toEqual(originalBlockRecurrences);
  });

  it("keeps overnight work owned by the shift start date across segment boundaries", () => {
    const shiftDefinitions: ShiftDefinition[] = [
      {
        id: "shift_day",
        userId: "user_001",
        name: "Day Shift",
        startTime: "05:45",
        endTime: "14:15",
        workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        crossesMidnight: false,
        ...baseTimestamps,
      },
      {
        id: "shift_night",
        userId: "user_001",
        name: "Night Shift",
        startTime: "21:45",
        endTime: "06:15",
        workDays: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
        crossesMidnight: true,
        ...baseTimestamps,
      },
    ];
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Boundary Rotation",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_day",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_day",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-15",
        },
        {
          id: "segment_night",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_night",
          startsOnDate: "2026-05-16",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    };

    const result = generateSchedulePreview({
      shiftDefinitions,
      shiftCycle,
      blockTemplates: [],
      blockRecurrences: [],
      planningWindowStart: new Date(2026, 4, 16, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 19, 12, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.generatedWorkBlocks).toHaveLength(2);
    expect(result.generatedWorkBlocks[0]).toMatchObject({
      shiftSegmentId: "segment_night",
      startDate: "2026-05-17",
      endDate: "2026-05-18",
      userDayDate: "2026-05-17",
      crossesMidnight: true,
    });
    expect(result.generatedWorkBlocks[1]).toMatchObject({
      shiftSegmentId: "segment_night",
      startDate: "2026-05-18",
      endDate: "2026-05-19",
      userDayDate: "2026-05-18",
      crossesMidnight: true,
    });
    expect(result.frictionPoints).toEqual([]);
  });

  it("uses generatedAt consistently for createdAt and updatedAt on detected friction", () => {
    const shiftDefinitions: ShiftDefinition[] = [
      {
        id: "shift_day",
        userId: "user_001",
        name: "Day Shift",
        startTime: "05:45",
        endTime: "14:15",
        workDays: ["monday"],
        crossesMidnight: false,
        ...baseTimestamps,
      },
    ];
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Day Rotation",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_day",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_day",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    };
    const blockTemplates: BlockTemplate[] = [
      {
        id: "template_workout",
        userId: "user_001",
        title: "Workout",
        category: "fitness",
        placementType: "flexible",
        durationMinutes: 60,
        priority: 2,
        preferredWindow: "afterWork",
        rescheduleBehavior: "autoSameUserWeek",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        ...baseTimestamps,
      },
      {
        id: "template_errands",
        userId: "user_001",
        title: "Errands",
        category: "admin",
        placementType: "flexible",
        durationMinutes: 60,
        priority: 3,
        preferredWindow: "afterWork",
        rescheduleBehavior: "autoSameDay",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        ...baseTimestamps,
      },
    ];
    const generatedAt = "2026-05-03T12:34:56-05:00";

    const result = generateSchedulePreview({
      shiftDefinitions,
      shiftCycle,
      blockTemplates,
      blockRecurrences: [
        {
          id: "rec_workout",
          blockTemplateId: "template_workout",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
        {
          id: "rec_errands",
          blockTemplateId: "template_errands",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt,
    });

    expect(result.frictionPoints[0]).toMatchObject({
      createdAt: generatedAt,
      updatedAt: generatedAt,
    });
  });

  it("resolves effective schedule preferences from the active segment", () => {
    const shiftDefinitions: ShiftDefinition[] = [
      {
        id: "shift_early",
        userId: "user_001",
        name: "Early Shift",
        startTime: "04:30",
        endTime: "12:30",
        workDays: ["monday"],
        crossesMidnight: false,
        ...baseTimestamps,
      },
    ];
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Segmented Rotation",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_early",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_early",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
          schedulePreferences: {
            dayBoundaryStartTime: "05:00",
            weekStartsOn: "monday",
          },
        },
      ],
      ...baseTimestamps,
    };

    const result = generateSchedulePreview({
      shiftDefinitions,
      shiftCycle,
      blockTemplates: [
        {
          id: "template_review",
          userId: "user_001",
          title: "Review",
          category: "review",
          placementType: "flexible",
          durationMinutes: 30,
          priority: 2,
          preferredWindow: "afterWaking",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          ...baseTimestamps,
        },
      ],
      blockRecurrences: [
        {
          id: "rec_review",
          blockTemplateId: "template_review",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 4, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.generatedWorkBlocks[0]).toMatchObject({
      userDayDate: "2026-05-03",
    });
    expect(
      result.blockCandidates.find((candidate) => candidate.userDayDate === "2026-05-04"),
    ).toMatchObject({
      userWeekStartDate: "2026-05-04",
    });
  });

  it("falls back to global schedule preferences when the active segment has no override", () => {
    const shiftDefinitions: ShiftDefinition[] = [
      {
        id: "shift_early",
        userId: "user_001",
        name: "Early Shift",
        startTime: "04:30",
        endTime: "12:30",
        workDays: ["monday"],
        crossesMidnight: false,
        ...baseTimestamps,
      },
    ];
    const shiftCycle: ShiftCycle = {
      id: "cycle_001",
      userId: "user_001",
      name: "Segmented Rotation",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_early",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_early",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    };

    const result = generateSchedulePreview({
      shiftDefinitions,
      shiftCycle,
      blockTemplates: [
        {
          id: "template_review",
          userId: "user_001",
          title: "Review",
          category: "review",
          placementType: "flexible",
          durationMinutes: 30,
          priority: 2,
          preferredWindow: "afterWaking",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          ...baseTimestamps,
        },
      ],
      blockRecurrences: [
        {
          id: "rec_review",
          blockTemplateId: "template_review",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 4, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.generatedWorkBlocks[0]).toMatchObject({
      userDayDate: "2026-05-04",
    });
    expect(
      result.blockCandidates.find((candidate) => candidate.userDayDate === "2026-05-04"),
    ).toMatchObject({
      userWeekStartDate: "2026-05-02",
    });
  });

  it("keeps sunday sleep recurrence in the sunday preview group", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [],
      shiftCycle: {
        id: "cycle_001",
        userId: "user_001",
        name: "Empty Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [],
        ...baseTimestamps,
      },
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 480,
          priority: 1,
          preferredWindow: "beforeSleep",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          ...baseTimestamps,
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "specificWeekdays",
          weekdays: ["sunday"],
        },
      ],
      planningWindowStart: new Date(2026, 4, 3, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 4, 0, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.blockCandidates.map((candidate) => candidate.userDayDate)).toContain(
      "2026-05-03",
    );
    expect(
      result.scheduledBlocks.find((scheduledBlock) => scheduledBlock.userDayDate === "2026-05-03"),
    ).toMatchObject({
      title: "Sleep",
    });
  });

  it("keeps daily 8-hour sleep visible in preview for each overlapping user day", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [
        {
          id: "shift_day",
          userId: "user_001",
          name: "Day Shift",
          startTime: "05:45",
          endTime: "14:15",
          workDays: ["monday"],
          crossesMidnight: false,
          ...baseTimestamps,
        },
      ],
      shiftCycle: {
        id: "cycle_001",
        userId: "user_001",
        name: "Day Rotation",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [
          {
            id: "segment_day",
            shiftCycleId: "cycle_001",
            shiftDefinitionId: "shift_day",
            startsOnDate: "2026-05-01",
            endsOnDate: "2026-05-31",
          },
        ],
        ...baseTimestamps,
      },
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 480,
          priority: 1,
          preferredWindow: "beforeSleep",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          ...baseTimestamps,
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "daily",
        },
      ],
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.blockCandidates).toHaveLength(3);
    expect(result.scheduledBlocks).toHaveLength(3);
    expect(result.scheduledBlocks.map((block) => block.userDayDate)).toEqual([
      "2026-05-03",
      "2026-05-04",
      "2026-05-05",
    ]);
    expect(
      result.scheduledBlocks.every(
        (block) => block.endsAt.getTime() - block.startsAt.getTime() === 480 * 60_000,
      ),
    ).toBe(true);
    expect(result.scheduledBlocks[0]).toMatchObject({
      startsAt: new Date(2026, 4, 3, 19, 0, 0, 0),
      endsAt: new Date(2026, 4, 4, 3, 0, 0, 0),
    });
  });

  it("places 8-hour sleep before a night shift using the full duration", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [
        {
          id: "shift_night",
          userId: "user_001",
          name: "Night Shift",
          startTime: "21:45",
          endTime: "06:15",
          workDays: ["tuesday"],
          crossesMidnight: true,
          ...baseTimestamps,
        },
      ],
      shiftCycle: {
        id: "cycle_001",
        userId: "user_001",
        name: "Night Rotation",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [
          {
            id: "segment_night",
            shiftCycleId: "cycle_001",
            shiftDefinitionId: "shift_night",
            startsOnDate: "2026-05-01",
            endsOnDate: "2026-05-31",
          },
        ],
        ...baseTimestamps,
      },
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 480,
          priority: 1,
          preferredWindow: "beforeWork",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          ...baseTimestamps,
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "daily",
        },
      ],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    const sleepBlock = result.scheduledBlocks.find((block) => block.userDayDate === "2026-05-05");

    expect(sleepBlock).toMatchObject({
      title: "Sleep",
      startsAt: new Date(2026, 4, 5, 13, 45, 0, 0),
      endsAt: new Date(2026, 4, 5, 21, 45, 0, 0),
    });
    expect((sleepBlock?.endsAt.getTime() ?? 0) - (sleepBlock?.startsAt.getTime() ?? 0)).toBe(
      480 * 60_000,
    );
  });

  it("keeps before-work buffered sleep on the first, middle, and last visible preview days", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [
        {
          id: "shift_night",
          userId: "user_001",
          name: "Night Shift",
          startTime: "21:45",
          endTime: "06:15",
          workDays: ["tuesday", "wednesday", "thursday"],
          crossesMidnight: true,
          ...baseTimestamps,
        },
      ],
      shiftCycle: {
        id: "cycle_001",
        userId: "user_001",
        name: "Night Rotation",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [
          {
            id: "segment_night",
            shiftCycleId: "cycle_001",
            shiftDefinitionId: "shift_night",
            startsOnDate: "2026-05-01",
            endsOnDate: "2026-05-31",
          },
        ],
        ...baseTimestamps,
      },
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 510,
          bufferBeforeMinutes: 60,
          bufferAfterMinutes: 60,
          priority: 1,
          preferredWindow: "beforeWork",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          ...baseTimestamps,
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "daily",
        },
      ],
      planningWindowStart: new Date(2026, 4, 5, 3, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 8, 3, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.generatedWorkBlocks.map((block) => block.userDayDate)).toEqual([
      "2026-05-05",
      "2026-05-06",
      "2026-05-07",
    ]);
    expect(result.scheduledBlocks.map((block) => block.userDayDate)).toEqual([
      "2026-05-05",
      "2026-05-06",
      "2026-05-07",
    ]);
    expect(result.blockCandidates.map((block) => block.userDayDate)).toEqual([
      "2026-05-05",
      "2026-05-06",
      "2026-05-07",
    ]);
    expect(result.scheduledBlocks).toHaveLength(3);
    expect(result.generatedWorkBlocks).toHaveLength(3);
    expect(result.scheduledBlocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userDayDate: "2026-05-05",
          title: "Sleep",
          startsAt: new Date(2026, 4, 5, 12, 15, 0, 0),
          endsAt: new Date(2026, 4, 5, 20, 45, 0, 0),
        }),
        expect.objectContaining({
          userDayDate: "2026-05-06",
          title: "Sleep",
          startsAt: new Date(2026, 4, 6, 12, 15, 0, 0),
          endsAt: new Date(2026, 4, 6, 20, 45, 0, 0),
        }),
        expect.objectContaining({
          userDayDate: "2026-05-07",
          title: "Sleep",
          startsAt: new Date(2026, 4, 7, 12, 15, 0, 0),
          endsAt: new Date(2026, 4, 7, 20, 45, 0, 0),
        }),
      ]),
    );
    expect(
      result.scheduledBlocks.every(
        (block) => block.endsAt.getTime() - block.startsAt.getTime() === 510 * 60_000,
      ),
    ).toBe(true);
  });
});
