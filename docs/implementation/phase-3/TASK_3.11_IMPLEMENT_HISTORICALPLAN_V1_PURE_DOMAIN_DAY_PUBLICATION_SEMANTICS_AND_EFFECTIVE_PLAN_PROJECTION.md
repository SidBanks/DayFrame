# Task 3.11 — Implement HistoricalPlan V1 Pure Domain, Day-Publication Semantics, and Effective-Plan Projection

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded pure-domain implementation task.

Task 3.11 converts the accepted Task 3.9 HistoricalPlan architecture into a fully executable, deterministic, persistence-independent domain model.

This task includes:

* `HistoricalPlanSurface V1` pure domain types;
* `PlanPublicationBatch V1`;
* `HistoricalPlanDayPublication V1`;
* `HistoricalPlannedOccurrenceSnapshot V1`;
* publication/batch identity;
* exact user-day authority semantics;
* scheduled/unplaced/omitted/blocked state representation;
* lifetime-safe occurrence identity;
* frozen historical plan context;
* complete-day authority;
* immutable publication semantics;
* semantic fingerprinting;
* identical-publication deduplication rules;
* publication-batch validation;
* day-publication validation;
* latest-publication projection;
* `asOf` effective historical plan projection;
* overlapping publication resolution;
* absence/removal semantics;
* clone isolation;
* JSON roundtrip;
* direct regression coverage.

It does **not** implement:

* IndexedDB persistence;
* HistoricalPlan runtime/store authority;
* publication-on-Preview generation;
* durability/retry;
* recovery/quarantine;
* historical coverage UI;
* historical follow-through;
* Progress;
* Goals;
* learning;
* Backup V3;
* ExecutionHistory migration.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 3.9 and 3.10 are complete and accepted;
6. review:

   * `CHECKPOINT_Phase_3_Historical_Plan_Ledger_Semantics.md`;
   * `ADR_HISTORICAL_PLAN_LEDGER_AND_DAY_PUBLICATION_SEMANTICS.md`;
   * Task 3.9 result;
   * `DurableOccurrenceReference V1`;
   * `ExecutionHistoricalSnapshot V1`;
   * Task 3.4 materialization rules;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.11_IMPLEMENT_HISTORICALPLAN_V1_PURE_DOMAIN_DAY_PUBLICATION_SEMANTICS_AND_EFFECTIVE_PLAN_PROJECTION_RESULT.md`

If the accepted Task 3.9 architecture cannot be represented without modifying Phase 2 identity contracts or `ExecutionRecord V1`, stop and report rather than broadening scope.

---

# 2. Purpose

Task 3.9 established the durable historical-plan architecture:

```text
HistoricalPlanSurface
    ↓
PlanPublicationBatch
    ↓
complete HistoricalPlanDayPublication
    ↓
HistoricalPlannedOccurrenceSnapshot[]
```

The authority unit is a complete semantic user day.

A later publication for the same day becomes operative for that day while prior publications remain immutable history. Absence from the later complete day publication means the occurrence is no longer part of the operative plan.

Task 3.11 makes those semantics executable without introducing persistence.

---

# 3. Governing Architectural Decisions

The following Task 3.9 decisions are fixed:

1. a HistoricalPlan ledger is required;
2. V1 uses complete day publications;
3. publications are append-only immutable history;
4. one Preview generation may create one atomic publication batch;
5. publication boundary is fresh authoritative Preview generation/regeneration;
6. stale Preview never publishes;
7. Try Preview never publishes;
8. Save Setup alone does not publish;
9. first execution report is too late to establish denominator history;
10. day rollover is not a publication trigger;
11. identical latest day publication may be deduplicated;
12. meaningful plan change appends a new publication;
13. latest valid publication per day at/before `asOf` is operative;
14. scheduled/unplaced/omitted/blocked states are preserved;
15. hidden Preview buffer occurrences are excluded;
16. exact source incarnation remains part of occurrence identity;
17. current PlanDecision records are not historical authority;
18. effective replayed plan state is what gets frozen;
19. no fabricated historical backfill;
20. persistence is deferred to Task 3.12.

Do not reopen these.

---

# 4. Architectural Objective

After Task 3.11:

```text
PlanPublicationBatchV1[]
        ↓
validate
        ↓
canonical day publications
        ↓
semantic fingerprint
        ↓
dedup determination
        ↓
effective plan query:
latest publication/day <= asOf
        ↓
