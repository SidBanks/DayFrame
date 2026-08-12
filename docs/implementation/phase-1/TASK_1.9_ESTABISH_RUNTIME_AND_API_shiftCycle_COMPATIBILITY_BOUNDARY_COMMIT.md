# Implementation Task 1.9 — Establish Runtime and API `shiftCycle` Compatibility Boundary

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.9

**Task Name:** Establish Runtime and API `shiftCycle` Compatibility Boundary

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.9_ESTABLISH_RUNTIME_API_SHIFT_CYCLE_COMPATIBILITY_BOUNDARY_RESULT.md`

The result artifact should document:

* investigation completed;
* runtime singular references inspected;
* store API singular references inspected;
* core-function singular aliases inspected;
* production callers identified;
* test-only callers identified;
* compatibility responsibilities classified;
* removal dependencies identified;
* validation performed and results;
* architectural determination;
* discrepancies or uncertainty;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If executable evidence is insufficient to classify any compatibility boundary safely, do not remove, rewrite, or infer that boundary.

Record the uncertainty for project review.

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

> **The task is complete when executable evidence establishes which singular runtime and API `shiftCycle` aliases remain necessary, which are transitional, and which may be safely retired independently of durable-data readers.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Establish the remaining compatibility responsibility of singular `shiftCycle` within runtime state, store APIs, and core scheduling-function inputs.

Tasks 1.5 through 1.8 established the durable-data compatibility boundary:

* plural `shiftCycles` is the current scheduling authority;
* new local-storage writes are plural-only;
* new profile output is plural-only;
* new backup output is plural-only;
* singular-only local, profile, and backup readers remain intentionally supported.

Those durable readers must remain untouched until an explicit compatibility horizon exists.

The remaining singular compatibility structures are different.

Task 1.5 identified:

* runtime `DayFrameState.shiftCycle`;
* `setShiftCycle`;
* singular core-function inputs;

as transitional or potentially transitional compatibility aliases.

This task determines whether each still serves supported production behavior or whether any may now be retired independently of durable-data compatibility.

---

# Architectural Context

The durable-data migration now behaves as:

```text
LEGACY DURABLE INPUT

shiftCycle
    ↓
reader normalization
    ↓
shiftCycles authority


CURRENT DURABLE OUTPUT

shiftCycles only
```

However, runtime and API structures still include singular aliases.

Conceptually:

```text
Runtime state

shiftCycles
    ├── current authority
    │
    └── shiftCycle
            first-cycle compatibility mirror


Store API

setShiftCycles(...)
    └── current plural mutation

setShiftCycle(...)
    └── singular compatibility alias?


Core APIs

shiftCycles?: [...]
shiftCycle?: {...}
    └── singular fallback?
```

The presence of these aliases does not itself establish that they remain part of supported production behavior.

Their status must be determined from executable callers and contracts.

---

# Objective

Determine the current architectural status of:

1. `DayFrameState.shiftCycle`;
2. `setShiftCycle` or equivalent singular store mutation;
3. singular `shiftCycle` inputs accepted by core scheduling functions.

For each boundary, determine whether it is:

* currently required;
* transitional compatibility;
* test-only or historical convenience;
* obsolete;
* unresolved.

No production removal is authorized by this task.

---

# Architectural Alignment

This task directly supports Phase 1 objectives to:

* eliminate obsolete architectural structures;
* clarify authoritative ownership;
* reduce duplicate representations;
* simplify implementation pathways;
* reduce unnecessary API surface;
* strengthen architectural consistency;
* preserve compatibility intentionally rather than indefinitely by accident.

It reinforces:

* Architecture Governs Implementation;
* Executable Evidence;
* Evidence Before Preference;
* Preserve Deterministic State Ownership;
* Eliminate Structural Debt;
* Resolve Root Causes Before Symptoms;
* Local Simplicity, Global Coherence;
* Architectural Traceability;
* Preserve Forward Migration Paths.

---

# Scope

Investigate all executable references to singular runtime/API `shiftCycle` that are distinct from the durable-data readers already protected by Tasks 1.5–1.8.

At minimum, inspect:

* `DayFrameState.shiftCycle`;
* state initialization;
* state cloning;
* state snapshots;
* runtime consumers;
* UI consumers;
* store consumers;
* store API definitions;
* `setShiftCycle`;
* production callers of `setShiftCycle`;
* test callers of `setShiftCycle`;
* `generateSchedulePreview` singular inputs;
* cycle-work generation singular inputs;
* active-shift-segment singular inputs;
* candidate-generation singular inputs;
* any additional core functions accepting both singular and plural cycles;
* all production callers of those core functions;
* all test-only singular callers;
* fixture construction patterns;
* compatibility helpers that synthesize or normalize singular inputs.

Durable-data parsing and normalization should be inspected only as necessary to confirm separation from runtime/API aliases.

---

# Required Questions

## 1. Runtime `DayFrameState.shiftCycle`

Determine whether any supported production behavior reads `state.shiftCycle`.

Identify:

* production readers;
* UI readers;
* store readers;
* engine readers;
* test-only readers.

Determine how the runtime mirror is created.

Confirm whether it is always equivalent to:

```text
state.shiftCycles[0] ?? null
```

or whether any path can make it diverge from plural authority.

Determine whether removing the runtime property would affect durable-data readers.

---

## 2. Runtime Mirror Responsibility

Classify the runtime singular property as one of:

* required production state;
* transitional runtime compatibility;
* test/fixture convenience;
* obsolete runtime representation;
* unresolved.

If it is transitional or obsolete, identify the smallest safe removal boundary without implementing it.

---

## 3. `setShiftCycle` Store API

Determine every executable caller of `setShiftCycle`.

Distinguish:

* production application calls;
* migration calls;
* compatibility calls;
* tests;
* fixture setup;
* historical convenience.

Determine whether the action performs any behavior not expressible as:

```text
setShiftCycles([cycle])
```

or:

```text
setShiftCycles([])
```

Determine whether it owns any independent architectural transition.

---

## 4. Store API Classification

Classify `setShiftCycle` as one of:

* supported production API;
* transitional compatibility alias;
* test convenience alias;
* obsolete store API;
* unresolved.

Do not treat tests alone as proof of production support.

---

## 5. Core Singular Input Aliases

Identify every core production function that accepts both:

```text
shiftCycles
```

and:

```text
shiftCycle
```

For each function determine:

* supported production callers;
* whether production callers pass plural input;
* whether any production caller still passes singular input;
* whether singular fallback is exercised only by tests;
* whether the singular argument exists for historical compatibility.

Candidate functions identified by Task 1.5 include, but are not limited to:

* `generateSchedulePreview`;
* `generateCycleWorkBlocks`;
* `getActiveShiftSegment`;
* `generateBlockCandidates`.

Inspect repository evidence rather than assuming this list is exhaustive.

---

## 6. Core API Dependency Chain

Determine whether singular support can be removed independently function-by-function or whether the aliases form a coupled compatibility chain.

For example:

```text
test/legacy caller
    ↓
