# Task 7.7 — Work Pattern Workspace Extraction, Advanced Work Configuration Migration, and Preset-Ready Architecture

## Status

Ready for implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

Work Pattern product-workspace implementation, advanced Work configuration extraction, legacy Plan decomposition, Shift Definition inventory migration, manual/repeating Work-regime migration, off-day/rotation editing, regime-specific schedule-preference override migration, shared SetupDraft/Save Setup integration, exact identity and referential-integrity preservation, Month contextual Work entry convergence, preset-readiness architecture audit, bounded preset-definition foundation if mechanically justified, lazy-loading preservation, accessibility/mobile/focus/browser validation, bundle-governance compliance, regression testing, and governance.

**This task does not pre-authorize the full Work Pattern preset library, Commitment Library, Plan retirement, Month-default navigation, transition recommendations, scheduler redesign, recurrence redesign, Pattern Library, Capacity, Allocation, or Recommendations.**

---

# 1. Objective

Extract the structural Work responsibilities identified by Task 7.6 from the legacy Plan surface into a coherent **Work Pattern** supporting workspace.

Task 7.6 established that these responsibilities form one domain:

```text
Work Pattern
    ├── Shift Definitions
    ├── Work schedule / cycle structure
    ├── manual dated Work regimes
    ├── repeating rotations
    ├── off days
    ├── regime-specific boundary overrides
    └── regime-specific week-start overrides
```

Task 7.7 must make that product boundary real without introducing new Work authority, new writers, or new scheduling semantics.

A second objective is to establish whether this extraction completes the architecture required for a future library of preset Work Patterns.

The governing preset question is:

> **Can a preset be represented as reusable authored Work-structure input that creates a valid Work Pattern through the existing canonical SetupDraft and Save Setup transaction, without becoming authority itself or carrying user-specific durable identity?**

Answer this mechanically during implementation.

---

# 2. Governing Product Principle

> **Work Pattern defines when Work structurally exists. Month shows what that structure produces.**

Therefore:

```text
Work Pattern
    authored structural rules

Month
    contextual generated Work evidence

Preview
    derived dated schedule

HistoricalPlan
    frozen historical evidence
```

Do not allow Work Pattern to become direct generated-schedule editing.

---

# 3. Governing Preset Principle

> **A preset may initialize authored structure. It must never become authored authority itself.**

Conceptually:

```text
Preset definition
      ↓
instantiate
      ↓
fresh authored identities
      ↓
SetupDraft Work Pattern
      ↓
user reviews/edits
      ↓
Save Setup
```

A preset must not:

* remain linked as live authority unless separately designed later;
* overwrite current Work silently;
* reuse preset-owned incarnations as user-owned exact identity;
* mutate Preview directly;
* bypass validation;
* bypass Save Setup;
* prescribe transition adaptations or recommendations.

---

# 4. Task 7.6 Prerequisite

Treat Task 7.6 as governing.

It established:

* **Outcome C — multiple workflows are canonical**;
* Work Pattern is accepted for structural Work responsibilities;
* Schedule Structure is rejected for the current domain;
* Commitment Library is separate intent inventory;
* Plan must decompose rather than rename;
* Work is architecturally distinct from ordinary Commitments;
* Shift Definitions, cycles, manual regimes, repeating rotations, off days, and regime overrides form one coherent Work task;
* global Preferences remain Planning Settings;
* regime-specific overrides belong with the owning Work regime;
* `transitionStrategyId` is dormant metadata only;
* Work Pattern may later provide structural facts to a separate transition-advisory layer;
* Plan remains until Work Pattern and Commitment Library both replace its unique responsibilities;
* Month must not become default until those replacements are proven;
* current baseline is:

```text
Initial raw        634,896
Initial gzip       161,779
Largest lazy        52,326
Total JS           759,310
```

---

# 5. Governing Structural-vs-Intent Boundary

Preserve the Task 7.6 distinction:

```text
Work Pattern
    structural scheduling constraints/regimes

Commitments
    authored scheduling intent

Events
    dated anchored authored facts

Preview
    derived schedule

HistoricalPlan
    historical evidence
```

Do not move Commitments into Work Pattern merely because both currently share SetupDraft.

---

# 6. Governing Temporal Boundary

Do not alter canonical user-day semantics.

For local date label `D`:

```text
prefs(D)
start(D)
day(D) = [start(D), start(D+1))
```

Work Pattern authors some inputs used by effective preference resolution.

It does not independently resolve user-day ownership.

---

# 7. Governing Save Boundary

All structural Work changes continue through:

```text
Work Pattern editor
        ↓
shared SetupDraft
        ↓
Save Setup
        ↓
durable authored setup
        ↓
Preview stale
        ↓
explicit Refresh Schedule
```

No Work-specific durable save transaction.

---

# 8. Governing One-Writer Principle

Task 7.7 introduces a new product workspace, not new domain writers.

Required:

```text
Legacy Plan Work controls
        │
        ├──────────────┐
        ↓              ↓
canonical Work editing implementation
        ↑              ↑
        │              │
Work Pattern workspace
Month contextual Work entry
```

During migration, duplicate navigation is acceptable.

Duplicate writers are not.

---

# 9. Explicit Scope

Implement and/or audit:

* Work Pattern workspace;
* Planner entry to Work Pattern;
* Month contextual Work → Work Pattern;
* Shift Definition inventory;
* Shift Definition add/edit/delete;
* Work Pattern/cycle inventory;
* manual cycle mode;
* repeating sequence mode;
* anchor/reference date;
* cycle bounds;
* manual dated regimes;
* repeating rotation entries;
* off/null Work days;
* regime-specific day-boundary override;
* regime-specific week-start override;
* notes where currently supported;
* dormant `transitionStrategyId` preservation;
* SetupDraft reuse;
* Save Setup reuse;
* pending-change status;
* validation;
* exact identities/incarnations;
* referential integrity;
* deletion/replacement behavior;
* profile load;
* restore;
* full clear;
* protection;
* Month context preservation;
* lazy-loading architecture;
* preset-readiness audit;
* preset contract definition if supportable;
* bounded preset foundation if mechanically justified;
* tests;
* production browser QA;
* bundle governance;
* governance documentation;
* legacy Plan responsibility reduction.

---

# 10. Explicit Non-Goals

Do not implement:

* full Work Pattern preset library unless explicitly authorized by the preset stop/go criteria below;
* preset browsing marketplace/community;
* user-created reusable presets;
* cloud preset sync;
* Commitment Library;
* Commitment Pattern Library;
* Plan retirement;
* Month-default navigation;
* Review retirement;
* new Shift Definition semantics;
* new cycle semantics;
* sequence regime overrides not currently supported;
* executable transition strategies;
* Sleep-transition recommendations;
* Goal reorientation;
* Capacity;
* Allocation;
* Recommendations;
* direct Work occurrence editing;
* drag/drop;
* scheduler redesign;
* persistence-schema change unless unexpectedly required;
* Backup-version change unless unexpectedly required;
* runtime dependency;
* bundle-policy change.

---

# 11. Execution Artifact Rules

Before implementation:

1. verify this Task 7.7 artifact;
2. create immutable project copy;
3. record SHA-256;
4. review:

   * Task 7.6 result;
   * current SetupScreen;
   * Work Hours section;
   * Work Schedule section;
   * Shift Definition types/writers;
   * ShiftCycle types/writers;
   * manual segment editor;
   * repeating sequence editor;
   * schedule-preference override controls;
   * SetupDraft;
   * Save Setup;
   * authored validation;
   * lifecycle/incarnation logic;
   * profile/restore/full-clear;
   * Month contextual Work path;
   * lazy Plan ownership;
   * bundle policy;
5. do not modify immutable artifacts.

Create:

`docs/implementation/phase-7/TASK_7.7_WORK_PATTERN_WORKSPACE_EXTRACTION_ADVANCED_WORK_CONFIGURATION_MIGRATION_AND_PRESET_READY_ARCHITECTURE_RESULT.md`

