# Task 5.9 — Implement Goal Activity V1 Summary Integration and Evidence Drill-Down

## Status

Ready for implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Bounded Summary integration, Goal selection, Goal Activity query orchestration, three-dimensional coverage presentation, categorical planning/execution presentation, evidence drill-down, Planner navigation handoff, accessibility, responsive behavior, regression testing, and governance.

---

# 1. Context

Task 5.7 implemented Goal Activity V1 as a deterministic, policy-versioned, non-authoritative, non-persisted historical projection.

Task 5.8 then completed the Goal Activity Summary integration audit and determined:

> **Ready for bounded Summary integration.**

No prerequisite architecture, routing, authority, or schema task remains.

The accepted Summary integration model is:

```text
Summary

History range / shared evaluation cutoff
Plan coverage

Goal Activity
    Goal selector
    Current Goal context
    Scope explanation

    Coverage
        Plan
        Goal-link
        Reporting

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

    Evidence drill-down

Generic Planning
    Scheduling realization

Generic Execution
    Scheduled outcomes
    Reporting coverage
```

Task 5.8 further settled:

* Goal Activity remains a bounded Goals section inside Summary;
* Summary remains history-centric;
* one explicit Goal is selected at a time;
* selection is ephemeral;
* active Goals appear first;
* completed Goals remain inspectable;
* archived Goals remain inspectable;
* Goal Activity shares the Summary range and one refresh cutoff;
* changing Goal selection does not silently refresh the cutoff;
* current Goal title is the section heading;
* frozen historical Goal title appears only when different as:

  * `Goal at the time: …`;
* three coverage dimensions use compact labelled rows;
* category drill-down reuses the existing inserted-detail behavior;
* Summary remains read-only;
* Goal edits remain Planner-only;
* first handoff is navigation to Planner / Plan only;
* no router or selected-Goal deep link is required;
* Goal Activity remains explicitly distinct from Progress.

---

# 2. Purpose

Make Goal Activity V1 visible and useful in Summary.

At completion, a user must be able to:

1. open Summary;
2. select an existing Goal;
3. see current Goal context;
4. understand what Goal Activity means;
5. inspect plan coverage;
6. inspect Goal-link coverage;
7. inspect reporting coverage;
8. see Goal-linked planning counts;
9. see Goal-linked scheduled-outcome counts;
10. open evidence supporting each category;
11. understand legacy/provenance limitations;
12. distinguish known zero from unavailable evidence;
13. preserve planning activity when execution history is unavailable;
14. navigate to Planner when they want to change Goals;
15. do all of this without seeing a Progress percentage, Goal score, recommendation, or write control in Summary.

---

# 3. Governing Product Principle

> **Goal Activity shows historical work explicitly linked to a Goal. It does not measure Goal completion.**

Use this semantic boundary throughout the implementation.

---

# 4. Governing Surface Principle

Summary remains:

```text
read-only derived understanding
```

Planner remains:

```text
authored operational action
```

No Goal mutation may be introduced into Summary.

---

# 5. Governing Evidence Principle

The UI must preserve the three independent dimensions:

```text
Plan coverage
Goal-link coverage
Reporting coverage
```

Do not collapse them into:

* overall coverage;
* confidence;
* score;
* percentage;
* health indicator.

---

# 6. Explicit Scope

Implement:

* Goal Activity section in Summary;
* Goal selector;
* lifecycle-labelled Goal grouping;
* current Goal context;
* scope/explanation copy;
* shared range/cutoff query orchestration;
* section-local loading/error handling;
* plan coverage row;
* Goal-link coverage row;
* reporting coverage row;
* planning distribution;
* execution distribution;
* known-zero state;
* legacy-history state;
* missing-plan state;
* published-empty state;
* protected Goal state;
* protected HistoricalPlan state;
* protected ExecutionHistory degradation;
* Goal Activity evidence drill-down;
* current-vs-frozen Goal-label handling;
* bounded legacy/coverage detail;
* Planner navigation handoff;
* restore/clear/selection behavior;
* accessibility;
* responsive/mobile behavior;
* tests;
* governance.

---

# 7. Explicit Non-Goals

Do not implement:

* Progress;
* Progress percentage;
* Goal score;
* Goal performance;
* Goal health;
* “on track”;
* “behind”;
* pace;
* trends;
* recommendations;
* RecommendationDecision;
* adaptation;
* Goal editing in Summary;
* Goal lifecycle writes in Summary;
* link/unlink in Summary;
* target-date judgment;
* Goal comparison;
* all-Goals dashboard;
* Goal allocation;
* Capacity;
* Planned Allocation;
* routing/deep-link infrastructure;
* Summary subnavigation redesign;
* Goal Activity persistence;
* new authority;
* schema changes;
* Backup changes;
* HistoricalPlan changes;
* ExecutionHistory changes.

---

# 8. Execution Artifact Rules

Before implementation:

1. verify this Task 5.9 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.7 result;
   * Task 5.8 result;
   * Goal Activity projection/query contracts;
   * Goal authority query/subscription surface;
   * current Summary component;
   * current Summary tests;
   * Summary refresh/cutoff logic;
   * stale-request suppression;
   * existing Scheduling Realization section;
   * existing Scheduled Outcomes section;
   * current plan/reporting coverage presentation;
   * inserted-detail/focus behavior;
   * Planner/Summary navigation;
   * GoalSection;
   * responsive Summary styles;
6. do not modify the immutable Task 5.9 artifact.

Create:

`docs/implementation/phase-5/TASK_5.9_IMPLEMENT_GOAL_ACTIVITY_V1_SUMMARY_INTEGRATION_AND_EVIDENCE_DRILL_DOWN_RESULT.md`

---

# 9. Initial Integration Audit

Before editing code, confirm:

* exact Summary component tree;
* current refresh request lifecycle;
* range state ownership;
* evaluation cutoff capture;
* canonical Goal Activity application query signature;
* Goal subscription/query behavior;
* Goal readiness/protection state;
* existing category-detail state;
* current focus behavior;
* current Planner navigation API;
* existing mobile breakpoints.

Stop if Task 5.8 assumptions no longer match current source.

---

# 10. Summary Placement

Add one bounded Goal Activity section inside the existing History/Summary flow.

Canonical ordering:

```text
Historical range
Shared plan coverage

Goal Activity

Generic Planning
Generic Execution
```

Do not move generic Planning or Execution into Goal Activity.

Do not replace existing Summary metrics.

---

# 11. Goal Activity Heading

Use:

> **Goal Activity**

Do not use:

* Progress;
* Goal Progress;
* Goal Performance;
* Goal Health.

---

# 12. Goal Activity Explanation

