# Task 4.5 — Clarify Planner/Preview Navigation, Outcome Scope, and Operational Reporting Responsibilities V1

## Status

Ready for implementation.

## Phase

Phase 4 — Historical Intelligence

## Task Type

Bounded product-UX refinement, navigation responsibility cleanup, operational-reporting clarification, terminology correction, accessibility refinement, responsive regression coverage, and governance alignment.

---

# 1. Context

Task 4.4 completed the post-Task-4.3 audit of DayFrame's Setup, Preview, Summary, Outcome Summary, Historical Reporting, execution-reporting, and historical-analysis surfaces.

Its determination was:

> **Product Architecture Determination B — Coherent with bounded refinement.**

The underlying authority and analytical architecture is sound.

The primary remaining problem is not domain semantics.

It is product-surface responsibility and vocabulary.

The audit established the current implementation model:

```text
Setup
    authors durable planning inputs

Preview
    generates/reviews a draft schedule
    resolves friction
    reports current occurrence outcomes
    reports from frozen historical plan evidence
    summarizes execution reports
    edits/corrects/retracts ExecutionHistory

Summary
    reads derived Historical Intelligence
    displays plan coverage
    displays scheduled outcomes
    displays execution reporting coverage
    provides read-only evidence drill-down
```

The intended long-term product direction remains:

```text
Planner
    Review Schedule
    Add Commitment
    Edit Commitment
    Resolve Friction
    operational reporting where contextually appropriate

Summary
    derived understanding
```

Task 4.4 found that this direction remains supported, but three product problems should be corrected before adding another Historical Intelligence projection.

First, current top-level navigation mixes destinations with a command:

```text
Setup
Generate Preview
Summary
```

`Setup` and `Summary` navigate.

`Generate Preview` saves/generates and then navigates.

These are not semantic peers.

Second, Preview now carries substantially more responsibility than its name communicates. It is both the schedule-review workspace and the current home of several operational reporting workflows.

Third, Preview's report-centric aggregate and Summary's HistoricalPlan-denominated Scheduled Outcomes projection are semantically different but visually and linguistically similar enough to create unnecessary ambiguity.

Task 4.5 performs the smallest implementation necessary to clarify those boundaries.

---

# 2. Purpose

Make DayFrame's existing product structure more coherent without performing the full Planner migration.

After Task 4.5, the user should be able to understand:

> **Where do I go to work with my schedule?**

> **Where do I tell DayFrame what happened?**

> **Where do I correct something I previously reported?**

> **Where do I go to understand historical results?**

The application should stop teaching the user that schedule generation itself is a peer navigation destination.

It should also stop presenting two differently governed historical/report aggregates in language that makes them appear interchangeable.

---

# 3. Governing Product Boundary

Task 4.5 should reinforce this bounded V1 distinction:

```text
Operational planning/reporting
    → author intent
    → generate/review schedule
    → resolve friction
    → report reality
    → correct/retract reported reality

Summary
    → inspect derived understanding
```

Summary remains read-only.

This is not a permanent prohibition against future actions from Summary.

It is the correct boundary for the capabilities that exist now.

---

# 4. Explicit Non-Goal: Full Planner Migration

Task 4.5 must **not** fully merge Setup and Preview into a new Planner architecture.

Do not attempt to implement the complete future model:

```text
Planner
    Review Schedule
    Add Commitment
    Edit Commitment
    Resolve Friction
```

That remains a later product-architecture task.

Task 4.5 may make the current operational path more Planner-like.

It must not perform the complete structural migration.

---

# 5. Governing Task 4.4 Findings

Treat the following Task 4.4 conclusions as accepted:

1. Setup is ongoing authoring, not merely initial configuration.
2. Setup already constitutes the authoring half of the future Planner.
3. Preview is an operative draft-schedule workspace.
4. Preview also carries operational reporting responsibilities accumulated during Phase 3.
5. Setup + Preview together cover the currently implemented Planner responsibilities.
6. Summary is a truthful read-only analytical destination.
7. Summary should remain read-only for now.
8. Preview's report-centric aggregate and Summary's Scheduled Outcomes are genuinely different calculations.
9. They should not be semantically consolidated.
10. Their current visible vocabulary is insufficiently distinct.
11. Broad historical aggregate interpretation belongs in Summary.
12. Current-schedule reporting may remain operational context.
13. Reporting an outcome belongs to operational workflows.
14. Correcting/retracting reports belongs to operational reporting/history.
15. Reporting from frozen plan history is a write workflow, not historical analysis.
16. Contextual Report Outcome controls beside occurrences are useful duplication and should remain.
17. Current top-level navigation mixes destinations and commands.
18. Navigation should become destination-oriented.
19. Generate/Regenerate should become explicit operational actions.
20. The Planner/Summary two-surface direction remains supported.
21. Another metric should wait until this bounded refinement is complete.

---

# 6. Execution Artifact Rules

Before implementation:

1. verify this Task 4.5 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 4.1 result;
   * Task 4.2 result;
   * Task 4.3 result;
   * Task 4.4 result;
   * Phase 4 checkpoint;
   * `CURRENT_STATE.md`;
   * `ROADMAP.md`;
   * `CHANGELOG.md`;
   * `DayFrameApp.tsx`;
   * `SetupScreen.tsx`;
   * `PreviewScreen.tsx`;
   * `ExecutionReportControl`;
   * `ExecutionSummarySection`;
   * `HistoricalPlanReportingSection`;
   * `ExecutionHistoryPanel`;
   * `HistoricalIntelligenceSummary`;
   * current navigation styles/components;
   * relevant responsive styles;
   * relevant UI tests;
