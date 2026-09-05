import { describe, expect, it } from "vitest";
import { createInitialDayFrameState } from "./createInitialDayFrameState.js";
import { createDayFrameBackupV10 } from "./dayFrameBackupV10.js";
import { translateBackupV10ToV11 } from "./dayFrameBackupV11.js";
import {
  assertBackupV11DowngradeSafe,
  translateBackupV11ToV12,
  validateDayFrameBackupV12,
} from "./dayFrameBackupV12.js";
import { createDayFrameBackupV9 } from "./dayFrameBackupV9.js";
import { createExecutionHistoryEnvelope } from "./executionHistorySurface.js";

describe("Backup V12 realization authority", () => {
  it("migrates older data to explicit empty realization authority", () => {
    const state = createInitialDayFrameState();
    const active = {
      schedulingPreferences: state.schedulingPreferences,
      previewRange: state.previewRange,
      shiftDefinitions: state.shiftDefinitions,
      shiftCycles: state.shiftCycles,
      blockTemplates: state.blockTemplates,
      blockRecurrences: state.blockRecurrences,
      manualEvents: state.manualEvents,
    };
    const v9 = createDayFrameBackupV9(
      {
        active: { surfaceVersion: 2, data: active },
        profiles: {
          surfaceVersion: 2,
          profiles: [],
          quarantinedProfiles: [],
        },
        planDecisions: { surfaceVersion: 1, decisions: [], quarantinedDecisions: [] },
        executionHistory: createExecutionHistoryEnvelope([], []),
        historicalPlan: { surfaceVersion: 1, batches: [] },
        goals: { version: 1, goals: [] },
        measurementDefinitions: { version: 1, definitions: [] },
        progressObservations: { version: 1, observations: [] },
        goalStructure: { version: 1, relationships: [], milestones: [] },
        goalPlanning: { version: 1, demands: [], priorities: [] },
        composition: { version: 1, relationships: [], decisions: [] },
      },
      "2026-09-05T00:00:00.000Z",
    );
    const v10 = createDayFrameBackupV10(
      {
        ...v9.data,
        proposals: {
          version: 1,
          proposals: [],
          candidates: [],
          decisions: [],
          acceptedAllocations: [],
        },
      },
      v9.exportedAt,
    );
    const migrated = translateBackupV11ToV12(translateBackupV10ToV11(v10));
    expect(validateDayFrameBackupV12(migrated).data.realizations).toEqual({
      version: 1,
      realizations: [],
      facts: [],
    });
  });

  it("refuses downgrade when scheduled reality would be lost", () => {
    expect(() =>
      assertBackupV11DowngradeSafe({ version: 1, realizations: [{} as never], facts: [] }),
    ).toThrow(/cannot preserve/i);
  });
});