Use canonical copy or semantically equivalent concise copy:

> **Goal Activity shows historical work explicitly linked to this Goal. It does not measure Goal completion.**

This explanation must remain visible enough to establish scope.

Do not bury it only in tooltip/help text.

---

# 13. Goal Selector

Provide one labelled Goal selector.

Preferred implementation:

* native `<select>` where consistent with current UI;
* explicit placeholder:

  * `Choose a Goal`;
* lifecycle-labelled groups:

  * Active;
  * Completed;
  * Archived.

Do not build cards/grid selectors.

---

# 14. Goal Selection State

Selected Goal ID is ephemeral UI state.

Do not persist to:

* localStorage;
* Goal authority;
* Summary cache;
* Backup.

---

# 15. No Automatic Selection

Task 5.8 recommends explicit selection.

Do not silently select the first Goal unless current product conventions strongly require it and the audit assumptions prove otherwise.

Preferred initial state:

```text
Choose a Goal
```

---

# 16. Goal Ordering

Within selector groups:

1. active;
2. completed;
3. archived.

Within each group use the canonical existing Goal ordering.

Do not add Goal ordering authority.

---

# 17. Goal Lifecycle Labels

Lifecycle must be textual.

Use:

* Active;
* Completed;
* Archived.

Do not introduce success/failure semantics.

---

# 18. No Goals State

If Goal authority is ready and contains no Goals:

show:

> **No Goals yet. Goals can be created in Planner.**

Provide navigation-only:

> **Open Planner**

Do not add Goal creation in Summary.

---

# 19. Planner Handoff

Implement only:

```text
Summary
    Open Planner
        ↓
Planner / Plan
```

Do not:

* deep-select Goal;
* introduce router;
* mutate Goal;
* open Goal editor automatically.

---

# 20. Current Goal Context

Once selected, show current authored context.

At minimum:

* current title;
* lifecycle status.

Where present and useful:

* description;
* target date.

Do not show:

* raw Goal revision;
* Goal UUID;
* measurement-policy ID/version.

---

# 21. Current Goal Heading

Use current Goal title as the selected Goal heading.

Example:

```text
Goal Activity

Security+ Certification
Active
Target date: November 30
```

---

# 22. Target Date

Show factual copy only:

> `Target date: <date>`

Do not show:

* overdue;
* days remaining;
* pace;
* urgency;
* behind;
* on track.

---

# 23. Goal Description

Display if present and if it does not create excessive density.

Use authored text only.

Do not summarize or interpret it.

---

# 24. Shared Range

Goal Activity uses the exact submitted Summary date range.

Do not create a Goal-specific date selector.

---

# 25. Shared Evaluation Cutoff

One Summary refresh captures one evaluation cutoff.

Pass that same cutoff to:

* generic historical queries;
* Goal Activity.

Goal Activity must describe the same historical snapshot as the rest of Summary.

---

# 26. Goal Selection and Cutoff

Changing selected Goal:

* starts a Goal Activity request;
* uses the existing current Summary cutoff;
* does not silently refresh the cutoff.

This preserves cross-section temporal coherence.

---

# 27. Summary Refresh

Refreshing Summary:

1. captures new cutoff;
2. runs generic Summary queries;
3. runs Goal Activity for selected Goal if one remains selected.

Do not retain old Goal Activity as though it belongs to the new cutoff while query is pending unless explicitly marked stale/loading.

---

# 28. Async Request Identity

Extend the existing stale-request/request-generation guard.

At minimum stale responses must be rejected when:

* range changed;
* Summary refresh occurred;
* Goal selection changed;
* selected Goal disappeared;
* authority replacement/clear occurred.

No stale request may overwrite current selection/range state.

---

# 29. Section-Local Loading

Goal Activity loading must not blank already-valid generic Summary Planning/Execution sections.

Use a section-local loading state.

---

# 30. Section-Local Error

Goal Activity query failure must not erase unrelated generic Summary results.

Display a local Goal Activity error.

---

# 31. Goal Authority Initializing

If Goal authority is initializing:

* selector/Goal Activity should show loading state;
* do not show `No Goals yet`.

---

# 32. Goal Authority Protected

If Goals are protected/unavailable:

* suppress Goal selection/activity interpretation;
* show explicit Goal recovery/unavailable state;
* preserve unrelated generic Summary metrics where safe.

Do not reconstruct current Goals from HistoricalPlan.

---

# 33. HistoricalPlan Protected

HistoricalPlan protection invalidates Goal Activity.

Suppress Goal Activity counts.

Existing Summary historical metrics should follow their current governed protection behavior.

---

# 34. ExecutionHistory Protected

Preserve valid Goal planning activity.

Show canonical copy:

> **Planning activity is available, but reported outcomes cannot be interpreted right now.**

Do not suppress the Goal-linked planning distribution merely because execution evidence is protected.

---

# 35. Three-Coverage Block

Within selected Goal Activity, add one bounded coverage block.

Use three compact labelled rows:

```text
Plan coverage
Goal-link coverage
Reporting coverage
```

Do not use three standalone cards.

---

# 36. Plan Coverage Row

Reuse existing canonical plan-coverage language and counts.

Examples may include:

```text
Plan coverage
31 of 31 days available
```

or existing equivalent.

Do not create Goal-specific plan coverage semantics.

---

# 37. Plan Coverage Incomplete

Display existing missing-date disclosure.

Known Goal Activity counts may remain visible if canonical projection returns them.

---

# 38. Plan Coverage Unavailable

Do not show unsupported Goal Activity distributions as meaningful zeroes.

---

# 39. Goal-Link Coverage Row

Explain whether Goal relationships were captured for eligible historical occurrences.

Use counts where supported.

Possible:

```text
Goal-link coverage
18 eligible occurrences captured
3 legacy occurrences unavailable
```

Follow actual projection contract.

Do not use a percentage.

---

# 40. Goal-Link Coverage Complete

Complete means:

> Goal relationships were captured for every eligible historical occurrence in known plan evidence.

It does **not** mean every occurrence supported this Goal.

---

# 41. Goal-Link Coverage Incomplete

Use the canonical legacy limitation:

> **Some history predates Goal-link tracking, so Goal relationships are unavailable for those records.**

Show known Goal Activity counts without extrapolating.

---

# 42. Goal-Link Coverage Unavailable

If all relevant eligible history lacks Goal provenance:

do not show zero Goal-linked activity.

Explain that Goal relationships were not recorded for that period.

---

# 43. Known-Zero State

Only when projection proves Goal-aware known empty:

> **No Goal-linked activity was recorded in this range.**

Do not show:

* no progress;
* nothing accomplished;
* 0% progress.

---

