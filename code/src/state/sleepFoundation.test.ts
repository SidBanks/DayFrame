import { materializePlanPublication } from "../core/historicalPlan/materializePlanPublication.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import {
  createDayFrameStore,
  DAYFRAME_ACTIVE_V2_STORAGE_KEY,
  DAYFRAME_PROFILES_V2_STORAGE_KEY,
} from "./dayFrameStore.js";
import { createActiveV2, projectActiveToPattern } from "./activeV2.js";
import {
  createActiveV3,
  readActiveV3,
  translateActiveV2ToV3,
  validateActiveV3,
} from "./activeV3.js";
import { createInitialDayFrameState } from "./createInitialDayFrameState.js";
import { createDayFrameProfilesStorageV3, readProfilesV3 } from "./dayFrameProfilesV3.js";
import { createDayFrameProfilesStorageV2 } from "./dayFrameProfiles.js";
import { translateBackupV12ToV13, validateDayFrameBackupV13 } from "./dayFrameBackupV13.js";
import { requirement } from "../core/sleep/sleepTestFixtures.js";
import { createSleepOccurrenceReference } from "../core/occurrences/sleepOccurrenceReference.js";
import { resolveDurableOccurrenceReference } from "../core/occurrences/durableOccurrenceReference.js";
import type { DayFrameStore } from "./types.js";

