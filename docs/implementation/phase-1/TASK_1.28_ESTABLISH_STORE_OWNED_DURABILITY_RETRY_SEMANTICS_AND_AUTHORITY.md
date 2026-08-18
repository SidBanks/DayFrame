# Implementation Task 1.28 — Establish Store-Owned Durability Retry Semantics and Authority

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.28

**Task Name:** Establish Store-Owned Durability Retry Semantics and Authority

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation / Architectural Contract Decision

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning investigation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.28_ESTABLISH_STORE_OWNED_DURABILITY_RETRY_SEMANTICS_AND_AUTHORITY_RESULT.md`

The result artifact should document:

* investigation completed;
* current retained durability contract reviewed;
* current persistence-helper and mutation-result contracts reviewed;
* retryable surfaces classified;
* retry source snapshot semantics determined;
* retry authority determined;
* retry initiation authority determined;
* retry result semantics determined;
* retained durability-status transitions determined;
* state-subscriber behavior determined;
* storage-unavailable retry semantics determined;
* serialization-failure retry semantics determined;
* profile retry semantics determined;
* clear retry semantics determined;
* source-backed profile-load and backup-import implications determined;
* migration retry distinguished from ordinary retry;
* candidate retry models evaluated;
* recommended store-level retry contract;
* implementation consequences identified;
* unresolved questions, if any;
* validation performed;
* deviations;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

This task does **not** authorize retry implementation.

Do not modify production code, tests, store APIs, persistence helpers, durability status, UI feedback, retry behavior, scheduling, durable formats, migrations, or recovery UX during this task.

If executable evidence cannot determine a retry semantic uniquely, evaluate bounded alternatives and make an explicit architectural recommendation rather than silently assuming one.

---

# Pre-Execution Artifact Integrity Check

Before beginning execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Retry Surfaces;
* Required Questions;
* Candidate Retry Models;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame has an evidence-backed retry contract defining what each durable surface retries, who initiates and executes retry, how retained durability status changes, what subscribers may observe, which failures are retryable, how clear differs from ordinary persistence, and what smallest implementation seam should enact retry without yet changing executable behavior.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the integrity discrepancy for project review.

---

# Purpose

Define DayFrame's store-owned durability retry semantics before implementing retry behavior.

Tasks 1.23–1.27 established the following dependency chain:

```text
Task 1.23
persistence failure boundaries
        ↓
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
retained store durability status
```

The store can now distinguish:

```text
What is true in the current session?
    → DayFrameState

What happened during a specific durable operation?
    → StoreMutationResult / ClearLocalDataResult

What does the store currently know about durability?
    → StoreDurabilityStatus
```

The next unanswered architectural question is:

> When retained durability says a current runtime surface is not durably synchronized, what exactly does retry mean?

Task 1.28 answers that before adding retry APIs or user controls.

---

# Architectural Context

Task 1.25 adopted session-first runtime authority.

After a failed durable write:

```text
CURRENT SESSION
    runtime state = current authority

DURABLE STORAGE
    previous representation = last known durable checkpoint

STORE DURABILITY STATUS
    = current known relationship between runtime and durable storage
```

Task 1.27 made that retained relationship executable.

For example:

```text
activeState = storageFailure
profiles = durable
```

The store may later establish convergence through a successful complete-snapshot write.

Current ordinary mutations can already produce incidental convergence:

```text
activeState = storageFailure
        ↓
later normal authored mutation
        ↓
persisted
        ↓
activeState = durable
```

But DayFrame does not yet have an **explicit retry operation**.

Task 1.28 must determine how explicit retry differs from incidental later persistence.

---

# Governing Architectural Principles

The retry contract must preserve:

* store ownership of runtime mutation and persistence interpretation;
* session-first runtime authority;
* separation of domain state from durability infrastructure state;
* user-data preservation;
* deterministic state ownership;
* non-destructive recovery;
* explicit failure observability;
* epistemic integrity;
* the accepted durable-data ADR.

Retry must not become a second mutation-authority path.

---

# Governing Evidence

Task 1.24 established factual write outcomes:

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

Task 1.25 determined:

* the store should own retry execution;
* workflows/users should initiate ordinary retry;
* migration retry belongs to the migration boundary;
* automatic retry policy remained deferred.

Task 1.26 exposes immediate persistence outcomes through store mutation results.

Task 1.27 retains:

```text
activeState:
    unknown
    durable
    unavailable
    serializationFailure
    storageFailure

