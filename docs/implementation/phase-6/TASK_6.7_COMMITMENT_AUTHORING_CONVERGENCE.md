# Task 6.7 — Commitment Authoring Convergence

## Status

Ready for implementation.

## Phase

Phase 6 — Product-Surface Convergence

## Task Type

Planner authored-intent workflow convergence, commitment inventory and contextual authoring, existing authored-model projection, add/edit workflow composition, Pattern Library contextualization audit, Setup decomposition, singular-draft/write-path preservation, schedule-staleness preservation, exact identity/lifecycle preservation, responsive/accessibility work, intentional loading architecture, bundle remediation, regression testing, and governance.

**This task does not create a new generic Commitment authority or schema. It does not redesign scheduling semantics, add drag/drop/direct placement, implement Recommendations, implement transition adaptation, or change Today/Summary.**

---

# 1. Objective

Evolve Planner / Plan from a broad implementation-oriented Setup form toward the intended product workflow:

```text
Planner
    Plan
        Goals
        Commitments
            review authored commitments
            Add Commitment
            Edit Commitment
            contextual Use Pattern
        Schedule Preferences
    Review Schedule
```

The user should increasingly think:

> **These are the things I want DayFrame to make time for.**

rather than:

> **These are the engine configuration structures I need to fill out.**

Task 6.7 converges presentation and workflow around the existing authored models. It must not manufacture a generic commitment domain merely because the UI uses the product word **Commitment**.

---

# 2. Governing Product Principle

> **Users define priorities and commitments; DayFrame builds schedules.**

A Commitment is a **product concept** encompassing existing authored sources that represent things DayFrame may schedule or preserve.

It is not automatically a new persisted entity.

---

# 3. Governing Authority Principle

Existing authored authorities remain authoritative.

Task 6.7 must first audit the actual authored source families, likely including some combination of:

* block templates;
* block recurrences;
* shift definitions;
* shift cycles/segments;
* manual calendar events;
* Sleep/default recovery configuration;
* other existing authored scheduling inputs.

Do not assume every source belongs in the same Commitment UX.

Do not introduce:

```text
Commitment {
  id
  type
  ...
}
```

as a new durable wrapper unless the audit proves an unavoidable architectural requirement and triggers a stop condition.

---

# 4. Governing Identity Principle

Product-facing Commitment rows/cards must retain exact underlying authored identity.

A UI projection may conceptually resemble:

```text
CommitmentSummary {
    sourceKind
    logicalId
    incarnation
    displayLabel
    authoredKind
}
```

but it should be derived unless existing architecture already owns such a structure.

Never retarget by title, index, or visual similarity.

---

# 5. Governing Draft Principle

There must remain **one authored scheduling draft**.

Task 6.7 must not create:

```text
Setup draft
+
Commitment draft authority
```

The existing unified Setup draft remains the canonical in-session authored scheduling state unless the source audit proves a safe extraction that preserves one ownership graph.

Component-local form state is allowed for bounded Add/Edit interactions, but it must reconcile into the one canonical draft/write workflow.

---

# 6. Governing Save Principle

Task 6.7 must determine and preserve the existing save semantics.

Strong default:

> Add/Edit Commitment modifies the same Planner scheduling draft that currently feeds **Save Setup**.

Do not silently introduce per-commitment durable writes if the current authored workflow is transactional at Setup level.

If a bounded Add/Edit form uses a local **Add** or **Done** action, distinguish:

```text
commit local form into Planner draft
```

from:

```text
persist authored setup
```

Do not label draft mutation as saved persistence.

---

# 7. Governing Schedule-Staleness Principle

Preserve:

```text
authored scheduling change
    ↓
Planner draft changes
    ↓
existing generated schedule becomes stale according to current governed semantics
    ↓
old schedule remains visible
    ↓
explicit Refresh Schedule
```

Task 6.7 must not auto-regenerate.

---

# 8. Governing Goal Boundary

Goals remain independent durable authored intent.

Commitment authoring may show Goal relationships where the existing exact Goal-link model supports them, but Task 6.7 must not:

* make Goals schedule inputs;
* automatically link Goals;
* infer Goal relevance;
* mutate Goal lifecycle;
* redefine Goal-owned links.

Goal links remain Goal authority.

---

# 9. Governing Pattern Principle

Pattern Library is contextual, not a primary destination.

The target mental model is:

```text
Add Commitment
    ↓
create directly
or
    ↓
Use Pattern
```

Task 6.7 must audit what existing templates/pattern concepts actually support before presenting this terminology.

Do not fabricate a Pattern Library abstraction if the current domain cannot truthfully support it.

---

# 10. Governing Surface Principle

After Task 6.7:

```text
Planner / Plan
    authored intent

Planner / Review Schedule
    generated plan review

Today
    current published plan + execution reporting

Summary
    historical interpretation
```

Commitment writes belong only to Planner.

---

# 11. Explicit Scope

Implement where supported:

* audit existing authored scheduling source families;
* define a derived product-facing Commitment projection;
* Commitment inventory/list;
* Add Commitment entry point;
* commitment-type selection where needed;
* Edit Commitment entry point;
* source-specific bounded forms;
* contextual Pattern access where truthful;
* exact source identity preservation;
* draft integration;
* Save Setup integration;
* cancel/discard behavior;
* schedule-staleness behavior;
* Goals/link compatibility;
* Setup decomposition/recomposition;
* Schedule Preferences separation;
* shift/cycle workflow treatment;
* manual-event workflow boundary determination;
* Sleep workflow treatment;
* responsive behavior;
* accessibility;
* focus;
* intentional lazy-loading architecture;
* bundle remediation;
* tests;
* governance.

---

# 12. Explicit Non-Goals

Do not implement:

* new generic Commitment persistence;
* Commitment database store;
* Commitment backup participant;
* Commitment incarnation migration;
* new scheduler inputs;
* scheduler redesign;
* recurrence redesign unless necessary for UI projection;
* direct schedule placement;
* drag/drop;
* resize;
* pin/lock;
* Today schedule writes;
* Today commitment editing;
* Summary authoring;
* Capacity;
* Planned Allocation;
* Goal Progress changes;
* Recommendations;
* transition sleep recommendations;
* Goal reorientation recommendations;
* automatic prioritization;
* adaptation;
* automatic Goal linking;
* automatic Pattern creation.

---

# 13. Execution Artifact Rules

Before implementation:

