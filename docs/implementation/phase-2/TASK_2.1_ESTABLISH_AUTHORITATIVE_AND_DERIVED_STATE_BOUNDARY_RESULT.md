# Task 2.1 Result — Establish the Authoritative and Derived State Boundary

## 1. Executive Determination

**Confirmed:** DayFrame currently has five distinct state classes, but its main `DayFrameState` type combines three of them: active authored state, saved-profile artifacts, and a derived preview cache. Store-owned durability infrastructure and UI workflow state are already outside that object.

The seven fields selected by `DayFrameAuthoredSetup` are the authoritative active authored setup. `savedProfiles` is a separate authoritative collection of named authored snapshots. `preview` is a non-durable derived snapshot whose ordinary source is the authored setup plus generation-window inputs and timestamps.

**Architectural mismatch:** preview revision can change the displayed derived schedule without recording corresponding authored intent, so an exact revised preview is not regenerable from authoritative authored state.

**Architectural mismatch:** the default production UI constructs a persisted store and then unconditionally writes demo shifts, cycles, templates, and recurrences. This makes startup seeding an unadvertised authoritative writer and can replace four rehydrated authored collections.

No refactor is authorized by this result. The findings establish the boundary needed to sequence later Phase 2 work.

## 2. Artifact Integrity

- Saved task artifact: `docs/implementation/phase-2/TASK_2.1_ESTABLISH_AUTHORITATIVE_AND_DERIVED_STATE_BOUNDARY.md`
- Attachment examined: `/home/sid/.codex/attachments/e2fd178a-e39e-448e-b723-63bb26a7658d/pasted-text.txt`
- SHA-256 for both copies: `924899ec421b5b1f3e515efadf5d404836746ceafad6f988f41684612946ad00`
- Required title, metadata, sections, and final completion sentence were present.
- The specification was not modified.

## 3. Evidence Reviewed

Primary executable evidence included:

- `src/state/types.ts`
- `src/state/createInitialDayFrameState.ts`
- `src/state/dayFrameStore.ts`
- `src/state/dayFrameBackup.ts`
- `src/state/dayFrameProfiles.ts`
- `src/state/manualCalendarEvents.ts`
- `src/core/engine/generateSchedulePreview.ts`
- `src/core/engine/reviseSchedulePreview.ts`
- scheduling, cycle, placement, friction, and suggested-fix collaborators under `src/core`
- `src/ui/DayFrameApp.tsx`, `SetupScreen.tsx`, `PreviewScreen.tsx`, `DayVisualizer.tsx`, and `previewRangeWarnings.ts`
- directly relevant state, engine, and UI tests

The Task 2.1 contract, Phase 1 implementation history, durable-data compatibility decisions, and current repository scripts were used as supporting evidence. Executable behavior was given priority where descriptions and names alone were insufficient.

## 4. Complete State Inventory

