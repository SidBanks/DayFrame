# Task 3.9 — Audit and Define Historical Plan Ledger / PlannedOccurrence History Semantics

## Status

Ready for investigation and architectural specification.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Architecture-first audit, historical-plan authority definition, denominator-semantics investigation, and publication task.

Task 3.9 determines whether DayFrame requires a durable historical plan ledger in order to support truthful historical reporting coverage, plan follow-through, and future progress/adherence derivations.

This task includes:

* audit of current Preview/history/planning persistence boundaries;
* definition of historical plan authority;
* determination of when a planned occurrence becomes durable history;
* planned-occurrence identity;
* relationship to DurableOccurrenceReference;
* relationship to PlanDecision;
* scheduled/unplaced/omitted/blocked historical states;
* plan revision semantics;
* source update/delete/recreate semantics;
* profile/backup transition semantics;
* denominator stability;
* ledger correction/revision semantics;
* retention/storage-growth implications;
* Backup V3 implications;
* future historical follow-through readiness;
* implementation sequence.

It does **not** implement:

* the historical plan ledger;
* historical follow-through;
* adherence;
* Progress;
* Goal progress;
* learning;
* schedule adaptation;
* Backup V3;
* new UI.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before investigation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Tasks 3.7 and 3.8 are complete and accepted;
6. review:

   * `CHECKPOINT_Phase_3_Progress_And_Adherence_Semantics.md`;
   * Task 3.7 result;
   * Task 3.8 result;
   * Phase 2 accepted-planning-authority checkpoint;
   * ExecutionHistory/ExecutionRecord architecture;
   * current Preview lifecycle;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.9_AUDIT_AND_DEFINE_HISTORICAL_PLAN_LEDGER_PLANNED_OCCURRENCE_HISTORY_SEMANTICS_RESULT.md`

If the audit concludes that a historical plan ledger is unnecessary or architecturally harmful, document that explicitly and recommend the alternative.

---

# 2. Purpose

Task 3.8 established:

```text
ExecutionHistory
    ↓
reported evidence summary
```

and:

```text
Fresh current Preview
    +
ExecutionHistory
    ↓
current Preview reporting coverage
```

But historical coverage remains impossible because ExecutionHistory does not contain planned occurrences that never entered execution history.

The central problem is:

```text
Monday Preview:
Workout
Errands
Study

Only Workout gets reported.

Three months later:
ExecutionHistory knows Workout.

But DayFrame no longer has durable evidence
that Errands and Study were planned Monday.
```

Without a durable plan denominator, DayFrame cannot later truthfully claim:

> 1 of 3 planned occurrences had reports.

Task 3.9 determines what historical planning authority, if any, should preserve that fact.

---

# 3. Governing Epistemic Principle

The central rule is:

> **Historical metrics may use only denominators that DayFrame durably knows existed at the relevant historical time.**

Therefore:

> **Rerunning today's scheduler is not a valid reconstruction of yesterday's historical plan.**

And:

> **Current authored recurrence is not proof of past planned occurrences if authored state may have changed.**

---

# 4. Core Architectural Question

Task 3.9 must answer:

> Should DayFrame persist a durable historical representation of planned occurrences, separate from current Preview and current PlanDecision authority?

Possible determinations:

* **Yes — required**
* **Yes — but only at specific plan-publication boundaries**
* **No — report-only metrics remain the intentional product limit**
* **Blocked pending a prerequisite concept**

---

# 5. Required Repository Audit

Inspect:

* Preview generation lifecycle;
* Preview persistence;
* Preview staleness;
* Try/revise behavior;
* accepted PlanDecision replay;
* historical execution materialization;
* source lifecycle/incarnation semantics;
* current backup/profile formats;
* clear semantics;
* current Summary/coverage derivation;
* current day/user-week semantics.

Identify all places where a “plan became real enough” that a historical record might plausibly be created.

---

# 6. Preview Is Not History

Reconfirm:

> Preview is current derived planning output.

It may be regenerated, revised, discarded, cleared, and replaced.

Therefore storing old Preview objects wholesale is not automatically the correct historical-plan model.

---

# 7. PlanDecision Is Not Plan History

Reconfirm:

> PlanDecision is current accepted occurrence-specific planning authority.

Superseded and removed decisions are not retained as historical plan events.

A historical plan ledger must not assume PlanDecision itself is an audit log.

---

# 8. ExecutionRecord Snapshot Is Partial Plan History

ExecutionRecord freezes historical plan context only for subjects that receive an execution report.

This solves:

> what was planned for this reported subject?

It does not solve:

> what else was planned but never reported?

Document this distinction.

---

# 9. Historical Denominator Requirement

Task 3.7 established that arbitrary historical reporting coverage/follow-through requires a durable denominator.

Task 3.9 must define exactly what denominator facts are required.

At minimum:

* planned occurrence existed;
* planned state;
* reportability/actionability;
* historical identity;
* historical user-day;
* source lifetime;
* optional planned interval.

---

# 10. Candidate Domain Concepts

Compare:

## A. `PlannedOccurrenceRecord`

One durable record per planned occurrence.

## B. `HistoricalPlanEntry`

One durable historical entry per semantic occurrence.

## C. `PlanSnapshot`

One immutable snapshot of the entire plan window.

## D. `PlanPublication`

One immutable publication/checkpoint containing many occurrence entries.

## E. No ledger

Report-only metrics remain product limit.

Evaluate each.

---

# 11. Atomic Occurrence Versus Whole-Plan Snapshot

This is a major design choice.

### Occurrence ledger

Pros:

* easy joins;
* granular lifecycle;
* denominator-friendly;
* less duplication.

Cons:

* plan revisions require per-occurrence history semantics.

### Whole-plan publication

Pros:

* preserves exact plan context atomically;
* easier historical “what was the plan then?”

Cons:

* large duplication;
* harder long-term storage;
* overlapping windows.

Compare rigorously.

---

# 12. Recommended Investigation Bias

Strongly consider a **publication + occurrence-entry** model:

```text
PlanPublication
    identifies one authoritative plan checkpoint

