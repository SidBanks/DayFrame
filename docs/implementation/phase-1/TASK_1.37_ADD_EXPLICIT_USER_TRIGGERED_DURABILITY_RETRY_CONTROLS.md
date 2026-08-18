# Implementation Task 1.37 — Add Explicit User-Triggered Durability Retry Controls

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.37

**Task Name:** Add Explicit User-Triggered Durability Retry Controls

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded UI / Workflow Integration

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.37_ADD_EXPLICIT_USER_TRIGGERED_DURABILITY_RETRY_CONTROLS_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* retry controls introduced;
* active-surface retry integration;
* profile-surface retry integration;
* eligibility presentation;
* retry-result classification;
* successful retry behavior;
* retryable failure behavior;
* recovery-required behavior;
* already-durable behavior;
* unknown/no-op behavior;
* subscription-driven persistent awareness updates;
* immediate workflow feedback coexistence;
* state-subscriber preservation;
* automatic-retry absence;
* recovery deferral;
* accessibility;
* tests added or updated;
* validation performed and results;
* deviations from authorized scope, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires adding recovery actions, automatic retry, new store APIs, new persistence policy, desired-condition exposure, migration behavior, changes to `DayFrameState`, changes to retry semantics, or changes to durable formats, stop the affected work and record the discrepancy rather than expanding Task 1.37.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Retry-Control Eligibility;
* Active Retry Integration;
* Profile Retry Integration;
* Retry Result Handling;
* Subscription Interaction;
* Recovery Boundary;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when persistent app-level retryable durability awareness exposes explicit surface-specific user-triggered retry controls that invoke the existing store-owned retry APIs, classify exact retry results through the shared semantic layer, rely on retained-durability subscription updates for persistent-state convergence, hide retry for recovery-required/non-actionable states, preserve `DayFrameState` and subscriber semantics, and introduce no automatic retry or recovery behavior.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the integrity discrepancy for project review.

---

# Purpose

Add explicit user-triggered retry to the persistent durability-awareness surface introduced by Task 1.36.

DayFrame already has every lower-level prerequisite:

```text
Task 1.27
retained durability status

Task 1.28
retry semantics

Task 1.29
desired durable condition

Task 1.30
total write/removal persistence outcome boundary

Task 1.31
retryActivePersistence()
retryProfilePersistence()

Task 1.33
subscribeDurability()

Task 1.34
shared durability semantic classification

Task 1.36
persistent app-level durability awareness
```

What remains missing is the user-action seam:

```text
known retryable durability problem
        ↓
explicit Retry action
        ↓
store-owned retry
```

Task 1.37 adds only that seam.

---

# Architectural Context

The current persistent durability surface can show:

```text
active:
    retryableUnavailable
    retryableStorageFailure
    recoveryRequired

profiles:
    retryableUnavailable
    retryableStorageFailure
    recoveryRequired
```

but it is read-only.

Task 1.31 already exposes:

```ts
retryActivePersistence(): DurabilityRetryResult;
retryProfilePersistence(): DurabilityRetryResult;
```

Task 1.37 connects retryable persistent states to those methods.

The UI must not choose:

* snapshot versus absence;
* persistence helper;
* storage key;
* payload;
* retry eligibility independently.

The store already owns those decisions.

---

# Governing Evidence

Task 1.28 established:

> Workflows/users initiate ordinary retry; the DayFrame store executes it and interprets the persistence result.

Task 1.31 established:

* only `storageFailure` and `unavailable` are retryable;
* `serializationFailure` is not blindly retryable;
* `unknown` is not retryable;
* `durable` is not retryable;
* retry changes no `DayFrameState`;
* retry sends no ordinary state notification;
* active/profile retry remain surface-specific.

Task 1.34 established semantic classification:

```text
durableSuccess
retryableUnavailable
retryableStorageFailure
recoveryRequired
internalNoOp
```

Task 1.36 established a persistent app-level surface that already classifies active/profile retained durability independently.

Task 1.37 should use those semantics rather than reinterpret raw store values.

---

# Objective

Add the smallest persistent retry interaction that:

1. exposes retry only for retryable active-state failure;
2. exposes retry only for retryable profile failure;
3. invokes the corresponding existing store retry method;
4. performs retry only in direct response to explicit user action;
5. classifies returned `DurabilityRetryResult` through Task 1.34;
6. treats successful retry as completion;
7. treats retryable failure as still unresolved;
8. treats retry-produced serialization failure as recovery-required;
9. treats `alreadyDurable` as benign completion;
10. treats `unknown` as stale/internal no-op;
11. relies on `subscribeDurability()` for persistent awareness changes;
12. does not mutate runtime state;
13. does not create automatic retry;
14. does not implement recovery.

