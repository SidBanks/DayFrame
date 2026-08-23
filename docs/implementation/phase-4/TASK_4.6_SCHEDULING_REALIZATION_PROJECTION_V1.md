# Task 4.6 — Scheduling Realization Projection V1

## Status

Ready for architecture confirmation and implementation.

## Phase

Phase 4 — Historical Intelligence

## Task Type

Governed Historical Intelligence projection implementation, planning-outcome semantics, deterministic provenance, Summary integration readiness, and regression coverage.

---

# 1. Context

Phase 4 has established the first complete Historical Intelligence path.

Task 4.1 defined Historical Intelligence as:

> a pure, deterministic, policy-governed projection over historical authority.

Task 4.2 implemented:

> Historical Coverage and Completion Distribution V1

which answers:

> **For scheduled historical occurrences, what does current ExecutionHistory say happened?**

Task 4.3 exposed that projection through the read-only Summary surface.

Task 4.4 audited the resulting product experience.

Task 4.5 clarified:

* Setup, Preview, and Summary as destinations;
* Generate/Regenerate as explicit actions;
* Preview as the operational schedule-review/reporting workspace;
* Summary as the read-only analytical surface;
* current/past reporting as operational write workflows;
* Summary History as historical interpretation;
* the removal of Preview's ambiguous broad report aggregate.

Task 4.5 explicitly recommended the next governed projection:

> **Task 4.6 — Scheduling Realization Projection V1**

The purpose is to answer a different question from Completion Distribution.

Completion Distribution asks:

> **What was reported to have happened to work DayFrame scheduled?**

Scheduling Realization asks:

> **What happened to intended historical work during planning?**

These questions must remain separate.

---

# 2. Core Distinction

The Phase 4 analytical chain is now:

```text
INTENDED HISTORICAL OCCURRENCE
        │
        ▼
PLANNING RESULT
        │
        ├── Scheduled
        ├── Unplaced
        ├── Omitted
        └── Blocked
                │
                ▼
       Scheduling Realization
                │
                │ only scheduled work proceeds
                ▼
EXECUTION EVIDENCE
        │
        ├── Completed
        ├── Partial
        ├── Skipped
        ├── Unknown
        └── Not reported
                │
                ▼
       Completion Distribution
```

An occurrence that DayFrame could not schedule must never be treated as though the user skipped it.

An occurrence that DayFrame scheduled but the user later skipped must never be treated as a planning-placement failure.

Task 4.6 establishes that distinction in executable Historical Intelligence.

---

# 3. Purpose

Implement a second governed Historical Intelligence projection:

> **Scheduling Realization V1**

The projection must describe the effective historical planning disposition of intended occurrences over an explicit historical window.

At minimum it must distinguish:

```text
scheduled
unplaced
omitted
blocked
```

using canonical HistoricalPlan evidence.

The result must explain:

* how much intended work became scheduled;
* how much remained unplaced;
* how much was omitted;
* how much was blocked;
* how complete the underlying HistoricalPlan coverage is;
* which historical occurrences contributed to each category;
* which evidence is unavailable or excluded.

It must not interpret these states as user performance.

---

# 4. Governing Principle

> **Scheduling Realization measures the planning system's historical disposition of intended work, not the user's execution of that work.**

Therefore:

```text
scheduled ≠ completed

unplaced ≠ skipped

omitted ≠ failed

blocked ≠ user failure
```

These distinctions are mandatory.

---

# 5. Architectural Boundary

Scheduling Realization is derived.

The authority model remains:

```text
HistoricalPlan
    = what DayFrame had planned

ExecutionHistory
    = what the user reported happened

Historical Intelligence
    = deterministic descriptions derived from authority
```

Scheduling Realization V1 should require HistoricalPlan.

It should not require ExecutionHistory for its core classification.

ExecutionHistory must not be consulted to reinterpret the planning disposition.

---

# 6. Explicit Non-Goal: Human Capacity

Task 4.6 does **not** measure human capacity.

A high unplaced count may show:

> DayFrame could not place all intended occurrences.

It does not establish:

> the user has exceeded their true personal capacity.

True capacity is a future analytical concept requiring additional policy and evidence.

---

# 7. Explicit Non-Goal: Planner Quality Score

Do not produce:

* scheduling success score;
* planner score;
* efficiency score;
* capacity score;
* optimization score.

Task 4.6 remains descriptive.

---

# 8. Governing Existing Semantics

Before implementation, audit and preserve the exact current HistoricalPlan meaning of:

```text
scheduled
unplaced
omitted
blocked
```

Do not derive analytical meaning from enum names alone.

The implementation must document:

* how each state enters HistoricalPlan;
* whether each state represents accepted historical planning authority;
* whether all four states represent intended occurrences;
* whether any state may contain structurally different historical subjects;
* whether repeated publication/revision changes effective state.

If actual source semantics materially contradict the assumptions of this task, stop.

---

# 9. Execution Artifact Rules

Before implementation:

1. verify this Task 4.6 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 4.1 result;
   * Task 4.2 result;
   * Task 4.3 result;
   * Task 4.4 result;
   * Task 4.5 result;
   * current Phase 4 checkpoint;
   * `CURRENT_STATE.md`;
   * `ROADMAP.md`;
   * HistoricalPlan domain types;
   * HistoricalPlan publication semantics;
   * effective HistoricalPlan day/range queries;
   * scheduled/unplaced/omitted/blocked snapshot shapes;
   * frozen occurrence context;
   * `DurableOccurrenceReference`;
   * Task 4.2 historical coverage helpers;
   * Task 4.2 policy/query types;
   * current Summary query/API boundary;
6. do not modify the immutable Task 4.6 artifact during execution.

Create:

`docs/implementation/phase-4/TASK_4.6_SCHEDULING_REALIZATION_PROJECTION_V1_RESULT.md`

---

# 10. Initial HistoricalPlan State Audit

Before coding, determine exactly how the current HistoricalPlan representation stores:

* scheduled occurrences;
* unplaced occurrences;
* omitted occurrences;
* blocked occurrences.

For each state document:

* historical snapshot shape;
* durable reference;
* title/category/source context;
* planned duration;
* scheduled interval if any;
* reason/context if any;
* publication behavior;
* revision behavior.

Do not assume all states contain identical fields.

---

# 11. Intended-Occurrence Denominator

Task 4.6 requires an explicit denominator.

The likely V1 denominator is:

> **all effective HistoricalPlan occurrences classified as scheduled, unplaced, omitted, or blocked within known published historical plan coverage.**

But this must be confirmed against source semantics.

Do not include occurrence states merely because they exist in storage.

The denominator must represent intended/planned work meaningfully.

---

# 12. Metric-Specific Denominator

Scheduling Realization's denominator must remain distinct from Completion Distribution's denominator.

Completion Distribution:

```text
effective scheduled occurrences only
```

Scheduling Realization:

```text
effective intended historical occurrences
across governed planning-disposition states
```

Do not reuse the Completion Distribution denominator.

---

# 13. Scheduled Semantics

For Scheduling Realization V1, `scheduled` means:

> DayFrame produced an executable scheduled placement for the effective historical occurrence.

Confirm actual source semantics.

Do not infer execution success.

---

# 14. Unplaced Semantics

Audit and define `unplaced`.

Likely meaning:

> the intended occurrence existed but DayFrame could not produce an accepted placement.

If confirmed, classify separately.

Do not label:

* missed;
* failed;
* skipped;
* overcommitted.

---

# 15. Omitted Semantics

Audit and define `omitted`.

Determine whether omission represents:

* intentional planning policy;
* accepted exclusion;
* suppressed recurrence;
* another governed planning state.

The analytical explanation must reflect actual semantics.

Do not treat omitted as synonymous with blocked or unplaced.

---

# 16. Blocked Semantics

Audit and define `blocked`.

Determine whether it means:

* no allowable placement;
* placement prevented by a governing constraint;
* unresolved conflict;
* another accepted state.

Do not infer user causality.

---

# 17. State Conservation

For every effective intended occurrence admitted into the projection:

```text
intendedOccurrenceCount
=
scheduled
+ unplaced
+ omitted
+ blocked
```

If current HistoricalPlan exposes another effective planning state relevant to intended work, stop rather than discarding it.

---

# 18. Historical Plan Coverage

Reuse Task 4.2's HistoricalPlan coverage semantics.

Requested days remain:

```text
published
published empty
missing
```

Scheduling Realization must not create another coverage model.

Prefer shared governed coverage helpers where appropriate.

---

# 19. Published-Empty Days

A published-empty day means:

```text
known plan authority
+
zero intended occurrences
```

It contributes plan coverage but no Scheduling Realization denominator.

---

# 20. Missing Days

A missing HistoricalPlan day means:

> DayFrame does not know authoritative planning disposition for that user-day.

Do not infer:

* zero intended work;
* zero unplaced work;
* perfect scheduling;
* complete scheduling.

---

# 21. Complete Coverage

When all requested days are published:

```text
plan coverage = complete
```

Scheduling Realization may describe the entire requested historical window.

---

# 22. Incomplete Coverage

When some requested days lack publication:

* compute counts from known effective plan authority;
* mark coverage incomplete;
* list missing dates;
* do not extrapolate;
* do not present a window-wide realization percentage without qualification.

Counts remain useful.

---

# 23. Unavailable Coverage

If no requested day has HistoricalPlan authority:

* mark plan coverage unavailable;
* do not return a known-zero realization result;
* distribution should be unavailable/not-applicable according to governed result semantics.

---

# 24. Query Contract

Prefer compatibility with Task 4.2's resolved historical query contract:

```text
startUserDayDate
endUserDayDate
evaluationAsOf
HistoricalMetricPolicy V1
```

Do not create different date semantics unless source evidence requires it.

A shared historical query window contract is preferred.

---

# 25. HistoricalMetricPolicy

Use the existing:

> HistoricalMetricPolicy V1

unless Task 4.6 discovers a genuine policy incompatibility.

