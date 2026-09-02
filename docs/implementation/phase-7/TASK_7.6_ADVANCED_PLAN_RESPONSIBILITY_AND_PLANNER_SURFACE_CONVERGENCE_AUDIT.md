# Task 7.6 — Advanced Plan Responsibility and Planner Surface Convergence Audit

## Status

Ready for audit.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

Read-only advanced-configuration architecture audit, legacy Plan responsibility decomposition, Schedule Structure vs Work Pattern product-boundary analysis, Work/shift/cycle/segment structural-model tracing, regime-specific preference-ownership analysis, Commitment-inventory and advanced-authoring analysis, Planner navigation convergence assessment, Plan retirement readiness, future shift-transition architectural fit, lazy/bundle ownership review, governance, and implementation-slicing recommendation.

**No production implementation is authorized by Task 7.6.**

---

# 1. Objective

Determine the natural product and architectural home for the responsibilities that remain unique to the legacy Plan surface after Task 7.5.

Task 7.5 established that routine planning and bounded global configuration no longer require Plan.

Month now owns routine planning.

Planning Settings now owns bounded global configuration.

Review Schedule remains specialized resolution and diagnostics.

What remains in Plan is concentrated around:

* Work definitions;
* Work schedules;
* shift cycles;
* manual segments;
* repeating-cycle structure;
* segment-specific schedule-preference overrides;
* full Commitment inventory;
* advanced Commitment configuration;
* structural authored setup that has not yet been given a deliberate mature product home.

Task 7.6 must answer:

> **Do these remaining responsibilities form one coherent product concept—such as Schedule Structure or Work Pattern—or do they represent multiple bounded workflows that should be decomposed further before Plan can disappear?**

The answer must come from current production semantics, canonical writers, authority boundaries, and user tasks.

Do not choose the final architecture from naming preference alone.

---

# 2. Governing Product Principle

> **A product surface earns its existence because its responsibilities form a coherent user task, not because its components happen to share a legacy screen.**

Current implementation coupling is evidence to investigate.

It is not automatically mature information architecture.

---

# 3. Governing Planner Principle

Treat the post-Task-7.5 Planner model as governing:

```text
Planner

Month
    primary routine planning workspace

Planning Settings
    bounded global planning configuration

Plan
    supporting advanced authored setup during migration

Review Schedule
    specialized resolution / diagnostics

Today
    current-plan / execution-oriented workspace

Summary
    historical interpretation / intelligence
```

Task 7.6 may determine Plan's eventual fate.

It must not weaken Month's established role as the primary Planner surface.

---

# 4. Governing Convergence Principle

> **The goal is not to find a better name for Plan. The goal is to discover the smallest coherent set of user workflows that should exist after Plan is gone.**

Possible outcomes include:

```text
Schedule Structure
```

or:

```text
Work Pattern
```

or:

```text
Work Pattern
Commitment Library
Planning Settings
```

or:

```text
Advanced Plan remains intentionally
```

or another evidence-derived architecture.

Do not predetermine the answer.

---

# 5. Governing Structural-vs-Intent Principle

Task 7.6 must explicitly test whether DayFrame now has a meaningful distinction between:

```text
Structural schedule rules
    when recurring/regime-level constraints exist

Scheduling intent
    what the user wants DayFrame to schedule
```

Example hypothesis:

```text
Work rotation
    structural rule

Exercise 3× per week
    scheduling intent
```

This distinction is not accepted merely because it sounds elegant.

Trace the actual architecture.

---

# 6. Governing Temporal Principle

Do not reopen the accepted canonical temporal architecture.

For every user-day label `D`:

```text
prefs(D)
start(D)
userDay(D) = [start(D), start(D+1))
```

Task 7.6 audits **where the authored inputs to these semantics naturally belong**.

It does not redefine:

* user-day ownership;
* variable-duration days;
* week semantics;
* display-week semantics;
* DST behavior.

---

# 7. Governing Transition Principle

Task 6.3A established that schedule-regime transition facts may be derived from adjacent authored regimes while adaptation policy remains separate future authored/advisory behavior.

Therefore distinguish:

```text
structural regime facts
        ↓
derived transition context
        ↓
future advisory/recommendation layer
        ↓
user-approved planning change
```

Do not turn structural configuration into Recommendation authority.

---

# 8. Task 7.5 Prerequisite

Treat Task 7.5 as governing.

Confirmed outcomes include:

* Month Planning Settings exists;
* Goals use shared canonical implementation;
* global Schedule Preferences use shared canonical implementation;
* Planning Range uses shared canonical implementation;
* Save Setup remains singular;
* SetupDraft remains singular;
* Goal authority remains independent;
* global day-boundary and week-start settings are outside legacy Plan;
* segment-specific overrides remain Plan-only because current UI needs structural cycle/segment context;
* Work/cycle configuration remains Plan-only;
* full Commitment inventory and advanced configuration remain Plan-only;
* profiles/restore/full clear remain lifecycle/shell concerns;
* Review remains specialized;
* Plan retirement is not yet authorized;
* current bundle baseline is:

```text
Initial raw        634,896
Initial gzip       161,779
Largest lazy        52,326
Total JS           759,310
```

No Task 7.5 decision is reopened unless current source evidence proves the reported architecture inaccurate.

---

# 9. Explicit Scope

Audit:

* current Plan production composition;
* Shift Definitions;
* Work definitions;
* Work schedules;
* Shift Cycles;
* manual segments;
* repeating cycles/sequences;
* off/null days;
* segment preference overrides;
* `transitionStrategyId`;
* structural transition context;
* Schedule Preferences ownership;
* Work Pattern hypothesis;
* Schedule Structure hypothesis;
* Commitment inventory;
* Commitment recurrence;
* BlockTemplates;
* recurrence definitions;
* advanced Commitment fields;
* contextual Month Commitment editing;
* disabled/inactive Commitments;
* non-occurring Commitments;
* Goal-link implications;
* Pattern Library relationship;
* Sleep classification;
* Event classification;
* SetupDraft;
* Save Setup;
* validation coupling;
* referential integrity;
* deletion consequences;
* profile/restore/full-clear boundaries;
* Plan navigation/default role;
* Month-default readiness;
* lazy/bundle ownership;
* implementation decomposition;
* governance.

---

# 10. Explicit Non-Goals

Do not implement:

* Schedule Structure;
* Work Pattern;
* Commitment Library;
* Plan retirement;
* Plan rename;
* navigation changes;
* Month-default navigation change;
* new shift semantics;
* new cycle semantics;
* new segment semantics;
* new preference semantics;
* executable `transitionStrategyId`;
* shift-transition recommendations;
* transitional Sleep planning;
* temporary Goal reorientation;
* Capacity;
* Allocation;
* Recommendations;
* Pattern Library;
* direct schedule placement;
* drag/drop;
* resize;
* scheduler redesign;
* recurrence redesign;
* new persistence;
* Backup changes;
* new authority;
* new writer;
* runtime dependency;
* bundle-policy change.

---

# 11. Evidence Standard

For important findings, classify evidence as:

* **Confirmed**
* **Inferred**
* **Not found**
* **Decision required**

A deterministic behavioral claim is **Confirmed** only when supported by production code and, where appropriate, tests.

Do not infer semantic meaning from:

* filenames;
* type names;
* comments alone;
* UI wording alone;
* unused fields;
* future roadmap language.

---

# 12. Execution Artifact Rules

Before audit:

1. verify this Task 7.6 artifact;
2. create immutable project copy;
3. record SHA-256;
4. preserve the Task 7.5 result;
5. inspect current production code/tests;
6. do not modify production or test files;
7. do not run write-formatting if it would alter immutable artifacts.

Create:

`docs/implementation/phase-7/TASK_7.6_ADVANCED_PLAN_RESPONSIBILITY_AND_PLANNER_SURFACE_CONVERGENCE_AUDIT_RESULT.md`

---

# 13. Mandatory Initial Source Audit

Trace the current Plan production surface mechanically.

At minimum inspect the actual production modules responsible for:

* SetupScreen / Plan composition;
* Shift Definition editing;
* Shift Cycle editing;
* manual segment editing;
* repeating sequence editing;
* segment preference overrides;
* Work configuration;
* Commitment inventory;
* Commitment editor;
* recurrence editor;
* advanced Commitment fields;
* SetupDraft;
* Save Setup;
* Goal links;
* profiles where coupled;
* Planning Settings shared sections.

For each current Plan section record:

* component;
* state read;
* writer;
* authority;
* draft/durable boundary;
* validation;
* neighboring-component assumptions;
* contextual equivalent elsewhere;
* whether Plan is currently its only production entry.

