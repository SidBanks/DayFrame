# Implementation Task 1.10 — Remove the Test-Only `setShiftCycle` Store Alias

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.10

**Task Name:** Remove the Test-Only `setShiftCycle` Store Alias

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.10_REMOVE_TEST_ONLY_SET_SHIFT_CYCLE_STORE_ALIAS_RESULT.md`

The result artifact should document:

* implementation completed;
* callers modernized;
* files changed;
* store contract changes;
* behavioral equivalence;
* validation performed and results;
* architectural result;
* deviations from the authorized task, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation reveals a supported production caller or a compatibility dependency not identified by Task 1.9, stop the affected work and record the discrepancy rather than broadening this task.

---

# Pre-Execution Artifact Integrity Check

Before beginning implementation, verify that this saved task artifact contains:

* this title and task metadata;
* Execution Artifact Rules;
* Purpose;
* Scope;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with the final sentence:

> **The task is complete when every test-only `setShiftCycle` caller has been migrated to plural `setShiftCycles`, the singular store alias has been removed, and all supported behavior remains unchanged.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Remove the singular `setShiftCycle` store mutation alias after Task 1.9 established that it has no supported production caller and no unique architectural responsibility.

Task 1.9 determined that:

* `setShiftCycle` has seven executable callers;
* all seven callers are in tests;
* no production application, migration, profile, backup, import, or scheduling path calls it;
* its implementation delegates entirely to plural `setShiftCycles`;
* durable-data singular readers do not depend upon it.

This task converts those test fixtures to the canonical plural store API and removes the obsolete singular alias.

---

# Architectural Context

The current store mutation boundary includes:

```text
setShiftCycles([...])
    ↓
current plural mutation authority

setShiftCycle(cycle)
    ↓
delegates to setShiftCycles([cycle])

setShiftCycle(null)
    ↓
delegates to setShiftCycles([])
```

Task 1.9 classified `setShiftCycle` as:

**Test/Fixture Convenience**

It does not own an independent architectural transition.

The desired boundary is therefore:

```text
setShiftCycles([...])
    ↓
