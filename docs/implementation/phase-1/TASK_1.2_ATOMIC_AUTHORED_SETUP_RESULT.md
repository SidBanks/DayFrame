# Implementation Task 1.2 — Atomic Authored Setup Commit

**Status:** Complete  
**Completed:** 2026-08-10  
**Phase:** Phase 1 — Architectural Foundation Alignment

## Outcome

One user-level Setup save now corresponds to one store-owned authored Setup
transition.

`DayFrameApp.saveCurrentSetup` still resolves the same Preview range and applies the
same entity timestamps, but it submits the complete payload through
`commitAuthoredSetup`. The store clones every collection, updates all six authored
areas before observation, marks an existing Preview stale once, persists once, and
notifies subscribers once.

## Implementation

- Added `CommitAuthoredSetupInput` and `DayFrameStore.commitAuthoredSetup`.
- Implemented the aggregate transition in `dayFrameStore` using the existing clone,
  Preview-staleness, persistence, and notification paths.
- Replaced the six narrow setter calls in `DayFrameApp.saveCurrentSetup` with the
  aggregate operation.
- Retained the narrow store setters for legitimate independent mutation paths.
- Preserved manual events, saved profiles, Preview contents, and all other unrelated
  state during the authored commit.
- Preserved the versioned persistence keys, serialized schema, and singular
  `shiftCycle` compatibility representation.

## Behavioral evidence

Store tests now establish that the aggregate operation:

- commits preferences, range, shifts, cycles, templates, and recurrences together;
- clones caller-owned collections;
- preserves manual events and unrelated state;
- stales an existing Preview and does not create an absent Preview;
- emits exactly one subscriber snapshot containing the completed state;
- writes authored storage exactly once with the existing schema, including
  compatibility `shiftCycle`.

Application tests establish that Save submits one complete authored payload and
preserves the existing confirmation. Existing application coverage continues to
verify dirty drafts, field values, Preview staleness/regeneration, navigation,
focus, feedback, profiles, backups, imports, manual events, and deterministic
generation.

## Validation

- `npm run lint` — passed
- `npm run typecheck` — passed
- `npm test -- --run` — passed, 23 files and 246 tests
- `npm run build` — passed

## Architectural result

```text
DayFrameApp.saveCurrentSetup
    -> commitAuthoredSetup(complete resolved payload)
        -> clone and update complete authored state
        -> stale Preview once
        -> persist once
        -> notify once
```

Scheduling generation, Preview revision, date handling, validation, guardrails,
profiles, backups, manual-event behavior, navigation, focus, and feedback language
were not changed.

## Deferred work

Task 1.1 deferred findings remain deferred: manual-event command ownership,
feedback aggregation, focus/continuity ownership, duplicated date conversions,
legacy `shiftCycle` removal, `PreviewScreenContainer` status, persistence-failure
authority, and seeded-store purpose.

Task 1.3 should be derived from the approved Phase 1 sequence and current evidence;
this task does not assign a speculative next abstraction.
