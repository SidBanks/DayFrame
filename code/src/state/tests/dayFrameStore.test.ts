import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createDayFrameBackup,
  parseDayFrameBackupJson,
  validateDayFrameBackupV2,
} from "../dayFrameBackup.js";
import { createInitialDayFrameState } from "../createInitialDayFrameState.js";
import {
  clearPersistedProfiles,
  clearPersistedState,
  DAYFRAME_ACTIVE_V2_STORAGE_KEY,
  DAYFRAME_ACTIVE_V2_ESTABLISHED_KEY,
  DAYFRAME_PROFILES_STORAGE_KEY,
  DAYFRAME_PROFILES_V2_STORAGE_KEY,
  DAYFRAME_PROFILES_V2_ESTABLISHED_KEY,
  DAYFRAME_STORAGE_KEY,
  persistProfiles,
  persistState,
} from "../dayFrameStore.js";
import { createReadyDayFrameTestStore } from "./dayFrameStoreTestUtils.js";
import { projectActiveToPattern } from "../activeV2.js";
import type {
  AppliedStoreMutationResult,
  BackupImportResult,
  DayFrameAuthoredSetup,
  DayFrameAuthoredPattern,
  DayFrameSavedProfile,
  DayFrameState,
  ProfileLoadResult,
  StoreMutationResult,
} from "../types.js";
import type { BlockRecurrence, BlockTemplate } from "../../core/blocks/types.js";
import type { ShiftCycle } from "../../core/cycles/types.js";
import type { ShiftDefinition } from "../../core/shifts/types.js";

const baseTimestamps = {
  createdAt: "2026-05-03T00:00:00-05:00",
  updatedAt: "2026-05-03T00:00:00-05:00",
} as const;

function currentPattern(state: DayFrameState): DayFrameAuthoredPattern {
  return projectActiveToPattern(state);
}

function currentActiveSetup(state: DayFrameState): DayFrameAuthoredSetup {
  const {
    schedulingPreferences,
    previewRange,
    shiftDefinitions,
    shiftCycles,
    blockTemplates,
    blockRecurrences,
    manualEvents,
  } = state;
  return {
    schedulingPreferences,
    previewRange,
    shiftDefinitions,
    shiftCycles,
    blockTemplates,
    blockRecurrences,
    manualEvents,
  };
}

function readActiveV2Data(
  storage: ReturnType<typeof createLocalStorageMock>,
): DayFrameAuthoredSetup {
  const envelope = JSON.parse(storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY) ?? "{}") as {
    data: DayFrameAuthoredSetup;
  };
  return envelope.data;
}

function expectApplied(result: StoreMutationResult): asserts result is AppliedStoreMutationResult {
  expect(result.status).toBe("applied");
}

function expectProfileLoaded(
  result: ProfileLoadResult,
): asserts result is Extract<ProfileLoadResult, { status: "loaded" }> {
  expect(result.status).toBe("loaded");
}

function expectBackupImported(
  result: BackupImportResult,
): asserts result is Extract<
  BackupImportResult,
  { status: "instantiatedFromLegacy" | "restored" }
