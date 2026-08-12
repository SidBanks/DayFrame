import { describe, expect, it } from "vitest";

import type { DayFramePreviewRange } from "../../state/types.js";
import { getPreviewRangeWarnings } from "../previewRangeWarnings.js";

describe("getPreviewRangeWarnings", () => {
  it("warns when the preview range does not overlap the active cycle", () => {
    expect(
      getPreviewRangeWarnings(
        buildInput({
          previewRange: {
            preset: "custom",
            startDate: "2026-06-01",
            endDate: "2026-06-30",
          },
        }),
      ),
    ).toContainEqual({
      id: "previewOutsideCycle",
      message: "This preview range does not overlap the active cycle.",
    });
  });

  it("warns when no cycle segment covers part of the preview range", () => {
    expect(
      getPreviewRangeWarnings(
        buildInput({
          previewRange: {
            preset: "custom",
            startDate: "2026-05-04",
            endDate: "2026-05-08",
          },
          shiftCycles: [
            {
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
                  startsOnDate: "2026-05-04",
                  endsOnDate: "2026-05-06",
                },
              ],
              createdAt: "2026-05-01T00:00:00-05:00",
              updatedAt: "2026-05-01T00:00:00-05:00",
            },
          ],
        }),
      ),
    ).toContainEqual({
      id: "previewOutsideSegmentCoverage",
      message: "No cycle segment is active during part of this preview range.",
    });
  });

  it("does not warn when part of the preview range is a downtime day", () => {
    expect(
      getPreviewRangeWarnings(
        buildInput({
          previewRange: {
            preset: "custom",
            startDate: "2026-05-05",
            endDate: "2026-05-06",
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
              createdAt: "2026-05-01T00:00:00-05:00",
              updatedAt: "2026-05-01T00:00:00-05:00",
            },
          ],
        }),
      ),
    ).not.toContainEqual({
      id: "previewOutsideSegmentCoverage",
      message: "No cycle segment is active during part of this preview range.",
    });
  });

  it("warns when the preview may generate little or no schedule data", () => {
    expect(
      getPreviewRangeWarnings(
        buildInput({
          previewRange: {
            preset: "custom",
            startDate: "2026-05-06",
            endDate: "2026-05-06",
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
              createdAt: "2026-05-01T00:00:00-05:00",
              updatedAt: "2026-05-01T00:00:00-05:00",
            },
          ],
          blockTemplates: [],
          blockRecurrences: [],
        }),
      ),
    ).toContainEqual({
      id: "previewMayBeEmpty",
      message: "This preview may generate little or no schedule data.",
    });
  });
});

function buildInput(overrides?: {
  previewRange?: DayFramePreviewRange;
  shiftCycles?: Parameters<typeof getPreviewRangeWarnings>[0]["shiftCycles"];
  shiftDefinitions?: Parameters<typeof getPreviewRangeWarnings>[0]["shiftDefinitions"];
  blockTemplates?: Parameters<typeof getPreviewRangeWarnings>[0]["blockTemplates"];
  blockRecurrences?: Parameters<typeof getPreviewRangeWarnings>[0]["blockRecurrences"];
}): Parameters<typeof getPreviewRangeWarnings>[0] {
  return {
    previewRange: {
      preset: "threeDays" as const,
      startDate: "2026-05-04" as const,
      endDate: "2026-05-06" as const,
      ...overrides?.previewRange,
    },
    schedulingPreferences: {
      dayBoundaryStartTime: "03:00",
      weekStartsOn: "saturday",
    },
    shiftCycles: overrides?.shiftCycles ?? [
      {
        id: "cycle_001",
        userId: "user_001",
        name: "Day Rotation",
        type: "fixedSegments" as const,
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
        createdAt: "2026-05-01T00:00:00-05:00",
        updatedAt: "2026-05-01T00:00:00-05:00",
      },
    ],
    shiftDefinitions: overrides?.shiftDefinitions ?? [
      {
        id: "shift_day",
        userId: "user_001",
        name: "Day Shift",
        startTime: "05:45",
        endTime: "14:15",
        workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        crossesMidnight: false,
        createdAt: "2026-05-01T00:00:00-05:00",
        updatedAt: "2026-05-01T00:00:00-05:00",
      },
    ],
    blockTemplates: overrides?.blockTemplates ?? [
      {
        id: "template_sleep",
        userId: "user_001",
        title: "Sleep",
        category: "sleep" as const,
        placementType: "flexible" as const,
        durationMinutes: 480,
        priority: 1 as const,
        preferredWindow: "beforeWork" as const,
        rescheduleBehavior: "autoSameUserWeek" as const,
        requiresWorkAnchor: false,
        requiresResource: false,
        externalResources: [],
        enabled: true,
        createdAt: "2026-05-01T00:00:00-05:00",
        updatedAt: "2026-05-01T00:00:00-05:00",
      },
    ],
    blockRecurrences: overrides?.blockRecurrences ?? [
      {
        id: "rec_sleep",
        blockTemplateId: "template_sleep",
        frequency: "daily" as const,
      },
    ],
  };
}
