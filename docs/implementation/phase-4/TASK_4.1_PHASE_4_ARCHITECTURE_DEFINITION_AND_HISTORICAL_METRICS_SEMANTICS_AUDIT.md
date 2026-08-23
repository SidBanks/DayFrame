# Task 4.1 — Phase 4 Architecture Definition and Historical Metrics Semantics Audit

## Status

Ready for architecture/audit execution.

## Phase

Phase 4 — Historical Intelligence

## Task Type

Architecture definition, semantic audit, analytical-policy design, epistemic-boundary definition, and implementation-readiness determination.

---

# 1. Context

Phase 3 is complete.

The Phase 3 closure audit independently confirmed that DayFrame now has:

* durable HistoricalPlan authority representing what was planned;
* durable ExecutionHistory authority representing what was observed;
* stable `DurableOccurrenceReference` identity joining planned and observed evidence;
* source-incarnation continuity preventing recreated sources from retargeting old history;
* immutable correction/retraction semantics;
* deterministic effective-outcome projection;
* explicit distinction between missing HistoricalPlan coverage and published-empty HistoricalPlan coverage;
* durable Backup V3;
* restart-recoverable five-authority restore;
* restart-safe five-authority full clear;
* deterministic validation.

Phase 3 explicitly did **not** define historical metrics, adherence, completion percentage, Goals, Progress, or learning.

Its final audit classified historical metrics as:

> **Ready for design.**

The required historical authorities and identity semantics now exist. What remains undefined is what DayFrame is allowed to infer from that evidence.

Task 4.1 begins that work.

---

# 2. Purpose

Task 4.1 must define the architecture and semantics of DayFrame's first historical-intelligence layer before any metric implementation begins.

The core question is:

> **Given truthful evidence about what was planned and what was observed, what conclusions may DayFrame truthfully derive?**

This task must distinguish:

```text
historical fact
      ↓
eligible analytical evidence
      ↓
defined transformation
      ↓
metric / observation
      ↓
possible future recommendation
```

DayFrame must never collapse those layers into one another.

---

# 3. Governing Principle

> **Historical intelligence must never claim more certainty, judgment, or causality than the underlying evidence supports.**

A metric is a derived interpretation of historical authority.

It is not historical authority itself.

---

# 4. Epistemic Integrity Principle

Phase 4 adopts the following architectural rule:

> **Every historical conclusion must be externally calibratable against the evidence from which it was derived.**

For every metric DayFrame eventually exposes, the architecture should make it possible to answer:

1. What evidence contributed?
2. What evidence was excluded?
3. Why was it excluded?
4. What historical coverage existed?
5. What policy transformed that evidence?
6. How much uncertainty remains?
7. Would corrected historical evidence change the result?

If DayFrame cannot answer those questions, the metric is not yet sufficiently defined.

---

# 5. Task Objective

Produce a Phase 4 architecture definition that determines:

* what Historical Intelligence means in DayFrame;
* what its authority inputs are;
* whether metrics themselves are durable or derived;
* denominator eligibility;
* numerator semantics;
* historical coverage semantics;
* handling of scheduled/unplaced/omitted/blocked occurrences;
* handling of completed/partial/skipped/unknown execution outcomes;
* treatment of missing observations;
* correction/retraction behavior;
* as-of semantics;
* time-window semantics;
* partial-completion semantics;
* aggregation semantics;
* confidence/coverage representation;
* explainability requirements;
* source/category aggregation boundaries;
* appropriate first metrics;
* inappropriate or misleading metrics;
* the boundary between descriptive observation and recommendation;
* the relationship between Historical Intelligence and future Goals/Progress;
* implementation sequencing for Phase 4.

No production implementation is authorized.

---

# 6. Execution Artifact Rules

Before beginning:

1. verify the supplied Task 4.1 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies if both exist;
4. record SHA-256;
5. review:

   * Task 3.16 result;
   * `CHECKPOINT_Phase_3_COMPLETE.md`;
   * current `CURRENT_STATE.md`;
   * current `ROADMAP.md`;
   * relevant HistoricalPlan ADRs;
   * relevant ExecutionHistory ADRs;
   * Outcome Summary decisions;
   * current historical reporting behavior;
   * current types and projections for HistoricalPlan and ExecutionHistory;
6. do not modify this task artifact during execution.

Create:

`docs/implementation/phase-4/TASK_4.1_PHASE_4_ARCHITECTURE_DEFINITION_AND_HISTORICAL_METRICS_SEMANTICS_AUDIT_RESULT.md`

---

# 7. Audit Before Design

Do not begin by inventing metrics.

First reconstruct exactly what evidence DayFrame currently possesses.

Audit:

```text
HistoricalPlan
ExecutionHistory
DurableOccurrenceReference
source incarnation
publication coverage
effective outcome
revision chains
categories
source families
scheduled placement
unplaced state
omitted state
blocked state
timestamps
durations
historical reporting subjects
```

For each field, determine:

* what it means;
* where it originates;
* whether it is authoritative;
* whether it survives restart;
* whether it survives Backup V3;
* whether it may change through correction;
* whether it is appropriate analytical input.

