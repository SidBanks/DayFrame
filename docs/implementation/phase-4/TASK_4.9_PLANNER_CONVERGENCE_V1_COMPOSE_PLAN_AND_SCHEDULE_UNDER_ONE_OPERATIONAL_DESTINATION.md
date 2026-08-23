# Task 4.9 — Planner Convergence V1: Compose Plan and Schedule Under One Operational Destination

## Status

Ready for implementation.

## Phase

Phase 4 — Historical Intelligence / Product Surface Convergence

## Task Type

Bounded product-surface convergence, navigation restructuring, composition-first workflow integration, draft-state preservation, schedule-review integration, operational-reporting preservation, accessibility, responsive behavior, and regression coverage.

---

# 1. Context

Task 4.8 completed the Phase 4 roadmap and Planner Convergence readiness review with:

> **Determination A — Begin Planner Convergence V1 now.**

The audit found:

* Summary is a sufficient independent V1;
* continued Summary expansion has lower immediate product value than operational convergence;
* Setup and Preview are already two halves of one forward-looking planning workflow;
* convergence can be composition-first;
* no scheduling-engine change is required;
* no persistence migration is required;
* no HistoricalPlan or ExecutionHistory authority change is required;
* no router is required;
* no bounded prerequisite is required.

Task 4.8 recommended:

> **Task 4.9 — Planner Convergence V1: Compose Plan and Schedule Under One Operational Destination.**

The accepted long-term mental model is now sufficiently supported by implementation:

```text id="4cd9r6"
Planner
    Plan
    Schedule
    operational reporting

Summary
    derived understanding
```

Task 4.9 implements the first truthful Planner surface without attempting the final Planner product.

---

# 2. Purpose

Create one top-level **Planner** destination that composes the existing Setup and Preview operational capabilities into one coherent forward-looking workspace.

Planner V1 must let the user:

1. author and edit current planning inputs;
2. preserve the existing unified authored draft;
3. save those authored changes;
4. explicitly generate or regenerate the derived schedule;
5. review current, stale, or absent schedule state;
6. resolve friction through existing governed flows;
7. report current outcomes contextually;
8. report past planned occurrences;
9. inspect/correct/retract Report history;
10. move between Plan and Schedule without losing draft state or implicitly generating.

Summary remains a separate top-level, read-only analytical destination.

---

# 3. Governing Product Principle

> **Planner is where users define intent and operate on the schedule DayFrame builds. Summary is where users inspect derived understanding.**

This task must make that boundary visible without changing the underlying authority architecture.

---

# 4. Composition-First Principle

Task 4.8 selected:

> **Composition-first, not rewrite-first.**

Therefore Task 4.9 should preferentially:

* reuse `SetupScreen`;
* reuse `PreviewScreen`;
* preserve their existing handlers;
* preserve the existing app-shell ownership of draft and Preview state;
* wrap them in a Planner shell/subview model;
* extract smaller pieces only when necessary for truthful composition.

Do not begin by rewriting Setup or Preview from scratch.

---

# 5. Explicit Non-Goal: Final Planner

Planner V1 is not the final long-term Planner.

Do not attempt to deliver all future ideas such as:

* deeply inline commitment editing from schedule blocks;
* drag/drop schedule editing;
* automatic contextual Pattern Library;
* autosave;
* recommendation-driven changes;
* Goal-driven planning;
* full Settings extraction;
* router/deep links;
* complete mobile redesign.

Planner V1 is the bounded convergence of existing governed capabilities.

---

# 6. Accepted Task 4.8 Findings

Treat these as governing inputs:

1. Summary is sufficient V1.
2. Planner Convergence is the highest-value next product move.
3. Phase 4 remains open.
4. Top-level navigation should become `Planner / Summary`.
5. Planner should use internal `Plan / Schedule` modes or equivalent accessible subviews.
6. Setup becomes the authoring basis of `Planner / Plan`.
7. Preview becomes the operational basis of `Planner / Schedule`.
8. The existing single Setup draft must remain owned centrally.
9. Switching Planner subviews must not discard that draft.
10. Explicit Save remains.
11. Generate/Regenerate remains explicit.
12. Plan-mode generation preserves save-before-generate.
13. Schedule-mode generation uses saved Active authority as currently governed.
14. Authored edits may make an existing schedule stale.
15. A stale schedule remains visible until explicit regeneration.
16. Preview remains derived even when its UI is absorbed.
17. HistoricalPlan publication semantics remain unchanged.
18. Friction/PlanDecision semantics remain unchanged.
19. current occurrence reporting remains contextual.
20. past planned occurrence reporting remains secondary operational functionality.
21. Report history remains secondary operational functionality.
22. Summary remains separate and read-only.
23. Pattern Library redesign remains deferred.
24. Settings extraction remains deferred.
25. composition-first is the preferred migration.
26. no persistence or authority migration is needed.

---

# 7. Execution Artifact Rules

Before implementation:

1. verify this Task 4.9 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 4.8 result;
   * Phase 4 checkpoint;
   * `CURRENT_STATE.md`;
   * `ROADMAP.md`;
   * `CHANGELOG.md`;
   * `DayFrameApp.tsx`;
   * `SetupScreen.tsx`;
   * `PreviewScreen.tsx`;
   * Setup draft ownership and dirty-state logic;
   * Save Setup handler;
   * Generate Preview handler;
   * Preview regeneration handler;
   * stale-preview behavior;
   * friction/PlanDecision flows;
   * current occurrence reporting;
   * past planned occurrence reporting;
   * Report history;
   * Summary navigation and Summary tests;
   * current responsive/navigation styles;
   * current accessibility/focus tests;
6. do not modify the immutable Task 4.9 artifact during execution.

Create:

`docs/implementation/phase-4/TASK_4.9_PLANNER_CONVERGENCE_V1_COMPOSE_PLAN_AND_SCHEDULE_UNDER_ONE_OPERATIONAL_DESTINATION_RESULT.md`

---

# 8. Initial Implementation Audit

Before editing code, map current app-shell state and handlers.

At minimum identify:

* current top-level destination type/state;
* Setup screen selection;
* Preview screen selection;
* Summary screen selection;
* Setup draft state owner;
* current saved Active state;
* dirty-state computation;
* draft replacement after profile/import/clear;
* save handler;
* generate-from-draft handler;
* regenerate-from-saved handler;
* Preview stale-state source;
* Preview current/no-preview states;
* Summary query isolation.

