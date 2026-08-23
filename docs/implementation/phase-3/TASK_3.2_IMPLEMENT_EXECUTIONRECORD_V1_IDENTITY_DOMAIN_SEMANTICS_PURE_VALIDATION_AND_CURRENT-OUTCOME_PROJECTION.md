# Task 3.2 — Implement ExecutionRecord V1 Identity, Domain Semantics, Pure Validation, and Current-Outcome Projection

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded pure-domain implementation task.

Task 3.2 implements the `ExecutionRecord V1` domain model selected by Task 3.1.

It includes:

* independent execution-record identity;
* execution-subject identity;
* planned and unplanned subject semantics;
* immutable record revisions;
* historical snapshot structure;
* V1 outcome vocabulary;
* provenance;
* recorded-time semantics;
* optional actual-time evidence;
* optional note;
* correction/retraction linkage;
* strict validation;
* correction-chain validation;
* deterministic current-record projection;
* deterministic `OccurrenceOutcome` projection;
* clone isolation;
* JSON roundtrip safety;
* direct regression coverage.

It does **not** implement:

* execution-history persistence;
* store authority;
* durability/retry;
* recovery/quarantine;
* reporting UI;
* history UI;
* progress;
* adherence;
* learning;
* Backup V3;
* timers;
* integrations.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 3.1 is complete and accepted;
6. review:

   * `CHECKPOINT_Phase_3_Execution_History_Semantics.md`;
   * `ADR_EXECUTION_RECORD_AND_COMPLETION_HISTORY_SEMANTICS.md`;
   * the Task 3.1 result;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.2_IMPLEMENT_EXECUTIONRECORD_V1_IDENTITY_DOMAIN_SEMANTICS_PURE_VALIDATION_AND_CURRENT_OUTCOME_PROJECTION_RESULT.md`

If the pure domain model cannot be implemented without prematurely deciding persistence/storage/UI behavior, stop and report the narrowest blocking ambiguity.

---

# 2. Purpose

Task 3.1 established that DayFrame currently has no authoritative execution-history subsystem and selected a hybrid model:

```text
immutable ExecutionRecord revisions
        ↓
deterministic current record
        ↓
derived OccurrenceOutcome
```

The task also established these core rules:

```text
planning ≠ execution

no record
    = unknown

not
    = missed
```

and:

```text
planned occurrence identity
        +
execution-specific identity
        +
frozen historical snapshot
```

are all necessary for truthful history.

Task 3.2 makes those semantics executable as a pure domain layer.

---

# 3. Governing Architectural Decisions

The following Task 3.1 decisions are fixed:

1. the domain object is named `ExecutionRecord`;
2. V1 uses immutable record revisions;
3. one semantic execution subject has at most one projected current outcome;
4. multiple revisions may exist for correction/retraction;
5. `OccurrenceOutcome` is derived;
6. V1 outcomes are:

   * `completed`;
   * `partial`;
   * `skipped`;
7. absence of a current record derives:

   * `unknown`;
8. `missed` is not a V1 stored or derived outcome;
9. `cancelled` is deferred;
10. planned linkage is optional;
11. unplanned execution is allowed;
12. planned linkage uses `DurableOccurrenceReference V1`;
13. execution history has independent identity;
14. historical snapshot context is required;
15. source deletion does not invalidate history;
16. source recreation does not inherit history;
17. correction appends a replacement revision;
18. retraction appends a tombstone-like revision;
19. physical delete is not ordinary correction;
20. `recordedAt` is distinct from actual occurrence time;
21. scheduled timestamps never become actual timestamps automatically;
22. user report is the only V1 authoritative provenance;
23. timer/integration observation is schema-ready but not implemented;
24. no persistence is implemented in Task 3.2.

Do not reopen these semantics.

---

# 4. Architectural Objective

After Task 3.2, DayFrame should have a pure executable model where:

```text
ExecutionRecord[]
        ↓
validate records
        ↓
validate subjects
        ↓
validate correction chains
        ↓
project current record
        ↓
project OccurrenceOutcome
```

with no dependence on:

* store;
* localStorage;
* IndexedDB;
* Preview;
* React;
* current source resolvability;
* current PlanDecision state.

---

# 5. Required Initial Audit

Before coding, inspect:

* existing branded ID patterns;
* UUID validation/allocation helpers;
* `SourceIncarnationId`;
* `PlanDecisionId`;
* local date/time string types;
* `DurableOccurrenceReference V1`;
* clone helpers;
* validator conventions;
* result-union conventions;
* canonical ISO timestamp validation;
* historical date/user-day helpers;
* category/source-kind types.

Reuse stable primitives where appropriate.

Do not duplicate validators unnecessarily.

---

# 6. Module Boundary

Create a dedicated execution/history domain area.

Preferred:

`code/src/core/execution/`

Possible files:

* `executionRecord.ts`;
* `executionRecordIdentity.ts`;
* `executionRecordValidation.ts`;
* `executionOutcome.ts`.

Keep it compact.

Do not put the domain model in state/store modules.

---

# 7. Execution Record Version

Introduce:

```ts
EXECUTION_RECORD_VERSION = 1
```

independent from:

* Active V2;
* Profile V2;
* Backup V2;
* PlanDecision V1;
* DurableOccurrenceReference V1.

---

# 8. `ExecutionRecordId`

Introduce a branded record/revision ID.

Requirements:

* canonical lowercase UUID-v4;
* strict validation;
* cryptographically strong allocator;
* allocator injection for tests;
* no target hashing;
* no timestamp-derived identity;
* no `Math.random`.

Each immutable revision gets its own `ExecutionRecordId`.

---

# 9. `ExecutionSubjectId`

Introduce an independent semantic execution-subject identity.

Purpose:

> identify the historical subject across multiple correction/retraction revisions.

Requirements:

* canonical lowercase UUID-v4;
* distinct branded type from `ExecutionRecordId`;
* cryptographically strong allocator;
* test injection;
* stable across revisions;
* independent from DurableOccurrenceReference.

---

# 10. Record Identity Versus Subject Identity

Define explicitly:

```text
ExecutionSubjectId
    = identity of the historical execution subject

