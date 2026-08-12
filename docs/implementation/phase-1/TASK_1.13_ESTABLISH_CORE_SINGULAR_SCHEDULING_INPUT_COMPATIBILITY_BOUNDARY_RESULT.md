# Task 1.13 Result — Core Singular Scheduling Input Compatibility Boundary

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.13  
**Result date:** 2026-08-12  
**Execution status:** Investigation complete; project review pending

## Architectural determination

The supported production scheduling vocabulary is already plural
`shiftCycles`. No production caller passes singular `shiftCycle` to a core
scheduling function, and no affected function is exposed through a supported
package or library boundary.

Four singular core inputs remain:

- three are **Test/Fixture Convenience** used by production-behavior tests written
  with historical one-cycle shapes;
- `generateBlockCandidates.shiftCycle` is an **Obsolete Compatibility Structure**
  with no caller at all.

Every singular path merely creates a zero- or one-element plural array. None owns
behavior unavailable through the plural input.

## Core Compatibility Report

| Core Boundary | Production Singular Caller? | Test Singular Callers | Exported Contract? | Unique Singular Behavior? | Classification | Candidate Next Step |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| `generateSchedulePreview` | 0 | 26 in one file | No supported external contract | No; resolves immediately to `[input.shiftCycle]` or `[]` | **Test/Fixture Convenience** | Convert 26 calls to plural, then remove the property/fallback |
| `generateCycleWorkBlocks` | 0 | 7 in one file | No supported external contract | No; creates an array and applies the same cycle normalizer | **Test/Fixture Convenience** | Convert 7 calls to plural, then remove its independent property/fallback |
| `getActiveShiftSegment` | 0 | 5 in one file | No supported external contract | No; resolves immediately to a zero-/one-element array | **Test/Fixture Convenience** | Convert 5 calls to plural, then remove its property/fallback |
| `generateBlockCandidates` | 0 | 0 | No supported external contract | No; resolves immediately to a zero-/one-element array | **Obsolete Compatibility Structure** | Remove the unused singular property and fallback first; preserve optional empty plural behavior |

No additional core function input with a singular compatibility property was
found. Other `shiftCycle` parameters are ordinary local/entity parameters for one
cycle, not aliases for a collection input.

## Core API inventory

### `generateSchedulePreview`

`GenerateSchedulePreviewInput` declares optional `shiftCycles` and `shiftCycle`.
The first executable line gives plural input precedence:

```text
input.shiftCycles ?? (input.shiftCycle ? [input.shiftCycle] : [])
```

The resulting local plural array is used throughout preview generation and passed
to `generateCycleWorkBlocks`, `generateBlockCandidates`, preference resolution,
manual-event construction, and visible-day calculations. Singular data is not
propagated downstream.

Production has one caller, `dayFrameStore.generatePreview`, which supplies plural
cycles. The engine suite has 27 direct calls: 26 singular and one plural.

### `generateCycleWorkBlocks`

`GenerateCycleWorkBlocksInput` declares the same optional pair. It converts to an
array, then calls `normalizeShiftCycles` and `validateShiftCycles` on that array.
The singular path receives exactly the same normalization, validation, ordering,
preference resolution, and block generation as a one-element plural input.

Production has two callers—`generateSchedulePreview` and
`previewRangeWarnings`—and both pass plural arrays. Its unit suite has seven direct
calls, all singular.

The internal `shiftCycle: ShiftCycle` parameters of manual-segment and repeating-
sequence helpers identify the current member during plural iteration. They are
required entity parameters, not compatibility aliases, and are outside removal.

### `getActiveShiftSegment`

`GetActiveShiftSegmentInput` declares the optional pair and immediately resolves
the same plural-first fallback. Selection, overlap validation, mode handling, and
segment lookup operate only on the resulting array.

Its sole production caller is `resolveEffectiveSchedulePreferencesForDate`, which
passes plural cycles. Its unit suite has five direct calls, all singular.

`getActiveShiftCycleForLocalDate` already accepts a required plural array and has
no singular alias.

### `generateBlockCandidates`

`GenerateBlockCandidatesInput` declares the optional pair and immediately resolves
the same plural-first fallback. All candidate generation and effective-preference
work uses the resulting array.

Its sole production caller is `generateSchedulePreview`, which passes plural
cycles. Its nine direct unit-test calls omit both cycle properties and exercise the
existing empty-cycle default; none uses singular or plural input directly.

Future removal should preserve that established optional-empty plural behavior by
changing only the resolution to `input.shiftCycles ?? []`, unless a separately
authorized task chooses to require explicit empty arrays.

## Supported production dependency map

```text
SUPPORTED PRODUCTION

DayFrameState.shiftCycles
        |
        v
dayFrameStore.generatePreview
        |
        v
generateSchedulePreview({ shiftCycles })
        |- generateCycleWorkBlocks({ shiftCycles })
        |- generateBlockCandidates({ shiftCycles })
        `- effective-preference helpers({ shiftCycles })

previewRangeWarnings
        `- generateCycleWorkBlocks({ shiftCycles })

resolveEffectiveSchedulePreferencesForDate
        `- getActiveShiftSegment({ shiftCycles })
```

No supported production edge uses or propagates singular input.

## Remaining singular test paths

```text
ENGINE TESTS (26)
  -> generateSchedulePreview({ shiftCycle })
       -> local shiftCycles = [shiftCycle]
       -> downstream plural calls

CYCLE WORK-BLOCK TESTS (7)
  -> generateCycleWorkBlocks({ shiftCycle })
       -> normalizeShiftCycles([shiftCycle])

ACTIVE-SEGMENT TESTS (5)
  -> getActiveShiftSegment({ shiftCycle })
       -> local shiftCycles = [shiftCycle]

