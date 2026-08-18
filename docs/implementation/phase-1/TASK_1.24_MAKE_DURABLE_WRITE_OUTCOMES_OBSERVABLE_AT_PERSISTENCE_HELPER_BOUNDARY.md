# Implementation Task 1.24 — Make Durable-Write Outcomes Observable at the Persistence-Helper Boundary

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.24

**Task Name:** Make Durable-Write Outcomes Observable at the Persistence-Helper Boundary

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.24_MAKE_DURABLE_WRITE_OUTCOMES_OBSERVABLE_AT_PERSISTENCE_HELPER_BOUNDARY_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* persistence helpers changed;
* outcome contract introduced;
* observable outcome categories;
* failure-injection tests added or updated;
* existing mutation semantics preserved;
* existing subscriber semantics preserved;
* existing UI semantics preserved;
* clear-helper behavior established;
* validation performed and results;
* deviations from the authorized task, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires changing store mutation behavior, subscriber behavior, UI feedback, retry behavior, rollback semantics, migration behavior, durable formats, or persistence ownership beyond the helper boundary, stop the affected work and record the discrepancy rather than expanding this task.

---

# Pre-Execution Artifact Integrity Check

Before beginning execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Governing Evidence;
* Authorized Implementation;
* Required Outcome Contract;
* Required Tests;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when active-state writes, profile writes, active-state removal, and profile removal expose explicit persistence outcomes at their existing helper boundaries, focused failure-injection tests establish those outcomes, and all existing store, subscriber, UI, persistence, scheduling, and durable-data behavior remains unchanged.**

If the saved task is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Make the outcome of DayFrame's existing browser-storage write and removal operations observable at the persistence-helper boundary.

Task 1.23 established that current persistence helpers intentionally implement best-effort persistence but hide the result from their callers.

Current behavior is effectively:

```text
store mutation
    ↓
runtime state changes
    ↓
persistence helper
    ├── success
    └── failure swallowed
    ↓
void
```

The caller cannot distinguish those outcomes.

This creates a hidden failure boundary.

Task 1.24 changes only that boundary:

```text
store mutation
    ↓
runtime state changes
    ↓
persistence helper
    ├── success
    ├── storage unavailable
    ├── serialization failure where observable
    └── storage operation failure
    ↓
explicit outcome
```

The task does **not** authorize callers to react differently to those outcomes yet.

Its purpose is to make the truth available before a later architectural task decides what the store and UI should do with it.

---

# Governing Evidence

Task 1.23 established the following executable facts.

## Active authored persistence

`persistState`:

* serializes the complete authored snapshot;
* calls the active-state `localStorage.setItem`;
* catches ordinary serialization/write exceptions;
* returns `void`;
* is called after runtime state has already changed;
* is followed by subscriber notification regardless of caught persistence failure.

## Profile persistence

`persistProfiles`:

* serializes/replaces the complete profile envelope;
* calls the profile `localStorage.setItem`;
* catches ordinary serialization/write exceptions;
* returns `void`;
* is called after the runtime profile collection has changed;
* is followed by subscriber notification regardless of caught persistence failure.

## Removal

`clearPersistedState` and `clearPersistedProfiles`:

* perform independent `removeItem` operations;
* catch their own failures;
* return `void`;
* do not expose aggregate clear success.

## Storage absence

Task 1.23 established that when the storage object is absent or falsy:

* reads fall back;
* writes/removes become no-ops;
* callers currently cannot distinguish that from persistence success.

## Storage accessor failure

Task 1.23 separately established that accessing `globalThis.localStorage` itself can throw outside the existing helper catches.

This is a distinct boundary.

Task 1.24 must inspect this behavior carefully and may make the helper outcome reflect it **only if it can be done within the existing helper boundary without changing caller/store semantics**.

If doing so requires a broader storage-access redesign, record it and defer it.

---

# Architectural Principle

Task 1.24 follows the accepted durable-data ADR principle that persistence success and persistence failure must ultimately become observable.

However:

> **Observability does not itself determine recovery semantics.**

This task therefore separates:

```text
Can the persistence boundary tell us what happened?
```

from:

```text
What should DayFrame do because of what happened?
```

Only the first question is authorized here.

---

# Authorized Implementation

Task 1.24 may modify only the smallest executable surface necessary to make outcomes observable from:

1. active authored-state persistence;
2. saved-profile persistence;
3. active authored-state removal;
4. saved-profile removal.

At minimum investigate and, where applicable, modify the existing helpers corresponding to:

```text
persistState
persistProfiles
clearPersistedState
clearPersistedProfiles
```

The task may introduce a small explicit result type or equivalent value contract used by these helpers.

The task may update existing callers only as required for type correctness or to explicitly ignore the newly returned result.

Caller behavior must remain unchanged.

---

# Required Outcome Contract

The persistence-helper result must represent only facts that the implementation can actually observe.

Do not encode browser causes that DayFrame cannot know.

For example, do not claim to distinguish:

* quota exhaustion;
* privacy mode;
* permissions;
* browser policy;
* filesystem conditions;

unless executable APIs provide that distinction.

The result contract should distinguish the smallest useful categories supported by current evidence.

At minimum evaluate whether the helper can distinguish:

* persistence succeeded;
* storage unavailable;
* serialization failed;
* storage operation failed.

For removal helpers, evaluate:

* removal succeeded;
* storage unavailable;
* storage operation failed.

If serialization and storage operation failures cannot be safely distinguished with the existing structure, restructure the helper locally only as much as necessary to distinguish them.

Do not restructure store ownership.

---

# Result Contract Design Requirements

Any new result type must be:

* explicit;
* deterministic;
* narrow;
* easy to test;
* independent of UI language;
* independent of retry policy;
* independent of rollback policy;
* independent of migration policy;
* usable by later store-contract work.

Prefer a discriminated result over booleans if multiple observable failure categories exist.

Conceptually:

```text
PersistenceOutcome
    ├── persisted
    ├── unavailable
    ├── serializationFailure
    └── storageFailure
```

This is illustrative, not mandatory naming.

Choose names consistent with the existing codebase.

Do not include speculative fields.

Do not expose raw browser exceptions unless existing project conventions clearly justify doing so.

If retaining an error object is useful for later diagnosis, establish whether that is necessary rather than assuming it.

---

# Success Semantics

A success outcome must mean only:

> The helper completed the corresponding browser storage operation without an observed exception.

It must not mean:

* the user understands the operation succeeded;
* the browser has permanently committed data beyond the API's observable guarantee;
* a migration is complete;
* a backup exists;
* runtime and durable state can never diverge later.

Keep the contract epistemically precise.

---

# Storage-Unavailable Semantics

If the storage object is absent or unavailable without throwing, the helper must no longer make that indistinguishable from a successful persistence operation at its own boundary.

It should return the appropriate observable non-success outcome.

This must **not** yet change what the caller does.

---

# Storage-Accessor Exception

Task 1.23 found that `getStorage`/`globalThis.localStorage` access may throw outside existing helper catches.

During Task 1.24, determine whether the helper can safely convert that into the same observable storage-failure contract without modifying:

* mutation ordering;
* notification ordering;
* store return behavior;
* UI behavior.

If yes, include it and test it.

If not, leave the behavior unchanged and record the remaining boundary explicitly in the result.

Do not broaden the task into redesigning storage acquisition.

---

# Serialization Failure

Current supported authored data is expected to be serializable, but Task 1.23 established that serialization occurs inside the same catch as the storage operation.

Task 1.24 should make serialization failure separately observable if this can be done locally and deterministically.

Tests may inject an invalid runtime value only at the helper/test boundary where necessary to exercise the outcome.

Do not weaken production types merely to make serialization failure easy to construct.

Do not introduce unsupported runtime data into ordinary store tests unless unavoidable.

---

# Active-State Persistence Requirements

For `persistState` or its current equivalent:

## Before

Conceptually:

```text
persistState(state)
    ↓
serialize
    ↓
setItem
    ↓
catch failure
    ↓
void
```

## After

Conceptually:

```text
persistState(state)
    ↓
serialize
    ├── failure → explicit outcome
    ↓
storage access
    ├── unavailable → explicit outcome
    ↓
setItem
    ├── failure → explicit outcome
    ↓
success outcome
```