---

# 8. Historical Intelligence Boundary

Define Historical Intelligence as a derived subsystem.

Preferred conceptual boundary:

```text
HistoricalPlan
       +
ExecutionHistory
       ↓
Historical Intelligence
       ↓
descriptive historical projections
```

Historical Intelligence should not mutate either authority.

---

# 9. No New Historical Truth

Metrics must not become a third historical truth source.

The authoritative distinction remains:

```text
HistoricalPlan
    = what was planned

ExecutionHistory
    = what was observed
```

Historical Intelligence answers:

```text
What can reasonably be said
about the relationship between them?
```

---

# 10. Derived vs Durable Determination

Determine whether historical metrics should be:

### A. Purely derived

Recomputed from HistoricalPlan + ExecutionHistory.

### B. Derived with disposable cache

Cached for performance but reproducible from authority.

### C. Durable analytical authority

Persisted as independent truth.

Strong preference:

> A or B unless a concrete requirement proves otherwise.

Do not create durable metric authority merely because persistence is convenient.

---

# 11. Reproducibility

Any metric should be reproducible from:

* HistoricalPlan;
* ExecutionHistory;
* explicit metric policy/version;
* explicit query/window.

If caching is later introduced, deleting the cache must not destroy historical truth.

---

# 12. Metric Policy Versioning

Determine whether analytical policy requires explicit version identity.

Example:

```text
HistoricalMetricPolicy V1
```

This may become necessary because changing denominator rules could change historical values without changing historical evidence.

Audit and decide.

Do not implement the version.

---

# 13. Historical Coverage Model

HistoricalPlan already distinguishes:

```text
missing publication
        ≠
published empty day
```

Phase 4 must preserve this distinction analytically.

Define what each means.

A missing day must not automatically mean:

* zero commitments;
* zero completions;
* failure;
* perfect adherence.

---

# 14. Coverage Completeness

Determine whether every historical metric needs accompanying coverage information.

Example conceptual result:

```ts
{
  value: ...,
  coverage: {
    expectedDays: ...,
    publishedDays: ...,
    missingDays: ...
  }
}
```

Do not prescribe exact type syntax unless justified.

---

# 15. Confidence vs Coverage

Determine whether DayFrame needs the term:

* coverage;
* confidence;
* completeness;
* evidence quality;

or multiple concepts.

Avoid calling something “confidence” if it is merely percentage of historical days with known publication.

---

# 16. Analytical Window

Define how historical queries specify time.

Candidates include:

* date range;
* rolling N days;
* user weeks;
* calendar weeks;
* schedule cycles;
* source lifetime;
* all available history.

Determine which belong in the initial architecture.

---

# 17. User-Day Semantics

Audit whether historical aggregation should use DayFrame's user-day boundary rather than calendar midnight.

HistoricalPlan already contains planned-day semantics.

Do not accidentally aggregate overnight schedules according to civil-calendar dates if that contradicts DayFrame's planning model.

---

# 18. Week Semantics

DayFrame supports configurable week starts.

Determine whether historical weekly aggregation uses:

* historical effective week-start semantics;
* current week-start preference;
* calendar ISO weeks;
* explicit query policy.

Changing today's preferences must not silently reinterpret old historical truth unless that is explicitly intended.

---

# 19. Historical Preference Drift

Audit what HistoricalPlan freezes about historical scheduling preferences.

Determine whether enough information exists to aggregate history under the semantics that existed when it was planned.

If not, identify the limitation.

Do not fabricate historical preference state.

---

# 20. Denominator Definition

This is a central Task 4.1 decision.

Define what counts as an eligible planned occurrence.

Potential states include:

```text
scheduled
unplaced
omitted
blocked
```

Do not assume every planned subject belongs in the same denominator.

---

# 21. Scheduled Occurrences

Determine whether scheduled occurrences are normally denominator-eligible.

Likely yes, but establish why.

---

# 22. Unplaced Occurrences

Determine what `unplaced` means analytically.

Possible interpretations:

* commitment existed but DayFrame could not schedule it;
* user failure;
* planning-system failure;
* capacity signal;
* excluded from execution adherence but included in planning-realism metrics.

Do not automatically count unplaced as missed.

---

# 23. Omitted Occurrences

Determine why an occurrence can be omitted.

Audit actual Phase 3 semantics before assigning analytical meaning.

Possible treatment:

* intentional exclusion;
* scheduling policy outcome;
* denominator-ineligible;
* separate planning statistic.

Do not infer failure from omission.

---

# 24. Blocked Occurrences

Determine what blocked means.

A blocked occurrence may indicate:

* conflict;
* unavailable capacity;
* unresolved friction;
* another planning condition.

Do not count it as user noncompliance without evidence.

---

# 25. Multiple Denominators

Determine whether DayFrame needs different denominators for different questions.

Example:

```text
Execution follow-through
    denominator = executable scheduled occurrences

Planning demand
    denominator = all intended occurrences

Scheduling success
    denominator = intended occurrences eligible for placement
```

A single universal denominator may be misleading.

---

