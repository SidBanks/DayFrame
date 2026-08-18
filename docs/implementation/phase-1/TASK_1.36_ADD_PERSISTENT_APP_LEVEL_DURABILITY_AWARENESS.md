# Implementation Task 1.36 — Add Persistent App-Level Durability Awareness

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.36

**Task Name:** Add Persistent App-Level Durability Awareness

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded UI Integration

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.36_ADD_PERSISTENT_APP_LEVEL_DURABILITY_AWARENESS_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* persistent durability surface introduced;
* initial durability read behavior;
* durability subscription integration;
* active-state awareness;
* profile awareness;
* unknown suppression;
* durable suppression;
* retryable failure presentation;
* recovery-required presentation;
* cross-navigation persistence;
* automatic clearing after convergence;
* semantic classifier reuse;
* desired-condition non-exposure;
* immediate workflow feedback coexistence;
* retry-control determination;
* recovery-control determination;
* tests added or updated;
* validation performed and results;
* deviations from authorized scope, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires adding retry execution controls, recovery actions, automatic retry, migration behavior, persistence changes, new store APIs, changes to `DayFrameState`, or broad application-navigation redesign, stop the affected work and record the discrepancy rather than expanding Task 1.36.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Persistent Surface Contract;
* Initialization Semantics;
* Subscription Semantics;
* Active-State Awareness;
* Profile Awareness;
* Unknown/Durable Suppression;
* Cross-Navigation Requirements;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame exposes a persistent app-level durability-awareness surface that initializes from `getDurabilityStatus()`, stays synchronized through `subscribeDurability()`, classifies active/profile durability through the shared semantic layer, suppresses unknown and durable surfaces, persists known actionable failures across workflow navigation, clears automatically after convergence, and introduces no retry execution, recovery action, automatic retry, store-policy change, or durable-format change.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the integrity discrepancy for project review.

---

# Purpose

Make known durability failures persistently discoverable after the initiating workflow ends.

Task 1.35 completed the immediate contextual side of the workflow contract:

```text
store mutation
    ↓
semantic classification
    ↓
workflow-local durability feedback
```

That feedback is intentionally local and may disappear when the user:

* leaves Setup;
* closes an editor;
* navigates to another workflow;
* performs another action elsewhere.

Task 1.32 established that this is insufficient by itself because retained durability remains meaningful after the initiating workflow ends.

Task 1.33 added the reactive boundary needed for persistent awareness:

```text
getDurabilityStatus()
subscribeDurability()
```

Task 1.34 added the shared semantic vocabulary.

Task 1.36 connects those pieces into the first persistent app-level durability surface.

---

# Architectural Context

The relevant architecture is now:

```text
DayFrameStore
    ├── getDurabilityStatus()
    ├── subscribeDurability()
    ├── retryActivePersistence()
    └── retryProfilePersistence()

durabilitySemantics
    └── classify retained status

immediate workflows
    └── operation-local durability feedback
```

Task 1.36 adds:

```text
app-level durability awareness
    ↓
initial retained status
    +
subsequent retained-status changes
```

The persistent surface represents current retained durability truth, not the historical operation that caused it.

---

# Governing Evidence

Task 1.32 adopted:

> Immediate contextual feedback plus persistent app-level, surface-specific durability feedback.

Task 1.32 also established:

> Closing a workflow or navigating must not erase a known durability failure.

Task 1.33 established a dedicated durability subscription that:

* emits only when retained durability changes;
* remains separate from `DayFrameState`;
* emits for retry convergence;
* emits nothing when retained durability remains unchanged.

Task 1.34 established:

```text
unknown
    → internalNoOp

durable
    → durableSuccess

unavailable
    → retryableUnavailable

storageFailure
    → retryableStorageFailure

serializationFailure
    → recoveryRequired
```

Task 1.35 established immediate workflow-local interpretation but deliberately deferred persistent awareness.

---

# Governing Product Principle

The app-level surface must communicate:

> There is a current known durability problem that remains unresolved.

It must not communicate:

> The most recent workflow operation failed.

Those can differ.

Example:

```text
Setup save
    → storageFailure

later another active mutation
    → persisted
```

Immediate Setup feedback may still describe the earlier operation.

Persistent app-level awareness must reflect:

```text
active durability = durable
```

and therefore disappear.

The retained store status is authoritative for persistent awareness.

---

# Objective

Introduce the smallest persistent app-level UI mechanism that:

1. reads initial retained durability from the store;
2. subscribes to subsequent durability changes;
3. keeps active and profile durability separate;
4. classifies each surface using Task 1.34;
5. suppresses `unknown`;
6. suppresses `durableSuccess`;
7. surfaces retryable unavailable;
8. surfaces retryable storage failure;
9. surfaces recovery-required serialization failure;
10. remains visible across workflow navigation;
11. clears automatically when a failed surface becomes durable;
12. reacts to ordinary persistence convergence;
13. reacts to explicit retry convergence even though `DayFrameState` does not change;
14. does not expose desired durable condition;
15. coexists with Task 1.35 immediate feedback;
16. does not yet execute retry or recovery.

---

# Persistent Surface Scope

The persistent awareness surface represents exactly:

```text
active authored-state durability
profile-collection durability
```

No persistent indicator is added for:

* Preview;
* generated schedules;
* backup-file download;
* manual-event entity individually;
* individual profile individually;
* desired durable condition;
* migration state;
* read/hydration state.

---

# Persistent Surface Location

Place the surface at an application level that survives navigation among current DayFrame workflows.

The exact component placement should follow the existing application structure.

Potential examples include:

* directly inside `DayFrameApp`;
* inside a stable shell/header/workflow wrapper already shared across screens.

Do not move navigation or create a new application shell solely for this task.

The surface must remain mounted while the user moves among the current in-app workflows.

---

# Placement Standard

Choose the smallest location satisfying:

```text
visible across relevant workflow navigation
+
does not obscure primary workflow
+
does not require duplicate instances
```

Do not place one copy separately in:

* Setup;
* profiles;
* manual-event editor;
* backup workflow.

That would reproduce the contextual-only model Task 1.32 rejected.

---

# Persistent Awareness State Source

The app-level component must initialize from:

```text
store.getDurabilityStatus()
```

and stay synchronized through:

```text
store.subscribeDurability(...)
```

Do not derive durability from:

* immediate workflow messages;
* `DayFrameState`;
* browser storage;
* desired durable condition;
* last mutation result.

---

# Initial Read Semantics

Because `subscribeDurability()` does not immediately invoke the listener, the consumer must:

1. synchronously read `getDurabilityStatus()`;
2. establish initial component state;
3. subscribe for future changes.

Avoid a visible initial state that falsely assumes:

```text
durable
```

before the initial read.

---

# React Subscription Lifecycle

The persistent component must:

* subscribe exactly once per relevant store instance/lifecycle;
* update local UI state on durability notifications;
* unsubscribe on cleanup;
* avoid duplicate subscriptions across rerenders.

Use normal React lifecycle patterns already present in the repository.

Do not add external state libraries.

---

# Store Replacement / Test Instance Semantics

If `DayFrameApp` accepts an injected store in tests or supported usage, ensure the subscription follows the active store instance.

If the store prop/reference changes:

* cleanup the previous subscription;
* initialize from the new store;
* subscribe to the new store.

Do not assume a permanent singleton if current app architecture supports injection.

---

# Required Surface-Specific Classification

From:

```text
StoreDurabilityStatus
```

classify:

```text
activeState
profiles
```

independently through the Task 1.34 shared classifier.

Do not implement raw switches such as:

```ts
status.activeState === "storageFailure"
```

for semantic presentation when the shared classifier already owns that meaning.

Raw status may be retained only where exact factual detail is explicitly required.

---

# Unknown Suppression

For:

```text
unknown
```

render no persistent warning for that surface.

Task 1.27 established that `unknown` is not a failure.

Task 1.34 classifies it as:

```text
internalNoOp
```

Therefore a newly opened DayFrame session should not immediately display alarming unsaved warnings merely because no persistence fact has yet occurred.

Directly test this.

---

# Durable Suppression

For:

```text
durable
```

render no persistent warning.

Task 1.36 is an **awareness-of-problems** surface, not a permanent positive durability dashboard.

Do not add persistent:

```text
Everything saved
Durable
All good
```

indicators unless current UI already contains a status region requiring replacement.

The preferred result is silence when no known actionable durability issue exists.

---

# Retryable Unavailable Awareness

For:

```text
retryableUnavailable
```

surface a persistent indication equivalent in meaning to:

> This surface is active for the current session but is not currently saved durably because storage is unavailable.

Do not infer why storage is unavailable.

The message must identify the affected surface:

* active setup/schedule data;
* saved profiles.

Exact product wording may remain provisional.

---

# Retryable Storage-Failure Awareness

For:

```text
retryableStorageFailure
```

surface a persistent indication equivalent in meaning to:

> This surface is active for the current session, but its durable save failed.

Do not infer:

* quota;
* permissions;
* disk state;
* browser mode.

The affected surface must remain identifiable.

---

# Recovery-Required Awareness

For:

```text
recoveryRequired
```

surface a persistent indication that:

* current session state remains active;
* durability is unresolved;
* ordinary retry is not the correct next action.

Do not add recovery controls yet.

Do not prescribe a specific recovery action.

This state should be distinguishable from retryable failures.

---

# Active-State Awareness

The active-state surface represents persistence of current authored DayFrame setup/data.

Do not tie it to whichever workflow caused the failure.

A failure originating from:

* Setup save;
* manual-event mutation;
* profile load;
* backup import;
* another authored mutation;

all converge to the same persistent active-state durability surface.

This is intentional.

---

# Profile Awareness

The profiles surface represents the durability of the complete saved-profile collection.

A failure from:

* profile save;
* profile delete;

should appear under the profiles surface.

Do not represent it as an individual profile-level durability status.

The store does not retain per-profile durability.

---

# Both Surfaces Failing

If both surfaces are actionable failures, the persistent surface must preserve both.

Do not collapse them into one generic warning that hides:

```text
active state
profiles
```

Retry and future recovery remain surface-specific.

A shared container with two entries is acceptable.

---

# One Surface Failing

If exactly one surface is non-durable, show only that surface's awareness.

Do not render empty placeholders for the other.

---

# Surface Recovery / Automatic Clearing

When a surface transitions:

```text
retryableUnavailable
    → durable
```

or:

```text
retryableStorageFailure
    → durable
```

or:

```text
recoveryRequired
    → durable
```

the persistent warning for that surface must disappear automatically from the durability subscription update.

Do not require navigation or refresh.

---

# Ordinary Persistence Convergence

Directly support:

```text
active status = storageFailure
    ↓
later ordinary active mutation persists
    ↓
active status = durable
    ↓
persistent active warning disappears
```

Likewise for profiles.

This is a central Task 1.36 behavior.

---

# Retry Convergence

Even though Task 1.36 does not add retry controls, the persistent surface must correctly react if retry is invoked programmatically/test-wise through the existing store API:

```text
storageFailure
    ↓
retryActivePersistence()
    ↓
durable
    ↓
durability subscription fires
    ↓
persistent warning disappears
```

This proves the surface is driven by retained truth rather than ordinary `DayFrameState` rerender behavior.

---

# Retry Failure Category Transition

If:

```text
storageFailure
    ↓ retry
unavailable
```

the persistent surface must update its semantic presentation from:

```text
retryableStorageFailure
```

to:

```text
retryableUnavailable
```

because the latest retained truth changed.

Do not leave stale classification.

---

# Same-Status Persistence Failure

If durability remains:

```text
storageFailure → storageFailure
```

Task 1.33 emits no durability notification.

The persistent surface therefore may not rerender from the durability channel.

That is correct because its retained semantic state did not change.

Do not add polling or force updates for persistence attempts.

Immediate workflow feedback still describes the attempted operation.

---

# Immediate Workflow Feedback Coexistence

Task 1.35 local feedback remains unchanged.

A user may temporarily see:

```text
contextual message about the operation
+
persistent app-level durability warning
```

at the same time.

That is intentional.

The two surfaces answer different questions:

```text
Immediate feedback
    → What happened when I did that?

Persistent awareness
    → Is this durable surface currently unresolved?
```

Do not remove Task 1.35 feedback merely because persistent awareness now exists.

---

# Workflow Navigation

The persistent awareness surface must survive navigation among current in-app workflows.

At minimum test a sequence equivalent to:

```text
cause known durability failure
    ↓
warning visible
    ↓
navigate to another workflow/surface
    ↓
warning still visible
```

Use current navigation structure rather than inventing new routes solely for the test.

---

# Workflow Closure

Closing an editor/panel should not clear the persistent durability warning unless a subsequent persistence event actually changes the retained status.

Local feedback may disappear according to existing conventions.

Persistent awareness follows store durability only.

---

# Persistent Surface Dismissal

Do not add a user-dismiss control in Task 1.36 unless the warning is purely informational and dismissal semantics are already established elsewhere.