1. verify Task 6.7 artifact;
2. save immutable project copy;
3. record SHA-256;
4. review:

   * Task 6.1;
   * Task 6.2;
   * Task 6.6;
   * Goal V1 ADR and Task 5.4;
   * current SetupScreen;
   * DayFrameApp scheduling draft ownership;
   * authored setup types/validation;
   * block templates;
   * recurrence models;
   * shift definitions;
   * cycles/segments;
   * manual events;
   * Sleep/default seed behavior;
   * profile serialization;
   * backup/restore;
   * Preview staleness;
   * Goal exact commitment-link resolution;
   * current bundle configuration;
   * current dynamic imports/chunks;
5. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-6/TASK_6.7_COMMITMENT_AUTHORING_CONVERGENCE_RESULT.md`

---

# 14. Mandatory Initial Source Audit

Before changing UI, construct an inventory of every current authored source that can result in planned schedule geometry.

For each source determine:

* authority owner;
* storage location;
* ID semantics;
* incarnation semantics if any;
* create path;
* update path;
* removal path;
* draft behavior;
* save behavior;
* recurrence behavior;
* schedule-staleness behavior;
* Goal-link eligibility;
* profile behavior;
* Backup behavior;
* restore behavior;
* whether users should perceive it as a Commitment.

Do not infer equivalence from similar rendering.

---

# 15. Required Source Classification

Classify each source as one of:

### A. Commitment

A user-authored thing DayFrame is expected to make time for or preserve.

### B. Commitment-supporting configuration

Configuration required to schedule commitments but not naturally perceived as a commitment itself.

### C. Schedule preference

Rules describing how DayFrame interprets time or scheduling preferences.

### D. Calendar event

Anchored event that may deserve contextual commitment treatment but has distinct authored semantics.

### E. System/generated structure

Not directly authored as a commitment.

### F. Unresolved

Stop or defer rather than forcing classification.

---

# 16. Stop Conditions

Stop and report if:

* product-facing Commitment cannot be derived without creating a new durable authority;
* current Setup draft cannot be decomposed without duplicate ownership;
* Add/Edit requires bypassing canonical Save Setup semantics;
* exact source identity cannot survive projection;
* Goal exact links cannot continue resolving through the proposed projection;
* a source would require semantic migration merely to display as a Commitment;
* shift/cycle semantics cannot truthfully fit the proposed Commitment UX;
* Pattern terminology would misrepresent current templates;
* manual events require an unresolved authority decision;
* the task would require scheduler changes;
* the task would require Backup migration;
* meaningful Planner convergence cannot fit bundle budgets without threshold inflation and no safe loading boundary exists.

Do not solve a stop condition by inventing architecture.

---

# 17. Target Planner / Plan Shape

Candidate:

```text
Plan

Goals
    existing Goal workflow

Commitments
    authored commitment inventory
    Add Commitment

Schedule Preferences
    time interpretation / planning preferences

Advanced / remaining Setup
    only if genuinely necessary during transition