HistoricalPlannedOccurrence
    entries inside publication
```

But do not adopt before audit.

---

# 13. Publication Boundary Question

When does current plan become historical truth?

Potential boundaries:

* every Preview generation;
* every explicit Save Setup;
* every accepted PlanDecision regeneration;
* every day rollover;
* user explicitly “publishes” plan;
* first time a Preview becomes visible;
* first execution report;
* periodic background checkpoint.

Task 3.9 must choose or recommend.

---

# 14. Every Preview Generation Problem

If every Preview generation becomes history:

* experimentation may pollute history;
* temporary re-generation differences may create many plan versions.

Audit.

---

# 15. Try Preview Exclusion

Try-only Preview must never enter historical plan authority.

Mandatory.

---

# 16. Stale Preview Exclusion

Stale Preview must never be published as current historical plan truth.

---

# 17. Accepted Regenerated Preview

A fresh authoritative Preview after explicit Accept is a strong candidate for publication.

---

# 18. Initial Fresh Preview

Likewise.

Question:

> Does simply generating a fresh Preview mean “this is the plan the user had”?

Likely yes for some use cases, but determine whether user intent needs stronger confirmation.

---

# 19. User Acceptance Of Whole Plan

DayFrame currently lacks a “Publish Plan” or “Lock Week” action.

Do not invent one unless architectural evidence requires it.

---

# 20. Implicit Publication

If generation itself creates historical plan authority, document that clearly.

This is an architectural claim:

> Generated fresh Preview = current operative plan.

Evaluate against current UX.

---

# 21. Plan Revision Semantics

If a plan for Tuesday changes from 18:00 to 19:00:

What should historical plan say?

Possible:

## A. only latest plan before execution/date cutoff counts.

## B. preserve all plan revisions.

## C. preserve publication history and derive effective plan by time.

Task 3.9 must decide.

---

# 22. Effective Plan At Time

Historical follow-through needs one denominator per relevant historical period.

Therefore define how to determine:

> which plan publication was operative for this occurrence?

Potential rule:

> latest authoritative publication before occurrence/user-day cutoff.

Audit implications.

---

# 23. Revision Timestamp

Historical plan revisions require an authoritative timestamp.

Potential:

`publishedAt`

distinct from occurrence time.

---

# 24. Publication Identity

If publication model adopted:

introduce conceptual:

`PlanPublicationId`

with independent identity.

Do not implement.

---

# 25. Planned Occurrence Identity

A historical planned occurrence should likely use:

* DurableOccurrenceReference V1;
* publication identity;
* frozen planning snapshot.

Determine whether DurableOccurrenceReference alone is enough.

---

# 26. Same Occurrence Across Publications

If same semantic occurrence appears in multiple publications:

* same DurableOccurrenceReference;
* different plan publication context.

This seems likely.

Historical ledger must not duplicate it as independent semantic subjects without revision semantics.

---

# 27. Occurrence Revision Identity

Possible composite:

```text
PlanPublicationId
+
DurableOccurrenceReference
```

represents one historical version of the plan for that occurrence.

---

# 28. Planned State Vocabulary

At minimum consider:

* scheduled;
* unplaced;
* omitted;
* blocked.

Maybe:

* removed from later publication;
* no longer in scope.

Do not add execution outcomes.

---

# 29. Scheduled Historical Entry

Preserve:

* reference;
* frozen title/category;
* user-day;
* effective boundary;
* planned start/end;
* source family.

Likely similar to ExecutionRecord snapshot.

Avoid duplicating schema unnecessarily.

---

# 30. Unplaced Historical Entry

Occurrence existed but scheduler could not place it.

This matters for historical planning-quality diagnostics.

---

# 31. Omitted Historical Entry

Occurrence explicitly omitted by accepted planning authority.

Historical denominator policy may exclude it from follow-through.

But ledger should preserve that it existed and was intentionally omitted.

---

# 32. Blocked Historical Entry

Preserve that accepted hard placement could not be realized.

No fictional scheduled interval.

---

# 33. Removed Occurrence

If a later publication removes an occurrence entirely:

How does history represent that?

Potential:

* absence from later publication;
* explicit tombstone;
* publication-diff event.

Task 3.9 must decide.

---

# 34. Absence Semantics

If whole publication is authoritative, absence may be sufficient.

If occurrence-ledger is append-only without whole publication boundaries, absence may be ambiguous.

This influences model choice.

---

# 35. Denominator Derivation

Historical reporting coverage needs to derive:

```text
eligible historical planned occurrences
+
ExecutionHistory
```

Therefore ledger must support deterministic selection of the effective occurrence set for a period.

---

# 36. Plan Follow-Through Denominator

Task 3.7 proposed:

> actionable scheduled occurrences only

for eventual follow-through.

Ledger must preserve enough evidence to determine that historically.

---

# 37. Reporting Coverage Denominator

Historical reporting coverage may include all reportable plan states:

* scheduled;
* unplaced;
* omitted;
* blocked;
* work;
* manual.

Audit whether this should mirror current Preview coverage.

Likely yes.

---

# 38. Historical Planning Quality Metrics

Ledger could eventually support:

* scheduled vs unplaced;
* blocked counts;
* omitted counts.

These are planning-quality/capacity metrics, not user execution metrics.

Document.

---

# 39. Source Lifetime

Every historical occurrence entry must remain tied to exact source incarnation.

No same-readable-ID retargeting.

---

# 40. Source Update Same Lifetime

Ordinary updates preserve incarnation.

Historical plan publications must freeze mutable fields independently.

This solves the Task 3.4 retroactive mutation limitation.

---

# 41. Source Delete

Historical plan remains readable.

---

# 42. Source Recreate

New lifetime creates distinct historical occurrence family.

---

# 43. Profile Activation

Fresh source lifetimes.

New publications after profile activation use new references.

Old historical publications remain intact.

---

# 44. Backup V1 Import

Fresh lifetimes.

Same principle.

---

# 45. Backup V2 Restore

Exact lifetimes may return.

Historical ledger must not merge or rewrite old publications.

---

# 46. Active Abandonment

Historical plan ledger must remain intact unless full clear/privacy delete.

---

# 47. PlanDecision Interaction

Historical plan publication should reflect the **effective plan after PlanDecision replay**, not raw PlanDecision records alone.

Examples:

* omission appears omitted;
* duration affects scheduled interval;
* placement affects scheduled time;
* blocked placement appears blocked.

Likely.

---

# 48. PlanDecision Historical Loss

If old PlanDecision later removed, historical publication must preserve the resulting old plan state.

This is one of the strongest arguments for a ledger.

---

# 49. SuggestedFix / Try

Never historical until accepted/regenerated.

---

# 50. Current Preview Coverage Reuse

If ledger is adopted, current Preview coverage remains current-plan derived.

Do not make current coverage depend on ledger immediately.

---

# 51. ExecutionHistory Join

Historical planned occurrence entries should join to execution subjects through DurableOccurrenceReference.

But if the same occurrence has multiple plan publications, one execution subject still exists.

Determine which historical plan version contextualizes it for follow-through.

---

# 52. Effective Publication Selection

Potential rule:

> the last authoritative publication containing that occurrence before the occurrence’s effective start/user-day cutoff.

Audit.

---

# 53. Publication After Occurrence

What if user regenerates yesterday's plan today?

Should it rewrite historical plan?

Likely no.

Define cutoff.

---

# 54. Backdated Plan Publication

If DayFrame allows retroactive Preview generation:

historical plan ledger must not let a new publication silently overwrite what was known historically.

Possible:

* publication timestamp always controls;
* late-created plan for past date is a new revision, not retroactive truth.

Define.

---

# 55. User Correction Of Plan History

Should historical plan ever be correctable?

Potential:

* no ordinary editing;
* append corrected publication;
* advanced correction later.

Do not conflate with execution correction.

---

# 56. Append-Only Plan History

Strongly consider append-only publication history with derived effective view.

This aligns with ExecutionHistory philosophy.

Evaluate storage cost.

---

# 57. Historical Plan Deletion

Privacy/full-clear may physically delete.

Ordinary plan revision should not erase old historical publications.

---

# 58. Plan Ledger Persistence Surface

If adopted, likely independent durable surface:

`HistoricalPlan V1`

or equivalent.

Do not put into:

* Active V2;
* Profile V2;
* ExecutionHistory V1.

---

# 59. Surface Version Independence

Independent version.

---

# 60. Profile Boundary

Profiles should not contain history.

---

# 61. Backup Boundary

A complete broader-release backup would need:

* Active;
* Profiles;
* PlanDecisions;
* ExecutionHistory;
* HistoricalPlanLedger.

This significantly affects Backup V3 design.

Document.

---

# 62. Backup V3 Timing

Task 3.9 must determine whether Backup V3 should wait until plan ledger semantics are implemented.

Strong possibility:

> yes, because implementing Backup V3 before finalizing all durable Phase 3 surfaces may cause immediate Backup V4 churn.

Evaluate.

---

# 63. Storage Growth

Historical plan ledger may grow much faster than ExecutionHistory because it captures unreported occurrences too.

Estimate conceptual scale.

---

# 64. LocalStorage Suitability

This may be the point where localStorage becomes inappropriate.

Audit whether historical plan ledger should force IndexedDB.

Do not implement storage migration.

---

# 65. Publication Size

Estimate:

* occurrences per day;
* publications per week;
* duplication across regenerations.

This affects model choice.

---

# 66. Whole-Plan Snapshot Duplication

Potentially expensive.

Occurrence-diff model may be more efficient.

Compare.

---

# 67. Canonical Publication Hash

Consider whether identical regenerated plans should avoid duplicate publications.

Potential:

* canonical plan fingerprint;
* dedup identical publications.

Do not implement.

---

# 68. Idempotent Publication

If user clicks Generate twice with identical authoritative inputs/output:

Should ledger create one or two publications?

Likely:

> one semantic publication or duplicate-suppressed.

Define.

---

# 69. Meaningful Plan Change

What constitutes a new historical plan version?

Potential:

* occurrence set change;
* planned interval change;
* planned state change;
* duration change;
* title/category change?

Historical display context matters.

Define.

---

# 70. Metadata-Only Change

If source title changes but plan geometry does not:

Should publication revision occur?

For historical readability, yes if current plan context changes.

But denominator semantics do not require it.

Audit.

---

# 71. Planning Snapshot Schema Reuse

ExecutionHistoricalSnapshot already contains much of required historical context.

Could HistoricalPlanEntry reuse the same snapshot shape?

Potential advantages:

* consistency;
* easier execution join.

Potential concern:

* execution snapshot is report-time context, not necessarily plan-publication context.

Evaluate.

---

# 72. PlannedOccurrenceSnapshot Candidate

May deserve its own versioned schema.

Do not prematurely reuse if semantics differ.

---

# 73. Reportability Flag

Historical coverage needs to know whether occurrence was reportable under then-current capabilities.

Should ledger persist:

* `reportable: true/false`;
* or derive from family/state/schema version?

Persisting reportability may freeze UI capability rather than plan truth.

Likely avoid.

Instead store plan facts and derive eligibility by versioned policy.

Evaluate.

---

# 74. Metric Policy Versioning

Historical adherence semantics may evolve.

Do not bake metric classification into historical plan authority.

Historical ledger should preserve facts; metrics derive separately.

---

# 75. Historical Plan Authority Versus Metric Cache

Ledger is authority.

Derived adherence/coverage remains non-durable.

---

# 76. User-Day Semantics

Ledger must freeze:

* user-day date;
* effective boundary;
* perhaps week-start context if historical weekly metrics are intended.

---

# 77. Week-Start Gap

Task 3.7 identified no canonical historical week grouping.

A plan ledger could solve this by freezing:

`weekStartsOn`

at publication/occurrence context.

Determine whether required.

Strongly consider yes.

---

# 78. Timezone

Freeze sufficient historical offset/time context.

Follow ExecutionRecord precedent.

---

# 79. DST

Ledger must preserve UTC planned interval + historical offset.

No later reinterpretation.

---

# 80. N-Per-Week

Occurrence reference already contains canonical user-week coordinate.

Ledger should preserve publication context too.

---

# 81. Sequence/Shift

Work occurrence identity remains existing durable reference semantics.

---

# 82. Manual Events

Ledger captures authored planned commitment.

---

# 83. Imported Calendar

Still unsupported unless durable reference exists.

Do not use ledger to bypass identity requirements.

---

# 84. Synthetic Blocks

Likely excluded.

---

# 85. Planning Buffer Occurrences

Internal Preview expansion must not enter user-visible historical denominator if outside requested plan scope.

Ledger publication must use requested visible scope, not hidden engine buffers.

---

# 86. Partial Overlap

Define inclusion based on current Preview visible-scope semantics.

---

# 87. Publication Range

Each publication likely has:

* range start;
* range end.

This supports effective-plan queries.

---

# 88. Overlapping Publications

Current Preview ranges may overlap.

Historical effective plan must resolve overlapping publications deterministically.

---

# 89. Overlap Resolution

Potential:

> latest publication wins for overlapping user-day/occurrence coordinates.

But preserve earlier publication history.

Define.

---

# 90. Per-Occurrence Effective Revision

Whole-plan publication may be queried per occurrence:

latest publication before cutoff that contains/revises that occurrence.

Need explicit algorithm.

---

# 91. Publication Withdrawal

If later plan removes occurrence, latest publication absence may need to override earlier presence.

This argues for whole-range authoritative publication or explicit tombstones.

---

# 92. Range Authority

A publication might assert:

> this is the complete plan for user days X–Y.

Then absence becomes meaningful.

This is elegant but increases overlap complexity.

Evaluate.

---

# 93. Partial Publication

If only one day regenerated, does publication cover one day or full Preview range?

Current Preview generation range should define authority.

---

# 94. Effective Historical Plan Query

Task 3.9 should propose a future pure API conceptually:

```text
getEffectiveHistoricalPlan({
  userDayRange,
  asOf
})
```

No implementation.

---

# 95. `asOf` Semantics

Could mean:

* publication time cutoff;
* occurrence/user-day cutoff;
* current corrected historical truth.

Clarify.

---

# 96. Historical Metrics Current Truth

For corrected historical plan publications, metrics may reflect current best historical authority.

But ordinary later planning revisions should not retroactively rewrite past operative plan.

Distinguish correction from revision.

---

# 97. Plan Revision Versus Plan Correction

Important:

## Revision

Plan changed prospectively.

## Correction

Historical record was wrong.

Do not conflate.

Task 3.9 should decide whether correction exists in V1.

---

# 98. Minimal V1 Bias

Likely:

* preserve revisions;
* no explicit historical correction UI yet;
* no plan-history manual editing.

Architectural correction may be deferred.

---

# 99. Automatic Publication Trigger

Task 3.9 must choose.

Strong candidate:

> Every fresh authoritative generated/regenerated Preview is eligible for ledger publication, with identical publication deduplication.

Try/stale excluded.

Evaluate.

---

# 100. Why Generation May Be Enough

DayFrame currently uses fresh Preview as operative schedule.

There is no stronger whole-plan acceptance action.

Therefore publication at authoritative generation may align with current architecture.

But document implications.

---

# 101. Auto-Publishing Temporary Exploration Risk

User may generate repeatedly while adjusting Setup.

Each generated plan may represent transient exploration.

Could history become noisy?

Potential mitigation:

* latest publication per scope operative;
* prior publications still audit trail;
* dedup identical.

Assess.

---

# 102. Alternative Publication On Day Boundary

Could snapshot each day when it becomes historical.

Pros:

* captures final effective plan.

Cons:

* automation/timer requirements;
* browser may be closed;
* no guaranteed execution.

Likely unsuitable.

---

# 103. Publication On First Report

Too late for never-reported denominator.

Reject if historical coverage is goal.

---

# 104. Publication On Save Setup

Insufficient because scheduling heuristics/PlanDecisions determine occurrence plan.

Likely reject.

---

# 105. Publication On App Exit

Unreliable.

---

# 106. Publication On Explicit “Publish”

Would require new UX/mental model.

Potential later option, but likely too disruptive.

---

# 107. Current Best Candidate

Task should likely determine whether:

> authoritative fresh Preview generation is publication.

Do not prejudge final audit.

---

# 108. Publication Persistence Failure

If future ledger write fails:

* does current plan remain operative?
* historical durability fails independently.

Likely yes.

Must mirror factual durability semantics.

---

# 109. Historical Plan Durability Status

Future surface should probably have independent durability/retry.

No implementation now.

---

# 110. Protected Ingress / Quarantine

Historical plan ledger would need non-destructive recovery.

Determine whether whole-publication quarantine or entry-level quarantine is appropriate.

---

# 111. Publication Atomicity

A publication is likely atomic.

If one occurrence entry corrupts, can valid remainder still be trusted as a complete plan?

Potentially not, because absence semantics depend on complete publication.

This argues for publication-level quarantine/protection.

Important.

---

# 112. Whole Publication Integrity

If publication asserts complete plan for a range, partial salvage may change denominator.

Therefore publication may need atomic validation.

---

# 113. Surface-Level Corruption

Multiple publications may still allow component-level isolation by publication.

Potential:

* quarantine corrupt publication;
* preserve others.

---

# 114. Latest Publication Corrupt

Historical query may need fallback?

Do not silently fall back to older plan if latest authoritative publication is corrupt.

Likely mark historical plan unavailable for affected scope.

Define.

---

# 115. Publication Supersession

New publication supersedes old plan authority for overlapping future/current range, but old publication remains historical.

---

# 116. Occurrence Execution Relationship

ExecutionRecord frozen snapshot may differ from historical plan ledger publication if report happened after plan revision.

Determine which plan context is authoritative for:

* execution record display;
* historical follow-through.

Likely:

* ExecutionRecord snapshot = context at report time.
* Ledger = operative plan history.

Do not force them identical.

---

# 117. Disagreement Case

Example:

* 8 AM plan publication: Workout 18:00.
* 4 PM new publication: Workout 20:00.
* 9 PM user reports completed.

ExecutionRecord snapshot likely 20:00.

Ledger preserves both plan revisions.

Historical effective plan at execution time likely 20:00.

Good.

---

# 118. Report After Date Passed

If user reports yesterday today:

ExecutionRecord may freeze currently defensible plan context.

Ledger would provide stronger historical plan truth.

Future reporting could use ledger instead of current reconstruction.

This is a major benefit.

---

# 119. HistoricalExecutionTarget Evolution

If ledger exists, Task 3.4 materialization may eventually use historical plan entries for retroactive reports.

Task 3.9 should flag this future integration.

No implementation.

---

# 120. Source Deleted Retroactive Report

Ledger could allow safe retroactive target materialization even after source deletion.

Strong benefit.

---

# 121. Same-Lifetime Mutation Retroactive Report

Ledger would solve mutable-field uncertainty.

---

# 122. PlanDecision History Gap

Ledger would preserve effective result even though old PlanDecision record is gone.

---

# 123. Goal Progress Relationship

Ledger alone does not solve Goal progress.

Goal domain still separately required.

---

# 124. Historical Follow-Through Readiness

If ledger adopted, future historical follow-through can join:

```text
effective historical scheduled occurrences
+
ExecutionHistory
```

with categorical outcomes and preserved uncertainty.

---

# 125. Historical Reporting Coverage

Likewise.

---

# 126. Not-Reported Enumeration

Ledger finally makes never-reported historical planned occurrences enumerable.

This is the core denominator benefit.

---

# 127. Retraction

Ledger occurrence remains planned; ExecutionHistory current outcome becomes Not reported.

Historical coverage reflects unreported.

---

# 128. No Subject

Ledger occurrence exists with no execution subject.

Historical coverage reflects unreported.

---

# 129. Omitted/Blocked/Unplaced

Historical coverage may count them if reportable policy says yes.

Follow-through excludes as defined by Task 3.7.

---

# 130. Historical Metric Recalculation

Metrics derive from ledger + current execution projections.

Corrections to execution update metric.

Plan revision history remains fixed.

---

# 131. Historical Plan Correction

If future plan-history correction exists, metrics may recompute.

Deferred.

---

# 132. Storage Retention

Indefinite history may be large.

Determine retention principle.

Likely:

> no silent trimming.

Could require IndexedDB.

---

# 133. Archival

Potential future export/archive.

No implementation.

---

# 134. Privacy

Historical plan ledger is highly sensitive:

* what user intended;
* when;
* potentially across years.

Document.

---

# 135. Full Clear

Must delete ledger.

---

# 136. Export

User-data export should include ledger.

---

# 137. Backup

Complete backup should include ledger.

---

# 138. Backup V3 Scope

Task 3.9 must decide whether broader-release backup should wait until:

* ExecutionHistory;
* HistoricalPlanLedger

are both finalized.

Likely yes.

---

# 139. IndexedDB Decision

If ledger requires scalable collection storage, recommend whether:

* ExecutionHistory should migrate with it;
* or ledger alone uses IndexedDB.

Do not implement.

---

# 140. Persistence Technology Consistency

Having history split between localStorage and IndexedDB has complexity.

Could motivate a broader Phase 3 persistence migration task.

Assess.

---

# 141. Publication Query Performance

Potential future indexing by:

* user-day date;
* publication timestamp;
* durable occurrence reference.

No implementation.

---

# 142. Versioning

Historical plan surface independent version.

Occurrence snapshot schema independent or nested version.

---

# 143. Migration

No legacy historical plan surface exists.

No V0 migration.

---

# 144. Current Preview Backfill

If ledger is first introduced later, should existing current Preview be published immediately?

Likely yes prospectively.

Do not backfill historical plans from old data.

---

# 145. Historical Backfill

Explicitly prohibit fabricated backfill.

No current recurrence replay pretending to be past plan.

---

# 146. Migration Start Date

Ledger history begins when feature exists.

Historical metrics before that date may remain unavailable/incomplete.

Document.

---

# 147. Coverage Availability Metadata

Future historical metrics may need:

* ledger coverage start date;
* unavailable gaps.

Consider.

---

# 148. Ledger Completeness

If app was not running or publication persistence failed, historical plan coverage may have gaps.

Need explicit completeness semantics.

---

# 149. Publication Failure Gaps

Future metrics must not silently assume missing publication means no plan.

Important.

---

# 150. Ledger Coverage Metadata

Potential:

* first durable publication;
* known gaps;
* protected/corrupt ranges.

No implementation.

---

# 151. Automatic Publication Reliability

Browser-only app may not generate plans every day.

Historical denominator exists only where a fresh Preview was actually published.

This may still be acceptable.

Define.

---

# 152. User Expectation

If user never generates Preview for a week, DayFrame should not later claim that week had a historical plan.

Likely correct.

---

# 153. Published Plan Versus Intended Recurrence

This reinforces:

> ledger records operative DayFrame plan, not abstract authored intent.

---

# 154. Authored Intent History

Separate concept.

Not needed for historical follow-through if ledger captures operative plan.

---

# 155. Plan Publication Terminology

User-facing terminology may not need “publication.”

Internal terms might be:

* `PlanPublication`
* `PlanLedgerEntry`
* `HistoricalPlan`

Choose recommended names.

---

# 156. Candidate V1 Architecture

Task 3.9 must propose a concrete model if ledger is recommended.

At minimum:

```text
HistoricalPlanSurface V1
    contains PlanPublication V1[]

