import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../../authored/sourceIncarnation.js";
import type { DurableOccurrenceReference } from "../../occurrences/durableOccurrenceReference.js";
import {
  EXECUTION_ACTUAL_DURATION_MAX_MINUTES,
  EXECUTION_NOTE_MAX_LENGTH,
  EXECUTION_RECORD_VERSION,
  EXECUTION_SNAPSHOT_TITLE_MAX_LENGTH,
  correctExecutionAssertion,
  createExecutionAssertion,
  isExecutionRecordId,
  isExecutionSubjectId,
  projectCurrentExecutionRecord,
  projectOccurrenceOutcome,
  retractExecutionRecord,
  validateExecutionRecord,
  validateExecutionRecordCollection,
  validateExecutionSubjectComponent,
  type ExecutionAssertionRecordV1,
  type ExecutionHistoricalSnapshot,
  type ExecutionRecordId,
  type ExecutionRecordV1,
  type ExecutionSubjectId,
} from "../executionRecord.js";

const ids = {
  r1: "00000000-0000-4000-8000-000000000001" as ExecutionRecordId,
  r2: "00000000-0000-4000-8000-000000000002" as ExecutionRecordId,
  r3: "00000000-0000-4000-8000-000000000003" as ExecutionRecordId,
  r4: "00000000-0000-4000-8000-000000000004" as ExecutionRecordId,
  s1: "10000000-0000-4000-8000-000000000001" as ExecutionSubjectId,
  s2: "10000000-0000-4000-8000-000000000002" as ExecutionSubjectId,
};

const incarnations = {
  template: "20000000-0000-4000-8000-000000000001" as SourceIncarnationId,
  recurrence: "20000000-0000-4000-8000-000000000002" as SourceIncarnationId,
  replacement: "20000000-0000-4000-8000-000000000003" as SourceIncarnationId,
};

const reference: DurableOccurrenceReference = {
  version: 1,
  sourceKind: "template",
  template: { id: "template", incarnationId: incarnations.template },
  recurrence: { id: "recurrence", incarnationId: incarnations.recurrence },
  coordinate: { frequency: "daily", scopeKind: "userDay", userDayDate: "2026-08-20", slot: 0 },
};

function snapshot(plan: ExecutionHistoricalSnapshot["plan"] = {
  state: "scheduled", startsAt: "2026-08-20T15:00:00.000Z", endsAt: "2026-08-20T16:00:00.000Z",
}): ExecutionHistoricalSnapshot {
  return {
    sourceFamily: "template", title: "Workout", category: "fitness",
    userDay: { date: "2026-08-20", dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 }, plan,
  };
}

function providers(recordId = ids.r1, subjectId = ids.s1, now = "2026-08-20T18:00:00.000Z") {
  return { allocateRecordId: () => recordId, allocateSubjectId: () => subjectId, now: () => now };
}

function planned(outcome: "completed" | "partial" | "skipped" = "completed",
  plan?: ExecutionHistoricalSnapshot["plan"]): ExecutionAssertionRecordV1 {
  const result = createExecutionAssertion({
    subject: { kind: "planned", reference }, snapshot: snapshot(plan), outcome,
  }, providers());
  if (result.status !== "created" || result.record.kind !== "assertion") throw new Error("fixture failed");
  return result.record;
}

