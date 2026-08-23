import type { BlockCategory } from "../blocks/types.js";
import {
  cloneDurableOccurrenceReference,
  durableOccurrenceReferencesEqual,
  validateDurableOccurrenceReference,
  type DurableOccurrenceReference,
} from "../occurrences/durableOccurrenceReference.js";
import type { LocalDateString } from "../shifts/types.js";
import type { TimeString } from "../time/types.js";

export const EXECUTION_RECORD_VERSION = 1 as const;
export const EXECUTION_SNAPSHOT_TITLE_MAX_LENGTH = 200;
export const EXECUTION_NOTE_MAX_LENGTH = 2000;
export const EXECUTION_ACTUAL_DURATION_MAX_MINUTES = 1440;

export type ExecutionRecordId = string & { readonly __executionRecordId: unique symbol };
export type ExecutionSubjectId = string & { readonly __executionSubjectId: unique symbol };
export type ExecutionRecordIdAllocator = () => ExecutionRecordId;
export type ExecutionSubjectIdAllocator = () => ExecutionSubjectId;

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const UTC_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const LOCAL_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

const BLOCK_CATEGORIES: readonly BlockCategory[] = [
  "work", "sleep", "fitness", "meal", "maintenance", "family", "health", "review",
  "admin", "recovery", "optional",
];

export function isExecutionRecordId(value: unknown): value is ExecutionRecordId {
  return typeof value === "string" && UUID_V4.test(value);
}

export function isExecutionSubjectId(value: unknown): value is ExecutionSubjectId {
  return typeof value === "string" && UUID_V4.test(value);
}

export function createExecutionRecordId(): ExecutionRecordId {
  return allocateUuid("ExecutionRecordId") as ExecutionRecordId;
}

export function createExecutionSubjectId(): ExecutionSubjectId {
  return allocateUuid("ExecutionSubjectId") as ExecutionSubjectId;
}

function allocateUuid(name: string): string {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (!randomUUID) throw new Error(`Cryptographic UUID generation is unavailable for ${name}.`);
  const value = randomUUID.call(globalThis.crypto);
  if (!UUID_V4.test(value)) throw new Error(`Cryptographic UUID generation returned an invalid ${name}.`);
  return value;
}

export type ExecutionSubject =
  | { kind: "planned"; reference: DurableOccurrenceReference }
  | { kind: "unplanned" };

export type ExecutionSnapshotFamily = "template" | "work" | "manualEvent" | "unplanned";
export type ExecutionPlanContext =
  | { state: "scheduled"; startsAt: string; endsAt: string }
  | { state: "unplaced" | "omitted" | "blocked" | "unplanned" };

export type ExecutionHistoricalSnapshot = {
  sourceFamily: ExecutionSnapshotFamily;
  title: string;
  category: BlockCategory;
  userDay: {
    date: LocalDateString;
    dayBoundaryStartTime: TimeString;
    utcOffsetMinutes: number;
  };
  plan: ExecutionPlanContext;
};

/** User-asserted evidence only. Neither field is populated from scheduled time. */
export type ExecutionActualTimeEvidence = {
  occurredAt?: string;
  durationMinutes?: number;
};

export type ExecutionReportedOutcome = "completed" | "partial" | "skipped";
export type ExecutionProvenanceV1 = { kind: "userReported" };

type ExecutionRecordBase<K extends string> = {
  version: typeof EXECUTION_RECORD_VERSION;
  id: ExecutionRecordId;
  subjectId: ExecutionSubjectId;
  kind: K;
  provenance: ExecutionProvenanceV1;
  recordedAt: string;
  note?: string;
  replacesRecordId?: ExecutionRecordId;
};

export type ExecutionAssertionRecordV1 = ExecutionRecordBase<"assertion"> & {
  subject: ExecutionSubject;
  snapshot: ExecutionHistoricalSnapshot;
  outcome: ExecutionReportedOutcome;
  actualTime?: ExecutionActualTimeEvidence;
};

export type ExecutionRetractionRecordV1 = ExecutionRecordBase<"retraction"> & {
  replacesRecordId: ExecutionRecordId;
};

export type ExecutionRecordV1 = ExecutionAssertionRecordV1 | ExecutionRetractionRecordV1;

