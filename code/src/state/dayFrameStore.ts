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
  CommitAuthoredSetupInput,
  DayFramePreview,
  DayFramePreviewRange,
  DayFrameSavedProfile,
  DayFrameSchedulingPreferences,
  DayFrameState,
  DayFrameStore,
  DurabilityRetryResult,
  GeneratePreviewActionInput,
  PersistenceRemovalOutcome,
  PersistenceWriteOutcome,
  StoreDesiredDurableCondition,
  StoreDurabilityStatus,
  StoreMutationResult,
  SurfaceDurabilityStatus,
} from "./types.js";

export const DAYFRAME_STORAGE_KEY = "dayframe-store-v1";
export const DAYFRAME_PROFILES_STORAGE_KEY = "dayframe-profiles-v1";

export type { PersistenceRemovalOutcome, PersistenceWriteOutcome } from "./types.js";

function mapWriteOutcomeToDurability(
  outcome: PersistenceWriteOutcome,
): Exclude<SurfaceDurabilityStatus, "unknown"> {
  return outcome.status === "persisted" ? "durable" : outcome.status;
}

function mapRemovalOutcomeToDurability(
  outcome: PersistenceRemovalOutcome,
): Exclude<SurfaceDurabilityStatus, "unknown" | "serializationFailure"> {
  return outcome.status === "removed" ? "durable" : outcome.status;
}

