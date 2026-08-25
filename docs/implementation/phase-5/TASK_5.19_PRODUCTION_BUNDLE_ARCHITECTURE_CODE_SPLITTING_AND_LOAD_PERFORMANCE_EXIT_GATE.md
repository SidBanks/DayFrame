# Task 5.19 — Production Bundle Architecture, Code-Splitting, and Load-Performance Exit Gate

## Status

Ready for audit and implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Production bundle architecture audit, dependency-graph analysis, route/surface code-splitting implementation where justified, lazy-loading boundary design, vendor-chunk evaluation, startup-load optimization, regression testing, bundle-budget establishment, and Phase 5 exit validation.

This task is a **mandatory Phase 5 exit gate**.

**Do not begin Phase 6 until Task 5.19 is complete.**

---

# 1. Context

Phase 5 has now implemented the first complete Goal/Progress product slice:

```text
Goal
    authored intent

Measurement Definition
    authored measurement semantics

Progress Observation
    measured-state evidence

Manual Quantity Progress
    pure derived interpretation

Planner
    Measurement configuration
    Progress reporting/history

Summary
    Progress
    Goal Activity
    provenance
```

Task 5.18 completed the user-facing Summary Progress integration while preserving Goal Activity and all architectural authority boundaries.

Throughout Phase 5, production bundle growth has been intentionally monitored rather than prematurely optimized.

Recorded main-JS progression:

```text
Task 5.14
676.65 kB

Task 5.16
685.30 kB

Task 5.17
698.32 kB

Task 5.18
704.36 kB
```

Task 5.18 gzip size:

```text
174.20 kB
```

The current Vite build still reports the main chunk advisory.

The advisory has remained non-blocking, but the application is now sufficiently feature-complete for Phase 5 that bundle architecture should be addressed against the **real production dependency graph** rather than hypothetical future boundaries.

---

# 2. Purpose

Establish a deliberate production bundle architecture before Phase 6 adds another major wave of functionality.

Task 5.19 must:

1. determine why the current initial chunk is approximately 704 kB;
2. identify the largest production contributors;
3. identify accidental eager imports;
4. identify appropriate lazy-load boundaries;
5. determine whether Planner, Summary, Settings/Backup, or other surfaces should load independently;
6. determine whether vendor chunking improves caching/load behavior;
7. implement justified code splitting;
8. preserve all runtime-authority semantics across lazy boundaries;
9. preserve startup/bootstrap correctness;
10. preserve navigation/focus/loading behavior;
11. measure before/after bundle structure;
12. establish an explicit post-Phase-5 bundle budget or regression guard;
13. leave Phase 5 with a bundle architecture suitable for continued growth.

---

# 3. Governing Performance Principle

> **Optimize user-visible load architecture, not the warning message.**

The objective is not merely:

```text
main chunk < 500 kB
```

The objective is:

* smaller and more intentional initial-load JavaScript;
* sensible surface boundaries;
* useful browser caching;
* bounded future growth;
* no unnecessary eager dependencies;
* no architectural regressions.

---

# 4. Governing Warning Principle

The following does **not** constitute completion:

```ts
build: {
  chunkSizeWarningLimit: 800,
}
```

or any equivalent warning-threshold increase used merely to silence Vite.

Do not raise the warning threshold as the primary fix.

A threshold change may only be considered **after** the production architecture is deliberately optimized and the remaining chunk shape is justified by evidence.

---

# 5. Governing Correctness Principle

> **No performance improvement is valid if it weakens DayFrame's authority, restore, initialization, navigation, or semantic guarantees.**

Code splitting must not alter:

* authority ownership;
* IndexedDB initialization;
* restore behavior;
* subscriptions;
* full clear;
* Preview;
* Planner/Summary semantics;
* Goal/Measurement/Observation/Progress boundaries.

---

# 6. Explicit Scope

Audit and, where justified, implement:

* Vite/Rollup output composition;
* production chunk graph;
* module-size contributors;
* application entrypoint imports;
* navigation/surface imports;
* large third-party dependencies;
* broad/barrel imports;
* eager static imports;
* dynamic import candidates;
* Planner code-splitting;
* Summary code-splitting;
* Settings/Backup code-splitting;
* optional other secondary-surface splitting;
* shared/common chunks;
* vendor chunk strategy;
* lazy component boundaries;
* loading fallback behavior;
* error boundaries where appropriate;
* preloading strategy if justified;
* chunk naming;
* caching implications;
* startup-load measurements;
* canonical production build comparison;
* bundle-budget/regression guard;
* tests;
* governance.

---

# 7. Explicit Non-Goals

Do not:

* redesign Planner;
* redesign Summary;
* change Goal semantics;
* change Measurement Definition semantics;
* change Progress Observation semantics;
* change Progress projection;
* add Phase 6 features;
* add Recommendation;
* add adaptive planning;
* rewrite the application framework;
* migrate away from React/Vite;
* replace Zustand merely for bundle size;
* introduce a router solely for code splitting;
* rewrite CSS architecture unless directly necessary;
* add service workers;
* add SSR;
* add server rendering;
* add CDN infrastructure;
* add telemetry;
* add network analytics;
* aggressively minify identifiers beyond existing production behavior;
* remove user-facing functionality solely to reduce bundle size.

