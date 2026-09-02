# Task 7.3 — Monthly Planner Contextual Authoring and Exact Source Navigation

## Status

Ready for implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

Monthly Planner contextual-workspace implementation, exact authored-source navigation, contextual Commitment/Event/Work authoring integration, selected-user-day action architecture, lazy Plan-authoring reuse, stale-source revalidation, focus/accessibility/mobile integration, strangler-migration progression, bundle-governance compliance, regression testing, production-browser QA, and governance.

**This task does not make scheduled occurrences directly editable geometry, retire Plan / Review Schedule entirely, migrate friction resolution, add drag/drop, introduce new authority, change scheduler semantics, or implement Capacity, Allocation, Recommendations, Pattern Library, or shift-transition adaptation.**

---

# 1. Objective

Make the Monthly Planner a useful **contextual planning workspace**, not merely a read-only month browser.

After Task 7.3, a user viewing Month should be able to move naturally from:

```text
Month
    ↓
selected user-day
    ↓
planned evidence
    ↓
exact authored source
```

into the existing canonical authoring workflows for:

* Commitment;
* Event;
* Work.

The governing interaction model is:

```text
scheduled Commitment
    ↓
exact current authored source?
    ├── yes → Edit Commitment
    └── no  → truthful unavailable/stale-source state

Event
    ↓
exact current Event incarnation?
    ├── yes → Edit Event
    └── no  → truthful unavailable state

Work
    ↓
Work configuration context

selected user-day
    ↓
Add Event

Planner-level action
    ↓
Add Commitment
```

The Month must remain a projection over existing authorities.

---

# 2. Governing Product Principle

> **The user edits intent. DayFrame rebuilds the schedule.**

The Monthly Planner may navigate to authored truth.

It may not silently turn generated schedule geometry into authored placement.

Therefore:

* clicking a Commitment occurrence edits its authored Commitment;
* clicking an Event edits its Event;
* clicking Work opens Work configuration;
* adding an Event authors an Event;
* adding a Commitment authors recurring/flexible planning intent;
* moving/resizing an occurrence remains unsupported.

---

# 3. Governing Task 7.1 Principle

Task 7.1 remains semantic owner of:

* Month geometry;
* selected canonical user-day;
* exact contextual targets;
* occurrence ownership;
* coverage;
* stale/uncovered states;
* exact Commitment identity;
* exact Event identity;
* Work context targets.

React must consume those targets.

Do not reconstruct exact source identity from displayed text/time.

---

# 4. Governing Task 7.2 Principle

Task 7.2 established the visible Month:

```text
Planner
├── Month
├── Plan
└── Review Schedule
```

with:

* accessible Month grid;
* selected-day read-only workspace;
* keyboard navigation;
* mobile layout;
* lazy Month boundary;
* Plan and Review preserved during migration.

Task 7.3 adds contextual authoring **inside that existing architecture**.

Do not rebuild the Month shell.

---

# 5. Governing Task 7.2C Bundle Policy

Task 7.2C established:

### Hard

```text
Initial raw       <= 685,000
Initial gzip      <= 170,000
Largest lazy      <= 100,000
```

### Warning

```text
Initial raw       >= 650,000
Initial gzip      >= 161,500
Largest lazy      >= 80,000
```

### Advisory total

```text
Total JS >= 800,000
    growth review

Total JS >= 825,000
    architecture review + ADR
```

Current baseline:

```text
Initial raw        630,499
Initial gzip       160,954
Largest lazy        51,479
Total JS           749,882
```

Task 7.3 must preserve the three hard user-path guards and report total growth under the new governance policy.

---

# 6. Governing Exact-Identity Principle

> **Contextual editing is authorized only when the exact current authored source still exists.**

For Commitment evidence, preserve Task 6.10 identity:

* template logical ID;
* template incarnation;
* recurrence logical ID;
* recurrence incarnation.

For Event:

* exact Event ID;
* exact Event incarnation.

Never retarget to recreated sources.

---

# 7. Governing Selected-Day Principle

The Month-selected label identifies the contextual user-day.

It may seed:

* Add Event;
* selected-day review;
* contextual source inspection.

It must not silently seed unsupported Commitment recurrence semantics.

A Commitment is not inherently owned by one selected date.

---

# 8. Governing Contextual Workspace Principle

Task 7.3 should begin evolving the right/below selected-day workspace into modes.

Recommended conceptual model:

```text
Monthly Planner
    Month Grid
        ↓
Contextual Workspace
    ├── Review Day
    ├── Add Commitment
    ├── Edit Commitment
    ├── Add Event
    ├── Edit Event
    └── Work
```

These modes should be mutually coherent and preserve Month navigation context.

Do not introduce an unnecessarily complex navigation stack unless production evidence requires it.

---

# 9. Explicit Scope

Implement:

* contextual-workspace mode architecture;
* Review Day as default Month workspace;
* Add Event from selected user-day;
* Edit Event from selected-day evidence;
* Add Commitment from Planner/Month;
* Edit Commitment from selected-day occurrence;
* exact lazy source revalidation;
* Work contextual navigation;
* exact unavailable/stale-source states;
* return-to-Day Review behavior;
* preservation of displayed month;
* preservation of selected user-day;
* focus transitions;
* mobile contextual workspace;
* accessibility;
* Plan-authoring lazy reuse;
* Event editor reuse;
* Work editor/configuration reuse;
* profile/restore/full-clear invalidation;
* regression testing;
* browser QA;
* bundle policy compliance;
* governance.

---

# 10. Explicit Non-Goals

Do not implement:

* friction Resolution options inside Month;
* Try;
* Apply Planning Change;
* Plan/Review final retirement;
* direct occurrence placement;
* drag/drop;
* resize;
* schedule-time editing;
* direct Work occurrence editing;
* recurrence redesign;
* Goal ranking;
* Capacity;
* Planned Allocation;
* Recommendations;
* transition adaptation;
* Pattern Library;
* richer Today;
* Summary writes;
* new authority;
* new persistence;
* new runtime dependency.

---

# 11. Execution Artifact Rules

Before implementation:

1. verify this Task 7.3 artifact;
2. save immutable project copy;
3. record SHA-256;
4. review:

   * Task 7.1 result;
   * Task 7.2 result;
   * Task 7.2C result/ADR;
   * Month UI;
   * Monthly Planner read model;
   * Plan authoring lazy boundary;
   * `CommitmentSection`;
   * Event editor;
   * Work configuration;
   * Task 6.10 exact target handling;
   * profile replacement;
   * restore;
   * full clear;
   * focus patterns;
