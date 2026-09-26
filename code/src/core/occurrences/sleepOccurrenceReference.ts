import { isSourceIncarnationId, type SourceIncarnationId } from "../authored/sourceIncarnation.js";
import { isSleepOwnerDate, queryEffectiveSleepRequirement } from "../sleep/sleepRequirement.js";
import type { LocalDateString } from "../shifts/types.js";
export type SleepOccurrenceReferenceV1 = {
  version: 1;
  sourceKind: "sleepRequirement";
  requirement: { id: string; incarnationId: SourceIncarnationId };
  coordinate: { scopeKind: "userDay"; userDayDate: LocalDateString; slot: 0 };
};
export function isSleepOccurrenceReference(value: unknown): value is SleepOccurrenceReferenceV1 {
  if (
    !record(value) ||
    !keys(value, ["version", "sourceKind", "requirement", "coordinate"]) ||
    value.version !== 1 ||
    value.sourceKind !== "sleepRequirement" ||
    !record(value.requirement) ||
    !record(value.coordinate)
  )
    return false;
  return (
    keys(value.requirement, ["id", "incarnationId"]) &&
    typeof value.requirement.id === "string" &&
    value.requirement.id.trim() !== "" &&
    isSourceIncarnationId(value.requirement.incarnationId) &&
    keys(value.coordinate, ["scopeKind", "userDayDate", "slot"]) &&
    value.coordinate.scopeKind === "userDay" &&
    value.coordinate.slot === 0 &&
    isSleepOwnerDate(value.coordinate.userDayDate)
  );
}
export function createSleepOccurrenceReference(
  requirement: SleepOccurrenceReferenceV1["requirement"],
  ownerDay: LocalDateString,
): SleepOccurrenceReferenceV1 {
  const reference: SleepOccurrenceReferenceV1 = {
    version: 1,
    sourceKind: "sleepRequirement",
    requirement: { id: requirement.id, incarnationId: requirement.incarnationId },
    coordinate: { scopeKind: "userDay", userDayDate: ownerDay, slot: 0 },
  };
  if (!isSleepOccurrenceReference(reference))
    throw new RangeError("Invalid Sleep occurrence reference.");
  return reference;
}
/** Applicability/lifetime resolution only; not occurrence or schedule geometry generation. */
export function resolveSleepOccurrenceReference(
  reference: SleepOccurrenceReferenceV1,
  revisions: unknown,
) {
  const result = queryEffectiveSleepRequirement(revisions, reference.coordinate.userDayDate);
  if (result.status === "invalid")
    return { status: "invalidReference" as const, issues: [result.reason] };
  if (
    !Array.isArray(revisions) ||
    !revisions.length ||
    revisions[0].id !== reference.requirement.id
  )
    return { status: "sourceMissing" as const, component: "sleepRequirement" as const };
  if (revisions[0].incarnationId !== reference.requirement.incarnationId)
    return { status: "lifetimeMismatch" as const, component: "sleepRequirement" as const };
  if (result.status !== "effective") return { status: "occurrenceMissing" as const };
  return {
    status: "resolved" as const,
    reference: structuredClone(reference),
    occurrenceIdentity: {
      version: 1 as const,
      sourceKind: "sleepRequirement" as const,
      requirementId: reference.requirement.id,
      scopeKind: "userDay" as const,
      userDayDate: reference.coordinate.userDayDate,
      slot: 0 as const,
    },
  };
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function keys(value: Record<string, unknown>, fields: string[]) {
  return (
    Object.keys(value).length === fields.length &&
    fields.every((field) => Object.hasOwn(value, field))
  );
}