The caller must continue its existing behavior regardless of the returned outcome during Task 1.24.

---

# Profile Persistence Requirements

Apply the same principle to `persistProfiles`.

Do not alter:

* profile save semantics;
* profile overwrite semantics;
* profile deletion semantics;
* collection cloning;
* validation;
* versioning;
* serialization format.

Only expose the persistence result.

---

# Removal Requirements

`clearPersistedState` and `clearPersistedProfiles` must each expose their own outcome.

Do **not** yet create an aggregate clear transaction or clear-result policy.

The current store may continue calling:

```text
clearPersistedState()
clearPersistedProfiles()
```

independently.

Task 1.24 establishes only that each operation can report whether its own removal was observed to succeed.

The later store-contract task can decide how two outcomes combine.

---

# Caller Preservation Requirements

Existing callers may need mechanical changes such as:

```text
void persistState(state)
```

or:

```text
const _outcome = persistState(state)
```

if required by lint/type rules.

Prefer the least behaviorally meaningful adjustment.

Do not:

* branch on the result;
* change returned store snapshots;
* throw because of the result;
* suppress notification because of the result;
* change feedback because of the result;
* retry because of the result;
* store the result in runtime state.

Task 1.24 makes the result **available**, not **acted upon**.

---

# Mutation-Ordering Preservation

Task 1.23 established:

```text
runtime assignment
    ↓
persistence attempt
    ↓
notify
```

Task 1.24 must preserve that ordering.

Do not move persistence:

* before runtime assignment;
* after notification;
* into subscriber behavior;
* into the UI.

The purpose is observability, not transactional redesign.

---

# Subscriber Preservation

Subscribers must continue receiving the same snapshots under the same conditions as before for ordinary caught persistence failures.

No durability metadata should be added to snapshots.

No new subscriber notification should be introduced.

No existing notification should be removed.

If converting the storage-accessor exception into an outcome would cause notification behavior to change, treat that as a behavioral change requiring explicit analysis.

If it cannot be included without violating this task's preservation requirement, defer it.

---

# UI Preservation

Task 1.24 must not modify:

* “Setup saved.”;
* profile save feedback;
* profile delete feedback;
* profile load feedback;
* backup import feedback;
* backup export feedback;
* clear feedback;
* manual-event workflow feedback.

False-success semantics identified by Task 1.23 remain intentionally present until a later task defines the store's durability contract.

This temporary inconsistency is deliberate sequencing, not an endorsement of the behavior.

---

# Backup Boundaries

Task 1.24 does not modify backup export/download behavior.

Backup import reaches active authored persistence through the existing store path. Any helper result created by Task 1.24 may technically be returned by the active persistence helper during import, but the import workflow must not begin reacting to it yet.

Do not:

* change backup import return semantics;
* change import success messaging;
* change export initiation handling;
* add download completion detection;
* change backup schema or version.

---

# Required Failure-Injection Tests

Add focused executable evidence for the helper outcomes.

At minimum establish:

## Active-state write

* successful persistence returns success;
* absent/falsy storage returns unavailable;
* `setItem` throwing returns storage failure;
* serialization failure returns serialization failure if that category is implemented.

## Profile write

* successful persistence returns success;
* absent/falsy storage returns unavailable;
* `setItem` throwing returns storage failure;
* serialization failure returns serialization failure if applicable.

## Active-state removal

* successful removal returns success;
* absent/falsy storage returns unavailable;
* `removeItem` throwing returns storage failure.

## Profile removal

* successful removal returns success;
* absent/falsy storage returns unavailable;
* `removeItem` throwing returns storage failure.

Where helpers are private and cannot be tested directly without broadening production API surface, test through the narrowest existing executable boundary that proves the result contract.

Do not export internal helpers solely for test convenience unless repository conventions already support that pattern and the export itself is architecturally appropriate.

---

# Required Behavioral-Preservation Tests

Existing tests must continue proving current behavior.

Where useful, add focused regression evidence that a swallowed/returned persistence failure does **not yet** alter caller semantics.