# 26. Numerator Definition

Audit ExecutionHistory outcome categories:

```text
completed
partial
skipped
unknown
```

Determine how each participates in each proposed metric.

---

# 27. Completed

For simple execution-follow-through metrics, completed is likely positive evidence.

But determine whether duration/quantity matters.

Do not assume every completion is binary if evidence supports richer semantics.

---

# 28. Partial

Define what partial means analytically.

Potential policies:

### Binary non-completion

Partial does not count as completed.

### Fractional

Partial contributes some measured fraction.

### Separate category

Do not collapse it into a scalar.

Strongly evaluate the third option first.

Do not invent 0.5 weighting without evidence.

---

# 29. Skipped

Determine whether skipped means:

* known non-completion;
* intentional cancellation;
* explicit refusal;
* rescheduling;
* another semantic.

Use current ExecutionHistory definitions.

Do not assign moral or performance judgment.

---

# 30. Unknown

Unknown must receive special treatment.

Determine whether unknown means:

* no valid current observation;
* retracted observation;
* explicitly unknown observation;
* other.

Do not automatically count unknown as failure.

---

# 31. No Execution Record

Distinguish:

```text
ExecutionHistory outcome = unknown
```

from:

```text
no ExecutionHistory evidence exists
```

These may not mean the same thing.

This distinction must be explicit.

---

# 32. Missing Report vs Missed Commitment

DayFrame must not silently equate:

```text
not reported
```

with:

```text
not completed
```

unless a future explicit policy provides sufficient evidence for that inference.

This is a critical Phase 4 epistemic invariant.

---

# 33. Metric Families

Audit whether initial Historical Intelligence should separate at least:

### Execution metrics

What happened to executable planned occurrences?

### Planning metrics

How successfully did DayFrame produce executable schedules?

### Capacity metrics

How much intended demand exceeded schedulable capacity?

### Reporting-quality metrics

How complete is execution evidence?

Do not collapse these into one “adherence score.”

---

# 34. Adherence Terminology

Determine whether DayFrame should use the word **adherence** at all.

It can imply judgment or compliance with a prescribed regimen.

Alternatives:

* follow-through;
* completion;
* execution;
* plan realization;
* planned-vs-observed;
* consistency.

Make a recommendation.

---

# 35. First Metric Candidate — Completion Distribution

Evaluate a categorical distribution:

```text
completed
partial
skipped
unknown
not reported
```

over eligible planned occurrences.

This may preserve more truth than immediately reducing history to one percentage.

Determine whether it should be Phase 4's foundational metric.

---

# 36. First Metric Candidate — Reporting Coverage

Evaluate:

```text
eligible occurrences
vs
occurrences with execution evidence
```

This answers how much of the history DayFrame can actually reason about.

Determine whether every execution metric should expose this alongside its value.

---

# 37. First Metric Candidate — Scheduling Realization

Evaluate:

```text
intended occurrences
vs
scheduled
unplaced
omitted
blocked
```

This measures the planner, not the user.

Determine whether this is analytically valuable.

---

# 38. First Metric Candidate — Time Allocation

Audit whether HistoricalPlan contains sufficient duration information to derive:

* planned minutes by category;
* planned minutes by source;
* scheduled workload over time.

Then determine whether ExecutionHistory contains sufficient evidence for **actual** time spent.

Do not call planned duration “actual time.”

---

# 39. Consistency

Determine what “consistency” could truthfully mean.

Potentially:

* repeated completed outcomes across comparable occurrences;
* stability of planned allocation;
* reporting regularity.

Do not define consistency as a vague motivational score.

---

# 40. Trends

Determine what is required before DayFrame may say:

```text
improving
declining
stable
```

At minimum consider:

* sufficient observations;
* sufficient coverage;
* comparable windows;
* metric policy;
* noise;
* corrections.

Avoid causal language.

---

# 41. Causality Boundary

Historical correlation must not become causal assertion.

Example:

Allowed:

> Completion was lower on weeks containing more scheduled work.

Not automatically allowed:

> More work caused lower completion.

Define this boundary.

---

# 42. Recommendation Boundary

Separate:

```text
descriptive metric
```

from:

```text
recommendation
```

A recommendation should require a separate policy layer.

Historical Intelligence V1 should not silently mutate schedules based on observed patterns.

---

# 43. No Automatic Learning Yet

Do not introduce:

* automatic priority changes;
* automatic duration changes;
* automatic preferred-window changes;
* automatic schedule-template edits;
* hidden adaptive weights.

Learning remains future work.

---

# 44. Explainability

Every displayed metric should be explainable.

Define minimum explanation requirements.

Potentially:

* window;
* eligible occurrence count;
* observed count;
* excluded count;
* category breakdown;
* coverage;
* metric definition.

---

# 45. Drill-Down

Determine whether metric results should carry enough provenance to allow future drill-down from:

```text
metric
   ↓
contributing occurrences
```

Strong preference: yes.

Do not require immediate UI implementation.

---

# 46. Source Aggregation

Determine whether metrics may group by:

* source;
* source incarnation;
* source family;
* category;
* commitment type.

