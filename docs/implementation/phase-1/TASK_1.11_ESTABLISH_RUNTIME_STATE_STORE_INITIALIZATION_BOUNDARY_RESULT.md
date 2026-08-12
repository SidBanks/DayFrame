# Task 1.11 Result — Runtime State and Store Initialization Boundary

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.11  
**Result date:** 2026-08-12  
**Execution status:** Investigation complete; project review pending

## Architectural determination

The smallest evidence-supported boundary does not require a new initialization
type.

Current production constructs `DayFrameStore` only with no argument. The
`Partial<DayFrameState>` initializer is used to construct test states, and its
singular `shiftCycle` branch is used only by 12 `DayFrameApp` test fixtures. Those
fixtures can represent the same state mechanically as `shiftCycles: [cycle]`.

Legacy durable inputs already enter through boundaries independent of store
initialization:

- local state enters through `PersistedDayFrameState`/the private legacy partial
  input and `createInitialDayFrameState`;
- profiles enter as unknown records through `validateDayFrameProfilesStorage`;
- backups enter as parsed unknown records through `validateDayFrameBackup`.

Each reader resolves plural `shiftCycles` before a current runtime state is used.
Removing runtime `DayFrameState.shiftCycle` therefore does not require weakening or
removing any durable singular reader.

## Runtime State and Store Initialization Boundary Report

| Concern | Current Type/Owner | Actual Callers | Singular Needed? | Classification | Candidate Future Boundary |
| --- | --- | --- | ---: | --- | --- |
| Runtime state | `DayFrameState` | Store, UI, scheduling, snapshots | No | **Obsolete Structure** for `shiftCycle`; plural state otherwise required | `DayFrameState.shiftCycles` only |
| Store initializer | `createDayFrameStore(initialState?: Partial<DayFrameState>)` | Production: one no-argument seeded-store construction. Tests: 40 calls across store/app suites | No for supported production; singular used by 12 UI fixtures | Singular branch: **Test/Fixture Convenience** | Retain `Partial<DayFrameState>` if useful, but after runtime removal it is naturally plural-only |
| Test fixtures | Inline partial state objects | 12 singular initializers, all in `DayFrameApp.test.tsx` | No | **Test/Fixture Convenience** | Replace `shiftCycle: cycle` with `shiftCycles: [cycle]` |
| Local persisted input | `PersistedDayFrameState` plus private `LegacyPersistedDayFrameState` | `loadPersistedState` -> `createInitialDayFrameState` | Yes, for legacy reads | **Transitional Compatibility Structure** | Retain singular property at the raw reader input only |
| Profile legacy input | Unknown `Record<string, unknown>` in profile validator | Parsed V1 profile storage | Yes, for legacy reads | **Transitional Compatibility Structure** | Continue raw-record normalization to plural `DayFrameAuthoredSetup` |
| Backup legacy input | Unknown `Record<string, unknown>` in backup validator | Parsed V1 backup JSON | Yes, for legacy reads | **Transitional Compatibility Structure** | Continue raw-record validation/normalization to plural authored data |
| Snapshot cloning | `cloneState` | `getState`, notifications, returned mutation snapshots | No | **Obsolete Structure** for singular synthesis | Clone plural cycles once; omit first-cycle mirror |

## Boundary classifications

| Boundary | Classification | Evidence |
| --- | --- | --- |
| Runtime `DayFrameState.shiftCycle` | **Obsolete Structure** | No production reader; synthesized from the first plural member |
| `createDayFrameStore` singular initialization | **Test/Fixture Convenience** | 12 test fixtures, zero production callers |
| `Partial<DayFrameState>` initialization contract | **Test/Fixture Convenience** | Production does not supply it; tests use it broadly for targeted state construction |
| Durable singular input types | **Transitional Compatibility Structure** | Required by verified singular-only local/profile/backup compatibility tests |
| Runtime snapshot synthesis | **Obsolete Structure** | Recreates only `shiftCycles[0] ?? null` and has no independent consumer |

The broad partial initializer is not itself an obstacle once `shiftCycle` leaves
`DayFrameState`: its accepted keys will become plural-only automatically. It can
remain as a useful test-state constructor unless a later task finds a separate
reason to narrow it. Introducing `DayFrameStoreInitialState` now would duplicate
the existing shape without serving a production requirement.

## Current boundary map

```text
local persisted input
  PersistedDayFrameState / private legacy partial
        |- shiftCycles
        `- shiftCycle
                 |
                 v
       createInitialDayFrameState normalization
                 |
                 v
