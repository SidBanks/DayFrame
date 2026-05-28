import { describe, expect, it } from "vitest";

import {
  cloneSavedProfiles,
  createDayFrameProfilesStorage,
  createDayFrameSavedProfile,
  validateDayFrameProfilesStorage,
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
    shiftDefinitions: [],
    shiftCycle: null,
    blockTemplates: [],
    blockRecurrences: [],
  };
}
