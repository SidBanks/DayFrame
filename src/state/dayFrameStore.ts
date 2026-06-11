import { generateSchedulePreview } from "../core/engine/generateSchedulePreview.js";
import { reviseSchedulePreview } from "../core/engine/reviseSchedulePreview.js";
import { cloneShiftCycles as cloneNormalizedShiftCycles } from "../core/cycles/shiftCycleUtils.js";
import {
  cloneDayFrameAuthoredSetup,
  createDayFrameBackup,
  validateDayFrameBackup,
} from "./dayFrameBackup.js";
import {
  cloneSavedProfiles,
  createDayFrameProfilesStorage,
  createDayFrameSavedProfile,
  validateDayFrameProfilesStorage,
} from "./dayFrameProfiles.js";
import {
  createInitialDayFrameState,
  type PersistedDayFrameState,
} from "./createInitialDayFrameState.js";
import type { ManualCalendarEvent } from "../core/calendar/types.js";
import type {
  ApplyPreviewFixActionInput,
  DayFramePreview,
  DayFramePreviewRange,
  DayFrameSavedProfile,
  DayFrameSchedulingPreferences,
  DayFrameState,
  DayFrameStore,
  GeneratePreviewActionInput,
} from "./types.js";

export const DAYFRAME_STORAGE_KEY = "dayframe-store-v1";
export const DAYFRAME_PROFILES_STORAGE_KEY = "dayframe-profiles-v1";

