import { afterEach, describe, expect, it, vi } from "vitest";

import { createDayFrameBackup, parseDayFrameBackupJson } from "../dayFrameBackup.js";
import { createInitialDayFrameState } from "../createInitialDayFrameState.js";
import {
  clearPersistedProfiles,
  clearPersistedState,
  createDayFrameStore,
  DAYFRAME_PROFILES_STORAGE_KEY,
  DAYFRAME_STORAGE_KEY,
  persistProfiles,
  persistState,
} from "../dayFrameStore.js";
import type { DayFrameSavedProfile, DayFrameState } from "../types.js";
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
  it("loads singular-only legacy cycle state and rewrites it using plural cycles only", () => {
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

    const store = createDayFrameStore();
    const state = store.getState();

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

    store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

    const rewrittenState = JSON.parse(localStorage.getItem(DAYFRAME_STORAGE_KEY) ?? "{}");

    expect(rewrittenState.shiftCycles).toEqual(state.shiftCycles);
    expect(rewrittenState).not.toHaveProperty("shiftCycle");
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
    store.setShiftCycles([shiftCycle]);
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
      blockTemplates: [],
      blockRecurrences: [],
      manualEvents: [],
    });
  });

  it("commits the complete authored setup as one cloned, persisted, observable transition", () => {
    const localStorage = createLocalStorageMock();
    const setItem = vi.spyOn(localStorage, "setItem");

    installLocalStorageMock(localStorage);

    const existingManualEvents = [
      {
        id: "manual_existing",
        title: "Existing appointment",
        userDayDate: "2026-05-04" as const,
        allDay: true,
        createdAt: baseTimestamps.createdAt,
        updatedAt: baseTimestamps.updatedAt,
      },
    ];
    const shiftDefinitions = buildShiftDefinitions();
    const shiftCycles = [buildShiftCycle()];
    const blockTemplates = buildBlockTemplates();
    const blockRecurrences = buildBlockRecurrences();
    const store = createDayFrameStore({
      shiftDefinitions,
      shiftCycles,
      blockTemplates,
      blockRecurrences,
      manualEvents: existingManualEvents,
    });
    const listener = vi.fn();

    store.generatePreview({
      rangeStartDate: "2026-05-04",
      rangeEndDate: "2026-05-04",
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 4, 23, 59, 59, 999),
      generatedAt: "2026-05-03T13:00:00-05:00",
    });
    setItem.mockClear();
    store.subscribe(listener);

    const result = store.commitAuthoredSetup({
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
      shiftCycles,
      blockTemplates,
      blockRecurrences,
    });
    const { state } = result;

    shiftDefinitions[0]!.name = "Mutated after commit";
    shiftCycles[0]!.name = "Mutated after commit";
    blockTemplates[0]!.title = "Mutated after commit";
    blockRecurrences[0]!.frequency = "daily";

    expect(state).toMatchObject({
      schedulingPreferences: {
        dayBoundaryStartTime: "04:00",
        weekStartsOn: "monday",
      },
      previewRange: {
        preset: "oneWeek",
        startDate: "2026-05-04",
        endDate: "2026-05-11",
      },
      shiftDefinitions: [{ name: "Day Shift" }],
      shiftCycles: [{ name: "Day Rotation" }],
      blockTemplates: [{ title: "Schedule Review" }],
      blockRecurrences: [{ frequency: "specificWeekdays" }],
      manualEvents: existingManualEvents,
      preview: { isStale: true },
    });
    expect(store.getState()).toEqual(state);
    expect(result.persistence).toEqual({ status: "persisted" });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(state);
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(setItem).toHaveBeenCalledWith(
      DAYFRAME_STORAGE_KEY,
      JSON.stringify({
        schedulingPreferences: state.schedulingPreferences,
        previewRange: state.previewRange,
        shiftDefinitions: state.shiftDefinitions,
        shiftCycles: state.shiftCycles,
        blockTemplates: state.blockTemplates,
        blockRecurrences: state.blockRecurrences,
        manualEvents: state.manualEvents,
      }),
    );
  });

  it("commits authored setup without creating a preview", () => {
    const store = createDayFrameStore();

    const { state } = store.commitAuthoredSetup({
      schedulingPreferences: {
        dayBoundaryStartTime: "04:00",
        weekStartsOn: "monday",
      },
      previewRange: {
        preset: "oneWeek",
        startDate: "2026-05-04",
        endDate: "2026-05-11",
      },
      shiftDefinitions: buildShiftDefinitions(),
      shiftCycles: [buildShiftCycle()],
      blockTemplates: buildBlockTemplates(),
      blockRecurrences: buildBlockRecurrences(),
    });

    expect(state.preview).toBeNull();
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
    store.setShiftCycles([shiftCycle]);
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
    const persistedState = JSON.parse(localStorage.getItem(DAYFRAME_STORAGE_KEY) ?? "{}");

    expect(persistedState).toMatchObject({
      shiftCycles: [shiftCycle],
    });
    expect(persistedState).not.toHaveProperty("shiftCycle");
  });

  it("marks the current preview as stale when authored setup changes", () => {
    const store = createDayFrameStore();

    store.setShiftDefinitions(buildShiftDefinitions());
    store.setShiftCycles([buildShiftCycle()]);
    store.setBlockTemplates(buildBlockTemplates());
    store.setBlockRecurrences(buildBlockRecurrences());
    store.generatePreview({
      rangeStartDate: "2026-05-04",
      rangeEndDate: "2026-05-05",
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      generatedAt: "2026-05-03T13:00:00-05:00",
    });

    const { state } = store.setSchedulingPreferences({
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
    store.setShiftCycles([buildShiftCycle()]);
    store.setBlockTemplates(buildBlockTemplates());
    store.setBlockRecurrences(buildBlockRecurrences());

    const backup = store.exportBackup("2026-05-05T10:00:00-05:00");

    expect(backup.data.shiftCycles).toEqual([buildShiftCycle()]);
    expect(backup.data).not.toHaveProperty("shiftCycle");
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

  it("imports a literal singular-only V1 backup into plural runtime authority", () => {
    const localStorage = createLocalStorageMock();
    const legacyData = buildLegacySingularAuthoredSetup();

    expect(legacyData).not.toHaveProperty("shiftCycles");
    installLocalStorageMock(localStorage);

    const backup = parseDayFrameBackupJson(
      JSON.stringify({
        app: "DayFrame",
        version: 1,
        exportedAt: "2026-05-05T10:00:00-05:00",
        data: legacyData,
      }),
    );
    const { state } = createDayFrameStore().importBackup(backup);

    expect(state.shiftCycles).toEqual([buildNormalizedLegacyShiftCycle()]);
    expect(JSON.parse(localStorage.getItem(DAYFRAME_STORAGE_KEY) ?? "{}")).toMatchObject({
      shiftCycles: [buildNormalizedLegacyShiftCycle()],
    });
    expect(JSON.parse(localStorage.getItem(DAYFRAME_STORAGE_KEY) ?? "{}")).not.toHaveProperty(
      "shiftCycle",
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
    store.setShiftCycles([buildShiftCycle()]);
    store.setBlockTemplates(buildBlockTemplates());
    store.setBlockRecurrences(buildBlockRecurrences());
    store.generatePreview({
      rangeStartDate: "2026-05-04",
      rangeEndDate: "2026-05-05",
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      generatedAt: "2026-05-03T13:00:00-05:00",
    });

    const { state } = store.importBackup(
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
    store.setShiftCycles([buildShiftCycle()]);
    store.setBlockTemplates(buildBlockTemplates());
    store.setBlockRecurrences(buildBlockRecurrences());
    store.saveProfile({
      name: "Week A",
      savedAt: "2026-05-05T09:00:00-05:00",
    });

    expect(store.getState().savedProfiles).toHaveLength(1);
    expect(store.getState().savedProfiles[0]?.name).toBe("Week A");
    expect(store.getState().savedProfiles[0]?.data.shiftCycles).toEqual([buildShiftCycle()]);
    expect(store.getState().savedProfiles[0]?.data).not.toHaveProperty("shiftCycle");
    const persistedProfileData = JSON.parse(
      localStorage.getItem(DAYFRAME_PROFILES_STORAGE_KEY) ?? "{}",
    ).profiles?.[0]?.data;

    expect(persistedProfileData.shiftCycles).toEqual([buildShiftCycle()]);
    expect(persistedProfileData).not.toHaveProperty("shiftCycle");

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

  it("loads a literal singular-only legacy profile into plural runtime authority", () => {
    const localStorage = createLocalStorageMock();
    const legacyData = buildLegacySingularAuthoredSetup();

    expect(legacyData).not.toHaveProperty("shiftCycles");
    localStorage.setItem(
      DAYFRAME_PROFILES_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        version: 1,
        profiles: [
          {
            id: "profile_legacy",
            name: "Legacy Rotation",
            savedAt: "2026-05-05T09:00:00-05:00",
            data: legacyData,
          },
        ],
      }),
    );
    installLocalStorageMock(localStorage);

    const store = createDayFrameStore();
    const { state } = store.loadProfile("profile_legacy");

    expect(state.shiftCycles).toEqual([buildNormalizedLegacyShiftCycle()]);
    expect(state.preview).toBeNull();
    expect(JSON.parse(localStorage.getItem(DAYFRAME_STORAGE_KEY) ?? "{}")).toMatchObject({
      shiftCycles: [buildNormalizedLegacyShiftCycle()],
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
    store.setShiftCycles([shiftCycle]);
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

    const result = store.clearLocalData();

    expect(store.getState()).toEqual(createInitialDayFrameState());
    expect(result).toEqual({
      state: createInitialDayFrameState(),
      activeState: { status: "removed" },
      profiles: { status: "removed" },
      durability: "cleared",
    });
    expect(store.getDurabilityStatus()).toEqual({
      activeState: "durable",
      profiles: "durable",
    });
    expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(DAYFRAME_PROFILES_STORAGE_KEY)).toBeNull();
  });

  describe("persistence helper outcomes", () => {
    it("reports successful active-state and profile persistence", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      expect(persistState(createInitialDayFrameState())).toEqual({ status: "persisted" });
      expect(persistProfiles([buildSavedProfile()])).toEqual({ status: "persisted" });
      expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).not.toBeNull();
      expect(localStorage.getItem(DAYFRAME_PROFILES_STORAGE_KEY)).not.toBeNull();
    });

    it("reports unavailable storage for active-state and profile persistence", () => {
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: null,
      });

      expect(persistState(createInitialDayFrameState())).toEqual({ status: "unavailable" });
      expect(persistProfiles([buildSavedProfile()])).toEqual({ status: "unavailable" });
    });

    it("reports active-state and profile storage-operation failures", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected storage failure");
      });
      installLocalStorageMock(localStorage);

      expect(persistState(createInitialDayFrameState())).toEqual({ status: "storageFailure" });
      expect(persistProfiles([buildSavedProfile()])).toEqual({ status: "storageFailure" });
    });

    it("normalizes storage-accessor failures for writes and removals", () => {
      installThrowingLocalStorageAccessor();

      expect(persistState(createInitialDayFrameState())).toEqual({ status: "storageFailure" });
      expect(persistProfiles([buildSavedProfile()])).toEqual({ status: "storageFailure" });
      expect(clearPersistedState()).toEqual({ status: "storageFailure" });
      expect(clearPersistedProfiles()).toEqual({ status: "storageFailure" });
    });

    it("distinguishes active-state and profile serialization failures", () => {
      const localStorage = createLocalStorageMock();
      const invalidState = buildSerializationFailureState();

      installLocalStorageMock(localStorage);

      expect(persistState(invalidState)).toEqual({ status: "serializationFailure" });
      expect(persistProfiles([buildSavedProfile(invalidState)])).toEqual({
        status: "serializationFailure",
      });
      expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(DAYFRAME_PROFILES_STORAGE_KEY)).toBeNull();
    });

    it("reports successful active-state and profile removal independently", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem(DAYFRAME_STORAGE_KEY, "active");
      localStorage.setItem(DAYFRAME_PROFILES_STORAGE_KEY, "profiles");
      installLocalStorageMock(localStorage);

      expect(clearPersistedState()).toEqual({ status: "removed" });
      expect(clearPersistedProfiles()).toEqual({ status: "removed" });
      expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(DAYFRAME_PROFILES_STORAGE_KEY)).toBeNull();
    });

    it("reports unavailable storage for each removal", () => {
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: undefined,
      });

      expect(clearPersistedState()).toEqual({ status: "unavailable" });
      expect(clearPersistedProfiles()).toEqual({ status: "unavailable" });
    });

    it("reports active-state and profile removal failures independently", () => {
      const localStorage = createLocalStorageMock();

      localStorage.removeItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_STORAGE_KEY) {
          throw new RangeError("Injected profile removal failure");
        }
      });
      installLocalStorageMock(localStorage);

      expect(clearPersistedState()).toEqual({ status: "removed" });
      expect(clearPersistedProfiles()).toEqual({ status: "storageFailure" });
    });

    it("preserves runtime mutation and subscriber notification after a write failure", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected storage failure");
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const listener = vi.fn();

      store.subscribe(listener);

      const result = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      const { state } = result;

      expect(state.schedulingPreferences.dayBoundaryStartTime).toBe("04:00");
      expect(result.persistence).toEqual({ status: "storageFailure" });
      expect(store.getState()).toEqual(state);
      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith(state);
    });
  });

  describe("store mutation persistence results", () => {
    it("returns unavailable with the applied active mutation and one notification", () => {
      const store = createDayFrameStore();
      const listener = vi.fn();

      store.subscribe(listener);

      const result = store.setPreviewRange({
        preset: "oneWeek",
        startDate: "2026-05-04",
        endDate: "2026-05-11",
      });

      expect(result.persistence).toEqual({ status: "unavailable" });
      expect(result.state.previewRange.preset).toBe("oneWeek");
      expect(store.getState()).toEqual(result.state);
      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith(result.state);
    });

    it("preserves serialization failure through an authored mutation result", () => {
      const localStorage = createLocalStorageMock();
      const store = createDayFrameStore(buildSerializationFailureState());

      installLocalStorageMock(localStorage);

      const result = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      expect(result.persistence).toEqual({ status: "serializationFailure" });
      expect(result.state.schedulingPreferences.dayBoundaryStartTime).toBe("04:00");
    });

    it("returns profile persistence outcomes for save and delete", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_STORAGE_KEY) {
          throw new RangeError("Injected profile storage failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const saveResult = store.saveProfile({
        name: "Runtime Profile",
        savedAt: "2026-05-05T09:00:00-05:00",
      });

      expect(saveResult.persistence).toEqual({ status: "storageFailure" });
      expect(saveResult.state.savedProfiles).toHaveLength(1);

      const deleteResult = store.deleteProfile(saveResult.state.savedProfiles[0]!.id);

      expect(deleteResult.persistence).toEqual({ status: "storageFailure" });
      expect(deleteResult.state.savedProfiles).toEqual([]);
    });

    it("reports active-state persistence when loading a profile", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const saveResult = store.saveProfile({
        name: "Load Source",
        savedAt: "2026-05-05T09:00:00-05:00",
      });
      const setItem = vi.spyOn(localStorage, "setItem").mockImplementation((key: string) => {
        if (key === DAYFRAME_STORAGE_KEY) {
          throw new RangeError("Injected active storage failure");
        }
      });

      const loadResult = store.loadProfile(saveResult.state.savedProfiles[0]!.id);

      expect(loadResult.persistence).toEqual({ status: "storageFailure" });
      expect(loadResult.state.savedProfiles).toHaveLength(1);
      expect(setItem).toHaveBeenLastCalledWith(DAYFRAME_STORAGE_KEY, expect.any(String));
    });

    it("reports active-state persistence after a valid backup import", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected active storage failure");
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const result = store.importBackup(
        createDayFrameBackup(buildSavedProfile().data, "2026-05-05T10:00:00-05:00"),
      );

      expect(result.persistence).toEqual({ status: "storageFailure" });
      expect(result.state.preview).toBeNull();
    });

    it.each([
      {
        activeFailure: false,
        profileFailure: true,
        durability: "partiallyCleared",
        activeStatus: "removed",
        profileStatus: "storageFailure",
      },
      {
        activeFailure: true,
        profileFailure: false,
        durability: "partiallyCleared",
        activeStatus: "storageFailure",
        profileStatus: "removed",
      },
      {
        activeFailure: true,
        profileFailure: true,
        durability: "notCleared",
        activeStatus: "storageFailure",
        profileStatus: "storageFailure",
      },
    ] as const)(
      "aggregates clear outcomes as $durability",
      ({ activeFailure, profileFailure, durability, activeStatus, profileStatus }) => {
        const localStorage = createLocalStorageMock();

        localStorage.removeItem = vi.fn((key: string) => {
          if (
            (key === DAYFRAME_STORAGE_KEY && activeFailure) ||
            (key === DAYFRAME_PROFILES_STORAGE_KEY && profileFailure)
          ) {
            throw new RangeError("Injected removal failure");
          }
        });
        installLocalStorageMock(localStorage);

        const result = createDayFrameStore().clearLocalData();

        expect(result.state).toEqual(createInitialDayFrameState());
        expect(result.activeState.status).toBe(activeStatus);
        expect(result.profiles.status).toBe(profileStatus);
        expect(result.durability).toBe(durability);
      },
    );

    it("reports notCleared when storage is unavailable for both removals", () => {
      const result = createDayFrameStore().clearLocalData();

      expect(result.activeState).toEqual({ status: "unavailable" });
      expect(result.profiles).toEqual({ status: "unavailable" });
      expect(result.durability).toBe("notCleared");
    });
  });

  describe("normalized storage-accessor failures", () => {
    it("continues a representative active mutation and notifies once", () => {
      const store = createDayFrameStore();
      const listener = vi.fn();

      store.subscribe(listener);
      installThrowingLocalStorageAccessor();

      const result = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      expect(result.state.schedulingPreferences.dayBoundaryStartTime).toBe("04:00");
      expect(result.persistence).toEqual({ status: "storageFailure" });
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "storageFailure",
        profiles: "unknown",
      });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "snapshot",
      });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("preserves setup commit and manual-event mutation semantics", () => {
      const setupStore = createDayFrameStore();
      const setupListener = vi.fn();

      setupStore.subscribe(setupListener);
      installThrowingLocalStorageAccessor();

      const setupResult = setupStore.commitAuthoredSetup({
        schedulingPreferences: {
          dayBoundaryStartTime: "04:00",
          weekStartsOn: "monday",
        },
        previewRange: {
          preset: "oneWeek",
          startDate: "2026-05-04",
          endDate: "2026-05-11",
        },
        shiftDefinitions: buildShiftDefinitions(),
        shiftCycles: [],
        blockTemplates: buildBlockTemplates(),
        blockRecurrences: buildBlockRecurrences(),
      });

      expect(setupResult.persistence).toEqual({ status: "storageFailure" });
      expect(setupResult.state.schedulingPreferences.weekStartsOn).toBe("monday");
      expect(setupResult.state.shiftDefinitions).toEqual(buildShiftDefinitions());
      expect(setupStore.getDurabilityStatus().activeState).toBe("storageFailure");
      expect(setupStore.getDesiredDurableCondition().activeState).toBe("snapshot");
      expect(setupListener).toHaveBeenCalledTimes(1);

      delete (globalThis as { localStorage?: unknown }).localStorage;
      const manualStore = createDayFrameStore();
      const manualListener = vi.fn();

      manualStore.subscribe(manualListener);
      installThrowingLocalStorageAccessor();

      const manualResult = manualStore.setManualEvents([]);

      expect(manualResult.persistence).toEqual({ status: "storageFailure" });
      expect(manualResult.state.manualEvents).toEqual([]);
      expect(manualStore.getDurabilityStatus().activeState).toBe("storageFailure");
      expect(manualListener).toHaveBeenCalledTimes(1);
    });

    it("continues profile save and delete while preserving active infrastructure state", () => {
      const store = createDayFrameStore();
      const listener = vi.fn();

      store.subscribe(listener);
      installThrowingLocalStorageAccessor();

      const saved = store.saveProfile({
        name: "Profile A",
        savedAt: "2026-05-05T09:00:00-05:00",
      });

      expect(saved.persistence).toEqual({ status: "storageFailure" });
      expect(saved.state.savedProfiles).toHaveLength(1);
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "unknown",
        profiles: "storageFailure",
      });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "snapshot",
      });

      const deleted = store.deleteProfile(saved.state.savedProfiles[0]!.id);

      expect(deleted.persistence).toEqual({ status: "storageFailure" });
      expect(deleted.state.savedProfiles).toEqual([]);
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it("continues profile load and backup import through active storage failure", () => {
      const profile = buildSavedProfile();
      const store = createDayFrameStore({ savedProfiles: [profile] });
      const listener = vi.fn();

      store.subscribe(listener);
      installThrowingLocalStorageAccessor();

      const loaded = store.loadProfile(profile.id);

      expect(loaded.persistence).toEqual({ status: "storageFailure" });
      expect(loaded.state.savedProfiles).toEqual([profile]);
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "storageFailure",
        profiles: "unknown",
      });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "snapshot",
      });

      const imported = store.importBackup(
        createDayFrameBackup(profile.data, "2026-05-05T10:00:00-05:00"),
      );

      expect(imported.persistence).toEqual({ status: "storageFailure" });
      expect(imported.state.schedulingPreferences).toEqual(profile.data.schedulingPreferences);
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it.each([
      ["active", "storageFailure", "removed", "partiallyCleared"],
      ["profiles", "removed", "storageFailure", "partiallyCleared"],
      ["both", "storageFailure", "storageFailure", "notCleared"],
    ] as const)(
      "completes clear when %s storage access fails",
      (failureSurface, activeStatus, profileStatus, aggregate) => {
        const localStorage = createLocalStorageMock();
        const store = createDayFrameStore({ savedProfiles: [buildSavedProfile()] });
        const listener = vi.fn();
        let accessCount = 0;

        store.subscribe(listener);
        Object.defineProperty(globalThis, "localStorage", {
          configurable: true,
          get() {
            accessCount += 1;
            const shouldThrow =
              failureSurface === "both" ||
              (failureSurface === "active" && accessCount === 1) ||
              (failureSurface === "profiles" && accessCount === 2);

            if (shouldThrow) {
              throw new RangeError("Injected storage accessor failure");
            }

            return localStorage;
          },
        });

        const result = store.clearLocalData();

        expect(result).toEqual({
          state: createInitialDayFrameState(),
          activeState: { status: activeStatus },
          profiles: { status: profileStatus },
          durability: aggregate,
        });
        expect(accessCount).toBe(2);
        expect(store.getDesiredDurableCondition()).toEqual({
          activeState: "absent",
          profiles: "absent",
        });
        expect(store.getDurabilityStatus()).toEqual({
          activeState: activeStatus === "removed" ? "durable" : "storageFailure",
          profiles: profileStatus === "removed" ? "durable" : "storageFailure",
        });
        expect(listener).toHaveBeenCalledTimes(1);
      },
    );

    it("leaves read-path accessor failure exceptional", () => {
      installThrowingLocalStorageAccessor();

      expect(() => createDayFrameStore()).toThrow("Injected storage accessor failure");
    });
  });

  describe("store-owned durability retry", () => {
    it("retries the latest active snapshot successfully without mutation or notification", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected active write failure");
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      store.setPreviewRange({
        preset: "oneWeek",
        startDate: "2026-05-04",
        endDate: "2026-05-11",
      });

      const stateBeforeRetry = store.getState();
      const profileInfrastructureBefore = {
        status: store.getDurabilityStatus().profiles,
        desired: store.getDesiredDurableCondition().profiles,
      };
      const listener = vi.fn();
      const successfulSet = vi.fn((key: string, value: string) => {
        if (key === DAYFRAME_STORAGE_KEY) {
          const parsed = JSON.parse(value) as { previewRange: { preset: string } };
          expect(parsed.previewRange.preset).toBe("oneWeek");
          expect(parsed).toMatchObject({
            schedulingPreferences: { dayBoundaryStartTime: "04:00" },
          });
        }
      });

      localStorage.setItem = successfulSet;
      store.subscribe(listener);

      const result = store.retryActivePersistence();

      expect(result).toEqual({
        status: "attempted",
        desiredCondition: "snapshot",
        persistence: { status: "persisted" },
      });
      expect(successfulSet).toHaveBeenCalledTimes(1);
      expect(store.getState()).toEqual(stateBeforeRetry);
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "durable",
        profiles: profileInfrastructureBefore.status,
      });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: profileInfrastructureBefore.desired,
      });
      expect(listener).not.toHaveBeenCalled();
    });

    it("retains active failure and lets the latest outcome change its category", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected active write failure");
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      const failedRetry = store.retryActivePersistence();

      expect(failedRetry).toEqual({
        status: "attempted",
        desiredCondition: "snapshot",
        persistence: { status: "storageFailure" },
      });
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(store.getDurabilityStatus().activeState).toBe("storageFailure");

      delete (globalThis as { localStorage?: unknown }).localStorage;

      expect(store.retryActivePersistence()).toEqual({
        status: "attempted",
        desiredCondition: "snapshot",
        persistence: { status: "unavailable" },
      });
      expect(store.getDurabilityStatus().activeState).toBe("unavailable");
    });

    it("retries unavailable active persistence when storage becomes available", () => {
      const store = createDayFrameStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      expect(store.getDurabilityStatus().activeState).toBe("unavailable");

      const localStorage = createLocalStorageMock();
      const setItem = vi.fn(localStorage.setItem);

      localStorage.setItem = setItem;
      installLocalStorageMock(localStorage);

      expect(store.retryActivePersistence()).toEqual({
        status: "attempted",
        desiredCondition: "snapshot",
        persistence: { status: "persisted" },
      });
      expect(setItem).toHaveBeenCalledTimes(1);
      expect(store.getDurabilityStatus().activeState).toBe("durable");
    });

    it("retries active absence with one removal and leaves profiles untouched", () => {
      const localStorage = createLocalStorageMock();

      localStorage.removeItem = vi.fn((key: string) => {
        if (key === DAYFRAME_STORAGE_KEY) {
          throw new RangeError("Injected active removal failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.clearLocalData();

      const profileStatusBefore = store.getDurabilityStatus().profiles;
      const listener = vi.fn();
      const removeItem = vi.fn();
      const setItem = vi.fn();

      localStorage.removeItem = removeItem;
      localStorage.setItem = setItem;
      store.subscribe(listener);

      expect(store.retryActivePersistence()).toEqual({
        status: "attempted",
        desiredCondition: "absent",
        persistence: { status: "removed" },
      });
      expect(removeItem).toHaveBeenCalledOnce();
      expect(removeItem).toHaveBeenCalledWith(DAYFRAME_STORAGE_KEY);
      expect(setItem).not.toHaveBeenCalled();
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "durable",
        profiles: profileStatusBefore,
      });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "absent",
        profiles: "absent",
      });
      expect(listener).not.toHaveBeenCalled();
    });

    it("retries the latest complete profile collection without touching active infrastructure", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_STORAGE_KEY) {
          throw new RangeError("Injected profile write failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.saveProfile({ name: "Profile A", savedAt: "2026-05-05T09:00:00-05:00" });
      store.saveProfile({ name: "Profile B", savedAt: "2026-05-05T09:05:00-05:00" });

      const activeInfrastructureBefore = {
        status: store.getDurabilityStatus().activeState,
        desired: store.getDesiredDurableCondition().activeState,
      };
      const listener = vi.fn();
      const setItem = vi.fn(localStorage.setItem);

      setItem.mockImplementation((key: string, value: string) => {
        if (key === DAYFRAME_PROFILES_STORAGE_KEY) {
          const parsed = JSON.parse(value) as { profiles: Array<{ name: string }> };
          expect(parsed.profiles.map((profile) => profile.name)).toEqual([
            "Profile A",
            "Profile B",
          ]);
        }
      });
      setItem.mockClear();
      localStorage.setItem = setItem;
      store.subscribe(listener);

      expect(store.retryProfilePersistence()).toEqual({
        status: "attempted",
        desiredCondition: "snapshot",
        persistence: { status: "persisted" },
      });
      expect(setItem).toHaveBeenCalledTimes(1);
      expect(store.getDurabilityStatus()).toEqual({
        activeState: activeInfrastructureBefore.status,
        profiles: "durable",
      });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: activeInfrastructureBefore.desired,
        profiles: "snapshot",
      });
      expect(listener).not.toHaveBeenCalled();
    });

    it("retries profile absence independently after partial clear", () => {
      const localStorage = createLocalStorageMock();

      localStorage.removeItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_STORAGE_KEY) {
          throw new RangeError("Injected profile removal failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.clearLocalData();

      const removeItem = vi.fn();
      const setItem = vi.fn();

      localStorage.removeItem = removeItem;
      localStorage.setItem = setItem;

      expect(store.retryProfilePersistence()).toEqual({
        status: "attempted",
        desiredCondition: "absent",
        persistence: { status: "removed" },
      });
      expect(removeItem).toHaveBeenCalledOnce();
      expect(removeItem).toHaveBeenCalledWith(DAYFRAME_PROFILES_STORAGE_KEY);
      expect(setItem).not.toHaveBeenCalled();
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "durable",
        profiles: "durable",
      });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "absent",
        profiles: "absent",
      });
    });

    it("does not attempt retry from unknown or durable", () => {
      const localStorage = createLocalStorageMock();
      const setItem = vi.fn(localStorage.setItem);
      const removeItem = vi.fn(localStorage.removeItem);

      localStorage.setItem = setItem;
      localStorage.removeItem = removeItem;
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const listener = vi.fn();

      store.subscribe(listener);

      expect(store.retryActivePersistence()).toEqual({
        status: "notAttempted",
        reason: "unknown",
      });
      expect(store.retryProfilePersistence()).toEqual({
        status: "notAttempted",
        reason: "unknown",
      });
      expect(setItem).not.toHaveBeenCalled();
      expect(removeItem).not.toHaveBeenCalled();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      store.saveProfile({ name: "Profile A", savedAt: "2026-05-05T09:00:00-05:00" });
      setItem.mockClear();
      listener.mockClear();

      expect(store.retryActivePersistence()).toEqual({
        status: "notAttempted",
        reason: "alreadyDurable",
      });
      expect(store.retryProfilePersistence()).toEqual({
        status: "notAttempted",
        reason: "alreadyDurable",
      });
      expect(setItem).not.toHaveBeenCalled();
      expect(removeItem).not.toHaveBeenCalled();
      expect(listener).not.toHaveBeenCalled();
    });

    it("blocks retry from serialization failure without a storage operation", () => {
      const localStorage = createLocalStorageMock();
      const setItem = vi.fn(localStorage.setItem);

      localStorage.setItem = setItem;
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore(buildSerializationFailureState());

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      expect(store.getDurabilityStatus().activeState).toBe("serializationFailure");
      setItem.mockClear();

      expect(store.retryActivePersistence()).toEqual({
        status: "notAttempted",
        reason: "serializationFailure",
      });
      expect(setItem).not.toHaveBeenCalled();
      expect(store.getDurabilityStatus().activeState).toBe("serializationFailure");
    });

    it("retains a serialization failure produced during eligible snapshot retry", () => {
      const store = createDayFrameStore(buildSerializationFailureState());

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      expect(store.getDurabilityStatus().activeState).toBe("unavailable");

      const localStorage = createLocalStorageMock();
      const setItem = vi.fn(localStorage.setItem);

      localStorage.setItem = setItem;
      installLocalStorageMock(localStorage);

      expect(store.retryActivePersistence()).toEqual({
        status: "attempted",
        desiredCondition: "snapshot",
        persistence: { status: "serializationFailure" },
      });
      expect(setItem).not.toHaveBeenCalled();
      expect(store.getDurabilityStatus().activeState).toBe("serializationFailure");
      expect(store.getDesiredDurableCondition().activeState).toBe("snapshot");
    });

    it("normalizes an accessor exception during eligible retry", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected active write failure");
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const listener = vi.fn();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      store.subscribe(listener);
      installThrowingLocalStorageAccessor();

      expect(store.retryActivePersistence()).toEqual({
        status: "attempted",
        desiredCondition: "snapshot",
        persistence: { status: "storageFailure" },
      });
      expect(store.getDurabilityStatus().activeState).toBe("storageFailure");
      expect(store.getDesiredDurableCondition().activeState).toBe("snapshot");
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("durability status subscription", () => {
    it("registers without an initial callback and emits a consistent future snapshot", () => {
      const store = createDayFrameStore();
      const stateListener = vi.fn();
      const observedDuringCallback: unknown[] = [];
      const durabilityListener = vi.fn((status) => {
        observedDuringCallback.push(store.getDurabilityStatus());
        expect(status).not.toHaveProperty("desiredDurableCondition");
      });

      store.subscribe(stateListener);
      store.subscribeDurability(durabilityListener);

      expect(durabilityListener).not.toHaveBeenCalled();
      store.getDurabilityStatus();
      expect(durabilityListener).not.toHaveBeenCalled();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      expect(durabilityListener).toHaveBeenCalledOnce();
      expect(durabilityListener).toHaveBeenCalledWith({
        activeState: "unavailable",
        profiles: "unknown",
      });
      expect(observedDuringCallback).toEqual([
        { activeState: "unavailable", profiles: "unknown" },
      ]);
      expect(stateListener).toHaveBeenCalledOnce();
    });

    it("does not emit for a repeated active failure while state still notifies", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected active storage failure");
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      const durabilityListener = vi.fn();
      const stateListener = vi.fn();

      store.subscribeDurability(durabilityListener);
      store.subscribe(stateListener);
      store.setPreviewRange({
        preset: "oneWeek",
        startDate: "2026-05-04",
        endDate: "2026-05-11",
      });

      expect(store.getDurabilityStatus().activeState).toBe("storageFailure");
      expect(durabilityListener).not.toHaveBeenCalled();
      expect(stateListener).toHaveBeenCalledOnce();
    });

    it("emits only for profile status changes while profile runtime always notifies", () => {
      const localStorage = createLocalStorageMock();
      let shouldFail = true;

      localStorage.setItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_STORAGE_KEY && shouldFail) {
          throw new RangeError("Injected profile storage failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const durabilityListener = vi.fn();
      const stateListener = vi.fn();

      store.subscribeDurability(durabilityListener);
      store.subscribe(stateListener);

      store.saveProfile({ name: "Profile A", savedAt: "2026-05-05T09:00:00-05:00" });
      expect(durabilityListener).toHaveBeenLastCalledWith({
        activeState: "unknown",
        profiles: "storageFailure",
      });

      durabilityListener.mockClear();
      stateListener.mockClear();
      store.saveProfile({ name: "Profile B", savedAt: "2026-05-05T09:05:00-05:00" });
      expect(durabilityListener).not.toHaveBeenCalled();
      expect(stateListener).toHaveBeenCalledOnce();

      shouldFail = false;
      store.deleteProfile(store.getState().savedProfiles[0]!.id);
      expect(durabilityListener).toHaveBeenCalledOnce();
      expect(durabilityListener).toHaveBeenCalledWith({
        activeState: "unknown",
        profiles: "durable",
      });
    });

    it.each(["both", "one", "none"] as const)(
      "batches clear into at most one durability notification when %s surfaces change",
      (changedSurfaces) => {
        const localStorage = createLocalStorageMock();
        const store = createDayFrameStore();

        if (changedSurfaces === "one") {
          installLocalStorageMock(localStorage);
          store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
        } else if (changedSurfaces === "none") {
          localStorage.setItem = vi.fn(() => {
            throw new RangeError("Injected write failure");
          });
          localStorage.removeItem = vi.fn(() => {
            throw new RangeError("Injected removal failure");
          });
          installLocalStorageMock(localStorage);
          store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
          store.saveProfile({ name: "Profile A", savedAt: "2026-05-05T09:00:00-05:00" });
        } else {
          installLocalStorageMock(localStorage);
        }

        const durabilityListener = vi.fn();
        const stateListener = vi.fn();

        store.subscribeDurability(durabilityListener);
        store.subscribe(stateListener);
        store.clearLocalData();

        expect(durabilityListener).toHaveBeenCalledTimes(changedSurfaces === "none" ? 0 : 1);
        if (changedSurfaces !== "none") {
          expect(durabilityListener).toHaveBeenCalledWith({
            activeState: "durable",
            profiles: "durable",
          });
        }
        expect(stateListener).toHaveBeenCalledOnce();
      },
    );

    it("emits for retry success without notifying state subscribers", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected active write failure");
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      const durabilityListener = vi.fn();
      const stateListener = vi.fn();

      localStorage.setItem = vi.fn();
      store.subscribeDurability(durabilityListener);
      store.subscribe(stateListener);
      store.retryActivePersistence();

      expect(durabilityListener).toHaveBeenCalledOnce();
      expect(durabilityListener).toHaveBeenCalledWith({
        activeState: "durable",
        profiles: "unknown",
      });
      expect(stateListener).not.toHaveBeenCalled();
    });

    it("emits for a changed retry failure category but not the same category", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected active write failure");
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      const durabilityListener = vi.fn();

      store.subscribeDurability(durabilityListener);
      store.retryActivePersistence();
      expect(durabilityListener).not.toHaveBeenCalled();

      delete (globalThis as { localStorage?: unknown }).localStorage;
      store.retryActivePersistence();
      expect(durabilityListener).toHaveBeenCalledOnce();
      expect(durabilityListener).toHaveBeenCalledWith({
        activeState: "unavailable",
        profiles: "unknown",
      });
    });

    it("does not emit for not-attempted retry", () => {
      const store = createDayFrameStore();
      const durabilityListener = vi.fn();

      store.subscribeDurability(durabilityListener);

      expect(store.retryActivePersistence()).toEqual({
        status: "notAttempted",
        reason: "unknown",
      });
      expect(store.retryProfilePersistence()).toEqual({
        status: "notAttempted",
        reason: "unknown",
      });
      expect(durabilityListener).not.toHaveBeenCalled();
    });

    it("does not emit when clear changes desired condition but not durability", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected write failure");
      });
      localStorage.removeItem = vi.fn(() => {
        throw new RangeError("Injected removal failure");
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      store.saveProfile({ name: "Profile A", savedAt: "2026-05-05T09:00:00-05:00" });

      const durabilityListener = vi.fn();
      const stateListener = vi.fn();

      store.subscribeDurability(durabilityListener);
      store.subscribe(stateListener);
      store.clearLocalData();

      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "absent",
        profiles: "absent",
      });
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "storageFailure",
        profiles: "storageFailure",
      });
      expect(durabilityListener).not.toHaveBeenCalled();
      expect(stateListener).toHaveBeenCalledOnce();
    });

    it("preserves load, import, and manual-event active-surface semantics", () => {
      const profile = buildSavedProfile();
      const store = createDayFrameStore({ savedProfiles: [profile] });
      const durabilityListener = vi.fn();

      store.subscribeDurability(durabilityListener);
      store.loadProfile(profile.id);
      expect(durabilityListener).toHaveBeenLastCalledWith({
        activeState: "unavailable",
        profiles: "unknown",
      });

      durabilityListener.mockClear();
      store.setManualEvents([]);
      expect(durabilityListener).not.toHaveBeenCalled();

      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);
      store.importBackup(
        createDayFrameBackup(profile.data, "2026-05-05T10:00:00-05:00"),
      );
      expect(durabilityListener).toHaveBeenCalledOnce();
      expect(durabilityListener).toHaveBeenCalledWith({
        activeState: "durable",
        profiles: "unknown",
      });
    });

    it("isolates listener snapshots and unsubscribe behavior", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const firstListener = vi.fn((status) => {
        status.activeState = "storageFailure";
      });
      const secondListener = vi.fn();
      const stateListener = vi.fn();
      const unsubscribeFirst = store.subscribeDurability(firstListener);

      store.subscribeDurability(secondListener);
      store.subscribe(stateListener);
      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      expect(firstListener).toHaveBeenCalledOnce();
      expect(secondListener).toHaveBeenCalledWith({
        activeState: "durable",
        profiles: "unknown",
      });
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "durable",
        profiles: "unknown",
      });

      unsubscribeFirst();
      unsubscribeFirst();
      firstListener.mockClear();
      secondListener.mockClear();
      stateListener.mockClear();

      store.saveProfile({ name: "Profile A", savedAt: "2026-05-05T09:00:00-05:00" });

      expect(firstListener).not.toHaveBeenCalled();
      expect(secondListener).toHaveBeenCalledOnce();
      expect(secondListener).toHaveBeenCalledWith({
        activeState: "durable",
        profiles: "durable",
      });
      expect(stateListener).toHaveBeenCalledOnce();
    });

    it("registering and unsubscribing durability listeners does not notify state", () => {
      const store = createDayFrameStore();
      const stateListener = vi.fn();
      const durabilityListener = vi.fn();

      store.subscribe(stateListener);
      const unsubscribe = store.subscribeDurability(durabilityListener);
      unsubscribe();

      expect(stateListener).not.toHaveBeenCalled();
      expect(durabilityListener).not.toHaveBeenCalled();
    });
  });

  describe("retained store durability status", () => {
    it("starts unknown for default and seeded stores and returns isolated snapshots", () => {
      const defaultStore = createDayFrameStore();
      const seededStore = createDayFrameStore({
        schedulingPreferences: {
          dayBoundaryStartTime: "04:00",
          weekStartsOn: "monday",
        },
      });
      const listener = vi.fn();

      defaultStore.subscribe(listener);

      const status = defaultStore.getDurabilityStatus();

      expect(status).toEqual({ activeState: "unknown", profiles: "unknown" });
      expect(seededStore.getDurabilityStatus()).toEqual({
        activeState: "unknown",
        profiles: "unknown",
      });
      status.activeState = "durable";
      expect(defaultStore.getDurabilityStatus()).toEqual({
        activeState: "unknown",
        profiles: "unknown",
      });
      expect(listener).not.toHaveBeenCalled();
      expect(defaultStore.getState()).not.toHaveProperty("durabilityStatus");
    });

    it("retains active outcomes, later convergence, and later failure", () => {
      const localStorage = createLocalStorageMock();
      let shouldFail = true;

      localStorage.setItem = vi.fn(() => {
        if (shouldFail) {
          throw new RangeError("Injected active storage failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const listener = vi.fn();

      store.subscribe(listener);

      const failed = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      expect(failed.persistence.status).toBe("storageFailure");
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "storageFailure",
        profiles: "unknown",
      });

      shouldFail = false;
      const converged = store.setPreviewRange({
        preset: "oneWeek",
        startDate: "2026-05-04",
        endDate: "2026-05-11",
      });

      expect(converged.persistence.status).toBe("persisted");
      expect(store.getDurabilityStatus().activeState).toBe("durable");

      shouldFail = true;
      store.setShiftDefinitions(buildShiftDefinitions());

      expect(store.getDurabilityStatus().activeState).toBe("storageFailure");
      expect(listener).toHaveBeenCalledTimes(3);
    });

    it("retains unavailable and serialization-failure active outcomes", () => {
      const unavailableStore = createDayFrameStore();

      unavailableStore.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      expect(unavailableStore.getDurabilityStatus()).toEqual({
        activeState: "unavailable",
        profiles: "unknown",
      });

      const localStorage = createLocalStorageMock();
      const serializationStore = createDayFrameStore(buildSerializationFailureState());

      installLocalStorageMock(localStorage);
      serializationStore.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      expect(serializationStore.getDurabilityStatus()).toEqual({
        activeState: "serializationFailure",
        profiles: "unknown",
      });
    });

    it("retains profile outcomes independently and later converges", () => {
      const localStorage = createLocalStorageMock();
      let shouldFailProfiles = true;

      localStorage.setItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_STORAGE_KEY && shouldFailProfiles) {
          throw new RangeError("Injected profile storage failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const failed = store.saveProfile({
        name: "Profile A",
        savedAt: "2026-05-05T09:00:00-05:00",
      });

      expect(failed.persistence.status).toBe("storageFailure");
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "unknown",
        profiles: "storageFailure",
      });

      shouldFailProfiles = false;
      store.saveProfile({
        name: "Profile B",
        savedAt: "2026-05-05T09:05:00-05:00",
      });

      expect(store.getDurabilityStatus()).toEqual({
        activeState: "unknown",
        profiles: "durable",
      });

      store.deleteProfile(failed.state.savedProfiles[0]!.id);

      expect(store.getDurabilityStatus().profiles).toBe("durable");
    });

    it("updates active status only for profile load and backup import", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const saveResult = store.saveProfile({
        name: "Load Source",
        savedAt: "2026-05-05T09:00:00-05:00",
      });

      localStorage.setItem = vi.fn((key: string) => {
        if (key === DAYFRAME_STORAGE_KEY) {
          throw new RangeError("Injected active storage failure");
        }
      });

      store.loadProfile(saveResult.state.savedProfiles[0]!.id);

      expect(store.getDurabilityStatus()).toEqual({
        activeState: "storageFailure",
        profiles: "durable",
      });

      localStorage.setItem = vi.fn();
      store.importBackup(
        createDayFrameBackup(buildSavedProfile().data, "2026-05-05T10:00:00-05:00"),
      );

      expect(store.getDurabilityStatus()).toEqual({
        activeState: "durable",
        profiles: "durable",
      });
    });

    it("maps partial and non-successful clear outcomes independently", () => {
      const localStorage = createLocalStorageMock();

      localStorage.removeItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_STORAGE_KEY) {
          throw new RangeError("Injected profile removal failure");
        }
      });
      installLocalStorageMock(localStorage);

      const partialStore = createDayFrameStore();
      const partial = partialStore.clearLocalData();

      expect(partial.durability).toBe("partiallyCleared");
      expect(partialStore.getDurabilityStatus()).toEqual({
        activeState: "durable",
        profiles: "storageFailure",
      });

      delete (globalThis as { localStorage?: unknown }).localStorage;

      const unavailableStore = createDayFrameStore();
      const notCleared = unavailableStore.clearLocalData();

      expect(notCleared.durability).toBe("notCleared");
      expect(unavailableStore.getDurabilityStatus()).toEqual({
        activeState: "unavailable",
        profiles: "unavailable",
      });
    });

    it("does not change retained status for non-persisting operations", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      const before = store.getDurabilityStatus();

      store.exportBackup("2026-05-05T10:00:00-05:00");
      store.getState();

      expect(store.getDurabilityStatus()).toEqual(before);
    });
  });

  describe("retained desired durable condition", () => {
    it("starts with snapshot intent for default and seeded stores and exposes isolated snapshots", () => {
      const defaultStore = createDayFrameStore();
      const seededStore = createDayFrameStore({
        schedulingPreferences: {
          dayBoundaryStartTime: "04:00",
          weekStartsOn: "monday",
        },
      });
      const listener = vi.fn();

      defaultStore.subscribe(listener);

      const desired = defaultStore.getDesiredDurableCondition();

      expect(desired).toEqual({ activeState: "snapshot", profiles: "snapshot" });
      expect(seededStore.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "snapshot",
      });
      desired.activeState = "absent";
      expect(defaultStore.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "snapshot",
      });
      expect(defaultStore.getDurabilityStatus()).toEqual({
        activeState: "unknown",
        profiles: "unknown",
      });
      expect(defaultStore.getState()).not.toHaveProperty("desiredDurableCondition");
      expect(listener).not.toHaveBeenCalled();
    });

    it("replaces active absence with snapshot intent even when persistence fails", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const listener = vi.fn();

      store.subscribe(listener);
      store.clearLocalData();
      localStorage.setItem = vi.fn((key: string) => {
        if (key === DAYFRAME_STORAGE_KEY) {
          throw new RangeError("Injected active storage failure");
        }
      });

      const result = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      expect(result).toEqual({
        state: expect.objectContaining({
          schedulingPreferences: {
            dayBoundaryStartTime: "04:00",
            weekStartsOn: "saturday",
          },
        }),
        persistence: { status: "storageFailure" },
      });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "absent",
      });
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "storageFailure",
        profiles: "durable",
      });
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it("establishes snapshot intent through every ordinary active persistence path", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createDayFrameStore({ savedProfiles: [buildSavedProfile()] });
      const expectActiveSnapshotAfterClear = (operation: () => unknown) => {
        store.clearLocalData();
        operation();
        expect(store.getDesiredDurableCondition()).toEqual({
          activeState: "snapshot",
          profiles: "absent",
        });
      };

      expectActiveSnapshotAfterClear(() =>
        store.commitAuthoredSetup({
          schedulingPreferences: store.getState().schedulingPreferences,
          previewRange: store.getState().previewRange,
          shiftDefinitions: [],
          shiftCycles: [],
          blockTemplates: [],
          blockRecurrences: [],
        }),
      );
      expectActiveSnapshotAfterClear(() =>
        store.setPreviewRange({
          preset: "oneWeek",
          startDate: "2026-05-04",
          endDate: "2026-05-11",
        }),
      );
      expectActiveSnapshotAfterClear(() => store.setShiftDefinitions(buildShiftDefinitions()));
      expectActiveSnapshotAfterClear(() => store.setShiftCycles([]));
      expectActiveSnapshotAfterClear(() => store.setBlockTemplates(buildBlockTemplates()));
      expectActiveSnapshotAfterClear(() => store.setBlockRecurrences(buildBlockRecurrences()));
      expectActiveSnapshotAfterClear(() => store.setManualEvents([]));
    });

    it("replaces profile absence with snapshot intent on save failure and ordinary delete", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.clearLocalData();
      localStorage.setItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_STORAGE_KEY) {
          throw new RangeError("Injected profile storage failure");
        }
      });

      const saveResult = store.saveProfile({
        name: "Profile A",
        savedAt: "2026-05-05T09:00:00-05:00",
      });

      expect(saveResult.persistence).toEqual({ status: "storageFailure" });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "absent",
        profiles: "snapshot",
      });
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "durable",
        profiles: "storageFailure",
      });

      store.clearLocalData();
      const deleteResult = store.deleteProfile("missing_after_clear");

      expect(deleteResult.state.savedProfiles).toEqual([]);
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "absent",
        profiles: "snapshot",
      });
    });

    it("treats profile load and backup import as active snapshot intent only", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createDayFrameStore({ savedProfiles: [buildSavedProfile()] });

      store.loadProfile("profile_outcome");

      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "snapshot",
      });

      store.clearLocalData();
      store.importBackup(
        createDayFrameBackup(buildSavedProfile().data, "2026-05-05T10:00:00-05:00"),
      );

      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "absent",
      });
    });

    it.each([
      [false, false, "cleared", "durable", "durable"],
      [false, true, "partiallyCleared", "durable", "storageFailure"],
      [true, true, "notCleared", "storageFailure", "storageFailure"],
    ] as const)(
      "retains absence for clear failures active=%s profiles=%s",
      (activeFailure, profileFailure, aggregate, activeStatus, profileStatus) => {
        const localStorage = createLocalStorageMock();

        localStorage.removeItem = vi.fn((key: string) => {
          if (
            (key === DAYFRAME_STORAGE_KEY && activeFailure) ||
            (key === DAYFRAME_PROFILES_STORAGE_KEY && profileFailure)
          ) {
            throw new RangeError("Injected removal failure");
          }
        });
        installLocalStorageMock(localStorage);

        const store = createDayFrameStore();
        const result = store.clearLocalData();

        expect(result.durability).toBe(aggregate);
        expect(store.getDesiredDurableCondition()).toEqual({
          activeState: "absent",
          profiles: "absent",
        });
        expect(store.getDurabilityStatus()).toEqual({
          activeState: activeStatus,
          profiles: profileStatus,
        });
      },
    );

    it("lets clear replace snapshot intent for both surfaces", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      store.saveProfile({ name: "Profile A", savedAt: "2026-05-05T09:00:00-05:00" });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "snapshot",
      });

      const result = store.clearLocalData();

      expect(result).toEqual({
        state: createInitialDayFrameState(),
        activeState: { status: "removed" },
        profiles: { status: "removed" },
        durability: "cleared",
      });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "absent",
        profiles: "absent",
      });
    });

    it("does not change intent for reads, backup export, or Preview-only operations", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createDayFrameStore({
        shiftDefinitions: buildShiftDefinitions(),
        shiftCycles: [
          {
            id: "cycle_preview",
            userId: "user_001",
            name: "Preview Cycle",
            type: "fixedSegments",
            mode: "manualSegments",
            startsOnDate: "2026-05-04",
            endsOnDate: "2026-05-05",
            sequenceAnchorDate: "2026-05-04",
            sequence: [],
            segments: [],
            ...baseTimestamps,
          },
        ],
      });

      store.clearLocalData();
      store.setShiftDefinitions(buildShiftDefinitions());
      store.setShiftCycles([
        {
          id: "cycle_preview",
          userId: "user_001",
          name: "Preview Cycle",
          type: "fixedSegments",
          mode: "manualSegments",
          startsOnDate: "2026-05-04",
          endsOnDate: "2026-05-05",
          sequenceAnchorDate: "2026-05-04",
          sequence: [],
          segments: [],
          ...baseTimestamps,
        },
      ]);
      const before = store.getDesiredDurableCondition();

      store.getState();
      store.exportBackup("2026-05-05T10:00:00-05:00");
      store.generatePreview({
        rangeStartDate: "2026-05-04",
        rangeEndDate: "2026-05-05",
        planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
        planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
        generatedAt: "2026-05-03T13:00:00-05:00",
      });

      expect(store.getDesiredDurableCondition()).toEqual(before);
    });

    it("preserves intent when a storage-accessor failure is normalized", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createDayFrameStore();
      const listener = vi.fn();

      store.subscribe(listener);
      store.clearLocalData();
      installThrowingLocalStorageAccessor();

      const result = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      expect(result.persistence).toEqual({ status: "storageFailure" });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "absent",
      });
      expect(store.getDurabilityStatus()).toEqual({
        activeState: "storageFailure",
        profiles: "durable",
      });
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });
});