5. do not modify immutable artifacts.

Create:

`docs/implementation/phase-7/TASK_7.3_MONTHLY_PLANNER_CONTEXTUAL_AUTHORING_AND_EXACT_SOURCE_NAVIGATION_RESULT.md`

---

# 12. Mandatory Initial Workflow Audit

Before editing Month composition, mechanically trace current entry points for:

### Commitment

* Add;
* Edit;
* Remove;
* lazy Plan authoring;
* SetupDraft mutation;
* Save Setup;
* stale schedule behavior.

### Event

* Add;
* Edit;
* Remove;
* selected user-day;
* immediate canonical write behavior;
* schedule regeneration semantics.

### Work

* Work Hours;
* Work Schedule;
* cycle/segment configuration;
* contextual Review navigation.

Document which existing components can be reused without duplicating writers.

---

# 13. One-Writer Principle

Task 7.3 may introduce **new navigation paths**, not new authoring authorities.

Required:

```text
Month Add Commitment
    ↓
existing Add Commitment workflow

Month Edit Commitment
    ↓
existing exact Commitment workflow

Month Add Event
    ↓
existing Event writer

Month Edit Event
    ↓
existing Event writer

Month Work
    ↓
existing Work configuration
```

There must still be one canonical writer for each authority.

---

# 14. Contextual Workspace State

Define a bounded ephemeral mode type.

Conceptually:

```text
type MonthlyPlannerWorkspaceMode =
    | { kind: "reviewDay" }
    | { kind: "addCommitment" }
    | { kind: "editCommitment"; target: ExactCommitmentTarget }
    | { kind: "addEvent"; userDayDate: UserDayDate }
    | { kind: "editEvent"; target: ExactEventTarget }
    | { kind: "work"; target?: WorkContextTarget };
```

Use actual repository types.

This state is ephemeral UI/application state.

Do not persist it.

---

# 15. Default Workspace Mode

Month entry defaults to:

```text
reviewDay
```

with the canonical selected user-day.

Changing selected day while in Review Day updates the review.

---

# 16. Selected-Day Change During Editor

Audit what should happen if the user changes Month selection while an editor is open.

Preferred bounded behavior:

* do not silently retarget the open editor;
* either keep editor bound to its exact target while Month selection changes;
* or close editor and return to Review Day if existing UI model makes that clearer.

Do not let selection mutate authored target identity.

Document chosen behavior.

---

# 17. Add Event Entry

Selected-day workspace should offer:

**Add Event**

This action opens the existing Event workflow pre-contextualized to:

```text
selectedUserDayDate
```

Do not use civil midnight.

---

# 18. Add Event Semantics

Preserve existing canonical Event behavior.

All-day:

```text
user-day-wide
```

Timed:

canonical event timing semantics.

No changes to Event authority or schedule-regeneration behavior.

---

# 19. Add Event Return

After save:

* preserve displayed month;
* preserve selected user-day;
* return to Review Day;
* refresh/reproject Month from current authority;
* focus the newly created Event or stable selected-day region where practical.

Do not navigate the user away to old Setup merely to complete Event creation.

---

# 20. Add Event Cancel

Cancel:

* performs no write;
* returns to Review Day;
* preserves Month/selected-day context;
* restores focus to Add Event or stable selected-day action.

---

# 21. Edit Event Entry

A selected-day Event occurrence should expose **Edit Event** only when Task 7.1 exact target metadata proves a currently resolvable Event source.

Do not derive target from:

* title;
* start time;
* selected cell.

---

# 22. Edit Event Revalidation

Before opening the editor:

1. consume exact target from read model;
2. re-read current Event authority;
3. confirm exact incarnation;
4. open only if exact match.

This should mirror established Event protection.

---

# 23. Recreated Event

Mandatory fixture:

```text
Event A
    ↓
Month projection

delete A

create Event B
same title/date/time/logical identity where possible

old/stale target from A
    ↓
Edit Event
```

B must not open.

---

# 24. Event Unavailable State

If exact Event no longer exists:

show:

> This event has changed or is no longer available to edit from this schedule.

or equivalent concise product language.

No automatic substitution.

---

# 25. Edit Event Save

After save:

* return to Review Day;
* preserve selected date where still relevant;
* reproject current Event truth;
* preserve canonical Event regeneration semantics.

---

# 26. Edit Event Delete

After deletion:

* return to Review Day;
* Event disappears;
* no ghost selected occurrence;
* focus lands on a stable selected-day target.

---

# 27. Add Commitment Entry

Month should expose a clear Planner-level **Add Commitment** action.

Possible placement:

* Month toolbar;
* contextual workspace;
* Review Day action region.

It need not be tied to one occurrence.

---

# 28. Selected-Day Add Commitment Semantics

If Add Commitment is launched while a day is selected:

do **not** automatically author:

* a recurrence weekday;
* a one-off date;
* preferred time;

from selection unless existing Commitment semantics already authorize it.

Selection may provide context to the user, not hidden recurrence policy.

---

# 29. Add Commitment Reuse

Reuse the Task 6.7/6.10 bounded Commitment workflow.

Do not create a second Month-specific Commitment form.

Plan authoring may remain lazy.

---

# 30. Add Commitment Lazy Loading

When Add Commitment is invoked from Month:

* load existing Plan authoring capability;
* show truthful loading state;
* preserve Month navigation state;
* focus the correct first Commitment control when loaded.

Do not eager-import the entire Plan authoring surface into Month.

---

# 31. Add Commitment Save Boundary

Preserve:

```text
typing
    ↓
local editor

Add to Plan
    ↓
SetupDraft

Save Setup
    ↓
durable authored setup

schedule becomes stale
    ↓
explicit Refresh Schedule
```

Do not introduce immediate per-Commitment persistence.

---

# 32. Add Commitment Return

After Add to Plan:

audit whether the user should:

### A. remain in editor pending Save Setup

or:

### B. return to Review Day while the Planner visibly indicates unsaved SetupDraft

Use existing shared Save Setup semantics.

Do not hide unsaved state.

---

# 33. Edit Commitment Entry

Selected-day Commitment occurrence should expose **Edit Commitment** only when exact target metadata is available.

This includes Sleep if Sleep is represented through Commitment semantics.

---

# 34. Exact Commitment Revalidation

Mandatory:

```text
target from Month
    ↓
lazy Plan authoring loads
    ↓
current SetupDraft/current authored state re-read
    ↓
template ID + incarnation
recurrence ID + incarnation
    ↓
exact match?
```

Only then open.

---

# 35. Same-Incarnation Commitment

Rename or field edits preserving exact incarnation must remain editable.

