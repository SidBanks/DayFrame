# Task 4.2 — Implement Historical Coverage and Completion Distribution Projection V1

## Status

Ready for implementation.

## Phase

Phase 4 — Historical Intelligence

## Task Type

Core projection implementation, application-query composition, semantic contract implementation, deterministic provenance, and regression coverage.

---

# 1. Context

Task 4.1 completed the Phase 4 architecture definition and Historical Metrics Semantics Audit with:

> **Determination A — Ready for Historical Intelligence implementation.**

Phase 3 already provides the historical authority required by the first Phase 4 analytical projection:

* HistoricalPlan V1 is the sole authority for what was planned.
* ExecutionHistory V1 is the sole authority for what was observed.
* `DurableOccurrenceReference` provides exact lifetime-safe correlation between planned and observed occurrences.
* HistoricalPlan provides complete-day publication semantics and distinguishes:

  * published days;
  * published-empty days;
  * missing days.
* HistoricalPlan preserves frozen:

  * `userDayDate`;
  * source incarnation;
  * source family;
  * source title;
  * category;
  * effective day boundary;
  * week-start context;
  * UTC offset;
  * scheduled interval where applicable.
* ExecutionHistory preserves immutable assertion, correction, and retraction evidence.
* Effective outcome projection identifies the current evidence state of an execution subject.
* Backup V3, restore, restart, and full-clear preserve the underlying authorities.

Task 4.1 established that Historical Intelligence is not a third authority.

It is:

> **a pure, deterministic, explicitly policy-versioned projection over HistoricalPlan and ExecutionHistory.**

No Historical Intelligence persistence surface is authorized.

Task 4.2 implements the first proof of that architecture.

---

# 2. Purpose

Implement the first bounded Historical Intelligence projection:

> **Historical Coverage and Completion Distribution V1**

The projection must answer two related but distinct questions.

### Question A — What plan authority exists for the requested historical window?

This produces HistoricalPlan coverage.

### Question B — For eligible scheduled planned occurrences in the known historical plan, what is the current effective execution-evidence distribution?

This produces Completion Distribution V1.

The result must preserve uncertainty rather than converting missing evidence into apparent failure.

---

# 3. Core Semantic Principle

The implementation must preserve:

```text
what was planned
      ↓
HistoricalPlan

what was observed
      ↓
ExecutionHistory

what can be described from both
      ↓
Historical Intelligence
```

Historical Intelligence must not mutate either authority and must not become independently authoritative.

---

# 4. Required V1 Distinctions

Task 4.2 must preserve all of the following as semantically different:

```text
HistoricalPlan day:

published with occurrences
published empty
missing
```

and:

```text
eligible scheduled occurrence:

completed
partial
skipped
unknown
not reported
```

These distinctions must survive through the public projection result.

---

# 5. Governing Task 4.1 Decisions

Treat the following Task 4.1 decisions as accepted architecture, not matters to redesign during implementation:

1. Historical Intelligence V1 is purely derived.
2. HistoricalPlan remains the sole planned-history authority.
3. ExecutionHistory remains the sole observed-history authority.
4. HistoricalMetricPolicy V1 is explicit.
5. There is no universal historical denominator.
6. Completion Distribution V1 uses effective scheduled planned occurrences.
7. Unplaced is not completion-distribution eligible.
8. Omitted is not completion-distribution eligible.
9. Blocked is not completion-distribution eligible.
10. Completed remains a separate categorical outcome.
11. Partial remains a separate categorical outcome.
12. Partial receives no arbitrary fractional weight.
13. Skipped remains a separate categorical outcome.
14. Effective unknown is distinct from skipped.
15. Not reported is distinct from unknown.
16. No report is not failure.
17. Missing plan coverage is not zero planned work.
18. Published-empty coverage is known zero planned work.
19. Zero eligible denominator is `notApplicable`, not 0%.
20. Corrections change effective analytical classification without changing plan eligibility.
21. Retractions produce effective unknown rather than skipped or not reported.
22. Exact plan/execution joins use durable occurrence identity including source incarnation.
23. Current Active state must not reinterpret historical facts.
24. Frozen historical grouping context is authoritative for historical explanation.
25. V1 is current-evidence analysis over an explicit historical occurrence window.
26. Relative windows are resolved outside the pure projection.
27. Metrics expose coverage and provenance.
28. Metrics do not imply causality.
29. Metrics are not Goals.
30. Metrics are not Progress.
31. Metrics are not Recommendations.
32. No automatic learning is introduced.

---

# 6. Execution Artifact Rules

Before implementation:

1. verify this supplied Task 4.2 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 4.1 result;
   * Task 4.1 Historical Intelligence ADR;
   * Task 4.1 Phase 4 checkpoint;
   * current `CURRENT_STATE.md`;
   * current `ROADMAP.md`;
   * HistoricalPlan domain types and projections;
   * HistoricalPlan publication/as-of selection;
   * ExecutionHistory domain types;
   * effective-outcome projection;
   * `DurableOccurrenceReference`;
   * Backup V3 roundtrip coverage;
   * five-authority full-clear coverage;
6. do not modify the immutable Task 4.2 artifact during execution.

Create:

`docs/implementation/phase-4/TASK_4.2_IMPLEMENT_HISTORICAL_COVERAGE_AND_COMPLETION_DISTRIBUTION_PROJECTION_V1_RESULT.md`

