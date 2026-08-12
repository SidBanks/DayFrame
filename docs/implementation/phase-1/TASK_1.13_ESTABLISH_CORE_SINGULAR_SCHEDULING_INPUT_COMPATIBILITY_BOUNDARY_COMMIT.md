# Implementation Task 1.13 — Establish Core Singular Scheduling Input Compatibility Boundary

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.13

**Task Name:** Establish Core Singular Scheduling Input Compatibility Boundary

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.13_ESTABLISH_CORE_SINGULAR_SCHEDULING_INPUT_COMPATIBILITY_BOUNDARY_RESULT.md`

The result artifact should document:

* investigation completed;
* core APIs inspected;
* production callers identified;
* test-only callers identified;
* singular fallback behavior traced;
* external/export surface inspected;
* dependency order identified;
* architectural classifications;
* validation performed and results;
* deviations or uncertainty;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If executable evidence shows that a singular core input remains part of supported production behavior or a supported public/exported API, do not remove or narrow that contract.

Record the evidence for project review.

---

# Pre-Execution Artifact Integrity Check

Before beginning execution, verify that this saved task artifact contains:

* this title and task metadata;
* Execution Artifact Rules;
* Purpose;
* Scope;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with the final sentence:

> **The task is complete when executable evidence establishes which core singular `shiftCycle` inputs are obsolete fixture conveniences, which are supported contracts, and the smallest safe staged removal order.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Establish the remaining compatibility responsibility of singular `shiftCycle` inputs accepted by core scheduling functions.

Task 1.9 established that supported production callers already pass plural `shiftCycles` throughout the scheduling pipeline.

Task 1.12 removed the obsolete runtime `DayFrameState.shiftCycle` mirror, leaving current runtime state plural-only.

The remaining singular compatibility structures now reside primarily at core function boundaries and in tests that still exercise historical singular input shapes.

This task determines which of those core singular inputs remain legitimate contracts and which exist only as test or fixture convenience.

No production API removal is authorized by this task.

---

# Architectural Context

The current architecture now has a clean runtime boundary:

```text
LEGACY DURABLE INPUT
    shiftCycle
        ↓
reader normalization
        ↓
CURRENT RUNTIME STATE
    shiftCycles only
```

Supported production scheduling then proceeds with plural cycles:

```text
DayFrameApp
    ↓
dayFrameStore.generatePreview
    ↓
generateSchedulePreview({ shiftCycles })
    ↓
generateCycleWorkBlocks({ shiftCycles })
    ↓
generateBlockCandidates({ shiftCycles })

Other supported paths
    ↓
getActiveShiftSegment({ shiftCycles })
```

However, several core APIs still accept a singular fallback such as:

```text
shiftCycles?: ShiftCycle[]
shiftCycle?: ShiftCycle | null
```

Task 1.9 found no supported production caller using those singular inputs.

The question now is whether those aliases remain:

* supported internal contracts;
* supported external/exported contracts;
* test-only conveniences;
* obsolete compatibility structures;
* unresolved.

---

# Objective

Classify every remaining core scheduling input that accepts singular `shiftCycle` and establish the smallest safe staged removal order.

At minimum, determine the status of singular inputs accepted by:

* `generateSchedulePreview`;
* `generateCycleWorkBlocks`;
* `getActiveShiftSegment`;
* `generateBlockCandidates`;

and any additional core function discovered during repository-wide inspection.

The task must answer:

> **Which core singular scheduling inputs still represent supported behavior, and which survive only because tests and historical fixtures continue to use them?**

No core signature or test fixture is changed by this task.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

* eliminate obsolete API surface;
* clarify canonical scheduling inputs;
* reduce duplicate representations;
* simplify core contracts;
* strengthen deterministic ownership;
* align tests with supported architecture;
* preserve compatibility only where executable evidence requires it.

It reinforces:

* Architecture Governs Implementation;
* Executable Evidence;
* Evidence Before Preference;
* Determinism Over Cleverness;
* Separation of Concerns;
* Eliminate Structural Debt;
* Local Simplicity, Global Coherence;
* Architectural Traceability.

---

# Scope

Investigate all core scheduling functions that accept singular `shiftCycle` as an input alias or fallback.

At minimum inspect:

* input types;
* singular-to-plural fallback logic;
* production callers;
* store callers;
* UI callers;
* helper callers;
* tests;
* fixtures;
* exports or barrel files;
* package metadata;
* any externally supported module surface;
* transitive internal calls among the affected functions.

Repository-wide inspection should distinguish:

* singular compatibility properties;
* plural `shiftCycles`;
* local variables representing one cycle;
* identifiers such as `shiftCycleId`.

---

# Required Questions

## 1. Core API Inventory

Identify every core function whose public/internal input shape includes singular `shiftCycle`.

For each, record:

* function name;
* input type;
* singular fallback behavior;
* plural behavior;
* production callers;
* test callers.

Do not assume the Task 1.9 list is exhaustive.

---

## 2. Production Caller Analysis

For each affected function, determine whether any supported production caller passes singular input.

Classify callers as:

* application production;
* store production;
* core internal production;
* test-only;
* fixture convenience;
* documentation/example only;
* unresolved.

If any production caller passes singular input, identify the exact dependency.

---

## 3. External or Exported Contract

Determine whether any affected core function is exposed through:

* package `exports`;
* package `main` or module entry;
* barrel files;
* exported library API;
* documented supported external consumption;
* another repository-supported public boundary.

The absence of a current production caller does not alone prove an exported contract may be removed.

If no public/export surface exists, record that explicitly.

---

## 4. Fallback Behavior

For each singular input, trace exactly how the function handles it.

Determine whether the singular path:

* immediately converts to a one-element plural array;
* performs additional unique normalization;
* changes defaults;
* changes error behavior;
* owns any behavior not available through plural input.

Unique behavior must be identified before classification.

---

## 5. Internal Dependency Chain

Determine whether singular fallbacks are propagated between functions or resolved independently.

For example:

```text
generateSchedulePreview({ shiftCycle })
    ↓