| Object or field | Classification | Owner / writer | Durable? | Invalidated or replaced by | Regeneration / recovery |
|---|---|---|---|---|---|
| `DayFrameState.schedulingPreferences` | authoritative authored | store mutations; committed setup | active, profile, backup | setup commit, setter, profile load, import, clear, initialization/seed merge | user input, durable rehydration, profile/backup replacement, defaults |
| `DayFrameState.previewRange` | authoritative authored configuration with materialized cycle-derived dates | setup draft resolution then store | active, profile, backup | same replacement paths as above | user input/defaults; cycle-sourced dates are recalculated on setup commit |
| `DayFrameState.shiftDefinitions` | authoritative authored | store | active, profile, backup | commit/set/load/import/clear/startup seed | user input or durable source |
| `DayFrameState.shiftCycles` including segments and overrides | authoritative authored | store | active, profile, backup | commit/set/load/import/clear/startup seed | user input or durable source; raw singular form is compatibility-only ingress |
| `DayFrameState.blockTemplates` | authoritative authored | store | active, profile, backup | commit/set/load/import/clear/startup seed | user input or durable source; legacy sleep normalization can alter rehydrated form |
| `DayFrameState.blockRecurrences` | authoritative authored | store | active, profile, backup | commit/set/load/import/clear/startup seed | user input or durable source |
| `DayFrameState.manualEvents` | authoritative authored | dedicated store mutation | active, profile, backup | set/load/import/clear | manual-event workflow or durable source |
| `DayFrameState.savedProfiles` | authoritative secondary artifacts | profile mutations | separate profiles key only | save/replace-name, delete, clear, initialization; preserved by active replacements | profile storage or user save |
| `DayFrameState.preview` | derived cache / current display snapshot | generation and revision mutations | no | authored mutations mark stale; load/import/clear remove; generation replaces | generation; exact post-revision form is not fully regenerable |
| `preview.result.generatedWorkBlocks` | derived | preview engine | no | preview invalidation/replacement/revision snapshot cloning | cycles, shifts, window, effective preferences |
| `preview.result.blockCandidates` | derived | preview engine | no | preview invalidation/replacement | templates, recurrences, work blocks, window/preferences |
| `preview.result.scheduledBlocks` | derived, revision-mutable | engine/revision engine | no | invalidation/replacement/revision | placement plus manual-event projection; revised form may require lost fix choice |
| `preview.result.unplacedCandidates` | derived, revision-mutable | engine/revision engine | no | invalidation/replacement/revision | placement; revised form may require lost fix choice |
| `preview.result.frictionPoints` and fixes | derived, revision-mutable | friction engines | no | invalidation/replacement/revision | derived schedule, preferences, timestamps |
| preview range/window/timestamps | derived snapshot provenance | store generation action | no | next generation or preview removal | caller generation input; not inferred inside store |
| `preview.revisedAt`, `actionFeedback` | derived workflow metadata | revision action | no | next generation/removal; feedback replaced on action | revision attempt only |
| `preview.isStale` | derived validity marker | store invalidation | no | authored mutation sets true; generation sets false; replacement clears | store dependency policy |
| store `durabilityStatus` | infrastructure | persistence outcome handlers | no application-data persistence | write/removal/retry outcomes | initialized `unknown`; learned from attempts |
| store `desiredDurableCondition` | infrastructure retry intent | mutation/clear paths | no | mutations set `snapshot`; clear sets `absent` | initialized `snapshot` |
| ordinary and durability listener sets | infrastructure | subscriptions | no | subscribe/unsubscribe/store disposal | callers resubscribe |
| `DayFrameApp.stateSnapshot` | derived UI observation cache | store subscription | no | every store notification/store prop change | `getState()` / subscription |
| `DayFrameApp.durabilityStatus` | derived UI observation cache | durability subscription | no | durability notification | store accessor/subscription |
| `setupDraft` | workflow-local draft authority | setup UI | no | user edits; rebuilt from committed state | clone from committed setup |
| setup/manual/profile/backup/clear feedback and errors | workflow-local presentation | UI handlers | no | subsequent workflow actions/navigation | action outcomes |
| screen, panel, selection, focus, range-selection and confirmation state | workflow-local presentation | UI | no | navigation and local actions | defaults/user actions |
| `manualEventDraft` and edit/delete identifiers | workflow-local draft/control | UI | no | edit/save/cancel/delete/panel changes | committed manual event or defaults |
| `SetupScreen` disclosure, delete-confirmation and input-ref state | workflow-local presentation | component | no | component actions/unmount | defaults/DOM |
| preview range warnings, grouped days/friction, summaries and visualizer layout | derived presentation | UI pure calculations | no | render inputs/time/range selection | recomputation |
| raw singular `shiftCycle` | compatibility-only ingress | persistence/profile/backup normalizers | legacy input only; never newly emitted | plural data wins; normalization removes runtime singular form | promoted to one-element `shiftCycles` |
| execution/history state | absent | none | no | n/a | n/a |

## 5. DayFrameState Classification

`DayFrameState` is a runtime aggregate, not a single-authority object:

- seven fields are active authored authority;
- `savedProfiles` is durable secondary authority, not active scheduling authority;
- `preview` is derived and disposable.

**Confirmed:** cloning and subscriptions preserve this mixed aggregate for current API behavior. **Recommended:** later structural work may make these sub-boundaries explicit, but Task 2.1 does not prescribe the container shape.

