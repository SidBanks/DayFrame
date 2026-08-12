# Implementation Task 1.16 — Remove the Test-Only `generateCycleWorkBlocks.shiftCycle` Alias

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.16

**Task Name:** Remove the Test-Only `generateCycleWorkBlocks.shiftCycle` Alias

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.16_REMOVE_TEST_ONLY_GENERATE_CYCLE_WORK_BLOCKS_SHIFT_CYCLE_ALIAS_RESULT.md`

The result artifact should document:

* implementation completed;
* test callers modernized;
* files changed;
* input contract changes;
* fallback behavior before and after;
* normalization and validation preservation;
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

> **The task is complete when every test-only `generateCycleWorkBlocks.shiftCycle` caller has been migrated to plural `shiftCycles`, the singular input alias has been removed, and supported work-block generation behavior remains unchanged.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Remove the singular `shiftCycle` compatibility alias from `generateCycleWorkBlocks` after Task 1.13 established that it has no supported production caller and no unique architectural behavior.

Task 1.13 established that:

* `generateCycleWorkBlocks` has two supported production callers;
* both production callers supply plural `shiftCycles`;
* seven direct unit-test callers use singular `shiftCycle`;
* those singular test inputs are historical fixture convenience;
* singular input is converted to a one-element array before the same normalization and validation applied to plural input;
* no supported external package or export boundary requires the alias.

This task modernizes those seven test callers and removes the obsolete singular input branch.

---

# Architectural Context

The current input contract conceptually allows:

```text
shiftCycles?: ShiftCycle[]
shiftCycle?: ShiftCycle | null
```

and resolves a cycle collection before applying the existing normalization and validation pipeline.

Conceptually:

```text
plural shiftCycles
        \
         -> resolved array
        /
singular shiftCycle
             ↓
normalizeShiftCycles
             ↓
validateShiftCycles
             ↓
work-block generation
```

Supported production already enters through plural arrays:

```text
generateSchedulePreview
    ↓
generateCycleWorkBlocks({ shiftCycles })

previewRangeWarnings
    ↓
generateCycleWorkBlocks({ shiftCycles })
```

The desired boundary is:

```text
shiftCycles?: ShiftCycle[]
        ↓
resolved array
        ↓
existing normalization
        ↓
existing validation
        ↓
