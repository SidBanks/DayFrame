# Task 7.5 — Planner Configuration Workspace Convergence and Legacy Plan Responsibility Reduction

## Status

Ready for implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

Planner configuration-workspace architecture, legacy Plan responsibility decomposition, reusable Goals/Preferences/Planning Range configuration extraction, shared Save Setup boundary integration, Monthly Planner configuration entry, contextual workspace expansion, exact authored-state preservation, strangler-migration reduction, accessibility/mobile/focus validation, bundle-governance compliance, regression testing, production-browser QA, and governance.

**This task does not pre-authorize Plan retirement, Review Schedule retirement, friction-resolution migration, scheduler redesign, recurrence redesign, direct geometry editing, Capacity, Allocation, Recommendations, Pattern Library, or transition adaptation.**

---

# 1. Objective

Reduce the legacy Plan surface to only those responsibilities that genuinely require a dedicated supporting workflow by extracting its remaining Planner-level configuration into bounded reusable components/workflows that the Monthly Planner can invoke directly.

Task 7.4 established that Plan still uniquely owns:

* Goals;
* Schedule Preferences;
* Planning Range;
* general Save Setup;
* some advanced/global authored configuration.

The target is not:

> Put the entire Plan screen inside Month.

The target is:

```text
Monthly Planner
    ├── Review Day
    ├── source authoring
    ├── attention
    ├── Generate / Refresh
    └── Planning Settings
         ├── Goals
         ├── Schedule Preferences
         ├── Planning Range
         └── Save Setup / pending-change state
```

using the same canonical writers and draft semantics already proven in Plan.

---

# 2. Governing Product Principle

> **Configuration should be available from the Planner because it shapes planning, but global configuration must not masquerade as selected-day state.**

Goals, Schedule Preferences, and Planning Range are Planner-level configuration.

They are not properties of whichever day happens to be selected.

---

# 3. Governing Migration Principle

> **Extract bounded responsibilities; do not embed the legacy screen.**

For every migrated section:

1. identify canonical state;
2. identify canonical writer;
3. identify draft vs durable boundary;
4. extract/reuse the existing section;
5. preserve validation;
6. preserve Save Setup;
7. preserve staleness;
8. preserve Plan access during migration.

No duplicate configuration forms.

---

# 4. Task 7.4 Prerequisite

Treat Task 7.4 as governing.

It established:

* Month is primary routine planning;
* attention is understandable in Month;
* Generate/Refresh is canonical in Month;
* Try/Apply remains specialized Review;
* Goals/Preferences/Range are Planner-level configuration;
* Plan remains supporting;
* Review remains specialized;
* Save Setup and Refresh remain distinct;
* Month navigation does not change Planning Range.

These decisions remain fixed unless implementation evidence triggers a stop condition.

---

# 5. Bundle-Governance Baseline

Task 7.4 baseline:

```text
Initial raw        634,512
Initial gzip       161,703
Largest lazy        51,852
Total JS           758,317
```

Policy:

```text
Initial raw
    warning >= 650,000
    hard > 685,000

Initial gzip
    warning >= 161,500
    hard > 170,000

Largest lazy
    warning >= 80,000
    hard > 100,000

Total JS
    growth review >= 800,000
    architecture review >= 825,000
```

Initial gzip is already in the governed warning zone.

Task 7.5 must attribute any additional eager growth precisely.

---

# 6. Explicit Scope

Implement or audit:

* legacy Plan decomposition;
* bounded Planning Settings workspace;
* Goals section extraction/reuse;
* Schedule Preferences extraction/reuse;
* Planning Range extraction/reuse;
* general Save Setup action/state;
* pending SetupDraft visibility;
* validation/error preservation;
* Planner configuration navigation;
* Month → Planning Settings;
* Planning Settings → Review Day/Month;
* Plan → same shared configuration modules;
* exact shared writer reuse;
* profile/restore/full-clear revalidation;
* protected/unavailable behavior;
* focus;
* keyboard;
* mobile;
* bundle ownership;
* regression tests;
* production-browser QA;
* governance;
* Plan responsibility reassessment.

---

# 7. Explicit Non-Goals

Do not implement:

* Plan retirement merely because configuration moved;
* Review retirement;
* Try/Apply migration;
* friction engine changes;
* direct placement;
* drag/drop;
* resize;
* direct generated-time editing;
* Capacity;
* Planned Allocation;
* Recommendations;
* Pattern Library;
* transition sleep planning;
* Goal prioritization/ranking;
* new Goal semantics;
* new schedule-preference semantics;
* new range semantics;
* new persistence;
* new authority;
* new runtime dependency.

---

# 8. Execution Artifact Rules

Before implementation:

1. verify this Task 7.5 artifact;
2. save immutable project copy;
3. record SHA-256;
4. review:

   * Task 7.4 result;
   * current `SetupScreen`;
   * `GoalSection`;
   * Schedule Preferences components;
   * Planning Range controls;
   * Save Setup logic;
   * SetupDraft lifecycle;
   * Plan lazy boundary;
   * Month contextual workspace;
   * profile/restore/full-clear behavior;
   * bundle graph;
5. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-7/TASK_7.5_PLANNER_CONFIGURATION_WORKSPACE_CONVERGENCE_AND_LEGACY_PLAN_RESPONSIBILITY_REDUCTION_RESULT.md`

---

# 9. Mandatory Legacy Plan Decomposition

Trace the current Plan surface mechanically.

For each section determine:

* component;
* source state;
* writer;
* draft/durable semantics;
* validation;
* focus behavior;
* lazy ownership;
* dependencies on neighboring Plan sections.

At minimum:

* Goals;
* Schedule Preferences;
* Planning Range;
* Work;
* Commitments;
* advanced Commitment fields;
* Save Setup;
* profile controls if visually coupled;
* any remaining setup metadata.

---

# 10. Required Plan Section Classification

Classify each Plan section as:

### A — Already contextualized elsewhere

Example: Commitments, Work.

### B — Extract into Planning Settings now

Expected candidates: Goals, Preferences, Range.

### C — Keep supporting Plan-only for now

If tightly coupled or not reusable safely.

### D — Shell-level responsibility

Profiles or other app-level controls if applicable.

### E — Candidate for removal from Plan after extraction

Only after replacement is proven.

---

# 11. Planning Settings Workspace

Introduce a Planner-level configuration mode/workspace.

Conceptually:

```text
Monthly Planner
    └── Planning Settings
         ├── Goals
         ├── Schedule Preferences
         ├── Planning Range
         └── Save Setup
```

This is not selected-day context.

The selected Month/day may remain visible but does not own the configuration.

---

# 12. Workspace State

Extend the existing ephemeral Month workspace model.

Conceptually:

```text
reviewDay
addCommitment
editCommitment
addEvent
editEvent
work
planningSettings
```

If submodes are useful:

```text
planningSettings:
    goals
    preferences
    range
```

Prefer the simplest interaction model.

Do not persist configuration-mode state.

---

# 13. Planning Settings Entry

Month should expose a clear action such as:

**Planning settings**

or equivalent.

Do not label it merely **Plan** if the product responsibility has narrowed.

---

# 14. Goals Entry

Planning Settings should expose the current canonical Goals workflow.

Goals remain Planner-level authored intent.

No selected-day coupling.

---

# 15. Goal Section Reuse

Reuse the existing `GoalSection` or its canonical underlying implementation.

Do not duplicate:

* Goal CRUD;
* validation;
* exact links;
* IDs;
* lifecycle semantics.

---

# 16. Goal Authority

Preserve existing Goal authority exactly.

No Month-local Goal copy.

---

# 17. Goal / Commitment Link Semantics

Exact Goal↔Commitment links remain governed by existing exact identity rules.

Configuration extraction must not weaken links.

---

# 18. No Goal Ranking

Do not add:

* rank;
* weight;
* current priority score;
* allocation;
* recommendation.

Existing authored Goal ordering/fields only.

---

# 19. Goal Save Semantics

Audit whether Goal mutations are:

* immediately durable;
* draft-backed;
* independently persisted;
* linked to Save Setup.

Use actual repository behavior.

Do not force Goal writes through Save Setup if they are currently independent.

---

# 20. Schedule Preferences Entry

Planning Settings should expose canonical Schedule Preferences.

At minimum preserve:

* day boundary;
* week start;
* cycle/segment overrides;
* any currently authored preference fields.

---

# 21. Preferences Component Reuse

Extract/reuse the actual preferences section rather than reproducing fields.

No second set of form controls with separate validation.

---

# 22. Piecewise User-Day Invariant

Any boundary edit must continue feeding the canonical piecewise user-day resolver.

Planning Settings must not calculate user-day windows.

---

# 23. Week-Start Invariant

Effective week-start semantics remain canonical.

The Settings UI authors preferences; it does not compute month display layout directly.

---

# 24. Segment Overrides

Preserve:

* shift/cycle ownership;
* existing validation;
* exact override semantics.

Do not flatten global and segment-specific settings.

---

# 25. Planning Range Entry

Expose canonical Planning Range configuration.

Do not couple it to displayed Month.

---

# 26. Displayed Month Independence

Mandatory:

```text
viewed month ≠ authored planning range
```

Changing Month must not change range.

Changing range must not automatically change displayed Month unless existing explicit UI behavior says so.

---

# 27. Range Semantics

Preserve current range meaning exactly.

Do not reinterpret range as:

* visible Month;
* current Month;
* publication horizon;
* user-week horizon.

---

# 28. Range Validation

Reuse current validation.

No duplicate date-boundary logic.

---

# 29. Save Setup Boundary

Planning Settings should expose Save Setup if any migrated settings participate in SetupDraft.

Preserve:

```text
editor / section mutation
    ↓
SetupDraft
    ↓
Save Setup
    ↓
durable authored setup
    ↓
Preview stale
```

---

# 30. Save Setup Location

Determine the cleanest shared placement.

Potential:

* Planning Settings header/footer;
* persistent Planner status/action region;
* both with one canonical action.

Do not create duplicate Save implementations.

---

# 31. Pending Draft Status

Month/Planner should clearly distinguish:

* no pending changes;
* pending SetupDraft changes;
* saved setup + stale Preview.

Do not imply draft changes are durable.

---

# 32. Draft Dirty Semantics

Reuse existing dirty detection.

Do not create a second comparison model.

---

# 33. Draft Replacement

Profile load, restore, or clear may replace authored setup.

Planning Settings must reproject current draft/authority.

No stale form state survives incorrectly.

---

# 34. Save Success

After Save:

* pending state clears;
* durable setup updates;
* Preview becomes stale according to existing semantics;
* Month remains in sensible context;
* focus moves to saved/stale status.

---

# 35. Save Failure

Use existing validation/error behavior.

No false saved state.

---

# 36. Cancel / Back

If Planning Settings has local section editing state:

Back/cancel must respect existing draft semantics.

Do not silently discard SetupDraft unless current architecture already does.

---

# 37. Unsaved Navigation

Audit what happens when leaving Planning Settings with pending draft changes.

Potential correct behavior may be:

* preserve draft globally, since SetupDraft already survives Plan navigation;
* show pending status elsewhere.

Do not invent destructive navigation warnings unless required.

---

# 38. Plan Reuse

Legacy Plan must consume the same extracted configuration sections after migration.

Do not leave:

```text
Month configuration implementation
Plan configuration implementation
```

in parallel.

---

# 39. One-Writer Principle

Required:

```text
Month Planning Settings
Plan
    ↓
