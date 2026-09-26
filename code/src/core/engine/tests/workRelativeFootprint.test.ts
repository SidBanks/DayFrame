import { describe, expect, it } from "vitest";
import { generateSchedulePreview } from "../generateSchedulePreview.js";
import type { PreferredWindow } from "../../blocks/types.js";
const timestamps = { createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" };
function generate(night: boolean, preferredWindow: PreferredWindow, buffer = 30, clipped = false) {
  return generateSchedulePreview({
    shiftDefinitions: [
      {
        id: "work",
        userId: "user",
        name: "Work",
        startTime: night ? "21:45" : "09:00",
        endTime: night ? "06:15" : "17:00",
        crossesMidnight: night,
        workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        ...timestamps,
      },
    ],
    shiftCycles: [
      {
        id: "cycle",
        userId: "user",
        name: "Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        segments: [
          {
            id: "segment",
            shiftCycleId: "cycle",
            shiftDefinitionId: "work",
            startsOnDate: "2026-05-01",
            endsOnDate: "2026-05-31",
          },
        ],
        ...timestamps,
      },
    ],
    blockTemplates: [
      {
        id: "workout",
        userId: "user",
        title: "Workout",
        category: "fitness",
        placementType: "flexible",
        durationMinutes: 60,
        bufferBeforeMinutes: buffer,
        bufferAfterMinutes: buffer,
        priority: 3,
        preferredWindow,
        rescheduleBehavior: "autoSameUserWeek",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        ...timestamps,
      },
    ],
    blockRecurrences: [
      {
        id: "recurrence",
        blockTemplateId: "workout",
        frequency: "specificWeekdays",
        weekdays: ["monday", "wednesday", "friday"],
      },
    ],
    planningWindowStart: new Date(2026, 4, 4, 3),
    planningWindowEnd: clipped ? new Date(2026, 4, 5, 7) : new Date(2026, 4, 9, 12),
    dayBoundaryStartTime: "03:00",
    weekStartsOn: "monday",
    generatedAt: timestamps.createdAt,
  });
}
describe("production work-relative full-footprint placement", () => {
  it.each([
    [false, "afterWork", 30, 17, 30],
    [true, "afterWork", 30, 6, 45],
    [true, "afterWork", 0, 6, 15],
    [false, "beforeWork", 30, 7, 30],
    [true, "beforeWork", 30, 20, 15],
    [true, "anyAvailable", 30, 3, 30],
  ] as const)(
    "night=%s %s buffer=%i fits the complete footprint",
    (night, window, buffer, hour, minute) => {
      const result = generate(night, window, buffer);
      const blocks = result.scheduledBlocks.filter((b) => b.templateId === "workout");
      expect(blocks).toHaveLength(3);
      expect(result.unplacedCandidates).toHaveLength(0);
      expect(result.frictionPoints).toHaveLength(0);
      expect(blocks[0]!.startsAt.getHours()).toBe(hour);
      expect(blocks[0]!.startsAt.getMinutes()).toBe(minute);
      for (const block of blocks) {
        const start = block.startsAt.getTime() - buffer * 60_000;
        const end = block.endsAt.getTime() + buffer * 60_000;
        expect(block.endsAt.getTime() - block.startsAt.getTime()).toBe(60 * 60_000);
        expect(
          result.generatedWorkBlocks.some(
            (w) => start < w.endsAt.getTime() && end > w.startsAt.getTime(),
          ),
        ).toBe(false);
      }
    },
  );
  it("retains visible-range clipping when the overnight footprint cannot fit", () => {
    const result = generate(true, "afterWork", 30, true);
    expect(result.unplacedCandidates.some((c) => c.userDayDate === "2026-05-04")).toBe(true);
    expect(
      result.scheduledBlocks.some(
        (b) => b.templateId === "workout" && b.userDayDate === "2026-05-04",
      ),
    ).toBe(false);
  });
});
