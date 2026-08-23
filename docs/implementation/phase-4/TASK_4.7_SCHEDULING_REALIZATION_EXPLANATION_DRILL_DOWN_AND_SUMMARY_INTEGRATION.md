# Task 4.7 — Scheduling Realization Explanation, Drill-Down, and Summary Integration

## Status

Ready for implementation.

## Phase

Phase 4 — Historical Intelligence

## Task Type

Bounded Historical Intelligence presentation, explanation, provenance drill-down, Summary integration, accessibility, responsive behavior, and regression coverage.

---

# 1. Context

Task 4.6 completed Scheduling Realization Projection V1.

The governed projection answers:

> **What happened to intended historical work during planning?**

It classifies every eligible intended occurrence from effective HistoricalPlan authority exactly once as:

```text
scheduled
unplaced
omitted
blocked
```

The projection established:

* HistoricalPlan as its sole authority;
* explicit HistoricalMetricPolicy V1;
* explicit inclusive historical user-day range;
* explicit `evaluationAsOf`;
* canonical HistoricalPlan as-of publication selection;
* shared Task 4.2 HistoricalPlan coverage semantics;
* exact intended-occurrence denominator conservation;
* frozen historical provenance;
* exact source-incarnation identity;
* deterministic ordering;
* clone isolation;
* current Active independence;
* Preview independence;
* ExecutionHistory independence;
* Backup V3/restore derivation rather than persistence;
* no causal explanation beyond the frozen disposition itself.

Task 4.6 intentionally added no Summary UI.

Task 4.7 now integrates that already-governed projection into the read-only Summary experience.

---

# 2. Existing Summary Model

Tasks 4.2–4.5 established the existing historical Summary path.

Summary currently presents historical understanding including:

* HistoricalPlan coverage;
* Scheduled Outcomes / Completion Distribution;
* reporting coverage;
* evidence drill-down;
* truthful complete/incomplete/unavailable states.

Task 4.5 clarified the broader product boundary:

```text
Planner-side operational work
    → author
    → generate/review
    → resolve
    → report
    → correct/retract

Summary
    → inspect derived understanding
```

Summary remains read-only.

Task 4.7 must preserve that boundary.

---

# 3. New Summary Story

After Task 4.7, Summary should expose two distinct historical questions:

```text
PLANNING

Scheduling Realization
"What happened to intended work while DayFrame built the schedule?"

    Scheduled
    Unplaced
    Omitted
    Blocked


EXECUTION

Scheduled Outcomes
"What was reported after work reached the schedule?"

    Completed
    Partial
    Skipped
    Unknown
    Not reported
```

These are peer analytical projections.

They are not stages of one score.

They must not be mathematically collapsed into one success/failure measure.

---

# 4. Purpose

Integrate Scheduling Realization V1 into Summary so that a user can understand:

1. how much intended historical work reached the schedule;
2. how much remained unplaced;
3. how much was omitted;
4. how much was blocked;
5. how complete the historical planning evidence is;
6. which frozen historical occurrences produced each count;
7. what DayFrame knows;
8. what DayFrame does not know.

The UI must preserve the projection's epistemic boundaries.

---

# 5. Governing Principle

> **Summary may explain the historical disposition DayFrame recorded. It must not invent why that disposition occurred.**

Task 4.6 established that HistoricalPlan contains no truthful durable reason for the four planning states.

Therefore Summary may say:

> 3 intended occurrences were blocked.

It must not say:

> 3 occurrences were blocked because your schedule was too full.

Likewise:

```text
scheduled ≠ completed
unplaced ≠ skipped
omitted ≠ failed
blocked ≠ user failure
```

---

# 6. Execution Artifact Rules

Before implementation:

1. verify this Task 4.7 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 4.1 result;
   * Task 4.2 result;
   * Task 4.3 result;
   * Task 4.4 result;
   * Task 4.5 result;
   * Task 4.6 result;
   * Phase 4 checkpoint;
   * `CURRENT_STATE.md`;
   * `ROADMAP.md`;
   * `CHANGELOG.md`;
   * Scheduling Realization V1 projection;
   * Completion Distribution projection;
   * shared HistoricalPlan coverage resolver;
   * historical intelligence query/store contracts;
   * `HistoricalIntelligenceSummary`;
   * existing Scheduled Outcomes UI;
   * existing evidence drill-down;
   * existing Summary range controls;
   * relevant responsive styles;
   * relevant accessibility behavior/tests;
6. do not modify the immutable Task 4.7 artifact during execution.

Create:

`docs/implementation/phase-4/TASK_4.7_SCHEDULING_REALIZATION_EXPLANATION_DRILL_DOWN_AND_SUMMARY_INTEGRATION_RESULT.md`

---

# 7. Initial Integration Audit

Before changing code, verify:

* how Summary currently obtains its historical range;
* how `evaluationAsOf` is resolved;
* how Completion Distribution is queried;
* how plan coverage is presented;
* how Scheduled Outcomes are presented;
* how evidence drill-down is activated;
* how drill-down focus behaves after Task 4.5;
* how incomplete and unavailable plan coverage is shown;
* how published-empty ranges are represented;
* how protected HistoricalPlan authority is surfaced;
* how narrow/mobile Summary layout behaves.

If current implementation materially contradicts the Task 4.6 result or this integration model, stop.

---

# 8. Projection Consumption

Task 4.7 must consume the canonical Task 4.6 Scheduling Realization query.

Do not reimplement:

* denominator rules;
* state classification;
* plan coverage;
* cutoff resolution;
* provenance construction;
* deterministic ordering.