work-block generation
```

The normalization and validation stages are not being redesigned.

---

# Objective

Convert all seven direct test callers from singular `shiftCycle` input to plural `shiftCycles`, then remove the singular input property and fallback from `generateCycleWorkBlocks`.

Preserve:

* plural input behavior;
* omitted-cycle behavior;
* empty-array behavior;
* cycle normalization;
* cycle validation;
* manual-segment behavior;
* repeating-sequence behavior;
* ordering;
* effective-preference behavior;
* date and boundary semantics;
* work-block output.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

* eliminate obsolete API surface;
* align tests with supported production vocabulary;
* simplify core scheduling contracts;
* clarify plural scheduling authority;
* reduce historical fixture debt;
* strengthen architectural consistency.

It reinforces:

* Architecture Governs Implementation;
* Executable Evidence;
* Eliminate Structural Debt;
* Evidence Before Preference;
* Preserve Deterministic State Ownership;
* Determinism Over Cleverness;
* Local Simplicity, Global Coherence;
* Architectural Traceability.

---

# Scope

## Test Caller Modernization

Convert the seven direct unit-test callers identified by Task 1.13 from:

```text
generateCycleWorkBlocks({
    shiftCycle: cycle,
    ...
})
```

to:

```text
generateCycleWorkBlocks({
    shiftCycles: [cycle],
    ...
})
```

Preserve:

* exact cycle objects;
* dates;
* preferences;
* expected work blocks;
* errors;
* all assertions.

If any existing test intentionally omits cycles, preserve that existing omission behavior.

---

## Input Contract Removal

Remove singular:

```text
shiftCycle?: ShiftCycle | null
```

from `GenerateCycleWorkBlocksInput`.

Retain plural:

```text
shiftCycles?: ShiftCycle[]
```

unchanged.

Do not make plural input required.

---

## Resolution Logic

Remove the singular fallback from the initial cycle-array resolution.

The resulting behavior should be implementation-equivalent to:

```text
const shiftCycles = input.shiftCycles ?? []
```

followed by the **existing** normalization and validation behavior.

Do not bypass, relocate, combine, or otherwise change those stages.

---

## Normalization Preservation

Preserve the existing use and semantics of:

```text
normalizeShiftCycles(...)
```

or the implementation-equivalent normalization path.

Equivalent one-element plural input must receive exactly the same normalization previously received after singular wrapping.

---

## Validation Preservation

Preserve the existing cycle validation path and its error behavior.

The task must not alter:

* overlap detection;
* invalid-cycle handling;
* sequence validation;
* manual-segment validation;
* other established cycle errors.

---

## Reference Validation

Confirm repository-wide that no executable caller supplies singular `shiftCycle` to `generateCycleWorkBlocks` after fixture modernization.

If any unexpected production caller appears, stop and report it.

---

# Explicit Non-Goals

This task shall not:

* make `shiftCycles` required;
* change empty-cycle behavior;
* change cycle normalization;
* change cycle validation;
* change manual-segment generation;
* change repeating-sequence generation;
* change work-block ordering;
* change effective schedule preferences;
* change date or day-boundary semantics;
* modify `generateSchedulePreview.shiftCycle`;
* modernize the 26 Preview-engine singular fixtures;
* modify `generateBlockCandidates`;
* modify `getActiveShiftSegment`;
* change durable singular readers;
* change runtime state;
* change store APIs;
* remove entity-level singular `shiftCycle` parameters used for one cycle during iteration;
* introduce a replacement core API;
* address unrelated Phase 1 findings.

This task removes exactly one test-only collection-input alias.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.13 — Establish Core Singular Scheduling Input Compatibility Boundary;
* Task 1.14 — Remove the Unused `generateBlockCandidates.shiftCycle` Alias;
* Task 1.15 — Remove the Test-Only `getActiveShiftSegment.shiftCycle` Alias.

Task 1.13 provides the evidence that the alias is test/fixture convenience only.

Tasks 1.14 and 1.15 establish the validated staged core-cleanup sequence.

---

# Implementation Requirements

The implementation must:

1. identify the seven direct singular test callers established by Task 1.13;
2. convert each caller to plural `shiftCycles`;
3. preserve all represented cycle data and test intent;
4. remove singular `shiftCycle` from `GenerateCycleWorkBlocksInput`;
5. remove the singular fallback branch;
6. preserve optional plural input;
7. preserve `[]` as the omitted-input default;
8. preserve cycle normalization unchanged;
9. preserve cycle validation unchanged;
10. preserve supported production callers unchanged;
11. avoid touching `generateSchedulePreview.shiftCycle`;
12. avoid modifying entity-level single-cycle parameters that are not compatibility aliases.

---

# Behavioral Invariants

## Plural Input

Plural `shiftCycles` must behave identically before and after Task 1.16.

---

## Omitted Input

Omitted cycles must continue to resolve to the same empty collection behavior as before.

---

## Normalization

Equivalent cycle input must receive identical normalization.

---

## Validation

Equivalent cycle input must receive identical validation and error behavior.

---

## Manual Segments

Manual-segment work generation must remain unchanged.

---

## Repeating Sequences

Repeating-sequence work generation must remain unchanged.

---

## Work-Block Ordering

Generated work-block ordering must remain unchanged.

---

## Production Callers

Both supported production callers must continue supplying plural `shiftCycles` without modification unless a purely mechanical type inference change is unavoidable.

---

## Durable Compatibility

Local/profile/backup singular readers remain untouched.

---

# Validation Requirements

## Fixture Validation

Confirm all seven known singular unit-test callers have been converted to plural input.

Confirm no behavioral assertion required reinterpretation.

---

## Reference Validation

After implementation, confirm no executable `generateCycleWorkBlocks` call supplies singular `shiftCycle`.

Distinguish compatibility properties from internal parameters representing the current cycle during iteration.

---

## Normalization Validation

Confirm tests continue protecting normalized behavior for relevant legacy/current cycle shapes where already covered.

Do not add or remove normalization semantics under this task.

---

## Targeted Validation

Run:

* `generateCycleWorkBlocks` tests;
* `generateSchedulePreview` tests;
* Preview range-warning tests;
* effective-preference/cycle tests where relevant.

Confirm the two supported production paths remain behaviorally equivalent.

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
GenerateCycleWorkBlocksInput
    ├── shiftCycles?
    └── shiftCycle?
```

