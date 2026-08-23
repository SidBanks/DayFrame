# Task 3.7 — Audit and Define Progress, Completion, and Adherence Derivation Semantics

## Status

Ready for investigation and architectural specification.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Architecture-first audit, metric-semantics definition, derivation-boundary specification, and publication task.

Task 3.7 defines what DayFrame may truthfully derive from `ExecutionHistory V1` before any Progress, adherence, completion-rate, or Summary implementation begins.

This task includes:

* repository-wide audit of progress/adherence-like semantics;
* distinction between outcome evidence and derived metrics;
* definition of completion semantics;
* definition of partial semantics;
* definition of skipped semantics;
* definition of unknown/not-reported semantics;
* denominator policy;
* scheduled/unplaced/omitted/blocked treatment;
* planned versus unplanned execution treatment;
* timing/adherence semantics;
* source/category aggregation;
* uncertainty propagation;
* goal-progress boundary;
* future Summary semantics;
* future recommendation/learning boundary;
* privacy/retention implications;
* implementation-readiness determination.

It does **not** implement:

* Progress UI;
* adherence scores;
* completion percentages;
* streaks;
* goal tracking;
* learning;
* schedule adaptation;
* recommendation changes;
* new persistence;
* Backup V3;
* ExecutionRecord schema changes.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before investigation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 3.1–3.6 are complete and accepted;
6. review:

   * `CHECKPOINT_Phase_3_Execution_History_Semantics.md`;
   * `ExecutionRecord V1`;
   * `ExecutionHistory V1`;
   * Task 3.5 reporting semantics;
   * Task 3.6 history/correction semantics;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.7_AUDIT_AND_DEFINE_PROGRESS_COMPLETION_AND_ADHERENCE_DERIVATION_SEMANTICS_RESULT.md`

If the repository already contains contradictory authoritative progress/adherence behavior, stop and identify the narrowest prerequisite before defining implementation policy.

---

# 2. Purpose

DayFrame now has trustworthy historical evidence:

```text id="q4s21v"
planned occurrence
    ↓
explicit user report
    ↓
ExecutionHistory
    ↓
current outcome:
    completed
    partial
    skipped
    not reported
```

What it does **not** yet have is a governed interpretation layer.

For example:

```text id="yq4bzd"
Planned this week:
5 occurrences

Reported:
3 completed
1 partial
1 not reported
```

DayFrame must not jump immediately to:

> “60% success”

without first defining:

* what the denominator means;
* whether Partial counts;
* whether Not reported is failure;
* whether omitted occurrences belong;
* whether unplaced occurrences belong;
* whether timing matters;
* whether goals exist independently from schedule commitments.

Task 3.7 defines those semantics.

---

# 3. Governing Epistemic Principle

The core rule is:

> **Derived metrics must never claim more certainty than the underlying execution evidence supports.**

Therefore:

> **Not reported is uncertainty, not failure.**

And:

> **A planning state is not an execution outcome.**

And:

> **A metric denominator is an architectural claim about what the user was expected to do; it cannot be chosen casually.**

---

# 4. Architectural Objective

At completion, DayFrame should have a defensible derivation model:

```text id="hhnidj"
ExecutionHistory authority
        +
planned occurrence context
        ↓
derived occurrence assessment
        ↓
aggregate progress/adherence view
        ↓
Summary / recommendation / learning
```

with all uncertainty preserved explicitly.

---

# 5. Required Initial Repository Audit

Search production code, tests, docs, fixtures, roadmap, and UI for:

* progress;
* completion rate;
* completion percentage;
* adherence;
* compliance;
* success rate;
* failure rate;
* streak;
* consistency;
* goal progress;
* weekly progress;
* planned vs completed;
* achieved;
* missed;
* skipped;
* allocation progress;
* done count;
* completion count.

Classify every hit as:

* Confirmed current behavior;
* Placeholder;
* UI-only label;
* Derived display;
* Planned future concept;
* Dead/disconnected path;
* Ambiguous.

Do not infer semantics from names alone.

---

# 6. Existing Summary/Progress Concepts

Audit the preferred future Summary model and any current Summary UI.

Determine whether current placeholders already assume:

* percentages;
* binary completion;
* goal progress;
* capacity progress;
* weekly adherence.

Do not preserve assumptions automatically.

---

# 7. Outcome Evidence Baseline

Task 3.7 must treat these as the only V1 execution outcomes:

* Completed
* Partial
* Skipped
* Not reported

No Missed.

No Failed.

No Success.

---

# 8. Outcome Versus Assessment

Define the distinction:

```text id="p0nkpt"
Execution outcome
    = user-reported historical fact

Derived assessment
    = DayFrame interpretation for a specific metric
```

Example:

```text id="ca48ev"
Outcome:
Partial

