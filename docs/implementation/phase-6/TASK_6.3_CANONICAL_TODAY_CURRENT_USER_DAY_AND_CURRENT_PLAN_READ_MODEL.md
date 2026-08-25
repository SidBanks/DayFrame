# Task 6.3 — Canonical Today Current-User-Day and Current-Plan Read Model

## Status

Resumed and ready for implementation.

## Phase

Phase 6 — Platform Maturity

## Task Type

Pure/application-level Today read-model implementation, canonical current-user-day resolution, effective HistoricalPlan selection, ExecutionHistory overlay, current/next/later/elapsed classification, all-day/timed handling, protection/coverage semantics, provenance, deterministic query behavior, clone isolation, testing, bundle validation, and governance.

**No Today UI, no outcome-reporting UI, no Goal context UI, no same-day replanning, and no new durable authority are authorized.**

---

# 1. Objective

Implement one canonical derived read model for the future **Today** surface.

Given an explicit evaluation instant, DayFrame must be able to answer:

```text
What canonical user-day contains this instant?

What published HistoricalPlan is effective for that user-day?

Which planned occurrences are all-day?

Which timed occurrences overlap now?

Which timed occurrences are next?

Which timed occurrences remain later?

Which timed occurrences have elapsed?

What explicit ExecutionHistory outcome, if any, exists for each exact occurrence?

Which plan or execution facts are unavailable because the relevant authority is missing or protected?
```

The result must remain non-authoritative and non-persisted.

Task 6.4 will render it.

---

# 2. Prerequisite Closure

Task 6.3 originally stopped on two mandatory blockers.

Both are now mechanically resolved.

### 2.1 Variable-boundary user-day ownership

Task 6.3B implemented:

```text
start(D)
    = effective boundary for label D

userDay(D)
    = [start(D), start(D+1))
```

including variable-duration user-days, consumer remediation, placement, work ownership, all-day geometry, Preview clipping, and visualization.

### 2.2 Historical all-day/timed provenance

Task 6.3C implemented:

```text
HistoricalPlannedOccurrenceSnapshotV2

timing:
    { kind: "allDay" }
    |
    { kind: "timed" }
```

while V1 remains:

```text
timing semantics = unavailableLegacy
```

without current-state backfill.

Therefore the original Task 6.3 stop conditions are cleared.

---

# 3. Governing Today Principle

> **Today is a projection over existing truth, not a new source of truth.**

Today may read:

* canonical temporal preferences required for user-day ownership;
* HistoricalPlan;
* ExecutionHistory.

It must not become:

* durable authority;
* cache;
* current-plan authority;
* execution/in-progress authority.

---

# 4. Governing Temporal Principle

Today uses the Task 6.3B canonical piecewise user-day resolver.

Do not reimplement:

```text
boundary selection
instant bracketing
next-label end calculation
```

inside Today.

The current user-day is whatever canonical window uniquely contains the supplied evaluation instant.

---

# 5. Governing Plan Principle

> **HistoricalPlan is the sole current-plan authority for Today.**

Do not use:

* Preview;
* current generated blocks;
* current Active schedule content;
* manual-event authority;

to substitute for published plan truth.

Active/authored preferences may be consulted only through the canonical temporal resolver where required to establish current user-day ownership.

---

# 6. Governing Execution Principle

> **ExecutionHistory is the sole execution-evidence authority.**

Therefore:

```text
scheduled now
    ≠ underway

elapsed
    ≠ completed

elapsed
    ≠ skipped

no execution report
    = not reported
```

Do not infer behavior from time.

---

# 7. Governing Timing-Provenance Principle

HistoricalPlan timing semantics now have three epistemic states:

```text
V2 allDay
    → explicitly all-day

V2 timed
    → explicitly timed

V1
    → unavailableLegacy
```

Today must preserve all three.

Do not infer V1 timing from interval geometry.

---

# 8. Governing Orthogonality Principle

Temporal position and execution outcome remain separate dimensions.

Example combinations that may be mechanically valid:

```text
current + notReported
current + completed

elapsed + notReported
elapsed + skipped

upcoming + completed
```

Do not collapse these into single labels such as:

* in progress;
* done;
* missed.

---

# 9. Explicit Scope

Implement:

* canonical Today query contract;
* current-user-day resolution;
* exact canonical user-day window;
* effective HistoricalPlan publication selection;
* plan availability/coverage;
* published-empty state;
* HistoricalPlan protection;
* V1/V2 timing semantics;
* all-day occurrence collection;
* timed occurrence collection;
* current timed occurrences;
* next tied occurrence group;
* later timed occurrences;
* elapsed timed occurrences;
* unplaced/omitted/blocked plan-attention evidence;
* ExecutionHistory bulk overlay;
* exact durable reference matching;
* not-reported state;
* correction/retraction cutoff semantics;
* execution protection/partial availability;
* deterministic ordering;
* frozen provenance;
* republication behavior;
* clone isolation;
* input-order independence;
* application/store query integration;
* focused tests;
* bundle validation;
* governance.

---

# 10. Explicit Non-Goals

Do not implement:

