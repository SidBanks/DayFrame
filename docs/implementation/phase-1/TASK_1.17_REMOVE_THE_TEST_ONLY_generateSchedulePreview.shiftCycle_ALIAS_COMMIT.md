# Implementation Task 1.17 — Remove the Test-Only `generateSchedulePreview.shiftCycle` Alias

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.17

**Task Name:** Remove the Test-Only `generateSchedulePreview.shiftCycle` Alias

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.17_REMOVE_TEST_ONLY_GENERATE_SCHEDULE_PREVIEW_SHIFT_CYCLE_ALIAS_RESULT.md`

The result artifact should document:

* implementation completed;
* test callers modernized;
* files changed;
* input contract changes;
* fallback behavior before and after;
* downstream plural-call preservation;
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

> **The task is complete when every test-only `generateSchedulePreview.shiftCycle` caller has been migrated to plural `shiftCycles`, the singular input alias has been removed, and supported Preview-generation behavior remains unchanged.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Remove the singular `shiftCycle` compatibility alias from `generateSchedulePreview` after Task 1.13 established that it has no supported production caller and no unique architectural behavior.

Task 1.13 established that:

* `generateSchedulePreview` has one supported production caller;
* that production caller supplies plural `shiftCycles`;
* 26 direct engine-test callers use singular `shiftCycle`;
* those tests are production-behavior tests written with historical one-cycle fixture shapes rather than compatibility-contract tests;
* singular input is immediately converted to a one-element plural array;
* all downstream production work already proceeds with plural cycles;
* no supported external package/export boundary requires the singular alias.

Tasks 1.14 through 1.16 have already removed the corresponding singular aliases from downstream core scheduling boundaries.

This task modernizes the remaining engine-test callers and removes the final singular collection alias from the primary Preview-generation input.

---

# Architectural Context

The current `generateSchedulePreview` input boundary conceptually allows:

```text id="t117ctx1"
shiftCycles?: ShiftCycle[]
shiftCycle?: ShiftCycle | null
```

and resolves:

```text id="t117ctx2"
input.shiftCycles ?? (input.shiftCycle ? [input.shiftCycle] : [])
```

before the Preview-generation pipeline proceeds.

Supported production already uses:

```text id="t117ctx3"
dayFrameStore.generatePreview
    ↓
generateSchedulePreview({
    shiftCycles,
    ...
})
```

and downstream calls are now plural-only:

```text id="t117ctx4"
generateSchedulePreview
    ├── generateCycleWorkBlocks({ shiftCycles })
    ├── generateBlockCandidates({ shiftCycles })
    └── effective-preference resolution({ shiftCycles })
