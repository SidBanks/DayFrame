# Implementation Task 1.27 — Retain Store-Level Durability Status Outside `DayFrameState`

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.27

**Task Name:** Retain Store-Level Durability Status Outside `DayFrameState`

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.27_RETAIN_STORE_LEVEL_DURABILITY_STATUS_OUTSIDE_DAYFRAME_STATE_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* durability-status contract introduced;
* durable surfaces represented;
* initialization semantics;
* write-outcome mapping;
* removal-outcome mapping;
* mutation-result integration;
* clear-status behavior;
* later-convergence behavior;
* accessor introduced;
* subscription determination;
* `DayFrameState` separation preserved;
* mutation-result preservation;
* runtime/subscriber/UI behavior preserved;
* tests added or updated;
* validation performed and results;
* deviations from authorized scope, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires adding UI feedback, retry behavior, automatic retry, rollback, migration markers, durability fields to `DayFrameState`, changes to runtime-state subscriber payloads, changes to mutation ordering, changes to session-first runtime authority, or a new persistence abstraction, stop the affected work and record the discrepancy rather than expanding Task 1.27.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Durable Surfaces In Scope;
* Required Durability Status Contract;
* Initialization Semantics;
* Outcome Mapping;
* Operation Integration Requirements;
* Accessor Requirements;
* Subscription Determination;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when the store retains explicit active-state and profile durability status outside `DayFrameState`, updates that status from existing mutation outcomes, exposes it through the smallest justified read boundary, preserves all current runtime/subscriber/UI behavior, and directly protects the retained-status contract with tests.**

If the saved artifact is incomplete, truncated, or does not contain that final sentence, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Retain the latest known durability status for DayFrame's active authored-state and saved-profile durable surfaces at the store level.

Task 1.24 made persistence outcomes observable at the persistence-helper boundary.

Task 1.25 established the architectural contract that:

* runtime state remains authoritative for the current session after persistence failure;
* persistence success is a separate dimension from runtime mutation success;
* the previous stored representation is the last known durable checkpoint;
* durability status belongs at the store/infrastructure level rather than inside `DayFrameState`;
* mutation results should expose immediate persistence outcomes;
* the store should retain surface-level durability knowledge so a persistence failure does not disappear when the initiating workflow ends; and
* later successful full-snapshot persistence may establish that the current surface is durably synchronized without reconstructing every intermediate mutation.

Task 1.26 implemented the immediate mutation-result portion of that contract.

Persisting store operations now expose the conceptual result:

```text
runtime mutation
    ↓
persistence attempt
    ↓
persistence outcome
    ↓
notify runtime snapshot
    ↓
return {
    state,
    persistence
}
```

Task 1.27 implements only the next layer:

```text
persistence outcome
    ↓
store retains current durability knowledge
```

It does not yet make workflows react to that knowledge.

---

# Architectural Context

Before Task 1.24:

```text
runtime mutation
    ↓
persistence attempt
    ↓
failure may be swallowed
    ↓
caller cannot distinguish durability
```

After Task 1.24:

```text
persistence helper
    ↓
factual outcome exists
```

After Task 1.26:

```text
store mutation
    ↓
factual persistence outcome
    ↓
returned to immediate caller
```

But if the caller ignores that result:

```text
mutation returns
    ↓
operation-local durability knowledge disappears
```

Task 1.27 closes that gap without moving persistence state into domain state:

```text
                    ┌───────────────────────┐
                    │      DayFrameStore    │
                    └───────────┬───────────┘
                                │
               ┌────────────────┴────────────────┐
               │                                 │
               v                                 v
        DayFrameState                   StoreDurabilityStatus
        runtime truth                   infrastructure truth
               │                                 │
               v                                 v
     state subscribers                    synchronous accessor
```

These remain distinct contracts.

---

# Governing Evidence

Task 1.25 established the ownership model:

```text
Persistence helper
    factual storage outcome
          ↓
Store
    runtime authority
    durability interpretation
    retained durability status
    future retry execution
          ↓
Workflow / UI
    communication
    user recovery choice
```

Task 1.26 established immediate store mutation results while deliberately deferring:

* retained durability status;
* retry;
* workflow feedback;
* recovery UX.

Task 1.27 must build directly on the Task 1.26 outcomes rather than introducing a second persistence interpretation path.

---

# Governing Runtime Principle

Task 1.27 must preserve:

> A successful authored store mutation guarantees that the requested runtime transition was applied and published. Durable persistence is guaranteed only by the corresponding persistence outcome.

It must also preserve:

> Receipt of a `DayFrameState` snapshot guarantees only current cloned runtime truth for the session; it does not guarantee that the snapshot was durably persisted.

Retained durability status supplements those contracts.

It does not replace or redefine them.

---

# Objective

Introduce the smallest store-level mechanism that:

1. remembers the latest known durability relationship for active authored state;
2. remembers the latest known durability relationship for saved profiles;
3. updates each surface from persistence outcomes already captured by Task 1.26;
4. distinguishes confirmed synchronization from known non-durability;
5. preserves meaningful failure categories needed by later recovery logic;
6. represents initialization without inventing persistence certainty;
7. keeps active-state and profile durability independent;
8. remains outside `DayFrameState`;
9. exposes retained status through the smallest justified read boundary;
10. preserves immediate mutation results;
11. preserves current runtime behavior;
12. preserves current subscriber behavior;
13. preserves current UI/workflow behavior.