---

# Retry-Control Eligibility

A retry control is visible only when the relevant retained semantic classification is:

```text
retryableUnavailable
```

or:

```text
retryableStorageFailure
```

Do not show retry for:

```text
durableSuccess
internalNoOp
recoveryRequired
```

This is mandatory.

---

# Eligibility Source

Eligibility should derive from the shared semantic classification already used by the persistent durability surface.

Do not duplicate a raw check such as:

```ts
status === "storageFailure" || status === "unavailable"
```

inside presentation code unless unavoidable for a narrow type refinement.

The Task 1.34 semantic vocabulary should remain the workflow authority.

---

# Active Retry Control

When active retained durability is retryable, show one explicit control associated with the active durability entry.

Conceptually:

```text
Active setup durability problem
    [Retry]
```

The control must invoke:

```ts
retryActivePersistence()
```

exactly once per user activation.

Do not invoke profile retry.

---

# Profile Retry Control

When profile retained durability is retryable, show one explicit control associated with the saved-profiles durability entry.

It must invoke:

```ts
retryProfilePersistence()
```

exactly once per user activation.

Do not invoke active retry.

---

# Surface Independence

When both surfaces are retryable:

```text
active retry control
profiles retry control
```

must coexist independently.

Activating one must not automatically retry the other.

Task 1.31 deliberately made retry surface-specific.

---

# Recovery-Required Surface

When a surface classifies as:

```text
recoveryRequired
```

show the persistent recovery-required awareness from Task 1.36 but **no Retry control**.

Do not render:

* disabled Retry;
* retry-looking button;
* automatic retry;
* placeholder recovery action.

The absence of retry is part of the semantic truth.

---

# Unknown Surface

`unknown` remains suppressed.

Therefore no retry control exists.

If stale UI/test timing somehow invokes a callback after the store has transitioned to `unknown`, the store result should be classified normally; do not invent special raw-status logic.

---

# Durable Surface

A durable surface remains suppressed and therefore has no retry control.

If the durability changes to durable between render and user activation in a race condition, the store may return:

```text
notAttempted / alreadyDurable
```

Task 1.37 must treat that as benign completion.

---

# Retry Result Classification

Every retry result must pass through:

```ts
classifyDurabilityRetryResult(...)
```

or repository-equivalent Task 1.34 shared classifier.

Do not switch directly on raw retry result branches for semantic meaning where the shared classifier already exists.

---

# Retry Success

For:

```text
durableSuccess
```

after retry:

* do not display an error;
* do not mutate `DayFrameState`;
* allow the retained durability subscription to remove the persistent warning when the store becomes durable.

The control does not need to manually hide the persistent surface.

The subscription remains authoritative.

---

# Why Subscription Owns Persistent Clearing

Do not implement:

```text
retry returns success
    ↓
locally remove warning
```

as the primary mechanism.

Instead:

```text
retry store method
    ↓
retained durability becomes durable
    ↓
subscribeDurability()
    ↓
Task 1.36 awareness updates
```

This preserves one source of persistent truth.

A local retry-result message may coexist if needed, but persistent visibility must remain store-driven.

---

# Retryable Failure After Retry

If retry returns:

```text
retryableUnavailable
```

or:

```text
retryableStorageFailure
```

the persistent warning remains.

If the semantic category changed:

```text
storage failure → unavailable
```

Task 1.33 subscription should update the persistent awareness wording automatically.

Do not manually reconstruct retained status from the retry result.

---

# Same-Category Failure

If:

```text
storageFailure → retry → storageFailure
```

Task 1.33 emits no durability notification because retained status did not change.

The persistent warning already displays the correct state.

Task 1.37 may optionally maintain operation-local retry feedback if needed, but must not force a fake retained-state update merely to show that another attempt occurred.

---

# Retry Produces Serialization Failure

An eligible snapshot retry can produce:

```text
serializationFailure
```

if current runtime data has changed.

The shared semantic classifier maps that to:

```text
recoveryRequired
```

The store retained status also becomes serialization failure, causing Task 1.36 persistent awareness to transition reactively to recovery-required.

The Retry control must then disappear.

Do not attempt another retry automatically.

---

