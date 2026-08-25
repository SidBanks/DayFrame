# Task 6.2 — Planner / Today / Summary Surface and Application Boundary Foundation

## Status

Ready for implementation.

## Phase

Phase 6 — Platform Maturity

## Task Type

Application-composition refactor, top-level surface extraction, navigation foundation, surface ownership boundary establishment, lazy-loading preservation, state/draft ownership preservation, accessibility/focus stabilization, regression testing, bundle-budget validation, and governance.

**No new Today semantics, no current-user-day query, no now/next/later logic, no commitment redesign, no Planner information-architecture redesign, and no Summary semantic changes are authorized.**

---

# 1. Objective

Refactor the current monolithic application composition into explicit product-surface boundaries:

```text
Planner
Today
Summary
```

while preserving all current production behavior.

At completion:

* Planner must be a bounded application surface;
* Summary must remain a bounded lazy-loaded application surface;
* Today must exist as a bounded surface/navigation destination;
* Today may contain only a deliberately minimal placeholder/foundation state;
* canonical store ownership remains singular;
* existing Setup draft ownership remains singular;
* all existing writes continue through the same canonical commands;
* all current Planner and Summary workflows continue to behave identically;
* no new scheduling, execution, Goal, Progress, or historical semantics are introduced.

Task 6.2 prepares the application architecture for Task 6.3, which will add the canonical Today read model.

---

# 2. Governing Audit Result

Task 6.1 concluded:

> **Determination A — Ready for surface convergence.**

The accepted product model is:

```text
Planner
    future / horizon-flexible planning

Today
    canonical current user-day

Summary
    historical interpretation
```

Important governing findings:

* “Monthly” is a Planner presentation, not an authority boundary.
* Today will eventually mean the canonical current user-day.
* Summary semantics should remain preserved.
* no new durable authority is required for Planner or Today V1;
* no generic Commitment authority is required;
* no current-plan authority is required;
* no plan-acceptance authority is required;
* the primary immediate gap is **application composition**;
* the next semantic gap after this task is the canonical current-user-day/current-plan read model.

---

# 3. Governing Refactor Principle

> **Task 6.2 changes where product surfaces are composed, not what DayFrame believes.**

The task is successful only if application structure becomes clearer while domain behavior remains effectively identical.

---

# 4. Governing Ownership Principle

Surface extraction must not create duplicate owners for:

* Setup draft;
* Goal draft;
* Measurement draft;
* Observation draft;
* manual-event draft;
* selected Goal;
* Preview;
* friction Try/Accept state;
* navigation state;
* recovery state;
* profile state.

If state currently belongs in `DayFrameApp`, it may remain there temporarily.

Do not move state merely because a new component exists.

---

# 5. Governing One-Write-Path Principle

Every existing mutation must still use the same canonical command/write path.

Do not create:

* new Goal writes;
* new Measurement writes;
* new Observation writes;
* new Setup writes;
* new manual-event writes;
* duplicate reporting commands;
* duplicate friction acceptance paths.

Surface extraction must wrap existing application behavior, not fork it.

---

# 6. Governing Loading Principle

Task 5.19 established the current production loading architecture:

```text
Eager
    app shell
    default Planner
    authority bootstrap
    recovery/settings shell

Lazy
    Summary

Vendor
    React runtime
```

Task 6.2 must preserve that architecture unless a small change is mechanically required to create the Today boundary.

Do not undo the Phase 5 bundle work.

---

# 7. Explicit Scope

Implement:

* explicit Planner surface component boundary;
* explicit Today surface component boundary;
* explicit Summary surface boundary normalization if useful;
* top-level Planner / Today / Summary navigation;
* application-level surface selection contract;
* extraction of current Planner composition from `DayFrameApp`;
* preservation of current Planner Plan/Schedule sub-navigation if still needed;
* minimal Today placeholder/foundation content;
* preservation of lazy Summary loading;
* stable focus/navigation behavior;
* stable loading/error behavior;
* bounded application interfaces between shell and surfaces;
* tests proving semantic preservation;
* bundle-budget validation;
* governance.

---

# 8. Explicit Non-Goals

Do not implement:

* canonical current-user-day resolver;
* HistoricalPlan current-day query;
* now;
* next;
* later;
* Today timeline;
* Today outcome reporting;
* Goal context in Today;
* Record Current Value in Today;
* Today friction;
* same-day replanning;
* new schedule review UX;
* Add Commitment convergence;
* Edit Commitment convergence;
* friction convergence;
* manual-event convergence;
* Setup retirement;
* Preview retirement;
* Planner month/calendar redesign;
* Summary redesign;
* new authority;
* schema migration;
* Backup version change;
* router;
* deep linking;
* URL navigation;
* network/sync;
* Recommendation;
* Capacity;
* Planned Allocation;
* adaptation.

---

# 9. Execution Artifact Rules

Before implementation:

1. verify the complete Task 6.2 artifact;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 6.1 result;
   * Task 5.19 result;
   * `DayFrameApp`;
   * current navigation state;
   * current Planner Plan/Schedule mode state;
   * Summary lazy-loader implementation;
   * GoalSection;
   * SetupScreen;
   * PreviewScreen;
   * Settings/Backup shell;
   * profile/recovery composition;
   * app-owned drafts;
   * app-level handlers;
   * surface focus behavior;
   * relevant integration tests;
6. do not modify the immutable Task 6.2 artifact.

Create:

`docs/implementation/phase-6/TASK_6.2_PLANNER_TODAY_SUMMARY_SURFACE_AND_APPLICATION_BOUNDARY_FOUNDATION_RESULT.md`

---

# 10. Initial Source Audit

Before code changes, document:

* exact current top-level navigation model;
* exact current Planner sub-navigation model;
* all state currently owned by `DayFrameApp`;
* all callbacks passed to GoalSection;
* all callbacks passed to SetupScreen;
* all callbacks passed to Preview/Schedule;
* all Summary props/dependencies;
* all Settings/Backup/recovery shell dependencies;
* current lazy Summary import boundary;
* current navigation focus behavior;
* current surface loading fallback;
* current tests that assume component placement.

Do not refactor before understanding the actual dependency graph.

---

# 11. Stop Conditions

Stop and report if:

* extracting Planner requires duplicating Setup draft ownership;
* extracting Planner requires duplicate Goal/Measurement/Observation writes;
* extracting Summary would require changing its projection/query semantics;
* creating Today requires inventing semantic current-day behavior;
* top-level navigation requires a router rewrite;
* Summary lazy loading cannot be preserved;
* authority bootstrap would move behind a lazy UI chunk;
* recovery/startup correctness would depend on loading a secondary surface;
* component extraction would change existing navigation draft-preservation semantics;
* current Plan/Schedule state cannot be preserved without semantic changes;
* bundle budgets cannot be preserved without reopening Task 5.19 architecture.

Do not widen scope around a stop condition.

---

# 12. Target Application Shape

The resulting application should trend toward:

```text
DayFrameApp
    ├── App shell
    ├── recovery / settings / global controls
    ├── primary navigation
    │
    ├── PlannerSurface
    ├── TodaySurface
    └── SummarySurface
```

This is conceptual.

Use repository-consistent naming and composition.

---

# 13. Planner Surface Boundary

Create a bounded Planner surface component.

Candidate:

```text
PlannerSurface
```

or repository-consistent equivalent.

It should initially compose the **existing Planner behavior** rather than redesign it.

That likely includes:

* current Plan mode;
* current Schedule mode;
* GoalSection;
* SetupScreen;
* Preview generation controls;
* PreviewScreen;
* existing Plan/Schedule sub-navigation;
* existing manual-event/detail workflows;
* existing friction Try/Accept workflows.

Do not change their semantics.

---

# 14. Planner Sub-Navigation Preservation

Task 6.1 recommends future Planner convergence, but Task 6.2 must not perform it.

If current Planner contains:

```text
Plan
Schedule
```

preserve those modes.

The new top-level navigation becomes:

```text
Planner
Today
Summary
```

while Planner may temporarily retain:

```text
Plan
Schedule
```

internally.

This transitional duplication is intentional.

---

# 15. Planner Default State

Preserve current default user journey.

Task 5.19 intentionally left Planner eager/default.

Do not make Today the default surface in 6.2 unless current Roadmap or production behavior explicitly requires it.

Strong default:

> Planner remains default during early migration.

---

# 16. Planner State Ownership

Surface extraction should distinguish:

### Composition ownership

Planner surface renders current Planner pieces.

### State ownership

App-level state may remain in `DayFrameApp` if moving it would risk semantic change.

Do not force state downward purely for component cleanliness.

---

# 17. Planner Prop Contract

Define the smallest explicit interface between `DayFrameApp` and `PlannerSurface`.

Prefer grouped coherent props/contracts where useful.

Avoid passing the entire store or enormous arbitrary app object unless current architecture already uses such a pattern.

Do not invent generic “context” infrastructure merely to reduce prop count.

---

# 18. Planner Callback Preservation

Every callback currently used for:

* Goal actions;
* setup save;
* preview generation;
* manual events;
* suggested fixes;
* PlanDecision acceptance;
* reporting;
* profiles;

must preserve exact behavior.

If callback location changes, semantics must not.

---

# 19. Today Surface Boundary

Create a real bounded Today surface component.

Candidate:

```text
TodaySurface
```

Task 6.2 does **not** authorize its eventual semantic content.

Its purpose is to establish:

* surface boundary;
* navigation;
* loading/focus conventions;
* future application interface.

---

# 20. Today Placeholder Semantics

Today must not fake data.

Do not show:

* current schedule;
* current event;
* now;
* next;
* later;
* “nothing scheduled”;
* “your day is clear”;
* today’s Progress;
* outcome status.

Those require Task 6.3+.

Use bounded truthful placeholder copy such as:

> Today is being prepared as your current-day workspace.

or:

> Today will bring together your current user-day schedule and reporting.

Keep it concise.

---

# 21. Today Product Naming

Use **Today** as the primary navigation label.

Task 6.1 selected:

```text
Planner / Today / Summary
```

Do not label the primary nav:

* Daily Workspace;
* Day;
* Daily;
* Month;
* Review.

Internal component naming may still use `TodaySurface`.

---

# 22. Today Accessibility

Today placeholder requires:

* semantic heading;
* navigation-current state;
* stable focus target.

Do not build temporary decorative UI that will immediately be discarded.

---

# 23. Today Loading Strategy

Since Today is currently tiny, do not automatically lazy-load it.

Task 6.1 identified Today as a **future lazy-boundary candidate once substantial**.

At 6.2:

* evaluate eager vs lazy;
* prefer simplest architecture;
* do not create an unnecessary network chunk for placeholder content.

Document the decision.

---

# 24. Summary Surface Boundary

Preserve the Task 5.19 lazy Summary architecture.

If Summary is already cleanly encapsulated:

* do not refactor for aesthetics.

If helpful, normalize it behind a bounded:

```text
SummarySurface
```

interface while preserving the existing dynamic import.

Do not make Summary eager.

---

# 25. Summary Semantic Preservation

No changes to:

* historical range;
* evaluation cutoff;
* Scheduling Realization;
* Scheduled Outcomes;
* Goal Activity;
* Progress;
* provenance;
* stale-request handling;
* protection states;
* read-only behavior.

Task 6.2 is composition only.

---

# 26. Summary Lazy Preload Preservation

Preserve existing intent-preload behavior established by Task 5.19.

If navigation structure changes the preload trigger:

* wire the same semantic intent trigger to the new Summary navigation control;
* do not preload Summary immediately at startup.

---

# 27. App Shell Boundary

`DayFrameApp` should increasingly own:

* top-level app composition;
* global authority/recovery state;
* global navigation;
* global app-owned drafts;
* cross-surface orchestration.

It should increasingly **not** directly render every leaf control.

Task 6.2 should reduce direct surface markup where safe.

---

# 28. Global Controls

Audit current:

* Backup;
* restore;
* profile;
* settings;
* recovery;
* clear;

placement.

Keep behavior and loading architecture unchanged.

Do not move them into Today or Summary.

---

# 29. Recovery Boundary

Recovery UI must remain reachable regardless of selected product surface.

Do not hide recovery behind Planner/Today/Summary content.

---

# 30. Primary Navigation

Implement explicit top-level navigation:

```text
Planner
Today
Summary
```

Use semantic tabs/buttons/navigation consistent with current app conventions.

---

# 31. Navigation State

Prefer one canonical top-level surface state.

Conceptually:

```text
"planner" | "today" | "summary"
```

or repository-consistent equivalent.

Do not retain a second independent top-level boolean for Summary.

---

# 32. Existing Planner Mode State

Keep current Planner mode state separately:

```text
"plan" | "schedule"
```

if it already exists.

Do not merge it with top-level surface state into brittle mixed values such as:

```text
"planner-plan"
"planner-schedule"
"today"
"summary"
```

unless repository architecture strongly favors that representation.

Prefer orthogonal state.

---

# 33. Navigation Semantics

Expected transitional model:

```text
surface = planner
plannerMode = plan | schedule
```

or:

```text
surface = today
```

or:

```text
surface = summary
```

This keeps Planner internal migration independent from top-level convergence.

---

# 34. Navigation Persistence

Audit whether current surface/mode selection persists across reload.

Preserve current behavior.

Do not add persistent navigation state unless already present.

---

# 35. Navigation Draft Behavior

This is critical.

Determine current behavior when switching:

```text
Planner Plan
    → Planner Schedule
```

or:

```text
Planner
    → Summary
    → Planner
```

Task 6.2 must not inadvertently change draft retention/discard behavior.

Add Today to this behavior deliberately.

---

# 36. Planner Draft Preservation

Audit at least:

* Setup draft;
* Goal edit draft;
* Measurement draft;
* Observation draft;
* manual-event draft.

For each determine what happens today when Planner unmounts or is hidden.

Preserve semantics.

---

# 37. Surface Mounting Strategy

Determine whether inactive surfaces:

* unmount;
* remain mounted hidden;
* are conditionally rendered.

Do not change semantics casually.

If current Summary unmounts/lazy loads and Planner conditionally renders, follow the current pattern.

---

# 38. Today and Drafts

Navigating to Today should behave like navigating away from Planner under the current application model.

Do not invent a special draft-preservation rule solely for Today.

Document exactly what happens.

---

# 39. Surface Return Behavior

Returning to Planner should restore:

* current Planner mode;
* canonical app state;
* drafts according to existing ownership semantics.

Do not reset Planner to Plan mode unless current navigation already does so.

---

# 40. Summary Return Behavior

Preserve current Summary state behavior:

* selected Goal;
* range;
* cutoff;
* expanded detail;

according to current mount/unmount semantics.

Do not intentionally improve/alter it in 6.2.

---

# 41. Focus — Primary Navigation

Top-level navigation must support keyboard use.

When activating:

* Planner;
* Today;
* Summary;

focus behavior should be deterministic.

---

# 42. Focus — Surface Entry

After surface change, focus a stable semantic heading when current product conventions support it.

Do not automatically move focus if current navigation convention intentionally leaves focus on nav control.

Audit existing behavior first.

---

# 43. Focus — Lazy Summary

Preserve existing lazy-load focus behavior.

Do not focus loading fallback and then unexpectedly jump again unless already governed.

---

# 44. Focus — Today

Today placeholder should provide one stable entry heading suitable for later reuse.

---

# 45. Accessibility — Navigation

Primary navigation must communicate:

* current selection;
* accessible names;
* keyboard activation.

Use appropriate semantics:

* navigation + buttons;
* tabs;
* other existing pattern.

Do not introduce an accessibility pattern inconsistent with current app without reason.

---

# 46. Accessibility — Surface Headings

Each surface should have a semantic top-level heading:

* Planner;
* Today;
* Summary.

Avoid duplicate ambiguous `h1` structures if current shell already defines app title hierarchy.

Audit actual document outline.

---

# 47. Accessibility — Loading

Summary lazy loading retains semantic status.

Today placeholder is not a loading state unless it truly represents loading.

Do not call an unimplemented surface “Loading Today…”

---

# 48. Responsive Navigation

Primary navigation must work at:

* desktop;
* narrow desktop;
* tablet;
* mobile.

Do not assume all three labels fit indefinitely.

At current three-item scope, prefer straightforward wrapping/stacking over introducing hamburger navigation unless existing app already has one.

---

# 49. Mobile Planner

Task 6.2 must not redesign Planner for mobile.

Only ensure surface extraction does not regress current behavior.

---

# 50. Mobile Today

Placeholder should fit naturally.

Do not design the final mobile Today workspace yet.

---

# 51. Mobile Summary

Preserve Task 5.18/5.19 behavior.

---

# 52. URL/Router Boundary

Do not introduce React Router or URL-based navigation.

Current product architecture does not require it for 6.2.

If current app already uses URLs for anything, preserve existing behavior.

---

# 53. Surface Deep Linking

Deferred.

Do not add:

* `?surface=today`;
* hash routing;
* Goal deep links;
* selected-day deep links.

---

# 54. Planner Naming

Use **Planner** as top-level surface label.

Task 6.1 explicitly rejected “Monthly Planner” as a primary architectural label.

Month remains a future Planner view.

---

# 55. Summary Naming

Preserve **Summary**.

---

# 56. Existing Plan Terminology

Planner may temporarily contain a subsection/tab named **Plan**.

That is acceptable during migration.

Do not rename it in Task 6.2 unless required to avoid duplicate navigation ambiguity.

If ambiguity becomes severe:

* make the smallest wording adjustment;
* document it as a deviation.

---

# 57. Existing Schedule Terminology

Preserve current Schedule submode.

Task 6.6 will own Planner schedule-review convergence.

---

# 58. No Setup Renaming

Do not rename Setup yet.

Task 6.1 explicitly says Setup retirement is incremental and parity-gated.

---

# 59. No Preview Renaming

Do not rename Preview yet except if a tiny heading adjustment is mechanically necessary to fit surface composition.

Task 6.6 owns Review Schedule convergence.

---

# 60. State Typing

Introduce explicit surface-state types where helpful.

Prefer:

```text
type PrimarySurface =
  | "planner"
  | "today"
  | "summary"
```

or equivalent.

Avoid magic strings scattered across components.

---

# 61. Application Surface Contract

Consider a bounded interface for navigation callbacks:

```text
onNavigate(surface)
```

or existing equivalent.

Do not add event-bus infrastructure.

---

# 62. Cross-Surface Navigation

Task 6.2 does not need new Goal-specific handoffs.

Only primary navigation is required.

Existing Summary → Planner handoffs should continue to work.

If they currently target generic Planner, preserve that behavior.

---

# 63. Summary Handoff Update

If existing Summary navigation callback currently toggles a Planner/Summary boolean:

update it to the new top-level surface contract.

Do not change destination semantics.

---

# 64. Planner Handoff Preservation

Any existing action that returns user to Planner must continue to do so.

Do not route to Today automatically.

---

# 65. Settings/Recovery Navigation

If Settings/Backup is not a primary surface, preserve its current access pattern.

Do not force it into Planner/Today/Summary.

---

# 66. Store Singleton

Dynamic/structural extraction must continue to use one canonical DayFrame store instance.

No surface may create its own store.

Mandatory regression.

---

# 67. Authority Bootstrap

All durable authorities initialize independently of surface rendering.

Planner/Today/Summary extraction must not gate:

* Goal;
* Measurement Definition;
* Observation;
* HistoricalPlan;
* ExecutionHistory;
* restore/recovery;

behind the active surface.

---

# 68. Preview Ownership

Preview state remains where it currently belongs.

Do not move Preview into a Today-specific state container.

Today does not consume it yet.

---

# 69. HistoricalPlan Boundary

Today placeholder must not query HistoricalPlan yet.

Task 6.3 owns the first Today read semantics.

---

# 70. ExecutionHistory Boundary

Today placeholder must not query ExecutionHistory yet.

---

# 71. Goal Boundary

Today placeholder may not show selected/current Goal context yet.

---

# 72. Measurement Boundary

No Measurement configuration in Today.

---

# 73. Observation Boundary

No Progress reporting in Today.

---

# 74. Summary Progress Boundary

Summary Progress remains unchanged.

---

# 75. Goal Activity Boundary

Summary Goal Activity remains unchanged.

---

# 76. Friction Boundary

Friction remains in current Planner Schedule.

Do not surface it in Today.

---

# 77. Manual Event Boundary

Manual-event workflows remain in current Planner composition.

Do not add Today event creation.

---

# 78. Outcome Reporting Boundary

Existing reporting stays where it currently exists.

Task 6.5 owns Today outcome reporting.

---

# 79. Planner Surface Extraction Strategy

Prefer incremental movement:

1. create Planner surface boundary;
2. move existing Planner render composition;
3. pass existing state/callbacks;
4. keep state owner stable;
5. update tests;
6. verify behavior.

Do not combine extraction with feature rewriting.

---

# 80. Summary Surface Strategy

Prefer minimal touch.

If current lazy component already functions as Summary surface:

* keep it;
* update top-level navigation only.

Do not wrap layers merely to satisfy naming.

---

# 81. Today Surface Strategy

Keep intentionally small.

A future 6.4 will replace placeholder content after 6.3 provides the read model.

Do not overbuild scaffolding that 6.4 will throw away.

---

# 82. Component Placement

Likely production areas:

```text
components/surfaces/
    PlannerSurface
    TodaySurface
```

or repository-consistent equivalent.

Do not impose a new directory hierarchy if existing structure suggests another location.