No retry or recovery behavior is authorized.

---

# Durable Surfaces In Scope

Task 1.27 represents exactly two store-owned durable surfaces.

## 1. Active Authored State

The active authored-state local-storage surface.

Its retained durability status is affected by operations that attempt to persist or remove active authored state.

These include at minimum:

* `commitAuthoredSetup`;
* `setSchedulingPreferences`;
* `setPreviewRange`;
* `setShiftDefinitions`;
* `setShiftCycles`;
* `setBlockTemplates`;
* `setBlockRecurrences`;
* `setManualEvents`;
* `loadProfile`;
* `importBackup`;
* the active-state portion of `clearLocalData`.

Confirm the current executable inventory before implementation.

## 2. Saved Profiles

The saved-profile local-storage surface.

Its retained durability status is affected by:

* `saveProfile`;
* `deleteProfile`;
* the profile-storage portion of `clearLocalData`.

Confirm the current executable inventory before implementation.

---

# Surfaces Explicitly Out of Scope

Do not create retained durability status for:

* exported backup files;
* generated Preview;
* friction results;
* suggested fixes;
* schedule generation;
* transient UI state;
* imported source backup files;
* individual profiles separately;
* individual authored mutations separately.

Backup export is an external file-delivery/recovery concern and is not a `dayFrameStore` durable surface equivalent to browser local storage.

---

# Required Durability Status Contract

Introduce a narrow store-level retained status.

Exact type and property names may follow repository conventions, but the semantic shape should be equivalent to:

```ts
type SurfaceDurabilityStatus =
  | { status: "unknown" }
  | { status: "durable" }
  | { status: "unavailable" }
  | { status: "serializationFailure" }
  | { status: "storageFailure" };

type StoreDurabilityStatus = {
  activeState: SurfaceDurabilityStatus;
  profiles: SurfaceDurabilityStatus;
};
```

A string union instead of discriminated objects is acceptable if no additional data is required.

For example:

```ts
type SurfaceDurabilityStatus =
  | "unknown"
  | "durable"
  | "unavailable"
  | "serializationFailure"
  | "storageFailure";
```

Prefer the simpler representation unless executable needs require objects.

Do not introduce timestamps, retry counts, exception objects, operation names, dirty snapshots, or historical outcome arrays.

---

# Why Retained Status Is Normalized

Task 1.24 exposes helper-operation outcomes:

```text
WRITE
    persisted
    unavailable
    serializationFailure
    storageFailure

REMOVAL
    removed
    unavailable
    storageFailure
```

Those describe what a particular persistence helper did.

Task 1.27's retained status answers a different question:

> What does the store currently know about whether this runtime surface is synchronized with its durable representation?

Therefore both:

```text
persisted
```

and:

```text
removed
```

represent successful durable synchronization for their respective current runtime conditions.

They should normalize to:

```text
durable
```

or an implementation-equivalent term.

Do not retain `"persisted"` after a successful clear, because the current surface was removed rather than written.

Do not retain `"removed"` after a normal write.

The retained status describes the relationship, not the helper verb.

---

# Required Outcome Mapping

The retained status must map Task 1.24 outcomes as follows:

| Persistence outcome    | Retained surface status | Meaning                                                                                               |
| ---------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `persisted`            | `durable`               | The latest current snapshot for that surface was successfully written.                                |
| `removed`              | `durable`               | The current cleared/empty condition for that surface was successfully established durably.            |
| `unavailable`          | `unavailable`           | Runtime may continue, but no durable synchronization was established because storage was unavailable. |
| `serializationFailure` | `serializationFailure`  | The current runtime representation could not be serialized for persistence.                           |
| `storageFailure`       | `storageFailure`        | The storage operation failed after the persistence path was attempted.                                |

Do not collapse:

```text
unavailable
serializationFailure
storageFailure
```

into one generic failure status.

Those categories remain meaningful for later retry/recovery policy.

---

# Initialization Semantics

Both retained surface statuses must initialize to:

```text
unknown
```

unless current executable evidence proves a stronger claim is justified.

For Task 1.27, `unknown` is the required default.

Conceptually:

```ts
{
  activeState: "unknown",
  profiles: "unknown",
}
```

Rationale:

Store creation may:

* load an existing persisted representation;
* normalize historical data in memory;
* construct default state when storage is absent;
* accept explicit seeded initial state;
* encounter conditions where current runtime data has not been written during this store lifetime.

None of those conditions alone proves that the **current runtime representation** has been durably synchronized through the current persistence contract.

Therefore do not infer:

```text
successful hydration = durable
```

and do not infer:

```text
default state = durable
```

Task 1.27 retains only persistence knowledge established by an observable durable operation during the current store lifetime.

---

# Store-Lifetime Semantics

Retained durability status is ephemeral store infrastructure state.

It is not itself persisted.

On a new store instance:

```text
activeState = unknown
profiles = unknown
```

again.

Do not attempt to rehydrate durability status.

Do not create a durability metadata key.

Do not infer previous store-instance status from local-storage contents.

---

# Active-State Write Semantics

For every active authored-state persistence operation:

```text
runtime transition
    ↓
persistState(...)
    ↓
Task 1.24 outcome
    ↓
Task 1.26 mutation result
    ↓
update active retained status
```

Required mapping:

```text
persisted
    → activeState = durable

unavailable
    → activeState = unavailable

serializationFailure
    → activeState = serializationFailure

storageFailure
    → activeState = storageFailure
```

The profile retained status must remain unchanged.

---

# Setup Commit Semantics

`commitAuthoredSetup` must:

1. preserve its current runtime transition;
2. preserve Preview-staleness semantics;
3. preserve one active persistence attempt;
4. preserve its Task 1.26 result;
5. update active retained durability status from that same persistence outcome;
6. leave profile durability status unchanged;
7. notify state subscribers exactly once as before.

No additional persistence attempt is permitted.

---

# Narrow Authored Setter Semantics

Each persisting authored setter must follow the same active-surface rule.

At minimum inspect:

* `setSchedulingPreferences`;
* `setPreviewRange`;
* `setShiftDefinitions`;
* `setShiftCycles`;
* `setBlockTemplates`;
* `setBlockRecurrences`;
* `setManualEvents`.

Do not create setter-specific durability semantics.

All represent writes of the current active authored-state snapshot.

---

# Manual-Event Semantics

`setManualEvents` must update active retained durability status from its existing active persistence result.

Preserve all current manual-event workflow behavior.

The UI must not begin reading the retained status in this task.

---

# Profile Save Semantics

`saveProfile` affects the profile durable surface only.

Required mapping:

```text
profile persistence = persisted
    → profiles = durable

profile persistence = unavailable
    → profiles = unavailable

profile persistence = serializationFailure
    → profiles = serializationFailure

profile persistence = storageFailure
    → profiles = storageFailure
```

Active retained durability status remains unchanged.

Preserve:

* runtime profile creation/replacement;
* IDs;
* timestamps;
* cloning;
* collection ordering;
* notification behavior;
* Task 1.26 mutation result;
* UI behavior.

---

# Profile Delete Semantics

`deleteProfile` affects the profile durable surface only.

A successful persisted profile collection after deletion means:

```text
profiles = durable
```

A failed profile persistence attempt maps to its exact retained failure category.

Do not roll back the runtime deletion.

Active durability remains unchanged.

---

# Profile Load Semantics

`loadProfile` changes active runtime authored state and persists that active state.

It does not rewrite profile storage.

Therefore:

```text
loadProfile
    ↓
active persistence outcome
    ↓
active retained status changes

profiles retained status
    ↓
unchanged
```

Preserve:

* source profile collection;
* runtime authored replacement;
* Preview clearing;
* Task 1.26 mutation result;
* notification behavior;
* UI behavior.

---

# Backup Import Semantics

`importBackup` changes active runtime authored state and persists active authored state.

Therefore it affects:

```text
activeState
```

only.

It does not create or modify a retained backup-file durability surface.

Preserve backup parsing and validation behavior.

---

# Clear Semantics

`clearLocalData` affects both retained surfaces independently.

Task 1.26 already exposes:

```ts
{
  state,
  activeState,
  profiles,
  durability
}
```

where `activeState` and `profiles` are exact removal outcomes and `durability` is the aggregate clear classification.

Task 1.27 must update retained status from the exact per-surface outcomes.

Required mapping:

```text
active removal = removed
    → retained activeState = durable

active removal = unavailable
    → retained activeState = unavailable

active removal = storageFailure
    → retained activeState = storageFailure
```

and independently:

```text
profile removal = removed
    → retained profiles = durable

profile removal = unavailable
    → retained profiles = unavailable

profile removal = storageFailure
    → retained profiles = storageFailure
```

Do not derive retained status solely from:

```text
cleared
partiallyCleared
notCleared
```

because the aggregate loses which surface succeeded.

---

# Meaning of `durable` After Clear

After a successful removal:

```text
surface status = durable
```

means:

> The current runtime condition for this surface—cleared/reset/no persisted authored representation—was successfully established through the durable operation.

It does not mean data exists in storage.

This semantic distinction must be documented in code/tests if naming could otherwise be ambiguous.

---

# Partial Clear Example

Given:

```text
active removal = removed
profile removal = storageFailure
```

Task 1.26 returns:

```text
durability = partiallyCleared
```

Task 1.27 must retain:

```text
activeState = durable
profiles = storageFailure
```

A later caller must be able to determine which surface remains non-durable.

---

# Later Successful Convergence

Task 1.25 established that DayFrame persists complete current snapshots.

Therefore a later successful write may establish that the **current surface** is durable even if an earlier mutation failed.

Example:

```text
setShiftCycles(...)
    persistence = storageFailure

retained:
    activeState = storageFailure

later:

setSchedulingPreferences(...)
    persistence = persisted

retained:
    activeState = durable
```

This does not claim that the earlier intermediate snapshot was ever persisted.

It claims only that the later complete current snapshot was successfully persisted.

This distinction must remain explicit.

---

# Later Failure After Success

The inverse also applies.

Example:

```text
activeState = durable

later mutation
    persistence = storageFailure

activeState = storageFailure
```

The retained status reflects the latest known relationship between **current runtime state** and durable storage.

It is not a historical success flag.

---

# No Historical Failure Log

Do not retain:

* previous statuses;
* timestamps;
* failed operation names;
* failed snapshots;
* failure counters;
* exception messages.

Task 1.27 retains current durability knowledge only.

Historical diagnostics or observability are separate concerns.

---

# Storage-Unavailable Semantics

