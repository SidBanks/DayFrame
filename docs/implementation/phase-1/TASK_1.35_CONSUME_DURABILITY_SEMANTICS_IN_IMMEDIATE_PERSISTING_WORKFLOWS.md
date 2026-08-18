# Implementation Task 1.35 — Consume Durability Semantics in Immediate Persisting Workflows

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.35

**Task Name:** Consume Durability Semantics in Immediate Persisting Workflows

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.35_CONSUME_DURABILITY_SEMANTICS_IN_IMMEDIATE_PERSISTING_WORKFLOWS_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* persisting workflow callers updated;
* workflow durability state introduced or reused;
* Setup integration;
* manual-event integration;
* profile save integration;
* profile delete integration;
* profile load integration;
* backup-import integration;
* clear integration;
* semantic classifier consumption;
* durable-success handling;
* retryable-failure handling;
* recovery-required handling;
* navigation/closure preservation;
* UI-copy determination;
* retry-control determination;
* persistent durability-surface deferral;
* tests added or updated;
* validation performed and results;
* deviations from authorized scope, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires adding a persistent app-level durability surface, a global banner, a durability subscription consumer, retry controls, automatic retry, recovery UI, final product-copy redesign, new store APIs, or changes to persistence semantics, stop the affected work and record the discrepancy rather than expanding Task 1.35.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Workflow Inventory;
* Semantic Consumption Contract;
* Setup Integration;
* Manual-Event Integration;
* Profile Integration;
* Backup Import Integration;
* Clear Integration;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when every current immediate persisting workflow consumes the shared durability semantic classifier, distinguishes durable success from retryable and recovery-required durability failure in its workflow state, preserves session-first runtime behavior and existing navigation/closure semantics unless evidence requires otherwise, stops internally treating failed persistence as durable success, and introduces no persistent global durability UI, retry controls, automatic retry, or recovery behavior.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the artifact-integrity discrepancy for project review.

---

# Purpose

Connect DayFrame's shared durability semantics to the current immediate persisting workflows.

Task 1.34 introduced a pure shared classifier that translates factual persistence and retry outcomes into workflow semantics:

```text
durableSuccess
retryableUnavailable
retryableStorageFailure
recoveryRequired
internalNoOp
```

Clear additionally preserves:

```text
durableSuccess
partialDurabilityFailure
durabilityFailure
```

plus independent active/profile surface classifications.

No production workflow currently consumes that semantic layer.

Task 1.35 is the first workflow integration task.

Its purpose is to ensure current persisting workflows no longer internally treat:

```text
runtime mutation succeeded
```

as equivalent to:

```text
durable persistence succeeded
```

when the store has already reported otherwise.

---

# Architectural Context

The current architecture is:

```text
Persistence helpers
    ↓
factual outcomes

DayFrameStore
    ↓
runtime state
mutation results
retained durability
desired durable condition
retry

durabilitySemantics
    ↓
shared workflow meaning

Workflow / UI
    ↓
not yet consuming that meaning
```

Task 1.35 changes only the last boundary:

```text
workflow receives result
    ↓
classifies result
    ↓
retains immediate workflow semantic state
```

It does not yet introduce persistent cross-workflow durability presentation.

---

# Governing Evidence

Task 1.32 established:

> Immediate operation feedback should be contextual and workflow-specific.

Task 1.32 also established:

> Closing or leaving the initiating workflow must not erase the underlying retained durability failure.

That second responsibility is owned by the later persistent app-level durability surface and Task 1.33's subscription.

Task 1.35 handles only the **immediate contextual half**.

Task 1.34 established one shared semantic classifier so workflows do not each reinterpret:

```text
persisted
unavailable
storageFailure
serializationFailure
removed
retry-result branches
```

independently.

---

# Governing Workflow Principle

For every persisting workflow:

```text
runtime/domain result
```

and:

```text
durability result
```

must remain distinct.

A workflow may succeed in the current session while durability fails.

Conceptually:

```text
runtime success + durable success
    → ordinary durable completion

runtime success + retryable durability failure
    → session change applied, durability needs attention

runtime success + recovery-required durability failure
    → session change applied, ordinary retry is insufficient
```

Task 1.35 must make this distinction executable at the workflow layer.

---

# Objective

Update every current production workflow that initiates persistence so that it:

1. consumes the exact store result already returned;
2. classifies that result through the Task 1.34 semantic layer;
3. retains enough immediate workflow state to distinguish durable success;
4. distinguishes retryable unavailable;
5. distinguishes retryable storage failure;
6. distinguishes recovery-required serialization failure;
7. handles clear's aggregate and per-surface semantics;
8. preserves the runtime transition;
9. preserves current session-first behavior;
10. does not reimplement raw persistence switches;
11. does not inspect `localStorage`;
12. does not invoke retry automatically;
13. does not yet create persistent global durability UI.

---

# Workflow Inventory Requirement

Before changing code, perform a production caller audit.

At minimum identify all current callers of:

* `commitAuthoredSetup`;
* authored setters used directly by UI workflows;
* `setManualEvents`;
* `saveProfile`;
* `deleteProfile`;
* `loadProfile`;
* `importBackup`;
* `clearLocalData`.

Also inspect production callers of any store method returning:

```text
StoreMutationResult
ClearLocalDataResult
```

Do not assume only `DayFrameApp.tsx` is relevant.

Record the final caller inventory.

---

# Workflow State Principle

Task 1.35 may introduce or refine **workflow-local durability semantic state**.

Examples of acceptable conceptual state:

```ts
type WorkflowDurabilityState =
  | null
  | "durableSuccess"
  | "retryableUnavailable"
  | "retryableStorageFailure"
  | "recoveryRequired";
```

or a repository-equivalent discriminated representation.

However, do not create one universal UI state object if existing workflows already use separate localized status state.

Prefer the smallest change consistent with current component structure.

---

# Shared Semantic Source

All classifications must flow through Task 1.34.

For ordinary write mutations:

```text
classifyStoreMutationResult(result)
```

or:

```text
classifyPersistenceWriteOutcome(result.persistence)
```

For clear:

```text
classifyClearLocalDataResult(result)
```

Do not duplicate raw switches such as:

```ts
if (result.persistence.status === "storageFailure") ...
```

in every workflow unless a narrow operation-specific distinction still requires access to the factual result.

The shared classifier owns semantic interpretation.

---

# Factual Result Preservation

Workflows may still retain the original result where operation-specific detail is needed.

Semantic classification does not replace factual data.

For example, clear may need:

```text
aggregate semantic
+
active semantic
+
profiles semantic
```

from the classifier.

Do not throw away exact clear surface distinctions.

---

# Immediate Semantic Categories In Scope

The workflow layer must understand at minimum:

```text
durableSuccess
retryableUnavailable
retryableStorageFailure
recoveryRequired
```

`internalNoOp` should generally not arise from ordinary persisting mutations.

If it appears only in retry classification, do not invent immediate mutation behavior for it.

---

# Durable Success Semantics

For an ordinary persisting workflow:

```text
durableSuccess
```

means:

> The requested runtime transition is applied and the relevant durable condition was successfully established.

The workflow may retain or produce its existing success state.

Do not broaden success semantics beyond the operation.

---

# Retryable Unavailable Semantics

For:

```text
retryableUnavailable
```

the workflow must internally distinguish:

```text
runtime change applied
durability not established
storage unavailable
ordinary retry is appropriate later
```

Task 1.35 does not yet need to expose a retry button.

Do not silently convert this to ordinary durable success.

---

# Retryable Storage-Failure Semantics

For:

```text
retryableStorageFailure
```

the workflow must internally distinguish:

```text
runtime change applied
durable storage attempt failed
ordinary retry is appropriate later
```

No cause beyond `storageFailure` is known.

Do not inspect exception messages or browser details.

---

# Recovery-Required Semantics

For:

```text
recoveryRequired
```

the workflow must distinguish:

```text
runtime change applied
durability not established
ordinary retry is not the correct next action
```

Task 1.35 must not implement recovery.

It may retain a semantic state that a later UI task can present appropriately.

---

# Existing Success-State Audit

Inspect current UI/workflow state such as:

```text
setupSaved
saved profile
deleted profile
import success
clear success
manual event saved
```

or repository-equivalent state/messages.

Determine which states currently imply durable success even when persistence failure is known.

Task 1.35 should stop that internal semantic conflation.

Do not assume every existing success string must be changed in this task; determine whether the current structure couples semantic state and visible copy.

---

# Product-Copy Decision Boundary

If existing workflow code stores final user-visible strings directly rather than semantic state, Task 1.35 may need the smallest wording adjustment necessary to avoid a factual falsehood.

For example, a workflow must not render a message equivalent to:

```text
Saved successfully
```

after known `storageFailure`.

However, do not conduct a broad copywriting pass.

