# Implementation Task 1.33 — Add a Store-Level Durability Status Subscription

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.33

**Task Name:** Add a Store-Level Durability Status Subscription

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.33_ADD_STORE_LEVEL_DURABILITY_STATUS_SUBSCRIPTION_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* subscription contract introduced;
* listener ownership;
* snapshot semantics;
* change-detection semantics;
* ordinary mutation integration;
* profile mutation integration;
* clear integration;
* retry integration;
* unchanged-status behavior;
* unsubscribe behavior;
* listener isolation behavior;
* existing state-subscriber preservation;
* desired-condition separation;
* UI preservation;
* tests added or updated;
* validation performed and results;
* deviations from authorized scope, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires adding UI consumers, banners, retry controls, shared workflow classification, automatic retry, persistence changes, desired-condition exposure, modifications to `DayFrameState`, durable-format changes, or recovery behavior, stop the affected work and record the discrepancy rather than expanding Task 1.33.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Required Subscription Contract;
* Change-Detection Semantics;
* Operation Integration Requirements;
* Subscriber Isolation;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when `DayFrameStore` exposes a separate durability-status subscription that emits immutable `StoreDurabilityStatus` snapshots only when retained active/profile durability values actually change, responds correctly to ordinary persistence, clear, and explicit retry, preserves unsubscribe and listener isolation, leaves ordinary `DayFrameState` subscribers untouched, and introduces no UI or persistence-policy behavior.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the integrity discrepancy for project review.

---

# Purpose

Add the separate reactive durability-status boundary justified by Task 1.32.

Tasks 1.27 and 1.31 deliberately avoided introducing a durability subscription because no production consumer had yet been architecturally established.

Task 1.32 changed that conclusion.

The adopted workflow model requires:

```text id="gx8qvw"
immediate contextual feedback
        +
persistent app-level durability feedback
```

The persistent surface must remain correct when durability changes through:

```text id="a0egra"
ordinary persistence
clear
explicit retry
```

Explicit retry intentionally causes:

```text id="pt5c1u"
durability change
without
DayFrameState change
```

Therefore the ordinary runtime-state subscription cannot support this future consumer without violating its contract.

Task 1.33 introduces only the missing reactive store boundary.

---

# Architectural Context

The store currently exposes conceptually distinct contracts:

```text id="cndpqr"
getState()
    → current runtime truth

subscribe(...)
    → runtime-state changes

getDurabilityStatus()
    → current retained durability truth

getDesiredDurableCondition()
    → current durable intent

retryActivePersistence()
retryProfilePersistence()
    → explicit durability retry
```

Task 1.33 adds:

```text id="9eaic2"
subscribeDurability(...)
    → retained durability changes
```

The intended architecture becomes:

```text id="zibwv4"
DayFrameStore
    |
    ├── DayFrameState
    │      ├── getState()
    │      └── subscribe()
    │
    ├── StoreDurabilityStatus
    │      ├── getDurabilityStatus()
    │      └── subscribeDurability()
    │
    └── StoreDesiredDurableCondition
           └── store-private retry routing / existing test read boundary
```

Runtime and durability reactivity remain separate.

---

# Governing Evidence

Task 1.27 established:

```text id="piwl47"
StoreDurabilityStatus
    activeState
    profiles
```

with values:

```text id="g4t3ws"
unknown
durable
unavailable
serializationFailure
storageFailure
```

Task 1.31 established that explicit retry may change durability without changing runtime state and therefore sends no ordinary state notification.

Task 1.32 adopted:

> **Immediate contextual feedback plus persistent app-level, surface-specific durability feedback.**

Task 1.32 further determined:

> **The adopted model creates a real production need for a separate durability subscription.**

The future consumer should initially obtain:

```text id="33ulvs"
getDurabilityStatus()
```

and then observe:

```text id="zc5mrd"
subscribeDurability(...)
```

for subsequent changes.

Task 1.33 implements only that infrastructure.

---

# Governing Subscriber Principle

The existing state subscriber contract remains:

> Receipt of a `DayFrameState` notification means the store's runtime/domain state changed.

The new durability subscriber contract must be:

> Receipt of a `StoreDurabilityStatus` notification means at least one retained durability surface changed value.

Neither subscription implies the other must fire.

---

# Objective

Introduce the smallest store-level reactive mechanism that:

1. exposes a durability subscription;
2. emits `StoreDurabilityStatus` only;
3. emits immutable/snapshot-safe values;
4. emits when active durability actually changes;
5. emits when profile durability actually changes;
6. emits once when both change together through clear;
7. emits when retry changes retained durability without changing `DayFrameState`;
8. does not emit when an operation leaves retained durability unchanged;
9. supports unsubscribe;
10. protects listeners from mutating store-owned status;
11. preserves listener isolation;
12. preserves ordinary state subscribers exactly;
13. does not expose desired durable condition;
14. introduces no production UI consumer yet.

