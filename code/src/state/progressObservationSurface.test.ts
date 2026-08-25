import { beforeEach, describe, expect, it, vi } from "vitest";
import "fake-indexeddb/auto";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createProgressObservationSurface } from "./progressObservationSurface.js";
import {
  definitionSemanticFingerprint,
  type GoalMeasurementDefinitionV1,
} from "../core/measurement/measurementDefinition.js";
const goalId = "00000000-0000-4000-8000-000000000001" as never,
  id = "00000000-0000-4000-8000-000000000002" as never,
  observationId = "00000000-0000-4000-8000-000000000010" as never;
function definition(revision = 1, from = "2026-08-01T00:00:00.000Z"): GoalMeasurementDefinitionV1 {
  const raw = {
    version: 1 as const,
    id,
    goalId,
    revision,
    status: "active" as const,
    policyRef: { id: "manualQuantityTarget", version: 1 },
    config: { targetValue: "50000", unitId: "words" },
    effectiveFrom: from,
    createdAt: from,
  };
  return { ...raw, fingerprint: definitionSemanticFingerprint(raw) };
}
describe("Progress Observation surface", () => {
  beforeEach(() => (indexedDB = new IDBFactory()));
  it("creates, corrects, retracts and preserves as-of evidence", async () => {
    const definitions = [definition()];
    let clock = "2026-08-02T00:00:00.000Z";
    const surface = createProgressObservationSurface({
      storage: createDayFrameDurableDb({ name: "obs" }),
      getGoal: (value) => (value === goalId ? ({ id: goalId } as never) : undefined),
      getDefinition: (value, revision) =>
        definitions.find((x) => x.id === value && x.revision === revision),
      resolveDefinition: () => ({ status: "available", definition: definitions[0]! }),
      allocateId: () => observationId,
      now: () => clock,
    });
    expect(await surface.initializeProgressObservations()).toEqual({ status: "ready" });
    expect(
      await surface.createProgressObservation({
        goalId,
        observedAt: "2026-08-01T12:00:00.000Z",
        value: "0",
        expectedDefinitionRevision: 1,
      }),
    ).toMatchObject({ status: "accepted", observation: { revision: 1, value: "0" } });
    clock = "2026-08-03T00:00:00.000Z";
    expect(
      await surface.correctProgressObservation({
        id: observationId,
        expectedRevision: 1,
        observedAt: "2026-08-01T12:00:00.000Z",
        value: "12000",
      }),
    ).toMatchObject({ status: "accepted", observation: { revision: 2 } });
    expect(
      surface.getEffectiveProgressObservationHead(observationId, "2026-08-02T12:00:00.000Z")?.value,
    ).toBe("0");
    clock = "2026-08-04T00:00:00.000Z";
    expect(await surface.retractProgressObservation(observationId, 2)).toMatchObject({
      status: "accepted",
      observation: { status: "retracted", revision: 3 },
    });
    expect(surface.listGoalProgressObservations(goalId, "2026-08-05T00:00:00.000Z")).toEqual([]);
  });
  it("guards no-op, future time and definition revision", async () => {
    const def = definition(),
      now = vi.fn(() => "2026-08-02T00:00:00.000Z");
    const surface = createProgressObservationSurface({
      storage: createDayFrameDurableDb({ name: "guards" }),
      getGoal: () => ({ id: goalId }) as never,
      getDefinition: () => def,
      resolveDefinition: () => ({ status: "available", definition: def }),
      allocateId: () => observationId,
      now,
    });
    await surface.initializeProgressObservations();
    expect(
      await surface.createProgressObservation({
        goalId,
        observedAt: "2026-08-03T00:00:00.000Z",
        value: "1",
        expectedDefinitionRevision: 1,
      }),
    ).toEqual({ status: "rejected", reason: "futureObservedAt" });
    expect(
      await surface.createProgressObservation({
        goalId,
        observedAt: "2026-08-01T12:00:00.000Z",
        value: "1",
        expectedDefinitionRevision: 2,
      }),
    ).toEqual({ status: "rejected", reason: "staleDefinition" });
    await surface.createProgressObservation({
      goalId,
      observedAt: "2026-08-01T12:00:00.000Z",
      value: "1",
      expectedDefinitionRevision: 1,
    });
    const calls = now.mock.calls.length;
    expect(
      await surface.correctProgressObservation({
        id: observationId,
        expectedRevision: 1,
        observedAt: "2026-08-01T12:00:00.000Z",
        value: "1",
      }),
    ).toMatchObject({ status: "noOp" });
    expect(now).toHaveBeenCalledTimes(calls);
  });
});
