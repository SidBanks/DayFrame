# Task 3.8 — Implement Reported Outcome Summary and Current-Preview Reporting Coverage

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded pure-derivation and minimal Summary presentation implementation task.

Task 3.8 implements the first governed metric layer authorized by Task 3.7.

This task includes:

* pure categorical `OutcomeSummary` derivation;
* current-subject projection reuse;
* Completed count;
* Partial count;
* Skipped count;
* known Not reported/retracted count;
* source-family breakdown where useful and low-risk;
* explicit date-range scoping;
* frozen user-day grouping;
* pure `CurrentPlanReportingCoverage` derivation;
* fresh-Preview-only coverage;
* reportable occurrence enumeration;
* durable-reference joining to ExecutionHistory;
* duplicate-safe current-plan matching;
* current-plan reported/unreported counts;
* minimal Summary UI;
* uncertainty-preserving language;
* deterministic recomputation;
* direct regression coverage.

It does **not** implement:

* scalar completion percentage;
* adherence percentage;
* plan-follow-through score;
* Goal progress;
* historical reporting coverage;
* historical adherence;
* streaks;
* productivity score;
* learning;
* schedule adaptation;
* durable metric persistence;
* plan-history ledger;
* Backup V3.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 3.7 is complete and accepted;
6. review:

   * `CHECKPOINT_Phase_3_Progress_And_Adherence_Semantics.md`;
   * the Task 3.7 ADR;
   * `ExecutionHistory V1`;
   * `ExecutionHistory` presentation helpers;
   * `HistoricalExecutionTarget`;
   * current Preview reportability semantics;
   * current Summary UI;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`docs/implementation/phase-3/TASK_3.8_IMPLEMENT_REPORTED_OUTCOME_SUMMARY_AND_CURRENT_PREVIEW_REPORTING_COVERAGE_RESULT.md`

If truthful current-Preview coverage cannot be derived without introducing historical-plan persistence or redefining reportability, stop and report rather than broadening scope.

---

# 2. Purpose

Task 3.7 established three metric classes:

```text
1. reported-evidence metrics
   ExecutionHistory alone

2. current-plan metrics
   fresh Preview + ExecutionHistory

3. historical-plan metrics
   require a future durable plan ledger
```

Task 3.8 implements only the first two.

The allowed V1 Summary is therefore:

```text
Reported outcomes
    Completed
    Partial
    Skipped
    known Not reported
```

and optionally:

```text
Current Preview reporting coverage
    reported reportable occurrences
    of
    total reportable occurrences
```

Task 3.7 explicitly rejected scalar completion/adherence/productivity scores and historical denominator reconstruction.

---

# 3. Governing Epistemic Rules

The following are fixed:

1. Not reported is uncertainty, not failure.
2. Partial is not arbitrary fractional completion.
3. Skipped is not generic failure.
4. Unplaced is not user failure.
5. Blocked is not user failure.
6. Omitted is not non-compliance.
7. ExecutionHistory alone cannot reconstruct never-reported historical planned occurrences.
8. Historical adherence is blocked without a durable plan ledger.
9. Goal progress is blocked without a Goal domain.
10. metrics are derived and non-authoritative.
11. no monolithic productivity/success score exists in V1.
12. scalar completion/adherence percentages are not authorized.

Do not reopen these decisions.

---

# 4. Architectural Objective

After Task 3.8:

```text
ExecutionHistory V1
        ↓
current subject projections
        ↓
OutcomeSummary
        ↓
minimal Summary presentation
```

and separately:

```text
fresh authoritative Preview
        +
ExecutionHistory V1
        ↓
CurrentPlanReportingCoverage
        ↓
minimal Summary presentation
```

Neither result is persisted.

---

# 5. Required Initial Audit

Before coding, inspect:

* current Summary component/surface;
* current Preview Summary semantics;
* ExecutionHistory presentation/projector helpers;
* current reportability logic;
* HistoricalExecutionTarget materializer;
* Preview freshness;
* Try/revised Preview detection;
* scheduled/unplaced/omitted/blocked occurrence representations;
* work/manual/template families;
* execution-history planned-reference lookup;
* current user-day/date helpers.

Determine the smallest implementation boundary.

---

# 6. Core Derivation Module

Create a pure derivation module.

Preferred location:

`code/src/core/execution/executionSummary.ts`

or equivalent.

Do not put metric derivation directly in React.

---

# 7. `OutcomeSummary`

Introduce a pure derived type conceptually:

```ts
type OutcomeSummary = {
  completed: number;
  partial: number;
  skipped: number;
  notReported: number;
  totalSubjects: number;
};
```

Exact naming may follow repository conventions.

This summary operates over known ExecutionHistory subjects only.

---

# 8. `notReported` Meaning

Within `OutcomeSummary`, `notReported` means:

> known execution subjects whose current projection is Not reported, typically because the current head is a retraction.

It does **not** mean:

> all planned occurrences that never entered history.

This distinction must be documented and tested.

---

# 9. `totalSubjects`

If included:

```text
completed
+ partial
+ skipped
+ known notReported
```

No invisible denominator.

---

# 10. No Completion Rate Field

Do not include:

* completionRate;
* completionPercent;
* successRate;
* adherenceRate;
* score.

---

# 11. No Fractional Partial Credit

No numeric weighting.

---

# 12. Current Projection Only

Use each execution subject's **current deterministic projection**.

Do not count:

* superseded assertions;
* prior corrections;
* prior retractions;
* revision count.

One subject contributes at most one current category.

---

# 13. Revision Independence

A subject with four revisions still counts once.

Mandatory direct test.

---

# 14. Retraction

Current retraction head contributes:

`notReported += 1`

and nothing else.

---

# 15. Re-Report