describe("ExecutionRecord V1 identity and construction", () => {
  it("strictly validates distinct canonical UUID-v4 branded domains", () => {
    expect(isExecutionRecordId(ids.r1)).toBe(true);
    expect(isExecutionSubjectId(ids.s1)).toBe(true);
    for (const invalid of ["abcdefab-cdef-4abc-8abc-abcdefabcdef".toUpperCase(),
      "00000000-0000-1000-8000-000000000001", "bad"]) {
      expect(isExecutionRecordId(invalid)).toBe(false);
      expect(isExecutionSubjectId(invalid)).toBe(false);
    }
  });

  it("creates a planned assertion with injected identities/clock and isolated inputs", () => {
    const inputReference = structuredClone(reference);
    const inputSnapshot = snapshot();
    const result = createExecutionAssertion({
      subject: { kind: "planned", reference: inputReference }, snapshot: inputSnapshot,
      outcome: "completed", actualTime: { occurredAt: "2026-08-20T17:00:00.000Z", durationMinutes: 45 },
      note: "Felt good",
    }, providers());
    expect(result.status).toBe("created");
    if (result.status !== "created" || result.record.kind !== "assertion") return;
    expect(result.record).toMatchObject({ version: EXECUTION_RECORD_VERSION, id: ids.r1,
      subjectId: ids.s1, kind: "assertion", outcome: "completed",
      provenance: { kind: "userReported" }, recordedAt: "2026-08-20T18:00:00.000Z" });
    inputReference.template.id = "changed";
    inputSnapshot.title = "Changed";
    expect(result.record.subject.kind === "planned" && result.record.subject.reference.sourceKind === "template" &&
      result.record.subject.reference.template.id).toBe("template");
    expect(result.record.snapshot.title).toBe("Workout");
  });

  it("supports distinct unplanned completed/partial subjects without references", () => {
    const unplannedSnapshot: ExecutionHistoricalSnapshot = {
      ...snapshot({ state: "unplanned" }), sourceFamily: "unplanned", title: "Spontaneous walk",
    };
    for (const outcome of ["completed", "partial"] as const) {
      const result = createExecutionAssertion({ subject: { kind: "unplanned" }, snapshot: unplannedSnapshot,
        outcome }, providers());
      expect(result.status).toBe("created");
      if (result.status === "created" && result.record.kind === "assertion") {
        expect(result.record.subject).toEqual({ kind: "unplanned" });
      }
    }
  });

  it("rejects unplanned skipped and never exposes missed/cancelled", () => {
    const result = createExecutionAssertion({ subject: { kind: "unplanned" },
      snapshot: { ...snapshot({ state: "unplanned" }), sourceFamily: "unplanned" }, outcome: "skipped" }, providers());
    expect(result).toMatchObject({ status: "invalidInput" });
    expect(JSON.stringify(result)).not.toMatch(/missed|cancelled/);
  });

  it.each(["omitted", "unplaced", "blocked"] as const)("allows completed planned %s context", (state) => {
    expect(validateExecutionRecord(planned("completed", { state })).status).toBe("valid");
  });
});

describe("strict record semantics", () => {
  it("accepts completed/partial time evidence, retroactive reports, and does not infer scheduled time", () => {
    for (const outcome of ["completed", "partial"] as const) {
      const result = createExecutionAssertion({ subject: { kind: "planned", reference }, snapshot: snapshot(), outcome,
        actualTime: { occurredAt: "2020-01-01T00:00:00.000Z", durationMinutes: 30 } }, providers());
      expect(result.status).toBe("created");
    }
    expect(planned().actualTime).toBeUndefined();
  });

  it("rejects skipped actual evidence, future actual time, and invalid duration", () => {
    const cases = [
      { outcome: "skipped" as const, actualTime: { durationMinutes: 1 } },
      { outcome: "completed" as const, actualTime: { occurredAt: "2026-08-20T18:00:00.001Z" } },
      { outcome: "partial" as const, actualTime: { durationMinutes: EXECUTION_ACTUAL_DURATION_MAX_MINUTES + 1 } },
    ];
    for (const current of cases) expect(createExecutionAssertion({ subject: { kind: "planned", reference },
      snapshot: snapshot(), ...current }, providers()).status).toBe("invalidInput");
  });

  it("enforces title, note, user-day, offset, interval, provenance, and exact keys", () => {
    const base = planned();
    const invalid = [
      { ...base, snapshot: { ...base.snapshot, title: "x".repeat(EXECUTION_SNAPSHOT_TITLE_MAX_LENGTH + 1) } },
      { ...base, note: "x".repeat(EXECUTION_NOTE_MAX_LENGTH + 1) },
      { ...base, snapshot: { ...base.snapshot, userDay: { ...base.snapshot.userDay, date: "2026-02-30" } } },
      { ...base, snapshot: { ...base.snapshot, userDay: { ...base.snapshot.userDay, utcOffsetMinutes: 841 } } },
      { ...base, snapshot: { ...base.snapshot, plan: { state: "scheduled", startsAt: "2026-08-20T16:00:00.000Z", endsAt: "2026-08-20T15:00:00.000Z" } } },
      { ...base, provenance: { kind: "systemObserved" } },
      { ...base, extra: true },
    ];
    invalid.forEach((value) => expect(validateExecutionRecord(value).status).toBe("invalid"));
  });

  it("reports unsupported versions explicitly and validates planned reference/family without resolving sources", () => {
    expect(validateExecutionRecord({ ...planned(), version: 2 })).toEqual({ status: "unsupportedVersion", version: 2 });
    expect(validateExecutionRecord({ ...planned(), snapshot: { ...snapshot(), sourceFamily: "work" } }).status).toBe("invalid");
    expect(validateExecutionRecord(planned()).status).toBe("valid");
  });

  it("distinguishes recreated source incarnations structurally", () => {
    const original = planned();
    const recreatedReference = structuredClone(reference);
    recreatedReference.template.incarnationId = incarnations.replacement;
    const recreated = createExecutionAssertion({ subject: { kind: "planned", reference: recreatedReference },
      snapshot: snapshot(), outcome: "completed" }, providers(ids.r2, ids.s2));
    expect(recreated.status).toBe("created");
    expect(original.subject.kind === "planned" && original.subject.reference).toEqual(reference);
  });
});