---

# 7. Initial Implementation Audit

Before adding code, identify the existing canonical APIs for:

* querying HistoricalPlan by user-day range;
* selecting effective HistoricalPlan publication as of a cutoff;
* distinguishing missing and published-empty days;
* enumerating effective historical occurrences;
* identifying scheduled/unplaced/omitted/blocked states;
* obtaining `DurableOccurrenceReference`;
* querying ExecutionHistory;
* selecting current effective execution outcome;
* identifying correction and retraction heads;
* comparing durable occurrence references;
* retrieving frozen source/category context.

Reuse existing canonical behavior.

Do not recreate Phase 3 historical semantics in a parallel implementation.

---

# 8. Stop Conditions

Stop and report rather than improvising if implementation proves that any accepted Task 4.1 assumption is false.

Stop if:

* HistoricalPlan cannot reliably enumerate requested user-day coverage;
* published-empty cannot be distinguished from missing;
* effective plan revision cannot be selected at the explicit cutoff;
* scheduled occurrence identity is insufficient for exact execution joins;
* ExecutionHistory cannot distinguish no subject from retracted subject;
* effective current outcome cannot be projected deterministically;
* correction/retraction semantics contradict Task 4.1;
* source incarnation is missing from the join path;
* implementing the projection requires changing HistoricalPlan or ExecutionHistory authority;
* implementing V1 requires a new persistence surface;
* implementing V1 requires modifying Backup V3;
* implementing V1 requires schema/domain-version changes;
* current source code materially contradicts Task 4.1 semantics.

A correct stop is preferable to silently changing the architecture.

---

# 9. HistoricalMetricPolicy V1 Identity

Introduce the minimum explicit policy identity required by Task 4.1.

Conceptually:

```text
HistoricalMetricPolicy V1
```

The implementation may choose the most appropriate existing DayFrame naming/type convention.

Requirements:

* policy identity must be explicit in the projection contract;
* policy identity must be deterministic;
* it must not be stored as historical authority;
* it must not require a persistence migration;
* callers must be able to identify which semantic policy produced a result.

Do not build a generic policy-plugin system.

---

# 10. Query Contract

Define a narrow explicit query for Completion Distribution V1.

At minimum it must resolve:

```text
startUserDayDate
endUserDayDate
evaluationAsOf
metric policy
```

Requirements:

* start/end are inclusive;
* dates use DayFrame's canonical user-day date representation;
* `evaluationAsOf` is explicit;
* the pure projection does not read the wall clock;
* invalid ranges fail deterministically;
* relative expressions such as `last30Days` do not belong inside the pure core projection.

Do not add weekly/monthly/cycle shortcuts in this task.

---

# 11. Evaluation-As-Of Semantics

Use Task 4.1 V1 semantics:

> Plan authority is selected as of the explicit evaluation cutoff, while current effective execution evidence is used for the selected historical occurrences.

This is **not** historical execution-belief-as-of.

Do not claim to answer:

> What did DayFrame believe about execution on that historical date?

That mode remains unsupported.

Name APIs/types carefully enough that this limitation is not obscured.

---

# 12. HistoricalPlan Range Resolution

For every requested `userDayDate` in the inclusive query window, determine the effective HistoricalPlan state as of `evaluationAsOf`.

Each requested day must classify as exactly one of:

```text
published
publishedEmpty
missing
```

If existing HistoricalPlan APIs expose these concepts differently, preserve their canonical semantics rather than forcing these exact internal names.

---

# 13. Published Day

A published day with one or more effective occurrences proves HistoricalPlan authority for that day.

It contributes:

* one published day to coverage;
* its effective occurrence set to analytical consideration.

---

# 14. Published-Empty Day

A published-empty day proves:

```text
known plan authority
+
zero effective planned occurrences
```

It contributes:

* one published day;
* one published-empty day;
* zero eligible scheduled occurrences.

It must not be classified as missing.

---

# 15. Missing Day

A missing day means:

> HistoricalPlan does not provide authoritative plan coverage for that requested user-day at the evaluation cutoff.

It contributes:

* one expected day;
* one missing day;
* no inferred occurrences.

It must not imply:

* zero demand;
* zero completion;
* failure;
* perfect execution.

---

# 16. Historical Plan Coverage Result

Expose deterministic plan-coverage information sufficient to communicate:

* expected day count;
* published day count;
* published-empty day count;
* missing day count;
* missing user-day dates;
* whether coverage is complete.

If useful for provenance, also expose published dates or publication identities, but avoid unnecessary duplication.

---

# 17. Coverage Status

Define a small explicit coverage status.

At minimum distinguish:

```text
complete
incompleteCoverage
unavailable
```

or equivalent semantics justified by the implementation.

The exact naming may follow project conventions.

Requirements:

* complete means all requested days have authoritative publication;
* incomplete means at least one but not all requested days are missing;
* unavailable means no requested day has plan authority.

Do not label partial coverage as complete merely because known days can be analyzed.

---

# 18. Effective Plan Selection

Where multiple HistoricalPlan publications affect the same day, use the latest effective publication visible at `evaluationAsOf` according to existing HistoricalPlan semantics.

Do not invent a second revision-selection algorithm.

---

# 19. Completion-Distribution Eligibility

Only effective **scheduled** HistoricalPlan occurrences are eligible for Completion Distribution V1.