profiles:
    unknown
    durable
    unavailable
    serializationFailure
    storageFailure
```

No retry API currently exists.

---

# Objective

Determine the store-level retry contract for:

1. active authored-state persistence;
2. profile persistence;
3. storage-unavailable conditions;
4. storage failures;
5. serialization failures;
6. explicit retry after session-first continuation;
7. retry after incidental later convergence;
8. clear failures;
9. profile-load active-state failure;
10. backup-import active-state failure;
11. state-subscriber behavior during retry;
12. retry initiation versus retry execution;
13. recovery ownership;
14. migration retry separation.

The result must be precise enough to authorize the smallest bounded retry implementation task.

---

# Retry Surfaces

At minimum classify these durable surfaces:

## Active Authored State

Current runtime state already contains the complete desired active authored snapshot.

Potential retry source:

```text
current DayFrameState authored fields
```

The investigation must determine whether explicit retry should persist the **current runtime snapshot**, rather than the historical failed mutation payload.

---

## Saved Profiles

Current runtime store state already contains the complete desired profile collection.

Potential retry source:

```text
current savedProfiles collection
```

The investigation must determine whether profile retry should persist the entire current collection.

---

## Clear

Clear is different.

A failed clear may mean:

```text
runtime = cleared

active durable surface = removed or not removed
profile durable surface = removed or not removed
```

Retry may need to retry only unresolved removals.

Do not assume clear uses the same retry method as ordinary full-snapshot persistence.

---

# Explicitly Out-of-Scope Retry Surfaces

Do not invent retry semantics for:

* backup file download completion;
* Preview generation;
* friction;
* suggested fixes;
* scheduling;
* unsupported-version conversion;
* migration population convergence;
* arbitrary browser operations outside current durable surfaces.

---

# Required Questions

## 1. What Does Retry Retry?

Determine whether explicit retry persists:

### Model A — Original Failed Payload

Retry reproduces the exact historical snapshot that failed.

### Model B — Current Runtime Snapshot

Retry persists the latest complete current runtime representation.

### Model C — Pending Mutation Queue

Retry replays individual operations in order.

### Model D — Another Evidence-Supported Model

Evaluate the consequences.

Task 1.27's complete-snapshot convergence behavior strongly suggests current-snapshot retry may be sufficient, but Task 1.28 must establish this explicitly.

---

# 2. Active-State Retry Source

Determine whether active retry can reconstruct the durable payload directly from current store state using the same current persistence path.

If yes, establish that:

```text
retryActivePersistence
    ↓
current authored snapshot
    ↓
persistState
```

or equivalent is sufficient.

Determine whether retry requires storing any failed historical snapshot.

---

# 3. Profile Retry Source

Determine whether profile retry should persist:

```text
current savedProfiles
```

as a complete collection.

Evaluate whether this safely handles:

* failed profile save;
* failed profile delete;
* multiple subsequent runtime profile changes before retry.

Determine whether a per-profile pending queue is unnecessary.

---

# 4. Retry Versus Incidental Convergence

Define the distinction between:

```text
later ordinary mutation persists current snapshot
```

and:

```text
explicit retry with no domain mutation
```

Both may produce durable convergence.

Determine whether explicit retry should:

* mutate no domain state;
* publish no new `DayFrameState` snapshot;
* update only retained durability status;
* return a persistence outcome.

This is a central required decision.

---

# 5. Retry Result Contract

Determine what retry should return.

Potential contract:

```ts
type DurabilityRetryResult = {
  persistence: PersistenceWriteOutcome;
};
```

or perhaps:

```ts
type DurabilityRetryResult = {
  state: DayFrameState;
  persistence: PersistenceWriteOutcome;
};
```

Determine whether returning runtime state is meaningful when retry does not mutate it.

Prefer the smallest truthful result.

---

# 6. Retained Status Transition

Define how retry updates retained durability status.

Expected examples:

```text
storageFailure
    ↓ retry succeeds
