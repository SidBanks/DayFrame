/* @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
const ownerDay = "2026-09-17";
const asOf = "2026-09-20T12:00:00.000Z";
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("indexedDB", new IDBFactory());
});
afterEach(() => vi.restoreAllMocks());
function projected(
  result: Awaited<ReturnType<ReturnType<typeof createDayFrameStore>["querySelectedDayEvidence"]>>,
) {
  if (result.status !== "projected") throw Error(JSON.stringify(result));
  return result;
}
async function setup() {
  const db = createDayFrameDurableDb();
  const history = createHistoricalPlanSurface({ storage: db });
  let clock = asOf;
  const store = createDayFrameStore(
    {},
    { restoreIndexedDb: db, historicalPlanSurface: history, executionHistoryClock: () => clock },
  );
  expect(await store.whenReady()).toEqual({ status: "ready" });
  store.setSchedulingPreferences({ dayBoundaryStartTime: "03:00", weekStartsOn: "monday" });
  store.setShiftDefinitions([
    {
      id: "work",
      userId: "u",
      name: "Work",
      startTime: "12:00",
      endTime: "13:00",
      crossesMidnight: false,
      workDays: ["thursday"],
      createdAt: asOf,
      updatedAt: asOf,
    },
  ]);
  store.setShiftCycles([
    {
      id: "cycle",
      userId: "u",
      name: "Cycle",
      type: "fixedSegments",
      startsOnDate: "2026-09-01",
      endsOnDate: "2026-10-01",
      createdAt: asOf,
      updatedAt: asOf,
      segments: [
        {
          id: "seg",
          shiftCycleId: "cycle",
          shiftDefinitionId: "work",
          startsOnDate: "2026-09-01",
          endsOnDate: "2026-10-01",
        },
      ],
    },
  ]);
  return {
    store,
    db,
    history,
    setClock: (value: string) => {
      clock = value;
    },
  };
}
async function publish(store: ReturnType<typeof createDayFrameStore>) {
  store.generatePreview({
    rangeStartDate: ownerDay,
    rangeEndDate: ownerDay,
    planningWindowStart: new Date(`${ownerDay}T03:00:00`),
    planningWindowEnd: new Date("2026-09-18T03:00:00"),
    generatedAt: "2026-09-16T00:00:00.000Z",
  });
  const publicationRange = {
    version: 1,
    scopeType: "publicationRange",
    startUserDayDate: ownerDay,
    endUserDayDateExclusive: "2026-09-18",
    provenance: { source: "explicitPublication" },
  } as const;
  const reviewScope = createReviewScope({
    kind: "day",
    anchorUserDayDate: ownerDay,
    weekStartsOn: "monday",
    source: "explicit",
  });
  const review = await store.queryPlanningReview({ reviewScope, historyAsOf: asOf });
  expect(
    await store.publishScheduleRange({
      publicationRange,
      publishedAt: "2026-09-16T12:00:00.000Z",
      expectedSourceFingerprint: review.sourceFingerprint,
    }),
  ).toMatchObject({ status: "published" });
}
function addSleep(store: ReturnType<typeof createDayFrameStore>) {
  expect(
    store.authorSleepRequirement({
      id: "sleep",
      expectedRevision: null,
      recordedAt: "2026-09-01T00:00:00.000Z",
      intent: {
        enabled: true,
        effectiveFrom: "2026-09-01",
        weekdays: "all",
        durationMinutes: 120,
        bufferBeforeMinutes: 30,
        bufferAfterMinutes: 30,
        window: { kind: "clock", startClock: "22:00", endClock: "02:00" },
      },
    }).status,
  ).toBe("authored");
}
describe("G1 public selected-day evidence", () => {
  it("keeps selected owner separate from real as-of for past/current/future and empty/unavailable evidence", async () => {
    const { store } = await setup();
    const instant = new Date(2026, 8, 18, 2, 59).toISOString();
    const current = projected(await store.querySelectedDayEvidence({ ownerDay, asOf: instant }));
    expect(current.mode).toBe("current");
    expect(current.asOf).toBe(instant);
    expect(
      projected(await store.querySelectedDayEvidence({ ownerDay: "2026-09-16", asOf: instant }))
        .mode,
    ).toBe("past");
    expect(
      projected(await store.querySelectedDayEvidence({ ownerDay: "2026-09-18", asOf: instant }))
        .mode,
    ).toBe("future");
    expect(current.manual).toEqual({ status: "available", value: [] });
    expect(current.planning).toMatchObject({ status: "unavailable", reason: "noPreview" });
    expect(current.publicationCoverage).toBe("notPublished");
    expect(current.actual).toEqual({ status: "available", value: [] });
    expect(await store.querySelectedDayEvidence({ ownerDay: "2026-02-30", asOf })).toMatchObject({
      status: "invalidQuery",
    });
    expect(await store.querySelectedDayEvidence({ ownerDay, asOf: ownerDay })).toMatchObject({
      status: "invalidQuery",
    });
  });
  it("uses effective segment boundaries and preserves authored cross-midnight event ownership without Preview", async () => {
    const { store } = await setup();
    store.setShiftDefinitions([
      {
        id: "work",
        userId: "u",
        name: "Night",
        startTime: "22:00",
        endTime: "06:00",
        crossesMidnight: true,
        workDays: ["thursday"],
        createdAt: asOf,
        updatedAt: asOf,
      },
    ]);
    store.setShiftCycles([
      {
        id: "cycle",
        userId: "u",
        name: "Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-09-01",
        endsOnDate: "2026-10-01",
        createdAt: asOf,
        updatedAt: asOf,
        segments: [
          {
            id: "seg",
            shiftCycleId: "cycle",
            shiftDefinitionId: "work",
            startsOnDate: "2026-09-01",
            endsOnDate: "2026-10-01",
            schedulePreferences: { dayBoundaryStartTime: "06:00", weekStartsOn: "sunday" },
          },
        ],
      },
    ]);
    store.setManualEvents([
      {
        id: "overnight",
        title: "Manual overnight",
        userDayDate: ownerDay,
        allDay: false,
        startTime: "23:00",
        endTime: "01:00",
        createdAt: asOf,
        updatedAt: asOf,
      },
    ]);
    const first = projected(
      await store.querySelectedDayEvidence({
        ownerDay,
        asOf: new Date(2026, 8, 18, 5, 59).toISOString(),
      }),
    );
    expect(first.mode).toBe("current");
    if (first.manual.status !== "available") throw Error("manual");
    expect(first.manual.value[0]).toMatchObject({
      ownerDay,
      subject: "manualEvent",
      reporting: "notExecutionEvidence",
    });
    expect(first.manual.value[0]!.evidence.endsAt!.getDate()).toBe(18);
    const after = projected(
      await store.querySelectedDayEvidence({
        ownerDay,
        asOf: new Date(2026, 8, 18, 6, 1).toISOString(),
      }),
    );
    expect(after.mode).toBe("past");
    expect(after.manual).toEqual(first.manual);
  });
  it("keeps Sleep planning, publication, skipped actuals, correction and retraction distinct", async () => {
    const { store, setClock } = await setup();
    addSleep(store);
    await publish(store);
    const first = projected(await store.querySelectedDayEvidence({ ownerDay, asOf }));
    expect(first.sleepPlanning.status === "available" && first.sleepPlanning.value.status).toBe(
      "satisfied",
    );
    if (first.published.status !== "available") throw Error("history");
    const item = first.published.value[0]!.items.find((i) => i.snapshot.version === 4)!;
    if (item.snapshot.version !== 4) throw Error("sleep");
    expect(item.outcomeKnowledge).toBe("unknown");
    expect(item.reporting).toMatchObject({
      status: "targetAvailable",
      command: "recordSleepExecution",
    });
    const report = await store.recordSleepExecution({
      kind: "reportPublished",
      publicationBatchId: first.published.value[0]!.batchId,
      snapshotId: item.snapshot.sleep.snapshotId,
      outcome: "skipped",
    });
    expect(report.status).toBe("accepted");
    if (report.status !== "accepted") throw Error("report");
    const skipped = projected(await store.querySelectedDayEvidence({ ownerDay, asOf }));
    expect(
      skipped.actual.status === "available" && skipped.actual.value[0]?.currentOutcome.status,
    ).toBe("skipped");
    setClock("2026-09-20T12:01:00.000Z");
    const corrected = await store.recordSleepExecution({
      kind: "correct",
      subjectId: report.record.subjectId,
      currentRecordId: report.record.id,
      outcome: "completed",
      actualTime: { occurredAt: "2026-09-17T23:00:00.000Z", durationMinutes: 60 },
    });
    expect(corrected.status).toBe("accepted");
    if (corrected.status !== "accepted") throw Error("correction");
    expect(projected(await store.querySelectedDayEvidence({ ownerDay, asOf })).actual).toEqual(
      skipped.actual,
    );
    setClock("2026-09-20T12:02:00.000Z");
    expect(
      (
        await store.recordSleepExecution({
          kind: "retract",
          subjectId: report.record.subjectId,
          currentRecordId: corrected.record.id,
        })
      ).status,
    ).toBe("accepted");
    const retracted = projected(
      await store.querySelectedDayEvidence({ ownerDay, asOf: "2026-09-20T12:03:00.000Z" }),
    );
    expect(
      retracted.actual.status === "available" && retracted.actual.value[0]?.currentOutcome.status,
    ).toBe("unknown");
    expect(
      retracted.actual.status === "available" && retracted.actual.value[0]?.currentRecord.kind,
    ).toBe("retraction");
    expect(
      store.deleteSleepRequirement({
        id: "sleep",
        incarnationId: store.getState().sleepRequirements![0]!.incarnationId,
        expectedRevision: 1,
      }).status,
    ).toBe("deleted");
    const changed = projected(await store.querySelectedDayEvidence({ ownerDay, asOf }));
    expect(
      changed.published.status === "available" && changed.published.value[0]!.frozenDay,
    ).toEqual(first.published.value[0]!.frozenDay);
    expect(changed.sleepPlanning.status === "available" && changed.sleepPlanning.value.status).toBe(
      "notConfigured",
    );
  });
  it("keeps protected publication distinct while independent authored/manual evidence stays readable", async () => {
    const { store, history } = await setup();
    vi.spyOn(history, "getHistoricalPlanDayEvidence").mockResolvedValue({
      status: "unavailableProtected",
      reason: "invalidBatch",
    });
    const result = projected(await store.querySelectedDayEvidence({ ownerDay, asOf }));
    expect(result.published).toEqual({ status: "protected", reason: "invalidBatch" });
    expect(result.publicationCoverage).toBe("protected");
    expect(result.manual.status).toBe("available");
    expect(result.published).not.toHaveProperty("value");
  });
  it("queries are deterministic and do not invoke authoritative storage or commands", async () => {
    const { store, db } = await setup();
    const before = structuredClone(store.getState());
    const writes = vi.spyOn(db, "mutate");
    const localWrites = vi.spyOn(Storage.prototype, "setItem");
    const commands = [
      "publishScheduleRange",
      "recordExecution",
      "recordSleepExecution",
      "realizeAcceptedAllocation",
      "acceptProposalOption",
      "authorSleepRequirement",
      "commitAuthoredSetup",
      "abandonProtectedHistoricalPlan",
      "createProgressObservation",
      "saveProfile",
      "convertLegacySleepToFirstClass",
      "generatePreview",
    ] as const;
    const spies = commands.map((name) => vi.spyOn(store, name));
    const first = await store.querySelectedDayEvidence({ ownerDay, asOf });
    expect(await store.querySelectedDayEvidence({ ownerDay, asOf })).toEqual(first);
    const query = { startUserDayDate: ownerDay, endUserDayDateExclusive: "2026-09-18", asOf };
    const lineage = await store.queryAcceptedPlanningEvidence(query);
    expect(await store.queryAcceptedPlanningEvidence(query)).toEqual(lineage);
    expect(lineage.status).toBe("projected");
    expect(store.getState()).toEqual(before);
    expect(writes).not.toHaveBeenCalled();
    expect(localWrites).not.toHaveBeenCalled();
    for (const spy of spies) expect(spy).not.toHaveBeenCalled();
  });
});

it("uses indexed owner-day history and stays read-only with 500 manual events and 40 retained publications", async () => {
  const { store, db, history } = await setup();
  const { addUserDayLabels } = await import("../core/time/canonicalUserDay.js");
  const { createPlanPublicationBatch } = await import("../core/historicalPlan/historicalPlan.js");
  for (let i = 0; i < 40; i++) {
    const date = addUserDayLabels(ownerDay, -i);
    const result = createPlanPublicationBatch(
      {
        range: { startUserDayDate: date, endUserDayDate: date },
        days: [
          {
            version: 1,
            userDayDate: date,
            dayBoundaryStartTime: "03:00",
            weekStartsOn: "monday",
            utcOffsetMinutes: -300,
            occurrences: [],
          },
        ],
      },
      { now: () => "2026-07-01T00:00:00.000Z" },
    );
    if (result.status !== "created") throw Error(JSON.stringify(result));
    expect((await history.publish(result.batch)).status).toBe("publishedAndDurable");
  }
  store.setManualEvents(
    Array.from({ length: 500 }, (_, i) => ({
      id: `event-${i}`,
      title: `Event ${i}`,
      userDayDate: addUserDayLabels(ownerDay, -i),
      allDay: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    })),
  );
  const broad = vi.spyOn(db, "getAll"),
    indexed = vi.spyOn(db, "queryIndex"),
    writes = vi.spyOn(db, "mutate");
  const exportAll = vi.spyOn(history, "exportHistoricalPlan");
  const generate = vi.spyOn(store, "generatePreview");
  const times: number[] = [];
  for (let i = 0; i < 10; i++) {
    const start = performance.now();
    const result = projected(await store.querySelectedDayEvidence({ ownerDay, asOf }));
    times.push(performance.now() - start);
    expect(result.published.status === "available" && result.published.value.length).toBe(1);
    expect(result.manual.status === "available" && result.manual.value.length).toBe(1);
  }
  expect(broad).not.toHaveBeenCalled();
  expect(exportAll).not.toHaveBeenCalled();
  expect(generate).not.toHaveBeenCalled();
  expect(writes).not.toHaveBeenCalled();
  expect(indexed).toHaveBeenCalled();
  times.sort((a, b) => a - b);
  if (process.env.DAYFRAME_EVIDENCE_PERF) {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(
      process.env.DAYFRAME_EVIDENCE_PERF,
      JSON.stringify({
        dataset: { manualEvents: 500, publications: 40, queries: 10 },
        minMs: times[0],
        medianMs: times[5],
        maxMs: times[9],
      }),
    );
  }
});

it("G2 state adapter reads exact Goal/Demand context without rewriting frozen Network+ provenance", async () => {
  const { lineageFixture } = await import("../core/productEvidence/evidenceTestFixtures.js");
  const { queryAcceptedPlanningEvidence } = await import("./acceptedPlanningEvidenceQuery.js");
  const f = lineageFixture();
  if (f.input.proposals.status !== "available" || f.input.realizations.status !== "available")
    throw Error("fixture");
  const { store } = await setup();
  const goal = await store.createGoal({ title: "Network+ Study" });
  if (goal.status !== "accepted") throw Error("goal");
  const getGoal = vi.fn(() => ({ ...goal.goal, id: "goal-network" as typeof goal.goal.id }));
  const getDemand = vi.fn(() => ({ status: "notFound" as const }));
  const sources = {
    proposals: {
      getProposalIngressStatus: () => ({ status: "accepted" as const }),
      exportProposalAuthority: () =>
        f.input.proposals.status === "available" ? f.input.proposals.value : never(),
    },
    realizations: {
      getRealizationIngressStatus: () => "ready" as const,
      exportRealizationAuthority: () =>
        f.input.realizations.status === "available" ? f.input.realizations.value : never(),
    },
    goals: { getGoal, getGoalIngressStatus: () => ({ status: "accepted" as const }) },
    demands: {
      getGoalDemandRevision: getDemand,
      getGoalPlanningIngressStatus: () => ({ status: "accepted" as const }),
    },
    historicalPlan: {
      getHistoricalPlanBatchEvidence: async () => ({
        status: "available" as const,
        batch: f.publication.batch,
      }),
      getHistoricalPlanDayEvidence: async () => ({
        status: "available" as const,
        publications: [f.publication],
      }),
    },
    execution: store,
  };
  if (process.env.DAYFRAME_EVIDENCE_PERF) {
    const { writeFile } = await import("node:fs/promises");
    const times: number[] = [];
    for (let i = 0; i < 20; i++) {
      const start = performance.now();
      await queryAcceptedPlanningEvidence(f.input.query, sources);
      times.push(performance.now() - start);
    }
    times.sort((a, b) => a - b);
    await writeFile(
      `${process.env.DAYFRAME_EVIDENCE_PERF}.lineage.json`,
      JSON.stringify({
        dataset: { acceptedIterations: 3, realizedFacts: 6, publications: 1, runs: 20 },
        rows: f.facts.map((fact) => ({
          fact: fact.id,
          goal: fact.lineage.goalId,
          demand: fact.lineage.demandId,
          proposal: fact.origin.proposalId,
          allocation: fact.origin.acceptedAllocationId,
          realization: fact.origin.realizationId,
          claim: fact.origin.acceptedClaimId,
          role: fact.scheduleRole,
        })),
        minMs: times[0],
        medianMs: times[10],
        maxMs: times[19],
      }),
    );
  }
  const before = await queryAcceptedPlanningEvidence(f.input.query, sources);
  if (before.status !== "projected") throw Error(JSON.stringify(before));
  expect(before.currentSourceContext[0]?.goal).toMatchObject({
    status: "available",
    value: { title: "Network+ Study" },
  });
  expect(getDemand).toHaveBeenCalledWith("demand-a", 1);
  getGoal.mockImplementation(() => ({
    ...goal.goal,
    id: "goal-network" as typeof goal.goal.id,
    title: "Renamed Goal",
  }));
  const after = await queryAcceptedPlanningEvidence(f.input.query, sources);
  if (after.status !== "projected") throw Error("query");
  expect(after.facts).toEqual(before.facts);
  expect(after.currentSourceContext).not.toEqual(before.currentSourceContext);
  function never(): never {
    throw Error("fixture");
  }
});

it("retains global Sleep reference protection even when the broken subject belongs to another selected day", async () => {
  const { store, history } = await setup();
  addSleep(store);
  await publish(store);
  const evidence = projected(await store.querySelectedDayEvidence({ ownerDay, asOf }));
  if (evidence.published.status !== "available") throw Error("history");
  const item = evidence.published.value[0]!.items.find((i) => i.snapshot.version === 4)!;
  if (item.snapshot.version !== 4) throw Error("sleep");
  expect(
    (
      await store.recordSleepExecution({
        kind: "reportPublished",
        publicationBatchId: evidence.published.value[0]!.batchId,
        snapshotId: item.snapshot.sleep.snapshotId,
        outcome: "skipped",
      })
    ).status,
  ).toBe("accepted");
  const read = vi.spyOn(history, "getHistoricalPlanBatchEvidence");
  expect(
    projected(await store.querySelectedDayEvidence({ ownerDay: "2026-09-18", asOf })).actual,
  ).toEqual({ status: "available", value: [] });
  expect(read).toHaveBeenCalledWith(evidence.published.value[0]!.batchId);
  read.mockResolvedValue({ status: "notFound" });
  expect(
    projected(await store.querySelectedDayEvidence({ ownerDay: "2026-09-18", asOf })).actual,
  ).toMatchObject({ status: "protected" });
});
