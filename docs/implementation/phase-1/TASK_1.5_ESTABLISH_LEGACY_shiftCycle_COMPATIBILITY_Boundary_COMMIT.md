# Implementation Task 1.5 — Establish Legacy shiftCycle Compatibility Boundary

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.5

**Task Name:** Establish Legacy `shiftCycle` Compatibility Boundary

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.5_ESTABLISH_LEGACY_SHIFT_CYCLE_COMPATIBILITY_BOUNDARY_RESULT.md`

The result artifact should document:

- investigation completed;
- executable references inspected;
- persisted representations inspected;
- migration and normalization behavior;
- profile and backup behavior;
- test fixtures and compatibility evidence;
- architectural classification;
- removal or retention consequences;
- validation performed and results;
- discrepancies or uncertainty;
- discoveries and deferred work;
- recommended next task;
- final completion determination.

If the evidence is insufficient to determine the compatibility boundary safely,
do not modify this task specification and do not infer a removal policy.

Record the unresolved evidence in the result artifact for project review.

---

# Purpose

Determine the architectural and compatibility responsibility of the legacy singular
`shiftCycle` representation.

Task 1.1 established that plural `shiftCycles` is the executable scheduling input,
while singular `shiftCycle` remains present within compatibility, normalization,
persistence, profile, backup, and store-related paths.

The current implementation therefore appears to contain two representations of
shift-cycle information with different responsibilities:

```text
shiftCycles
    ↓
current scheduling authority


shiftCycle
    ↓
