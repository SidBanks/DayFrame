# Task 6.8 — Planner Contextual Event and Friction Workflow Convergence

## Status

Ready for implementation.

## Phase

Phase 6 — Product-Surface Convergence

## Task Type

Planner contextual-workflow audit and convergence, selected-user-day Event authoring, Review Schedule → authored-intent navigation, friction-resolution workflow refinement, exact identity preservation, singular write-path preservation, stale-schedule semantics, variable-duration user-day preservation, responsive/accessibility work, lazy-boundary preservation, bundle validation, regression testing, and governance.

**This task does not create a generic Event/Commitment authority, redesign friction semantics, implement Recommendations, add direct schedule manipulation, or change Today/Summary.**

---

# 1. Objective

Complete the next layer of Planner convergence so that the user can move naturally among:

```text
Planner

Plan
    Goals
    Commitments
    Schedule Preferences
    Work

Review Schedule
    selected user-day
    scheduled items
    plan attention
    Needs attention
        Resolution options

Contextual workflows
    Add Event
    Edit Event
    inspect/edit relevant authored commitment
    inspect/edit Work where provenance permits
    apply bounded planning change
```

without needing to understand that these interactions originate from different internal subsystems.

The resulting experience should communicate:

> **Plan is where I tell DayFrame what matters and what is fixed. Review Schedule is where I inspect what DayFrame built and resolve scheduling problems.**

---

# 2. Governing Workflow Principle

> **Context should determine where an action begins; authority determines where the write goes.**

Examples:

```text
selected calendar day
    → Add Event
    → canonical manual-event authority

scheduled commitment in Review Schedule
    → Edit Commitment
    → canonical Planner SetupDraft

Needs attention
    → Resolution option
    → canonical PlanDecision / existing remediation path
```

Do not create duplicate writes merely to make navigation convenient.

---

# 3. Task 6.7 Prerequisite

Treat Task 6.7 as governing:

* Commitment is a product projection over template/recurrence pairs.
* Work remains Work Hours + Work Schedule.
* manual events remain Calendar Events.
* Goal relationships remain Goal-owned.
* one `SetupDraft` remains.
* Save Setup remains the scheduling persistence boundary.
* only Save Setup triggers the governed Commitment-draft stale-schedule behavior.
* Plan authoring is lazy.
* Review Schedule remains generated-plan review.
* Pattern Library remains deferred.
* no generic Commitment authority exists.

Do not reopen these decisions unless mechanical evidence triggers a stop condition.

---

# 4. Governing Event Principle

A manual Event is an **anchored authored calendar fact**.

It may be reached contextually from Planner, but it must not be reclassified as an ordinary flexible Commitment merely to share UI.

Preserve:

* manual-event identity;
* manual-event authority;
* exact user-day association;
* timed/all-day distinction;
* user-day-wide all-day semantics;
* existing lifecycle/incarnation behavior;
* existing persistence behavior;
* existing profile/Backup/restore behavior;
* existing schedule-staleness behavior.

---

# 5. Governing Friction Principle

Friction is deterministic evidence about the generated schedule.

It is not:

* a Recommendation;
* a Goal judgment;
* a Capacity judgment;
* a failure judgment;
* an execution outcome.

Continue the Task 6.6 product language:

```text
internal
    friction point
    suggested fix

product
    Needs attention
    Resolution option
```

Internal domain names do not need renaming.

---

# 6. Governing Resolution Principle

A Resolution option is a **bounded deterministic planning remediation already supported by the current friction/fix architecture**.

It must not silently become:

* generalized advice;
* automatic reprioritization;
* transition adaptation;
* Goal reorientation;
* Recommendation V1.

---

# 7. Governing Identity Principle

Every contextual jump must use canonical exact identity.

Never navigate or mutate by:

* title;
* display label;
* scheduled time alone;
* list position;
* visual similarity.

Where a scheduled occurrence can be traced to current authored intent, use its existing durable/source reference.

Where exact current authored identity is unavailable, do not fabricate an Edit action.

---

# 8. Governing Temporal Principle

Task 6.3B remains governing.

All contextual selected-day behavior must use canonical variable-duration user-day windows:

```text
day(D) = [start(D), start(D+1))
```

Do not restore 24-hour assumptions for:

* Event workflows;
* day filtering;
* all-day presentation;
* clipping;
* selected-day navigation;
* schedule review.

---

# 9. Explicit Scope

Audit and implement where mechanically supported:

* current selected-day/calendar workflow;
* Add Event entry point;
* Edit Event entry point;
* delete/remove Event behavior;
* all-day Event authoring;
* timed Event authoring;
* selected-day preservation;
* Review Schedule occurrence interaction;
* Review Schedule → Edit Commitment navigation;
* Review Schedule → Edit Event navigation;
* Review Schedule → Work configuration navigation where truthful;
* unplaced Commitment contextual editing;
* friction detail/context;
* Resolution option presentation;
* Try behavior;
* Apply Planning Change behavior;
* contextual navigation after applying a change;
* stale-schedule semantics;
* exact source provenance;
* inaccessible/unavailable source handling;
* lazy Plan authoring interoperability;
* focus;
* accessibility;
* mobile;
* bundle impact;
* tests;
* governance.

---

# 10. Explicit Non-Goals

Do not implement:

* new Event authority;
* new Commitment authority;
* unified Event/Commitment schema;
* direct schedule editing;
* drag/drop;
* resize;
* pin;
* lock;
* arbitrary move UI beyond existing governed remediation;
* generalized Recommendations;
* Recommendation persistence;
* Capacity;
* Planned Allocation;
* transition adaptation;
* sleep-transition suggestions;
* Goal reorientation;
* automatic Goal linking;
* automatic reprioritization;
* friction algorithm redesign;
* scheduler redesign;
* recurrence redesign;
* Today authoring;
* Summary authoring;
* execution reporting in Planner;
* Pattern Library.

---

# 11. Execution Artifact Rules

Before implementation:

1. verify this complete Task 6.8 artifact;
2. save an immutable project copy;
3. compare supplied/saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 6.6 result;
   * Task 6.7 result;
   * canonical manual-event domain/store/UI;
   * `PlannerSurface`;
   * `DayFrameApp`;
   * `PreviewScreen` / Review Schedule;
   * `CommitmentSection`;
   * lazy Plan authoring boundary;
   * Work Hours / Work Schedule;
   * selected-day/calendar state;
   * friction detection;
   * suggested fixes;
   * Try / Apply Planning Change;
   * `PlanDecision`;
   * Preview staleness;
   * profile replacement;
   * Backup/restore;
   * full clear;
   * Task 6.3B variable user-day helpers;
   * HistoricalPlan publication regression;
