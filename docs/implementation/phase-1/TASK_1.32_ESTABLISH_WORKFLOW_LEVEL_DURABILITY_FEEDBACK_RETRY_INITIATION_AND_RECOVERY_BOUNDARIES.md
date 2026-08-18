# Implementation Task 1.32 — Establish Workflow-Level Durability Feedback, Retry Initiation, and Recovery Boundaries

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.32

**Task Name:** Establish Workflow-Level Durability Feedback, Retry Initiation, and Recovery Boundaries

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation / Architectural Contract Decision

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning investigation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.32_ESTABLISH_WORKFLOW_LEVEL_DURABILITY_FEEDBACK_RETRY_INITIATION_AND_RECOVERY_BOUNDARIES_RESULT.md`

The result artifact should document:

* investigation completed;
* workflow callers inventoried;
* current success-feedback semantics mapped;
* immediate mutation-result consumption needs identified;
* retained durability-status consumption needs identified;
* contextual versus global feedback models evaluated;
* retry initiation boundaries determined;
* retry result handling determined;
* serialization-failure handling determined;
* unavailable-storage handling determined;
* ordinary storage-failure handling determined;
* partial-clear communication determined;
* profile-save/delete/load feedback determined;
* backup-import feedback determined;
* Setup/manual-event feedback determined;
* durability-subscription need determined;
* recovery boundaries determined;
* ownership map produced;
* recommended workflow contract;
* implementation consequences identified;
* validation performed;
* deviations;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

This task does **not** authorize production or UI changes.

Do not modify production code, tests, store APIs, retry APIs, subscriptions, feedback copy, navigation, persistence behavior, recovery behavior, migrations, schemas, or durable formats during this task.

If evidence does not justify one unified feedback model across all workflows, classify the workflows separately rather than forcing uniformity.

---

# Pre-Execution Artifact Integrity Check

Before beginning execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Workflow Surfaces;
* Required Questions;
* Feedback Models;
* Retry Initiation;
* Recovery Boundaries;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame has an evidence-backed workflow contract defining where durability failures are communicated, how retry is initiated and interpreted, when recovery replaces retry, whether reactive durability observation is actually required, how partial clear and source-backed workflows differ, and what smallest implementation seam should connect store durability truth to user-facing behavior without moving persistence authority into the UI.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the integrity discrepancy for project review.

---

# Purpose

Define how DayFrame's now-coherent store-level durability model should be surfaced to workflows and, eventually, users.

Tasks 1.23–1.31 established:

```text
persistence failure boundaries
        ↓
factual helper outcomes
        ↓
store durability semantics
        ↓
mutation results
        ↓
retained durability status
        ↓
retry semantics
        ↓
desired durable condition
        ↓
total write/removal outcome boundary
        ↓
explicit store-owned retry
```

The store can now truthfully answer:

```text
What happened during this mutation?
    → StoreMutationResult

What is the current durability relationship?
    → StoreDurabilityStatus

What durable condition is intended?
    → StoreDesiredDurableCondition

Can the store retry it?
    → retryActivePersistence()
      retryProfilePersistence()
```

But current workflows still generally behave as though runtime success implies durable success.

Task 1.32 determines how that gap should be closed.

---

# Architectural Context

The current architecture intentionally separates:

```text
Persistence helpers
    → factual browser-storage outcomes

DayFrameStore
    → runtime authority
    → durability interpretation
    → retained durability
    → desired durable condition
    → retry execution

Workflow / UI
    → user communication
    → user-triggered retry initiation
    → recovery choice
