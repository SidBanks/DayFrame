# Task 1.19 Result — Remove the Obsolete `DayFrameAuthoredSetup.shiftCycle` Property

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.19  
**Result date:** 2026-08-12  
**Execution status:** Complete; project review pending

## Implementation completed

`DayFrameAuthoredSetup` is now explicitly plural-only. Its optional singular
`shiftCycle` property and the corresponding conditional clone branch have been
removed. The normalized backup fixture now represents cycles only through
`shiftCycles`, including its repeating-sequence override.

All raw local, profile, and V1 backup singular readers and their genuine
compatibility fixtures remain intact.

## Required result

| Concern | Before | After |
| --- | --- | --- |
| `DayFrameAuthoredSetup.shiftCycle` | Present | Removed |
| Normalized `shiftCycles` | Authoritative | Unchanged |
| Clone singular branch | Present | Removed |
| Current local writer | Plural-only | Unchanged |
| Current profile writer | Plural-only | Unchanged |
| Current backup writer | Plural-only | Unchanged |
| Raw local singular reader | Retained | Retained |
| Raw profile singular reader | Retained | Retained |
| Raw backup singular reader | Retained | Retained |
| Runtime/core vocabulary | Plural-only | Unchanged |

## Normalized authored fixtures modernized

The helper in `code/src/state/dayFrameBackup.test.ts` previously constructed a
typed normalized authored setup containing both `shiftCycle` and `shiftCycles`.
It now constructs only `shiftCycles`.

The repeating-sequence test previously expressed its override through singular
`shiftCycle`. It now supplies the identical cycle object in a one-element
`shiftCycles` array. Cycle identity, mode, sequence, anchor, dates, and assertions
were preserved.

The parsed-backup test no longer deletes singular data from its expected normalized
fixture because that fixture no longer contains the obsolete property.

No literal raw legacy fixture was modernized.

## Type changes

The normalized type changed from:

```text
DayFrameAuthoredSetup
    |- shiftCycles: ShiftCycle[]
    `- shiftCycle?: ShiftCycle | null
```

to:

```text
DayFrameAuthoredSetup
    `- shiftCycles: ShiftCycle[]
```

`DayFrameSavedProfile.data` and `DayFrameBackupV1.data` continue using
`DayFrameAuthoredSetup` and therefore become plural-only naturally. No replacement
normalized or raw type was introduced.

## Clone-helper changes

`cloneDayFrameAuthoredSetup` continues cloning:

- scheduling preferences;
- Preview range;
- shift definitions;
- plural shift cycles;
- block templates and nested external resources;
- block recurrences and weekday arrays;
- manual events.

The conditional `authoredSetup.shiftCycle` branch was removed, along with the
now-unused `cloneShiftCycle` import. The clone test now explicitly asserts that the
plural `shiftCycles` array is independently cloned, preserving meaningful clone
coverage rather than testing an obsolete representation.

## Profile behavior preserved

Current profile creation remains:

```text
store state.shiftCycles
  -> getAuthoredSetup
  -> createDayFrameSavedProfile
  -> cloneDayFrameAuthoredSetup
  -> plural-only profile data
```

Raw profile validation still inspects `value.shiftCycle` when plural cycles are
absent and normalizes it to a one-element `shiftCycles` array. Profile version 1,
plural precedence, storage serialization, save/load behavior, and singular-only
legacy profile coverage are unchanged.

## Backup behavior preserved

Current backup creation remains:

```text
store state.shiftCycles
  -> getAuthoredSetup
  -> createDayFrameBackup
  -> cloneDayFrameAuthoredSetup
  -> plural-only V1 backup data
```

Raw backup validation still accepts and validates `value.shiftCycle` when plural
cycles are absent. `normalizeAuthoredShiftCycles` still gives plural arrays
precedence and otherwise normalizes singular input into a one-element plural
array. Backup version 1, parsing, import/export, and singular-only V1 compatibility
coverage are unchanged.

## Local persistence compatibility preserved

Local persistence does not use `DayFrameAuthoredSetup` as its raw input type.
`PersistedDayFrameState.shiftCycle` and the private legacy input shape remain in
`createInitialDayFrameState.ts`, and `normalizePersistedShiftCycles` retains its
singular fallback.

Current local writes remain plural-only. Singular-only historical local payloads
continue rehydrating into runtime `shiftCycles`.

## Raw singular-reader fixtures preserved

The following genuine raw compatibility fixtures remain unchanged:

- singular-only local-storage input;
- singular-only saved-profile storage input;
- singular-only V1 backup input;
- raw null singular compatibility where already covered.

They continue to prove:

```text
raw shiftCycle -> normalization -> shiftCycles
```

## Reference validation

No `DayFrameAuthoredSetup["shiftCycle"]` or
`authoredSetup.shiftCycle` executable reference remains.

Remaining legitimate singular references are limited to:

- raw persisted compatibility fields;
- raw profile-record inspection;
- raw backup-record validation and normalization;
- literal raw singular compatibility fixtures;
- individual-cycle variables;
- entity identifiers such as `shiftCycleId`.

No unexpected normalized consumer appeared, no raw compatibility boundary required
modification, and no new type was required.

## Files changed

Executable changes for Task 1.19:

- `code/src/state/types.ts`
- `code/src/state/dayFrameBackup.ts`
- `code/src/state/dayFrameBackup.test.ts`

Execution documentation:

- `docs/implementation/phase-1/TASK_1.19_REMOVE_OBSOLETE_DAYFRAME_AUTHORED_SETUP_SHIFT_CYCLE_PROPERTY_RESULT.md`

Existing unrelated worktree changes were preserved.

## Validation performed

- Type/reference audit confirmed no normalized singular property reference remains.
- Relevant backup, profile, store, and application suites — passed: 4 files and 81
  tests.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test -- --run` — passed: 22 files and 244 tests.
- `npm run build` — passed.
- `git diff --check` for affected executable files — passed.

The immutable Task 1.19 artifact passed its integrity check, ended with the
required sentence, and retained SHA-256
`45e7eb199ac00e3e0a6e6dc6fdf9d294784a314a9e772b2b3942ff3f45836dcb`.

## Architectural result

The representational boundary is now explicit:

```text
RAW HISTORICAL INPUT
    shiftCycle accepted
          |
          v
validation / normalization
          |
          v
NORMALIZED AUTHORED DATA
    shiftCycles only
          |
          v
CURRENT RUNTIME
    shiftCycles only
          |
          v
CORE SCHEDULING
    shiftCycles only
```

Historical data remains readable while current normalized data no longer carries
the old singular representation.

## Deviations

None. The implementation removed only the obsolete normalized property and its
test/clone residue.

## Discoveries and deferred work

- Final raw durable singular-reader retirement and compatibility-horizon policy
  remain deferred.
- Profile/backup validator permissiveness and version-specific raw typing remain
  separate concerns.
- Seeded-store behavior and other Phase 1 findings remain outside this task.
- `CURRENT_STATE.md` remains unchanged until project review.
- `CHANGELOG.md` was not updated for this bounded cleanup.
- No task-specific checkpoint was created, as required by Task 1.19.

## Recommended next task

The next investigation should establish the compatibility horizon and retirement
criteria for the remaining raw local, profile, and V1 backup singular readers. It
should not remove them without explicit evidence about supported historical data
lifetimes and migration policy.

## Final completion determination

Task 1.19 is complete. `DayFrameAuthoredSetup` is plural-only, normalized clone and
test behavior reflects that boundary, and every established raw local, profile,
and backup singular reader remains intact.