# 44. Reporting Coverage Row

Describe only historically Goal-linked scheduled occurrences.

Use existing Goal Activity reporting coverage.

Examples:

```text
Reporting coverage
7 of 10 linked scheduled occurrences reported
```

No percentage required.

---

# 45. Reporting Not Applicable

If no linked scheduled occurrences exist:

show:

> **Not applicable — no Goal-linked work reached the schedule in this range.**

or canonical equivalent.

Do not show 0%.

---

# 46. Reporting Incomplete

`Not reported` remains an execution category and coverage limitation.

Do not turn it into failure.

---

# 47. Planning Distribution

Add a nested Planning section.

Heading/copy should establish scope.

Example:

> **Planning**
>
> How intended work linked to this Goal appeared in the historical plan.

---

# 48. Planning Denominator

Show:

> **Linked intended occurrences: N**

No ratio or percentage.

---

# 49. Planning Categories

Render canonical Goal Activity counts:

* Scheduled;
* Unplaced;
* Omitted;
* Blocked.

Reuse existing compact category-grid patterns where appropriate.

---

# 50. Scheduled Copy

Meaning:

> Supporting work received a scheduled placement.

Must not imply execution.

---

# 51. Unplaced Copy

Meaning:

> Supporting work remained without a scheduled placement.

Must not imply skip/failure.

---

# 52. Omitted Copy

Describe only frozen omission.

No inferred reason.

---

# 53. Blocked Copy

Describe only frozen blocked disposition.

No user blame or Capacity inference.

---

# 54. Execution Distribution

Add a nested Execution section below/beside Planning according to responsive layout.

Example explanatory copy:

> **Execution**
>
> What was reported for Goal-linked work that reached the schedule.

---

# 55. Execution Denominator

Show:

> **Linked scheduled occurrences: N**

No completion rate.

---

# 56. Execution Categories

Render:

* Reported completed;
* Partial;
* Skipped;
* Unknown;
* Not reported.

Use canonical underlying category names if existing UI requires shorter labels.

---

# 57. Completed Copy

Prefer:

> **Reported completed**

when scope clarity benefits.

Do not imply Goal completion.

---

# 58. Partial Copy

Categorical only.

No 50% visual treatment.

---

# 59. Skipped Copy

Factual only.

No judgment.

---

# 60. Unknown Copy

Use existing governed meaning.

Do not conflate with Not reported.

---

# 61. Not Reported Copy

Meaning:

> No current report exists for this scheduled occurrence.

---

# 62. No Goal-Linked Scheduled Work

Planning section remains available.

Execution section becomes not applicable.

Do not render five zero categories as though execution evidence existed.

---

# 63. Category Controls

Where category count > 0 and provenance exists:

render category as drill-down button using existing Summary behavior.

Expose:

* category label;
* count;
* `aria-expanded`;
* `aria-controls`.

---

# 64. Zero-Count Categories

Follow current Summary pattern.

Do not make zero-count categories unnecessarily interactive.

---

# 65. One Open Detail

Only one Goal Activity category detail should be open at once.

This keeps density bounded.

Goal Activity detail state should remain separate from generic Planning/Execution detail if necessary.

---

# 66. Planning Evidence Detail

Rows should show user-relevant frozen evidence:

* occurrence title;
* historical date;
* time where scheduled;
* category/source context;
* planning disposition.

Do not show raw IDs.

---

# 67. Execution Evidence Detail

Rows should show:

* occurrence title;
* historical date;
* scheduled time;
* source/category context;
* governed execution outcome;
* existing explanatory outcome copy where appropriate.

---

# 68. Current-vs-Frozen Goal Title

Current Goal title remains section heading.

In an evidence row, if historical frozen title differs:

show:

> **Goal at the time: <frozen title>**

If titles are identical:

do not duplicate the Goal label.

---

# 69. Frozen Lifecycle

Do not prominently show frozen Goal lifecycle on every row.

Retain it in data/provenance.

Only surface if audit implementation discovers a concrete explanatory need.

---

# 70. Frozen Measurement Policy

Do not show raw measurement-policy reference.

---

# 71. Technical Provenance

Do not expose in primary UI:

* Goal IDs;
* occurrence UUIDs;
* plan batch IDs;
* execution record IDs;
* revisions;
* policy versions.

They remain available for deterministic evidence/tests.

---

# 72. Legacy Coverage Detail

For incomplete Goal-link coverage, provide a bounded disclosure.

Prefer affected dates and human-readable occurrence labels where available.

Do not dump raw references.

---

# 73. Known-Unlinked Detail

Do not list every known-unlinked occurrence by default.

A coverage count is sufficient for first UI.

Goal Activity is about linked activity, not enumerating everything that did not support the Goal.

---

# 74. Multi-Goal Explanation

Where a selected Goal Activity result contains evidence that may also belong to another Goal, a concise informational note may be used:

> **One occurrence can support more than one Goal, so activity is shown independently for each Goal.**

Do not show unless useful enough to justify density.

No allocation percentages.

---

# 75. Generic Planning Preservation

Existing Scheduling Realization remains unchanged and visible.

It answers:

> What happened to all intended historical work during planning?

Goal Activity / Planning answers:

> What happened to intended work historically linked to this selected Goal?

Keep scope clear.

---

# 76. Generic Execution Preservation

Existing Scheduled Outcomes remains unchanged.

It answers whole-history scheduled execution.

Goal Activity / Execution is Goal-filtered.

Do not replace peer metrics.

---

# 77. No UI Filtering Shortcut

Do not derive Goal Activity by filtering generic Summary component state.

Call the canonical Goal Activity query.

---

# 78. Current Goal Rename

When Goal title changes:

* selector/current heading updates;
* existing historical frozen labels remain;
* selected Goal ID remains if still present.

---

# 79. Current Goal Lifecycle Change

Selector group may move:

```text
Active → Completed
Active → Archived
```

If selected Goal still exists:

retain selection where practical.

Historical Goal Activity remains unchanged until historical authorities change.

---

# 80. Current Goal Link Change

Link/unlink alone does not change frozen historical Goal Activity.

Summary should not recompute historical membership from current links.

A query may rerun due to subscription changes, but semantic result should remain unchanged for same historical authorities/cutoff.

---

# 81. Selected Goal Removed

Goal V1 has no hard delete, but full clear/legacy restore/replacement may remove the selected Goal.

When selected ID no longer exists:

* clear selection;
* clear Goal Activity result/detail;
* show appropriate no-Goals/choose-Goal state.

---

# 82. Backup V4 Restore

Goal selector refreshes from restored Goal authority.

If selected Goal ID survives restore:

retaining selection is allowed.

If it does not:

clear selection.