```

Task 1.32 must preserve that ownership.

The UI must not:

* inspect localStorage;
* infer durability independently;
* choose persistence payloads;
* invoke private persistence helpers;
* replay domain commands to simulate retry.

---

# Governing Evidence

Task 1.25 established that workflow/UI owns:

* user communication;
* user-triggered recovery choice.

Task 1.28 established that:

* workflow/user initiates ordinary retry;
* store executes retry;
* store interprets the persistence result;
* serialization failure is not blindly retryable;
* recovery is distinct from retry.

Task 1.31 established executable:

```ts
retryActivePersistence()
retryProfilePersistence()
```

with:

* exact discriminated result;
* no state mutation;
* no ordinary state notification;
* no automatic retry;
* no UI consumer;
* no durability subscription.

Task 1.32 must determine how workflows should now consume those capabilities.

---

# Objective

Determine the smallest coherent workflow-level contract for:

1. Setup save;
2. narrow authored mutations where user-visible;
3. manual-event save/delete;
4. profile save;
5. profile delete;
6. profile load;
7. backup import;
8. clear local data;
9. active durability failure after any of those operations;
10. profile durability failure;
11. explicit retry initiation;
12. retry success/failure feedback;
13. unavailable storage;
14. serialization failure;
15. partial clear;
16. retained durability after the initiating workflow has ended;
17. reactive versus non-reactive durability observation;
18. recovery rather than retry.

---

# Workflow Surfaces In Scope

At minimum inspect current application workflows for:

## Setup

* Save Setup;
* persisted authored mutation result;
* current success feedback.

## Manual Events

* create;
* edit;
* delete;
* any subsequent Preview regeneration;
* current success feedback.

## Profiles

* save;
* delete;
* load;
* current success feedback.

## Backup

* import;
* export feedback only insofar as it intersects durability semantics;
* imported active-state persistence result.

## Clear Local Data

* runtime clear;
* two durability outcomes;
* aggregate clear result;
* current feedback.

## Other Persisting Workflow Callers

Repository-wide audit all production callers of store methods returning:

```text
StoreMutationResult
ClearLocalDataResult
DurabilityRetryResult
```

Do not assume the known UI list is exhaustive.

---

# Explicitly Out of Scope

Do not redesign:

* scheduling UI;
* Preview;
* friction;
* suggested fixes;
* Planner/Summary information architecture;
* profile UX beyond durability feedback;
* backup file-delivery completion beyond current evidence;
* migration UX;
* unsupported-version recovery unless needed to distinguish it from ordinary durability failure.

---

# Required Questions

## 1. What Should Immediate Workflow Success Mean?

Determine whether current user-facing "saved" or equivalent success language should mean:

### A. Runtime transition succeeded

or:

### B. Durable persistence succeeded

or:

### C. Workflow distinguishes the two

The store architecture now distinguishes them.

Workflow semantics must no longer leave the word "saved" ambiguous where persistence can fail.

Do not change wording in this task.

---

# 2. Immediate Mutation Result Versus Retained Status

Determine when a workflow should use:

```text
mutationResult.persistence
```

versus:

```text
store.getDurabilityStatus()
```

Potential principle:

```text
immediate workflow completion
    → use mutation result

later/global durability awareness
    → use retained status
```

Evaluate and make this normative if supported.

---

# 3. Should Every Persistence Failure Produce Immediate Feedback?

Determine whether all failures should be surfaced synchronously to the initiating workflow.

At minimum evaluate:

```text
storageFailure
unavailable
serializationFailure
```

Do not assume they require identical UX severity.

---

# 4. Storage Failure Feedback

Determine how ordinary `storageFailure` should be represented conceptually.

The workflow should know:

```text
runtime change succeeded
durable save failed
retry is available
```

Determine whether this should be:

* inline contextual feedback;
* toast/banner;
* persistent global warning;
* combination;
* another model.

Do not draft final copy.

---

# 5. Unavailable Storage Feedback

Task 1.25 classified `unavailable` as usable session-only operation.

Determine whether the user should be told something conceptually equivalent to:

```text
Your changes are active for this session,
but DayFrame cannot currently save them durably.
```

Determine whether this differs from `storageFailure`.

Do not infer browser cause.

---

# 6. Serialization-Failure Feedback

This requires a distinct decision.

Serialization failure means blind retry is blocked.

Determine whether workflow should:

* show a non-retryable durability error;
* offer recovery/export;
* instruct the user to change/remove problematic data;
* escalate to application-level fault messaging;
* another model.

Do not implement recovery.

---

# 7. Retry Initiation Placement

Determine where users should initiate:

```text
retryActivePersistence()
retryProfilePersistence()
```

Candidate models:

### Contextual Retry

Retry appears where the failure occurred.

### Global Retry

A durability-status surface exposes retry independent of original workflow.

### Both

Immediate contextual retry plus later global recovery affordance.

### Neither Yet

Failure shown, but retry deferred to another dedicated recovery surface.

Evaluate actual workflow persistence and retained-status lifetime.

---

# 8. Retry After Workflow Ends

A key issue:

```text
Setup save fails durability
    ↓