> {
  expect(["instantiatedFromLegacy", "restored"]).toContain(result.status);
}

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

    const store = createReadyDayFrameTestStore();
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
    expect(store.getActiveLocalIngressStatus()).toEqual({ status: "accepted", advisories: [] });

    store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

    const rewrittenState = readActiveV2Data(localStorage);

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

    expect(currentPattern(state).shiftCycles).toEqual([
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

    const store = createReadyDayFrameTestStore();

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

    expect(currentPattern(store.getState()).manualEvents).toEqual([
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

    expect(readActiveV2Data(localStorage)).toMatchObject({
      manualEvents: currentPattern(store.getState()).manualEvents,
    });
    expect(store.getState().savedProfiles[0]?.data.manualEvents).toEqual(
      currentPattern(store.getState()).manualEvents,
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

    expect(currentPattern(createReadyDayFrameTestStore().getState()).manualEvents).toEqual([
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

    const store = createReadyDayFrameTestStore();
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
    store.setShiftDefinitions(buildShiftDefinitions());
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
    expect(currentPattern(state).shiftDefinitions).toEqual(shiftDefinitions);
    expect(currentPattern(state).shiftCycles).toEqual([shiftCycle]);
    expect(state.preview).toBeNull();
    const persistedState = readActiveV2Data(localStorage);

    expect(persistedState).toEqual(currentActiveSetup(store.getState()));
    expect(projectActiveToPattern(persistedState)).toMatchObject({
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
    const store = createReadyDayFrameTestStore({
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
    expectApplied(result);
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
    expect(setItem).toHaveBeenCalledWith(DAYFRAME_ACTIVE_V2_STORAGE_KEY, expect.any(String));
    expect(setItem).not.toHaveBeenCalledWith(DAYFRAME_STORAGE_KEY, expect.any(String));
    expect(readActiveV2Data(localStorage)).toEqual(currentActiveSetup(state));
  });

  it("commits authored setup without creating a preview", () => {
    const store = createReadyDayFrameTestStore();

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
      shiftDefinitions: buildShiftDefinitions(),
      shiftCycles: [buildShiftCycle()],
      blockTemplates: buildBlockTemplates(),
      blockRecurrences: buildBlockRecurrences(),
    });
    expectApplied(result);
    const { state } = result;

    expect(state.preview).toBeNull();
  });

  it("generates and stores a preview from the current state", () => {
    const store = createReadyDayFrameTestStore();
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

    const store = createReadyDayFrameTestStore();
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

    store.setShiftDefinitions(buildShiftDefinitions());
    store.setShiftCycles([shiftCycle]);

    expect(currentPattern(store.getState()).shiftCycles).toEqual([shiftCycle]);
    const persistedState = readActiveV2Data(localStorage);

    expect(persistedState).toMatchObject({
      shiftCycles: [shiftCycle],
    });
    expect(persistedState).not.toHaveProperty("shiftCycle");
  });

  it("marks the current preview as stale when authored setup changes", () => {
    const store = createReadyDayFrameTestStore();

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

    const result = store.setSchedulingPreferences({
      dayBoundaryStartTime: "04:00",
    });
    expectApplied(result);
    const { state } = result;

    expect(state.preview?.generatedAt).toBe("2026-05-03T13:00:00-05:00");
    expect(state.preview?.isStale).toBe(true);
  });

  it("exports authored setup data without preview state", () => {
    const store = createReadyDayFrameTestStore();

    store.setSchedulingPreferences({
      dayBoundaryStartTime: "04:00",
      weekStartsOn: "monday",
    });
    store.setShiftDefinitions(buildShiftDefinitions());
    store.setShiftCycles([buildShiftCycle()]);
    store.setBlockTemplates(buildBlockTemplates());
    store.setBlockRecurrences(buildBlockRecurrences());

    const activeBefore = currentActiveSetup(store.getState());
    const backup = store.exportBackup("2026-05-05T10:00:00-05:00");

    expect(backup).toMatchObject({
      app: "DayFrame",
      surface: "backup",
      version: 2,
      exportedAt: "2026-05-05T10:00:00-05:00",
    });
    expect(backup.data).toEqual(activeBefore);
    expect(backup.data).not.toHaveProperty("shiftCycle");
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
    const result = createReadyDayFrameTestStore().importBackup(backup);
    expectBackupImported(result);
    const { state } = result;

    expect(currentPattern(state).shiftCycles).toEqual([buildNormalizedLegacyShiftCycle()]);
    expect(readActiveV2Data(localStorage)).toMatchObject({
      shiftCycles: [buildNormalizedLegacyShiftCycle()],
    });
    expect(readActiveV2Data(localStorage)).not.toHaveProperty("shiftCycle");
  });

  it("imports authored setup data and clears any current preview", () => {
    const localStorage = createLocalStorageMock();

    installLocalStorageMock(localStorage);

    const store = createReadyDayFrameTestStore();
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

    const result = store.importBackup(
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
    expectBackupImported(result);
    const { state } = result;

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
    const persistedState = readActiveV2Data(localStorage);

    expect(projectActiveToPattern(persistedState)).toEqual({
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

    const store = createReadyDayFrameTestStore();

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
      localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY) ?? "{}",
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
    expect(currentPattern(store.getState()).blockTemplates).toEqual(buildBlockTemplates());
    expect(currentPattern(store.getState()).blockRecurrences).toEqual(buildBlockRecurrences());
    expect(store.getState().preview).toBeNull();

    store.deleteProfile(store.getState().savedProfiles[0]!.id);

    expect(store.getState().savedProfiles).toEqual([]);
    expect(JSON.parse(localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY) ?? "{}")).toEqual({
      app: "DayFrame",
      surface: "profiles",
      version: 2,
      profiles: [],
      quarantinedProfiles: [],
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

    const store = createReadyDayFrameTestStore();
    const result = store.loadProfile("profile_legacy");
    expectProfileLoaded(result);
    const { state } = result;

    expect(currentPattern(state).shiftCycles).toEqual([buildNormalizedLegacyShiftCycle()]);
    expect(state.preview).toBeNull();
    expect(readActiveV2Data(localStorage)).toMatchObject({
      shiftCycles: [buildNormalizedLegacyShiftCycle()],
    });
  });

  it("applies a selected suggested fix to the current preview", () => {
    const localStorage = createLocalStorageMock();

    installLocalStorageMock(localStorage);

    const store = createReadyDayFrameTestStore();
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
    const persistedState = readActiveV2Data(localStorage);

    expect(projectActiveToPattern(persistedState)).toEqual({
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
      blockTemplates,
      blockRecurrences,
      manualEvents: [],
    });
    expect(JSON.stringify(persistedState)).not.toContain("occurrenceIdentity");

    const returnedIdentity = state.preview?.result.scheduledBlocks[0]?.occurrenceIdentity;
    expect(returnedIdentity).toBeDefined();
    if (returnedIdentity && "slot" in returnedIdentity) {
      returnedIdentity.slot = 99;
      expect(store.getState().preview?.result.scheduledBlocks[0]?.occurrenceIdentity).not.toEqual(
        returnedIdentity,
      );
    }
  });

  it("rejects a suggested fix against a stale preview without mutation, persistence, or notification", () => {
    const localStorage = createLocalStorageMock();
    const setItemSpy = vi.spyOn(localStorage, "setItem");
    installLocalStorageMock(localStorage);

    const store = createReadyDayFrameTestStore({
      shiftDefinitions: buildShiftDefinitions(),
      shiftCycles: [buildShiftCycle()],
      blockTemplates: buildBlockTemplates(),
      blockRecurrences: buildBlockRecurrences(),
    });
    store.generatePreview({
      rangeStartDate: "2026-05-04",
      rangeEndDate: "2026-05-05",
      planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
      planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
      generatedAt: "2026-05-03T13:00:00-05:00",
    });
    store.setSchedulingPreferences({ weekStartsOn: "monday" });

    const stateBefore = store.getState();
    const durabilityBefore = store.getDurabilityStatus();
    const persistedBefore = localStorage.getItem(DAYFRAME_STORAGE_KEY);
    const stateListener = vi.fn();
    const durabilityListener = vi.fn();
    store.subscribe(stateListener);
    store.subscribeDurability(durabilityListener);
    setItemSpy.mockClear();

    const result = store.applySuggestedFixToPreview({
      selectedFrictionPointId: "stale_friction",
      selectedSuggestedFixId: "stale_fix",
      revisedAt: "2026-05-03T14:00:00-05:00",
    });

    expect(stateBefore.preview?.isStale).toBe(true);
    expect(result).toEqual(stateBefore);
    expect(result).not.toBe(stateBefore);
    expect(store.getState()).toEqual(stateBefore);
    expect(store.getDurabilityStatus()).toEqual(durabilityBefore);
    expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(persistedBefore);
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(stateListener).not.toHaveBeenCalled();
    expect(durabilityListener).not.toHaveBeenCalled();
  });

  it("stores review guidance without marking the preview revised for Review fixed time", () => {
    const store = createReadyDayFrameTestStore({
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
          planDecisionResults: [],
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
    const store = createReadyDayFrameTestStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
    unsubscribe();
    store.setSchedulingPreferences({ weekStartsOn: "monday" });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0]?.[0].schedulingPreferences.dayBoundaryStartTime).toBe("04:00");
  });

  it("clears persisted local setup data and resets the authored state", async () => {
    const localStorage = createLocalStorageMock();

    installLocalStorageMock(localStorage);

    const store = createReadyDayFrameTestStore({
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

    const result = await store.clearLocalData();

    expect(store.getState()).toEqual(createInitialDayFrameState());
    expect(result).toMatchObject({
      state: createInitialDayFrameState(),
      activeState: { status: "removed" },
      profiles: { status: "removed" },
      planDecisions: { status: "removed" },
      executionHistory: { status: "removed" },
      historicalPlan: { status: "removed" },
      durability: "cleared",
    });
    expect(result.status).toBe("cleared");
    expect(Object.keys(result.authorities)).toEqual([
      "active",
      "profiles",
      "planDecisions",
      "executionHistory",
      "historicalPlan",
      "goals",
      "measurementDefinitions",
      "progressObservations",
    ]);
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
      expect(localStorage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY)).not.toBeNull();
      expect(localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY)).not.toBeNull();
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

      const store = createReadyDayFrameTestStore();
      const listener = vi.fn();

      store.subscribe(listener);

      const result = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      expectApplied(result);
      const { state } = result;

      expect(state.schedulingPreferences.dayBoundaryStartTime).toBe("04:00");
      expect(result.persistence).toEqual({ status: "storageFailure" });
      expect(store.getState()).toEqual(state);
      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith(state);
    });
  });

  describe("store mutation persistence results", () => {
    it("rejects invalid complete authored state without any runtime or infrastructure effect", () => {
      const localStorage = createLocalStorageMock();
      const setItem = vi.spyOn(localStorage, "setItem");
      installLocalStorageMock(localStorage);
      const store = createReadyDayFrameTestStore({
        shiftDefinitions: buildShiftDefinitions(),
        shiftCycles: [buildShiftCycle()],
        blockTemplates: buildBlockTemplates(),
        blockRecurrences: buildBlockRecurrences(),
      });
      store.generatePreview({
        rangeStartDate: "2026-05-04",
        rangeEndDate: "2026-05-05",
        planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
        planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
        generatedAt: "2026-05-03T13:00:00-05:00",
      });
      const stateBefore = store.getState();
      const durabilityBefore = store.getDurabilityStatus();
      const desiredBefore = store.getDesiredDurableCondition();
      const stateListener = vi.fn();
      const durabilityListener = vi.fn();
      store.subscribe(stateListener);
      store.subscribeDurability(durabilityListener);
      setItem.mockClear();

      const duplicate = buildShiftDefinitions()[0]!;
      const result = store.setShiftDefinitions([duplicate, { ...duplicate }]);

      expect(result).toMatchObject({
        status: "rejected",
        reason: "invalidAuthoredState",
        validation: {
          status: "invalid",
          issues: [{ code: "duplicateSourceId", sourceId: duplicate.id }],
        },
      });
      expect(store.getState()).toEqual(stateBefore);
      expect(store.getState().preview).toEqual(stateBefore.preview);
      expect(store.getDurabilityStatus()).toEqual(durabilityBefore);
      expect(store.getDesiredDurableCondition()).toEqual(desiredBefore);
      expect(setItem).not.toHaveBeenCalled();
      expect(stateListener).not.toHaveBeenCalled();
      expect(durabilityListener).not.toHaveBeenCalled();
    });

    it("rejects orphan-producing narrow deletion and accepts an atomic relationship deletion", () => {
      const store = createReadyDayFrameTestStore({
        shiftDefinitions: buildShiftDefinitions(),
        shiftCycles: [buildShiftCycle()],
        blockTemplates: buildBlockTemplates(),
        blockRecurrences: buildBlockRecurrences(),
      });

      const rejectedShift = store.setShiftDefinitions([]);
      const rejectedTemplate = store.setBlockTemplates([]);

      expect(rejectedShift.status).toBe("rejected");
      expect(rejectedTemplate.status).toBe("rejected");

      const applied = store.commitAuthoredSetup({
        schedulingPreferences: store.getState().schedulingPreferences,
        previewRange: store.getState().previewRange,
        shiftDefinitions: [],
        shiftCycles: [],
        blockTemplates: [],
        blockRecurrences: [],
      });

      expect(applied.status).toBe("applied");
      expect(store.getState()).toMatchObject({
        shiftDefinitions: [],
        shiftCycles: [],
        blockTemplates: [],
        blockRecurrences: [],
      });
    });

    it("applies unsupported declared recurrence intent because its diagnostic is advisory", () => {
      const store = createReadyDayFrameTestStore({
        blockTemplates: buildBlockTemplates(),
      });

      const result = store.setBlockRecurrences([
        {
          id: "rec_unsupported",
          blockTemplateId: buildBlockTemplates()[0]!.id,
          frequency: "custom",
        },
      ]);

      expect(result.status).toBe("applied");
      expect(store.getState().blockRecurrences[0]?.frequency).toBe("custom");
    });

    it("returns unavailable with the applied active mutation and one notification", () => {
      const store = createReadyDayFrameTestStore();
      const listener = vi.fn();

      store.subscribe(listener);

      const result = store.setPreviewRange({
        preset: "oneWeek",
        startDate: "2026-05-04",
        endDate: "2026-05-11",
      });
      expectApplied(result);

      expect(result.persistence).toEqual({ status: "unavailable" });
      expect(result.state.previewRange.preset).toBe("oneWeek");
      expect(store.getState()).toEqual(result.state);
      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith(result.state);
    });

    it("preserves serialization failure through an authored mutation result", () => {
      const localStorage = createLocalStorageMock();
      const store = createReadyDayFrameTestStore(buildSerializationFailureState());

      installLocalStorageMock(localStorage);

      const result = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      expectApplied(result);

      expect(result.persistence).toEqual({ status: "serializationFailure" });
      expect(result.state.schedulingPreferences.dayBoundaryStartTime).toBe("04:00");
    });

    it("returns profile persistence outcomes for save and delete", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_V2_STORAGE_KEY) {
          throw new RangeError("Injected profile storage failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();
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

      const store = createReadyDayFrameTestStore();
      const saveResult = store.saveProfile({
        name: "Load Source",
        savedAt: "2026-05-05T09:00:00-05:00",
      });
      const setItem = vi.spyOn(localStorage, "setItem").mockImplementation((key: string) => {
        if (key === DAYFRAME_ACTIVE_V2_STORAGE_KEY) {
          throw new RangeError("Injected active storage failure");
        }
      });

      const loadResult = store.loadProfile(saveResult.state.savedProfiles[0]!.id);
      expectProfileLoaded(loadResult);

      expect(loadResult.persistence).toEqual({ status: "storageFailure" });
      expect(loadResult.state.savedProfiles).toHaveLength(1);
      expect(setItem).toHaveBeenCalledWith(DAYFRAME_ACTIVE_V2_STORAGE_KEY, expect.any(String));
    });

    it("reports active-state persistence after a valid backup import", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected active storage failure");
      });
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();
      const result = store.importBackup(
        createDayFrameBackup(buildSavedProfile().data, "2026-05-05T10:00:00-05:00"),
      );
      expectBackupImported(result);

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
        durability: "partiallyCleared",
        activeStatus: "storageFailure",
        profileStatus: "storageFailure",
      },
    ] as const)(
      "aggregates clear outcomes as $durability",
      async ({ activeFailure, profileFailure, durability, activeStatus, profileStatus }) => {
        const localStorage = createLocalStorageMock();

        localStorage.removeItem = vi.fn((key: string) => {
          if (
            (key === DAYFRAME_ACTIVE_V2_STORAGE_KEY && activeFailure) ||
            (key === DAYFRAME_PROFILES_STORAGE_KEY && profileFailure)
          ) {
            throw new RangeError("Injected removal failure");
          }
        });
        installLocalStorageMock(localStorage);

        const result = await createReadyDayFrameTestStore().clearLocalData();

        expect(result.state).toEqual(createInitialDayFrameState());
        expect(result.activeState.status).toBe(activeStatus);
        expect(result.profiles.status).toBe(profileStatus);
        expect(result.planDecisions.status).toBe("removed");
        expect(result.durability).toBe(durability);
      },
    );

    it("reports notCleared when storage is unavailable for both removals", async () => {
      const result = await createReadyDayFrameTestStore().clearLocalData();

      expect(result.activeState).toEqual({ status: "unavailable" });
      expect(result.profiles).toEqual({ status: "unavailable" });
      expect(result.durability).toBe("partiallyCleared");
    });
  });

  describe("normalized storage-accessor failures", () => {
    it("continues a representative active mutation and notifies once", () => {
      const store = createReadyDayFrameTestStore();
      const listener = vi.fn();

      store.subscribe(listener);
      installThrowingLocalStorageAccessor();

      const result = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      expectApplied(result);

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
      const setupStore = createReadyDayFrameTestStore();
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
      expectApplied(setupResult);

      expect(setupResult.persistence).toEqual({ status: "storageFailure" });
      expect(setupResult.state.schedulingPreferences.weekStartsOn).toBe("monday");
      expect(currentPattern(setupResult.state).shiftDefinitions).toEqual(buildShiftDefinitions());
      expect(setupStore.getDurabilityStatus().activeState).toBe("storageFailure");
      expect(setupStore.getDesiredDurableCondition().activeState).toBe("snapshot");
      expect(setupListener).toHaveBeenCalledTimes(1);

      delete (globalThis as { localStorage?: unknown }).localStorage;
      const manualStore = createReadyDayFrameTestStore();
      const manualListener = vi.fn();

      manualStore.subscribe(manualListener);
      installThrowingLocalStorageAccessor();

      const manualResult = manualStore.setManualEvents([]);
      expectApplied(manualResult);

      expect(manualResult.persistence).toEqual({ status: "storageFailure" });
      expect(manualResult.state.manualEvents).toEqual([]);
      expect(manualStore.getDurabilityStatus().activeState).toBe("storageFailure");
      expect(manualListener).toHaveBeenCalledTimes(1);
    });

    it("continues profile save and delete while preserving active infrastructure state", () => {
      const store = createReadyDayFrameTestStore();
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
      const store = createReadyDayFrameTestStore({ savedProfiles: [profile] });
      const listener = vi.fn();

      store.subscribe(listener);
      installThrowingLocalStorageAccessor();

      const loaded = store.loadProfile(profile.id);
      expectProfileLoaded(loaded);

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
      expectBackupImported(imported);

      expect(imported.persistence).toEqual({ status: "storageFailure" });
      expect(imported.state.schedulingPreferences).toEqual(profile.data.schedulingPreferences);
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it.each([
      ["active", "storageFailure", "removed", "partiallyCleared"],
      ["profiles", "removed", "storageFailure", "partiallyCleared"],
      ["both", "storageFailure", "storageFailure", "partiallyCleared"],
    ] as const)(
      "completes clear when %s storage access fails",
      async (failureSurface, activeStatus, profileStatus, aggregate) => {
        const localStorage = createLocalStorageMock();
        const store = createReadyDayFrameTestStore({ savedProfiles: [buildSavedProfile()] });
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

        const result = await store.clearLocalData();

        expect(result).toMatchObject({
          state: createInitialDayFrameState(),
          activeState: { status: activeStatus },
          profiles: { status: profileStatus },
          planDecisions: { status: failureSurface === "both" ? "unavailable" : "removed" },
          executionHistory: { status: failureSurface === "both" ? "unavailable" : "removed" },
          historicalPlan: { status: "removed" },
          durability: aggregate,
        });
        expect(accessCount).toBe(4);
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

    it("classifies read-path accessor failure without claiming a readable checkpoint", () => {
      installThrowingLocalStorageAccessor();

      const store = createReadyDayFrameTestStore();

      expect(store.getState()).toEqual(createInitialDayFrameState());
      expect(store.getActiveLocalIngressStatus()).toEqual({
        status: "recoveryRequired",
        reason: "readFailure",
        activationBlocked: true,
        sourceReadable: false,
        sourcePreserved: false,
      });
    });
  });

  describe("store-owned durability retry", () => {
    it("retries the latest active snapshot successfully without mutation or notification", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected active write failure");
      });
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();

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
        if (key === DAYFRAME_ACTIVE_V2_STORAGE_KEY) {
          const parsed = JSON.parse(value) as {
            data: { previewRange: { preset: string }; schedulingPreferences: object };
          };
          expect(parsed.data.previewRange.preset).toBe("oneWeek");
          expect(parsed.data).toMatchObject({
            schedulingPreferences: { dayBoundaryStartTime: "04:00" },
          });
        }
      });

      localStorage.setItem = successfulSet;
      store.subscribe(listener);

      const result = store.retryActivePersistence();

      expect(result).toMatchObject({
        status: "attempted",
        desiredCondition: "snapshot",
        persistence: { status: "persisted" },
      });
      expect(successfulSet).toHaveBeenCalledWith(
        DAYFRAME_ACTIVE_V2_STORAGE_KEY,
        expect.any(String),
      );
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

      const store = createReadyDayFrameTestStore();

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
      const store = createReadyDayFrameTestStore();

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
      expect(setItem).toHaveBeenCalledWith(DAYFRAME_ACTIVE_V2_STORAGE_KEY, expect.any(String));
      expect(store.getDurabilityStatus().activeState).toBe("durable");
    });

    it("retries active absence with one removal and leaves profiles untouched", async () => {
      const localStorage = createLocalStorageMock();

      localStorage.removeItem = vi.fn((key: string) => {
        if (key === DAYFRAME_ACTIVE_V2_STORAGE_KEY) {
          throw new RangeError("Injected active removal failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();

      await store.clearLocalData();

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
      expect(removeItem).toHaveBeenCalledWith(DAYFRAME_ACTIVE_V2_STORAGE_KEY);
      expect(removeItem).toHaveBeenCalledWith(DAYFRAME_STORAGE_KEY);
      expect(setItem).toHaveBeenCalledWith(expect.any(String), "1");
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
        if (key === DAYFRAME_PROFILES_V2_STORAGE_KEY) {
          throw new RangeError("Injected profile write failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();

      store.saveProfile({ name: "Profile A", savedAt: "2026-05-05T09:00:00-05:00" });
      store.saveProfile({ name: "Profile B", savedAt: "2026-05-05T09:05:00-05:00" });

      const activeInfrastructureBefore = {
        status: store.getDurabilityStatus().activeState,
        desired: store.getDesiredDurableCondition().activeState,
      };
      const listener = vi.fn();
      const setItem = vi.fn(localStorage.setItem);

      setItem.mockImplementation((key: string, value: string) => {
        if (key === DAYFRAME_PROFILES_V2_STORAGE_KEY) {
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
      expect(setItem).toHaveBeenCalledTimes(2);
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

    it("retries profile absence independently after partial clear", async () => {
      const localStorage = createLocalStorageMock();

      localStorage.removeItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_V2_STORAGE_KEY) {
          throw new RangeError("Injected profile removal failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();

      await store.clearLocalData();

      const removeItem = vi.fn();
      const setItem = vi.fn();

      localStorage.removeItem = removeItem;
      localStorage.setItem = setItem;

      expect(store.retryProfilePersistence()).toEqual({
        status: "attempted",
        desiredCondition: "absent",
        persistence: { status: "removed" },
      });
      expect(removeItem).toHaveBeenCalledTimes(2);
      expect(removeItem).toHaveBeenCalledWith(DAYFRAME_PROFILES_V2_STORAGE_KEY);
      expect(removeItem).toHaveBeenCalledWith(DAYFRAME_PROFILES_STORAGE_KEY);
      expect(setItem).toHaveBeenCalledOnce();
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

      const store = createReadyDayFrameTestStore();
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

      const store = createReadyDayFrameTestStore(buildSerializationFailureState());

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
      const store = createReadyDayFrameTestStore(buildSerializationFailureState());

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

      const store = createReadyDayFrameTestStore();
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
      const store = createReadyDayFrameTestStore();
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
      expect(observedDuringCallback).toEqual([{ activeState: "unavailable", profiles: "unknown" }]);
      expect(stateListener).toHaveBeenCalledOnce();
    });

    it("does not emit for a repeated active failure while state still notifies", () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected active storage failure");
      });
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();

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
        if (key === DAYFRAME_PROFILES_V2_STORAGE_KEY && shouldFail) {
          throw new RangeError("Injected profile storage failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();
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
      async (changedSurfaces) => {
        const localStorage = createLocalStorageMock();
        const store = createReadyDayFrameTestStore();

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
        await store.clearLocalData();

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

      const store = createReadyDayFrameTestStore();

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

      const store = createReadyDayFrameTestStore();

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
      const store = createReadyDayFrameTestStore();
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

    it("does not emit when clear changes desired condition but not durability", async () => {
      const localStorage = createLocalStorageMock();

      localStorage.setItem = vi.fn(() => {
        throw new RangeError("Injected write failure");
      });
      localStorage.removeItem = vi.fn(() => {
        throw new RangeError("Injected removal failure");
      });
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      store.saveProfile({ name: "Profile A", savedAt: "2026-05-05T09:00:00-05:00" });

      const durabilityListener = vi.fn();
      const stateListener = vi.fn();

      store.subscribeDurability(durabilityListener);
      store.subscribe(stateListener);
      await store.clearLocalData();

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
      const store = createReadyDayFrameTestStore({ savedProfiles: [profile] });
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
      store.importBackup(createDayFrameBackup(profile.data, "2026-05-05T10:00:00-05:00"));
      expect(durabilityListener).toHaveBeenCalledOnce();
      expect(durabilityListener).toHaveBeenCalledWith({
        activeState: "durable",
        profiles: "unknown",
      });
    });

    it("isolates listener snapshots and unsubscribe behavior", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();
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
      const store = createReadyDayFrameTestStore();
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
      const defaultStore = createReadyDayFrameTestStore();
      const seededStore = createReadyDayFrameTestStore({
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

      const store = createReadyDayFrameTestStore();
      const listener = vi.fn();

      store.subscribe(listener);

      const failed = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      expectApplied(failed);

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
      expectApplied(converged);

      expect(converged.persistence.status).toBe("persisted");
      expect(store.getDurabilityStatus().activeState).toBe("durable");

      shouldFail = true;
      store.setShiftDefinitions(buildShiftDefinitions());

      expect(store.getDurabilityStatus().activeState).toBe("storageFailure");
      expect(listener).toHaveBeenCalledTimes(3);
    });

    it("retains unavailable and serialization-failure active outcomes", () => {
      const unavailableStore = createReadyDayFrameTestStore();

      unavailableStore.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });

      expect(unavailableStore.getDurabilityStatus()).toEqual({
        activeState: "unavailable",
        profiles: "unknown",
      });

      const localStorage = createLocalStorageMock();
      const serializationStore = createReadyDayFrameTestStore(buildSerializationFailureState());

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
        if (key === DAYFRAME_PROFILES_V2_STORAGE_KEY && shouldFailProfiles) {
          throw new RangeError("Injected profile storage failure");
        }
      });
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();
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

      const store = createReadyDayFrameTestStore();
      const saveResult = store.saveProfile({
        name: "Load Source",
        savedAt: "2026-05-05T09:00:00-05:00",
      });

      localStorage.setItem = vi.fn((key: string) => {
        if (key === DAYFRAME_ACTIVE_V2_STORAGE_KEY) {
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

    it("maps partial and non-successful clear outcomes independently", async () => {
      const localStorage = createLocalStorageMock();

      localStorage.removeItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_STORAGE_KEY) {
          throw new RangeError("Injected profile removal failure");
        }
      });
      installLocalStorageMock(localStorage);

      const partialStore = createReadyDayFrameTestStore();
      const partial = await partialStore.clearLocalData();

      expect(partial.durability).toBe("partiallyCleared");
      expect(partialStore.getDurabilityStatus()).toEqual({
        activeState: "durable",
        profiles: "storageFailure",
      });

      delete (globalThis as { localStorage?: unknown }).localStorage;

      const unavailableStore = createReadyDayFrameTestStore();
      const notCleared = await unavailableStore.clearLocalData();

      expect(notCleared.durability).toBe("partiallyCleared");
      expect(unavailableStore.getDurabilityStatus()).toEqual({
        activeState: "unavailable",
        profiles: "unavailable",
      });
    });

    it("does not change retained status for non-persisting operations", () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      const before = store.getDurabilityStatus();

      store.exportBackup("2026-05-05T10:00:00-05:00");
      store.getState();

      expect(store.getDurabilityStatus()).toEqual(before);
    });
  });

  describe("retained desired durable condition", () => {
    it("starts with snapshot intent for default and seeded stores and exposes isolated snapshots", () => {
      const defaultStore = createReadyDayFrameTestStore();
      const seededStore = createReadyDayFrameTestStore({
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

    it("replaces active absence with snapshot intent even when persistence fails", async () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();
      const listener = vi.fn();

      store.subscribe(listener);
      await store.clearLocalData();
      localStorage.setItem = vi.fn((key: string) => {
        if (key === DAYFRAME_ACTIVE_V2_STORAGE_KEY) {
          throw new RangeError("Injected active storage failure");
        }
      });

      const result = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      expectApplied(result);

      expect(result).toMatchObject({
        status: "applied",
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

    it("establishes snapshot intent through every ordinary active persistence path", async () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore({ savedProfiles: [buildSavedProfile()] });
      const expectActiveSnapshotAfterClear = async (operation: () => unknown) => {
        await store.clearLocalData();
        operation();
        expect(store.getDesiredDurableCondition()).toEqual({
          activeState: "snapshot",
          profiles: "absent",
        });
      };

      await expectActiveSnapshotAfterClear(() =>
        store.commitAuthoredSetup({
          schedulingPreferences: store.getState().schedulingPreferences,
          previewRange: store.getState().previewRange,
          shiftDefinitions: [],
          shiftCycles: [],
          blockTemplates: [],
          blockRecurrences: [],
        }),
      );
      await expectActiveSnapshotAfterClear(() =>
        store.setPreviewRange({
          preset: "oneWeek",
          startDate: "2026-05-04",
          endDate: "2026-05-11",
        }),
      );
      await expectActiveSnapshotAfterClear(() =>
        store.setShiftDefinitions(buildShiftDefinitions()),
      );
      await expectActiveSnapshotAfterClear(() => store.setShiftCycles([]));
      await expectActiveSnapshotAfterClear(() => store.setBlockTemplates(buildBlockTemplates()));
      await expectActiveSnapshotAfterClear(() => store.setBlockRecurrences([]));
      await expectActiveSnapshotAfterClear(() => store.setManualEvents([]));
    });

    it("replaces profile absence with snapshot intent on save failure and ordinary delete", async () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();

      await store.clearLocalData();
      localStorage.setItem = vi.fn((key: string) => {
        if (key === DAYFRAME_PROFILES_V2_STORAGE_KEY) {
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

      await store.clearLocalData();
      const deleteResult = store.deleteProfile("missing_after_clear");

      expect(deleteResult.state.savedProfiles).toEqual([]);
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "absent",
        profiles: "snapshot",
      });
    });

    it("treats profile load and backup import as active snapshot intent only", async () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore({ savedProfiles: [buildSavedProfile()] });

      store.loadProfile("profile_outcome");

      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "snapshot",
      });

      await store.clearLocalData();
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
      [true, true, "partiallyCleared", "storageFailure", "storageFailure"],
    ] as const)(
      "retains absence for clear failures active=%s profiles=%s",
      async (activeFailure, profileFailure, aggregate, activeStatus, profileStatus) => {
        const localStorage = createLocalStorageMock();

        localStorage.removeItem = vi.fn((key: string) => {
          if (
            (key === DAYFRAME_ACTIVE_V2_STORAGE_KEY && activeFailure) ||
            (key === DAYFRAME_PROFILES_STORAGE_KEY && profileFailure)
          ) {
            throw new RangeError("Injected removal failure");
          }
        });
        installLocalStorageMock(localStorage);

        const store = createReadyDayFrameTestStore();
        const result = await store.clearLocalData();

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

    it("lets clear replace snapshot intent for both surfaces", async () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();

      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      store.saveProfile({ name: "Profile A", savedAt: "2026-05-05T09:00:00-05:00" });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "snapshot",
        profiles: "snapshot",
      });

      const result = await store.clearLocalData();

      expect(result).toMatchObject({
        state: createInitialDayFrameState(),
        activeState: { status: "removed" },
        profiles: { status: "removed" },
        planDecisions: { status: "removed" },
        executionHistory: { status: "removed" },
        historicalPlan: { status: "removed" },
        durability: "cleared",
      });
      expect(store.getDesiredDurableCondition()).toEqual({
        activeState: "absent",
        profiles: "absent",
      });
    });

    it("does not change intent for reads, backup export, or Preview-only operations", async () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore({
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

      await store.clearLocalData();
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

    it("preserves intent when a storage-accessor failure is normalized", async () => {
      const localStorage = createLocalStorageMock();

      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();
      const listener = vi.fn();

      store.subscribe(listener);
      await store.clearLocalData();
      installThrowingLocalStorageAccessor();

      const result = store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" });
      expectApplied(result);

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

  describe("active local historical ingress protection", () => {
    it("distinguishes a missing key from unavailable storage", () => {
      const localStorage = createLocalStorageMock();
      installLocalStorageMock(localStorage);

      expect(createReadyDayFrameTestStore().getActiveLocalIngressStatus()).toEqual({
        status: "noSource",
        reason: "missing",
      });

      delete (globalThis as { localStorage?: unknown }).localStorage;

      expect(createReadyDayFrameTestStore().getActiveLocalIngressStatus()).toEqual({
        status: "noSource",
        reason: "storageUnavailable",
      });
    });

    it("activates valid current and advisory-only persisted checkpoints", () => {
      const localStorage = createLocalStorageMock();
      const validData = buildValidHistoricalAuthoredSetup();
      localStorage.setItem(DAYFRAME_STORAGE_KEY, JSON.stringify(validData));
      installLocalStorageMock(localStorage);

      const validStore = createReadyDayFrameTestStore();

      expect(validStore.getActiveLocalIngressStatus()).toEqual({
        status: "accepted",
        advisories: [],
      });
      expect(currentPattern(validStore.getState()).shiftCycles).toEqual(validData.shiftCycles);

      validData.blockRecurrences = [
        {
          id: "rec_advisory",
          blockTemplateId: validData.blockTemplates[0]!.id,
          frequency: "perShiftSegment",
        },
      ];
      localStorage.removeItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY);
      localStorage.removeItem(DAYFRAME_ACTIVE_V2_ESTABLISHED_KEY);
      localStorage.setItem(DAYFRAME_STORAGE_KEY, JSON.stringify(validData));

      const advisoryStore = createReadyDayFrameTestStore();

      expect(advisoryStore.getActiveLocalIngressStatus()).toMatchObject({
        status: "accepted",
        advisories: [expect.objectContaining({ code: "unsupportedRecurrenceFrequency" })],
      });
      expect(
        advisoryStore.setSchedulingPreferences({ dayBoundaryStartTime: "04:00" }),
      ).toMatchObject({ status: "applied", persistence: { status: "persisted" } });
    });

    it.each([
      [
        "semantic-invalid",
        () => {
          const data = buildValidHistoricalAuthoredSetup();
          data.shiftDefinitions = [];
          return JSON.stringify(data);
        },
      ],
      [
        "ambiguous",
        () => {
          const data = buildValidHistoricalAuthoredSetup();
          const template = data.blockTemplates[0]!;
          data.blockTemplates = [template, { ...template }];
          data.blockRecurrences = [
            { id: "rec_ambiguous", blockTemplateId: template.id, frequency: "daily" },
          ];
          return JSON.stringify(data);
        },
      ],
    ])("blocks %s authored checkpoints and retains validation evidence", (_label, buildRaw) => {
      const localStorage = createLocalStorageMock();
      const raw = buildRaw();
      localStorage.setItem(DAYFRAME_STORAGE_KEY, raw);
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();
      const status = store.getActiveLocalIngressStatus();

      expect(store.getState()).toEqual(createInitialDayFrameState());
      expect(status).toMatchObject({
        status: "recoveryRequired",
        reason: "invalidAuthoredState",
        activationBlocked: true,
        sourceReadable: true,
        sourcePreserved: true,
        validation: { status: "invalid" },
      });
      expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(raw);
    });

    it.each([
      ["malformed JSON", "{", "corruptJson"],
      ["structurally invalid JSON", '{"shiftDefinitions":{}}', "structurallyInvalid"],
    ] as const)("uses protected fallback for %s", (_label, raw, reason) => {
      const localStorage = createLocalStorageMock();
      localStorage.setItem(DAYFRAME_STORAGE_KEY, raw);
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();

      expect(store.getState()).toEqual(createInitialDayFrameState());
      expect(store.getActiveLocalIngressStatus()).toMatchObject({
        status: "recoveryRequired",
        reason,
        sourceReadable: true,
        sourcePreserved: true,
      });
      expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(raw);
    });

    it("protects against getItem failure conservatively", () => {
      const localStorage = createLocalStorageMock();
      localStorage.getItem = vi.fn(() => {
        throw new RangeError("Injected read failure");
      });
      installLocalStorageMock(localStorage);

      const store = createReadyDayFrameTestStore();

      expect(store.getActiveLocalIngressStatus()).toMatchObject({
        status: "recoveryRequired",
        reason: "readFailure",
        sourceReadable: false,
        sourcePreserved: false,
      });
      expect(store.retryActivePersistence()).toEqual({
        status: "notAttempted",
        reason: "recoveryProtected",
      });
    });

    it("preserves exact bytes through runtime mutation, retry, and Preview generation", () => {
      const localStorage = createLocalStorageMock();
      const raw = "{ invalid historical checkpoint";
      localStorage.setItem(DAYFRAME_STORAGE_KEY, raw);
      installLocalStorageMock(localStorage);
      const setItem = vi.spyOn(localStorage, "setItem");
      const store = createReadyDayFrameTestStore();
      const ingressListener = vi.fn();
      const durabilityListener = vi.fn();
      store.subscribeActiveLocalIngress(ingressListener);
      store.subscribeDurability(durabilityListener);
      const valid = buildValidHistoricalAuthoredSetup();

      const mutation = store.commitAuthoredSetup({
        schedulingPreferences: valid.schedulingPreferences,
        previewRange: valid.previewRange,
        shiftDefinitions: valid.shiftDefinitions,
        shiftCycles: valid.shiftCycles,
        blockTemplates: valid.blockTemplates,
        blockRecurrences: valid.blockRecurrences,
      });
      expectApplied(mutation);
      expect(mutation.persistence).toEqual({
        status: "blocked",
        reason: "activeLocalRecovery",
      });
      expect(currentPattern(store.getState()).shiftDefinitions).toEqual(valid.shiftDefinitions);
      expect(store.getDurabilityStatus()).toEqual({ activeState: "unknown", profiles: "unknown" });
      expect(store.getDesiredDurableCondition().activeState).toBe("snapshot");
      expect(store.retryActivePersistence()).toEqual({
        status: "notAttempted",
        reason: "recoveryProtected",
      });

      store.generatePreview({
        rangeStartDate: "2026-05-04",
        rangeEndDate: "2026-05-05",
        planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
        planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
        generatedAt: "2026-05-03T13:00:00-05:00",
      });

      expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(raw);
      expect(setItem).not.toHaveBeenCalled();
      expect(store.getActiveLocalIngressStatus().status).toBe("recoveryRequired");
      expect(ingressListener).not.toHaveBeenCalled();
      expect(durabilityListener).not.toHaveBeenCalled();
    });

    it("keeps profile persistence independent and guards profile/backup active replacement", () => {
      const localStorage = createLocalStorageMock();
      const raw = "{";
      localStorage.setItem(DAYFRAME_STORAGE_KEY, raw);
      installLocalStorageMock(localStorage);
      const profile = buildSavedProfile({
        ...createInitialDayFrameState(),
        ...buildValidHistoricalAuthoredSetup(),
      });
      const store = createReadyDayFrameTestStore({ savedProfiles: [profile] });

      const saved = store.saveProfile({
        name: "Fallback Session",
        savedAt: "2026-05-05T09:00:00-05:00",
      });
      expect(saved.persistence).toEqual({ status: "persisted" });
      expect(localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY)).not.toBeNull();

      const loaded = store.loadProfile(profile.id);
      expectProfileLoaded(loaded);
      expect(loaded.persistence).toEqual({
        status: "blocked",
        reason: "activeLocalRecovery",
      });

      const imported = store.importBackup(
        createDayFrameBackup(profile.data, "2026-05-05T10:00:00-05:00"),
      );
      expect(imported).toEqual({ status: "rejected", reason: "activeLocalRecovery" });
      expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(raw);
      expect(store.getActiveLocalIngressStatus().status).toBe("recoveryRequired");
    });

    it("guards active removal while preserving explicit profile removal", async () => {
      const localStorage = createLocalStorageMock();
      const raw = "invalid";
      localStorage.setItem(DAYFRAME_STORAGE_KEY, raw);
      installLocalStorageMock(localStorage);
      const store = createReadyDayFrameTestStore();
      store.saveProfile({ name: "Profile", savedAt: "2026-05-05T09:00:00-05:00" });

      const result = await store.clearLocalData();

      expect(result.activeState).toEqual({
        status: "blocked",
        reason: "activeLocalRecovery",
      });
      expect(result.profiles).toEqual({ status: "removed" });
      expect(result.durability).toBe("partiallyCleared");
      expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(raw);
      expect(localStorage.getItem(DAYFRAME_PROFILES_STORAGE_KEY)).toBeNull();
      expect(store.getActiveLocalIngressStatus().status).toBe("recoveryRequired");
    });

    describe("explicit active-local recovery", () => {
      it("replaces the protected checkpoint with the latest current session", () => {
        const localStorage = createLocalStorageMock();
        const raw = "{ protected checkpoint";
        localStorage.setItem(DAYFRAME_STORAGE_KEY, raw);
        installLocalStorageMock(localStorage);
        const setItem = vi.spyOn(localStorage, "setItem");
        const store = createReadyDayFrameTestStore();
        const valid = buildValidHistoricalAuthoredSetup();
        const mutation = store.commitAuthoredSetup(valid);
        expectApplied(mutation);
        store.generatePreview({
          rangeStartDate: "2026-05-04",
          rangeEndDate: "2026-05-05",
          planningWindowStart: new Date(2026, 4, 4),
          planningWindowEnd: new Date(2026, 4, 6),
          generatedAt: "2026-05-03T13:00:00-05:00",
        });
        const stateBefore = store.getState();
        const stateListener = vi.fn();
        const ingressListener = vi.fn();
        const durabilityListener = vi.fn();
        store.subscribe(stateListener);
        store.subscribeActiveLocalIngress(ingressListener);
        store.subscribeDurability(durabilityListener);

        const result = store.replaceProtectedActiveCheckpointWithCurrentState();

        expect(result).toMatchObject({
          status: "resolved",
          resolution: "replaceWithCurrentState",
          persistence: { status: "persisted" },
          ingress: { status: "accepted", advisories: [] },
        });
        expect(setItem).toHaveBeenCalledWith(DAYFRAME_ACTIVE_V2_STORAGE_KEY, expect.any(String));
        expect(readActiveV2Data(localStorage)).toEqual(currentActiveSetup(store.getState()));
        expect(store.getState()).toEqual(stateBefore);
        expect(stateListener).not.toHaveBeenCalled();
        expect(durabilityListener).toHaveBeenCalledTimes(1);
        expect(ingressListener).toHaveBeenCalledTimes(1);
        expect(store.getDesiredDurableCondition().activeState).toBe("snapshot");
        expect(store.getDurabilityStatus().activeState).toBe("durable");
        expect(store.retryActivePersistence()).toEqual({
          status: "notAttempted",
          reason: "alreadyDurable",
        });
        expect(store.setPreviewRange(valid.previewRange)).toMatchObject({
          status: "applied",
          persistence: { status: "persisted" },
        });
      });

      it("retains advisory validation in accepted ingress after replacement", () => {
        const localStorage = createLocalStorageMock();
        localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
        installLocalStorageMock(localStorage);
        const valid = buildValidHistoricalAuthoredSetup();
        valid.blockRecurrences = [
          {
            id: "rec_advisory_recovery",
            blockTemplateId: valid.blockTemplates[0]!.id,
            frequency: "perShiftSegment",
          },
        ];
        const store = createReadyDayFrameTestStore(valid);

        const result = store.replaceProtectedActiveCheckpointWithCurrentState();

        expect(result.status).toBe("resolved");
        expect(store.getActiveLocalIngressStatus()).toMatchObject({
          status: "accepted",
          advisories: [expect.objectContaining({ code: "unsupportedRecurrenceFrequency" })],
        });
      });

      it("rejects an invalid current replacement before reading or writing storage", () => {
        const localStorage = createLocalStorageMock();
        localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
        installLocalStorageMock(localStorage);
        const invalid = buildValidHistoricalAuthoredSetup();
        invalid.shiftDefinitions = [];
        const store = createReadyDayFrameTestStore(invalid);
        const getItem = vi.spyOn(localStorage, "getItem");
        const setItem = vi.spyOn(localStorage, "setItem");

        const result = store.replaceProtectedActiveCheckpointWithCurrentState();

        expect(result).toMatchObject({
          status: "notAttempted",
          reason: "invalidReplacement",
          validation: { status: "invalid" },
        });
        expect(getItem).not.toHaveBeenCalled();
        expect(setItem).not.toHaveBeenCalled();
        expect(store.getDurabilityStatus().activeState).toBe("unknown");
      });

      it.each(["replace", "abandon"] as const)(
        "rejects %s when the protected source changed externally",
        (command) => {
          const localStorage = createLocalStorageMock();
          localStorage.setItem(DAYFRAME_STORAGE_KEY, "payload A");
          installLocalStorageMock(localStorage);
          const store = createReadyDayFrameTestStore();
          localStorage.setItem(DAYFRAME_STORAGE_KEY, "payload B");
          const setItem = vi.spyOn(localStorage, "setItem");
          const removeItem = vi.spyOn(localStorage, "removeItem");

          const result =
            command === "replace"
              ? store.replaceProtectedActiveCheckpointWithCurrentState()
              : store.abandonProtectedActiveCheckpointAndReset();

          expect(result).toEqual({ status: "notAttempted", reason: "sourceChanged" });
          expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe("payload B");
          expect(setItem).not.toHaveBeenCalled();
          expect(removeItem).not.toHaveBeenCalled();
          expect(store.getActiveLocalIngressStatus().status).toBe("recoveryRequired");
          expect(store.getDurabilityStatus().activeState).toBe("unknown");
        },
      );

      it("rejects unreadable source recheck without changing infrastructure truth", () => {
        const localStorage = createLocalStorageMock();
        localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
        installLocalStorageMock(localStorage);
        const store = createReadyDayFrameTestStore();
        localStorage.getItem = vi.fn(() => {
          throw new RangeError("Injected recovery read failure");
        });

        expect(store.replaceProtectedActiveCheckpointWithCurrentState()).toEqual({
          status: "notAttempted",
          reason: "sourceUnreadable",
        });
        expect(store.getDurabilityStatus().activeState).toBe("unknown");
        expect(store.getActiveLocalIngressStatus().status).toBe("recoveryRequired");
      });

      it("requires renewed authority when an initially unreadable source becomes readable", () => {
        const localStorage = createLocalStorageMock();
        localStorage.setItem(DAYFRAME_STORAGE_KEY, "newly readable payload");
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = vi
          .fn()
          .mockImplementationOnce(() => {
            throw new RangeError("Injected startup read failure");
          })
          .mockImplementation(originalGetItem);
        installLocalStorageMock(localStorage);
        const store = createReadyDayFrameTestStore();
        const setItem = vi.spyOn(localStorage, "setItem");

        expect(store.replaceProtectedActiveCheckpointWithCurrentState()).toEqual({
          status: "notAttempted",
          reason: "sourceChanged",
        });
        expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe("newly readable payload");
        expect(setItem).not.toHaveBeenCalled();
      });

      it("retains protection and explicit snapshot intent after replacement write failure", () => {
        const localStorage = createLocalStorageMock();
        const raw = "{";
        localStorage.setItem(DAYFRAME_STORAGE_KEY, raw);
        installLocalStorageMock(localStorage);
        const store = createReadyDayFrameTestStore();
        localStorage.setItem = vi.fn(() => {
          throw new RangeError("Injected recovery write failure");
        });

        expect(store.replaceProtectedActiveCheckpointWithCurrentState()).toEqual({
          status: "notResolved",
          resolution: "replaceWithCurrentState",
          persistence: { status: "storageFailure" },
        });
        expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(raw);
        expect(store.getDesiredDurableCondition().activeState).toBe("snapshot");
        expect(store.getDurabilityStatus().activeState).toBe("storageFailure");
        expect(store.retryActivePersistence()).toEqual({
          status: "notAttempted",
          reason: "recoveryProtected",
        });
      });

      it.each(["replace", "abandon"] as const)(
        "reports unavailable when storage disappears after the %s source recheck",
        (command) => {
          const localStorage = createLocalStorageMock();
          const raw = "{";
          localStorage.setItem(DAYFRAME_STORAGE_KEY, raw);
          installLocalStorageMock(localStorage);
          const store = createReadyDayFrameTestStore();
          let accessCount = 0;
          Object.defineProperty(globalThis, "localStorage", {
            configurable: true,
            get() {
              accessCount += 1;
              return accessCount === 1 ? localStorage : undefined;
            },
          });

          const result =
            command === "replace"
              ? store.replaceProtectedActiveCheckpointWithCurrentState()
              : store.abandonProtectedActiveCheckpointAndReset();

          expect(result).toMatchObject({
            status: "notResolved",
            resolution: command === "replace" ? "replaceWithCurrentState" : "abandonAndReset",
            persistence: { status: "unavailable" },
          });
          expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(raw);
          expect(store.getDurabilityStatus().activeState).toBe("unavailable");
          expect(store.getActiveLocalIngressStatus().status).toBe("recoveryRequired");
        },
      );

      it("reports replacement serialization failure without writing the checkpoint", () => {
        const localStorage = createLocalStorageMock();
        const raw = "{";
        localStorage.setItem(DAYFRAME_STORAGE_KEY, raw);
        installLocalStorageMock(localStorage);
        const store = createReadyDayFrameTestStore({
          schedulingPreferences: {
            ...createInitialDayFrameState().schedulingPreferences,
            unsafeValue: 1n,
          } as DayFrameState["schedulingPreferences"],
        });
        const setItem = vi.spyOn(localStorage, "setItem");

        expect(store.replaceProtectedActiveCheckpointWithCurrentState()).toEqual({
          status: "notResolved",
          resolution: "replaceWithCurrentState",
          persistence: { status: "serializationFailure" },
        });
        expect(setItem).not.toHaveBeenCalled();
        expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(raw);
        expect(store.getDurabilityStatus().activeState).toBe("serializationFailure");
      });

      it("abandons only the active checkpoint and resets runtime after removal succeeds", () => {
        const localStorage = createLocalStorageMock();
        localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
        localStorage.setItem(DAYFRAME_PROFILES_STORAGE_KEY, "preserved profiles");
        installLocalStorageMock(localStorage);
        const profile = buildSavedProfile({
          ...createInitialDayFrameState(),
          ...buildValidHistoricalAuthoredSetup(),
        });
        const store = createReadyDayFrameTestStore({
          ...buildValidHistoricalAuthoredSetup(),
          savedProfiles: [profile],
        });
        store.generatePreview({
          rangeStartDate: "2026-05-04",
          rangeEndDate: "2026-05-05",
          planningWindowStart: new Date(2026, 4, 4),
          planningWindowEnd: new Date(2026, 4, 6),
          generatedAt: "2026-05-03T13:00:00-05:00",
        });
        const removeItem = vi.spyOn(localStorage, "removeItem");
        const stateListener = vi.fn();
        const ingressListener = vi.fn();
        store.subscribe(stateListener);
        store.subscribeActiveLocalIngress(ingressListener);
        const profileDurabilityBefore = store.getDurabilityStatus().profiles;

        const result = store.abandonProtectedActiveCheckpointAndReset();

        expect(result).toMatchObject({
          status: "resolved",
          resolution: "abandonAndReset",
          persistence: { status: "removed" },
          ingress: { status: "noSource", reason: "resolvedByAbandonment" },
        });
        expect(removeItem).toHaveBeenCalledWith(DAYFRAME_ACTIVE_V2_STORAGE_KEY);
        expect(removeItem).toHaveBeenCalledWith(DAYFRAME_STORAGE_KEY);
        expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBeNull();
        expect(localStorage.getItem(DAYFRAME_PROFILES_STORAGE_KEY)).toBe("preserved profiles");
        expect(store.getState()).toEqual({
          ...createInitialDayFrameState(),
          savedProfiles: [profile],
        });
        expect(stateListener).toHaveBeenCalledTimes(1);
        expect(ingressListener).toHaveBeenCalledTimes(1);
        expect(store.getDesiredDurableCondition().activeState).toBe("absent");
        expect(store.getDurabilityStatus()).toEqual({
          activeState: "durable",
          profiles: profileDurabilityBefore,
        });
        expect(
          store.setPreviewRange(buildValidHistoricalAuthoredSetup().previewRange),
        ).toMatchObject({
          status: "applied",
          persistence: { status: "persisted" },
        });
      });

      it("does not reset runtime or profiles when abandonment removal fails", () => {
        const localStorage = createLocalStorageMock();
        const raw = "{";
        localStorage.setItem(DAYFRAME_STORAGE_KEY, raw);
        installLocalStorageMock(localStorage);
        const profile = buildSavedProfile({
          ...createInitialDayFrameState(),
          ...buildValidHistoricalAuthoredSetup(),
        });
        const store = createReadyDayFrameTestStore({
          ...buildValidHistoricalAuthoredSetup(),
          savedProfiles: [profile],
        });
        const stateBefore = store.getState();
        const stateListener = vi.fn();
        store.subscribe(stateListener);
        localStorage.removeItem = vi.fn(() => {
          throw new RangeError("Injected recovery removal failure");
        });

        expect(store.abandonProtectedActiveCheckpointAndReset()).toEqual({
          status: "notResolved",
          resolution: "abandonAndReset",
          persistence: { status: "storageFailure" },
        });
        expect(store.getState()).toEqual(stateBefore);
        expect(stateListener).not.toHaveBeenCalled();
        expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(raw);
        expect(store.getDesiredDurableCondition().activeState).toBe("absent");
        expect(store.getDurabilityStatus().activeState).toBe("storageFailure");
        expect(store.retryActivePersistence()).toEqual({
          status: "notAttempted",
          reason: "recoveryProtected",
        });
      });

      it("is a storage-free no-op for healthy stores and after successful resolution", () => {
        const localStorage = createLocalStorageMock();
        installLocalStorageMock(localStorage);
        const healthy = createReadyDayFrameTestStore();
        const getItem = vi.spyOn(localStorage, "getItem");
        const setItem = vi.spyOn(localStorage, "setItem");
        const removeItem = vi.spyOn(localStorage, "removeItem");

        expect(healthy.replaceProtectedActiveCheckpointWithCurrentState()).toEqual({
          status: "notAttempted",
          reason: "notRecoveryRequired",
        });
        expect(healthy.abandonProtectedActiveCheckpointAndReset()).toEqual({
          status: "notAttempted",
          reason: "notRecoveryRequired",
        });
        expect(getItem).not.toHaveBeenCalled();
        expect(setItem).not.toHaveBeenCalled();
        expect(removeItem).not.toHaveBeenCalled();

        localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
        const protectedStore = createReadyDayFrameTestStore();
        expect(protectedStore.replaceProtectedActiveCheckpointWithCurrentState().status).toBe(
          "resolved",
        );
        setItem.mockClear();
        removeItem.mockClear();
        expect(protectedStore.abandonProtectedActiveCheckpointAndReset()).toEqual({
          status: "notAttempted",
          reason: "notRecoveryRequired",
        });
        expect(setItem).not.toHaveBeenCalled();
        expect(removeItem).not.toHaveBeenCalled();
      });

      it.each(["profile", "backup"] as const)(
        "promotes the latest session prepared from a %s without source-specific recovery",
        (source) => {
          const localStorage = createLocalStorageMock();
          localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
          installLocalStorageMock(localStorage);
          const recovered = buildValidHistoricalAuthoredSetup();
          recovered.schedulingPreferences.dayBoundaryStartTime = "04:30";
          const profile = buildSavedProfile({
            ...createInitialDayFrameState(),
            ...recovered,
          });
          const store = createReadyDayFrameTestStore({ savedProfiles: [profile] });

          if (source === "profile") {
            expectProfileLoaded(store.loadProfile(profile.id));
          } else {
            expect(
              store.importBackup(createDayFrameBackup(recovered, "2026-05-05T10:00:00-05:00")),
            ).toEqual({ status: "rejected", reason: "activeLocalRecovery" });
          }

          const mutation = store.setSchedulingPreferences({ dayBoundaryStartTime: "05:15" });
          expectApplied(mutation);
          expect(mutation.persistence).toEqual({
            status: "blocked",
            reason: "activeLocalRecovery",
          });
          expect(store.replaceProtectedActiveCheckpointWithCurrentState().status).toBe("resolved");
          expect(readActiveV2Data(localStorage).schedulingPreferences).toMatchObject({
            dayBoundaryStartTime: "05:15",
          });
        },
      );
    });
  });

  describe("profile and backup semantic ingress", () => {
    it("rejects a semantic-invalid selected profile without any active-session effect", () => {
      const localStorage = createLocalStorageMock();
      const invalidProfile = buildSavedProfile();
      invalidProfile.data.blockRecurrences = [
        { id: "rec_orphan", blockTemplateId: "missing_template", frequency: "daily" },
      ];
      localStorage.setItem(DAYFRAME_STORAGE_KEY, "preserved-active-checkpoint");
      installLocalStorageMock(localStorage);
      const setItem = vi.spyOn(localStorage, "setItem");
      const store = createReadyDayFrameTestStore({
        ...buildValidHistoricalAuthoredSetup(),
        savedProfiles: [invalidProfile],
      });
      store.generatePreview({
        rangeStartDate: "2026-05-04",
        rangeEndDate: "2026-05-05",
        planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
        planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
        generatedAt: "2026-05-03T13:00:00-05:00",
      });
      const beforeState = store.getState();
      const beforeDurability = store.getDurabilityStatus();
      const beforeDesired = store.getDesiredDurableCondition();
      const stateListener = vi.fn();
      const durabilityListener = vi.fn();
      store.subscribe(stateListener);
      store.subscribeDurability(durabilityListener);

      const result = store.loadProfile(invalidProfile.id);

      expect(result).toMatchObject({
        status: "recoveryRequired",
        reason: "invalidAuthoredState",
        validation: { status: "invalid" },
      });
      expect(store.getState()).toEqual(beforeState);
      expect(store.getState().savedProfiles).toEqual([invalidProfile]);
      expect(store.getDurabilityStatus()).toEqual(beforeDurability);
      expect(store.getDesiredDurableCondition()).toEqual(beforeDesired);
      expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe("preserved-active-checkpoint");
      expect(setItem).not.toHaveBeenCalled();
      expect(stateListener).not.toHaveBeenCalled();
      expect(durabilityListener).not.toHaveBeenCalled();
    });

    it("rejects ambiguous duplicate profile referents with validator evidence", () => {
      const profile = buildSavedProfile();
      const template = buildBlockTemplates()[0]!;
      profile.data.blockTemplates = [template, { ...template }];
      profile.data.blockRecurrences = [
        { id: "rec_ambiguous", blockTemplateId: template.id, frequency: "daily" },
      ];
      const store = createReadyDayFrameTestStore({ savedProfiles: [profile] });

      const result = store.loadProfile(profile.id);

      expect(result.status).toBe("recoveryRequired");
      if (result.status === "recoveryRequired") {
        expect(result.validation.issues).toEqual(
          expect.arrayContaining([expect.objectContaining({ code: "duplicateSourceId" })]),
        );
      }
    });

    it("loads advisory-only profile data and returns the advisory unchanged", () => {
      const profile = buildSavedProfile();
      profile.data = buildValidHistoricalAuthoredSetup();
      profile.data.blockRecurrences = [
        {
          id: "rec_advisory",
          blockTemplateId: profile.data.blockTemplates[0]!.id,
          frequency: "perShiftSegment",
        },
      ];
      const store = createReadyDayFrameTestStore({ savedProfiles: [profile] });

      const result = store.loadProfile(profile.id);
      expectProfileLoaded(result);

      expect(result.advisories).toEqual([
        expect.objectContaining({ code: "unsupportedRecurrenceFrequency" }),
      ]);
      expect(currentPattern(result.state).blockRecurrences).toEqual(profile.data.blockRecurrences);
    });

    it("rejects a semantic-invalid backup atomically and leaves its artifact untouched", () => {
      const localStorage = createLocalStorageMock();
      localStorage.setItem(DAYFRAME_STORAGE_KEY, "preserved-active-checkpoint");
      installLocalStorageMock(localStorage);
      const setItem = vi.spyOn(localStorage, "setItem");
      const store = createReadyDayFrameTestStore(buildValidHistoricalAuthoredSetup());
      store.generatePreview({
        rangeStartDate: "2026-05-04",
        rangeEndDate: "2026-05-05",
        planningWindowStart: new Date(2026, 4, 4, 0, 0, 0, 0),
        planningWindowEnd: new Date(2026, 4, 5, 23, 59, 0, 0),
        generatedAt: "2026-05-03T13:00:00-05:00",
      });
      const invalidData = buildValidHistoricalAuthoredSetup();
      invalidData.shiftDefinitions = [];
      const backup = createDayFrameBackup(invalidData, "2026-05-05T10:00:00-05:00");
      const artifactBefore = JSON.stringify(backup);
      const beforeState = store.getState();
      const beforeDurability = store.getDurabilityStatus();
      const beforeDesired = store.getDesiredDurableCondition();
      const stateListener = vi.fn();
      const durabilityListener = vi.fn();
      store.subscribe(stateListener);
      store.subscribeDurability(durabilityListener);

      const result = store.importBackup(backup);

      expect(result).toEqual({ status: "rejected", reason: "authoredValidationFailure" });
      expect(store.getState()).toEqual(beforeState);
      expect(store.getDurabilityStatus()).toEqual(beforeDurability);
      expect(store.getDesiredDurableCondition()).toEqual(beforeDesired);
      expect(JSON.stringify(backup)).toBe(artifactBefore);
      expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe("preserved-active-checkpoint");
      expect(setItem).not.toHaveBeenCalled();
      expect(stateListener).not.toHaveBeenCalled();
      expect(durabilityListener).not.toHaveBeenCalled();
    });

    it("rejects ambiguous duplicate backup referents without partial import", () => {
      const data = buildValidHistoricalAuthoredSetup();
      const template = data.blockTemplates[0]!;
      data.blockTemplates = [template, { ...template }];
      data.blockRecurrences = [
        { id: "rec_ambiguous", blockTemplateId: template.id, frequency: "daily" },
      ];
      const store = createReadyDayFrameTestStore();

      const result = store.importBackup(createDayFrameBackup(data, "2026-05-05T10:00:00-05:00"));

      expect(result).toEqual({ status: "rejected", reason: "authoredValidationFailure" });
      expect(store.getState()).toEqual(createInitialDayFrameState());
    });

    it("imports advisory-only backup data and returns the advisory unchanged", () => {
      const data = buildValidHistoricalAuthoredSetup();
      data.blockRecurrences = [
        {
          id: "rec_advisory",
          blockTemplateId: data.blockTemplates[0]!.id,
          frequency: "custom",
        },
      ];
      const store = createReadyDayFrameTestStore();

      const result = store.importBackup(createDayFrameBackup(data, "2026-05-05T10:00:00-05:00"));
      expectBackupImported(result);

      expect(result.advisories).toEqual([
        expect.objectContaining({ code: "unsupportedRecurrenceFrequency" }),
      ]);
      expect(currentPattern(result.state).blockRecurrences).toEqual(data.blockRecurrences);
    });
  });
});

describe("Profile V2 reusable-pattern persistence", () => {
  it("migrates V1 only after verified V2 persistence and retains the V1 source", () => {
    const localStorage = createLocalStorageMock();
    const legacy = {
      app: "DayFrame",
      version: 1,
      profiles: [buildSavedProfile(buildValidHistoricalAuthoredSetup())],
    };
    localStorage.setItem(DAYFRAME_PROFILES_STORAGE_KEY, JSON.stringify(legacy));
    installLocalStorageMock(localStorage);

    const store = createReadyDayFrameTestStore();
    const v2 = JSON.parse(localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY) ?? "null") as {
      surface: string;
      version: number;
      profiles: DayFrameSavedProfile[];
      quarantinedProfiles: unknown[];
    };

    expect(store.getProfileIngressStatus()).toEqual({
      status: "accepted",
      quarantinedEntryCount: 0,
    });
    expect(v2).toMatchObject({ surface: "profiles", version: 2, quarantinedProfiles: [] });
    expect(v2.profiles[0]?.data).not.toHaveProperty("incarnationId");
    expect(JSON.parse(localStorage.getItem(DAYFRAME_PROFILES_STORAGE_KEY) ?? "null")).toEqual(
      legacy,
    );
  });

  it("protects corrupt V2 without falling back to a valid V1 collection", () => {
    const localStorage = createLocalStorageMock();
    localStorage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, "{");
    localStorage.setItem(
      DAYFRAME_PROFILES_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        version: 1,
        profiles: [buildSavedProfile()],
      }),
    );
    installLocalStorageMock(localStorage);

    const store = createReadyDayFrameTestStore();

    expect(store.getState().savedProfiles).toEqual([]);
    expect(store.getProfileIngressStatus()).toEqual({
      status: "recoveryRequired",
      reason: "invalidV2",
      sourcePreserved: true,
    });
    expect(localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY)).toBe("{");
  });

  it("does not expose migrated profiles when V2 migration serialization fails", () => {
    const localStorage = createLocalStorageMock();
    localStorage.setItem(
      DAYFRAME_PROFILES_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        version: 1,
        profiles: [buildSavedProfile()],
      }),
    );
    installLocalStorageMock(localStorage);

    const store = createReadyDayFrameTestStore(undefined, {
      serializeProfilesV2: () => {
        throw new RangeError("injected");
      },
    });

    expect(store.getState().savedProfiles).toEqual([]);
    expect(store.getProfileIngressStatus()).toMatchObject({
      status: "recoveryRequired",
      reason: "migrationFailure",
      failureDetail: "serializationFailure",
      sourcePreserved: true,
    });
    expect(localStorage.getItem(DAYFRAME_PROFILES_STORAGE_KEY)).not.toBeNull();
    expect(localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY)).toBeNull();
  });

  it.each([
    ["writeFailure", "throw-write"],
    ["rereadFailure", "throw-reread"],
    ["rereadValidationFailure", "invalid-reread"],
    ["verificationFailure", "different-valid-reread"],
  ] as const)("protects V1 when migration ends in %s", (failureDetail, mode) => {
    const localStorage = createLocalStorageMock();
    const originalGet = localStorage.getItem.bind(localStorage);
    const originalSet = localStorage.setItem.bind(localStorage);
    localStorage.setItem(
      DAYFRAME_PROFILES_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        version: 1,
        profiles: [buildSavedProfile()],
      }),
    );
    let wroteV2 = false;
    localStorage.setItem = (key, value) => {
      if (key !== DAYFRAME_PROFILES_V2_STORAGE_KEY) return originalSet(key, value);
      if (mode === "throw-write") throw new RangeError("injected write failure");
      wroteV2 = true;
      if (mode === "invalid-reread") return originalSet(key, "{");
      if (mode === "different-valid-reread") {
        return originalSet(key, JSON.stringify(JSON.parse(value), null, 2));
      }
      originalSet(key, value);
    };
    localStorage.getItem = (key) => {
      if (key === DAYFRAME_PROFILES_V2_STORAGE_KEY && wroteV2 && mode === "throw-reread") {
        throw new RangeError("injected reread failure");
      }
      return originalGet(key);
    };
    installLocalStorageMock(localStorage);

    const store = createReadyDayFrameTestStore();

    expect(store.getState().savedProfiles).toEqual([]);
    expect(store.getProfileIngressStatus()).toMatchObject({
      status: "recoveryRequired",
      reason: "migrationFailure",
      failureDetail,
      sourcePreserved: true,
    });
    expect(originalGet(DAYFRAME_PROFILES_STORAGE_KEY)).not.toBeNull();
  });

  it("prevents cleared V1 profiles from resurrecting after Profile V2 authority was established", async () => {
    const localStorage = createLocalStorageMock();
    localStorage.setItem(
      DAYFRAME_PROFILES_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        version: 1,
        profiles: [buildSavedProfile()],
      }),
    );
    installLocalStorageMock(localStorage);
    const store = createReadyDayFrameTestStore();

    expect(store.getState().savedProfiles).toHaveLength(1);
    expect((await store.clearLocalData()).profiles).toEqual({ status: "removed" });
    localStorage.setItem(
      DAYFRAME_PROFILES_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        version: 1,
        profiles: [buildSavedProfile()],
      }),
    );

    expect(createReadyDayFrameTestStore().getState().savedProfiles).toEqual([]);
  });

  it("instantiates fresh active incarnations on every load while preserving authored identities", () => {
    const localStorage = createLocalStorageMock();
    installLocalStorageMock(localStorage);
    let allocation = 0;
    const pattern = buildValidHistoricalAuthoredSetup();
    pattern.shiftCycles[0]!.sequence = [
      { id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: "shift_day" },
    ];
    pattern.manualEvents = [
      {
        id: "manual_event_1",
        title: "Appointment",
        userDayDate: "2026-05-06",
        startTime: "09:30",
        endTime: "10:30",
        allDay: false,
        ...baseTimestamps,
      },
    ];
    const store = createReadyDayFrameTestStore(
      { savedProfiles: [buildSavedProfile(pattern)] },
      {
        allocateSourceIncarnationId: () =>
          `00000000-0000-4000-8000-${String(++allocation).padStart(12, "0")}` as never,
      },
    );
    const profile = store.getState().savedProfiles[0]!;

    const first = store.loadProfile(profile.id);
    expectProfileLoaded(first);
    const firstIncarnations = collectIncarnations(first.state);
    const second = store.loadProfile(profile.id);
    expectProfileLoaded(second);
    const secondIncarnations = collectIncarnations(second.state);

    expect(firstIncarnations).toHaveLength(7);
    expect(secondIncarnations).toHaveLength(7);
    expect(secondIncarnations.every((id) => !firstIncarnations.includes(id))).toBe(true);
    expect(currentPattern(second.state)).toEqual(profile.data);
    expect(second.state.preview).toBeNull();
  });
});

describe("Profile V2 recovery authority", () => {
  it("exports exact protected bytes without mutation or notification", () => {
    const localStorage = createLocalStorageMock();
    const raw = "{ preserved invalid profile bytes";
    localStorage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, raw);
    installLocalStorageMock(localStorage);
    const store = createReadyDayFrameTestStore();
    const stateListener = vi.fn();
    const durabilityListener = vi.fn();
    const ingressListener = vi.fn();
    store.subscribe(stateListener);
    store.subscribeDurability(durabilityListener);
    store.subscribeProfileIngress(ingressListener);

    expect(store.exportProtectedProfileSource()).toEqual({ status: "exported", raw });
    expect(localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY)).toBe(raw);
    expect(stateListener).not.toHaveBeenCalled();
    expect(durabilityListener).not.toHaveBeenCalled();
    expect(ingressListener).not.toHaveBeenCalled();
  });

  it("rechecks and verifies explicit replacement while preserving current quarantine", () => {
    const localStorage = createLocalStorageMock();
    const raw = "{";
    localStorage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, raw);
    installLocalStorageMock(localStorage);
    const profile = buildSavedProfile();
    const store = createReadyDayFrameTestStore({ savedProfiles: [profile] });

    expect(store.replaceProtectedProfileCheckpointWithCurrentProfiles()).toEqual({
      status: "resolved",
      action: "replace",
      persistence: { status: "persisted" },
    });
    expect(store.getProfileIngressStatus()).toEqual({
      status: "accepted",
      quarantinedEntryCount: 0,
    });
    const restarted = createReadyDayFrameTestStore();
    expect(restarted.getState().savedProfiles).toEqual([profile]);
  });

  it.each(["replace", "abandon"] as const)(
    "rejects stale protected-source authority before %s",
    (action) => {
      const localStorage = createLocalStorageMock();
      localStorage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, "{");
      installLocalStorageMock(localStorage);
      const store = createReadyDayFrameTestStore({ savedProfiles: [buildSavedProfile()] });
      localStorage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, "externally changed");

      const result =
        action === "replace"
          ? store.replaceProtectedProfileCheckpointWithCurrentProfiles()
          : store.abandonProtectedProfileCheckpoint();

      expect(result).toEqual({ status: "notAttempted", reason: "sourceChanged" });
      expect(localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY)).toBe("externally changed");
      expect(store.getProfileIngressStatus().status).toBe("recoveryRequired");
    },
  );

  it("establishes restart-safe empty V2 authority after explicit abandonment", () => {
    const localStorage = createLocalStorageMock();
    localStorage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, "{");
    localStorage.setItem(
      DAYFRAME_PROFILES_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        version: 1,
        profiles: [buildSavedProfile()],
      }),
    );
    installLocalStorageMock(localStorage);
    const store = createReadyDayFrameTestStore({ savedProfiles: [buildSavedProfile()] });

    expect(store.abandonProtectedProfileCheckpoint()).toEqual({
      status: "resolved",
      action: "abandon",
      persistence: { status: "persisted" },
    });
    expect(store.getState().savedProfiles).toEqual([]);
    expect(localStorage.getItem(DAYFRAME_PROFILES_V2_ESTABLISHED_KEY)).toBe("1");
    expect(createReadyDayFrameTestStore().getState().savedProfiles).toEqual([]);
  });

  it.each(["replace", "abandon"] as const)(
    "retains protection when %s cannot write its verified recovery checkpoint",
    (action) => {
      const localStorage = createLocalStorageMock();
      const raw = "{";
      localStorage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, raw);
      installLocalStorageMock(localStorage);
      const store = createReadyDayFrameTestStore({ savedProfiles: [buildSavedProfile()] });
      localStorage.setItem = vi.fn(() => {
        throw new RangeError("injected");
      });

      const result =
        action === "replace"
          ? store.replaceProtectedProfileCheckpointWithCurrentProfiles()
          : store.abandonProtectedProfileCheckpoint();

      expect(result).toMatchObject({
        status: "notResolved",
        action,
        persistence: { status: "storageFailure" },
      });
      expect(store.getProfileIngressStatus().status).toBe("recoveryRequired");
      expect(store.exportProtectedProfileSource()).toEqual({ status: "exported", raw });
      expect(store.getState().savedProfiles).toHaveLength(1);
    },
  );

  it("exports and removes quarantine independently while retaining valid profiles and active state", () => {
    const localStorage = createLocalStorageMock();
    const profile = buildSavedProfile();
    const invalidA = { id: "invalid_a", name: "Invalid A", data: null };
    const invalidB = { unexpected: true };
    localStorage.setItem(
      DAYFRAME_PROFILES_V2_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        surface: "profiles",
        version: 2,
        profiles: [profile],
        quarantinedProfiles: [invalidA, invalidB],
      }),
    );
    installLocalStorageMock(localStorage);
    const store = createReadyDayFrameTestStore();
    const activeBefore = currentActiveSetup(store.getState());
    const entries = store.getQuarantinedProfiles();

    expect(entries).toHaveLength(2);
    expect(store.exportQuarantinedProfile(entries[0]!.quarantineId)).toEqual({
      status: "exported",
      entry: expect.objectContaining({
        raw: invalidA,
        reason: "invalidProfileEntry",
        originalProfileId: "invalid_a",
      }),
    });
    const removed = store.removeQuarantinedProfile(entries[0]!.quarantineId);
    expect(removed).toMatchObject({
      status: "removed",
      persistence: { status: "persisted" },
      remainingCount: 1,
    });
    expect(store.getState().savedProfiles).toEqual([profile]);
    expect(currentActiveSetup(store.getState())).toEqual(activeBefore);
    expect(store.getQuarantinedProfiles()[0]?.raw).toEqual(invalidB);
  });

  it("retains quarantine-removal intent for retry after persistence failure", () => {
    const localStorage = createLocalStorageMock();
    const profile = buildSavedProfile();
    localStorage.setItem(
      DAYFRAME_PROFILES_V2_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        surface: "profiles",
        version: 2,
        profiles: [profile],
        quarantinedProfiles: [{ id: "remove_me", data: null }],
      }),
    );
    installLocalStorageMock(localStorage);
    const store = createReadyDayFrameTestStore();
    const entry = store.getQuarantinedProfiles()[0]!;
    const originalSet = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new RangeError("injected");
    });

    expect(store.removeQuarantinedProfile(entry.quarantineId)).toMatchObject({
      status: "removed",
      persistence: { status: "storageFailure" },
      remainingCount: 0,
    });
    expect(store.getQuarantinedProfiles()).toEqual([]);
    localStorage.setItem = originalSet;
    expect(store.retryProfilePersistence()).toMatchObject({
      status: "attempted",
      persistence: { status: "persisted" },
    });
    expect(
      JSON.parse(localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY) ?? "{}")
        .quarantinedProfiles,
    ).toEqual([]);
  });

  it("blocks ordinary save/delete and retry from overwriting protected ingress", () => {
    const localStorage = createLocalStorageMock();
    localStorage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, "{");
    installLocalStorageMock(localStorage);
    const profile = buildSavedProfile();
    const store = createReadyDayFrameTestStore({ savedProfiles: [profile] });

    expect(store.saveProfile({ name: "Blocked", savedAt: "2026-08-20" })).toMatchObject({
      status: "blocked",
      reason: "profileRecovery",
      persistence: { status: "notAttempted" },
    });
    expect(store.deleteProfile(profile.id)).toMatchObject({ status: "blocked" });
    expect(store.retryProfilePersistence()).toEqual({
      status: "notAttempted",
      reason: "recoveryProtected",
    });
    expect(localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY)).toBe("{");
    expect(store.getState().savedProfiles).toEqual([profile]);
  });
});

