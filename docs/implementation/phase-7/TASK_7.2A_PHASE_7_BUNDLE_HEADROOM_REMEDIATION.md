# Task 7.2A — Phase 7 Bundle Headroom Remediation

## Status

Ready for implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

Bounded production-bundle remediation, dead-code and transitional-duplication audit, lazy-boundary review, shared-module deduplication, chunk-ownership cleanup, safe code removal, bundle-guard preservation, regression validation, and governance.

**This task does not add product features, change Planner behavior, redesign architecture, alter authority, raise bundle guards, add dependencies, or begin Task 7.3 contextual authoring.**

---

# 1. Objective

Recover a meaningful amount of production JavaScript headroom before continuing Phase 7 feature implementation.

Task 7.2 completed with:

```text id="7d3wl1"
Initial raw       630,499
Initial gzip      160,954
Largest lazy       51,479
Total JS          749,882
Total JS guard    750,000
Headroom              118
```

All guards passed, but **118 raw bytes is not sufficient engineering headroom for the next implementation slice**.

Task 7.2A should reduce total production JavaScript through evidence-based cleanup while preserving all current product behavior.

Target:

> Recover at least **15 KB raw total-JS headroom**, with **25–30 KB preferred** if achievable through low-risk bounded remediation.

Do not reach the target by threshold inflation.

---

# 2. Governing Remediation Principle

> **Remove duplication and unreachable product code before optimizing working behavior.**

Prioritize:

1. dead production code;
2. transitional duplicate presentation no longer needed;
3. duplicate helpers/logic;
4. avoidable eager ownership;
5. chunk-boundary duplication;
6. safe extraction/reuse.

Do not begin with:

* minification tricks;
* obscure syntax compression;
* brittle code golf;
* architectural rewrites;
* feature removal.

---

# 3. Governing Behavioral Principle

Task 7.2A is **behavior-preserving**.

The production user should not gain or lose intended capability.

The following must remain unchanged:

```text id="l6nb8x"
Planner
    Month
    Plan
    Review Schedule

Today

Summary
```

All current workflows must continue to function.

---

# 4. Governing Guard Principle

The existing guards are fixed:

```text id="fynpvr"
Initial raw   <= 685,000
Initial gzip  <= 170,000
Largest lazy  <= 100,000
Total JS      <= 750,000
```

Task 7.2A exists specifically because the guard is doing its job.

**Do not change any threshold.**

---

# 5. Task 7.2 Prerequisite

Treat Task 7.2 as governing.

Preserve:

* visible Monthly Planner;
* Task 7.1 canonical read model;
* 35/42-cell Month;
* selected-day workspace;
* Planner Month / Plan / Review migration state;
* Month lazy boundary;
* Plan authoring lazy boundary;
* Today lazy boundary;
* Summary lazy boundary;
* exact Commitment/Event identity;
* variable-duration user-day semantics;
* coverage semantics;
* keyboard grid behavior;
* mobile behavior;
* protected/unavailable states;
* existing browser-validated focus/accessibility behavior.

Task 7.2 removed dormant execution-reporting composition from `PreviewScreen` because production never supplied its optional reporting store and Today/Summary now own reporting. Use that as evidence that **transitional production composition is a legitimate remediation target when mechanically proven unreachable or obsolete**.

---

# 6. Explicit Scope

Audit and remediate where mechanically justified:

* dead production imports;
* dead exported helpers;
* unreachable components;
* transitional duplicate Planner presentation;
* obsolete Preview-era composition;
* duplicated Month/Review utilities;
* duplicated date/time helpers;
* duplicated occurrence formatting;
* duplicated coverage formatting;
* duplicated exact-target logic;
* duplicated status/attention formatting;
* duplicated CSS-in-JS or component code if present;
* avoidable eagerly imported code;
* lazy chunk ownership;
* cross-chunk duplication;
* large utility modules imported for tiny functions;
* production-only legacy paths no longer reachable;
* tree-shaking barriers;
* index/barrel exports that pull unintended code;
* safe component consolidation;
* test-only code accidentally entering production;
* source maps/build configuration only if it affects guarded production JS legitimately;
* bundle reporting;
* regression tests;
* governance.

---

# 7. Explicit Non-Goals

Do not implement:

* Task 7.3 contextual authoring;
* new Month features;
* new Planner modes;
* Plan/Review retirement unless a specific dead duplicate is mechanically proven no longer used;
* new UI;
* new persistence;
* new authority;
* scheduler changes;
* recurrence changes;
* Today changes;
* Summary changes;
* Event changes;
* Work redesign;
* Capacity;
* Allocation;
* Recommendations;
* transition adaptation;
* Pattern Library;
* Goal reorientation;
* new runtime dependency;
* new build plugin;
* threshold increase.

---

# 8. Execution Artifact Rules

Before implementation:

1. verify this Task 7.2A artifact;
2. save immutable project copy;
3. record SHA-256;
4. record exact current bundle baseline;
5. review:

   * Task 7.2 result;
   * current build output;
   * bundle-check script;
   * Vite configuration;
   * current chunk graph;
   * Planner composition;
   * Month lazy surface;
   * Plan authoring lazy surface;
   * Today lazy surface;
   * Summary lazy surface;
   * PreviewScreen;
   * shared utilities;
   * barrel/index exports;
6. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-7/TASK_7.2A_PHASE_7_BUNDLE_HEADROOM_REMEDIATION_RESULT.md`

---

# 9. Mandatory Baseline Capture

Before changing code, run:

```bash id="gaofbe"
npm run build
npm run check:bundle
```

Record:

* transformed modules;
* initial raw;
* initial gzip;
* every emitted JS chunk;
* chunk raw size;
* chunk gzip size;
* largest lazy;
* total JS.

Do not rely only on Task 7.2 numbers.

---

# 10. Bundle Graph Audit

Inspect the production chunk graph mechanically.

Identify:

* eager entry chunk(s);
* Month chunk;
* Plan authoring chunk;
* Today UI chunk;
* Today query chunk;
* Summary chunk;
* shared chunks if any;
* duplicated modules across chunks where build tooling reveals them;
* unexpectedly eager modules;
* unexpectedly duplicated modules.

Produce a **Bundle Ownership Map**.

---

# 11. Source-to-Chunk Audit

For the largest relevant modules, determine:

* which chunk owns them;
* why they are included;
* whether they are actually executed on that route;
* whether they are duplicated;
* whether ownership is appropriate.

Do not assume file size alone predicts bundle cost.

---

# 12. Dead-Code Audit

Search production-reachable code for:

* unused exported components;
* obsolete Preview-era controls;
* old execution-reporting composition;
* old navigation modes no longer reachable;
* legacy wrappers replaced by Month/Planner composition;
* unused adapters;
* unused formatting helpers;
* unused feature flags;
* unused branches guarded by constants;
* orphaned UI after Task 7.2.

Every removal must have mechanical reachability evidence.

---

# 13. Transitional Duplication Audit

Phase 7 currently preserves:

```text id="opq3cv"
Month
Plan
Review Schedule
```

because migration is not finished.

Do not remove working transitional surfaces merely for size.

However, identify internal duplicate composition such as:

* the same formatter implemented in Month and Review;
* the same selected-day header logic;
* the same date-label helper;
* the same occurrence summary mapping;
* the same exact-target projection;
* obsolete wrapper components around shared primitives.

Prefer shared pure helpers where this reduces total output.

---

# 14. Barrel Export Audit

Inspect `index.ts` / barrel exports used by production surfaces.

Determine whether any import such as:

```text id="zhhrcw"
import { smallHelper } from "./largeFeature";
```

causes an unintended module subtree to enter a chunk.

If so:

* use narrower imports;
* split pure helpers;
* preserve public architecture;
* avoid creating brittle internal paths without clear benefit.

---

# 15. Tree-Shaking Audit

Identify tree-shaking barriers such as:

* top-level side effects;
* large object registries;
* aggregated exports;
* runtime condition tables;
* modules mixing small pure helpers with large component imports.

Refactor only where safe and mechanically justified.

---

# 16. Lazy Boundary Audit

Verify current lazy ownership:

```text id="okp3aj"
Eager
    application shell
    Planner shell
    recovery/bootstrap

Lazy
    Month
    Plan authoring
    Today
    Today query
    Summary