durable
```

```text
unavailable
    ↓ retry unavailable
unavailable
```

```text
storageFailure
    ↓ retry storageFailure
storageFailure
```

Determine whether successful retry always replaces prior non-durable status.

---

# 7. Retry From `unknown`

Determine whether explicit retry should be allowed when retained status is:

```text
unknown
```

Potential interpretations:

### A. Yes

Retry means “persist current state now,” even without a known prior failure.

### B. No

Retry is specifically a recovery operation for known non-durable state.

### C. Separate command vocabulary

A generic “persist now” operation differs from “retry failed persistence.”

Recommend one.

Avoid muddling retry with manual save semantics.

---

# 8. Retry From `durable`

Determine whether retry should be:

* permitted as idempotent persistence;
* rejected/no-op because no retry is needed;
* represented as a generic force-persist operation instead.

The contract should avoid pretending a successful surface needs recovery.

---

# 9. Storage-Unavailable Retry Semantics

Task 1.25 classified `unavailable` as usable session-only mode.

Determine whether explicit retry is appropriate when the status is `unavailable`.

If yes, retry should probably re-check current storage availability through the existing persistence path.

Determine whether automatic polling/retry is warranted.

Do not implement it.

---

# 10. Storage-Failure Retry Semantics

Determine whether `storageFailure` is ordinarily retryable from the same current snapshot.

Do not infer browser cause.

Establish whether retry should simply perform another factual persistence attempt.

---

# 11. Serialization-Failure Retry Semantics

This must be treated separately.

Task 1.25 established that blindly retrying unchanged data after:

```text
serializationFailure
```

may be inappropriate.

Determine whether:

* explicit ordinary retry should be blocked;
* retry may be allowed but returns the same failure;
* a different recovery/diagnostic path is required;
* workflow must change runtime data before retry.

Do not collapse serialization failure into transient storage failure.

---

# 12. Storage-Accessor Exception

Task 1.27 preserved exceptional behavior where accessing `globalThis.localStorage` itself throws.

Task 1.25 recommended eventually normalizing that to `storageFailure`.

Determine whether retry implementation is the correct task boundary to normalize it.

Consider:

```text
retry operation
    ↓
getStorage throws
```

Should this become an ordinary retry result?

Also determine whether ordinary mutation paths should be aligned at the same time or separately.

Do not implement.

---

# 13. Retry Initiation Authority

Task 1.25 recommended:

```text
Workflow / user
    initiates ordinary retry

Store
    executes retry