profile raw record ----> profile validator/normalizer ----+
backup raw record  ----> backup validator/normalizer -----+--> shiftCycles
                                                              |
                                                              v
                                                        DayFrameState
                                                        |- shiftCycles
                                                        `- shiftCycle mirror

test initialization
  Partial<DayFrameState>
        `- shiftCycle accepted by mergeInitialState fallback
```

## Candidate future boundary

```text
HISTORICAL DURABLE INPUT
  local/profile/backup raw shapes
        |- shiftCycles
        `- shiftCycle
                 |
                 v
       boundary-specific normalization
                 |
                 v
CURRENT AUTHORED/RUNTIME SHAPES
             shiftCycles only
                 |
                 v
  createDayFrameStore(Partial<DayFrameState>)
             plural-only keys
                 |
                 v
       snapshots with shiftCycles only

TEST INITIALIZATION
  Partial<DayFrameState>
        `- shiftCycles: [cycle]
```

## Runtime state inspection

All supported scheduling behavior reads `shiftCycles`. The UI derives drafts,
warnings, effective preferences, ranges, and generation inputs from the plural
array. Store mutations and authored setup commits write the plural array. Preview
generation rejects an empty plural array and passes cloned plural cycles to the
engine.

The singular runtime field is produced only by:

- `createInitialDayFrameState`, as the first normalized plural cycle or null;
- `cloneState`, as the first cloned plural cycle or null.

It is not required to represent multiple cycles, current authority, or any unique
state transition. Event fields such as `shiftCycleId` identify cycle entities and
are unrelated to this mirror.

## Production initialization traces

```text
DayFrameApp without an injected store
  -> createSeededDayFrameStore
      -> createDayFrameStore()             (no initial argument)
      -> plural setter calls for demo data

DayFrameApp with an injected store
  -> receives DayFrameAppStore interface
  -> does not construct or normalize its state

createDayFrameStore()
  -> mergeInitialState(undefined)
  -> loadPersistedState()
  -> createInitialDayFrameState(raw local input)
```

Repository-wide production inspection found no `createDayFrameStore({...})` call.
There is no supported production direct-current-state initializer, persisted-state
argument, or singular initializer caller.

## Test initialization classification

The compiler-syntax inspection found:

- 18 `createDayFrameStore` calls in `dayFrameStore.test.ts`, with zero singular
  initializer object properties;
- 22 calls in `DayFrameApp.test.tsx`, of which 12 supply singular `shiftCycle`;
- all 12 singular cases establish scheduling fixtures for production behavior
  tests rather than test migration behavior.

Each singular object can be wrapped in a one-element `shiftCycles` array without
changing the represented cycle, generation prerequisites, or assertion intent.
Genuine migration tests supply singular data through local storage, literal
profile storage, or parsed backup data instead of the store initializer and must
remain singular at those raw inputs.

## Legacy durable input and normalization traces

### Local storage

```text
JSON.parse -> PersistedDayFrameState assertion
  -> createInitialDayFrameState(LegacyPersistedDayFrameState)
  -> normalizePersistedShiftCycles
       plural array first, otherwise singular one-element fallback
  -> normalizeShiftCycles
  -> DayFrameState.shiftCycles
```

The legacy input type is already distinct from `Partial<DayFrameState>`. Although
it references current field types with `Pick`, it explicitly owns its singular
property and does not rely on runtime `DayFrameState.shiftCycle`.

### Profiles

```text
JSON.parse -> unknown
  -> validateDayFrameProfilesStorage
  -> normalizeAuthoredSetup(raw Record)
       plural array first, otherwise singular one-element fallback
  -> normalizeShiftCycles
  -> DayFrameSavedProfile.data.shiftCycles
  -> loadProfile -> createInitialDayFrameState(plural authored data)
```

### Backups

```text
JSON.parse -> unknown
  -> validateDayFrameBackup
  -> validateAuthoredSetup(raw Record)
  -> normalizeAuthoredShiftCycles
       plural array first, otherwise singular one-element fallback
  -> DayFrameBackupV1.data.shiftCycles
  -> importBackup -> createInitialDayFrameState(plural authored data)
