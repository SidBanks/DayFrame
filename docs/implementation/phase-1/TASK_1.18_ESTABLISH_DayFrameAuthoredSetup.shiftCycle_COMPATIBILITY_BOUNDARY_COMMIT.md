# Implementation Task 1.18 — Establish `DayFrameAuthoredSetup.shiftCycle` Compatibility Boundary

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.18

**Task Name:** Establish `DayFrameAuthoredSetup.shiftCycle` Compatibility Boundary

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.18_ESTABLISH_DAYFRAME_AUTHORED_SETUP_SHIFT_CYCLE_COMPATIBILITY_BOUNDARY_RESULT.md`

The result artifact should document:

* investigation completed;
* `DayFrameAuthoredSetup` readers and writers inspected;
* singular property callers identified;
* clone behavior traced;
* profile behavior traced;
* backup behavior traced;
* local persistence relationship traced;
* raw durable-input boundaries inspected;
* normalization boundaries identified;
* architectural classification;
* candidate future type boundary;
* removal dependencies;
* validation performed and results;
* deviations or uncertainty;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If executable evidence is insufficient to separate normalized authored data from legacy durable-input compatibility safely, do not introduce, remove, or redesign a type.

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

> **The task is complete when executable evidence establishes whether `DayFrameAuthoredSetup.shiftCycle` belongs to current normalized authored data or only to raw legacy durable-input compatibility, and identifies the smallest safe boundary for any future removal.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Determine the remaining architectural responsibility of the optional singular `shiftCycle` property on `DayFrameAuthoredSetup`.

Tasks 1.5 through 1.8 established that current durable writers have converged on plural `shiftCycles` while singular-only legacy local state, saved profiles, and Version 1 backups remain readable.

Tasks 1.9 through 1.17 then established and implemented plural-only current runtime state, store mutation APIs, and core scheduling collection APIs.

The remaining ambiguity is that `DayFrameAuthoredSetup` still contains an optional singular `shiftCycle` compatibility property even though current normalized authored data otherwise uses plural `shiftCycles`.

This task determines whether that singular property remains necessary on the current authored-data type or whether legacy singular compatibility can be isolated entirely within raw durable-input boundaries.

No type or production behavior is changed by this task.

---

# Architectural Context

The current system has already converged substantially:

```text
LEGACY DURABLE INPUT

local/profile/backup
    shiftCycle
        ↓
reader normalization
        ↓
shiftCycles


CURRENT RUNTIME

DayFrameState
    shiftCycles only


CURRENT CORE SCHEDULING

generateSchedulePreview
generateCycleWorkBlocks
generateBlockCandidates
getActiveShiftSegment
    ↓
shiftCycles only
```

However, the authored-data layer still conceptually resembles:

```text
DayFrameAuthoredSetup
    ├── shiftCycles
    └── shiftCycle?
```

This raises an architectural question:

```text
Is DayFrameAuthoredSetup
    a current normalized authored shape?

or

Is DayFrameAuthoredSetup
    also serving as a legacy durable-input compatibility shape?
```

Those are different responsibilities and should not remain conflated without evidence.

---

# Objective

Determine whether `DayFrameAuthoredSetup.shiftCycle` is required by any supported current authored-data flow.

Specifically, determine whether the property is needed by:

* current store-authored snapshots;
* current profile creation;
* current profile cloning;
* current backup creation;
* current backup cloning;
* import/load transitions;
* validation;
* normalization;
* tests;
* legacy durable readers.

The task must answer:

> **After raw historical input has been normalized into plural `shiftCycles`, does any supported current authored-data path still require singular `shiftCycle`?**

No production type cleanup is authorized by this task.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

* clarify authoritative data representations;
* separate current state from historical compatibility;
* reduce type ambiguity;
* eliminate obsolete compatibility surface;
* preserve forward migration paths;
* simplify implementation pathways;
* strengthen architectural consistency.

It reinforces:

* Architecture Governs Implementation;
* Explicit Authority;
* Separation of Concerns;
* Preserve Forward Migration Paths;
* Evidence Before Preference;
* Local Simplicity, Global Coherence;
* Architectural Traceability;
* Epistemic Integrity.

---

# Scope

Investigate every executable use of:

```text
DayFrameAuthoredSetup.shiftCycle
```

and every boundary through which `DayFrameAuthoredSetup` is created, cloned, validated, serialized, normalized, or consumed.

At minimum inspect:

* `DayFrameAuthoredSetup` type definition;
* store authored snapshot extraction;
* `getAuthoredSetup`;
* backup clone helpers;
* profile creation;
* profile cloning;
* profile validation and normalization;
* backup creation;
* backup validation and normalization;
* backup import;
* profile load;
* local persisted state where relevant;
* `createInitialDayFrameState`;
* tests using `DayFrameAuthoredSetup`;
* literal legacy fixtures;
* helper APIs accepting partial/authored setup values.

Repository-wide inspection should distinguish:

* current normalized authored data;
* raw durable input;
* historical compatibility fields;
* runtime state;
* test fixtures.

---

# Required Questions

## 1. Current Authored-Data Writers

Identify every supported current writer that produces `DayFrameAuthoredSetup`.

For each writer determine:

* whether it supplies `shiftCycles`;
* whether it supplies singular `shiftCycle`;
* whether singular is meaningful, null, absent, or derived;
* whether any consumer depends on its presence.

Current writers may include:

* store authored snapshot extraction;
* profile creation;
* backup creation;
* cloning helpers.

Do not assume this list is exhaustive.

---

## 2. Current Authored-Data Readers

Identify every supported consumer of normalized `DayFrameAuthoredSetup`.

Determine whether any reader:

* reads singular `shiftCycle`;
* prefers singular over plural;
* requires the property to exist;
* behaves differently when it is absent.

If no current reader consumes the property, record that explicitly.

---

## 3. Clone Helper Responsibility

Inspect the shared clone helper or helpers that accept `DayFrameAuthoredSetup`.

Determine:

* whether meaningful singular input is still accepted;
* who supplies meaningful singular input;
* whether that input originates only from compatibility tests or legacy normalization;
* whether cloning semantics require the property to remain on the normalized type.

Task 1.8 established that null/absent singular values are now omitted from current output.

Determine what responsibility remains after that change.

---

## 4. Profile Boundary

Trace the complete profile path:

```text
raw persisted profile
        ↓
