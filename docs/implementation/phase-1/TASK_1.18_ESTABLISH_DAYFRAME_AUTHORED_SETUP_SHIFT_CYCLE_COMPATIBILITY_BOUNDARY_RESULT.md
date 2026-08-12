# Task 1.18 Result — `DayFrameAuthoredSetup.shiftCycle` Compatibility Boundary

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.18  
**Result date:** 2026-08-12  
**Execution status:** Investigation complete; project review pending

## Architectural determination

`DayFrameAuthoredSetup` is used as normalized current authored data. Its optional
singular `shiftCycle` property is an **Obsolete Structure** on that normalized
type, not a requirement of current authored behavior or V1 durable compatibility.

Supported current writers produce plural `shiftCycles` only. Raw local, profile,
and backup readers accept singular historical input at separate boundaries and
normalize it into plural arrays before returning runtime or typed authored data.
No supported normalized-data consumer reads singular `shiftCycle`.

The only meaningful singular typed input is a backup-test helper that deliberately
constructs `DayFrameAuthoredSetup` with both singular and plural fields. The shared
clone helper preserves that property because the type permits it. This is a
test/fixture-driven clone contract, not evidence that normalized authored data
requires the field.

## Compatibility Boundary Report

| Concern | Current Owner/Type | Meaningful Singular Consumer? | Legacy Input Dependency? | Classification | Candidate Future Boundary |
| --- | --- | ---: | ---: | --- | --- |
| Current authored setup | `DayFrameAuthoredSetup` | Only clone helper/test fixture | No | Singular property: **Obsolete Structure** | Plural-only normalized type |
| Authored snapshot extraction | Store `getAuthoredSetup` | No | No | **Required Current Architecture**; plural-only output | Continue producing normalized plural data |
| Clone helper | `cloneDayFrameAuthoredSetup` | It conditionally preserves singular input | No supported current-flow dependency | Singular support: **Test/Fixture Convenience** | Clone plural fields only after test modernization |
| Saved-profile normalized data | `DayFrameSavedProfile.data` | No | Raw reader only | **Required Current Architecture**; currently typed ambiguously | Plural-only `DayFrameAuthoredSetup` |
| Backup normalized data | `DayFrameBackupV1.data` | No after validation; direct test creation can include it | Raw reader only | **Required Current Architecture**; currently typed ambiguously | Plural-only `DayFrameAuthoredSetup` |
| Local raw input | `PersistedDayFrameState` / private legacy partial | Reader consumes singular fallback | Yes | **Raw Legacy Input Compatibility** | Retain singular property independently |
| Profile raw input | Unknown `Record<string, unknown>` in V1 validator | Normalizer consumes singular fallback | Yes | **Raw Legacy Input Compatibility** | Retain raw-record inspection |
| Backup raw input | Unknown `Record<string, unknown>` in V1 validator | Validator/normalizer consume singular fallback | Yes | **Raw Legacy Input Compatibility** | Retain raw-record inspection |

## Current writer traces

### Store authored snapshot

```text
DayFrameState
  -> getAuthoredSetup
      -> cloneDayFrameAuthoredSetup({
           schedulingPreferences,
           previewRange,
           shiftDefinitions,
           shiftCycles,
           blockTemplates,
           blockRecurrences,
           manualEvents
         })
      -> plural-only DayFrameAuthoredSetup
```

`getAuthoredSetup` never supplies singular data. It is the source for both current
profile saves and current backup exports.

### Current profile creation

```text
saveProfile
  -> getAuthoredSetup(state)                 (plural only)
  -> createDayFrameSavedProfile
  -> cloneDayFrameAuthoredSetup
  -> createDayFrameProfilesStorage
  -> JSON.stringify
```

No current profile writer derives, supplies, or requires singular data. Store tests
explicitly confirm new profile data and serialized profile storage contain plural
cycles and omit `shiftCycle`.

### Current backup creation

```text
exportBackup
  -> getAuthoredSetup(state)                 (plural only)
  -> createDayFrameBackup
  -> cloneDayFrameAuthoredSetup
  -> backup data with shiftCycles only
```

Store tests explicitly confirm current backup output is plural-only.

The low-level creation helpers will preserve a meaningful singular property if a
caller directly supplies one, but no supported production writer does so.

## Current reader traces

Normalized `DayFrameAuthoredSetup` is consumed by:

- `createDayFrameSavedProfile` and profile cloning;
- `createDayFrameProfilesStorage` transitively through saved profiles;
- `createDayFrameBackup` and backup cloning;
- store `loadProfile`;
- store `importBackup`;
- `createInitialDayFrameState` through the load/import transitions.