user navigates elsewhere
    ↓
active status remains storageFailure
```

Determine whether the architecture requires the failure to remain discoverable after the initiating workflow disappears.

If yes, immediate contextual feedback alone may be insufficient.

This is central to deciding whether retained durability needs a reactive consumer.

---

# 9. Durability Subscription Need

Task 1.27 and Task 1.31 deliberately avoided a subscription because no reactive consumer existed.

Task 1.32 must determine whether the proposed workflow contract creates one.

Evaluate:

### Accessor-Only

Workflows query durability after explicit operations.

### Dedicated Durability Subscription

Reactive UI observes retained durability independently of `DayFrameState`.

### Polling

Should almost certainly be rejected unless evidence supports it.

### State Subscription Piggyback

Evaluate and likely reject if it violates the established state subscriber contract.

Do not implement a subscription.

---

# 10. Global Durability Indicator

Determine whether DayFrame needs a persistent application-level indicator when:

```text
activeState != durable
or
profiles != durable
```

Do not assume every non-durable status deserves a global warning.

Consider:

```text
unknown
durable
unavailable
storageFailure
serializationFailure
```

Task 1.27 established `unknown` is not failure.

---

# 11. Should `unknown` Be User-Visible?

Likely not, but determine explicitly.

`unknown` means:

> This store instance has not yet established a persistence fact.

Do not turn that into an alarming "unsaved" state without evidence.

---

# 12. Should `durable` Be User-Visible?

Determine whether positive durability confirmation needs persistent UI.

Avoid unnecessary status clutter.

A workflow may need success confirmation without a permanent "durable" badge.

---

# 13. Setup Save Feedback

Define the future semantic contract for Setup Save.

Possible result classes:

```text
runtime applied + persisted
runtime applied + unavailable
runtime applied + storageFailure
runtime applied + serializationFailure
```

For each determine:

* success wording category;
* failure visibility;
* retry availability;
* later discoverability;
* navigation behavior.

Do not change Save Setup behavior yet.

---

# 14. Setup Navigation After Durability Failure

If Setup currently saves and leaves/closes a workflow, determine whether persistence failure should:

* block navigation;
* allow navigation with warning;
* keep user in Setup;
* depend on failure type.

Session-first architecture suggests runtime application should remain valid, but user-data risk may justify keeping recovery visible.

Make an explicit recommendation.

---

# 15. Manual-Event Feedback

Determine how manual-event persistence failure should interact with:

* editor closure;
* Preview regeneration;
* navigation;
* event appearing in runtime calendar.

A runtime event may look completely successful even though reload will lose it.

Determine the correct communication contract.

---

# 16. Profile Save Feedback

Profiles are stronger durable artifacts than active session state.

Determine whether:

```text
profile runtime creation succeeded
profile persistence failed
```

should still be called "saved."

Likely not.

Determine whether failed durable profile creation should remain visible in runtime UI with explicit non-durable status or whether workflow-level messaging is sufficient.

Do not change runtime profile behavior.

---

# 17. Profile Delete Feedback

A failed durable delete means:

```text
runtime profile removed
durable profile still exists
```

and reload may restore it.

Determine how this should be communicated.

This may deserve wording different from profile save failure.

---

# 18. Profile Load Feedback

Profile load involves:

```text
durable source profile
    ↓
runtime active state
    ↓