Do not create HistoricalMetricPolicy V2 merely because a second projection exists.

Metric identity and policy identity remain separate.

---

# 26. Metric Identity

Introduce an explicit Scheduling Realization metric identity.

Conceptually:

```text
{
  id: "schedulingRealization",
  version: 1
}
```

Exact naming should follow Task 4.2 conventions.

This identity is analytical metadata, not persisted authority.

---

# 27. Evaluation Cutoff

Use canonical HistoricalPlan revision selection at explicit:

```text
evaluationAsOf
```

The same cutoff semantics used by Completion Distribution should govern Scheduling Realization.

Do not read the wall clock inside the pure projection.

---

# 28. Effective Plan Republication

If a day is republished and the effective disposition changes:

```text
before cutoff:
    scheduled

after cutoff:
    blocked
```

or equivalent,

Scheduling Realization must reflect the effective publication visible at the supplied cutoff.

Do not mutate previous publication evidence.

---

# 29. Frozen Historical Context

Every contributing occurrence must be explainable using frozen HistoricalPlan context.

Potential provenance fields:

* user-day date;
* title;
* category;
* source family;
* durable occurrence reference;
* historical plan state;
* scheduled time if scheduled;
* relevant historical reason/context if governed and available;
* publication batch identity/time.

Do not query current Active.

---

# 30. Exact Historical Identity

Preserve the exact `DurableOccurrenceReference`.

Source incarnation remains part of historical identity.

Do not merge recreated sources automatically.

---

# 31. No ExecutionHistory Dependency

The core Scheduling Realization projection should not require ExecutionHistory.

Do not make classification depend on:

* completed;
* partial;
* skipped;
* unknown;
* not reported.

Those belong to Completion Distribution.

---

# 32. No Cross-Metric Reclassification

Do not produce combined states such as:

```text
scheduledCompleted
scheduledSkipped
blockedNotReported
```

Task 4.6 is a separate projection.

A future Summary may display the two projections side by side.

Their semantics remain independent.

---

# 33. Distribution Result

The canonical V1 result should contain counts at minimum:

```text
intendedOccurrenceCount

scheduled
unplaced
omitted
blocked
```

Counts are primary.

---

# 34. Realization Coverage Terminology

Do not use `reporting coverage`.

That belongs to execution evidence.

Potential V1 terminology includes:

```text
planning disposition
scheduling realization
placement outcome
```

Choose product/API language carefully.

The core projection may use architecture terminology while product copy can later simplify it.

---

# 35. Ratio Determination

Task 4.6 does not require a realization percentage.

If the implementation exposes a ratio:

```text
scheduled / intendedOccurrenceCount
```

it must be secondary and governed.

Strong preference:

> counts first; no percentage required in 4.6.

Do not label such a ratio `success`.

---

# 36. Zero Denominator

If known historical coverage contains zero intended occurrences:

```text
Scheduling Realization = notApplicable
```

Do not return:

* 0%;
* 100%;
* NaN;
* Infinity.

This remains distinct from unavailable plan coverage.

---

# 37. Provenance

Every count must be traceable to deterministic historical occurrences.

At minimum support drill-down provenance by state:

```text
scheduled
unplaced
omitted
blocked
```

This is required even though UI integration is not part of Task 4.6.

---

# 38. State-Specific Provenance

For each occurrence include:

* frozen historical context;
* exact durable reference;
* planning disposition;
* available state-specific context.

Do not fabricate reasons.

---

# 39. Reason Semantics

If HistoricalPlan stores explicit reason/evidence for why something became:

* unplaced;
* omitted;
* blocked;

audit whether that reason can be exposed safely.

If it exists and is governed, preserve it in provenance.

If it does not exist, do not synthesize one from current schedule/friction logic.

---

# 40. No Historical Friction Reconstruction

Do not reconstruct historical friction by rerunning today's friction detector.

Unless Phase 3 persisted historical friction authority, Scheduling Realization cannot truthfully claim:

> blocked because X

unless frozen HistoricalPlan evidence itself establishes X.

---

# 41. Pure Core Projection

Implement Scheduling Realization as a pure core function where practical.

Conceptually:

```text
effective HistoricalPlan evidence
+
resolved historical query
+
HistoricalMetricPolicy V1
        ↓
Scheduling Realization V1
```

The pure projection must not:

* read IndexedDB;
* read localStorage;
* read the wall clock;
* mutate HistoricalPlan;
* mutate Preview;
* mutate Active;
* access ExecutionHistory;
* publish HistoricalPlan;
* allocate IDs;
* allocate domain timestamps.

---

# 42. Application Query Layer

A state/application query may:

* validate query;
* request bounded HistoricalPlan range;
* resolve canonical publication;
* compose pure input;
* propagate protection/unavailability;
* return the derived projection.

Use the same dependency direction established in Task 4.2.

---

# 43. Shared Historical Intelligence Helpers

Reuse Task 4.2 helpers where their semantics are genuinely shared.

Likely candidates:

* query validation;
* user-day enumeration;
* HistoricalPlan coverage;
* policy validation;
* deterministic provenance ordering;
* clone isolation helpers.

Do not duplicate identical coverage logic.

---

# 44. No Generic Metric Engine

Do not create a generalized arbitrary-metric engine now that there are two projections.

Explicit projections remain the Phase 4 architecture.

Shared low-level helpers are permitted.

---

# 45. Result Contract

Design a narrow explicit result.

Conceptually it may contain:

```text
metric identity
policy identity
resolved query

plan coverage

intended occurrence count

distribution:
    scheduled
    unplaced
    omitted
    blocked

status:
    available
    notApplicable
    unavailable

limitations

provenance
```

Use actual project conventions.

---

# 46. Limitations

Reuse shared limitation semantics where appropriate:

```text
incompletePlanCoverage
noPlanCoverage
zeroIntendedOccurrences
protectedHistoricalAuthority
```

Do not create different names for identical coverage limitations merely because the metric differs.

---

# 47. Protected HistoricalPlan

If HistoricalPlan authority is protected/recovery-required:

* Scheduling Realization must not present counts as valid;
* return an explicit unavailable/protected result;
* do not treat protected authority as empty.

---

# 48. Quarantine

HistoricalPlan's governed protection/quarantine semantics must be audited.

If HistoricalPlan exposes quarantined or uninterpretable evidence:

* do not classify it as omitted/unplaced/blocked;
* use canonical protected/unavailable behavior.

Do not inspect raw corrupted evidence.

---

# 49. Current Active Independence

Task 4.6 must not consult current Active.

Changing:

* current title;
* current category;
* current recurrence;
* current duration;
* deleting current source;
* recreating source

must not change an unchanged historical Scheduling Realization result.

---

# 50. Source Recreation

Add regression evidence that two historical occurrences with the same logical source identifier but different incarnations remain historically distinct.

Scheduling Realization itself does not need to aggregate by source.

---

# 51. Correction / Execution Revisions

ExecutionHistory corrections and retractions must have **no effect** on Scheduling Realization.

Add at least one regression proving:

```text
same HistoricalPlan
+
different ExecutionHistory
=
same Scheduling Realization
```

if practical through application composition.

This directly proves the metric boundary.

---

# 52. Completion Distribution Independence

Likewise, changing an occurrence from:

```text
completed
→ skipped
```

must not change its HistoricalPlan planning disposition.

The two projections remain orthogonal.

---

# 53. Publication Change

Changing HistoricalPlan effective publication may change Scheduling Realization.

This is correct.

Changing ExecutionHistory alone must not.

---

# 54. Scheduled State

Test a scheduled occurrence.

Expected:

```text
intendedOccurrenceCount += 1
scheduled += 1
```

---

# 55. Unplaced State

Test an unplaced occurrence.

Expected:

```text
intendedOccurrenceCount += 1
unplaced += 1
```

Do not classify as scheduled.

---

# 56. Omitted State

Test an omitted occurrence.

Expected:

```text
intendedOccurrenceCount += 1
omitted += 1
```

assuming the initial semantic audit confirms denominator eligibility.

If not, stop and document the correct governed treatment.

---

# 57. Blocked State

Test a blocked occurrence.

Expected:

```text
intendedOccurrenceCount += 1
blocked += 1
```

assuming the semantic audit confirms denominator eligibility.

---

# 58. All-State Fixture

Create a canonical fixture containing:

```text
1 scheduled
1 unplaced
1 omitted
1 blocked
```

Expected:

```text
intendedOccurrenceCount = 4
distribution total = 4
```

---

# 59. State Conservation Test

Assert:

```text
intendedOccurrenceCount
=
scheduled
+ unplaced
+ omitted
+ blocked
```

for every available projection.

---

# 60. Published-Empty Test

A fully covered published-empty day:

```text
coverage = complete
intendedOccurrenceCount = 0
status = notApplicable
```

---

# 61. Missing Coverage Test

A partially missing window:

```text
known counts remain available
coverage = incomplete
missing dates explicit
limitation = incompletePlanCoverage
```

No inferred occurrences for missing dates.

---

# 62. Unavailable Window Test

Entirely missing HistoricalPlan:

```text
coverage = unavailable
realization = unavailable
```

not:

```text
0 intended
100% scheduled
```

---

# 63. Republication Test

Use a real HistoricalPlan publication test where possible.

Example:

Initial publication:

```text
scheduled
unplaced
```

Replacement publication:

```text
scheduled
blocked
```

Query before/after cutoff.

Expected counts differ according to canonical effective plan selection.

---

# 64. Input Ordering Determinism

Permute effective occurrence input ordering.

Result must be deeply equal.

---

# 65. Provenance Ordering

Canonical ordering should follow historical semantics.

Prefer the same Task 4.2 ordering where fields permit:

```text
userDayDate
scheduled start when available
durable occurrence identity
```

For states without a scheduled start, define deterministic fallback ordering.

Document it.

---

# 66. Clone Isolation

