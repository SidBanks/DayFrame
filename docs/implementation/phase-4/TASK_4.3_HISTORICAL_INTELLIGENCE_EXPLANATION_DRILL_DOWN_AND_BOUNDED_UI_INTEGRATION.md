# Task 4.3 — Historical Intelligence Explanation, Drill-Down, and Bounded UI Integration

## Status

Ready for implementation.

## Phase

Phase 4 — Historical Intelligence

## Task Type

Product-facing integration, explainability implementation, historical drill-down, bounded Summary-surface foundation, accessibility, and regression coverage.

---

# 1. Context

Task 4.1 established the architecture and semantics for DayFrame Historical Intelligence.

Task 4.2 implemented the first production Historical Intelligence projection:

> **Historical Coverage and Completion Distribution V1**

The implemented projection is:

* pure;
* deterministic;
* explicitly policy-versioned;
* non-authoritative;
* non-persisted;
* reproducible from HistoricalPlan + ExecutionHistory;
* based on an explicit inclusive user-day range;
* based on an explicit HistoricalPlan evaluation cutoff;
* joined through exact `DurableOccurrenceReference` identity including source incarnation;
* independent of current Active state;
* backed by deterministic frozen provenance.

Task 4.2 now distinguishes HistoricalPlan coverage as:

```text
published
published empty
missing
```

and eligible scheduled occurrences as:

```text
completed
partial
skipped
unknown
not reported
```

It additionally preserves:

* complete plan coverage;
* incomplete plan coverage;
* unavailable plan coverage;
* zero eligible occurrence / `notApplicable`;
* current-outcome coverage;
* unplaced/omitted/blocked exclusion provenance;
* correction semantics;
* retraction semantics;
* plan republication semantics;
* protected/quarantined authority states.

Task 4.2 deliberately introduced no product UI.

Task 4.3 makes that implemented intelligence visible and understandable.

---

# 2. Purpose

Implement the first bounded user-facing Historical Intelligence experience.

The user should be able to answer:

> **What does DayFrame know about this historical period?**

> **What happened to the scheduled commitments DayFrame knows about?**

> **How complete is the evidence behind that description?**

> **Why is a particular occurrence counted in a particular category?**

> **What evidence is missing or excluded?**

Task 4.3 must expose the semantics already implemented by Task 4.2.

It must not invent new metric semantics in presentation code.

---

# 3. Product Principle

> **Historical Intelligence must be inspectable, not merely displayed.**

A number without its evidence boundary is insufficient.

The UI must communicate both:

```text
what DayFrame knows
```

and:

```text
what DayFrame does not know
```

---

# 4. Relationship to the Long-Term Product Model

DayFrame's intended high-level product model remains:

```text
Planner
    Review Schedule
    Add Commitment
    Edit Commitment
    Resolve Friction

Summary
    Capacity
    Goals
    Allocations
    Progress
    Recommendations
```

Task 4.3 is the first bounded step toward the **Summary** side of that model.

However, Task 4.3 must **not** implement the final Summary information architecture.

Historical Intelligence is not automatically:

* Capacity;
* Goals;
* Progress;
* Recommendations.

This task may establish a bounded Summary/Historical Intelligence surface that can evolve into the long-term Summary architecture.

Do not force unfinished future concepts into the UI.

---

# 5. Governing Task 4.1 and 4.2 Decisions

Treat these as accepted architecture:

1. HistoricalPlan is the sole planned-history authority.
2. ExecutionHistory is the sole observed-history authority.
3. Historical Intelligence is derived.
4. HistoricalMetricPolicy V1 governs Completion Distribution V1.
5. Only effective scheduled occurrences enter the completion denominator.
6. Unplaced, omitted, and blocked are excluded from Completion Distribution.
7. Completed, partial, skipped, unknown, and not reported are distinct.
8. Partial is not fractionally weighted.
9. Unknown is not failure.
10. Not reported is not failure.
11. Retraction produces unknown.
12. Missing HistoricalPlan coverage is not zero work.
13. Published-empty is known zero work.
14. Zero denominator is not 0%.
15. Current-outcome coverage and plan coverage are different concepts.
16. Current Active does not reinterpret historical evidence.
17. Frozen HistoricalPlan context explains historical occurrences.
18. Source incarnation remains part of exact identity.
19. Results carry deterministic provenance.
20. Historical Intelligence remains non-persisted.
21. No Goals exist yet.
22. No Progress semantics exist yet.
23. No recommendation policy exists yet.
24. No automatic learning exists yet.
25. No composite/adherence score is authorized.

The UI must faithfully render these semantics.

---

# 6. Execution Artifact Rules

Before implementation:

1. verify this Task 4.3 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 4.1 result;
   * Task 4.2 result;
   * Phase 4 checkpoint;
   * current `CURRENT_STATE.md`;
   * current `ROADMAP.md`;
   * existing app shell/navigation;
   * current Planner/Preview surfaces;
   * existing historical reporting UI;
   * existing Outcome Summary UI;
   * `completionDistribution.ts`;
   * `historicalIntelligenceQuery.ts`;
   * DayFrame store Historical Intelligence API;
   * relevant design-system/components/styles;
   * existing accessibility patterns;
