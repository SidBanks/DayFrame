# Task 7.8 — Commitment Library Extraction and Advanced Scheduling-Intent Migration

## Status

Ready for implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

Commitment Library product-workspace implementation, complete authored-Commitment inventory extraction, advanced scheduling-intent migration, contextual-vs-library responsibility convergence, template/recurrence exact-identity preservation, disabled/non-occurring source discoverability, Goal-link context preservation, shared SetupDraft/Save Setup integration, legacy Plan responsibility elimination, Plan-retirement readiness, Month-default readiness, lazy-loading/bundle-governance validation, accessibility/mobile/focus/browser QA, regression testing, and governance.

**This task does not pre-authorize legacy Plan retirement, Planner-navigation removal, Month-default navigation, Work Pattern preset implementation, Pattern Library, recurrence redesign, scheduler redesign, Capacity, Allocation, Recommendations, or new Commitment authority.**

---

# 1. Objective

Extract the complete authored scheduling-intent responsibility that remains unique to legacy Plan into a coherent supporting **Commitment Library** workspace.

Task 7.7 established:

```text
Work structure
    → Work Pattern

global planning configuration
    → Planning Settings

routine contextual planning
    → Month

detailed schedule resolution
    → Review

remaining Plan responsibility
    → complete Commitment inventory
      + advanced Commitment configuration
```

Task 7.8 must make that final product boundary real.

The user must be able to manage authored Commitments even when they:

* are disabled;
* do not occur in the displayed Month;
* are outside current Preview coverage;
* are temporarily unplaceable;
* require recurrence inspection;
* require advanced source fields;
* need Goal-link context.

Month remains the normal contextual editing surface.

Commitment Library becomes the complete authored-source inventory.

---

# 2. Governing Product Principle

> **Month answers “What is happening in my plan?” Commitment Library answers “What scheduling intent have I taught DayFrame?”**

These are related but not identical questions.

Therefore:

```text
Month
    projected/contextual Commitment evidence

Commitment Library
    complete authored Commitment source inventory
```

Absence from Month must never imply absence from the Library.

---

# 3. Governing Authority Principle

> **Commitment Library is a product projection and authoring workflow over existing authored template/recurrence state. It is not a new authority.**

Preserve:

```text
BlockTemplate
    +
BlockRecurrence
    ↓
Commitment product projection
```

Do not add:

* `CommitmentStore`;
* durable Commitment schema merely for UI;
* Commitment database;
* Commitment persistence participant;
* migration;
* Backup version.

---

# 4. Governing Exact-Identity Principle

A Commitment remains identified by its exact authored source pair.

Required contextual/library identity continues to distinguish:

```text
template logical ID
template incarnation

recurrence logical ID
recurrence incarnation
```

Do not identify Commitments by:

* title;
* category;
* duration;
* recurrence summary;
* schedule time;
* array index.

A recreated source is a new source.

---

# 5. Governing One-Writer Principle

Month, Commitment Library, and temporary legacy Plan must all use the same canonical Commitment writer.

Required:

```text
Month contextual editor
          │
          ├───────────────┐
          ↓               ↓
shared Commitment authoring implementation
          ↑               ↑
          │               │
Commitment Library   legacy Plan during migration
```

No parallel forms.

No Library-specific mutation semantics.

---

# 6. Governing Draft Principle

Commitment Library continues to use the singular SetupDraft.

Required lifecycle:

```text
local editor
    ↓
Add / Update Commitment
    ↓
SetupDraft
    ↓
Save Setup
    ↓
durable authored setup
    ↓
Preview stale when scheduling-relevant
    ↓
explicit Refresh
```

No immediate durable Commitment save.

---

# 7. Governing Work Boundary

Task 7.7 established structural Work as a separate product task.

Commitment Library must not absorb:

* Shift Definitions;
* Work Patterns;
* rotations;
* manual Work regimes;
* Off days;
* regime-specific schedule-preference overrides.

Provide contextual entry to Work Pattern only if helpful.

---

# 8. Governing Pattern-Library Boundary

Commitment Library and the future Pattern Library are distinct.

Commitment Library manages:

```text
the user's actual authored Commitments
```

Future Pattern Library may manage:

```text
reusable starting patterns/templates
```

Do not turn current `BlockTemplate` terminology into user-facing reusable Pattern semantics merely because of the internal type name.

---

# 9. Task 7.7 Prerequisite

Treat Task 7.7 as governing.

Confirmed outcomes include:

* Work Pattern workspace is production-ready;
* Shift Definition and Work schedule configuration are no longer uniquely Plan responsibilities;
* structural Work uses the same SetupDraft and Save Setup;
* Month contextual Work routes truthfully to Work Pattern;
* global Preferences remain Planning Settings;
* regime-specific overrides remain Work Pattern;
* legacy Plan's remaining coherent unique responsibility is complete Commitment inventory and advanced scheduling intent;
* Plan retirement remains blocked on Commitment Library;
* Month-default navigation remains blocked on final Plan convergence;
* Work Pattern preset readiness is Classification C and does not block Planner convergence;
* current bundle baseline is:

```text
Initial raw        636,070
Initial gzip       161,963
Largest lazy        52,651
Total JS           760,931
```

* current full suite baseline is 94 files / 974 tests.

---

# 10. Explicit Scope

Implement and/or audit:

* Commitment Library workspace;
* direct Planner/Month entry;
* complete Commitment inventory;
* active Commitments;
* disabled Commitments;
* non-occurring Commitments;
* source projection;
* canonical ordering;
* Add Commitment;
* Edit Commitment;
* Remove Commitment;
* enable/disable if current source model supports it;
* common fields;
* recurrence authoring;
* advanced Commitment fields;
* source/reference fields currently exposed only in advanced Plan;
* Goal-link context;
* exact identity/incarnation;
* stale target protection;
* shared SetupDraft;
* global dirty state;
* Save Setup;
* validation;
* profile load;
* restore;
* full clear;
* protection;
* Month contextual navigation;
* lazy loading;
* accessibility;
* mobile;
* focus;
* legacy Plan reduction;
* Plan retirement readiness;
* Month-default readiness;
* bundle governance;
* browser QA;
* governance.

---

# 11. Explicit Non-Goals

Do not implement:

* Plan retirement unless separately authorized by Task 7.8 completion criteria;
* deletion of Plan navigation in this task by default;
* Month-default navigation change by default;
* Work Pattern presets;
* preset application policy;
* user-saved patterns;
* Pattern Library;
* Commitment grouping/tag system not already present;
* Commitment ranking;
* Goal priority allocation;
* new recurrence families;
* recurrence redesign;
* scheduler redesign;
* direct occurrence placement;
* drag/drop;
* Capacity;
* Allocation;
* Recommendations;
* transition adaptation;
* new persistence;
* Backup schema change;
* runtime dependency;
* bundle-policy change.

---

# 12. Execution Artifact Rules

Before implementation:

1. verify this Task 7.8 artifact;
2. create immutable project copy;
3. record SHA-256;
4. review:

   * Task 7.7 result;
   * Task 7.6 audit;
   * Task 6.7 Commitment convergence;
   * Task 6.10 exact Commitment navigation;
   * `CommitmentSection`;
   * `commitmentProjection`;
   * `SetupScreen`;
   * `setupDraft`;
   * template/recurrence types;
   * recurrence validation;
   * Goal links;
   * Month contextual Commitment workflow;
   * profile/restore/full-clear;
   * current Plan lazy ownership;
   * bundle policy;
5. do not modify immutable artifacts.

Create:

`docs/implementation/phase-7/TASK_7.8_COMMITMENT_LIBRARY_EXTRACTION_AND_ADVANCED_SCHEDULING_INTENT_MIGRATION_RESULT.md`

---

# 13. Mandatory Initial Commitment Composition Audit

Before extraction, trace mechanically every Commitment capability still reachable from legacy Plan.

At minimum identify:

* inventory projection;
* Add;
* Edit;
* Remove;
* enabled/disabled;
* title;
* category;
* duration;
* recurrence family;
* recurrence-specific controls;
* preferred timing/window;
* priority if currently authored;
* advanced source fields;
* Goal-link presentation;
* hidden/preserved unsupported fields;
* Save Setup;
* validation;
* focus;
* lazy ownership.