Explicitly exclude:

* unplaced;
* omitted;
* blocked.

Their exclusion must be explainable/provenance-bearing.

Do not silently discard them without reason information if the existing model permits deterministic exclusion provenance.

---

# 20. Scheduled Occurrence Eligibility

A scheduled occurrence contributes exactly once to the completion-distribution denominator.

Eligibility derives from the effective HistoricalPlan selected for its user-day.

Do not derive eligibility from:

* current Active;
* current templates;
* current schedule preview;
* current source existence;
* ExecutionHistory existence.

---

# 21. Exact Execution Join

Join HistoricalPlan scheduled occurrences to ExecutionHistory using the canonical durable occurrence reference.

The join must include source-incarnation identity.

Never join using only:

* source ID;
* title;
* category;
* date;
* approximate timestamp.

A deleted/recreated source must not retarget historical execution evidence.

---

# 22. Execution Subject Selection

For each eligible scheduled occurrence:

1. determine whether ExecutionHistory contains the corresponding subject;
2. if no subject exists, classify as `notReported`;
3. if a subject exists, obtain its current effective outcome using canonical ExecutionHistory revision semantics.

Do not treat absence and retraction as equivalent.

---

# 23. Completed Classification

If current effective evidence says completed:

```text
completed += 1
```

Do not infer:

* quality;
* exact timing;
* duration;
* degree of success.

---

# 24. Partial Classification

If current effective evidence says partial:

```text
partial += 1
```

Do not convert it to:

* 0.5 completed;
* planned-duration fraction;
* inferred actual minutes.

---

# 25. Skipped Classification

If current effective evidence says skipped:

```text
skipped += 1
```

Do not infer:

* reason;
* blame;
* cancellation semantics;
* rescheduling;
* motivation.

---

# 26. Unknown Classification

If the corresponding ExecutionHistory subject exists but its current effective head is a retraction/unknown state:

```text
unknown += 1
```

Unknown means:

> DayFrame knows that current observation knowledge for this subject has been withdrawn.

It is not:

* skipped;
* failed;
* partial;
* not reported.

---

# 27. Not-Reported Classification

If no corresponding ExecutionHistory subject exists:

```text
notReported += 1
```

This means only:

> no current ExecutionHistory subject joins this eligible planned occurrence.

Do not name this field:

* missed;
* incomplete;
* failed;
* ignored.

---

# 28. Distribution Conservation Invariant

For complete classification of known eligible occurrences:

```text
eligibleScheduledCount
=
completed
+ partial
+ skipped
+ unknown
+ notReported
```

This invariant must be asserted in tests.

If the actual ExecutionHistory API reveals another effective state, stop rather than hiding it.

---

# 29. Current-Outcome Coverage

Implement Task 4.1's current-outcome coverage semantics.

Classified current outcomes are:

```text
completed
partial
skipped
```

Current-outcome coverage numerator:

```text
completed + partial + skipped
```

Denominator:

```text
eligibleScheduledCount
```

Retracted `unknown` does not count as a current classified outcome.

`notReported` does not count as a current classified outcome.

---

# 30. Zero-Denominator Behavior

If:

```text
eligibleScheduledCount === 0
```

then current-outcome coverage is:

```text
notApplicable
```

or an equivalent explicit nonnumeric state.

Do not return:

```text
0
0%
1
100%
NaN
Infinity
```

as a semantic substitute.

---

# 31. Coverage Value Representation

Prefer a representation that preserves counts rather than prematurely introducing display rounding.

Conceptually:

```text
classifiedCount
eligibleCount
status
```

A ratio may be derived if the architecture already has a safe exact representation.

Task 4.2 does not need UI-ready percentages.

---

# 32. Incomplete Plan Coverage

When HistoricalPlan coverage is incomplete:

* compute deterministic counts over known published plan authority;
* explicitly mark the requested window as incomplete;
* include missing user-day dates;
* state through machine-readable limitation/reason semantics that results do not describe the entire requested window;
* do not extrapolate into missing days.

Do not silently return a window-wide percentage.

---

# 33. Unavailable Plan Coverage

If no requested user-day has HistoricalPlan authority:

* return plan coverage as unavailable;
* return zero known eligible scheduled occurrences;
* return completion distribution in an explicitly unavailable/not-applicable state;
* do not pretend the requested window contained no planned work.

---

# 34. Completion Distribution Result

Design a narrow explicit result contract.

It should contain, directly or through nested structures, at least:

```text
metric identity
policy identity/version
resolved query
plan coverage
eligible scheduled count
completed count
partial count
skipped count
unknown count
not-reported count
current-outcome coverage
limitations
provenance
```

Use project naming conventions.

Do not build a generic arbitrary-metric result framework.

---

# 35. Metric Identity

Completion Distribution V1 must have a stable explicit metric identity distinct from the policy identity.

Conceptually:

```text
completionDistribution.v1
```

Exact representation may follow existing DayFrame conventions.

This identity is analytical metadata, not durable historical authority.

---

# 36. Provenance

The projection must preserve enough provenance to explain its result.

At minimum support deterministic identification of:

* contributing eligible scheduled references;
* their final categorical classification;
* excluded effective planned occurrences where appropriate;
* exclusion reason;
* missing plan days;
* plan publication/revision evidence sufficient to explain effective selection.

Do not require UI drill-down yet.

