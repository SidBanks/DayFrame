# Task 1.5 Result — Legacy `shiftCycle` Compatibility Boundary

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.5  
**Result date:** 2026-08-11  
**Execution status:** Investigation complete; project review pending

## Final classification

**Transitional Compatibility Structure**

Plural `shiftCycles` is the sole current production scheduling authority. Singular
`shiftCycle` remains required as a reader-side migration input for legacy local
state, saved profiles, and version-1 backups, and it remains accepted by legacy
core-function input shapes. It does not need to represent newly authored schedule
authority or meaningful newly exported profile/backup data.

The structure is therefore not obsolete today, but its compatibility responsibility
can be isolated and retired in stages. Task 1.5 authorizes no such change.

## Compatibility report

| Concern | `shiftCycles` | `shiftCycle` | Evidence | Determination |
| --- | --- | --- | --- | --- |
| Scheduling authority | Passed by the store into `generateSchedulePreview`; used by Setup, warnings, preference resolution, and the scheduling pipeline | Store generation never reads the state mirror; core functions accept it only as fallback when plural input is absent | `dayFrameStore.generatePreview` passes cloned plural cycles; engine/cycle/block helpers use `shiftCycles ?? singular fallback` | **Plural is authoritative in the supported production path.** Singular is a legacy input alias, not concurrent authority. |
| Runtime state | Required array in `DayFrameState`; supports multiple cycles | Optional mirror returned as `shiftCycles[0] ?? null`; initial and cloned snapshots synthesize it | `createInitialDayFrameState`, `cloneState`, state types | **Duplicated compatibility view.** It cannot express cycles after the first and is never the source when plural exists. |
| Persistence write | Every current authored write serializes the complete array | Newly persisted local state also writes a mirror of the first plural cycle, or `null` | `persistState`; store persistence assertions | **Current compatibility write, not canonical data.** Plural remains complete; singular is derived. |
| Rehydration read | If present as an array—even empty—it takes precedence and is normalized | Used only when plural is absent; a truthy singular object becomes a one-element normalized array | `normalizePersistedShiftCycles`; singular-only local-storage and legacy-normalization tests | **Required legacy read path.** Removing it now would silently lose cycles from older installations. |
| Profile save/load | New profiles are sourced from plural store state; load flows through initial-state normalization | Profile validation falls back to singular when plural is absent. New store-created profiles pass through cloning without a meaningful singular source and serialize `shiftCycle: null` | `getAuthoredSetup`, `createDayFrameSavedProfile`, `validateDayFrameProfilesStorage`, `loadProfile` | **Legacy profile reader remains; new profile authority is plural.** Singular-only profile fallback lacks a dedicated direct test. |
| Backup export/import | Store export supplies plural cycles; current import normalizes plural first | V1 import accepts a singular object when plural is absent. Current store exports have no singular source and cloning emits `shiftCycle: null` | `getAuthoredSetup`, backup clone/validation/normalization, import through initial state | **Legacy V1 backup reader remains; meaningful new export data is plural.** Singular-only backup fallback lacks a dedicated direct test. |
| Store API | `setShiftCycles` is used by the current aggregate Setup path and supports multiple cycles | `setShiftCycle` delegates to `setShiftCycles([value])` or an empty array; no production caller was found | Store API/implementation and repository-wide caller search | **Compatibility/convenience alias.** Tests use it extensively, but it owns no independent transition. |
| Migration behavior | Normalized target for all accepted current and legacy shapes | Source fallback is normalized with legacy defaults such as `mode`, `sequence`, and `sequenceAnchorDate` | initial-state normalizer and singular-only migration tests | **Active forward migration boundary.** Migration is in-memory and rewritten on the next persisted mutation; no explicit schema version/horizon exists. |
| Test responsibility | Current multi-cycle persistence and scheduling behavior; newer tests increasingly use plural inputs | Local-state tests directly establish singular-only rehydration and normalization; many older core/store tests use singular input as fixture convenience; backup/profile tests often include both or `null` | State, backup, profile, engine, cycle, and block suites | **Mixed evidence:** genuine local migration coverage plus compatibility/fixture convenience. Test presence alone does not make singular authoritative. |

