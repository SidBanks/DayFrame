# Task 5.18 — Summary Progress V1 Integration and Provenance

## Status

Ready for implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Bounded Summary integration for Manual Quantity Progress V1, Goal-centric composition, Progress provenance, read-only state handling, accessibility, responsive behavior, async/stale-result protection, regression testing, bundle tracking, and governance.

**No Progress authoring, Measurement Definition authoring, Progress Observation authoring, Recommendation, pace, trend, forecast, or adaptive behavior is authorized.**

---

# 1. Objective

Make the already-implemented Manual Quantity Progress projection visible and understandable in Summary.

For a selected Goal, Summary must be able to show:

* current Goal context;
* measured quantity;
* target quantity;
* unit;
* derived percentage;
* arithmetic comparison state where useful;
* observation timing;
* measurement provenance;
* no-definition;
* insufficient-evidence;
* known zero;
* above-target;
* inactive measurement;
* unsupported policy;
* protected/unavailable authority states.

Goal Activity must remain separate and visible as a sibling analysis.

Task 5.18 does not add writes.

---

# 2. Governing Product Model

The preferred Goal-centric Summary model is now:

```text
Summary

Selected Goal

Progress
    measured Goal state

Activity
    supporting planned/reported work
```

This should replace the current mental separation of Goal Activity as a standalone Goal analysis only if the actual component architecture allows a bounded restructuring without semantic drift.

The important semantic rule is:

```text
Progress
    ≠ Goal Activity
```

Progress answers:

> Where is the measured Goal state relative to the authored quantity target?

Goal Activity answers:

> What historical planned/reported work was explicitly linked to this Goal?

Do not combine their numerators, denominators, or evidence.

---

# 3. Governing Surface Principle

Summary remains read-only.

Task 5.18 may add navigation handoffs such as:

* Open Planner;
* Configure Measurement;
* Record Current Value;

only if those actions navigate to the existing Planner workflow.

Summary must not itself mutate:

* Goal;
* Measurement Definition;
* Progress Observation.

---

# 4. Governing Progress Principle

For `manualQuantityTarget@1`:

```text
Progress numerator
    = effective Progress Observation value

Progress denominator
    = effective Measurement Definition targetValue
```

The UI must never imply that:

* scheduled work;
* completed work;
* Goal Activity;
* Goal lifecycle;
* target date;

contributes mathematically.

---

# 5. Governing Quantity-First Principle

Primary presentation should emphasize:

```text
12,400 of 50,000 words
```

before:

```text
24.8%
```

The percentage is a derived interpretation of explicit quantity evidence.

Do not make the percentage the only visible Progress meaning.

---

# 6. Governing Lifecycle Principle

These combinations are valid:

```text
Goal: Active
Progress: 100%
```

```text
Goal: Completed
Progress: 40%
```

```text
Goal: Active
Progress: 125%
```

Do not resolve these “inconsistencies” automatically.

Goal lifecycle is authored authority.

Progress is derived measurement.

---

# 7. Explicit Scope

Implement:

* Summary Progress section;
* selected-Goal Progress query integration;
* Goal-centric Progress + Activity composition;
* quantity-first presentation;
* percentage presentation;
* arithmetic comparison presentation where useful;
* current Goal context;
* observation timing;
* Progress provenance;
* no-definition state;
* inactive-definition state;
* unsupported-policy state;
* insufficient-evidence state;
* known-zero state;
* below-target state;
* at-target state;
* above-target state;
* Goal/Measurement/Observation protection states;
* loading/error states;
* Planner navigation handoffs;
* refresh/cutoff integration;
* stale-request handling;
* accessibility;
* keyboard/focus behavior;
* responsive/mobile behavior;
* tests;
* bundle tracking;
* governance.

---

# 8. Explicit Non-Goals

Do not implement:

* Measurement configuration in Summary;
* observation entry in Summary;
* observation correction/retraction in Summary;
* Progress bar unless audit evidence proves it is required;
* target-date pace;
* on-track/ahead/behind;
* trend;
* forecast;
* Recommendation;
* RecommendationDecision;
* adaptation;
* Goal auto-completion;
* Goal score;
* composite score;
* Goal comparison;
* historical Progress chart;
* unit conversion;
* custom units;
* new measurement policies;
* activity-to-progress inference;
* causal interpretation;
* bundle/code-splitting work.

---

# 9. Execution Artifact Rules

Before implementation:

1. verify the complete Task 5.18 artifact;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.14 result;
   * Task 5.15 result;
   * Task 5.16 result;
   * Task 5.17 result;
   * `queryGoalProgress`;
   * Goal Activity Summary implementation;
   * Summary selection/range/cutoff logic;
   * Goal selector;
   * Goal Activity loading/error/protection;
   * stale-request guards;
   * inserted-detail/focus behavior;
   * Planner navigation;
   * GoalMeasurementSection;
   * GoalProgressReportingSection;
   * responsive Summary styles;
6. do not modify the immutable Task 5.18 artifact.

Create:

`docs/implementation/phase-5/TASK_5.18_SUMMARY_PROGRESS_V1_INTEGRATION_AND_PROVENANCE_RESULT.md`

---

# 10. Required Initial Audit

Before changing code, confirm:

* current Summary Goal selector ownership;
* current Goal Activity section hierarchy;
* current shared range/cutoff model;
* whether selected Goal state already drives Goal Activity;
* exact `queryGoalProgress` result contract;
* exact protection/status values;
* exact current Goal context returned by Progress projection;
* exact provenance fields;
* current Summary async request generation;
* current navigation method back to Planner.

Stop if the actual Progress result cannot support truthful presentation without changing the projection.