The UI renders governed results.

It does not calculate them independently.

---

# 9. Shared Query Window

Scheduling Realization and Scheduled Outcomes shown together in Summary must use the same resolved historical query window.

That means the same:

```text
startUserDayDate
endUserDayDate
evaluationAsOf
HistoricalMetricPolicy V1
```

for a single Summary evaluation.

Do not allow visually adjacent projections to silently describe different periods.

---

# 10. Evaluation Cutoff Consistency

The two projections must use the same `evaluationAsOf` when presented as part of the same Summary history view.

This preserves a coherent historical snapshot.

Do not resolve separate wall-clock cutoffs independently for each card.

---

# 11. Summary Information Architecture

The preferred conceptual hierarchy is:

```text
Summary

History
│
├── Historical range / coverage
│
├── Planning
│   └── Scheduling Realization
│       ├── Scheduled
│       ├── Unplaced
│       ├── Omitted
│       └── Blocked
│
└── Execution
    └── Scheduled Outcomes
        ├── Completed
        ├── Partial
        ├── Skipped
        ├── Unknown
        └── Not reported
```

The exact visual layout should follow current Summary conventions.

Do not perform a broad Summary redesign.

---

# 12. Planning / Execution Distinction

The UI must make the two questions visibly distinct.

Strong conceptual labels:

### Planning

> **Scheduling realization**

Helper text should explain that this describes how intended work appeared in the historical plan.

### Execution

> **Scheduled outcomes**

Helper text should explain that this describes what was reported for work that had been scheduled.

Exact copy may be refined during implementation.

The distinction must remain obvious.

---

# 13. Scheduling Realization Heading

Preferred product-facing heading:

> **Scheduling realization**

If implementation evidence shows another existing term is materially clearer and consistent, document the change.

Do not use:

* success rate;
* planning success;
* scheduling efficiency;
* adherence;
* capacity utilization.

---

# 14. Scheduling Realization Explanation

Provide concise explanatory copy.

Conceptually:

> Shows how intended work was represented in the historical schedule.

or:

> Shows what happened to intended work while DayFrame built the schedule.

Do not claim causation.

Do not imply user performance.

---

# 15. Scheduled Category

Present:

> **Scheduled**

Meaning:

> DayFrame stored a time placement for the intended occurrence.

Do not imply:

* completed;
* successful;
* followed;
* executed.

---

# 16. Unplaced Category

Present:

> **Unplaced**

Meaning:

> The intended occurrence remained without a scheduled placement.

Do not say:

* missed;
* skipped;
* failed;
* rejected.

---

# 17. Omitted Category

Present:

> **Omitted**

Meaning only what the frozen HistoricalPlan state establishes.

Because Task 4.6 found no durable reason, do not explain why it was omitted.

Do not label it failure.

---

# 18. Blocked Category

Present:

> **Blocked**

Meaning only:

> the historical planning disposition was blocked.

Do not attribute the block to:

* work;
* sleep;
* another commitment;
* insufficient capacity;
* user choice;
* scheduler failure

unless future historical authority explicitly supports that claim.

---

# 19. Counts First

Scheduling Realization V1 should present counts as the primary values.

Example:

```text
Scheduled   14
Unplaced     3
Omitted      1
Blocked      2
```

Do not introduce a percentage as the primary Summary representation.

---

# 20. No Realization Score

Do not calculate or display:

```text
14 / 20 = 70% scheduling success
```

Task 4.6 explicitly did not define such a score.

Task 4.7 must not create one in presentation code.

---

# 21. Intended Occurrence Count

It is permissible to display the governed:

> intended occurrence count

if doing so helps explain the distribution.

Potential language:

> 20 intended occurrences in known plan history.

Do not use the denominator to create a performance score.

---

# 22. Distribution Conservation

The UI must consume the projection such that:

```text
intended occurrences
=
scheduled
+ unplaced
+ omitted
+ blocked
```

Do not filter a category out of the visible distribution while still presenting the full denominator without explanation.

---

# 23. Complete Plan Coverage

When plan coverage is complete, Scheduling Realization may describe the entire selected historical range.

Use the existing Summary coverage model.

Do not create a second plan-coverage indicator solely for this metric unless necessary for local comprehension.

---

# 24. Shared Plan Coverage Presentation

Because Scheduling Realization and Scheduled Outcomes both depend on HistoricalPlan coverage, prefer one clear Summary-level plan coverage presentation rather than redundant competing coverage cards.

However, each metric may locally reference coverage limitations where needed.

Do not imply that execution reporting coverage and plan coverage are the same thing.

---

# 25. Incomplete Plan Coverage

When plan coverage is incomplete:

* show known Scheduling Realization counts;
* disclose that some selected dates lack plan history;
* preserve explicit missing dates through existing drill-down/coverage UI where supported;
* do not extrapolate.

Potential language:

> Based on available plan history. Some selected dates are missing.

Do not say the distribution describes the entire range.

---

# 26. Unavailable Plan Coverage

When the selected range has no HistoricalPlan authority:

Scheduling Realization is unavailable.

Do not show:

```text
Scheduled 0
Unplaced 0
Omitted 0
Blocked 0
```

as though those were known historical facts.

Use an explicit unavailable state.

---

# 27. Published-Empty Range

If plan coverage is complete but there are zero intended occurrences:

Scheduling Realization is:

> not applicable / no intended occurrences

not unavailable.

Potential product language:

> No intended occurrences were recorded for this range.

Do not display 0% or 100%.

---

# 28. Mixed Published-Empty Days