For example, establish as appropriate that:

```text
runtime mutation
    ↓
persistence helper returns failure
    ↓
notify still occurs
    ↓
runtime state remains changed
```

Do not encode false UI success as desired long-term architecture more strongly than necessary.

The purpose of preservation tests is to ensure Task 1.24 did not accidentally perform Task 1.25.

---

# Clear Preservation Tests

Because Task 1.23 identified clear as a distinct partial-durability risk, establish that the two removal outcomes are independently observable.

Do not solve aggregation yet.

A focused test may prove that:

```text
active removal → success
profile removal → failure
```

can be represented as two distinct helper outcomes.

If the current store ignores both, it should continue to do so during this task.

---

# Reference Validation

After implementation, verify:

* no persistence helper still returns `void` if it is one of the four authorized helpers;
* all existing callers compile;
* no caller branches on the new outcomes;
* no UI reads the new outcomes;
* no subscriber snapshot contains persistence status;
* no retry path was introduced;
* no rollback path was introduced;
* no storage format changed;
* no storage key changed;
* no backup/profile version changed.

---

# Files Expected to Change

Based on Task 1.23 evidence, likely executable changes are concentrated in:

* `code/src/state/dayFrameStore.ts`;
* persistence/profile tests associated with the changed helpers.

Additional files may change only if the existing helper/type organization requires the result type to live elsewhere.

If a new shared type file or an existing state type file is necessary, keep the type narrowly scoped to persistence outcomes.

Do not move persistence helpers into a new service/module merely to satisfy this task.

The result artifact must list the actual files changed.

---

# Explicit Non-Goals

Task 1.24 shall not:

* decide rollback versus runtime continuation;
* add dirty-state tracking;
* add pending-persistence state;
* add persistence status to `DayFrameState`;
* change store mutation return contracts beyond mechanical handling required for the helper result;
* change subscriber snapshots;
* change notification ordering;
* change mutation ordering;
* add retry behavior;
* add automatic recovery;
* add error banners;
* change success messages;
* change manual-event behavior;
* change Setup save behavior;
* change profile save/delete/load behavior;
* change clear behavior beyond exposing each helper result;
* change backup import behavior;
* change backup export behavior;
* introduce download-completion claims;
* add migration markers;
* define migration completion;
* add telemetry;
* add a persistence service;
* add transactions;
* alter storage keys;
* alter local/profile/backup schemas;
* increment versions;
* alter validators;
* alter normalizers;
* remove compatibility readers;
* address unsupported local/profile read behavior;
* resolve unrelated Phase 1 ownership findings.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.23 — Establish Persistence-Failure Authority and Durable-Write Failure Boundaries.

Architectural governance derives from:

* Task 1.22 — Adopt the DayFrame Durable-Data Compatibility and Independent Format-Versioning Decision;
* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

Task 1.23 supplies the executable evidence defining the authorized helper seam.

---

# Evidence Standards

Implementation decisions must remain grounded in current executable behavior.

For any result category introduced, identify the exact executable observation that justifies it.

Examples:

```text
storage object unavailable
    → observable

JSON.stringify throws
    → observable

setItem throws
    → observable

"quota exceeded"
    → not necessarily safely classifiable beyond thrown storage failure
```

Do not turn exception-message parsing into architectural classification.

Distinguish implementation facts from browser/platform assumptions.

---

# Validation Requirements

Run focused tests covering the changed helper/result boundary.

At minimum verify:

* successful active persistence;
* failed active persistence;
* unavailable active storage;
* successful profile persistence;
* failed profile persistence;
* unavailable profile storage;
* successful active removal;
* failed active removal;
* successful profile removal;
* failed profile removal;
* independently observable clear outcomes;
* unchanged runtime mutation after a returned persistence failure;
* unchanged subscriber notification after a returned persistence failure.

Where serialization failure becomes a distinct outcome, test it.

Where storage-accessor exceptions are brought inside the helper contract, test them.

Then run the repository-standard validation sequence:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Run `git diff --check` for affected executable files.

Confirm the test baseline changes only by intentionally added tests.

---

# Documentation Rules

During Task 1.24:

## Create