* Today UI;
* timeline rendering;
* outcome-reporting controls;
* Record Current Value;
* Goal context;
* Progress context;
* friction actions;
* same-day replanning;
* drag/drop;
* selected historical day;
* tomorrow view;
* Recommendation;
* Capacity;
* Planned Allocation;
* transition strategy behavior;
* transition sleep recommendations;
* Goal reorientation;
* new authority;
* new persistence;
* Backup V7.

---

# 11. Execution Artifact Rules

Before implementation:

1. verify this resumed Task 6.3 artifact;
2. save immutable project copy;
3. compare supplied/saved copies where applicable;
4. record SHA-256;
5. review:

   * blocked Task 6.3 result;
   * Task 6.3A result;
   * Task 6.3B result;
   * Task 6.3C result;
   * both accepted ADRs;
   * canonical user-day window helpers;
   * HistoricalPlan projection/surface;
   * HistoricalPlan timing helper;
   * ExecutionHistory effective-head resolver;
   * exact durable occurrence reference equality;
   * restore/full-clear behavior;
6. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-6/TASK_6.3_CANONICAL_TODAY_CURRENT_USER_DAY_AND_CURRENT_PLAN_READ_MODEL_RESULT.md`

---

# 12. Initial Source Audit

Before changing production code, confirm:

* exact canonical variable-boundary user-day resolver API;
* exact user-day window result shape;
* exact HistoricalPlan latest-as-of day selector;
* exact published-empty representation;
* exact protected/storage-unavailable HistoricalPlan states;
* exact HistoricalPlan V1/V2 occurrence union;
* exact timing-semantics helper;
* exact ExecutionHistory effective assertion resolver;
* exact correction/retraction as-of semantics;
* exact durable reference equality helper;
* all reportable outcome categories.

Do not reconstruct these from memory.

---

# 13. Module Placement

Prefer:

```text
core/today/
    buildTodayReadModel

state/
    queryToday
```

or repository-equivalent placement.

Core Today logic should remain pure.

State/application adapter should:

* gather canonical authority snapshots;
* supply explicit evaluation instant;
* map readiness/protection;
* return cloned result.

---

# 14. Query Contract

Expose one canonical application query.

Preferred:

```text
queryToday({
    evaluationAsOf
})
```

The instant must be explicit and canonical.

Do not read `Date.now()` inside core.

---

# 15. Query Time Semantics

One explicit evaluation instant governs:

1. current-user-day ownership;
2. temporal now/current/upcoming/elapsed classification;
3. HistoricalPlan publication cutoff;
4. ExecutionHistory knowledge cutoff.

Document this directly.

---

# 16. Current User-Day Resolution

Use the canonical Task 6.3B resolver.

Result should retain at least:

```text
userDayDate
start
end
duration
effective day boundary
effective week start
```

where supported.

Do not recompute end independently.

---

# 17. User-Day Window Semantics

Canonical:

```text
[start, end)
```

At:

```text
T == start
```

the new user-day owns `T`.

At:

```text
T == end
```

the next user-day owns `T`.

---

# 18. Variable-Duration Days

Today must work unchanged for:

* stable days;
* longer transition days;
* shorter transition days;
* DST-shortened/lengthened days.

No 24-hour assumption.

---

# 19. HistoricalPlan Selection

For resolved `userDayDate`, reuse canonical effective publication selection:

```text
publishedAt <= evaluationAsOf
```

Select exactly one effective day publication.

Do not scan or merge publications manually.

---

# 20. Current Plan Provenance

Retain enough provenance for later UI/diagnostics:

* user-day date;
* plan batch/publication identity;
* publishedAt;
* exact occurrence references;
* frozen occurrence metadata.

Do not expose Preview identity.

---

# 21. Published-Empty

An available publication with zero occurrences means:

> known empty published plan.

It is an available Today plan state.

Do not convert to unavailable.

---

# 22. Missing Plan

No effective publication means:

> plan unavailable.

Do not say:

* free day;
* nothing scheduled;
* empty day.

---

# 23. Protected HistoricalPlan

If HistoricalPlan is protected:

Today must expose explicit plan-protected/unavailable state.

Do not fall back to Preview.

---

# 24. Occurrence Scope

HistoricalPlan occurrences may include plan dispositions:

* scheduled;
* unplaced;
* omitted;
* blocked.

Today timeline semantics use **scheduled** occurrences only.

Retain unplaced/omitted/blocked as separate plan-attention evidence.

Do not treat them as timeline items.

---

# 25. Plan-Attention Evidence

Prefer bounded exact arrays or counts such as:

```text
unplaced
omitted
blocked
```

Retain exact frozen occurrence provenance if cheap and already available.

Do not infer cause/friction.

---

# 26. Frozen Occurrence Provenance

Each occurrence should retain:

* exact durable reference;
* frozen title;
* frozen category;
* source family;
* plan disposition;
* frozen Goal provenance where present;
* scheduled interval where applicable;
* occurrence version;
* timing semantics.

Do not replace frozen labels with current Active values.

---

# 27. Timing Semantics

For each occurrence:

### V2 allDay

```text
timing:
    coverage = available
    kind = allDay