Preferred order:

```text
semantic workflow state first
existing rendering adapted minimally if required for correctness
```

The result artifact must state whether visible copy changed and why.

---

# No Final Copy Redesign

Do not attempt to finalize product language across DayFrame.

Task 1.35 may use existing wording where accurate or minimal provisional wording where necessary to prevent false durable-success claims.

A later presentation task can refine consistency and tone.

---

# Setup Integration

Audit the current Setup save handler.

When:

```text
commitAuthoredSetup(...)
```

returns, classify the result.

Required semantic branches:

```text
durableSuccess
retryableUnavailable
retryableStorageFailure
recoveryRequired
```

The Setup runtime state remains applied in all branches because the store already applied the valid runtime transition.

---

# Setup Durable Success

For:

```text
durableSuccess
```

preserve the current normal success behavior unless it depends on wording that is now known to be inaccurate.

Existing Save Setup completion may remain.

---

# Setup Retryable Failure

For:

```text
retryableUnavailable
retryableStorageFailure
```

the workflow must retain an immediate semantic state indicating:

* Setup is applied in the session;
* durability failed;
* ordinary retry is appropriate.

Do not call retry automatically.

---

# Setup Recovery Required

For:

```text
recoveryRequired
```

retain an immediate workflow semantic indicating that the Setup is applied in the session but could not be durably serialized and ordinary retry is not appropriate.

Do not implement repair or recovery.

---

# Setup Navigation / Closure

Task 1.32 recommended preserving session-first usability rather than treating durability failure as domain failure.

Therefore Task 1.35 should preserve current Setup navigation/closure behavior unless executable structure proves that closing the workflow would make immediate feedback impossible to surface at all.

If a behavior change is required solely to make immediate semantic state visible, stop and record the discrepancy rather than silently redesign navigation.

Persistent discoverability is handled later.

---

# Manual-Event Integration

Audit create/edit/delete manual-event workflows.

When:

```text
setManualEvents(...)
```

returns, classify the result.

The manual-event runtime change remains applied regardless of durability failure.

Required distinctions:

```text
durableSuccess
retryableUnavailable
retryableStorageFailure
recoveryRequired
```

---

# Manual-Event Editor Closure

Do not automatically keep the editor open merely because persistence failed.

The session-first contract means the event exists in runtime state.

Preserve current editor closure unless evidence shows the workflow currently depends on a durability-success assumption for closure.

Immediate durability state may be surfaced around the workflow independently.

---

# Manual-Event Preview Behavior

Do not change:

* Preview staleness;
* Preview regeneration;
* schedule placement;
* event runtime appearance.

Task 1.35 is durability semantics only.

---

# Profile Save Integration

When:

```text
saveProfile(...)
```

returns, classify the result.

A profile may exist in runtime state while profile persistence fails.

Therefore:

```text
runtime profile exists
```

must not automatically mean:

```text
profile durably saved
```

in workflow semantics.

---

# Profile Save Durable Success

Preserve existing success behavior when classification is:

```text
durableSuccess
```

---

# Profile Save Retryable Failure

For retryable failure:

```text
profile runtime state exists
profile durable collection is not confirmed
```

The workflow must retain that distinction.

Do not roll back the profile from runtime.

Do not call retry.

---

# Profile Save Recovery Required

For serialization failure, retain recovery-required semantics.

Do not delete or undo the runtime profile.

---

# Profile Delete Integration

When:

```text
deleteProfile(...)
```

returns, classify the result.

A failed durable delete means:

```text
runtime profile removed
durable profile collection may still contain it
```

The workflow must not semantically describe that as fully deleted durably.

---

# Profile Delete Retryable Failure

Retain immediate semantics indicating:

* runtime deletion succeeded;
* durable deletion did not;
* retry is appropriate.

Do not restore the profile in runtime.

---

# Profile Load Integration

`loadProfile(...)` applies profile data to active runtime state, then persists active authored state.

Classify the active persistence result.

Required interpretation:

```text
runtime profile load succeeded
+
active durability classification
```

Do not reinterpret the source profile's durability.

---

# Profile Load Retryable Failure

For:

```text
retryableUnavailable
retryableStorageFailure
```

the profile is loaded for the current session.

The source profile remains available.

The active state is not durably established.

Workflow state must preserve those distinctions.

---

# Profile Load Recovery Required

For serialization failure:

* loaded runtime state remains current session truth;
* ordinary retry is blocked;
* source profile remains a recovery checkpoint;
* no recovery action is implemented.

