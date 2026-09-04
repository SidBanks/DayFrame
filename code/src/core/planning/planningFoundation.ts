import { semanticFingerprint } from "../../infrastructure/restore/restoreStaging.js";
import type { LocalDateString } from "../shifts/types.js";
import type { TimeString } from "../time/types.js";

export const PLANNING_FOUNDATION_VERSION = 1 as const;
export const DEPENDENCY_FINGERPRINT_ALGORITHM = "fnv1a64-canonical-v1" as const;

export type PlanningFactId = string & { readonly __planningFactId: unique symbol };
export type PlanningRevision = number & { readonly __planningRevision: unique symbol };
export type PlanningDependencyKind = string & {
  readonly __planningDependencyKind: unique symbol;
};

export type PlanningDependencyReferenceV1 = {
  version: 1;
  kind: PlanningDependencyKind;
  id: string;
  revision: PlanningRevision;
  qualificationVersion?: number;
};

export type DependencyFingerprintV1 = {
  version: 1;
  algorithm: typeof DEPENDENCY_FINGERPRINT_ALGORITHM;
  ordering: "set" | "ordered";
  value: string;
};

export type PlanningOriginV1 =
  | { kind: "directAuthoring" }
  | { kind: "derivedFromDependencies" }
  | { kind: "recurringAuthority"; source: PlanningDependencyReferenceV1 }
  | { kind: "directScheduledAuthority"; source: PlanningDependencyReferenceV1 }
  | { kind: "ordinaryProposalAcceptance"; decision: PlanningDependencyReferenceV1 }
  | { kind: "foundTimeProposalAcceptance"; decision: PlanningDependencyReferenceV1 }
  | { kind: "correctiveDecision"; decision: PlanningDependencyReferenceV1 }
  | { kind: "directSpontaneousExecution"; source: PlanningDependencyReferenceV1 }
  | { kind: "legacyUnknown" };

export type PlanningProvenanceV1 = {
  version: 1;
  role: "authoredAuthority" | "derivedArtifact" | "acceptedAuthority" | "historicalEvidence";
  origin: PlanningOriginV1;
  algorithm?: { id: string; version: number };
};

export type PlanningReasonV1 =
  | { version: 1; code: "freshness.dependencyMismatch"; dependencyKind: string }
  | { version: 1; code: "freshness.dependencyUnavailable"; dependencyKind?: string }
  | { version: 1; code: "provenance.legacyUnknown" }
  | { version: 1; code: "qualification.partialCoverage"; missingUserDayCount: number };

export type PlanningFreshnessV1 =
  | { status: "current" }
  | { status: "stale"; reasons: PlanningReasonV1[] }
  | { status: "unknown"; reasons: PlanningReasonV1[] };

export type CanonicalUserDayCoverageV1 = {
  version: 1;
  kind: "canonicalUserDayInterval";
  startUserDayDate: LocalDateString;
  endUserDayDateExclusive: LocalDateString;
  startsAt: string;
  endsAt: string;
  startDayBoundaryTime: TimeString;
  endDayBoundaryTime: TimeString;
};

export type PlanningQualificationV1 =
  | { status: "qualified" }
  | { status: "partial" | "unqualified"; reasons: PlanningReasonV1[] };

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const DEPENDENCY_KIND = /^[a-z][a-z0-9]*(?:\.[a-z][a-zA-Z0-9]*)+$/;
const OPAQUE_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/;
const POLICY_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/;
const LOCAL_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isPlanningFactId(value: unknown): value is PlanningFactId {
  return typeof value === "string" && UUID_V4.test(value);
}

export function createPlanningFactId(): PlanningFactId {
  const value = globalThis.crypto?.randomUUID?.call(globalThis.crypto);
  if (!isPlanningFactId(value))
    throw new Error("Cryptographic planning identity allocation failed.");
  return value;
}

export function planningRevision(value: number): PlanningRevision {
  if (!Number.isSafeInteger(value) || value < 1)
    throw new RangeError("Revision must be a positive safe integer.");
  return value as PlanningRevision;
}

export function planningDependencyKind(value: string): PlanningDependencyKind {
  if (!DEPENDENCY_KIND.test(value) || value.length > 100)
    throw new RangeError("Dependency kind must be a bounded namespaced identifier.");
  return value as PlanningDependencyKind;
}