---

# Required Subscription Contract

Add an API equivalent to:

```ts id="k3fos7"
subscribeDurability(
  listener: (status: StoreDurabilityStatus) => void,
): () => void;
```

Exact naming may follow repository convention.

The method must:

* register the listener;
* return an unsubscribe function;
* send future durability changes after registration;
* not automatically mutate or persist anything;
* not subscribe the listener to `DayFrameState`;
* not expose desired durable condition.

Do not introduce a generalized subscription framework merely for symmetry.

---

# Initial Snapshot Contract

`subscribeDurability()` does **not** need to invoke the listener immediately upon subscription.

The intended future consumer pattern is:

```text id="ytd6pm"
initial read
    → getDurabilityStatus()

future updates
    → subscribeDurability(listener)
```

This mirrors the explicit distinction between synchronous state access and change notification.

If existing store subscription convention automatically invokes on registration, inspect and preserve coherent repository convention only if doing so does not conflict with Task 1.32's accessor-plus-subscription model.

Record the chosen behavior explicitly.

Do not leave initial-callback semantics ambiguous.

---

# Recommended Initial Callback Determination

Unless current store convention requires otherwise, prefer:

```text id="izh05s"
subscribeDurability(listener)
    → registration only
    → no immediate callback
```

because:

```text id="2vah9f"
getDurabilityStatus()
```

already provides the initial snapshot.

This prevents a future consumer from receiving two conceptually different initial-value mechanisms.

---

# Retained Status Remains Authoritative

The subscription must emit from the same private retained durability state returned by:

```text id="nnmvae"
getDurabilityStatus()
```

Do not maintain separate subscription state.

Do not recompute durability from:

* localStorage contents;
* persistence result history;
* desired durable condition;
* `DayFrameState`;
* UI state.

One retained durability source of truth remains authoritative.

---

# Change-Detection Semantics

This is a required contract.

A durability notification occurs only when:

```text id="saujw4"
previous activeState !== next activeState
or
previous profiles !== next profiles
```

If both retained values are unchanged:

```text id="m9jqo8"
do not emit
```

Examples:

```text id="8brwnp"
active:
unknown → storageFailure
    → emit
```

```text id="avqi95"
active:
storageFailure → storageFailure
    → no durability emission
```

```text id="0kyxfs"
profiles:
unavailable → durable
    → emit
```

```text id="864t2d"
active:
durable → durable

profiles:
durable → durable
    → no durability emission
```

The subscription represents **retained-state change**, not persistence-attempt activity.

---

# Why Attempt-Based Emission Is Rejected

Do not notify merely because:

* a persistence attempt occurred;
* a mutation occurred;
* retry was invoked;
* clear was invoked.

Consumers can obtain operation-local facts from mutation/retry results.

The durability subscription exists to represent:

```text id="9sevro"
persistent retained status changed
```

not:

```text id="w4p7jb"
something persistence-related happened
```

This distinction prevents noisy duplicate UI updates and preserves the retained-state abstraction.

---

# Snapshot Semantics

Every durability listener receives an immutable-by-contract snapshot of:

```text id="p0j5q1"
StoreDurabilityStatus
```

At minimum:

```ts id="3c3q68"
{
  activeState: ...,
  profiles: ...,
}
```

The listener must not receive the store's mutable internal object by reference.

If internal durability state is already represented as separate primitives and a new object is produced for every read, use the same approach.

Do not expose internal mutation capability.

---

# Subscriber Mutation Isolation

If a listener attempts to mutate the received object, it must not change:

```text id="u8u7s4"
getDurabilityStatus()
```

or subsequent durability notifications.

Direct test coverage is required where technically meaningful.

---

# Listener Collection

Use the smallest store-owned listener representation consistent with the existing state subscription implementation.

Likely:

```text id="kv7y83"
Set<DurabilityListener>
```

or equivalent.

Do not introduce:

* event emitter libraries;
* observable libraries;
* React-specific state;
* global singleton infrastructure.

---

# Unsubscribe Semantics

The returned unsubscribe function must remove only that registered durability listener.

After unsubscribe:

```text id="mabks7"
future durability changes
    → listener receives nothing
```

Unsubscribing:

* must not affect ordinary state subscribers;
* must not affect other durability listeners;
* must not change durability state;
* must not throw if called in ordinary supported usage.

If existing state-subscription convention allows repeated unsubscribe calls safely, mirror it where practical.

---

# Multiple Listener Semantics

Multiple durability listeners may coexist.

A qualifying durability change must notify each currently subscribed durability listener exactly once.

Removing one listener must not remove the others.

Directly test listener isolation.

---

# Listener Error Semantics

Inspect the existing ordinary state subscriber implementation.

