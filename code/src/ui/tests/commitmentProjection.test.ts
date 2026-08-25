import { describe, expect, it } from "vitest";
import { createInitialDayFrameState } from "../../state/createInitialDayFrameState.js";
import { deriveCommitmentSummaries } from "../commitmentProjection.js";
import { buildSetupDraft } from "../setupDraft.js";

describe("commitment projection", () => {
  it("derives product copy in authored order without mutating the draft", () => {
    const draft = buildSetupDraft(
      createInitialDayFrameState({
        blockTemplates: [
          {
            id: "sleep",
            userId: "user",
            title: "Sleep",
            category: "sleep",
            placementType: "flexible",
            durationMinutes: 480,
            priority: 1,
            preferredWindow: "beforeSleep",
            rescheduleBehavior: "askUser",
            requiresResource: false,
            externalResources: [],
            enabled: true,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
        blockRecurrences: [
          {
            id: "rec_sleep",
            blockTemplateId: "sleep",
            frequency: "timesPerUserWeek",
            timesPerUserWeek: 7,
          },
        ],
      }),
      "2026-01-01T00:00:00.000Z",
    );
    const before = structuredClone(draft);

    expect(deriveCommitmentSummaries(draft.templateEntries)).toEqual([
      expect.objectContaining({
        label: "Sleep",
        kind: "Sleep",
        recurrence: "7 times per user-week",
        preferredTiming: "Before sleep",
        reference: expect.objectContaining({ sourceKind: "blockTemplate", logicalId: "sleep" }),
      }),
    ]);
    expect(draft).toEqual(before);
  });

  it("keeps unsupported recurrence truthful", () => {
    const draft = buildSetupDraft(
      createInitialDayFrameState({
        blockTemplates: [
          {
            id: "custom",
            userId: "user",
            title: "Custom",
            category: "optional",
            placementType: "flexible",
            durationMinutes: 30,
            priority: 3,
            preferredWindow: "anyAvailable",
            rescheduleBehavior: "askUser",
            requiresResource: false,
            externalResources: [],
            enabled: false,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
        blockRecurrences: [{ id: "rec_custom", blockTemplateId: "custom", frequency: "custom" }],
      }),
      "2026-01-01T00:00:00.000Z",
    );
    expect(deriveCommitmentSummaries(draft.templateEntries)[0]).toMatchObject({
      recurrence: "Custom recurrence (advanced setup)",
      enabled: false,
    });
  });
});
