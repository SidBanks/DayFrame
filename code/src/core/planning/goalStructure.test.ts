import { describe, expect, it } from "vitest";
import type { GoalId, GoalV1 } from "../goals/goal.js";
import { planningRevision, type PlanningFactId } from "./planningFoundation.js";
import {
  createDirectAuthoringProvenance,
  emptyGoalStructureAuthority,
  evaluateStructuralEligibilityFreshness,
  queryStructuralEligibility,
  resolveRelationshipRevision,
  validateGoalStructureAuthority,
  type GoalStructureMilestoneV1,
  type GoalStructureRelationshipV1,
} from "./goalStructure.js";

const ids = [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
  "33333333-3333-4333-8333-333333333333",
  "44444444-4444-4444-8444-444444444444",
] as const;
const relationIds = [
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
] as unknown as PlanningFactId[];
const goal = (index: number, status: GoalV1["status"] = "active"): GoalV1 => ({
  version: 1,
  id: ids[index]! as GoalId,
  revision: 1,
  title: `Goal ${index}`,
  status,
  createdAt: "2026-09-03T12:00:00.000Z",
  updatedAt: "2026-09-03T12:00:00.000Z",
  ...(status === "completed"
    ? { completedAt: "2026-09-03T12:00:00.000Z" }
    : status === "archived"
      ? { archivedAt: "2026-09-03T12:00:00.000Z" }
      : {}),
  links: [],
});
const edge = (
  index: number,
  kind: GoalStructureRelationshipV1["kind"],
  from: number,
  to: number,
  overrides: Partial<GoalStructureRelationshipV1> = {},
): GoalStructureRelationshipV1 => ({
  recordType: "relationship",
  version: 1,
  id: relationIds[index]!,
  revision: planningRevision(1),
  kind,
  sourceGoalId: goal(from).id,
  target: { kind: "goal", goalId: goal(to).id },
  semantics:
    kind === "contains"
      ? { kind: "containment", requiredness: "required" }
      : kind === "contributesTo"
        ? { kind: "contribution", mode: "nonAggregating" }
        : { kind: "dependency", strength: "hard", condition: "goalCompleted" },
  status: "active",
  createdAt: "2026-09-03T12:00:00.000Z",
  updatedAt: "2026-09-03T12:00:00.000Z",
  effectiveFrom: "2026-09-03T12:00:00.000Z",
  provenance: createDirectAuthoringProvenance(),
  ...overrides,
});