---

# 11. Goal Selector Reuse

Reuse the existing Goal selector established for Goal Activity.

Do not add a second selector for Progress.

Selected Goal drives both:

```text
Progress
Activity
```

for the same Goal.

---

# 12. Goal-Centric Composition

Preferred structure:

```text
Goal Activity / Goals area

Goal selector

Selected Goal context

Progress
    ...

Activity
    ...
```

Task 5.18 may restructure the existing Goal Activity section into a bounded Goal-centric container if this can be done without changing Goal Activity semantics.

Do not restructure the entire Summary page.

---

# 13. Current Goal Context

For selected Goal show current authored context as already established:

* current title;
* lifecycle;
* optional target date where currently shown;
* optional description if current density allows.

Do not imply this context is historical as-of the Progress cutoff.

---

# 14. Current-vs-Historical Clarification

Measurement Definition and Observation evidence are cutoff-governed.

Goal title/lifecycle are current.

If necessary, use bounded copy such as:

> Progress uses measurement records known at the selected evaluation cutoff. Goal details shown here reflect the current Goal.

Only add this if needed to prevent misinterpretation.

Do not overburden the default UI.

---

# 15. Progress Heading

Use:

**Progress**

Do not use:

* Manual Quantity Progress;
* Goal Performance;
* Goal Health;
* Completion Score.

---

# 16. Progress Scope Copy

Use concise explanatory copy such as:

> Progress compares the latest recorded value for this Goal with its active quantity target.

Do not imply:

* plan completion;
* supporting activity;
* pace;
* likelihood of success.

---

# 17. Available Progress Presentation

For an available result, show at minimum:

```text
12,400 of 50,000 words
24.8%
```

Optional secondary:

```text
Observed Aug 24
```

Do not require technical provenance to understand the primary card.

---

# 18. Quantity Formatting

Use user-friendly display formatting.

Examples:

```text
12,400
50,000
24.8%
```

Do not alter canonical stored/projection values.

Formatting is presentation only.

Audit locale behavior carefully.

---

# 19. Percentage Formatting

The projection returns deterministic canonical percentage semantics.

UI may trim/display a bounded number of decimal places.

Preferred:

* preserve exact integers cleanly:

  * `100%`;
* preserve one-decimal values:

  * `24.8%`;
* avoid unnecessarily showing four decimal places unless meaningful;
* retain exact canonical value in provenance/accessibility if UI rounds.

Do not change projection arithmetic.

Document the display rule.

---

# 20. Repeating Decimal Presentation

Example projection:

```text
33.3333
```

Potential UI:

```text
33.33%
```

or:

```text
33.3%
```

Choose one explicit display rule.

Do not let JavaScript floating formatting introduce inconsistency.

Use string-safe formatting where possible.

---

# 21. Progress Bar Decision

Task 5.15 recommended deferring a bar.

Default Task 5.18 rule:

> Do not add a Progress bar.

Reasons:

* > 100% is valid;
* 100% does not equal lifecycle completion;
* bars visually imply bounded completion;
* textual quantity + percentage already communicates V1 semantics.

Only add one if actual UI density testing proves it materially improves clarity and can handle >100% truthfully.

If omitted, record this as intentional.

---

# 22. Comparison State

The projection may expose:

* belowTarget;
* atTarget;
* aboveTarget.

If surfaced, use arithmetic-only copy.

Preferred:

```text
Below target
At target
Above target
```

Avoid:

* behind;
* on track;
* ahead;
* success;
* done.

It is acceptable to omit comparison text if quantity/percentage are sufficient.

Document the choice.

---

# 23. Known Zero

If explicit observation value is zero:

```text
0 of 50,000 words
0%
```

This is known measured zero.

Do not show:

* No current value recorded;
* No Progress data;
* Not started;

unless another authority explicitly supports those meanings.

---

# 24. No Measurement Definition

For `notDefined` because no active measurement exists:

Differentiate:

### Never measured

> No quantity measurement configured.

### Measurement stopped

> Measurement is currently stopped.

Use the available definition/history context from current Goal/Measurement queries if Progress result alone cannot distinguish them.

Do not show 0%.

---

# 25. Insufficient Evidence

Definition exists but no effective observation:

```text
Target
50,000 words

No current value recorded.
```

Do not show:

```text
0%
```

This state should make it obvious that the target exists, but measured evidence does not.

---

# 26. Unsupported Policy

Show:

> This measurement method is not supported by this version of DayFrame.

Do not coerce it into Manual Quantity.

---

# 27. Goal Missing

If selected Goal disappears due to clear/restore/authority replacement:

* clear selection using existing semantics;
* clear Progress result;
* do not leave stale Goal card.

---

# 28. Goal Protected

Suppress Progress interpretation.

Preserve unrelated Summary sections where safe.

Use recovery language.

---

# 29. Measurement Definition Protected

Progress unavailable.

Do not interpret as no measurement.

---

# 30. Progress Observation Protected

Progress unavailable.

Do not interpret as no current value.

---

# 31. Error State

Query failure remains distinct from:

* no definition;
* insufficient evidence;
* protection.

Use section-local error.

Do not blank unrelated Summary metrics.

---

# 32. Loading State

Changing Goal or refreshing Summary must not display stale Progress under the new context without an explicit refreshing state.

Use bounded loading semantics.

---

# 33. Shared Evaluation Cutoff

Progress must use the same Summary evaluation cutoff as Goal Activity and existing historical analyses where current semantics permit.

Changing selected Goal must **not** silently create a new cutoff.

Refreshing Summary may create a new cutoff.

---

# 34. Summary Range