---

# 12. Mandatory Initial Work Composition Audit

Before extraction, trace the current Work UI mechanically.

Identify exact production ownership for:

* Shift Definition list;
* add Shift Definition;
* edit Shift Definition;
* delete Shift Definition;
* cycle list;
* add cycle;
* edit cycle;
* delete cycle;
* manual mode;
* repeating mode;
* manual segments;
* repeating entries;
* off days;
* cycle anchor;
* cycle bounds;
* notes;
* segment overrides;
* Save Setup.

Document reusable component boundaries before restructuring.

---

# 13. Work Pattern Workspace

Create a bounded supporting Planner workspace named:

**Work Pattern**

unless implementation discovers a severe product-language blocker contradicting Task 7.6.

This workspace represents global structural Work configuration.

It is not selected-day authority.

---

# 14. Work Pattern Entry

Provide a direct Planner/Month entry:

**Work Pattern**

or equivalent clear action.

The user should no longer have to understand that structural Work configuration lives inside legacy Plan.

---

# 15. Month Contextual Work Entry

Task 7.3 already allows contextual Work navigation.

Change that contextual route, where appropriate, to open the Work Pattern workflow directly rather than opening the broad Plan surface.

Preserve contextual information where useful.

---

# 16. Contextual Work Target

When entering from a generated Work occurrence, use existing Work provenance/context to focus:

* relevant Shift Definition;
* relevant cycle;
* relevant manual regime/sequence entry;

only where current exact provenance makes that mapping truthful.

Do not invent a singular authored Work occurrence authority.

---

# 17. Global Work Pattern Entry

Direct Work Pattern access must expose the full structural inventory independent of whether any Work occurrence appears in the selected Month.

---

# 18. Shift Definition Inventory

Work Pattern must expose all current Shift Definitions.

Preserve:

* logical identity;
* incarnation;
* name;
* start/end;
* weekdays;
* crosses-midnight derivation;
* color if currently editable;
* timestamps/lifecycle semantics.

---

# 19. Shift Definition Creation

Reuse canonical existing creation behavior.

Fresh Shift Definition must receive fresh canonical identity/incarnation according to existing lifecycle semantics.

---

# 20. Shift Definition Editing

Reuse canonical writer/validation.

Do not mutate generated Work directly.

---

# 21. Shift Definition Deletion

Preserve current dependent-reference behavior mechanically.

Task 7.6 found current deletion may rewrite affected segment/sequence references to another definition or empty/null and may cause validation to block Save when no valid replacement exists.

Do not simplify this behavior without explicit architecture evidence.

---

# 22. Shift Definition Exactness

A contextual Work entry must never target a recreated Shift Definition merely because logical ID/name/time matches.

Use current exact lifecycle semantics where available.

---

# 23. Work Pattern / Cycle Inventory

Expose all current authored cycles/pattern containers.

Preserve:

* logical/incarnation identity;
* name;
* start;
* end;
* mode;
* anchor/reference date;
* timestamps;
* manual/repeating configuration.

---

# 24. Product-Language Boundary

Task 7.6 found that the code concept `ShiftCycle` contains either:

* manual dated regimes;
* repeating rotation.

The Work Pattern workspace may improve labels around these concepts while preserving internal types.

Preferred product language may include:

```text
Work Pattern

Schedule mode:
    Manual date ranges
    Repeating rotation
```

Do not rename domain types solely for UI copy.

---

# 25. Manual Mode

Preserve current manual-mode semantics exactly.

Manual mode contains explicit dated Work regimes.

---

# 26. Manual Regime UI

Where product language permits, prefer a clearer user-facing term than **Cycle Segment**.

Candidate:

**Dated work period**

or:

**Work schedule period**

or another evidence-supported term.

Do not change code identity/type solely for display wording.

---

# 27. Manual Regime Semantics

Preserve:

* inclusive start/end;
* containment within parent cycle;
* non-overlap;
* Shift Definition reference;
* notes;
* optional preference overrides;
* dormant transition metadata;
* exact nested lifecycle identity.

---

# 28. Repeating Rotation Mode

Preserve current repeating sequence semantics:

```text
anchor
    ↓
zero-based sequence
    ↓
shift / off
    ↓
modulo repetition across cycle bounds
```

Do not alter cycle math.

---

# 29. Repeating Rotation UI

Consider presenting sequence entries as a repeating **Rotation** rather than exposing implementation terminology unnecessarily.

Example:

```text
Rotation

Day 1   Day Shift
Day 2   Day Shift
Day 3   Off
Day 4   Night Shift
...
```

Use existing semantics.

---

# 30. Off Days

Preserve `null`/off sequence semantics.

Do not infer:

* free time;
* capacity;
* recovery;
* transition day.

Product copy may say **Off** or **No scheduled Work**, consistent with existing meaning.

---

# 31. Sequence Override Boundary

Task 7.6 found repeating sequence entries currently cannot own regime-specific schedule-preference overrides.

Do not add them in Task 7.7.

If the UI creates obvious demand for this, record as deferred architecture rather than silently extending the model.

---

# 32. Regime-Specific Day Boundary Override

Manual Work regimes may author day-boundary overrides.

Keep this control inside the owning Work regime editor.

Global day boundary remains Planning Settings.

---

# 33. Regime-Specific Week-Start Override

Same.

Global week start remains Planning Settings.

---

# 34. Effective Preference Boundary

Work Pattern authors overrides.

Canonical resolver remains:

```text
resolveEffectiveSchedulePreferences...
```

or actual repository equivalent.

Do not duplicate resolver logic in UI.

---

# 35. Override Presentation

Make inheritance explicit where current semantics support it.

Conceptually:

```text
Day boundary
    Use global setting

or

    Override for this work period
```

Do not invent a new inheritance model.

---

# 36. Notes

Preserve manual-segment notes if currently authored.

Do not assign scheduling semantics to them.

---

# 37. `transitionStrategyId`

Must survive extraction byte-for-byte/semantically through current authored state lifecycle.

Do not:

* expose a new control;
* interpret it;
* generate behavior from it;
* remove it.

---

# 38. Transition Context Readiness

Work Pattern should leave a clean future seam for derived transition context.

A future read model should be able to inspect adjacent Work regimes/pattern positions without scraping UI state.

This is an architecture-readiness requirement, not a feature implementation.

---

# 39. No Transition Recommendations

Do not add copy such as:

* transition plan;
* recommended Sleep;
* lighten workload;
* adjust Goals;

unless already existing independent product behavior requires it.

---

# 40. Shared SetupDraft

Work Pattern must operate against the same SetupDraft as:

* Planning Settings;
* Commitment workflows;
* legacy Plan during migration.

No Work-specific draft.

---

# 41. Global Dirty State

Pending structural Work changes participate in the existing global SetupDraft dirty state.

Example:

```text
edit Work Pattern
    ↓
Back to Month
    ↓
Pending planning changes
```

---

# 42. Cross-Workflow Draft Preservation

Mandatory:

```text
edit Work Pattern
    ↓
return Month
    ↓
edit Commitment
    ↓
open Planning Settings
```

All pending changes coexist in one SetupDraft.

No workflow silently discards another's unsaved edits.

---

# 43. Save Setup

Use the existing shared Save Setup transaction.

Do not add **Save Work Pattern** with independent durable semantics.

A contextual button may say Save Setup if exposed.

---

# 44. Save Success

Preserve:

* authored validation;
* lifecycle/incarnation handling;
* durable setup replacement;
* dirty state clearing;
* Preview staleness;
* Month context.

---

# 45. Save Failure

Display canonical validation failure.

Do not partially persist Work configuration.

---

# 46. Validation

Reuse the existing complete authored validator.

Do not create a weaker Work-only durable validator.

Local field validation may remain bounded, but final Save uses canonical whole-setup admission.

---

# 47. Cross-Entity Validation

Preserve checks including:

* cycle overlap;
* reference validity;
* segment containment;
* segment overlap;
* repeating sequence contiguity;
* Shift Definition references;
* authored temporal values;
* preference overrides.