Published-empty days improve plan coverage without increasing the intended-occurrence denominator.

The UI must not imply that those days are missing.

---

# 29. Missing vs Empty

Preserve:

```text
published empty
    = DayFrame knows there were zero intended occurrences

missing
    = DayFrame lacks authoritative plan history
```

This distinction must survive Summary integration.

---

# 30. Evidence Drill-Down

Each Scheduling Realization category must support provenance drill-down where it contains occurrences.

The user should be able to inspect which frozen historical occurrences contributed to:

* Scheduled;
* Unplaced;
* Omitted;
* Blocked.

---

# 31. Drill-Down Purpose

The drill-down answers:

> **Which historical occurrences produced this count?**

It does not answer:

> **Why did this happen?**

That distinction is mandatory.

---

# 32. Drill-Down Fields

Use governed Task 4.6 provenance.

Where available, display:

* historical user-day;
* frozen title;
* frozen category;
* source family where useful;
* planning disposition;
* scheduled start/end for Scheduled;
* other frozen state-specific plan data supported by the provenance.

Do not query current Active for display labels.

---

# 33. Durable Identity

The exact `DurableOccurrenceReference` remains the canonical identity.

It need not be shown as raw technical text to the user.

But UI keys and selection logic must not collapse recreated source incarnations.

---

# 34. Scheduled Drill-Down

For Scheduled occurrences, display historical scheduled timing where already present in governed provenance.

Do not display ExecutionHistory outcome as part of Scheduling Realization drill-down unless clearly separated as a different analytical concern.

Default: do not add it.

---

# 35. Unplaced Drill-Down

For Unplaced occurrences, show frozen occurrence context.

Do not invent a missing scheduled time.

Do not fabricate a reason.

---

# 36. Omitted Drill-Down

For Omitted occurrences, show frozen occurrence context and the omission disposition.

Do not invent:

* omitted by user;
* omitted because of conflict;
* omitted because low priority.

---

# 37. Blocked Drill-Down

For Blocked occurrences, show frozen occurrence context and blocked disposition.

Do not reconstruct friction or infer cause.

---

# 38. No Current Active Lookup

Historical labels in drill-down must remain frozen.

If the current commitment has been:

* renamed;
* recategorized;
* deleted;
* recreated;

the historical evidence remains unchanged.

---

# 39. No ExecutionHistory Join

Task 4.7 should not join ExecutionHistory into Scheduling Realization drill-down merely because both projections appear on the same Summary page.

Keep each projection explainable from its own governed inputs.

---

# 40. Scheduled Outcomes Preservation

Task 4.7 must not change Completion Distribution semantics.

Preserve:

```text
Completed
Partial
Skipped
Unknown
Not reported
```

and all Task 4.2 eligibility rules.

---

# 41. Scheduled Outcomes Placement

It is acceptable to adjust visual grouping/heading so Scheduled Outcomes clearly appears under an Execution concept.

Do not rewrite the projection.

---

# 42. Reporting Coverage

Reporting coverage remains associated with Scheduled Outcomes / execution evidence.

Do not attach reporting coverage to Scheduling Realization.

---

# 43. Plan Coverage

Plan coverage applies to the selected historical evidence and therefore supports both projections.

Keep its meaning distinct from reporting coverage.

---

# 44. Cross-Metric Explanation

Where useful, provide one short explanation that distinguishes the projections.

Conceptually:

> Scheduling realization describes how intended work entered the plan. Scheduled outcomes describe what was reported afterward for work that reached the schedule.

Avoid excessive instructional copy.

---

# 45. No Funnel Visualization

Do not build a funnel such as:

```text
20 intended
↓
14 scheduled
↓
10 completed
```

That presentation can imply a single conversion/performance pipeline and obscures the different denominators and unknown-reporting states.

Keep the projections separate.

---

# 46. No Combined Score

Do not create:

* overall realization;
* plan effectiveness;
* execution effectiveness;
* adherence;
* productivity score;
* success score.

---

# 47. No Cross-Metric Arithmetic

Do not compute:

```text
completed / intended
```

or:

```text
scheduled + completed
```

or any other combined planning/execution metric.

That would be a new metric requiring separate governance.

---

# 48. No Capacity Interpretation

Do not label unplaced/blocked counts as:

* capacity exceeded;
* over capacity;
* insufficient capacity.

Scheduling placement is not yet human-capacity inference.

---

# 49. No Recommendations

Do not produce advice such as:

> You should reduce your commitments.

Task 4.7 remains descriptive.

---

# 50. No Goals / Progress

Do not reinterpret Scheduling Realization as Goal progress.

Do not create a Progress section.

---

# 51. No Trends

Do not add:

* previous-period comparison;
* arrows;
* percentage changes;
* trend lines.

---

# 52. No Category Comparison

Do not compare categories or sources.

Example prohibited additions:

> Work was blocked more often than Recovery.

That is a future projection.

---

# 53. No Learning

Viewing or querying Summary must not modify future schedule generation.

---

# 54. No Causal Language

Do not use phrases such as:

* because your schedule was full;
* due to work;
* because there was no time;
* caused by conflicts.

Task 4.6 established that HistoricalPlan does not persist such reasons.

---

# 55. Read-Only Boundary

Summary remains read-only.

Do not add:

* Report outcome;
* Correct;
* Withdraw;
* Generate;
* Regenerate;
* Move;
* Omit;
* Resolve friction

to Scheduling Realization drill-down.

---

# 56. Operational Escape Hatches

Do not add navigation from historical evidence directly into mutable current Planner/Preview occurrences unless a governed historical-to-current mapping already exists.