For each field/control record:

* source object;
* writer;
* local editor state;
* SetupDraft mutation;
* canonical validation;
* Month contextual availability;
* Plan-only status.

---

# 14. Commitment Product Definition

Preserve the established product definition:

> A Commitment is a product projection over one authored template/recurrence source pair.

Do not make the projection durable merely to simplify Library UI.

---

# 15. Complete Inventory Requirement

Commitment Library must derive from the **complete current authored source inventory**, not from:

* current Preview;
* Month occurrences;
* HistoricalPlan;
* ExecutionHistory;
* current planning range;
* generated candidates.

A valid Commitment remains discoverable even if it generates nothing right now.

---

# 16. Inventory Projection

Reuse or extend the canonical deterministic Commitment projection.

Requirements:

* pure;
* scheduler-free;
* Goal-authority-independent except explicit link-context projection where already allowed;
* clone-safe;
* deterministic;
* exact source identity retained;
* no Preview dependence.

---

# 17. Canonical Inventory Ordering

Audit and preserve current canonical authored ordering.

Do not sort by:

* next occurrence;
* Month position;
* completion;
* Goal importance;
* title alphabetically;

unless current product semantics already specify it.

If filtering is added later, base ordering remains deterministic.

---

# 18. Active Commitment Presentation

Each active Commitment card/row should expose enough information to identify its authored intent.

At minimum consider existing canonical summary fields:

* title;
* category/kind;
* recurrence summary;
* duration;
* preferred timing;
* Goal link/context where already supported;
* Edit.

Do not overload the inventory with generated schedule geometry.

---

# 19. Disabled Commitment Presentation

Disabled Commitments must be clearly visible as authored-but-inactive.

Do not call them:

* deleted;
* completed;
* unavailable.

Use current `enabled` semantics.

---

# 20. Non-Occurring Commitment Presentation

A Commitment that has no occurrence in the displayed Month remains ordinary authored intent.

Commitment Library must not label it as:

* inactive;
* broken;
* unplaced;

unless canonical evidence supports that claim.

---

# 21. Preview Independence

Library inventory must render correctly with:

* no Preview;
* stale Preview;
* fresh Preview;
* uncovered Month.

Preview may provide optional contextual information only if explicitly bounded and truthful.

Default: authored inventory does not depend on it.

---

# 22. Add Commitment

Reuse the canonical bounded Add Commitment workflow.

Do not create a Library-specific form.

---

# 23. Add Commitment Defaults

Preserve current default semantics.

Do not infer:

* selected Month date;
* selected weekday;
* current Work Pattern;
* Goal priority;
* recurrence;

unless the existing canonical Add workflow already does so.

---

# 24. Add Commitment Draft Boundary

Typing remains local.

`Add to Plan` / equivalent canonical action updates SetupDraft.

No durable mutation until Save Setup.

---

# 25. Edit Commitment

Use exact source target from the Library projection.

Edit only the exact current:

```text
template ID + incarnation
recurrence ID + incarnation
```

---

# 26. Same-Incarnation Edit

Editing fields while preserving source incarnation remains the same Commitment.

---

# 27. Removed Commitment

If an editor target no longer exists:

show truthful unavailable state.

No fallback by index/title.

---

# 28. Recreated Commitment

Mandatory fixture:

```text
Commitment A
    ↓
Library target

remove A

recreate B
same visible fields
same logical-looking IDs where fixture permits
fresh incarnation

activate stale A target
```

B must not open.

---

# 29. Remove Commitment

Reuse current paired removal semantics.

Audit exact behavior for:

* template;
* recurrence;
* Goal link/provenance;
* other dependent references.

Do not leave orphaned authored source if canonical removal currently removes the pair.

---

# 30. Enable / Disable

If the current Commitment editor exposes `enabled`:

Library must provide truthful discoverability and editing.

No new toggle shortcut is required if the canonical editor already handles it.

If a direct Library toggle is considered, it must call the same canonical draft mutation and preserve exact identity.

Prefer reuse over convenience.

---

# 31. Re-enable Workflow

A disabled Commitment must remain discoverable so it can be edited/re-enabled.

This is a core reason the Library exists.

---

# 32. Recurrence Inventory Responsibility

Commitment Library owns complete access to authored recurrence because recurrence is scheduling intent.

Month contextual editing may continue to expose recurrence for exact visible sources.

No second recurrence implementation.

---

# 33. Supported Recurrence Families

Preserve every currently supported recurrence family.

Use actual current production support.

Do not add new families.

---

# 34. Unsupported / Legacy Recurrence Preservation

If existing source data contains recurrence semantics the current bounded editor cannot author fully:

preserve them exactly.

Do not erase, normalize, or downgrade unsupported data when editing unrelated fields.

Reuse established preservation behavior from earlier Commitment convergence.

---

# 35. Recurrence Identity

Preserve recurrence logical ID/incarnation exactly on ordinary edits.

Recreated recurrence does not become the old target.

---

# 36. Advanced Commitment Fields Audit

Before migrating advanced fields, enumerate every Plan-only field and determine:

* actual source;
* semantic meaning;
* supported edit behavior;
* whether Month contextual editor already exposes it;
* whether Library should expose it by default or progressive disclosure;
* preservation requirements.

Do not simply expose raw source objects.

---

# 37. Progressive Disclosure

Advanced fields should remain available without making routine Library editing cognitively heavy.

Preferred model:

```text
Commitment
    common fields

Advanced
    less common scheduling controls
```

Use existing disclosure patterns where possible.

---

# 38. Hidden-Field Preservation

Opening and saving a Commitment through the common editor must preserve advanced source fields not changed by the user.

This remains mandatory.

---

# 39. Template Source Fields

Audit every template field still considered advanced.

Preserve existing semantics.

Do not reinterpret internal engine terminology into new product concepts without evidence.

---

# 40. Recurrence Source Fields

Same.

---

# 41. Priority Boundary

If Commitments currently have a priority field used by scheduling:

preserve it exactly.

Do not convert it into:

* Goal importance;
* user-wide ranking;
* Allocation;
* Recommendation priority.

---

# 42. Preferred Timing Boundary

Preserve current authored preferred timing/window semantics.

Do not expose direct generated start/end editing.

---

# 43. Fixed / Flexible Boundary

Preserve whatever canonical Commitment distinction currently exists.

Do not invent new Commitment classes.

---

# 44. Sleep Commitment

Sleep remains part of the Commitment inventory according to existing product projection.

Do not move Sleep into Work Pattern.

Do not introduce health semantics.

---

# 45. Goal Link Context

Audit how a Commitment is connected to Goals.

Commitment Library may show:

* linked Goal;
* link status;
* contextual navigation;

where current authority supports it.

Goal remains independent authority.

---

# 46. Goal Writer Boundary

Commitment Library must not create a second Goal writer.

If Goal-link changes are currently owned by Goal workflow rather than Commitment workflow, preserve that separation.

---

# 47. Missing Goal Link

If a linked Goal source is unavailable/replaced under current exact semantics:

show truthful current state.

Do not retarget by Goal name.

---

# 48. Goal Ranking Boundary

No Goal ranking or prioritization behavior.

---

# 49. Work Boundary

Library does not show Work definitions as Commitments.

Generated Work remains structurally separate.

---

# 50. Event Boundary

Manual Events are not Commitment Library items.

Events remain Month/calendar-authored facts.

---

# 51. Pattern Library Boundary

Do not add:

* “Save as pattern”;
* reusable Commitment preset;
* reusable Routine;
* instantiation semantics.

Those belong to future Pattern Library/Routine architecture.

---

# 52. Month Contextual Relationship

Month remains the fastest way to edit a Commitment that is already visible in the plan.

Required relationship:

```text
Month occurrence
    ↓
exact Edit Commitment
    ↓
shared editor
```

Library is not intended to replace this contextual path.

---

# 53. Library Contextual Entry

Month should expose a Planner-level **Commitment Library** entry.

Possible placement:

* Planning/Month toolbar;
* contextual supporting-action region.

Do not require users to enter legacy Plan to discover inactive sources.