ExecutionRecordId
    = identity of one immutable assertion/revision
```

Example:

```text
Subject S

Record R1
    completed

Record R2
    correction of R1
    partial

Record R3
    retraction of R2
```

All three records share subject S.

---

# 11. Planned Subject

A planned execution subject may contain:

```ts
plannedOccurrenceReference: DurableOccurrenceReferenceV1
```

or equivalent.

The reference:

* correlates history to a planned occurrence;
* does not determine record validity after source deletion;
* is not the subject ID.

---

# 12. Unplanned Subject

ExecutionRecord V1 must support a subject with no planned occurrence reference.

Examples:

* spontaneous workout;
* unscheduled errand;
* unexpected overtime.

Do not require a fake DurableOccurrenceReference.

---

# 13. Subject Kind

Use an explicit discriminator for subject provenance.

Preferred conceptual form:

```ts
type ExecutionSubject =
  | {
      kind: "planned";
      reference: DurableOccurrenceReferenceV1;
    }
  | {
      kind: "unplanned";
    };
```

If snapshot semantics make another structure cleaner, preserve the same meaning.

---

# 14. Historical Snapshot Requirement

Every non-retraction execution assertion must carry an immutable historical snapshot sufficient to remain understandable without current source resolution.

At minimum evaluate fields for:

* source/subject family;
* display title;
* category/type;
* intended user-day context;
* planned interval when one existed;
* timezone/offset context;
* planned/unplanned origin.

Implement only the minimum accepted by Task 3.1.

---

# 15. Snapshot Independence

Snapshot fields are historical facts.

They must not:

* resolve current title dynamically;
* depend on current source;
* change when authored setup changes;
* change when current timezone/day-boundary preferences change.

---

# 16. Snapshot Source Family

Define stable V1 source-family vocabulary.

At minimum consider:

* `template`;
* `work`;
* `manualEvent`;
* `unplanned`.

Do not include imported-calendar planned linkage unless a lifetime-safe reference exists.

---

# 17. Snapshot Title

Require bounded non-empty human-readable title.

Determine reasonable maximum length consistent with existing authored title validation.

Do not leave unlimited strings.

---

# 18. Snapshot Category

Use current stable category/type representation where available.

If categories are free-form or unstable, choose the safest historical representation.

Do not introduce a new category taxonomy in this task.

---

# 19. Planned User-Day Context

For planned subjects, snapshot the semantic planning coordinate needed for historical display.

Potential:

* `userDayDate`;
* `userWeekStartDate`;
* local work start date.

Prefer an explicit normalized display context rather than reusing the full reference blindly.

---

# 20. Planned Interval

Where a concrete planned interval existed, allow snapshot fields for:

* planned start instant;
* planned end instant;
* planned duration.

Do not require an interval for:

* unplaced occurrence;
* omitted occurrence;
* blocked placement with no actual scheduled position.

The snapshot must be capable of expressing:

> planned occurrence existed, but had no scheduled interval.

---

# 21. Snapshot Plan State

Consider an explicit V1 planning-context discriminator such as:

* `scheduled`;
* `unplaced`;
* `omitted`;
* `blocked`;
* `unplanned`.

Do not encode current replay state generically if it does not belong historically.

The goal is to preserve defensible plan context at report time.

---

# 22. Planned Context And PlanDecision

Do not embed PlanDecision records wholesale.

If the historical snapshot needs to indicate that an occurrence was planned under an accepted choice, use minimal factual context only if Task 3.1 checkpoint supports it.

Do not make history dependent on current decision resolution.

---

# 23. Snapshot Timezone Representation

Task 3.1 left exact timezone representation unresolved but requires sufficient zone/offset context.

Task 3.2 must choose the narrowest implementation-safe representation that does not invent DST semantics.

Preferred:

* UTC instant for concrete planned timestamps;
* explicit numeric UTC offset at that historical instant;
* optional IANA zone ID only if current runtime reliably provides one.

Do not require a zone database infrastructure redesign.

---

# 24. Actual-Time Evidence

V1 supports optional asserted actual-time evidence.

Choose a structured union.

Preferred conceptual options:

```ts
type ActualTimeEvidence =
  | { kind: "instant"; occurredAt: string }
  | {
      kind: "interval";
      startedAt: string;
      endedAt: string;
    }
  | {
      kind: "duration";
      durationMinutes: number;
      occurredAt?: string;
    };