## 6. Authoritative Authored State

The active authored source of truth is exactly:

1. `schedulingPreferences`
2. `previewRange`
3. `shiftDefinitions`
4. `shiftCycles`
5. `blockTemplates`
6. `blockRecurrences`
7. `manualEvents`

These values are non-derivable user intent, are emitted in the active durable payload, are captured in profiles and backups, and are the inputs from which a fresh preview is generated. Defaults and compatibility normalization establish initial representations but do not make the fields derived at runtime.

## 7. DayFrameAuthoredSetup Assessment

**Confirmed aligned:** `DayFrameAuthoredSetup` selects the seven authoritative fields and excludes profiles, preview, and durability infrastructure. It is reused consistently for profile data, backup data, and clone boundaries.

`CommitAuthoredSetupInput` intentionally omits `manualEvents`; setup-form commits do not own that independent workflow. This narrower input is not the complete authored boundary, while `DayFrameAuthoredSetup` is.

## 8. Workflow-Local State

The UI correctly keeps unsaved form edits, navigation, focus, confirmations, selections, and transient messages outside the store. Significant examples are `setupDraft`, `manualEventDraft`, current screen, preview day-range selection, pending range selection, focused template field, active/editing/deleting manual-event IDs, clear confirmation, and durability feedback/error messages.

`stateSnapshot` and the UI durability snapshot are observation caches rather than competing authorities. `SetupScreen` local disclosure and delete-confirmation state is presentation-only.

## 9. Draft Versus Committed Authority

While editing Setup, `setupDraft` is authoritative only for the unsaved form. The store remains authoritative for persistence and schedule generation. The Generate Preview workflow resolves cycle-sourced dates, commits the draft, and generates from the returned committed state; it does not directly feed an uncommitted draft to the engine.

Store changes rebuild the draft from committed state, so profile load/import/clear or another committed mutation replaces unsaved form state. This is current behavior, not an independently retained draft history.

Manual-event editing follows the same split: `manualEventDraft` owns unsaved fields; `manualEvents` owns committed scheduling input.

## 10. Preview State Classification

The base preview is a derived, non-durable cache and the current source for preview display. It contains generated work blocks, candidates, placed/manual blocks, unplaced candidates, friction and suggested fixes, plus generation provenance and validity metadata.

It is disposable on active-state replacement and regenerated on demand. Its presence inside `DayFrameState` does not make it authored authority.

**Partial alignment:** after preview-only revision, it also retains a user-selected transformation whose intent is absent from authored state. It remains non-durable derived workflow output, but exact reproducibility is lost.

## 11. Preview Generation Inputs

`generateSchedulePreview` receives cloned:

- shift definitions and plural shift cycles;
- block templates and recurrences;
- manual events;
- planning-window start and end;
- global day-boundary and week-start preferences;
- `generatedAt`.

Cycle segments can supply date-effective scheduling-preference overrides. The store also records caller-supplied display range dates. `previewRange` is not passed to the engine directly; `DayFrameApp` resolves it into the generation action's range and planning window.

## 12. Preview Invalidation Ownership

The store owns validity. Every setter for a preview dependency and `commitAuthoredSetup` calls `markPreviewStale`. Profile load, backup import, and clear remove the preview. Generation creates a fresh non-stale preview.

This central store ownership is aligned. The UI only communicates staleness and requests regeneration. It does not decide dependency validity.

## 13. Preview Revision Authority

`applySuggestedFixToPreview` invokes `reviseSchedulePreview` against a clone of the current result. It may change scheduled blocks, unplaced candidates, friction points, `revisedAt`, and feedback while leaving authored state unchanged and preserving the prior stale flag.

**Architectural mismatch:** accepted preview transformations are not recorded as authored intent or an explicit replayable command history. A later generation discards them. The method can also revise a stale preview, and the UI's stale warning does not disable fix buttons.

## 14. Suggested-Fix Authority

Suggested fixes are generated recommendations, not authority. Their handling is split:

- most actions revise only the derived preview;
- `changeFixedTime` navigates to the relevant Setup field and requires a separate authored edit and commit.

**Unresolved:** the product contract does not state whether an accepted automatic fix is a disposable preview experiment, durable authored intent, or a replayable execution command. Phase 2 must decide this before changing containers or engine APIs.

## 15. Manual-Event Authority

`manualEvents` is authoritative authored state with dedicated create/edit/delete workflow and persistence. Generation projects each event into derived fixed scheduled blocks. Those projections do not replace the source events. Profile/backup capture and active replacement include manual events.

The UI regenerates an existing preview after committed manual-event changes, even though the store first marks the old preview stale. This is workflow convenience layered over correct store invalidation.

## 16. Shift/Cycle Authority

Plural `shiftCycles`, nested segments, segment ranges, and segment preference overrides are authored authority. Shift definitions are separately authored and referenced by segments. Work blocks and effective preferences by date are derived.

Singular raw `shiftCycle` is compatibility-only at local-storage, profile, and backup ingress. It is normalized immediately to plural runtime authority and is not emitted by current writers.

## 17. Template/Recurrence Authority

Templates and recurrences are authored independently and jointly generate candidates. Generated candidates, placements, and skips are derived. Rehydration includes a narrowly targeted legacy default-sleep normalization, so the in-memory authoritative representation can be a normalized successor to the raw durable representation.

## 18. Scheduling Preference Authority

Global `dayBoundaryStartTime` and `weekStartsOn` are authored authority. Segment-level overrides are authored within cycles. The effective preference for a particular date is derived from those sources and is consumed by generation and UI time grouping.

## 19. Preview Range Authority

`previewRange` is authored configuration and travels through active persistence, profiles, and backups. It has a hybrid representation: source/preset/custom choice expresses intent, while `startDate` and `endDate` are materialized values. For `source: "cycle"`, setup commit recalculates those dates from the current cycle range.

The actual preview's range and `Date` planning window are derived generation provenance supplied by the UI. **Recommended clarification:** distinguish configured range intent from the resolved generation window in a later task.

## 20. Profiles Authority

`savedProfiles` is an authoritative, user-created collection of named, timestamped full-authored snapshots. It is not current scheduling authority until a profile is loaded. The collection is persisted under its own key and excluded from active-state persistence and backups.

Saving replaces an existing same-name profile or appends a new one. Deleting affects only this collection. Both operations leave active authored state and preview unchanged.

## 21. Profile Load Replacement Semantics

Loading a profile replaces all seven active authored fields from cloned profile data, preserves the entire profile collection, clears preview, resets no durability infrastructure directly except through the ensuing active write outcome, persists active state only, and notifies ordinary subscribers.

This is full active-authored replacement, not a merge.

## 22. Backup Import Replacement Semantics

Import validates and normalizes V1 data, clones all seven authored fields, replaces the active authored setup, preserves saved profiles, clears preview, and persists active state only. Backup metadata is not retained in runtime state.

This is full active-authored replacement, not a merge.

## 23. Clear/Reset Replacement Semantics

Clear replaces the entire runtime aggregate with `createInitialDayFrameState()`:

- default scheduling preferences and preview range;
- empty authored collections and manual events;
- empty profiles;
- null preview.

It changes both desired durable conditions to `absent`, attempts removal of both storage keys, records both outcomes, and notifies once. It is broader than profile load or backup import.

## 24. Store Initialization Semantics

`createDayFrameStore` loads active and profile durable surfaces independently, normalizes them, merges an optional `Partial<DayFrameState>` field by field, clones all boundaries, and starts durability status as `unknown` with desired conditions of `snapshot`.

Persisted active data cannot restore preview or profiles. Profile persistence cannot restore active data. An injected initial state can supply any `DayFrameState` field, including a preview, and wins over loaded data for supplied fields; this is useful for tests/injection but means initialization is a policy-bearing merge boundary.

## 25. Seeded-Store Purpose

**Confirmed behavior:** when no store prop is supplied, `DayFrameApp` calls `createSeededDayFrameStore`. That function first rehydrates a normal store and then calls four authoritative setters with demo shifts, cycles, templates, and recurrences. Each call persists and notifies its own mutation.