6. do not modify the immutable Task 4.5 artifact during execution.

Create:

`docs/implementation/phase-4/TASK_4.5_CLARIFY_PLANNER_PREVIEW_NAVIGATION_OUTCOME_SCOPE_AND_OPERATIONAL_REPORTING_RESPONSIBILITIES_V1_RESULT.md`

---

# 7. Initial Implementation Audit

Before changing code, verify Task 4.4's findings against current production source.

Confirm at minimum:

* Setup navigation behavior;
* Generate Preview behavior;
* Summary navigation behavior;
* how Preview opens when no Preview exists;
* how stale Preview behaves;
* where generation/regeneration controls currently live;
* whether Preview can already be navigated to independently of generation;
* where `ExecutionSummarySection` renders;
* where `HistoricalPlanReportingSection` renders;
* where `ExecutionHistoryPanel` renders;
* current visible headings/copy;
* current responsive order;
* current test assumptions about navigation labels.

If current source materially contradicts Task 4.4, stop and report.

---

# 8. Navigation Goal

Top-level navigation should represent **destinations**, not mix destinations and commands.

The current model:

```text
Setup
Generate Preview
Summary
```

must be refined.

The exact final labels must be chosen from implementation evidence and current product structure.

Do not perform a full shell redesign.

---

# 9. Preferred Bounded Navigation Direction

The preferred bounded result is conceptually:

```text
Setup
Preview
Summary
```

or an equally clear destination-oriented equivalent.

`Preview` should navigate to the operational schedule workspace.

It should not automatically regenerate merely because the user navigates there.

Generation becomes an explicit action.

---

# 10. Do Not Rename Preview to Planner Yet

Although Task 4.4 concluded that Preview should eventually become part of Planner, Task 4.5 must not prematurely rename the entire destination to `Planner` unless source inspection proves the bounded change can truthfully support that label without implying functionality that has not been integrated.

Default:

> retain `Preview` as the destination label for Task 4.5.

The full Planner migration remains deferred.

---

# 11. Preview Without Generated Schedule

The Preview destination must remain useful and truthful when no current Preview exists.

Do not make navigation conditional on generation.

If no Preview exists, the destination should explain that no current schedule draft has been generated and offer the appropriate generation action.

Operational reporting functionality that does not require a current Preview may remain accessible.

---

# 12. Generate Action

Provide an explicit schedule-generation action within the operational workflow.

The action should communicate what it does.

Potential product language:

```text
Generate Preview
Generate Schedule
Generate Schedule Preview
```

Choose based on existing semantics.

Do not call the generated artifact authoritative if it remains a derived Preview.

---

# 13. Regenerate Action

When a Preview already exists or becomes stale, provide an explicit regenerate action where appropriate.

Potential language:

```text
Regenerate Preview
Generate Updated Preview
```

Prefer language consistent with existing stale-preview copy.

Do not silently regenerate on navigation.

---

# 14. Save Semantics

Audit the current coupling between:

```text
Save Setup
Generate Preview
```

Task 4.4 confirmed that the current Generate Preview path saves the Setup draft before generation.

Preserve intended authored-state semantics.

Do not accidentally change whether unsaved Setup edits are persisted before generation.

If generation from Preview cannot safely preserve current behavior without broader state restructuring, keep the smallest safe generation entry point and document the limitation.

---

# 15. Setup Generation Entry Point

It is acceptable for Setup to retain a contextual:

> Generate Preview

action after authored changes.

That action is a command inside the authoring workflow.

It should no longer masquerade as top-level destination navigation.

---

# 16. Preview Generation Entry Point

Preview may also expose:

* Generate Preview when none exists;
* Regenerate Preview when stale/current.

Do not duplicate generation logic.

Use the existing governed store/application path.

---

# 17. Stale Preview Semantics

Preserve the existing invariant:

> authored Setup changes do not silently regenerate Preview.

A stale Preview remains visible with truthful stale-state messaging until the user explicitly regenerates.

Task 4.5 must not weaken this behavior.

---

# 18. Preview Product Purpose

Clarify the Preview surface as the current operational schedule-review workspace.

The visible hierarchy should prioritize:

1. schedule status;
2. generation/regeneration state;
3. schedule review;
4. friction/resolution;
5. contextual reporting;
6. operational reporting/history.

Do not perform a broad layout redesign.

---

# 19. Reporting Responsibilities

Preview may continue to host operational reporting during this bounded phase.

However, distinguish:

```text
report what happened
```

from:

```text
understand historical patterns
```

The former remains operational.

The latter belongs in Summary.

---

# 20. Contextual Occurrence Reporting

Preserve `Report outcome` controls beside appropriate current schedule occurrences.

Task 4.4 found this placement useful and coherent.

Do not remove them merely to centralize reporting.

---

# 21. Past Planned Occurrence Reporting

Preserve the ability to report an outcome against frozen HistoricalPlan evidence.

This remains an important operational workflow.

But its user-facing name should be clarified.

Current:

> Report from plan history

Preferred conceptual direction:

> Report a past planned occurrence

or another plain-language equivalent supported by the UI audit.

Avoid architecture-heavy wording.

---

# 22. Past Reporting Explanation

The section should make clear that it is for:

> recording what happened to something DayFrame previously had planned.

It is not:

* historical analysis;
* Summary;
* a report generator;
* editing HistoricalPlan.

Keep explanation concise.

---

# 23. Execution History Naming

Audit the heading `Execution history`.

Task 4.4 recommends naming this around user purpose.

Strong candidate:

> **Report history**

because the section contains current reports and immutable revisions and supports correction/retraction.

Choose the clearest truthful term after source inspection.

Do not rename underlying domain types.

---

# 24. Correction and Retraction

Preserve existing correction and retraction semantics exactly.

The UI may improve discoverability through heading/copy changes.

Do not:

* rewrite revision semantics;
* mutate old revisions;
* bypass governed ExecutionHistory APIs;
* alter retraction meaning.

---

# 25. Preview Aggregate Problem

Task 4.4 found that Preview's `Reported outcomes` aggregate is semantically valid but product-confusing.

It:

* summarizes current ExecutionHistory subjects;
* may be date-filtered by Preview dates;
* does not require membership in current Preview;
* has no HistoricalPlan denominator;
* collapses retracted known subjects into its not-reported-like category;
* visually overlaps Summary's plan-denominated Scheduled Outcomes.

This ambiguity must be resolved in Task 4.5.

---

# 26. Preferred Aggregate Resolution

Preferred direction:

> Remove the broad Preview `Reported outcomes` aggregate from the primary operational surface if Summary now provides the appropriate historical aggregate experience.

Do **not** delete the underlying execution-summary logic solely because the component is removed from Preview.

It may remain useful to tests, current-schedule coverage, or future operational UI.

---

# 27. Alternative Aggregate Resolution

If implementation audit shows that removing the aggregate would eliminate important current-schedule operational information, replace it with a narrowly scoped presentation that answers only a current operational question.

For example:

> **Current schedule reporting**

with explicit denominator/scope.

It must not resemble Summary's historical Scheduled Outcomes distribution.

Document why retention was necessary.

---

# 28. Aggregate Stop Condition

If Preview's aggregate is relied upon by an important workflow that cannot be separated without changing ExecutionHistory or projection semantics, stop and report.

Do not invent new analytical semantics merely to keep a card.

---

# 29. Summary Historical Aggregate

Do not materially change Summary's Task 4.3 Scheduled Outcomes projection during Task 4.5.

Its semantics remain governed by Task 4.2.

Only small copy refinements needed to distinguish it from operational reporting are permitted.

---

# 30. Summary Remains Read-Only

Do not add:

* Report outcome;
* Correct;
* Retract;
* scheduling mutations

to Summary drill-down.

Summary remains an analytical surface.

---

# 31. Scope Language

Introduce enough product copy to distinguish four concepts:

```text
current schedule draft
past planned schedule
report history
selected Summary history
```

Do not overload the UI with explanation.

Use headings/subheadings/helper copy where needed.

---

# 32. Current Schedule Language

Where Preview refers to its generated schedule, use language that reinforces:

> this is the current generated schedule draft/Preview.

Do not imply HistoricalPlan.

---

# 33. Past Planned Schedule Language

Where the user reports from frozen HistoricalPlan evidence, prefer plain language such as:

> past planned schedule

over exposing:

> HistoricalPlan

in ordinary product copy.

---

# 34. Report History Language

Where the user inspects/corrects/retracts ExecutionHistory, use language that conveys:

> reports you previously made and their revision history.

Do not imply that this is the same thing as Summary History.

---

# 35. Summary History Language

Summary's History should continue to communicate:

> derived understanding from what DayFrame had planned and what was reported.

It should not become an editing destination.

---

# 36. "Not Reported" Consistency

Task 4.4 identified the largest epistemic terminology conflict:

* Summary `Not reported` means an eligible scheduled occurrence has no current ExecutionHistory subject;
* Preview aggregate's analogous bucket can include withdrawn/retracted known subjects.

Task 4.5 must prevent these two states from appearing under confusingly identical product language.

Preferred solution:

* remove the ambiguous Preview aggregate; or
* rename/restructure its operational state so withdrawn reports are not presented as equivalent to Summary `Not reported`.

Do not change underlying ExecutionHistory semantics.

---

# 37. Unknown/Retraction Consistency

Where retracted reports remain visible operationally, use language consistent with:

> report withdrawn

or existing correction/retraction terminology.

Do not reinterpret a retraction as:

* skipped;
* failed;
* never reported.

---

# 38. Reporting Coverage

If current-schedule reporting coverage remains visible in Preview, its scope must be explicit.

For example conceptually:

> 4 of 6 reportable occurrences in this current Preview have an outcome report.

Summary's coverage remains scoped to the selected historical range.

Do not label either:

> adherence.

---

# 39. No Historical Metric Changes

Task 4.5 must not change:

* Completion Distribution categories;
* eligibility;
* plan coverage;
* reporting coverage semantics;
* provenance;
* evaluation cutoff;
* missing-day behavior.

---

# 40. No Execution Summary Semantic Rewrite

Do not rewrite `executionSummary.ts` merely to make Preview resemble Summary.

If the broad Preview aggregate is removed, leave domain/core logic alone unless dead-code cleanup is clearly safe and explicitly justified.

Default: preserve it.

---

# 41. Navigation State

Navigation should distinguish:

```text
where I am
```

from:

```text
what action I am taking.
```

Destination controls should use the project's existing active-state semantics.

Generation buttons should not appear selected as though they were destinations.

