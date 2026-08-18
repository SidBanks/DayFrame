# Implementation Task 1.26 — Expose Persistence Outcomes Through Store Mutation Results

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.26

**Task Name:** Expose Persistence Outcomes Through Store Mutation Results

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.26_EXPOSE_PERSISTENCE_OUTCOMES_THROUGH_STORE_MUTATION_RESULTS_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* store result types introduced;
* mutation signatures changed;
* helper outcomes captured;
* clear aggregation implemented;
* caller updates required for type compatibility;
* runtime semantics preserved;
* subscriber semantics preserved;
* UI semantics preserved;
* tests added or updated;
* validation performed and results;
* deviations from authorized scope, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires adding retained durability status, retry behavior, rollback, subscriber durability metadata, UI feedback changes, recovery UX, migration state, schema changes, version changes, or a new persistence abstraction, stop the affected work and record the discrepancy rather than expanding Task 1.26.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Governing Evidence;
* Authorized Implementation;
* Required Result Contracts;
* Operation-Specific Requirements;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when store mutations that perform durable writes return the runtime state together with the exact persistence outcome, clear returns both removal outcomes plus its aggregate classification, all existing runtime/subscriber/UI behavior remains unchanged, and the new store-level durability contract is directly protected by tests.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Expose Task 1.24's factual persistence outcomes through the store mutation APIs that perform durable writes.

Task 1.24 established explicit helper results:

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

Task 1.25 then adopted the store-level semantic contract:

> A successful authored store mutation guarantees that the requested runtime transition was applied and published. Durable persistence is guaranteed only when the mutation result reports `persisted`, or the relevant removal outcome reports `removed`.

Task 1.25 further established that subscribers continue to represent runtime truth only and that durability must be exposed separately through mutation results and, later, retained store status where required.

Task 1.26 implements only the **operation-result portion** of that contract.

---

# Governing Architectural Contract

The adopted store contract is:

```text
valid mutation
    ↓
runtime transition applied
    ↓
persistence attempt
    ↓
exact persistence outcome captured
    ↓
runtime snapshot published
    ↓
store returns
    {
        state,
        persistence
    }
```

For clear:

```text
runtime clear
    ↓
active removal attempt
    ↓
profile removal attempt
    ↓
notify once
    ↓
return exact outcomes
        +
aggregate clear classification
```

The current session-first runtime authority remains unchanged.

A returned mutation result means the runtime transition succeeded.

Persistence is a separate dimension.

---

# Objective

Introduce executable store result contracts that:

1. preserve the existing runtime transition;
2. capture the existing persistence-helper outcome;
3. return the current runtime snapshot alongside that outcome;
4. preserve one subscriber notification with the same snapshot;
5. preserve all current UI/workflow behavior;
6. preserve existing persistence order;
7. implement clear's two-key aggregate result;
8. establish tests protecting the new store contract.

Do not yet retain durability status across operations.

Do not yet make workflows react to results.

---

# Authorized Implementation

Task 1.26 may:

* introduce a narrow `StoreMutationResult` or equivalent type;
* introduce a narrow `ClearLocalDataResult` or equivalent type;
* update store mutation signatures that perform one durable write;
* capture the returned `PersistenceWriteOutcome`;
* return `{ state, persistence }`;
* capture both clear removal outcomes;
* calculate clear's aggregate classification;
* return the clear result;
* mechanically update callers where required for type compatibility;
* update or add tests proving the contract.

Task 1.26 may not alter the meaning of the runtime state transition.

---

# Required Result Contracts

## Standard Persisting Mutation

The result should be implementation-equivalent to:

```ts
type StoreMutationResult = {
  state: DayFrameState;
  persistence: PersistenceWriteOutcome;
};
```

Exact naming may follow repository conventions.

A returned result means:

* validation/preconditions succeeded;
* runtime state was applied;
* the existing persistence attempt occurred;
* the persistence field reports the factual Task 1.24 result.

Do not add a redundant runtime status such as `"applied"` unless executable need proves it necessary.

---

## Clear Result

The clear result should be implementation-equivalent to:

```ts
type ClearLocalDataResult = {
  state: DayFrameState;
  activeState: PersistenceRemovalOutcome;
  profiles: PersistenceRemovalOutcome;
  durability: "cleared" | "partiallyCleared" | "notCleared";
};
```

Exact naming may follow repository conventions.

The aggregate classification must not erase the exact per-key outcomes.

