import { validateSleepRequirementPatterns } from "../core/sleep/sleepRequirement.js";
import { cloneSavedProfiles, validateDayFrameProfilesStorageV2 } from "./dayFrameProfiles.js";
import type { DayFrameSavedProfile } from "./types.js";
export type DayFrameProfilesStorageV3 = {
  app: "DayFrame";
  surface: "profiles";
  version: 3;
  profiles: DayFrameSavedProfile[];
  quarantinedProfiles: unknown[];
};
export function createDayFrameProfilesStorageV3(
  profiles: DayFrameSavedProfile[],
  quarantinedProfiles: unknown[] = [],
): DayFrameProfilesStorageV3 {
  return validateDayFrameProfilesStorageV3({
    app: "DayFrame",
    surface: "profiles",
    version: 3,
    profiles: profiles.map((profile) => ({
      ...profile,
      data: {
        ...profile.data,
        sleepRequirements:
          profile.data.sleepRequirements === undefined ? [] : profile.data.sleepRequirements,
      },
    })),
    quarantinedProfiles,
  });
}
export function validateDayFrameProfilesStorageV3(value: unknown): DayFrameProfilesStorageV3 {
  if (
    !value ||
    typeof value !== "object" ||
    !("version" in value) ||
    value.version !== 3 ||
    !("profiles" in value) ||
    !Array.isArray(value.profiles)
  )
    throw new RangeError("Invalid Profiles V3 envelope.");
  if (
    value.profiles.some(
      (profile: DayFrameSavedProfile) => profile.data && "legacySleepConversions" in profile.data,
    )
  )
    throw new RangeError("Profiles cannot carry live Sleep conversion lineage.");
  const sleep = value.profiles.map((profile: DayFrameSavedProfile) =>
    validateSleepRequirementPatterns(
      profile.data.sleepRequirements === undefined ? [] : profile.data.sleepRequirements,
    ),
  );
  const legacy = validateDayFrameProfilesStorageV2({
    ...value,
    version: 2,
    profiles: value.profiles.map((profile: DayFrameSavedProfile) => {
      const data = { ...profile.data };
      delete data.sleepRequirements;
      return { ...profile, data };
    }),
  });
  return {
    ...legacy,
    version: 3,
    profiles: cloneSavedProfiles(legacy.profiles).map((profile, index) => ({
      ...profile,
      data: {
        ...profile.data,
        ...(sleep[index]!.length ? { sleepRequirements: sleep[index]! } : {}),
      },
    })),
  };
}
export function translateProfilesV2ToV3(value: unknown): DayFrameProfilesStorageV3 {
  const legacy = validateDayFrameProfilesStorageV2(value);
  return createDayFrameProfilesStorageV3(legacy.profiles, legacy.quarantinedProfiles);
}
export function readProfilesV3(value: unknown): DayFrameProfilesStorageV3 {
  return value && typeof value === "object" && "version" in value && value.version === 2
    ? translateProfilesV2ToV3(value)
    : validateDayFrameProfilesStorageV3(value);
}