---

# 54. Context Preservation

Month → Commitment Library → Month preserves:

* displayed Month;
* selected user-day;
* SetupDraft;
* pending dirty state.

---

# 55. Library Direct Entry

Direct entry must show the complete inventory independent of selected Month/day.

Selection is not required.

---

# 56. Contextual Source Entry

If Month opens the Library for an exact current Commitment, the workspace may focus/open that exact source.

Revalidate after lazy loading.

---

# 57. Lazy Revalidation

Required:

```text
activate Library/Edit target
    ↓
lazy capability loading
    ↓
current SetupDraft reread
    ↓
exact template + recurrence incarnations still exist?
```

Only then open.

---

# 58. Source Replacement During Load

Mandatory regression:

```text
open Commitment
    ↓
chunk/workspace loading
    ↓
profile/restore/source recreation
    ↓
load completes
```

Replacement must not open under stale identity.

---

# 59. Library Workspace State

Use ephemeral UI/application state only.

Possible bounded modes:

```text
inventory
addCommitment
editCommitment
```

Do not persist:

* filter;
* selection;
* editor mode;
* focus.

---

# 60. Inventory Selection

If inventory selection is introduced:

selection identifies exact current source.

Changing inventory selection must not retarget an already-open local editor silently.

---

# 61. Search / Filter Boundary

A search/filter may be implemented only if necessary for usability and remains a pure presentation over the complete inventory.

No search is required for Task 7.8 unless inventory scale/UX evidence warrants it.

Do not inflate scope.

---

# 62. Category Filter Boundary

Same.

---

# 63. Empty Library

Truthful empty state:

* no authored Commitments exist;
* Add Commitment available.

Do not mix Events or Work into the empty-state count.

---

# 64. Disabled-Only Library

If all Commitments are disabled:

show them.

Do not show an empty-state message.

---

# 65. Non-Occurring-Only Case

If none of the authored Commitments occur in current Month:

Library remains complete and unaffected.

---

# 66. Shared SetupDraft

Library uses the same SetupDraft as:

* Planning Settings;
* Work Pattern;
* Month contextual Commitment editing;
* temporary Plan.

No Commitment-specific draft.

---

# 67. Cross-Workflow Draft

Mandatory:

```text
edit Work Pattern
    ↓
open Commitment Library
    ↓
edit Commitment
    ↓
open Planning Settings
```

All unsaved changes coexist.

---

# 68. Dirty State

Use existing global setup dirty detection.

Library does not own a separate “unsaved Commitment” durable state after a local editor commits into SetupDraft.

---

# 69. Save Setup

Expose or reuse the singular Save Setup boundary where appropriate.

Do not add **Save Library**.

---

# 70. Save Success

Preserve:

* canonical authored validation;
* exact IDs/incarnations;
* durable authored replacement;
* dirty clear;
* schedule staleness according to actual setup change;
* current workspace/context.

---

# 71. Save Failure

Remain on unsaved draft.

Surface canonical validation.

No partial persistence.

---

# 72. Save / Refresh Separation

Mandatory:

```text
edit Commitment
    ↓
Save Setup
    ↓
schedule stale
    ↓
Refresh
```

No automatic schedule regeneration.

---

# 73. Goal-Only / Non-Scheduling Change Boundary

If any Commitment-related edit does not stale Preview under current canonical semantics, preserve actual behavior.

Do not blanket-stale without evidence.

---

# 74. Canonical Validation

Final Save continues through complete authored-setup validation.

Do not create a weaker Library-only durable validator.

---

# 75. Local Validation

Existing bounded local validation remains.

Examples may include:

* required title;
* duration;
* recurrence requirements;
* weekday selections;
* supported time/window fields.

Use actual implementation.

---

# 76. Unsupported Data Safety

Editing one field must not accidentally destroy:

* unsupported recurrence data;
* unknown-but-valid preserved source fields;
* source lifecycle fields;
* exact Goal provenance where separately owned.

---

# 77. Profile Replacement

While Library/editor is open:

* profile load replaces current authored setup;
* inventory reprojects;
* stale exact target closes/unavailable;
* local buffer must not mutate replacement source.

---

# 78. Restore Replacement

Same.

---

# 79. Full Clear

Library reprojects cleared/default inventory.

No ghost cards or stale editors.

---

# 80. Protection

Protected authored state must not become writable empty Library.

Reuse canonical recovery/protection UI.

---

# 81. Legacy Plan Reuse

During staged migration, legacy Plan may still expose Commitments.

It must reuse the same Commitment projection/editor.

Do not leave duplicate implementation behind.

---

# 82. Legacy Plan Reduction

After direct Commitment Library is proven, remove redundant Commitment-specific Plan composition where safe.

The goal is not necessarily to remove the Plan route in this task.

The goal is to prove Plan no longer owns unique product responsibility.

---

# 83. Residual Plan Audit

After migration, mechanically inspect legacy Plan for every remaining user-visible field/action.

Classify each:

* replaced by Planning Settings;
* replaced by Work Pattern;
* replaced by Commitment Library;
* shell/lifecycle;
* still unique;
* redundant wrapper.

No silent residue.

---

# 84. Plan Unique-Responsibility Test

The key test:

> **Can anything still be accomplished through Plan that cannot be truthfully accomplished through Month + Planning Settings + Work Pattern + Commitment Library + Review?**

Answer from production behavior.

---

# 85. Plan Retirement Readiness

If the answer is **no**, classify Plan:

**ready for retirement in the next bounded convergence task.**

Do not delete it automatically unless Task 7.8 implementation scope remains trivially safe and all task stop criteria explicitly support doing so.

Default expectation: retirement assessment, not retirement.

---

# 86. Month-Default Readiness

If both Work Pattern and Commitment Library now have direct truthful entries, reassess the Task 7.6/7.7 blocker.

Determine whether:

```text
Planner default → Month
```

is now product-ready.

Do not change default in Task 7.8 by default.

---

# 87. Planner Mature Architecture Assessment

Evaluate the resulting architecture:

```text
Planner

Month
    primary routine workspace

Planning Settings
    Goals
    global Preferences
    Planning Range

Work Pattern
    structural Work

Commitment Library
    complete scheduling-intent inventory

Detailed Review
    diagnostics / Try / Apply / Visualizer
```

Determine whether these should be:

* equal subnavigation;
* contextual supporting workflows from Month;
* some hybrid.

No final navigation rewrite in Task 7.8.

---

# 88. Library Naming Audit

Use **Commitment Library** unless implementation reveals a substantive product-language problem.

Audit whether **Library** communicates:

* complete inventory;
* authored sources;
* enabled/disabled discoverability.

Do not conflate with reusable Pattern Library.

---

# 89. Library vs Management

Evaluate whether `Commitment Library` or `Manage Commitments` better fits actual workflow.

This is a product-copy assessment.

Do not rename accepted architecture casually unless evidence is compelling.

---

# 90. Desktop Layout

Preferred conceptual layout:

```text
Commitment Library

[Add Commitment]

Commitment inventory
    ├── Commitment
    ├── Commitment
    ├── disabled Commitment
    └── ...

selected / editor region
```

or another bounded arrangement reusing existing components.

Avoid recreating the old full Setup screen.

---

# 91. Mobile Layout

At 320–430 px:

* inventory readable;
* editor stacked;
* advanced disclosure usable;
* no horizontal page scrolling;
* Back/navigation obvious.

---

# 92. Large Inventory Behavior

Audit layout with enough fixture Commitments to show multiple entries.

Do not introduce pagination/virtualization without need.

Normal page scrolling is acceptable.

---

# 93. Accessibility — Inventory

Each Commitment must have:

* accessible title/context;
* clear enabled/disabled status;
* target-specific Edit action.

Repeated unlabeled Edit buttons are insufficient.

---

# 94. Accessibility — Add

Add Commitment must be named and keyboard reachable.

---

# 95. Accessibility — Advanced

Advanced disclosure must communicate expanded/collapsed state.

---

# 96. Accessibility — Disabled State

Do not rely on color/opacity alone.

---

# 97. Accessibility — Save State

Pending/saved/stale status remains perceivable without color.

---

# 98. Focus — Open Library