single supported shift-cycle store mutation API
```

This task removes the redundant alias without changing the underlying plural behavior.

---

# Objective

Convert every remaining test-only `setShiftCycle` caller to `setShiftCycles`, then remove `setShiftCycle` from the store contract and implementation.

After completion:

> `setShiftCycles` shall be the only supported store mutation API for shift-cycle collections.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

* eliminate obsolete implementation structures;
* reduce unnecessary API surface;
* clarify authoritative ownership;
* simplify implementation pathways;
* reduce fixture-driven compatibility debt;
* strengthen architectural consistency.

It reinforces:

* Architecture Governs Implementation;
* Executable Evidence;
* Eliminate Structural Debt;
* Local Simplicity, Global Coherence;
* Preserve Deterministic State Ownership;
* Evidence Before Preference;
* Architectural Traceability.

---

# Scope

## Test Caller Modernization

Convert all direct `setShiftCycle` calls identified by Task 1.9 to plural `setShiftCycles`.

Expected transformations include:

```text
setShiftCycle(cycle)
```

to:

```text
setShiftCycles([cycle])
```

and:

```text
setShiftCycle(null)
```

to:

```text
setShiftCycles([])
```

Use the existing plural API directly.

Do not change the behavioral intent of the tests.

---

## Store Contract Removal

Remove `setShiftCycle` from the store interface/type contract.

Remove the delegating implementation.

Remove any now-unused local implementation detail whose only purpose was to support that alias.

---

## Reference Cleanup

Confirm no executable `setShiftCycle` reference remains after the authorized caller conversions.

Distinguish unrelated text/documentation mentions from executable references.

---

# Explicit Non-Goals

This task shall not:

* remove runtime `DayFrameState.shiftCycle`;
* remove singular store-initialization input;
* change `createDayFrameStore` initialization typing;
* change durable-data singular readers;
* change local-storage compatibility;
* change profile compatibility;
* change backup compatibility;
* change core singular scheduling inputs;
* modernize engine test fixtures;
* remove `generateSchedulePreview.shiftCycle`;
* remove other core singular aliases;
* change plural `setShiftCycles` behavior;
* change Preview staleness semantics;
* change persistence behavior;
* change scheduling behavior;
* alter normalization;
* define the compatibility horizon;
* change production UI behavior;
* refactor unrelated store APIs.

This task removes exactly one test-only store alias.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.9 — Establish Runtime and API `shiftCycle` Compatibility Boundary.

Task 1.9 provides the executable evidence that `setShiftCycle` has no supported production caller and no durable-reader dependency.

---

# Implementation Requirements

The implementation must:

1. identify the seven direct `setShiftCycle` callers established by Task 1.9;
2. convert each caller to plural `setShiftCycles`;
3. preserve equivalent test setup and assertions;
4. remove `setShiftCycle` from the store contract;
5. remove its delegating implementation;
6. preserve `setShiftCycles` behavior unchanged;
7. preserve Preview staleness, persistence, cloning, and subscriber semantics inherited from `setShiftCycles`;
8. confirm no production code requires the removed alias;
9. avoid any broader singular-compatibility cleanup.

---

# Behavioral Invariants

## Plural Mutation Behavior

`setShiftCycles` must remain behaviorally unchanged.

---

## Preview Staleness

Mutating shift cycles through plural `setShiftCycles` must preserve existing Preview staleness behavior.

---

## Persistence

Plural shift-cycle mutations must preserve existing persistence behavior.

---

## Scheduling

Equivalent plural state must continue to produce equivalent deterministic scheduling results.

---

## Durable Compatibility

Legacy singular local/profile/backup readers remain unchanged.

---

## Runtime Compatibility

`DayFrameState.shiftCycle` remains unchanged in this task.

---

# Validation Requirements

## Reference Validation

After implementation, confirm repository-wide executable references contain no remaining call to:

```text
setShiftCycle
```

If documentation or historical artifacts mention the old API, preserve them unless their responsibility is to describe the current executable store contract.

---

## Store Validation

Run the store tests affected by caller modernization.

Confirm that equivalent plural setup preserves:

* cycle state;
* Preview staleness;
* persistence;
* subscriber behavior;
* generation prerequisites where relevant.

---

## Regression Validation

Run relevant suites covering:

* `dayFrameStore`;
* `DayFrameApp` where injected store fixtures are affected;
* shift-cycle persistence;
* Preview generation where test setup changed.

Then run the standard validation sequence:

* `npm run lint`
* `npm run typecheck`
* `npm test -- --run`
* `npm run build`

---

# Architectural Validation

Confirm the store API changes from:

```text
setShiftCycles
setShiftCycle
```

to:

```text
setShiftCycles
```

with no replacement alias introduced.

The resulting store contract should express one canonical mutation boundary for shift-cycle collections.

---

# Required Result

The result artifact should include:

| Concern                            | Before           | After     |
| ---------------------------------- | ---------------- | --------- |
| Production `setShiftCycle` callers | 0                | 0         |
| Test `setShiftCycle` callers       | 7                | 0         |
| Store API singular alias           | Present          | Removed   |
| Canonical plural API               | `setShiftCycles` | Unchanged |
| Durable singular readers           | Retained         | Retained  |
| Runtime singular mirror            | Retained         | Retained  |

Also record:

* exact files changed;
* exact number of callers converted;
* whether any unexpected caller appeared;
* whether any test intent needed reinterpretation.

---

# Documentation Updates

At completion:

* preserve this Task 1.10 specification unchanged;
* create
  `TASK_1.10_REMOVE_TEST_ONLY_SET_SHIFT_CYCLE_STORE_ALIAS_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include Task 1.10 in the next Session Checkpoint;
* do not update `CHANGELOG.md` solely for this bounded API cleanup.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.10 is complete when:

* all seven known test-only `setShiftCycle` callers have been converted to `setShiftCycles`;
* no supported production caller has been discovered;
* the singular store alias has been removed from the store contract;
* the delegating implementation has been removed;
* no executable `setShiftCycle` call remains;
* plural store behavior remains unchanged;
* durable-data readers remain unchanged;
* runtime singular compatibility remains unchanged;
* relevant tests pass;
* lint passes;
* type checking passes;
* the full automated suite passes;
* the production build passes;
* the result artifact records the completed API simplification.

---

# Risks

Primary risks include:

* accidentally changing test meaning while modernizing fixtures;
* interpreting `null` conversion incorrectly;
* removing similarly named but unrelated identifiers;
* broadening the task into runtime mirror removal;
* changing plural mutation semantics while removing the alias.

The task should remain mechanical and behavior-preserving.

---

# Deferred Work

This task does not resolve:

* runtime `DayFrameState.shiftCycle`;
* singular `createDayFrameStore` initialization input;
* core singular scheduling inputs;
* test fixtures using singular core inputs;
* durable singular readers;
* compatibility-horizon policy;
* unrelated Phase 1 findings.

These remain separately authorized future work.

---

# Expected Outcome

After Task 1.10, DayFrame's store API will no longer expose a singular shift-cycle mutation that exists only for historical test convenience.

Tests will use the same plural mutation boundary as the supported implementation.

The store API therefore becomes simpler and more representative of the current architecture without changing behavior.

---

# Task Determination

Task 1.10 removes one obsolete store alias after executable evidence established that it has no production or durable-compatibility responsibility.

It does not remove runtime or durable compatibility.

It makes the store mutation API reflect the current plural shift-cycle authority.

**The task is complete when every test-only `setShiftCycle` caller has been migrated to plural `setShiftCycles`, the singular store alias has been removed, and all supported behavior remains unchanged.**