Only `cloneDayFrameAuthoredSetup` reads `authoredSetup.shiftCycle`. All functional
consumers use plural fields. Profile load and backup import clone normalized data,
then pass it to `createInitialDayFrameState`, whose legacy singular fallback exists
on its separate persisted-input type; these paths already supply plural arrays.

No current reader prefers singular, requires its presence, or changes behavior
when it is absent.

## Clone-helper analysis

The clone helper currently performs two independent operations:

```text
shiftCycles -> cloneShiftCycles
shiftCycle? -> cloneShiftCycle and preserve property
```

Meaningful singular input reaches this branch only from the backup test helper's
historical typed fixture (and any hypothetical caller manually constructing the
permitted shape). Production store snapshots never supply it. Profile raw
normalization and backup raw normalization return plural-only objects before
calling the clone helper.

Therefore clone support is classified as **Test/Fixture Convenience**. It is not a
migration stage and does not establish a normalized-data responsibility.

## Profile normalization trace

```text
raw JSON / unknown
  -> validateDayFrameProfilesStorage
  -> raw profile.data Record<string, unknown>
  -> normalizeAuthoredSetup
       if shiftCycles is an array: normalize plural
       else if shiftCycle exists: normalize [shiftCycle]
       else: []
  -> DayFrameAuthoredSetup with shiftCycles
  -> createDayFrameSavedProfile / clone
  -> DayFrameSavedProfile.data
  -> loadProfile
  -> createInitialDayFrameState(plural data)
  -> DayFrameState.shiftCycles
```

The earliest plural-only point is the return from the profile
`normalizeAuthoredSetup`. It never returns a singular property.

## Backup normalization trace

```text
raw JSON / unknown
  -> validateDayFrameBackup
  -> validateAuthoredSetup(raw data Record)
  -> normalizeAuthoredSetup
  -> normalizeAuthoredShiftCycles
       plural array first; otherwise singular one-element fallback
  -> DayFrameAuthoredSetup with shiftCycles
  -> cloneDayFrameAuthoredSetup
  -> DayFrameBackupV1.data
  -> importBackup
  -> createInitialDayFrameState(plural data)
  -> DayFrameState.shiftCycles
```

The earliest plural-only point is the return from backup
`normalizeAuthoredSetup`. It never returns a singular property.

The V1 validator accepts historical singular raw data, but normalized
`DayFrameBackupV1.data` does not need to retain the accepted raw representation.

## Local persistence relationship

`DayFrameAuthoredSetup` is not the raw local-storage compatibility type. Local
state uses `PersistedDayFrameState` plus a private partial legacy input shape in
`createInitialDayFrameState.ts`.

```text
raw local JSON
  -> PersistedDayFrameState assertion / legacy partial input
  -> normalizePersistedShiftCycles
       plural first; otherwise singular fallback
  -> normalized shiftCycles
  -> DayFrameState
```

Current local writes construct `PersistedDayFrameState` with plural cycles only.
Removing singular from `DayFrameAuthoredSetup` has no type or executable dependency
on this local reader.

## Current boundary map

```text
RAW HISTORICAL INPUT

local persisted type --------+
profile raw Record -----------+--> boundary-specific normalization
backup raw Record ------------+
                                      |
                                      v
                              DayFrameAuthoredSetup
                              |- shiftCycles
                              `- shiftCycle?        (not emitted by normalizers)
                                      |
                       +--------------+--------------+
                       |                             |
                       v                             v
                  profiles/backups              runtime state
                  plural in practice            shiftCycles only
```

## Candidate future boundary

```text
RAW HISTORICAL INPUT
    shiftCycle permitted
          |
          v
boundary-specific validation / normalization
          |
          v
NORMALIZED AUTHORED DATA
    DayFrameAuthoredSetup.shiftCycles only
          |
          +----> normalized V1 profile data
          +----> normalized V1 backup data
          `----> current runtime state
```

This boundary is already implemented behaviorally; only the normalized type and
clone/test residue fail to express it.

## Test and fixture responsibility

- Literal singular-only local-storage fixtures are genuine raw compatibility
  tests and must remain singular.
- Literal singular-only profile storage and V1 backup fixtures in store tests are
  genuine raw compatibility tests and must remain singular.
- `dayFrameProfiles.test.ts` uses plural-only normalized authored fixtures.
- `dayFrameBackup.test.ts` uses a helper that always supplies both `shiftCycle` and
  `shiftCycles`; this is fixture convenience inherited from the older model.
- The backup clone test consequently asserts preservation of a shape production no
  longer writes.
- The repeating-sequence backup test overrides singular while leaving the helper's
  plural cycle derived before the override; parsing then exercises plural
  precedence. Its scheduling intent should be expressed by overriding plural
  `shiftCycles`, not by retaining a normalized singular property.
