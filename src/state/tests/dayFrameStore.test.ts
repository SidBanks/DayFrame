import { afterEach, describe, expect, it, vi } from "vitest";

import { createDayFrameBackup } from "../dayFrameBackup.js";
import { createInitialDayFrameState } from "../createInitialDayFrameState.js";
import {
  createDayFrameStore,
  DAYFRAME_PROFILES_STORAGE_KEY,
  DAYFRAME_STORAGE_KEY,
} from "../dayFrameStore.js";
import type { BlockRecurrence, BlockTemplate } from "../../core/blocks/types.js";
import type { ShiftCycle } from "../../core/cycles/types.js";
import type { ShiftDefinition } from "../../core/shifts/types.js";

const baseTimestamps = {
  createdAt: "2026-05-03T00:00:00-05:00",
  updatedAt: "2026-05-03T00:00:00-05:00",
} as const;

afterEach(() => {
  delete (globalThis as { localStorage?: unknown }).localStorage;
});

describe("dayFrameStore", () => {
  it("loads persisted authored setup state from local storage", () => {
    const localStorage = createLocalStorageMock();

    localStorage.setItem(
      DAYFRAME_STORAGE_KEY,
      JSON.stringify({
        schedulingPreferences: {
          dayBoundaryStartTime: "04:00",
          weekStartsOn: "monday",
        },
        previewRange: {
          preset: "twoWeeks",
          startDate: "2026-05-04",
          endDate: "2026-05-18",
        },
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
        blockTemplates: [],
        blockRecurrences: [],
      }),
    );

    installLocalStorageMock(localStorage);

    const state = createDayFrameStore().getState();

    expect(state.schedulingPreferences).toEqual({
      dayBoundaryStartTime: "04:00",
      weekStartsOn: "monday",
    });
    expect(state.previewRange).toEqual({
      preset: "twoWeeks",
      startDate: "2026-05-04",
      endDate: "2026-05-18",
    });
    expect(state.shiftDefinitions).toHaveLength(1);
    expect(state.shiftCycles).toHaveLength(1);
    expect(state.shiftCycles[0]?.name).toBe("Day Rotation");
    expect(state.preview).toBeNull();
  });

  it("creates the expected initial state", () => {
    expect(createInitialDayFrameState()).toEqual({
      schedulingPreferences: {
        dayBoundaryStartTime: "03:00",
        weekStartsOn: "saturday",
      },
      previewRange: {
        preset: "threeDays",
        startDate: "2026-05-04",
        endDate: "2026-05-06",
      },
      manualEvents: [],
      shiftDefinitions: [],
      shiftCycles: [],
      shiftCycle: null,
      blockTemplates: [],
      blockRecurrences: [],
      savedProfiles: [],
      preview: null,
    });
  });

  it("normalizes legacy cycles to manualSegments with default sequence fields", () => {
    const state = createInitialDayFrameState({
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
        id: "cycle_legacy",
        userId: "user_001",
        name: "Legacy Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [
          {
            id: "segment_day",
            shiftCycleId: "cycle_legacy",
            shiftDefinitionId: "shift_day",
            startsOnDate: "2026-05-01",
            endsOnDate: "2026-05-31",
          },
        ],
        ...baseTimestamps,
      },
      blockTemplates: [],
      blockRecurrences: [],
      manualEvents: [],
    });

    expect(state.shiftCycles).toEqual([
      expect.objectContaining({
        id: "cycle_legacy",
        mode: "manualSegments",
        sequence: [],
        sequenceAnchorDate: "2026-05-01",
      }),
    ]);
  });

  it("stores manual events in authored state and includes them in saved profiles", () => {
    const localStorage = createLocalStorageMock();

    installLocalStorageMock(localStorage);

    const store = createDayFrameStore();

    store.setManualEvents([
      {
        id: "manual_event_1",
        title: "Doctor Appointment",
        userDayDate: "2026-05-06",
        startTime: "09:30",
        endTime: "10:30",
        allDay: false,
        notes: "Bring insurance card",
        ...baseTimestamps,
      },
    ]);
    store.saveProfile({
      name: "With Appointment",
      savedAt: "2026-05-05T09:00:00-05:00",
    });

    expect(store.getState().manualEvents).toEqual([
      {
        id: "manual_event_1",
        title: "Doctor Appointment",
        userDayDate: "2026-05-06",
        startTime: "09:30",
        endTime: "10:30",
        allDay: false,
        notes: "Bring insurance card",
        ...baseTimestamps,
      },
    ]);

    expect(JSON.parse(localStorage.getItem(DAYFRAME_STORAGE_KEY) ?? "{}")).toMatchObject({
      manualEvents: store.getState().manualEvents,
    });
    expect(store.getState().savedProfiles[0]?.data.manualEvents).toEqual(
      store.getState().manualEvents,
    );
  });

  it("migrates persisted manual events from legacy startsAt and endsAt fields", () => {
    const localStorage = createLocalStorageMock();

    localStorage.setItem(
      DAYFRAME_STORAGE_KEY,
      JSON.stringify({
        schedulingPreferences: {
          dayBoundaryStartTime: "03:00",
          weekStartsOn: "saturday",
        },
        previewRange: {
          preset: "threeDays",
          startDate: "2026-05-04",
          endDate: "2026-05-06",
        },
        shiftDefinitions: [],
        shiftCycle: null,
        blockTemplates: [],
        blockRecurrences: [],
        manualEvents: [
          {
            id: "manual_event_legacy",
            title: "Legacy Appointment",
            userDayDate: "2026-05-06",
            startsAt: "09:30",
            endsAt: "10:30",
            allDay: false,
            ...baseTimestamps,
          },
        ],
      }),
    );

    installLocalStorageMock(localStorage);

    expect(createDayFrameStore().getState().manualEvents).toEqual([
      {
        id: "manual_event_legacy",
        title: "Legacy Appointment",
        userDayDate: "2026-05-06",
        startTime: "09:30",
        endTime: "10:30",
        allDay: false,
        ...baseTimestamps,
      },
    ]);
  });

  it("migrates persisted templates without requiresWorkAnchor to false", () => {
    const state = createInitialDayFrameState({
      blockTemplates: [
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
      ],
      blockRecurrences: [],
    });

    expect(state.blockTemplates[0]?.requiresWorkAnchor).toBe(false);
  });

  it("re-enables untouched default sleep templates from persisted state", () => {
    const state = createInitialDayFrameState({
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
    });

    expect(state.blockTemplates[0]?.enabled).toBe(true);
  });

  it("preserves intentionally disabled sleep templates from persisted state", () => {
    const state = createInitialDayFrameState({
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
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-04T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "daily",
        },
      ],
    });

    expect(state.blockTemplates[0]?.enabled).toBe(false);
  });

  it("stores authored scheduling data and clears stale preview state", () => {
    const localStorage = createLocalStorageMock();

    installLocalStorageMock(localStorage);

    const store = createDayFrameStore();
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
      mode: "manualSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      sequenceAnchorDate: "2026-05-01",
      sequence: [],
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

    store.setShiftDefinitions(shiftDefinitions);
    store.setShiftCycle(shiftCycle);
    store.setSchedulingPreferences({
      dayBoundaryStartTime: "04:00",
      weekStartsOn: "monday",
    });
    store.setPreviewRange({
      preset: "oneWeek",
      startDate: "2026-05-04",
      endDate: "2026-05-11",
    });

    const state = store.getState();

    expect(state.schedulingPreferences).toEqual({
      dayBoundaryStartTime: "04:00",
      weekStartsOn: "monday",
    });
    expect(state.previewRange).toEqual({
      preset: "oneWeek",
      startDate: "2026-05-04",
      endDate: "2026-05-11",
    });
    expect(state.shiftDefinitions).toEqual(shiftDefinitions);
    expect(state.shiftCycles).toEqual([shiftCycle]);
    expect(state.shiftCycle).toEqual(shiftCycle);
    expect(state.preview).toBeNull();
    expect(JSON.parse(localStorage.getItem(DAYFRAME_STORAGE_KEY) ?? "{}")).toEqual({
      schedulingPreferences: {
        dayBoundaryStartTime: "04:00",
        weekStartsOn: "monday",
      },
      previewRange: {
        preset: "oneWeek",
        startDate: "2026-05-04",
        endDate: "2026-05-11",
      },
      shiftDefinitions,
      shiftCycles: [shiftCycle],
      shiftCycle,
      blockTemplates: [],
      blockRecurrences: [],
      manualEvents: [],
    });
  });

  it("generates and stores a preview from the current state", () => {
    const store = createDayFrameStore();
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
      mode: "manualSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      sequenceAnchorDate: "2026-05-01",
      sequence: [],
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

    store.setShiftDefinitions(shiftDefinitions);
    store.setShiftCycle(shiftCycle);
    store.setBlockTemplates(blockTemplates);
    store.setBlockRecurrences(blockRecurrences);

    const state = store.generatePreview({
      rangeStartDate: "2026-05-04",
      rangeEndDate: "2026-05-05",
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      generatedAt: "2026-05-03T13:00:00-05:00",
    });

    expect(state.preview).not.toBeNull();
    expect(state.preview?.generatedAt).toBe("2026-05-03T13:00:00-05:00");
    expect(state.preview?.planningWindowStart.getTime()).toBe(
      new Date(2026, 4, 4, 0, 0, 0, 0).getTime(),
    );
    expect(state.preview?.isStale).toBe(false);
    expect(state.preview?.result.generatedWorkBlocks).toHaveLength(1);
    expect(state.preview?.result.scheduledBlocks).toHaveLength(1);
    expect(state.preview?.result.frictionPoints).toEqual([]);
  });

  it("persists repeating sequence cycles in store state and local storage", () => {
    const localStorage = createLocalStorageMock();

    installLocalStorageMock(localStorage);

    const store = createDayFrameStore();
    const shiftCycle: ShiftCycle = {
      id: "cycle_sequence",
      userId: "user_001",
      name: "14 On 14 Off",
      type: "fixedSegments",
      mode: "repeatingSequence",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [],
      sequenceAnchorDate: "2026-05-01",
      sequence: [
        {
          id: "sequence_day_1",
          dayOffset: 0,
          shiftDefinitionId: "shift_day",
        },
        {
          id: "sequence_day_2",
          dayOffset: 1,
          shiftDefinitionId: null,
        },
      ],
      ...baseTimestamps,
    };

    store.setShiftCycles([shiftCycle]);

    expect(store.getState().shiftCycles).toEqual([shiftCycle]);
    expect(JSON.parse(localStorage.getItem(DAYFRAME_STORAGE_KEY) ?? "{}")).toMatchObject({
      shiftCycles: [shiftCycle],
      shiftCycle,
    });
  });

  it("marks the current preview as stale when authored setup changes", () => {
    const store = createDayFrameStore();

    store.setShiftDefinitions(buildShiftDefinitions());
    store.setShiftCycle(buildShiftCycle());
    store.setBlockTemplates(buildBlockTemplates());
    store.setBlockRecurrences(buildBlockRecurrences());
    store.generatePreview({
      rangeStartDate: "2026-05-04",
      rangeEndDate: "2026-05-05",
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      generatedAt: "2026-05-03T13:00:00-05:00",
    });

    const state = store.setSchedulingPreferences({
      dayBoundaryStartTime: "04:00",
    });

    expect(state.preview?.generatedAt).toBe("2026-05-03T13:00:00-05:00");
    expect(state.preview?.isStale).toBe(true);
  });

  it("exports authored setup data without preview state", () => {
    const store = createDayFrameStore();

    store.setSchedulingPreferences({
      dayBoundaryStartTime: "04:00",
      weekStartsOn: "monday",
    });
    store.setShiftDefinitions(buildShiftDefinitions());
    store.setShiftCycle(buildShiftCycle());
    store.setBlockTemplates(buildBlockTemplates());
    store.setBlockRecurrences(buildBlockRecurrences());

    const backup = store.exportBackup("2026-05-05T10:00:00-05:00");

    expect(backup).toEqual(
      createDayFrameBackup(
        {
          schedulingPreferences: {
            dayBoundaryStartTime: "04:00",
            weekStartsOn: "monday",
          },
          previewRange: {
            preset: "threeDays",
            startDate: "2026-05-04",
            endDate: "2026-05-06",
          },
          manualEvents: [],
          shiftDefinitions: buildShiftDefinitions(),
          shiftCycles: [buildShiftCycle()],
          blockTemplates: buildBlockTemplates(),
          blockRecurrences: buildBlockRecurrences(),
        },
        "2026-05-05T10:00:00-05:00",
      ),
    );
  });

  it("imports authored setup data and clears any current preview", () => {
    const localStorage = createLocalStorageMock();

    installLocalStorageMock(localStorage);

    const store = createDayFrameStore();
    store.saveProfile({
      name: "Week A",
      savedAt: "2026-05-05T09:00:00-05:00",
    });

    store.setShiftDefinitions(buildShiftDefinitions());
    store.setShiftCycle(buildShiftCycle());
    store.setBlockTemplates(buildBlockTemplates());
    store.setBlockRecurrences(buildBlockRecurrences());
    store.generatePreview({
      rangeStartDate: "2026-05-04",
      rangeEndDate: "2026-05-05",
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      generatedAt: "2026-05-03T13:00:00-05:00",
    });

    const state = store.importBackup(
      createDayFrameBackup(
        {
          schedulingPreferences: {
            dayBoundaryStartTime: "04:00",
            weekStartsOn: "monday",
          },
          previewRange: {
            preset: "custom",
            startDate: "2026-05-07",
            endDate: "2026-05-09",
          },
          manualEvents: [],
          shiftDefinitions: buildShiftDefinitions(),
          shiftCycles: [buildShiftCycle()],
          blockTemplates: [],
          blockRecurrences: [],
        },
        "2026-05-05T10:00:00-05:00",
      ),
    );

    expect(state.preview).toBeNull();
    expect(state.schedulingPreferences).toEqual({
      dayBoundaryStartTime: "04:00",
      weekStartsOn: "monday",
    });
    expect(state.previewRange).toEqual({
      preset: "custom",
      startDate: "2026-05-07",
      endDate: "2026-05-09",
    });
    expect(state.savedProfiles).toHaveLength(1);
    expect(state.savedProfiles[0]?.name).toBe("Week A");
    expect(JSON.parse(localStorage.getItem(DAYFRAME_STORAGE_KEY) ?? "{}")).toEqual({
      schedulingPreferences: {
        dayBoundaryStartTime: "04:00",
        weekStartsOn: "monday",
      },
      previewRange: {
        preset: "custom",
        startDate: "2026-05-07",
        endDate: "2026-05-09",
      },
      shiftDefinitions: buildShiftDefinitions(),
      shiftCycles: [buildShiftCycle()],
      shiftCycle: buildShiftCycle(),
      blockTemplates: [],
      blockRecurrences: [],
      manualEvents: [],
    });
  });

  it("saves, loads, and deletes local setup profiles", () => {
    const localStorage = createLocalStorageMock();

    installLocalStorageMock(localStorage);

    const store = createDayFrameStore();

    store.setSchedulingPreferences({
      dayBoundaryStartTime: "04:00",
      weekStartsOn: "monday",
    });
    store.setShiftDefinitions(buildShiftDefinitions());
    store.setShiftCycle(buildShiftCycle());
    store.setBlockTemplates(buildBlockTemplates());
    store.setBlockRecurrences(buildBlockRecurrences());
    store.saveProfile({
      name: "Week A",
      savedAt: "2026-05-05T09:00:00-05:00",
    });

    expect(store.getState().savedProfiles).toHaveLength(1);
    expect(store.getState().savedProfiles[0]?.name).toBe("Week A");

    store.setSchedulingPreferences({
      dayBoundaryStartTime: "05:00",
    });
    store.loadProfile(store.getState().savedProfiles[0]!.id);

    expect(store.getState().schedulingPreferences).toEqual({
      dayBoundaryStartTime: "04:00",
      weekStartsOn: "monday",
    });
    expect(store.getState().blockTemplates).toEqual(buildBlockTemplates());
    expect(store.getState().blockRecurrences).toEqual(buildBlockRecurrences());
    expect(store.getState().preview).toBeNull();

    store.deleteProfile(store.getState().savedProfiles[0]!.id);

    expect(store.getState().savedProfiles).toEqual([]);
    expect(JSON.parse(localStorage.getItem(DAYFRAME_PROFILES_STORAGE_KEY) ?? "{}")).toEqual({
      app: "DayFrame",
      version: 1,
      profiles: [],
    });
  });

  it("applies a selected suggested fix to the current preview", () => {
    const localStorage = createLocalStorageMock();

    installLocalStorageMock(localStorage);

    const store = createDayFrameStore();
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
      mode: "manualSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      sequenceAnchorDate: "2026-05-01",
      sequence: [],
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
        preferredWindow: "custom",
        customWindowStartTime: "14:15",
        customWindowEndTime: "15:15",
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
        placementType: "fixed",
        durationMinutes: 60,
        priority: 3,
        preferredWindow: "afterWaking",
        fixedStartTime: "14:30",
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

    store.setShiftDefinitions(shiftDefinitions);
    store.setShiftCycle(shiftCycle);
    store.setBlockTemplates(blockTemplates);
    store.setBlockRecurrences(blockRecurrences);
    store.generatePreview({
      rangeStartDate: "2026-05-04",
      rangeEndDate: "2026-05-05",
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      generatedAt: "2026-05-03T13:00:00-05:00",
    });

    const previewBeforeFix = store.getState().preview;

    expect(previewBeforeFix?.result.frictionPoints).toHaveLength(1);

    const frictionPoint = previewBeforeFix?.result.frictionPoints[0];

    expect(frictionPoint).toBeDefined();

    const moveFix = frictionPoint?.suggestedFixes.find(
      (suggestedFix) => suggestedFix.action === "moveBlock",
    );

    expect(moveFix).toBeDefined();

    const state = store.applySuggestedFixToPreview({
      selectedFrictionPointId: frictionPoint!.id,
      selectedSuggestedFixId: moveFix!.id,
      revisedAt: "2026-05-03T14:00:00-05:00",
    });

    expect(state.preview?.revisedAt).toBe("2026-05-03T14:00:00-05:00");
    expect(state.preview?.isStale).toBe(false);
    expect(state.preview?.result.scheduledBlocks).toHaveLength(2);
    expect(state.preview?.result.frictionPoints).toEqual([]);
    expect(JSON.parse(localStorage.getItem(DAYFRAME_STORAGE_KEY) ?? "{}")).toEqual({
      schedulingPreferences: {
        dayBoundaryStartTime: "03:00",
        weekStartsOn: "saturday",
      },
      previewRange: {
        preset: "threeDays",
        startDate: "2026-05-04",
        endDate: "2026-05-06",
      },
      shiftDefinitions,
      shiftCycles: [shiftCycle],
      shiftCycle,
      blockTemplates: blockTemplates.map((blockTemplate) => ({
        ...blockTemplate,
        requiresWorkAnchor: blockTemplate.requiresWorkAnchor ?? false,
      })),
      blockRecurrences,
      manualEvents: [],
    });
  });

  it("stores review guidance without marking the preview revised for Review fixed time", () => {
    const store = createDayFrameStore({
      preview: {
        result: {
          generatedWorkBlocks: [
            {
              id: "work_shift_day_2026-05-05",
              shiftDefinitionId: "shift_day",
              shiftCycleId: "cycle_001",
              shiftSegmentId: "segment_day",
              userId: "user_001",
              title: "Day Shift",
              startsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
              endsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
              startDate: "2026-05-05",
              endDate: "2026-05-05",
              userDayDate: "2026-05-05",
              crossesMidnight: false,
            },
          ],
          blockCandidates: [],
          scheduledBlocks: [
            {
              id: "scheduled_workout",
              userId: "user_001",
              templateId: "template_workout",
              source: "template",
              title: "Workout",
              category: "fitness",
              anchorType: "fixedTemplate",
              placementType: "fixed",
              fixedStartTime: "06:00",
              startsAt: new Date(2026, 4, 5, 6, 0, 0, 0),
              endsAt: new Date(2026, 4, 5, 7, 0, 0, 0),
              userDayDate: "2026-05-05",
              userWeekStartDate: "2026-05-02",
              priority: 2,
              status: "planned",
              externalResources: [],
            },
          ],
          unplacedCandidates: [],
          frictionPoints: [
            {
              id: "friction_conflict_work_fixed",
              userId: "user_001",
              severity: "warning",
              title: "Day Shift conflicts with Workout",
              message: "Needs review.",
              affectedBlockIds: ["work_shift_day_2026-05-05", "scheduled_workout"],
              suggestedFixes: [
                {
                  id: "fix_change_fixed_time_scheduled_workout",
                  label: "Review fixed time",
                  action: "changeFixedTime",
                },
                {
                  id: "fix_accept_work_shift_day_2026-05-05_scheduled_workout",
                  label: "Accept conflict",
                  action: "acceptConflict",
                },
              ],
              canIgnore: true,
              ignored: false,
              resolved: false,
              createdAt: "2026-05-03T13:00:00-05:00",
              updatedAt: "2026-05-03T13:00:00-05:00",
            },
          ],
        },
        rangeStartDate: "2026-05-04",
        rangeEndDate: "2026-05-05",
        planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
        planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
        generatedAt: "2026-05-03T13:00:00-05:00",
        isStale: false,
      },
    });

    const state = store.applySuggestedFixToPreview({
      selectedFrictionPointId: "friction_conflict_work_fixed",
      selectedSuggestedFixId: "fix_change_fixed_time_scheduled_workout",
      revisedAt: "2026-05-03T14:00:00-05:00",
    });

    expect(state.preview?.revisedAt).toBeUndefined();
    expect(state.preview?.result.frictionPoints[0]?.suggestedFixes[0]).toMatchObject({
      label: "Review fixed time",
      action: "changeFixedTime",
    });
    expect(state.preview?.actionFeedback).toEqual({
      message: "Edit this block's fixed start time in Setup, then generate a new preview.",
      tone: "info",
    });
  });

  it("notifies subscribers when state changes", () => {
    const store = createDayFrameStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
    unsubscribe();
    store.setSchedulingPreferences({ weekStartsOn: "monday" });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0]?.[0].schedulingPreferences.dayBoundaryStartTime).toBe("04:00");
  });

  it("clears persisted local setup data and resets the authored state", () => {
    const localStorage = createLocalStorageMock();

    installLocalStorageMock(localStorage);

    const store = createDayFrameStore({
      schedulingPreferences: {
        dayBoundaryStartTime: "04:00",
        weekStartsOn: "monday",
      },
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
    });

    store.setBlockTemplates([
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
    ]);

    store.clearLocalData();

    expect(store.getState()).toEqual(createInitialDayFrameState());
    expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(DAYFRAME_PROFILES_STORAGE_KEY)).toBeNull();
  });
});

