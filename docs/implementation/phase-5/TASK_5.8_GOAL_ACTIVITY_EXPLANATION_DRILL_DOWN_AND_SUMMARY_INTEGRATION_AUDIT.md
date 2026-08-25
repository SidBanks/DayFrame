# Task 5.8 — Goal Activity Explanation, Drill-Down, and Summary Integration Audit

## Status

Ready for audit.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Read-only product/UX audit covering Goal Activity explanation, Summary information architecture, three-dimensional coverage presentation, Goal browsing, evidence drill-down, current-vs-frozen context, accessibility, responsive behavior, and implementation sequencing.

**No Goal Activity UI implementation is authorized.**

---

# 1. Context

Task 5.7 completed Goal Activity V1 as a pure categorical projection.

The implemented data flow is:

```text
Goal authority
    current authored Goal context

HistoricalPlan
    frozen Goal membership
    frozen planning disposition

ExecutionHistory
    governed reported outcome

        ↓

Goal Activity V1
```

Goal Activity V1 provides:

* current Goal context;
* explicit date range;
* explicit evaluation cutoff;
* plan coverage;
* Goal-link coverage;
* reporting coverage;
* Goal-linked planning distribution:

  * scheduled;
  * unplaced;
  * omitted;
  * blocked;
* Goal-linked scheduled-outcome distribution:

  * completed;
  * partial;
  * skipped;
  * unknown;
  * not reported;
* deterministic provenance;
* known-unlinked coverage evidence;
* legacy provenance-unavailable evidence;
* advisories;
* protection states.

Goal Activity is:

* derived;
* non-authoritative;
* non-persisted;
* policy-versioned;
* categorical;
* explainable;
* independent of current Goal links for historical membership.

Goal Activity explicitly does **not** mean:

* Goal Progress;
* Goal success;
* Goal completion;
* Goal performance;
* Goal score;
* “on track”;
* recommendation.

Task 5.7 recommended:

> **Task 5.8 — Goal Activity Explanation, Drill-Down, and Summary Integration Audit.**

---

# 2. Purpose

Determine how Goal Activity should become user-visible without weakening its semantics.

Task 5.8 must answer:

1. Where should Goal Activity live in Summary?
2. How should users select/browse Goals?
3. Should active/completed/archived Goals all be visible?
4. How should current Goal context be presented?
5. How should frozen historical Goal labels differ from current Goal labels?
6. How should the planning and execution distributions be explained?
7. How should the three independent coverage dimensions be presented?
8. How should known zero differ from unavailable?
9. How should legacy Goal-unaware history be explained?
10. How should protected ExecutionHistory degrade without hiding valid planning evidence?
11. What should drill-down show?
12. How should multi-Goal occurrences be explained?
13. What wording prevents Activity from being read as Progress?
14. Should Summary remain fully read-only?
15. Should there be a handoff from Summary to Planner?
16. What mobile/accessibility constraints matter?
17. Is the projection ready for direct implementation?
18. What exactly should Task 5.9 be?

---

# 3. Governing Product Principle

> **Goal Activity should show what DayFrame knows about historically Goal-linked planning and reported execution without implying how close the user is to achieving the Goal.**

---

# 4. Summary Responsibility Principle

Summary remains:

```text
read-only derived understanding
```

Planner remains:

```text
authored operational action
```

Task 5.8 must preserve this boundary.

---

# 5. Explicit Scope

Audit:

* Goal Activity location in Summary;
* Goal selection/browsing;
* Goal lifecycle visibility;
* current Goal context;
* Goal Activity naming;
* section headings;
* planning distribution presentation;
* execution distribution presentation;
* plan coverage;
* Goal-link coverage;
* reporting coverage;
* known-zero states;
* legacy-history limitations;
* missing-plan states;
* protected-authority states;
* evidence drill-down;
* current-vs-frozen Goal context;
* multi-Goal explanation;
* Summary/Planner handoff;
* accessibility;
* responsive/mobile layout;
* implementation readiness.

---

# 6. Explicit Non-Goals

Do not implement:

* Goal Activity UI;
* Summary Goal cards;
* Progress;
* Progress percentage;
* Goal score;
* measurable Goal policies;
* recommendations;
* RecommendationDecision;
* adaptation;
* Goal editing from Summary;
* Goal lifecycle writes from Summary;
* target-date status;
* “on track”;
* pace;
* Capacity;
* Planned Allocation;
* trends;
* comparisons;
* new authority;
* persistence;
* schema changes.

---

# 7. Execution Artifact Rules

Before auditing:

1. verify this Task 5.8 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.5 result;
   * Task 5.6 result;
   * Task 5.7 result;
   * Task 5.4 Goal UX result;
   * current Summary component;
   * current Summary tests;
   * existing plan coverage presentation;
   * Scheduling Realization presentation;
   * Scheduled Outcomes presentation;
   * reporting coverage presentation;
   * evidence drill-down/focus behavior;
   * GoalSection;
   * Goal query/store boundary;
   * Goal Activity query/store boundary;
   * responsive Summary styles;
   * accessibility tests;
   * current Planner/Summary navigation;
6. do not modify the immutable Task 5.8 artifact.

Create:

`docs/implementation/phase-5/TASK_5.8_GOAL_ACTIVITY_EXPLANATION_DRILL_DOWN_AND_SUMMARY_INTEGRATION_AUDIT_RESULT.md`

---

# 8. Audit Method

Perform a fresh product audit.

For each conclusion classify:

* **Confirmed**
* **Supported**
* **Product recommendation**
* **Residual debt**
* **Requires decision**
* **Deferred**
* **Blocker**
* **Not found**

