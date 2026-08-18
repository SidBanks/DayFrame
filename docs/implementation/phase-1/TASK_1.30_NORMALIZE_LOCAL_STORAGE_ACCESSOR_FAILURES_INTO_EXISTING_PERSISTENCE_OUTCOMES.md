# Implementation Task 1.30 — Normalize Local-Storage Accessor Failures Into Existing Persistence Outcomes

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.30

**Task Name:** Normalize Local-Storage Accessor Failures Into Existing Persistence Outcomes

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.30_NORMALIZE_LOCAL_STORAGE_ACCESSOR_FAILURES_INTO_EXISTING_PERSISTENCE_OUTCOMES_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* storage-accessor boundary before and after;
* active write behavior;
* profile write behavior;
* active removal behavior;
* profile removal behavior;
* ordinary mutation continuation behavior;
* retained durability-status behavior;
* desired-durable-condition behavior;
* subscriber behavior;
* clear behavior;
* read-path determination;
* helper outcome preservation;
* tests added or updated;
* validation performed and results;
* deviations from authorized scope, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires adding retry APIs, automatic retry, UI feedback, new failure categories, durability subscriptions, recovery behavior, migration behavior, schema changes, storage-key changes, or changes to session-first runtime authority, stop the affected work and record the discrepancy rather than expanding Task 1.30.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Authorized Boundary;
* Write Semantics;
* Removal Semantics;
* Clear Semantics;
* Read-Path Determination;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when local-storage accessor exceptions encountered by existing write and removal helpers are normalized into the existing `storageFailure` outcomes, ordinary store mutations and clear preserve their established session-first continuation/result/notification contracts, retained durability and desired-condition semantics remain coherent, and focused tests directly protect the normalized boundary without introducing retry or new persistence policy.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the integrity discrepancy for project review.

---

# Purpose

Normalize local-storage accessor exceptions into DayFrame's existing persistence outcome model.

Tasks 1.24–1.29 progressively established:

```text
Task 1.24
persistence helpers expose factual outcomes

Task 1.25
store interprets runtime success and durability separately

Task 1.26
store mutations return persistence outcomes

Task 1.27
store retains durability status

Task 1.28
retry semantics established

Task 1.29
store retains desired durable condition
```

One exceptional persistence path remains outside that model:

```text
globalThis.localStorage
    ↓
accessor throws
    ↓
exception propagates
```

Current helper result contracts otherwise normalize write/removal failures into:

```text
storageFailure
```

Task 1.30 closes this boundary so future retry can truthfully rely on every ordinary persistence/removal attempt producing the established factual result.

---

# Architectural Context

After Task 1.29, an ordinary active mutation may conceptually proceed:

```text
runtime mutation
    ↓
desired condition = snapshot
    ↓
persistState(...)
```

If:

```text
setItem(...)
```

throws inside the current helper boundary:

```text
persistence = storageFailure
    ↓
retained durability = storageFailure
    ↓
notify once
    ↓
return {
    state,
    persistence
}
```

But if acquiring:

```text
globalThis.localStorage
```

itself throws before the helper's existing protected operation:

```text
exception escapes
    ↓
no persistence outcome
    ↓
no retained durability update
    ↓
notification may be skipped
    ↓
mutation does not reach its ordinary result contract
```

Task 1.30 removes that behavioral asymmetry.

---

# Governing Architectural Principles

Task 1.30 must preserve:

* session-first runtime authority;
* explicit persistence observability;
* deterministic store ownership;
* separation of runtime state from durability infrastructure state;
* desired durable condition as current intent;
* non-destructive persistence behavior;
* existing result categories;
* existing subscriber contract;
* epistemic integrity.

The task must not invent a new semantic distinction for accessor failure unless executable evidence proves one is required.

---

# Governing Evidence

Task 1.24 established write outcomes:

```text
persisted
unavailable
serializationFailure
storageFailure
```

and removal outcomes:

```text
removed
unavailable
storageFailure
```

Task 1.25 established that storage-accessor failure should eventually be normalized into the ordinary durability model if this can be done coherently.

Task 1.26 established mutation result contracts.

