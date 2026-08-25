# Task 6.6 — Planner Schedule-Review Convergence

## Status

Ready for implementation.

## Phase

Phase 6 — Platform Maturity

## Task Type

Planner information-architecture convergence, schedule-review workflow composition, Preview-to-product-language refinement, selected-day schedule review, unplaced/omitted/blocked presentation, friction/suggested-fix workflow convergence, explicit plan-publication semantics preservation, variable-duration user-day presentation, accessibility/responsiveness, stale-state behavior, loading/bundle discipline, regression testing, and governance.

**This task does not implement generic Add/Edit Commitment convergence, retire SetupScreen, change scheduler semantics, add drag/drop, change HistoricalPlan publication rules, add Recommendations, or mutate Today.**

---

# 1. Objective

Evolve the current Planner Schedule experience into a coherent **Review Schedule** workflow.

The user should increasingly experience:

```text
Planner
    ↓
DayFrame builds the schedule
    ↓
Review Schedule
        calendar / planning horizon
        selected user-day
        scheduled occurrences
        unresolved plan states
        friction
        bounded suggested resolutions
    ↓
user makes an explicit planning decision
```

rather than needing to understand:

```text
Setup
Generate Preview
Preview
Friction Points
Suggested Fixes
```

Task 6.6 changes information architecture and workflow composition while preserving the scheduler, authorities, publication semantics, and canonical write paths already established.

---

# 2. Governing Phase 6 Product Model

Phase 6 now has:

```text
Planner
    shape future time

Today
    live and report the current user-day

Summary
    understand historical evidence
```

Task 6.6 strengthens the Planner half of this model.

Today must remain unchanged.

Summary must remain unchanged.

---

# 3. Governing Planner Question

Planner should answer:

> **What should my future time look like, and what needs my attention before I rely on the plan?**

Review Schedule is one bounded workflow inside Planner.

---

# 4. Governing Scheduling Principle

> **Users define intent; DayFrame builds schedules.**

Planner should expose enough schedule detail and bounded controls for the user to understand and shape the result without requiring them to operate scheduling-engine concepts directly.

Do not hide important plan states.

Do hide unnecessary implementation terminology where product language can truthfully replace it.

---

# 5. Governing Publication Principle

Current architecture already publishes HistoricalPlan when a fresh Preview is generated.

Task 6.6 must preserve that behavior exactly.

Do not introduce a fake architectural distinction such as:

```text
Preview
    ↓
Accept Plan
    ↓
published HistoricalPlan
```

unless such a command already exists.

If the product language uses “Review Schedule,” it is still reviewing the schedule produced/published by the existing generation path.

---

# 6. Governing Preview Principle

Preview may remain an internal/domain concept.

The primary user-facing Planner workflow should increasingly use:

* Review Schedule;
* Schedule;
* Generate Schedule / Refresh Schedule;
* plan attention;
* Resolve;

where those terms truthfully match existing behavior.

Do not rename code merely for UI terminology.

---

# 7. Governing Staleness Principle

Authored Planner changes continue to mark the existing Preview/schedule result stale.

The established behavior remains:

```text
authored planning change
    ↓
existing schedule remains visible
    ↓
stale notice
    ↓
user explicitly generates again
```

Do not auto-regenerate.

Do not discard the old schedule simply because it became stale.

---

# 8. Governing Friction Principle

Current suggested fixes are deterministic schedule remediation.

They are **not** the future Recommendations system.

Task 6.6 may reframe them product-wise as bounded resolution options, but must preserve:

* current friction detection;
* current suggested-fix generation;
* Try behavior;
* Accept behavior;
* exact mutation paths;
* recomputation semantics.

---

# 9. Explicit Scope

Implement:

* Planner Schedule → Review Schedule information-architecture convergence;
* clearer Planner internal navigation;
* schedule-review heading/copy;
* schedule generation/refresh action refinement;
* stale schedule presentation;
* planning-range context;
* calendar/date-selection integration;
* selected user-day review;
* canonical variable-duration user-day rendering;
* scheduled occurrences;
* unplaced occurrences;
* omitted occurrences;
* blocked occurrences;
* friction presentation;
* suggested-resolution presentation;
* Try workflow;
* Accept workflow;
* plan-attention grouping;
* schedule provenance/status copy where useful;
* selected-day focus behavior;
* desktop/mobile composition;
* accessibility;
* tests;
* bundle validation;
* governance.

---

# 10. Explicit Non-Goals

Do not implement:

* generic Add Commitment;
* generic Edit Commitment;
* Pattern Library;
* commitment-type abstraction;
* SetupScreen retirement;
* block-template retirement;
* recurrence UI redesign;
* Goal workflow redesign;
* Today schedule mutation;
* same-day replanning from Today;
* drag/drop;
* resize;
* pin/lock;
* manual direct placement unless already supported;
* plan acceptance authority;
* new publication semantics;
* current-plan authority;
* new scheduler algorithm;
* Capacity;
* Planned Allocation;
* Recommendations;
* adaptation;
* transition sleep planning;
* Goal reorientation.

Task 6.7 owns commitment-authoring convergence.

Task 6.8 owns broader friction/manual-event cross-surface convergence where still needed.

---

# 11. Execution Artifact Rules

Before implementation:

1. verify this Task 6.6 artifact;
2. save immutable project copy;
3. record SHA-256;
4. review:

   * Task 6.1 audit;
   * Task 6.2 result;
   * Task 6.3B temporal changes;
   * Task 6.4/6.5 Today results;
   * PlannerSurface;
   * DayFrameApp;
   * SetupScreen;
   * PreviewScreen;
   * DayVisualizer;
   * mini-calendar/day-detail workflow;
   * friction presentation;
   * suggested-fix Try/Accept handling;
   * PlanDecision integration;
   * Preview stale-state handling;
   * schedule generation action;
   * HistoricalPlan publication path;
   * relevant Planner integration tests;
5. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-6/TASK_6.6_PLANNER_SCHEDULE_REVIEW_CONVERGENCE_RESULT.md`

---

# 12. Initial Source Audit

Before code changes, document:

* current Planner Plan/Schedule navigation;
* what “Schedule” currently renders;
* current Preview generation controls;
* current stale state;
* current selected-day state;
* calendar/day-detail state;
* current friction UI;
* current suggested-fix UI;
* Try state;
* Accept state;
* manual event/day-detail overlap;
* current responsive structure;
* exact write callbacks;
* exact HistoricalPlan publication trigger.

Do not refactor before tracing the current workflow.

---

# 13. Stop Conditions

Stop and report if:

* schedule review cannot be separated from Setup without duplicate draft ownership;
* existing Preview is not the actual source of the visible Schedule experience;
* Try/Accept semantics cannot be preserved through recomposition;
* generation/publication semantics are ambiguous;
* a clearer Review Schedule workflow would require a new acceptance/publication authority;
* selected-day state would need a second calendar authority;
* variable-duration days cannot be shown through current Preview infrastructure;
* Planner refactor would require Today changes;
* commitment-authoring convergence is required merely to make schedule review coherent;
* bundle budgets cannot remain green without threshold inflation.

Do not widen scope around blockers.

---

# 14. Target Planner Transitional Shape

The post-6.6 Planner may still have two internal modes, but they should become product-oriented.

Candidate:

```text
Planner
    Plan
    Review Schedule
```

rather than:

```text
Planner
    Plan
    Schedule
```

Audit actual terminology first.

Strong preference:

> **Plan / Review Schedule**

because “Plan” remains the current authored-intent area and “Review Schedule” clearly describes the generated-result workflow.

---

# 15. Planner Plan Mode

Do not redesign Plan mode substantially.

It may continue containing:

* Goals;
* Measurement configuration;
* Setup;
* authored schedule controls.

Task 6.7 will converge commitment authoring.

Task 6.6 may make only the minimal navigation/copy changes required to distinguish Plan from Review Schedule.

---

# 16. Review Schedule Mode

Review Schedule should become a coherent bounded surface within Planner.

Conceptual structure:

```text
Review Schedule

planning range / calendar

schedule status
    current
    stale
    unavailable

selected user-day

scheduled plan

plan attention
    unplaced
    omitted
    blocked

friction
    explanation
    bounded resolution options
```

Use actual available data.

---

# 17. Schedule Generation Action

Audit current button copy.

Candidate user-facing language:

* **Generate Schedule**
* **Refresh Schedule**

rather than “Generate Preview,” if semantics support it.

Possible rule:

### No current schedule

**Generate Schedule**

### Existing fresh/stale schedule

**Refresh Schedule**

Do not change command semantics.

---

# 18. Preview Terminology

The word **Preview** should cease being the primary product heading if possible.

It may remain in:

* internal types;
* code;
* technical status;
* tests where domain naming is appropriate.

Do not undertake broad rename churn.

---

# 19. Review Schedule Heading

Primary internal Planner heading:

**Review Schedule**

Supporting copy should answer:

> Review the schedule DayFrame built, see what still needs attention, and resolve conflicts before relying on the plan.

Avoid implying the schedule is un-published if generation already publishes it.

---

# 20. Fresh Schedule State

When current generated schedule matches authored planning state:

show a concise state such as:

**Schedule is up to date**

or omit state if unnecessary.

Do not imply execution freshness.

---

# 21. Stale Schedule State

Preserve the established warning.

Refine product copy if helpful:

> Your planning setup changed after this schedule was generated. Refresh the schedule to see those changes.

The old schedule remains visible.

Do not call it invalid unless architecture does.

---

# 22. No Schedule State

If no Preview/current generated schedule exists:

show a clear empty state:

> Generate a schedule to review how your commitments fit together.

Do not present HistoricalPlan as the editable review source.

---

# 23. HistoricalPlan Boundary

Review Schedule consumes current Preview/generated schedule state as it already does.

HistoricalPlan remains the frozen publication/history authority.

Do not replace live schedule-review UI with HistoricalPlan.

Today reads HistoricalPlan; Planner Review Schedule may still review the current generated result.

Preserve that distinction.

---

# 24. Planning Range

Present the active planning horizon clearly.

Do not force a calendar month.

Examples:

```text
Aug 24 – Sep 20
```

or equivalent.

Respect arbitrary range/cycle semantics.

---

# 25. Month View Boundary

A month/calendar may be a navigation aid.

It does not define the schedule authority range.

Do not truncate planning range to month edges.

---

# 26. Calendar Integration

Reuse current mini-calendar/date selection.

Do not create another calendar model.

Selected calendar label should map to the canonical user-day already used by Preview.

---

# 27. Selected User-Day

Selecting a day should show that user-day’s schedule review.

Use canonical variable-duration window semantics from 6.3B.

Do not assume midnight-to-midnight.

---

# 28. Selected-Day Header

Possible:

```text
Saturday, August 29
3:00 AM – Sunday 6:00 AM
```

for a transition day.

Do not force duration copy unless useful.

---

# 29. Variable-Duration Days

The Review Schedule UI must remain truthful for:

* ordinary day;
* 21-hour day;
* 27-hour day;
* DST-short/long day.

Reuse corrected DayVisualizer behavior.

---

# 30. DayVisualizer Reuse

Task 6.3B made DayVisualizer variable-duration capable.

Strong preference:

> Reuse it as the primary selected-day visualization if it remains product-appropriate.

Do not rebuild a second timeline.

---

# 31. Visualization vs Detail

A useful desktop composition may be:

```text
calendar / date selection
        ↓