describe("correction, retraction, and projection", () => {
  it("corrects the current head immutably and deterministically", () => {
    const first = planned("completed");
    const before = structuredClone(first);
    const corrected = correctExecutionAssertion([first], first.id, { snapshot: { ...snapshot(), title: "Corrected" },
      outcome: "partial", actualTime: { durationMinutes: 20 } }, providers(ids.r2, ids.s2, "2026-08-20T19:00:00.000Z"));
    expect(corrected.status).toBe("created");
    if (corrected.status !== "created") return;
    expect(corrected.record).toMatchObject({ id: ids.r2, subjectId: first.subjectId, replacesRecordId: first.id });
    expect(first).toEqual(before);
    for (const records of [[first, corrected.record], [corrected.record, first]]) {
      expect(projectOccurrenceOutcome(records, first.subjectId)).toMatchObject({ status: "partial" });
    }
    expect(correctExecutionAssertion([first, corrected.record], first.id, { snapshot: snapshot(), outcome: "completed" },
      providers(ids.r3)).status).toBe("notCurrentHead");
  });

  it("retracts to unknown and permits a later assertion replacing the retraction", () => {
    const first = planned();
    const retracted = retractExecutionRecord([first], first.id, "wrong entry",
      providers(ids.r2, ids.s2, "2026-08-20T19:00:00.000Z"));
    expect(retracted.status).toBe("created");
    if (retracted.status !== "created") return;
    expect(projectCurrentExecutionRecord([first, retracted.record], first.subjectId)).toEqual({ status: "none" });
    expect(projectOccurrenceOutcome([retracted.record, first], first.subjectId)).toEqual({ status: "unknown" });
    const restored = correctExecutionAssertion([retracted.record, first], retracted.record.id,
      { snapshot: snapshot(), outcome: "partial" }, providers(ids.r3, ids.s2, "2026-08-20T20:00:00.000Z"));
    expect(restored.status).toBe("created");
    if (restored.status === "created") expect(projectOccurrenceOutcome([restored.record, first, retracted.record],
      first.subjectId)).toMatchObject({ status: "partial" });
  });

  it("projects no records as unknown and returns cloned current records", () => {
    expect(projectOccurrenceOutcome([], ids.s1)).toEqual({ status: "unknown" });
    const first = planned();
    const projected = projectCurrentExecutionRecord([first], first.subjectId);
    expect(projected.status).toBe("current");
    if (projected.status === "current") {
      projected.record.snapshot.title = "mutated";
      expect(first.snapshot.title).toBe("Workout");
    }
  });
});

