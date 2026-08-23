// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SourceIncarnationId } from "../core/authored/sourceIncarnation.js";
import {
  DAYFRAME_ACTIVE_V2_ESTABLISHED_KEY,
  DAYFRAME_ACTIVE_V2_STORAGE_KEY,
  DAYFRAME_STORAGE_KEY,
} from "./dayFrameStore.js";
import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";

describe("Active V1 to V2 migration", () => {
  const legacy = () => ({
    schedulingPreferences: { dayBoundaryStartTime: "04:00", weekStartsOn: "monday" },
    shiftDefinitions: [], shiftCycles: [], blockTemplates: [], blockRecurrences: [],
    manualEvents: [{ id: "event-1", title: "Appointment", userDayDate: "2026-05-04", allDay: true,
      createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" }],
  });
  const id = (suffix: string) => `00000000-0000-4000-8000-${suffix.padStart(12, "0")}` as SourceIncarnationId;

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("durably writes and verifies V2 before adopting migrated runtime state", () => {
    localStorage.setItem(DAYFRAME_STORAGE_KEY, JSON.stringify({
      schedulingPreferences: { dayBoundaryStartTime: "04:00", weekStartsOn: "monday" },
      shiftDefinitions: [], shiftCycles: [], blockTemplates: [], blockRecurrences: [], manualEvents: [],
    }));

    const store = createReadyDayFrameTestStore();
    const persisted = JSON.parse(localStorage.getItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY)!) as Record<string, unknown>;

    expect(store.getActiveLocalIngressStatus().status).toBe("accepted");
    expect(store.getDurabilityStatus().activeState).toBe("durable");
    expect(store.getState().schedulingPreferences.dayBoundaryStartTime).toBe("04:00");
    expect(persisted).toMatchObject({ app: "DayFrame", surface: "active", version: 2 });
    expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).not.toBeNull();
    expect(localStorage.getItem(DAYFRAME_ACTIVE_V2_ESTABLISHED_KEY)).toBe("1");
  });

  it("rehydrates the exact V2 incarnation without allocating or remigrating V1", () => {
    localStorage.setItem(DAYFRAME_STORAGE_KEY, JSON.stringify(legacy()));
    const first = createReadyDayFrameTestStore(undefined, { allocateSourceIncarnationId: () => id("1") });
    const incarnation = first.getState().manualEvents[0]!.incarnationId;
    const allocator = vi.fn(() => { throw new Error("must not allocate"); });

    const second = createReadyDayFrameTestStore(undefined, { allocateSourceIncarnationId: allocator });

    expect(second.getState().manualEvents[0]!.incarnationId).toBe(incarnation);
    expect(second.getDurabilityStatus().activeState).toBe("durable");
    expect(allocator).not.toHaveBeenCalled();
  });

  it.each([
    ["allocationFailure", { allocateSourceIncarnationId: () => { throw new Error("allocation"); } }],
    ["serializationFailure", { serializeActiveV2: () => { throw new TypeError("serialization"); } }],
  ] as const)("retains %s detail without adopting a partial graph", (detail, options) => {
    const raw = JSON.stringify(legacy());
    localStorage.setItem(DAYFRAME_STORAGE_KEY, raw);

    const store = createReadyDayFrameTestStore(undefined, options);

    expect(store.getActiveLocalIngressStatus()).toMatchObject({
      status: "recoveryRequired", reason: "migrationFailure", migrationFailureDetail: detail,
    });
    expect(store.getState().manualEvents).toEqual([]);
    expect(localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(raw);
    expect(localStorage.getItem(DAYFRAME_ACTIVE_V2_ESTABLISHED_KEY)).toBeNull();
  });

  it("classifies a V2 migration write failure", () => {
    localStorage.setItem(DAYFRAME_STORAGE_KEY, JSON.stringify(legacy()));
    const original = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
      if (key === DAYFRAME_ACTIVE_V2_STORAGE_KEY) throw new Error("write");
      return original.call(this, key, value);
    });
    const store = createReadyDayFrameTestStore(undefined, { allocateSourceIncarnationId: () => id("1") });
    expect(store.getActiveLocalIngressStatus()).toMatchObject({ migrationFailureDetail: "writeFailure" });
    expect(store.getState().manualEvents).toEqual([]);
  });

  it.each([
    ["rereadFailure", "throw"],
    ["rereadValidationFailure", "malformed"],
    ["verificationFailure", "mismatch"],
  ] as const)("classifies %s and protects uncertain V2 authority", (detail, behavior) => {
    localStorage.setItem(DAYFRAME_STORAGE_KEY, JSON.stringify(legacy()));
    const originalGet = Storage.prototype.getItem;
    const originalSet = Storage.prototype.setItem;
    let written = false;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
      const result = originalSet.call(this, key, value);
      if (key === DAYFRAME_ACTIVE_V2_STORAGE_KEY) written = true;
      return result;
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(function (this: Storage, key) {
      if (key === DAYFRAME_ACTIVE_V2_STORAGE_KEY && written) {
        if (behavior === "throw") throw new Error("reread");
        if (behavior === "malformed") return "{";
        const raw = originalGet.call(this, key)!;
        return raw.replace("Appointment", "Changed");
      }
      return originalGet.call(this, key);
    });
    const store = createReadyDayFrameTestStore(undefined, { allocateSourceIncarnationId: () => id("1") });
    expect(store.getActiveLocalIngressStatus()).toMatchObject({ migrationFailureDetail: detail });
    expect(store.getState().manualEvents).toEqual([]);
  });

  it("prevents retained V1 resurrection after clear and restart", async () => {
    localStorage.setItem(DAYFRAME_STORAGE_KEY, JSON.stringify(legacy()));
    const store = createReadyDayFrameTestStore(undefined, { allocateSourceIncarnationId: () => id("1") });
    expect((await store.clearLocalData()).durability).toBe("cleared");
    const restarted = createReadyDayFrameTestStore();
    expect(restarted.getActiveLocalIngressStatus()).toEqual({ status: "noSource", reason: "missing" });
    expect(restarted.getState().manualEvents).toEqual([]);
  });

  it("protects invalid V2 and never falls back to a readable V1 source", () => {
    localStorage.setItem(DAYFRAME_ACTIVE_V2_STORAGE_KEY, JSON.stringify({ app: "DayFrame", surface: "active", version: 2, data: {} }));
    localStorage.setItem(DAYFRAME_STORAGE_KEY, JSON.stringify({ schedulingPreferences: { dayBoundaryStartTime: "09:00" } }));

    const store = createReadyDayFrameTestStore();
    expect(store.getActiveLocalIngressStatus()).toMatchObject({
      status: "recoveryRequired",
      activationBlocked: true,
      sourcePreserved: true,
    });
    expect(store.getState().schedulingPreferences.dayBoundaryStartTime).toBe("03:00");
  });
});