PlanPublication
    id
    publishedAt
    range
    occurrences[]
```

or equivalent.

---

# 157. Occurrence Entry Fields

At minimum evaluate:

* DurableOccurrenceReference;
* frozen plan snapshot;
* plan state;
* source family;
* user-day;
* weekStartsOn;
* planned interval;
* maybe publication-local ordinal only for serialization.

No runtime IDs.

---

# 158. Publication Range

Explicit user-day start/end.

---

# 159. Publication Completeness Flag

Potentially:

> publication asserts complete authoritative plan for its range.

If this is always true, no field needed—semantic contract can define it.

---

# 160. Publication Hash/Fingerprint

Optional derived, non-authoritative, for dedup.

---

# 161. PublishedAt

Canonical UTC instant.

---

# 162. Plan Source

Could include:

* generated;
* regenerated after accept.

Do we need provenance?

Maybe no. Effective plan facts matter more than reason.

Audit.

---

# 163. PlanDecision IDs In Ledger

Do not persist current decision IDs unless needed.

Ledger should preserve resulting plan state, not depend on current decision record.

---

# 164. SuggestedFix IDs

Never.

---

# 165. Runtime Block IDs

Never.

---

# 166. Execution IDs

Never inside plan ledger.

Join via DurableOccurrenceReference.

---

# 167. Identical Publication Dedup

Recommend deterministic canonical equality over:

* range;
* occurrence reference/state/snapshot.

If identical to latest authoritative publication for same range, skip new durable entry.

No implementation.

---

# 168. Overlapping Range Dedup

More complex.

Could still publish if range differs.

Historical query resolves latest per user day/occurrence.

---

# 169. Whole-Day Authority

Consider normalizing publications to user-day slices rather than arbitrary ranges.

Example:

`HistoricalPlanDay`

one complete plan snapshot per user-day.

Pros:

* simpler overlap;
* denominator queries;
* smaller updates.

Cons:

* Preview generation spans ranges;
* cross-day blocks.

This is an important alternative.

---

# 170. Day-Level Ledger Model

Compare:

```text
HistoricalPlanDay
    userDayDate
    publishedAt
    occurrences[]