```

Use actual production graph.

Determine whether any heavy module crosses these boundaries unnecessarily.

---

# 17. Month Chunk Audit

Task 7.2 emitted a Month chunk of approximately:

```text id="l1z1cm"
21,602 raw
6.65 kB gzip
```

Audit:

* whether Task 7.1 query and Month UI are cleanly isolated;
* whether Review Schedule code is duplicated inside;
* whether common helpers should move into a tiny shared module;
* whether moving anything shared would increase total JS instead.

Optimize **total JS**, not one chunk in isolation.

---

# 18. Plan Authoring Chunk Audit

Current Plan authoring is approximately:

```text id="0mw4ic"
51,479 raw
```

Determine:

* whether obsolete duplicate Commitment UI remains;
* whether advanced fields import code unnecessary until opened;
* whether recurrence helpers duplicate other production code;
* whether further nested lazy loading is justified.

Do not split tiny pieces simply to improve numbers.

---

# 19. Review Schedule Audit

Task 7.2 already removed dormant execution-reporting composition from `PreviewScreen`.

Continue auditing for:

* production-inactive legacy paths;
* duplicate selected-day formatting;
* duplicate calendar helpers;
* obsolete Preview terminology wrappers;
* components now superseded but still imported.

Do not remove any workflow still required during strangler migration.

---

# 20. Today Audit

Today must remain functionally unchanged.

Audit only:

* shared helper duplication;
* accidental eager imports;
* dead exports;
* repeated formatting utilities.

Do not move Today behavior into Planner.

---

# 21. Summary Audit

Same rule.

No Summary redesign.

Only bundle ownership/dead-code analysis.

---

# 22. Date/Time Helper Audit

Search for duplicate logic around:

* date-label parsing;
* month shifting;
* weekday labels;
* compact time formatting;
* range formatting;
* duration formatting;
* local date construction.

Reuse existing pure helpers when semantics are truly identical.

Do not unify functions with subtly different canonical meanings.

---

# 23. Occurrence Formatting Audit

Search Month, Review, Today, Summary for duplicate presentation helpers.

Potential:

```text id="3e52u6"
format time
format source label
format duration
format date heading
```

Extract only semantically identical functionality.

Do not create one generic formatter that erases product distinctions.

---

# 24. Exact-Identity Helper Audit

Search for duplicate code that checks:

* template ID/incarnation;
* recurrence ID/incarnation;
* Event ID/incarnation.

If multiple production surfaces have independently reimplemented the same exact comparison, consider a small shared pure helper.

Do not weaken type-specific exactness.

---

# 25. CSS Audit

Inspect production CSS output if included in guard reporting separately.

Task 7.2A is primarily JS headroom remediation.

Do not spend scope optimizing CSS unless:

* duplicate CSS materially causes JS via CSS-in-JS;
* removing dead component code naturally removes associated JS/CSS.

---

# 26. Dependency Audit

List runtime dependencies actually contributing to production JS.

Do not add any dependency.

Identify any existing dependency imported for a trivial operation.

Only replace/remove if:

* repository already has equivalent native/helper functionality;
* behavior is mechanically provable;
* savings are meaningful.

Avoid broad dependency replacement.

---

# 27. Code-Splitting Candidate Audit

Identify only high-value candidates.

A candidate must show:

* meaningful raw-JS recovery;
* clear interaction boundary;
* no authority duplication;
* truthful loading state;
* low complexity.

Reject code splitting that merely moves bytes between chunks while total JS remains unchanged.

---

# 28. Total-JS Priority

The primary target is:

> **Total JS headroom**

Secondary concerns:

* initial raw;
* initial gzip;
* largest lazy.

Do not celebrate moving bytes from eager to lazy if total JS remains at 749,882 and the next feature still cannot fit.

---

# 29. Removal Before Splitting

Preferred remediation order:

```text id="pny7yt"
dead removal
    ↓
deduplication
    ↓
shared helper cleanup
    ↓
tree-shaking fix
    ↓