Default: historical evidence remains inspect-only.

---

# 57. Query State

Task 4.7 may maintain transient UI state for:

* selected category;
* expanded detail;
* local disclosure;
* focus management.

Do not persist this state.

---

# 58. No New Authority

No Summary UI state becomes authority.

No new durable product state.

---

# 59. No New Persistence

Do not change:

* localStorage;
* IndexedDB;
* Backup V3;
* HistoricalPlan format;
* ExecutionHistory format;
* Active;
* Profiles;
* PlanDecision.

---

# 60. No New IDs

Do not allocate durable IDs for:

* metric cards;
* drill-down;
* UI rows;
* disclosures.

---

# 61. No Domain Events

Viewing Scheduling Realization emits no domain events.

Opening drill-down emits no domain events.

---

# 62. Backup V3 Boundary

Backup V3 remains authority-only.

Scheduling Realization UI state and derived output are not backed up.

---

# 63. Restore Boundary

After restore:

```text
HistoricalPlan authority
    ↓
Scheduling Realization re-derived
    ↓
Summary renders restored truth
```

No Task-4.7-specific restore logic.

---

# 64. Full Clear

After full clear:

* Scheduling Realization should naturally become unavailable/no historical plan;
* no stale derived distribution should remain visible;
* no selected stale evidence row should survive authority removal.

Add regression coverage where needed.

---

# 65. Protection

If HistoricalPlan is protected/recovery-required:

* do not display Scheduling Realization counts as valid;
* use the existing protected/unavailable Summary behavior;
* do not inspect raw protected evidence.

---

# 66. Error State

A query error must remain distinct from:

* no plan history;
* incomplete plan history;
* published-empty history;
* zero intended occurrences.

Do not collapse all states into:

> No data.

---

# 67. Loading State

If Summary query composition is asynchronous, preserve truthful loading behavior.

Do not briefly render zero counts while authority is loading.

---

# 68. Accessibility — Category Controls

If category counts are interactive drill-down controls:

* use semantic buttons;
* expose category and count in the accessible name/context;
* expose selected/expanded state where appropriate;
* support keyboard activation;
* preserve visible focus.

---

# 69. Accessibility — Drill-Down Focus

Follow the bounded behavior established in Task 4.5.

Keyboard activation should make newly inserted detail discoverable without producing surprising pointer-focus jumps.

Reuse existing focus-management conventions where possible.

---

# 70. Accessibility — Headings

Planning and Execution groupings must preserve a coherent heading hierarchy.

Do not use visual styling alone to communicate the distinction.

---

# 71. Accessibility — Non-Color Meaning

Scheduled, Unplaced, Omitted, and Blocked must remain distinguishable without color.

Text labels are required.

---

# 72. Accessibility — Coverage

Incomplete/unavailable states must be communicated in text, not only icons or color.

---

# 73. Responsive Behavior

The new Scheduling Realization presentation must work at existing supported desktop and narrow/mobile widths.

Do not require horizontal scrolling for the four-category distribution.

---

# 74. Mobile Information Order

On narrow layouts preserve conceptual order:

```text
range / coverage
Planning
    Scheduling Realization
Execution
    Scheduled Outcomes
```

Do not interleave planning and execution categories.

---

# 75. Mobile Drill-Down

Evidence detail must remain readable without requiring wide tables.

Prefer existing stacked/detail patterns.

---

# 76. Visual Weight

Scheduling Realization and Scheduled Outcomes should appear as peer analytical concepts.

Do not visually imply one is the master score and the other supporting detail.

---

# 77. Existing Summary Scope

Do not use Task 4.7 to implement the full future Summary mental model:

```text
Capacity
Goals
Allocations
Progress
Recommendations
```

Only integrate the new historical projection.

---

# 78. Summary Naming

Do not rename Summary.

---

# 79. History Naming

Keep the existing Summary historical scope unless source audit identifies a small terminology correction required for clarity.

Do not restructure the entire Summary shell.

---

# 80. Performance

Task 4.7 should use the existing bounded historical query APIs.

Do not add full-database scans.

Do not query once per displayed occurrence if the governed projection already returns provenance.

---

# 81. Memoization

Do not introduce a persistent cache.

Local React memoization is acceptable only if actually needed.

Correctness must not depend on cache state.

---

# 82. Deterministic Rendering

Equivalent governed results should render equivalent content regardless of underlying authority input ordering.

Do not rely on object insertion order for evidence display.

---

# 83. Test Strategy

Test behavioral semantics, not merely snapshots.

At minimum cover:

* Scheduling Realization renders from canonical projection;
* four category counts;
* intended-occurrence count if displayed;
* complete coverage;
* incomplete coverage;
* unavailable coverage;
* published-empty / zero denominator;
* category drill-down;
* scheduled provenance;
* unplaced provenance;
* omitted provenance;
* blocked provenance;
* no fabricated reasons;
* source recreation;
* frozen historical labels;
* same Summary query window for both projections;
* same evaluation cutoff for both projections;
* Scheduled Outcomes remains unchanged;
* reporting coverage remains execution-specific;
* no combined score;
* protected HistoricalPlan;
* full clear;
* keyboard drill-down;
* responsive behavior where supported.

---

# 84. Canonical Integration Fixture

Create a Summary fixture containing:

```text
HistoricalPlan:
    scheduled = 2
    unplaced = 1
    omitted = 1
    blocked = 1

ExecutionHistory for scheduled occurrences:
    completed = 1
    skipped = 1
```

Expected conceptual display:

```text
Planning
Scheduling realization
    Scheduled   2
    Unplaced    1
    Omitted     1
    Blocked     1

Execution
Scheduled outcomes
    Completed   1
    Skipped     1
```

Do not compute:

```text
1 completed / 5 intended = 20%
```

---

# 85. Missing-Reporting Fixture

Use a scheduled occurrence with no current ExecutionHistory subject.

Expected:

```text
Scheduling Realization:
    Scheduled += 1

Scheduled Outcomes:
    Not reported += 1
```

This demonstrates the two metrics' distinct roles.

---

# 86. Skipped Fixture

Use a historically scheduled occurrence with a current skipped report.

Expected:

```text
Scheduling Realization:
    Scheduled += 1

Scheduled Outcomes:
    Skipped += 1
```

Do not reinterpret Scheduling Realization as failed.

---

# 87. Unplaced Fixture

Use an unplaced occurrence.

Expected:

```text
Scheduling Realization:
    Unplaced += 1
```

It does not enter Completion Distribution because it was not scheduled.

This is a critical regression.

---

# 88. Blocked Fixture

Use a blocked occurrence.

Expected:

```text
Scheduling Realization:
    Blocked += 1
```

No Scheduled Outcomes classification.

No reason displayed unless frozen evidence actually contains one.

---

# 89. Omitted Fixture

Use an omitted occurrence.

Expected:

```text
Scheduling Realization:
    Omitted += 1
```

No execution outcome classification.

---

# 90. Published-Empty Fixture

Complete HistoricalPlan coverage with zero intended occurrences.

Expected:

* plan history known;
* Scheduling Realization not applicable;
* no misleading zero/percentage distribution.

---

# 91. Missing-Day Fixture

Mixed known/missing range.

Expected:

* known planning counts shown;
* incomplete plan coverage disclosed;
* missing day not treated as empty;
* Scheduled Outcomes remains governed by its own eligible scheduled population.

---

# 92. Source-Recreation Fixture

Use historical evidence from two source incarnations sharing a logical source identifier.

Drill-down must preserve them as distinct historical occurrences.

---

# 93. Current Active Mutation Fixture

Change current Active labels after historical publication.

Scheduling Realization drill-down must continue showing frozen historical labels.

---

# 94. Execution Correction Fixture

Correct/retract an ExecutionHistory report.

Scheduled Outcomes may change according to Task 4.2.

Scheduling Realization must not.

This is an important cross-projection regression.

---

# 95. Republication Fixture

Change effective HistoricalPlan disposition across publication cutoff.

Both projections must use the same explicit cutoff.

Scheduling Realization should change according to the effective plan.

Completion Distribution should continue using the same effective scheduled population rules.

---

# 96. Full-Clear Fixture

After full clear:

* no stale Scheduling Realization distribution;
* no stale drill-down;
* no stale Scheduled Outcomes;
* Summary truthfully reflects unavailable historical authority.

---

# 97. Required Summary Structure Matrix

Produce:

| Summary area           | Question answered | Projection | Authority | Writable? |
| ---------------------- | ----------------- | ---------- | --------- | --------- |
| Plan coverage          |                   |            |           |           |
| Scheduling realization |                   |            |           |           |
| Scheduled outcomes     |                   |            |           |           |
| Reporting coverage     |                   |            |           |           |
| Evidence drill-down    |                   |            |           |           |

---

# 98. Required Category Semantics Matrix

Produce:

| Category  | User-facing meaning | Evidence required | Must not imply |
| --------- | ------------------- | ----------------- | -------------- |
| Scheduled |                     |                   |                |
| Unplaced  |                     |                   |                |
| Omitted   |                     |                   |                |
| Blocked   |                     |                   |                |

---

# 99. Required Cross-Projection Matrix

Produce:

| Historical occurrence state | Scheduling Realization | Scheduled Outcomes |
| --------------------------- | ---------------------- | ------------------ |
| scheduled + completed       |                        |                    |
| scheduled + partial         |                        |                    |
| scheduled + skipped         |                        |                    |
| scheduled + unknown         |                        |                    |
| scheduled + not reported    |                        |                    |
| unplaced                    |                        |                    |
| omitted                     |                        |                    |
| blocked                     |                        |                    |

This matrix should make denominator separation explicit.

---

# 100. Required Coverage Matrix

Produce:

| HistoricalPlan condition | Plan coverage | Scheduling Realization | Scheduled Outcomes implication |
| ------------------------ | ------------- | ---------------------- | ------------------------------ |
| fully published          |               |                        |                                |
| published empty          |               |                        |                                |
| partially missing        |               |                        |                                |
| entirely missing         |               |                        |                                |
| protected                |               |                        |                                |

---

# 101. Required Read/Write Matrix

Produce:

| Interaction             | Read/write | Authority touched |
| ----------------------- | ---------- | ----------------- |
| view realization        |            |                   |
| open scheduled evidence |            |                   |
| open unplaced evidence  |            |                   |
| open omitted evidence   |            |                   |
| open blocked evidence   |            |                   |
| view scheduled outcomes |            |                   |
| view reporting coverage |            |                   |

All Task-4.7 interactions should be read-only.

---

# 102. Required Epistemic Integrity Matrix

Produce:

| State               | What Summary may say | What Summary must not say |
| ------------------- | -------------------- | ------------------------- |
| scheduled           |                      |                           |
| unplaced            |                      |                           |
| omitted             |                      |                           |
| blocked             |                      |                           |
| completed           |                      |                           |
| skipped             |                      |                           |
| not reported        |                      |                           |
| published empty     |                      |                           |
| missing day         |                      |                           |
| protected authority |                      |                           |

