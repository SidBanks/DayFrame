import { writeFileSync } from "node:fs";
import { beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore, DAYFRAME_ACTIVE_V2_STORAGE_KEY } from "./dayFrameStore.js";
import { conversionFixture } from "../core/sleep/legacySleepConversionTestFixtures.js";
import { discoverLegacySleep } from "../core/sleep/legacySleepConversion.js";
import { projectActiveToPattern } from "./activeV2.js";
import { createSourceIncarnationId } from "../core/authored/sourceIncarnation.js";
import { validateDayFrameBackupV14 } from "./dayFrameBackupV14.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
class MemoryStorage implements Storage {
  values = new Map<string, string>();
  fail = false;
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
    if (this.fail && k === DAYFRAME_ACTIVE_V2_STORAGE_KEY) throw Error("injected commit failure");
    this.values.set(k, v);
  }
  removeItem(k: string) {
    this.values.delete(k);
  }
  clear() {
    this.values.clear();
  }
}
let storage: MemoryStorage;
const now = "2026-09-20T12:00:00.000Z",
  cutover = "2026-10-01";
beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("indexedDB", new IDBFactory());
});
async function setup() {
  const { context } = conversionFixture();
  context.setup.schedulingPreferences.dayBoundaryStartTime = "00:00";
  const store = createDayFrameStore(projectActiveToPattern(context.setup), {
    restoreClock: () => now,
    executionHistoryClock: () => "2026-10-03T23:00:00.000Z",
  });
  await store.whenReady();
  store.setShiftDefinitions([
    {
      id: "day",
      userId: "u",
      name: "Day",
      startTime: "12:00",
      endTime: "13:00",
      workDays: ["thursday"],
      crossesMidnight: false,
      createdAt: now,
      updatedAt: now,
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
      createdAt: now,
      updatedAt: now,
    },
  ]);
  const selection = discoverLegacySleep(store.getState())[0]!.selection;
  return { store, request: { selection, cutover } as const };
}
async function prepared() {
  const { store, request } = await setup();
  const review = await store.reviewLegacySleepConversion(request);
  expect(review.status).toBe("convertible");
  return {
    store,
    request,
    input: {
      request,
      expectedFingerprint: review.fingerprint,
      commandId: createSourceIncarnationId(),
      confirmed: true as const,
    },
  };
}
it("atomically saves once, rejects commit failure without effective or retryable partial authority, and retries idempotently", async () => {
  const { store, input } = await prepared();
  const before = store.getState(),
    raw = storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY);
  storage.fail = true;
  expect((await store.convertLegacySleepToFirstClass(input)).status).toBe("rejected");
  expect(store.getState()).toEqual(before);
  expect(storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY)).toBe(raw);
  storage.fail = false;
  expect((await store.convertLegacySleepToFirstClass(input)).status).toBe("converted");
  const saved = storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY);
  expect(JSON.parse(saved!).version).toBe(4);
  expect((await store.convertLegacySleepToFirstClass(input)).status).toBe("alreadyConverted");
  expect(storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY)).toBe(saved);
  expect(store.getPlanDecisions()).toEqual([]);
  expect(store.getExecutionHistory()).toEqual([]);
  const history = await store.exportHistoricalPlan();
  expect(history).toMatchObject({ status: "exported", batches: [] });
  const restart = createDayFrameStore();
  await restart.whenReady();
  expect(restart.getState().legacySleepConversions).toEqual(
    store.getState().legacySleepConversions,
  );
});
it("roundtrips backup/restore/restart and clear retries cannot resurrect conversion", async () => {
  const { store, input } = await prepared();
  await store.convertLegacySleepToFirstClass(input);
  const before = store.getState();
  const exported = await store.exportBackupV14(now);
  expect(exported.status).toBe("exported");
  if (exported.status !== "exported") throw Error(JSON.stringify(exported));
  expect(validateDayFrameBackupV14(exported.backup)).toEqual(exported.backup);
  await store.clearLocalData();
  store.retryActivePersistence();
  store.retryProfilePersistence();
  expect(store.getState().legacySleepConversions ?? []).toEqual([]);
  const cleared = createDayFrameStore();
  await cleared.whenReady();
  expect(cleared.getState().sleepRequirements ?? []).toEqual([]);
  expect(cleared.getState().blockRecurrences).toEqual([]);
  expect(await store.importBackupFile(exported.backup)).toMatchObject({ status: "restoredV14" });
  expect(store.getState().legacySleepConversions).toEqual(before.legacySleepConversions);
  expect(store.getState().sleepRequirements).toEqual(before.sleepRequirements);
  const restart = createDayFrameStore();
  await restart.whenReady();
  expect(restart.getState().legacySleepConversions).toEqual(before.legacySleepConversions);
});
it("old profiles remain legacy, converted profiles preserve retirement and rotate Sleep lifetime", async () => {
  const { store, input } = await prepared();
  store.saveProfile({ name: "before", savedAt: now });
  const old = store.getState().savedProfiles[0]!;
  expect((await store.convertLegacySleepToFirstClass(input)).status).toBe("converted");
  const lifetime = store.getState().sleepRequirements![0]!.incarnationId;
  expect(store.getState().savedProfiles[0]).toEqual(old);
  store.saveProfile({ name: "after", savedAt: now });
  const converted = store.getState().savedProfiles.find((p) => p.name === "after")!;
  store.loadProfile(converted.id);
  expect(store.getState().sleepRequirements![0]!.incarnationId).not.toBe(lifetime);
  expect(store.getState().blockRecurrences[0]!.endsOnDate).toBe("2026-09-30");
  expect(store.getState().legacySleepConversions ?? []).toEqual([]);
  store.loadProfile(old.id);
  expect(store.getState().sleepRequirements ?? []).toEqual([]);
  expect(store.getState().blockRecurrences[0]!.endsOnDate).toBeUndefined();
  expect(discoverLegacySleep(store.getState())).toHaveLength(1);
});
it("stale source, boundaries and First-Class appearance reject without partial writes", async () => {
  for (const change of ["source", "boundary", "sleep"]) {
    storage.clear();
    const { store, input } = await prepared();
    if (change === "source") store.setBlockRecurrences(store.getState().blockRecurrences);
    if (change === "boundary") store.setSchedulingPreferences({ dayBoundaryStartTime: "12:00" });
    if (change === "sleep")
      store.authorSleepRequirement({
        id: "existing",
        expectedRevision: null,
        recordedAt: now,
        intent: {
          enabled: false,
          effectiveFrom: "2026-10-03",
          weekdays: "all",
          durationMinutes: 120,
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          window: { kind: "clock", startClock: "00:00", endClock: "08:00" },
        },
      });
    const before = store.getState();
    expect((await store.convertLegacySleepToFirstClass(input)).status).toBe("rejected");
    expect(store.getState()).toEqual(before);
  }
});
it("converted source edits retain lineage; deletion/recreation does not attach old lineage to a new lifetime", async () => {
  const { store, input } = await prepared();
  await store.convertLegacySleepToFirstClass(input);
  const original = store.getState().sleepRequirements![0]!;
  const {
    version: _v,
    id,
    incarnationId,
    revision,
    createdAt: _c,
    updatedAt: _u,
    ...intent
  } = original;
  void _v;
  void _c;
  void _u;
  expect(
    store.authorSleepRequirement({
      id,
      expectedIncarnationId: incarnationId,
      expectedRevision: revision,
      recordedAt: "2026-09-21T12:00:00.000Z",
      intent: { ...intent, durationMinutes: 150 },
    }).status,
  ).toBe("authored");
  expect(store.getState().legacySleepConversions![0]!.requirement.durationMinutes).toBe(120);
  expect(store.deleteSleepRequirement({ id, incarnationId, expectedRevision: 2 }).status).toBe(
    "deleted",
  );
  expect(
    store.authorSleepRequirement({ id, expectedRevision: null, recordedAt: now, intent }).status,
  ).toBe("authored");
  expect(store.getState().sleepRequirements![0]!.incarnationId).not.toBe(incarnationId);
  expect(store.getState().legacySleepConversions![0]!.requirementDeleted).toBe(true);
  expect((await store.exportBackupV14(now)).status).toBe("exported");
});
it("conversion invalidates Preview and publishes distinct First-Class truth only after regeneration", async () => {
  const { store, input } = await prepared();
  const previewInput = {
    rangeStartDate: cutover,
    rangeEndDate: cutover,
    planningWindowStart: new Date(`${cutover}T00:00:00`),
    planningWindowEnd: new Date("2026-10-02T00:00:00"),
    generatedAt: now,
  } as const;
  store.generatePreview(previewInput);
  const review = await store.reviewLegacySleepConversion(input.request);
  expect(
    (
      await store.convertLegacySleepToFirstClass({
        ...input,
        expectedFingerprint: review.fingerprint,
      })
    ).status,
  ).toBe("converted");
  expect(store.getState().preview!.isStale).toBe(true);
  store.generatePreview(previewInput);
  expect(
    store
      .getState()
      .preview!.result.scheduledBlocks.some(
        (b) => b.templateId === "legacy-sleep" && b.userDayDate >= cutover,
      ),
  ).toBe(false);
  const publicationRange = {
    version: 1,
    scopeType: "publicationRange",
    startUserDayDate: cutover,
    endUserDayDateExclusive: "2026-10-02",
    provenance: { source: "explicitPublication" },
  } as const;
  const scope = createReviewScope({
    kind: "custom",
    anchorUserDayDate: cutover,
    weekStartsOn: "monday",
    source: "explicit",
    customRange: publicationRange,
  });
  const planning = await store.queryPlanningReview({ reviewScope: scope, historyAsOf: now });
  const outcome = await store.publishScheduleRange({
    publicationRange,
    expectedSourceFingerprint: planning.sourceFingerprint,
    publishedAt: now,
  });
  expect(outcome.status).toBe("published");
  const history = await store.exportHistoricalPlan();
  if (history.status !== "exported") throw Error("history");
  expect(
    history.batches
      .flatMap((b) => b.days.flatMap((d) => d.occurrences))
      .some((o) => o.version === 4),
  ).toBe(true);
});
async function publishDay(
  store: Awaited<ReturnType<typeof setup>>["store"],
  day: import("../core/shifts/types.js").LocalDateString,
) {
  const end = new Date(Date.parse(day) + 86400000).toISOString().slice(0, 10) as typeof day;
  store.generatePreview({
    rangeStartDate: day,
    rangeEndDate: day,
    planningWindowStart: new Date(`${day}T00:00:00`),
    planningWindowEnd: new Date(`${end}T00:00:00`),
    generatedAt: now,
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
  const review = await store.queryPlanningReview({ reviewScope, historyAsOf: now });
  expect(
    await store.publishScheduleRange({
      publicationRange,
      expectedSourceFingerprint: review.sourceFingerprint,
      publishedAt: now,
    }),
  ).toMatchObject({ status: "published" });
  const history = await store.exportHistoricalPlan();
  if (history.status !== "exported") throw Error("history");
  return history.batches.at(-1)!;
}
it("preserves legacy publication, actuals, correction/retraction, and both generations across full restore", async () => {
  const { store, request } = await setup();
  const batch = await publishDay(store, "2026-09-29");
  const day = batch.days[0]!,
    legacy = day.occurrences.find((o) => o.sourceFamily === "template")!;
  expect(legacy).toBeDefined();
  const target = {
    subject: { kind: "planned" as const, reference: legacy.reference },
    snapshot: {
      sourceFamily: "template" as const,
      title: legacy.title,
      category: "sleep" as const,
      userDay: {
        date: day.userDayDate,
        dayBoundaryStartTime: day.dayBoundaryStartTime,
        utcOffsetMinutes: day.utcOffsetMinutes,
      },
      plan: legacy.plan,
    },
    outcome: "completed" as const,
  };
  const actual = store.recordExecution(target);
  if (actual.status !== "accepted") throw Error(JSON.stringify(actual));
  const corrected = store.correctExecutionRecord(actual.record.subjectId, actual.record.id, {
    ...target,
    outcome: "partial",
  });
  if (corrected.status !== "accepted") throw Error(JSON.stringify(corrected));
  expect(store.retractExecutionRecord(corrected.record.subjectId, corrected.record.id).status).toBe(
    "accepted",
  );
  const records = store.getExecutionHistory();
  const rawHistory = JSON.stringify(await store.exportHistoricalPlan());
  const review = await store.reviewLegacySleepConversion(request);
  expect(review.status).toBe("convertible");
  expect(
    (
      await store.convertLegacySleepToFirstClass({
        request,
        expectedFingerprint: review.fingerprint,
        commandId: createSourceIncarnationId(),
        confirmed: true,
      })
    ).status,
  ).toBe("converted");
  expect(store.getExecutionHistory()).toEqual(records);
  expect(JSON.stringify(await store.exportHistoricalPlan())).toBe(rawHistory);
  const first = await publishDay(store, cutover);
  const sleep = first.days[0]!.occurrences.find((o) => o.version === 4)!;
  if (sleep.version !== 4) throw Error("Sleep");
  expect(
    (
      await store.recordSleepExecution({
        kind: "reportPublished",
        publicationBatchId: first.id,
        snapshotId: sleep.sleep.snapshotId,
        outcome: "completed",
        actualTime: { occurredAt: "2026-10-01T22:00:00.000Z", durationMinutes: 120 },
      })
    ).status,
  ).toBe("accepted");
  const exported = await store.exportBackupV14(now);
  if (exported.status !== "exported") throw Error(JSON.stringify(exported));
  await store.clearLocalData();
  expect(await store.importBackupV14(exported.backup)).toMatchObject({ status: "restoredV14" });
  const again = await store.exportBackupV14(now);
  expect(again).toEqual(exported);
});
it("new future publication invalidates a reviewed conversion and requires a later cutover", async () => {
  const { store, request, input } = await prepared();
  await publishDay(store, cutover);
  const before = store.getState();
  expect((await store.convertLegacySleepToFirstClass(input)).status).toBe("rejected");
  expect(store.getState()).toEqual(before);
  expect(await store.reviewLegacySleepConversion(request)).toMatchObject({
    status: "requiresReview",
  });
  expect(
    (await store.reviewLegacySleepConversion({ ...request, cutover: "2026-10-04" })).status,
  ).toBe("convertible");
});
it.each(["requirement", "lifetime", "source", "retirement", "version", "fingerprint"])(
  "rejects malformed %s in Backup V14 without altering runtime",
  async (mode) => {
    const { store, input } = await prepared();
    await store.convertLegacySleepToFirstClass(input);
    const exported = await store.exportBackupV14(now);
    if (exported.status !== "exported") throw Error("backup");
    const bad = structuredClone(exported.backup);
    const active = bad.data.active.data;
    if (mode === "requirement") active.sleepRequirements = [];
    if (mode === "lifetime")
      active.sleepRequirements[0]!.incarnationId = createSourceIncarnationId();
    if (mode === "source") active.blockTemplates = [];
    if (mode === "retirement") delete active.blockRecurrences[0]!.endsOnDate;
    if (mode === "version") active.legacySleepConversions![0]!.version = 2 as never;
    if (mode === "fingerprint") active.legacySleepConversions![0]!.mappingFingerprint = "bad";
    const before = store.getState();
    expect(await store.importBackupV14(bad)).toEqual({ status: "invalidBackup" });
    expect(store.getState()).toEqual(before);
  },
);
it("older backups and startup never infer conversion", async () => {
  const { store } = await setup();
  const old = await store.exportBackupV13(now);
  if (old.status !== "exported") throw Error("backup");
  await store.clearLocalData();
  expect(await store.importBackupFile(old.backup)).toMatchObject({ status: "restoredV13" });
  const restarted = createDayFrameStore();
  await restarted.whenReady();
  expect(restarted.getState().sleepRequirements ?? []).toEqual([]);
  expect(restarted.getState().legacySleepConversions ?? []).toEqual([]);
  expect(discoverLegacySleep(restarted.getState())).toHaveLength(1);
});
it("measures discovery, review, conversion, profile, backup/restore and regeneration without timing gates", async () => {
  const { store, request } = await setup();
  const metrics: Record<string, number> = {};
  let start = performance.now();
  for (let i = 0; i < 100; i++) discoverLegacySleep(store.getState());
  metrics.discoveryMeanMs = (performance.now() - start) / 100;
  start = performance.now();
  const review = await store.reviewLegacySleepConversion(request);
  metrics.reviewMs = performance.now() - start;
  start = performance.now();
  expect(
    (
      await store.convertLegacySleepToFirstClass({
        request,
        expectedFingerprint: review.fingerprint,
        commandId: createSourceIncarnationId(),
        confirmed: true,
      })
    ).status,
  ).toBe("converted");
  metrics.conversionMs = performance.now() - start;
  start = performance.now();
  store.saveProfile({ name: "converted", savedAt: now });
  metrics.profileSaveMs = performance.now() - start;
  start = performance.now();
  const backup = await store.exportBackupV14(now);
  metrics.backupMs = performance.now() - start;
  if (backup.status !== "exported") throw Error("backup");
  start = performance.now();
  validateDayFrameBackupV14(backup.backup);
  metrics.backupValidationMs = performance.now() - start;
  start = performance.now();
  store.loadProfile(store.getState().savedProfiles[0]!.id);
  metrics.profileLoadMs = performance.now() - start;
  start = performance.now();
  expect(await store.importBackupV14(backup.backup)).toMatchObject({ status: "restoredV14" });
  metrics.restoreMs = performance.now() - start;
  start = performance.now();
  store.generatePreview({
    rangeStartDate: cutover,
    rangeEndDate: "2026-10-31",
    planningWindowStart: new Date(`${cutover}T00:00:00`),
    planningWindowEnd: new Date("2026-11-01T00:00:00"),
    generatedAt: now,
  });
  metrics.regenerate31DaysMs = performance.now() - start;
  expect(
    store
      .getState()
      .preview!.result.scheduledBlocks.filter(
        (b) => b.templateId === "legacy-sleep" && b.userDayDate >= cutover,
      ),
  ).toEqual([]);
  if (process.env.DAYFRAME_916_METRICS)
    writeFileSync(process.env.DAYFRAME_916_METRICS, JSON.stringify(metrics, null, 2));
});
it("reports committed conversion accurately even when a post-commit observer throws", async () => {
  const { store, input } = await prepared();
  const stop = store.subscribe(() => {
    throw Error("observer failed");
  });
  const result = await store.convertLegacySleepToFirstClass(input);
  stop();
  expect(result.status).toBe("converted");
  expect(
    JSON.parse(storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY)!).data.legacySleepConversions,
  ).toEqual(store.getState().legacySleepConversions);
  expect((await store.convertLegacySleepToFirstClass(input)).status).toBe("alreadyConverted");
});
it("rejects a lossy serialized lineage before any conversion commit", async () => {
  const { store, request } = await setup();
  store.setBlockRecurrences(
    store
      .getState()
      .blockRecurrences.map((r) => ({ ...r, startsOnDate: undefined }) as unknown as typeof r),
  );
  request.selection.recurrenceIncarnationId = store.getState().blockRecurrences[0]!.incarnationId;
  const review = await store.reviewLegacySleepConversion(request);
  expect(review.status).toBe("convertible");
  const before = store.getState(),
    raw = storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY);
  expect(
    (
      await store.convertLegacySleepToFirstClass({
        request,
        expectedFingerprint: review.fingerprint,
        commandId: createSourceIncarnationId(),
        confirmed: true,
      })
    ).status,
  ).toBe("rejected");
  expect(store.getState()).toEqual(before);
  expect(storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY)).toBe(raw);
});
it("ordinary setup edits report a safe rejection when reopening retirement and allow unrelated template edits", async () => {
  const { store, input } = await prepared();
  await store.convertLegacySleepToFirstClass(input);
  const { buildSetupDraft, buildSetupLifecycleTransaction } = await import("../ui/setupDraft.js");
  const before = store.getState();
  const draft = buildSetupDraft(before, now);
  const commit = () =>
    store.commitAuthoredSetupTransaction({
      authoredSetup: {
        schedulingPreferences: draft.schedulingPreferences,
        previewRange: draft.previewRange,
        shiftDefinitions: draft.shiftDefinitions,
        shiftCycles: draft.shiftCycles,
        blockTemplates: draft.templateEntries.map((e) => e.template),
        blockRecurrences: draft.templateEntries.map((e) => e.recurrence),
      },
      lifecycle: buildSetupLifecycleTransaction(draft),
    });
  draft.templateEntries[0]!.recurrence.endsOnDate = "2026-10-31";
  expect(commit().status).toBe("rejected");
  expect(store.getState()).toEqual(before);
  draft.templateEntries[0]!.recurrence.endsOnDate = "2026-09-30";
  draft.templateEntries[0]!.template.title = "Old Sleep schedule";
  expect(commit().status).toBe("applied");
  expect(store.getState().legacySleepConversions).toEqual(before.legacySleepConversions);
  expect(store.getState().sleepRequirements).toEqual(before.sleepRequirements);
});