generateSchedulePreview.shiftCycle
    ↓
generateCycleWorkBlocks.shiftCycle
    ↓
other singular fallbacks
```

versus:

```text
supported production caller
    ↓
shiftCycles only
```

Identify the actual dependency shape.

---

## 7. Test Responsibility

Classify tests using singular runtime/API inputs.

Separate:

* genuine compatibility-contract tests;
* migration tests;
* production-behavior tests that happen to use old fixture shapes;
* convenience fixtures;
* obsolete tests.

Do not remove or modify tests in this task.

The result should identify which test groups would need modernization if aliases are later removed.

---

## 8. Durable-Reader Separation

Confirm whether any runtime/API singular alias is required for the already protected durable readers.

The investigation should establish whether:

```text
legacy durable shiftCycle
    ↓
normalizer
    ↓
shiftCycles
```

can complete before runtime/core APIs are invoked.

If durable readers normalize fully into plural data before runtime scheduling, runtime/API alias cleanup may be independently possible.

If not, identify the coupling precisely.

---

# Required Authority Map

Produce a map similar to:

```text
LEGACY DURABLE DATA
        ↓
singular reader
        ↓
normalization
        ↓
shiftCycles
        │
        ├── runtime authority
        │
        ├── store mutation API
        │
        └── core scheduling APIs