Task 1.27 established retained durability status.

Task 1.29 established desired durable condition and explicitly recorded the current accessor-exception boundary:

```text
runtime assignment
    ↓
desired intent assignment
    ↓
storage accessor throws
    ↓
exception propagates
    ↓
retained durability remains previous value
    ↓
notification skipped
```

Task 1.30 must align that path with the existing factual outcome model.

---

# Objective

Modify the smallest persistence-helper boundary necessary so that:

1. local-storage accessor exceptions encountered during active writes return `storageFailure`;
2. local-storage accessor exceptions encountered during profile writes return `storageFailure`;
3. local-storage accessor exceptions encountered during active removal return `storageFailure`;
4. local-storage accessor exceptions encountered during profile removal return `storageFailure`;
5. no new persistence category is introduced;
6. ordinary store mutations continue after accessor failure exactly as they already do after ordinary helper-handled storage failures;
7. retained durability status becomes `storageFailure`;
8. desired durable condition remains current intent;
9. ordinary state subscribers are notified exactly as established by the store mutation;
10. clear completes both removal attempts where safely possible and returns its existing aggregate result;
11. no retry behavior is introduced.

---

# Authorized Boundary

Task 1.30 may modify only the existing browser-storage acquisition / persistence-helper boundary necessary to normalize accessor exceptions.

Likely relevant functions include existing equivalents of:

```text
getStorage
persistState
persistProfiles
clearPersistedState
clearPersistedProfiles
```

Exact current names must be confirmed from executable code.

The task may locally restructure helper error handling.

It must not redesign persistence ownership.

---

# Core Normalization Rule

When an existing write/removal helper attempts to obtain browser storage and that accessor throws:

```text
globalThis.localStorage
    ↓
throws
```

the helper must return:

```text
storageFailure
```

using the already-existing relevant outcome type.

For writes:

```text
PersistenceWriteOutcome
    status = storageFailure
```

For removals:

```text
PersistenceRemovalOutcome
    status = storageFailure
```

Exact existing type structure must be preserved.

Do not add:

```text
accessorFailure
storageAccessFailure
browserFailure
```

or another category.

Task 1.28 determined that accessor failure should be normalized consistently with storage-operation failure for store-level retry purposes.

---

# Epistemic Meaning

`storageFailure` after accessor exception means only:

> DayFrame attempted to access the durable browser-storage boundary, but the persistence/removal operation could not complete because the storage boundary threw.

It does not mean:

* quota failure;
* permission failure;
* privacy mode;
* browser corruption;
* permanent storage unavailability;
* storage API absence.

Do not inspect exception messages to classify cause.

---

# Storage-Unavailable Must Remain Distinct

The existing non-throwing case:

```text
storage object absent/falsy
```

must remain:

```text
unavailable
```

Do not collapse:

```text
unavailable
```

into:

```text
storageFailure
```

Task 1.24 intentionally distinguished them.

The mapping remains:

```text
no usable storage object
    → unavailable

storage acquisition/operation throws
    → storageFailure
```

---

# Active Write Semantics

For an ordinary active-state mutation:

```text
runtime transition
    ↓
active desired condition = snapshot
    ↓
persistState(...)
```

if storage accessor acquisition throws, required behavior becomes:

```text
persistence = storageFailure
    ↓
active durability status = storageFailure
    ↓
notify state subscribers once
    ↓
return existing StoreMutationResult
```

The runtime mutation remains applied.

Do not roll back.

Do not rethrow the accessor exception through the ordinary mutation.

---

# Setup Commit Semantics

`commitAuthoredSetup` must preserve:

* complete atomic runtime authored transition;
* Preview staleness;
* active desired condition `snapshot`;
* one persistence attempt;
* active retained durability mapping;
* one state notification;
* existing `{ state, persistence }` result.

When storage access throws:

```text
result.persistence = storageFailure
```

and the method must otherwise follow the same store-level path as a helper-handled `setItem` storage failure.

---

# Narrow Setter Semantics

Every ordinary active persisting setter must gain the same normalized behavior.

Do not create setter-specific accessor handling.

