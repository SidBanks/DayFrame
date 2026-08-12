# Implementation Task 1.19 — Remove the Obsolete `DayFrameAuthoredSetup.shiftCycle` Property

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.19

**Task Name:** Remove the Obsolete `DayFrameAuthoredSetup.shiftCycle` Property

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.19_REMOVE_OBSOLETE_DAYFRAME_AUTHORED_SETUP_SHIFT_CYCLE_PROPERTY_RESULT.md`

The result artifact should document:

* implementation completed;
* normalized authored fixtures modernized;
* files changed;
* type changes;
* clone-helper changes;
* profile behavior preserved;
* backup behavior preserved;
* local persistence compatibility preserved;
* raw singular-reader fixtures preserved;
* validation performed and results;
* architectural result;
* deviations from the authorized task, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation reveals any supported normalized-data consumer that requires `DayFrameAuthoredSetup.shiftCycle`, or any coupling between removing the normalized property and raw durable singular readers that Task 1.18 did not identify, stop the affected work and record the discrepancy rather than broadening this task.

---

# Pre-Execution Artifact Integrity Check

Before beginning implementation, verify that this saved task artifact contains:

* this title and task metadata;
* Execution Artifact Rules;
* Purpose;
* Scope;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with the final sentence:

> **The task is complete when `DayFrameAuthoredSetup` is plural-only, normalized clone/test behavior reflects that boundary, and every established raw local, profile, and backup singular reader remains intact.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Remove the obsolete singular `shiftCycle` property from normalized `DayFrameAuthoredSetup`.

Task 1.18 established that:

* `DayFrameAuthoredSetup` functions as normalized current authored data;
* supported current writers produce plural `shiftCycles` only;
* no supported normalized-data consumer reads singular `shiftCycle`;
* profile and backup raw readers normalize historical singular data before returning normalized authored data;
* local persistence uses a separate raw persisted-input boundary;
* the shared clone helper preserves meaningful singular input only because the normalized type still permits it;
* the remaining meaningful singular typed fixture is test convenience rather than production compatibility;
* no new raw authored-data abstraction is required.

The singular property is therefore an obsolete structure on the normalized authored-data type.

This task removes that obsolete property while preserving all raw historical compatibility boundaries.

---

# Architectural Context

Current executable behavior already follows:

```text
RAW HISTORICAL INPUT
    shiftCycle permitted
        ↓
boundary-specific validation / normalization
        ↓
NORMALIZED AUTHORED DATA
    shiftCycles
        ↓
CURRENT RUNTIME
    shiftCycles
        ↓
CORE SCHEDULING
    shiftCycles
```

But the normalized type still permits:

```text
DayFrameAuthoredSetup
    ├── shiftCycles
    └── shiftCycle?
```

and the clone helper therefore still contains singular clone behavior.

Task 1.18 established that this remaining normalized singular surface is not required for durable compatibility.

The desired boundary is:

```text
RAW HISTORICAL INPUT
    shiftCycle permitted
        ↓
normalization
        ↓
DayFrameAuthoredSetup
    shiftCycles only
        ↓
runtime/core
    shiftCycles only