export type OccurrenceOutcome =
  | { status: ExecutionReportedOutcome; record: ExecutionAssertionRecordV1 }
  | { status: "unknown" };

export type ExecutionRecordValidation =
  | { status: "valid"; record: ExecutionRecordV1 }
  | { status: "invalid"; issues: string[] }
  | { status: "unsupportedVersion"; version: unknown };

export type ExecutionHistoricalSnapshotValidation =
  | { status: "valid"; snapshot: ExecutionHistoricalSnapshot }
  | { status: "invalid"; issues: string[] };

export function validateExecutionHistoricalSnapshot(value: unknown): ExecutionHistoricalSnapshotValidation {
  const issues: string[] = [];
  validateSnapshot(value, issues);
  return issues.length > 0
    ? { status: "invalid", issues }
    : { status: "valid", snapshot: cloneSnapshot(value as ExecutionHistoricalSnapshot) };
}

export type ExecutionCollectionIssueCode =
  | "invalidRecord"
  | "unsupportedVersion"
  | "duplicateRecordId"
  | "missingReplacement"
  | "crossSubjectReplacement"
  | "cycle"
  | "competingReplacement"
  | "competingHead"
  | "nonMonotonicRecordedAt"
  | "subjectMismatch"
  | "duplicatePlannedReference";

export type ExecutionCollectionIssue = {
  code: ExecutionCollectionIssueCode;
  recordIndex?: number;
  recordId?: string;
  subjectId?: string;
  detail?: string;
};

export type ExecutionCollectionValidation =
  | { status: "valid"; records: ExecutionRecordV1[] }
  | { status: "invalid"; issues: ExecutionCollectionIssue[] };

export type ExecutionConstructionProviders = {
  allocateRecordId?: ExecutionRecordIdAllocator;
  allocateSubjectId?: ExecutionSubjectIdAllocator;
  now?: () => string;
};

export type CreateExecutionAssertionInput = {
  subject: ExecutionSubject;
  snapshot: ExecutionHistoricalSnapshot;
  outcome: ExecutionReportedOutcome;
  actualTime?: ExecutionActualTimeEvidence;
  note?: string;
};

export type CorrectExecutionAssertionInput = Omit<CreateExecutionAssertionInput, "subject"> & {
  subject?: ExecutionSubject;
};

export type ExecutionConstructionResult =
  | { status: "created"; record: ExecutionRecordV1 }
  | { status: "invalidInput"; issues: string[] }
  | { status: "invalidReplacement"; issues: ExecutionCollectionIssue[] }
  | { status: "notCurrentHead" }
  | { status: "allocationFailure"; reason: string };

export function createExecutionAssertion(
  input: CreateExecutionAssertionInput,
  providers: ExecutionConstructionProviders = {},
): ExecutionConstructionResult {
  try {
    const record: ExecutionAssertionRecordV1 = {
      version: EXECUTION_RECORD_VERSION,
      id: (providers.allocateRecordId ?? createExecutionRecordId)(),
      subjectId: (providers.allocateSubjectId ?? createExecutionSubjectId)(),
      kind: "assertion",
      subject: cloneSubject(input.subject),
      snapshot: cloneSnapshot(input.snapshot),
      outcome: input.outcome,
      provenance: { kind: "userReported" },
      recordedAt: (providers.now ?? canonicalNow)(),
      ...(input.actualTime ? { actualTime: { ...input.actualTime } } : {}),
      ...(input.note !== undefined ? { note: input.note } : {}),
    };
    return validatedConstruction(record);
  } catch (error) {
    return { status: "allocationFailure", reason: error instanceof Error ? error.message : "allocation failed" };
  }
}