No persisted selection restoration.

---

# 83. Backup V3 Restore

Goal authority becomes canonical empty.

Show no-Goals state.

No stale Goal Activity.

---

# 84. Full Clear

Clear:

* selected Goal ID;
* Goal Activity result;
* Goal Activity detail selection.

No stale evidence survives.

---

# 85. Shared Refresh Semantics

Goal Activity should refresh with Summary.

Do not add a separate Goal Activity refresh button unless current Summary architecture requires it.

---

# 86. Request Generation

Implement one robust request-generation or token scheme.

A response may render only if it matches current:

* range;
* evaluation cutoff;
* selected Goal;
* request generation.

Mandatory async test.

---

# 87. Goal Change During Request

Flow:

```text
select Goal A
query A begins
select Goal B
query B begins
A finishes last
```

Expected:

* B remains displayed;
* A response discarded.

Mandatory.

---

# 88. Refresh During Request

Old-cutoff Goal Activity response must not overwrite new refresh.

Mandatory.

---

# 89. Range Change During Request

Old-range response discarded.

---

# 90. Loading Existing Result

Choose behavior consistent with current Summary.

Preferred:

* retain current result only if clearly marked refreshing;
* or clear section result while loading.

Do not show old result under new Goal/range without indication.

Document exact behavior.

---

# 91. Goal Activity Query Error

Show local error and allow future refresh/selection to retry naturally.

Do not add Goal Activity persistence retry because projection is derived.

---

# 92. Accessibility — Section Structure

Use semantic heading hierarchy.

Goal Activity should be clearly nested within Summary.

---

# 93. Accessibility — Selector

Selector has visible label.

Lifecycle grouping must be understandable through option labels/`optgroup`.

---

# 94. Accessibility — Coverage

Coverage block has a group/heading.

Each coverage row states dimension and status in text.

No color-only semantics.

---

# 95. Accessibility — Category Buttons

Reuse existing accessible pattern:

* label;
* count;
* expanded state;
* controlled detail ID.

---

# 96. Accessibility — Inserted Detail

Keyboard-opened detail receives focus according to Task 4.7 behavior.

Pointer activation does not steal focus.

---

# 97. Accessibility — Focus After Goal Selection

After Goal selection/result load:

do not unexpectedly move focus away from selector.

The selected Goal heading should provide understandable reading context.

---

# 98. Accessibility — Planner Handoff

Accessible label should indicate destination.

Example:

> **Open Planner**

Do not imply it directly edits the Goal.

---

# 99. Accessibility — Loading

Use semantic status/live region where current Summary does.

Avoid excessive live announcements for every count.

---

# 100. Accessibility — Error/Protection

Use alert/status semantics as appropriate.

---

# 101. Responsive Layout

On narrow screens stack:

```text
Goal context
Coverage
Planning
Execution
Evidence
```

vertically.

---

# 102. Coverage Responsive Behavior

Keep three coverage rows stacked/compact.

Do not convert to a horizontally dense grid.

---

# 103. Category Grid Responsive Behavior

Reuse existing responsive category grid.

Collapse naturally to fewer columns/stacked layout.

---

# 104. Evidence Responsive Behavior

Use stacked rows/cards.

No wide table.

---

# 105. Selector Responsive Behavior

Selector may become full width on narrow screens.

---

# 106. Density Control

Do not render all Goals simultaneously.

Do not expand evidence by default.

Use:

* one selected Goal;
* compact context;
* three coverage rows;
* distributions;
* one inserted detail.

---

# 107. Visual Hierarchy

Canonical order:

```text
Goal Activity
selected Goal context
scope explanation
coverage
Planning
Execution
detail
```

Do not make Goal Activity visually more dominant than Summary itself.

---

# 108. No Progress Visualization

Do not add:

* progress bar;
* radial progress;
* percentage;
* trend arrow;
* red/yellow/green Goal grade;
* completion gauge.

---

# 109. No Motivational Decoration

Avoid success/failure celebratory or punitive states based on distributions.

No:

* Great job;
* Needs work;
* Falling behind.

---

# 110. No Target-Date Decoration

Do not color target dates by proximity.

---

# 111. No Recommendation Copy

Do not say:

* Consider;
* You should;
* DayFrame recommends;
* Try changing.

Goal Activity is observation only.

---

# 112. No Causal Copy

Do not say:

> This happened because...

unless evidence explicitly provides cause—which it currently does not.

---

# 113. No Aggregate Completion Language

Do not label execution distribution:

* completion;
* completion rate;
* Goal completion.

Use:

> Execution

or:

> Scheduled outcomes

within Goal Activity.

---

# 114. Product Copy

Use the 5.8 canonical decisions.

At minimum:

### Scope

> Goal Activity shows historical work explicitly linked to this Goal. It does not measure Goal completion.

### Known zero

> No Goal-linked activity was recorded in this range.

### Legacy

> Some history predates Goal-link tracking, so Goal relationships are unavailable for those records.

### Protected execution

> Planning activity is available, but reported outcomes cannot be interpreted right now.

---

# 115. Existing Summary Range Empty/Invalid

Goal Activity should follow the same query validity behavior as existing Summary sections.

Do not run Goal Activity for invalid range.

---

# 116. Published-Empty Window

If plan coverage is complete and days are published empty:

show truthful no-intended-work state.

Do not call it missing Goal Activity.

---

# 117. Goal-Aware Known Zero

If effective plan contains eligible Goal-aware occurrences but none linked to selected Goal:

show known-zero copy.

---

# 118. Entirely Legacy Goal-Link Window

Do not render four/five zero distributions as though meaningful.

Show Goal-link-unavailable explanation.

---

# 119. Mixed Legacy/New

Render known counts.

Coverage block warns limitation.

Do not extrapolate.

---

# 120. No Reports

Execution distribution can legitimately consist entirely of:

```text
Not reported
```

This is not protection or unavailable history.

---

# 121. Execution Protected

Distinct from No Reports.

Do not render Not reported when ExecutionHistory is protected.

---

# 122. Goal Protected

Distinct from No Goals.

---

# 123. HistoricalPlan Protected

Distinct from missing plan days.

---

# 124. Testing — Basic Selection

Test:

```text
Summary
→ Goal Activity
→ Choose Goal
```

Expected:

* query receives selected Goal;
* shared range;
* shared cutoff;
* current Goal context renders.

---

# 125. Testing — Goal Groups

Active/completed/archived options render in lifecycle order.

All remain selectable.

---

# 126. Testing — Scope Copy

Assert Goal Activity explicitly states that it does not measure Goal completion.

---

# 127. Testing — Coverage

Cover:

* complete all dimensions;
* incomplete plan;
* mixed Goal-link;
* entirely legacy Goal-link;
* reporting incomplete;
* reporting not applicable.

---

# 128. Testing — Known Zero

Complete Goal-aware history with no linked activity renders canonical known-zero copy.

---

# 129. Testing — Legacy

Legacy Goal-unaware history renders canonical limitation and does not render zero as fact.

---

# 130. Testing — Planning Distribution

All four categories render correct counts.

---

# 131. Testing — Execution Distribution

All five categories render correct counts.

---

# 132. Testing — Execution Protected

Planning remains rendered.

Execution protected copy renders.

No fake Not reported distribution.

---

# 133. Testing — Goal Protected

Goal Activity selection/result suppressed without hiding unrelated generic Summary results.

---

# 134. Testing — HistoricalPlan Protected

Goal Activity suppressed.

Existing governed Summary protection behavior preserved.

---

# 135. Testing — Drill-Down

Planning category button reveals exact matching evidence.

Execution category button reveals exact matching evidence.

Only one Goal Activity detail open at once.

---

# 136. Testing — Frozen Title Difference

Current title:

```text
Security+ Certification
```

Frozen title:

```text
Earn Security+
```

Evidence row shows:

> Goal at the time: Earn Security+

---

# 137. Testing — Frozen Title Same

Do not render duplicate historical Goal label.

---

# 138. Testing — Technical IDs Hidden

Primary rendered detail does not expose raw UUIDs/revisions/batch IDs.

---

# 139. Testing — Goal Selection Race

Goal A response arriving after Goal B selection is ignored.

---

# 140. Testing — Refresh Race

Old-cutoff response ignored after Summary refresh.

---

# 141. Testing — Range Race

Old-range response ignored.

---

# 142. Testing — Selection After Goal Rename

Selected durable Goal remains selected; current heading updates.

---

# 143. Testing — Selection After Lifecycle Move

Selected Goal remains queryable after active→completed/archive if ID remains.

Selector grouping updates.

---

# 144. Testing — Selection After Clear

Selection/result/detail cleared.

---

# 145. Testing — V3 Restore

No Goals state.

No stale result.

---

# 146. Testing — V4 Restore

Selector/options reflect restored Goals.

---

# 147. Testing — Current Link Independence

Current Goal link change without historical republication does not change displayed historical counts for same cutoff.

Use canonical query rather than UI filtering.

---

# 148. Testing — Generic Summary Preservation

Existing:

* Scheduling Realization;
* Scheduled Outcomes;
* reporting coverage

remain rendered and semantically unchanged.

---

# 149. Testing — Read-Only Boundary

Assert no Goal Activity section controls exist for:

* edit;
* complete;
* archive;
* reactivate;
* link;
* unlink;
* save.

---

# 150. Testing — Planner Handoff

Open Planner navigates to:

```text
Planner / Plan
```

No Goal mutation.

No router/deep-link assumption.

---

# 151. Testing — Accessibility

At minimum verify:

* labelled Goal selector;
* lifecycle option groups/labels;
* coverage textual labels;
* category `aria-expanded`;
* category `aria-controls`;
* inserted detail focus on keyboard activation;
* Planner handoff accessible name;
* loading/error semantics.

---

# 152. Testing — Responsive Structure

DOM/CSS tests or inspection should confirm:

* no Goal Activity table;
* stacked narrow layout;
* responsive category grid;
* selector usable at narrow width;
* evidence stacked.

---

# 153. No Progress Test

Assert rendered Goal Activity does not contain:

* `%`;
* `on track`;
* `behind`;
* `completion rate`;
* `progress`;
* `score`;

except the canonical explanatory sentence may use the phrase `does not measure Goal completion`.

Be precise to avoid brittle false positives.

---

# 154. No Recommendation Test

No:

* recommend;
* suggestion;
* should change.

---

# 155. Component Placement

Prefer bounded Goal Activity Summary components.

Possible:

```text
GoalActivitySummarySection
GoalActivityCoverage
GoalActivityPlanning
GoalActivityExecution
GoalActivityEvidenceDetail
```

Exact decomposition should follow codebase conventions.

Do not place the full implementation directly into `DayFrameApp.tsx`.

---

# 156. Summary Component Size

If the current Summary component becomes unwieldy, extract Goal Activity-specific child components only.

Do not conduct broad Summary refactor.

---

# 157. Application Query Boundary

Consume canonical `queryGoalActivity`.

Do not duplicate projection logic in UI.

---

# 158. Goal Subscription Boundary

Use canonical Goal authority/query/subscription to populate selector and current Goal state.

Do not create a second Goal cache.

---

# 159. Current Goal Context Source

Current context comes from Goal authority/query result.

Historical context comes from Goal Activity provenance.

Keep distinct.

---

# 160. No New Persistent State

Do not persist:

* selected Goal;
* open Goal Activity category;
* Goal Activity result;
* coverage details.

---

# 161. Performance

One Goal Activity query per selected Goal/refresh is acceptable.

Do not query once per evidence row.

Do not query all Goals simultaneously.

---

# 162. Privacy

No network.

No telemetry.

No external processing.

No new persisted analytical state.

---

# 163. Manual Product Walkthrough

Where browser validation is available, perform at least:

### Journey A — Select active Goal

```text
Summary
→ Goal Activity
→ Choose active Goal
```

Verify context/coverage/distributions.

### Journey B — Completed Goal

Select completed Goal and verify neutral lifecycle display.

### Journey C — Known zero

Select Goal/range with complete Goal-aware zero activity.

### Journey D — Mixed legacy

Verify limitation copy.

### Journey E — Drill-down

Open Planning and Execution evidence categories.

### Journey F — Planner handoff

Open Planner.

### Journey G — Narrow/mobile

Inspect:

* selector;
* Goal context;
* coverage rows;
* Planning;
* Execution;
* evidence.

Record only what was actually performed.

If browser walkthrough is unavailable, say so explicitly.

---

# 164. Required Summary Structure Matrix

Produce:

| Summary area      | Before 5.9 | After 5.9 |
| ----------------- | ---------- | --------- |
| Range             |            |           |
| Plan coverage     |            |           |
| Goal Activity     |            |           |
| Generic Planning  |            |           |
| Generic Execution |            |           |

---

# 165. Required Goal Selection Matrix

Produce:

| Goal state | Selector group | Selectable? | Writable? |
| ---------- | -------------- | ----------: | --------: |
| active     |                |             |           |
| completed  |                |             |           |
| archived   |                |             |           |

---

# 166. Required Coverage Presentation Matrix

Produce:

| Dimension | UI form | Counts/details | Percentage? |
| --------- | ------- | -------------- | ----------: |
| Plan      |         |                |             |
| Goal-link |         |                |             |
| Reporting |         |                |             |

---

# 167. Required Planning UI Matrix

Produce:

| Category  | Label | Drill-down? | Must not imply |
| --------- | ----- | ----------: | -------------- |
| scheduled |       |             |                |
| unplaced  |       |             |                |
| omitted   |       |             |                |
| blocked   |       |             |                |

---

# 168. Required Execution UI Matrix

Produce:

| Category     | Label | Drill-down? | Must not imply |
| ------------ | ----- | ----------: | -------------- |
| completed    |       |             |                |
| partial      |       |             |                |
| skipped      |       |             |                |
| unknown      |       |             |                |
| not reported |       |             |                |

---

# 169. Required State Matrix

Produce:

| State                    | Goal Activity UI | Generic Summary |
| ------------------------ | ---------------- | --------------- |
| no Goals                 |                  |                 |
| Goal initializing        |                  |                 |
| Goal protected           |                  |                 |
| no plan history          |                  |                 |
| published empty          |                  |                 |
| known zero linked        |                  |                 |
| mixed legacy/new         |                  |                 |
| entirely legacy          |                  |                 |
| no reports               |                  |                 |
| Execution protected      |                  |                 |
| HistoricalPlan protected |                  |                 |

---

# 170. Required Current/Frozen Matrix

Produce:

| Condition       | Heading | Evidence row |
| --------------- | ------- | ------------ |
| same title      |         |              |
| renamed Goal    |         |              |
| completed later |         |              |
| archived later  |         |              |

---

# 171. Required Async Matrix

Produce:

| Change during request  | Stale response rendered? |
| ---------------------- | -----------------------: |
| selected Goal          |                          |
| range                  |                          |
| Summary refresh/cutoff |                          |
| clear                  |                          |
| restore                |                          |

Expected: No.

---

# 172. Required Cross-Surface Matrix

Produce:

| Action                | Summary | Planner |
| --------------------- | ------- | ------- |
| inspect Goal Activity |         |         |
| inspect evidence      |         |         |
| edit Goal             |         |         |
| lifecycle change      |         |         |
| link/unlink           |         |         |
| Open Planner          |         |         |

---

# 173. Required Product-Boundary Matrix

Produce:

| Capability                    | Task 5.9 |
| ----------------------------- | -------- |
| Goal Activity Summary section |          |
| Goal selector                 |          |
| current Goal context          |          |
| coverage                      |          |
| Planning distribution         |          |
| Execution distribution        |          |
| evidence drill-down           |          |
| Planner navigation            |          |
| Goal writes                   |          |
| Progress                      |          |
| Goal score                    |          |
| Recommendations               |          |
| adaptation                    |          |
| routing                       |          |
| persistence                   |          |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited.

---

# 174. Required Copy Matrix

Produce:

| Context                  | Final copy |
| ------------------------ | ---------- |
| Scope                    |            |
| Known zero               |            |
| Legacy history           |            |
| Execution protected      |            |
| No Goals                 |            |
| Reporting not applicable |            |

---

# 175. Required Accessibility Matrix

Produce:

| Element            | Requirement        | Result |
| ------------------ | ------------------ | ------ |
| Goal selector      | labelled           |        |
| lifecycle grouping | semantic/textual   |        |
| coverage           | textual, non-color |        |
| category controls  | expanded/controls  |        |
| evidence           | keyboard focus     |        |
| errors             | alert/status       |        |
| Planner handoff    | destination clear  |        |

---

# 176. Required Responsive Matrix

Produce:

| Element       | Desktop | Narrow |
| ------------- | ------- | ------ |
| Goal selector |         |        |
| context       |         |        |
| coverage      |         |        |
| Planning      |         |        |
| Execution     |         |        |
| evidence      |         |        |

---

# 177. Required Architectural Invariant Assessment

Classify at least:

1. Goal Activity remains derived.
2. Goal Activity remains non-persisted.
3. Summary is the only Goal Activity presentation surface in 5.9.
4. Summary remains read-only.
5. Planner remains Goal write surface.
6. Goal selector is ephemeral.
7. selected Goal is not backed up.
8. selected Goal is not persisted.
9. active Goals are selectable.
10. completed Goals are selectable.
11. archived Goals are selectable.
12. lifecycle affects grouping only.
13. Goal Activity title remains descriptive.
14. scope copy says it does not measure Goal completion.
15. current Goal title is current context.
16. frozen Goal title is historical provenance.
17. frozen title is shown only when different.
18. target date is factual only.
19. target date has no judgment.
20. measurement-policy reference is hidden.
21. one Summary range governs Goal Activity.
22. one Summary cutoff governs Goal Activity.
23. Goal selection does not change cutoff.
24. Goal Activity uses canonical query.
25. UI does not filter generic metrics to manufacture Goal Activity.
26. plan coverage remains separate.
27. Goal-link coverage remains separate.
28. reporting coverage remains separate.
29. no combined coverage indicator exists.
30. coverage is textual.
31. known zero differs from unavailable.
32. Goal-aware zero gets canonical zero copy.
33. legacy history gets canonical limitation copy.
34. missing plan remains distinct.
35. published empty remains distinct.
36. no reports remains distinct.
37. Execution protection remains distinct.
38. Goal protection remains distinct.
39. HistoricalPlan protection remains distinct.
40. Planning categories remain scheduled/unplaced/omitted/blocked.
41. Planning denominator is linked intended occurrences.
42. Execution categories remain completed/partial/skipped/unknown/not reported.
43. Execution denominator is linked scheduled occurrences.
44. no execution section percentage exists.
45. no planning section percentage exists.
46. partial has no numeric weight.
47. skipped has no judgment.
48. completed does not mean Goal completion.
49. unplaced does not mean failure.
50. blocked does not mean incapacity.
51. omitted does not mean abandonment.
52. category evidence is provenance-backed.
53. technical IDs are hidden.
54. one Goal Activity detail is open at once.
55. keyboard detail focus follows existing convention.
56. pointer detail activation does not steal focus.
57. multi-Goal evidence does not imply exclusive allocation.
58. generic Planning remains unchanged.
59. generic Execution remains unchanged.
60. Goal Activity does not replace peer metrics.
61. section-local failure does not erase valid generic metrics.
62. stale Goal requests cannot overwrite current selection.
63. stale range requests cannot overwrite current range.
64. stale cutoff requests cannot overwrite current refresh.
65. clear removes selected Goal Activity state.
66. V3 restore removes Goal Activity selection.
67. V4 restore refreshes Goal selector.
68. Planner handoff navigates only.
69. no router is added.
70. no selected-Goal deep link is added.
71. no Goal edit is added to Summary.
72. no lifecycle write is added.
73. no link/unlink is added.
74. no Progress percentage appears.
75. no Goal score appears.
76. no “on track” appears.
77. no pace appears.
78. no recommendation appears.
79. no adaptation appears.
80. no target-date judgment appears.
81. no causation appears.
82. no motivational judgment appears.
83. no schema change is introduced.
84. no new authority is introduced.
85. no new persistence is introduced.
86. no Backup change is introduced.
87. mobile has no horizontal table dependency.
88. accessibility uses semantic controls.
89. focused validation is green.
90. canonical validation is green.
91. no unresolved stop condition remains.