Possible completion assessment:
0.5 credit
or
incomplete
or
separate category
```

The audit must choose deliberately.

---

# 9. Completion Definition

Task 3.7 must define what “completion” means in derived metrics.

Possible models:

## A. Binary

Completed = complete
Partial = incomplete
Skipped = incomplete
Not reported = unknown

## B. Weighted

Completed = 1
Partial = configurable/fixed fraction
Skipped = 0
Not reported = excluded/unknown

## C. Categorical

No single scalar completion score; report counts separately.

Compare rigorously.

---

# 10. Recommended Default Bias

Prefer categorical truth over premature scalar scoring.

A safe V1 may say:

```text id="u28pde"
Completed: 3
Partial: 1
Skipped: 1
Not reported: 2
```

before it says:

> 62% complete.

Evaluate this explicitly.

---

# 11. Partial Semantics

Define whether Partial:

* contributes zero completion credit;
* contributes fractional credit;
* remains separate only;
* depends on actual duration/planned duration;
* depends on future source-specific metrics.

Task 3.1 rejected generic percentage completion.

Do not reintroduce it indirectly without evidence.

---

# 12. Partial Duration Ratio

Consider:

```text id="jwli1i"
planned duration = 60 min
reported duration = 30 min
```

Does DayFrame derive 50% completion?

Likely concern:

> No. Duration is not necessarily equivalent to task completion.

Define policy.

---

# 13. Skipped Semantics

Execution `skipped` means:

> user explicitly reports choosing not to perform the planned occurrence.

Determine whether that counts as:

* zero completion;
* explicit non-completion;
* separate intentional skip;
* denominator inclusion.

Likely:

> separate from unknown, and potentially denominator-included for adherence.

But define carefully.

---

# 14. Not Reported Semantics

This is mandatory:

> Not reported remains unknown.

Determine whether it:

* is excluded from completion denominator;
* remains visible as “unknown” count;
* prevents a definitive adherence percentage;
* can be included only in a “reporting coverage” metric.

Do not silently treat it as zero.

---

# 15. Reporting Coverage

Strongly consider a separate metric:

```text id="eqs458"
reporting coverage
=
reported planned subjects
/
eligible planned subjects
```

This answers:

> “How much of the period has enough evidence to assess?”

without pretending unreported outcomes are failures.

---

# 16. Completion Rate Versus Reporting Coverage

If both exist:

```text id="fybylk"
Completion rate
    calculated only over reported eligible outcomes

Reporting coverage
    shows how complete the evidence is
```

Evaluate whether that is truthful and useful.

---

# 17. Denominator Problem

The most important metric question:

> Which occurrences belong in the denominator?

Audit:

* scheduled;
* unplaced;
* omitted;
* blocked;
* work;
* manual;
* unplanned;
* stale/no-longer-current occurrences.

---

# 18. Scheduled Occurrence Denominator

Likely eligible if:

* occurrence existed in the relevant historical plan;
* execution outcome or reportability exists.

But do not assume all categories should count toward one generic metric.

---

# 19. Unplaced Occurrence Denominator

An unplaced occurrence still represented intended activity.

Should it count as an expectation?

Potential policies:

## A. Yes — it was part of planned demand.

## B. No — DayFrame failed to allocate time, so holding the user accountable is inappropriate.

This is a major fairness/meaning decision.

Audit.

---

# 20. Recommended Unplaced Bias

Strongly consider:

> Unplaced occurrences should not count against execution adherence because DayFrame did not produce an actionable scheduled commitment.

But they may count in:

* planning-capacity diagnostics;
* demand fulfillment metrics.

Separate metrics may be needed.

---

# 21. Omitted Occurrence Denominator

An accepted omission means the user explicitly chose not to include the occurrence in the plan.

Should it count against adherence?

Likely:

> No.

Because the current plan no longer expected execution.

But historical reporting may still show Complete/Partial/Skipped.

Define.

---

# 22. Blocked Occurrence Denominator

A blocked accepted placement means the user intended a hard placement that DayFrame could not realize.

Should it count against adherence?

Potential concern:

> Penalizing the user for an impossible plan is misleading.

Strongly consider excluding blocked occurrences from execution-adherence denominator while counting them in planning-friction diagnostics.

---

# 23. Work Occurrence Denominator

Work may represent non-negotiable commitment rather than user goal.

Determine whether work belongs in generic progress/adherence at all.

Possible:

* included in execution-history counts;
* excluded from personal-progress metrics;
* separate category.

---

# 24. Manual Event Denominator

Manual events vary widely:

* appointment;
* social event;
* deadline;
* one-off task.

A generic completion metric may not make semantic sense.

Determine whether manual events participate by default.

---

# 25. Template Occurrence Denominator

Templates are most likely to support repeatable progress/adherence metrics.

Audit category differences.

---

# 26. Unplanned Execution

Unplanned execution has no prior expected occurrence.

Therefore it cannot belong in an adherence denominator.

But it may count toward:

* activity totals;
* goal progress;
* category effort.

Define.

---

# 27. Generic Progress Versus Adherence

Separate these concepts.

## Progress

“How much outcome/evidence accumulates toward some goal or objective?”

## Adherence

“How closely did reported execution align with the plan?”

These are not synonyms.

Task 3.7 must define both or reject one.

---

# 28. Adherence Terminology

Assess whether “adherence” is appropriate product language.

Potential alternatives:

* plan follow-through;
* plan alignment;
* schedule follow-through;
* execution alignment.

User-facing terminology may be different from internal metric name.

---

# 29. Adherence Definition Options

Possible definitions:

## A. Outcome adherence

Completed eligible planned occurrences / reported eligible planned occurrences

## B. Schedule adherence

Performed at or near planned time

## C. Plan-state adherence

Outcome matches planned inclusion/omission

These are different.

Do not collapse them.

---

# 30. Recommended Adherence Scope

Likely V1:

> adherence should mean **reported follow-through on actionable planned occurrences**, independent from timing.

Timing alignment should be a separate later metric.

Evaluate.

---

# 31. Timing Adherence

If actual occurrence time exists:

* early;
* near scheduled;
* late.

But Task 3.2 actual time is optional.

Therefore timing adherence is incomplete by design.

Determine whether V1 should defer timing adherence entirely.

Recommended:

> defer.

---

# 32. Duration Adherence

Same.

Reported duration is optional and not equivalent to completion.

Likely defer.

---

# 33. Planned Duration Versus Reported Duration

Do not infer:

> 30/60 minutes = 50% adherence

unless explicitly authorized later.

---

# 34. Completion Credit Model

Task 3.7 must produce one explicit V1 policy.

Potential recommended policy:

```text id="lxxgzs"
Completed:
counts as completed

Partial:
reported separately, no scalar completion credit in V1

Skipped:
reported separately as explicit non-completion