Focus Library heading or inventory heading.

---

# 99. Focus — Contextual Entry

When exact source exists, focus that Commitment/editor target after lazy revalidation.

---

# 100. Focus — Add

Focus first logical Commitment field.

---

# 101. Focus — Edit

Focus editor heading/first logical field.

---

# 102. Focus — Remove

Return to a stable neighboring inventory item or Library heading/Add action.

---

# 103. Focus — Validation

Retain current exact validation focus behavior.

---

# 104. Focus — Save

Move to saved/stale status or stable Save action.

---

# 105. Focus — Back to Month

Restore selected-day/contextual trigger where appropriate.

---

# 106. Keyboard

Complete inventory/add/edit/remove/save workflows without pointer input.

---

# 107. Lazy Ownership

Strong preference:

* Commitment Library remains lazy;
* reuse existing Setup/Commitment lazy implementation;
* no advanced Commitment code becomes eager;
* no full invisible SetupScreen mounted merely to get the editor.

---

# 108. Extraction Architecture

Prefer bounded reusable components over scope flags sprawling indefinitely.

Audit whether current `SetupScreen` scoping remains maintainable after Work Pattern + Commitment Library extraction.

If necessary, extract:

```text
CommitmentLibraryWorkspace
CommitmentSection
AdvancedCommitmentFields
```

or actual evidence-derived modules.

Do not refactor for aesthetics alone.

---

# 109. SetupScreen Residual Role

After 7.8, determine whether `SetupScreen` remains:

* useful shared internal composition;
* temporary legacy shell;
* candidate for later deletion;
* shared implementation container without user-facing identity.

Do not equate file deletion with product retirement.

---

# 110. Bundle Governance

Task 7.2C remains governing.

Baseline:

```text
Initial raw        636,070
Initial gzip       161,963
Largest lazy        52,651
Total JS           760,931
```

---

# 111. Initial Raw

Warning:

```text
>= 650,000
```

Hard failure:

```text
> 685,000
```

Attribute growth.

---

# 112. Initial Gzip

Already in warning zone.

Hard failure:

```text
> 170,000
```

Do not make Commitment inventory code eager simply for convenient navigation.

---

# 113. Largest Lazy

Warning:

```text
>= 80,000
```

Hard failure:

```text
> 100,000
```

Audit if shared Setup/Commitment lazy ownership approaches warning.

---

# 114. Total JS

At:

```text
>= 800,000
```

perform governed growth review.

At:

```text
>= 825,000
```

stop for architecture review / ADR.

---

# 115. No Runtime Dependency

Mandatory.

---

# 116. No Bundle-Policy Change

Mandatory.

---

# 117. Tests — Complete Inventory

Cover:

* active Commitment;
* disabled Commitment;
* Commitment not projected in current Month;
* no Preview;
* stale Preview;
* complete inventory ordering.

---

# 118. Tests — Empty Inventory

Truthful empty state.

---

# 119. Tests — Disabled-Only Inventory

Must not look empty.

---

# 120. Tests — Add

Cover canonical Add workflow and SetupDraft semantics.

---

# 121. Tests — Edit

Cover exact current source, common fields, advanced fields, recurrence, hidden-field preservation.

---

# 122. Tests — Exact Identity

Cover:

* template exact match;
* recurrence exact match;
* same-incarnation edit;
* removed template;
* removed recurrence;
* recreated template;
* recreated recurrence;
* paired recreation.

No title/time fallback.

---

# 123. Tests — Remove

Cover paired canonical removal and dependent Goal-link behavior.

---

# 124. Tests — Enable / Disable

Cover current canonical enabled semantics.

Disabled source remains in Library.

---

# 125. Tests — Recurrence

Cover all currently authorable families.

At minimum use actual supported families from current implementation.

Do not alter recurrence semantics.

---

# 126. Tests — Unsupported Recurrence Preservation

Mandatory if legacy/unsupported values are supported by existing preservation contract.

---

# 127. Tests — Advanced Fields

Every migrated advanced field must have regression coverage proving no semantic drift.

---

# 128. Tests — Goal Links

Cover current exact link behavior and missing/replaced Goal semantics where applicable.

---

# 129. Tests — Sleep

Sleep remains a Commitment source and editable under canonical semantics.

---

# 130. Tests — Work Exclusion

No Shift/Work Pattern source appears in Commitment Library.

---

# 131. Tests — Event Exclusion

No manual Event appears in Commitment Library.

---

# 132. Tests — Cross-Workflow Draft

Work Pattern + Commitment Library + Planning Settings pending changes coexist.

---

# 133. Tests — Save / Refresh

Mandatory:

```text
edit Library Commitment
    ↓
Save Setup
    ↓
Month stale
    ↓
Refresh
    ↓
new schedule
```

---

# 134. Tests — Profile

Open exact Library editor → profile load → stale source not mutated.

---

# 135. Tests — Restore

Same.

---

# 136. Tests — Full Clear

No ghost inventory/editor.

---

# 137. Tests — Protection

No writable fabricated inventory.

---

# 138. Tests — Lazy Load Race

Exact source replacement during Library loading must not retarget.

---

# 139. Tests — Month Context

Month → Library → Month preserves displayed Month/selected label.

---

# 140. Tests — Plan Regression

Temporary Plan path still reaches shared Commitment behavior until retirement.

---

# 141. Tests — Work Pattern Regression

No structural Work behavior changes.

---

# 142. Tests — Planning Settings Regression

No Goals/global Preferences/Range behavior changes.

---

# 143. Tests — Review Regression

No resolution behavior changes.

---

# 144. Tests — Today/Summary Independence

Representative coverage sufficient.

---

# 145. Tests — Accessibility

Cover:

* inventory names;
* disabled status;
* Add;
* Edit target names;
* advanced disclosure;
* errors;
* Save state;
* Back;
* focus.

---

# 146. Browser QA — Direct Library

Production build:

```text
Month
    Commitment Library
```

Verify complete inventory rather than only Month-visible sources.

---

# 147. Browser QA — Disabled Commitment

Create/use controlled disabled fixture.

Verify discoverability and exact editing.

---

# 148. Browser QA — Non-Occurring Commitment

Use recurrence/Month fixture where authored source has no current Month occurrence.

Verify it remains visible in Library.

---

# 149. Browser QA — Add Commitment

Add through Library, Save Setup, Refresh, inspect resulting Month projection where applicable.

---

# 150. Browser QA — Edit Common Fields

Edit through Library and verify shared canonical behavior.

---

# 151. Browser QA — Advanced Fields

Exercise representative advanced source control(s).

Verify ordinary fields are not reset and hidden values remain preserved.

---

# 152. Browser QA — Recurrence

Exercise representative supported recurrence authoring.

---

# 153. Browser QA — Disable / Re-enable

Where supported, demonstrate source remains in Library while absent from generated schedule appropriately.

---

# 154. Browser QA — Remove

Verify source leaves Library and subsequent schedule is stale until Refresh.

---

# 155. Browser QA — Contextual Month Entry

Month visible Commitment → Edit uses shared exact source path.

Library and Month do not disagree about source identity.

---

# 156. Browser QA — Cross-Workflow Draft

Edit Work Pattern without saving.

Edit Commitment Library without saving.

Open Planning Settings.

Verify both pending changes survive until one Save Setup.

---

# 157. Browser QA — Keyboard

Complete:

* Library open;
* Add;
* Edit;
* recurrence;
* advanced disclosure;
* Save;
* return;

without mouse.

---

# 158. Browser QA — Mobile

Validate:

```text
320
375
390
430
```

No horizontal overflow.

---

# 159. Browser QA — Slow Load

Throttle Library lazy load.

Verify:

* Month remains mounted where contextual;
* truthful loading;
* exact target revalidation;
* deterministic focus.

---