Use:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Residual debt;
* Stop-condition violation.

---

# 178. Stop Conditions

Stop and report if:

* canonical Goal Activity query cannot be consumed by Summary without duplicating projection logic;
* shared Summary cutoff cannot be passed coherently to Goal Activity;
* Goal selection races cannot be prevented with existing request-generation architecture;
* current Summary component cannot host Goal Activity without a broad redesign;
* Goal Activity state necessarily erases generic Summary metrics on local failure;
* three coverage dimensions cannot be rendered without semantic collapse;
* known zero cannot be distinguished from unavailable in the UI contract;
* current/frozen Goal titles cannot be displayed coherently;
* ExecutionHistory protection cannot preserve valid planning Activity;
* category drill-down requires exposing technical identifiers;
* mobile layout requires a horizontal table;
* Summary must gain Goal writes;
* router/deep-link infrastructure becomes required;
* implementation requires Progress semantics;
* implementation requires Recommendation semantics;
* implementation requires schema/authority/persistence changes.

Do not broaden 5.9 to fix unrelated architecture.

---

# 179. Likely Files

Likely areas:

```text
Summary component
Goal Activity Summary child components
Summary styles
application/store contract
Summary tests
Goal Activity integration tests
navigation composition
governance
```

Do not assume exact filenames before source audit.

---

# 180. Focused Validation

Run focused suites covering:

* Goal Activity Summary integration;
* Goal selector;
* coverage;
* distributions;
* evidence drill-down;
* async race handling;
* Goal protection;
* HistoricalPlan protection;
* ExecutionHistory protection;
* restore/clear;
* Planner handoff;
* accessibility/focus.

Record exact file and test counts.

---

# 181. Full Validation

Before completion run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Record:

* test-file count;
* test count;
* build module count;
* bundle advisory;
* diff result.

If a transient test failure occurs, disclose the initial result, investigate it, and obtain a clean canonical rerun before completion.

---

# 182. Manual Validation

Perform the Task 5.9 walkthrough where browser access is available.

If browser access is not available:

state explicitly:

> Manual visual walkthrough not claimed.

Do not infer final visual polish from tests alone.

---

# 183. Governance

On success update minimally:

* Task 5.9 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` only if implementation introduces an enduring decision not already settled by 5.8.

Do not modify the Goal ADR merely for UI implementation.

---

# 184. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.9_IMPLEMENT_GOAL_ACTIVITY_V1_SUMMARY_INTEGRATION_AND_EVIDENCE_DRILL_DOWN_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.7/5.8 Prerequisite Confirmation
4. Initial Integration Audit
5. Files Changed
6. Summary Placement
7. Goal Activity Heading
8. Scope Explanation
9. Goal Selector
10. Goal Lifecycle Grouping
11. No-Goals State
12. Planner Handoff
13. Current Goal Context
14. Target Date
15. Shared Range
16. Shared Cutoff
17. Goal Selection and Cutoff
18. Async Request Identity
19. Loading Isolation
20. Error Isolation
21. Goal Initialization
22. Goal Protection
23. HistoricalPlan Protection
24. ExecutionHistory Protection
25. Coverage Block
26. Plan Coverage
27. Goal-Link Coverage
28. Reporting Coverage
29. Known-Zero State
30. Legacy-History State
31. Missing-Plan State
32. Published-Empty State
33. Planning Distribution
34. Planning Denominator
35. Planning Category Semantics
36. Execution Distribution
37. Execution Denominator
38. Execution Category Semantics
39. Reporting Not Applicable
40. Drill-Down Controls
41. Planning Evidence
42. Execution Evidence
43. Current-vs-Frozen Goal Title
44. Legacy Coverage Detail
45. Multi-Goal Explanation
46. Generic Planning Preservation
47. Generic Execution Preservation
48. Current Goal Rename
49. Current Lifecycle Change
50. Current Link Change
51. Restore
52. Full Clear
53. Refresh
54. Accessibility
55. Keyboard/Focus
56. Responsive Behavior
57. Density
58. Copy/Terminology
59. No-Progress Boundary
60. No-Recommendation Boundary
61. Tests Added/Changed
62. Focused Validation
63. Full Validation
64. Manual Validation
65. Governance Updates
66. Deviations
67. Discoveries
68. Deferred Work
69. Summary Structure Matrix
70. Goal Selection Matrix
71. Coverage Presentation Matrix
72. Planning UI Matrix
73. Execution UI Matrix
74. State Matrix
75. Current/Frozen Matrix
76. Async Matrix
77. Cross-Surface Matrix
78. Product-Boundary Matrix
79. Copy Matrix
80. Accessibility Matrix
81. Responsive Matrix
82. Architectural Invariant Assessment
83. Stop-Condition Assessment
84. Architectural Alignment Assessment
85. Recommended Next Task
86. Final Completion Determination

---

# 185. Completion Criteria

Task 5.9 is complete only when:

* Goal Activity appears as one bounded read-only section within Summary;
* generic Planning and Execution remain unchanged peer analyses;
* the Summary range remains shared;
* one Summary evaluation cutoff is passed to Goal Activity and peer historical queries;
* Goal selection is explicit and ephemeral;
* Goal selection does not silently refresh the cutoff;
* active, completed, and archived Goals are all selectable with appropriate grouping;
* no-Goals state clearly sends users to Planner without creating a Goal in Summary;
* Planner handoff navigates to Planner / Plan only;
* no router or selected-Goal deep link is introduced;
* selected Goal current title, lifecycle, description where appropriate, and target date are displayed as authored context;
* target date receives no pace, overdue, urgency, success, or failure interpretation;
* raw Goal revision and measurement-policy identity remain hidden;
* Goal Activity scope explicitly states that it does not measure Goal completion;
* plan, Goal-link, and reporting coverage appear as three separate compact textual rows;
* no combined coverage score exists;
* known Goal-aware zero renders as “No Goal-linked activity was recorded in this range” or semantically equivalent canonical copy;
* legacy Goal-unaware history is disclosed rather than treated as known zero;
* missing plan days remain distinct from legacy Goal-link gaps;
* published-empty days remain known zero plan demand;
* reporting not-applicable is distinct from 0% reporting;
* Planning shows linked intended-occurrence denominator and scheduled/unplaced/omitted/blocked counts;
* Execution shows linked scheduled-occurrence denominator and completed/partial/skipped/unknown/not-reported counts;
* no Planning or Execution percentages are introduced;
* partial receives no numeric weighting;
* completed outcome does not imply Goal completion;
* skipped does not imply Goal failure;
* unplaced/blocked/omitted retain their governed descriptive meanings;
* protected ExecutionHistory preserves valid Goal planning activity while suppressing unsupported outcomes;
* protected HistoricalPlan suppresses Goal Activity;
* protected Goal authority suppresses Goal selection/activity without being shown as no Goals;
* Goal Activity loading/error remains section-local where valid generic Summary data exists;
* stale responses from previous Goal/range/cutoff requests cannot overwrite current UI state;
* current Goal rename updates current context without rewriting frozen historical labels;
* frozen historical Goal title appears only when different and is labelled “Goal at the time” or equivalent;
* current Goal link changes without historical republication do not rewrite displayed historical membership;
* technical provenance remains hidden from primary evidence rows;
* category drill-down reuses the established accessible inserted-detail interaction;
* only one Goal Activity category detail is open at once;
* keyboard-opened details receive appropriate focus while pointer activation does not steal focus;
* Goal selector, coverage, lifecycle, category controls, alerts, and handoff are semantically accessible;
* Goal Activity stacks coherently on narrow/mobile layouts;
* no horizontal-table dependency exists;
* evidence remains collapsed until requested;
* one selected Goal prevents an all-Goals density explosion;
* restore and full clear update selection/result state coherently;
* Backup V3 clear-to-empty Goal semantics result naturally in no-Goals UI;
* Backup V4 restore surfaces restored Goal options without persisting prior selection;
* no Goal write controls exist in Summary;
* no Progress percentage, Goal score, Goal health, pace, “on track,” motivational judgment, target-date judgment, recommendation, RecommendationDecision, adaptation, Capacity inference, causation, cross-Goal allocation, machine-learning behavior, or hidden optimization objective is introduced;
* Goal Activity remains non-persisted;
* no authority, schema, Backup, restore, HistoricalPlan, ExecutionHistory, or Goal-domain change is introduced;
* focused validation passes;
* canonical lint, typecheck, full tests, build, and `git diff --check` pass;
* manual visual walkthrough is either performed and truthfully recorded or explicitly not claimed;
* governance records Goal Activity as user-visible Summary intelligence while Progress and Recommendations remain deferred;
* no unresolved integration, async, accessibility, responsive, epistemic, or surface-boundary stop condition remains.

---

# 186. Recommended Next Task

If Task 5.9 completes successfully, the preferred next task is:

> **Task 5.10 — Progress V1 and Measurement-Policy Architecture Audit**

Its purpose should be to determine whether DayFrame is now ready to move from:

```text
Goal Activity
    what historically happened in support of the Goal
