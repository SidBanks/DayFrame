import { normalizePersistedPreviewRange } from "./createInitialDayFrameState.js";
import { cloneDayFrameAuthoredSetup } from "./dayFrameBackup.js";
import type { DayFrameAuthoredSetup, DayFrameSavedProfile } from "./types.js";

export type DayFrameProfilesStorageV1 = {
  app: "DayFrame";
  version: 1;
  profiles: DayFrameSavedProfile[];
};

export function createDayFrameSavedProfile(input: {
  id: string;
  name: string;
  savedAt: string;
  data: DayFrameAuthoredSetup;
}): DayFrameSavedProfile {
  return {
    id: input.id,
    name: input.name,
    savedAt: input.savedAt,
    data: cloneDayFrameAuthoredSetup(input.data),
  };
}

export function createDayFrameProfilesStorage(
  profiles: DayFrameSavedProfile[],
): DayFrameProfilesStorageV1 {
  return {
    app: "DayFrame",
    version: 1,
    profiles: cloneSavedProfiles(profiles),
  };
}

export function validateDayFrameProfilesStorage(
  value: unknown,
): DayFrameProfilesStorageV1 | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (value.app !== "DayFrame" || value.version !== 1 || !Array.isArray(value.profiles)) {
    return undefined;
  }

  const profiles = value.profiles
    .filter(isRecord)
    .filter(
      (profile) =>
        typeof profile.id === "string" &&
        typeof profile.name === "string" &&
        typeof profile.savedAt === "string" &&
        isRecord(profile.data),
    )
    .map((profile) =>
      createDayFrameSavedProfile({
        id: profile.id as string,
        name: profile.name as string,
        savedAt: profile.savedAt as string,
        data: normalizeAuthoredSetup(profile.data as Record<string, unknown>),
      }),
    );

  return {
    app: "DayFrame",
    version: 1,
    profiles,
  };
}

export function cloneSavedProfiles(profiles: DayFrameSavedProfile[]): DayFrameSavedProfile[] {
  return profiles.map((profile) => ({
    ...profile,
    data: cloneDayFrameAuthoredSetup(profile.data),
  }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeAuthoredSetup(value: Record<string, unknown>): DayFrameAuthoredSetup {
  const schedulingPreferences = isRecord(value.schedulingPreferences)
    ? value.schedulingPreferences
    : {};

  return {
    schedulingPreferences: {
      dayBoundaryStartTime:
        schedulingPreferences.dayBoundaryStartTime as DayFrameAuthoredSetup["schedulingPreferences"]["dayBoundaryStartTime"],
      weekStartsOn:
        schedulingPreferences.weekStartsOn as DayFrameAuthoredSetup["schedulingPreferences"]["weekStartsOn"],
    },
    previewRange: normalizePersistedPreviewRange(
      value.previewRange as Partial<DayFrameAuthoredSetup["previewRange"]> | undefined,
    ),
    shiftDefinitions: (value.shiftDefinitions ?? []) as DayFrameAuthoredSetup["shiftDefinitions"],
    shiftCycle: (value.shiftCycle ?? null) as DayFrameAuthoredSetup["shiftCycle"],
    blockTemplates: (value.blockTemplates ?? []) as DayFrameAuthoredSetup["blockTemplates"],
    blockRecurrences: (value.blockRecurrences ?? []) as DayFrameAuthoredSetup["blockRecurrences"],
    manualEvents: (value.manualEvents ?? []) as DayFrameAuthoredSetup["manualEvents"],
  };
}
