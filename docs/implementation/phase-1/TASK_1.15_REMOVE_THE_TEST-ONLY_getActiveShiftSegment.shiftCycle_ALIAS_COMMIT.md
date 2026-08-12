# Implementation Task 1.15 — Remove the Test-Only `getActiveShiftSegment.shiftCycle` Alias

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.15

**Task Name:** Remove the Test-Only `getActiveShiftSegment.shiftCycle` Alias

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.15_REMOVE_TEST_ONLY_GET_ACTIVE_SHIFT_SEGMENT_SHIFT_CYCLE_ALIAS_RESULT.md`

The result artifact should document:

* implementation completed;
* test callers modernized;
* files changed;
* input contract changes;
* fallback behavior before and after;
* caller/reference validation;
* behavioral equivalence;
* validation performed and results;
* architectural result;
* deviations from the authorized task, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation reveals any supported production caller supplying singular `shiftCycle`, or any unique singular behavior not identified by Task 1.13, stop the affected work and record the discrepancy rather than broadening this task.

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

> **The task is complete when every test-only `getActiveShiftSegment.shiftCycle` caller has been migrated to plural `shiftCycles`, the singular input alias has been removed, and supported preference-resolution behavior remains unchanged.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Remove the singular `shiftCycle` compatibility alias from `getActiveShiftSegment` after Task 1.13 established that it has no supported production caller and no unique architectural behavior.

Task 1.13 established that:

* `getActiveShiftSegment` has one supported production caller;
* that production caller supplies plural `shiftCycles`;
* five direct unit-test callers use singular `shiftCycle`;
* those tests are fixture-convenience cases rather than compatibility-contract tests;
* singular input immediately resolves to a zero- or one-element plural array;
* no supported external package or export boundary requires the alias.

This task modernizes those five test callers and removes the obsolete singular input branch.

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

Supported production already uses:

```text
getActiveShiftSegment({
    shiftCycles
})
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

Convert all five direct test callers from singular `shiftCycle` input to plural `shiftCycles`, then remove the singular input property and fallback from `getActiveShiftSegment`.

Preserve:

* plural input behavior;
* omitted-cycle behavior;
* empty-array behavior;
* overlap validation;
* active-segment selection;
* mode handling;
* effective schedule-preference behavior.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

* eliminate obsolete API surface;
* align tests with supported production vocabulary;
* simplify core contracts;
* clarify plural scheduling authority;
* reduce historical fixture debt;
* strengthen architectural consistency.

It reinforces:

* Architecture Governs Implementation;
* Executable Evidence;
* Eliminate Structural Debt;
* Evidence Before Preference;
* Preserve Deterministic State Ownership;
* Local Simplicity, Global Coherence;
* Architectural Traceability.

---

# Scope

## Test Caller Modernization

Convert the five direct unit-test callers identified by Task 1.13 from:

```text
getActiveShiftSegment({
    shiftCycle: cycle,
    ...
})
```

to:

```text
getActiveShiftSegment({
    shiftCycles: [cycle],
    ...
})
```

Preserve all other inputs and assertions.

If a test intentionally supplies no cycle, preserve its existing omission or empty-array behavior.

---

## Input Contract Removal

Remove singular:

```text
shiftCycle?: ShiftCycle | null
```

from the `GetActiveShiftSegmentInput` contract.

Retain plural:

```text
shiftCycles?: ShiftCycle[]
```

unchanged.

---

## Resolution Logic

Change the local resolution from:

```text
input.shiftCycles ?? (input.shiftCycle ? [input.shiftCycle] : [])
```

to:

```text
input.shiftCycles ?? []
```

or the implementation-equivalent form.

Do not make plural input required.

---

## Reference Validation

Confirm repository-wide that no executable caller supplies singular `shiftCycle` to `getActiveShiftSegment` after fixture modernization.

If any unexpected production caller appears, stop and report it.

---

# Explicit Non-Goals

This task shall not:

* make `shiftCycles` required;
* change empty-cycle behavior;
* change active-segment selection semantics;
* change overlap validation;
* change shift mode behavior;
* change effective schedule-preference resolution;
* modify `generateCycleWorkBlocks.shiftCycle`;
* modify `generateSchedulePreview.shiftCycle`;
* modify durable singular readers;
* change runtime state;
* change store APIs;
* change date or boundary semantics;
* modernize unrelated engine tests;
* remove entity-level singular cycle parameters;
* change `getActiveShiftCycleForLocalDate`;
* introduce a replacement API;
* address unrelated Phase 1 findings.

This task removes exactly one test-only core alias.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.13 — Establish Core Singular Scheduling Input Compatibility Boundary;
* Task 1.14 — Remove the Unused `generateBlockCandidates.shiftCycle` Alias.

Task 1.13 provides the evidence that the alias is test/fixture convenience only.

Task 1.14 establishes the first completed core singular-input cleanup.

---