---

# 36. Removed Commitment

Old Month target:

* unavailable;
* no replacement selected.

---

# 37. Recreated Commitment

Mandatory fixture:

```text
A generated into Month
A removed
B recreated with same logical IDs
old A target activated
```

B must not open.

---

# 38. Commitment Unavailable State

Use consistent stale-target copy with Review Schedule.

Prefer sharing existing component/helper if appropriate.

Do not duplicate identity semantics.

---

# 39. Edit Commitment Save

Preserve SetupDraft/Save Setup boundary.

Month must reproject the current draft/current saved state according to existing application semantics.

Do not auto-refresh Preview.

---

# 40. Remove Commitment

If existing editor already supports removal:

it remains available.

After removal:

* editor returns to stable context;
* Goal exact-link behavior remains canonical;
* schedule does not silently regenerate.

---

# 41. Goal-Link Boundary

Editing/removing a Commitment from Month must behave identically to doing so from Plan.

No Month-specific Goal-link logic.

---

# 42. Work Entry

Selected Work evidence may expose:

**Edit Work**

or equivalent product wording.

Its target is the existing composite Work configuration.

Do not treat one Work occurrence as a generic Commitment.

---

# 43. Work Context

Where Task 7.1 exposes a Work context target:

use it to focus/navigate the correct Work configuration area if practical.

Do not create exact singular Work occurrence authority.

---

# 44. Work Lazy/Reused UI

Reuse existing Work configuration UI.

If it currently lives inside Plan authoring lazy chunk:

reuse that capability.

Do not clone Work forms into Month.

---

# 45. Work Return

After Work configuration:

* preserve Month context;
* return to Review Day;
* show stale schedule after saved authored change;
* require explicit Refresh.

---

# 46. Schedule Preferences Boundary

Task 7.3 does not need to migrate Schedule Preferences into Month yet.

If Work editor currently requires nearby Schedule Preferences controls for correctness, preserve existing access.

Do not duplicate them.

---

# 47. Planning Range Boundary

Likewise defer full Planning Range migration.

Existing Plan remains available.

---

# 48. Review-Day Occurrence Actions

For selected-day planned evidence, expose contextual actions based on semantic kind.

Example:

| Evidence            | Action                      |
| ------------------- | --------------------------- |
| Event               | Edit Event                  |
| Commitment          | Edit Commitment             |
| Sleep               | Edit Commitment             |
| Work                | Edit Work                   |
| friction            | Review only in 7.3          |
| unplaced Commitment | Edit Commitment where exact |
| uncovered           | no fake edit                |

Use actual target model.

---

# 49. Read-Only Geometry Boundary

The action belongs to the source, not the rendered interval.

Do not make displayed times directly editable.

---

# 50. Selected-Day Empty Actions

For generated-empty or uncovered selected days:

the workspace may still offer:

* Add Event;
* Add Commitment.

Do not imply that uncovered means free.

---

# 51. Uncovered Day Add Event

Allowed.

Event authority is independent of generated Preview coverage.

After Event creation, the Month should show current Event truth even if Preview remains uncovered.

---

# 52. Uncovered Day Add Commitment

Allowed as global planning intent.

Do not imply selected day will necessarily receive the Commitment after generation.

---

# 53. Stale Day Editing

A stale Preview may still show old generated geometry.

Contextual edits must:

* resolve exact current source;
* allow edit only if source remains exact;
* otherwise show unavailable.

Do not automatically clear stale geometry.

---

# 54. Fresh Day Editing

Same exact identity rules.

Freshness does not weaken identity checks.

---

# 55. Needs-Attention Boundary

Task 7.3 remains read-only for friction resolution.

Selected-day Needs attention may provide:

* details;
* participant contextual source Edit actions;
* navigation to existing Review Schedule resolution workflow.

Do not duplicate Try/Apply Planning Change yet.

---

# 56. Friction Participant Editing

If a participant is an exact editable:

* Commitment;
* Event;
* Work context;

the Month may route to the appropriate authored source editor.

The friction itself remains derived evidence.

---

# 57. Unplaced Commitment Editing

Where Task 7.1 supplies exact source target:

allow Edit Commitment.

Do not offer direct placement.

---

# 58. Return to Review Day

All contextual authoring modes should have a consistent return path:

**Back to day**

or equivalent.

Return must preserve:

* displayed month;
* selected user-day;
* current Month projection.

---

# 59. Context Preservation

Preserve ephemeral:

* displayed month;
* selected label;
* focused label where sensible.

Do not persist these to storage.

---

# 60. Profile Replacement

If profile load occurs while a Month contextual editor is open:

* revalidate source;
* close/unavailable editor if exact source is replaced;
* preserve Month view state where safe;
* no retargeting.

---

# 61. Restore Replacement

Same exact rule.

---

# 62. Full Clear

Close any open contextual editor.

Clear stale targets.

Month shell remains usable.

No ghost source.

---

# 63. Protection

If authored authority becomes protected:

* contextual writes become unavailable;
* do not show an editable empty form;
* return to recovery-safe state.

---

# 64. Event/Commitment Concurrent Change

If source changes between target selection and lazy editor completion:

revalidate after load.

Do not open stale target.

---

# 65. Lazy Load Race

Mandatory test where practical:

```text
activate Edit Commitment
    ↓
Plan chunk loading
    ↓
profile/restore/recreation replaces source
    ↓
chunk finishes
```

Result:

* replacement is not opened;
* user sees unavailable state.

---

# 66. Workspace Loading State

When contextual capability is lazy-loading:

show a truthful loading state inside the workspace.

Do not blank the entire Month.

Month navigation may remain visible.

---

# 67. Loading Focus

On successful editor load:

focus editor heading/first logical control.

On failed exact revalidation:

focus unavailable message/Back to day action.

No focus to `body`.

---

# 68. Add Event Focus

Open:

first logical Event field.

Save/cancel:

return to stable selected-day action/created item.

---

# 69. Add Commitment Focus

Open after lazy load:

first logical Commitment control.

Validation:

existing recurrence focus behavior remains.

---

# 70. Edit Commitment Focus

Open exact editor heading/control.

Unavailable:

stable warning.

---

# 71. Work Focus

Navigate to relevant Work heading/control.

Do not dump focus at top of Plan form if more specific focus target can be reused.

---

# 72. Accessibility — Workspace Modes

Each contextual mode should have:

* clear heading;
* accessible return action;
* logical landmarks/regions;
* form labels;
* errors;
* status messages.

Avoid nested modal semantics unless actually modal.

---

# 73. Accessibility — Occurrence Actions