export function createDayFrameStore(initialState?: Partial<DayFrameState>): DayFrameStore {
  let state = mergeInitialState(initialState);
  const listeners = new Set<(state: DayFrameState) => void>();

  function getState(): DayFrameState {
    return cloneState(state);
  }

  function subscribe(listener: (state: DayFrameState) => void): () => void {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function setSchedulingPreferences(
    schedulingPreferences: Partial<DayFrameSchedulingPreferences>,
  ): DayFrameState {
    state = {
      ...state,
      schedulingPreferences: {
        ...state.schedulingPreferences,
        ...schedulingPreferences,
      },
      preview: markPreviewStale(state.preview),
    };

    persistState(state);

    return notify();
  }

  function setPreviewRange(previewRange: DayFramePreviewRange): DayFrameState {
    state = {
      ...state,
      previewRange: {
        ...previewRange,
      },
      preview: markPreviewStale(state.preview),
    };

    persistState(state);

    return notify();
  }

  function setShiftDefinitions(shiftDefinitions: DayFrameState["shiftDefinitions"]): DayFrameState {
    state = {
      ...state,
      shiftDefinitions: cloneShiftDefinitions(shiftDefinitions),
      preview: markPreviewStale(state.preview),
    };

    persistState(state);

    return notify();
  }

  function setShiftCycles(shiftCycles: DayFrameState["shiftCycles"]): DayFrameState {
    state = {
      ...state,
      shiftCycles: cloneShiftCycles(shiftCycles),
      preview: markPreviewStale(state.preview),
    };

    persistState(state);

    return notify();
  }

  function setShiftCycle(shiftCycle: DayFrameState["shiftCycle"]): DayFrameState {
    return setShiftCycles(shiftCycle ? [shiftCycle] : []);
  }

  function setBlockTemplates(blockTemplates: DayFrameState["blockTemplates"]): DayFrameState {
    state = {
      ...state,
      blockTemplates: cloneBlockTemplates(blockTemplates),
      preview: markPreviewStale(state.preview),
    };

    persistState(state);

    return notify();
  }

  function setBlockRecurrences(blockRecurrences: DayFrameState["blockRecurrences"]): DayFrameState {
    state = {
      ...state,
      blockRecurrences: cloneBlockRecurrences(blockRecurrences),
      preview: markPreviewStale(state.preview),
    };

    persistState(state);

    return notify();
  }

  function setManualEvents(manualEvents: ManualCalendarEvent[]): DayFrameState {
    state = {
      ...state,
      manualEvents: cloneManualEvents(manualEvents),
      preview: markPreviewStale(state.preview),
    };

    persistState(state);

    return notify();
  }

  function saveProfile(input: { name: string; savedAt: string }): DayFrameState {
    const trimmedName = input.name.trim();

    if (!trimmedName) {
      throw new RangeError("Profile name is required.");
    }

    const existingProfile = state.savedProfiles.find((profile) => profile.name === trimmedName);
    const nextProfile = createDayFrameSavedProfile({
      id: existingProfile?.id ?? createProfileId(trimmedName),
      name: trimmedName,
      savedAt: input.savedAt,
      data: getAuthoredSetup(state),
    });

    state = {
      ...state,
      savedProfiles: existingProfile
        ? state.savedProfiles.map((profile) =>
            profile.id === existingProfile.id ? nextProfile : profile,
          )
        : [...state.savedProfiles, nextProfile],
    };

    persistProfiles(state.savedProfiles);

    return notify();
  }

  function loadProfile(profileId: string): DayFrameState {
    const profile = state.savedProfiles.find((currentProfile) => currentProfile.id === profileId);

    if (!profile) {
      throw new RangeError("Cannot load a missing saved profile.");
    }

    const clonedProfileData = cloneDayFrameAuthoredSetup(profile.data);

    state = {
      ...createInitialDayFrameState(clonedProfileData),
      savedProfiles: cloneSavedProfiles(state.savedProfiles),
      preview: null,
    };

    persistState(state);

    return notify();
  }

  function deleteProfile(profileId: string): DayFrameState {
    state = {
      ...state,
      savedProfiles: state.savedProfiles.filter((profile) => profile.id !== profileId),
    };

    persistProfiles(state.savedProfiles);

    return notify();
  }

  function clearLocalData(): DayFrameState {
    state = createInitialDayFrameState();
    clearPersistedState();
    clearPersistedProfiles();

    return notify();
  }

  function exportBackup(exportedAt: string) {
    return createDayFrameBackup(getAuthoredSetup(state), exportedAt);
  }

  function importBackup(backup: Parameters<typeof validateDayFrameBackup>[0]): DayFrameState {
    const validatedBackup = validateDayFrameBackup(backup);
    const clonedBackupData = cloneDayFrameAuthoredSetup(validatedBackup.data);

    state = {
      ...createInitialDayFrameState(clonedBackupData),
      savedProfiles: cloneSavedProfiles(state.savedProfiles),
      preview: null,
    };

    persistState(state);

    return notify();
  }

  function generatePreview(input: GeneratePreviewActionInput): DayFrameState {
    if (state.shiftCycles.length === 0) {
      throw new RangeError("Cannot generate preview without shiftCycles");
    }

    const previewResult = generateSchedulePreview({
      shiftDefinitions: cloneShiftDefinitions(state.shiftDefinitions),
      shiftCycles: cloneShiftCycles(state.shiftCycles),
      blockTemplates: cloneBlockTemplates(state.blockTemplates),
      blockRecurrences: cloneBlockRecurrences(state.blockRecurrences),
      manualEvents: cloneManualEvents(state.manualEvents),
      planningWindowStart: new Date(input.planningWindowStart),
      planningWindowEnd: new Date(input.planningWindowEnd),
      dayBoundaryStartTime: state.schedulingPreferences.dayBoundaryStartTime,
      weekStartsOn: state.schedulingPreferences.weekStartsOn,
      generatedAt: input.generatedAt,
    });

    state = {
      ...state,
      preview: {
        result: previewResult,
        rangeStartDate: input.rangeStartDate,
        rangeEndDate: input.rangeEndDate,
        planningWindowStart: new Date(input.planningWindowStart),
        planningWindowEnd: new Date(input.planningWindowEnd),
        generatedAt: input.generatedAt,
        isStale: false,
      },
    };

    return notify();
  }

  function applySuggestedFixToPreview(input: ApplyPreviewFixActionInput): DayFrameState {
    if (!state.preview) {
      throw new RangeError("Cannot apply a suggested fix without a current preview");
    }

    const revisedPreviewResult = reviseSchedulePreview({
      preview: clonePreviewResult(state.preview.result),
      selectedFrictionPointId: input.selectedFrictionPointId,
      selectedSuggestedFixId: input.selectedSuggestedFixId,
      dayBoundaryStartTime: state.schedulingPreferences.dayBoundaryStartTime,
      revisedAt: input.revisedAt,
    });

    state = {
      ...state,
      preview: {
        result: revisedPreviewResult.preview,
        rangeStartDate: state.preview.rangeStartDate,
        rangeEndDate: state.preview.rangeEndDate,
        planningWindowStart: new Date(state.preview.planningWindowStart),
        planningWindowEnd: new Date(state.preview.planningWindowEnd),
        generatedAt: state.preview.generatedAt,
        ...(revisedPreviewResult.didRevise
          ? { revisedAt: input.revisedAt }
          : state.preview.revisedAt
            ? { revisedAt: state.preview.revisedAt }
            : {}),
        ...(revisedPreviewResult.actionFeedback
          ? { actionFeedback: revisedPreviewResult.actionFeedback }
          : {}),
        isStale: state.preview.isStale,
      },
    };

    return notify();
  }

  function notify(): DayFrameState {
    const snapshot = getState();

    for (const listener of listeners) {
      listener(snapshot);
    }

    return snapshot;
  }

  return {
    getState,
    subscribe,
    setSchedulingPreferences,
    setPreviewRange,
    setShiftDefinitions,
    setShiftCycle,
    setShiftCycles,
    setBlockTemplates,
    setBlockRecurrences,
    setManualEvents,
    saveProfile,
    loadProfile,
    deleteProfile,
    clearLocalData,
    exportBackup,
    importBackup,
    generatePreview,
    applySuggestedFixToPreview,
  };
}

function mergeInitialState(initialState?: Partial<DayFrameState>): DayFrameState {
  const baseState = createInitialDayFrameState(loadPersistedState());
  const savedProfiles = loadPersistedProfiles();

  if (!initialState) {
    return {
      ...baseState,
      savedProfiles,
    };
  }

  return {
    schedulingPreferences: {
      ...baseState.schedulingPreferences,
      ...initialState.schedulingPreferences,
    },
    previewRange: initialState.previewRange
      ? { ...baseState.previewRange, ...initialState.previewRange }
      : { ...baseState.previewRange },
    shiftDefinitions: initialState.shiftDefinitions
      ? cloneShiftDefinitions(initialState.shiftDefinitions)
      : baseState.shiftDefinitions,
    shiftCycles: initialState.shiftCycles
      ? cloneShiftCycles(initialState.shiftCycles)
      : initialState.shiftCycle
        ? cloneShiftCycles([initialState.shiftCycle])
        : baseState.shiftCycles,
    blockTemplates: initialState.blockTemplates
      ? cloneBlockTemplates(initialState.blockTemplates)
      : baseState.blockTemplates,
    blockRecurrences: initialState.blockRecurrences
      ? cloneBlockRecurrences(initialState.blockRecurrences)
      : baseState.blockRecurrences,
    manualEvents: initialState.manualEvents
      ? cloneManualEvents(initialState.manualEvents)
      : baseState.manualEvents,
    savedProfiles: initialState.savedProfiles
      ? cloneSavedProfiles(initialState.savedProfiles)
      : savedProfiles,
    preview: initialState.preview ? clonePreview(initialState.preview) : null,
  };
}

function loadPersistedState(): Partial<PersistedDayFrameState> | undefined {
  const storage = getStorage();

  if (!storage) {
    return undefined;
  }

  try {
    const rawState = storage.getItem(DAYFRAME_STORAGE_KEY);

    if (!rawState) {
      return undefined;
    }

    return JSON.parse(rawState) as PersistedDayFrameState;
  } catch {
    return undefined;
  }
}

function persistState(state: DayFrameState): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const persistedState: PersistedDayFrameState = {
    schedulingPreferences: {
      ...state.schedulingPreferences,
    },
    previewRange: {
      ...state.previewRange,
    },
    shiftDefinitions: cloneShiftDefinitions(state.shiftDefinitions),
    shiftCycles: cloneShiftCycles(state.shiftCycles),
    blockTemplates: cloneBlockTemplates(state.blockTemplates),
    blockRecurrences: cloneBlockRecurrences(state.blockRecurrences),
    manualEvents: cloneManualEvents(state.manualEvents),
  };

  if (state.shiftCycles[0]) {
    persistedState.shiftCycle = cloneShiftCycles([state.shiftCycles[0]])[0]!;
  } else {
    persistedState.shiftCycle = null;
  }

  try {
    storage.setItem(DAYFRAME_STORAGE_KEY, JSON.stringify(persistedState));
  } catch {
    // Ignore storage failures so local persistence never blocks app usage.
  }
}