---

# 37. Provenance Shape

Prefer stable machine-readable reason codes over explanation strings as the semantic core.

Possible conceptual examples:

```text
eligibleScheduled
excludedUnplaced
excludedOmitted
excludedBlocked
completed
partial
skipped
unknownRetracted
notReported
missingPlanCoverage
```

Exact names may differ.

Human-readable UI copy is not the authority.

---

# 38. Frozen Historical Explanation

Any source/category/title information included for explanation must come from the frozen historical snapshot.

Do not query current Active to decorate or reinterpret old occurrences.

---

# 39. Deterministic Ordering

Define canonical ordering for provenance collections.

Prefer an order based on stable historical fields such as:

```text
userDayDate
scheduled start where present
durable occurrence identity
```

Do not rely on:

* object insertion order from unrelated sources;
* IndexedDB retrieval accident;
* current wall-clock time.

Repeated evaluation of identical evidence must produce structurally identical results.

---

# 40. Clone Isolation

Projection results must not expose mutable references into HistoricalPlan or ExecutionHistory internal state.

Use existing clone/immutable conventions.

Mutating a returned projection must not mutate historical authority.

---

# 41. Pure Core Projection

Implement the semantic transformation as a pure core function where practical.

Conceptually:

```text
effective historical plan evidence
+
effective execution evidence
+
resolved query
+
HistoricalMetricPolicy V1
      ↓
completion distribution result
```

The pure layer must not:

* access IndexedDB;
* access localStorage;
* read the wall clock;
* mutate store state;
* publish history;
* report execution;
* allocate domain IDs;
* allocate domain timestamps.

---

# 42. Application Query Composition

If storage/query composition is required, place it outside the pure semantic projection.

The application/query layer may:

* fetch bounded HistoricalPlan evidence;
* fetch relevant ExecutionHistory evidence;
* compose canonical effective inputs;
* invoke the pure projection.

Infrastructure must not own metric meaning.

---

# 43. Explicit Projection Over Generic Engine

Do not create a generic arbitrary metric engine.

Task 4.1 deliberately selected explicit governed projections.

Shared helpers are acceptable for:

* date-range enumeration;
* coverage calculation;
* durable-reference comparison;
* deterministic ordering;
* provenance construction.

But public semantics must remain Completion Distribution V1.

---

# 44. No Metric Persistence

Do not add:

* localStorage metric keys;
* IndexedDB metric stores;
* Zustand metric authority;
* metric hydration;
* metric migrations.

The result is derived on demand.

---

# 45. Backup V3 Boundary

Do not modify Backup V3.

Historical Intelligence output must be reproducible from restored:

```text
HistoricalPlan
+
ExecutionHistory
```

under the same policy/query.

---

# 46. Restore Equivalence

Add or reuse tests proving that equivalent restored historical authority produces equivalent Completion Distribution V1 output.

This does not require adding metric data to Backup V3.

Prefer testing semantic equivalence rather than byte identity where existing restore fixtures make that appropriate.

---

# 47. Full-Clear Boundary

After the existing five-authority full clear:

* no stale Historical Intelligence result may survive as authority;
* a new query naturally reflects cleared HistoricalPlan/ExecutionHistory;
* no sixth metric clear participant exists.

If UI/store caching currently risks stale results, stop and identify the architectural issue rather than introducing metric authority.

---

# 48. Current Active Independence

Add regression evidence that changing or deleting current Active authored state does not change historical projection results for unchanged HistoricalPlan/ExecutionHistory.

Historical Intelligence reads historical snapshots, not present authored intent.

---

# 49. Source Recreation Safety

Add a regression case where:

1. a historical occurrence belongs to source incarnation A;
2. current/recreated source uses the same logical source ID but incarnation B;
3. ExecutionHistory evidence exists for one lifetime;
4. the projection joins only the exact durable occurrence reference.

No cross-incarnation retargeting is permitted.

---

# 50. Correction Behavior

Add a test where an eligible occurrence initially has one assertion and later a correction.

The projection must use the current effective corrected outcome.

Example semantic transition:

```text
partial
   ↓ correction
completed
```

Expected:

* denominator unchanged;
* partial decreases;
* completed increases;
* provenance points to current effective classification;
* immutable historical evidence remains untouched.

---

# 51. Retraction Behavior

Add a test where an eligible occurrence's current head is a retraction.

Expected:

```text
unknown += 1
```

and:

```text
notReported does not increase
skipped does not increase
current-outcome classified count decreases
```

---

# 52. No-Report Behavior

Add a scheduled occurrence with no ExecutionHistory subject.

Expected:

```text
notReported += 1
```

Do not manufacture an ExecutionHistory record to represent absence.

---

# 53. Published-Empty Behavior

Add a published-empty day.

Expected:

* day counts as covered;
* published-empty count increases;
* eligible scheduled denominator does not increase;
* no fake not-reported occurrences are created.

---

# 54. Missing-Day Behavior

Add a missing requested user-day.

Expected:

* expected day count includes it;
* missing count/list includes it;
* known-day metrics remain calculable where applicable;
* result carries incomplete coverage;
* no zero-demand inference is introduced.

---

# 55. Zero-Occurrence Complete Window

Test a fully covered window consisting entirely of published-empty days.

Expected:

```text
plan coverage = complete
eligibleScheduledCount = 0
completion distribution = notApplicable
current-outcome coverage = notApplicable
```

This is different from unavailable plan coverage.

---

# 56. Unavailable Window

Test a requested range with no HistoricalPlan publication.

Expected:

```text
plan coverage = unavailable
```

Do not report this as a completely covered zero-occurrence window.

---

# 57. Mixed Plan States

Create a semantic fixture containing:

```text
scheduled
unplaced
omitted
blocked
```

Expected:

* only scheduled contributes to Completion Distribution denominator;
* other states appear only in exclusion/provenance as appropriate;
* none is converted to execution failure.

---

# 58. All Outcome States Fixture

Create a fixture with scheduled occurrences representing:

```text
completed
partial
skipped
unknown
not reported
```

Expected conservation:

```text
eligible = 5
distribution total = 5
```

and classified current-outcome coverage numerator:

```text
3
```

---

# 59. Plan Republication

Test multiple HistoricalPlan publications affecting the same user-day.

The query must select the effective plan visible at `evaluationAsOf`.

At minimum test:

```text
evaluation before republication
evaluation after republication
```

The selected denominator may differ if the effective publication differs.

Do not mutate either publication.

---

# 60. Explicit Cutoff

Ensure tests do not depend on `Date.now()`.

Use explicit deterministic timestamps.

The same query and evidence must always select the same plan revision.

---

# 61. User-Day Boundary

Add coverage proving overnight occurrences remain associated with their frozen `userDayDate`.

Do not regroup them according to calendar midnight.

---

# 62. Timezone Independence

Where current historical fixtures support it, prove that changing current timezone/preferences does not move old occurrences between historical user-day windows.

Do not undertake unrelated timezone refactoring.

If current APIs make this impossible to test cleanly, document the existing Phase 3 guarantee relied upon.

---

# 63. DST-Adjacent Scheduled Duration

Task 4.2 does not implement planned-allocation metrics.

Do not add duration analysis merely because scheduled intervals exist.

If duration appears in provenance, preserve canonical instants without interpreting them as actual execution duration.

---

# 64. Category/Source Data

Completion Distribution V1 does not require grouping by category/source.

If frozen category/source information is included in provenance, treat it as explanation only.

Do not introduce grouped metric variants in Task 4.2.

---

# 65. Counts Before Percentages

The canonical result must expose counts.

Do not make a completion percentage the primary output.

If any share/ratio is implemented:

* it must be derived from explicit counts;
* it must obey zero-denominator semantics;
* it must be withheld as a window-wide claim under incomplete plan coverage where required by Task 4.1.

A percentage is not required for Task 4.2 completion.

---

# 66. No Adherence Score

Do not introduce:

* adherence percentage;
* success score;
* productivity score;
* discipline score;
* consistency score;
* DayFrame score.

Task 4.2 is categorical and descriptive.

---

# 67. No Scheduling Realization Metric Yet

Although Task 4.2 encounters unplaced/omitted/blocked occurrences, do not implement the separate Scheduling Realization projection.

Their presence is needed only for:

* eligibility filtering;
* exclusion provenance;
* semantic regression coverage.

Scheduling Realization remains a later task.

---

# 68. No Planned Allocation Metric Yet

Do not aggregate scheduled minutes by category/source in Task 4.2.

That is a separate projection.

---

# 69. No Trends or Comparisons

Do not implement:

* this week vs last week;
* rolling trend;
* improving/declining;
* source comparison;
* category comparison;
* weekday comparison.

Task 4.2 evaluates one explicit historical window.

---

# 70. No Goals

Do not add Goal models, targets, persistence, UI, or evaluation.

---

# 71. No Progress

Do not label completion distribution as Progress.

Progress requires future Goal semantics.

---

# 72. No Recommendations

Do not produce scheduling recommendations from the result.

---

# 73. No Automatic Learning

Do not automatically alter:

* priorities;
* durations;
* recurrence;
* preferred windows;
* templates;
* scheduling weights.

---

# 74. No UI Expansion

Task 4.2 is a projection/API implementation task.

Do not build the full Historical Intelligence UI.

A minimal development/debug integration is permitted only if genuinely necessary to prove application composition and if it does not create a new product surface.

Prefer tests over temporary UI.

---

# 75. Historical Reporting Compatibility

Audit the existing bounded historical reporting UI/query path.

Do not break it.

If appropriate, reuse shared HistoricalPlan/ExecutionHistory retrieval helpers beneath both systems.

Do not silently replace existing reporting semantics with Completion Distribution V1 unless explicitly justified.

---

# 76. Error Handling

Invalid analytical queries must fail deterministically.

At minimum audit:

* malformed user-day date;
* start after end;
* malformed `evaluationAsOf`;
* unsupported policy identity if externally selectable;
* structurally invalid projection input where public boundaries require validation.

Follow existing DayFrame error/result conventions.

---

# 77. Protected Authority

Audit behavior if HistoricalPlan or ExecutionHistory is in an existing protected/recovery-required state.

Do not reinterpret protected authority as empty history.

If canonical historical APIs already prevent reads, propagate the appropriate unavailable/protected result.

If the current architecture cannot distinguish this safely, stop.

---

# 78. Quarantine

ExecutionHistory quarantine is governed evidence but not ordinary effective outcome authority.

Do not classify quarantined invalid evidence as:

* completed;
* partial;
* skipped;
* unknown;
* not reported merely because quarantine exists.

Use canonical ExecutionHistory authority APIs.

If a quarantined item makes subject truth unavailable in a way Task 4.1 did not anticipate, document and stop if necessary.

---

# 79. Result Limitations

Use machine-readable limitations where possible.

Potential semantic limitations include:

```text
incompletePlanCoverage
noPlanCoverage
zeroEligibleOccurrences
protectedHistoricalAuthority
```

Do not rely only on prose strings.

Exact taxonomy should remain minimal.

---

# 80. Explainability Contract

The result must make it possible for a future UI to answer:

> Why does DayFrame show these counts?

Without querying current Active or reconstructing history heuristically.

At minimum the result/provenance must support tracing:

```text
count
  ↓
eligible historical occurrence
  ↓
effective execution classification
```

or:

```text
excluded occurrence
  ↓
historical plan state
  ↓
exclusion reason
```

---

# 81. Golden Semantic Fixtures

Create reusable human-readable fixtures where appropriate.

At minimum cover:

1. fully reported covered window;
2. partially reported covered window;
3. missing plan coverage;
4. published-empty window;
5. mixed plan-state window;
6. corrected execution;
7. retracted execution;
8. source recreation/incarnation mismatch;
9. plan republication.

Prefer fixtures that can support later Phase 4 projections without coupling them to UI.

---

# 82. Property-Level Invariants

Where practical, add tests for the following:

### Invariant A

Adding a classified execution report to a previously not-reported eligible occurrence cannot reduce current-outcome coverage.

### Invariant B

Correction cannot change HistoricalPlan eligibility.

### Invariant C

Retraction changes a classified current outcome to unknown, not not-reported.

### Invariant D

Changing current Active cannot change the projection for unchanged historical authority.

### Invariant E

Published-empty coverage increases/maintains plan coverage without creating demand.

### Invariant F

Missing HistoricalPlan coverage never becomes zero-demand evidence.

### Invariant G

Input ordering does not change output.

### Invariant H

Backup V3 authority roundtrip preserves projection output.

### Invariant I

Full clear leaves no historical analytical authority to project.

---

# 83. Determinism Test

Add a direct deterministic test:

```text
same historical authority
+
same policy
+
same query
=
deeply equal projection
```

Run with deliberately permuted retrieval/input ordering if practical.

---

# 84. Mutation Isolation Test

Where projection results contain arrays/objects copied from historical evidence:

1. obtain result;
2. mutate returned result/provenance in test;
3. query/project again;
4. verify authority and subsequent result remain unchanged.

---

# 85. Performance

Do not introduce caches.

Use bounded historical queries and existing indexes.

If implementation reveals a demonstrable pathological query shape, document it in the result and recommend later optimization.

Do not add persistence to solve speculative performance concerns.

---

# 86. Data Volume

Assume local personal-history scale consistent with DayFrame's existing architecture.

Do not optimize for multi-user server analytics or enterprise workloads.

---

# 87. Privacy

No telemetry or network processing.

Historical Intelligence remains local.

---

# 88. Files and Module Placement

Follow existing architecture discovered during the initial audit.

Likely responsibilities:

```text
core historical-intelligence projection
application historical-intelligence query/composition
tests/fixtures
```

Do not force these exact directories if current project conventions indicate a better placement.

Document the chosen placement and why it aligns with existing boundaries.

---

# 89. Public API Scope

Expose only the API necessary for this projection.

Avoid exporting low-level helpers unless another existing subsystem genuinely needs them.

Do not create a general analytics SDK.

---

# 90. Type Scope

Introduce only types required to represent:

* policy identity;
* resolved query;
* plan coverage;
* completion distribution;
* current-outcome coverage;
* provenance;
* limitations.

Avoid speculative types for future:

* Goals;
* Progress;
* trends;
* recommendations;
* composite metrics;
* scheduling realization;
* allocation.

---

# 91. Domain Version

Do not increment HistoricalPlan or ExecutionHistory domain versions unless implementation proves a genuine authority-schema requirement.

Such a requirement should trigger a stop rather than an incidental version change inside Task 4.2.

---

# 92. Persistence Version

Do not change:

* IndexedDB physical version;
* localStorage keys;
* Backup V3 format/version.

Any such need triggers a stop-condition review.

---

# 93. Tests Required

At minimum provide direct coverage for:

* query validation;
* complete plan coverage;
* incomplete plan coverage;
* unavailable plan coverage;
* published-empty;
* zero eligible denominator;
* scheduled eligibility;
* unplaced exclusion;
* omitted exclusion;
* blocked exclusion;
* completed;
* partial;
* skipped;
* unknown/retracted;
* not reported;
* distribution conservation;
* current-outcome coverage;
* correction;
* retraction;
* exact durable-reference join;
* source-incarnation mismatch;
* plan republication/cutoff;
* deterministic ordering;
* deterministic repeated evaluation;
* clone isolation;
* current Active independence where appropriate;
* Backup V3 equivalence where practical;
* full-clear behavior where practical;
* protected authority handling.

Reuse existing lower-level tests rather than duplicating Phase 3 tests unnecessarily.

---

# 94. Validation

Before claiming completion run the repository's canonical validation.

At minimum:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Also run focused Task 4.2 tests separately and record their results.

Do not report validation as passed unless actually executed successfully.

