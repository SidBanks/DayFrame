# Task 5.7 — Goal Activity V1 Policy and Pure Projection

## Status

Ready for implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Pure derived-intelligence implementation, explicit Goal Activity policy, Goal-linked HistoricalPlan filtering, ExecutionHistory correlation, three-dimensional coverage modeling, categorical planning/outcome distributions, deterministic provenance, protection/cold-start semantics, query integration, testing, and governance.

**No Summary UI, Progress score, recommendation, or adaptive behavior is authorized.**

---

# 1. Context

Task 5.5 audited Goal-linked historical evidence and determined that DayFrame was not yet ready to implement Progress.

The audit instead identified a smaller truthful first derived capability:

> **Goal Activity V1**

The governing question is:

> **What planning and reported activity supported this Goal in this period, and what evidence is missing?**

Task 5.5 established that Goal Activity should remain:

* categorical;
* descriptive;
* derived;
* non-authoritative;
* non-persisted;
* policy-versioned;
* provenance-bearing;
* explicit about missing evidence;
* independent of current Goal-link inference.

Task 5.5 also found one blocker:

```text
Goal-aware known-unlinked history
```

could not be distinguished from:

```text
legacy Goal-provenance-unavailable history
```

Task 5.6 resolved that blocker.

HistoricalPlan now encodes:

```text
goals absent
    = Goal provenance unavailable / legacy

goals: []
    = Goal-aware, known unlinked

goals: [...]
    = Goal-aware, linked to listed Goals
```

The distinction survives:

* validation;
* cloning;
* JSON serialization;
* IndexedDB;
* semantic fingerprints;
* Backup V4;
* restore;
* republication;
* evaluation cutoff.

Task 5.6 therefore recommended:

> **Task 5.7 — Goal Activity V1 Policy and Pure Projection**

---

# 2. Purpose

Implement the first derived Goal intelligence capability.

For one Goal over an explicit historical range and cutoff, DayFrame must be able to answer:

1. Was relevant plan history available?
2. Was Goal-link provenance available?
3. Which intended occurrences were historically linked to this Goal?
4. How were those linked occurrences represented in planning?
5. For linked scheduled occurrences, what current governed execution outcome exists?
6. How complete is reporting coverage?
7. Which evidence contributed to every count?
8. Which dates/records could not be interpreted?
9. What limitations apply to the result?

Task 5.7 must **not** claim:

* Goal completion;
* percentage Progress;
* Goal success;
* Goal health;
* being on track;
* adherence;
* productivity;
* Capacity;
* causation.

---

# 3. Governing Product Term

The feature is called:

> **Goal Activity**

Do not call the projection:

* Goal Progress;
* Goal Performance;
* Goal Score;
* Goal Health;
* Goal Completion;
* Goal Success.

The term is intentionally narrower than Progress.

---

# 4. Governing Semantic Principle

> **Goal Activity describes historical planning and reported activity that was explicitly linked to a Goal. It does not measure how close the user is to accomplishing the Goal.**

---

# 5. Governing Historical-Membership Principle

Historical Goal membership comes only from frozen HistoricalPlan provenance.

Eligibility must never depend on:

* current Goal links;
* current commitment labels;
* current Active;
* current Planner draft.

For a queried Goal:

```text
HistoricalPlan snapshot
    goals contains Goal ID
        → historically linked

HistoricalPlan snapshot
    goals present but excludes Goal ID
        → historically known unlinked

HistoricalPlan snapshot
    goals absent
        → Goal provenance unavailable
```

---

# 6. Governing Coverage Principle

Goal Activity has **three distinct evidence dimensions**:

```text
Plan coverage
    Was effective HistoricalPlan history available?

Goal-link coverage
    Was Goal membership captured?

Reporting coverage
    Was an eligible scheduled occurrence reported?
```

These must never collapse into one generic completeness percentage.

---

# 7. Explicit Scope

Implement:

* `GoalActivityPolicyV1` or equivalent;
* explicit metric/projection identity;
* Goal Activity query contract;
* date range validation;
* evaluation cutoff;
* current Goal query context;
* HistoricalPlan effective-publication selection;
* plan coverage reuse;
* Goal-link coverage;
* historical Goal membership filtering;
* linked planning disposition distribution;
* linked scheduled execution-outcome distribution;
* reporting coverage;
* categorical conservation;
* legacy-history handling;
* cold-start states;
* protection behavior;
* deterministic provenance;
* multi-Goal independence;
* clone isolation;
* application/store query boundary;
* tests;
* governance.

---

# 8. Explicit Non-Goals

Do not implement:

* Summary UI;
* Goal Activity cards;
* Progress UI;
* Progress percentage;
* Goal score;
* Goal streak;
* measurable Goal policies;
* target-date evaluation;
* “on track” status;
* pace;
* Recommendations;
* RecommendationDecision;
* adaptive planning;
* Goal lifecycle history;
* Goal authority changes;
* HistoricalPlan schema changes;
* ExecutionHistory schema changes;
* Goal UI changes;
* Capacity;
* Planned Allocation;
* cross-Goal allocation;
* machine learning.

---

# 9. Execution Artifact Rules

Before implementation:

1. verify this Task 5.7 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.5 result;
   * Task 5.6 result;
   * Goal ADR;
   * Goal authority/query surface;
   * HistoricalPlan provenance coverage helper;
   * HistoricalPlan effective-publication resolver;
   * plan-coverage utilities;
   * Scheduling Realization projection;
   * Completion Distribution / Scheduled Outcomes projection;
   * ExecutionHistory current-head/effective-state logic;
   * reporting coverage utilities;
   * durable historical reference utilities;
   * application/store Historical Intelligence query boundary;
   * Summary query orchestration;
6. do not modify the immutable Task 5.7 artifact.

Create:

`docs/implementation/phase-5/TASK_5.7_GOAL_ACTIVITY_V1_POLICY_AND_PURE_PROJECTION_RESULT.md`

---

# 10. Initial Source Audit

Before writing projection code, confirm:

* exact Goal query result shape;
* Goal protected/not-found states;
* HistoricalPlan snapshot disposition union;
* HistoricalPlan `goals` presence semantics;
* `historicalGoalProvenanceCoverage(...)`;
* effective publication selection;
* HistoricalMetricPolicy current responsibilities;
* existing plan coverage resolver;
* ExecutionHistory effective outcome classification;
* reporting coverage calculation;
* current canonical occurrence reference serialization;
* current clone/fingerprint conventions.

Stop if Task 5.6 semantics are not present.

---

# 11. Module Placement

Place pure Goal Activity logic with existing Historical Intelligence core.