# Already-Durable Result

Task 1.34 maps:

```text
notAttempted / alreadyDurable
```

to:

```text
durableSuccess
```

Treat it as benign completion.

Do not show an error such as:

```text
Nothing to retry
```

The persistent retained status should already be or shortly be rendered as durable/suppressed.

---

# Unknown No-Op Result

Task 1.34 maps:

```text
notAttempted / unknown
```

to:

```text
internalNoOp
```

This should normally be unreachable from a properly rendered retry control.

If it occurs due to stale UI timing:

* do not present it as a storage failure;
* do not retry again automatically;
* do not invent user-facing explanation unless current component structure requires one.

Treat it as a benign stale/no-op interaction and let current retained state drive the persistent surface.

---

# Not-Attempted Serialization Failure

If a stale retry control reaches:

```text
notAttempted / serializationFailure
```

classify as:

```text
recoveryRequired
```

and let current retained durability drive persistent recovery awareness.

Do not retry again.

---

# Retry Invocation State

Determine whether the button needs a transient in-progress state.

Because current persistence helpers are synchronous, a complex async loading model is probably unnecessary.

Do not introduce fake async state or spinners if retry completes synchronously.

If current event-handler conventions use temporary disabled state regardless, preserve repository consistency only if it adds value.

---

# Double Activation

Because retry is synchronous, repeated user activations are separate explicit retry attempts.

Task 1.37 does not need debouncing unless current UI interaction patterns require it.

Do not add automatic loops.

Each activation must correspond to at most one store retry call.

---

# Retry Result Local Feedback

Task 1.32 established that user-triggered retry should have interpretable immediate feedback.

Task 1.37 may add minimal operation-local retry-result feedback inside the persistent awareness surface if necessary.

Allowed conceptual categories:

```text
Retry succeeded
Retry still unavailable
Retry failed
Recovery now required
```

However, do not perform a broad copywriting pass.

If the persistent retained state itself communicates the unresolved result sufficiently, a separate success/failure message may be unnecessary.

The result artifact must record the determination.

---

# Success Feedback After Warning Disappears

A successful retry may cause the entire persistent warning to disappear immediately.

Determine whether a temporary “saved” confirmation is necessary.

Default preference:

```text
no extra persistent success indicator
```

because Task 1.36 intentionally suppresses durable state.

If existing UX conventions strongly expect action confirmation, use the smallest transient/local acknowledgement and document it.

Do not turn the app-level surface into a success log.

---

# Immediate Workflow Feedback Coexistence

Task 1.35 immediate workflow feedback remains unchanged.

A retry may be initiated from the persistent surface while an older contextual workflow message remains.

Do not try to synchronize or erase historical operation-local messages globally.

Persistent retained truth and operation-local history remain separate.

---

# No Retry Controls In Immediate Workflow Messages

Task 1.37 should place retry controls in the persistent app-level durability surface unless current UI architecture clearly requires otherwise.

Do not add duplicate retry buttons to every Task 1.35 contextual message.

Task 1.32 favored persistent discoverability; one persistent surface-specific retry affordance is sufficient.

This prevents inconsistent duplicate controls.

---

# Persistent Surface Component Integration

If Task 1.36 implemented a dedicated `PersistentDurabilityAwareness` component, extend it narrowly.

Potential new props:

```ts
onRetryActive?: () => DurabilityRetryResult
onRetryProfiles?: () => DurabilityRetryResult
```

or store access consistent with current implementation.

Prefer not to give a purely presentational component broader store authority than necessary.

If `DayFrameApp` already owns the store subscription/state, it may own retry handlers and pass callbacks down.

Choose the smallest architecture-preserving design.

---

# Retry Handler Ownership

Preferred:

```text
DayFrameApp / persistent workflow layer
    → user callback
    → store.retryActivePersistence()
       or
       store.retryProfilePersistence()
    → classify result
```

Presentation component renders the appropriate control.

Do not let a deep child inspect localStorage or desired durable condition.

---

# Store Retry Method Preservation

Do not modify:

```text
retryActivePersistence()
retryProfilePersistence()
```

unless implementation uncovers a contract violation.

Task 1.37 is a consumer.

If store behavior does not satisfy the already-adopted retry contract, stop and document rather than silently broadening scope.

---

# No State Notification

Retry remains state-silent.

UI updates caused by retry must come through:

```text
subscribeDurability()
```

and local retry-result state if any.

Do not cause or expect a `DayFrameState` notification.