## Authority map

```text
Authored shift configuration
        |
        +-- shiftCycles
        |      writer: Setup aggregate commit / plural setter / normalized imports
        |      readers: UI, warnings, store generation, scheduling pipeline
        |      persistence: canonical complete array
        |      scheduling: sole supported production authority
        |      lifecycle: active
        |
        +-- shiftCycle
               writer: derived first-cycle mirror or null in runtime/local storage;
                       null in current store-created profile/backup payloads
               readers: legacy local/profile/backup normalizers and legacy core APIs
               mutation: singular setter delegates to plural setter
               persistence: compatibility mirror only
               scheduling: fallback only when legacy core callers omit plural input
               lifecycle: transitional compatibility
```

## Executable traces

### Supported scheduling path

`DayFrameApp.saveCurrentSetup` commits `setupDraft.shiftCycles`. The store keeps the
plural array and `generatePreview` passes that array to `generateSchedulePreview`.
The engine then propagates plural cycles through work generation, candidate
generation, placement preference resolution, manual events, and visible-range
filtering. No production application caller supplies singular input to this path.

### Local persistence and rehydration

Every store persistence currently writes both representations. The singular value
is cloned from `state.shiftCycles[0]`; it never independently overrides plural
state. During rehydration, an array-valued `shiftCycles` wins. Only when that field
is absent does a truthy `shiftCycle` become a normalized one-element plural array.

Consequently, an older installation containing only singular data restores its
cycle today. Removing the fallback would restore no cycles, and generation would
then fail its `shiftCycles.length === 0` guardrail until the user rebuilt Setup.

### Profiles

Current profile save extracts plural state and the shared clone helper adds a null
singular field because the extracted authored object does not supply one. Profile
validation nevertheless contains a singular fallback for older payloads. Loading a
validated profile routes the normalized plural array through
`createInitialDayFrameState`, clears Preview, and persists current authored state.

### Backups

Current store export extracts plural state. The shared clone helper emits
`shiftCycle: null` when no singular value was supplied. Version-1 validation accepts
plural arrays and also normalizes a record-valued singular fallback when plural is
absent. Import then initializes runtime state from the normalized plural result and
persists it.

### Core function inputs

`generateSchedulePreview`, `generateCycleWorkBlocks`, `getActiveShiftSegment`, and
`generateBlockCandidates` retain optional singular inputs and normalize them to a
one-element local plural array. The supported store caller passes plural data.
Repository production search found no singular caller outside these definitions
and internal per-cycle helper parameters, while many core tests still exercise the
singular form.

## Removal consequences

| Removal area | Immediate consequence | Can be independent? |
| --- | --- | --- |
| Runtime `DayFrameState.shiftCycle` | Consumers/tests expecting the first-cycle mirror break; current app scheduling does not | Yes, after caller/test audit, while legacy readers continue accepting raw singular payloads |
| `setShiftCycle` | Older tests and any unobserved internal callers break; current UI aggregate commit does not | Yes, after converting legitimate callers to `setShiftCycles`; no data migration required |
| New local-storage singular write | Newly written payload becomes plural-only; existing reader can still restore old data | **Smallest safe first production change**, with schema-compatibility tests |
| Local rehydration fallback | Singular-only installations lose authored cycles | No; requires an explicit support horizon or an eager, verified migration strategy |
| New profile/backup singular output | Removes a currently null/redundant field from new payloads | Potentially, but V1 output compatibility must be decided explicitly and readers retained |
| Profile/backup singular readers | Older saved profiles/backups lose cycles on import/load | No; requires format/version policy and migration fixtures |
| Core singular inputs | Singular-form callers and many tests break; production store path remains plural | Yes only as a separately scoped API cleanup after repository callers migrate |
| Singular test fixtures | Reduces compatibility evidence if removed indiscriminately | Separate migration fixtures from convenience fixtures before cleanup |

## Smallest safe subsequent change boundary

The first safe implementation task is **stop writing singular `shiftCycle` into new
local-storage payloads while retaining every singular reader**.

That task should:

1. keep `shiftCycles` unchanged as the persisted authority;
2. remove only the derived singular assignment in `persistState` and adjust the
   persisted-state type/output assertions;
