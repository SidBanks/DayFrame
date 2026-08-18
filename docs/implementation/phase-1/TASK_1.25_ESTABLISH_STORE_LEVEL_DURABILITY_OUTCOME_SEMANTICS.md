# Implementation Task 1.25 — Establish Store-Level Durability Outcome Semantics

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.25

**Task Name:** Establish Store-Level Durability Outcome Semantics

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation / Architectural Contract Decision

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning investigation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.25_ESTABLISH_STORE_LEVEL_DURABILITY_OUTCOME_SEMANTICS_RESULT.md`

The result artifact should document:

* investigation completed;
* Task 1.24 persistence outcomes reviewed;
* current store mutation contracts mapped;
* candidate durability models evaluated;
* authoritative runtime/durable-state semantics determined;
* mutation-result semantics determined;
* subscriber responsibility determined;
* retry/recovery authority determined;
* clear aggregation semantics determined;
* profile-load recovery semantics determined;
* backup-import recovery semantics determined;
* storage-accessor exception treatment determined;
* ADR alignment assessed;
* recommended store-level durability contract;
* implementation consequences identified;
* unresolved questions, if any;
* validation performed;
* deviations;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

This task does **not** authorize production behavior changes.

Do not modify production code, tests, store result types, subscriber state, UI feedback, retry behavior, rollback behavior, persistence formats, storage keys, migrations, recovery UX, or compatibility readers during this task.

If executable evidence cannot determine a policy question uniquely, evaluate bounded alternatives and make an explicit architectural recommendation rather than silently embedding a behavioral assumption.

---

# Pre-Execution Artifact Integrity Check

Before beginning execution, verify that this saved task artifact contains:

* this title and task metadata;
* Execution Artifact Rules;
* Purpose;
* Governing Evidence;
* Architectural Problem;
* Required Questions;
* Candidate Durability Models;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame has an evidence-backed store-level contract defining what a mutation means when runtime transition succeeds but durable persistence does not, who owns that outcome, what subscribers and workflows may rely upon, how clear and recoverable-source operations differ, and what implementation seam should enact the contract without yet changing executable behavior.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Define the store-level semantic contract for runtime mutations whose durable persistence does not succeed.

Task 1.23 established that DayFrame currently allows runtime and durable state to diverge silently.

Task 1.24 then made persistence outcomes explicitly observable at the helper boundary without changing caller behavior.

The current architecture is therefore intentionally transitional:

```text
runtime mutation
    ↓
persistence helper
    ↓
explicit persistence outcome
    ↓
outcome ignored
    ↓
notify
```

The implementation can now answer:

> Did the persistence attempt succeed?

It cannot yet answer:

> What does that result mean for the mutation?

Task 1.25 defines that meaning before any store, subscriber, workflow, retry, or recovery behavior is changed.

---

# Governing Evidence

Task 1.23 established:

* ordinary authored/profile writes mutate runtime state before persistence;
* caught persistence failures leave runtime state advanced;
* subscribers observe the new runtime state;
* UI workflows generally assume normal store return means success;
* reload restores the prior durable state;
* later successful full-state writes may converge the runtime-only change;
* clear spans two independent durable removals and can partially succeed;
* profile load retains a durable source profile even when active-state persistence fails;
* backup import retains the external source file when active-state persistence fails;
* storage accessor exceptions currently behave differently from caught write failures.

Task 1.24 established explicit helper outcomes:

```text
PersistenceWriteOutcome
    persisted
    unavailable
    serializationFailure
    storageFailure

PersistenceRemovalOutcome
    removed
    unavailable
    storageFailure
```

Those outcomes are factual helper observations only.

Existing callers ignore them.

Task 1.24 deliberately did not determine:

* rollback;
* runtime continuation;
* dirty/pending state;
* mutation return semantics;
* subscriber durability knowledge;
* retry;
* recovery;
* clear aggregation;
* workflow feedback.

Task 1.25 resolves that architectural contract.

---

# Governing ADR

The accepted:

`ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

establishes that durable authored data is user data.

It requires durable-data operations and migrations to be:

* explicit about failure;
* non-destructive;
* recovery-safe;
* observable;
* retryable where appropriate;
* unable to treat failed persistence as successful migration.

It also establishes that:

> In-memory normalization is not completed migration.

and:

> A failed durable write must not destroy the last known recoverable representation.

The ADR does not prescribe whether ordinary runtime mutations must roll back on persistence failure.

Task 1.25 must determine that store-level behavior rather than pretending the ADR already chose it.