active persistence
```

If active persistence fails:

* profile load is still usable for the session;
* source profile remains available;
* reload may return old active state.

Determine what success/failure should mean to the user.

---

# 19. Backup Import Feedback

A valid backup can be:

```text
validated
runtime applied
active persistence failed
```

Determine whether "import successful" should be split into:

```text
imported into current session
but could not save imported state
```

or equivalent semantics.

External backup remains recovery source.

---

# 20. Clear Local Data Feedback

Clear is unique because it spans two durable surfaces.

Determine feedback for:

```text
cleared
partiallyCleared
notCleared
```

and exact underlying outcomes.

Partial clear must not be described as full success.

Determine whether the user must be told which surface remains.

---

# 21. Partial Clear Retry

Determine whether clear workflow should expose:

```text
retryActivePersistence()
retryProfilePersistence()
```

for only unresolved surfaces.

Task 1.31 supports surface-specific absence retry.

Do not invent aggregate clear retry.

---

# 22. Retry Result Feedback

For:

```text
DurabilityRetryResult
```

determine how workflows should interpret:

```text
attempted + persisted/removed
attempted + unavailable
attempted + storageFailure
attempted + serializationFailure
notAttempted + unknown
notAttempted + alreadyDurable
notAttempted + serializationFailure
```

Not every theoretically possible result needs direct user exposure.

Classify which are:

* success;
* retryable failure;
* non-retryable failure;
* benign no-op;
* programming/internal state.

---

# 23. Retry From `alreadyDurable`

Determine whether the user should ever see this.

If a retry control races with a successful ordinary persistence operation, the store may return:

```text
notAttempted / alreadyDurable
```

Likely this should collapse to success/complete in UI rather than an error.

Make the contract explicit.

---

# 24. Retry From `unknown`

Determine whether this should normally be impossible from user-facing retry controls.

If it occurs, should it be:

* hidden/internal;
* benign no-op;
* workflow contract violation.

Do not expose confusing "retry unknown" language without need.

---

# 25. Serialization Failure After Eligible Retry

An eligible retry may attempt a current snapshot and receive:

```text
serializationFailure
```

Determine how workflow transitions from retry mode into recovery mode.

This is the primary bridge between retry and recovery.

---

# 26. Recovery Definition

Adopt the Task 1.28 distinction:

```text
retry
    = attempt again to establish current desired durable condition

recovery
    = choose, repair, export, or reconstruct another representation
      because ordinary retry is insufficient
```

Determine which current failure classes require recovery rather than retry.

---

# 27. Recovery Authority

Determine ownership among:

```text
Store
Workflow
Dedicated recovery surface
User
```

Potential model:

```text
Store
    exposes facts and retry

Workflow
    determines communication
    offers retry/recovery entry

Recovery flow
    performs explicit user-authorized recovery