Do not infer visual quality from source unless supported by styles/tests or direct walkthrough.

---

# 9. Current Summary Reconstruction

Reconstruct the current Summary hierarchy.

At minimum verify:

```text
Summary
    historical range
    shared plan coverage

    Planning
        Scheduling realization

    Execution
        Scheduled outcomes
        Reporting coverage

    evidence drill-down
```

Document actual current component structure and interaction model.

---

# 10. Goal Activity Integration Question

Assess whether Goal Activity should become:

### A. A peer to Planning and Execution

```text
Summary
    Plan history
    Goal Activity
    Planning
    Execution
```

### B. A new Goals section

```text
Summary
    Goals
        Goal Activity
    Planning
    Execution
```

### C. A Goal-specific detail mode within Summary

```text
Summary
    Goal selector
    selected Goal detail
```

### D. Another structure

Choose the strongest product model.

---

# 11. Goal Activity vs Existing Summary Metrics

Determine whether Goal Activity should:

* reuse existing Planning/Execution presentation patterns;
* appear as a composite Goal-specific section;
* visually nest planning and execution beneath the selected Goal.

Avoid duplicating Summary in a confusing way.

---

# 12. Suggested Conceptual Structure

Audit a structure such as:

```text
Summary

Goal Activity

Goal
    Earn Security+

Status
    Active

Target date
    Nov 30

Historical activity
    Plan coverage
    Goal-link coverage
    Reporting coverage

    Planning
        Scheduled
        Unplaced
        Omitted
        Blocked

    Execution
        Completed
        Partial
        Skipped
        Unknown
        Not reported
```

Determine whether this is clear or too dense.

---

# 13. Goal Selector

Determine how users choose a Goal.

Candidates:

* native select;
* segmented/list selector;
* compact Goal list/cards;
* single selected Goal detail;
* another bounded control.

Avoid a dashboard of every Goal unless current Goal count warrants it.

---

# 14. Active Goals

Active Goals should likely be primary.

Determine whether default selection should:

* choose first active Goal;
* require explicit selection;
* remember ephemeral selection;
* another behavior.

Do not persist selection unless necessary.

---

# 15. Completed Goals

Completed Goals should remain inspectable.

Do not hide historical activity simply because Goal lifecycle is completed.

---

# 16. Archived Goals

Archived Goals should remain inspectable but may be secondary/collapsed.

Archive is not failure.

---

# 17. No Goals State

If no Goals exist:

Goal Activity should not show a broken/empty analytics card.

Potential:

> No Goals yet. Goals can be created in Planner.

Summary must remain read-only.

A handoff link/button to Planner may be appropriate.

Audit.

---

# 18. Current Goal Context

Goal Activity should show current authored context separately from historical evidence.

At minimum consider:

* current title;
* current lifecycle;
* target date;
* optional description.

Do not surface internal revision unless needed diagnostically.

---

# 19. Target Date Copy

If displayed:

> Target date: Nov 30

Do not convert into:

* overdue;
* behind;
* due soon;
* pace.

---

# 20. Current Lifecycle Copy

Show:

* Active;
* Completed;
* Archived.

Do not interpret:

* successful;
* failed;
* abandoned.

---

# 21. Historical Frozen Goal Label

Drill-down may contain a frozen historical Goal title that differs from current title.

Determine whether UI should show:

```text
Current Goal: Security+ Certification

Historical occurrence:
Goal at the time: Earn Security+
```

or only expose old label when different.

Avoid confusing duplication.

---

# 22. Historical Revision

Do not show raw Goal revision by default.

Retain for provenance/debugging.

Audit whether accessible evidence detail needs it.

---

# 23. Measurement Policy Reference

Do not expose opaque measurement-policy ID/version.

It is provenance only until actual policies exist.

---

# 24. Goal Activity Naming

Confirm **Goal Activity** remains the correct section title.

Compare:

* Goal Activity;
* Goal History;
* Goal Evidence;
* Supporting Activity.

Choose one.

Default toward Goal Activity unless audit evidence favors another.

---

# 25. Explanation Copy

The UI must explain the feature in one concise sentence.

Candidate:

> Goal Activity shows historical work that was explicitly linked to this Goal. It does not measure Goal completion.

Assess tone and clarity.

---

# 26. Avoid Progress Vocabulary

Do not use:

* progress;
* progressing;
* on track;
* behind;
* completion rate;
* success rate;
* adherence.

Unless explicitly saying:

> This does not measure progress.

Even that should not be overused.

---

# 27. Planning Section

Goal Activity's planning distribution should answer:

> What happened to intended work that supported this Goal during planning?

Use existing categories:

* Scheduled;
* Unplaced;
* Omitted;
* Blocked.

---

# 28. Scheduled Copy

Explain:

> Supporting work received a scheduled placement.

Do not imply completion.

---

# 29. Unplaced Copy

Explain:

> Supporting work remained without a scheduled placement.

Do not imply skipped.

---

# 30. Omitted Copy

Explain frozen omission without causation.

---

# 31. Blocked Copy

Explain frozen blocked disposition without blame/capacity inference.

---

# 32. Planning Denominator

Consider displaying:

> Linked intended occurrences: 15

rather than a percentage.

Audit whether denominator language is comprehensible.

---

# 33. Execution Section

Goal Activity's execution distribution should answer:

> What was reported for Goal-linked work that reached the schedule?

Categories:

* Completed;
* Partial;
* Skipped;
* Unknown;
* Not reported.

---

# 34. Completed Copy

Use:

> Reported completed.

Never:

> Goal progress completed.

---

# 35. Partial Copy