A known unresolved durability failure should not become undiscoverable merely because the user dismissed a banner.

Preferred behavior:

```text
warning remains
until retained durability no longer requires attention
```

If current shared message component automatically includes dismissal behavior, determine whether it can be disabled. If not, record the discrepancy rather than silently allowing unresolved durability to disappear.

---

# No Retry Controls Yet

Do not add:

```text
Retry
Try Again
Save Again
```

buttons that call:

```text
retryActivePersistence()
retryProfilePersistence()
```

Task 1.36 is awareness only.

The next task may add retry initiation after the persistent surface and contextual semantics are both stable.

---

# No Recovery Controls Yet

Do not add:

```text
Recover
Export
Repair
Reset
```

actions for `recoveryRequired`.

Task 1.32 separated recovery from ordinary retry.

Recovery implementation remains deferred.

---

# No Automatic Retry

The persistent surface must not retry when:

* mounted;
* status changes;
* navigation occurs;
* browser focus occurs;
* the user clicks the warning itself.

It observes only.

---

# No Desired-Condition Exposure

Do not render:

```text
snapshot
absent
```

or branch on desired durable condition in UI.

Task 1.28 and 1.31 deliberately encapsulated retry routing inside the store.

The persistent surface needs durability semantics only.

---

# No Raw Persistence Outcome Exposure

Do not display raw internal identifiers such as:

```text
storageFailure
serializationFailure
retryableStorageFailure
```

as literal product copy unless current development UI convention explicitly exposes internal state.

Semantic category names are implementation vocabulary, not final user language.

Use minimal human-readable wording.

---

# Product Copy Scope

Task 1.36 may introduce the minimum copy needed to communicate persistent awareness accurately.

The copy should distinguish:

* active state versus profiles;
* retryable unavailable;
* retryable storage failure;
* recovery required.

Do not undertake a broad copy/style pass.

Do not introduce unsupported causal explanations.

Record the exact strings added in the result artifact.

---

# Presentation Scope

Use existing visual language/components where practical.

Do not introduce a major design system.

A simple persistent status/warning region is sufficient if it:

* survives workflow navigation;
* clearly identifies affected surface;
* distinguishes retryable from recovery-required states;
* disappears automatically on convergence.

---

# Accessibility

The persistent surface should be perceivable and understandable through existing accessibility conventions.

At minimum:

* semantic text must not rely on color alone;
* use appropriate existing status/alert semantics if present;
* avoid repeated live announcements on unchanged durability state.

Do not add aggressive `aria-live` behavior that repeatedly announces the same persistent warning on unrelated rerenders.

If an existing alert component has established accessibility behavior, reuse it.

---

# Severity / Tone

Task 1.34 intentionally avoided presentation severity.

Task 1.36 may use existing visual warning/error conventions but must not encode new semantic policy beyond:

```text
retryable durability issue
recovery-required durability issue
```

Recovery-required may warrant stronger visual distinction than retryable failure if current component language supports it.

Do not overstate data loss.

The runtime session remains active.

---

# App-Level State Shape

The persistent surface may retain:

```ts
StoreDurabilityStatus
```

or independently classified surface semantics in component state.

Prefer retaining the factual store snapshot and deriving classification in render/memoized computation, or an equivalently simple approach.

Do not create another authoritative durability store.

---

# Initial State Example

On app creation:

```text
store status:
active = unknown
profiles = unknown

persistent UI:
nothing
```

After profile save succeeds:

```text
profiles = durable

persistent UI:
nothing
```

After later active persistence fails:

```text
active = storageFailure
profiles = durable

persistent UI:
active durability warning only
```

---

# Combined Example

```text
active = unavailable
profiles = serializationFailure
```

Persistent awareness should represent:

```text
Active data
    → retryable storage unavailable

Saved profiles
    → recovery required
```

without collapsing the two into one undifferentiated warning.

---

# No Global Success State

When:

```text
active = durable
profiles = durable
```

render nothing persistent.

Likewise:

```text
active = unknown
profiles = unknown
```

renders nothing.

The app-level surface exists to preserve unresolved known durability conditions.

---

# Mixed Unknown / Failure

Example:

```text
active = unknown
profiles = storageFailure
```

Render only profiles failure.

Do not treat active unknown as another warning.

---

# Mixed Durable / Failure

Example:

```text
active = durable
profiles = unavailable
```