After re-report:

* no longer Not reported;
* contributes current reported outcome.

---

# 16. Correction

Correction moves the subject between categories deterministically.

Example:

```text
Completed
    ↓ correction
Partial
```

Summary becomes:

```text
completed - 1
partial + 1
```

No separate metric mutation.

---

# 17. Explicit Query Scope

Do not make one unbounded opaque global Summary helper.

Support explicit period filtering.

Preferred input:

```ts
{
  startUserDayDate?: LocalDate;
  endUserDayDate?: LocalDate;
}
```

or equivalent.

---

# 18. Default Scope

UI may choose a default scope.

Preferred for minimal Summary:

> current Preview date range when Preview exists.

If no Preview exists:

> recent/all history according to an explicitly documented UI policy.

Do not hide this inside core derivation.

---

# 19. Frozen User-Day Date

Period filtering uses frozen historical snapshot `userDayDate`.

Do not use:

* `recordedAt`;
* current source date;
* current timezone regrouping.

---

# 20. Inclusive Range

Define explicitly whether date bounds are inclusive.

Preferred:

> inclusive start and end user-day dates.

---

# 21. Invalid Range

`start > end`:

* explicit invalid result or empty according to repository conventions.

Prefer explicit validation.

---

# 22. Calendar Month Support

No dedicated month API required.

An explicit user-day range is sufficient.

---

# 23. Week Support

Do not define a canonical historical week internally.

Task 3.7 found historical week-start preference is not frozen.

If UI uses a week range, it must supply explicit start/end dates based on current user selection.

Do not claim this is the canonical historical week definition.

---

# 24. Source Family Breakdown

Task 3.7 allows categorical summaries across all families.

A small breakdown may be useful:

* template;
* work;
* manual;
* unplanned.

Determine whether to include in pure API.

Preferred:

> implement optional family breakdown if trivial, but do not overbuild UI.

---

# 25. Source Family Breakdown Semantics

Each subject contributes using frozen historical snapshot family.

No current source lookup.

---

# 26. Category Breakdown

Defer unless trivially useful.

Category meaning is less stable and not needed for Task 3.8 completion.

---

# 27. Source-Lifetime Breakdown

Defer.

No need for first Summary.

---

# 28. Current Preview Reporting Coverage

Introduce a second pure derived type:

```ts
type CurrentPlanReportingCoverage = {
  eligibleOccurrences: number;
  reportedOccurrences: number;
  unreportedOccurrences: number;
};
```

No percentage required.

---

# 29. Coverage Meaning

Coverage answers:

> Of the reportable occurrences represented by this current fresh authoritative Preview, how many currently have an ExecutionHistory subject?

It does not answer:

> How well did the user perform?

---

# 30. Coverage Is Current-Plan Derived

It is:

* volatile;
* recomputable;
* non-durable;
* current-scope-only.

Do not persist it.

---

# 31. Fresh Preview Requirement

Coverage is only valid for:

* fresh authoritative generated/regenerated Preview.

Not:

* stale Preview;
* Try-only revised Preview.

---

# 32. Try Preview

If `revisedAt` indicates temporary Try state:

coverage unavailable.

Do not count temporary geometry as plan denominator.

---

# 33. No Preview

Coverage unavailable.

Do not return `0 of 0` as though that were meaningful evidence.

Use explicit unavailable state.

---

# 34. Coverage Result Union

Preferred:

```text
available
unavailableNoPreview
unavailableStalePreview
unavailableTryPreview
```

or equivalent.

No ambiguous null where avoidable.

---

# 35. Eligible Occurrence Definition

Task 3.7 says reporting coverage operates over **known reportable occurrences for the explicit current plan scope**.

Therefore eligibility should follow Task 3.4 reportability, not follow-through eligibility.

This means coverage can include:

* scheduled;
* unplaced;
* omitted;
* blocked;
* work;
* manual;

when they are safely reportable.

---

# 36. Coverage Is Not Follow-Through Denominator

This distinction is mandatory.

Coverage denominator:

> reportable current occurrences.

Future plan-follow-through denominator:

> actionable scheduled occurrences under separate policy.

Do not conflate them.

---

# 37. Imported/Synthetic Exclusion

If an occurrence cannot materialize a HistoricalExecutionTarget:

* it is not coverage-eligible.

Do not penalize reporting for unsupported identity families.

---

# 38. Occurrence Enumeration

Task 3.8 must produce a deduplicated set of current reportable occurrences.

Possible sources:

* scheduled blocks;
* unplaced candidates;
* omitted PlanDecision replay targets;
* blocked replay targets;
* work;
* manual.

Use semantic durable reference equality.

---

# 39. No Double Counting

The same semantic occurrence must count once even if reachable through:

* scheduled block + accepted-choice row;
* unplaced candidate + blocked replay result;
* another UI representation.

Mandatory.

---

# 40. Canonical Coverage Key

Use:

`DurableOccurrenceReference V1`

semantic equality.

Do not use runtime block IDs.

---

# 41. Materialization Reuse

Prefer reusing Task 3.4 materialization/reportability helpers.

Do not create a second independent coverage-specific identity system.

---

# 42. Coverage Materialization Cost

If invoking full materialization for every occurrence is reasonable at current Preview scale, prefer correctness.

Do not prematurely optimize.

---

# 43. Existing Execution Subject Join

For each eligible durable planned reference:

* use ExecutionHistory lookup by durable-reference equality.

If a subject exists:

* counted as `reportedOccurrences`, even if current outcome is Not reported due retraction?

This requires explicit determination.

---

# 44. Coverage Definition After Retraction

Task 3.7 defines reporting coverage as reports recorded for a known plan scope and treats retraction as restoring uncertainty.

