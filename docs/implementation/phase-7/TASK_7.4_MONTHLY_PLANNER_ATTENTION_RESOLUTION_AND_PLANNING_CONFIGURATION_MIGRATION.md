# Task 7.4 — Monthly Planner Attention, Resolution, and Planning Configuration Migration Audit/Implementation

## Status

Ready for implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

Planner responsibility audit, Monthly Planner attention-model integration, friction-resolution migration, unplaced-workflow migration, schedule generation/refresh contextualization, planning-configuration responsibility assessment, Goals/Preferences/Planning Range migration assessment and bounded implementation, exact-source preservation, canonical suggested-fix reuse, Plan/Review strangler-migration analysis, lazy-boundary preservation, eager-bundle-growth governance, accessibility/mobile/browser validation, and governance.

**This task must determine responsibility before moving UI.**

It does not pre-authorize:

* Plan retirement;
* Review Schedule retirement;
* direct schedule geometry editing;
* drag/drop;
* direct occurrence placement;
* scheduler redesign;
* recurrence redesign;
* Capacity;
* Allocation;
* Recommendations;
* Pattern Library;
* transition-adaptation recommendations;
* Goal reorientation;
* new planning authority;
* new persistence.

---

# 1. Objective

Determine which remaining Planner responsibilities naturally belong inside the Monthly Planner, then migrate only those responsibilities whose existing semantics and authority boundaries support contextual Month ownership.

After Task 7.3, Month already supports:

```text
Month
├── Review Day
├── Add Commitment
├── Edit Commitment
├── Add Event
├── Edit Event
└── Edit Work
```

The major remaining Planner responsibilities are approximately:

```text
Plan
├── Goals
├── Schedule Preferences
├── Planning Range
├── Work configuration
├── Commitment authoring
└── Save Setup

Review Schedule
├── Generate / Refresh
├── detailed generated schedule
├── Day Visualizer
├── friction
├── suggested Resolution options
├── Try
├── Apply Planning Change
└── Event paths
```

Task 7.4 must answer:

> **Which of these are contextual Monthly Planner responsibilities, which remain specialized supporting workflows, and which should eventually disappear as independent destinations?**

Then implement the bounded answer where architecture is already sufficient.

---

# 2. Governing Product Model

The intended Planner mental model remains:

```text
PLANNER

Monthly Planner
    ├── inspect schedule
    ├── inspect selected day
    ├── add/edit intent
    ├── identify attention
    ├── resolve scheduling problems
    └── adjust planning context

Supporting workflows
    ├── configuration where necessary
    └── specialized detailed review where necessary
```

The Monthly Planner should increasingly become the primary planning surface.

That does **not** mean every existing control must physically appear inside the calendar.

---

# 3. Governing Migration Principle

> **Migrate responsibilities, not screens.**

Do not embed entire legacy Plan or Review Schedule surfaces merely to make Month appear feature-complete.

For every candidate responsibility:

1. identify its semantic owner;
2. identify its authority;
3. identify its writer;
4. identify its current UI owner;
5. determine whether Month already has sufficient contextual evidence;
6. determine whether the workflow is naturally contextual;
7. reuse the canonical implementation;
8. preserve specialized surfaces when they still provide distinct value.

---

# 4. Task 7.3 Prerequisite

Task 7.3 established:

* Month contextual workspace;
* Review Day;
* Add/Edit Commitment;
* Add/Edit Event;
* Work contextual navigation;
* exact target revalidation;
* canonical one-writer behavior;
* selected-day context preservation;
* lazy Plan-authoring reuse;
* stale geometry preservation;
* mobile/keyboard behavior.

These semantics are governing and must not be reopened casually.

Task 7.3 completed with:

```text
94 test files
970 tests

Initial raw      633,562
Initial gzip     161,467
Largest lazy      51,852
Total JS         755,909
```

---

# 5. Bundle-Governance Constraint

Task 7.2C remains governing.

Hard:

```text
Initial raw       <= 685,000
Initial gzip      <= 170,000
Largest lazy      <= 100,000
```

Warning:

```text
Initial raw       >= 650,000
Initial gzip      >= 161,500
Largest lazy      >= 80,000
```

Advisory total:

```text
Total JS >= 800,000
    growth review

Total JS >= 825,000
    architecture review + ADR
```

Task 7.3 ended only **33 gzip bytes below the initial-gzip warning**.

Therefore Task 7.4 must assume the warning will probably be crossed.

Crossing the warning is not failure.

It requires:

* exact attribution;
* eager-ownership analysis;
* justification;
* confirmation that lazy ownership remains appropriate.

Do not distort architecture merely to stay 33 bytes below a warning.

---

# 6. Mandatory Responsibility Audit

Before implementation, build a mechanical inventory of every remaining responsibility in:

### Plan

* Goals;
* Schedule Preferences;
* Planning Range;
* Work Hours;
* Work Schedule;
* Commitments;
* advanced Commitment fields;
* Save Setup;
* profile-related controls if present;
* any remaining authored-setup controls.

### Review Schedule

* Generate;
* Refresh;
* stale-state messaging;
* Preview status;
* day/range navigation;
* detailed schedule;
* Day Visualizer;
* friction;
* friction participants;
* suggested fixes;
* Resolution options;
* Try;
* Apply Planning Change;
* Event controls;
* unplaced candidates;
* omitted/blocked evidence;
* any remaining Preview-only workflows.

For each, identify:

* read authority;
* write authority;
* semantic owner;
* current component;
* existing application action;
* exact-target requirements;
* whether selected-day context is sufficient;
* whether Month already exposes equivalent evidence;
* whether migration would duplicate implementation.

---

# 7. Required Responsibility Classification

Classify every audited responsibility as one of:

### A — Migrate Now

Month already has sufficient semantics and canonical workflow.

### B — Contextual Entry Only

Month should expose navigation/action, while specialized UI remains elsewhere.

### C — Keep Specialized

The responsibility still benefits from a dedicated supporting workflow.

### D — Defer

Architecture/product semantics are not mature enough.

### E — Candidate for Retirement

The legacy presentation no longer owns unique responsibility after migration.

Do not force every responsibility into A.

---

# 8. Mandatory Responsibility Matrix

Produce before implementation:

| Responsibility        | Current surface | Authority                 | Month evidence sufficient? | Classification          | Reason |
| --------------------- | --------------- | ------------------------- | -------------------------: | ----------------------- | ------ |
| Add/Edit Commitment   | Plan            | authored setup            |                        Yes | already migrated        | 7.3    |
| Add/Edit Event        | Review/shell    | Event                     |                        Yes | already migrated        | 7.3    |
| Work configuration    | Plan            | authored setup            |                        Yes | contextual entry exists | 7.3    |
| Generate/Refresh      | Review          | derived Preview           |                      audit |                         |        |
| friction              | Review          | derived                   |                      audit |                         |        |
| Resolution options    | Review          | derived + existing action |                      audit |                         |        |
| Try                   | Review          | derived                   |                      audit |                         |        |
| Apply Planning Change | Review          | authored/decision path    |                      audit |                         |        |
| Goals                 | Plan            | Goal/authored setup       |                      audit |                         |        |
| Schedule Preferences  | Plan            | authored setup            |                      audit |                         |        |
| Planning Range        | Plan            | authored setup            |                      audit |                         |        |
| Day Visualizer        | Review          | Preview                   |                      audit |                         |        |
| detailed schedule     | Review          | Preview                   |                      audit |                         |        |

