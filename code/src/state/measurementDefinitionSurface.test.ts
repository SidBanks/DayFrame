import { describe, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createMeasurementDefinitionSurface } from "./measurementDefinitionSurface.js";
import { MANUAL_QUANTITY_TARGET_POLICY_V1 } from "../core/measurement/measurementDefinition.js";
const goalId = "00000000-0000-4000-8000-000000000001" as never,
  definitionId = "00000000-0000-4000-8000-000000000002" as never;
const goal = {
  version: 1,
  id: goalId,
  revision: 1,
  title: "Write",
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  links: [],
} as never;
describe("measurementDefinitionSurface", () => {
  it("appends guarded revisions, no-ops, stop/restart, and reloads exact history", async () => {
    const db = createDayFrameDurableDb({
      indexedDB: new IDBFactory(),
      name: "measurement-surface",
    });
    const times = [
      "2026-08-23T12:00:01.000Z",
      "2026-08-23T12:00:02.000Z",
      "2026-08-23T12:00:03.000Z",
    ];
    const setup = () =>
      createMeasurementDefinitionSurface({
        storage: db,
        getGoal: () => goal,
        allocateId: () => definitionId,
        now: () => times.shift()!,
      });
    const first = setup();
    expect(await first.initializeMeasurementDefinitions()).toEqual({ status: "ready" });
    const created = await first.createMeasurementDefinition(
      goalId,
      MANUAL_QUANTITY_TARGET_POLICY_V1,
      { targetValue: "100", unitId: "words" },
    );
    expect(created).toMatchObject({ status: "accepted", definition: { revision: 1 } });
    expect(
      await first.reviseMeasurementDefinition(definitionId, 1, MANUAL_QUANTITY_TARGET_POLICY_V1, {
        targetValue: "100",
        unitId: "words",
      }),
    ).toMatchObject({ status: "noOp" });
    expect(await first.stopMeasuringGoal(definitionId, 1)).toMatchObject({
      status: "accepted",
      definition: { revision: 2, status: "inactive" },
    });
    expect(
      await first.reviseMeasurementDefinition(definitionId, 1, MANUAL_QUANTITY_TARGET_POLICY_V1, {
        targetValue: "200",
        unitId: "words",
      }),
    ).toEqual({ status: "rejected", reason: "staleRevision" });
    expect(await first.restartMeasurement(definitionId, 2)).toMatchObject({
      status: "accepted",
      definition: { revision: 3, status: "active" },
    });
    expect(first.listMeasurementDefinitionHistory(goalId)).toHaveLength(3);
    const restarted = setup();
    expect(await restarted.initializeMeasurementDefinitions()).toEqual({ status: "ready" });
    expect(restarted.listMeasurementDefinitionHistory(goalId)).toHaveLength(3);
  });
  it("enforces Goal integrity, one lineage, clone isolation, and mutation admission", async () => {
    const surface = createMeasurementDefinitionSurface({
      storage: createDayFrameDurableDb({
        indexedDB: new IDBFactory(),
        name: "measurement-integrity",
      }),
      getGoal: (id) => (id === goalId ? goal : undefined),
      allocateId: () => definitionId,
      now: () => "2026-08-23T12:00:01.000Z",
    });
    expect(await surface.initializeMeasurementDefinitions()).toEqual({ status: "ready" });
    expect(
      await surface.createMeasurementDefinition(
        "00000000-0000-4000-8000-000000000009" as never,
        MANUAL_QUANTITY_TARGET_POLICY_V1,
        { targetValue: "1", unitId: "count" },
      ),
    ).toEqual({ status: "rejected", reason: "goalNotFound" });
    await surface.createMeasurementDefinition(goalId, MANUAL_QUANTITY_TARGET_POLICY_V1, {
      targetValue: "1",
      unitId: "count",
    });
    expect(
      await surface.createMeasurementDefinition(goalId, MANUAL_QUANTITY_TARGET_POLICY_V1, {
        targetValue: "2",
        unitId: "count",
      }),
    ).toEqual({ status: "rejected", reason: "lineageExists" });
    const history = surface.listMeasurementDefinitionHistory(goalId);
    history[0]!.config.targetValue = "bad";
    expect(surface.listMeasurementDefinitionHistory(goalId)[0]!.config.targetValue).toBe("1");
  });
  it("protects malformed durable authority", async () => {
    const storage = {
      getAll: vi.fn().mockResolvedValue({ status: "success", value: [{ id: "bad" }] }),
    } as never;
    const surface = createMeasurementDefinitionSurface({ storage, getGoal: () => goal });
    expect(await surface.initializeMeasurementDefinitions()).toEqual({ status: "protected" });
    expect(surface.getMeasurementDefinitionIngressStatus().status).toBe("protected");
  });
});