```

Each generation updates/publishes per user-day independently.

This may simplify overlap and retention.

Audit.

---

# 171. Cross-Midnight Occurrence

Still belongs to semantic user-day.

Works well with day-level model.

---

# 172. Week-Level Occurrences

N-per-week occurrence still has user-day placement/context.

Historical day publication can contain occurrence.

---

# 173. Day-Level Supersession

Latest publication for that user-day before cutoff is operative.

Simple.

---

# 174. Day-Level Removal

Absence from latest complete day publication means occurrence no longer operative.

Strong advantage.

---

# 175. Day-Level Publication Atomicity

One corrupt day publication affects one day.

Good quarantine boundary.

---

# 176. Day-Level Storage Duplication

Generating 14-day Preview could publish 14 day snapshots.

Manageable perhaps.

---

# 177. Recommended Model Comparison

Task 3.9 must explicitly compare:

* range publication;
* day publication;
* occurrence ledger.

And choose one.

---

# 178. Publication Temporal Cutoff

For historical user-day D:

What publication counts as final operative plan?

Potential:

> latest publication for D created before the end of D's user-day window.

But a user may legitimately revise plan during D.

Latest before end seems reasonable for execution alignment.

However, user might report after end.

Define carefully.

---

# 179. As-Executed Plan

Alternative:

> latest publication before actual reported occurrence time.

But not all records have occurredAt.

Likely too complex.

---

# 180. Final Plan Of Day

Potential:

> latest authoritative publication created before user-day end.

This could support stable denominator.

But if app offline, no later publication.

Audit.

---

# 181. Plan At Report Time

ExecutionRecord already captures report-time plan context, but not never-reported occurrences.

Ledger metrics likely need a simpler day-level final plan.

---

# 182. Historical Follow-Through Policy Dependency

Task 3.7 hasn't fully implemented follow-through.

Task 3.9 need not finalize metric cutoff if ledger can preserve all publications and allow future policy.

This is preferable.

Thus:

* preserve publication history;
* defer exact metric effective-publication selection if necessary.

But recommend likely query.

---

# 183. No Derived Metric Policy In Ledger

Ledger stores facts, not metric policy.

---

# 184. Governance Of Publication Semantics

Need checkpoint/ADR.

---

# 185. Checkpoint Publication

If architecture coherent, create:

`docs/checkpoints/CHECKPOINT_Phase_3_Historical_Plan_Ledger_Semantics.md`

---

# 186. Checkpoint Contents

Include:

1. denominator problem;
2. ledger necessity determination;
3. chosen domain model;
4. publication boundary;
5. publication atomicity;
6. planned occurrence identity;
7. snapshot schema;
8. plan-state semantics;
9. revision/supersession;
10. Try/stale exclusion;
11. source lifecycle;
12. PlanDecision relationship;
13. user-day/week/time semantics;
14. persistence surface;
15. recovery/quarantine model;
16. storage technology recommendation;
17. Backup V3 implication;
18. historical metric readiness;
19. invariants;
20. implementation sequence.

---

# 187. ADR Requirement

If ledger is adopted, create ADR covering:

* why historical plan authority is necessary;
* why chosen model beats alternatives;
* what constitutes publication;
* why current Preview history cannot be reconstructed later.

---

# 188. Governance Updates

Update:

* `CURRENT_STATE.md`;
* `DECISIONS.md`;
* `ROADMAP.md`;

if checkpoint accepted.

No product changelog unless convention requires architecture entries.

---

# 189. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.9_AUDIT_AND_DEFINE_HISTORICAL_PLAN_LEDGER_PLANNED_OCCURRENCE_HISTORY_SEMANTICS_RESULT.md`