resolves to local shiftCycles
    ↓
generateCycleWorkBlocks({ shiftCycles })
```

versus:

```text
generateSchedulePreview({ shiftCycle })
    ↓
passes shiftCycle onward
    ↓
downstream singular compatibility
```

Map the actual behavior.

This determines whether aliases can be removed independently.

---

## 6. Test Fixture Analysis

For each affected core API, classify tests using singular input as:

* genuine compatibility-contract tests;
* production-behavior tests using historical fixture shapes;
* fixture convenience;
* legacy API tests;
* obsolete tests;
* unresolved.

Preserve the behavioral intent of those tests even if a future task modernizes their inputs.

---

## 7. Test Modernization Cost

Estimate the smallest mechanical fixture modernization required before each singular alias can be removed.

Record:

* number of direct singular test callers;
* files affected;
* whether conversion is mechanical;
* whether any test specifically asserts singular fallback behavior.

Do not modify tests.

---

## 8. Durable Compatibility Independence

Confirm that durable local/profile/backup singular readers normalize into plural state before any affected core function is called.

No core singular alias should be classified as required merely because durable readers accept singular data.

If a coupling exists, identify it precisely.

---

## 9. Removal Independence

Determine whether aliases can be removed:

* function-by-function;
* in one coherent core task;
* in dependency-ordered groups.

Do not choose a larger removal batch merely for convenience.

Prefer the smallest independently verifiable boundary.

---

# Required Core Compatibility Report

Produce a table similar to:

| Core Boundary             | Production Singular Caller? | Test Singular Callers | Exported Contract? | Unique Singular Behavior? | Classification | Candidate Next Step |
| ------------------------- | --------------------------: | --------------------: | -----------------: | ------------------------: | -------------- | ------------------- |
| `generateSchedulePreview` |                             |                       |                    |                           |                |                     |
| `generateCycleWorkBlocks` |                             |                       |                    |                           |                |                     |
| `getActiveShiftSegment`   |                             |                       |                    |                           |                |                     |
| `generateBlockCandidates` |                             |                       |                    |                           |                |                     |
| Additional boundary       |                             |                       |                    |                           |                |                     |

---

# Classification Model

Classify each singular core input independently as one of:

* **Required Current Contract**
* **Transitional Compatibility Structure**
* **Test/Fixture Convenience**
* **Obsolete Compatibility Structure**
* **Externally Supported Contract**
* **Unresolved**

Different functions may receive different classifications.

---

# Required Dependency Map

Produce an executable call/dependency map showing the supported plural path and any remaining singular test paths.

Example:

```text
SUPPORTED PRODUCTION

store
  ↓
generateSchedulePreview({ shiftCycles })
  ├── generateCycleWorkBlocks({ shiftCycles })
  └── generateBlockCandidates({ shiftCycles })

UI/helpers
  ↓
getActiveShiftSegment({ shiftCycles })


TEST/HISTORICAL INPUT

test
  ↓
generateSchedulePreview({ shiftCycle })
        ↓