---

# Architectural Problem

DayFrame currently has two potentially different authorities after a failed write:

```text
CURRENT SESSION
    new runtime state

DURABLE STORAGE
    prior persisted state
```

The existing store does not represent that distinction.

The architectural question is:

> After a valid runtime mutation succeeds but persistence does not, what state is authoritative, what outcome does the store expose, and which layer owns reconciliation?

This question must be answered separately from:

* how the UI phrases the failure;
* when retry occurs;
* how migrations are tracked;
* how recovery controls look.

---

# Objective

Determine a store-level durability contract covering:

1. ordinary authored mutations;
2. atomic Setup commit;
3. manual-event mutations;
4. profile save;
5. profile delete;
6. profile load → active-state persistence;
7. backup import → active-state persistence;
8. two-key clear;
9. storage unavailability;
10. storage-accessor exceptions;
11. subscriber semantics;
12. mutation result semantics;
13. retry and recovery ownership.

The result should be precise enough to authorize a bounded implementation task without reopening the broad persistence investigation.

---

# Required Questions

## 1. Meaning of a Store Mutation

Determine whether a successful store mutation should mean:

### A. Runtime transition only

The store operation succeeds when in-memory state changes, regardless of durability.

Persistence is a separate outcome.

### B. Runtime + durable transition

The store operation succeeds only when both runtime mutation and durable write succeed.

### C. Two-dimensional result

The operation reports both:

```text
runtime transition outcome
durability outcome
```

without collapsing them into one success/failure flag.

### D. Another evidence-supported contract

Evaluate actual store responsibilities before choosing.

The result must explicitly define the meaning of "mutation succeeded."

---

## 2. Runtime Authority After Persistence Failure

Determine what runtime state should do when persistence fails.

Evaluate at minimum:

### Model A — Roll Back Runtime

```text
runtime mutation
    ↓
persistence failure
    ↓
restore previous runtime state
```

### Model B — Continue Runtime as Session-Only State

```text
runtime mutation
    ↓
persistence failure
    ↓
new runtime state remains authoritative for current session
```

### Model C — Continue Runtime and Mark Non-Durable/Pending

```text
runtime mutation
    ↓
persistence failure
    ↓
runtime state remains
    +
explicit durability state
```

### Model D — Workflow Decides

The store exposes the result and the calling workflow chooses rollback/continuation.

### Model E — Other

Recommend one only after evaluating:

* deterministic ownership;
* user expectations;
* data loss risk;
* existing store architecture;
* reload behavior;
* retryability;
* complexity;
* ADR requirements.

---

## 3. Is Durability Part of `DayFrameState`?

Determine whether durability status belongs inside:

```text
DayFrameState
```

or whether it is:

* operation result metadata;
* store-level non-domain state;
* workflow state;
* another boundary.

Do not assume every observable architectural fact belongs in application state.

Evaluate whether adding durability fields to `DayFrameState` would incorrectly mix:

```text
authored/domain state
```

with:

```text
storage transport status
```

---

## 4. Mutation Return Contract

Determine what mutations that persist authored state should eventually return.

Potential forms include:

```text
DayFrameState
```

current behavior;

```text
{
  state,
  persistence
}
```

or:

```text
{
  runtimeStatus,
  durabilityStatus,
  state
}
```

or another narrow result.

Determine whether all mutations need the same result shape.

Do not design a generalized command framework unless current callers justify it.

---

## 5. Narrow Setters

Determine whether field-level setters should share the same durability contract as:

```text
commitAuthoredSetup
```

or whether their current internal/testing role makes a different surface appropriate.

Preserve one authoritative conceptual model where possible.

---

## 6. Atomic Setup Commit

Task 1.2 made Setup save one atomic in-memory transition.

Determine the intended durable meaning of:

```text
commitAuthoredSetup
```

when persistence fails.

Explicitly decide whether:

* runtime should remain changed;
* runtime should roll back;
* result should identify runtime-success/durable-failure;
* subscribers should receive the new state;
* workflow should be responsible for retry/recovery.

Do not change behavior.

---

## 7. Manual Events

Determine whether manual-event mutation should follow the ordinary authored-state contract.

Consider the fact that Preview regeneration can amplify runtime-only success visually.

Do not solve manual-event command ownership beyond what durability semantics require.

---

## 8. Profile Save

Profile save creates reusable durable user-authored data.

Determine whether a profile that exists only in runtime after persistence failure should:

* remain visible;
* roll back;
* remain visible but explicitly non-durable;
* be represented only through a failed operation result.

Evaluate against the ADR's stronger profile guarantee.

---

## 9. Profile Delete

Deletion differs from save because old durable data remains available when deletion persistence fails.

Determine whether runtime deletion should:

* remain;
* roll back;
* be represented as pending;
* be surfaced as runtime-success/durable-failure.

Avoid assuming save and delete must share identical recovery semantics merely because they use the same persistence helper.

---

## 10. Profile Load

Profile load has two distinct durable authorities:

```text
source profile
    ↓
active authored runtime
    ↓
active authored persistence
```

Determine what a failed active-state write means when the source profile remains available.

Consider:

* whether load should still count as successful for the session;
* whether active-state durability failure must be exposed separately;
* whether source-profile recoverability affects rollback policy.

---

## 11. Backup Import

Backup import similarly has an external recovery source:

```text
external backup
    ↓
validated normalized data
    ↓
runtime active state
    ↓
active persistence
```

Determine whether import should distinguish:

* backup validation success;
* runtime replacement success;
* active durability success.

The result should not imply that a preserved external source makes hidden durability failure acceptable.

---

## 12. Clear Local Data

Clear must be treated separately because it spans two durable keys:

```text
active state removal
profile removal
```

Task 1.23 established independent partial failure.

Determine the required aggregate result contract.

Evaluate states such as:

```text
both removed
active removed / profiles failed
active failed / profiles removed
both failed
storage unavailable
```

Determine whether runtime should remain fully reset when durable clear is partial.

Do not implement transactions.

---

## 13. Storage Unavailable

Task 1.24 now distinguishes:

```text
unavailable
```

from successful persistence.

Determine whether storage-unavailable should semantically equal:

* persistence failure;
* intentionally session-only mode;
* a distinct durability mode;
* another contract.

Do not infer that unavailable storage is necessarily exceptional if DayFrame intends to remain usable without persistence.

---

## 14. Storage Accessor Exception

Task 1.24 deliberately left:

```text
globalThis.localStorage access throws
```

outside the helper result because absorbing it would change current notification semantics.

Determine the future contract.

Should accessor failure:

* become `storageFailure`;
* remain exceptional;
* prevent runtime mutation;
* allow runtime session-only continuation?

This task may recommend alignment but must not implement it.

---

## 15. Serialization Failure

Determine whether serialization failure should be treated differently from storage failure at the store contract.

A serialization failure may indicate:

* unsupported runtime state;
* programmer/data-integrity fault;
* ordinary durability failure.

Evaluate whether callers need to distinguish it.

Do not reduce all failure categories to one boolean without justification.

---

## 16. Subscribers

Determine what subscribers are entitled to assume about a published store snapshot.

Potential contracts:

### Contract A

Subscriber snapshot means current runtime truth only.

### Contract B

Subscriber snapshot means durably accepted state.

### Contract C

Snapshot is runtime truth plus separate durability status.

### Contract D

Another model.

This decision is central.

Task 1.23 established that subscribers currently receive runtime truth irrespective of caught durable failure.

Do not change subscription behavior in this task.

---

## 17. UI / Workflow Responsibility

Determine the proper division:

```text
persistence helper
    → factual storage outcome

store
    → state/durability semantic outcome

workflow/UI
    → user messaging + recovery choice
```

Confirm or modify this proposed ownership.

Determine what the UI should **not** decide.

For example, UI should probably not infer durability by inspecting browser storage directly.

---

## 18. Retry Authority

Determine whether retry belongs to:

* persistence helper;
* store;
* workflow;
* migration subsystem;
* user action;
* another layer.

Distinguish ordinary persistence retry from migration retry.

Do not implement retries.

---

## 19. Recovery Authority

Determine whether recovery policy belongs primarily to:

* store;
* workflow;
* durable-data subsystem;
* user-facing recovery flow.

Separate:

```text
knowing persistence failed
```

from:

```text
choosing how to recover
```

---

## 20. Last-Known-Recoverable Authority

Determine whether the old durable value remains:

* authoritative;
* fallback;
* recovery source;
* superseded but still persisted.

Use precise terminology.

If runtime continues after failure, determine whether DayFrame conceptually has:

```text
current runtime authority
+
last known durable checkpoint
```

rather than competing authorities.

---

## 21. Reload Semantics

If runtime continuation is recommended, define what reload means after unresolved persistence failure.

Possible interpretations:

* implicit rollback to last durable checkpoint;
* loss of session-only state;
* recoverable pending operation;
* another behavior.

Determine whether the architecture requires preserving pending runtime state across reload—which would itself require durability and may be circular.

---

## 22. Later Successful Write

Task 1.23 established that later successful full-state writes can converge earlier runtime-only changes.

Determine whether this should be:

* intentional retry/convergence behavior;
* incidental current behavior;
* prohibited until explicit retry;
* another model.

Do not infer migration completion from ordinary later persistence.

---

## 23. Migration Interaction

Determine how the ordinary mutation durability contract constrains future migration work.

The result should explicitly state:

* whether migration may reuse ordinary persistence outcomes;
* what additional migration evidence remains required;
* why ordinary mutation success does not equal population migration.

Do not design migration markers yet.

---

## 24. Failure Classification Exposure

Determine which helper outcome categories must survive into the store-level result.

Potential categories:

```text
persisted
unavailable
serializationFailure
storageFailure
```

Evaluate whether the store should:

* preserve all categories;
* collapse some into broader durability failure;
* expose category plus higher-level semantic classification.

The store contract should not leak meaningless transport detail, but should retain distinctions needed for correct recovery.

---

# Candidate Durability Models

The result must explicitly evaluate at least these models.

## Model A — Transactional Rollback

Persistence failure restores previous runtime state.

### Benefits to evaluate

* runtime/durable consistency;
* simple subscriber assumption;
* save really means durable acceptance.

### Costs to evaluate

* user work may disappear immediately;
* difficult rollback for derived/UI context;
* source recovery differences;
* potentially poor no-storage behavior;
* store needs previous-state restoration semantics.

---

## Model B — Session-First Continuation

Runtime state remains current even when persistence fails.

Persistence outcome is returned to callers.

### Benefits

* user can continue working;
* current behavior largely preserved;
* later retry/convergence possible.

### Costs

* reload loses changes;
* subscribers cannot assume durability;
* workflow must communicate risk;
* retry authority becomes important.

---

## Model C — Explicit Pending/Non-Durable Runtime State

Runtime continues but store explicitly tracks durability status.

### Benefits

* state divergence becomes visible;
* subscribers can reason about durability;
* retry state can be represented.

### Costs

* persistence metadata enters state architecture;
* more transitions;
* risk of mixing domain and infrastructure state;
* additional UI/state complexity.

---

## Model D — Operation-Result-Only Durability

Runtime remains current.

Store returns an explicit durability result, but persistence status is not stored globally.

### Benefits

* narrow architecture;
* no infrastructure status in domain state;
* workflows can respond immediately.

### Costs

* later subscribers cannot know durability status;
* failed state may remain active after workflow context disappears;
* retry/recovery continuity may be weak.

---

## Model E — Workflow-Controlled Commit

Store prepares/validates change, workflow decides whether to keep it after persistence result.

Evaluate whether this conflicts with current store ownership and would reintroduce UI coordination that Phase 1 has been removing.

---

# Required Decision Matrix

Produce:

| Model                              | Runtime/Durable Consistency | User Work Preservation | Subscriber Simplicity | Retryability | Architectural Complexity | ADR Alignment | Recommendation |
| ---------------------------------- | --------------------------- | ---------------------- | --------------------- | ------------ | ------------------------ | ------------- | -------------- |
| Transactional rollback             |                             |                        |                       |              |                          |               |                |
| Session-first continuation         |                             |                        |                       |              |                          |               |                |
| Explicit pending/non-durable state |                             |                        |                       |              |                          |               |                |
| Operation-result-only durability   |                             |                        |                       |              |                          |               |                |
| Workflow-controlled commit         |                             |                        |                       |              |                          |               |                |

Add any evidence-supported model discovered during investigation.

---

# Required Operation Semantics Matrix

Produce:

| Operation              | Runtime Authority After Failure | Durable Authority/Recovery Source | Recommended Result Contract | Subscriber Semantics | Retry Owner | Recovery Owner |
| ---------------------- | ------------------------------- | --------------------------------- | --------------------------- | -------------------- | ----------- | -------------- |
| Setup commit           |                                 |                                   |                             |                      |             |                |
| Narrow authored setter |                                 |                                   |                             |                      |             |                |
| Manual event mutation  |                                 |                                   |                             |                      |             |                |
| Profile save           |                                 |                                   |                             |                      |             |                |
| Profile delete         |                                 |                                   |                             |                      |             |                |
| Profile load           |                                 |                                   |                             |                      |             |                |
| Backup import          |                                 |                                   |                             |                      |             |                |
| Clear local data       |                                 |                                   |                             |                      |             |                |