same Goal writer
same SetupDraft
same Save Setup
same preference controls
same range controls
```

---

# 40. Work Boundary

Work already has contextual entry from Month.

Do not relocate more Work UI unless Plan decomposition mechanically requires section extraction.

---

# 41. Commitment Boundary

Commitments already have Month contextual authoring.

Do not change canonical editor architecture.

---

# 42. Advanced Commitment Fields

If advanced fields are already inside shared Commitment editor, no further migration.

Confirm mechanically.

---

# 43. Profiles Boundary

Audit whether profile controls belong:

* shell-level;
* Planning Settings;
* supporting Plan.

Do not move them merely for symmetry.

Profiles replace current authored state and have broader lifecycle semantics.

Default hypothesis: shell/supporting control, not Month-selected context.

---

# 44. Backup / Restore Boundary

Do not migrate Backup/restore into Planning Settings unless already naturally exposed there and in scope.

No new restore composition.

---

# 45. Full Clear Boundary

Do not move unless required.

Planning Settings must respond correctly to it.

---

# 46. Configuration Layout — Desktop

Preferred:

```text
Month Grid | Planning Settings
```

or a full-width workspace if form width demands it.

Do not make configuration cramped merely to preserve split layout.

---

# 47. Configuration Layout — Mobile

At 320–430px:

```text
Month grid
Planning Settings
    stacked sections/forms
```

No horizontal overflow.

---

# 48. Section Navigation

If Goals, Preferences, and Range are long:

consider bounded subnavigation inside Planning Settings.

Possible:

* tabs;
* segmented buttons;
* headings/anchor navigation.

Use existing patterns.

Do not add a new routing framework.

---

# 49. Accessibility — Settings Entry

Planning Settings action must have a clear accessible name.

---

# 50. Accessibility — Section Headings

Goals, Schedule Preferences, and Planning Range each require meaningful headings.

---

# 51. Accessibility — Save State

Pending/saved/stale status should be perceivable without color alone.

---

# 52. Accessibility — Errors

Reuse existing labeled validation errors.

---

# 53. Focus — Open Settings

Focus Planning Settings heading or first relevant control.

---

# 54. Focus — Change Section

Move focus deterministically if subnavigation changes content.

---

# 55. Focus — Save

After Save:

focus saved/stale status region or stable Save action.

No focus loss to `body`.

---

# 56. Focus — Back

Return to Month Review Day or stable settings-entry control.

---

# 57. Keyboard

All settings workflows must be keyboard-complete.

---

# 58. Month Context Preservation

Opening Planning Settings should preserve:

* displayed Month;
* selected label.

Returning restores that Month context.

---

# 59. Selected Day Independence

Changing Goals/Preferences/Range does not retarget selected-day editor state.

Settings are global/regime context.

---

# 60. Preference Changes and Month Projection

A saved boundary/week-start change may alter canonical Month projection after regeneration/current-state refresh according to existing semantics.

Do not manually patch Month geometry.

---

# 61. Preview Staleness

Any saved scheduling-relevant settings change must use existing stale semantics.

Do not auto-refresh.

---

# 62. Generate/Refresh

Task 7.4 Month Generate/Refresh remains governing.

After Save Setup:

Month should show stale and expose Refresh.

---

# 63. Goal-Only Changes

If Goal changes do not stale schedule under current semantics, preserve that.

Do not make all Planning Settings changes stale Preview indiscriminately.

---

# 64. Protected State

If authored state is protected/unavailable:

Planning Settings must not render writable defaults.

Reuse recovery behavior.

---

# 65. Profile Load

If profile load occurs while Settings open:

* current settings reproject;
* pending stale local targets clear;
* no ghost section values.

---

# 66. Restore

Same.

---

# 67. Full Clear

Settings return to current cleared/default authored state according to existing semantics.

---

# 68. Legacy Plan Reduction

Once extracted components are shared, simplify Plan composition.

The goal is:

```text
Plan
    supporting configuration/access surface
```

not a second fully independent Planner architecture.

Remove only redundant wrappers/presentation proven unnecessary.

---

# 69. Plan Navigation Label Audit

Determine whether the visible **Plan** label still accurately describes its narrowed responsibility.

Possible future names:

* Planning Settings;
* Setup;
* Configuration.

Task 7.5 may recommend a rename.

Do not rename without product evidence.

---

# 70. Plan Default Role

Plan should no longer be treated as routine primary Planner if Month already is.

Audit current default navigation behavior.

Task 7.5 may make Month the default Planner destination if not already true and if all routine workflows are accessible.

Do not change default if configuration migration remains incomplete.

---

# 71. Plan Retirement Assessment

After extraction, explicitly determine whether Plan still owns any unique user-visible responsibility.

If yes:

preserve.

If no:

classify as candidate for retirement in a later task.

Do not retire in 7.5 unless the task result proves zero unique responsibility and migration is mechanically trivial.

Default: assessment only.

---

# 72. Review Boundary

Review remains specialized.

Do not change Try/Apply/Visualizer architecture.

---

# 73. Planner Navigation Model

Audit the likely post-7.5 navigation:

```text
Planner
    Month
    Planning Settings
    Detailed Review / Resolve