Buttons should be target-specific.

Examples:

* Edit Dentist appointment
* Edit Gym commitment
* Edit Work

Do not use repeated unlabeled “Edit” buttons without context.

---

# 74. Accessibility — Stale Target

Unavailable state must be textual and announced appropriately.

No icon-only failure.

---

# 75. Mobile Architecture

At narrow width:

```text
Month grid
    ↓
Contextual workspace below
```

When editor opens:

prefer replacing the selected-day detail region below the grid rather than creating horizontal layouts.

The Month may remain visible above unless vertical usability becomes poor.

---

# 76. Mobile Editor Density

Existing Commitment/Event/Work forms must remain usable at:

* 320;
* 375;
* 390;
* 430px.

No horizontal page scrolling.

---

# 77. Mobile Return

Back-to-day action must remain obvious after scrolling through a form.

Sticky behavior is optional and should not be added without evidence.

---

# 78. Desktop Architecture

On desktop:

```text
Month grid | Contextual workspace
```

editor modes may occupy the contextual workspace.

Avoid opening a second disconnected full-page editor unless existing lazy component architecture requires it.

---

# 79. Plan Surface Preservation

Plan remains reachable and fully functional.

Task 7.3 does not remove:

* Goals;
* Schedule Preferences;
* Planning Range;
* Advanced Commitment Fields;
* Save Setup.

---

# 80. Review Schedule Preservation

Review remains reachable for:

* detailed generated schedule;
* Event workflow if not fully migrated;
* friction resolution;
* Try;
* Apply Planning Change;
* detailed visualizer.

Do not remove it yet.

---

# 81. Migration Tracking

Identify which responsibilities have now moved successfully into Month:

* Add Commitment;
* Edit Commitment;
* Add Event;
* Edit Event;
* Work navigation.

Identify which remain elsewhere:

* Goals;
* Schedule Preferences;
* Planning Range;
* advanced fields;
* schedule generation;
* friction resolution;
* detailed Review.

This becomes input to later Phase 7 tasks.

---

# 82. Duplicate Presentation Rule

Temporary duplicate **navigation paths** are acceptable.

Duplicate **writer implementations** are not.

Month and Plan may both open the same Commitment workflow.

They must not own separate forms/state semantics.

---

# 83. Bundle Architecture

Strong preference:

* reuse existing Plan authoring lazy chunk;
* reuse Event editor implementation;
* reuse Work UI;
* keep Month shell lazy;
* do not move editors eagerly.

Measure actual graph.

---

# 84. Initial-Gzip Warning

Current initial gzip:

```text
160,954
```

warning begins at:

```text
161,500
```

Only 546 bytes remain before warning.

This is not a failure, but Task 7.3 should avoid unnecessary eager-shell growth.

If warning is crossed:

* attribute exact eager growth;
* verify it is justified;
* record review per Task 7.2C.

---

# 85. Total-JS Growth

Report final total.

If:

```text
>= 800,000
```

perform required growth review before accepting Task 7.3.

If:

```text
>= 825,000
```

Task 7.3 cannot simply proceed; architecture review/ADR is required.

---

# 86. Largest-Lazy Growth

If contextual authoring expands an existing lazy chunk:

keep:

```text
<= 100,000
```

and record warning if:

```text
>= 80,000
```

Do not fragment solely to dodge warning.

---

# 87. No New Runtime Dependency

Mandatory.

---

# 88. No Bundle Policy Change

Task 7.2C governs.

Do not revise warning/milestone/hard thresholds in Task 7.3.

---

# 89. Tests — Workspace Modes

Cover:

* Review Day;
* Add Commitment;
* Edit Commitment;
* Add Event;
* Edit Event;
* Work;
* back-to-day.

---

# 90. Tests — Add Event

Cover:

* selected user-day context;
* save;
* cancel;
* all-day;
* timed;
* uncovered day;
* Month reprojection;
* focus.

---

# 91. Tests — Edit Event Exactness

Cover:

* exact source;
* same-incarnation edit;
* removed source;
* recreated source;
* lazy-load/replacement race if applicable.

---

# 92. Tests — Event Delete

No ghost token/detail.

---

# 93. Tests — Add Commitment

Cover:

* opens canonical editor;
* no hidden selected-date recurrence;
* Add to Plan;
* recurrence workflow intact;
* Save Setup boundary intact;
* focus.

---

# 94. Tests — Edit Commitment Exactness

Cover:

* exact current source;
* same-incarnation rename;
* removed source;
* recreated same logical source;
* profile replacement;
* restore replacement;
* lazy-load replacement race.

---

# 95. Tests — Remove Commitment

Cover:

* canonical removal;
* Goal link semantics;
* stale schedule;
* Month reprojection.

---

# 96. Tests — Work Navigation

Cover:

* exact Work context;
* opens canonical configuration;
* return;
* focus;
* no generic Commitment path.

---

# 97. Tests — Stale Schedule

Contextual edits from stale Month geometry:

* exact current source opens;
* removed/recreated does not;
* stale geometry remains visible until explicit refresh.

---

# 98. Tests — Uncovered Day

Add Event and Add Commitment remain possible without coverage inference.

---

# 99. Tests — Friction Participant Navigation

If implemented:

* participant edits source;
* friction remains unchanged until schedule update;
* no Resolution option migration.

---

# 100. Tests — Unplaced Source Navigation

Exact source edit only.

No direct placement.

---

# 101. Tests — No Direct Geometry Writes

Assert clicking:

* time;
* occurrence body;
* empty schedule interval;

does not mutate scheduled geometry directly.

---

# 102. Tests — Context Preservation

Across editor open/save/cancel:

* displayed month preserved;
* selected label preserved;
* editor target stable;
* return is deterministic.

---

# 103. Tests — Profile / Restore / Clear

Open contextual editor, then:

* profile load;
* restore;
* clear.

No stale target survives.

---

# 104. Tests — Protection

Protected authored state cannot open writable contextual editor.

---

# 105. Tests — Accessibility

Cover:

* target-specific Edit names;
* editor headings;
* Back to day;
* loading status;
* unavailable status;
* focus after load/save/cancel/failure.

---

# 106. Tests — Mobile Structure

Component-level layout regression where appropriate.

Browser QA remains mandatory.

---

# 107. Tests — Existing Plan Regression

Canonical Plan workflows still work.

---

# 108. Tests — Existing Review Regression

Generation/friction/visualizer still work.

---

# 109. Tests — Today/Summary Independence

Representative regressions sufficient.

No contextual Month writes leak into these surfaces.

---

# 110. Browser QA — Canonical Commitment Journey