At minimum verify current equivalents of:

* scheduling preferences;
* Preview range;
* shift definitions;
* shift cycles;
* block templates;
* block recurrences;
* manual events.

---

# Manual-Event Semantics

If storage access throws during `setManualEvents` persistence:

* runtime manual events remain changed;
* desired active condition remains `snapshot`;
* active durability becomes `storageFailure`;
* one ordinary state notification occurs;
* the existing mutation result reports `storageFailure`;
* UI behavior remains unchanged.

Do not add manual-event-specific recovery.

---

# Profile Write Semantics

For:

```text
saveProfile
deleteProfile
```

if profile-storage accessor acquisition throws:

```text
profile persistence = storageFailure
    ↓
profiles durability = storageFailure
    ↓
profiles desired condition = snapshot
    ↓
runtime profile mutation remains applied
    ↓
one state notification
    ↓
existing mutation result returned
```

Active durability and active desired condition remain unchanged.

---

# Profile Load Semantics

`loadProfile` uses profile data as source but persists active authored state.

If active storage accessor acquisition throws during that active persistence:

* runtime loaded authored state remains applied;
* active desired condition remains `snapshot`;
* active durability becomes `storageFailure`;
* profile durability remains unchanged;
* profile desired condition remains unchanged;
* one state notification occurs;
* existing result reports `storageFailure`.

Do not reinterpret the source profile itself as failed.

---

# Backup Import Semantics

If active storage accessor acquisition throws during persistence after valid backup import:

* imported runtime state remains applied;
* active desired condition remains `snapshot`;
* active durability becomes `storageFailure`;
* one state notification occurs;
* existing import mutation result reports `storageFailure`;
* the external backup remains unaffected.

No backup durability surface is added.

---

# Removal Semantics

For:

```text
clearPersistedState
clearPersistedProfiles
```

a storage accessor exception must return:

```text
storageFailure
```

rather than escape.

No retry occurs.

No new category is created.

---

# Clear Semantics

Task 1.29 established:

```text
runtime reset
    ↓
active desired = absent
profiles desired = absent
    ↓
active removal
    ↓
profile removal
```

Task 1.30 must preserve both absence intents.

If the active removal accessor throws, that failure must be captured as:

```text
activeState = storageFailure
```

and the clear operation must proceed to the profile removal attempt rather than aborting before it.

Likewise, a profile accessor exception must be captured as:

```text
profiles = storageFailure
```

without discarding the active result.

The clear result must continue reporting:

```text
state
activeState
profiles
durability
```

using the existing Task 1.26 aggregate rules.

---

# Clear Aggregation Preservation

Existing aggregation remains:

| Active Result | Profile Result | Aggregate          |
| ------------- | -------------- | ------------------ |
| `removed`     | `removed`      | `cleared`          |
| `removed`     | non-removed    | `partiallyCleared` |
| non-removed   | `removed`      | `partiallyCleared` |
| non-removed   | non-removed    | `notCleared`       |

An accessor exception normalized to:

```text
storageFailure
```

participates as an ordinary non-removed outcome.

Do not introduce a special clear aggregate for accessor failure.

---

# Clear Partial Example

Example:

```text
active storage accessor throws
profile removal succeeds
```

must result in:

```text
runtime = cleared

desired:
    active = absent
    profiles = absent

durability:
    active = storageFailure
    profiles = durable

clear result:
    activeState = storageFailure
    profiles = removed
    durability = partiallyCleared
```

and exactly one ordinary runtime-state notification.

---

# Clear Both-Failure Example

If access to both durable surfaces throws:

```text
activeState = storageFailure
profiles = storageFailure
durability = notCleared
```

with:

```text
desired:
    active = absent
    profiles = absent
```

and retained durability:

```text
active = storageFailure
profiles = storageFailure
```

Runtime remains reset.

---

# Desired Durable Condition Preservation

Task 1.29 desired intent must not depend on accessor success.

For ordinary write paths:

```text
desired = snapshot
```

remains true when accessor failure is normalized.

For clear:

```text
desired = absent
```

remains true.

Task 1.30 must not change desired-condition values because persistence failed.