```

---

# Objective

Make `DayFrameAuthoredSetup` explicitly plural-only.

Remove:

* the optional singular `shiftCycle` property from `DayFrameAuthoredSetup`;
* the corresponding singular clone branch from `cloneDayFrameAuthoredSetup`;
* normalized test-fixture behavior that exists only to exercise that obsolete property.

Preserve:

* raw local singular input compatibility;
* raw saved-profile singular input compatibility;
* raw V1-backup singular input compatibility;
* plural precedence;
* normalized plural output;
* current profile and backup versions;
* runtime and scheduling behavior.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

* eliminate obsolete compatibility structures;
* separate historical input from current normalized data;
* clarify authoritative authored representation;
* reduce type ambiguity;
* simplify clone behavior;
* strengthen architectural consistency;
* preserve forward migration paths.

It reinforces:

* Architecture Governs Implementation;
* Explicit Authority;
* Separation of Concerns;
* Preserve Forward Migration Paths;
* Eliminate Structural Debt;
* Evidence Before Preference;
* Local Simplicity, Global Coherence;
* Architectural Traceability;
* Epistemic Integrity.

---

# Scope

## Normalized Type Cleanup

Remove:

```text
shiftCycle?: ShiftCycle | null
```

or the implementation-equivalent singular compatibility property from:

```text
DayFrameAuthoredSetup
```

Retain:

```text
shiftCycles: ShiftCycle[]
```

unchanged.

Do not remove singular properties from raw persisted or raw record input boundaries.

---

## Clone Helper Cleanup

Update `cloneDayFrameAuthoredSetup` so it clones normalized plural authored data only.

Remove:

* conditional singular cloning;
* any now-unused singular clone import or local helper dependency whose only purpose at this boundary was `DayFrameAuthoredSetup.shiftCycle`.

Preserve cloning of:

* scheduling preferences;
* Preview range;
* shift definitions;
* plural shift cycles;
* block templates;
* block recurrences;
* manual events;
* all other normalized authored fields.

Do not otherwise redesign the clone helper.

---

## Backup Test Fixture Modernization

Modernize the normalized authored-data helper in `dayFrameBackup.test.ts` identified by Task 1.18.

The helper currently constructs typed normalized authored data containing both singular and plural representations.

Change it to construct plural normalized data only.

For repeating-sequence or other tests currently overriding singular `shiftCycle`, express the intended normalized state through plural `shiftCycles`.

Preserve:

* cycle identity;
* mode;
* sequence data;
* anchor dates;
* all behavioral assertions;
* raw singular-only backup compatibility fixtures.

Do not modernize literal raw legacy fixtures.

---

## Profile and Backup Normalized Types

Continue using `DayFrameAuthoredSetup` for:

* `DayFrameSavedProfile.data`;
* `DayFrameBackupV1.data`;

with the type becoming naturally plural-only.

Do not introduce replacement normalized types.

Do not change format versions.

---

## Raw Reader Preservation

Preserve every established raw singular compatibility boundary.

### Local Storage

Retain singular legacy input on the local persisted/raw compatibility type.

Retain its fallback normalization into plural cycles.

### Saved Profiles

Retain singular-field inspection in raw profile records.

Retain singular-only profile compatibility tests.

### V1 Backups

Retain singular-field inspection and validation in raw backup records.

Retain singular-only V1 backup compatibility tests.

These readers are explicitly outside the normalized type cleanup.

---

# Explicit Non-Goals

This task shall not:

* remove local-storage singular readers;
* remove profile singular readers;
* remove backup singular readers;
* modify raw persisted compatibility types except for unavoidable compile-only separation already supported by Task 1.18;
* tighten profile validation;
* tighten backup validation;
* change profile format version;
* change backup format version;
* introduce new raw authored-data types;
* introduce version-specific raw types;
* change normalization defaults;
* change plural precedence;
* change current durable writer output;
* change runtime state;
* change store APIs;
* change core scheduling APIs;
* define the compatibility horizon;
* retire historical fixtures;
* change scheduling behavior;
* change Preview behavior;
* address unrelated Phase 1 findings.

This task removes the obsolete singular property from **normalized authored data only**.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.18 — Establish `DayFrameAuthoredSetup.shiftCycle` Compatibility Boundary.

Task 1.18 provides the executable evidence that:

* normalized authored data requires only plural cycles;
* raw durable readers are independent;
* no new normalized or raw abstraction is required;
* the clone/test residue can be removed safely.

---

# Implementation Requirements

The implementation must:

1. modernize the normalized backup authored-data helper to use plural cycles only;
2. modernize any normalized test override whose meaning is currently expressed through singular `shiftCycle`;
3. preserve genuine raw singular compatibility fixtures unchanged;
4. remove singular `shiftCycle` from `DayFrameAuthoredSetup`;
5. remove singular clone support from `cloneDayFrameAuthoredSetup`;
6. remove any now-unused clone dependency caused solely by that branch;
7. preserve all other authored cloning semantics;
8. preserve `DayFrameSavedProfile.data` as `DayFrameAuthoredSetup`;
9. preserve `DayFrameBackupV1.data` as `DayFrameAuthoredSetup`;
10. preserve all raw singular readers and fallbacks;
11. preserve current profile and backup versions;
12. preserve runtime and scheduling behavior.

---

# Behavioral Invariants

## Current Authored Snapshots

Store-authored snapshots remain plural-only and behaviorally unchanged.

---

## Profiles — Current Writes

New saved profiles must continue emitting plural `shiftCycles` only.

---

## Profiles — Legacy Reads

A raw singular-only legacy profile must still normalize successfully into plural `shiftCycles`.

---

## Backups — Current Writes

New V1 backups must continue emitting plural `shiftCycles` only.

---

## Backups — Legacy Reads

A raw singular-only V1 backup must still validate, normalize, import, and expose plural authority.

---

## Local Storage — Current Writes

Current local-storage writes remain plural-only.

---

## Local Storage — Legacy Reads

A singular-only historical local-storage payload must continue normalizing into plural authority.

---

## Plural Precedence

Where raw input contains both plural and singular representations, existing plural-precedence behavior remains unchanged.

---

## Runtime

Current runtime remains plural-only.

---

## Core Scheduling

Core scheduling remains plural-only.

---

# Validation Requirements

## Normalized Type Validation

Confirm no current typed `DayFrameAuthoredSetup` construction contains singular `shiftCycle`.

Confirm the type no longer exposes that property.

---

## Clone Validation

Update or preserve clone tests proving `cloneDayFrameAuthoredSetup` still:

* deep-clones plural `shiftCycles`;
* preserves all other authored fields;
* does not depend upon a singular representation.

Remove assertions whose only purpose was preservation of normalized singular input.

Do not reduce coverage of meaningful clone behavior.

---

## Raw Compatibility Validation

Explicitly retain and run direct coverage proving:

```text
legacy local shiftCycle
    ↓
