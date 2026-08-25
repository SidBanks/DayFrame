# Task 6.3C — HistoricalPlan V2 Timing Provenance and V1 Compatibility

## Status

Ready for implementation.

## Phase

Phase 6 — Platform Maturity

## Task Type

HistoricalPlan occurrence-schema evolution, immutable timing-provenance preservation, V1/V2 compatibility, publication materialization, strict validation, fingerprint evolution, clone/serialization integrity, IndexedDB compatibility, Backup V6 roundtrip, restore compatibility, republication cutoff semantics, regression testing, governance, and Task 6.3 prerequisite closure.

**No Today read model, Today UI, user-day temporal remediation, recommendation behavior, or new Backup envelope is authorized.**

---

# 1. Objective

Implement the accepted HistoricalPlan timing-provenance architecture from Task 6.3A.

New HistoricalPlan publications must preserve whether every planned occurrence was authored/materialized as:

```text
allDay
```

or:

```text
timed
```

through a new:

```text
HistoricalPlannedOccurrenceSnapshotV2
```

with required timing provenance:

```text
timing:
    { kind: "allDay" }
    |
    { kind: "timed" }
```

Existing V1 occurrences remain valid and immutable.

For V1:

```text
timing semantics = unavailableLegacy
```

Never infer or backfill missing historical timing intent from:

* current manual-event authority;
* Active;
* Preview;
* current schedule state;
* Goal;
* any reconstructed interval heuristic.

At completion:

* new publications distinguish all-day from timed occurrences;
* identical intervals may still carry different timing intent;
* legacy V1 remains accepted;
* V1 absence remains epistemically explicit;
* V1 and V2 survive all persistence/Backup/restore boundaries;
* semantic fingerprints distinguish timing intent;
* republication exposes new timing knowledge only after its publication cutoff;
* Backup V6 remains the expected envelope unless implementation proves otherwise.

Task 6.3 may resume only after Task 6.3C completes successfully.

---

# 2. Governing ADR

Task 6.3A accepted:

> **ADR — HistoricalPlan All-Day Occurrence Provenance**

The governing decision is:

```text
HistoricalPlannedOccurrenceSnapshotV2

timing:
    { kind: "allDay" }
    |
    { kind: "timed" }
```

V1 remains unchanged.

Missing timing provenance in V1 means:

```text
unavailableLegacy
```

not:

```text
timed
```

and not:

```text
allDay
```

Do not reopen this semantic decision.

---

# 3. Governing Historical Principle

> **HistoricalPlan preserves what DayFrame knew at publication time.**

It must never reconstruct missing authored intent from current state.

Therefore:

```text
legacy V1
24-hour interval
no timing tag

→ timing intent unknown
```

even if the current corresponding manual event is now marked all-day.

---

# 4. Governing Versioning Principle

Prefer the smallest semantic version boundary.

Expected:

```text
HistoricalPlannedOccurrenceSnapshotV1
HistoricalPlannedOccurrenceSnapshotV2

HistoricalPlannedOccurrenceSnapshot =
    V1 | V2
```

Do not mechanically bump:

* HistoricalPlan surface version;
* batch version;
* day version;
* frozen Goal provenance version;
* Backup version.

Only widen a surrounding version if implementation evidence proves its existing contract cannot truthfully transport a versioned occurrence union.

---

# 5. Governing Backup Principle

Task 6.3A concluded that Backup V6 generically transports HistoricalPlan.

Strong expectation:

> **No Backup V7 is required.**

Task 6.3C must prove this through validator/roundtrip behavior.

If Backup V6 cannot safely represent V2 because of an actual envelope invariant, stop and report rather than silently bumping it.

---

# 6. Explicit Scope

Implement:

* occurrence snapshot V2 type;
* canonical occurrence V1|V2 union;
* timing tagged union;
* strict V1 validation;
* strict V2 validation;
* union dispatch;
* HistoricalPlan day/batch/surface validators consuming union;
* materialization of new occurrences as V2;
* all-day/timed determination from authoritative publication input;
* semantic fingerprint version/timing inclusion;
* clone helpers;
* JSON roundtrip;
* IndexedDB validation/read/write compatibility;
* HistoricalPlan surface reads;
* publication/republication behavior;
* Backup V6 validation;
* Backup V6 export/import roundtrip;
* restore;
* full-clear regression;
* legacy compatibility;
* V1/V2 mixed-history support;
* cutoff tests;
* exact provenance helpers needed by future Today;
* tests;
* bundle validation;
* governance.

---

# 7. Explicit Non-Goals

Do not implement:

* Task 6.3 Today read model;
* Today UI;
* current/next/later;
* ExecutionHistory overlay;
* additional user-day changes;
* transition context;
* HistoricalPlan migration/backfill;
* V1 rewrite;
* new manual-event authority;
* Goal changes;
* Preview redesign;
* Backup V7 unless mandatory stop condition proves unavoidable;
* all-day display UI;
* historical all-day correction;
* Recommendations;
* Capacity;
* Goal reorientation;
* transition intelligence.

