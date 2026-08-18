# Implementation Task 1.31 — Implement Store-Owned Active and Profile Durability Retry

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.31

**Task Name:** Implement Store-Owned Active and Profile Durability Retry

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.31_IMPLEMENT_STORE_OWNED_ACTIVE_AND_PROFILE_DURABILITY_RETRY_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* retry result contract introduced;
* active retry API introduced;
* profile retry API introduced;
* retry eligibility implemented;
* desired-condition routing implemented;
* snapshot retry behavior;
* absence retry behavior;
* retained durability transitions;
* retry result semantics;
* subscriber behavior;
* UI preservation;
* no-op retry behavior;
* storage-accessor behavior;
* tests added or updated;
* validation performed and results;
* deviations from authorized scope, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires adding UI controls, automatic retry, a durability subscription, changes to `DayFrameState`, new durable formats, migration behavior, recovery UX, new persistence outcome categories, or a generic persistence service, stop the affected work and record the discrepancy rather than expanding Task 1.31.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Retry Contract;
* Retry Eligibility;
* Active Retry Semantics;
* Profile Retry Semantics;
* Snapshot/Absence Routing;
* Subscriber Semantics;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when the store exposes bounded active/profile durability retry methods that retry only eligible non-durable surfaces, route `snapshot` to the latest current complete representation and `absent` to removal, update retained durability from the exact helper outcome, return an explicit retry result, notify no ordinary `DayFrameState` subscribers, and preserve all current runtime/UI/persistence-format behavior.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the artifact-integrity discrepancy for project review.

---

# Purpose

Implement explicit store-owned durability retry for DayFrame's two browser-persisted surfaces:

```text id="9mbw6a"
active authored state
saved profiles
```

Tasks 1.23–1.30 established all prerequisite architecture.

The store now owns:

```text id="r16nym"
DayFrameState
    = current runtime/session truth

StoreDurabilityStatus
    = current durability knowledge

StoreDesiredDurableCondition
    = current durable intent
```

Task 1.28 adopted the retry rule:

> Retry attempts again to establish the store's **current desired durable condition**.

It explicitly rejected:

* original failed mutation replay;
* last failed snapshot replay;
* workflow command replay;
* historical mutation queues.

Task 1.29 added the missing durable-intent distinction:

```text id="q95oqs"
snapshot
absent
```

Task 1.30 made write/removal persistence attempts total with respect to the existing persistence outcome contract.

Task 1.31 now makes retry executable.

---

# Architectural Context

The current store can represent:

```text id="tsv3ym"
active:
    desired = snapshot
    durability = storageFailure
```

or:

```text id="h5tacl"
profiles:
    desired = absent
    durability = unavailable
```

but cannot yet explicitly retry either surface.

Task 1.31 should introduce:

```text id="od9wyw"
retryActivePersistence()
retryProfilePersistence()
```

or repository-equivalent names.

The store must decide how to retry from the retained desired condition.

The workflow must not decide the retry source or invoke persistence helpers directly.

---

# Governing Evidence

Task 1.28 determined:

* active snapshot retry uses the latest current authored runtime representation;
* profile snapshot retry uses the latest complete current profile collection;
* absence retry repeats the relevant key removal;
* retry is allowed only for `storageFailure` and `unavailable`;
* retry is not attempted from `unknown`;
* retry is not attempted from `durable`;
* blind retry is not attempted from `serializationFailure`;
* retry changes no `DayFrameState`;
* retry sends no ordinary state notification;
* store executes and interprets retry;
* workflow/user initiates retry;
* no automatic retry is adopted;
* exact persistence/removal outcomes must be returned.

Task 1.30 established that relevant write/removal helper attempts now return factual outcomes even if acquiring `globalThis.localStorage` throws.

---

# Objective

Implement the smallest store-level retry surface that:

1. exposes active-state retry;
2. exposes profile retry;
3. checks retained durability eligibility;
4. reads retained desired condition;
5. routes `snapshot` to the appropriate complete current-state writer;
6. routes `absent` to the appropriate removal helper;
7. performs exactly one durable attempt when eligible;
8. performs no durable attempt when ineligible;
9. updates only the retried surface's retained durability status;
10. leaves desired condition unchanged;
11. changes no `DayFrameState`;
12. sends no ordinary state notification;
13. returns an explicit discriminated result;
14. performs no automatic retry;
15. requires no UI changes.