---

# 14. Current Plan Responsibility Inventory

Enumerate every responsibility still unique to Plan after Task 7.5.

Do not rely only on Task 7.5's summary.

Verify production reachability.

The inventory must contain no silent omissions.

---

# 15. Responsibility Classification

Classify every remaining responsibility as one or more of:

### Structural

Defines recurring or regime-level scheduling structure.

### Scheduling Intent

Defines something the user wants DayFrame to schedule.

### Configuration

Changes global or regime-specific rules.

### Inventory

Manages authored entities independent of whether they currently appear in Month.

### Contextual Editing

Edits an entity where current schedule context exposes it.

### Lifecycle

Profiles, restore, clear, import/export, etc.

### Diagnostic

Explains or resolves generated schedule behavior.

### Legacy Composition

Appears in Plan because the historical screen has not yet been decomposed.

---

# 16. Shift Definition Semantics

Determine exactly what a Shift Definition represents.

Answer mechanically:

* What type stores it?
* What fields define it?
* What authority owns it?
* Which writer modifies it?
* Can multiple cycles reference it?
* Does it represent a reusable work rule?
* Does it represent a specific dated occurrence?
* What happens to generated Work when it changes?
* Does it participate in exact identity?
* Does it persist through profiles/Backup/restore?
* What validation protects it?

Do not call a Shift Definition a Commitment unless the architecture actually treats it as one.

---

# 17. Work Definition vs Generated Work

Explicitly distinguish:

```text
authored Work / Shift Definition

generated dated Work occurrence

HistoricalPlan frozen Work occurrence
```

For each identify:

* authority;
* mutability;
* identity;
* schedule role;
* Planner surface role.

---

# 18. Work Architectural Specialness

Determine whether Work is structurally special relative to ordinary Commitments.

Audit whether Work:

* is generated through a distinct engine path;
* is movable or non-movable;
* derives from shift definitions/cycles;
* participates differently in candidate placement;
* participates differently in friction;
* participates differently in HistoricalPlan;
* can truthfully be represented as an ordinary Commitment.

If Work is special, state exactly why.

---

# 19. Shift Cycle Semantics

Trace the canonical Shift Cycle.

Determine:

* identity;
* authored fields;
* reference/start date;
* repeating sequence semantics;
* shift-definition references;
* off/null days;
* sequence length;
* wrap behavior;
* validation;
* preference overrides;
* generation consumers;
* deletion behavior.

---

# 20. Repeating Sequence Semantics

Determine what a repeating sequence represents to the domain.

Do not assume the product term should remain **Cycle**.

Trace:

```text
sequence entry
    ↓
shift / off state
    ↓
date expansion
    ↓
generated Work
```

---

# 21. Manual Segment Semantics

Trace manual segment configuration separately from repeating cycles.

Determine:

* start/end semantics;
* identity;
* overlap rules;
* inclusivity;
* Work-definition relationship;
* preference override relationship;
* persistence;
* generation consumers.

---

# 22. Segment Semantics

Determine exactly what **Segment** means in current architecture.

Answer:

* Is a segment an authored regime?
* Is it a portion of a cycle?
* Is it a dated schedule phase?
* Can it exist without Work?
* Can it exist without a cycle?
* Does it own a Shift Definition reference?
* Does it own preferences?
* Is it user-visible terminology or mainly code terminology?

Do not infer meaning from the word itself.

---

# 23. Manual Segment vs Repeating Cycle

Produce a direct comparison.

Determine whether these represent:

* two authoring mechanisms for the same product concept;
* fundamentally different concepts;
* a common higher-level schedule-regime abstraction;
* legacy UI coupling.

---

# 24. Segment Preference Override Semantics

Trace:

```text
segment / sequence regime
        ↓
authored preference override
        ↓
resolveEffectiveSchedulePreferencesForUserDayDate
        ↓
canonical user-day / user-week behavior
```

Determine:

* which fields may be overridden;
* how defaults/global preferences compose;
* how override identity is associated with structural regime;
* why Task 7.5 could not extract these with global preferences.

---

# 25. Global vs Regime-Specific Preferences

Task 7.5 established global Preferences inside Planning Settings.

Audit whether regime-specific overrides naturally belong with:

### A. Schedule Preferences

because they are preferences;

or:

### B. the structural regime

because the override is meaningful only in the context of a particular shift/cycle/segment.

This is a central Task 7.6 decision.

---

# 26. User-Day Boundary Ownership

Do not alter boundary semantics.

Determine only the natural authored-configuration home for:

* global boundary;
* regime-specific boundary override.

---

# 27. Week-Start Ownership

Likewise determine the natural authored home for:

* global `weekStartsOn`;
* regime-specific override.

Do not redefine canonical user-week behavior.

---

# 28. `transitionStrategyId` Audit

Trace every production reference to `transitionStrategyId`.

Determine:

* type definition;
* persistence;
* validation;
* UI authoring;
* generation use;
* Preview use;
* Summary/Today use;
* any scheduling behavior;
* any tests.

Classify as:

* executable semantics;
* dormant metadata;
* unused field;
* other evidence-derived category.

Do not invent transition behavior.

---

# 29. Current Shift-Transition Facts

Determine what DayFrame can already derive purely from adjacent regimes.

Possible facts include:

* outgoing shift;
* incoming shift;
* outgoing/incoming work start;
* outgoing/incoming work end;
* boundary delta;
* week-start delta;
* off days;
* cycle positions;
* change date;
* user-day duration around transition.

Mark each Confirmed/Inferred/Not found.

---

# 30. Future Transition Planning Boundary

Using Task 6.3A only as accepted architectural context, assess where future authored transition policy would naturally attach.

Possible future policy:

* adaptation duration;
* Sleep-shift pace;
* protected transition days;
* temporary load constraints;
* transition preferences.

Do not design these features.

Determine only which candidate structural workspace would provide the most coherent authored context.

---

# 31. Work Pattern Hypothesis

Test:

> **The remaining Work/shift/cycle/segment responsibilities form one coherent Work Pattern workflow.**

Assess:

* domain cohesion;
* user task cohesion;
* authority cohesion;
* writer cohesion;
* validation cohesion;
* need for global context;
* future transition fit;
* regime-specific preference fit;
* naming clarity;
* conflict with future Pattern Library;
* extraction feasibility.

---

# 32. Schedule Structure Hypothesis

Test:

> **The remaining advanced structural responsibilities justify the broader concept Schedule Structure.**

Determine:

* what belongs there;
* what does not;
* whether it contains meaningful non-Work structural content;
* whether it is too abstract;
* whether it becomes a dumping ground;
* whether future structural concepts would naturally fit.

---

# 33. Non-Work Structural Evidence

Search current authored architecture for structural schedule concepts outside Work.

Potential candidates must be supported by production semantics.

Audit:

* Sleep;
* Commitment recurrence;
* recurrence templates;
* temporal Preferences;
* manual Events;
* Goals.

Determine whether any are genuinely **structural schedule rules** rather than intent/configuration.

This determines whether Schedule Structure is broader than Work in substance or only in name.

---

# 34. Sleep Classification

Determine the current architectural class of Sleep.

Is Sleep:

* ordinary Commitment-backed scheduling intent;
* special baseline Commitment;
* structural schedule rule;
* something else?

Do not infer future Sleep-transition semantics from current architecture.

---

# 35. Event Classification

Determine whether Events have any architectural reason to enter a Schedule Structure/Work Pattern replacement.

Expected hypothesis: no.

Verify.

---

# 36. Commitment Inventory Audit

Trace every Plan-only Commitment capability still unique after Task 7.3/7.5.

Distinguish:

```text
contextual Commitment editing

full Commitment inventory

advanced Commitment configuration

recurrence/template management
```

---

# 37. Month Commitment Capability Audit

Enumerate what Month can already do with Commitments.

At minimum inspect:

* Add Commitment;
* Edit Commitment;
* Delete/Remove if available;
* exact source resolution;
* recurrence editing;
* advanced fields;
* Goal linkage;
* enable/disable behavior;
* non-occurring Commitment access.

Do not assume contextual editing is feature-equivalent to the full inventory.

---

# 38. Advanced Commitment Fields

List every field/control still unique or meaningfully easier in Plan.

For each classify:

* common;
* advanced;
* recurrence-specific;
* inventory-specific;
* Goal-link-specific;
* source-level structural;
* safe contextual candidate;
* global-context requirement.

---

# 39. Recurrence Semantics

Trace current Commitment recurrence architecture.

Determine:

* recurrence entity/type;
* identity/incarnation;
* relation to template;
* relation to Commitment;
* supported recurrence types;
* writer;
* persistence;
* Month contextual editor support;
* Plan-only support.

Do not redesign recurrence.

---

# 40. BlockTemplate / Pattern Relationship

Trace the current relationship among:

* `BlockTemplate`;
* Commitment projection;
* recurrence;
* template identity/incarnation;
* Pattern Library future concept.

Determine whether the current advanced Commitment inventory is:

* merely authored Commitment management;
* effectively an early reusable Pattern system;
* something else.

Do not implement Pattern Library.

---

# 41. Commitment Inventory Product Need

Determine whether a global Commitment inventory remains a legitimate user task independent of Month.

Audit needs such as:

* inactive/disabled Commitments;
* Commitments not occurring in current Month;
* global deletion;
* recurrence inspection;
* full Goal-link management;
* templates/patterns;
* bulk/global source inspection.

If the user cannot reliably manage these from Month, a supporting inventory may be justified.

---

# 42. Disabled / Inactive Commitment Semantics

Trace whether authored Commitments can remain present but disabled/inactive.

Determine:

* authority representation;
* whether they appear in Month;
* how users can recover/re-enable them;
* whether this creates a strong need for a global inventory.

---

# 43. Non-Occurring Commitment Semantics

Determine whether a valid active Commitment can fail to appear in the currently displayed Month because of recurrence/range/configuration.

If yes, contextual Month occurrence editing cannot serve as the only Commitment discovery mechanism.

Record consequence.

---

# 44. Commitment Library Hypothesis

Test whether a bounded supporting **Commitments** or **Commitment Library** workflow is justified.

Assess:

* coherent user task;
* source inventory need;
* recurrence configuration;
* disabled source management;
* Goal links;
* relationship to contextual Month editing;
* relationship to Pattern Library.

Do not preselect the name.

---

# 45. Structural vs Intent Boundary

Evaluate the candidate distinction:

```text
Schedule Structure
    recurring structural constraints / regimes

Commitments
    flexible or recurring user scheduling intent
```

For every entity classify whether this distinction improves architectural truth or creates artificial categories.

---

# 46. SetupDraft Boundary

Trace which remaining Plan responsibilities use SetupDraft.

Determine whether shared SetupDraft membership is:

* a genuine reason for common product workflow;
* merely shared transaction infrastructure.

Do not equate one transaction with one product surface automatically.

---

# 47. Save Setup Boundary

Determine whether candidate replacement workflows can continue using the same canonical Save Setup transaction.

Questions:

* Can Work Pattern edit SetupDraft and leave save pending?
* Can Commitment inventory edit the same SetupDraft?
* Can Planning Settings and structural workflow share one dirty state?
* Can Save remain centralized or contextually exposed without duplication?

No implementation.

---

# 48. Cross-Workflow Unsaved State

Analyze:

```text
edit Work Pattern
    ↓
return to Month
    ↓
edit Commitment
    ↓
open Planning Settings
    ↓
Save Setup
```

Would existing SetupDraft semantics correctly preserve all pending edits?

If yes, document.

If product ambiguity exists, identify it.

Do not redesign draft semantics.

---

# 49. Validation Coupling

Trace validation dependencies among:

* shifts;
* cycles;
* segments;
* overrides;
* Commitments;
* recurrences;
* global Preferences.

Determine what must remain co-located to validate safely.

---

# 50. Referential Integrity

Trace references among:

* Shift Definitions;
* Shift Cycles;
* manual segments;
* repeating entries;
* overrides;
* BlockTemplates;
* recurrences;
* Goals/Commitment links.

Determine whether candidate workflow extraction can preserve exact references without new authority.

---

# 51. Structural Deletion Semantics

Audit deletion of:

* Shift Definition;
* Shift Cycle;
* manual segment;
* repeating sequence item/regime.

Determine:

* dependent references;
* validation;
* cascade/no-cascade behavior;
* user confirmation;
* need for structural overview.

---

# 52. Commitment Deletion Semantics

Audit independently.

Determine whether global inventory provides value because deletion has consequences not visible from one Month occurrence.

---

# 53. Structural Entity Inactive Semantics

Determine whether Work/cycle/segment structures may be:

* disabled;
* inactive;
* historical;
* replaced;
* absent.

This may affect need for inventory-like structural management.

---

# 54. Planning Settings Boundary

Task 7.5 established Planning Settings.

Test each remaining Plan responsibility against:

1. Is it global configuration?
2. Is it bounded?
3. Does it require broad structural context?
4. Does it require entity inventory?
5. Would adding it make Planning Settings conceptually incoherent?

Do not expand Planning Settings merely to eliminate Plan.

---

# 55. Month Contextualization Test

For each remaining responsibility ask:

1. Does the selected Month/day provide useful context?
2. Is there an exact current source target?
3. Can the task be completed without viewing global structure?
4. Would Month improve comprehension?
5. Would it overload routine planning?
6. Should Month instead provide a contextual entry to a supporting workflow?

---

# 56. Supporting Workspace Test

A supporting workspace is justified only when:

* it represents a coherent user task;
* it requires broader/global context;
* it is used less routinely than Month;
* it has substantial internal relationships;
* Month can contextually enter it;
* keeping it separate simplifies rather than fragments the product.

Apply this to:

* Schedule Structure;
* Work Pattern;
* Commitment inventory;
* advanced Plan.

---

# 57. Schedule Structure Candidate Boundary

If Schedule Structure is viable, define its proposed contents precisely.

Possible candidate:

```text
Schedule Structure
    Work definitions
    rotations/cycles
    manual regimes
    regime-specific temporal overrides
```

Do not include Commitments merely because they use SetupDraft.

List explicit exclusions.

---

# 58. Work Pattern Candidate Boundary

If Work Pattern is viable, define its contents precisely.

Possible candidate:

```text
Work Pattern
    Shift Definitions
    Work rotations
    off days
    manual/repeating work regimes
    regime-specific overrides
```

List explicit exclusions.

---

# 59. Commitment Workflow Candidate Boundary

If a separate supporting Commitment workflow is justified, define it precisely.

Possible candidate:

```text
Commitments
    complete authored inventory
    create/edit/delete
    enabled/disabled
    recurrence
    advanced source fields
    Goal links
```

Month remains contextual entry/edit.

---

# 60. Product Vocabulary Audit

Audit current and candidate language:

* Plan;
* Planning Settings;
* Work;
* Shift;
* Cycle;
* Segment;
* Rotation;
* Regime;
* Commitment;
* Pattern;
* Work Pattern;
* Schedule Structure;
* Commitment Library.

For each identify:

* current code term;
* current user-facing term;
* semantic meaning;
* candidate product term;
* ambiguity risk.

No production naming change.

---

# 61. Segment Language Assessment

Evaluate whether **Segment** truthfully communicates the product concept.

Candidate alternatives may include:

* schedule phase;
* work period;
* regime;
* rotation period;
* transition period.

Do not select purely on tone.

Determine what entity users are actually authoring.

---

# 62. Cycle Language Assessment

Likewise evaluate:

* Cycle;
* Rotation;
* Pattern;
* Sequence;
* Work schedule.

Determine which aligns with actual semantics.

---

# 63. Work Pattern Naming Risk

Assess whether **Work Pattern** could be confused with:

* a single shift;
* a weekly schedule;
* a rotating schedule;
* future Pattern Library;
* reusable Commitment patterns.

If ambiguity is material, record it.

---

# 64. Schedule Structure Naming Risk

Assess whether **Schedule Structure** is:

* understandable;
* too abstract;
* too broad;
* future-compatible;
* product-friendly.

Do not reward broadness by default.

---

# 65. User-Task Audit

Map responsibilities to actual questions the user is trying to answer.

At minimum:

* When do I normally work?
* What shifts exist?
* What rotation am I on?
* What happens on off days?
* When does my work regime change?
* Which boundary applies during this regime?
* Which week start applies during this regime?
* What Commitments have I authored?
* Which Commitments are inactive?
* How often should this Commitment occur?
* Which Goal does this Commitment serve?
* What happens this month?
* Why did this schedule fail to fit something?

Use these questions to group product responsibilities.

---

# 66. Workflow Frequency Assessment

Classify likely workflow frequency:

* routine;
* occasional;
* setup-heavy;
* exceptional.

This is product inference unless repository evidence says otherwise.

Label it **Inferred** where appropriate.

Use it only as supporting evidence for primary vs supporting surface placement.

---

# 67. Primary vs Supporting Surface Assessment

For each candidate workflow classify:

* primary;
* supporting;
* contextual;
* specialized;
* shell/lifecycle.