lazy restructuring
```

Do not begin with chunk gymnastics.

---

# 30. Minimum Target

Task 7.2A should aim for:

```text id="u3de41"
Total JS <= 735,000
```

which yields at least:

```text id="neq5dt"
15,000 bytes headroom
```

Preferred target if naturally achievable:

```text id="l7zh5c"
Total JS <= 725,000
```

Do not compromise architecture to hit the preferred target.

---

# 31. Success Classification

Classify final result:

### Strong success

`>= 25 KB` recovered.

### Acceptable success

`15–25 KB` recovered.

### Marginal success

`5–15 KB` recovered.

Requires explicit justification before 7.3.

### Failure / blocker

`< 5 KB` recovered and no safe additional remediation exists.

Recommend a deeper bundle-architecture task before 7.3.

---

# 32. Behavioral Equivalence

For every removed/refactored path, prove:

* no intended UI disappeared;
* no focus behavior changed;
* no accessibility semantics changed;
* no authority changed;
* no state lifecycle changed;
* no lazy loading became false empty.

Use tests and browser regression where relevant.

---

# 33. No Feature Compression

Do not remove user-visible capability merely because a route is infrequently used.

“Rare” is not “dead.”

---

# 34. No Test-Only Justification

A component being weakly tested does not make it removable.

Production reachability determines deadness.

---

# 35. No Threshold Gaming

Prohibited:

* excluding legitimate chunks from bundle totals;
* changing counting rules;
* disabling guard checks;
* moving code to an uncounted asset type;
* loading production JS from runtime CDN;
* hiding feature code in dynamic string evaluation.

---

# 36. No Compression Gaming

Do not optimize solely for gzip if total raw guard is the bottleneck.

The primary guard remains raw total JS.

---

# 37. No Generated-Code Tricks

Do not introduce:

* minified source files into repository;
* handwritten compressed JS;
* eval-generated code;
* generated runtime function strings.

Maintain normal readable source.

---

# 38. Test-Code Boundary

Ensure test fixtures/helpers are not imported into production accidentally.

If found:

remove the production dependency.

Do not move production helpers into test files merely to reduce bundle size.

---

# 39. Feature Flag Boundary

If dead feature flags remain:

determine whether branches are:

* runtime selectable;
* permanently false;
* obsolete.

Remove only branches mechanically proven obsolete.

---

# 40. Dynamic Import Audit

Inspect dynamic imports for:

* accidental duplicate import paths;
* importing the same feature through two specifiers;
* route chunks that pull shared features twice.

Normalize only where build evidence shows savings.

---

# 41. Shared Chunk Assessment

A shared chunk is acceptable if it reduces total duplication.

Do not create one merely for aesthetic architecture.

Record before/after totals.

---

# 42. Source Map Boundary

Do not count source maps as production JS if the existing guard already excludes them.

Do not alter source-map policy solely to affect metrics.

---

# 43. Build Configuration Boundary

Build configuration changes are permitted only if they:

* preserve semantics;
* preserve guard calculation;
* produce a demonstrably healthier chunk graph;
* do not hide code.

Avoid custom manual chunking unless evidence strongly supports it.

---

# 44. Manual Chunking Stop Condition

If `manualChunks` or equivalent becomes necessary:

stop and document why automatic chunking cannot satisfy architecture.

A build-system policy change may warrant a separate architecture task or ADR.

Do not introduce it casually.

---

# 45. React Composition Audit

Look for wrappers/components that:

* add no behavior;
* only forward props;
* exist solely from old surface structure;
* cause duplicate imports.

Removing a wrapper is valid if behavior, semantics, and focus remain identical.

---

# 46. Reusable Primitive Audit

Potential primitives:

* status message;
* date heading;
* coverage label;
* occurrence row;
* accessible button labels.

Consolidate only if byte-positive and semantically clean.

Do not build a design system during this task.

---

# 47. Planner Mode Registry Audit

Inspect how:

```text id="w6c41i"
Month
Plan
Review Schedule
```

are registered/rendered.

Ensure inactive lazy surfaces do not import their heavy code eagerly through metadata/config objects.

If they do, fix the boundary.

---

# 48. Recovery UI Audit

Recovery/bootstrap must remain eager.

Do not lazily defer critical recovery solely for size.

---

# 49. Error Boundary Audit

Keep necessary error/loading boundaries.

Do not remove safety UI for bytes.

---

# 50. Accessibility Boundary

Do not remove:

* labels;
* descriptions;
* focus utilities;
* status/alert semantics;

for bundle size.

Accessibility is not optional payload.

---

# 51. Browser Regression Scope

At minimum, browser-regress:

### Planner

* Month loads;
* Plan loads;
* Review Schedule loads;
* navigation among all three.

### Month

* grid;
* keyboard;
* selected day;
* lazy load.

### Plan

* Add/Edit Commitment opens.

### Review

* schedule still renders.

### Today

* opens.

### Summary

* opens.

No exhaustive Phase 6 QA repetition is required unless touched code warrants it.

---

# 52. Focus Regression

If any composition/lazy boundary changes:

verify:

* Month load focus;
* Plan lazy load focus;
* Review navigation;
* Today/Summary navigation.

No focus to `body` regression.

---

# 53. Mobile Regression

If shared layout/components change:

verify one narrow viewport, preferably 390px.

No horizontal overflow regression.

---

# 54. Exact-Identity Regression

If shared target helpers change:

run focused exact-incarnation tests.

No stale retargeting.

---

# 55. Time-Semantics Regression

If date/time helpers change:

run:

* canonical user-day;
* Month projection;
* variable boundary;
* before-boundary current-day;
* week-start transition.

No broad semantic consolidation without these tests.

---

# 56. Coverage Regression

If coverage helpers change:

test:

* fresh;
* stale;
* generated-empty;
* uncovered;
* protected/unavailable.

---

# 57. Full Validation

Mandatory:

```bash id="fr42an"
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Record exact results.