Not reported:
unknown, excluded from completion rate denominator
```

Evaluate and refine.

---

# 35. Reported Completion Rate

If scalar rate is allowed:

```text id="iqnszk"
completed
/
(completed + partial + skipped)
```

with Not reported excluded.

But this metric needs a label that communicates:

> among reported eligible outcomes.

Audit whether this is understandable enough.

---

# 36. Alternative: No Completion Percentage Yet

Consider deliberately deferring scalar percentages and shipping categorical counts first.

Task 3.7 should determine implementation sequence.

---

# 37. Planning Coverage

Consider another derived measure:

```text id="249u5d"
scheduled actionable occurrences
/
all intended occurrences
```

This is a **planning** metric, not execution.

Do not mix it with adherence.

---

# 38. Capacity/Planning Success

Unplaced/blocked occurrences may inform:

* planning feasibility;
* capacity;
* friction.

They should not necessarily reduce execution adherence.

This distinction should be formal.

---

# 39. Occurrence Eligibility Function

Recommend a pure future derivation:

```ts id="qym44z"
classifyProgressEligibility(snapshot)
```

Possible classifications:

* actionablePlanned;
* planningExcluded;
* unplanned;
* unsupportedForGenericMetric.

Do not implement unless Task 3.7 is explicitly allowed to add pure investigation helpers.

Prefer specification only.

---

# 40. Historical Snapshot Authority

Eligibility must use frozen historical snapshot.

Do not determine denominator using current source state.

---

# 41. Source Deletion

Historical metrics must remain stable after source deletion.

No current-source lookup.

---

# 42. Source Recreation

No retarget.

---

# 43. Snapshot Corrections

Task 3.6 deferred snapshot correction.

Therefore metrics depend on the frozen snapshot currently stored.

Document consequence.

---

# 44. Corrections And Metrics

Execution correction changes current derived metrics.

Prior revisions remain historical evidence but current metrics use current projection.

---

# 45. Retraction And Metrics

Retraction means current outcome becomes Not reported.

Therefore:

* reporting coverage decreases;
* completion/adherence evidence becomes unknown.

Do not treat retraction as skipped.

---

# 46. Re-Report And Metrics

Restores reported evidence.

---

# 47. Historical Metric Reproducibility

Ask:

> Should a metric for last month change if the user corrects last month’s report today?

Likely:

> yes, because current historical authority was corrected.

Unless later audit-log analytics intentionally preserve previous published metrics.

Define.

---

# 48. Immutable Evidence Versus Mutable Interpretation

Prior revisions remain immutable, but current aggregate metrics should reflect the current projected truth.

This is likely the right V1 model.

---

# 49. Period Boundaries

Define aggregation periods:

* user day;
* user week;
* calendar month;
* arbitrary date range.

User-day semantics are important.

---

# 50. Historical User-Day Boundary

Metrics must use frozen historical user-day context.

A later boundary preference change must not move old execution between days/weeks.

---

# 51. User Week

For weekly progress, determine whether historical week grouping uses:

* frozen occurrence user-week;
* current week-start preference;
* occurrence snapshot user-day + historical week-start context.

Task 3.2 snapshot may not freeze week-start preference explicitly.

Audit.

---

# 52. Week Boundary Gap

If historical week start is not frozen:

determine whether V1 weekly aggregation can be performed safely using existing durable occurrence reference/week coordinate.

For N-per-week references, user-week coordinate exists.

For daily/manual/work, current semantics may differ.

Identify limitation.

---

# 53. Calendar Month

Calendar-month grouping can use frozen user-day date.

No current boundary issue.

---

# 54. Goal Progress

The preferred future Summary includes Goals and Progress.

Audit whether DayFrame currently has a formal Goal domain model.

If not:

> generic goal progress cannot yet be implemented truthfully.

Do not invent goal semantics.

---

# 55. Category Progress

Could future Progress summarize by category:

* recovery;
* work;
* optional;
* etc.

Audit whether category semantics are stable enough.

---

# 56. Template-Level Progress

Likely stronger:

> Workout: 3 completed, 1 partial, 1 skipped, 1 not reported.

This uses frozen source title/category but source lifetime may evolve.

Determine grouping key.

---

# 57. Historical Grouping Identity

Possible grouping:

* exact source incarnation;
* readable source ID;
* title;
* category.

Each has tradeoffs.

Do not group recreated source lifetimes together silently.

---

# 58. Source Lifetime Aggregation

Strongly consider:

> exact-lifetime aggregation by default.

A recreated template is a new historical subject family unless product explicitly wants continuity.

---

# 59. Cross-Lifetime Aggregation

Could later be user-defined.

Do not assume same readable ID means same goal.

---

# 60. Title Changes Within Same Lifetime

Ordinary updates preserve incarnation.

Historical snapshots may show different titles over time.

Determine whether aggregation should still group by source lifetime.

Likely yes.

Display label may need a current/latest historical title.

---

# 61. Unplanned Activity Aggregation

Unplanned subjects have no source lifetime.

They may aggregate only by:

* category;
* explicit user tag;
* separate “Unplanned” bucket.

Do not merge by title heuristically.

---

# 62. Manual Event Aggregation

Likely individual one-offs rather than repeatable progress entities.

Generic aggregate may be misleading.

---

# 63. Work Aggregation

Could measure reported work execution, but generic “progress” may not make sense.

Separate from personal goals.

---

# 64. Summary Surface Semantics

Define what future Summary may safely say.

Potential:

* Reported outcomes this week;
* Completed / Partial / Skipped / Not reported;
* Reporting coverage;
* Progress by recurring template;
* Unplanned activity count.

Avoid unsupported:

* success score;
* productivity score;
* compliance score.

---

# 65. Progress Vocabulary

Recommend user-facing vocabulary.

Possible:

* Outcomes
* Follow-through
* Progress
* Report coverage
* Completed / Partial / Skipped / Not reported

Avoid moralized labels.

---

# 66. “Completion” Vocabulary

Completed is authoritative outcome.

“Completion rate” is derived.

Make distinction explicit.

---

# 67. “Adherence” Vocabulary

Consider keeping internal only.

User-facing:

> Plan follow-through

may be clearer.

Task 3.7 must make a recommendation.

---

# 68. Partial In Aggregate

Strongly consider showing Partial separately rather than converting it into a scalar.

---

# 69. Skip In Aggregate

Show separately.

Do not hide it inside failure count.

---

# 70. Not Reported In Aggregate

Show explicitly.

This is vital for uncertainty.

---

# 71. Unknown Evidence In Percentages

If a percentage is shown, it must make denominator explicit.

Example:

> 3 of 4 reported outcomes completed

not:

> 75% complete

if 3 more planned occurrences are unreported.

Evaluate copy.

---

# 72. Confidence / Evidence Completeness

Do not add probabilistic confidence.

Reporting coverage is enough.

---

# 73. Progress And Omitted Occurrences

An omitted occurrence should generally not count as an actionable planned expectation.

But if the user reports Completed anyway, it may count toward activity progress.

This shows why Progress and Adherence must remain separate.

Define.

---

# 74. Progress And Unplaced Occurrences

Same:

* execution of unplaced activity may count toward progress;
* failure to report/perform it should not necessarily reduce adherence.

---

# 75. Progress And Blocked Occurrences

Same.

---

# 76. Progress And Unplanned Execution

May count toward progress if mapped to a future Goal/category.

But no denominator effect.

---

# 77. Plan Follow-Through Eligibility

Potential V1 eligible states:

* scheduled only.

Potential broader:

* scheduled + fixed anchored work/manual.

But generic categories complicate.

Task 3.7 must choose.

---

# 78. Recommended Follow-Through Bias

Strongly consider:

> V1 plan-follow-through should only evaluate occurrences that had an actionable scheduled interval.

This naturally excludes:

* unplaced;
* omitted;
* blocked;
* unplanned.

Then category/source-family rules can further narrow.

This is simple and fair.

---

# 79. Work/Manual In Follow-Through

Determine whether scheduled work/manual should be included.

Possible policy:

* all scheduled planned subjects;
* or only template subjects by default.

Audit product intent.

---

# 80. Template-Only V1

Consider starting Progress/Follow-through only for recurring template occurrences.

Pros:

* repeatable;
* user-configured;
* likely goal-like.

Cons:

* ignores work/manual execution history.

Task 3.7 must assess.

---

# 81. Generic Outcome Summary

Regardless of adherence eligibility, all valid history can support categorical outcome counts.

This may be the safest first implementation.

---

# 82. Progress Implementation Readiness

Task 3.7 must conclude whether next implementation should be:

## A. Generic outcome summary only

## B. Outcome summary + reporting coverage

## C. Outcome summary + completion rate

## D. Outcome summary + plan follow-through

## E. Blocked pending formal Goal semantics

Choose.

---

# 83. Goal Dependency

If “Progress” is supposed to mean progress toward user goals, a Goal domain model may be prerequisite.

Do not redefine progress merely as schedule completion if product mental model says Goals.

---

# 84. Existing Goals Architecture

Audit whether goals currently exist as:

* user priorities;
* template priorities;
* text labels;
* nonexistent.

Classify.

---

# 85. Allocation Relationship

Future Summary includes Allocations.

Determine whether execution history can compare:

* planned allocation;
* executed effort.

But reported duration is optional.

Therefore duration-based allocation progress is incomplete.

Likely defer.

---

# 86. Capacity Relationship

Capacity is planning-side.

Do not derive capacity from completion counts.

---

# 87. Recommendations Relationship

Future recommendations may use history.

Task 3.7 should define a boundary:

> derived metrics may inform recommendations, but recommendations must not reinterpret raw historical outcomes.

---

# 88. Learning Relationship

Learning should consume:

* raw execution evidence;
* stable derived features;
* explicit uncertainty.

It must not train on Not reported as negative.

This is critical.

---

# 89. No Negative Label From Unknown

Make explicit:

```text id="0wo78b"
Not reported
≠
did not complete
```

Therefore unknown data cannot be used as negative training signal.

---

# 90. Skipped As Negative Signal

Even Skipped may mean:

* user consciously deprioritized;
* context changed;
* plan was wrong.

It should not automatically become “failure” training label.

Define.

---

# 91. Partial As Signal

Likewise.

No simplistic success/failure binary.

---

# 92. Outcome Feature Layer

Recommend eventual derived features:

* completed;
* partial;
* skipped;
* unknown;
* report coverage;
* scheduled/actionable status;
* actual-time evidence present;
* duration evidence present.

No implementation.

---

# 93. Timing Learning

Defer until actual-time evidence coverage is sufficient.

---

# 94. Duration Learning

Defer until evidence is sufficient and duration semantics are activity-appropriate.

---

# 95. Selection Bias

Users may report successes more often than failures or vice versa.

Task 3.7 should acknowledge that execution history is **user-reported and potentially incomplete**.

Progress/adherence claims must account for that.

---

# 96. Reporting Bias

Strong implication:

> A completion rate over only reported outcomes should not be presented as overall performance without reporting-coverage context.

Make this architectural policy if adopted.

---

# 97. Minimum Honest Summary

Potential V1 Summary card:

```text id="8jmay5"
This week
Completed: 3
Partial: 1
Skipped: 1
Not reported: 2