Tests should directly preserve this integration property where practical.

---

# No Desired Durable Condition Exposure

The UI still must not read:

```text
snapshot
absent
```

The store routes retry internally.

The Retry button should not say:

```text
Retry removal
Retry snapshot save
```

based on internal desired condition.

Surface-level wording is sufficient.

---

# Active Surface Copy

Task 1.36 already established provisional active-state awareness copy.

Task 1.37 may add a concise control label such as:

```text
Retry saving active setup
```

or a shared:

```text
Retry
```

if context makes the surface unambiguous.

Prefer accessible labels that clearly identify the target surface when both retry controls are present.

---

# Profile Surface Copy

Likewise ensure the profiles Retry control is distinguishable when both surfaces are failing.

Accessible naming should make it clear which surface will be retried.

---

# Recovery-Required Copy Preservation

Do not change recovery-required copy to imply that Retry might work.

No Retry control appears beside that semantic.

---

# Unavailable Versus Storage Failure

Both are retryable and may share the same Retry action.

Their explanatory text remains distinct.

Do not create separate retry APIs or action types.

---

# No Dismissal Change

Task 1.36 persistent warnings remain non-dismissible until retained truth no longer requires attention.

Adding Retry must not add a dismiss action.

---

# Accessibility

Retry controls must:

* be keyboard accessible;
* have clear accessible names;
* identify the affected surface;
* not rely solely on visual adjacency where both surfaces can appear;
* not create repeated live-region announcements on same-status retry.

Use existing button semantics.

---

# No Live Announcement Requirement

Do not introduce aggressive `aria-live` solely to announce retry results.

The persistent region may update naturally according to existing semantics.

If the entire warning disappears on success, that is acceptable.

---

# Retryable Surface Matrix

Implement:

| Surface semantic                   | Retry control? | Store method                |
| ---------------------------------- | -------------: | --------------------------- |
| active `retryableUnavailable`      |            Yes | `retryActivePersistence()`  |
| active `retryableStorageFailure`   |            Yes | `retryActivePersistence()`  |
| active `recoveryRequired`          |             No | none                        |
| active `durableSuccess`            |             No | none                        |
| active `internalNoOp`              |             No | none                        |
| profiles `retryableUnavailable`    |            Yes | `retryProfilePersistence()` |
| profiles `retryableStorageFailure` |            Yes | `retryProfilePersistence()` |
| profiles `recoveryRequired`        |             No | none                        |
| profiles `durableSuccess`          |             No | none                        |
| profiles `internalNoOp`            |             No | none                        |

---

# Retry Result Matrix

Handle:

| Retry semantic            | UI interpretation                                                 |
| ------------------------- | ----------------------------------------------------------------- |
| `durableSuccess`          | benign completion; persistent warning clears from retained status |
| `retryableUnavailable`    | warning remains/updates; Retry remains available                  |
| `retryableStorageFailure` | warning remains/updates; Retry remains available                  |
| `recoveryRequired`        | warning becomes recovery-required; Retry disappears               |
| `internalNoOp`            | stale/benign no-op; no new durability error                       |

---

# Cross-Surface Behavior

If:

```text
active = retryableStorageFailure
profiles = retryableUnavailable
```

and user retries active successfully:

```text
active warning disappears
profiles warning remains
profiles Retry remains available
```

No profile store operation occurs.

Direct test coverage is required.

---

# Partial Clear Recovery

Task 1.36 may show one unresolved surface after partial clear.

Task 1.37 must allow the Retry action on that unresolved surface.

Because desired condition is `absent`, the store will correctly retry removal.

The UI does not need to know that.

Direct test:

```text
partial clear
profiles unresolved
    ↓
Retry profiles
    ↓
profile removal succeeds
    ↓
persistent profiles warning disappears
```

This is an important end-to-end proof of Task 1.28–1.31 clear retry architecture.

---

# Both-Surface Clear Failure

If both clear removals failed, two Retry controls may appear.

Each is independent.

No “Retry Clear” aggregate action is added.

---

# Active Snapshot Retry Through UI

Directly test a normal active write failure:

```text
Setup/manual event/etc.
    ↓
active warning + Retry
    ↓
later storage works
    ↓
user clicks active Retry
    ↓
current active snapshot persists
    ↓
warning disappears
```

The UI does not reconstruct the original operation.

---

# Profile Snapshot Retry Through UI

Likewise test:

```text
profile save failure
    ↓
profiles warning + Retry
    ↓
later storage works
    ↓
Retry
    ↓
current profile collection persists
    ↓
warning disappears
```

---

# Latest Runtime/Profile Semantics

Task 1.31 already proves retry uses latest current state.

Task 1.37 does not need to duplicate all freshness tests through UI.

At least one integration test should prove the UI calls the existing retry method rather than replaying the original workflow action.

---

# No Workflow Replay

Do not implement Retry by calling:

```text
commitAuthoredSetup(...)
saveProfile(...)
deleteProfile(...)
clearLocalData(...)
```

again.

Retry controls must call only the dedicated store retry methods.

This is mandatory.

---

# No Automatic Retry After Button Failure

If a user retry attempt returns another retryable failure:

```text
one click = one attempt
```

Do not loop.

The Retry control remains available because retained semantics remain retryable.

---

# No Recovery Implementation

For `recoveryRequired`, Task 1.37 stops at awareness.

Do not add:

* export current state;
* profile recovery;
* backup reload;
* reset;
* repair;
* diagnostics workflow.

That is the next architectural seam.

---

# Read/Hydration Recovery Still Separate

Task 1.30 left storage-accessor failure during store construction exceptional.

Task 1.37 does not address startup/read recovery.

---

# Retry Result State Lifetime

If local retry-result semantic state is added, keep it scoped to the persistent-awareness component/app shell.

Do not persist it.

Do not add it to `DayFrameState`.

Do not confuse it with retained durability truth.

---

# Result-State Clearing

If a local retry-result message exists:

* a new retry action may replace it;
* retained durability convergence may clear it where appropriate;
* navigation should not necessarily erase it if it belongs to the persistent shell.

Choose the simplest behavior consistent with existing component structure.

Do not let stale retry-result text contradict current retained durability.

---

# Preferred Minimal Result-State Design

The preferred implementation may need **no separate retry-result UI state at all**.

Because:

```text
retry method
    ↓
retained durability updated synchronously
    ↓
subscribeDurability()
    ↓
persistent awareness updates
```

the retained surface itself may fully communicate the result.

Use local retry-result state only if necessary to distinguish a same-category attempted failure from no action or to provide essential action confirmation.

Do not add state merely because the result exists.

---

# Same-Category Retry Feedback Determination

A same-category retry:

```text
storageFailure → storageFailure
```

produces no durability subscription event.

The user clicked Retry and the warning remains unchanged.

Determine whether that interaction requires an immediate local statement that retry failed again.

If existing UX conventions make unchanged UI after button click confusing, a minimal local retry-attempt feedback may be warranted.

If added, it must derive from `classifyDurabilityRetryResult()`.

Record the decision explicitly.

---

# No Raw Retry Result Copy

Do not expose:

```text
notAttempted
alreadyDurable
storageFailure
```

literally as user-facing text.

Use semantic meaning.

---

# Production Consumer Audit

After implementation verify that production retry calls exist only in the intended explicit user handlers.

There must be no:

* startup retry;
* effect-triggered retry;
* subscription-triggered retry;
* automatic mutation retry;
* contextual duplicate retry handlers.

---

# Required Tests

Add focused UI/workflow tests.

## Test 1 — Active Storage Failure Shows Retry

Cause active `storageFailure`.

Assert active persistent awareness includes an enabled explicit Retry control.

---

## Test 2 — Active Unavailable Shows Retry

Cause active `unavailable`.

Assert Retry is present.

---

## Test 3 — Active Recovery Required Has No Retry

Cause active `serializationFailure`.

Assert persistent recovery-required awareness exists and active Retry does not.

---

## Test 4 — Profile Storage Failure Shows Retry

Cause profile `storageFailure`.

Assert profile Retry exists.

---

## Test 5 — Profile Unavailable Shows Retry

Assert Retry exists.

---

## Test 6 — Profile Recovery Required Has No Retry

Assert no profile Retry.

---

## Test 7 — Both Surfaces Have Independent Controls

Cause retryable failures for active and profiles.

Assert both Retry controls exist with distinguishable accessible names.

---

## Test 8 — Active Retry Success

Cause active retryable failure.

Restore successful storage.

Activate active Retry.

Assert:

* `retryActivePersistence()` behavior occurs;
* persistent active warning disappears;
* profile state remains unchanged;
* no ordinary runtime workflow is replayed.

---

## Test 9 — Profile Retry Success

Equivalent for profiles.

---

## Test 10 — Cross-Surface Independence