The result must include at least:

1. Executive Determination
2. Artifact Integrity
3. Governing Evidence
4. Repository Audit Method
5. Historical Denominator Problem
6. Preview Historical Status
7. PlanDecision Historical Status
8. ExecutionRecord Snapshot Limitation
9. Ledger Necessity Determination
10. Candidate Models
11. Occurrence Ledger Assessment
12. Range Publication Assessment
13. Day Publication Assessment
14. Chosen V1 Model
15. Publication Boundary
16. Fresh Preview Semantics
17. Try Preview Semantics
18. Stale Preview Semantics
19. Initial Publication
20. Accepted-Regeneration Publication
21. Identical Publication Dedup
22. Plan Revision
23. Plan Supersession
24. Effective Plan Query
25. Publication Identity
26. Planned Occurrence Identity
27. DurableOccurrenceReference Relationship
28. Snapshot Schema
29. Scheduled State
30. Unplaced State
31. Omitted State
32. Blocked State
33. Removal/Absence Semantics
34. Source Lifetime
35. Same-Lifetime Mutation
36. Source Deletion
37. Source Recreation
38. Profile Activation
39. Backup V1
40. Backup V2
41. Active Abandonment
42. PlanDecision Relationship
43. Try/SuggestedFix Boundary
44. ExecutionHistory Join
45. Historical Reporting Coverage
46. Historical Follow-Through Readiness
47. Historical Plan Correction
48. User-Day Semantics
49. Week-Start Semantics
50. Timezone/DST
51. Preview Buffer Boundary
52. Publication Range/Day Authority
53. Overlapping Publication Resolution
54. Publication Atomicity
55. Corruption/Quarantine Model
56. Persistence Surface
57. Version Independence
58. Durability/Retry Recommendation
59. Storage Growth
60. LocalStorage Suitability
61. IndexedDB Recommendation
62. Privacy
63. Export/Clear
64. Backup V3 Implication
65. Backfill Policy
66. Ledger Start-Date/Gaps
67. Historical Metric Completeness
68. HistoricalExecutionTarget Future Integration
69. Goal Boundary
70. Learning Boundary
71. Architectural Invariants
72. Terminology
73. Confirmed Findings
74. Proposed Architecture
75. Unresolved Questions
76. Deferred Work
77. Checkpoint Publication
78. ADR
79. Governance Updates
80. Recommended Task 3.10
81. Validation Performed
82. Final Completion Determination