```

Evaluate.

---

# 28. Serialization Recovery Boundary

Determine what Task 1.32 can say about future serialization recovery without designing the implementation.

Potential future options include:

* export current runtime data;
* isolate invalid authored field;
* reset/re-edit affected data;
* diagnostic report;
* another bounded recovery path.

Do not authorize one unless current evidence supports it.

It may be sufficient to classify serialization recovery as a separate future investigation.

---

# 29. Read/Hydration Recovery Boundary

Task 1.30 left local-storage accessor failure during store construction exceptional.

Determine whether workflow-level durability UI should **not** attempt to solve startup read failure.

Likely classify hydration/read recovery as a separate lifecycle boundary.

---

# 30. Feedback Persistence

If a workflow-level error message disappears on navigation but retained durability remains failed, determine whether DayFrame needs:

* persistent global durability notice;
* contextual re-entry surface;
* notification center;
* another mechanism.

This question drives subscription need.

---

# 31. Feedback Clearing

Determine when durability feedback should clear.

Potential triggers:

```text
successful ordinary persistence
successful explicit retry
surface changes from failure → durable
```

Do not clear failure merely because the original workflow closes.

---

# 32. Surface-Specific Feedback

Active state and profiles should remain distinguishable.

Determine whether users need to know:

```text
Your schedule/settings are not saved
```

versus:

```text
Your saved profiles are not saved
```

rather than one generic storage warning.

---

# 33. Combined Failure

If both:

```text
activeState = storageFailure
profiles = storageFailure
```

determine whether one global combined warning is appropriate or whether separate actions remain necessary.

Retry is still surface-specific.

---

# 34. Contextual Versus Global Feedback Models

Evaluate at least these models.

## Model A — Contextual Only

Each workflow communicates its own persistence result.

### Benefits

* local relevance;
* minimal global UI.

### Risks

* failure disappears after navigation;
* retained durability becomes invisible.

---

## Model B — Global Only

Application-level durability surface monitors retained status.

### Benefits

* failure remains discoverable.

### Risks

* weak context;
* every workflow must funnel into generic infrastructure UI;
* possibly noisy.

---

## Model C — Contextual Immediate + Global Persistent

Workflow communicates immediate result; persistent global indicator remains while a surface is non-durable.

### Benefits

* immediate clarity;
* later discoverability;
* retained status has a natural consumer.

### Risks

* requires durability subscription;
* more UI complexity.

---

## Model D — Contextual Immediate + Dedicated Recovery Surface

Workflow reports failure and links to a persistent recovery destination, but no always-visible global indicator.

Evaluate discoverability.

---

## Model E — Another Evidence-Supported Model

Add only if justified.

---

# Required Feedback Decision Matrix

Produce:

| Model                          | Immediate Context | Failure Survives Navigation | Reactive Subscription Needed | Surface Context | UI Complexity | Recommendation |
| ------------------------------ | ----------------- | --------------------------- | ---------------------------- | --------------- | ------------- | -------------- |
| Contextual only                |                   |                             |                              |                 |               |                |
| Global only                    |                   |                             |                              |                 |               |                |
| Contextual + global persistent |                   |                             |                              |                 |               |                |
| Contextual + recovery surface  |                   |                             |                              |                 |               |                |

---

# Required Workflow Matrix

Produce:

| Workflow                      | Runtime Success Meaning | Durable Success Meaning | Immediate Feedback Needed? | Retry Available? | Recovery Context | Persistent Discoverability Needed? |
| ----------------------------- | ----------------------- | ----------------------- | -------------------------: | ---------------: | ---------------- | ---------------------------------: |
| Setup save                    |                         |                         |                            |                  |                  |                                    |
| Manual-event save/edit/delete |                         |                         |                            |                  |                  |                                    |
| Profile save                  |                         |                         |                            |                  |                  |                                    |
| Profile delete                |                         |                         |                            |                  |                  |                                    |
| Profile load                  |                         |                         |                            |                  |                  |                                    |
| Backup import                 |                         |                         |                            |                  |                  |                                    |
| Clear local data              |                         |                         |                            |                  |                  |                                    |

---

# Required Failure-Class Matrix

Produce:

| Failure Class          | Runtime Continues? | Retryable? | Immediate Feedback | Persistent Feedback | Recovery Needed? |
| ---------------------- | -----------------: | ---------: | ------------------ | ------------------- | ---------------: |
| `unavailable`          |                    |            |                    |                     |                  |
| `storageFailure`       |                    |            |                    |                     |                  |
| `serializationFailure` |                    |            |                    |                     |                  |
| partial clear          |                    |            |                    |                     |                  |

---

# Required Retry-Result Matrix

Produce:

| Retry Result                          | Workflow Meaning | User-Facing Classification |
| ------------------------------------- | ---------------- | -------------------------- |
| attempted + `persisted`               |                  |                            |
| attempted + `removed`                 |                  |                            |
| attempted + `unavailable`             |                  |                            |
| attempted + `storageFailure`          |                  |                            |
| attempted + `serializationFailure`    |                  |                            |
| notAttempted + `alreadyDurable`       |                  |                            |
| notAttempted + `unknown`              |                  |                            |
| notAttempted + `serializationFailure` |                  |                            |

---

# Required Subscription Decision

The result must answer:

> **Does the adopted workflow feedback model create a real production need for a separate durability subscription?**

If yes, define:

* what it subscribes to;
* what it must not include;
* who consumes it;
* why polling or state-subscriber piggyback is inferior.

If no, explain how persisted failure remains discoverable across workflow transitions using accessor/result mechanisms alone.

---

# Required Feedback Ownership Statement

The result must contain a concise normative statement answering:

> **Which layer decides whether a durability outcome is success, retryable failure, non-retryable failure, or recovery-required, and which layer decides how that meaning is presented to the user?**

---

# Required Retry Initiation Statement

The result must contain:

> **Where does an ordinary user-triggered durability retry originate, and which layer owns execution?**

This must remain compatible with Task 1.28.

---

# Required Recovery Statement

The result must contain:

> **When does DayFrame stop retrying and enter recovery semantics instead?**

At minimum address serialization failure.

---

# Feedback Copy Boundary

This task may describe semantic message categories but must not finalize exact UI copy.

Allowed conceptual classifications:

```text
Saved durably
Applied for this session but not saved
Storage unavailable
Retry failed
Recovery required
Partially cleared
```

Do not write final product strings unless necessary to clarify a semantic distinction.

---

# UI Placement Boundary

Task 1.32 may recommend future placement conceptually:

* workflow-local message;
* app-level banner;
* status indicator;
* recovery panel;
* clear-result detail.

It must not modify layout or implement components.

---

# Durability Status Reactivity

If a durability subscription is recommended, determine whether the future subscription should emit:

```text
StoreDurabilityStatus
```

only.

Do not combine with:

```text
DayFrameState
StoreDesiredDurableCondition
```

unless a consumer demonstrably requires them.

Desired condition is retry-routing infrastructure, not necessarily user-facing status.

---

# Desired Condition UI Exposure

Determine whether workflows need direct access to:

```text
snapshot | absent
```

Likely not.

The store's retry methods already encapsulate routing.

Do not recommend UI branching on desired condition unless evidence requires it.

---

# Store Mutation Result Consumption

Determine which existing workflow handlers should eventually stop ignoring:

```text
result.persistence
```

and how.

At minimum audit all production calls introduced/affected by Task 1.26.

This is a key implementation consequence.

---

# Store Retry Result Consumption

There are currently no production callers.

Determine which workflows should eventually call:

```text
retryActivePersistence()
retryProfilePersistence()
```

and under what user action.

Do not implement.

---

# Automatic Retry

Task 1.28 rejected automatic retry based on current evidence.

Task 1.32 should not reopen this unless user-facing workflow evidence materially changes the conclusion.

Do not recommend hidden automatic retry merely to avoid designing feedback.

---

# Explicit Non-Goals

Task 1.32 shall not:

* modify UI;
* modify production code;
* modify tests;
* add durability subscription;
* add retry buttons;
* add banners;
* change feedback copy;
* change navigation;
* change store APIs;
* change retry APIs;
* change persistence helpers;
* add automatic retry;
* add recovery implementation;
* change `DayFrameState`;
* change desired-condition metadata;
* change retained durability status;
* change persistence formats;
* change storage keys;
* increment versions;
* change validators;
* change normalizers;
* change migrations;
* remove compatibility readers;
* redesign DayFrame's broader UX;
* resolve unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

* Tasks 1.23–1.31;
* especially:

  * Task 1.25 — store durability semantics;
  * Task 1.27 — retained durability status;
  * Task 1.28 — retry semantics;
  * Task 1.31 — store-owned retry implementation.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

---

# Evidence Standards

Distinguish:

* **Confirmed** — current executable behavior;
* **Adopted** — existing binding architectural decisions;
* **Recommended** — Task 1.32 workflow contract;
* **Deferred** — future implementation details;
* **Unresolved** — insufficient evidence.

Do not treat current false-success UI as desired behavior merely because it exists.

Do not treat every infrastructure distinction as something the user needs to see literally.

The workflow contract should translate store truth into user-relevant semantics without hiding meaningful data risk.

---

# Investigation Requirements

Inspect:

* all production callers of persisting mutations;
* all current success/error feedback state;
* Setup save flow;
* manual-event workflows;
* profile save/delete/load;
* backup import;
* clear local data;
* navigation after those actions;
* current app-level feedback mechanisms;
* whether a durable app-level status surface already exists;
* whether any existing component architecture can host persistent durability feedback;
* current retry APIs and retained status accessor;
* lack/presence of durability subscription.

Do not infer UI placement from file names alone.

---

# ADR Alignment Requirements

Evaluate the recommended workflow model against:

* failure transparency;
* user-data preservation;
* non-destructive recovery;
* retryability;
* deterministic store ownership;
* separation of runtime and durability truth;
* recovery continuity;
* epistemic integrity.

A workflow that says "saved" after a known durable failure should be classified as misaligned.

A workflow that overwhelms the user with infrastructure terminology may also be poor product architecture.

---

# Validation Requirements

This task is investigation only.

Do not modify production code or tests.

Run targeted tests where useful to confirm current workflow behavior.

At minimum inspect or run relevant:

```text
DayFrameApp tests
dayFrameStore tests
Preview/workflow tests where persistence feedback is exercised
```

Run repository-standard validation if current execution workflow requires:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Confirm:

* no executable file changed;
* Task 1.32 specification remained immutable;
* result artifact is separate;
* retry implementation remains unchanged;
* no UI or subscription was added.

---

# Documentation Rules

During Task 1.32:

## Create

* `TASK_1.32_ESTABLISH_WORKFLOW_LEVEL_DURABILITY_FEEDBACK_RETRY_INITIATION_AND_RECOVERY_BOUNDARIES_RESULT.md`

## Preserve

* Task 1.32 specification;
* Tasks 1.23–1.31 artifacts;
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

The Task 1.32 result should contain:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Current Workflow Feedback
5. Persisting Workflow Caller Inventory
6. Immediate Result Consumption
7. Retained Durability Consumption
8. Candidate Feedback Models
9. Feedback Decision Matrix
10. Recommended Workflow Feedback Contract
11. Storage-Failure Feedback
12. Storage-Unavailable Feedback
13. Serialization-Failure Feedback
14. Setup Save Semantics
15. Setup Navigation Semantics
16. Manual-Event Semantics
17. Profile Save Semantics
18. Profile Delete Semantics
19. Profile Load Semantics
20. Backup Import Semantics
21. Clear Semantics
22. Partial-Clear Semantics
23. Retry Initiation
24. Retry Result Handling
25. Retry From Already-Durable
26. Retry From Unknown
27. Retry-To-Recovery Transition
28. Recovery Boundary
29. Read/Hydration Recovery Separation
30. Persistent Discoverability
31. Subscription Determination
32. Global Versus Contextual Feedback
33. Surface-Specific Feedback
34. Ownership Map
35. ADR Alignment
36. Implementation Consequences
37. Unresolved Questions
38. Deviations
39. Discoveries and Deferred Work
40. Recommended Next Task
41. Validation
42. Final Completion Determination

---

# Expected Architectural Result

A likely—but not pre-authorized—result may look like:

```text
Store mutation
    ↓