export function correctExecutionAssertion(
  records: readonly ExecutionRecordV1[],
  replacesRecordId: ExecutionRecordId,
  input: CorrectExecutionAssertionInput,
  providers: ExecutionConstructionProviders = {},
): ExecutionConstructionResult {
  const context = replacementContext(records, replacesRecordId);
  if (context.status !== "ready") return context;
  const subject = input.subject ?? context.subject;
  try {
    const record: ExecutionAssertionRecordV1 = {
      version: EXECUTION_RECORD_VERSION,
      id: (providers.allocateRecordId ?? createExecutionRecordId)(),
      subjectId: context.head.subjectId,
      kind: "assertion",
      subject: cloneSubject(subject),
      snapshot: cloneSnapshot(input.snapshot),
      outcome: input.outcome,
      provenance: { kind: "userReported" },
      recordedAt: (providers.now ?? canonicalNow)(),
      replacesRecordId,
      ...(input.actualTime ? { actualTime: { ...input.actualTime } } : {}),
      ...(input.note !== undefined ? { note: input.note } : {}),
    };
    return validatedReplacement(records, record, context.subject);
  } catch (error) {
    return { status: "allocationFailure", reason: error instanceof Error ? error.message : "allocation failed" };
  }
}

export function retractExecutionRecord(
  records: readonly ExecutionRecordV1[],
  replacesRecordId: ExecutionRecordId,
  note?: string,
  providers: ExecutionConstructionProviders = {},
): ExecutionConstructionResult {
  const context = replacementContext(records, replacesRecordId);
  if (context.status !== "ready") return context;
  try {
    const record: ExecutionRetractionRecordV1 = {
      version: EXECUTION_RECORD_VERSION,
      id: (providers.allocateRecordId ?? createExecutionRecordId)(),
      subjectId: context.head.subjectId,
      kind: "retraction",
      provenance: { kind: "userReported" },
      recordedAt: (providers.now ?? canonicalNow)(),
      replacesRecordId,
      ...(note !== undefined ? { note } : {}),
    };
    return validatedReplacement(records, record, context.subject);
  } catch (error) {
    return { status: "allocationFailure", reason: error instanceof Error ? error.message : "allocation failed" };
  }
}

export function validateExecutionRecord(value: unknown): ExecutionRecordValidation {
  if (!record(value)) return { status: "invalid", issues: ["record must be an object"] };
  if (value.version !== EXECUTION_RECORD_VERSION) {
    return typeof value.version === "number"
      ? { status: "unsupportedVersion", version: value.version }
      : { status: "invalid", issues: ["version must be 1"] };
  }
  const issues: string[] = [];
  if (value.kind === "assertion") validateAssertion(value, issues);
  else if (value.kind === "retraction") validateRetraction(value, issues);
  else issues.push("kind is unsupported");
  return issues.length > 0
    ? { status: "invalid", issues }
    : { status: "valid", record: cloneExecutionRecord(value as ExecutionRecordV1) };
}

export function validateExecutionRecordCollection(values: readonly unknown[]): ExecutionCollectionValidation {
  const issues: ExecutionCollectionIssue[] = [];
  const records: ExecutionRecordV1[] = [];
  values.forEach((value, recordIndex) => {
    const result = validateExecutionRecord(value);
    if (result.status === "valid") records.push(result.record);
    else issues.push({ code: result.status === "unsupportedVersion" ? "unsupportedVersion" : "invalidRecord",
      recordIndex, ...(record(value) && typeof value.id === "string" ? { recordId: value.id } : {}),
      ...(record(value) && typeof value.subjectId === "string" ? { subjectId: value.subjectId } : {}),
      detail: result.status === "invalid" ? result.issues.join("; ") : String(result.version) });
  });
  if (issues.length > 0) return { status: "invalid", issues };
  issues.push(...validateCollectionIntegrity(records));
  return issues.length > 0 ? { status: "invalid", issues } : { status: "valid", records: records.map(cloneExecutionRecord) };
}

export function validateExecutionSubjectComponent(
  values: readonly unknown[],
  subjectId: ExecutionSubjectId,
): ExecutionCollectionValidation {
  const selected = values.filter((value) => record(value) && value.subjectId === subjectId);
  return validateExecutionRecordCollection(selected);
}

export type CurrentExecutionRecordProjection =
  | { status: "current"; record: ExecutionAssertionRecordV1 }
  | { status: "none" }
  | { status: "invalid"; issues: ExecutionCollectionIssue[] };