6. do not modify immutable Task artifacts.

Create:

`docs/implementation/phase-6/TASK_6.8_PLANNER_CONTEXTUAL_EVENT_FRICTION_WORKFLOW_CONVERGENCE_RESULT.md`

---

# 12. Mandatory Initial Workflow Audit

Before changing production behavior, trace the existing implementation mechanically.

Do not infer behavior from component names, comments, intended architecture, or prior task prose when production code/tests can answer the question.

Audit the complete current Manual Event workflow:

* create;
* edit;
* delete;
* all-day;
* timed;
* selected user-day;
* exact identity;
* incarnation/recreation;
* draft/write behavior;
* persistence;
* profile transport;
* Backup/restore;
* full clear;
* schedule staleness;
* Preview generation;
* HistoricalPlan publication.

Audit Review Schedule occurrences by source family.

For each source family determine:

* frozen/current display identity;
* source family;
* exact current authored reference availability;
* whether the occurrence can truthfully navigate to an editor;
* which editor owns that source;
* whether editing is actually supported;
* what happens after source deletion/recreation;
* what happens after profile replacement, restore, or full clear.

At minimum inspect:

* ordinary Commitment occurrences;
* Sleep;
* Work;
* Events;
* generated/system occurrences;
* unplaced candidates;
* friction participants.

Audit the existing friction path end to end:

```text
generated occurrence
    ↓
friction detection
    ↓
friction point
    ↓
suggested fix
    ↓
Try
    ↓
Apply Planning Change
    ↓
canonical authored state / PlanDecision effect
    ↓
recomputed Review Schedule state
```

Determine exactly what Try changes.

Determine exactly what Apply Planning Change changes.

Determine exactly when either operation:

* mutates authored setup;
* mutates only derived Preview;
* records PlanDecision state;
* recomputes friction;
* changes Preview staleness;
* persists.

Do not normalize these behaviors merely because a cleaner UI model would be convenient.

---

# 13. Required Workflow Classification

Classify every relevant interaction as one of:

### A. Authored-intent edit

Changes current Planner-authored scheduling state.

### B. Anchored-event edit

Changes canonical manual-event authored state.

### C. Derived-plan inspection

Reads generated Preview / Review Schedule only.

### D. Bounded planning remediation

Uses existing friction / suggested-fix / PlanDecision semantics.

### E. Navigation only

Changes surface or contextual selection without mutating authority.

### F. Unsupported

No truthful current workflow exists.

Use this classification to determine which contextual actions the UI may expose.

---

# 14. Stop Conditions

Stop and report if:

* Review Schedule cannot resolve exact authored identity for a proposed Edit action;
* contextual Event authoring requires a second Event write path;
* Event editing requires bypassing existing persistence semantics;
* Review Schedule → Plan navigation requires authority mutation merely to navigate;
* existing friction remediation cannot support the proposed Resolution option without widening semantics;
* a Resolution option requires Goal, Progress, Capacity, Recommendation, or transition-adaptation inference;
* applying an existing fix cannot be mechanically distinguished from editing authored intent;
* variable-duration user-day semantics would be lost;
* lazy Plan loading creates duplicate `SetupDraft` ownership;
* source recreation could cause an old contextual reference to target a new incarnation;
* implementation requires scheduler redesign;
* implementation requires recurrence redesign;
* implementation requires a new Backup version;
* protected/unavailable authority would need to be interpreted as empty;
* bundle limits cannot be met without threshold inflation.

Never resolve a stop condition through title/time matching.

---

# 15. Selected User-Day as Context

Audit whether Planner's existing selected Review Schedule user-day can serve as the contextual entry point for Event authoring.

Where mechanically supported, prefer:

```text
Review Schedule
    selected day: Tuesday

    Add Event
```

rather than asking the user to select Tuesday again.

There must remain one canonical selected-user-day meaning.

Do not introduce a second selected date merely for Event workflows.

---

# 16. Add Event

Expose **Add Event** where selected-day context makes it useful.

Reuse the existing Event authoring workflow.

Do not create another Event form if one already exists.

When Add Event is launched from a selected Review Schedule day, pre-scope the workflow to that exact canonical user-day where existing authority permits.

Navigation into Event creation performs no domain write by itself.

---

# 17. Event Product Language

Prefer user-facing language such as:

* Event;
* Add Event;
* Edit Event;
* All day;
* Starts;
* Ends.

Do not expose `ManualCalendarEvent` terminology in primary product UI.

---

# 18. Event vs Commitment

Preserve the semantic distinction.

A useful product model, if confirmed by the audit, is:

> **Commitments are things DayFrame makes time for. Events are things already anchored to a time/day.**

Do not force this wording if production semantics reveal an important exception.

Do not collapse Events into Commitments for visual symmetry.

---

# 19. Event Creation

Preserve existing canonical Event fields.

Do not widen Event schema for workflow symmetry.

Do not add commitment-style recurrence or priority fields unless the Event authority already owns them.

---

# 20. All-Day Events

Task 6.3B is governing.

All-day means **user-day-wide**, not civil-midnight-wide.

For user-day label `D`:

```text
start = start(D)
end   = start(D+1)
```

This must remain correct for:

* ordinary user-days;
* boundary increases;
* boundary decreases;
* supported DST cases.

Do not restore a 1,440-minute assumption.

Do not derive all-day status from interval duration.

---

# 21. Timed Events

Timed Events retain authored timed semantics.

A timed Event may span an entire canonical user-day and still remain timed.

HistoricalPlan V2 timing provenance must continue to distinguish:

```text
timing: { kind: "allDay" }
```

from:

```text
timing: { kind: "timed" }
```

even when the scheduled intervals are identical.

---

# 22. Edit Event

Review Schedule may expose **Edit Event** only when the generated occurrence retains sufficient exact provenance to resolve the current canonical Event.

Never resolve an Event editor by:

* title;
* displayed time;
* list position;
* visual similarity.

If the exact current source no longer exists, do not retarget.

If the Event was removed and recreated, the recreated incarnation is a different source.

Show truthful unavailable/read-only context instead.

---

# 23. Remove Event

Use existing Event removal semantics.

Preserve existing confirmation behavior where applicable.

Do not relabel removal as:

* archive;
* complete;
* skip;
* dismiss.

---

# 24. Event Persistence

Audit and preserve the existing Event write boundary.

If Event writes are independently durable, keep them independently durable.

If they participate in Setup Save, preserve that instead.

Do not force Event persistence into the Commitment `SetupDraft` merely for consistency.

---

# 25. Event Schedule Staleness

Preserve the exact existing rule.

Do not make Event writes behave like Commitment writes unless they already do mechanically.

Record whether create/edit/remove Event:

* writes immediately;
* marks Preview stale immediately;
* clears Preview;
* leaves Preview fresh;
* requires Save Setup;
* requires explicit Refresh Schedule.

Do not normalize these semantics for visual consistency.

---

# 26. Event Profile Semantics

Preserve existing profile behavior exactly.

Do not make Goals, ExecutionHistory, HistoricalPlan, or other authorities part of Event profile ownership unless they already are.

---

# 27. Event Backup/Restore

Preserve existing Backup/restore behavior.

Do not add a new Backup version merely because Event workflows become contextually reachable from Review Schedule.

---

# 28. Event Historical Boundary

Current Event edits and removals must never rewrite HistoricalPlan.

Published history remains frozen.

HistoricalPlan V1 timing remains `unavailableLegacy`.

HistoricalPlan V2 timing remains explicit frozen provenance.

Republication may create later historical truth according to existing publication semantics, but current authored state must never backfill older history.

---

# 29. Event Recreation

Removal and recreation must retain incarnation semantics.

An old Review Schedule/HistoricalPlan reference must not silently target the recreated Event.

---

# 30. Review Schedule Occurrence Interaction Audit

Audit every Review Schedule occurrence source and determine which actions are truthfully available.

Possible product actions include:

* Inspect;
* Edit Commitment;
* Edit Event;
* Edit Work;
* no authored edit.

Do not assume every scheduled item is editable.

---

# 31. Commitment Contextual Editing

Where a generated Commitment occurrence retains exact current template/recurrence identity, provide a contextual path to the exact Task 6.7 Commitment editor.

Target flow:

```text
Review Schedule
    Errands
        Edit Commitment
            ↓
    lazy-load Plan authoring
            ↓
    validate exact target still exists
            ↓
    open exact Errands editor
```

Navigation performs no write.

Do not capture a stale complete `SetupDraft` before lazy loading.

After the authoring chunk loads, revalidate the exact target against current canonical state.

---

# 32. Missing Commitment Target

If the target disappears while authoring loads:

* do not open another similarly named Commitment;
* do not retarget by title;
* do not retarget by source family;
* return to stable Planner context;
* explain that the Commitment is no longer available to edit.

---

# 33. Lazy Authoring Interoperability

Task 6.7's loading architecture remains governing.

Contextual editing from Review Schedule must load the existing Plan authoring boundary.

Do not statically import the heavy authoring tree into the eager Planner shell.

Do not create a second draft across the lazy boundary.

Authority bootstrap remains eager.

Recovery remains eager.

Plan authoring remains lazy.

---

# 34. Sleep

Sleep uses the ordinary Commitment path unless the source audit proves otherwise.

Do not create a special Sleep editor merely because Sleep has scheduling significance.

Do not add transition-sleep intelligence.

---

# 35. Work

Audit Work provenance carefully.

If a generated Work occurrence can truthfully identify an exact authored Work configuration target, expose that target.

If Work is structurally generated from multiple shift/cycle inputs and no singular exact editor target exists:

* navigate only to the appropriate Work configuration area;
* do not claim exact field targeting.

No new Work authority.

---

# 36. Generated or System Occurrences

Generated/system occurrences without a user-editable authored source remain read-only.

Do not manufacture an editor merely because other scheduled items have one.

---

# 37. Unplaced Commitments

Where an unplaced candidate retains exact authored Commitment identity, consider exposing **Edit Commitment**.

This is authored-intent editing.

It is not a Resolution option.

DayFrame may truthfully say:

> DayFrame could not place this commitment in the generated schedule.

Do not claim without explicit deterministic evidence:

* the Commitment is impossible;
* the user lacks Capacity;
* priority caused the failure;
* the Commitment itself failed;
* the user should remove it.

---

# 38. Friction Product Model

Friction remains deterministic evidence about the generated schedule.

It is not:

* Recommendation;
* Goal judgment;
* Capacity judgment;
* execution outcome;
* user failure.

Continue the Task 6.6 product terminology:

```text
internal:
    friction point
    suggested fix

product:
    Needs attention
    Resolution option
```

Internal domain identifiers do not need renaming.

---

# 39. Needs Attention

Each Needs attention item should expose enough deterministic context for the user to understand:

* which scheduled items are involved;
* when;
* the condition identified by the existing friction detector;
* which bounded Resolution options are available.

Do not introduce causal prose beyond the evidence produced by the existing detector.

---

# 40. Friction Participant Editing

Where a friction participant has exact current authored identity, it may expose its corresponding contextual editor.

Example:

```text
Needs attention

Sleep overlaps Work

[Edit Sleep]    [Resolution options]
```

**Edit Sleep** and **Resolution options** are semantically different actions.

Edit Sleep means:

> Change what I told DayFrame.

Resolution option means:

> Apply this bounded deterministic planning remediation.

Do not merge them.

---

# 41. Resolution Options

A Resolution option is the product presentation of existing supported suggested-fix semantics.

It is not Recommendation V1.

Do not widen suggested-fix semantics in Task 6.8.

Do not label Resolution options:

* Best;
* Recommended;
* Optimal;
* Smart choice.

unless current deterministic architecture explicitly establishes such ranking.

Goals must not rank, hide, or automatically apply Resolution options.

Shift-transition architecture must not be used here to recommend sleep changes, workload reduction, or Goal reorientation.

---

# 42. Try

Trace and preserve the exact existing Try behavior.

Determine mechanically whether Try:

* mutates derived Preview only;
* creates temporary PlanDecision state;
* performs another reversible operation;
* marks the schedule stale;
* recomputes friction;
* touches authored state;
* persists anything.

Describe it according to what production actually does.

Do not present Try as persistent if it is not.

---

# 43. Apply Planning Change

Preserve the Task 6.6 product language:

**Apply Planning Change**

This applies one bounded planning remediation.

It does not accept the entire generated schedule.

Applying one Resolution option must not automatically apply other available options.

Trace and test the exact resulting state:

* authored-state mutation, if any;
* PlanDecision recording, if any;
* Preview mutation;
* friction recomputation;
* stale/fresh status;
* persistence behavior.

Do not change these semantics merely to make the workflow look simpler.

---

# 44. Authored Edit vs Resolution

The UI must preserve the distinction:

### Edit Commitment / Edit Event

> Change what I told DayFrame.

### Apply Planning Change

> Apply this specific deterministic schedule remediation.

This distinction is architecturally important.

---

# 45. Post-Resolution State

Audit what happens after applying a planning change:

* whether Review Schedule recomputes;
* whether friction disappears;
* whether schedule remains fresh;
* whether authored setup changes;
* whether a PlanDecision is recorded;
* whether another explicit Refresh is required.

Expose only the actual result.

---