6. do not modify the immutable Task 4.3 artifact during execution.

Create:

`docs/implementation/phase-4/TASK_4.3_HISTORICAL_INTELLIGENCE_EXPLANATION_DRILL_DOWN_AND_BOUNDED_UI_INTEGRATION_RESULT.md`

---

# 7. Initial UI Architecture Audit

Before writing UI code, map the current product surfaces.

Determine:

* current top-level navigation;
* whether a Summary concept already exists;
* whether Historical Reporting already has a user-facing location;
* whether Outcome Summary is embedded in another workflow;
* how dates/ranges are currently selected;
* how cards/panels/sections are structured;
* how loading, unavailable, empty, and error states are represented;
* how responsive layouts are handled;
* how expandable detail is handled;
* what existing visual language should be reused.

Do not redesign unrelated surfaces.

---

# 8. UI Placement Decision

Determine the smallest architecturally appropriate place to expose Historical Intelligence.

Preferred direction:

> Establish a bounded **Summary** surface if the current shell can support it without broad navigation redesign.

Possible initial shape:

```text
Planner
Summary
```

with Summary initially containing only implemented truthful content.

If introducing a top-level Summary surface would require disproportionate shell/navigation redesign, use the narrowest existing location that preserves the future migration path.

Document the decision.

---

# 9. No Fake Summary Sections

If Summary is introduced, do not add empty production sections merely because the long-term model contains:

```text
Capacity
Goals
Allocations
Progress
Recommendations
```

Only expose functionality that exists.

A sparse truthful Summary is preferable to placeholder product architecture.

---

# 10. Primary Historical Intelligence View

The initial view should communicate, in order:

1. selected historical period;
2. HistoricalPlan coverage;
3. Completion Distribution;
4. current-outcome reporting coverage;
5. evidence limitations;
6. drill-down access.

The exact visual hierarchy may adapt to existing DayFrame UI conventions.

---

# 11. Historical Window Control

Provide a bounded way to select the historical query window.

At minimum the UI must produce an explicit:

```text
startUserDayDate
endUserDayDate
evaluationAsOf
```

for the existing Task 4.2 query.

The UI may provide convenience presets such as:

```text
Last 7 days
Last 30 days
```

only if those presets are resolved outside the pure projection into explicit deterministic dates.

Do not add relative-window semantics to the core metric.

---

# 12. Default Historical Window

Choose a conservative useful default based on current product conventions.

A likely candidate is:

> Last 7 completed user-days

or:

> Last 7 days including today

But do not assume.

Audit existing date semantics and choose deliberately.

Record the decision.

---

# 13. Evaluation Cutoff

The UI may normally evaluate HistoricalPlan using the current explicit query time resolved by the application layer.

Do not hide the fact that the underlying projection has an explicit cutoff.

The user does not necessarily need to edit `evaluationAsOf` in V1.

Do not build historical execution-belief-as-of controls.

---

# 14. Loading State

Historical Intelligence queries may involve asynchronous HistoricalPlan authority.

Provide a clear loading state.

Do not temporarily display stale prior-window values as though they describe the newly selected window unless explicitly marked.

---

# 15. Query Race Safety

If the user changes the historical range while an earlier asynchronous query is still running:

* old results must not overwrite the newer selection;
* loading state must correspond to the active query;
* errors must correspond to the active query.

Use existing cancellation/request-identity conventions if available.

Do not introduce a new global async framework solely for this task.

---

# 16. Plan Coverage Presentation

The UI must distinguish:

```text
complete
incomplete
unavailable
```

plan coverage.

Do not collapse these into a generic success/error indicator.

---

# 17. Complete Coverage

For complete plan coverage, communicate that DayFrame has HistoricalPlan authority for every requested user-day.

Avoid overexplaining when unnecessary.

Example conceptual language:

> Plan history available for all 7 days.

Exact copy should follow current product voice.

---

# 18. Incomplete Coverage

For incomplete plan coverage, communicate:

* known-day results are still shown;
* one or more requested days lack authoritative HistoricalPlan coverage;
* displayed counts therefore describe known plan history only.

The UI must not imply that missing days had zero commitments.

---

# 19. Missing-Day Disclosure

Provide a way to inspect which user-day dates are missing.

This may be:

* inline text for a small number;
* expandable detail;
* drill-down panel.

Do not require a complex visualization.

---

# 20. Unavailable Coverage

When the entire requested window lacks HistoricalPlan authority:

Do not show a zero-work success state.

Communicate that DayFrame does not have authoritative plan history for the selected period.

Completion Distribution should not masquerade as a five-category zero result.

---

# 21. Published-Empty Explanation

When appropriate, distinguish:

> DayFrame knows there were no planned occurrences on this covered day.

from:

> DayFrame has no plan history for this day.

The user need not see the internal term `publishedEmpty` unless it is good product language.

---

# 22. Completion Distribution Presentation

Present the five implemented categories:

```text
Completed
Partial
Skipped
Unknown
Not reported
```

Canonical values must come directly from Task 4.2.

Do not recalculate categories in the component.

---

# 23. Counts First

Counts are the canonical V1 presentation.

Example conceptual shape:

```text
Completed      5
Partial        2
Skipped        1
Unknown        1
Not reported   3
```

Do not make a percentage the dominant presentation.

---

# 24. Visual Distribution

A simple visual distribution is permitted if it improves comprehension.

Examples:

* horizontal segmented bar;
* compact bars;
* proportional strip.

Requirements:

* counts remain available;
* the visualization must not imply value judgment;
* categories must not rely on color alone;
* unknown/not-reported must remain visibly distinct;
* zero denominator must not render a misleading empty 0% chart.

Do not build a charting subsystem.

---

# 25. Color Semantics

Audit existing DayFrame color semantics.

Do not automatically map:

```text
completed = green
skipped = red
```

if that creates a moralized success/failure framing inconsistent with product semantics.

If color is used:

* labels and counts remain primary;
* accessibility contrast must pass existing standards;
* meaning must survive without color.

---

# 26. Partial Presentation

Partial must remain its own category.

Do not visually place it halfway between completed and skipped in a way that implies an authorized 50% value.

---

# 27. Unknown Presentation

User-facing explanation should convey:

> A previous observation existed, but the current observation was withdrawn/retracted.

Do not label unknown as:

* failed;
* missing;
* skipped.

Use terminology consistent with existing correction/retraction UI.

---

# 28. Not-Reported Presentation

Explain:

> No current execution report exists for this scheduled occurrence.

Do not call this:

* missed;
* failed;
* incomplete;
* ignored.

---

# 29. Skipped Presentation

Skipped means only that current effective execution evidence is `skipped`.

Do not invent a reason.

If no reason authority exists, do not display one.

---

# 30. Current-Outcome Coverage Presentation

Expose the Task 4.2 coverage concept separately from Completion Distribution.

It answers:

> For how many eligible scheduled occurrences does DayFrame currently have a classified completed/partial/skipped outcome?

It does not measure success.

Avoid ambiguous labels such as:

```text
Completion rate
Adherence
Success
```

Preferred conceptual language:

```text
Reporting coverage
Outcome coverage
Execution reporting coverage
```

Choose final language based on UI audit.

---

# 31. Coverage Counts

Prefer:

```text
8 of 12 scheduled occurrences have a current reported outcome
```

over:

```text
67% adherence
```

A percentage may be secondary if useful and semantically safe.

It is not required.

---

# 32. Unknown and Coverage

The UI should make understandable why `unknown` does not count toward current-outcome coverage:

> DayFrame knows a report was withdrawn, so it no longer has a classified current outcome.

Do not overwhelm the default view with this explanation; drill-down/help text is appropriate.

---

# 33. Zero Eligible Occurrences

When the selected known plan window has zero eligible scheduled occurrences:

Present a truthful not-applicable state.

Example conceptual message:

> No scheduled occurrences are available for completion analysis in this period.

Do not show:

```text
0% complete
100% complete
0% reporting
```

---

# 34. Incomplete Window Metric Presentation

When plan coverage is incomplete:

* counts over known history may still be shown;
* visibly qualify the result;
* do not present a window-wide percentage without qualification;
* drill-down must reveal missing dates.

The limitation must be near enough to the metric that the user cannot reasonably mistake the result for complete-window evidence.

---

# 35. Limitations Presentation

Map Task 4.2 machine-readable limitations to user-facing explanations.

At minimum handle:

```text
incompletePlanCoverage
noPlanCoverage
zeroEligibleOccurrences
protectedHistoricalAuthority
executionHistoryQuarantined
```

or the exact implemented taxonomy.

Do not expose raw internal enum strings.

---

# 36. Protected Authority

If historical authority is protected/recovery-required:

* do not show partial metric results as valid;
* explain that historical information is temporarily unavailable/protected;
* preserve existing recovery behavior;
* do not provide a UI bypass.

---

# 37. Quarantine

If the Task 4.2 projection is unavailable because ExecutionHistory contains quarantine:

Present a conservative unavailable state.

Do not expose quarantined raw data in Historical Intelligence UI.

Do not imply that the user failed to report.

---

# 38. Drill-Down Purpose

The drill-down exists to answer:

> Why is this number what it is?

It is not a second historical editing workflow.

---

# 39. Category Drill-Down

Allow the user to inspect occurrences contributing to each distribution category.

At minimum:

```text
Completed
Partial
Skipped
Unknown
Not reported
```

Selecting a category should reveal the deterministic provenance entries already supplied by Task 4.2.

---

# 40. Drill-Down Occurrence Content

For each contributing occurrence, display only useful frozen historical context available from provenance.

Likely fields:

* title;
* user-day date;
* category;
* source family where useful;
* scheduled time where available;
* outcome classification.

Do not display internal IDs by default.

---

# 41. Frozen Context

All historical occurrence labels/context must come from Task 4.2 provenance/HistoricalPlan snapshots.

Do not look up current Active to render old occurrences.

---

# 42. Source Recreation

The UI must not merge or relabel occurrences merely because a current commitment has the same source ID/title.

Historical lifetime identity remains intact.

The UI does not need to display incarnation UUIDs.

---

# 43. Correction Explanation

For an occurrence whose effective outcome is the result of correction:

If existing provenance exposes enough information safely, indicate that the displayed classification reflects the current corrected outcome.

Do not reconstruct correction chains in the component.

A full revision-history viewer is outside Task 4.3 unless an existing component can be reused trivially.

---

# 44. Retraction Explanation

For `unknown`, explain the retracted/withdrawn current observation using existing semantics.

Do not turn the drill-down into an editor.

---

# 45. Excluded Plan Occurrences

Provide bounded explanation for effective HistoricalPlan occurrences excluded from Completion Distribution:

```text
unplaced
omitted
blocked
```

They need not occupy the primary distribution.

A secondary expandable section such as:

> Not included in completion analysis

is appropriate.

---

# 46. Exclusion Language

Explain exclusions neutrally.

Examples conceptually:

```text
Unplaced
DayFrame did not have a scheduled placement for this occurrence.

Omitted
This occurrence was omitted from the effective historical plan.

Blocked
This occurrence was blocked from placement.
```

Use actual domain semantics discovered in code.

Do not invent blame or cause.

---

# 47. No Scheduling Realization Metric

Showing excluded occurrences for explanation does **not** authorize computing:

```text
Scheduling success: 82%
```

Scheduling Realization remains a separate future projection.

---

# 48. Missing-Day Drill-Down

If plan coverage is incomplete, provide a bounded way to see missing dates.

Do not create fake occurrence rows for missing days.

---

# 49. Evidence Summary

The UI should make the evidence basis legible.

A compact conceptual structure:

```text
Plan history
7 of 7 days available

Scheduled occurrences
12

Current reported outcomes
8 of 12
```

Then:

```text
Completed      5
Partial        2
Skipped        1
Unknown        1
Not reported   3
```

This is an example, not prescribed copy/layout.

---

# 50. No Universal Score

Do not combine the above into:

```text
DayFrame Score: 74
```

or any equivalent composite.

---

# 51. No Adherence Percentage

Do not label any ratio:

```text
Adherence
```

Task 4.1 intentionally avoided that term for V1.

---

# 52. No Progress Language

Do not call Completion Distribution:

```text
Progress
```

Progress requires future Goal semantics.

---

# 53. No Goal Language

Do not imply:

> You achieved your goal.

No Goal authority exists.

---

# 54. No Recommendation Language

Do not turn observations into advice such as:

> Schedule fewer workouts.

> Move errands to Tuesday.

> Reduce your workload.

Recommendation policy does not yet exist.

---

# 55. No Causal Language

Do not say:

> You skipped this because you worked more.

Historical Intelligence V1 does not support causal inference.

---

# 56. No Motivational Judgment

Avoid:

* Great job;
* Poor performance;
* You fell behind;
* You're doing better;
* You're inconsistent.

Task 4.3 presents evidence.

---

# 57. Empty Historical State

If no historical plan authority exists yet, provide an appropriate first-use empty state.

It may explain that Historical Intelligence becomes available as DayFrame accumulates published schedule history.

Do not frame this as an error if the state is legitimate first-use behavior.

---

# 58. Historical Range With No Scheduled Occurrences

This is distinct from first-use/no-history.

The UI should make the difference clear:

```text
history exists, but no eligible scheduled occurrences
```

versus:

```text
DayFrame lacks historical plan authority
```

---

# 59. Responsiveness

The Summary/Historical Intelligence experience must work at the existing supported desktop/mobile widths.

Drill-down must not require a wide table.

Prefer stacked/list presentation where necessary.

---

# 60. Accessibility

At minimum:

* semantic headings;
* keyboard-accessible controls;
* visible focus;
* proper button semantics;
* accessible disclosure controls;
* category meaning not encoded only by color;
* useful accessible names for any visual distribution;
* status/async updates announced where existing app patterns support it;
* no inaccessible hover-only explanation.

---

# 61. Date Control Accessibility

Date/range controls must be keyboard usable and labelled.

Do not introduce a custom calendar widget if native/existing controls are sufficient.

---

# 62. Drill-Down Accessibility

If using:

* accordion;
* disclosure;
* modal;
* drawer;

follow existing accessible project patterns.

Do not implement an ad hoc clickable `div`.

---

# 63. State Ownership

Historical Intelligence UI state may include:

* selected window;
* loading;
* active result;
* selected drill-down category;
* disclosure state.

This is UI/query state.

It is not historical authority.

Do not persist it unless an existing harmless UI preference convention clearly warrants it.

Default: do not persist.

---

# 64. No Metric Cache

Do not add a persistent metric cache.

If component-level memoization is useful, it must remain disposable and reproducible.

---

# 65. Store Boundary

Use the Task 4.2 governed store/query method.

Do not bypass it to independently read HistoricalPlan/ExecutionHistory in components.

Presentation code must not recreate projection logic.

---

# 66. Error Boundary

Handle:

* invalid query;
* protected authority;
* quarantined authority;
* unexpected query failure;

according to existing app error conventions.

Do not convert an error into an empty successful metric.

---

# 67. Refresh Semantics

Determine how the Summary refreshes after relevant historical authority changes.

At minimum audit:

* new execution report;
* correction;
* retraction;
* historical publication/republication;
* restore;
* full clear.