Save Setup
```

The exact result must follow the source audit.

---

# 18. Setup Retirement Principle

Task 6.7 should **reduce Setup as a product concept**, but complete `SetupScreen` retirement is not mandatory if doing so would create architectural churn.

Possible valid outcomes:

1. SetupScreen becomes internal composition behind Commitment and Preferences sections.
2. SetupScreen is decomposed into bounded components.
3. SetupScreen remains partially visible for advanced/unconverged sources.

Do not claim retirement unless it is genuinely gone from the product workflow.

---

# 19. Commitment Inventory

Planner / Plan should expose a comprehensible inventory of current authored commitments.

Prefer cards/rows over implementation tables.

Each item should show only useful product information, potentially:

* title;
* kind;
* recurrence/frequency summary;
* timing preference;
* active/enabled state;
* source-specific context.

Do not dump raw schema.

---

# 20. Commitment Kind

A user-facing kind may be derived from source family.

Examples might include:

* Routine;
* Work;
* Sleep;
* Event;

but these are **not prescribed**.

Audit actual domain semantics.

Do not create a taxonomy merely for aesthetic consistency.

---

# 21. Add Commitment

Expose a clear primary action:

**Add Commitment**

This begins a bounded authoring workflow.

It must not immediately persist merely by opening.

---

# 22. Add Commitment Type Selection

If multiple source families require materially different forms, the first step may ask:

> What would you like to make time for?

Possible options must map directly to existing canonical authored models.

Do not expose engine type names.

---

# 23. Direct Creation

For ordinary schedulable authored work, provide the smallest truthful form over existing fields.

Potential fields may include:

* name/title;
* duration;
* recurrence/frequency;
* preferred time/window;
* priority where currently authored;
* enabled state.

Use actual source model.

Do not add fields not already governed.

---

# 24. Edit Commitment

Selecting an existing Commitment exposes:

**Edit Commitment**

The form must load exact underlying source identity.

Edits modify the canonical Planner draft.

Do not replace identity merely because fields change.

---

# 25. Removal

Audit current semantics carefully.

If a source currently supports true authored removal from Setup draft, the Commitment workflow may expose removal.

Use product copy appropriate to semantics.

Do not invent archival lifecycle for sources that currently use removal.

---

# 26. Removal Confirmation

Destructive removal should require explicit confirmation according to existing product conventions.

Explain schedule consequence without claiming immediate regeneration.

Example:

> This removes the commitment from your planning setup. Refresh your schedule after saving to see the change.

Adapt to actual save/staleness timing.

---

# 27. Enabled/Disabled Semantics

If templates have an existing enabled flag, preserve it.

Do not equate disabled with:

* completed;
* archived;
* skipped.

Use current meaning.

---

# 28. Recurrence

Existing recurrence models remain canonical.

Task 6.7 may improve their presentation.

Do not redesign recurrence semantics.

---

# 29. Recurrence Summary

Inventory should translate canonical recurrence into understandable text where deterministic.

Examples:

```text
Every day
Monday, Wednesday, Friday
3 times per user-week
```

Do not display unsupported recurrence as if editable.

---

# 30. User-Week Semantics

Any `timesPerUserWeek` UI must continue using canonical user-week semantics.

Do not introduce seven-24-hour-day assumptions.

---

# 31. Preferred Timing

Translate existing preferred-window/time semantics into product language.

Do not imply exact placement if the field is merely a preference.

---

# 32. Priority

If current templates expose authored priority, preserve it.

Do not reinterpret priority as Goal importance or Recommendation weight.

---

# 33. Work / Shift Definitions

Audit whether users naturally perceive:

* the work commitment;
* the shift definition;
* the cycle assignment;

as one conceptual workflow or several.

Strong preference:

> Present Work as the user-facing commitment while retaining shift/cycle structures as supporting configuration where possible.

But do not collapse identities or semantics to achieve this.

---

# 34. Shift Cycles

Cycle/segment configuration may belong under Work configuration or Schedule Preferences depending the audit.

It should not be forced into a generic recurrence form if its semantics differ.

---

# 35. Transition Strategy

`transitionStrategyId` currently has no executable scheduling semantics.

Do not expose it as functional transition intelligence.

Do not imply DayFrame currently adapts sleep or workload around shift changes.

---

# 36. Sleep

Audit Sleep's actual authored representation.

If Sleep is currently an ordinary block template with special product meaning, the UI may present it as a Commitment without creating a new Sleep authority.

Preserve exact underlying representation.

---

# 37. Sleep Transition Boundary

Do not add:

* temporary sleep schedules;
* transition pacing;
* circadian recommendations;
* shift adaptation.

Those remain future work.

---

# 38. Manual Events

Audit current manual-event authoring separately.

Manual events are anchored authored calendar facts and may not belong in the same Add Commitment workflow as flexible commitments.

Acceptable outcomes include:

### Option A

Expose **Event** as an Add Commitment kind while preserving the separate manual-event authority.

### Option B

Keep Add Event contextual to calendar/day workflows and exclude events from generic Add Commitment.

Choose based on actual product semantics and document the decision.

Do not create duplicate event creation paths.

---

# 39. Goal-Link Compatibility

Existing Goal-owned exact links reference:

* source kind;
* logical ID;
* source incarnation.

The Commitment projection must preserve enough identity for existing Goal UI to resolve labels/availability exactly as before.

Mandatory regression.

---

# 40. Goal-Link Ownership

Do not add Goal-link editing to Commitment forms unless there is already a canonical Goal-authority command suitable for that workflow and doing so does not create duplicate relationship ownership.

Strong default:

> Goal detail remains the relationship authoring surface for now.

---

# 41. Pattern Audit

Determine what current block templates/defaults/presets actually represent.

Answer:

* Is there already a reusable Pattern concept?
* Are existing templates instances or reusable patterns?
* Does creating from one clone it?
* Are defaults system seeds rather than user library entries?
* Is there durable reusable-pattern authority?

Do not answer from naming alone.

---

# 42. Pattern Library Outcome

If a truthful existing reusable Pattern model exists:

provide contextual:

**Use Pattern**

inside Add Commitment.

If it does not:

show no fake Pattern Library.

Document Pattern Library as deferred architecture/product work.

---

# 43. No Primary Pattern Destination

Even if contextual Pattern use is supported, do not add Pattern Library as a top-level Planner tab.

---

# 44. Commitment Draft

A bounded Add/Edit form may use ephemeral component state.

No keystroke should mutate persistence.

---

# 45. Draft Commit

When user finishes Add/Edit:

commit changes into the canonical Planner scheduling draft.

Use copy such as:

* Add to Plan;
* Update Commitment;
* Done;

based on actual semantics.

Avoid **Save** if persistence still requires Save Setup.

---

# 46. Persistence Save

If Save Setup remains the actual persistence boundary, preserve it clearly.

Potential product rename may be considered:

**Save Plan**

only if it truthfully represents the entire authored scheduling draft and does not conflict with Goals being independently persisted.

Audit before changing.

Do not rename mechanically.

---

# 47. Dirty State

Existing unsaved-change behavior remains canonical.

Adding/editing/removing a Commitment must participate exactly as equivalent Setup edits do today.

---

# 48. Save-State Messaging

Preserve clearing/replacement behavior established in unified Setup.

Do not allow stale “saved” messaging after a Commitment draft change.

---

# 49. Cancel Add

Cancel discards only the bounded local form.

No canonical draft mutation.

---

# 50. Cancel Edit

Cancel leaves the underlying Planner draft unchanged from when Edit opened.

If the architecture cannot guarantee this with existing draft binding, use a local edit buffer.

---

# 51. Concurrent Draft Changes

Audit whether another Planner action can alter the draft while an Add/Edit form is open.

Do not overwrite unrelated draft changes with a stale full-object replacement.

Prefer bounded source mutation.

---

# 52. Profile Load During Edit

If profile load replaces the authored draft:

close/discard stale Add/Edit form.

Do not apply edits to the newly loaded profile-derived state.

---

# 53. Restore During Edit

Likewise discard stale local form state after authoritative replacement.

---

# 54. Full Clear During Edit

Close Add/Edit workflow and clear selection.

---

# 55. Commitment Selection

Use exact source identity.

Selection should disappear or update deterministically when its source is removed/replaced.

---

# 56. Source Recreation

If an authored source is removed and recreated with a new incarnation, do not retain stale selection or silently transfer Goal-link presentation.

---

# 57. Schedule Staleness

A Commitment change that corresponds to a current schedule-affecting authored Setup change must stale the schedule exactly as before.

Mandatory regression.

---

# 58. Unsaved Draft vs Schedule Staleness

Audit current semantics carefully.

If schedule staleness occurs only after Save Setup rather than local draft mutation, preserve that.

Do not alter the staleness trigger merely because the UI changed.

---

# 59. Generate/Refresh Boundary

Commitment authoring does not generate.

The user moves to Review Schedule and explicitly Generate/Refresh Schedule.

---

# 60. Review Schedule Independence

Task 6.6 workflow remains unchanged except for receiving the effects of saved authored changes through existing mechanisms.

Do not fold Review Schedule into Add/Edit.

---

# 61. Today Independence

Commitment authoring must not:

* mutate ExecutionHistory;
* advance Today cutoff;
* alter Today UI directly;
* create outcomes.

A later HistoricalPlan publication may naturally change what Today sees according to existing architecture.

---

# 62. Summary Independence

Commitment authoring does not rewrite history.

No Progress recomputation semantics are changed.

---

# 63. Historical Identity

Changing a current commitment never rewrites HistoricalPlan snapshots.

Existing historical records remain frozen.

---

# 64. Planner Plan Information Architecture

Strong candidate:

```text
Plan

Goals

Commitments
    Add Commitment
    [commitment cards]

Schedule Preferences
    day boundary
    week start
    shift/cycle supporting configuration where appropriate