export function validatePlanningDependencyReference(
  value: unknown,
): { status: "valid"; reference: PlanningDependencyReferenceV1 } | { status: "invalid" } {
  if (!record(value)) return { status: "invalid" };
  const keys = Object.keys(value).sort().join();
  if (
    keys !== "id,kind,revision,version" &&
    keys !== "id,kind,qualificationVersion,revision,version"
  )
    return { status: "invalid" };
  if (
    value.version !== 1 ||
    typeof value.kind !== "string" ||
    !DEPENDENCY_KIND.test(value.kind) ||
    value.kind.length > 100 ||
    typeof value.id !== "string" ||
    !OPAQUE_ID.test(value.id) ||
    !validRevision(value.revision) ||
    (value.qualificationVersion !== undefined && !validRevision(value.qualificationVersion))
  )
    return { status: "invalid" };
  return { status: "valid", reference: structuredClone(value) as PlanningDependencyReferenceV1 };
}

/** Set mode sorts and deduplicates exact references; ordered mode preserves declared sequence. */
export function fingerprintDependencies(
  dependencies: readonly PlanningDependencyReferenceV1[],
  ordering: "set" | "ordered" = "set",
): DependencyFingerprintV1 {
  const canonical = dependencies.map((value) => {
    const checked = validatePlanningDependencyReference(value);
    if (checked.status === "invalid")
      throw new RangeError("Invalid planning dependency reference.");
    return checked.reference;
  });
  const values =
    ordering === "set"
      ? [...new Map(canonical.map((value) => [dependencyKey(value), value])).values()].sort(
          (a, b) => dependencyKey(a).localeCompare(dependencyKey(b)),
        )
      : canonical;
  return {
    version: 1,
    algorithm: DEPENDENCY_FINGERPRINT_ALGORITHM,
    ordering,
    value: semanticFingerprint(values),
  };
}

export function evaluatePlanningFreshness(input: {
  stored?: DependencyFingerprintV1;
  current?: DependencyFingerprintV1;
  dependencyKind?: string;
}): PlanningFreshnessV1 {
  if (
    !input.stored ||
    !input.current ||
    !validFingerprint(input.stored) ||
    !validFingerprint(input.current)
  )
    return {
      status: "unknown",
      reasons: [
        {
          version: 1,
          code: "freshness.dependencyUnavailable",
          ...(input.dependencyKind ? { dependencyKind: input.dependencyKind } : {}),
        },
      ],
    };
  if (
    input.stored.algorithm !== input.current.algorithm ||
    input.stored.ordering !== input.current.ordering ||
    input.stored.value !== input.current.value
  )
    return {
      status: "stale",
      reasons: [
        {
          version: 1,
          code: "freshness.dependencyMismatch",
          dependencyKind: input.dependencyKind ?? "planning.dependencies",
        },
      ],
    };
  return { status: "current" };
}

export function validateCanonicalUserDayCoverage(
  value: unknown,
): { status: "valid"; coverage: CanonicalUserDayCoverageV1 } | { status: "invalid" } {
  if (
    !record(value) ||
    Object.keys(value).sort().join() !==
      "endDayBoundaryTime,endUserDayDateExclusive,endsAt,kind,startDayBoundaryTime,startUserDayDate,startsAt,version" ||
    value.version !== 1 ||
    value.kind !== "canonicalUserDayInterval" ||
    !validLocalDate(value.startUserDayDate) ||
    !validLocalDate(value.endUserDayDateExclusive) ||
    String(value.startUserDayDate) >= String(value.endUserDayDateExclusive) ||
    !validTimestamp(value.startsAt) ||
    !validTimestamp(value.endsAt) ||
    Date.parse(String(value.startsAt)) >= Date.parse(String(value.endsAt)) ||
    typeof value.startDayBoundaryTime !== "string" ||
    !TIME.test(value.startDayBoundaryTime) ||
    typeof value.endDayBoundaryTime !== "string" ||
    !TIME.test(value.endDayBoundaryTime)
  )
    return { status: "invalid" };
  return { status: "valid", coverage: structuredClone(value) as CanonicalUserDayCoverageV1 };
}