Confirm convergence can be performed without moving authority ownership into child components.

---

# 9. Top-Level Navigation Goal

Replace the current peer destinations:

```text id="ud1q3q"
Setup
Preview
Summary
```

with:

```text id="p5ovsj"
Planner
Summary
```

Planner is one destination.

Plan and Schedule are internal Planner modes/subviews.

---

# 10. Planner Internal Modes

Introduce a small internal Planner navigation model.

Preferred V1:

```text id="82uexz"
Planner

    Plan
    Schedule
```

Exact terminology may be adjusted only if implementation audit finds a stronger existing product term.

Do not create more internal modes solely to expose every existing section.

---

# 11. Plan Mode

`Planner / Plan` should compose the existing authored Setup workflow.

It should preserve:

* unified Setup draft;
* existing authored inputs;
* validation;
* Save;
* Generate;
* manual-event editing where currently part of authoring;
* profile/import/clear interactions where currently integrated and safe.

Do not change authored domain semantics.

---

# 12. Schedule Mode

`Planner / Schedule` should compose the existing Preview workflow.

It should preserve:

* no-preview state;
* current schedule state;
* stale schedule state;
* explicit regeneration;
* date/day navigation;
* scheduled blocks;
* unplaced work;
* friction;
* suggested fixes;
* current reporting;
* past planned occurrence reporting;
* Report history;
* correction/retraction.

Do not alter schedule-generation semantics.

---

# 13. Planner Shell Ownership

Planner mode/subview state is UI state.

It must not become durable authority.

Default:

* no persistence;
* no Backup representation;
* no store authority field unless the existing app shell requires transient UI state there.

Prefer local/app-shell state consistent with current destination state.

---

# 14. Destination Navigation

Top-level navigation should expose:

```text id="jhz5er"
Planner
Summary
```

Navigation must not:

* save;
* generate;
* regenerate;
* report;
* publish HistoricalPlan;
* mutate authority.

---

# 15. Default Planner Mode

Determine the default internal mode deliberately.

Preferred:

> `Plan`

when entering Planner from a fresh app session or from Summary, unless existing state makes returning to last internal mode clearly better and can be implemented without persistence.

Do not persist last mode solely for convenience.

Record the decision.

---

# 16. Internal Mode Navigation

Plan/Schedule controls must behave as navigation, not commands.

Switching:

```text id="b940s9"
Plan → Schedule
```

must not generate.

Switching:

```text id="utlxw9"
Schedule → Plan
```

must not save or discard draft.

---

# 17. Draft Ownership

Preserve the current single authored draft owner.

Do not create:

* one draft in Plan;
* another draft in Schedule;
* a copied draft when switching modes.

The same Setup draft must survive internal Planner navigation.

---

# 18. Dirty-State Preservation

If the user edits Plan and switches to Schedule:

* draft remains dirty;
* saved Active remains unchanged;
* existing derived schedule remains unchanged;
* existing schedule may be marked stale according to current semantics;
* no implicit save occurs;
* no implicit regeneration occurs.

Mandatory regression.

---

# 19. Schedule Staleness

Preserve the existing model:

```text id="me21xp"
authored draft/saved Setup changes
        ↓
existing Preview may become stale
        ↓
old schedule remains visible
        ↓
explicit Regenerate required
```

Planner convergence must not turn Schedule into a live-reactive projection of unsaved draft state.

---

# 20. Save Semantics

Retain explicit authored save.

The visible product label may remain:

> Save Setup

or may become:

> Save Plan

or:

> Save Changes

only if the audit establishes that the new label remains truthful across all authored Setup content.

Do not change semantics merely for naming.

If renamed, document exact mapping.

---

# 21. Save Without Generate

Saving Plan must not automatically generate unless existing semantics already couple those actions through the specific Generate flow.

The user must remain able to:

```text id="z7qjbl"
edit
→ Save
→ later Generate/Regenerate
```

---

# 22. Generate From Plan

Preserve the existing save-before-generate behavior.

Conceptually:

```text id="bmd7en"
Planner / Plan
    edit draft
    ↓
Generate
    ↓
validate
    ↓
save authored state
    ↓
generate derived schedule
    ↓
Planner / Schedule
```

If generation currently navigates after success, preserve that coherent product flow.

---

# 23. Generate Failure

If save or generation fails:

* remain in a truthful state;
* do not pretend Schedule has updated;
* preserve draft where possible;
* preserve existing error semantics.

Do not lose authored work.

---

# 24. Schedule No-Preview State

`Planner / Schedule` must be accessible even when no Preview exists.

It should show the existing truthful no-preview state and offer explicit generation.

Navigation itself does not generate.

---

# 25. Regenerate From Schedule

Preserve the current Schedule/Preview regeneration path.

If current semantics regenerate from saved Active rather than unsaved Plan draft, keep that distinction.

Do not silently pull unsaved Plan changes into Schedule regeneration unless existing behavior does so.

---

# 26. Unsaved Draft + Schedule Regeneration

This edge case must be audited and explicitly tested.

If Plan contains unsaved draft changes and the user enters Schedule, then clicks Regenerate:

determine the existing governed behavior.

Preferred preservation:

* Schedule-mode regeneration operates on saved Active;
* unsaved Plan draft remains unsaved;
* the UI must not imply unsaved draft was incorporated.

If this is already governed differently, preserve the actual existing rule.

Do not invent new draft synchronization.

---

# 27. Generate/Regenerate Naming

Inside Planner, product language should make the operation clear.

Possible direction:

```text id="dw3kyv"
Generate Schedule
Regenerate Schedule
```

while the internal domain object remains Preview.

However, do not change product wording if it creates inconsistency with stale-preview semantics or existing documentation.

Audit and decide.

---

# 28. Preview Terminology Retirement

Top-level `Preview` should disappear as a destination after successful convergence.

Internal user-facing copy may still use:

* schedule preview;
* generated preview;

where needed to truthfully communicate derived status.

Do not mechanically replace every occurrence of the word Preview.

---

# 29. Setup Terminology Retirement

Top-level `Setup` should disappear as a destination after convergence.

Internal section labels may retain:

* Schedule preferences;
* Setup details;

where truthful.

Do not mechanically rename every Setup-related internal concept to Plan.