- Assertions that parsed or current output omits singular data already protect the
  intended normalized boundary.

No test establishes a legitimate requirement for normalized typed output to carry
meaningful singular data.

## Versioned format responsibility

`DayFrameProfilesStorageV1` and `DayFrameBackupV1` describe normalized in-memory
objects and current serialized output, while their validators accept raw unknown
records. Executable behavior demonstrates asymmetric compatibility:

```text
V1 reader: accepts historical singular or current plural
V1 writer: emits current plural only
normalized return: plural only
```

The version number does not require round-tripping the historical property.
Tasks 1.6 and 1.8 intentionally stopped current singular output without changing
V1 reader compatibility. Removing the optional property from the normalized type
would align typing with that established behavior rather than change the format.

## Candidate type-boundary analysis

### Candidate A — keep `DayFrameAuthoredSetup` as-is

This preserves a clone branch and historical test fixture but no supported current
responsibility. It continues to permit accidental singular output through
low-level creation helpers.

**Determination:** not evidence-supported.

### Candidate B — make `DayFrameAuthoredSetup` plural-only

This matches every supported writer, every normalized reader result, runtime
state, and core scheduling. Raw readers can retain their existing singular
fallbacks because they inspect separate raw types or records.

**Determination:** recommended smallest boundary.

### Candidate C — split raw and normalized authored types

Local input already has a dedicated persisted type. Profile and backup validators
already accept `unknown` and narrow raw records internally. No production API
needs a shared typed raw authored object.

**Determination:** no new general raw type is necessary.

### Candidate D — introduce version-specific raw input types

Explicit raw V1 types might document validator permissiveness, but they would not
solve a current executable problem: untrusted JSON must still be validated from
`unknown`, and existing internal records already isolate the compatibility reads.

**Determination:** defer unless validator work independently demonstrates a need.

## Smallest safe removal sequence

1. Modernize `dayFrameBackup.test.ts`'s authored helper to construct plural cycles
   only, including the repeating-sequence override.
2. Remove the conditional singular branch and now-unused `cloneShiftCycle` import
   from `cloneDayFrameAuthoredSetup`.
3. Remove `shiftCycle` from `DayFrameAuthoredSetup`.
4. Keep `DayFrameSavedProfile.data` and `DayFrameBackupV1.data` typed as the now
   plural-only `DayFrameAuthoredSetup`; no replacement type is required.
5. Preserve local `PersistedDayFrameState.shiftCycle`, profile raw-record fallback,
   backup raw-record validation/fallback, and all literal singular compatibility
   fixtures.
6. Validate current plural writes and singular-only reads for all three durable
   boundaries.

Steps 1–3 should occur in one bounded implementation task so the fixture, clone
contract, and normalized type change atomically. No production normalizer or
version change is required.

## Validation performed

- Relevant backup, profile, store, and application suites passed: 4 files and 81
  tests.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test -- --run` passed: 22 files and 244 tests.
- `npm run build` passed.
- No production code or test was changed.

The immutable Task 1.18 artifact passed its integrity check, ended with the
required sentence, and retained SHA-256
`995f8108ad5ced4ab42c19be09e03cb87acbb4cc82fefcd877c22b47bec12ab7`.

## Deviations and uncertainty

- No deviation from the investigative scope occurred.
- No meaningful normalized-data consumer was found.
- Low-level creation helpers are source-exported, but the project has no supported
  package/library export boundary. Ad hoc external source imports cannot be
  disproven but are not an established contract.
- Profile validator permissiveness differs from backup validation strictness; that
  concern does not affect the singular normalization boundary and remains
  deferred.

## Discoveries and deferred work

- Actual normalized authored-type cleanup remains separately authorized.
- Raw durable singular reader retirement and compatibility-horizon policy remain
  deferred.
- Validator policy, versioned raw type design, seeded-store behavior, and other
  Phase 1 findings remain outside this task.
- `CURRENT_STATE.md` remains unchanged until project review.
- `CHANGELOG.md` was not updated for this investigation.
- No task-specific checkpoint was created, as required by Task 1.18.

## Recommended next task

**Task 1.19 — Remove the Obsolete `DayFrameAuthoredSetup.shiftCycle` Property**
should execute the six-step bounded sequence above. It must retain every raw local,
profile, and backup singular reader and genuine compatibility fixture unchanged.

## Final completion determination

Task 1.18 is complete. Executable evidence establishes that
`DayFrameAuthoredSetup.shiftCycle` does not belong to current normalized authored
data; singular compatibility is required only at raw legacy durable-input
boundaries. The smallest safe future boundary is a plural-only
`DayFrameAuthoredSetup` using the existing raw reader types and record normalizers.
