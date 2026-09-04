import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import type { GoalId, GoalV1 } from "../core/goals/goal.js";
import type { PlanningFactId } from "../core/planning/planningFoundation.js";
import {
  GOAL_STRUCTURE_STORE,
  createDayFrameDurableDb,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import { createGoalStructureSurface } from "./goalStructureSurface.js";

const goals: GoalV1[] = [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
].map((id, index) => ({
  version: 1,
  id: id as GoalId,
  revision: 1,
  title: `Goal ${index}`,
  status: "active",
  createdAt: "2026-09-03T12:00:00.000Z",
  updatedAt: "2026-09-03T12:00:00.000Z",
  links: [],
}));
const allocated = [
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
] as unknown as PlanningFactId[];
let dbIndex = 0;
describe("Goal Structure surface", () => {
  it("persists atomic relationship and Milestone revision histories", async () => {
    const factory = new IDBFactory(),
      name = `goal-structure-${dbIndex++}`;
    let index = 0,
      tick = 0;
    const options = {
      storage: createDayFrameDurableDb({ indexedDB: factory, name }),
      getGoal: (id: GoalId) => goals.find((goal) => goal.id === id),
      listGoals: () => structuredClone(goals),
      allocateId: () => allocated[index++]!,
      now: () => `2026-09-0${3 + tick++}T12:00:00.000Z`,
    };
    const surface = createGoalStructureSurface(options);
    expect(await surface.initializeGoalStructure()).toEqual({ status: "ready" });
    const created = await surface.createRelationship({
      kind: "contains",
      sourceGoalId: goals[0]!.id,
      target: { kind: "goal", goalId: goals[1]!.id },
      semantics: { kind: "containment", requiredness: "required" },
    });
    expect(created).toMatchObject({
      status: "accepted",
      value: { revision: 1 },
      changed: true,
      persistence: "durable",
    });
    if (created.status !== "accepted") return;
    expect(await surface.reviseRelationship(created.value.id, 1, {})).toMatchObject({
      status: "accepted",
      changed: false,
      value: { revision: 1 },
    });
    expect(
      await surface.reviseRelationship(created.value.id, 1, {
        semantics: { kind: "containment", requiredness: "optional" },
      }),
    ).toMatchObject({ status: "accepted", changed: true, value: { revision: 2 } });
    expect(await surface.retireRelationship(created.value.id, 2)).toMatchObject({
      status: "accepted",
      value: { revision: 3, status: "retired" },
    });
    const milestone = await surface.createMilestone({
      ownerGoalId: goals[0]!.id,
      title: "Checkpoint",
    });
    expect(milestone).toMatchObject({
      status: "accepted",
      value: { revision: 1, state: "active" },
    });
    if (milestone.status !== "accepted") return;
    expect(
      await surface.reviseMilestone(milestone.value.id, 1, { state: "satisfied" }),
    ).toMatchObject({ status: "accepted", value: { revision: 2, state: "satisfied" } });
    const restarted = createGoalStructureSurface({
      ...options,
      storage: createDayFrameDurableDb({ indexedDB: factory, name }),
    });
    expect(await restarted.initializeGoalStructure()).toEqual({ status: "ready" });
    expect(restarted.getGoalStructureRelationshipRevision(created.value.id, 1)).toMatchObject({
      status: "resolved",
    });
    expect(restarted.getGoalStructureMilestoneRevision(milestone.value.id, 2)).toMatchObject({
      status: "resolved",
    });
  });
  it("rejects invalid graph without partially mutating authority and protects malformed persistence", async () => {
    const storage = createDayFrameDurableDb({
      indexedDB: new IDBFactory(),
      name: `goal-structure-${dbIndex++}`,
    });
    let index = 0;
    const surface = createGoalStructureSurface({
      storage,
      getGoal: (id) => goals.find((goal) => goal.id === id),
      listGoals: () => goals,
      allocateId: () => allocated[index++]!,
      now: () => "2026-09-03T12:00:00.000Z",
    });
    await surface.initializeGoalStructure();
    expect(
      await surface.createRelationship({
        kind: "contains",
        sourceGoalId: goals[0]!.id,
        target: { kind: "goal", goalId: goals[0]!.id },
        semantics: { kind: "containment", requiredness: "required" },
      }),
    ).toMatchObject({ status: "rejected", reason: "invalidGraph" });
    expect(surface.exportGoalStructureAuthority().relationships).toEqual([]);
    await storage.put(GOAL_STRUCTURE_STORE, { recordType: "relationship", id: "bad", revision: 1 });
    const protectedSurface = createGoalStructureSurface({
      storage,
      getGoal: () => undefined,
      listGoals: () => goals,
    });
    expect(await protectedSurface.initializeGoalStructure()).toEqual({ status: "protected" });
  });
});