export function validatePlanningProvenance(
  value: unknown,
): { status: "valid"; provenance: PlanningProvenanceV1 } | { status: "invalid" } {
  if (!record(value)) return { status: "invalid" };
  const keys = Object.keys(value).sort().join();
  if (
    (keys !== "origin,role,version" && keys !== "algorithm,origin,role,version") ||
    value.version !== 1
  )
    return { status: "invalid" };
  if (
    !new Set([
      "authoredAuthority",
      "derivedArtifact",
      "acceptedAuthority",
      "historicalEvidence",
    ]).has(String(value.role))
  )
    return { status: "invalid" };
  if (value.algorithm !== undefined && !validVersionedName(value.algorithm))
    return { status: "invalid" };
  if (!validOrigin(value.origin)) return { status: "invalid" };
  return { status: "valid", provenance: structuredClone(value) as PlanningProvenanceV1 };
}

export function validatePlanningReason(value: unknown): value is PlanningReasonV1 {
  if (!record(value) || value.version !== 1 || typeof value.code !== "string") return false;
  if (value.code === "freshness.dependencyMismatch")
    return (
      exact(value, ["version", "code", "dependencyKind"]) &&
      typeof value.dependencyKind === "string"
    );
  if (value.code === "freshness.dependencyUnavailable")
    return (
      (exact(value, ["version", "code"]) || exact(value, ["version", "code", "dependencyKind"])) &&
      (value.dependencyKind === undefined || typeof value.dependencyKind === "string")
    );
  if (value.code === "provenance.legacyUnknown") return exact(value, ["version", "code"]);
  if (value.code === "qualification.partialCoverage")
    return (
      exact(value, ["version", "code", "missingUserDayCount"]) &&
      Number.isSafeInteger(value.missingUserDayCount) &&
      Number(value.missingUserDayCount) > 0
    );
  return false;
}

export function validatePlanningQualification(value: unknown): value is PlanningQualificationV1 {
  if (!record(value)) return false;
  if (value.status === "qualified") return exact(value, ["status"]);
  return (
    (value.status === "partial" || value.status === "unqualified") &&
    exact(value, ["status", "reasons"]) &&
    Array.isArray(value.reasons) &&
    value.reasons.length > 0 &&
    value.reasons.every(validatePlanningReason)
  );
}

function validOrigin(value: unknown): value is PlanningOriginV1 {
  if (!record(value) || typeof value.kind !== "string") return false;
  if (
    value.kind === "legacyUnknown" ||
    value.kind === "directAuthoring" ||
    value.kind === "derivedFromDependencies"
  )
    return exact(value, ["kind"]);
  const field =
    value.kind.endsWith("Acceptance") || value.kind === "correctiveDecision"
      ? "decision"
      : "source";
  return (
    new Set([
      "recurringAuthority",
      "directScheduledAuthority",
      "ordinaryProposalAcceptance",
      "foundTimeProposalAcceptance",
      "correctiveDecision",
      "directSpontaneousExecution",
    ]).has(value.kind) &&
    exact(value, ["kind", field]) &&
    validatePlanningDependencyReference(value[field]).status === "valid"
  );
}

function dependencyKey(value: PlanningDependencyReferenceV1): string {
  return `${value.kind}|${value.id}|${value.revision}|${value.qualificationVersion ?? ""}`;
}
function validFingerprint(value: DependencyFingerprintV1): boolean {
  return (
    value.version === 1 &&
    value.algorithm === DEPENDENCY_FINGERPRINT_ALGORITHM &&
    (value.ordering === "set" || value.ordering === "ordered") &&
    /^[0-9a-f]{16}$/.test(value.value)
  );
}
function validRevision(value: unknown): boolean {
  return Number.isSafeInteger(value) && Number(value) >= 1;
}
function validVersionedName(value: unknown): boolean {
  return (
    record(value) &&
    exact(value, ["id", "version"]) &&
    typeof value.id === "string" &&
    POLICY_ID.test(value.id) &&
    validRevision(value.version)
  );
}
function validTimestamp(value: unknown): boolean {
  return (
    typeof value === "string" &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}
function validLocalDate(value: unknown): value is LocalDateString {
  if (typeof value !== "string" || !LOCAL_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
function exact(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).sort().join() === [...keys].sort().join();
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