Use actual repository authorities and terminology.

---

# 9. Primary Implementation Target — Attention

Task 7.4 should make **Needs attention** actionable from Month.

The Month already exposes bounded attention evidence.

The user should be able to move:

```text
Month
    ↓
selected day
    ↓
Needs attention
    ↓
specific issue
    ↓
existing resolution workflow
```

without first reasoning about which legacy Planner tab contains it.

---

# 10. Attention Is Derived Evidence

Attention remains projection.

Do not create:

* durable attention records;
* attention authority;
* persisted warning state.

It must remain derivable from canonical schedule/friction evidence.

---

# 11. Friction Semantics

Reuse the existing friction model exactly.

Do not infer new friction from:

* uncovered dates;
* empty dates;
* unplaced alone unless current model says so;
* elapsed time;
* Event existence;
* user-day duration;
* Goal importance.

---

# 12. Friction Identity

Audit existing friction identity/provenance.

Month must use existing exact friction/source evidence.

Do not identify friction by displayed title or participant labels.

---

# 13. Selected-Day Friction

Where Month already projects friction for the selected user-day, expose sufficient details to understand:

* what needs attention;
* relevant participants;
* existing canonical Resolution options.

Do not create new resolution policy.

---

# 14. Resolution Options

If existing suggested-fix generation provides canonical options, Month should present/reuse those options contextually where safe.

Preferred model:

```text
Needs attention
    ↓
Resolution options
        ├── existing option A
        ├── existing option B
        └── existing option C
```

Use actual repository terminology.

---

# 15. Resolution Writer Boundary

Month may invoke an existing resolution action.

It must not implement a new resolution writer.

Trace:

* suggested-fix generation;
* selected fix;
* Try;
* Apply Planning Change;
* resulting Preview/authored-state effects.

---

# 16. Try Semantics Audit

Before migrating Try, establish exactly what Try means today.

Determine:

* inputs;
* whether it mutates authority;
* whether it creates a temporary Preview;
* whether it revises current Preview;
* whether it persists anything;
* how it relates to Apply Planning Change;
* how stale state behaves.

Do not infer from button wording.

---

# 17. Apply Planning Change Audit

Trace exactly:

```text
selected Resolution
    ↓
Try
    ↓
Apply Planning Change
```

or actual production sequence.

Determine:

* authority changed;
* exact source changed;
* whether SetupDraft participates;
* whether PlanDecision participates;
* whether Preview is regenerated;
* whether action is reversible;
* how exact identity is protected.

---

# 18. Resolution Migration Rule

Only migrate Try/Apply into Month if the existing application actions can be reused without duplicating semantic logic.

If not:

* provide contextual entry to Review Schedule;
* classify as B or C;
* stop short of cloning workflow.

---

# 19. Friction Participant Editing

Task 7.3 already permits exact authored-source editing adjacent to friction.

Preserve:

```text
Resolve schedule issue
    ≠
Edit participant source
```

Both may be available.

They are different actions.

---

# 20. Unplaced Evidence

Audit current unplaced-candidate semantics.

Determine whether Month has enough information to expose:

* source;
* reason/context;
* exact Edit Commitment;
* existing resolution options, if any.

---

# 21. No Direct Placement

Task 7.4 does not authorize:

* drag onto calendar;
* choose arbitrary empty interval;
* direct occurrence placement;
* resize;
* direct generated start/end edits.

If current resolution workflow can move something canonically, reuse that workflow.

---

# 22. Generate / Refresh Audit

Determine exact current semantics of:

* Generate;
* Refresh Schedule;
* Generate new Preview;
* stale Preview;
* missing Preview.

Use actual product actions.

---

# 23. Generate / Refresh Product Question

The Month is now the primary spatial Planner surface.

Therefore audit whether schedule generation should become a Month-level action.

Likely desired model:

```text
authored setup changed
    ↓
Month shows stale schedule
    ↓
Refresh Schedule
    ↓
canonical generation
    ↓
Month reprojects
```

But implementation must follow existing authority semantics.

---

# 24. Generation Writer Boundary

Month must call the existing canonical generation action.

Do not duplicate:

* `generateSchedulePreview`;
* store generation logic;
* date-range derivation;
* friction detection;
* suggested-fix generation.

---

# 25. Missing Preview

If no Preview exists:

Month should provide a truthful path to generate one if existing readiness allows it.

Do not call an absent Preview:

* empty month;
* free month;
* no commitments.

---

# 26. Stale Preview

Preserve Task 7.3 behavior:

* stale geometry remains visible;
* stale status remains explicit;
* source editing remains exact.

Task 7.4 may add contextual **Refresh Schedule**.

It must not automatically refresh merely because Month is visible.

---

# 27. Refresh Completion

After successful canonical generation:

* displayed month remains stable where possible;
* selected label remains stable where valid;
* Month reprojects fresh schedule;
* focus returns to Refresh/status or selected-day heading deterministically.

---

# 28. Generation Failure

Use existing error/protection semantics.

Do not replace old geometry with fabricated empty state.

---

# 29. Planning Configuration Audit

The next question is whether the following belong inside the Monthly Planner:

* Goals;
* Schedule Preferences;
* Planning Range.

Do not assume the answer is identical for all three.

---

# 30. Goals Assessment

Audit current Goals responsibility.

Determine:

* whether Goals are primary planning configuration;
* whether they need persistent visibility during Month use;
* whether Month already has meaningful Goal context;
* whether Goal editing is naturally contextual to a selected day;
* whether Goal controls belong in a Planner-level configuration mode rather than Review Day.

---

# 31. Goals Migration Rule

Possible outcomes include:

### Migrate

A Planner-level Goals workspace inside Month.

### Contextual Entry

Month provides **Goals** action opening the existing canonical workflow.

### Keep Specialized

Plan remains useful as Goals/configuration workspace.

Do not invent Goal ranking, allocation, progress, or recommendation behavior.

---

# 32. Goal Authority

Preserve existing Goal authority and exact Commitment links.

No Month-specific Goal representation.

---

# 33. Schedule Preferences Assessment

Audit:

* day boundary;
* week start;
* cycle/segment overrides;
* shift-specific preferences;
* any current preference sections.

These are global/regime planning configuration, not necessarily selected-day editing.