Use categorical wording.

Do not imply 50%.

---

# 36. Skipped Copy

Use factual reporting language.

No judgment.

---

# 37. Unknown Copy

Explain correction/retraction semantics only where useful.

Do not overwhelm primary view.

---

# 38. Not Reported Copy

Make clearly distinct from skipped.

Potential:

> No current report exists for this scheduled occurrence.

---

# 39. Execution Denominator

Consider:

> Linked scheduled occurrences: 10

Again, count only.

---

# 40. Three Coverage Dimensions

The UI must present separately:

### Plan coverage

Did DayFrame have plan history for the selected days?

### Goal-link coverage

Was Goal membership recorded for eligible historical occurrences?

### Reporting coverage

Was linked scheduled work reported?

Do not merge them.

---

# 41. Coverage Information Architecture

Compare:

### A. Three separate cards

### B. One Coverage section with three rows

### C. Inline notices beside each subsection

### D. Hybrid

Choose the clearest low-noise design.

---

# 42. Avoid Percentage Overload

Coverage may show counts such as:

```text
Plan coverage
30 of 31 days available
```

if current Summary already does so truthfully.

Do not turn coverage into a quality score.

---

# 43. Plan Coverage — Complete

Use existing Summary semantics.

Avoid duplicating text unnecessarily.

---

# 44. Plan Coverage — Incomplete

Known Goal Activity counts may remain visible with missing-day disclosure.

---

# 45. Plan Coverage — Unavailable

Suppress unsupported Goal Activity interpretation.

---

# 46. Goal-Link Coverage — Complete

Meaning:

> Goal relationships were recorded for all eligible historical occurrences in the known plan evidence.

Do not imply every occurrence was linked.

---

# 47. Goal-Link Coverage — Incomplete

Meaning:

> Some eligible history predates Goal-link provenance.

Known linked activity may still be shown.

---

# 48. Goal-Link Coverage — Unavailable

If all eligible history is legacy/unavailable:

do not show zero Goal Activity.

Use explicit limitation.

---

# 49. Goal-Link Coverage — Known Zero

Critical.

If coverage is complete and queried Goal has no linked occurrences:

show:

> No Goal-linked activity was recorded in this range.

This is a known zero.

Do not say:

> No progress.

---

# 50. Reporting Coverage — Complete

Explain only linked scheduled work.

---

# 51. Reporting Coverage — Incomplete

Not-reported occurrences remain visible in categorical distribution.

---

# 52. Reporting Coverage — Not Applicable

If no Goal-linked scheduled occurrences exist:

reporting coverage is not applicable.

Do not show 0%.

---

# 53. ExecutionHistory Protected

If ExecutionHistory is protected/unavailable:

planning Goal Activity remains visible.

Execution section should show explicit unavailable state.

Potential:

> Planning activity is available, but reported outcomes cannot be interpreted right now.

Audit wording.

---

# 54. HistoricalPlan Protected

Goal Activity cannot be interpreted.

Do not show stale counts.

---

# 55. Goal Authority Protected

Cannot resolve current Goal.

Do not reconstruct from frozen history.

---

# 56. Mixed Legacy/New History

Known Goal-linked counts remain visible.

Display a limitation such as:

> Some selected history predates Goal-link tracking, so these counts include only records with known Goal relationships.

Avoid jargon like provenance in primary copy unless necessary.

---

# 57. Entirely Legacy History

Potential:

> Goal relationships were not recorded for this historical period.

Do not display zero categories as if meaningful.

---

# 58. Missing Plan Days

Use existing missing-date disclosure.

Do not blame Goal-link coverage for missing plan history.

---

# 59. Cold Start

Distinguish:

### No historical plan yet

> No plan history is available for this range.

### Goal-aware history but no linked activity

> No Goal-linked activity was recorded in this range.

### Goal-link relationships unavailable

> This history predates Goal-link tracking.

These must not collapse.

---

# 60. Published Empty

Known zero plan demand.

Goal Activity can truthfully show no linked occurrences.

Do not label as missing.

---

# 61. Evidence Drill-Down

Each planning/execution category should support drill-down if current Summary pattern remains appropriate.

Determine whether one unified Goal Activity evidence panel or separate planning/execution detail is better.

---

# 62. Planning Drill-Down

For each linked occurrence show user-relevant fields:

* historical date;
* source title;
* category;
* planning disposition;
* scheduled time if applicable.

Goal context may be shown if frozen title differs.

---

# 63. Execution Drill-Down

Show:

* date;
* source title;
* scheduled interval;
* current governed outcome;
* maybe execution report metadata where current Summary already does so.

Do not expose technical IDs by default.

---

# 64. Known-Unlinked Coverage Drill-Down

Do users need drill-down for known-unlinked occurrences?

Likely not in primary experience.

Could be retained for explanatory diagnostics.

Audit whether exposing them adds noise.

---

# 65. Legacy-Unknown Drill-Down

A bounded disclosure of affected dates may help explain incomplete Goal-link coverage.

Do not list enormous raw occurrence sets if dates suffice.

---

# 66. Provenance Detail Level

Use frozen provenance to explain counts without exposing internal implementation details.

Primary UI should not show:

* UUIDs;
* revisions;
* batch IDs;
* policy IDs.

These remain internal evidence.

---

# 67. Multi-Goal Occurrence Explanation

If one occurrence supports multiple Goals, each Goal Activity view may include it.

Determine whether UI needs a note:

> A commitment can support more than one Goal, so activity may appear under multiple Goals.

This may prevent users from assuming exclusive allocation.

---

# 68. No Cross-Goal Totals

Do not show:

```text
Total Goal Activity across all Goals
```

unless future allocation semantics define duplicate contribution.

---

# 69. Goal Selector + Shared Range

Goal Activity should likely use the same Summary historical range and refresh cutoff as existing metrics.

Audit whether:

* selected Goal changes only the Goal Activity query;
* range/cutoff remain globally shared.

Preferred: yes.

---

# 70. Shared Evaluation Cutoff

Use one Summary refresh/evaluation cutoff so:

* Scheduling Realization;
* Scheduled Outcomes;
* Goal Activity

all describe the same historical snapshot.

Do not independently refresh Goal Activity unless architecture requires it.

---

# 71. Goal Selection Does Not Change Cutoff

Changing selected Goal should not silently refresh time/evidence.

---

# 72. Async Stale-Request Handling

Goal Activity query is async.

Audit existing Summary stale-request suppression.

Determine whether Goal selection/range changes require request identity/token handling.

---

# 73. Loading State

Goal Activity loading should not blank unrelated Summary sections unnecessarily.

Prefer section-local loading if current architecture supports it.

---

# 74. Error State

Goal Activity query failure should not erase valid Planning/Execution Summary metrics.

Independent failure where possible.

---

# 75. Summary Information Density

Current Summary already contains:

* plan coverage;
* Scheduling Realization;
* Scheduled Outcomes;
* reporting coverage;
* evidence drill-down.

Adding Goal Activity could become repetitive.

Assess whether Goal Activity should be:

* collapsed by default;
* placed after existing history sections;
* placed before generic Planning/Execution;
* accessible through a Goal-specific tab/selector.

---

# 76. Goal-Centric vs History-Centric Summary

Determine whether Summary is beginning to need internal modes:

```text
Overview
Goals
```

Do not recommend a new subnavigation unless density justifies it.

---

# 77. Minimal Integration Preference

Default toward the smallest coherent addition.

For example:

```text
Summary

Goal Activity
    [Goal selector]
    coverage
    planning
    execution

Existing Planning
Existing Execution
```

without redesigning all Summary navigation.

Audit whether this is sufficient.

---

# 78. Duplication Concern

Goal Activity planning/execution distributions are Goal-filtered versions of existing generic historical concepts.

Determine whether users will understand:

```text
Scheduling realization
    all historical intended work

Goal Activity / Planning
    only work historically linked to selected Goal
```

Copy must distinguish scope.

---

# 79. Scope Label

Potential helper:

> These counts include only historical occurrences that were explicitly linked to this Goal.

Use if necessary.

---

# 80. Existing Summary Preservation

Do not replace Scheduling Realization or Scheduled Outcomes with Goal Activity.

They answer different questions.

---

# 81. Goal Activity as Filtered View

Do not implement Goal Activity by simply applying a UI filter to existing Summary state.

Use canonical Goal Activity query.

---

# 82. Summary Read-Only Boundary

No Goal lifecycle buttons.

No Edit Goal.

No Link Commitment.

No Mark Complete.

No Archive.

---

# 83. Planner Handoff

A read-only action may be useful:

> View Goal in Planner

or:

> Edit in Planner

Determine whether this improves navigation.

If used, it should navigate—not mutate.

---

# 84. Planner Deep Context

Current app may not have router/deep-link support.

Audit whether a handoff can:

* navigate to Planner / Plan;
* select the Goal ephemerally.

If not, do not introduce router architecture in this task.

---

# 85. Summary-to-Planner Handoff Alternatives

Compare:

### A. No handoff

### B. Navigate to Planner / Plan only

### C. Navigate and select Goal using app-owned ephemeral state

### D. Deep link/router

Choose based on current architecture.

---

# 86. Completed Goal Handoff

If Goal is completed, Planner can still inspect/edit/reactivate.

No issue.

---

# 87. Archived Goal Handoff

Likewise.

---

# 88. Goal Not Found During Selection

If selected Goal disappears due to full clear/restore:

* clear selection;
* show valid empty/no-goals state.

No stale Goal Activity.

---

# 89. Backup/Restore Interaction

Summary Goal selector should naturally update after authority restore.

No separate Goal Activity persistence.

---

# 90. Full Clear

Clear Goal selection/detail and Goal Activity results.

No stale evidence.

---

# 91. Current Goal Rename

Goal selector/current heading updates.

Historical drill-down frozen titles remain unchanged.

---

# 92. Current Goal Lifecycle Change

Selector/grouping updates; historical evidence unchanged.

---

# 93. Current Goal Link Change Without Republication

Goal Activity historical counts remain unchanged.

UI should not imply immediate historical changes.

---

# 94. Future Publication

New HistoricalPlan publication may change future queried Goal Activity according to cutoff.

---

# 95. Accessibility — Goal Selector

Use labelled native select or equivalent semantic control.

Do not rely on color/card selection alone.

---

# 96. Accessibility — Coverage

Coverage states must be expressed in text, not color.

---

# 97. Accessibility — Distribution Controls

If counts are drill-down buttons:

* expose category;
* count;
* expanded state.

Reuse Task 4.7 pattern.

---

# 98. Accessibility — Evidence Focus

Keyboard activation should move focus to newly inserted evidence if current Summary pattern does so.

Pointer activation need not steal focus.

---

# 99. Accessibility — Loading/Error

Use semantic status/alert patterns.

---

# 100. Accessibility — Goal Lifecycle

Status labels must be textual.

---

# 101. Responsive — Goal Selector

Full width/stacked on narrow screens if needed.

---

# 102. Responsive — Coverage

Prefer stacked rows/cards over wide three-column assumptions.

---

# 103. Responsive — Planning/Execution