# Implementation Requirements

The implementation must:

1. identify the five direct singular test callers established by Task 1.13;
2. convert each to plural `shiftCycles`;
3. preserve test meaning and represented cycle data;
4. remove singular `shiftCycle` from `GetActiveShiftSegmentInput`;
5. remove the singular fallback branch;
6. preserve optional plural input;
7. preserve `[]` as the omitted-input default;
8. preserve production preference-resolution behavior;
9. avoid touching adjacent core singular APIs.

---

# Behavioral Invariants

## Plural Input

Plural `shiftCycles` must behave identically before and after the task.

---

## Empty Input

Omitted cycles must continue to resolve to an empty array.

---

## Active Segment Selection

Equivalent cycle data must produce the same active segment.

---

## Validation

Overlap, mode, and segment validation behavior must remain unchanged.

---

## Preference Resolution

The supported production path through effective schedule-preference resolution must remain unchanged.

---

## Durable Compatibility

Local/profile/backup singular readers remain unchanged and independent.

---

# Validation Requirements

## Fixture Validation

Confirm all five known direct singular test callers have been converted to plural input.

Confirm no test assertion required reinterpretation.

---

## Reference Validation

After implementation, confirm no executable `getActiveShiftSegment` call supplies singular `shiftCycle`.

Distinguish unrelated local variables and entity-level singular parameters.

---

## Targeted Validation

Run:

* `getActiveShiftSegment` tests;
* effective schedule-preference tests;
* any Preview/generation tests affected transitively.

Confirm active-segment selection and preference behavior remain unchanged.

---

## Full Validation

Run:

* `npm run lint`
* `npm run typecheck`
* `npm test -- --run`
* `npm run build`

---

# Architectural Validation

Confirm the boundary changes from:

```text
GetActiveShiftSegmentInput
    ├── shiftCycles?
    └── shiftCycle?
```

to:

```text
GetActiveShiftSegmentInput
    └── shiftCycles?
```

with resolution changing from:

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
| Test singular callers       | 5       | 0         |
| Singular input property     | Present | Removed   |
| Optional plural input       | Present | Present   |
| Omitted-cycle default       | `[]`    | `[]`      |
| Preference behavior         | Current | Unchanged |

Also record:

* exact files changed;
* exact number of test callers converted;
* whether any unexpected caller appeared;
* whether any test meaning changed;
* whether any adjacent API needed modification.

---

# Documentation Updates

At completion:

* preserve this Task 1.15 specification unchanged;
* create
  `TASK_1.15_REMOVE_TEST_ONLY_GET_ACTIVE_SHIFT_SEGMENT_SHIFT_CYCLE_ALIAS_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include Task 1.15 in the next Session Checkpoint;
* do not create a task-specific checkpoint unless separately authorized;
* do not update `CHANGELOG.md` solely for this bounded core cleanup.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.15 is complete when:

* all five known singular test callers have been converted to plural input;
* no supported production singular caller exists;
* singular `shiftCycle` has been removed from `GetActiveShiftSegmentInput`;
* the singular fallback has been removed;
* optional plural `shiftCycles` remains supported;
* omitted-cycle behavior remains unchanged;
* active-segment behavior remains unchanged;
* effective preference resolution remains unchanged;
* durable singular readers remain unchanged;
* relevant tests pass;
* lint passes;
* type checking passes;
* the full automated suite passes;
* the production build passes;
* the result artifact records the completed API simplification.

---

# Risks

Primary risks include:

* changing test meaning while modernizing fixture syntax;
* accidentally making plural input required;
* changing empty-cycle behavior;
* touching entity-level singular cycle parameters that are not compatibility aliases;
* broadening the task into adjacent core cleanup;
* altering preference-resolution behavior unintentionally.

The task should remain mechanical and behavior-preserving.

---

# Deferred Work

This task does not resolve:

* `generateCycleWorkBlocks.shiftCycle`;
* `generateSchedulePreview.shiftCycle`;
* their historical test fixtures;
* durable reader retirement;
* compatibility-horizon policy;
* `DayFrameAuthoredSetup` compatibility typing;
* unrelated Phase 1 findings.

These remain separately staged work.

---

# Expected Outcome

After Task 1.15, `getActiveShiftSegment` will expose only the plural cycle vocabulary used by supported production behavior.

Its five historical test callers will use the same plural input form as production.

No active-segment or preference-resolution behavior will change.

---

# Task Determination

Task 1.15 removes one test-only singular core compatibility alias after executable evidence established that it has no production or durable-data responsibility.

It does not change scheduling semantics or historical durable readers.

It makes `getActiveShiftSegment` reflect the plural cycle vocabulary already used throughout supported production behavior.

**The task is complete when every test-only `getActiveShiftSegment.shiftCycle` caller has been migrated to plural `shiftCycles`, the singular input alias has been removed, and supported preference-resolution behavior remains unchanged.**