describe("Backup V2 lifetime-preserving restore", () => {
  function fullPattern(): DayFrameAuthoredPattern {
    const pattern = buildValidHistoricalAuthoredSetup();
    pattern.shiftCycles[0]!.sequence = [
      { id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: "shift_day" },
    ];
    pattern.manualEvents = [
      {
        id: "manual_event_1",
        title: "Appointment",
        userDayDate: "2026-05-06",
        startTime: "09:30",
        endTime: "10:30",
        allDay: false,
        ...baseTimestamps,
      },
    ];
    return pattern;
  }

  it("exports and repeatedly restores the exact seven-kind lifetime graph", () => {
    const source = createReadyDayFrameTestStore(fullPattern());
    const sourceState = source.getState();
    const backup = source.exportBackup("2026-08-20T12:00:00-05:00");
    const serializedBefore = JSON.stringify(backup);

    expect(validateDayFrameBackupV2(backup)).toEqual(backup);
    expect(backup).toMatchObject({ app: "DayFrame", surface: "backup", version: 2 });
    expect(collectIncarnations(sourceState)).toHaveLength(7);
    expect(collectIncarnations(backup.data)).toEqual(collectIncarnations(sourceState));
    expect(backup.data).not.toHaveProperty("shiftCycle");
    expect(backup.data).not.toHaveProperty("savedProfiles");
    expect(backup.data).not.toHaveProperty("preview");

    const target = createReadyDayFrameTestStore({ savedProfiles: [buildSavedProfile()] });
    const first = target.importBackup(backup);
    expect(first.status).toBe("restored");
    if (first.status !== "restored") throw new RangeError("expected restore");
    expect(collectIncarnations(first.state)).toEqual(collectIncarnations(sourceState));
    expect(first.state.savedProfiles).toEqual([buildSavedProfile()]);
    const second = target.importBackup(backup);
    expect(second.status).toBe("restored");
    if (second.status !== "restored") throw new RangeError("expected restore");
    expect(collectIncarnations(second.state)).toEqual(collectIncarnations(sourceState));
    expect(JSON.stringify(backup)).toBe(serializedBefore);
  });

  it("restores V2 without using the source-incarnation allocator", () => {
    const backup = createReadyDayFrameTestStore(fullPattern()).exportBackup(
      "2026-08-20T12:00:00-05:00",
    );
    const target = createReadyDayFrameTestStore(undefined, {
      allocateSourceIncarnationId: () => {
        throw new RangeError("must not allocate");
      },
    });

    expect(target.importBackup(backup).status).toBe("restored");
  });

  it("rejects Active/Profile/unknown envelopes without mutating active authority", () => {
    const backup = createReadyDayFrameTestStore(fullPattern()).exportBackup(
      "2026-08-20T12:00:00-05:00",
    );
    const target = createReadyDayFrameTestStore(fullPattern());
    const before = target.getState();
    const candidates = [
      { ...backup, surface: "active" },
      { app: "DayFrame", surface: "profiles", version: 2, profiles: [], quarantinedProfiles: [] },
      { ...backup, version: 99 },
    ];

    expect(target.importBackup(candidates[0])).toEqual({
      status: "rejected",
      reason: "envelopeValidationFailure",
    });
    expect(target.importBackup(candidates[1])).toEqual({
      status: "rejected",
      reason: "envelopeValidationFailure",
    });
    expect(target.importBackup(candidates[2])).toEqual({
      status: "rejected",
      reason: "unsupportedVersion",
    });
    expect(target.getState()).toEqual(before);
  });

  it("keeps export/import objects isolated and preserves Profile V2 quarantine", () => {
    const localStorage = createLocalStorageMock();
    const profile = buildSavedProfile();
    const quarantined = { id: "invalid", data: null };
    localStorage.setItem(
      DAYFRAME_PROFILES_V2_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        surface: "profiles",
        version: 2,
        profiles: [profile],
        quarantinedProfiles: [quarantined],
      }),
    );
    installLocalStorageMock(localStorage);
    const source = createReadyDayFrameTestStore(fullPattern());
    const backup = source.exportBackup("2026-08-20T12:00:00-05:00");
    const target = createReadyDayFrameTestStore();
    const result = target.importBackup(backup);
    expect(result.status).toBe("restored");
    if (result.status !== "restored") throw new RangeError("expected restore");
    const restoredBeforeMutation = target.getState();
    backup.data.shiftDefinitions[0]!.name = "Mutated caller artifact";

    expect(target.getState()).toEqual(restoredBeforeMutation);
    expect(target.getState().savedProfiles).toEqual([profile]);
    expect(target.getQuarantinedProfiles()[0]?.raw).toEqual(quarantined);
    expect(source.getState().shiftDefinitions[0]?.name).not.toBe("Mutated caller artifact");
  });

  it("imports Backup V1 as disjoint fresh lifetimes on every import", () => {
    let allocation = 0;
    const store = createReadyDayFrameTestStore(undefined, {
      allocateSourceIncarnationId: () =>
        `00000000-0000-4000-8000-${String(++allocation).padStart(12, "0")}` as never,
    });
    const backup = createDayFrameBackup(fullPattern(), "2026-08-20T12:00:00-05:00");
    const first = store.importBackup(backup);
    expect(first.status).toBe("instantiatedFromLegacy");
    if (first.status !== "instantiatedFromLegacy") throw new RangeError("expected V1 import");
    const second = store.importBackup(backup);
    expect(second.status).toBe("instantiatedFromLegacy");
    if (second.status !== "instantiatedFromLegacy") throw new RangeError("expected V1 import");
    expect(
      collectIncarnations(first.state).every(
        (id) => !collectIncarnations(second.state).includes(id),
      ),
    ).toBe(true);
  });

  it("rejects Backup V1 allocation failure before mutation or persistence", () => {
    const store = createReadyDayFrameTestStore(undefined, {
      allocateSourceIncarnationId: () => {
        throw new RangeError("injected");
      },
    });
    const before = store.getState();
    const backup = createDayFrameBackup(fullPattern(), "2026-08-20T12:00:00-05:00");

    expect(store.importBackup(backup)).toEqual({ status: "rejected", reason: "allocationFailure" });
    expect(store.getState()).toEqual(before);
  });

  it.each(["missing", "malformed", "duplicate"] as const)(
    "rejects %s Backup V2 incarnation atomically",
    (kind) => {
      const backup = createReadyDayFrameTestStore(fullPattern()).exportBackup(
        "2026-08-20T12:00:00-05:00",
      );
      const invalid = structuredClone(backup);
      if (kind === "missing")
        delete (
          invalid.data.shiftDefinitions[0] as Partial<
            (typeof invalid.data.shiftDefinitions)[number]
          >
        ).incarnationId;
      if (kind === "malformed")
        invalid.data.shiftDefinitions[0]!.incarnationId = "INVALID" as never;
      if (kind === "duplicate")
        invalid.data.shiftCycles[0]!.incarnationId =
          invalid.data.shiftDefinitions[0]!.incarnationId;
      const target = createReadyDayFrameTestStore(fullPattern());
      const before = target.getState();

      expect(target.importBackup(invalid)).toEqual({
        status: "rejected",
        reason: "incarnationValidationFailure",
      });
      expect(target.getState()).toEqual(before);
    },
  );

  it("keeps restored lifetime authority after Active V2 failure and retries it exactly", () => {
    const localStorage = createLocalStorageMock();
    installLocalStorageMock(localStorage);
    const backup = createReadyDayFrameTestStore(fullPattern()).exportBackup(
      "2026-08-20T12:00:00-05:00",
    );
    let failActive = true;
    const originalSet = localStorage.setItem;
    localStorage.setItem = (key, value) => {
      if (key === DAYFRAME_ACTIVE_V2_STORAGE_KEY && failActive) throw new RangeError("injected");
      originalSet(key, value);
    };
    const target = createReadyDayFrameTestStore();
    const result = target.importBackup(backup);
    expect(result.status).toBe("restored");
    if (result.status !== "restored") throw new RangeError("expected restore");
    expect(result.persistence).toEqual({ status: "storageFailure" });
    expect(collectIncarnations(result.state)).toEqual(collectIncarnations(backup.data));
    failActive = false;
    expect(target.retryActivePersistence()).toMatchObject({
      status: "attempted",
      persistence: { status: "persisted" },
    });
    expect(collectIncarnations(readActiveV2Data(localStorage))).toEqual(
      collectIncarnations(backup.data),
    );
  });

  it("preserves scheduling and OccurrenceIdentity V1 semantics across a V2 roundtrip", () => {
    const generation = {
      rangeStartDate: "2026-05-04",
      rangeEndDate: "2026-05-07",
      planningWindowStart: new Date(2026, 4, 4),
      planningWindowEnd: new Date(2026, 4, 8),
      generatedAt: "2026-05-03T13:00:00-05:00",
    } as const;
    const source = createReadyDayFrameTestStore(fullPattern());
    const expected = source.generatePreview(generation).preview!.result;
    const backup = source.exportBackup("2026-08-20T12:00:00-05:00");
    const target = createReadyDayFrameTestStore();
    expect(target.importBackup(backup).status).toBe("restored");
    const restored = target.generatePreview(generation).preview!.result;

    expect(restored).toEqual(expected);
    expect(JSON.stringify(restored)).not.toContain("incarnationId");
  });
});

