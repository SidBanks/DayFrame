# Task 5.4 — Planner Goal V1 UX and Workflow Integration

## Status

Ready for implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Bounded Planner Goal UX implementation, authored Goal workflow integration, lifecycle management, commitment-link management, unavailable-link explanation, accessibility, responsive behavior, regression coverage, and governance.

---

# 1. Context

Task 5.3 completed the Goal V1 substrate.

Goal is now:

```text id="obvncn"
independent durable authority
```

with:

* opaque never-reused Goal ID;
* monotonic revision;
* active / completed / archived lifecycle;
* no hard delete;
* optional description;
* optional target date;
* optional measurement-policy reference;
* Goal-owned exact commitment-incarnation links;
* unavailable-link preservation;
* independent IndexedDB persistence;
* protection/readiness semantics;
* sixth runtime-authority participation;
* Backup V4;
* restore/recovery;
* full-clear integration;
* frozen HistoricalPlan Goal provenance;
* no scheduling influence;
* no Progress;
* no Recommendations;
* no Goal UI.

Task 5.3 explicitly deferred Goal CRUD UI and recommended:

> **Task 5.4 — Planner Goal V1 UX: bounded create/edit/lifecycle/link management and unavailable-link explanation without adding Progress or scheduling influence.**

Task 5.4 implements that user-facing layer.

---

# 2. Purpose

Make Goal V1 usable from Planner / Plan.

At completion, a user should be able to:

1. view Goals;
2. create a Goal;
3. edit a Goal;
4. complete a Goal;
5. archive a Goal;
6. reactivate a completed or archived Goal;
7. link an existing commitment to a Goal;
8. unlink a commitment;
9. see which commitments support a Goal;
10. see when a previously linked commitment is currently unavailable;
11. understand that Goal changes do not automatically change the Schedule;
12. perform all Goal authoring without exposing Progress, Recommendations, or automatic adaptation.

---

# 3. Governing Product Principle

> **Goals describe what the user is trying to accomplish. Commitments describe the schedulable work that may support those Goals.**

The UI must reinforce that distinction.

Do not present a Goal as:

* another Commitment;
* a scheduling block;
* a recurrence;
* a priority score;
* a Progress percentage.

---

# 4. Governing Planner Principle

Planner is the authored operational surface.

Therefore Goal writes belong in:

```text id="8u51fw"
Planner
    Plan
```

not Summary.

Summary remains read-only and receives no Goal UX in Task 5.4.

---

# 5. Scheduling Independence Principle

Goal UI must not imply that creating or changing a Goal automatically affects the Schedule.

These remain true:

```text id="f8djo2"
create Goal       → no Preview change
rename Goal       → no Preview change
complete Goal     → no Preview change
archive Goal      → no Preview change
target change     → no Preview change
link commitment   → no Preview change
unlink commitment → no Preview change
```

Goal mutation does not stale Preview in V1.

---

# 6. Explicit Scope

Implement:

* Goal section in Planner / Plan;
* Goal list;
* Goal create workflow;
* Goal edit workflow;
* lifecycle controls;
* Goal detail;
* commitment-link management;
* unavailable-link presentation;
* Goal authority readiness/protection UI;
* concurrency/stale-revision handling;
* accessibility;
* responsive behavior;
* tests;
* governance.

---

# 7. Explicit Non-Goals

Do not implement:

* Progress;
* Progress percentage;
* Goal scoring;
* recommendations;
* RecommendationDecision;
* adaptation;
* Goal-driven scheduling;
* Goal priority;
* Goal category;
* Goal ordering authority;
* Goal templates;
* Projects;
* milestones;
* link weights;
* link roles;
* auto-linking;
* Summary Goal cards;
* historical Goal analytics;
* Capacity;
* Planned Allocation;
* trends;
* comparison;
* drag/drop;
* automatic completion;
* automatic archive;
* machine learning.

---

# 8. Execution Artifact Rules

Before implementation:

1. verify this Task 5.4 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.1 result;
   * Task 5.2 result;
   * Task 5.3 result;
   * Goal ADR;
   * current Phase 5 checkpoint;
   * Planner / Plan composition;
   * SetupScreen;
   * current Goal authority surface;
   * Goal query/command result contracts;
   * Goal protection/readiness behavior;
   * commitment source identity utilities;
   * Profile/Active replacement behavior;
   * existing Planner accessibility patterns;
   * responsive Plan styles;
6. do not modify the immutable Task 5.4 artifact.

Create:

`docs/implementation/phase-5/TASK_5.4_PLANNER_GOAL_V1_UX_AND_WORKFLOW_INTEGRATION_RESULT.md`

---

# 9. Initial UX Audit

Before changing UI, audit Planner / Plan.

Determine:

* where authored commitments currently appear;
* whether SetupScreen is still the main Plan content;
* existing section/card structure;
* existing edit forms;
* current action density;
* mobile layout;
* focus conventions;
* error/banner conventions;
* save semantics;
* whether Goal UI should sit:

  * before commitments;
  * after commitments;
  * in a bounded sub-section;
  * another location.

Do not perform a broad Plan redesign.

---

# 10. Goal Section Placement

Preferred conceptual structure:

```text id="074o4y"
Planner / Plan

Goals
    current authored Goals

Commitments
    schedulable work

Planning preferences
    structural scheduling configuration
```

Exact order may follow existing implementation constraints.

The Goal section should feel like a first-class authored concept without overwhelming the Plan surface.

---

# 11. Goal List

Display Goals grouped or filtered by lifecycle in a simple V1 manner.

Possible:

```text id="b0tm9i"
Active Goals
Completed / Archived Goals
```

or one list with status labels.

Do not build advanced sorting/filtering unless needed.

---

# 12. Default Goal Visibility

Active Goals should be most prominent.

Completed and archived Goals may be:

* collapsed;
* secondary;
* separately grouped.

They must remain accessible for reactivation.

---

# 13. Add Goal

Provide a clear intent-level action:

> **Add Goal**

Do not label it:

* Add Item;
* Add Plan;
* Add Objective Record.

Use product language.

---

# 14. Goal Creation Form

Goal creation should expose only V1 authored fields that are meaningful now.

Likely:

* title;
* optional description;
* optional target date.

Measurement-policy reference should not be exposed unless a concrete user-facing policy exists.

Because Progress policies are not implemented, default toward **not exposing measurementPolicyRef** in the UI.

Do not expose internal version fields.

---

# 15. Goal Title

Title is required.

Use existing validation limits.

Provide clear validation error.

Do not derive identity from title.

---

# 16. Goal Description

Optional.

Use plain authored text.

Do not interpret or analyze it.

---

# 17. Goal Target Date

Optional.

Present as planning context.

Avoid copy implying:

* deadline;
* failure;
* automatic escalation.

Potential helper text:

> Optional. This helps describe your intended horizon; it does not change scheduling automatically.

Use concise copy.

---

# 18. Measurement Policy UI

Default: do not expose.

Task 5.3 stores the reference only for future compatibility.

Without actual Progress policy choices, exposing an opaque measurement policy would be meaningless.

Document as deferred.

---

# 19. Goal Creation Save

Creation must explicitly save to Goal authority.

Do not add Goal autosave.

A successful create:

* creates durable Goal;
* updates list;
* does not generate Schedule;
* does not stale Preview;
* does not navigate to Schedule automatically.

---

# 20. Goal Draft

Goal create/edit form state is ephemeral UI draft.

Do not mutate durable Goal on each keystroke.

Use explicit Save/Cancel.

---

# 21. Goal Draft and Plan Draft

Keep Goal draft distinct from the existing unified scheduling Plan draft.

Important:

```text id="f5xnn2"
Goal draft
    authored Goal edit

Plan draft
    authored scheduling Setup
```

Do not silently combine them into one save transaction unless the current architecture explicitly requires it.

---

# 22. Save Goal vs Save Setup

Goal V1 is independent authority.

Therefore Goal Save should be distinct from scheduling Plan Save.

The UI must not imply:

> Save Setup also saves Goal edits

unless that is actually implemented.

Prefer explicit:

> Save Goal

inside Goal editor.

---

# 23. Goal List Item

Each Goal should show enough context to distinguish it.

At minimum:

* title;
* lifecycle status where not implied by grouping;
* target date if present;
* supporting commitment count or names where useful.

Do not show Progress.

---

# 24. Goal Detail

A Goal detail/edit panel should expose:

* title;
* description;
* status;
* target date;
* supporting commitments;
* unavailable links.

Keep it bounded.

---

# 25. Edit Goal

Provide:

> Edit Goal

Editing:

* preserves Goal ID;
* uses expected revision;
* handles stale revision;
* explicitly saves;
* does not affect Schedule.

---

# 26. Revision Conflict

If Goal changed after editor opened:

* reject stale save;
* show clear message;
* do not silently overwrite newer durable authority.

Possible UX:

> This Goal changed while you were editing it. Reload the latest version and try again.

Use actual command result semantics.

---

# 27. Complete Goal

Provide a clear explicit lifecycle action.

Possible label:

> Mark Complete

On confirmation/activation:

* Goal status becomes completed;
* linked Commitments remain unchanged;
* Schedule remains unchanged.

Do not imply DayFrame verified success.

---

# 28. Completion Copy

Avoid:

> Goal achieved!

unless the user explicitly chose completion and celebratory language is clearly appropriate.

Prefer factual:

> Goal marked complete.

Do not infer outcome quality.

---

# 29. Archive Goal

Provide:

> Archive Goal

Archive means:

> retain the Goal but remove it from active intent.

Do not label:

* abandon;
* fail;
* delete.

---

# 30. Reactivate Goal

Completed and archived Goals should support:

> Reactivate

This preserves Goal identity and links.

---

# 31. Completed → Archived

If the authority permits completed → archived, decide whether V1 UI needs a direct action.

Do not expose every legal domain transition merely because the domain supports it.

Prefer minimal useful lifecycle controls.

---

# 32. Archived → Completed

Likewise audit whether direct archived → completed is useful.

The domain may support it for correctness while the UI can offer:

```text id="8l50bz"
Reactivate
→ then Mark Complete
```

unless a direct action has clear value.

---

# 33. Lifecycle Confirmation

Use confirmation only for potentially surprising actions.

Archive may merit confirmation.

Mark Complete may not need a modal if easily reversible.

Do not create modal fatigue.

---

# 34. No Delete

No Delete Goal control.

Archive is the V1 removal path.

---

# 35. Supporting Commitments Section

Within Goal detail:

> **Supporting commitments**

Show current links.

Each link should resolve against current Active and indicate:

* available;
* unavailable.

---

# 36. Available Link

For available link, show a frozen/current readable label from current authored commitment state.

Because this is current Planner UI, current label is appropriate.

Identity remains exact internally.

---

# 37. Unavailable Link

If exact linked commitment incarnation no longer exists:

show explicit language.

Potential:

> **Unavailable commitment**
>
> This Goal is linked to a commitment that is no longer present in the current Plan.

Where possible show the preserved source identity or last known information only if authority contains it.

Do not invent a current label.

---

# 38. Unavailable Is Not Broken

Avoid copy such as:

* broken link;
* corrupted Goal;
* invalid Goal.

The relationship is valid authored history; the current source is unavailable.

---

# 39. Link Existing Commitment

Provide:

> Add supporting commitment

or:

> Link commitment

This opens a chooser of current eligible commitment incarnations.

---

# 40. Commitment Chooser

Only show supported current commitment kinds.

Use user-facing titles/categories.