selected-day visualizer
        +
selected-day detail / attention
```

On mobile:

```text
calendar/date selector
selected-day timeline
stacked attention/details
```

Do not require side-by-side layout.

---

# 32. Scheduled Occurrences

Scheduled items remain visible with current frozen/generated:

* title;
* category;
* timing;
* source semantics where useful.

Do not add execution outcomes; that belongs to Today/Summary.

Planner is reviewing planned geometry.

---

# 33. Manual Events

Current manual events remain part of schedule review exactly as generated.

Do not move their authoring workflow yet unless existing selected-day detail already exposes it.

Task 6.8 may converge cross-surface manual-event workflows.

---

# 34. Work

Generated work remains visibly distinguished according to current schedule semantics.

No execution interpretation.

---

# 35. Sleep

Sleep remains scheduled work/recovery geometry.

Do not add transition sleep intelligence.

---

# 36. Unplaced Section

Create a clearly named **Unplaced** or Plan Attention section.

Explain:

> Intended work that DayFrame could not place in the generated schedule.

Do not say skipped.

---

# 37. Omitted Section

If generated schedule exposes omitted occurrences here:

show distinctly.

Do not merge with unplaced.

If current Preview does not expose omitted state, do not invent it from HistoricalPlan.

Trace actual generated result shape first.

---

# 38. Blocked Section

Likewise show only if current generated schedule exposes it truthfully.

Do not reconstruct from friction unless canonical result says blocked.

---

# 39. Plan-Attention Information Architecture

Where available:

```text
Plan attention
    Unplaced
    Omitted
    Blocked
```

Keep them separate from friction.

---

# 40. Friction Section

Present existing detected friction as:

**Needs attention**

or:

**Schedule conflicts**

depending current semantics.

Do not use alarming failure language.

---

# 41. Friction Explanation

Show what is actually known:

* overlapping occurrences;
* no fit;
* other governed friction details.

Do not infer why the user caused it.

---

# 42. Suggested Fix Product Language

Consider user-facing heading:

**Resolution options**

rather than “Suggested fixes.”

This remains deterministic remediation, not Recommendations.

Internal types stay unchanged.

---

# 43. Try Action

Preserve existing Try behavior exactly.

Product copy may remain:

**Try**

or become:

**Preview Change**

only if semantics support it.

Do not imply acceptance.

---

# 44. Try State

Trying a suggested fix must remain non-authoritative according to current behavior.

Clearly distinguish:

```text
original/current schedule
vs
tried candidate change
```

Do not silently mutate authored setup.

---

# 45. Accept Action

Preserve canonical Accept behavior.

Copy should make explicit that the planning change is being applied.

Do not claim that Accept publishes a plan if publication is separately governed by generation.

---

# 46. Reject/Cancel Try

Existing cancellation/revert path must remain available.

No lost original result.

---

# 47. Suggested Fix Identity

Use existing friction/fix identity.

Do not identify fixes by display text/index where canonical IDs exist.

---

# 48. Friction Resolution Re-query

Preserve whatever current sequence occurs after Accept:

```text
apply bounded planning change
recompute/revise schedule
recompute friction
```

Do not duplicate scheduling logic in UI.

---

# 49. PlanDecision Boundary

Preserve existing PlanDecision behavior.

Do not reinterpret it as acceptance of the entire schedule unless that is already its semantics.

---

# 50. Schedule Publication Boundary

Mandatory regression:

Generation continues to publish HistoricalPlan exactly as before.

Accepting a suggested fix must interact with publication exactly as current production does.

Do not add another publication event.

---

# 51. Stale After Planning Edits

After an authored change from Plan mode:

Review Schedule retains existing result and stale warning.

If the user returns to Plan and edits something:

no auto-generation.

---

# 52. Stale After Goal Edits

Goal changes do not stale schedule unless they currently affect schedule state.

Task 5 explicitly kept Goals schedule-independent.

Mandatory regression.

---

# 53. Stale After Measurement Edits

No schedule staleness unless current architecture says otherwise.

---

# 54. Stale After Today Outcome Report

ExecutionHistory changes must not stale Planner schedule.

Today reporting changes reality evidence, not plan.

Mandatory regression.

---

# 55. Profile Load

Preserve current behavior.

If loading a profile clears Preview/current schedule, Review Schedule reflects no schedule.

Do not preserve stale review result across authority replacement if current behavior clears it.

---

# 56. Restore

After restore, current Preview behavior remains as currently governed.

Do not synthesize a review schedule from HistoricalPlan if Preview is absent.

---

# 57. Full Clear

Clear Review Schedule state completely.

No stale selected-day details or friction remain.

---

# 58. Selected-Day State After Regeneration

If selected user-day remains within new range:

preserve selection where current UX supports it.

If no longer valid:

choose deterministic nearest/default selection.

Do not leave invisible invalid selection.

---

# 59. Default Selected Day

Audit current behavior.

Potential priorities:

1. today if in range;
2. first range day;
3. existing selected day.

Preserve or make the smallest coherent improvement.

Do not use Today surface query semantics merely to select a Planner date unless existing temporal helper suffices.

---

# 60. Calendar Focus

Changing selected day by keyboard should move visual/detail state without unpredictable focus jumps.

---

# 61. Schedule Generation Focus

After Generate/Refresh:

focus should move to the Review Schedule result heading/status if current conventions support it, especially if invoked from an empty state.

Do not dump focus into first friction item automatically.

---

# 62. Friction Try Focus

After Try:

return/retain focus near the attempted resolution option.

---

# 63. Accept Focus

After Accept/recomputation:

focus should remain within the relevant friction/result region if that item still exists.

If resolved/disappears:

move to a stable **Needs attention** heading/status or Review Schedule heading.

---

# 64. Accessibility — Internal Navigation

Planner Plan / Review Schedule controls must expose selected state.

Use existing tab/button semantics.

---

# 65. Accessibility — Calendar

Preserve current calendar keyboard behavior.

If date selection isn't fully keyboard-operable today and Task 6.6 exposes it more prominently, fix bounded accessibility gaps.

Do not redesign calendar architecture.

---

# 66. Accessibility — DayVisualizer

Existing visual meaning must also be available textually.

Do not make schedule review depend solely on timeline position/color.

---

# 67. Accessibility — Friction

Friction and resolution options require:

* semantic headings;
* textual explanation;
* named controls;
* Try/Accept state not conveyed by color only.

---

# 68. Accessibility — Stale State

Use text/status.

No color-only stale marker.

---

# 69. Mobile Information Architecture

Planner Review Schedule on mobile should prioritize:

```text
Review Schedule
status / refresh
range/date navigation
selected-day schedule
plan attention
friction/resolutions
```

Do not force a desktop calendar + sidebar layout.

---

# 70. Desktop Information Architecture

A multi-column layout may be appropriate:

```text
calendar/range      selected-day schedule
                    attention/friction