export function projectCurrentExecutionRecord(
  values: readonly unknown[],
  subjectId: ExecutionSubjectId,
): CurrentExecutionRecordProjection {
  const selected = values.filter((value) => record(value) && value.subjectId === subjectId);
  if (selected.length === 0) return { status: "none" };
  const validation = validateExecutionRecordCollection(selected);
  if (validation.status === "invalid") return validation;
  const replaced = new Set(validation.records.flatMap((current) =>
    current.replacesRecordId ? [current.replacesRecordId] : []));
  const head = validation.records.find((current) => !replaced.has(current.id));
  if (!head || head.kind === "retraction") return { status: "none" };
  return { status: "current", record: cloneExecutionRecord(head) as ExecutionAssertionRecordV1 };
}

export function projectOccurrenceOutcome(
  values: readonly unknown[],
  subjectId: ExecutionSubjectId,
): OccurrenceOutcome | { status: "invalid"; issues: ExecutionCollectionIssue[] } {
  const projection = projectCurrentExecutionRecord(values, subjectId);
  if (projection.status === "invalid") return projection;
  if (projection.status === "none") return { status: "unknown" };
  return { status: projection.record.outcome, record: cloneExecutionRecord(projection.record) as ExecutionAssertionRecordV1 };
}

export function cloneExecutionRecord(recordValue: ExecutionRecordV1): ExecutionRecordV1 {
  if (recordValue.kind === "retraction") return { ...recordValue, provenance: { ...recordValue.provenance } };
  return {
    ...recordValue,
    subject: cloneSubject(recordValue.subject),
    snapshot: cloneSnapshot(recordValue.snapshot),
    provenance: { ...recordValue.provenance },
    ...(recordValue.actualTime ? { actualTime: { ...recordValue.actualTime } } : {}),
  };
}

function validateAssertion(value: Record<string, unknown>, issues: string[]): void {
  exact(value, ["version", "id", "subjectId", "kind", "subject", "snapshot", "outcome", "provenance",
    "recordedAt"], ["actualTime", "note", "replacesRecordId"], "record", issues);
  validateBase(value, issues);
  validateSubject(value.subject, issues);
  validateSnapshot(value.snapshot, issues);
  if (!isOutcome(value.outcome)) issues.push("outcome is invalid");
  if (value.outcome === "skipped" && record(value.subject) && value.subject.kind !== "planned") {
    issues.push("skipped requires a planned subject");
  }
  validateActualTime(value.actualTime, value.recordedAt, value.outcome, issues);
  if (record(value.subject) && record(value.snapshot)) validateSubjectSnapshot(value.subject, value.snapshot, issues);
}

function validateRetraction(value: Record<string, unknown>, issues: string[]): void {
  exact(value, ["version", "id", "subjectId", "kind", "provenance", "recordedAt", "replacesRecordId"],
    ["note"], "record", issues);
  validateBase(value, issues);
  if (!isExecutionRecordId(value.replacesRecordId)) issues.push("replacesRecordId must be a canonical UUID v4");
}

function validateBase(value: Record<string, unknown>, issues: string[]): void {
  if (!isExecutionRecordId(value.id)) issues.push("id must be a canonical UUID v4");
  if (!isExecutionSubjectId(value.subjectId)) issues.push("subjectId must be a canonical UUID v4");
  if (!isCanonicalUtc(value.recordedAt)) issues.push("recordedAt must be canonical UTC ISO-8601");
  if (!record(value.provenance) || value.provenance.kind !== "userReported" ||
      Object.keys(value.provenance).length !== 1) issues.push("provenance must be userReported");
  if (value.note !== undefined && (typeof value.note !== "string" || value.note.length > EXECUTION_NOTE_MAX_LENGTH)) {
    issues.push(`note must be at most ${EXECUTION_NOTE_MAX_LENGTH} characters`);
  }
  if (value.replacesRecordId !== undefined && !isExecutionRecordId(value.replacesRecordId)) {
    issues.push("replacesRecordId must be a canonical UUID v4");
  }
}

function validateSubject(value: unknown, issues: string[]): void {
  if (!record(value)) { issues.push("subject must be an object"); return; }
  if (value.kind === "planned") {
    exact(value, ["kind", "reference"], [], "subject", issues);
    const validation = validateDurableOccurrenceReference(value.reference);
    if (validation.status === "unsupportedVersion") issues.push("subject reference version is unsupported");
    else if (validation.status === "invalid") issues.push(...validation.issues.map((issue) => `subject.reference: ${issue}`));
  } else if (value.kind === "unplanned") exact(value, ["kind"], [], "subject", issues);
  else issues.push("subject.kind is invalid");
}