normalize
    ↓
shiftCycles
```

```text
legacy profile shiftCycle
    ↓
normalize
    ↓
DayFrameAuthoredSetup.shiftCycles
```

```text
legacy V1 backup shiftCycle
    ↓
normalize
    ↓
DayFrameAuthoredSetup.shiftCycles
```

The raw singular fixtures must remain singular.

---

## Current Writer Validation

Confirm:

```text
current local output
current profile output
current backup output
        ↓
shiftCycles only
```

No singular property should be reintroduced.

---

## Reference Validation

After implementation, distinguish remaining executable `shiftCycle` references.

Allowed remaining categories include:

* raw persisted compatibility fields;
* raw profile-record inspection;
* raw backup-record inspection;
* literal raw singular compatibility fixtures;
* individual-cycle variables;
* entity identifiers such as `shiftCycleId`.

No `DayFrameAuthoredSetup.shiftCycle` reference should remain.

---

## Targeted Validation

Run relevant suites covering:

* backup cloning;
* backup parsing/import/export;
* profiles;
* profile loading/saving;
* local persistence/rehydration;
* store authored snapshot behavior;
* application profile/backup workflows.

---

## Full Validation

Run:

* `npm run lint`
* `npm run typecheck`
* `npm test -- --run`
* `npm run build`

Run `git diff --check` for affected executable files if consistent with current repository practice.

---

# Architectural Validation

Confirm the normalized boundary changes from:

```text
DayFrameAuthoredSetup
    ├── shiftCycles
    └── shiftCycle?
```

to:

```text
DayFrameAuthoredSetup
    └── shiftCycles
```

while preserving:

```text
RAW LOCAL INPUT
    shiftCycle allowed
        ↓
normalization

RAW PROFILE INPUT
    shiftCycle allowed
        ↓
normalization

RAW V1 BACKUP INPUT
    shiftCycle allowed
        ↓
normalization