function buildSavedProfile(state = createInitialDayFrameState()): DayFrameSavedProfile {
  return {
    id: "profile_outcome",
    name: "Outcome Profile",
    savedAt: "2026-05-05T09:00:00-05:00",
    data: {
      schedulingPreferences: state.schedulingPreferences,
      previewRange: state.previewRange,
      shiftDefinitions: state.shiftDefinitions,
      shiftCycles: state.shiftCycles,
      blockTemplates: state.blockTemplates,
      blockRecurrences: state.blockRecurrences,
      manualEvents: state.manualEvents,
    },
  };
}

function buildSerializationFailureState(): DayFrameState {
  const state = createInitialDayFrameState();
  const blockTemplate = buildBlockTemplates()[0]!;

  state.blockTemplates = [
    {
      ...blockTemplate,
      externalResources: [
        {
          id: "resource_invalid",
          type: "note",
          label: "Invalid metadata",
          value: "Injected only at the persistence helper test boundary",
          metadata: {
            invalid: 1n as unknown as string,
          },
          ...baseTimestamps,
        },
      ],
    },
  ];

  return state;
}

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

function buildLegacySingularAuthoredSetup() {
  return {
    schedulingPreferences: {
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
    },
    previewRange: {
      preset: "threeDays",
      startDate: "2026-05-04",
      endDate: "2026-05-06",
    },
    shiftDefinitions: buildShiftDefinitions(),
    shiftCycle: {
      id: "cycle_legacy",
      userId: "user_001",
      name: "Legacy Rotation",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      segments: [
        {
          id: "segment_legacy",
          shiftCycleId: "cycle_legacy",
          shiftDefinitionId: "shift_day",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
        },
      ],
      ...baseTimestamps,
    } satisfies ShiftCycle,
    blockTemplates: [],
    blockRecurrences: [],
    manualEvents: [],
  };
}

function buildNormalizedLegacyShiftCycle(): ShiftCycle {
  return {
    ...buildLegacySingularAuthoredSetup().shiftCycle,
    mode: "manualSegments",
    sequenceAnchorDate: "2026-05-01",
    sequence: [],
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

function installThrowingLocalStorageAccessor(): void {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new RangeError("Injected storage accessor failure");
    },
  });
}
