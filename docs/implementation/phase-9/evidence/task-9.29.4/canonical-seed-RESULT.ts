import { createDayFrameStore } from "../../../../../code/src/state/dayFrameStore.js";
Object.assign(globalThis, {
  async seedAcceptance9294(label = "Native full footprint") {
    const store = createDayFrameStore(); await store.whenReady();
    const at = new Date().toISOString();
    const range = { startUserDayDate: "2026-09-26", endUserDayDateExclusive: "2026-09-27" } as const;
    store.setSchedulingPreferences({ dayBoundaryStartTime: "00:00", weekStartsOn: "monday" });
    const sleep = store.authorSleepRequirement({ id: "sleep", expectedRevision: null, recordedAt: at, intent: { enabled: true, effectiveFrom: "2026-09-01", weekdays: "all", durationMinutes: 120, bufferBeforeMinutes: 0, bufferAfterMinutes: 0, window: { kind: "clock", startClock: "00:00", endClock: "02:00" } } });
    if (sleep.status !== "authored") throw Error(JSON.stringify(sleep));
    store.setPreviewRange({ source: "custom", preset: "custom", startDate: "2026-09-26", endDate: "2026-09-26" });
    const goal = await store.createGoal({ title: label }); if (goal.status !== "accepted") throw Error(JSON.stringify(goal));
    const demand = await store.createDemand({ goalId: goal.goal.id, requestedEffort: { unit: "minutes", amount: 60 }, horizon: { kind: "userDayInterval", ...range }, session: { mode: "indivisible", exactMinutes: 60 }, satisfaction: { kind: "minimum", allowPartial: false }, cadence: { kind: "total" } });
    if (demand.status !== "accepted") throw Error(JSON.stringify(demand));
    const spec = await store.createDemandResourceFootprintSpec({ name: "Required full footprint", variants: [{ id: "study", name: "Study", components: [
      { id: "notes", role: "supportActivity", scope: "perSession", requiredness: "required", durationMinutes: 30, geometry: { kind: "startsAtProductiveEnd" }, actor: "user", source: { kind: "direct" } },
      { id: "buffer", role: "bufferProtection", scope: "perSession", requiredness: "required", durationMinutes: 15, target: { kind: "supportComponent", componentId: "notes" }, side: "after", source: { kind: "direct" } },
    ] }] }); if (spec.status !== "accepted") throw Error(JSON.stringify(spec));
    const association = await store.setDemandResourceFootprintAssociation({ demandId: demand.value.id, selection: { kind: "specification", specificationId: spec.value.id, specificationRevision: spec.value.revision, variantId: "study", selectedOptionalComponentIds: [] } });
    if (association.status !== "accepted") throw Error(JSON.stringify(association));
    const evaluated = await store.evaluateCompetingAllocation({ ...range, evaluationCutoff: at });
    if (evaluated.status !== "evaluated") throw Error(JSON.stringify(evaluated));
    const generated = await store.deriveProposal({ allocation: evaluated.allocation.allocations[0]!, horizon: range, allocationHorizon: range, generatedAt: at, evaluationCutoff: at });
    if (generated.status !== "proposed") throw Error(JSON.stringify(generated));
    const saved = await store.recordProposal(generated); if (saved.status !== "accepted") throw Error(JSON.stringify(saved));
    return { goalId: goal.goal.id, demandId: demand.value.id, proposalId: generated.proposal.id, range, seeded: "Canonical authored sources and undecided Proposal only; no acceptance/realization/import/export/clear seeded." };
  }
});