Do not default to equal tabs.

---

# 68. Current Navigation Audit

Trace current Planner navigation mechanically.

Determine:

* default Planner mode;
* Month entry;
* Plan entry;
* Review entry;
* Planning Settings entry;
* how contextual workflows return;
* whether Plan remains visually over-prominent relative to its remaining responsibility.

No navigation changes.

---

# 69. Month-Default Readiness

Determine whether the mature architecture now justifies:

```text
Planner default → Month
```

If not, state the exact blocker.

Do not implement.

---

# 70. Plan Retirement Criteria

Define precise criteria for removing legacy Plan.

At minimum:

* every unique responsibility has a canonical replacement;
* no writer is duplicated;
* all advanced entities remain discoverable;
* SetupDraft/Save semantics remain intact;
* lifecycle replacement remains safe;
* validation/referential integrity remains intact;
* keyboard/mobile access remains possible;
* Plan contains no unique required workflow.

---

# 71. Plan Replacement vs Rename vs Decomposition

Explicitly distinguish:

### Rename

Plan remains essentially the same broad screen.

### Replacement

One coherent new supporting workspace assumes its responsibility.

### Decomposition

Plan's responsibilities split across two or more bounded workflows.

### Preserve

Plan itself is still the most coherent advanced workflow.

Recommend one based on evidence.

---

# 72. Plan Navigation Fate

Select exactly one audit outcome:

### A — Replace Plan with Schedule Structure

### B — Replace Plan with Work Pattern

### C — Decompose Plan into multiple bounded supporting workflows

### D — Preserve advanced Plan intentionally

### E — Another evidence-derived outcome

Explain why.

---

# 73. Commitment Inventory Fate

Select one:

* Month contextual editing only;
* dedicated supporting Commitment inventory;
* Planning Settings;
* structural workspace;
* temporary Plan retention;
* other evidence-derived placement.

---

# 74. Segment Override Fate

Select one:

* structural workspace;
* Work Pattern;
* Planning Settings with structural context;
* nested within cycle/regime editor;
* temporary Plan retention;
* other.

Explain why.

---

# 75. Global Preference Fate

Confirm:

* global boundary → Planning Settings;
* global week start → Planning Settings.

Do not reopen Task 7.5 without contradictory evidence.

---

# 76. Transition Strategy Fate

Determine where the current stored `transitionStrategyId` would belong **as authored metadata** if it remains part of the model.

Do not give it behavior.

---

# 77. Future Transition Capability Map

Produce a bounded future architecture:

```text
authored Work/Schedule structure
        ↓
derived transition context
        ↓
future transition recommendation engine
        ↓
user review
        ↓
approved planning changes
```

Clarify that:

* structural workspace owns structural facts;
* recommendation layer owns advice;
* PlanDecision or future governed mechanism may own approved temporary planning effects;
* Goals are not mutated automatically.

---

# 78. Future Sleep-Transition Fit

Assess where a future user would configure any authored preferences needed for transition recommendations.

Do not implement or medically prescribe Sleep behavior.

---

# 79. Future Goal-Reorientation Fit

Assess architectural ownership only.

A future suggestion to reduce/reorient Commitment load during a shift transition must remain advisory/user-approved.

It does not belong as automatic Schedule Structure behavior.

---

# 80. Pattern Library Relationship

The established DayFrame direction treats Pattern Library as contextual rather than a primary destination.

Assess whether:

* Work Pattern conflicts with that vocabulary;
* the two represent different concepts clearly;
* Pattern Library may later supply reusable authored templates to Commitments or Work.

Do not redesign Pattern Library.

---

# 81. Review Boundary

Confirm Review remains responsible for:

* detailed generated schedule;
* friction diagnostics;
* Try;
* Apply Planning Change;
* accepted decisions;
* Day Visualizer.

No remaining authored structural responsibility should migrate into Review merely because Review displays generated Work.

---

# 82. Today Boundary

Confirm no remaining Plan responsibility belongs in Today.

---

# 83. Summary Boundary

Confirm no remaining Plan responsibility belongs in Summary.

---

# 84. Profiles Boundary

Audit whether profiles should remain:

* shell/lifecycle;
* Planning Settings;
* structural workflow;
* another supporting workspace.

Default hypothesis: lifecycle.

Do not migrate.

---

# 85. Backup / Restore Boundary

Surface convergence must remain compatible with existing Backup/restore architecture.

No candidate replacement should require storage-format changes.

Verify.

---

# 86. Full-Clear Boundary

Same.

---

# 87. Persistence Boundary

Determine whether all candidate surface reorganizations can remain pure UI/application composition over current state/persistence.

Expected: yes.

If not, stop and identify architecture gap.

---

# 88. Canonical Writer Map

Identify the existing canonical writer for every remaining responsibility.

At minimum:

* Shift Definition;
* Shift Cycle;
* manual segment;
* repeating sequence;
* segment override;
* Commitment;
* recurrence;
* BlockTemplate;
* SetupDraft;
* Save Setup.

No recommendation should require a second writer unless an explicit architecture gap is discovered.

---

# 89. Authority Map

Identify the authority behind each remaining workflow.

Surface reorganization must not create new authority.

---

# 90. Validation Map

Map validation ownership for:

* Shift Definition;
* cycle;
* segment;
* override;
* Commitment;
* recurrence;
* SetupDraft.

Determine extraction boundaries that preserve canonical validation.

---

# 91. Referential-Integrity Map

Map exact references between structural entities.

Determine which entities must be edited with shared context.

This is strong evidence for or against one structural workspace.

---

# 92. Delete/Replacement Map

For each entity determine:

* deletion semantics;
* replacement semantics;
* stale references;
* validation behavior;
* exact identity implications.

---

# 93. Lazy Ownership Audit

Trace current bundle ownership of:

* Plan;
* SetupScreen;
* structural Work/cycle UI;
* Commitment inventory;
* Commitment editor;
* Month;
* Planning Settings.

Determine whether candidate workflows could reuse the existing Plan lazy chunk or should become bounded lazy entries later.

No implementation.

---

# 94. Bundle Baseline

Reproduce or confirm:

```text
Initial raw        634,896
Initial gzip       161,779
Largest lazy        52,326
Total JS           759,310
```

No production bytes should be intentionally added during Task 7.6.

Explain any change.

---

# 95. Candidate Bundle Architecture

For each recommended future workflow classify:

* existing lazy boundary reusable;
* likely new lazy boundary;
* eager orchestration only;
* duplication risk;
* tree-shaking risk;
* no meaningful bundle impact expected.

Do not estimate fabricated exact byte savings.

---

# 96. Candidate Architecture A — Schedule Structure

Evaluate:

```text
Planner
    Month
        Planning Settings
        Schedule Structure
        Commitments / contextual source editing
        Detailed Review
```

Assess whether Schedule Structure has enough coherent non-Work responsibility to justify its name.

---

# 97. Candidate Architecture B — Work Pattern

Evaluate:

```text
Planner
    Month
        Planning Settings
        Work Pattern
        Commitments
        Detailed Review
```

Assess whether the remaining structural responsibility is fundamentally Work-specific.

---

# 98. Candidate Architecture C — Multiple Supporting Workflows

Evaluate:

```text
Planner
    Month
        Planning Settings
        Work Pattern / Schedule Structure
        Commitment Inventory
        Detailed Review
```

Determine whether decomposition creates clearer product tasks than one advanced surface.

---

# 99. Candidate Architecture D — Preserve Advanced Plan

Evaluate whether current advanced Plan remains the most coherent solution after Tasks 7.3–7.5.

Do not reject preservation merely because it is legacy.

---

# 100. Evidence-Derived Alternative

If another architecture emerges, document it with the same rigor.

---

# 101. Navigation Model Comparison

Evaluate at minimum:

### Model 1 — Equal Destinations

```text
Planner
    Month
    Plan
    Review
```

### Model 2 — Month + Named Supporting Surfaces

```text
Planner
    Month
    Planning Settings
    Schedule Structure / Work Pattern
    Commitments
    Detailed Review
```

### Model 3 — Month as Only Primary Destination

```text
Planner
    Month
        Planning Settings
        structural workflow
        Commitment inventory
        Detailed Review
```

Supporting workflows are contextual, not peer tabs.

### Model 4 — Evidence-Derived Alternative

Recommend one.

---

# 102. Implementation Coupling Audit

For each proposed future extraction identify:

* reusable component;
* component requiring decomposition;
* state already injectable;
* callback already injectable;
* Plan-shell assumptions;
* validation dependency;
* focus dependency;
* navigation dependency;
* lazy-loading dependency.

