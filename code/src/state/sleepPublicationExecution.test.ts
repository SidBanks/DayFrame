import { beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
import { isPublishedSleepSnapshot } from "../core/sleep/publishedSleep.js";
import { validateDayFrameBackupV13 } from "./dayFrameBackupV13.js";
import { validatePlanPublicationBatch } from "../core/historicalPlan/historicalPlanValidation.js";
import { hasSleepPublicationSeamConflict } from "../core/sleep/sleepPublicationSeams.js";
import {
  createExecutionAssertion,
  validateExecutionRecordCollection,
} from "../core/execution/executionRecord.js";
import { publishedSleepExecutionTarget } from "../core/sleep/sleepExecution.js";
class MemoryStorage implements Storage {
  values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  key(i: number) {
    return [...this.values.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.values.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.values.set(k, v);
  }
  removeItem(k: string) {
    this.values.delete(k);
  }
  clear() {
    this.values.clear();
  }
}
beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
  vi.stubGlobal("indexedDB", new IDBFactory());
});
const at = "2026-09-17T23:59:00.000Z";
const day = "2026-09-17";
async function setup() {
  const store = createDayFrameStore({}, { executionHistoryClock: () => at });
  await store.whenReady();
  store.setSchedulingPreferences({ dayBoundaryStartTime: "00:00", weekStartsOn: "monday" });
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
        window: { kind: "clock", startClock: "00:00", endClock: "08:00" },
      },
    }).status,
  ).toBe("authored");
  store.setShiftDefinitions([
    {
      id: "day",
      userId: "u",
      name: "Day",
      startTime: "12:00",
      endTime: "13:00",
      workDays: ["thursday"],
      crossesMidnight: false,
      createdAt: at,
      updatedAt: at,
    },
  ]);
  store.setShiftCycles([
    {
      id: "cycle",
      userId: "u",
      name: "Cycle",
      type: "fixedSegments",
      startsOnDate: "2026-09-01",
      endsOnDate: "2027-01-01",
      segments: [
        {
          id: "segment",
          shiftCycleId: "cycle",
          shiftDefinitionId: "day",
          startsOnDate: "2026-09-01",
          endsOnDate: "2027-01-01",
        },
      ],
      createdAt: at,
      updatedAt: at,
    },
  ]);
  return store;
}
async function publish(store: Awaited<ReturnType<typeof setup>>, days = 1) {
  const end = new Date(Date.parse(day) + days * 86400000).toISOString().slice(0, 10) as typeof day;
  const inclusive = new Date(Date.parse(end) - 86400000).toISOString().slice(0, 10) as typeof day;
  store.generatePreview({
    rangeStartDate: day,
    rangeEndDate: inclusive,
    planningWindowStart: new Date(`${day}T00:00:00`),
    planningWindowEnd: new Date(`${end}T00:00:00`),
    generatedAt: "2026-09-16T00:00:00.000Z",
  });
  const publicationRange = {
    version: 1,
    scopeType: "publicationRange",
    startUserDayDate: day,
    endUserDayDateExclusive: end,
    provenance: { source: "explicitPublication" },
  } as const;
  const reviewScope = createReviewScope({
    kind: "custom",
    anchorUserDayDate: day,
    weekStartsOn: "monday",
    source: "explicit",
    customRange: publicationRange,
  });
  const review = await store.queryPlanningReview({ reviewScope, historyAsOf: at });
  const result = await store.publishScheduleRange({
    publicationRange,
    publishedAt: at,
    expectedSourceFingerprint: review.sourceFingerprint,
  });
  expect(result).toMatchObject({ status: "published" });
  const exported = await store.exportHistoricalPlan();
  if (exported.status !== "exported") throw Error(JSON.stringify(exported));
  const batch = exported.batches.at(-1)!;
  const snapshot = batch.days[0]!.occurrences.find((s) => s.version === 4)!;
  if (snapshot.version !== 4) throw Error("missing Sleep");
  return { batch, snapshot, publicationRange, reviewScope };
}
it("publishes frozen Sleep, records distinct actuals, corrects, retracts and reads without current requirements", async () => {
  const store = await setup();
  const { batch, snapshot } = await publish(store);
  expect(isPublishedSleepSnapshot(snapshot)).toBe(true);
  expect(validatePlanPublicationBatch(batch).status).toBe("valid");
  const before = await store.querySleepHistory({
    startUserDayDate: day,
    endUserDayDateExclusive: "2026-09-18",
    asOf: at,
  });
  expect(before).toMatchObject({ status: "available", publications: [{ actualState: "unknown" }] });
  const report = await store.recordSleepExecution({
    kind: "reportPublished",
    publicationBatchId: batch.id,
    snapshotId: snapshot.sleep.snapshotId,
    outcome: "completed",
    actualTime: { occurredAt: "2026-09-17T10:00:00.000Z", durationMinutes: 90 },
  });
  expect(report.status).toBe("accepted");
  if (report.status !== "accepted") return;
  const correction = await store.recordSleepExecution({
    kind: "correct",
    subjectId: report.record.subjectId,
    currentRecordId: report.record.id,
    outcome: "partial",
    actualTime: { occurredAt: "2026-09-17T09:00:00.000Z", durationMinutes: 80 },
  });
  expect(correction.status).toBe("accepted");
  if (correction.status !== "accepted") return;
  expect(
    await store.querySleepHistory({
      startUserDayDate: day,
      endUserDayDateExclusive: "2026-09-18",
      asOf: at,
    }),
  ).toMatchObject({
    status: "available",
    publications: [
      { actualState: "corrected", execution: { currentOutcome: { status: "partial" } } },
    ],
  });
  const retraction = await store.recordSleepExecution({
    kind: "retract",
    subjectId: report.record.subjectId,
    currentRecordId: correction.record.id,
  });
  expect(retraction.status).toBe("accepted");
  expect(
    await store.querySleepHistory({
      startUserDayDate: day,
      endUserDayDateExclusive: "2026-09-18",
      asOf: at,
    }),
  ).toMatchObject({
    status: "available",
    publications: [
      { actualState: "retracted", execution: { currentOutcome: { status: "unknown" } } },
    ],
  });
  const frozen = await store.exportHistoricalPlan();
  store.setSchedulingPreferences({ dayBoundaryStartTime: "05:00", weekStartsOn: "sunday" });
  expect(await store.exportHistoricalPlan()).toEqual(frozen);
  const backup = await store.exportBackupV13(at);
  expect(backup.status).toBe("exported");
  if (backup.status === "exported")
    expect(() => validateDayFrameBackupV13(backup.backup)).not.toThrow();
});
it("rejects unproven generic Sleep reports, wrong publication identity, and missing actual geometry", async () => {
  const store = await setup();
  const { snapshot } = await publish(store);
  const target = publishedSleepExecutionTarget(snapshot);
  expect(store.recordExecution({ ...target, outcome: "skipped" })).toMatchObject({
    status: "rejected",
  });
  expect(
    await store.recordSleepExecution({
      kind: "reportPublished",
      publicationBatchId: "00000000-0000-4000-8000-000000000001",
      snapshotId: snapshot.sleep.snapshotId,
      outcome: "skipped",
    }),
  ).toMatchObject({ status: "rejected" });
  expect(
    await store.recordSleepExecution({
      kind: "reportPublished",
      publicationBatchId: snapshot.sleep.publicationBatchId,
      snapshotId: snapshot.sleep.snapshotId,
      outcome: "completed",
    }),
  ).toMatchObject({ status: "rejected" });
  expect(
    await store.recordSleepExecution({
      kind: "reportPublished",
      publicationBatchId: snapshot.sleep.publicationBatchId,
      snapshotId: snapshot.sleep.snapshotId,
      outcome: "skipped",
    }),
  ).toMatchObject({ status: "accepted" });
});
it("records unplanned Sleep separately with a frozen owner day", async () => {
  const store = await setup();
  expect(
    await store.recordSleepExecution({
      kind: "reportUnplanned",
      outcome: "completed",
      actualTime: { occurredAt: "2026-09-17T08:00:00.000Z", durationMinutes: 90 },
    }),
  ).toMatchObject({ status: "accepted" });
  const result = await store.querySleepHistory({
    startUserDayDate: day,
    endUserDayDateExclusive: "2026-09-18",
    asOf: at,
  });
  expect(result).toMatchObject({
    status: "available",
    publications: [],
    unplanned: [{ subject: { kind: "unplannedSleep" } }],
  });
});
it.each([
  "missingContext",
  "wrongOwner",
  "wrongBatch",
  "unknownVersion",
  "badDuration",
  "extraField",
  "unknownTimezone",
  "malformedInstant",
  "invalidOffset",
])("rejects malformed frozen Sleep: %s", async (flaw) => {
  const store = await setup();
  const { batch } = await publish(store);
  const bad = structuredClone(batch);
  const snapshot = bad.days[0]!.occurrences.find((s) => s.version === 4)!;
  if (snapshot.version !== 4) throw Error();
  if (flaw === "missingContext")
    delete (snapshot.sleep.occurrence as Partial<typeof snapshot.sleep.occurrence>)
      .derivationContext;
  if (flaw === "wrongOwner") snapshot.sleep.occurrence.ownerDay = "2026-09-18";
  if (flaw === "wrongBatch")
    snapshot.sleep.publicationBatchId = "00000000-0000-4000-8000-000000000001" as never;
  if (flaw === "unknownVersion") Object.assign(snapshot.sleep, { version: 2 });
  if (flaw === "badDuration") snapshot.sleep.occurrence.durationMinutes++;
  if (flaw === "extraField") Object.assign(snapshot.sleep, { unexpected: true });
  if (flaw === "unknownTimezone")
    snapshot.sleep.occurrence.derivationContext.timezone = "Unknown/Zone";
  if (flaw === "malformedInstant") snapshot.sleep.occurrence.sleepEnd = "not-an-instant";
  if (flaw === "invalidOffset") snapshot.sleep.ownerUtcOffsetMinutes = 1000;
  expect(validatePlanPublicationBatch(bad).status).toBe("invalid");
});
it("keeps execution chain identity and plan snapshot immutable", async () => {
  const store = await setup();
  const { snapshot } = await publish(store);
  const record = createExecutionAssertion(
    {
      ...publishedSleepExecutionTarget(snapshot),
      outcome: "completed",
      actualTime: { occurredAt: "2026-09-17T10:00:00.000Z", durationMinutes: 60 },
    },
    { now: () => at },
  );
  expect(record.status).toBe("created");
  if (record.status !== "created" || record.record.kind !== "assertion") return;
  const correction = structuredClone(record.record);
  correction.id = "00000000-0000-4000-8000-000000000099" as never;
  correction.replacesRecordId = record.record.id;
  correction.snapshot.userDay.date = "2026-09-18";
  expect(validateExecutionRecordCollection([record.record, correction]).status).toBe("invalid");
});
it.each([7, 31, 90])(
  "benchmarks Sleep lifecycle over %i published days",
  async (days) => {
    const store = await setup();
    const requirementHead = store.getState().sleepRequirements!.at(-1)!;
    store.authorSleepRequirement({
      id: requirementHead.id,
      expectedIncarnationId: requirementHead.incarnationId,
      expectedRevision: requirementHead.revision,
      recordedAt: at,
      intent: {
        enabled: true,
        effectiveFrom: requirementHead.effectiveFrom,
        weekdays: "all",
        durationMinutes: requirementHead.durationMinutes,
        bufferBeforeMinutes: requirementHead.bufferBeforeMinutes,
        bufferAfterMinutes: requirementHead.bufferAfterMinutes,
        window: { kind: "clock", startClock: "22:00", endClock: "08:00" },
      },
    });
    const measurements: Record<string, number> = { days, crossBoundary: 1 };
    async function measure<T>(name: string, operation: () => Promise<T>) {
      const start = performance.now();
      const result = await operation();
      measurements[name] = Math.round((performance.now() - start) * 100) / 100;
      return result;
    }
    const { batch, snapshot } = await measure("publishIncludingPreviewReview", () =>
      publish(store, days),
    );
    expect(
      batch.days.flatMap((day) => day.occurrences).filter((s) => s.version === 4),
    ).toHaveLength(days);
    expect(hasSleepPublicationSeamConflict(batch, [])).toBe(false);
    expect((await measure("today", () => store.queryToday({ evaluationAsOf: at }))).status).toBe(
      "available",
    );
    const report = await measure("record", () =>
      store.recordSleepExecution({
        kind: "reportPublished",
        publicationBatchId: batch.id,
        snapshotId: snapshot.sleep.snapshotId,
        outcome: "completed",
        actualTime: { occurredAt: "2026-09-17T10:00:00.000Z", durationMinutes: 90 },
      }),
    );
    if (report.status !== "accepted") throw Error();
    let head = report.record;
    await measure("tenCorrections", async () => {
      for (let index = 0; index < 10; index++) {
        const corrected = await store.recordSleepExecution({
          kind: "correct",
          subjectId: head.subjectId,
          currentRecordId: head.id,
          outcome: "completed",
          actualTime: { occurredAt: "2026-09-17T10:00:00.000Z", durationMinutes: 80 + index },
        });
        if (corrected.status !== "accepted") throw Error();
        head = corrected.record;
      }
    });
    expect(
      (
        await measure("retract", () =>
          store.recordSleepExecution({
            kind: "retract",
            subjectId: head.subjectId,
            currentRecordId: head.id,
          }),
        )
      ).status,
    ).toBe("accepted");
    const history = await measure("history", () =>
      store.querySleepHistory({
        startUserDayDate: day,
        endUserDayDateExclusive: new Date(Date.parse(day) + days * 86400000)
          .toISOString()
          .slice(0, 10),
        asOf: at,
      }),
    );
    expect(history.status).toBe("available");
    if (process.env.DAYFRAME_SLEEP_BENCH_FILE) {
      const { appendFileSync } = await import("node:fs");
      appendFileSync(process.env.DAYFRAME_SLEEP_BENCH_FILE, JSON.stringify(measurements) + "\n");
    }
  },
  20000,
);