Manual Quantity Progress is cutoff-based, not range-based.

The current Summary historical date range still governs Goal Activity and generic historical metrics.

Progress should not pretend the range is its denominator/window.

Potential explanatory model:

```text
History range
    governs Activity/history sections

Evaluation cutoff
    governs Progress state known as of refresh
```

Do not add a second date-range selector for Progress.

---

# 35. Progress Query Composition

For selected Goal:

```text
queryGoalProgress({
    goalId,
    evaluationAsOf
})
```

Do not query Progress without explicit cutoff.

---

# 36. Query Concurrency

Goal Activity and Progress may be queried concurrently.

Avoid serial dependencies if none exist.

---

# 37. Stale Request Identity

Progress stale-result protection must include at least:

* selected Goal;
* evaluation cutoff;
* Summary refresh generation;
* selected Goal disappearance;
* clear/restore.

Old Goal A result must never render under Goal B.

---

# 38. Goal Selection Race

Mandatory test:

```text
select Goal A
query A begins

select Goal B
query B begins

A resolves last
```

Expected:

* B remains displayed;
* A discarded.

---

# 39. Refresh Race

Old-cutoff Progress response must not overwrite newer refresh result.

---

# 40. Clear/Restore Race

Old Progress response must not reappear after:

* full clear;
* restore;
* Goal authority replacement.

---

# 41. Goal Activity Preservation

Goal Activity remains semantically unchanged.

If moved under a Goal-centric container:

* reuse canonical Goal Activity query;
* preserve coverage;
* preserve Planning/Execution distributions;
* preserve evidence drill-down;
* preserve accessibility/focus;
* preserve protection behavior.

Do not rewrite Goal Activity logic while integrating Progress.

---

# 42. Progress / Activity Distinction Copy

Provide one concise explanation.

Example:

> Progress reflects recorded measurement toward this Goal's quantity target. Activity reflects historical work linked to the Goal.

This should be enough.

Do not turn it into a tutorial.

---

# 43. No Cross-Projection Arithmetic

Do not calculate:

* Activity completion rate vs Progress;
* correlation;
* efficiency;
* “supporting work produced X% Progress”;
* “Progress per completed task.”

---

# 44. Progress Provenance

Provide a bounded read-only provenance interaction.

Possible action:

**How this Progress was calculated**

or:

**View measurement details**

Prefer product language over architecture terminology.

---

# 45. Provenance Content

For available Manual Quantity Progress show:

```text
Measurement method
Quantity toward a target

Target
50,000 words

Recorded value
12,400 words

Observed
Aug 24, 2026, 6:10 AM

Recorded in DayFrame
Aug 24, 2026, 6:12 AM

Evaluation cutoff
...
```

Only show `recordedAt` if it adds meaningful historical transparency.

Do not expose by default:

* definition ID;
* definition revision;
* observation ID;
* observation revision;
* fingerprints;
* raw policy identifier.

---

# 46. Policy Label

Translate:

```text
manualQuantityTarget@1
```

to product language:

> Quantity toward a target

Do not display raw identity unless a diagnostic/developer mode already exists.

---

# 47. Measurement Period Provenance

If useful, provenance may state:

> This Progress uses the measurement target active at the evaluation cutoff.

Do not expose “epoch” terminology.

---

# 48. Current Goal vs Measurement Provenance

If Goal title/lifecycle are current rather than as-of:

do not include them in provenance as though historically frozen.

---

# 49. Provenance Interaction Pattern

Reuse existing Summary inserted-detail pattern if suitable.

Desired behavior:

* collapsed by default;
* button has `aria-expanded`;
* button has `aria-controls`;
* keyboard activation focuses inserted detail according to established Task 4.7 conventions;
* pointer activation does not steal focus.

---

# 50. One Open Detail

If Progress provenance and Goal Activity evidence can both be opened:

determine whether they share one detail slot or maintain independent slots.

Prefer bounded density.

Do not allow many large expanded panels simultaneously unless current Summary architecture already does.

---

# 51. Planner Handoffs

Summary may offer navigation-only handoffs.

Potential:

### No measurement

**Configure Measurement**

### Insufficient evidence

**Record Current Value**

### Available Progress

possibly:

**Open Planner**

or no action.

These must navigate to Planner / Plan.

Do not mutate authority from Summary.

---

# 52. Handoff Scope

No selected-Goal deep-link infrastructure is required unless existing app composition already supports it.

Task 5.15 explicitly preferred navigation-only over new routing complexity.

Do not add a router.

---

# 53. No-Measurement Handoff

If no Measurement Definition:

navigation copy:

**Configure Measurement in Planner**

or concise equivalent.

Do not open Measurement form directly from Summary unless existing component state makes it trivial and bounded without routing work.

Default: navigate only.

---

# 54. Insufficient-Evidence Handoff

Possible:

**Record Current Value in Planner**

Again navigation only.

---

# 55. Inactive Measurement Handoff

Possible:

**Open Planner to Restart Measurement**

No Summary write.

---

# 56. Archived Goal

Archived Goals remain selectable in Summary according to existing Goal selector behavior.

Progress may remain inspectable.

Do not provide reporting/configuration handoff language that implies archived Goal is writable without reactivation.

If needed:

> Reactivate this Goal in Planner before recording new values.

Navigation only.

---

# 57. Completed Goal

Completed Goal Progress remains inspectable.

If measurement remains active and evidence exists:

show it normally.

Do not suppress because lifecycle is Completed.

---

# 58. Target Date

If currently shown in Goal context, retain as authored context.

Do not compute:

* time remaining;
* overdue;
* pace;
* expected Progress;
* required daily rate.

---

# 59. Above-Target

