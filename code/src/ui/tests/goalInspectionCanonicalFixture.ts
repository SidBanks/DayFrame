import { createDayFrameStore } from "../../state/dayFrameStore.js";
import { createDayFrameDurableDb } from "../../infrastructure/storage/dayFrameDurableDb.js";
import { createProposalSurface } from "../../state/proposalSurface.js";
import { createReviewScope } from "../../core/planning/reviewScope.js";
/** Disposable real owner commands, also exported through V14 for production browser QA. */
export async function goalInspectionCanonicalFixture() {
  const at = new Date().toISOString();
  const db = createDayFrameDurableDb();
  const store = createDayFrameStore({}, { restoreIndexedDb: db });
  await store.whenReady();
  const setup = {
    previewRange: {
      preset: "custom" as const,
      startDate: "2026-09-04" as const,
      endDate: "2026-09-04" as const,
    },
    schedulingPreferences: {
      dayBoundaryStartTime: "03:00" as const,
      weekStartsOn: "monday" as const,
    },
    shiftDefinitions: [
      {
        id: "work",
        userId: "user",
        name: "Day Work",
        startTime: "09:00" as const,
        endTime: "17:00" as const,
        crossesMidnight: false,
        workDays: ["friday" as const],
        createdAt: at,
        updatedAt: at,
      },
    ],
    shiftCycles: [
      {
        id: "cycle",
        userId: "user",
        name: "Work",
        type: "fixedSegments" as const,
        startsOnDate: "2026-09-01" as const,
        endsOnDate: "2026-09-30" as const,
        segments: [
          {
            id: "segment",
            shiftCycleId: "cycle",
            shiftDefinitionId: "work",
            startsOnDate: "2026-09-01" as const,
            endsOnDate: "2026-09-30" as const,
          },
        ],
        createdAt: at,
        updatedAt: at,
      },
    ],
    blockTemplates: [
      {
        id: "routine",
        userId: "user",
        title: "Routine",
        category: "maintenance" as const,
        placementType: "fixed" as const,
        fixedStartTime: "18:00" as const,
        durationMinutes: 30,
        priority: 2 as const,
        preferredWindow: "anyAvailable" as const,
        rescheduleBehavior: "askUser" as const,
        requiresResource: false,
        externalResources: [],
        enabled: true,
        createdAt: at,
        updatedAt: at,
      },
    ],
    blockRecurrences: [{ id: "daily", blockTemplateId: "routine", frequency: "daily" as const }],
  };
  store.commitAuthoredSetup(setup);
  const created = await store.createGoal({ title: "Network+ original" });
  if (created.status !== "accepted") throw Error("Goal fixture");
  const goal = created.goal;
  const spec = await store.createDemandResourceFootprintSpec({
    name: "Exam support",
    variants: [
      {
        id: "study",
        name: "Study session",
        components: [
          {
            id: "review-notes",
            role: "supportActivity",
            scope: "perSession",
            requiredness: "required",
            durationMinutes: 30,
            geometry: { kind: "startsAtProductiveEnd" },
            actor: "user",
            source: { kind: "direct" },
          },
          {
            id: "protected",
            role: "bufferProtection",
            scope: "perSession",
            requiredness: "required",
            durationMinutes: 15,
            target: { kind: "supportComponent", componentId: "review-notes" },
            side: "after",
            source: { kind: "direct" },
          },
        ],
      },
    ],
  });
  if (spec.status !== "accepted") throw Error("resources");
  await store.createPriority({ goalId: goal.id, level: "high", scope: { kind: "default" } });
  const acceptedIds: string[] = [];
  for (let n = 0; n < 3; n++) {
    const start = ("2026-09-0" + (4 + n)) as "2026-09-04",
      end = ("2026-09-0" + (5 + n)) as "2026-09-05";
    const demand = await store.createDemand({
      goalId: goal.id,
      requestedEffort: { unit: "minutes", amount: 60 },
      horizon: { kind: "userDayInterval", startUserDayDate: start, endUserDayDateExclusive: end },
      session: { mode: "indivisible", exactMinutes: 60 },
      satisfaction: { kind: "target", allowPartial: false },
      cadence: { kind: "total" },
    });
    if (demand.status !== "accepted") throw Error("Demand");
    await store.setDemandResourceFootprintAssociation({
      demandId: demand.value.id,
      selection: {
        kind: "specification",
        specificationId: spec.value.id,
        specificationRevision: spec.value.revision,
        variantId: "study",
        selectedOptionalComponentIds: [],
      },
    });
    const range = { startUserDayDate: start, endUserDayDateExclusive: end };
    const evaluated = await store.evaluateCompetingAllocation({ ...range, evaluationCutoff: at });
    if (evaluated.status !== "evaluated") throw Error(JSON.stringify(evaluated));
    const generated = await store.deriveProposal({
      allocation: evaluated.allocation.allocations[0]!,
      horizon: range,
      allocationHorizon: range,
      generatedAt: at,
      evaluationCutoff: at,
    });
    if (generated.status !== "proposed") throw Error(JSON.stringify(generated));
    // Existing proposal owner permits accepted-but-unrealized ingress; no synthetic projection.
    const owner = createProposalSurface({
      storage: db,
      now: () => new Date(Date.parse(at) + n).toISOString(),
    });
    await owner.initializeProposals();
    await owner.recordProposal(generated);
    const accepted = await owner.acceptProposalOption({
      proposalId: generated.proposal.id,
      proposalRevision: generated.proposal.revision,
      optionId: generated.proposal.preferredOptionId,
      current: generated,
    });
    if (accepted.status !== "accepted") throw Error(JSON.stringify(accepted));
    const installed = await store.replaceProposalAuthority(owner.exportProposalAuthority());
    if (installed.status !== "accepted") throw Error(JSON.stringify(installed));
    acceptedIds.push(accepted.value.acceptedAllocation.id);
    if (n < 2) {
      const realized = await store.realizeAcceptedAllocation(accepted.value.acceptedAllocation.id);
      if (realized.status !== "realized") throw Error(JSON.stringify(realized));
    }
  }
  store.generatePreview({
    rangeStartDate: "2026-09-04",
    rangeEndDate: "2026-09-05",
    planningWindowStart: new Date("2026-09-04T03:00:00"),
    planningWindowEnd: new Date("2026-09-06T03:00:00"),
    generatedAt: at,
  });
  const reviewScope = createReviewScope({
    kind: "custom",
    customRange: { startUserDayDate: "2026-09-04", endUserDayDateExclusive: "2026-09-06" },
    anchorUserDayDate: "2026-09-04",
    weekStartsOn: "monday",
    source: "explicit",
  });
  const reviewed = await store.queryPlanningReview({
    reviewScope,
    historyAsOf: new Date().toISOString(),
  });
  const published = await store.publishScheduleRange({
    publicationRange: {
      version: 1,
      scopeType: "publicationRange",
      startUserDayDate: "2026-09-04",
      endUserDayDateExclusive: "2026-09-06",
      provenance: { source: "explicitPublication" },
    },
    publishedAt: new Date().toISOString(),
    expectedSourceFingerprint: reviewed.sourceFingerprint,
  });
  if (published.status !== "published") throw Error(JSON.stringify(published));
  await store.updateGoal(goal.id, goal.revision, { title: "Network+ renamed" });
  return { store, goal: store.getGoal(goal.id)!, acceptedIds };
}