describe("collection integrity", () => {
  function correctedPair(): [ExecutionAssertionRecordV1, ExecutionRecordV1] {
    const first = planned();
    const result = correctExecutionAssertion([first], first.id, { snapshot: snapshot(), outcome: "partial" },
      providers(ids.r2, ids.s2, "2026-08-20T19:00:00.000Z"));
    if (result.status !== "created") throw new Error("fixture failed");
    return [first, result.record];
  }

  it("detects duplicate IDs, missing targets, cross-subject links, nonmonotonic time, and branches", () => {
    const [first, second] = correctedPair();
    const cases: [ExecutionRecordV1[], string][] = [
      [[first, first], "duplicateRecordId"],
      [[first, { ...second, replacesRecordId: ids.r4 }], "missingReplacement"],
      [[first, { ...second, subjectId: ids.s2 }], "crossSubjectReplacement"],
      [[first, { ...second, recordedAt: "2026-08-20T17:00:00.000Z" }], "nonMonotonicRecordedAt"],
      [[first, second, { ...second, id: ids.r3 }], "competingReplacement"],
    ];
    for (const [records, code] of cases) {
      const result = validateExecutionRecordCollection(records);
      expect(result.status).toBe("invalid");
      if (result.status === "invalid") expect(result.issues.some((current) => current.code === code)).toBe(true);
    }
  });

  it("detects cycles and competing disconnected heads", () => {
    const first = { ...planned(), replacesRecordId: ids.r2 };
    const second = { ...planned(), id: ids.r2, replacesRecordId: ids.r1,
      recordedAt: "2026-08-20T19:00:00.000Z" };
    const cycle = validateExecutionRecordCollection([first, second]);
    expect(cycle.status).toBe("invalid");
    if (cycle.status === "invalid") expect(cycle.issues.some((current) => current.code === "cycle")).toBe(true);

    const competing = validateExecutionRecordCollection([planned(), { ...planned(), id: ids.r2 }]);
    expect(competing.status).toBe("invalid");
    if (competing.status === "invalid") expect(competing.issues.some((current) => current.code === "competingHead")).toBe(true);
  });

  it("detects duplicate planned references across subjects while allowing duplicate unplanned context", () => {
    const duplicate = { ...planned(), id: ids.r2, subjectId: ids.s2 };
    const result = validateExecutionRecordCollection([planned(), duplicate]);
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") expect(result.issues.some((current) => current.code === "duplicatePlannedReference")).toBe(true);

    const unplannedSnapshot: ExecutionHistoricalSnapshot = { ...snapshot({ state: "unplanned" }), sourceFamily: "unplanned" };
    const one = createExecutionAssertion({ subject: { kind: "unplanned" }, snapshot: unplannedSnapshot,
      outcome: "completed" }, providers(ids.r1, ids.s1));
    const two = createExecutionAssertion({ subject: { kind: "unplanned" }, snapshot: unplannedSnapshot,
      outcome: "completed" }, providers(ids.r2, ids.s2));
    if (one.status === "created" && two.status === "created") {
      expect(validateExecutionRecordCollection([one.record, two.record]).status).toBe("valid");
    }
  });

  it("validates one subject component independently with structured details", () => {
    const [first, second] = correctedPair();
    expect(validateExecutionSubjectComponent([second, first], first.subjectId).status).toBe("valid");
    const invalid = validateExecutionSubjectComponent([{ ...second, replacesRecordId: ids.r4 }, first], first.subjectId);
    expect(invalid.status).toBe("invalid");
    if (invalid.status === "invalid") expect(invalid.issues[0]).toMatchObject({ subjectId: first.subjectId });
  });
});

describe("serialization and purity", () => {
  it("roundtrips assertions, corrections, and retractions through JSON", () => {
    const first = planned();
    const correction = correctExecutionAssertion([first], first.id, { snapshot: snapshot(), outcome: "partial" },
      providers(ids.r2, ids.s2, "2026-08-20T19:00:00.000Z"));
    if (correction.status !== "created") throw new Error("fixture failed");
    const retraction = retractExecutionRecord([first, correction.record], correction.record.id, undefined,
      providers(ids.r3, ids.s2, "2026-08-20T20:00:00.000Z"));
    if (retraction.status !== "created") throw new Error("fixture failed");
    const parsed = JSON.parse(JSON.stringify([first, correction.record, retraction.record])) as unknown[];
    expect(validateExecutionRecordCollection(parsed).status).toBe("valid");
    expect(projectOccurrenceOutcome(parsed, first.subjectId)).toEqual({ status: "unknown" });
  });

  it("does not mutate validator or projection inputs", () => {
    const first = planned();
    const before = JSON.stringify(first);
    validateExecutionRecord(first);
    validateExecutionRecordCollection([first]);
    projectOccurrenceOutcome([first], first.subjectId);
    expect(JSON.stringify(first)).toBe(before);
  });
});
