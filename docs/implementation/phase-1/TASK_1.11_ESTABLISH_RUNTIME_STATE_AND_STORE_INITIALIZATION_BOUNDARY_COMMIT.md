# Implementation Task 1.11 — Establish Runtime State and Store Initialization Boundary

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.11

**Task Name:** Establish Runtime State and Store Initialization Boundary

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.11_ESTABLISH_RUNTIME_STATE_STORE_INITIALIZATION_BOUNDARY_RESULT.md`

The result artifact should document:

* investigation completed;
* runtime state shape inspected;
* store initialization shape inspected;
* test fixture callers inspected;
* legacy persisted-input types inspected;
* normalization boundaries traced;
* candidate type boundaries identified;
* removal dependencies identified;
* validation performed and results;
* architectural determination;
* discrepancies or uncertainty;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If executable evidence is insufficient to establish a clean separation between current runtime state and legacy/test initialization input, do not invent a new abstraction merely to complete the task.

Record the unresolved boundary for project review.

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

> **The task is complete when executable evidence establishes the smallest type and initialization boundary required to remove obsolete runtime `shiftCycle` without weakening legacy durable-data compatibility.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Determine the smallest safe architectural boundary for removing obsolete runtime `DayFrameState.shiftCycle`.

Task 1.9 established that:

* no supported production reader consumes `DayFrameState.shiftCycle`;
* the runtime field is always synthesized from `shiftCycles[0] ?? null`;
* durable-data readers normalize singular legacy input into plural `shiftCycles` before supported runtime scheduling begins;
* singular `createDayFrameStore({ shiftCycle })` initialization is used by tests and fixtures rather than supported production callers;
* `Partial<DayFrameState>` currently conflates runtime state shape with store initialization convenience.

Task 1.10 removed the test-only `setShiftCycle` store alias.

The remaining runtime mirror therefore appears removable, but the correct type and initialization boundary must be established before changing production state shape.

---

# Architectural Context

Current behavior can be summarized as:

```text
LEGACY DURABLE INPUT
    shiftCycle
        ↓
reader normalization
        ↓
shiftCycles
        ↓
createInitialDayFrameState
        ↓
DayFrameState
    shiftCycles
    shiftCycle = first cycle mirror
```

Store test/setup initialization also permits:

```text
createDayFrameStore({
    shiftCycle: legacy/test cycle
})
```

because the initializer accepts a partial runtime-state shape.

This means three different concerns are currently represented through overlapping types:

1. current runtime state;
2. test/store initialization convenience;
3. legacy durable-data input.

The architecture now needs to determine where these responsibilities should separate before the obsolete runtime property is removed.

---

# Objective

Establish the smallest safe type and initialization boundary that allows future removal of:

```text
DayFrameState.shiftCycle
```

without removing or weakening:

* singular local-storage readers;
* singular saved-profile readers;
* singular V1-backup readers;
* their normalization paths.

The task must answer:

> **What input type or initialization contract should accept historical singular data or test setup values after current runtime state becomes plural-only?**

No production state field or initialization behavior is removed by this task.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

* eliminate obsolete runtime structures;
* clarify current state authority;
* separate current state from migration input;
* reduce type ambiguity;
* simplify implementation pathways;
* preserve forward migration paths;
* strengthen architectural consistency.

It reinforces:

* Architecture Governs Implementation;
* Explicit Authority;
* Separation of Concerns;
* Preserve Deterministic State Ownership;
* Preserve Forward Migration Paths;
* Evidence Before Preference;
* Local Simplicity, Global Coherence;
* Architectural Traceability.

---

# Scope

Investigate executable boundaries surrounding current runtime state and store initialization.

At minimum inspect:

* `DayFrameState`;
* any authored-state subtype used inside it;
* `createInitialDayFrameState`;
* `createDayFrameStore`;
* `createDayFrameStore` parameter types;
* store merge behavior;
* runtime cloning/snapshot helpers;
* persistence input types;
* profile authored-data input types;
* backup authored-data input types;
* legacy normalization types;
* test-store factory patterns;
* `DayFrameApp` injected-store tests;
* state tests using `shiftCycle`;
* UI tests using `createDayFrameStore({ shiftCycle })`;
* production creation of `dayFrameStore`;
* any helper that accepts `Partial<DayFrameState>` or equivalent.

Repository-wide inspection should distinguish current runtime types from serialized or legacy input shapes.

---

# Required Questions

## 1. Current Runtime State

Identify every field required to represent current runtime scheduling authority.

Confirm whether current runtime behavior can be fully represented by:

```text
shiftCycles: ShiftCycle[]
```

without:

```text
shiftCycle
```

Identify any snapshot/cloning code that would need eventual simplification.

---

## 2. Production Store Initialization

Determine every supported production call to:

```text
createDayFrameStore(...)
```

Classify each as:

* default construction;
* explicit current-state initialization;
* restored persisted state;
* test-only injection;
* other.

Determine whether any supported production caller supplies a partial runtime state directly.

---

## 3. Test Initialization Usage

Identify every non-migration test/fixture that constructs a store with singular:

```text
shiftCycle
```

Determine whether each can be mechanically represented with:

```text
shiftCycles: [cycle]
```

without changing test meaning.

Classify:

* fixture convenience;
* production behavior test using historical fixture shape;
* genuine migration test;
* unresolved.

---

## 4. Legacy Durable Input

Identify the exact types through which singular durable input currently enters:

* local persisted state;
* saved profiles;
* V1 backups.

Determine whether these types already exist independently of `DayFrameState`.

If not, identify precisely where `DayFrameState` or a partial runtime shape is reused for migration input.

---

## 5. Normalization Boundary

Trace where each legacy singular input becomes plural.

Determine the earliest point after which singular representation is no longer required.

Conceptually:

```text
Raw legacy shape
        ↓