Production browser:

```text
Planner Month
    select day
    inspect Commitment
    Edit Commitment
    change field
    Add/Update to Plan
    Save Setup
    return Month
    stale schedule visible
```

Verify exact source and focus.

---

# 111. Browser QA — Recreated Commitment

Mandatory if fixture can be constructed in production browser.

If not, deterministic integration tests must cover it and limitation must be explicit.

---

# 112. Browser QA — Event Journey

```text
Month
    select day
    Add Event
    save
    inspect
    edit
    save
    remove
```

Verify current Event truth and context preservation.

---

# 113. Browser QA — Work Journey

```text
Month
    select Work day
    Edit Work
    inspect/change where safe fixture allows
    return Month
```

Do not accidentally alter real fixture data without controlled test reset.

---

# 114. Browser QA — Uncovered Day

Select uncovered date.

Verify:

* Not generated remains;
* Add Event works;
* Add Commitment works;
* UI does not call day free.

---

# 115. Browser QA — Stale Schedule

Edit authored source, Save Setup, return Month.

Verify:

* stale status;
* old geometry remains;
* exact source navigation truthful;
* explicit Refresh still required elsewhere/current workflow.

---

# 116. Browser QA — Keyboard

Keyboard-only:

* select day;
* activate Add Event;
* save/cancel;
* activate Add Commitment;
* return;
* activate Edit occurrence;
* back to day.

No pointer requirement.

---

# 117. Browser QA — Mobile

At minimum:

```text
320
375
390
430
```

Verify:

* Month remains usable;
* contextual editor fits;
* back navigation obvious;
* no horizontal overflow;
* focus/scroll usable.

---

# 118. Browser QA — Slow Load

Throttle Plan-authoring lazy load.

Verify:

* Month stays visible;
* contextual workspace shows loading;
* exact target revalidated after load;
* no false editor.

---

# 119. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.3_MONTHLY_PLANNER_CONTEXTUAL_AUTHORING_AND_EXACT_SOURCE_NAVIGATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 7.1 Prerequisite
4. Task 7.2 Prerequisite
5. Task 7.2C Bundle Governance Prerequisite
6. Initial Workflow Audit
7. Files Changed
8. Workspace Mode Architecture
9. Default Review Mode
10. Selected-Day Change During Editor
11. One-Writer Assessment
12. Add Event Entry
13. Add Event Context
14. Add Event Save
15. Add Event Cancel
16. Edit Event Entry
17. Event Revalidation
18. Recreated Event
19. Event Unavailable
20. Event Save/Delete
21. Add Commitment Entry
22. Selected-Day Commitment Semantics
23. Commitment Editor Reuse
24. Commitment Lazy Loading
25. Commitment Save Boundary
26. Commitment Return
27. Edit Commitment Entry
28. Exact Commitment Revalidation
29. Same-Incarnation Commitment
30. Removed Commitment
31. Recreated Commitment
32. Commitment Unavailable
33. Commitment Save
34. Commitment Removal
35. Goal-Link Boundary
36. Work Entry
37. Work Context
38. Work UI Reuse
39. Work Return
40. Schedule Preferences Boundary
41. Planning Range Boundary
42. Review-Day Actions
43. Geometry Write Boundary
44. Empty/Uncovered Actions
45. Stale-Day Editing
46. Needs-Attention Boundary
47. Friction Participant Navigation
48. Unplaced Navigation
49. Return to Review Day
50. Context Preservation
51. Profile Replacement
52. Restore Replacement
53. Full Clear
54. Protection
55. Lazy Load Race
56. Loading State
57. Focus
58. Accessibility
59. Mobile
60. Desktop
61. Plan Preservation
62. Review Preservation
63. Migration Tracking
64. Duplicate Writer Assessment
65. Bundle Architecture
66. Initial-Gzip Review
67. Total-JS Review
68. Largest-Lazy Review
69. Runtime Dependency Assessment
70. Tests Added/Changed
71. Focused Validation
72. Full Validation
73. Bundle Validation
74. Browser Commitment QA
75. Browser Event QA
76. Browser Work QA
77. Browser Uncovered QA
78. Browser Stale QA
79. Browser Keyboard QA
80. Browser Mobile QA
81. Slow-Load QA
82. Governance Updates
83. ADR Determination
84. Deviations
85. Discoveries
86. Deferred Work
87. Workspace Mode Matrix
88. Contextual Action Matrix
89. Exact Target Matrix
90. Save/Write Matrix
91. Staleness Matrix
92. Return/Focus Matrix
93. Responsive Matrix
94. Loading Matrix
95. Bundle Matrix
96. Migration Matrix
97. Authority Matrix
98. Product-Boundary Matrix
99. Epistemic Matrix
100. Architectural Invariant Assessment
101. Stop-Condition Assessment
102. Architectural Alignment Assessment
103. Task 7.4 Readiness
104. Recommended Next Task
105. Final Completion Determination

---

# 120. Required Workspace Mode Matrix

| Mode            | Entry              | Canonical writer/read model | Exit                     |                 Durable? |
| --------------- | ------------------ | --------------------------- | ------------------------ | -----------------------: |
| Review Day      | select Month day   | Month projection            | context action           |                       No |
| Add Commitment  | Month action       | SetupDraft workflow         | Back to day / Plan state | No workspace persistence |
| Edit Commitment | exact occurrence   | SetupDraft workflow         | Back to day              |                       No |
| Add Event       | selected user-day  | Event authority             | Back to day              |                       No |
| Edit Event      | exact Event target | Event authority             | Back to day              |                       No |
| Work            | Work evidence      | Work authored setup         | Back to day              |                       No |

---

# 121. Required Contextual Action Matrix

| Month evidence/state | Action               | Exact target required? | Direct schedule write? |
| -------------------- | -------------------- | ---------------------: | ---------------------: |
| selected day         | Add Event            |           date context |                     No |
| Planner Month        | Add Commitment       |   No occurrence target |                     No |
| Commitment           | Edit Commitment      |                    Yes |                     No |
| Sleep                | Edit Commitment      |                    Yes |                     No |
| Event                | Edit Event           |                    Yes |                     No |
| Work                 | Edit Work            |           Work context |                     No |
| friction participant | Edit source if exact |                    Yes |                     No |
| unplaced Commitment  | Edit Commitment      |                    Yes |                     No |
| empty schedule time  | None                 |                    N/A |                     No |

---

# 122. Required Exact Target Matrix