Therefore preferred:

> a retracted subject counts as **unreported** for current coverage.

Even though a historical subject exists.

This is semantically important.

---

# 45. Coverage Join Rule

For eligible occurrence:

## Current assertion Completed/Partial/Skipped

→ reported.

## Subject exists but current outcome Not reported/retracted

→ unreported.

## No subject

→ unreported.

---

# 46. Coverage After Correction

Still reported.

---

# 47. Coverage After Re-Report

Reported again.

---

# 48. Coverage Count Identity

Each eligible occurrence contributes exactly one:

* reported;
  or
* unreported.

Thus:

```text
eligible = reported + unreported
```

Mandatory invariant.

---

# 49. Coverage And Omitted Occurrence

If omitted occurrence is reportable in current fresh plan:

* it belongs in **reporting coverage** denominator because coverage asks whether the occurrence has an outcome report;
* this does not make it follow-through eligible.

Task 3.7's distinction must remain visible.

---

# 50. Coverage And Unplaced

Same.

---

# 51. Coverage And Blocked

Same.

---

# 52. Coverage And Work

If reportable, included.

---

# 53. Coverage And Manual

If reportable, included.

---

# 54. Coverage And Unplanned

Excluded.

There is no current planned occurrence denominator.

---

# 55. Coverage And Unsupported Imported Items

Excluded.

---

# 56. Current Preview Range

Coverage scope is exactly the current Preview's reportable occurrence set.

No historical recurrence reconstruction.

---

# 57. Preview Window Expansion

If engine internally expands planning window beyond displayed range:

coverage must use user-visible/current requested Preview scope, not hidden buffer occurrences.

Audit current outputs.

---

# 58. Clipped Occurrences

Determine whether occurrences partially overlapping the visible user-day window count once.

Use existing Preview inclusion semantics.

Do not count hidden expansion-only items.

---

# 59. Multi-Day Preview

Each semantic occurrence counts once across the full current Preview range.

---

# 60. Overlapping User-Day Groups

No duplicate coverage.

---

# 61. N-Per-Week

Use durable slot/reference identity.

No Preview-order dependence.

---

# 62. Weekly Occurrences

Same.

---

# 63. Work

Use work durable reference.

---

# 64. Manual

Use manual event reference.

---

# 65. Outcome Summary And Coverage Are Separate

Do not combine them into one ambiguous type.

Example:

```text
OutcomeSummary
    historical evidence counts

CurrentPlanReportingCoverage
    current-plan evidence coverage
```

This separation is architectural.

---

# 66. Summary UI

Add a minimal user-facing Summary section.

Use existing preferred product language.

Recommended:

### Reported outcomes

* Completed: X
* Partial: Y
* Skipped: Z
* Not reported: R

And, if available:

### Current Preview reporting coverage

> Reports recorded: A of B reportable occurrences

No percent.

---

# 67. User-Facing `Not reported`

For OutcomeSummary, this is only known retracted subjects.

Avoid UI copy that implies it includes never-reported historical occurrences.

Potential label:

> Retracted / currently not reported

But that is clunky.

Task 3.8 must determine truthful user-facing wording.

Preferred:

* `Not reported` with short explanatory text:

  > Includes known history subjects whose report was withdrawn.

If the count is zero, explanation need not dominate UI.

---

# 68. Do Not Show Historical Unknown Total

Do not say:

> “Not reported: 7”

if 7 includes guessed never-reported past occurrences.

Never.

---

# 69. Coverage Copy

Preferred:

> “Reports recorded for 8 of 11 reportable occurrences in this Preview.”

Not:

> “73% complete.”

---

# 70. Coverage Unavailable Copy

No Preview:

> “Generate a preview to see current reporting coverage.”

Stale:

> “Regenerate the preview to refresh reporting coverage.”

Try:

> “Accept or discard the Try result to refresh reporting coverage.”

Keep concise.

---

# 71. Planning Versus Execution Labeling

Do not call coverage:

* progress;
* adherence;
* follow-through.

Call it:

> reporting coverage.

---

# 72. Summary Location

Use current Summary surface if one exists.

If current app still treats Preview Summary as a compact planning summary, add a clearly separate execution/evidence subsection.

Do not redesign Planner/Summary architecture broadly.

---

# 73. Execution History Panel Coexistence

Task 3.6 history remains detailed evidence review.

Task 3.8 Summary is aggregate derived presentation.

Do not duplicate correction controls.

---

# 74. Summary Is Read-Only

No report/correct/retract actions required.

Those remain in Tasks 3.5–3.6 surfaces.

---

# 75. OutcomeSummary Empty State

No history in selected scope:

> “No outcomes reported in this period.”

No zero-score framing.

---

# 76. Coverage Zero Eligibility

A fresh Preview may legitimately contain zero reportable occurrences.

In that case:

* available coverage;
* eligible = 0;
* reported = 0;
* unreported = 0.

User-facing:

> “No reportable occurrences in this Preview.”

Do not show 0/0 percentage.

---

# 77. Outcome Summary Scope Selection

For Task 3.8, choose the narrowest UI scope.

Preferred:

## When Preview exists

Use the Preview's user-day date range for reported-outcome summary.

## When Preview absent

Either:

* show a recent bounded explicit date range;
  or
* show all history.

Determine based on existing Summary UX.

Strong preference:

> keep Summary aligned to current Preview range when available, and show all/recent history only in Execution History panel.

This prevents confusing aggregate scopes.

---

# 78. Preview-Scoped Outcome Summary

This is still evidence-only because filtering uses frozen history user-day dates.

It does not depend on current plan denominator.

Safe.

---

# 79. Stale Preview Range

If Preview stale, its **date range** may still be usable for filtering historical outcomes if the range itself remains explicit and unchanged.

