# Implementation Task 1.14 — Remove the Unused `generateBlockCandidates.shiftCycle` Alias

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.14

**Task Name:** Remove the Unused `generateBlockCandidates.shiftCycle` Alias

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.14_REMOVE_UNUSED_GENERATE_BLOCK_CANDIDATES_SHIFT_CYCLE_ALIAS_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* input contract changes;
* fallback behavior before and after;
* caller/reference validation;
* tests run and results;
* architectural result;
* deviations from the authorized task, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation reveals any supported caller that supplies singular `shiftCycle`, or any unique behavior tied to that alias that Task 1.13 did not identify, stop the affected work and record the discrepancy rather than broadening this task.

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

> **The task is complete when `generateBlockCandidates` no longer accepts singular `shiftCycle`, existing optional plural/empty behavior remains unchanged, and all supported scheduling behavior continues to pass validation.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Remove the unused singular `shiftCycle` compatibility alias from `generateBlockCandidates`.

Task 1.13 established that:

* `generateBlockCandidates` has no production singular caller;
* it has no test singular caller;
* its sole production caller passes plural `shiftCycles`;
* its nine direct tests omit cycle properties entirely;
* the singular fallback has no unique behavior;
* no supported external or package export contract requires the alias.

This task removes that unused API surface while preserving the existing optional-empty plural behavior.

---

# Architectural Context

The current input contract conceptually allows:

```text
shiftCycles?: ShiftCycle[]
shiftCycle?: ShiftCycle | null
```

and resolves:

```text
input.shiftCycles ?? (input.shiftCycle ? [input.shiftCycle] : [])
```

Task 1.13 established that the singular branch is never exercised by any caller.

The supported behavior is already:

```text
shiftCycles supplied
    ↓
use plural cycles

shiftCycles omitted
    ↓
use []
```

The desired contract is therefore:

```text
shiftCycles?: ShiftCycle[]
```

with local resolution:

```text
input.shiftCycles ?? []
```

---

# Objective

Remove the singular `shiftCycle` input property and fallback from `generateBlockCandidates`.

Preserve:

* optional plural `shiftCycles`;
* omitted-cycle behavior;
* empty-array behavior;
* candidate-generation semantics;
* effective-preference behavior;
* production scheduling behavior.

No test fixture modernization should be required.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

* eliminate obsolete API surface;
* simplify core contracts;
* clarify canonical scheduling vocabulary;
* reduce compatibility residue;
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

## Input Contract

Remove singular:

```text
shiftCycle?: ShiftCycle | null
```

from the `generateBlockCandidates` input type.

Retain:

```text
shiftCycles?: ShiftCycle[]
```

unchanged unless a purely mechanical type cleanup is required.

---

## Resolution Logic

Change the local cycle resolution from singular-aware fallback logic to:

```text
input.shiftCycles ?? []
```

or the implementation-equivalent form.

Do not make plural input required.

Task 1.13 explicitly established that the nine direct tests rely on omitted-cycle behavior.

---

## Reference Validation

Confirm repository-wide that no caller supplies singular `shiftCycle` to `generateBlockCandidates`.

If a caller is discovered, stop and report it rather than modernizing that caller under this task.

---

# Explicit Non-Goals

This task shall not:

* make `shiftCycles` required;
* change empty-cycle defaults;
* change the nine direct block-candidate test fixtures;
* modify `generateSchedulePreview.shiftCycle`;
* modify `generateCycleWorkBlocks.shiftCycle`;
* modify `getActiveShiftSegment.shiftCycle`;
* modernize engine/cycle tests;
* change durable singular readers;
* change runtime state;
* change store APIs;
* change candidate-generation behavior;
* change preference resolution;
* change date/boundary behavior;
* change recurrence behavior;
* change scheduling outputs;
* introduce a new core API abstraction;
* update unrelated core signatures;
* address other Phase 1 findings.

This task removes exactly one zero-caller compatibility alias.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.13 — Establish Core Singular Scheduling Input Compatibility Boundary.

Task 1.13 provides the executable evidence that this alias has zero callers and no supported responsibility.

---

# Implementation Requirements

The implementation must:

1. remove singular `shiftCycle` from `GenerateBlockCandidatesInput`;
2. remove the singular fallback branch;
3. preserve optional plural `shiftCycles`;
4. preserve `[]` as the default when plural cycles are omitted;
5. preserve all candidate-generation behavior;
6. confirm no singular caller exists;
7. avoid modifying unrelated core APIs or tests.