---

# Store Surfaces In Scope

Exactly two retry methods are authorized.

## Active State

Potential future API:

```ts id="dgw7u4"
retryActivePersistence(): DurabilityRetryResult;
```

## Profiles

Potential future API:

```ts id="x115p0"
retryProfilePersistence(): DurabilityRetryResult;
```

Exact names may follow current repository naming, but surface-specific APIs are preferred.

Do not introduce a generic surface registry.

---

# Required Retry Result Contract

Introduce a result equivalent to:

```ts id="m3vulb"
type DurabilityRetryResult =
  | {
      status: "attempted";
      desiredCondition: "snapshot";
      persistence: PersistenceWriteOutcome;
    }
  | {
      status: "attempted";
      desiredCondition: "absent";
      persistence: PersistenceRemovalOutcome;
    }
  | {
      status: "notAttempted";
      reason: "unknown" | "alreadyDurable" | "serializationFailure";
    };
```

Exact type/property names may follow repository conventions.

Do not add `DayFrameState` to this result.

Retry does not change runtime state.

Do not collapse exact helper outcomes to a boolean.

---

# Meaning of `attempted`

`status: "attempted"` means:

> The store executed exactly one write or removal attempt for the surface's current desired durable condition.

It does not mean persistence succeeded.

Success is determined from:

```text id="0hat0w"
persistence.status
```

or equivalent existing outcome structure.

---

# Meaning of `notAttempted`

`status: "notAttempted"` means the store deliberately performed no storage operation because the current retained durability state does not authorize ordinary retry.

Allowed reasons are exactly:

```text id="22xo7i"
unknown
alreadyDurable
serializationFailure
```

Do not add speculative reasons such as:

```text id="4tt9ta"
notNeeded
invalid
blocked
noStorage
```

unless current type conventions require equivalent naming.

---

# Retry Eligibility

Eligibility depends on retained durability status.

Required behavior:

| Retained status        | Retry? |
| ---------------------- | -----: |
| `storageFailure`       |    Yes |
| `unavailable`          |    Yes |
| `serializationFailure` |     No |
| `durable`              |     No |
| `unknown`              |     No |

No automatic persistence attempt occurs merely because desired condition exists.

---

# Retry From `storageFailure`

For:

```text id="upth7y"
storageFailure
```

retry performs exactly one attempt using the current desired condition.

The result reflects the new factual outcome.

Retained durability becomes the mapped latest outcome.

---

# Retry From `unavailable`

For:

```text id="0thqut"
unavailable
```

retry performs exactly one attempt through the existing helper.

This rechecks storage availability naturally.

Possible results include:

```text id="4ob3wz"
persisted / removed
unavailable
storageFailure
serializationFailure   (snapshot only)
```

Retained durability updates accordingly.

---

# Retry From `serializationFailure`

Do not perform a storage operation.

Return:

```text id="trc478"
status = notAttempted
reason = serializationFailure
```

Retained durability remains unchanged.

Desired condition remains unchanged.

No notification occurs.

A later ordinary runtime mutation may change the snapshot and perform normal persistence.

---

# Retry From `unknown`

Do not perform a storage operation.

Return:

```text id="jkl8vh"
status = notAttempted
reason = unknown
```

This preserves the distinction between:

```text id="0gi961"
retry failed persistence
```

and a hypothetical generic:

```text id="zklrgj"
persist now
```

No force-persist API is authorized.

---

# Retry From `durable`

Do not perform a storage operation.

Return:

```text id="v28pjc"
status = notAttempted
reason = alreadyDurable
```

Do not perform redundant persistence merely because the method was called.

---

# Desired Condition Routing

Retry must use:

```text id="y1u2k5"
StoreDesiredDurableCondition
```

as the durable operation selector.

Required mapping:

| Desired condition | Operation                            |
| ----------------- | ------------------------------------ |
| `snapshot`        | complete current-surface persistence |
| `absent`          | durable key removal                  |

The retained durability status determines whether retry is eligible.

The desired condition determines **what** retry does.

