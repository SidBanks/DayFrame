import { isSourceIncarnationId, type SourceIncarnationId } from "../authored/sourceIncarnation.js";
import type { LocalDateString } from "../shifts/types.js";
import type { TimeString, Weekday } from "../time/types.js";

export type SleepClockWindowV1 = {
  startClock: TimeString;
  endClock: TimeString;
  preferredStartClock?: TimeString;
};
export type SleepWindowIntentV1 =
  | (SleepClockWindowV1 & { kind: "clock" })
  | { kind: "beforeWork" | "afterWork"; spanMinutes: number; offDay: SleepClockWindowV1 };
export type SleepRequirementV1 = {
  version: 1;
  id: string;
  incarnationId: SourceIncarnationId;
  revision: number;
  enabled: boolean;
  effectiveFrom: LocalDateString;
  effectiveUntilExclusive?: LocalDateString;
  weekdays: "all" | Weekday[];
  durationMinutes: number;
  window: SleepWindowIntentV1;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  createdAt: string;
  updatedAt: string;
};
/** Portable dated intent, including revisions, but never a live source lifetime. */
export type SleepRequirementPatternV1 = Omit<SleepRequirementV1, "incarnationId">;
export type SleepRequirementIntentV1 = Omit<
  SleepRequirementPatternV1,
  "version" | "id" | "revision" | "createdAt" | "updatedAt"