---

# 48. Referential Integrity

Extraction must preserve all references among:

```text
ShiftDefinition
    ↑
manual regime
repeating sequence entry

ShiftCycle
    ↓
nested structural entities
```

No display-only index may become identity.

---

# 49. Lifecycle / Incarnation Integrity

Preserve current logical/incarnation behavior through:

* create;
* edit;
* delete;
* recreate;
* profile load;
* restore;
* full clear.

---

# 50. Recreated Structural Source

Mandatory exactness fixture where practical:

```text
Shift A
    ↓
contextual Month Work target

delete A

create new Shift with same logical-looking fields

activate stale contextual target
```

Do not silently focus/open the replacement as though it were A.

Use actual identity capabilities available in repository.

---

# 51. Profile Replacement

While Work Pattern is open:

* load profile;
* reproject structural state;
* clear stale selected structural targets;
* preserve safe workspace shell if appropriate.

No ghost draft references.

---

# 52. Restore Replacement

Same.

---

# 53. Full Clear

Work Pattern must reproject cleared/default state.

No ghost shifts/cycles/regimes.

---

# 54. Protection

Protected authored state must never become writable default Work structure.

Reuse canonical recovery/protection behavior.

---

# 55. Planning Settings Relationship

Work Pattern should provide contextual access to global Preferences if useful, but must not duplicate their controls.

For example:

```text
This work period uses the global day boundary.
View Planning Settings
```

optional if product clarity benefits.

---

# 56. Commitment Boundary

No Commitment inventory or advanced Commitment fields in Work Pattern.

Even though Work and Commitments share SetupDraft, their product tasks remain separate.

---

# 57. Event Boundary

No Event authoring in Work Pattern.

---

# 58. Goal Boundary

No Goal authoring in Work Pattern.

---

# 59. Review Boundary

No friction resolution / Try / Apply / Day Visualizer inside Work Pattern.

---

# 60. Month Boundary

Month continues to show generated Work spatially.

Work Pattern edits the structural source that eventually regenerates that geometry.

---

# 61. Preview Boundary

Work Pattern never directly edits Preview.

After Save:

```text
Preview → stale
```

until explicit Refresh.

---

# 62. HistoricalPlan Boundary

No mutation.

---

# 63. ExecutionHistory Boundary

No mutation or inference.

---

# 64. Preset-Readiness Audit

After the Work Pattern extraction is structurally complete, audit whether a Work Pattern can be represented as a portable **preset definition** independent of user-owned identity.

Answer mechanically:

1. What minimum fields define a reusable Work Pattern?
2. Which fields are user-specific identity/lifecycle metadata?
3. Which fields may safely be part of a preset?
4. Which references need symbolic/local mapping?
5. Can a preset instantiate one or multiple Shift Definitions?
6. Can it instantiate one Work Pattern/cycle?
7. Can it represent manual regimes?
8. Can it represent repeating rotations?
9. Can it represent off days?
10. Can it represent regime overrides?
11. Should dormant `transitionStrategyId` be carried, omitted, or explicitly unsupported?
12. Can instantiation produce a valid SetupDraft entirely through existing validation?

---

# 65. Preset Domain Principle

A future preset should describe **structure**, not user authority.

Potential conceptual shape only:

```text
WorkPatternPreset
    name
    description
    shifts[]
    pattern
        manual | repeating
    optional regime overrides
```

Do not adopt this exact schema without evidence.

---

# 66. Preset Identity Boundary

Preset definitions must not donate active authored incarnation identity.

Instantiation must create fresh user-owned identities.

Conceptually:

```text
Preset shift "Day"
       ↓ instantiate
new ShiftDefinition
new logical/incarnation identity
```

---

# 67. Preset Referential Mapping

If a preset contains several structural objects, internal references may need preset-local symbolic identifiers.

Example:

```text
preset shift key: "day"
preset rotation entry → "day"

instantiate

"day" → new ShiftDefinition ID/incarnation
rotation entry → new authored reference
```

Audit whether this is necessary.

Do not reuse arbitrary production IDs embedded in built-in presets.

---

# 68. Preset Application Semantics

Determine what future application should mean.

Candidate policies:

### A — Replace current Work Pattern

### B — Add another Work Pattern/cycle

### C — Start new draft and let user choose

### D — Only permitted when no Work structure exists

### E — Another evidence-derived policy

Do not implement until this is explicitly decided.

This is likely the most important remaining architecture question for the preset library.

---

# 69. Preset Merge Boundary

Do not invent merge semantics.

Combining a preset with existing Shift Definitions/cycles may produce identity/reference/date collisions.

If merge behavior is not already obvious from canonical state semantics, mark **Decision required** and defer full library implementation.

---

# 70. Preset Date Boundary

A reusable pattern may contain relative structure while authored Work cycles require concrete dates/anchors.

Audit what must be supplied at application time:

* start date;
* end date;
* anchor date;
* timezone/local context;
* other.

Do not hardcode user dates into generic presets without justification.

---

# 71. Example Preset Families Audit

Without committing library content, evaluate whether current model can naturally represent common structural presets such as:

```text
Standard weekday
    Mon–Fri day shift
    weekend off

Four on / four off

2-2-3 / Panama-style rotation

DuPont-style rotation

Fixed night shift

Alternating weekly shifts
```

Do not add presets merely because these names are familiar.

The point is to test model expressiveness.

If external factual pattern definitions would be required, do not fabricate them in this implementation task.

---

# 72. Preset Expressiveness Matrix

For candidate preset families, classify:

* representable today;
* representable with manual regimes;
* representable with repeating rotation;
* requires unsupported alternating behavior;
* requires sequence overrides;
* requires transition semantics;
* not representable.

This becomes input to the future preset-library task.

---

# 73. Preset Foundation Go Condition

Task 7.7 may implement a **small preset-ready foundation** only if all of the following are mechanically clear:

* preset structure can be represented without new authority;
* fresh authored identities can be instantiated deterministically;
* referential mapping is unambiguous;
* existing SetupDraft can receive instantiated structure;
* existing validation is sufficient;
* application semantics do not require unresolved replace/merge policy;
* no persistence or Backup schema is needed merely for built-in definitions;
* no runtime dependency is needed.

Possible bounded foundation:

* pure preset type;
* pure validator;
* pure instantiate-to-draft helper;
* one canonical fixture used in tests;

but **not user-facing library UI** unless explicitly justified.

---

# 74. Preset Foundation Stop Condition

Do not implement preset code if any of these remain unresolved:

* replace vs merge;
* date/anchor application;
* identity mapping;
* multiple cycle handling;
* duplicate Shift Definition strategy;
* preservation of existing Work data;
* preset persistence/lifecycle;
* sequence override requirement;
* transition-policy semantics.

In that case produce the exact architecture contract needed for Task 7.8 or later.

---

# 75. No Preset Persistence

Built-in preset definitions, if foundationally represented, should not require new user persistence.

Do not add preset storage.

---

# 76. No User-Saved Presets

Deferred.

---

# 77. No Preset Marketplace

Deferred.

---

# 78. No Pattern Library Conflation

**Work Pattern preset library** and future **Pattern Library** are different concepts.

Document terminology carefully.

Potential distinction:

```text
Work Pattern presets
    reusable structural Work schedules

Pattern Library
    reusable scheduling-intent patterns
```

Do not collapse them.

---

# 79. Workspace Layout — Desktop

Provide a coherent global structural editing layout.

Potential:

```text
Work Pattern

Shift Definitions
    [inventory/editor]

Work Schedule
    [cycle / regime / rotation editor]

Pending planning changes
Save Setup
```

Use actual reusable components.

---

# 80. Workspace Layout — Mobile

At:

* 320;
* 375;
* 390;
* 430 px;

Work Pattern must remain usable.

Prefer stacked inventory/editor sections.

No horizontal page scrolling.

---

# 81. Structural Inventory Navigation

Users must be able to discover:

* all shifts;
* all Work patterns/cycles;
* manual/repeating mode;
* structural relationships.

Do not require a Month occurrence to reach an existing Shift Definition.

---

# 82. Focus — Open Work Pattern

Focus workspace heading or first logical structural control.

---

# 83. Focus — Contextual Work Entry

If exact structural context is available, focus the corresponding source/section.

Otherwise focus Work Pattern heading and clearly preserve context.

---

# 84. Focus — Add Shift

Focus first Shift Definition field.

---

# 85. Focus — Add Pattern/Cycle

Focus first logical field.

---

# 86. Focus — Validation

Existing validation-focus semantics remain.

---

# 87. Focus — Save

After successful Save:

focus saved/stale status.

---

# 88. Focus — Back to Month

Restore Month context and deterministic focus.

---

# 89. Accessibility

All structural controls require:

* meaningful headings;
* named buttons;
* field labels;
* error associations;
* inheritance labels for overrides;
* clear Off-day semantics;
* pending/saved status.

Do not rely on visual nesting alone to communicate parent/child relationships.

---

# 90. Keyboard

Complete Work Pattern management must be possible without pointer input.

---

# 91. Context Preservation

Month → Work Pattern → Month preserves:

* displayed month;
* selected user-day;
* pending SetupDraft.

---

# 92. Legacy Plan Reuse

During Task 7.7 migration, legacy Plan may still render Work controls.

If so, it must consume the same extracted canonical Work Pattern implementation rather than retain duplicate forms.

---

# 93. Legacy Plan Reduction

Remove/reduce Work-specific Plan composition only after direct Work Pattern entry is verified.

Plan remains because Commitment Library has not yet been extracted.

---

# 94. Plan Responsibility After 7.7

At completion, Plan should ideally retain unique responsibility primarily for:

```text
Commitment inventory
advanced Commitment configuration
```

plus any mechanically identified residue.

Document exact remainder.

---

# 95. No Plan Retirement

Mandatory.

Commitment Library does not exist yet.

---

# 96. No Month Default Change

Mandatory.

Plan still owns unique capability after Work Pattern extraction.

---

# 97. Lazy Ownership

Strong preference:

* Work Pattern remains lazy;
* reuse/split existing SetupScreen lazy ownership;
* do not make advanced Work configuration eager;
* avoid rendering full SetupScreen invisibly.

---

# 98. Extraction Architecture

Prefer bounded components such as:

```text
WorkPatternSection / WorkPatternWorkspace
ShiftDefinitionSection
WorkScheduleSection
```

or actual evidence-derived decomposition.

Do not create generic abstraction merely for symmetry.

---

# 99. Existing Plan Chunk

Audit whether extracting Work Pattern:

* shrinks Plan chunk;
* creates new Work Pattern chunk;
* shares common setup helpers;
* duplicates code across lazy chunks.

Optimize architectural ownership first.

Measure actual bundle output.

---

# 100. Bundle Governance

Task 7.2C policy remains governing.

Baseline:

```text
Initial raw        634,896
Initial gzip       161,779
Largest lazy        52,326
Total JS           759,310
```

---

# 101. Initial Raw

Warning:

```text
>= 650,000
```

Hard:

```text
> 685,000
```

---

# 102. Initial Gzip

Already warning.

Hard:

```text
> 170,000
```

Any eager growth must be attributed.

---

# 103. Largest Lazy

Warning:

```text
>= 80,000
```

Hard:

```text
> 100,000
```

If Work Pattern extraction creates a new largest lazy chunk, review ownership rather than splitting cosmetically.

---

# 104. Total JS

At:

```text
>= 800,000
```

perform governed growth review.

At:

```text
>= 825,000
```

stop for architecture review/ADR.

---

# 105. No Runtime Dependency

Mandatory.

---

# 106. No Bundle Policy Change

Mandatory.

---

# 107. Tests — Work Pattern Entry

Cover:

* direct entry;
* contextual Month Work entry;
* return;
* context preservation;
* lazy load.

---

# 108. Tests — Shift Definitions

Cover:

* list;
* create;
* edit;
* delete;
* validation;
* dependent references;
* exact identity/incarnation.

---

# 109. Tests — Manual Work Pattern

Cover:

* cycle create/edit;
* manual mode;
* dated regimes;
* range containment;
* non-overlap;
* Shift Definition reference;
* notes;
* override;
* deletion.

---

# 110. Tests — Repeating Rotation

Cover:

* anchor;
* sequence;
* contiguous indexes;
* Shift Definition entries;
* Off entries;
* wrap/generation semantics unchanged.

---

# 111. Tests — Overrides

Cover:

* inherit global boundary;
* override boundary;
* inherit global week start;
* override week start;
* Save/staleness;
* resolver behavior unchanged.

---

# 112. Tests — Sequence Override Absence

Verify Task 7.7 does not accidentally allow unsupported sequence-level preference overrides.

---

# 113. Tests — Dormant Metadata

Where feasible, prove `transitionStrategyId` survives extraction/save/clone paths unchanged.

Do not add behavior assertions.

---

# 114. Tests — Shared Draft

Cover Work Pattern edit → Month → Commitment/Settings → same pending SetupDraft.

---

# 115. Tests — Save

Cover:

* pending;
* successful Save;
* stale Preview;
* no auto-refresh;
* validation failure;
* no partial durable Work save.

---

# 116. Tests — Profile Replacement

Open/select structural source → profile load → stale selection gone/current structure shown.

---

# 117. Tests — Restore

Same.

---

# 118. Tests — Full Clear

Same.

---

# 119. Tests — Protection

No writable defaults.

---

# 120. Tests — Contextual Exactness

Where Work provenance supports exact source mapping:

* same current source opens;
* deleted source unavailable/fallback;
* recreated source does not silently retarget.

---

# 121. Tests — Month Regression

Existing Month Work presentation remains.

---

# 122. Tests — Commitment Regression

No Commitment semantics change.

---

# 123. Tests — Planning Settings Regression

Global preferences remain there.

---

# 124. Tests — Review Regression

No changes to resolution.

---

# 125. Tests — User-Day Regression

Run canonical variable-boundary cases because Work Pattern owns regime-specific boundary inputs.

Include:

* fixed boundary;
* boundary increase;
* boundary decrease;
* cycle wrap;
* manual regime transition;
* DST fixtures where existing suites support them.

---

# 126. Tests — Preset Readiness

If no preset foundation is implemented:

no new production tests are required, but result must include evidence matrices.

If bounded foundation is implemented:

cover:

* validation;
* fresh identity generation;
* internal reference remap;
* instantiation determinism;
* clone isolation;
* existing Work protection;
* unresolved policies remain rejected.

---

# 127. Browser QA — Direct Work Pattern

Production build:

```text
Month
    Work Pattern
```

Verify full structural inventory access.

---

# 128. Browser QA — Contextual Work Entry

Select generated Work occurrence.

Open Work configuration.

Verify direct/focused Work Pattern path.

---

# 129. Browser QA — Shift Definition

Controlled fixture:

* add;
* edit;
* validation;
* delete/replacement where safely constructible.

---

# 130. Browser QA — Manual Regime

Controlled fixture:

* create/edit manual regime;
* assign shift;
* set/clear override;
* Save;
* stale Month;
* Refresh;
* verify resulting Work projection.

---

# 131. Browser QA — Repeating Rotation

Controlled fixture:

* configure repeating sequence;
* include Off entry;
* save;
* refresh;
* verify generated Work.

---

# 132. Browser QA — Global/Override Distinction

Verify:

```text
Planning Settings global boundary
        +
Work Pattern regime override
```

remain distinguishable and produce canonical behavior.

---

# 133. Browser QA — Cross-Workflow Draft

Edit Work Pattern without Save.

Navigate Month / another setup workflow.

Return.

Pending Work change remains.

---

# 134. Browser QA — Save/Refresh

Mandatory:

```text
edit Work Pattern
    ↓
Save Setup
    ↓
Month stale
    ↓
Refresh Schedule
    ↓
updated Work
```