---

# 58. Measurement After Each Meaningful Change

After each major remediation candidate:

run:

```bash id="vcm4ze"
npm run build
npm run check:bundle
```

Record deltas.

This prevents late discovery that a refactor merely moved bytes around.

---

# 59. Remediation Ledger

Maintain a ledger:

| Change | Reason | Raw JS delta | Gzip delta | Behavior impact |
| ------ | ------ | -----------: | ---------: | --------------- |

Include attempted changes that were reverted if materially informative.

---

# 60. Revert Negative Optimizations

If a change:

* increases total JS;
* adds complexity;
* provides negligible savings;

revert it unless it has independent correctness value within scope.

Do not retain bundle folklore.

---

# 61. Largest-Lazy Guard

Do not solve total-JS pressure by creating a >100 KB lazy chunk.

All existing guards remain independently meaningful.

---

# 62. Initial-Gzip Guard

Initial gzip still matters.

Do not shift common code eager merely because total improves.

---

# 63. Production Entry Guard

Initial raw remains:

```text id="na8kq6"
<= 685,000
```

Preserve comfortable eager headroom.

---

# 64. Runtime Behavior

No runtime network fetches for code outside normal Vite chunks.

No external scripts.

No CDN workaround.

---

# 65. Persistence Boundary

No persistence changes.

No new localStorage.

No IndexedDB.

No Backup changes.

---

# 66. Authority Boundary

No authority changes.

At minimum preserve:

* Active setup;
* Events;
* Goals;
* Preview;
* PlanDecision;
* HistoricalPlan;
* ExecutionHistory;
* Progress.

---

# 67. Scheduler Boundary

No scheduler changes.

If dead-code audit finds scheduler code duplicated in UI chunks, fix import ownership only.

Do not alter algorithms.

---

# 68. Planner Boundary

Month remains read-only.

Task 7.3 contextual writes remain deferred.

Do not sneak authoring into Month while touching shared components.

---

# 69. Today Boundary

Today remains current-plan execution reporting.

Do not remove code merely because Planner no longer uses it.

---

# 70. Summary Boundary

Summary remains historical interpretation.

Do not fold Summary helpers into Planner unless truly shared and semantically identical.

---

# 71. HistoricalPlan Boundary

No change.

---

# 72. ExecutionHistory Boundary

No change.

---

# 73. Goal Boundary

No change.

---

# 74. Event Boundary

No change.

---

# 75. Work Boundary

No change.

---

# 76. Month Read-Model Boundary

Task 7.1 remains semantic owner.

Do not move read-model logic into UI solely for tree shaking.

---

# 77. Test Coverage

Add tests only where remediation changes behavior boundaries or removes previously tested composition.

Do not add large test scaffolding that accidentally imports production code differently.

---