---

# Backup Import Integration

`importBackup(...)` validates and applies backup data to runtime, then persists active state.

Classify the returned mutation result.

Required conceptual distinction:

```text
backup accepted/applied to current session
```

versus:

```text
imported state durably saved
```

Those are not identical when persistence fails.

---

# Backup Import Durable Success

Only `durableSuccess` justifies full durable-import completion semantics.

---

# Backup Import Retryable Failure

Retain immediate state indicating:

* backup was valid;
* runtime import applied;
* active durability failed;
* ordinary retry is appropriate.

The external backup remains available.

---

# Backup Import Recovery Required

For serialization failure after runtime import:

* runtime import remains applied;
* external backup remains recovery source;
* ordinary retry is not appropriate;
* no recovery implementation is added.

---

# Clear Integration

`clearLocalData()` returns:

```text
state
activeState
profiles
durability
```

Task 1.34 now provides:

```text
aggregate semantic
active semantic
profiles semantic
```

Task 1.35 must consume that structured classification.

---

# Clear Fully Durable

For:

```text
aggregate = durableSuccess
```

preserve ordinary clear-complete workflow semantics.

Runtime is reset and both durable removals succeeded.

---

# Clear Partial Durability Failure

For:

```text
aggregate = partialDurabilityFailure
```

the workflow must retain:

* runtime clear succeeded;
* durable clear is incomplete;
* which surface remains unresolved;
* whether that surface is unavailable or storage failure.

Do not reduce this to generic success.

Do not discard per-surface semantic detail.

---

# Clear Durability Failure

For:

```text
aggregate = durabilityFailure
```

runtime still resets for the session.

The workflow must distinguish that both durable surfaces remain unresolved.

Do not call this a runtime clear failure.

---

# Clear Retryability

Task 1.31 already supports surface-specific absence retry.

Task 1.35 must not invoke it yet.

It should retain enough classified information for a later workflow/UI task to know which surface is retryable.

---

# Clear Recovery Required

Removal operations cannot produce serialization failure.

Therefore current clear surface failures are retryable unavailable/storage failures only.

Do not invent recovery-required clear semantics without new factual outcomes.

---

# Workflow Semantic State Lifetime

Immediate workflow semantic state may be local to the initiating workflow/component.

It does not need to survive application navigation.

Task 1.32 assigned cross-navigation persistence to the future app-level durability surface using:

```text
getDurabilityStatus()
subscribeDurability()
```

Do not turn local workflow state into a global durability store.

---

# Clearing Immediate Feedback

A new user action within the same workflow may clear or replace prior immediate semantic state where current component conventions support that behavior.

Do not use workflow-local state as authoritative retained durability truth.

Retained store durability remains authoritative after the operation.

---

# Semantic State Versus Retained Status

Keep the distinction explicit:

```text
workflow semantic state
    = interpretation of this operation

retained store durability
    = current surface durability after any later operations
```

A later unrelated successful mutation may make the surface durable even while stale workflow-local failure state still exists.

Task 1.35 should avoid creating long-lived local state that claims global truth.

If current component structure risks that, document it for the persistent-surface task.

---

# No Durability Subscription Consumption Yet

Task 1.33 added:

```text
subscribeDurability()
```

Task 1.35 does **not** need to consume it.

Immediate workflows already receive their exact mutation result synchronously.

Do not subscribe merely to reconstruct an operation result the workflow already has.

---

# No Retry Control Yet

Do not add buttons or actions that call:

```text
retryActivePersistence()
retryProfilePersistence()
```

Task 1.32 established retry placement conceptually, but retry UI belongs after immediate workflow semantics and persistent durability presentation are coherent.

---

# No Automatic Retry

Do not retry after classifying:

```text
retryableUnavailable
retryableStorageFailure
```

Classification is not execution.

---

# No Recovery UI

Do not add recovery affordances for:

```text
recoveryRequired
```

Task 1.35 should only retain the semantic fact.

---

# No Desired-Condition Exposure

Workflow/UI must not branch directly on:

```text
snapshot
absent
```

The store owns retry routing.

Task 1.35 should not import `StoreDesiredDurableCondition` unless existing test infrastructure unexpectedly requires it.

---

# Shared Semantic Module Must Remain Authoritative

Do not create component-local mappings that duplicate Task 1.34.

If operation-specific presentation later needs different language, that language should layer on top of the shared semantic category.

---

# Required Workflow Matrix