```

The desired core scheduling vocabulary is therefore:

```text id="t117ctx5"
generateSchedulePreview({
    shiftCycles
})
```

with omission preserving the existing empty-array fallback where applicable.

---

# Objective

Convert all 26 direct engine-test callers from singular `shiftCycle` input to plural `shiftCycles`, then remove the singular property and fallback from `GenerateSchedulePreviewInput`.

Preserve:

* plural input behavior;
* omitted-cycle behavior;
* Preview range behavior;
* work-block generation;
* block-candidate generation;
* placement;
* manual-event integration;
* friction detection;
* suggested fixes;
* effective preference resolution;
* date and boundary behavior;
* deterministic Preview output.

After completion, the primary Preview-generation core contract should use only plural shift-cycle vocabulary.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

* eliminate obsolete API surface;
* align tests with supported production vocabulary;
* simplify core scheduling contracts;
* clarify plural scheduling authority;
* eliminate historical fixture-driven compatibility;
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

## Engine Test Caller Modernization

Convert the 26 direct singular engine-test calls identified by Task 1.13 from forms equivalent to:

```text id="t117scope1"
generateSchedulePreview({
    shiftCycle: cycle,
    ...
})
```

to:

```text id="t117scope2"
generateSchedulePreview({
    shiftCycles: [cycle],
    ...
})
```

For inline singular cycle literals, wrap the same cycle value in a one-element plural array without changing its fields.

Preserve:

* planning windows;
* preferences;
* shift definitions;
* block templates;
* recurrences;
* manual events;
* expected scheduled blocks;
* friction assertions;
* suggested-fix assertions;
* date/boundary assertions;
* deterministic-output assertions.

No test meaning should be reinterpreted.

---

## Input Contract Removal

Remove singular:

```text id="t117scope3"
shiftCycle?: ShiftCycle | null
```

from `GenerateSchedulePreviewInput`.

Retain plural:

```text id="t117scope4"
shiftCycles?: ShiftCycle[]
```

unchanged unless a purely mechanical typing adjustment is required.

Do not make plural input required unless existing implementation already requires non-empty cycles through later guardrails.

---

## Resolution Logic

Change the initial cycle resolution from:

```text id="t117scope5"
input.shiftCycles ?? (input.shiftCycle ? [input.shiftCycle] : [])
```

to:

```text id="t117scope6"
input.shiftCycles ?? []
```

or the implementation-equivalent form.

Preserve the existing later behavior for empty cycle arrays.

If the engine currently throws or returns a guardrail result when cycles are empty, that behavior must remain unchanged.

---

## Downstream Plural Preservation

Confirm `generateSchedulePreview` continues to pass plural cycles to:

* `generateCycleWorkBlocks`;
* `generateBlockCandidates`;
* effective schedule-preference resolution;
* manual-event scheduling where applicable;
* visible-day/range calculations where applicable.

Tasks 1.14–1.16 have already made relevant downstream collection boundaries plural-only.

Do not alter those APIs further under this task.

---

## Reference Validation

Confirm repository-wide that no executable caller supplies singular `shiftCycle` to `generateSchedulePreview` after fixture modernization.

If an unexpected production caller appears, stop and report it.

---

# Explicit Non-Goals

This task shall not:

* make `shiftCycles` required solely as part of cleanup;
* change empty-cycle guardrails;
* change Preview range expansion;
* change cycle normalization;
* change cycle validation;
* change work-block generation;
* change block-candidate generation;
* change placement;
* change manual-event behavior;
* change friction detection;
* change suggested-fix generation;
* change Preview revision;
* change effective schedule-preference semantics;
* change date or user-day boundary behavior;
* change recurrence behavior;
* change deterministic ordering;
* modify durable singular readers;
* change runtime state;
* change store APIs;
* change `DayFrameAuthoredSetup`;
* change profile or backup compatibility;
* update unrelated engine APIs;
* modernize unrelated fixtures;
* introduce a replacement singular alias;
* address unrelated Phase 1 findings.

This task removes exactly the final test-only singular collection input from the Preview-generation core boundary.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.13 — Establish Core Singular Scheduling Input Compatibility Boundary;
* Task 1.14 — Remove the Unused `generateBlockCandidates.shiftCycle` Alias;
* Task 1.15 — Remove the Test-Only `getActiveShiftSegment.shiftCycle` Alias;
* Task 1.16 — Remove the Test-Only `generateCycleWorkBlocks.shiftCycle` Alias.

Task 1.13 provides the evidence that `generateSchedulePreview.shiftCycle` is test/fixture convenience only.

Tasks 1.14–1.16 establish plural-only downstream scheduling collection boundaries.

---

# Implementation Requirements

The implementation must:

1. identify the 26 direct singular engine-test callers established by Task 1.13;
2. convert each caller to plural `shiftCycles`;
3. preserve every represented cycle and test assertion;
4. remove singular `shiftCycle` from `GenerateSchedulePreviewInput`;
5. remove the singular fallback branch;
6. preserve optional plural input;
7. preserve existing empty-cycle behavior;
8. preserve downstream plural calls;
9. preserve scheduling and Preview behavior;
10. confirm no singular caller remains;
11. avoid touching durable compatibility boundaries or unrelated core APIs.

---

# Behavioral Invariants

## Plural Input

Plural `shiftCycles` must behave identically before and after Task 1.17.

---

## Empty Input

Omitted cycles must preserve the existing engine behavior.

If the engine rejects generation with no cycles, it must continue to reject it in the same way.

---

## Work Generation

Equivalent plural cycle input must generate identical work blocks.

---

## Candidate Generation

Equivalent plural cycle input must generate identical block candidates.

---

## Placement

Scheduled and unplaced results must remain equivalent.

---

## Manual Events

Manual calendar-event integration must remain unchanged.

---

## Friction

Friction detection and classification must remain unchanged.

---

## Suggested Fixes

Suggested-fix generation must remain unchanged.

---

## Date Semantics

Planning-window expansion, user-day boundaries, overnight behavior, and effective preferences must remain unchanged.

---

## Determinism

Identical plural inputs must continue producing identical deterministic Preview results.

---

## Durable Compatibility

Legacy local/profile/backup singular readers remain untouched.

---

# Validation Requirements

## Fixture Validation

Confirm all 26 known singular engine-test callers have been converted to plural input.

Confirm no behavioral assertion required reinterpretation.

---

## Reference Validation

After implementation, confirm no executable `generateSchedulePreview` call supplies singular `shiftCycle`.

Distinguish:

* durable serialized properties;
* local single-cycle variables;
* entity identifiers;
* historical documentation.

---

## Targeted Validation

Run:

* `generateSchedulePreview` tests;
* `generateCycleWorkBlocks` tests;
* `generateBlockCandidates` tests;
* effective-preference tests;
* store Preview-generation tests;
* manual-event/friction/suggested-fix coverage where applicable.

Confirm the full Preview pipeline remains behaviorally equivalent.

---

## Core Vocabulary Validation

After Task 1.17, confirm the collection input contracts for:

* `generateSchedulePreview`;
* `generateCycleWorkBlocks`;
* `generateBlockCandidates`;
* `getActiveShiftSegment`;

no longer accept singular collection alias `shiftCycle`.

Entity-level parameters representing a single current cycle are not compatibility aliases and should remain.

---

## Full Validation

Run:

* `npm run lint`
* `npm run typecheck`
* `npm test -- --run`
* `npm run build`

Run `git diff --check` for affected executable files if consistent with current repository practice.

---

# Architectural Validation

Confirm the primary Preview-generation boundary changes from:

```text id="t117arch1"
GenerateSchedulePreviewInput
    ├── shiftCycles?
    └── shiftCycle?