With both surfaces failing, retry active successfully.

Assert:

* active warning disappears;
* profiles warning remains;
* profiles Retry remains;
* profile persistence was not attempted by active Retry.

---

## Test 11 — Partial Clear Profile Retry

Produce partial clear where profile removal failed.

Activate profile Retry.

Assert:

* removal is retried via existing store semantics;
* profiles warning disappears on success;
* no aggregate clear workflow reruns.

This is mandatory.

---

## Test 12 — Partial Clear Active Retry

Test the inverse where active removal failed.

---

## Test 13 — Retry Remains Failed

Cause retryable failure.

Click Retry and inject the same failure again.

Assert:

* exactly one retry attempt occurs;
* warning remains;
* Retry remains available;
* no automatic second attempt occurs.

If local retry-result feedback is implemented, assert its correct semantic classification.

---

## Test 14 — Failure Category Transition

Start with storage failure.

Retry while storage is unavailable.

Assert persistent warning updates to unavailable semantics and Retry remains available.

---

## Test 15 — Retry Produces Recovery Required

Start from an eligible snapshot retry.

Arrange current data to serialize-fail if safely testable.

Activate Retry.

Assert:

* persistent warning becomes recovery-required;
* Retry disappears;
* no further automatic attempt.

If UI-level safe construction is inappropriate, cover through a lower-level injected result seam while preserving shared classifier/store tests.

---

## Test 16 — Already-Durable Race

Render retryable state, then make the surface durable before activation if test timing permits.

Invoke stale Retry callback/control.

Assert benign completion and no error presentation.

If the control naturally disappears before it can be activated due to synchronous React updates, document that the store/classifier lower-level tests already protect the race result and avoid brittle UI simulation.

---

## Test 17 — No Unknown Retry

Initial unknown state produces no warning and no Retry.

---

## Test 18 — No Durable Retry

Durable state produces no warning and no Retry.

---

## Test 19 — Retry Does Not Notify DayFrameState Subscribers

Through UI activation, assert store/runtime state subscribers remain silent for the retry itself.

Avoid conflating React UI rerender with store `DayFrameState` notification.

---

## Test 20 — Retry Uses Store Retry API, Not Workflow Replay

Use spying/call-count or observable behavior to establish that clicking active Retry does not invoke Setup save/manual-event mutation/etc. again.

Equivalent proof for profiles where appropriate.

---

## Test 21 — One Click, One Attempt

Assert one user activation results in exactly one storage write/removal attempt.

---

## Test 22 — No Automatic Retry

After a retryable warning appears, wait/trigger unrelated rerender/navigation.

Assert no retry occurs until user activation.

---

## Test 23 — Retry Controls Survive Navigation

Cause retryable failure.

Navigate elsewhere.

Assert persistent Retry remains available with the warning.

---

## Test 24 — Immediate Feedback Coexists

Cause Setup or manual-event failure.

Assert existing immediate feedback plus persistent Retry-capable warning coexist.

---

## Test 25 — Recovery Awareness Has No Action

For recovery-required warning, assert no Retry and no recovery button/link.

---

## Test 26 — Accessible Surface Identification

When both controls exist, each Retry control must have a distinguishable accessible name indicating active setup versus saved profiles.

---

# Existing Tests to Preserve

Preserve:

* Task 1.31 retry semantics tests;
* Task 1.33 durability subscription tests;
* Task 1.34 classifier tests;
* Task 1.35 immediate feedback tests;
* Task 1.36 persistent-awareness tests.

Task 1.37 should prove production user initiation rather than restate every lower-level branch.

---

# Testing Strategy

Prefer real store retry methods.

Do not mock retry so heavily that tests only prove a button callback fires.

At least active snapshot retry, profile snapshot retry, and partial-clear absence retry should reach the real store durability behavior.

Mock/spies may supplement those tests to establish no workflow replay and exact call counts.

---

# UI Component Scope

Prefer extending Task 1.36's existing persistent awareness surface rather than creating a second retry panel.

The persistent surface should remain the sole cross-navigation durability/retry location.

---

# Styling Scope

Use existing button and warning styles.

No broad redesign.

If minimal layout changes are needed to place Retry controls beside surface entries, keep them narrowly scoped.

---

# Product Copy Scope

Task 1.37 may add concise Retry labels and minimal retry-result wording if required.

Do not revise all Task 1.35/1.36 durability copy.

Record exact strings added or changed.

---

# Expected Files to Change