These are independent inputs.

---

# Active Snapshot Retry

For:

```text id="kgf102"
surface = active
desired = snapshot
status = storageFailure | unavailable
```

retry must use the latest current active runtime state at retry time.

Conceptually:

```text id="s852xz"
retryActivePersistence()
    ↓
current DayFrameState
    ↓
persistState(currentState)
```

The writer already extracts the current authored durable representation.

Do not retain or reuse an earlier failed snapshot.

---

# Active Snapshot Freshness

Mandatory behavior:

```text id="8t6epu"
active persistence fails
    ↓
user performs later runtime changes
    ↓
those persistence attempts also fail or remain non-durable
    ↓
explicit retry
```

The retry source must be the **latest current runtime state**.

Do not replay an earlier authored snapshot.

This should be directly tested.

---

# Profile Snapshot Retry

For:

```text id="q8yof2"
surface = profiles
desired = snapshot
status = storageFailure | unavailable
```

retry must persist:

```text id="8t9pl0"
current complete state.savedProfiles
```

using the existing profile writer.

Do not retain a failed profile collection or per-profile mutation queue.

---

# Profile Snapshot Freshness

Mandatory behavior:

```text id="0qdpfd"
profile save fails
    ↓
runtime profile collection changes again
    ↓
retry
```

The retry must persist the latest current collection.

Do not replay only the originally failed save/delete.

---

# Active Absence Retry

For:

```text id="afjeqy"
surface = active
desired = absent
status = storageFailure | unavailable
```

retry must call the existing active-state removal helper exactly once.

Conceptually:

```text id="r52zwp"
retryActivePersistence()
    ↓
clearPersistedState()
```

Do not persist reset/default `DayFrameState`.

That would violate Task 1.28 clear semantics.

---

# Profile Absence Retry

For:

```text id="5atknv"
surface = profiles
desired = absent
status = storageFailure | unavailable
```

retry must call the existing profile removal helper exactly once.

Do not persist an empty collection as a substitute for absence.

---

# Partial Clear Retry

Task 1.31 must directly support partial clear recovery.

Example:

```text id="pq59ci"
desired:
    active = absent
    profiles = absent

durability:
    active = durable
    profiles = storageFailure
```

Then:

```text id="qygqif"
retryProfilePersistence()
```

must attempt only profile removal.

It must not touch active durable storage.

Likewise, if only active failed, active retry attempts only active removal.

---

# Both-Surface Clear Failure

If both surfaces are:

```text id="n0gmi9"
desired = absent
durability = storageFailure
```

each surface-specific retry is independent.

Calling active retry does not automatically retry profiles.

Calling profile retry does not automatically retry active.

No aggregate clear-retry API is authorized.

---

# Desired Condition Preservation During Retry

Retry must not alter desired condition.

Example:

```text id="ew2dbw"
desired = absent
status = storageFailure
    ↓
retry removal succeeds
    ↓
desired = absent
status = durable
```

and:

```text id="j2xs5x"
desired = snapshot
status = unavailable
    ↓
retry write succeeds
    ↓
desired = snapshot
status = durable
```

Retry establishes the current intent; it does not replace that intent.

---

# Retained Durability Mapping

Reuse Task 1.27 mappings.

For write retry:

| Write outcome          | Retained durability    |
| ---------------------- | ---------------------- |
| `persisted`            | `durable`              |
| `unavailable`          | `unavailable`          |
| `serializationFailure` | `serializationFailure` |
| `storageFailure`       | `storageFailure`       |

For removal retry:

| Removal outcome  | Retained durability |
| ---------------- | ------------------- |
| `removed`        | `durable`           |
| `unavailable`    | `unavailable`       |
| `storageFailure` | `storageFailure`    |

Do not add retry-specific retained statuses such as:

```text id="qde4xl"
retryFailed
retrying
retrySucceeded
```

---

# Latest Outcome Wins

If retry is attempted, the latest factual outcome replaces prior retained durability status.

Example:

```text id="0fka3v"
storageFailure
    ↓ retry
unavailable
```

retained status becomes:

```text id="m4jsmz"
unavailable
```

Do not preserve the prior `storageFailure` as current status.

No history is retained.

---

# Retry Success