---

# 8. Execution Artifact Rules

Before implementation:

1. verify this Task 6.3C artifact;
2. save immutable project copy;
3. compare supplied/saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 6.3A result;
   * HistoricalPlan All-Day ADR;
   * Task 6.3B result;
   * HistoricalPlan domain types;
   * HistoricalPlan validators;
   * publication materializer;
   * fingerprint code;
   * clone helpers;
   * HistoricalPlan surface/storage;
   * IndexedDB collection adapter;
   * Backup V6;
   * restore translation/composition;
   * Preview/generated scheduled-block shape;
   * manual-event materialization;
   * existing republication tests;
6. do not modify the immutable task artifact.

Create:

`docs/implementation/phase-6/TASK_6.3C_HISTORICALPLAN_V2_TIMING_PROVENANCE_AND_V1_COMPATIBILITY_RESULT.md`

---

# 9. Initial Source Audit

Before code changes, document:

* exact `HistoricalPlannedOccurrenceSnapshotV1` keys;
* current strict validation behavior;
* current discriminant/version field;
* every enclosing validator that assumes snapshot V1;
* current materialization path;
* where `isAllDay` exists immediately before publication;
* whether every occurrence source can truthfully supply all-day/timed distinction;
* current fingerprint normalization;
* clone path;
* IndexedDB read/write validation;
* Backup V6 HistoricalPlan validation;
* restore path;
* republication as-of tests.

Do not implement until all are traced.

---

# 10. Stop Conditions

Stop and report if:

* new publication input cannot truthfully determine timing kind for every V2 occurrence;
* some occurrence family has timing semantics that are neither all-day nor timed;
* the existing occurrence version discriminator cannot safely support V2;
* enclosing V1 day/batch contracts explicitly prohibit versioned occurrence unions;
* Backup V6 cannot transport V2 without violating a versioned envelope invariant;
* restore normalizes away occurrence version/timing;
* IndexedDB reconstruction strips the new tag;
* implementation would require backfilling V1;
* fingerprint compatibility cannot distinguish V1 from explicit V2 timed;
* current plan publication can no longer be deterministic.

Do not collapse unknown cases into timed.

---

# 11. Occurrence V1 Preservation

Do not modify V1's keys or semantics.

V1 remains accepted exactly as currently defined.

Do not add:

```text
timing?
```

to V1.

Task 6.3A rejected this because strict-key validation would mutate V1 semantics.

---

# 12. Occurrence V2

Add a new exact version:

```text
HistoricalPlannedOccurrenceSnapshotV2
```

with all currently required V1 occurrence provenance plus:

```text
version: 2

timing:
    { kind: "allDay" }
    |
    { kind: "timed" }
```

Use actual repository version-field naming.

Do not blindly copy this conceptual shape if the current discriminator differs.

---

# 13. Timing Union

Prefer an explicit tagged union.

Conceptually:

```ts
type HistoricalOccurrenceTimingV2 =
  | { kind: "allDay" }
  | { kind: "timed" };
```

No optional fields.

No nullable timing.

No free-form string.

---

# 14. Timing Strictness

Valid:

```text
{ kind: "allDay" }
{ kind: "timed" }
```

Invalid:

```text
{}
{ kind: "unknown" }
{ kind: "allDay", foo: ... }
null
```

Use exact-key validation consistent with HistoricalPlan.

---

# 15. Canonical Occurrence Union

Introduce or update:

```text
HistoricalPlannedOccurrenceSnapshot =
    HistoricalPlannedOccurrenceSnapshotV1
    |
    HistoricalPlannedOccurrenceSnapshotV2
```

Use throughout readers that can consume historical records generically.

Avoid repeated ad hoc unions.

---

# 16. V1 Timing Coverage Helper

Provide one pure helper if useful:

```text
historicalOccurrenceTimingCoverage(snapshot)
```

Conceptually:

```text
V1
    → unavailableLegacy

V2
    → available
```

Do not require consumers to detect property absence manually.

---

# 17. V2 Timing Resolver

Provide one pure helper if useful:

```text
historicalOccurrenceTimingKind(snapshot)
```

Possible result:

```text
{
    coverage: "available",
    kind: "allDay" | "timed"
}
```

or:

```text
{
    coverage: "unavailableLegacy"
}
```

Use repository conventions.

Do not create a metric.

---

# 18. Publication Input Audit

Trace every occurrence family entering HistoricalPlan publication.

At minimum:

* generated work;
* Sleep/templates;
* other flexible templates;
* manual events;
* imported/synthetic scheduled items if present.

For each determine authoritative timing kind.

---

# 19. Manual Events

Task 6.3A confirmed:

```text
ManualCalendarEvent.allDay
```

is authoritative authored timing intent.

Therefore:

```text
allDay == true
    → timing.kind = "allDay"

allDay == false
    → timing.kind = "timed"
```

for new publications.

---

# 20. Generated Work

Work occurrences are timed unless production semantics explicitly encode an all-day work source.

Audit and document.

Do not assume solely from duration.

---

# 21. Sleep / Block Templates

Generated scheduled blocks from ordinary timed scheduling should be:

```text
timed
```

unless the publication input explicitly carries all-day intent.

Again, determine from source semantics, not interval duration.

---

# 22. Synthetic/Imported Occurrences

If any scheduled occurrence family lacks authoritative timing intent:

stop and report rather than marking it timed by default.

All V2 occurrences must contain truthful timing provenance.

---

# 23. Publication Materialization

New accepted publications should materialize **V2** occurrences.

Do not continue emitting V1 for new plan publications.

V1 becomes legacy-read compatibility only.

---

# 24. V2 and Plan Disposition

Timing provenance must remain independent of plan disposition.

If occurrence snapshots exist for states beyond scheduled, audit whether timing applies to all snapshot variants.

The ADR says:

> independent of plan disposition.

Implement consistently with actual HistoricalPlan shape.

---

# 25. Scheduled Intervals

Preserve exact scheduled:

* startsAt;
* endsAt;

where currently supported.

Timing kind does not replace interval geometry.

---

# 26. All-Day V2

For a new all-day occurrence:

```text
timing.kind = allDay
```

and its interval should already reflect Task 6.3B canonical user-day-wide geometry.

Do not recompute geometry during publication.

HistoricalPlan freezes generated truth.

---

# 27. Timed V2

For a timed occurrence:

```text
timing.kind = timed
```

even if duration happens to equal:

* 24 hours;
* 21 hours;
* 27 hours;
* an entire canonical user-day.

Intent controls tag.

---

# 28. Identical Geometry Distinction

Mandatory fixture:

```text
Occurrence A
same startsAt
same endsAt
timing = allDay

Occurrence B
same startsAt
same endsAt
timing = timed
```

Their semantic fingerprints must differ.

---

# 29. Legacy V1

Mandatory fixture:

```text
same startsAt
same endsAt
version = 1
no timing
```

must differ semantically from both V2 records.

Interpretation:

```text
timing unavailableLegacy
```

---

# 30. Strict Validator Dispatch

Validator should branch by occurrence version.

Conceptually:

```text
version 1
    → validate exact V1 keys

version 2
    → validate exact V2 keys + timing

other
    → reject
```

Do not use permissive optional-key parsing.

---

# 31. Enclosing Day Validation

Update day validation to accept canonical occurrence union.

Do not weaken unrelated strictness.

---

# 32. Enclosing Batch Validation

Same principle.

---

# 33. HistoricalPlan Surface Validation

If top-level surface validation recursively assumes V1, update narrowly.

Do not bump version merely because nested occurrences evolved.

---

# 34. Version-Bump Evidence

At implementation completion explicitly record whether:

* occurrence V2 only was sufficient;
* a narrow enclosing version also had to change.

If wider versioning was required, explain the concrete invariant.

Do not hide it as implementation detail.

---

# 35. Semantic Fingerprint

Update fingerprinting to include:

* occurrence version;
* timing tag where V2.

Expected inequalities:

```text
V1 != V2 timed
V1 != V2 allDay
V2 timed != V2 allDay
```

---

# 36. Fingerprint Ordering

Preserve existing canonical ordering.

Timing addition must not make semantically identical occurrence sets order-sensitive.

---

# 37. Reordered V2 Goal/Provenance Fields

Any existing canonicalization for frozen Goal provenance remains intact.

Do not regress Task 5.6-style order independence.

---

# 38. Clone Helpers

Clone must preserve:

```text
version
timing.kind
```

for V2.

V1 remains absent, not normalized to an invented timing object.

---

# 39. Clone Isolation

Mutation of:

* source V2;
* returned V2;
* timing object;

must not affect authority/result counterpart.

Add explicit test.

---

# 40. JSON Roundtrip

Prove:

```text
V1
V2 timed
V2 allDay
```

survive JSON stringify/parse plus canonical validation without semantic collapse.

---

# 41. IndexedDB

No DB schema/index version expected.

Prove current structured-value persistence preserves:

* occurrence version;
* timing tag.

If adapter reconstructs exact keys manually, update it.

---

# 42. Mixed HistoricalPlan

A HistoricalPlan surface may contain history created over time with both:

```text
V1
V2
```

within different publications/days.

Readers must handle this naturally.

Do not require whole-authority migration.

---

# 43. Same Day Across Republication

Example:

```text
08:00 publication
    V1 legacy occurrence

12:00 republication
    V2 explicit allDay
```

At:

```text
10:00 cutoff
    → V1 / unavailableLegacy

13:00 cutoff
    → V2 / allDay
```

Mandatory test.

