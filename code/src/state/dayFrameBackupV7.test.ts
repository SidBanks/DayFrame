import { describe, expect, it } from "vitest";
import type { GoalId, GoalV1 } from "../core/goals/goal.js";
import {
  createDirectAuthoringProvenance,
  type GoalStructureRelationshipV1,
} from "../core/planning/goalStructure.js";
import { planningRevision, type PlanningFactId } from "../core/planning/planningFoundation.js";
import { createInitialDayFrameState } from "./createInitialDayFrameState.js";
import { createDayFrameBackupV3 } from "./dayFrameBackupV3.js";
import { createDayFrameBackupV4 } from "./dayFrameBackupV4.js";
import { createDayFrameBackupV5 } from "./dayFrameBackupV5.js";
import { createDayFrameBackupV6 } from "./dayFrameBackupV6.js";
import {
  createDayFrameBackupV7,
  translateBackupV6ToV7,
  validateDayFrameBackupV7,
} from "./dayFrameBackupV7.js";

const at = "2026-09-03T12:00:00.000Z";
const goal = (id: string): GoalV1 => ({
  version: 1,
  id: id as GoalId,
  revision: 1,
  title: id,
  status: "active",
  createdAt: at,
  updatedAt: at,
  links: [],
});
function v6(goals: GoalV1[] = []) {
  const v3 = createDayFrameBackupV3(
    {
      active: { surfaceVersion: 2, data: createInitialDayFrameState() },
      profiles: { surfaceVersion: 2, profiles: [], quarantinedProfiles: [] },
      planDecisions: { surfaceVersion: 1, decisions: [], quarantinedDecisions: [] },
      executionHistory: {
        app: "DayFrame",
        surface: "executionHistory",
        version: 1,
        records: [],
        quarantinedComponents: [],
      },
      historicalPlan: { surfaceVersion: 1, batches: [] },
    },
    at,
  );
  const v4 = createDayFrameBackupV4({ ...v3.data, goals: { version: 1, goals } }, at);
  const v5 = createDayFrameBackupV5(
    { ...v4.data, measurementDefinitions: { version: 1, definitions: [] } },
    at,
  );
  return createDayFrameBackupV6(
    { ...v5.data, progressObservations: { version: 1, observations: [] } },
    at,
  );
}
describe("Backup V7", () => {
  it("migrates V6 to explicit empty Goal Structure without inference", () => {
    expect(translateBackupV6ToV7(v6()).data.goalStructure).toEqual({
      version: 1,
      relationships: [],
      milestones: [],
    });
  });
  it("round-trips exact Goal Structure identities and rejects dangling or malformed authority", () => {
    const goals = [
      goal("11111111-1111-4111-8111-111111111111"),
      goal("22222222-2222-4222-8222-222222222222"),
    ];
    const relationship: GoalStructureRelationshipV1 = {
      recordType: "relationship",
      version: 1,
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as PlanningFactId,
      revision: planningRevision(1),
      kind: "contains",
      sourceGoalId: goals[0]!.id,
      target: { kind: "goal", goalId: goals[1]!.id },
      semantics: { kind: "containment", requiredness: "required" },
      status: "active",
      createdAt: at,
      updatedAt: at,
      effectiveFrom: at,
      provenance: createDirectAuthoringProvenance(),
    };
    const backup = createDayFrameBackupV7(
      {
        ...v6(goals).data,
        goalStructure: { version: 1, relationships: [relationship], milestones: [] },
      },
      at,
    );
    expect(
      validateDayFrameBackupV7(JSON.parse(JSON.stringify(backup))).data.goalStructure
        .relationships[0],
    ).toEqual(relationship);
    expect(() =>
      validateDayFrameBackupV7({
        ...backup,
        data: { ...backup.data, goals: { version: 1, goals: [goals[0]] } },
      }),
    ).toThrow(RangeError);
    expect(() =>
      validateDayFrameBackupV7({
        ...backup,
        data: { ...backup.data, goalStructure: { ...backup.data.goalStructure, version: 2 } },
      }),
    ).toThrow(RangeError);
  });
});