---

# 135. Browser QA — Keyboard

Complete core structural workflow without mouse.

---

# 136. Browser QA — Mobile

Validate:

```text
320
375
390
430
```

No horizontal page overflow.

---

# 137. Browser QA — Slow Load

Throttle Work Pattern lazy boundary.

Verify:

* Month remains truthful;
* loading state visible;
* contextual target revalidated;
* focus correct.

---

# 138. Required Preset-Readiness Matrix

| Preset concern                | Current Work model sufficient? | Decision               |
| ----------------------------- | -----------------------------: | ---------------------- |
| multiple Shift Definitions    |                                |                        |
| manual dated regimes          |                                |                        |
| repeating rotation            |                                |                        |
| Off days                      |                                |                        |
| regime boundary override      |                                |                        |
| regime week-start override    |                                |                        |
| sequence-level overrides      |                    No expected | unsupported/defer      |
| relative start/anchor date    |                                |                        |
| fresh authored identity       |                                |                        |
| internal reference remap      |                                |                        |
| existing Work replacement     |                                |                        |
| existing Work merge           |                                |                        |
| validation through SetupDraft |                                |                        |
| transitionStrategyId          |                        dormant | preserve/omit decision |
| user-saved presets            |                             No | defer                  |

---

# 139. Required Preset Expressiveness Matrix

| Candidate pattern family        | Representable with current model? | Mechanism | Missing semantics      |
| ------------------------------- | --------------------------------: | --------- | ---------------------- |
| fixed weekday Work              |                                   |           |                        |
| fixed night Work                |                                   |           |                        |
| repeating Work/off rotation     |                                   |           |                        |
| alternating shift rotation      |                                   |           |                        |
| bounded manual regime changes   |                                   |           |                        |
| mixed regime boundary overrides |                                   |           |                        |
| transition-adaptation plan      |                                No | N/A       | future advisory policy |

Use generic structural examples unless repository/user-provided definitions establish exact named industry patterns.

Do not fabricate schedule formulas.

---

# 140. Required Preset Application Matrix

| Policy candidate     | Existing Work present | Identity safety | User control | Recommendation |
| -------------------- | --------------------- | --------------- | ------------ | -------------- |
| replace              |                       |                 |              |                |
| add                  |                       |                 |              |                |
| empty-only           |                       |                 |              |                |
| preview-before-apply |                       |                 |              |                |
| other                |                       |                 |              |                |

No implementation without a clear decision.

---

# 141. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.7_WORK_PATTERN_WORKSPACE_EXTRACTION_ADVANCED_WORK_CONFIGURATION_MIGRATION_AND_PRESET_READY_ARCHITECTURE_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 7.6 Prerequisite
4. Initial Composition Audit
5. Files Changed
6. Work Pattern Workspace
7. Direct Entry
8. Month Contextual Entry
9. Contextual Target Resolution
10. Shift Definition Inventory
11. Shift Definition Create
12. Shift Definition Edit
13. Shift Definition Delete
14. Shift Definition Exactness
15. Work Pattern Inventory
16. Product Language
17. Manual Mode
18. Manual Regime UI
19. Manual Regime Semantics
20. Repeating Rotation
21. Rotation UI
22. Off Days
23. Sequence Override Boundary
24. Regime Boundary Override
25. Regime Week-Start Override
26. Effective Preference Boundary
27. Override Presentation
28. Notes
29. `transitionStrategyId`
30. Transition Readiness
31. Shared SetupDraft
32. Global Dirty State
33. Cross-Workflow Draft
34. Save Setup
35. Save Success
36. Save Failure
37. Validation
38. Referential Integrity
39. Lifecycle/Incarnation Integrity
40. Recreated Source
41. Profile Replacement
42. Restore
43. Full Clear
44. Protection
45. Planning Settings Relationship
46. Commitment Boundary
47. Event Boundary
48. Goal Boundary
49. Review Boundary
50. Month Boundary
51. Preview Boundary
52. HistoricalPlan Boundary
53. ExecutionHistory Boundary
54. Preset-Readiness Audit
55. Minimum Preset Structure
56. Preset Identity Boundary
57. Preset Referential Mapping
58. Preset Application Semantics
59. Preset Merge Assessment
60. Preset Date/Anchor Assessment
61. Preset Expressiveness
62. Preset Foundation Decision
63. Preset Foundation Implementation if authorized
64. Preset Persistence Boundary
65. User-Saved Preset Boundary
66. Pattern Library Distinction
67. Desktop Layout
68. Mobile Layout
69. Structural Navigation
70. Accessibility
71. Focus
72. Keyboard
73. Context Preservation
74. Legacy Plan Reuse
75. Legacy Plan Reduction
76. Remaining Plan Responsibilities
77. Plan Retirement Boundary
78. Month Default Boundary
79. Lazy Ownership
80. Extraction Architecture
81. Bundle Ownership
82. Initial-Raw Review
83. Initial-Gzip Review
84. Largest-Lazy Review
85. Total-JS Review
86. Runtime Dependency Assessment
87. Tests Added/Changed
88. Focused Validation
89. Full Validation
90. Bundle Validation
91. Browser Direct-Entry QA
92. Browser Contextual-Entry QA
93. Browser Shift QA
94. Browser Manual-Regime QA
95. Browser Rotation QA
96. Browser Override QA
97. Browser Cross-Draft QA
98. Browser Save/Refresh QA
99. Browser Keyboard QA
100. Browser Mobile QA
101. Slow-Load QA
102. Governance Updates
103. ADR Determination
104. Deviations
105. Discoveries
106. Deferred Work
107. Work Pattern Capability Matrix
108. Identity Matrix
109. Override Matrix
110. Draft/Save Matrix
111. Contextual Navigation Matrix
112. Lifecycle Matrix
113. Preset-Readiness Matrix
114. Preset Expressiveness Matrix
115. Preset Application Matrix
116. Loading Matrix
117. Responsive Matrix
118. Focus Matrix
119. Bundle Matrix
120. Migration Matrix
121. Legacy Plan Matrix
122. Authority Matrix
123. Product-Boundary Matrix
124. Epistemic Matrix
125. Architectural Invariant Assessment
126. Stop-Condition Assessment
127. Architectural Alignment Assessment
128. Preset-Library Readiness
129. Commitment-Library Readiness
130. Task 7.8 Readiness
131. Recommended Next Task
132. Final Completion Determination

---

# 142. Required Work Pattern Capability Matrix

| Capability                 | Legacy Plan | Work Pattern |       Month contextual | Canonical writer |
| -------------------------- | ----------: | -----------: | ---------------------: | ---------------- |
| Shift inventory            |         Yes |              |          entry/context |                  |
| Shift create/edit/delete   |         Yes |              | contextual where exact |                  |
| manual Work regimes        |         Yes |              |                  entry |                  |
| repeating rotation         |         Yes |              |                  entry |                  |
| Off days                   |         Yes |              |                derived |                  |
| regime boundary override   |         Yes |              |             contextual |                  |
| regime week-start override |         Yes |              |             contextual |                  |
| Save Setup                 |         Yes |       shared |                 shared |                  |
| transition metadata        |   preserved |     preserve |                     No |                  |

---

# 143. Required Identity Matrix

| Entity                     |       Logical identity |           Incarnation | Contextual stale-target behavior |
| -------------------------- | ---------------------: | --------------------: | -------------------------------- |
| Shift Definition           |                        |                       |                                  |
| Shift Cycle                |                        |                       |                                  |
| manual regime              |                        |                       |                                  |
| sequence entry             |                        |                       |                                  |
| generated Work occurrence  |      derived reference |    derived provenance |                                  |
| preset definition          | not authored authority | no active incarnation | N/A                              |
| preset-instantiated source |                  fresh |                 fresh | canonical                        |

---

# 144. Required Override Matrix