---

# 103. Required Product-Boundary Matrix

Produce:

| Capability                                  | Task 4.7 |
| ------------------------------------------- | -------- |
| Scheduling Realization Summary presentation |          |
| planning/execution grouping                 |          |
| planning-state counts                       |          |
| planning-state drill-down                   |          |
| frozen provenance                           |          |
| plan coverage reuse                         |          |
| Scheduled Outcomes preservation             |          |
| reporting coverage preservation             |          |
| combined score                              |          |
| realization percentage                      |          |
| Capacity                                    |          |
| Planned Allocation                          |          |
| trends                                      |          |
| comparisons                                 |          |
| Goals                                       |          |
| Progress                                    |          |
| Recommendations                             |          |
| learning                                    |          |
| causal explanation                          |          |
| Summary writes                              |          |
| Planner convergence                         |          |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited by task.

---

# 104. Required Architectural Invariant Assessment

Classify at least:

1. Scheduling Realization consumes the canonical Task 4.6 projection.
2. UI does not independently classify HistoricalPlan states.
3. Scheduling Realization and Scheduled Outcomes use the same selected user-day range.
4. Both use the same evaluation cutoff when displayed together.
5. HistoricalMetricPolicy V1 remains explicit.
6. HistoricalPlan remains Scheduling Realization's sole authority.
7. ExecutionHistory remains irrelevant to Scheduling Realization classification.
8. Scheduled Outcomes semantics remain unchanged.
9. plan coverage semantics remain unchanged.
10. reporting coverage semantics remain unchanged.
11. plan coverage and reporting coverage remain distinct.
12. scheduled does not imply completed.
13. unplaced does not imply skipped.
14. omitted does not imply failure.
15. blocked does not imply user failure.
16. no planning-state cause is fabricated.
17. counts conserve intended-occurrence denominator.
18. no realization score is introduced.
19. no combined planning/execution score is introduced.
20. zero intended occurrences remain not applicable.
21. unavailable history is not rendered as zero.
22. incomplete history remains visibly incomplete.
23. published-empty remains distinct from missing.
24. drill-down is provenance, not causation.
25. frozen labels come from HistoricalPlan.
26. current Active cannot relabel evidence.
27. source incarnations remain distinct.
28. ExecutionHistory corrections cannot alter realization.
29. ExecutionHistory retractions cannot alter realization.
30. HistoricalPlan republication changes results only through canonical cutoff semantics.
31. unplaced occurrences do not enter Completion Distribution.
32. omitted occurrences do not enter Completion Distribution.
33. blocked occurrences do not enter Completion Distribution.
34. scheduled occurrences may enter Completion Distribution according to Task 4.2 rules.
35. Summary remains read-only.
36. no reporting actions are added.
37. no schedule-generation actions are added.
38. no planning mutations are added.
39. no new authority is introduced.
40. no new persistence is introduced.
41. Backup V3 is unchanged.
42. restore needs no Task-4.7 participant.
43. full clear leaves no stale derived UI.
44. protected authority is not interpreted.
45. query errors remain distinct from unavailable history.
46. loading does not masquerade as zero.
47. category drill-down is keyboard accessible.
48. inserted evidence is accessible after keyboard activation.
49. pointer interaction does not receive surprising focus movement.
50. state meaning is not color-only.
51. mobile layout preserves planning/execution grouping.
52. no horizontal distribution dependency is introduced.
53. no Capacity semantics are introduced.
54. no Planned Allocation semantics are introduced.
55. no trends are introduced.
56. no comparisons are introduced.
57. no Goals are introduced.
58. no Progress semantics are introduced.
59. no Recommendations are introduced.
60. no learning behavior is introduced.
61. no causal interpretation is introduced.
62. no adherence/productivity/composite score is introduced.
63. no Planner convergence is performed.

Use:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Unsupported;
* Stop-condition violation.

---

# 105. Stop Conditions

Stop and report if:

* Task 4.6's canonical query cannot be consumed by Summary without reimplementing classification;
* Scheduling Realization and Scheduled Outcomes cannot share one resolved Summary historical window/cutoff without changing metric semantics;
* Summary would need to mutate HistoricalPlan or ExecutionHistory;
* truthful drill-down requires current Active;
* truthful drill-down requires reconstructing historical friction;
* state reasons must be fabricated to make the UI understandable;
* plan coverage semantics must change;
* Completion Distribution semantics must change;
* a combined score becomes necessary for the proposed UI;
* integration requires new persistence;
* integration requires Backup V3 changes;
* integration requires HistoricalPlan schema changes;
* integration requires ExecutionHistory schema changes;
* full Planner migration becomes necessary;
* the Summary architecture cannot distinguish planning from execution without a broader redesign.

Do not patch around a stop condition by inventing analytical semantics.

---

# 106. Files and Placement

Follow existing Task 4.3/4.5 Summary organization.

Likely files may include:

```text
HistoricalIntelligenceSummary.tsx
historical Summary styles
Summary tests
historical intelligence store/query composition
accessibility/focus helpers where already established
governance artifacts
```

A bounded child component such as:

```text
SchedulingRealizationSection.tsx
```

is acceptable if consistent with current component organization.

Do not force all logic into the parent Summary component.

---

# 107. Dead-Code Boundary

Task 4.7 should not remove or rewrite Task 4.6 core logic.

Do not perform unrelated Summary cleanup.

Remove only code made clearly unreachable by the bounded integration, if any.

Document such removal.

---