---

# 83. Prop Growth Risk

PlannerSurface may initially require many props due to app-owned state.

This is acceptable temporarily.

Do not introduce new global context simply to hide prop volume.

Document high prop surface as a discovery if relevant.

Task 6.x later may rationalize orchestration after behavior stabilizes.

---

# 84. DayFrameApp Reduction

Task 6.2 should produce a measurable reduction in direct surface markup inside `DayFrameApp`, but line-count reduction is not a completion criterion.

Correct ownership matters more than file size.

---

# 85. No Premature Hooks Refactor

Do not extract many custom hooks merely because surface components exist.

Only extract logic when required to create a clean boundary without duplication.

---

# 86. Tests — Primary Navigation

Add coverage:

* Planner is default;
* Today can be selected;
* Summary can be selected;
* selected state is semantic;
* switching back restores expected surface.

---

# 87. Tests — Planner Preservation

Representative tests must prove:

* Goal workflow still renders;
* Setup still renders;
* Schedule/Preview still renders;
* Plan/Schedule internal switching still works;
* existing writes remain wired.

Do not duplicate every existing Planner test.

---

# 88. Tests — Today Foundation

Verify:

* Today navigation exists;
* Today surface heading/content is truthful;
* no schedule/now/next claims exist;
* no writes exist;
* no HistoricalPlan/ExecutionHistory query is triggered if deterministically testable.

---

# 89. Tests — Summary Preservation

Verify:

* Summary remains lazy;
* existing Summary content loads;
* Progress still works;
* Goal Activity still works;
* return navigation works.

Representative integration tests are sufficient if detailed Summary suites remain green.

---

# 90. Tests — Summary Lazy Intent

If Task 5.19 has explicit preload tests, adapt them to new Summary nav control.

Do not weaken them.

---

# 91. Tests — Store Singleton

Assert all surfaces consume same canonical app/store state where practical.

---

# 92. Tests — Draft Behavior

Cover current navigation behavior for at least the highest-risk drafts:

* Setup;
* Goal edit;
* Measurement;
* Observation;

where existing tests make this practical.

If drafts intentionally close today when navigating away, preserve that.

Do not invent retention requirements.

---

# 93. Tests — Planner Mode

Top-level surface switching must not corrupt Planner Plan/Schedule submode.

Example:

```text
Planner → Schedule
Summary
Planner
```

Expected mode should match current governed behavior.

---

# 94. Tests — Full Clear

Full clear while:

* Planner;
* Today;
* Summary;

must not leave stale surface data.

Today placeholder should remain safe.

---

# 95. Tests — Restore

Restore continues to refresh canonical authorities regardless of active surface.

No surface-specific cache.

---

# 96. Tests — Protection/Recovery

App-wide protection/recovery UI remains reachable from every top-level surface.

---

# 97. Tests — Accessibility

Verify:

* primary nav accessible names;
* current-state semantics;
* keyboard activation;
* surface heading hierarchy;
* Today placeholder semantics;
* lazy Summary loading semantics.

---

# 98. Tests — Responsive

Verify structure/classes where appropriate.

Manual narrow-screen inspection if available.

Do not create brittle pixel tests.

---

# 99. Bundle Budget

Task 5.19 budgets remain governing:

```text
Initial raw        <= 685,000 bytes
Initial gzip       <= 170,000 bytes
Largest lazy       <= 100,000 bytes
Total JS           <= 750,000 bytes
```

Any >25 kB initial-JS growth requires explicit review.

---

# 100. Bundle Expectations

Task 6.2 should be close to bundle-neutral.

Surface extraction should not materially increase production code.

Today placeholder should be tiny.

Do not add a UI library.

---

# 101. Bundle Validation

Run:

```bash
npm run check:bundle
```

or the canonical Task 5.19 budget command.

Record:

* initial raw;
* initial gzip;
* largest lazy;
* total JS;
* delta from Phase 5 exit.

---

# 102. Lazy Summary Regression

Largest lazy Summary chunk should remain within budget.

If extraction changes chunk assignment materially, explain why.

Do not silently make Summary eager.

---

# 103. Today Chunk Decision

Record:

* eager or lazy;
* why;
* actual byte effect.

Strong expected result:

> Today remains eager because placeholder/surface foundation is tiny; reconsider when Today becomes substantial.

But measure rather than assume.

---

# 104. Manual Product Walkthrough

If interactive browser access is available, inspect:

### Desktop

* startup on Planner;
* Planner Plan;
* Planner Schedule;
* Today;
* Summary lazy transition;
* Planner return;
* Goal/Setup/Preview representative workflows;
* recovery/settings availability.

### Mobile/narrow

* three-item primary nav;
* Planner;
* Today;
* Summary;
* no horizontal navigation overflow;
* surface headings.

If not performed, state explicitly.

---

# 105. Governance

Update:

* Task 6.2 result;
* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` or add an ADR only if Task 6.2 creates a genuinely enduring architectural rule beyond Task 6.1, such as a durable surface composition contract.

Do not create an ADR merely because components were extracted.

---

# 106. Required Result Artifact

Create:

`docs/implementation/phase-6/TASK_6.2_PLANNER_TODAY_SUMMARY_SURFACE_AND_APPLICATION_BOUNDARY_FOUNDATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 6.1 Prerequisite Confirmation
4. Initial Source Audit
5. Files Changed
6. Original Application Composition
7. Resulting Application Composition
8. Primary Surface State
9. Navigation Contract
10. Planner Surface Placement
11. Planner Prop/Application Contract
12. Planner Plan/Schedule Preservation
13. Planner Default Behavior
14. Planner Draft Ownership
15. Goal Workflow Preservation
16. Measurement Workflow Preservation
17. Observation Workflow Preservation
18. Setup Preservation
19. Preview/Schedule Preservation
20. Friction Preservation
21. Manual-Event Preservation
22. Outcome-Reporting Preservation
23. Today Surface Placement
24. Today Placeholder Semantics
25. Today Loading Decision
26. Today Write Boundary
27. Today Authority Boundary
28. Summary Boundary
29. Summary Lazy Preservation
30. Summary Preload Preservation
31. Summary Semantic Preservation
32. Summary Handoff Preservation
33. App-Shell Boundary
34. Recovery Boundary
35. Settings/Backup Boundary
36. Store Singleton
37. Authority Bootstrap
38. Runtime Transaction Boundary
39. Restore Boundary
40. Full-Clear Boundary
41. Navigation Persistence
42. Planner Mode Preservation
43. Surface Mount/Unmount Behavior
44. Draft Preservation/Discard Semantics
45. Focus Behavior
46. Accessibility
47. Responsive Behavior
48. Mobile Navigation
49. Terminology
50. No-Router Boundary
51. No-New-Authority Boundary
52. HistoricalPlan Boundary
53. ExecutionHistory Boundary
54. Goal Boundary
55. Measurement Boundary
56. Observation Boundary
57. Progress Boundary
58. Goal Activity Boundary
59. Bundle Architecture Preservation
60. Today Chunk Decision
61. Bundle Comparison
62. Tests Added/Changed
63. Focused Validation
64. Full Validation
65. Bundle Validation
66. Manual Product Walkthrough
67. Governance Updates
68. ADR Determination
69. Deviations
70. Discoveries
71. Deferred Work
72. Surface Matrix
73. Navigation Matrix
74. State-Ownership Matrix
75. Draft Matrix
76. Loading Matrix
77. Read/Write Matrix
78. Accessibility Matrix
79. Bundle Matrix
80. Product-Boundary Matrix
81. Architectural Invariant Assessment
82. Stop-Condition Assessment
83. Architectural Alignment Assessment
84. Recommended Task 6.3
85. Final Completion Determination

---

# 107. Required Surface Matrix

Produce:

| Surface | Primary question | Current content | Loading | Writes |
| ------- | ---------------- | --------------- | ------- | ------ |
| Planner |                  |                 |         |        |
| Today   |                  |                 |         |        |
| Summary |                  |                 |         |        |

Expected semantic questions:

```text
Planner
    What should my future time look like?

Today
    What should I do with the current user-day?
    (future semantic target; placeholder only in 6.2)

Summary
    What does historical evidence tell me?
```

Be explicit that Today semantics are not yet implemented.

---

# 108. Required Navigation Matrix

Produce:

| State/action          | Top-level surface | Planner mode | Expected result |
| --------------------- | ----------------- | ------------ | --------------- |
| initial load          |                   |              |                 |
| open Planner Plan     |                   |              |                 |
| open Planner Schedule |                   |              |                 |
| open Today            |                   |              |                 |
| open Summary          |                   |              |                 |
| Summary → Planner     |                   |              |                 |
| Today → Planner       |                   |              |                 |
| Planner return        |                   |              |                 |

---

# 109. Required State-Ownership Matrix

Produce:

| State                 | Owner before | Owner after | Changed? |
| --------------------- | ------------ | ----------- | -------: |
| primary navigation    |              |             |          |
| Planner mode          |              |             |          |
| Setup draft           |              |             |          |
| Goal draft            |              |             |          |
| Measurement draft     |              |             |          |
| Observation draft     |              |             |          |
| manual-event draft    |              |             |          |
| Preview               |              |             |          |
| Summary selected Goal |              |             |          |
| Summary range         |              |             |          |
| Summary cutoff        |              |             |          |
| recovery              |              |             |          |

---

# 110. Required Draft Matrix

Produce:

| Draft        | Navigate Planner→Today | Planner→Summary | Return to Planner | Semantics preserved? |
| ------------ | ---------------------- | --------------- | ----------------- | -------------------: |
| Setup        |                        |                 |                   |                      |
| Goal         |                        |                 |                   |                      |
| Measurement  |                        |                 |                   |                      |
| Observation  |                        |                 |                   |                      |
| manual event |                        |                 |                   |                      |

Use actual current behavior.

---

# 111. Required Loading Matrix

Produce:

| Concern              | Planner | Today | Summary |
| -------------------- | ------- | ----- | ------- |
| eager/lazy           |         |       |         |
| fallback             |         |       |         |
| bootstrap dependency |         |       |         |
| authority dependency |         |       |         |
| preload              |         |       |         |

---

# 112. Required Read/Write Matrix

Produce:

| Surface | Reads | Writes |
| ------- | ----- | ------ |
| Planner |       |        |
| Today   |       |        |
| Summary |       |        |

For Today in 6.2 expected:

```text
Reads
    no new semantic authority reads beyond global app readiness

Writes
    none
```

---

# 113. Required Accessibility Matrix

Produce:

| Interaction       | Keyboard | Current-state semantics | Focus result |
| ----------------- | -------- | ----------------------- | ------------ |
| Planner nav       |          |                         |              |
| Today nav         |          |                         |              |
| Summary nav       |          |                         |              |
| Summary lazy load |          |                         |              |
| return to Planner |          |                         |              |