---

# 30. Planner Heading

Planner should have a clear destination-level heading.

Plan and Schedule should be subordinate modes.

Heading hierarchy must remain semantic.

---

# 31. Plan Mode Heading

Use a clear heading indicating authored planning work.

Potential:

> Plan

or a more specific internal heading if needed.

Do not expose implementation language such as `SetupScreen`.

---

# 32. Schedule Mode Heading

Use:

> Schedule

or another product-appropriate term.

Make derived/stale status visible in the Schedule content rather than hiding it behind the name.

---

# 33. Shared Planner Action Area

Task 4.8 proposed a shared Planner shell/action bar.

Implement only if it reduces duplication without obscuring mode semantics.

Possible shared actions:

* Save when Plan is active;
* Generate when Plan is active;
* Regenerate when Schedule is active.

Do not create a dense universal action bar containing irrelevant controls in both modes.

---

# 34. Add Commitment Access

Planner V1 must make existing add-commitment functionality reachable under Plan.

This may reuse the existing Setup authoring sections.

Do not invent a new commitment creation model.

---

# 35. Edit Commitment Access

Existing commitment editing must remain reachable under Plan.

Do not move editing into Schedule unless existing functionality already supports it.

Inline schedule editing remains deferred.

---

# 36. Manual Events

Audit current manual-event add/edit behavior.

Keep it reachable within Planner through the existing authoring/schedule-detail paths.

Do not redesign manual-event semantics.

---

# 37. Structural Preferences

Keep existing structural preferences available during Planner V1 even if Task 4.8 classifies some as future Settings candidates.

Do not hide or remove:

* day boundary;
* week start;
* shifts/cycles;
* profiles;
* backup/recovery

merely because they may later move.

Planner V1 prioritizes convergence over Settings extraction.

---

# 38. Avoid Plan Dumping

Even though existing SetupScreen may be reused, avoid presenting Planner as:

> a renamed giant Setup page

if a minimal wrapper/hierarchy can make the authoring intent clearer.

Do not perform broad restructuring.

Composition first.

---

# 39. Schedule Review

Preserve the complete existing Preview schedule-review capability.

No loss of:

* dates;
* blocks;
* day visualization;
* work blocks;
* manual events;
* life blocks;
* unplaced candidates;
* statuses.

---

# 40. Friction

Preserve existing friction detection/presentation and suggested-fix acceptance.

Planner convergence must not:

* recompute friction differently;
* bypass PlanDecision;
* alter replay;
* alter removal/retry semantics.

---

# 41. Friction Location

Friction remains operational Schedule content.

Do not move friction into Summary.

---

# 42. Current Reporting

Preserve contextual Report outcome controls attached to current schedule occurrences.

This remains a Schedule responsibility.

---

# 43. Past Planned Occurrence Reporting

Preserve:

> Report a past planned occurrence

as secondary operational functionality under Planner.

Do not promote it to top-level navigation.

A disclosure/panel below Schedule is acceptable if that matches existing composition.

---

# 44. Report History

Preserve:

> Report history

as secondary operational functionality.

Correction and retraction remain governed ExecutionHistory writes.

Do not move them into Summary.

---

# 45. Secondary Panels

Past reporting and Report history may remain visually secondary to Schedule review.

Do not bury them to the point of becoming inaccessible.

---

# 46. Summary Preservation

Summary must remain independently reachable as the second top-level destination.

Task 4.9 should not materially change:

* HistoricalPlan coverage;
* Scheduling realization;
* Scheduled outcomes;
* reporting coverage;
* evidence drill-down;
* read-only semantics.

---

# 47. Summary State

Planner navigation must not reset or mutate historical Summary authority.

Transient Summary selected-range state may behave according to current implementation.

Do not add cross-surface persistence.

---

# 48. Read/Write Boundary

After convergence:

```text id="1p5d8m"
Planner
    read/write operational surface

Summary
    read-only analytical surface
```

This should become clearer than before.

---

# 49. Authority Model

Do not change:

```text id="1iu2bs"
Active
Profiles
PlanDecision
HistoricalPlan
ExecutionHistory
```

Preview remains derived.

Planner is presentation/workflow composition only.

---

# 50. HistoricalPlan Publication

Generating a fresh schedule continues to publish HistoricalPlan exactly according to existing rules.

Planner itself does not add a new publication step.

---

# 51. ExecutionHistory

Reporting/correction/retraction continue through existing APIs.

No new execution semantics.

---

# 52. Backup V3

No changes.

Planner mode/subview state is not backed up.

---

# 53. Restore

No Planner-specific restore payload.

After restore:

* authored authority appears in Plan;
* derived Schedule behaves according to existing post-restore Preview semantics;
* reporting/history authority appears through existing operational panels;
* Summary derives restored history normally.

---

# 54. Full Clear

Full clear must leave Planner in a truthful cleared state.

At minimum:

* authored state cleared/default according to existing contract;
* Schedule absent/cleared;
* profiles/history/decisions cleared;
* secondary reporting/history panels empty;
* Planner remains navigable;
* Summary reflects cleared history.

---

# 55. Profiles

Profile save/load/delete behavior must remain functional.

If profile controls currently live inside Setup, preserve them under Plan for V1.

Do not extract to Settings in this task.

---

# 56. Profile Load

Loading a profile currently replaces authored setup and clears Preview.

Planner must preserve that behavior.

After profile load:

* Plan reflects loaded draft/state;
* Schedule reflects no current schedule according to current semantics;
* no stale pre-profile schedule remains.

Mandatory regression.

---

# 57. Backup Import

Import/replacement behavior must remain reachable and preserve existing clear/replace semantics.

Do not redesign import UX.

---

# 58. Clear Local Data

Full-clear action remains reachable where currently appropriate.

Do not duplicate it into Schedule.

---

# 59. Pattern Library

No new Pattern Library destination.

Existing reusable templates/profiles remain contextual.

Do not implement Pattern Library redesign.

---

# 60. Navigation Accessibility

Top-level:

```text id="ubhl2n"
Planner
Summary
```

must be keyboard accessible and expose active destination state.

Planner subviews:

```text id="5g8ngl"
Plan
Schedule
```

must also be semantic controls with active/selected state.

Use appropriate navigation or tab semantics consistent with implementation.

---

# 61. Subview Semantics