If current `notify()` behavior allows listener exceptions to propagate or abort later listener invocation, do not silently invent a new durability-specific error policy unless necessary.

Prefer consistent listener behavior between:

```text id="vn8p2c"
subscribe()
```

and:

```text id="su7qja"
subscribeDurability()
```

where the contracts are otherwise analogous.

Record the observed policy.

Do not add logging or exception swallowing solely for Task 1.33.

---

# Durability Update Boundary

Centralize durability change detection at the narrowest existing store-owned durability-update seam if practical.

Current operations already map factual persistence outcomes into retained status.

Prefer:

```text id="4bbfkg"
set/update retained durability
    ↓
compare previous and next
    ↓
if changed
    notify durability subscribers
```

over duplicating notification decisions in every mutation method.

Do not restructure unrelated persistence logic solely to achieve stylistic centralization.

---

# Ordinary Active Persistence Integration

For ordinary active writes, examples include:

```text id="uu489t"
unknown → durable
storageFailure → durable
durable → storageFailure
storageFailure → unavailable
```

Each actual retained-status transition must emit one durability notification.

The listener receives the full current:

```text id="49sn9f"
StoreDurabilityStatus
```

snapshot, including the unchanged profile surface.

---

# Ordinary Active Persistence — Unchanged Status

Example:

```text id="e1wpzr"
active status before = storageFailure

next active persistence
    → storageFailure

active status after = storageFailure
```

The ordinary store mutation still:

* applies runtime state;
* returns its mutation result;
* sends its normal `DayFrameState` notification.

But durability subscribers receive:

```text id="43ej2l"
0 notifications
```

because retained durability did not change.

This separation must be directly protected by tests.

---

# Profile Persistence Integration

Profile save/delete must trigger durability notification only if:

```text id="wx37j5"
profiles status changes
```

Active status remains part of the emitted snapshot but does not need to change.

Example:

```text id="rmgc69"
before:
active = durable
profiles = storageFailure

profile persistence succeeds

after:
active = durable
profiles = durable

→ one durability notification
```

---

# Profile Persistence — Unchanged Status

If:

```text id="53effy"
profiles = storageFailure
```

and another profile operation also results in:

```text id="4zg6lu"
storageFailure
```

no durability notification occurs.

Ordinary runtime-state notification behavior remains unchanged.

---

# Profile Load Integration

Profile load affects active durability only.

If active retained durability changes, emit one durability notification.

Do not emit merely because profile runtime/source state was used.

Profile retained durability remains unchanged.

---

# Backup Import Integration

Backup import affects active durability only.

Emit only if active retained status changes.

No backup durability surface exists.

---

# Manual Event Integration

Manual-event persistence affects active durability.

Emit only when active retained status changes.

Do not add manual-event-specific durability events.

---

# Clear Integration

Clear may change:

```text id="aozq69"
activeState
profiles
```

within one store operation.

The durability subscription must emit **at most one notification for the complete clear durability transition**.

The listener should receive the final combined snapshot after both removal outcomes have been interpreted.

Example:

```text id="618frx"
before:
active = storageFailure
profiles = unavailable

clear result:
active removal = removed
profiles removal = storageFailure

after:
active = durable
profiles = storageFailure

→ exactly one durability notification
```

Do not emit once for active and again for profiles during the same clear operation.

---

# Clear With One Changed Surface

If clear produces:

```text id="mznmvb"
before:
active = storageFailure
profiles = storageFailure

after:
active = durable
profiles = storageFailure
```

emit one notification.

At least one retained value changed.

---

# Clear With No Changed Surfaces

If both surfaces already have the same retained statuses that clear outcomes produce:

```text id="wxave8"
before:
active = storageFailure
profiles = storageFailure

clear:
active removal = storageFailure
profile removal = storageFailure

after:
active = storageFailure
profiles = storageFailure
```

emit:

```text id="fc23pu"
0 durability notifications
```

even though clear performed two removal attempts and sends its ordinary runtime-state notification.

---

# Clear Runtime Notification Preservation

Task 1.33 must not alter Task 1.30 clear behavior.

Clear still sends its existing one:

```text id="24dqxt"
DayFrameState
```

notification because runtime state resets.

Durability notification is a separate channel and occurs only if retained durability changes.

Therefore a qualifying clear may produce:

```text id="z64y5o"
1 ordinary state notification
+
1 durability notification
```

Those represent different truths.

---

# Retry Integration

Task 1.31 established:

```text id="b4f6ol"
retry changes durability
without changing DayFrameState
```

Task 1.33 must now make those transitions reactive.

Example:

```text id="x2tzgp"
active:
storageFailure
    ↓ successful retry
durable

→ 1 durability notification
→ 0 DayFrameState notifications
```

This is the key production need that justified the new subscription.

---

# Retry Failure With Changed Category

Example:

```text id="k1qicv"
storageFailure
    ↓ retry
unavailable

→ retained status changed
→ 1 durability notification
```