---

# 190. Required Matrices

## A. Candidate Model Matrix

| Model | Denominator-safe | Revision-safe | Storage cost | Complexity |
| ----- | ---------------: | ------------: | -----------: | ---------: |

## B. Publication Trigger Matrix

| Trigger | Historical authority? | Reason |
| ------- | --------------------: | ------ |

Cover:

* fresh generation;
* stale Preview;
* Try Preview;
* accepted regeneration;
* Save Setup;
* first execution report;
* day rollover.

## C. Plan-State Matrix

| State | Persisted in ledger? | Interval present? | Follow-through eligibility |
| ----- | -------------------: | ----------------: | -------------------------: |

## D. Lifecycle Matrix

| Transition | Historical plan effect |
| ---------- | ---------------------- |

## E. Durable Surface Matrix

| Surface | Current role | Historical role | Backup V3 inclusion |
| ------- | ------------ | --------------- | ------------------: |

Include:

* Active;
* Profiles;
* PlanDecision;
* ExecutionHistory;
* HistoricalPlanLedger.

---

# 191. Required Architectural Invariants

At minimum evaluate and adopt/refine:

1. Current scheduler replay cannot reconstruct past plan truth.
2. Try-only Preview never becomes historical plan authority.
3. Stale Preview never becomes historical plan authority.
4. Historical plan entries are immutable once published.
5. Later plan revisions do not erase prior publications.
6. Same readable source ID with new incarnation never inherits historical plan identity.
7. Mutable same-lifetime source updates do not rewrite frozen historical plan context.
8. Historical denominator derives only from durable published plan authority.
9. Never-reported historical occurrences are enumerable only where ledger coverage exists.
10. Missing ledger data is unknown, not “no plan.”
11. Ledger facts remain separate from execution outcomes.
12. PlanDecision history is represented only through effective published plan state, not by depending on current PlanDecision records.
13. Derived historical metrics remain non-durable.
14. No fabricated backfill.
15. Full clear removes plan history.
16. Complete backup eventually includes plan history.
17. Corrupt latest publication must not silently fall back to older plan authority without explicit policy.
18. Internal Preview buffer occurrences never enter historical denominator outside published user-day scope.