```

to:

```text id="t117arch2"
GenerateSchedulePreviewInput
    └── shiftCycles?
```

with resolution changing from:

```text id="t117arch3"
plural ?? singular fallback ?? []
```

to:

```text id="t117arch4"
plural ?? []
```

Confirm the complete supported core collection vocabulary is now:

```text id="t117arch5"
generateSchedulePreview
    ↓ shiftCycles
generateCycleWorkBlocks

generateSchedulePreview
    ↓ shiftCycles
generateBlockCandidates

effective preference resolution
    ↓ shiftCycles
getActiveShiftSegment
```

No singular collection compatibility alias should remain across those core boundaries.

---

# Required Result

The result artifact should include:

| Concern                     | Before   | After     |
| --------------------------- | -------- | --------- |
| Production singular callers | 0        | 0         |
| Test singular callers       | 26       | 0         |
| Singular input property     | Present  | Removed   |
| Optional plural input       | Present  | Present   |
| Empty-cycle behavior        | Current  | Unchanged |
| Downstream plural calls     | Current  | Unchanged |
| Preview behavior            | Current  | Unchanged |
| Durable singular readers    | Retained | Retained  |

Also record:

* exact files changed;
* exact number of test callers converted;
* whether any unexpected caller appeared;
* whether any test meaning changed;
* whether any downstream API required modification;
* whether all four core collection boundaries are now singular-alias-free.

---

# Documentation Updates

At completion:

* preserve this Task 1.17 specification unchanged;
* create
  `TASK_1.17_REMOVE_TEST_ONLY_GENERATE_SCHEDULE_PREVIEW_SHIFT_CYCLE_ALIAS_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include Task 1.17 in the next Session Checkpoint;
* do not create a task-specific checkpoint unless separately authorized;
* do not update `CHANGELOG.md` solely for this bounded core cleanup.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.17 is complete when:

* all 26 known singular engine-test callers have been converted to plural input;
* no supported production singular caller exists;
* singular `shiftCycle` has been removed from `GenerateSchedulePreviewInput`;
* the singular fallback has been removed;
* optional plural `shiftCycles` remains supported;
* existing empty-cycle behavior remains unchanged;
* downstream core calls remain plural;
* work generation remains unchanged;
* candidate generation remains unchanged;
* placement remains unchanged;
* manual-event behavior remains unchanged;
* friction detection remains unchanged;
* suggested-fix behavior remains unchanged;
* date/boundary semantics remain unchanged;
* deterministic Preview behavior remains unchanged;
* durable singular readers remain untouched;
* all four core collection boundaries are singular-alias-free;
* relevant tests pass;
* lint passes;
* type checking passes;
* the full automated suite passes;
* the production build passes;
* the result artifact records the completed core vocabulary simplification.

---

# Risks

Primary risks include:

* accidentally changing an inline cycle fixture while wrapping it in an array;
* changing empty-cycle behavior;
* touching durable singular properties with the same name;
* modifying downstream APIs unnecessarily;
* changing date or preference semantics while simplifying input resolution;
* weakening engine coverage by altering assertions rather than only fixture shape.

This task should remain mechanical and behavior-preserving despite the larger number of test callers.

---

# Deferred Work

This task does not resolve:

* durable singular reader retirement;
* compatibility-horizon policy;
* `DayFrameAuthoredSetup` compatibility typing;
* profile/backup validator permissiveness;
* seeded-store behavior;
* manual-event ownership;
* feedback aggregation;
* focus/continuity ownership;
* duplicated date conversions;
* persistence-failure authority.

These remain separate Phase 1 concerns.

---

# Expected Outcome

After Task 1.17, the supported core scheduling pipeline will use one collection vocabulary throughout:

```text id="t117outcome1"
shiftCycles
```

Tests will exercise the same plural input contracts as production.

Historical singular compatibility will remain only where historical durable data is actually read.

The core scheduling layer will no longer carry singular collection aliases inherited from the earlier one-cycle model.

---

# Task Determination

Task 1.17 removes the final test-only singular collection alias from the core scheduling pipeline after executable evidence established that production already uses plural cycles throughout.

It does not remove historical durable readers or alter scheduling behavior.

It completes the staged core API convergence begun in Tasks 1.14–1.16.

**The task is complete when every test-only `generateSchedulePreview.shiftCycle` caller has been migrated to plural `shiftCycles`, the singular input alias has been removed, and supported Preview-generation behavior remains unchanged.**