Reporting coverage: 5 of 7 planned occurrences
```

No scalar “success.”

Evaluate.

---

# 98. Planned Occurrence Count Source

Where does the denominator of 7 come from?

This is difficult because historical plan snapshots only become durable on first report.

Current ExecutionHistory alone cannot know all unreported historical planned occurrences after Preview disappears.

This is a major architectural issue.

---

# 99. Unreported Denominator Problem

ExecutionHistory records subjects only after first report.

Therefore:

> Historical “Not reported” planned occurrences are not durably represented merely by absence from history.

A current Preview can identify currently unreported reportable occurrences, but past periods may lose that plan evidence.

Task 3.7 must address this directly.

---

# 100. Historical Completeness Limitation

Without durable planned-occurrence history, DayFrame cannot compute a reliable historical denominator for arbitrary past periods.

This may block historical adherence metrics.

---

# 101. Current-Window Metrics

A bounded alternative:

> current Preview period can compute reporting coverage because planned occurrences are still present.

But once that plan context disappears, historical denominator may not be reproducible.

Determine whether V1 metrics should be current-window-only.

---

# 102. Need For Plan History

Task 3.4 explicitly deferred a separate plan-history surface.

Task 3.7 must decide whether truthful historical adherence requires one.

Likely:

> yes.

This may become a prerequisite before historical adherence implementation.

---

# 103. Execution History Alone Is Insufficient For Denominator

Make this explicit if confirmed.

ExecutionHistory knows:

* reported subjects;
* their frozen historical plan context.

It does not know:

* planned subjects that were never reported.

Therefore arbitrary historical adherence cannot be reconstructed.

---

# 104. Current Preview + History Derivation

For the current fresh Preview window, DayFrame can compare:

* current reportable planned occurrences;
* ExecutionHistory subjects.

This allows current-window reporting coverage/follow-through.

But this is derived from current plan, not durable historical metric.

---

# 105. Current Preview Mutation Problem

If the plan changes after the period, recomputing past adherence from current scheduler may rewrite the denominator.

Not acceptable for historical metrics.

---

# 106. Potential PlannedOccurrenceLedger

Consider whether a future durable surface is required:

* `PlannedOccurrenceRecord`;
* `PlanSnapshot`;
* `HistoricalPlanLedger`.

Do not design fully unless needed.

Task 3.7 should determine whether such a concept is necessary.

---

# 107. Alternative: Report-Only Metrics

Avoid denominator problem by implementing only metrics over reported subjects.

Example:

> “Of reported outcomes: 3 completed, 1 partial, 1 skipped.”

This is historically reproducible from ExecutionHistory alone.

Strong candidate for first implementation.

---

# 108. Report-Only Metric Limit

It is not adherence.

It is an outcome summary.

Do not label it progress/follow-through misleadingly.

---

# 109. Current-Window Reporting Coverage

Could supplement:

> “5 of 7 current planned occurrences have reports.”

But label scope clearly:

> Current Preview reporting coverage.

Not historical trend.

---

# 110. Historical Trend Safety

Do not graph completion rate across months unless denominator semantics are durable.

---

# 111. Progress Over Time

Similarly blocked unless using report-only counts or future durable plan ledger.

---

# 112. Streaks

Definitely defer.

They require strong semantics around:

* expected cadence;
* unknown;
* omitted;
* rest periods;
* source changes.

---

# 113. Weekly Goal Example

If template recurrence says 3 times per week:

Could progress mean:

> 2 completed reports this week toward 3 intended occurrences.

But if the third occurrence has no ExecutionRecord, current Preview may reveal it.

Historical weeks after source changes may not.

This demonstrates need for scope constraints.

---

# 114. Recurrence-Based Denominator

Potentially reconstruct from authored recurrence for historical periods if source lifetime still exists.

But source mutation can change recurrence while preserving lifetime.

Therefore not historically trustworthy.

Do not use current recurrence to reconstruct old expectations.

---

# 115. PlanDecision Effects

Omissions may remove occurrences from expected plan.

Historical PlanDecision history is not retained.

Therefore recurrence alone cannot reconstruct historical denominator accurately.

Another reason historical adherence needs plan ledger.

---

# 116. Reported Snapshot Plan State

For reported subjects, we know whether that occurrence was:

* scheduled;
* unplaced;
* omitted;
* blocked.

But we do not know unreported siblings.

---

# 117. Metric Classes

Task 3.7 should distinguish at least:

## Evidence-only metrics

Can be derived from ExecutionHistory alone.

Examples:

* reported outcome counts;
* reported duration sum;
* number of reported subjects.

## Current-plan metrics

Require current fresh Preview + history.

Examples:

* current-window reporting coverage.

## Historical-plan metrics

Require durable plan ledger not yet implemented.

Examples:

* historical adherence rate.

This is a crucial architecture.

---

# 118. Evidence-Only Metric Safety

These survive:

* source deletion;
* plan changes;
* profile changes;
* backup changes.

Strong candidates for first implementation.

---

# 119. Current-Plan Metric Volatility

These should be explicitly marked current-window/current-plan derived.

Do not persist as historical truth.

---

# 120. Historical-Plan Metric Block

Do not implement until durable denominator exists.

---

# 121. Proposed `ProgressDerivationScope`

Consider conceptual scope enum:

* `reportedEvidence`;
* `currentPlanWindow`;
* `historicalPlan`.

No code required.

---

# 122. Progress Summary Candidate

Task 3.7 must propose a minimal honest first Summary surface.

Likely:

```text id="1vdrjr"
Reported outcomes
Completed: X
Partial: Y
Skipped: Z
Not reported: unavailable historically
```

But “Not reported” cannot be known from history alone.

So perhaps:

```text id="q8invc"
Reported outcomes
Completed: X
Partial: Y
Skipped: Z
```

and separately, when fresh Preview exists:

```text id="h190qc"
Current preview
Reports recorded: A of B reportable occurrences
```

Evaluate.

---

# 123. Not Reported Display Scope

“Not reported” is valid for a known subject after retraction.

But generic count of never-reported planned occurrences requires plan denominator.

Distinguish:

* retracted subject = known Not reported;
* never-reported occurrence = absent from ExecutionHistory.

Important.

---

# 124. Outcome Projection Semantics

`OccurrenceOutcome unknown` exists for a known subject with no current assertion/retraction.

But no ExecutionSubject exists for never-reported planned occurrence.

Therefore unknown subject absence cannot be enumerated from history alone.

---

# 125. Current Preview Join

For current reportable occurrences, joining by DurableOccurrenceReference can identify:

* existing reported subject;
* no subject yet.

Thus current-window Not reported is computable.

---

# 126. Historical Join Absence

Not after Preview history is gone.

---

# 127. Correction And Outcome Counts

Current report-only counts use current projection, not all revisions.

Revision counts are not activity counts.

---

# 128. Retraction In Report-Only Counts

Retracted subject should not count as Completed/Partial/Skipped.

Could count as:

* Retracted/Not reported known subject;
* or be omitted from reported-outcome totals.

Define.

Recommended:

* outcome summary counts current reported assertions only;
* separate known-retracted count only if useful.

---

# 129. Historical Record Count

Do not conflate revision count with occurrence count.

---

# 130. Actual Duration Aggregate

Can sum reported durations over current assertions where present.

But coverage is incomplete.

If implemented later, label:

> Reported duration

not total actual time.

---

# 131. Missing Duration

Do not treat as zero.

---

# 132. Average Duration

Would suffer missingness bias.

Defer unless coverage shown.

---

# 133. Partial Duration

Still just reported duration, not completion fraction.

---

# 134. Category Breakdown

Evidence-only category counts are possible because snapshots freeze category.

But category stability and meaning should be audited.

---

# 135. Source-Lifetime Breakdown

Evidence-only and stable.

Potential later feature.

---

# 136. Unplanned Counts

Can be shown separately.

---

# 137. Manual/Work Counts

Can be shown without implying goal progress.

---

# 138. Progress Toward Goals

Blocked until Goal semantics exist.

If no Goal domain currently exists, Task 3.7 must state:

> execution outcomes are not yet goal progress.

---

# 139. Goal Mapping Options

Future possibilities:

* source → goal;
* category → goal;
* explicit goal ID on source;
* execution subject → goal snapshot.

Do not design deeply.

---

# 140. Goal Historical Identity

Future goal progress will need durable goal identity/lifetime semantics.

Flag.

---

# 141. Adherence Historical Identity

Likewise requires durable plan denominator identity.

---

# 142. Learning Dataset Semantics

Future learning features must distinguish:

* reported positive;
* reported partial;
* reported skip;
* unknown/no evidence;
* planning infeasibility.

Do not collapse.

---

# 143. Planning Failure Versus Execution Failure

Important distinction:

* unplaced/blocked = planning system/constraint issue;
* skipped = user-reported execution choice;
* not reported = unknown.

Never merge into “failed.”

---

# 144. Recommendation Example

If many scheduled occurrences are skipped:

DayFrame may later suggest adjusting plan.

If many are unplaced:

DayFrame should adjust planning/capacity instead.

Different evidence.

---

# 145. Partial Recommendation Semantics

Partial may suggest duration mismatch, task sizing, or interruptions—but only cautiously.

No implementation.

---

# 146. Unknown Recommendation Semantics

Unknown should trigger:

* perhaps better reporting UX;

not:

* schedule punishment.

---

# 147. Reporting Coverage As Learning Input

Potentially useful to determine whether enough evidence exists before learning.

Define minimum evidence-quality gate conceptually.

---

# 148. Minimum Sample Size

Do not define arbitrary statistical thresholds yet unless needed.

---

# 149. Privacy

Progress aggregation exposes behavioral trends.

ExecutionHistory already stores evidence, but Summary may make patterns more salient.

Document privacy sensitivity.

No new storage.

---

# 150. Export

Future derived metrics need not be persisted if reproducible.

User-data export should export raw history, not only aggregates.

---

# 151. Backup

Backup V3 will eventually need raw ExecutionHistory.

Derived Progress should not need independent backup if reproducible.

---

# 152. Persistence Recommendation

Strongly prefer:

> Progress/adherence derivations remain non-durable derived state.

Unless future expensive aggregation demands caching.

Task 3.7 must determine.

---

# 153. Cache Versus Authority

If cached later:

* cache is disposable;
* raw ExecutionHistory remains authority.

---

# 154. Progress Correction Behavior

Because metrics derive from current execution projection, corrections update metrics deterministically.

No separate metric correction.

---

# 155. Determinism

Equivalent history + plan-scope inputs must produce equivalent metrics.

No current clock except period selection.

---

# 156. Time Zone

Periods should use frozen user-day dates.

Do not regroup history based on current timezone.

---

# 157. Current Date Windows

“Today”/“this week” still depend on current date, but historical subject assignment uses frozen context.

---

# 158. Week Start

Audit exact safety before implementing weekly progress.

If unresolved, recommend daily/monthly or explicit date-range aggregation first.

---

# 159. Period Query API

Future pure API may accept explicit:

* start user-day date;
* end user-day date.

This avoids hidden current-time dependence.

---

# 160. Recommended Pure Derivation Layer

If architecture supports it:

```text id="7f8k0r"
ExecutionHistory records
    ↓