legacy input type
        ↓
normalizer
        ↓
current authored shape
        ↓
runtime state
```

Identify whether current implementation actually reflects this separation or collapses stages together.

---

## 6. Store Initialization Contract

Determine why `createDayFrameStore` accepts its current initialization type.

Identify whether the supported responsibilities are:

* test convenience;
* production dependency injection;
* current state bootstrapping;
* migration;
* a mixture.

Determine the minimal input shape required by legitimate callers.

---

## 7. Type Separation Candidates

Identify the smallest evidence-supported type-boundary options.

Possible forms might include, but are not limited to:

```text
Partial<DayFrameState>
```

remaining for tests after singular fixtures are modernized;

or:

```text
DayFrameStoreInitialState
```

representing supported initialization;

or reuse of an existing authored/normalized state type.

Do not create a preferred new type solely because the name sounds architecturally clean.

Compare candidate boundaries according to actual caller requirements.

---

## 8. Durable Compatibility Independence

Confirm that removing runtime `DayFrameState.shiftCycle` would not require removing singular properties from raw persisted/profile/backup input types.

If the durable readers can retain dedicated legacy input fields independently, document that boundary.

If they cannot, identify the coupling precisely.

---

## 9. Removal Dependency Order

Determine the smallest safe future sequence for eliminating the runtime mirror.

Potential steps may include:

```text
modernize non-migration fixtures
        ↓
adjust store initialization type
        ↓
remove runtime shiftCycle
        ↓
remove snapshot synthesis
```

Do not assume this order.

Derive the dependency chain from executable evidence.

---

# Required Boundary Map

Produce a map showing the current and candidate state boundaries.

Current example:

```text
legacy persisted input
        │
        ├── shiftCycle
        └── shiftCycles
              ↓
normalization
              ↓
DayFrameState
        ├── shiftCycles
        └── shiftCycle mirror

test initialization
        └── Partial<DayFrameState>
              └── may supply shiftCycle