---

# 42. Browser/Refresh Behavior

Preserve existing application behavior on reload.

Do not introduce URL routing or deep-link infrastructure solely for this task unless it already exists.

---

# 43. No New Router

Do not add React Router or another routing framework merely to improve the three-surface shell.

Use existing application navigation state.

---

# 44. Keyboard Navigation

Destination controls and generation actions must remain keyboard accessible.

Do not replace semantic buttons with clickable containers.

---

# 45. Focus After Navigation

Audit focus behavior after moving among Setup, Preview, and Summary.

If the existing app has no focus-management convention, do not create a complex navigation manager.

But ensure the refinement does not make keyboard navigation worse.

---

# 46. Summary Drill-Down Focus Refinement

Task 4.4 found that selecting a Summary category inserts detail without programmatic focus.

If this can be corrected with a small, local, accessible change, include it in Task 4.5.

Preferred behavior:

* category control remains usable;
* expanded detail receives appropriate focus or is programmatically associated;
* no surprising focus jumps for pointer users.

If the fix requires disproportionate architecture, document and defer.

---

# 47. Long Preview Mobile Cost

Task 4.4 found that Preview becomes especially expensive on mobile because schedule, reporting, history, friction, and other sections linearize into one long surface.

Task 4.5 should reduce unnecessary aggregate content and improve section naming.

Do not implement a new mobile navigation architecture.

---

# 48. Responsive Navigation

Ensure destination/action separation works at existing supported widths.

Top-level destination controls must remain usable on narrow layouts.

Generation/regeneration controls should remain discoverable without becoming top-level navigation again.

---

# 49. Section Ordering

Audit Preview section order after aggregate cleanup.

The user should encounter operational content in a coherent sequence.

A likely conceptual order is:

```text
schedule
contextual reporting
friction/resolution
past planned occurrence reporting
report history
```

But preserve existing useful workflow ordering where evidence supports it.

Do not reorder large sections gratuitously.

---

# 50. Reporting Discoverability

Past reporting and correction/retraction should be easier to understand through headings/copy.

Task 4.5 does not require them to become top-level destinations.

Do not add more shell destinations merely to solve discoverability.

---

# 51. No Dedicated Reporting Destination Yet

Task 4.4 left open whether operational reporting eventually deserves:

* a Planner subsection;
* a dedicated destination;
* contextual-only entry points.

Task 4.5 must not settle that long-term question by creating a new top-level `Reporting` destination.

---

# 52. No Full Setup Rename

Do not rename Setup to Planner in isolation.

Task 4.4 found that Setup + Preview together constitute the current Planner responsibilities.

Renaming only Setup would make the model less accurate.

---

# 53. No Full Preview Rename

Likewise, do not rename Preview to Planner unless the implementation actually unifies the necessary operational responsibilities.

Default: keep Preview.

---

# 54. Generate Button Location

The generation command should be placed where the user's intent naturally occurs.

At minimum consider:

* Setup after editing;
* Preview when no Preview exists;
* Preview when stale.

Do not scatter identical primary actions everywhere without purpose.

---

# 55. Generation Status

Preserve existing:

* generating;
* ready;
* stale;
* unavailable/error

semantics.

Generation actions should disable appropriately while generation is in progress.

---

# 56. Error Handling

Navigation cleanup must not collapse:

* no Preview;
* stale Preview;
* generation failure;
* protected historical authority;
* Summary query failure

into one generic state.

---

# 57. Empty-State Integrity

Preserve the distinction between:

```text
nothing exists
```

and:

```text
DayFrame does not know
```

and:

```text
something existed but the current report was withdrawn.
```

Product copy changes must not weaken these distinctions.

---

# 58. No New Authority

Task 4.5 introduces no new authority.

UI navigation state remains UI state.

Section disclosure state remains UI state.

No new durable product state is needed.

---

# 59. No New Persistence

Do not change:

* localStorage authority keys;
* IndexedDB schema;
* Backup V3;
* HistoricalPlan format;
* ExecutionHistory format;
* Active format;
* Profiles format;
* PlanDecision format.

---

# 60. No New Durable IDs

Do not allocate identifiers for:

* navigation;
* reporting sections;
* UI cards;
* Summary detail.

---

# 61. No New Domain Events

Navigation and display changes emit no domain events.

Reporting actions continue to use existing governed APIs.

---

# 62. Restore Boundary

Backup V3 restore must require no Task-4.5-specific behavior.

After restore:

* Setup reflects restored Active authority;
* Preview behaves according to existing Preview semantics;
* reporting surfaces reflect restored ExecutionHistory/HistoricalPlan;
* Summary re-derives historical intelligence.

No UI-specific restore payload is permitted.

---

# 63. Full Clear

After full clear:

* no stale Preview aggregate remains;
* reporting/history surfaces reflect cleared authority;
* Summary remains truthful;
* navigation remains usable.

Add or preserve regression coverage.

---

# 64. Current Active Independence

Summary historical labels must continue to come from frozen historical provenance.

Navigation/refactoring must not introduce current Active lookup into Summary.

---

# 65. Accessibility

At minimum preserve or improve:

* semantic `nav`;
* accessible destination names;
* active destination state;
* keyboard operation;
* visible focus;
* semantic headings;
* field labels;
* disclosure semantics;
* alert/status semantics;
* non-color-only meaning.

---

# 66. Accessibility of Commands

Generation/regeneration buttons must have clear accessible names.