```

but chronology and focus order must remain understandable.

---

# 71. Long Planning Ranges

Do not render every day’s full timeline simultaneously.

Continue selected-day/detail model.

---

# 72. Plan-Attention Counts

Summary counts near the top may be useful:

```text
2 unplaced
1 conflict
```

Only include canonical available counts.

Do not invent scores.

---

# 73. No Completion Percentage

Planner Review Schedule does not show:

* completion rate;
* success score;
* utilization score;
* realization percentage.

Summary owns historical interpretation.

---

# 74. No Capacity Metric

Openings may be visible as schedule geometry.

Do not label them Capacity.

---

# 75. No Recommendation Language

Avoid generic:

**Recommended**

unless referring to existing deterministic suggested fixes and the distinction is clear.

Prefer:

**Resolution option**

for this task.

---

# 76. No Goal Progress

Do not bring Summary Progress into Review Schedule yet.

Task 6.9 may later add contextual Goal information where warranted.

---

# 77. No Today Outcomes

Do not show reported completed/skipped states in Planner schedule review.

Planner is plan-facing.

Today is execution-facing.

---

# 78. Review Schedule vs Today Distinction

The surfaces should now feel meaningfully different:

```text
Planner / Review Schedule
    what DayFrame plans

Today
    what is planned now + what the user reported

Summary
    historical analysis
```

Mandatory product-boundary assessment.

---

# 79. Current-Day Planner Selection

Planner may select the current user-day if within planning range, but it must not become a duplicate Today surface.

No execution controls or outcome metadata.

---

# 80. Same-Day Plan Review

If the current day is selected in Planner, schedule geometry/friction may be reviewed according to existing Preview.

Do not add Today-style “Current/Next” semantic classification.

---

# 81. Schedule Re-generation

Refresh Schedule may legitimately change:

* placement;
* unplaced items;
* friction;
* publication.

Preserve determinism.

---

# 82. Generation In Flight

If generation is synchronous today, do not fake asynchronous loading unless UI already yields.

If there is a real async boundary, show proper status.

---

# 83. Duplicate Generation

Prevent duplicate submissions according to existing behavior.

Do not introduce a second generation lock.

---

# 84. Generation Failure

Show existing error semantics.

Keep previous schedule if current architecture does.

Do not erase valid previous result unless command does.

---

# 85. Surface State Ownership

PlannerSurface may own presentational mode state.

DayFrameApp/store retains existing authoritative/draft/generation state.

Do not move Setup draft merely for component neatness.

---

# 86. Component Extraction

It may be appropriate to introduce a bounded component such as:

```text
ScheduleReview
```

or:

```text
PlannerScheduleReview
```

Do so only if it improves composition.

Do not create a second schedule state container.

---

# 87. PreviewScreen Future Assessment

Task 6.6 should decide whether current `PreviewScreen`:

* can effectively become the Review Schedule component;
* should be wrapped/recomposed;
* should be split;
* remains temporarily named Preview internally.

Avoid unnecessary full rewrite.

---

# 88. DayFrameApp Reduction

Move schedule-review markup out of DayFrameApp where safe.

Do not force callback/state ownership migration.

---

# 89. One-Write-Path Principle

All planning writes continue through existing paths:

* Setup save;
* manual-event commands;
* suggested fix Try/Accept;
* generation.

No duplicate planner commands.

---

# 90. Lazy Architecture

Planner remains eager/default.

Do not lazy-load the core Planner surface merely because Today/Summary are lazy.

---

# 91. Bundle Pressure

Current eager gzip is near its limit.

Task 6.6 must be careful because Planner is eager.

Strong preference:

* recompose/reuse existing Planner code;
* avoid introducing substantial new eager logic;
* avoid new dependency;
* move optional heavy schedule-review subparts behind existing boundaries only if warranted and behavior remains good.

---

# 92. Bundle Baseline

Current post-6.5 baseline:

```text
Initial raw     682,538
Initial gzip    169,851
Today query       4,890
Today UI         11,262
Summary          30,091
Largest lazy     30,091
Total JS        728,781
```

Budgets remain:

```text
Initial raw     <= 685,000
Initial gzip    <= 170,000
Largest lazy    <= 100,000
Total JS        <= 750,000
```

Initial gzip headroom is extremely small.

Do not raise thresholds.

---

# 93. Schedule-Review Chunk Audit

If Review Schedule code is already part of the eager Planner bundle, simple recomposition should be approximately neutral.

If new UI causes budget failure, inspect whether schedule-review-only code can be lazily split **within Planner** without compromising the default Plan journey.

Candidate:

```text
Eager
    Planner Plan

