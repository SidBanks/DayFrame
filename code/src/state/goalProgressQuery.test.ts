import { describe, expect, it } from "vitest";
import { createGoalProgressQuery } from "./goalProgressQuery.js";
import { definitionSemanticFingerprint } from "../core/measurement/measurementDefinition.js";
import { observationSemanticFingerprint } from "../core/progressObservation/progressObservation.js";
const goalId = "00000000-0000-4000-8000-000000000001" as never,
  id = "00000000-0000-4000-8000-000000000002" as never,
  oid = "00000000-0000-4000-8000-000000000003" as never,
  query = { goalId, evaluationAsOf: "2026-08-10T00:00:00.000Z" };
const goal = {
  version: 1 as const,
  id: goalId,
  revision: 1,
  title: "Read",
  status: "active" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  links: [],
};
const dr = {
    version: 1 as const,
    id,
    goalId,
    revision: 1,
    status: "active" as const,
    policyRef: { id: "manualQuantityTarget", version: 1 },
    config: { targetValue: "20", unitId: "count" },
    effectiveFrom: "2026-08-01T00:00:00.000Z",
    createdAt: "2026-08-01T00:00:00.000Z",
  },
  definition = { ...dr, fingerprint: definitionSemanticFingerprint(dr) };
const or = {
    version: 1 as const,
    id: oid,
    revision: 1,
    goalId,
    definitionId: id,
    definitionRevision: 1,
    unitId: "count",
    value: "8",
    observedAt: "2026-08-05T00:00:00.000Z",
    recordedAt: "2026-08-06T00:00:00.000Z",
    status: "active" as const,
  },
  observation = { ...or, fingerprint: observationSemanticFingerprint(or) };
describe("Goal Progress application query", () => {
  it("reads only Goal, Definition, and Observation surfaces", () => {
    const fn = createGoalProgressQuery({
      goals: { getGoal: () => goal, getGoalIngressStatus: () => ({ status: "accepted" }) },
      definitions: {
        getCurrentMeasurementDefinition: () => ({ status: "available", definition }),
        getMeasurementDefinitionIngressStatus: () => ({ status: "accepted" }),
      },
      observations: {
        getLatestProgressObservation: () => observation,
        getProgressObservationIngressStatus: () => ({ status: "accepted" }),
      },
    });
    expect(fn(query)).toMatchObject({ status: "available", percentage: "40" });
  });
  it("honors correction, retraction, and late-entry knowledge cutoffs", () => {
    const correctedRaw = {
        ...or,
        revision: 2,
        value: "12",
        recordedAt: "2026-08-08T00:00:00.000Z",
      },
      corrected = { ...correctedRaw, fingerprint: observationSemanticFingerprint(correctedRaw) },
      retractedRaw = {
        ...correctedRaw,
        revision: 3,
        status: "retracted" as const,
        recordedAt: "2026-08-12T00:00:00.000Z",
      },
      retracted = { ...retractedRaw, fingerprint: observationSemanticFingerprint(retractedRaw) };
    const fn = createGoalProgressQuery({
      goals: { getGoal: () => goal, getGoalIngressStatus: () => ({ status: "accepted" }) },
      definitions: {
        getCurrentMeasurementDefinition: () => ({ status: "available", definition }),
        getMeasurementDefinitionIngressStatus: () => ({ status: "accepted" }),
      },
      observations: {
        getLatestProgressObservation: (_goal, _id, _revision, cutoff) =>
          cutoff < corrected.recordedAt
            ? observation
            : cutoff < retracted.recordedAt
              ? corrected
              : undefined,
        getProgressObservationIngressStatus: () => ({ status: "accepted" }),
      },
    });
    expect(fn({ ...query, evaluationAsOf: "2026-08-07T00:00:00.000Z" })).toMatchObject({
      status: "available",
      percentage: "40",
    });
    expect(fn({ ...query, evaluationAsOf: "2026-08-09T00:00:00.000Z" })).toMatchObject({
      status: "available",
      percentage: "60",
    });
    expect(fn({ ...query, evaluationAsOf: "2026-08-13T00:00:00.000Z" })).toMatchObject({
      status: "insufficientEvidence",
    });
  });
  it("starts a fresh evidence epoch after definition revision", () => {
    const r2raw = {
        ...dr,
        revision: 2,
        config: { targetValue: "40", unitId: "count" },
        effectiveFrom: "2026-08-15T00:00:00.000Z",
        createdAt: "2026-08-15T00:00:00.000Z",
      },
      r2 = { ...r2raw, fingerprint: definitionSemanticFingerprint(r2raw) };
    const fn = createGoalProgressQuery({
      goals: { getGoal: () => goal, getGoalIngressStatus: () => ({ status: "accepted" }) },
      definitions: {
        getCurrentMeasurementDefinition: (_goal, cutoff) =>
          cutoff < r2.effectiveFrom
            ? { status: "available", definition }
            : { status: "available", definition: r2 },
        getMeasurementDefinitionIngressStatus: () => ({ status: "accepted" }),
      },
      observations: {
        getLatestProgressObservation: (_goal, _id, revision) =>
          revision === 1 ? observation : undefined,
        getProgressObservationIngressStatus: () => ({ status: "accepted" }),
      },
    });
    expect(fn(query)).toMatchObject({ status: "available", percentage: "40" });
    expect(fn({ ...query, evaluationAsOf: "2026-08-16T00:00:00.000Z" })).toMatchObject({
      status: "insufficientEvidence",
      definition: { revision: 2 },
    });
  });
  it.each([
    ["goalProtected", "goals"],
    ["definitionProtected", "definitions"],
    ["observationProtected", "observations"],
  ] as const)("returns %s independently", (status, protectedSurface) => {
    const fn = createGoalProgressQuery({
      goals: {
        getGoal: () => goal,
        getGoalIngressStatus: () =>
          protectedSurface === "goals"
            ? { status: "protected", reason: "invalidAuthority" }
            : { status: "accepted" },
      },
      definitions: {
        getCurrentMeasurementDefinition: () => ({ status: "available", definition }),
        getMeasurementDefinitionIngressStatus: () =>
          protectedSurface === "definitions"
            ? { status: "protected", reason: "invalidAuthority" }
            : { status: "accepted" },
      },
      observations: {
        getLatestProgressObservation: () => observation,
        getProgressObservationIngressStatus: () =>
          protectedSurface === "observations"
            ? { status: "protected", reason: "invalidAuthority" }
            : { status: "accepted" },
      },
    });
    expect(fn(query)).toMatchObject({ status });
  });
});