---

# 103. Recommended Implementation Slices

Based on audit evidence, propose the smallest safe sequence.

Examples only:

```text
Task 7.6A — Extract Work Pattern / Schedule Structure workflow

Task 7.6B — Extract Commitment inventory / advanced source management

Task 7.6C — Planner navigation convergence and legacy Plan retirement
```

or:

```text
Task 7.7 — Work Pattern extraction
Task 7.8 — Commitment inventory
Task 7.9 — navigation convergence
```

or a smaller sequence.

Do not pre-authorize implementation.

---

# 104. ADR Determination

Determine whether the audit introduces a new enduring architectural/domain decision requiring an ADR.

Possible ADR-worthy decisions:

* explicit Structural Schedule vs Scheduling Intent boundary;
* a new enduring Schedule Structure domain concept;
* a new Work Pattern domain concept if it changes architecture beyond presentation.

Not automatically ADR-worthy:

* UI label choice;
* navigation decomposition;
* component extraction.

No ADR should be created merely because a candidate name is selected.

---

# 105. Stop Conditions

Stop the convergence recommendation and name the narrower prerequisite if:

* Shift Definition semantics remain ambiguous;
* cycle semantics remain ambiguous;
* manual segment vs repeating cycle cannot be reconciled conceptually;
* segment ownership cannot be established;
* regime-specific preference ownership remains architecturally ambiguous;
* canonical writers cannot be identified;
* referential integrity cannot be preserved under proposed extraction;
* Commitment inventory capabilities cannot be determined;
* contextual Commitment editor capabilities cannot be compared truthfully;
* structural-vs-intent distinction remains unsupported;
* candidate workflow requires new authority;
* candidate workflow requires new persistence;
* candidate workflow requires scheduler/recurrence redesign;
* Plan cannot be removed without dropping unique capability.

Do not force a Plan-retirement recommendation through unresolved semantics.

---

# 106. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.6_ADVANCED_PLAN_RESPONSIBILITY_AND_PLANNER_SURFACE_CONVERGENCE_AUDIT_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 7.5 Prerequisite Confirmation
4. Audit Method
5. Files Reviewed
6. Current Planner Surface Map
7. Current Plan Production Composition
8. Remaining Plan Responsibility Inventory
9. Responsibility Classification
10. Shift Definition Semantics
11. Work Definition vs Work Occurrence
12. Work Architectural Specialness
13. Shift Cycle Semantics
14. Repeating Sequence Semantics
15. Manual Segment Semantics
16. Segment Semantics
17. Manual Segment vs Repeating Cycle
18. Segment Preference Overrides
19. Global vs Regime-Specific Preferences
20. User-Day Boundary Ownership
21. Week-Start Ownership
22. `transitionStrategyId`
23. Current Shift-Transition Facts
24. Future Transition Planning Boundary
25. Work Pattern Hypothesis
26. Schedule Structure Hypothesis
27. Non-Work Structural Evidence
28. Sleep Classification
29. Event Classification
30. Commitment Inventory Audit
31. Month Commitment Capability
32. Advanced Commitment Fields
33. Recurrence Semantics
34. BlockTemplate / Pattern Relationship
35. Commitment Inventory Product Need
36. Disabled / Inactive Commitment Semantics
37. Non-Occurring Commitment Semantics
38. Commitment Library Hypothesis
39. Structural vs Intent Boundary
40. SetupDraft Boundary
41. Save Setup Boundary
42. Cross-Workflow Unsaved State
43. Validation Coupling
44. Referential Integrity
45. Structural Deletion Semantics
46. Commitment Deletion Semantics
47. Structural Entity Inactive Semantics
48. Planning Settings Boundary
49. Month Contextualization Test
50. Supporting Workspace Test
51. Schedule Structure Candidate Boundary
52. Work Pattern Candidate Boundary
53. Commitment Workflow Candidate Boundary
54. Product Vocabulary Audit
55. Segment Language Assessment
56. Cycle Language Assessment
57. Work Pattern Naming Risk
58. Schedule Structure Naming Risk
59. User-Task Audit
60. Workflow Frequency Assessment
61. Primary vs Supporting Surface Assessment
62. Current Navigation Audit
63. Month-Default Readiness
64. Plan Retirement Criteria
65. Replacement vs Rename vs Decomposition
66. Plan Navigation Fate
67. Plan Label Fate
68. Commitment Inventory Fate
69. Segment Override Fate
70. Transition Strategy Fate
71. Future Transition Capability Map
72. Future Sleep-Transition Fit
73. Future Goal-Reorientation Fit
74. Pattern Library Relationship
75. Review Boundary
76. Today Boundary
77. Summary Boundary
78. Profiles Boundary
79. Backup / Restore Boundary
80. Full-Clear Boundary
81. Persistence Boundary
82. Canonical Writer Map
83. Authority Map
84. Validation Map
85. Referential-Integrity Map
86. Delete / Replacement Map
87. Lazy Ownership Audit
88. Bundle Baseline
89. Candidate Bundle Architecture
90. Schedule Structure Assessment
91. Work Pattern Assessment
92. Multiple-Workflow Assessment
93. Preserve-Plan Assessment
94. Navigation Model Comparison
95. Recommended Product Architecture
96. Implementation Coupling Audit
97. Recommended Implementation Slices
98. Bundle Impact Assessment
99. Authority Impact Assessment
100. Persistence Impact Assessment
101. Product-Boundary Assessment
102. Architectural Invariant Assessment
103. Stop-Condition Assessment
104. ADR Determination
105. Validation
106. Governance Updates
107. Deviations
108. Discoveries
109. Deferred Work
110. Plan Responsibility Matrix
111. Candidate Decision Matrix
112. Structural-vs-Intent Matrix
113. Transition-Readiness Matrix
114. Commitment Capability Matrix
115. Work Capability Matrix
116. Preference-Ownership Matrix
117. Vocabulary Matrix
118. User-Task Matrix
119. Writer/Authority Matrix
120. Surface Responsibility Matrix
121. Navigation Matrix
122. Bundle Matrix
123. Product-Boundary Matrix
124. Epistemic Matrix
125. Task 7.7 Readiness
126. Recommended Next Task
127. Final Audit Determination

---

# 107. Required Plan Responsibility Matrix

| Responsibility                 | Product class | Canonical authority/writer | Contextual equivalent exists? | Candidate natural home |
| ------------------------------ | ------------- | -------------------------- | ----------------------------: | ---------------------- |
| Shift Definitions              |               |                            |                               |                        |
| Work schedule                  |               |                            |                               |                        |
| Shift Cycles                   |               |                            |                               |                        |
| manual segments                |               |                            |                               |                        |
| repeating sequence             |               |                            |                               |                        |
| segment boundary override      |               |                            |                               |                        |
| segment week-start override    |               |                            |                               |                        |
| Commitment inventory           |               |                            |                               |                        |
| advanced Commitment fields     |               |                            |                               |                        |
| recurrence/template management |               |                            |                               |                        |
| Save Setup                     | transaction   | existing                   |                           Yes | shared                 |

---

# 108. Required Candidate Decision Matrix

| Criterion                            | Schedule Structure | Work Pattern | Multiple Workflows | Preserve Plan |
| ------------------------------------ | -----------------: | -----------: | -----------------: | ------------: |
| coherent user task                   |                    |              |                    |               |
| matches current domain               |                    |              |                    |               |
| structural cohesion                  |                    |              |                    |               |
| writer cohesion                      |                    |              |                    |               |
| authority cohesion                   |                    |              |                    |               |
| avoids dumping-ground surface        |                    |              |                    |               |
| supports Month contextual entry      |                    |              |                    |               |
| supports advanced setup              |                    |              |                    |               |
| regime override fit                  |                    |              |                    |               |
| Commitment fit                       |                    |              |                    |               |
| future transition fit                |                    |              |                    |               |
| Pattern Library naming compatibility |                    |              |                    |               |
| naming clarity                       |                    |              |                    |               |
| implementation feasibility           |                    |              |                    |               |
| Plan-retirement potential            |                    |              |                    |               |

---

# 109. Required Structural-vs-Intent Matrix