---

# 44. V1 → V2 Timed Republication

Also cover legacy unknown becoming explicitly timed after later republication.

Do not reinterpret the earlier record retroactively.

---

# 45. V2 AllDay → V2 Timed

If author changes event semantics and republishes:

before cutoff:

* allDay.

after cutoff:

* timed.

Both remain historical truth at their respective cutoffs.

---

# 46. V2 Timed → V2 AllDay

Cover reverse.

---

# 47. Current Authored Independence

Changing current manual-event `allDay` without republication must not change old HistoricalPlan.

Mandatory property test where practical.

---

# 48. Preview Independence

Old HistoricalPlan timing semantics must not derive from current Preview.

Preview is only publication input at materialization time according to existing pipeline.

After publication, no dependency.

---

# 49. Active Independence

No reader may inspect Active to fill V1 timing.

---

# 50. Current Manual Event Independence

No reader may inspect current ManualCalendarEvent to fill V1 timing.

---

# 51. Goal Independence

Frozen Goal provenance remains unrelated.

---

# 52. ExecutionHistory Independence

ExecutionHistory does not determine timing kind.

---

# 53. Backup V6 Validation

Update V6 HistoricalPlan validation transitively to accept V1/V2.

Do not alter V6 envelope unless necessary.

---

# 54. Backup V6 Export

New V2 occurrences should export unchanged.

---

# 55. Backup V6 Import

Restore/import must accept:

* legacy V1;
* new V2;
* mixed history.

---

# 56. Backup Semantic Verification

If restore compares semantic fingerprints:

ensure V2 timing participates.

A timing tag lost during restore must fail semantic verification.

---

# 57. No Backup V7

Expected final result:

```text
Backup V6 remains current.
```

If true, state explicitly.

If false, task must have stopped before unauthorized widening unless user approved a scope change.

---

# 58. Restore Translation

Do not normalize V1 to V2 during restore.

Restore exact historical versions.

---

# 59. Restore Composition

Installing restored HistoricalPlan must preserve occurrence versions/tags exactly.

---

# 60. Full Clear

No behavior change.

Add regression that V2 history disappears with HistoricalPlan authority exactly like V1.

---

# 61. Protection/Quarantine

Malformed V2 timing must trigger existing HistoricalPlan protection/quarantine behavior.

Do not partially accept corrupted timing.

---

# 62. Unknown Future Version

Occurrence version >2 must follow existing unsupported-version behavior.

Do not silently parse as V2.

---

# 63. Historical Surface Reads

Any HistoricalPlan query returning occurrences should retain V1/V2 exact shape or expose a safe normalized read model that preserves coverage.

Do not erase legacy uncertainty.

---

# 64. Coverage Semantics

Recommended helper result:

| Snapshot  | Timing coverage   |
| --------- | ----------------- |
| V1        | unavailableLegacy |
| V2 timed  | available         |
| V2 allDay | available         |

Do not call V1:

```text
unknown
```

if repository uses a more precise coverage vocabulary; follow conventions.

---

# 65. Today Readiness

Task 6.3 will need to distinguish:

```text
known all-day
known timed
legacy unavailable
```

Task 6.3C must expose enough pure historical semantics to support this without reading current state.

Do not implement Today itself.

---

# 66. All-Day Legacy Treatment

Task 6.3 later may choose a conservative Today presentation for V1.

6.3C should not decide UI.

Its job is to make the epistemic state mechanically available.

---

# 67. HistoricalPlan Day-Window Provenance

Task 6.3B concluded no additional day-window field is required.

Do not add:

* day end;
* next boundary;
* duration;

to HistoricalPlan solely as part of 6.3C.

Keep this task occurrence-timing focused.

---

# 68. Existing Historical Geometry

Never rewrite V1 intervals to match new Task 6.3B temporal geometry.

Existing history stays frozen.

---

# 69. New Historical Geometry

New publications use whatever exact interval the current generation engine produced after Task 6.3B.

HistoricalPlan materialization does not independently recalculate user-day geometry.

---

# 70. Fingerprint Migration Boundary

No migration of stored fingerprints if fingerprints are computed on demand.

Audit actual storage model.

If fingerprint is persisted, update semantics carefully without rewriting historical authority.

Do not assume.

---

# 71. Publication Deduplication

Audit whether semantic fingerprint is used to suppress duplicate publications.

If so:

changing timing kind with identical interval must count as a semantic change.

Mandatory test.

---

# 72. Republication Identity

Existing batch/publication identity semantics remain unchanged.

Do not reuse old batch identity because only timing changed.

Follow canonical publication logic.

---

# 73. Performance

Validation/fingerprint addition is O(1) per occurrence.

No new scans/caches.

---

# 74. Dependency Boundary

No new runtime dependency.

---

# 75. Persistence Boundary

No new:

* IndexedDB store;
* localStorage key;
* runtime participant;
* cache;
* migration authority.