HistoricalPlanDayView
```

All operations remain pure.

---

# 5. Required Initial Domain Audit

Before coding, inspect:

* existing branded UUID helpers;
* canonical UTC timestamp helpers;
* `LocalDate`;
* user-day boundary/time types;
* `weekStartsOn` type;
* `DurableOccurrenceReference V1`;
* source-family vocabulary;
* snapshot validation patterns;
* strict exact-key validators;
* clone helpers;
* semantic equality helpers;
* fingerprint/hash utilities if any;
* result-union conventions.

Reuse existing primitives wherever semantically correct.

---

# 6. Module Boundary

Create a dedicated domain area.

Preferred:

`code/src/core/historicalPlan/`

Possible files:

* `historicalPlan.ts`;
* `historicalPlanIdentity.ts`;
* `historicalPlanValidation.ts`;
* `historicalPlanFingerprint.ts`;
* `historicalPlanProjection.ts`;
* tests.

Keep persistence entirely outside this module.

---

# 7. Surface Version

Introduce:

```ts
HISTORICAL_PLAN_SURFACE_VERSION = 1
```

independent from:

* IndexedDB physical version;
* Active/Profile/Backup versions;
* PlanDecision V1;
* DurableOccurrenceReference V1;
* ExecutionRecord V1.

---

# 8. Batch Version

If batch schema is independently versioned, introduce:

```ts
PLAN_PUBLICATION_BATCH_VERSION = 1
```

If nested versioning is unnecessary because surface V1 fully governs it, document the decision explicitly.

Preferred:

> independently version batch and day/snapshot structures where useful for future migration clarity.

---

# 9. `PlanPublicationBatchId`

Introduce a branded UUID-v4 identity.

Requirements:

* canonical lowercase UUID-v4;
* strict validation;
* cryptographically strong allocation;
* allocator injection;
* independent from source IDs;
* independent from execution IDs;
* independent from DurableOccurrenceReference.

---

# 10. Batch Meaning

A `PlanPublicationBatch` means:

> one atomic authoritative publication event produced by one successful fresh Preview generation/regeneration over its requested visible user-day range.

It may contain multiple complete day publications.

---

# 11. `publishedAt`

Every batch requires canonical UTC `publishedAt`.

Meaning:

> when this authoritative plan publication was established.

Not:

* occurrence time;
* Preview range start;
* Save Setup time.

---

# 12. Clock Injection

Constructors use injected clock for deterministic tests.

Validators accept stored historical timestamps directly.

---

# 13. Batch Range

Batch must preserve:

* requested visible start user-day date;
* requested visible end user-day date.

Inclusive.

Hidden planning buffer days are not part of the batch authority.

---

# 14. Batch-Day Completeness

Every requested user day in the batch range should have exactly one `HistoricalPlanDayPublication`.

This includes days with zero planned occurrences.

This is important because an empty complete day still means:

> DayFrame had no published planned occurrences for this day.

---

# 15. Empty Day Publication

Explicitly valid.

Do not omit empty days from a complete batch.

Otherwise absence becomes ambiguous.

---

# 16. Day Publication Identity

Determine whether each day publication needs an independent UUID.

Task 3.9 terminology suggested publication/batch identity.

Preferred V1:

* batch has independent UUID;
* day publication identity is composite:

  * batch ID + user-day date.

This avoids unnecessary ID allocation while remaining uniquely addressable.

If implementation conventions favor explicit DayPublicationId, document why.

---

# 17. Complete Day Authority

A `HistoricalPlanDayPublication` is complete authority for one semantic user day at its batch `publishedAt`.

Therefore:

> absence of an occurrence from that day publication means it is not part of that published plan for the day.

This semantic must be explicit.

---

# 18. Day Fields

At minimum:

* `userDayDate`;
* effective `dayBoundary`;
* frozen `weekStartsOn`;
* historical UTC offset context;
* occurrence snapshots.

Do not depend on current preferences later.

---

# 19. Week-Start

Freeze exact effective `weekStartsOn`.

Task 3.9 specifically adopted this to support future historical week semantics.

---

# 20. Day Boundary

Freeze effective boundary governing the semantic user day.

Use existing canonical local-time representation.

---

# 21. UTC Offset

Freeze numeric UTC offset associated with historical day context.

Define units explicitly, likely minutes.

Validate plausible range.

---

# 22. Timezone

No mandatory IANA zone ID unless existing infrastructure already provides one cleanly.

Do not expand temporal infrastructure.

---

# 23. Historical Planned Occurrence Snapshot

Introduce a dedicated plan snapshot type.

Do not reuse `ExecutionHistoricalSnapshot` blindly.

It may share primitives, but HistoricalPlan publication semantics are distinct.

---

# 24. Snapshot Meaning

A `HistoricalPlannedOccurrenceSnapshot` means:

> one semantic planned occurrence as represented by this complete day publication.

It contains planning facts only.

No execution evidence.

---

# 25. Snapshot Identity

Every snapshot must contain:

`DurableOccurrenceReference V1`

or equivalent lifetime-safe planned reference.

No runtime block ID.

---

# 26. Reference Clone

Clone nested DurableOccurrenceReference.

No shared mutable references.

---

# 27. Source Family

Use stable V1 family vocabulary consistent with reportable occurrence semantics.

At minimum:

* template;
* work;
* manualEvent.

Do not add:

* unplanned;
* imported calendar;
* synthetic.

Unplanned execution is not planned history.

---

# 28. Title

Freeze historical display title.

Bounded non-empty string.

---

# 29. Category

Freeze current stable category/type representation where applicable.

Do not invent new taxonomy.

---

# 30. Snapshot User-Day

Every snapshot belongs to the containing day.

If snapshot redundantly stores user-day date, validate equality.

Preferred:

* contain it if semantic portability requires;
* otherwise inherit from day publication.

Task result must document.

---

# 31. Plan State Union

Implement exactly:

```ts
type HistoricalPlanState =
  | "scheduled"
  | "unplaced"
  | "omitted"
  | "blocked";
