import { describe, expect, it } from "vitest";
import { goalFingerprint, validateGoal, validateGoalAuthority, type GoalV1 } from "./goal.js";

const id = "11111111-1111-4111-8111-111111111111" as GoalV1["id"];
const goal = (overrides: Partial<GoalV1> = {}): GoalV1 => ({
  version: 1,
  id,
  revision: 1,
  title: "Earn Security+",
  status: "active",
  createdAt: "2026-08-23T12:00:00.000Z",
  updatedAt: "2026-08-23T12:00:00.000Z",
  links: [],
  ...overrides,
});
describe("Goal V1", () => {
  it("validates qualitative, target, policy, lifecycle and exact-link Goals", () => {
    expect(validateGoal(goal()).status).toBe("valid");
    expect(
      validateGoal(goal({ status: "completed", completedAt: "2026-08-24T12:00:00.000Z" })).status,
    ).toBe("valid");
    expect(
      validateGoal(
        goal({
          targetDate: "2026-12-31",
          measurementPolicy: { id: "certification.pass", version: 1 },
          links: [{ sourceKind: "blockTemplate", id: "study", incarnationId: "life-1" as never }],
        }),
      ).status,
    ).toBe("valid");
  });
  it("rejects identity, timestamp, lifecycle and duplicate-link corruption", () => {
    expect(validateGoal(goal({ id: "title" as never })).status).toBe("invalid");
    expect(validateGoal(goal({ status: "completed" })).status).toBe("invalid");
    const link = {
      sourceKind: "blockTemplate" as const,
      id: "study",
      incarnationId: "life" as never,
    };
    expect(validateGoal(goal({ links: [link, link] })).status).toBe("invalid");
  });
  it("canonicalizes authority ordering and fingerprints semantic state", () => {
    const second = goal({ id: "22222222-2222-4222-8222-222222222222" as never, title: "B" });
    const checked = validateGoalAuthority({ version: 1, goals: [second, goal()] });
    expect(checked.status).toBe("valid");
    if (checked.status === "valid") expect(checked.authority.goals[0]?.id).toBe(id);
    expect(goalFingerprint({ version: 1, goals: [second, goal()] })).toBe(
      goalFingerprint({ version: 1, goals: [goal(), second] }),
    );
  });
});
