# Task 1.12 Result — Remove the Obsolete Runtime `shiftCycle` Mirror

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.12  
**Result date:** 2026-08-12  
**Execution status:** Complete; project review pending

## Implementation completed

Current `DayFrameState` is now plural-only for shift-cycle authority. The obsolete
runtime `shiftCycle` field, singular store-initialization fallback, initial-state
mirror synthesis, and snapshot mirror synthesis have been removed.

All 12 identified non-migration `DayFrameApp` store fixtures now initialize
`shiftCycles: [cycle]`. Genuine singular durable-data fixtures remain singular at
their raw local-storage, profile, and backup input boundaries.

## Required result

| Concern | Before | After |
| --- | --- | --- |
| Runtime `DayFrameState.shiftCycle` | Present | Removed |
| Runtime `shiftCycles` | Authoritative | Unchanged |
| Singular `createDayFrameStore` fixture input | 12 known fixtures | 0 |
| Runtime singular synthesis in initial state | Present | Removed |
| Runtime singular synthesis in snapshots | Present | Removed |
| Local singular reader | Retained | Retained |
| Profile singular reader | Retained | Retained |
| Backup singular reader | Retained | Retained |
| Core singular APIs | Retained | Retained |

## Fixtures modernized

Twelve inline store initializers in `code/src/ui/tests/DayFrameApp.test.tsx` were
converted mechanically from:

```text
shiftCycle: cycle
```

to:

```text
shiftCycles: [cycle]
```

The represented cycle objects and all surrounding fixture state were preserved.
A syntax-tree check confirms zero direct `createDayFrameStore` object arguments
now contain a `shiftCycle` property.

One additional singular property in that test file was intentionally retained: it
is embedded in a literal local-storage payload and directly proves legacy durable
compatibility. It is not a store initializer.

## Runtime state changes

`shiftCycle?: ShiftCycle | null` was removed from `DayFrameState`. The existing
plural `shiftCycles: ShiftCycle[]` field remains unchanged and continues to supply
all scheduling, UI, Preview, and persistence behavior.

`DayFrameAuthoredSetup.shiftCycle` was not removed because it belongs to the
separately deferred durable-format compatibility shape, not current runtime state.

## Store initialization changes

`mergeInitialState` no longer converts `initialState.shiftCycle` to a one-element
plural array. It now selects an explicitly supplied `initialState.shiftCycles` or
the already normalized base-state plural array.

The contract remains:

```text
initialState?: Partial<DayFrameState>
```

Type checking confirms this remains sufficient. No replacement initialization
type or alias was introduced.

## Initial state and snapshot changes

`createInitialDayFrameState` continues to normalize raw durable singular input
into `shiftCycles`, but no longer adds the first plural member back to runtime
state as `shiftCycle`.

`cloneState` continues to clone plural cycles using the same clone helper. It no
longer declares a local array solely to synthesize a singular mirror and no longer
returns that mirror.

Tests that asserted only mirror equivalence were removed or redirected to their
existing plural assertions. The initial-state shape assertion now directly proves
that runtime state exposes plural cycles without a replacement convenience field.

## Durable-reader preservation

The following compatibility paths were inspected and left unchanged:

```text
legacy local shiftCycle
  -> normalizePersistedShiftCycles
  -> DayFrameState.shiftCycles

legacy profile shiftCycle
  -> profile raw-record normalizer
  -> saved profile shiftCycles
  -> DayFrameState.shiftCycles

legacy V1 backup shiftCycle
  -> backup validator/normalizer
  -> backup data shiftCycles
  -> DayFrameState.shiftCycles
```

Literal singular-only fixtures for all three paths remain intact, and their tests
continue to assert plural authority after normalization.

## Runtime reference validation

No executable current-state read, write, initializer fallback, or synthesis for
`DayFrameState.shiftCycle` remains.

Remaining `shiftCycle` text belongs only to:

- raw durable-data properties and compatibility tests;
- the deferred `DayFrameAuthoredSetup` compatibility property;
- core singular scheduling inputs explicitly excluded from Task 1.12;
- local variables representing an individual cycle;
- entity identifiers such as `shiftCycleId`.

No unexpected runtime consumer or durable-reader coupling appeared.

## Files changed

Executable changes for Task 1.12:

- `code/src/state/types.ts`
- `code/src/state/createInitialDayFrameState.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- `code/src/ui/tests/DayFrameApp.test.tsx`

Execution documentation:

- `docs/implementation/phase-1/TASK_1.12_REMOVE_OBSOLETE_RUNTIME_SHIFT_CYCLE_MIRROR_RESULT.md`

The worktree contained changes from earlier tasks. They were preserved; Task 1.12
changed only the bounded runtime, fixture, assertion, and result-artifact lines
listed above.

## Tests updated

- Twelve current-state UI fixtures now use plural initialization.
- The default initial-state assertion no longer expects a singular mirror.
- One general store mirror assertion was removed while retaining its plural state
  assertion.
- Singular-only backup and profile import assertions now rely solely on their
  existing plural authority assertions.
- Literal singular durable inputs were not modernized.

No new derived convenience property or replacement assertion was added.

## Validation performed

- TypeScript syntax-tree fixture audit: zero singular store initializers; 13 plural
  store initializers (12 converted plus one pre-existing).
- `npm run typecheck` — passed.
- Relevant state, profile, backup, UI, Preview-engine, and cycle suites — passed:
  7 files and 120 tests.
- `npm run lint` — passed.
- `npm test -- --run` — passed: 22 files and 244 tests.
- `npm run build` — passed.
- `git diff --check` for affected executable files — passed.

The immutable Task 1.12 artifact passed its pre-execution integrity check, ended
with the required sentence, and retained SHA-256
`6c240cf78e53c8de2be688257a3bdf0dd6ea663db06b73246385a96295b58969`.

## Architectural result

The active boundary is now:

```text
RAW HISTORICAL INPUT
    shiftCycle permitted
          |
          v
durable reader normalization
          |
          v
CURRENT RUNTIME STATE
    shiftCycles only
```

Runtime state and current store initialization use the same plural vocabulary as
supported production behavior. Historical compatibility remains isolated at the
boundaries where historical information is actually read.

## Deviations

None. `Partial<DayFrameState>` remained sufficient, and no unexpected dependency
required a scope expansion.

## Discoveries and deferred work

- `DayFrameAuthoredSetup` still combines current plural authored data with an
  optional singular durable-compatibility property. Its type separation remains
  deferred.
- Core singular scheduling inputs and old engine/cycle fixtures remain unchanged.
- Durable-reader retirement, validator permissiveness, format versions, and the
  compatibility horizon remain deferred.
- Other Phase 1 ownership findings remain outside this task.
- `CURRENT_STATE.md` remains unchanged until project review.
- `CHANGELOG.md` was not updated for this runtime cleanup.
- No task-specific checkpoint was created, as required by Task 1.12.

## Recommended next task

The next investigative task should establish the removal boundary for core
singular scheduling input aliases and distinguish test-fixture convenience from
any supported external core API responsibility. Durable reader types and authored
format compatibility should remain outside that task unless separately
authorized.

## Final completion determination

Task 1.12 is complete. Current runtime state is plural-only, obsolete runtime
singular synthesis is removed, all 12 non-migration fixtures use plural
initialization, and every established durable singular reader remains intact.