Internally link exact lifetime identity.

Do not expose UUID/incarnation unless needed for troubleshooting.

---

# 41. Already Linked Commitments

Do not show already-linked exact incarnations as linkable again.

Prevent duplicate-link errors before submission where practical.

---

# 42. Commitment Search

Only add search if current commitment counts/layout warrant it.

Do not build a generic searchable library unnecessarily.

---

# 43. Link Save

Linking is an explicit Goal-authority mutation.

It:

* increments Goal revision;
* does not mutate Commitment;
* does not stale Schedule;
* does not generate.

---

# 44. Unlink

Provide a clear unlink/remove-association control.

Prefer:

> Remove from Goal

or:

> Unlink

Avoid:

> Delete Commitment

The underlying commitment must remain untouched.

---

# 45. Unlink Confirmation

For available links, confirmation may not be necessary if action is clear/reversible.

For unavailable links, explicit:

> Remove unavailable link

may be useful.

Use existing destructive affordance conventions.

---

# 46. Commitment Recreation

If an unavailable link exists and a new current commitment has the same logical ID/title:

do not auto-suggest it as already connected.

It may appear in the chooser as a new current commitment.

The user must explicitly link it.

---

# 47. Reconciliation UX

Task 5.4 may allow:

```text id="m8ghep"
Unavailable commitment
    [Remove link]
    [Link another commitment]
```

But it must not implement fuzzy automatic replacement.

---

# 48. Goal Reverse Context on Commitments

Task 5.4 is primarily Goal-owned UX.

Do not require showing Goal chips on every commitment.

A small reverse-context display is allowed only if it materially improves discoverability and can be added without broad Plan redesign.

Default: defer.

---

# 49. Create Commitment From Goal

Do not implement a new combined create-and-link workflow unless existing Add Commitment can be reused cleanly.

Default: link existing commitments only in V1.

A future task can add:

```text id="ni0i6o"
Goal
→ Add supporting commitment
```

as contextual creation.

---

# 50. Goal Without Commitments

Display normally.

Possible helper:

> No supporting commitments linked yet.

Do not imply incomplete Goal setup.

---

# 51. Commitment Without Goal

Existing commitments remain fully valid.

Do not pressure users to link every commitment.

---

# 52. Goal Without Target

Valid.

No warning.

---

# 53. Goal Without Description

Valid.

No warning.

---

# 54. Goal Protection State

If Goal authority is protected:

* do not show empty Goal list;
* show explicit unavailable/protected state;
* disable Goal mutations;
* preserve existing Planner scheduling functionality where safe.

Do not interpret protected authority as zero Goals.

---

# 55. Goal Initializing State

While Goal authority initializes:

* do not show zero Goals;
* show loading/initializing state;
* do not allow writes.

---

# 56. Goal Storage Failure

If a mutation is accepted but durability is pending/storage-failed according to Goal semantics:

surface truthful status consistent with other durable authorities.

Do not claim:

> Saved

if the command did not report durable success.

---

# 57. Accepted Pending Durability

If current product architecture supports accepted-but-pending authority:

copy should distinguish:

> Saved locally, persistence pending

or existing equivalent.

Use project conventions.

Do not invent new durability semantics.

---

# 58. Retry

If Goal protection/storage surface exposes retry:

provide bounded retry action consistent with other protected authority UX only if current product has a pattern.

Do not create a Goal-specific recovery architecture.

---

# 59. Goal Status Filters

Do not build complex filters.

A simple active/other grouping is sufficient.

---

# 60. Goal Count

Displaying counts is fine:

```text id="h7s25o"
Active Goals (3)
```

Do not turn count into performance measurement.

---

# 61. Empty Goal State

For no Goals:

> **No Goals yet**

Helpful explanation:

> Goals describe the longer-term outcomes or directions your commitments can support.

Then:

> Add Goal

Do not imply Goals are required.

---

# 62. Goal Explanation

Keep product copy concise.

Potential:

> Goals capture what you're working toward. Commitments are the schedulable activities that can support them.

This distinction should be visible near the Goal section or empty state.

---

# 63. Scheduling Independence Copy

A lightweight explanation may be useful:

> Linking a commitment to a Goal does not change how DayFrame schedules it.

Do not repeat excessively.

---

# 64. No Progress Placeholder

Do not show:

* Progress coming soon;
* 0%;
* no progress yet;
* streak;
* completed sessions.

Task 5.4 should not tease an unimplemented semantic layer.

---

# 65. No Recommendation Placeholder

Do not show Recommendations sections.

---

# 66. No Goal Priority UI

Do not add stars, rank, importance sliders, priority numbers.

---

# 67. No Goal Category UI

Do not reuse Commitment categories.

---

# 68. Target-Date Language

Use:

> Target date

if retained from architecture.

Avoid:

> Deadline

unless user-authored semantics explicitly become deadline semantics later.

---

# 69. Measurement Policy Hidden

Because no concrete user-facing measurement policy exists, do not surface internal policy ID/version.

Existing Goal records containing a measurement-policy reference should remain editable without losing the field.

Important: editing title/description/target must preserve unknown/unexposed valid measurement-policy reference unless explicitly changed through a supported future UI.

---

# 70. Non-Destructive Hidden Fields

The Goal edit form must not accidentally erase authored fields it doesn't expose.

This includes:

* measurementPolicyRef;
* links not currently visible due to filtering;
* lifecycle timestamps;
* revision-managed metadata.

Mandatory regression.

---

# 71. Form Submission Semantics

Use expected Goal revision.

On success:

* update displayed Goal;
* close or remain in editor according to current UX conventions;
* preserve user context.

On rejection:

* display specific reason.

---

# 72. Cancel

Cancel discards Goal draft only.

It must not affect durable Goal authority.

---

# 73. Planner Plan Draft Independence

Editing a Goal must not dirty the existing scheduling Plan draft unless actual scheduling fields are modified.