```

Candidate future architecture should show where singular compatibility remains and where current runtime state becomes plural-only.

---

# Classification

Classify each boundary independently:

| Boundary                                         | Classification |
| ------------------------------------------------ | -------------- |
| Runtime `DayFrameState.shiftCycle`               |                |
| `createDayFrameStore` singular initialization    |                |
| `Partial<DayFrameState>` initialization contract |                |
| Durable singular input types                     |                |
| Runtime snapshot synthesis                       |                |

Use one of:

* **Required Current Architecture**
* **Transitional Compatibility Structure**
* **Test/Fixture Convenience**
* **Obsolete Structure**
* **Boundary Ambiguity**
* **Unresolved**

---

# Explicit Non-Goals

This task shall not:

* remove `DayFrameState.shiftCycle`;
* change `DayFrameState`;
* change `createDayFrameStore` parameter types;
* modernize store initialization fixtures;
* change test fixtures;
* change runtime cloning;
* change snapshot synthesis;
* change local-storage readers;
* change profile readers;
* change backup readers;
* change persisted types;
* change profile or backup formats;
* remove core singular scheduling inputs;
* change scheduling behavior;
* introduce a new state abstraction;
* introduce a new migration framework;
* define the final compatibility horizon;
* address manual-event ownership;
* address feedback aggregation;
* address focus/continuity ownership;
* address duplicated date helpers;
* address persistence-failure authority;
* address seeded-store behavior.

This task is investigative only.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.9 — Establish Runtime and API `shiftCycle` Compatibility Boundary;
* Task 1.10 — Remove the Test-Only `setShiftCycle` Store Alias.

Task 1.9 establishes that the runtime mirror is obsolete and durable readers are independent.

Task 1.10 removes one store-level singular dependency before this boundary is analyzed.

---

# Evidence Standards

Claims must derive from executable code and behavioral tests.

Preferred evidence includes:

* type definitions;
* function signatures;
* production constructors;
* runtime state reads;
* store initialization callers;
* normalizers;
* serializers;
* test fixture construction;
* compatibility tests.

Documentation may clarify history but cannot independently establish active responsibility.

Do not infer the need for a new type merely because the current type is broad.

The smallest valid boundary is preferred.

---

# Required Output

Produce a **Runtime State and Store Initialization Boundary Report** containing:

| Concern               | Current Type/Owner | Actual Callers | Singular Needed? | Classification | Candidate Future Boundary |
| --------------------- | ------------------ | -------------- | ---------------: | -------------- | ------------------------- |
| Runtime state         |                    |                |                  |                |                           |
| Store initializer     |                    |                |                  |                |                           |
| Test fixtures         |                    |                |                  |                |                           |
| Local persisted input |                    |                |                  |                |                           |
| Profile legacy input  |                    |                |                  |                |                           |
| Backup legacy input   |                    |                |                  |                |                           |
| Snapshot cloning      |                    |                |                  |                |                           |

Also include:

* production initialization traces;
* test initialization classification;
* normalization traces;
* candidate type boundaries;
* recommended removal order;
* uncertainties.

---

# Validation Requirements

This task is investigative and should not modify production code or tests.

Confirm that:

* runtime state fields were traced;
* every supported `createDayFrameStore` production caller was inspected;
* test-only initialization callers were distinguished;
* durable-data input types were traced;
* normalization boundaries were identified;
* runtime cloning/snapshot behavior was inspected;
* candidate boundary options were evaluated from actual caller needs;
* removal dependencies were mapped;
* no implementation was changed;
* uncertainty was recorded rather than resolved by invention.

Run relevant tests if useful to verify current behavior.

Run the full validation sequence if repository policy requires it.

---

# Documentation Updates

At completion:

* preserve this Task 1.11 specification unchanged;
* create
  `TASK_1.11_ESTABLISH_RUNTIME_STATE_STORE_INITIALIZATION_BOUNDARY_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include Task 1.11 in the next Session Checkpoint;
* do not create a task-specific checkpoint unless separately authorized;
* do not update `CHANGELOG.md` solely for this investigation.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.11 is complete when:

* current runtime shift-cycle authority has been mapped;
* production store initialization responsibilities have been established;
* all singular test initialization uses have been classified;
* durable singular input boundaries have been identified;
* normalization boundaries have been traced;
* the relationship between `Partial<DayFrameState>` and test initialization is understood;
* candidate future type boundaries have been identified without speculative redesign;
* durable-reader independence has been confirmed or disproven;
* the smallest safe runtime-mirror removal sequence has been established;
* no production behavior or tests have changed;
* required validation passes;
* the result artifact contains the architectural determination and uncertainties.

---

# Risks

Primary risks include:

* inventing a new type before proving one is necessary;
* conflating raw persisted data with current runtime state;
* conflating test fixture convenience with production initialization requirements;
* changing migration boundaries during an investigation;
* treating the obsolete runtime field as independently removable before resolving its initialization/type coupling;
* expanding the task into core singular API cleanup.

This task should clarify the seam without modifying it.

---

# Deferred Work

This task does not resolve:

* runtime `DayFrameState.shiftCycle` removal;
* store initializer refactoring;
* fixture modernization;
* core singular scheduling inputs;
* durable-reader retirement;
* compatibility-horizon policy;
* validator policies;
* unrelated Phase 1 findings.

The next implementation task should be derived from the boundary established here.

---

# Expected Outcome

Task 1.11 should establish a clean conceptual distinction between:

```text
historical input
```

and:

```text
current runtime state
```

without prematurely choosing a new type architecture.

The desired long-term direction is that singular compatibility exists only where historical information is actually read, while current runtime state reflects plural scheduling authority directly.

The exact implementation path must be derived from the current caller and type evidence.

---

# Task Determination

Task 1.11 establishes the type and initialization seam required before obsolete runtime `shiftCycle` can be removed safely.

It does not remove the field.

It determines how current runtime state can become plural-only while historical durable-data readers retain their legitimate singular compatibility responsibility.

**The task is complete when executable evidence establishes the smallest type and initialization boundary required to remove obsolete runtime `shiftCycle` without weakening legacy durable-data compatibility.**