```

Confirm or modify this.

Determine whether any retry should be automatic.

Potential automatic triggers to evaluate:

* immediately after failure;
* timer/backoff;
* browser focus;
* next successful storage access;
* next mutation;
* network/reconnect analogue if relevant;
* none.

Do not assume browser localStorage failures benefit from network-style retry logic.

---

# 14. Retry Execution Authority

Determine whether retry should be implemented directly on `DayFrameStore`.

Potential future APIs:

```text
retryActivePersistence()
retryProfilePersistence()
```

or:

```text
retryDurability(surface)
```

Evaluate which better preserves explicit surface ownership without introducing unnecessary generic abstractions.

---

# 15. One Generic Retry or Surface-Specific Retry?

Compare:

```ts
retryDurability("activeState")
retryDurability("profiles")
```

against:

```ts
retryActivePersistence()
retryProfilePersistence()
```

Consider:

* clarity;
* type safety;
* future surfaces;
* current scope;
* over-generalization.

Recommend the smallest coherent API.

---

# 16. Does Retry Notify State Subscribers?

This is mandatory.

Retry may alter durability status while leaving `DayFrameState` identical.

Determine whether current state subscribers should be notified.

Candidate answer:

```text
No.
```

because:

```text
DayFrameState did not change
```

and state subscription guarantees runtime truth only.

If so, a future reactive durability consumer would need a separate durability subscription.

Establish this explicitly.

---

# 17. Durability Subscription Implication

Task 1.27 intentionally added no durability subscription because no consumer existed.

Retry creates a new case where retained durability can change **without any domain mutation**.

Determine whether retry implementation therefore creates the first architectural need for a durability subscription.

Distinguish:

```text
store internally updates durability
```

from:

```text
existing UI already needs reactive durability
```

The existence of retry alone may or may not justify adding a subscription.

Decide whether the retry implementation should:

* expose retry result only and leave accessor;
* add separate durability subscription;
* defer subscription until UI consumes it.

---

# 18. Retry and Immediate Result

Determine whether retry result alone is enough for the initiating workflow to know the new outcome.

If so, a durability subscription may still be unnecessary until broader/global UI exists.

---

# 19. Active Retry and Runtime Mutation

Confirm whether active retry should leave:

```text
DayFrameState
```

byte/semantically unchanged.

If retry reconstructs a snapshot through cloning, determine whether state should still not be reassigned merely for persistence.

Do not create fake state mutations to produce notifications.

---

# 20. Profile Retry and Runtime Mutation

Likewise determine whether profile retry persists the current profile collection without changing runtime profile state.

No profile subscriber/state notification should occur merely because storage synchronization changed, unless the architecture deliberately says otherwise.

---

# 21. Clear Retry Semantics

Clear requires special treatment.

Suppose:

```text
runtime = cleared
active status = durable
profiles status = storageFailure
```

Determine whether retry should:

* remove only unresolved profile storage;
* remove both keys again;
* use a dedicated clear-retry command;
* allow generic per-surface retry.

For the cleared active surface, ordinary active persistence would be wrong because it could write default state instead of preserving “absence of key” semantics.

Therefore clear retry likely cannot be treated as ordinary active snapshot retry without care.

This must be explicitly resolved.

---

# 22. Retained Operation Intent for Clear

Task 1.27 retains only normalized surface status, not the operation that caused it.

After:

```text
clear active removal fails
```

the retained status may simply be:

```text
activeState = storageFailure
```

But ordinary active-state retry would normally mean:

```text
persist current active state
```

while clear retry should mean:

```text
remove active key
```

Determine whether the current retained status is sufficient to choose correct retry semantics.

This is a critical question.

Evaluate whether retry requires retaining minimal durable-intent metadata such as:

```text
active desired durable condition:
    snapshot
    absent
```

without introducing a mutation history.

---

# 23. Desired Durable Condition

Consider whether the more precise retained model should conceptually include:

```text
current desired durable condition
```

for each surface.

For example:

```text
active:
    desired = persistedSnapshot
```

versus:

```text
active:
    desired = absent
```

after clear.

Likewise profiles.

Determine whether this information is already derivable from runtime state or whether clear creates ambiguity.

Do not modify Task 1.27 status in this investigation.

---

# 24. Clear Retry API

Evaluate candidate future models:

### Model A — Dedicated `retryClearLocalData`

Retries whichever removals remain unresolved.

### Model B — Surface Retry Carries Durable Intent

Generic surface retry knows whether current desired condition is snapshot or absent.

### Model C — Always Re-run Full Clear

Retry calls both removals again.

### Model D — Other

Compare safety and simplicity.

---

# 25. Profile Load Recovery Source

When profile load succeeded in runtime but active persistence failed:

```text
source profile remains durable
runtime active state = loaded profile
active status = failure
```

Determine whether active retry should simply persist the current runtime snapshot.

It likely should not reload the profile source because the runtime may have changed since load.

Establish whether source profile is a recovery source only, not retry input.

---

# 26. Backup Import Recovery Source

Likewise, after valid backup import with failed active persistence:

```text
external backup remains
runtime may continue changing
```

Determine whether active retry should persist **current runtime state**, not re-import the original backup.

The backup remains recovery source, not necessarily retry source.

---

# 27. Retry After Subsequent Runtime Changes

Example:

```text
import backup
    ↓ active persistence fails

