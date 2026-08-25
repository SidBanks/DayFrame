import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createGoalSurface } from "./goalSurface.js";
const ids = [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
] as const;
let database = 0;
const setup = (factory = new IDBFactory(), name = `goals-${database++}`) => ({
  factory,
  name,
  storage: createDayFrameDurableDb({ indexedDB: factory, name }),
});
describe("GoalSurface", () => {
  it("persists CRUD lifecycle and exact many-to-many links with revisions", async () => {
    const db = setup();
    let index = 0;
    let clock = 0;
    const surface = createGoalSurface({
      storage: db.storage,
      allocateGoalId: () => ids[index++] as never,
      now: () => `2026-08-${String(23 + clock++).padStart(2, "0")}T12:00:00.000Z`,
      isLinkAvailable: () => false,
    });
    expect(await surface.initializeGoals()).toEqual({ status: "ready" });
    const created = await surface.createGoal({ title: "Earn Security+" });
    expect(created.status).toBe("accepted");
    if (created.status !== "accepted") return;
    const link = {
      sourceKind: "blockTemplate" as const,
      id: "study",
      incarnationId: "life-a" as never,
    };
    const linked = await surface.linkCommitment(created.goal.id, 1, link);
    expect(linked.status).toBe("accepted");
    expect(surface.getGoalLinkAvailability(created.goal.id)).toEqual([
      { link, status: "unavailable" },
    ]);
    expect((await surface.linkCommitment(created.goal.id, 2, link)).status).toBe("rejected");
    const completed = await surface.completeGoal(created.goal.id, 2);
    expect(completed.status).toBe("accepted");
    if (completed.status !== "accepted") return;
    expect(completed.goal).toMatchObject({
      revision: 3,
      status: "completed",
      completedAt: expect.any(String),
    });
    const restarted = createGoalSurface({
      storage: createDayFrameDurableDb({ indexedDB: db.factory, name: db.name }),
    });
    expect(await restarted.initializeGoals()).toEqual({ status: "ready" });
    expect(restarted.listGoals()).toHaveLength(1);
    expect(restarted.getGoalsForCommitment(link)).toHaveLength(1);
  });
  it("protects invalid durable authority and clears terminally", async () => {
    const db = setup();
    await db.storage.put("goals", { id: "bad" });
    const surface = createGoalSurface({ storage: db.storage });
    expect(await surface.initializeGoals()).toEqual({ status: "protected" });
    const clean = createGoalSurface({
      storage: createDayFrameDurableDb({
        indexedDB: new IDBFactory(),
        name: `clean-${database++}`,
      }),
    });
    await clean.initializeGoals();
    expect(await clean.clearGoals()).toEqual({ status: "removed" });
  });
});