---

# Retained Durability Status Preservation

Task 1.27 mapping remains:

```text
storageFailure
    → retained surface = storageFailure
```

Accessor failures now flow through this existing mapping.

Do not introduce new retained status values.

---

# Mutation Result Preservation

Task 1.26 result shapes remain unchanged.

Ordinary persisting mutation:

```ts
{
  state,
  persistence
}
```

Clear:

```ts
{
  state,
  activeState,
  profiles,
  durability
}
```

Task 1.30 changes which previously exceptional path can now produce those existing results.

It does not change result structure.

---

# Subscriber Semantics

This task deliberately changes one aspect of the previously exceptional path:

Before:

```text
accessor throws
    ↓
ordinary mutation/clear aborts before normal notification
```

After:

```text
accessor failure → storageFailure outcome
    ↓
ordinary store continuation resumes
    ↓
one established state notification
```

This is an authorized behavioral alignment.

The resulting contract should match ordinary helper-handled storage failure.

Do not:

* add a second notification;
* add durability-specific notification;
* change subscriber payload;
* notify non-persisting operations.

---

# Why Notification Changes Are Authorized

Task 1.29 documented that accessor exceptions currently leave runtime and desired intent changed while notification is skipped.

That creates a particularly problematic state:

```text
store runtime changed
    ↓
subscriber never sees that runtime truth
```

Once the accessor exception becomes a normal persistence outcome, the existing store-level session-first contract requires the normal state notification to occur.

Task 1.30 is therefore expressly authorized to align notification behavior for this previously exceptional path.

This is not a new subscriber model.

It makes accessor failure behave like other persistence failures.

---

# Runtime Authority Preservation

Runtime continues to be session-first.

Accessor normalization must not change:

```text
valid runtime mutation
    ↓
runtime remains authoritative for current session
```

Do not:

* roll back;
* reconstruct from durable state;
* reload old state;
* suppress mutation;
* mark mutation itself failed.

Durability failure remains a separate dimension.

---

# Read-Path Determination

Task 1.30 is principally about **write/removal persistence outcomes**.

Investigate current durable read paths separately.

If access to `globalThis.localStorage` can throw during:

* active-state hydration;
* profile hydration;

determine current behavior and whether existing read helpers already contain or lack a protected accessor boundary.

Do **not** automatically broaden Task 1.30 into read-failure recovery.

The result artifact must classify read accessor behavior as one of:

* already safely handled;
* safely normalizable without changing read semantics;
* still exceptional and deferred.

If normalizing a read accessor failure would simply preserve the existing established fallback behavior without creating a new error/recovery policy, it may be included only if the implementation remains trivially within the same storage-acquisition boundary.

Otherwise defer it.

The core completion criterion concerns writes/removals.

---

# Read-Failure Non-Goal

Do not introduce:

* malformed-data recovery;
* unsupported-format UI;
* durable-read error status;
* recovery download;
* quarantine;
* new read-result types.

Those remain separate ADR alignment work.

---

# Storage Acquisition Design

Prefer the smallest change that gives persistence helpers protected access to storage.

Possible implementation shapes include:

```text
getStorage()
    → returns storage / unavailable
    → catches accessor exception?
```

or:

```text
persist helper
    → try obtain storage
    → normalize thrown access as storageFailure
```

Choose based on current code organization.

Do not introduce a persistence service or broad wrapper architecture merely to centralize one `try/catch`.

---

# Helper Outcome Single Source of Truth

After Task 1.30:

```text
one persistence/removal attempt
    ↓
one helper outcome
    ├── immediate store result
    └── retained durability update
```

Do not independently catch/reclassify accessor failure at the store mutation layer if it can be coherently normalized in the existing persistence helper boundary.

Persistence helpers should continue owning factual browser-operation outcomes.

---

# No Exception Object Exposure

Do not return raw exceptions from the helper outcome unless the existing type already does so.

Task 1.30 does not add diagnostics.

No:

```text
error
message
stack
DOMException name
```

is required.

The factual classification remains:

```text
storageFailure
```

---

# No Retry Yet

Do not add:

```text
retryActivePersistence()
retryProfilePersistence()
```

or any equivalent.

Task 1.30 establishes the total factual outcome boundary required before retry implementation.

Retry remains the next stage.

---

# No Automatic Retry

Do not respond to normalized accessor failure by immediately retrying storage acquisition.

Exactly one attempt remains exactly one attempt.

No:

* loop;
* timer;
* delayed retry;
* fallback browser API;
* focus retry;
* event listener.

---

# No Durability Subscription

Do not add a reactive durability subscription.

Accessor normalization does not create a new UI consumer.

---

# UI Preservation

The UI must continue to ignore persistence outcomes during Task 1.30.

Do not change:

* Setup save confirmation;
* profile feedback;
* manual-event feedback;
* backup import feedback;
* clear feedback;
* navigation;
* Preview behavior;
* error messages.

Known false-success messaging remains downstream work.

---

# No Durable-Format Changes

Do not alter:

* active local-storage key;
* profile storage key;
* local-storage payload;
* profile format;
* backup format;
* version values;
* validators;
* normalizers;
* compatibility readers.

Accessor normalization is transport-boundary behavior only.

---

# Required Failure Mapping

Document and test:

| Storage Situation                     | Write Outcome          | Removal Outcome  |
| ------------------------------------- | ---------------------- | ---------------- |
| Storage available; operation succeeds | `persisted`            | `removed`        |
| Storage absent/falsy                  | `unavailable`          | `unavailable`    |
| Storage accessor throws               | `storageFailure`       | `storageFailure` |
| `setItem` throws                      | `storageFailure`       | N/A              |
| `removeItem` throws                   | N/A                    | `storageFailure` |
| Serialization throws                  | `serializationFailure` | N/A              |

No category changes are authorized.

---

# Required Operation Matrix

Verify:

| Operation             | Accessor Failure Outcome         |        Runtime Applied? | Desired Condition   | Durability Status         | State Notification |
| --------------------- | -------------------------------- | ----------------------: | ------------------- | ------------------------- | -----------------: |
| Setup commit          | `storageFailure`                 |                     Yes | active `snapshot`   | active `storageFailure`   |               Once |
| Active setter         | `storageFailure`                 |                     Yes | active `snapshot`   | active `storageFailure`   |               Once |
| Manual events         | `storageFailure`                 |                     Yes | active `snapshot`   | active `storageFailure`   |               Once |
| Profile save          | `storageFailure`                 |                     Yes | profiles `snapshot` | profiles `storageFailure` |               Once |
| Profile delete        | `storageFailure`                 |                     Yes | profiles `snapshot` | profiles `storageFailure` |               Once |
| Profile load          | `storageFailure` on active write |                     Yes | active `snapshot`   | active `storageFailure`   |               Once |
| Backup import         | `storageFailure` on active write |                     Yes | active `snapshot`   | active `storageFailure`   |               Once |
| Clear active removal  | `storageFailure`                 | runtime already cleared | active `absent`     | active `storageFailure`   |       Once overall |
| Clear profile removal | `storageFailure`                 | runtime already cleared | profiles `absent`   | profiles `storageFailure` |       Once overall |

---

# Required Tests

Add focused tests establishing the normalized boundary.

At minimum cover the following.

## Test 1 — Active Accessor Failure Returns `storageFailure`

Cause `globalThis.localStorage` access itself to throw during an active persistence operation.

Assert:

* no accessor exception escapes;
* runtime mutation remains applied;
* mutation result reports `storageFailure`;
* active desired condition is `snapshot`;
* active retained durability is `storageFailure`;
* profile infrastructure state remains unchanged;
* subscriber fires exactly once.

---

## Test 2 — Setup Commit Accessor Failure

Use `commitAuthoredSetup` or equivalent.

Assert preservation of:

* complete runtime transition;
* Preview staleness;
* one notification;
* `storageFailure` result;
* active durability failure;
* snapshot intent.

---

## Test 3 — Narrow Setter Accessor Failure

At least one representative narrow setter must directly prove the shared behavior.

Do not redundantly test every setter if implementation is structurally shared and existing coverage establishes their common path.

