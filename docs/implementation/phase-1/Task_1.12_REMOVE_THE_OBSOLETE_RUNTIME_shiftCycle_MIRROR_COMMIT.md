# Implementation Task 1.12 — Remove the Obsolete Runtime `shiftCycle` Mirror

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.12

**Task Name:** Remove the Obsolete Runtime `shiftCycle` Mirror

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.12_REMOVE_OBSOLETE_RUNTIME_SHIFT_CYCLE_MIRROR_RESULT.md`

The result artifact should document:

* implementation completed;
* fixtures modernized;
* files changed;
* runtime state changes;
* store initialization changes;
* snapshot/cloning changes;
* durable-reader preservation;
* tests added or updated;
* validation performed and results;
* architectural result;
* deviations from the authorized task, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation reveals a supported runtime consumer of `DayFrameState.shiftCycle`, or any dependency between runtime removal and durable singular-data readers that Task 1.11 did not identify, stop the affected work and record the discrepancy rather than broadening this task.

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

> **The task is complete when current runtime state is plural-only, obsolete runtime singular synthesis is removed, non-migration fixtures use plural initialization, and every established durable singular reader remains intact.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Remove the obsolete runtime `DayFrameState.shiftCycle` mirror after Task 1.11 established that it has no supported production reader, no unique state responsibility, and no durable-reader dependency.

Task 1.11 established that:

* current runtime scheduling authority is plural `shiftCycles`;
* `DayFrameState.shiftCycle` is always synthesized from `shiftCycles[0] ?? null`;
* no production consumer reads the runtime mirror;
* singular `createDayFrameStore({ shiftCycle })` initialization is confined to 12 `DayFrameApp` test fixtures;
* those fixtures can be represented mechanically as `shiftCycles: [cycle]`;
* durable local/profile/backup readers normalize singular input before runtime state is consumed;
* no new store-initialization type is required.

This task converts that evidence into a bounded runtime-state simplification.

---

# Architectural Context

Current durable compatibility already ends at normalization:

```text
LEGACY DURABLE INPUT
    shiftCycle
        ↓
boundary-specific reader
        ↓
normalization
        ↓
shiftCycles
```

Current runtime state still redundantly exposes:

```text
DayFrameState
    ├── shiftCycles
    └── shiftCycle = shiftCycles[0] ?? null
```

Task 1.11 classified this runtime mirror as:

**Obsolete Structure**

The desired architecture is:

```text
HISTORICAL INPUT
    shiftCycle allowed
        ↓
normalization
        ↓
────────────────────────
CURRENT RUNTIME STATE
    shiftCycles only