```

### V2 timed

```text
coverage = available
kind = timed
```

### V1

```text
coverage = unavailableLegacy
```

Do not guess kind.

---

# 28. Legacy V1 Today Handling

V1 occurrences still retain exact frozen interval.

Today may expose:

* interval;
* legacy timing-unavailable status.

Do not force V1 into all-day or timed collection without an explicit conservative policy.

Strong preferred read-model shape:

```text
allDay
timed
timingUnavailableLegacy
```

This avoids semantic coercion.

Audit actual consumer needs before choosing exact names.

---

# 29. V2 All-Day Collection

Explicit V2 all-day occurrences should appear in a separate all-day collection.

Do not classify them as current/next/later based solely on their full-day interval.

They are user-day-wide context, not timed “current work.”

---

# 30. All-Day Execution Overlay

Execution evidence may still exist for an all-day occurrence if reporting APIs permit it.

Preserve outcome orthogonally.

Do not classify all-day as timed current.

---

# 31. Timed Collection

Only explicit V2 timed occurrences should enter timed temporal classification.

Legacy V1 should remain separate unless the architecture provides an explicit safe compatibility mode.

---

# 32. Current Timed Semantics

For V2 timed:

```text
start <= evaluationAsOf < end
```

→ `current`.

Internal/read-model wording may use `current`.

Do not use:

* inProgress;
* underway;
* activeExecution.

---

# 33. Upcoming Semantics

Timed:

```text
start > evaluationAsOf
```

→ upcoming.

---

# 34. Elapsed Semantics

Timed:

```text
end <= evaluationAsOf
```

→ elapsed.

---

# 35. Multiple Current Occurrences

Return an array.

Do not assume singleton.

Sort deterministically.

---

# 36. Next Semantics

`next` is the earliest future start group.

If multiple timed occurrences share that start:

return all ties.

Do not arbitrarily pick one.

---

# 37. Later Semantics

All upcoming timed occurrences after the tied next group.

Deterministically ordered.

---

# 38. Elapsed Collection

Include elapsed timed occurrences.

Task 6.4 may decide how much to render, but Task 6.5 outcome reporting will need complete current-day evidence.

---

# 39. Ordering

Timed occurrence order:

1. `startsAt`;
2. `endsAt`;
3. canonical serialized exact durable reference.

All-day and legacy groups:

use stable deterministic ordering based on frozen reference/title as appropriate.

No storage-order dependence.

---

# 40. Cross-Boundary Scheduled Occurrences

A scheduled occurrence may cross civil midnight or canonical user-day boundary.

Use exact HistoricalPlan interval and canonical day membership.

Do not reassign to another day by independent interval scan.

---

# 41. Manual Events

Manual events appear only through frozen HistoricalPlan occurrences.

Do not read current manual-event authority.

---

# 42. Work

Generated work appears only through HistoricalPlan.

---

# 43. Sleep/Templates

Same principle.

---

# 44. ExecutionHistory Overlay

Resolve execution evidence in bulk for all exact scheduled occurrence references in the effective plan.

Avoid N+1 application queries.

Use canonical ExecutionHistory effective-head projection.

---

# 45. Execution Knowledge Cutoff

Only records whose canonical knowledge time is:

```text
recordedAt <= evaluationAsOf
```

may contribute.

Reuse existing resolver behavior.

Do not manually inspect revisions if a canonical helper exists.

---

# 46. Execution Outcome Categories

Use exact existing canonical categories.

Expected reportable evidence:

* completed;
* partial;
* skipped.

No effective assertion/retraction:

* notReported.

If domain contains another explicit category, preserve it.

---

# 47. Not-Reported Semantics

No effective outcome assertion means:

```text
notReported
```

not:

* unknown behavior;
* skipped;
* incomplete.

If canonical execution projection calls this `unknown`, distinguish whether that means explicit unknown or absence before choosing product read-model wording.

---

# 48. Correction

Correction changes the effective execution overlay only when its knowledge time is inside cutoff.

Mandatory before/after test.

---

# 49. Retraction

An effective retraction removes the prior assertion from current effective outcome according to canonical ExecutionHistory semantics.

Today then returns notReported or canonical equivalent.

---

# 50. Execution Protection

If ExecutionHistory is protected:

do not mark every occurrence notReported.

Preferred model:

```text
plan = available
execution = unavailableProtected
```

and per-occurrence outcome may be omitted/unavailable.

Preserve schedule truth independently.

---

# 51. Partial Availability

Today should support:

```text
HistoricalPlan available
ExecutionHistory protected
```

without suppressing plan timeline.

Conversely, if HistoricalPlan is protected, no trustworthy plan timeline exists.

---

# 52. Temporal / Execution Orthogonality

Represent separately.

Conceptual occurrence projection:

```text
{
    temporalPosition:
        current | upcoming | elapsed

    execution:
        completed | partial | skipped | notReported | unavailableProtected
}
```

Do not combine.

---

# 53. Explicit Odd Combinations

Do not reject mechanically possible states:

```text
current + completed
upcoming + completed
elapsed + notReported
```

unless canonical ExecutionHistory command semantics make them impossible.

Trust authority.

---

# 54. Elapsed Unreported

Mandatory:

```text
elapsed
+
notReported
```

remains exactly that.

Never convert to skipped.

---

# 55. Current Unreported

Mandatory:

```text
current
+
notReported
```

means only:

> scheduled interval currently overlaps evaluation time and no outcome report is known.

Do not say underway.

---

# 56. Republication

Same-day republication remains cutoff-governed.

Before later publication:

* old plan.

After later publication:

* new plan.

Do not merge both.

---

# 57. Old Execution Reports

Execution reports for occurrences absent from the current effective publication do not enter Today current-plan timeline.

They remain historical evidence elsewhere.

---

# 58. Visually Similar New Occurrence

If a republished occurrence has same:

* title;
* time;
* category;

but a different exact durable reference/incarnation:

old report does not migrate.

Mandatory test.

---

# 59. Timing Change Across Republication

Example:

```text
earlier V2 allDay
later V2 timed
```

Today before cutoff:

* allDay.

Today after cutoff:

* timed.

Likewise V1 → V2 transition:

before:

* timingUnavailableLegacy.

after:

* explicit timing.

---

# 60. Publication In Flight

Query reads only accepted HistoricalPlan state.

If new Preview exists but new publication is not yet accepted:

old published plan remains effective.

No Preview fallback.

---

# 61. Active Dependency Boundary

Today may depend on current authored/effective preferences only through the canonical user-day resolver.

It may not use Active to determine:

* plan occurrence title;
* plan occurrence timing;
* current commitment existence;
* execution state.

Document this narrow exception.

---

# 62. Preview Independence

Preview absent from Today query signature and core dependencies.

Add regression/property test where practical:

changing Preview cannot change Today result.

---

# 63. Goal Independence

No current Goal query.

Frozen Goal provenance may remain attached to HistoricalPlan occurrence if already present.

Task 6.9 owns contextual Goal composition.

---

# 64. Measurement Independence

No Measurement Definition query.

---

# 65. Observation Independence

No Progress Observation query.

---

# 66. Progress Independence

No Goal Progress query.

---

# 67. Goal Activity Independence

No Goal Activity query.

---

# 68. Friction Boundary

Do not infer friction from:

* unplaced;
* blocked;
* omitted;
* missing schedule.

Task 6.8 owns cross-surface friction convergence.

---

# 69. PlanDecision Boundary

Do not read PlanDecision directly.

Accepted changes should enter through HistoricalPlan publication.

---

# 70. Query Result Status Model

Design explicit result/status discriminants.

At minimum distinguish:

```text
available
planUnavailable
historicalPlanProtected
invalidQuery
```

and independently:

```text
executionAvailable
executionProtected
executionUnavailable
```

Use current application conventions.

---

# 71. Available Known-Empty

An available known-empty plan should still return a normal Today structure:

```text
allDay = []
timed = []
current = []
next = []
later = []
elapsed = []
```

plus explicit `planCoverage = knownEmpty/available`.

Do not confuse with planUnavailable.

---

# 72. Legacy Timing Coverage

If effective plan includes V1 occurrence(s), the overall Today result may still be available.

Expose per-occurrence timing uncertainty rather than suppressing the entire day.

---

# 73. Query Validation

Reject malformed evaluation instant through existing canonical query validation.

No uncaught `Date` coercion.

---

# 74. Determinism

Given:

* canonical authored preference state necessary for temporal partition;
* HistoricalPlan;
* ExecutionHistory;
* explicit evaluation instant;

Today result must be deterministic.

---

# 75. Clone Isolation

Returned Today model must be structurally independent of authority inputs.

Mandatory mutation test.

---

# 76. Input-Order Independence

HistoricalPlan/ExecutionHistory storage order must not change result.

Use canonical selection/order.

---

# 77. Application Query Boundary

Expose the full read model through canonical app/store query.

React must not later assemble:

```text
HistoricalPlan + ExecutionHistory + user-day
```

itself.

---

# 78. No Subscription Wiring Yet

Do not wire TodaySurface to the query in Task 6.3.

Task 6.4 owns UI subscription/query lifecycle.

---

# 79. Query Performance

Expected bounded shape:

```text
1 canonical user-day resolution
1 HistoricalPlan effective-day selection
1 bulk ExecutionHistory overlay
1 deterministic classification/sort
```

No per-row store query.

---

# 80. Local Pure Caching

If adjacent label resolution or execution projection benefits from bounded local memoization inside one query:

allowed.

Do not persist cache.

---

# 81. Restore

After Backup restore, the same authority + same evaluation instant should reproduce semantically equivalent Today result.

Add focused test if practical.

---

# 82. Full Clear

After full clear:

Today query should return truthful no-plan/unavailable authority state according to canonical readiness.

No Today participant exists to clear.

---

# 83. Persistence Boundary

No:

* Today IndexedDB store;
* localStorage;
* cache key;
* runtime transaction participant;
* migration.

---

# 84. Backup Boundary

Backup V6 remains unchanged.

Today is derived after restore.

---

# 85. Protection Boundary

No protected authority becomes empty.

HistoricalPlan protection and ExecutionHistory protection remain distinct.

---

# 86. Error Boundary

Expected absence/protection should be result states, not generic exceptions.

Unexpected internal invariant failures may throw/fail according to core conventions.

---

# 87. Test Fixtures — Temporal

Cover:

1. stable fixed-boundary day;
2. longer transition day;
3. shorter transition day;
4. exact canonical start;
5. exact canonical end;
6. overnight work;
7. DST where repository support permits.

---

# 88. Test Fixtures — Plan

Cover:

1. scheduled V2 timed;
2. scheduled V2 allDay;
3. mixed allDay/timed;
4. V1 legacy timing unavailable;
5. known empty;
6. missing publication;
7. protected HistoricalPlan.

---

# 89. Test Fixtures — Timed Classification

Cover:

* one current;
* multiple current;
* future only;
* tied next;
* later;
* all elapsed;
* exact start;
* exact end;
* cross-midnight.

---

# 90. Test Fixtures — Execution

Cover:

* no report;
* completed;
* partial;
* skipped;
* correction;
* retraction;
* protected ExecutionHistory;
* current completed;
* upcoming completed;
* elapsed notReported.

---

# 91. Test Fixtures — Republication

Cover:

* old plan before cutoff;
* new plan after cutoff;
* old report excluded;
* visually identical new occurrence distinct;
* V1 → V2 timing;
* V2 allDay → timed;
* V2 timed → allDay.

---

# 92. Test Fixtures — Independence

Changing:

* Preview;
* current manual event;
* Goal;
* Measurement;
* Observation;
* Summary projections;

must not change Today result.

Changing Active schedule content without HistoricalPlan republication must not change current plan contents.

Narrow exception:

* Active/effective preferences can alter which user-day the explicit instant belongs to.

Test/document separately.

---

# 93. Property Invariants

Where practical prove:

### A

Every query instant resolves to one canonical user-day.

### B

Today never reads Preview.

### C

Published-empty differs from missing.

### D

HistoricalPlan protection differs from missing.

### E

Execution protection differs from no report.

### F

V1 timing remains legacy unavailable.

### G

V2 allDay/timed remain explicit.

### H

all-day items are not placed in timed now/next/later.

### I

timed current overlap does not imply execution.

### J

elapsed notReported remains notReported.

### K

exact durable reference controls execution matching.

### L

republication changes plan only across cutoff.

### M

old reports do not migrate.

### N

input ordering does not affect result.

### O

clone/restore preserve result semantics.

---

# 94. Required Query Matrix

Produce:

| Input                  | Required? | Purpose                  |
| ---------------------- | --------: | ------------------------ |
| evaluationAsOf         |       yes | time/knowledge cutoff    |
| user-day date          |        no | derived                  |
| HistoricalPlan range   |        no | one resolved day         |
| ExecutionHistory range |        no | exact occurrence overlay |
| selected Goal          |        no | deferred                 |
| Preview                |        no | prohibited               |

---

# 95. Required Today Status Matrix

Produce:

| Plan state      | Execution state | Today result |
| --------------- | --------------- | ------------ |
| available       | available       |              |
| available       | protected       |              |
| known empty     | available       |              |
| missing         | available       |              |
| protected       | any             |              |
| malformed query | any             |              |

---

# 96. Required Timing Matrix

Produce:

| Snapshot  | Today timing state | Timed classification? |
| --------- | ------------------ | --------------------: |
| V1        | unavailableLegacy  |                    no |
| V2 allDay | allDay             |                    no |
| V2 timed  | timed              |                   yes |

---

# 97. Required Temporal Matrix

Produce:

| Interval relation  | Result          |
| ------------------ | --------------- |
| start <= now < end | current         |
| start > now        | upcoming        |
| end <= now         | elapsed         |
| two overlaps       | both current    |
| tied future start  | tied next group |
| after next tie     | later           |

---

# 98. Required Execution Matrix

Produce:

| Temporal | Execution evidence   | Result |
| -------- | -------------------- | ------ |
| current  | none                 |        |
| current  | completed            |        |
| elapsed  | none                 |        |
| elapsed  | skipped              |        |
| upcoming | completed            |        |
| upcoming | none                 |        |
| any      | effective retraction |        |
| any      | execution protected  |        |

---

# 99. Required Plan-Attention Matrix

Produce:

| Disposition |           Timeline? | Retained as attention evidence? | Inference      |
| ----------- | ------------------: | ------------------------------: | -------------- |
| scheduled   | yes if timed/allDay |                      yes/source | none           |
| unplaced    |                  no |                             yes | no cause       |
| omitted     |                  no |                             yes | no cause       |
| blocked     |                  no |                             yes | no blame/cause |

---

# 100. Required Republication Matrix

Produce:

| Cutoff                   | Plan | Timing | Execution linkage |
| ------------------------ | ---- | ------ | ----------------- |
| before republication     |      |        |                   |
| after republication      |      |        |                   |
| old report               |      |        |                   |
| new visually-similar ref |      |        |                   |

---

# 101. Required Provenance Matrix

Produce:

| Field                         | Retained? |
| ----------------------------- | --------: |
| evaluationAsOf                |           |
| userDayDate                   |           |
| canonical start/end           |           |
| duration                      |           |
| effective boundary            |           |
| weekStartsOn                  |           |
| plan publication ID           |           |
| publishedAt                   |           |
| exact occurrence ref          |           |
| frozen title/category/source  |           |
| occurrence version            |           |
| timing coverage/kind          |           |
| scheduled interval            |           |
| execution outcome             |           |
| execution evidence provenance |           |
| Preview identity              |        no |

---

# 102. Required Authority Matrix

Produce:

| Source                       |  Used? | Purpose                   |
| ---------------------------- | -----: | ------------------------- |
| Active/effective preferences | narrow | current user-day only     |
| HistoricalPlan               |    yes | current published plan    |
| ExecutionHistory             |    yes | explicit outcome evidence |
| PlanDecision                 |     no | indirect via publication  |
| Goal                         |     no | deferred                  |
| Measurement                  |     no | deferred                  |
| Observation                  |     no | deferred                  |
| Progress                     |     no | deferred                  |
| Goal Activity                |     no | deferred                  |
| Preview                      |     no | prohibited                |

---

# 103. Required Product-Boundary Matrix

Produce:

| Capability                 | Task 6.3    |
| -------------------------- | ----------- |
| current user-day           | Implemented |
| current published plan     | Implemented |
| all-day/timed distinction  | Implemented |
| current/next/later/elapsed | Implemented |
| execution overlay          | Implemented |
| plan attention             | Implemented |
| Today UI                   | Deferred    |
| Today outcome writes       | Deferred    |
| Goal context               | Deferred    |
| Progress context           | Deferred    |
| friction                   | Deferred    |
| same-day replanning        | Deferred    |
| new authority              | Prohibited  |
| persistence                | Prohibited  |

---

# 104. Required Epistemic Matrix

Produce:

| Evidence/state              | DayFrame may say                       | Must not say                        |
| --------------------------- | -------------------------------------- | ----------------------------------- |
| timed interval overlaps now | scheduled now                          | underway                            |
| timed interval elapsed      | elapsed                                | completed/skipped                   |
| no report                   | not reported                           | skipped                             |
| completed report            | explicitly reported completed          | Goal success                        |
| allDay V2                   | explicitly all-day planned occurrence  | user actually spent whole day on it |
| timed V2                    | explicitly timed                       | completed                           |
| V1 timing unavailable       | timing intent unavailable              | timed/all-day guess                 |
| known empty plan            | published plan contains no occurrences | free day                            |
| missing plan                | no published plan available            | nothing scheduled                   |
| execution protected         | outcome evidence unavailable           | not reported                        |
| republication               | later plan became effective            | earlier plan never existed          |

---

# 105. Architectural Invariants

Assess at minimum:

1. Today is derived.
2. Today is non-authoritative.
3. Today is non-persisted.
4. query time is explicit.
5. core never reads wall clock.
6. canonical piecewise user-day resolver is reused.
7. no fixed-boundary loop is reintroduced.
8. variable-duration days are supported.
9. HistoricalPlan is sole current-plan authority.
10. Preview is excluded.
11. current Active does not rewrite published plan.
12. Active is used only for temporal partition as required.
13. ExecutionHistory is sole outcome authority.
14. scheduled-now is not execution.
15. elapsed is not completed.
16. elapsed is not skipped.
17. no report is not skipped.
18. V1 timing remains unavailableLegacy.
19. V1 timing is not inferred.
20. V2 allDay remains explicit.
21. V2 timed remains explicit.
22. all-day items stay out of timed classification.
23. legacy items stay out of timed classification unless future policy explicitly says otherwise.
24. current timed is start <= now < end.
25. upcoming timed is start > now.
26. elapsed timed is end <= now.
27. multiple current occurrences are preserved.
28. simultaneous next occurrences are preserved.
29. deterministic ordering exists.
30. all-day ordering is deterministic.
31. published-empty differs from missing.
32. HistoricalPlan protection differs from missing.
33. ExecutionHistory protection differs from no report.
34. plan and execution availability are independent.
35. exact durable reference controls execution matching.
36. title/time matching is prohibited.
37. correction is cutoff-governed.
38. retraction is cutoff-governed.
39. republication is cutoff-governed.
40. old and new plan identities remain distinct.
41. old execution reports do not migrate.
42. current authored state does not reinterpret history.
43. current manual event does not reinterpret history.
44. PlanDecision is not read directly.
45. Goal is not queried.
46. Measurement is not queried.
47. Observation is not queried.
48. Progress is not queried.
49. Goal Activity is not queried.
50. Summary is not queried.
51. friction is not inferred.
52. unplaced remains unplaced.
53. omitted remains omitted.
54. blocked remains blocked.
55. no cause/blame inference exists.
56. plan-attention evidence is separate from timeline.
57. no Today UI exists.
58. no Today writes exist.
59. no current/next UI copy exists.
60. no Goal context UI exists.
61. no same-day replanning exists.
62. no transition-strategy behavior exists.
63. no Recommendation exists.
64. no Capacity exists.
65. no Goal reorientation exists.
66. no new authority exists.
67. no persistence key exists.
68. no DB migration exists.
69. Backup V6 remains unchanged.
70. restore re-derives Today.
71. full clear needs no Today participant.
72. clone isolation holds.
73. input-order independence holds.
74. query is bounded.
75. no N+1 store queries.
76. Today application query owns composition.
77. React will not need to compose raw authorities.
78. Task 6.2 surface architecture remains unchanged.
79. TodaySurface remains placeholder.
80. Planner remains unchanged.
81. Summary remains unchanged.
82. bundle budgets remain governing.
83. no unnecessary dependency is added.
84. canonical validation passes.
85. Task 6.4 becomes authorized only after this task completes.

---

# 106. Stop Conditions

Stop and report if:

* canonical Task 6.3B user-day resolver cannot be consumed without reinterpretation;
* effective HistoricalPlan day selection is ambiguous;
* mixed V1/V2 timing cannot be represented truthfully;
* V1 timing must be guessed to make Today usable;
* ExecutionHistory cannot resolve exact occurrence evidence in bulk;
* plan/execution protection cannot remain independent;
* exact occurrence matching is unavailable;
* same-day republication cannot remain cutoff-governed;
* query needs Preview;
* query needs new current-plan authority;
* query needs new in-progress authority;
* query needs persistence;
* Today semantics require Goal/Progress context to function.

Do not widen scope to bypass a blocker.

---

# 107. Focused Validation

Run focused suites covering:

* canonical user-day;
* HistoricalPlan effective selection;
* HistoricalPlan V1/V2 timing;
* ExecutionHistory effective outcomes;
* Today core read model;
* Today application query;
* republication;
* exact identity;
* protection;
* restore/full clear where touched.

Record exact files/test counts.

---

# 108. Full Validation

Before completion run:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Use repository-standard variants if names differ.

Record:

* test-file count;
* test count;
* build module count;
* initial raw;
* initial gzip;
* largest lazy;
* total JS;
* diff result.

---

# 109. Bundle Baseline

Current Task 6.3C output:

```text
Initial raw     682,220
Initial gzip    169,727
Largest lazy     30,091
Total JS        712,311
```

Budgets:

```text
Initial raw     <= 685,000
Initial gzip    <= 170,000
Largest lazy    <= 100,000
Total JS        <= 750,000
```

Headroom is now tight, particularly gzip.

Do not raise thresholds.

If Task 6.3 exceeds a budget:

1. inspect eager import placement;
2. determine whether Today query/core code is accidentally entering UI/shared initial paths unnecessarily;
3. preserve correctness;
4. report the budget failure if it cannot be resolved cleanly.

No architecture warning may be silenced by threshold inflation.

---

# 110. Manual Validation

No Today UI is authorized.

Manual product walkthrough:

> Not applicable to Task 6.3.

Do not claim visual Today validation.

---

# 111. Governance

Update:

* Task 6.3 result;
* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Task 6.3A ADRs remain governing.

Do not create another ADR unless implementation reveals a genuinely new enduring Today semantic decision.

---

# 112. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.3_CANONICAL_TODAY_CURRENT_USER_DAY_AND_CURRENT_PLAN_READ_MODEL_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Original Blocker Closure
4. Task 6.3B Confirmation
5. Task 6.3C Confirmation
6. Initial Source Audit
7. Files Changed
8. Module Placement
9. Query Contract
10. Query Time Semantics
11. Current User-Day Resolution
12. Variable-Duration Behavior
13. User-Day Provenance
14. HistoricalPlan Selection
15. Plan Authority
16. Published Empty
17. Missing Plan
18. HistoricalPlan Protection
19. Occurrence Scope
20. Plan Attention
21. Frozen Provenance
22. Timing Semantics
23. V1 Legacy Handling
24. All-Day Collection
25. Timed Collection
26. Current Semantics
27. Multiple Current
28. Next Semantics
29. Later Semantics
30. Elapsed Semantics
31. Ordering
32. Cross-Boundary Occurrences
33. Manual Events
34. Work
35. Sleep/Templates
36. Execution Overlay
37. Execution Cutoff
38. Outcome Categories
39. Not Reported
40. Correction
41. Retraction
42. Execution Protection
43. Partial Availability
44. Temporal/Execution Orthogonality
45. Republication
46. Exact Identity
47. Superseded Reports
48. Timing Change Across Republication
49. Publication In Flight
50. Active Dependency Boundary
51. Preview Independence
52. Goal Independence
53. Measurement Independence
54. Observation Independence
55. Progress Independence
56. Goal Activity Independence
57. Friction Boundary
58. PlanDecision Boundary
59. Query Status Model
60. Known-Empty Model
61. Legacy Timing Coverage
62. Determinism
63. Clone Isolation
64. Input-Order Independence
65. Application Query Boundary
66. Query Performance
67. Restore
68. Full Clear
69. Persistence Boundary
70. Backup Boundary
71. Protection/Error Boundary
72. Tests Added/Changed
73. Property Invariants
74. Focused Validation
75. Full Validation
76. Bundle Validation
77. Manual Validation
78. Governance Updates
79. ADR Determination
80. Deviations
81. Discoveries
82. Deferred Work
83. Query Matrix
84. Today Status Matrix
85. Timing Matrix
86. Temporal Matrix
87. Execution Matrix
88. Plan-Attention Matrix
89. Republication Matrix
90. Provenance Matrix
91. Authority Matrix
92. Product-Boundary Matrix
93. Epistemic Matrix
94. Architectural Invariant Assessment
95. Stop-Condition Assessment
96. Architectural Alignment Assessment
97. Task 6.4 Readiness
98. Recommended Next Task
99. Final Completion Determination

---

# 113. Task 6.4 Readiness

If Task 6.3 completes green:

> **Task 6.4 — Read-Only Today V1 Surface** is authorized.

Task 6.4 should consume only the canonical Today application query and present:

```text
Today