---

## Test 4 — Manual Event Accessor Failure

If manual-event persistence has any distinct caller logic, directly prove the normalized outcome.

If it shares the exact setter helper structurally and existing tests sufficiently establish it, document why redundant coverage is unnecessary.

---

## Test 5 — Profile Save Accessor Failure

Assert:

* runtime profile exists/changes;
* profile desired condition is `snapshot`;
* profile durability becomes `storageFailure`;
* active infrastructure status/intent remains unchanged;
* one notification;
* result reports `storageFailure`.

---

## Test 6 — Profile Delete Accessor Failure

Assert the analogous delete behavior.

If shared path coverage makes separate failure injection redundant, preserve at least one direct profile write accessor-failure test and existing delete mutation-result tests.

---

## Test 7 — Profile Load Active Accessor Failure

Prove source profile remains available while:

* active runtime replacement succeeds;
* active desired condition is `snapshot`;
* active durability is `storageFailure`;
* result reports `storageFailure`;
* notification occurs once.

---

## Test 8 — Backup Import Active Accessor Failure

Prove valid import runtime state remains applied while active persistence returns `storageFailure` and normal notification occurs.

---

## Test 9 — Clear Active Accessor Failure / Profile Success

Inject:

```text
active accessor failure
profile removal success
```

Assert:

```text
active result = storageFailure
profiles result = removed
aggregate = partiallyCleared

desired:
    active = absent
    profiles = absent

durability:
    active = storageFailure
    profiles = durable
```

and subscriber fires exactly once.

---

## Test 10 — Clear Active Success / Profile Accessor Failure

Assert the inverse partial clear.

---

## Test 11 — Clear Both Accessors Fail

Assert:

```text
activeState = storageFailure
profiles = storageFailure
durability = notCleared
```

with both desired conditions `absent`, both retained statuses `storageFailure`, runtime reset, and one notification.

---

## Test 12 — Unavailable Remains Distinct

Preserve or add coverage proving a non-throwing unavailable storage condition still reports:

```text
unavailable
```

rather than `storageFailure`.

---

## Test 13 — Ordinary `setItem` Failure Unchanged

Preserve Task 1.24+ coverage proving ordinary operation failure remains:

```text
storageFailure
```

and existing mutation behavior is unchanged.

---

## Test 14 — Serialization Failure Unchanged

Preserve or verify:

```text
serializationFailure
```

remains distinct.

---

## Test 15 — No Additional Notifications

For normalized accessor failure, verify exactly one state notification—not zero and not two.

This is an important regression because the pre-task exceptional path notified zero times.

---

# Read Accessor Test Requirement

Inspect startup/hydration behavior when local-storage accessor acquisition throws.

If Task 1.30 includes safe read normalization, add direct tests proving the existing intended fallback behavior.

If read normalization is deferred, add or preserve evidence establishing the remaining exceptional boundary and record it explicitly.

Do not leave the result ambiguous.

---

# Testing Accessor Failure

Use the narrowest existing testing mechanism capable of making the `globalThis.localStorage` accessor itself throw.

Do not merely make:

```text
setItem()
```

throw and call that accessor coverage.

The tests must distinguish:

```text
property access throws
```

from:

```text
storage method throws
```

because closing that distinction is the point of Task 1.30.

---

# Expected Files to Change

Likely executable files:

* `code/src/state/dayFrameStore.ts`;
* `code/src/state/tests/dayFrameStore.test.ts`.

`code/src/state/types.ts` should not require semantic changes because the existing outcome categories are sufficient.

A small helper change elsewhere is acceptable if current storage acquisition lives outside `dayFrameStore.ts`.

No UI file is expected to change.

---

# Reference Validation

After implementation verify:

* local-storage accessor exceptions no longer escape from the four write/removal helpers;
* accessor failures map to existing `storageFailure`;
* unavailable remains distinct;
* serialization failure remains distinct;
* normal `setItem`/`removeItem` failures remain unchanged;
* ordinary store mutations return existing result shapes;
* desired-condition types/values remain unchanged;
* retained durability types/values remain unchanged;
* state subscribers still receive `DayFrameState`;
* accessor failure now follows ordinary session-first continuation;
* clear attempts both durable removals even if one accessor fails;
* clear aggregate semantics remain unchanged;
* no retry API exists;
* no automatic retry exists;
* no durability subscription exists;
* no UI consumes new behavior;
* no durable format/key/version changed;
* compatibility readers remain intact.

