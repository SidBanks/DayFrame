/* @vitest-environment jsdom */
import { describe, expect, it, vi } from "vitest";
import { createReadyDayFrameTestStore } from "./tests/dayFrameStoreTestUtils.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  getDayFrameRuntimeAuthorityController,
} from "./dayFrameRuntimeAuthority.js";
import { DayFrameMutationAdmissionError } from "./dayFrameMutationAdmission.js";

describe("five-participant runtime authority integration", () => {
  it("installs all five targets before one coherent notification flush", () => {
    const store = createReadyDayFrameTestStore();
    const controller = getDayFrameRuntimeAuthorityController(
      store,
      DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
    );
    const target = controller.captureAll() as Record<string, Record<string, unknown>>;
    const observed: string[][] = [];
    const crossRead = () =>
      observed.push([
        store.getState().schedulingPreferences.dayBoundaryStartTime,
        String(store.getState().savedProfiles.length),
        String(store.getPlanDecisions().length),
        String(store.getExecutionHistory().length),
        store.getStatus().status,
      ]);
    const unsubscribers = [
      store.subscribe(crossRead),
      store.subscribeProfileIngress(crossRead),
      store.subscribePlanDecisions(crossRead),
      store.subscribeExecutionHistory(crossRead),
      store.subscribeHistory(crossRead),
    ];
    expect(controller.begin("internalReplacement").status).toBe("begun");
    const active = structuredClone(target.active!);
    (
      active.activeState as { schedulingPreferences: { dayBoundaryStartTime: string } }
    ).schedulingPreferences.dayBoundaryStartTime = "01:23";
    const profiles = structuredClone(target.profiles!);
    profiles.profiles = [];
    const decisions = structuredClone(target.planDecisions!);
    decisions.durability = "pending";
    const execution = structuredClone(target.executionHistory!);
    execution.durability = "pending";
    const historical = structuredClone(target.historicalPlan!);
    historical.status = { status: "pending", pendingCount: 0 };
    for (const [id, value] of Object.entries({
      active,
      profiles,
      planDecisions: decisions,
      executionHistory: execution,
      historicalPlan: historical,
    })) {
      expect(controller.install(id as never, value)).toEqual({ status: "installed" });
    }
    expect(observed).toEqual([]);
    const mutationAttempt = vi.fn(() => {
      expect(() => store.setSchedulingPreferences({ weekStartsOn: "sunday" })).toThrow(
        DayFrameMutationAdmissionError,
      );
    });
    const unsubscribeMutation = store.subscribe(mutationAttempt);
    expect(controller.commit()).toEqual({ status: "committed" });
    expect(observed).toHaveLength(5);
    for (const value of observed) expect(value).toEqual(["01:23", "0", "0", "0", "pending"]);
    expect(mutationAttempt).toHaveBeenCalledOnce();
    unsubscribeMutation();
    for (const unsubscribe of unsubscribers) unsubscribe();
  });

  it("restores exact clone-isolated five-participant snapshots on abort without persistence", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const store = createReadyDayFrameTestStore();
    const controller = getDayFrameRuntimeAuthorityController(
      store,
      DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
    );
    const before = controller.captureAll();
    expect(controller.begin("restore").status).toBe("begun");
    const target = structuredClone(before) as Record<string, Record<string, unknown>>;
    const active = target.active!;
    (
      active.activeState as { schedulingPreferences: { dayBoundaryStartTime: string } }
    ).schedulingPreferences.dayBoundaryStartTime = "22:22";
    (target.planDecisions as Record<string, unknown>).durability = "storageFailure";
    (target.executionHistory as Record<string, unknown>).durability = "serializationFailure";
    (target.historicalPlan as Record<string, unknown>).status = {
      status: "protected",
      reason: "physicalMismatch",
    };
    for (const id of ["active", "planDecisions", "executionHistory", "historicalPlan"] as const) {
      expect(controller.install(id, target[id])).toEqual({ status: "installed" });
    }
    expect(controller.abort()).toEqual({ status: "aborted" });
    expect(controller.captureAll()).toEqual(before);
    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
  });
});