Old and recreated sources must not be accidentally merged when lifetime distinction matters.

---

# 47. Source Incarnation vs Logical Grouping

A future user may reasonably want:

> How have my workouts gone over the last year?

even if the Workout commitment was deleted and recreated.

But authority identity correctly treats those as separate lifetimes.

Define the distinction between:

```text
identity join
```

and:

```text
intentional analytical grouping
```

Do not weaken source-incarnation safety to provide convenient charts.

---

# 48. Category Aggregation

Audit category stability.

If categories can change over time, determine whether metrics use:

* frozen historical category;
* current source category;
* another explicit policy.

Strong preference:

> historical facts should use frozen historical classification where available.

---

# 49. Historical Snapshot Use

HistoricalPlan stores frozen occurrence snapshots.

Determine which snapshot fields may be used for grouping and explanation.

Do not query current Active to reinterpret historical occurrences unless explicitly defined as a separate present-day view.

---

# 50. Corrections and Metric Recalculation

Metrics should reflect effective current historical evidence.

If an execution report is corrected:

```text
metric before correction
      ≠
metric after correction
```

without rewriting HistoricalPlan or original ExecutionHistory evidence.

Confirm this architecture.

---

# 51. Retraction

A retracted execution observation must not silently become a skipped outcome.

Determine how metrics treat the resulting effective `unknown`.

---

# 52. As-Of Semantics

Determine whether Phase 4 needs historical queries such as:

> What did DayFrame believe on July 1?

This differs from:

> Using everything known now, what happened during June?

Possible modes:

```text
current-evidence view
historical as-of view
```

Decide whether both are needed now or whether V1 may explicitly support only current-evidence analysis.

---

# 53. Revision-Time vs Occurrence-Time

Metrics may involve at least two temporal dimensions:

* when the occurrence happened;
* when evidence/correction was recorded.

Define which determines inclusion in a historical window.

Likely:

> occurrence time selects the subject; current effective evidence determines present analysis.

But audit and decide.

---

# 54. Publication Revision

HistoricalPlan may have revised publications/as-of projections.

Determine whether historical metrics use:

* latest effective plan;
* plan as originally published;
* plan as-of occurrence time;
* explicit query mode.

Do not leave this implicit.

---

# 55. Planning Revision Semantics

If a day's HistoricalPlan was republished legitimately, what should later metrics consider the denominator?

Define policy based on actual HistoricalPlan revision semantics.

---

# 56. Time Zones

Audit whether HistoricalPlan stores sufficient canonical date/time semantics for historical aggregation across timezone changes.

If the user changes timezone:

* should old occurrences move between analytical days?
* remain attached to historical user-days?
* require explicit display conversion?

Identify current evidence and limitation.

Do not solve unrelated timezone architecture unless necessary.

---

# 57. DST

Audit whether daylight-saving transitions affect:

* planned duration;
* day aggregation;
* rolling windows.

Classify whether current historical representation is sufficient.

---

# 58. Capacity Intelligence

Define what “capacity” could mean from current evidence.

Potentially:

```text
planned demand
schedulable demand
placed demand
blocked/unplaced demand
```

Do not equate scheduled minutes with true human capacity.

---

# 59. Planning Realism

Evaluate whether repeated unplaced/blocked occurrences could support a descriptive observation:

> The plan repeatedly contained more demand than the scheduler could place.

This describes the planning system/evidence.

It does not accuse the user of overcommitting unless policy supports that conclusion.

---

# 60. Execution Realism

Evaluate whether planned-versus-observed history could eventually reveal patterns such as:

> Certain commitment categories are more often reported partial than completed.

This is descriptive.

Do not infer motivation or cause.

---

# 61. Reporting Behavior

DayFrame may observe that some occurrences lack execution reports.

Do not frame missing reporting as execution failure.

Potentially expose:

```text
reporting coverage
```

as its own metric.

---

# 62. Small-Sample Behavior

Define minimum evidence requirements before displaying:

* percentages;
* trends;
* comparisons.

Possible approaches:

* always show counts;
* suppress percentages below N;
* display low-evidence qualifier.

Do not invent statistical confidence intervals unless justified.

---

# 63. Zero Denominator

Define metric behavior when no eligible occurrences exist.

Do not return:

```text
0%
```

if the mathematically truthful state is:

```text
not applicable
```

---

# 64. Missing Coverage

If an analytical window contains missing HistoricalPlan days, determine whether metrics:

* calculate over known coverage and disclose incompleteness;
* refuse calculation;
* support both modes.

Define V1 policy.

---

# 65. Published Empty Days

Published-empty days should contribute evidence that DayFrame knows there were zero planned occurrences.

They must not be treated as missing data.

---

# 66. Mixed Coverage

Example:

```text
14-day window
10 published days
2 published-empty days
4 missing days
```

Define what a metric result must disclose.

---

# 67. Metric Result Contract

Design a conceptual metric-result contract.

Potential components:

```text
metric identity
policy version
window
value / distribution
eligible count
observed count
excluded count
coverage
breakdown
provenance
limitations
```

Do not implement types.

---