---

# Behavioral Invariants

## Optional Cycle Input

Calls that omit `shiftCycles` must continue to behave as before.

---

## Empty Cycles

An omitted cycle input should continue to resolve to an empty array.

---

## Plural Cycles

Calls that supply plural `shiftCycles` must behave identically.

---

## Production Scheduling

The production `generateSchedulePreview` path must continue to pass plural cycles and receive equivalent candidate output.

---

## Preferences

Effective schedule-preference behavior must remain unchanged.

---

## Durable Compatibility

Local/profile/backup singular readers remain unchanged and unrelated to this core API cleanup.

---

# Validation Requirements

## Reference Validation

Confirm that repository-wide executable calls to `generateBlockCandidates` contain zero singular `shiftCycle` arguments before and after the change.

---

## Targeted Validation

Run:

* `generateBlockCandidates` tests;
* `generateSchedulePreview` tests;
* any effective-preference or cycle tests directly affected by type checking.

Confirm the existing nine block-candidate calls that omit cycle input continue to pass unchanged.

---

## Full Validation

Run:

* `npm run lint`
* `npm run typecheck`
* `npm test -- --run`
* `npm run build`

---

# Architectural Validation

Confirm the core boundary changes from:

```text
GenerateBlockCandidatesInput
    ├── shiftCycles?
    └── shiftCycle?
```

to:

```text
GenerateBlockCandidatesInput
    └── shiftCycles?
```

and the local resolution changes from:

```text
plural ?? singular fallback ?? []
```

to:

```text
plural ?? []
```

No replacement alias should be introduced.

---

# Required Result

The result artifact should include:

| Concern                     | Before  | After     |
| --------------------------- | ------- | --------- |
| Production singular callers | 0       | 0         |
| Test singular callers       | 0       | 0         |
| Singular input property     | Present | Removed   |
| Optional plural input       | Present | Present   |
| Omitted-cycle default       | `[]`    | `[]`      |
| Candidate behavior          | Current | Unchanged |

Also record:

* exact files changed;
* whether any unexpected caller appeared;
* whether any test fixture required modification;
* whether any behavior changed.

---

# Documentation Updates

At completion:

* preserve this Task 1.14 specification unchanged;
* create
  `TASK_1.14_REMOVE_UNUSED_GENERATE_BLOCK_CANDIDATES_SHIFT_CYCLE_ALIAS_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include Task 1.14 in the next Session Checkpoint;
* do not create a task-specific checkpoint unless separately authorized;
* do not update `CHANGELOG.md` solely for this bounded core cleanup.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.14 is complete when:

* `generateBlockCandidates` no longer accepts singular `shiftCycle`;
* the singular fallback is removed;
* optional plural `shiftCycles` remains supported;
* omitted-cycle behavior remains `[]`;
* no singular caller exists;
* existing block-candidate tests remain behaviorally unchanged;
* production Preview generation remains unchanged;
* relevant tests pass;
* lint passes;
* type checking passes;
* the full suite passes;
* the production build passes;
* the result artifact records the completed API simplification.

---

# Risks

Primary risks include:

* accidentally making plural input required;
* changing omitted-cycle behavior;
* touching adjacent singular core APIs;
* modifying tests unnecessarily;
* broadening a zero-caller cleanup into general scheduling API refactoring.

The task should remain minimal.

---

# Deferred Work

This task does not resolve:

* `getActiveShiftSegment.shiftCycle`;
* `generateCycleWorkBlocks.shiftCycle`;
* `generateSchedulePreview.shiftCycle`;
* their historical test fixtures;
* durable reader retirement;
* compatibility-horizon policy;
* unrelated Phase 1 findings.

These remain separately staged work.

---

# Expected Outcome

After Task 1.14, `generateBlockCandidates` will expose only the scheduling vocabulary actually used by supported callers.

The function will continue supporting optional plural cycle input and its existing empty-cycle default, but it will no longer carry an entirely unused singular compatibility branch.

---

# Task Determination

Task 1.14 removes the smallest isolated core singular compatibility structure identified by Task 1.13.

It does not change scheduling behavior or require fixture migration.

It simply removes an input branch with no caller and no unique behavior.

**The task is complete when `generateBlockCandidates` no longer accepts singular `shiftCycle`, existing optional plural/empty behavior remains unchanged, and all supported scheduling behavior continues to pass validation.**
