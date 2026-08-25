import { describe, expect, it } from "vitest";
import {
  definitionSemanticFingerprint,
  isCanonicalUnsignedDecimal,
  resolveMeasurementDefinition,
  validateMeasurementDefinitionAuthority,
  validatePolicyConfig,
  MANUAL_QUANTITY_TARGET_POLICY_V1,
  type GoalMeasurementDefinitionV1,
} from "./measurementDefinition.js";
const goal = "00000000-0000-4000-8000-000000000001" as never,
  id = "00000000-0000-4000-8000-000000000002" as never;
function item(
  revision = 1,
  status: "active" | "inactive" = "active",
  at = `2026-08-23T12:00:0${revision}.000Z`,
) {
  const base = {
    version: 1 as const,
    id,
    goalId: goal,
    revision,
    status,
    policyRef: MANUAL_QUANTITY_TARGET_POLICY_V1,
    config: { targetValue: "100", unitId: "words" },
    effectiveFrom: at,
    createdAt: at,
  };
  return {
    ...base,
    fingerprint: definitionSemanticFingerprint(base),
  } as GoalMeasurementDefinitionV1;
}
describe("Measurement Definition V1", () => {
  it("accepts only bounded canonical unsigned decimals and exact manual quantity config", () => {
    for (const value of ["0", "1", "12.5", "0.25", "100000"])
      expect(isCanonicalUnsignedDecimal(value)).toBe(true);
    for (const value of ["01", "1.", "1.0", "1.500", "+1", "-1", "1e3", ".5", `${"1".repeat(101)}`])
      expect(isCanonicalUnsignedDecimal(value)).toBe(false);
    expect(
      validatePolicyConfig(MANUAL_QUANTITY_TARGET_POLICY_V1, { targetValue: "1", unitId: "miles" })
        .status,
    ).toBe("valid");
    expect(
      validatePolicyConfig(MANUAL_QUANTITY_TARGET_POLICY_V1, { targetValue: "0", unitId: "miles" })
        .status,
    ).toBe("invalid");
  });
  it("preserves unknown policy config but rejects malformed known config", () => {
    expect(validatePolicyConfig({ id: "future", version: 3 }, { shape: [1, "x"] })).toMatchObject({
      status: "valid",
      support: "unsupported",
    });
    expect(
      validatePolicyConfig(MANUAL_QUANTITY_TARGET_POLICY_V1, { targetValue: "1", unitId: "hours" }),
    ).toEqual({ status: "invalid" });
  });
  it("validates one immutable monotonic lineage and resolves half-open epochs", () => {
    const authority = { version: 1 as const, definitions: [item(), item(2, "inactive")] };
    expect(validateMeasurementDefinitionAuthority(authority, () => true).status).toBe("valid");
    expect(resolveMeasurementDefinition(authority, goal, "2026-08-23T12:00:01.500Z")).toMatchObject(
      { status: "available", definition: { revision: 1 } },
    );
    expect(resolveMeasurementDefinition(authority, goal, "2026-08-23T12:00:02.000Z")).toEqual({
      status: "notDefined",
    });
    expect(
      validateMeasurementDefinitionAuthority(
        { version: 1, definitions: [item(), { ...item(2), effectiveFrom: item().effectiveFrom }] },
        () => true,
      ).status,
    ).toBe("invalid");
  });
  it("fingerprints semantics independently of identity and time", () => {
    const a = item(),
      b = {
        ...item(),
        id: "00000000-0000-4000-8000-000000000003" as never,
        effectiveFrom: "2027-01-01T00:00:00.000Z",
        createdAt: "2027-01-01T00:00:00.000Z",
      };
    expect(a.fingerprint).toBe(b.fingerprint);
    expect(
      definitionSemanticFingerprint({ ...a, config: { targetValue: "101", unitId: "words" } }),
    ).not.toBe(a.fingerprint);
  });
});