But avoid implying the stale plan is current.

Task 3.8 should determine whether to:

* retain outcome summary range;
* disable only coverage.

Preferred:

> OutcomeSummary may remain available because it derives from history; coverage becomes unavailable.

---

# 80. Try Preview Range

Same:

* historical outcome summary may remain;
* coverage unavailable.

---

# 81. No Preview Outcome Summary

If no Preview range, do not invent current period unless existing app has a canonical selected range.

Possible:

* show all history aggregate;
* or omit summary until Preview exists.

Preferred:

> show all/recent outcome summary only if scope is explicitly labeled.

Do not silently switch scope.

---

# 82. Pure OutcomeSummary Scope API

Core helper must not know UI scope defaults.

---

# 83. Deterministic Sorting/Counting

Input array order must not affect counts.

---

# 84. Clone Isolation

No mutation of ExecutionHistory records.

---

# 85. Preview Purity

Coverage derivation does not mutate Preview.

---

# 86. PlanDecision Purity

No mutation.

---

# 87. Materializer Purity

No history write.

---

# 88. No Current Clock In Core

Derivations accept explicit ranges/Preview.

No `Date.now()`.

---

# 89. Corrected History

Summary automatically updates via history subscription.

---

# 90. Retraction

Summary updates:

* reported category decremented;
* notReported increments.

Coverage:

* reported decremented;
* unreported increments if occurrence remains in current Preview.

---

# 91. Re-Report

Reverse accordingly.

---

# 92. History Persistence Failure

Runtime history remains session authority.

Summary should reflect runtime current projection immediately.

Durability warnings remain in history/reporting surfaces.

Do not suppress aggregate update because save failed.

---

# 93. Should Summary Show Durability Warning?

Determine whether needed.

Preferred:

> no separate metric-level persistence warning.

The underlying ExecutionHistory durability status is already surfaced by Tasks 3.5–3.6.

Summary is derived from current runtime authority.

---

# 94. Protected History Ingress

If ExecutionHistory whole-source ingress is protected:

* valid runtime history may be safe-empty;
* do not imply “0 reported” as complete history.

Summary should surface unavailable/recovery-needed state or reuse existing recovery status.

This is important.

---

# 95. Protected Summary Policy

Preferred:

> suppress/disable outcome counts and show “Execution history needs recovery before outcomes can be summarized.”

Do not present safe-empty runtime as authoritative zero.

---

# 96. Quarantine

Valid unrelated history may still summarize.

Quarantined components are excluded.

Optionally note:

> Some history is unavailable due to recovery issues.

But avoid broad recovery UI.

Determine whether existing ingress/quarantine status exposes enough information.

---

# 97. Quarantine Count Transparency

Do not silently imply summary covers all stored raw history if quarantine exists.

Preferred:

> small factual note:
> “Some preserved history could not be included.”

No raw count required unless easily available.

---

# 98. Coverage Under Quarantine

Current Preview occurrence with quarantined execution component may appear unreported because invalid evidence is not authority.

That is correct for current valid authority, but UI should not imply complete evidence certainty if quarantine affects data.

If the system cannot identify whether quarantine corresponds to the current occurrence safely, use general note.

---

# 99. Full Clear

OutcomeSummary resets.

Coverage still derives current Preview:

* all reportable occurrences become unreported.

This is truthful.

---

# 100. Profile Activation

History unchanged.

Outcome summary unchanged for same explicit date scope.

Coverage recomputed against new fresh Preview only after regeneration.

---

# 101. Backup V1

Same.

---

# 102. Backup V2

Same.

---

# 103. PlanDecision Accept/Remove

May change current Preview reportability/occurrence state after regeneration.

Coverage recomputes.

History summary remains evidence-only.

---

# 104. Preview Regeneration

Coverage recomputes from new current plan.

Outcome summary does not rewrite history.

---

# 105. Source Deletion

History summary remains because frozen snapshot persists.

Coverage after regeneration may no longer include deleted occurrence.

---

# 106. Source Recreation

Old history stays separate.

New current occurrence may be unreported.

No cross-lifetime matching.

Mandatory test.

---

# 107. Same Readable ID New Lifetime

Coverage join must fail to match old history.

Use durable reference equality.

---

# 108. Current Source Update Same Lifetime

If current occurrence reference remains same lifetime:

* existing history may match that semantic occurrence only if reference coordinates are equal.

Do not join by title.

---

# 109. Manual Event Move

Coverage joins on manual durable reference semantics.

Audit current behavior.

---

# 110. Outcome Summary Historical Title Independence

Counts do not care whether title changed.

Family breakdown uses frozen snapshot.

---

# 111. Unplanned Outcome Summary

Include in categorical summary if within explicit date range.

---

# 112. Unplanned Coverage

Never included.

---

# 113. Work Outcome Summary

Include.

---

# 114. Manual Outcome Summary

Include.

---

# 115. Template Outcome Summary

Include.

---

# 116. Source-Family UI Breakdown

Optional.

If implemented:

```text
Templates
Work
Manual
Unplanned
```

with counts.

Do not label as progress.

---

# 117. Keep UI Minimal

Preferred Task 3.8 UI:

```text
Reported outcomes
Completed  X
Partial    Y
Skipped    Z
Not reported R

Current Preview reporting coverage
A of B reportable occurrences have reports
```

No charts necessary.

---

# 118. No Chart Requirement

Do not add pie/donut/bar charts unless current UI already has a compelling pattern.

Text/count cards are sufficient.

---

# 119. No Color-Only Semantics

If colors are used, labels remain visible.

---

# 120. Accessibility

Summary must use:

* semantic headings;
* readable counts;
* visible labels;
* no color-only status;
* accessible unavailable explanations.