Mutating a returned Scheduling Realization result must not mutate HistoricalPlan evidence or a subsequent projection.

---

# 67. Same-Input Determinism

Assert:

```text
same HistoricalPlan
+
same policy
+
same query
=
deep-equal Scheduling Realization
```

---

# 68. Backup V3 Boundary

Do not modify Backup V3.

Because Scheduling Realization is derived:

```text
restored HistoricalPlan
+
same policy/query
=
same realization result
```

Add semantic roundtrip evidence where practical.

---

# 69. Restore Boundary

No metric restore participant.

No metric journal.

No metric staging.

No metric runtime snapshot.

---

# 70. Full Clear

After five-authority full clear:

HistoricalPlan becomes cleared authority.

A new Scheduling Realization query naturally becomes unavailable/no-plan-history.

No sixth clear participant.

---

# 71. Preview Independence

Scheduling Realization must not read Preview.

Regenerating current Preview must not rewrite historical Scheduling Realization unless it legitimately publishes new HistoricalPlan authority within the queried historical range according to existing semantics.

Do not create Preview coupling.

---

# 72. Planning Publication Boundary

Do not change when HistoricalPlan publication occurs.

Scheduling Realization consumes historical authority; it does not alter publication rules.

---

# 73. No Planning Workflow Mutation

Viewing/querying Scheduling Realization must not:

* regenerate;
* move;
* omit;
* block;
* place;
* accept suggested fixes;
* modify current schedules.

---

# 74. No Summary UI Yet

Task 4.6 implements the governed projection.

Do not add the new distribution to Summary in this same task.

We already learned from Task 4.2/4.3 that projection and product integration benefit from separate review.

---

# 75. Why UI Is Deferred

Scheduling Realization introduces a new conceptual distinction:

```text
planning disposition
vs
execution outcome
```

Its user-facing language deserves a separate bounded integration task after the projection is proven.

Task 4.6 should establish semantic truth first.

---

# 76. No Capacity Section

Do not place Scheduling Realization under a Summary `Capacity` section yet.

Task 4.1 explicitly warned that planner placement is not identical to human capacity.

---

# 77. No Allocations Section

Scheduling Realization is not Planned Allocation.

Do not create Allocations UI.

---

# 78. No Trends

Do not compare realization across periods.

---

# 79. No Comparisons

Do not implement:

* week-over-week;
* category comparisons;
* source comparisons.

---

# 80. No Percent-Based Judgment

Do not introduce:

```text
82% schedulable
```

as a primary value.

Counts are sufficient for V1.

---

# 81. No Recommendation

Do not infer:

> reduce commitments

from unplaced/blocked history.

That requires future recommendation policy.

---

# 82. No Goal / Progress

Do not connect scheduling realization to Goals or Progress.

---

# 83. No Automatic Scheduling Adjustment

Historical unplaced/blocked patterns must not change future scheduler behavior.

No learning.

---

# 84. No Causal Language

The projection may establish:

> 3 intended occurrences were blocked.

It cannot establish:

> work caused those occurrences to be blocked

unless HistoricalPlan itself contains governed causal evidence.

---

# 85. Metric Naming Audit

Audit whether the code/public API should use:

```text
SchedulingRealization
```

and whether product-facing language should eventually use:

```text
Planning outcomes
Schedule placement
How the plan was placed
```

Task 4.6 need not finalize UI copy.

Record recommendations for the next integration task.

---

# 86. Performance

Reuse bounded HistoricalPlan range queries.

No full-database scan if an indexed/range query already exists.

No cache.

---

# 87. Data Volume

Assume local personal-history scale.

Do not design an analytics warehouse.

---

# 88. Privacy

No telemetry.

No network analytics.

No remote storage.

---

# 89. Error Handling

Validate:

* malformed dates;
* reversed range;
* malformed cutoff;
* unsupported policy;
* protected HistoricalPlan.

Use Task 4.2 result/error conventions where possible.

---

# 90. Public API

Expose one governed scheduling-realization query through the store/application boundary.

Conceptually:

```text
getHistoricalSchedulingRealization(...)
```

Exact naming should follow project conventions.

Do not export low-level helpers unnecessarily.

---

# 91. State Store Integration

The DayFrame store may expose the query method.

It must not store the result as durable or authoritative state.

Avoid storing a cached latest result unless existing query architecture requires transient UI composition.

Default: query on demand.

---

# 92. Shared Query Types

Reuse historical date/query types where appropriate.

Do not create parallel date representations.

---

# 93. Shared Coverage Types

If Task 4.2's plan coverage result is semantically reusable, share it.

Do not duplicate coverage contracts.

If it is too tightly coupled to Completion Distribution, extract only the minimal shared historical-intelligence coverage layer needed by both projections.

Any refactor must remain behavior-preserving for 4.2.

---

# 94. Refactor Boundary

A small shared-helper extraction is authorized if needed to avoid duplicated metric semantics.

Do not turn Task 4.6 into a Historical Intelligence framework rewrite.

---

# 95. Test Strategy

At minimum cover:

* valid query;
* invalid query;
* complete coverage;
* incomplete coverage;
* unavailable coverage;
* published-empty;
* zero denominator;
* scheduled;
* unplaced;
* omitted;
* blocked;
* all-state conservation;
* republication cutoff;
* deterministic ordering;
* same-input determinism;
* clone isolation;
* current Active independence;
* ExecutionHistory independence;
* source incarnation safety;
* Backup V3 semantic equivalence;
* full clear;
* protected HistoricalPlan.

---

# 96. Golden Semantic Fixtures

Create reusable fixtures where practical.

At minimum:

### Fixture A — All planning states

```text
scheduled
unplaced
omitted
blocked
```

### Fixture B — Fully scheduled

All intended occurrences scheduled.

### Fixture C — Mixed placement

Scheduled + unplaced + blocked.

### Fixture D — Published empty

Known plan history, zero intended occurrences.

### Fixture E — Missing plan days

Incomplete historical coverage.

### Fixture F — Republication

Planning disposition changes at cutoff.

### Fixture G — Source recreation

Same logical source, different incarnation.

---

# 97. Property Invariants

Where practical test:

### A

Changing ExecutionHistory does not change Scheduling Realization.

### B

Changing current Active does not change Scheduling Realization.

### C

Republishing HistoricalPlan may change realization after the cutoff.

### D

Adding a published-empty day improves plan coverage without increasing intended occurrence count.

### E

Missing days never produce zero-demand evidence.

### F

Input ordering does not affect output.

### G

Backup V3 authority roundtrip preserves output.

### H

Full clear removes the authority needed to derive the result.

---

# 98. Required Coverage Matrix

Produce:

| Requested day state        | Coverage classification | Intended occurrences | Scheduling Realization consequence |
| -------------------------- | ----------------------- | -------------------: | ---------------------------------- |
| published with occurrences |                         |                      |                                    |
| published empty            |                         |                      |                                    |
| missing                    |                         |                      |                                    |
| mixed published/missing    |                         |                      |                                    |
| entirely missing           |                         |                      |                                    |

---

# 99. Required Planning-State Matrix

Produce:

| HistoricalPlan state | Denominator eligible? | Realization category | Must not imply |
| -------------------- | --------------------: | -------------------- | -------------- |
| scheduled            |                       |                      |                |
| unplaced             |                       |                      |                |
| omitted              |                       |                      |                |
| blocked              |                       |                      |                |

Populate from audited source semantics.

Do not pre-fill eligibility based solely on this task's expectation.

---

# 100. Required Boundary Matrix

Produce:

| Concern                 | Scheduling Realization V1 |
| ----------------------- | ------------------------- |
| HistoricalPlan          |                           |
| ExecutionHistory        |                           |
| Preview                 |                           |
| current Active          |                           |
| source incarnation      |                           |
| Backup V3               |                           |
| full clear              |                           |
| persistence             |                           |
| Summary UI              |                           |
| Completion Distribution |                           |
| Goals                   |                           |
| Progress                |                           |
| Recommendations         |                           |
| learning                |                           |

---

# 101. Required Comparison Matrix

Produce:

| Concern                     | Scheduling Realization | Completion Distribution |
| --------------------------- | ---------------------- | ----------------------- |
| question answered           |                        |                         |
| authority input             |                        |                         |
| denominator                 |                        |                         |
| categories                  |                        |                         |
| missing-history behavior    |                        |                         |
| ExecutionHistory required?  |                        |                         |
| user performance inference? |                        |                         |
| planning-system inference?  |                        |                         |

This matrix is critical.

---

# 102. Required Epistemic Matrix

Produce:

| Evidence state      | What Task 4.6 may say | What Task 4.6 must not say |
| ------------------- | --------------------- | -------------------------- |
| scheduled           |                       |                            |
| unplaced            |                       |                            |
| omitted             |                       |                            |
| blocked             |                       |                            |
| missing day         |                       |                            |
| published-empty day |                       |                            |
| source recreated    |                       |                            |
| execution skipped   |                       |                            |

The last row should explicitly demonstrate that ExecutionHistory is outside the metric.

---

# 103. Required Architectural Invariant Assessment

Classify at least:

1. HistoricalPlan remains sole input authority.
2. ExecutionHistory is not required.
3. Preview is not required.
4. current Active is not required.
5. Scheduling Realization is derived.
6. result is non-persisted.
7. metric policy is explicit.
8. metric identity is explicit.
9. query range is explicit.
10. evaluation cutoff is explicit.
11. HistoricalPlan revision selection is canonical.
12. missing coverage is not zero work.
13. published-empty is known zero work.
14. complete/incomplete/unavailable coverage remains distinct.
15. denominator semantics are metric-specific.
16. scheduled is not completed.
17. unplaced is not skipped.
18. omitted is not failure.
19. blocked is not user failure.
20. each intended occurrence classifies exactly once.
21. state counts conserve the denominator.
22. zero denominator is notApplicable.
23. provenance uses frozen historical context.
24. current Active cannot relabel historical evidence.
25. source recreation cannot retarget identity.
26. ExecutionHistory correction cannot change realization.
27. ExecutionHistory retraction cannot change realization.
28. HistoricalPlan republication may change realization by cutoff.
29. result ordering is deterministic.
30. result is clone-isolated.
31. Backup V3 does not persist result.
32. restore reproduces result from authority.
33. full clear requires no metric participant.
34. querying emits no domain event.
35. querying modifies no planning state.
36. no Summary UI is introduced.
37. no Capacity semantics are introduced.
38. no Planned Allocation semantics are introduced.
39. no trends are introduced.
40. no comparisons are introduced.
41. no Goals are introduced.
42. no Progress is introduced.
43. no Recommendations are introduced.
44. no learning occurs.
45. no composite score is introduced.
46. no causal inference is introduced.