No state notification occurs.

---

# Retry Failure With Same Category

Example:

```text id="knagqv"
storageFailure
    ↓ retry
storageFailure

→ retained status unchanged
→ 0 durability notifications
```

The retry result still reports the factual attempted `storageFailure`.

Subscription silence does not erase the retry result.

---

# Retry Not Attempted

Retry from:

```text id="2l08jf"
unknown
durable
serializationFailure
```

does not alter retained status.

Therefore:

```text id="xx373e"
0 durability notifications
```

for `notAttempted` retry results.

Direct coverage should establish at least representative cases.

---

# Desired Durable Condition Separation

Changing:

```text id="3rdgwx"
snapshot ↔ absent
```

must not itself trigger durability subscription.

Example:

```text id="avkn0v"
desired:
snapshot → absent

durability:
storageFailure → storageFailure
```

If retained durability does not change:

```text id="cdhl5t"
0 durability notifications
```

Desired condition is store retry-routing infrastructure and is not part of the subscribed contract.

---

# Ordinary Mutation and Desired Intent

A mutation may change:

```text id="w65z5s"
DayFrameState
desired durable condition
```

while leaving:

```text id="7970zl"
StoreDurabilityStatus
```

unchanged.

In that case:

```text id="f74x7o"
state subscribers
    → notified according to existing runtime contract

durability subscribers
    → not notified
```

This is a required separation test.

---

# Initial `unknown` Status

New stores still begin:

```text id="nxxi0m"
activeState = unknown
profiles = unknown
```

Task 1.33 does not alter initialization.

Registering a subscription does not convert `unknown` into anything else.

No persistence attempt occurs.

---

# `durable` Status

The subscription may emit a transition **to** `durable`.

It does not provide permanent success badges or UI semantics.

Task 1.32 determined future persistent failure UI should disappear when a surface becomes durable.

Task 1.33 only emits the factual status transition.

---

# No Semantic Classification In Store

Do not add store-level classifications such as:

```text id="z6hzkf"
retryable
recoveryRequired
warning
success
```

The store emits:

```text id="rwj5fy"
StoreDurabilityStatus
```

only.

Task 1.32 assigned workflow semantic classification downstream.

---

# No Operation Information In Subscription

Do not emit:

* mutation names;
* profile IDs;
* clear result;
* retry result;
* desired condition;
* persistence helper outcome;
* timestamps;
* message strings.

The durability subscriber receives retained surface status only.

Immediate operation results remain responsible for operation context.

---

# Existing `DayFrameState` Subscriber Preservation

The ordinary:

```text id="zd1fxo"
subscribe(...)
```

contract must remain unchanged.

Do not:

* change callback arguments;
* add durability data;
* cause state subscribers to fire during retry;
* deduplicate existing runtime notifications based on durability;
* combine listener collections.

The two channels are independent.

---

# Subscription Naming

Preferred:

```text id="zbb89g"
subscribeDurability
```

because it parallels:

```text id="ogrg9p"
getDurabilityStatus
```

without implying domain-state subscription.

Use repository naming conventions if a slightly different name is clearly established.

Do not call it generic:

```text id="mzv8kn"
subscribeStatus
subscribeStore
```

unless that terminology already has a precise repository meaning.

---

# Public Store Contract

Update `DayFrameStore` or its equivalent public store interface with the subscription method.

Do not expose the internal durability listener collection.

Do not require production consumers yet.

It is acceptable for the new method to have no production UI call site after Task 1.33.

---

# UI Preservation

No UI file should consume:

```text id="6usv7g"
subscribeDurability
```

during this task.

Do not add:

* durability banner;
* global indicator;
* contextual persistence message changes;
* retry controls;
* recovery links;
* new app state.

Task 1.33 makes the reactive boundary available for the next staged implementation.

---

# No Workflow Classification Yet

Do not add a shared helper translating:

```text id="3iffep"
storageFailure
unavailable
serializationFailure
```

into:

```text id="qip588"
retryable failure
recovery required
```

Task 1.32 recommended that as the next semantic layer **after** subscription infrastructure.

Keep Task 1.33 focused.

---

# No Retry Changes

Task 1.31 retry methods remain semantically unchanged.

Do not change:

* eligibility;
* result shape;
* desired-condition routing;
* helper selection;
* automatic behavior.

Task 1.33 only makes resulting retained-status transitions observable.

---

# No Persistence Changes

Do not alter:

* `persistState`;
* `persistProfiles`;
* removal behavior;
* storage acquisition;
* helper outcome categories;
* mutation ordering;
* clear ordering;

except for the minimum call into retained-status notification logic required after existing status updates.

No new storage operation is permitted.

---

# No Persistence of Subscription State

Do not persist:

* listeners;
* last-emitted snapshot;
* subscriber count;
* durability notification metadata.