current subject projections
    ↓
OutcomeSummary
```

and separately:

```text id="39mt6n"
fresh current Preview
+
ExecutionHistory
    ↓
CurrentPlanReportingCoverage
```

Keep them separate.

---

# 161. No Monolithic Progress Score

Strongly consider making this an invariant.

A single “productivity score” would collapse too many distinct concepts.

---

# 162. OutcomeSummary Candidate

Conceptual:

```ts id="6dlztr"
type ReportedOutcomeSummary = {
  completed: number;
  partial: number;
  skipped: number;
  retracted?: number;
};
```

No percentage necessarily.

---

# 163. CurrentPlanCoverage Candidate

Conceptual:

```ts id="5uw0wh"
type CurrentPlanReportingCoverage = {
  eligibleOccurrences: number;
  reportedOccurrences: number;
  unreportedOccurrences: number;
};
```

Only over current authoritative Preview.

---

# 164. CurrentPlan Follow-Through Candidate

If authorized later:

* denominator only scheduled actionable occurrences;
* unknown excluded from completion result but shown in coverage;
* scalar label must say reported-only.

Task 3.7 decides whether this belongs in V1.

---

# 165. Evidence Matrix

Task must produce:

| Metric | ExecutionHistory alone | Current Preview required | Historical plan ledger required |
| ------ | ---------------------: | -----------------------: | ------------------------------: |

---

# 166. Outcome Treatment Matrix

Task must produce:

| Outcome | Evidence-only count | Completion credit | Adherence treatment |
| ------- | ------------------: | ----------------- | ------------------- |

---

# 167. Plan State Matrix

Task must produce:

| Plan state | Progress relevance | Follow-through denominator | Planning-quality relevance |
| ---------- | ------------------ | -------------------------: | -------------------------: |

Cover:

* scheduled;
* unplaced;
* omitted;
* blocked;
* unplanned.

---

# 168. Source Family Matrix

Task must produce:

| Family | Generic outcome summary | Follow-through | Goal progress |
| ------ | ----------------------: | -------------: | ------------: |

Cover:

* template;
* work;
* manual;
* unplanned.

---

# 169. Metric Naming Matrix

Task must propose internal and user-facing names.

---

# 170. Current-System Findings

Every existing behavior claim must be labeled:

* Confirmed;
* Inferred;
* Not found.

Future policies:

* Proposed;
* Architectural determination.

---

# 171. No Implementation

Do not implement Progress calculations unless narrowly needed to prove a semantic ambiguity.

Prefer no production changes.

---

# 172. Investigation Tests

Small pure tests may be added only if needed to prove current execution-history behavior.

No Progress production module by default.

---

# 173. Checkpoint Publication

If architecture is coherent, create:

`docs/checkpoints/CHECKPOINT_Phase_3_Progress_And_Adherence_Semantics.md`

---

# 174. Checkpoint Contents

Include:

1. epistemic boundary;
2. outcome meanings;
3. evidence-only metrics;
4. denominator limits;
5. unreported uncertainty;
6. scheduled/unplaced/omitted/blocked policy;
7. progress versus adherence distinction;
8. historical denominator limitation;
9. need for or deferral of plan-history ledger;
10. goal dependency;
11. recommended first derivation implementation;
12. learning boundary;
13. invariants;
14. deferred metrics.

---

# 175. ADR Requirement

If Task 3.7 formally decides:

* no scalar completion rate in V1;
* historical adherence blocked without plan ledger;
* report-only outcome summaries first;

record that in ADR/DECISIONS according to project convention.

---

# 176. Governance Updates

Update `CURRENT_STATE.md`, `DECISIONS.md`, and roadmap only if architecture checkpoint is accepted.

No implementation changelog entry unless repository convention requires architecture entries.

---

# 177. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.7_AUDIT_AND_DEFINE_PROGRESS_COMPLETION_AND_ADHERENCE_DERIVATION_SEMANTICS_RESULT.md`