---

# Clear Aggregation Rules

Implement the Task 1.25 decision exactly.

| Active Result           | Profile Result          | Aggregate          |
| ----------------------- | ----------------------- | ------------------ |
| `removed`               | `removed`               | `cleared`          |
| `removed`               | any non-removed outcome | `partiallyCleared` |
| any non-removed outcome | `removed`               | `partiallyCleared` |
| any non-removed outcome | any non-removed outcome | `notCleared`       |

`unavailable` is not success.

`storageFailure` is not success.

The result must preserve which key produced which exact outcome.

Runtime state remains fully reset regardless of aggregate durability in Task 1.26.

---

# Store Operations In Scope

At minimum inspect and update every store mutation that performs one active authored-state persistence attempt.

Based on Task 1.23 evidence, this includes:

* `commitAuthoredSetup`;
* `setSchedulingPreferences`;
* `setPreviewRange`;
* `setShiftDefinitions`;
* `setShiftCycles`;
* `setBlockTemplates`;
* `setBlockRecurrences`;
* `setManualEvents`;
* `loadProfile`;
* `importBackup`.

Profile-storage mutation operations include:

* `saveProfile`;
* `deleteProfile`.

Clear includes:

* `clearLocalData`.

Confirm this list against current executable code before implementation.

Do not assume the historical inventory is exhaustive if the code has changed.

---

# Non-Persisting Store Operations

Do not force the new result contract onto store operations that do not perform durable writes merely for API uniformity.

Examples may include:

* Preview generation;
* Preview revision;
* transient selection/context operations;
* backup-object creation;
* pure reads.

The result contract exists to express durable mutation semantics, not to create a universal command wrapper.

---

# Commit Authored Setup Requirements

`commitAuthoredSetup` must:

1. preserve one runtime authored transition;
2. preserve Preview staleness semantics;
3. call active persistence once;
4. capture the exact outcome;
5. notify subscribers once with the same runtime snapshot;
6. return `{ state, persistence }`.

Do not:

* roll back on failure;
* skip notification;
* retry;
* change persistence ordering;
* change persisted schema;
* change Setup validation;
* change timestamp behavior.

---

# Narrow Setter Requirements

Each persisting authored setter must use the same store-result semantics as `commitAuthoredSetup`.

The result should report the complete runtime snapshot plus the active persistence outcome.

Do not introduce different durability semantics simply because a setter is narrower.

---

# Manual-Event Requirements

`setManualEvents` must return the standard persisting mutation result.

Existing application behavior must remain unchanged.

The UI may continue to update editor state and regenerate Preview without reading `persistence`.

Task 1.26 must not introduce manual-event failure messaging or retry.

---

# Profile Save Requirements

`saveProfile` must return:

```text
runtime state
+
profile persistence outcome
```

The returned persistence field refers to the profile-storage write, not active authored storage.

Preserve:

* profile creation/replacement logic;
* profile IDs;
* timestamps;
* cloning;
* collection ordering;
* notification behavior;
* current UI success behavior.

Do not change the profile's runtime visibility when persistence fails.

---

# Profile Delete Requirements

`deleteProfile` must return:

```text
runtime state
+
profile persistence outcome
```

Preserve runtime deletion semantics and notification behavior.

Do not roll back a deleted runtime profile on failed persistence.

Do not introduce pending-deletion state.

---

# Profile Load Requirements

`loadProfile` must return the standard mutation result with the **active authored-state persistence outcome**.

The source profile storage itself is not being rewritten by load and must not be represented as though it were.

The result therefore means:

```text
profile selected/normalized successfully
        +
active runtime replacement applied
        +
active persistence outcome
```

Preserve:

* source profile collection;
* Preview clearing;
* runtime replacement;
* notification behavior;
* UI behavior.

---

# Backup Import Requirements

`importBackup` must return the standard mutation result with the active authored-state persistence outcome.

Do not change backup validation or parsing.

A returned result means:

* the backup data had already passed the existing validation path;
* runtime authored state was replaced;
* active-state persistence was attempted;
* persistence reports the exact helper result.

Do not change import UI messaging.

---

# Clear Requirements

`clearLocalData` must:

1. reset runtime state exactly as before;
2. call active-state removal;
3. capture active removal result;
4. call profile removal;
5. capture profile removal result;
6. notify once exactly as before;
7. return:

   * runtime state;
   * active removal outcome;
   * profile removal outcome;
   * aggregate durability.