| Entity                    | Structural rule? | Scheduling intent? | Derived schedule? | Historical evidence? | Recommended conceptual class |
| ------------------------- | ---------------: | -----------------: | ----------------: | -------------------: | ---------------------------- |
| ShiftDefinition           |                  |                    |                   |                      |                              |
| ShiftCycle                |                  |                    |                   |                      |                              |
| manual segment            |                  |                    |                   |                      |                              |
| segment override          |                  |                    |                   |                      |                              |
| Commitment                |                  |                    |                   |                      |                              |
| recurrence                |                  |                    |                   |                      |                              |
| BlockTemplate             |                  |                    |                   |                      |                              |
| Goal                      |                  |                    |                   |                      |                              |
| Manual Event              |                  |                    |                   |                      |                              |
| generated Work occurrence |                  |                    |                   |                      |                              |
| Preview block             |                  |                    |                   |                      |                              |
| HistoricalPlan occurrence |                  |                    |                   |                      |                              |

---

# 110. Required Transition-Readiness Matrix

| Capability                          | Existing evidence sufficient? | New authored policy eventually required? | Natural future architectural layer |
| ----------------------------------- | ----------------------------: | ---------------------------------------: | ---------------------------------- |
| identify shift/regime change        |                               |                                          |                                    |
| compare Work windows                |                               |                                          |                                    |
| boundary delta                      |                               |                                          |                                    |
| week-start delta                    |                               |                                          |                                    |
| identify off transition days        |                               |                                          |                                    |
| derive transition user-day duration |                               |                                          |                                    |
| suggest temporary Sleep schedule    |                               |                             Yes expected |                                    |
| suggest reduced transition load     |                               |                             Yes expected |                                    |
| Goal/Commitment reorientation       |   links/context only expected |                             Yes expected |                                    |
| return to stable regime             |                               |                                          |                                    |

---

# 111. Required Commitment Capability Matrix

| Capability                       | Month contextual workflow | Legacy Plan | Global inventory genuinely required? | Recommended mature home |
| -------------------------------- | ------------------------: | ----------: | -----------------------------------: | ----------------------- |
| create                           |                           |             |                                      |                         |
| edit                             |                           |             |                                      |                         |
| delete                           |                           |             |                                      |                         |
| enable/disable                   |                           |             |                                      |                         |
| recurrence                       |                           |             |                                      |                         |
| advanced fields                  |                           |             |                                      |                         |
| Goal linkage                     |                           |             |                                      |                         |
| inspect inactive source          |                           |             |                                      |                         |
| inspect non-occurring source     |                           |             |                                      |                         |
| inspect all authored Commitments |                           |             |                                      |                         |

---

# 112. Required Work Capability Matrix

| Capability                      | Month contextual Work | Legacy Plan | Candidate structural workflow | Global context required? |
| ------------------------------- | --------------------: | ----------: | ----------------------------: | -----------------------: |
| inspect current Work occurrence |                       |             |                               |                          |
| edit current Shift Definition   |                       |             |                               |                          |
| create Shift Definition         |                       |             |                               |                          |
| delete Shift Definition         |                       |             |                               |                          |
| define Work schedule            |                       |             |                               |                          |
| define repeating rotation       |                       |             |                               |                          |
| define off days                 |                       |             |                               |                          |
| define manual regime            |                       |             |                               |                          |
| segment/regime override         |                       |             |                               |                          |
| transition metadata             |                       |             |                               |                          |

---

# 113. Required Preference-Ownership Matrix

| Preference                  | Global writer/home | Override owner | Structural context required? | Recommended mature home |
| --------------------------- | ------------------ | -------------- | ---------------------------: | ----------------------- |
| day boundary                | Planning Settings  |                |                              |                         |
| week start                  | Planning Settings  |                |                              |                         |
| segment boundary override   | N/A global         |                |                              |                         |
| segment week-start override | N/A global         |                |                              |                         |
| other current overrides     |                    |                |                              |                         |

---

# 114. Required Vocabulary Matrix

| Domain concept           | Code term | Current user-facing term | Candidate future product term | Ambiguity / decision |
| ------------------------ | --------- | ------------------------ | ----------------------------- | -------------------- |
| Work definition          |           |                          |                               |                      |
| repeating Work sequence  |           |                          |                               |                      |
| manual dated regime      |           |                          |                               |                      |
| regime subsection        | Segment   |                          |                               |                      |
| structural workspace     | Plan      | Plan                     |                               |                      |
| Commitment inventory     |           |                          |                               |                      |
| reusable pattern concept |           |                          | Pattern Library               |                      |

---

# 115. Required User-Task Matrix

| User question                               | Current workflow | Context required     | Recommended future workflow |
| ------------------------------------------- | ---------------- | -------------------- | --------------------------- |
| When do I normally work?                    |                  |                      |                             |
| What shifts have I defined?                 |                  |                      |                             |
| What rotation am I on?                      |                  |                      |                             |
| Which days are off?                         |                  |                      |                             |
| When does my Work regime change?            |                  |                      |                             |
| What boundary applies during this regime?   |                  |                      |                             |
| What week start applies during this regime? |                  |                      |                             |
| What Commitments have I authored?           |                  |                      |                             |
| Which Commitments are inactive?             |                  |                      |                             |
| How often should this Commitment occur?     |                  |                      |                             |
| Which Goal does this Commitment support?    |                  |                      |                             |
| What happens this month?                    | Month            | spatial/month        | Month                       |
| Why couldn't this fit?                      | Review           | generated diagnostic | Review                      |

---

# 116. Required Writer / Authority Matrix

| Responsibility     | Authority      | Canonical writer | SetupDraft? | New authority needed? | New writer needed? |
| ------------------ | -------------- | ---------------- | ----------: | --------------------: | -----------------: |
| Shift Definition   |                |                  |             |           No expected |        No expected |
| cycle              |                |                  |             |                    No |                 No |
| manual segment     |                |                  |             |                    No |                 No |
| repeating sequence |                |                  |             |                    No |                 No |
| segment override   |                |                  |             |                    No |                 No |
| Commitment         |                |                  |             |                    No |                 No |
| recurrence         |                |                  |             |                    No |                 No |
| BlockTemplate      |                |                  |             |                    No |                 No |
| Goal               | Goal authority | existing         |       audit |                    No |                 No |
| Preview            | derived        | generator        |          No |                    No |                 No |

---

# 117. Required Surface Responsibility Matrix

| Responsibility                 |             Month | Planning Settings |        Structural/Work workflow | Commitment workflow |       Review |
| ------------------------------ | ----------------: | ----------------: | ------------------------------: | ------------------: | -----------: |
| routine schedule review        |               Yes |                No |                              No |                  No |     detailed |
| contextual source edit         |               Yes |                No |                contextual entry |    contextual entry |           No |
| global Goals                   |             entry |               Yes |                              No |          links only |           No |
| global preferences             |             entry |               Yes |                              No |                  No |           No |
| Work structure                 |  contextual entry |                No |                       candidate |                  No | derived only |
| regime override                |  contextual entry |                No |                       candidate |                  No | derived only |
| Commitment inventory           | contextual source |                No |                       likely No |           candidate |           No |
| recurrence                     |        contextual |                No | Work-specific only if supported |           candidate | derived only |
| friction resolution            |   attention entry |                No |                              No |                  No |          Yes |
| detailed generated diagnostics |           limited |                No |                              No |                  No |          Yes |

---

# 118. Required Navigation Matrix

| Candidate model                           | Primary destination | Supporting workflows                  | Specialized workflow | Plan fate              | Assessment |
| ----------------------------------------- | ------------------- | ------------------------------------- | -------------------- | ---------------------- | ---------- |
| Current                                   | mixed               | Planning Settings                     | Review               | retained               |            |
| Month + Schedule Structure                | Month               | Settings + Structure                  | Review               | replaced               |            |
| Month + Work Pattern + Commitments        | Month               | Settings + Work Pattern + Commitments | Review               | decomposed             |            |
| Month-only primary + contextual workflows | Month               | contextual supporting modes           | Review               | removed                |            |
| Preserve Advanced Plan                    | Month               | Settings + Plan                       | Review               | retained intentionally |            |
| Evidence-derived alternative              |                     |                                       |                      |                        |            |

---

# 119. Required Bundle Matrix

| Metric       | Task 7.5 baseline | Task 7.6 audit final | Delta |
| ------------ | ----------------: | -------------------: | ----: |
| Initial raw  |           634,896 |                      |       |
| Initial gzip |           161,779 |                      |       |
| Largest lazy |            52,326 |                      |       |
| Total JS     |           759,310 |                      |       |

Expected production delta: **0**.

Any difference must be explained.

---

# 120. Required Product-Boundary Matrix