validation / normalization
        ↓
DayFrameSavedProfile.data
        ↓
loadProfile
        ↓
current state
```

Determine:

* the type of `DayFrameSavedProfile.data`;
* whether raw singular profile input becomes plural before `DayFrameAuthoredSetup` is produced;
* whether normalized saved profile data still requires a singular property;
* whether any current profile writer emits meaningful singular data.

---

## 5. Backup Boundary

Trace the complete backup path:

```text
raw V1 backup JSON
        ↓
validation / normalization
        ↓
DayFrameBackupV1.data
        ↓
importBackup
        ↓
current state
```

Determine:

* whether raw singular backup data becomes plural before normalized authored data is returned;
* whether `DayFrameBackupV1.data` requires singular compatibility after normalization;
* whether current backup writers emit any meaningful singular value.

---

## 6. Local Persistence Relationship

Determine whether `DayFrameAuthoredSetup` participates directly in raw local-storage compatibility.

Task 1.6 established plural-only current local writes while retaining singular raw persisted input.

Confirm whether local legacy compatibility requires `DayFrameAuthoredSetup.shiftCycle` or uses a separate raw persisted input type.

---

## 7. Raw vs Normalized Type Boundary

Identify the earliest point at each durable-data boundary where:

```text
shiftCycle
```

has been normalized into:

```text
shiftCycles
```

Determine whether everything after that point can conceptually use a plural-only authored type.

Produce a boundary map such as:

```text
RAW DURABLE INPUT
    shiftCycle allowed
        ↓
validation / normalization
        ↓
NORMALIZED AUTHORED DATA
    shiftCycles only
        ↓
runtime
```

If current types do not express that distinction, identify exactly where they overlap.

---

## 8. Test and Fixture Responsibility

Classify tests or fixtures that still construct `DayFrameAuthoredSetup` with meaningful singular `shiftCycle`.

Separate:

* genuine raw durable compatibility tests;
* clone-helper contract tests;
* production-behavior tests using historical shapes;
* fixture convenience;
* obsolete compatibility assertions.

Do not modify tests.

---

## 9. Versioned Format Responsibility

Determine whether the current Version 1 profile or backup format contract explicitly requires normalized output objects to retain an optional singular property.

Distinguish:

* raw accepted input compatibility;
* normalized in-memory representation;
* current serialized output.

Do not infer version semantics solely from type names.

---

## 10. Removal Independence

Determine whether `DayFrameAuthoredSetup.shiftCycle` can be removed from the normalized/current authored-data type while retaining singular fields in:

* raw local persisted input types;
* raw profile records;
* raw backup records;
* their validators/normalizers.

If yes, identify the smallest safe implementation boundary.

If no, identify the exact coupling.

---

# Required Boundary Map

Produce a current-state map showing where `DayFrameAuthoredSetup` sits between raw input and runtime state.

Example:

```text
RAW HISTORICAL INPUT

local state -------------------+
profile record ----------------+--> normalization
backup record -----------------+
                                      ↓
                              DayFrameAuthoredSetup
                              ├── shiftCycles
                              └── shiftCycle?
                                      ↓
                                  runtime
                                  shiftCycles