---

# 121. Responsive Layout

Counts should stack/wrap cleanly on mobile.

No wide table.

---

# 122. OutcomeSummary Result Type

Consider explicit result:

```ts
type OutcomeSummaryResult =
  | { status: "available"; summary: OutcomeSummary }
  | { status: "invalidRange"; ... };
```

No need for protected ingress in pure core; UI/application can gate before calling.

---

# 123. Coverage Result Type

Must encode availability reason.

---

# 124. Coverage Enumeration Helper

Potential API:

```ts
deriveCurrentPreviewReportingCoverage({
  preview,
  authoredState,
  planDecisions,
  historyRecords
})
```

But avoid giant inputs if current materializer needs narrower structures.

---

# 125. Store Dependency

Pure helper must not query store.

Application/container assembles inputs.

---

# 126. History Join Helper

Reuse existing:

`findExecutionSubjectByPlannedReference`

only if it is pure/store-independent.

If store-bound, extract/reuse underlying pure reference matching.

Do not make core derivation call store.

---

# 127. Materialization Error Handling During Coverage

Some Preview entries may fail materialization.

Policy:

* unsupported/notReportable → excluded from eligible denominator;
* stale/Try → coverage unavailable globally;
* sourceMissing/lifetimeMismatch/occurrenceMissing in a supposedly fresh current Preview may indicate inconsistency.

Determine whether to:

* exclude safely;
  or
* mark coverage unavailable.

Preferred:

> if current authoritative occurrence cannot materialize due identity inconsistency, coverage should return unavailable/inconsistent rather than silently shrink denominator.

This prevents masking bugs.

---

# 128. Coverage Inconsistency Result

Possible:

`unavailableInconsistentPlanContext`

or equivalent.

No UI technical jargon.

---

# 129. Unsupported Families Are Normal Exclusions

Imported/synthetic non-reportable items do not make coverage inconsistent.

---

# 130. Duplicate Durable Reference In Preview

If two distinct denominator entries materialize to the same durable reference:

* deduplicate;
* optionally flag inconsistency if they represent duplicate semantic occurrence.

Preferred:

> deterministic set semantics, with a defensive duplicate count/test.

Do not count twice.

---

# 131. Existing Subject Duplicate Impossible

ExecutionHistory prevents duplicate planned subjects for same reference.

If malformed runtime somehow exposes ambiguity, valid accessor should already have quarantined it.

No extra winner selection.

---

# 132. Coverage By Current Outcome

Do not break reported coverage down by Completed/Partial/Skipped.

Coverage is binary evidence availability.

The outcome summary already supplies categories.

---

# 133. Retraction Coverage

Mandatory test:

* subject exists;
* current outcome Not reported;
* coverage classifies unreported.

---

# 134. Current History Subject Without Current Preview Occurrence

Does not affect coverage.

Still appears in OutcomeSummary if within date range.

---

# 135. Current Preview Occurrence With Old-Lifetime History

Unreported.

Mandatory.

---

# 136. Coverage Scope Label

UI should explicitly say:

> Current Preview

not:

> This week

unless Preview range actually equals an explicit selected week.

---

# 137. Outcome Scope Label

If aligned to Preview range:

> Reported outcomes in this Preview range

or present dates.

Avoid ambiguity.

---

# 138. Date Range Display

Show friendly range if useful.

No need if current Preview already clearly displays it nearby.

---

# 139. No Hidden Historical Comparison

No:

* “up from last week”
* “trend”
* “average”
* “best week.”

---

# 140. No Percentage

Search production UI after implementation for `%` or rate labels in new execution Summary.

No scalar metrics.

---

# 141. No Goal Copy

Do not say:

* goal;
* target;
* on track.

---

# 142. No Adherence Copy

Do not show:

* adherence;
* compliance;
* follow-through.

Task 3.7 deferred it.

---

# 143. No Success/Failure Copy

None.

---

# 144. No Streaks

None.

---

# 145. No Productivity Score

None.

---

# 146. No Metric Persistence

No storage key.

No store-owned durable summary.

---

# 147. Derived Summary Subscription

UI may subscribe to:

* ExecutionHistory;
* Preview/authored state as already available.

Recompute pure summary on updates.

---

# 148. No New Summary Store Authority

Do not add persistent/authoritative Summary state.

---

# 149. Memoization

Optional UI optimization.

Not semantically necessary.

---

# 150. Corrections Synchronization

Task 3.6 correction updates Summary immediately through shared authority.

Direct integration test if practical.

---

# 151. Inline Report Synchronization

Task 3.5 new report updates Summary immediately.

---

# 152. Undo Synchronization

Undo/retraction updates Summary immediately.

---

# 153. Retry

Persistence retry alone does not change counts.

No summary recomputation requirement beyond subscriber behavior.

---

# 154. History Quarantine Mutation

If a quarantine component is explicitly removed:

* valid summary may remain unchanged if component was already excluded.

No special UI.

---

# 155. Protected Recovery Replacement

After valid history recovery:

* summary recomputes.

---

# 156. Protected Recovery Abandon

OutcomeSummary becomes empty valid history.

Coverage current occurrences become unreported.

This is correct once recovery is explicitly complete.

---

# 157. All-History Summary Option

If UI chooses all-history scope when no Preview exists, label:

> All reported outcomes

No implied current progress.

---

# 158. Preferred UI Scope Determination

Task result must explicitly state one:

## A. Preview-range Summary only

or

## B. Preview-range when available, all-history when absent

or

## C. explicit user-selected date range

Preferred for minimal scope:

> Preview-range when available; all-history fallback only if clearly labeled.

No date-range picker yet.

---

# 159. Current Preview Coverage No-History Case