---

# 76. Profile Boundary

Profiles do not own HistoricalPlan.

No change.

---

# 77. Preview Staleness Boundary

No change.

---

# 78. Goal Activity Boundary

No change.

---

# 79. Progress Boundary

No change.

---

# 80. Summary Boundary

No UI or metric change.

---

# 81. Today Surface Boundary

Today placeholder remains unchanged.

---

# 82. Test Strategy — Domain

Cover:

1. valid V1;
2. valid V2 timed;
3. valid V2 allDay;
4. invalid timing kind;
5. missing V2 timing;
6. extra V2 timing keys;
7. V1 with timing rejected;
8. unsupported occurrence version rejected;
9. mixed V1/V2 day accepted.

---

# 83. Test Strategy — Materialization

Cover:

* all-day manual event → V2 allDay;
* timed manual event → V2 timed;
* ordinary work → V2 timed;
* Sleep/template → V2 timed;
* same interval, different intent;
* all new publication occurrences are V2.

If another source family exists, cover it.

---

# 84. Test Strategy — Fingerprint

Cover:

```text
V1 != V2 timed
V1 != V2 allDay
V2 timed != V2 allDay
same V2 semantic clone == same fingerprint
reordering unrelated canonical collections == same fingerprint
```

---

# 85. Test Strategy — Clone

Cover:

* V1 absent timing remains absent;
* V2 tag survives;
* mutation isolation.

---

# 86. Test Strategy — JSON

Cover all three forms.

---

# 87. Test Strategy — IndexedDB

Persist/read:

* V1;
* V2 timed;
* V2 allDay;
* mixed history.

Use existing storage harness.

---

# 88. Test Strategy — Backup V6

Roundtrip all three forms.

Assert Backup version remains V6.

---

# 89. Test Strategy — Restore

Restore mixed authority and compare exact semantic output/fingerprint.

---

# 90. Test Strategy — Republication

Cover:

* V1 → V2 allDay;
* V1 → V2 timed;
* V2 allDay → V2 timed;
* V2 timed → V2 allDay;
* cutoff before/after;
* old publication unchanged.

---

# 91. Test Strategy — No Backfill

Change:

* Active;
* current manual event;
* Preview;

after a V1 publication.

Timing coverage must remain unavailableLegacy.

---

# 92. Test Strategy — Protection

Malformed V2 timing causes canonical HistoricalPlan protection/error behavior.

---

# 93. Test Strategy — Full Clear

V2 authority clears identically to V1.

---

# 94. Property Invariants

Where practical prove:

### A

Current authored state cannot affect legacy V1 timing interpretation.

### B

Preview changes cannot affect already-published timing.

### C

Timing intent changes affect result only through republication.

### D

Cutoff selects exactly one historical timing truth.

### E

V1 and V2 remain semantically distinguishable.

### F

All-day and timed identical intervals remain distinguishable.

### G

Serialization/clone/Backup/restore preserve the distinction.

### H

Storage order does not alter fingerprint.

---

# 95. Required Version Matrix

Produce:

| Layer                  | Before | After   | Bump? | Why |
| ---------------------- | ------ | ------- | ----: | --- |
| HistoricalPlan surface |        |         |       |     |
| batch                  |        |         |       |     |
| day                    |        |         |       |     |
| occurrence             | V1     | V1 + V2 |       |     |
| Goal provenance        |        |         |       |     |
| Backup                 | V6     |         |       |     |

---

# 96. Required Timing Matrix

Produce:

| Snapshot | Interval | Timing provenance | Interpretation |
| -------- | -------- | ----------------- | -------------- |
| V1       | 24h      | absent            |                |
| V2       | 24h      | allDay            |                |
| V2       | 24h      | timed             |                |
| V2       | 27h      | allDay            |                |
| V2       | 27h      | timed             |                |

---

# 97. Required Source Matrix

Produce:

| Occurrence source       | Authoritative timing source | V2 kind |
| ----------------------- | --------------------------- | ------- |
| manual all-day          |                             |         |
| manual timed            |                             |         |
| work                    |                             |         |
| Sleep                   |                             |         |
| template/flexible block |                             |         |
| other                   |                             |         |

---

# 98. Required Validation Matrix

Produce:

| Record            | Valid? | Result |
| ----------------- | -----: | ------ |
| strict V1         |        |        |
| V1 + timing       |        |        |
| strict V2 timed   |        |        |
| strict V2 allDay  |        |        |
| V2 missing timing |        |        |
| V2 unknown kind   |        |        |
| V2 extra key      |        |        |
| unknown version   |        |        |

---

# 99. Required Fingerprint Matrix

Produce:

| A                        | B                    | Equal? |
| ------------------------ | -------------------- | -----: |
| V1 interval X            | V2 timed interval X  |        |
| V1 interval X            | V2 allDay interval X |        |
| V2 timed interval X      | V2 allDay interval X |        |
| V2 timed semantic clone  | same                 |        |
| V2 allDay semantic clone | same                 |        |