Mandatory.

---

# 74. Goal Mutation and Schedule Status

Goal mutation must not cause:

* Schedule stale banner;
* Generate prompt;
* Regenerate prompt.

Mandatory.

---

# 75. Goal Mutation and Historical Publication

No HistoricalPlan publication occurs merely because a Goal changes.

Goal context is frozen only on future normal schedule publication.

---

# 76. Goal UI and Backup

Goal UI uses existing authority only.

No Goal-specific Export button.

Backup V4 already includes Goal.

---

# 77. Goal UI and Profiles

Do not show Goals inside Profile controls.

Do not imply profile save includes Goals.

If useful, a short clarification may say:

> Profiles do not include Goals.

Only add if actual confusion exists.

---

# 78. Profile Load With Goal Links

When profile load replaces Active:

* Goal list remains;
* available/unavailable link resolution refreshes;
* no Goal edit occurs;
* unavailable state becomes visible where relevant.

Add integration coverage.

---

# 79. Backup V3 Import With Goals

Existing full V3 restore translates Goal authority to empty.

If this can occur from current UI, Goal section should naturally show empty after restore.

Do not add special Goal migration UI.

---

# 80. Backup V4 Restore

After V4 restore:

* Goals appear exactly;
* lifecycle/links remain;
* unavailable resolution is based on restored Active.

No manual reconciliation required when exact incarnations exist.

---

# 81. Full Clear

After full clear:

* Goal UI shows no Goals;
* no stale selected Goal/detail remains;
* Planner remains usable.

---

# 82. Selection State

If a selected Goal is removed from visible active grouping due to lifecycle transition:

update selection coherently.

For example:

```text id="248obi"
Mark Complete
→ Goal moves to completed group
```

The editor/detail may remain open if product behavior is clear.

---

# 83. Selected Goal After Restore/Clear

If authority replacement removes the selected Goal:

clear selection.

Do not show stale Goal details.

---

# 84. Revision Refresh

Subscriptions to Goal authority should update Goal UI.

If another operation changes a Goal:

* displayed revision updates;
* stale open editor should detect mismatch on Save;
* do not silently merge.

---

# 85. Component Placement

Prefer bounded components.

Possible:

```text id="68eyiu"
GoalsSection
GoalList
GoalEditor
GoalDetail
GoalCommitmentLinks
```

Do not force Goal logic into `DayFrameApp.tsx`.

---

# 86. Store/App Contract

Expose Goal queries/commands to Planner through the narrowest current application boundary.

Do not let UI directly manipulate IndexedDB.

---

# 87. No Parallel Goal State

Do not maintain a separate authoritative Goal list inside React state.

Local component state may contain:

* selected Goal ID;
* draft fields;
* disclosure state.

Authority remains Goal surface/store.

---

# 88. Goal Subscription

Subscribe to Goal authority/store state according to existing application patterns.

Avoid polling.

---

# 89. Commitment Source Resolution

Build a bounded current-authority resolver for user-facing link labels if one does not already exist.

It must resolve exact current incarnation.

Do not create a second commitment identity system.

---

# 90. Supported Commitment Kinds

User-facing chooser should only show source kinds actually supported by Goal V1.

Do not show internal source-kind names to users.

---

# 91. Source Kind Product Labels

Map technical kinds to understandable context only where necessary.

For example:

* recurring commitment;
* manual event;
* shift.

Do not overexpose engine taxonomy.

---

# 92. Shift/Cycle Links

Task 5.3 supports shift definition/cycle/segment/sequence entry.

Audit whether all should be user-linkable in V1 UI.

The existence of domain support does not mean every technical sub-source should appear as a reasonable Goal-supporting item.

If exposing segment/sequence entries would be confusing, stop and recommend a narrower UI-supported subset while preserving authority compatibility.

Do not invent product labels for obscure internal concepts without audit.

---

# 93. Link Chooser Product Boundary

The chooser should present user-recognizable commitments.

If multiple internal source lifetimes map to one conceptual authored item, determine the truthful selectable unit.

Do not collapse distinct incarnations.

---

# 94. Goal Detail Source Labels

For unavailable links, if only technical identity is available, prefer:

> Previously linked commitment is unavailable

over exposing raw UUIDs by default.

A diagnostic disclosure may show technical identity if existing product conventions support it.

---

# 95. Accessibility — Goal List

Use semantic lists/headings.

Goal actions must be keyboard accessible.

---

# 96. Accessibility — Forms

Every field needs:

* label;
* errors associated with field;
* keyboard operation;
* clear required/optional semantics.

---

# 97. Accessibility — Lifecycle Actions

Mark Complete / Archive / Reactivate must have clear accessible names.

Do not use icon-only controls without labels.

---

# 98. Accessibility — Link Controls

Add/remove link controls must identify the commitment in accessible context.

Example:

> Remove Security+ Study from Goal

---

# 99. Accessibility — Dialog/Panel

If Goal editor uses dialog:

* correct dialog semantics;
* labelled heading;
* initial focus;
* Escape/Cancel;
* focus return.

If inline:

* heading/focus structure must remain coherent.

Follow existing product patterns.

---

# 100. Accessibility — Error/Protection

Protection and save errors must be announced/discoverable in text.

---

# 101. Responsive — Goal List

Goal cards/list must fit narrow widths without horizontal scrolling.

---

# 102. Responsive — Goal Editor

Form fields stack naturally on mobile.

Avoid multi-column assumptions.

---

# 103. Responsive — Commitment Chooser

Linked/unlinked commitment UI must remain usable on narrow screens.

Avoid wide tables.

---

# 104. Responsive — Dense Plan Surface

Plan is already dense.

Goal UI should not make Planner / Plan one enormous undifferentiated scroll if a bounded disclosure/card can help.

Do not perform full Settings extraction.

