# Implementation Task 1.29 — Retain Per-Surface Desired Durable Condition Outside `DayFrameState`

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.29

**Task Name:** Retain Per-Surface Desired Durable Condition Outside `DayFrameState`

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.29_RETAIN_PER_SURFACE_DESIRED_DURABLE_CONDITION_OUTSIDE_DAYFRAME_STATE_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* desired-durable-condition contract introduced;
* initialization semantics;
* active-state integration;
* profile integration;
* clear integration;
* mutation-after-clear replacement behavior;
* clear-after-mutation replacement behavior;
* accessor determination;
* retry-readiness result;
* retained durability-status preservation;
* `DayFrameState` separation preserved;
* subscriber/UI preservation;
* tests added or updated;
* validation performed and results;
* deviations from authorized scope, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires adding retry APIs, automatic retry, UI feedback, a durability subscription, new persistence behavior, storage-accessor normalization, migration markers, changes to `DayFrameState`, mutation-result changes, subscriber changes, or durable-format changes, stop the affected work and record the discrepancy rather than expanding Task 1.29.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Desired Durable Condition Contract;
* Initialization Semantics;
* Operation Integration Requirements;
* Replacement Semantics;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when the store privately retains the current desired durable condition for active state and profiles, updates each condition deterministically between `snapshot` and `absent` from existing mutation and clear paths, preserves all current durability/runtime/subscriber/UI behavior, and directly protects intent replacement with tests without implementing retry.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Retain the current desired durable condition for each store-owned durable surface.

Task 1.28 established that DayFrame retry authority should be based on:

> **the current desired durable condition**

rather than:

* the original failed mutation;
* the last failed snapshot;
* workflow command replay;
* historical operation queues.

For ordinary persistence:

```text
desired durable condition = snapshot
```

For clear:

```text
desired durable condition = absent
```

Task 1.28 also established that the existing retained durability status is insufficient by itself to distinguish those conditions.

For example:

```text
activeState = storageFailure
```

does not tell the store whether the failed durable intent was:

```text
persist current snapshot
```

or:

```text
remove the key
```

Task 1.29 adds only that missing fact.

It does not implement retry.

---

# Architectural Context

After Task 1.27, the store owns:

```text
DayFrameState
    = current runtime/session truth

StoreDurabilityStatus
    = current known durability relationship
```

Task 1.28 established a third infrastructure concept:

```text
DesiredDurableCondition
    = what durable representation the store currently intends
```

The resulting conceptual model is:

```text
DayFrameStore
    |
    ├── DayFrameState
    |      current runtime truth
    |
    ├── StoreDurabilityStatus
    |      current durability knowledge
    |
    └── DesiredDurableCondition
           current durable intent
```

These three concepts must remain separate.

---

# Governing Evidence

Task 1.28 determined:

## Ordinary active authored state

Retry source should eventually be the latest complete current authored runtime snapshot.

Therefore ordinary active persistence establishes:

```text
active desired condition = snapshot
```

## Saved profiles

Retry source should eventually be the latest complete current profile collection.

Therefore profile save/delete establishes:

```text
profiles desired condition = snapshot
```

## Clear

Clear is semantically different.

The desired durable condition after clear is:

```text
absence
```

not:

```text
persist default active state
```

and not:

```text
persist empty profile collection
```

Therefore clear establishes:

```text
active desired condition = absent
profiles desired condition = absent
```

Task 1.29 makes those distinctions executable.

---

# Governing Architectural Contract

The store should eventually retry:

```text
current desired durable condition
```

not:

```text
historical failed operation
```

Task 1.29 therefore retains **intent kind only**.

It must not retain:

* the original failed mutation;
* previous state;
* failed serialized payload;
* timestamps;
* operation history;
* command names;
* mutation queues;
* backup source;
* profile source.

The current store state remains sufficient to reconstruct snapshot intent later.

---

# Objective

Introduce the smallest private store-level representation that:

1. retains desired durable condition for active authored state;
2. retains desired durable condition for saved profiles;
3. distinguishes `snapshot` from `absent`;
4. initializes without inventing failed-operation history;
5. changes active intent to `snapshot` on ordinary active persistence paths;
6. changes profile intent to `snapshot` on ordinary profile persistence paths;
7. changes both intents to `absent` on clear;
8. allows later ordinary mutations to replace prior `absent` intent with `snapshot`;
9. allows later clear to replace prior `snapshot` intent with `absent`;
10. remains independent of persistence success or failure;
11. remains outside `DayFrameState`;
12. remains unpersisted;
13. preserves Task 1.27 durability status;
14. preserves Task 1.26 mutation results;
15. preserves all current runtime, subscriber, and UI behavior.

---

# Durable Surfaces In Scope

Exactly two desired-condition surfaces exist for Task 1.29:

```text
activeState
profiles
```

No desired condition is introduced for:

* backup files;
* Preview;
* scheduling output;
* friction;
* suggested fixes;
* individual profiles;
* individual mutations;
* historical compatibility readers.

---

# Required Desired Durable Condition Contract

Introduce a narrow infrastructure type equivalent to:

```ts
type DesiredDurableCondition = "snapshot" | "absent";

type StoreDesiredDurableCondition = {
  activeState: DesiredDurableCondition;
  profiles: DesiredDurableCondition;
};
```

Exact naming may follow repository conventions.

Do not add:

```text
unknown
pending
failed
dirty
retrying
```

to this type.

Those concepts belong elsewhere.

The type answers only:

> What durable condition does the current store session intend for this surface?

---

# Why Desired Condition Is Separate From Durability Status

These questions are different:

```text
What do we want durably?
    → DesiredDurableCondition

Did we successfully establish it?
    → StoreDurabilityStatus
```

Examples:

```text
desired = snapshot
status = durable
```

means the current snapshot was durably established.

```text
desired = snapshot
status = storageFailure
```

means the current snapshot is intended but not confirmed durable.

```text
desired = absent
status = durable
```

means key absence was durably established.

```text
desired = absent
status = storageFailure
```

means key absence is intended but removal failed.

Task 1.29 must preserve this independence.

---

# Initialization Semantics

Task 1.28 allowed implementation discretion around initialization because retry remains gated by retained durability status.

Task 1.29 should choose the smallest coherent internal representation.

The required initialization is:

```text
activeState = snapshot
profiles = snapshot
```

Rationale:

* the store begins with a current active runtime representation;
* the store begins with a current profile collection;
* if a later known non-durable condition occurs, snapshot intent already describes what ordinary persistence would attempt;
* retry remains unavailable from Task 1.27 status `unknown`, so this does not fabricate a failed or retryable operation;
* no persistence claim follows from desired intent.

Thus:

```text
desired = snapshot
status = unknown
```

is valid.

It means:

> The current runtime representation is the intended durable representation if persistence is later attempted, but this store instance has not yet established a durability fact.

Do not initialize desired condition based on whether storage exists.

---

# Store-Lifetime Semantics

Desired durable condition is ephemeral store infrastructure state.

It is not persisted.

On a new store instance:

```text
activeState = snapshot
profiles = snapshot
```

again.

Do not rehydrate desired condition from browser storage.

Do not add another storage key.

---

# Ordinary Active Persistence Semantics

Every ordinary active authored-state mutation establishes:

```text
active desired condition = snapshot
```

before or as part of the persistence attempt.

This includes at minimum:

* `commitAuthoredSetup`;
* `setSchedulingPreferences`;
* `setPreviewRange`;
* `setShiftDefinitions`;
* `setShiftCycles`;
* `setBlockTemplates`;
* `setBlockRecurrences`;
* `setManualEvents`;
* `loadProfile`;
* `importBackup`.

Confirm actual current executable callers.

Profile desired condition remains unchanged.

---