---

# 100. Required Republication Matrix

Produce:

| Before publication | After publication | Before cutoff | After cutoff |
| ------------------ | ----------------- | ------------- | ------------ |
| V1 unknown         | V2 allDay         |               |              |
| V1 unknown         | V2 timed          |               |              |
| V2 allDay          | V2 timed          |               |              |
| V2 timed           | V2 allDay         |               |              |

---

# 101. Required Persistence Matrix

Produce:

| Boundary   | V1 | V2 timed | V2 allDay | Mixed |
| ---------- | -: | -------: | --------: | ----: |
| clone      |    |          |           |       |
| JSON       |    |          |           |       |
| IndexedDB  |    |          |           |       |
| Backup V6  |    |          |           |       |
| restore    |    |          |           |       |
| full clear |    |          |           |       |

---

# 102. Required Read-Boundary Matrix

Produce:

| Consumer               | V1 handling       | V2 handling     |
| ---------------------- | ----------------- | --------------- |
| HistoricalPlan surface |                   |                 |
| fingerprint            |                   |                 |
| Backup validator       |                   |                 |
| restore                |                   |                 |
| future Today           | unavailableLegacy | explicit timing |

---

# 103. Required Product-Boundary Matrix

Produce:

| Capability         | Task 6.3C |
| ------------------ | --------- |
| occurrence V2      |           |
| all-day provenance |           |
| timed provenance   |           |
| V1 compatibility   |           |
| legacy backfill    |           |
| Backup V6 support  |           |
| Backup V7          |           |
| Today query        |           |
| Today UI           |           |
| user-day engine    |           |
| Recommendations    |           |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited;
* Not needed.

---

# 104. Required Epistemic Matrix

Produce:

| Evidence                                | DayFrame may say | Must not say |
| --------------------------------------- | ---------------- | ------------ |
| V1 no timing                            |                  |              |
| V2 allDay                               |                  |              |
| V2 timed                                |                  |              |
| identical V2 intervals different tags   |                  |              |
| current event is all-day, old V1 exists |                  |              |
| later V2 republication                  |                  |              |

---

# 105. Architectural Invariants

Assess at minimum:

1. V1 remains immutable.
2. V1 exact keys remain unchanged.
3. V1 remains accepted.
4. V1 timing is unavailableLegacy.
5. V1 is never inferred timed.
6. V1 is never inferred allDay.
7. V2 has explicit version.
8. V2 timing is required.
9. V2 timing is a strict tagged union.
10. V2 supports allDay.
11. V2 supports timed.
12. no third timing kind is invented.
13. interval geometry remains preserved.
14. timing intent is independent from interval duration.
15. all-day 24h and timed 24h remain distinct.
16. all-day 27h and timed 27h remain distinct.
17. publication materializes V2.
18. new occurrences do not emit V1.
19. manual all-day maps to allDay.
20. manual timed maps to timed.
21. work maps according to authoritative semantics.
22. Sleep/template maps according to authoritative semantics.
23. no source is guessed if semantics unavailable.
24. strict validator dispatches by version.
25. V1 with V2 keys is rejected.
26. V2 without timing is rejected.
27. malformed timing is rejected.
28. unknown future version is rejected/handled canonically.
29. enclosing day validation accepts V1/V2 union.
30. enclosing batch validation accepts V1/V2 union.
31. surface validation accepts compatible union.
32. unnecessary enclosing version bump is avoided.
33. occurrence version participates in fingerprint.
34. timing kind participates in fingerprint.
35. V1 differs from V2 timed.
36. V1 differs from V2 allDay.
37. V2 timed differs from V2 allDay.
38. canonical order invariance remains.
39. clone preserves V1 absence.
40. clone preserves V2 timing.
41. clone isolation holds.
42. JSON preserves exact semantics.
43. IndexedDB preserves exact semantics.
44. mixed V1/V2 history is supported.
45. current authored state never backfills V1.
46. current manual event never backfills V1.
47. current Preview never backfills V1.
48. Goal never backfills V1.
49. ExecutionHistory never supplies timing.
50. republication does not rewrite prior publication.
51. cutoff controls when V2 knowledge becomes effective.
52. V1 → V2 allDay is cutoff-governed.
53. V1 → V2 timed is cutoff-governed.
54. V2 allDay → timed is cutoff-governed.
55. V2 timed → allDay is cutoff-governed.
56. Backup V6 can transport V1/V2.
57. Backup V6 exports exact tags.
58. Backup V6 imports exact tags.
59. Backup semantic verification includes timing.
60. Backup V7 is not introduced unless stop condition requires it.
61. restore preserves occurrence version.
62. restore preserves timing tag.
63. restore does not normalize V1 to V2.
64. restore does not consult current authored state.
65. full clear remains unchanged.
66. malformed V2 uses existing protection/quarantine.
67. no IndexedDB schema/index migration.
68. no new persistence key.
69. no new authority participant.
70. Profiles unchanged.
71. Preview staleness unchanged.
72. Goal Activity unchanged.
73. Progress unchanged.
74. Summary unchanged.
75. Today placeholder unchanged.
76. no Today read model is implemented.
77. Task 6.3B semantics are preserved.
78. no new user-day changes are introduced.
79. no transition strategy is implemented.
80. no Recommendation is introduced.
81. no Capacity is introduced.
82. no Goal reorientation is introduced.
83. no runtime dependency is added.
84. validation remains deterministic.
85. fingerprint remains deterministic.
86. performance remains bounded.
87. focused tests pass.
88. full tests pass.
89. build passes.
90. bundle budgets pass.
91. Task 6.3 resume prerequisites are fully satisfied if no new blocker remains.

