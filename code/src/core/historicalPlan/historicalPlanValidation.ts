import type { BlockCategory } from "../blocks/types.js";
import { isGoalId } from "../goals/goal.js";
import { validateDurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import {
  HISTORICAL_PLAN_DAY_PUBLICATION_VERSION,
  HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION,
  HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_V2_VERSION,
  HISTORICAL_PLAN_SURFACE_VERSION,
  HISTORICAL_PLAN_TITLE_MAX_LENGTH,
  PLAN_PUBLICATION_BATCH_VERSION,
  clonePlanPublicationBatch,
  isPlanPublicationBatchId,
  type PlanPublicationBatchV1,
} from "./historicalPlan.js";
import {
  areHistoricalPlanDaysSemanticallyEqual,
  durableReferenceKey,
} from "./historicalPlanFingerprint.js";

export type HistoricalPlanValidationIssueCode =
  | "unsupportedVersion"
  | "invalidBatchId"
  | "invalidPublishedAt"
  | "invalidRange"
  | "missingDay"
  | "extraDay"
  | "duplicateDay"
  | "invalidDayContext"
  | "invalidOccurrence"
  | "duplicateOccurrenceReference"
  | "crossDayDuplicateReference"
  | "sourceFamilyMismatch"
  | "invalidScheduledInterval"
  | "invalidPlanStateShape"
  | "ambiguousPublishedAtTie"
  | "duplicateBatchId";
export type HistoricalPlanValidationIssue = {
  code: HistoricalPlanValidationIssueCode;
  path?: string;
  detail?: string;
};
export type PlanPublicationBatchValidation =
  | { status: "valid"; batch: PlanPublicationBatchV1 }
  | { status: "invalid"; issues: HistoricalPlanValidationIssue[] };
export type HistoricalPlanCollectionValidation =
  | { status: "valid"; batches: PlanPublicationBatchV1[] }
  | { status: "invalid"; issues: HistoricalPlanValidationIssue[] };

const UTC_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const CATEGORIES: readonly BlockCategory[] = [
  "work",
  "sleep",
  "fitness",
  "meal",
  "maintenance",
  "family",
  "health",
  "review",
  "admin",
  "recovery",
  "optional",
];

export function validatePlanPublicationBatch(value: unknown): PlanPublicationBatchValidation {
  const issues: HistoricalPlanValidationIssue[] = [];
  if (!record(value)) return invalid("invalidRange", "batch", "batch must be an object");
  exact(
    value,
    ["surfaceVersion", "version", "id", "publishedAt", "range", "days"],
    "batch",
    issues,
  );
  if (
    value.surfaceVersion !== HISTORICAL_PLAN_SURFACE_VERSION ||
    value.version !== PLAN_PUBLICATION_BATCH_VERSION
  )
    push(issues, "unsupportedVersion", "batch.version");
  if (!isPlanPublicationBatchId(value.id)) push(issues, "invalidBatchId", "batch.id");
  if (!isCanonicalUtc(value.publishedAt)) push(issues, "invalidPublishedAt", "batch.publishedAt");
  if (!record(value.range)) push(issues, "invalidRange", "batch.range");
  else exact(value.range, ["startUserDayDate", "endUserDayDate"], "batch.range", issues);
  const start = record(value.range) ? value.range.startUserDayDate : undefined;
  const end = record(value.range) ? value.range.endUserDayDate : undefined;
  if (
    !isLocalDate(start) ||
    !isLocalDate(end) ||
    (typeof start === "string" && typeof end === "string" && start > end)
  )
    push(issues, "invalidRange", "batch.range");
  if (!Array.isArray(value.days)) push(issues, "missingDay", "batch.days");
  else {
    const seenDays = new Set<string>();
    const refs = new Map<string, string>();
    for (let index = 0; index < value.days.length; index += 1) {
      const dayIssues = validateDay(value.days[index], `batch.days[${index}]`);
      issues.push(...dayIssues);
      if (!record(value.days[index]) || typeof value.days[index].userDayDate !== "string") continue;
      const date = value.days[index].userDayDate as string;
      if (seenDays.has(date)) push(issues, "duplicateDay", `batch.days[${index}]`);
      else seenDays.add(date);
      if (isLocalDate(start) && isLocalDate(end) && (date < start || date > end))
        push(issues, "extraDay", `batch.days[${index}]`);
      if (Array.isArray(value.days[index].occurrences))
        for (const occurrence of value.days[index].occurrences) {
          if (!record(occurrence)) continue;
          const checked = validateDurableOccurrenceReference(occurrence.reference);
          if (checked.status !== "valid") continue;
          const key = durableReferenceKey(checked.reference);
          const prior = refs.get(key);
          if (prior && prior !== date)
            push(issues, "crossDayDuplicateReference", `batch.days[${index}].occurrences`);
          else refs.set(key, date);
        }
    }
    if (isLocalDate(start) && isLocalDate(end))
      for (const date of enumerateDates(start, end))
        if (!seenDays.has(date)) push(issues, "missingDay", "batch.days", date);
  }
  if (issues.length) return { status: "invalid", issues };
  const batch = clonePlanPublicationBatch(value as PlanPublicationBatchV1);
  batch.days.sort((a, b) => a.userDayDate.localeCompare(b.userDayDate));
  for (const day of batch.days) {
    day.occurrences.sort((a, b) =>
      durableReferenceKey(a.reference).localeCompare(durableReferenceKey(b.reference)),
    );
    for (const occurrence of day.occurrences)
      occurrence.goals?.sort((a, b) => a.goalId.localeCompare(b.goalId));
  }
  return { status: "valid", batch };
}

export function validateHistoricalPlanCollection(
  value: readonly unknown[],
): HistoricalPlanCollectionValidation {
  const issues: HistoricalPlanValidationIssue[] = [];
  const batches: PlanPublicationBatchV1[] = [];
  const ids = new Set<string>();
  for (let index = 0; index < value.length; index += 1) {
    const checked = validatePlanPublicationBatch(value[index]);
    if (checked.status === "invalid") {
      issues.push(
        ...checked.issues.map((issue) => ({
          ...issue,
          path: `batches[${index}].${issue.path ?? ""}`,
        })),
      );
      continue;
    }
    if (ids.has(checked.batch.id)) push(issues, "duplicateBatchId", `batches[${index}].id`);
    else ids.add(checked.batch.id);
    batches.push(checked.batch);
  }
  for (let left = 0; left < batches.length; left += 1)
    for (let right = left + 1; right < batches.length; right += 1) {
      const leftBatch = batches[left]!;
      const rightBatch = batches[right]!;
      if (leftBatch.publishedAt !== rightBatch.publishedAt) continue;
      for (const day of leftBatch.days)
        if (
          rightBatch.days.some(
            (other) =>
              other.userDayDate === day.userDayDate &&
              !areHistoricalPlanDaysSemanticallyEqual(other, day),
          )
        ) {
          push(issues, "ambiguousPublishedAtTie", `batches[${right}]`, day.userDayDate);
        }
    }
  return issues.length ? { status: "invalid", issues } : { status: "valid", batches };
}

function validateDay(value: unknown, path: string): HistoricalPlanValidationIssue[] {
  const issues: HistoricalPlanValidationIssue[] = [];
  if (!record(value)) return [{ code: "invalidDayContext", path }];
  exact(
    value,
    [
      "version",
      "userDayDate",
      "dayBoundaryStartTime",
      "weekStartsOn",
      "utcOffsetMinutes",
      "occurrences",
    ],
    path,
    issues,
  );
  if (value.version !== HISTORICAL_PLAN_DAY_PUBLICATION_VERSION)
    push(issues, "unsupportedVersion", `${path}.version`);
  if (
    !isLocalDate(value.userDayDate) ||
    typeof value.dayBoundaryStartTime !== "string" ||
    !TIME.test(value.dayBoundaryStartTime) ||
    !WEEKDAYS.includes(value.weekStartsOn as string) ||
    !Number.isInteger(value.utcOffsetMinutes) ||
    (value.utcOffsetMinutes as number) < -840 ||
    (value.utcOffsetMinutes as number) > 840
  )
    push(issues, "invalidDayContext", path);
  if (!Array.isArray(value.occurrences)) {
    push(issues, "invalidOccurrence", `${path}.occurrences`);
    return issues;
  }
  const references = new Set<string>();
  value.occurrences.forEach((snapshot, index) => {
    const snapshotPath = `${path}.occurrences[${index}]`;
    validateSnapshot(snapshot, snapshotPath, value.userDayDate, issues);
    if (!record(snapshot)) return;
    const checked = validateDurableOccurrenceReference(snapshot.reference);
    if (checked.status !== "valid") return;
    const key = durableReferenceKey(checked.reference);
    if (references.has(key)) push(issues, "duplicateOccurrenceReference", snapshotPath);
    else references.add(key);
  });
  return issues;
}

function validateSnapshot(
  value: unknown,
  path: string,
  day: unknown,
  issues: HistoricalPlanValidationIssue[],
): void {
  if (!record(value)) {
    push(issues, "invalidOccurrence", path);
    return;
  }
  const isV1 = value.version === HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_VERSION;
  const isV2 = value.version === HISTORICAL_PLANNED_OCCURRENCE_SNAPSHOT_V2_VERSION;
  exact(
    value,
    [
      "version",
      "reference",
      "sourceFamily",
      "title",
      "category",
      "plan",
      ...(isV2 ? ["timing"] : []),
      ...(value.goals === undefined ? [] : ["goals"]),
    ],
    path,
    issues,
  );
  if (!isV1 && !isV2) push(issues, "unsupportedVersion", `${path}.version`);
  if (isV2) {
    if (!record(value.timing)) push(issues, "invalidOccurrence", `${path}.timing`);
    else {
      exact(value.timing, ["kind"], `${path}.timing`, issues);
      if (value.timing.kind !== "allDay" && value.timing.kind !== "timed")
        push(issues, "invalidOccurrence", `${path}.timing.kind`);
    }
  }
  const reference = validateDurableOccurrenceReference(value.reference);
  if (reference.status !== "valid") push(issues, "invalidOccurrence", `${path}.reference`);
  else {
    if (reference.reference.sourceKind !== value.sourceFamily)
      push(issues, "sourceFamilyMismatch", path);
    if (!referenceBelongsToDay(reference.reference, day))
      push(
        issues,
        "invalidOccurrence",
        `${path}.reference`,
        "reference does not belong to user day",
      );
  }
  if (
    typeof value.title !== "string" ||
    value.title.trim().length === 0 ||
    value.title.length > HISTORICAL_PLAN_TITLE_MAX_LENGTH ||
    !CATEGORIES.includes(value.category as BlockCategory)
  )
    push(issues, "invalidOccurrence", path);
  if (value.goals !== undefined) {
    if (!Array.isArray(value.goals)) push(issues, "invalidOccurrence", `${path}.goals`);
    else {
      const ids = new Set<string>();
      for (const goal of value.goals) {
        const allowed = [
          "version",
          "goalId",
          "goalRevision",
          "title",
          "status",
          "measurementPolicy",
        ];
        const invalidPolicy =
          record(goal) &&
          goal.measurementPolicy !== undefined &&
          (!record(goal.measurementPolicy) ||
            Object.keys(goal.measurementPolicy).sort().join() !== "id,version" ||
            typeof goal.measurementPolicy.id !== "string" ||
            !Number.isSafeInteger(goal.measurementPolicy.version) ||
            Number(goal.measurementPolicy.version) < 1);
        if (
          !record(goal) ||
          Object.keys(goal).some((key) => !allowed.includes(key)) ||
          goal.version !== 1 ||
          !isGoalId(goal.goalId) ||
          !Number.isSafeInteger(goal.goalRevision) ||
          Number(goal.goalRevision) < 1 ||
          typeof goal.title !== "string" ||
          !goal.title.trim() ||
          !["active", "completed", "archived"].includes(String(goal.status)) ||
          invalidPolicy ||
          ids.has(String(goal.goalId))
        )
          push(issues, "invalidOccurrence", `${path}.goals`);
        if (record(goal)) ids.add(String(goal.goalId));
      }
    }
  }
  if (!record(value.plan)) {
    push(issues, "invalidPlanStateShape", `${path}.plan`);
    return;
  }
  if (value.plan.state === "scheduled") {
    exact(value.plan, ["state", "startsAt", "endsAt"], `${path}.plan`, issues);
    if (
      !isCanonicalUtc(value.plan.startsAt) ||
      !isCanonicalUtc(value.plan.endsAt) ||
      Date.parse(value.plan.endsAt as string) <= Date.parse(value.plan.startsAt as string)
    )
      push(issues, "invalidScheduledInterval", `${path}.plan`);
  } else if (["unplaced", "omitted", "blocked"].includes(value.plan.state as string))
    exact(value.plan, ["state"], `${path}.plan`, issues);
  else push(issues, "invalidPlanStateShape", `${path}.plan`);
}

function referenceBelongsToDay(
  reference: import("../occurrences/durableOccurrenceReference.js").DurableOccurrenceReference,
  day: unknown,
): boolean {
  if (typeof day !== "string") return false;
  if (reference.sourceKind === "work") return reference.coordinate.localStartDate === day;
  if (reference.sourceKind === "template" && reference.coordinate.scopeKind === "userDay")
    return reference.coordinate.userDayDate === day;
  return true; // weekly template slots and manual events carry no exact day coordinate in V1.
}
function isCanonicalUtc(value: unknown): value is string {
  if (typeof value !== "string" || !UTC_ISO.test(value)) return false;
  const parsed = new Date(value);
  return (
    !Number.isNaN(parsed.getTime()) &&
    (value === parsed.toISOString() ||
      (!value.includes(".") && `${value.slice(0, -1)}.000Z` === parsed.toISOString()))
  );
}
function isLocalDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
function enumerateDates(start: string, end: string): string[] {
  const dates: string[] = [];
  for (
    let time = Date.parse(`${start}T00:00:00Z`);
    time <= Date.parse(`${end}T00:00:00Z`);
    time += 86_400_000
  )
    dates.push(new Date(time).toISOString().slice(0, 10));
  return dates;
}
function exact(
  value: Record<string, unknown>,
  keys: string[],
  path: string,
  issues: HistoricalPlanValidationIssue[],
): void {
  const expected = new Set(keys);
  for (const key of Object.keys(value))
    if (!expected.has(key))
      push(issues, "invalidOccurrence", `${path}.${key}`, "key is not allowed");
  for (const key of keys)
    if (!(key in value)) push(issues, "invalidOccurrence", `${path}.${key}`, "key is required");
}
function push(
  issues: HistoricalPlanValidationIssue[],
  code: HistoricalPlanValidationIssueCode,
  path?: string,
  detail?: string,
): void {
  issues.push({ code, ...(path ? { path } : {}), ...(detail ? { detail } : {}) });
}
function invalid(
  code: HistoricalPlanValidationIssueCode,
  path?: string,
  detail?: string,
): PlanPublicationBatchValidation {
  return {
    status: "invalid",
    issues: [{ code, ...(path ? { path } : {}), ...(detail ? { detail } : {}) }],
  };
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
