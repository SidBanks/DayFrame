import { createInitialDayFrameState } from "../../state/createInitialDayFrameState.js";
import { discoverLegacySleep } from "./legacySleepConversion.js";
import type { ConversionContext, ConversionRequest } from "./legacySleepConversion.js";
import { createSourceIncarnationId } from "../authored/sourceIncarnation.js";
export function conversionFixture(): { context: ConversionContext; request: ConversionRequest } {
  const setup = createInitialDayFrameState();
  setup.blockTemplates = [
    {
      id: "legacy-sleep",
      incarnationId: createSourceIncarnationId(),
      userId: "u",
      title: "Sleep",
      category: "sleep",
      placementType: "flexible",
      durationMinutes: 120,
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 20,
      priority: 1,
      preferredWindow: "custom",
      customWindowStartTime: "22:00",
      customWindowEndTime: "08:00",
      rescheduleBehavior: "autoSameDay",
      requiresResource: false,
      externalResources: [],
      enabled: true,
      createdAt: "2026-09-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
    },
  ];
  setup.blockRecurrences = [
    {
      id: "legacy-daily",
      incarnationId: createSourceIncarnationId(),
      blockTemplateId: "legacy-sleep",
      frequency: "daily",
      startsOnDate: "2026-09-01",
    },
  ];
  const selection = discoverLegacySleep(setup)[0]!.selection;
  return {
    context: {
      setup,
      authority: {
        status: "complete",
        planDecisions: [],
        realizedFacts: [],
        composition: { authority: { version: 1, relationships: [], decisions: [] }, sources: [] },
      },
      history: [],
      historyReady: true,
      now: "2026-09-20T12:00:00.000Z",
    },
    request: { selection, cutover: "2026-10-01" },
  };
}