```

But do not include all forms blindly.

Task 3.1 explicitly left exact shape unresolved.

Choose the smallest shape that safely supports V1:

* optional occurred instant;
* optional duration;
* possibly interval if clearly useful.

Document the decision.

---

# 25. Actual Time Is Evidence

Actual-time fields are claims supplied by provenance.

They must never be auto-populated from:

* scheduled start;
* scheduled end;
* current time merely because completion was clicked.

A UI may later choose defaults explicitly, but the domain layer must not fabricate them.

---

# 26. `recordedAt`

Every record revision requires:

```ts
recordedAt
```

as canonical UTC ISO-8601.

Meaning:

> when DayFrame accepted this revision into execution authority.

This is not the occurrence time.

---

# 27. Recorded Time Validation

Require:

* valid ISO-8601;
* UTC representation if project convention supports exact `Z`;
* canonical format;
* finite real instant.

Reject malformed strings.

---

# 28. Future Assertion Validation

If actual occurrence time is supplied:

* it must not be later than `recordedAt`;
* allow small implementation-independent equality;
* do not compare to current wall clock inside pure validation.

This keeps validation deterministic.

---

# 29. Early Execution

A record may assert execution before the planned slot.

This is valid when actual time evidence establishes it.

Do not reject merely because it precedes the historical planned interval.

---

# 30. Late Execution

Likewise valid.

Early/late remain derived comparisons.

---

# 31. Retroactive Reporting

`recordedAt` may occur arbitrarily after actual occurrence.

Do not impose same-day limits.

---

# 32. V1 Outcome Union

Implement stored assertion outcomes:

```ts
type ExecutionReportedOutcome =
  | "completed"
  | "partial"
  | "skipped";
```

Do not include:

* unknown;
* missed;
* cancelled;
* blocked;
* omitted;
* failed.

---

# 33. `completed`

Meaning:

> the reporter asserts the intended activity was sufficiently completed.

It is not objective verification.

No percentage required.

---

# 34. `partial`

Meaning:

> meaningful execution occurred, but completion is not claimed.

No generic percentage required.

---

# 35. `skipped`

Meaning:

> the reporter asserts an expected/planned subject was intentionally not performed.

Determine whether skipped is valid for unplanned subjects.

Preferred:

> no.

An unplanned subject cannot meaningfully be execution-skipped because no prior expectation existed.

Reject or classify invalid.

---

# 36. Unknown Outcome

`unknown` is derived when no current non-retracted assertion exists.

Do not store a normal `unknown` assertion.

A retraction may project the subject to unknown.

---

# 37. Retraction Record

Implement an explicit revision kind for retraction.

Preferred conceptual union:

```ts
type ExecutionRecordV1 =
  | ExecutionAssertionRecordV1
  | ExecutionRetractionRecordV1;