3. add or retain explicit singular-only rehydration coverage proving old local data
   still migrates to plural state;
4. verify that a legacy payload is rewritten plural-only on the next mutation;
5. leave runtime state, store aliases, profile/backup formats, core input fallbacks,
   scheduling, and all readers unchanged.

Later tasks may independently stop emitting the null field in new profiles/backups
and remove runtime/API aliases. Singular readers must remain until the project sets
and satisfies a compatibility horizon for older local state, saved profiles, and V1
backups.

## Compatibility exit conditions

Singular `shiftCycle` may disappear completely only when all of the following are
true:

- new local state, profiles, and backups no longer emit it;
- runtime and core callers use plural inputs exclusively;
- dedicated fixtures prove every supported singular-only durable shape is either
  migrated or intentionally outside the support horizon;
- a version/support policy permits retiring V1 singular-only profile and backup
  inputs;
- persisted installations have an eager migration or an accepted deprecation
  window;
- repository tests distinguish retained migration guarantees from obsolete fixture
  convenience.

No executable evidence supplies a date, released-version boundary, telemetry, or
other condition proving that this horizon has already passed.

## Test and fixture classification

- The store test loading singular-only local storage is direct legacy-compatibility
  evidence.
- The initial-state legacy-cycle test is direct migration/normalization evidence.
- Store persistence assertions prove new local writes still mirror singular data.
- Current plural repeating-sequence tests prove plural authority and mirror
  derivation.
- Core engine/cycle tests using singular input primarily preserve a legacy input
  contract and often serve fixture convenience; production store generation uses
  plural input.
- Backup/profile tests prove current versioned round trips and plural behavior, but
  do **not** directly isolate singular-only backup/profile fallback behavior.

## Discrepancies and uncertainty

- `DayFrameBackupV1` and profile storage are versioned as `1`, but no documented or
  executable compatibility-expiration policy was found.
- Singular-only profile and backup readers exist in production code without direct,
  isolated behavioral tests. Their intended payload history is strongly indicated
  by the parallel local migration, but the exact oldest supported release is not
  encoded.
- Backup validation checks the plural field conditionally and does not strongly
  validate the singular fallback shape before normalization. Profile normalization
  is similarly permissive. Tightening validation is a separate behavior change.
- When both fields exist, plural arrays—including an empty array—take precedence.
  A conflicting singular value is ignored. This is consistent with plural
  authority but is not directly documented as a format rule.
- There is no package export surface, so core singular input support is internal to
  this repository; nevertheless it remains executable and tested until a separate
  API cleanup is authorized.

These uncertainties prevent immediate reader removal, but they do not prevent the
transitional classification.

## Validation performed

- Repository-wide singular and plural references were distinguished; local
  variables representing one array element were not mistaken for the legacy state
  field.
- Production scheduling reads, serialization writes, rehydration, normalization,
  profile save/load, backup export/import, store callers, core fallbacks, and test
  fixtures were traced.
- Targeted state and scheduling validation passed: 6 test files, 71 tests.
- No production code, schema, fixture, or test was modified.
- The immutable Task 1.5 specification was not modified; its observed SHA-256 was
  `ccdfd25ed284664aee13f5b27b15bcee3a31140f46231c3b9626c5ae6f5f1a25`.

## Discoveries and deferred work

- Add direct singular-only V1 backup and saved-profile fixtures before changing
  their compatibility writers or readers.
- Decide whether validation should reject malformed singular fallbacks rather than
  normalizing them permissively.
- Decide and document the durable-data compatibility horizon before reader removal.
- Other Phase 1 deferred findings remain outside Task 1.5.

## Recommended next task

**Task 1.6 — Stop Writing the Legacy `shiftCycle` Local-Storage Mirror** should
implement the smallest safe boundary above while preserving singular-only
rehydration.

## Final completion determination

Task 1.5 is complete as an investigation. Singular `shiftCycle` exists because it
still migrates legacy durable data and legacy function inputs into plural authority.
It should not remain a newly authored authority or permanent duplicate. The project
can safely stop new compatibility writes in stages, but it cannot remove legacy
readers until explicit compatibility exit conditions are met.