---

# 95. No Unrelated Cleanup

Do not fix:

* Vite chunk advisory;
* unrelated compatibility aliases;
* unrelated historical reporting UX;
* unrelated lint/style debt;
* Phase 3 cleanup debt;

unless directly required for Task 4.2 correctness.

Record discoveries separately.

---

# 96. Governance

On successful completion, update governance minimally.

Expected:

* Task 4.2 result artifact;
* Phase 4 checkpoint update or new bounded checkpoint if appropriate;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Create a new ADR only if implementation reveals a genuinely new architectural decision not already governed by Task 4.1.

Do not rewrite the Task 4.1 architecture ADR merely to document implementation details.

---

# 97. Required Result Artifact

Create:

`docs/implementation/phase-4/TASK_4.2_IMPLEMENT_HISTORICAL_COVERAGE_AND_COMPLETION_DISTRIBUTION_PROJECTION_V1_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 4.1 Prerequisite Confirmation
4. Initial Historical API Audit
5. Files Changed
6. Module Placement
7. HistoricalMetricPolicy V1
8. Query Contract
9. Evaluation-As-Of Implementation
10. HistoricalPlan Coverage Resolution
11. Published/Published-Empty/Missing Semantics
12. Effective Plan Revision Selection
13. Eligibility
14. Exact Durable-Reference Join
15. Completed Classification
16. Partial Classification
17. Skipped Classification
18. Unknown Classification
19. Not-Reported Classification
20. Distribution Conservation
21. Current-Outcome Coverage
22. Zero-Denominator Behavior
23. Incomplete-Coverage Behavior
24. Unavailable-Coverage Behavior
25. Provenance
26. Frozen Historical Explanation
27. Determinism
28. Clone Isolation
29. Correction
30. Retraction
31. Source-Incarnation Safety
32. Plan Republication
33. Current Active Independence
34. Protected/Quarantine Handling
35. Backup V3/Restore Boundary
36. Full-Clear Boundary
37. Performance
38. Privacy
39. Tests Added/Changed
40. Focused Validation
41. Full Validation
42. Governance Updates
43. Deviations
44. Discoveries/Deferred Work
45. Architectural Alignment Assessment
46. Stop-Condition Assessment
47. Recommended Next Task
48. Final Completion Determination

---

# 98. Required Coverage Matrix

Produce:

| Requested day state                  | Coverage classification | Eligible occurrences | Analytical consequence |
| ------------------------------------ | ----------------------- | -------------------: | ---------------------- |
| published with scheduled occurrences |                         |                      |                        |
| published with no occurrences        |                         |                      |                        |
| missing                              |                         |                      |                        |
| mixed published/missing window       |                         |                      |                        |
| entirely missing window              |                         |                      |                        |

---

# 99. Required Outcome Matrix

Produce:

| Eligible occurrence evidence | Distribution category | Counts toward current-outcome coverage? | Meaning |
| ---------------------------- | --------------------- | --------------------------------------: | ------- |
| effective completed          |                       |                                         |         |
| effective partial            |                       |                                         |         |
| effective skipped            |                       |                                         |         |
| retracted subject            |                       |                                         |         |
| no subject                   |                       |                                         |         |

---

# 100. Required Eligibility Matrix

Produce:

| Effective HistoricalPlan state | Completion-distribution eligible? | Reason |
| ------------------------------ | --------------------------------: | ------ |
| scheduled                      |                                   |        |
| unplaced                       |                                   |        |
| omitted                        |                                   |        |
| blocked                        |                                   |        |

---

# 101. Required Boundary Matrix

Produce:

| Concern            | Task 4.2 behavior |
| ------------------ | ----------------- |
| metric persistence |                   |
| Backup V3          |                   |
| full clear         |                   |
| current Active     |                   |
| source recreation  |                   |
| Goals              |                   |
| Progress           |                   |
| Recommendations    |                   |
| automatic learning |                   |
| UI                 |                   |

---

# 102. Required Invariant Assessment

Classify at least:

1. HistoricalPlan remains sole planned-history authority.
2. ExecutionHistory remains sole observed-history authority.
3. Completion Distribution is derived.
4. Projection does not mutate either authority.
5. Same authority + policy + query produces same result.
6. Missing day is not zero demand.
7. Published-empty is known zero demand.
8. Scheduled is completion-distribution eligible.
9. Unplaced is not completion-distribution eligible.
10. Omitted is not completion-distribution eligible.
11. Blocked is not completion-distribution eligible.
12. Completed remains categorical.
13. Partial remains categorical.
14. Partial receives no arbitrary numeric weight.
15. Skipped remains categorical.
16. Retraction becomes unknown.
17. Retraction does not become not-reported.
18. No subject becomes not-reported.
19. Not-reported is not failure.
20. Distribution counts conserve the eligible denominator.
21. Current-outcome coverage excludes unknown.
22. Current-outcome coverage excludes not-reported.
23. Zero denominator is notApplicable.
24. Incomplete plan coverage is explicitly disclosed.
25. Entirely unavailable plan coverage is not represented as a zero-work window.
26. Exact joins include source incarnation.
27. Current Active cannot retarget history.
28. Current Active cannot reclassify frozen history.
29. Corrections do not change plan eligibility.
30. Plan republication obeys evaluation cutoff.
31. Projection result is clone-isolated.
32. Provenance is deterministic.
33. Backup V3 does not persist the projection.
34. Restore reproduces the projection from authority.
35. Full clear requires no metric-specific clearing.
36. No Goal semantics are introduced.
37. No Progress semantics are introduced.
38. No recommendation semantics are introduced.
39. No automatic learning is introduced.
40. No composite/adherence score is introduced.

Use:

* Confirmed;
* Implemented;
* Covered by test;
* Unsupported;
* Deferred;
* Stop-condition violation.

---

# 103. Completion Criteria

Task 4.2 is complete only when:

* HistoricalMetricPolicy V1 has an explicit stable identity;
* a deterministic explicit historical query contract exists;
* the query uses inclusive frozen user-day dates and explicit evaluation cutoff;
* HistoricalPlan coverage distinguishes published, published-empty, and missing days;
* coverage distinguishes complete, incomplete, and unavailable windows;
* effective plan revisions are selected using canonical HistoricalPlan semantics;
* only effective scheduled occurrences enter the Completion Distribution denominator;
* unplaced, omitted, and blocked occurrences remain excluded and explainable;
* scheduled occurrences join ExecutionHistory through exact durable occurrence identity including source incarnation;
* completed, partial, skipped, unknown, and not-reported remain distinct;
* correction and retraction behavior follows canonical ExecutionHistory semantics;
* no report is never converted into failure;
* partial receives no arbitrary weight;
* distribution counts conserve the eligible denominator;
* current-outcome coverage uses only completed + partial + skipped as classified current outcomes;
* zero denominator produces an explicit not-applicable state;
* incomplete plan coverage remains explicitly incomplete and does not extrapolate;
* an entirely unavailable plan window is not represented as known zero demand;
* result provenance can explain contributing and excluded historical occurrences;
* frozen historical context, not current Active, is used for explanation;
* output ordering is deterministic;
* output is clone-isolated;
* identical authority + policy + query produces identical results;
* changing/recreating current Active cannot retarget or reinterpret historical results;
* Backup V3 remains unchanged;
* no new persistence or metric authority exists;
* restore reproduces analytical output from restored historical authority;
* full clear requires no metric-specific clear participant;
* no scheduling-realization, allocation, trend, Goal, Progress, Recommendation, learning, composite score, or full Historical Intelligence UI is introduced;
* focused tests pass;
* canonical repository validation passes;
* required governance is updated;
* the result artifact records any deviations or discoveries;
* no stop condition remains unresolved.

---

# 104. Recommended Next Task

If Task 4.2 completes without discovering a semantic defect, do **not** automatically implement more metrics.

The preferred next boundary is:

> **Task 4.3 — Historical Intelligence Explanation, Drill-Down, and Bounded UI Integration**

Its purpose should be to make the truthful projection understandable and inspectable before expanding analytical sophistication.

Task 4.3 should be drafted from the actual Task 4.2 implementation/result rather than assumed in advance.

---

# 105. Final Implementation Principle

> **The first job of Historical Intelligence is not to score the user. It is to describe known history without disguising what DayFrame does not know.**

Task 4.2 proves that DayFrame can turn durable historical memory into useful information while preserving the epistemic boundaries established by Phase 3 and Task 4.1.

---

# 106. Final Completion Statement

**Task 4.2 is complete when DayFrame implements its first pure Historical Intelligence projection over the existing HistoricalPlan and ExecutionHistory authorities; when an explicit HistoricalMetricPolicy V1 and deterministic inclusive user-day/evaluation-cutoff query govern the result; when requested historical days are resolved through canonical HistoricalPlan revision semantics and remain distinguishable as published, published-empty, or missing; when plan coverage truthfully distinguishes complete, incomplete, and unavailable windows; when only effective scheduled occurrences form the Completion Distribution denominator and unplaced, omitted, and blocked occurrences remain excluded without being interpreted as user failure; when every eligible scheduled occurrence is joined to ExecutionHistory only through its exact durable occurrence reference including source incarnation and is classified exactly once as completed, partial, skipped, unknown after retraction, or not reported; when correction changes current analytical classification without changing plan eligibility, retraction remains distinct from absence, and absence of execution evidence is never converted into failure; when distribution counts conserve the denominator and current-outcome coverage counts only completed, partial, and skipped current outcomes; when zero eligible occurrences produce an explicit not-applicable state rather than a misleading percentage; when incomplete or absent plan authority is surfaced as an analytical limitation rather than extrapolated into invented history; when deterministic machine-readable provenance explains contributing, excluded, and missing evidence using frozen historical context rather than current authored state; when output is deterministically ordered, clone-isolated, and reproducible from identical authority, policy, and query; when source recreation cannot retarget old execution evidence; when current Active changes cannot reinterpret historical results; when Backup V3, restore, and five-authority full-clear continue to operate solely on historical authority without adding metric persistence or a sixth authority participant; when focused semantic fixtures and regression tests cover coverage states, plan states, all execution categories, correction, retraction, no-report, republication, incarnation safety, determinism, isolation, restore equivalence, and clear behavior as applicable; when canonical lint, typecheck, test, build, and diff validation pass; when governance accurately records the new derived projection without claiming broader Phase 4 functionality; and when no Goals, Progress, Recommendations, learning, trends, composite scores, scheduling-realization metric, planned-allocation metric, or unnecessary UI expansion has been introduced.**