```

No historical reader should be removed.

---

# Objective

Make current runtime state plural-only by removing `DayFrameState.shiftCycle` and every runtime-only synthesis or initialization path that exists solely to maintain that mirror.

Modernize non-migration test fixtures that still initialize the store with singular `shiftCycle`.

After completion:

> `DayFrameState` shall represent shift-cycle authority only through plural `shiftCycles`.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

* eliminate obsolete architectural structures;
* clarify authoritative runtime state;
* reduce duplicate representations;
* separate historical input from current runtime state;
* simplify store initialization;
* simplify snapshots and cloning;
* strengthen architectural consistency.

It reinforces:

* Architecture Governs Implementation;
* Explicit Authority;
* Separation of Concerns;
* Preserve Deterministic State Ownership;
* Eliminate Structural Debt;
* Evidence Before Preference;
* Local Simplicity, Global Coherence;
* Preserve Forward Migration Paths;
* Architectural Traceability.

---

# Scope

## Test Fixture Modernization

Convert the 12 non-migration `DayFrameApp` store fixtures identified by Task 1.11 from singular initialization:

```text
createDayFrameStore({
    shiftCycle: cycle
})
```

to plural initialization:

```text
createDayFrameStore({
    shiftCycles: [cycle]
})
```

Preserve all other seeded state and test intent.

These fixtures are production-behavior tests using a historical convenience shape, not migration tests.

---

## Runtime State Type

Remove:

```text
DayFrameState.shiftCycle
```

from the current runtime state type.

Do not remove singular fields from raw durable-data input types.

---

## Store Initialization

Remove the singular `initialState.shiftCycle` fallback from the `createDayFrameStore` merge/initialization path.

Retain the existing:

```text
initialState?: Partial<DayFrameState>
```

contract unless implementation evidence requires only a mechanical type adjustment caused by removal of the field.

Do not introduce `DayFrameStoreInitialState` or another replacement initialization type.

Task 1.11 explicitly found no evidence requiring one.

---

## Initial State Synthesis

Remove runtime singular mirror synthesis from `createInitialDayFrameState`.

Current normalized plural cycles should remain unchanged.

Conceptually, change:

```text
return {
    shiftCycles,
    shiftCycle: shiftCycles[0] ?? null,
    ...
}
```

to:

```text
return {
    shiftCycles,
    ...
}
```

using the actual implementation shape.

---

## Snapshot / Clone Synthesis

Remove runtime singular mirror synthesis from `cloneState`.

Clone plural `shiftCycles` exactly as before.

Do not alter unrelated snapshot behavior.

---

## Runtime Assertions

Update tests whose only purpose is to assert:

```text
state.shiftCycle === state.shiftCycles[0]
```

or equivalent obsolete mirror behavior.

Where the test is really protecting durable migration, assert plural runtime authority instead.

Do not alter the literal singular input of genuine durable-reader compatibility fixtures.

---

# Explicit Non-Goals

This task shall not:

* remove singular local-storage readers;
* remove singular profile readers;
* remove singular backup readers;
* change durable-data formats;
* change profile or backup versions;
* remove singular properties from raw legacy input types;
* change legacy normalization behavior;
* change plural precedence;
* remove core singular scheduling inputs;
* modernize engine tests using singular core inputs;
* change `generateSchedulePreview` input contracts;
* change `generateCycleWorkBlocks` input contracts;
* change `getActiveShiftSegment` input contracts;
* change `generateBlockCandidates` input contracts;
* introduce a new store initialization type;
* narrow `Partial<DayFrameState>` for unrelated reasons;
* change scheduling behavior;
* change Preview behavior;
* change persistence behavior;
* change profile behavior;
* change backup behavior;
* define the final compatibility horizon;
* change validation permissiveness;
* address unrelated Phase 1 findings.

This task removes current runtime duplication only.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.9 — Establish Runtime and API `shiftCycle` Compatibility Boundary;
* Task 1.10 — Remove the Test-Only `setShiftCycle` Store Alias;
* Task 1.11 — Establish Runtime State and Store Initialization Boundary.

Task 1.11 provides the evidence that runtime mirror removal is independent of durable singular readers and does not require a new initializer abstraction.

---

# Implementation Requirements

The implementation must:

1. convert all 12 identified non-migration singular store fixtures to plural `shiftCycles`;
2. preserve the represented cycle data exactly;
3. remove `shiftCycle` from `DayFrameState`;
4. remove singular initialization fallback from `createDayFrameStore`;
5. remove runtime singular synthesis from `createInitialDayFrameState`;
6. remove runtime singular synthesis from `cloneState`;
7. update assertions that exist solely to protect the obsolete runtime mirror;
8. preserve genuine singular durable-reader fixtures unchanged at their raw input boundary;
9. preserve plural `shiftCycles` behavior unchanged;
10. preserve all scheduling behavior;
11. avoid introducing any replacement runtime alias or convenience property.

---

# Behavioral Invariants

## Runtime Authority

Plural:

```text
DayFrameState.shiftCycles
```

remains the sole current runtime shift-cycle authority.

---

## Durable Local Compatibility

A singular-only legacy local-storage payload must still normalize successfully into plural `shiftCycles`.

---

## Durable Profile Compatibility

The Task 1.7 singular-only profile fixture must remain valid and normalize into plural `shiftCycles`.

---

## Durable Backup Compatibility

The Task 1.7 singular-only V1 backup fixture must remain valid and normalize into plural `shiftCycles`.

---

## Current Durable Output

Task 1.6 and Task 1.8 behavior remains unchanged:

* local storage writes plural-only;
* new profiles emit plural-only;
* new backups emit plural-only.

---

## Store Initialization

Plural test initialization remains supported through:

```text
createDayFrameStore({
    shiftCycles: [...]
})
```

No singular current-state initializer remains after this task.

---

## Scheduling

Equivalent plural runtime state must continue to produce equivalent deterministic scheduling output.

---

## Preview

Preview generation, staleness, revision, and replacement behavior remain unchanged.

---

# Validation Requirements

## Fixture Validation

Confirm that all 12 known `DayFrameApp` singular store initializers have been converted to plural initialization.

Confirm that no non-migration store fixture still relies on runtime singular initialization.

---

## Runtime Reference Validation

After implementation, confirm no executable current-state read or write remains for:

```text
DayFrameState.shiftCycle
```

Distinguish this from:

* raw durable-data `shiftCycle`;
* `shiftCycleId`;
* local variables representing one cycle;
* core function singular input aliases that remain explicitly deferred.

---

## Runtime State Validation

Add or update tests confirming current state exposes plural cycles without requiring a singular mirror.

Do not add a replacement derived convenience property.

---

## Durable Reader Validation

Run and preserve direct tests proving:

```text
legacy local shiftCycle
    ↓
normalization
    ↓
shiftCycles
```

```text
legacy profile shiftCycle
    ↓
normalization
    ↓
shiftCycles
```

```text
legacy V1 backup shiftCycle
    ↓
normalization
    ↓