class MemoryStorage implements Storage {
  values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  clear() {
    this.values.clear();
  }
}
let storage: MemoryStorage;
const timestamp = "2026-09-17T12:00:00.000Z";
function legacySleepTemplate() {
  return {
    id: "default_sleep",
    userId: "user_001",
    title: "Sleep",
    category: "sleep" as const,
    placementType: "flexible" as const,
    durationMinutes: 480,
    priority: 1 as const,
    preferredWindow: "custom" as const,
    customWindowStartTime: "22:00" as const,
    customWindowEndTime: "08:00" as const,
    rescheduleBehavior: "autoSameDay" as const,
    requiresResource: false,
    externalResources: [],
    enabled: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
function legacySetup() {
  return createInitialDayFrameState({
    blockTemplates: [legacySleepTemplate()],
    blockRecurrences: [{ id: "rec_sleep", blockTemplateId: "default_sleep", frequency: "daily" }],
  });
}
function intent() {
  const {
    enabled,
    effectiveFrom,
    weekdays,
    durationMinutes,
    window,
    bufferBeforeMinutes,
    bufferAfterMinutes,
  } = requirement();
  return {
    enabled,
    effectiveFrom,
    weekdays,
    durationMinutes,
    window,
    bufferBeforeMinutes,
    bufferAfterMinutes,
  };
}
async function start() {
  const store = createDayFrameStore();
  expect(await store.whenReady()).toEqual({ status: "ready" });
  return store;
}
function author(store: DayFrameStore, expectedRevision: number | null = null) {
  const result = store.authorSleepRequirement({
    id: "primary-sleep",
    expectedRevision,
    ...(store.getState().sleepRequirements?.[0]
      ? { expectedIncarnationId: store.getState().sleepRequirements![0]!.incarnationId }
      : {}),
    intent: intent(),
    recordedAt: timestamp,
  });
  if (result.status !== "authored") throw new Error(JSON.stringify(result));
  return result.requirement;
}
beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("indexedDB", new IDBFactory());
});
describe("Sleep active / profiles / backup / restore foundation", () => {
  it("preserves revisions across edit, restart, delete/recreate and unrelated source edits", async () => {
    const store = await start();
    expect(store.queryEffectiveSleepRequirement("2026-09-17")).toEqual({ status: "notConfigured" });
    const first = author(store),
      second = author(store, 1);
    expect(second.incarnationId).toBe(first.incarnationId);
    expect(second.revision).toBe(2);
    expect(store.getState().sleepRequirements).toEqual([first, second]);
    store.setSchedulingPreferences({ dayBoundaryStartTime: "00:00" });
    const restarted = await start();
    expect(restarted.getState().sleepRequirements).toEqual([first, second]);
    const ref = createSleepOccurrenceReference(first, "2026-09-17");
    expect(
      restarted.deleteSleepRequirement({
        id: first.id,
        incarnationId: first.incarnationId,
        expectedRevision: 2,
      }).status,
    ).toBe("deleted");
    const recreated = author(restarted);
    expect(recreated.incarnationId).not.toBe(first.incarnationId);
    expect(resolveDurableOccurrenceReference(ref, restarted.getState()).status).toBe(
      "lifetimeMismatch",
    );
    const isolated = restarted.getState();
    isolated.sleepRequirements![0]!.durationMinutes = 1;
    expect(restarted.getState().sleepRequirements![0]!.durationMinutes).toBe(480);
  });
  it("does not normalize explicit null authority through canonical creators", () => {
    const setup = { ...createInitialDayFrameState(), sleepRequirements: null };
    expect(() => createActiveV3(setup as never)).toThrow();
    expect(() =>
      createDayFrameProfilesStorageV3([
        { id: "profile", name: "Profile", savedAt: timestamp, data: setup } as never,
      ]),
    ).toThrow();
  });
  it("migrates old Active V2 without inferred Sleep and keeps other lifetimes", async () => {
    const old = createActiveV2(legacySetup());
    const translated = translateActiveV2ToV3(old);
    expect(translated.data.sleepRequirements).toEqual([]);
    expect(translated.data.blockTemplates).toEqual(old.data.blockTemplates);
    expect(translated.data.blockRecurrences).toEqual(old.data.blockRecurrences);
    expect(readActiveV3(translated)).toEqual(translated);
    storage.setItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY, JSON.stringify(old));
    const store = await start();
    expect(store.queryEffectiveSleepRequirement("2026-09-17").status).toBe("notConfigured");
    expect(JSON.parse(storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY)!).version).toBe(3);
    expect((await start()).getState().sleepRequirements).toEqual([]);
  });
  it.each([{ version: 2 }, { incarnationId: "bad" }, { revision: 0 }, { weekdays: [] }])(
    "protects malformed persisted new authority %#",
    async (change) => {
      const envelope = createActiveV3(createInitialDayFrameState());
      const raw = JSON.stringify({
        ...envelope,
        data: { ...envelope.data, sleepRequirements: [{ ...requirement(), ...change }] },
      });
      storage.setItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY, raw);
      const store = createDayFrameStore();
      await store.whenReady();
      expect(store.getActiveLocalIngressStatus().status).toBe("recoveryRequired");
      expect(store.queryEffectiveSleepRequirement("2026-09-17").status).toBe("protected");
      expect(storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY)).toBe(raw);
    },
  );
  it("rejects multiple primary sources and missing new-schema field", () => {
    const envelope = createActiveV3(createInitialDayFrameState());
    expect(() =>
      validateActiveV3({
        ...envelope,
        data: {
          ...envelope.data,
          sleepRequirements: [requirement(), { ...requirement(), id: "another" }],
        },
      }),
    ).toThrow();
    const data = { ...envelope.data } as { sleepRequirements?: unknown };
    delete data.sleepRequirements;
    expect(() => validateActiveV3({ ...envelope, data })).toThrow();
  });
  it("profiles preserve dated portable intent and activate fresh lifetimes twice", async () => {
    const store = await start();
    const first = author(store);
    author(store, 1);
    store.saveProfile({ name: "Sleep pattern", savedAt: timestamp });
    const profile = store.getState().savedProfiles[0]!;
    expect(profile.data.sleepRequirements).toHaveLength(2);
    expect(JSON.stringify(profile)).not.toContain("incarnationId");
    expect(JSON.stringify(profile)).not.toMatch(/acceptedAt|publicationId|executionHistory/);
    store.loadProfile(profile.id);
    const activated = store.getState().sleepRequirements![0]!;
    store.loadProfile(profile.id);
    const activatedAgain = store.getState().sleepRequirements![0]!;
    expect(
      new Set([first.incarnationId, activated.incarnationId, activatedAgain.incarnationId]).size,
    ).toBe(3);
    expect(projectActiveToPattern(store.getState()).sleepRequirements).toEqual(
      profile.data.sleepRequirements,
    );
    const raw = storage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY)!;
    expect(createDayFrameProfilesStorageV3(readProfilesV3(JSON.parse(raw)).profiles)).toEqual(
      JSON.parse(raw),
    );
    expect((await start()).getState().savedProfiles[0]!.data).toEqual(profile.data);
  });
  it("old profiles stay unconfigured; live incarnation in a new profile is rejected", async () => {
    const old = createDayFrameProfilesStorageV2([
      {
        id: "old",
        name: "Old",
        savedAt: timestamp,
        data: projectActiveToPattern(legacySetup()),
      },
    ]);
    expect(readProfilesV3(old).profiles[0]!.data.sleepRequirements).toBeUndefined();
    storage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, JSON.stringify(old));
    const store = await start();
    store.loadProfile("old");
    expect(store.getState().blockTemplates[0]!.id).toBe("default_sleep");
    expect(store.queryEffectiveSleepRequirement("2026-09-17").status).toBe("notConfigured");
    expect(() =>
      createDayFrameProfilesStorageV3([
        {
          ...old.profiles[0]!,
          data: { ...old.profiles[0]!.data, sleepRequirements: [requirement()] },
        },
      ]),
    ).toThrow();
  });
  it("Backup V13 roundtrips full Sleep lineage through the production restore coordinator and restart", async () => {
    const store = await start();
    const first = author(store);
    author(store, 1);
    store.saveProfile({ name: "Sleep", savedAt: timestamp });
    const expected = store.getState().sleepRequirements;
    const exported = await store.exportBackupV13(timestamp);
    expect(exported.status).toBe("exported");
    if (exported.status !== "exported") return;
    expect(validateDayFrameBackupV13(JSON.parse(JSON.stringify(exported.backup)))).toEqual(
      exported.backup,
    );
    expect((await store.exportBackupV12(timestamp)).status).not.toBe("exported");
    store.deleteSleepRequirement({
      id: first.id,
      incarnationId: first.incarnationId,
      expectedRevision: 2,
    });
    expect(await store.importBackupFile(exported.backup)).toMatchObject({ status: "restoredV13" });
    expect(store.getState().sleepRequirements).toEqual(expected);
    expect((await start()).getState().sleepRequirements).toEqual(expected);
  });
  it("translates old V12 backups to no configured Sleep", async () => {
    const store = await start();
    store.setBlockTemplates([legacySleepTemplate()]);
    const legacyTemplates = store.getState().blockTemplates;
    const old = await store.exportBackupV12(timestamp);
    expect(old.status).toBe("exported");
    if (old.status !== "exported") return;
    const translated = translateBackupV12ToV13(old.backup);
    expect(translated.data.active.data.blockTemplates).toEqual(
      old.backup.data.active.data.blockTemplates,
    );
    expect(translated.data.active.data.blockTemplates[0]!.incarnationId).toBe(
      legacyTemplates[0]!.incarnationId,
    );
    expect(translated.data.active.data.sleepRequirements).toEqual([]);
    author(store);
    expect(await store.importBackupV13(translated)).toMatchObject({ status: "restoredV13" });
    expect(store.queryEffectiveSleepRequirement("2026-09-17").status).toBe("notConfigured");
  });
  it("rejects invalid backup before any authority replacement", async () => {
    const store = await start();
    author(store);
    const exported = await store.exportBackupV13(timestamp);
    if (exported.status !== "exported") throw new Error(exported.status);
    const before = storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY);
    exported.backup.data.active.data.sleepRequirements[0]!.revision = 0;
    expect(await store.importBackupV13(exported.backup)).toEqual({ status: "invalidBackup" });
    expect(storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY)).toBe(before);
  });
  it("full clear and restart cannot resurrect active or profile-derived Sleep", async () => {
    const store = await start();
    author(store);
    store.saveProfile({ name: "Sleep", savedAt: timestamp });
    expect((await store.clearLocalData()).status).toBe("cleared");
    const restarted = await start();
    expect(restarted.queryEffectiveSleepRequirement("2026-09-17").status).toBe("notConfigured");
    expect(restarted.getState().savedProfiles).toEqual([]);
  });
});