NORMALIZED AUTHORED DATA
    shiftCycles only
```

No replacement singular field or generalized raw type should be introduced.

---

# Required Result

The result artifact should include:

| Concern                            | Before        | After     |
| ---------------------------------- | ------------- | --------- |
| `DayFrameAuthoredSetup.shiftCycle` | Present       | Removed   |
| Normalized `shiftCycles`           | Authoritative | Unchanged |
| Clone singular branch              | Present       | Removed   |
| Current local writer               | Plural-only   | Unchanged |
| Current profile writer             | Plural-only   | Unchanged |
| Current backup writer              | Plural-only   | Unchanged |
| Raw local singular reader          | Retained      | Retained  |
| Raw profile singular reader        | Retained      | Retained  |
| Raw backup singular reader         | Retained      | Retained  |
| Runtime/core vocabulary            | Plural-only   | Unchanged |

Also record:

* exact files changed;
* exact normalized fixtures modernized;
* remaining legitimate singular-reference categories;
* whether any unexpected normalized consumer appeared;
* whether any raw compatibility boundary required modification;
* whether a new type was required.

---

# Documentation Updates

At completion:

* preserve this Task 1.19 specification unchanged;
* create
  `TASK_1.19_REMOVE_OBSOLETE_DAYFRAME_AUTHORED_SETUP_SHIFT_CYCLE_PROPERTY_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include Task 1.19 in the next Session Checkpoint;
* do not create a task-specific checkpoint unless separately authorized;
* do not update `CHANGELOG.md` solely for this bounded normalized-type cleanup.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.19 is complete when:

* the normalized backup authored-data fixture uses plural cycles only;
* normalized test overrides no longer rely on singular authored data;
* `DayFrameAuthoredSetup.shiftCycle` has been removed;
* `cloneDayFrameAuthoredSetup` no longer clones singular authored data;
* all other authored clone behavior remains unchanged;
* current authored/profile/backup output remains plural-only;
* singular-only local-storage input remains readable;
* singular-only profile input remains readable;
* singular-only V1 backup input remains readable;
* plural precedence remains unchanged;
* runtime state remains plural-only;
* core scheduling remains plural-only;
* no new raw or normalized type was introduced unnecessarily;
* relevant tests pass;
* lint passes;
* type checking passes;
* the full automated suite passes;
* the production build passes;
* the result artifact records the completed normalized-type alignment.

---

# Risks

Primary risks include:

* modifying genuine raw compatibility fixtures while modernizing normalized fixtures;
* accidentally removing singular raw-reader fields because they share the same property name;
* reducing clone coverage rather than modernizing it;
* changing profile or backup version semantics unnecessarily;
* inventing a replacement compatibility type;
* confusing accepted historical input with current normalized output.

The task should preserve compatibility at the raw boundary while removing it from normalized data.

---

# Deferred Work

This task does not resolve:

* final raw durable singular-reader retirement;
* compatibility-horizon policy;
* validator permissiveness;
* version-specific raw typing;
* seeded-store behavior;
* manual-event ownership;
* feedback aggregation;
* focus/continuity ownership;
* duplicated date conversions;
* persistence-failure authority.

Further compatibility cleanup requires separate evidence and authorization.

---

# Expected Outcome

After Task 1.19, DayFrame should express a complete representational boundary:

```text
RAW HISTORICAL INPUT
    singular shiftCycle accepted
        ↓
validation / normalization
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

Historical data remains readable.

Current data no longer carries historical representation debt beyond the reader boundary.

---

# Task Determination

Task 1.19 removes the final singular `shiftCycle` property from normalized authored data after Task 1.18 established that compatibility belongs only at raw historical input boundaries.

It does not remove historical readers or alter versioned formats.

It makes `DayFrameAuthoredSetup` accurately represent the plural-only authored model already used by current writers, runtime state, and core scheduling.

**The task is complete when `DayFrameAuthoredSetup` is plural-only, normalized clone/test behavior reflects that boundary, and every established raw local, profile, and backup singular reader remains intact.**