Subscription state is ephemeral within the store instance.

---

# Reentrancy / Listener Mutation

Inspect the existing ordinary state listener implementation for how it handles:

* listener unsubscribe during notification;
* listener addition during notification;
* multiple listeners.

Prefer consistent collection semantics.

Do not over-engineer a new event-dispatch framework.

If JavaScript `Set` iteration semantics are already accepted for state subscribers, analogous durability behavior is acceptable.

Record any meaningful edge behavior discovered.

---

# Required Operation Matrix

Implement and verify behavior equivalent to:

| Operation                                          | Retained Durability Changes? | Durability Notification |                      State Notification |
| -------------------------------------------------- | ---------------------------: | ----------------------: | --------------------------------------: |
| Active mutation, `unknown → durable`               |                          Yes |                       1 |                              Existing 1 |
| Active mutation, `storageFailure → storageFailure` |                           No |                       0 |                              Existing 1 |
| Profile mutation, status changes                   |                          Yes |                       1 |                              Existing 1 |
| Profile mutation, status unchanged                 |                           No |                       0 |                              Existing 1 |
| Profile load, active status changes                |                          Yes |                       1 |                              Existing 1 |
| Backup import, active status changes               |                          Yes |                       1 |                              Existing 1 |
| Clear, one/both durability values change           |                          Yes |                 1 total |                              Existing 1 |
| Clear, neither durability value changes            |                           No |                       0 |                              Existing 1 |
| Retry, failure → durable                           |                          Yes |                       1 |                                       0 |
| Retry, failure category changes                    |                          Yes |                       1 |                                       0 |
| Retry, same failure category                       |                           No |                       0 |                                       0 |
| Retry not attempted                                |                           No |                       0 |                                       0 |
| Desired-condition-only change                      |                           No |                       0 | According to existing runtime operation |
| `getDurabilityStatus()`                            |                           No |                       0 |                                       0 |
| Subscribe/unsubscribe                              |                           No |                       0 |                                       0 |

---

# Required Tests

Add focused store tests covering the subscription contract.

## Test 1 — Subscribe Receives Future Durability Change

Register one durability listener.

Perform an operation producing:

```text id="lhv22m"
unknown → durable
```

Assert exactly one callback containing the final `StoreDurabilityStatus`.

---

## Test 2 — No Immediate Callback On Registration

If the chosen contract follows the recommended accessor-plus-subscription model, assert:

```text id="g9khtx"
subscribeDurability(listener)
```

does not immediately invoke the listener.

If repository convention requires immediate emission instead, document and test the chosen rule explicitly.

---

## Test 3 — Active Status Change

Trigger an active durability transition.

Assert:

* one durability callback;
* emitted active status is current;
* emitted profile status is current;
* existing ordinary state notification remains exactly one.

---

## Test 4 — Active Status Unchanged

Arrange:

```text id="5r6ys6"
active = storageFailure
```

Perform another active mutation whose persistence also returns:

```text id="fzmmqr"
storageFailure
```

Assert:

* zero durability callbacks;
* existing state callback still occurs once.

This is mandatory.

---

## Test 5 — Profile Status Change

Cause a profile durability transition.

Assert one durability callback and one existing state callback for the runtime profile mutation.

---

## Test 6 — Profile Status Unchanged

Cause another profile operation with the same retained durability result.

Assert zero durability callbacks while ordinary state notification remains unchanged.

---

## Test 7 — Clear Both Values Change Emits Once

Arrange starting statuses such that clear changes both retained values.

Assert:

```text id="c93d4z"
durability callbacks = 1
state callbacks = 1
```

and the durability callback contains the final combined status.

Do not allow two durability callbacks.

---

## Test 8 — Clear One Value Changes Emits Once

Arrange clear so exactly one retained surface changes.

Assert one durability callback with the final combined snapshot.

---

## Test 9 — Clear No Values Change Emits Zero

Arrange a clear whose outcomes leave both retained statuses equal to their previous values.

Assert:

```text id="94zb4w"
durability callbacks = 0
state callbacks = 1
```

---

## Test 10 — Retry Success Emits Durability Only

Arrange eligible failed active or profile status.

Retry successfully.

Assert:

```text id="vhq5p1"
durability callbacks = 1
state callbacks = 0
```

and emitted status is `durable` for the affected surface.

---

## Test 11 — Retry Failure Category Changes

Arrange:

```text id="81ruf1"
storageFailure
```

then retry resulting in:

```text id="nsbply"
unavailable
```

Assert one durability callback.

---

## Test 12 — Retry Same Failure Emits Zero

Arrange:

```text id="w0051i"
storageFailure
    ↓ retry
storageFailure
```

Assert zero durability callbacks and zero state callbacks.

---

## Test 13 — Not-Attempted Retry Emits Zero