Preferred conceptual placement:

```text
core/historicalIntelligence/
```

Application/store adapter remains in the existing state/query layer.

Do not put classification logic inside React components.

---

# 12. Projection Identity

Define an explicit identity.

Conceptually:

```text
{
    id: "goalActivity",
    version: 1
}
```

Use repository conventions.

---

# 13. Policy Identity

Define an explicit Goal Activity policy.

Possible:

```text
GoalActivityPolicyV1
```

Do not silently overload Completion Distribution or Scheduling Realization policy.

---

# 14. HistoricalMetricPolicy Relationship

Audit whether Goal Activity should:

### A. reuse HistoricalMetricPolicy V1 for common historical-range/cutoff rules and add GoalActivityPolicy V1

or:

### B. use only a new GoalActivityPolicy

Preferred direction:

> reuse existing generic historical policy where its semantics genuinely apply, while adding Goal-specific eligibility/coverage rules separately.

Do not make Goal Activity policy redefine plan coverage or outcome semantics.

---

# 15. Query Contract

The query must include at minimum:

```text
goalId
startUserDayDate
endUserDayDate
evaluationAsOf
policy
```

Determine whether current Goal revision is an input or returned context.

Preferred:

* query by durable Goal ID;
* return current Goal revision/context separately;
* historical eligibility uses frozen Goal ID regardless of revision.

---

# 16. Goal Existence

If Goal ID does not resolve in current Goal authority:

return explicit unavailable/not-found result according to existing query conventions.

Do not reconstruct a current Goal from HistoricalPlan.

---

# 17. Protected Goal Authority

If Goal authority is protected/unavailable:

Goal Activity is unavailable.

Do not infer current Goal identity from frozen history.

---

# 18. Current Goal Context

Return current authored context as appropriate:

* Goal ID;
* current revision;
* title;
* lifecycle;
* target date if present;
* measurement-policy reference if present.

This is contextual metadata.

It must remain separate from historical frozen Goal context.

---

# 19. Current Goal CreatedAt

Task 5.5 recommended that default Goal evaluation should not silently claim relevance before Goal creation.

However this query has an explicit date range.

Determine exact V1 behavior.

Preferred:

* permit explicit query ranges that begin before `createdAt`;
* mark pre-creation/legacy coverage truthfully;
* do not backfill Goal membership.

Do not silently truncate an explicitly requested range unless policy says so.

Record the decision.

---

# 20. Current Goal Lifecycle

Current lifecycle is context only.

It must not alter historical eligibility.

A completed or archived Goal remains queryable.

---

# 21. Goal Target Date

Return as context only.

Do not use target date to:

* restrict range automatically;
* calculate pace;
* determine overdue;
* compute Progress.

---

# 22. Measurement Policy Reference

Return current reference for context if useful.

Do not execute it.

Frozen historical measurement references remain provenance only.

---

# 23. Historical Range

Use inclusive frozen user-day start/end dates consistent with Phase 4 Historical Intelligence.

Validate:

* canonical dates;
* start ≤ end;
* bounded range according to project conventions.

---

# 24. Evaluation Cutoff

Require explicit `evaluationAsOf`.

Use it for:

* canonical HistoricalPlan effective-publication selection;
* ExecutionHistory effective/current-head selection according to existing semantics.

Do not consult wall-clock time inside the pure projection.

---

# 25. Effective Publication Selection

Reuse canonical HistoricalPlan selection.

Exactly one effective publication per requested day at/before cutoff.

Do not mix publications from different revisions for one day.

---

# 26. Plan Coverage

Reuse existing canonical plan coverage.

Distinguish:

```text
published
published empty
missing
```

and aggregate to existing:

```text
complete
incomplete
unavailable
```

or canonical equivalents.

Do not reinterpret plan coverage for Goals.

---

# 27. Goal-Link Coverage

Implement a distinct Goal-link coverage model.

It must answer:

> For the effective HistoricalPlan evidence in the selected range, was Goal provenance available for Goal-linkable occurrences?

At raw occurrence level:

```text
goals absent
    → unavailableLegacy

goals present
    → available
```

---

# 28. Goal-Link Coverage Window Result

Define window-level result.

Likely categories:

```text
complete
incomplete
unavailable
```

or:

```text
available
partialCoverage
unavailableLegacy
```

Choose one vocabulary consistent with existing coverage architecture.

The result must disclose:

* total eligible occurrences examined;
* Goal-provenance-available count;
* Goal-provenance-unavailable count;
* affected dates/references where useful.

Do not use a percentage unless the project already uses count ratios for coverage descriptively and it remains truthful.

---

# 29. Published-Empty Days

Published-empty days contain no intended occurrences.

They are known plan coverage.

They should not create Goal-link coverage failures merely because there are no occurrences to classify.

Define denominator carefully.

---

# 30. Missing Plan Days

Missing plan day:

* contributes to plan coverage missing;
* does not create a fake Goal-link-unavailable occurrence.

Goal-link coverage applies only to effective existing eligible occurrences.

The result should still disclose the missing day through plan coverage.

---

# 31. Eligible Occurrence Kinds

Reuse Task 5.6's Goal-linkable occurrence eligibility.

Only occurrence kinds capable of Goal provenance participate in Goal Activity.

Document exact supported source families.

Do not broaden linkability.

---

# 32. Goal Membership

For each Goal-aware eligible occurrence:

```text
snapshot.goals contains queried Goal ID
    → included in Goal Activity

snapshot.goals present but excludes queried Goal ID
    → known unlinked; excluded

snapshot.goals absent
    → membership unknown; excluded from linked distributions
       but disclosed in Goal-link coverage
```

Never guess.

---

# 33. Goal Revision

Frozen Goal revision does not need to equal current Goal revision.

All historical occurrences frozen under the same Goal ID belong to that Goal's historical evidence.

Retain frozen revision in provenance.

---

# 34. Frozen Goal Title

Retain historical frozen title in provenance.

Current Goal title may differ.

Do not rewrite it.

---

# 35. Frozen Goal Status

Retain for provenance.

Do not use as eligibility filter.

---

# 36. Frozen Measurement Policy

Retain for provenance.

Do not interpret.

---

# 37. Planning Distribution

For historically linked occurrences, classify exactly once into:

```text
scheduled
unplaced
omitted
blocked
```

Reuse Scheduling Realization semantics.

---

# 38. Planning Denominator

Define:

```text
linkedIntendedOccurrenceCount
```

as the number of historically Goal-linked intended occurrences in available Goal-aware evidence.

Conservation:

```text
linkedIntendedOccurrenceCount
=
scheduled
+ unplaced
+ omitted
+ blocked
```

