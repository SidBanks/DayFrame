import { createDayFrameStore } from "../../../../../code/src/state/dayFrameStore.js";
Object.assign(globalThis, {
  async seedReview929c3(label = "Native workflow", sleepCorrection = false) {
    const store = createDayFrameStore(); await store.whenReady();
    const at = new Date().toISOString();
    const range = { startUserDayDate: "2026-09-26", endUserDayDateExclusive: "2026-09-27" } as const;
    store.setSchedulingPreferences({ dayBoundaryStartTime: "00:00", weekStartsOn: "monday" });
    const sleep = store.authorSleepRequirement({ id: "sleep", expectedRevision: null, recordedAt: at, intent: { enabled: true, effectiveFrom: "2026-09-01", weekdays: "all", durationMinutes: 120, bufferBeforeMinutes: sleepCorrection ? 30 : 0, bufferAfterMinutes: sleepCorrection ? 30 : 0, window: { kind: "clock", startClock: "00:00", endClock: sleepCorrection ? "10:00" : "02:00" } } });
    if (sleep.status !== "authored") throw Error(JSON.stringify(sleep));
    store.setPreviewRange({ source: "custom", preset: "custom", startDate: "2026-09-26", endDate: "2026-09-26" });
    store.setShiftDefinitions([{id:"day",userId:"u",name:"Day",startTime:"12:00",endTime:"13:00",workDays:["saturday"],crossesMidnight:false,createdAt:at,updatedAt:at}]);
    store.setShiftCycles([{id:"cycle",userId:"u",name:"Cycle",type:"fixedSegments",startsOnDate:"2026-09-01",endsOnDate:"2026-09-30",segments:[{id:"segment",shiftCycleId:"cycle",shiftDefinitionId:"day",startsOnDate:"2026-09-01",endsOnDate:"2026-09-30"}],createdAt:at,updatedAt:at}]);
    store.setBlockTemplates([{id:"routine",userId:"u",title:"Routine",category:"maintenance",placementType:"flexible",customWindowStartTime:"14:15",customWindowEndTime:"15:15",durationMinutes:60,priority:2,preferredWindow:"custom",rescheduleBehavior:"askUser",requiresResource:false,externalResources:[],enabled:true,createdAt:at,updatedAt:at}]);
    store.setBlockRecurrences([{id:"daily",blockTemplateId:"routine",frequency:"daily"}]);
    if (sleepCorrection) {
      const resolved = await store.resolveRequiredSleep({ ownerRange: range });
      if (resolved.status !== "satisfied") throw Error(JSON.stringify(resolved));
      const target = resolved.occurrences.find((item) => item.membership === "requested")!.reference;
      const trial = store.trySleepPlacement({ ownerRange: range, target, sleepStart: new Date(2026, 8, 26, 2).toISOString() });
      if (trial.status !== "available") throw Error(JSON.stringify(trial));
      const accepted = store.acceptPlanDecision(trial.candidate);
      if (accepted.status !== "accepted") throw Error(JSON.stringify(accepted));
    }
    const goal = await store.createGoal({ title: label }); if (goal.status !== "accepted") throw Error(JSON.stringify(goal));
    const evidenceGoal = await store.createGoal({title:"Independent pages progress"}); if(evidenceGoal.status !== "accepted")throw Error(JSON.stringify(evidenceGoal));
    const definition = await store.createMeasurementDefinition(evidenceGoal.goal.id, {id:"manualQuantityTarget",version:1}, {targetValue:"100",unitId:"pages"});if(definition.status !== "accepted")throw Error(JSON.stringify(definition));
    const progress = await store.createProgressObservation({goalId:evidenceGoal.goal.id,observedAt:definition.definition.effectiveFrom,value:"12",expectedDefinitionRevision:1});if(progress.status !== "accepted")throw Error(JSON.stringify(progress));
    const actual = store.recordExecution({subject:{kind:"unplanned"},snapshot:{sourceFamily:"unplanned",title:"Independent reading actual",category:"optional",userDay:{date:"2026-09-25",dayBoundaryStartTime:"00:00",utcOffsetMinutes:-300},plan:{state:"unplanned"}},outcome:"completed",actualTime:{durationMinutes:20},note:"Independent reported actual; not inferred from accepted schedule"});if(actual.status !== "accepted")throw Error(JSON.stringify(actual));
    await store.retryExecutionHistoryPersistence();
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
    return { goalId: goal.goal.id, demandId: demand.value.id, proposalId: generated.proposal.id, range, seeded: "Canonical authored sources, independent Actual/Progress, and undecided Proposal. Acceptance, publication, export, import and clear exercised separately." };
  }
});