Avoid ambiguous repeated buttons both named simply:

> Generate

if their contexts differ materially.

---

# 67. Accessibility of Reporting Sections

If headings are renamed:

* preserve heading hierarchy;
* ensure correction/retraction controls remain contextually named;
* ensure historical reporting controls remain associated with the occurrence being reported.

---

# 68. Summary Category Focus

If implemented, test the local focus/accessibility improvement for Summary drill-down.

Do not make it dependent on mouse behavior.

---

# 69. Copy Tone

Use neutral descriptive language.

Do not introduce:

* success/failure judgment;
* adherence language;
* productivity scores;
* motivational grading.

---

# 70. No New Metrics

Do not implement:

* Scheduling Realization;
* Planned Allocation;
* trends;
* comparisons;
* streaks;
* heatmaps;
* composite scores.

---

# 71. No Goals

Do not introduce Goal concepts.

---

# 72. No Progress

Do not rename Summary History or Scheduled Outcomes to Progress.

---

# 73. No Recommendations

Do not add advice based on reported outcomes.

---

# 74. No Learning

Do not automatically modify future schedules from historical reports.

---

# 75. No Causal Interpretation

Do not add language such as:

> You skipped this because...

Task 4.5 is product-boundary cleanup.

---

# 76. Testing Strategy

Tests should focus on behavioral product boundaries.

Do not merely snapshot changed copy.

At minimum test:

* top-level navigation contains destination controls rather than Generate Preview as a navigation destination;
* Setup navigation does not generate;
* Preview navigation does not regenerate;
* Summary navigation does not mutate authority;
* explicit generation still works;
* Setup generation preserves current save-before-generate semantics;
* no-Preview Preview state exposes appropriate generation action;
* stale Preview exposes appropriate regeneration action;
* navigation to stale Preview does not regenerate automatically;
* contextual occurrence reporting remains available;
* past planned occurrence reporting remains available;
* correction remains available;
* retraction remains available;
* Summary remains read-only;
* ambiguous Preview aggregate is removed or explicitly narrowed;
* Summary Scheduled Outcomes semantics remain unchanged;
* withdrawn/retracted operational evidence is not mislabeled as Summary-style `Not reported`;
* full clear does not leave stale UI;
* responsive navigation remains usable;
* accessible navigation state remains correct.

---

# 77. Existing Tests

Update tests that currently assume:

```text
Generate Preview
```

is a top-level navigation control.

Do not weaken behavioral assertions merely to make them pass.

Tests should reflect the new destination/action distinction.

---

# 78. Focused Navigation Tests

Add focused coverage for:

```text
Setup → Preview
Preview → Summary
Summary → Setup
```

and generation as a separate command.

Verify navigation itself does not invoke generation.

---

# 79. Generation Regression Tests

Verify:

### No Preview

Explicit generation creates/opens Preview as before.

### Current Preview

Navigation does not mutate it.

### Stale Preview

Navigation shows stale Preview.

Explicit regeneration updates it.

---

# 80. Reporting Regression Tests

Verify that cleanup does not break:

* current occurrence reporting;
* historical occurrence reporting;
* correction;
* retraction;
* revision display.

---

# 81. Summary Regression Tests

Verify Task 4.3 behavior remains intact:

* complete coverage;
* incomplete coverage;
* unavailable coverage;
* scheduled outcomes;
* reporting coverage;
* drill-down;
* missing dates;
* exclusions;
* zero eligible;
* protected/quarantine handling.

Do not rewrite the entire Task 4.3 suite unless necessary.

---

# 82. Accessibility Tests

Where supported by the current stack, test:

* navigation landmark/name;
* active destination state;
* generation button accessible name;
* renamed reporting headings;
* Summary drill-down focus improvement if implemented.

---

# 83. Responsive Verification

Use existing responsive testing/manual verification conventions.

At minimum inspect:

* desktop shell;
* narrow/mobile shell;
* Preview with schedule;
* Preview without schedule;
* stale Preview;
* operational reporting sections;
* Summary.

---

# 84. Manual Product Walkthrough

Perform a manual walkthrough where the project workflow supports browser validation.

Walk through:

### Journey A — Plan

```text
Setup
→ edit authored state
→ Generate Preview
→ Preview
→ review schedule
```

### Journey B — Return to Preview

```text
Summary
→ Preview
```

Verify no generation occurs merely from navigation.

### Journey C — Stale Preview

```text
Setup
→ change authored state
→ Preview
→ stale notice
→ explicit Regenerate
```

### Journey D — Report current occurrence

```text
Preview
→ occurrence
→ Report outcome
```

### Journey E — Report past occurrence

```text
Preview
→ past planned occurrence reporting
→ report
```

### Journey F — Correct report

```text
Preview
→ report history
→ correct/retract
```

### Journey G — Reflect

```text
Summary
→ History
→ Scheduled outcomes
→ drill-down
```

Record what was actually verified.

---

# 85. Required Navigation Matrix

Produce:

| Control            | Type | Current behavior | Task 4.5 behavior | Mutates authority? |
| ------------------ | ---- | ---------------- | ----------------- | ------------------ |
| Setup              |      |                  |                   |                    |
| Preview            |      |                  |                   |                    |
| Summary            |      |                  |                   |                    |
| Generate Preview   |      |                  |                   |                    |
| Regenerate Preview |      |                  |                   |                    |

---

# 86. Required Surface Responsibility Matrix