# 68. Distribution Before Score

Explicitly evaluate the architectural principle:

> **Prefer distributions and counts before composite scores.**

A single score can hide:

* missing reporting;
* blocked plans;
* partial outcomes;
* sparse coverage.

Determine whether this should govern Historical Intelligence V1.

---

# 69. Composite Scores

Do not authorize a composite “DayFrame score” under Task 4.1 unless there is an exceptionally strong semantic justification.

Default:

> deferred.

---

# 70. Metric Naming

Names must describe what is measured.

Prefer:

```text
Completion distribution
Reporting coverage
Scheduling realization
Planned allocation
```

over:

```text
Success score
Productivity score
Discipline score
```

unless semantics truly support them.

---

# 71. User Judgment Boundary

Historical Intelligence must not encode moral judgment.

Avoid architecture that labels the user:

* good/bad;
* disciplined/undisciplined;
* productive/unproductive;
* successful/failing.

Metrics describe evidence and patterns.

---

# 72. Goals Boundary

Goals are desired future states.

Historical metrics are descriptions of evidence.

Define:

```text
metric
    ≠
goal
```

A future Goal may reference a metric, but the metric must exist independently.

---

# 73. Progress Boundary

Progress requires:

```text
goal
+
metric/evaluation policy
+
time/evidence
```

Therefore Progress should not be introduced merely because historical metrics exist.

Confirm this sequencing.

---

# 74. Recommendations Boundary

Recommendations may consume:

```text
historical metrics
+
current planning context
+
explicit recommendation policy
```

Recommendations are not metrics.

Do not design recommendation execution in Task 4.1.

---

# 75. Summary Relationship

Recall the intended long-term Summary surface:

```text
Capacity
Goals
Allocations
Progress
Recommendations
```

Determine where Historical Intelligence feeds this model.

Likely:

* Capacity ← planning/history evidence;
* Allocations ← HistoricalPlan;
* Progress ← future Goals + metrics;
* Recommendations ← future policy.

Do not redesign Summary UI yet.

---

# 76. Planner Relationship

Historical Intelligence should not directly mutate Planner.

Future recommendations may offer explicit user-visible changes.

Preserve:

> Users define priorities; DayFrame builds schedules.

---

# 77. Initial Historical Intelligence API Boundary

Design conceptual query boundaries.

Possible examples:

```text
getHistoricalCoverage(...)
getCompletionDistribution(...)
getSchedulingRealization(...)
getPlannedAllocation(...)
```

These are examples only.

Determine whether one generic analytical query or several explicit projections better preserves semantics.

No implementation.

---

# 78. Generic Metric Engine vs Explicit Projections

Evaluate:

### Generic metric engine

Flexible but may encourage semantically arbitrary combinations.

### Explicit projections

More code but stronger contracts and explainability.

Given DayFrame's architecture, determine preferred direction.

---

# 79. Domain Placement

Determine where Historical Intelligence belongs architecturally:

* domain;
* application/query layer;
* projection layer;
* infrastructure;
* mixed.

Strongly avoid infrastructure owning analytical meaning.

---

# 80. Persistence Placement

If metrics are derived, no new persistence surface should be required for V1.

Confirm.

---

# 81. Backup Boundary

Derived Historical Intelligence should not normally appear in Backup V3.

A restored Backup V3 should reproduce metrics from restored authority.

Confirm whether this becomes an invariant.

---

# 82. Full-Clear Boundary

After five-authority full clear:

Historical Intelligence should naturally return empty/not-applicable projections.

No metric-specific clear operation should be necessary if metrics are purely derived.

---

# 83. Restore Boundary

After Backup V3 restore:

historical metrics should reproduce from restored HistoricalPlan + ExecutionHistory.

No metric restore payload should be needed under derived architecture.

---

# 84. Determinism

Given identical:

```text
HistoricalPlan
ExecutionHistory
metric policy
query
```

the result must be identical.

No current wall-clock dependency unless explicitly part of the query.

---

# 85. "Today" Queries

If a metric supports:

> last 30 days

resolve the time window explicitly before evaluation.

The projection itself should receive a deterministic resolved range.

---

# 86. Testing Strategy

Design the Phase 4 testing strategy before implementation.

At minimum future tests should cover:

* complete coverage;
* missing coverage;
* published-empty days;
* zero denominator;
* scheduled/unplaced/omitted/blocked;
* completed/partial/skipped/unknown;
* no report;
* corrections;
* retractions;
* republished plan history;
* source deletion/recreation;
* restart;
* Backup V3 roundtrip;
* full clear;
* timezone/user-day boundaries where relevant.

---

# 87. Golden Semantic Fixtures

Consider creating future canonical semantic fixtures such as:

```text
perfectly reported week
partially reported week
missing HistoricalPlan coverage
published empty week
over-capacity week
corrected execution week
source recreated mid-window
```

Determine whether this should be part of Phase 4 implementation methodology.

---

# 88. Property Invariants

Identify useful future property-level invariants.

Examples:

* adding a missing report must not reduce reporting coverage;
* correcting an outcome must not alter denominator membership;
* deleting current Active must not alter historical metric results;
* Backup V3 roundtrip must preserve metric output;
* published-empty day must not reduce coverage;
* missing day must not become zero-demand evidence.

Do not implement them yet.

---

# 89. Performance Boundary

Do not optimize prematurely.

Estimate whether current history volumes plausibly require:

* indexes;
* cached projections;
* incremental aggregates.

If no demonstrated need exists, prefer pure derivation first.

---

# 90. Data Volume Assumptions

Document reasonable initial scale assumptions.

Do not invent enterprise-scale requirements unless ROADMAP supports them.

---

# 91. Privacy Boundary

Historical Intelligence should operate locally over existing local authority unless current architecture states otherwise.

No telemetry, cloud analytics, or external processing is introduced.

---

# 92. Export Boundary

Determine whether users eventually need to export analytical reports separately from Backup V3.

Classify as:

* Phase 4 requirement;
* later UX feature;
* unnecessary.

Do not modify Backup V3 to include derived metrics.

---

# 93. Explainability UX Requirement

Define what future UI must be capable of showing when a user asks:

> Why does DayFrame say this?

At minimum, architecture should support explanation from evidence.

---

# 94. Recommendation Safety Against Sparse Evidence

Future recommendation policy should not generate strong recommendations from poor historical coverage.

Task 4.1 should define what information Historical Intelligence must expose so recommendation logic can detect sparse evidence.

---

# 95. Comparative Metrics

Determine requirements for comparisons such as:

```text
this month vs last month
workdays vs non-workdays
category A vs category B
```

Do not authorize all comparisons automatically.

Comparable populations and coverage must be considered.

---

# 96. Category Changes

If historical category labels change, comparisons must use frozen historical evidence or an explicit regrouping policy.

Audit current snapshots.

---

# 97. Planned Duration vs Outcome

Determine whether completion distribution should be:

* occurrence-weighted;
* duration-weighted;
* both as separate metrics.

Do not combine them implicitly.

Completing one eight-hour event and one ten-minute event are not necessarily analytically interchangeable, but weighting them by duration also introduces meaning.

Define policy boundaries.

---

# 98. Partial Duration Evidence

If ExecutionHistory does not record actual completed minutes, duration-weighted partial completion may be impossible.

State this explicitly.

Do not infer actual minutes from a `partial` category.

---

# 99. Capacity vs Completion

Keep separate:

```text
Could DayFrame place the intended work?
```

and:

```text
What did the user report happening?
```

These answer different questions.

---

# 100. Friction History

Audit whether Phase 3 persisted enough historical friction evidence to support longitudinal friction analytics.

If not:

> Not currently supported.

Do not reconstruct historical friction from current state.

---

# 101. Recommendation Evidence

Identify what additional historical authority, if any, would eventually be required for recommendations DayFrame may want to make.

Do not add it now.

---

# 102. First Implementation Slice

Task 4.1 must recommend a narrowly bounded first implementation task.

A likely candidate:

> **Task 4.2 — Implement Historical Coverage and Completion Distribution Projection V1**

But the audit must choose based on its findings.

The first slice should prove the analytical architecture without attempting the entire Phase 4 feature set.

---

# 103. Phase 4 Sequence

Recommend a tentative sequence after the audit.

Potential shape:

```text
4.1 Architecture + semantics
4.2 Foundational historical projections
4.3 Historical intelligence UI
4.4 Planning/capacity intelligence
4.5 Goals architecture
4.6 Progress
4.7 Recommendations
...
```

Do not force this exact sequence.

Derive it from architecture.

---

# 104. Stop Conditions

Stop and report if:

* HistoricalPlan lacks sufficient denominator evidence;
* ExecutionHistory lacks sufficient numerator/effective-outcome evidence;
* `DurableOccurrenceReference` cannot safely join the authorities;
* missing vs published-empty coverage cannot be determined;
* historical plan revisions make denominator selection undefined;
* current historical snapshots lack necessary grouping semantics;
* timezone/user-day semantics make basic historical windows unreliable;
* Phase 4 requires new historical authority before any truthful metric can exist;
* current ROADMAP materially contradicts the proposed Historical Intelligence direction.

A stop is preferable to inventing analytical certainty.

---

# 105. Required Semantic Decision Matrix

Produce:

| Question                | Decision | Evidence | Consequence |
| ----------------------- | -------- | -------- | ----------- |
| metric authority        |          |          |             |
| policy versioning       |          |          |             |
| denominator eligibility |          |          |             |
| scheduled               |          |          |             |
| unplaced                |          |          |             |
| omitted                 |          |          |             |
| blocked                 |          |          |             |
| completed               |          |          |             |
| partial                 |          |          |             |
| skipped                 |          |          |             |
| unknown                 |          |          |             |
| no report               |          |          |             |
| missing coverage        |          |          |             |
| published empty         |          |          |             |
| correction              |          |          |             |
| retraction              |          |          |             |
| plan revision           |          |          |             |
| analytical window       |          |          |             |
| source incarnation      |          |          |             |
| category grouping       |          |          |             |
| explainability          |          |          |             |