legacy / compatibility representation
```

The compatibility horizon of singular `shiftCycle` was not established by
executable evidence.

This task determines whether that representation remains necessary before any
production removal or migration is authorized.

---

# Architectural Context

Phase 1 begins by eliminating obsolete architectural structures before proceeding
into broader ownership, coupling, and workflow alignment.

Task 1.1 classified singular `shiftCycle` as:

- obsolete for current scheduling authority;
- still active in compatibility behavior;
- unsafe to remove without establishing the migration boundary.

Unlike `PreviewScreenContainer`, this structure may participate in durable authored
information.

Potentially affected representations include:

- persisted local state;
- older saved installations;
- saved profiles;
- JSON backups;
- imported data;
- normalization and rehydration;
- test fixtures;
- migration behavior.

Consequently, absence from current scheduling logic is not sufficient evidence for
removal.

---

# Objective

Establish exactly why singular `shiftCycle` still exists and determine whether it
may be safely removed from the current implementation.

The task must answer:

> **Does singular `shiftCycle` still perform a required compatibility or migration
> responsibility, or has that responsibility expired such that the representation
> is now obsolete?**

No removal or schema migration is authorized by this task.

---

# Architectural Alignment

This task directly supports Phase 1 objectives to:

- eliminate obsolete architectural structures;
- clarify authoritative ownership;
- reduce duplicated representations;
- simplify implementation pathways;
- preserve deterministic state ownership;
- preserve compatibility intentionally rather than accidentally;
- strengthen architectural traceability.

It reinforces the Alignment Strategy principles:

- Architecture Governs Implementation;
- Executable Evidence;
- Preserve Identity;
- Preserve Deterministic State Ownership;
- Eliminate Structural Debt;
- Resolve Root Causes Before Symptoms;
- Evidence Before Preference;
- Preserve Forward Migration Paths;
- Local Simplicity, Global Coherence.

---

# Scope

Investigate all executable behavior related to singular `shiftCycle`.

At minimum, inspect:

- state types;
- initial-state creation;
- state normalization;
- store mutation;
- store persistence;
- rehydration;
- profiles;
- backup export;
- backup import;
- validation;
- migration logic;
- cloning helpers;
- scheduling generation inputs;
- application usage;
- tests and fixtures;
- seed/default state;
- current serialized representations.

Repository-wide reference inspection should distinguish singular `shiftCycle` from
plural `shiftCycles`.

---

# Required Questions

## 1. Current Scheduling Authority

Confirm which representation is consumed by current scheduling behavior.

Determine whether singular `shiftCycle` directly influences any current production
schedule-generation path.

If yes, identify precisely how.

If no, establish that plural `shiftCycles` is the sole current scheduling authority.

---

## 2. Persistence Responsibility

Determine whether singular `shiftCycle` is still written into newly persisted
authored state.

If it is written:

- identify why;
- determine whether the value is canonical, mirrored, or compatibility-only;
- determine how it relates to `shiftCycles`.

Determine whether current rehydration requires the singular value.

---

## 3. Legacy Rehydration Responsibility

Determine whether singular `shiftCycle` exists to restore older persisted state.

Identify:

- legacy shapes accepted;
- fallback behavior;
- normalization rules;
- migration tests;
- version assumptions where executable evidence exists.

Determine what would happen if an older installation contained only singular
`shiftCycle`.

---

## 4. Profile Responsibility

Determine whether singular `shiftCycle` is:

- stored in newly saved profiles;
- accepted in older profiles;
- generated during profile normalization;
- required during profile loading.

Identify whether profile compatibility independently requires retention.

---

## 5. Backup Responsibility

Determine whether singular `shiftCycle` is:

- exported in newly created backups;
- accepted during import;
- validated;
- normalized;
- required for historical backup compatibility.

Identify whether removing it from runtime state would necessarily require changing
the backup format.

---

## 6. Store API Responsibility

Inspect any singular `setShiftCycle` or equivalent mutation path.

Determine:

- whether it has a production caller;
- whether it exists exclusively for compatibility;
- whether it updates plural `shiftCycles`;
- whether tests demonstrate a currently supported independent operation.

Do not infer support merely because the action exists.

---

## 7. Test and Fixture Responsibility

Identify what existing tests containing singular `shiftCycle` actually establish.

Classify evidence as:

- current production behavior;
- legacy compatibility behavior;
- migration behavior;
- fixture convenience;
- obsolete historical behavior;
- unresolved.

Tests should be interpreted by behavior rather than filename.

---

## 8. Removal Consequences

Without performing removal, identify exactly what would change if singular
`shiftCycle` disappeared from:

- runtime state;
- store API;
- persistence;
- profiles;
- backups;
- initial-state normalization;
- test fixtures.

Distinguish changes that may be made independently from changes requiring explicit
data migration or versioning.

---

# Authority Map

Produce an authority map showing the relationship between the representations.

Conceptually:

```text
Authored shift configuration
        │
        ├── shiftCycles
        │       └── current authority?
        │
        └── shiftCycle
                └── compatibility responsibility?
