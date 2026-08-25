import { describe, expect, it } from "vitest";
import {
  definitionSemanticFingerprint,
  type GoalMeasurementDefinitionV1,
} from "../core/measurement/measurementDefinition.js";
import {
  observationSemanticFingerprint,
  type GoalProgressObservationV1,
} from "../core/progressObservation/progressObservation.js";
import { createGoalProgressObservationHistoryQuery } from "./goalProgressObservationHistoryQuery.js";

const goalId = "00000000-0000-4000-8000-000000000001" as never;
const definitionId = "00000000-0000-4000-8000-000000000002" as never;
const observationId = "00000000-0000-4000-8000-000000000003" as never;
function definition(revision = 1): GoalMeasurementDefinitionV1 {
  const raw = {
    version: 1 as const,
    id: definitionId,
    goalId,
    revision,
    status: "active" as const,
    policyRef: { id: "manualQuantityTarget", version: 1 },
    config: { targetValue: revision === 1 ? "50" : "75", unitId: "count" },
    effectiveFrom: `2026-08-0${revision}T00:00:00.000Z`,
    createdAt: `2026-08-0${revision}T00:00:00.000Z`,
  };
  return { ...raw, fingerprint: definitionSemanticFingerprint(raw) };
}
function observation(
  revision = 1,
  status: "active" | "retracted" = "active",
): GoalProgressObservationV1 {
  const raw = {
    version: 1 as const,
    id: observationId,
    revision,
    goalId,
    definitionId,
    definitionRevision: 1,
    unitId: "count",
    value: revision === 1 ? "10" : "12",
    observedAt: "2026-08-01T12:00:00.000Z",
    recordedAt: `2026-08-0${revision}T13:00:00.000Z`,
    status,
  };
  return { ...raw, fingerprint: observationSemanticFingerprint(raw) };
}
function query(
  definitions: GoalMeasurementDefinitionV1[],
  observations: GoalProgressObservationV1[],
) {
  return createGoalProgressObservationHistoryQuery({
    definitions: {
      listMeasurementDefinitionHistory: () => structuredClone(definitions),
      getMeasurementDefinitionRevision: (_id, revision) =>
        structuredClone(definitions.find((item) => item.revision === revision)),
      getMeasurementDefinitionIngressStatus: () => ({ status: "accepted" }),
    },
    observations: {
      exportProgressObservationAuthority: () => ({
        version: 1,
        observations: structuredClone(observations),
      }),
      getProgressObservationIngressStatus: () => ({ status: "accepted" }),
    },
  })(goalId);
}

describe("Goal Progress Observation history query", () => {
  it("returns a current empty period", () => {
    expect(query([definition()], [])).toMatchObject({
      status: "available",
      currentMeasurement: "supported",
      periods: [{ current: true, records: [] }],
    });
  });
  it("collapses corrections and retractions into logical rows", () => {
    const corrected = query([definition()], [observation(), observation(2)]);
    expect(corrected).toMatchObject({
      periods: [{ records: [{ corrected: true, observation: { revision: 2, value: "12" } }] }],
    });
    const retracted = query([definition()], [observation(), observation(2, "retracted")]);
    expect(retracted).toMatchObject({
      periods: [
        {
          records: [
            {
              corrected: false,
              canCorrect: false,
              canRetract: false,
              observation: { status: "retracted" },
            },
          ],
        },
      ],
    });
  });
  it("separates current and previous periods with clone isolation", () => {
    const result = query([definition(), definition(2)], [observation()]);
    expect(result).toMatchObject({
      periods: [
        { current: true, definition: { revision: 2 } },
        { current: false, definition: { revision: 1 } },
      ],
    });
    if (result.status !== "available") throw new Error("fixture");
    result.periods[1]!.records[0]!.observation.value = "changed";
    expect(query([definition(), definition(2)], [observation()])).toMatchObject({
      periods: [{}, { records: [{ observation: { value: "10" } }] }],
    });
  });
  it("keeps readiness states distinct", () => {
    const result = createGoalProgressObservationHistoryQuery({
      definitions: {
        listMeasurementDefinitionHistory: () => [],
        getMeasurementDefinitionRevision: () => undefined,
        getMeasurementDefinitionIngressStatus: () => ({
          status: "protected",
          reason: "readFailure",
        }),
      },
      observations: {
        exportProgressObservationAuthority: () => ({ version: 1, observations: [] }),
        getProgressObservationIngressStatus: () => ({ status: "accepted" }),
      },
    })(goalId);
    expect(result).toEqual({ status: "protected", source: "measurement" });
  });
});