---

# 192. Recommended Implementation Decision

Task 3.9 must conclude one:

## A. Implement Historical Plan Ledger V1 next

If necessary and architecture is ready.

## B. Defer ledger and close Phase 3 around report-only/current-plan metrics

If historical follow-through is not worth cost yet.

## C. Implement prerequisite storage migration first

If ledger scale makes current persistence architecture unsuitable.

## D. Implement another prerequisite identity/domain concept first

If needed.

---

# 193. Recommended Task 3.10

If ledger is authorized and storage is ready:

> **Task 3.10 — Implement HistoricalPlanLedger V1 Pure Domain and Publication Projection**

If storage migration is prerequisite:

> **Task 3.10 — Audit and Implement Phase 3 Durable Collection Storage Foundation**

If ledger is deferred:

> recommend Phase 3 closure audit instead.

Task 3.9 must choose based on evidence.

---

# 194. Validation Requirements

Because Task 3.9 is architecture-first:

* perform repository audit;
* run focused tests only to resolve ambiguous current behavior;
* create checkpoint/ADR/governance documents if architecture is accepted;
* run `git diff --check`;
* do not claim full implementation validation unless production code changes.

No production implementation is expected.

---

# 195. Completion Criteria

Task 3.9 is complete only when:

* the historical denominator problem is explicitly established;
* current Preview, PlanDecision, and ExecutionRecord historical limitations are documented;
* necessity of a historical plan ledger is explicitly decided;
* candidate models are compared;
* a concrete V1 historical-plan model is chosen if ledger is adopted;
* publication boundary is defined;
* Try/stale Preview exclusion is explicit;
* fresh authoritative generation/regeneration semantics are defined;
* identical publication behavior is defined;
* plan revisions/supersession are defined;
* planned occurrence identity is defined;
* scheduled/unplaced/omitted/blocked historical states are defined;
* source lifecycle semantics are defined;
* PlanDecision relationship is defined;
* execution-history join semantics are defined;
* user-day/week/timezone semantics are defined;
* publication atomicity and corruption/recovery implications are defined;
* persistence-surface and storage-technology recommendations are explicit;
* Backup V3 impact is explicit;
* backfill is either governed or prohibited;
* historical metric completeness/gap semantics are explicit;
* architectural invariants are published;
* checkpoint/ADR/governance are updated if appropriate;
* the narrowest next implementation task is recommended;
* no historical-plan production implementation is introduced.