Do not transact or reorder the two removal operations unless current behavior already permits that exact sequence.

Do not add rollback.

---

# Mutation Ordering Preservation

For normal writes preserve:

```text
runtime assignment
    ↓
persistence attempt
    ↓
capture outcome
    ↓
notify once
    ↓
return result
```

Do not change to:

```text
persist first
```

or:

```text
notify before persistence
```

or any transactional variation.

For clear, preserve the existing runtime-reset and two-removal ordering unless current executable evidence differs.

---

# Subscriber Contract Preservation

Existing subscribers must continue receiving only `DayFrameState`.

They must not receive:

* persistence outcome;
* durability status;
* retry state;
* dirty/pending metadata.

The same runtime snapshot should be published under the same mutation conditions as before.

Task 1.26 changes return values, not subscriber payloads.

---

# UI / Workflow Preservation

Current workflows may require mechanical adjustments because a mutation no longer returns `DayFrameState` directly.

Where current callers depend upon the returned state, update them to use:

```text
result.state
```

while deliberately ignoring:

```text
result.persistence
```

Do not branch on persistence outcome.

Do not change:

* Setup save confirmation;
* profile save/delete/load confirmation;
* manual-event behavior;
* backup import success;
* clear success;
* error messages;
* navigation;
* Preview generation;
* retry/recovery behavior.

This task may therefore preserve known false-success UI semantics temporarily.

That is intentional sequencing.

---

# Caller Audit Requirement

Before implementation, identify all direct callers of every affected store mutation.

After implementation, verify:

* all compile;
* callers that require runtime state now read `.state`;
* callers that never used the return value remain behaviorally unchanged;
* no caller branches on `.persistence`;
* no UI displays `.persistence`;
* no caller retries based on `.persistence`.

Record any unexpected caller.

---

# Store Interface Requirements

Update the `DayFrameStore` interface or equivalent public store contract to reflect the new result types.

Do not leave implementation return values broader than the declared interface.

Do not create an overload retaining the old return type solely for compatibility unless a supported caller actually requires it.

This task intentionally changes the store API contract for persisting mutations.

---

# Persistence Outcome Preservation

Do not collapse Task 1.24 outcomes.

The store result must preserve:

```text
persisted
unavailable
serializationFailure
storageFailure
```

for writes.

For removals preserve:

```text
removed
unavailable
storageFailure
```

The store may not map every non-success to:

```text
failed
```

because Task 1.25 determined the underlying category remains relevant to later recovery semantics.

---

# Storage Accessor Exception

Task 1.25 recommended that future implementation normalize storage-accessor exceptions into `storageFailure`, but also placed that after the initial mutation-result seam.

Task 1.26 therefore must **not broaden scope merely to catch accessor exceptions** unless the current Task 1.24 helper contract already returns them as outcomes.

Preserve current accessor-exception behavior.

Record it as deferred.

A later task can align it with the session-first contract with explicit notification regression coverage.

---

# No Retained Durability Status Yet

Task 1.25 recommends eventual store-level durability status outside `DayFrameState`.

Task 1.26 must not implement it.

Do not add:

* `durabilityStatus`;
* dirty/pending flags;
* store-side last-outcome fields;
* durability subscriptions;
* checkpoint metadata;
* persistence warnings.

Only immediate operation results are authorized.

---

# No Retry Yet

Do not add:

* `retryPersistence`;
* automatic retries;
* retry timers;
* retry on next render;
* retry buttons;
* retry on focus/reconnect;
* migration retry.

A later task will use the executable mutation-result contract to implement retained status and retry deliberately.

---

# Required Tests

Add or update store-level tests proving the new API contract.

At minimum cover:

## Standard active mutation success

A persisting authored mutation returns:

```text
state = resulting runtime snapshot
persistence.status = persisted
```

Subscriber still fires exactly once.

---

## Active mutation storage failure

Inject active `setItem` failure and prove:

* runtime mutation remains applied;
* returned `state` is the new runtime snapshot;
* `persistence.status === "storageFailure"`;
* subscriber receives the new snapshot exactly once;
* no throw occurs for the ordinary helper-handled failure.

---

## Active mutation unavailable storage

Prove:

* runtime mutation remains applied;
* persistence is `unavailable`;
* notification semantics are unchanged.

---

## Serialization failure

Where safely testable through an affected mutation or the narrowest store boundary, prove that `serializationFailure` survives into the returned store result.