Lazy on Planner internal navigation
    Review Schedule
```

This is an allowed architecture to evaluate if necessary.

Do not implement merely for aesthetic chunking.

---

# 94. Planner Internal Lazy Boundary

If evaluated, ensure:

* Planner remains eager;
* Plan remains immediately available;
* Review Schedule loads on intent;
* no authority bootstrap moves lazy;
* Setup draft ownership remains eager/app-level;
* schedule state remains canonical.

Document measured result.

---

# 95. No New Runtime Dependency

Mandatory.

---

# 96. Tests — Navigation

Cover:

```text
Planner
    Plan
    Review Schedule
```

selected-state semantics and return behavior.

---

# 97. Tests — Existing Plan Workflows

Representative regression:

* Goals still render;
* Measurement still renders;
* Setup still works;
* Save Setup unchanged.

---

# 98. Tests — Generate Schedule

Cover:

* no schedule;
* generate;
* review appears;
* HistoricalPlan publication still occurs.

---

# 99. Tests — Stale Schedule

Edit authored setup:

* schedule remains visible;
* stale notice appears;
* Refresh Schedule clears stale state after generation.

---

# 100. Tests — Goal Independence

Edit Goal:

* schedule does not become stale solely due to Goal change.

---

# 101. Tests — Today Outcome Independence

Report outcome in Today:

* Planner schedule does not stale/change.

---

# 102. Tests — Range

Arbitrary range is visible.

No calendar-month assumption.

---

# 103. Tests — Variable User-Day

Cover:

* 21-hour;
* 27-hour;

selected-day visualization/window.

---

# 104. Tests — Scheduled Items

Representative work/template/manual/sleep occurrences render.

---

# 105. Tests — Unplaced

Visible and distinct.

No skipped language.

---

# 106. Tests — Omitted/Blocked

If available in current Preview result, render distinctly.

If unavailable, document non-applicability rather than fabricate.

---

# 107. Tests — Friction

Existing friction appears in Needs attention.

---

# 108. Tests — Resolution Options

Suggested fixes render as bounded resolution options.

---

# 109. Tests — Try

Try preserves original/candidate semantics.

No permanent mutation.

---

# 110. Tests — Accept

Accept uses canonical mutation path and recomputes schedule/friction exactly as before.

---

# 111. Tests — Cancel Try

Original state restored.

---

# 112. Tests — Multiple Friction Points

Independent identity maintained.

---

# 113. Tests — Selected Day

Calendar selection drives correct canonical user-day.

---

# 114. Tests — Selection After Regeneration

Selection preserved or deterministically adjusted.

---

# 115. Tests — Profile Load

Review state reflects cleared/replaced Preview according to current semantics.

---

# 116. Tests — Restore

No false generated schedule from HistoricalPlan.

---

# 117. Tests — Full Clear

No stale schedule, selection, friction, or tried-fix state.

---

# 118. Tests — Accessibility

Cover:

* Plan / Review Schedule selected state;
* Review Schedule heading;
* stale status;
* generation action accessible name;
* calendar selection;
* friction headings;
* resolution controls;
* Try/Accept state.

---

# 119. Tests — Mobile Structure

No horizontal dependency.

---

# 120. Tests — Product Terminology

Assert primary UI does not unnecessarily expose:

* Block Candidate;
* Generate Preview;
* Friction Point;

where Task 6.6 explicitly replaces those terms.

Do not assert against internal code/test names.

---

# 121. Tests — Unauthorized Semantics

Assert absence in Review Schedule:

* Completed;
* Reported skipped;
* Capacity;
* Success;
* Behind;
* Goal progress;
* Recommendation score.

---

# 122. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.6_PLANNER_SCHEDULE_REVIEW_CONVERGENCE_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 6.5 Prerequisite Confirmation
4. Initial Planner/Schedule Audit
5. Files Changed
6. Original Planner IA
7. Resulting Planner IA
8. Internal Navigation
9. Plan Mode Preservation
10. Review Schedule Placement
11. Preview Terminology Decision
12. Generation Action
13. Fresh Schedule
14. Stale Schedule
15. No-Schedule State
16. HistoricalPlan Boundary
17. Planning Range
18. Calendar Integration
19. Selected User-Day
20. Variable-Duration Presentation
21. DayVisualizer Reuse
22. Scheduled Occurrences
23. Manual Events
24. Work
25. Sleep
26. Plan Attention
27. Unplaced
28. Omitted
29. Blocked
30. Friction Placement
31. Friction Copy
32. Resolution Options
33. Try Workflow
34. Accept Workflow
35. Cancel Workflow
36. PlanDecision Boundary
37. Publication Preservation
38. Setup Staleness
39. Goal Independence
40. Measurement Independence
41. Today Outcome Independence
42. Profile Behavior
43. Restore Behavior
44. Full-Clear Behavior
45. Selected-Day Lifecycle
46. Focus
47. Accessibility
48. Responsive Behavior
49. Mobile
50. Desktop
51. Planner/Today Distinction
52. Planner/Summary Distinction
53. Component Reuse
54. PreviewScreen Assessment
55. App Composition
56. One-Write-Path Assessment
57. Loading Architecture
58. Schedule-Review Lazy Audit
59. Bundle Comparison
60. Tests Added/Changed
61. Focused Validation
62. Full Validation
63. Bundle Validation
64. Manual Product Walkthrough
65. Governance Updates
66. ADR Determination
67. Deviations
68. Discoveries
69. Deferred Work
70. Planner Structure Matrix
71. Terminology Matrix
72. Schedule-State Matrix
73. Attention Matrix
74. Friction/Resolution Matrix
75. Surface-Boundary Matrix
76. State-Ownership Matrix
77. Loading Matrix
78. Accessibility Matrix
79. Responsive Matrix
80. Bundle Matrix
81. Product-Boundary Matrix
82. Epistemic Matrix
83. Architectural Invariant Assessment
84. Stop-Condition Assessment
85. Architectural Alignment Assessment
86. Task 6.7 Readiness
87. Recommended Next Task
88. Final Completion Determination

---

# 123. Required Planner Structure Matrix

Produce:

| Planner area    | Purpose                         | Current/future status |
| --------------- | ------------------------------- | --------------------- |
| Plan            | authored intent                 |                       |
| Review Schedule | generated plan review           |                       |
| Setup           | current authored implementation |                       |
| Goals           | authored intent                 |                       |
| Calendar        | date navigation                 |                       |
| Plan attention  | unresolved plan states          |                       |
| Friction        | deterministic conflict evidence |                       |

---

# 124. Required Terminology Matrix

Produce:

| Current term     | User-facing 6.6 treatment | Internal treatment |
| ---------------- | ------------------------- | ------------------ |
| Schedule         |                           |                    |
| Preview          |                           |                    |
| Generate Preview |                           |                    |
| stale Preview    |                           |                    |
| Friction Point   |                           |                    |
| Suggested Fix    |                           |                    |
| Try              |                           |                    |
| Accept           |                           |                    |
| Unplaced         |                           |                    |
| Setup            |                           |                    |

---

# 125. Required Schedule-State Matrix

Produce:

| State            | Presentation | Available action |
| ---------------- | ------------ | ---------------- |
| no schedule      |              |                  |
| fresh            |              |                  |
| stale            |              |                  |
| generation error |              |                  |
| profile cleared  |              |                  |
| full clear       |              |                  |

---

# 126. Required Attention Matrix

Produce:

| State    | Section | May say | Must not say |
| -------- | ------- | ------- | ------------ |
| unplaced |         |         |              |
| omitted  |         |         |              |
| blocked  |         |         |              |
| friction |         |         |              |

---

# 127. Required Friction/Resolution Matrix

Produce:

| Condition       | Presentation | Actions | Authority effect |
| --------------- | ------------ | ------- | ---------------- |
| friction no fix |              |         |                  |
| fix available   |              |         |                  |
| Try active      |              |         |                  |
| Accept          |              |         |                  |
| Cancel          |              |         |                  |

---

# 128. Required Surface-Boundary Matrix

Produce:

| Concern             | Planner Review Schedule | Today | Summary |
| ------------------- | ----------------------- | ----- | ------- |
| plan geometry       |                         |       |         |
| execution outcomes  |                         |       |         |
| plan friction       |                         |       |         |
| historical outcomes |                         |       |         |
| schedule mutation   |                         |       |         |
| outcome reporting   |                         |       |         |

---

# 129. Required State-Ownership Matrix

Produce:

| State            | Owner before | Owner after | Changed? |
| ---------------- | ------------ | ----------- | -------: |
| Setup draft      |              |             |          |
| Preview/schedule |              |             |          |
| planner mode     |              |             |          |
| selected day     |              |             |          |
| Try state        |              |             |          |
| accepted fix     |              |             |          |
| friction         |              |             |          |

---

# 130. Required Loading Matrix

Produce:

| Area            | Eager/lazy | Decision |
| --------------- | ---------- | -------- |
| Planner shell   |            |          |
| Plan mode       |            |          |
| Review Schedule |            |          |
| Today           | lazy       | preserve |
| Summary         | lazy       | preserve |

---

# 131. Required Accessibility Matrix

Produce:

| Interaction               | Requirement           |
| ------------------------- | --------------------- |
| Plan / Review Schedule    | selected state        |
| Generate/Refresh Schedule | named button          |
| stale state               | textual status        |
| calendar day              | keyboard selectable   |
| selected day              | exposed state         |
| friction                  | semantic heading/text |
| Try                       | named control         |
| Accept                    | named control         |
| Cancel                    | named control         |

---

# 132. Required Responsive Matrix

Produce:

| Area                       | Desktop | Mobile |
| -------------------------- | ------- | ------ |
| Planner subnav             |         |        |
| generation/status          |         |        |
| calendar                   |         |        |
| selected-day visualization |         |        |
| attention                  |         |        |
| friction/resolutions       |         |        |

---

# 133. Required Bundle Matrix

Use current 6.5 baseline:

| Metric       |     6.5 | 6.6 | Delta |
| ------------ | ------: | --: | ----: |
| Initial raw  | 682,538 |     |       |
| Initial gzip | 169,851 |     |       |
| Today query  |   4,890 |     |       |
| Today UI     |  11,262 |     |       |
| Summary      |  30,091 |     |       |
| largest lazy |  30,091 |     |       |
| total JS     | 728,781 |     |       |

If Review Schedule becomes lazy, add its chunk.

---

# 134. Required Product-Boundary Matrix

Produce:

| Capability               | Task 6.6   |
| ------------------------ | ---------- |
| Planner Review Schedule  |            |
| schedule generation      |            |
| stale schedule handling  |            |
| selected-day review      |            |
| variable user-days       |            |
| plan attention           |            |
| friction                 |            |
| deterministic resolution |            |
| commitment convergence   | Deferred   |
| Setup retirement         | Deferred   |
| drag/drop                | Deferred   |
| Today schedule writes    | Prohibited |
| Capacity                 | Prohibited |
| Recommendations          | Prohibited |

---

# 135. Required Epistemic Matrix

Produce:

| Evidence/state       | DayFrame may say                        | Must not say                   |
| -------------------- | --------------------------------------- | ------------------------------ |
| scheduled occurrence | scheduled                               | completed                      |
| stale schedule       | generated before latest planning edits  | invalid plan                   |
| unplaced             | not placed                              | skipped                        |
| omitted              | omitted                                 | failed                         |
| blocked              | blocked                                 | blame/cause                    |
| friction             | scheduling conflict/constraint evidence | user failure                   |
| resolution option    | bounded deterministic change            | intelligent recommendation     |
| schedule opening     | available temporal space                | Capacity                       |
| Goal edit            | Goal changed                            | schedule changed automatically |
| Today outcome        | reported reality                        | Planner schedule changed       |

---

# 136. Architectural Invariants

Assess at minimum:

1. Planner remains primary future-planning surface.
2. Today remains execution/reporting surface.
3. Summary remains historical-analysis surface.
4. Planner Plan mode remains available.
5. Review Schedule becomes explicit workflow.
6. no generic Commitment workflow is introduced.
7. Setup remains canonical authored editor for now.
8. Setup draft ownership remains singular.
9. Preview remains derived.
10. HistoricalPlan remains frozen history.
11. Preview and HistoricalPlan are not merged.
12. generation semantics remain unchanged.
13. HistoricalPlan publication trigger remains unchanged.
14. no acceptance authority is added.
15. no current-plan authority is added.
16. schedule does not auto-regenerate.
17. stale schedule remains visible.
18. stale notice is truthful.
19. Goal changes do not stale schedule unless governed.
20. Measurement changes do not stale schedule unless governed.
21. Today outcome reports do not stale schedule.
22. Planner Review Schedule shows plan, not execution outcomes.
23. selected-day uses canonical user-day semantics.
24. variable-duration days remain supported.
25. 24-hour assumption is not reintroduced.
26. DayVisualizer remains variable-duration capable.
27. planning horizon remains arbitrary.
28. calendar month is not an authority boundary.
29. scheduled remains scheduled.
30. unplaced remains unplaced.
31. omitted remains omitted where available.
32. blocked remains blocked where available.
33. friction remains separate from plan disposition.
34. no cause inference exists.
35. no blame inference exists.
36. suggested fixes remain deterministic remediation.
37. suggested fixes are not future Recommendations.
38. Try remains non-authoritative according to existing semantics.
39. Accept uses existing write path.
40. Cancel restores current governed state.
41. PlanDecision semantics remain unchanged.
42. no duplicate scheduling write path exists.
43. no duplicate manual-event write path exists.
44. no new authority exists.
45. no persistence change exists.
46. no Backup version change exists.
47. profile behavior remains governed.
48. restore behavior remains governed.
49. full clear removes review state.
50. selected-day invalidation is deterministic.
51. calendar remains one canonical selection model.
52. work remains plan geometry.
53. Sleep remains plan geometry.
54. manual events remain plan geometry.
55. Today outcome data is not imported into review.
56. Goal Progress is not imported.
57. Goal Activity is not imported.
58. Capacity is not introduced.
59. Planned Allocation is not introduced.
60. Recommendation is not introduced.
61. transition intelligence is not introduced.
62. drag/drop is not introduced.
63. direct resize is not introduced.
64. pin/lock is not introduced.
65. Planner remains eager unless bounded internal split is justified.
66. Today remains lazy.
67. Summary remains lazy.
68. authority bootstrap remains eager.
69. recovery remains eager/global.
70. bundle thresholds remain unchanged.
71. initial raw budget remains governing.
72. initial gzip budget remains governing.
73. total JS budget remains governing.
74. no runtime dependency is added.
75. subnavigation remains keyboard accessible.
76. stale status is textual.
77. calendar interaction is keyboard operable.
78. friction meaning is textual.
79. Try/Accept controls are accessible.
80. focus after generation is deterministic.
81. focus after resolution is deterministic.
82. mobile does not require horizontal desktop layout.
83. current Planner workflows remain green.
84. current Today workflows remain green.
85. current Summary workflows remain green.
86. canonical validation passes.
87. Task 6.7 remains first generic commitment-authoring convergence task.

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

# 137. Stop-Condition Assessment

If any stop condition triggers:

* do not partially retire Preview terminology in a misleading way;
* do not add hidden publication semantics;
* do not invent new acceptance;
* do not expand into commitment convergence;
* do not weaken bundle guard.

Report the blocker and recommended bounded prerequisite.

---

# 138. Focused Validation

Run focused suites covering:

* PlannerSurface;
* DayFrameApp;
* SetupScreen;
* PreviewScreen;
* DayVisualizer;
* generateSchedulePreview/store generation;
* friction;
* suggested fixes;
* manual events;
* profile load;
* full clear;
* Today independence.

Record exact file/test counts.

---

# 139. Full Validation

Run:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Record:

* test-file count;
* test count;
* build module count;
* initial raw;
* initial gzip;
* any Review Schedule chunk;
* Today chunks;
* Summary chunk;
* largest lazy;
* total JS;
* diff result.

---

# 140. Manual Product Walkthrough

If browser available, inspect:

### Planner / Plan

* Goals;
* Measurement;
* Setup;
* authored edits.

### Planner / Review Schedule

* empty state;
* generation;
* fresh state;
* stale state;
* range;
* calendar selection;
* ordinary user-day;
* long transition day;
* short transition day;
* work;
* Sleep;
* manual event;
* unplaced;
* friction;
* Try;
* Cancel;
* Accept.

### Cross-surface

* Today report does not change Planner schedule;
* Summary remains unchanged.

### Mobile

* Plan / Review Schedule nav;
* selected-day review;
* attention/friction stacking.

If unavailable, state explicitly.

---

# 141. Governance

Update:

* Task 6.6 result;
* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

No ADR unless the implementation establishes a new enduring product/application rule beyond Task 6.1.

A terminology/UI composition change alone does not require an ADR.

---

# 142. Task 6.7 Readiness

If Task 6.6 completes:

> **Task 6.7 — Commitment Authoring Convergence** becomes authorized.

That task should begin replacing the monolithic Setup information architecture with contextual:

```text
Add Commitment
Edit Commitment
Use Pattern
```

workflows while preserving canonical authored models and one-write-path semantics.

---

# 143. Recommended Next Task

If green:

> **Task 6.7 — Commitment Authoring Convergence.**

---

# 144. Completion Criteria

Task 6.6 is complete only when:

* Planner exposes an explicit Review Schedule workflow;
* Plan mode remains available;
* Review Schedule uses current canonical Preview/generated schedule state;
* Review Schedule does not pretend HistoricalPlan is an editable current plan;
* generation/publication behavior remains unchanged;
* user-facing Preview terminology is reduced where truthfully possible;
* Generate/Refresh Schedule copy matches actual behavior;
* no-schedule, fresh, and stale states are distinct;
* stale schedule remains visible after authored edits;
* auto-regeneration is not introduced;
* arbitrary planning ranges remain supported;
* calendar selection uses existing canonical date/user-day model;
* variable-duration 21/27-hour days remain truthful;
* DayVisualizer does not regress to 24-hour assumptions;
* scheduled work/manual/Sleep items remain visible;
* unplaced remains distinct from scheduled;
* omitted/blocked are shown only if canonical current generated state exposes them;
* friction has a coherent Planner placement;
* deterministic fixes are presented as bounded resolution options rather than generic Recommendations;
* Try semantics remain unchanged;
* Accept semantics remain unchanged;
* Cancel semantics remain unchanged;
* PlanDecision behavior remains unchanged;
* HistoricalPlan publication semantics remain unchanged;
* Goal/Measurement edits remain schedule-independent as governed;
* Today outcome reporting does not stale or mutate Planner schedule;
* profile/restore/full-clear behavior remains correct;
* selected-day lifecycle is deterministic;
* focus/accessibility/mobile behavior is sound;
* Planner, Today, and Summary retain distinct product responsibilities;
* Setup remains canonical authored workflow pending Task 6.7;
* no generic Commitment authority/workflow is prematurely introduced;
* no drag/drop/direct manipulation is introduced;
* no Capacity/Allocation/Recommendation/adaptation behavior is introduced;
* no new authority/persistence/schema/Backup version exists;
* eager bundle budgets remain green without threshold inflation;
* any optional Review Schedule lazy boundary is evidence-based;
* focused and canonical validation pass;
* governance records Planner schedule-review convergence;
* Task 6.7 is cleared to begin commitment-authoring convergence.

---

# 145. Final Implementation Principle

> **Planner should let the user review the schedule DayFrame built and resolve what does not fit, without requiring them to understand Preview machinery or blurring planning with execution.**

---

# 146. Final Completion Statement

**Task 6.6 is complete when DayFrame converges the Planner's generated-schedule experience into a coherent Review Schedule workflow that preserves the existing canonical Preview/scheduler, explicit generation, staleness, HistoricalPlan publication, friction, suggested-fix Try/Accept, PlanDecision, manual-event, profile, restore, and full-clear semantics while replacing unnecessary product-facing Preview machinery with clearer planning language; when Planner presents its arbitrary planning horizon, canonical selected user-day, variable-duration timeline, scheduled work, user-day-wide events, unplaced and other canonically available plan-attention states, and deterministic conflict-resolution options as one comprehensible planning workflow; when Review Schedule remains distinct from Today by showing plan geometry rather than execution evidence and distinct from Summary by remaining prospective rather than historical; when authored Goal/Measurement changes and Today execution reports do not silently alter or stale the schedule outside existing governed semantics; when no generic Commitment workflow, Setup retirement, acceptance authority, current-plan authority, drag/drop, direct placement, Capacity, Planned Allocation, Recommendation, adaptation, transition intelligence, new authority, persistence schema, or Backup version is introduced; when accessibility, keyboard focus, desktop/mobile presentation, variable-duration-day behavior, stale-state handling, one-write-path semantics, and the governing bundle budgets remain intact; when focused and full validation pass; and when the resulting Planner is ready for Task 6.7 to converge authored Setup concepts into contextual Add Commitment, Edit Commitment, and Pattern workflows without reopening schedule-review architecture.**