local conversion?
```

The result should make clear whether singular compatibility exists only at isolated test-facing boundaries.

---

# Explicit Non-Goals

This task shall not:

* remove any core singular input;
* change any core function signature;
* modernize engine tests;
* change test fixtures;
* remove durable-data singular readers;
* change local-storage compatibility;
* change profile compatibility;
* change backup compatibility;
* change `DayFrameAuthoredSetup`;
* change runtime state;
* reintroduce runtime `shiftCycle`;
* change scheduling behavior;
* change date/boundary behavior;
* change recurrence behavior;
* change normalization behavior;
* introduce a public package API;
* define the compatibility horizon;
* address manual-event ownership;
* address feedback aggregation;
* address focus/continuity ownership;
* address persistence-failure authority;
* address seeded-store behavior;
* address duplicated date helpers.

This task is investigative only.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.9 — Establish Runtime and API `shiftCycle` Compatibility Boundary;
* Task 1.10 — Remove the Test-Only `setShiftCycle` Store Alias;
* Task 1.11 — Establish Runtime State and Store Initialization Boundary;
* Task 1.12 — Remove the Obsolete Runtime `shiftCycle` Mirror.

Task 1.12 establishes a plural-only current runtime state, allowing the remaining core aliases to be evaluated independently.

---

# Evidence Standards

Claims must derive from executable code and behavioral tests.

Preferred evidence includes:

* function signatures;
* production call sites;
* imports;
* exports;
* package metadata;
* test callers;
* current scheduling behavior;
* fallback implementation.

Documentation may clarify intent but cannot independently establish current support.

Do not infer that a core API is public merely because it uses `export` within a source file.

A supported external contract requires an actual project-supported export or consumption boundary.

---

# Validation Requirements

This task should not modify production code or tests.

Confirm that:

* every core singular input was inventoried;
* all production callers were traced;
* all test callers were traced;
* external/export surfaces were inspected;
* singular fallback behavior was compared with plural behavior;
* transitive core dependencies were mapped;
* durable-reader independence was confirmed;
* test modernization cost was recorded;
* removal ordering was derived from evidence;
* no implementation changed;
* uncertainty was recorded rather than guessed.

Run relevant scheduling suites if useful.

Run the repository standard validation sequence if required by project policy.

---

# Required Result

The result artifact should include:

1. the Core Compatibility Report;
2. supported production call traces;
3. singular test caller counts;
4. external/export contract analysis;
5. unique-behavior analysis;
6. dependency map;
7. test fixture classifications;
8. candidate staged removal order;
9. uncertainties;
10. recommended next task.

---

# Documentation Updates

At completion:

* preserve this Task 1.13 specification unchanged;
* create
  `TASK_1.13_ESTABLISH_CORE_SINGULAR_SCHEDULING_INPUT_COMPATIBILITY_BOUNDARY_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include Task 1.13 in the next Session Checkpoint;
* do not create a task-specific checkpoint unless separately authorized;
* do not update `CHANGELOG.md` solely for this investigation.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.13 is complete when:

* every core singular `shiftCycle` input has been identified;
* production callers have been distinguished from test callers;
* public/export contract status has been established;
* singular fallback behavior has been compared with plural behavior;
* durable-reader independence has been confirmed or disproven;
* tests using singular inputs have been classified;
* mechanical modernization scope has been measured;
* each core boundary has been independently classified;
* the smallest safe staged removal order has been established;
* no production code or tests have changed;
* required validation passes;
* the result artifact records uncertainty and deferred work.

---

# Risks

Primary risks include:

* treating a source-level `export` as a supported public API;
* mistaking local cycle variables for compatibility properties;
* assuming test frequency implies production support;
* combining independently removable APIs into an unnecessarily broad future task;
* accidentally revisiting durable-reader compatibility already settled by earlier tasks;
* broadening an investigation into implementation.

This task should locate the boundary, not change it.

---

# Deferred Work

This task does not resolve:

* actual core singular API removal;
* engine/cycle fixture modernization;
* durable-reader retirement;
* compatibility-horizon policy;
* `DayFrameAuthoredSetup` compatibility typing;
* validator permissiveness;
* seeded-store behavior;
* manual-event ownership;
* feedback aggregation;
* focus/continuity ownership;
* duplicated date conversions;
* persistence-failure authority.

The next implementation task should be derived from the classifications established here.

---

# Expected Outcome

Task 1.13 should establish whether current core scheduling APIs already have one practical production vocabulary:

```text
shiftCycles
```

while singular aliases survive only at historical test boundaries.

If so, the result should identify the smallest safe API cleanup sequence.

If any singular input still serves a supported contract, that responsibility should remain explicit.

Either outcome reduces architectural ambiguity.

---

# Task Determination

Task 1.13 establishes the remaining compatibility boundary for singular `shiftCycle` inputs accepted by core scheduling APIs.

It does not remove those inputs.

It determines whether they still represent supported contracts or only historical fixture convenience after current runtime state has become plural-only.

**The task is complete when executable evidence establishes which core singular `shiftCycle` inputs are obsolete fixture conveniences, which are supported contracts, and the smallest safe staged removal order.**