---

# Explicit Non-Goals

Task 1.30 shall not:

* add retry APIs;
* implement retry;
* add automatic retry;
* add retry UI;
* add durability UI;
* add a durability subscription;
* add new persistence outcome categories;
* expose raw storage exceptions;
* parse exception messages;
* add rollback;
* change session-first runtime authority;
* change `DayFrameState`;
* change desired-condition types;
* change retained durability types;
* change mutation result structures;
* add dirty/pending state;
* add migration markers;
* add migration retry;
* add read recovery UX;
* add backup recovery;
* change malformed-data handling;
* change unsupported-version handling;
* alter schemas;
* alter storage keys;
* increment versions;
* change validators;
* change normalizers;
* remove compatibility readers;
* introduce a persistence service;
* add telemetry;
* resolve unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.24 — Make Durable-Write Outcomes Observable at the Persistence-Helper Boundary;
* Task 1.25 — Establish Store-Level Durability Outcome Semantics;
* Task 1.26 — Expose Persistence Outcomes Through Store Mutation Results;
* Task 1.27 — Retain Store-Level Durability Status Outside `DayFrameState`;
* Task 1.28 — Establish Store-Owned Durability Retry Semantics and Authority;
* Task 1.29 — Retain Per-Surface Desired Durable Condition Outside `DayFrameState`.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

Dependency chain:

```text
factual outcomes
    ↓
store semantics
    ↓
mutation results
    ↓
retained status
    ↓
retry policy
    ↓
desired durable intent
    ↓
total persistence outcome boundary
```

---

# Evidence Standards

The implementation must distinguish between what DayFrame observes and what it infers.

Accessor exception:

```text
observable:
storage boundary threw
```

Allowed classification:

```text
storageFailure
```

Not allowed:

```text
quotaExceeded
privacyMode
permissionDenied
browserBug
```

unless those distinctions are directly available through an already-adopted executable API, which current evidence does not establish.

---

# ADR Alignment

Task 1.30 improves alignment with:

* explicit persistence failure observability;
* deterministic persistence ownership;
* session-first runtime authority;
* retained durability correctness;
* future retry totality;
* failure transparency;
* epistemic integrity.

It still does not complete:

* retry implementation;
* user-visible failure communication;
* recovery workflows;
* read-failure recovery;
* migration evidence.

Do not claim broader alignment.

---

# Validation Requirements

Run focused store tests covering:

* active accessor failure;
* profile accessor failure;
* clear partial accessor failure;
* clear full accessor failure;
* unavailable distinction;
* serialization distinction;
* ordinary operation failure preservation;
* desired-condition preservation;
* retained durability preservation;
* exact notification count.

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

for the affected scope.

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

* Task 1.30 specification remained immutable;
* result artifact exists separately;
* no retry was introduced;
* no UI semantics changed;
* no durable-data format changed.

---

# Documentation Rules

During Task 1.30:

## Create

* `TASK_1.30_NORMALIZE_LOCAL_STORAGE_ACCESSOR_FAILURES_INTO_EXISTING_PERSISTENCE_OUTCOMES_RESULT.md`

## Preserve

* Task 1.30 specification;
* Tasks 1.23–1.29 results;
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

The Task 1.30 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Storage Accessor Boundary Before
6. Storage Accessor Boundary After
7. Outcome Mapping
8. Active-State Write Integration
9. Setup Commit Integration
10. Narrow Setter Integration
11. Manual-Event Integration
12. Profile Write Integration
13. Profile Load Integration
14. Backup Import Integration
15. Removal Integration
16. Clear Integration
17. Clear Partial-Failure Semantics
18. Desired Durable Condition Preservation
19. Retained Durability Preservation
20. Mutation Result Preservation
21. Subscriber Alignment
22. Runtime Authority Preservation
23. Read-Path Determination
24. Unavailable Distinction
25. Serialization-Failure Preservation
26. Tests Added or Updated
27. Reference Validation
28. ADR Alignment Improvement
29. Deviations
30. Discoveries and Deferred Work
31. Recommended Next Task
32. Validation
33. Final Completion Determination