`unavailable` must remain a first-class retained status.

It means:

```text
current runtime state exists
    +
durable synchronization is not confirmed
    +
storage was unavailable
```

Do not interpret it as:

* runtime mutation failure;
* fatal application failure;
* equivalent to `durable`;
* generic `storageFailure`.

No UI behavior is added yet.

---

# Serialization-Failure Semantics

`serializationFailure` must remain distinguishable for write operations.

It means the current runtime snapshot was not successfully transformed into the serialized durable representation.

Do not collapse it into `storageFailure`.

Removal operations cannot produce `serializationFailure` under the current helper contract.

---

# Storage-Failure Semantics

`storageFailure` represents a persistence/removal failure at the storage-operation boundary currently captured by Task 1.24.

It does not imply runtime rollback.

The runtime state remains session authority.

---

# Storage-Accessor Exception Boundary

Task 1.26 deliberately preserved current behavior when obtaining the storage accessor itself throws before the helper can return a normal outcome.

Task 1.27 must preserve that boundary.

If:

```text
globalThis.localStorage access
```

throws through the current path, Task 1.27 must not silently convert it into:

```text
storageFailure
```

merely so retained status can be updated.

In that exceptional path:

* preserve current throw behavior;
* do not fabricate a retained outcome;
* do not notify differently;
* do not retry;
* record the limitation in the result artifact.

A separately authorized task may normalize accessor exceptions later.

---

# Required Store-Level Location

Retained durability status belongs inside store infrastructure but outside `DayFrameState`.

The preferred implementation is store-owned closure state or an equivalent private store-level representation associated with the `DayFrameStore` instance.

Conceptually:

```text
createDayFrameStore(...)
    |
    ├── current DayFrameState
    |
    ├── current StoreDurabilityStatus
    |
    └── state subscribers
```

Do not:

* add durability to domain state;
* create another Zustand/domain store;
* create a global singleton;
* create a persistence service;
* persist the status.

---

# `DayFrameState` Separation Requirement

`DayFrameState` must remain unchanged by this task.

No properties such as:

```text
durability
durabilityStatus
persistence
persistenceStatus
activePersistence
profilePersistence
dirty
pending
unsaved
```

may be added.

Retained durability status must not appear in:

* state snapshots;
* state clones;
* subscriber payloads;
* authored setup;
* local persistence;
* saved profiles;
* backups;
* scheduling input;
* Preview output.

---

# Required Read Boundary

Expose retained status through the smallest store-owned synchronous read boundary.

Expected contract:

```ts
getDurabilityStatus(): StoreDurabilityStatus;
```

or repository-equivalent naming.

The accessor must:

* return the current active-state status;
* return the current profile status;
* not mutate store state;
* not perform persistence;
* not notify subscribers;
* not expose mutable store-owned status by reference.

If the retained representation consists only of primitive strings inside a new object, returning a fresh object is sufficient.

---

# Accessor Snapshot Semantics

A value returned by:

```text
getDurabilityStatus()
```

is a snapshot of retained durability knowledge at the time of the call.

Mutating the returned object, if technically possible, must not mutate the store's internal status.

The accessor is not a subscription.

---

# Subscription Determination

Task 1.27 must inspect current production consumers before adding any reactive durability mechanism.

The expected result is:

```text
no current reactive consumer
    ↓
accessor only
```

Do not add:

* `subscribeDurability`;
* durability listeners;
* combined state/durability subscriptions;
* additional callbacks on state subscribers;

merely because future UI will need them.

If executable inspection discovers an existing production consumer that genuinely cannot satisfy its current contract without reactive durability observation, stop and record that discrepancy unless the requirement can be met within this task without changing UI semantics.

The absence of a current consumer is not a defect.

The store should own the truth before workflows consume it.

---

# State Subscriber Contract

Existing state subscribers continue to receive only:

```text
DayFrameState
```

They must not receive:

```text
StoreDurabilityStatus
```

or a combined object.

Durability status changes must not independently trigger the existing state subscriber.

A normal persisting mutation must continue to produce the same single state notification as before.

---

# Required Mutation Ordering

Preserve the established Task 1.26 ordering.

For a normal persisting mutation:

```text
runtime assignment
    ↓
persistence attempt
    ↓
capture persistence outcome
    ↓
update retained durability status
    ↓
notify state subscribers once
    ↓
return Task 1.26 result
```

The durability-status update is internal and must not create another notification.

Do not change to persistence-first behavior.

Do not notify before persistence.

Do not add rollback.

---

# Clear Ordering

Preserve the current executable clear ordering established by Task 1.26.

Conceptually:

```text
runtime reset
    ↓
active removal attempt
    ↓
capture active outcome
    ↓
profile removal attempt
    ↓
capture profile outcome
    ↓
update both retained statuses
    ↓
notify once
    ↓
return clear result
```

If the current implementation updates/captures in a slightly different but behaviorally equivalent sequence, preserve the current executable contract rather than refactoring for diagram purity.

Record the actual final order.

---

# Mutation Result Preservation

Task 1.26 result contracts remain unchanged.

Persisting mutations continue returning implementation-equivalent:

```ts
{
  state: DayFrameState;
  persistence: PersistenceWriteOutcome;
}
```

Clear continues returning implementation-equivalent:

```ts
{
  state: DayFrameState;
  activeState: PersistenceRemovalOutcome;
  profiles: PersistenceRemovalOutcome;
  durability: "cleared" | "partiallyCleared" | "notCleared";
}
```

Do not add retained durability status to those results.

Immediate results and retained status have separate responsibilities:

```text
operation result
    = what this operation observed

retained status
    = what the store currently knows about each durable surface
```

---

# No Duplicate Persistence Interpretation

Do not inspect browser storage after a mutation to decide retained status.

Do not infer success from storage contents.

Do not call persistence twice.

Use the exact outcome already returned by the Task 1.24 helper and exposed through the Task 1.26 mutation path.

The flow should remain:

```text
one persistence operation
    ↓
one factual outcome
    ├── immediate mutation result
    └── retained durability update
```

---

# Non-Persisting Operations

Operations that do not perform a durable write/removal must not alter retained durability status.

Inspect at minimum representative operations such as:

* Preview generation;
* Preview revision;
* backup-object/export-data creation;
* pure reads.

Do not update durability status simply because runtime derived state changed.

Durability status tracks the two durable authored surfaces only.

---

# Seeded Store / Explicit Initial State

If `createDayFrameStore` accepts explicit initial runtime state for tests or supported construction, that must not cause retained status to initialize as `durable`.

The initial status remains:

```text
unknown
```

until a relevant persistence operation establishes a factual outcome.

Do not infer that caller-provided initial state has a durable counterpart.

---

# Profile Initialization

Loading profile storage during store creation likewise must not establish:

```text
profiles = durable
```

for Task 1.27.

Successful reading/normalization establishes usable runtime profile data, not proof that the current normalized in-memory representation was written through the current persistence path.

Initial status remains `unknown`.

---

# Legacy Rehydration

Legacy singular compatibility readers remain unchanged.

If a legacy local payload is normalized into current plural runtime state during startup:

```text
activeState durability = unknown
```

until a later persistence operation occurs.

Do not treat compatibility normalization as a durable migration marker.

This preserves the distinction established by the durable-data ADR and Task 1.20.

---

# Migration Separation

Retained store durability status is not migration evidence.

Do not use:

```text
activeState = durable
```

to claim that all historical data has migrated.

Do not use:

```text
profiles = durable
```

as proof that all profile payloads across installations have converged.

Task 1.27 is store-instance operational durability only.

Migration evidence remains a separate governance and implementation concern.

---

# UI / Workflow Preservation

No current UI workflow should consume `getDurabilityStatus()` during Task 1.27.

Do not change:

* Setup save confirmation;
* profile save confirmation;
* profile delete confirmation;
* profile load confirmation;
* manual-event behavior;
* backup import success;
* clear success;
* navigation;
* Preview generation;
* Preview staleness;
* error messages.

Known false-success messaging after persistence failure remains intentionally deferred.

This task creates the store truth that later UI work can consume.

---

# No Retry Yet

Do not add:

```text
retryPersistence
retryActivePersistence
retryProfilePersistence
retryFailedWrite
```

or equivalent.

Do not:

* retry automatically;
* retry on the next mutation specially;
* queue failed mutations;
* retain failed snapshots for replay;
* retry on focus;
* retry on reconnect;
* retry on startup.

Normal later full-snapshot persistence may naturally replace a failed retained status with `durable`; that is not a retry mechanism.

---

# No Rollback

Persistence failure must continue to leave the runtime mutation applied.

Do not:

* restore the previous runtime state;
* restore a deleted runtime profile;
* restore pre-import authored state;
* undo clear;
* suppress subscriber notification because persistence failed.

Session-first runtime authority remains unchanged.

---

# No Recovery UX

Do not add:

* persistence banners;
* warning icons;
* toast messages;
* unsaved indicators;
* recovery dialogs;
* reload warnings;
* checkpoint restoration;
* export prompts;
* profile recovery actions.

Those require later workflow decisions.

---

# Caller Audit Requirement

Before implementation, inspect all current callers of affected store mutation methods and all store construction consumers.

Determine:

1. whether any current caller needs retained durability after the immediate method return;
2. whether any current caller requires reactive durability updates;
3. whether any current UI already has an infrastructure-status concept;
4. whether introducing the accessor requires any production caller changes.

Expected result:

```text
store API gains accessor
    ↓
no production caller uses it yet
```

That is acceptable.

Record any unexpected dependency.

---

# Required Surface Matrix

Verify and document behavior equivalent to:

| Operation                              | Active Status Changes? | Profile Status Changes? |
| -------------------------------------- | ---------------------: | ----------------------: |
| `commitAuthoredSetup`                  |                    Yes |                      No |
| scheduling-preference setter           |                    Yes |                      No |
| Preview-range setter                   |                    Yes |                      No |
| shift-definition setter                |                    Yes |                      No |
| shift-cycle setter                     |                    Yes |                      No |
| block-template setter                  |                    Yes |                      No |
| recurrence setter                      |                    Yes |                      No |
| manual-event setter                    |                    Yes |                      No |
| `saveProfile`                          |                     No |                     Yes |
| `deleteProfile`                        |                     No |                     Yes |
| `loadProfile`                          |                    Yes |                      No |
| `importBackup`                         |                    Yes |                      No |
| `clearLocalData`                       |                    Yes |                     Yes |
| Preview generation                     |                     No |                      No |
| Preview revision                       |                     No |                      No |
| backup creation/export-data generation |                     No |                      No |