Prefer explicit re-query/subscription integration over stale metric storage.

Do not add new authority.

---

# 68. Live Update Scope

Task 4.3 does not require a complex reactive analytics engine.

If existing store subscriptions naturally allow re-query after authority change, use them.

Otherwise provide a bounded refresh mechanism and document the limitation.

Do not build speculative infrastructure.

---

# 69. Full Clear

After full clear, the visible Historical Intelligence surface must cease showing stale pre-clear results.

A fresh query should show the correct no-history/unavailable state.

Add regression coverage.

---

# 70. Restore

After successful Backup V3 restore, a fresh Historical Intelligence query must display the restored derived result.

No metric-specific restore behavior is permitted.

Add integration coverage where practical.

---

# 71. Current Active Independence

Changing current authored commitments must not alter displayed historical occurrence context for unchanged historical authority.

Do not accidentally introduce current Active lookup through UI decoration.

---

# 72. Existing Historical Reporting

Audit whether the existing Historical Reporting UI duplicates any information now exposed by Summary.

Do not remove or rewrite it in this task unless necessary for correctness.

Record overlap for later consolidation.

---

# 73. Existing Outcome Summary

Audit how Outcome Summary relates to Completion Distribution.

Do not silently replace one with the other.

Outcome Summary may serve a different workflow/time horizon.

Document the relationship.

---

# 74. Navigation Naming

If adding a top-level destination, prefer product language over implementation language.

Strong candidate:

> **Summary**

Avoid exposing:

> Historical Intelligence Engine

as primary navigation.

Within Summary, a section may use terms such as:

* History;
* Recent history;
* Completion;
* Scheduled outcomes.

Choose after auditing existing vocabulary.

---

# 75. No Placeholder Navigation

Do not add disabled:

```text
Goals
Progress
Recommendations
```

navigation merely to preview future work.

---

# 76. Visual Hierarchy

The most important facts should be understandable without drill-down:

1. period;
2. whether plan history is complete;
3. how many scheduled occurrences are eligible;
4. categorical outcome distribution;
5. how much current execution reporting exists.

Details belong below.

---

# 77. Explanation Copy

Keep explanatory copy concise.

The UI should not reproduce architecture terminology unnecessarily.

For example, the user generally does not need:

```text
DurableOccurrenceReference
HistoricalMetricPolicy V1
```

Those belong in code/provenance, not ordinary product copy.

---

# 78. Policy Identity

The UI does not need to display policy version by default.

But it must consume the governed result rather than reconstructing it.

If future export/debug surfaces need policy identity, preserve it in the result.

---

# 79. Metric Identity

Likewise, metric identity need not appear visually.

Do not strip it from the underlying result.

---

# 80. Drill-Down Sorting

Use Task 4.2 deterministic provenance ordering.

Do not independently sort by current source title or arbitrary UI state unless explicitly user-selected.

---

# 81. Optional User Sorting

Do not add sorting/filtering controls unless clearly necessary.

The first drill-down should be simple.

---

# 82. No Search Yet

Do not add historical occurrence search.

---

# 83. No Category Filtering Yet

Do not add grouped/category metrics or filters merely because provenance contains category.

---

# 84. No Source Filtering Yet

Do not add source-based analytics.

---

# 85. No Comparison Mode

Do not add:

* compare weeks;
* compare categories;
* compare periods.

---

# 86. No Trend Charts

Do not add time-series trends.

Task 4.2 provides one-window distribution, not trend semantics.

---

# 87. No Calendar Heatmap

Do not infer day-level performance from Completion Distribution.

---

# 88. No Streaks

Do not add streaks.

No streak semantics have been defined.

---

# 89. No Gamification

Do not add:

* badges;
* scores;
* grades;
* achievements.

---

# 90. Testing Strategy

Tests must validate semantics at the UI boundary, not merely snapshots.

Prefer behavioral assertions.

At minimum test:

* navigation/placement;
* default query;
* explicit range query;
* loading;
* query race protection if asynchronous;
* complete coverage;
* incomplete coverage;
* missing dates disclosure;
* unavailable coverage;
* published-empty/zero denominator;
* all five outcome categories;
* outcome coverage;
* drill-down category selection;
* frozen historical context;
* excluded occurrence explanation;
* protected authority;
* quarantine;
* full clear stale-result prevention;
* restore re-query where practical;
* correction/retraction refresh where practical;
* accessibility semantics.

---

# 91. Do Not Duplicate Core Tests

Do not retest the entire Completion Distribution algorithm through UI.

Core Task 4.2 tests already own:

* conservation;
* exact joins;
* correction classification;
* republication cutoff;
* clone isolation;
* deterministic ordering.

UI tests should prove correct rendering/interaction of governed results.

Add integration tests only where wiring itself is at risk.

---

# 92. Test Fixtures

Reuse Task 4.2 golden semantic fixtures where practical.

Do not create contradictory UI-only semantics.

---

# 93. Suggested UI Fixtures

At minimum include:

### Fixture A — Complete evidence

```text
7/7 plan days
5 scheduled
2 completed
1 partial
1 skipped
1 not reported
```

### Fixture B — Incomplete plan history

```text
5/7 plan days
missing two dates
known scheduled evidence still displayed
```