it("Today uses only published Sleep, preserves unknown after elapsed time, and distinguishes retraction", async () => {
  const store = await setup();
  expect(await store.queryToday({ evaluationAsOf: at })).toMatchObject({
    status: "planUnavailable",
  });
  const { snapshot } = await publish(store);
  const today = await store.queryToday({ evaluationAsOf: at });
  expect(today.status).toBe("available");
  if (today.status !== "available") return;
  expect(today.timed.find((item) => item.occurrence.version === 4)).toMatchObject({
    occurrence: snapshot,
    execution: { status: "notReported" },
    temporalPosition: "elapsed",
  });
  const report = await store.recordSleepExecution({
    kind: "reportPublished",
    publicationBatchId: snapshot.sleep.publicationBatchId,
    snapshotId: snapshot.sleep.snapshotId,
    outcome: "skipped",
  });
  if (report.status !== "accepted") throw Error();
  const reported = await store.queryToday({ evaluationAsOf: at });
  if (reported.status !== "available") throw Error();
  expect(reported.timed.find((item) => item.occurrence.version === 4)?.execution).toMatchObject({
    status: "skipped",
  });
  await store.recordSleepExecution({
    kind: "retract",
    subjectId: report.record.subjectId,
    currentRecordId: report.record.id,
  });
  const retracted = await store.queryToday({ evaluationAsOf: at });
  if (retracted.status !== "available") throw Error();
  expect(retracted.timed.find((item) => item.occurrence.version === 4)?.execution).toMatchObject({
    status: "notReported",
    retracted: { subjectId: report.record.subjectId },
  });
});
it("retains accepted pin provenance after revoke, source deletion, profile load and backup restore", async () => {
  const store = await setup();
  const resolution = await store.resolveRequiredSleep({
    ownerRange: { startUserDayDate: day, endUserDayDateExclusive: "2026-09-18" },
  });
  if (resolution.status !== "satisfied") throw Error();
  const occurrence = resolution.occurrences.find((o) => o.ownerDay === day)!;
  const trial = store.trySleepPlacement({
    ownerRange: { startUserDayDate: day, endUserDayDateExclusive: "2026-09-18" },
    target: occurrence.reference,
    sleepStart: new Date("2026-09-17T02:00:00").toISOString(),
  });
  if (trial.status !== "available") throw Error(JSON.stringify(trial));
  const accepted = store.acceptPlanDecision(trial.candidate);
  if (accepted.status !== "accepted") throw Error(JSON.stringify(accepted));
  const { snapshot } = await publish(store);
  expect(snapshot.sleep.acceptedPlacement).not.toBeNull();
  const report = await store.recordSleepExecution({
    kind: "reportPublished",
    publicationBatchId: snapshot.sleep.publicationBatchId,
    snapshotId: snapshot.sleep.snapshotId,
    outcome: "completed",
    actualTime: { occurredAt: "2026-09-17T10:00:00.000Z", durationMinutes: 90 },
  });
  expect(report.status).toBe("accepted");
  const before = await store.querySleepHistory({
    startUserDayDate: day,
    endUserDayDateExclusive: "2026-09-18",
    asOf: at,
  });
  store.removePlanDecision(store.getPlanDecisions()[0]!.id);
  store.saveProfile({ name: "Sleep pattern", savedAt: at });
  const profile = store.getState().savedProfiles[0]!;
  store.loadProfile(profile.id);
  expect(
    await store.querySleepHistory({
      startUserDayDate: day,
      endUserDayDateExclusive: "2026-09-18",
      asOf: at,
    }),
  ).toEqual(before);
  const head = store.getState().sleepRequirements!.at(-1)!;
  expect(
    store.deleteSleepRequirement({
      id: head.id,
      incarnationId: head.incarnationId,
      expectedRevision: head.revision,
    }).status,
  ).toBe("deleted");
  store.setSchedulingPreferences({ dayBoundaryStartTime: "05:00", weekStartsOn: "sunday" });
  store.setManualEvents([]);
  expect(
    await store.querySleepHistory({
      startUserDayDate: day,
      endUserDayDateExclusive: "2026-09-18",
      asOf: at,
    }),
  ).toEqual(before);
  const oldTimezone = process.env.TZ;
  try {
    process.env.TZ = "Pacific/Honolulu";
    expect(
      await store.querySleepHistory({
        startUserDayDate: day,
        endUserDayDateExclusive: "2026-09-18",
        asOf: at,
      }),
    ).toEqual(before);
  } finally {
    if (oldTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = oldTimezone;
  }
  const backup = await store.exportBackupV13(at);
  if (backup.status !== "exported") throw Error(JSON.stringify(backup));
  expect(
    validateDayFrameBackupV13(
      backup.backup,
    ).data.historicalPlan.batches[0]!.days[0]!.occurrences.some((s) => s.version === 4),
  ).toBe(true);
  expect((await store.clearLocalData()).status).toBe("cleared");
  expect(await store.importBackupV13(backup.backup)).toMatchObject({ status: "restoredV13" });
  expect(
    await store.querySleepHistory({
      startUserDayDate: day,
      endUserDayDateExclusive: "2026-09-18",
      asOf: at,
    }),
  ).toEqual(before);
  expect((await store.clearLocalData()).status).toBe("cleared");
  await store.retryExecutionHistoryPersistence();
  await store.retryPendingPublications();
  const fresh = createDayFrameStore();
  await fresh.whenReady();
  expect(
    await fresh.querySleepHistory({
      startUserDayDate: day,
      endUserDayDateExclusive: "2026-09-18",
      asOf: at,
    }),
  ).toMatchObject({ status: "available", publications: [], unplanned: [] });
});
it("backup rejects missing publication evidence while allowing retired active sources", async () => {
  const store = await setup();
  const { snapshot } = await publish(store);
  await store.recordSleepExecution({
    kind: "reportPublished",
    publicationBatchId: snapshot.sleep.publicationBatchId,
    snapshotId: snapshot.sleep.snapshotId,
    outcome: "skipped",
  });
  const backup = await store.exportBackupV13(at);
  if (backup.status !== "exported") throw Error();
  const bad = structuredClone(backup.backup);
  bad.data.historicalPlan.batches = [];
  expect(() => validateDayFrameBackupV13(bad)).toThrow();
  expect(await store.importBackupV13(bad)).toMatchObject({ status: "invalidBackup" });
});
it("idempotent republishing preserves the original Sleep publication identity", async () => {
  const store = await setup();
  const { publicationRange, reviewScope, batch } = await publish(store);
  const review = await store.queryPlanningReview({ reviewScope, historyAsOf: at });
  expect(
    await store.publishScheduleRange({
      publicationRange,
      publishedAt: at,
      expectedSourceFingerprint: review.sourceFingerprint,
    }),
  ).toEqual({ status: "alreadyPublished" });
  const history = await store.exportHistoricalPlan();
  expect(history).toMatchObject({ status: "exported", batches: [{ id: batch.id }] });
  if (history.status === "exported") expect(history.batches).toHaveLength(1);
});
it.each(["requirement", "manual", "boundary", "work"])(
  "rejects stale readiness after %s changes",
  async (change) => {
    const store = await setup();
    const { publicationRange, reviewScope } = await publish(store);
    const review = await store.queryPlanningReview({ reviewScope, historyAsOf: at });
    if (change === "requirement") {
      const r = store.getState().sleepRequirements!.at(-1)!;
      store.authorSleepRequirement({
        id: r.id,
        expectedRevision: r.revision,
        expectedIncarnationId: r.incarnationId,
        recordedAt: at,
        intent: {
          enabled: r.enabled,
          effectiveFrom: r.effectiveFrom,
          weekdays: r.weekdays,
          durationMinutes: 180,
          bufferBeforeMinutes: r.bufferBeforeMinutes,
          bufferAfterMinutes: r.bufferAfterMinutes,
          window: r.window,
        },
      });
    }
    if (change === "manual")
      store.setManualEvents([
        {
          id: "appointment",
          title: "Appointment",
          userDayDate: day,
          allDay: false,
          startTime: "01:00",
          endTime: "06:00",
          createdAt: at,
          updatedAt: at,
        },
      ]);
    if (change === "boundary")
      store.setSchedulingPreferences({ dayBoundaryStartTime: "04:00", weekStartsOn: "monday" });
    if (change === "work")
      store.setShiftDefinitions(
        store
          .getState()
          .shiftDefinitions.map((shift) => ({ ...shift, startTime: "01:00", endTime: "07:00" })),
      );
    expect(
      (
        await store.publishScheduleRange({
          publicationRange,
          publishedAt: at,
          expectedSourceFingerprint: review.sourceFingerprint,
        })
      ).status,
    ).toBe("rejected");
  },
);

it("legacy default_sleep and First-Class Sleep coexist without title/category deduplication", async () => {
  const store = await setup();
  store.setBlockTemplates([
    {
      id: "default_sleep",
      userId: "u",
      title: "Sleep",
      category: "sleep",
      placementType: "flexible",
      durationMinutes: 60,
      priority: 1,
      preferredWindow: "anyAvailable",
      rescheduleBehavior: "autoSameDay",
      requiresResource: false,
      externalResources: [],
      enabled: true,
      createdAt: at,
      updatedAt: at,
    },
  ]);
  store.setBlockRecurrences([
    { id: "legacy", blockTemplateId: "default_sleep", frequency: "daily" },
  ]);
  const { batch } = await publish(store);
  const sleep = batch.days[0]!.occurrences.filter((snapshot) => snapshot.category === "sleep");
  expect(sleep).toHaveLength(2);
  expect(sleep.map((snapshot) => snapshot.sourceFamily).sort()).toEqual([
    "sleepRequirement",
    "template",
  ]);
  const legacy = sleep.find((snapshot) => snapshot.sourceFamily === "template")!;
  expect(
    store.recordExecution({
      subject: { kind: "planned", reference: legacy.reference },
      snapshot: {
        sourceFamily: "template",
        title: "Sleep",
        category: "sleep",
        userDay: { date: day, dayBoundaryStartTime: "00:00", utcOffsetMinutes: -300 },
        plan: legacy.plan,
      },
      outcome: "completed",
    }),
  ).toMatchObject({ status: "accepted" });
  const history = await store.querySleepHistory({
    startUserDayDate: day,
    endUserDayDateExclusive: "2026-09-18",
    asOf: at,
  });
  expect(history).toMatchObject({
    status: "available",
    publications: [{ actualState: "unknown" }],
    unplanned: [],
  });
});
it.each(["accept", "revoke"])(
  "publication revalidates accepted placement %s after readiness",
  async (change) => {
    const store = await setup();
    async function accept() {
      const resolution = await store.resolveRequiredSleep({
        ownerRange: { startUserDayDate: day, endUserDayDateExclusive: "2026-09-18" },
      });
      if (resolution.status !== "satisfied") throw Error();
      const occurrence = resolution.occurrences.find((o) => o.ownerDay === day)!;
      const trial = store.trySleepPlacement({
        ownerRange: { startUserDayDate: day, endUserDayDateExclusive: "2026-09-18" },
        target: occurrence.reference,
        sleepStart: new Date("2026-09-17T02:00:00").toISOString(),
      });
      if (trial.status !== "available") throw Error();
      expect(store.acceptPlanDecision(trial.candidate).status).toBe("accepted");
    }
    if (change === "revoke") await accept();
    const { reviewScope, publicationRange } = await publish(store);
    const review = await store.queryPlanningReview({ reviewScope, historyAsOf: at });
    if (change === "accept") await accept();
    else store.removePlanDecision(store.getPlanDecisions()[0]!.id);
    expect(
      (
        await store.publishScheduleRange({
          publicationRange,
          publishedAt: at,
          expectedSourceFingerprint: review.sourceFingerprint,
        })
      ).status,
    ).toBe("rejected");
  },
);
it("unplanned Sleep corrections and retractions retain origin and cannot become skipped planned Sleep", async () => {
  const store = await setup();
  const report = await store.recordSleepExecution({
    kind: "reportUnplanned",
    outcome: "completed",
    actualTime: { occurredAt: "2026-09-17T08:00:00.000Z", durationMinutes: 60 },
  });
  if (report.status !== "accepted") throw Error();
  expect(
    await store.recordSleepExecution({
      kind: "correct",
      subjectId: report.record.subjectId,
      currentRecordId: report.record.id,
      outcome: "skipped",
    }),
  ).toMatchObject({ status: "rejected" });
  const corrected = await store.recordSleepExecution({
    kind: "correct",
    subjectId: report.record.subjectId,
    currentRecordId: report.record.id,
    outcome: "completed",
    actualTime: { occurredAt: "2026-09-16T23:00:00.000Z", durationMinutes: 300 },
  });
  if (corrected.status !== "accepted") throw Error();
  expect(
    await store.recordSleepExecution({
      kind: "retract",
      subjectId: corrected.record.subjectId,
      currentRecordId: corrected.record.id,
    }),
  ).toMatchObject({ status: "accepted" });
  expect(
    await store.querySleepHistory({
      startUserDayDate: day,
      endUserDayDateExclusive: "2026-09-18",
      asOf: at,
    }),
  ).toMatchObject({
    status: "available",
    publications: [],
    unplanned: [
      {
        snapshot: { userDay: { date: day } },
        currentOutcome: { status: "unknown" },
        currentRecord: { kind: "retraction" },
      },
    ],
  });
});