```

Then produce the smallest evidence-supported candidate future boundary.

For example:

```text
RAW HISTORICAL INPUT
    shiftCycle allowed
        ↓
boundary-specific normalization
        ↓
NORMALIZED AUTHORED DATA
    shiftCycles only
        ↓
runtime
    shiftCycles only
```

Do not assume this candidate is valid until executable evidence establishes it.

---

# Classification Model

Classify each boundary independently:

| Boundary                           | Classification |
| ---------------------------------- | -------------- |
| `DayFrameAuthoredSetup.shiftCycle` |                |
| Current authored snapshot output   |                |
| Saved-profile normalized data      |                |
| Backup normalized data             |                |
| Raw local singular input           |                |
| Raw profile singular input         |                |
| Raw backup singular input          |                |
| Clone-helper singular support      |                |

Use one of:

* **Required Current Architecture**
* **Transitional Compatibility Structure**
* **Raw Legacy Input Compatibility**
* **Test/Fixture Convenience**
* **Obsolete Structure**
* **Boundary Ambiguity**
* **Unresolved**

---

# Explicit Non-Goals

This task shall not:

* remove `DayFrameAuthoredSetup.shiftCycle`;
* change `DayFrameAuthoredSetup`;
* change profile types;
* change backup types;
* change format versions;
* modify current writers;
* modify current readers;
* modify clone behavior;
* remove singular durable readers;
* modify raw local persisted input;
* modify raw profile input;
* modify raw backup input;
* tighten validators;
* change normalization;
* change runtime state;
* change store APIs;
* change core scheduling APIs;
* introduce new versioned format types;
* introduce a migration framework;
* define the compatibility horizon;
* address seeded-store behavior;
* address manual-event ownership;
* address feedback aggregation;
* address focus/continuity ownership;
* address duplicated date helpers;
* address persistence-failure authority.

This task is investigative only.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.5 — Establish Legacy `shiftCycle` Compatibility Boundary;
* Task 1.6 — Stop Writing Legacy `shiftCycle` Local-Storage Mirror;
* Task 1.7 — Establish Singular-Only Profile and Backup Compatibility Evidence;
* Task 1.8 — Stop Emitting Null `shiftCycle` in New Profile and Backup Output;
* Task 1.12 — Remove the Obsolete Runtime `shiftCycle` Mirror;
* Task 1.17 — Remove the Test-Only `generateSchedulePreview.shiftCycle` Alias.

These tasks establish:

* plural-only current durable writers;
* protected singular legacy readers;
* plural-only runtime state;
* plural-only core scheduling collection APIs.

Task 1.18 examines the remaining authored-data type boundary between those layers.

---

# Evidence Standards

Claims must derive from executable code and behavioral tests.

Preferred evidence includes:

* TypeScript type definitions;
* function signatures;
* writer implementations;
* reader implementations;
* validators;
* normalizers;
* clone helpers;
* profile/backup creation;
* profile/backup loading;
* test fixtures;
* serialization assertions.

Documentation may clarify historical intent but cannot independently establish current responsibility.

Do not assume a property belongs on a normalized type merely because raw input readers still accept it.

---

# Required Output

Produce a **`DayFrameAuthoredSetup.shiftCycle` Compatibility Boundary Report** containing:

| Concern                       | Current Owner/Type | Meaningful Singular Consumer? | Legacy Input Dependency? | Classification | Candidate Future Boundary |
| ----------------------------- | ------------------ | ----------------------------: | -----------------------: | -------------- | ------------------------- |
| Current authored setup        |                    |                               |                          |                |                           |
| Authored snapshot extraction  |                    |                               |                          |                |                           |
| Clone helper                  |                    |                               |                          |                |                           |
| Saved-profile normalized data |                    |                               |                          |                |                           |
| Backup normalized data        |                    |                               |                          |                |                           |
| Local raw input               |                    |                               |                          |                |                           |
| Profile raw input             |                    |                               |                          |                |                           |
| Backup raw input              |                    |                               |                          |                |                           |

Also include:

* current writer traces;
* current reader traces;
* profile normalization trace;
* backup normalization trace;
* local persistence trace;
* clone-helper analysis;
* test/fixture classification;
* candidate type-boundary options;
* removal dependency order;
* uncertainties.

---

# Candidate Type-Boundary Analysis

Evaluate at least these possibilities if supported by the implementation.

## Candidate A — Keep `DayFrameAuthoredSetup` As-Is

Determine whether current executable behavior demonstrates a meaningful responsibility for singular compatibility on the normalized type.

---

## Candidate B — Make `DayFrameAuthoredSetup` Plural-Only

Retain singular compatibility exclusively in raw durable-input shapes and boundary-specific normalizers.

Determine whether this can be done without format or reader changes.

---

## Candidate C — Split Raw and Normalized Authored Types

Determine whether an explicit raw compatibility type is actually necessary, or whether the existing raw `Record<string, unknown>` and persisted-input types already provide the needed separation.

Do not recommend a new type merely for conceptual symmetry.

---

## Candidate D — Versioned Format-Specific Input Types

Determine whether format-specific legacy input types would solve a real executable ambiguity now.

If existing validators already isolate raw records sufficiently, record that no new type is required.

---

# Removal Dependency Analysis

If the singular property is classified as transitional or obsolete on normalized authored data, identify the smallest future removal sequence.

Potential steps might include:

```text
1. modernize clone-helper tests
2. remove singular from DayFrameAuthoredSetup
3. adjust profile/backup normalized types
4. preserve raw singular readers
```

Do not assume this order.

Derive the actual dependency sequence from executable evidence.

---

# Validation Requirements

This task is investigative and should not modify production code or tests.

Confirm that:

* every `DayFrameAuthoredSetup.shiftCycle` read and write was inspected;
* current authored writers were traced;
* current authored readers were traced;
* clone helper callers were traced;
* profile normalization was traced from raw input to current state;
* backup normalization was traced from raw input to current state;
* local persisted compatibility was distinguished from authored setup;
* test fixtures were classified;
* format/version boundaries were inspected;
* candidate type boundaries were evaluated from current implementation needs;
* removal dependencies were mapped;
* no production code or tests changed;
* uncertainty was recorded rather than resolved through speculative redesign.

Run relevant state/profile/backup suites if useful.

Run the repository standard validation sequence if required by project policy.

---

# Documentation Updates

At completion:

* preserve this Task 1.18 specification unchanged;
* create
  `TASK_1.18_ESTABLISH_DAYFRAME_AUTHORED_SETUP_SHIFT_CYCLE_COMPATIBILITY_BOUNDARY_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include Task 1.18 in the next Session Checkpoint;