Classify each as:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Not needed;
* Blocked.

---

# 106. Focused Validation

Run focused suites covering:

* HistoricalPlan domain;
* validator;
* materializer/publication;
* fingerprint;
* surface/storage;
* Backup V6;
* restore;
* republication;
* full clear.

Record exact file/test counts.

---

# 107. Full Validation

Before completion run repository-standard commands:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

If repository-wide formatting would alter immutable task copies or unrelated dirty work, use the same bounded formatting policy accepted in recent tasks and document it.

Record:

* test-file count;
* test count;
* build module count;
* initial raw JS;
* initial gzip;
* largest lazy;
* total JS;
* diff result.

---

# 108. Bundle Baseline

Task 6.3B baseline:

```text
Initial raw     681,534
Initial gzip    169,501
Largest lazy     30,091
Total JS        711,625
```

Budgets remain:

```text
Initial raw     <= 685,000
Initial gzip    <= 170,000
Largest lazy    <= 100,000
Total JS        <= 750,000
```

This task is close to the current initial raw/gzip limits.

Therefore bundle growth deserves particular scrutiny.

Do not raise thresholds.

If implementation exceeds a budget:

* inspect whether V2 support accidentally entered initial UI code unnecessarily;
* report;
* do not silence the guard.

---

# 109. Manual Product Walkthrough

No new UI is authorized.

Manual UI walkthrough is not required.

If existing Preview behavior is touched indirectly by publication materialization, a minimal regression check may be performed, but do not claim new product UI validation.

---

# 110. Governance

Update:

* Task 6.3C result;
* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

The accepted ADR governs timing provenance.

Do not create another ADR unless implementation requires a new enduring versioning rule.

---

# 111. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.3C_HISTORICALPLAN_V2_TIMING_PROVENANCE_AND_V1_COMPATIBILITY_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 6.3A/6.3B Prerequisite Confirmation
4. ADR Confirmation
5. Initial HistoricalPlan Audit
6. Files Changed
7. V1 Preservation
8. V2 Type
9. Timing Union
10. Canonical Occurrence Union
11. Timing Coverage Helper
12. Publication Source Audit
13. Manual All-Day Mapping
14. Manual Timed Mapping
15. Work Mapping
16. Sleep/Template Mapping
17. Other Source Mapping
18. Publication Materialization
19. New Publication Version
20. Scheduled Interval Preservation
21. All-Day Geometry
22. Timed Geometry
23. Identical-Interval Distinction
24. Legacy Semantics
25. Strict Validation
26. V1 Validation
27. V2 Validation
28. Enclosing Day Validation
29. Enclosing Batch Validation
30. Surface Validation
31. Version-Bump Decision
32. Fingerprint
33. Fingerprint Ordering
34. Clone
35. Clone Isolation
36. JSON
37. IndexedDB
38. Mixed History
39. V1→V2 Republication
40. V2→V2 Timing Change
41. Cutoff Semantics
42. Current Authored Independence
43. Preview Independence
44. Active Independence
45. Goal Independence
46. ExecutionHistory Independence
47. Backup V6 Validation
48. Backup V6 Export
49. Backup V6 Import
50. Backup Semantic Verification
51. Backup Version Decision
52. Restore Translation
53. Restore Composition
54. Full Clear
55. Protection/Quarantine
56. Unknown Future Version
57. Historical Surface Reads
58. Today Readiness
59. Historical Day-Window Boundary
60. Existing Historical Geometry
61. New Publication Geometry
62. Persistence Boundary
63. Performance
64. Tests Added/Changed
65. Property Invariants
66. Focused Validation
67. Full Validation
68. Bundle Validation
69. Manual Validation
70. Governance Updates
71. ADR Determination
72. Deviations
73. Discoveries
74. Deferred Work
75. Version Matrix
76. Timing Matrix
77. Source Matrix
78. Validation Matrix
79. Fingerprint Matrix
80. Republication Matrix
81. Persistence Matrix
82. Read-Boundary Matrix
83. Product-Boundary Matrix
84. Epistemic Matrix
85. Architectural Invariant Assessment
86. Stop-Condition Assessment
87. Architectural Alignment Assessment
88. Task 6.3 Resume Readiness
89. Recommended Next Task
90. Final Completion Determination