Use:

* Confirmed;
* Implemented;
* Covered by test;
* Deferred;
* Unsupported;
* Stop-condition violation.

---

# 104. Stop Conditions

Stop and report if:

* the actual HistoricalPlan state semantics do not support a coherent intended-occurrence denominator;
* omitted is not analytically comparable with the other states;
* blocked does not represent historical occurrence disposition;
* another planning state exists and cannot be safely classified;
* published-empty cannot be distinguished from missing;
* HistoricalPlan effective revision cannot be selected at cutoff;
* provenance lacks enough frozen evidence to explain state classification;
* implementing realization requires current Active;
* implementing realization requires Preview reconstruction;
* implementing realization requires ExecutionHistory;
* implementation requires HistoricalPlan schema/version changes;
* implementation requires new persistence;
* implementation requires Backup V3 changes;
* state semantics require historical friction reconstruction that does not exist;
* Task 4.2 coverage helpers cannot be reused without changing Completion Distribution behavior.

Do not force a four-category distribution if the historical evidence does not support it.

---

# 105. Files and Placement

Follow Task 4.2's Historical Intelligence architecture.

Likely responsibilities:

```text
core/historicalIntelligence/schedulingRealization.ts
core/historicalIntelligence/schedulingRealization.test.ts

state/historicalIntelligenceQuery.ts
or a bounded sibling query module

store wiring
tests/fixtures
governance
```

Do not assume exact filenames if existing organization suggests a better structure.

---

# 106. Validation

Run focused Task 4.6 tests.

Then run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Record:

* focused test files/count;
* full test-file count;
* full test count;
* build module count;
* build advisory;
* diff result.

Do not report validation that was not actually executed.

---

# 107. Governance

On completion update minimally:

* Task 4.6 result artifact;
* Phase 4 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Create an ADR only if implementation introduces a genuinely new architectural decision beyond Task 4.1's governed projection model.

---

# 108. Required Result Artifact

Create:

`docs/implementation/phase-4/TASK_4.6_SCHEDULING_REALIZATION_PROJECTION_V1_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 4.1–4.5 Prerequisite Confirmation
4. Initial HistoricalPlan State Audit
5. Files Changed
6. Module Placement
7. HistoricalMetricPolicy Reuse
8. Metric Identity
9. Query Contract
10. Evaluation Cutoff
11. HistoricalPlan Coverage
12. Effective Publication Selection
13. Intended-Occurrence Denominator
14. Scheduled Semantics
15. Unplaced Semantics
16. Omitted Semantics
17. Blocked Semantics
18. Distribution Conservation
19. Zero-Denominator Behavior
20. Incomplete Coverage
21. Unavailable Coverage
22. Frozen Provenance
23. State-Specific Provenance
24. Reason/Explanation Semantics
25. Source-Incarnation Safety
26. Current Active Independence
27. Preview Independence
28. ExecutionHistory Independence
29. Completion Distribution Independence
30. Republication Behavior
31. Determinism
32. Ordering
33. Clone Isolation
34. Backup V3 Boundary
35. Restore Boundary
36. Full-Clear Boundary
37. Protection/Quarantine
38. Persistence Boundary
39. Performance
40. Privacy
41. Tests Added/Changed
42. Golden Fixtures
43. Property Invariants
44. Focused Validation
45. Full Validation
46. Governance Updates
47. Deviations
48. Discoveries/Deferred Work
49. Coverage Matrix
50. Planning-State Matrix
51. Boundary Matrix
52. Comparison Matrix
53. Epistemic Matrix
54. Architectural Invariant Assessment
55. Stop-Condition Assessment
56. Architectural Alignment Assessment
57. Recommended Next Task
58. Final Completion Determination

---

# 109. Completion Criteria

Task 4.6 is complete only when:

* current HistoricalPlan state semantics have been audited rather than inferred from enum names;
* a truthful intended-occurrence denominator is explicitly defined;
* Scheduling Realization has a stable V1 metric identity;
* HistoricalMetricPolicy V1 is reused unless evidence requires otherwise;
* the projection accepts an explicit inclusive historical user-day window and explicit evaluation cutoff;
* HistoricalPlan effective publication selection uses canonical as-of semantics;
* complete, incomplete, unavailable, published-empty, and missing historical coverage semantics remain consistent with Task 4.2;
* each eligible intended historical occurrence is classified exactly once into its governed planning-disposition category;
* scheduled, unplaced, omitted, and blocked remain semantically distinct where supported by source;
* state counts conserve the intended-occurrence denominator;
* zero intended occurrences produce a not-applicable state rather than a misleading percentage;
* missing HistoricalPlan coverage is disclosed rather than converted into zero intended work;
* deterministic provenance identifies the frozen historical evidence behind every included occurrence;
* current Active is not consulted;
* Preview is not consulted;
* ExecutionHistory is not consulted for core classification;
* execution corrections, retractions, and outcome changes cannot alter Scheduling Realization;
* source recreation cannot retarget historical identity;
* HistoricalPlan republication can change results only according to the explicit cutoff;
* output ordering is deterministic;
* output is clone-isolated;
* identical HistoricalPlan authority + policy + query produces identical output;
* Backup V3 remains unchanged and restored HistoricalPlan authority reproduces the result;
* no metric persistence or restore participant is introduced;
* full clear requires no metric-specific clear behavior;
* querying the metric does not generate schedules, publish HistoricalPlan, alter planning state, report outcomes, allocate IDs, or emit domain events;
* no Summary UI is added;
* no human-capacity inference is introduced;
* no scheduling success/planner score is introduced;
* no Planned Allocation, trend, comparison, Goal, Progress, Recommendation, learning behavior, composite score, or causal inference is introduced;
* focused tests cover all governed states, coverage conditions, republication, determinism, identity, authority independence, restore equivalence, and clear behavior as applicable;
* canonical lint, typecheck, test, build, and diff validation pass;
* governance records the new derived projection accurately;
* no unresolved stop condition remains.

---

# 110. Recommended Next Task

If Task 4.6 completes successfully, the preferred next task should be:

> **Task 4.7 — Scheduling Realization Explanation, Drill-Down, and Summary Integration**

Task 4.7 should present Scheduling Realization alongside Scheduled Outcomes while making their different questions unmistakable:

```text
Planning
    What happened to intended work while building the schedule?