Successful write retry:

```text id="zlni0h"
persisted
    → durable
```

Successful removal retry:

```text id="he6x8x"
removed
    → durable
```

This means the current desired durable condition is now confirmed by the supported persistence boundary.

It does not claim historical intermediate snapshots were persisted.

---

# Retry Idempotence

Retry must be idempotent with respect to runtime/domain state.

Eligible retries may:

* perform one persistence/removal attempt;
* update retained durability;
* return a result.

They must not:

* change `DayFrameState`;
* replace state with a clone;
* change authored timestamps;
* regenerate Preview;
* change profile IDs;
* change profile contents;
* change desired condition;
* notify ordinary state subscribers.

---

# State Subscriber Semantics

Task 1.28 established the normative rule:

> **An explicit durability retry does not notify ordinary `DayFrameState` subscribers when runtime state does not change.**

Task 1.31 must implement that rule.

Do not call:

```text id="7df2xy"
notify()
```

from retry methods.

Do not fake a state assignment to trigger existing subscribers.

---

# Durability Subscription

Do not add one.

The initiating caller receives:

```text id="8zb1xn"
DurabilityRetryResult
```

and can synchronously inspect:

```text id="qnewuc"
getDurabilityStatus()
```

if needed.

No current reactive UI consumer exists.

---

# Retry Result and Retained Status Consistency

For every attempted retry:

```text id="gk2r15"
returned persistence outcome
```

and:

```text id="ofkq4u"
retained durability status
```

must correspond to the same factual helper outcome.

Do not make another helper call to determine retained status.

One attempt → one outcome → result + retained status.

---

# Store Ownership

Retry methods belong on `DayFrameStore`.

Persistence helpers remain private factual operations.

Workflows must not gain access to:

```text id="bveoyy"
persistState
persistProfiles
clearPersistedState
clearPersistedProfiles
```

merely to implement retry.

The store remains the sole interpreter of:

```text id="8k20sn"
durability status
+
desired durable condition
+
helper selection
```

---

# API Shape

Preferred:

```ts id="j3pjmd"
retryActivePersistence(): DurabilityRetryResult;
retryProfilePersistence(): DurabilityRetryResult;
```

Do not introduce:

```ts id="ur52lh"
retryDurability(surface)
```

unless current store organization makes surface-specific methods materially worse.

Task 1.28 preferred explicit surface methods.

No clear-specific retry API is required.

---

# Result Type Placement

Place `DurabilityRetryResult` with existing store/persistence contract types.

Do not put it in scheduling/domain types.

Do not create a new generalized result framework.

---

# No UI Consumption Yet

No production UI should call the new retry methods during Task 1.31.

This task establishes the store capability first.

Do not modify:

* Setup save UI;
* profile UI;
* manual-event UI;
* backup UI;
* clear UI;
* navigation;
* Preview.

The methods may therefore have zero production callers after implementation.

That is acceptable.

---

# Caller Audit

After implementation, verify:

* retry methods exist on the store contract;
* no current production UI invokes them;
* no automatic call site exists;
* no mutation method calls retry internally;
* no startup logic calls retry;
* no subscription callback calls retry.

Retry is explicit but currently unconsumed.

---

# No Automatic Retry

Do not add:

* immediate retry after failure;
* timers;
* exponential backoff;
* focus listeners;
* browser lifecycle listeners;
* retry on next render;
* retry on startup;
* retry on storage event;
* retry on next ordinary mutation beyond existing incidental persistence.

Exactly one retry method call corresponds to at most one durable attempt.

---

# Storage Accessor Behavior

Task 1.30 established total write/removal helper outcomes for storage accessor exceptions.

Retry must use those helpers unchanged.

Therefore accessor exceptions during retry should result in:

```text id="v55v31"
storageFailure
```

not thrown exceptions.

Do not add retry-specific exception handling around storage acquisition if the helper already owns it.

---

# Read Accessor Behavior

Hydration/read accessor exceptions remain separately deferred.

Retry operates on current runtime/store data and does not require a durable read.

Do not broaden Task 1.31 into read recovery.

---

# Serialization Failure During Retry

A snapshot retry can theoretically produce:

```text id="7jmgaf"
serializationFailure
```

