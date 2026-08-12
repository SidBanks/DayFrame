# Task 1.9 Result — Runtime and API `shiftCycle` Compatibility Boundary

**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task:** 1.9  
**Result date:** 2026-08-12  
**Execution status:** Investigation complete; project review pending

## Architectural determination

Singular compatibility legitimately ends at durable-data normalization.

Legacy local state, saved profiles, and V1 backups normalize singular input into
plural `shiftCycles` before supported runtime scheduling begins. No durable reader
requires the runtime first-cycle mirror, the singular store mutation, or singular
core scheduling inputs.

The remaining singular runtime/API structures have no production caller or unique
behavior. Their executable use is confined to tests and fixture construction.

## Compatibility report

| Boundary | Production caller? | Test-only caller? | Durable-reader dependency? | Unique behavior? | Classification | Candidate next step |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| `DayFrameState.shiftCycle` | **No reader found.** It is synthesized in initial/cloned snapshots but not consumed by application, UI, store transitions, or engines | Three direct store assertions plus initial-state expected shape; many fixtures supply singular initial input rather than reading the result | **No.** Readers produce plural cycles before runtime state is consumed | No; always `shiftCycles[0] ?? null` | **Obsolete Compatibility Structure** | Remove after singular store-initialization fixtures/API are converted to plural; retain raw durable input types/readers |
| `setShiftCycle` | **No** | Seven store-test setup calls | **No** | No; delegates exactly to `setShiftCycles(cycle ? [cycle] : [])` | **Test/Fixture Convenience** | Convert tests to `setShiftCycles`, then remove the API and implementation |
| `generateSchedulePreview.shiftCycle` | **No.** Store passes `shiftCycles` | 26 of 27 engine test calls use singular input; one explicit plural test | **No** | No; immediately converts to a one-element local array | **Test/Fixture Convenience** | Modernize engine test inputs, require plural input, remove fallback |
| Other core singular aliases | **No singular production caller.** Production callers of cycle work, active segment, and candidates pass plural arrays | All 7 `generateCycleWorkBlocks` unit calls and all 5 `getActiveShiftSegment` unit calls use singular input; candidate unit tests omit cycles rather than use singular | **No** | No; each converts singular to a one-element array | **Test/Fixture Convenience** | Modernize affected unit tests and remove optional singular properties/fallbacks function-by-function |
| `createDayFrameStore(initialState.shiftCycle)` | **No production caller.** Production default construction uses no input; supported app injection receives an already-created store | Numerous `DayFrameApp` and store fixtures initialize stores with singular input | **No** | No; merge logic converts it to plural only when plural input is absent | **Test/Fixture Convenience** | Convert initial-state fixtures to `shiftCycles`, then remove this merge fallback independently of durable rehydration |

## Required authority map

```text
LEGACY DURABLE DATA
    local/profile/backup shiftCycle
                |
                v
    boundary-specific reader normalization     <-- singular compatibility ends here
                |
                v
            shiftCycles
                |
       +--------+-------------------+
       |                            |
       v                            v
runtime/store authority       core scheduling APIs
       |                            |
       +------ plural only ---------+

Remaining non-production aliases:
    runtime shiftCycle mirror       (unused output)
    createStore.shiftCycle input    (fixtures)
    setShiftCycle                   (fixtures)
    core shiftCycle inputs          (unit-test fixtures)
```

## Investigation completed

- Distinguished legacy serialized properties from runtime fields, function input
  properties, local variables representing one array member, and entity fields such
  as `shiftCycleId`.
- Traced `DayFrameState` construction, initial-state normalization, store merge,
  snapshots, cloning, application subscriptions, UI reads, store generation, and
  tests.
- Traced every `setShiftCycle` call.
- Traced every caller of `generateSchedulePreview`, `generateCycleWorkBlocks`,
  `getActiveShiftSegment`, and `generateBlockCandidates`.
- Inspected their input types and immediate singular-to-plural fallback behavior.
- Traced local, profile, and backup readers far enough to establish independence.