# 46. Multiple Resolution Options

If multiple supported options exist:

* preserve each exact option;
* do not auto-select one;
* do not auto-apply the rest;
* do not invent ranking.

---

# 47. Goal Boundary

Goals may remain visible in Plan but do not participate in contextual friction resolution.

Do not:

* rank fixes by Goal relationship;
* mutate Goal lifecycle;
* mutate Goal links;
* infer Goal priority.

---

# 48. Transition Boundary

The canonical shift-transition architecture remains available as temporal truth only.

Do not use it in Task 6.8 to recommend:

* transition Sleep;
* reduced load;
* temporary reprioritization;
* Goal reorientation;
* adaptation strategies.

---

# 49. Plan ↔ Review Schedule Navigation

Preserve useful ephemeral context when moving between Plan and Review Schedule.

Potential context includes:

* selected user-day;
* exact Commitment target;
* Event target;
* Work configuration target;
* return focus target.

This navigation context is ephemeral application/UI state.

It is not domain authority and must not be persisted as such.

---

# 50. Return From Commitment Editing

After editing a Commitment reached from Review Schedule, provide a natural return path to Review Schedule.

Do not automatically regenerate the schedule.

If the user has unsaved draft changes, preserve truthful dirty-state behavior.

If Save Setup has occurred and the generated schedule is stale, returning to Review Schedule should:

* retain the old generated schedule;
* expose the existing stale notice;
* require explicit Refresh Schedule.

---

# 51. Return From Event Editing

After Event creation/editing from selected-day Review context, return to the same selected canonical user-day where possible.

Preserve whatever schedule-freshness behavior the canonical Event write path actually establishes.

---

# 52. Schedule Staleness Audit

Mechanically establish the behavior of:

| Action                                | Expected audit           |
| ------------------------------------- | ------------------------ |
| navigate to editor                    | no mutation expected     |
| type in local Commitment form         | local-only               |
| Add/Update Commitment into SetupDraft | Task 6.7 semantics       |
| Save Setup                            | canonical stale behavior |
| create/edit Event                     | actual Event rule        |
| Try                                   | actual current rule      |
| Apply Planning Change                 | actual current rule      |
| Goal edit                             | no schedule effect       |
| Today report                          | no schedule effect       |

For each determine:

* local draft mutation;
* durable mutation;
* Preview mutation;
* schedule stale state;
* automatic regeneration.

Do not normalize differing semantics for aesthetic reasons.

---

# 53. Existing Schedule Visibility

Where canonical behavior marks Review Schedule stale:

* retain the old generated schedule;
* communicate stale state;
* require explicit Refresh.

No automatic regeneration.

---

# 54. HistoricalPlan Boundary

Contextual editing operates on current authored state.

Review Schedule remains Preview-derived generated review.

HistoricalPlan remains publication/history.

Do not use HistoricalPlan as the current edit target.

---

# 55. Today Boundary

Today remains:

* canonical current user-day;
* effective HistoricalPlan;
* ExecutionHistory reporting.

Do not move Event/Commitment editing into Today.

Do not write ExecutionHistory from Planner.

Do not advance Today cutoff.

---

# 56. Summary Boundary

Summary remains historical interpretation.

No Event editing.

No Commitment editing.

No friction resolution.

No authored writes.

---

# 57. Derived Navigation Metadata

If Review Schedule currently lacks sufficient navigation provenance, a narrow extension to derived Preview metadata is permitted only when it:

* derives from existing canonical source identity;
* does not change scheduler behavior;
* does not change persistence;
* does not create new durable authority;
* exists solely to enable truthful contextual navigation.

If supporting contextual editing requires changing durable identity semantics, stop.

---

# 58. Navigation State Ownership

Prefer `DayFrameApp` / Planner composition ownership for cross-surface navigation.

Leaf components should emit navigation/edit intent rather than own application navigation.

Do not persist contextual navigation state.

---

# 59. Protection and Unavailable State

Protected or unavailable authored authority must never appear as an editable empty state.

If a generated occurrence refers to a source that is no longer available:

* preserve the generated occurrence for inspection where appropriate;
* omit or disable the authored Edit action;
* provide truthful unavailable context.

Do not call the data corrupted unless actual corruption is established.

---

# 60. Profile Replacement

Profile load may invalidate an open contextual editor target.

After replacement:

* revalidate exact target identity;
* close or invalidate unavailable editors;
* do not apply stale local edits to replacement state;
* preserve stable Planner navigation where possible.

---

# 61. Restore Replacement

Restore has the same replacement boundary.

Do not apply stale local authoring state to restored authority.

---

# 62. Full Clear

Full clear must:

* invalidate open Event/Commitment/Work targets;
* clear stale contextual navigation state;
* return to stable Planner context;
* not resurrect old Review selection/editor state.

---

# 63. Component Reuse

Strongly prefer reuse/recomposition of:

* Task 6.7 Commitment editor;
* existing Event editor;
* existing Work Hours / Work Schedule controls.

Do not create Review-specific duplicate editors.

---

# 64. Commitment Editor Reuse

Review Schedule contextual editing must load and use the exact Task 6.7 Commitment editor.

No second Commitment form.

No separate draft.

---

# 65. Event Editor Reuse

Reuse the current Event editor.

One form may be reachable from multiple contextual entry points while still using one canonical state/write path.

---

# 66. Work Editor Reuse

Reuse existing Work configuration.

Do not create a Review-specific Work form.

---

# 67. Variable-Day Display

Any selected-day detail showing duration or timeline must use actual canonical window length.

No fixed 24-hour presentation assumption.

---

# 68. Boundary Transition Regression

Include at minimum:

```text
03:00 → 06:00
06:00 → 03:00
```

Verify Event and Review Schedule contextual behavior remains attached to the canonical user-day label/window.

---

# 69. DST Regression

Use existing supported DST testing conventions.

Do not introduce timezone-selection infrastructure.

---

# 70. Focus

Focus behavior must be deterministic.

At minimum:

* Add Event opens its intended first field/heading;
* Edit Event opens the exact Event editor;
* Edit Commitment opens the exact Commitment editor after lazy load;
* cancel returns to originating action where practical;
* completion returns to a stable relevant item/region;
* unavailable target returns to stable Planner context.

---

# 71. Accessibility

Contextual actions must have target-specific accessible names where needed.

Examples:

* **Edit commitment Errands**
* **Edit event Dentist appointment**

When lazy Plan authoring opens:

* render/announce the intended editing region appropriately;
* move focus deterministically to the intended editor.

Needs attention must expose:

* semantic heading/context;
* textual participant information;
* named Resolution option controls;
* contextual Edit actions where supported.

Conflict meaning must not depend on color alone.