---

# Required Clear Matrix

Explicitly define recommended semantics for:

| Active Removal | Profile Removal | Runtime Clear State | Overall Durable Result | Recommended Meaning |
| -------------- | --------------- | ------------------- | ---------------------- | ------------------- |
| success        | success         |                     |                        |                     |
| success        | failure         |                     |                        |                     |
| failure        | success         |                     |                        |                     |
| failure        | failure         |                     |                        |                     |
| unavailable    | unavailable     |                     |                        |                     |

Include mixed unavailable/failure cases if semantically distinct.

---

# Required Subscriber Contract

The result must contain one concise normative statement answering:

> **What does receipt of a DayFrame store snapshot guarantee about durability?**

This statement will govern future implementation and testing.

---

# Required Store Mutation Contract

The result must contain one concise normative statement answering:

> **What does a successful authored store mutation guarantee, and how is durable persistence represented?**

Do not leave the term “success” ambiguous.

---

# Required Ownership Map

Produce:

| Responsibility                                  | Recommended Owner |
| ----------------------------------------------- | ----------------- |
| Observe browser persistence result              |                   |
| Interpret mutation durability                   |                   |
| Preserve runtime/domain authority               |                   |
| Expose mutation result                          |                   |
| Decide user message                             |                   |
| Initiate ordinary retry                         |                   |
| Perform migration retry                         |                   |
| Choose recovery path                            |                   |
| Aggregate clear result                          |                   |
| Preserve source profile/backup recovery context |                   |

---

# Explicit Non-Goals

Task 1.25 shall not:

* modify persistence helper results;
* modify store mutation signatures;
* modify store state;
* add durability metadata;
* change subscriber snapshots;
* change subscriber ordering;
* add rollback;
* add retry;
* add pending/dirty state;
* change Setup save behavior;
* change manual-event behavior;
* change profile behavior;
* change backup behavior;
* change clear behavior;
* change UI feedback;
* add recovery UX;
* add migration markers;
* change storage keys;
* change durable schemas;
* change versions;
* change validators;
* change normalizers;
* remove compatibility readers;
* introduce a persistence service;
* redesign `DayFrameApp`;
* resolve unrelated Phase 1 findings.

This task is architectural contract definition only.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.23 — Establish Persistence-Failure Authority and Durable-Write Failure Boundaries;
* Task 1.24 — Make Durable-Write Outcomes Observable at the Persistence-Helper Boundary.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

Task 1.23 supplies current failure semantics.

Task 1.24 supplies explicit helper observations.

Task 1.25 defines how those observations become store semantics.

---

# Evidence Standards

Distinguish:

* **Confirmed** — current executable behavior;
* **Adopted** — existing binding ADR policy;
* **Recommended** — Task 1.25 proposed store contract;
* **Deferred** — implementation or UX detail not decided here;
* **Unresolved** — evidence insufficient.

Do not describe recommended semantics as current behavior.

Do not treat preservation of current behavior as inherently preferable if it conflicts with adopted architecture.

Do not choose greater complexity merely because it could represent more states.

Prefer the smallest contract that preserves:

* user data;
* deterministic authority;
* recovery;
* observability;
* architectural coherence.

---

# Investigation Requirements

Inspect enough current production and tests to verify:

* current store mutation return forms;
* subscription contract;
* current store state shape;
* caller expectations;
* whether any caller requires `DayFrameState` specifically;
* profile and backup source recovery behavior;
* clear semantics;
* Task 1.24 helper-result accessibility;
* storage accessor behavior;
* current no-storage behavior.

This task does not need to repeat Task 1.23's entire persistence inventory.

Use Task 1.23 as established evidence unless current code contradicts it.

---

# ADR Alignment Requirements

Assess the recommended store contract against:

* explicit failure observability;
* non-destructive behavior;
* last-known recoverable preservation;
* retryability;
* deterministic state ownership;
* migration evidence separation;
* recovery proportional to durable surface.

The result should explain why the chosen contract satisfies the ADR better than rejected models.

---

# Validation Requirements

This task is investigation/decision only.

Do not modify production code or tests.

Run targeted tests where useful to confirm existing baseline assumptions.

Run the repository-standard validation sequence if required:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Confirm:

* no production file changed;
* no test file changed;
* Task 1.25 artifact remained immutable;
* result artifact is separate;
* Task 1.24 outcomes remain unchanged;
* existing test baseline remains intact.