```

Overlay any remaining singular runtime/API paths and identify whether they are still required.

The result should make clear where singular compatibility legitimately ends.

---

# Classification Model

Classify each of the following independently:

| Boundary                           | Classification |
| ---------------------------------- | -------------- |
| Runtime `DayFrameState.shiftCycle` |                |
| `setShiftCycle`                    |                |
| Core singular scheduling inputs    |                |

Use one of:

* **Required Active Compatibility Structure**
* **Transitional Compatibility Structure**
* **Obsolete Compatibility Structure**
* **Test/Fixture Convenience**
* **Unresolved**

Different boundaries may receive different classifications.

---

# Explicit Non-Goals

This task shall not:

* remove `DayFrameState.shiftCycle`;
* remove `setShiftCycle`;
* change any store mutation behavior;
* remove core singular inputs;
* modify durable-data readers;
* modify local-storage compatibility;
* modify profile compatibility;
* modify backup compatibility;
* change profile or backup formats;
* change scheduling behavior;
* modernize test fixtures;
* rewrite singular tests;
* change state types;
* change runtime cloning;
* change initialization behavior;
* change normalization behavior;
* define the compatibility horizon;
* introduce migration code;
* tighten validators;
* address manual-event ownership;
* address feedback ownership;
* address focus/continuity;
* address persistence-failure authority;
* address duplicated date helpers;
* address seeded-store behavior.

This is an investigation-only task.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.5 — Establish Legacy `shiftCycle` Compatibility Boundary;
* Task 1.6 — Stop Writing Legacy `shiftCycle` Local-Storage Mirror;
* Task 1.7 — Establish Singular-Only Profile and Backup Compatibility Evidence;
* Task 1.8 — Stop Emitting Null `shiftCycle` in New Profile and Backup Output.

These tasks establish that durable writer cleanup is complete while durable readers remain protected.

---

# Evidence Standards

Claims must derive from executable implementation.

Preferred evidence includes:

* production imports;
* function callers;
* state reads;
* store action callers;
* runtime execution paths;
* test behavior;
* current function signatures.

Documentation and comments may clarify history but do not establish active support independently.

Repository-wide searches should distinguish:

* state field `shiftCycle`;
* local variables representing one cycle;
* parameter names;
* plural `shiftCycles`;
* durable serialized properties.

Do not classify a structure as active merely because its name appears frequently.

---

# Required Output

Produce a **Runtime and API `shiftCycle` Compatibility Report** containing:

| Boundary                             | Production caller? | Test-only caller? | Durable-reader dependency? | Unique behavior? | Classification | Candidate next step |
| ------------------------------------ | -----------------: | ----------------: | -------------------------: | ---------------: | -------------- | ------------------- |
| `DayFrameState.shiftCycle`           |                    |                   |                            |                  |                |                     |
| `setShiftCycle`                      |                    |                   |                            |                  |                |                     |
| `generateSchedulePreview.shiftCycle` |                    |                   |                            |                  |                |                     |
| Other core singular aliases          |                    |                   |                            |                  |                |                     |

Also include:

* production call traces;
* test/fixture classification;
* durable-reader separation analysis;
* removal dependency order;
* uncertainties.

---

# Removal Dependency Analysis

If any boundary is classified as transitional or obsolete, identify the smallest safe staged removal order.

For example, executable evidence may support something like:

```text
1. modernize test callers
2. remove setShiftCycle
3. remove runtime mirror
4. remove core singular aliases
```

or a different sequence.

Do not assume this ordering.

Derive it from actual dependencies.

The result should distinguish between:

* production dependencies;
* compatibility dependencies;
* test dependencies;
* type dependencies.

---

# Validation Requirements

This task is investigative and should not modify production behavior.

Confirm that:

* repository-wide singular runtime/API references were inspected;
* production callers were distinguished from test callers;
* state readers were traced;
* `setShiftCycle` callers were traced;
* core singular function callers were traced;
* durable-reader normalization was traced far enough to establish coupling or independence;
* test responsibilities were classified;
* removal dependencies were mapped;
* no production code was changed;
* no tests or fixtures were rewritten;
* uncertainty was recorded instead of inferred.

Run relevant test suites if useful to verify current behavior.

Run the full validation sequence if repository policy requires it.

---

# Documentation Updates

At completion:

* preserve this Task 1.9 specification unchanged;
* create
  `TASK_1.9_ESTABLISH_RUNTIME_API_SHIFT_CYCLE_COMPATIBILITY_BOUNDARY_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include the determination in the next Session Checkpoint;
* do not update `CHANGELOG.md` solely for this investigation.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.9 is complete when:

* all production reads of runtime `shiftCycle` have been identified;
* all production callers of `setShiftCycle` have been identified;
* all production callers of core singular scheduling inputs have been identified;
* test-only usage has been distinguished from production usage;
* runtime singular compatibility has been separated from durable-reader compatibility;
* each boundary has been independently classified;
* removal dependencies have been mapped;
* no production behavior has changed;
* the next compatibility action can be derived from evidence rather than assumption;
* required validation passes;
* the result artifact records all uncertainty and deferred work.

---

# Risks

Primary risks include:

* mistaking a local singular cycle variable for the compatibility field;
* treating test usage as production support;
* removing conceptual distinctions between runtime compatibility and durable-data compatibility;
* assuming core singular aliases are independent when they form a call chain;
* interpreting absence of UI callers as proof that internal production callers do not exist;
* broadening investigation into actual removal.

This task should increase certainty without changing executable behavior.

---

# Deferred Work

This task does not resolve:

* final durable-reader retirement;
* compatibility-horizon policy;
* profile or backup version retirement;
* validator strictness;
* manual-event ownership;
* feedback aggregation;
* focus/continuity ownership;
* duplicated date conversions;
* persistence-failure authority;
* seeded-store purpose.

Any runtime/API cleanup identified here requires separate authorization.

---

# Expected Outcome

Task 1.9 should reveal where singular `shiftCycle` compatibility still legitimately exists after durable writer convergence.

The ideal resulting picture may resemble:

```text
LEGACY DURABLE INPUT
    shiftCycle
        ↓
reader normalization
        ↓
shiftCycles
        ↓
runtime + store + engine
        ↓
plural-only current architecture
```

But this task must not assume that outcome.

If runtime or core singular aliases still serve supported behavior, that responsibility should be made explicit.

If they no longer do, the task should identify the smallest safe removal path.

Either result improves architectural certainty.

---

# Task Determination

Task 1.9 establishes the remaining runtime and API compatibility boundary around singular `shiftCycle`.

It does not remove compatibility.

It determines where singular compatibility still belongs after all current durable writers have converged on plural `shiftCycles`.

**The task is complete when executable evidence establishes which singular runtime and API `shiftCycle` aliases remain necessary, which are transitional, and which may be safely retired independently of durable-data readers.**