The result must include at least:

1. Executive Determination
2. Artifact Integrity
3. Governing Evidence
4. Repository Audit Method
5. Existing Progress Concepts
6. Existing Adherence Concepts
7. Existing Summary Concepts
8. Outcome Evidence Baseline
9. Outcome vs Assessment
10. Completion Definition
11. Partial Semantics
12. Skip Semantics
13. Not-Reported Semantics
14. Reporting Coverage
15. Denominator Problem
16. Scheduled Policy
17. Unplaced Policy
18. Omitted Policy
19. Blocked Policy
20. Work Policy
21. Manual Policy
22. Template Policy
23. Unplanned Policy
24. Progress Definition
25. Adherence Definition
26. Terminology Determination
27. Timing Adherence
28. Duration Adherence
29. Completion Credit Model
30. Scalar Percentage Determination
31. Planning Coverage
32. Capacity/Planning Quality Boundary
33. Historical Snapshot Authority
34. Correction Impact
35. Retraction Impact
36. Historical Reproducibility
37. User-Day Period Semantics
38. User-Week Limitation
39. Goal Domain Audit
40. Goal Progress Dependency
41. Allocation Boundary
42. Capacity Boundary
43. Recommendation Boundary
44. Learning Boundary
45. Unknown-as-Negative Prohibition
46. Reporting Bias
47. Minimum Honest Summary
48. Planned Denominator Source
49. Historical Completeness Limitation
50. ExecutionHistory Denominator Limitation
51. Current-Window Metrics
52. Historical-Plan Metrics
53. Plan-History Ledger Determination
54. Report-Only Metrics
55. Metric Classes
56. Progress Implementation Readiness
57. Source Lifetime Aggregation
58. Cross-Lifetime Aggregation
59. Unplanned Aggregation
60. Privacy
61. Persistence Recommendation
62. Determinism
63. Timezone/Period Boundary
64. Proposed Pure Derivation Layers
65. No-Monolithic-Score Determination
66. Recommended V1 Metric Set
67. Evidence Matrix
68. Outcome Treatment Matrix
69. Plan-State Matrix
70. Source-Family Matrix
71. Metric Naming Matrix
72. Architectural Invariants
73. Terminology Glossary
74. Confirmed Findings
75. Proposed Architecture
76. Unresolved Questions
77. Deferred Work
78. Checkpoint Publication
79. Governance Updates
80. Recommended Task 3.8
81. Validation Performed
82. Final Completion Determination

