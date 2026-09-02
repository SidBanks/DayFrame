# Task 7.2B — Phase 7 Bundle Architecture and Eager Application/Store Composition Remediation

## Status

Ready for architecture audit and bounded implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

Bundle-architecture audit, eager application/store composition trace, capability-ownership analysis, compatibility/recovery loading audit, production graph restructuring, demand-loaded capability isolation where architecturally safe, total-JS reduction, regression validation, browser/lazy-boundary verification, and governance.

**This task is not another micro-optimization pass. It must address architecture-level production composition while preserving singular authorities, recovery correctness, persistence, and current product behavior.**

---

# 1. Objective

Recover substantial sustainable total-JavaScript headroom by determining why DayFrame's current production graph must emit approximately 750 KB of JavaScript and restructuring capability ownership where architectural evidence permits.

Task 7.2A established that local cleanup is exhausted.

Current exact baseline:

```text
Initial raw       630,499
Initial gzip      160,954
Largest lazy       51,479
Total JS          749,882
Total JS guard    750,000
Headroom              118
```

Task 7.2A mechanically found:

* no meaningful dead production subtree;
* no accidental barrel import pulling large feature trees;
* no high-value duplicate Month/Review implementation;
* no test-only source entering production;
* existing major feature lazy boundaries are healthy;
* removing the React manual chunk is worse;
* removing the module-preload polyfill saves only 556 bytes and narrows behavior;
* `target: esnext` saves nothing;
* merely moving eager code into another lazy chunk does not reduce total output;
* local helper consolidation cannot safely recover even the 5 KB minimum without broad architectural change.

Therefore Task 7.2B must answer a different question:

> **Which runtime capabilities are structurally coupled into the production graph today, why are they coupled, and which capability implementations can be isolated or eliminated from ordinary production paths without weakening the singular authority, protection, recovery, persistence, Backup/restore, profile, scheduling, or cross-surface model?**

---

# 2. Governing Bundle Principle

> **Move authority only when architecture says authority may move. Move capability implementation when authority does not require it to remain eagerly or universally composed.**

Distinguish carefully between:

```text
authority/state
    must exist canonically

capability implementation
    may only be needed when invoked
```

Example distinction:

```text
Eager requirement:
    store knows current authoritative state exists

Not automatically an eager requirement:
    every import/export/restore/profile/compatibility implementation
    must be resident in the same production composition at all times
```

Do not infer this separation. Prove it subsystem by subsystem.

---

# 3. Governing Total-JS Principle

The blocker is **total emitted JavaScript**, not merely startup size.

A restructuring that changes:

```text
20 KB eager
    ↓
20 KB lazy
```

but leaves total output unchanged does **not** solve Task 7.2B.

Such a change may still be architecturally useful, but it does not count toward the primary remediation target.

The task must prioritize changes that cause production code to:

* cease being emitted;
* cease being duplicated;
* cease requiring parallel compatibility implementations in the default graph;
* become materially tree-shakeable;
* replace multiple implementations with one canonical capability implementation;
* otherwise reduce the aggregate emitted JS.

---

# 4. Governing Behavioral Principle

All current intended product behavior remains governing.

At minimum preserve:

```text
Planner
    Month
    Plan
    Review Schedule

Today
Summary
```

Also preserve:

* recovery;
* protected-state behavior;
* profiles;
* Backup;
* restore;
* full clear;
* Goals;
* Events;
* Work;
* Commitments;
* schedule generation;
* Preview;
* PlanDecision;
* HistoricalPlan;
* ExecutionHistory;
* current Month read model;
* exact source identity;
* variable-duration user-days;
* display-week semantics.

Task 7.2B is architecture maintenance, not product compression.

---

# 5. Governing Safety Principle

> **A bundle problem does not authorize weakening epistemic, compatibility, recovery, or authority guarantees.**

Do not recover bytes by:

* dropping supported Backup versions;
* dropping restore validation;
* weakening strict validators;
* merging protected with empty;
* removing profiles;
* removing recovery;
* eliminating exact incarnation checks;
* simplifying historical compatibility incorrectly;
* removing intended surfaces;
* weakening scheduler correctness.

If a capability is expensive because it expresses a real supported contract, that cost may be legitimate.

---

# 6. Task 7.2A Prerequisite

Treat Task 7.2A as governing evidence.

Do not repeat its local dead-code search unless needed to confirm a changed architectural hypothesis.

Task 7.2A concluded:

> Safe local remediation cannot recover meaningful headroom.

Therefore Task 7.2B should begin with architectural composition tracing, not another broad grep for unused functions.

---

# 7. Explicit Scope

Audit and, where mechanically justified, remediate:

* eager application composition;
* `DayFrameApp` import graph;
* store construction and action ownership;
* store static imports of optional capability implementations;
* authority/bootstrap boundary;
* recovery capability loading;
* profile capability loading;
* Backup creation capability loading;
* Backup validation capability loading;
* restore translation/composition capability loading;
* compatibility/version handling;
* Goal authoring capability ownership;
* Review Schedule presentation ownership;
* Event authoring capability ownership;
* Work configuration capability ownership;
* full-clear orchestration;
* persistence adapter ownership;
* application-level command dispatch;
* feature capability modules;
* domain validators imported through broad runtime surfaces;
* production graph duplication created by compatibility/version dispatch;
* facade/barrel architecture;
* lazy capability entry points;
* total-output reduction;
* build graph effects;
* focused regression;
* production browser verification;
* governance.

---

# 8. Explicit Non-Goals

Do not implement:

* Task 7.3;
* Month contextual authoring;
* new Planner UX;
* direct schedule manipulation;
* new scheduler behavior;
* recurrence redesign;
* Capacity;
* Planned Allocation;
* Recommendations;
* transition adaptation;
* Pattern Library;
* Goal reorientation;
* new runtime dependency;
* new bundler;
* new framework;
* bundle-threshold changes;
* removal of supported compatibility merely for size.

---

# 9. Execution Artifact Rules

Before production changes:

1. verify this Task 7.2B artifact;
2. save an immutable project copy;
3. record SHA-256;
4. reproduce the exact Task 7.2A baseline;
5. inspect production manifest/chunk graph;
6. trace the eager entry import graph;
7. identify architecture hypotheses before modifying code;
8. measure each retained structural change;
9. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-7/TASK_7.2B_PHASE_7_BUNDLE_ARCHITECTURE_AND_EAGER_APPLICATION_STORE_COMPOSITION_REMEDIATION_RESULT.md`

---

# 10. Mandatory Baseline

Run before modifications:

```bash
npm run build
npm run check:bundle
```

Record exact:

* transformed modules;
* entry raw;
* entry gzip;
* React vendor;
* time display/shared chunks;
* Month;
* Plan;
* Today UI;
* Today query;
* Summary;
* any other chunks;
* largest lazy;
* total JS;
* total headroom.

Baseline must reproduce Task 7.2A or differences must be explained before proceeding.

---

# 11. Mandatory Eager Import Graph Audit

Trace the eager application entry mechanically.

At minimum map:

```text
index/main
    ↓
DayFrameApp
    ↓
store / authority bootstrap
    ↓
eager UI / commands / adapters
    ↓
domain / compatibility / persistence implementations
```

For each substantial subtree identify:

* approximate emitted contribution where measurable;
* reason it is reachable;
* whether it owns authority;
* whether it merely provides capability;
* whether that capability is required during normal startup;
* whether it is required before user intent;
* whether it can be loaded on demand without creating authority duplication.

Produce an **Eager Capability Ownership Map**.

---

# 12. Authority vs Capability Classification

Classify every major eager subsystem as one of:

### A. Authority core

Must remain present because it owns canonical current state.

### B. Bootstrap/readiness core

Must remain present to determine whether authority can be trusted.

### C. Recovery-critical capability

May need to remain eagerly available if ordinary application boot cannot safely proceed without it.

### D. User-invoked capability

Can potentially load only when invoked.

### E. Presentation capability

Should generally be lazy where practical.

### F. Compatibility support

Needs careful audit; may be required only during load/restore/import rather than ordinary steady-state operation.

### G. Shared pure/domain logic

May be legitimately emitted once if multiple surfaces depend on it.

Do not assume category from filename.

---

# 13. Store Construction Audit

Trace the current store constructor and static imports.

Determine whether store creation directly imports implementations for:

* Backup;
* restore;
* profiles;
* validation;
* publication;
* Goal commands;
* Event commands;
* Preview generation;
* schedule revision;
* full clear;
* persistence;
* compatibility translation.

For each ask:

> Does the store need the implementation at construction time, or only the ability to invoke it later?

Document evidence.

---

# 14. Store Action Ownership

Inventory the store's public actions.

For each action classify:

* frequently used core action;
* optional user-invoked capability;
* recovery-only;
* import/export-only;
* profile-only;
* publication-only;
* derived query only.

Determine whether broad store imports are preventing capability code from being excluded or isolated.

---

# 15. Store Facade Hypothesis

Evaluate whether the current store can preserve one canonical authority while some capability implementations become bounded modules.

Conceptually:

```text
dayFrameStore
    canonical state
    canonical action surface

        ↓

small eager commands
    core authored mutations
    preview state
    readiness

on-demand capability modules
    backup
    restore
    profiles
    publication?
    other bounded workflows
```

Do not adopt this automatically.

The key requirement is:

> The capability module may operate on the singular store/authority; it must not own a second copy.

---

# 16. Async Action Boundary

If capability loading requires asynchronous dynamic import, audit whether changing an action from synchronous to asynchronous would alter public semantics.

Do not silently change action contracts.

Possible safe patterns may include:

* lazy UI imports the capability before invoking a synchronous pure function;
* an existing async workflow owns the import;
* an application adapter loads the capability and passes canonical state/actions;
* another pattern preserving store action contracts.

If no safe pattern exists, retain eager ownership.

---

# 17. Backup Creation Audit

Trace normal Backup creation end to end.

Determine:

* where user invokes it;
* whether Backup implementation is needed at startup;
* whether the UI is already contextual/lazy;
* whether Backup version validators are all imported into the eager graph;
* whether creation can be capability-loaded without changing Backup semantics.

Do not alter supported Backup format.

---

# 18. Backup Validation Audit

Determine where Backup validation is needed:

* restore/import only;
* startup?
* persistence rehydration?
* test-only?
* other.

If old version validators are only needed when a Backup payload is presented, determine whether they can remain outside normal runtime composition until that workflow opens.

Do not remove validators.

---

# 19. Restore Audit

Trace restore:

```text
user selects backup
    ↓
validation
    ↓
translation
    ↓
composition
    ↓
semantic verification
    ↓
