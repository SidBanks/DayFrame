import { v14RestoreFixture } from "../../../../../code/src/ui/tests/v14RestoreFixture.js";
import { createDayFrameStore } from "../../../../../code/src/state/dayFrameStore.js";
Object.assign(globalThis, {
  seedDayFrame927Continuation: async (title: string) => {
    const f = await v14RestoreFixture(title);
    f.store.setPreviewRange({
      preset: "custom",
      startDate: "2026-09-24",
      endDate: "2026-09-24",
    });
    const g = await f.store.createGoal({ title: "Planning proof" });
    if (g.status !== "accepted") throw Error("goal");
    const d = await f.store.createDemand({
      goalId: g.goal.id,
      requestedEffort: { unit: "minutes", amount: 60 },
      horizon: {
        kind: "userDayInterval",
        startUserDayDate: "2026-09-24",
        endUserDayDateExclusive: "2026-09-25",
      },
      session: { mode: "indivisible", exactMinutes: 60 },
      satisfaction: { kind: "target", allowPartial: false },
      cadence: { kind: "total" },
    });
    if (d.status !== "accepted") throw Error("request");
    await f.store.setDemandResourceFootprintAssociation({
      demandId: d.value.id,
      selection: { kind: "productiveOnly" },
    });
    for (let i = 0; i < 22; i++)
      await f.store.createGoal({
        title: i < 2 ? "Duplicate target" : `Supporting Goal ${i}`,
      });
    return {
      targets: f.store.listGoals().map((g) => ({ id: g.id, title: g.title })),
      goalId: f.goalId,
      requestId: f.requestId,
      acceptedIds: f.acceptedIds,
      planningGoalId: g.goal.id,
    };
  },
  readDayFrame927Continuation: async (
    goalId: Parameters<ReturnType<typeof createDayFrameStore>["getGoal"]>[0],
  ) => {
    const store = createDayFrameStore();
    await store.whenReady();
    return {
      qualification: store.getGoalStructureQualification(),
      query: store.queryGoalStructure({
        goalId,
        evaluationInstant: new Date().toISOString(),
        basis: "currentAuthority",
      }),
      proposal: store.exportProposalAuthority(),
      structure: store.exportGoalStructureAuthority(),
    };
  },
});