Likely:

* `code/src/ui/DayFrameApp.tsx`;
* possibly a dedicated Task 1.36 awareness component if already separate;
* `code/src/ui/tests/DayFrameApp.test.tsx`;
* possibly narrow styles if needed.

Task 1.34 classifier should not need semantic changes.

Store implementation should not change.

---

# Reference Validation

After implementation verify:

* active Retry appears only for retryable active semantics;
* profile Retry appears only for retryable profile semantics;
* recovery-required has no Retry;
* unknown/durable have no Retry;
* active Retry calls only `retryActivePersistence()`;
* profile Retry calls only `retryProfilePersistence()`;
* retry results are classified through Task 1.34;
* persistent visibility still follows retained store status;
* successful retry clears only the affected surface;
* failed retry leaves/updates persistent awareness correctly;
* partial-clear retry does not rerun clear;
* no workflow command replay implements retry;
* retry creates no `DayFrameState` notification;
* no automatic retry exists;
* no recovery control exists;
* no desired-condition exposure exists;
* no store/persistence API changed;
* no durable schema/key/version changed.

---

# Explicit Non-Goals

Task 1.37 shall not:

* implement recovery;
* add recovery controls;
* add automatic retry;
* retry both surfaces automatically;
* add aggregate clear retry;
* replay original workflow commands;
* expose desired durable condition;
* inspect localStorage;
* change store retry semantics;
* change retry eligibility;
* change retry result types;
* change durability subscription;
* change retained durability status;
* change `DayFrameState`;
* add retry state to `DayFrameState`;
* change persistence helpers;
* change schemas;
* change storage keys;
* increment versions;
* change validators;
* change normalizers;
* modify migrations;
* remove compatibility readers;
* resolve read/hydration recovery;
* redesign broader DayFrame UI;
* resolve unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.31 — Implement Store-Owned Active and Profile Durability Retry;
* Task 1.32 — Establish Workflow-Level Durability Feedback, Retry Initiation, and Recovery Boundaries;
* Task 1.33 — Add a Store-Level Durability Status Subscription;
* Task 1.34 — Implement Shared Durability Outcome and Retry-Result Semantic Classification;
* Task 1.36 — Add Persistent App-Level Durability Awareness.

Also preserves Task 1.35 immediate workflow semantics.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

---

# Evidence Standards

Retry UI may say:

```text
Retry
```

because the semantic class is already adopted as retryable.

It may not claim:

```text
Retry will fix it
Storage is back
Your data is safe
```

until the returned/store-retained outcome actually establishes that fact.

Likewise:

```text
recoveryRequired
```

means ordinary retry is inappropriate, not that the data is unrecoverable.

---

# ADR Alignment

Task 1.37 should improve:

* explicit user-controlled retryability;
* non-destructive persistence recovery;
* deterministic store ownership;
* cross-navigation durability repair;
* surface-specific recovery readiness;
* session/runtime separation;
* epistemic integrity.

It does not yet implement recovery-required actions.

---

# Validation Requirements

Run focused UI tests covering:

* active Retry visibility;
* profile Retry visibility;
* recovery-required suppression;
* both-surface independent controls;
* active retry success;
* profile retry success;
* partial-clear active/profile retry;
* retry failure persistence;
* failure-category transition;
* no automatic retry;
* no workflow replay;
* no state notification;
* cross-navigation Retry persistence;
* accessibility.

Also run lower-level regression tests:

```text
src/state/durabilitySemantics.test.ts
src/state/tests/dayFrameStore.test.ts
src/ui/tests/DayFrameApp.test.tsx
```

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

for affected scope.

Record:

* focused UI test count;
* semantic/store regression count;
* full test-file count;
* full test count;
* tests added/updated;
* lint result;
* typecheck result;
* build result;
* diff-check result.

Confirm:

* Task 1.37 specification remained immutable;
* result artifact exists separately;
* no recovery action exists;
* no automatic retry exists;
* no store behavior changed;
* no durable format changed.

---

# Documentation Rules

During Task 1.37:

## Create

* `TASK_1.37_ADD_EXPLICIT_USER_TRIGGERED_DURABILITY_RETRY_CONTROLS_RESULT.md`

## Preserve

* Task 1.37 specification;
* Tasks 1.23–1.36 results;
* durable-data ADR;
* architecture/governance documentation;
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