**Architectural mismatch:** this is production bootstrap behavior, not merely a test fixture. It overwrites those four rehydrated collections on every default app construction while preserving other active fields. The code does not condition seeding on an empty/new store, and the type/API does not identify demo data as non-authoritative. Its intended product purpose is not explicit.

## 26. Persistence Boundary

The active local-storage payload contains exactly the seven authored fields. It excludes preview, profiles, listener state, durability status, desired durable conditions, and UI drafts. Writes are synchronous outcomes; runtime mutation remains authoritative for the session even when a durable write fails.

The active key and profiles key are distinct durable surfaces. Raw singular-cycle support exists only while reading legacy payloads.

## 27. Profile Boundary

Profiles persist as a versioned collection separate from active authored data. Each profile data object uses the same complete authored boundary and deep clone helper. Profile normalization retains singular-only legacy read compatibility. Profiles exclude other profiles, preview, and infrastructure.

## 28. Backup Boundary

The V1 backup is a versioned envelope containing export metadata and one complete `DayFrameAuthoredSetup`. It excludes profiles, preview, workflow state, and durability state. Export clones current committed authored state. Import normalizes legacy forms and performs active replacement.

## 29. Clone/Snapshot Boundaries

`getState`, ordinary notifications, and mutation results expose deep-enough clones of the mixed runtime aggregate. Preview dates and result arrays are copied; profile data and authored nested arrays/resources are copied. Authored setup uses a dedicated clone shared by profiles and backups.

Snapshots prevent callers from mutating store internals, but a full `DayFrameState` snapshot still mixes authority classes. Store durability accessors and subscribers use separate shallow value snapshots, which is appropriate for scalar status objects.

## 30. Derived-State Inventory

Derived domain/runtime state comprises work blocks, effective scheduling preferences, block candidates, scheduled blocks, manual-event projections, unplaced candidates, friction points, suggested fixes, revision feedback, preview validity, and preview provenance.

Derived presentation state comprises state/durability observation snapshots, preview range warnings, unsaved-change detection, visible range selection results, user-day groups, holiday annotations, friction counts and grouping, formatted timestamps/ranges, and visualizer coordinates/layout.

Default values and normalized legacy values are initialization products, not continuously derived caches.

## 31. Derived-State Dependency Map

| Derived output | Direct authoritative/provenance dependencies | Regenerator |
|---|---|---|
| effective preferences by date | global preferences, cycles/segments | cycle preference resolver |
| generated work blocks | shifts, cycles/segments, planning window, effective preferences | cycle/work-block generation |
| block candidates | templates, recurrences, generated work context, window/preferences | candidate generator |
| scheduled/unplaced blocks | candidates, work blocks, preferences/window | placement engine |
| manual scheduled blocks | manual events, window/day boundary | preview engine projection |
| friction points | derived schedule, unplaced candidates, work context, timestamp/preferences | friction detector |
| suggested fixes | friction and derived schedule | suggested-fix generator |
| revised preview | prior preview, chosen fix IDs, day boundary, revised timestamp | revision engine; not authored-only regeneration |
| preview `isStale` | mutation dependency policy | store invalidation |
| range warnings | committed preview range and cycles | UI warning helper |
| visible preview groups/summaries | preview, selected visible range, effective boundaries, current time | UI render helpers |

## 32. Invalidation Matrix

| Operation | Authored dependencies changed? | Preview effect | Correctness assessment |
|---|---:|---|---|
| commit setup | yes, six setup-owned fields | mark stale | aligned |
| set preferences/range/shifts/cycles/templates/recurrences | yes | mark stale | aligned |
| set manual events | yes | mark stale; UI may immediately regenerate | aligned |
| save/delete profile | no active dependency | preserve | aligned |
| load profile | full active replacement | clear | aligned |
| import backup | full active replacement | clear | aligned |
| clear local data | full reset | clear | aligned |
| generate preview | consumes current inputs | replace, set fresh | aligned |
| apply suggested fix | derived state only | revise, preserve stale bit | **partial:** stale revisions remain allowed |
| persistence retry/status change | no domain input | preserve; no ordinary notification | aligned |
| default demo seeding | four authored inputs | stale/none through each setter | mechanically aligned, initialization authority mismatched |