| Scope                    |           Boundary |         Week start | Owner                       | UI home             |
| ------------------------ | -----------------: | -----------------: | --------------------------- | ------------------- |
| global                   |                Yes |                Yes | authored global preferences | Planning Settings   |
| manual Work regime       |                Yes |                Yes | owning regime               | Work Pattern        |
| repeating sequence entry | No current support | No current support | N/A                         | prohibited/deferred |

---

# 145. Required Draft / Save Matrix

| Action                                 | SetupDraft   | Durable setup | Preview     |
| -------------------------------------- | ------------ | ------------- | ----------- |
| edit Shift                             | changed      | unchanged     | unchanged   |
| edit Work rotation                     | changed      | unchanged     | unchanged   |
| edit regime override                   | changed      | unchanged     | unchanged   |
| navigate Month                         | preserved    | unchanged     | unchanged   |
| Save Setup                             | synchronized | changed       | stale       |
| Refresh                                | unchanged    | unchanged     | regenerated |
| preset instantiate, if foundation only | draft only   | unchanged     | unchanged   |

---

# 146. Required Contextual Navigation Matrix

| Entry                                      | Exact context available? | Work Pattern focus              | Retarget allowed? |
| ------------------------------------------ | -----------------------: | ------------------------------- | ----------------: |
| direct Planner action                      |                       No | workspace root                  |               N/A |
| generated Work occurrence                  |                          | relevant source/regime if exact |                No |
| stale Work occurrence, exact source exists |                          | current exact source            |    Yes exact only |
| stale Work occurrence, recreated source    |                          | unavailable/root                |                No |
| profile/restore replacement                |     stale target invalid | current root                    |                No |

---

# 147. Required Lifecycle Matrix

| Event        | Open Work Pattern behavior  | Pending draft            | Selection               |
| ------------ | --------------------------- | ------------------------ | ----------------------- |
| profile load | reproject                   | replaced canonical draft | clear stale             |
| restore      | reproject                   | replaced                 | clear stale             |
| full clear   | cleared/default             | cleared                  | clear                   |
| protection   | non-writable truthful state | protected                | clear unsafe            |
| Save         | current                     | clear dirty              | preserve if still exact |

---

# 148. Required Loading Matrix

| Capability            | Lazy boundary | Month stays visible? | Revalidation after load? |
| --------------------- | ------------- | -------------------: | -----------------------: |
| Work Pattern direct   |               |                      |                          |
| contextual Work edit  |               |                      |          Yes where exact |
| legacy Plan           | existing      |                  N/A |                          |
| future preset library | deferred      |                  N/A |                      N/A |

---

# 149. Required Responsive Matrix

| Width   | Structural inventory | Editor | Rotation/regime UI | Save/status |
| ------- | -------------------- | ------ | ------------------ | ----------- |
| 320     |                      |        |                    |             |
| 375     |                      |        |                    |             |
| 390     |                      |        |                    |             |
| 430     |                      |        |                    |             |
| tablet  |                      |        |                    |             |
| desktop |                      |        |                    |             |

---

# 150. Required Focus Matrix

| Action                  | Required focus |
| ----------------------- | -------------- |
| open Work Pattern       |                |
| contextual Work entry   |                |
| add Shift               |                |
| edit Shift              |                |
| add manual regime       |                |
| add rotation entry      |                |
| validation failure      |                |
| Save                    |                |
| Back to Month           |                |
| stale contextual target |                |

---

# 151. Required Bundle Matrix

| Metric       | 7.6 baseline | 7.7 final | Warning | Hard/review |
| ------------ | -----------: | --------: | ------: | ----------: |
| Initial raw  |      634,896 |           | 650,000 |     685,000 |
| Initial gzip |      161,779 |           | 161,500 |     170,000 |
| Largest lazy |       52,326 |           |  80,000 |     100,000 |
| Total JS     |      759,310 |           |       — | 800k / 825k |

List:

* Month chunk;
* Work Pattern chunk;
* remaining Plan chunk;
* shared setup chunks.

---

# 152. Required Migration Matrix

| Responsibility              | Before 7.7   | After 7.7    | Legacy Plan unique? |
| --------------------------- | ------------ | ------------ | ------------------: |
| Shift Definitions           | Plan         | Work Pattern |         No expected |
| cycles/manual regimes       | Plan         | Work Pattern |         No expected |
| repeating rotation/off days | Plan         | Work Pattern |         No expected |
| regime overrides            | Plan         | Work Pattern |         No expected |
| Commitment inventory        | Plan         | Plan         |                 Yes |
| advanced Commitment fields  | Plan         | Plan         |                 Yes |
| Planning Settings           | Month/shared | unchanged    |                  No |
| Save Setup                  | shared       | shared       |                  No |

---

# 153. Required Legacy Plan Matrix

| Legacy Plan responsibility    | Replacement after 7.7 | Still unique? |
| ----------------------------- | --------------------- | ------------: |
| Work structural configuration | Work Pattern          |               |
| global Preferences            | Planning Settings     |            No |
| Planning Range                | Planning Settings     |            No |
| Goals                         | Planning Settings     |            No |
| contextual Commitment editing | Month                 |            No |
| full Commitment inventory     | none yet              |           Yes |
| advanced Commitment fields    | none yet              |           Yes |
| Save Setup                    | shared                |            No |

---

# 154. Required Authority Matrix

| Authority              | Work Pattern reads | Work Pattern writes via canonical path | New authority? |
| ---------------------- | -----------------: | -------------------------------------: | -------------: |
| SetupDraft             |                Yes |                                    Yes |             No |
| durable authored setup |            current |                        Save Setup only |             No |
| Goal                   |       context only |                                     No |             No |
| Event                  |                 No |                                     No |             No |
| Preview                |    derived/context |                         Never directly |             No |
| HistoricalPlan         |                 No |                                     No |             No |
| ExecutionHistory       |                 No |                                     No |             No |

---

# 155. Required Product-Boundary Matrix

| Capability                           | Task 7.7                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------- |
| Work Pattern workspace               | Implement                                                                              |
| Shift Definition inventory/CRUD      | Implement through existing writer                                                      |
| manual Work regimes                  | Implement through existing writer                                                      |
| repeating rotation/off days          | Implement through existing writer                                                      |
| regime-specific overrides            | Implement through existing writer                                                      |
| Month contextual Work → Work Pattern | Implement                                                                              |
| shared SetupDraft/Save               | Preserve/reuse                                                                         |
| preset-readiness audit               | Required                                                                               |
| preset foundation                    | Conditional                                                                            |
| full preset library UI               | Deferred unless all go conditions exceptionally prove trivial and task remains bounded |
| user-saved presets                   | Prohibited                                                                             |
| Commitment Library                   | Deferred                                                                               |
| Plan retirement                      | Prohibited                                                                             |
| Month default                        | Prohibited                                                                             |
| transition recommendations           | Prohibited                                                                             |
| Pattern Library                      | Prohibited                                                                             |

---

# 156. Required Epistemic Matrix

| Evidence/state              | DayFrame may represent              | Must not infer                  |
| --------------------------- | ----------------------------------- | ------------------------------- |
| Shift Definition            | authored Work rule                  | actual Work performed           |
| Work Pattern                | authored structural Work schedule   | generated dated Work            |
| manual regime               | authored dated structural regime    | transition difficulty           |
| repeating Off entry         | no Work assignment                  | free capacity                   |
| boundary override           | regime-specific temporal preference | need for adaptation             |
| saved Work change           | schedule stale                      | regenerated schedule            |
| generated Work occurrence   | current Preview evidence            | independent authored occurrence |
| preset                      | reusable structural starting point  | authority / user-owned Work     |
| preset name                 | preset category/description         | user's actual work arrangement  |
| dormant transition metadata | preserved metadata                  | executable strategy             |

---

# 157. Architectural Invariants

Assess at minimum:

1. Work Pattern is supporting, not primary Planner.
2. Month remains primary routine Planner.
3. Planning Settings remains global configuration.
4. Review remains specialized.
5. Work remains structurally distinct from Commitment.
6. Work Pattern owns authored structure only.
7. generated Work remains derived.
8. HistoricalPlan Work remains historical evidence.
9. no generated Work geometry becomes editable.
10. one SetupDraft remains.
11. one Save Setup transaction remains.
12. no Work-specific durable transaction is introduced.
13. legacy Plan and Work Pattern share writers during migration.
14. no duplicate Shift writer exists.
15. no duplicate cycle writer exists.
16. no duplicate regime writer exists.
17. no duplicate override writer exists.
18. Shift Definition identity remains canonical.
19. cycle identity remains canonical.
20. nested structural identities remain canonical.
21. recreated sources never silently retarget stale contextual evidence.
22. Shift Definition validation remains unchanged.
23. cycle validation remains unchanged.
24. manual regime containment remains unchanged.
25. manual regime non-overlap remains unchanged.
26. repeating sequence contiguity remains unchanged.
27. repeating modulo semantics remain unchanged.
28. Off/null semantics remain unchanged.
29. Off does not imply capacity.
30. global boundary remains Planning Settings.
31. global week start remains Planning Settings.
32. manual-regime boundary override belongs to Work Pattern.
33. manual-regime week-start override belongs to Work Pattern.
34. sequence-level overrides are not introduced.
35. canonical effective preference resolver remains semantic owner.
36. canonical piecewise user-day remains unchanged.
37. user-week semantics remain unchanged.
38. DST semantics remain unchanged.
39. cycle-wrap semantics remain unchanged.
40. `transitionStrategyId` remains dormant.
41. dormant metadata is preserved.
42. no transition strategy UI is introduced.
43. no transition behavior is introduced.
44. no Sleep recommendation is introduced.
45. no Goal reorientation is introduced.
46. future transition context remains derived.
47. Work Pattern may expose structural facts only.
48. Notes receive no scheduling semantics.
49. Commitment inventory remains outside Work Pattern.
50. Events remain outside Work Pattern.
51. Goals remain outside Work Pattern.
52. friction resolution remains outside Work Pattern.
53. Preview remains non-authoritative.
54. Save makes Preview stale where existing semantics say so.
55. Save never auto-refreshes.
56. Refresh remains separate.
57. cross-workflow pending draft survives.
58. Work Pattern navigation never silently discards another workflow's edits.
59. profile load replaces/reprojects draft correctly.
60. restore replaces/reprojects correctly.
61. full clear removes stale structural selection.
62. protection never renders writable fabricated defaults.
63. Month context survives Work Pattern navigation.
64. direct Work Pattern entry provides full structural discovery.
65. user does not need Month occurrence to discover Shift Definitions.
66. contextual Work entry uses exact provenance where available.
67. inability to resolve exact structural context does not permit heuristic retargeting.
68. product UI may improve Segment/Cycle wording without changing domain identity.
69. manual and repeating modes remain distinct.
70. Work Pattern does not become Schedule Structure.
71. Work Pattern does not become Pattern Library.
72. Work Pattern preset and Pattern Library remain semantically distinct.
73. preset is not authority.
74. preset instantiation, if implemented, produces fresh authored identity.
75. preset never donates active incarnation.
76. preset references are remapped safely.
77. preset application uses SetupDraft.
78. preset application does not bypass validation.
79. preset application does not bypass Save Setup.
80. preset does not mutate Preview.
81. preset merge semantics are not invented.
82. preset replace semantics are not invented.
83. unresolved preset application policy blocks user-facing library.
84. generic preset dates are not silently hardcoded.
85. preset anchor/date requirements are explicit.
86. built-in preset foundation requires no new persistence.
87. user-saved presets remain deferred.
88. no preset marketplace is introduced.
89. preset library does not contain fabricated industry schedule definitions.
90. preset expressiveness is mechanically assessed.
91. Commitment Library remains next independent migration.
92. Plan remains until Commitment Library extraction.
93. Plan is not renamed to Work Pattern wholesale.
94. Plan retirement remains prohibited.
95. Month-default change remains prohibited.
96. Work Pattern remains lazy.
97. advanced Work code is not moved eager without justification.
98. Month remains lazy.
99. Review remains unchanged.
100. Today remains unchanged.
101. Summary remains unchanged.
102. no persistence schema changes are introduced without stop/review.
103. no Backup version change is introduced without stop/review.
104. no runtime dependency is added.
105. no bundle-policy change occurs.
106. initial raw hard guard remains green.
107. initial gzip hard guard remains green.
108. largest-lazy hard guard remains green.
109. total remains reported.
110. > =800k triggers growth review.
111. > =825k triggers architecture review.
112. warning-zone growth is attributed.
113. accessibility remains intact.
114. structural relationships are understandable without color alone.
115. keyboard operation is complete.
116. focus behavior is deterministic.
117. mobile behavior works at 320–430 px.
118. no horizontal page scrolling is required.
119. lazy loading is truthful.
120. stale target is revalidated after lazy load.
121. full validation passes.
122. browser structural CRUD QA passes.
123. browser manual-mode QA passes.
124. browser repeating-rotation QA passes.
125. browser override QA passes.
126. browser Save/Refresh QA passes.
127. browser keyboard QA passes.
128. browser mobile QA passes.
129. legacy Plan Work responsibility is reduced only after replacement passes.
130. remaining Plan unique responsibility is explicitly documented.
131. preset-library readiness is explicitly classified.
132. next task follows evidence rather than assumption.

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

# 158. Stop Conditions

Stop the affected slice rather than inventing semantics if:

* Work controls cannot be extracted without a second writer;
* Shift/cycle/regime identity cannot remain exact;
* contextual Work provenance cannot safely resolve authored source;
* manual and repeating modes rely on hidden Plan-wide assumptions that cannot be bounded;
* regime overrides cannot remain attached to their owning manual regime;
* SetupDraft cannot remain shared;
* Save Setup would need Work-specific transaction semantics;
* extraction requires new Work authority;
* extraction requires persistence/schema changes not already justified;
* profile/restore/full-clear cannot safely reproject the workspace;
* protected state would need writable fallback;
* mobile/keyboard structure becomes materially unusable;
* hard bundle guard fails without safe bounded remediation;
* total reaches 825,000;
* runtime dependency is required.

For preset foundation specifically, stop if:

* preset → authored identity mapping is ambiguous;
* internal references cannot be safely remapped;
* application requires undefined replace/merge behavior;
* date/anchor semantics are unresolved;
* existing Work cannot be protected from accidental overwrite;
* generic preset representation requires new transition semantics;
* preset validation would require a parallel structural validator.

A preset blocker does **not** block completion of the Work Pattern extraction.

---

# 159. Focused Validation

Run focused suites for:

* SetupScreen Work sections;
* Shift Definition;
* Shift Cycle;
* manual segment;
* repeating sequence;
* effective Preferences;
* canonical user-day;
* Work generation;
* SetupDraft;
* Save Setup;
* Month contextual Work;
* profile;
* restore;
* full clear;
* protection;
* lazy loading;
* preset foundation if implemented.

Record exact files/test counts.

---

# 160. Full Validation

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
* Work Pattern chunk;
* remaining Plan chunk;
* shared chunks;
* largest lazy;
* total JS;
* warning state;
* total review state;
* diff result.

---

# 161. Manual Browser Validation

Use production build.

Validate all implemented Work Pattern workflows.

Browser validation of preset library is required only if a user-facing preset capability is actually implemented, which is **not the default expectation for Task 7.7**.

---

# 162. Governance

Update:

* Task 7.7 result;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Record:

* Work Pattern as implemented supporting workflow;
* structural responsibilities removed from legacy Plan;
* remaining Plan responsibilities;
* exact preset-readiness determination;
* whether preset foundation was implemented or deferred;
* Commitment Library readiness;
* Plan retirement status.

No ADR is expected if this remains surface extraction over existing authority.

If preset work reveals a durable new domain contract such as canonical preset-instantiation semantics, explicitly assess whether that decision warrants an ADR before implementing it.

---

# 163. Preset-Library Readiness Classification

At task end, classify one:

### A — Ready for User-Facing Preset Library