If Plan/Schedule behave like tabs:

* use accessible tab semantics correctly;
* ensure associated panels are labelled.

If they behave like ordinary subnavigation:

* use navigation/button semantics appropriately.

Do not style buttons as tabs without semantics.

---

# 62. Focus on Top-Level Navigation

Navigating to Planner or Summary should follow existing focus behavior.

Do not cause focus to jump unpredictably.

If current shell leaves focus on the nav control, preserve unless a consistent heading-focus convention already exists.

---

# 63. Focus on Planner Mode Change

Switching Plan/Schedule should make the new mode discoverable to keyboard/screen-reader users.

Use minimal local focus/announcement behavior consistent with existing patterns.

Avoid forced focus jumps for pointer users where practical.

---

# 64. Dirty Draft Warning

Audit whether switching away from Planner to Summary while Plan is dirty currently loses draft.

It must not.

The unified draft should survive top-level navigation as it currently survives Setup/Preview navigation.

Mandatory regression.

---

# 65. No Navigation Confirmation Modal

Do not add a save/discard modal solely for switching Planner modes or visiting Summary if current draft architecture safely preserves the draft.

Only introduce confirmation if current behavior genuinely risks destructive loss.

---

# 66. Browser Reload

Preserve current reload/persistence semantics.

Unsaved draft may remain transient according to current architecture.

Do not invent draft persistence in Task 4.9.

---

# 67. Responsive Planner

Planner V1 must remain usable at supported narrow/mobile widths.

The Plan/Schedule mode pattern should prevent a giant interleaved page.

Do not combine both full Setup and full Preview into one continuous mobile document.

---

# 68. Mobile Mode Navigation

Plan/Schedule controls must remain easy to reach and understand on narrow screens.

Avoid horizontally overflowing subnavigation.

---

# 69. Mobile Plan

Existing Setup cards/forms should retain responsive behavior.

Do not redesign forms broadly.

---

# 70. Mobile Schedule

Existing Preview cards/lists should retain responsive behavior.

Secondary reporting panels must remain reachable without creating an unusable hierarchy.

---

# 71. No Desktop-Only Planner

Planner convergence is incomplete if it only works coherently at desktop widths.

---

# 72. Performance

Composition should not cause both Plan and Schedule trees to perform expensive work when inactive if current architecture permits unmounting/inactive rendering.

Audit.

Avoid prematurely optimizing unless duplicate work is observed.

---

# 73. Inactive Subview Rendering

Choose deliberately whether inactive Plan/Schedule content:

* remains mounted;
* unmounts.

Draft ownership must not depend on SetupScreen remaining mounted.

If unmounting SetupScreen loses local UI state that matters, preserve or lift only the necessary state.

Document the decision.

---

# 74. Local Component State Audit

Audit SetupScreen and PreviewScreen for local state that would be lost on mode switching.

Classify:

### Safe to reset

UI-only ephemeral state.

### Must survive mode switch

state required for coherent unfinished user interaction.

Lift only what must survive.

Do not move all child state into the store.

---

# 75. Draft-State Source of Truth

Authored draft remains the central source of truth for unsaved Plan changes.

Do not reconstruct it from form fields on remount if a shared draft already exists.

---

# 76. Preview Local State

Day/date selection and disclosure state may reset if current navigation already resets them and that behavior is acceptable.

Do not make them durable just for convergence.

---

# 77. Planner Mode State

Mode state may reset to default on reload.

No persistence required.

---

# 78. No Router

Do not introduce URL routing.

Top-level and internal destination state may remain application-local.

---

# 79. No Deep Links

Do not add deep-link support for Plan/Schedule sections in V1.

---

# 80. No Autosave

Explicit Save remains.

---

# 81. No Drag/Drop

Do not introduce direct block dragging.

---

# 82. No Inline Schedule Editing Expansion

Do not add new editing behavior inside Schedule merely because Planner now exists.

---

# 83. No Recommendation Integration

Summary insights do not automatically appear as Planner recommendations.

---

# 84. No Historical Intelligence in Planner

Do not embed Scheduling Realization or Scheduled Outcomes into Planner.

Summary remains their home.

---

# 85. No Goals / Progress

Do not add future Summary/Planner concepts.

---

# 86. No Settings Destination

Structural preferences remain where they are for V1.

A later task may extract Settings.

---

# 87. No Pattern Library Redesign

Explicitly deferred.

---

# 88. No Generic Workspace Framework

Do not build a generalized multi-workspace navigation framework.

Implement Planner/Summary only.

---

# 89. UI Copy Audit

Update product copy only where necessary to support the new hierarchy.

At minimum audit:

* Setup heading;
* Preview heading;
* Save Setup;
* Generate Preview;
* Regenerate Preview;
* stale Preview copy;
* no Preview copy.

Prefer user-facing coherence while preserving truth.

---

# 90. Schedule vs Preview Wording

Task 4.9 may use:

> Schedule

as the Planner subview while still explaining that it is a generated/derived schedule preview.

Do not accidentally imply a durable finalized calendar.

---

# 91. Stale Copy

Potential conceptual refinement:

> Plan changed. Regenerate the schedule to see updates.

This may be clearer inside Planner than:

> Setup changed. Generate a new preview...

But any copy change must preserve exact semantics.

Do not change wording solely for aesthetics without tests.

---

# 92. Plan Copy

If `Save Setup` remains inside Planner, assess whether it creates awkward product language.

A bounded rename is authorized if:

* behavior remains identical;
* tests are updated intentionally;
* governance records terminology change.

---

# 93. Generation Copy

Likewise, Generate/Regenerate naming may be refined for the Planner context.

Do not rename domain functions.

---

# 94. Empty Schedule State

When no generated schedule exists, Schedule should tell the user what to do.

Example concept:

> No generated schedule yet. Generate one from your saved plan.

If unsaved draft semantics complicate this, explain accurately.

---

# 95. Operational Status

Planner may expose concise status such as:

* Unsaved changes;
* Schedule current;
* Schedule out of date;
* No generated schedule.

Do not create a new persistent status model.

Use existing derived state.

---

# 96. No False Synchronization

Never display:

> Schedule up to date

if unsaved or saved authored changes mean the existing Preview is stale according to current semantics.

---

# 97. Plan/Schedule Cross-Cues

A small cross-cue is allowed.

Examples:

* Plan has unsaved changes.
* Schedule is out of date.
* Generate updated schedule.

Do not create new analytical logic.

---

# 98. Testing Strategy

Use staged behavioral tests.

At minimum cover:

### Shell/navigation

* top-level only Planner/Summary;
* Plan/Schedule subviews;
* active states;
* no mutation from navigation.

### Draft

* edit in Plan;
* switch Schedule;
* switch back;
* draft survives;
* switch Summary;
* return;
* draft survives.

### Save

* explicit Save behavior unchanged.

### Generate

* Plan generate saves then generates;
* success opens Schedule;
* failure preserves truthful state.

### Schedule navigation

* entering Schedule does not generate.

### No schedule

* Schedule available and exposes Generate.

### Stale schedule

* edits stale old schedule;
* navigating Schedule preserves old output;
* explicit Regenerate updates.

### Friction

* suggested fixes remain available;
* PlanDecision behavior unchanged.

### Reporting

* current Report outcome;
* past planned occurrence;
* Report history;
* correction;
* retraction.

### Summary

* remains reachable/read-only;
* projections unchanged.

### profiles/import/clear

* profile load;
* clear;
* relevant replacement behavior.

### accessibility/mobile

* Planner/Summary nav;
* Plan/Schedule mode controls;
* focus;
* narrow layout.

---

# 99. Do Not Rewrite All Tests

Update tests deliberately around changed navigation and hierarchy.

Reuse existing Setup/Preview behavioral tests where possible.

Do not weaken detailed assertions to simplify migration.

---

# 100. Planner Integration Tests

Add focused tests at the app-shell level proving the composition.

These should complement rather than replace existing SetupScreen and PreviewScreen tests.

---

# 101. Draft Survival Test

Mandatory scenario:

```text id="m2dv6h"
Planner / Plan
→ modify draft
→ Planner / Schedule
→ Summary
→ Planner / Plan
```

Expected:

* draft still contains modification;
* no implicit save;
* no implicit generation.

---

# 102. Generate Flow Test

Mandatory:

```text id="zpzcp8"
Planner / Plan
→ edit valid draft
→ Generate
```

Expected:

* authored save happens;
* Preview generation happens;
* Planner switches to Schedule;
* generated output represents saved authored state.

---

# 103. No-Implicit-Generate Test

Mandatory:

```text id="2oggaw"
Planner / Plan
→ Planner / Schedule
```

Expected:

* generation call count unchanged.

---

# 104. Stale Schedule Test

Mandatory:

1. generate schedule;
2. modify authored Plan;
3. switch Schedule;
4. old schedule remains;
5. stale notice shown;
6. explicit Regenerate required.

---

# 105. Unsaved Regeneration Test

Mandatory if current semantics distinguish saved Active from dirty draft.

Prove Schedule regeneration does not accidentally consume unsaved Plan state.

---

# 106. Profile Load Test

Mandatory:

1. have existing schedule;
2. load profile;
3. authored Plan replaced;
4. Preview/Schedule cleared according to current semantics;
5. Planner remains coherent.

---

# 107. Reporting Integration Test

Verify operational reporting still works within Planner / Schedule.

Do not require navigating to a separate old Preview destination.

---

# 108. Report History Integration Test

Verify correction/retraction remains reachable under Planner.

---

# 109. Summary Isolation Test

Planner edits/navigation must not mutate Summary historical projection authority.

---

# 110. Full Clear Integration Test

After full clear:

* Planner still renders;
* Plan reflects cleared/default state;
* Schedule has no stale prior schedule;
* reporting panels do not expose prior history;
* Summary reflects cleared history.

---

# 111. Accessibility Test

Where supported:

* `Planner` and `Summary` accessible top-level controls;
* active destination exposed;
* `Plan` and `Schedule` internal controls accessible;
* selected mode exposed;
* no inaccessible clickable containers;
* headings coherent;
* generation action accessible.

---

# 112. Focus Test

Test internal mode switching behavior where current stack supports it.

Do not require complex focus transfer if current product convention does not.

At minimum the newly selected mode must be discoverable through semantic selected state and heading structure.

---

# 113. Responsive Verification

Automated/manual as supported:

* desktop Planner / Plan;
* desktop Planner / Schedule;
* narrow Planner / Plan;
* narrow Planner / Schedule;
* long Setup content;
* long schedule/reporting content;
* Summary unaffected.

---

# 114. Manual Product Walkthrough

Where browser verification is supported, perform:

### Journey A — Add/Edit

```text id="esnr5l"
Planner
→ Plan
→ edit commitment
→ Save
```

### Journey B — Generate

```text id="0ecg47"
Planner
→ Plan
→ Generate
→ Schedule
```

### Journey C — Switch Without Generating

```text id="7xrxmw"
Plan
→ Schedule
```

Verify no implicit generation.

### Journey D — Stale Schedule

```text id="o2f1au"
Generate
→ Plan
→ edit
→ Schedule
→ stale
→ Regenerate
```

### Journey E — Friction

```text id="6a6zxp"
Planner / Schedule
→ inspect friction
→ apply suggested fix
```

### Journey F — Current Reporting

```text id="8dy61f"
Planner / Schedule
→ occurrence
→ Report outcome
```

### Journey G — Past Reporting

```text id="z0lstp"
Planner / Schedule
→ Report a past planned occurrence
```

### Journey H — Correction

```text id="58ne1u"
Planner / Schedule
→ Report history
→ Correct / Withdraw
```

### Journey I — Reflection

```text id="rncrse"
Summary
→ inspect Planning + Execution history
```

### Journey J — Dirty Draft Navigation

```text id="d7zl97"
Planner / Plan
→ edit
→ Summary
→ Planner / Plan
```

Verify unsaved draft preserved.

Record only what was actually checked.

---

# 115. Required Navigation Matrix

Produce:

| Level                 | Before                   | After                       | Mutates authority? |
| --------------------- | ------------------------ | --------------------------- | -----------------: |
| top-level operational | Setup / Preview          | Planner                     |                    |
| top-level analytical  | Summary                  | Summary                     |                    |
| Planner authored      | Setup destination        | Plan mode                   |                    |
| Planner schedule      | Preview destination      | Schedule mode               |                    |
| generation            | command in Setup/Preview | explicit command in Planner |                    |

---

# 116. Required State Ownership Matrix

Produce:

| State                  | Owner before | Owner after | Durable? |
| ---------------------- | ------------ | ----------- | -------: |
| top-level destination  |              |             |          |
| Planner mode           | n/a          |             |          |
| Setup draft            |              |             |          |
| dirty state            |              |             |          |
| saved Active           |              |             |          |
| Preview                |              |             |          |
| stale status           |              |             |          |
| Summary selected range |              |             |          |

---

# 117. Required Plan/Schedule Matrix

Produce:

| Capability                  | Plan | Schedule |
| --------------------------- | ---: | -------: |
| edit authored commitments   |      |          |
| edit structural preferences |      |          |
| Save                        |      |          |
| Generate                    |      |          |
| Regenerate                  |      |          |
| review schedule             |      |          |
| resolve friction            |      |          |
| Report outcome              |      |          |
| report past occurrence      |      |          |
| Report history              |      |          |

Use:

* primary;
* contextual;
* absent;
* secondary.

---

# 118. Required Authority Matrix

Produce:

| Concern             | Planner V1 effect |
| ------------------- | ----------------- |
| Active              |                   |
| Profiles            |                   |
| PlanDecision        |                   |
| Preview             |                   |
| HistoricalPlan      |                   |
| ExecutionHistory    |                   |
| Summary projections |                   |
| Backup V3           |                   |
| restore             |                   |
| full clear          |                   |

---

# 119. Required Workflow Preservation Matrix

Produce:

| Existing behavior           | Preserved? | New location | Notes |
| --------------------------- | ---------: | ------------ | ----- |
| unified draft               |            |              |       |
| save                        |            |              |       |
| save-before-generate        |            |              |       |
| no implicit generation      |            |              |       |
| stale Preview               |            |              |       |
| regenerate                  |            |              |       |
| friction fixes              |            |              |       |
| current reporting           |            |              |       |
| past planned reporting      |            |              |       |
| correction/retraction       |            |              |       |
| profile load clears Preview |            |              |       |
| full clear                  |            |              |       |
| Summary read-only           |            |              |       |

---

# 120. Required Responsive/Accessibility Matrix

Produce:

| Concern                     | V1 behavior | Validation |
| --------------------------- | ----------- | ---------- |
| Planner/Summary navigation  |             |            |
| Plan/Schedule subnavigation |             |            |
| active/selected semantics   |             |            |
| keyboard generation         |             |            |
| dirty draft navigation      |             |            |
| narrow Plan layout          |             |            |
| narrow Schedule layout      |             |            |
| focus/heading structure     |             |            |

---

# 121. Required Product-Boundary Matrix

Produce:

| Capability                        | Task 4.9 |
| --------------------------------- | -------- |
| Planner destination               |          |
| Plan subview                      |          |
| Schedule subview                  |          |
| Setup/Preview composition         |          |
| explicit Save                     |          |
| explicit Generate/Regenerate      |          |
| stale schedule                    |          |
| schedule review                   |          |
| friction                          |          |
| current reporting                 |          |
| past reporting                    |          |
| Report history                    |          |
| Summary                           |          |
| Settings extraction               |          |
| Pattern Library redesign          |          |
| inline schedule editing expansion |          |
| drag/drop                         |          |
| autosave                          |          |
| router                            |          |
| new Historical Intelligence       |          |
| Goals/Progress                    |          |
| Recommendations                   |          |
| learning                          |          |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited by task.

---

# 122. Required Architectural Invariant Assessment

Classify at least:

1. Planner and Summary are the only top-level product destinations.
2. Planner is operational.
3. Summary remains analytical/read-only.
4. Plan and Schedule are internal Planner modes.
5. Mode navigation does not mutate authority.
6. Plan/Schedule navigation does not generate.
7. top-level Planner/Summary navigation does not generate.
8. unified authored draft remains centrally owned.
9. dirty draft survives Plan/Schedule switching.
10. dirty draft survives Planner/Summary switching.
11. explicit Save remains.
12. Save does not automatically generate.
13. Plan Generate preserves save-before-generate.
14. successful Generate opens Schedule.
15. Schedule Regenerate preserves existing saved-state semantics.
16. unsaved draft is not silently consumed by Schedule Regenerate if existing semantics exclude it.
17. Preview remains derived.
18. Schedule may display stale derived output.
19. stale output remains visible until explicit regeneration.
20. no schedule state remains navigable/truthful.
21. authored commitment editing remains available.
22. manual-event editing remains available.
23. structural preferences remain available.
24. profile behavior remains available.
25. profile load preserves current replace/clear semantics.
26. schedule review remains functionally equivalent.
27. friction/PlanDecision semantics remain unchanged.
28. contextual reporting remains available.
29. past planned occurrence reporting remains available.
30. Report history remains available.
31. correction/retraction semantics remain unchanged.
32. reporting remains operational write.
33. Summary remains separate from reporting writes.
34. Summary Historical Intelligence is unchanged.
35. HistoricalPlan authority is unchanged.
36. HistoricalPlan publication semantics are unchanged.
37. ExecutionHistory authority is unchanged.
38. Active authority is unchanged.
39. Profiles authority is unchanged.
40. PlanDecision authority is unchanged.
41. Backup V3 is unchanged.
42. restore is unchanged.
43. full-clear semantics are unchanged.
44. no Planner state is persisted.
45. no persistence schema changes.
46. no durable Planner ID is introduced.
47. no new domain event is introduced.
48. no router is introduced.
49. no deep links are introduced.
50. no autosave is introduced.
51. no drag/drop is introduced.
52. no full Settings extraction is performed.
53. no Pattern Library redesign occurs.
54. no new Historical Intelligence is introduced.
55. no Capacity semantics are introduced.
56. no Goal semantics are introduced.
57. no Progress semantics are introduced.
58. no Recommendation semantics are introduced.
59. no learning behavior is introduced.
60. Planner/Summary top-level navigation is keyboard accessible.
61. Plan/Schedule mode selection is keyboard accessible.
62. active/selected state is semantically exposed.
63. generation/regeneration actions remain keyboard accessible.
64. Planner headings remain coherent.
65. mobile Plan remains usable.
66. mobile Schedule remains usable.
67. inactive mode rendering does not lose required state.
68. local ephemeral state is not unnecessarily promoted to authority.
69. no accidental duplicate generation occurs from composition.
70. existing detailed Setup/Preview tests remain meaningful rather than being discarded.