Render only profiles unavailable awareness.

---

# Recovery Required / Later Ordinary Success

A later ordinary persistence operation may replace:

```text
serializationFailure
```

with:

```text
durable
```

if runtime data changed and serialization succeeds.

The persistent recovery-required warning must then disappear automatically.

Do not require an explicit recovery action simply because the earlier state was recovery-required.

The current retained truth wins.

---

# Semantic Classification Use

Use Task 1.34 helpers such as:

```text
classifySurfaceDurabilityStatus(...)
```

or:

```text
classifyStoreDurabilityStatus(...)
```

if implemented.

Do not duplicate semantic maps inside React.

---

# Internal No-Op Handling

If classifier returns:

```text
internalNoOp
```

for retained `unknown`, suppress the surface.

Do not show a debugging warning to the user.

---

# Durable Success Handling

If classifier returns:

```text
durableSuccess
```

suppress the surface.

Persistent app-level awareness is not a success feed.

---

# Retryable Failure Handling

For:

```text
retryableUnavailable
retryableStorageFailure
```

render awareness.

Do not yet render an actionable retry control.

A future task will connect those states to explicit user-triggered retry.

---

# Recovery Required Handling

For:

```text
recoveryRequired
```

render awareness distinct enough that future retry controls are not implied.

Do not render a disabled retry button merely to show that retry is unavailable.

No action is preferable until recovery behavior is defined.

---

# Current Store API Preservation

Do not change:

* `getDurabilityStatus`;
* `subscribeDurability`;
* retry methods;
* mutation methods;
* durability status values;
* desired durable condition.

Task 1.36 is a consumer.

---

# No Store Changes Expected

Store implementation files should not require semantic changes.

If a UI integration bug reveals missing subscription functionality, stop and record it rather than casually changing Task 1.33's established store contract.

Mechanical type imports are acceptable.

---

# Production Consumer Audit

After implementation, confirm:

```text
subscribeDurability
```

has the intended app-level production consumer.

Inventory any other production consumers.

There should not be duplicate subscriptions created independently by immediate workflows.

---

# Subscription Count / Lifecycle Tests

Where practical, test:

* initial subscription;
* cleanup;
* no duplicate listener accumulation across rerenders;
* store replacement if supported.

Do not rely only on visual behavior if listener leakage can be directly established.

---

# Required Behavior Matrix

Implement and test:

| Active Semantic           | Profile Semantic          | Persistent Awareness           |
| ------------------------- | ------------------------- | ------------------------------ |
| internal no-op            | internal no-op            | none                           |
| durable success           | durable success           | none                           |
| retryable unavailable     | durable success           | active only                    |
| retryable storage failure | durable success           | active only                    |
| recovery required         | durable success           | active only                    |
| durable success           | retryable unavailable     | profiles only                  |
| durable success           | retryable storage failure | profiles only                  |
| durable success           | recovery required         | profiles only                  |
| retryable failure         | retryable failure         | both                           |
| retryable failure         | recovery required         | both, independently classified |

---

# Required Tests

Add focused app/UI tests covering all critical paths.

## Test 1 — Initial Unknown Suppression

Create a new store with default retained durability:

```text
unknown / unknown
```

Assert no persistent durability warning renders.

---

## Test 2 — Durable Suppression

Establish:

```text
durable / durable
```

Assert no persistent durability warning renders.

---

## Test 3 — Active Storage Failure Appears

Cause active persistence:

```text
storageFailure
```

Assert:

* persistent active durability awareness appears;
* profiles awareness does not;
* immediate workflow feedback may coexist.

---

## Test 4 — Active Unavailable Is Distinct

Cause:

```text
active = unavailable
```

Assert the persistent semantic presentation differs appropriately from storage failure.

Do not require color-specific assertion if text/semantic structure proves distinction.

---

## Test 5 — Active Recovery Required

Cause:

```text
active = serializationFailure
```

Assert persistent active recovery-required awareness appears and does not imply ordinary retry.

---

## Test 6 — Profiles Storage Failure Appears

Cause failed profile persistence.

Assert profiles awareness appears independently from active.

---

## Test 7 — Profiles Unavailable

Assert distinct profile unavailable awareness.

---

## Test 8 — Profiles Recovery Required

Where safely injectable, assert profile recovery-required persistent awareness.

---

## Test 9 — Both Surfaces Appear Independently

Establish actionable failures on both surfaces.

Assert both are represented and distinguishable.