---

# 112. Task 6.3 Resume Readiness

At completion answer explicitly:

> Are both original Task 6.3 blockers now mechanically resolved?

Required:

### User-day blocker

Already resolved by Task 6.3B.

### Historical timing blocker

Resolved only if:

* new publications freeze explicit timing;
* legacy remains distinguishable;
* readers can query coverage/kind without current-state inference;
* Backup/restore preserve the distinction.

If yes:

> **Task 6.3 may resume.**

---

# 113. Recommended Next Task

If Task 6.3C is green and no new blocker appears:

> **Resume Task 6.3 — Canonical Today Current-User-Day and Current-Plan Read Model.**

Do not rename it 6.3D unless repository governance requires a new implementation artifact.

The original Task 6.3 remains the blocked parent task whose prerequisites have now been satisfied.

---

# 114. Completion Criteria

Task 6.3C is complete only when:

* HistoricalPlannedOccurrenceSnapshotV1 remains unchanged;
* V1 records remain valid;
* V1 timing is mechanically classified as unavailableLegacy;
* no V1 record is backfilled;
* HistoricalPlannedOccurrenceSnapshotV2 exists;
* V2 requires explicit timing;
* timing is a strict allDay/timed tagged union;
* exact scheduled interval remains frozen independently;
* all new publications emit V2;
* authoritative manual all-day becomes V2 allDay;
* manual timed becomes V2 timed;
* work/Sleep/templates receive truthful timing kinds;
* no source family is guessed;
* strict validators dispatch by version;
* malformed V2 is rejected;
* enclosing HistoricalPlan layers accept mixed V1/V2 where compatible;
* occurrence-only versioning is retained unless implementation proves wider bump necessary;
* fingerprints include occurrence version/timing;
* V1 differs from V2 timed;
* V1 differs from V2 allDay;
* V2 timed differs from V2 allDay;
* clone preserves both versions exactly;
* JSON preserves both versions exactly;
* IndexedDB preserves both versions exactly;
* mixed history is supported;
* republication adds new timing knowledge only at its cutoff;
* old publication remains unchanged;
* current Active/manual-event/Preview cannot alter V1 interpretation;
* Backup V6 validates and roundtrips V1/V2;
* Backup V6 semantic verification detects lost timing provenance;
* no Backup V7 is required unless an explicit stop condition proves otherwise;
* restore preserves exact occurrence version and timing;
* restore never normalizes V1 to V2;
* restore never consults current authored state;
* malformed V2 follows existing protection/quarantine behavior;
* full clear remains unchanged;
* no new persistence store/key/migration exists;
* no Today query/UI behavior is added;
* Task 6.3B temporal semantics remain untouched;
* no Recommendation, Capacity, transition strategy, Goal reorientation, or adaptation behavior is introduced;
* focused and full validation pass;
* bundle budgets remain green without raising thresholds;
* governance records V2 timing provenance and V1 compatibility;
* both original Task 6.3 blockers are now resolved;
* Task 6.3 is explicitly cleared to resume.

---

# 115. Final Implementation Principle

> **HistoricalPlan must preserve the meaning of an occurrence, not merely enough geometry to guess at that meaning later.**

An all-day occurrence and a timed occurrence may occupy the same interval while remaining different historical facts.

---

# 116. Final Completion Statement

**Task 6.3C is complete when DayFrame evolves HistoricalPlan occurrence snapshots through a strict V2 representation that preserves explicit `allDay` versus `timed` timing intent alongside exact scheduled intervals; when immutable V1 occurrences remain unchanged, valid, and explicitly classified as legacy timing-unavailable rather than guessed from geometry or current authored state; when every new publication emits truthful V2 timing provenance from authoritative source semantics; when occurrence-version and timing-kind differences participate in semantic fingerprinting so legacy, explicit timed, and explicit all-day records remain distinct even when their intervals are identical; when strict V1/V2 validation, canonical unions, cloning, JSON, IndexedDB, HistoricalPlan reads, mixed-history handling, Backup V6, restore, protection/quarantine, full clear, and publication/republication cutoffs preserve those distinctions without migrating or backfilling history; when a later republication may supply newly explicit timing knowledge only from its own publication cutoff forward; when no Backup V7, new database store, new persistence key, new authority, Today query/UI, temporal-engine change, transition strategy, Recommendation, Capacity, Goal reorientation, or adaptation behavior has been introduced unnecessarily; when focused and canonical validation and existing bundle budgets remain green; and when the original Task 6.3's two stop conditions—ambiguous variable-boundary user-day ownership and lost HistoricalPlan all-day intent—are both mechanically resolved so the canonical Today read-model task may safely resume.**