---

# 196. Explicit Non-Goals

Do **not**:

* implement HistoricalPlanLedger;
* persist plan publications;
* add historical coverage/follow-through UI;
* add adherence;
* add Progress;
* add Goal model;
* add learning;
* add schedule adaptation;
* implement Backup V3;
* persist old Preview objects wholesale;
* reconstruct old plans by rerunning current scheduler;
* fabricate historical backfill;
* add imported-calendar identity;
* change DurableOccurrenceReference;
* change ExecutionRecord;
* change ExecutionHistory;
* change PlanDecision semantics;
* perform unrelated UI work.

---

# 197. Stop Conditions

Stop and report if:

* current architecture lacks any reliable boundary corresponding to authoritative plan publication;
* Try and authoritative Preview cannot be distinguished;
* historical plan identity requires changing DurableOccurrenceReference V1;
* publication overlap semantics cannot be resolved without a larger planning-history model;
* storage-scale analysis shows localStorage is categorically unsafe and a storage foundation must precede ledger implementation;
* week/user-day semantics cannot be frozen safely;
* historical denominator remains ambiguous even with publication snapshots;
* governance documents contradict accepted Phase 2/3 authority semantics materially.

Recommend the narrowest prerequisite.

---

# 198. Task Determination

**Authorized:** audit and formal definition of historical plan authority, ledger necessity, publication model, planned-occurrence identity, plan-state history, revision/supersession semantics, source/PlanDecision lifecycle, denominator stability, storage/recovery boundaries, Backup V3 implications, backfill policy, historical metric readiness, checkpoint/ADR publication, and recommendation of the next implementation task.

**Not authorized:** plan-ledger implementation, historical adherence, historical reporting coverage implementation, Goal progress, learning, Backup V3, old-Preview persistence, fabricated backfill, or changes to accepted execution/planning durable contracts.

The governing historical-plan principle is:

> **DayFrame may only judge historical follow-through against a plan it actually preserved. If a past plan was never durably published, the absence of that record is uncertainty—not permission to reconstruct one after the fact.**

---

# 199. Final Completion Statement

**Task 3.9 is complete when DayFrame has an evidence-backed architectural determination of whether a durable Historical Plan Ledger is required; when the historical denominator problem, Preview/PlanDecision/ExecutionRecord limitations, publication boundary, plan revision/supersession semantics, planned-occurrence identity, scheduled/unplaced/omitted/blocked historical states, source-lifetime behavior, PlanDecision relationship, execution-history join, user-day/week/timezone context, overlapping-publication resolution, publication atomicity, corruption/recovery model, storage-growth and persistence-technology implications, Backup V3 scope, backfill prohibition or policy, ledger-coverage gaps, and historical-metric readiness are explicit; when a concrete V1 ledger model and implementation sequence are published if the ledger is adopted, or a deliberate Phase 3 scope boundary is published if it is deferred; when architectural invariants and governance are synchronized; and when no historical-plan persistence, historical adherence, Goal system, learning system, Backup V3, fabricated backfill, or unrelated production behavior is introduced.**