Save Setup / governed persistence action
```

Use the audit to refine.

---

# 65. Progressive Disclosure

Do not show every source-specific field in the inventory.

Inventory → detail/edit is preferred.

---

# 66. Advanced Configuration

Source-specific complexity such as cycles/segments may use progressive disclosure.

Do not hide fields required for truthful editing.

---

# 67. Empty Commitment State

Explain:

> Add the things you want DayFrame to make time for.

If anchored Events remain separate, ensure this copy does not imply every calendar fact must be created here.

---

# 68. Existing Demo Seed

Default Sleep/Errands/Work behavior must remain semantically unchanged.

The inventory may expose them differently.

Do not alter seed data merely to make the new UI look cleaner.

---

# 69. Commitment Ordering

Use deterministic product ordering.

Possible rules:

* existing authored order;
* source family + authored order;
* title after stable kind.

Do not rely on object iteration/storage order accidentally.

Document chosen rule.

---

# 70. No Scheduling Outcome in Inventory

Commitment cards do not say:

* scheduled successfully;
* unplaced;
* completed;
* skipped.

Those belong to Review Schedule or Today.

---

# 71. No Progress in Inventory

Do not show Goal progress or realization.

---

# 72. No Capacity

Do not show available hours/capacity.

---

# 73. No Recommendation

Do not recommend deleting, deprioritizing, or changing commitments.

---

# 74. Add Workflow Focus

Opening Add Commitment focuses:

* type chooser heading/control; or
* title field if there is only one direct form.

---

# 75. Edit Workflow Focus

Opening Edit Commitment focuses the edit heading or first editable field consistently.

---

# 76. Validation Focus

Invalid submission moves focus to the first invalid field and exposes textual error.

---

# 77. Completion Focus

After Add:

focus returns to the new commitment card or Commitment heading.

After Edit:

return to edited card.

After removal:

return to Commitments heading or deterministic adjacent item.

---

# 78. Modal vs Inline

Audit existing Planner density and conventions.

Inline panel, dialog, or bounded workflow region are all acceptable.

Do not choose modal merely because the workflow is called Add/Edit.

---

# 79. Accessibility — Inventory

Each commitment must have an accessible name and distinguishable Edit action.

Avoid multiple unlabeled “Edit” buttons with no contextual name.

---

# 80. Accessibility — Type Selection

Use native radio/buttons/select semantics as appropriate.

Keyboard operable.

---

# 81. Accessibility — Forms

Every field has:

* visible label;
* validation relationship;
* appropriate input semantics.

---

# 82. Accessibility — Destructive Action

Removal requires explicit named action and confirmation.

---

# 83. Accessibility — Disclosure

Advanced/cycle sections expose expanded/collapsed state.

---

# 84. Mobile

Commitment inventory uses stacked cards.

Add/Edit must not require side-by-side form layout.

Cycle/recurrence controls must wrap.

---

# 85. Desktop

A list/detail or card + bounded editor layout may be used.

Preserve logical DOM/focus order.

---

# 86. Bundle Constraint — Mandatory Architecture Input

Task 6.6 baseline:

```text
Initial raw     683,044 / 685,000
Initial gzip    169,996 / 170,000
Largest lazy     30,091 / 100,000
Total JS        729,307 / 750,000
```

There are **4 gzip bytes** of eager headroom.

Therefore Task 6.7 must treat meaningful eager growth as unavailable.

Do not implement the full UI eagerly and only investigate after `check:bundle` fails.

---

# 87. Mandatory Pre-Implementation Bundle Audit

Before substantial UI changes:

1. inspect current Vite chunk graph;
2. identify what Planner/Setup code is eager;
3. identify existing dynamic import boundaries;
4. measure Setup/authoring contribution where tooling permits;
5. determine whether convergence naturally creates an intent-triggered loading boundary.

Record findings before selecting loading architecture.

---

# 88. Preferred Loading Architecture

Strong candidate:

```text
Eager
    app shell
    Planner shell
    Plan overview
    Commitment inventory summary
    Goals summary/integration
    authority bootstrap

Lazy on authoring intent
    Add/Edit Commitment workflow
    complex recurrence controls
    shift/cycle editor
    advanced Setup authoring
```

This is a candidate, not a command.

Measure.

---

# 89. Alternative Loading Architecture

If the whole Plan authoring region is already sufficiently separable:

```text
Eager
    Planner shell

Lazy on Plan mode
    authored Plan editor

Lazy on Review Schedule mode
    schedule-review renderer
```

But do not degrade the default Planner experience solely for chunk aesthetics.

---

# 90. Bundle Remediation Principle

The bundle guard is now forcing the permanent Phase-5-end remediation we intentionally deferred.

Task 6.7 is authorized to perform **bounded architectural chunking directly related to Planner convergence**.

Do not conduct unrelated global optimization.

---

# 91. No Threshold Inflation

Mandatory.

Do not change:

```text
Initial raw     685,000
Initial gzip    170,000
Largest lazy    100,000
Total JS        750,000
```

unless an entirely separate architecture decision explicitly supersedes the guard.

Task 6.7 itself is not authorization.

---

# 92. Total-JS Constraint

Lazy splitting solves eager pressure but does not eliminate the total budget.

Task 6.7 has ~20.7 KB raw total headroom at the 6.6 baseline.

Prefer reuse and decomposition over duplication.

---

# 93. No New Runtime Dependency

Mandatory.

---

# 94. Loading UX

Any new lazy authoring boundary needs:

* meaningful fallback;
* no fake empty state;
* deterministic focus after load;
* retry/error behavior consistent with existing lazy surfaces.

---

# 95. Authority Bootstrap

Do not move authority initialization or protection handling behind the lazy authoring UI.

---

# 96. Recovery

Recovery/protection UI remains globally reachable regardless of authoring chunk state.

---

# 97. Setup Component Strategy

Prefer extracting existing behavior rather than rewriting it.

Potential bounded components:

```text
CommitmentSection
CommitmentList
CommitmentEditor
SchedulePreferencesSection
WorkScheduleEditor
RecurrenceEditor
```

Names are illustrative.

Avoid parallel implementations of existing form semantics.

---

# 98. Domain Adapter Strategy

A small pure projection layer may be appropriate:

```text
authored setup
    ↓
deriveCommitmentSummaries(...)
    ↓