| Capability                |                     Month | Planning Settings | Candidate structural workflow | Commitment workflow |   Review |
| ------------------------- | ------------------------: | ----------------: | ----------------------------: | ------------------: | -------: |
| Month review              |                       Yes |                No |                            No |                  No | detailed |
| source authoring          |                contextual |                No |            structural sources |  Commitment sources |       No |
| Goals                     |                     entry |               Yes |                            No |        link context |       No |
| global preferences        |                     entry |               Yes |                            No |                  No |       No |
| Work definitions          |                     entry |                No |                     candidate |                  No |  derived |
| rotations/cycles          |                     entry |                No |                     candidate |                  No |  derived |
| regime overrides          |                     entry |                No |                     candidate |                  No |  derived |
| full Commitment inventory |         source contextual |                No |            No unless evidence |           candidate |       No |
| friction resolution       |                 attention |                No |                            No |                  No |      Yes |
| Try / Apply               |                     entry |                No |                            No |                  No |      Yes |
| Day Visualizer            | selected-day summary only |                No |                            No |                  No |      Yes |

---

# 121. Required Epistemic Matrix

| Evidence/state                          | DayFrame may represent            | Must not infer                 |
| --------------------------------------- | --------------------------------- | ------------------------------ |
| Shift Definition                        | authored Work rule                | actual Work performed          |
| repeating sequence                      | authored Work structure           | transition difficulty          |
| manual segment                          | authored dated regime             | user needs adaptation          |
| boundary delta                          | exact temporal change             | recommended Sleep shift        |
| week-start delta                        | exact preference change           | productivity impact            |
| off day                                 | no authored Work assignment       | free capacity                  |
| Commitment                              | authored scheduling intent        | completion                     |
| disabled Commitment                     | authored inactive intent          | deleted source                 |
| no current Month occurrence             | not projected here                | Commitment does not exist      |
| Month occurrence                        | current generated/source evidence | complete Commitment inventory  |
| `transitionStrategyId` with no consumer | stored metadata                   | executable transition strategy |
| Plan-only UI                            | current access path               | natural mature product home    |

---

# 122. Architectural Invariants

Assess at minimum:

1. Month remains the primary routine Planner.
2. Planning Settings remains global bounded configuration.
3. Review remains specialized resolution/diagnostics.
4. Today remains execution/current-day oriented.
5. Summary remains historical intelligence.
6. Plan is not preserved merely because it already exists.
7. Plan is not retired merely because retirement is desirable.
8. product surfaces follow coherent user tasks.
9. code co-location does not prove product cohesion.
10. SetupDraft sharing does not prove product cohesion.
11. Shift Definition semantics are mechanically traced.
12. Shift Definition remains authored, not generated occurrence.
13. generated Work remains derived.
14. HistoricalPlan Work remains frozen historical evidence.
15. Work's architectural specialness is explicitly assessed.
16. Shift Cycle semantics are mechanically traced.
17. repeating sequences are traced independently.
18. manual segments are traced independently.
19. manual segment and repeating cycle are not conflated without evidence.
20. Segment meaning is established from production semantics.
21. segment override ownership is explicit.
22. global Preferences remain Planning Settings responsibility.
23. global and regime-specific Preferences remain distinguishable.
24. canonical piecewise user-day semantics are not reopened.
25. canonical week-start semantics are not reopened.
26. candidate structural workflow does not compute temporal truth independently.
27. `transitionStrategyId` receives no invented behavior.
28. transition context remains derived evidence.
29. transition difficulty is not inferred.
30. transition adaptation remains future policy.
31. Work Pattern is evaluated, not assumed.
32. Schedule Structure is evaluated, not assumed.
33. multiple-workflow decomposition is evaluated.
34. preserving Plan is evaluated.
35. evidence-derived alternatives are allowed.
36. Schedule Structure cannot become an arbitrary dumping ground.
37. Work Pattern cannot absorb non-Work concepts without evidence.
38. non-Work structural evidence is explicitly audited.
39. Sleep's current architectural class is established.
40. Event's current architectural class is established.
41. Commitment inventory is audited separately from structural Work.
42. Month contextual Commitment capabilities are mechanically enumerated.
43. advanced Commitment fields are mechanically enumerated.
44. recurrence semantics remain unchanged.
45. recurrence identity remains unchanged.
46. BlockTemplate semantics remain unchanged.
47. Pattern Library is not implemented.
48. Pattern Library remains contextual by established product direction.
49. Commitment inventory need is evidence-based.
50. disabled Commitments are accounted for.
51. non-occurring Commitments are accounted for.
52. structural-vs-intent distinction is tested rather than assumed.
53. Goal remains independent authority.
54. no Goal ranking is introduced.
55. no Goal allocation is introduced.
56. no Goal reorientation behavior is introduced.
57. future Goal reorientation remains advisory/user-approved.
58. Planning Settings is not expanded merely to eliminate Plan.
59. Month is not overloaded merely to eliminate Plan.
60. a supporting workspace must have a coherent user task.
61. supporting workflows need not become equal tabs.
62. primary-vs-supporting classification is explicit.
63. current Planner navigation is mechanically audited.
64. Month-default readiness is explicitly assessed.
65. Plan retirement criteria are explicit.
66. Plan replacement is distinguished from rename.
67. Plan decomposition is allowed.
68. Plan preservation remains allowed.
69. Plan navigation fate is explicitly decided.
70. Commitment inventory fate is explicitly decided.
71. segment override fate is explicitly decided.
72. transition metadata fate is explicitly decided.
73. canonical writers are mapped.
74. no new writer is recommended without evidence.
75. authorities are mapped.
76. no new authority is recommended without evidence.
77. SetupDraft boundary is mapped.
78. Save Setup boundary is mapped.
79. cross-workflow unsaved-state behavior is assessed.
80. validation coupling is traced.
81. referential integrity is traced.
82. structural deletion consequences are traced.
83. Commitment deletion consequences are traced.
84. inactive structural semantics are traced.
85. exact identity remains preservable under candidate extraction.
86. profiles remain lifecycle unless evidence says otherwise.
87. Backup/restore remains lifecycle/persistence support.
88. full clear remains lifecycle.
89. surface reorganization requires no persistence change.
90. surface reorganization requires no Backup change.
91. Review does not absorb authored structure.
92. Today does not absorb authored structure.
93. Summary does not absorb authored structure.
94. no direct schedule geometry editing is introduced.
95. no drag/drop is introduced.
96. no resize is introduced.
97. no scheduler redesign occurs.
98. no recurrence redesign occurs.
99. no Capacity is introduced.
100. no Allocation is introduced.
101. no general Recommendations are introduced.
102. no transition adaptation is implemented.
103. future transition adaptation fit is assessed only.
104. future transition recommendation does not become structural authority.
105. product vocabulary is evidence-driven.
106. Segment language is assessed.
107. Cycle language is assessed.
108. Work Pattern naming risk is assessed.
109. Schedule Structure naming risk is assessed.
110. Pattern Library naming interaction is assessed.
111. user tasks are mapped.
112. workflow-frequency claims are labeled inferred where necessary.
113. Month contextualization is assessed responsibility-by-responsibility.
114. Planning Settings fit is assessed responsibility-by-responsibility.
115. supporting-workspace fit is assessed responsibility-by-responsibility.
116. lazy ownership is mapped.
117. candidate future workflows remain lazy where appropriate.
118. advanced configuration is not made eager by recommendation.
119. Task 7.5 bundle baseline is reproduced or explained.
120. no production bytes are intentionally added.
121. no runtime dependency is added.
122. no bundle-policy change occurs.
123. no production implementation is performed.
124. no test behavior is changed.
125. repository validation remains green.
126. governance records the audit without claiming implementation.
127. ADR need is assessed.
128. implementation slices follow audit evidence.
129. Task 7.7 is not predetermined.
130. final audit gives an explicit mature Planner architecture recommendation.

Classify each as:

* Confirmed
* Inferred
* Not found
* Decision required
* Preserved
* Deferred
* Prohibited
* Not applicable
* Blocked

---

# 123. Stop-Condition Assessment

Trigger a stop rather than forcing convergence if:

* the remaining Plan responsibilities cannot be classified coherently;
* Shift Definition semantics are ambiguous;
* Shift Cycle semantics are ambiguous;
* Segment semantics remain ambiguous;
* manual segments and repeating cycles cannot be related truthfully;
* regime-specific Preference ownership cannot be resolved;
* structural-vs-intent distinction remains unsupported;
* canonical writers cannot be identified;
* referential integrity prevents bounded extraction;
* Commitment inventory needs cannot be established;
* Month contextual Commitment capabilities cannot be determined accurately;
* candidate surface decomposition requires new authority;
* candidate surface decomposition requires new persistence;
* candidate surface decomposition requires scheduler or recurrence redesign;
* Plan still owns unique required behavior with no replacement.

If one bounded uncertainty remains, recommend the narrow prerequisite audit rather than a broad implementation.