describe("Goal Structure V1", () => {
  it("preserves typed direction and deterministic canonical ordering", () => {
    const contains = edge(0, "contains", 0, 1),
      contributes = edge(1, "contributesTo", 1, 0);
    const checked = validateGoalStructureAuthority(
      { version: 1, relationships: [contributes, contains], milestones: [] },
      [goal(0), goal(1)],
    );
    expect(checked.status).toBe("valid");
    if (checked.status === "valid")
      expect(checked.authority.relationships.map((item) => item.id)).toEqual([
        contains.id,
        contributes.id,
      ]);
    expect(contains.kind).not.toBe(contributes.kind);
    expect(contains.sourceGoalId).not.toBe((contains.target as { goalId: GoalId }).goalId);
  });
  it("rejects self edges, duplicate edges, second parents, containment cycles, and dependency cycles", () => {
    const goals = [goal(0), goal(1), goal(2)];
    const self = validateGoalStructureAuthority(
      { version: 1, relationships: [edge(0, "contains", 0, 0)], milestones: [] },
      goals,
    );
    expect(self.status).toBe("invalid");
    expect(self.status === "invalid" && self.issues.map((issue) => issue.code)).toContain(
      "selfRelationship",
    );
    const multipleParents = validateGoalStructureAuthority(
      {
        version: 1,
        relationships: [edge(0, "contains", 0, 2), edge(1, "contains", 1, 2)],
        milestones: [],
      },
      goals,
    );
    expect(
      multipleParents.status === "invalid" && multipleParents.issues.map((x) => x.code),
    ).toContain("multipleContainmentParents");
    const containmentCycle = validateGoalStructureAuthority(
      {
        version: 1,
        relationships: [edge(0, "contains", 0, 1), edge(1, "contains", 1, 0)],
        milestones: [],
      },
      goals,
    );
    expect(
      containmentCycle.status === "invalid" && containmentCycle.issues.map((x) => x.code),
    ).toContain("containmentCycle");
    const dependencyCycle = validateGoalStructureAuthority(
      {
        version: 1,
        relationships: [edge(0, "dependsOn", 0, 1), edge(1, "dependsOn", 1, 0)],
        milestones: [],
      },
      goals,
    );
    expect(
      dependencyCycle.status === "invalid" && dependencyCycle.issues.map((x) => x.code),
    ).toContain("dependencyCycle");
    expect(
      validateGoalStructureAuthority(
        {
          version: 1,
          relationships: [edge(0, "contributesTo", 0, 1), edge(1, "contributesTo", 1, 0)],
          milestones: [],
        },
        goals,
      ).status,
    ).toBe("valid");
  });
  it("derives four-state lifecycle and dependency eligibility with exact evidence", () => {
    const dependency = edge(0, "dependsOn", 0, 1);
    const authority = { version: 1 as const, relationships: [dependency], milestones: [] };
    const blocked = queryStructuralEligibility({
      goalId: goal(0).id,
      goals: [goal(0), goal(1)],
      authority,
    });
    expect(blocked).toMatchObject({
      status: "ineligible",
      reasons: [{ code: "goalStructure.prerequisiteUnsatisfied" }],
    });
    expect(
      queryStructuralEligibility({
        goalId: goal(0).id,
        goals: [goal(0), goal(1, "completed")],
        authority,
      }).status,
    ).toBe("eligible");
    expect(
      queryStructuralEligibility({
        goalId: goal(0).id,
        goals: [goal(0), goal(1, "archived")],
        authority,
      }).status,
    ).toBe("unknown");
    const advisory = {
      ...dependency,
      semantics: {
        kind: "dependency" as const,
        strength: "advisory" as const,
        condition: "goalCompleted" as const,
      },
    };
    expect(
      queryStructuralEligibility({
        goalId: goal(0).id,
        goals: [goal(0), goal(1)],
        authority: { ...authority, relationships: [advisory] },
      }).status,
    ).toBe("conditionallyEligible");
    expect(evaluateStructuralEligibilityFreshness(blocked, authority, [goal(0), goal(1)])).toEqual({
      status: "current",
    });
    const revised = {
      ...dependency,
      revision: planningRevision(2),
      updatedAt: "2026-09-04T12:00:00.000Z",
    };
    expect(
      evaluateStructuralEligibilityFreshness(
        blocked,
        {
          ...authority,
          relationships: [dependency, revised],
        },
        [goal(0), goal(1)],
      ),
    ).toMatchObject({ status: "stale" });
    expect(
      evaluateStructuralEligibilityFreshness(blocked, authority, [
        goal(0),
        { ...goal(1, "completed"), revision: 2 },
      ]),
    ).toMatchObject({ status: "stale" });
  });
  it("validates Goal-owned Milestones without time, Demand, Priority, or Progress fields", () => {
    const milestone: GoalStructureMilestoneV1 = {
      recordType: "milestone",
      version: 1,
      id: relationIds[2]!,
      revision: planningRevision(1),
      ownerGoalId: goal(0).id,
      title: "Pass practice threshold",
      state: "active",
      satisfactionPolicy: { kind: "manual" },
      createdAt: "2026-09-03T12:00:00.000Z",
      updatedAt: "2026-09-03T12:00:00.000Z",
      provenance: createDirectAuthoringProvenance(),
    };
    expect(
      validateGoalStructureAuthority({ version: 1, relationships: [], milestones: [milestone] }, [
        goal(0),
      ]).status,
    ).toBe("valid");
    expect(milestone).not.toHaveProperty("durationMinutes");
    expect(milestone).not.toHaveProperty("progress");
  });
  it("fails malformed/future state and resolves exact retired history", () => {
    expect(
      validateGoalStructureAuthority({ ...emptyGoalStructureAuthority(), version: 2 }, []).status,
    ).toBe("invalid");
    const first = edge(0, "contains", 0, 1),
      retired = {
        ...first,
        revision: planningRevision(2),
        status: "retired" as const,
        updatedAt: "2026-09-04T12:00:00.000Z",
        effectiveTo: "2026-09-04T12:00:00.000Z",
      };
    const authority = { version: 1 as const, relationships: [first, retired], milestones: [] };
    expect(resolveRelationshipRevision(authority, first.id, planningRevision(1))).toMatchObject({
      status: "resolved",
      relationship: { status: "active" },
    });
    expect(resolveRelationshipRevision(authority, first.id, planningRevision(3))).toEqual({
      status: "notFound",
    });
  });
});
