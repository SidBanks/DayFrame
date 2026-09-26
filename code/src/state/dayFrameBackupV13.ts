import { validateDayFrameBackupV12, type DayFrameBackupV12Data } from "./dayFrameBackupV12.js";
import { createActiveV3, validateActiveV3, type DayFrameActiveV3 } from "./activeV3.js";
import {
  createDayFrameProfilesStorageV3,
  validateDayFrameProfilesStorageV3,
} from "./dayFrameProfilesV3.js";
import { semanticFingerprint } from "../infrastructure/restore/restoreStaging.js";
import type { DayFrameSavedProfile } from "./types.js";
export type DayFrameBackupV13Data = Omit<DayFrameBackupV12Data, "active" | "profiles"> & {
  active: { surfaceVersion: 3; data: DayFrameActiveV3["data"] };
  profiles: { surfaceVersion: 3; profiles: DayFrameSavedProfile[]; quarantinedProfiles: unknown[] };
};
export type DayFrameBackupV13 = {
  app: "DayFrame";
  surface: "backup";
  version: 13;
  exportedAt: string;
  data: DayFrameBackupV13Data;
};
export function createDayFrameBackupV13(
  data: DayFrameBackupV13Data,
  exportedAt: string,
): DayFrameBackupV13 {
  return validateDayFrameBackupV13({
    app: "DayFrame",
    surface: "backup",
    version: 13,
    exportedAt,
    data,
  });
}
export function validateDayFrameBackupV13(value: unknown): DayFrameBackupV13 {
  if (
    !value ||
    typeof value !== "object" ||
    !("version" in value) ||
    value.version !== 13 ||
    !("data" in value) ||
    !value.data ||
    typeof value.data !== "object"
  )
    throw new RangeError("Invalid Backup V13 envelope.");
  const data = value.data as DayFrameBackupV13Data;
  if (data.active?.surfaceVersion !== 3 || data.profiles?.surfaceVersion !== 3)
    throw new RangeError("Backup V13 requires Active/Profiles V3.");
  const active = validateActiveV3({
    app: "DayFrame",
    surface: "active",
    version: 3,
    data: data.active.data,
  });
  const profiles = validateDayFrameProfilesStorageV3({
    app: "DayFrame",
    surface: "profiles",
    version: 3,
    profiles: data.profiles.profiles,
    quarantinedProfiles: data.profiles.quarantinedProfiles,
  });
  // Validate all existing authority through the established V12 chain, explicitly projecting only the new fields out.
  const oldActive = { ...active.data };
  delete (oldActive as { sleepRequirements?: unknown }).sleepRequirements;
  const oldProfiles = profiles.profiles.map((profile) => {
    const pattern = { ...profile.data };
    delete pattern.sleepRequirements;
    return { ...profile, data: pattern };
  });
  const legacy = validateDayFrameBackupV12({
    ...value,
    version: 12,
    data: {
      ...data,
      active: { surfaceVersion: 2, data: oldActive },
      profiles: {
        surfaceVersion: 2,
        profiles: oldProfiles,
        quarantinedProfiles: profiles.quarantinedProfiles,
      },
    },
  });
  for (const d of legacy.data.planDecisions.decisions) {
    if (d.kind !== "placeSleepOccurrence" || d.payload.revokedAt !== null) continue;
    {
      // Reference validation below uses the original V3 authority, never the legacy projection.
      const target = d.target;
      if (
        target.sourceKind !== "sleepRequirement" ||
        !active.data.sleepRequirements.some(
          (r) =>
            r.id === target.requirement.id && r.incarnationId === target.requirement.incarnationId,
        )
      )
        throw new RangeError(
          "Accepted Sleep placement has no matching source lifetime in Backup V13.",
        );
    }
  }
  return {
    ...legacy,
    version: 13,
    data: {
      ...legacy.data,
      active: { surfaceVersion: 3, data: active.data },
      profiles: {
        surfaceVersion: 3,
        profiles: profiles.profiles.sort((a, b) => a.id.localeCompare(b.id)),
        quarantinedProfiles: profiles.quarantinedProfiles,
      },
    },
  };
}
export function translateBackupV12ToV13(value: unknown): DayFrameBackupV13 {
  const legacy = validateDayFrameBackupV12(value);
  const active = createActiveV3({ ...legacy.data.active.data, sleepRequirements: [] });
  const profiles = createDayFrameProfilesStorageV3(
    legacy.data.profiles.profiles,
    legacy.data.profiles.quarantinedProfiles,
  );
  return createDayFrameBackupV13(
    {
      ...legacy.data,
      active: { surfaceVersion: 3, data: active.data },
      profiles: {
        surfaceVersion: 3,
        profiles: profiles.profiles,
        quarantinedProfiles: profiles.quarantinedProfiles,
      },
    },
    legacy.exportedAt,
  );
}
export function backupV13SemanticFingerprint(value: DayFrameBackupV13): string {
  return semanticFingerprint(validateDayFrameBackupV13(value).data);
}