shiftCycles
```

The tests should assert plural authority after normalization.

---

## Store Initialization Validation

Confirm that plural partial initialization still supports all affected `DayFrameApp` test scenarios.

---

## Regression Validation

Run relevant suites covering:

* `createInitialDayFrameState`;
* `dayFrameStore`;
* profiles;
* backups;
* `DayFrameApp`;
* Preview generation;
* shift-cycle scheduling behavior.

Then run the standard repository validation sequence:

* `npm run lint`
* `npm run typecheck`
* `npm test -- --run`
* `npm run build`

---

# Architectural Validation

Confirm the runtime state boundary changes from:

```text
DayFrameState
    ├── shiftCycles
    └── shiftCycle mirror
```

to:

```text
DayFrameState
    └── shiftCycles
```

while the historical boundary remains:

```text
RAW LEGACY INPUT
    shiftCycle
        ↓
reader normalization
        ↓
shiftCycles
        ↓
CURRENT RUNTIME
```

No legacy reader should depend on a runtime singular property after normalization.

---

# Required Result

The result artifact should include:

| Concern                                      | Before            | After     |
| -------------------------------------------- | ----------------- | --------- |
| Runtime `DayFrameState.shiftCycle`           | Present           | Removed   |
| Runtime `shiftCycles`                        | Authoritative     | Unchanged |
| Singular `createDayFrameStore` fixture input | 12 known fixtures | 0         |
| Runtime singular synthesis in initial state  | Present           | Removed   |
| Runtime singular synthesis in snapshots      | Present           | Removed   |
| Local singular reader                        | Retained          | Retained  |
| Profile singular reader                      | Retained          | Retained  |
| Backup singular reader                       | Retained          | Retained  |
| Core singular APIs                           | Retained          | Retained  |

Also record:

* exact files changed;
* exact fixture count modernized;
* any remaining executable runtime singular reference;
* whether any unexpected dependency appeared;
* whether `Partial<DayFrameState>` remained sufficient.

---

# Documentation Updates

At completion:

* preserve this Task 1.12 specification unchanged;
* create
  `TASK_1.12_REMOVE_OBSOLETE_RUNTIME_SHIFT_CYCLE_MIRROR_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include Task 1.12 in the next Session Checkpoint;
* do not create a task-specific checkpoint unless separately authorized;
* do not update `CHANGELOG.md` solely for this runtime cleanup.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.12 is complete when:

* all 12 known non-migration singular `DayFrameApp` store fixtures have been converted to plural initialization;
* `DayFrameState.shiftCycle` has been removed;
* the singular store-initialization fallback has been removed;
* runtime singular synthesis has been removed from `createInitialDayFrameState`;
* runtime singular synthesis has been removed from `cloneState`;
* obsolete mirror assertions have been updated to assert plural authority where appropriate;
* genuine singular durable-reader fixtures remain unchanged at their raw input boundary;
* local singular compatibility remains intact;
* profile singular compatibility remains intact;
* backup singular compatibility remains intact;
* `Partial<DayFrameState>` remains sufficient unless an unavoidable compiler-level adjustment is documented;
* core singular scheduling aliases remain untouched;
* runtime and scheduling behavior remain otherwise unchanged;
* relevant tests pass;
* lint passes;
* type checking passes;
* the full automated suite passes;
* the production build passes;
* the result artifact records the completed runtime simplification.

---

# Risks

Primary risks include:

* accidentally removing a raw durable-data compatibility property because it shares the same name;
* modernizing genuine migration fixtures instead of only current-state fixtures;
* changing store initialization behavior beyond removal of the singular fallback;
* introducing a new initializer type unnecessarily;
* removing core singular aliases in the same task;
* altering clone semantics for unrelated state;
* weakening compatibility evidence by rewriting historical fixtures.

The task should remain focused on current runtime state only.

---

# Deferred Work

This task does not resolve:

* core singular scheduling input aliases;
* engine/cycle test fixture modernization;
* durable singular reader retirement;
* compatibility-horizon policy;
* `DayFrameAuthoredSetup` legacy typing ambiguity;
* validator permissiveness;
* seeded-store behavior;
* manual-event ownership;
* feedback aggregation;
* focus/continuity ownership;
* duplicated date conversions;
* persistence-failure authority.

These remain separate future tasks.

---

# Expected Outcome

After Task 1.12, DayFrame should have a clean separation:

```text
HISTORICAL DATA
    singular shiftCycle
        ↓
compatibility readers
        ↓
normalization
        ↓
CURRENT STATE
    plural shiftCycles only
```

Runtime state will no longer carry a first-cycle mirror solely because historical formats once used a singular representation.

Tests constructing current runtime state will use the same plural vocabulary as production.

No historical compatibility will be lost.

---

# Task Determination

Task 1.12 removes the obsolete runtime `shiftCycle` mirror after executable evidence established that historical compatibility ends before current runtime state begins.

It does not remove historical readers or core singular scheduling aliases.

It makes current runtime state reflect the plural scheduling authority already used throughout supported production behavior.

**The task is complete when current runtime state is plural-only, obsolete runtime singular synthesis is removed, non-migration fixtures use plural initialization, and every established durable singular reader remains intact.**