For:

```text
60,000 of 50,000 words
120%
```

show exact value and unclamped percentage.

Do not visually cap at 100.

Do not label as:

* exceeded goal successfully;
* overachieved;
* complete.

Optional arithmetic text:

> Above target

only.

---

# 60. At-Target

For:

```text
50,000 of 50,000 words
100%
```

do not label Goal complete unless lifecycle says Completed.

---

# 61. Below-Target

For:

```text
12,400 of 50,000 words
24.8%
```

avoid “only 24.8%.”

Neutral presentation only.

---

# 62. Decreasing Observations

Progress may decrease because observations are absolute measured state.

Do not show warning arrows, loss badges, or regression judgment.

Task 5.18 is not a trend surface.

---

# 63. Observation Correction Effects

If latest effective observation changes through correction:

Progress changes naturally on refresh/subscription/cutoff semantics.

Do not call it “Progress adjustment” as authored state.

---

# 64. Observation Retraction Effects

If effective evidence disappears:

Progress may become insufficientEvidence.

Do not retain stale percentage.

---

# 65. Measurement Revision Effects

Target/unit revision begins a new measurement period.

If no new observation exists:

Summary must show insufficientEvidence, not old Progress.

---

# 66. Stop Measurement Effects

After stop cutoff:

Progress is notDefined/currently stopped.

Do not retain old Progress as current.

Historical Progress UI remains deferred.

---

# 67. Restart Effects

Restart without new evidence:

insufficientEvidence.

Old observation does not carry forward.

---

# 68. Unit Change

No conversion.

Old values remain prior-period evidence.

Current Progress waits for a compatible observation.

---

# 69. Progress Persistence Boundary

Do not persist any Summary Progress state/result.

---

# 70. Backup Boundary

Backup V6 remains unchanged.

Derived Progress is not serialized.

---

# 71. Restore Boundary

Restore authorities, then re-query Progress.

No restored UI cache.

---

# 72. Full Clear

Clear:

* selected Goal;
* Progress result;
* provenance detail;
* any loading generation.

Do not leave stale Progress visible.

---

# 73. Subscription Strategy

Audit current Summary behavior.

Preferred:

* Summary refresh controls cutoff;
* Goal/Measurement/Observation subscription changes may invalidate/refetch selected Goal Progress while preserving cutoff.

Do not silently move cutoff merely because underlying authority changes.

Document actual behavior.

---

# 74. Current Authority Changes After Cutoff

This is subtle.

If Observation changes after Summary cutoff:

a query at the same cutoff should preserve as-of semantics.

Do not display newly recorded evidence under the old cutoff unless its `recordedAt <= cutoff`.

If refresh creates a new cutoff, new evidence may appear.

Mandatory test where practical.

---

# 75. Information Architecture

Preferred selected Goal block:

```text
Selected Goal

Progress
    quantity
    percentage
    status/provenance

Activity
    existing Goal Activity content
```

Keep generic whole-history Planning/Execution sections below unchanged.

---

# 76. Density

Do not render Progress for all Goals at once.

One selected Goal remains the V1 interaction.

---

# 77. Progress Card

Use a bounded card/section consistent with Summary.

Avoid large dashboard graphics.

---

# 78. Accessibility — Quantity

Screen-reader output must communicate:

* current quantity;
* target;
* unit;
* percentage.

Do not rely on visual grouping alone.

---

# 79. Accessibility — Percentage

If percentage is visually prominent, ensure accessible text includes the underlying quantity.

---

# 80. Accessibility — Comparison

If comparison state is shown, text must carry meaning.

No color-only state.

---

# 81. Accessibility — Provenance

Provenance button:

* visible label;
* `aria-expanded`;
* `aria-controls`.

Inserted detail follows existing focus convention.

---

# 82. Accessibility — Handoffs

Navigation links/buttons should name destination/action clearly:

* Configure Measurement in Planner;
* Record Current Value in Planner.

Do not imply the write happens inside Summary.

---

# 83. Accessibility — Loading/Error

Use semantic status/alert patterns.

Avoid excessive live announcements on every refresh.

---

# 84. Responsive Layout

On mobile:

```text
Goal context
Progress
Activity
```

stack vertically.

No table dependency.

---

# 85. Mobile Quantity Hierarchy

Prefer:

```text
12,400
of 50,000 words

24.8%
```

or another readable stacking.

Do not force all data into one line.

---

# 86. Mobile Provenance

Use stacked detail rows.

No wide table.

---

# 87. Mobile Activity Preservation

Existing Goal Activity mobile layout must remain functional after composition changes.

---

# 88. Query Performance

For one selected Goal:

* one Progress query;
* one Goal Activity query.

No all-Goal Progress scan.

No per-provenance-row query.

---

# 89. Generic Summary Preservation

Do not change:

* Scheduling Realization;
* Scheduled Outcomes;
* generic reporting coverage;
* Plan coverage semantics.

---

# 90. No Recommendation Leakage

Do not say:

* Keep going;
* You should;
* Consider changing target;
* You're doing well;
* Needs attention;
* At this rate.

---

# 91. No Goal Score

Do not combine Progress and Activity into one score.

---

# 92. No Causation

Do not claim Activity caused Progress.

---

# 93. No Pace

Do not use target date/time elapsed.

---

# 94. No Trend

Do not compare current observation to prior observation visually or textually as a trend.

---

# 95. No Forecast

Do not estimate completion date.

---

# 96. Component Placement

Prefer bounded Summary child component(s), e.g.:

```text
GoalSummarySection
    GoalProgressSummary
    GoalActivitySummary
```

or repository-consistent equivalents.