BLOCK-CANDIDATE TESTS
  -> 9 calls omit both properties
  -> no singular path exercised
```

These fallbacks are independently resolved at each external function boundary.
`generateSchedulePreview` does not pass singular input to either downstream
function, so removal need not proceed as one coupled chain.

## Test fixture classification and modernization cost

| Test file | Singular direct calls | Classification | Mechanical conversion |
| --- | ---: | --- | --- |
| `src/core/engine/tests/generateSchedulePreview.test.ts` | 26 | Production-behavior tests using historical fixture shapes | `shiftCycle: cycle` -> `shiftCycles: [cycle]`; inline objects wrapped in an array |
| `src/core/cycles/__tests__/generateCycleWorkBlocks.test.ts` | 7 | Fixture convenience | Same one-element wrapping |
| `src/core/cycles/__tests__/getActiveShiftSegment.test.ts` | 5 | Fixture convenience | Same one-element wrapping |
| `src/core/blocks/tests/generateBlockCandidates.test.ts` | 0 | No singular dependency | No fixture conversion needed |

No test name or assertion specifically identifies singular fallback behavior as a
compatibility contract. The assertions protect scheduling semantics—generation,
validation, date boundaries, overlap behavior, preferences, placement, and
visibility—which remain meaningful with plural fixtures.

Total future fixture modernization is 38 direct calls across three files. Each
conversion is mechanical; behavioral assertions need no reinterpretation.

## External and export contract analysis

The affected functions use source-file `export` declarations so other internal
modules and tests can import them. That alone does not establish a supported
external API.

Executable/package inspection found:

- no `package.json` `exports`, `main`, `module`, `types`, or library-build entry;
- no barrel `index.ts` files exporting core modules;
- no declaration-emitting build (`tsconfig` has `noEmit: true`);
- one browser application entry, `src/main.tsx`, which imports only `DayFrameApp`;
- no supported external repository consumer or documented library usage.

Accordingly, none of the four singular properties is an **Externally Supported
Contract**. External consumers importing unpublished source paths cannot be ruled
out absolutely, but the repository defines no support boundary for that usage.

## Unique-behavior analysis

All four functions use plural precedence when both properties are present—even an
empty plural array suppresses the singular fallback. Removing singular input does
not alter supported plural behavior.

- Preview, active-segment, and candidate functions perform direct array wrapping
  only.
- Cycle work-block generation performs normalization after wrapping, but the same
  normalization is applied to plural input.
- No singular branch changes defaults, errors, ordering, validation, date logic,
  recurrence logic, or scheduling output.

There is therefore no unique singular behavior to preserve at these core
boundaries.

## Durable compatibility independence

Local, profile, and backup singular readers normalize historical input into plural
`shiftCycles` before creating or updating current runtime state. Task 1.12 made
runtime state plural-only. The store clones that plural array when invoking
`generateSchedulePreview`, and all downstream production calls stay plural.

No durable reader imports or invokes an affected core scheduling function with a
singular property. Durable compatibility cannot justify retaining these aliases.

## Smallest safe staged removal order

1. **Remove `generateBlockCandidates.shiftCycle` independently.** It has zero
   singular callers and needs no fixture modernization. Preserve `shiftCycles?`
   and its empty-array default so the nine existing tests remain unchanged.
2. **Modernize five `getActiveShiftSegment` calls and remove its alias.** This is
   the smallest caller-bearing boundary and has one plural production caller.
3. **Modernize seven `generateCycleWorkBlocks` calls and remove its alias.** Its
   two production callers already pass plural arrays; retain normalization.
4. **Modernize 26 `generateSchedulePreview` calls and remove its alias.** This is
   the largest fixture migration and can occur last after downstream plural-only
   contracts are established.

Each stage is independently type-checkable and testable. The order is based on
caller count and dependency surface, not a functional coupling requirement.
Steps 2 and 3 could be reversed without architectural risk, but keeping the
smallest change first minimizes review scope.

## Validation performed

- Relevant engine, cycle, block, store, and preview-warning suites passed: 6 files
  and 75 tests.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test -- --run` passed: 22 files and 244 tests.
- `npm run build` passed.
- No production code or test was changed.

The immutable Task 1.13 artifact passed its integrity check, ended with the
required sentence, and retained SHA-256
`8ce05a0e7679ae566fd287762f7d3e865807720c35f3a6d90efe621ab073d00d`.

## Deviations and uncertainty

- No deviation from the investigative scope occurred.
- No unexpected core singular input or production caller was found.
- The repository cannot prove that nobody imports source files ad hoc outside the
  project, but it exposes no supported package/export boundary for doing so.
- Source-level optional plural inputs also permit omitted cycles. Whether later
  tasks should require explicit plural arrays is a separate contract decision;
  the smallest alias removal preserves current omission behavior.

## Discoveries and deferred work

- Actual core alias and fixture removal remains separately authorized work.
- Durable singular reader retirement and `DayFrameAuthoredSetup` compatibility
  typing remain independent.
- Compatibility-horizon policy, validator permissiveness, and unrelated Phase 1
  findings remain deferred.
- `CURRENT_STATE.md` remains unchanged until project review.
- `CHANGELOG.md` was not updated for this investigation.
- No task-specific checkpoint was created, as required by Task 1.13.

## Recommended next task

**Task 1.14 — Remove the Unused `generateBlockCandidates.shiftCycle` Alias** should
remove only that input property and change its local resolution to
`input.shiftCycles ?? []`. It should not require plural input, modify its nine test
fixtures, or touch the other three singular core boundaries.

## Final completion determination

Task 1.13 is complete. Executable evidence establishes that three core singular
inputs are obsolete test/fixture conveniences and one is an entirely unused
compatibility structure. None is a supported production or external contract, and
the smallest safe staged removal begins with the isolated block-candidate alias.