# 78. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.2A_PHASE_7_BUNDLE_HEADROOM_REMEDIATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 7.2 Prerequisite Confirmation
4. Baseline Build
5. Baseline Bundle Graph
6. Source-to-Chunk Audit
7. Dead-Code Audit
8. Transitional Duplication Audit
9. Barrel Export Audit
10. Tree-Shaking Audit
11. Lazy-Boundary Audit
12. Month Chunk Audit
13. Plan Authoring Chunk Audit
14. Review Schedule Audit
15. Today Audit
16. Summary Audit
17. Date/Time Helper Audit
18. Occurrence Formatting Audit
19. Exact-Identity Helper Audit
20. Runtime Dependency Audit
21. Code-Splitting Candidate Audit
22. Chosen Remediation Strategy
23. Files Changed
24. Removed Production Code
25. Deduplicated Logic
26. Shared Helpers
27. Import-Boundary Changes
28. Lazy-Boundary Changes
29. Build-Config Changes
30. Rejected Candidates
31. Reverted Candidates
32. Behavioral Equivalence
33. Planner Regression
34. Month Regression
35. Plan Regression
36. Review Schedule Regression
37. Today Regression
38. Summary Regression
39. Accessibility Regression
40. Focus Regression
41. Mobile Regression
42. Identity Regression
43. Time-Semantics Regression
44. Coverage Regression
45. Tests Added/Changed
46. Focused Validation
47. Full Validation
48. Final Build
49. Final Bundle
50. Raw JS Recovered
51. Gzip Change
52. Initial-Bundle Change
53. Largest-Lazy Change
54. Runtime Dependency Assessment
55. Persistence Boundary
56. Authority Boundary
57. Scheduler Boundary
58. Governance Updates
59. ADR Determination
60. Deviations
61. Discoveries
62. Deferred Work
63. Remediation Ledger
64. Bundle Ownership Matrix
65. Dead-Code Matrix
66. Duplication Matrix
67. Lazy-Boundary Matrix
68. Bundle Matrix
69. Guard Matrix
70. Product-Boundary Matrix
71. Architectural Invariant Assessment
72. Stop-Condition Assessment
73. Architectural Alignment Assessment
74. Task 7.3 Readiness
75. Recommended Next Task
76. Final Completion Determination

---

# 79. Required Remediation Ledger

| Change | Category | Before contribution | After contribution | Raw delta | Kept/reverted |
| ------ | -------- | ------------------: | -----------------: | --------: | ------------- |

Categories:

* dead removal;
* deduplication;
* import narrowing;
* tree shaking;
* lazy ownership;
* wrapper removal;
* other bounded remediation.

---

# 80. Required Bundle Ownership Matrix

| Chunk | Primary responsibility | Major modules | Appropriate owner? | Action |
| ----- | ---------------------- | ------------- | -----------------: | ------ |

Include:

* eager entry;
* Month;
* Plan authoring;
* Today;
* Today query;
* Summary;
* shared chunks.

---

# 81. Required Dead-Code Matrix

| Candidate | Production reachable? | Evidence | Removed? | Raw delta |
| --------- | --------------------: | -------- | -------: | --------: |

---

# 82. Required Duplication Matrix

| Logic/component | Locations | Semantically identical? | Deduplicated? | Raw delta |
| --------------- | --------- | ----------------------: | ------------: | --------: |

---

# 83. Required Lazy-Boundary Matrix

| Feature | Before | After | Total-JS impact | Loading UX impact |
| ------- | ------ | ----- | --------------: | ----------------- |

---

# 84. Required Bundle Matrix

| Metric         | 7.2 baseline | 7.2A final | Delta |            Guard |
| -------------- | -----------: | ---------: | ----: | ---------------: |
| Initial raw    |      630,499 |            |       |          685,000 |
| Initial gzip   |      160,954 |            |       |          170,000 |
| Month chunk    |       21,602 |            |       | 100,000 lazy max |
| Plan authoring |       51,479 |            |       | 100,000 lazy max |
| Largest lazy   |       51,479 |            |       |          100,000 |
| Total JS       |      749,882 |            |       |          750,000 |

Record all final chunks.

---

# 85. Required Guard Matrix

| Guard        | Fixed threshold | Final | Pass? |
| ------------ | --------------: | ----: | ----: |
| Initial raw  |         685,000 |       |       |
| Initial gzip |         170,000 |       |       |
| Largest lazy |         100,000 |       |       |
| Total JS     |         750,000 |       |       |

---

# 86. Required Product-Boundary Matrix

| Capability             | Task 7.2A                                   |
| ---------------------- | ------------------------------------------- |
| bundle audit           | Implement                                   |
| dead-code removal      | Implement where proven                      |
| deduplication          | Implement where beneficial                  |
| lazy-boundary cleanup  | Implement where justified                   |
| product features       | Prohibited                                  |
| Month writes           | Prohibited                                  |
| Planner migration      | Prohibited except dead internal duplication |
| scheduler changes      | Prohibited                                  |
| authority changes      | Prohibited                                  |
| new runtime dependency | Prohibited                                  |
| threshold changes      | Prohibited                                  |
| build-rule gaming      | Prohibited                                  |