describe("Sleep migration and non-activation boundaries", () => {
  it("preserves legacy authority and historical non-activation while planning obeys new Sleep", async () => {
    const store = await start();
    const template = legacySleepTemplate();
    store.setShiftDefinitions([
      {
        id: "day",
        userId: "user_001",
        name: "Day",
        startTime: "09:00",
        endTime: "17:00",
        workDays: ["thursday", "friday"],
        crossesMidnight: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ]);
    store.setShiftCycles([
      {
        id: "cycle",
        userId: "user_001",
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
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ]);
    store.setBlockTemplates([template]);
    store.setBlockRecurrences([
      { id: "rec_sleep", blockTemplateId: template.id, frequency: "daily" },
    ]);
    const input = {
      rangeStartDate: "2026-09-17" as const,
      rangeEndDate: "2026-09-18" as const,
      planningWindowStart: new Date(2026, 8, 17, 3),
      planningWindowEnd: new Date(2026, 8, 19, 3),
      generatedAt: timestamp,
    };
    store.generatePreview(input);
    const before = store.getState().preview!;
    const providers = {
      allocateBatchId: () => "11111111-1111-4111-8111-111111111111" as never,
      now: () => timestamp,
    };
    const publicationBefore = materializePlanPublication({
      authoredSetup: store.getState(),
      preview: before,
      providers,
    });
    const capacityBefore = await store.queryCapacity({
      startUserDayDate: "2026-09-17",
      endUserDayDateExclusive: "2026-09-19",
    });
    author(store);
    expect(store.getState().preview!.isStale).toBe(true);
    store.generatePreview(input);
    expect(store.getState().preview!.result.foundation?.sleep.status).toBe("satisfied");
    expect(
      await store.queryCapacity({
        startUserDayDate: "2026-09-17",
        endUserDayDateExclusive: "2026-09-19",
      }),
    ).not.toEqual(capacityBefore);
    expect(
      materializePlanPublication({
        authoredSetup: store.getState(),
        preview: store.getState().preview,
        providers,
      }),
    ).not.toEqual(publicationBefore);
    expect(publicationBefore.status).toBe("materialized");
    expect(store.getState().blockTemplates).toHaveLength(1);
    expect(
      store
        .getState()
        .preview!.result.scheduledBlocks.every((block) => block.source === "template"),
    ).toBe(true);
    const exported = await store.exportBackupV13(timestamp);
    if (exported.status !== "exported") throw new Error(exported.status);
    expect(exported.backup.data.active.data.blockTemplates[0]!.id).toBe("default_sleep");
    expect(exported.backup.data.active.data.sleepRequirements).toHaveLength(1);
    expect(exported.backup.data.historicalPlan.batches).toEqual([]);
    expect(exported.backup.data.planDecisions.decisions).toEqual([]);
    expect(exported.backup.data.executionHistory).toEqual(store.exportExecutionHistoryEnvelope());
  });
  it("rolls back a failed restore after active Sleep was written, without a partial new lifetime", async () => {
    const store = await start();
    const first = author(store);
    const exported = await store.exportBackupV13(timestamp);
    if (exported.status !== "exported") throw new Error(exported.status);
    store.deleteSleepRequirement({
      id: first.id,
      incarnationId: first.incarnationId,
      expectedRevision: 1,
    });
    const current = author(store);
    store.saveProfile({ name: "Rollback current", savedAt: timestamp });
    let injected = false;
    const original = storage.setItem.bind(storage);
    const spy = vi.spyOn(storage, "setItem").mockImplementation((key, value) => {
      if (key === DAYFRAME_PROFILES_V2_STORAGE_KEY && JSON.parse(value).profiles.length === 0) {
        injected = true;
        throw new Error("injected profiles commit failure");
      }
      original(key, value);
    });
    expect(await store.importBackupV13(exported.backup)).toMatchObject({
      status: "rollbackCompleted",
    });
    expect(injected).toBe(true);
    expect(store.getState().sleepRequirements).toEqual([current]);
    spy.mockRestore();
    expect((await start()).getState().sleepRequirements).toEqual([current]);
  });
  it("preserves V2 source when migration cannot serialize or write its V3 successor", async () => {
    const raw = JSON.stringify(createActiveV2(createInitialDayFrameState()));
    storage.setItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY, raw);
    const store = createDayFrameStore(undefined, { serializeActiveV2: () => "{}" });
    await store.whenReady();
    expect(store.getActiveLocalIngressStatus().status).toBe("recoveryRequired");
    expect(storage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY)).toBe(raw);
    expect((await start()).queryEffectiveSleepRequirement("2026-09-17").status).toBe(
      "notConfigured",
    );
  });
  it("rejects edits from an old lifetime even when ID and revision number match", async () => {
    const store = await start();
    const first = author(store);
    store.deleteSleepRequirement({
      id: first.id,
      incarnationId: first.incarnationId,
      expectedRevision: 1,
    });
    author(store);
    expect(
      store.authorSleepRequirement({
        id: first.id,
        expectedRevision: 1,
        expectedIncarnationId: first.incarnationId,
        intent: intent(),
        recordedAt: timestamp,
      }).status,
    ).toBe("stale");
  });
});