Call retry from a representative ineligible status such as `unknown`, `durable`, or `serializationFailure`.

Assert zero durability callbacks.

---

## Test 14 — Desired-Condition Change Alone Does Not Emit

Establish a sequence where desired condition changes while retained durability remains the same.

For example, where safely constructible:

```text id="x0xxt9"
snapshot/storageFailure
    ↓ clear removal also storageFailure
absent/storageFailure
```

Assert:

* desired condition changed;
* durability status did not;
* durability callback count = 0;
* existing clear state notification remains unchanged.

This is a key separation test.

---

## Test 15 — Unsubscribe

Subscribe, then unsubscribe.

Cause a qualifying durability transition.

Assert listener receives nothing.

---

## Test 16 — One Unsubscribe Does Not Affect Another Listener

Register two durability listeners.

Unsubscribe one.

Cause a status change.

Assert only the remaining listener fires exactly once.

---

## Test 17 — Multiple Listeners

With multiple active listeners, cause one qualifying durability transition.

Assert each receives the same logical final status exactly once.

---

## Test 18 — Snapshot Mutation Isolation

Capture the status object received by a listener.

Where technically possible, mutate it.

Assert:

```text id="oza5x3"
store.getDurabilityStatus()
```

remains correct and later notifications are unaffected.

---

## Test 19 — Accessor Does Not Notify

Call:

```text id="09ifh9"
getDurabilityStatus()
```

while subscribed.

Assert zero callbacks.

---

## Test 20 — Subscription Operations Do Not Notify State Subscribers

Register/unregister durability listeners.

Assert ordinary state subscribers receive nothing.

---

## Test 21 — Retry Remains State-Silent

Preserve Task 1.31 coverage while durability subscription is active.

A successful retry must still produce zero ordinary `DayFrameState` notifications.

---

## Test 22 — No Desired Condition In Emitted Snapshot

Verify emitted subscription values contain only the established `StoreDurabilityStatus` contract.

Do not use brittle implementation-detail enumeration if TypeScript contract/reference validation provides stronger evidence.

---

# Existing Tests to Preserve

Preserve prior coverage proving:

* retained durability mappings;
* desired durable condition;
* mutation-result semantics;
* accessor failure normalization;
* retry eligibility/routing;
* retry state silence;
* ordinary state subscription behavior.

Do not replace previous tests with durability-subscription assertions.

The new subscription is an additional contract.

---

# Change Notification Helper

If implementation introduces an internal helper, its responsibility should be narrowly equivalent to:

```text id="r8zmd1"
apply/replace retained durability
    ↓
compare previous + next
    ↓
if changed:
    notify durability listeners
```

or:

```text id="o3s54c"
capture previous status
    ↓
perform current status update
    ↓
notify once if final status differs
```

Clear must still be able to batch two surface updates into one final durability notification.

Avoid an implementation where a generic per-surface setter automatically emits immediately if that would force clear to emit twice.

A batching-aware or operation-final comparison may be safer.

---

# Clear Batching Requirement

This deserves explicit protection.

Do not implement:

```text id="52wvyo"
setActiveDurability(...)
    → notify

setProfileDurability(...)
    → notify
```

inside clear if both values change.

The durable subscription represents the final retained snapshot after the logical store operation.

For clear:

```text id="63971h"
capture previous StoreDurabilityStatus
    ↓
apply both final retained values
    ↓
compare complete previous/final snapshots
    ↓
notify once if different
```

or equivalent.

---

# Ordinary Single-Surface Operations

For ordinary writes/retry affecting only one surface, the same full-snapshot comparison can be used.

This gives one consistent semantic rule:

> **One logical store operation emits at most one durability notification, and only if its final retained durability snapshot differs from the snapshot at operation start.**

This should be treated as a normative invariant.

---

# Required Durability Subscription Invariant

Add this explicit invariant to the result:

> **A logical DayFrame store operation emits at most one `StoreDurabilityStatus` notification, and emits none when the operation leaves the retained durability snapshot unchanged.**

This governs:

* ordinary active mutations;
* profile mutations;
* clear;
* retry.

---

# Cross-Operation Behavior

Each separate logical operation may emit independently.

For example:

```text id="12ie1w"
operation A:
storageFailure → unavailable
    → emit

operation B:
unavailable → durable
    → emit
```

Do not coalesce across distinct store calls.

No asynchronous batching system is required.

---

# Synchronous Notification

Unless the existing store subscription architecture establishes otherwise, durability notification should be synchronous within the store call, after retained status reaches its final value.

A listener calling:

```text id="s5j7ge"
getDurabilityStatus()
```

during its callback should observe the same logical status it received.

Do not introduce asynchronous timers or microtasks.

---

# Operation Result Ordering

Preserve existing operation semantics.

For an ordinary mutation:

```text id="eav8vj"
runtime transition
    ↓
persistence outcome
    ↓
retained durability finalizes
    ↓
durability notify if changed
    ↓
ordinary state notify
    ↓
return mutation result
```

or the nearest ordering already dictated by current implementation.

Task 1.33 does not authorize broad mutation-order changes.

If current structure makes state notification occur before durability notification while still presenting final retained truth coherently, preserve behavior and record the actual order.

The essential requirements are:

* at most one durability notification;
* only after its emitted status is final;
* no additional state notification.

---

# Retry Result Ordering

For explicit retry:

```text id="jedniw"
helper attempt
    ↓
retained durability finalizes
    ↓
durability notify if changed
    ↓
return retry result
```

No state notification.

---

# Listener View Consistency

During a durability callback:

```text id="b29t89"
listener(receivedStatus)
```

a synchronous call to:

```text id="ssudmx"
getDurabilityStatus()
```

must return an equivalent status snapshot.

Directly test where practical.

---

# Expected Files to Change

Likely executable files:

* `code/src/state/types.ts`;
* `code/src/state/dayFrameStore.ts`;
* `code/src/state/tests/dayFrameStore.test.ts`.

No UI file is expected to change.

No new persistence module should be necessary.

---

# Reference Validation

After implementation verify:

* `subscribeDurability` or equivalent exists on `DayFrameStore`;
* listeners receive `StoreDurabilityStatus` only;
* listener registration returns unsubscribe;
* no immediate callback occurs unless repository convention explicitly justified it;
* actual status changes emit;
* unchanged status does not emit;
* clear emits at most once;
* retry status changes emit despite no `DayFrameState` change;
* same-status retry does not emit;
* ineligible retry does not emit;
* desired-condition-only changes do not emit;
* accessor reads do not emit;
* state subscription remains unchanged;
* retry remains state-silent;
* no production UI consumes the subscription;
* no desired-condition data enters the subscription;
* no persistence/retry semantics changed;
* no durable format/key/version changed.

---

# Explicit Non-Goals

Task 1.33 shall not:

* add UI durability feedback;
* add global durability surfaces;
* add contextual persistence messages;
* add retry controls;
* add recovery controls;
* add workflow semantic classification;
* change exact product copy;
* add automatic retry;
* change retry eligibility;
* change retry result types;
* change persistence outcome types;
* change retained durability values;
* change desired durable condition;
* expose desired condition through durability subscription;
* change `DayFrameState`;
* combine runtime and durability subscriptions;
* use polling;
* persist listener/subscription state;
* add event libraries;
* change persistence formats;
* change storage keys;
* increment versions;
* change validators;
* change normalizers;
* modify migrations;
* remove compatibility readers;
* address read/hydration recovery;
* redesign broader DayFrame UI;
* resolve unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.27 — Retain Store-Level Durability Status Outside `DayFrameState`;
* Task 1.31 — Implement Store-Owned Active and Profile Durability Retry;
* Task 1.32 — Establish Workflow-Level Durability Feedback, Retry Initiation, and Recovery Boundaries.

Also preserves contracts established in Tasks 1.23–1.30.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

Dependency chain:

```text id="551gia"
retained durability
    ↓
explicit retry
    ↓
workflow feedback architecture
    ↓
reactive durability requirement
    ↓
Task 1.33 subscription boundary
```

---

# Evidence Standards

Durability notification means:

> The retained durability snapshot changed during this logical store operation.

It does not mean:

* a persistence attempt happened;
* a user-visible error occurred;
* retry is available;
* recovery is required;
* state changed;
* desired condition changed.

Those facts belong to other contracts.

Do not overload the subscription.

---

# ADR Alignment

Task 1.33 improves:

* persistent durability observability;
* deterministic store ownership;
* reactive failure transparency;
* retry visibility readiness;
* separation of runtime and durability truth;
* epistemic integrity.

It does not yet implement user-facing communication.

The store exposes facts; workflow/UI will later interpret and present them.

---

# Validation Requirements

Run focused store tests covering:

```text id="nznycy"
subscribe/unsubscribe
change-based emission
active mutations
profile mutations
clear batching
retry success
retry changed failure category
retry unchanged failure
not-attempted retry
desired-condition-only change
snapshot isolation
state-subscriber preservation
```

Then run:

```text id="8tl4q8"
npm run lint
npm run typecheck
npm test
npm run build
```

Run:

```text id="g5acz2"
git diff --check
```

for affected scope.

Record:

* focused store-test count;
* full test-file count;
* full test count;
* number of tests added;
* lint result;
* typecheck result;
* build result;
* diff-check result.

Confirm:

* Task 1.33 specification remained immutable;
* result artifact exists separately;
* no production UI changed;
* no workflow semantics changed;
* no persistence/retry behavior changed;
* no durable format changed.

---

# Documentation Rules

During Task 1.33:

## Create