# 160. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.8_COMMITMENT_LIBRARY_EXTRACTION_AND_ADVANCED_SCHEDULING_INTENT_MIGRATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 7.7 Prerequisite
4. Initial Commitment Composition Audit
5. Files Changed
6. Commitment Product Definition
7. Commitment Library Architecture
8. Direct Entry
9. Month Contextual Entry
10. Complete Inventory Source
11. Projection
12. Ordering
13. Active Commitment Presentation
14. Disabled Commitment Presentation
15. Non-Occurring Commitment Presentation
16. Preview Independence
17. Empty State
18. Add Commitment
19. Add Defaults
20. Draft Boundary
21. Edit Commitment
22. Exact Identity
23. Same-Incarnation Edit
24. Removed Source
25. Recreated Source
26. Remove Commitment
27. Enable / Disable
28. Re-enable
29. Recurrence Responsibility
30. Supported Recurrences
31. Unsupported Recurrence Preservation
32. Recurrence Identity
33. Advanced Fields Audit
34. Progressive Disclosure
35. Hidden-Field Preservation
36. Template Fields
37. Recurrence Fields
38. Priority Boundary
39. Preferred Timing
40. Fixed/Flexible Boundary
41. Sleep
42. Goal-Link Context
43. Goal Writer Boundary
44. Missing Goal
45. Work Boundary
46. Event Boundary
47. Pattern Library Boundary
48. Month Relationship
49. Library Context Preservation
50. Contextual Source Entry
51. Lazy Revalidation
52. Source Replacement During Load
53. Workspace State
54. Inventory Selection
55. Search / Filter Decision
56. Shared SetupDraft
57. Cross-Workflow Draft
58. Dirty State
59. Save Setup
60. Save Success
61. Save Failure
62. Save / Refresh
63. Validation
64. Unsupported Data Safety
65. Profile Replacement
66. Restore
67. Full Clear
68. Protection
69. Legacy Plan Reuse
70. Legacy Plan Reduction
71. Residual Plan Audit
72. Plan Unique-Responsibility Test
73. Plan Retirement Readiness
74. Month-Default Readiness
75. Mature Planner Architecture
76. Library Naming
77. Desktop Layout
78. Mobile Layout
79. Large Inventory
80. Accessibility
81. Focus
82. Keyboard
83. Lazy Ownership
84. Extraction Architecture
85. SetupScreen Residual Role
86. Initial-Raw Review
87. Initial-Gzip Review
88. Largest-Lazy Review
89. Total-JS Review
90. Runtime Dependency Assessment
91. Tests Added/Changed
92. Focused Validation
93. Full Validation
94. Bundle Validation
95. Browser Direct-Library QA
96. Browser Disabled QA
97. Browser Non-Occurring QA
98. Browser Add QA
99. Browser Edit QA
100. Browser Advanced QA
101. Browser Recurrence QA
102. Browser Disable/Re-enable QA
103. Browser Remove QA
104. Browser Month Context QA
105. Browser Cross-Draft QA
106. Browser Keyboard QA
107. Browser Mobile QA
108. Slow-Load QA
109. Governance Updates
110. ADR Determination
111. Deviations
112. Discoveries
113. Deferred Work
114. Inventory Matrix
115. Identity Matrix
116. Recurrence Matrix
117. Advanced-Fields Matrix
118. Draft / Save Matrix
119. Source-Visibility Matrix
120. Contextual Navigation Matrix
121. Lifecycle Matrix
122. Focus Matrix
123. Responsive Matrix
124. Loading Matrix
125. Bundle Matrix
126. Migration Matrix
127. Legacy Plan Matrix
128. Planner Surface Matrix
129. Authority Matrix
130. Product-Boundary Matrix
131. Epistemic Matrix
132. Architectural Invariant Assessment
133. Stop-Condition Assessment
134. Architectural Alignment Assessment
135. Plan-Retirement Readiness
136. Month-Default Readiness
137. Preset-Library Deferred Boundary
138. Task 7.9 Readiness
139. Recommended Next Task
140. Final Completion Determination

---

# 161. Required Inventory Matrix

| Source state                 | Appears in Library? |           Appears in Month? |             Editable? | Meaning                            |
| ---------------------------- | ------------------: | --------------------------: | --------------------: | ---------------------------------- |
| active + projected           |                 Yes |         Yes where generated |                   Yes | active authored intent             |
| active + no Month occurrence |                 Yes |                          No |                   Yes | active authored intent             |
| disabled                     |                 Yes |                 No expected |                   Yes | inactive authored intent           |
| unplaced candidate           |                 Yes |         contextual evidence |                   Yes | authored intent currently unplaced |
| removed                      |                  No |   stale projection possible |                    No | no current source                  |
| recreated                    |          new source | new/current projection only | exact new target only | distinct source                    |

---

# 162. Required Identity Matrix

| Entity                  | Exact fields             | Edit behavior | Recreated behavior |
| ----------------------- | ------------------------ | ------------- | ------------------ |
| template                | logical ID + incarnation | preserve      | new source         |
| recurrence              | logical ID + incarnation | preserve      | new source         |
| Commitment projection   | exact pair               | resolves both | never retarget     |
| Month contextual target | exact pair               | revalidate    | unavailable if old |
| Library target          | exact pair               | revalidate    | unavailable if old |

---

# 163. Required Recurrence Matrix

| Recurrence family                | Existing support | Library authoring | Month authoring | Preservation |
| -------------------------------- | ---------------: | ----------------: | --------------: | ------------ |
| daily                            |                  |                   |                 |              |
| weekly                           |                  |                   |                 |              |
| specific weekdays                |                  |                   |                 |              |
| times per user week              |                  |                   |                 |              |
| per-shift-segment if unsupported |                  |                   |                 |              |
| custom if unsupported            |                  |                   |                 |              |

Populate from current production evidence.

Do not infer support from type names alone.

---

# 164. Required Advanced-Fields Matrix

| Field/control | Source object | Month common editor? | Library advanced? | Preserve when untouched? |
| ------------- | ------------- | -------------------: | ----------------: | -----------------------: |

Enumerate every advanced Plan-only field.

No silent omission.

---

# 165. Required Draft / Save Matrix

| Action                | Local editor          | SetupDraft   | Durable setup | Preview                |
| --------------------- | --------------------- | ------------ | ------------- | ---------------------- |
| type field            | changed               | unchanged    | unchanged     | unchanged              |
| Add/Update Commitment | reset/update          | changed      | unchanged     | existing state         |
| disable/enable        | canonical local/draft | changed      | unchanged     | unchanged until Save   |
| remove                | local/draft           | changed      | unchanged     | unchanged until Save   |
| Save Setup            | settled               | synchronized | changed       | stale where applicable |
| Refresh               | unchanged             | unchanged    | unchanged     | regenerated            |

Refine from actual behavior.

---

# 166. Required Source-Visibility Matrix

| Source                                      | Month visibility | Library visibility | Why             |
| ------------------------------------------- | ---------------- | ------------------ | --------------- |
| enabled recurring source with occurrence    |                  |                    |                 |
| enabled recurring source with no occurrence |                  |                    |                 |
| disabled source                             |                  |                    |                 |
| unsupported recurrence source               |                  |                    |                 |
| Sleep source                                |                  |                    |                 |
| Work source                                 | excluded         | excluded           | structural Work |
| Event                                       | excluded         | excluded           | Event authority |

---

# 167. Required Contextual Navigation Matrix

| Entry                            |    Exact target? | Library behavior          | Retarget allowed? |
| -------------------------------- | ---------------: | ------------------------- | ----------------: |
| direct Library                   |               No | complete inventory        |               N/A |
| Month exact Commitment           |              Yes | exact source/edit if used |                No |
| stale exact source still current |              Yes | exact current source      |        exact only |
| removed source                   |          invalid | unavailable/root          |                No |
| recreated source                 | stale old target | unavailable/root          |                No |
| profile/restore replacement      |            stale | reproject                 |                No |

---

# 168. Required Lifecycle Matrix

| Lifecycle event   | Inventory result           | Open editor result | Pending draft |
| ----------------- | -------------------------- | ------------------ | ------------- |
| Save              | current                    | preserve if exact  | clears dirty  |
| profile load      | replacement inventory      | revalidate/close   | replaced      |
| restore           | replacement inventory      | revalidate/close   | replaced      |
| full clear        | cleared/default            | close              | cleared       |
| protection        | unavailable truthful state | non-writable       | protected     |
| source recreation | new item                   | old target invalid | current       |

---

# 169. Required Focus Matrix