Implement and verify behavior equivalent to:

| Workflow       | Result Source          | Semantic Classifier              | Durable Success           | Retryable Failure                              | Recovery Required                                         |
| -------------- | ---------------------- | -------------------------------- | ------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| Setup save     | `StoreMutationResult`  | shared mutation/write classifier | normal completion         | applied for session; non-durable               | applied for session; recovery semantic                    |
| Manual event   | `StoreMutationResult`  | shared mutation/write classifier | normal completion         | event remains runtime; non-durable             | event remains runtime; recovery semantic                  |
| Profile save   | `StoreMutationResult`  | shared mutation/write classifier | saved durably             | runtime profile exists; non-durable            | runtime profile exists; recovery semantic                 |
| Profile delete | `StoreMutationResult`  | shared mutation/write classifier | deleted durably           | runtime removed; durable collection unresolved | runtime removed; recovery semantic if factual path allows |
| Profile load   | `StoreMutationResult`  | shared mutation/write classifier | loaded + active durable   | loaded for session; active non-durable         | loaded for session; recovery semantic                     |
| Backup import  | `StoreMutationResult`  | shared mutation/write classifier | imported + active durable | imported for session; active non-durable       | imported for session; recovery semantic                   |
| Clear          | `ClearLocalDataResult` | shared clear classifier          | full durable clear        | partial/total durable failure retained         | N/A under current removal outcomes                        |

Note: profile deletion uses profile collection serialization and therefore may produce `serializationFailure`; preserve factual behavior if current helper allows it.

---

# Required Production Caller Audit

The result must list every production persisting caller found and classify it as:

* updated in Task 1.35;
* already correctly consumes durability semantics;
* non-user-facing and intentionally unchanged;
* out of scope with explicit reason.

Do not leave unclassified persisting callers.

---

# Required Tests

Add or update focused UI/workflow tests.

At minimum cover the following.

## Test 1 — Setup Durable Success

A successful Setup commit retains the existing normal success semantics.

---

## Test 2 — Setup Retryable Storage Failure

Inject:

```text
storageFailure
```

Assert:

* runtime Setup changes are applied;
* shared semantic classifier result is reflected in workflow state;
* workflow does not internally report durable success;
* current navigation/closure behavior remains as authorized.

---

## Test 3 — Setup Unavailable

Assert distinct:

```text
retryableUnavailable
```

rather than generic storage failure.

---

## Test 4 — Setup Serialization Failure

Assert:

```text
recoveryRequired
```

with runtime state still applied.

No retry is invoked.

---

## Test 5 — Manual-Event Retryable Failure

Save/edit/delete a manual event with failed persistence.

Assert:

* runtime event change remains;
* workflow semantic state indicates retryable failure;
* no automatic retry;
* existing editor behavior remains.

---

## Test 6 — Manual-Event Recovery Required

Where safely injectable, establish serialization failure and recovery-required semantic.

Do not corrupt production fixture types merely for the test.

---

## Test 7 — Profile Save Durable Success

Preserve current normal profile success.

---

## Test 8 — Profile Save Retryable Failure

Assert runtime profile remains and workflow does not classify it as durably saved.

---

## Test 9 — Profile Delete Retryable Failure

Assert runtime deletion remains while durability semantic indicates retryable failure.

---

## Test 10 — Profile Load Retryable Failure

Assert loaded runtime authored state remains active while immediate workflow semantic records active durability failure.

---

## Test 11 — Backup Import Retryable Failure

Assert valid backup remains applied in runtime while workflow semantic records non-durable active state.

---

## Test 12 — Clear Fully Durable

Assert existing successful clear semantics when classifier aggregate is:

```text
durableSuccess
```

---

## Test 13 — Clear Partial Failure

Assert:

* runtime cleared;
* aggregate semantic is `partialDurabilityFailure`;
* unresolved surface remains identifiable;
* workflow does not report full durable clear success.

---

## Test 14 — Clear Total Durability Failure

Assert:

* runtime cleared;
* aggregate semantic is `durabilityFailure`;
* both surface classifications remain available;
* no rollback.

---

## Test 15 — Shared Classifier Is Used

Use import/reference inspection or behavior-oriented evidence sufficient to prove workflows consume Task 1.34 rather than reimplementing raw semantic switches independently.

Avoid brittle source-string tests if TypeScript/module structure provides stronger evidence.

---

## Test 16 — No Retry Invoked

For a retryable workflow failure, assert:

```text
retryActivePersistence
retryProfilePersistence
```

are not called automatically.

Where store methods are not mocked directly, establish equivalent behavior through storage attempt count.

---

## Test 17 — No Durability Subscription Required

Immediate workflow operation should update semantic state from the returned result without requiring a durability-subscription event.

Do not add unnecessary subscription expectations.

---

## Test 18 — Runtime/Workflow Separation

At least one test should explicitly prove:

```text
runtime/domain change succeeded
+
workflow durability semantic = failure
```

simultaneously.

This is a core Task 1.35 invariant.

---

# Existing Tests to Preserve

Preserve Task 1.31–1.34 coverage for:

* store mutation result accuracy;
* retry behavior;
* retained status;
* durability subscription;
* semantic classifier mappings.

Task 1.35 should not duplicate those lower-level contracts unnecessarily.

Its tests should focus on workflow consumption.

---

# Test Fixture Strategy

Prefer injecting persistence failures through the existing localStorage test seams already established in Tasks 1.23–1.30.

Do not mock the semantic classifier to return arbitrary values if using real store outcomes provides stronger end-to-end workflow evidence.

Classifier-specific mapping remains covered by Task 1.34.

---

# Component State Design

If one or more current workflows store plain success strings rather than semantic state, choose the smallest coherent representation.

Possible approaches:

```ts
type ImmediateDurabilityFeedback = DurabilitySemanticCategory | null;
```

or operation-specific structures such as:

```ts
type ClearFeedback = ClearDurabilitySemanticClassification | null;
```

Do not create a large generalized workflow-state framework solely for this task.

---

# Semantic State Naming

Prefer names that make the scope explicit, such as:

```text
setupDurabilityFeedback
profileDurabilityFeedback
clearDurabilityFeedback
```

or repository-equivalent.

Avoid vague names like:

```text
status
message
error
```

if those names already mix domain validation and durability semantics.

---

# Domain Validation Separation

Do not conflate persistence durability failures with existing validation failures.

Examples:

```text
invalid profile name
invalid backup JSON
invalid authored form state
```

remain domain/input failures.

Durability semantics apply only after the store accepts and applies the runtime operation and attempts persistence.

---

# Backup Validation Separation

If backup parsing/validation fails before import:

```text
not a durability semantic
```

Task 1.35 should preserve existing invalid-backup behavior separately.

Only valid backup import followed by active persistence outcome uses durability classification.

---

# Profile Lookup Failure Separation

If profile load fails because the profile does not exist:

```text
not a durability semantic
```

Do not classify it as `storageFailure`.

Retain existing domain/workflow handling.

---

# Success Copy Integrity

If current UI visibly says some equivalent of:

```text
Saved
Deleted
Imported
Cleared
```

after a semantic failure, Task 1.35 is authorized to make the **minimum** rendering adjustment necessary to stop asserting a known false durable success.

However:

* do not undertake holistic copy refinement;
* do not design persistent banners;
* do not add retry buttons;
* do not add recovery instructions.

Record every visible wording change.

---

# Preferred UI Change Boundary

If current architecture already supports rendering a local status message from workflow state, Task 1.35 may render semantic distinctions there.

If introducing any visible semantic feedback requires substantial new component structure, stop at workflow state and defer presentation to the next task.

Do not build new visual infrastructure accidentally.

---

# Current Navigation Preservation

Do not alter:

* Planner navigation;
* Summary navigation;
* Setup workflow location;
* profile workflow location;
* backup workflow location;
* manual-event panel mechanics;

unless a direct existing durability-success assumption makes the current control flow factually incorrect.

If such an issue appears, record it as a discovery and defer unless explicitly required for correctness.

---

# No Persistent Global Durability Surface

Task 1.32 requires one eventually.

Task 1.33 provides the reactive boundary.

Task 1.35 does not implement it.

Do not add:

* app-level banner;
* header status;
* global warning card;
* notification center;
* persistent retry affordance.

---

# No Retry Initiation Yet

Even if immediate workflow state knows:

```text
retryableUnavailable
retryableStorageFailure
```

Task 1.35 must not render or invoke retry controls unless current component structure already contains a dormant retry control explicitly waiting for the new result—which current evidence does not establish.

If such a caller exists, stop and record the discrepancy before broadening scope.

---

# No Recovery Initiation Yet

For:

```text
recoveryRequired
```

retain semantic state only.

Do not add:

* recovery link;
* export command;
* reset command;
* repair flow.

---