No authored store mutation was found that silently changes a preview dependency without either staling or clearing the preview.

## 33. Replacement Matrix

| Operation | Active authored setup | Profiles | Preview | Infrastructure | Workflow drafts |
|---|---|---|---|---|---|
| narrow setter | mutate one field | preserve | stale | update active durability | rebuilt where subscribed dependencies change |
| setup commit | replace six setup fields; preserve manual events | preserve | stale | update active durability | rebuilt from commit |
| profile save/delete | preserve | mutate | preserve | update profile durability | local feedback only |
| profile load | replace all seven | preserve | clear | update active durability | setup draft rebuilds; preview selection clears in UI |
| backup import | replace all seven | preserve | clear | update active durability | setup draft rebuilds |
| clear | defaults/empty | clear | clear | desired absent + removal outcomes | UI handlers clear relevant workflow state |
| initialization merge | persisted/default fields, then supplied field overrides | separately loaded/overrideable | normally null, injectable | status unknown / desired snapshot | initialized afterward |
| demo seed | overwrite four authored collections | preserve | stale if present | four active write outcomes | initialized from resulting store |

## 34. Source-of-Truth Assessment

- **Authored state:** the seven active store fields selected by `DayFrameAuthoredSetup`.
- **Derived schedule:** the current `state.preview` is display truth, while authored state plus generation inputs is regeneration truth. A revised preview is an exception to complete regeneration.
- **Durability:** store-level durability status and desired durable condition, outside `DayFrameState`.
- **Profiles:** `savedProfiles` runtime collection, with the profiles key as last known durable checkpoint.
- **Workflow drafts:** the relevant UI draft while editing; committed store state after save/commit.

## 35. Behavioral Invariants

1. Current scheduling generation consumes plural cycles and never a runtime singular mirror.
2. Active persistence, profiles, and backups share the same seven-field authored data boundary.
3. Preview, UI drafts, and durability infrastructure are not written into active authored data.
4. Every committed authored dependency change invalidates or removes the preview.
5. Profile save/delete never changes active scheduling inputs.
6. Profile load and backup import replace all active authored fields, preserve profiles, and clear preview.
7. Clear resets runtime state and requests absence for both durable surfaces.
8. Runtime state continues after persistence failure; durability remains a separate dimension.
9. Store snapshots and durable artifacts are cloned rather than sharing mutable caller references.
10. A generated preview starts non-stale and is replaced, not merged, by a new generation.

## 36. Partial / Disconnected Paths

- **Architectural mismatch:** automatic preview fixes are disconnected from authored intent and durable replay.
- **Architectural mismatch:** production demo seeding is disconnected from an explicit empty-store/onboarding condition.
- **Partial:** preview-range intent and resolved dates occupy one object, while the store generation API accepts independently supplied window/range values.
- **Partial:** stale preview fixes remain clickable and revision preserves staleness rather than rejecting or regenerating.
- **Partial:** an injected `Partial<DayFrameState>` can establish derived preview state alongside rehydrated authority, primarily serving composition/testing without an explicit initialization-mode type.
- **Disconnected by design:** durability updates use a separate subscription and do not alter ordinary state snapshots.

## 37. Execution / History Assessment

No execution log, accepted-command history, undo history, or durable record of preview fix selections exists. `generatedAt`, `revisedAt`, and action feedback are snapshot metadata, not history. Saved profiles and backups are user-created authored snapshots, not an ordered mutation log.

Therefore a preview revision cannot be reconstructed as a sequence from durable authored state. **Unresolved:** whether Phase 2 requires execution/history state at all; this task only establishes that none currently exists.

## 38. Test Coverage Assessment

**Directly protected:** authored persistence shape, clone isolation, singular-cycle rehydration, preview generation, staleness after authored changes, profile/backup replacement, clear behavior, durability separation and retry, preview rendering, stale warning, setup-draft generation workflow, manual events, and suggested-fix engine behavior.