Destructive Event removal retains explicit confirmation.

All contextual actions must remain keyboard operable.

---

# 72. Responsive Behavior

Do not require desktop-only side-by-side interaction.

Contextual workflows must remain usable at narrow widths.

---

# 73. Mobile

Mobile Needs attention should stack naturally:

```text
Needs attention
    description
    participants
    contextual edit
    Resolution options
```

Event and Commitment editors must remain usable in a single-column layout.

No horizontal dependency.

---

# 74. Desktop

Contextual actions may sit adjacent to plan items, but DOM/focus order must remain logical.

---

# 75. Loading Architecture

Preserve Task 6.7's sustainable split.

Task 6.7 baseline:

```text
Initial raw        645,225
Initial gzip       163,500
Plan authoring      49,795
Today query          4,890
Today UI            11,282
Summary             30,100
Largest lazy        49,795
Total JS           741,293
```

Contextual editing from Review Schedule must load the existing Plan authoring boundary rather than pulling Commitment/Work editors back into the eager shell.

---

# 76. Eager-Bundle Preservation

Do not statically import the heavy authoring tree merely to support contextual navigation.

Use an intent/reference that the lazy authoring surface consumes after loading.

---

# 77. Runtime Dependency Assessment

No new runtime dependency.

Mandatory.

---

# 78. Bundle Constraints

Existing fixed guards remain:

```text
Initial raw   <= 685,000
Initial gzip  <= 170,000
Largest lazy  <= 100,000
Total JS      <= 750,000
```

Task 6.8 begins with approximately **8.7 KB raw total-JS headroom**.

Prefer reuse over duplication.

Do not raise thresholds.

---

# 79. Bundle Stop Condition

If truthful implementation cannot fit without:

* duplicate editors;
* a new runtime dependency;
* threshold increase;
* authority collapse;
* semantic shortcut;

stop and report.

Architectural reuse is preferred to byte-level hacks.

---

# 80. Tests — Event Workflow

Cover:

* selected-day Add Event;
* timed Event;
* all-day Event;
* edit;
* cancel;
* removal;
* exact identity;
* recreation;
* return to selected day.

---

# 81. Tests — Variable-Day Event

Cover all-day geometry for:

* ordinary canonical user-day;
* longer boundary-transition day;
* shorter boundary-transition day;
* supported DST fixture.

---

# 82. Tests — Commitment Contextual Navigation

From Review Schedule cover:

* exact occurrence → exact Commitment;
* lazy Plan load;
* correct editor;
* deterministic focus;
* cancel;
* edit;
* missing target;
* recreated target does not retarget.

---

# 83. Tests — Sleep

Sleep uses the ordinary exact Commitment path.

---

# 84. Tests — Work

Cover whichever Work contextual path the audit authorizes.

Assert no false exact target if provenance is ambiguous.

---

# 85. Tests — Unplaced

Exact source → Edit Commitment where supported.

No unsupported Capacity or causal claims.

---

# 86. Tests — Friction

Cover:

* Needs attention;
* participant identity;
* Resolution options;
* contextual authored Edit separately;
* multiple Resolution options;
* no automatic cascade.

---

# 87. Tests — Try

Verify exact existing mutation/non-mutation semantics.

---

# 88. Tests — Apply Planning Change

Verify:

* existing bounded effect;
* resulting recomputation;
* no whole-plan acceptance.

---

# 89. Tests — Staleness

Mechanically verify the actual staleness matrix.

---

# 90. Tests — Replacement

Cover:

* profile load;
* restore;
* full clear;
* source removal;
* source recreation.

Stale contextual targets must not survive incorrectly.

---

# 91. Tests — Protection

Protected authority must never become editable empty state.

---

# 92. Tests — Historical Boundary

Current Event/Commitment edits leave existing HistoricalPlan snapshots unchanged.

---

# 93. Tests — Today Boundary

No ExecutionHistory writes.

No Today cutoff changes.

---

# 94. Tests — Goal Boundary

No Goal lifecycle/link mutation from Event, friction, or contextual editing workflows.

---

# 95. Tests — Accessibility

Cover:

* contextual accessible names;
* lazy editor focus;
* return focus;
* Needs attention semantics;
* named Resolution options;
* destructive Event confirmation;
* keyboard operation.

---

# 96. Tests — Loading

Verify contextual editing does not re-eagerize Plan authoring in production architecture where mechanically testable.

---

# 97. Tests — Product Terminology

Primary product UI should use:

* Event;
* Commitment;
* Needs attention;
* Resolution option;
* Apply Planning Change.

Avoid primary product-facing:

* `ManualCalendarEvent`;
* friction point;
* suggested fix;
* block template.

Internal code may retain canonical domain terms.

---

# 98. Required Workflow Classification Matrix

| Interaction           | Classification | Authority mutated | Surface |
| --------------------- | -------------- | ----------------- | ------- |
| Add Event             |                |                   |         |
| Edit Event            |                |                   |         |
| Edit Commitment       |                |                   |         |
| Edit Work             |                |                   |         |
| inspect occurrence    |                |                   |         |
| inspect friction      |                |                   |         |
| Try                   |                |                   |         |
| Apply Planning Change |                |                   |         |

---

# 99. Required Event Matrix

| Concern                 | Canonical behavior | Changed in 6.8? |
| ----------------------- | ------------------ | --------------: |
| authority               |                    |                 |
| identity                |                    |                 |
| persistence             |                    |                 |
| profile ownership       |                    |                 |
| Backup/restore          |                    |                 |
| all-day meaning         |                    |                 |
| timed meaning           |                    |                 |
| recreation              |                    |                 |
| staleness               |                    |                 |
| historical immutability |                    |                 |

---

# 100. Required Occurrence Action Matrix

| Occurrence source     | Exact current identity available? | Contextual action | Fallback |
| --------------------- | --------------------------------: | ----------------- | -------- |
| ordinary Commitment   |                                   |                   |          |
| Sleep                 |                                   |                   |          |
| Work                  |                                   |                   |          |
| Event                 |                                   |                   |          |
| generated/system      |                                   |                   |          |
| unavailable/recreated |                                   |                   |          |

---

# 101. Required Friction Matrix

| Friction evidence       | May expose                               | Must not infer             |
| ----------------------- | ---------------------------------------- | -------------------------- |
| overlapping items       | participants + exact interval            | execution                  |
| unplaced candidate      | authored source + unplaced state         | insufficient Capacity      |
| suggested fix           | Resolution option                        | Recommendation superiority |
| applied fix             | bounded planning change                  | whole-plan acceptance      |
| no fix                  | Needs attention only                     | unsolvable                 |
| Goal-linked participant | existing relationship if otherwise shown | Goal priority              |

---