function loadPersistedProfiles(): DayFrameSavedProfile[] {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  try {
    const rawProfiles = storage.getItem(DAYFRAME_PROFILES_STORAGE_KEY);

    if (!rawProfiles) {
      return [];
    }

    const parsedProfiles = validateDayFrameProfilesStorage(JSON.parse(rawProfiles) as unknown);

    return parsedProfiles ? cloneSavedProfiles(parsedProfiles.profiles) : [];
  } catch {
    return [];
  }
}

function getAuthoredSetup(state: DayFrameState) {
  return cloneDayFrameAuthoredSetup({
    schedulingPreferences: state.schedulingPreferences,
    previewRange: state.previewRange,
    shiftDefinitions: state.shiftDefinitions,
    shiftCycles: state.shiftCycles,
    blockTemplates: state.blockTemplates,
    blockRecurrences: state.blockRecurrences,
    manualEvents: state.manualEvents,
  });
}

function persistProfiles(profiles: DayFrameSavedProfile[]): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      DAYFRAME_PROFILES_STORAGE_KEY,
      JSON.stringify(createDayFrameProfilesStorage(profiles)),
    );
  } catch {
    // Ignore storage failures so saved profiles never blocks app usage.
  }
}

function clearPersistedState(): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(DAYFRAME_STORAGE_KEY);
  } catch {
    // Ignore storage failures so clearing local data never blocks app usage.
  }
}

function clearPersistedProfiles(): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(DAYFRAME_PROFILES_STORAGE_KEY);
  } catch {
    // Ignore storage failures so clearing local data never blocks app usage.
  }
}