even if eligibility began from:

```text id="46fnsh"
storageFailure
```

or:

```text id="qpko2m"
unavailable
```

if current runtime data has changed.

If that occurs:

```text id="ew6bka"
retry result = attempted / snapshot / serializationFailure
retained durability = serializationFailure
```

Future blind retry is then blocked by eligibility rules.

This is expected and should be tested where safely possible.

---

# Runtime Changes Between Failure and Retry

Task 1.31 must preserve the Task 1.28 rule:

> **Current runtime intent at retry time is authoritative.**

Do not check whether the current runtime snapshot equals the failed one.

Do not require a dirty marker.

Do not preserve original write parameters.

The latest desired condition plus current runtime representation is sufficient.

---

# No Recovery Behavior

Retry is not recovery.

Do not add:

* profile reload;
* backup re-import;
* rollback;
* checkpoint restore;
* snapshot repair;
* serialization repair;
* unsupported-format conversion.

If retry is `notAttempted` because of serialization failure, the future workflow may choose recovery later.

---

# No Migration Semantics

Retry does not:

* mark migration complete;
* establish population convergence;
* update compatibility versions;
* retire readers;
* write migration markers.

A surface becoming:

```text id="8sp27r"
durable
```

after retry remains operational store-instance durability only.

---

# Required Retry Matrix

Implement and test behavior equivalent to:

| Surface  | Desired  | Status               | Action                          | Notification | Result                    |
| -------- | -------- | -------------------- | ------------------------------- | -----------: | ------------------------- |
| Active   | snapshot | storageFailure       | persist current active snapshot |           No | attempted/write outcome   |
| Active   | snapshot | unavailable          | persist current active snapshot |           No | attempted/write outcome   |
| Active   | absent   | storageFailure       | remove active key               |           No | attempted/removal outcome |
| Active   | absent   | unavailable          | remove active key               |           No | attempted/removal outcome |
| Profiles | snapshot | storageFailure       | persist current profiles        |           No | attempted/write outcome   |
| Profiles | snapshot | unavailable          | persist current profiles        |           No | attempted/write outcome   |
| Profiles | absent   | storageFailure       | remove profile key              |           No | attempted/removal outcome |
| Profiles | absent   | unavailable          | remove profile key              |           No | attempted/removal outcome |
| Either   | any      | serializationFailure | no attempt                      |           No | notAttempted              |
| Either   | any      | durable              | no attempt                      |           No | notAttempted              |
| Either   | any      | unknown              | no attempt                      |           No | notAttempted              |

---

# Required Tests

Add focused store tests covering all critical branches.

## Test 1 — Active Snapshot Retry Success

Arrange:

```text id="mk3y04"
active desired = snapshot
active durability = storageFailure
```

Retry.

Assert:

* exactly one active write occurs;
* current runtime authored snapshot is written;
* result is `attempted`;
* desired condition is `snapshot`;
* write outcome is `persisted`;
* retained active durability becomes `durable`;
* profile durability/intent remain unchanged;
* `DayFrameState` remains unchanged;
* no state subscriber notification occurs.

---

## Test 2 — Active Snapshot Retry Uses Latest Runtime State

Create a failed active persistence state, then make later runtime changes before explicit retry.

Ensure retry writes the latest complete runtime authored representation, not the earlier failed state.

This is mandatory.

---

## Test 3 — Active Snapshot Retry Failure

Retry from `storageFailure`, inject another `storageFailure`.

Assert:

* one attempt;
* result reports `storageFailure`;
* retained active remains/becomes `storageFailure`;
* desired remains `snapshot`;
* no state notification.

---

## Test 4 — Active Retry From Unavailable Becomes Durable

Arrange:

```text id="66elzt"
active durability = unavailable
```

Restore available storage and retry.

Assert successful persistence and:

```text id="ji5iva"
active durability = durable
```

---

## Test 5 — Active Retry Outcome Changes Failure Category

Arrange `storageFailure`, then retry while storage is unavailable.

Assert retained status becomes:

```text id="dxzoil"
unavailable
```

The latest outcome wins.

---

## Test 6 — Active Absence Retry

Create failed active removal through clear:

```text id="cvldzj"
desired = absent
durability = storageFailure
```