runtime state applied
    ↓
persistence outcome
    ↓
workflow interprets outcome
    ├── durable success
    ├── retryable durability failure
    └── recovery-required durability failure
```

while retained status provides:

```text
persistent discoverability
```

after the initiating workflow ends.

Retry remains:

```text
workflow/user initiates
    ↓
store executes
    ↓
workflow interprets retry result
```

Recovery remains separate.

---

# Expected Follow-Up

Task 1.32 should identify the smallest implementation seam rather than authorizing a broad UI pass.

Possible outcomes include:

```text
Task 1.33
introduce durability subscription only
```

then:

```text
Task 1.34
consume mutation results in workflows
```

then:

```text
Task 1.35
add persistent durability feedback/retry UI
```

or perhaps:

```text
Task 1.33
consume immediate mutation/retry results contextually
```

if no subscription is required.

The investigation must derive the actual dependency order.

---

# Completion Criteria

Task 1.32 is complete when:

* every current persisting production workflow is inventoried;
* current success semantics are established;
* immediate persistence-result consumption needs are defined;
* retained durability consumption needs are defined;
* storage failure feedback semantics are defined;
* unavailable-storage feedback semantics are defined;
* serialization-failure feedback semantics are defined;
* Setup save feedback semantics are defined;
* manual-event durability feedback is defined;
* profile save/delete/load semantics are defined;
* backup-import durability semantics are defined;
* clear and partial-clear feedback are defined;
* retry initiation location/ownership is defined;
* retry result handling is defined;
* already-durable/unknown retry results are classified;
* retry-to-recovery transition is defined;
* serialization recovery is classified separately;
* persistent failure discoverability is decided;
* global versus contextual feedback models are evaluated;
* durability subscription need is explicitly decided;
* UI access to desired durable condition is explicitly evaluated;
* workflow/store ownership remains coherent;
* read/hydration recovery remains separately classified;
* implementation consequences are dependency-ordered;
* no executable behavior changes;
* required validation passes;
* the result artifact is sufficient to derive the next bounded implementation task.

---

# Task Determination

Task 1.32 is a workflow-level durability-feedback, retry-initiation, and recovery-boundary investigation.

It does not implement UI or alter persistence behavior.

Its purpose is to determine how DayFrame should translate the store's established durability truth into user-relevant workflow semantics while preserving store ownership of persistence and retry.

**The task is complete when DayFrame has an evidence-backed workflow contract defining where durability failures are communicated, how retry is initiated and interpreted, when recovery replaces retry, whether reactive durability observation is actually required, how partial clear and source-backed workflows differ, and what smallest implementation seam should connect store durability truth to user-facing behavior without moving persistence authority into the UI.**