---

# 178. Required Architectural Invariants

At minimum evaluate and adopt/refine:

1. Not reported is never failure.
2. Unknown evidence is never a negative learning label.
3. Planning infeasibility is not execution failure.
4. Omitted occurrence is not non-compliance.
5. Blocked occurrence is not user failure.
6. Unplaced occurrence is not user failure.
7. Corrections update current metrics deterministically.
8. Retraction restores uncertainty.
9. Historical metrics cannot invent missing denominators.
10. Current-plan metrics must be labeled as current-plan derived.
11. Historical adherence requires durable historical plan denominator.
12. Reported duration is not completion fraction.
13. Partial is not automatically 50%.
14. Progress and adherence are distinct.
15. Goal progress requires explicit Goal semantics.
16. Derived metrics remain non-authoritative and non-durable by default.
17. No single productivity/success score should collapse distinct evidence classes.

---

# 179. Recommended Implementation Outcomes

Task 3.7 must choose one:

## Option A — Ready for evidence-only summary

Implement counts over current execution projections.

## Option B — Ready for evidence-only summary + current Preview reporting coverage

Requires explicit current-window labeling.

## Option C — Ready for broader progress/follow-through

Only if denominator semantics are defensible.

## Option D — Blocked pending durable historical plan ledger and/or Goal model

