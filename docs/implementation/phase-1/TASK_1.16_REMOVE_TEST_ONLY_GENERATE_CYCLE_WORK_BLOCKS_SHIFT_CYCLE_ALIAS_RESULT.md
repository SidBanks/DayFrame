# Task 1.16 Result — Remove the Test-Only `generateCycleWorkBlocks.shiftCycle` Alias

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.16  
**Result date:** 2026-08-12  
**Execution status:** Complete; project review pending

## Implementation completed

All seven test-only singular callers of `generateCycleWorkBlocks` now supply
one-element plural `shiftCycles` arrays. The singular collection property has been
removed from `GenerateCycleWorkBlocksInput`, and the existing normalization input
now resolves through:

```text
input.shiftCycles ?? []
```

Normalization, validation, work-block generation, both production callers, and
entity-level single-cycle parameters remain unchanged.

## Required result

| Concern | Before | After |
| --- | --- | --- |
| Production singular callers | 0 | 0 |
| Test singular callers | 7 | 0 |
| Singular input property | Present | Removed |
| Optional plural input | Present | Present |
| Omitted-cycle default | Existing empty behavior | Unchanged |
| Normalization | Current | Unchanged |
| Validation | Current | Unchanged |
| Work-block behavior | Current | Unchanged |

## Test callers modernized

Seven direct calls in
`code/src/core/cycles/__tests__/generateCycleWorkBlocks.test.ts` changed
mechanically from:

```text
shiftCycle: cycle
```

to:

```text
shiftCycles: [cycle]
```

The cycle and shift-definition objects, planning windows, preferences, expected
blocks, null/empty outcomes, and error assertions were not reinterpreted or
otherwise changed.

## Input contract changes

The collection boundary changed from:

```text
GenerateCycleWorkBlocksInput
    |- shiftCycles?: ShiftCycle[]
    `- shiftCycle?: ShiftCycle
```

to:

```text
GenerateCycleWorkBlocksInput
    `- shiftCycles?: ShiftCycle[]
```

Plural input remains optional, and no replacement alias was introduced.

Internal helper inputs named `shiftCycle` still represent the current cycle being
processed during plural iteration. Those required entity parameters are not
collection compatibility aliases and were intentionally preserved.

## Fallback behavior before and after

Before normalization, the input changed from:

```text
input.shiftCycles ?? (input.shiftCycle ? [input.shiftCycle] : [])
```

to:

```text
input.shiftCycles ?? []
```

Each former singular test call now directly supplies the same one-element array
that the removed branch constructed. Omission still supplies an empty array to the
same normalizer.

## Normalization and validation preservation

The implementation continues in the same order:

```text
shiftCycles ?? []
      |
      v
normalizeShiftCycles
      |
      v
validate planning window
      |
      v
validateShiftCycles
      |
      v
generate and sort work blocks
```

`normalizeShiftCycles` and `validateShiftCycles` were not edited, moved, combined,
or bypassed. Manual-segment validation, repeating-sequence validation, overlap
errors, missing-definition errors, preference resolution, and sorting therefore
remain on their established paths.

## Caller and reference validation

A syntax-tree audit after implementation found nine executable
`generateCycleWorkBlocks` calls:

- two production calls, from `generateSchedulePreview` and
  `previewRangeWarnings`;
- seven direct unit-test calls;
- all nine pass plural `shiftCycles`;
- zero pass singular `shiftCycle`.

No unexpected caller appeared. The remaining `GenerateSchedulePreviewInput`
singular alias and its fallback were not modified.

## Behavioral equivalence

Targeted and regression coverage confirms unchanged behavior for:

- multiple manual segments;
- overnight work windows;
- visible planning-window overlap;
- missing shift-definition errors;
- repeating sequences and off days;
- effective scheduling preferences;
- normalized cycle defaults;
- deterministic work-block ordering;
- Preview generation and range warnings.

Both supported production callers already passed plural cycles and required no
modification.

## Files changed

Executable changes for Task 1.16:

- `code/src/core/cycles/types.ts`
- `code/src/core/cycles/generateCycleWorkBlocks.ts`
- `code/src/core/cycles/__tests__/generateCycleWorkBlocks.test.ts`

Execution documentation:

- `docs/implementation/phase-1/TASK_1.16_REMOVE_TEST_ONLY_GENERATE_CYCLE_WORK_BLOCKS_SHIFT_CYCLE_ALIAS_RESULT.md`

Existing unrelated worktree changes were preserved.

## Validation performed

- Caller audit: 9 plural calls, 0 singular calls.
- Targeted cycle-work-block, Preview-engine, range-warning, active-segment, and
  store suites — passed: 5 files and 66 tests.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test -- --run` — passed: 22 files and 244 tests.
- `npm run build` — passed.
- `git diff --check` for affected executable files — passed.

The immutable Task 1.16 artifact passed its integrity check, ended with the
required sentence, and retained SHA-256
`3098de143cac0bd962361d873fa915d51723d01a66e892771cc69a83f283c57f`.

## Architectural result

`generateCycleWorkBlocks` now exposes only the plural collection vocabulary used
by supported production scheduling. Its tests enter through that same boundary,
while the normalizer and validator remain the sole authorities for accepted cycle
content.

## Deviations

None. Exactly one test-only collection input alias was removed.

## Discoveries and deferred work

- `GenerateSchedulePreviewInput.shiftCycle` remains unchanged with 26 historical
  engine-test callers.
- Durable singular readers, runtime state, store APIs, and authored compatibility
  types remain unchanged.
- `CURRENT_STATE.md` remains unchanged until project review.
- `CHANGELOG.md` was not updated for this bounded cleanup.
- No task-specific checkpoint was created, as required by Task 1.16.

## Recommended next task

**Task 1.17 — Remove the Test-Only `generateSchedulePreview.shiftCycle` Alias**
should mechanically convert its 26 direct engine-test callers, then remove the
final singular core scheduling collection property and fallback while preserving
all plural downstream calls and scheduling behavior.

## Final completion determination

Task 1.16 is complete. Every test-only `generateCycleWorkBlocks.shiftCycle` caller
has been migrated to plural `shiftCycles`, the singular input alias has been
removed, and supported work-block generation behavior remains unchanged.
