import { normalizePersistedPreviewRange } from "./createInitialDayFrameState.js";
import { cloneDayFrameAuthoredSetup } from "./dayFrameBackup.js";
import { normalizeManualCalendarEvents } from "./manualCalendarEvents.js";
import type { DayFrameAuthoredPattern, DayFrameSavedProfile } from "./types.js";
import { normalizeShiftCycles } from "../core/cycles/shiftCycleUtils.js";
import { validateDayFrameAuthoredSetup } from "../core/authored/validateDayFrameAuthoredSetup.js";

export type DayFrameProfilesStorageV1 = {
  app: "DayFrame";
  version: 1;
  profiles: DayFrameSavedProfile[];
};

export const DAYFRAME_PROFILES_V2_VERSION = 2 as const;

export type DayFrameProfilesStorageV2 = {
  app: "DayFrame";
  surface: "profiles";
  version: typeof DAYFRAME_PROFILES_V2_VERSION;
  profiles: DayFrameSavedProfile[];
  quarantinedProfiles: unknown[];
};

export type ProfileV1Conversion = {
  profiles: DayFrameSavedProfile[];
  quarantinedProfiles: unknown[];
};

export function createDayFrameSavedProfile(input: {
  id: string;
  name: string;
  savedAt: string;
  data: DayFrameAuthoredPattern;
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
  return { app: "DayFrame", version: 1, profiles: cloneSavedProfiles(profiles) };
}

export function createDayFrameProfilesStorageV2(
  profiles: DayFrameSavedProfile[],
  quarantinedProfiles: unknown[] = [],
): DayFrameProfilesStorageV2 {
  return {
    app: "DayFrame",
    surface: "profiles",
    version: DAYFRAME_PROFILES_V2_VERSION,
    profiles: cloneSavedProfiles(profiles),
    quarantinedProfiles: structuredClone(quarantinedProfiles),
  };
}

export function validateDayFrameProfilesStorageV2(value: unknown): DayFrameProfilesStorageV2 {
  if (
    !isRecord(value) ||
    value.app !== "DayFrame" ||
    value.surface !== "profiles" ||
    value.version !== DAYFRAME_PROFILES_V2_VERSION ||
    !Array.isArray(value.profiles) ||
    !Array.isArray(value.quarantinedProfiles)
  ) {
    throw new RangeError("Profile V2 envelope is invalid.");
  }
  for (const entry of value.profiles) {
    if (
      !isRecord(entry) ||
      !isRecord(entry.data) ||
      "shiftCycle" in entry.data ||
      !Array.isArray(entry.data.shiftCycles) ||
      hasSourceIncarnation(entry.data)
    ) {
      throw new RangeError("Profile V2 patterns must be plural and incarnation-free.");
    }
  }
  const converted = convertProfileEntries(value.profiles);
  if (converted.quarantinedProfiles.length > 0 || hasDuplicateProfileIds(converted.profiles)) {
    throw new RangeError("Profile V2 contains invalid or duplicate profile records.");
  }
  return createDayFrameProfilesStorageV2(converted.profiles, value.quarantinedProfiles);
}

function hasSourceIncarnation(data: Record<string, unknown>): boolean {
  const collections = [
    "shiftDefinitions",
    "shiftCycles",
    "blockTemplates",
    "blockRecurrences",
    "manualEvents",
  ];
  for (const collection of collections) {
    const sources = data[collection];
    if (!Array.isArray(sources)) continue;
    for (const source of sources) {
      if (!isRecord(source)) continue;
      if ("incarnationId" in source) return true;
      if (collection === "shiftCycles") {
        for (const nested of [source.segments, source.sequence]) {
          if (
            Array.isArray(nested) &&
            nested.some((entry) => isRecord(entry) && "incarnationId" in entry)
          )
            return true;
        }
      }
    }
  }
  return false;
}

export function convertDayFrameProfilesStorageV1(value: unknown): ProfileV1Conversion {
  if (
    !isRecord(value) ||
    value.app !== "DayFrame" ||
    value.version !== 1 ||
    !Array.isArray(value.profiles)
  ) {
    throw new RangeError("Profile V1 collection is invalid.");
  }
  return convertProfileEntries(value.profiles);
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

function convertProfileEntries(entries: unknown[]): ProfileV1Conversion {
  const profiles: DayFrameSavedProfile[] = [];
  const quarantinedProfiles: unknown[] = [];
  for (const entry of entries) {
    if (
      !isRecord(entry) ||
      typeof entry.id !== "string" ||
      !entry.id.trim() ||
      typeof entry.name !== "string" ||
      !entry.name.trim() ||
      typeof entry.savedAt !== "string" ||
      !entry.savedAt ||
      !isRecord(entry.data)
    ) {
      quarantinedProfiles.push(structuredClone(entry));
      continue;
    }
    try {
      const data = stripSourceIncarnations(normalizeAuthoredSetup(entry.data));
      if (validateDayFrameAuthoredSetup(data).status === "invalid") {
        quarantinedProfiles.push(structuredClone(entry));
        continue;
      }
      profiles.push(
        createDayFrameSavedProfile({
          id: entry.id,
          name: entry.name,
          savedAt: entry.savedAt,
          data,
        }),
      );
    } catch {
      quarantinedProfiles.push(structuredClone(entry));
    }
  }
  if (hasDuplicateProfileIds(profiles)) {
    return { profiles: [], quarantinedProfiles: structuredClone(entries) };
  }
  return { profiles, quarantinedProfiles };
}

function stripSourceIncarnations(data: DayFrameAuthoredPattern): DayFrameAuthoredPattern {
  const strip = <T extends object>(source: T): Omit<T, "incarnationId"> => {
    const pattern = { ...source } as T & { incarnationId?: unknown };
    delete pattern.incarnationId;
    return pattern;
  };
  return {
    ...data,
    shiftDefinitions: data.shiftDefinitions.map(strip),
    shiftCycles: data.shiftCycles.map((cycle) => ({
      ...strip(cycle),
      segments: cycle.segments.map(strip),
      ...(cycle.sequence ? { sequence: cycle.sequence.map(strip) } : {}),
    })),
    blockTemplates: data.blockTemplates.map(strip),
    blockRecurrences: data.blockRecurrences.map(strip),
    manualEvents: data.manualEvents.map(strip),
  };
}

function hasDuplicateProfileIds(profiles: DayFrameSavedProfile[]): boolean {
  return new Set(profiles.map((profile) => profile.id)).size !== profiles.length;
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

function normalizeAuthoredSetup(value: Record<string, unknown>): DayFrameAuthoredPattern {
  const schedulingPreferences = isRecord(value.schedulingPreferences)
    ? value.schedulingPreferences
    : {};

  return {
    schedulingPreferences: {
      dayBoundaryStartTime:
        schedulingPreferences.dayBoundaryStartTime as DayFrameAuthoredPattern["schedulingPreferences"]["dayBoundaryStartTime"],
      weekStartsOn:
        schedulingPreferences.weekStartsOn as DayFrameAuthoredPattern["schedulingPreferences"]["weekStartsOn"],
    },
    previewRange: normalizePersistedPreviewRange(
      value.previewRange as Partial<DayFrameAuthoredPattern["previewRange"]> | undefined,
    ),
    shiftDefinitions: (value.shiftDefinitions ?? []) as DayFrameAuthoredPattern["shiftDefinitions"],
    shiftCycles: Array.isArray(value.shiftCycles)
      ? normalizeShiftCycles(value.shiftCycles as DayFrameAuthoredPattern["shiftCycles"])
      : value.shiftCycle
        ? normalizeShiftCycles([value.shiftCycle as DayFrameAuthoredPattern["shiftCycles"][number]])
        : [],
    blockTemplates: (value.blockTemplates ?? []) as DayFrameAuthoredPattern["blockTemplates"],
    blockRecurrences: (value.blockRecurrences ?? []) as DayFrameAuthoredPattern["blockRecurrences"],
    manualEvents: normalizeManualCalendarEvents(value.manualEvents),
  };
}
