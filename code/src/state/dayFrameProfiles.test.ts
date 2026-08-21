import { describe, expect, it } from "vitest";

import {
  cloneSavedProfiles,
  convertDayFrameProfilesStorageV1,
  createDayFrameProfilesStorage,
  createDayFrameProfilesStorageV2,
  createDayFrameSavedProfile,
  validateDayFrameProfilesStorage,
  validateDayFrameProfilesStorageV2,
} from "./dayFrameProfiles.js";
import type { DayFrameAuthoredSetup } from "./types.js";

describe("dayFrameProfiles", () => {
  it("creates and clones saved profiles safely", () => {
    const profile = createDayFrameSavedProfile({
      id: "profile_1",
      name: "Week A",
      savedAt: "2026-05-05T09:00:00-05:00",
      data: buildAuthoredSetup(),
    });

    expect(profile).toEqual({
      id: "profile_1",
      name: "Week A",
      savedAt: "2026-05-05T09:00:00-05:00",
      data: buildAuthoredSetup(),
    });

    const clonedProfiles = cloneSavedProfiles([profile]);

    expect(clonedProfiles).toEqual([profile]);
    expect(clonedProfiles).not.toBe([profile]);
    expect(clonedProfiles[0]?.data).not.toBe(profile.data);
  });

  it("creates versioned profile storage", () => {
    const storage = createDayFrameProfilesStorage([
      createDayFrameSavedProfile({
        id: "profile_1",
        name: "Week A",
        savedAt: "2026-05-05T09:00:00-05:00",
        data: buildAuthoredSetup(),
      }),
    ]);

    expect(storage.app).toBe("DayFrame");
    expect(storage.version).toBe(1);
    expect(storage.profiles).toHaveLength(1);
  });

  it("validates a saved-profile storage payload", () => {
    const storage = validateDayFrameProfilesStorage({
      app: "DayFrame",
      version: 1,
      profiles: [
        {
          id: "profile_1",
          name: "Week A",
          savedAt: "2026-05-05T09:00:00-05:00",
          data: buildAuthoredSetup(),
        },
      ],
    });

    expect(storage?.profiles[0]?.name).toBe("Week A");
  });

  it("returns undefined for invalid storage payloads", () => {
    expect(validateDayFrameProfilesStorage(null)).toBeUndefined();
    expect(
      validateDayFrameProfilesStorage({ app: "Other", version: 1, profiles: [] }),
    ).toBeUndefined();
  });

  it("creates and validates an independently versioned incarnation-free Profile V2 envelope", () => {
    const profile = createDayFrameSavedProfile({
      id: "profile_v2",
      name: "Reusable Week",
      savedAt: "2026-05-05T09:00:00-05:00",
      data: buildAuthoredSetup(),
    });
    const storage = createDayFrameProfilesStorageV2([profile]);

    expect(storage).toMatchObject({
      app: "DayFrame",
      surface: "profiles",
      version: 2,
      quarantinedProfiles: [],
    });
    expect(validateDayFrameProfilesStorageV2(storage)).toEqual(storage);
  });

  it("rejects singular-cycle and incarnation-bearing Profile V2 records", () => {
    const base = createDayFrameProfilesStorageV2([
      createDayFrameSavedProfile({ id: "profile_v2", name: "Reusable Week",
        savedAt: "2026-05-05T09:00:00-05:00", data: buildAuthoredSetup() }),
    ]);
    const singular = structuredClone(base) as unknown as { profiles: Array<{ data: Record<string, unknown> }> };
    delete singular.profiles[0]!.data.shiftCycles;
    singular.profiles[0]!.data.shiftCycle = {};
    expect(() => validateDayFrameProfilesStorageV2(singular)).toThrow(RangeError);

    const incarnated = structuredClone(base) as unknown as { profiles: Array<{ data: {
      shiftDefinitions: unknown[] } }> };
    incarnated.profiles[0]!.data.shiftDefinitions = [{ incarnationId: "runtime-only" }];
    expect(() => validateDayFrameProfilesStorageV2(incarnated)).toThrow(RangeError);
  });

  it("converts valid V1 entries while preserving invalid entries for quarantine", () => {
    const invalidEntry = { id: "broken", name: "Broken", savedAt: "2026-05-05", data: null };
    const converted = convertDayFrameProfilesStorageV1({
      app: "DayFrame",
      version: 1,
      profiles: [{ id: "profile_1", name: "Week A", savedAt: "2026-05-05", data: buildAuthoredSetup() },
        invalidEntry],
    });

    expect(converted.profiles.map(({ id }) => id)).toEqual(["profile_1"]);
    expect(converted.quarantinedProfiles).toEqual([invalidEntry]);
  });

  it("saves and validates repeating sequence cycles in profiles", () => {
    const storage = validateDayFrameProfilesStorage({
      app: "DayFrame",
      version: 1,
      profiles: [
        {
          id: "profile_sequence",
          name: "Rig Rotation",
          savedAt: "2026-05-05T09:00:00-05:00",
          data: {
            ...buildAuthoredSetup(),
            shiftCycles: [
              {
                id: "cycle_sequence",
                userId: "user_001",
                name: "Rig Rotation",
                type: "fixedSegments",
                mode: "repeatingSequence",
                startsOnDate: "2026-05-01",
                endsOnDate: "2026-06-30",
                segments: [],
                sequenceAnchorDate: "2026-05-01",
                sequence: [
                  { id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: null },
                  { id: "sequence_day_2", dayOffset: 1, shiftDefinitionId: null },
                ],
                createdAt: "2026-05-03T00:00:00-05:00",
                updatedAt: "2026-05-03T00:00:00-05:00",
              },
            ],
          },
        },
      ],
    });

    expect(storage?.profiles[0]?.data.shiftCycles[0]).toMatchObject({
      mode: "repeatingSequence",
      sequenceAnchorDate: "2026-05-01",
      sequence: [
        { id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: null },
        { id: "sequence_day_2", dayOffset: 1, shiftDefinitionId: null },
      ],
    });
  });
});

function buildAuthoredSetup(): DayFrameAuthoredSetup {
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
    manualEvents: [],
    shiftDefinitions: [],
    shiftCycles: [],
    blockTemplates: [],
    blockRecurrences: [],
  };
}