to:

```text
GenerateCycleWorkBlocksInput
    └── shiftCycles?
```

while preserving:

```text
shiftCycles ?? []
        ↓
normalize
        ↓
validate
        ↓
generate work blocks
```

No replacement alias should be introduced.

---

# Required Result

The result artifact should include:

| Concern                     | Before                  | After     |
| --------------------------- | ----------------------- | --------- |
| Production singular callers | 0                       | 0         |
| Test singular callers       | 7                       | 0         |
| Singular input property     | Present                 | Removed   |
| Optional plural input       | Present                 | Present   |
| Omitted-cycle default       | Existing empty behavior | Unchanged |
| Normalization               | Current                 | Unchanged |
| Validation                  | Current                 | Unchanged |
| Work-block behavior         | Current                 | Unchanged |

Also record:

* exact files changed;
* exact number of test callers converted;
* whether any unexpected caller appeared;
* whether any test meaning changed;
* whether normalization or validation required modification;
* whether any adjacent API needed modification.

---

# Documentation Updates

At completion:

* preserve this Task 1.16 specification unchanged;
* create
  `TASK_1.16_REMOVE_TEST_ONLY_GENERATE_CYCLE_WORK_BLOCKS_SHIFT_CYCLE_ALIAS_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include Task 1.16 in the next Session Checkpoint;
* do not create a task-specific checkpoint unless separately authorized;
* do not update `CHANGELOG.md` solely for this bounded core cleanup.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.16 is complete when:

* all seven known singular test callers have been converted to plural input;
* no supported production singular caller exists;
* singular `shiftCycle` has been removed from `GenerateCycleWorkBlocksInput`;
* the singular fallback has been removed;
* optional plural `shiftCycles` remains supported;
* omitted-cycle behavior remains unchanged;
* normalization remains unchanged;
* validation remains unchanged;
* manual and repeating work-block generation remain unchanged;
* work-block ordering remains unchanged;
* durable singular readers remain unchanged;
* `generateSchedulePreview.shiftCycle` remains untouched;
* relevant tests pass;
* lint passes;
* type checking passes;
* the full automated suite passes;
* the production build passes;
* the result artifact records the completed API simplification.

---

# Risks

Primary risks include:

* changing normalization while simplifying input resolution;
* changing validation order or error behavior;
* accidentally touching internal single-cycle parameters;
* making plural input required;
* modifying Preview-engine fixtures prematurely;
* broadening the task into the final core alias cleanup.

The task should remain mechanical and behavior-preserving.

---

# Deferred Work

This task does not resolve:

* `generateSchedulePreview.shiftCycle`;
* its 26 historical engine-test callers;
* durable reader retirement;
* compatibility-horizon policy;
* `DayFrameAuthoredSetup` compatibility typing;
* unrelated Phase 1 findings.

These remain separately staged work.

---

# Expected Outcome

After Task 1.16, `generateCycleWorkBlocks` will expose only the plural collection input used by its supported production callers.

Its seven historical unit-test callers will use the same plural vocabulary.

Normalization, validation, and work-block generation will remain unchanged.

Only the obsolete singular collection alias will disappear.

---

# Task Determination

Task 1.16 removes one test-only singular core compatibility alias after executable evidence established that supported production already uses plural cycles.

It does not change normalization, validation, scheduling semantics, historical durable readers, or the remaining Preview-engine singular alias.

It makes `generateCycleWorkBlocks` reflect the plural scheduling vocabulary already used by supported production behavior.

**The task is complete when every test-only `generateCycleWorkBlocks.shiftCycle` caller has been migrated to plural `shiftCycles`, the singular input alias has been removed, and supported work-block generation behavior remains unchanged.**