Do not weaken production types.

If this cannot be exercised through a valid public mutation without introducing unsupported state, retain Task 1.24 helper coverage and document why store-level serialization propagation is structurally guaranteed but not independently fixture-injected.

Do not invent invalid production flows solely to satisfy redundant coverage.

---

## Profile save

Prove returned result contains:

```text
new runtime profile state
+
profile persistence outcome
```

including at least one failure case.

---

## Profile delete

Prove returned result contains runtime deletion plus profile persistence outcome.

---

## Profile load

Prove the returned persistence outcome corresponds to active authored storage, not profile storage.

---

## Backup import

Prove the returned result captures active persistence outcome after valid import.

Do not change parse/validation failure behavior.

---

## Clear

Test all aggregate classes:

```text
cleared
partiallyCleared
notCleared
```

At minimum cover:

* both removed;
* active removed / profile failure;
* active failure / profile removed;
* both non-success.

Verify exact per-key outcomes remain available.

---

# Behavioral Preservation Tests

Preserve or update tests proving:

* one runtime mutation;
* one persistence attempt;
* one notification;
* existing Preview staleness behavior;
* existing profile semantics;
* existing backup import semantics;
* existing clear runtime reset;
* existing UI behavior where integration tests are affected;
* existing deterministic scheduling behavior indirectly remains unchanged.

Do not rewrite tests to assert new UI semantics.

---

# Expected Files to Change

Likely executable areas:

* `code/src/state/types.ts` or current store-interface type location;
* `code/src/state/dayFrameStore.ts`;
* `code/src/state/tests/dayFrameStore.test.ts`;
* `code/src/ui/DayFrameApp.tsx` only if callers currently consume returned `DayFrameState`;
* affected application tests only when needed for type/return-shape preservation.

Do not change unrelated files merely for naming or organization.

Do not introduce a new generalized command-result module unless current type organization clearly requires it.

---

# Reference Validation

After implementation verify:

* every persisting store mutation returns the new result type;
* `clearLocalData` returns the clear result type;
* no affected mutation still claims to return `DayFrameState` directly;
* non-persisting operations retain their existing return contracts;
* all callers compile;
* no caller branches on persistence outcome;
* no UI imports persistence result types unnecessarily;
* subscriber snapshots remain `DayFrameState`;
* no retained durability state exists;
* no retry exists;
* no rollback exists;
* no durable format changed.

---

# Explicit Non-Goals

Task 1.26 shall not:

* add retained durability status;
* add durability fields to `DayFrameState`;
* add a durability subscription;
* add pending/dirty state;
* add retry entry points;
* retry automatically;
* roll back runtime state;
* change mutation ordering;
* change subscriber ordering;
* change subscriber payloads;
* change UI success/error language;
* add recovery UX;
* change Setup workflow semantics;
* change manual-event workflow semantics;
* change profile workflow semantics;
* change backup workflow semantics;
* change clear workflow messaging;
* normalize storage-accessor exceptions if not already handled by Task 1.24;
* add migration markers;
* change migration behavior;
* introduce a persistence service;
* introduce transactions;
* alter storage keys;
* alter schemas;
* increment versions;
* alter validators;
* alter normalizers;
* remove compatibility readers;
* address read-failure recovery;
* address backup download completion;
* resolve unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.24 — Make Durable-Write Outcomes Observable at the Persistence-Helper Boundary;
* Task 1.25 — Establish Store-Level Durability Outcome Semantics.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

Task 1.24 supplies factual helper outcomes.

Task 1.25 supplies their store-level semantic meaning.

Task 1.26 makes that immediate mutation-result contract executable.

---

# Evidence Standards

Implementation must preserve the distinction between:

```text
runtime transition succeeded
```

and:

```text
durable persistence succeeded
```

Do not rename the result in a way that collapses those claims.

A returned `StoreMutationResult` means runtime application succeeded.

Its `persistence` field carries the durable observation.

Exceptions that occur before a valid runtime transition may remain exceptions.

---

# ADR Alignment

Task 1.26 should improve:

* persistence observability;
* explicit separation of runtime and durability;
* deterministic mutation ownership;
* future retryability;
* future recovery correctness.

It does not yet satisfy:

* retained ongoing durability status;
* user-visible failure communication;
* deliberate retry;
* migration evidence;
* recovery UX.

The result artifact must not claim those later requirements are complete.

---