Fresh Preview with 5 eligible occurrences and empty history:

```text
eligible = 5
reported = 0
unreported = 5
```

This is allowed because current Preview provides the denominator.

---

# 160. Current Preview Coverage All-Reported Case

5/5.

Do not display 100%.

---

# 161. Current Preview Coverage Partial Evidence

Completed/Partial/Skipped all count as reported.

---

# 162. OutcomeSummary NotReported Versus Coverage Unreported

These are distinct.

Mandatory naming discipline:

* `OutcomeSummary.notReported`
  = known retracted/currently unknown history subjects.

* `CurrentPlanReportingCoverage.unreportedOccurrences`
  = eligible current occurrences without a current reported assertion, including no subject and retracted subject.

Document clearly.

---

# 163. Potential Rename For Clarity

Consider:

```text
knownNotReportedSubjects
```

instead of `notReported`.

This may avoid semantic confusion.

Preferred if code clarity improves.

User-facing label can remain “Not reported.”

---

# 164. Outcome Summary Current-Subject Count

Invariant:

```text
totalSubjects =
completed +
partial +
skipped +
knownNotReported
```

---

# 165. Coverage Invariant

```text
eligibleOccurrences =
reportedOccurrences +
unreportedOccurrences
```

---

# 166. Reported Coverage Join Invariant

One eligible reference maps to at most one current execution subject.

---

# 167. Unplanned Exclusion Invariant

Unplanned subject never changes coverage denominator/numerator.

---

# 168. Reported Outcome Summary Inclusion Invariant

All valid current subjects within explicit date scope contribute once regardless of planned/unplanned family.

---

# 169. Source Lifetime Invariant

Same readable ID with different source incarnation never joins.

---

# 170. No Current Source Lookup For OutcomeSummary

Mandatory.

---

# 171. Current Source Inputs For Coverage

Only as required by HistoricalExecutionTarget materialization.

---

# 172. History Snapshot Range Filter

For retracted subject:

* use latest assertion snapshot as Task 3.6 presentation does.

Do not lose date context merely because head is retraction.

---

# 173. Pure Snapshot Selection Helper

Reuse Task 3.6 helper/presentation model if appropriate.

Avoid duplicating “latest assertion snapshot” logic.

---

# 174. OutcomeSummary From Presentation Items

Possible safe architecture:

```text
ExecutionHistory records
    ↓
executionHistoryPresentation items
    ↓
OutcomeSummary
```

But ensure presentation-layer UI semantics do not contaminate core.

Preferred:

* reuse a pure subject-chain projection/snapshot helper;
* keep summary core independent of React.

---

# 175. Array Order Independence

Shuffle records → same summary.

Mandatory.

---

# 176. Date Scope Determinism

Explicit same scope → same summary.

---

# 177. Preview Order Independence

Shuffle Preview blocks/candidates → same coverage.

---

# 178. PlanDecision Order Independence

Same.

---

# 179. Runtime ID Independence

Change runtime block IDs → same coverage.

---

# 180. Preview Overlap Independence

Same semantic current occurrence appearing through overlapping grouping does not double count.

---

# 181. Tests — Empty History Summary

Expected zeros.

---

# 182. Tests — One Of Each Outcome

Completed/Partial/Skipped/known Not reported.

---

# 183. Tests — Revision Chain Counts Once

Mandatory.

---

# 184. Tests — Correction Reclassification

Mandatory.

---

# 185. Tests — Retraction Reclassification

Mandatory.

---

# 186. Tests — Re-Report Reclassification

Mandatory.

---

# 187. Tests — Date Range

Subjects outside range excluded.

---

# 188. Tests — User-Day Not recordedAt

A report recorded later still belongs to frozen historical user-day.

---

# 189. Tests — Deleted Source

Still counted.

---

# 190. Tests — Recreated Source

Outcome summary remains historical.

---

# 191. Tests — Unplanned Included

Outcome summary yes.

Coverage no.

---

# 192. Tests — Fresh Preview Coverage

Scheduled reportable occurrence counted.

---

# 193. Tests — Unplaced Coverage

Included if reportable.

---

# 194. Tests — Omitted Coverage

Included if reportable.

---

# 195. Tests — Blocked Coverage

Included if reportable.

---

# 196. Tests — Work Coverage

Included.

---

# 197. Tests — Manual Coverage

Included.

---

# 198. Tests — Unsupported Imported Excluded

Required if vocabulary exists.

---

# 199. Tests — No Preview Coverage Unavailable

Mandatory.

---

# 200. Tests — Stale Preview Coverage Unavailable

Mandatory.

---

# 201. Tests — Try Preview Coverage Unavailable

Mandatory.

---

# 202. Tests — Retracted Subject Coverage

Unreported.

---

# 203. Tests — No Subject Coverage

Unreported.

---

# 204. Tests — Completed/Partial/Skipped Coverage

All reported.

---

# 205. Tests — Old Lifetime History

Does not satisfy new lifetime occurrence.

---

# 206. Tests — Runtime ID Independence

Mandatory.

---

# 207. Tests — Duplicate Representation Dedup

Mandatory.

---

# 208. Tests — Inconsistent Current Target

Coverage unavailable rather than silently shrinking denominator, if adopted.

---

# 209. Tests — Quarantine

Valid history summarized; UI note if applicable.

---

# 210. Tests — Protected Ingress

Summary unavailable/recovery-needed.

---

# 211. Tests — Full Clear

Summary zero; fresh coverage unreported.

---

# 212. Tests — Correction UI Synchronization

Summary updates from shared history authority.

---

# 213. Tests — No Percentages

UI contains no scalar rate.

---

# 214. Tests — Accessibility

Semantic labels/counts/unavailable states.

---