function validateSnapshot(value: unknown, issues: string[]): void {
  if (!record(value)) { issues.push("snapshot must be an object"); return; }
  exact(value, ["sourceFamily", "title", "category", "userDay", "plan"], [], "snapshot", issues);
  if (!["template", "work", "manualEvent", "unplanned"].includes(value.sourceFamily as string)) issues.push("snapshot.sourceFamily is invalid");
  if (typeof value.title !== "string" || value.title.trim().length === 0 || value.title.length > EXECUTION_SNAPSHOT_TITLE_MAX_LENGTH) {
    issues.push(`snapshot.title must be non-empty and at most ${EXECUTION_SNAPSHOT_TITLE_MAX_LENGTH} characters`);
  }
  if (!BLOCK_CATEGORIES.includes(value.category as BlockCategory)) issues.push("snapshot.category is invalid");
  if (!record(value.userDay)) issues.push("snapshot.userDay must be an object");
  else {
    exact(value.userDay, ["date", "dayBoundaryStartTime", "utcOffsetMinutes"], [], "snapshot.userDay", issues);
    if (!isLocalDate(value.userDay.date)) issues.push("snapshot.userDay.date is invalid");
    if (typeof value.userDay.dayBoundaryStartTime !== "string" || !TIME.test(value.userDay.dayBoundaryStartTime)) issues.push("snapshot.userDay.dayBoundaryStartTime is invalid");
    if (!Number.isInteger(value.userDay.utcOffsetMinutes) || (value.userDay.utcOffsetMinutes as number) < -840 ||
        (value.userDay.utcOffsetMinutes as number) > 840) issues.push("snapshot.userDay.utcOffsetMinutes must be -840..840");
  }
  validatePlan(value.plan, issues);
}

function validatePlan(value: unknown, issues: string[]): void {
  if (!record(value)) { issues.push("snapshot.plan must be an object"); return; }
  if (value.state === "scheduled") {
    exact(value, ["state", "startsAt", "endsAt"], [], "snapshot.plan", issues);
    if (!isCanonicalUtc(value.startsAt) || !isCanonicalUtc(value.endsAt)) issues.push("scheduled plan interval must use canonical UTC instants");
    else if (Date.parse(value.endsAt as string) <= Date.parse(value.startsAt as string)) issues.push("scheduled plan end must be after start");
  } else if (["unplaced", "omitted", "blocked", "unplanned"].includes(value.state as string)) {
    exact(value, ["state"], [], "snapshot.plan", issues);
  } else issues.push("snapshot.plan.state is invalid");
}

function validateActualTime(value: unknown, recordedAt: unknown, outcome: unknown, issues: string[]): void {
  if (value === undefined) return;
  if (!record(value)) { issues.push("actualTime must be an object"); return; }
  exact(value, [], ["occurredAt", "durationMinutes"], "actualTime", issues);
  if (Object.keys(value).length === 0) issues.push("actualTime must contain evidence");
  if (outcome === "skipped") issues.push("skipped must not contain actual-time evidence");
  if (value.occurredAt !== undefined) {
    if (!isCanonicalUtc(value.occurredAt)) issues.push("actualTime.occurredAt must be canonical UTC ISO-8601");
    else if (isCanonicalUtc(recordedAt) && Date.parse(value.occurredAt) > Date.parse(recordedAt)) issues.push("actualTime.occurredAt must not be after recordedAt");
  }
  if (value.durationMinutes !== undefined && (!Number.isInteger(value.durationMinutes) ||
      (value.durationMinutes as number) < 1 || (value.durationMinutes as number) > EXECUTION_ACTUAL_DURATION_MAX_MINUTES)) {
    issues.push(`actualTime.durationMinutes must be 1..${EXECUTION_ACTUAL_DURATION_MAX_MINUTES}`);
  }
}