The Task 1.37 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Retry Control Placement
6. Eligibility Semantics
7. Active Retry Integration
8. Profile Retry Integration
9. Surface Independence
10. Retry Result Classification
11. Durable-Success Handling
12. Retryable-Unavailable Handling
13. Retryable-Storage-Failure Handling
14. Recovery-Required Handling
15. Already-Durable Handling
16. Unknown/Internal-No-Op Handling
17. Retry Subscription Interaction
18. Active Snapshot Retry
19. Profile Snapshot Retry
20. Partial-Clear Active Retry
21. Partial-Clear Profile Retry
22. Same-Category Retry Failure
23. Failure-Category Transition
24. Retry-to-Recovery Transition
25. DayFrameState Subscriber Preservation
26. No Workflow Replay
27. No Automatic Retry
28. Immediate Feedback Coexistence
29. Accessibility
30. Product Copy
31. Recovery Deferral
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

Before Task 1.37:

```text
known retryable durability failure
    ↓
persistent awareness exists
    ↓
store retry capability exists
but
user cannot initiate retry
```

After Task 1.37:

```text
known retryable durability failure
    ↓
persistent surface-specific Retry
    ↓
user activates
    ↓
store-owned retry
    ↓
exact retry outcome
    ↓
shared semantic classification
    ↓
retained durability update
    ↓
subscription updates persistent surface
```

For recovery-required state:

```text
recoveryRequired
    ↓
persistent awareness remains
    ↓
no Retry control
```

---

# Expected Follow-Up

If Task 1.37 completes cleanly, the ordinary retry path from persistence failure through user recovery action will be complete.

The next unresolved durability seam will be:

```text
serializationFailure
    ↓
recoveryRequired
    ↓
what can the user actually do?
```

Therefore the next dependency-correct task should be an investigation:

> **Task 1.38 — Establish Serialization-Failure Recovery Semantics and User Recovery Boundaries**

It should determine:

* what can produce serialization failure from valid runtime authored data;
* whether recovery should identify/isolate invalid fields;
* whether export of current runtime state is possible/safe;
* whether the user should be able to edit and retry through ordinary mutation;
* whether reset or checkpoint restoration is ever appropriate;
* what data must be preserved before recovery;
* whether recovery belongs in a dedicated surface;
* how active-state and profile recovery differ.

Do not implement serialization recovery inside Task 1.37.

---

# Completion Criteria

Task 1.37 is complete when:

* persistent active retryable awareness exposes an explicit Retry control;
* persistent profile retryable awareness exposes an explicit Retry control;
* retry controls are surface-specific;
* retry controls appear for `retryableUnavailable`;
* retry controls appear for `retryableStorageFailure`;
* retry controls do not appear for `recoveryRequired`;
* retry controls do not appear for `durableSuccess`;
* retry controls do not appear for `internalNoOp`;
* active Retry invokes only `retryActivePersistence()`;
* profile Retry invokes only `retryProfilePersistence()`;
* exactly one store retry occurs per explicit activation;
* retry results are classified through Task 1.34;
* successful retry is treated as benign completion;
* persistent warning clearing remains driven by retained durability subscription;
* retryable failure remains visible and retryable;
* failure-category transitions update persistent awareness;
* retry-produced serialization failure becomes recovery-required and removes Retry;
* already-durable result is benign;
* unknown result is treated as internal/stale no-op;
* active/profile retries remain independent;
* partial-clear failures can be repaired per surface without rerunning clear;
* retry does not replay original workflow commands;
* retry does not mutate `DayFrameState`;
* retry does not notify ordinary state subscribers;
* no automatic retry occurs;
* no recovery action is introduced;
* no desired condition is exposed;
* no store semantics change;
* no durable schema/key/version changes;
* focused tests protect user-triggered retry behavior;
* full validation passes;
* the result artifact identifies the next dependency-correct seam.

---

# Task Determination

Task 1.37 is a bounded user-triggered durability-retry integration.

It does not implement recovery or alter persistence authority.

Its purpose is to connect retryable persistent durability awareness to DayFrame's existing store-owned retry capability while preserving surface ownership, retained-status authority, runtime-state silence, and explicit user initiation.

**The task is complete when persistent app-level retryable durability awareness exposes explicit surface-specific user-triggered retry controls that invoke the existing store-owned retry APIs, classify exact retry results through the shared semantic layer, rely on retained-durability subscription updates for persistent-state convergence, hide retry for recovery-required/non-actionable states, preserve `DayFrameState` and subscriber semantics, and introduce no automatic retry or recovery behavior.**