# 108. Manual Product Walkthrough

Where the project workflow supports browser validation, verify at minimum:

### Journey A — Complete history

```text
Summary
→ select historical range
→ Planning
→ Scheduling realization
→ inspect all four counts
→ open category evidence
→ Execution
→ Scheduled outcomes
```

### Journey B — Incomplete history

```text
Summary
→ range with missing plan day
→ incomplete coverage visible
→ known realization counts remain visible
```

### Journey C — Published empty

```text
Summary
→ known empty range
→ no intended occurrences
→ not applicable rather than unavailable
```

### Journey D — Unplaced

```text
Summary
→ Scheduling realization
→ Unplaced
→ evidence
```

Verify no execution classification appears.

### Journey E — Scheduled + skipped

```text
Summary
→ Planning: Scheduled
→ Execution: Skipped
```

Verify the same historical occurrence can truthfully participate in both different projections without conflation.

### Journey F — Frozen labels

```text
publish history
→ mutate current Active
→ Summary
```

Verify historical label remains frozen.

### Journey G — Keyboard drill-down

Activate category by keyboard and verify inserted evidence is discoverable.

### Journey H — Mobile

Inspect planning/execution grouping and evidence at supported narrow width.

Record only what was actually verified.

---

# 109. Governance

On successful completion update minimally:

* Task 4.7 result artifact;
* Phase 4 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Create an ADR only if implementation introduces a genuinely new architectural decision.

The expected integration should remain governed by Task 4.1 and the existing Summary architecture.

---

# 110. Validation

Run focused Task 4.7 tests.

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
* production module count;
* build advisory if present;
* diff result.

Do not claim manual or automated validation that was not performed.

---

# 111. Required Result Artifact

Create:

`docs/implementation/phase-4/TASK_4.7_SCHEDULING_REALIZATION_EXPLANATION_DRILL_DOWN_AND_SUMMARY_INTEGRATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 4.1–4.6 Prerequisite Confirmation
4. Initial Integration Audit
5. Files Changed
6. Component Placement
7. Query Composition
8. Shared Historical Window
9. Shared Evaluation Cutoff
10. HistoricalMetricPolicy
11. Summary Information Architecture
12. Planning/Execution Distinction
13. Scheduling Realization Heading/Copy
14. Intended-Occurrence Presentation
15. Scheduled Presentation
16. Unplaced Presentation
17. Omitted Presentation
18. Blocked Presentation
19. Distribution Conservation
20. Plan Coverage Presentation
21. Complete Coverage
22. Incomplete Coverage
23. Unavailable Coverage
24. Published-Empty / Zero-Denominator State
25. Missing-vs-Empty Integrity
26. Evidence Drill-Down
27. Scheduled Provenance
28. Unplaced Provenance
29. Omitted Provenance
30. Blocked Provenance
31. Reason/Causation Boundary
32. Frozen Historical Labels
33. Source-Incarnation Safety
34. Scheduled Outcomes Preservation
35. Reporting Coverage Preservation
36. Cross-Projection Explanation
37. Cross-Projection Denominator Separation
38. Read-Only Boundary
39. Protection/Error/Loading States
40. Full Clear
41. Backup V3/Restore Boundary
42. Persistence Boundary
43. Accessibility
44. Keyboard Drill-Down
45. Responsive Behavior
46. Performance
47. Tests Added/Changed
48. Focused Validation
49. Full Validation
50. Manual Product Walkthrough
51. Governance Updates
52. Deviations
53. Discoveries
54. Deferred Work
55. Summary Structure Matrix
56. Category Semantics Matrix
57. Cross-Projection Matrix
58. Coverage Matrix
59. Read/Write Matrix
60. Epistemic Integrity Matrix
61. Product-Boundary Matrix
62. Architectural Invariant Assessment
63. Stop-Condition Assessment
64. Architectural Alignment Assessment
65. Recommended Next Task
66. Final Completion Determination

---

# 112. Completion Criteria

Task 4.7 is complete only when:

* current Summary integration assumptions have been audited against production source;
* Summary consumes the canonical Task 4.6 Scheduling Realization projection rather than reimplementing classification;
* Scheduling Realization and Scheduled Outcomes use the same selected historical user-day range and coherent evaluation cutoff when displayed together;
* HistoricalMetricPolicy V1 remains explicit and unchanged;
* Summary visibly distinguishes planning disposition from execution outcome;
* Scheduling Realization presents governed scheduled, unplaced, omitted, and blocked counts;
* any displayed intended-occurrence denominator exactly conserves those categories;
* no scheduling-realization percentage, success rate, planner score, capacity score, adherence measure, or composite score is introduced;
* Scheduled means historical placement and does not imply completion;
* Unplaced means no historical placement and does not imply skipped;
* Omitted remains a frozen disposition without invented failure/cause semantics;
* Blocked remains a frozen disposition without user blame or invented cause;
* complete, incomplete, unavailable, published-empty, and missing HistoricalPlan states remain epistemically distinct;
* incomplete plan history is disclosed without extrapolation;
* unavailable plan history is not rendered as known-zero realization;
* zero intended occurrences are presented as not applicable/no intended occurrences rather than 0% or 100%;
* plan coverage is reused rather than semantically duplicated;
* reporting coverage remains distinct and execution-specific;
* every non-empty realization category supports deterministic provenance drill-down;
* drill-down uses frozen HistoricalPlan labels/context rather than current Active;
* source incarnations remain historically distinct;
* Scheduled provenance may show governed historical placement timing;
* Unplaced/Omitted/Blocked provenance does not fabricate scheduled timing or reasons;
* drill-down explains which occurrences contributed to a count but does not claim why the disposition occurred;
* ExecutionHistory is not joined into Scheduling Realization classification or explanation;
* Scheduled Outcomes remains governed by the unchanged Task 4.2 projection;
* scheduled occurrences can participate separately in Scheduling Realization and Scheduled Outcomes without semantic conflation;
* unplaced, omitted, and blocked occurrences do not enter Completion Distribution;
* ExecutionHistory corrections/retractions may change Scheduled Outcomes where governed but cannot change Scheduling Realization;
* current Active mutation cannot relabel frozen realization evidence;
* HistoricalPlan republication affects both projections only through canonical as-of semantics;
* Summary remains read-only;
* no Report, Correct, Withdraw, Generate, Regenerate, Move, Omit, or friction-resolution action is introduced;
* no new authority, persistence, Backup field, restore participant, durable identifier, or domain event is introduced;
* full clear leaves no stale derived realization or drill-down state;
* protected HistoricalPlan is not interpreted;
* query errors, unavailable history, incomplete history, zero denominator, and loading remain distinct states;
* category drill-down is keyboard accessible;
* keyboard activation makes inserted evidence discoverable without surprising pointer-focus movement;
* planning/execution distinction is conveyed semantically rather than through color alone;
* responsive/mobile layout preserves conceptual grouping and readable evidence;
* no funnel, combined arithmetic, Capacity inference, Planned Allocation, trend, comparison, Goal, Progress, Recommendation, learning behavior, causal interpretation, adherence score, productivity score, or composite score is introduced;
* no full Planner convergence is performed;
* focused integration/regression/accessibility tests pass;
* canonical lint, typecheck, full tests, build, and diff validation pass;
* manual product walkthrough is recorded where supported;
* governance accurately records the second Summary Historical Intelligence projection;
* no unresolved stop condition remains.

---

# 113. Recommended Next Task

Do **not** automatically assume another Historical Intelligence metric should follow.

If Task 4.7 completes successfully, perform a bounded roadmap/product-architecture review to determine whether the highest-value next move is:

### Path A — Planner Convergence V1

Begin the long-planned convergence:

```text
Setup + Preview
      ↓
    Planner