# Reference Validation

After implementation verify:

* all production persisting workflows are inventoried;
* each in-scope workflow consumes the shared semantic classifier;
* no workflow duplicates raw outcome-to-semantic mapping;
* runtime success remains independent from durability semantic;
* durable-success paths remain functional;
* retryable unavailable remains distinct from storage failure;
* serialization failure remains recovery-required;
* clear preserves aggregate and per-surface classification;
* domain/input failures remain separate;
* no automatic retry exists;
* no retry control was added;
* no recovery control was added;
* no durability subscription consumer was added;
* no persistent global durability UI exists;
* store APIs remain unchanged;
* semantic classifier remains pure;
* persistence/retry/subscription semantics remain unchanged;
* no durable format/key/version changed.

---

# Expected Files to Change

Likely:

* `code/src/ui/DayFrameApp.tsx`;
* `code/src/ui/tests/DayFrameApp.test.tsx`;
* possibly workflow-specific UI components/tests that directly own manual-event/profile/backup/clear state.

Task 1.34 semantic module should generally not change unless implementation uncovers a missing classification contract.

Store files should not change.

No persistence-helper file is expected to change.

---

# Explicit Non-Goals

Task 1.35 shall not:

* add a persistent app-level durability surface;
* consume `subscribeDurability`;
* add global durability UI;
* add retry buttons;
* call retry automatically;
* add recovery UI;
* implement serialization recovery;
* change retry APIs;
* change retry eligibility;
* change persistence outcomes;
* change store mutation results;
* change retained durability;
* change desired durable condition;
* change durability subscription;
* inspect `localStorage`;
* change `DayFrameState`;
* add durable semantic state to `DayFrameState`;
* persist workflow semantic state;
* change schemas;
* change storage keys;
* increment versions;
* change validators;
* change normalizers;
* modify migrations;
* remove compatibility readers;
* redesign broader DayFrame UX;
* resolve unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.32 — Establish Workflow-Level Durability Feedback, Retry Initiation, and Recovery Boundaries;
* Task 1.34 — Implement Shared Durability Outcome and Retry-Result Semantic Classification.

Also relies on:

* Task 1.26 mutation results;
* Task 1.31 retry/store semantics;
* Task 1.33 durability subscription.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

Dependency chain:

```text
store facts
    ↓
shared semantic classifier
    ↓
Task 1.35 immediate workflow consumption
    ↓
later persistent durability presentation
```

---

# Evidence Standards

Workflow semantic state may say:

```text
retryableStorageFailure
```

because the store reported `storageFailure` and Task 1.34 adopted that semantic meaning.

It may not say:

```text
disk full
browser blocked storage
permissions denied
```

without evidence.

Likewise:

```text
recoveryRequired
```

must not imply a particular repair action.

---

# ADR Alignment

Task 1.35 should improve:

* failure transparency;
* correctness of user-facing success semantics;
* workflow consistency;
* session-first runtime usability;
* retry/recovery separation;
* deterministic ownership;
* epistemic integrity.

It does not yet complete persistent failure discoverability across navigation.

---

# Validation Requirements

Run focused UI/workflow tests covering:

* Setup success/failure/recovery semantics;
* manual-event durability failure;
* profile save/delete/load durability semantics;
* backup-import durability semantics;
* clear success/partial/total durability semantics;
* runtime continuation under durability failure;
* no automatic retry;
* shared classifier consumption;
* navigation/closure preservation.

Also run relevant lower-level tests:

```text
src/state/durabilitySemantics.test.ts
src/state/tests/dayFrameStore.test.ts
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

* focused workflow test files;
* focused workflow test count;
* semantic/store regression test count;
* full test-file count;
* full test count;
* number of tests added/updated;
* lint result;
* typecheck result;
* build result;
* diff-check result.

Confirm:

* Task 1.35 specification remained immutable;
* result artifact exists separately;
* no persistent durability surface exists;
* no retry UI exists;
* no recovery UI exists;
* store behavior remains unchanged;
* no durable format changed.

---

# Documentation Rules

During Task 1.35:

## Create

* `TASK_1.35_CONSUME_DURABILITY_SEMANTICS_IN_IMMEDIATE_PERSISTING_WORKFLOWS_RESULT.md`

## Preserve

* Task 1.35 specification;
* Tasks 1.23–1.34 results;
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

The Task 1.35 result should contain:

1. Executive Result
2. Artifact Integrity
3. Production Caller Inventory
4. Implementation Completed
5. Files Changed
6. Workflow Semantic State
7. Shared Classifier Consumption
8. Setup Integration
9. Setup Navigation/Closure
10. Manual-Event Integration
11. Manual-Event Closure/Preview Preservation
12. Profile Save Integration
13. Profile Delete Integration
14. Profile Load Integration
15. Backup Import Integration
16. Backup Validation Separation
17. Clear Integration
18. Partial-Clear Semantics
19. Total-Durability-Failure Clear Semantics
20. Domain Validation Separation
21. Durable Success Handling
22. Retryable Unavailable Handling
23. Retryable Storage-Failure Handling
24. Recovery-Required Handling
25. Product-Copy Determination
26. Runtime/Workflow Separation
27. Retry Deferral
28. Persistent Durability Surface Deferral
29. Tests Added or Updated
30. Reference Validation
31. ADR Alignment Improvement
32. Deviations
33. Discoveries and Deferred Work
34. Recommended Next Task
35. Validation
36. Final Completion Determination

---

# Expected Architectural Result

Before Task 1.35:

```text
store mutation
    ↓
exact persistence result exists
    ↓
shared semantic classifier exists
    ↓
workflow often ignores both
    ↓
runtime success may still be treated as durable success
```

After Task 1.35:

```text
store mutation
    ↓
exact persistence result
    ↓
shared semantic classifier
    ↓
workflow-local semantic state
        ├── durable success
        ├── retryable unavailable
        ├── retryable storage failure
        └── recovery required
```

For clear:

```text
clear result
    ↓
shared structured classifier
    ↓
workflow-local:
    aggregate semantic
    active semantic
    profiles semantic
```

Runtime behavior remains session-first.

---

# Expected Follow-Up

If Task 1.35 completes cleanly, DayFrame will have:

```text
store durability facts
shared semantic interpretation
immediate workflow consumption
reactive durability subscription
```

The next dependency-correct task should implement the **persistent app-level durability surface** required by Task 1.32.

A likely next task is:

> **Task 1.36 — Add Persistent App-Level Durability Awareness**

That task should:

* initialize from `getDurabilityStatus()`;
* subscribe with `subscribeDurability()`;
* classify both surfaces through Task 1.34;
* show only actionable known failures;
* suppress `unknown`;
* distinguish active versus profile durability;
* clear automatically when surfaces become durable;
* still avoid final recovery implementation if not separately authorized.

Retry controls may either be included there or staged into the following task depending on actual component structure.

Do not implement that persistent surface as part of Task 1.35.

---

# Completion Criteria

Task 1.35 is complete when:

* every current production persisting workflow is inventoried;
* every in-scope workflow consumes the Task 1.34 shared classifier;
* Setup save distinguishes durable success, retryable unavailable, retryable storage failure, and recovery required;
* manual-event persistence distinguishes the same semantics;
* profile save distinguishes runtime existence from durable save;
* profile delete distinguishes runtime deletion from durable deletion;
* profile load distinguishes session load from active-state durability;
* backup import distinguishes valid runtime import from durable active persistence;
* clear consumes structured aggregate and per-surface semantics;
* partial clear is not internally treated as full durable success;
* total durable clear failure is distinct from runtime clear failure;
* runtime state continues session-first after durability failure;
* existing navigation/closure behavior is preserved unless explicitly justified otherwise;
* shared semantics are not reimplemented independently in workflows;
* domain/input validation failures remain separate;
* no automatic retry occurs;
* no retry control is added;
* no recovery UI is added;
* no persistent global durability surface is added;
* no durability subscription consumer is introduced;
* no store behavior changes;
* no durable schema/key/version changes;
* focused workflow tests directly protect semantic consumption;
* full validation passes;
* the result artifact identifies the next dependency-correct seam.

---

# Task Determination

Task 1.35 is a bounded immediate-workflow durability-semantics implementation.

It does not add persistent global durability UI, retry controls, or recovery.

Its purpose is to connect DayFrame's established store facts and shared semantic vocabulary to the workflows that currently initiate persistence, so session-level success and durable success are no longer treated as the same fact.

**The task is complete when every current immediate persisting workflow consumes the shared durability semantic classifier, distinguishes durable success from retryable and recovery-required durability failure in its workflow state, preserves session-first runtime behavior and existing navigation/closure semantics unless evidence requires otherwise, stops internally treating failed persistence as durable success, and introduces no persistent global durability UI, retry controls, automatic retry, or recovery behavior.**