```

to:

```text
Progress
    what those facts mean relative to an explicitly authored Goal measurement policy
```

without assuming:

* every Goal is measurable;
* every Goal needs a percentage;
* completed supporting work equals Goal progress;
* target dates imply pace;
* qualitative Goals require numeric conversion.

Task 5.10 should be architecture/audit first.

---

# 187. Final Implementation Principle

> **Goal Activity should make a Goal's supporting history easier to understand without changing what the evidence means.**

---

# 188. Final Completion Statement

**Task 5.9 is complete when DayFrame presents Goal Activity V1 as one bounded, accessible, responsive, read-only section inside Summary using an explicit ephemeral Goal selector across active, completed, and archived Goals; when one shared Summary range and one shared evaluation cutoff govern the Goal Activity query alongside existing historical analyses; when the current Goal title, lifecycle, optional description, and factual target date provide present authored context while frozen historical Goal labels remain independently preserved and surface only when needed to explain changed historical context; when the canonical scope sentence makes clear that Goal Activity reports historical work explicitly linked to a Goal but does not measure Goal completion; when plan coverage, Goal-link coverage, and reporting coverage remain three independent compact textual dimensions; when known Goal-aware zero, legacy Goal-unaware history, missing plan history, published-empty history, no-report evidence, protected Goal authority, protected HistoricalPlan, and protected ExecutionHistory remain visibly and semantically distinct; when historically linked intended occurrences are presented categorically across scheduled, unplaced, omitted, and blocked with an exact linked-intended denominator, and historically linked scheduled occurrences are presented categorically across completed, partial, skipped, unknown, and not reported with an exact linked-scheduled denominator, without percentages, weighting, success inference, or Goal-completion interpretation; when Planning and Execution category controls reuse the existing inserted-detail pattern with deterministic provenance, human-readable occurrence/date/time/context, technical identifiers hidden from primary presentation, and frozen Goal title displayed as “Goal at the time” only when it differs from the current title; when Goal Activity query loading, error, Goal switching, range changes, Summary refresh, restore, clear, and authority replacement are protected by stale-request handling so old async responses cannot overwrite current state; when a Goal Activity-specific error never unnecessarily erases valid generic Planning/Execution Summary sections; when ExecutionHistory protection leaves independently valid planning activity visible while suppressing unsupported execution interpretation; when generic Scheduling Realization and Scheduled Outcomes remain unchanged whole-history peer analyses; when Summary remains strictly read-only and the only operational handoff is navigation to Planner / Plan without router, deep selection, or hidden Goal mutation; when Goal Activity remains usable by keyboard, focus behavior matches existing evidence interactions, coverage semantics are not color-dependent, and narrow/mobile layouts stack selector, context, coverage, Planning, Execution, and evidence without horizontal-table dependence; when Goal Activity selection and disclosure state remain ephemeral and no derived output is persisted or backed up; when no Goal schema, HistoricalPlan schema, ExecutionHistory schema, persistence, Backup, restore, routing, or authority change is introduced; when no Progress percentage, Goal score, Goal performance, Goal health, pace, “on track” state, target-date judgment, Recommendation, RecommendationDecision, adaptive mutation, Capacity inference, motivational judgment, causal claim, cross-Goal allocation, hidden optimization objective, or machine-learning behavior appears; when focused and canonical validation are green; when any manual visual-validation limitation is explicitly disclosed; when governance records Goal Activity as user-visible Summary intelligence while retaining Progress and Recommendations as distinct deferred semantic layers; and when no unresolved product, async, accessibility, responsive, evidence, identity, coverage, or authority stop condition remains.**