function buildShiftDefinitions(): ShiftDefinition[] {
  return [
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
}

function buildShiftCycle(): ShiftCycle {
  return {
    id: "cycle_001",
    userId: "user_001",
    name: "Day Rotation",
    type: "fixedSegments",
    mode: "manualSegments",
    startsOnDate: "2026-05-01",
    endsOnDate: "2026-05-31",
    sequenceAnchorDate: "2026-05-01",
    sequence: [],
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
}

function buildBlockTemplates(): BlockTemplate[] {
  return [
    {
      id: "template_review",
      userId: "user_001",
      title: "Schedule Review",
      category: "review",
      requiresWorkAnchor: false,
      placementType: "flexible",
      durationMinutes: 60,
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 15,
      priority: 2,
      preferredWindow: "beforeWork",
      rescheduleBehavior: "autoSameUserWeek",
      requiresResource: false,
      externalResources: [],
      enabled: true,
      ...baseTimestamps,
    },
  ];
}

function buildBlockRecurrences(): BlockRecurrence[] {
  return [
    {
      id: "rec_review",
      blockTemplateId: "template_review",
      frequency: "specificWeekdays",
      weekdays: ["monday"],
    },
  ];
}

function createLocalStorageMock(): {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
} {
  const storage = new Map<string, string>();

  return {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => {
      storage.set(key, value);
    },
    removeItem: (key) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
  };
}

function installLocalStorageMock(localStorage: {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}): void {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: localStorage,
    writable: true,
  });
}