This is a distribution denominator, not Goal Progress.

---

# 39. Known-Unlinked Occurrences

Do not include known-unlinked occurrences in the queried Goal's planning distribution.

They may contribute only to Goal-link coverage evidence.

---

# 40. Legacy Unknown Occurrences

Do not include them in linked distribution.

Do not count them as unlinked.

Disclose through Goal-link coverage.

---

# 41. Linked Scheduled Occurrences

Only historically linked occurrences whose planning disposition is `scheduled` are eligible for execution outcome correlation.

---

# 42. Execution Outcome Distribution

Reuse existing Scheduled Outcomes categorical semantics:

```text
completed
partial
skipped
unknown
notReported
```

or canonical current naming.

Do not alter existing categories.

---

# 43. Execution Denominator

Define:

```text
linkedScheduledOccurrenceCount
```

as the number of historically Goal-linked scheduled occurrences.

Conservation:

```text
linkedScheduledOccurrenceCount
=
completed
+ partial
+ skipped
+ unknown
+ notReported
```

according to existing projection semantics.

---

# 44. Completed

Means:

> User reported the scheduled Goal-linked occurrence completed.

Does not mean:

> Goal completed.

---

# 45. Partial

Categorical only.

No weight.

---

# 46. Skipped

Categorical only.

No judgment.

---

# 47. Unknown

Reuse current correction/retraction semantics.

Do not rename withdrawn evidence as failure.

---

# 48. Not Reported

Distinct from unknown/skipped.

---

# 49. Reporting Coverage

Reuse or adapt existing reporting-coverage rules over:

```text
linked scheduled occurrences only
```

Do not measure reporting coverage over unplaced/omitted/blocked occurrences.

---

# 50. Three Coverage Dimensions

The result must make these independently available:

### Plan coverage

Requested historical days.

### Goal-link coverage

Goal provenance on effective eligible occurrences.

### Reporting coverage

Effective execution outcomes for linked scheduled occurrences.

No combined "overall coverage" score.

---

# 51. Coverage Independence

Possible result:

```text
Plan coverage       Complete
Goal-link coverage  Incomplete
Reporting coverage  Complete
```

must be valid.

Likewise:

```text
Plan coverage       Complete
Goal-link coverage  Complete
Reporting coverage  Incomplete
```

must be valid.

---

# 52. Legacy History

If the selected range contains legacy Goal-provenance-unavailable occurrences:

* known linked evidence may still be reported from Goal-aware portions;
* Goal-link coverage becomes incomplete/unavailable as appropriate;
* no extrapolation.

---

# 53. Entirely Legacy Range

If plan history exists but every eligible occurrence has unavailable Goal provenance:

Goal Activity linked distributions should be unavailable rather than zero.

Do not say:

> No linked activity.

---

# 54. Known Goal-Aware Zero

If Goal-link coverage is complete and no occurrence is linked to the queried Goal:

return a known zero/no-linked-evidence state.

This is not the same as unavailable.

---

# 55. No Intended Occurrences

If requested plan days are fully published empty:

* plan coverage known;
* linked intended occurrence count = 0;
* Goal-link coverage may be not applicable because no eligible occurrences exist;
* Goal Activity distribution is `notApplicable` rather than percentage.

Define precisely.

---

# 56. Cold Start

Distinguish at least:

### A. No HistoricalPlan history

Plan coverage unavailable.

### B. History exists, Goal provenance unavailable

Goal-link coverage unavailable.

### C. Goal-aware history exists, but no linked occurrences

Known no linked activity.

### D. Linked scheduled activity exists, no reports

Goal activity known; reporting incomplete/not reported.

---

# 57. Goal Created Recently

Do not backfill older commitment history.

If only recent Goal-aware linked history exists, return it and disclose older unknown/missing coverage if requested.

---

# 58. Multi-Goal Occurrence

One occurrence may appear in:

```text
Goal A Activity
Goal B Activity
```

if frozen provenance contains both Goal IDs.

This is valid.

---

# 59. No Cross-Goal Conservation

Do not assert:

```text
sum Goal-linked occurrence counts
=
total occurrence count
```

because one occurrence may support multiple Goals.

---

# 60. No Duration Allocation

Do not divide an occurrence's scheduled or actual duration among Goals.

---

# 61. Duration Evidence

Audit existing ExecutionHistory actual-duration fields.

If actual user-reported duration is already available and safe to retain in provenance, it may be exposed as row-level evidence.

Do not introduce duration totals as a core Goal Activity V1 metric unless current semantics clearly support them.

Preferred V1: categorical counts first.

---

# 62. No Scheduled-Duration-as-Effort

Do not claim:

> X hours worked toward Goal

from scheduled duration.

Scheduled duration means planned interval.

---

# 63. No Completed-Duration Inference

Do not infer actual duration from:

```text
outcome = completed
```

unless ExecutionHistory explicitly records duration.

---

# 64. Goal Activity Result

Define a canonical pure result.

Conceptually:

```text
GoalActivityResultV1 {
    identity
    policy
    query
    goalContext

    planCoverage
    goalLinkCoverage
    reportingCoverage

    planningDistribution
    scheduledOutcomeDistribution

    provenance
    exclusions
    advisories
}
```

Exact shape follows conventions.

---

# 65. Result Status

Define explicit result status.

Potential:

```text
available
partialCoverage
unavailable
notApplicable
protected
invalidQuery
goalNotFound
```

Avoid one vague success boolean.

---

# 66. Planning Distribution Shape

Include exact counts.

Do not calculate a percentage unless Task 5.7 explicitly establishes a truthful descriptive percentage.

Preferred: counts only.

---

# 67. Execution Distribution Shape

Likewise counts.

No scoring.

---

# 68. No "Completion Rate"

Do not calculate:

```text
completed / scheduled
```

and call it:

* Progress;
* completion rate for Goal;
* success rate.

Task 5.7 is categorical evidence.

---

# 69. No "Realization Rate"

Do not turn scheduled/intended into a Goal score.

---

# 70. Provenance

Every counted linked occurrence must retain sufficient provenance.

At minimum:

* historical user-day date;
* planning disposition;
* exact durable occurrence/source reference;
* plan batch/publication identity;
* plan published-at;
* frozen Goal record matching queried Goal;
* frozen Goal revision/title/status/policy;
* scheduled start/end where applicable;
* effective execution outcome where applicable;
* execution reference/revision where applicable.

Use current existing provenance shapes where possible.

---

# 71. Provenance for Known-Unlinked

Do not place every known-unlinked occurrence in the primary linked evidence drill-down.

However Goal-link coverage should retain enough evidence to explain incomplete/available classification.