Do not substantially enlarge `DayFrameApp`.

---

# 97. Application Boundary

Use canonical:

```text
queryGoalProgress
```

through store/application contract.

Do not import domain projection directly into React if existing architecture routes through store.

---

# 98. Progress Presentation Helper

A small pure presentation formatter for:

* quantities;
* percentage display;
* labels;

is acceptable.

Do not duplicate projection semantics.

---

# 99. Percentage Display Helper

If formatting canonical percentage strings, keep helper deterministic and string-based.

No floating-point re-computation.

---

# 100. Tests — Available Progress

Cover:

```text
12,400 / 50,000
→ quantity
→ 24.8%
```

---

# 101. Tests — Zero

Cover:

```text
0 / 50,000
→ 0%
```

distinct from insufficientEvidence.

---

# 102. Tests — At Target

Cover:

```text
50,000 / 50,000
→ 100%
```

with Active lifecycle remaining Active.

---

# 103. Tests — Above Target

Cover:

```text
60,000 / 50,000
→ 120%
```

unclamped.

No success/complete language.

---

# 104. Tests — Completed Below Target

Completed Goal + 40%.

Both facts visible neutrally.

---

# 105. Tests — No Definition

No 0%.

Correct configuration handoff.

---

# 106. Tests — Stopped

No stale prior Progress as current.

Restart handoff if applicable.

---

# 107. Tests — Insufficient Evidence

Target visible.

No percentage.

Record-value handoff.

---

# 108. Tests — Unsupported

Explicit unsupported state.

No Manual Quantity coercion.

---

# 109. Tests — Protection

Goal/Definition/Observation protection remains explicit.

No fake zero/no data.

---

# 110. Tests — Progress/Activity Distinction

Both sections present for same selected Goal.

Copy clearly distinguishes them.

No cross arithmetic.

---

# 111. Tests — Provenance

Open provenance.

Verify:

* measurement method;
* target;
* observed value;
* observed time;
* recorded time if rendered;
* evaluation cutoff;
* no raw IDs.

---

# 112. Tests — Provenance Focus

Keyboard activation focuses inserted detail.

Pointer activation does not steal focus.

---

# 113. Tests — Goal Selection Race

Stale Goal A Progress cannot replace Goal B.

---

# 114. Tests — Refresh Race

Old cutoff result cannot replace new cutoff.

---

# 115. Tests — Clear/Restore

No stale Progress survives.

---

# 116. Tests — Authority Change Same Cutoff

New observation recorded after cutoff does not alter existing same-cutoff result.

After Summary refresh/new cutoff, result updates.

---

# 117. Tests — Measurement Epoch

Target revision with no new observation:

old Progress disappears → insufficientEvidence.

New compatible observation restores available Progress.

---

# 118. Tests — Retraction

Current Progress → insufficientEvidence or earlier compatible evidence according to canonical query.

---

# 119. Tests — Correction

Progress changes only according to canonical `recordedAt` cutoff semantics.

---

# 120. Tests — Handoffs

Summary navigation goes to Planner only.

No writes.

No router/deep-link prerequisite unless already supported.

---

# 121. Tests — No Unauthorized Copy

Assert absence of:

* on track;
* behind;
* ahead;
* recommend;
* score;
* forecast;
* completion rate;
* Goal complete;

where inappropriate.

---

# 122. Accessibility Tests

Cover:

* heading hierarchy;
* quantity text;
* percentage text;
* provenance button expanded state;
* provenance controls;
* handoff accessible names;
* loading/error semantics.

---

# 123. Responsive Tests/Inspection

Confirm:

* Goal Progress stacks;
* Goal Activity remains responsive;
* provenance stacks;
* no horizontal table dependency.

---

# 124. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.18_SUMMARY_PROGRESS_V1_INTEGRATION_AND_PROVENANCE_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.17 Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Component Placement
7. Application Boundary
8. Goal Selector Reuse
9. Goal-Centric Composition
10. Current Goal Context
11. Progress Heading/Scope
12. Available Progress
13. Quantity Formatting
14. Percentage Formatting
15. Repeating Decimal Rule
16. Progress-Bar Decision
17. Comparison Presentation
18. Known Zero
19. No Definition
20. Stopped Measurement
21. Insufficient Evidence
22. Unsupported Policy
23. Goal Protection
24. Definition Protection
25. Observation Protection
26. Error State
27. Loading State
28. Shared Evaluation Cutoff
29. Summary Range Interaction
30. Progress Query Composition
31. Concurrency
32. Stale Request Handling
33. Goal Selection Race
34. Refresh Race
35. Clear/Restore Race
36. Goal Activity Preservation
37. Progress/Activity Distinction
38. Progress Provenance
39. Provenance Content
40. Provenance Interaction
41. Planner Handoffs
42. Archived Goal
43. Completed Goal
44. Target Date Boundary
45. Above-Target
46. At-Target
47. Below-Target
48. Decreasing Observation Boundary
49. Correction Effect
50. Retraction Effect
51. Measurement Revision Effect
52. Stop/Restart Effect
53. Unit Change Effect
54. Persistence Boundary
55. Backup V6 Boundary
56. Restore
57. Full Clear
58. Subscription Strategy
59. Same-Cutoff Authority Changes
60. Information Architecture
61. Accessibility
62. Keyboard/Focus
63. Responsive/Mobile
64. Query Performance
65. Generic Summary Preservation
66. No-Recommendation Boundary
67. No-Score Boundary
68. No-Causation Boundary
69. No-Pace/Trend/Forecast Boundary
70. Tests Added/Changed
71. Focused Validation
72. Full Validation
73. Manual Product Walkthrough
74. Bundle Comparison
75. Governance Updates
76. Deviations
77. Discoveries
78. Deferred Work
79. Progress State Matrix
80. Goal Lifecycle Matrix
81. Cutoff Matrix
82. Progress/Activity Matrix
83. Provenance Matrix
84. Handoff Matrix
85. Accessibility Matrix
86. Responsive Matrix
87. Product-Boundary Matrix
88. Epistemic Matrix
89. Architectural Invariant Assessment
90. Stop-Condition Assessment
91. Architectural Alignment Assessment
92. Recommended Next Task
93. Final Completion Determination

