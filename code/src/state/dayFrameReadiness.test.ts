import { describe, expect, it } from "vitest";
import { IDBFactory } from "fake-indexeddb";

import {
  createBootstrapPlaceholderState,
  isBootstrapPlaceholderState,
  isDayFrameReady,
} from "./dayFrameReadiness.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { DayFrameMutationAdmissionError } from "./dayFrameMutationAdmission.js";

describe("DayFrame readiness", () => {
  it("provides the stable transitional ready contract", async () => {
    const store = createDayFrameStore(undefined, { bootstrapMode: "resolved-test" });
    expect(store.getReadiness()).toEqual({ status: "ready" });
    expect(await store.whenReady()).toEqual({ status: "ready" });
    expect(isDayFrameReady(store.getReadiness())).toBe(true);
    const listener = () => undefined;
    expect(store.subscribeReadiness(listener)).toEqual(expect.any(Function));
  });

  it("returns a synchronous placeholder shell and becomes ready after coordinated collections", async () => {
    const prior = globalThis.indexedDB;
    Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: new IDBFactory() });
    try {
      const store = createDayFrameStore();
      expect(store.getReadiness()).toEqual({ status: "initializing" });
      expect(isBootstrapPlaceholderState(store.getState())).toBe(false);
      expect(store.getState()).toMatchObject({
        shiftDefinitions: [],
        savedProfiles: [],
        preview: null,
      });
      expect(() => store.setSchedulingPreferences({ weekStartsOn: "sunday" })).toThrow(
        DayFrameMutationAdmissionError,
      );
      expect(await store.whenReady()).toEqual({ status: "ready" });
      expect(store.getReadiness()).toEqual({ status: "ready" });
    } finally {
      Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: prior });
    }
  });

  it("terminates readiness structurally when the pre-bootstrap hook protects authority", async () => {
    const store = createDayFrameStore(undefined, {
      preBootstrapHook: async () => ({
        status: "protected",
        reason: "authorityRecoveryRequired",
      }),
    });
    expect(await store.whenReady()).toEqual({
      status: "protected",
      reason: "authorityRecoveryRequired",
    });
    expect(store.getReadiness()).toEqual({
      status: "protected",
      reason: "authorityRecoveryRequired",
    });
    expect(() => store.generatePreview({} as never)).toThrow(DayFrameMutationAdmissionError);
  });

  it("creates an identity-free non-authoritative bootstrap placeholder", () => {
    const placeholder = createBootstrapPlaceholderState();
    expect(isBootstrapPlaceholderState(placeholder)).toBe(true);
    expect(placeholder).toMatchObject({
      shiftDefinitions: [],
      shiftCycles: [],
      blockTemplates: [],
      blockRecurrences: [],
      manualEvents: [],
      savedProfiles: [],
      preview: null,
    });
    expect(JSON.stringify(placeholder)).not.toContain("incarnation");
  });
});