```

These may be:

* modes;
* contextual destinations;
* supporting actions;

not necessarily equal tabs.

Task 7.5 should recommend final information architecture.

---

# 74. No Monolithic Settings Surface Requirement

If one giant Planning Settings workspace becomes unwieldy:

use bounded section modes.

Do not recreate Plan under a new name.

---

# 75. Configuration Section Independence

Goals, Preferences, and Range should remain separable.

A failure/blocker in one section should not necessarily stop migration of the others.

---

# 76. Goals Stop Condition

Stop Goal migration if:

* `GoalSection` cannot be reused without duplicating authority;
* Goal lifecycle is tightly coupled to legacy Plan shell;
* exact links rely on hidden neighboring state.

Classify as supporting Plan and continue other sections.

---

# 77. Preferences Stop Condition

Stop Preferences migration if:

* extraction duplicates canonical validation;
* cycle/segment semantics require Plan-only context unavailable elsewhere;
* piecewise boundary semantics would need reimplementation.

---

# 78. Range Stop Condition

Stop Range migration if:

* extraction conflates visible Month with generation range;
* canonical validation cannot be reused.

---

# 79. Save Setup Stop Condition

Stop shared Save migration if:

* Plan currently owns transaction semantics not safely reusable;
* moving Save creates duplicate durable boundaries.

---

# 80. Bundle Ownership Audit

Before extraction:

identify which sections currently live in the Plan lazy chunk.

Strong preference:

* Planning Settings reuse the same lazy chunk;
* or extract a new bounded configuration lazy chunk only if it improves ownership.

Do not make Goals/Preferences/Range eager.

---

# 81. Eager-Growth Warning

Initial gzip is already warning.

Any additional eager bytes require attribution.

Prefer navigation callbacks/state only.

---

# 82. Largest-Lazy Warning

If Plan/config chunk reaches >=80 KB:

perform lazy-surface growth review.

Do not fragment blindly.

---

# 83. Total-JS Review

If total reaches >=800 KB:

perform governed growth review.

If >=825 KB:

stop for architecture review.

---

# 84. No Bundle Policy Changes

Mandatory.

---

# 85. No Runtime Dependency

Mandatory.

---

# 86. Tests — Plan Decomposition

Cover extracted sections rendered from both:

* Plan;
* Month Planning Settings.

Assert one shared implementation.

---

# 87. Tests — Goals

Cover:

* add;
* edit;
* delete if supported;
* exact Commitment links;
* Plan path;
* Month Settings path;
* focus;
* protection/replacement.

---

# 88. Tests — Preferences

Cover:

* day boundary;
* week start;
* cycle/segment override;
* validation;
* shared draft;
* Save;
* staleness.

---

# 89. Tests — Range

Cover:

* valid range;
* invalid range;
* save;
* Month navigation independence;
* generation semantics unchanged.

---

# 90. Tests — Save Setup

Cover:

* pending changes;
* save;
* stale Preview;
* no auto-refresh;
* saved-status focus.

---

# 91. Tests — Pending State

Pending SetupDraft is visible from Month after contextual edits/settings changes.

---

# 92. Tests — Navigation

Cover:

* Month → Settings;
* Settings → Month;
* Plan → same settings;
* selected month/day preservation.

---

# 93. Tests — Profile

Open settings → profile load → current values reproject.

---

# 94. Tests — Restore

Same.

---

# 95. Tests — Full Clear

No stale values.

---

# 96. Tests — Protection

No writable defaults.

---

# 97. Tests — Existing Month Regression

7.3/7.4 workflows remain green.

---

# 98. Tests — Existing Review Regression

Try/Apply/Visualizer unaffected.

---

# 99. Tests — Plan Regression

All still-supported Plan functions remain reachable.

---

# 100. Tests — Accessibility

Cover:

* settings headings;
* section navigation;
* Save state;
* validation;
* Back;
* focus.

---

# 101. Tests — Responsive

Component-level where useful.

Browser QA mandatory.

---

# 102. Browser QA — Settings Entry

Production build:

```text
Planner Month
    Planning settings
```

Verify context preserved.

---

# 103. Browser QA — Goals

Add/edit a controlled Goal if fixture permits.

Verify same result from Plan and Month Settings.

---

# 104. Browser QA — Preferences

Change controlled scheduling preference in fixture.

Verify:

* pending draft;
* Save;
* stale schedule;
* Month remains contextual;
* no auto-refresh.

Avoid destructive user-data mutation; use controlled fixture.

---

# 105. Browser QA — Range

Change range in controlled fixture.

Verify:

* displayed Month does not change automatically;
* explicit generation behavior remains.

---

# 106. Browser QA — Save/Refresh

Mandatory canonical journey:

```text
Month
    Settings
    edit
    Save Setup
    back to Month
    stale
    Refresh
    fresh
