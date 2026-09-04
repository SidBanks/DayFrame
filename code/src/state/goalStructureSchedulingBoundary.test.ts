import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { generateSchedulePreview } from "../core/engine/generateSchedulePreview.js";
import { createDayFrameStore } from "./dayFrameStore.js";

describe("Goal Structure scheduling boundary", () => {
  it("does not change a generated schedule for equivalent authored scheduling state", async () => {
    Object.defineProperty(globalThis, "indexedDB", {
      configurable: true,
      value: new IDBFactory(),
    });
    const store = createDayFrameStore();
    const ready = await store.whenReady();
    if (ready.status !== "ready")
      throw new Error(
        JSON.stringify({
          ready,
          goal: store.getGoalIngressStatus(),
          structure: store.getGoalStructureIngressStatus(),
        }),
      );
    const first = await store.createGoal({ title: "Parent" }),
      second = await store.createGoal({ title: "Child" });
    if (first.status !== "accepted" || second.status !== "accepted") throw new Error("goal setup");
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
        planningWindowStart: new Date("2026-09-03T00:00:00.000Z"),
        planningWindowEnd: new Date("2026-09-05T00:00:00.000Z"),
        generatedAt: "2026-09-03T12:00:00.000Z",
      });
    };
    const before = schedule();
    const relationship = await store.createRelationship({
      kind: "contains",
      sourceGoalId: first.goal.id,
      target: { kind: "goal", goalId: second.goal.id },
      semantics: { kind: "containment", requiredness: "required" },
    });
    expect(relationship.status).toBe("accepted");
    const after = schedule();
    expect(after).toEqual(before);
    expect(store.exportGoalStructureAuthority().relationships).toHaveLength(1);
  });
});