Adjust names only if current executable APIs differ.

Do not silently omit a persisting operation discovered during implementation.

---

# Required Tests

Add focused store-level executable evidence for the retained contract.

At minimum cover all sections below.

## Test 1 — Initial Durability Status

Immediately after store creation, assert:

```text
activeState = unknown
profiles = unknown
```

This must hold for ordinary/default store construction.

## Test 2 — Seeded Store Remains Unknown

If explicit initial state is supported, prove that constructing a store with seeded runtime authored state does not falsely mark active durability as `durable`.

## Test 3 — Active Persistence Success

Perform a representative active authored mutation with successful persistence.

Assert:

* runtime state is updated;
* mutation result reports `persisted`;
* retained active status becomes `durable`;
* retained profile status remains unchanged;
* subscriber fires exactly once.

## Test 4 — Active Storage Failure

Inject an ordinary Task 1.24-captured active storage failure.

Assert:

* runtime state remains updated;
* mutation result reports `storageFailure`;
* retained active status becomes `storageFailure`;
* profile status remains unchanged;
* subscriber fires exactly once;
* no rollback occurs.

## Test 5 — Active Storage Unavailable

Exercise unavailable active persistence.

Assert:

* runtime state remains updated;
* mutation result reports `unavailable`;
* retained active status becomes `unavailable`;
* profile status remains unchanged.

## Test 6 — Active Serialization Failure

Where safely testable through the current store test boundary, establish:

```text
serializationFailure
    ↓
retained activeState = serializationFailure
```

Do not introduce invalid public production flows merely to manufacture the case.

If direct store-level injection is structurally inappropriate, preserve Task 1.24 and Task 1.26 coverage and document why the mapping itself is tested at the narrowest internal boundary.

## Test 7 — Profile Save Success

Perform profile save with successful profile persistence.

Assert:

* runtime profile state is updated;
* Task 1.26 result reports `persisted`;
* retained profiles status becomes `durable`;
* active status remains unchanged.

## Test 8 — Profile Persistence Failure

Exercise a failed profile save or delete.

Assert:

* runtime profile mutation remains applied;
* immediate result reports the exact failure;
* retained profiles status reflects the exact normalized failure category;
* active status remains unchanged.

## Test 9 — Profile Delete Success

Prove a successful profile deletion establishes:

```text
profiles = durable
```

without altering active durability.

## Test 10 — Profile Load Affects Active Only

Load a profile.

Assert:

* active authored runtime state changes as before;
* active persistence result drives retained active status;
* retained profile status remains unchanged.

## Test 11 — Backup Import Affects Active Only

Import a valid backup.

Assert:

* runtime authored state changes as before;
* active persistence outcome drives active retained status;
* profile retained status remains unchanged.

## Test 12 — Clear Both Successful

When both removal operations return `removed`, assert:

```text
retained activeState = durable
retained profiles = durable
```

and Task 1.26 clear result remains:

```text
durability = cleared
```

## Test 13 — Clear Partial Failure

Exercise at least one partial-clear combination.

For example:

```text
active = removed
profiles = storageFailure
```

Assert:

```text
retained activeState = durable
retained profiles = storageFailure
```

while the immediate result remains:

```text
durability = partiallyCleared
```

## Test 14 — Clear Both Non-Successful

Exercise a both-non-success case.

Assert each retained surface independently reflects its exact mapped condition and the immediate clear aggregate remains:

```text
notCleared
```

## Test 15 — Later Active Convergence

Cause:

```text
active write → storageFailure
```

then:

```text
later active write → persisted
```

Assert:

```text
active retained status:
storageFailure → durable
```

No historical failure record should remain.

## Test 16 — Later Profile Convergence

Where practical, establish the equivalent profile transition:

```text
profile failure → later profile persisted
```

and assert:

```text
profiles → durable
```

## Test 17 — Later Failure Replaces Success

Establish:

```text
durable
    ↓
later failed write
    ↓
failure status
```

for at least one surface.

This proves retained status describes the current runtime/durable relationship rather than historical success.

## Test 18 — Non-Persisting Operation Does Not Change Status

After establishing a known retained status, execute a representative non-persisting operation.

Assert retained durability status is unchanged.

## Test 19 — Accessor Snapshot Isolation

Retrieve durability status.

Attempt to mutate the returned representation where applicable.

Assert the store's subsequent durability status remains unchanged.

If the returned type is naturally immutable/primitives, establish equivalent snapshot independence.

## Test 20 — Accessor Does Not Notify

Call the durability accessor and assert no runtime-state subscriber notification occurs.

## Test 21 — Durability Outside `DayFrameState`

Assert through type/reference inspection and appropriate runtime coverage that durability status is not present in the state snapshot delivered by the store.

Do not add a brittle enumeration test if existing structural/type evidence is stronger.

---

# Existing Tests to Preserve

Preserve Task 1.26 coverage proving:

* mutation result state matches runtime state;
* exact persistence outcomes survive;
* clear aggregation works;
* subscriber notification count remains one;
* UI behavior remains unchanged.

Do not rewrite those tests to make retained status replace immediate-result coverage.

Both contracts should remain independently protected.

---

# Store Interface Requirements

Update the `DayFrameStore` public contract to expose the retained read boundary.

Expected:

```ts
getDurabilityStatus(): StoreDurabilityStatus;
```

or equivalent.

