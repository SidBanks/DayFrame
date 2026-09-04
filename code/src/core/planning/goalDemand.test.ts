import { describe, expect, it } from "vitest";
import type { GoalId, GoalV1 } from "../goals/goal.js";
import {
  applicablePriorityForGoal,
  directPlanningAuthoringProvenance,
  validateGoalPlanningAuthority,
  type GoalDemandIntentV1,
  type GoalPriorityV1,
} from "./goalDemand.js";
import { evaluateDemandProjectionFreshness, projectDemand } from "./goalDemandProjection.js";
import { planningRevision, type PlanningFactId } from "./planningFoundation.js";
import { emptyGoalStructureAuthority, queryStructuralEligibility } from "./goalStructure.js";

const at = "2026-09-04T12:00:00.000Z";
const ids = ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222"];
const factIds = [
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
] as PlanningFactId[];
const goal = (index = 0, revision = 1): GoalV1 => ({
  version: 1,
  id: ids[index] as GoalId,
  revision,
  title: `Goal ${index}`,
  status: "active",
  createdAt: at,
  updatedAt: at,
  links: [],
});
const demand = (overrides: Partial<GoalDemandIntentV1> = {}): GoalDemandIntentV1 => ({
  recordType: "demand",
  version: 1,
  id: factIds[0]!,
  revision: planningRevision(1),
  goalId: goal().id,
  lifecycle: "active",
  requestedEffort: { unit: "minutes", amount: 120 },
  horizon: {
    kind: "userDayInterval",
    startUserDayDate: "2026-09-07",
    endUserDayDateExclusive: "2026-09-14",
  },
  session: { mode: "splittable", minimumMinutes: 30, preferredMinutes: 60, maximumMinutes: 90 },
  satisfaction: { kind: "target", allowPartial: true, minimumSatisfiedMinutes: 60 },
  cadence: { kind: "sessionCount", count: 2 },
  createdAt: at,
  updatedAt: at,
  effectiveFrom: at,
  provenance: directPlanningAuthoringProvenance(),
  ...overrides,
});
const priority = (overrides: Partial<GoalPriorityV1> = {}): GoalPriorityV1 => ({
  recordType: "priority",
  version: 1,
  id: factIds[1]!,
  revision: planningRevision(1),
  goalId: goal().id,
  level: "normal",
  scope: { kind: "default" },
  status: "active",
  createdAt: at,
  updatedAt: at,
  effectiveFrom: at,
  provenance: directPlanningAuthoringProvenance(),
  ...overrides,
});
const coverage = {
  version: 1 as const,
  kind: "canonicalUserDayInterval" as const,
  startUserDayDate: "2026-09-07" as const,
  endUserDayDateExclusive: "2026-09-14" as const,
  startsAt: "2026-09-07T09:00:00.000Z",
  endsAt: "2026-09-14T09:00:00.000Z",
  startDayBoundaryTime: "04:00" as const,
  endDayBoundaryTime: "04:00" as const,
};

describe("Goal Demand, Priority, and Projection V1", () => {
  it("validates independently identified multiple Demands and exact contiguous revision history", () => {
    const second = demand({ id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" as PlanningFactId });
    expect(
      validateGoalPlanningAuthority({ version: 1, demands: [second, demand()], priorities: [] }, [
        goal(),
      ]),
    ).toMatchObject({ status: "valid" });
    expect(
      validateGoalPlanningAuthority(
        { version: 1, demands: [demand({ revision: planningRevision(2) })], priorities: [] },
        [goal()],
      ),
    ).toMatchObject({ status: "invalid", issues: [{ code: "invalidRevisionHistory" }] });
  });
  it("rejects missing Goals and incoherent effort, horizon, session, satisfaction, and cadence", () => {
    const invalid = [
      demand({ requestedEffort: { unit: "minutes", amount: 0 } }),
      demand({
        horizon: {
          kind: "userDayInterval",
          startUserDayDate: "2026-09-14",
          endUserDayDateExclusive: "2026-09-07",
        },
      }),
      demand({ session: { mode: "indivisible", exactMinutes: 90 } }),
      demand({
        satisfaction: { kind: "target", allowPartial: true, minimumSatisfiedMinutes: 121 },
      }),
      demand({ cadence: { kind: "sessionCount", count: 5 } }),
    ];
    for (const item of invalid)
      expect(
        validateGoalPlanningAuthority({ version: 1, demands: [item], priorities: [] }, [goal()])
          .status,
      ).toBe("invalid");
    expect(
      validateGoalPlanningAuthority({ version: 1, demands: [demand()], priorities: [] }, [goal(1)])
        .status,
    ).toBe("invalid");
  });
  it("uses stable Priority ordering and bounded override precedence without Commitment priority", () => {
    expect(["low", "normal", "high", "critical"]).toEqual(["low", "normal", "high", "critical"]);
    const bounded = priority({
      id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" as PlanningFactId,
      level: "critical",
      scope: {
        kind: "userDayInterval",
        startUserDayDate: "2026-09-07",
        endUserDayDateExclusive: "2026-09-14",
      },
    });
    const authority = { version: 1 as const, demands: [], priorities: [bounded, priority()] };
    expect(validateGoalPlanningAuthority(authority, [goal()]).status).toBe("valid");
    expect(applicablePriorityForGoal(authority, goal().id, "2026-09-08")?.level).toBe("critical");
    expect(applicablePriorityForGoal(authority, goal().id, "2026-09-20")?.level).toBe("normal");
  });
  it("projects explicit effort over exact canonical user-day coverage deterministically", () => {
    const eligibility = queryStructuralEligibility({
      goalId: goal().id,
      goals: [goal()],
      authority: emptyGoalStructureAuthority(),
    });
    const input = {
      demand: demand(),
      goal: goal(),
      structuralEligibility: eligibility,
      coverage,
    };
    const first = projectDemand(input),
      second = projectDemand(input);
    expect(first).toEqual(second);
    expect(first).toMatchObject({
      requestedEffort: { unit: "minutes", amount: 120 },
      applicability: "applicable",
      coverage: {
        startUserDayDate: "2026-09-07",
        endUserDayDateExclusive: "2026-09-14",
        startDayBoundaryTime: "04:00",
      },
    });
    expect(first.dependencies.map((item) => item.kind)).toContain("goal.demand");
    expect(
      evaluateDemandProjectionFreshness(first, {
        demand: demand(),
        goal: goal(),
        structuralEligibility: eligibility,
      }),
    ).toEqual({ status: "current" });
    expect(
      evaluateDemandProjectionFreshness(first, {
        demand: demand(),
        goal: goal(0, 2),
        structuralEligibility: eligibility,
      }),
    ).toMatchObject({ status: "stale" });
  });
  it("preserves ineligible, conditional, and unknown structural states", () => {
    const base = queryStructuralEligibility({
      goalId: goal().id,
      goals: [goal()],
      authority: emptyGoalStructureAuthority(),
    });
    const make = (status: typeof base.status) =>
      projectDemand({
        demand: demand(),
        goal: goal(),
        structuralEligibility: { ...base, status },
        coverage,
      }).applicability;
    expect(make("ineligible")).toBe("inapplicable");
    expect(make("conditionallyEligible")).toBe("conditional");
    expect(make("unknown")).toBe("unknown");
  });
});