* `TASK_1.24_MAKE_DURABLE_WRITE_OUTCOMES_OBSERVABLE_AT_PERSISTENCE_HELPER_BOUNDARY_RESULT.md`

## Preserve

* Task 1.24 specification;
* Task 1.23 result;
* durable-data ADR;
* Tasks 1.20–1.22 artifacts;
* existing checkpoints and governance history.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* ADR;
* Session Checkpoint.

Those updates require project review of Task 1.24 first.

Do not create a task-specific checkpoint unless separately authorized after review.

---

# Required Result Artifact Structure

The result artifact should include:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Persistence Outcome Contract
6. Active-State Persistence Result
7. Profile Persistence Result
8. Active-State Removal Result
9. Profile Removal Result
10. Storage-Unavailable Handling
11. Storage-Accessor Exception Determination
12. Serialization-Failure Determination
13. Caller Preservation
14. Mutation/Notification Preservation
15. Failure-Injection Tests
16. Reference Validation
17. ADR Alignment Improvement
18. Deviations
19. Discoveries and Deferred Work
20. Recommended Next Task
21. Validation
22. Final Completion Determination

If some sections collapse naturally because the same implementation covers multiple helpers, retain the headings and explain the shared behavior.

---

# Expected Architectural Result

Before Task 1.24:

```text
durable operation
    ├── succeeded
    └── failed
          ↓
        hidden
          ↓
         void
```

After Task 1.24:

```text
durable operation
    ├── succeeded
    ├── unavailable
    ├── serialization failed
    └── storage operation failed
          ↓
    explicit helper outcome
```

But the store still behaves as before:

```text
runtime mutation
    ↓
persistence attempt
    ↓
outcome currently ignored
    ↓
notify
```

This temporary architecture is intentional.

Task 1.24 establishes an observation boundary.

A later task establishes policy.

---

# Expected Follow-Up

If Task 1.24 completes without unexpected coupling, the next dependency-correct task should **not immediately change UI feedback**.

The likely next task should investigate or define the store-level durability contract:

> When a runtime mutation succeeds but durable persistence does not, what state does DayFrame consider authoritative, what should the mutation return, what should subscribers know, and what recovery/retry responsibility belongs to the store versus the workflow layer?

That decision should explicitly consider:

* rollback;
* runtime continuation;
* pending/dirty state;
* retry;
* reload behavior;
* clear aggregation;
* profile source recovery;
* backup source recovery.

Task 1.24 must not prejudge that decision.

---

# Completion Criteria

Task 1.24 is complete when:

* active-state persistence exposes an explicit outcome;
* profile persistence exposes an explicit outcome;
* active-state removal exposes an explicit outcome;
* profile removal exposes an explicit outcome;
* success is distinguishable from storage unavailability;
* ordinary storage-operation failure is distinguishable from success;
* serialization failure is separately represented if safely observable within the helper boundary;
* storage-accessor exception behavior is either incorporated without broader semantic change or explicitly deferred;
* focused failure-injection tests prove the result categories;
* current runtime mutation behavior remains unchanged;
* current subscriber behavior remains unchanged;
* current UI behavior remains unchanged;
* no caller branches on persistence outcome;
* no retry or rollback behavior is introduced;
* no durable schema, key, version, validator, normalizer, or compatibility reader changes;
* repository validation passes;
* the result artifact records any remaining hidden failure boundary;
* the result artifact identifies the next dependency-correct store-contract task.

---

# Task Determination

Task 1.24 is a bounded persistence-observability implementation.

It does not define persistence recovery policy.

It does not make runtime and durable state transactional.

It does not determine whether failed mutations should roll back, remain pending, retry, or continue as session-only state.

It establishes the factual result boundary required before those decisions can be made.

The implementation should leave DayFrame behaviorally equivalent while replacing four hidden `void` durability boundaries with explicit, testable persistence outcomes.

**The task is complete when active-state writes, profile writes, active-state removal, and profile removal expose explicit persistence outcomes at their existing helper boundaries, focused failure-injection tests establish those outcomes, and all existing store, subscriber, UI, persistence, scheduling, and durable-data behavior remains unchanged.**