---

# 8. Execution Artifact Rules

Before implementation:

1. verify this complete Task 5.19 artifact;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.18 result;
   * current Vite config;
   * package manifest;
   * application entrypoint;
   * `DayFrameApp`;
   * Planner surface composition;
   * Summary composition;
   * Settings/Backup composition;
   * authority bootstrap;
   * runtime transaction setup;
   * IndexedDB initialization;
   * restore initialization;
   * global providers/state initialization;
   * CSS imports;
   * third-party package imports;
   * production build output;
6. do not modify the immutable Task 5.19 artifact.

Create:

`docs/implementation/phase-5/TASK_5.19_PRODUCTION_BUNDLE_ARCHITECTURE_CODE_SPLITTING_AND_LOAD_PERFORMANCE_EXIT_GATE_RESULT.md`

---

# 9. Initial Baseline

Record the verified pre-task production baseline before changing code.

From Task 5.18:

```text
Main JS
704.36 kB

Gzip
174.20 kB

Modules
109
```

Re-run the production build at the start of Task 5.19 and record the fresh baseline.

If it differs, explain why.

Do not rely only on the prior artifact.

---

# 10. Bundle Analysis Requirement

Perform an actual bundle-composition analysis.

Use an existing compatible build analysis mechanism if present.

If none exists, choose the smallest appropriate analysis approach.

Possible approaches include:

* Rollup/Vite bundle metadata;
* an analyzer plugin used temporarily or as dev-only tooling;
* build manifest inspection;
* module graph inspection;
* esbuild/Rollup output analysis.

Do not add a runtime dependency merely to inspect bundles.

A dev-only analysis dependency is acceptable if justified.

---

# 11. Analyzer Dependency Decision

If adding an analyzer package:

* it must be development-only;
* it must not enter production runtime;
* document why it was chosen;
* document whether it remains after the task.

If analysis can be performed without a new dependency, prefer that.

---

# 12. Required Bundle Inventory

Produce a ranked inventory of the largest production contributors.

At minimum identify:

* application code;
* React/runtime;
* state libraries;
* date/time libraries;
* backup/serialization code;
* IndexedDB code;
* Summary code;
* Planner code;
* test-only packages accidentally entering build, if any;
* other major third-party dependencies.

For each large contributor classify:

* expected;
* avoidable;
* candidate for lazy loading;
* candidate for vendor chunking;
* accidental import;
* no action.

---

# 13. Eager Import Audit

Trace the production entrypoint dependency tree.

Identify which top-level imports force major surfaces into the initial chunk.

At minimum inspect:

```text
entrypoint
    ↓
DayFrameApp
    ↓
Planner
Summary
Settings / Backup
other secondary surfaces
```

Determine whether all are statically imported.

---

# 14. Surface Boundary Audit

Evaluate at least:

### Planner / Plan

Contains:

* Goal authoring;
* Measurement configuration;
* Observation reporting;
* Setup;
* scheduling authoring.

### Summary

Contains:

* historical metrics;
* Goal Activity;
* Progress;
* provenance.

### Settings / Backup

Contains:

* backup;
* restore;
* recovery;
* profiles/settings where applicable.

Determine which surfaces are independently navigable enough to become lazy boundaries.

---

# 15. Preferred Initial Architecture

Evaluate a conceptual shape such as:

```text
Initial shell
    app bootstrap
    navigation
    authority initialization
    shared lightweight UI

Lazy surfaces
    Planner
    Summary
    Settings / Backup
```

This is a candidate, not a requirement.

Actual dependency evidence governs.

---

# 16. Authority Bootstrap Boundary

Critical requirement:

Durable authority initialization must not accidentally become dependent on a lazy-loaded UI surface.

Core bootstrap required for correctness should remain eagerly available where necessary.

Do not move authority initialization into Planner/Summary chunks merely to make the entry chunk smaller.

---

# 17. Runtime Transaction Boundary

Shared runtime-authority infrastructure remains global/core.

Do not duplicate it across lazy chunks.

---

# 18. Restore Boundary

Restore startup/recovery correctness must work even if Settings UI has never loaded.

Separate:

```text
restore engine/runtime
```

from:

```text
Settings / Backup presentation
```

Only presentation may be safely lazy-loaded.

---

# 19. Navigation Boundary

Lazy loading must work with the current navigation architecture.

Do not add a router merely to create dynamic imports.

If current navigation is state-based:

```text
surface === "plan"
surface === "summary"
...
```

use bounded lazy component dispatch if appropriate.

---

# 20. Planner Lazy-Load Assessment

Determine whether Planner should be a dynamic import.

Assess:

* likely first surface;
* application startup default;
* size;
* frequency;
* UX cost of loading;
* shared modules with shell;
* resulting chunk shape.

If Planner is the default first surface, splitting it may or may not improve meaningful startup depending on preloading strategy.

Document.

---