```

For each representation identify:

- writer;
- reader;
- mutation path;
- persistence role;
- migration role;
- scheduling role;
- lifecycle status.

---

# Classification

At completion, classify singular `shiftCycle` as exactly one of the following.

## Required Active Compatibility Structure

Current supported data or migration behavior still requires the representation.

Its retention has a demonstrated compatibility responsibility.

---

## Transitional Compatibility Structure

The representation remains required for reading legacy data but does not need to
remain part of newly authored or newly serialized state.

A staged migration/removal path may therefore be appropriate.

---

## Obsolete Compatibility Structure

No supported current, persistence, profile, backup, migration, or scheduling
responsibility remains.

The representation may be removed through a subsequent authorized task.

---

## Unresolved

Executable evidence is insufficient to establish the compatibility horizon safely.

Do not force a classification.

---

# Explicit Non-Goals

This task shall not:

- remove singular `shiftCycle`;
- modify plural `shiftCycles`;
- change scheduling behavior;
- modify persisted schema;
- migrate local storage;
- change profile format;
- change backup format;
- modify import/export behavior;
- change state normalization;
- remove store actions;
- change seed/default state;
- rewrite fixtures;
- reorganize state types;
- introduce a new migration system;
- address manual-event ownership;
- address feedback ownership;
- address focus/continuity;
- address persistence failure handling;
- address duplicated date helpers.

If removal appears safe, that work belongs to a subsequent authorized task.

---

# Dependencies

Requires completion of:

- Task 1.1 — Establish Foundational Ownership Baseline;
- Task 1.2 — Establish Atomic Authored Setup Commit;
- Task 1.3 — Resolve PreviewScreenContainer Architectural Status;
- Task 1.4 — Remove Obsolete PreviewScreenContainer Path.

Tasks 1.3 and 1.4 establish the validated baseline for continuing Phase 1 obsolete
structure analysis.

---

# Evidence Standards

Claims must derive from executable implementation and behavioral tests.

Preferred evidence includes:

- production reads and writes;
- persistence serializers;
- normalizers;
- validators;
- import/export implementations;
- migration code;
- store actions;
- application callers;
- automated compatibility tests.

Comments and documentation may explain historical intent but do not independently
establish current compatibility requirements.

Do not classify a representation as obsolete merely because current code could be
simplified without it.

Durable-data compatibility is an architectural responsibility when supported by
current project policy or executable behavior.

---

# Required Output

Produce a concise **Legacy `shiftCycle` Compatibility Report** containing:

| Concern | `shiftCycles` | `shiftCycle` | Evidence | Determination |
|---------|---------------|--------------|----------|---------------|
| Scheduling authority | | | | |
| Runtime state | | | | |
| Persistence write | | | | |
| Rehydration read | | | | |
| Profile save/load | | | | |
| Backup export/import | | | | |
| Store API | | | | |
| Migration behavior | | | | |
| Test responsibility | | | | |

Conclude with exactly one classification:

- Required Active Compatibility Structure;
- Transitional Compatibility Structure;
- Obsolete Compatibility Structure;
- Unresolved.

If classified as transitional or obsolete, identify the **smallest safe subsequent
change boundary** without implementing it.

---

# Validation Requirements

This task is investigative and should not modify production behavior.

Confirm that:

- repository-wide singular/plural references were distinguished;
- current scheduling reads were traced;
- serialization writes were traced;
- rehydration and normalization paths were traced;
- profile and backup behavior were traced;
- store callers were inspected;
- compatibility tests were inspected;
- removal consequences were documented;
- no production code was changed;
- no schema or fixture was changed;
- uncertainty was recorded rather than guessed.

Relevant existing tests may be run to verify current behavior.

Run the full repository validation sequence if repository policy requires it.

---

# Documentation Updates

At completion:

- preserve this Task 1.5 specification unchanged;
- create
  `TASK_1.5_ESTABLISH_LEGACY_SHIFT_CYCLE_COMPATIBILITY_BOUNDARY_RESULT.md`;
- update `CURRENT_STATE.md` only after project review;
- include the determination in the next Session Checkpoint;
- do not update `CHANGELOG.md` solely for this investigation.

Historical documentation describing singular `shiftCycle` should remain unchanged
unless its responsibility is to describe the current implementation.

---

# Completion Criteria

Task 1.5 is complete when:

- current scheduling authority has been established;
- current serialization behavior has been established;
- rehydration compatibility has been established;
- profile behavior has been established;
- backup behavior has been established;
- store API usage has been established;
- compatibility tests have been understood;
- removal consequences have been mapped;
- singular `shiftCycle` has been classified according to executable evidence;
- no production behavior has changed;
- the next action can be derived without assumption.

---

# Expected Outcome

Task 1.5 should resolve whether DayFrame currently carries a necessary migration
boundary or merely an obsolete duplicate representation.

Either conclusion improves Phase 1.

If compatibility remains required, the project gains an explicit reason for the
structure to exist.

If compatibility is transitional, the project gains a safe staged-removal boundary.

If compatibility is obsolete, the project gains another evidence-backed candidate
for structural removal.

The objective is not deletion.

The objective is architectural certainty.

---

# Task Determination

Task 1.5 does not authorize migration or removal.

It establishes the compatibility boundary surrounding singular `shiftCycle`.

The task is complete when DayFrame can answer, from executable evidence:

> **Why does singular `shiftCycle` still exist, what current responsibility does it
> serve, and under what conditions—if any—may it safely disappear?**