| Action                  | Required focus |
| ----------------------- | -------------- |
| open Library            |                |
| contextual exact source |                |
| Add                     |                |
| Edit                    |                |
| recurrence validation   |                |
| advanced disclosure     |                |
| Remove                  |                |
| Save                    |                |
| unavailable source      |                |
| Back to Month           |                |

---

# 170. Required Responsive Matrix

| Width   | Inventory | Editor | Advanced fields | Save/status |
| ------- | --------- | ------ | --------------- | ----------- |
| 320     |           |        |                 |             |
| 375     |           |        |                 |             |
| 390     |           |        |                 |             |
| 430     |           |        |                 |             |
| tablet  |           |        |                 |             |
| desktop |           |        |                 |             |

---

# 171. Required Loading Matrix

| Capability                       | Lazy boundary | Month remains visible? | Exact revalidation? |
| -------------------------------- | ------------- | ---------------------: | ------------------: |
| direct Commitment Library        |               |    N/A/route-dependent |                 N/A |
| Month contextual Commitment edit | existing      |                    Yes |                 Yes |
| Library contextual edit          |               |                        |                 Yes |
| legacy Plan                      | existing      |                    N/A |             current |

---

# 172. Required Bundle Matrix

| Metric       | 7.7 baseline | 7.8 final | Warning | Hard/review |
| ------------ | -----------: | --------: | ------: | ----------: |
| Initial raw  |      636,070 |           | 650,000 |     685,000 |
| Initial gzip |      161,963 |           | 161,500 |     170,000 |
| Largest lazy |       52,651 |           |  80,000 |     100,000 |
| Total JS     |      760,931 |           |       — | 800k / 825k |

List:

* Month;
* Commitment Library;
* Work Pattern;
* remaining Plan;
* shared Setup;
* other materially changed chunks.

---

# 173. Required Migration Matrix

| Responsibility                   | Before 7.8        | After 7.8          | Legacy Plan unique? |
| -------------------------------- | ----------------- | ------------------ | ------------------: |
| Month contextual Commitment edit | Month             | Month/shared       |                  No |
| complete Commitment inventory    | Plan              | Commitment Library |         No expected |
| disabled source discovery        | Plan              | Commitment Library |         No expected |
| non-occurring source discovery   | Plan              | Commitment Library |         No expected |
| advanced Commitment fields       | Plan              | Commitment Library |         No expected |
| recurrence management            | Plan/shared       | Library/shared     |         No expected |
| Work structure                   | Work Pattern      | Work Pattern       |                  No |
| Goals/global settings            | Planning Settings | Planning Settings  |                  No |
| resolution                       | Review            | Review             |                  No |
| Save Setup                       | shared            | shared             |                  No |

---

# 174. Required Legacy Plan Matrix

| Plan capability               | Replacement after 7.8    | Still unique? |
| ----------------------------- | ------------------------ | ------------: |
| Goals                         | Planning Settings        |            No |
| global Preferences            | Planning Settings        |            No |
| Planning Range                | Planning Settings        |            No |
| Work structure                | Work Pattern             |            No |
| contextual Work               | Month → Work Pattern     |            No |
| contextual Commitment editing | Month                    |            No |
| complete Commitment inventory | Commitment Library       |               |
| advanced Commitment fields    | Commitment Library       |               |
| Save Setup                    | shared                   |            No |
| profile/lifecycle if present  | shell/canonical existing |         audit |

The final matrix must identify **every** residual capability.

---

# 175. Required Planner Surface Matrix

| Surface/workflow   | Mature role                 | Primary/supporting/specialized | Unique capability           |
| ------------------ | --------------------------- | ------------------------------ | --------------------------- |
| Month              | routine planning            | Primary                        | spatial/contextual planning |
| Planning Settings  | global configuration        | Supporting                     | Goals/prefs/range           |
| Work Pattern       | structural Work             | Supporting                     | complete Work structure     |
| Commitment Library | scheduling-intent inventory | Supporting                     | complete Commitment sources |
| Detailed Review    | diagnostics/resolution      | Specialized                    | Try/Apply/Visualizer        |
| Plan               | legacy                      | transitional                   | determine after 7.8         |

---

# 176. Required Authority Matrix

| Authority/source       |                   Library reads | Library writes through canonical path | New authority? |
| ---------------------- | ------------------------------: | ------------------------------------: | -------------: |
| SetupDraft             |                             Yes |                                   Yes |             No |
| durable authored setup |                         current |                            Save Setup |             No |
| template               |                             Yes |                            SetupDraft |             No |
| recurrence             |                             Yes |                            SetupDraft |             No |
| Goal                   |      contextual/read as allowed |             existing Goal writer only |             No |
| Work                   |                              No |                                    No |             No |
| Event                  |                              No |                                    No |             No |
| Preview                | optional contextual status only |                                 Never |             No |
| HistoricalPlan         |                              No |                                    No |             No |
| ExecutionHistory       |                              No |                                    No |             No |

---

# 177. Required Product-Boundary Matrix

| Capability                          | Task 7.8              |
| ----------------------------------- | --------------------- |
| complete Commitment Library         | Implement             |
| disabled/non-occurring discovery    | Implement             |
| Add/Edit/Remove Commitment          | canonical reuse       |
| recurrence management               | canonical reuse       |
| advanced source fields              | migrate/reuse         |
| Goal-link context                   | preserve              |
| Month contextual edit               | preserve              |
| Work structure                      | excluded              |
| Events                              | excluded              |
| Pattern Library                     | prohibited            |
| Work preset library                 | deferred              |
| Plan retirement                     | assessment by default |
| Month-default navigation            | assessment by default |
| scheduler redesign                  | prohibited            |
| recurrence redesign                 | prohibited            |
| Capacity/Allocation/Recommendations | prohibited            |

---

# 178. Required Epistemic Matrix

| Evidence/state             | DayFrame may represent             | Must not infer                      |
| -------------------------- | ---------------------------------- | ----------------------------------- |
| active Commitment          | authored scheduling intent         | scheduled occurrence exists         |
| disabled Commitment        | inactive authored intent           | deleted                             |
| no Month occurrence        | not projected this Month           | source absent/inactive              |
| unplaced current candidate | current generation could not place | impossible generally                |
| stale Preview              | old generated geometry             | current authored source absent      |
| exact template/recurrence  | editable current source            | any visually similar source         |
| recurrence                 | authored consideration cadence     | completion cadence                  |
| Goal link                  | authored relationship              | achieved Goal progress              |
| Sleep Commitment           | authored scheduling intent         | medically appropriate Sleep         |
| Library source             | authored intent                    | actual execution                    |
| removed source             | no current source                  | historical occurrence never existed |

---

# 179. Architectural Invariants

Assess at minimum:

1. Month remains primary routine Planner.
2. Commitment Library is supporting.
3. Planning Settings remains global configuration.
4. Work Pattern remains structural Work.
5. Review remains specialized.
6. Commitment remains a product projection, not new authority.
7. no Commitment persistence participant is added.
8. template authority remains existing authored setup.
9. recurrence authority remains existing authored setup.
10. exact template logical ID remains.
11. exact template incarnation remains.
12. exact recurrence logical ID remains.
13. exact recurrence incarnation remains.
14. visual similarity never establishes identity.
15. recreated template never retargets stale source.
16. recreated recurrence never retargets stale source.
17. same-incarnation edits remain same source.
18. complete Library derives from authored setup, not Preview.
19. disabled sources remain visible.
20. disabled does not mean deleted.
21. active/no-occurrence sources remain visible.
22. no Month occurrence does not mean inactive.
23. uncovered Month does not affect Library existence.
24. missing Preview does not affect Library existence.
25. stale Preview does not affect Library existence.
26. unplaced evidence does not define inventory.
27. canonical inventory ordering remains deterministic.
28. Add uses canonical Commitment form.
29. Edit uses canonical Commitment form.
30. Remove uses canonical source-pair semantics.
31. enable/disable preserves canonical semantics.
32. recurrence editor is not duplicated.
33. recurrence identities remain exact.
34. currently supported recurrence families remain supported.
35. unsupported/legacy recurrence data remains preserved.
36. no recurrence family is added.
37. advanced source fields remain preserved.
38. untouched hidden fields are not erased.
39. progressive disclosure does not create alternate semantics.
40. priority remains scheduling input only if currently defined as such.
41. priority does not become Goal ranking.
42. preferred timing remains authored intent.
43. generated times remain non-editable.
44. Sleep remains Commitment-backed.
45. Sleep does not become Work structure.
46. Events remain outside Library.
47. Work remains outside Library.
48. Goals remain separate authority.
49. Library does not create Goal writer.
50. Goal exactness remains preserved.
51. no Goal allocation is introduced.
52. no Goal recommendation is introduced.
53. Pattern Library is not implemented.
54. current BlockTemplate is not rebranded as reusable Pattern without evidence.
55. Work Pattern preset work remains independent.
56. one SetupDraft remains.
57. no Library-specific draft exists.
58. one Save Setup remains.
59. no Save Library durable transaction exists.
60. local editor remains local until Add/Update to draft.
61. global dirty state remains shared.
62. cross-workflow pending changes coexist.
63. navigation does not silently discard draft edits.
64. Save validates whole authored setup.
65. no weaker Library-only durable validator is added.
66. Save failure remains unsaved.
67. partial durable Save is prohibited.
68. Save and Refresh remain separate.
69. saved scheduling change stales Preview under existing semantics.
70. Save does not auto-generate.
71. profile load replaces Library authority.
72. stale local buffers cannot mutate replacement profile.
73. restore replaces Library authority.
74. full clear clears/reprojects inventory.
75. protection never produces writable fabricated empty state.
76. Library workspace state is ephemeral.
77. inventory selection is ephemeral.
78. filter/search if any is ephemeral.
79. Month context survives Library navigation.
80. selected user-day is not Library authority.
81. direct Library does not require selected day.
82. contextual Month editing remains available.
83. Library does not replace fastest contextual source editing.
84. exact targets revalidate after lazy loading.
85. source replacement during loading does not retarget.
86. legacy Plan shares implementation during migration.
87. duplicate Plan/Library writers are prohibited.
88. Work Pattern behavior remains unchanged.
89. Planning Settings behavior remains unchanged.
90. Review behavior remains unchanged.
91. Today remains unchanged.
92. Summary remains unchanged.
93. HistoricalPlan remains unchanged.
94. ExecutionHistory remains unchanged.
95. scheduler behavior remains unchanged.
96. recurrence engine behavior remains unchanged.
97. no direct geometry editing is introduced.
98. no drag/drop is introduced.
99. no Capacity is introduced.
100. no Allocation is introduced.
101. no Recommendations are introduced.
102. no transition adaptation is introduced.
103. no new persistence is introduced.
104. no Backup version change is introduced.
105. no runtime dependency is introduced.
106. no bundle-policy change occurs.
107. Library remains lazy.
108. advanced Commitment code does not become eager unnecessarily.
109. initial raw hard guard remains green.
110. initial gzip hard guard remains green.
111. largest-lazy hard guard remains green.
112. total JS remains reported.
113. > =800k triggers growth review.
114. > =825k triggers architecture review.
115. warning-zone eager growth is attributed.
116. inventory is keyboard accessible.
117. Add/Edit/Remove are keyboard accessible.
118. disabled state is accessible without color.
119. advanced disclosure is accessible.
120. validation focus remains deterministic.
121. Save focus remains deterministic.
122. Back-to-Month focus remains deterministic.
123. mobile inventory works at 320–430 px.
124. mobile editor works at 320–430 px.
125. no horizontal page scroll is required.
126. large inventory remains usable.
127. complete Plan residual responsibility is audited.
128. Plan retirement is based on zero unique responsibility.
129. Plan retirement is not assumed.
130. Month-default readiness is reassessed only after direct Library exists.
131. Planner mature architecture is explicitly assessed.
132. Supporting workflows need not become equal tabs.
133. preset-library work does not interrupt this convergence task.
134. full focused tests pass.
135. full repository validation passes.
136. production browser Library QA passes.
137. exact-identity browser/integration evidence passes.
138. keyboard QA passes.
139. mobile QA passes.
140. slow-load QA passes.
141. governance records Commitment Library ownership.
142. governance records residual Plan responsibility.
143. Task 7.9 follows the evidence.
144. no production responsibility disappears without a replacement.

Classify each as:

* Confirmed
* Implemented
* Preserved
* Covered by test
* Covered by browser QA
* Inferred
* Decision required
* Deferred
* Prohibited
* Not applicable
* Blocked

---

# 180. Stop Conditions

Stop the affected slice rather than inventing architecture if:

* complete authored Commitment inventory cannot be projected without Preview;
* disabled/non-occurring sources cannot be identified truthfully;
* Library extraction requires a new Commitment authority;
* Add/Edit cannot reuse the canonical existing writer;
* advanced source fields cannot be preserved through the shared editor;
* recurrence exact identity cannot remain intact;
* unsupported recurrence data would be destroyed;
* paired template/recurrence removal semantics are ambiguous;
* Goal-link behavior cannot remain exact;
* Library requires Work sources to appear as Commitments;
* Library needs persisted UI state;
* SetupDraft cannot remain shared;
* Save Setup would need Library-specific transaction semantics;
* profile/restore/full-clear replacement cannot invalidate local editor safely;
* Plan contains an additional unique responsibility not covered by Task 7.6/7.7;
* mobile or keyboard usability becomes materially worse;
* hard bundle guard fails without safe bounded remediation;
* total JS reaches 825,000;
* new runtime dependency is required;
* persistence/Backup schema change becomes necessary.

A Plan-retirement blocker does **not** block Commitment Library completion.

Record the exact remaining Plan responsibility and defer convergence.

---

# 181. Focused Validation

Run focused suites for:

* `commitmentProjection`;
* `CommitmentSection`;
* SetupDraft;
* SetupScreen scoped composition;
* recurrence authoring;
* exact Commitment identity/navigation;
* Goal links where relevant;
* Month contextual Commitment workflow;
* Commitment Library;
* profile;
* restore;
* full clear;
* protection;
* Work Pattern regression;
* Planning Settings regression;
* bundle policy.

Record exact files and test counts.

---

# 182. Full Validation

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
* Commitment Library chunk;
* Work Pattern/shared Setup chunk;
* remaining Plan chunk;
* largest lazy;
* total JS;
* warning state;
* review milestone state;
* diff result.

---

# 183. Manual Browser Validation

Use production build.

Validate:

* complete inventory;
* disabled source;
* non-occurring source;
* Add;
* exact Edit;
* recurrence;
* advanced fields;
* enable/disable if supported;
* Remove;
* shared draft;
* Save/Refresh;
* Month contextual relationship;
* profile/replacement where safely reproducible;
* keyboard;
* mobile;
* lazy loading.

Do not substitute source inspection for core user journeys where fixtures permit production QA.

---

# 184. Governance Updates

Update:

* Task 7.8 result;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Record:

* Commitment Library as complete scheduling-intent inventory;
* Month as contextual source editing;
* Work Pattern as structural Work;
* Planning Settings as global configuration;
* Review as specialized resolution;
* residual Plan responsibility;
* Plan-retirement readiness;
* Month-default readiness;
* preset-library deferral remains independent.

---

# 185. ADR Determination

No ADR is expected if Commitment Library is purely a surface/workflow projection over existing authored template/recurrence authority.

Create or recommend an ADR only if implementation discovers an enduring change to:

* Commitment authority;
* identity;
* persistence;
* recurrence semantics;
* transaction/save boundary.

Do not create an ADR merely for the Library label or navigation.

---

# 186. Plan-Retirement Readiness Classification

At task end classify one:

### A — Plan Has Zero Unique Responsibility

Every Plan capability has a direct truthful replacement.

Authorize a bounded navigation-convergence/Plan-retirement task.

### B — One Small Residual Responsibility Remains

Name it precisely.

Recommend one final extraction.

### C — Plan Still Owns Meaningful Advanced Capability

Preserve Plan intentionally and explain why Task 7.6's decomposition was incomplete.

### D — Architecture Gap Discovered

Name the prerequisite.

---

# 187. Month-Default Readiness Classification