Retry active.

Assert:

* one removal attempt;
* no snapshot write;
* result desired condition is `absent`;
* successful result contains `removed`;
* retained active becomes `durable`;
* desired remains `absent`;
* no state notification.

---

## Test 7 — Profile Snapshot Retry Success

Arrange failed profile write.

Retry profiles.

Assert:

* current complete profile collection is persisted;
* result is attempted/snapshot;
* retained profiles become durable;
* active infrastructure unchanged;
* no state notification.

---

## Test 8 — Profile Snapshot Retry Uses Latest Collection

After an initial failed profile write, make later profile runtime changes that remain non-durable.

Explicit retry must write the latest complete collection.

Do not replay the first failed profile operation.

---

## Test 9 — Profile Absence Retry

Create failed profile removal through clear.

Retry profiles.

Assert exactly one profile-key removal, desired remains absent, status becomes durable on success, no state notification.

---

## Test 10 — Partial Clear Surface Independence

Arrange:

```text id="zadt2d"
active:
    desired = absent
    durability = durable

profiles:
    desired = absent
    durability = storageFailure
```

Retry profiles.

Assert no active storage operation occurs.

---

## Test 11 — Retry From Unknown

Immediately after store creation, call each retry method.

Assert:

```text id="hkk7ij"
status = notAttempted
reason = unknown
```

for the respective surface.

No storage write/removal.

No status/intent change.

No notification.

---

## Test 12 — Retry From Durable

Establish `durable`, then retry.

Assert:

```text id="tc0ui9"
notAttempted / alreadyDurable
```

and zero storage operations.

---

## Test 13 — Retry From Serialization Failure

Arrange a surface at:

```text id="h4kk0w"
serializationFailure
```

Call retry.

Assert:

```text id="ffqwgn"
notAttempted / serializationFailure
```

with zero storage operations and unchanged status.

---

## Test 14 — Serialization Failure Can Arise During Eligible Retry

Where safely injectable, begin from `storageFailure` or `unavailable`, alter current runtime data such that snapshot serialization fails, and retry.

Assert:

```text id="crbnsi"
attempted
desiredCondition = snapshot
persistence = serializationFailure
```

and retained status becomes `serializationFailure`.

If public-type-safe construction makes this inappropriate, test through the narrowest existing injection seam and document the limitation.

---

## Test 15 — Accessor Exception During Retry

Cause `globalThis.localStorage` access to throw during an eligible retry.

Assert:

* no exception escapes;
* retry result reports attempted with `storageFailure`;
* retained status becomes `storageFailure`;
* desired condition remains unchanged;
* no state notification.

---

## Test 16 — No State Mutation

Capture state before an eligible retry.

After retry, assert state equality/equivalence sufficient to prove no domain mutation occurred.

Avoid relying solely on object identity if getters clone state.

---

## Test 17 — No State Notification

Subscribe to ordinary state snapshots.

Perform an eligible successful retry.

Assert zero notifications.

Repeat for a failed eligible retry if necessary to prove the same rule.

---

## Test 18 — No-Op Retries Do Not Notify

Retry from `unknown`, `durable`, and/or `serializationFailure`.

Assert zero state notifications.

---

## Test 19 — Desired Condition Never Changes During Retry

Directly establish for both:

```text id="c44mqb"
snapshot stays snapshot
absent stays absent
```

across success and failure where practical.

---

## Test 20 — Other Surface Remains Untouched

Active retry must not change profile durability or desired condition.

Profile retry must not change active durability or desired condition.

---

# Helper Call Count

Where testing infrastructure permits, assert:

```text id="c6p9j5"
eligible retry
    = exactly one helper attempt

ineligible retry
    = zero helper attempts
```

No hidden retry loop is permitted.

---

# Existing Tests to Preserve

Preserve existing coverage from Tasks 1.24–1.30 for:

* helper outcomes;
* session-first ordinary mutations;
* mutation results;
* retained durability;
* desired condition;
* accessor normalization;
* clear behavior;
* subscriber behavior.

Do not rewrite earlier tests so retry becomes the only proof of those contracts.

---

# Expected Files to Change

Likely:

* `code/src/state/types.ts`;
* `code/src/state/dayFrameStore.ts`;
* `code/src/state/tests/dayFrameStore.test.ts`.

No UI file is expected to change.

No persistence helper module should need architectural restructuring.

---

# Reference Validation

After implementation verify:

* `retryActivePersistence` or equivalent exists;
* `retryProfilePersistence` or equivalent exists;
* both are declared on `DayFrameStore`;
* `DurabilityRetryResult` or equivalent exists;
* only `storageFailure` and `unavailable` cause attempts;
* `unknown`, `durable`, and `serializationFailure` do not;
* snapshot retry uses current runtime data;
* absence retry uses removal helpers;
* retry does not alter desired condition;
* retry updates only the affected retained durability surface;
* retry does not call ordinary `notify()`;
* no UI invokes retry;
* no automatic retry exists;
* no durability subscription exists;
* no new persistence outcome category exists;
* no `DayFrameState` field was added;
* no durable schema/key/version changed;
* compatibility readers remain unchanged.

---

# Explicit Non-Goals

Task 1.31 shall not:

* add retry UI;
* add buttons or banners;
* add automatic retry;
* add timers/backoff;
* add a durability subscription;
* add desired-condition subscription;
* change `DayFrameState`;
* change existing mutation-result structures;
* change existing persistence outcome types;
* add `retrying` status;
* add failure history;
* retain failed snapshots;
* retain failed operations;
* add rollback;
* add recovery;
* re-import backups;
* reload profiles;
* change clear runtime behavior;
* normalize read/hydration failures;
* add migration markers;
* change migration behavior;
* change durable schemas;
* change storage keys;
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
* Task 1.29 — Retain Per-Surface Desired Durable Condition Outside `DayFrameState`;
* Task 1.30 — Normalize Local-Storage Accessor Failures Into Existing Persistence Outcomes.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

---

# Evidence Standards

Retry must operate on current store truth.

Do not infer that an earlier failed snapshot remains authoritative.

Allowed factual claims:

```text id="v5jhn5"
current state
current profile collection
current desired durable condition
current retained durability status
latest helper outcome
```

Disallowed implicit claims:

```text id="uh54eq"
original failed operation is still desired
last failed snapshot is still authoritative
retry means repeat command
```

---

# ADR Alignment

Task 1.31 should improve alignment with:

* explicit retryability;
* deterministic store ownership;
* non-destructive user-data handling;
* current-intent preservation;
* failure transparency;
* recovery readiness;
* epistemic integrity.

It still does not complete:

* user-visible persistence communication;
* reactive durability UI;
* recovery UX;
* read/hydration recovery;
* migration evidence.

Do not claim broader completion.

---

# Validation Requirements

Run focused store tests covering:

* active snapshot retry success/failure;
* latest-runtime active retry;
* active absence retry;
* profile snapshot retry success/failure;
* latest-profile retry;
* profile absence retry;
* unavailable recovery;
* failure-category transition;
* unknown no-op;
* durable no-op;
* serialization no-op;
* accessor exception retry;
* no state mutation;
* no state notification;
* surface independence.

Then run:

```text id="c07mjd"
npm run lint
npm run typecheck
npm test
npm run build
```

Run:

```text id="d5gva9"
git diff --check
```

for affected scope.

Record:

* focused store-test count;
* full test-file count;
* full test count;
* tests added;
* lint result;
* typecheck result;
* build result;
* diff-check result.

Confirm:

* Task 1.31 specification remained immutable;
* result artifact exists separately;
* no UI behavior changed;
* no automatic retry exists;
* no schema/key/version changed.

---

# Documentation Rules

During Task 1.31:

## Create

* `TASK_1.31_IMPLEMENT_STORE_OWNED_ACTIVE_AND_PROFILE_DURABILITY_RETRY_RESULT.md`

## Preserve

* Task 1.31 specification;
* Tasks 1.23–1.30 results;
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