---

## Test 10 — Cross-Navigation Persistence

Cause active or profile durability failure.

Navigate to another current app workflow.

Assert persistent awareness remains visible.

This is mandatory.

---

## Test 11 — Editor Closure Persistence

Cause a manual-event persistence failure.

Close the editor according to current behavior.

Assert app-level active durability awareness remains.

---

## Test 12 — Ordinary Persistence Clears Warning

Arrange active failure.

Perform a later ordinary active mutation that persists successfully.

Assert persistent active warning disappears automatically.

---

## Test 13 — Profile Ordinary Convergence Clears Warning

Arrange profile failure.

Perform later successful profile persistence.

Assert profile warning disappears automatically.

---

## Test 14 — Programmatic Retry Success Clears Warning

Arrange active or profile failure.

Invoke the existing store retry method from the test, not from UI.

Assert:

* warning disappears reactively;
* no navigation or state mutation is required.

This proves Task 1.33 subscription integration.

---

## Test 15 — Retry Failure Category Transition Updates Warning

Arrange:

```text
storageFailure
```

then programmatically retry to:

```text
unavailable
```

Assert persistent presentation updates to the new semantic class.

---

## Test 16 — Same-Status Failure Does Not Require UI Update

Arrange repeated `storageFailure`.

Assert persistent awareness remains correct.

Do not require artificial rerender-count testing unless useful.

---

## Test 17 — Unknown Is Never Warning

At least one mixed-state case:

```text
active = unknown
profiles = storageFailure
```

must show only profiles.

---

## Test 18 — Durable Is Never Warning

Mixed-state case:

```text
active = durable
profiles = unavailable
```

must show only profiles.

---

## Test 19 — Immediate And Persistent Feedback Coexist

Cause a workflow-local durability failure.

Assert:

* immediate Task 1.35 feedback exists where current workflow renders it;
* persistent app-level awareness also exists;
* they do not overwrite one another.

---

## Test 20 — No Retry Control

For retryable persistent awareness, assert no user-facing retry control exists yet.

Avoid brittle copy checks if semantic role/query suffices.

---

## Test 21 — No Recovery Control

For recovery-required awareness, assert no recovery action exists.

---

## Test 22 — Desired Condition Not Exposed

Ensure UI does not render internal terms:

```text
snapshot
absent
```

Prefer reference/type evidence in addition to rendering tests.

---

## Test 23 — Subscription Cleanup

Unmount the persistent consumer/app.

Trigger a later store durability change if test structure permits.

Assert no stale update/error occurs and listener cleanup is effective.

---

## Test 24 — Store Replacement If Supported

If `DayFrameApp` supports changing the injected store instance, verify old subscription cleanup and new-store initialization/subscription.

If the store cannot change during a mounted app by contract, document why this test is not applicable.

---

# Existing Tests to Preserve

Preserve Task 1.35 workflow tests proving immediate contextual semantics.

Preserve Task 1.33 store tests proving subscription behavior.

Task 1.36 tests should prove production consumption and persistence across navigation rather than duplicate lower-level subscription mechanics.

---

# Testing Strategy

Prefer real store behavior with existing persistence-failure injection seams.

Do not mock:

```text
subscribeDurability
```

so heavily that tests fail to prove real app reactivity.

Use lower-level direct store manipulation only where needed to establish a durability state that is cumbersome to reach through UI.

Programmatic retry in tests is explicitly allowed because Task 1.36 must prove the persistent surface responds to retry-generated subscription changes even though the UI does not yet expose retry controls.

---

# UI Component Strategy

Prefer one small dedicated component if it improves clarity, for example an implementation-equivalent:

```text
DurabilityAwareness
DurabilityStatusNotice
PersistentDurabilityNotice
```

Do not require a dedicated component if `DayFrameApp` can express the behavior cleanly without becoming cluttered.

Avoid mixing durability presentation deeply into navigation components.

---

# Component Props

If a dedicated component is created, prefer props expressed in semantic/factual state rather than the whole store where practical.

For example:

```ts
<DurabilityAwareness status={durabilityStatus} />
```

may be preferable to letting the component execute store mutations.

However, allowing the component to own read/subscription through a store prop may be appropriate if that matches existing architecture.

Do not give it retry callbacks yet.

---

# Accessibility Validation

Verify:

* both surfaces can be distinguished without color;
* retryable versus recovery-required state is communicated textually;
* persistent warnings have appropriate semantics;
* repeated unrelated rerenders do not cause unnecessary live announcements.

Do not introduce a complex accessibility system.

---

# Styling Scope

Use existing classes/component patterns.

Do not perform a broad CSS redesign.

If new CSS is needed, keep it narrowly scoped to the durability-awareness surface.

Record any styling files changed.

---

# Expected Files to Change

Likely:

* `code/src/ui/DayFrameApp.tsx`;
* possibly a new small durability-awareness component;
* relevant CSS/style file if needed;
* `code/src/ui/tests/DayFrameApp.test.tsx`;
* possibly dedicated component test file.

Task 1.34 classifier may be imported but should not need semantic changes.

Store implementation should not change.

---

# Reference Validation

After implementation verify:

* `getDurabilityStatus()` is used by the persistent app-level consumer;
* `subscribeDurability()` has a production consumer;
* subscription cleanup exists;
* retained active/profile statuses are independently classified;
* `unknown` is suppressed;
* `durableSuccess` is suppressed;
* retryable unavailable is surfaced;
* retryable storage failure is surfaced;
* recovery required is surfaced;
* active/profile surfaces are distinguishable;
* warnings survive workflow navigation;
* warnings clear after ordinary convergence;
* warnings clear/update after programmatic retry;
* no desired-condition state enters UI;
* no raw localStorage inspection exists;
* immediate workflow feedback remains;
* no retry control exists;
* no recovery control exists;
* no automatic retry exists;
* no store API changed;
* no durable schema/key/version changed.

---

# Explicit Non-Goals

Task 1.36 shall not:

* add retry buttons;
* invoke retry from UI;
* add recovery controls;
* implement recovery;
* add automatic retry;
* change retry APIs;
* change retry eligibility;
* change durability subscription semantics;
* change persistence outcomes;
* change retained durability status;
* change desired durable condition;
* expose desired condition;
* inspect localStorage;
* alter `DayFrameState`;
* persist UI durability state;
* add migration state;
* change durable schemas;
* change storage keys;
* increment versions;
* change validators;
* change normalizers;
* remove compatibility readers;
* redesign broader DayFrame navigation;
* redesign Planner/Summary architecture;
* resolve read/hydration recovery;
* resolve unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.32 — Establish Workflow-Level Durability Feedback, Retry Initiation, and Recovery Boundaries;
* Task 1.33 — Add a Store-Level Durability Status Subscription;
* Task 1.34 — Implement Shared Durability Outcome and Retry-Result Semantic Classification;
* Task 1.35 — Consume Durability Semantics in Immediate Persisting Workflows.

Also depends upon retry capability from Task 1.31 for reactive convergence testing.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

Dependency chain:

```text
retained durability
    ↓
durability subscription
    ↓
shared semantics
    ↓
immediate workflow consumption
    ↓
Task 1.36 persistent awareness
```

---

# Evidence Standards

Persistent awareness must reflect current retained durability only.

It may say conceptually:

```text
This surface is not durably saved.
```

It may not claim:

```text
Your data is gone.
Your disk is full.
Your browser blocked DayFrame.
```

without evidence.

Likewise `recoveryRequired` means ordinary retry is not currently the correct next action; it does not prove that recovery will fail or data is irretrievable.

---

# ADR Alignment

Task 1.36 should improve:

* persistent failure transparency;
* user-data preservation awareness;
* recovery readiness;
* cross-navigation discoverability;
* separation of runtime and durability truth;
* reactive durability correctness;
* epistemic integrity.

It still does not complete:

* user-triggered retry;
* recovery actions;
* read/hydration recovery;
* migration UX.

---

# Validation Requirements

Run focused app/UI tests covering:

* initial unknown suppression;
* durable suppression;
* active retryable failure;
* profile retryable failure;
* recovery-required failure;
* both surfaces;
* cross-navigation persistence;
* editor closure persistence;
* ordinary convergence;
* retry convergence;
* failure-category transition;
* coexistence with immediate workflow feedback;
* absence of retry/recovery controls;
* subscription cleanup.

Also run relevant lower-level regression tests:

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

* Task 1.36 specification remained immutable;
* result artifact exists separately;
* no retry control exists;
* no recovery control exists;
* store behavior remains unchanged;
* no durable format changed.

---

# Documentation Rules

During Task 1.36:

## Create