---

# Documentation Rules

During Task 1.25:

## Create

* `TASK_1.25_ESTABLISH_STORE_LEVEL_DURABILITY_OUTCOME_SEMANTICS_RESULT.md`

## Preserve

* Task 1.25 specification;
* Task 1.24 result;
* Task 1.23 result;
* durable-data ADR;
* current checkpoint;
* historical task/result artifacts.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* durable-data ADR;
* Session Checkpoint.

Those require project review of the Task 1.25 determination first.

Do not create a task-specific checkpoint.

---

# Required Result Artifact Structure

The result artifact should contain:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Current Store Contract
5. Candidate Durability Models
6. Decision Matrix
7. Recommended Store-Level Durability Contract
8. Runtime Authority After Failure
9. Durable Checkpoint / Recovery-Source Semantics
10. Mutation Result Semantics
11. Subscriber Contract
12. Persistence Outcome Classification
13. Setup Commit Semantics
14. Narrow Setter Semantics
15. Manual-Event Semantics
16. Profile Save Semantics
17. Profile Delete Semantics
18. Profile Load Semantics
19. Backup Import Semantics
20. Clear Aggregation Semantics
21. Storage-Unavailable Semantics
22. Storage-Accessor Exception Semantics
23. Serialization-Failure Semantics
24. Retry Authority
25. Recovery Authority
26. Migration Interaction
27. Ownership Map
28. ADR Alignment
29. Implementation Consequences
30. Unresolved Questions
31. Deviations
32. Discoveries and Deferred Work
33. Recommended Next Task
34. Validation
35. Final Completion Determination

---

# Completion Criteria

Task 1.25 is complete when:

* the meaning of a store mutation is explicit;
* runtime authority after persistence failure is explicitly decided;
* durable storage after failure is classified precisely;
* rollback versus continuation versus pending-state models are evaluated;
* the role of `DayFrameState` in durability tracking is decided;
* mutation result semantics are defined;
* subscriber durability guarantees are defined;
* Setup commit behavior is defined;
* manual-event behavior is classified;
* profile save/delete/load durability semantics are defined;
* backup-import durability semantics are defined;
* clear aggregation semantics are defined;
* storage-unavailable semantics are defined;
* storage-accessor exception semantics are defined;
* serialization failure treatment is defined;
* ordinary retry authority is assigned;
* recovery authority is assigned;
* migration interaction is defined;
* the recommended contract aligns with the durable-data ADR;
* implementation consequences are dependency-ordered;
* no executable behavior changes;
* required validation passes;
* the result is sufficient to derive a bounded implementation task.

---

# Expected Outcome

Task 1.25 should transform:

```text
persistence outcome exists
        ↓
nobody interprets it
```

into:

```text
persistence outcome exists
        ↓
store-level semantic contract
        ↓
workflow receives authoritative result
        ↓
future feedback/retry/recovery behavior can be derived
```

The goal is not necessarily to make runtime and durable state identical at every moment.

The goal is to make their relationship explicit, deterministic, and recoverable.

A valid architectural result might conclude:

```text
runtime state remains authoritative for the current session
durable storage is the last durable checkpoint
mutation result reports durability separately
subscribers observe runtime truth
workflow owns immediate user communication/retry
```

or it may conclude that rollback or tracked non-durable state is necessary.

The task must derive the answer rather than assuming it.

---

# Expected Follow-Up

If Task 1.25 produces a clear contract, the next task should implement only the smallest store-level portion of that decision.

Possible future sequencing may resemble:

```text
helper outcomes
    ↓
store mutation durability result
    ↓
clear aggregate result
    ↓
workflow feedback/retry alignment
    ↓
migration-specific observability
```

But Task 1.25 must derive the actual dependency order.

Do not jump directly from this decision to broad UI refactoring.

---

# Task Determination

Task 1.25 is a store-level durability-contract investigation and decision.

It does not alter runtime, persistence, subscriber, or user-visible behavior.

It determines how DayFrame interprets the persistence outcomes established by Task 1.24, what authoritative state means when durability fails, what a store mutation guarantees, what subscribers may assume, and which layers own retry and recovery.

**The task is complete when DayFrame has an evidence-backed store-level contract defining what a mutation means when runtime transition succeeds but durable persistence does not, who owns that outcome, what subscribers and workflows may rely upon, how clear and recoverable-source operations differ, and what implementation seam should enact the contract without yet changing executable behavior.**