# Desired Intent Does Not Depend on Persistence Success

For an ordinary active mutation:

```text
active desired condition = snapshot
```

whether persistence returns:

```text
persisted
unavailable
serializationFailure
storageFailure
```

The desired durable condition describes intent, not outcome.

Likewise for profiles.

Do not revert desired condition because persistence failed.

---

# Setup Commit Integration

`commitAuthoredSetup` must establish:

```text
active desired condition = snapshot
```

while preserving:

* one runtime transition;
* one persistence attempt;
* retained active durability mapping;
* one subscriber notification;
* Task 1.26 mutation result;
* current UI behavior.

No additional write is permitted.

---

# Narrow Active Setter Integration

Each ordinary persisting active setter establishes:

```text
active desired condition = snapshot
```

No setter-specific desired conditions are needed.

---

# Manual-Event Integration

`setManualEvents` establishes:

```text
active desired condition = snapshot
```

because manual events are part of the complete current authored snapshot.

No manual-event-specific intent state is introduced.

---

# Profile Save Integration

`saveProfile` establishes:

```text
profiles desired condition = snapshot
```

Active desired condition remains unchanged.

This is true whether profile persistence succeeds or fails.

---

# Profile Delete Integration

`deleteProfile` likewise establishes:

```text
profiles desired condition = snapshot
```

because the desired durable representation is now the complete current profile collection **without** the deleted profile.

Do not interpret profile deletion as:

```text
profiles desired condition = absent
```

unless the entire profile-storage surface is being cleared.

A profile collection containing zero profiles is still snapshot intent during ordinary profile persistence.

---

# Profile Load Integration

`loadProfile` establishes:

```text
active desired condition = snapshot
```

because it replaces active runtime state and attempts to persist that state.

It must not alter:

```text
profiles desired condition
```

because profile storage is not rewritten by load.

---

# Backup Import Integration

`importBackup` establishes:

```text
active desired condition = snapshot
```

only.

No backup desired-condition surface exists.

---

# Clear Integration

`clearLocalData` establishes:

```text
active desired condition = absent
profiles desired condition = absent
```

because the intended durable representation is key absence.

This must happen regardless of whether either removal succeeds.

Examples:

```text
active removal = removed
profiles removal = removed

desired:
active = absent
profiles = absent
```

and:

```text
active removal = storageFailure
profiles removal = unavailable

desired:
active = absent
profiles = absent
```

The durability statuses differ, but the durable intent remains absence.

---

# Clear Ordering

Preserve current clear behavior.

Conceptually:

```text
runtime reset
    ↓
set active desired condition = absent
set profile desired condition = absent
    ↓
active removal attempt
    ↓
profile removal attempt
    ↓
durability statuses updated
    ↓
aggregate clear result
    ↓
notify once
    ↓
return unchanged clear result
```

If inserting desired-condition assignment at a slightly different internal point better preserves current structure, that is acceptable provided:

* intent represents the current runtime transition before the method returns;
* no observable behavior changes;
* persistence ordering remains unchanged;
* subscriber ordering remains unchanged.

Record actual final ordering.

---

# Mutation After Clear

This is a mandatory behavior.

Example:

```text
clearLocalData()
    ↓
active desired = absent
profiles desired = absent
```

Then:

```text
setSchedulingPreferences(...)
```

must result in:

```text
active desired = snapshot
profiles desired = absent
```

because the new ordinary active mutation supersedes prior absence intent for the active surface.

This must be directly tested.

---

# Profile Mutation After Clear

Likewise:

```text
clearLocalData()
    ↓
profiles desired = absent
```

then:

```text
saveProfile(...)
```

must establish:

```text
profiles desired = snapshot
```

Active desired condition remains whatever its current value is.

This must be directly tested.

---

# Clear After Ordinary Mutation

Also mandatory.

Example:

```text
active desired = snapshot
profiles desired = snapshot
```

then:

```text
clearLocalData()
```