Reuse current responsive distribution/list patterns.

No horizontal tables.

---

# 104. Responsive — Evidence

Stacked details.

---

# 105. Mobile Density

Audit whether Goal Activity plus existing Summary creates excessive scroll.

Possible mitigations:

* collapsible Goal Activity;
* progressive disclosure;
* one selected Goal only;
* compact coverage section.

Do not hide essential semantics.

---

# 106. Visual Hierarchy

Goal Activity should look like a coherent section, not another top-level app destination.

Use heading hierarchy.

---

# 107. Copy Hierarchy

Potential:

```text
Goal Activity
Earn Security+

Shows historical work explicitly linked to this Goal.
This does not measure Goal completion.
```

Then:

```text
Coverage
Planning
Execution
```

Audit.

---

# 108. No Motivational Judgment

Avoid copy such as:

* Great job;
* Falling behind;
* Needs improvement;
* Strong performance.

Task 5.8 is descriptive.

---

# 109. No Causal Language

Avoid:

> You completed more because...

No recommendation yet.

---

# 110. No Goal Completion Inference

If Goal status is active and all linked work was completed:

do not suggest marking complete.

---

# 111. No Target-Date Interpretation

Do not show:

* days remaining;
* overdue;
* urgency.

Unless merely displaying the authored date.

---

# 112. Goal Activity Copy Matrix

Produce:

| Concept            | Recommended user wording | Avoid |
| ------------------ | ------------------------ | ----- |
| Goal Activity      |                          |       |
| Plan coverage      |                          |       |
| Goal-link coverage |                          |       |
| Reporting coverage |                          |       |
| Scheduled          |                          |       |
| Unplaced           |                          |       |
| Omitted            |                          |       |
| Blocked            |                          |       |
| Completed          |                          |       |
| Partial            |                          |       |
| Skipped            |                          |       |
| Unknown            |                          |       |
| Not reported       |                          |       |
| Legacy history     |                          |       |
| Known zero         |                          |       |

---

# 113. Goal Selection Matrix

Produce:

| Goal state | Listed? | Default prominence | Inspectable? | Writable in Summary? |
| ---------- | ------: | ------------------ | -----------: | -------------------: |
| active     |         |                    |              |                      |
| completed  |         |                    |              |                      |
| archived   |         |                    |              |                      |

---

# 114. Coverage UX Matrix

Produce:

| Evidence state             | Plan coverage presentation | Goal-link coverage presentation | Reporting presentation |
| -------------------------- | -------------------------- | ------------------------------- | ---------------------- |
| all known                  |                            |                                 |                        |
| missing plan days          |                            |                                 |                        |
| mixed legacy/new           |                            |                                 |                        |
| all legacy                 |                            |                                 |                        |
| known zero linked          |                            |                                 |                        |
| no linked scheduled        |                            |                                 |                        |
| ExecutionHistory protected |                            |                                 |                        |
| HistoricalPlan protected   |                            |                                 |                        |

---

# 115. Distribution UX Matrix

Produce:

| Section   | Category     | Primary copy | Drill-down? |
| --------- | ------------ | ------------ | ----------: |
| Planning  | scheduled    |              |             |
| Planning  | unplaced     |              |             |
| Planning  | omitted      |              |             |
| Planning  | blocked      |              |             |
| Execution | completed    |              |             |
| Execution | partial      |              |             |
| Execution | skipped      |              |             |
| Execution | unknown      |              |             |
| Execution | not reported |              |             |

---

# 116. Current-vs-Frozen UX Matrix

Produce:

| Condition               | Current Goal display | Historical evidence display |
| ----------------------- | -------------------- | --------------------------- |
| same title              |                      |                             |
| Goal renamed            |                      |                             |
| Goal completed later    |                      |                             |
| Goal archived later     |                      |                             |
| measurement ref changed |                      |                             |

---

# 117. Cross-Surface Matrix

Produce:

| User intent                 | Summary | Planner |
| --------------------------- | ------- | ------- |
| inspect Goal Activity       |         |         |
| inspect evidence            |         |         |
| edit Goal                   |         |         |
| change lifecycle            |         |         |
| link/unlink commitment      |         |         |
| later review recommendation |         |         |

---

# 118. Information Architecture Alternatives Matrix

Compare:

| Criterion                 | Peer section | Goals section | Goal detail mode | Summary subtab |
| ------------------------- | ------------ | ------------- | ---------------- | -------------- |
| simplicity                |              |               |                  |                |
| density                   |              |               |                  |                |
| Goal discoverability      |              |               |                  |                |
| reuse of current Summary  |              |               |                  |                |
| mobile                    |              |               |                  |                |
| future Progress expansion |              |               |                  |                |
| recommendation            |              |               |                  |                |

---

# 119. Handoff Alternatives Matrix

Compare:

| Criterion            | none | Planner only | Planner + selected Goal | router deep-link |
| -------------------- | ---- | ------------ | ----------------------- | ---------------- |
| simplicity           |      |              |                         |                  |
| implementation risk  |      |              |                         |                  |
| user value           |      |              |                         |                  |
| architecture fit     |      |              |                         |                  |
| future extensibility |      |              |                         |                  |

---

# 120. Summary Density Matrix

Produce:

| Section           | Current | After proposed Goal Activity | Risk |
| ----------------- | ------- | ---------------------------- | ---- |
| range             |         |                              |      |
| plan coverage     |         |                              |      |
| Goal Activity     |         |                              |      |
| generic Planning  |         |                              |      |
| generic Execution |         |                              |      |
| evidence details  |         |                              |      |

---

# 121. Product-Boundary Matrix