* `TASK_1.33_ADD_STORE_LEVEL_DURABILITY_STATUS_SUBSCRIPTION_RESULT.md`

## Preserve

* Task 1.33 specification;
* Tasks 1.23–1.32 results;
* durable-data ADR;
* current architecture/governance documentation;
* checkpoints and historical artifacts.

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

The Task 1.33 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Subscription Contract
6. Initial Snapshot / Registration Semantics
7. Listener Ownership
8. Snapshot Semantics
9. Change-Detection Semantics
10. At-Most-One-Notification Invariant
11. Active Mutation Integration
12. Profile Mutation Integration
13. Profile Load Integration
14. Backup Import Integration
15. Manual-Event Integration
16. Clear Batching Integration
17. Retry Integration
18. Retry Same-Status Behavior
19. Retry No-Op Behavior
20. Desired-Condition Separation
21. Multiple Listener Semantics
22. Unsubscribe Semantics
23. Listener Mutation Isolation
24. Listener Error/Iteration Semantics
25. Runtime-State Subscriber Preservation
26. UI Preservation
27. Workflow Classification Deferral
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

Before Task 1.33:

```text id="ef97nd"
StoreDurabilityStatus changes
        ↓
getDurabilityStatus()
can reveal it

but:
no reactive consumer can be informed
unless it already initiated the operation
```

After Task 1.33:

```text id="a14zmu"
                   DayFrameStore
                        |
        ┌───────────────┴────────────────┐
        |                                |
        v                                v
   DayFrameState              StoreDurabilityStatus
        |                                |
   subscribe()                 subscribeDurability()
        |                                |
 runtime changes                durability changes
```

For retry:

```text id="789i4j"
retry
    ↓
DayFrameState unchanged
    ↓
durability changes
    ↓
durability subscriber notified
    ↓
state subscriber remains silent
```

The two reactive contracts remain independent.

---

# Expected Follow-Up

If Task 1.33 completes cleanly, the reactive store foundation required by Task 1.32 will exist.

The next dependency-correct task should implement the **shared workflow semantic classification** before introducing UI copy or components.

A likely next task is:

> **Task 1.34 — Implement Shared Durability Outcome and Retry-Result Semantic Classification**

It should translate factual store outcomes into narrow workflow semantic categories such as:

```text id="j9tvco"
durableSuccess
retryableUnavailable
retryableStorageFailure
recoveryRequired
benignAlreadyDurable
internalNoOp
```

or an evidence-derived equivalent.

It should not contain final product copy, render UI, inspect localStorage, choose retry payloads, or duplicate store persistence logic.

After that, separate tasks can update individual workflows and eventually add the persistent app-level durability surface.

Do not implement Task 1.34 as part of Task 1.33.

---

# Completion Criteria

Task 1.33 is complete when:

* `DayFrameStore` exposes a separate durability-status subscription;
* the subscription emits `StoreDurabilityStatus` only;
* registration/unsubscribe semantics are explicit;
* listener snapshots cannot mutate internal status;
* active durability transitions emit;
* profile durability transitions emit;
* clear emits at most one durability notification for its final combined status;
* retry durability transitions emit despite no runtime-state change;
* unchanged retained durability emits nothing;
* same-category failed persistence emits nothing;
* same-category failed retry emits nothing;
* not-attempted retry emits nothing;
* desired-condition-only changes emit nothing;
* accessor reads emit nothing;
* one logical store operation emits at most one durability notification;
* multiple listeners are isolated;
* unsubscribe works;
* ordinary state subscriber contract remains unchanged;
* retry remains state-silent;
* no durability information enters `DayFrameState`;
* no desired-condition information enters the durability subscription;
* no UI consumer is introduced;
* no workflow classification is introduced;
* no persistence or retry semantics change;
* no durable schema/key/version changes;
* focused tests directly protect subscription semantics;
* full validation passes;
* the result artifact identifies the next dependency-correct seam.

---

# Task Determination

Task 1.33 is a bounded store-observability implementation.

It does not implement durability UI, workflow messaging, retry controls, recovery, or new persistence policy.

Its purpose is to add the reactive boundary justified by Task 1.32 while preserving the architectural distinction between runtime truth and durability truth.

A future persistent durability surface will be able to:

```text id="8ijy6w"
read initial durability
    → getDurabilityStatus()

observe subsequent changes
    → subscribeDurability()
```

without polling, inspecting localStorage, or depending on unrelated `DayFrameState` notifications.

**The task is complete when `DayFrameStore` exposes a separate durability-status subscription that emits immutable `StoreDurabilityStatus` snapshots only when retained active/profile durability values actually change, responds correctly to ordinary persistence, clear, and explicit retry, preserves unsubscribe and listener isolation, leaves ordinary `DayFrameState` subscribers untouched, and introduces no UI or persistence-policy behavior.**