must produce:

```text
active desired = absent
profiles desired = absent
```

regardless of removal success.

Directly test intent replacement.

---

# Latest Intent Wins

Desired durable condition is not historical.

The rule is:

> **The latest store operation affecting a durable surface determines that surface's current desired durable condition.**

Examples:

```text
snapshot
    ↓ clear
absent
```

```text
absent
    ↓ active mutation
snapshot
```

```text
absent
    ↓ profile save
snapshot
```

No history is retained.

---

# Non-Persisting Operations

Operations that affect neither durable authored surface must not modify desired condition.

Representative examples:

* Preview generation;
* Preview revision;
* backup-object creation/export preparation;
* pure reads.

Derived-state changes do not alter durable authored intent.

---

# Relationship to Retained Durability Status

Task 1.27 status behavior must remain unchanged.

Example:

```text
desired = snapshot
status = storageFailure
```

then later:

```text
clear
```

may produce:

```text
desired = absent
status = storageFailure
```

if removal also fails.

The identical status category does not erase the changed desired condition.

That is the exact ambiguity Task 1.29 resolves.

---

# Relationship to Task 1.26 Mutation Results

Task 1.26 mutation results remain unchanged.

Do not add desired condition to:

```ts
StoreMutationResult
```

or:

```ts
ClearLocalDataResult
```

Immediate operation result remains:

```text
what happened during this operation
```

Desired condition remains:

```text
what durable representation the store currently intends
```

---

# Read Boundary

Task 1.29 does **not** require a public desired-condition accessor.

The metadata exists primarily to support future store-owned retry.

Before adding any accessor, inspect current consumers.

Expected determination:

```text
no current production consumer
    ↓
keep desired condition private
```

If tests can validate desired-condition behavior through a narrow test-supported store boundary already consistent with repository conventions, prefer that.

If direct executable testing requires a store accessor, add only the smallest synchronous read method and document why it is necessary.

Do not add a reactive subscription.

The preferred architecture is private until retry consumes it.

---

# Testing Private Infrastructure

Do not export internal mutable closure state solely for test convenience.

Preferred options, in order:

1. test through a narrow legitimate store read boundary if one already exists;
2. introduce a small immutable synchronous accessor only if direct contract testing requires it and the accessor is architecturally acceptable;
3. avoid brittle source-text assertions as the primary behavioral proof.

The result artifact must state the chosen boundary.

---

# No Durability Subscription

Do not add:

```text
subscribeDurability
subscribeDesiredCondition
```

or any combined infrastructure subscription.

No reactive consumer exists yet.

---

# `DayFrameState` Separation

Do not add desired condition to `DayFrameState`.

It must remain absent from:

* runtime state clones;
* state subscribers;
* local persistence;
* profiles;
* backups;
* authored setup;
* scheduling inputs;
* Preview output.

Desired durable condition is store infrastructure intent only.

---

# Persistence Format Preservation

Do not serialize:

```text
snapshot
absent
```

into any durable format.

Do not modify:

* active local-storage payload;
* profile envelope;
* backup envelope;
* storage keys;
* version numbers.

This metadata exists only to guide future retry behavior during the current store lifetime.

---

# No Retry Implementation

Task 1.29 shall not add:

```text
retryActivePersistence()
retryProfilePersistence()
retryDurability(...)
```

or equivalent.

Do not perform persistence based on desired condition except through already existing ordinary mutation and clear paths.

Task 1.29 retains information only.

---

# No Storage-Accessor Normalization

Task 1.28 identified `globalThis.localStorage` accessor exceptions as a prerequisite to a fully total future retry contract.

Do not normalize those exceptions in Task 1.29.

Preserve current behavior.

Desired condition may already have changed internally before an exceptional persistence path depending on operation ordering; if this creates a meaningful inconsistency, document it rather than expanding scope.

---

# Storage-Accessor Exception Investigation During Implementation