function getStorage(): StorageLike | undefined {
  if (!("localStorage" in globalThis)) {
    return undefined;
  }

  return globalThis.localStorage as StorageLike;
}

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function cloneState(state: DayFrameState): DayFrameState {
  const shiftCycles = cloneShiftCycles(state.shiftCycles);

  return {
    schedulingPreferences: {
      ...state.schedulingPreferences,
    },
    previewRange: {
      ...state.previewRange,
    },
    shiftDefinitions: cloneShiftDefinitions(state.shiftDefinitions),
    shiftCycles,
    shiftCycle: shiftCycles[0] ?? null,
    blockTemplates: cloneBlockTemplates(state.blockTemplates),
    blockRecurrences: cloneBlockRecurrences(state.blockRecurrences),
    manualEvents: cloneManualEvents(state.manualEvents),
    savedProfiles: cloneSavedProfiles(state.savedProfiles),
    preview: state.preview ? clonePreview(state.preview) : null,
  };
}

function clonePreview(preview: DayFramePreview): DayFramePreview {
  return {
    result: clonePreviewResult(preview.result),
    rangeStartDate: preview.rangeStartDate,
    rangeEndDate: preview.rangeEndDate,
    planningWindowStart: new Date(preview.planningWindowStart),
    planningWindowEnd: new Date(preview.planningWindowEnd),
    generatedAt: preview.generatedAt,
    isStale: preview.isStale,
    ...(preview.revisedAt ? { revisedAt: preview.revisedAt } : {}),
    ...(preview.actionFeedback ? { actionFeedback: { ...preview.actionFeedback } } : {}),
  };
}

function markPreviewStale(preview: DayFramePreview | null): DayFramePreview | null {
  if (!preview) {
    return null;
  }

  return {
    ...clonePreview(preview),
    isStale: true,
  };
}

function createProfileId(name: string): string {
  const normalizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `profile_${normalizedName || "saved"}`;
}

function clonePreviewResult(result: DayFramePreview["result"]): DayFramePreview["result"] {
  return {
    generatedWorkBlocks: result.generatedWorkBlocks.map((generatedWorkBlock) => ({
      ...generatedWorkBlock,
      startsAt: new Date(generatedWorkBlock.startsAt),
      endsAt: new Date(generatedWorkBlock.endsAt),
    })),
    blockCandidates: result.blockCandidates.map((blockCandidate) => ({
      ...blockCandidate,
      externalResources: [...blockCandidate.externalResources],
    })),
    scheduledBlocks: result.scheduledBlocks.map((scheduledBlock) => ({
      ...scheduledBlock,
      startsAt: new Date(scheduledBlock.startsAt),
      endsAt: new Date(scheduledBlock.endsAt),
      externalResources: [...scheduledBlock.externalResources],
    })),
    unplacedCandidates: result.unplacedCandidates.map((blockCandidate) => ({
      ...blockCandidate,
      externalResources: [...blockCandidate.externalResources],
    })),
    frictionPoints: result.frictionPoints.map((frictionPoint) => ({
      ...frictionPoint,
      suggestedFixes: frictionPoint.suggestedFixes.map((suggestedFix) => ({
        ...suggestedFix,
        ...(suggestedFix.parameters ? { parameters: { ...suggestedFix.parameters } } : {}),
      })),
    })),
  };
}

function cloneShiftDefinitions(
  state: DayFrameState["shiftDefinitions"],
): DayFrameState["shiftDefinitions"] {
  return state.map((shiftDefinition) => ({
    ...shiftDefinition,
  }));
}

function cloneShiftCycles(shiftCycles: DayFrameState["shiftCycles"]): DayFrameState["shiftCycles"] {
  return cloneNormalizedShiftCycles(shiftCycles);
}

function cloneBlockTemplates(
  blockTemplates: DayFrameState["blockTemplates"],
): DayFrameState["blockTemplates"] {
  return blockTemplates.map((blockTemplate) => ({
    ...blockTemplate,
    requiresWorkAnchor: blockTemplate.requiresWorkAnchor ?? false,
    externalResources: blockTemplate.externalResources.map((externalResource) => ({
      ...externalResource,
      ...(externalResource.metadata ? { metadata: { ...externalResource.metadata } } : {}),
    })),
  }));
}

function cloneBlockRecurrences(
  blockRecurrences: DayFrameState["blockRecurrences"],
): DayFrameState["blockRecurrences"] {
  return blockRecurrences.map((blockRecurrence) => ({
    ...blockRecurrence,
    ...(blockRecurrence.weekdays ? { weekdays: [...blockRecurrence.weekdays] } : {}),
  }));
}

function cloneManualEvents(
  manualEvents: DayFrameState["manualEvents"],
): DayFrameState["manualEvents"] {
  return manualEvents.map((manualEvent) => ({
    ...manualEvent,
  }));
}