---

# 114. Required Bundle Matrix

Produce:

| Metric       | Phase 5 exit | Task 6.2 | Delta |
| ------------ | -----------: | -------: | ----: |
| Initial raw  |      676,308 |          |       |
| Initial gzip |      168,198 |          |       |
| Largest lazy |       30,091 |          |       |
| Total JS     |      706,399 |          |       |

Use fresh measured values.

---

# 115. Required Product-Boundary Matrix

Produce:

| Capability             | Task 6.2 |
| ---------------------- | -------- |
| Planner surface        |          |
| Today surface boundary |          |
| Today semantics        |          |
| Summary surface        |          |
| primary navigation     |          |
| Planner redesign       |          |
| commitment convergence |          |
| Today read model       |          |
| Today reporting        |          |
| Setup retirement       |          |
| Preview retirement     |          |
| new authority          |          |
| persistence change     |          |
| Backup change          |          |
| router                 |          |
| Recommendation         |          |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited;
* Not applicable.

---

# 116. Architectural Invariants

Assess at minimum:

1. Planner / Today / Summary are explicit top-level product surfaces.
2. Planner remains the default initial surface.
3. Summary remains lazy.
4. Summary intent preload remains governed.
5. Today has a real component boundary.
6. Today does not yet claim current-day schedule semantics.
7. Today contains no fake schedule data.
8. Today performs no domain writes.
9. Today introduces no new authority.
10. primary navigation uses one canonical state.
11. Planner Plan/Schedule remains orthogonal substate.
12. Planner Plan remains functional.
13. Planner Schedule remains functional.
14. Goal authoring remains functional.
15. Measurement configuration remains functional.
16. Observation reporting remains functional.
17. Setup remains functional.
18. Preview generation remains functional.
19. HistoricalPlan publication remains unchanged.
20. friction Try remains unchanged.
21. friction Accept remains unchanged.
22. PlanDecision remains unchanged.
23. manual events remain unchanged.
24. outcome reporting remains unchanged.
25. Summary Planning remains unchanged.
26. Summary Execution remains unchanged.
27. Summary Goal Activity remains unchanged.
28. Summary Progress remains unchanged.
29. Summary provenance remains unchanged.
30. Summary cutoff remains unchanged.
31. Summary range remains unchanged.
32. stale Summary guards remain unchanged.
33. one canonical store exists.
34. one Setup draft owner exists.
35. one Goal write path exists.
36. one Measurement write path exists.
37. one Observation write path exists.
38. one manual-event write path exists.
39. one friction acceptance path exists.
40. authority bootstrap remains eager/global.
41. recovery remains globally available.
42. Settings/Backup remains globally available.
43. restore does not depend on active surface.
44. full clear does not depend on active surface.
45. no DB schema changes.
46. no Backup version changes.
47. no new persistence key.
48. no generic Commitment authority.
49. no Today authority.
50. no current-plan authority.
51. no acceptance authority.
52. no router.
53. no URL/deep-link infrastructure.
54. no current-user-day resolver yet.
55. no now query yet.
56. no next query yet.
57. no later query yet.
58. no Today timeline yet.
59. no Today outcome reporting yet.
60. no Goal context in Today yet.
61. no Goal-value reporting in Today yet.
62. no Today friction yet.
63. no Planner redesign yet.
64. no commitment convergence yet.
65. no Setup retirement yet.
66. no Preview retirement yet.
67. no Capacity.
68. no Planned Allocation.
69. no Recommendation.
70. no adaptation.
71. surface navigation is keyboard accessible.
72. surface current-state semantics are accessible.
73. surface focus behavior is deterministic.
74. mobile primary navigation remains usable.
75. existing draft semantics are preserved.
76. existing surface mount/unmount semantics are preserved.
77. Planner state survives/clears exactly as before where applicable.
78. Summary state survives/clears exactly as before.
79. lazy Summary chunk remains within budget.
80. initial bundle remains within budget.
81. gzip remains within budget.
82. total JS remains within budget.
83. > 25 kB initial growth rule remains governing.
84. bundle warning threshold remains unchanged.
85. no unnecessary runtime dependency is added.
86. canonical validation remains green.
87. Task 6.3 remains the first task authorized to define Today read semantics.

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

# 117. Focused Validation

Run focused suites covering:

* `DayFrameApp`;
* primary navigation;
* Planner composition;
* GoalSection;
* Setup;
* Preview/Schedule;
* Summary lazy loading;
* Summary integration;
* recovery/settings accessibility if navigation restructuring touches shell composition.

Record exact file/test counts.

---

# 118. Full Validation

Before completion run repository-standard validation:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Use actual scripts if names differ.

Record:

* test-file count;
* test count;
* build module count;
* initial raw bytes;
* initial gzip bytes;
* largest lazy chunk;
* total JS;
* diff result.

---

# 119. Manual Product Walkthrough

If interactive browser access is available, perform:

### Planner

* initial startup;
* Plan;
* Goals;
* Measurement;
* Observation reporting;
* Setup;
* Schedule;
* Preview;
* friction.

### Today

* top-level navigation;
* truthful placeholder;
* return navigation.

### Summary

* lazy navigation;
* Progress;
* Activity;
* provenance;
* return navigation.

### Shell

* profiles;
* Backup;
* restore/recovery access.

### Mobile

* primary navigation;
* no horizontal overflow;
* surface headings.

If not performed, state that explicitly.

---

# 120. Governance Updates

On success update:

* Task 6.2 result;
* Phase 6 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Do not mark Today V1 implemented.

Record it as:

> surface/application boundary established; Today semantics deferred to Task 6.3/6.4.

---

# 121. Deferred Work

Explicitly retain:

### Task 6.3

Canonical Today Current-User-Day and Current-Plan Read Model.

### Task 6.4

Read-Only Today V1 Surface.

### Task 6.5

Today Outcome Reporting.

### Task 6.6

Planner Schedule-Review Convergence.

### Task 6.7

Commitment Authoring Convergence.

### Task 6.8

Friction / Manual-Event Cross-Surface Convergence.

### Task 6.9

Goal / Measurement Context in Today.

### Task 6.10

Legacy Setup / Preview Retirement Audit.

### Task 6.11

Phase 6 UX / Accessibility / Bundle Exit.

---

# 122. Recommended Task 6.3

If Task 6.2 completes cleanly:

> **Task 6.3 — Canonical Today Current-User-Day and Current-Plan Read Model.**

Its purpose will be to derive, without new durable authority:

```text
current user-day
    +
effective HistoricalPlan publication
    +
ExecutionHistory overlay
        ↓
Today read model

current
next
later
reported/unreported state
```

Task 6.3 must remain pure/application-level and must not yet build the Today UI.

---

# 123. Completion Criteria

Task 6.2 is complete only when:

* Planner / Today / Summary exist as explicit top-level product surfaces;
* Planner remains the default surface;
* Today exists as a bounded surface without claiming unimplemented scheduling semantics;
* Summary remains lazy-loaded;
* Summary intent preloading remains intact;
* top-level surface selection uses one canonical state contract;
* Planner Plan/Schedule mode remains a separate internal state;
* current Planner functionality is composed inside a bounded Planner surface;
* Goal workflows remain unchanged;
* Measurement workflows remain unchanged;
* Observation-reporting workflows remain unchanged;
* Setup remains unchanged;
* Preview generation remains unchanged;
* automatic HistoricalPlan publication remains unchanged;
* friction Try/Accept remains unchanged;
* manual events remain unchanged;
* outcome reporting remains unchanged;
* Summary historical metrics remain unchanged;
* Summary Goal Activity remains unchanged;
* Summary Progress remains unchanged;
* app-level store ownership remains singular;
* Setup draft ownership remains singular;
* no duplicate write path exists;
* global authority bootstrap remains outside lazy UI surfaces;
* recovery remains globally reachable;
* Backup/settings behavior remains unchanged;
* restore/full clear remain independent of selected surface;
* existing Planner draft navigation semantics are preserved;
* existing Summary state semantics are preserved;
* surface navigation is keyboard accessible;
* active surface state is semantically exposed;
* focus behavior remains deterministic;
* responsive/mobile navigation remains usable;
* no Today current-user-day resolver is introduced;
* no Today timeline is introduced;
* no now/next/later semantics are introduced;
* no Today reporting is introduced;
* no Today Goal context is introduced;
* no Planner information-architecture redesign is introduced;
* no commitment convergence is introduced;
* no Setup/Preview retirement is introduced;
* no new authority is introduced;
* no persistence schema changes occur;
* Backup V6 remains unchanged;
* no router/deep-link system is introduced;
* no Recommendation, Capacity, allocation, or adaptation behavior is introduced;
* bundle budgets remain green;
* > 25 kB initial-growth review rule remains governing;
* full canonical validation passes;
* governance records structural surface convergence without overstating Today functionality;
* Task 6.3 remains the next semantic step.

---

# 124. Final Implementation Principle

> **Task 6.2 should give DayFrame three real places to live without changing what any of those places mean yet.**

Planner should contain the existing planning product.

Summary should remain the existing historical product.

Today should become a legitimate application destination whose meaning can be added deliberately in the next tasks rather than being improvised inside the monolithic app.

---

# 125. Final Completion Statement

**Task 6.2 is complete when DayFrame's application shell explicitly composes Planner, Today, and Summary as three bounded top-level product surfaces; when Planner preserves the existing Plan/Schedule modes and every current Goal, Measurement, Observation, Setup, Preview, manual-event, friction, suggested-fix, PlanDecision, and reporting workflow through the same canonical store, app-owned drafts, and write paths; when Today exists as a truthful structural destination but contains no fabricated current-day schedule, now/next/later interpretation, outcome reporting, Goal context, friction, or other semantics reserved for subsequent tasks; when Summary remains lazy-loaded with its Task 5.19 preload, protection, cutoff, Goal Activity, Progress, provenance, and stale-request behavior intact; when top-level navigation has one explicit accessible state contract while Planner's internal mode remains orthogonal; when app-wide authority bootstrap, recovery, Backup/settings, restore, full clear, and runtime transaction behavior remain independent of surface rendering; when component extraction does not duplicate the store, persistence, draft ownership, or command paths; when existing navigation/draft retention and focus behavior are mechanically preserved; when no router, deep-link system, new authority, schema, persistence key, Backup version, current-plan authority, acceptance authority, generic Commitment authority, Planner redesign, Setup retirement, Preview retirement, Recommendation, Capacity, allocation, adaptation, or Phase 6 semantic feature has leaked into the refactor; when focused and canonical validation are green; when Task 5.19 bundle budgets remain satisfied with any byte changes recorded and the >25 kB initial-growth rule intact; and when the resulting surface/application foundation is clean enough for Task 6.3 to add the canonical current-user-day/current-plan Today read model without reopening application-shell architecture.**