* do not create a task-specific checkpoint unless separately authorized;
* do not update `CHANGELOG.md` solely for this investigation.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.18 is complete when:

* every meaningful use of `DayFrameAuthoredSetup.shiftCycle` has been identified;
* current authored writers have been mapped;
* current authored readers have been mapped;
* clone-helper responsibility has been established;
* local/profile/backup raw input boundaries have been distinguished from normalized authored data;
* normalization points have been identified;
* tests using meaningful singular authored data have been classified;
* format/version responsibility has been established;
* the singular property's architectural role has been classified;
* the smallest safe future type boundary has been identified;
* no production behavior or tests have changed;
* required validation passes;
* the result artifact records uncertainty and deferred work.

---

# Risks

Primary risks include:

* conflating raw historical data with normalized authored data;
* assuming current versioned output must preserve every accepted legacy input field;
* inventing a new raw type where existing raw-record validators already provide sufficient separation;
* treating clone-helper support as proof that the normalized type requires the field;
* broadening investigation into format-version redesign;
* accidentally revisiting runtime/core compatibility already resolved by previous tasks.

This task should establish the boundary without changing it.

---

# Deferred Work

This task does not resolve:

* actual `DayFrameAuthoredSetup.shiftCycle` removal;
* raw durable singular reader retirement;
* compatibility-horizon policy;
* profile or backup version changes;
* validator permissiveness;
* seeded-store behavior;
* manual-event ownership;
* feedback aggregation;
* focus/continuity ownership;
* duplicated date conversions;
* persistence-failure authority.

Any authored-type cleanup identified here requires separate authorization.

---

# Expected Outcome

Task 1.18 should determine whether DayFrame now has a clean architectural boundary where:

```text
RAW HISTORICAL INPUT
    shiftCycle permitted
        ↓
normalization
        ↓
NORMALIZED AUTHORED DATA
    shiftCycles only
        ↓
CURRENT RUNTIME
    shiftCycles only
        ↓
CORE SCHEDULING
    shiftCycles only
```

If existing executable boundaries already support that model, the task should identify the smallest safe type cleanup.

If `DayFrameAuthoredSetup.shiftCycle` still serves a legitimate normalized-data responsibility, that responsibility should remain explicit.

Either result reduces architectural ambiguity.

---

# Task Determination

Task 1.18 establishes the remaining authored-data compatibility boundary around singular `shiftCycle`.

It does not remove historical compatibility or change versioned formats.

It determines whether singular compatibility should remain on normalized `DayFrameAuthoredSetup` or exist only at raw durable-data reader boundaries.

**The task is complete when executable evidence establishes whether `DayFrameAuthoredSetup.shiftCycle` belongs to current normalized authored data or only to raw legacy durable-input compatibility, and identifies the smallest safe boundary for any future removal.**