Do not expose direct mutable fields such as:

```ts
durabilityStatus: StoreDurabilityStatus;
```

if callers could mutate store-owned infrastructure state.

Prefer a read method consistent with existing store encapsulation.

---

# Type Placement

Place durability types in the narrowest existing state/store type location that matches repository organization.

Do not add them to domain scheduling types.

Do not create a new file solely to hold two small durability unions unless existing organization clearly favors that structure.

The types are infrastructure/store contracts.

---

# Expected Files to Change

Likely executable files:

* `code/src/state/types.ts`;
* `code/src/state/dayFrameStore.ts`;
* `code/src/state/tests/dayFrameStore.test.ts`.

Additional state test files may change if the existing persistence-injection fixtures live elsewhere.

`DayFrameApp.tsx` is not expected to change.

No UI file should change merely to consume retained durability status.

---

# Reference Validation

After implementation, perform repository/reference inspection sufficient to verify:

* `StoreDurabilityStatus` or equivalent exists;
* `SurfaceDurabilityStatus` or equivalent exists;
* `DayFrameState` contains no durability field;
* the store owns retained status;
* the store initializes both surfaces to `unknown`;
* all active persisting mutations update active status;
* profile save/delete update profile status;
* profile load does not update profile status;
* backup import does not create backup durability status;
* clear updates both statuses independently;
* non-persisting operations do not update durability;
* Task 1.26 result shapes remain unchanged;
* state subscriber payload remains `DayFrameState`;
* no durability subscription was introduced without evidence;
* no production UI consumes retained status;
* no retry API exists;
* no rollback exists;
* no durability metadata is persisted;
* no schema/version/storage-key change occurred.

---

# Explicit Non-Goals

Task 1.27 shall not:

* add durability fields to `DayFrameState`;
* persist durability status;
* rehydrate durability status;
* mark hydration itself as durable;
* mark default state itself as durable;
* change Task 1.26 mutation-result shapes;
* add durability status to mutation results;
* add a durability subscription without demonstrated current need;
* change the existing state subscription;
* add retry APIs;
* retry automatically;
* queue failed writes;
* retain failed snapshots;
* add rollback;
* add transaction semantics;
* add pending/dirty flags;
* add UI feedback;
* change success/error language;
* change Setup behavior;
* change manual-event behavior;
* change profile workflow behavior;
* change backup workflow behavior;
* change clear workflow messaging;
* normalize storage-accessor exceptions;
* add read-failure recovery;
* add backup-download completion detection;
* add migration markers;
* use retained status as migration evidence;
* add telemetry;
* add persistence history;
* add timestamps;
* add error-object retention;
* introduce a persistence service;
* alter local-storage keys;
* alter schemas;
* increment versions;
* alter validators;
* alter normalizers;
* remove compatibility readers;
* resolve unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.24 — Make Durable-Write Outcomes Observable at the Persistence-Helper Boundary;
* Task 1.25 — Establish Store-Level Durability Outcome Semantics;
* Task 1.26 — Expose Persistence Outcomes Through Store Mutation Results.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

Dependency relationship:

```text
Task 1.24
factual helper outcomes
        ↓
Task 1.25
architectural meaning
        ↓
Task 1.26
immediate store mutation results
        ↓
Task 1.27
retained store durability knowledge
```

---

# Evidence Standards

The retained status must express only what the store actually knows.

`durable` means:

> The latest relevant persistence/removal operation successfully established the current store surface condition through the supported persistence helper.

It does not mean:

* permanent storage is metaphysically guaranteed;
* browser data can never be cleared externally;
* every historical intermediate state was persisted;
* every user installation has migrated;
* backup recovery is guaranteed.

`unknown` means:

> This store instance has not yet established a relevant persistence fact for the current surface through an observed persistence/removal outcome.

It does not mean failure.

Failure statuses mean runtime state may still be valid and authoritative for the session.

Do not overstate any of these claims.

---

# ADR Alignment

Task 1.27 should improve alignment with:

* explicit persistence observability;
* user-data preservation;
* deterministic state ownership;
* failure transparency;
* recovery readiness;
* separation of runtime authority from durable recovery authority;
* epistemic integrity.

Specifically, it prevents an observed persistence failure from disappearing merely because the initiating mutation caller ignored its result.

Task 1.27 does **not** yet complete:

* user-visible persistence communication;
* retry execution;
* recovery workflow;
* migration evidence;
* unsupported-read handling;
* backup recovery UX.

Do not claim full durable-data alignment.

---

# Validation Requirements

Run focused tests for the store durability contract.

At minimum include relevant:

```text
dayFrameStore tests
profile tests where required
backup tests where required
DayFrameApp tests if any type/caller impact unexpectedly occurs
```

Then run the repository standard sequence:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Also run:

```text
git diff --check
```

for affected executable files or the relevant worktree scope.

Record:

* focused test files;
* focused test count;
* full test-file count;
* full test count;
* number of tests added;
* lint result;
* typecheck result;
* build result;
* diff-check result.

Confirm:

* Task 1.27 artifact remained unchanged;
* result artifact was created separately;
* no unrelated executable change occurred;
* no UI semantics changed;
* no durable-data format changed;
* no storage key changed;
* no version changed.

---

# Documentation Rules

During Task 1.27:

## Create