```

A retraction:

* shares subject ID;
* has its own record ID;
* points to current record being retracted;
* has `recordedAt`;
* has provenance;
* may have optional note/reason;
* does not claim completed/partial/skipped.

---

# 38. Correction Record

A correction is a full replacement assertion.

It must:

* share subject ID;
* have new record ID;
* link to exactly one prior current revision;
* contain complete replacement outcome/snapshot/evidence;
* not patch fields incrementally.

---

# 39. Revision Link

Define one explicit field such as:

```ts
replacesRecordId
```

or equivalent.

Rules:

* first record has none;
* correction has one;
* retraction has one;
* link must remain within same subject;
* link must refer to existing revision in validated collection.

---

# 40. Linear Correction Chain

V1 requires one linear chain per subject.

Reject:

* multiple revisions replacing the same current head;
* cycles;
* cross-subject replacement;
* missing replacement targets;
* disconnected competing heads where more than one active branch exists.

---

# 41. Historical Revision Order

Do not infer correction order from array order.

Use explicit links.

`recordedAt` is explanatory, not sole chain authority.

---

# 42. RecordedAt Monotonicity

Determine whether a replacement revision must have:

```text
recordedAt >= replaced.recordedAt
```

Preferred:

> yes.

A correction cannot be recorded before the record it corrects.

Enforce.

---

# 43. Record ID Uniqueness

All `ExecutionRecordId` values in a validated collection must be unique globally.

---

# 44. Subject ID Scope

`ExecutionSubjectId` may appear across multiple revisions intentionally.

Do not require global uniqueness per record.

---

# 45. Planned Reference Consistency

All revisions for one subject must preserve the same subject origin/reference.

A correction changes execution assertion, not which semantic historical subject it refers to.

Do not permit switching a subject from one planned occurrence to another.

---

# 46. Snapshot Consistency Across Revisions

Determine whether corrections may update historical snapshot.

Preferred:

> snapshot normally remains identical because the planned context being reported did not change.

However, if the original snapshot itself was entered incorrectly, correction may need to correct it.

Task 3.1 calls each revision a complete assertion.

Choose and document:

## A. snapshot immutable across subject;

or

## B. each correction may replace snapshot as part of correcting erroneous history.

Preferred architectural direction:

> allow replacement as an explicit correction, but current projected snapshot comes from current record while prior snapshots remain immutable evidence.

This preserves truthfulness.

---

# 47. Provenance

Implement explicit V1 provenance.

Minimum:

```ts
{ kind: "userReported" }
```

Optionally structure future-safe discriminators for:

* `systemObserved`;
* `integrationObserved`;

but do not accept unsupported provenance as valid V1 authority unless required.

Preferred:

> V1 validator accepts userReported only.

Future versions can expand.

---

# 48. No Confidence Score

Do not add confidence.

---

# 49. Reporter Identity

Do not add user/account identifiers.

The current local user is implicit.

---

# 50. Note

Allow optional bounded user note if consistent with Task 3.1.

Requirements:

* string;
* trimmed or exact-preservation policy explicitly defined;
* maximum length;
* no HTML interpretation;
* clone-safe.

Do not require a note.

---

# 51. Note Preservation

Prefer preserve user-entered text exactly except structural length/type validation.

Do not silently normalize meaningful whitespace unless project convention requires it.

---

# 52. Duration Evidence

If V1 includes actual duration:

* positive integer minutes;
* bounded reasonably;
* optional;
* not required for completed/partial;
* normally invalid for skipped.

Do not copy planned duration automatically.

---

# 53. Actual Interval

If actual start/end is included:

* end must be >= start;
* duration may be derived;
* if explicit duration also exists, avoid conflicting redundant authority.

Prefer one canonical representation.

---

# 54. Chosen Actual-Time V1 Shape

Task result must explicitly document the final chosen representation and why.

Do not leave multiple equivalent encodings.

---

# 55. Assertion Validation

A valid assertion requires:

* version;
* record ID;
* subject ID;
* assertion kind;
* subject origin;
* historical snapshot;
* reported outcome;
* provenance;
* recordedAt;
* optional time evidence;
* optional note;
* optional replacement link.

Exact keys only.

---

# 56. Retraction Validation

A retraction requires:

* version;
* record ID;
* subject ID;
* retraction kind;
* provenance;
* recordedAt;
* replacement link;
* optional note/reason;

and must forbid assertion-only fields unless snapshot retention is explicitly desired.

Prefer minimal retraction.

---

# 57. Exact-Key Validation

Reject:

* unknown keys;
* cross-kind fields;
* malformed nested objects;
* unsupported versions.

Use strict shape validation.

---

# 58. Unknown Record Version

Return explicit unsupported-version result.

Do not reinterpret.

---

# 59. DurableOccurrenceReference Validation

Planned subject reference must validate through current `DurableOccurrenceReference V1` validator.

Do not resolve it against current authored state during record validation.

A deleted source must not invalidate history.

---

# 60. Snapshot/Reference Family Consistency

For planned subjects, validate that snapshot source family is compatible with the durable reference family.

Examples:

* template reference → template snapshot;
* work reference → work snapshot;
* manual event → manual-event snapshot.

Do not require current source resolution.

---

# 61. Unplanned Snapshot

Unplanned record:

* subject kind `unplanned`;
* no durable occurrence reference;
* snapshot family `unplanned`;
* user-provided title/context required.

---

# 62. Execution Record Constructor

Provide authoritative constructors rather than expecting arbitrary object assembly.

Potential:

```ts
createExecutionRecord(...)
correctExecutionRecord(...)
retractExecutionRecord(...)
```

Pure except injected ID/clock providers.

No persistence.

---

# 63. First Assertion Constructor

Own:

* record ID allocation;
* subject ID allocation;
* version;
* recordedAt if clock injected;
* validation.

Callers provide semantic evidence.

---

# 64. Correction Constructor

Own:

* new record ID;
* same subject ID;
* replacement link;
* recordedAt;
* full replacement assertion.

Do not mutate old record.

---

# 65. Retraction Constructor

Same immutable approach.

---

# 66. Constructor Clock Injection

Use injected clock for deterministic tests.

Do not accept arbitrary production caller `recordedAt` unless a lower-level raw constructor is intentionally separate.

---

# 67. Historical Imported Data

Validator must be capable of accepting stored `recordedAt` from persistence in future.

Constructor and validator are distinct concerns.

---

# 68. Construction Result Union

Use explicit expected failure outcomes.

Potential:

* `created`;
* `invalidInput`;
* `allocationFailure`;
* `invalidReplacement`;
* `notCurrentHead`.

Do not throw for expected domain failures.

---

# 69. Correct-Current-Head Rule

A correction/retraction should be constructed only against the current projected record for the subject.

If caller tries to replace an older historical revision:

* reject as stale correction target.

This prevents branching under normal APIs.

---

# 70. Raw Validation Versus Store Authority

Collection validator must still detect malformed/branching imported data independently of constructors.

---

# 71. Collection Validation

Implement validation for a set/array of ExecutionRecord V1 entries.

Requirements:

* strict record validation;
* unique record IDs;
* valid subject chains;
* replacement referential integrity;
* no cycles;
* no branch heads;
* no cross-subject replacement;
* monotonic recordedAt;
* subject origin/reference consistency.

---

# 72. Independent Subjects

One invalid subject chain should be detectable independently.

Task 3.2 does not implement quarantine, but validator should provide enough structured detail so Task 3.3 can quarantine a bad component.

---

# 73. Validation Error Detail

Return structured errors including:

* record index/ID where available;
* subject ID where available;
* reason code.

Potential reason codes:

* invalidRecord;
* duplicateRecordId;
* missingReplacement;
* crossSubjectReplacement;
* cycle;
* competingHead;
* nonMonotonicRecordedAt;
* subjectMismatch;
* unsupportedVersion.

Do not expose UI prose from core.

---

# 74. Subject Component Validation

Provide a pure way to validate/project one subject chain independently.

This will help future entry/component quarantine.

---

# 75. Current Record Projection

Implement:

```ts
projectCurrentExecutionRecord(records, subjectId)
```

or equivalent.

Behavior:

* no records → none;
* valid assertion head → current assertion;
* retraction head → no current assertion;
* invalid chain → explicit failure.

Do not mutate input.

---

# 76. Current Outcome Projection

Implement:

```ts
projectOccurrenceOutcome(...)
```

or equivalent.

Derived outcomes:

* current assertion completed → completed;
* partial → partial;
* skipped → skipped;
* no current assertion/retracted/no record → unknown.

No missed.

---

# 77. OccurrenceOutcome Type

Preferred:

```ts
type OccurrenceOutcome =
  | { status: "completed"; record: ... }
  | { status: "partial"; record: ... }
  | { status: "skipped"; record: ... }
  | { status: "unknown" };