All structural, identity, date, application, and replacement semantics are precise.

Recommend next bounded preset-library implementation.

### B — Preset Foundation Ready; Application Policy Missing

Pure preset representation/instantiation is clear, but replace/add/merge UX requires a separate decision.

Recommend a preset-application audit/task.

### C — Work Pattern Ready; Preset Contract Still Needs Architecture

Work Pattern extraction succeeded, but one or more preset semantics remain unresolved.

Name the exact missing decisions.

### D — Current Work Model Cannot Support Useful Presets Without Domain Expansion

Identify what model capability is missing.

Do not force presets.

---

# 164. Commitment-Library Readiness

Independently assess whether Work removal from Plan has left a clean bounded Commitment-only responsibility.

Expected if green:

```text
Legacy Plan
    ≈ Commitment inventory
      + advanced Commitment configuration
      + shared shell residue
```

If true, authorize Commitment Library extraction next unless preset work should logically precede it.

---

# 165. Task 7.8 Readiness

Possible outcomes:

### Outcome A — Preset Library Is Immediately Ready and High-Leverage

Recommend:

> **Task 7.8 — Work Pattern Preset Library V1**

before Commitment Library if doing so does not delay Plan convergence materially and the architecture is complete.

### Outcome B — Commitment Library Is the Remaining Convergence Dependency

Recommend:

> **Task 7.8 — Commitment Library Extraction and Advanced Scheduling-Intent Migration**

Then implement preset library after Plan retirement/convergence.

### Outcome C — Preset Architecture Needs One Narrow Decision

Recommend the precise preset audit.

### Outcome D — Work Pattern Extraction Exposes Another Structural Blocker

Name it precisely.

Do not predetermine ordering.

---

# 166. Completion Criteria

Task 7.7 is complete only when:

* the existing Work configuration is mechanically decomposed from legacy Plan;
* a coherent Work Pattern supporting workspace exists;
* users can directly access complete Work structure without entering broad legacy Plan;
* Month contextual Work entry routes to Work Pattern where truthfully possible;
* Shift Definition inventory and CRUD reuse canonical writers;
* Shift Definition exact identities/incarnations remain intact;
* Shift deletion preserves current dependent-reference behavior;
* all authored Work cycles/patterns are discoverable;
* manual and repeating modes remain semantically distinct;
* manual dated regimes preserve inclusive bounds, non-overlap, containment, Shift references, notes, overrides, and lifecycle identity;
* repeating rotations preserve anchor, contiguous sequence, modulo repetition, Shift references, and Off entries;
* Off remains absence of Work assignment rather than free capacity;
* sequence-level schedule-preference overrides remain unsupported rather than silently added;
* global day-boundary/week-start remain in Planning Settings;
* manual-regime overrides remain with their Work context;
* canonical effective-preference and piecewise user-day resolvers remain semantic owners;
* dormant `transitionStrategyId` is preserved without UI or behavior;
* Work Pattern exposes structural facts but does not become transition recommendation authority;
* one global SetupDraft remains shared across Work Pattern, Planning Settings, Commitment workflows, and legacy Plan;
* pending edits survive cross-workflow navigation;
* one Save Setup transaction remains;
* Save continues to stale Preview without auto-refresh;
* all structural validation and referential-integrity constraints remain canonical;
* profile replacement, restore, full clear, and protection cannot leave stale or fabricated Work state;
* exact contextual Work targets never silently retarget recreated structural sources;
* Work Pattern remains separate from Commitments, Events, Goals, Review, Today, Summary, and Pattern Library;
* legacy Plan consumes shared/extracted Work implementation or loses that responsibility without duplicate forms;
* legacy Plan is not retired because Commitment Library remains outstanding;
* Month is not made default prematurely;
* Work Pattern remains appropriately lazy;
* no runtime dependency, persistence schema, Backup format, scheduler change, bundle-policy change, Capacity, Allocation, Recommendations, Pattern Library, transition adaptation, or Goal reorientation is introduced;
* preset-readiness is mechanically audited after extraction;
* the minimum reusable Work Pattern representation is identified where possible;
* preset-owned definition data is distinguished from user-owned identity/lifecycle data;
* any preset instantiation is proven to create fresh authored identity;
* internal preset references are mapped safely;
* preset date/anchor requirements are explicit;
* replace/add/merge behavior is explicitly resolved or marked as the exact blocker;
* existing Work is never silently overwritten;
* built-in preset foundation is implemented only if all required semantics are unambiguous and it remains bounded;
* no user-facing preset library is forced through unresolved application semantics;
* Work Pattern presets remain distinct from the future contextual Pattern Library;
* representative Work-pattern expressiveness is assessed without fabricating industry schedule definitions;
* focused and full validation pass;
* production-browser Work Pattern, contextual entry, structural CRUD, manual-regime, repeating-rotation, override, Save/Refresh, keyboard, mobile, and lazy-loading QA pass;
* all hard bundle guards remain green and warning/review growth is governed;
* governance records the new Work Pattern boundary and remaining Plan responsibility;
* preset-library readiness receives an explicit A/B/C/D classification;
* Commitment-Library readiness is independently assessed;
* the Task 7.8 recommendation follows the architectural evidence rather than a predetermined sequence.

---

# 167. Final Implementation Principle

> **A Work Pattern is the user's structural model of Work. A preset is only a reusable way to create one.**

That distinction is foundational.

A user should eventually be able to say:

```text
My workplace uses this kind of rotation.
```

choose an appropriate starting pattern,

then make it **their** Work Pattern:

```text
Preset
    ↓
fresh authored Work structure
    ↓
user dates / shifts / overrides
    ↓
Save Setup
    ↓
DayFrame schedules from authored truth
```

The preset helps author truth.

It never becomes truth itself.

---

# 168. Final Completion Statement

**Task 7.7 is complete when DayFrame has extracted the structural Work responsibilities identified by Task 7.6 from the legacy Plan surface into a coherent lazy Work Pattern workspace that directly manages the user's canonical Shift Definitions, bounded Work-pattern containers, manual dated Work regimes, repeating rotations, Off days, and regime-specific schedule-preference overrides through the same singular SetupDraft, canonical validation, lifecycle/incarnation model, and Save Setup transaction already governing authored setup; when Month contextual Work evidence can navigate truthfully back to the relevant current structural source without creating independent Work-occurrence authority or retargeting recreated sources; when global temporal preferences remain Planning Settings concerns while regime-specific overrides remain attached to the structural Work context that gives them meaning; when manual and repeating Work modes, sequence contiguity, reference integrity, containment, overlap, anchor/wrap behavior, Off semantics, dormant transition metadata, canonical piecewise user-day resolution, Preview staleness, profile/restore/full-clear replacement, protection, accessibility, focus, keyboard operation, responsive behavior, lazy ownership, and bundle governance all remain intact; when Work Pattern contains no Commitments, Events, Goals, friction resolution, transition recommendations, Pattern Library behavior, Capacity, Allocation, or new scheduler semantics; when legacy Plan has genuinely lost its structural Work responsibility but remains available for the still-unmigrated Commitment inventory rather than being retired prematurely; and when the extraction has also established, with explicit evidence, whether a reusable Work Pattern preset can be represented independently of user-owned identity, can instantiate fresh canonical Shift/cycle/regime identities and references into SetupDraft, can express the current manual/repeating/off-day/override model, and can do so without bypassing validation or Save Setup; when unresolved preset replace/add/merge, anchor/date, identity, reference, or existing-Work semantics stop user-facing preset implementation rather than being invented; when any bounded preset foundation is added only if those mechanics are already unambiguous; when focused/full tests and production-browser structural, contextual, Save/Refresh, keyboard, responsive, and lazy-loading validation pass, all hard bundle guards remain green, governance records both the new Work Pattern ownership and preset-readiness classification, and the evidence tells us whether Task 7.8 should immediately begin a Work Pattern Preset Library, extract the remaining Commitment Library, or first resolve one precisely named preset-application architecture question.**