---

# 105. Visual Hierarchy

Goals should be identifiable as a distinct concept from Commitments.

Use headings/copy/layout, not necessarily color.

Do not create a visually dominant dashboard.

---

# 106. Existing Plan Content

Do not remove or hide:

* commitments;
* preferences;
* profiles;
* backup;
* existing Plan workflows.

---

# 107. Goal First-Run Experience

The empty state should teach:

```text id="ml088s"
Goal
    what you're working toward

Commitment
    the schedulable work that may support it
```

without requiring tutorial onboarding.

---

# 108. Current Schedule Cross-Surface Behavior

Create/edit/link Goal in Plan, then visit Schedule.

Expected:

* same generated schedule;
* no stale notice caused by Goal;
* no Goal-specific Schedule UI.

Mandatory integration test.

---

# 109. Summary Cross-Surface Behavior

Create/edit Goal, then visit Summary.

Expected:

* current Summary unchanged;
* no Goal card;
* current Historical Intelligence still works.

Goal provenance remains latent data for future tasks.

---

# 110. Goal Lifecycle and Summary

Completing/archive Goal must not reinterpret existing Summary metrics.

---

# 111. Historical Provenance Non-UI Boundary

Task 5.4 should not display frozen HistoricalPlan Goal provenance.

That comes later.

---

# 112. Form Validation

Test:

* blank title;
* invalid target date if UI can produce one;
* field length;
* stale revision;
* unavailable authority.

Do not expose impossible malformed states through normal controls.

---

# 113. Create Goal Test

Flow:

```text id="b7g949"
Planner
→ Plan
→ Add Goal
→ title
→ Save Goal
```

Expected:

* Goal appears;
* active status;
* durable authority changed;
* Plan draft untouched;
* Schedule unchanged.

---

# 114. Edit Goal Test

Flow:

```text id="xvo0nf"
Goal
→ Edit
→ rename/change target
→ Save
```

Expected:

* same Goal ID;
* revision increments;
* UI updates;
* Schedule unchanged.

---

# 115. Complete Goal Test

Expected:

* completed status;
* linked commitments untouched;
* Goal moves appropriately;
* Schedule unchanged.

---

# 116. Archive Goal Test

Expected:

* archived;
* no Goal deletion;
* linked commitments untouched.

---

# 117. Reactivate Goal Test

Expected:

* active again;
* same ID;
* links retained.

---

# 118. Link Commitment Test

Expected:

* exact commitment linked;
* Goal revision increments;
* commitment unchanged;
* Schedule unchanged.

---

# 119. Unlink Test

Expected:

* link removed from Goal;
* commitment remains.

---

# 120. Unavailable Link Test

Setup:

1. Goal linked to Commitment A incarnation 1.
2. Active replaces/removes A.

Expected UI:

* Goal remains;
* link remains;
* explicit unavailable state;
* no automatic retarget.

---

# 121. Recreation Test

Setup:

1. linked A incarnation 1 removed;
2. A recreated with same logical ID/title, incarnation 2.

Expected:

* old link unavailable;
* new A may be manually linked;
* no automatic transfer.

---

# 122. Profile Load Test

Goal links resolve again after profile load.

Verify available/unavailable behavior without Goal mutation.

---

# 123. Backup V4 Restore UI Test

After V4 restore:

* Goal list matches restored authority;
* selection/editor stale state cleared appropriately.

---

# 124. Backup V3 Restore UI Test

After V3 restore:

* Goal list is empty;
* empty state displayed;
* no prior Goals remain.

---

# 125. Full Clear UI Test

After clear:

* Goal list empty;
* editor/selection cleared;
* no Goal data resurfaces.

---

# 126. Protection UI Test

Protected Goal authority:

* no false empty state;
* read/write disabled appropriately;
* explicit message.

---

# 127. Initializing UI Test

No false zero state while initializing.

---

# 128. Persistence Failure UI Test

Exercise relevant command result.

Verify copy matches actual durability result.

---

# 129. Stale Revision Test

Open Goal editor at revision N.

Mutate Goal elsewhere to N+1.

Save original draft.

Expected:

* no overwrite;
* stale/reload message;
* durable N+1 preserved.

---

# 130. Hidden Measurement Policy Preservation Test

Goal contains measurementPolicyRef.

Edit title via current UI.

Expected:

* measurementPolicyRef unchanged.

---

# 131. Link Preservation During Edit Test

Goal has links.

Edit title/description/target.

Expected:

* all links preserved.

---

# 132. Plan Draft Independence Test

Unsaved scheduling Plan draft exists.

Create/edit Goal.

Expected:

* Plan draft remains exactly as before;
* Goal save does not save scheduling draft;
* Goal save does not generate.

---

# 133. Schedule Independence Test

Generate Schedule.

Mutate Goal.

Visit Schedule.

Expected:

* same schedule;
* not stale due solely to Goal mutation.

---

# 134. Current Historical Intelligence Regression

Existing Summary tests remain green.

No Goal mutation changes Scheduling Realization or Scheduled Outcomes.

---

# 135. Keyboard Workflow Test

At minimum:

```text id="10t9vm"
keyboard
→ Add Goal
→ enter title
→ Save
→ locate new Goal
→ Edit
```

Use semantic controls.

---

# 136. Mobile Verification

At minimum inspect/test supported narrow layout for:

* empty Goals;
* Goal list;
* editor;
* linked commitments;
* unavailable link;
* lifecycle actions.

---

# 137. No Goal UI Outside Planner

Assert or audit:

* no Summary Goal write controls;
* no Schedule Goal controls;
* no top-level Goals destination.

---

# 138. No Progress Language

Static/product review:

Do not introduce phrases like:

* on track;
* behind;
* progress;
* completion rate;
* goal performance.

Except unavoidable generic UI wording unrelated to analytical Progress.

---