Use:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Unsupported;
* Stop-condition violation.

---

# 123. Stop Conditions

Stop and report if:

* shared draft cannot survive Plan/Schedule switching without redesigning authored-state ownership;
* SetupScreen cannot be composed without losing required local state and fixing it requires broad state migration;
* PreviewScreen cannot be composed without changing schedule semantics;
* top-level Setup/Preview removal breaks essential workflows that cannot be represented inside Planner V1;
* Schedule regeneration semantics become ambiguous in the presence of dirty Plan draft and cannot be preserved;
* stale Preview semantics cannot be retained;
* profile load/import/full clear behavior becomes unsafe under composition;
* friction workflows require engine/domain changes;
* reporting workflows require authority changes;
* Summary must become writable;
* Planner convergence requires a persistence migration;
* Planner convergence requires Backup V3 changes;
* Planner convergence requires HistoricalPlan/ExecutionHistory schema changes;
* router adoption becomes necessary;
* mobile composition cannot remain usable without a broad redesign;
* current test coverage is insufficient to safely preserve draft/generation/reporting behaviors.

Do not force convergence by weakening established semantics.

---

# 124. Files and Placement

Follow current application organization.

Likely production changes may involve:

```text id="pup2du"
DayFrameApp.tsx
new Planner shell/component
SetupScreen.tsx only where composition needs small interface changes
PreviewScreen.tsx only where composition needs small interface changes
navigation styles
Planner styles
```

Likely tests:

```text id="p8v4k1"
DayFrameApp.test.tsx
Planner-specific integration tests if created
SetupScreen tests
PreviewScreen tests
responsive/accessibility tests where existing
```

Avoid unnecessary low-level changes.

---

# 125. New Planner Component

A bounded component such as:

```text id="p0dyui"
PlannerScreen
```

or:

```text id="78grrj"
PlannerWorkspace
```

is appropriate if it:

* owns only composition/subview UI;
* receives draft/handlers from the existing app state owner;
* does not become authority.

Do not move the entire store into it.

---

# 126. Component Interfaces

Prefer explicit props/handlers consistent with current component architecture.

Do not introduce a new global context solely for Planner.

---

# 127. Dead-Code Assessment

After convergence, audit whether old top-level Setup/Preview navigation code is unreachable.

Remove only clearly obsolete shell/nav code.

Do not remove SetupScreen or PreviewScreen if Planner composes them.

Do not perform unrelated cleanup.

---

# 128. Governance

On successful completion update minimally:

* Task 4.9 result;
* Phase 4 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

A product-architecture ADR may be appropriate because `Planner / Summary` becomes an implemented top-level product model.

Create one only if consistent with repository ADR conventions.

If created, it should record:

> Planner owns operational planning; Summary owns derived understanding.

Do not use the ADR to redefine domain authority.

---

# 129. Validation Sequence

Follow Task 4.8's recommended staged validation:

1. shell/navigation;
2. draft/save;
3. generation/stale schedule;
4. schedule review;
5. friction/decisions;
6. reporting/history;
7. profiles/import/clear;
8. Summary isolation;
9. mobile/accessibility;
10. full repository validation.

---

# 130. Focused Validation

Run targeted suites after each major migration boundary where practical.

At minimum final focused validation should cover:

* app shell;
* Setup authoring;
* Preview schedule;
* friction;
* reporting;
* report history;
* Summary navigation.

Record exact counts.

---

# 131. Full Validation

Before completion run:

```bash id="jrb234"
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Record:

* test-file count;
* test count;
* module count;
* build advisory;
* diff result.

Do not claim validation not actually performed.

---

# 132. Required Result Artifact

Create:

`docs/implementation/phase-4/TASK_4.9_PLANNER_CONVERGENCE_V1_COMPOSE_PLAN_AND_SCHEDULE_UNDER_ONE_OPERATIONAL_DESTINATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 4.8 Prerequisite Confirmation
4. Initial Implementation Audit
5. Files Changed
6. Planner Component Placement
7. Navigation Before/After
8. Planner/Summary Top-Level Boundary
9. Planner Internal Modes
10. Default Planner Mode
11. Plan Composition
12. Schedule Composition
13. Draft Ownership
14. Dirty-State Preservation
15. Save Semantics
16. Generate-From-Plan
17. Generate Failure
18. Schedule No-Preview State
19. Regenerate-From-Schedule
20. Unsaved-Draft Regeneration Semantics
21. Stale Schedule
22. Preview/Setup Terminology
23. Planner Heading Hierarchy
24. Shared Actions
25. Add Commitment Access
26. Edit Commitment Access
27. Manual Events
28. Structural Preferences
29. Schedule Review
30. Friction
31. Contextual Reporting
32. Past Planned Reporting
33. Report History
34. Correction/Retraction
35. Summary Preservation
36. Read/Write Boundary
37. Authority Model
38. HistoricalPlan Boundary
39. ExecutionHistory Boundary
40. Profiles
41. Profile Load
42. Backup Import
43. Full Clear
44. Pattern Library Boundary
45. Planner Mode State
46. Local Component State
47. Inactive Mode Rendering
48. Responsive Behavior
49. Accessibility
50. Focus Behavior
51. Performance
52. Persistence/Backup/Restore
53. Dead-Code Assessment
54. Tests Added/Changed
55. Staged Validation
56. Focused Validation
57. Full Validation
58. Manual Product Walkthrough
59. Governance Updates
60. Deviations
61. Discoveries
62. Deferred Work
63. Navigation Matrix
64. State Ownership Matrix
65. Plan/Schedule Matrix
66. Authority Matrix
67. Workflow Preservation Matrix
68. Responsive/Accessibility Matrix
69. Product-Boundary Matrix
70. Architectural Invariant Assessment
71. Stop-Condition Assessment
72. Architectural Alignment Assessment
73. Recommended Next Task
74. Final Completion Determination

---

# 133. Completion Criteria

Task 4.9 is complete only when:

* Task 4.8's Planner-readiness findings are confirmed against current production source;
* top-level product navigation is reduced to Planner and Summary;
* Setup and Preview are no longer separate top-level product destinations;
* Planner contains accessible Plan and Schedule internal modes or an equivalent bounded subview model;
* Plan reuses the existing authored Setup workflow rather than introducing parallel authored state;
* Schedule reuses the existing Preview operational workflow rather than introducing parallel schedule semantics;
* the unified authored draft remains centrally owned and survives Plan/Schedule switching;
* dirty draft survives navigation from Planner to Summary and back;
* internal Planner mode navigation never implicitly saves, generates, regenerates, or mutates authority;
* explicit Save remains available;
* Save does not implicitly generate;
* Generate from Plan preserves existing validation and save-before-generate semantics;
* successful Plan generation opens or refreshes Schedule;
* generation failure does not destroy draft or falsely update Schedule;
* Schedule remains accessible when no generated Preview exists;
* entering Schedule does not generate;
* Regenerate remains an explicit Schedule action;
* Schedule regeneration preserves the existing relationship to saved Active authority and does not silently consume unsaved Plan draft unless that is already the governed behavior;
* authored changes can stale an existing Schedule;
* stale generated output remains visible with truthful stale-state messaging until explicit regeneration;
* Preview remains derived despite being presented as Schedule;
* add/edit commitment access remains available;
* manual-event authoring/editing remains available;
* structural scheduling preferences remain reachable even though later Settings extraction is deferred;
* profile save/load/delete remains functional;
* profile load continues replacing authored setup and clearing Preview/Schedule according to current semantics;
* schedule review functionality is preserved;
* friction/suggested-fix/PlanDecision behavior is preserved;
* contextual current occurrence reporting is preserved within Schedule;
* reporting against frozen past planned occurrences remains available as secondary Planner functionality;
* Report history, correction, and retraction remain available as secondary Planner functionality;
* Summary remains an independent top-level destination;
* Summary remains read-only;
* existing Historical Intelligence projections and their authority semantics remain unchanged;
* Planner composition changes no Active, Profiles, PlanDecision, HistoricalPlan, ExecutionHistory, Preview, Backup V3, restore, or full-clear semantics;
* Planner mode/subview state remains non-durable UI state;
* no new persistence schema, Backup payload, durable identifier, domain event, router, deep link, autosave, drag/drop, full Settings extraction, Pattern Library redesign, Historical Intelligence metric, Capacity model, Goal, Progress model, Recommendation, or learning behavior is introduced;
* Planner/Summary and Plan/Schedule navigation remain keyboard accessible;
* active/selected destination and mode state are semantically exposed;
* generation/regeneration actions remain accessible;
* heading hierarchy remains coherent;
* required draft state is not lost because an inactive subview unmounts;
* ephemeral child state is not unnecessarily promoted into authority;
* narrow/mobile Plan and Schedule remain usable without combining both full surfaces into one long page;
* existing Setup and Preview behavioral coverage remains meaningful and detailed rather than being discarded;
* focused integration tests prove draft survival, no implicit generation, save-before-generate, successful generation, stale schedule, regeneration, friction, reporting, correction/retraction, profile replacement, full clear, and Summary isolation;
* staged validation is recorded;
* canonical lint, typecheck, full tests, build, and diff validation pass;
* supported manual product walkthrough is recorded;
* governance accurately records Planner / Summary as the implemented top-level product model while keeping Phase 4 and deferred Learn work truthful;
* no unresolved stop condition remains.

---

# 134. Recommended Next Task

Do **not** pre-authorize another large feature.

If Task 4.9 completes successfully, the next task should be a bounded **Planner V1 product review and convergence audit**.

Likely:

> **Task 4.10 — Planner V1 UX, Responsibility, and Regression Audit**

It should evaluate the newly implemented Planner as a real surface before deciding whether the next move is:

* deeper Planner contextual editing;
* Settings extraction;
* Pattern Library contextualization;
* further Historical Intelligence;
* or another Phase 4 roadmap boundary.

---

# 135. Final Implementation Principle

> **Planner should hide the history of how DayFrame was built without changing the truth of how DayFrame works.**

Setup and Preview became separate because the product grew incrementally.

Planner V1 should give users one coherent operational destination while preserving the carefully governed draft, schedule, friction, reporting, persistence, and historical-authority semantics underneath.

---

# 136. Final Completion Statement

**Task 4.9 is complete when DayFrame implements its first truthful Planner surface by replacing Setup and Preview as separate top-level destinations with one operational Planner destination containing bounded Plan and Schedule modes while preserving Summary as an independent read-only analytical destination; when the existing unified authored draft remains centrally owned and survives Planner mode switching and Planner/Summary navigation without implicit save or loss; when Plan composes the existing authored Setup workflow and Schedule composes the existing derived Preview workflow rather than creating parallel domain or UI authority; when Save remains explicit, Plan generation preserves current validation and save-before-generate semantics, Schedule navigation never implicitly generates, Regenerate remains explicit, unsaved Plan draft is not silently incorporated into Schedule regeneration contrary to existing rules, and stale generated output remains visible and truthfully marked until explicit regeneration; when add/edit commitments, manual events, structural preferences, profile behavior, schedule review, friction, suggested fixes, contextual current reporting, frozen past planned occurrence reporting, Report history, correction, and retraction all remain reachable through the converged operational surface; when Preview remains derived, HistoricalPlan publication remains governed by existing generation rules, ExecutionHistory remains governed observed authority, PlanDecision remains governed friction-decision authority, Summary Historical Intelligence remains unchanged, Backup V3/restore/full-clear semantics remain unchanged, and Planner introduces no persistence migration or new authority; when Planner/Summary and Plan/Schedule navigation are semantically accessible, mobile layouts remain usable, required draft state survives inactive-subview composition, and ephemeral UI state is not promoted unnecessarily into durable state; when no router, deep-link system, autosave, drag/drop, full Settings extraction, Pattern Library redesign, new Historical Intelligence metric, Capacity semantics, Goal, Progress model, Recommendation layer, learning behavior, durable Planner identifier, domain event, or unrelated redesign is introduced; when focused regression coverage proves draft survival, no implicit generation, save-before-generate, generation failure safety, stale schedule behavior, regeneration, profile replacement, friction, reporting, correction/retraction, full clear, Summary isolation, navigation accessibility, and responsive behavior; when staged and canonical repository validation pass; when supported manual product walkthrough is recorded; when governance accurately records Planner / Summary as the implemented top-level product model without falsely declaring deferred Phase 4 Learn capabilities complete; and when no unresolved stop condition remains.**