# 21. Summary Lazy-Load Assessment

Summary is a strong candidate because it includes:

* historical projection UI;
* Goal Activity;
* Progress;
* provenance;
* historical query composition.

Evaluate separately.

---

# 22. Settings/Backup Lazy-Load Assessment

Settings/Backup is likely lower-frequency and therefore a strong lazy-loading candidate.

Ensure core Backup/restore authority remains eager only where needed for startup recovery.

---

# 23. Secondary Surface Assessment

Inspect other surfaces such as:

* Schedule;
* setup-only screens;
* dialogs;
* import/export;
* help/about;

where applicable.

Do not over-split trivial components.

---

# 24. Lazy Boundary Quality

A good lazy boundary should generally have:

* meaningful code size;
* infrequent or independent usage;
* low shared-state coupling;
* clear loading affordance;
* stable interface.

Avoid splitting every component.

---

# 25. Avoid Fragmentation

Do not create dozens of tiny chunks.

Excessive fragmentation can:

* increase request overhead;
* hurt caching;
* complicate debugging;
* duplicate shared dependencies.

Prefer a small number of deliberate chunks.

---

# 26. Vendor Chunk Audit

Evaluate whether stable third-party dependencies should be separated from application code.

Potential:

```text
vendor-react
vendor-state
vendor-other
```

But do not mechanically create one chunk per dependency.

The objective is useful cache behavior and predictable chunking.

---

# 27. Manual Chunks

If using Rollup `manualChunks`, justify each rule.

Do not create brittle rules based on arbitrary module paths without tests/build evidence.

---

# 28. Vendor Duplication

Ensure code splitting does not duplicate large dependencies across chunks.

Inspect generated chunks for duplication.

---

# 29. Shared Application Chunk

Common DayFrame domain/state code may reasonably form a shared chunk.

Do not force duplication merely to make individual surface chunks look smaller.

---

# 30. Barrel Import Audit

Inspect broad imports such as:

```ts
import { ... } from "./index"
```

or package barrel imports that may defeat tree-shaking.

Identify any accidental broad import patterns.

Fix only where measured/relevant.

---

# 31. Tree-Shaking Audit

Confirm whether major dependencies are tree-shaken as expected.

Look for:

* CommonJS packages;
* side-effectful imports;
* full-library imports;
* namespace imports;
* accidental polyfills.

---

# 32. Date/Utility Import Audit

If date/time or utility libraries exist, inspect whether full-package imports pull in unnecessary code.

Do not replace a library merely because another library is smaller unless the benefit is material.

---

# 33. CSS Boundary

Determine whether CSS is currently one global bundle.

CSS splitting is optional.

Do not complicate style loading unless production evidence shows a meaningful benefit.

---

# 34. Dynamic Import Implementation

Use standard dynamic imports / `React.lazy` where appropriate.

Example conceptually:

```ts
const SummaryScreen = lazy(() => import("./SummaryScreen"));
```

Do not assume exact names.

---

# 35. Loading Fallback

Every lazy surface requires a stable loading state.

Use product-safe copy such as:

```text
Loading Summary…
Loading Planner…
```

Avoid blank screens or layout collapse.

---

# 36. Loading Accessibility

Lazy-loading states should use semantic status where appropriate.

Do not create noisy repeated live announcements.

---

# 37. Focus During Lazy Navigation

When user changes surface:

* do not focus nonexistent content;
* after lazy surface resolves, preserve existing navigation/focus convention;
* avoid body-focus loss.

Add focused tests if current navigation manages focus.

---

# 38. Lazy Load Failure

Assess whether a chunk-load failure requires a bounded error state.

At minimum, do not allow the whole application to become permanently blank.

Reuse existing application error-boundary conventions if any.

Do not build a large error framework solely for this task.

---

# 39. Preloading

Evaluate whether likely-next surfaces should be preloaded after initial interaction.

Possible:

* preload Summary after Planner becomes idle;
* preload Planner if Summary is default;
* preload Settings only on intent/hover.

Do not preload everything immediately, which would defeat code splitting.

---

# 40. Intent-Based Preload

If implemented, prefer bounded signals such as:

* navigation focus;
* hover;
* idle time;

only if current architecture supports them simply.

Do not introduce complex scheduling.

---

# 41. Initial Surface

Determine the actual default first surface.

Optimize around real product startup, not theoretical navigation.

Document:

* what loads eagerly;
* what loads after first navigation.

---

# 42. First-Load Measurement

Measure the built initial JS actually required for startup.

Do not evaluate success solely by looking at the largest generated chunk.

Record:

* initial entry chunk;
* eagerly imported shared/vendor chunks;
* total initial JS;
* gzip total where possible.

---

# 43. Lazy Surface Measurement

Record chunk sizes for major lazy surfaces.

At minimum:

* Planner;
* Summary;
* Settings/Backup;

if split.

---

# 44. Total Build Size

Also record total emitted JavaScript.

Code splitting may redistribute bytes without reducing total size.

That is not inherently failure.

Compare:

```text
initial-load JS
total JS
largest chunk
```