| Source     | Exact fields                              | Revalidate after lazy load? | Recreated replacement allowed? |
| ---------- | ----------------------------------------- | --------------------------: | -----------------------------: |
| Commitment | template + recurrence logical/incarnation |                         Yes |                             No |
| Event      | Event ID + incarnation                    |                         Yes |                             No |
| Work       | composite Work context                    |                   as needed |  No false singular replacement |

---

# 123. Required Save/Write Matrix

| Action                |         Local editor | SetupDraft | Durable authored state |               Preview stale | Auto-refresh |
| --------------------- | -------------------: | ---------: | ---------------------: | --------------------------: | -----------: |
| type Commitment       |                  Yes |         No |                     No |                          No |           No |
| Add/Update Commitment | clears/updates local |        Yes |                     No |          existing semantics |           No |
| Save Setup            |                   No |     commit |                    Yes | Yes where equivalent change |           No |
| Add Event             |               editor |        N/A |  immediate Event write |   canonical Event semantics |    canonical |
| Edit Event            |               editor |        N/A |  immediate Event write |                   canonical |    canonical |
| Edit Work             |       canonical form | SetupDraft |             Save Setup |              Yes after save |           No |
| Month selection       |                   No |         No |                     No |                          No |           No |

Refine from implementation.

---

# 124. Required Staleness Matrix

| Month geometry | Current source      | Edit allowed? | Result           |
| -------------- | ------------------- | ------------: | ---------------- |
| fresh          | exact source exists |           Yes | open exact       |
| stale          | exact source exists |           Yes | open exact       |
| stale          | source removed      |            No | unavailable      |
| stale          | source recreated    |            No | unavailable      |
| uncovered      | no occurrence       |           N/A | Add actions only |

---

# 125. Required Return/Focus Matrix

| Action               | Return state                           | Focus target                  |
| -------------------- | -------------------------------------- | ----------------------------- |
| Add Event save       | Review selected day                    | created Event / stable region |
| Add Event cancel     | Review selected day                    | Add Event                     |
| Edit Event save      | Review selected day                    | edited Event                  |
| Event delete         | Review selected day                    | stable day action             |
| Add Commitment exit  | chosen canonical state                 | deterministic                 |
| Edit Commitment exit | Review selected day / Plan draft state | deterministic                 |
| unavailable target   | Review/error context                   | unavailable message           |
| Work exit            | Review selected day                    | Work item/action              |

---

# 126. Required Responsive Matrix

| Width   | Month        | Workspace editor   | Navigation          |
| ------- | ------------ | ------------------ | ------------------- |
| 320     | compact grid | stacked full-width | visible Back to day |
| 375     |              |                    |                     |
| 390     |              |                    |                     |
| 430     |              |                    |                     |
| tablet  | adaptive     | below/split        |                     |
| desktop | split        | side workspace     |                     |

---

# 127. Required Loading Matrix

| Capability           | Existing lazy boundary | Month behavior while loading | Exact revalidation |
| -------------------- | ---------------------- | ---------------------------- | -----------------: |
| Commitment authoring | Plan authoring         | workspace loading            |                Yes |
| Work configuration   | audit                  | workspace loading if lazy    |          as needed |
| Event editor         | audit                  | workspace loading if needed  |                Yes |
| Month itself         | lazy                   | existing                     |                N/A |

---

# 128. Required Bundle Matrix

Use the Task 7.2C baseline:

| Metric       | 7.2C baseline | Task 7.3 final | Status                                   |
| ------------ | ------------: | -------------: | ---------------------------------------- |
| Initial raw  |       630,499 |                | hard <=685,000; warn >=650,000           |
| Initial gzip |       160,954 |                | hard <=170,000; warn >=161,500           |
| Largest lazy |        51,479 |                | hard <=100,000; warn >=80,000            |
| Total JS     |       749,882 |                | review >=800,000; architecture >=825,000 |

Record relevant feature chunks.

---

# 129. Required Migration Matrix

| Capability          | Before 7.3             | After 7.3                   | Old path still needed? |
| ------------------- | ---------------------- | --------------------------- | ---------------------: |
| Add Commitment      | Plan                   | Month + Plan same workflow  |   Yes during migration |
| Edit Commitment     | Plan/Review contextual | Month + existing paths      |                    Yes |
| Add Event           | Review contextual      | Month + Review same writer  |       likely temporary |
| Edit Event          | Review                 | Month + Review              |       likely temporary |
| Work configuration  | Plan/Review            | Month contextual + existing |                    Yes |
| friction resolution | Review                 | Review                      |                    Yes |
| schedule generation | Plan/Review            | unchanged                   |                    Yes |
| Goals               | Plan                   | Plan                        |                    Yes |
| preferences/range   | Plan                   | Plan                        |                    Yes |

---

# 130. Required Authority Matrix

| Authority              |             Month reads | Month writes via canonical workflow | New authority? |
| ---------------------- | ----------------------: | ----------------------------------: | -------------: |
| SetupDraft             |              contextual |          Yes through existing forms |             No |
| durable authored setup |            read/current |                     Save Setup only |             No |
| Event authority        |                     Yes |               existing Event writer |             No |
| Work setup             |            read/context |              existing Work workflow |             No |
| Preview                |                     Yes |                      Never directly |             No |
| PlanDecision           | read via Preview effect |                                  No |             No |
| HistoricalPlan         |                      No |                                  No |             No |
| ExecutionHistory       |                      No |                                  No |             No |
| Progress               |                      No |                                  No |             No |

---

# 131. Required Product-Boundary Matrix

| Capability                           | Task 7.3   |
| ------------------------------------ | ---------- |
| Month contextual Add/Edit Commitment | Implement  |
| Month contextual Add/Edit Event      | Implement  |
| Month contextual Work navigation     | Implement  |
| exact source revalidation            | Implement  |
| Month direct geometry editing        | Prohibited |
| friction resolution migration        | Deferred   |
| Plan retirement                      | Deferred   |
| Review retirement                    | Deferred   |
| schedule generation migration        | Deferred   |
| Goals/preferences/range migration    | Deferred   |
| Capacity                             | Prohibited |
| Allocation                           | Prohibited |
| Recommendations                      | Prohibited |
| Pattern Library                      | Prohibited |
| transition adaptation                | Prohibited |

---

# 132. Required Epistemic Matrix

| Evidence/state                      | Month may enable        | Must not imply                           |
| ----------------------------------- | ----------------------- | ---------------------------------------- |
| exact Commitment source             | Edit Commitment         | edit scheduled geometry directly         |
| stale occurrence + exact source     | Edit current source     | stale schedule becomes fresh             |
| stale occurrence + recreated source | unavailable             | recreated source is same                 |
| Event                               | Edit Event              | Event occurred                           |
| Work occurrence                     | Edit Work configuration | this occurrence is independent authority |
| uncovered day                       | Add Event/Commitment    | free time                                |
| friction participant                | edit authored source    | Recommendation                           |
| unplaced candidate                  | edit authored source    | direct placement                         |
| saved authored change               | schedule stale          | auto-recomputed schedule                 |