```

Avoid returning raw mutable record references.

Use clones or immutable structures.

---

# 78. Outcome Is Derived

Do not persist `OccurrenceOutcome` in Task 3.2.

---

# 79. Outcome Provenance

For reported outcomes, the projection may expose provenance from the current record.

Do not convert user report to “objective completion.”

---

# 80. Projection Determinism

Equivalent record sets in different array orders must project identically.

---

# 81. Projection Tie-Breaks

There should be no valid ambiguous tie due to explicit chain rules.

Do not use array order or lexical UUID to choose between competing heads.

Such data is invalid.

---

# 82. Retraction Outcome

Retraction head → unknown.

Keep prior records available historically.

---

# 83. Correction Outcome

Current replacement assertion governs current outcome.

Old assertion remains history only.

---

# 84. Multiple Subjects Projection

Provide a pure helper to project all current outcomes if useful.

Output ordering deterministic by subject ID.

No need if it over-expands scope.

---

# 85. Planned Subject Equality

Define structural semantic equality for subject origin.

Planned subject equality:

* same durable occurrence reference.

Unplanned subject equality:

* same ExecutionSubjectId only.

Do not merge unplanned subjects by title/time.

---

# 86. Execution Subject Creation

For planned first assertion, the constructor allocates a new subject ID even if another subject already references the same planned occurrence unless higher-level authority prevents duplicates.

Task 3.2 must decide duplicate planned-subject policy.

---

# 87. One Subject Per Planned Occurrence

Preferred V1 invariant:

> At most one execution subject may correlate to one exact DurableOccurrenceReference.

Reason:

One planned occurrence should not accidentally acquire two competing independent current outcomes.

Enforce in collection validation if evidence supports it.

---

# 88. Duplicate Planned Reference

If two subject IDs use the exact same planned DurableOccurrenceReference:

* collection invalid;
* future persistence may quarantine conflicting components.

Do not silently merge.

---

# 89. Unplanned Cardinality

Multiple unplanned subjects may share identical title/time.

They remain distinct because subject IDs differ.

---

# 90. Planned Versus Unplanned Correction

A correction must not switch origin.

---

# 91. Skipped Validation

For `skipped`:

* planned subject required;
* actual duration invalid;
* actual execution interval invalid;
* optional note allowed.

Whether an `occurredAt` decision-time is meaningful is doubtful.

Preferred:

> no actual execution time evidence on skipped record.

`recordedAt` is sufficient.

---

# 92. Partial Validation

Partial may include:

* actual occurred time;
* actual duration.

Neither required.

---

# 93. Completed Validation

Same.

No planned-time inference.

---

# 94. Unplanned Completed

Allowed.

---

# 95. Unplanned Partial

Allowed.

---

# 96. Unplanned Skipped

Rejected.

---

# 97. Historical Plan Snapshot For Unplanned

Must not fabricate planned interval.

Snapshot clearly says unplanned.

---

# 98. Omitted Planned Occurrence

A planned occurrence may be execution-completed or partial even if historical plan context says omitted.

This is valid.

Planning and reality may differ.

Do not reject.

---

# 99. Unplaced Planned Occurrence

Likewise.

---

# 100. Blocked Planned Occurrence

Likewise.

---

# 101. Stale Current Source

Record validation does not resolve current source.

History stays valid.

---

# 102. Backup/Profile Independence

No code path in this task references Profile/Backup persistence.

Tests may use durable references with lifetime changes only to prove reference is stored structurally without resolution.

---

# 103. Source Recreation Safety

Directly test:

* planned record contains reference to incarnation A;
* structurally similar reference B is different;
* record remains attached to A.

No automatic rewrite.

---

# 104. Snapshot Clone Isolation

Mutating a returned/constructed snapshot must not mutate input or another record.

---

# 105. Reference Clone Isolation

Same for DurableOccurrenceReference nested in record.

---

# 106. Note Clone Safety

Strings immutable by nature; nested objects still clone-safe.

---

# 107. Validator Purity

No input mutation.

---

# 108. Projection Purity

No mutation.

---

# 109. Constructor Purity

Except injected allocator/clock effects, no external state.

---

# 110. JSON Roundtrip

Every valid V1 record must:

* serialize to plain JSON;
* parse;
* validate;
* project equivalently.

No classes/functions/Date objects in durable shape.

Use strings/numbers/plain objects.

---

# 111. Date Object Boundary

Do not persist JavaScript `Date`.

Constructors may accept `Date` internally only if output canonicalizes immediately.

Prefer plain canonical strings at domain boundary.

---

# 112. Canonical Date/Time Validation

Reuse existing helpers.

Do not duplicate loose regexes if stronger primitives exist.

---

# 113. UTC Offset Validation

If snapshot includes numeric offset:

* define units, likely minutes;
* validate plausible range;
* no derived timezone inference.

---

# 114. Historical User-Day Boundary

Snapshot user-day context should include the effective boundary necessary to interpret the historical planned user day.

Use existing canonical time format.

---

# 115. Historical Week Context

Weekly/N-per-week durable reference already contains canonical user-week coordinate.

Snapshot may include human-readable planned context but must not overwrite reference semantics.

---

# 116. Work Snapshot

Historical work snapshot should preserve:

* title;
* source family;
* planned interval/context;
* category/type if stable.

Do not import entire shift definition.

---

# 117. Manual Event Snapshot

Same.

Calendar presence is plan context, not proof of attendance.

---

# 118. Template Snapshot

Same.

---

# 119. Sleep/Recovery

No special health fields.

Generic category/title/context only.

---

# 120. Quantity Metrics

No quantity payload in V1.

---

# 121. Percentage Completion

No generic percentage.

---

# 122. Cancellation

No `cancelled` outcome.

---

# 123. Missed

No `missed` outcome.

Search after implementation to ensure it did not sneak into ExecutionRecord/OccurrenceOutcome.

Existing Preview vocabulary may remain unchanged.

---

# 124. Failure/Success

No generic success/failure outcome.

---

# 125. Derived Timing Helper

A pure helper may derive:

* early;
* on/around planned time;
* late;

only when actual and planned time evidence exist.

This is optional for Task 3.2.

Do not include if it expands scope unnecessarily.

---

# 126. No Progress

No progress calculations.

---

# 127. No Adherence

No adherence calculations.

---

# 128. No Learning

No recommendation adaptation.

---

# 129. No UI Strings In Core

Use stable codes/types.

Human-readable copy comes later.

---

# 130. No Storage Surface

Do not add:

* localStorage key;
* IndexedDB database;
* store field;
* durability status;
* retry;
* recovery.

Task 3.3 will govern persistence.

---

# 131. No `DayFrameState` Change

Execution history must not be added to `DayFrameState`.

---

# 132. No Profile Change

None.

---

# 133. No Active V2 Change

None.

---

# 134. No PlanDecision Change

None.

---

# 135. No Backup Change

None.

---

# 136. Public Export Boundary

Export only the pure domain APIs needed by future persistence/reporting.

Avoid exposing internal validation helpers unnecessarily.

---

# 137. Test Module

Add direct tests under:

`code/src/core/execution/tests/`

or repository-equivalent location.

---

# 138. Identity Tests

Cover:

* valid canonical UUID-v4;
* uppercase rejected;
* wrong UUID version rejected;
* malformed rejected;
* injected allocator;
* ExecutionRecordId and ExecutionSubjectId are distinct branded domains.

---

# 139. First Planned Record Test

Create planned completed assertion.

Prove:

* subject ID allocated;
* record ID allocated;
* durable reference cloned;
* snapshot cloned;
* outcome correct;
* recordedAt correct.

---

# 140. First Unplanned Record Test

Create unplanned partial/completed record.

No DurableOccurrenceReference.

---

# 141. Unplanned Skip Rejection Test

Required.

---

# 142. Correction Test

Create R1.

Correct to R2.

Prove:

* same subject;
* new record ID;
* R2 replaces R1;
* R1 unchanged;
* current projection R2.

---

# 143. Retraction Test

R1 → retraction R2.

Projection unknown.

History retains both.

---

# 144. Correction After Retraction

Determine policy.

A retracted subject may later receive a new assertion.

Options:

## A. correction of retraction allowed;

## B. new assertion replaces retraction.

Preferred:

> allow a new correction/assertion that replaces the current retraction, restoring a current outcome.

This keeps correction chain linear.

Document and test.

---

# 145. Correction Of Non-Head Rejection

Required.

---

# 146. Branch Detection Test

Two revisions replace same R1.

Collection invalid.

---

# 147. Cycle Detection Test

Required.

---

# 148. Missing Replacement Test

Required.

---

# 149. Cross-Subject Replacement Test

Required.

---

# 150. RecordedAt Monotonicity Test

Required if adopted.

---

# 151. Duplicate Record ID Test

Required.

---

# 152. Duplicate Planned Reference Test

Required if one-subject-per-reference invariant adopted.

---

# 153. Reference Family/Snapshot Mismatch Test

Required.

---

# 154. Deleted-Source Independence Test

Use a valid durable reference without current authored state.

Record validation remains valid.

No resolver call.

---

# 155. Recreated Source Distinction Test

Different incarnation reference does not equal original subject reference.

---

# 156. Omitted Planned Completion Test

Valid.

---

# 157. Unplaced Planned Completion Test

Valid.

---

# 158. Skipped Planned Record Test

Valid.

---

# 159. Skipped Actual-Time Rejection

Required if skipped forbids actual execution evidence.

---

# 160. Completed Actual-Time Test

Valid optional evidence.

---

# 161. Partial Actual-Time Test

Valid.

---

# 162. Scheduled-Time Isolation Test

Changing snapshot planned interval does not auto-populate actual evidence.

---

# 163. Future Actual Time Test

actual > recordedAt rejected.

---

# 164. Retroactive Test

actual << recordedAt valid.

---

# 165. JSON Roundtrip Test

All record kinds.

---

# 166. Input Order Projection Test

Same record set shuffled → same current projection.

---

# 167. Unknown Test

No records for subject → unknown.

Retraction head → unknown.

---

# 168. No Missed Test

No API/output ever derives missed from absence.

---

# 169. Clone Isolation Test

Required.

---

# 170. Validator Non-Mutation Test

Required.

---

# 171. Projection Non-Mutation Test

Required.

---

# 172. Exact-Key Tests

Extra fields rejected.

---

# 173. Unsupported Version Test

Explicit unsupported result.

---

# 174. Provenance Test

V1 accepts userReported.

Unsupported future provenance rejected/unsupported according to chosen validator result.

---

# 175. Note Bound Test

Required if note included.

---

# 176. Snapshot Title Bound Test

Required.

---

# 177. Actual Duration Bound Test

Required if duration included.

---

# 178. User-Day Context Validation Test

Required.

---

# 179. Timezone/Offset Validation Test

Required according to chosen snapshot representation.

---

# 180. Public API Audit

Search production references after implementation.

Confirm no unrelated modules begin consuming ExecutionRecord yet except tests/domain exports.

---

# 181. Persistence Audit

Search:

* local storage writers;
* Active/Profile/Backup serializers;
* PlanDecision persistence.

Confirm no `ExecutionRecord` persistence introduced.

---

# 182. Store Audit

Confirm no store mutation/accessor added.

---

# 183. UI Audit

Confirm no completion/history UI.

---

# 184. Preview Audit

Confirm Preview types/behavior unchanged.

---

# 185. PlanDecision Audit

Confirm PlanDecision types/replay unchanged.

---

# 186. DurableOccurrenceReference Audit

No version/schema change.

Only reuse validator/equality/clone helpers if necessary.

---

# 187. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.2_IMPLEMENT_EXECUTIONRECORD_V1_IDENTITY_DOMAIN_SEMANTICS_PURE_VALIDATION_AND_CURRENT_OUTCOME_PROJECTION_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Checkpoint/ADR
4. Initial Domain Audit
5. Files Changed
6. Module Boundary
7. Version Contract
8. ExecutionRecordId
9. ExecutionSubjectId
10. Identity Allocation
11. Record vs Subject Identity
12. Planned Subject
13. Unplanned Subject
14. Subject Kind
15. Historical Snapshot
16. Snapshot Family
17. Snapshot Title/Category
18. User-Day Context
19. Planned Interval
20. Snapshot Timezone Representation
21. Chosen Actual-Time Evidence Shape
22. recordedAt
23. Future/Retroactive Time Rules
24. Outcome Union
25. completed
26. partial
27. skipped
28. unknown
29. Explicit Absence of missed
30. Retraction Record
31. Correction Record
32. Replacement Link
33. Correction Chain
34. recordedAt Monotonicity
35. Record ID Uniqueness
36. Planned Reference Consistency
37. Snapshot Correction Semantics
38. Provenance
39. Note
40. Duration/Interval Evidence
41. Strict Record Validation
42. Retraction Validation
43. Unsupported Version
44. DurableOccurrenceReference Validation
45. Snapshot/Reference Consistency
46. Constructors
47. Construction Results
48. Current-Head Rule
49. Collection Validation
50. Component Validation
51. Validation Error Detail
52. Current Record Projection
53. OccurrenceOutcome Projection
54. Projection Determinism
55. Retraction Projection
56. Correction Projection
57. Planned Subject Equality
58. One Subject Per Planned Occurrence
59. Unplanned Cardinality
60. Omitted/Unplaced/Blocked Planned Outcomes
61. Deleted-Source Independence
62. Recreated-Source Safety
63. JSON Roundtrip
64. Clone Isolation
65. Validator Purity
66. Projection Purity
67. Persistence Boundary
68. DayFrameState Boundary
69. Profile/Active/Backup Boundary
70. PlanDecision Boundary
71. Tests Added
72. Identity Tests
73. Correction/Retraction Tests
74. Chain Integrity Tests
75. Planned/Unplanned Tests
76. Time Evidence Tests
77. Snapshot Tests
78. Projection Tests
79. No-Missed Regression
80. Public API Audit
81. Persistence Audit
82. Store Audit
83. UI Audit
84. Architectural Alignment Assessment
85. Deviations
86. Discoveries and Deferred Work
87. Recommended Next Task
88. Focused Validation
89. Full Validation
90. Final Completion Determination

---

# 188. Required Matrices

## A. Record Kind Matrix

| Record kind | Outcome field | replacesRecordId | Snapshot | Actual-time evidence |
| ----------- | ------------- | ---------------: | -------: | -------------------: |

## B. Outcome Projection Matrix

| Chain head | Current outcome |
| ---------- | --------------- |

## C. Subject Matrix

| Subject type | DurableOccurrenceReference | Snapshot required | Skip allowed |
| ------------ | -------------------------: | ----------------: | -----------: |

## D. Correction Integrity Matrix

| Condition | Valid? | Result |
| --------- | -----: | ------ |

## E. Time Evidence Matrix

| Outcome | Actual instant | Actual duration/interval | recordedAt |
| ------- | -------------: | -----------------------: | ---------: |

---

# 189. Validation Requirements

Run focused tests for all new execution-domain modules.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Because production domain code is being added, the full repository suite must pass.

Record exact:

* test-file count;
* test count;
* build module count if available.

---

# 190. Completion Criteria

Task 3.2 is complete only when:

* `ExecutionRecord V1` exists as a pure independently versioned domain model;
* `ExecutionRecordId` exists;
* `ExecutionSubjectId` exists;
* both use strict branded UUID-v4 semantics;
* planned and unplanned subjects are explicit;
* planned linkage uses DurableOccurrenceReference V1;
* history does not require current source resolution;
* required frozen historical snapshot exists;
* snapshot/reference family consistency is validated;
* V1 stored outcomes are only completed/partial/skipped;
* unknown is derived;
* missed is absent;
* cancellation is absent;
* userReported provenance is explicit;
* recordedAt is mandatory and distinct from actual time;
* chosen actual-time evidence representation is canonical;
* scheduled times are never copied into actual evidence;
* retroactive reporting is valid;
* impossible future actual-time evidence is rejected deterministically;
* correction creates immutable replacement revision;
* retraction creates immutable retraction revision;
* correction chains are linear;
* branch/cycle/missing/cross-subject corruption is detected;
* correction targets current head;
* current record projection is deterministic;
* OccurrenceOutcome projection is deterministic;
* retraction projects unknown;
* array ordering does not affect projection;
* source deletion does not invalidate records;
* recreated source lifetimes remain distinct;
* omitted/unplaced/blocked planned occurrences may still have execution outcomes;
* unplanned execution is supported;
* unplanned skipped is rejected;
* records are JSON-safe;
* validators/constructors/projections are pure and clone-safe;
* no persistence is added;
* no store authority is added;
* no UI is added;
* no progress/adherence/learning is added;
* Active/Profile/Backup/PlanDecision/DurableOccurrenceReference contracts remain unchanged;
* focused and full validation pass;
* result artifact is complete.

---

# 191. Explicit Non-Goals

Do **not**:

* implement ExecutionHistory persistence;
* add localStorage/IndexedDB storage;
* add store actions;
* add durability status;
* add retry;
* add quarantine/recovery;
* add completion buttons;
* add history UI;
* add progress;
* add adherence;
* add learning;
* add automatic missed;
* add cancelled;
* add percentage completion;
* add quantity metrics;
* add timers;
* add external integrations;
* implement Backup V3;
* change Active V2;
* change Profile V2;
* change Backup V2;
* change PlanDecision V1;
* change DurableOccurrenceReference V1;
* persist old Preview;
* use runtime IDs as historical identity;
* perform unrelated refactors.

---

# 192. Stop Conditions

Stop and report if:

* one-subject-per-planned-occurrence cannot be enforced without a store-level authority decision;
* the historical snapshot cannot be defined safely without unresolved timezone infrastructure;
* actual-time evidence cannot be represented canonically without broader temporal redesign;
* correction-chain validation requires persistence-specific behavior;
* DurableOccurrenceReference V1 lacks information required for safe planned correlation;
* implementing ExecutionRecord requires changing Phase 2 schemas;
* full-suite failures reveal an unrelated architectural defect.

Recommend the narrowest prerequisite/completion task.

---

# 193. Recommended Follow-On Boundary

If Task 3.2 completes successfully, the next task should implement the independent durable history surface while leaving UI/reporting still deferred.

Recommended:

> **Task 3.3 — Implement ExecutionHistory V1 Durable Surface, Recovery, Quarantine, and Store Authority**

That task should include:

* independently versioned history envelope;
* persistence key/storage technology decision;
* load/validate/project;
* entry/component quarantine;
* protected ingress;
* source recheck;
* durability/retry;
* append correction/retraction authority;
* export/clear integration;
* clone-safe subscriptions.

It should not yet add user-facing completion reporting UI unless persistence and reporting must be introduced atomically.

---

# 194. Task Determination

**Authorized:** pure `ExecutionRecord V1` identity, subject identity, planned/unplanned subject semantics, frozen historical snapshot, V1 outcome/provenance/time-evidence model, immutable correction/retraction revisions, strict record/collection validation, correction-chain integrity, deterministic current-record and OccurrenceOutcome projection, constructors, clone/JSON safety, and direct regression coverage.

**Not authorized:** persistence, store authority, durability/recovery, completion/history UI, progress/adherence/learning, Backup V3, timers/integrations, or changes to accepted Phase 2 durable contracts.

The governing implementation principle is:

> **An ExecutionRecord is an immutable assertion about reality, not a mutation of the plan. Corrections create new evidence, retractions restore uncertainty, and the current outcome is a deterministic projection of that evidence—not a guess derived from schedule state or the passage of time.**

---

# 195. Final Completion Statement

**Task 3.2 is complete when DayFrame has a pure, independently versioned `ExecutionRecord V1` domain model with distinct execution-subject and immutable record-revision identities; explicit planned and unplanned subjects; lifetime-safe optional DurableOccurrenceReference correlation plus frozen historical snapshot context; stored completed, partial, and skipped assertions with unknown derived only from absence/retraction and no V1 missed/cancelled inference; explicit user-reported provenance, canonical recorded-time and bounded optional actual-time evidence; immutable correction and retraction revisions with linear-chain, current-head, uniqueness, referential-integrity, and temporal validation; deterministic current-record and OccurrenceOutcome projection independent of input ordering and current source resolvability; safe handling of deleted/recreated sources and omitted/unplaced/blocked planned occurrences; pure constructors, strict validators, JSON roundtrip, clone isolation, and direct regression coverage; full repository validation; and no execution-history persistence, store authority, UI, progress, adherence, learning, Backup V3, timer/integration, or Phase 2 schema change.**

