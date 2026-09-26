/** Diagnostic observations of the unmodified owner, not acceptance tests endorsing defects. */
import {
  it,
  expect,
} from "../../../../../code/node_modules/vitest/dist/index.js";
import { IDBFactory } from "../../../../../code/node_modules/fake-indexeddb/build/esm/index.js";
import { writeFileSync } from "node:fs";
import { createGoalStructureSurface } from "../../../../../code/src/state/goalStructureSurface.js";
import { createDayFrameDurableDb } from "../../../../../code/src/infrastructure/storage/dayFrameDurableDb.js";
import { validateGoalStructureAuthority } from "../../../../../code/src/core/planning/goalStructure.js";
import type {
  GoalId,
  GoalV1,
} from "../../../../../code/src/core/goals/goal.js";

it("records the current owner contracts that prevent a fidelity-safe presentation-only completion", async () => {
  const goals: GoalV1[] = [
    "11111111-1111-4111-8111-111111111111",
    "22222222-2222-4222-8222-222222222222",
  ].map((id) => ({
    version: 1,
    id: id as GoalId,
    revision: 1,
    title: "Duplicate title",
    status: "active",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
    links: [],
  }));
  let at = "2026-10-01T00:00:00.000Z",
    allowed = true;
  const storage = createDayFrameDurableDb({
    indexedDB: new IDBFactory(),
    name: "disposable-927-contract",
  });
  const surface = createGoalStructureSurface({
    storage,
    getGoal: (id) => goals.find((g) => g.id === id),
    listGoals: () => goals,
    now: () => at,
    canMutate: () => allowed,
  });
  expect(await surface.initializeGoalStructure()).toEqual({ status: "ready" });
  const relationship = await surface.createRelationship({
    kind: "dependsOn",
    sourceGoalId: goals[0].id,
    target: { kind: "goal", goalId: goals[1].id },
    semantics: {
      kind: "dependency",
      strength: "hard",
      condition: "goalCompleted",
    },
  });
  if (relationship.status !== "accepted")
    throw Error("Fixture creation rejected");
  at = "2026-09-23T12:00:00.000Z";
  const beforeEffectiveFrom = surface.getStructuralEligibility(goals[0].id);
  expect(beforeEffectiveFrom.status).toBe("ineligible");
  const retired = await surface.retireRelationship(relationship.value.id, 1);
  if (retired.status !== "accepted") throw Error("Retirement rejected");
  expect(retired.value.effectiveTo! < retired.value.effectiveFrom).toBe(true);
  const invalidIntervalValidation = validateGoalStructureAuthority(
    surface.exportGoalStructureAuthority(),
    goals,
  );
  expect(invalidIntervalValidation.status).toBe("valid");
  const milestone = await surface.createMilestone({
    ownerGoalId: goals[0].id,
    title: "Checkpoint",
  });
  if (milestone.status !== "accepted")
    throw Error("Milestone creation rejected");
  at = "2026-09-24T00:00:00.000Z";
  const satisfied = await surface.reviseMilestone(milestone.value.id, 1, {
    state: "satisfied",
  });
  if (satisfied.status !== "accepted") throw Error("Satisfaction rejected");
  at = "2026-09-25T00:00:00.000Z";
  const renamed = await surface.reviseMilestone(milestone.value.id, 2, {
    title: "Renamed checkpoint",
  });
  if (renamed.status !== "accepted") throw Error("Rename rejected");
  expect(renamed.value.satisfiedAt).not.toBe(satisfied.value.satisfiedAt);
  const earlier = surface.getGoalStructureMilestoneRevision(
    milestone.value.id,
    2,
  );
  expect(earlier).toEqual({ status: "resolved", milestone: satisfied.value });
  allowed = false;
  const blockedCreate = await surface.createMilestone({
    ownerGoalId: goals[0].id,
    title: "Blocked",
  });
  expect(blockedCreate).toEqual({
    status: "rejected",
    reason: "authorityTransactionActive",
  });
  const unguardedRevision = await surface.reviseMilestone(
    milestone.value.id,
    3,
    { title: "Changed while mutation admission denied" },
  );
  expect(unguardedRevision.status).toBe("accepted");
  const restarted = createGoalStructureSurface({
    storage,
    getGoal: (id) => goals.find((g) => g.id === id),
    listGoals: () => goals,
  });
  expect(await restarted.initializeGoalStructure()).toEqual({
    status: "ready",
  });
  expect(restarted.exportGoalStructureAuthority()).toEqual(
    surface.exportGoalStructureAuthority(),
  );
  writeFileSync(
    new URL("./contract-observations-RESULT.json", import.meta.url),
    JSON.stringify(
      {
        kind: "Controlled canonical-owner reproduction; no production-browser or protected user data used",
        futureInterval: {
          evaluationClock: "2026-09-23T12:00:00.000Z",
          clockArgumentAcceptedByQuery: false,
          relationship: relationship.value,
          actualEligibility: beforeEffectiveFrom,
        },
        reversedInterval: {
          retirement: retired,
          validatorStatus: invalidIntervalValidation.status,
          reloadAccepted: true,
        },
        titleOnlyEdit: {
          patch: { title: "Renamed checkpoint" },
          before: satisfied.value,
          after: renamed.value,
          priorRevisionStillExact: true,
        },
        mutationAdmissionDenied: {
          create: blockedCreate,
          revise: unguardedRevision,
        },
      },
      null,
      2,
    ) + "\n",
  );
});