```

---

# 107. Browser QA — Keyboard

Settings workflow fully pointer-free.

---

# 108. Browser QA — Mobile

At:

```text
320
375
390
430
```

Verify all migrated settings fit.

---

# 109. Browser QA — Focus

Verify:

* open Settings;
* section change;
* validation;
* Save;
* Back.

---

# 110. Browser QA — Slow Load

If Planning Settings remains/reuses lazy Plan chunk:

throttle and verify:

* Month stays visible;
* truthful loading;
* no fake settings;
* focus after load.

---

# 111. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.5_PLANNER_CONFIGURATION_WORKSPACE_CONVERGENCE_AND_LEGACY_PLAN_RESPONSIBILITY_REDUCTION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 7.4 Prerequisite
4. Bundle Governance Prerequisite
5. Legacy Plan Decomposition
6. Plan Section Classification
7. Files Changed
8. Planning Settings Architecture
9. Workspace State
10. Settings Entry
11. Goals Extraction
12. Goal Writer
13. Goal Authority
14. Goal Link Semantics
15. Goal Save Semantics
16. Preferences Extraction
17. Day Boundary Semantics
18. Week-Start Semantics
19. Segment Overrides
20. Range Extraction
21. Month/Range Independence
22. Range Validation
23. Save Setup Extraction
24. Save Location
25. Pending Draft Status
26. Draft Dirty Semantics
27. Save Success
28. Save Failure
29. Unsaved Navigation
30. Plan Reuse
31. One-Writer Assessment
32. Work Boundary
33. Commitment Boundary
34. Advanced Fields
35. Profiles Boundary
36. Backup/Restore Boundary
37. Full-Clear Boundary
38. Desktop Layout
39. Mobile Layout
40. Settings Navigation
41. Accessibility
42. Focus
43. Keyboard
44. Month Context Preservation
45. Selected-Day Independence
46. Preference Reprojection
47. Preview Staleness
48. Generate/Refresh Boundary
49. Goal-Only Staleness
50. Protected State
51. Profile Load
52. Restore
53. Full Clear
54. Legacy Plan Reduction
55. Plan Label Assessment
56. Plan Default Role
57. Plan Retirement Assessment
58. Review Boundary
59. Planner Navigation Recommendation
60. Configuration Section Independence
61. Bundle Ownership
62. Eager-Growth Review
63. Largest-Lazy Review
64. Total-JS Review
65. Runtime Dependency Assessment
66. Tests Added/Changed
67. Focused Validation
68. Full Validation
69. Bundle Validation
70. Browser Settings QA
71. Browser Goals QA
72. Browser Preferences QA
73. Browser Range QA
74. Browser Save/Refresh QA
75. Browser Keyboard QA
76. Browser Mobile QA
77. Browser Focus QA
78. Slow-Load QA
79. Governance Updates
80. ADR Determination
81. Deviations
82. Discoveries
83. Deferred Work
84. Plan Section Matrix
85. Configuration Matrix
86. Save-State Matrix
87. Navigation Matrix
88. Staleness Matrix
89. Focus Matrix
90. Responsive Matrix
91. Loading Matrix
92. Bundle Matrix
93. Migration Matrix
94. Legacy-Surface Matrix
95. Authority Matrix
96. Product-Boundary Matrix
97. Epistemic Matrix
98. Architectural Invariant Assessment
99. Stop-Condition Assessment
100. Architectural Alignment Assessment
101. Plan/Review Convergence Assessment
102. Task 7.6 Readiness
103. Recommended Next Task
104. Final Completion Determination

---

# 112. Required Plan Section Matrix

| Plan section        | Canonical state/writer | Classification     | Shared after 7.5? | Unique Plan responsibility remains? |
| ------------------- | ---------------------- | ------------------ | ----------------: | ----------------------------------: |
| Goals               |                        |                    |                   |                                     |
| Preferences         |                        |                    |                   |                                     |
| Planning Range      |                        |                    |                   |                                     |
| Work                |                        | already contextual |                   |                                     |
| Commitments         |                        | already contextual |                   |                                     |
| Advanced Commitment |                        | shared             |                   |                                     |
| Save Setup          |                        |                    |                   |                                     |
| Profiles            |                        |                    |                   |                                     |

---

# 113. Required Configuration Matrix

| Configuration | Month Settings | Plan | Writer duplicated? | Durable boundary |
| ------------- | -------------: | ---: | -----------------: | ---------------- |
| Goals         |                |      |                 No |                  |
| Preferences   |                |      |                 No | Save Setup       |
| Range         |                |      |                 No | Save Setup       |
| Work          |     contextual |  Yes |                 No | Save Setup       |
| Commitment    |     contextual |  Yes |                 No | Save Setup       |

---

# 114. Required Save-State Matrix

| State            | User-facing status | Save enabled? | Preview state                |
| ---------------- | ------------------ | ------------: | ---------------------------- |
| no draft changes | saved              |     No/normal | current/stale existing       |
| pending draft    | unsaved changes    |           Yes | unchanged                    |
| save success     | saved              |            No | stale if scheduling-relevant |
| save failure     | error/unsaved      |           Yes | unchanged                    |
| Goal-only change | actual semantics   |        actual | actual                       |

---

# 115. Required Navigation Matrix

| Action                  | Displayed Month | Selected label          | SetupDraft   | Durable state |
| ----------------------- | --------------- | ----------------------- | ------------ | ------------- |
| Month → Settings        | preserved       | preserved               | preserved    | unchanged     |
| Settings → Month        | preserved       | preserved               | preserved    | unchanged     |
| change Settings section | preserved       | preserved               | preserved    | unchanged     |
| Plan → Settings section | N/A/current     | N/A                     | same draft   | unchanged     |
| Save                    | preserved       | preserved               | synchronized | changed       |
| change displayed Month  | changed view    | selection changes as UI | unchanged    | unchanged     |

---

# 116. Required Staleness Matrix

| Configuration change | Durable immediately? | Requires Save Setup? |     Preview stale? |
| -------------------- | -------------------: | -------------------: | -----------------: |
| Goal                 |         audit actual |         audit actual |       audit actual |
| boundary             |                   No |                  Yes |     Yes after Save |
| week start           |                   No |                  Yes |     Yes after Save |
| segment override     |                   No |                  Yes |     Yes after Save |
| range                |                   No |                  Yes | existing semantics |
| Work                 |                   No |                  Yes |     Yes after Save |
| Commitment           |                   No |                  Yes |     Yes after Save |

---

# 117. Required Focus Matrix

| Action                 | Focus result |
| ---------------------- | ------------ |
| open Planning Settings |              |
| Goals section          |              |
| Preferences section    |              |
| Range section          |              |
| validation failure     |              |
| Save success           |              |
| Back to Month          |              |
| protected/unavailable  |              |

---

# 118. Required Responsive Matrix

| Width   | Month          | Settings | Section navigation |
| ------- | -------------- | -------- | ------------------ |
| 320     | compact        | stacked  |                    |
| 375     |                |          |                    |
| 390     |                |          |                    |
| 430     |                |          |                    |
| tablet  |                |          |                    |
| desktop | split/adaptive |          |                    |

---

# 119. Required Loading Matrix

| Capability        | Boundary      | Loading UI | Month remains visible? |
| ----------------- | ------------- | ---------- | ---------------------: |
| Planning Settings | audit/final   |            |                        |
| Goals             |               |            |                        |
| Preferences       |               |            |                        |
| Range             |               |            |                        |
| Plan legacy       | existing lazy | existing   |                        |

---

# 120. Required Bundle Matrix

| Metric       | 7.4 baseline | 7.5 final | Warning | Hard/review |
| ------------ | -----------: | --------: | ------: | ----------: |
| Initial raw  |      634,512 |           | 650,000 |     685,000 |
| Initial gzip |      161,703 |           | 161,500 |     170,000 |
| Largest lazy |       51,852 |           |  80,000 |     100,000 |
| Total JS     |      758,317 |           |       — | 800k / 825k |

List Settings/Plan/Month chunks explicitly.

---

# 121. Required Migration Matrix

| Responsibility   | Before 7.5      | After 7.5        | Legacy Plan still needed? |
| ---------------- | --------------- | ---------------- | ------------------------: |
| Goals            | Plan            |                  |                           |
| Preferences      | Plan            |                  |                           |
| Planning Range   | Plan            |                  |                           |
| Save Setup       | Plan/contextual |                  |                           |
| Work             | Month + Plan    | unchanged/shared |                           |
| Commitments      | Month + Plan    | unchanged/shared |                           |
| Generate/Refresh | Month + Review  | unchanged        |                           |
| Resolution       | Review          | unchanged        |                       Yes |

---

# 122. Required Legacy-Surface Matrix

| Surface | Unique responsibilities after 7.5 | Primary/supporting | Candidate fate |
| ------- | --------------------------------- | ------------------ | -------------- |
| Month   |                                   | primary            |                |
| Plan    |                                   | supporting         |                |
| Review  |                                   | specialized        |                |

---

# 123. Required Authority Matrix

| Authority              | Settings reads? | Settings writes through canonical path? | New authority? |
| ---------------------- | --------------: | --------------------------------------: | -------------: |
| SetupDraft             |             Yes |                                     Yes |             No |
| durable authored setup |         current |                              Save Setup |             No |
| Goal authority         |             Yes |                         existing writer |             No |
| Preview                |     status only |                         No direct write |             No |
| Event                  |          no new |                                      No |             No |
| PlanDecision           |              No |                                      No |             No |
| HistoricalPlan         |              No |                                      No |             No |
| ExecutionHistory       |              No |                                      No |             No |

---

# 124. Required Product-Boundary Matrix

| Capability                    | Task 7.5                                |
| ----------------------------- | --------------------------------------- |
| Planning Settings workspace   | Implement                               |
| Goal configuration reuse      | Implement if safe                       |
| Preferences reuse             | Implement if safe                       |
| Range reuse                   | Implement if safe                       |
| Save Setup shared boundary    | Implement if safe                       |
| Plan responsibility reduction | Implement                               |
| Plan retirement               | Assessment only by default              |
| Review changes                | Prohibited except navigation regression |
| Try/Apply migration           | Prohibited                              |
| direct geometry editing       | Prohibited                              |
| Capacity                      | Prohibited                              |
| Allocation                    | Prohibited                              |
| Recommendations               | Prohibited                              |
| Pattern Library               | Prohibited                              |
| transition adaptation         | Prohibited                              |

---

# 125. Required Epistemic Matrix

| State/evidence              | Planner may say/do           | Must not infer                                                    |
| --------------------------- | ---------------------------- | ----------------------------------------------------------------- |
| pending SetupDraft          | unsaved planning changes     | durable setup changed                                             |
| saved scheduling change     | schedule stale               | refreshed                                                         |
| displayed Month             | user is viewing Month        | generation range changed                                          |
| Planning Range              | generation configuration     | visible Month                                                     |
| Goal                        | authored Goal                | ranked priority                                                   |
| boundary/week-start setting | authored temporal preference | current day must immediately move without canonical recomputation |
| stale Preview               | refresh needed               | invalid/empty                                                     |
| protected setup             | configuration unavailable    | defaults are current truth                                        |

---

# 126. Architectural Invariants

Assess at minimum:

1. Month remains primary Planner.
2. Planning Settings is Planner-level, not selected-day authority.
3. Task 7.3 source authoring remains unchanged.
4. Task 7.4 attention/generation remains unchanged.
5. Plan decomposition happens by responsibility.
6. no entire legacy Plan screen is embedded.
7. one Goal writer remains.
8. one SetupDraft remains.
9. one Save Setup boundary remains.
10. one Preferences writer remains.
11. one Range writer remains.
12. Work remains shared canonical writer.
13. Commitment remains shared canonical writer.
14. no duplicate form implementation is added.
15. no new authority is added.
16. Settings workspace state is ephemeral.
17. displayed Month remains ephemeral.
18. selected label remains ephemeral.
19. Settings do not become date-owned.
20. Goals remain independent authority.
21. Goal links remain exact.
22. no Goal ranking is added.
23. no Goal allocation is added.
24. no Goal recommendations are added.
25. day boundary semantics remain canonical.
26. piecewise user-day resolver remains semantic owner.
27. week-start semantics remain canonical.
28. segment overrides remain exact.
29. Planning Range remains generation configuration.
30. displayed Month remains independent from Planning Range.
31. changing Month does not mutate Range.
32. changing Range does not implicitly navigate Month.
33. SetupDraft dirty semantics remain canonical.
34. pending draft differs from durable state.
35. Save Setup remains explicit.
36. Save failure never appears successful.
37. scheduling-relevant Save makes Preview stale.
38. Save never auto-refreshes.
39. Refresh remains separate.
40. Goal-only changes use actual existing staleness semantics.
41. profile replacement reprojects Settings.
42. restore reprojects Settings.
43. full clear removes stale form state.
44. protected state does not render writable defaults.
45. Plan uses extracted shared sections after migration.
46. Month uses same extracted sections.
47. duplicate navigation paths do not duplicate writers.
48. Plan remains reachable during migration.
49. Review remains specialized and untouched.
50. Try remains Review-owned.
51. Apply remains Review-owned.
52. Day Visualizer remains Review-owned.
53. no direct schedule geometry editing.
54. no direct placement.
55. no drag/drop.
56. no resize.
57. no Capacity.
58. no Allocation.
59. no Recommendations.
60. no Pattern Library.
61. no transition adaptation.
62. no recurrence redesign.
63. no scheduler redesign.
64. no persistence addition.
65. no Backup version change.
66. no runtime dependency.
67. Planning Settings loading is truthful.
68. lazy loading does not duplicate authority.
69. Month remains visible while Settings loads where practical.
70. focus after Settings load is deterministic.
71. focus after Save is deterministic.
72. focus after Back is deterministic.
73. validation focus remains canonical.
74. Settings are keyboard accessible.
75. Goals are keyboard accessible.
76. Preferences are keyboard accessible.
77. Range is keyboard accessible.
78. Save is keyboard accessible.
79. mobile Settings fit 320–430px.
80. no horizontal overflow required.
81. desktop layout remains coherent.
82. initial raw warning is governed.
83. initial gzip warning is governed.
84. initial raw hard guard remains unchanged.
85. initial gzip hard guard remains unchanged.
86. largest lazy hard guard remains unchanged.
87. total JS remains reported.
88. > =800k triggers review.
89. > =825k triggers architecture review.
90. no bundle-policy changes.
91. no metric gaming.
92. extracted components do not erase semantic differences.
93. Plan responsibility reduction is measured, not cosmetic.
94. Plan retirement is not assumed.
95. Plan unique responsibilities are explicitly reassessed.
96. navigation label accuracy is assessed.
97. Month-default behavior is assessed.
98. Review unique responsibilities remain documented.
99. final Planner information architecture is recommended from evidence.
100. full regression passes.
101. production browser Settings QA passes.
102. production browser Save/Refresh QA passes.
103. keyboard QA passes.
104. mobile QA passes.
105. bundle QA passes.
106. governance records the new configuration boundary.
107. Task 7.6 is not predetermined.
108. next task follows evidence from Plan/Review convergence assessment.

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

# 127. Stop Conditions

Stop a specific migration slice rather than inventing architecture if:

* Goal extraction requires a second Goal writer;
* Goal links cannot be preserved exactly;
* Preferences extraction duplicates temporal validation;
* boundary/week-start semantics require local Month calculations;
* Range extraction conflates displayed Month and generation range;
* Save Setup cannot be shared without duplicating transaction semantics;
* Plan sections are mechanically too coupled for bounded extraction;
* Settings require persisted view state;
* profile/restore/full-clear behavior cannot remain safe;
* keyboard/mobile usability degrades materially;
* hard bundle guard fails;
* total reaches 825,000;
* a runtime dependency is required.

An independent section may still proceed if another is blocked.

---

# 128. Focused Validation

Run focused suites for:

* Planning Settings;
* SetupScreen;
* GoalSection;
* Schedule Preferences;
* Planning Range;
* SetupDraft lifecycle;
* Save Setup;
* Month;
* Plan;
* profile;
* restore;
* full clear;
* canonical user-day;
* bundle policy.

Record exact suites and counts.

---

# 129. Full Validation

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
* Month chunk;
* Plan/Settings chunks;
* largest lazy;
* total JS;
* warning states;
* review states;
* diff result.

---

# 130. Manual Browser Validation

Mandatory for implemented configuration migration.

Use production build.

Validate:

* Month → Planning Settings;
* Goals where migrated;
* Preferences where migrated;
* Range where migrated;
* Save;
* Back;
* stale status;
* Refresh;
* Month/Range independence;
* keyboard;
* mobile;
* lazy loading.

---

# 131. Governance

Update:

* Task 7.5 result;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Record:

* which Plan responsibilities migrated;
* which remain;
* whether Plan still deserves direct Planner navigation;
* whether Month is now the default routine Planner destination;
* Review's specialized role.

No ADR is expected unless a genuinely new authority/save/configuration rule is introduced.

---

# 132. Plan/Review Convergence Assessment

At task end answer explicitly:

### Month

Can the user now perform routine planning plus global configuration from Month?

### Plan

What exact unique responsibilities remain?

Is Plan now merely an alternate shell over shared configuration?

Does it still deserve primary navigation?

### Review

What exact unique responsibilities remain?

Does it remain a specialized detailed-resolution tool?

### Planner navigation

What mature structure is now justified?

Possible result:

```text
Planner
    Month                  primary
    Planning Settings      contextual/supporting
    Detailed Review        specialized