Produce:

| Capability              | Task 5.8                     |
| ----------------------- | ---------------------------- |
| Goal Activity UI design | Audit                        |
| Goal selector           | Audit                        |
| coverage copy           | Audit                        |
| drill-down design       | Audit                        |
| Summary placement       | Audit                        |
| Planner handoff         | Audit                        |
| UI implementation       | Prohibited                   |
| Progress                | Prohibited                   |
| Recommendation          | Prohibited                   |
| Goal writes in Summary  | Prohibited                   |
| routing                 | Deferred unless prerequisite |
| schema changes          | Prohibited                   |

---

# 122. Epistemic Integrity Matrix

Produce:

| Evidence            | UI may say | UI must not say |
| ------------------- | ---------- | --------------- |
| linked scheduled    |            |                 |
| linked completed    |            |                 |
| linked partial      |            |                 |
| linked skipped      |            |                 |
| linked unknown      |            |                 |
| linked not reported |            |                 |
| linked unplaced     |            |                 |
| Goal-aware zero     |            |                 |
| legacy Goal-unaware |            |                 |
| missing plan        |            |                 |
| completed Goal      |            |                 |
| target date passed  |            |                 |
| protected execution |            |                 |

---

# 123. Accessibility Assessment

Classify:

* current Summary patterns reusable;
* new risks;
* any blocker.

Do not claim manual accessibility testing unless performed.

---

# 124. Responsive Assessment

Classify:

* coherent;
* usable with debt;
* requires bounded design change;
* insufficient evidence.

---

# 125. Manual Walkthrough

If browser validation is available, inspect current Summary at:

* desktop;
* narrow/mobile;

and assess how much space a Goal Activity section can reasonably consume.

No implementation.

If unavailable, state limitation.

---

# 126. Implementation Readiness

Choose exactly one:

### A. Ready for bounded Summary integration

No prerequisite architecture task required.

### B. Ready with one UX constraint

Name it.

### C. Requires Summary information-architecture prerequisite

Name it.

### D. Projection is not product-ready

Explain why.

---

# 127. Recommended Integration Shape

Choose one exact product model.

For example:

> Add a bounded Goal Activity section to Summary, with a single Goal selector, three compact coverage rows, nested Planning and Execution distributions, and existing-style drill-down. Keep generic Planning/Execution sections unchanged.

Or another model supported by audit.

---

# 128. Goal Activity Handoff Decision

Choose exactly one:

### A. No Planner handoff in first UI

### B. Navigate to Planner / Plan

### C. Navigate to Planner / Plan and select Goal ephemerally

### D. Require router/deep-link first

Do not hedge.

---

# 129. Goal Activity Scope in First UI

Determine whether first UI includes:

* all active/completed/archived Goals;
* only active Goals plus secondary historical selector;
* another bounded set.

---

# 130. Coverage Presentation Decision

Choose exact first-UI approach:

### A. three compact rows

### B. three cards

### C. inline section-local coverage

### D. another model

---

# 131. Drill-Down Decision

Choose:

### A. category buttons reuse existing Task 4.7 inserted-detail behavior

### B. one unified evidence list

### C. no drill-down in first UI

Given projection provenance, likely A unless density blocks it.

---

# 132. Current/Frozen Label Decision

Choose exact rule.

Strong candidate:

> Use current Goal title as section heading. In evidence rows, show frozen historical title only when it differs from the current title, prefixed with “Goal at the time.”

Assess.

---

# 133. Legacy Copy Decision

Choose canonical copy for legacy Goal-unaware history.

Example:

> Some history predates Goal-link tracking, so Goal relationships are unavailable for those records.

Avoid “data missing” if history itself exists.

---

# 134. Known-Zero Copy Decision

Choose canonical copy.

Example:

> No Goal-linked activity was recorded in this range.

---

# 135. Execution-Protection Copy Decision

Choose canonical copy.

Example:

> Planning activity is available, but reported outcomes cannot be interpreted right now.

---

# 136. No-Reports Copy Decision

Do not say unavailable if reports simply do not exist.

Use the `Not reported` category and reporting coverage semantics.

---

# 137. Progress Boundary Decision

Reconfirm whether any UI element in the recommended integration could reasonably be mistaken for Progress.

If yes, revise.

---

# 138. Future Progress Expansion

Assess whether the recommended Summary structure leaves room for later policy-specific Progress without forcing redesign.

Do not implement.

---

# 139. Recommendation Expansion

Assess whether future Recommendations could appear:

* within Goal detail;
* after Goal Activity;
* elsewhere.

Do not let future recommendation needs overcomplicate V1.

---

# 140. Recommended Task 5.9

Choose exactly one next task.

Expected if ready:

> **Task 5.9 — Implement Goal Activity V1 Summary Integration and Evidence Drill-Down**

It should remain read-only and implement the audited design.

If not ready, recommend the smallest prerequisite.

---

# 141. Recommended Phase 5 Sequence

Update likely near-term sequence based on audit.

Potential:

```text
5.9 Goal Activity Summary integration
5.10 Progress policy readiness / measurement-policy architecture
5.11 Progress V1
5.12 Recommendation architecture
```

Do not commit beyond evidence.

---

# 142. Required Architectural Invariant Assessment

Classify at least:

1. Goal Activity remains descriptive.
2. Goal Activity is not Progress.
3. Goal Activity is not Goal completion.
4. Goal Activity is not Goal performance.
5. Goal Activity remains read-only in Summary.
6. Goal writes remain Planner-only.
7. current Goal title/lifecycle are current context.
8. frozen historical Goal title remains provenance.
9. current Goal rename does not rewrite evidence.
10. current Goal link changes do not rewrite evidence.
11. plan coverage remains separate.
12. Goal-link coverage remains separate.
13. reporting coverage remains separate.
14. no combined coverage score should appear.
15. known Goal-aware zero differs from unavailable legacy.
16. published-empty differs from missing.
17. legacy Goal-unaware differs from known unlinked.
18. not reported differs from skipped.
19. partial remains categorical.
20. completed outcome does not mean Goal complete.
21. unplaced does not mean failure.
22. blocked does not mean incapacity.
23. omitted does not mean abandonment.
24. target date remains context only.
25. lifecycle remains authored fact.
26. completed/archived Goals remain inspectable.
27. Summary does not edit lifecycle.
28. Summary does not link/unlink Commitments.
29. one selected Goal is sufficient for first UI unless audit disproves it.
30. multi-Goal occurrences may appear under multiple Goals.
31. no exclusive allocation is implied.
32. generic Summary Planning remains useful.
33. generic Summary Execution remains useful.
34. Goal Activity does not replace peer metrics.
35. Goal Activity should reuse canonical query rather than UI filtering.
36. shared Summary range should govern Goal Activity.
37. shared evaluation cutoff should govern Goal Activity.
38. Goal selection should not refresh cutoff.
39. stale async Goal Activity responses must not overwrite current selection/range.
40. Goal Activity failure should not erase unrelated Summary sections.
41. protected ExecutionHistory should preserve plan-only Goal Activity.
42. protected HistoricalPlan should suppress Goal Activity.
43. protected Goal should suppress Goal Activity.
44. no technical IDs should appear in primary UI.
45. frozen old title should only appear where explanatory.
46. measurement-policy ID should remain hidden.
47. coverage state must be textual, not color-only.
48. category drill-down should be keyboard accessible.
49. evidence insertion should preserve current focus conventions.
50. mobile layout must avoid horizontal tables.
51. Goal selector must remain usable on narrow screens.
52. no Progress percentage appears.
53. no “on track” language appears.
54. no recommendation appears.
55. no adaptation appears.
56. no causation appears.
57. no motivational judgment appears.
58. no Goal score appears.
59. no schema/persistence change is needed.
60. exactly one implementation next task is recommended if ready.
61. no unresolved stop condition remains.

Use:

* Confirmed
* Supported
* Product recommendation
* Residual debt
* Deferred
* Prohibited
* Requires decision
* Stop-condition violation

---

# 143. Stop Conditions

Stop and recommend a prerequisite if:

* current Summary architecture cannot add Goal Activity without confusing its existing Planning/Execution semantics;
* three coverage dimensions cannot be presented clearly;
* Goal Activity necessarily reads as Progress despite explanatory copy;
* current async query architecture cannot safely handle Goal switching;
* current Summary drill-down cannot represent Goal provenance without broad redesign;
* current/frozen Goal labels cannot be distinguished intelligibly;
* mobile density would make the feature unusable without a larger Summary redesign;
* Summary must gain write behavior to make Goal Activity useful;
* Goal Activity UI requires measurable Progress semantics;
* Goal Activity UI requires Recommendation behavior;
* router/deep-link infrastructure is required for basic usability.

Do not turn Task 5.8 into an implementation task.

---

# 144. Validation

Task 5.8 is audit-only.

No production/test code changes are authorized.

Run at minimum:

```bash
git diff --check
```

If governance files are updated, validate formatting according to repository practice.

Do not claim full product validation unless executed.

---

# 145. Governance

On completion update minimally:

* Task 5.8 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`;
* `DECISIONS.md` only if an enduring Summary/Goal Activity product decision is accepted.

Do not claim Goal Activity UI implemented.

---

# 146. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.8_GOAL_ACTIVITY_EXPLANATION_DRILL_DOWN_AND_SUMMARY_INTEGRATION_AUDIT_RESULT.md`

Include at least:

1. Executive Determination
2. Artifact Integrity
3. Audit Scope
4. Sources Reviewed
5. Current Summary Reconstruction
6. Goal Activity Integration Alternatives
7. Recommended Summary Structure
8. Goal Selector
9. Active/Completed/Archived Goals
10. Empty Goal State
11. Current Goal Context
12. Target Date
13. Goal Activity Naming
14. Explanation Copy
15. Planning Section
16. Planning Category Copy
17. Planning Denominator
18. Execution Section
19. Execution Category Copy
20. Execution Denominator
21. Three-Coverage Presentation
22. Plan Coverage
23. Goal-Link Coverage
24. Reporting Coverage
25. Known-Zero State
26. Legacy-History State
27. Missing-Plan State
28. Published-Empty State
29. Protected Goal State
30. Protected HistoricalPlan State
31. Protected ExecutionHistory State
32. Mixed Legacy/New State
33. Cold Start
34. Evidence Drill-Down
35. Planning Drill-Down
36. Execution Drill-Down
37. Coverage/Legacy Detail
38. Provenance Detail Level
39. Current-vs-Frozen Goal Labels
40. Multi-Goal Explanation
41. Shared Range/Cutoff
42. Async/Stale Request Behavior
43. Loading/Error Isolation
44. Summary Density
45. Goal-Centric vs History-Centric Alternatives
46. Duplication With Existing Metrics
47. Summary Read-Only Boundary
48. Planner Handoff Alternatives
49. Handoff Decision
50. Restore/Clear/Selection Behavior
51. Accessibility
52. Focus/Keyboard
53. Responsive/Mobile
54. Visual/Copy Hierarchy
55. Progress Boundary
56. Future Progress Compatibility
57. Recommendation Compatibility
58. Goal Activity Copy Matrix
59. Goal Selection Matrix
60. Coverage UX Matrix
61. Distribution UX Matrix
62. Current-vs-Frozen UX Matrix
63. Cross-Surface Matrix
64. Information Architecture Alternatives Matrix
65. Handoff Alternatives Matrix
66. Summary Density Matrix
67. Product-Boundary Matrix
68. Epistemic Integrity Matrix
69. Accessibility Assessment
70. Responsive Assessment
71. Manual Walkthrough
72. Implementation Readiness
73. Recommended Integration Shape
74. Coverage Presentation Decision
75. Drill-Down Decision
76. Current/Frozen Label Decision
77. Legacy Copy Decision
78. Known-Zero Copy Decision
79. Execution-Protection Copy Decision
80. Architectural Invariant Assessment
81. Stop-Condition Assessment
82. Governance Updates
83. Validation
84. Recommended Task 5.9
85. Final Audit Statement