Because desired condition describes intent rather than persistence success, implementation should determine whether it remains correct for intent to update even when storage accessor acquisition throws.

Expected principle:

```text
runtime mutation succeeded
    ↓
desired durable condition reflects runtime intent
```

even if no factual persistence outcome exists.

However, do not change current runtime/notification exception semantics to achieve this.

Record actual behavior.

---

# No Recovery Behavior

Do not add:

* fallback snapshots;
* checkpoint restoration;
* backup re-import;
* profile re-load;
* repair logic;
* serialization diagnostics;
* recovery commands.

Desired condition is retry metadata, not recovery state.

---

# No Historical Payload Retention

Do not retain:

* failed snapshot;
* original snapshot;
* previous profile collection;
* clear command history;
* imported backup;
* source profile;
* serialized JSON;
* mutation parameters.

Current runtime state plus desired-condition kind is sufficient for the adopted retry model.

---

# Required Desired-Condition Matrix

Verify and document:

| Operation                 | Active Desired Condition | Profile Desired Condition |
| ------------------------- | ------------------------ | ------------------------- |
| Store initialization      | `snapshot`               | `snapshot`                |
| Setup commit              | `snapshot`               | unchanged                 |
| Active narrow setter      | `snapshot`               | unchanged                 |
| Manual-event mutation     | `snapshot`               | unchanged                 |
| Profile save              | unchanged                | `snapshot`                |
| Profile delete            | unchanged                | `snapshot`                |
| Profile load              | `snapshot`               | unchanged                 |
| Backup import             | `snapshot`               | unchanged                 |
| Clear local data          | `absent`                 | `absent`                  |
| Preview generation        | unchanged                | unchanged                 |
| Preview revision          | unchanged                | unchanged                 |
| Backup export preparation | unchanged                | unchanged                 |

Adjust only if executable inventory reveals additional persisting operations.

---

# Required Replacement Matrix

Directly establish:

| Prior Intent | Operation                     | Resulting Intent              |
| ------------ | ----------------------------- | ----------------------------- |
| `snapshot`   | clear                         | `absent`                      |
| `absent`     | active mutation               | active → `snapshot`           |
| `absent`     | profile save                  | profiles → `snapshot`         |
| `absent`     | profile delete                | profiles → `snapshot`         |
| any          | clear                         | affected surface → `absent`   |
| any          | ordinary persistence mutation | affected surface → `snapshot` |

This is the core executable contract of Task 1.29.

---

# Required Tests

Add focused store tests.

At minimum cover the following.

## Test 1 — Default Initialization

Assert:

```text
active desired = snapshot
profiles desired = snapshot
```

for a newly created store.

## Test 2 — Seeded Initialization

Explicitly seeded runtime state still initializes:

```text
active desired = snapshot
profiles desired = snapshot
```

No durability claim is implied.

## Test 3 — Active Mutation Establishes Snapshot

Perform a representative active mutation.

Assert:

```text
active desired = snapshot
```

and profile desired condition remains unchanged.

## Test 4 — Active Failure Still Leaves Snapshot Intent

Inject an active persistence failure.

Assert:

```text
desired active = snapshot
durability active = failure category
```

This proves intent and outcome are independent.

## Test 5 — Profile Save Establishes Snapshot

Assert:

```text
profiles desired = snapshot
```

while active desired condition remains unchanged.

## Test 6 — Profile Failure Still Leaves Snapshot Intent

A failed profile persistence operation must still leave:

```text
profiles desired = snapshot
```

with retained durability reflecting the failure separately.

## Test 7 — Profile Delete Means Snapshot, Not Absent

Delete a profile through the ordinary profile mutation path.

Assert:

```text
profiles desired = snapshot
```

even if the resulting collection is empty.

This is important.

## Test 8 — Profile Load Affects Active Only

Assert:

```text
active desired = snapshot
profiles desired = unchanged
```

## Test 9 — Backup Import Affects Active Only

Assert:

```text
active desired = snapshot
profiles desired = unchanged
```

## Test 10 — Clear Establishes Absence

After clear:

```text
active desired = absent
profiles desired = absent
```

regardless of successful removals.

## Test 11 — Failed Clear Still Retains Absence

Inject failed removals.

Assert:

```text
desired active = absent
desired profiles = absent
```

while durability status reflects the failure.

## Test 12 — Partial Clear Still Retains Absence For Both

Even if one removal succeeds and the other fails:

```text
active desired = absent
profiles desired = absent
```

because both surfaces were intended to be cleared.

## Test 13 — Active Mutation After Clear Replaces Active Intent

Sequence:

```text
clear
    ↓
active desired = absent

active mutation
    ↓
active desired = snapshot
profiles desired = absent
```

## Test 14 — Profile Save After Clear Replaces Profile Intent

Sequence:

```text
clear
    ↓
profiles desired = absent

saveProfile
    ↓
profiles desired = snapshot
```

## Test 15 — Profile Delete After Clear Replaces Profile Intent

Where valid through current runtime/profile semantics, establish that an ordinary profile mutation represents snapshot intent even after prior clear.

Do not fabricate impossible domain state merely to exercise this sequence.

## Test 16 — Clear After Snapshot Intent Replaces Both

Establish ordinary snapshot intent, then clear.

Assert:

```text
active = absent
profiles = absent
```

## Test 17 — Non-Persisting Operation Does Not Change Intent

After establishing a known intent combination, perform a representative non-persisting operation.

Assert desired condition remains unchanged.

## Test 18 — No Task 1.27 Status Regression

At least one combined test should prove:

```text
desired condition changes correctly
```

while:

```text
StoreDurabilityStatus
```

continues to follow Task 1.27 outcomes unchanged.

## Test 19 — No Mutation Result Regression

Verify Task 1.26 immediate results remain unchanged for a representative ordinary mutation and clear.

## Test 20 — No State Notification Added

Desired-condition changes must not create an additional state subscriber notification.

Existing persisting operations continue notifying exactly once.

---

# Read/Test Boundary Requirement

If an accessor is introduced for desired condition, it must:

* be synchronous;
* return a snapshot;
* return no mutable internal reference;
* perform no persistence;
* trigger no notifications;
* remain unused by production UI.

If no accessor is required, document the chosen direct behavioral testing strategy.

Do not add a subscription.

---

# Expected Files to Change

Likely executable files:

* `code/src/state/types.ts`;
* `code/src/state/dayFrameStore.ts`;
* `code/src/state/tests/dayFrameStore.test.ts`.

A type may remain private to `dayFrameStore.ts` if no public accessor requires it.

Do not move infrastructure into a new module merely for symmetry.

No UI file is expected to change.

---

# Reference Validation

After implementation verify:

* desired-condition metadata exists for exactly active state and profiles;
* allowed values are only `snapshot | absent`;
* initialization is `snapshot` for both;
* ordinary active writes establish active `snapshot`;
* ordinary profile writes establish profile `snapshot`;
* profile deletion does not establish `absent`;
* clear establishes `absent` for both;
* mutation after clear correctly replaces only the affected surface;
* clear after mutation replaces both;
* durability status remains separate;
* desired condition is outside `DayFrameState`;
* desired condition is not serialized;
* Task 1.26 result types are unchanged;
* Task 1.27 status types are unchanged unless only mechanically extended imports are required;
* no retry exists;
* no desired-condition subscription exists;
* no UI consumes the metadata;
* no durable schema/key/version changed;
* no migration or compatibility behavior changed.

---

# Explicit Non-Goals

Task 1.29 shall not:

* implement retry;
* add retry APIs;
* add automatic retry;
* normalize storage-accessor exceptions;
* add a durability subscription;
* add a desired-condition subscription;
* add UI durability feedback;
* add retry controls;
* add recovery UX;
* add desired condition to `DayFrameState`;
* add desired condition to mutation results;
* persist desired condition;
* rehydrate desired condition;
* add mutation history;
* retain failed snapshots;
* retain imported backups;
* retain profile recovery sources;
* add dirty/pending state;
* add rollback;
* change runtime authority;
* change persistence order;
* change subscriber semantics;
* change UI semantics;
* add migration markers;
* use desired condition as migration evidence;
* change durable schemas;
* change storage keys;
* increment versions;
* change validators;
* change normalizers;
* remove compatibility readers;
* introduce a persistence service;
* resolve unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.27 — Retain Store-Level Durability Status Outside `DayFrameState`;
* Task 1.28 — Establish Store-Owned Durability Retry Semantics and Authority.

Also depends upon the established contracts from:

* Task 1.24;
* Task 1.25;
* Task 1.26.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

Dependency chain:

```text
Task 1.24
factual persistence outcomes
        ↓
Task 1.25
store durability semantics
        ↓
Task 1.26
mutation results
        ↓
Task 1.27
retained durability status
        ↓
Task 1.28
retry semantics
        ↓
Task 1.29
retained desired durable condition
```

---

# Evidence Standards

Desired condition must represent current intent only.

`snapshot` means:

> If the store establishes durability for this surface through ordinary snapshot persistence, the authoritative source is the current complete runtime representation.

`absent` means:

> The current intended durable representation for this surface is absence of its durable key, as established by clear.

Neither value means:

* persistence succeeded;
* retry is currently allowed;
* migration completed;
* data is lost;
* recovery is impossible.

Those claims belong to other contracts.

---

# ADR Alignment

Task 1.29 improves:

* deterministic retry authority;
* protection against stale-snapshot overwrite;
* correct clear semantics;
* explicit infrastructure ownership;
* recovery readiness;
* epistemic integrity.

It preserves the ADR's distinction between current runtime truth and durable representation.

It does not yet implement retry or recovery.

---

# Validation Requirements

Run focused state/store tests covering:

* initialization;
* ordinary snapshot intent;
* failed persistence with snapshot intent;
* clear absence intent;
* failed clear absence intent;
* partial clear;
* mutation-after-clear;
* profile mutation-after-clear;
* clear-after-mutation;
* non-persisting operations;
* retained durability-status preservation;
* mutation-result preservation;
* subscriber-count preservation.

Then run:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Run:

```text
git diff --check
```

for affected files/worktree scope.

Record:

* focused test count;
* full test-file count;
* full test count;
* tests added;
* lint result;
* typecheck result;
* build result;
* diff-check result.

Confirm:

* Task 1.29 specification remained immutable;
* result artifact exists separately;
* no UI semantics changed;
* no persistence behavior changed;
* no schema/key/version changed.

---

# Documentation Rules

During Task 1.29:

## Create

* `TASK_1.29_RETAIN_PER_SURFACE_DESIRED_DURABLE_CONDITION_OUTSIDE_DAYFRAME_STATE_RESULT.md`

## Preserve

* Task 1.29 specification;
* Tasks 1.23–1.28 results;
* durable-data ADR;
* current checkpoint;
* architecture/governance history.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* durable-data ADR;
* Session Checkpoint.

Those require project review.

Do not create a task-specific checkpoint.

---

# Required Result Artifact Structure

The Task 1.29 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Desired Durable Condition Contract
6. Initialization Semantics
7. Store-Lifetime Semantics
8. Active-State Integration
9. Setup Commit Integration
10. Narrow Setter Integration
11. Manual-Event Integration
12. Profile Save Integration
13. Profile Delete Integration
14. Profile Load Integration
15. Backup Import Integration
16. Clear Integration
17. Snapshot/Absence Semantics
18. Mutation After Clear
19. Profile Mutation After Clear
20. Clear After Mutation
21. Latest-Intent-Wins Semantics
22. Relationship to Durability Status
23. Relationship to Mutation Results
24. Read/Test Boundary
25. `DayFrameState` Separation
26. Subscriber Preservation
27. UI Preservation
28. Storage-Accessor Boundary
29. Migration Separation
30. Tests Added or Updated
31. Reference Validation
32. ADR Alignment Improvement
33. Deviations
34. Discoveries and Deferred Work
35. Recommended Next Task
36. Validation
37. Final Completion Determination