---

# 133. Architectural Invariants

Assess at minimum:

1. Month remains a projection.
2. Month acquires navigation/write entry points, not new authority.
3. Task 7.1 remains Month semantic owner.
4. Task 7.2 grid semantics remain unchanged.
5. selected user-day remains canonical.
6. variable-duration days remain truthful.
7. display-week semantics remain unchanged.
8. coverage semantics remain unchanged.
9. generated-empty differs from uncovered.
10. stale geometry remains visible.
11. Preview is never directly edited.
12. scheduled occurrence geometry is never directly authored.
13. Add Commitment uses canonical Commitment workflow.
14. Edit Commitment uses canonical Commitment workflow.
15. no second Commitment form exists.
16. Commitment remains projection over authored template/recurrence.
17. exact template incarnation is required.
18. exact recurrence incarnation is required.
19. logical ID alone cannot retarget.
20. title/time matching remains prohibited.
21. same-incarnation Commitment remains editable.
22. removed Commitment is unavailable.
23. recreated Commitment is unavailable from stale target.
24. Add Event uses singular Event writer.
25. Edit Event uses singular Event writer.
26. no second Event authority exists.
27. exact Event incarnation is required.
28. recreated Event does not retarget.
29. all-day Event remains user-day-wide.
30. Work remains composite authored setup.
31. Work occurrence does not become generic Commitment.
32. Work edits retain Save Setup semantics.
33. Add Commitment does not infer recurrence from selected day.
34. uncovered does not imply free.
35. Add Event may occur independently of Preview coverage.
36. Event current truth may appear before regenerated schedule.
37. Commitment Save follows SetupDraft boundary.
38. Save Setup remains durable authored scheduling boundary.
39. saved scheduling edits stale Preview.
40. no auto-refresh is introduced.
41. Event canonical regeneration semantics remain unchanged.
42. Goal links remain Goal-owned.
43. Goal link exactness remains unchanged.
44. friction remains derived.
45. friction resolution remains deferred.
46. Try remains Review-owned.
47. Apply Planning Change remains Review-owned.
48. unplaced remains derived.
49. direct unplaced placement remains prohibited.
50. contextual editor state is ephemeral.
51. displayed month remains ephemeral.
52. selected label remains ephemeral.
53. focus state remains ephemeral.
54. no new persistence is added.
55. no Backup change is added.
56. no restore format change is added.
57. profile replacement revalidates targets.
58. restore replacement revalidates targets.
59. full clear closes stale editors.
60. protected state disables writes.
61. lazy-loaded editors revalidate after load.
62. source replacement during load cannot retarget.
63. Month remains visible during contextual lazy load where practical.
64. loading does not look empty.
65. load failure is explicit.
66. focus after load is deterministic.
67. focus after save is deterministic.
68. focus after cancel is deterministic.
69. unavailable target focus is deterministic.
70. keyboard-only authoring is possible.
71. target-specific accessible names exist.
72. mobile forms remain usable.
73. no horizontal page scroll is required.
74. desktop side-workspace remains coherent.
75. Plan remains fully functional.
76. Review remains fully functional.
77. migration is reversible.
78. temporary duplicate navigation paths share one writer.
79. no duplicate writer implementation is added.
80. Month remains lazy.
81. Plan authoring remains lazy.
82. Today remains lazy.
83. Summary remains lazy.
84. eager shell growth is controlled.
85. initial raw hard guard remains unchanged.
86. initial gzip hard guard remains unchanged.
87. largest lazy hard guard remains unchanged.
88. total JS remains reported.
89. warning thresholds remain unchanged.
90. total review milestones remain unchanged.
91. any warning crossing is attributed.
92. any 800k total crossing triggers review.
93. any 825k crossing blocks on architecture review.
94. no runtime dependency is added.
95. no bundle-policy change occurs.
96. no Capacity is introduced.
97. no Allocation is introduced.
98. no Recommendations are introduced.
99. no transition adaptation is introduced.
100. no Pattern Library is introduced.
101. no Goal reorientation is introduced.
102. no scheduler redesign occurs.
103. no recurrence redesign occurs.
104. focused tests pass.
105. full validation passes.
106. production browser QA passes.
107. keyboard browser QA passes.
108. mobile browser QA passes.
109. slow-load exact-target revalidation is verified.
110. governance records migrated responsibilities.
111. remaining Plan/Review responsibilities are explicit.
112. Task 7.4 can migrate attention/configuration without reopening source-authoring semantics.

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

Stop and report rather than invent architecture if:

* Month exact target metadata is insufficient to open canonical editors safely;
* Commitment contextual authoring would require a second form/writer;
* Event contextual authoring would require a second authority;
* Work cannot be contextualized without pretending one occurrence is independently authored;
* selected-day Add Commitment requires undefined recurrence semantics;
* lazy Plan authoring cannot revalidate exact targets after load;
* contextual editing requires persisted Month state;
* contextual writes require direct Preview mutation;
* Event/Commitment edits cannot preserve existing stale/regeneration semantics;
* profile/restore races cannot be made safe;
* a core workflow becomes pointer-only;
* mobile contextual editing becomes unusable;
* hard bundle guards fail and the growth cannot be justified/remediated within scope;
* total JS reaches the 825,000 architecture-review milestone;
* implementation requires a new runtime dependency;
* friction resolution must be migrated to make contextual authoring coherent.

If friction is the only missing coherence boundary, stop and recommend a separate bounded Task 7.4 rather than expanding 7.3.

---

# 135. Focused Validation

Run focused suites for:

* Month;
* Monthly Planner adapter;
* CommitmentSection;
* Plan authoring lazy boundary;
* Event editor;
* Work configuration;
* exact Commitment identity;
* exact Event identity;
* profile replacement;
* restore;
* full clear;
* stale Preview;
* accessibility/focus;
* bundle policy.

Record exact files and counts.

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

* test files;
* tests;
* transformed modules;
* initial raw;
* initial gzip;
* Month chunk;
* Plan chunk;
* other changed lazy chunks;
* largest lazy;
* total JS;
* warning state;
* total review state;
* diff result.

---

# 137. Manual Browser Validation

Mandatory.

Use production build.

Validate:

### Commitment