```

with the intended responsibilities:

* Review Schedule;
* Add Commitment;
* Edit Commitment;
* Resolve Friction;
* contextual operational reporting.

### Path B — Continue Historical Intelligence

Only if the roadmap audit establishes that another Summary projection provides greater immediate product value.

Potential future projections remain:

* Planned Allocation;
* bounded historical comparisons;
* later Capacity-related analysis after its semantics are explicitly governed.

Do not implement either path inside Task 4.7.

---

# 114. Final Implementation Principle

> **Planning history and execution history describe different parts of the same lived schedule, but they remain different evidence.**

Summary should help the user understand both without pretending they are one score.

---

# 115. Final Completion Statement

**Task 4.7 is complete when DayFrame integrates the canonical Scheduling Realization V1 projection into the read-only Summary History experience as a clearly identified planning-disposition analysis alongside, but semantically independent from, the existing Scheduled Outcomes execution analysis; when both projections use one coherent selected historical user-day range, explicit evaluation cutoff, and HistoricalMetricPolicy V1 while retaining their different authorities and denominators; when Scheduling Realization presents the exact governed scheduled, unplaced, omitted, and blocked counts and any intended-occurrence total conserves those categories without introducing a percentage, success rate, capacity interpretation, adherence measure, or composite score; when Summary explains that Scheduled means a historical placement rather than completion, Unplaced means intended work remained without placement rather than being skipped, and Omitted and Blocked are frozen planning dispositions for which no unsupported cause, failure, blame, or historical friction reconstruction is invented; when complete, incomplete, unavailable, published-empty, missing, zero-denominator, protected, error, and loading states remain epistemically distinct; when the existing HistoricalPlan coverage semantics are reused and reporting coverage remains a separate execution-evidence concept; when every non-empty planning category provides deterministic read-only provenance drill-down identifying the frozen historical occurrences behind its count, using exact historical identity and frozen labels rather than current Active state, while explaining classification without pretending to explain causation; when source recreation cannot collapse historical identity; when Scheduled Outcomes remains governed by the unchanged Task 4.2 Completion Distribution projection; when scheduled occurrences may truthfully appear in both planning and execution projections according to their separate questions while unplaced, omitted, and blocked occurrences never enter Completion Distribution; when ExecutionHistory correction or retraction can affect Scheduled Outcomes where governed but cannot alter Scheduling Realization; when HistoricalPlan republication affects results only through canonical as-of selection at the shared cutoff; when Summary remains wholly read-only and adds no reporting, correction, retraction, generation, scheduling, friction-resolution, or other authority mutation; when no new authority, persistence schema, Backup V3 content, restore participant, durable identifier, domain event, cache dependency, metric persistence, funnel, combined arithmetic, human-capacity claim, Planned Allocation metric, trend, comparison, Goal, Progress model, Recommendation, learning behavior, causal interpretation, adherence score, productivity score, or full Planner migration has been introduced; when keyboard, focus, heading, non-color, coverage, drill-down, responsive, mobile, clear, restore, protection, and frozen-provenance behavior remain accessible and truthful; when focused semantic and integration tests and the canonical lint, typecheck, full test, production build, and diff validation all pass; when the supported manual product walkthrough is recorded; when governance accurately records Scheduling Realization as the second governed Summary Historical Intelligence projection; and when no unresolved stop condition remains.**