Independently classify:

### Ready

Month now provides routine planning and direct entry to all supporting workflows.

### Not Ready — Navigation Only

Capabilities exist but navigation hierarchy must converge first.

### Not Ready — Capability Gap

Name the missing capability.

Do not change default in Task 7.8 unless separately and explicitly authorized.

---

# 188. Task 7.9 Readiness

Possible outcomes:

### Outcome A — Plan Zero Unique Responsibility

Recommend:

> **Task 7.9 — Planner Navigation Convergence, Month Default, and Legacy Plan Retirement**

This should:

* make Month the default Planner destination;
* remove Plan as a primary navigation destination;
* preserve direct/contextual Planning Settings;
* preserve Work Pattern;
* preserve Commitment Library;
* preserve Detailed Review;
* remove genuinely dead Plan wrapper composition;
* verify no capability loss.

### Outcome B — Small Residual Plan Responsibility

Recommend the precise final extraction instead.

### Outcome C — Plan Still Justified

Do not manufacture retirement.

Proceed to another Phase 7 priority.

### Outcome D — Convergence Architecture Gap

Name it precisely.

---

# 189. Preset-Library Deferred Boundary

Task 7.7 established that Work Pattern preset structure is mechanically expressive but preset application policy remains unresolved around:

* replace/add/merge;
* date/anchor mapping;
* existing Work protection.

Task 7.8 must not reopen or solve that architecture unless an unexpected dependency appears.

Preset work remains independent of Commitment Library convergence.

---

# 190. Completion Criteria

Task 7.8 is complete only when:

* the current legacy Plan Commitment responsibility has been mechanically audited;
* a bounded Commitment Library supporting workspace exists;
* direct Library access exposes the complete current authored Commitment inventory independent of Preview and displayed Month;
* active, disabled, and non-occurring Commitments remain truthfully discoverable;
* absence from Month never implies absence from authored intent;
* Library inventory is a deterministic projection over existing template/recurrence sources rather than a new authority;
* canonical inventory ordering remains deterministic;
* Add Commitment reuses the existing canonical bounded writer;
* Edit Commitment resolves exact current template and recurrence logical IDs/incarnations;
* same-incarnation edits remain valid;
* removed or recreated sources never retarget stale Library/Month targets;
* Remove Commitment preserves current paired source and Goal-link semantics;
* enabled/disabled state remains canonical and disabled sources remain recoverable in Library;
* every currently supported recurrence family remains authorable exactly as before;
* unsupported/legacy recurrence data remains preserved when unrelated fields change;
* recurrence identity remains exact;
* every advanced Plan-only Commitment field has been enumerated and either migrated into the Library's canonical shared editor or explicitly justified as a remaining responsibility;
* ordinary editing preserves untouched advanced and hidden source data;
* advanced controls use progressive disclosure where useful without creating alternate semantics;
* Sleep remains Commitment-backed;
* Work remains excluded as structural Work;
* Events remain excluded as Event authority;
* Goals remain separate authority and Goal-link behavior remains exact;
* no Goal ranking, Allocation, Recommendation, Pattern Library, Work preset, scheduler change, recurrence redesign, or new Commitment semantics are introduced;
* Month contextual editing continues to provide the fast path for visible sources;
* Month can reach Commitment Library directly without legacy Plan;
* contextual exact Library entry revalidates after lazy loading;
* source replacement during lazy loading cannot retarget;
* one SetupDraft remains shared across Work Pattern, Commitment Library, Planning Settings, Month contextual authoring, and temporary Plan;
* cross-workflow unsaved changes coexist;
* one Save Setup transaction remains;
* Save validates the complete authored setup;
* no Library-specific durable Save exists;
* Save failure cannot partially persist;
* Save and Refresh remain explicit distinct operations;
* profile load, restore, full clear, protection, and source recreation cannot leave stale writable editor state;
* Library workspace/selection/filter state remains ephemeral;
* desktop and 320–430px mobile inventory/editor layouts remain usable;
* disabled status and all primary actions remain accessible without visual-only cues;
* keyboard authoring is complete;
* focus after entry/add/edit/remove/validation/save/unavailable/back is deterministic;
* Commitment Library remains appropriately lazy and does not make advanced Setup code eagerly reachable without justification;
* legacy Plan uses shared implementation during migration and does not retain duplicate Commitment forms;
* a complete residual Plan audit proves exactly what, if anything, remains unique;
* Plan-retirement readiness receives an explicit A/B/C/D classification;
* Month-default readiness receives an explicit classification;
* mature Planner surface architecture is recorded;
* Task 7.7's Work Pattern preset blocker remains independently deferred;
* no new persistence, Backup version, runtime dependency, authority, or bundle-policy change is introduced;
* all hard bundle guards remain green;
* warning-zone growth is explicitly attributed;
* total JS remains governed by the 800k/825k milestones;
* focused and full repository validation pass;
* production-browser complete-inventory, disabled/non-occurring, Add/Edit/advanced/recurrence/remove, shared-draft, Save/Refresh, keyboard, mobile, and lazy-loading QA pass;
* governance records Commitment Library ownership and remaining Plan responsibility;
* Task 7.9 is either precisely authorized as final Planner-navigation convergence/Plan retirement or replaced by the exact bounded responsibility still requiring extraction.

---

# 191. Final Implementation Principle

> **The calendar can show only what is projected there. The Commitment Library must remember everything the user has actually taught DayFrame.**

A disabled Commitment is still intent.

A Commitment that happens next month is still intent.

A Commitment outside the current Preview is still intent.

A Commitment that could not be placed is still intent.

So the mature relationship is:

```text
Commitment Library
    complete authored intent

        ↓ generation

Month
    contextual planned expression of that intent
```

Neither surface replaces the other.

---

# 192. Final Completion Statement

**Task 7.8 is complete when DayFrame has extracted the final coherent scheduling-intent responsibility from legacy Plan into a bounded lazy Commitment Library that derives a complete deterministic inventory from the existing canonical template/recurrence authored sources rather than from Preview or Month geometry; when active, disabled, non-occurring, unplaced, Sleep-backed, common, recurrent, and advanced Commitments remain truthfully discoverable and editable according to their actual source state; when Month remains the fast contextual editing path for Commitments already visible in the plan while Library remains the complete inventory for sources that may be inactive, outside the displayed Month, outside current coverage, or otherwise absent from spatial projection; when Add, Edit, Remove, enable/disable, recurrence authoring, advanced source fields, hidden-field preservation, Goal-link context, exact template/recurrence logical IDs and incarnations, stale/recreated-source protection, and unsupported-data preservation all reuse the already canonical Commitment projection and writer rather than creating a new Commitment authority or parallel form; when Work remains exclusively Work Pattern responsibility, Events remain Event authority, Goals remain independent authority, Pattern Library and Work Pattern presets remain distinct deferred concerns, and no generated schedule geometry becomes authored; when Commitment Library, Work Pattern, Planning Settings, Month contextual authoring, and temporary legacy Plan all continue sharing one SetupDraft, one canonical whole-setup validation boundary, one Save Setup transaction, one dirty state, and explicit Save → stale Preview → Refresh semantics; when profile replacement, restore, full clear, protection, source recreation, and lazy-load races cannot leave a stale editor capable of mutating replacement authority; when complete inventory navigation, progressive advanced authoring, accessibility, deterministic focus, keyboard operation, 320–430px mobile behavior, lazy ownership, and bundle governance remain sound; when legacy Plan has been mechanically re-audited after migration and every remaining capability has either a direct truthful replacement in Month, Planning Settings, Work Pattern, Commitment Library, or Detailed Review or is explicitly identified as the exact residual blocker; when Plan-retirement and Month-default readiness receive explicit evidence-based classifications, no persistence, Backup, authority, recurrence, scheduler, runtime-dependency, preset, Capacity, Allocation, Recommendation, transition-adaptation, or bundle-policy change is introduced, all focused/full/browser validation passes, governance records the completed scheduling-intent boundary, and Task 7.9 is either authorized as the final Planner Navigation Convergence, Month Default, and Legacy Plan Retirement task or replaced by one precisely named final extraction required before that convergence can truthfully occur.**