separately.

---

# 45. Primary Performance Metric

Preferred primary metric:

> **Total JavaScript required before the default initial surface is usable.**

Secondary metrics:

* largest chunk;
* gzip;
* total emitted JS;
* secondary-surface load.

---

# 46. Success Criteria Philosophy

A successful result might look like:

```text
before
main: 704 kB

after
entry/shared: materially smaller
Planner: separate
Summary: separate
Settings: separate
```

even if total emitted JS remains near or slightly above the original size.

Do not declare failure merely because total bytes did not dramatically shrink.

---

# 47. Bundle Budget

Establish an explicit post-task budget.

The final budget should be evidence-based after code splitting.

At minimum define:

### Initial-load JS budget

### Largest lazy surface chunk review threshold

### Unexpected growth threshold

Possible conceptual example:

```text
Initial load
    target <= 500 kB uncompressed

Any single lazy chunk
    review if > 400–500 kB

Task-to-task unexpected growth
    investigate if > 50 kB
```

Do not blindly use these example numbers.

Set budgets from actual optimized output.

---

# 48. Regression Guard

Determine whether bundle size can be checked automatically.

Options:

### A. build script emitting/checking manifest sizes

### B. lightweight CI script

### C. documented manual Phase checkpoint

Prefer an automated guard if it can be added simply and reliably.

---

# 49. Automated Budget Failure

If a bundle budget script is implemented:

* it should fail clearly;
* distinguish initial-load budget from total build size;
* not require a browser;
* use deterministic build output.

Avoid fragile parsing.

---

# 50. Package Script

Potential:

```text
npm run check:bundle
```

or repository-consistent equivalent.

Only add if useful.

---

# 51. CI Boundary

Do not introduce a new CI provider.

If repository already has CI, integrate only if straightforward.

Otherwise local canonical validation is sufficient for this task.

---

# 52. Build Warning

After optimization, reassess Vite's 500 kB advisory.

If no production chunk exceeds the threshold, leave default untouched.

If one deliberate lazy/vendor chunk remains above 500 kB but initial architecture is healthy:

* document why;
* decide whether warning configuration should remain;
* do not casually suppress it.

Strong preference: keep the warning unless noisy without actionable value.

---

# 53. No Semantic Changes

Code-splitting diffs should avoid unrelated product changes.

Do not opportunistically rewrite:

* Goal UI;
* Summary copy;
* Progress formatting;
* scheduling;
* authority APIs.

---

# 54. No State Duplication

Lazy components must consume the same store/runtime authority.

Do not create local duplicate stores per chunk.

---

# 55. Zustand Boundary

Confirm Zustand store is singleton across dynamic chunks.

Add regression if chunk architecture could accidentally instantiate duplicate modules.

---

# 56. IndexedDB Boundary

Lazy UI does not create extra DB instances or migrations.

---

# 57. Backup/Restore Boundary

Dynamic Settings chunk must not affect:

* Backup version;
* Backup validation;
* startup recovery;
* restore journal;
* full clear.

---

# 58. Summary Boundary

Summary lazy loading must preserve:

* shared cutoff;
* Goal selection;
* Goal Activity;
* Progress;
* provenance;
* stale guards.

---

# 59. Planner Boundary

Planner lazy loading must preserve:

* Goal editing;
* Measurement configuration;
* Observation reporting;
* Setup;
* drafts;
* subscriptions;
* focus.

---

# 60. Surface State Persistence

Navigating away and back should follow current product semantics.

Code splitting must not unexpectedly reset state that previously remained in memory.

Audit whether components currently unmount on navigation.

Do not change semantics accidentally.

---

# 61. Lazy Component Remount

If navigation already unmounts inactive surfaces, no semantic change.

If surfaces remain mounted today and lazy composition would unmount them, stop and assess.

Do not introduce draft loss inadvertently.

---

# 62. Draft Preservation

Critical Planner regression:

* Goal edit draft;
* Measurement draft;
* Observation draft;
* Setup draft;

must retain or discard exactly according to current navigation semantics.

---

# 63. Summary Selection Preservation

Selected Goal/range state must retain current behavior across navigation.

---

# 64. Global Error Boundary

Inspect whether dynamic imports interact with current error handling.

Do not add a global reset mechanism unless necessary.

---

# 65. Development Behavior

Lazy loading should remain understandable in development.

No special production-only architecture that behaves radically differently without reason.

---

# 66. Test Environment

React lazy/dynamic imports may affect tests.

Update test utilities narrowly.

Do not globally disable lazy behavior in tests unless necessary and documented.

---

# 67. Suspense Tests

Add tests for:

* loading fallback;
* resolved surface;
* navigation between lazy surfaces.

Use appropriate async test helpers.

---

# 68. Chunk Naming

Use stable readable chunk names where feasible.

Examples conceptually:

```text
planner
summary
settings
vendor-react
shared
```

Do not require exact names if Rollup produces appropriate stable names.

---

# 69. Cache Stability

Evaluate whether application edits invalidate vendor chunks unnecessarily.

A useful vendor split can improve repeat-load caching.

