# Task 1.15 Result — Remove the Test-Only `getActiveShiftSegment.shiftCycle` Alias

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.15  
**Result date:** 2026-08-12  
**Execution status:** Complete; project review pending

## Implementation completed

All five test-only singular callers of `getActiveShiftSegment` now supply
one-element plural `shiftCycles` arrays. The singular property has been removed
from `GetActiveShiftSegmentInput`, and omitted input now resolves directly through:

```text
input.shiftCycles ?? []
```

No production caller, durable reader, adjacent core API, or behavior required a
broader change.

## Required result

| Concern | Before | After |
| --- | --- | --- |
| Production singular callers | 0 | 0 |
| Test singular callers | 5 | 0 |
| Singular input property | Present | Removed |
| Optional plural input | Present | Present |
| Omitted-cycle default | `[]` | `[]` |
| Preference behavior | Current | Unchanged |

## Test callers modernized

Five direct calls in
`code/src/core/cycles/__tests__/getActiveShiftSegment.test.ts` changed
mechanically from:

```text
shiftCycle: cycle
```

to:

```text
shiftCycles: [cycle]
```

The cycle objects, dates, expected selections, null results, and overlap-error
assertion were unchanged. No test meaning required reinterpretation.

## Input contract changes

The boundary changed from:

```text
GetActiveShiftSegmentInput
    |- shiftCycles?: ShiftCycle[]
    `- shiftCycle?: ShiftCycle
```

to:

```text
GetActiveShiftSegmentInput
    `- shiftCycles?: ShiftCycle[]
```

Plural input remains optional, and no replacement alias was introduced.

## Fallback behavior before and after

Before:

```text
input.shiftCycles ?? (input.shiftCycle ? [input.shiftCycle] : [])
```

After:

```text
input.shiftCycles ?? []
```

Every former singular test caller now provides the same one-element array that the
fallback previously constructed. Omitted input still produces an empty array.
Selection, cycle validation, overlap errors, manual/repeating mode handling, and
segment matching are otherwise untouched.

## Caller and reference validation

A syntax-tree audit after implementation found six executable
`getActiveShiftSegment` calls:

- one production call from effective preference resolution;
- five direct unit-test calls;
- all six pass plural `shiftCycles`;
- zero pass singular `shiftCycle`.

No unexpected caller appeared. Entity-level parameters and local variables named
`shiftCycle` were not modified because they do not represent the removed input
alias.

## Behavioral equivalence

The removed branch performed only one-element array construction. Tests cover:

- active segment selection;
- no matching segment;
- inclusive segment boundaries;
- overlap rejection;
- repeating-sequence mode returning no manual segment.

The production preference resolver already passed plural cycles and its code was
not changed. Transitive store, Preview, and warning coverage confirms preference
and scheduling behavior remains equivalent.

## Files changed

Executable changes for Task 1.15:

- `code/src/core/cycles/types.ts`
- `code/src/core/cycles/getActiveShiftSegment.ts`
- `code/src/core/cycles/__tests__/getActiveShiftSegment.test.ts`

Execution documentation:

- `docs/implementation/phase-1/TASK_1.15_REMOVE_TEST_ONLY_GET_ACTIVE_SHIFT_SEGMENT_SHIFT_CYCLE_ALIAS_RESULT.md`

Existing unrelated worktree changes were preserved.

## Validation performed

- Caller audit: 6 plural calls, 0 singular calls.
- Targeted active-segment, cycle-work-block, Preview-engine, warning, and store
  suites — passed: 5 files and 66 tests.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test -- --run` — passed: 22 files and 244 tests.
- `npm run build` — passed.
- `git diff --check` for affected executable files — passed.

The immutable Task 1.15 artifact passed its integrity check, ended with the
required sentence, and retained SHA-256
`b54f87b8ca2c5f700fb69129e90d62af32c782be43b684b041abc7880ad2243f`.

## Architectural result

`getActiveShiftSegment` now exposes only the plural scheduling vocabulary used by
supported production preference resolution. Its tests use that same boundary, and
optional empty behavior remains available without a singular compatibility path.

## Deviations

None. Exactly one test-only core alias was removed.

## Discoveries and deferred work

- `GenerateCycleWorkBlocksInput.shiftCycle` remains unchanged with seven
  historical test callers.
- `GenerateSchedulePreviewInput.shiftCycle` remains unchanged with 26 historical
  test callers.
- Durable singular readers, runtime state, store APIs, and authored compatibility
  types remain unchanged.
- `CURRENT_STATE.md` remains unchanged until project review.
- `CHANGELOG.md` was not updated for this bounded cleanup.
- No task-specific checkpoint was created, as required by Task 1.15.

## Recommended next task

**Task 1.16 — Remove the Test-Only `generateCycleWorkBlocks.shiftCycle` Alias**
should mechanically convert its seven direct test callers, then remove only that
input property and fallback while preserving normalization and plural production
callers.

## Final completion determination

Task 1.15 is complete. Every test-only `getActiveShiftSegment.shiftCycle` caller
has been migrated to plural `shiftCycles`, the singular input alias has been
removed, and supported preference-resolution behavior remains unchanged.
