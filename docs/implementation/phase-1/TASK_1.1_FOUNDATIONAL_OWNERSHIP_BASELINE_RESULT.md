# Phase 1 Foundational Ownership Map

**Task:** 1.1 — Establish Foundational Ownership Baseline  
**Status:** Complete  
**Evidence date:** 2026-08-10  
**Scope:** Executable Setup → Preview production paths and their behavioral tests

## Determination

The smallest dependency-correct first production change is to introduce a single
store operation that commits the complete authored Setup payload, then route
`DayFrameApp.saveCurrentSetup` through it without changing validation, timestamps,
persistence shape, preview staleness, or scheduling inputs.

This boundary follows current behavior. One Setup save is presently coordinated by
`DayFrameApp` as six sequential store mutations, and every mutation separately
marks Preview stale, writes local storage, publishes a snapshot, and can rebuild the
Setup draft. Authored values are authoritative in the store, but ownership of the
authored transaction is therefore distributed between the component and store
([DayFrameApp.tsx:186](../../../code/src/ui/DayFrameApp.tsx#L186),
[dayFrameStore.ts:50](../../../code/src/state/dayFrameStore.ts#L50)). A store-level
aggregate commit is smaller and safer than moving persistence, generation, or UI
workflow state. It leaves the already deterministic scheduling pipeline unchanged.

## Ownership map

| Responsibility | Current Owner | Authority | Dependencies | Assessment | Candidate Seam |
| --- | --- | --- | --- | --- | --- |
| Authored Setup state | `dayFrameStore` holds preferences, range, shifts, cycles, templates, recurrences, and manual events; `DayFrameApp` owns an editable `SetupDraft` | Store snapshot after save; draft before save | `SetupScreen`, initial-state normalization, clone helpers, local storage | **Distributed:** values are coherent in store, transaction is UI-owned | Add one `setAuthoredSetup`/`commitSetup` store action; preserve existing field transforms and timestamps |
| Authored Setup mutation | `DayFrameApp.saveCurrentSetup` sequences six setters; store setters each persist and notify | No single atomic authority during the sequence | Setup draft, store setters | **Distributed and non-atomic** | First production task: replace the six-call sequence with one store transaction and one persist/notify |
| Derived Preview lifecycle | `dayFrameStore` owns `preview`, staleness, generation replacement, and revision replacement | `DayFrameState.preview`; intentionally absent from persisted authored state | Generation and revision functions; authored setters | **Coherent in store**, with UI orchestration around when to generate | Preserve store authority; do not persist Preview; later isolate lifecycle orchestration only if evidence requires it |
| Preview generation | `generateSchedulePreview` owns the pure pipeline; store adapts current authored state into its input; app derives window/timestamp and guardrail decision | Function return becomes store Preview | cycle generation, candidate generation, placement, manual-event conversion, friction detection, suggested fixes, shared time helpers | **Coherent engine; coordination distributed at boundary** | Preserve engine signature and ordering. Keep the first change upstream in authored commit |
| Preview revision | `reviseSchedulePreview` owns fix application and friction refresh; store owns Preview replacement; app diverts `changeFixedTime` into Setup focus | Revised engine result, then store Preview wrapper | `applySuggestedFix`, friction detection, suggested fixes | **Mostly coherent; one intentional workflow branch in UI** | No initial change; retain immutable inputs and timestamp behavior |
| Persistence and rehydration | Private functions in `dayFrameStore`; `createInitialDayFrameState` normalizes restored authored data | Two local-storage keys: authored state and profiles; Preview is session-only | browser `localStorage`, initial-state normalization, cycle/manual-event migration | **Coherent location; coupled to store mutations** | Keep schema/keys intact; aggregate commit must write once using existing serializer |
| Profiles | Store owns save/load/delete transitions; `dayFrameProfiles` owns versioned cloning and validation; app owns commands and messages | `savedProfiles` in store plus profiles storage key | authored snapshot extraction, backup clone helper, initial-state reset | **Coherent domain transition, distributed presentation** | Preserve current modules and replacement semantics; no new abstraction indicated |
| Backup/import/export | `dayFrameBackup` owns format, clone, parse, validation; store owns export/import transition; app owns file/download APIs and feedback | Versioned backup data for interchange; store after import | authored snapshot extraction, initial-state normalization, browser file APIs | **Coherent split by behavior** | Preserve; browser I/O should remain outside store |
| Manual calendar events | Store owns saved authored array; app owns editor draft, identity/timestamps, CRUD list construction, and regeneration; generation engine converts events to scheduled blocks | Store array after save; editor draft before save | manual-event normalizer, local storage, Preview pipeline, UI selection | **Distributed:** persistence is coherent, mutation policy and refresh are UI-owned | Not first change. A later event command seam may own create/update/delete plus stale policy; do not change conversion logic |
| Navigation/workflow | `DayFrameApp` local React state and handlers | `currentScreen` plus handler-driven transitions | Setup/Preview components, generation/profile/import outcomes | **Coherent for current two-screen shell but aggregate** | Keep local while only Setup/Preview exist; extract only with a lifecycle task and explicit transition model |
| Preview selection/editor context | `DayFrameApp` local state | selected range, pending range start, focused template field, active/manual editor IDs and draft | compact Preview interactions, manual events, Setup focus | **Distributed interaction context; not persisted** | Treat as shell context, not domain state; do not move into authored store |
| Feedback and recovery | `DayFrameApp` owns messages, errors, confirmations, and missing-item lists; Preview carries revision `actionFeedback` | Local UI state, except revision feedback inside Preview | store errors/results, import parser, generation guardrails | **Distributed and partly duplicated reset policy** | Later reducer/feedback seam may centralize shell feedback; out of scope for first production change |
| Focus and continuity | `DayFrameApp` owns selected day/range and `focusedTemplateField`; Setup consumes focus; effects rebuild draft after authored snapshots | Local React state | navigation, suggested-fix branch, store subscriptions | **Ambiguous at transition edges:** six save notifications can repeatedly rebuild draft | Atomic authored commit removes intermediate snapshots; preserve selection/focus behavior in tests |
| Shared date/scheduling infrastructure | `core/time`, effective-preference resolver, and cycle/block helpers; some UI/engine local date helpers duplicate conversion logic | Core helper results where used; local helpers where reimplemented | native `Date`, schedule preferences, active cycle segment | **Core coherent; conversion ownership duplicated** | Do not consolidate during the first task; preserve timezone and boundary semantics, then inventory equivalence separately |
| Legacy singular `shiftCycle` | Compatibility field/adapter in state types, initialization, persistence, backup/profile normalization, and store setter | `shiftCycles` is executable scheduling input; singular field mirrors/falls back to its first entry | migration and serialized compatibility paths | **Obsolete for scheduling, still active for compatibility** | Do not remove until stored/backup compatibility requirements and fixtures establish a migration boundary |
| `PreviewScreenContainer` | Standalone store-connected Preview adapter; production `DayFrameApp` renders `PreviewScreen` directly | No independent app authority observed | store subscription, effective preferences, PreviewScreen | **Obsolete or alternate entry is uncertain:** executable and tested, but no production caller found | Explicitly unresolved; do not delete based only on absent current import |

## Executable traces

| Path | Callers and mutation path | Persistence involvement | Behavioral evidence inspected |
| --- | --- | --- | --- |
| Setup save | `SetupScreen.onSave` → `DayFrameApp.saveCurrentSetup` → six store setters → six `persistState`/`notify` calls | Authored state only | `DayFrameApp` tests for unified save, dirty draft, preferences/range, cycles, templates, Preview staleness and regeneration; store tests for authored writes, staleness, persistence, and subscribers |
| Generate | App guardrail/window construction → `store.generatePreview` → `generateSchedulePreview` → work blocks → candidates → placement → manual blocks → friction → fixes → visible-range filtering | None for Preview | Engine full-pipeline, immutability, boundary, effective-preference, manual-event and cross-midnight tests; store generation tests; app generation/range tests |
| Revise | Preview action → app fixed-time branch or `store.applySuggestedFixToPreview` → `reviseSchedulePreview` → fix → friction/fix refresh | None for Preview | Revision tests for fix types, immutability, ignored state, timestamps and review guidance; store and UI wiring tests |
| Rehydrate | store creation → read authored/profile keys → `createInitialDayFrameState`/profile validation → legacy normalization → cloned snapshot | Reads both versioned keys; invalid/unavailable storage fails soft | store persistence/migration tests; profile, backup, and manual-event normalization tests |
| Profile replace | app command → store load → fresh initial state from profile → retain profiles → clear Preview → persist authored state | Profile writes use separate key; load writes authored key | store and app profile tests |
| Backup replace | app file parse → backup validation → store import → fresh initial state → retain profiles → clear Preview → persist authored state | Export does not write; import writes authored key | backup format/clone tests; store and app export/import/error tests |
| Manual event CRUD | compact day/editor state → app builds/replaces array → `setManualEvents` → stale Preview → app regenerates if Preview exists | Included in authored state, profiles, and backups | normalizer, store inclusion/migration, engine scheduling/friction, and app CRUD tests |

## Dependency-correct guardrails for the first change

The aggregate authored commit must:

- accept the same resolved range and transformed entities that the app currently sends;
- clone incoming arrays with the existing clone paths;
- update all authored fields before observers can read a snapshot;
- mark an existing Preview stale exactly once;
- persist exactly the existing authored schema and compatibility `shiftCycle` field;
- notify subscribers exactly once;
- leave generation/revision calls, ordering, timestamps, date helpers, profiles,
  backups, manual events, navigation, feedback, and focus semantics unchanged.

These constraints preserve deterministic scheduling because they do not alter any
engine input value or any scheduling/date function. They only make the existing
authored transition atomic before the unchanged engine reads it.

## Unresolved ownership questions

- No production import of `PreviewScreenContainer` was found. Its tests prove it is
  executable, not whether it is a supported alternate entry point.
- Browser persistence intentionally ignores storage failures. The executable code
  exposes no durable error authority, so desired recovery ownership cannot be
  inferred.
- Local date construction exists in core and UI-specific helpers. Equivalence across
  daylight-saving transitions was not established by the inspected tests; no
  consolidation is safe under this task.
- The singular `shiftCycle` compatibility horizon is not stated in executable code.
  It cannot be classified as safely removable despite being obsolete as a scheduling
  authority.
- `DayFrameApp` creates a seeded store when none is injected. Whether seed data is a
  production onboarding requirement or development convenience is not resolved by
  current callers/tests and is not a seam for Task 1.2.

## Validation record

- Ownership claims above derive from executable paths, not filenames or comments.
- Relevant tests were inspected for every behavioral guarantee listed in the trace.
- The existing automated suite was run after documentation updates; result is
  recorded in the Session Checkpoint.
- No production file was modified.
- No scheduling or date boundary was reassigned or renamed.
- Ambiguities and compatibility-only structures are recorded rather than assumed
  away.
