import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { generateSchedulePreview } from "../core/engine/generateSchedulePreview.js";
import { createDayFrameStore } from "./dayFrameStore.js";

describe("Goal planning scheduling boundary", () => {
  it("Demand, Priority, and Projection change neither schedule output nor Friction", async () => {
    Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: new IDBFactory() });
    const store = createDayFrameStore();
    await store.whenReady();
    const goal = await store.createGoal({ title: "Study" });
    if (goal.status !== "accepted") throw new Error("goal");
    const schedule = () => {
      const state = store.getState();
      return generateSchedulePreview({
        shiftDefinitions: state.shiftDefinitions,
        shiftCycles: state.shiftCycles,
        blockTemplates: state.blockTemplates,
        blockRecurrences: state.blockRecurrences,
        manualEvents: state.manualEvents,
        dayBoundaryStartTime: state.schedulingPreferences.dayBoundaryStartTime,
        weekStartsOn: state.schedulingPreferences.weekStartsOn,
        planningWindowStart: new Date("2026-09-07T00:00:00.000Z"),
        planningWindowEnd: new Date("2026-09-14T00:00:00.000Z"),
        generatedAt: "2026-09-04T12:00:00.000Z",
      });
    };
    const before = schedule();
    const demand = await store.createDemand({
      goalId: goal.goal.id,
      requestedEffort: { unit: "minutes", amount: 120 },
      horizon: {
        kind: "userDayInterval",
        startUserDayDate: "2026-09-07",
        endUserDayDateExclusive: "2026-09-14",
      },
      session: { mode: "indivisible", exactMinutes: 120 },
      satisfaction: { kind: "minimum", allowPartial: false },
      cadence: { kind: "total" },
    });
    await store.createPriority({
      goalId: goal.goal.id,
      level: "critical",
      scope: { kind: "default" },
    });
    if (demand.status !== "accepted") throw new Error("demand");
    expect((await store.projectGoalDemand(demand.value.id)).status).toBe("projected");
    const after = schedule();
    expect(after).toEqual(before);
    expect(after.frictionPoints).toEqual(before.frictionPoints);
  });
});
