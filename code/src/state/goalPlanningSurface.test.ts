import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import type { GoalId, GoalV1 } from "../core/goals/goal.js";
import {
  emptyGoalStructureAuthority,
  queryStructuralEligibility,
} from "../core/planning/goalStructure.js";
import type { PlanningFactId } from "../core/planning/planningFoundation.js";
import {
  createDayFrameDurableDb,
  GOAL_PLANNING_STORE,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import { createGoalPlanningSurface } from "./goalPlanningSurface.js";

const at = "2026-09-04T12:00:00.000Z";
const goal: GoalV1 = {
  version: 1,
  id: "11111111-1111-4111-8111-111111111111" as GoalId,
  revision: 1,
  title: "Study",
  status: "active",
  createdAt: at,
  updatedAt: at,
  links: [],
};
const ids = [
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
  "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
] as PlanningFactId[];
let sequence = 0;
const create = (name: string) => {
  const storage = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name });
  let index = 0,
    tick = 0;
  return {
    storage,
    surface: createGoalPlanningSurface({
      storage,
      getGoal: (id) => (id === goal.id ? goal : undefined),
      listGoals: () => [goal],
      getStructuralEligibility: (id) =>
        queryStructuralEligibility({
          goalId: id,
          goals: [goal],
          authority: emptyGoalStructureAuthority(),
        }),
      getUserDayResolver: () => ({
        shiftCycles: [],
        defaultSchedulingPreferences: { dayBoundaryStartTime: "04:00", weekStartsOn: "monday" },
      }),
      allocateId: () => ids[index++]!,
      now: () => `2026-09-${String(4 + tick++).padStart(2, "0")}T12:00:00.000Z`,
    }),
  };
};
const demandInput = {
  goalId: goal.id,
  requestedEffort: { unit: "minutes" as const, amount: 120 },
  horizon: {
    kind: "userDayInterval" as const,
    startUserDayDate: "2026-09-07" as const,
    endUserDayDateExclusive: "2026-09-14" as const,
  },
  session: { mode: "splittable" as const, minimumMinutes: 30 },
  satisfaction: { kind: "target" as const, allowPartial: false as const },
  cadence: { kind: "total" as const },
};

describe("Goal planning surface", () => {
  it("persists Demand/Priority revisions, no-ops, lifecycle, projections, and exact history", async () => {
    const name = `goal-planning-${sequence++}`,
      { storage, surface } = create(name);
    await surface.initializeGoalPlanning();
    const demand = await surface.createDemand(demandInput),
      priority = await surface.createPriority({
        goalId: goal.id,
        level: "high",
        scope: { kind: "default" },
      });
    expect(demand).toMatchObject({ status: "accepted", value: { revision: 1 } });
    expect(priority).toMatchObject({ status: "accepted", value: { revision: 1 } });
    if (demand.status !== "accepted" || priority.status !== "accepted") return;
    expect(await surface.reviseDemand(demand.value.id, 1, {})).toMatchObject({
      changed: false,
      value: { revision: 1 },
    });
    expect(
      await surface.reviseDemand(demand.value.id, 1, {
        requestedEffort: { unit: "minutes", amount: 180 },
        session: { mode: "splittable", minimumMinutes: 30 },
      }),
    ).toMatchObject({ status: "accepted", value: { revision: 2 } });
    expect(await surface.suspendDemand(demand.value.id, 2)).toMatchObject({
      status: "accepted",
      value: { revision: 3, lifecycle: "suspended" },
    });
    expect(await surface.projectGoalDemand(demand.value.id)).toMatchObject({
      status: "projected",
      projection: { applicability: "inapplicable", requestedEffort: { amount: 180 } },
    });
    expect(await surface.revisePriority(priority.value.id, 1, { level: "critical" })).toMatchObject(
      { status: "accepted", value: { revision: 2 } },
    );
    const specification = await surface.createDemandResourceFootprintSpec({
      name: "Prepared session",
      variants: [
        {
          id: "standard",
          name: "Standard",
          components: [
            {
              id: "setup",
              role: "supportActivity",
              scope: "perSession",
              requiredness: "required",
              durationMinutes: 15,
              geometry: { kind: "endsAtProductiveStart" },
              actor: "user",
              source: { kind: "direct" },
            },
          ],
        },
      ],
    });
    expect(specification).toMatchObject({ status: "accepted", value: { revision: 1 } });
    if (specification.status !== "accepted") return;
    expect(
      await surface.setDemandResourceFootprintAssociation({
        demandId: demand.value.id,
        selection: {
          kind: "specification",
          specificationId: specification.value.id,
          specificationRevision: specification.value.revision,
          variantId: "standard",
          selectedOptionalComponentIds: [],
        },
      }),
    ).toMatchObject({ status: "accepted", value: { revision: 1 } });
    const restarted = createGoalPlanningSurface({
      storage,
      getGoal: () => goal,
      listGoals: () => [goal],
      getStructuralEligibility: () =>
        queryStructuralEligibility({
          goalId: goal.id,
          goals: [goal],
          authority: emptyGoalStructureAuthority(),
        }),
      getUserDayResolver: () => ({
        shiftCycles: [],
        defaultSchedulingPreferences: { dayBoundaryStartTime: "04:00", weekStartsOn: "monday" },
      }),
    });
    await restarted.initializeGoalPlanning();
    expect(restarted.getGoalDemandRevision(demand.value.id, 1)).toMatchObject({
      status: "resolved",
      demand: { requestedEffort: { amount: 120 } },
    });
    expect(restarted.getGoalPriorityRevision(priority.value.id, 2)).toMatchObject({
      status: "resolved",
      priority: { level: "critical" },
    });
    expect(restarted.getGoalDemandRevision(demand.value.id, 9)).toEqual({ status: "notFound" });
    expect(restarted.resolveDemandResourceFootprintAssociation(demand.value.id)).toMatchObject({
      status: "resolved",
      components: [{ id: "setup", role: "supportActivity" }],
    });
  });
  it("rejects invalid input atomically and protects malformed persisted state", async () => {
    const { storage, surface } = create(`goal-planning-${sequence++}`);
    await surface.initializeGoalPlanning();
    expect(
      await surface.createDemand({
        ...demandInput,
        goalId: "22222222-2222-4222-8222-222222222222" as GoalId,
      }),
    ).toMatchObject({ status: "rejected", reason: "missingGoal" });
    expect(surface.exportGoalPlanningAuthority()).toEqual({
      version: 2,
      demands: [],
      priorities: [],
      footprintSpecifications: [],
      footprintAssociations: [],
    });
    const valid = await surface.createDemand(demandInput);
    if (valid.status !== "accepted") throw new Error("valid demand setup");
    await storage.put(GOAL_PLANNING_STORE, {
      ...valid.value,
      version: 2,
      revision: 2,
    });
    const protectedSurface = createGoalPlanningSurface({
      storage,
      getGoal: () => goal,
      listGoals: () => [goal],
      getStructuralEligibility: () =>
        queryStructuralEligibility({
          goalId: goal.id,
          goals: [goal],
          authority: emptyGoalStructureAuthority(),
        }),
      getUserDayResolver: () => ({
        shiftCycles: [],
        defaultSchedulingPreferences: { dayBoundaryStartTime: "04:00", weekStartsOn: "monday" },
      }),
    });
    expect(await protectedSurface.initializeGoalPlanning()).toEqual({ status: "protected" });
  });
});
