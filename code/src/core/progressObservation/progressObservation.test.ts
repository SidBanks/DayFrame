import { describe, expect, it } from "vitest";
import {
  effectiveObservationHead,
  isCanonicalObservationValue,
  latestEffectiveObservation,
  observationSemanticFingerprint,
  validateProgressObservationAuthority,
  type GoalProgressObservationV1,
} from "./progressObservation.js";
const base = (revision = 1): GoalProgressObservationV1 => {
  const raw = {
    version: 1 as const,
    id: "00000000-0000-4000-8000-000000000010" as never,
    revision,
    goalId: "00000000-0000-4000-8000-000000000001" as never,
    definitionId: "00000000-0000-4000-8000-000000000002" as never,
    definitionRevision: 1,
    unitId: "words",
    value: revision === 1 ? "10000" : "12000",
    observedAt: "2026-08-01T00:00:00.000Z",
    recordedAt: revision === 1 ? "2026-08-01T01:00:00.000Z" : "2026-08-05T01:00:00.000Z",
    status: "active" as const,
  };
  return { ...raw, fingerprint: observationSemanticFingerprint(raw) };
};
describe("Progress Observation V1", () => {
  it("accepts zero and over-target canonical absolute quantities", () => {
    expect(isCanonicalObservationValue("0")).toBe(true);
    expect(isCanonicalObservationValue("50001")).toBe(true);
    expect(isCanonicalObservationValue("01")).toBe(false);
  });
  it("uses recordedAt for correction knowledge", () => {
    const authority = { version: 1 as const, observations: [base(), base(2)] };
    expect(effectiveObservationHead(authority, base().id, "2026-08-03T00:00:00.000Z")?.value).toBe(
      "10000",
    );
    expect(effectiveObservationHead(authority, base().id, "2026-08-06T00:00:00.000Z")?.value).toBe(
      "12000",
    );
    expect(
      latestEffectiveObservation(
        authority,
        base().goalId,
        base().definitionId,
        1,
        "2026-08-06T00:00:00.000Z",
      )?.value,
    ).toBe("12000");
  });
  it("rejects binding changes and same-time active conflicts", () => {
    const other = { ...base(), id: "00000000-0000-4000-8000-000000000011" as never, value: "9" };
    other.fingerprint = observationSemanticFingerprint(other);
    expect(
      validateProgressObservationAuthority({ version: 1, observations: [base(), other] }),
    ).toMatchObject({ status: "invalid", issues: expect.arrayContaining(["sameTimeConflict"]) });
    const changed = { ...base(2), unitId: "pages" };
    changed.fingerprint = observationSemanticFingerprint(changed);
    expect(
      validateProgressObservationAuthority({ version: 1, observations: [base(), changed] }),
    ).toMatchObject({ status: "invalid", issues: expect.arrayContaining(["bindingChanged"]) });
  });
});
