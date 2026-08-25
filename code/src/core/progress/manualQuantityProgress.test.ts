import { describe, expect, it } from "vitest";
import {
  canonicalPercentage,
  compareCanonicalDecimals,
  projectManualQuantityProgressV1,
} from "./manualQuantityProgress.js";
import { definitionSemanticFingerprint } from "../measurement/measurementDefinition.js";
import { observationSemanticFingerprint } from "../progressObservation/progressObservation.js";
const goalId = "00000000-0000-4000-8000-000000000001" as never,
  definitionId = "00000000-0000-4000-8000-000000000002" as never,
  observationId = "00000000-0000-4000-8000-000000000003" as never;
const goal = (status: "active" | "completed" | "archived" = "active", targetDate?: string) => ({
  version: 1 as const,
  id: goalId,
  revision: 1,
  title: "Write",
  status,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...(status === "completed" ? { completedAt: "2026-08-01T00:00:00.000Z" } : {}),
  ...(status === "archived" ? { archivedAt: "2026-08-01T00:00:00.000Z" } : {}),
  ...(targetDate ? { targetDate: targetDate as never } : {}),
  measurementPolicy: { id: "ignored", version: 9 },
  links: [],
});
const definition = (
  targetValue = "50000",
  revision = 1,
  from = "2026-08-01T00:00:00.000Z",
  unitId = "words",
) => {
  const raw = {
    version: 1 as const,
    id: definitionId,
    goalId,
    revision,
    status: "active" as const,
    policyRef: { id: "manualQuantityTarget", version: 1 },
    config: { targetValue, unitId },
    effectiveFrom: from,
    createdAt: from,
  };
  return { ...raw, fingerprint: definitionSemanticFingerprint(raw) };
};
const observation = (
  value = "12400",
  revision = 1,
  recordedAt = "2026-08-02T00:00:00.000Z",
  observedAt = "2026-08-01T12:00:00.000Z",
  definitionRevision = 1,
  unitId = "words",
) => {
  const raw = {
    version: 1 as const,
    id: observationId,
    revision,
    goalId,
    definitionId,
    definitionRevision,
    unitId,
    value,
    observedAt,
    recordedAt,
    status: "active" as const,
  };
  return { ...raw, fingerprint: observationSemanticFingerprint(raw) };
};
const query = { goalId, evaluationAsOf: "2026-08-03T00:00:00.000Z" };
describe("manual quantity decimal arithmetic", () => {
  it.each([
    ["0", "100", "0"],
    ["25", "100", "25"],
    ["100", "100", "100"],
    ["125", "100", "125"],
    ["1", "3", "33.3333"],
    ["0.25", "1", "25"],
  ])("derives %s/%s", (a, b, result) => expect(canonicalPercentage(a, b)).toBe(result));
  it("compares huge bounded decimals exactly", () => {
    expect(
      compareCanonicalDecimals(
        "999999999999999999999999999999.9",
        "1000000000000000000000000000000",
      ),
    ).toBe(-1);
    expect(canonicalPercentage("1", "6")).toBe("16.6667");
  });
});
describe("Manual Quantity Progress V1", () => {
  it("projects exact quantity, percentage, comparison and provenance", () => {
    expect(
      projectManualQuantityProgressV1({
        query,
        goal: goal(),
        definitionResolution: { status: "available", definition: definition() },
        observation: observation(),
      }),
    ).toMatchObject({
      status: "available",
      percentage: "24.8",
      comparison: "belowTarget",
      quantity: { observedValue: "12400", targetValue: "50000", unitId: "words" },
      provenance: { observationRevision: 1, definitionRevision: 1 },
    });
  });
  it.each([
    ["0", "0", "belowTarget"],
    ["50000", "100", "atTarget"],
    ["60000", "120", "aboveTarget"],
  ])("keeps %s as known evidence", (value, percentage, comparison) =>
    expect(
      projectManualQuantityProgressV1({
        query,
        goal: goal(),
        definitionResolution: { status: "available", definition: definition() },
        observation: observation(value),
      }),
    ).toMatchObject({ status: "available", percentage, comparison }),
  );
  it("distinguishes missing Goal, definition, unsupported policy, and evidence", () => {
    expect(projectManualQuantityProgressV1({ query })).toMatchObject({ status: "goalNotFound" });
    expect(projectManualQuantityProgressV1({ query, goal: goal() })).toMatchObject({
      status: "notDefined",
    });
    const unsupported = {
      ...definition(),
      policyRef: { id: "future", version: 1 },
      config: { unitId: "words" },
    };
    unsupported.fingerprint = definitionSemanticFingerprint(unsupported);
    expect(
      projectManualQuantityProgressV1({
        query,
        goal: goal(),
        definitionResolution: { status: "unsupportedPolicy", definition: unsupported },
      }),
    ).toMatchObject({ status: "unsupportedPolicy" });
    expect(
      projectManualQuantityProgressV1({
        query,
        goal: goal(),
        definitionResolution: { status: "available", definition: definition() },
      }),
    ).toMatchObject({ status: "insufficientEvidence" });
  });
  it("keeps lifecycle and target date contextual only", () => {
    const active = projectManualQuantityProgressV1({
      query,
      goal: goal("active", "2025-01-01"),
      definitionResolution: { status: "available", definition: definition("100") },
      observation: observation("40"),
    });
    const completed = projectManualQuantityProgressV1({
      query,
      goal: goal("completed", "2030-01-01"),
      definitionResolution: { status: "available", definition: definition("100") },
      observation: observation("40"),
    });
    expect(active).toMatchObject({
      status: "available",
      percentage: "40",
      currentGoal: { status: "active" },
    });
    expect(completed).toMatchObject({
      status: "available",
      percentage: "40",
      currentGoal: { status: "completed" },
    });
  });
  it("is clone isolated and rejects invalid query/binding", () => {
    const result = projectManualQuantityProgressV1({
      query,
      goal: goal(),
      definitionResolution: { status: "available", definition: definition() },
      observation: observation(),
    });
    if (result.status === "available") result.definition.config.targetValue = "1";
    expect(
      projectManualQuantityProgressV1({
        query,
        goal: goal(),
        definitionResolution: { status: "available", definition: definition() },
        observation: observation(),
      }),
    ).toMatchObject({ quantity: { targetValue: "50000" } });
    expect(
      projectManualQuantityProgressV1({ query: { ...query, evaluationAsOf: "bad" } }),
    ).toMatchObject({ status: "invalidQuery" });
    expect(
      projectManualQuantityProgressV1({
        query,
        goal: goal(),
        definitionResolution: { status: "available", definition: definition() },
        observation: observation(
          "1",
          1,
          query.evaluationAsOf,
          "2026-08-01T12:00:00.000Z",
          1,
          "pages",
        ),
      }),
    ).toMatchObject({ status: "invalidAuthority" });
  });
});