>;
const weekdays: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const clock = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const timestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
export function isSleepOwnerDate(value: unknown): value is LocalDateString {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function exact(value: Record<string, unknown>, required: string[], optional: string[] = []) {
  return (
    required.every((key) => Object.hasOwn(value, key)) &&
    Object.keys(value).every((key) => required.includes(key) || optional.includes(key))
  );
}
function integer(value: unknown, min: number, max: number): value is number {
  return Number.isSafeInteger(value) && (value as number) >= min && (value as number) <= max;
}
function validClockWindow(value: unknown, tagged = false): boolean {
  return (
    record(value) &&
    exact(
      value,
      ["startClock", "endClock", ...(tagged ? ["kind"] : [])],
      ["preferredStartClock"],
    ) &&
    typeof value.startClock === "string" &&
    clock.test(value.startClock) &&
    typeof value.endClock === "string" &&
    clock.test(value.endClock) &&
    (value.preferredStartClock === undefined ||
      (typeof value.preferredStartClock === "string" && clock.test(value.preferredStartClock)))
  );
}
function validTimestamp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    timestamp.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().replace(".000Z", "Z") === value.replace(".000Z", "Z")
  );
}
export function validateSleepRequirement(value: unknown): SleepRequirementV1 {
  return validateRevision(value, false) as SleepRequirementV1;
}
export function validateSleepRequirementPattern(value: unknown): SleepRequirementPatternV1 {
  return validateRevision(value, true);
}
function validateRevision(value: unknown, portable: boolean): SleepRequirementPatternV1 {
  const required = [
    "version",
    "id",
    "revision",
    "enabled",
    "effectiveFrom",
    "weekdays",
    "durationMinutes",
    "window",
    "bufferBeforeMinutes",
    "bufferAfterMinutes",
    "createdAt",
    "updatedAt",
    ...(portable ? [] : ["incarnationId"]),
  ];
  if (
    !record(value) ||
    !exact(value, required, ["effectiveUntilExclusive"]) ||
    value.version !== 1 ||
    typeof value.id !== "string" ||
    value.id.trim() === "" ||
    (!portable && !isSourceIncarnationId(value.incarnationId)) ||
    !integer(value.revision, 1, Number.MAX_SAFE_INTEGER) ||
    typeof value.enabled !== "boolean" ||
    !isSleepOwnerDate(value.effectiveFrom) ||
    (value.effectiveUntilExclusive !== undefined &&
      (!isSleepOwnerDate(value.effectiveUntilExclusive) ||
        value.effectiveUntilExclusive <= value.effectiveFrom)) ||
    !(
      value.weekdays === "all" ||
      (Array.isArray(value.weekdays) &&
        value.weekdays.length > 0 &&
        new Set(value.weekdays).size === value.weekdays.length &&
        value.weekdays.every((day) => weekdays.includes(day)))
    ) ||
    !integer(value.durationMinutes, 1, 1440) ||
    !integer(value.bufferBeforeMinutes, 0, 1440) ||
    !integer(value.bufferAfterMinutes, 0, 1440) ||
    !validTimestamp(value.createdAt) ||
    !validTimestamp(value.updatedAt) ||
    Date.parse(value.updatedAt) < Date.parse(value.createdAt) ||
    !record(value.window)
  ) {
    throw new RangeError("Invalid or unsupported Sleep requirement revision.");
  }
  const window = value.window;
  if (window.kind === "clock") {
    if (!validClockWindow(window, true)) throw new RangeError("Invalid Sleep clock window.");
  } else if (window.kind === "beforeWork" || window.kind === "afterWork") {
    if (
      !exact(window, ["kind", "spanMinutes", "offDay"]) ||
      !integer(window.spanMinutes, 1, 4320) ||
      !validClockWindow(window.offDay) ||
      value.durationMinutes + value.bufferBeforeMinutes + value.bufferAfterMinutes >
        window.spanMinutes
    ) {
      throw new RangeError("Invalid Sleep Work-relative window or footprint.");
    }
  } else throw new RangeError("Unsupported Sleep window intent.");
  return structuredClone(value) as SleepRequirementPatternV1;
}
/** One primary lifetime, with append-preserved revision records. Order is not authority. */
export function validateSleepRequirements(value: unknown): SleepRequirementV1[] {
  return validateCollection(value, false) as SleepRequirementV1[];
}
export function validateSleepRequirementPatterns(value: unknown): SleepRequirementPatternV1[] {
  return validateCollection(value, true);
}
function validateCollection(value: unknown, portable: boolean): SleepRequirementPatternV1[] {
  if (!Array.isArray(value)) throw new RangeError("Sleep revisions must be an array.");
  const revisions = value
    .map((entry) => validateRevision(entry, portable))
    .sort((a, b) => a.revision - b.revision);
  const head = revisions[0];
  for (const [index, revision] of revisions.entries()) {
    const previous = revisions[index - 1];
    if (
      revision.id !== head?.id ||
      (!portable &&
        (revision as SleepRequirementV1).incarnationId !==
          (head as SleepRequirementV1).incarnationId) ||
      (previous &&
        (revision.revision <= previous.revision ||
          revision.effectiveFrom < previous.effectiveFrom ||
          revision.createdAt !== previous.createdAt ||
          Date.parse(revision.updatedAt) < Date.parse(previous.updatedAt)))
    ) {
      throw new RangeError("Sleep requires one source lifetime and ordered, unique revisions.");
    }
  }
  return revisions;
}
export type EffectiveSleepRequirementResult =
  | { status: "notConfigured" }
  | { status: "notApplicable" }
  | { status: "disabled" | "effective"; requirement: SleepRequirementV1 }
  | { status: "invalid"; reason: string };
/** Authored applicability only: no Preview, physical geometry, Capacity or Work dependency. */
export function queryEffectiveSleepRequirement(
  revisions: unknown,
  ownerDay: LocalDateString,
): EffectiveSleepRequirementResult {
  try {
    if (!isSleepOwnerDate(ownerDay)) throw new RangeError("Invalid Sleep owner day.");
    const valid = validateSleepRequirements(revisions);
    if (!valid.length) return { status: "notConfigured" };
    const selected = valid.filter((entry) => entry.effectiveFrom <= ownerDay).at(-1);
    if (
      !selected ||
      (selected.effectiveUntilExclusive && ownerDay >= selected.effectiveUntilExclusive)
    )
      return { status: "notApplicable" };
    if (!selected.enabled) return { status: "disabled", requirement: selected };
    const day = weekdays[new Date(`${ownerDay}T12:00:00Z`).getUTCDay()]!;
    if (selected.weekdays !== "all" && !selected.weekdays.includes(day))
      return { status: "notApplicable" };
    return { status: "effective", requirement: selected };
  } catch (error) {
    return {
      status: "invalid",
      reason: error instanceof Error ? error.message : "Invalid Sleep authority.",
    };
  }
}
