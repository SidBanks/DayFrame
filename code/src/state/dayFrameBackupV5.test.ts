import { describe, expect, it } from "vitest";
import {
  createDayFrameBackupV5,
  translateBackupV4ToV5,
  validateDayFrameBackupV5,
} from "./dayFrameBackupV5.js";
import { createDayFrameBackupV4 } from "./dayFrameBackupV4.js";
import { createInitialDayFrameState } from "./createInitialDayFrameState.js";
import { createActiveV2 } from "./activeV2.js";
import {
  definitionSemanticFingerprint,
  MANUAL_QUANTITY_TARGET_POLICY_V1,
} from "../core/measurement/measurementDefinition.js";
const goalId = "00000000-0000-4000-8000-000000000001" as never;
const goal = {
  version: 1 as const,
  id: goalId,
  revision: 1,
  title: "Write",
  status: "active" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  links: [],
};
const base = () => {
  const active = createActiveV2(createInitialDayFrameState());
  return {
    active: { surfaceVersion: 2 as const, data: active.data },
    profiles: { surfaceVersion: 2 as const, profiles: [], quarantinedProfiles: [] },
    planDecisions: { surfaceVersion: 1 as const, decisions: [], quarantinedDecisions: [] },
    executionHistory: {
      app: "DayFrame" as const,
      surface: "executionHistory" as const,
      version: 1 as const,
      records: [],
      quarantinedComponents: [],
    },
    historicalPlan: { surfaceVersion: 1 as const, batches: [] },
    goals: { version: 1 as const, goals: [goal] },
  };
};
describe("Backup V5", () => {
  it("roundtrips exact definitions and validates Goal references", () => {
    const core = {
      version: 1 as const,
      id: "00000000-0000-4000-8000-000000000002" as never,
      goalId,
      revision: 1,
      status: "active" as const,
      policyRef: MANUAL_QUANTITY_TARGET_POLICY_V1,
      config: { targetValue: "50", unitId: "words" },
      effectiveFrom: "2026-08-23T12:00:00.000Z",
      createdAt: "2026-08-23T12:00:00.000Z",
    };
    const definition = { ...core, fingerprint: definitionSemanticFingerprint(core) };
    const backup = createDayFrameBackupV5(
      { ...base(), measurementDefinitions: { version: 1, definitions: [definition] } },
      "2026-08-23T13:00:00.000Z",
    );
    expect(validateDayFrameBackupV5(JSON.parse(JSON.stringify(backup)))).toEqual(backup);
    expect(() =>
      validateDayFrameBackupV5({
        ...backup,
        data: { ...backup.data, goals: { version: 1, goals: [] } },
      }),
    ).toThrow();
  });
  it("translates V4 to explicit empty authority", () => {
    const old = createDayFrameBackupV4(base(), "2026-08-23T13:00:00.000Z");
    expect(translateBackupV4ToV5(old).data.measurementDefinitions).toEqual({
      version: 1,
      definitions: [],
    });
  });
});