---

# 147. Completion Criteria

Task 5.8 is complete only when:

* current Summary information architecture is independently reconstructed;
* Goal Activity placement is compared against at least peer-section, Goals-section, detail-mode, and subnavigation alternatives;
* exactly one recommended integration structure is chosen;
* active, completed, and archived Goal browsing behavior is defined;
* no-Goal behavior is defined;
* current Goal context is distinguished from historical frozen Goal context;
* Goal Activity naming is explicitly accepted or revised;
* one concise explanation prevents Goal Activity from being interpreted as Progress;
* planning and execution sections are mapped to existing categorical semantics without score/percentage;
* plan, Goal-link, and reporting coverage receive separate presentation semantics;
* known Goal-aware zero is visibly distinct from legacy unavailable;
* missing plan history is distinct from Goal-link legacy history;
* published-empty is distinct from missing;
* ExecutionHistory protection preserves valid planning activity where appropriate;
* Goal/HistoricalPlan protection suppresses unsupported interpretation;
* mixed legacy/new behavior is defined;
* cold-start states are distinct;
* evidence drill-down content and interaction are defined;
* technical provenance remains hidden from primary presentation while sufficient frozen evidence remains available;
* current-vs-frozen Goal title differences have a concrete display rule;
* multi-Goal evidence is explained without implying exclusive allocation;
* shared Summary range and evaluation cutoff behavior are defined;
* Goal selection does not silently refresh cutoff;
* async stale-request handling is addressed;
* Goal Activity error/loading behavior does not unnecessarily erase unrelated Summary metrics;
* Summary density and duplication risks are explicitly assessed;
* Goal Activity does not replace generic Scheduling Realization or Scheduled Outcomes;
* Summary remains read-only;
* any Planner handoff is navigation-only;
* exactly one handoff model is chosen;
* accessibility/focus/keyboard requirements are explicit;
* responsive/mobile behavior is assessed;
* no horizontal-table dependency is recommended;
* Progress, score, pace, “on track,” recommendation, adaptation, causal inference, motivational judgment, and target-date judgment remain excluded;
* future Progress can be added without forcing Goal Activity semantics to change;
* implementation readiness receives one explicit determination;
* exactly one next Task 5.9 is recommended;
* all required matrices are completed;
* no production code, tests, Summary UI, Planner UI, Goal schema, HistoricalPlan schema, ExecutionHistory schema, Progress, Recommendation, adaptation, persistence, routing, or unrelated feature is introduced;
* no unresolved stop condition remains.

---

# 148. Final Audit Principle

> **Goal Activity belongs in Summary only if the interface can make “this happened in support of your Goal” unmistakably different from “you are this far toward achieving your Goal.”**

---

# 149. Final Completion Statement

**Task 5.8 is complete when DayFrame has one evidence-backed, implementation-ready product model for presenting Goal Activity V1 inside Summary without allowing the feature to become a proxy for Progress, performance, adherence, success, or recommendation; when current Summary structure, existing Planning and Execution analyses, Goal browsing, active/completed/archived lifecycle context, current Goal metadata, frozen historical Goal provenance, three independent coverage dimensions, planning and execution category semantics, known-zero behavior, legacy Goal-unaware history, missing-plan history, published-empty history, protected Goal/HistoricalPlan/ExecutionHistory states, mixed legacy/new evidence, cold start, multi-Goal contribution, and evidence drill-down have each been mapped to clear user-facing presentation rules; when Goal Activity's current Goal heading and historical frozen labels have an explicit non-confusing relationship; when technical identity and provenance remain hidden from primary UI but every displayed count can still be explained; when the shared Summary range and one evaluation cutoff govern Goal Activity consistently with existing Historical Intelligence; when Goal selection, loading, stale async results, errors, restore, clear, and authority replacement are bounded without introducing persistent UI authority; when Summary density, mobile stacking, accessibility, keyboard interaction, focus behavior, and coverage readability have been assessed; when Summary remains entirely read-only, Planner remains the sole Goal write surface, and exactly one navigation-only Planner handoff model is selected; when the audit rejects percentage Progress, Goal scores, “on track” labels, target-date judgment, motivational judgment, causation, Recommendations, adaptation, cross-Goal allocation, and any other unsupported interpretation; when one exact Summary integration shape, coverage presentation model, drill-down model, legacy-history copy rule, known-zero copy rule, current/frozen-label rule, and execution-protection rule are selected; when implementation readiness is explicitly determined; when exactly one bounded Task 5.9 is recommended; and when no production implementation, schema change, authority change, routing layer, Progress model, Recommendation behavior, adaptation mechanism, or unrelated feature has been introduced during the audit.**
