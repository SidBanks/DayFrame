import { describe, expect, it } from "vitest";
import {
  evaluatePlanningFreshness,
  fingerprintDependencies,
  planningDependencyKind,
  planningRevision,
  validateCanonicalUserDayCoverage,
  validatePlanningDependencyReference,
  validatePlanningProvenance,
  validatePlanningQualification,
  validatePlanningReason,
  type CanonicalUserDayCoverageV1,
  type PlanningDependencyReferenceV1,
} from "./planningFoundation.js";

const dependency = (kind: string, id: string, revision: number): PlanningDependencyReferenceV1 => ({
  version: 1,
  kind: planningDependencyKind(kind),
  id,
  revision: planningRevision(revision),
});

const coverage: CanonicalUserDayCoverageV1 = {
  version: 1,
  kind: "canonicalUserDayInterval",
  startUserDayDate: "2026-11-01",
  endUserDayDateExclusive: "2026-11-02",
  startsAt: "2026-11-01T11:00:00.000Z",
  endsAt: "2026-11-02T12:00:00.000Z",
  startDayBoundaryTime: "06:00",
  endDayBoundaryTime: "06:00",
};

describe("planning provenance and freshness foundation", () => {
  it("uses validated opaque, revisioned, namespaced dependency references", () => {
    const value = dependency("goal.relationship", "11111111-1111-4111-8111-111111111111", 3);
    expect(validatePlanningDependencyReference(value)).toEqual({
      status: "valid",
      reference: value,
    });
    expect(() => planningRevision(0)).toThrow(RangeError);
    expect(() => planningDependencyKind("unscoped")).toThrow(RangeError);
    expect(validatePlanningDependencyReference({ ...value, revision: 0 })).toEqual({
      status: "invalid",
    });
  });

  it("fingerprints only declared dependencies with explicit set or ordered semantics", () => {
    const a = dependency("goal.relationship", "relation-a", 1);
    const b = dependency("goal.authority", "goal-b", 4);
    expect(fingerprintDependencies([a, b])).toEqual(fingerprintDependencies([b, a]));
    expect(fingerprintDependencies([a, a])).toEqual(fingerprintDependencies([a]));
    expect(fingerprintDependencies([a, b], "ordered")).not.toEqual(
      fingerprintDependencies([b, a], "ordered"),
    );
    expect(fingerprintDependencies([a])).not.toEqual(
      fingerprintDependencies([{ ...a, revision: planningRevision(2) }]),
    );
    const original = fingerprintDependencies([a]);
    expect(fingerprintDependencies([a])).toEqual(original);
  });

  it("reports Current, Stale, and conservative Unknown without a clock", () => {
    const stored = fingerprintDependencies([dependency("goal.relationship", "relation", 1)]);
    const changed = fingerprintDependencies([dependency("goal.relationship", "relation", 2)]);
    expect(evaluatePlanningFreshness({ stored, current: stored })).toEqual({ status: "current" });
    expect(evaluatePlanningFreshness({ stored, current: changed })).toMatchObject({
      status: "stale",
      reasons: [{ code: "freshness.dependencyMismatch" }],
    });
    expect(evaluatePlanningFreshness({ stored })).toMatchObject({
      status: "unknown",
      reasons: [{ code: "freshness.dependencyUnavailable" }],
    });
  });

  it("validates explicit canonical user-day coverage and rejects invalid boundaries", () => {
    expect(validateCanonicalUserDayCoverage(coverage)).toEqual({ status: "valid", coverage });
    expect(validateCanonicalUserDayCoverage({ ...coverage, endsAt: coverage.startsAt })).toEqual({
      status: "invalid",
    });
    expect(
      validateCanonicalUserDayCoverage({
        ...coverage,
        endUserDayDateExclusive: coverage.startUserDayDate,
      }),
    ).toEqual({ status: "invalid" });
  });

  it("round-trips closed provenance origins and keeps legacy unknown explicit", () => {
    const source = dependency("commitment.authority", "commitment-1", 2);
    const recurring = {
      version: 1 as const,
      role: "authoredAuthority" as const,
      origin: { kind: "recurringAuthority" as const, source },
    };
    expect(validatePlanningProvenance(JSON.parse(JSON.stringify(recurring)))).toEqual({
      status: "valid",
      provenance: recurring,
    });
    const unknown = {
      version: 1 as const,
      role: "historicalEvidence" as const,
      origin: { kind: "legacyUnknown" as const },
    };
    expect(validatePlanningProvenance(unknown)).toEqual({ status: "valid", provenance: unknown });
    expect(
      validatePlanningProvenance({ ...unknown, origin: { kind: "futureTrustedOrigin" } }),
    ).toEqual({ status: "invalid" });
  });

  it("keeps qualification and structured reasons distinct from freshness and authority", () => {
    const reason = {
      version: 1 as const,
      code: "qualification.partialCoverage" as const,
      missingUserDayCount: 2,
    };
    expect(validatePlanningReason(reason)).toBe(true);
    expect(validatePlanningQualification({ status: "partial", reasons: [reason] })).toBe(true);
    expect(validatePlanningQualification({ status: "partial", reasons: [] })).toBe(false);
    expect(validatePlanningReason({ ...reason, code: "free.form" })).toBe(false);
  });
});