Provide exact prerequisite.

---

# 180. Recommended Task 3.8

Likely, if evidence supports it:

> **Task 3.8 — Implement Reported Outcome Summary and Current-Preview Reporting Coverage**

That task should:

* derive Completed/Partial/Skipped counts from ExecutionHistory;
* optionally derive current-preview report coverage from fresh reportable occurrences;
* preserve Not reported as uncertainty;
* avoid historical adherence percentages;
* avoid Goal progress;
* remain non-durable;
* expose minimal Summary UI.

If Task 3.7 determines even this is premature, recommend the narrower prerequisite instead.

---

# 181. Validation Requirements

Because Task 3.7 is primarily architecture:

* inspect production and tests;
* add only narrow investigative tests if needed;
* run `git diff --check`;
* run focused tests only if files/tests change;
* do not claim full implementation validation unless production code changes.

If checkpoint/governance docs are the only changes, record that accurately.

---

# 182. Completion Criteria

Task 3.7 is complete only when:

* current progress/adherence-like behavior has been audited;
* execution outcomes and derived assessments are explicitly separated;
* Completed/Partial/Skipped/Not reported treatment is defined;
* Partial is not assigned arbitrary generic percentage credit;
* Not reported remains uncertainty;
* denominator semantics are explicit;
* scheduled/unplaced/omitted/blocked treatment is explicit;
* planned versus unplanned execution is explicit;
* Progress and adherence are separately defined or one is rejected;
* timing/duration adherence is explicitly adopted or deferred;
* source-family participation is explicit;
* current-window versus historical metrics are distinguished;
* the historical denominator limitation from missing plan history is explicitly resolved;
* historical adherence is either governed safely or blocked pending a plan ledger;
* Goal progress dependency is explicit;
* reporting bias and unknown-as-negative risk are addressed;
* recommended V1 metrics are defined;
* persistence/non-authority semantics are defined;
* architectural invariants are published;
* a Phase 3 progress/adherence checkpoint is published if coherent;
* the narrowest next implementation task is recommended;
* no progress/adherence/learning production implementation is introduced.

---

# 183. Explicit Non-Goals

Do **not**:

* implement Progress UI;
* implement completion percentages;
* implement adherence percentages;
* add streaks;
* add productivity score;
* add success/failure score;
* add learning;
* adapt schedules;
* add Goal domain model;
* add plan-history ledger unless separately authorized;
* change ExecutionRecord;
* change ExecutionHistory;
* change HistoricalExecutionTarget;
* change PlanDecision;
* implement Backup V3;
* infer missed;
* treat unknown as zero;
* derive partial percentage from duration;
* persist metrics;
* add broad Summary redesign.

---

# 184. Stop Conditions

Stop and report if:

* current history model cannot distinguish enough evidence classes for safe derivation;
* historical user-week grouping cannot be defined without new persisted context;
* Goal semantics are required before any useful Progress can be defined;
* current Summary UI already encodes contradictory metric behavior;
* historical adherence cannot be truthful without a durable plan ledger;
* execution-history incompleteness makes a proposed scalar metric misleading;
* governance docs materially contradict accepted execution-history semantics.

Recommend the narrowest prerequisite.

---

# 185. Task Determination

**Authorized:** audit and formal definition of outcome interpretation, completion semantics, denominator policy, reporting coverage, progress versus adherence, planned-state eligibility, source-family treatment, uncertainty propagation, current-window versus historical metrics, Goal dependency, learning boundary, metric persistence policy, architectural invariants, checkpoint publication, and recommendation of the next bounded implementation task.

**Not authorized:** Progress/adherence implementation, percentages, streaks, Goal implementation, plan-history persistence, learning, schedule adaptation, Backup V3, or changes to accepted execution-history/planning schemas.

The governing derivation principle is:

> **DayFrame may summarize evidence, but it must never convert missing evidence into failure, planning infeasibility into user non-compliance, or a convenient denominator into historical truth.**

---

# 186. Final Completion Statement

**Task 3.7 is complete when DayFrame has an evidence-backed architectural definition of what Progress, completion, reporting coverage, and adherence may truthfully mean over ExecutionHistory V1; when Completed, Partial, Skipped, and Not reported have explicit non-overlapping derivation semantics; when scheduled, unplaced, omitted, blocked, work, manual, template, and unplanned occurrences have explicit denominator and metric treatment; when Progress is clearly separated from plan follow-through/adherence; when timing and duration adherence are either safely defined or explicitly deferred; when current-window metrics are distinguished from historical metrics; when the inability of ExecutionHistory alone to reconstruct never-reported historical planned occurrences is recognized and any need for a durable historical plan ledger is explicitly determined; when Goal progress and learning dependencies are bounded; when reporting bias, uncertainty, source lifetime, correction/retraction, user-day grouping, and persistence semantics are governed; when a minimal honest V1 metric set and next implementation task are identified; when the resulting invariants are published in a canonical Phase 3 progress/adherence checkpoint; and when no Progress UI, scalar performance score, streak, Goal system, plan-history ledger, learning system, Backup V3, or unrelated production behavior is implemented.**