## Runtime mirror analysis

`DayFrameState.shiftCycle` is created in two places:

- `createInitialDayFrameState` assigns the first normalized plural cycle or null;
- `cloneState` clones plural cycles and assigns their first entry or null.

The store's merge path chooses `initialState.shiftCycles` first and uses
`initialState.shiftCycle` only as a test-facing initialization fallback. State
mutations update plural cycles; snapshots regenerate the singular property from
plural data. No path can make an observed snapshot diverge from
`shiftCycles[0] ?? null`.

Repository-wide production inspection found no consumer of `state.shiftCycle`.
The only direct reads are three store assertions: one general mirror assertion and
the Task 1.7 profile/backup compatibility assertions.

Durable readers do not need this output property. They normalize raw singular data
into plural arrays before initial state is returned. Reader tests can assert plural
authority without requiring a runtime mirror.

## Store API analysis

`setShiftCycle` has seven callers, all in `dayFrameStore.test.ts`. It has no UI,
application, migration, import, profile, backup, or production caller. Its complete
implementation delegates to the plural setter and therefore inherits the same
cloning, Preview staleness, persistence, and notification behavior without owning
an independent transition.

Separately, `createDayFrameStore(initialState)` accepts a singular property because
its parameter is `Partial<DayFrameState>`. Numerous UI tests use this as fixture
convenience. Production `DayFrameApp` creates the default store without initial
state, and application tests inject constructed stores. This initialization alias
must be modernized with the fixtures before removing the runtime field from the
type.

## Core production call traces

```text
DayFrameApp
  -> dayFrameStore.generatePreview
      -> generateSchedulePreview({ shiftCycles })
          -> generateCycleWorkBlocks({ shiftCycles })
          -> generateBlockCandidates({ shiftCycles })

previewRangeWarnings
  -> generateCycleWorkBlocks({ shiftCycles })

effective-preference resolvers
  -> getActiveShiftSegment({ shiftCycles })
```

Every supported production edge passes plural cycles.

### Core alias inventory

- `GenerateSchedulePreviewInput` declares optional plural and singular properties;
  the implementation resolves plural first, then singular fallback.
- `GenerateCycleWorkBlocksInput` does the same and normalizes the resulting array.
- `GetActiveShiftSegmentInput` does the same.
- `GenerateBlockCandidatesInput` does the same.

The aliases are not a coupled production chain. Once `generateSchedulePreview`
resolves its input, it calls downstream functions with plural arrays. Each singular
fallback exists independently at that function's external boundary and can be
removed function-by-function after its direct tests are modernized.

## Test and fixture classification

- Singular-only local/profile/backup fixtures are **genuine durable compatibility
  contracts**. They must remain singular at the reader input but need only assert
  plural runtime authority afterward.
- Direct `state.shiftCycle` assertions are **runtime compatibility assertions** for
  an unused mirror; they are not needed to protect durable readers.
- `setShiftCycle` calls are **fixture convenience** used to prepare plural-authority
  scheduling states.
- `DayFrameApp` stores initialized with singular `shiftCycle` are **production
  behavior tests using an old fixture shape**, not evidence that the application
  consumes the alias.
- Most engine/cycle tests are **production-behavior tests using old input fixture
  shapes**. Their scheduling assertions remain valuable, but their singular input
  is incidental.
- A small number of initial-state tests are **genuine durable migration tests**;
  their raw input must remain singular even after runtime/API cleanup.

## Durable-reader separation

All protected readers complete normalization before runtime/API use:

- local storage: `loadPersistedState` → `createInitialDayFrameState` → plural array;
- profiles: validation/normalization → saved profile plural data → `loadProfile` →
  initial state;
- backups: parse/validation/normalization → plural backup data → `importBackup` →
  initial state.

The reader input types may retain a singular property without exposing that
property in `DayFrameState`. A later cleanup should separate a legacy persisted
input type from the current runtime type rather than delete the reader field.

## Removal dependency order