---

# 106. Required Metric Candidate Matrix

Produce:

| Candidate               | Question answered | Inputs | Coverage requirement | V1 recommendation |
| ----------------------- | ----------------- | ------ | -------------------- | ----------------- |
| completion distribution |                   |        |                      |                   |
| reporting coverage      |                   |        |                      |                   |
| scheduling realization  |                   |        |                      |                   |
| planned allocation      |                   |        |                      |                   |
| consistency             |                   |        |                      |                   |
| trend                   |                   |        |                      |                   |
| composite score         |                   |        |                      |                   |

Use:

* Implement first;
* Implement later;
* Needs more semantics;
* Reject/defer.

---

# 107. Required Evidence-State Matrix

Produce:

| Planned state         | Execution evidence | What may be concluded? | What must not be concluded? |
| --------------------- | ------------------ | ---------------------- | --------------------------- |
| scheduled             | completed          |                        |                             |
| scheduled             | partial            |                        |                             |
| scheduled             | skipped            |                        |                             |
| scheduled             | unknown            |                        |                             |
| scheduled             | none               |                        |                             |
| unplaced              | any                |                        |                             |
| omitted               | any                |                        |                             |
| blocked               | any                |                        |                             |
| missing plan coverage | any                |                        |                             |
| published empty       | none               |                        |                             |

---

# 108. Required Coverage Matrix

Include at least:

| HistoricalPlan coverage | Planned occurrences |             Reporting coverage | Analytical interpretation |
| ----------------------- | ------------------: | -----------------------------: | ------------------------- |
| complete                |                  >0 |                       complete |                           |
| complete                |                  >0 |                        partial |                           |
| complete                |                   0 |                            n/a |                           |
| partial/missing         |                  >0 | complete for known occurrences |                           |
| partial/missing         |                  >0 |                        partial |                           |
| none                    |             unknown |                        unknown |                           |

---

# 109. Required Architecture Matrix

Produce:

| Layer                   | Input | Output | Durable? | Authority? |
| ----------------------- | ----- | ------ | -------: | ---------: |
| HistoricalPlan          |       |        |          |            |
| ExecutionHistory        |       |        |          |            |
| Historical Intelligence |       |        |          |            |
| future Goals            |       |        |          |            |
| future Progress         |       |        |          |            |
| future Recommendations  |       |        |          |            |

---

# 110. Required Invariants

Task 4.1 must classify at least:

1. HistoricalPlan remains the sole planned-history authority.
2. ExecutionHistory remains the sole observed-history authority.
3. Historical Intelligence is derived.
4. Metrics do not mutate historical authority.
5. Metrics are deterministic from authority + policy + query.
6. Missing plan coverage is not zero planned work.
7. Published-empty coverage is known zero planned work.
8. No execution report is not automatically failure.
9. Unknown is not automatically failure.
10. Partial is not assigned an arbitrary numeric weight.
11. Unplaced is not automatically user failure.
12. Blocked is not automatically user failure.
13. Omitted is not automatically user failure.
14. Corrections change effective analysis without rewriting evidence.
15. Retractions do not become skipped outcomes.
16. Source recreation cannot retarget historical joins.
17. Intentional analytical grouping does not weaken identity.
18. Current Active does not reinterpret frozen historical facts.
19. Metrics distinguish occurrence-weighted from duration-weighted analysis.
20. Reporting coverage accompanies claims that depend on execution evidence.
21. Zero denominator is not represented as 0%.
22. Sparse evidence limits strong claims.
23. Correlation is not presented as causation.
24. Metrics remain distinct from Goals.
25. Progress requires Goal semantics not yet defined.
26. Recommendations remain separate from descriptive metrics.
27. No automatic learning occurs.
28. Backup V3 need not persist derived metrics.
29. Full clear naturally clears derived metric output.
30. Restored authority reproduces metric output.
31. Historical metrics remain explainable to contributing evidence.
32. Composite judgment scores are deferred unless explicitly justified.

Use:

* Confirmed;
* Proposed;
* Requires decision;
* Unsupported;
* Deferred.

---

# 111. Required Result Artifact

Create:

`docs/implementation/phase-4/TASK_4.1_PHASE_4_ARCHITECTURE_DEFINITION_AND_HISTORICAL_METRICS_SEMANTICS_AUDIT_RESULT.md`

Include at least:

1. Executive Determination
2. Artifact Integrity
3. Phase 3 Starting Foundation
4. Audit Scope
5. Audit Method
6. Historical Evidence Inventory
7. Historical Intelligence Definition
8. Authority Boundary
9. Derived/Persistence Determination
10. Metric Policy Versioning
11. Historical Coverage Semantics
12. User-Day/Window Semantics
13. Denominator Semantics
14. Scheduled Semantics
15. Unplaced Semantics
16. Omitted Semantics
17. Blocked Semantics
18. Numerator Semantics
19. Completed
20. Partial
21. Skipped
22. Unknown
23. No-Report Semantics
24. Correction/Retraction
25. HistoricalPlan Revision Semantics
26. As-Of Semantics
27. Source-Incarnation Semantics
28. Category/Grouping Semantics
29. Duration Semantics
30. Reporting Coverage
31. Evidence Quality / Coverage Terminology
32. Small-Sample Policy
33. Zero-Denominator Policy
34. Missing-Coverage Policy
35. Candidate Metric Assessment
36. Completion Distribution
37. Reporting Coverage Metric
38. Scheduling Realization
39. Planned Allocation
40. Consistency
41. Trends
42. Composite Scores
43. Capacity Intelligence
44. Planning Realism
45. Causality Boundary
46. Recommendation Boundary
47. Goals Boundary
48. Progress Boundary
49. Summary Relationship
50. Planner Relationship
51. API/Projection Boundary
52. Generic Engine vs Explicit Projections
53. Domain Placement
54. Persistence/Backup/Restore Boundary
55. Determinism
56. Explainability/Provenance
57. Testing Strategy
58. Golden Semantic Fixtures
59. Property Invariants
60. Performance/Data Volume
61. Privacy
62. Export
63. Unsupported Historical Analytics
64. Semantic Decision Matrix
65. Metric Candidate Matrix
66. Evidence-State Matrix
67. Coverage Matrix
68. Architecture Matrix
69. Required Invariant Assessment
70. Architectural Risks
71. Stop-Condition Assessment
72. Phase 4 Architecture Determination
73. Recommended First Implementation Slice
74. Recommended Phase 4 Sequence
75. Governance Recommendations
76. Final Audit Statement

---

# 112. Governance

Task 4.1 may create:

* its result artifact;
* a Phase 4 architecture ADR if a major architectural decision is accepted;
* a Phase 4 checkpoint if useful;
* minimal ROADMAP/CURRENT_STATE updates describing the approved Phase 4 architecture.

Do not claim implementation of Historical Intelligence.

---

# 113. No Production Changes

Mandatory.

Task 4.1 is architecture/audit only.

Do not modify:

* production TypeScript;
* production UI;
* storage schemas;
* Backup formats;
* domain versions;
* tests to introduce new behavior.

If implementation is required to answer the architecture question, stop and identify why.

---

# 114. Phase 4 Architecture Determination

Choose exactly one:

### A. Ready for Historical Intelligence implementation

Existing Phase 3 evidence is sufficient and semantics are defined.

### B. Ready with bounded prerequisite work

Architecture is sound but one or more narrow evidence/model prerequisites must precede metrics.

### C. Not ready — historical authority is insufficient

A Phase 3-level historical truth deficiency remains.

### D. Historical Intelligence direction should be reconsidered

Use only if the proposed product direction is fundamentally unsupported.

---

# 115. Recommended First Implementation Task

If determination A:

define one bounded Task 4.2.

Prefer a task that proves the architecture using transparent descriptive projections rather than sophisticated scoring.

A strong candidate is:

> **Task 4.2 — Implement Historical Coverage and Completion Distribution Projection V1**

It should likely establish:

* explicit analytical query window;
* HistoricalPlan coverage;
* eligible scheduled occurrences;
* categorical execution outcomes;
* not-reported distinction;
* no-report ≠ failure;
* zero-denominator behavior;
* deterministic derived projection;
* evidence provenance.

But Task 4.1 must make the final recommendation.

---

# 116. Final Architecture Principle

> **DayFrame should first become good at describing the user's history truthfully. Only after it can do that should it attempt to evaluate progress or recommend change.**

Phase 3 gave DayFrame memory.

Phase 4 must give it interpretation without sacrificing epistemic integrity.

---

# 117. Final Completion Statement

**Task 4.1 is complete when DayFrame's existing HistoricalPlan and ExecutionHistory authorities have been independently audited as the evidence substrate for Historical Intelligence; when the boundary between historical authority and derived analytical interpretation is explicit; when metric persistence and policy-versioning requirements are determined; when historical coverage, analytical windows, user-day semantics, denominator eligibility, scheduled/unplaced/omitted/blocked treatment, completed/partial/skipped/unknown/no-report treatment, corrections, retractions, plan revisions, source incarnations, grouping, durations, zero denominators, sparse evidence, and missing coverage all have explicit semantic decisions or clearly identified bounded prerequisites; when reporting coverage and explainability requirements prevent incomplete evidence from masquerading as certainty; when descriptive execution, planning, capacity, allocation, consistency, trend, and composite-score candidates are individually assessed rather than collapsed into an undefined adherence score; when correlation is explicitly separated from causation, metrics from Goals, Goals from Progress, and descriptive intelligence from Recommendations and automatic learning; when derived metrics are shown to remain reproducible from historical authority and therefore require no new durable truth or Backup V3 payload unless evidence proves otherwise; when the architecture supports provenance from a metric back to contributing historical occurrences; when semantic, metric-candidate, evidence-state, coverage, and architecture matrices document the resulting policy; when all required epistemic invariants are classified; when unsupported analytics are explicitly rejected rather than inferred; when one unambiguous Phase 4 architecture determination is issued; and when a narrowly bounded first implementation slice is recommended without modifying production code, tests, storage, Backup formats, or domain behavior.**