# Validation Requirements

Run focused tests for affected store mutations and clear aggregation.

At minimum:

```text
dayFrameStore tests
DayFrameApp tests where affected
profile tests
backup tests
```

Then run:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Run `git diff --check` for affected executable files.

Record:

* test-file count;
* test count;
* any increase caused by new tests;
* exact validation results.

Confirm:

* Task 1.26 specification remained unchanged;
* no unrelated source changes occurred;
* no UI semantics changed;
* no durable-data schema changed.

---

# Documentation Rules

During Task 1.26:

## Create

* `TASK_1.26_EXPOSE_PERSISTENCE_OUTCOMES_THROUGH_STORE_MUTATION_RESULTS_RESULT.md`

## Preserve

* Task 1.26 specification;
* Task 1.25 result;
* Task 1.24 result;
* Task 1.23 result;
* durable-data ADR;
* current checkpoints;
* historical documentation.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* ADR;
* Session Checkpoint.

Those updates require project review.

Do not create a task-specific checkpoint.

---

# Required Result Artifact Structure

The Task 1.26 result should include:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Store Mutation Result Contract
6. Clear Result Contract
7. Store Interface Changes
8. Authored Mutation Changes
9. Setup Commit Result
10. Manual-Event Result
11. Profile Save Result
12. Profile Delete Result
13. Profile Load Result
14. Backup Import Result
15. Clear Aggregation Result
16. Caller Updates
17. Subscriber Preservation
18. UI Preservation
19. Storage-Accessor Boundary
20. Tests Added or Updated
21. Reference Validation
22. ADR Alignment Improvement
23. Deviations
24. Discoveries and Deferred Work
25. Recommended Next Task
26. Validation
27. Final Completion Determination

---

# Expected Architectural Result

Before:

```text
runtime mutation
    ↓
persistence outcome exists internally
    ↓
outcome discarded
    ↓
store returns DayFrameState
```

After:

```text
runtime mutation
    ↓
persistence outcome
    ↓
notify runtime state
    ↓
return {
    state,
    persistence
}
```

For clear:

```text
runtime reset
    ↓
active removal outcome
    ↓
profile removal outcome
    ↓
notify
    ↓
return {
    state,
    activeState,
    profiles,
    durability
}
```

Subscriber semantics remain:

```text
DayFrameState = runtime truth only
```

Workflow semantics remain temporarily unchanged.

---

# Expected Follow-Up

If Task 1.26 completes cleanly, the next dependency-correct work should implement the next piece of Task 1.25's contract:

> retain store-level durability status outside `DayFrameState`.

That future task should determine the smallest status shape and accessor/subscription needs based on actual consumers.

It should still avoid broad UI recovery work until the store owns durable status coherently.

Subsequent likely sequence:

```text
Task 1.26
mutation results
    ↓
future task
retained surface durability status
    ↓
future task
store retry entry points
    ↓
future task
workflow feedback/recovery
```

Do not implement those later stages in Task 1.26.

---

# Completion Criteria

Task 1.26 is complete when:

* persisting authored mutations return `{ state, persistence }` or equivalent;
* profile save/delete return runtime state plus profile persistence outcome;
* profile load returns runtime state plus active persistence outcome;
* backup import returns runtime state plus active persistence outcome;
* clear returns runtime state, both exact removal outcomes, and aggregate durability;
* Task 1.24 persistence categories survive unchanged;
* runtime authority remains session-first;
* runtime mutation ordering remains unchanged;
* subscriber notification ordering remains unchanged;
* subscriber payload remains `DayFrameState`;
* existing UI behavior remains unchanged;
* no retained durability status exists yet;
* no retry exists;
* no rollback exists;
* no storage-accessor behavior is broadened beyond authorized scope;
* no durable format/schema/version changes;
* focused tests establish the store result contract;
* full validation passes;
* the result artifact records the next dependency-correct seam.

---

# Task Determination

Task 1.26 is a bounded store-contract implementation.

It does not complete DayFrame's durability alignment.

It makes the immediate store mutation contract truthful by returning runtime state and durability as separate dimensions, while preserving the current session-first runtime model and all existing subscriber and workflow behavior.

**The task is complete when store mutations that perform durable writes return the runtime state together with the exact persistence outcome, clear returns both removal outcomes plus its aggregate classification, all existing runtime/subscriber/UI behavior remains unchanged, and the new store-level durability contract is directly protected by tests.**