---

# 125. Required Progress State Matrix

Produce:

| State                  | Summary presentation | Percentage? | Handoff |
| ---------------------- | -------------------- | ----------: | ------- |
| available below target |                      |             |         |
| known zero             |                      |             |         |
| at target              |                      |             |         |
| above target           |                      |             |         |
| no definition          |                      |             |         |
| stopped                |                      |             |         |
| insufficient evidence  |                      |             |         |
| unsupported            |                      |             |         |
| Goal protected         |                      |             |         |
| Definition protected   |                      |             |         |
| Observation protected  |                      |             |         |
| error/loading          |                      |             |         |

---

# 126. Required Goal Lifecycle Matrix

Produce:

| Goal state | Progress visible? | Reporting handoff? | Interpretation |
| ---------- | ----------------: | -----------------: | -------------- |
| active     |                   |                    |                |
| completed  |                   |                    |                |
| archived   |                   |                    |                |

---

# 127. Required Cutoff Matrix

Produce:

| Change          | Same cutoff | New cutoff |
| --------------- | ----------- | ---------- |
| new observation |             |            |
| correction      |             |            |
| retraction      |             |            |
| target revision |             |            |
| unit revision   |             |            |
| stop            |             |            |
| restart         |             |            |

---

# 128. Required Progress/Activity Matrix

Produce:

| Concern           | Progress | Goal Activity |
| ----------------- | -------- | ------------- |
| question answered |          |               |
| authority         |          |               |
| denominator       |          |               |
| evidence          |          |               |
| percentage        |          |               |
| historical range  |          |               |
| evaluation cutoff |          |               |
| writes            |          |               |

---

# 129. Required Provenance Matrix

Produce:

| Field                   | Primary UI | Provenance detail | Hidden |
| ----------------------- | ---------: | ----------------: | -----: |
| Goal title              |            |                   |        |
| Goal lifecycle          |            |                   |        |
| target date             |            |                   |        |
| measurement method      |            |                   |        |
| target value            |            |                   |        |
| unit                    |            |                   |        |
| observed value          |            |                   |        |
| percentage              |            |                   |        |
| observedAt              |            |                   |        |
| recordedAt              |            |                   |        |
| evaluation cutoff       |            |                   |        |
| definition ID/revision  |            |                   |        |
| observation ID/revision |            |                   |        |
| fingerprints            |            |                   |        |

---

# 130. Required Handoff Matrix

Produce:

| Summary state         | Handoff | Destination | Write in Summary? |
| --------------------- | ------- | ----------- | ----------------: |
| no definition         |         |             |                   |
| stopped               |         |             |                   |
| insufficient evidence |         |             |                   |
| available             |         |             |                   |
| archived Goal         |         |             |                   |

---

# 131. Required Accessibility Matrix

Produce:

| Element           | Requirement          | Result |
| ----------------- | -------------------- | ------ |
| Progress heading  | semantic             |        |
| quantity          | textual              |        |
| percentage        | textual + contextual |        |
| comparison        | non-color            |        |
| provenance button | expanded/controls    |        |
| provenance detail | keyboard focus       |        |
| Planner handoff   | destination clear    |        |
| loading/error     | status/alert         |        |

---

# 132. Required Responsive Matrix

Produce:

| Area              | Desktop | Narrow | Mobile |
| ----------------- | ------- | ------ | ------ |
| Goal context      |         |        |        |
| Progress quantity |         |        |        |
| percentage        |         |        |        |
| provenance        |         |        |        |
| Activity          |         |        |        |
| handoffs          |         |        |        |

---

# 133. Required Product-Boundary Matrix

Produce:

| Capability          | Task 5.18 |
| ------------------- | --------- |
| Summary Progress    |           |
| quantity/target     |           |
| percentage          |           |
| provenance          |           |
| Goal Activity       |           |
| Planner handoffs    |           |
| Summary writes      |           |
| Progress bar        |           |
| trend               |           |
| pace                |           |
| forecast            |           |
| Recommendation      |           |
| adaptation          |           |
| bundle architecture |           |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited.

---

# 134. Required Epistemic Matrix

Produce:

| Evidence/state              | DayFrame may say | Must not say |
| --------------------------- | ---------------- | ------------ |
| 12,400 / 50,000             |                  |              |
| 0 / 50,000                  |                  |              |
| 50,000 / 50,000             |                  |              |
| 60,000 / 50,000             |                  |              |
| no observation              |                  |              |
| completed Goal at 40%       |                  |              |
| active Goal at 100%         |                  |              |
| archived Goal with Progress |                  |              |
| target date passed          |                  |              |
| high Goal Activity          |                  |              |
| corrected observation       |                  |              |
| retracted observation       |                  |              |
| protected evidence          |                  |              |

---

# 135. Architectural Invariants

Assess at minimum:

1. Summary remains read-only.
2. Progress uses selected Goal.
3. Goal selector is reused.
4. no second Progress selector exists.
5. Progress and Activity share Goal identity.
6. Progress and Activity remain semantically separate.
7. Progress uses queryGoalProgress.
8. Goal Activity uses canonical Goal Activity query.
9. Progress uses explicit evaluation cutoff.
10. Progress does not use historical range as denominator.
11. changing Goal does not change cutoff.
12. refreshing Summary may change cutoff.
13. quantity is primary.
14. percentage is secondary.
15. percentage remains derived.
16. percentage is not directly authored.
17. zero observation is shown as 0%.
18. no observation is not shown as 0%.
19. above-target percentage is unclamped.
20. at-target does not mean Goal complete.
21. completed Goal may be below target.
22. active Goal may be at/above target.
23. lifecycle does not change arithmetic.
24. target date does not change arithmetic.
25. no pace semantics exist.
26. no trend semantics exist.
27. no forecast exists.
28. no recommendation exists.
29. no Goal score exists.
30. no causation exists.
31. Progress does not consult Goal Activity.
32. Goal Activity does not consult Progress.
33. no cross-projection arithmetic exists.
34. no Progress persistence exists.
35. no Backup Progress payload exists.
36. restore re-derives Progress.
37. full clear clears UI state only.
38. no Progress authority participant exists.
39. Measurement Definition remains sole target authority.
40. Observation remains sole measured-state authority.
41. Progress provenance identifies exact measurement inputs.
42. raw technical IDs are hidden from primary UI.
43. unsupported policy is explicit.
44. protected authority is not shown as absence.
45. loading is not shown as empty.
46. errors are not shown as insufficient evidence.
47. stopped measurement differs from never measured.
48. insufficient evidence exposes target but no percentage.
49. archived Goal Progress remains inspectable.
50. archived reporting/configuration writes remain Planner-governed.
51. Summary handoffs navigate only.
52. no Summary mutation exists.
53. no router is introduced unless already present.
54. Progress bar remains deferred unless explicitly justified.
55. if no bar, omission is intentional.
56. comparison labels are arithmetic only.
57. decreasing observations do not create negative judgment.
58. corrections alter Progress only by cutoff semantics.
59. retractions alter Progress only by cutoff semantics.
60. target revision starts new evidence epoch.
61. old evidence never carries into new definition revision.
62. unit change does not convert old values.
63. stop removes current Progress.
64. restart requires new compatible observation.
65. Goal Activity semantics remain unchanged.
66. generic Planning remains unchanged.
67. generic Execution remains unchanged.
68. Goal Activity accessibility remains preserved.
69. Progress provenance uses accessible inserted-detail behavior.
70. keyboard detail focus is preserved.
71. pointer activation does not steal focus.
72. mobile requires no horizontal table.
73. no all-Goal Progress dashboard exists.
74. query performance remains bounded.
75. stale Goal responses cannot cross selection.
76. stale cutoff responses cannot overwrite refresh.
77. clear/restore invalidates stale Progress.
78. same-cutoff new authority does not violate as-of semantics.
79. no new authority is introduced.
80. no new persistence key is introduced.
81. Backup V6 remains unchanged.
82. no Backup V7 is introduced.
83. no new runtime dependency is introduced without justification.
84. bundle warning threshold is not raised.
85. Task 5.19 remains mandatory.
86. canonical validation passes.

Classify each as:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Not applicable;
* Blocked.

---

# 136. Stop Conditions

Stop and report if:

* `queryGoalProgress` lacks sufficient provenance;
* Summary cannot reuse the existing Goal selector;
* Goal Activity cannot remain semantically intact after composition;
* Progress requires a second Goal selector;
* Progress would need a separate date-range selector;
* no-definition and stopped cannot be distinguished truthfully;
* insufficient evidence and observed zero cannot be distinguished;
* protected Observation authority cannot be distinguished from no observation;
* same-cutoff semantics cannot be preserved;
* stale async Progress cannot be rejected;
* Summary would need to mutate Measurement or Observation authority;
* Progress would need to be persisted;
* Goal Activity must be rewritten to implement Progress;
* target date must be used for pace;
* a Progress bar becomes required but cannot truthfully represent >100%;
* implementation requires a new authority/schema/Backup version;
* implementation requires routing infrastructure.

Do not broaden Task 5.18 to solve blockers.

---

# 137. Component/Module Expectations

Likely areas:

```text
Summary
Goal Activity Summary composition
Goal Progress Summary component
Progress presentation formatter
application/store query integration
Summary tests
responsive styles
governance
```

Do not assume exact filenames before audit.

---

# 138. Focused Validation

Run focused suites covering:

* Summary Progress;
* Goal Activity preservation;
* Goal selector;
* queryGoalProgress integration;
* cutoff/stale-result handling;
* provenance;
* accessibility/focus;
* protection;
* clear/restore;
* handoffs.

Record exact files/test counts.

---

# 139. Full Validation

Before completion run repository-standard commands, including where available:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
git diff --check
```

Report exact:

* test-file count;
* test count;
* build module count;
* main JS size;
* gzip size;
* diff result.

---

# 140. Manual Product Walkthrough

If interactive browser access is available, inspect:

### Desktop

* Goal selection;
* available Progress;
* 0%;
* 100%;
* > 100%;
* Completed Goal below target;
* no definition;
* stopped;
* insufficient evidence;
* unsupported policy;
* protected authority;
* provenance;
* Goal Activity sibling section;
* Planner handoffs.

### Mobile/narrow

* Goal context;
* quantity;
* percentage;
* provenance detail;
* Activity;
* handoffs;
* no horizontal overflow.

If not performed, explicitly state no manual walkthrough is claimed.

---

# 141. Bundle Baseline

Task 5.17 main bundle:

```text
698.32 kB
172.89 kB gzip
```

Record Task 5.18 output against that baseline.

Do not optimize bundle architecture in this task.

If main JS approaches roughly **750–800 kB**, flag early inspection.

Do not raise the warning threshold.

**Task 5.19 remains mandatory.**

---

# 142. Governance

Update:

* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` or an ADR only if implementation introduces a genuinely enduring decision beyond Task 5.15's settled product model.