Do not overfit chunk names solely for theoretical caching.

---

# 70. Source Maps

Do not alter production source-map policy solely for bundle size unless source maps are accidentally bundled into runtime payload.

---

# 71. Compression

Record Vite-reported gzip where available.

Do not add runtime compression infrastructure.

---

# 72. Network Simulation

If browser tooling is unavailable, do not invent network performance numbers.

If browser tooling is available, optional bounded checks may include:

* cold-load waterfall;
* slow 4G simulation;
* chunk request timing.

Document exact methodology.

---

# 73. Manual Product Walkthrough

After code splitting, perform an interactive walkthrough if available.

At minimum:

### Startup

* default surface loads;
* no blank state;
* authority readiness works.

### Planner

* Goal;
* Measurement;
* reporting;
* Setup.

### Summary

* Goal Progress;
* Activity;
* provenance.

### Settings / Backup

* open surface;
* export/restore UI loads;
* no startup-recovery dependency on UI chunk.

### Navigation

* switch repeatedly among surfaces;
* loading states;
* focus;
* no lost drafts beyond existing semantics.

If no browser is available, say so.

---

# 74. Required Before/After Matrix

Produce:

| Metric           | Before | After | Change |
| ---------------- | -----: | ----: | -----: |
| Main/entry chunk |        |       |        |
| Initial-load JS  |        |       |        |
| Initial gzip     |        |       |        |
| Largest chunk    |        |       |        |
| Planner chunk    |        |       |        |
| Summary chunk    |        |       |        |
| Settings chunk   |        |       |        |
| Total emitted JS |        |       |        |
| Build modules    |        |       |        |

Use N/A where a chunk does not exist.

---

# 75. Required Contributor Matrix

Produce:

| Contributor                  | Approx size | Eager/lazy | Action |
| ---------------------------- | ----------: | ---------- | ------ |
| React/runtime                |             |            |        |
| Planner                      |             |            |        |
| Summary                      |             |            |        |
| Settings/Backup              |             |            |        |
| authority/state              |             |            |        |
| major third-party dependency |             |            |        |
| other                        |             |            |        |

---

# 76. Required Surface Matrix

Produce:

| Surface         | Before | After | Loading strategy | Rationale |
| --------------- | ------ | ----- | ---------------- | --------- |
| App shell       |        |       |                  |           |
| Planner         |        |       |                  |           |
| Summary         |        |       |                  |           |
| Settings/Backup |        |       |                  |           |
| other           |        |       |                  |           |

---

# 77. Required Shared-Code Matrix

Produce:

| Module family       | Shared? | Eager? | Rationale |
| ------------------- | ------: | -----: | --------- |
| authority bootstrap |         |        |           |
| state/store         |         |        |           |
| domain types        |         |        |           |
| restore engine      |         |        |           |
| navigation          |         |        |           |
| common UI           |         |        |           |
| progress projection |         |        |           |

---

# 78. Required Vendor Matrix

Produce:

| Dependency           | Size significance | Dedicated chunk? | Reason |
| -------------------- | ----------------- | ---------------: | ------ |
| React                |                   |                  |        |
| ReactDOM             |                   |                  |        |
| Zustand              |                   |                  |        |
| other major packages |                   |                  |        |

---

# 79. Required Lazy-Load UX Matrix

Produce:

| Surface  | Loading copy | Focus behavior | Error behavior |
| -------- | ------------ | -------------- | -------------- |
| Planner  |              |                |                |
| Summary  |              |                |                |
| Settings |              |                |                |

---

# 80. Required State-Preservation Matrix

Produce:

| State                 | Before navigation behavior | After splitting | Preserved? |
| --------------------- | -------------------------- | --------------- | ---------: |
| Setup draft           |                            |                 |            |
| Goal draft            |                            |                 |            |
| Measurement draft     |                            |                 |            |
| Observation draft     |                            |                 |            |
| Summary selected Goal |                            |                 |            |
| Summary range         |                            |                 |            |
| Summary cutoff        |                            |                 |            |

---

# 81. Required Bundle-Budget Matrix

Produce:

| Budget                    | Threshold | Enforcement |
| ------------------------- | --------: | ----------- |
| Initial-load JS           |           |             |
| Initial gzip              |           |             |
| Largest lazy chunk        |           |             |
| Unexpected task growth    |           |             |
| Total JS review threshold |           |             |

---

# 82. Required Product-Boundary Matrix

Produce:

| Concern               | Task 5.19 |
| --------------------- | --------- |
| Bundle audit          |           |
| Code splitting        |           |
| Lazy surfaces         |           |
| Vendor chunks         |           |
| Load fallbacks        |           |
| Budget guard          |           |
| Planner semantics     |           |
| Summary semantics     |           |
| Authority semantics   |           |
| Progress semantics    |           |
| Phase 6 functionality |           |
| Recommendation        |           |
| Adaptation            |           |

Use:

* Implemented;
* Preserved;
* Deferred;
* Prohibited;
* Not needed.

---

# 83. Required Risk Matrix

Produce:

| Risk                                 | Before mitigation | Mitigation | Result |
| ------------------------------------ | ----------------- | ---------- | ------ |
| duplicate store instance             |                   |            |        |
| lost drafts                          |                   |            |        |
| startup authority delay              |                   |            |        |
| restore dependency on Settings chunk |                   |            |        |
| stale Summary state                  |                   |            |        |
| chunk load failure                   |                   |            |        |
| over-fragmentation                   |                   |            |        |
| dependency duplication               |                   |            |        |
| warning-only fix                     |                   |            |        |

---

# 84. Stop Conditions

Stop and report before implementation if:

* bundle analysis cannot identify meaningful contributors;
* code splitting would require a router rewrite;
* lazy boundaries would duplicate the application store;
* lazy loading would alter authority bootstrap;
* restore startup would depend on loading Settings UI;
* Planner splitting would destroy drafts under current navigation semantics;
* Summary splitting would alter cutoff/selection semantics;
* Vite/Rollup cannot produce stable boundaries without brittle configuration;
* optimization would require removing features;
* achieving warning-threshold compliance would require harmful fragmentation;
* the only available “fix” is raising `chunkSizeWarningLimit`;
* a new runtime dependency larger than the savings would be required;
* bundle analysis shows the current architecture is already optimal and the warning is primarily an artifact of deliberate shared code.

If the last condition occurs, document it and establish a justified budget rather than forcing code splitting.

---

# 85. Implementation Decision Categories

For each candidate optimization classify:

* **Implement**
* **Do not implement**
* **Defer**
* **Not applicable**

Candidate optimizations:

1. Planner lazy loading.
2. Summary lazy loading.
3. Settings lazy loading.
4. vendor chunk.
5. shared application chunk.
6. barrel-import cleanup.
7. dependency import narrowing.
8. intent preload.
9. bundle-budget script.
10. warning-threshold change.

---

# 86. Expected Preferred Outcome

A healthy likely result might be:

```text
Initial shell/shared
    authority bootstrap
    store
    navigation
    lightweight common UI

Planner
    lazy or intentionally eager

Summary
    lazy

Settings/Backup
    lazy

Stable vendor/shared chunks
```

But the audit may produce a different architecture.

Do not force this diagram if measurements disagree.

---

# 87. No Mandatory 500 kB Target

Getting every chunk below Vite's default 500 kB threshold is desirable but not the governing success condition.

A deliberately isolated lazy chunk above 500 kB may be acceptable if:

* it is not required for initial load;
* its contents are justified;
* it does not duplicate dependencies;
* its user experience is acceptable;
* the result is documented.

---

# 88. Initial-Load Target

The task must propose and meet a meaningful initial-load target based on the baseline analysis.

If no meaningful reduction is achievable without semantic harm, document why.

---

# 89. Bundle Growth Guard

At Phase 5 exit, establish a rule for Phase 6 onward.

Recommended conceptual policy:

> Any future task that increases initial-load JavaScript by more than an agreed threshold must explain the increase.

Determine the actual threshold from the optimized architecture.

---

# 90. Governance Budget

Record the accepted budget in an appropriate durable governance artifact.

Possible:

* architecture decision;
* development standards;
* `CURRENT_STATE`;
* build-performance document.

Do not bury it only in Task 5.19 result.

---

# 91. ADR Determination

Create an ADR only if Task 5.19 establishes an enduring architectural decision such as:

* surface lazy-loading boundaries;
* vendor chunk policy;
* production bundle budget.

Possible ADR:

> **ADR — Production Surface Loading and Bundle Budget Architecture**

If decisions are routine Vite implementation details, an ADR may be unnecessary.

---

# 92. Tests — Navigation

Cover lazy navigation among the implemented surfaces.

---

# 93. Tests — Planner

Verify all major Planner flows still mount and function after lazy loading.

Use representative integration tests rather than duplicating every existing feature test.

---

# 94. Tests — Summary

Verify Progress/Activity Summary mounts after lazy loading with existing state.

---

# 95. Tests — Settings

Verify Settings/Backup surface loads and canonical actions remain wired.

---

# 96. Tests — Store Singleton

Where feasible, assert that surface navigation reads/writes the same canonical store.

---

# 97. Tests — Authority Bootstrap

Verify app initialization/readiness does not wait incorrectly on lazy UI code.

---

# 98. Tests — Restore Startup

If startup-recovery tests exist, keep them green unchanged.

---

# 99. Tests — Draft Preservation

If navigation preserves drafts today, assert preservation.

If it intentionally clears them today, assert unchanged behavior.

---

# 100. Tests — Summary State

Goal selection/range/cutoff behavior remains unchanged.

---

# 101. Tests — Loading Fallback

Verify correct fallback while lazy surface promise is unresolved.

---

# 102. Tests — Chunk Failure

Only add if the current error-boundary architecture supports deterministic testing without excessive scaffolding.

---

# 103. Focused Validation

Run focused suites covering:

* `DayFrameApp` navigation;
* lazy surface loading;
* Planner integration;
* Summary integration;
* Settings/Backup;
* authority bootstrap;
* restore/startup recovery;
* draft/navigation semantics.