user edits Setup
    ↓ persistence also fails

retry
```

What should retry persist?

The likely answer is:

```text
latest current runtime snapshot
```

not the backup snapshot and not the first failed snapshot.

Establish this explicitly.

---

# 28. Retry Idempotence

Determine whether retry operations should be idempotent with respect to domain/runtime state.

Repeated retry attempts should ideally:

* leave runtime unchanged;
* update only durability status;
* perform one persistence/removal attempt each.

Define the expected behavior.

---

# 29. Retry and Full-Snapshot Semantics

Active and profile current writers persist complete representations.

Determine whether this means a successful retry establishes:

```text
current surface = durable
```

regardless of how many prior operations failed.

Clarify that it does not establish historical intermediate durability.

---

# 30. Retry Result Categories

Determine whether retry should preserve all Task 1.24 outcome categories.

Expected:

```text
persisted
unavailable
serializationFailure
storageFailure
```

for snapshot retry.

For removal retry:

```text
removed
unavailable
storageFailure
```

Do not reduce retry to boolean success/failure if recovery needs exact category.

---

# 31. Retry on Serialization Failure

Because `serializationFailure` may indicate invalid current state, determine whether retry API should expose a precondition such as:

```text
retry permitted but likely unchanged failure
```

or whether it should refuse and direct workflow to recovery.

Do not make a vague “retryable/not retryable” claim without reasoning.

---

# 32. Status After Failed Retry

Determine whether retained status should simply become the latest retry outcome.

Example:

```text
storageFailure
    ↓ retry
unavailable
```

Should retained status become:

```text
unavailable
```

because that is the latest known relationship?

Likely yes, but establish it.

---

# 33. Status After Successful Retry

Successful active/profile snapshot retry:

```text
→ durable
```

Successful clear/removal retry:

```text
→ durable
```

Establish whether partial clear retry affects only the retried surface.

---

# 34. User Communication Boundary

Retry investigation must define what the store should return to future workflows, but not wording.

The workflow should eventually be able to distinguish at minimum:

* retry succeeded;
* storage unavailable;
* storage operation failed;
* serialization failure;
* clear still partial.

Do not draft UI text.

---

# 35. Recovery Versus Retry

Define the distinction:

```text
retry
    = attempt to establish the current intended durable condition again

recovery
    = choose or reconstruct a different state/source because retry is insufficient