Execution
    What was reported after work was scheduled?
```

It should not introduce a combined score.

If Task 4.6 discovers semantic ambiguity in HistoricalPlan states, the result should instead recommend the smallest prerequisite needed to resolve that ambiguity.

---

# 111. Final Implementation Principle

> **Before DayFrame evaluates what happened after scheduling, it must be able to distinguish what successfully reached the schedule in the first place.**

Scheduling Realization V1 exists to describe that planning boundary truthfully.

It does not score the user.

It does not score DayFrame.

It records the historical disposition of intended work using the authority DayFrame already possesses.

---

# 112. Final Completion Statement

**Task 4.6 is complete when DayFrame implements a second pure, deterministic, explicitly governed Historical Intelligence projection that describes the effective historical planning disposition of intended occurrences without conflating planning outcomes with execution outcomes; when the actual HistoricalPlan semantics of scheduled, unplaced, omitted, and blocked have been audited from production code and tests and a truthful metric-specific intended-occurrence denominator has been established from those semantics; when an explicit HistoricalMetricPolicy V1, Scheduling Realization V1 identity, inclusive historical user-day range, and evaluation cutoff govern the projection; when HistoricalPlan publication coverage remains distinguishable as complete, incomplete, unavailable, published-empty, and missing using the same epistemic model established by Completion Distribution; when every eligible intended occurrence contributes exactly once to its governed planning-disposition category and state counts conserve the denominator; when zero intended occurrences produce an explicit not-applicable state and missing plan days never become invented zero-demand evidence; when deterministic provenance preserves each occurrence's frozen historical identity, user-day, source incarnation, title/category/context, planning state, publication evidence, and only genuinely governed state-specific explanation; when current Active, current Preview, and ExecutionHistory are unnecessary for the core projection and cannot reinterpret unchanged HistoricalPlan authority; when corrections, retractions, skipped outcomes, completed outcomes, and other ExecutionHistory changes cannot alter Scheduling Realization; when HistoricalPlan republication changes the result only through canonical effective-publication selection at the explicit cutoff; when source recreation cannot retarget historical occurrences; when identical HistoricalPlan authority, metric policy, and query produce deeply equal, deterministically ordered, clone-isolated output; when Backup V3, restore, and full clear naturally preserve or remove the underlying historical authority without adding metric persistence, staging, restore, clear, migration, or Backup behavior; when querying Scheduling Realization creates no schedule, plan publication, report, domain event, durable identifier, current-state mutation, or historical rewrite; when no Summary UI, human-capacity claim, scheduler success score, Planned Allocation metric, trend, comparison, Goal, Progress model, Recommendation, learning behavior, composite score, adherence score, or causal interpretation has been introduced; when focused semantic, coverage, republication, identity, independence, determinism, restore-equivalence, clear, and regression tests pass; when canonical lint, typecheck, full tests, build, and diff validation pass; when governance accurately records the projection as derived planning-history intelligence; and when no unresolved stop condition remains.**