---

# Expected Architectural Result

Before Task 1.29:

```text
active status = storageFailure

but store cannot tell whether intended durability is:
    current snapshot
or
    key absence
```

After Task 1.29:

```text
Active surface
    ├── durability status
    └── desired condition

Profiles surface
    ├── durability status
    └── desired condition
```

Examples:

```text
active:
    desired = snapshot
    status = storageFailure
```

```text
active:
    desired = absent
    status = storageFailure
```

Those states now have unambiguous future retry semantics.

---

# Expected Follow-Up

Task 1.28 identified one additional prerequisite before DayFrame can claim a fully total retry outcome contract:

```text
globalThis.localStorage accessor exceptions
```

currently remain outside the Task 1.24 helper-result boundary.

Therefore, after Task 1.29 review, the next dependency-correct task should determine whether to:

1. normalize storage-accessor exceptions into existing helper outcomes in a bounded implementation task; then
2. implement the store-owned retry APIs;

or authorize both only if evidence proves they can be combined without obscuring mutation/subscriber behavior.

The preferred conservative sequence is:

```text
Task 1.29
desired durable condition
        ↓
Task 1.30
normalize storage-accessor failures
        ↓
Task 1.31
store-owned retry implementation
```

unless Task 1.29 reveals evidence requiring a different boundary.

No retry implementation is authorized by Task 1.29.

---

# Completion Criteria

Task 1.29 is complete when:

* active state has a private desired durable condition;
* profiles have a private desired durable condition;
* allowed conditions are exactly `snapshot | absent`;
* both initialize to `snapshot`;
* desired condition remains outside `DayFrameState`;
* desired condition is not persisted;
* ordinary active persistence establishes active `snapshot`;
* ordinary profile persistence establishes profile `snapshot`;
* profile deletion establishes profile `snapshot`, not `absent`;
* profile load establishes active `snapshot` only;
* backup import establishes active `snapshot` only;
* clear establishes `absent` for both surfaces;
* desired condition remains correct regardless of persistence outcome;
* mutation after clear replaces affected `absent` intent with `snapshot`;
* profile mutation after clear replaces profile `absent` with `snapshot`;
* clear after ordinary mutation replaces both intents with `absent`;
* latest affected-surface intent wins;
* non-persisting operations do not alter desired condition;
* Task 1.27 durability status behavior remains unchanged;
* Task 1.26 mutation-result behavior remains unchanged;
* no additional subscriber notification occurs;
* no retry API exists;
* no subscription is added;
* no UI behavior changes;
* no storage-accessor normalization occurs;
* no migration semantics change;
* no durable schema/key/version changes;
* focused tests directly protect desired-condition semantics;
* full repository validation passes;
* the result artifact identifies the next dependency-correct seam.

---

# Task Determination

Task 1.29 is a bounded store-infrastructure implementation.

It does not implement retry, alter persistence semantics, change runtime authority, or expose new user behavior.

Its purpose is to retain the one missing fact required by Task 1.28's retry contract:

```text
What durable condition does this surface currently intend?
```

For ordinary persistence that condition is:

```text
snapshot
```

For clear it is:

```text
absent
```

Together with existing retained durability status, this gives the store enough information to distinguish a failed snapshot write from a failed clear without retaining stale operations or historical payloads.

**The task is complete when the store privately retains the current desired durable condition for active state and profiles, updates each condition deterministically between `snapshot` and `absent` from existing mutation and clear paths, preserves all current durability/runtime/subscriber/UI behavior, and directly protects intent replacement with tests without implementing retry.**