Produce:

| Capability                     | Setup | Preview | Summary | Task 4.5 determination |
| ------------------------------ | ----: | ------: | ------: | ---------------------- |
| author planning inputs         |       |         |         |                        |
| generate schedule              |       |         |         |                        |
| review schedule                |       |         |         |                        |
| resolve friction               |       |         |         |                        |
| report current occurrence      |       |         |         |                        |
| report past planned occurrence |       |         |         |                        |
| correct/retract report         |       |         |         |                        |
| broad historical aggregate     |       |         |         |                        |
| historical evidence drill-down |       |         |         |                        |

Use:

* primary;
* contextual;
* absent;
* transitional.

---

# 87. Required Terminology Matrix

Produce:

| Concept                       | Before Task 4.5 | After Task 4.5 | Reason |
| ----------------------------- | --------------- | -------------- | ------ |
| schedule workspace            |                 |                |        |
| schedule generation           |                 |                |        |
| past occurrence reporting     |                 |                |        |
| editable execution history    |                 |                |        |
| Preview aggregate             |                 |                |        |
| Summary aggregate             |                 |                |        |
| current schedule coverage     |                 |                |        |
| historical reporting coverage |                 |                |        |

---

# 88. Required Outcome-Scope Matrix

Produce:

| Surface | Presentation | Population | Plan denominator? | Retraction treatment | User purpose |
| ------- | ------------ | ---------- | ----------------: | -------------------- | ------------ |
| Preview |              |            |                   |                      |              |
| Summary |              |            |                   |                      |              |

If the Preview aggregate is removed, explicitly state that in the matrix.

---

# 89. Required Read/Write Matrix

Produce:

| Capability            | Surface | Read/write | Authority |
| --------------------- | ------- | ---------- | --------- |
| schedule review       |         |            |           |
| schedule generation   |         |            |           |
| current reporting     |         |            |           |
| past reporting        |         |            |           |
| correction            |         |            |           |
| retraction            |         |            |           |
| historical analysis   |         |            |           |
| historical drill-down |         |            |           |

---

# 90. Required Epistemic Integrity Matrix

Produce:

| State                          | User-facing treatment after 4.5 | Must not be confused with |
| ------------------------------ | ------------------------------- | ------------------------- |
| no Preview                     |                                 |                           |
| stale Preview                  |                                 |                           |
| published-empty historical day |                                 |                           |
| missing historical day         |                                 |                           |
| eligible but not reported      |                                 |                           |
| report withdrawn/retracted     |                                 |                           |
| skipped                        |                                 |                           |
| protected authority            |                                 |                           |
| quarantined evidence           |                                 |                           |

---

# 91. Required Product-Boundary Matrix

Produce:

| Capability                               | Task 4.5 |
| ---------------------------------------- | -------- |
| destination/action navigation separation |          |
| explicit generation/regeneration         |          |
| Preview purpose clarification            |          |
| contextual current reporting             |          |
| past planned occurrence reporting        |          |
| report correction/retraction             |          |
| Preview aggregate cleanup                |          |
| Summary read-only boundary               |          |
| Summary metric semantic changes          |          |
| full Planner migration                   |          |
| dedicated Reporting destination          |          |
| Scheduling Realization                   |          |
| Planned Allocation                       |          |
| Goals                                    |          |
| Progress                                 |          |
| Recommendations                          |          |
| learning                                 |          |
| composite score                          |          |

Use:

* Implemented;
* Preserved;
* Clarified;
* Deferred;
* Prohibited by task.

---

# 92. Required Architectural Invariant Assessment

Classify at least:

1. Top-level navigation represents destinations.
2. Generation is an explicit command.
3. Navigating to Preview does not generate.
4. Navigating to Summary does not mutate authority.
5. Setup generation preserves authored-state semantics.
6. Preview remains derived.
7. Setup edits can mark Preview stale.
8. Stale Preview remains visible until explicit regeneration.
9. Current occurrence reporting remains operational.
10. Past planned occurrence reporting remains operational.
11. Past reporting uses frozen HistoricalPlan evidence.
12. Correction remains ExecutionHistory revision.
13. Retraction remains ExecutionHistory revision.
14. Report history remains distinct from Summary History.
15. Summary remains read-only.
16. Summary continues consuming Task 4.2 governed projection.
17. Completion Distribution semantics are unchanged.
18. Plan coverage semantics are unchanged.
19. Summary Not reported remains no current report for an eligible scheduled occurrence.
20. Retracted evidence remains distinct from Summary Not reported.
21. Preview no longer presents an ambiguous competing historical aggregate, or its retained aggregate is explicitly operationally scoped.
22. Current schedule reporting coverage, if retained, is visibly scoped.
23. Historical reporting coverage remains visibly scoped to selected Summary history.
24. Current Active does not reinterpret historical Summary evidence.
25. Full clear leaves no stale reporting aggregate.
26. Backup V3 requires no UI-specific data.
27. Restore requires no Task-4.5-specific logic.
28. No persistence version changes.
29. No new authority is introduced.
30. No durable IDs are allocated.
31. Navigation emits no domain events.
32. Viewing Summary emits no domain events.
33. Contextual report actions still use governed APIs.
34. No full Planner migration occurs.
35. Setup is not renamed to Planner in isolation.
36. Preview is not renamed to Planner without truthful unification.
37. No dedicated Reporting destination is introduced.
38. No Scheduling Realization metric is introduced.
39. No Planned Allocation metric is introduced.
40. No trends are introduced.
41. No comparisons are introduced.
42. No Goal semantics are introduced.
43. No Progress semantics are introduced.
44. No Recommendation semantics are introduced.
45. No learning behavior is introduced.
46. No composite/adherence score is introduced.
47. Navigation remains keyboard accessible.
48. Active destination remains programmatically exposed.
49. Generation actions remain keyboard accessible.
50. Responsive navigation remains usable.
51. Operational reporting remains usable on mobile.
52. Summary accessibility does not regress.
53. Epistemic distinctions remain intact.

