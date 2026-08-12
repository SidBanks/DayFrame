# Task 1.17 Result — Remove the Test-Only `generateSchedulePreview.shiftCycle` Alias

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.17  
**Result date:** 2026-08-12  
**Execution status:** Complete; project review pending

## Implementation completed

All 26 test-only singular callers of `generateSchedulePreview` now supply plural
`shiftCycles` arrays. The singular property has been removed from
`GenerateSchedulePreviewInput`, and omitted cycles now resolve directly through:

```text
input.shiftCycles ?? []
```

The production caller and every downstream core call remain plural. This removes
the final singular collection alias from the core scheduling pipeline.

## Required result

| Concern | Before | After |
| --- | --- | --- |
| Production singular callers | 0 | 0 |
| Test singular callers | 26 | 0 |
| Singular input property | Present | Removed |
| Optional plural input | Present | Present |
| Empty-cycle behavior | Current | Unchanged |
| Downstream plural calls | Current | Unchanged |
| Preview behavior | Current | Unchanged |
| Durable singular readers | Retained | Retained |

## Test callers modernized

Twenty-six direct calls in
`code/src/core/engine/tests/generateSchedulePreview.test.ts` were converted:

- 10 shorthand `shiftCycle` values became `shiftCycles: [shiftCycle]`;
- 16 inline `shiftCycle: { ... }` objects became
  `shiftCycles: [{ ... }]`.

Every cycle field, planning window, preference, shift definition, template,
recurrence, manual event, and behavioral assertion was preserved. No test meaning
required reinterpretation.

The file's syntax tree was checked after the mechanical wrapping to confirm valid
structure before tests ran.

## Input contract changes

The primary Preview boundary changed from:

```text
GenerateSchedulePreviewInput
    |- shiftCycles?: ShiftCycle[]
    `- shiftCycle?: ShiftCycle
```

to:

```text
GenerateSchedulePreviewInput
    `- shiftCycles?: ShiftCycle[]
```

Plural input remains optional, and no replacement singular alias was introduced.

## Fallback behavior before and after

Before:

```text
input.shiftCycles ?? (input.shiftCycle ? [input.shiftCycle] : [])
```

After:

```text
input.shiftCycles ?? []
```

Every former singular caller now directly supplies the same one-element array the
removed fallback constructed. Existing omission continues to produce an empty
array, and no later empty-cycle behavior was changed.

## Downstream plural-call preservation

The resolved `shiftCycles` array continues unchanged through:

```text
generateSchedulePreview
    |- generateCycleWorkBlocks({ shiftCycles })
    |- generateBlockCandidates({ shiftCycles })
    |- effective preference resolution({ shiftCycles })
    |- visible-day/range calculations(shiftCycles)
    `- manual-event scheduling(shiftCycles)
```

No downstream API required modification. Tasks 1.14–1.16 had already made the
affected collection boundaries plural-only.

## Caller and reference validation

A syntax-tree audit after implementation found 28 executable
`generateSchedulePreview` calls:

- one plural production call from `dayFrameStore`;
- 27 plural direct engine-test calls (26 converted and one pre-existing);
- zero singular calls;
- zero omitted calls.

Repository inspection confirms all four targeted core collection contracts are
now free of singular `shiftCycle` aliases:

- `GenerateSchedulePreviewInput`;
- `GenerateCycleWorkBlocksInput`;
- `GenerateBlockCandidatesInput`;
- `GetActiveShiftSegmentInput`.

Remaining singular terminology identifies durable serialized properties, local
single-cycle variables, internal current-cycle entity parameters, or identifiers
such as `shiftCycleId`; none is a core collection alias.

## Behavioral equivalence

The removed branch owned only one-element array construction. The targeted suites
continue to cover the complete Preview pipeline, including:

- work-block and block-candidate generation;
- placement and unplaced candidates;
- manual calendar events;
- friction detection and classifications;
- suggested fixes;
- effective schedule preferences;
- overnight and user-day boundary behavior;
- Preview range expansion and filtering;
- repeating sequences and off days;
- deterministic ordering and output.

No scheduling, validation, normalization, date, preference, or empty-cycle logic
was changed.

## Files changed

Executable changes for Task 1.17:

- `code/src/core/engine/generateSchedulePreview.ts`
- `code/src/core/engine/tests/generateSchedulePreview.test.ts`

Execution documentation:

- `docs/implementation/phase-1/TASK_1.17_REMOVE_TEST_ONLY_GENERATE_SCHEDULE_PREVIEW_SHIFT_CYCLE_ALIAS_RESULT.md`

Existing unrelated worktree changes were preserved.

## Validation performed

- Caller audit: 28 plural calls, 0 singular calls.
- Core vocabulary audit: all four collection input contracts are singular-alias-
  free.
- Targeted Preview-engine, cycle-work-block, block-candidate, active-segment,
  store, range-warning, friction, and suggested-fix suites — passed: 8 files and
  93 tests.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test -- --run` — passed: 22 files and 244 tests.
- `npm run build` — passed.
- `git diff --check` for affected executable files — passed.

The immutable Task 1.17 artifact passed its integrity check, ended with the
required sentence, and retained SHA-256
`e5c066580b473fba1caa87f12b7aa900d15fa361b90e65d7e9c5c58f496a06b1`.

## Architectural result

The supported core scheduling pipeline now uses one collection vocabulary:

```text
DayFrameState.shiftCycles
        |
        v
generateSchedulePreview({ shiftCycles })
        |- generateCycleWorkBlocks({ shiftCycles })
        `- generateBlockCandidates({ shiftCycles })

effective preference resolution
        `- getActiveShiftSegment({ shiftCycles })
```

Historical singular compatibility remains only at durable-data reader boundaries,
not in current runtime or core scheduling collection APIs.

## Deviations

None. Exactly the final test-only core collection alias was removed. During the
mechanical inline-object conversion, a syntax-tree check detected temporary
misplaced array closings before validation; those edits were corrected so the
final diff contains only the intended fixture wrapping.

## Discoveries and deferred work

- Durable local/profile/backup singular readers remain intact.
- `DayFrameAuthoredSetup` compatibility typing, validator permissiveness, durable
  reader retirement, and compatibility-horizon policy remain deferred.
- Seeded-store behavior and other Phase 1 ownership findings remain outside this
  task.
- `CURRENT_STATE.md` remains unchanged until project review.
- `CHANGELOG.md` was not updated for this bounded cleanup.
- No task-specific checkpoint was created, as required by Task 1.17.

## Recommended next task

The next investigation should establish the remaining responsibility and removal
dependencies of the optional singular property on `DayFrameAuthoredSetup`, while
preserving raw local/profile/backup reader compatibility. It should determine
whether current normalized authored data can become plural-only without changing
the V1 durable input boundary.

## Final completion determination

Task 1.17 is complete. Every test-only `generateSchedulePreview.shiftCycle` caller
has been migrated to plural `shiftCycles`, the singular input alias has been
removed, and supported Preview-generation behavior remains unchanged.