# 139. No Recommendation Language

Do not say:

* DayFrame recommends;
* suggested goal;
* you should.

---

# 140. No Hidden Scheduler Language

Do not say:

> DayFrame will prioritize this Goal

because it will not.

---

# 141. Goal Copy Matrix

Produce:

| Concept               | User-facing wording | Avoid |
| --------------------- | ------------------- | ----- |
| Goal                  |                     |       |
| supporting commitment |                     |       |
| active                |                     |       |
| completed             |                     |       |
| archived              |                     |       |
| unavailable link      |                     |       |
| target date           |                     |       |

---

# 142. Required Goal UX Matrix

Produce:

| Capability  | Location | Write? | Scheduler effect |
| ----------- | -------- | -----: | ---------------: |
| view Goals  |          |        |                  |
| create Goal |          |        |                  |
| edit Goal   |          |        |                  |
| complete    |          |        |                  |
| archive     |          |        |                  |
| reactivate  |          |        |                  |
| link        |          |        |                  |
| unlink      |          |        |                  |

---

# 143. Required Lifecycle UX Matrix

Produce:

| Goal state | Primary actions | Secondary actions | Hidden/deferred |
| ---------- | --------------- | ----------------- | --------------- |
| active     |                 |                   |                 |
| completed  |                 |                   |                 |
| archived   |                 |                   |                 |

---

# 144. Required Link UX Matrix

Produce:

| Link condition          | Display | Available actions | Must not do |
| ----------------------- | ------- | ----------------- | ----------- |
| available               |         |                   |             |
| unavailable             |         |                   |             |
| recreated source exists |         |                   |             |
| duplicate exact link    |         |                   |             |

---

# 145. Required Authority/UI Matrix

Produce:

| State                      | Goal UI |
| -------------------------- | ------- |
| initializing               |         |
| ready empty                |         |
| ready with Goals           |         |
| protected                  |         |
| persistence pending        |         |
| storage failure            |         |
| restore/replacement active |         |

---

# 146. Required Cross-Surface Matrix

Produce:

| Goal action | Plan draft | Schedule | Summary |
| ----------- | ---------- | -------- | ------- |
| create      |            |          |         |
| edit        |            |          |         |
| complete    |            |          |         |
| archive     |            |          |         |
| reactivate  |            |          |         |
| link        |            |          |         |
| unlink      |            |          |         |

---

# 147. Required Product-Boundary Matrix

Produce:

| Capability                   | Task 5.4 |
| ---------------------------- | -------- |
| Goal list                    |          |
| Goal create                  |          |
| Goal edit                    |          |
| lifecycle                    |          |
| commitment links             |          |
| unavailable-link explanation |          |
| Goal target date             |          |
| measurement policy UI        |          |
| Progress                     |          |
| Recommendation               |          |
| Goal priority                |          |
| Goal category                |          |
| Goal ordering                |          |
| Summary Goal UI              |          |
| Schedule Goal UI             |          |
| Goal-driven scheduling       |          |
| automatic adaptation         |          |
| machine learning             |          |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited.

---

# 148. Required Architectural Invariant Assessment

Classify at least:

1. Goal writes exist only in Planner / Plan.
2. Goal is not a top-level destination.
3. Summary remains read-only.
4. Schedule remains Goal-write-free.
5. Goal create is explicit.
6. Goal edit uses explicit Save.
7. Goal draft is ephemeral.
8. Goal draft is distinct from scheduling Plan draft.
9. Goal save does not save Plan draft.
10. Goal save does not generate.
11. Goal mutation does not stale Preview.
12. Goal mutation does not alter schedule output.
13. Goal list reads durable Goal authority.
14. no parallel authoritative React Goal state exists.
15. blank title is rejected.
16. target date remains optional.
17. no target date failure semantics.
18. measurement policy is not exposed without user-facing policy.
19. hidden measurement ref is preserved through edit.
20. active/completed/archived are the only statuses.
21. completion is explicit.
22. archive is not delete.
23. reactivation preserves identity.
24. no Delete Goal control exists.
25. link management uses exact current commitment identity.
26. available links display current authored labels.
27. unavailable links remain visible.
28. unavailable links are not called corrupted.
29. commitment recreation is not auto-linked.
30. duplicate exact links are prevented.
31. unlink does not mutate commitment.
32. Goal completion does not disable commitments.
33. Goal archive does not disable commitments.
34. Goals without commitments are valid.
35. commitments without Goals remain valid.
36. profiles do not contain Goals.
37. profile load does not mutate Goal authority.
38. link availability refreshes after Active replacement.
39. V4 restore displays restored Goals.
40. V3 restore produces empty Goal UI.
41. full clear removes Goals from UI.
42. selected stale Goal is cleared after authority replacement.
43. protection is not displayed as empty.
44. initialization is not displayed as empty.
45. stale revision cannot overwrite current Goal.
46. Goal links survive unrelated Goal edits.
47. Goal ID is never exposed as primary user identity.
48. raw source incarnation is not exposed by default.
49. Goal list is keyboard accessible.
50. Goal editor fields are labelled.
51. lifecycle actions are keyboard accessible.
52. link/unlink actions carry contextual accessible names.
53. mobile Goal list remains usable.
54. mobile Goal editor remains usable.
55. no horizontal link table dependency exists.
56. no Progress calculation exists.
57. no Progress wording implying analytical status exists.
58. no Recommendation exists.
59. no RecommendationDecision exists.
60. no adaptation exists.
61. no Goal priority exists.
62. no Goal category exists.
63. no Goal score exists.
64. no automatic scheduling influence exists.
65. no machine learning exists.
66. existing Summary projections remain unchanged.
67. HistoricalPlan Goal provenance remains unused by current UI.
68. canonical validation is green.
69. no unresolved stop condition remains.

Use:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Stop-condition violation.

---

# 149. Stop Conditions