Do not add an ADR merely for UI layout.

---

# 143. Deferred Work

Retain explicitly:

### Task 5.19

Production Bundle Architecture, Code-Splitting, and Load-Performance Exit Gate.

Also defer:

* historical Progress UI;
* Progress bars;
* multi-Goal dashboard;
* comparison;
* new policies;
* custom units;
* unit conversion;
* pace;
* trend;
* forecast;
* Recommendation;
* adaptation;
* composite scores;
* automatic Goal completion.

---

# 144. Recommended Next Task

If Task 5.18 completes cleanly:

> **Task 5.19 — Production Bundle Architecture, Code-Splitting, and Load-Performance Exit Gate.**

That task is mandatory before Phase 6 begins.

---

# 145. Completion Criteria

Task 5.18 is complete only when:

* Summary reuses one Goal selector for Goal Progress and Goal Activity;
* selected Goal context is presented coherently;
* Goal Progress is visible as a read-only sibling to Goal Activity;
* quantity/target is the primary Progress presentation;
* percentage is secondary;
* percentage formatting is deterministic and presentation-only;
* no Progress bar is introduced unless explicitly justified;
* zero observation shows true 0%;
* no observation remains insufficient evidence;
* no definition remains distinct;
* stopped measurement remains distinct;
* unsupported policy remains explicit;
* protected Goal/Definition/Observation states remain distinct from absence;
* below/at/above target remain arithmetic-only;
* > 100% is unclamped;
* 100% does not imply Goal completion;
* Completed Goal below target remains representable;
* archived Goal Progress remains inspectable;
* target date remains contextual only;
* Goal Activity remains semantically unchanged;
* Progress and Activity copy clearly distinguishes measured state from supporting activity;
* no cross-projection arithmetic or causal inference exists;
* Progress provenance explains target, observed value, measurement method, observation time, and evaluation cutoff;
* raw technical IDs/revisions/fingerprints remain hidden from primary UI;
* provenance interaction follows existing accessible detail behavior;
* Summary handoffs navigate to Planner only;
* Summary performs no writes;
* Progress uses the shared Summary evaluation cutoff;
* Goal selection does not refresh the cutoff;
* Summary refresh may refresh the cutoff;
* historical date range remains Goal Activity/generic history semantics rather than Progress denominator;
* stale Goal/cutoff/clear/restore responses cannot overwrite current Progress;
* same-cutoff authority changes preserve as-of semantics;
* correction/retraction/measurement revision/stop/restart effects follow canonical query behavior;
* no Progress persistence exists;
* Backup V6 remains unchanged;
* restore re-derives Progress;
* full clear leaves no stale Progress UI;
* generic Scheduling Realization and Scheduled Outcomes remain unchanged;
* accessibility, keyboard, focus, and mobile behavior are preserved;
* no all-Goal Progress dashboard is added;
* query behavior remains bounded;
* no Recommendation, score, pace, trend, forecast, automatic completion, adaptation, or causal interpretation is introduced;
* focused and canonical validation pass;
* bundle size is recorded against the 698.32 kB Task 5.17 baseline;
* bundle warning threshold is not raised;
* Task 5.19 remains explicitly mandatory;
* governance accurately records Summary Progress as user-visible while recommendation/adaptation semantics remain deferred.

---

# 146. Final Implementation Principle

> **Summary should show Progress as a transparent measurement result: the value DayFrame knows, the target the user authored, and the arithmetic relationship between them—while keeping supporting activity, Goal lifecycle, and future recommendations separate.**

---

# 147. Final Completion Statement

**Task 5.18 is complete when DayFrame makes Manual Quantity Progress V1 visible in Summary for the same explicitly selected Goal already used by Goal Activity; when the UI presents current measured quantity and authored target first, percentage second, and optional arithmetic comparison without converting those facts into lifecycle, performance, pace, success, or recommendation semantics; when no-definition, stopped measurement, insufficient evidence, known zero, below-target, at-target, above-target, unsupported policy, protection, loading, and error states remain truthful and distinct; when 100% and >100% remain unclamped arithmetic facts rather than automatic Goal completion; when Completed and archived Goals can still be inspected without rewriting their measurement truth; when the existing Goal Activity analysis remains a separate sibling answering the supporting-work question and no arithmetic or causal bridge is created between Activity and Progress; when a bounded provenance interaction explains the exact measurement method, target, recorded quantity, observation timing, and evaluation cutoff without exposing technical identifiers as primary product language; when Summary uses the existing Goal selector, shared evaluation cutoff, stale-request safeguards, read-only navigation handoffs, accessibility/focus conventions, and responsive layout without introducing writes, routing infrastructure, derived persistence, or another Goal dashboard; when Measurement Definition, Progress Observation, Goal Activity, HistoricalPlan, ExecutionHistory, Goal lifecycle, Setup, Schedule, Preview, Profiles, Backup V6, and restore boundaries remain intact; when no Progress bar, trend, pace, forecast, Recommendation, score, adaptation, automatic completion, unit conversion, new policy, or causal interpretation is introduced; when focused and canonical validation are green; when bundle growth is recorded against the 698.32 kB Task 5.17 baseline without silencing the advisory; and when Task 5.19 remains the mandatory production-bundle architecture and load-performance exit gate before Phase 6 begins.**