---

# 124. Focused Validation

This is a read-only audit.

No production or test file should change.

Run existing focused suites necessary to confirm deterministic claims around:

* cycles;
* effective Preferences;
* Work generation;
* Commitment/template/recurrence behavior;
* SetupDraft;
* Save Setup;
* profile/restore where relied upon.

Record exact suites and results.

Do not create tests merely to make the audit pass.

---

# 125. Full Validation

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

If immutable artifact constraints allow formatting without mutation, `npm run format` may also be run.

Otherwise document why write-formatting was omitted.

Record:

* test files;
* test count;
* transformed modules;
* initial raw;
* initial gzip;
* largest lazy;
* total JS;
* bundle-policy state;
* diff result.

---

# 126. Manual Validation

No production UI change is authorized.

Real-browser QA is not required unless the audit unexpectedly changes production composition, which should itself trigger a deviation/stop.

Source/UI inspection is sufficient for product-responsibility tracing.

---

# 127. Governance Updates

Update:

* Task 7.6 result;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Governance must record:

* recommended mature Planner architecture;
* Plan fate;
* Commitment inventory fate;
* regime-override fate;
* Month-default readiness;
* recommended implementation slices;
* any unresolved architecture prerequisite.

Do not claim implementation.

---

# 128. Task 7.7 Readiness

Task 7.7 is authorized only if Task 7.6 produces a sufficiently precise implementation boundary.

Possible outcomes:

### Outcome A — Work Pattern Is Canonical

Recommend:

> **Task 7.7 — Work Pattern Workspace Extraction and Advanced Work Configuration Migration**

### Outcome B — Schedule Structure Is Canonical

Recommend:

> **Task 7.7 — Schedule Structure Workspace Extraction and Advanced Structural Configuration Migration**

### Outcome C — Multiple Workflows Are Canonical

Recommend the first bounded extraction only.

Example:

> **Task 7.7 — Work Pattern Extraction**

followed later by Commitment inventory migration.

### Outcome D — Plan Remains Justified

Do not create a retirement task.

Proceed to another Phase 7 priority.

### Outcome E — Architecture Blocker

Name the exact prerequisite audit.

---

# 129. Completion Criteria

Task 7.6 is complete only when:

* every current Plan-only production responsibility is mechanically identified;
* every responsibility is classified by product role rather than legacy screen location;
* Shift Definitions, generated Work occurrences, HistoricalPlan Work evidence, Shift Cycles, repeating sequences, manual segments, segment-specific overrides, Commitments, recurrences, BlockTemplates, Goals, Events, and Sleep are mechanically distinguished;
* Work's architectural specialness relative to ordinary Commitments is explicitly determined;
* manual segments and repeating cycles are compared and their conceptual relationship is established or marked unresolved;
* Segment semantics are derived from production behavior rather than the term alone;
* global Preferences remain distinguished from regime-specific overrides;
* ownership of regime-specific boundary/week-start overrides is explicitly recommended;
* canonical piecewise user-day and user-week semantics remain untouched;
* every production use of `transitionStrategyId` is traced and no behavior is invented;
* current derivable shift-transition facts are separated from future adaptation policy;
* Work Pattern is evaluated as a hypothesis;
* Schedule Structure is evaluated as a hypothesis;
* multiple bounded workflows are evaluated;
* intentionally preserving advanced Plan is evaluated;
* meaningful non-Work structural evidence is explicitly sought;
* Sleep and Event architectural classes are established;
* the remaining Commitment inventory and advanced-authoring capabilities are enumerated;
* Month contextual Commitment capability is mechanically compared with Plan;
* disabled and non-occurring Commitment management is assessed;
* the need for a global Commitment inventory is explicitly determined;
* recurrence and BlockTemplate relationships are traced without implementing Pattern Library;
* the structural-rule vs scheduling-intent distinction is either supported or rejected from evidence;
* SetupDraft, Save Setup, dirty-state, validation, referential-integrity, deletion, and replacement boundaries are mapped;
* candidate product workflows can preserve canonical writers and current authority;
* Planning Settings is not expanded merely to kill Plan;
* Month is not overloaded merely to kill Plan;
* supporting-workspace criteria are applied explicitly;
* user tasks are mapped to current and proposed workflows;
* vocabulary risks for Segment, Cycle, Work Pattern, Schedule Structure, and Commitment Library are assessed;
* future shift-transition adaptation is mapped only far enough to determine structural-workspace fit;
* future Sleep/Goal reorientation remains outside structural authority;
* Pattern Library relationship is assessed without changing its established contextual direction;
* Review, Today, Summary, profiles, Backup/restore, full clear, persistence, and bundle boundaries remain intact;
* Plan's current default/navigation prominence is compared against its actual remaining responsibility;
* evidence-based Plan retirement criteria are defined;
* Plan replacement, rename, decomposition, and preservation are distinguished;
* one explicit Plan navigation fate is recommended;
* one explicit Commitment inventory fate is recommended;
* one explicit segment-override fate is recommended;
* Month-default readiness is explicitly determined;
* candidate navigation architectures are compared;
* the mature recommended Planner information architecture is stated;
* implementation coupling and lazy ownership are mapped;
* the smallest safe next implementation slices are proposed;
* no production/test implementation is performed;
* repository validation remains green;
* bundle output remains unchanged or any difference is explained;
* governance records the audit decision;
* Task 7.7 is either precisely authorized or blocked on a precisely named prerequisite.

---

# 130. Final Audit Principle

> **The goal is not to decide whether “Schedule Structure” sounds better than “Work Pattern.” The goal is to identify what the user is actually authoring and give that task the smallest coherent home.**

If the evidence says:

```text
Work Pattern
    shifts
    rotations
    off days
    regimes
    regime-specific overrides
```

then Work Pattern should emerge because those concepts truly form one task.

If the evidence says:

```text
Schedule Structure
    broader structural rules beyond Work
```

then Schedule Structure should exist because the broader concept is real.

If the evidence says:

```text
Work Pattern
Commitment Inventory
Planning Settings
```

then decomposition is cleaner than forcing unrelated responsibilities together.

And if advanced Plan remains the most coherent implementation after this audit, preserving it intentionally is preferable to cosmetic convergence.

---

# 131. Final Completion Statement

**Task 7.6 is complete when DayFrame has mechanically traced every responsibility still unique to the legacy Plan surface after Task 7.5 and determined, from actual domain semantics, canonical writers, authority boundaries, referential relationships, and user tasks rather than current component location, whether those responsibilities form a coherent Schedule Structure workspace, a narrower Work Pattern workspace, multiple bounded supporting workflows such as Work Pattern plus a Commitment inventory, an intentionally preserved advanced Plan surface, or another evidence-derived architecture; when authored Shift Definitions, generated Work occurrences, HistoricalPlan Work evidence, Shift Cycles, repeating sequences, manual segments, regime-specific preference overrides, Commitments, recurrences, BlockTemplates, Goals, Events, and Sleep have been classified without collapsing structural rules, scheduling intent, derived schedule, or historical evidence; when global Preferences remain Planning Settings concerns while the natural ownership of regime-specific overrides is explicitly resolved; when accepted piecewise user-day and week-start semantics remain untouched, every current use of `transitionStrategyId` has been traced without inventing behavior, exact shift-transition facts are distinguished from future adaptation policy, and future Sleep-transition or Goal-reorientation recommendations remain outside structural authority; when Month's actual contextual Commitment capabilities have been compared against the full Plan inventory, disabled and non-occurring source management has been assessed, the need for a global Commitment workflow has been established or rejected, Pattern/template relationships have been traced without implementing Pattern Library, and Work's special architectural status has been established; when candidate Schedule Structure, Work Pattern, multiple-workflow decomposition, and preserved-Plan architectures have been tested against coherent user tasks, writer/authority cohesion, validation, SetupDraft/Save boundaries, referential integrity, contextual Month entry, future transition fit, naming clarity, lazy ownership, and Plan-retirement potential; when Plan's current navigation/default prominence has been evaluated against its actual remaining responsibility, evidence-based retirement criteria are defined, replacement is distinguished from rename and decomposition, one explicit Plan fate, Commitment-inventory fate, segment-override fate, Month-default determination, and mature Planner navigation model are recommended; when the smallest safe implementation sequence is proposed, no production or test implementation is performed, existing persistence/Backup/profile/restore/full-clear/Review/Today/Summary/bundle boundaries remain intact, repository validation remains green, governance records the architectural decision, and Task 7.7 is either precisely authorized around the evidence-derived replacement workflow or explicitly blocked on the narrow architecture question that remains unresolved.**