Stop and report if:

* Goal authority commands cannot be consumed cleanly from Planner without bypassing authority boundaries;
* Goal UI would require Goals to become part of scheduling Plan draft;
* linking requires modifying Active commitment schema;
* Goal mutation must stale Preview to keep current UI coherent;
* supported Goal link source kinds cannot be represented intelligibly to users;
* unavailable links cannot be explained without current/fuzzy identity reconstruction;
* Goal edit UI would erase hidden valid Goal fields;
* profile/import replacement creates unsafe Goal mutation;
* protection/readiness cannot be surfaced without pretending empty;
* Goal UI requires Progress semantics;
* Goal UI requires Recommendation semantics;
* meaningful Goal creation requires scheduler changes.

Do not patch around a stop condition by weakening Goal semantics.

---

# 150. Likely Files

Likely areas:

```text id="5k3dmm"
Planner / Plan components
Goal UI components
DayFrameApp/store application boundary
Goal authority selectors/commands
Plan styles
Planner tests
Goal integration tests
governance
```

Do not assume exact filenames before source audit.

---

# 151. Dead-Code Boundary

Do not remove existing Plan/Setup functionality.

Do not refactor Goal substrate unnecessarily.

Only remove code made clearly unreachable by bounded Goal UX integration.

---

# 152. Test Strategy

Use layered tests.

### Component

* Goal list;
* Goal editor;
* lifecycle;
* links;
* unavailable links;
* states/errors.

### App integration

* Planner Goal workflows;
* Plan draft independence;
* Schedule independence;
* profile/restore/clear;
* Summary isolation.

### Accessibility

* keyboard;
* labels;
* focus;
* error states.

### Responsive

* narrow list/editor/links.

---

# 153. Focused Validation

Run focused Goal UX and relevant Planner suites.

Record files/counts.

---

# 154. Full Validation

Before completion run:

```bash id="5ddhh5"
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Record:

* files;
* tests;
* modules;
* bundle advisory;
* diff result.

---

# 155. Manual Product Walkthrough

Where browser validation is available, perform:

### Journey A — First Goal

```text id="49ph73"
Planner
→ Plan
→ Add Goal
→ title
→ Save
```

### Journey B — Edit

```text id="cmhrkt"
Goal
→ Edit
→ target date
→ Save
```

### Journey C — Link

```text id="pkyumd"
Goal
→ Add supporting commitment
→ select commitment
```

### Journey D — Lifecycle

```text id="kq6by9"
Active
→ Complete
→ Reactivate
→ Archive
```

### Journey E — Unavailable Link

```text id="5va09u"
link commitment
→ replace/remove commitment
→ Goal
```

Verify explicit unavailable state.

### Journey F — Schedule Independence

```text id="lqzd6r"
Generate Schedule
→ edit Goal
→ Schedule
```

Verify schedule remains current/not stale due solely to Goal.

### Journey G — Mobile

Inspect list/editor/link management at supported narrow width.

Record only what was actually performed.

---

# 156. Governance

On success update minimally:

* Task 5.4 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` only if UX integration reveals a durable product decision not already covered.

Do not alter the Goal ADR unless implementation contradicts it materially.

---

# 157. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.4_PLANNER_GOAL_V1_UX_AND_WORKFLOW_INTEGRATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.3 Prerequisite Confirmation
4. Initial Planner Audit
5. Files Changed
6. Goal Section Placement
7. Goal List
8. Empty State
9. Add Goal
10. Goal Creation Form
11. Goal Draft
12. Goal Save
13. Goal Detail
14. Goal Edit
15. Revision Conflict
16. Target Date
17. Measurement Policy UI Boundary
18. Complete Goal
19. Archive Goal
20. Reactivate Goal
21. Lifecycle Action Design
22. Supporting Commitments
23. Available Link
24. Unavailable Link
25. Commitment Chooser
26. Link Command
27. Unlink Command
28. Recreation/Reconciliation
29. Goal Without Commitments
30. Plan Draft Independence
31. Schedule Independence
32. Summary Isolation
33. Profile Load
34. Backup V4 Restore
35. Backup V3 Restore
36. Full Clear
37. Protection
38. Initialization
39. Durability/Error States
40. Selection/Subscription Behavior
41. Hidden Field Preservation
42. Component Placement
43. Application Boundary
44. Accessibility
45. Keyboard Behavior
46. Focus Behavior
47. Responsive Behavior
48. Mobile
49. Copy/Terminology
50. No Progress/Recommendation Boundary
51. Tests Added/Changed
52. Focused Validation
53. Full Validation
54. Manual Product Walkthrough
55. Governance Updates
56. Deviations
57. Discoveries
58. Deferred Work
59. Goal Copy Matrix
60. Goal UX Matrix
61. Lifecycle UX Matrix
62. Link UX Matrix
63. Authority/UI Matrix
64. Cross-Surface Matrix
65. Product-Boundary Matrix
66. Architectural Invariant Assessment
67. Stop-Condition Assessment
68. Architectural Alignment Assessment
69. Recommended Next Task
70. Final Completion Determination

---

# 158. Completion Criteria

Task 5.4 is complete only when:

* Planner / Plan exposes Goal V1 as a first-class authored concept;
* Goal UX reads/writes only the implemented Goal authority;
* Goal is not introduced as a top-level destination;
* Summary remains read-only and unchanged;
* Schedule remains free of Goal-authoring controls;
* users can create Goals through an explicit Goal draft/save workflow;
* Goal creation does not affect the existing scheduling Plan draft;
* Goal creation does not save scheduling draft;
* Goal creation does not generate or stale Schedule;
* users can edit Goal title, description, and target date without replacing Goal identity;
* hidden valid Goal fields such as measurementPolicyRef and links survive edits that do not expose them;
* stale expected revision cannot overwrite newer Goal authority;
* users can explicitly mark a Goal complete;
* users can archive Goals;
* users can reactivate completed/archived Goals;
* lifecycle actions preserve Goal identity and links;
* no Delete Goal control exists;
* Goal completion/archive does not disable or alter linked Commitments;
* active/completed/archived semantics remain descriptive authored states rather than success/failure scoring;
* Goals may exist without linked Commitments;
* Commitments may exist without Goals;
* users can inspect supporting Commitments;
* users can link eligible existing current Commitments using exact lifetime identity;
* duplicate exact links are prevented;
* users can unlink without modifying or deleting the Commitment;
* current available links show understandable current commitment labels;
* removed/replaced linked incarnations remain visible as unavailable relationships;
* unavailable links are not presented as corruption;
* recreated commitments are never silently retargeted or relinked;
* reconciliation requires explicit user action;
* Goal link changes do not alter Commitment scheduling fields;
* Goal link changes do not stale Schedule;
* Goal target/lifecycle/title/description changes do not alter or stale Schedule;
* profile load leaves Goal authority intact and refreshes link availability;
* Backup V4 restore displays exact restored Goals;
* legacy V3 full restore naturally results in empty Goal UI;
* full clear removes Goal UI state and selected stale Goal details;
* initializing Goal authority is not displayed as empty;
* protected Goal authority is not displayed as zero Goals;
* Goal writes are disabled/rejected truthfully while authority is protected or replacement is active;
* durability failures/pending states use truthful existing authority semantics;
* Goal authority subscriptions update UI without polling;
* no parallel React-owned Goal authority is introduced;
* Goal editor/list/link controls are keyboard accessible;
* fields and errors are semantically labelled;
* lifecycle and unlink controls have clear accessible names;
* mobile Goal list/editor/link workflows remain usable without horizontal table dependence;
* the Goal section remains visibly distinct from Commitments without broad Planner redesign;
* no user-facing measurement-policy selector is introduced before actual Progress policies exist;
* no Progress calculation, Progress percentage, Goal performance, Goal score, Goal priority, Goal category, Recommendation, RecommendationDecision, adaptation, Goal-driven scheduling, automatic completion, automatic learning, or machine-learning behavior is introduced;
* existing Summary projections remain semantically and behaviorally unchanged;
* existing HistoricalPlan Goal provenance remains latent and is not reinterpreted through current Goal UI;
* focused Goal/Planner integration tests pass;
* canonical lint, typecheck, full tests, build, and diff validation pass;
* manual product walkthrough is either performed and recorded or explicitly not claimed;
* governance accurately records user-facing Goal V1 while leaving Progress and Recommendations deferred;
* no unresolved stop condition remains.

---

# 159. Recommended Next Task

If Task 5.4 completes successfully, do **not** jump directly into Recommendations.

The preferred next boundary is:

> **Task 5.5 — Goal-Linked Historical Evidence and Progress Readiness Audit**

Its purpose should be to verify that:

* Goal-linked HistoricalPlan provenance is sufficient;
* pre-Goal history is handled truthfully;
* Goal-link coverage semantics are explicit;
* lifecycle/horizon/measurement-policy evidence is adequate;
* no additional authority is required;

before defining Progress V1.

If 5.4 uncovers a Goal UX or link-semantics blocker, recommend the smallest corrective task instead.

---

# 160. Final Implementation Principle

> **The Goal experience should let the user say what they care about and connect that intent to the work they already plan—without pretending DayFrame already knows whether they are succeeding.**

---

# 161. Final Completion Statement

**Task 5.4 is complete when DayFrame exposes Goal V1 through Planner / Plan as a bounded, accessible, responsive authored workflow in which users can create, inspect, edit, complete, archive, reactivate, link, and unlink Goals while Goal authority remains entirely separate from the existing scheduling Plan draft and from Schedule generation; when Goal creation and editing use ephemeral Goal drafts, explicit saves, expected revisions, and the existing durable Goal command surface without introducing parallel UI authority; when title, description, target date, lifecycle, exact supporting-commitment relationships, and unavailable-link states are understandable in product language while hidden valid Goal fields remain preserved; when Goal links resolve exact current commitment incarnations, removed or recreated commitments never silently inherit or retarget old relationships, unavailable links remain visible until explicit user reconciliation, and unlinking never mutates the underlying commitment; when Goals without commitments and commitments without Goals remain valid; when complete and archived remain authored lifecycle facts rather than inferred success/failure and reactivation preserves Goal identity and relationships; when Goal mutations, links, lifecycle, and target metadata have no scheduling effect, do not stale Preview, do not save the scheduling Plan draft, and do not generate or regenerate Schedule; when profiles continue to exclude Goal ownership, Active replacement merely changes current link availability, Backup V4 restore surfaces exact restored Goal state, legacy V3 full restore results in explicit empty Goal authority, and full clear removes all Goal UI state without resurrection; when initializing, protected, replacement-active, pending-durability, persistence-failure, stale-revision, empty, and ready Goal states are presented truthfully rather than conflated; when Planner remains the only Goal write surface, Schedule gains no Goal authoring, Summary remains read-only and unchanged, and frozen historical Goal provenance remains latent for later evidence work; when Goal list, forms, lifecycle actions, link management, error states, keyboard interaction, focus behavior, and mobile layout meet existing accessibility and responsive conventions; when no Goal priority, Goal category, Goal score, Progress result, Progress percentage, Recommendation, RecommendationDecision, adaptation, automatic scheduling influence, automatic completion, machine-learning behavior, or other prescriptive semantics are introduced; when focused and canonical validation pass; when the supported manual walkthrough is truthfully recorded; when governance records Goal V1 as user-facing while keeping Progress and Recommendations explicitly deferred; and when no unresolved UX, authority, identity, link-reconciliation, scheduler-independence, accessibility, or durability stop condition remains.**