exact authority replacement
```

Classify which stages must be eager.

Recovery and restore are related but not necessarily identical.

Do not make an unavailable restore implementation appear as successful empty state during loading.

---

# 20. Recovery Audit

This is a critical safety boundary.

Determine exactly what **recovery** means at application boot.

Audit whether recovery needs:

* full Backup compatibility stack;
* only local persistence recovery;
* restore translation;
* another bounded subset.

Do not lazily remove code necessary to recover from protected/malformed startup state.

If recovery genuinely requires most compatibility code eagerly, document it.

---

# 21. Persistence Rehydration Audit

Trace normal persistence boot.

Determine which validators/version translators are required to:

* parse current persisted state;
* classify protected state;
* recover current runtime authority.

Separate **current persistence schema support** from **user-imported historical Backup support** where architecture permits.

Do not weaken backward compatibility.

---

# 22. Compatibility Footprint Audit

Map every supported versioned compatibility chain.

At minimum include:

* active authored setup;
* HistoricalPlan;
* ExecutionHistory;
* Goal-related stored data;
* Backup versions;
* restore translation.

For each version family determine:

* loaded during ordinary startup;
* loaded only during explicit import/restore;
* loaded only by tests;
* loaded by publication;
* loaded by Summary/Today.

Identify opportunities where compatibility code can be isolated without removing support.

---

# 23. Backup Envelope Version Chain

If Backup validation imports V1→V6 or equivalent chains, determine whether the dispatch layer can remain tiny while individual old-version validators/translators load only when needed.

This is only permissible if:

* exact validation semantics remain;
* malformed old Backup input is not temporarily accepted;
* loading state/error handling is truthful;
* user-visible restore workflow already supports async steps or can safely do so.

Do not invent a plugin architecture for Backup.

---

# 24. Profile Capability Audit

Trace:

* list profiles;
* save profile;
* load profile;
* delete profile.

Determine which portions are:

* core authority state;
* profile persistence implementation;
* UI capability;
* validation.

Profiles are an intended product feature.

Do not remove them.

Determine whether profile implementation needs to be part of ordinary eager startup beyond the minimum required to expose current profile metadata.

---

# 25. Full-Clear Audit

Full clear may touch many authorities.

Determine whether:

* clear orchestration itself is large;
* all participant implementations must be imported eagerly;
* clear can call small stable authority primitives instead of importing high-level feature modules.

Do not weaken full-clear completeness.

---

# 26. Goal Capability Audit

Goals are an independent authority.

Determine whether:

* Goal state/bootstrap must remain eager;
* Goal authoring UI is already lazy/Plan-owned;
* Goal command implementations are imported into the eager store;
* Goal-link validation introduces substantial transitive graph cost.

Do not make Goal authority lazy if protection/readiness requires it eager.

Do distinguish Goal authority from Goal editor capability.

---

# 27. Event Capability Audit

Manual Events are authored authority used by Month and scheduling.

Determine what Event logic must remain eager for:

* Month projection;
* Preview generation;
* exact identity;
* persistence.

Separate that from Event-editor presentation and optional command composition.

Do not break immediate Event mutation semantics.

---

# 28. Work Capability Audit

Work/shift/cycle data affect temporal truth and scheduling.

Core domain logic may be genuinely required broadly.

Do not attempt to lazy-load temporal truth away.

Audit only presentation/authoring or compatibility code around Work.

---

# 29. Preview Generation Audit

Schedule generation is a core user capability.

Determine whether engine implementation is currently eagerly reachable because store action closure imports it.

Ask:

> Must the scheduling engine be loaded before the user requests Generate/Refresh?

If not, evaluate architecture carefully.

However, any change must preserve:

* deterministic generation;
* existing `generatePreview` contract;
* stale/fresh behavior;
* synchronous/async semantics;
* tests;
* user-visible loading behavior.

If changing generation to on-demand would require a new async product contract, stop and treat separately unless already naturally async.

---

# 30. PlanDecision / Revision Audit

Same question for:

* Try;
* Apply Planning Change;
* revision;
* suggested-fix application.

These capabilities are used only in Review workflow.

Determine whether their implementation enters the eager graph through store composition.

Do not alter bounded remediation semantics.

---

# 31. Historical Publication Audit

Determine when HistoricalPlan publication capability is needed.

If publication happens only as a consequence of explicit schedule acceptance/action, inspect whether its implementation must reside eagerly.

Do not weaken publication atomicity or historical immutability.

---

# 32. Review Schedule Presentation Audit

Review Schedule remains eager according to 7.2A.

Audit whether that remains necessary during the Month strangler migration.

Questions:

* Is Review a default startup view?
* Does the app need Review component code before user selects it?
* Is Review still statically imported because Planner shell owns it?
* Could Review become a normal lazy surface while preserving all behavior?

This can reduce initial raw, but remember:

> Lazy-moving Review does not by itself reduce total JS.

Only retain the change if it also enables tree shaking/deduplication or materially improves architecture for later replacement.

Do not count initial-only savings toward total remediation success.

---

# 33. Recovery vs Review Separation

Ensure Review Schedule does not remain eager merely because recovery/bootstrap imports a broad Planner module containing both.

This is a likely composition smell worth tracing.

---

# 34. DayFrameApp Composition Audit

Inspect whether `DayFrameApp` statically imports:

* all surface components;
* all feature commands;
* all modal/editors;
* all recovery/profile/Backup functions;
* large type/value registries.

Identify opportunities to reduce the app shell to:

```text
navigation
authority readiness
minimal eager surface shell
lazy feature boundaries
```

without changing authority.

---

# 35. Surface Registry Architecture

If surfaces are registered in one eager object that imports them all, consider whether dynamic loaders can preserve the same registry semantics.

Do not add a new router framework.

Use existing lazy architecture patterns.

Again, initial-only savings do not solve total JS unless they unlock removal/deduplication.

---

# 36. Compatibility Registry Architecture

Audit large runtime registries that reference every version implementation.

A static registry such as:

```text
{
  1: validatorV1,
  2: validatorV2,
  ...
  6: validatorV6
}
```

forces all versions into the graph.

Evaluate whether a small dispatch layer plus on-demand version implementation is semantically viable.

This is one of the few architecture changes that may reduce effective default graph composition while preserving compatibility.

Measure carefully.

---

# 37. Build-Graph Meaning

Because Vite/Rolldown still emits all statically discoverable dynamic-import targets into total JS, simply converting:

```ts
import validatorV1 from "./v1";
```

to:

```ts
import("./v1");
```

may still leave those bytes in `total JS`.

Therefore do not assume dynamic import solves the total guard.

The audit must understand the bundle guard's definition.

If total JS counts every emitted async chunk, on-demand chunking alone does not recover headroom.

---

# 38. Total-Guard Architecture Audit

This task must inspect the **bundle guard itself**, without changing it.

Determine exactly what `total JS` means:

* all production JS chunks emitted for the build?
* initial + all lazy?
* another calculation?

Document why current architecture hits the guard.

Do not alter counting rules.

---

# 39. Sustainable Guard Question

Do **not** change thresholds in Task 7.2B.

But explicitly assess whether the current total-JS guard is intended as:

### A. hard whole-product complexity budget

Then real emitted code must be removed/consolidated.

### B. proxy for avoiding accidental duplication

Then the current architecture may have legitimately outgrown the original number even with healthy lazy loading.

This distinction is an **architecture/governance question**, not authorization to raise the limit.

If evidence suggests B, stop before changing the guard and recommend a separate governance/ADR decision.

---

# 40. Feature Replacement Opportunity

Phase 7 is a strangler migration.

Determine whether newly implemented Month capability makes any old production presentation genuinely redundant **now**, not later.

Examples to audit:

* mini-calendar;
* duplicated Month-like date selector;
* duplicated read-only selected-day presentation;
* wrappers superseded by Month.

A feature may be removed only if every intended workflow remains accessible elsewhere.

Do not prematurely retire Plan/Review wholesale.

---

# 41. Review Read-Only Duplication

Compare Month selected-day read-only review against Review Schedule.

Identify exact overlap.

Determine whether any read-only presentation can be consolidated now while Review-specific:

* generation;
* Event authoring;
* exact contextual edit;
* friction resolution;

remains available.

Only remove duplication if user workflow remains coherent.

---

# 42. Legacy Mini-Calendar Audit

If the old mini-calendar is now a strict subset of Month navigation and is only used in Review, determine whether it still serves a necessary Review-specific function.

Potential safe consolidation could reduce total emitted UI code if the old component becomes removable.

Do not assume.

---

# 43. Formatting Consolidation Revisited

Task 7.2A found local formatting consolidation too small alone.

In 7.2B, revisit only if larger architectural restructuring exposes a **canonical shared presentation module** that lets multiple old modules disappear.

Do not do small cleanup for its own sake.

---

# 44. Versioned Validation Consolidation

Task 7.2A rejected syntactic validator consolidation because ownership differed.

Task 7.2B may investigate whether versioned validators share generated helper infrastructure that is duplicated across versions.

Any consolidation must preserve:

* exact strict keys;
* exact version semantics;
* exact legacy acceptance;
* malformed rejection.

No generic permissive validator.

---

# 45. Schema Descriptor Hypothesis

If many validators manually reproduce structurally identical primitive checks, evaluate whether a small canonical strict-validation primitive already exists or can safely replace duplicated boilerplate.

Do not build a new validation framework unless measured savings are substantial.

Complexity cost matters.

---

# 46. Restore Translation Consolidation

Audit repeated compatibility translation patterns.

Do not collapse version-specific semantics.

But if repeated immutable copying/validation helpers are truly identical, consolidation may reduce total JS.

Measure before retention.

---

# 47. Clone Helper Consolidation

Same rule for clone functions.

Historical exact property-presence semantics must remain intact.

Do not recreate the Task 5.6 `undefined`/empty collapse.

---

# 48. Domain Type Erasure Awareness

TypeScript types do not contribute to runtime bytes.

Do not spend time consolidating type-only architecture for bundle reasons.

Focus on emitted values/functions.

---

# 49. Constants and Registries

Large runtime constant arrays/options may be duplicated.

Audit:

* recurrence options;
* lifecycle options;
* status labels;
* source-family labels;
* weekdays;
* month labels;
* Backup version lists.

Centralize only where semantics match and emitted output improves.

---

# 50. React Component Duplication

Audit repeated component structures generated separately in:

* Plan;
* Review;
* Month;
* Today;
* Summary.

Do not create overly generic components.

Only consolidate if:

* semantics genuinely match;
* byte savings are meaningful;
* accessibility remains intact.

---

# 51. JSX vs Data-Driven Composition

Do not convert clear JSX into complex runtime data registries merely to reduce source repetition unless the emitted bundle actually shrinks materially.

Measure.

---

# 52. Production Feature Reachability Test

For any candidate removal, prove production reachability/non-reachability using:

* manifest;
* import graph;
* actual surface navigation;
* tests;
* browser behavior.

Do not rely on grep alone.

---

# 53. Candidate Prioritization

Rank candidate architectural remediations by:

```text
expected total-JS recovery
×
confidence in semantic safety
÷
architecture complexity
```

Implement highest-value candidates first.

---

# 54. Minimum Architectural Target

Because Task 7.2B is allowed to touch architecture, require a more meaningful target than 7.2A.

Preferred:

```text
Total JS <= 720,000
```

Strong target:

```text
Total JS <= 710,000
```

Minimum acceptable without further governance:

```text
Total JS <= 730,000
```

That yields at least 20 KB headroom.

If safe architecture changes cannot reach 730 KB, do not grind indefinitely.

Stop and assess whether the **guard itself** needs a separate governance decision.

---

# 55. Guard-Governance Stop Condition

If all of the following are true:

* production graph is architecturally healthy;
* lazy boundaries are appropriate;
* duplication is low;
* retained compatibility features are genuinely supported;
* intended product surfaces account for the emitted code;
* no safe architecture change can recover at least ~20 KB;

then Task 7.2B should **not** continue destroying useful architecture to satisfy an inherited number.

Instead:

1. preserve current guard;
2. stop;
3. produce evidence;
4. recommend a dedicated **Bundle Budget Governance / ADR Audit**.

Task 7.2B itself must not raise the threshold.

---

# 56. Compatibility Loading Stop Condition

If old-version compatibility cannot be separated without changing synchronous restore/recovery contracts:

retain it.

Do not introduce asynchronous semantic races for bundle size.

---

# 57. Store-Splitting Stop Condition

If moving capability implementation out of the store would:

* duplicate state;
* create feature-local authority;
* change action timing;
* weaken transaction semantics;
* weaken exact replacement;
* make restore non-atomic;

retain current ownership and report.

---

# 58. Preview-Engine Stop Condition

If lazy/on-demand generation requires changing a stable synchronous store action into a new async public contract:

do not silently perform it here.

Recommend a separately governed task if the potential savings are substantial.

---

# 59. Publication Stop Condition

Same principle for HistoricalPlan publication.

No atomicity weakening.

---

# 60. Profile Stop Condition

No profile feature degradation.

---

# 61. Recovery Stop Condition

Recovery correctness outranks bundle savings.

---

# 62. Build-System Stop Condition

If meaningful improvement requires:

* manual chunk policy;
* different bundler;
* compression strategy change;
* guard counting change;

stop and recommend a separate architecture/governance task.

Do not smuggle build policy into source remediation.

---

# 63. Remediation Experiment Discipline

For each architecture candidate:

1. establish hypothesis;
2. implement isolated branch/change;
3. build;
4. measure total JS;
5. run focused tests;
6. assess complexity;
7. keep or revert.

Record reverted experiments.

---

# 64. Architecture Remediation Ledger

Maintain:

| Candidate | Architectural hypothesis | Total-JS delta | Semantic risk | Decision |
| --------- | ------------------------ | -------------: | ------------- | -------- |

No retained structural change without measured evidence.

---

# 65. Behavioral Regression Requirements

For every touched capability, preserve exact behavior.

Potential affected suites include:

* store;
* persistence;
* profiles;
* Backup;
* restore;
* recovery;
* full clear;
* Goals;
* Events;
* Preview generation;
* Preview revision;
* HistoricalPlan publication;
* Month;
* Plan;
* Review;
* Today;
* Summary.

Run only the relevant expanded set based on touched code, plus full suite.

---

# 66. Async/Loading Regression

If any capability becomes demand-loaded, test:

* truthful loading;
* duplicate invocation;
* concurrent invocation;
* error loading module;
* retry where appropriate;
* protection state;
* no false empty state.

Do not leave untested async edges.

---

# 67. Race Safety

Dynamic capability loading must not cause:

```text
load capability
    ↓
