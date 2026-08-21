import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../../authored/sourceIncarnation.js";
import { instantiateActiveSetup } from "../../../state/activeV2.js";
import type { DayFrameAuthoredPattern } from "../../../state/types.js";
import { generateSchedulePreview } from "../generateSchedulePreview.js";

const pattern: DayFrameAuthoredPattern = {
  schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "saturday" },
  previewRange: { preset: "threeDays", startDate: "2026-05-04", endDate: "2026-05-06" },
  shiftDefinitions: [{ id: "shift-1", userId: "user-1", name: "Shift", startTime: "09:00",
    endTime: "17:00", workDays: ["monday"], crossesMidnight: false,
    createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" }],
  shiftCycles: [{ id: "cycle-1", userId: "user-1", name: "Cycle", type: "fixedSegments",
    startsOnDate: "2026-05-01", endsOnDate: "2026-05-31", createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z", segments: [{ id: "segment-1", shiftCycleId: "cycle-1",
      shiftDefinitionId: "shift-1", startsOnDate: "2026-05-01", endsOnDate: "2026-05-31" }] }],
  blockTemplates: [{ id: "template-1", userId: "user-1", title: "Template", category: "admin",
    placementType: "flexible", durationMinutes: 30, priority: 2, preferredWindow: "anyAvailable",
    rescheduleBehavior: "askUser", requiresResource: false, externalResources: [], enabled: true,
    createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" }],
  blockRecurrences: [{ id: "recurrence-1", blockTemplateId: "template-1", frequency: "daily" }],
  manualEvents: [],
};

function allocateFrom(start: number) {
  let value = start;
  return () => `00000000-0000-4000-8000-${String(value++).padStart(12, "0")}` as SourceIncarnationId;
}

describe("source incarnation scheduling non-interference", () => {
  it("does not affect scheduling or OccurrenceIdentity V1", () => {
    const first = instantiateActiveSetup(pattern, allocateFrom(1));
    const second = instantiateActiveSetup(pattern, allocateFrom(101));
    const generate = (active: typeof first) => generateSchedulePreview({
      ...active,
      planningWindowStart: new Date(2026, 4, 4, 0, 0),
      planningWindowEnd: new Date(2026, 4, 4, 23, 59, 59, 999),
      dayBoundaryStartTime: active.schedulingPreferences.dayBoundaryStartTime,
      weekStartsOn: active.schedulingPreferences.weekStartsOn,
      generatedAt: "2026-05-03T00:00:00Z",
    });

    const firstResult = generate(first);
    const secondResult = generate(second);
    expect(secondResult).toEqual(firstResult);
    for (const identity of firstResult.scheduledBlocks.map((block) => block.occurrenceIdentity)) {
      if (!identity) continue;
      expect(identity.version).toBe(1);
      expect(identity).not.toHaveProperty("incarnationId");
    }
  });
});
