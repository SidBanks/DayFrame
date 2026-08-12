import { describe, expect, it } from "vitest";

import { generateSchedulePreview } from "../generateSchedulePreview.js";
import type { BlockRecurrence, BlockTemplate } from "../../blocks/types.js";
import type { ManualCalendarEvent } from "../../calendar/types.js";
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
      shiftCycles: [shiftCycle],
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
      shiftCycles: [{
        id: "cycle_001",
        userId: "user_001",
        name: "Empty Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [],
        ...baseTimestamps,
      }],
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
      shiftCycles: [{
        id: "cycle_001",
        userId: "user_001",
        name: "Empty Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [],
        ...baseTimestamps,
      }],
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

  it("places same-window flexible blocks sequentially before generating friction", () => {
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
      shiftCycles: [shiftCycle],
      blockTemplates,
      blockRecurrences,
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.frictionPoints).toEqual([]);
    expect(result.scheduledBlocks.map((scheduledBlock) => scheduledBlock.title)).toEqual([
      "Workout",
      "Errands",
    ]);
    expect(result.scheduledBlocks[0]).toMatchObject({
      title: "Workout",
      startsAt: new Date(2026, 4, 4, 14, 15, 0, 0),
      endsAt: new Date(2026, 4, 4, 15, 15, 0, 0),
    });
    expect(result.scheduledBlocks[1]).toMatchObject({
      title: "Errands",
      startsAt: new Date(2026, 4, 4, 15, 15, 0, 0),
      endsAt: new Date(2026, 4, 4, 16, 15, 0, 0),
    });
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
      shiftCycles: [shiftCycle],
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
      shiftCycles: [shiftCycle],
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
        id: "template_breakfast",
        userId: "user_001",
        title: "Breakfast",
        category: "meal",
        placementType: "fixed",
        durationMinutes: 60,
        priority: 2,
        preferredWindow: "afterWaking",
        fixedStartTime: "06:00",
        rescheduleBehavior: "autoSameUserWeek",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        ...baseTimestamps,
      },
    ];
    const generatedAt = "2026-05-03T12:34:56-05:00";

    const result = generateSchedulePreview({
      shiftDefinitions,
      shiftCycles: [shiftCycle],
      blockTemplates,
      blockRecurrences: [
        {
          id: "rec_breakfast",
          blockTemplateId: "template_breakfast",
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

  it("keeps timed and all-day manual events in the preview even without friction", () => {
    const manualEvents: ManualCalendarEvent[] = [
      {
        id: "manual_event_doctor",
        title: "Doctor Appointment",
        userDayDate: "2026-05-05",
        allDay: false,
        startTime: "21:00",
        endTime: "22:00",
        createdAt: "2026-05-03T00:00:00-05:00",
        updatedAt: "2026-05-03T00:00:00-05:00",
      },
      {
        id: "manual_event_birthday",
        title: "Birthday",
        userDayDate: "2026-05-06",
        allDay: true,
        createdAt: "2026-05-03T00:00:00-05:00",
        updatedAt: "2026-05-03T00:00:00-05:00",
      },
    ];

    const result = generateSchedulePreview({
      shiftDefinitions: [],
      shiftCycles: [{
        id: "cycle_001",
        userId: "user_001",
        name: "Empty Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [],
        ...baseTimestamps,
      }],
      blockTemplates: [],
      blockRecurrences: [],
      manualEvents,
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.scheduledBlocks).toHaveLength(2);
    expect(result.scheduledBlocks.map((scheduledBlock) => scheduledBlock.id)).toEqual([
      "manual_event_doctor",
      "manual_event_birthday",
    ]);
    expect(result.scheduledBlocks.map((scheduledBlock) => scheduledBlock.source)).toEqual([
      "manual",
      "manual",
    ]);
    expect(result.frictionPoints).toEqual([]);
  });

  it("keeps conflicting manual events in the preview while still surfacing friction", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [],
      shiftCycles: [{
        id: "cycle_001",
        userId: "user_001",
        name: "Empty Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [],
        ...baseTimestamps,
      }],
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
      manualEvents: [
        {
          id: "manual_event_late_call",
          title: "Late Call",
          userDayDate: "2026-05-05",
          allDay: false,
          startTime: "23:00",
          endTime: "23:30",
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(
      result.scheduledBlocks.some(
        (scheduledBlock) => scheduledBlock.id === "manual_event_late_call",
      ),
    ).toBe(true);
    expect(result.frictionPoints).toHaveLength(1);
    expect(result.frictionPoints[0]?.title).toContain("Late Call");
  });

  it("treats non-work days as downtime days for flexible templates without generating friction", () => {
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
      name: "Weekday Rotation",
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

    const result = generateSchedulePreview({
      shiftDefinitions,
      shiftCycles: [shiftCycle],
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
          id: "template_laundry",
          userId: "user_001",
          title: "Laundry",
          category: "maintenance",
          placementType: "flexible",
          durationMinutes: 60,
          priority: 3,
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
        {
          id: "rec_workout",
          blockTemplateId: "template_workout",
          frequency: "specificWeekdays",
          weekdays: ["saturday"],
        },
        {
          id: "rec_laundry",
          blockTemplateId: "template_laundry",
          frequency: "specificWeekdays",
          weekdays: ["saturday"],
        },
      ],
      planningWindowStart: new Date(2026, 4, 9, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 10, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.unplacedCandidates).toEqual([]);
    expect(
      result.scheduledBlocks.some((scheduledBlock) => scheduledBlock.title === "Workout"),
    ).toBe(true);
    expect(
      result.scheduledBlocks.some((scheduledBlock) => scheduledBlock.title === "Laundry"),
    ).toBe(true);
    expect(result.scheduledBlocks.some((scheduledBlock) => scheduledBlock.title === "Sleep")).toBe(
      true,
    );
    expect(result.frictionPoints).toEqual([]);
  });

  it("skips work-required templates on downtime days without generating friction", () => {
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
      name: "Weekday Rotation",
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

    const result = generateSchedulePreview({
      shiftDefinitions,
      shiftCycles: [shiftCycle],
      blockTemplates: [
        {
          id: "template_commute",
          userId: "user_001",
          title: "Commute",
          category: "admin",
          requiresWorkAnchor: true,
          placementType: "flexible",
          durationMinutes: 30,
          priority: 2,
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
          id: "rec_commute",
          blockTemplateId: "template_commute",
          frequency: "specificWeekdays",
          weekdays: ["saturday"],
        },
      ],
      planningWindowStart: new Date(2026, 4, 9, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 9, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.scheduledBlocks).toEqual([]);
    expect(result.unplacedCandidates).toEqual([]);
    expect(result.frictionPoints).toEqual([]);
  });

  it("places both lifestyle and work-required templates when work exists", () => {
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
      name: "Weekday Rotation",
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

    const result = generateSchedulePreview({
      shiftDefinitions,
      shiftCycles: [shiftCycle],
      blockTemplates: [
        {
          id: "template_workout",
          userId: "user_001",
          title: "Workout",
          category: "fitness",
          requiresWorkAnchor: false,
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
          id: "template_commute",
          userId: "user_001",
          title: "Commute",
          category: "admin",
          requiresWorkAnchor: true,
          placementType: "flexible",
          durationMinutes: 30,
          priority: 2,
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
          id: "rec_workout",
          blockTemplateId: "template_workout",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
        {
          id: "rec_commute",
          blockTemplateId: "template_commute",
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

    expect(result.unplacedCandidates).toEqual([]);
    expect(result.scheduledBlocks.map((scheduledBlock) => scheduledBlock.title)).toEqual([
      "Commute",
      "Workout",
    ]);
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
      shiftCycles: [shiftCycle],
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
      shiftCycles: [shiftCycle],
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
      shiftCycles: [{
        id: "cycle_001",
        userId: "user_001",
        name: "Empty Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [],
        ...baseTimestamps,
      }],
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
      shiftCycles: [{
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
      }],
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
      shiftCycles: [{
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
      }],
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
      shiftCycles: [{
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
      }],
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

  it("keeps last visible-day before-sleep placement out of overnight work spillover", () => {
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
      shiftCycles: [{
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
      }],
      blockTemplates: [
        {
          id: "template_wind_down",
          userId: "user_001",
          title: "Wind Down",
          category: "recovery",
          placementType: "flexible",
          durationMinutes: 60,
          priority: 2,
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
          id: "rec_wind_down",
          blockTemplateId: "template_wind_down",
          frequency: "specificWeekdays",
          weekdays: ["thursday"],
        },
      ],
      planningWindowStart: new Date(2026, 4, 5, 3, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 8, 3, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.scheduledBlocks).toEqual([
      expect.objectContaining({
        userDayDate: "2026-05-07",
        title: "Wind Down",
        startsAt: new Date(2026, 4, 7, 20, 45, 0, 0),
        endsAt: new Date(2026, 4, 7, 21, 45, 0, 0),
      }),
    ]);
    expect(result.frictionPoints).toEqual([]);
  });

  it("propagates daily before-work sleep onto visible off-days using the nearest previous work-day anchor", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [
        {
          id: "shift_night",
          userId: "user_001",
          name: "Night Shift",
          startTime: "21:45",
          endTime: "06:15",
          workDays: ["tuesday", "thursday"],
          crossesMidnight: true,
          ...baseTimestamps,
        },
      ],
      shiftCycles: [{
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
      }],
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
      planningWindowEnd: new Date(2026, 4, 9, 3, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.generatedWorkBlocks.map((block) => block.userDayDate)).toEqual([
      "2026-05-05",
      "2026-05-07",
    ]);
    expect(result.scheduledBlocks.map((block) => block.userDayDate)).toEqual([
      "2026-05-05",
      "2026-05-06",
      "2026-05-07",
      "2026-05-08",
    ]);
    expect(result.scheduledBlocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userDayDate: "2026-05-05",
          startsAt: new Date(2026, 4, 5, 12, 15, 0, 0),
          endsAt: new Date(2026, 4, 5, 20, 45, 0, 0),
        }),
        expect.objectContaining({
          userDayDate: "2026-05-06",
          startsAt: new Date(2026, 4, 6, 12, 15, 0, 0),
          endsAt: new Date(2026, 4, 6, 20, 45, 0, 0),
        }),
        expect.objectContaining({
          userDayDate: "2026-05-07",
          startsAt: new Date(2026, 4, 7, 12, 15, 0, 0),
          endsAt: new Date(2026, 4, 7, 20, 45, 0, 0),
        }),
        expect.objectContaining({
          userDayDate: "2026-05-08",
          startsAt: new Date(2026, 4, 8, 12, 15, 0, 0),
          endsAt: new Date(2026, 4, 8, 20, 45, 0, 0),
        }),
      ]),
    );
  });

  it("uses the nearest future work-day anchor for the first visible off-day before any work day", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [
        {
          id: "shift_night",
          userId: "user_001",
          name: "Night Shift",
          startTime: "21:45",
          endTime: "06:15",
          workDays: ["wednesday"],
          crossesMidnight: true,
          ...baseTimestamps,
        },
      ],
      shiftCycles: [{
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
      }],
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
      planningWindowStart: new Date(2026, 4, 5, 3, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 7, 3, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.generatedWorkBlocks.map((block) => block.userDayDate)).toEqual(["2026-05-06"]);
    expect(result.scheduledBlocks.map((block) => block.userDayDate)).toEqual([
      "2026-05-05",
      "2026-05-06",
    ]);
    expect(result.scheduledBlocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userDayDate: "2026-05-05",
          startsAt: new Date(2026, 4, 5, 13, 45, 0, 0),
          endsAt: new Date(2026, 4, 5, 21, 45, 0, 0),
        }),
        expect.objectContaining({
          userDayDate: "2026-05-06",
          startsAt: new Date(2026, 4, 6, 13, 45, 0, 0),
          endsAt: new Date(2026, 4, 6, 21, 45, 0, 0),
        }),
      ]),
    );
  });

  it("filters cross-midnight work blocks to the visible user-day range for one-week previews", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [
        {
          id: "shift_night",
          userId: "user_001",
          name: "Night Shift",
          startTime: "21:45",
          endTime: "06:15",
          workDays: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
          crossesMidnight: true,
          ...baseTimestamps,
        },
      ],
      shiftCycles: [{
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
      }],
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 510,
          bufferBeforeMinutes: 30,
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
      planningWindowEnd: new Date(2026, 4, 12, 3, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.generatedWorkBlocks.map((block) => block.userDayDate)).toEqual([
      "2026-05-05",
      "2026-05-06",
      "2026-05-07",
      "2026-05-08",
      "2026-05-09",
      "2026-05-10",
      "2026-05-11",
    ]);
    expect(result.scheduledBlocks.map((block) => block.userDayDate)).toEqual([
      "2026-05-05",
      "2026-05-06",
      "2026-05-07",
      "2026-05-08",
      "2026-05-09",
      "2026-05-10",
      "2026-05-11",
    ]);
    expect(
      result.scheduledBlocks.every(
        (block) => block.endsAt.getTime() - block.startsAt.getTime() === 510 * 60_000,
      ),
    ).toBe(true);
  });

  it("keeps a scheduled block and its conflict friction visible when it crosses into the first visible user day", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [
        {
          id: "shift_early",
          userId: "user_001",
          name: "Early Shift",
          startTime: "03:30",
          endTime: "11:30",
          workDays: ["tuesday"],
          crossesMidnight: false,
          ...baseTimestamps,
        },
      ],
      shiftCycles: [{
        id: "cycle_001",
        userId: "user_001",
        name: "Early Rotation",
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
      }],
      blockTemplates: [
        {
          id: "template_maintenance",
          userId: "user_001",
          title: "Maintenance",
          category: "maintenance",
          placementType: "fixed",
          fixedStartTime: "02:30",
          durationMinutes: 120,
          priority: 2,
          preferredWindow: "afterWaking",
          rescheduleBehavior: "askUser",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          ...baseTimestamps,
        },
      ],
      blockRecurrences: [
        {
          id: "rec_maintenance",
          blockTemplateId: "template_maintenance",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
      planningWindowStart: new Date(2026, 4, 5, 3, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 6, 3, 0, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.scheduledBlocks).toEqual([
      expect.objectContaining({
        title: "Maintenance",
        userDayDate: "2026-05-04",
        startsAt: new Date(2026, 4, 5, 2, 30, 0, 0),
        endsAt: new Date(2026, 4, 5, 4, 30, 0, 0),
      }),
    ]);
    expect(result.frictionPoints).toEqual([
      expect.objectContaining({
        title: expect.stringContaining("Maintenance"),
        affectedUserDayDate: "2026-05-04",
      }),
    ]);
  });

  it("includes manual calendar events in scheduled blocks and friction without changing placement", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [
        {
          id: "shift_day",
          userId: "user_001",
          name: "Day Shift",
          startTime: "09:00",
          endTime: "17:00",
          workDays: ["monday"],
          crossesMidnight: false,
          ...baseTimestamps,
        },
      ],
      shiftCycles: [{
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
      }],
      blockTemplates: [],
      blockRecurrences: [],
      manualEvents: [
        {
          id: "manual_event_doctor",
          title: "Doctor Appointment",
          userDayDate: "2026-05-04",
          startTime: "10:00",
          endTime: "11:00",
          allDay: false,
          notes: "Annual checkup",
          ...baseTimestamps,
        },
      ],
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 4, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.blockCandidates).toEqual([]);
    expect(result.scheduledBlocks).toEqual([
      expect.objectContaining({
        id: "manual_event_doctor",
        source: "manual",
        title: "Doctor Appointment",
        startsAt: new Date(2026, 4, 4, 10, 0, 0, 0),
        endsAt: new Date(2026, 4, 4, 11, 0, 0, 0),
      }),
    ]);
    expect(result.frictionPoints).toEqual([
      expect.objectContaining({
        title: "Day Shift conflicts with Doctor Appointment",
        message: expect.stringContaining("manual calendar event"),
        suggestedFixes: [expect.objectContaining({ label: "Accept conflict" })],
      }),
    ]);
  });

  it("maps repeating sequence anchor dates to day 1 and repeats with modulo", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [
        {
          id: "shift_day",
          userId: "user_001",
          name: "Day Shift",
          startTime: "09:00",
          endTime: "17:00",
          workDays: ["monday"],
          crossesMidnight: false,
          ...baseTimestamps,
        },
        {
          id: "shift_night",
          userId: "user_001",
          name: "Night Shift",
          startTime: "21:45",
          endTime: "06:15",
          workDays: ["monday"],
          crossesMidnight: true,
          ...baseTimestamps,
        },
      ],
      shiftCycles: [{
        id: "cycle_sequence",
        userId: "user_001",
        name: "DDNNOO",
        type: "fixedSegments",
        mode: "repeatingSequence",
        startsOnDate: "2026-05-05",
        endsOnDate: "2026-05-10",
        segments: [],
        sequenceAnchorDate: "2026-05-01",
        sequence: [
          { id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: "shift_day" },
          { id: "sequence_day_2", dayOffset: 1, shiftDefinitionId: "shift_night" },
          { id: "sequence_day_3", dayOffset: 2, shiftDefinitionId: null },
        ],
        ...baseTimestamps,
      }],
      blockTemplates: [],
      blockRecurrences: [],
      planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 10, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(
      result.generatedWorkBlocks.map((workBlock) => ({
        startDate: workBlock.startDate,
        shiftDefinitionId: workBlock.shiftDefinitionId,
        shiftSegmentId: workBlock.shiftSegmentId,
      })),
    ).toEqual([
      {
        startDate: "2026-05-05",
        shiftDefinitionId: "shift_night",
        shiftSegmentId: "sequence_day_2",
      },
      {
        startDate: "2026-05-07",
        shiftDefinitionId: "shift_day",
        shiftSegmentId: "sequence_day_1",
      },
      {
        startDate: "2026-05-08",
        shiftDefinitionId: "shift_night",
        shiftSegmentId: "sequence_day_2",
      },
      {
        startDate: "2026-05-10",
        shiftDefinitionId: "shift_day",
        shiftSegmentId: "sequence_day_1",
      },
    ]);
  });

  it("supports previews that cross from a manual cycle into a repeating sequence cycle", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [
        {
          id: "shift_day",
          userId: "user_001",
          name: "Day Shift",
          startTime: "09:00",
          endTime: "17:00",
          workDays: ["monday"],
          crossesMidnight: false,
          ...baseTimestamps,
        },
        {
          id: "shift_night",
          userId: "user_001",
          name: "Night Shift",
          startTime: "21:45",
          endTime: "06:15",
          workDays: ["monday"],
          crossesMidnight: true,
          ...baseTimestamps,
        },
      ],
      shiftCycles: [
        {
          id: "cycle_manual",
          userId: "user_001",
          name: "Q1",
          type: "fixedSegments",
          mode: "manualSegments",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-05",
          segments: [
            {
              id: "segment_day",
              shiftCycleId: "cycle_manual",
              shiftDefinitionId: "shift_day",
              startsOnDate: "2026-05-01",
              endsOnDate: "2026-05-05",
            },
          ],
          sequence: [],
          sequenceAnchorDate: "2026-05-01",
          ...baseTimestamps,
        },
        {
          id: "cycle_sequence",
          userId: "user_001",
          name: "Q2",
          type: "fixedSegments",
          mode: "repeatingSequence",
          startsOnDate: "2026-05-06",
          endsOnDate: "2026-05-08",
          segments: [],
          sequenceAnchorDate: "2026-05-06",
          sequence: [
            { id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: "shift_night" },
            { id: "sequence_day_2", dayOffset: 1, shiftDefinitionId: null },
          ],
          ...baseTimestamps,
        },
      ],
      blockTemplates: [],
      blockRecurrences: [],
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 8, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.generatedWorkBlocks.map((workBlock) => workBlock.startDate)).toEqual([
      "2026-05-04",
      "2026-05-06",
      "2026-05-08",
    ]);
  });

  it("still places downtime templates on explicit repeating-sequence off days", () => {
    const result = generateSchedulePreview({
      shiftDefinitions: [
        {
          id: "shift_day",
          userId: "user_001",
          name: "Day Shift",
          startTime: "09:00",
          endTime: "17:00",
          workDays: ["monday"],
          crossesMidnight: false,
          ...baseTimestamps,
        },
      ],
      shiftCycles: [{
        id: "cycle_off_days",
        userId: "user_001",
        name: "4 On 4 Off",
        type: "fixedSegments",
        mode: "repeatingSequence",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-04",
        segments: [],
        sequenceAnchorDate: "2026-05-01",
        sequence: [
          { id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: "shift_day" },
          { id: "sequence_day_2", dayOffset: 1, shiftDefinitionId: null },
        ],
        ...baseTimestamps,
      }],
      blockTemplates: [
        {
          id: "template_read",
          userId: "user_001",
          title: "Reading",
          category: "optional",
          placementType: "flexible",
          durationMinutes: 60,
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
          id: "rec_read",
          blockTemplateId: "template_read",
          frequency: "daily",
        },
      ],
      planningWindowStart: new Date(2026, 4, 1, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 4, 23, 59, 0, 0),
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
      generatedAt: "2026-05-03T09:00:00-05:00",
    });

    expect(result.generatedWorkBlocks.map((workBlock) => workBlock.startDate)).toEqual([
      "2026-05-01",
      "2026-05-03",
    ]);
    expect(
      result.scheduledBlocks
        .filter((scheduledBlock) => scheduledBlock.title === "Reading")
        .map((scheduledBlock) => scheduledBlock.userDayDate),
    ).toEqual(["2026-04-30", "2026-05-01", "2026-05-02", "2026-05-03", "2026-05-04"]);
  });
});