Planner presentation
```

and source-specific mutation adapters:

```text
updateCommitmentDraft(ref, patch)
removeCommitmentDraft(ref)
```

only if they operate on the existing canonical draft.

Do not create persistence.

---

# 99. Projection Purity

Derived Commitment projection must be:

* deterministic;
* input-order governed;
* clone-safe where relevant;
* free of writes;
* free of scheduler execution;
* free of Goal inference.

---

# 100. Unsupported Source Behavior

If an authored source can be displayed but not safely edited through the new workflow:

show it read-only with a truthful path to its existing editor.

Do not omit it silently.

---

# 101. Transitional Setup Escape Hatch

If necessary, retain:

**Advanced Setup**

or equivalent for unconverged source configuration.

This is preferable to semantic loss.

Document exactly what remains and why.

---

# 102. Product Terminology

Prefer:

* Commitment;
* Add Commitment;
* Edit Commitment;
* Schedule Preferences;
* Work Schedule;
* Repeats;
* Preferred time;

where truthful.

Avoid exposing:

* block template;
* recurrence object;
* shift definition ID;
* candidate;
* segment index;

unless no truthful product translation exists.

---

# 103. Segment Terminology

Previous UX work identified **Segment** as mechanical language.

Task 6.7 may improve the user-facing term if the underlying concept is clear.

Do not rename domain code merely for UI copy.

---

# 104. Schedule Preference Boundary

At minimum audit:

* day boundary;
* week start;
* cycle-specific overrides.

Determine which belong in Schedule Preferences versus Work configuration.

Do not move them based solely on current component location.

---

# 105. Save Setup Terminology Audit

Determine whether **Save Setup** still makes product sense after convergence.

Possible outcomes:

### Preserve Save Setup

if remaining Setup is still a visible product concept.

### Rename to Save Plan

only if the action truthfully persists the complete relevant Planner scheduling draft and copy clearly excludes independently persisted Goals.

### More precise alternative

if warranted by actual semantics.

A rename is not mandatory.

---

# 106. No Per-Commitment Persistence Fiction

If Add/Edit only changes the draft, do not show:

> Commitment saved

until persistence occurs.

Use:

> Added to plan

or equivalent.

---

# 107. Dirty Indicator

If useful and supported, Planner may indicate unsaved planning changes.

Reuse existing state.

Do not create a second dirty tracker.

---

# 108. Profile Semantics

Profiles continue owning only their existing authored scheduling setup.

Goals remain excluded.

The Commitment projection must follow profile load naturally.

---

# 109. Backup/Restore

No Backup version expected.

Because no new authority/schema is intended, existing authored setup transport should remain sufficient.

Mandatory regression.

---

# 110. Full Clear

Clears underlying authored sources exactly as current full-clear semantics specify.

Derived Commitment inventory becomes empty naturally.

No Commitment-specific clear command.

---

# 111. Protection

If underlying authored setup/protection state prevents editing, Commitment UI must not fabricate an editable empty inventory.

Reuse existing protected/recovery semantics.

---

# 112. Tests — Source Projection

For every included source family:

* correct product projection;
* exact source identity;
* deterministic ordering;
* no mutation.

---

# 113. Tests — Add

Cover each supported Add Commitment kind.

Verify draft changes only according to canonical semantics.

---

# 114. Tests — Edit

Verify:

* exact source updated;
* unrelated source unchanged;
* identity preserved;
* hidden fields preserved.

---

# 115. Tests — Cancel

Add/Edit cancel leaves canonical draft unchanged.

---

# 116. Tests — Remove

Verify exact source removal and confirmation.

No unrelated source changes.

---

# 117. Tests — Dirty/Save

Verify existing Save Setup/persistence semantics.

No false persistence messaging.

---

# 118. Tests — Staleness

Equivalent commitment changes produce exactly the same Preview stale behavior as their prior Setup edit path.

---

# 119. Tests — Goal Links

Editing without recreation preserves Goal link availability.

Removal/recreation preserves unavailable-old-link semantics.

No retargeting.

---

# 120. Tests — Profiles

Profile load replaces Commitment inventory according to existing setup semantics.

Goal authority unchanged.

---

# 121. Tests — Restore

Restore replaces authored scheduling state and derived inventory correctly.

Open local editor state is discarded.

---

# 122. Tests — Full Clear

Inventory, selection, and local editor state clear.

---

# 123. Tests — Work

Cover representative shift definition/cycle editing through whichever workflow the audit authorizes.

---

# 124. Tests — Sleep

Sleep remains correctly represented and editable according to current authored semantics.

---

# 125. Tests — Recurrence

Cover:

* daily;
* weekly;
* specific weekdays;
* times per user-week;

where currently supported.

Unsupported recurrence must remain truthful.

---

# 126. Tests — Manual Events

Cover the chosen 6.7 boundary:

* contextual Commitment workflow if included; or
* explicit continued calendar workflow if excluded.

Ensure no duplicate creation path.

---

# 127. Tests — Pattern

If Pattern use is implemented:

* exact reusable source behavior;
* cloning semantics;
* no shared unintended mutation.

If not implemented:

document why current architecture does not yet support truthful Pattern Library semantics.

---

# 128. Tests — Planner/Review Schedule

After save:

* Review Schedule becomes stale according to existing rules;
* old schedule remains;
* Refresh remains explicit.

---

# 129. Tests — Today

Commitment edits do not create execution outcomes or advance Today cutoff.

---

# 130. Tests — Summary

No history is rewritten.

---

# 131. Tests — Accessibility

Cover:

* Add Commitment;
* commitment cards;
* contextual Edit names;
* type chooser;
* form labels;
* validation;
* cancel;
* remove confirmation;
* disclosures;
* focus return.

---

# 132. Tests — Mobile

No horizontal dependence.

---

# 133. Tests — Loading Boundary

If lazy authoring is introduced:

* chunk fallback;
* successful load;
* focus after load;
* state survives chunk loading;
* authority state is not duplicated;
* failure/retry where testable.

---

# 134. Tests — Product Terminology

Primary UI should not unnecessarily expose:

* Block Template;
* Block Recurrence;
* Shift Definition ID;
* Generate Preview;
* Preview.

Do not assert against internal names.

---

# 135. Tests — Unauthorized Semantics

Assert absence where appropriate:

* Capacity;
* Recommendation;
* Goal priority inference;
* transition adaptation;
* completed/skipped execution state;
* automatic schedule refresh.

---

# 136. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.7_COMMITMENT_AUTHORING_CONVERGENCE_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 6.6 Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Authored Source Inventory
7. Source Classification
8. Commitment Product Definition
9. Authority Decision
10. Identity Model
11. Projection Model
12. Ordering
13. Original Plan IA
14. Resulting Plan IA
15. SetupScreen Assessment
16. Setup Retirement Status
17. Commitment Inventory
18. Empty State
19. Add Commitment
20. Add Type Selection
21. Direct Creation
22. Edit Commitment
23. Removal
24. Enabled/Disabled
25. Recurrence
26. User-Week Preservation
27. Preferred Timing
28. Priority
29. Work Treatment
30. Shift Definition Treatment
31. Cycle Treatment
32. Segment Terminology
33. Transition Strategy Boundary
34. Sleep Treatment
35. Manual Event Decision
36. Goal-Link Compatibility
37. Goal-Link Ownership
38. Pattern Audit
39. Pattern Library Decision
40. Contextual Use Pattern
41. Draft Ownership
42. Add Draft
43. Edit Draft
44. Draft Commit
45. Persistence Save
46. Save Terminology
47. Dirty State
48. Save-State Messaging
49. Cancel
50. Concurrent Draft Safety
51. Profile Load
52. Restore
53. Full Clear
54. Protection
55. Selection Lifecycle
56. Recreation
57. Schedule Staleness
58. Generate/Refresh Boundary
59. Review Schedule Independence
60. Today Independence
61. Summary Independence
62. Historical Immutability
63. Progressive Disclosure
64. Advanced Setup Escape Hatch
65. Focus
66. Accessibility
67. Responsive Behavior
68. Mobile
69. Desktop
70. Pre-Implementation Bundle Audit
71. Loading Architecture Decision
72. Lazy Authoring Boundary
73. Authority Bootstrap Boundary
74. Recovery Boundary
75. Bundle Comparison
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
87. Source Classification Matrix
88. Commitment Projection Matrix
89. Add/Edit Matrix
90. Work/Cycle Matrix
91. Manual Event Matrix
92. Pattern Matrix
93. Draft/Save Matrix
94. Goal-Link Matrix
95. Profile/Restore Matrix
96. Surface-Boundary Matrix
97. Loading Matrix
98. Bundle Matrix
99. Accessibility Matrix
100. Product-Boundary Matrix
101. Epistemic Matrix
102. Architectural Invariant Assessment
103. Stop-Condition Assessment
104. Architectural Alignment Assessment
105. Task 6.8 Readiness
106. Recommended Next Task
107. Final Completion Determination

---

# 137. Required Source Classification Matrix

Produce:

| Authored source         | Authority | Product classification | Commitment UI? | Editing path |
| ----------------------- | --------- | ---------------------- | -------------: | ------------ |
| block templates         |           |                        |                |              |
| recurrences             |           |                        |                |              |
| shift definitions       |           |                        |                |              |
| shift cycles/segments   |           |                        |                |              |
| manual events           |           |                        |                |              |
| schedule preferences    |           |                        |                |              |
| other discovered source |           |                        |                |              |

Do not force these rows to the expected classification if source evidence disagrees.

---

# 138. Required Commitment Projection Matrix

Produce:

| Product field      | Underlying source | Derived/authored | Identity effect |
| ------------------ | ----------------- | ---------------- | --------------- |
| label              |                   |                  |                 |
| kind               |                   |                  |                 |
| recurrence summary |                   |                  |                 |
| preferred timing   |                   |                  |                 |
| enabled            |                   |                  |                 |
| exact reference    |                   |                  |                 |

---

# 139. Required Add/Edit Matrix

Produce:

| Commitment kind  | Add supported? | Edit supported? | Remove? | Canonical underlying model |
| ---------------- | -------------: | --------------: | ------: | -------------------------- |
| discovered kinds |                |                 |         |                            |

---

# 140. Required Work/Cycle Matrix

Produce:

| Concern              | Product location | Underlying authority | Changed semantics? |
| -------------------- | ---------------- | -------------------- | -----------------: |
| work identity        |                  |                      |                    |
| shift times          |                  |                      |                    |
| cycle assignment     |                  |                      |                    |
| boundary override    |                  |                      |                    |
| week-start override  |                  |                      |                    |
| transitionStrategyId |                  |                      |                    |

---

# 141. Required Manual Event Matrix

Produce:

| Question                            | Decision | Reason |
| ----------------------------------- | -------- | ------ |
| Is Event a generic Commitment kind? |          |        |
| Where is Add Event?                 |          |        |
| Where is Edit Event?                |          |        |
| Is there one write path?            |          |        |
| Does all-day remain user-day-wide?  |          |        |

---

# 142. Required Pattern Matrix

Produce:

| Question                            | Result |
| ----------------------------------- | ------ |
| reusable Pattern authority exists?  |        |
| current templates are patterns?     |        |
| default seeds are patterns?         |        |
| clone semantics exist?              |        |
| contextual Use Pattern implemented? |        |
| top-level Pattern Library added?    | No     |

---

# 143. Required Draft/Save Matrix

Produce:

| Action            | Local form | Planner draft | Persistence | Schedule stale |
| ----------------- | ---------: | ------------: | ----------: | -------------: |
| type/select       |            |               |             |                |
| field typing      |            |               |             |                |
| Add to Plan       |            |               |             |                |
| Update Commitment |            |               |             |                |
| Cancel            |            |               |             |                |
| Save Setup/Plan   |            |               |             |                |
| profile load      |            |               |             |                |

Use actual semantics.

---

# 144. Required Goal-Link Matrix

Produce:

| Scenario            | Expected                                             |
| ------------------- | ---------------------------------------------------- |
| edit same source    | link remains available                               |
| disable source      | according to existing exact availability semantics   |
| remove source       | old link becomes unavailable                         |
| recreate source     | old link does not retarget                           |
| rename source       | same identity, current label resolves                |
| profile replacement | availability resolves against replaced current setup |

---

# 145. Required Surface-Boundary Matrix

Produce:

| Capability          | Planner Plan | Review Schedule | Today | Summary |
| ------------------- | ------------ | --------------- | ----- | ------- |
| author commitment   |              |                 |       |         |
| edit commitment     |              |                 |       |         |
| schedule generation |              |                 |       |         |
| plan friction       |              |                 |       |         |
| outcome reporting   |              |                 |       |         |
| historical progress |              |                 |       |         |

---

# 146. Required Loading Matrix

Produce:

| Area                 | Eager/lazy | Why      |
| -------------------- | ---------- | -------- |
| app/authority shell  | eager      |          |
| Planner shell        | eager      |          |
| Commitment inventory |            |          |
| Add/Edit authoring   |            |          |
| recurrence controls  |            |          |
| work/cycle editor    |            |          |
| Review Schedule      |            |          |
| Today                | lazy       | preserve |
| Summary              | lazy       | preserve |

---

# 147. Required Bundle Matrix

Baseline:

| Metric       |     6.6 | 6.7 | Delta |
| ------------ | ------: | --: | ----: |
| Initial raw  | 683,044 |     |       |
| Initial gzip | 169,996 |     |       |
| Today query  |   4,890 |     |       |
| Today UI     |  11,282 |     |       |
| Summary      |  30,091 |     |       |
| largest lazy |  30,091 |     |       |
| total JS     | 729,307 |     |       |

Add new chunks separately.

---

# 148. Required Accessibility Matrix

Produce:

| Interaction           | Requirement                |
| --------------------- | -------------------------- |
| Add Commitment        | named control              |
| type choice           | keyboard + selected state  |
| commitment card       | semantic identity          |
| Edit                  | contextual accessible name |
| form fields           | labels/errors              |
| recurrence disclosure | expanded state             |
| Cancel                | named control              |
| Remove                | confirmation               |
| Add completion        | deterministic focus        |
| Edit completion       | deterministic focus        |
| lazy-load completion  | deterministic focus        |

---

# 149. Required Product-Boundary Matrix

Produce:

| Capability                 | Task 6.7        |
| -------------------------- | --------------- |
| Commitment product concept |                 |
| new Commitment authority   | Prohibited      |
| Commitment inventory       |                 |
| Add Commitment             |                 |
| Edit Commitment            |                 |
| remove/disable             |                 |
| recurrence redesign        | Prohibited      |
| Work convergence           |                 |
| Sleep convergence          |                 |
| Event convergence          | audit-dependent |
| contextual Pattern         | audit-dependent |
| top-level Pattern Library  | Prohibited      |
| Setup reduction            |                 |
| Setup retirement           | audit-dependent |
| Review Schedule redesign   | Prohibited      |
| Today writes               | Prohibited      |
| Capacity                   | Prohibited      |
| Recommendations            | Prohibited      |
| transition adaptation      | Prohibited      |

---

# 150. Required Epistemic Matrix

Produce:

| Evidence/state            | DayFrame may say                        | Must not say                           |
| ------------------------- | --------------------------------------- | -------------------------------------- |
| authored commitment       | user intends DayFrame to account for it | it will definitely fit                 |
| preferred time            | preferred                               | guaranteed time                        |
| priority                  | authored scheduling priority            | Goal importance                        |
| disabled                  | disabled                                | completed                              |
| removed                   | no longer in current authored setup     | never existed historically             |
| recurrence                | authored recurrence                     | actual execution                       |
| Goal link                 | current exact relationship              | Goal success                           |
| schedule stale after save | schedule predates authored change       | schedule failed                        |
| Pattern clone             | created from reusable source if proven  | shared live relationship unless proven |
| shift change              | authored regime changes                 | user needs adaptation                  |

---

# 151. Architectural Invariants

Assess at minimum:

1. Planner remains sole generic commitment-write surface.
2. Review Schedule remains generated-plan review.
3. Today remains execution/reporting.
4. Summary remains historical analysis.
5. Commitment is initially a product projection.
6. no generic Commitment authority is added.
7. existing authored authorities remain canonical.
8. exact source identity is preserved.
9. source incarnation semantics are preserved.
10. Goal links continue using exact source identity.
11. Goal links are not retargeted.
12. Goal authority owns Goal links.
13. one scheduling draft remains.
14. no second draft authority exists.
15. local form state is ephemeral.
16. typing does not persist.
17. Add/Edit completion does not falsely claim persistence.
18. existing persistence boundary remains canonical.
19. dirty-state semantics remain canonical.
20. save-state messaging remains truthful.
21. schedule-staleness trigger remains canonical.
22. schedule does not auto-regenerate.
23. old schedule remains visible when stale.
24. Generate/Refresh remains explicit.
25. Review Schedule behavior remains governed by 6.6.
26. HistoricalPlan remains immutable.
27. current edits do not rewrite history.
28. Today outcomes remain untouched.
29. Today cutoff is not advanced.
30. Summary history remains untouched.
31. recurrence semantics remain unchanged.
32. user-week semantics remain unchanged.
33. variable-duration user-day semantics remain unchanged.
34. schedule preference semantics remain unchanged.
35. shift definition semantics remain unchanged.
36. cycle semantics remain unchanged.
37. segment transition ownership remains unchanged.
38. transitionStrategyId gains no invented behavior.
39. Sleep gains no transition intelligence.
40. manual-event authority remains singular.
41. all-day remains user-day-wide.
42. no duplicate Add Event path exists.
43. Pattern terminology is evidence-based.
44. no fake Pattern Library is introduced.
45. Pattern Library is not top-level.
46. no automatic Goal linking exists.
47. no Goal-priority inference exists.
48. priority remains scheduling priority.
49. enabled/disabled semantics remain unchanged.
50. removal does not become archive unless governed.
51. source recreation does not reuse identity.
52. selection follows exact identity.
53. profile load replaces scheduling setup as before.
54. profile load does not replace Goals.
55. stale editor state is discarded after replacement.
56. restore behavior remains governed.
57. full clear remains governed.
58. no Commitment-specific clear authority exists.
59. Backup schema remains unchanged unless stop condition proves otherwise.
60. no new IndexedDB store exists.
61. no new runtime authority participant exists.
62. protection cannot appear as empty editable state.
63. unsupported sources are not silently omitted.
64. Setup is not claimed retired unless genuinely retired.
65. advanced escape hatch may remain when truthful.
66. product copy reduces implementation terminology.
67. source-specific complexity may use progressive disclosure.
68. accessibility does not depend on pointer.
69. forms have labels/errors.
70. destructive actions are explicit.
71. focus after Add is deterministic.
72. focus after Edit is deterministic.
73. focus after Remove is deterministic.
74. mobile has no horizontal dependence.
75. no scheduler algorithm changes.
76. no direct placement.
77. no drag/drop.
78. no resize.
79. no pin/lock.
80. no Capacity.
81. no Planned Allocation.
82. no Recommendations.
83. no adaptation.
84. no automatic deprioritization.
85. no transition sleep recommendation.
86. authority bootstrap remains eager.
87. recovery remains eager/global.
88. bundle guard remains unchanged.
89. initial raw remains <= 685,000.
90. initial gzip remains <= 170,000.
91. largest lazy remains <= 100,000.
92. total JS remains <= 750,000.
93. no runtime dependency is added.
94. loading boundaries do not duplicate state.
95. lazy authoring does not lazy-load authority ownership.
96. lazy fallback is not an empty-state lie.
97. Planner shell remains promptly usable.
98. Today remains lazy.
99. Summary remains lazy.
100. full canonical validation passes.
101. Task 6.8 is not begun implicitly.

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

# 152. Focused Validation

Run focused suites for:

* PlannerSurface;
* DayFrameApp;
* SetupScreen and extracted authoring components;
* authored setup validation;
* block templates/recurrences;
* shift definitions/cycles;
* manual events;
* Goal exact-link availability;
* profiles;
* backup/restore;
* Preview staleness;
* Review Schedule;
* loading boundaries.

Record exact files/tests.

---

# 153. Full Validation

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
* build modules;
* initial raw;
* initial gzip;
* new Planner/authoring chunks;
* Review Schedule chunk if changed;
* Today chunks;
* Summary chunk;
* largest lazy;
* total JS;
* diff result.

---

# 154. Bundle Success Criterion

Because Task 6.6 left only four gzip bytes of eager headroom, simply remaining under 170,000 by minifier luck is **not sufficient evidence of healthy convergence** if Task 6.7 adds substantial Planner capability.

The result must explain how the loading architecture creates meaningful sustainable eager headroom.

Prefer a measurable reduction from the 6.6 eager baseline.

Do not prescribe an arbitrary new target, but treat an eager result still within tens of bytes of the ceiling as an architectural warning requiring explicit justification.

---

# 155. Manual Product Walkthrough

If browser available, inspect:

### Planner / Plan

* empty/seed commitment inventory;
* Add Commitment;
* type selection;
* ordinary flexible commitment;
* recurrence;
* Work;
* Sleep;
* edit;
* cancel;
* remove/disable;
* Schedule Preferences;
* Save;
* dirty state.

### Goal compatibility

* linked commitment;
* rename/edit;
* remove;
* recreate.

### Replacement

* profile load while editor open;
* restore;
* full clear.

### Review Schedule

* saved commitment edit makes schedule stale according to canonical behavior;
* old schedule remains;
* explicit Refresh.

### Mobile

* inventory;
* Add;
* Edit;
* recurrence;
* Work/cycle complexity.

### Loading

* first authoring interaction;
* fallback;
* focus after lazy load.

If browser unavailable, state explicitly.

---

# 156. Governance

Update:

* Task 6.7 result;
* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Create an ADR only if implementation establishes a new enduring architecture decision, such as:

* a durable Commitment authority after a stop condition;
* a permanent new draft/persistence model;
* a general application loading rule beyond this bounded convergence.

The fact that Commitment is a product projection over existing authored sources should be documented, but an ADR is only necessary if the implementation establishes it as a durable cross-phase architectural rule beyond the existing product architecture.

---

# 157. Task 6.8 Readiness

If Task 6.7 completes, Task 6.8 may audit/converge the remaining cross-surface planning workflows, especially:

* manual event placement/editing;
* friction-resolution entry points;
* contextual calendar authoring;
* any remaining Setup escape hatch;
* Planner workflow cleanup.

Do not pre-implement those areas merely to make 6.7 cosmetically complete.

---

# 158. Recommended Next Task

If green:

> **Task 6.8 — Planner Contextual Event and Friction Workflow Convergence.**

The exact title may be refined from Task 6.7 discoveries.

---

# 159. Completion Criteria

Task 6.7 is complete only when:

* existing authored scheduling sources have been mechanically audited;
* each source is truthfully classified;
* Commitment is implemented as a product-facing projection unless evidence required a stop;
* no generic Commitment authority/schema/persistence is invented;
* exact underlying source identity is preserved;
* Goal exact-link behavior remains correct;
* Planner / Plan exposes a coherent Commitment inventory;
* Add Commitment exists for supported source families;
* Edit Commitment exists for supported source families;
* removal/disable behavior matches current semantics;
* recurrence semantics remain unchanged;
* user-week semantics remain unchanged;
* Work/shift/cycle treatment is product-coherent without semantic collapse;
* Sleep is treated according to its actual authored model;
* manual events have one explicit, documented authoring boundary;
* Pattern terminology is used only if supported by actual reusable semantics;
* Pattern Library is not promoted to a primary destination;
* one scheduling draft remains;
* local Add/Edit form state is ephemeral;
* no keystroke persistence exists;
* Add/Edit does not falsely claim durable save;
* the canonical persistence action remains truthful;
* dirty/save messaging remains correct;
* profile load, restore, and full clear invalidate local editor state safely;
* schedule-staleness behavior remains identical to equivalent pre-6.7 edits;
* generation remains explicit;
* Review Schedule remains governed by Task 6.6;
* Today remains execution-only;
* Summary remains historical;
* HistoricalPlan is not rewritten;
* no scheduler semantics change;
* no transition intelligence is added;
* no Capacity/Allocation/Recommendations are added;
* no duplicate event or scheduling write path exists;
* Setup is reduced or retained only as evidence warrants;
* unsupported sources remain truthfully reachable;
* accessibility/focus/mobile behavior is sound;
* loading architecture is intentionally addressed before substantial eager growth;
* the fixed bundle guard is not raised;
* meaningful sustainable eager headroom exists or any remaining near-limit state is explicitly justified;
* no new runtime dependency exists;
* focused validation passes;
* full validation passes;
* governance records the resulting Planner authoring model;
* Task 6.8 can proceed without reopening Commitment authority/draft architecture.

---

# 160. Final Implementation Principle

> **A Commitment is how the user understands authored intent; the existing authored models remain how DayFrame represents that intent internally. Converge the workflow without inventing a second truth.**

---

# 161. Final Completion Statement

**Task 6.7 is complete when Planner / Plan presents the user's existing schedulable authored intent through a coherent Commitment inventory with bounded Add and Edit workflows, truthful source-specific Work, Sleep, recurrence, and event treatment, exact underlying identity, preserved Goal-link compatibility, and contextual Pattern access only where the existing architecture genuinely supports reusable patterns; when this product convergence operates over the singular canonical scheduling draft and existing persistence path rather than introducing a generic Commitment authority, duplicate draft, per-item persistence fiction, scheduler input, or alternate write path; when Setup is reduced, decomposed, or retained only according to mechanical source evidence and no source semantics are lost merely to make the UI uniform; when equivalent authored changes retain their existing dirty-state, Save, Preview-staleness, explicit Refresh Schedule, profile, restore, full-clear, historical immutability, and protection behavior; when Planner remains the sole commitment-authoring surface, Review Schedule remains generated-plan review, Today remains execution/reporting, and Summary remains historical interpretation; when no drag/drop, direct placement, Capacity, Planned Allocation, Recommendations, transition adaptation, automatic Goal inference, or scheduler redesign is introduced; when the four-byte post-6.6 eager-gzip constraint is treated as an architecture input from the start and the resulting loading/chunk strategy creates sustainable eager headroom without raising any bundle threshold or adding a runtime dependency; when accessibility, focus, mobile presentation, lazy-loading behavior, exact identity, and unsupported-source fallbacks are mechanically verified; when focused and full validation and the fixed bundle guard pass; and when Task 6.8 can continue contextual Planner convergence without reopening Commitment authority, identity, draft, or persistence semantics.**