Record exact file/test counts.

---

# 104. Full Validation

Before completion run:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
git diff --check
```

Use actual available scripts.

Also run any new bundle-budget command.

Record:

* test files;
* test count;
* module count;
* all production chunks;
* initial-load JS;
* initial gzip;
* total emitted JS;
* budget check.

---

# 105. Build Comparison

Do not report only:

> Vite advisory disappeared.

Report actual bundle changes.

---

# 106. Performance Claim Boundary

Do not claim:

* faster startup;
* improved FCP;
* better LCP;
* faster interaction;

unless actually measured with an appropriate browser/performance method.

It is acceptable to claim:

* reduced initial JavaScript;
* separated chunks;
* improved cache boundaries;

from build evidence alone.

---

# 107. Manual Walkthrough

If interactive browser is available, verify navigation/loading and representative flows after splitting.

If not, explicitly state no manual walkthrough.

---

# 108. Likely Files

Potential areas include:

```text
vite.config.*
package.json
application entrypoint
DayFrameApp
surface component boundaries
lazy-loading fallback
tests
bundle-check script
governance
```

Do not assume exact files before audit.

---

# 109. Governance Updates

On completion update:

* Task 5.19 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Update:

* `DECISIONS.md`;
* ADR;

only if warranted by enduring bundle architecture decisions.

Record the final Phase 5 bundle budget somewhere durable.

---

# 110. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.19_PRODUCTION_BUNDLE_ARCHITECTURE_CODE_SPLITTING_AND_LOAD_PERFORMANCE_EXIT_GATE_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.18 Prerequisite Confirmation
4. Initial Baseline
5. Analysis Method
6. Files Reviewed
7. Package/Dependency Audit
8. Entry Dependency Graph
9. Largest Bundle Contributors
10. Eager Import Findings
11. Surface Boundary Assessment
12. Planner Assessment
13. Summary Assessment
14. Settings/Backup Assessment
15. Secondary Surface Assessment
16. Authority Bootstrap Boundary
17. Restore Boundary
18. Runtime Transaction Boundary
19. Navigation Boundary
20. Lazy-Loading Decisions
21. Vendor Chunk Decisions
22. Shared-Code Decisions
23. Barrel/Tree-Shaking Findings
24. Dependency Import Findings
25. CSS Assessment
26. Dynamic Import Implementation
27. Suspense/Loading UX
28. Lazy Failure Handling
29. Preloading Decision
30. Initial Surface Strategy
31. Store Singleton Preservation
32. Draft Preservation
33. Summary State Preservation
34. Restore/Startup Preservation
35. Planner Semantic Preservation
36. Summary Semantic Preservation
37. Settings Semantic Preservation
38. Files Changed
39. Before/After Bundle Inventory
40. Initial-Load JS
41. Initial Gzip
42. Largest Chunk
43. Lazy Surface Chunks
44. Vendor/Shared Chunks
45. Total Emitted JS
46. Cache-Boundary Assessment
47. Vite Warning Result
48. Bundle Budget
49. Budget Enforcement
50. Growth Guard
51. Accessibility/Focus
52. Loading-State Behavior
53. Tests Added/Changed
54. Focused Validation
55. Full Validation
56. Bundle Validation
57. Manual Product Walkthrough
58. Performance Claim Boundary
59. Governance Updates
60. ADR Determination
61. Deviations
62. Discoveries
63. Deferred Work
64. Before/After Matrix
65. Contributor Matrix
66. Surface Matrix
67. Shared-Code Matrix
68. Vendor Matrix
69. Lazy-Load UX Matrix
70. State-Preservation Matrix
71. Bundle-Budget Matrix
72. Product-Boundary Matrix
73. Risk Matrix
74. Architectural Invariant Assessment
75. Stop-Condition Assessment
76. Architectural Alignment Assessment
77. Phase 5 Exit Assessment
78. Recommended Next Task
79. Final Completion Determination

---

# 111. Architectural Invariants

Assess at minimum:

1. bundle optimization targets load architecture, not warnings.
2. warning threshold is not used as the primary fix.
3. initial bundle baseline is measured before changes.
4. contributors are measured rather than guessed.
5. lazy boundaries correspond to meaningful product surfaces.
6. authority bootstrap remains correct.
7. restore startup remains independent of Settings UI.
8. runtime authority transaction remains shared.
9. Zustand remains one canonical store instance.
10. no duplicate store is created by chunks.
11. IndexedDB authority remains shared.
12. no new DB migration is introduced for splitting.
13. Planner semantics remain unchanged.
14. Summary semantics remain unchanged.
15. Settings/Backup semantics remain unchanged.
16. Goal semantics remain unchanged.
17. Measurement Definition semantics remain unchanged.
18. Progress Observation semantics remain unchanged.
19. Progress semantics remain unchanged.
20. Goal Activity semantics remain unchanged.
21. Schedule/Preview semantics remain unchanged.
22. Backup V6 remains unchanged.
23. no Phase 6 functionality is introduced.
24. code splitting does not create new authority.
25. code splitting does not create new persistence.
26. lazy surfaces have explicit loading states.
27. lazy loading remains keyboard accessible.
28. navigation focus remains valid.
29. draft behavior across navigation is preserved.
30. Summary Goal selection behavior is preserved.
31. Summary range behavior is preserved.
32. Summary cutoff behavior is preserved.
33. startup readiness does not regress.
34. restore recovery does not regress.
35. full clear does not regress.
36. lazy boundaries do not cause stale subscriptions.
37. no router is introduced solely for splitting.
38. over-fragmentation is avoided.
39. dependency duplication is measured.
40. vendor chunking is evidence-based.
41. shared application chunks are evidence-based.
42. tree-shaking issues are corrected where material.
43. broad imports are narrowed only where useful.
44. no runtime analyzer dependency is added.
45. analyzer tooling is dev-only if added.
46. CSS changes are bounded.
47. total emitted JS is measured separately from initial JS.
48. initial-load JS is the primary bundle metric.
49. gzip is recorded.
50. largest chunk is recorded.
51. each lazy surface chunk is recorded.
52. cache boundaries are documented.
53. Vite warning result is documented.
54. bundle budget is explicit.
55. budget is recorded outside the task result.
56. growth guard applies to future Phase 6 work.
57. automated enforcement exists if practical.
58. automated budget parser is deterministic if added.
59. no performance claims exceed measurements.
60. browser timings are not invented.
61. manual walkthrough is claimed only if performed.
62. focused tests cover navigation/lazy boundaries.
63. canonical tests remain green.
64. production build remains green.
65. `git diff --check` remains green.
66. bundle check passes if implemented.
67. no unrelated refactor is bundled in.
68. no Recommendation semantics are introduced.
69. no adaptation is introduced.
70. Phase 5 exit is blocked until this task is accepted.

Classify each as:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Not needed;
* Prohibited;
* Blocked.

---

# 112. Phase 5 Exit Criteria

Task 5.19 is not merely another implementation task.

It is the Phase 5 technical exit gate.

Phase 5 may close only when:

* the bundle graph has been measured;
* the principal contributors are known;
* major eager surface coupling has been evaluated;
* justified lazy boundaries have been implemented or explicitly rejected;
* initial-load JavaScript is intentionally structured;
* vendor/shared chunk decisions are evidence-based;
* Planner remains fully functional;
* Summary remains fully functional;
* Settings/Backup remains fully functional;
* authority bootstrap remains correct;
* restore/startup recovery remains correct;
* draft/navigation semantics remain correct;
* accessibility/focus remains correct;
* before/after production bundle metrics are recorded;
* a future bundle budget exists;
* Phase 6 growth guard exists;
* Vite warning behavior is understood rather than ignored;
* no warning threshold has been raised merely to hide the advisory;
* canonical validation is green.

---

# 113. Recommended Next Task

If Task 5.19 passes the exit gate:

> **Close Phase 5 and begin the Phase 6 entry audit/task defined by the Roadmap.**

Do not automatically invent Task 6.1 from this prompt.

The coding agent should report the next Roadmap item exactly as currently governed.

---

# 114. Final Implementation Principle

> **DayFrame should load the code the user needs now, preserve the code and authority it must always know, and defer the rest until the user actually asks for that surface.**

---

# 115. Final Completion Statement

**Task 5.19 is complete when DayFrame's production bundle has been measured at module and surface level against the verified approximately 704.36 kB / 174.20 kB gzip Task 5.18 baseline; when the principal contributors and eager-import paths are known; when Planner, Summary, Settings/Backup, shared authority/bootstrap, restore, vendor, and common-application boundaries have each been explicitly evaluated; when justified surface-level dynamic imports, shared chunks, vendor chunks, import narrowing, or other measured improvements have been implemented without creating excessive fragmentation or duplicate dependencies; when authority bootstrap, Zustand singleton behavior, IndexedDB, restore/startup recovery, runtime transactions, Backup V6, full clear, Planner drafts, Goal/Measurement/Observation workflows, Summary selection/range/cutoff, Goal Activity, Progress, accessibility, focus, and navigation semantics remain unchanged; when every lazy surface has a bounded loading experience and chunk failure behavior is no worse than the prior application; when initial-load JavaScript, initial gzip, largest chunk, lazy-surface chunks, total emitted JavaScript, and cache boundaries are measured separately so code redistribution is not mistaken for byte reduction; when the Vite advisory is resolved where sensible or deliberately documented rather than hidden through an arbitrary warning-threshold increase; when a concrete post-Phase-5 bundle budget and future growth guard are established in durable project governance, with automated enforcement where practical; when focused navigation/lazy-loading tests and the full canonical validation suite are green; when no unmeasured performance claims, router rewrite, authority duplication, persistence change, product redesign, Phase 6 feature, Recommendation, adaptation, or unrelated refactor has been introduced; and when the resulting bundle architecture is judged fit for the next major round of product growth. Only then may Task 5.19 pass the Phase 5 exit gate and Phase 6 begin.**