### Fixture C — No eligible scheduled occurrences

```text
7/7 plan days
published history
0 scheduled
notApplicable
```

### Fixture D — No plan history

```text
0/7 plan days
unavailable
```

### Fixture E — Unknown/retracted

At least one occurrence classified unknown.

### Fixture F — Planner exclusions

At least one unplaced/omitted/blocked occurrence available in explanatory detail.

---

# 94. Accessibility Tests

Where the current test stack supports it, assert:

* headings/landmarks;
* labelled range controls;
* buttons by accessible role/name;
* disclosures with expanded state;
* category drill-down keyboard operability;
* status text available to assistive technology.

Do not add a major accessibility dependency solely for this task unless clearly justified.

---

# 95. Visual Regression

If the project already has screenshot/visual regression infrastructure, add bounded coverage.

If not, do not introduce one solely for Task 4.3.

---

# 96. No New Persistence

Do not change:

* IndexedDB version;
* localStorage authority keys;
* Backup V3;
* HistoricalPlan version;
* ExecutionHistory version.

A need for any of these is a stop-condition issue.

---

# 97. No Domain Events

Viewing Historical Intelligence must not emit domain events.

Changing a date range is not historical authority.

Opening drill-down is not historical authority.

---

# 98. No New Identifiers

Do not allocate durable IDs for:

* metric results;
* UI sessions;
* drill-down rows.

Existing historical identities are sufficient.

---

# 99. Performance

Avoid unnecessary repeated full-history queries.

Use the bounded Task 4.2 query.

Do not add caching unless measurement demonstrates a need.

---

# 100. Privacy

Historical Intelligence remains local.

Do not add:

* telemetry;
* analytics reporting;
* cloud processing;
* remote metric storage.

---

# 101. Stop Conditions

Stop and report if:

* the current app shell cannot host a bounded Summary/History surface without a broad navigation rewrite;
* Task 4.2 result lacks enough provenance to explain classifications;
* missing dates cannot be surfaced reliably;
* UI would need current Active to label historical occurrences;
* protected/quarantined states cannot be distinguished from empty results;
* async query composition permits stale results that cannot be safely bounded without architectural work;
* displaying Task 4.2 results requires recomputing metric semantics in UI;
* current Outcome Summary semantics materially conflict with Completion Distribution;
* current Historical Reporting semantics create an unavoidable contradictory user-facing truth;
* implementation requires new persistence, Backup fields, domain versions, or historical authority.

Do not patch around semantic conflicts in presentation code.

---

# 102. Required UI State Matrix

Produce:

| Projection state                  | Primary UI | Distribution | Drill-down | User-facing meaning |
| --------------------------------- | ---------- | ------------ | ---------- | ------------------- |
| complete coverage + eligible      |            |              |            |                     |
| incomplete coverage + eligible    |            |              |            |                     |
| complete coverage + zero eligible |            |              |            |                     |
| unavailable plan coverage         |            |              |            |                     |
| protected authority               |            |              |            |                     |
| execution quarantine              |            |              |            |                     |
| query loading                     |            |              |            |                     |
| query error                       |            |              |            |                     |

---

# 103. Required Outcome Presentation Matrix

Produce:

| Projection category | User-facing label | Primary count? | Drill-down? | Must not imply |
| ------------------- | ----------------- | -------------: | ----------: | -------------- |
| completed           |                   |                |             |                |
| partial             |                   |                |             |                |
| skipped             |                   |                |             |                |
| unknown             |                   |                |             |                |
| notReported         |                   |                |             |                |

---

# 104. Required Explanation Matrix

Produce:

| Evidence/provenance state | Explanation behavior |
| ------------------------- | -------------------- |
| eligible scheduled        |                      |
| unplaced                  |                      |
| omitted                   |                      |
| blocked                   |                      |
| missing plan day          |                      |
| published-empty day       |                      |
| corrected outcome         |                      |
| retracted outcome         |                      |
| no execution subject      |                      |
| source recreated          |                      |

---

# 105. Required Product-Boundary Matrix

Produce:

| Capability                    | Task 4.3 |
| ----------------------------- | -------- |
| Historical coverage UI        |          |
| Completion Distribution UI    |          |
| Outcome coverage UI           |          |
| Category drill-down           |          |
| Missing-day explanation       |          |
| Planner-exclusion explanation |          |
| Summary foundation            |          |
| Scheduling Realization metric |          |
| Planned Allocation metric     |          |
| Trends                        |          |
| Comparisons                   |          |
| Goals                         |          |
| Progress                      |          |
| Recommendations               |          |
| Learning                      |          |
| Composite score               |          |
| Persistent metrics            |          |

Use:

* Implemented;
* Bounded foundation;
* Deferred;
* Prohibited by task.

---

# 106. Required Architectural Invariant Assessment

Classify at least:

1. UI consumes governed Task 4.2 projection.
2. UI does not recompute completion semantics.
3. HistoricalPlan remains planned-history authority.
4. ExecutionHistory remains observed-history authority.
5. Historical Intelligence remains derived.
6. UI state is not historical authority.
7. Metrics remain non-persisted.
8. Complete/incomplete/unavailable plan coverage remain distinct.
9. Published-empty is not missing.
10. Missing plan history is not zero work.
11. Completed remains categorical.
12. Partial remains categorical.
13. Partial receives no fractional UI weighting.
14. Skipped remains categorical.
15. Unknown remains distinct.
16. Not reported remains distinct.
17. Unknown is not failure.
18. Not reported is not failure.
19. Zero denominator is not displayed as 0%.
20. Outcome coverage is not labeled adherence/success.
21. Counts remain primary.
22. Provenance supports category drill-down.
23. Excluded planner states remain outside Completion Distribution.
24. Excluded planner states are not framed as user failure.
25. Frozen historical context supplies historical labels.
26. Current Active does not decorate/reinterpret historical occurrences.
27. Source recreation does not merge historical identity.
28. Protected authority is not displayed as empty history.
29. Quarantine is not displayed as not-reported evidence.
30. Stale async query results cannot overwrite newer selection.
31. Full clear cannot leave stale historical metric UI.
32. Restore requires no metric restore.
33. Viewing metrics emits no domain events.
34. No new historical IDs are allocated.
35. No Scheduling Realization metric is introduced.
36. No Planned Allocation metric is introduced.
37. No trend semantics are introduced.
38. No comparison semantics are introduced.
39. No Goal semantics are introduced.
40. No Progress semantics are introduced.
41. No Recommendation semantics are introduced.
42. No learning is introduced.
43. No composite/adherence score is introduced.
44. UI remains accessible without color-only meaning.
45. Mobile layout remains usable.
46. Existing Historical Reporting remains semantically valid.
47. Existing Outcome Summary remains semantically valid or any overlap is explicitly documented.

Use:

* Confirmed;
* Implemented;
* Covered by test;
* Deferred;
* Unsupported;
* Stop-condition violation.

---

# 107. Files and Placement

Follow the current repository's established UI organization.

Potential responsibilities may include:

```text
Summary surface/container
Historical Intelligence presentation components
Historical range controls
Completion Distribution presentation
coverage presentation
drill-down/disclosure components
UI tests
```

Do not create unnecessary abstraction layers.

Prefer a small number of cohesive components over a generic analytics component library.

---

# 108. Naming

Use product language in UI and architecture-specific language in code where appropriate.

Potential product terms:

```text
Summary
History
Plan history
Scheduled outcomes
Reporting coverage
Details
```

Audit actual project vocabulary before finalizing.

Avoid:

```text
Historical Intelligence Engine
Metric Policy V1
Denominator
Numerator
```

in ordinary user-facing copy.

---

# 109. Validation

Before completion, run at minimum:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Also run focused Task 4.3 UI/integration tests and record results.

If the project has an established manual browser verification workflow, perform it for:

* desktop;
* narrow/mobile viewport;
* complete history;
* incomplete history;
* zero eligible;
* unavailable history;
* drill-down interaction.

Record what was actually checked.

---

# 110. No Unrelated Cleanup

Do not address unrelated Phase 3/4 debt unless required for correctness.

The existing Vite chunk advisory remains non-blocking unless Task 4.3 materially worsens it.

---

# 111. Governance

On successful completion, update minimally:

* Task 4.3 result artifact;
* Phase 4 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Create an ADR only if Task 4.3 makes a genuinely new architectural decision not already governed by Task 4.1/4.2.

If Summary becomes a new top-level product surface, an ADR or product-architecture decision record may be warranted.

---

# 112. Required Result Artifact

Create:

`docs/implementation/phase-4/TASK_4.3_HISTORICAL_INTELLIGENCE_EXPLANATION_DRILL_DOWN_AND_BOUNDED_UI_INTEGRATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 4.1/4.2 Prerequisite Confirmation
4. Initial UI Architecture Audit
5. UI Placement Decision
6. Files Changed
7. Navigation/Surface Integration
8. Historical Window Selection
9. Default Window Decision
10. Evaluation Cutoff
11. Async Query Lifecycle
12. Race Protection
13. Plan Coverage Presentation
14. Complete Coverage
15. Incomplete Coverage
16. Missing-Day Disclosure
17. Unavailable Coverage
18. Published-Empty/Zero-Eligible State
19. Completion Distribution Presentation
20. Completed
21. Partial
22. Skipped
23. Unknown
24. Not Reported
25. Current-Outcome Coverage
26. Limitations
27. Protected Authority
28. Quarantine
29. Category Drill-Down
30. Occurrence Explanation
31. Frozen Historical Context
32. Correction/Retraction Explanation
33. Excluded Planner States
34. Missing-Day Explanation
35. Summary/Product Relationship
36. Existing Historical Reporting Relationship
37. Existing Outcome Summary Relationship
38. Responsive Behavior
39. Accessibility
40. State Ownership
41. Refresh Semantics
42. Full Clear
43. Restore
44. Current Active Independence
45. Persistence/Backup Boundary
46. Performance
47. Privacy
48. Tests Added/Changed
49. Focused Validation
50. Full Validation
51. Manual UI Validation
52. Governance Updates
53. Deviations
54. Discoveries/Deferred Work
55. UI State Matrix
56. Outcome Presentation Matrix
57. Explanation Matrix
58. Product-Boundary Matrix
59. Architectural Invariant Assessment
60. Stop-Condition Assessment
61. Architectural Alignment Assessment
62. Recommended Next Task
63. Final Completion Determination

---

# 113. Completion Criteria

Task 4.3 is complete only when:

* the existing Task 4.2 governed projection is exposed through a bounded user-facing experience;
* the UI placement aligns with DayFrame's long-term Planner/Summary direction without pretending unfinished Summary capabilities exist;
* the user can select or use a clearly defined historical window;
* relative UI presets, if present, resolve into explicit Task 4.2 query dates outside the pure projection;
* asynchronous queries cannot overwrite newer selections with stale results;
* complete, incomplete, and unavailable HistoricalPlan coverage are visibly distinct;
* published-empty history is not confused with missing history;
* missing plan dates can be inspected;
* Completion Distribution displays completed, partial, skipped, unknown, and not-reported as distinct categories;
* counts remain the primary representation;
* no category receives unauthorized fractional weighting;
* current-outcome/reporting coverage is clearly distinguished from success/adherence;
* zero eligible scheduled occurrences produce a truthful not-applicable state;
* incomplete historical windows visibly disclose their limitation;
* protected/quarantined authority cannot masquerade as empty or not-reported history;
* users can drill into the provenance behind each distribution category;
* drill-down uses frozen historical context and does not query current Active for historical explanation;
* unplaced, omitted, and blocked occurrences can be explained without entering the Completion Distribution denominator;
* missing plan days are not represented as fake occurrences;
* correction/retraction semantics remain faithful to the governed projection;
* current Active mutation/recreation cannot retarget or relabel unchanged historical evidence;
* full clear cannot leave stale Historical Intelligence visible;
* restore requires no metric-specific payload or restore behavior;
* no new persistence, historical authority, durable ID, domain event, Backup field, or schema version is introduced;
* the experience remains usable at supported desktop and mobile widths;
* controls and drill-down are keyboard accessible and category meaning does not depend on color alone;
* existing Historical Reporting and Outcome Summary remain semantically valid, with any overlap documented rather than silently rewritten;
* no Scheduling Realization, Planned Allocation, trend, comparison, Goal, Progress, Recommendation, learning, composite score, adherence score, streak, heatmap, or gamification behavior is introduced;
* focused behavioral tests pass;
* canonical lint, typecheck, test, build, and diff validation pass;
* manual UI verification is recorded where project workflow supports it;
* governance accurately describes the bounded product integration;
* no stop condition remains unresolved.

---

# 114. Recommended Next Task

Do not pre-authorize the next metric.

Task 4.3 should first determine how well the implemented Historical Intelligence model works as an actual product surface.

After 4.3, perform a bounded review of the resulting Summary experience and choose between likely directions such as:

```text
Scheduling Realization
Planned Allocation
additional explanation/UX refinement
Summary architecture refinement
```

The next task must be chosen from actual 4.3 findings rather than assumed in advance.

---

# 115. Final Implementation Principle

> **DayFrame should never make the user guess what a historical number means or how much evidence exists behind it.**

The purpose of Task 4.3 is not merely to put Task 4.2 on a screen.

It is to make the first Historical Intelligence result understandable enough that the user can inspect DayFrame's reasoning and distinguish observation from uncertainty.

---

# 116. Final Completion Statement

**Task 4.3 is complete when DayFrame exposes the governed Historical Coverage and Completion Distribution V1 projection through a bounded, accessible, responsive user-facing experience aligned with the long-term Planner/Summary product model; when the selected historical period, plan-coverage state, eligible scheduled count, categorical completed/partial/skipped/unknown/not-reported distribution, and current-outcome reporting coverage can be understood without reducing the result to an adherence, productivity, progress, or success score; when complete, incomplete, unavailable, published-empty, zero-eligible, protected, and quarantined states are presented as semantically different conditions; when missing historical dates and planner-excluded unplaced/omitted/blocked occurrences can be inspected without being converted into fake failures or fake zero-demand evidence; when category drill-down traces displayed counts to deterministic Task 4.2 provenance using frozen historical context rather than current Active state; when correction, retraction, no-report, and source-incarnation semantics remain faithful to the implemented projection; when asynchronous range changes cannot expose stale results, full clear cannot leave stale historical intelligence visible, and Backup V3 restore naturally reproduces the display from restored historical authority without metric persistence; when viewing or interacting with the Summary creates no new historical authority, domain event, durable ID, Backup field, storage schema, Goal, Progress, Recommendation, learning rule, trend, comparison, scheduling-realization metric, allocation metric, composite score, streak, heatmap, or gamification behavior; when the resulting surface remains usable on supported desktop and mobile layouts and accessible through semantic structure, keyboard controls, visible focus, and non-color-only meaning; when existing Historical Reporting and Outcome Summary remain truthful and any product overlap is explicitly documented; when focused UI/integration regression coverage and canonical repository validation pass; when manual UI verification is recorded where supported; when governance accurately records the bounded Summary/Historical Intelligence integration; and when the result recommends the next Phase 4 task from the actual product and architectural findings rather than assuming another metric in advance.**