* `TASK_1.36_ADD_PERSISTENT_APP_LEVEL_DURABILITY_AWARENESS_RESULT.md`

## Preserve

* Task 1.36 specification;
* Tasks 1.23–1.35 results;
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

The Task 1.36 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Persistent Surface Placement
6. Initial Durability Read
7. Subscription Integration
8. Subscription Lifecycle
9. Semantic Classification Consumption
10. Unknown Suppression
11. Durable Suppression
12. Active Retryable-Unavailable Awareness
13. Active Storage-Failure Awareness
14. Active Recovery-Required Awareness
15. Profile Retryable-Unavailable Awareness
16. Profile Storage-Failure Awareness
17. Profile Recovery-Required Awareness
18. Both-Surface Awareness
19. Cross-Navigation Persistence
20. Editor/Workflow Closure Persistence
21. Ordinary Convergence Clearing
22. Retry Convergence Clearing
23. Retry Failure-Category Transition
24. Immediate Feedback Coexistence
25. Product Copy
26. Accessibility
27. Retry-Control Deferral
28. Recovery-Control Deferral
29. Desired-Condition Separation
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

Before Task 1.36:

```text
known durability failure
    ↓
immediate workflow message
    ↓
user navigates away
    ↓
retained failure still exists
but
user may no longer see it
```

After Task 1.36:

```text
known durability failure
    ↓
workflow-local feedback
    +
persistent app-level awareness
    ↓
user navigates
    ↓
persistent awareness remains
    ↓
surface later becomes durable
    ↓
durability subscription updates
    ↓
persistent awareness disappears
```

The persistent surface follows current retained truth rather than historical workflow events.

---

# Expected Follow-Up

If Task 1.36 completes cleanly, DayFrame will have:

```text
immediate contextual durability feedback
+
persistent reactive durability awareness
+
store-owned explicit retry capability
```

The next dependency-correct task should connect user action to retry.

A likely next task is:

> **Task 1.37 — Add Explicit User-Triggered Durability Retry Controls**

That task should:

* show retry only for retryable semantic categories;
* keep recovery-required state non-retryable;
* invoke `retryActivePersistence()` or `retryProfilePersistence()` according to the affected surface;
* classify the returned `DurabilityRetryResult` through Task 1.34;
* rely on the durability subscription to update persistent awareness;
* avoid automatic retry;
* preserve state-subscriber silence;
* handle `alreadyDurable` as benign success;
* treat `unknown` as stale/no-op rather than a user failure.

Recovery actions should remain separately staged.

Do not implement retry controls as part of Task 1.36.

---

# Completion Criteria

Task 1.36 is complete when:

* a persistent app-level durability-awareness surface exists;
* it survives current workflow navigation;
* it initializes from `getDurabilityStatus()`;
* it updates through `subscribeDurability()`;
* subscription cleanup is correct;
* active and profile surfaces are classified independently through Task 1.34;
* `unknown` produces no warning;
* `durableSuccess` produces no warning;
* retryable unavailable produces persistent awareness;
* retryable storage failure produces persistent awareness;
* recovery required produces persistent awareness;
* both failing surfaces remain separately identifiable;
* immediate Task 1.35 workflow feedback remains intact;
* persistent awareness does not depend on local workflow state;
* ordinary successful persistence clears the appropriate warning automatically;
* successful programmatic retry clears the appropriate warning automatically;
* changed retry failure category updates persistent awareness;
* no desired durable condition is exposed;
* no retry control is added;
* no recovery control is added;
* no automatic retry is introduced;
* no store semantics change;
* no durable schema/key/version changes;
* focused tests directly protect cross-navigation and reactive behavior;
* full validation passes;
* the result artifact identifies the next dependency-correct seam.

---

# Task Determination

Task 1.36 is a bounded persistent-durability-awareness UI integration.

It does not implement retry initiation or recovery.

Its purpose is to make retained durability failures continuously discoverable after immediate workflow feedback disappears, using the reactive store boundary and shared semantic classification already established.

The persistent surface represents current durability truth rather than the historical operation that caused it.

**The task is complete when DayFrame exposes a persistent app-level durability-awareness surface that initializes from `getDurabilityStatus()`, stays synchronized through `subscribeDurability()`, classifies active/profile durability through the shared semantic layer, suppresses unknown and durable surfaces, persists known actionable failures across workflow navigation, clears automatically after convergence, and introduces no retry execution, recovery action, automatic retry, store-policy change, or durable-format change.**