---

# 34. Preferences Migration Rule

If migrated, they should appear as a **Planner configuration mode**, not masquerade as properties of the selected day.

For example:

```text
Monthly Planner
    ├── Review Day
    └── Planning Settings
         └── Schedule Preferences
```

Only if reuse is clean.

---

# 35. User-Day Safety

Any preference edit affecting day boundary must preserve the canonical piecewise user-day architecture established in Tasks 6.3A/6.3B.

Task 7.4 must not introduce local Month calculations.

---

# 36. Planning Range Assessment

Audit the role of Planning Range now that Month itself has displayed-month navigation.

Important question:

> Does authored Preview generation range still serve a distinct function from the month being viewed?

Do not conflate:

```text
displayed month
```

with:

```text
generation/planning range
```

unless architecture explicitly equates them.

---

# 37. Planning Range Migration Rule

If range remains authored generation configuration:

preserve it as such.

Month navigation must not silently rewrite it.

---

# 38. Month Navigation Independence

Mandatory:

```text
view September
```

must not automatically mean:

```text
change authored planning range to September
```

unless a future explicit feature defines that action.

---

# 39. Work Configuration Reassessment

Task 7.3 already added contextual Work entry.

Audit whether anything further is needed.

Do not move more Work UI merely for symmetry.

---

# 40. Advanced Commitment Fields

Task 7.3 reuses canonical Commitment editor.

No separate migration should be necessary.

Confirm.

---

# 41. Save Setup Responsibility

Audit whether Save Setup should remain inside the contextual Plan editor, become a Planner-level pending-change action, or remain where it is for now.

Do not change save semantics without clear architectural evidence.

---

# 42. Unsaved SetupDraft Visibility

When Month contextual workflows create pending SetupDraft changes, the user must be able to understand:

* changes are not yet durably saved;
* Save Setup remains required;
* schedule refresh is separate.

Avoid a state where Month appears current while authored changes remain hidden in another mode.

---

# 43. Potential Planner Status Model

Audit whether existing state is sufficient for a compact Planner-level status area:

```text
Saved setup
Pending setup changes
Schedule current
Schedule stale
Schedule unavailable
```

This is presentation over existing truth.

Do not persist status.

---

# 44. Separation of Save and Refresh

Preserve:

```text
edit planning intent
    ↓
Save Setup
    ↓
authored truth changes
    ↓
schedule stale
    ↓
Refresh Schedule
```

Do not collapse Save Setup and Refresh into one implicit action.

---

# 45. Review Schedule Detailed View

Audit whether Review Schedule still provides unique value through:

* detailed Day Visualizer;
* broader schedule inspection;
* friction details;
* resolution workflow;
* generated candidate diagnostics.

If yes, keep it as a specialized view.

---

# 46. Day Visualizer

Do not migrate the detailed Day Visualizer merely because Month contains a day.

Possible outcome:

**View detailed day**

from Month opens/reuses Review.

That may be the correct long-term supporting relationship.

---

# 47. Review Schedule Candidate Retirement

Review Schedule may be classified as:

* still required specialized surface;
* reduced specialized surface;
* candidate for later retirement.

Task 7.4 must provide evidence.

Do not remove it unless it owns no unique required responsibility and all regression/browser evidence supports removal.

Default: preserve.

---

# 48. Plan Candidate Retirement

Likewise determine whether Plan still uniquely owns:

* Goals;
* preferences;
* range;
* Save Setup;
* advanced configuration.

Default: preserve unless migration is complete and clearly safe.

---

# 49. Strangler Architecture

Desired direction:

```text
Before

Planner
├── Month
├── Plan
└── Review Schedule


During

Planner
├── Month
│    ├── contextual authoring
│    ├── attention
│    ├── resolution
│    └── configuration entry
├── Plan                supporting
└── Review Schedule     supporting


Future candidate

Planner
└── Month
     ├── planning workspace
     └── links to specialized detail only where useful
```

Task 7.4 determines how far the middle state can truthfully progress.

---

# 50. Contextual Workspace Expansion

Extend the Task 7.3 workspace only where justified.

Potential modes:

```text
reviewDay
resolveAttention
addCommitment
editCommitment
addEvent
editEvent
work
goals
planningSettings
```

Do not add modes that simply wrap entire legacy screens without contextual value.

---

# 51. Attention Mode

If resolution migration is clean, introduce a bounded attention mode.

It should remain tied to:

* selected user-day;
* exact friction/attention evidence.

Changing selected day must not retarget an active resolution silently.

---

# 52. Resolution Target Stability

Like source editors:

```text
open Resolution
    ↓
target evidence changes
    ↓
revalidate
```

Do not apply an old fix to a different regenerated conflict.

Audit existing fix identity.

---

# 53. Refresh Invalidates Resolution Context

If schedule regeneration changes friction:

an open Month resolution context must:

* revalidate;
* close;
* or show unavailable.

Never apply stale resolution blindly.

---

# 54. Source Edit Invalidates Resolution Context

Same principle.

Editing a participant may change the conflict.

Resolution must be revalidated before Try/Apply.

---

# 55. Profile Replacement

Any open:

* attention;
* resolution;
* configuration;
* source editor

must respond safely to profile replacement.

No stale action survives authority replacement.

---

# 56. Restore Replacement

Same.

---

# 57. Full Clear

Close stale contextual workflows.

Month returns to truthful empty/unavailable readiness.

---

# 58. Protection

Protected authored or Preview state must not become writable empty UI.

Reuse recovery semantics.

---

# 59. Preview Independence Boundary

Month reads Preview as schedule projection.

Even after migrating Refresh and Resolution actions:

Month itself does not become Preview authority.

---

# 60. PlanDecision Boundary

Audit whether Apply Planning Change writes PlanDecision or another existing authority.

Preserve that boundary exactly.

Do not bypass it because Month is now the entry surface.

---

# 61. HistoricalPlan Boundary

No change.

Month planning workflows do not rewrite published historical plans.

---

# 62. ExecutionHistory Boundary

No change.

Planning resolution does not infer execution.

---

# 63. Today Boundary

No change.

Today remains current-plan/execution-oriented.

Do not migrate Today reporting into Month.

---

# 64. Summary Boundary

No change.

Summary remains historical intelligence.

---

# 65. Capacity Boundary

No Capacity model.

An opening is not automatically capacity.

---

# 66. Allocation Boundary

No planned Goal allocation model.

---

# 67. Recommendation Boundary

Existing deterministic suggested fixes may be shown because they already exist.

Do not generalize them into a new recommendation system.

---

# 68. Transition-Planning Boundary

The shift-transition architecture discovered in 6.3A remains future-compatible.

Task 7.4 does not implement:

* transitional sleep proposals;
* temporary Goal reorientation;
* reduced-load recommendations;
* transition strategies.

---

# 69. Pattern Library Boundary

Deferred.