function validateSubjectSnapshot(subject: Record<string, unknown>, snapshot: Record<string, unknown>, issues: string[]): void {
  if (subject.kind === "unplanned") {
    if (snapshot.sourceFamily !== "unplanned" || record(snapshot.plan) && snapshot.plan.state !== "unplanned") issues.push("unplanned subject requires unplanned snapshot and plan state");
    return;
  }
  if (subject.kind === "planned" && record(subject.reference)) {
    if (snapshot.sourceFamily !== subject.reference.sourceKind) issues.push("snapshot source family does not match planned reference");
    if (record(snapshot.plan) && snapshot.plan.state === "unplanned") issues.push("planned subject cannot use unplanned plan state");
  }
}

function validateCollectionIntegrity(records: ExecutionRecordV1[]): ExecutionCollectionIssue[] {
  const issues: ExecutionCollectionIssue[] = [];
  const byId = new Map<string, ExecutionRecordV1>();
  for (const current of records) {
    if (byId.has(current.id)) issues.push(issue("duplicateRecordId", current));
    else byId.set(current.id, current);
  }
  const replacedBy = new Map<string, ExecutionRecordV1[]>();
  for (const current of records) {
    if (!current.replacesRecordId) continue;
    const target = byId.get(current.replacesRecordId);
    if (!target) { issues.push(issue("missingReplacement", current)); continue; }
    if (target.subjectId !== current.subjectId) issues.push(issue("crossSubjectReplacement", current));
    if (Date.parse(current.recordedAt) < Date.parse(target.recordedAt)) issues.push(issue("nonMonotonicRecordedAt", current));
    const replacements = replacedBy.get(target.id) ?? [];
    replacements.push(current);
    replacedBy.set(target.id, replacements);
  }
  for (const replacements of replacedBy.values()) {
    if (replacements.length > 1) for (const current of replacements) issues.push(issue("competingReplacement", current));
  }
  const bySubject = groupBySubject(records);
  const plannedSubjects: { subjectId: string; reference: DurableOccurrenceReference }[] = [];
  for (const [subjectId, subjectRecords] of bySubject) {
    const assertions = subjectRecords.filter((current): current is ExecutionAssertionRecordV1 => current.kind === "assertion");
    const origin = assertions[0]?.subject;
    for (const current of assertions.slice(1)) if (!subjectsEqual(origin!, current.subject)) issues.push(issue("subjectMismatch", current));
    if (origin?.kind === "planned") plannedSubjects.push({ subjectId, reference: origin.reference });
    const heads = subjectRecords.filter((current) => !replacedBy.has(current.id));
    if (heads.length !== 1) issues.push({ code: "competingHead", subjectId });
    if (hasCycle(subjectRecords, byId)) issues.push({ code: "cycle", subjectId });
  }
  for (let left = 0; left < plannedSubjects.length; left += 1) {
    for (let right = left + 1; right < plannedSubjects.length; right += 1) {
      if (durableOccurrenceReferencesEqual(plannedSubjects[left]!.reference, plannedSubjects[right]!.reference)) {
        issues.push({ code: "duplicatePlannedReference", subjectId: plannedSubjects[right]!.subjectId });
      }
    }
  }
  return issues;
}

function hasCycle(subjectRecords: ExecutionRecordV1[], byId: Map<string, ExecutionRecordV1>): boolean {
  for (const start of subjectRecords) {
    const seen = new Set<string>();
    let current: ExecutionRecordV1 | undefined = start;
    while (current?.replacesRecordId) {
      if (seen.has(current.id)) return true;
      seen.add(current.id);
      current = byId.get(current.replacesRecordId);
      if (current && current.subjectId !== start.subjectId) break;
    }
  }
  return false;
}

function replacementContext(records: readonly ExecutionRecordV1[], targetId: ExecutionRecordId):
  | { status: "ready"; head: ExecutionRecordV1; subject: ExecutionSubject }
  | Extract<ExecutionConstructionResult, { status: "invalidReplacement" | "notCurrentHead" }> {
  const validation = validateExecutionRecordCollection(records);
  if (validation.status === "invalid") return { status: "invalidReplacement", issues: validation.issues };
  const target = validation.records.find((current) => current.id === targetId);
  if (!target) return { status: "invalidReplacement", issues: [{ code: "missingReplacement", recordId: targetId }] };
  const projectionHead = findHead(validation.records.filter((current) => current.subjectId === target.subjectId));
  if (!projectionHead || projectionHead.id !== target.id) return { status: "notCurrentHead" };
  const assertion = [...validation.records].reverse().find((current) =>
    current.subjectId === target.subjectId && current.kind === "assertion") as ExecutionAssertionRecordV1 | undefined;
  if (!assertion) return { status: "invalidReplacement", issues: [{ code: "subjectMismatch", subjectId: target.subjectId }] };
  return { status: "ready", head: target, subject: cloneSubject(assertion.subject) };
}