Use:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Unsupported;
* Stop-condition violation.

---

# 93. Stop Conditions

Stop and report if:

* current implementation materially contradicts Task 4.4;
* Preview cannot be navigated to independently without triggering generation and separating those behaviors requires architectural state changes beyond this task;
* generation cannot be moved out of navigation without changing authored-state semantics;
* removing/narrowing Preview's aggregate would eliminate an essential workflow;
* past planned occurrence reporting cannot remain operational without moving historical authority;
* Summary must become writable to complete the refinement;
* correction/retraction semantics would need modification;
* Completion Distribution semantics would need modification;
* implementation requires new persistence or Backup fields;
* full Planner migration becomes necessary;
* a dedicated reporting architecture becomes necessary;
* a new historical metric becomes necessary to explain the UI.

Do not patch around a stop condition with duplicated semantics.

---

# 94. Files and Placement

Follow existing project organization.

Likely files may include:

```text
DayFrameApp.tsx
PreviewScreen.tsx
SetupScreen.tsx
ExecutionSummarySection.tsx
HistoricalPlanReportingSection.tsx
ExecutionHistoryPanel.tsx
HistoricalIntelligenceSummary.tsx
relevant styles
relevant tests
```

Do not assume every file must change.

Prefer the smallest coherent implementation.

---

# 95. Dead Code

If removing the Preview aggregate makes a component unreachable:

* verify whether it is used elsewhere;
* preserve underlying domain/core calculation by default;
* remove only UI dead code that is clearly safe;
* do not perform broad execution-summary cleanup.

Document the determination.

---

# 96. Governance

On successful completion update minimally:

* Task 4.5 result artifact;
* Phase 4 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Create an ADR only if implementation requires a genuinely new architectural decision.

The Task 4.4 Planner/Summary direction and read/write boundary are already sufficient for the expected bounded changes.

---

# 97. Validation

Before completion run at minimum:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Also run focused navigation/reporting/Summary tests and record the results.

Record the existing Vite chunk advisory separately if it remains non-blocking.

---

# 98. Required Result Artifact

Create:

`docs/implementation/phase-4/TASK_4.5_CLARIFY_PLANNER_PREVIEW_NAVIGATION_OUTCOME_SCOPE_AND_OPERATIONAL_REPORTING_RESPONSIBILITIES_V1_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 4.4 Prerequisite Confirmation
4. Initial Implementation Audit
5. Files Changed
6. Navigation Before/After
7. Destination/Action Separation
8. Setup Behavior
9. Preview Navigation
10. Summary Navigation
11. Generate Behavior
12. Regenerate Behavior
13. Save-Before-Generate Semantics
14. No-Preview State
15. Stale-Preview State
16. Preview Product-Purpose Clarification
17. Contextual Current Reporting
18. Past Planned Occurrence Reporting
19. Past Reporting Terminology
20. Report History / Correction / Retraction
21. Preview Aggregate Determination
22. Preview Aggregate Changes
23. Summary Aggregate Preservation
24. Outcome Scope Clarification
25. Not-Reported / Retraction Consistency
26. Reporting Coverage Scope
27. Summary Read-Only Boundary
28. Section Ordering
29. Responsive Behavior
30. Accessibility
31. Summary Drill-Down Focus Determination
32. Empty-State Integrity
33. Error-State Integrity
34. Epistemic Integrity
35. Full Clear
36. Restore Boundary
37. Persistence/Backup Boundary
38. Dead-Code Assessment
39. Tests Added/Changed
40. Focused Validation
41. Full Validation
42. Manual Product Walkthrough
43. Governance Updates
44. Deviations
45. Discoveries
46. Deferred Work
47. Navigation Matrix
48. Surface Responsibility Matrix
49. Terminology Matrix
50. Outcome-Scope Matrix
51. Read/Write Matrix
52. Epistemic Integrity Matrix
53. Product-Boundary Matrix
54. Architectural Invariant Assessment
55. Stop-Condition Assessment
56. Architectural Alignment Assessment
57. Recommended Next Task
58. Final Completion Determination

---

# 99. Completion Criteria

Task 4.5 is complete only when:

* Task 4.4 findings are verified against current production implementation;
* top-level navigation no longer presents schedule generation as a peer destination;
* top-level controls represent destinations;
* Preview can be entered without implicitly generating or regenerating a schedule;
* explicit generation remains available in an appropriate operational context;
* explicit regeneration remains available when a Preview exists or is stale as appropriate;
* current save-before-generate authored-state semantics are preserved;
* navigation to a stale Preview does not regenerate it;
* stale Preview messaging remains truthful;
* Preview's visible purpose is clearer as the operational schedule-review workspace;
* current occurrence `Report outcome` controls remain available;
* reporting against frozen past planned occurrences remains available;
* past planned occurrence reporting is described in plain user-purpose language;
* correction and retraction remain available through governed ExecutionHistory behavior;
* report history is visibly distinguishable from Summary History;
* the broad Preview `Reported outcomes` aggregate is either removed from the primary operational surface or narrowed to a clearly current-operational scope;
* Preview does not present retracted evidence under product language that conflicts with Summary's `Not reported`;
* Summary's Scheduled Outcomes projection remains governed by Task 4.2 and semantically unchanged;
* Summary remains read-only;
* current schedule draft, past planned schedule, report history, and selected Summary history are distinguishable in product language;
* any retained Preview reporting coverage is visibly scoped to the current schedule;
* Summary reporting coverage remains visibly scoped to selected historical evidence;
* Summary historical evidence remains independent of current Active;
* full clear cannot leave stale reporting or historical aggregate UI;
* Backup V3 requires no new UI state;
* restore requires no Task-4.5-specific payload or recovery logic;
* no new authority, persistence version, durable identifier, or domain event is introduced;
* no full Planner migration occurs;
* Setup is not renamed Planner in isolation;
* Preview is not renamed Planner without truthful functional unification;
* no dedicated Reporting destination is introduced;
* no Historical Intelligence metric semantics are changed;
* no Scheduling Realization, Planned Allocation, trend, comparison, Goal, Progress, Recommendation, learning, adherence, or composite-score behavior is introduced;
* destination navigation and generation commands remain keyboard accessible;
* responsive behavior remains usable at supported narrow widths;
* Summary accessibility does not regress;
* the Summary drill-down focus issue is either boundedly corrected or explicitly documented as deferred;
* epistemic distinctions between no Preview, stale Preview, missing history, published-empty history, not reported, withdrawn evidence, skipped, protected authority, and quarantined evidence remain intact;
* focused behavioral tests pass;
* canonical lint, typecheck, test, build, and diff validation pass;
* manual product walkthrough is recorded where supported;
* governance accurately records the refined product boundary;
* no unresolved stop condition remains.

---

# 100. Recommended Next Task

If Task 4.5 completes without discovering a new product-boundary problem, the preferred next Phase 4 task is:

> **Task 4.6 — Scheduling Realization Projection V1**

That task should define and implement the second governed Historical Intelligence projection answering:

> **How much of the intended historical work could DayFrame actually place into the schedule?**

It should distinguish effective HistoricalPlan states such as:

```text
scheduled
unplaced
omitted
blocked
```

without conflating scheduling realization with execution outcomes.

Do not begin Task 4.6 as part of Task 4.5.

If Task 4.5 discovers that the bounded cleanup is insufficient, its result should recommend the smallest prerequisite instead.

---

# 101. Final Implementation Principle

> **Navigation should tell the user where they are going. Actions should tell the system what to do. Reporting should record reality. Summary should explain what DayFrame knows.**

Task 4.5 exists to make those distinctions visible without changing the trustworthy authority architecture underneath them.

---

# 102. Final Completion Statement

**Task 4.5 is complete when DayFrame's post-4.4 product shell and operational reporting experience have been boundedly refined so that top-level navigation represents destinations rather than mixing destinations with schedule-generation commands; when Preview can be entered as the current operational schedule-review workspace without implicitly generating or regenerating derived schedule state; when Generate/Regenerate Preview is an explicit command in an appropriate authoring or operational context and existing save-before-generate and stale-preview semantics remain intact; when current occurrence reporting remains contextually available beside schedule evidence, reporting against frozen past planned occurrences remains available as an operational write workflow described in plain user-purpose language, and correction/retraction remain governed ExecutionHistory revision operations; when editable report history is visibly distinguished from read-only Summary History; when Preview no longer presents a broad report-centric aggregate whose completed/partial/skipped/not-reported vocabulary can reasonably be mistaken for Summary's HistoricalPlan-denominated Scheduled Outcomes projection, or any retained Preview aggregate has been narrowed and visibly scoped to a current operational question; when withdrawn/retracted evidence is not presented under language that conflicts with Summary's genuine eligible-but-unreported state; when Summary remains a read-only consumer of the unchanged Task 4.2 governed Historical Intelligence projection; when current schedule draft, past planned schedule, report history, and selected Summary history are sufficiently distinct in product copy to preserve their different authority and user-purpose boundaries; when any retained current-schedule reporting coverage and Summary historical reporting coverage are explicitly scoped rather than presented as adherence or success; when navigation, generation, reporting, correction, historical analysis, and drill-down remain keyboard accessible and usable at supported desktop and narrow widths; when the bounded Summary drill-down focus issue is corrected where locally practical or explicitly deferred; when full clear, Backup V3 restore, current Active mutation, protected historical authority, quarantined evidence, published-empty history, missing plan history, not-reported occurrences, withdrawn reports, skipped outcomes, no Preview, and stale Preview continue to preserve their distinct semantics; when no new authority, persistence schema, Backup field, durable identifier, domain event, full Planner migration, dedicated Reporting destination, Historical Intelligence metric, Scheduling Realization, Planned Allocation, trend, comparison, Goal, Progress, Recommendation, learning rule, adherence measure, or composite score has been introduced; when focused navigation, generation, reporting, correction, Summary, accessibility, responsive, clear, and restore regression coverage passes; when canonical lint, typecheck, test, build, and diff validation passes; when the manual product walkthrough is recorded where supported; when governance accurately records the clarified operational-versus-analytical product boundary; and when no unresolved stop condition remains.**
