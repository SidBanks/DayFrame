import { beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore } from "./dayFrameStore.js";
import type { DayFrameStore } from "./types.js";
import type { SleepRequirementIntentV1 } from "../core/sleep/sleepRequirement.js";
import {
  DAYFRAME_PLAN_DECISIONS_STORAGE_KEY,
  createPlanDecisionSurface,
} from "./planDecisionSurface.js";
import { validateDayFrameBackupV13 } from "./dayFrameBackupV13.js";
import { createPlanDecisionAcceptanceCandidate } from "../core/decisions/createPlanDecisionAcceptanceCandidate.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
import { publicationBlockers } from "./publicationEligibility.js";

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
let storage: MemoryStorage;
beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("indexedDB", new IDBFactory());
});
const at = "2099-09-01T00:00:00.000Z";
const range = { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-18" } as const;
function author(store: DayFrameStore, patch: Partial<SleepRequirementIntentV1> = {}) {
  const head = store.getState().sleepRequirements?.at(-1);
  expect(
    store.authorSleepRequirement({
      id: "sleep",
      expectedRevision: head?.revision ?? null,
      ...(head ? { expectedIncarnationId: head.incarnationId } : {}),
      recordedAt: at,
      intent: {
        enabled: true,
        effectiveFrom: "2026-09-01",
        weekdays: "all",
        durationMinutes: 120,
        bufferBeforeMinutes: 30,
        bufferAfterMinutes: 30,
        window: { kind: "clock", startClock: "00:00", endClock: "08:00" },
        ...patch,
      },
    }).status,
  ).toBe("authored");
}
async function start(configure = true) {
  const s = createDayFrameStore();
  await s.whenReady();
  if (configure) {
    s.setSchedulingPreferences({ dayBoundaryStartTime: "00:00", weekStartsOn: "monday" });
    author(s);
    s.setShiftDefinitions([
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
    s.setShiftCycles([
      {
        id: "cycle",
        userId: "u",
        name: "Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-09-01",
        endsOnDate: "2026-09-30",
        segments: [
          {
            id: "segment",
            shiftCycleId: "cycle",
            shiftDefinitionId: "day",
            startsOnDate: "2026-09-01",
            endsOnDate: "2026-09-30",
          },
        ],
        createdAt: at,
        updatedAt: at,
      },
    ]);
  }
  return s;
}
async function trial(s: DayFrameStore, hour = 2) {
  const r = await s.resolveRequiredSleep({ ownerRange: range });
  if (r.status !== "satisfied") throw new Error(JSON.stringify(r));
  const t = s.trySleepPlacement({
    ownerRange: range,
    target: r.occurrences.find((o) => o.membership === "requested")!.reference,
    sleepStart: new Date(2026, 8, 17, hour).toISOString(),
  });
  if (t.status !== "available") throw new Error(JSON.stringify(t));
  return t;
}
async function accepted(s: DayFrameStore) {
  const t = await trial(s);
  const a = s.acceptPlanDecision(t.candidate);
  if (a.status !== "accepted") throw new Error(JSON.stringify(a));
  return a;
}
function event(s: DayFrameStore, end = "04:30") {
  s.setManualEvents([
    {
      id: "appointment",
      title: "Appointment",
      userDayDate: "2026-09-17",
      allDay: false,
      startTime: "01:30",
      endTime: end as "04:30",
      createdAt: at,
      updatedAt: at,
    },
  ]);
}

it("Try is non-durable; explicit Accept is idempotent and replays exact geometry after restart", async () => {
  const s = await start(),
    before = [...storage.values],
    t = await trial(s);
  expect([...storage.values]).toEqual(before);
  expect(s.getPlanDecisions()).toEqual([]);
  expect((await start(false)).getPlanDecisions()).toEqual([]);
  const a = s.acceptPlanDecision(t.candidate);
  expect(a.status).toBe("accepted");
  expect(s.acceptPlanDecision(t.candidate)).toEqual(a);
  expect(s.getPlanDecisions()).toHaveLength(1);
  const restarted = await start(false),
    r = await restarted.resolveRequiredSleep({ ownerRange: range });
  expect(r).toMatchObject({ status: "satisfied", placementReviews: [{ status: "applicable" }] });
  if (r.status === "satisfied")
    expect(r.occurrences.find((o) => o.membership === "requested")!.sleepStart).toBe(
      t.candidate.payload.sleepStart,
    );
  expect(restarted.getPlanDecisions()).toEqual(s.getPlanDecisions());
});
it.each(["sleep", "manual", "lifetime", "boundary", "work"])(
  "fresh Accept rejects changed %s authority without writes",
  async (change) => {
    const s = await start(),
      t = await trial(s);
    if (change === "sleep") author(s, { durationMinutes: 150 });
    if (change === "manual") event(s);
    if (change === "lifetime") {
      const r = s.getState().sleepRequirements![0]!;
      s.deleteSleepRequirement({ id: r.id, incarnationId: r.incarnationId, expectedRevision: 1 });
      author(s);
    }
    if (change === "boundary")
      s.setSchedulingPreferences({ dayBoundaryStartTime: "03:00", weekStartsOn: "monday" });
    if (change === "work")
      s.setShiftDefinitions([
        {
          id: "day",
          userId: "u",
          name: "Work",
          startTime: "01:00",
          endTime: "05:00",
          workDays: ["thursday"],
          crossesMidnight: false,
          createdAt: at,
          updatedAt: at,
        },
      ]);
    const before = storage.getItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY);
    expect(s.acceptPlanDecision(t.candidate)).toMatchObject({
      status: "rejected",
      reason: "sleepPlacementReviewRequired",
    });
    expect(s.getPlanDecisions()).toEqual([]);
    expect(storage.getItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY)).toBe(before);
  },
);
it("failed durable acceptance is atomic and retry/restart cannot resurrect a pending pin", async () => {
  const s = await start(),
    t = await trial(s),
    original = storage.setItem.bind(storage);
  const spy = vi.spyOn(storage, "setItem").mockImplementation((k, v) => {
    if (k === DAYFRAME_PLAN_DECISIONS_STORAGE_KEY) throw new Error("quota");
    original(k, v);
  });
  expect(s.acceptPlanDecision(t.candidate)).toMatchObject({
    status: "rejected",
    reason: "storageFailure",
  });
  expect(s.getPlanDecisions()).toEqual([]);
  spy.mockRestore();
  s.retryPlanDecisionPersistence();
  expect((await start(false)).getPlanDecisions()).toEqual([]);
});
it("direct decision surface cannot bypass the fresh Sleep validator", async () => {
  const s = await start(),
    t = await trial(s),
    surface = createPlanDecisionSurface({ getAuthoredSetup: () => s.getState() });
  expect(surface.acceptPlanDecision(t.candidate)).toMatchObject({
    status: "rejected",
    reason: "sleepPlacementReviewRequired",
  });
});
it("explicit revoke retains provenance, is idempotent and survives restart", async () => {
  const s = await start(),
    a = await accepted(s);
  expect(s.removePlanDecision(a.decision.id).status).toBe("removed");
  const record = s.getPlanDecisions()[0]!;
  expect(record).toMatchObject({
    id: a.decision.id,
    acceptedAt: a.decision.acceptedAt,
    provenance: a.decision.provenance,
    payload: { revokedAt: expect.any(String) },
  });
  expect(s.removePlanDecision(a.decision.id).status).toBe("removed");
  expect(s.getPlanDecisions()).toEqual([record]);
  const r = await (await start(false)).resolveRequiredSleep({ ownerRange: range });
  expect(r).toMatchObject({ status: "satisfied", placementReviews: [{ status: "revoked" }] });
  if (r.status === "satisfied")
    expect(r.occurrences.find((o) => o.membership === "requested")!.sleepStart).not.toBe(
      a.decision.kind === "placeSleepOccurrence" ? a.decision.payload.sleepStart : "",
    );
});
it("failed revoke preserves the original active placement", async () => {
  const s = await start(),
    a = await accepted(s),
    before = structuredClone(s.getPlanDecisions()),
    write = storage.setItem.bind(storage);
  const spy = vi.spyOn(storage, "setItem").mockImplementation((k, v) => {
    if (k === DAYFRAME_PLAN_DECISIONS_STORAGE_KEY) throw new Error("quota");
    write(k, v);
  });
  expect(s.removePlanDecision(a.decision.id)).toMatchObject({
    status: "notAttempted",
    reason: "storageFailure",
  });
  expect(s.getPlanDecisions()).toEqual(before);
  spy.mockRestore();
  expect((await start(false)).getPlanDecisions()).toEqual(before);
});
it("review Friction uses existing Try/Accept mapping and supersession retains old evidence", async () => {
  const s = await start(),
    a = await accepted(s);
  event(s);
  s.generatePreview({
    rangeStartDate: "2026-09-17",
    rangeEndDate: "2026-09-17",
    planningWindowStart: new Date("2026-09-17T00:00:00"),
    planningWindowEnd: new Date("2026-09-18T00:00:00"),
    generatedAt: at,
  });
  const original = s.getState().preview!;
  const f = original.result.frictionPoints.find((f) => f.kind === "sleep")!,
    fix = f.suggestedFixes[0]!;
  expect(f.sleepEvidence?.kind).toBe("acceptedPlacementReview");
  expect(fix.sleepPlacement).toBeDefined();
  const before = storage.getItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY);
  const revised = s.applySuggestedFixToPreview({
    selectedFrictionPointId: f.id,
    selectedSuggestedFixId: fix.id,
    revisedAt: at,
  });
  expect(revised.preview!.result.foundation?.status).toBe("allocatable");
  expect(storage.getItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY)).toBe(before);
  const candidate = createPlanDecisionAcceptanceCandidate({
    suggestedFix: fix,
    frictionPoint: f,
    originalPreview: original.result,
    revisedPreview: revised.preview!.result,
    authoredSetup: s.getState(),
  });
  expect(candidate.status).toBe("supported");
  if (candidate.status !== "supported") return;
  expect(s.acceptPlanDecision(candidate.candidate).status).toBe("accepted");
  expect(s.getPlanDecisions()).toHaveLength(2);
  expect(s.getPlanDecisions().find((d) => d.id === a.decision.id)).toMatchObject({
    payload: { revokedAt: expect.any(String) },
  });
  expect((await start(false)).getQuarantinedPlanDecisions()).toEqual([]);
});
it("Backup V13 preserves live pins and revoked provenance and rejects wrong source lifetimes", async () => {
  const s = await start(),
    a = await accepted(s);
  s.removePlanDecision(a.decision.id);
  await accepted(s);
  const expected = s.getPlanDecisions(),
    b = await s.exportBackupV13(at);
  expect(b.status).toBe("exported");
  if (b.status !== "exported") return;
  expect(validateDayFrameBackupV13(b.backup).data.planDecisions.decisions).toEqual(expected);
  const malformed = structuredClone(b.backup);
  malformed.data.active.data.sleepRequirements[0]!.incarnationId =
    "22222222-2222-4222-8222-222222222222" as never;
  expect(await s.importBackupV13(malformed)).toMatchObject({ status: "invalidBackup" });
  expect(s.getPlanDecisions()).toEqual(expected);
  await s.clearLocalData();
  expect(await s.importBackupV13(b.backup)).toMatchObject({ status: "restoredV13" });
  expect((await start(false)).getPlanDecisions()).toEqual(expected);
});
it("profiles carry authored intent only, new incarnation blocks old pins, and clear prevents resurrection", async () => {
  const s = await start();
  await accepted(s);
  s.saveProfile({ name: "Sleep", savedAt: at });
  const profile = s.getState().savedProfiles[0]!;
  expect(JSON.stringify(profile)).not.toMatch(
    /placeSleepOccurrence|dependencyFingerprint|incarnationId/,
  );
  s.loadProfile(profile.id);
  expect(await s.resolveRequiredSleep({ ownerRange: range })).toMatchObject({
    status: "contextIncomplete",
    placementReviews: [{ status: "inapplicable" }],
  });
  expect((await s.clearLocalData()).status).toBe("cleared");
  s.retryPlanDecisionPersistence();
  const restarted = await start(false);
  expect(restarted.getPlanDecisions()).toEqual([]);
  expect((await restarted.resolveRequiredSleep({ ownerRange: range })).status).toBe(
    "notConfigured",
  );
});
it("invalid restored geometry is quarantined and blocks planning, never silently dropped", async () => {
  const s = await start();
  await accepted(s);
  const raw = JSON.parse(storage.getItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY)!);
  raw.decisions[0].payload.sleepEnd = raw.decisions[0].payload.sleepStart;
  storage.setItem(DAYFRAME_PLAN_DECISIONS_STORAGE_KEY, JSON.stringify(raw));
  const restarted = await start(false);
  expect(restarted.getQuarantinedPlanDecisions()).toHaveLength(1);
  expect((await restarted.resolveRequiredSleep({ ownerRange: range })).status).toBe(
    "contextIncomplete",
  );
  expect(await restarted.queryCapacity(range)).toMatchObject({
    status: "derived",
    capacity: { qualification: { allocability: "nonAllocatable" } },
  });
});
it("pin review blocks readiness without publishing or creating execution/history authority", async () => {
  const s = await start();
  await accepted(s);
  event(s);
  s.generatePreview({
    rangeStartDate: "2026-09-17",
    rangeEndDate: "2026-09-17",
    planningWindowStart: new Date("2026-09-17T00:00:00"),
    planningWindowEnd: new Date("2026-09-18T00:00:00"),
    generatedAt: at,
  });
  const scope = createReviewScope({
    kind: "day",
    anchorUserDayDate: "2026-09-17",
    weekStartsOn: "monday",
  });
  const review = await s.queryPlanningReview({ reviewScope: scope, historyAsOf: at });
  expect(publicationBlockers(review).length).toBeGreaterThan(0);
  const backup = await s.exportBackupV13(at);
  if (backup.status !== "exported") throw new Error(JSON.stringify(backup));
  expect(JSON.stringify(backup.backup.data.executionHistory)).not.toContain("sleepRequirement");
});

it("a successful atomic storage commit stays accepted even when subsequent reads are unavailable", async () => {
  const s = await start(),
    t = await trial(s),
    write = storage.setItem.bind(storage);
  let committed = false;
  const set = vi.spyOn(storage, "setItem").mockImplementation((k, v) => {
    write(k, v);
    if (k === DAYFRAME_PLAN_DECISIONS_STORAGE_KEY) committed = true;
  });
  const get = vi.spyOn(storage, "getItem").mockImplementation((k) => {
    if (committed && k === DAYFRAME_PLAN_DECISIONS_STORAGE_KEY) throw new Error("read unavailable");
    return storage.values.get(k) ?? null;
  });
  expect(s.acceptPlanDecision(t.candidate).status).toBe("accepted");
  expect(s.getPlanDecisions()).toHaveLength(1);
  get.mockRestore();
  set.mockRestore();
  expect((await start(false)).getPlanDecisions()).toEqual(s.getPlanDecisions());
});