---

# Expected Architectural Result

Before:

```text
write/remove attempt
    ├── storage unavailable
    │       → unavailable
    │
    ├── storage method throws
    │       → storageFailure
    │
    └── storage accessor throws
            → exception escapes
```

After:

```text
write/remove attempt
    ├── storage unavailable
    │       → unavailable
    │
    ├── storage accessor throws
    │       → storageFailure
    │
    └── storage method throws
            → storageFailure
```

Store-level mutation behavior then becomes uniform:

```text
valid runtime mutation
    ↓
desired durable condition established
    ↓
persistence attempt
    ↓
exact factual outcome
    ↓
retained durability updated
    ↓
state subscriber notified once
    ↓
existing mutation result returned
```

---

# Expected Follow-Up

If Task 1.30 completes cleanly, the prerequisites identified by Task 1.28 for explicit retry should be satisfied:

```text
retained durability status
        +
desired durable condition
        +
total write/removal outcome boundary
```

The next dependency-correct task should therefore be:

> **Task 1.31 — Implement Store-Owned Active and Profile Durability Retry**

That bounded implementation should follow Task 1.28's adopted semantics:

* `retryActivePersistence()`;
* `retryProfilePersistence()`;
* retry only `storageFailure` and `unavailable`;
* block blind retry from `unknown`, `durable`, and `serializationFailure`;
* route `snapshot` to current complete snapshot persistence;
* route `absent` to removal;
* update retained durability only;
* send no ordinary `DayFrameState` notification;
* return an exact discriminated retry result;
* add no UI or automatic retry.

Do not implement Task 1.31 behavior as part of Task 1.30.

---

# Completion Criteria

Task 1.30 is complete when:

* active write helpers normalize local-storage accessor exceptions to `storageFailure`;
* profile write helpers normalize accessor exceptions to `storageFailure`;
* active removal helpers normalize accessor exceptions to `storageFailure`;
* profile removal helpers normalize accessor exceptions to `storageFailure`;
* no new outcome category is introduced;
* unavailable remains distinct;
* serialization failure remains distinct;
* ordinary storage-operation failures remain unchanged;
* valid runtime mutations remain applied after accessor failure;
* desired durable condition remains correct;
* retained durability updates to `storageFailure`;
* ordinary store mutations return their existing result shapes;
* ordinary state subscribers receive exactly one notification after normalized accessor failure;
* clear attempts both removals despite one accessor failure;
* clear aggregate semantics remain unchanged;
* clear desired conditions remain `absent`;
* partial and total accessor-failure clears are directly tested;
* read-path accessor behavior is explicitly classified;
* no retry API exists;
* no automatic retry exists;
* no UI behavior changes;
* no durability subscription is introduced;
* no runtime authority change occurs;
* no durable schema/key/version changes;
* compatibility behavior remains unchanged;
* focused tests protect the normalized boundary;
* full validation passes;
* the result artifact identifies the next dependency-correct seam.

---

# Task Determination

Task 1.30 is a bounded persistence-boundary alignment implementation.

It does not add retry, recovery, or new persistence policy.

Its purpose is to eliminate the remaining exceptional local-storage acquisition path so all existing write and removal attempts can participate in DayFrame's established persistence outcome, retained durability, desired-condition, mutation-result, and session-first continuation contracts.

After Task 1.30, future store-owned retry should no longer need a special exception path merely to determine whether a durability attempt succeeded.

**The task is complete when local-storage accessor exceptions encountered by existing write and removal helpers are normalized into the existing `storageFailure` outcomes, ordinary store mutations and clear preserve their established session-first continuation/result/notification contracts, retained durability and desired-condition semantics remain coherent, and focused tests directly protect the normalized boundary without introducing retry or new persistence policy.**