```

Examples:

* `storageFailure` → likely retry;
* `serializationFailure` → may require recovery/change;
* unsupported durable format → recovery/conversion, not ordinary retry.

This distinction should be normative.

---

# 36. Migration Retry

Keep migration retry separate.

Ordinary retry:

```text
persist current store surface
```

Migration retry:

```text
complete versioned transformation
+
durable migration evidence
```

Ordinary `durable` status must not count as migration completion.

---

# Candidate Retry Models

The result must explicitly evaluate at least these models.

## Model A — Retry Original Failed Mutation

Store retains/replays original failed operations.

Advantages to evaluate:

* preserves exact original intent.

Costs:

* mutation queues/history;
* stale intent;
* conflicts with later runtime edits;
* more complexity than full-snapshot persistence requires.

---

## Model B — Retry Current Full Snapshot

Store persists the latest current desired representation.

Advantages:

* aligns with session-first authority;
* naturally includes subsequent edits;
* no mutation queue;
* uses existing full-snapshot persistence.

Costs:

* must distinguish snapshot persistence from clear/absence intent.

---

## Model C — Retry Last Failed Snapshot

Store preserves the exact snapshot that last failed and retries that.

Evaluate whether this can overwrite newer runtime intent and is therefore unsafe.

---

## Model D — Workflow Replays Original Action

UI/workflow invokes the original command again.

Evaluate whether this:

* duplicates domain mutations;
* changes timestamps;
* redoes navigation/Preview effects;
* distributes store authority;
* is architecturally unsound.

---

## Model E — Current Desired Durable Condition

Store retries the current desired durable condition for a surface:

```text
snapshot
or
absence
```

This may generalize active/profile snapshot retry and clear removal retry without storing operation history.

Evaluate whether this is the best conceptual model.

---

# Required Retry Decision Matrix

Produce:

| Model                             | Preserves Latest Runtime Intent | Needs Mutation History | Handles Subsequent Edits | Handles Clear Correctly | Complexity | Store Ownership | Recommendation |
| --------------------------------- | ------------------------------- | ---------------------- | ------------------------ | ----------------------- | ---------- | --------------- | -------------- |
| Original failed mutation          |                                 |                        |                          |                         |            |                 |                |
| Current full snapshot             |                                 |                        |                          |                         |            |                 |                |
| Last failed snapshot              |                                 |                        |                          |                         |            |                 |                |
| Workflow replays action           |                                 |                        |                          |                         |            |                 |                |
| Current desired durable condition |                                 |                        |                          |                         |            |                 |                |

Add another model only if evidence justifies it.

---

# Required Surface Retry Matrix

Produce:

| Surface/Condition                   | Retry Source | Retry Operation | Runtime Mutation? | State Notification? | Status Update | Result |
| ----------------------------------- | ------------ | --------------- | ----------------: | ------------------: | ------------- | ------ |
| Active snapshot non-durable         |              |                 |                   |                     |               |        |
| Profiles snapshot non-durable       |              |                 |                   |                     |               |        |
| Active cleared-but-removal-failed   |              |                 |                   |                     |               |        |
| Profiles cleared-but-removal-failed |              |                 |                   |                     |               |        |
| `unavailable`                       |              |                 |                   |                     |               |        |
| `serializationFailure`              |              |                 |                   |                     |               |        |

---

# Required Status Transition Matrix

Produce:

| Current Status         | Retry Outcome    | New Retained Status |
| ---------------------- | ---------------- | ------------------- |
| `storageFailure`       | `persisted`      |                     |
| `storageFailure`       | `storageFailure` |                     |
| `storageFailure`       | `unavailable`    |                     |
| `unavailable`          | `persisted`      |                     |
| `unavailable`          | `unavailable`    |                     |
| `serializationFailure` | retry decision   |                     |
| `durable`              | retry decision   |                     |
| `unknown`              | retry decision   |                     |

Include clear/removal equivalents where different.

---

# Required Subscriber Decision

The result must contain a concise normative statement answering:

> **Does an explicit durability retry notify ordinary `DayFrameState` subscribers when runtime state does not change?**

Explain why.

---

# Required Retry Ownership Statement

The result must contain a concise normative statement answering:

> **Who may initiate ordinary durability retry, who executes it, and who interprets the persistence result?**

---

# Required Retry Source Statement

The result must contain a concise normative statement answering:

> **What data or durable condition is authoritative as retry input after one or more failed persistence attempts and subsequent runtime changes?**

---

# Required Clear Determination

The result must explicitly answer:

> **Does the current retained durability model contain enough information to retry a failed clear safely?**

If no, identify the smallest missing information without implementing it.

This is one of the most important outputs of Task 1.28.

---

# Required Ownership Map

Produce:

| Responsibility                     | Recommended Owner |
| ---------------------------------- | ----------------- |
| Determine current retry source     |                   |
| Execute active retry               |                   |
| Execute profile retry              |                   |
| Execute clear retry                |                   |
| Update retained durability status  |                   |
| Initiate user-requested retry      |                   |
| Decide automatic retry policy      |                   |
| Interpret serialization failure    |                   |
| Choose recovery instead of retry   |                   |
| Notify runtime-state subscribers   |                   |
| Notify future durability consumers |                   |
| Migration retry                    |                   |

---

# Explicit Non-Goals

Task 1.28 shall not:

* add retry APIs;
* add automatic retry;
* modify persistence helpers;
* modify mutation results;
* modify retained durability status;
* add desired-condition metadata;
* add a durability subscription;
* alter `DayFrameState`;
* change state subscribers;
* change notification behavior;
* change UI feedback;
* add retry buttons;
* add recovery UX;
* normalize storage-accessor exceptions;
* change clear behavior;
* change profile behavior;
* change backup behavior;
* add migration markers;
* change durable schemas;
* change storage keys;
* increment versions;
* change validators;
* change normalizers;
* remove compatibility readers;
* add telemetry;
* introduce a persistence service;
* resolve unrelated Phase 1 findings.

This task is investigation and contract definition only.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.24 — Make Durable-Write Outcomes Observable at the Persistence-Helper Boundary;
* Task 1.25 — Establish Store-Level Durability Outcome Semantics;
* Task 1.26 — Expose Persistence Outcomes Through Store Mutation Results;
* Task 1.27 — Retain Store-Level Durability Status Outside `DayFrameState`.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

---

# Evidence Standards

Distinguish:

* **Confirmed** — current executable behavior;
* **Adopted** — existing binding architecture;
* **Recommended** — Task 1.28 retry contract;
* **Deferred** — implementation or UI decisions intentionally postponed;
* **Unresolved** — evidence insufficient.

Do not present future retry semantics as current behavior.

Do not assume retry means “re-run the user's last action.”

Do not assume current retained status is sufficient for clear retry.

Do not choose a generic abstraction merely because two surfaces both use localStorage.

---

# Investigation Requirements

Inspect enough current executable code and tests to verify:

* exact current full-snapshot authored persistence input;
* exact profile persistence input;
* clear's two-removal behavior;
* current retained durability representation;
* whether clear intent is recoverable from current runtime state;
* current store APIs and caller patterns;
* state notification behavior;
* whether state can change between failure and retry;
* profile-load and backup-import source behavior;
* storage accessor behavior;
* Task 1.24 outcome categories.

Do not repeat Task 1.23's entire failure audit unnecessarily.

---

# ADR Alignment Requirements

Evaluate the recommended retry model against:

* session-first runtime authority;
* user-data preservation;
* non-destructive behavior;
* deterministic store ownership;
* explicit persistence observability;
* retryability;
* recovery separation;
* migration-evidence separation;
* epistemic integrity.

A retry model that can overwrite newer runtime intent with a historical failed snapshot should be treated with particular skepticism.

---

# Validation Requirements

This task changes documentation only.

Run targeted tests where useful to validate assumptions.

At minimum consider current:

```text
dayFrameStore tests
profile tests
backup tests
```

Run the repository-standard validation sequence if current workflow requires:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Confirm:

* no production files changed;
* no test files changed;
* Task 1.28 specification remained unchanged;
* result artifact is separate;
* Task 1.27 retained status remains unchanged;
* no retry API was introduced;
* existing test baseline remains intact.

---

# Documentation Rules

During Task 1.28:

## Create

* `TASK_1.28_ESTABLISH_STORE_OWNED_DURABILITY_RETRY_SEMANTICS_AND_AUTHORITY_RESULT.md`

## Preserve

* Task 1.28 specification;
* Tasks 1.23–1.27 results;
* durable-data ADR;
* current architecture checkpoint;
* historical governance artifacts.

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

The Task 1.28 result should contain:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Current Retry Capability
5. Retryable Surfaces
6. Candidate Retry Models
7. Retry Decision Matrix
8. Recommended Retry Contract
9. Active-State Retry Source
10. Profile Retry Source
11. Desired Durable Condition
12. Retry Versus Incidental Convergence
13. Retry Result Contract
14. Retry From `unknown`
15. Retry From `durable`
16. Storage-Unavailable Retry
17. Storage-Failure Retry
18. Serialization-Failure Retry
19. Storage-Accessor Exception
20. Retry Initiation Authority
21. Retry Execution Authority
22. Retry API Shape Recommendation
23. State-Subscriber Semantics
24. Durability-Subscription Determination
25. Active Retry Semantics
26. Profile Retry Semantics
27. Clear Retry Semantics
28. Clear Intent Sufficiency
29. Profile-Load Recovery Context
30. Backup-Import Recovery Context
31. Retry After Subsequent Runtime Changes
32. Retry Idempotence
33. Status Transition Matrix
34. Recovery Versus Retry
35. Migration Retry Separation
36. Ownership Map
37. ADR Alignment
38. Implementation Consequences
39. Unresolved Questions
40. Deviations
41. Discoveries and Deferred Work
42. Recommended Next Task
43. Validation
44. Final Completion Determination

---

# Expected Architectural Result

A likely—but not pre-authorized—result may look like:

```text
CURRENT RUNTIME INTENT
        ↓