```

The earliest point after which singular data is unnecessary is the return from
each boundary-specific normalizer. Store initialization is downstream of that
normalization and has no migration responsibility.

## Candidate type-boundary evaluation

### Candidate A — retain `Partial<DayFrameState>` after fixture modernization

This is the smallest supported option. Once `shiftCycle` is removed from
`DayFrameState`, the existing initializer becomes plural-only automatically. It
continues to support targeted test setup for previews, profiles, preferences, and
other current state without adding a parallel type.

**Determination:** recommended.

### Candidate B — introduce `DayFrameStoreInitialState`

No production caller requires a distinct initialization contract, and current
tests need only a partial current-state shape. A named duplicate would add surface
without clarifying an actual extra responsibility.

**Determination:** not evidence-supported now.

### Candidate C — reuse `DayFrameAuthoredSetup`

This shape is not sufficient for all test initialization: tests also seed Preview,
saved profiles, and partial subsets. It also presently carries optional singular
durable compatibility, so using it would blur rather than clarify the seam.

**Determination:** unsuitable for the store initializer.

### Candidate D — route store initialization through durable normalizers

Migration already occurs before runtime construction. Reusing migration readers
for arbitrary tests would conflate raw historical input with current state.

**Determination:** reject.

## Existing type ambiguity

`DayFrameAuthoredSetup` is a current plural authored-data shape with an optional
singular compatibility property. Profile and backup readers themselves accept raw
records and do not need that property to inspect legacy input, but cloning and
some compatibility test helpers currently reference it. This is a durable-format
typing ambiguity, not a dependency of runtime mirror removal.

It may be separated later into current normalized authored data and a raw V1 input
shape, but Task 1.11 found no need to solve that broader format concern before
making runtime state plural-only.

## Recommended removal dependency order

1. Convert the 12 non-migration `DayFrameApp` store fixtures from `shiftCycle` to
   `shiftCycles: [cycle]`.
2. Remove `shiftCycle` from `DayFrameState`.
3. Remove the singular `mergeInitialState` fallback. Keep the initializer as
   `Partial<DayFrameState>` unless independent evidence warrants narrowing it.
4. Remove singular synthesis from `createInitialDayFrameState` and `cloneState`;
   retain plural cycle creation and cloning unchanged.
5. Update assertions that inspect only the obsolete runtime mirror to assert
   plural authority instead.
6. Preserve `PersistedDayFrameState` legacy input, profile raw-record fallback,
   backup raw-record fallback, and their singular-only compatibility tests.

Steps 2–4 should occur in the same future implementation task so the type,
initializer, and snapshot construction remain internally consistent.

## Validation performed

- Relevant behavior suites passed: `dayFrameStore`, profiles, backups, and
  `DayFrameApp`; 4 files and 81 tests.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test -- --run` passed: 22 files and 244 tests.
- `npm run build` passed.
- No production code or test was changed.

The saved Task 1.11 specification passed its integrity check, ended with the
required sentence, and retained SHA-256
`6699e1f9aa0980931153fbb1f629a5458af178f856b074015e675f961b9c2466`.

## Discrepancies and uncertainty

- No discrepancy with Tasks 1.9 or 1.10 was found.
- External consumers outside this repository cannot be disproven, but no exported
  package boundary or supported production initializer usage was found.
- The historical reason for `Partial<DayFrameState>` is not encoded. Executable
  use shows it is valuable for tests, not required by production.
- `DayFrameAuthoredSetup` still overlaps current authored data and optional legacy
  singular data; separating it is deferred because runtime removal does not depend
  on doing so.

## Discoveries and deferred work

- Core scheduling input aliases remain independent and unchanged.
- Durable-reader retirement, format versioning, and the compatibility horizon
  remain deferred.
- Persistence failure, seeded-store behavior, manual-event ownership, feedback,
  continuity, and date-helper findings remain outside this task.
- `CURRENT_STATE.md` must remain unchanged until project review.
- No task-specific checkpoint was created, as expressly required by Task 1.11.
- `CHANGELOG.md` was not updated for this investigation.

## Recommended next task

**Task 1.12 — Remove the Obsolete Runtime `shiftCycle` Mirror** should perform the
six-step bounded sequence above: modernize the 12 UI store fixtures; remove the
runtime field, initializer fallback, and two synthesis sites; update obsolete
runtime assertions; and explicitly preserve all singular durable readers and
migration fixtures.

It should not introduce a new initializer type or modify core singular scheduling
inputs.

## Final completion determination

Task 1.11 is complete. Executable evidence establishes that the smallest safe seam
is the existing durable-reader normalization boundary plus a plural-only
`Partial<DayFrameState>` test initializer. Runtime `shiftCycle` can be removed
after mechanical fixture modernization without weakening local, profile, or backup
legacy compatibility.
