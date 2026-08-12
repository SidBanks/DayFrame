# Task 1.14 Result — Remove the Unused `generateBlockCandidates.shiftCycle` Alias

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.14  
**Result date:** 2026-08-12  
**Execution status:** Complete; project review pending

## Implementation completed

The unused singular `shiftCycle` property has been removed from
`GenerateBlockCandidatesInput`, and `generateBlockCandidates` now resolves its
cycle collection with:

```text
input.shiftCycles ?? []
```

Optional plural input and omitted-cycle behavior are unchanged. No fixture or
caller modification was required.

## Required result

| Concern | Before | After |
| --- | --- | --- |
| Production singular callers | 0 | 0 |
| Test singular callers | 0 | 0 |
| Singular input property | Present | Removed |
| Optional plural input | Present | Present |
| Omitted-cycle default | `[]` | `[]` |
| Candidate behavior | Current | Unchanged |

## Input contract changes

The boundary changed from:

```text
GenerateBlockCandidatesInput
    |- shiftCycles?: ShiftCycle[]
    `- shiftCycle?: ShiftCycle
```

to:

```text
GenerateBlockCandidatesInput
    `- shiftCycles?: ShiftCycle[]
```

No replacement singular alias was introduced, and `shiftCycles` was not made
required.

## Fallback behavior before and after

Before:

```text
input.shiftCycles ?? (input.shiftCycle ? [input.shiftCycle] : [])
```

After:

```text
input.shiftCycles ?? []
```

The removed branch had no executable caller. Supplying plural cycles still uses
that array, while omission still resolves to an empty array. Candidate generation,
effective preferences, date boundaries, recurrences, ordering, and errors were not
changed.

## Caller and reference validation

Syntax-tree audits before and after implementation found 10 executable
`generateBlockCandidates` calls:

- one production call from `generateSchedulePreview`, supplying `shiftCycles`;
- nine direct test calls, omitting cycle input;
- zero calls supplying singular `shiftCycle`.

After implementation, no singular `shiftCycle` input property remains in the
block-candidate core boundary. No unexpected caller or unique behavior appeared.

## Files changed

Executable changes for Task 1.14:

- `code/src/core/blocks/types.ts`
- `code/src/core/blocks/generateBlockCandidates.ts`

Execution documentation:

- `docs/implementation/phase-1/TASK_1.14_REMOVE_UNUSED_GENERATE_BLOCK_CANDIDATES_SHIFT_CYCLE_ALIAS_RESULT.md`

Existing unrelated worktree changes were preserved.

## Tests

No test fixture required modification. The nine direct block-candidate tests still
omit cycle input and therefore continue to exercise the empty-array default.
Engine tests continue to exercise the production plural path.

Validation performed:

- Targeted block, Preview-engine, cycle-work-block, and active-segment suites —
  passed: 4 files and 48 tests.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test -- --run` — passed: 22 files and 244 tests.
- `npm run build` — passed.
- `git diff --check` for both executable files — passed.

The immutable Task 1.14 artifact passed its integrity check, ended with the
required final sentence, and retained SHA-256
`d3c2847a32b9eaebdfb027afc89183b7de56735428e83d501b7eb115563cd57e`.

## Architectural result

`generateBlockCandidates` now expresses only its supported cycle vocabulary:
optional plural `shiftCycles`, with omission meaning no cycles. One zero-caller
compatibility branch has been eliminated without changing behavior.

## Deviations

None. The implementation removed exactly one unused core alias.

## Discoveries and deferred work

- Singular inputs accepted by `getActiveShiftSegment`,
  `generateCycleWorkBlocks`, and `generateSchedulePreview` remain unchanged.
- Their 38 historical test callers remain for separately authorized staged work.
- Durable singular readers, runtime state, store APIs, and authored compatibility
  types were not changed.
- `CURRENT_STATE.md` remains unchanged until project review.
- `CHANGELOG.md` was not updated for this bounded cleanup.
- No task-specific checkpoint was created, as required by Task 1.14.

## Recommended next task

**Task 1.15 — Remove the Test-Only `getActiveShiftSegment.shiftCycle` Alias**
should mechanically convert its five direct unit-test callers to plural arrays,
then remove only that input property and fallback. Other core aliases and durable
readers should remain unchanged.

## Final completion determination

Task 1.14 is complete. `generateBlockCandidates` no longer accepts singular
`shiftCycle`, existing optional plural and empty behavior remains unchanged, and
all supported scheduling behavior passes validation.