---

# 70. Accessibility — Attention

Attention controls must communicate:

* issue;
* target;
* available action.

Do not rely on color alone.

---

# 71. Accessibility — Resolution

Each Resolution option requires a meaningful accessible name.

Try/Apply must communicate state and consequence using existing semantics.

---

# 72. Accessibility — Refresh

Stale status and Refresh action must be keyboard accessible and understandable without visual-only indicators.

---

# 73. Accessibility — Configuration

If Goals/Preferences/Range become contextual modes:

* headings;
* labels;
* errors;
* Save Setup state;
* Back to planner/day;

must remain coherent.

---

# 74. Focus — Attention

Opening attention:

focus issue heading or first Resolution option.

---

# 75. Focus — Resolution Completion

After successful Try/Apply:

focus updated attention/status region.

Do not return to `body`.

---

# 76. Focus — Refresh

After Refresh:

focus schedule-current status or selected-day heading.

---

# 77. Focus — Configuration

Opening a configuration mode focuses its heading/first logical field.

Back restores stable Planner context.

---

# 78. Keyboard

All migrated functionality must work without pointer input.

No hover-only friction actions.

---

# 79. Mobile

At 320/375/390/430:

* Month grid remains usable;
* attention details stack;
* Resolution options fit;
* configuration forms fit;
* no horizontal page scroll;
* Back navigation remains obvious.

---

# 80. Desktop

Preserve the useful split:

```text
Month Grid | Contextual Workspace
```

Attention/resolution/configuration should use the workspace where practical.

---

# 81. Eager/Lazy Ownership Audit

Before introducing imports, identify where current:

* friction UI;
* resolution UI;
* generation controls;
* Goal configuration;
* preference configuration;

live in the bundle graph.

Prefer reuse through existing lazy capabilities.

Do not eager-import large Review/Plan subtrees into the shell.

---

# 82. Initial-Gzip Warning Handling

Because baseline is 161,467:

any ordinary eager growth will probably trigger the warning.

When crossed, report:

```text
baseline
final
delta
new eager imports
why they are eager
whether they could truthfully remain lazy
```

Warning does not automatically require remediation.

Unexplained growth does.

---

# 83. Hard Guard

Initial gzip must remain:

```text
<= 170,000
```

If not, stop unless safe in-scope remediation exists.

Do not revise policy.

---

# 84. Initial Raw

Same:

```text
<= 685,000
```

warning at 650,000.

---

# 85. Largest Lazy

Same:

```text
<= 100,000
```

warning at 80,000.

---

# 86. Total JS

Report every build.

At:

```text
>= 800,000
```

perform growth review.

At:

```text
>= 825,000
```

stop for architecture review/ADR.

---

# 87. No Runtime Dependency

Mandatory.

---

# 88. No Bundle Gaming

Do not:

* exclude vendor;
* change counting;
* move code solely to dodge warnings;
* disable loading behavior merely for bytes;
* weaken thresholds.

---

# 89. Tests — Responsibility Audit

The result artifact must show every legacy responsibility classified.

No silent omissions.

---

# 90. Tests — Attention

Cover:

* selected-day attention;
* no attention;
* multiple issues;
* exact issue context;
* stale issue;
* regenerated issue.

---

# 91. Tests — Resolution

If migrated:

* options rendered from canonical source;
* option selection;
* Try;
* Apply;
* cancel/back;
* stale target;
* source mutation;
* regeneration invalidation;
* no duplicate writer.

---

# 92. Tests — Friction Participant Edit

Editing source remains separate from applying resolution.

---

# 93. Tests — Unplaced

Exact source editing remains.

Any canonical resolution reuse is tested.

No direct placement.

---

# 94. Tests — Generate

Cover:

* no Preview;
* generation ready;
* generation unavailable;
* selected month preserved;
* selected label preserved.

---

# 95. Tests — Refresh

Cover:

* stale schedule;
* refresh;
* fresh projection;
* stale geometry retained before refresh;
* deterministic focus.

---

# 96. Tests — Save/Refresh Separation

Mandatory:

```text
edit
Save Setup
    → stale

Refresh
    → fresh
```

No implicit refresh on Save.

---

# 97. Tests — Goals

If migrated/contextualized:

* canonical writer;
* exact existing semantics;
* Save Setup behavior;
* no ranking/allocation semantics.

---

# 98. Tests — Preferences

If migrated:

* canonical writer;
* day boundary;
* week start;
* segment overrides;
* no Month-local user-day math;
* Save Setup/staleness.

---

# 99. Tests — Planning Range

If migrated:

* canonical writer;
* Month navigation independent;
* changing displayed month does not mutate range;
* range changes preserve existing generation semantics.

---

# 100. Tests — Pending SetupDraft

If Month exposes unsaved status:

* appears after draft change;
* clears on Save;
* survives contextual navigation as existing draft does;
* no false durable state.

---

# 101. Tests — Profile/Restore/Clear

Cover all newly introduced contextual modes.

---

# 102. Tests — Protection

No writable empty fallbacks.

---

# 103. Tests — Plan Regression

All remaining Plan responsibilities work.

---

# 104. Tests — Review Regression

All remaining Review responsibilities work.

---

# 105. Tests — Month 7.3 Regression

Add/Edit Commitment/Event/Work remains green.

---

# 106. Tests — Today/Summary Regression

Representative independence coverage.

---

# 107. Tests — Accessibility

Cover:

* attention names;
* Resolution option names;
* Refresh;
* status;
* Back;
* focus.

---

# 108. Tests — Responsive Structure

Component-level where useful.

Browser QA remains mandatory.

---

# 109. Browser QA — Attention Journey

Production build:

```text
Month
    select day with attention
    inspect issue
    inspect participants
    open resolution/context
```

Verify Month remains spatial anchor.

---

# 110. Browser QA — Resolution Journey

If migrated:

```text
attention
    choose existing option
    Try
    inspect result
    Apply Planning Change
    verify canonical resulting state
```

Use controlled fixture.

---

# 111. Browser QA — Source Edit From Attention

Open exact participant source.

Return.

Verify issue state revalidates.

---

# 112. Browser QA — Refresh Journey

```text
Month
    edit authored setup
    Save Setup
    stale Month
    Refresh Schedule
    fresh Month
```

Verify selected month/day context.

---

# 113. Browser QA — Missing Preview

Controlled clean fixture:

* truthful missing state;
* Generate action where allowed;
* resulting Month.

---

# 114. Browser QA — Configuration

For every migrated configuration responsibility:

* open;
* edit controlled field;
* save/cancel;
* return;
* stale semantics.

---

# 115. Browser QA — Planning Range Independence

Navigate Month without changing generation range.

If range UI is migrated, separately change range and verify explicit behavior.

---

# 116. Browser QA — Keyboard

Complete core attention/refresh/configuration journeys without mouse.

---