* `TASK_1.27_RETAIN_STORE_LEVEL_DURABILITY_STATUS_OUTSIDE_DAYFRAME_STATE_RESULT.md`

## Preserve

* Task 1.27 specification;
* Task 1.26 result;
* Task 1.25 result;
* Task 1.24 result;
* Task 1.23 result;
* durable-data ADR;
* current architecture documentation;
* historical task/result artifacts;
* existing checkpoints.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* durable-data ADR;
* Session Checkpoint.

Those updates require project review.

Do not create a task-specific checkpoint.

---

# Required Result Artifact Structure

The Task 1.27 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Durable Surfaces
6. Durability Status Contract
7. Initialization Semantics
8. Store-Lifetime Semantics
9. Outcome-to-Status Mapping
10. Active-State Status Integration
11. Setup Commit Integration
12. Narrow Setter Integration
13. Manual-Event Integration
14. Profile Save Integration
15. Profile Delete Integration
16. Profile Load Integration
17. Backup Import Integration
18. Clear Integration
19. Later Convergence
20. Accessor
21. Subscription Determination
22. `DayFrameState` Separation
23. Mutation Result Preservation
24. Subscriber Preservation
25. UI Preservation
26. Storage-Accessor Exception Boundary
27. Migration Separation
28. Tests Added or Updated
29. Reference Validation
30. ADR Alignment Improvement
31. Deviations
32. Discoveries and Deferred Work
33. Recommended Next Task
34. Validation
35. Final Completion Determination

---

# Expected Architectural Result

Before Task 1.27:

```text
runtime state
    = current session truth

mutation result
    = immediate persistence truth

after caller returns:
    persistence truth may be forgotten
```

After Task 1.27:

```text
                 DayFrameStore
                      |
          ┌───────────┴───────────┐
          |                       |
          v                       v
    DayFrameState          DurabilityStatus
    runtime truth          infrastructure truth
          |                       |
          v                       v
      subscribe()       getDurabilityStatus()
```

Mutation flow:

```text
runtime mutation
    ↓
persistence attempt
    ↓
factual outcome
    ├──────────────→ mutation result
    |
    └──────────────→ retained surface status
                          ↓
                    future recovery seam
```

No UI behavior changes yet.

---

# Expected Follow-Up

If Task 1.27 completes cleanly, the next dependency-correct work should investigate the retry boundary before implementing it.

The likely question is:

> Given a retained non-durable surface status, what exact current snapshot should the store retry, which persistence helper owns that retry, what happens when the retry succeeds or fails, and how should active-state and profile retry semantics differ?

A likely sequence is:

```text
Task 1.27
retained durability status
        ↓
Task 1.28
investigate retry ownership and semantics
        ↓
later bounded implementation
store-owned retry
        ↓
later
workflow durability feedback and recovery
```

Do not implement retry as part of Task 1.27.

The investigation should specifically consider whether profiles can safely retry from the current in-memory profile collection and whether active authored state can retry from the current runtime snapshot without preserving the original failed mutation.

---

# Completion Criteria

Task 1.27 is complete when:

* a retained store-level durability contract exists;
* active authored state and profiles have independent retained statuses;
* both statuses initialize to `unknown`;
* retained durability state lives outside `DayFrameState`;
* retained durability state is not persisted;
* active writes update only active retained status;
* profile writes update only profile retained status;
* profile load updates active status only;
* backup import updates active status only;
* clear updates both statuses independently from exact removal outcomes;
* `persisted` normalizes to `durable`;
* `removed` normalizes to `durable`;
* `unavailable` remains distinguishable;
* `serializationFailure` remains distinguishable for writes;
* `storageFailure` remains distinguishable;
* later successful full-snapshot writes replace prior failure status with `durable`;
* later failed writes replace prior `durable` status with the relevant failure;
* no historical failure log is introduced;
* a synchronous store-level durability accessor exists;
* accessor results cannot mutate store-owned durability status;
* no durability subscription is introduced unless current executable need proves one is required;
* Task 1.26 mutation result contracts remain unchanged;
* state subscriber payload remains `DayFrameState`;
* state subscriber notification semantics remain unchanged;
* runtime authority remains session-first;
* no rollback is introduced;
* no retry is introduced;
* no UI behavior changes;
* no storage-accessor behavior is broadened;
* no migration semantics change;
* no durable format/schema/key/version changes;
* compatibility readers remain unchanged;
* focused tests directly establish retained durability semantics;
* full repository validation passes;
* the result artifact records the next dependency-correct seam.

---

# Task Determination

Task 1.27 is a bounded store-infrastructure implementation.

It does not change DayFrame's domain state, scheduling behavior, persistence formats, runtime authority, or user workflows.

Its purpose is to make already-observed persistence knowledge survive beyond the immediate mutation call.

After Task 1.27, DayFrame should be able to distinguish:

```text
What is true in the current session?
    → DayFrameState

What does the store currently know about durability?
    → StoreDurabilityStatus

What happened during this specific mutation?
    → StoreMutationResult / ClearLocalDataResult
```

Those three contracts must remain distinct.

Task 1.27 establishes the retained durability layer needed before retry and user-facing recovery can be designed coherently.

**The task is complete when the store retains explicit active-state and profile durability status outside `DayFrameState`, updates that status from existing mutation outcomes, exposes it through the smallest justified read boundary, preserves all current runtime/subscriber/UI behavior, and directly protects the retained-status contract with tests.**

