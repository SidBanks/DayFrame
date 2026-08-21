import { describe, expect, it } from "vitest";

import { generateBlockCandidates } from "../../blocks/generateBlockCandidates.js";
import type { BlockCandidate, BlockRecurrence, BlockTemplate } from "../../blocks/types.js";

const template: BlockTemplate = {
  id: "template_workout",
  userId: "user_001",
  title: "Workout",
  category: "fitness",
  placementType: "flexible",
  durationMinutes: 60,
  priority: 2,
  preferredWindow: "anyAvailable",
  rescheduleBehavior: "askUser",
  requiresResource: false,
  externalResources: [],
  enabled: true,
  createdAt: "2026-05-01T00:00:00-05:00",
  updatedAt: "2026-05-01T00:00:00-05:00",
};

describe("template occurrence identity", () => {
  it.each([
    ["daily", "2026-05-10"],
    ["specificWeekdays", "2026-05-10"],
  ] as const)(
    "keeps a shared %s user-day identity across overlapping windows",
    (frequency, date) => {
      const recurrence: BlockRecurrence = {
        id: `rec_${frequency}`,
        blockTemplateId: template.id,
        frequency,
        ...(frequency === "specificWeekdays" ? { weekdays: ["sunday" as const] } : {}),
      };
      const wide = generate(recurrence, new Date(2026, 4, 9, 3), new Date(2026, 4, 12, 3));
      const narrow = generate(recurrence, new Date(2026, 4, 10, 3), new Date(2026, 4, 11, 3));
      const wideOccurrence = wide.find((candidate) => candidate.userDayDate === date);
      const narrowOccurrence = narrow.find((candidate) => candidate.userDayDate === date);

      expect(wideOccurrence?.occurrenceIdentity).toEqual(narrowOccurrence?.occurrenceIdentity);
      expect(wideOccurrence?.occurrenceIdentity).toMatchObject({
        version: 1,
        sourceKind: "template",
        frequency,
        templateId: template.id,
        recurrenceId: recurrence.id,
        scopeKind: "userDay",
        userDayDate: date,
        slot: 0,
      });
    },
  );

  it("keeps weekly scope and slot identity stable across equivalent regeneration", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_weekly",
      blockTemplateId: template.id,
      frequency: "weekly",
    };
    const first = generate(recurrence, new Date(2026, 4, 9, 3), new Date(2026, 4, 16, 3));
    const second = generate(recurrence, new Date(2026, 4, 9, 3), new Date(2026, 4, 14, 3));

    expect(first[0]?.occurrenceIdentity).toEqual(second[0]?.occurrenceIdentity);
    expect(first[0]?.occurrenceIdentity).toEqual({
      version: 1,
      sourceKind: "template",
      frequency: "weekly",
      templateId: template.id,
      recurrenceId: recurrence.id,
      scopeKind: "userWeek",
      userWeekStartDate: "2026-05-09",
      slot: 0,
    });
    expect(first[0]?.id).toBe("candidate_template_workout_rec_weekly_2026-05-09");
  });

  it("preserves canonical times-per-week slot numbers after earlier slots are clipped", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_three_times",
      blockTemplateId: template.id,
      frequency: "timesPerUserWeek",
      timesPerUserWeek: 3,
    };
    const full = generate(recurrence, new Date(2026, 4, 9, 3), new Date(2026, 4, 16, 3));
    const clipped = generate(recurrence, new Date(2026, 4, 10, 3), new Date(2026, 4, 12, 3));

    expect(full.map((candidate) => getSlot(candidate.occurrenceIdentity))).toEqual([0, 1, 2]);
    expect(clipped.map((candidate) => getSlot(candidate.occurrenceIdentity))).toEqual([1, 2]);
    expect(clipped.map((candidate) => candidate.occurrenceIdentity)).toEqual(
      full.slice(1).map((candidate) => candidate.occurrenceIdentity),
    );
  });

  it("uses recurrence-bound canonical slots consistently across overlapping windows", () => {
    const recurrence: BlockRecurrence = {
      id: "rec_bounded",
      blockTemplateId: template.id,
      frequency: "timesPerUserWeek",
      timesPerUserWeek: 2,
      startsOnDate: "2026-05-13",
    };
    const wide = generate(recurrence, new Date(2026, 4, 9, 3), new Date(2026, 4, 16, 3));
    const overlap = generate(recurrence, new Date(2026, 4, 14, 3), new Date(2026, 4, 16, 3));

    expect(wide.map((candidate) => getSlot(candidate.occurrenceIdentity))).toEqual([0, 1]);
    expect(overlap[0]?.occurrenceIdentity).toEqual(wide[1]?.occurrenceIdentity);
    expect(getSlot(overlap[0]?.occurrenceIdentity)).toBe(1);
  });
});

function getSlot(identity: BlockCandidate["occurrenceIdentity"]): number | undefined {
  return identity && "slot" in identity ? identity.slot : undefined;
}

function generate(recurrence: BlockRecurrence, planningWindowStart: Date, planningWindowEnd: Date) {
  return generateBlockCandidates({
    blockTemplates: [template],
    blockRecurrences: [recurrence],
    planningWindowStart,
    planningWindowEnd,
    dayBoundaryStartTime: "03:00",
    weekStartsOn: "saturday",
  });
}