store determines current desired durable condition
        ↓
explicit retry
        ↓
one persistence/removal attempt
        ↓
exact persistence outcome
        ↓
retained durability status updated
        ↓
retry result returned
```

For ordinary active/profile state:

```text
desired durable condition
    = current complete snapshot
```

For clear:

```text
desired durable condition
    = absence
```

The investigation must determine whether that conceptual distinction requires additional retained metadata.

---

# Expected Follow-Up

If Task 1.28 determines that current retained status is sufficient for ordinary snapshot retry but insufficient for failed clear intent, the next implementation sequence may need to be staged.

For example:

```text
Task 1.28
retry contract
        ↓
Task 1.29
smallest missing durable-intent representation, if required
        ↓
Task 1.30
store-owned retry implementation
        ↓
later
durability workflow feedback/recovery
```

Alternatively, if no additional intent representation is required:

```text
Task 1.28
retry contract
        ↓
Task 1.29
bounded store-owned retry implementation
```

Do not prejudge which sequence is necessary.

---

# Completion Criteria

Task 1.28 is complete when:

* retry is explicitly distinguished from incidental later convergence;
* the authoritative retry source for active state is determined;
* the authoritative retry source for profiles is determined;
* original-failed-mutation replay is evaluated;
* current-snapshot retry is evaluated;
* desired-durable-condition retry is evaluated;
* retry after subsequent runtime edits is defined;
* retry from `unknown` is defined;
* retry from `durable` is defined;
* storage-unavailable retry semantics are defined;
* storage-failure retry semantics are defined;
* serialization-failure retry semantics are defined;
* storage-accessor exception treatment is classified;
* retry initiation authority is assigned;
* retry execution authority is assigned;
* retry result semantics are defined;
* retained status transitions are defined;
* state-subscriber behavior during retry is defined;
* durability-subscription implications are assessed;
* active retry is defined;
* profile retry is defined;
* clear retry is defined;
* the adequacy of current retained status for clear retry is explicitly determined;
* profile-load source recovery is distinguished from retry input;
* backup-import source recovery is distinguished from retry input;
* retry idempotence is defined;
* recovery is distinguished from retry;
* migration retry remains separately governed;
* the recommended contract aligns with the durable-data ADR;
* the smallest implementation seam is identified;
* no executable behavior changes;
* required validation passes;
* the result artifact is sufficient to derive the next bounded implementation task.

---

# Task Determination

Task 1.28 is a store-level durability retry investigation and architectural contract decision.

It does not implement retry.

Its purpose is to determine what retry means under DayFrame's session-first runtime model, which current representation or desired durable condition is authoritative as retry input, how active/profile/clear retry differ, who owns retry execution and initiation, and how retry changes retained durability knowledge without confusing durability with domain state or migration evidence.

**The task is complete when DayFrame has an evidence-backed retry contract defining what each durable surface retries, who initiates and executes retry, how retained durability status changes, what subscribers may observe, which failures are retryable, how clear differs from ordinary persistence, and what smallest implementation seam should enact retry without yet changing executable behavior.**