The smallest safe staged order derived from executable dependencies is:

1. **Modernize non-migration fixtures to plural input.** Convert `setShiftCycle`
   calls, `createDayFrameStore({ shiftCycle })` fixtures, and direct core singular
   calls. Preserve literal durable-reader fixtures.
2. **Remove `setShiftCycle`.** Delete its store contract and delegating
   implementation after callers are gone.
3. **Remove singular store-initialization input and runtime mirror.** Introduce or
   retain dedicated legacy persisted/authored input types for durable readers;
   remove `DayFrameState.shiftCycle`, snapshot synthesis, and the store merge
   fallback. These changes are naturally coupled by `Partial<DayFrameState>`.
4. **Remove core aliases independently.** Make plural arrays the explicit input for
   `generateSchedulePreview`, cycle work, and active-segment lookup; remove candidate
   singular input as a separate small change. Order among these core functions is
   flexible because production edges are already plural.
5. **Keep durable singular readers.** Do not remove local/profile/backup fallbacks
   until a separately authorized compatibility horizon exists.

A pragmatic next task can combine steps 1 and 2 only: modernize store setter calls
and remove `setShiftCycle`. It should not absorb runtime or core cleanup.

## Independent classifications

- Runtime `DayFrameState.shiftCycle`: **Obsolete Compatibility Structure**. It has no
  reader or unique behavior, although removal depends on fixture/type separation.
- `setShiftCycle`: **Test/Fixture Convenience**. Tests alone use a pure delegation
  alias.
- Core singular scheduling inputs: **Test/Fixture Convenience**. Production is
  plural; tests carry historical shapes.
- Singular `createDayFrameStore` initial input: **Test/Fixture Convenience** and a
  type dependency for runtime mirror removal.
- Durable singular inputs: **Required Active Compatibility Structure**, explicitly
  outside runtime/API removal.

## Uncertainty

- No package export surface exists, so no repository-supported external consumer is
  visible. Hypothetical consumers outside this repository cannot be disproved, but
  executable project evidence provides no contract for them.
- The historical reason singular core inputs were introduced is not encoded. Their
  current caller status and behavior are nevertheless unambiguous.
- `Partial<DayFrameState>` conflates test initialization with runtime state shape.
  The exact replacement input type should be chosen in an authorized implementation
  task, not inferred here.

## Validation

- Relevant store/engine/cycle/block suites: 5 files, 71 tests — passed.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test -- --run` — passed: 22 files, 244 tests.
- `npm run build` — passed.
- No production code, tests, fixtures, state types, readers, or scheduling behavior
  changed.

One intermediate reference command used `code/src` while already running from the
`code` directory and returned path-not-found messages. It made no changes; the same
checks were rerun successfully against `src` before classification.

The immutable Task 1.9 artifact passed its integrity check and retained SHA-256
`b73b345548ee5312211eddc9eeff159388544a9b87e4333c64d60d772f3a01cf`.

## Discoveries and deferred work

- Store test/UI fixtures contain substantial singular initialization debt; their
  modernization should remain mechanical and behavior-preserving.
- Runtime type separation may improve clarity, but no new abstraction should be
  introduced beyond what removal requires.
- Durable-reader retirement, validator policies, format versions, and the final
  compatibility horizon remain deferred.
- Other Phase 1 ownership findings remain outside Task 1.9.

## Recommended next task

**Task 1.10 — Remove the Test-Only `setShiftCycle` Store Alias** should modernize
its seven direct store-test callers to `setShiftCycles` and remove only the store
contract and delegating implementation. It should preserve runtime
`DayFrameState.shiftCycle`, store initial-state compatibility, core singular inputs,
and every durable-data reader for later tasks.

## Final completion determination

Task 1.9 is complete. Executable evidence establishes that singular compatibility
is required at durable-data readers but not by supported runtime scheduling. The
runtime mirror is obsolete, while the store and core singular APIs are test/fixture
conveniences that can be retired in staged, separately authorized changes after
their callers are modernized.