Determine a bounded exclusion/coverage provenance representation.

---

# 72. Provenance for Legacy Unknown

Retain affected dates/references sufficient to explain:

> Goal links were not recorded for some history.

Do not fabricate Goal context.

---

# 73. Exclusions

Return explicit exclusion categories where useful:

* known unlinked;
* Goal provenance unavailable legacy;
* non-linkable occurrence;
* missing plan day;
* another governed reason.

Do not overcollect large data unnecessarily.

---

# 74. Advisories

Possible advisory semantics:

```text
Some selected history predates Goal-link tracking.
```

or:

```text
Activity counts reflect only history where this Goal's relationship was recorded.
```

Keep them derived from coverage facts.

Do not make causal claims.

---

# 75. Current Goal vs Frozen Goal Context

The result should distinguish:

```text
currentGoal
```

from:

```text
historicalGoalProvenance
```

A renamed Goal may yield:

```text
Current: "Security+ Certification"

Historical evidence:
    frozen title "Earn Security+"
```

This is valid.

---

# 76. Query Determinism

Given:

```text
Goal authority
HistoricalPlan
ExecutionHistory
policy
query
```

the result must be deterministic.

No wall-clock dependency.

---

# 77. Goal Authority Dependency

Goal authority is read only to:

* validate current Goal existence;
* provide current authored context.

It must not determine historical occurrence membership.

---

# 78. Active Independence

Do not read current Active.

Historical membership and labels come from HistoricalPlan.

---

# 79. Preview Independence

Do not read Preview.

---

# 80. Profile Independence

Do not read Profiles.

---

# 81. PlanDecision Independence

Do not read PlanDecision.

HistoricalPlan already contains frozen planning disposition.

---

# 82. Current Goal Link Independence

Do not call current Goal link queries to determine past occurrence membership.

Mandatory regression.

---

# 83. ExecutionHistory Dependency

Use only for linked scheduled occurrence outcomes/reporting evidence.

Planning distribution must remain computable independently if ExecutionHistory is unavailable/protected.

---

# 84. Protected ExecutionHistory

If HistoricalPlan + Goal authority are readable but ExecutionHistory is protected:

return:

* planning Goal Activity if valid;
* execution outcome/reporting portion unavailable/protected.

Do not suppress the plan-only evidence unnecessarily.

---

# 85. Protected HistoricalPlan

Goal Activity unavailable.

No historical membership can be established.

---

# 86. Protected Goal Authority

Goal Activity unavailable because current queried Goal cannot be validated.

Do not infer current Goal from history.

---

# 87. Missing Current Goal After Full Clear

Query returns goal unavailable/not found.

No orphan historical Goal query through this application API unless a future historical-only feature explicitly supports it.

---

# 88. Backup Boundary

No Goal Activity output enters Backup V4.

It is derived.

---

# 89. Restore Boundary

Restore authority, then re-run query.

Same authority/query/policy must reproduce same semantic Goal Activity result.

---

# 90. Full Clear Boundary

No Goal Activity clear participant.

After clear, query naturally returns Goal not found/unavailable history according to authority state.

---

# 91. Persistence Boundary

Do not cache Goal Activity in:

* localStorage;
* IndexedDB;
* Goal authority;
* HistoricalPlan;
* ExecutionHistory.

---

# 92. Policy Versioning

Policy identity/version must appear in result/provenance.

Future policy changes must not silently redefine a stored result because no result is stored.

---

# 93. Goal Measurement Policy Independence

Current/frozen measurement policy references are descriptive provenance only.

Goal Activity V1 classification must not depend on a measurement policy.

---

# 94. Goal Lifecycle Independence

Current active/completed/archived status does not alter historical distributions.

Return status as context.

---

# 95. Target-Date Independence

Target date does not alter eligibility/distribution.

---

# 96. Ordering

Define deterministic provenance ordering.

Preferred:

1. user-day date;
2. scheduled start where present;
3. exact serialized durable reference;
4. stable fallback for non-scheduled dispositions.

Reuse existing Historical Intelligence ordering if possible.

---

# 97. Clone Isolation

Inputs and outputs must be structurally isolated.

Mutation of returned:

* Goal context;
* coverage;
* distributions;
* provenance

must not mutate source authority or another result.

---

# 98. Performance

Expected complexity should remain approximately:

```text
O(n)
```

for evidence classification plus:

```text
O(n log n)
```

for deterministic provenance ordering.

Do not introduce per-occurrence store queries.

---

# 99. Application Query Boundary

Expose one canonical store/application query.

Conceptually:

```text
queryGoalActivity(...)
```

It should:

* validate current Goal authority state;
* gather required historical authorities;
* delegate classification to pure core;
* return one semantic result.

Do not put Goal Activity classification in the store itself.

---

# 100. Async Contract

If HistoricalPlan/ExecutionHistory queries are asynchronous, preserve canonical async application boundary.

Avoid UI-specific concerns.

---

# 101. No Summary Integration

Do not add a Goal Activity section to Summary.

Task 5.8 should audit/explain/integrate after projection semantics are proven.

---

# 102. No Planner Integration

Do not show Goal Activity in Planner.

---

# 103. No New Goal UI

No changes to GoalSection except if compilation requires type adaptation—which should trigger scrutiny.

---

# 104. No Recommendation Readiness Shortcut

Do not create recommendation candidates from Goal Activity yet.

---

# 105. Goal Activity Policy Rules

Policy V1 must explicitly define at least:

1. range semantics;
2. cutoff semantics;
3. effective plan publication selection;
4. occurrence eligibility;
5. Goal membership;
6. Goal-link coverage;
7. planning-state classification;
8. scheduled outcome classification;
9. reporting coverage;
10. multi-Goal independence;
11. legacy handling;
12. protection behavior;
13. zero/not-applicable semantics;
14. provenance requirements.

---

# 106. Planning Conservation Invariant

For linked known evidence:

```text
linkedIntendedOccurrenceCount
=
scheduledCount
+ unplacedCount
+ omittedCount
+ blockedCount
```

Mandatory property test.

---

# 107. Execution Conservation Invariant

For linked scheduled occurrences:

```text
linkedScheduledOccurrenceCount
=
completedCount
+ partialCount
+ skippedCount
+ unknownCount
+ notReportedCount
```

Mandatory property test.

---

# 108. Known Zero Semantics

If:

* complete plan coverage;
* complete applicable Goal-link coverage;
* zero linked occurrences;

return known zero/no linked activity.

Do not return unavailable.

---

# 109. Zero Scheduled Linked Occurrences

If Goal has linked intended occurrences but none are scheduled:

planning distribution remains available.

Execution outcome distribution is `notApplicable`.

Do not report 0% reporting.

---

# 110. Zero Reports

If linked scheduled occurrences exist but none are reported:

execution categories should classify according to existing not-reported semantics.

Reporting coverage reflects lack of reports.

---

# 111. Incomplete Plan Coverage

Return counts from known effective days only.

Disclose missing dates.

Do not extrapolate.

---

# 112. Incomplete Goal-Link Coverage

Return known linked counts from Goal-aware evidence only.

Disclose unavailable legacy Goal-link evidence.

Do not treat unknown membership as unlinked.

---

# 113. Incomplete Reporting Coverage

Return current governed categories including not-reported.

Disclose reporting limitation separately.

---

# 114. Entirely Missing Plan Window

Goal Activity unavailable due to absent plan authority for range.

---

# 115. Entirely Legacy Goal-Link Window

Plan history may exist but Goal Activity membership is unavailable.

Return Goal-link-unavailable result, not zero.

---

# 116. Mixed Legacy/Goal-Aware Window

Return partial Goal-link coverage with known linked counts.

This is a core golden fixture.

---

# 117. Goal-Aware Known-Unlinked Window

Return complete Goal-link coverage and known zero linked occurrences.

Core golden fixture.

---

# 118. Linked Planning-Only Window

Linked occurrences exist but ExecutionHistory protected/unavailable.

Return planning activity plus unavailable execution section.

---

# 119. Corrections

Execution correction changes effective scheduled outcome in Goal Activity.

Planning distribution remains unchanged.

---

# 120. Retraction

Execution retraction yields governed unknown classification.

Do not remove planned evidence.

---

# 121. Republication

Result changes only when query cutoff crosses a newer effective publication.

Mandatory test.

---

# 122. Goal Link Added Later

Historical earlier publications remain unlinked/unknown according to frozen evidence.

Later publication may become linked.

---

# 123. Goal Link Removed Later

Historical linked publication remains linked at earlier cutoff.

Later publication may become known unlinked.

---

# 124. Current Goal Rename

Must not alter historical membership or frozen title.

Current heading/context may change.

---

# 125. Current Goal Lifecycle Change

Must not alter linked distributions.

---

# 126. Current Goal Target Change

Must not alter linked distributions.

---

# 127. Current Goal Measurement Policy Change

Must not alter categorical Goal Activity.

---

# 128. Multi-Goal Test

One occurrence frozen to Goal A + Goal B.

Query A:

* occurrence included.

Query B:

* occurrence included.

No shared-state mutation.

No allocation split.

---

# 129. Current Link Independence Test

After historical publication:

1. unlink current commitment from Goal;
2. do not republish;
3. query same cutoff.

Result unchanged.

Mandatory.

---

# 130. Current Active Independence Test

Modify/replace current Active without changing historical authority.

Goal Activity result unchanged except current Goal context if Goal itself changes.

---

# 131. Input Ordering Invariance

Reordering source authority records should not change semantic result.

---

# 132. Authority Roundtrip

HistoricalPlan/ExecutionHistory/Goal Backup/restore roundtrip should reproduce same Goal Activity result for same query.

No projection output in Backup.

---

# 133. Full Clear Invariant

After clear, Goal query cannot produce previous Activity.

No cached result survives.

---

# 134. Golden Fixtures

Create fixtures for at least:

### A. Fully Goal-aware linked

All eligible history Goal-aware and linked.

### B. Goal-aware known zero

Complete coverage, no linked occurrences.

### C. Mixed planning states

Scheduled/unplaced/omitted/blocked linked to same Goal.

### D. Mixed execution outcomes

Completed/partial/skipped/unknown/not reported.

### E. Mixed legacy/new history

Partial Goal-link coverage.

### F. Entirely legacy

Goal-link unavailable.

### G. Missing plan days

Incomplete plan coverage.

### H. Protected ExecutionHistory

Planning available, execution unavailable.

### I. Multi-Goal occurrence

Same occurrence linked to A+B.

### J. Republication

Membership changes across cutoff.

### K. Current unlink without republication

Historical result unchanged.

---

# 135. Property Invariants

Where practical prove:

### A

Current Active changes cannot change historical Goal Activity.

### B

Current Goal links cannot change historical eligibility.

### C

Goal rename cannot change frozen historical title.

### D

Legacy unknown cannot become known unlinked.

### E

Known empty is zero linked evidence, not unavailable.

### F

Plan distribution conserves linked occurrences.

### G

Execution distribution conserves linked scheduled occurrences.

### H

Input order does not affect result.

### I

Authority roundtrip preserves result.

### J

Multi-Goal evidence is independently queryable.

### K

Correction changes outcome only.

### L

Retraction changes outcome to governed unknown only.

### M

Republication changes result only across cutoff.

---

# 136. Required Query Matrix

Produce:

| Input                 | Required? | Meaning |
| --------------------- | --------: | ------- |
| Goal ID               |           |         |
| start date            |           |         |
| end date              |           |         |
| evaluationAsOf        |           |         |
| historical policy     |           |         |
| Goal Activity policy  |           |         |
| current Goal revision |           |         |

---

# 137. Required Planning Distribution Matrix

Produce:

| State     | Included? | Meaning | Must not imply |
| --------- | --------: | ------- | -------------- |
| scheduled |           |         |                |
| unplaced  |           |         |                |
| omitted   |           |         |                |
| blocked   |           |         |                |

---

# 138. Required Execution Distribution Matrix

Produce:

| Outcome      | Included? | Meaning | Numeric weight? |
| ------------ | --------: | ------- | --------------: |
| completed    |           |         |                 |
| partial      |           |         |                 |
| skipped      |           |         |                 |
| unknown      |           |         |                 |
| not reported |           |         |                 |

---

# 139. Required Coverage Matrix

Produce:

| Condition                  | Plan coverage | Goal-link coverage | Reporting coverage | Result |
| -------------------------- | ------------- | ------------------ | ------------------ | ------ |
| all known                  |               |                    |                    |        |
| missing plan days          |               |                    |                    |        |
| mixed legacy/new           |               |                    |                    |        |
| entirely legacy            |               |                    |                    |        |
| known Goal-aware zero      |               |                    |                    |        |
| linked but no reports      |               |                    |                    |        |
| ExecutionHistory protected |               |                    |                    |        |
| HistoricalPlan protected   |               |                    |                    |        |
| Goal protected             |               |                    |                    |        |

---

# 140. Required Membership Matrix

Produce:

| Snapshot state | Query Goal present? | Membership |
| -------------- | ------------------: | ---------- |
| `goals` absent |                 n/a |            |
| `goals: []`    |                  no |            |
| `goals: [A]`   |                   A |            |
| `goals: [A]`   |                   B |            |
| `goals: [A,B]` |                   A |            |
| `goals: [A,B]` |                   B |            |

---

# 141. Required Multi-Goal Matrix

Produce:

| Historical occurrence | Goal A result | Goal B result | Cross-Goal allocation |
| --------------------- | ------------- | ------------- | --------------------- |
| linked A              |               |               |                       |
| linked B              |               |               |                       |
| linked A+B            |               |               |                       |
| known unlinked        |               |               |                       |
| legacy unknown        |               |               |                       |

---

# 142. Required Current-vs-Historical Matrix

Produce:

| Current change      | Historical membership changes? | Current Goal context changes? |
| ------------------- | -----------------------------: | ----------------------------: |
| rename              |                                |                               |
| target change       |                                |                               |
| status change       |                                |                               |
| measurement ref     |                                |                               |
| add current link    |                                |                               |
| remove current link |                                |                               |
| replace Active      |                                |                               |

---

# 143. Required Authority Matrix

Produce:

| Source           | Role in Goal Activity      | Authority? |
| ---------------- | -------------------------- | ---------: |
| Goal             | current authored context   |            |
| HistoricalPlan   | frozen membership/planning |            |
| ExecutionHistory | effective outcome evidence |            |
| Active           |                            |            |
| Preview          |                            |            |
| Profiles         |                            |            |
| PlanDecision     |                            |            |
| Goal Activity    |                            |            |

---

# 144. Required Policy Matrix

Produce:

| Concern                      | Policy owner |
| ---------------------------- | ------------ |
| historical range/cutoff      |              |
| effective publication        |              |
| plan coverage                |              |
| Goal membership              |              |
| Goal-link coverage           |              |
| planning distribution        |              |
| outcome classification       |              |
| reporting coverage           |              |
| multi-Goal semantics         |              |
| zero/not-applicable behavior |              |

---

# 145. Required Provenance Matrix

Produce:

| Field                    | Retained? | Source |
| ------------------------ | --------: | ------ |
| current Goal ID          |           |        |
| current Goal revision    |           |        |
| current title            |           |        |
| historical Goal revision |           |        |
| frozen Goal title        |           |        |
| frozen Goal status       |           |        |
| frozen measurement ref   |           |        |
| plan date                |           |        |
| planning disposition     |           |        |
| plan publication         |           |        |
| durable occurrence ref   |           |        |
| scheduled interval       |           |        |
| execution outcome        |           |        |
| execution revision/ref   |           |        |

---

# 146. Required Result-State Matrix

Produce:

| State                      | Meaning | Counts shown? |
| -------------------------- | ------- | ------------: |
| available                  |         |               |
| partial coverage           |         |               |
| unavailable                |         |               |
| not applicable             |         |               |
| Goal not found             |         |               |
| Goal protected             |         |               |
| HistoricalPlan protected   |         |               |
| ExecutionHistory protected |         |               |

---

# 147. Required Product-Boundary Matrix

Produce:

| Capability               | Task 5.7 |
| ------------------------ | -------- |
| Goal Activity policy     |          |
| Goal Activity projection |          |
| current Goal context     |          |
| planning distribution    |          |
| execution distribution   |          |
| plan coverage            |          |
| Goal-link coverage       |          |
| reporting coverage       |          |
| provenance               |          |
| Summary UI               |          |
| Planner UI               |          |
| Progress percentage      |          |
| measurable Progress      |          |
| Recommendations          |          |
| adaptation               |          |
| persistence              |          |
| Backup output            |          |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited.

---

# 148. Required Epistemic Matrix

Produce:

| Evidence                  | DayFrame may say | Must not say |
| ------------------------- | ---------------- | ------------ |
| linked scheduled          |                  |              |
| linked completed          |                  |              |
| linked partial            |                  |              |
| linked skipped            |                  |              |
| linked unknown            |                  |              |
| linked not reported       |                  |              |
| linked unplaced           |                  |              |
| linked omitted            |                  |              |
| linked blocked            |                  |              |
| Goal-aware no links       |                  |              |
| legacy provenance missing |                  |              |
| plan day missing          |                  |              |
| completed Goal            |                  |              |
| target passed             |                  |              |

---

# 149. Required Architectural Invariant Assessment

Classify at least:

1. Goal Activity is derived.
2. Goal Activity is non-authoritative.
3. Goal Activity is non-persisted.
4. Goal Activity has explicit policy/version.
5. Goal Activity query uses explicit date range.
6. Goal Activity query uses explicit evaluation cutoff.
7. queried Goal comes from Goal authority.
8. historical membership comes only from HistoricalPlan.
9. current Goal links never determine historical membership.
10. current Active never determines historical membership.
11. Preview is not consulted.
12. Profiles are not consulted.
13. PlanDecision is not consulted.
14. Goal rename does not relabel frozen provenance.
15. Goal unlink does not remove historical membership.
16. Goal recreation remains distinct.
17. all frozen revisions of same Goal ID remain eligible.
18. Goal-aware empty means known unlinked.
19. Goal-aware non-empty excludes missing Goal as known unlinked.
20. absent Goal provenance means unknown legacy.
21. unknown legacy is never counted as unlinked.
22. missing plan day remains separate from Goal-link unknown.
23. plan coverage is independent.
24. Goal-link coverage is independent.
25. reporting coverage is independent.
26. no combined coverage score exists.
27. linked planning occurrences classify exactly once.
28. planning conservation holds.
29. scheduled linked occurrences classify execution exactly once.
30. execution conservation holds.
31. completed outcome does not imply Goal completion.
32. partial has no numeric weight.
33. skipped does not imply Goal failure.
34. unknown remains uncertainty.
35. not reported remains reporting uncertainty.
36. unplaced does not imply failure.
37. omitted does not imply abandonment.
38. blocked does not imply incapacity.
39. multi-Goal occurrences may appear independently in each Goal query.
40. no cross-Goal conservation claim exists.
41. no duration splitting exists.
42. target date does not affect classification.
43. current lifecycle does not affect classification.
44. measurement policy reference does not affect classification.
45. completed/archived Goals remain queryable.
46. known zero differs from unavailable.
47. no linked scheduled occurrences makes execution section not applicable.
48. entirely legacy Goal-link history does not return zero.
49. mixed legacy/new returns known counts with limitation.
50. protected ExecutionHistory does not erase valid planning evidence.
51. protected HistoricalPlan blocks historical Goal Activity.
52. protected Goal authority blocks Goal query.
53. correction updates outcome only.
54. retraction yields governed unknown only.
55. republication is cutoff-governed.
56. current-link changes without republication do not change result.
57. result provenance is deterministic.
58. output is clone-isolated.
59. input ordering does not change semantic result.
60. authority roundtrip reproduces result.
61. Backup contains no Goal Activity output.
62. restore re-derives Goal Activity.
63. full clear needs no Goal Activity participant.
64. no Summary UI is introduced.
65. no Planner UI is introduced.
66. no Progress percentage is introduced.
67. no Goal score is introduced.
68. no “on track” semantics exist.
69. no recommendation is introduced.
70. no adaptation is introduced.
71. no Capacity inference exists.
72. no machine learning exists.
73. no HistoricalPlan schema change is introduced.
74. no ExecutionHistory schema change is introduced.
75. no Goal schema change is introduced.
76. existing Scheduling Realization remains unchanged.
77. existing Scheduled Outcomes remains unchanged.
78. canonical validation is green.
79. no unresolved stop condition remains.