The Task 1.31 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Retry Result Contract
6. Retry Eligibility
7. Active Retry API
8. Profile Retry API
9. Snapshot Routing
10. Absence Routing
11. Active Snapshot Retry
12. Active Snapshot Freshness
13. Active Absence Retry
14. Profile Snapshot Retry
15. Profile Snapshot Freshness
16. Profile Absence Retry
17. Partial Clear Retry
18. Retry From `unknown`
19. Retry From `durable`
20. Retry From `serializationFailure`
21. Storage-Unavailable Retry
22. Storage-Failure Retry
23. Accessor-Failure Retry
24. Retained Durability Transitions
25. Desired-Condition Preservation
26. Retry Result / Status Consistency
27. Runtime-State Preservation
28. Subscriber Preservation
29. Surface Independence
30. UI Preservation
31. Automatic-Retry Absence
32. Tests Added or Updated
33. Reference Validation
34. ADR Alignment Improvement
35. Deviations
36. Discoveries and Deferred Work
37. Recommended Next Task
38. Validation
39. Final Completion Determination

---

# Expected Architectural Result

Before Task 1.31:

```text id="y5vr97"
surface durability = failure
desired condition known
    ↓
store knows what retry should mean
    ↓
but no explicit retry capability exists
```

After Task 1.31:

```text id="9bjel8"
workflow requests retry
        ↓
store checks eligibility
        ↓
reads desired durable condition
        ↓
snapshot ───────→ persist latest current representation
absent   ───────→ remove durable key
        ↓
one factual helper outcome
        ↓
retained durability updated
        ↓
retry result returned
```

No domain-state transition occurs.

No ordinary state notification occurs.

---

# Expected Follow-Up

If Task 1.31 completes cleanly, DayFrame will finally possess a coherent store-owned durability recovery primitive.

The next dependency-correct work should **not automatically be UI implementation**.

We should first investigate how durability failure and retry should be surfaced to workflows:

* which workflows require immediate persistence feedback;
* whether retained durability needs a reactive subscription;
* whether one global durability warning or contextual workflow messaging is appropriate;
* how `serializationFailure` should differ from retryable failures;
* how clear partial failure should be communicated;
* when recovery should be offered instead of retry.

A likely next task is:

> **Task 1.32 — Establish Workflow-Level Durability Feedback, Retry Initiation, and Recovery Boundaries**

with investigation/architectural-decision scope before any UI changes.

---

# Completion Criteria

Task 1.31 is complete when:

* an explicit active durability retry method exists;
* an explicit profile durability retry method exists;
* retry result is discriminated between attempted and not attempted;
* attempted snapshot retry returns exact write outcome;
* attempted absence retry returns exact removal outcome;
* only `storageFailure` and `unavailable` are retryable;
* `unknown` is not attempted;
* `durable` is not attempted;
* `serializationFailure` is not attempted;
* active snapshot retry uses latest current authored runtime data;
* profile snapshot retry uses latest current profile collection;
* active absence retry removes the active key;
* profile absence retry removes the profile key;
* partial clear surfaces can be retried independently;
* retry changes no `DayFrameState`;
* retry causes no ordinary state notification;
* retry does not alter desired durable condition;
* retry updates only the affected retained durability status;
* latest helper outcome replaces prior retained status;
* storage accessor exceptions produce `storageFailure` through existing helper behavior;
* no automatic retry exists;
* no retry UI exists;
* no durability subscription is added;
* no recovery behavior is introduced;
* no migration semantics change;
* no durable schema/key/version changes;
* focused tests directly protect retry semantics;
* full repository validation passes;
* the result artifact identifies the next dependency-correct seam.

---

# Task Determination

Task 1.31 is a bounded store-level durability retry implementation.

It does not add user-facing recovery behavior, automatic retry, domain-state changes, or new persistence policy.

Its purpose is to make the retry contract adopted in Task 1.28 executable using the retained durability status from Task 1.27, desired durable condition from Task 1.29, and total write/removal outcomes from Task 1.30.

After Task 1.31, DayFrame should be able to deliberately retry a non-durable active or profile surface without replaying stale user operations, overwriting newer runtime intent, or confusing durability changes with domain-state changes.

**The task is complete when the store exposes bounded active/profile durability retry methods that retry only eligible non-durable surfaces, route `snapshot` to the latest current complete representation and `absent` to removal, update retained durability from the exact helper outcome, return an explicit retry result, notify no ordinary `DayFrameState` subscribers, and preserve all current runtime/UI/persistence-format behavior.**