* Add;
* Edit;
* same-incarnation;
* stale exact;
* unavailable recreated source;
* save;
* remove;
* return.

### Event

* Add;
* Edit;
* delete;
* all-day;
* timed;
* uncovered date.

### Work

* contextual navigation;
* return.

### Context

* displayed month preserved;
* selected day preserved;
* focus preserved.

### Keyboard

* all core contextual actions.

### Mobile

* 320;
* 375;
* 390;
* 430.

### Slow loading

* lazy Commitment editor;
* stale-source replacement during load where mechanically feasible.

---

# 138. Governance

Update:

* Task 7.3 result;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Record which Planner responsibilities now live contextually inside Month.

No ADR is expected unless implementation discovers a genuinely new enduring interaction/authority rule.

---

# 139. Task 7.4 Readiness

Task 7.4 becomes authorized only if:

* Month can Add/Edit Commitment through canonical workflow;
* Month can Add/Edit Event through canonical workflow;
* Month can contextualize Work;
* exact identity remains safe;
* stale/recreated sources never retarget;
* selected-day context survives authoring;
* profile/restore/full-clear invalidation is safe;
* keyboard/mobile/browser QA passes;
* bundle hard guards remain green;
* no 825k architecture-review milestone is reached.

---

# 140. Recommended Next Task

If green:

> **Task 7.4 — Monthly Planner Attention, Resolution, and Planning Configuration Migration Audit/Implementation**

Its likely scope should evaluate/migrate:

* Needs attention;
* friction Resolution options;
* unplaced;
* Generate/Refresh;
* Goals;
* Schedule Preferences;
* Planning Range;

and determine which remaining Plan / Review responsibilities are ready to converge.

Do not pre-authorize final Plan/Review retirement.

---

# 141. Completion Criteria

Task 7.3 is complete only when:

* the current Commitment/Event/Work authoring workflows have been mechanically audited;
* Month has a bounded contextual-workspace mode architecture;
* Review Day remains the default selected-day mode;
* Add Event opens the singular Event writer for the canonical selected user-day;
* Edit Event resolves and revalidates exact Event incarnation;
* removed/recreated Event targets never retarget;
* Add Commitment opens the canonical bounded Commitment workflow without inferring recurrence from the selected date;
* Edit Commitment resolves and revalidates exact template and recurrence incarnations after lazy loading;
* removed/recreated Commitment targets never retarget;
* same-incarnation source edits remain valid;
* Work evidence opens the existing composite Work configuration rather than creating a generic Work occurrence authority;
* contextual editors reuse existing writers rather than duplicating forms;
* Commitment mutations preserve local-editor → SetupDraft → Save Setup → stale Preview semantics;
* Event mutations preserve canonical immediate Event-authority semantics;
* Work edits preserve Save Setup and stale Preview behavior;
* Goal-link exactness remains unchanged;
* stale Month geometry remains visible and contextual actions remain exact;
* uncovered dates remain epistemically distinct while still allowing valid Add Event/Commitment entry;
* friction and unplaced remain derived evidence and direct placement/resolution remains deferred;
* displayed month, selected user-day, and useful focus context survive editor entry/exit without durable persistence;
* profile replacement, restore, full clear, protection, and lazy-load races cannot open or mutate stale exact targets;
* contextual loading remains truthful;
* focus after load/save/cancel/delete/unavailable states is deterministic;
* keyboard-only contextual authoring works;
* accessible controls have target-specific names;
* 320–430px mobile authoring remains usable without horizontal dependence;
* Plan and Review Schedule remain fully functional while the strangler migration progresses;
* duplicate navigation paths share canonical writers and do not duplicate authority;
* no direct schedule geometry editing, new authority, new persistence, scheduler change, recurrence redesign, Capacity, Allocation, Recommendations, transition adaptation, Pattern Library, Goal reorientation, runtime dependency, or bundle-policy change is introduced;
* initial raw, initial gzip, and largest-lazy hard guards remain green;
* warning crossings are explicitly attributed;
* total JS remains reported and reviewed at its governed milestones;
* focused/full validation and production-browser QA pass;
* governance clearly records which authored workflows have migrated into Month and which Planner/Review responsibilities remain;
* Task 7.4 can begin attention/configuration convergence without re-solving Month geometry, exact source identity, contextual authoring authority, or workspace navigation semantics.

---

# 142. Final Implementation Principle

> **The Monthly Planner becomes powerful by connecting generated evidence back to the user's exact authored intent—not by making the generated schedule itself editable.**

Select the day.

Inspect the plan.

Open the exact source.

Edit intent.

Save through the canonical authority.

Let DayFrame rebuild the schedule.

---

# 143. Final Completion Statement

**Task 7.3 is complete when DayFrame's Monthly Planner has evolved from a read-only spatial schedule surface into a contextual authored-planning workspace without creating any new planning authority: when a selected canonical user-day can launch the existing singular Event writer for Add Event, current Event evidence can open only its exact matching Event incarnation, scheduled or unplaced Commitment evidence can open only its exact matching template-and-recurrence incarnation through the existing lazy bounded Commitment editor, and Work evidence can navigate only to the existing composite Work configuration; when recreated or removed sources never silently retarget, lazy-loaded editors revalidate identity after loading and after profile/restore/replacement races, and unavailable sources produce truthful accessible feedback; when Add Commitment remains recurring/flexible intent rather than inheriting hidden semantics from a clicked date, Commitment edits continue through local editor → SetupDraft → Save Setup → stale Preview, Events preserve their canonical immediate authored-write/regeneration semantics, Work preserves Save Setup semantics, Goal links retain exact ownership, stale schedule geometry remains visible until explicit regeneration, and neither selected-day context nor schedule presentation is ever mutated directly; when the Month contextual workspace preserves displayed month, selected user-day, focus, accessible navigation, and mobile usability while reusing existing writers instead of duplicating forms; when friction, Resolution options, direct placement, schedule generation migration, Goals, Preferences, Planning Range, Capacity, Allocation, Recommendations, transition adaptation, Pattern Library, and Goal reorientation remain correctly deferred; when Plan and Review Schedule remain functional during the strangler migration; when all hard bundle guards established by Task 7.2C remain green, any warning or advisory growth milestone is explicitly reviewed under the accepted governance policy, no new runtime dependency or bundle-policy exception is introduced, focused and full validation pass, real production-browser keyboard/mobile/slow-load QA verifies the new contextual workflows, governance records the migrated responsibility boundary, and Task 7.4 can continue Monthly Planner convergence without reopening exact-source identity, canonical authority, selected-user-day semantics, or contextual authoring architecture.**