# 117. Browser QA — Mobile

At:

```text
320
375
390
430
```

Validate attention/resolution/configuration.

---

# 118. Browser QA — Slow Lazy Load

Throttle any newly reused lazy capability.

Month remains visible.

Loading is explicit.

Stale targets revalidate after load.

---

# 119. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.4_MONTHLY_PLANNER_ATTENTION_RESOLUTION_AND_PLANNING_CONFIGURATION_MIGRATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 7.3 Prerequisite
4. Bundle Governance Prerequisite
5. Initial Responsibility Audit
6. Plan Responsibility Inventory
7. Review Responsibility Inventory
8. Responsibility Classification
9. Files Changed
10. Month Workspace Changes
11. Attention Model
12. Attention Authority
13. Friction Semantics
14. Friction Identity
15. Selected-Day Friction
16. Resolution Options
17. Resolution Writer
18. Try Audit
19. Apply Planning Change Audit
20. Resolution Migration Decision
21. Friction Participant Editing
22. Unplaced Audit
23. Unplaced Migration Decision
24. Direct Placement Boundary
25. Generate Audit
26. Refresh Audit
27. Generate Migration Decision
28. Refresh Migration Decision
29. Missing Preview
30. Stale Preview
31. Refresh Completion
32. Generation Failure
33. Planning Configuration Audit
34. Goals Assessment
35. Goals Migration Decision
36. Goal Authority
37. Schedule Preferences Assessment
38. Preferences Migration Decision
39. User-Day Boundary
40. Planning Range Assessment
41. Planning Range Migration Decision
42. Month Navigation Independence
43. Work Reassessment
44. Advanced Commitment Assessment
45. Save Setup Assessment
46. Unsaved Draft Visibility
47. Save/Refresh Separation
48. Planner Status Model
49. Detailed Review Assessment
50. Day Visualizer Assessment
51. Review Schedule Retirement Assessment
52. Plan Retirement Assessment
53. Strangler Migration State
54. Workspace Modes
55. Resolution Target Stability
56. Refresh Invalidation
57. Source-Edit Invalidation
58. Profile Replacement
59. Restore Replacement
60. Full Clear
61. Protection
62. Preview Boundary
63. PlanDecision Boundary
64. HistoricalPlan Boundary
65. ExecutionHistory Boundary
66. Today Boundary
67. Summary Boundary
68. Capacity Boundary
69. Allocation Boundary
70. Recommendation Boundary
71. Transition Boundary
72. Pattern Library Boundary
73. Accessibility
74. Focus
75. Keyboard
76. Mobile
77. Desktop
78. Lazy Ownership
79. Initial-Gzip Review
80. Initial-Raw Review
81. Largest-Lazy Review
82. Total-JS Review
83. Runtime Dependency Assessment
84. Tests Added/Changed
85. Focused Validation
86. Full Validation
87. Bundle Validation
88. Browser Attention QA
89. Browser Resolution QA
90. Browser Source-Edit QA
91. Browser Refresh QA
92. Browser Missing-Preview QA
93. Browser Configuration QA
94. Browser Range-Independence QA
95. Browser Keyboard QA
96. Browser Mobile QA
97. Slow-Load QA
98. Governance Updates
99. ADR Determination
100. Deviations
101. Discoveries
102. Deferred Work
103. Responsibility Matrix
104. Attention Matrix
105. Resolution Matrix
106. Generate/Refresh Matrix
107. Configuration Matrix
108. Save/Refresh Matrix
109. Workspace Matrix
110. Migration Matrix
111. Legacy-Surface Matrix
112. Focus Matrix
113. Responsive Matrix
114. Loading Matrix
115. Bundle Matrix
116. Authority Matrix
117. Product-Boundary Matrix
118. Epistemic Matrix
119. Architectural Invariant Assessment
120. Stop-Condition Assessment
121. Architectural Alignment Assessment
122. Plan/Review Convergence Assessment
123. Task 7.5 Readiness
124. Recommended Next Task
125. Final Completion Determination

---

# 120. Required Responsibility Matrix

| Responsibility        | Current owner | Semantic/authority owner  | Month classification | Final location          |
| --------------------- | ------------- | ------------------------- | -------------------- | ----------------------- |
| Add/Edit Commitment   | Plan/shared   | authored setup            | migrated 7.3         | Month + shared workflow |
| Add/Edit Event        | Event writer  | Event                     | migrated 7.3         | Month + shared workflow |
| Work                  | Plan/shared   | authored setup            | contextual 7.3       | determine               |
| friction              | Review        | derived Preview/friction  |                      |                         |
| Resolution options    | Review        | canonical suggested fixes |                      |                         |
| Try                   | Review        | audit                     |                      |                         |
| Apply Planning Change | Review        | audit                     |                      |                         |
| Generate              | Review        | Preview generation        |                      |                         |
| Refresh               | Review        | Preview generation        |                      |                         |
| Goals                 | Plan          | existing Goal authority   |                      |                         |
| Preferences           | Plan          | authored setup            |                      |                         |
| Planning Range        | Plan          | authored setup            |                      |                         |
| Save Setup            | Plan          | authored setup boundary   |                      |                         |
| Day Visualizer        | Review        | Preview presentation      |                      |                         |
| detailed Review       | Review        | Preview presentation      |                      |                         |

---

# 121. Required Attention Matrix

| State                  | Month presentation     | Action                                          |
| ---------------------- | ---------------------- | ----------------------------------------------- |
| no attention           | normal review          | none                                            |
| one friction           | issue context          | resolve/edit source                             |
| multiple friction      | bounded list           | select issue                                    |
| unplaced               | separate evidence      | edit source / canonical resolution if supported |
| stale friction         | stale schedule context | revalidate                                      |
| regenerated-away issue | unavailable/close      | no stale action                                 |
| uncovered              | Not generated          | never friction by inference                     |

---

# 122. Required Resolution Matrix

| Action                | Reads            | Writes                    |           Durable? | Revalidation required? |
| --------------------- | ---------------- | ------------------------- | -----------------: | ---------------------: |
| inspect issue         | derived friction | none                      |                 No |                    Yes |
| select option         | suggested fixes  | local UI                  |                 No |                    Yes |
| Try                   | audit result     | audit result              |              audit |                    Yes |
| Apply Planning Change | audit            | canonical existing writer |              audit |                    Yes |
| edit participant      | exact source     | canonical source writer   | existing semantics |                    Yes |

Fill from production evidence.

---

# 123. Required Generate/Refresh Matrix

| State              | Month action       | Existing canonical action | Result |
| ------------------ | ------------------ | ------------------------- | ------ |
| no Preview         | Generate           |                           |        |
| fresh Preview      | none/current       |                           |        |
| stale Preview      | Refresh Schedule   |                           |        |
| generation blocked | unavailable reason |                           |        |
| generation error   | truthful error     |                           |        |
| protected          | recovery           |                           |        |