---

# 87. Architectural Invariants

Assess at minimum:

1. product behavior remains unchanged.
2. Month remains visible and functional.
3. Plan remains functional.
4. Review Schedule remains functional.
5. Today remains functional.
6. Summary remains functional.
7. Month remains read-only.
8. Task 7.1 remains Month semantics owner.
9. Planner authority remains unchanged.
10. Preview remains derived.
11. HistoricalPlan remains unchanged.
12. ExecutionHistory remains unchanged.
13. Goals remain unchanged.
14. Events remain unchanged.
15. Work remains unchanged.
16. exact Commitment identity remains unchanged.
17. exact Event identity remains unchanged.
18. stale targets never retarget.
19. variable-duration day semantics remain unchanged.
20. display-week semantics remain unchanged.
21. coverage semantics remain unchanged.
22. generated-empty differs from uncovered.
23. protected differs from empty.
24. keyboard Month remains functional.
25. current/selected semantics remain accessible.
26. focus does not regress.
27. mobile does not regress.
28. no intended user-facing workflow is removed.
29. dead-code removal is mechanically proven.
30. duplicate code is consolidated only when semantics match.
31. shared helpers do not erase domain distinctions.
32. no runtime dependency is added.
33. no calendar library is added.
34. no build plugin is added.
35. no threshold is raised.
36. bundle counting rules remain unchanged.
37. no production code is hidden from guard calculation.
38. no CDN/runtime code fetch is added.
39. no eval/string-code technique is added.
40. source remains readable.
41. no durable state is added.
42. no Backup changes occur.
43. no scheduler algorithm changes.
44. no recurrence changes occur.
45. no Capacity is added.
46. no Allocation is added.
47. no Recommendations are added.
48. no transition adaptation is added.
49. no Pattern Library is added.
50. no Goal reorientation is added.
51. Plan authoring remains lazy.
52. Month remains appropriately lazy.
53. Today remains lazy.
54. Summary remains lazy.
55. recovery remains eager.
56. lazy boundaries duplicate no authority.
57. initial raw remains under guard.
58. initial gzip remains under guard.
59. largest lazy remains under guard.
60. total JS remains under guard.
61. meaningful total-JS headroom is recovered.
62. remediation prioritizes total JS, not cosmetic chunk movement.
63. negative optimizations are reverted.
64. each retained remediation has measured evidence.
65. baseline and final build use same counting methodology.
66. full tests pass.
67. build passes.
68. bundle guard passes.
69. browser regression passes where required.
70. governance records new baseline.
71. Task 7.3 is not implemented early.
72. Task 7.3 can proceed without designing around byte-level desperation.

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

# 88. Stop Conditions

Stop and report if:

* no meaningful safe dead/duplicate production code exists;
* achieving adequate headroom requires removing intended functionality;
* achieving adequate headroom requires threshold changes;
* achieving adequate headroom requires a new runtime dependency;
* achieving adequate headroom requires manual chunking/build policy changes not already governed;
* total-JS improvements require a broad architectural rewrite;
* deduplication would collapse semantically distinct domain behavior;
* lazy restructuring would duplicate authority or create false loading/empty states;
* any remediation changes scheduler/authority semantics.

If safe remediation yields less than 5 KB:

recommend a dedicated deeper bundle architecture task before 7.3.

---

# 89. Focused Validation

Run focused suites for every touched area.

At minimum, if touched:

* Month;
* Planner;
* PreviewScreen;
* Commitment exact identity;
* canonical time;
* coverage;
* Today;
* Summary;
* lazy loading.

Record exact files/test counts.

---

# 90. Full Validation

Run:

```bash id="s8g6ug"
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Record exact:

* test files;
* tests;
* transformed modules;
* initial raw;
* initial gzip;
* all chunks;
* largest lazy;
* total JS;
* raw headroom;
* gzip headroom.

---

# 91. Browser Validation

Use a production browser if production composition/lazy boundaries change.

At minimum verify:

```text id="f42i6y"
Planner → Month
Planner → Plan
Planner → Review Schedule
Today
Summary
```

If only unreachable dead code or pure helper deduplication changes and browser behavior is mechanically unaffected, document why a reduced walkthrough is sufficient.

---

# 92. Governance

Update:

* Task 7.2A result;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Record the new bundle baseline clearly because Phase 7 feature tasks will use it.

---

# 93. ADR Determination

No ADR is expected for:

* dead-code removal;
* import narrowing;
* pure helper deduplication;
* ordinary lazy ownership cleanup.

If Task 7.2A requires a new enduring build/chunk policy:

stop before silently introducing it and determine whether an ADR is warranted.

---

# 94. Task 7.3 Readiness

Task 7.3 becomes authorized only if:

* all fixed guards pass;
* at least 15 KB total-JS headroom is recovered, **or** a smaller result is mechanically justified as sufficient and no safe additional remediation exists;
* Month remains stable;
* Plan/Review remain stable;
* lazy architecture remains truthful;
* no behavior/authority regression occurs;
* no new runtime dependency exists.

Preferred entry state:

```text id="ncft41"
Total JS <= 725–735 KB
```

---

# 95. Recommended Next Task

If green:

> **Task 7.3 — Monthly Planner Contextual Authoring and Exact Source Navigation.**

Task 7.3 may then consume the recovered headroom to migrate exact Commitment, Event, and Work authoring into the Month contextual workspace.

---

# 96. Completion Criteria

Task 7.2A is complete only when:

* the exact current bundle baseline has been reproduced;
* the production chunk graph has been audited;
* dead production code has been mechanically identified;
* transitional duplication has been audited;
* barrel/tree-shaking/import boundaries have been inspected;
* Month, Plan, Review, Today, and Summary chunk ownership has been evaluated;
* safe high-value remediation candidates have been measured before retention;
* dead code is removed only with production reachability evidence;
* semantically identical duplicated helpers/components are consolidated only where total-JS savings are real;
* lazy boundaries are adjusted only where they improve the actual graph without authority duplication or false loading states;
* negative/no-value optimizations are reverted;
* no intended product capability is removed;
* no authority, scheduler, recurrence, temporal, identity, coverage, persistence, Backup, or execution semantics change;
* Month remains read-only and Task 7.3 is not implemented early;
* no runtime dependency, calendar library, build plugin, threshold inflation, guard-gaming, external script, or generated-code trick is introduced;
* all four fixed bundle guards remain green;
* at least 15 KB of total-JS headroom is recovered where safely achievable, with 25–30 KB preferred;
* exact before/after chunk and total metrics are recorded;
* touched workflows remain covered by focused regression;
* full canonical validation passes;
* browser regression is completed where composition/lazy ownership changed;
* governance records the new production bundle baseline;
* Task 7.3 can proceed with enough engineering headroom to make architectural choices based on correctness rather than a 118-byte ceiling.

---

# 97. Final Implementation Principle

> **Bundle guards should shape architecture before they force desperation.**

Remove what is dead.

Share what is truly shared.

Load what is genuinely contextual.

Keep what the product still needs.

Do not buy headroom by weakening the product or the guard.

---

# 98. Final Completion Statement

**Task 7.2A is complete when DayFrame has converted the 118-byte post-Task-7.2 total-JavaScript margin into meaningful Phase 7 engineering headroom through measured, behavior-preserving production remediation rather than threshold inflation or feature removal; when the current chunk graph has been mechanically audited for dead production paths, transitional duplication, barrel-export/tree-shaking barriers, repeated helpers, inappropriate eager ownership, and high-value lazy-boundary opportunities; when every retained change has a documented bundle delta and every negative or complexity-heavy optimization has been reverted; when Month, Plan, Review Schedule, Today, Summary, exact source identity, canonical variable-duration user-day semantics, display-week semantics, fresh/stale/generated-empty/uncovered/protected coverage distinctions, Event and Commitment incarnation safety, focus, accessibility, mobile behavior, recovery, persistence, profile, restore, full clear, Preview, HistoricalPlan, ExecutionHistory, Goals, Work, and scheduler behavior remain unchanged; when no intended workflow is removed, no new authority or persistence participant is added, no runtime or calendar dependency is introduced, no build rule is gamed, no bundle guard is raised, and no Task 7.3 feature work is smuggled into the remediation; when the fixed initial-raw, initial-gzip, largest-lazy, and total-JS guards all remain green, the project recovers at least 15 KB of total-JS headroom where safely achievable with 25–30 KB preferred, focused and full validation pass, browser regression confirms any touched production composition, governance records the new Phase 7 bundle baseline, and Task 7.3 can begin Monthly Planner contextual authoring without forcing correctness decisions through the artificial constraint of a nearly exhausted production bundle.**