```

No:

* missed;
* completed;
* skipped;
* partial;
* unknown;
* removed.

Removal is represented by absence from a later complete publication.

---

# 32. Scheduled State

Requires canonical UTC planned interval:

* start;
* end.

End > start.

---

# 33. Scheduled Interval

This is planned geometry.

Never actual execution evidence.

---

# 34. Scheduled Duration

If needed, derive from start/end.

Do not redundantly persist duration unless architecture requires it.

---

# 35. Unplaced State

No scheduled interval.

Represents:

> occurrence existed in operative plan demand but had no placement.

---

# 36. Omitted State

No scheduled interval.

Represents:

> effective accepted omission.

No PlanDecision ID persisted.

---

# 37. Blocked State

No scheduled interval unless Task 3.9 explicitly authorized otherwise.

Represents:

> accepted hard placement could not be realized.

Do not store requested placement as if scheduled.

---

# 38. Requested Blocked Placement

If current accepted snapshot schema has no field for requested-but-blocked time, do not introduce one casually.

Task 3.9 accepted state-only preservation for V1.

---

# 39. Source Lifetime

Reference must preserve exact source incarnation.

No same-readable-ID equivalence.

---

# 40. Same Occurrence Across Publications

Same semantic occurrence across plan revisions:

* same DurableOccurrenceReference;
* different batch/day publication context;
* potentially different title/category/state/interval.

This is valid.

---

# 41. Duplicate Reference Within One Day

Invalid.

One complete day publication may contain a given DurableOccurrenceReference at most once.

---

# 42. Cross-Day Duplicate Reference

Audit reference semantics.

If one semantic occurrence belongs to one user day, the exact same reference should not appear in two days within the same batch.

Preferred invariant:

> invalid.

Direct test.

---

# 43. Canonical Occurrence Ordering

Publication authority must not depend on array order.

Define canonical snapshot ordering for:

* fingerprinting;
* JSON readability;
* deterministic clone/projection.

Preferred:

* canonical durable-reference semantic key;
* fallback family/title only if needed after primary identity.

No runtime ID.

---

# 44. Snapshot Equality

Define semantic equality over:

* reference;
* family;
* title;
* category;
* plan state;
* interval where scheduled.

Ignore array position.

---

# 45. Day Semantic Equality

Two day publications are semantically identical when:

* same user-day context;
* same occurrence set;
* every snapshot semantically equal.

Batch ID and `publishedAt` do not affect semantic day equality.

This supports dedup.

---

# 46. Canonical Fingerprint

Implement a deterministic semantic fingerprint for one day publication.

Requirements:

* stable across array ordering;
* excludes batch ID;
* excludes `publishedAt`;
* includes all historical-plan semantic fields;
* includes exact DurableOccurrenceReference;
* includes user-day context;
* includes plan states/intervals.

---

# 47. Fingerprint Algorithm

Use a stable cryptographic or deterministic canonical hash.

If browser crypto would complicate pure synchronous APIs, a deterministic canonical serialized string may serve as a semantic fingerprint.

Task result must justify.

Do not use unstable `JSON.stringify` over arbitrary object key order without canonicalization.

---

# 48. Fingerprint Is Not Authority

Fingerprint is derived.

It may support dedup/verifications.

Do not use as domain identity.

---

# 49. Identical Publication Dedup Rule

Given a candidate day publication and latest existing operative publication for same day:

if semantic fingerprint equal:

> candidate is duplicate/no-op for that day.

No new day revision needed.

---

# 50. Batch With Mixed Dedup

One generation batch may cover multiple days:

* some unchanged;
* some changed.

Task 3.9 says one Preview generation batch commits atomically.

Task 3.11 must define candidate batch projection.

Preferred:

> candidate batch includes complete generated day facts for all requested days, while persistence may choose whether to store unchanged day revisions.

But atomic historical batch semantics may be cleaner if stored batch records all days.

This requires explicit decision.

---

# 51. Recommended Batch Dedup Semantics

Strongly consider:

* batch exists only if at least one requested day changed;
* batch contains all requested day publications as the authoritative atomic snapshot for that generation;
* identical generation to latest state for every requested day is complete no-op.

This preserves “one batch = one generation publication” while keeping complete range context.

Evaluate against storage duplication.

---

# 52. Alternative Changed-Days-Only Batch

Could reduce storage but makes generation batch incomplete.

Task 3.9 chose atomic generation batches of complete day publications.

Prefer complete requested range.

---

# 53. Batch Semantic Equality

Two batches are semantically equal if:

* same requested range;
* every day semantically equal.

Ignore batch ID/publishedAt.

---

# 54. Batch Constructor

Provide pure constructor conceptually:

```ts
createPlanPublicationBatch(...)
```

Owns:

* batch ID;
* publishedAt;
* validation;
* canonical day ordering.

Inputs are already-materialized historical plan facts.

No Preview dependency inside core domain if avoidable.

---

# 55. Preview Projection Boundary

Task 3.11 may also implement a pure projection helper from a **publication candidate input** into domain snapshots.

But do not import React/store.

---

# 56. Preview-to-Domain Projection

Determine whether this belongs in 3.11 or 3.12.

Recommended:

> 3.11 may define pure publication projection from explicit generated plan data because publication semantics are domain logic.

Persistence wiring remains 3.12.

---

# 57. Projection Inputs

Likely explicit:

* requested range;
* fresh authoritative Preview result;
* effective preferences;
* current authored/source lineage;
* applied PlanDecision result context where needed.

Reuse Task 3.4 materialization logic where possible.

Do not duplicate lineage rules.

---

# 58. Reportability Versus Plan History

HistoricalPlan should record supported planned authority facts, not only currently reportable execution targets.

But imported/synthetic items without durable identity cannot be historical ledger entries safely.

Define supported families explicitly.

---

# 59. Publication Candidate States

Projection must derive:

* scheduled;
* unplaced;
* omitted;
* blocked.

Use same semantic occurrence identity regardless of state.

---

# 60. Scheduled Candidate

From fresh authoritative Preview scheduled output.

---

# 61. Unplaced Candidate

From fresh authoritative Preview unplaced output.

---

# 62. Omitted Candidate

From applicable replay result / accepted omission authority.

---

# 63. Blocked Candidate

From blocked accepted placement replay context.

---

# 64. Work Candidate

Scheduled anchored work occurrence.

---

# 65. Manual Candidate

Scheduled manual event.

---

# 66. Unsupported Candidate

Imported/synthetic items excluded with explicit projection diagnostics, if needed.

Do not invent durable identity.

---

# 67. Hidden Buffer Exclusion

Only requested visible user days become publications.

No ±1 engine buffer occurrence outside requested scope.

---

# 68. Cross-Boundary Occurrence

An occurrence partially crossing into another calendar day belongs to its semantic user day exactly once.

---

# 69. Empty Requested Day

Generate explicit empty day publication.

Mandatory.

---

# 70. Try Preview Input

Pure projection should reject Try Preview candidate.

---

# 71. Stale Preview Input

Reject stale.

---

# 72. No Preview

Reject.

---

# 73. Fresh Authoritative Preview

Accept.

---

# 74. Publication Candidate Result

Use explicit result union:

* publicationCandidate;
* noPreview;
* stalePreview;
* tryPreview;
* inconsistentPlanContext;
* invalidInput.

No expected exceptions.

---

# 75. Runtime ID Independence

Runtime IDs may help locate generated blocks but never enter domain snapshot/fingerprint.

Direct test.

---

# 76. PlanDecision IDs

Never persist inside snapshot/batch.

---

# 77. SuggestedFix IDs

Never.

---

# 78. Execution IDs

Never.

---

# 79. Complete Day Validation

A day is valid only if:

* date canonical;
* boundary valid;
* weekStartsOn valid;
* offset valid;
* snapshots valid;
* no duplicate durable references;
* every scheduled interval is valid;
* every occurrence semantically belongs to that day.

---

# 80. Semantic Day Membership

Determine how to validate reference/day coordinate agreement for:

* template recurrence;
* work occurrence;
* manual event.

Use existing DurableOccurrenceReference semantics.

Do not infer from title/interval.

---

# 81. Day Membership Failure

Return explicit validation reason.

---

# 82. Batch Validation

A batch is valid only if:

* version supported;
* ID valid;
* publishedAt canonical;
* range valid;
* day publications exactly cover every date in range;
* no duplicate day dates;
* days sorted/canonicalizable;
* each day valid.

---

# 83. Missing Day In Range

Invalid.

---

# 84. Extra Day Outside Range

Invalid.

---

# 85. Duplicate Day

Invalid.

---

# 86. Empty Range

Invalid.

---

# 87. Batch Range Maximum

Do not impose arbitrary product maximum unless Preview already has one.

Reuse existing Preview-range validation if appropriate.

---

# 88. Publication Immutability

Constructors return clone-isolated plain objects.

No mutation APIs.

Revisions create new batch/day publications.

---

# 89. Collection Validation

Provide validation for:

`PlanPublicationBatchV1[]`

Requirements:

* unique batch IDs;
* strict batch validation;
* canonical timestamp rules;
* no identity collision.

Do not require chronological array ordering.

---

# 90. Duplicate Batch ID

Invalid globally.

---

# 91. Same `publishedAt`

Two distinct batches may theoretically share timestamp.

Do not rely on timestamp uniqueness.

Need deterministic tie policy for effective projection.

---

# 92. Effective Projection Tie

Task 3.9 says latest valid day publication with `publishedAt <= asOf`.

If two batches have same `publishedAt` and both cover same day with differing plan:

this is ambiguous.

V1 must forbid or explicitly resolve.

Preferred:

> invalid collection for same-day differing publications at identical publishedAt.

If semantically identical, duplicate may be harmless but IDs differ.

Define.

---

# 93. Deterministic Tie Rule

Avoid lexical UUID winner.

Prefer structural invalidity over arbitrary authority.

---

# 94. Effective Day Projection

Implement pure:

```ts
getEffectiveHistoricalPlanDay({
  batches,
  userDayDate,
  asOf
})
```

or equivalent.

Returns latest valid publication at or before `asOf`.

---

# 95. `asOf`

Canonical UTC instant.

No hidden `Date.now()`.

---

# 96. No Publication

Return explicit:

* unavailableNoPublication.

Do not infer empty plan.

---

# 97. Corrupt Collection

Pure collection input is expected valid after validation.

Projection over invalid collection should return explicit invalid result rather than guess.

---

# 98. Latest Publication Selection

Order by:

1. `publishedAt`;
2. no arbitrary tie winner.

---

# 99. Day Absence In Later Batch

Only relevant if later batch covers that day.

Because batches explicitly contain every day in their requested range, latest day publication is complete authority.

---

# 100. Occurrence Removal

Earlier day:

* Workout present.

Later day publication:

* Workout absent.

Effective later plan:

* Workout absent.

No tombstone required.

Mandatory test.

---

# 101. Occurrence Addition

Later day publication adds occurrence.

Effective later plan includes it.

---

# 102. State Change

Scheduled → omitted/unplaced/blocked/etc.

Later day publication replaces effective state.

---

# 103. Interval Change

Scheduled 18:00 → 20:00.

Later publication governs after its `publishedAt`.

Earlier remains queryable with earlier `asOf`.

---

# 104. Title/Category Change Same Lifetime

Same reference, changed frozen metadata.

Later publication governs after publication time.

Earlier remains unchanged.

---

# 105. Source Recreation

Different incarnation/reference.

Old and new may coexist historically at different publications.

No merge.

---

# 106. Profile/Backup Lifetimes

Pure domain need not know how they arose.

Reference differences naturally preserve semantics.

---

# 107. Projection Result Clone

Return clone-isolated day publication/view.

Do not leak input object references.

---

# 108. Effective Plan Range Projection

Optionally provide:

```ts
getEffectiveHistoricalPlanRange({
  batches,
  startUserDayDate,
  endUserDayDate,
  asOf
})
```

Useful for future metrics.

Strongly recommended if low-risk.

---

# 109. Range Projection Semantics

Each day independently selects latest publication at/before `asOf`.

Some days may be unavailable.

Do not replace unavailable with empty.

---

# 110. Range Result

Preserve per-day availability/gaps.

Potential:

```text
availableDays
missingDays
```

This will matter for historical denominator completeness.

---

# 111. Historical Coverage Gap

No publication for a day means:

> unknown historical plan.

Not:

> empty plan.

Mandatory.

---

# 112. Gap Propagation

Range projection must retain missing days explicitly.

---

# 113. Ledger Start Date

Pure domain does not need global start metadata if absence remains explicit.

Could be derived from earliest publication.

No extra authority needed.

---

# 114. Backfill

No constructor/helper that fabricates earlier publications from current scheduler.

Audit.

---

# 115. Publication At Adoption

Future 3.12 may publish current fresh Preview prospectively.

No pure backfill API.

---

# 116. Plan Snapshot Reuse With Execution

Do not make execution snapshot equal by type.

Provide explicit conversion helper only if semantically safe.

Probably defer.

---

# 117. HistoricalExecutionTarget Future Integration

Flag potential future helper:

HistoricalPlan snapshot → HistoricalExecutionTarget.

Do not implement unless trivial and clearly safe.

---

# 118. Fingerprint Canonicalization

Canonical representation should sort:

* day snapshots by durable-reference key;
* object keys deterministically.

No dependence on insertion order.

---

# 119. DurableReference Canonical Key

If no canonical serializer exists, implement one carefully using exact versioned fields.

Do not use opaque runtime object identity.

---

# 120. Fingerprint Collision

If using non-cryptographic string fingerprint, equality can compare canonical strings directly.

If hashing, semantic equality should still be available as definitive comparison.

Fingerprint must not become sole collision-sensitive authority.

---

# 121. Semantic Equality Helper

Implement:

* `areHistoricalPlanDaysSemanticallyEqual(...)`
* maybe batch equivalent.

Recommended.

---

# 122. Batch Dedup Helper

Implement:

```text
classifyPublicationCandidate(existing, candidate)
```

or equivalent:

* identicalNoOp;
* meaningfulPublication.

No persistence.

---

# 123. Latest Existing Comparison

Dedup compares candidate day(s) with latest effective publications immediately before candidate `publishedAt`.

No future publications should exist in normal construction, but pure helper should be deterministic if they do.

---

# 124. Candidate PublishedAt Ordering

A new publication should not normally have `publishedAt` earlier than existing latest batch in the collection.

Determine constructor-level rule.

Preferred:

> domain collection append helper rejects non-monotonic newly appended publication timestamps.

Validator may still accept imported collections with chronological history if timestamps vary.

---

# 125. Append Helper

Optional pure:

```ts
appendPlanPublicationBatch(existing, candidate)
```

Returns:

* appended;
* identicalNoOp;
* invalid;
* nonMonotonicPublicationTime.

This is useful for future persistence/store authority.

Strongly recommended.

---

# 126. Append Does Not Mutate Input

Mandatory.

---

# 127. Append Canonical Ordering

Return canonical chronological collection if appropriate.

But authority does not depend on storage array order.

---

# 128. Immutable Collection History

No update/delete ordinary helper.

Historical corrections are deferred.

---

# 129. Physical Deletion

No domain ordinary operation.

Full clear/privacy later at persistence layer.

---

# 130. Day-Level Corruption Boundary

Task 3.9 identified day publication as smallest complete component.

Pure validation should support validating one day publication independently.

This prepares 3.12 quarantine.

---

# 131. Batch Atomicity Semantics

Even though days can be validated independently, one batch is one publication event.

Future persistence must commit all batch components atomically.

Domain model should preserve batch membership.

---

# 132. Corrupt One Day In Batch

At pure validation:

* entire batch invalid as a publication.

Future quarantine may preserve raw day/batch evidence separately.

Do not salvage partial batch as authoritative.

This is important because batch generation was atomic.

---

# 133. Publication-Level Fingerprint

Optional batch fingerprint over:

* range;
* canonical day fingerprints.

Useful for verification.

Recommended if low-risk.

---

# 134. Batch Fingerprint Excludes ID/Time

Semantic equality only.

---

# 135. Validation Error Codes

At minimum consider:

* unsupportedVersion;
* invalidBatchId;
* invalidPublishedAt;
* invalidRange;
* missingDay;
* extraDay;
* duplicateDay;
* invalidDayContext;
* invalidOccurrence;
* duplicateOccurrenceReference;
* crossDayDuplicateReference;
* sourceFamilyMismatch;
* invalidScheduledInterval;
* invalidPlanStateShape;
* ambiguousPublishedAtTie.

Stable core codes, no UI prose.

---

# 136. Strict Exact-Key Validation

Reject unknown keys.

Nested shapes strict.

No accidental forward acceptance.

---

# 137. Unsupported Versions

Explicit unsupported result.

Do not reinterpret.

---

# 138. Snapshot Family/Reference Consistency

Reuse DurableOccurrenceReference family semantics.

Examples:

* template reference → template snapshot;
* work reference → work;
* manual event → manualEvent.

---

# 139. Unsupported Reference Family

Reject.

Do not quarantine in pure domain; quarantine belongs future persistence.

---

# 140. Scheduled Interval User-Day Consistency

An overnight scheduled interval may cross calendar midnight.

Do not require both instants to fall on same calendar date.

Validate semantic membership via user-day/reference context.

---

# 141. Day Boundary Context

Snapshot/day publication captures enough frozen context for later display/grouping.

---

# 142. Offset Context

Validate without recalculating from current environment.

Historical frozen value is authority.

---

# 143. JSON Shape

All domain records:

* plain objects;
* strings;
* numbers;
* arrays.

No Date, Set, Map, class instances.

---

# 144. JSON Roundtrip

All V1 domain structures roundtrip and revalidate.

---

# 145. Clone Isolation

Required for:

* batch constructor;
* day constructor;
* projection;
* append;
* equality/fingerprint helpers.

No mutation.

---

# 146. Determinism

Equivalent semantic inputs produce equivalent canonical outputs/fingerprints.

IDs/timestamps differ only when newly allocated/injected.

---

# 147. Array Order Independence

Input occurrence order does not affect:

* validation result;
* semantic equality;
* fingerprint;
* effective plan.

---

# 148. Batch Order Independence For Projection

Collection array order does not affect effective projection.

---

# 149. Current Clock Independence

Projection uses explicit `asOf`.

No `Date.now()`.

---

# 150. ID Allocation Audit

Only new batch construction allocates batch ID.

No IDs allocated by:

* validation;
* fingerprint;
* equality;
* projection;
* dedup;
* append no-op.

---

# 151. Time Allocation Audit

Only constructor allocates `publishedAt` via injected clock.

No time generated by retry-like pure operations.

---

# 152. Test — Identity Validation

Canonical UUID-v4 accepted; uppercase/wrong version malformed rejected.

---

# 153. Test — Batch Construction

Injected ID/clock.

Correct range/day membership.

---

# 154. Test — Empty Day

Valid and included.

---

# 155. Test — Missing Day

Invalid.

---

# 156. Test — Extra Day

Invalid.

---

# 157. Test — Duplicate Day

Invalid.

---

# 158. Test — Scheduled Snapshot

Valid with interval.

---

# 159. Test — Scheduled Missing Interval

Invalid.

---

# 160. Test — Unplaced With Interval

Invalid.

---

# 161. Test — Omitted With Interval

Invalid.

---

# 162. Test — Blocked With Interval

Invalid.

---

# 163. Test — Duplicate Reference Same Day

Invalid.

---

# 164. Test — Cross-Day Duplicate Reference

According to adopted invariant.

---

# 165. Test — Family/Reference Mismatch

Invalid.

---

# 166. Test — Overnight Scheduled

Valid.

Correct day authority.

---

# 167. Test — WeekStartsOn Frozen

Roundtrip preserved.

---

# 168. Test — Offset Frozen

Roundtrip preserved.

---

# 169. Test — Fingerprint Order Independence

Mandatory.

---

# 170. Test — Fingerprint Semantic Change

Title/category/state/interval/reference change alters semantic fingerprint.

---

# 171. Test — ID/PublishedAt Excluded From Day Fingerprint

Mandatory.

---

# 172. Test — Identical Day Dedup

No-op.

---

# 173. Test — Meaningful Day Change

Requires publication.

---

# 174. Test — Entire Batch Identical

No-op if adopted.

---

# 175. Test — Mixed Changed/Unchanged Days

According to adopted complete-batch semantics.

---

# 176. Test — Latest Publication Projection

Later batch wins.

---

# 177. Test — Earlier `asOf`

Earlier batch returned.

---

# 178. Test — No Publication

Explicit unavailable.

---

# 179. Test — Occurrence Removal By Absence

Mandatory.

---

# 180. Test — Occurrence Addition

Mandatory.

---

# 181. Test — State Change

Mandatory.

---

# 182. Test — Interval Revision

Mandatory.

---

# 183. Test — Same-Lifetime Metadata Change

Earlier snapshot unchanged; later current as-of later publication.

---

# 184. Test — Recreated Lifetime

Distinct references.

---

# 185. Test — Equal `publishedAt` Conflict

Invalid/ambiguous according to adopted rule.

---

# 186. Test — Range Projection Gaps

Missing day remains unavailable.

---

# 187. Test — Range Projection Mixed Availability

Some days available, some missing.

---

# 188. Test — Hidden Buffer Exclusion

If Preview projection helper included.

---

# 189. Test — Fresh Preview Candidate

If projection included.

---

# 190. Test — Stale Preview Rejection

If projection included.

---

# 191. Test — Try Preview Rejection

If projection included.

---

# 192. Test — Omitted Candidate

Correct state.

---

# 193. Test — Blocked Candidate

Correct state/no fictional interval.

---

# 194. Test — Unplaced Candidate

Correct.

---

# 195. Test — Work Candidate

Correct.

---

# 196. Test — Manual Candidate

Correct.

---

# 197. Test — Runtime ID Independence

Mandatory if projection included.

---

# 198. Test — PlanDecision ID Absence

Shape audit.

---

# 199. Test — Execution ID Absence

Shape audit.

---

# 200. Test — JSON Roundtrip

Batch/day/snapshot.

---

# 201. Test — Clone Isolation

Mandatory.

---

# 202. Test — Non-Mutation

Validation/projection/append/fingerprint do not mutate inputs.

---

# 203. Test — Append No-Op No Allocation

Mandatory if append helper.

---

# 204. Test — Append Changed Batch

New collection returned.

---

# 205. Test — Non-Monotonic Append

According to adopted rule.

---

# 206. No Persistence

No IndexedDB import.

No localStorage.

No store.

No durability status.

---

# 207. No Historical Metrics

None.

---

# 208. No ExecutionHistory Join Implementation

Pure reference correlation helper may exist, but no metrics.

---

# 209. No UI

None.

---

# 210. No Backup

No Backup V3.

---

# 211. No ExecutionHistory Migration

None.

---

# 212. No PlanDecision Schema Change

None.

---

# 213. No DurableOccurrenceReference Change

None.

---

# 214. No ExecutionRecord Change

None.

---

# 215. Expected Production Files

Likely:

* `code/src/core/historicalPlan/historicalPlan.ts`;
* `code/src/core/historicalPlan/historicalPlanIdentity.ts`;
* `code/src/core/historicalPlan/historicalPlanValidation.ts`;
* `code/src/core/historicalPlan/historicalPlanFingerprint.ts`;
* `code/src/core/historicalPlan/historicalPlanProjection.ts`;
* tests.

Potential narrow reuse/refactor:

* shared durable-reference canonical key helper;
* shared frozen-plan snapshot primitive.

Avoid broad refactors.

---

# 216. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.11_IMPLEMENT_HISTORICALPLAN_V1_PURE_DOMAIN_DAY_PUBLICATION_SEMANTICS_AND_EFFECTIVE_PLAN_PROJECTION_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Task 3.9 Contract
4. Initial Domain Audit
5. Files Changed
6. Module Boundary
7. Surface Version
8. Nested Versioning Determination
9. PlanPublicationBatchId
10. Batch Meaning
11. publishedAt
12. Batch Range
13. Empty-Day Semantics
14. Day Publication Identity
15. Complete-Day Authority
16. Frozen Day Context
17. weekStartsOn
18. Day Boundary
19. UTC Offset
20. HistoricalPlannedOccurrenceSnapshot
21. Reference Identity
22. Source Family
23. Title/Category
24. Plan State Union
25. Scheduled State
26. Unplaced State
27. Omitted State
28. Blocked State
29. Source Lifetime
30. Same Occurrence Across Publications
31. Duplicate Reference Rules
32. Canonical Ordering
33. Snapshot Semantic Equality
34. Day Semantic Equality
35. Fingerprint Design
36. Fingerprint Authority Boundary
37. Identical Day Dedup
38. Batch Dedup Semantics
39. Batch Constructor
40. Preview Projection Determination
41. Candidate Projection Inputs
42. Scheduled/Unplaced/Omitted/Blocked Projection
43. Work/Manual Projection
44. Unsupported Families
45. Hidden Buffer Exclusion
46. Fresh/Stale/Try Boundary
47. Runtime-ID Boundary
48. PlanDecision/SuggestedFix/Execution ID Boundaries
49. Day Validation
50. Batch Validation
51. Day Coverage Validation
52. Duplicate Day/Occurrence Validation
53. Equal publishedAt Conflict Rule
54. Collection Validation
55. Effective Day Projection
56. asOf Semantics
57. Occurrence Removal By Absence
58. Occurrence Addition
59. State Revision
60. Interval Revision
61. Metadata Revision
62. Effective Range Projection
63. Gap Semantics
64. Backfill Prohibition
65. Append/Dedup Helper
66. Publication Immutability
67. Day-Level Corruption Boundary
68. Batch Atomicity Semantics
69. Validation Error Taxonomy
70. Exact-Key Validation
71. JSON Roundtrip
72. Clone Isolation
73. Determinism
74. ID/Time Allocation Audit
75. Tests Added
76. Identity/Construction Tests
77. Day/Batch Validation Tests
78. Snapshot State Tests
79. Fingerprint/Dedup Tests
80. Projection/AsOf Tests
81. Removal/Revision Tests
82. Gap Tests
83. Preview-Candidate Tests, if implemented
84. JSON/Clone/Purity Tests
85. No-Persistence Audit
86. No-Metrics Audit
87. No-UI Audit
88. No-Backup Audit
89. Architectural Alignment Assessment
90. Deviations
91. Discoveries and Deferred Work
92. Recommended Task 3.12
93. Focused Validation
94. Full Validation
95. Final Completion Determination

---

# 217. Required Matrices

## A. Plan State Matrix

| State | Interval required? | Meaning |
| ----- | -----------------: | ------- |

## B. Publication Authority Matrix

| Condition | Historical publication allowed? |
| --------- | ------------------------------: |

Cover:

* fresh authoritative;
* stale;
* Try;
* no Preview.

## C. Dedup Matrix

| Latest day | Candidate day | Result |
| ---------- | ------------- | ------ |

Cover:

* identical;
* interval changed;
* state changed;
* occurrence added;
* occurrence removed;
* metadata changed.

## D. Effective Projection Matrix

| Publications for day | asOf | Result |
| -------------------- | ---- | ------ |

## E. Identity Matrix

| Concept | Identity |
| ------- | -------- |

Include:

* batch;
* day publication;
* planned occurrence;
* same occurrence across revisions.

---

# 218. Validation Requirements

Run focused tests for all new HistoricalPlan domain modules.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The full repository suite must pass.

Record exact:

* test-file count;
* test count;
* build module count.

---

# 219. Completion Criteria

Task 3.11 is complete only when:

* HistoricalPlan V1 exists as a pure domain model;
* publication batches have independent identity and canonical `publishedAt`;
* requested visible user-day range is explicit;
* every day in a batch has one complete day publication, including empty days;
* complete-day authority semantics are executable;
* frozen day boundary/week-start/offset context is preserved;
* historical planned occurrence snapshots are lifetime-safe;
* source family/title/category are frozen;
* scheduled/unplaced/omitted/blocked states are strict;
* scheduled intervals are canonical and real;
* non-scheduled states cannot carry fictional intervals;
* duplicate durable references are rejected;
* batch/day exact-key validation is strict;
* canonical ordering is deterministic;
* semantic equality is independent of ID/time and input ordering;
* deterministic fingerprint/dedup logic exists;
* identical publication candidates can be recognized without new semantic history;
* meaningful plan changes produce distinct semantic publications;
* effective day projection selects latest publication at/before explicit `asOf`;
* equal-time conflicting authority cannot be resolved arbitrarily;
* occurrence removal is represented by absence from later complete day publication;
* additions/state/interval/metadata revisions are handled;
* range projection preserves missing publication days as gaps;
* no historical plan is fabricated from missing data;
* source recreation does not retarget;
* projection/fingerprint/validation are pure and clone-safe;
* no persistence is introduced;
* no HistoricalPlan store/durability is introduced;
* no metrics/UI/Backup/ExecutionHistory migration is introduced;
* no accepted Phase 2/ExecutionHistory durable schema changes occur;
* full validation passes;
* result artifact is complete.

---

# 220. Explicit Non-Goals

Do **not**:

* persist HistoricalPlan;
* open IndexedDB;
* add HistoricalPlan store authority;
* publish on Preview generation;
* add durability/retry;
* add quarantine/recovery;
* implement historical coverage/follow-through;
* implement Progress;
* implement Goals;
* implement learning;
* implement Backup V3;
* migrate ExecutionHistory;
* add UI;
* persist old Preview objects;
* fabricate backfill;
* change DurableOccurrenceReference;
* change ExecutionRecord;
* change ExecutionHistory;
* change PlanDecision;
* add imported-calendar identity;
* perform unrelated refactors.

---

# 221. Stop Conditions

Stop and report if:

* complete-day authority cannot be represented without a new identity primitive;
* DurableOccurrenceReference lacks enough semantic day linkage to validate snapshots;
* equal-`publishedAt` conflict cannot be governed safely;
* blocked/omitted/unplaced facts cannot be represented without changing accepted snapshot semantics;
* fingerprinting cannot be made deterministic without an unacceptable runtime dependency;
* Preview-to-publication projection requires broad engine changes;
* day membership cannot be validated safely with current temporal/reference helpers;
* batch completeness cannot be established from requested Preview range;
* implementation requires persistence behavior;
* full-suite failures reveal an unrelated architectural defect.

Recommend the narrowest corrective/prerequisite task.

---

# 222. Recommended Follow-On Boundary

If Task 3.11 completes successfully, the next task should make HistoricalPlan durable using the Task 3.10 IndexedDB foundation.

Recommended:

> **Task 3.12 — Implement HistoricalPlan V1 IndexedDB Persistence, Publication Authority, Recovery, and Preview Publication Wiring**

That task should include:

* HistoricalPlan object stores/indexes;
* publication batch atomic persistence;
* runtime authority;
* desired durable condition;
* retry;
* latest-day/as-of indexed reads;
* publication dedup;
* fresh Preview publication wiring;
* stale/Try exclusion;
* protected ingress;
* batch/day corruption handling;
* export/clear;
* no fabricated backfill;
* coverage-gap semantics.

It should not yet implement historical follow-through UI.

---

# 223. Task Determination

**Authorized:** pure HistoricalPlan V1 domain types, publication-batch/day identity and semantics, complete-day authority, frozen historical snapshots, scheduled/unplaced/omitted/blocked states, strict validation, canonical ordering, semantic fingerprinting/deduplication, immutable append semantics, latest-day/as-of projection, range projection with explicit gaps, and direct regression coverage.

**Not authorized:** IndexedDB persistence, publication wiring, historical metrics, Goals, learning, Backup V3, ExecutionHistory migration, UI, or changes to accepted Phase 2/ExecutionHistory durable contracts.

The governing domain principle is:

> **A HistoricalPlan publication records what DayFrame actually published as the operative plan for a complete user day. Later publications may supersede that plan, but they never rewrite the earlier publication, and absence of historical publication remains uncertainty rather than an invitation to reconstruct the past.**

---

# 224. Final Completion Statement

**Task 3.11 is complete when DayFrame has a pure, independently versioned HistoricalPlan V1 domain model with immutable atomic PlanPublicationBatch semantics, complete HistoricalPlanDayPublication authority for every requested user day including empty days, lifetime-safe HistoricalPlannedOccurrenceSnapshot identity and frozen context, strict scheduled/unplaced/omitted/blocked state shapes, deterministic canonical ordering, semantic equality and fingerprinting independent of publication IDs/timestamps and input order, explicit identical-publication deduplication, strict batch/day/reference validation, immutable append semantics, deterministic latest-day and range effective-plan projection at an explicit `asOf`, occurrence addition/removal/state/interval/metadata revision behavior, explicit historical gaps rather than fabricated empty plans, source-lifetime safety, JSON/clone/purity guarantees, and comprehensive regression coverage; when no IndexedDB persistence, runtime HistoricalPlan authority, Preview publication wiring, historical metrics, Goal system, learning system, Backup V3, ExecutionHistory migration, or unrelated production behavior is introduced; and when the full repository validation suite passes.**