---

# 124. Required Configuration Matrix

| Configuration        | Selected-day contextual? | Planner-level? | Canonical writer reusable? | Decision |
| -------------------- | -----------------------: | -------------: | -------------------------: | -------- |
| Goals                |                          |                |                            |          |
| Schedule Preferences |                          |                |                            |          |
| Planning Range       |                          |                |                            |          |
| Work                 |                   partly |                |                        Yes |          |
| Commitments          |                   partly |                |                        Yes | migrated |
| Save Setup           |                          |                |                        Yes |          |

---

# 125. Required Save/Refresh Matrix

| State/action           | SetupDraft    | Durable setup | Preview            |
| ---------------------- | ------------- | ------------- | ------------------ |
| type authored edit     | local/editor  | unchanged     | unchanged          |
| commit editor change   | changed draft | unchanged     | existing semantics |
| Save Setup             | synchronized  | changed       | stale              |
| navigate Month         | unchanged     | unchanged     | unchanged          |
| Refresh Schedule       | unchanged     | unchanged     | regenerated        |
| change displayed month | unchanged     | unchanged     | unchanged          |

Refine mechanically.

---

# 126. Required Workspace Matrix

| Mode                | Context                 |           Authority write? | Canonical implementation |
| ------------------- | ----------------------- | -------------------------: | ------------------------ |
| Review Day          | selected user-day       |                         No | Month                    |
| Add/Edit Commitment | exact source/global add |          via shared writer | shared Plan              |
| Add/Edit Event      | selected/exact          |           via Event writer | existing                 |
| Work                | composite               |          via shared writer | Plan                     |
| Attention           | selected issue          | derived/local until action | audit                    |
| Goals               | Planner-level           |            existing writer | audit                    |
| Planning Settings   | Planner-level           |            existing writer | audit                    |

---

# 127. Required Migration Matrix

| Capability           | Before 7.3 | After 7.3               | After 7.4 |
| -------------------- | ---------- | ----------------------- | --------- |
| Month review         | Month      | Month                   |           |
| Commitment authoring | Plan       | Month + Plan            |           |
| Event authoring      | Review     | Month + Review          |           |
| Work                 | Plan       | Month entry + Plan      |           |
| attention            | Review     | Review + Month evidence |           |
| resolution           | Review     | Review                  |           |
| generation           | Review     | Review                  |           |
| Goals                | Plan       | Plan                    |           |
| Preferences          | Plan       | Plan                    |           |
| Range                | Plan       | Plan                    |           |

---

# 128. Required Legacy-Surface Matrix

| Surface         | Unique responsibilities after 7.4 | Still primary? | Candidate fate               |
| --------------- | --------------------------------- | -------------: | ---------------------------- |
| Month           |                                   |            Yes | primary Planner              |
| Plan            |                                   |                | preserve/reduce/retire later |
| Review Schedule |                                   |                | preserve/reduce/retire later |

---

# 129. Required Bundle Matrix

| Metric       | 7.3 baseline | 7.4 final | Warning |                     Hard/review |
| ------------ | -----------: | --------: | ------: | ------------------------------: |
| Initial raw  |      633,562 |           | 650,000 |                         685,000 |
| Initial gzip |      161,467 |           | 161,500 |                         170,000 |
| Largest lazy |       51,852 |           |  80,000 |                         100,000 |
| Total JS     |      755,909 |           |       — | review 800k / architecture 825k |

List relevant chunk ownership before/after.

---

# 130. Required Authority Matrix

| Authority/source            | Month read |              Month canonical action | New authority? |
| --------------------------- | ---------: | ----------------------------------: | -------------: |
| authored setup / SetupDraft | contextual |                       shared writer |             No |
| Goal authority              |      audit |                       existing only |             No |
| Event                       |        Yes |                     existing writer |             No |
| Preview                     |        Yes | existing generation/resolution only |             No |
| friction                    |        Yes |                             derived |             No |
| PlanDecision                |      audit |                       existing only |             No |
| HistoricalPlan              |     No new |                                  No |             No |
| ExecutionHistory            |         No |                                  No |             No |
| Progress                    |         No |                                  No |             No |

---

# 131. Required Product-Boundary Matrix

| Capability               | Task 7.4                                    |
| ------------------------ | ------------------------------------------- |
| responsibility audit     | Required                                    |
| Month attention          | Implement if canonical evidence sufficient  |
| friction resolution      | Implement only by canonical reuse           |
| Generate/Refresh         | Implement if canonical reuse is clean       |
| Goals migration          | Audit + bounded implementation if justified |
| Preferences migration    | Audit + bounded implementation if justified |
| Planning Range migration | Audit + bounded implementation if justified |
| Plan retirement          | Not pre-authorized                          |
| Review retirement        | Not pre-authorized                          |
| direct geometry editing  | Prohibited                                  |
| Capacity                 | Prohibited                                  |
| Allocation               | Prohibited                                  |
| general Recommendations  | Prohibited                                  |
| Pattern Library          | Prohibited                                  |
| transition adaptation    | Prohibited                                  |

---

# 132. Required Epistemic Matrix

| Evidence/state          | DayFrame may say/do                | Must not infer                                   |
| ----------------------- | ---------------------------------- | ------------------------------------------------ |
| canonical friction      | needs attention                    | user failure                                     |
| canonical suggested fix | Resolution option                  | general recommendation                           |
| unplaced                | could not place under current plan | user has no time                                 |
| stale Preview           | schedule needs refresh             | current geometry is current                      |
| missing Preview         | not generated                      | empty schedule                                   |
| uncovered date          | not generated                      | free day                                         |
| schedule opening        | opening exists                     | user has capacity                                |
| Goal exists             | authored Goal                      | current priority ranking                         |
| displayed month         | user is viewing month              | generation range should change                   |
| saved setup change      | schedule stale                     | refresh already occurred                         |
| successful Try          | existing defined result            | durable change unless canonical semantics say so |

---

# 133. Architectural Invariants

Assess at minimum:

1. Month remains the primary Phase 7 Planner surface.
2. Task 7.3 contextual authoring remains unchanged.
3. Month remains projection, not authority.
4. generated geometry remains non-editable.
5. exact source identity remains required.
6. recreated sources never retarget.
7. attention remains derived.
8. friction remains derived.
9. uncovered does not imply friction.
10. empty does not imply free.
11. unplaced remains distinct from friction unless canonical model says otherwise.
12. suggested fixes remain existing deterministic evidence.
13. Month does not invent new Resolution options.
14. resolution uses canonical existing actions.
15. Try semantics are mechanically established before migration.
16. Apply semantics are mechanically established before migration.
17. stale resolution targets cannot apply.
18. regenerated-away friction cannot apply.
19. source mutation forces resolution revalidation.
20. profile replacement forces resolution revalidation.
21. restore replacement forces resolution revalidation.
22. full clear removes stale resolution context.
23. no direct placement is introduced.
24. no drag/drop is introduced.
25. no resize is introduced.
26. no direct time editing is introduced.
27. Generate uses canonical generation.
28. Refresh uses canonical generation.
29. Month does not auto-generate merely on navigation.
30. missing Preview remains missing.
31. stale Preview remains visible until refresh.
32. Refresh replaces stale projection only through canonical generation.
33. Save Setup remains separate from Refresh.
34. Month navigation does not mutate SetupDraft.
35. Month navigation does not mutate planning range.
36. displayed month is not authored range.
37. Goal authority remains unchanged.
38. Goal exact links remain unchanged.
39. no Goal ranking is introduced.
40. no Goal allocation is introduced.
41. no Goal recommendation is introduced.
42. preferences remain authored setup.
43. day-boundary edits use canonical piecewise semantics.
44. Month performs no local user-day ownership math.
45. week-start semantics remain canonical.
46. segment overrides remain canonical.
47. planning range semantics remain canonical.
48. Work remains composite setup.
49. Commitment workflow remains shared.
50. Event workflow remains singular.
51. no duplicate writer is added.
52. Save Setup remains durable authored boundary.
53. unsaved draft is never presented as saved.
54. saved setup change makes schedule stale under existing semantics.
55. Refresh does not mutate authored setup.
56. friction resolution does not rewrite HistoricalPlan.
57. planning actions do not infer execution.
58. Today remains independent.
59. Summary remains independent.
60. no Capacity model is introduced.
61. openings are not called capacity.
62. no Allocation model is introduced.
63. deterministic fixes are not generalized into recommendations.
64. transition adaptation remains deferred.
65. Pattern Library remains deferred.
66. Plan is not retired merely for visual consolidation.
67. Review is not retired merely for visual consolidation.
68. specialized detailed Review may remain.
69. Day Visualizer remains specialized unless evidence supports reuse.
70. responsibilities are classified before migration.
71. every legacy responsibility appears in the audit.
72. migration reuses canonical implementations.
73. whole legacy surfaces are not embedded merely for convenience.
74. contextual workspace remains bounded.
75. workspace state remains ephemeral.
76. selected-day changes do not retarget active issue.
77. refresh invalidates stale issue context.
78. focus remains deterministic.
79. attention is keyboard accessible.
80. resolution is keyboard accessible.
81. Refresh is keyboard accessible.
82. configuration is keyboard accessible if migrated.
83. mobile attention remains usable.
84. mobile resolution remains usable.
85. mobile configuration remains usable.
86. no horizontal page overflow is required.
87. Month remains lazy.
88. Plan lazy ownership remains appropriate.
89. Review lazy/eager ownership is audited.
90. no large subtree is made eager accidentally.
91. initial raw warning is governed.
92. initial gzip warning is governed.
93. initial gzip hard guard remains unchanged.
94. initial raw hard guard remains unchanged.
95. largest-lazy hard guard remains unchanged.
96. total JS remains reported.
97. > =800k triggers growth review.
98. > =825k triggers architecture review.
99. no bundle threshold changes.
100. no counting changes.
101. no vendor exclusions.
102. no runtime dependency added.
103. Plan regression remains green.
104. Review regression remains green.
105. Month 7.3 regression remains green.
106. Today regression remains green.
107. Summary regression remains green.
108. profile replacement remains safe.
109. restore remains safe.
110. full clear remains safe.
111. protected state remains truthful.
112. no new persistence is introduced.
113. Backup format remains unchanged unless mechanically required.
114. no new authority is introduced.
115. browser attention QA passes.
116. browser refresh QA passes if migrated.
117. browser resolution QA passes if migrated.
118. browser configuration QA passes for anything migrated.
119. browser keyboard QA passes.
120. browser mobile QA passes.
121. warning growth is explicitly attributed.
122. legacy-surface unique responsibilities are documented.
123. Plan/Review convergence readiness is explicitly assessed.
124. Task 7.5 is not authorized by assumption.
125. final result distinguishes migration from deferred specialization.

Classify each as:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Covered by browser QA;
* Deferred;
* Prohibited;
* Not applicable;
* Blocked.

---

# 134. Stop Conditions

Stop rather than invent architecture if:

* friction identity is insufficient for safe contextual resolution;
* suggested fixes cannot be revalidated after regeneration;
* Try semantics are ambiguous;
* Apply Planning Change authority is ambiguous;
* migrating resolution requires a second implementation;
* Month cannot distinguish stale resolution evidence;
* generation cannot be invoked canonically from Month;
* Refresh would require duplicated generation logic;
* Save Setup and Refresh cannot remain distinct;
* Goal migration requires undefined priority/allocation semantics;
* Preferences migration requires new user-day semantics;
* Planning Range cannot remain independent from displayed month;
* configuration migration requires persisting Month UI state;
* Plan or Review retirement would remove unique required capability;
* protection/recovery semantics become weaker;
* keyboard/mobile use becomes materially worse;
* initial raw/gzip/lazy hard guards fail without safe bounded remediation;
* total JS reaches 825,000;
* a runtime dependency becomes necessary;
* a new authority or persistence model becomes necessary.

A stop in one responsibility does **not** necessarily stop the entire task.

Classify that responsibility as deferred/specialized and continue with independent safe slices.

---

# 135. Focused Validation

Run focused suites for affected:

* Month read model;
* Monthly Planner UI;
* friction;
* suggested fixes;
* revise/Apply path;
* Preview generation;
* store generation;
* Commitment;
* Event;
* Work;
* Goals if touched;
* preferences if touched;
* range if touched;
* profile/restore/full clear;
* accessibility/focus;
* bundle policy.

Record exact suites and counts.

---

# 136. Full Validation

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

* transformed modules;
* test files;
* tests;
* initial raw;
* initial gzip;
* relevant eager chunks;
* Month chunk;
* Plan chunk;
* Review-related chunks;
* largest lazy;
* total JS;
* warning states;
* review milestones;
* diff result.

---

# 137. Manual Browser Validation

Use production build.

Validate all implemented migrations plus preservation of specialized legacy paths.

Do not substitute component tests for core interaction QA where production fixtures are available.

Where a destructive/exact-identity fixture cannot safely be constructed through product UI, deterministic integration coverage is acceptable if explicitly documented.

---

# 138. Governance

Update:

* Task 7.4 result;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Record:

* migrated responsibilities;
* contextual-entry-only responsibilities;
* specialized responsibilities;
* deferred responsibilities;
* candidate retirements.

Create an ADR only if Task 7.4 discovers a new enduring semantic/authority decision.

A decision that Month is the primary Planner surface has already been established and does not itself require another ADR.

---

# 139. Plan/Review Convergence Assessment

At task end, explicitly answer:

### Plan

What unique responsibilities remain?