function validatedReplacement(records: readonly ExecutionRecordV1[], recordValue: ExecutionRecordV1,
  expectedSubject: ExecutionSubject): ExecutionConstructionResult {
  if (recordValue.kind === "assertion" && !subjectsEqual(recordValue.subject, expectedSubject)) {
    return { status: "invalidInput", issues: ["correction cannot change subject origin"] };
  }
  const validation = validateExecutionRecord(recordValue);
  if (validation.status !== "valid") return { status: "invalidInput", issues: validation.status === "invalid" ? validation.issues : ["unsupported version"] };
  const collection = validateExecutionRecordCollection([...records, validation.record]);
  return collection.status === "valid" ? { status: "created", record: validation.record }
    : { status: "invalidReplacement", issues: collection.issues };
}

function validatedConstruction(recordValue: ExecutionRecordV1): ExecutionConstructionResult {
  const validation = validateExecutionRecord(recordValue);
  return validation.status === "valid" ? { status: "created", record: validation.record }
    : { status: "invalidInput", issues: validation.status === "invalid" ? validation.issues : ["unsupported version"] };
}

function findHead(records: ExecutionRecordV1[]): ExecutionRecordV1 | undefined {
  const replaced = new Set(records.flatMap((current) => current.replacesRecordId ? [current.replacesRecordId] : []));
  return records.find((current) => !replaced.has(current.id));
}

function subjectsEqual(left: ExecutionSubject, right: ExecutionSubject): boolean {
  return left.kind === "unplanned" && right.kind === "unplanned" ||
    left.kind === "planned" && right.kind === "planned" && durableOccurrenceReferencesEqual(left.reference, right.reference);
}

function cloneSubject(subject: ExecutionSubject): ExecutionSubject {
  return subject.kind === "planned" ? { kind: "planned", reference: cloneDurableOccurrenceReference(subject.reference) } : { kind: "unplanned" };
}

function cloneSnapshot(snapshot: ExecutionHistoricalSnapshot): ExecutionHistoricalSnapshot {
  return { ...snapshot, userDay: { ...snapshot.userDay }, plan: { ...snapshot.plan } };
}

function groupBySubject(records: ExecutionRecordV1[]): Map<string, ExecutionRecordV1[]> {
  const groups = new Map<string, ExecutionRecordV1[]>();
  for (const current of records) groups.set(current.subjectId, [...(groups.get(current.subjectId) ?? []), current]);
  return groups;
}

function issue(code: ExecutionCollectionIssueCode, current: ExecutionRecordV1): ExecutionCollectionIssue {
  return { code, recordId: current.id, subjectId: current.subjectId };
}

function isOutcome(value: unknown): value is ExecutionReportedOutcome {
  return value === "completed" || value === "partial" || value === "skipped";
}

function isCanonicalUtc(value: unknown): value is string {
  if (typeof value !== "string" || !UTC_ISO.test(value)) return false;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;
  return value === parsed.toISOString() || (!value.includes(".") && `${value.slice(0, -1)}.000Z` === parsed.toISOString());
}

function isLocalDate(value: unknown): value is LocalDateString {
  if (typeof value !== "string" || !LOCAL_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function exact(value: Record<string, unknown>, required: string[], optional: string[], path: string, issues: string[]): void {
  const allowed = new Set([...required, ...optional]);
  for (const key of Object.keys(value)) if (!allowed.has(key)) issues.push(`${path}.${key} is not allowed`);
  for (const key of required) if (!(key in value)) issues.push(`${path}.${key} is required`);
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function canonicalNow(): string {
  return new Date().toISOString();
}