# 215. No Persistence Audit

Search writers.

No summary/coverage serialized.

---

# 216. No Goal Audit

No Goal model added.

---

# 217. No Plan Ledger Audit

None.

---

# 218. No Learning Audit

None.

---

# 219. No Backup Audit

No Backup V3.

---

# 220. No Execution Domain Change

No `ExecutionRecord V1` schema change.

---

# 221. No ExecutionHistory Schema Change

None.

---

# 222. No HistoricalExecutionTarget Schema Change

Prefer none.

If a narrow pure helper export is needed, behavior must remain unchanged.

---

# 223. No PlanDecision Change

None.

---

# 224. Expected Production Files

Likely:

* `code/src/core/execution/executionSummary.ts`;
* tests;
* minimal Summary component or existing Summary extension;
* application/container wiring;
* CSS if needed.

Possible reuse/refactor:

* pure history presentation helper;
* materialization enumeration helper.

Avoid persistence changes.

---

# 225. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.8_IMPLEMENT_REPORTED_OUTCOME_SUMMARY_AND_CURRENT_PREVIEW_REPORTING_COVERAGE_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Task 3.7 Contract
4. Initial Summary/Derivation Audit
5. Files Changed
6. Core Derivation Boundary
7. OutcomeSummary Type
8. Completed Count
9. Partial Count
10. Skipped Count
11. Known Not-Reported Count
12. Total-Subject Semantics
13. Current-Projection-Only Rule
14. Revision Independence
15. Correction/Reclassification
16. Retraction Semantics
17. Re-Report Semantics
18. Date Scope
19. Frozen User-Day Filtering
20. Week Limitation
21. Source-Family Breakdown Determination
22. CurrentPlanReportingCoverage Type
23. Coverage Meaning
24. Fresh Preview Requirement
25. Stale Preview
26. Try Preview
27. No Preview
28. Coverage Availability Result
29. Eligible Occurrence Definition
30. Reportability Reuse
31. Scheduled Coverage
32. Unplaced Coverage
33. Omitted Coverage
34. Blocked Coverage
35. Work Coverage
36. Manual Coverage
37. Unplanned Exclusion
38. Unsupported-Family Exclusion
39. Durable-Reference Join
40. Deduplication
41. Retraction Coverage
42. No-Subject Coverage
43. Coverage Invariants
44. Source-Lifetime Safety
45. Current-Preview Scope
46. Hidden Expansion/Clipping Audit
47. OutcomeSummary vs Coverage Separation
48. Summary UI Location
49. UI Scope Determination
50. User-Facing Outcome Copy
51. Coverage Copy
52. Protected Ingress
53. Quarantine
54. Full Clear
55. Profile Activation
56. Backup V1
57. Backup V2
58. PlanDecision Mutation
59. Preview Regeneration
60. History Persistence Failure
61. Accessibility
62. Responsive Layout
63. Tests Added
64. Outcome Summary Tests
65. Revision/Correction Tests
66. Date-Scope Tests
67. Coverage Tests
68. Stale/Try/No-Preview Tests
69. Lifecycle Tests
70. Deduplication Tests
71. Protection/Quarantine Tests
72. Synchronization Tests
73. No-Percentage Tests
74. Persistence Audit
75. Goal/Plan-Ledger Audit
76. Learning Audit
77. Architectural Alignment Assessment
78. Deviations
79. Discoveries and Deferred Work
80. Recommended Next Task
81. Focused Validation
82. Full Validation
83. Final Completion Determination

---

# 226. Required Matrices

## A. Outcome Summary Matrix

| Current subject outcome | Count bucket |
| ----------------------- | ------------ |

Cover:

* Completed
* Partial
* Skipped
* Not reported

## B. Coverage Eligibility Matrix

| Current plan state/family | Coverage eligible? | Why |
| ------------------------- | -----------------: | --- |

Cover:

* scheduled template;
* unplaced template;
* omitted template;
* blocked template;
* work;
* manual;
* unplanned;
* unsupported imported/synthetic.

## C. Coverage Evidence Matrix

| Current execution state | Reported? |
| ----------------------- | --------: |

Cover:

* Completed
* Partial
* Skipped
* retracted/Not reported
* no subject.

## D. Preview Availability Matrix

| Preview state | Coverage status |
| ------------- | --------------- |

## E. Cross-Surface Matrix

| Transition | Outcome summary effect | Coverage effect |
| ---------- | ---------------------- | --------------- |

Cover:

* correction;
* retraction;
* re-report;
* profile activation;
* Backup V1;
* Backup V2;
* PlanDecision change;
* Preview regeneration;
* full clear.

---

# 227. Validation Requirements

Run focused tests for:

* OutcomeSummary;
* current projection counting;
* corrections;
* retractions;
* date range;
* frozen user-day semantics;
* current Preview coverage;
* scheduled/unplaced/omitted/blocked/work/manual;
* unsupported exclusions;
* durable-reference joining;
* old/new lifetime separation;
* no Preview;
* stale Preview;
* Try Preview;
* duplicate representation;
* protected ingress;
* quarantine;
* UI rendering;
* no percentages.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The full repository suite must pass.

Record exact test-file/test counts.

---

# 228. Completion Criteria

Task 3.8 is complete only when:

* a pure non-durable `OutcomeSummary` derivation exists;
* each current ExecutionHistory subject contributes exactly once;
* Completed, Partial, Skipped, and known Not reported remain separate categories;
* no scalar completion/adherence/productivity rate exists;
* corrections deterministically reclassify current counts;
* retractions move subjects to known Not reported;
* re-reports restore a reported category;
* revision count never inflates occurrence count;
* explicit date-range filtering uses frozen historical user-day date;
* source deletion/recreation cannot rewrite historical summary;
* unplanned, work, manual, and template subjects may appear in evidence-only counts;
* a separate pure `CurrentPlanReportingCoverage` derivation exists;
* coverage is available only for a fresh authoritative Preview;
* stale, Try-only, and missing Preview states are explicit;
* coverage denominator contains only safely reportable current planned occurrences;
* scheduled, unplaced, omitted, blocked, work, and manual occurrences follow reportability semantics;
* unsupported imported/synthetic items are excluded;
* unplanned history never enters coverage;
* durable-reference equality joins current occurrences to history;
* same-readable-ID new lifetime does not match old history;
* duplicate UI/Preview representations do not double-count;
* Completed/Partial/Skipped count as reported for coverage;
* retracted/no-subject occurrences count as unreported;
* eligible = reported + unreported;
* coverage is labeled as current Preview reporting coverage, not progress/adherence;
* minimal Summary UI presents categorical counts and optional coverage without percentages;
* protected history does not masquerade as zero history;
* quarantine remains non-authoritative and does not contaminate valid summary;
* summary/coverage are recomputed from runtime authority and never persisted;
* no Goal domain, historical plan ledger, historical adherence, streak, learning, or Backup V3 is introduced;
* full validation passes;
* result artifact is complete.

---

# 229. Explicit Non-Goals

Do **not**:

* add completion percentage;
* add adherence percentage;
* add productivity score;
* add success/failure score;
* add plan follow-through;
* add historical reporting coverage;
* add historical adherence;
* add Goal progress;
* add Goal domain;
* add plan-history ledger;
* add streaks;
* add trend charts;
* add comparative analytics;
* add learning;
* adapt scheduling;
* persist metrics;
* implement Backup V3;
* change ExecutionRecord;
* change ExecutionHistory;
* change PlanDecision;
* infer missed;
* treat Partial as fractional completion;
* treat Not reported as zero;
* treat unplaced/blocked as user failure;
* perform broad Summary redesign.

---

# 230. Stop Conditions

Stop and report if:

* current Preview reportability cannot be enumerated without changing Task 3.4 semantics;
* stale/Try/current Preview authority cannot be distinguished safely;
* current hidden planning-window expansion makes coverage denominator ambiguous;
* duplicate occurrence representations cannot be deduplicated by DurableOccurrenceReference;
* old/new source lifetimes cannot be separated in coverage joining;
* protected/quarantined history cannot be represented without misleading zero counts;
* existing Summary UI requires a broad product redesign;
* truthful current coverage requires a durable plan ledger;
* implementation requires scalar metric semantics rejected by Task 3.7;
* full-suite failures reveal an unrelated architectural defect.

Recommend the narrowest prerequisite/completion task.

---

# 231. Recommended Follow-On Boundary

If Task 3.8 completes successfully, DayFrame will have:

```text
execution evidence
    ↓
review/correction
    ↓
categorical summary
    ↓
current reporting coverage
```

The next architecture task should then decide whether Phase 3 needs a **durable historical plan ledger** before broader Progress/plan-follow-through work.

Recommended:

> **Task 3.9 — Audit and Define Historical Plan Ledger / PlannedOccurrence History Semantics**

That task should determine:

* whether planned occurrences need durable historical materialization before execution reports exist;
* when a planned occurrence enters the ledger;
* how schedule revisions affect historical plan authority;
* how PlanDecision changes are represented;
* whether unplaced/omitted/blocked states are recorded;
* whether current Preview publication creates a historical plan checkpoint;
* how denominator stability works;
* how Profile/Backup transitions affect plan history;
* storage-growth implications;
* relationship to Backup V3.

Task 3.9 should be architecture-first.

If broader historical follow-through remains intentionally out of scope, recommend a different Phase 3 close path instead.

---

# 232. Task Determination

**Authorized:** pure categorical outcome-summary derivation, explicit user-day date scoping, fresh-current-Preview reporting-coverage derivation, reportable-occurrence enumeration and lifetime-safe history joining, minimal aggregate Summary presentation, protection/quarantine-aware availability, and direct regression coverage.

**Not authorized:** scalar completion/adherence metrics, historical follow-through, Goal progress, Goal model, historical plan ledger, streaks, trends, learning, schedule adaptation, metric persistence, Backup V3, or changes to accepted execution/planning durable contracts.

The governing Summary principle is:

> **DayFrame may count the evidence it actually has and may report how much of the current plan has execution evidence, but it must not turn those counts into performance scores or pretend that missing historical plan context provides a denominator it no longer possesses.**

---

# 233. Final Completion Statement

**Task 3.8 is complete when DayFrame has a pure, deterministic, non-durable categorical `OutcomeSummary` over current ExecutionHistory subject projections and a separate pure `CurrentPlanReportingCoverage` over safely reportable occurrences in a fresh authoritative Preview; when Completed, Partial, Skipped, and known Not reported remain distinct without scalar credit or failure inference; when corrections, retractions, re-reports, source deletion/recreation, user-day date scoping, and revision history are handled without double counting; when current scheduled, unplaced, omitted, blocked, work, and manual occurrences are deduplicated by lifetime-safe DurableOccurrenceReference and joined to current valid execution authority; when Completed/Partial/Skipped count as reported while retracted/no-subject occurrences count as unreported; when stale, Try-only, missing, inconsistent, protected, and quarantined evidence states are represented truthfully; when minimal Summary UI presents categorical reported outcomes and explicitly labeled current-Preview reporting coverage without percentages, progress claims, adherence, scores, Goals, trends, or streaks; when all derivations remain recomputable and non-authoritative; when complete repository validation passes; and when no historical plan ledger, Goal system, learning system, Backup V3, or unrelated planning behavior is introduced.**