Use:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Stop-condition violation.

---

# 150. Stop Conditions

Stop and report if:

* Goal-aware empty and legacy unknown cannot be distinguished from current HistoricalPlan data;
* Goal membership requires current Goal links;
* historical Goal membership cannot be filtered by durable Goal ID;
* Goal Activity requires Goal revision equality;
* effective HistoricalPlan publication cannot be selected deterministically;
* linked scheduled occurrences cannot be correlated safely with ExecutionHistory;
* plan-only evidence cannot remain usable when ExecutionHistory is protected;
* Goal-link coverage cannot be kept separate from plan/reporting coverage;
* one occurrence linked to multiple Goals requires invented allocation to proceed;
* execution categories require numeric weighting;
* a universal Goal denominator is required;
* Goal Activity must become persistent authority;
* HistoricalPlan/ExecutionHistory/Goal schema changes are required;
* Summary UI is necessary to validate the projection;
* measurable Progress semantics are necessary for categorical Goal Activity.

Do not broaden Task 5.7 to work around a blocker.

---

# 151. Likely Files

Likely areas:

```text
core/historicalIntelligence/
state/query adapter
Goal Activity tests
historical coverage utilities
fixtures
governance
```

Avoid UI files.

---

# 152. Test Strategy

Use layered tests.

### Policy/validation

* policy identity;
* query validation;
* range/cutoff.

### Membership

* linked;
* known unlinked;
* legacy unknown;
* multi-Goal.

### Planning distribution

* all four states;
* conservation.

### Execution distribution

* all five states;
* correction/retraction;
* conservation.

### Coverage

* plan;
* Goal-link;
* reporting;
* mixed combinations.

### Protection

* Goal;
* HistoricalPlan;
* ExecutionHistory.

### Determinism

* ordering;
* clone isolation;
* current-state independence;
* republication cutoff.

---

# 153. Focused Validation

Run focused:

* Goal Activity projection tests;
* historical coverage tests;
* HistoricalPlan effective-publication tests;
* ExecutionHistory correlation tests;
* store/application query tests.

Record exact files/tests.

---

# 154. Full Validation

Before completion run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Record:

* test file count;
* test count;
* build module count;
* bundle advisory;
* diff result.

---

# 155. Manual Validation

No UI is added.

No browser walkthrough required.

State that validation is automated/core-level only.

---

# 156. Governance

On success update minimally:

* Task 5.7 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`;
* `DECISIONS.md` only if Goal Activity policy introduces an enduring new decision.

Do not claim Progress implemented.

---

# 157. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.7_GOAL_ACTIVITY_V1_POLICY_AND_PURE_PROJECTION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.5/5.6 Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Module Placement
7. Projection Identity
8. Policy Identity
9. HistoricalMetricPolicy Relationship
10. Query Contract
11. Goal Existence
12. Current Goal Context
13. Historical Range
14. Evaluation Cutoff
15. Effective Publication Selection
16. Plan Coverage
17. Goal-Link Coverage
18. Goal-Link Coverage Window Semantics
19. Eligible Occurrence Kinds
20. Goal Membership
21. Goal Revision Semantics
22. Frozen Goal Provenance
23. Planning Distribution
24. Planning Denominator
25. Known-Unlinked Behavior
26. Legacy-Unknown Behavior
27. Execution Eligibility
28. Execution Distribution
29. Reporting Coverage
30. Three-Coverage Model
31. Legacy History
32. Entirely Legacy Range
33. Known Goal-Aware Zero
34. Published-Empty/Zero-Demand State
35. Cold Start
36. Multi-Goal Semantics
37. Cross-Goal Allocation Boundary
38. Duration Evidence
39. Result Contract
40. Result Status
41. Provenance
42. Coverage/Exclusion Provenance
43. Current-vs-Frozen Goal Context
44. Determinism
45. Authority Dependencies
46. Protected Goal
47. Protected HistoricalPlan
48. Protected ExecutionHistory
49. Backup/Restore/Clear Boundary
50. Persistence Boundary
51. Policy Versioning
52. Goal Measurement Policy Boundary
53. Goal Lifecycle/Target Boundary
54. Ordering
55. Clone Isolation
56. Performance
57. Application Query Boundary
58. No-UI Boundary
59. Tests Added/Changed
60. Golden Fixtures
61. Property Invariants
62. Focused Validation
63. Full Validation
64. Manual Validation
65. Governance Updates
66. Deviations
67. Discoveries
68. Deferred Work
69. Query Matrix
70. Planning Distribution Matrix
71. Execution Distribution Matrix
72. Coverage Matrix
73. Membership Matrix
74. Multi-Goal Matrix
75. Current-vs-Historical Matrix
76. Authority Matrix
77. Policy Matrix
78. Provenance Matrix
79. Result-State Matrix
80. Product-Boundary Matrix
81. Epistemic Matrix
82. Architectural Invariant Assessment
83. Stop-Condition Assessment
84. Architectural Alignment Assessment
85. Recommended Next Task
86. Final Completion Determination

---

# 158. Completion Criteria

Task 5.7 is complete only when:

* Goal Activity V1 exists as a pure derived projection with explicit policy/version;
* it answers only historical Goal-linked planning/reporting activity and evidence coverage;
* query requires one durable Goal ID, explicit historical range, and explicit evaluation cutoff;
* current Goal authority provides only current Goal existence/context;
* current Goal links never determine historical membership;
* HistoricalPlan frozen Goal provenance is the sole authority for historical Goal membership;
* Goal-aware empty, Goal-aware linked, and legacy provenance-unavailable states are mechanically distinguished;
* effective HistoricalPlan publication selection is canonical and cutoff-governed;
* existing plan coverage semantics are reused without modification;
* a separate Goal-link coverage model is implemented;
* reporting coverage remains separately modeled;
* no combined coverage score exists;
* known Goal-aware unlinked occurrences are excluded from Goal-linked distributions without being treated as unknown;
* legacy provenance-unavailable occurrences are excluded from Goal-linked distributions and disclosed as unknown coverage;
* missing plan days remain distinct from legacy Goal-link unknown;
* historically linked occurrences classify exactly once as scheduled/unplaced/omitted/blocked;
* planning distribution conserves the linked intended-occurrence denominator;
* only linked scheduled occurrences enter ExecutionHistory outcome classification;
* execution outcomes remain completed/partial/skipped/unknown/not-reported according to existing semantics;
* execution distribution conserves the linked scheduled-occurrence denominator;
* partial receives no numeric weight;
* completed outcome does not mean Goal completed;
* skipped does not mean Goal failure;
* not reported remains uncertainty;
* unplaced/omitted/blocked retain Phase 4 epistemic meanings;
* Goal Activity supports mixed known/unknown history without extrapolation;
* an entirely Goal-provenance-unavailable window returns unavailable rather than zero;
* complete Goal-aware coverage with zero linked occurrences returns known no-linked-activity;
* published-empty windows remain known zero/no-demand rather than missing;
* execution output becomes not-applicable when no linked scheduled occurrences exist;
* protected ExecutionHistory may suppress only execution interpretation while valid plan-only Goal Activity remains available;
* protected HistoricalPlan blocks historical Goal Activity;
* protected Goal authority blocks current Goal query;
* one occurrence may independently evidence multiple Goals;
* no cross-Goal duration allocation or conservation claim exists;
* current Goal rename/status/target/policy/link changes do not rewrite historical membership or frozen context;
* current Active changes do not change historical Goal Activity;
* current Preview, Profiles, and PlanDecision are not consulted;
* republication changes output only when evaluation cutoff crosses the newer effective publication;
* execution correction updates the governed outcome only;
* execution retraction yields governed unknown classification;
* result includes deterministic provenance sufficient to explain every included count and every coverage limitation;
* current Goal context is clearly distinguished from frozen historical Goal context;
* result is deterministic and clone-isolated;
* ordering is canonical;
* authority roundtrip reproduces semantic output;
* Goal Activity is not persisted;
* Backup V4 contains only underlying authorities;
* restore re-derives Goal Activity;
* full clear requires no Goal Activity participant;
* no Summary or Planner UI is introduced;
* no Progress percentage, Goal score, pace, “on track” state, measurable Progress, Recommendation, RecommendationDecision, adaptation, Capacity inference, cross-Goal allocation, or machine-learning behavior is introduced;
* no Goal, HistoricalPlan, or ExecutionHistory schema change is introduced;
* existing Scheduling Realization and Scheduled Outcomes remain unchanged peer projections;
* focused tests pass;
* canonical lint, typecheck, full tests, build, and `git diff --check` pass;
* governance records Goal Activity as implemented derived intelligence while Progress and Recommendations remain deferred;
* no unresolved stop condition remains.

---

# 159. Recommended Next Task

If Task 5.7 completes successfully:

> **Task 5.8 — Goal Activity Explanation, Drill-Down, and Summary Integration Audit**

This should first audit:

* how Goal Activity fits the existing Summary information architecture;
* how three independent coverage dimensions should be explained;
* how current Goal context should differ visually from frozen historical Goal labels;
* how active/completed/archived Goals should be browsed;
* how cold-start, legacy, incomplete, and protected states should read;
* whether Planner should offer a read-only handoff to Goal Activity;
* accessibility and mobile implications.

If the audit finds the projection semantics straightforward, it may recommend a bounded Summary integration implementation task afterward.

Do not begin measurable Progress or Recommendations yet.

---

# 160. Final Implementation Principle

> **Goal Activity should tell the user what DayFrame actually knows about work that supported a Goal—and be equally clear about what DayFrame does not know.**

---

# 161. Final Completion Statement

**Task 5.7 is complete when DayFrame implements Goal Activity V1 as a deterministic, policy-versioned, non-authoritative, non-persisted historical projection that evaluates one current Goal over an explicit date range and evaluation cutoff using current Goal authority only for present authored context, HistoricalPlan frozen Goal provenance as the sole authority for historical Goal membership and planning disposition, and ExecutionHistory only for effective outcomes of historically linked scheduled occurrences; when Goal-aware linked, Goal-aware known-unlinked, legacy Goal-provenance-unavailable, missing-plan, published-empty, reported, not-reported, corrected, retracted, protected, and cold-start evidence states remain mechanically and epistemically distinct; when historically linked intended occurrences conserve exactly across scheduled, unplaced, omitted, and blocked planning categories and historically linked scheduled occurrences conserve exactly across completed, partial, skipped, unknown, and not-reported execution categories without arbitrary weighting, percentage scoring, or Goal-completion inference; when plan coverage, Goal-link coverage, and reporting coverage remain three separate governed evidence dimensions with known counts, missing/unavailable evidence, and limitations disclosed independently rather than collapsed into one score; when known Goal-aware zero linked activity is distinguishable from entirely legacy unknown Goal-link history; when mixed legacy/new history returns only known linked evidence without extrapolation; when one occurrence may contribute independently to multiple Goal-specific queries without invented duration allocation or cross-Goal conservation; when current Goal edits, current links, current Active, Preview, Profiles, and PlanDecision cannot rewrite historical eligibility; when current Goal context and frozen Goal title/revision/status/policy provenance remain separately visible in the result contract; when republication, correction, and retraction change the result only through their already-governed effective historical selection rules; when protected ExecutionHistory can suppress only execution interpretation while independently valid planning Goal Activity remains available, and protected Goal or HistoricalPlan authority suppresses unsupported interpretation; when every count and coverage limitation retains deterministic provenance, ordering and clone isolation are guaranteed, authority roundtrip reproduces the same semantic result, and Goal Activity adds no persistence, Backup field, restore participant, or clear participant; when existing Scheduling Realization and Scheduled Outcomes remain independent peer projections; when no Summary UI, Planner UI, Progress percentage, Goal score, measurable Progress policy, Recommendation, RecommendationDecision, adaptive mutation, Capacity inference, global Goal allocation, hidden optimization objective, or machine-learning behavior is introduced; when focused and canonical validation are green; when governance records Goal Activity truthfully while preserving Progress and Recommendations as deferred future semantics; and when no unresolved evidence, coverage, identity, correlation, protection, determinism, or authority stop condition remains.**