function collectIncarnations(state: DayFrameAuthoredSetup): string[] {
  return [
    ...state.shiftDefinitions.map(({ incarnationId }) => incarnationId),
    ...state.shiftCycles.flatMap((cycle) => [
      cycle.incarnationId,
      ...cycle.segments.map(({ incarnationId }) => incarnationId),
      ...(cycle.sequence ?? []).map(({ incarnationId }) => incarnationId),
    ]),
    ...state.blockTemplates.map(({ incarnationId }) => incarnationId),
    ...state.blockRecurrences.map(({ incarnationId }) => incarnationId),
    ...state.manualEvents.map(({ incarnationId }) => incarnationId),
  ];
}

function buildSavedProfile(
  state: DayFrameAuthoredPattern = createInitialDayFrameState(),
): DayFrameSavedProfile {
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

function buildValidHistoricalAuthoredSetup(): DayFrameAuthoredPattern {
  const state = createInitialDayFrameState();

  return {
    schedulingPreferences: state.schedulingPreferences,
    previewRange: state.previewRange,
    shiftDefinitions: buildShiftDefinitions(),
    shiftCycles: [buildShiftCycle()],
    blockTemplates: buildBlockTemplates(),
    blockRecurrences: buildBlockRecurrences(),
    manualEvents: [],
  };
}

function buildSerializationFailureState(): DayFrameState {
  const state = createInitialDayFrameState();
  const blockTemplate = buildBlockTemplates()[0]!;

  state.blockTemplates = [
    {
      ...blockTemplate,
      incarnationId:
        "00000000-0000-4000-8000-000000000099" as DayFrameState["blockTemplates"][number]["incarnationId"],
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

describe("lifecycle-aware manual-event mutations", () => {
  const event = {
    id: "manual_event_1",
    title: "Event",
    userDayDate: "2026-08-20" as const,
    allDay: true,
    ...baseTimestamps,
  };

  it("requires create and update to match the explicit active-source condition", () => {
    const store = createReadyDayFrameTestStore();

    expect(store.mutateManualEvent({ operation: "create", event }).status).toBe("applied");
    expect(() => store.mutateManualEvent({ operation: "create", event })).toThrow("already active");
    expect(
      store.mutateManualEvent({ operation: "update", event: { ...event, title: "Updated" } })
        .status,
    ).toBe("applied");
    expect(store.getState().manualEvents[0]?.title).toBe("Updated");
  });

  it("makes deletion and same-ID replacement explicit", () => {
    const store = createReadyDayFrameTestStore({ manualEvents: [event] });

    expect(store.mutateManualEvent({ operation: "delete", sourceId: event.id }).status).toBe(
      "applied",
    );
    expect(() =>
      store.mutateManualEvent({ operation: "update", event: { ...event, title: "Recreated" } }),
    ).toThrow("missing");
    expect(
      store.mutateManualEvent({ operation: "replace", event: { ...event, title: "Recreated" } })
        .status,
    ).toBe("applied");
  });
});

describe("lifecycle-aware Setup commit", () => {
  it("rejects a snapshot whose explicit transaction does not cover its source lifecycle", () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
        {
          id: "shift_1",
          userId: "user_001",
          name: "Shift",
          startTime: "09:00",
          endTime: "17:00",
          workDays: ["monday"],
          crossesMidnight: false,
          ...baseTimestamps,
        },
      ],
    });
    const state = store.getState();

    expect(() =>
      store.commitAuthoredSetupTransaction({
        authoredSetup: {
          schedulingPreferences: state.schedulingPreferences,
          previewRange: state.previewRange,
          shiftDefinitions: state.shiftDefinitions,
          shiftCycles: state.shiftCycles,
          blockTemplates: state.blockTemplates,
          blockRecurrences: state.blockRecurrences,
        },
        lifecycle: { operations: [] },
      }),
    ).toThrow("does not cover shiftDefinition::shift_1");
  });
});
