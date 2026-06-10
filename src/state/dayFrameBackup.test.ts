import { describe, expect, it } from "vitest";

import {
  cloneDayFrameAuthoredSetup,
  createDayFrameBackup,
  parseDayFrameBackupJson,
} from "./dayFrameBackup.js";
import type { DayFrameAuthoredSetup } from "./types.js";

describe("dayFrameBackup", () => {
  it("creates a versioned backup with authored setup data only", () => {
    const backup = createDayFrameBackup(buildAuthoredSetup(), "2026-05-05T10:00:00-05:00");

    expect(backup).toEqual({
      app: "DayFrame",
      version: 1,
      exportedAt: "2026-05-05T10:00:00-05:00",
      data: buildAuthoredSetup(),
    });
  });

  it("parses a valid backup json payload", () => {
    const backupJson = JSON.stringify(
      createDayFrameBackup(buildAuthoredSetup(), "2026-05-05T10:00:00-05:00"),
    );

    expect(parseDayFrameBackupJson(backupJson)).toEqual({
      app: "DayFrame",
      version: 1,
      exportedAt: "2026-05-05T10:00:00-05:00",
      data: buildAuthoredSetup(),
    });
  });

  it("rejects invalid json", () => {
    expect(() => parseDayFrameBackupJson("{")).toThrow("Backup file is not valid JSON.");
  });

  it("rejects unsupported backup objects", () => {
    expect(() =>
      parseDayFrameBackupJson(
        JSON.stringify({
          app: "NotDayFrame",
          version: 1,
          exportedAt: "2026-05-05T10:00:00-05:00",
          data: buildAuthoredSetup(),
        }),
      ),
    ).toThrow("Backup file is not a DayFrame backup.");

    expect(() =>
      parseDayFrameBackupJson(
        JSON.stringify({
          app: "DayFrame",
          version: 2,
          exportedAt: "2026-05-05T10:00:00-05:00",
          data: buildAuthoredSetup(),
        }),
      ),
    ).toThrow("Backup file version is not supported.");
  });

  it("clones authored setup data deeply enough for safe reuse", () => {
    const clonedSetup = cloneDayFrameAuthoredSetup(buildAuthoredSetup());

    expect(clonedSetup).toEqual(buildAuthoredSetup());
    expect(clonedSetup).not.toBe(buildAuthoredSetup());
    expect(clonedSetup.shiftDefinitions).not.toBe(buildAuthoredSetup().shiftDefinitions);
    expect(clonedSetup.blockTemplates[0]?.externalResources).not.toBe(
      buildAuthoredSetup().blockTemplates[0]?.externalResources,
    );
  });
});

function buildAuthoredSetup(): DayFrameAuthoredSetup {
  return {
    schedulingPreferences: {
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
    },
    previewRange: {
      preset: "oneWeek",
      startDate: "2026-05-04",
      endDate: "2026-05-11",
    },
    manualEvents: [],
    shiftDefinitions: [
      {
        id: "shift_day",
        userId: "user_001",
        name: "Day Shift",
        startTime: "05:45",
        endTime: "14:15",
        workDays: ["monday"],
        crossesMidnight: false,
        createdAt: "2026-05-03T00:00:00-05:00",
        updatedAt: "2026-05-03T00:00:00-05:00",
      },
    ],
    shiftCycle: {
      id: "cycle_001",
      userId: "user_001",
      name: "Day Rotation",
      type: "fixedSegments",
      startsOnDate: "2026-05-01",
      endsOnDate: "2026-05-31",
      createdAt: "2026-05-03T00:00:00-05:00",
      updatedAt: "2026-05-03T00:00:00-05:00",
      segments: [
        {
          id: "segment_day",
          shiftCycleId: "cycle_001",
          shiftDefinitionId: "shift_day",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
        },
      ],
    },
    blockTemplates: [
      {
        id: "template_review",
        userId: "user_001",
        title: "Schedule Review",
        category: "review",
        requiresWorkAnchor: false,
        placementType: "flexible",
        durationMinutes: 30,
        priority: 2,
        preferredWindow: "beforeWork",
        rescheduleBehavior: "autoSameUserWeek",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        createdAt: "2026-05-03T00:00:00-05:00",
        updatedAt: "2026-05-03T00:00:00-05:00",
      },
    ],
    blockRecurrences: [
      {
        id: "rec_review",
        blockTemplateId: "template_review",
        frequency: "specificWeekdays",
        weekdays: ["monday"],
      },
    ],
  };
}