# 102. Required Staleness Matrix

| Action                | Draft mutation | Durable mutation | Schedule stale | Auto-refresh |
| --------------------- | -------------: | ---------------: | -------------: | -----------: |
| navigate              |                |                  |                |              |
| type Commitment edit  |                |                  |                |              |
| Update Commitment     |                |                  |                |              |
| Save Setup            |                |                  |                |              |
| Add/Edit Event        |                |                  |                |              |
| Try                   |                |                  |                |              |
| Apply Planning Change |                |                  |                |              |
| Goal edit             |                |                  |                |              |
| Today outcome report  |                |                  |                |              |

---

# 103. Required Identity Matrix

| Context              | Identity source | Retarget allowed? |
| -------------------- | --------------- | ----------------: |
| Commitment card      |                 |                No |
| scheduled Commitment |                 |                No |
| unplaced Commitment  |                 |                No |
| Event                |                 |                No |
| Work                 |                 |             audit |
| friction participant |                 |                No |
| recreated source     | new incarnation |                No |

---

# 104. Required Replacement Matrix

| Replacement       | Open Event editor | Open Commitment editor | Review selection |
| ----------------- | ----------------- | ---------------------- | ---------------- |
| profile load      |                   |                        |                  |
| restore           |                   |                        |                  |
| full clear        |                   |                        |                  |
| source removal    |                   |                        |                  |
| source recreation |                   |                        |                  |

---

# 105. Required Surface Matrix

| Capability                 |                    Plan |            Review Schedule |                  Today |    Summary |
| -------------------------- | ----------------------: | -------------------------: | ---------------------: | ---------: |
| Add Commitment             |                     Yes | contextual navigation only |                     No |         No |
| Edit Commitment            |                     Yes | contextual navigation only |                     No |         No |
| Add Event                  | contextual selected-day |           contextual entry |                     No |         No |
| Edit Event                 | contextual selected-day |      contextual navigation |                     No |         No |
| Edit Work                  |                     Yes |     navigation if truthful |                     No |         No |
| inspect generated schedule |                      No |                        Yes | published-current only | historical |
| resolve friction           |                      No |                        Yes |                     No |         No |
| report outcome             |                      No |                         No |                    Yes |         No |

Refine from mechanical evidence.

---

# 106. Required Loading Matrix

| Workflow                    | Eager component | Lazy component | Authority ownership |
| --------------------------- | --------------- | -------------- | ------------------- |
| inspect Review Schedule     |                 |                |                     |
| Edit Commitment from Review |                 |                |                     |
| Edit Work from Review       |                 |                |                     |
| Add/Edit Event              |                 |                |                     |
| recovery                    |                 |                |                     |

---

# 107. Required Bundle Matrix

| Metric         |     6.7 | 6.8 | Delta |
| -------------- | ------: | --: | ----: |
| Initial raw    | 645,225 |     |       |
| Initial gzip   | 163,500 |     |       |
| Plan authoring |  49,795 |     |       |
| Today query    |   4,890 |     |       |
| Today UI       |  11,282 |     |       |
| Summary        |  30,100 |     |       |
| Largest lazy   |  49,795 |     |       |
| Total JS       | 741,293 |     |       |

Record any newly created chunk separately.

---

# 108. Required Accessibility Matrix

| Interaction        | Requirement                    |
| ------------------ | ------------------------------ |
| Add Event          | selected-day context announced |
| Edit Event         | contextual accessible name     |
| Edit Commitment    | contextual accessible name     |
| Edit Work          | truthful target name           |
| lazy editor open   | deterministic focus            |
| cancel/complete    | deterministic return focus     |
| Needs attention    | semantic heading/context       |
| Resolution option  | named action                   |
| remove Event       | explicit confirmation          |
| unavailable target | textual explanation            |

---

# 109. Required Product-Boundary Matrix

| Capability                   | Task 6.8        |
| ---------------------------- | --------------- |
| Event contextual workflow    |                 |
| new Event authority          | Prohibited      |
| Event → Commitment collapse  | Prohibited      |
| Commitment contextual edit   |                 |
| Work contextual path         | audit-dependent |
| friction presentation        |                 |
| friction algorithm redesign  | Prohibited      |
| Resolution options           |                 |
| Recommendations              | Prohibited      |
| Goal-based resolution        | Prohibited      |
| transition adaptation        | Prohibited      |
| direct schedule manipulation | Prohibited      |
| Today writes                 | Prohibited      |
| Summary writes               | Prohibited      |
| scheduler redesign           | Prohibited      |

---

# 110. Required Epistemic Matrix

| Evidence/state       | DayFrame may say                           | Must not say                        |
| -------------------- | ------------------------------------------ | ----------------------------------- |
| authored Event       | anchored Event exists                      | Event occurred                      |
| authored all-day     | intended for whole user-day                | occupied civil midnight-to-midnight |
| scheduled occurrence | planned at this interval                   | executed                            |
| unplaced             | not placed in generated schedule           | impossible                          |
| overlap friction     | generated intervals conflict               | user failed                         |
| Resolution option    | deterministic bounded remediation          | best Recommendation                 |
| no Resolution option | no supported fix offered                   | impossible to resolve               |
| stale schedule       | schedule predates governed authored change | schedule is invalid                 |
| missing edit target  | current source unavailable                 | corrupted                           |
| recreated source     | distinct current incarnation               | same historical thing               |
| Goal link            | exact relationship                         | priority for resolution             |
| shift transition     | authored regime change                     | adaptation required                 |

---

# 111. Architectural Invariants

Assess at minimum:

1. Planner remains the sole generic authored-planning surface.
2. Review Schedule remains derived generated-plan review.
3. Today remains published-plan execution/reporting.
4. Summary remains historical interpretation.
5. Events remain anchored authored calendar facts.
6. Events do not become generic Commitments.
7. one Event write path remains.
8. one Commitment `SetupDraft` remains.
9. contextual navigation adds no authority.
10. navigation state remains ephemeral.
11. exact source identity governs contextual actions.
12. title matching is prohibited.
13. time matching is prohibited.
14. source recreation never retargets.
15. missing source does not become another source.
16. Commitment editor is reused.
17. Event editor is reused.
18. Work editor is reused where applicable.
19. no Review-specific duplicate editors exist.
20. selected user-day retains one canonical ownership model.
21. variable-duration days remain canonical.
22. all-day means user-day-wide.
23. timed full-day Event remains timed.
24. DST semantics remain canonical.
25. boundary increase remains canonical.
26. boundary decrease remains canonical.
27. Event persistence semantics remain unchanged.
28. Event profile semantics remain unchanged.
29. Event Backup/restore semantics remain unchanged.
30. Event full-clear semantics remain unchanged.
31. Historical snapshots remain immutable.
32. HistoricalPlan V2 timing provenance remains unchanged.
33. current Event edits never rewrite HistoricalPlan.
34. current Commitment edits never rewrite HistoricalPlan.
35. Review Schedule continues to use Preview.
36. Preview does not become authored authority.
37. friction remains derived.
38. friction algorithm semantics remain unchanged.
39. Resolution option remains existing suggested-fix semantics.
40. Resolution option is not Recommendation.
41. no unsupported ranking claim is added.
42. Goals do not rank fixes.
43. shift transitions do not rank fixes.
44. no Capacity inference is introduced.
45. no execution inference is introduced.
46. unplaced remains distinct from friction.
47. unplaced does not imply insufficient Capacity.
48. authored editing remains distinct from resolution.
49. Apply Planning Change remains bounded.
50. Apply Planning Change does not accept the whole schedule.
51. Try semantics remain unchanged.
52. no automatic resolution cascade exists.
53. no auto-regeneration exists.
54. stale generated schedule remains visible.
55. explicit Refresh remains required.
56. local Commitment typing does not stale schedule.
57. Commitment draft updates retain Task 6.7 semantics.
58. Save Setup retains canonical staleness semantics.
59. Event staleness retains existing semantics.
60. Goal edits do not stale schedule.
61. Today reports do not stale schedule.
62. navigation does not stale schedule.
63. profile replacement invalidates stale targets.
64. restore invalidates stale targets.
65. full clear invalidates stale targets.
66. protected authority never appears as editable empty state.
67. unavailable edit target is represented truthfully.
68. Work navigation does not invent singular identity.
69. Sleep uses ordinary Commitment semantics.
70. generated/system items remain read-only where appropriate.
71. contextual actions preserve selected-day context where possible.
72. return navigation performs no write.
73. lazy loading performs no write.
74. Plan authoring remains lazy.
75. authority bootstrap remains eager.
76. recovery remains eager.
77. contextual editing does not re-eagerize Plan authoring.
78. no duplicate draft is created across the lazy boundary.
79. lazy targets are revalidated after load.
80. focus after lazy load is deterministic.
81. focus return is deterministic.
82. contextual actions remain keyboard accessible.
83. friction meaning is not color-only.
84. destructive Event actions remain explicit.
85. mobile has no horizontal dependence.
86. no generic Event authority is added.
87. no generic Commitment authority is added.
88. no new persistence participant is added.
89. no Backup version is added unless a stop condition proves one necessary.
90. no scheduler input is added.
91. no scheduler algorithm is redesigned.
92. no recurrence redesign occurs.
93. no drag/drop is added.
94. no resize is added.
95. no pin/lock is added.
96. no Capacity is implemented.
97. no Planned Allocation is implemented.
98. no Recommendations are implemented.
99. no transition adaptation is implemented.
100. no automatic Goal reorientation is implemented.
101. Pattern Library remains deferred.
102. bundle guards remain unchanged.
103. initial raw remains `<= 685,000`.
104. initial gzip remains `<= 170,000`.
105. largest lazy remains `<= 100,000`.
106. total JS remains `<= 750,000`.
107. no runtime dependency is added.
108. full canonical validation passes.
109. governance records the resulting workflow.
110. Task 6.9 is not implicitly implemented.

Classify each invariant as:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Not applicable;
* Blocked.

---

# 112. Focused Validation

Run the relevant focused suites, including:

* `DayFrameApp`;
* `PlannerSurface`;
* `PreviewScreen` / Review Schedule;
* `CommitmentSection`;
* `SetupScreen`;
* manual-event domain/store/UI;
* `generateSchedulePreview`;
* friction detection;
* suggested fixes;
* PlanDecision/revision;
* variable-duration user-day behavior;
* HistoricalPlan publication regression;
* Goal-link identity;
* profile replacement;
* restore;
* full clear;
* lazy surface/loading tests.

Record exact files and test counts.

---

# 113. Full Validation

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
* total tests;
* transformed modules;
* initial raw;
* initial gzip;
* Plan authoring chunk;
* Today query chunk;
* Today UI chunk;
* Summary chunk;
* any new lazy chunks;
* largest lazy chunk;
* total JavaScript.

---

# 114. Manual Product Walkthrough

If browser access is available, inspect:

### Event

* selected-day Add Event;
* timed Event;
* all-day Event;
* Edit Event;
* cancel;
* remove;
* return to selected day.

### Commitment

* Review Schedule item;
* Edit Commitment;
* lazy load;
* exact target;
* edit/cancel;
* return;
* Save Setup;
* stale schedule;
* Refresh.

### Sleep

* contextual Commitment edit.

### Work

* contextual Work navigation if implemented.

### Friction

* Needs attention;
* participants;
* contextual edit;
* Resolution options;
* Try;
* Apply Planning Change;
* resulting schedule/friction state.

### Replacement

* profile load while editor open;
* restore;
* full clear;
* source removal/recreation.

### Transition day

* longer day;
* shorter day;
* all-day Event.

### Mobile

* contextual controls;
* friction;
* forms.

If browser access is unavailable, state that explicitly.

Do not claim manual validation that was not performed.

---

# 115. Governance

Create:

`docs/implementation/phase-6/TASK_6.8_PLANNER_CONTEXTUAL_EVENT_FRICTION_WORKFLOW_CONVERGENCE_RESULT.md`

Update:

* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Create an ADR only if Task 6.8 establishes a genuinely new enduring architectural rule.

No ADR is expected merely for contextual navigation over already-governed authorities.

---

# 116. Required Result Artifact

The result artifact must include at least:

1. Executive Result
2. Artifact Integrity
3. Task 6.7 Prerequisite Confirmation
4. Initial Workflow Audit
5. Files Changed
6. Manual Event Current Workflow
7. Event Authority
8. Event Identity
9. Event Persistence
10. Event Staleness
11. Event Profile Behavior
12. Event Backup/Restore
13. Event Historical Boundary
14. Event Recreation
15. Selected User-Day Ownership
16. Calendar Selection Audit
17. Add Event Placement
18. Add Event Workflow
19. Timed Event
20. All-Day Event
21. Variable-Day All-Day
22. Edit Event
23. Remove Event
24. Event Return Path
25. Event/Commitment Product Boundary
26. Review Schedule Occurrence Audit
27. Commitment Provenance
28. Commitment Contextual Edit
29. Lazy Authoring Interoperability
30. Missing Commitment Target
31. Sleep Contextual Edit
32. Work Provenance
33. Work Contextual Path
34. Generated/System Occurrences
35. Unplaced Context
36. Unplaced Epistemic Copy
37. Friction Current Workflow
38. Needs Attention
39. Friction Participant Provenance
40. Contextual Participant Editing
41. Resolution Options
42. Try Semantics
43. Apply Planning Change Semantics
44. Authored Edit vs Resolution
45. Post-Resolution State
46. Multiple Resolution Options
47. Goal Boundary
48. Transition Boundary
49. Plan/Review Navigation
50. Return to Review Schedule
51. Staleness Matrix
52. Existing Schedule Visibility
53. HistoricalPlan Boundary
54. Today Boundary
55. Summary Boundary
56. Derived Navigation Metadata
57. Navigation State Ownership
58. Protection
59. Profile Replacement
60. Restore Replacement
61. Full Clear
62. Component Reuse
63. Commitment Editor Reuse
64. Event Editor Reuse
65. Work Editor Reuse
66. Variable-Day Display
67. Boundary Transition Regression
68. DST Regression
69. Focus
70. Accessibility
71. Responsive Behavior
72. Mobile
73. Desktop
74. Loading Architecture
75. Eager-Bundle Preservation
76. Runtime Dependency Assessment
77. Tests Added/Changed
78. Focused Validation
79. Full Validation
80. Bundle Validation
81. Manual Product Walkthrough
82. Governance Updates
83. ADR Determination
84. Deviations
85. Discoveries
86. Deferred Work
87. Workflow Classification Matrix
88. Event Matrix
89. Occurrence Action Matrix
90. Friction Matrix
91. Staleness Matrix
92. Identity Matrix
93. Replacement Matrix
94. Surface Matrix
95. Loading Matrix
96. Bundle Matrix
97. Accessibility Matrix
98. Product-Boundary Matrix
99. Epistemic Matrix
100. Architectural Invariant Assessment
101. Stop-Condition Assessment
102. Architectural Alignment Assessment
103. Task 6.9 Readiness
104. Recommended Next Task
105. Final Completion Determination

---

# 117. Task 6.9 Readiness

If Task 6.8 completes cleanly, Phase 6 should now approximately express:

```text
Planner
    authored intent
    generated schedule review
    contextual resolution

Today
    current published plan
    execution reporting

Summary
    historical evidence
    progress interpretation
```

Do not assume another large implementation feature is required.

Task 6.9 should audit the remaining Phase 6 surface-convergence gaps.

Likely audit targets include:

* remaining Setup escape-hatch debt;
* Planner navigation cleanup;
* Today/Planner contextual boundaries;
* Summary navigation;
* terminology residue;
* loading/performance cleanup;
* mobile coherence;
* remaining Phase 6 completion gaps.

Do not pre-authorize those changes during Task 6.8.

---

# 118. Recommended Next Task

If green:

> **Task 6.9 — Phase 6 Surface-Convergence Gap Audit.**

---

# 119. Completion Criteria

Task 6.8 is complete only when:

* Event, Review Schedule, and friction workflows have been mechanically traced;
* relevant interactions have been classified by authority and purpose;
* Events remain distinct anchored authored facts;
* one Event write path remains;
* selected-user-day context is reused where mechanically possible;
* Add/Edit Event uses exact canonical identity;
* unavailable/recreated Events never retarget;
* all-day remains user-day-wide across ordinary, transition, and supported DST days;
* Event persistence/staleness/profile/restore behavior remains canonical;
* Review Schedule exposes authored editing only where exact provenance permits;
* ordinary Commitments and Sleep can reach the exact Task 6.7 editor where supported;
* Work exposes only a provenance-justified contextual path;
* generated/system items remain read-only where appropriate;
* unplaced Commitments may reach authored editing without becoming friction or Capacity evidence;
* Needs attention remains deterministic friction evidence;
* authored editing and Resolution options remain distinct;
* Resolution options retain existing suggested-fix semantics;
* Try retains existing semantics;
* Apply Planning Change remains bounded;
* no Recommendation ranking is introduced;
* no Goal-based resolution is introduced;
* no transition-based resolution is introduced;
* no automatic resolution cascade exists;
* Plan ↔ Review navigation preserves useful ephemeral context;
* returning from authored editing does not auto-refresh;
* stale schedule behavior remains canonical;
* current edits never rewrite HistoricalPlan;
* Today and Summary remain write-isolated;
* replacement, clear, deletion, and recreation safely invalidate stale contextual targets;
* protected authority never appears as editable empty state;
* existing editors are reused;
* Plan authoring remains lazy;
* contextual navigation does not re-eagerize the authoring tree;
* no runtime dependency is added;
* fixed bundle thresholds remain unchanged;
* total JavaScript remains within budget;
* accessibility, focus, replacement safety, mobile presentation, and exact identity are verified;
* focused validation passes;
* full canonical validation passes;
* governance is updated;
* Task 6.9 can audit remaining Phase 6 gaps without reopening the authority boundaries established here.

---

# 120. Final Implementation Principle

> **The Planner should feel unified because actions appear where the user needs them—not because distinct truths were collapsed into one data model.**

An Event can be reached from the schedule and still remain an Event.

A Commitment can be edited from a generated occurrence and still remain authored intent.

A conflict can offer a Resolution option and still remain derived evidence.

**Context connects them. Authority keeps them correct.**

---

# 121. Final Completion Statement

**Task 6.8 is complete when Planner's selected-day Event workflow, generated occurrence interactions, and Needs-attention resolution workflow operate as one coherent contextual experience while preserving the distinct canonical authorities beneath them; when Events remain anchored authored calendar facts with one exact write path, Commitments remain Task 6.7 projections over the singular scheduling draft, Work retains its truthful shift/cycle structure, and friction remains derived deterministic evidence with bounded Resolution options rather than becoming Recommendations; when Review Schedule can navigate to exact current authored editors only where provenance proves the target, never by title, time, similarity, or recreated identity; when contextual navigation and lazy loading introduce no writes, duplicate drafts, alternate persistence, or eager-authoring regression; when all-day Events remain user-day-wide across ordinary, transition, and supported DST days; when authored edits, Event writes, Try, Apply Planning Change, Save Setup, and navigation each retain their actual independent staleness and persistence semantics; when stale schedules remain visible and Refresh remains explicit; when current edits never rewrite HistoricalPlan, Today remains execution/reporting, Summary remains historical interpretation, and Goals do not influence friction resolution; when no scheduler redesign, recurrence redesign, direct manipulation, Capacity, Planned Allocation, Recommendation, transition adaptation, Pattern Library, or automatic Goal reorientation is introduced; when accessibility, focus, replacement safety, mobile presentation, exact identity, loading boundaries, fixed bundle guards, and full canonical validation are green; and when Task 6.9 can perform the Phase 6 convergence-gap audit without reopening the authority boundaries established here.**