Could those responsibilities eventually become contextual Planner configuration?

Does Plan still deserve primary navigation?

### Review Schedule

What unique responsibilities remain?

Is it now a specialized detailed-review tool?

Does it still deserve primary navigation?

### Month

Can a normal user now perform the majority of routine planning work without leaving Month?

This assessment is mandatory even if neither legacy surface is retired.

---

# 140. Task 7.5 Readiness

Do not assume Task 7.5.

Authorize it only after the audit reveals the correct next boundary.

Possible outcomes include:

### Outcome A — Convergence Ready

Recommend:

> **Task 7.5 — Planner Surface Convergence and Legacy Navigation Retirement**

### Outcome B — Specialized Review Still Needed

Recommend a bounded task that improves Month ↔ detailed Review relationship.

### Outcome C — Configuration Still Needs Migration

Recommend another configuration migration task.

### Outcome D — Architecture Gap

Recommend a targeted audit/remediation task.

Let evidence choose.

---

# 141. Completion Criteria

Task 7.4 is complete only when:

* every remaining Plan and Review Schedule responsibility has been mechanically inventoried;
* every responsibility is classified as migrate-now, contextual-entry-only, keep-specialized, defer, or candidate-for-retirement;
* no responsibility is migrated merely for visual consolidation;
* Month's existing Task 7.3 source-authoring architecture remains intact;
* selected-day Needs attention becomes actionable to the extent supported by existing canonical friction/suggested-fix semantics;
* friction remains derived evidence and no new attention authority is introduced;
* Try and Apply Planning Change semantics are mechanically traced before any migration;
* any migrated resolution workflow reuses the canonical existing implementation and revalidates stale friction/fix identity after regeneration, source edits, profile replacement, restore, and clear;
* no direct generated occurrence placement, drag/drop, resize, or time editing is introduced;
* unplaced evidence remains truthful and can only use existing exact source/resolution paths;
* Generate/Refresh semantics are mechanically traced;
* Month gains contextual Generate/Refresh only if it can call the canonical existing generation action without duplicating engine/store logic;
* stale geometry remains visible before explicit Refresh;
* missing Preview remains missing rather than empty;
* selected month/day context and deterministic focus survive generation;
* Save Setup and Refresh remain distinct operations;
* Goals, Schedule Preferences, Planning Range, Work, advanced Commitment configuration, and Save Setup are individually assessed rather than migrated as a monolithic Plan screen;
* displayed-month navigation remains completely independent of authored Planning Range;
* any migrated Goal/configuration workflow reuses its canonical writer and introduces no ranking, Allocation, Recommendation, or new user-day semantics;
* canonical piecewise user-day and user-week semantics remain untouched;
* unsaved SetupDraft is never presented as durable authored truth;
* Review Schedule's detailed visualization and specialized responsibilities are preserved wherever they still provide unique value;
* neither Plan nor Review Schedule is retired unless it demonstrably owns no unique required responsibility;
* the final result explicitly identifies what unique responsibilities remain on each legacy surface;
* Month's status as the primary Planner workspace is strengthened without turning it into a monolithic implementation;
* contextual state remains ephemeral;
* profile replacement, restore, full clear, and protection cannot leave stale resolution/configuration actions alive;
* Today, Summary, HistoricalPlan, ExecutionHistory, Progress, and existing authority boundaries remain independent;
* no Capacity, Allocation, general Recommendations, transition adaptation, Pattern Library, Goal reorientation, new authority, new persistence, scheduler redesign, recurrence redesign, runtime dependency, or bundle-policy change is introduced;
* eager/lazy ownership is mechanically audited before large UI reuse;
* initial gzip warning crossing is explicitly attributed rather than treated as automatic failure;
* initial raw, initial gzip, and largest-lazy hard guards remain green;
* total JS is reported and governed at 800k/825k milestones;
* focused and full validation pass;
* production-browser attention, resolution/refresh/configuration where migrated, keyboard, responsive, and slow-load QA pass;
* governance records the responsibility migration state;
* Plan/Review convergence readiness is answered from evidence;
* the recommended next task follows that evidence rather than a predetermined Phase 7 sequence.

---

# 142. Final Implementation Principle

> **The Monthly Planner should become the place where planning happens because the user's planning questions are answered there—not because every old screen has been copied into it.**

The Month already answers:

* What does my month look like?
* What is happening on this day?
* What did I intend?
* How do I edit that intent?

Task 7.4 should begin answering:

* What needs my attention?
* What can I do about it?
* Is my schedule current?
* Which planning settings should I adjust?

while preserving specialized tools wherever they still genuinely earn their existence.

---

# 143. Final Completion Statement

**Task 7.4 is complete when DayFrame has mechanically accounted for every remaining planning responsibility currently divided among Month, Plan, and Review Schedule and has migrated only those attention, resolution, generation/refresh, and planning-configuration responsibilities whose existing semantic owners and canonical writers can be safely reused inside the Monthly Planner; when selected-day attention is grounded only in canonical derived friction/unplaced evidence, existing Resolution options are never reinvented, Try and Apply Planning Change are understood from production behavior before reuse, stale or regenerated-away resolution targets cannot be applied, and editing a participant remains distinct from resolving the schedule issue; when Month can expose canonical Generate/Refresh behavior if and only if it can invoke the existing generation boundary without duplicating engine logic, stale geometry remains visible until explicit refresh, missing Preview remains epistemically distinct from an empty schedule, and Save Setup remains a separate authored-state operation from schedule regeneration; when Goals, Schedule Preferences, Planning Range, Work, advanced Commitment configuration, and Save Setup have each been individually classified and only contextually migrated where doing so preserves their existing authority and product meaning, displayed-month navigation never silently rewrites authored Planning Range, canonical piecewise user-day semantics remain untouched, and no Goal ranking, Capacity, Allocation, general Recommendation, transition-adaptation, Pattern Library, or new planning policy is smuggled into configuration migration; when Plan and Review Schedule are preserved wherever they still own unique specialized responsibility rather than being retired for cosmetic consolidation, while the result explicitly identifies which responsibilities have become Month-owned, which are contextual entries, which remain specialized, which are deferred, and which legacy surfaces are genuine retirement candidates; when all new contextual modes remain ephemeral and exact, profile/restore/full-clear/protection and regeneration invalidate stale actions safely, accessibility, deterministic focus, keyboard use, 320–430px mobile behavior, and production-browser workflows remain sound; when the Task 7.2C hard bundle guards remain green, the almost-certain initial-gzip warning crossing is explicitly attributed and governed rather than gamed, total growth remains subject to the 800k/825k review milestones, no runtime dependency or bundle-policy exception is introduced, focused/full validation passes, governance records the resulting strangler-migration state, and the evidence—not a predetermined roadmap—tells us whether Task 7.5 should finally converge the Planner and retire legacy primary navigation or whether another bounded migration/specialization task must come first.**