authority replaced meanwhile
    ↓
old capability writes stale state
```

If capability load crosses an authoritative replacement boundary:

revalidate current authority/intent before mutation.

Use existing exact-target principles.

---

# 68. Profile Replacement During Capability Load

Test if relevant.

---

# 69. Restore During Capability Load

Test if relevant.

---

# 70. Full Clear During Capability Load

Test if relevant.

---

# 71. Recovery During Capability Load

Avoid impossible interleavings by design.

---

# 72. Bundle Measurement After Each Candidate

Mandatory:

```bash
npm run build
npm run check:bundle
```

Do not estimate final savings from source LOC.

---

# 73. Full Validation

At completion:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Record exact metrics.

---

# 74. Browser Regression

Mandatory if any production composition/lazy loading changes.

At minimum verify in production build:

```text
startup/recovery
Planner → Month
Planner → Plan
Planner → Review Schedule
profile workflow if touched
Backup/restore if touched
Today
Summary
```

Use a real browser.

---

# 75. Slow-Network Validation

If a previously eager user-invoked capability becomes demand-loaded:

throttle network and verify truthful loading/error behavior.

---

# 76. Offline/Module-Load Failure Assessment

If capability loading depends on already-built local chunks:

ordinary offline-after-load behavior may differ.

Assess product implications.

Do not introduce a network dependency beyond normal application chunk loading.

---

# 77. Accessibility Regression

Loading new capabilities must preserve:

* named controls;
* status announcements;
* deterministic focus;
* keyboard operation.

---

# 78. Mobile Regression

Only required for touched UI/composition, but at least one narrow viewport if surface loading changes.

---

# 79. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.2B_PHASE_7_BUNDLE_ARCHITECTURE_AND_EAGER_APPLICATION_STORE_COMPOSITION_REMEDIATION_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 7.2A Prerequisite Confirmation
4. Baseline Reproduction
5. Bundle Guard Definition
6. Eager Import Graph
7. Eager Capability Ownership Map
8. Authority Core
9. Bootstrap/Readiness Core
10. Recovery-Critical Capability
11. User-Invoked Capability
12. Presentation Capability
13. Compatibility Support
14. Store Construction
15. Store Action Inventory
16. Store Facade Assessment
17. Async Action Boundary
18. Backup Creation
19. Backup Validation
20. Restore
21. Recovery
22. Persistence Rehydration
23. Compatibility Footprint
24. Backup Version Chain
25. Profile Capability
26. Full Clear
27. Goal Capability
28. Event Capability
29. Work Capability
30. Preview Generation
31. PlanDecision/Revision
32. Historical Publication
33. Review Schedule
34. DayFrameApp Composition
35. Surface Registry
36. Compatibility Registry
37. Total-Guard Architecture
38. Feature Replacement Opportunities
39. Review/Month Duplication
40. Mini-Calendar
41. Validation Consolidation
42. Restore Translation Consolidation
43. Clone Consolidation
44. Runtime Constants/Registries
45. React Component Duplication
46. Candidate Prioritization
47. Chosen Architecture Remediation
48. Files Changed
49. Authority/Capability Separation
50. Import Graph Changes
51. Store Changes
52. Capability Loading Changes
53. Compatibility Loading Changes
54. Presentation Loading Changes
55. Removed Emitted Code
56. Deduplicated Emitted Code
57. Rejected Candidates
58. Reverted Experiments
59. Race Safety
60. Behavioral Equivalence
61. Recovery Regression
62. Profile Regression
63. Backup Regression
64. Restore Regression
65. Full-Clear Regression
66. Goal Regression
67. Event Regression
68. Work Regression
69. Preview Regression
70. HistoricalPlan Regression
71. Month Regression
72. Plan Regression
73. Review Regression
74. Today Regression
75. Summary Regression
76. Accessibility Regression
77. Mobile Regression
78. Slow-Network Regression
79. Tests Added/Changed
80. Focused Validation
81. Full Validation
82. Browser Validation
83. Baseline Bundle
84. Final Bundle
85. Raw JS Recovered
86. Gzip Change
87. Initial Bundle Change
88. Largest Lazy Change
89. Headroom Recovered
90. Guard-Governance Assessment
91. Runtime Dependency Assessment
92. Persistence Boundary
93. Authority Boundary
94. Scheduler Boundary
95. Governance Updates
96. ADR Determination
97. Deviations
98. Discoveries
99. Deferred Work
100. Architecture Remediation Ledger
101. Eager Ownership Matrix
102. Store Capability Matrix
103. Compatibility Matrix
104. Lazy-Capability Matrix
105. Race Matrix
106. Bundle Matrix
107. Guard Matrix
108. Product-Boundary Matrix
109. Architectural Invariant Assessment
110. Stop-Condition Assessment
111. Architectural Alignment Assessment
112. Task 7.3 Readiness
113. Recommended Next Task
114. Final Completion Determination

---

# 80. Required Eager Ownership Matrix

| Capability | Eager today? | Must own authority eagerly? | Implementation may be contextual? | Decision |
| ---------- | -----------: | --------------------------: | --------------------------------: | -------- |

Include at minimum:

* store core;
* readiness;
* recovery;
* profiles;
* Backup create;
* Backup validate;
* restore;
* full clear;
* Goals;
* Events;
* Work;
* Preview generation;
* revision;
* Historical publication;
* Review UI.

---

# 81. Required Store Capability Matrix

| Store action/capability | Current implementation import | Core or optional? | Could load outside store? | Semantic risk |
| ----------------------- | ----------------------------- | ----------------- | ------------------------: | ------------- |

---

# 82. Required Compatibility Matrix

| Compatibility family | Needed at startup? | Needed on import/restore? | Can isolate? | Result |
| -------------------- | -----------------: | ------------------------: | -----------: | ------ |

Include all material versioned compatibility paths.

---

# 83. Required Lazy-Capability Matrix

| Capability | Before | After | Total-JS delta | Contract changed? | Loading state |
| ---------- | ------ | ----: | -------------: | ----------------: | ------------- |

Only include retained changes.

---

# 84. Required Race Matrix

| Capability | Authority replacement during load | Protection against stale write |
| ---------- | --------------------------------- | ------------------------------ |

Include every new async capability boundary.

---

# 85. Required Bundle Matrix

| Metric       | 7.2A baseline | 7.2B final | Delta |            Guard |
| ------------ | ------------: | ---------: | ----: | ---------------: |
| Initial raw  |       630,499 |            |       |          685,000 |
| Initial gzip |       160,954 |            |       |          170,000 |
| Month        |        21,602 |            |       | 100,000 lazy max |
| Plan         |        51,479 |            |       | 100,000 lazy max |
| Largest lazy |        51,479 |            |       |          100,000 |
| Total JS     |       749,882 |            |       |          750,000 |

Record every emitted chunk.

---

# 86. Required Guard Matrix

| Guard        | Threshold | Final | Headroom | Pass? |
| ------------ | --------: | ----: | -------: | ----: |
| Initial raw  |   685,000 |       |          |       |
| Initial gzip |   170,000 |       |          |       |
| Largest lazy |   100,000 |       |          |       |
| Total JS     |   750,000 |       |          |       |

---

# 87. Required Product-Boundary Matrix

| Capability                      | Task 7.2B                  |
| ------------------------------- | -------------------------- |
| bundle architecture audit       | Implement                  |
| authority/capability separation | Implement where safe       |
| store composition remediation   | Implement where safe       |
| compatibility isolation         | Audit/implement where safe |
| recovery correctness            | Preserve                   |
| profiles                        | Preserve                   |
| Backup/restore                  | Preserve                   |
| product features                | Prohibited                 |
| Task 7.3                        | Prohibited                 |
| authority duplication           | Prohibited                 |
| scheduler redesign              | Prohibited                 |
| runtime dependency              | Prohibited                 |
| threshold changes               | Prohibited                 |
| build-count changes             | Prohibited                 |

---

# 88. Architectural Invariants

Assess at minimum:

1. singular store authority remains.
2. no feature-local authority is created.
3. authority/bootstrap stays sufficient for trustworthy startup.
4. protected state remains distinct from empty.
5. recovery remains available.
6. persistence rehydration remains truthful.
7. all supported Backup formats remain supported.
8. restore remains exact replacement.
9. restore remains semantically verified.
10. full clear remains complete.
11. profiles remain supported.
12. profile load remains exact replacement of owned authored state.
13. Goals remain independent authority.
14. Events remain independent authored authority.
15. Work remains canonical temporal/scheduling input.
16. Preview remains derived.
17. HistoricalPlan remains immutable publication history.
18. ExecutionHistory remains execution evidence.
19. PlanDecision remains bounded remediation.
20. Month remains read-only.
21. Task 7.1 remains Month semantic owner.
22. exact Commitment identity remains unchanged.
23. exact Event identity remains unchanged.
24. stale sources never retarget.
25. variable-duration user-day semantics remain unchanged.
26. display-week semantics remain unchanged.
27. coverage semantics remain unchanged.
28. generated-empty remains distinct from uncovered.
29. no supported feature is removed.
30. no compatibility promise is dropped.
31. no validator becomes permissive.
32. no historical unknown is backfilled.
33. no synchronous action becomes async without explicit governed contract.
34. any new async capability revalidates stale authority where necessary.
35. lazy capability owns implementation, not state.
36. loading state never masquerades as empty.
37. module-load failure is explicit.
38. dynamic capability loading does not create duplicate writes.
39. profile replacement during load cannot write stale state.
40. restore during load cannot write stale state.
41. full clear during load cannot resurrect state.
42. recovery remains safe during bootstrap.
43. scheduler behavior is unchanged.
44. recurrence behavior is unchanged.
45. schedule staleness behavior is unchanged.
46. Event immediate-write semantics remain unchanged.
47. Goal edits remain scheduling-independent.
48. Today remains execution reporting.
49. Summary remains historical interpretation.
50. Plan remains functional.
51. Review remains functional.
52. Month remains functional.
53. surface navigation remains functional.
54. recovery remains reachable without an already-loaded optional surface.
55. eager application shell remains minimal enough for readiness/navigation.
56. optional capability implementation does not needlessly enter eager composition.
57. total-JS reduction is real, not only eager→lazy movement.
58. bundle counting rules remain unchanged.
59. all emitted JS remains counted.
60. no external code-loading workaround is introduced.
61. no build threshold changes.
62. no new runtime dependency.
63. no new bundler/plugin.
64. no manual chunk policy is silently introduced.
65. compatibility dispatch changes preserve exact versions.
66. validation consolidation preserves exact strict keys.
67. clone consolidation preserves absent-vs-empty semantics.
68. restore translation preserves version semantics.
69. dead presentation is removed only when workflow replacement exists.
70. Review/Month overlap is not compressed prematurely.
71. accessibility behavior remains intact.
72. focus behavior remains intact.
73. mobile behavior remains intact.
74. slow-loading behavior is truthful for any new lazy capability.
75. race behavior is covered for any new async boundary.
76. each retained architecture change has measured bundle benefit.
77. changes with negligible/negative benefit are reverted.
78. total JS reaches <=730 KB or a guard-governance stop is triggered.
79. preferred total JS <=720 KB where safely achievable.
80. initial raw remains under guard.
81. initial gzip remains under guard.
82. largest lazy remains under guard.
83. total JS remains under guard.
84. meaningful engineering headroom is restored.
85. Task 7.3 is not implemented early.
86. governance records the new capability architecture.
87. ADR is created only if a genuinely enduring architecture/build rule changes.
88. full validation passes.
89. production browser regression passes.
90. Task 7.3 can proceed without byte-level desperation, or a governance prerequisite is explicitly identified.

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

# 89. Stop Conditions

Stop and report instead of forcing remediation if:

1. core compatibility/recovery genuinely accounts for most remaining output and cannot be isolated safely;
2. meaningful savings require dropping supported Backup/restore versions;
3. meaningful savings require weakening strict validation;
4. meaningful savings require feature removal;
5. meaningful savings require duplicated authority;
6. meaningful savings require changing stable synchronous store actions into async contracts without a separately governed decision;
7. meaningful savings require scheduler redesign;
8. meaningful savings require build-count manipulation;
9. meaningful savings require manual chunk policy or bundler replacement;
10. meaningful savings require raising the bundle threshold;
11. total graph is mechanically healthy and the remaining problem is the inherited whole-product guard rather than architectural duplication.

In case 11, recommend a dedicated **Bundle Budget Governance Audit / ADR** rather than continuing to damage architecture.

---

# 90. Focused Validation

Run focused suites based on touched architecture.

At minimum consider:

* store;
* persistence;
* profiles;
* Backup;
* restore;
* full clear;
* Goal;
* Event;
* Preview generation;
* Preview revision;
* HistoricalPlan publication;
* Month;
* Planner navigation;
* Today;
* Summary;
* lazy loading.

Record exact files and counts.

---

# 91. Full Validation

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
* every emitted chunk;
* initial raw;
* initial gzip;
* largest lazy;
* total JS;
* total headroom;
* diff result.

---

# 92. Browser Validation

Mandatory for retained production composition/loading changes.

At minimum validate:

* cold startup;
* recovery entry if fixture available;
* Planner Month;
* Planner Plan;
* Planner Review Schedule;
* any newly demand-loaded capability;
* profile workflow if touched;
* Backup/restore workflow if touched;
* Today;
* Summary.

Use production build.

---

# 93. Slow-Network Validation

Mandatory for any newly demand-loaded capability.

Verify:

* truthful loading;
* focus;
* repeated activation;
* module-load error behavior where practical;
* no false empty state.

---

# 94. Governance

Update:

* Task 7.2B result;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

If architecture changes capability ownership materially, record it explicitly.

---

# 95. ADR Determination

An ADR **may** be warranted if Task 7.2B establishes an enduring rule such as:

> Canonical authorities remain eager while bounded capability implementations are demand-loaded through application-owned adapters.

Do not create this ADR merely because the wording sounds attractive.

Create it only if implementation actually adopts the rule as a lasting architecture boundary.

A build-budget/governance issue should use a separate ADR/task if required.

---

# 96. Task 7.3 Readiness

Task 7.3 becomes authorized only under one of two conditions:

### A. Architecture remediation succeeds

* total JS <=730 KB;
* preferably <=720 KB;
* all guards green;
* no behavior regression;
* singular authorities preserved;
* production browser validation green.

### B. Task 7.2B proves the graph is healthy but the whole-product guard is no longer an appropriate sustainable architecture metric

In this case **Task 7.3 is still not authorized** until a dedicated bundle-budget governance decision resolves the guard.

Do not bypass the guard informally.

---

# 97. Recommended Next Task

If A:

> **Task 7.3 — Monthly Planner Contextual Authoring and Exact Source Navigation.**

If B:

> **Task 7.2C — Bundle Budget Governance and Sustainable Production-Complexity Guard Audit.**

If another architecture blocker is discovered:

name that precise prerequisite instead.

---

# 98. Completion Criteria

Task 7.2B is complete only when:

* the exact 7.2A bundle baseline is reproduced;
* the whole-product bundle guard calculation is documented without alteration;
* the eager application import graph is mechanically mapped;
* every major eager subsystem is classified as authority core, bootstrap/readiness, recovery-critical, user-invoked capability, presentation, compatibility, or shared domain logic;
* store construction and action ownership are traced;
* Backup, restore, recovery, persistence rehydration, profiles, full clear, Goal, Event, Work, Preview generation, revision, publication, Review, and DayFrameApp composition are audited;
* compatibility/version support is mapped by when it is actually required;
* store authority is cleanly distinguished from capability implementation;
* any demand-loaded capability preserves one singular canonical authority and truthful loading/error behavior;
* any new asynchronous boundary revalidates state against authoritative replacement/race conditions where necessary;
* no supported compatibility, recovery, profile, Backup, restore, Goal, Event, Work, scheduling, publication, Today, Summary, Month, or accessibility capability is weakened;
* all retained structural changes have measured total-JS benefit;
* eager→lazy movement with zero total savings is not misclassified as remediation success;
* dead or transitional presentation is removed only when every intended workflow has a proven replacement;
* validation/translation/clone consolidation occurs only where strict version semantics remain exact;
* no threshold, guard calculation, runtime dependency, build plugin, bundler, external code source, or feature compression is used to buy headroom;
* negative/negligible experiments are reverted;
* total JS is reduced to at most 730 KB where safely achievable, with <=720 KB preferred;
* or, if that cannot be achieved because the graph is demonstrably healthy and supported product capability legitimately exceeds the inherited whole-product budget, the task stops and explicitly recommends a separate bundle-budget governance/ADR audit rather than damaging architecture;
* focused and full validation pass;
* production browser validation passes for all changed composition/loading paths;
* governance records the resulting architecture and bundle baseline;
* Task 7.3 is either cleanly authorized with meaningful headroom or explicitly blocked on the precise next governance prerequisite.

---

# 99. Final Implementation Principle

> **Authority should be canonical. Capability should be composed where it is needed. Compatibility should remain real. Bundle budgets should expose architecture problems, not force us to erase supported behavior.**

Do not confuse:

* state with the code that operates on it;
* lazy loading with total-size reduction;
* compatibility with dead weight;
* a healthy guard with an eternal number.

Measure the graph.

Preserve the truth.

Change only the architecture that evidence says is unnecessarily coupled.

---

# 100. Final Completion Statement

**Task 7.2B is complete when DayFrame has mechanically explained the architectural source of its near-exhausted whole-product JavaScript budget and either safely reduced that output to sustainable Phase 7 headroom or proved that the remaining pressure is a governance-budget question rather than removable architectural duplication; when the eager application/store graph has been traced from bootstrap through readiness, recovery, persistence, profiles, Backup/restore, Goals, Events, Work, Preview generation and revision, HistoricalPlan publication, Review, Month, Today, and Summary; when every substantial runtime capability has been classified according to whether canonical authority, trustworthy bootstrap, recovery correctness, explicit user invocation, presentation, or compatibility truly requires its implementation to participate in ordinary production composition; when singular authorities remain singular and any capability moved behind a demand-loaded boundary operates on current canonical state rather than owning a second copy, preserves existing synchronous/transactional contracts or explicitly stops when it cannot, and revalidates against replacement/race conditions where necessary; when Backup versions, restore translation, strict validation, protection, historical unknowns, exact incarnation semantics, profile behavior, full clear, scheduler determinism, Preview staleness, Event immediacy, Goal independence, variable-duration user-days, display-week semantics, Today execution reporting, Summary historical interpretation, Month read-only projection, accessibility, focus, and mobile behavior all remain intact; when each retained architecture change has measured aggregate emitted-JavaScript savings rather than merely shifting bytes between eager and lazy chunks, every negligible or negative experiment is reverted, and no intended feature, compatibility promise, runtime dependency, bundle threshold, guard calculation, build plugin, bundler, external code source, or unsupported compression technique is used to manufacture success; when total JS reaches at most 730 KB with 720 KB or below preferred, or the task instead stops with evidence that the production graph is healthy and the inherited whole-product guard requires a separate explicit governance/ADR decision; when all focused, full, bundle, and real-browser validation pass; and when DayFrame either enters Task 7.3 with meaningful engineering headroom or names the exact bundle-governance prerequisite that must be resolved first.**