export function createDayFrameStore(initialState?: Partial<DayFrameState>): DayFrameStore {
  let state = mergeInitialState(initialState);
  let durabilityStatus: StoreDurabilityStatus = {
    activeState: "unknown",
    profiles: "unknown",
  };
  let desiredDurableCondition: StoreDesiredDurableCondition = {
    activeState: "snapshot",
    profiles: "snapshot",
  };
  const listeners = new Set<(state: DayFrameState) => void>();
  const durabilityListeners = new Set<(status: StoreDurabilityStatus) => void>();

  function getState(): DayFrameState {
    return cloneState(state);
  }

  function getDurabilityStatus(): StoreDurabilityStatus {
    return { ...durabilityStatus };
  }

  function getDesiredDurableCondition(): StoreDesiredDurableCondition {
    return { ...desiredDurableCondition };
  }

  function subscribeDurability(
    listener: (status: StoreDurabilityStatus) => void,
  ): () => void {
    durabilityListeners.add(listener);

    return () => {
      durabilityListeners.delete(listener);
    };
  }

  function updateDurabilityStatus(nextStatus: StoreDurabilityStatus): void {
    if (
      durabilityStatus.activeState === nextStatus.activeState &&
      durabilityStatus.profiles === nextStatus.profiles
    ) {
      return;
    }

    durabilityStatus = nextStatus;

    for (const listener of durabilityListeners) {
      listener(getDurabilityStatus());
    }
  }

  function retainActiveSnapshotIntent(): void {
    desiredDurableCondition = {
      ...desiredDurableCondition,
      activeState: "snapshot",
    };
  }

  function retainProfileSnapshotIntent(): void {
    desiredDurableCondition = {
      ...desiredDurableCondition,
      profiles: "snapshot",
    };
  }

  function retainActiveWriteOutcome(outcome: PersistenceWriteOutcome): void {
    updateDurabilityStatus({
      ...durabilityStatus,
      activeState: mapWriteOutcomeToDurability(outcome),
    });
  }

  function retainProfileWriteOutcome(outcome: PersistenceWriteOutcome): void {
    updateDurabilityStatus({
      ...durabilityStatus,
      profiles: mapWriteOutcomeToDurability(outcome),
    });
  }

  function getRetryIneligibilityReason(
    status: SurfaceDurabilityStatus,
  ): Extract<DurabilityRetryResult, { status: "notAttempted" }>["reason"] | undefined {
    switch (status) {
      case "unknown":
        return "unknown";
      case "durable":
        return "alreadyDurable";
      case "serializationFailure":
        return "serializationFailure";
      case "unavailable":
      case "storageFailure":
        return undefined;
    }
  }

  function retryActivePersistence(): DurabilityRetryResult {
    const reason = getRetryIneligibilityReason(durabilityStatus.activeState);

    if (reason) {
      return { status: "notAttempted", reason };
    }

    if (desiredDurableCondition.activeState === "snapshot") {
      const persistence = persistState(state);

      retainActiveWriteOutcome(persistence);
      return { status: "attempted", desiredCondition: "snapshot", persistence };
    }

    const persistence = clearPersistedState();

    updateDurabilityStatus({
      ...durabilityStatus,
      activeState: mapRemovalOutcomeToDurability(persistence),
    });
    return { status: "attempted", desiredCondition: "absent", persistence };
  }

  function retryProfilePersistence(): DurabilityRetryResult {
    const reason = getRetryIneligibilityReason(durabilityStatus.profiles);

    if (reason) {
      return { status: "notAttempted", reason };
    }

    if (desiredDurableCondition.profiles === "snapshot") {
      const persistence = persistProfiles(state.savedProfiles);

      retainProfileWriteOutcome(persistence);
      return { status: "attempted", desiredCondition: "snapshot", persistence };
    }

    const persistence = clearPersistedProfiles();

    updateDurabilityStatus({
      ...durabilityStatus,
      profiles: mapRemovalOutcomeToDurability(persistence),
    });
    return { status: "attempted", desiredCondition: "absent", persistence };
  }

  function subscribe(listener: (state: DayFrameState) => void): () => void {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function commitAuthoredSetup(authoredSetup: CommitAuthoredSetupInput): StoreMutationResult {
    state = {
      ...state,
      schedulingPreferences: {
        ...authoredSetup.schedulingPreferences,
      },
      previewRange: {
        ...authoredSetup.previewRange,
      },
      shiftDefinitions: cloneShiftDefinitions(authoredSetup.shiftDefinitions),
      shiftCycles: cloneShiftCycles(authoredSetup.shiftCycles),
      blockTemplates: cloneBlockTemplates(authoredSetup.blockTemplates),
      blockRecurrences: cloneBlockRecurrences(authoredSetup.blockRecurrences),
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function setSchedulingPreferences(
    schedulingPreferences: Partial<DayFrameSchedulingPreferences>,
  ): StoreMutationResult {
    state = {
      ...state,
      schedulingPreferences: {
        ...state.schedulingPreferences,
        ...schedulingPreferences,
      },
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function setPreviewRange(previewRange: DayFramePreviewRange): StoreMutationResult {
    state = {
      ...state,
      previewRange: {
        ...previewRange,
      },
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function setShiftDefinitions(
    shiftDefinitions: DayFrameState["shiftDefinitions"],
  ): StoreMutationResult {
    state = {
      ...state,
      shiftDefinitions: cloneShiftDefinitions(shiftDefinitions),
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function setShiftCycles(shiftCycles: DayFrameState["shiftCycles"]): StoreMutationResult {
    state = {
      ...state,
      shiftCycles: cloneShiftCycles(shiftCycles),
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function setBlockTemplates(blockTemplates: DayFrameState["blockTemplates"]): StoreMutationResult {
    state = {
      ...state,
      blockTemplates: cloneBlockTemplates(blockTemplates),
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function setBlockRecurrences(
    blockRecurrences: DayFrameState["blockRecurrences"],
  ): StoreMutationResult {
    state = {
      ...state,
      blockRecurrences: cloneBlockRecurrences(blockRecurrences),
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function setManualEvents(manualEvents: ManualCalendarEvent[]): StoreMutationResult {
    state = {
      ...state,
      manualEvents: cloneManualEvents(manualEvents),
      preview: markPreviewStale(state.preview),
    };

    retainActiveSnapshotIntent();
    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function saveProfile(input: { name: string; savedAt: string }): StoreMutationResult {
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

    retainProfileSnapshotIntent();
    const persistence = persistProfiles(state.savedProfiles);
    retainProfileWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function loadProfile(profileId: string): StoreMutationResult {
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

    retainActiveSnapshotIntent();
    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function deleteProfile(profileId: string): StoreMutationResult {
    state = {
      ...state,
      savedProfiles: state.savedProfiles.filter((profile) => profile.id !== profileId),
    };

    retainProfileSnapshotIntent();
    const persistence = persistProfiles(state.savedProfiles);
    retainProfileWriteOutcome(persistence);

    return { state: notify(), persistence };
  }

  function clearLocalData() {
    state = createInitialDayFrameState();
    desiredDurableCondition = {
      activeState: "absent",
      profiles: "absent",
    };
    const activeState = clearPersistedState();
    const profiles = clearPersistedProfiles();
    updateDurabilityStatus({
      activeState: mapRemovalOutcomeToDurability(activeState),
      profiles: mapRemovalOutcomeToDurability(profiles),
    });
    const removedCount =
      Number(activeState.status === "removed") + Number(profiles.status === "removed");

    return {
      state: notify(),
      activeState,
      profiles,
      durability:
        removedCount === 2 ? "cleared" : removedCount === 1 ? "partiallyCleared" : "notCleared",
    } as const;
  }

  function exportBackup(exportedAt: string) {
    return createDayFrameBackup(getAuthoredSetup(state), exportedAt);
  }

  function importBackup(backup: Parameters<typeof validateDayFrameBackup>[0]): StoreMutationResult {
    const validatedBackup = validateDayFrameBackup(backup);
    const clonedBackupData = cloneDayFrameAuthoredSetup(validatedBackup.data);

    state = {
      ...createInitialDayFrameState(clonedBackupData),
      savedProfiles: cloneSavedProfiles(state.savedProfiles),
      preview: null,
    };

    retainActiveSnapshotIntent();
    const persistence = persistState(state);
    retainActiveWriteOutcome(persistence);

    return { state: notify(), persistence };
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
    getDurabilityStatus,
    getDesiredDurableCondition,
    retryActivePersistence,
    retryProfilePersistence,
    subscribeDurability,
    subscribe,
    commitAuthoredSetup,
    setSchedulingPreferences,
    setPreviewRange,
    setShiftDefinitions,
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

export function persistState(state: DayFrameState): PersistenceWriteOutcome {
  const storageAccess = getStorageForPersistence();

  if (storageAccess.status !== "available") {
    return { status: storageAccess.status };
  }

  const { storage } = storageAccess;

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

  let serializedState: string;

  try {
    serializedState = JSON.stringify(persistedState);
  } catch {
    return { status: "serializationFailure" };
  }

  try {
    storage.setItem(DAYFRAME_STORAGE_KEY, serializedState);
    return { status: "persisted" };
  } catch {
    return { status: "storageFailure" };
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

export function persistProfiles(profiles: DayFrameSavedProfile[]): PersistenceWriteOutcome {
  const storageAccess = getStorageForPersistence();

  if (storageAccess.status !== "available") {
    return { status: storageAccess.status };
  }

  const { storage } = storageAccess;

  let serializedProfiles: string;

  try {
    serializedProfiles = JSON.stringify(createDayFrameProfilesStorage(profiles));
  } catch {
    return { status: "serializationFailure" };
  }

  try {
    storage.setItem(DAYFRAME_PROFILES_STORAGE_KEY, serializedProfiles);
    return { status: "persisted" };
  } catch {
    return { status: "storageFailure" };
  }
}

export function clearPersistedState(): PersistenceRemovalOutcome {
  const storageAccess = getStorageForPersistence();

  if (storageAccess.status !== "available") {
    return { status: storageAccess.status };
  }

  const { storage } = storageAccess;

  try {
    storage.removeItem(DAYFRAME_STORAGE_KEY);
    return { status: "removed" };
  } catch {
    return { status: "storageFailure" };
  }
}

export function clearPersistedProfiles(): PersistenceRemovalOutcome {
  const storageAccess = getStorageForPersistence();

  if (storageAccess.status !== "available") {
    return { status: storageAccess.status };
  }

  const { storage } = storageAccess;

  try {
    storage.removeItem(DAYFRAME_PROFILES_STORAGE_KEY);
    return { status: "removed" };
  } catch {
    return { status: "storageFailure" };
  }
}

function getStorage(): StorageLike | undefined {
  if (!("localStorage" in globalThis)) {
    return undefined;
  }

  return globalThis.localStorage as StorageLike;
}

function getStorageForPersistence():
  | { status: "available"; storage: StorageLike }
  | { status: "unavailable" }
  | { status: "storageFailure" } {
  try {
    const storage = getStorage();

    return storage ? { status: "available", storage } : { status: "unavailable" };
  } catch {
    return { status: "storageFailure" };
  }
}

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function cloneState(state: DayFrameState): DayFrameState {
  return {
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