canonical current user-day

All day
    explicit all-day occurrences

Current
    timed intervals overlapping now

Next
    earliest tied upcoming group

Later
    remaining upcoming timed items

Earlier
    elapsed timed items where useful

Plan attention
    unplaced / omitted / blocked where product density permits

Execution state
    explicit report / not reported / unavailable
```

with no writes.

---

# 114. Recommended Next Task

If no new blocker appears:

> **Task 6.4 — Read-Only Today V1 Surface.**

Outcome-reporting writes remain Task 6.5.

---

# 115. Completion Criteria

Task 6.3 is complete only when:

* one canonical Today application query exists;
* explicit evaluation time governs both temporal and knowledge semantics;
* canonical Task 6.3B user-day resolution is reused;
* variable-duration current user-days work;
* exact canonical start/end are retained;
* HistoricalPlan is sole current-plan authority;
* Preview is never consulted;
* effective publication uses canonical as-of selection;
* known-empty differs from missing;
* HistoricalPlan protection differs from missing;
* scheduled/unplaced/omitted/blocked remain distinct;
* timeline uses scheduled occurrences only;
* V2 all-day remains explicit;
* V2 timed remains explicit;
* V1 timing remains unavailableLegacy;
* V1 is never guessed;
* all-day does not enter timed current/next/later;
* timed occurrences classify current/upcoming/elapsed deterministically;
* multiple current overlaps are retained;
* simultaneous next ties are retained;
* later/elapsed are deterministically ordered;
* ExecutionHistory overlays exact occurrence identities in bulk;
* no report remains notReported;
* completed/partial/skipped remain explicit evidence;
* correction/retraction follow as-of semantics;
* ExecutionHistory protection does not fabricate notReported;
* plan remains usable when execution evidence is independently protected where supported;
* temporal position and execution outcome remain orthogonal;
* elapsed-unreported does not become skipped;
* current-unreported does not become underway;
* same-day republication is cutoff-governed;
* old-plan reports do not migrate to new occurrences;
* timing changes across republication follow cutoff;
* current authored state cannot reinterpret frozen plan evidence;
* Active dependency is limited to canonical user-day resolution;
* Goal/Measurement/Observation/Progress/Goal Activity/Summary are not queried;
* friction is not inferred;
* PlanDecision is not queried directly;
* result is deterministic;
* clone isolation holds;
* input ordering does not affect result;
* query complexity is bounded;
* no new authority/persistence/schema/Backup version exists;
* restore re-derives Today;
* full clear needs no Today participant;
* no Today UI is added;
* no Today writes are added;
* Task 6.2 surface architecture remains unchanged;
* bundle budgets remain green or any overrun is explicitly resolved without threshold inflation;
* focused and canonical validation pass;
* Task 6.4 is cleared to render the model.

---

# 116. Final Implementation Principle

> **Today should report exactly what DayFrame knows about the current user-day: the canonical temporal window, the published plan effective now, the timing intent frozen with each occurrence, and the explicit execution evidence known by this cutoff—without converting time into claims about behavior.**

---

# 117. Final Completion Statement

**Task 6.3 is complete when DayFrame implements one deterministic, non-authoritative, non-persisted Today read model that uses the canonical piecewise variable-duration user-day resolver established by Task 6.3B, selects the exact HistoricalPlan publication effective for that label and evaluation cutoff, preserves published-empty versus missing versus protected plan states, keeps scheduled/unplaced/omitted/blocked plan dispositions distinct, consumes HistoricalPlan V2 timing provenance so explicit all-day occurrences remain separate from timed current/next/later/elapsed classification while V1 timing remains honestly unavailableLegacy, retains frozen exact occurrence identity and provenance without current-state enrichment, overlays the canonical effective ExecutionHistory outcome by exact durable reference so completed/partial/skipped/not-reported/corrected/retracted/protected evidence remains orthogonal to temporal position, preserves elapsed-unreported as unreported rather than skipped and current-unreported as merely scheduled now rather than underway, handles multiple current occurrences and tied next starts without evidence loss, respects same-day republication and knowledge cutoffs, prevents old-plan reports from migrating to visually similar new occurrences, excludes Preview, Goal, Measurement Definition, Progress Observation, Goal Activity, Summary projections, friction, and direct PlanDecision interpretation, exposes bounded plan-attention evidence without causal inference, remains deterministic, clone-isolated, input-order independent, bounded in query complexity, re-derivable after restore and naturally unavailable after full clear, introduces no Today authority, persistence, Backup version, UI, reporting action, Goal context, same-day replanning, Recommendation, Capacity, transition strategy, or adaptive behavior, passes focused/canonical validation and the governing bundle budgets without raising thresholds, and leaves Task 6.4 as the first task authorized to render the Today model.**