```

Do not force this outcome.

---

# 133. Task 7.6 Readiness

Possible outcomes:

### Outcome A — Plan Has No Unique Responsibility

Recommend:

> **Task 7.6 — Planner Navigation Convergence and Legacy Plan Retirement**

### Outcome B — Small Plan Responsibility Remains

Recommend one bounded final configuration extraction.

### Outcome C — Plan Still Earns Supporting Surface

Preserve it and move to another Phase 7 priority.

### Outcome D — Review Relationship Needs Work First

Recommend a Month ↔ Detailed Review convergence task.

Evidence decides.

---

# 134. Completion Criteria

Task 7.5 is complete only when:

* the legacy Plan surface is mechanically decomposed into its actual responsibilities;
* every Plan section is classified before migration;
* a bounded Planner-level Planning Settings workspace exists where architecture permits;
* Goals, Schedule Preferences, Planning Range, and Save Setup are migrated only by extracting/reusing their canonical existing implementations;
* Month and Plan share one Goal writer, one SetupDraft, one Preferences writer, one Range writer, and one Save Setup boundary;
* no legacy Plan screen is merely embedded wholesale;
* Goals remain independent authored authority and exact Commitment links remain unchanged;
* no Goal ranking, allocation, progress, or recommendation semantics are introduced;
* Schedule Preferences preserve canonical day-boundary, week-start, cycle/segment override, and piecewise user-day semantics;
* Month does not perform local temporal resolution;
* Planning Range remains authored generation configuration and stays independent from displayed Month navigation;
* changing the displayed Month does not mutate range;
* changing range does not silently navigate Month;
* pending SetupDraft remains epistemically distinct from durable authored setup;
* Save Setup remains explicit and shared;
* save failures remain truthful;
* scheduling-relevant saved changes stale Preview under existing semantics;
* Save Setup never silently refreshes Preview;
* Task 7.4 Generate/Refresh remains the explicit schedule-refresh path;
* Goal-only edits preserve their actual existing staleness behavior rather than being generalized;
* profile load, restore, full clear, and protection reproject or invalidate Planning Settings safely;
* Planning Settings state remains ephemeral;
* Month/selected-day context is preserved across Settings entry/exit;
* focus, keyboard, accessibility, and 320–430px mobile usability remain sound;
* Plan consumes the same extracted sections rather than retaining duplicate implementations;
* Plan's remaining unique responsibilities are explicitly identified;
* Plan is not retired merely because most responsibilities moved;
* Review remains specialized and its Try/Apply/diagnostics/Visualizer responsibilities remain unchanged;
* no direct geometry editing, new authority, persistence, Backup format, scheduler redesign, recurrence redesign, Capacity, Allocation, Recommendations, Pattern Library, transition adaptation, runtime dependency, or bundle-policy change is introduced;
* initial raw, initial gzip, and largest-lazy hard guards remain green;
* warning-zone growth is explicitly attributed;
* total JS remains governed at 800k/825k milestones;
* focused/full validation and production-browser Settings/Save/Refresh/keyboard/mobile/lazy QA pass;
* governance records the resulting Planner configuration architecture;
* the final Plan/Review convergence assessment determines whether Task 7.6 should retire Plan navigation, perform one last extraction, preserve Plan, or instead refine the Month ↔ specialized Review relationship.

---

# 135. Final Implementation Principle

> **Global planning configuration belongs near the Planner, but it remains global configuration—not another form of day editing.**

Month should increasingly answer:

* What is my plan?
* What needs attention?
* What should I edit?
* Is the schedule current?
* What planning assumptions govern it?

without forcing the user to understand the historical boundaries between old screens.

---

# 136. Final Completion Statement

**Task 7.5 is complete when DayFrame has decomposed the legacy Plan surface into its actual authored-planning responsibilities and converted the reusable global configuration pieces into a bounded Planner-level Planning Settings workspace that the Monthly Planner can invoke without duplicating any authority or writer; when Goals, Schedule Preferences, Planning Range, and Save Setup are each migrated only where their existing canonical implementation can be extracted intact, Goal authority and exact Commitment links remain unchanged, no Goal ranking or allocation semantics appear, canonical piecewise user-day and week-start behavior remains owned by the existing temporal architecture, cycle/segment overrides retain their exact semantics, Planning Range remains explicit generation configuration rather than becoming the displayed Month, and Month navigation remains completely independent from range mutation; when Month and legacy Plan share one SetupDraft, one durable Save Setup boundary, one preference/range implementation, and one Goal implementation rather than parallel forms; when pending SetupDraft, durable saved setup, stale Preview, and explicit Refresh remain four truthful distinct stages, Save never auto-regenerates, and Goal-only changes preserve their actual established staleness behavior; when profile replacement, restore, full clear, protection, lazy loading, focus, accessibility, keyboard use, and 320–430px responsive behavior remain safe; when Plan is reduced by responsibility rather than cosmetically renamed or wholesale embedded, its remaining unique responsibilities are mechanically identified, Review's specialized Try/Apply/diagnostic/Visualizer role remains untouched, no direct geometry editing, new authority, persistence, runtime dependency, Capacity, Allocation, Recommendations, Pattern Library, transition adaptation, scheduler redesign, recurrence redesign, or bundle-policy exception is introduced, all governed hard bundle limits remain green and warning growth is explicitly attributed, focused/full/browser validation passes, governance records the resulting configuration boundary, and the evidence establishes whether Plan has finally lost enough unique responsibility for Task 7.6 to converge Planner navigation or whether one final bounded responsibility must remain or be extracted first.**