**Coverage gaps / weak contracts:**

- no explicit regression test proves the default production seeded store preserves existing persisted authored collections; current implementation would not;
- no contract test classifies seeded data as onboarding-only, demo-only, or authoritative;
- no end-to-end assertion establishes whether preview-only fixes should survive regeneration;
- no test forbids applying a suggested fix to a stale preview;
- no single matrix test proves every authored mutation participates in invalidation, though individual paths have substantial coverage;
- no type-level test enforces that `DayFrameState` is a mixed aggregate rather than a domain-authority boundary.

## 39. Architectural Alignment Assessment

**Aligned:** complete authored setup shape; plural cycle authority; active/profile/backup separation; preview non-persistence; store-owned invalidation; replacement semantics; durability outside `DayFrameState`; workflow drafts outside the store; clone isolation.

**Partially aligned:** `DayFrameState` mixes authority classes; preview range mixes intent and resolved values; generation range is caller-composed; optional initial state can inject derived state.

**Mismatched:** unconditional production demo seeding can overwrite rehydrated authority; preview-only accepted fixes are neither durable nor reproducible; stale previews can still be revised.

The current system is sufficiently mapped to authorize narrowly scoped follow-up investigations, but not a broad engine/state refactor.

## 40. Open Questions

1. Is demo seeding intended only for a genuinely empty first-run store, a development showcase, or all production starts?
2. Should an accepted suggested fix be a disposable preview experiment, a committed authored change, or a replayable command?
3. Should stale previews reject revision actions, disable them in UI, or implicitly regenerate first?
4. Should configured preview range intent be separated from its resolved cycle dates and planning window?
5. Should `DayFrameState` remain the public aggregate while explicit authored/derived subtypes express authority, or should containers themselves be separated?
6. Is injection of a prebuilt preview a supported production composition contract or test scaffolding?
7. Is future execution/history state required, or is deterministic regeneration plus authored fixes sufficient?

## 41. Recommended Phase 2 Follow-Up Sequence

1. **Resolve seeded-store initialization authority.** Define first-run/demo behavior and directly protect rehydrated authored data before other boundary work.
2. **Decide suggested-fix and preview-revision authority.** Specify durability, regeneration, stale-action, and replay semantics before changing engine or state types.
3. **Clarify preview-range intent versus resolved generation window.** Establish one owner for resolving and validating generation provenance.
4. **Make authority classes explicit in types/APIs.** Only after the above decisions, consider authored, profile, derived-preview, and aggregate boundaries without behavior drift.
5. **Centralize dependency/invalidation contracts.** Encode the approved dependency map and replacement matrix with direct tests.
6. **Evaluate execution/history need.** Add such state only if the decided suggested-fix model requires it.

## 42. Deviations

None. This was investigation only. No production code, tests, public types, UI, persistence behavior, engine behavior, governance document, ADR, checkpoint, changelog, or task specification was modified.

## 43. Discoveries and Deferred Work

The unconditional production seeded-store overwrite and non-regenerable preview revisions are the principal discoveries. Both are deferred because resolving them requires product/architecture choices explicitly outside Task 2.1.

The preview-range hybrid representation, stale-fix behavior, and permissive initial-state injection are secondary findings to address only after the two authority decisions above.

## 44. Validation

Validation commands and final outcomes:

- targeted `dayFrameStore`, `generateSchedulePreview`, `DayFrameApp`, and `PreviewScreen` suites: passed together, 4 files and 206 tests
- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm test`: passed, 23 files and 366 tests
- `npm run build`: passed; TypeScript check and Vite production build completed
- task artifact hash recheck: passed; saved specification and immutable attachment remained `924899ec421b5b1f3e515efadf5d404836746ceafad6f988f41684612946ad00`
- executable/governance diff check: passed; only this separate result artifact was created by Task 2.1

## 45. Final Completion Determination

**Complete.** The investigation produced the required authority, persistence, derivation, invalidation, replacement, and regeneration map; identified ambiguities and architectural mismatches; passed targeted and repository-standard validation; and preserved all executable and governance artifacts.
