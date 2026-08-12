# UX Implementation Alignment Audit 01

## Phase 8 — State and Lifecycle Architecture

**Normative source:** `docs/architecture/DayFrame_Interaction_Architecture_Specification.md`, lifecycle responsibilities across Teach, Plan, Live, Learn, and shared utilities  
**Implementation scope:** `code/src/**`  
**Method:** Executable implementation and automated tests only  
**Audit date:** 2026-07-31

## Executive Findings

The implementation has three principal state authorities:

1. `dayFrameStore` owns authoritative authored Setup, the current generated Preview, and saved profiles during the runtime.
2. `DayFrameApp` owns the Setup draft and cross-screen contextual, feedback, confirmation, and editor state.
3. `SetupScreen` and native `<details>` own local disclosure and inline Setup-confirmation state for the lifetime of their mounted render trees.

Persistent storage is a representation of authored authority, not a full application snapshot. It stores scheduling preferences, Preview Range, shifts, cycles, templates, recurrences, and manual events. Saved profiles are stored separately. Preview, Preview revision metadata, screen, draft, selection, Calendar Day, focus, disclosures, confirmations, and messages are not persisted (`code/src/state/createInitialDayFrameState.ts:7-18`; `code/src/state/dayFrameStore.ts:398-477`).

The major implemented state machines are:

- Setup authority: reconstructed/synchronized draft → unsaved draft → saved authored state → current or stale Preview relationship;
- Preview: absent → blocked or generated → filtered/revised/stale/regenerated → replaced/cleared;
- manual event: closed → new/existing draft → saved/deletion pending/deleted → automatically regenerated Preview;
- utility replacement: active authored state → profile/import replacement or clear → reconstructed Setup with Preview absent;
- returning session: persisted authored/profile data → normalized runtime authority → reconstructed draft at Setup.

The strongest lifecycle alignment is the explicit distinction between enduring authored state and generated proposal state. Authored changes invalidate an existing Preview by marking it stale rather than rewriting or deleting it. Generation and revision have current-state metadata, and profile/import replacement clears a proposal that no longer corresponds to the active authored authority.

The principal divergences are:

- no accepted-proposal, active-plan, execution, historical-outcome, reflection, or learned state exists;
- Preview replacement and revision overwrite the prior proposal rather than creating recoverable versions;
- a stale Preview remains fully reviewable and may be revised because `applySuggestedFixToPreview` preserves its stale flag and has no currentness guard (`code/src/state/dayFrameStore.ts:266-300`);
- Generate Preview saves draft state before validation, so a blocked transition still changes authoritative/persisted Setup;
- profile/import/clear replacement clears Preview and selected range but does not coordinate every Calendar Day, focus, Setup confirmation, or utility-feedback state;
- rebuilding an empty authored Setup creates a default draft cycle, so the reconstructed draft can immediately differ from the cleared authoritative state (`code/src/ui/SetupScreen.tsx:2308-2324`).

The current Preview model is a meaningful Monthly Planner precursor for horizon, current proposal, filtering, friction, revision, invalidation, and regeneration. It has no selected-proposal version, accepted monthly plan, active plan, superseded plan, completed plan, or archive.

The implemented lifecycle ends at generated, revised, or stale proposal state. There is no executable transition to Live or Learn.

## Meaningful State Inventory

| Meaningful state | Classification / authority | Creation and transitions | Lifetime / persistence | Visible representation | Lifecycle classification / coverage |
|---|---|---|---|---|---|
| Initial runtime Setup | Reconstructed state; store + app | Store merges persisted/default data; app builds draft; screen initializes Setup | App runtime; authored subset may be persisted | Setup screen and workspace heading | Teach-like; tests `DayFrameApp.test.tsx:70`, `dayFrameStore.test.ts:24-112` |
| Synchronized Setup draft | Draft State; `DayFrameApp.setupDraft` | `buildSetupDraft(state)` on mount/store dependency changes | Runtime only; parent survives screen change | “All changes saved” when serialization equals authority | Teach-like; `DayFrameApp.tsx:67-72`, `:142-151`, `:1755-1788` |
| Unsaved Setup draft | Draft State; `DayFrameApp` | Any Setup field/add/delete changes draft | Runtime only; survives screen changes; lost/replaced on reload/profile/import/clear | Controlled inputs + “Unsaved changes” | Teach-like; tests `DayFrameApp.test.tsx:136`, `:396`, `:785` |
| Empty-authority/default-cycle draft mismatch | Draft State divergence | `buildSetupDraft` adds one draft cycle when authority has none | Runtime until Save/replacement | Cycle editor exists; dirty comparison can differ from cleared authority | Configuration draft; implementation inspection `SetupScreen.tsx:2308-2324` |
| Authoritative saved Setup | Authoritative/Persisted State; store | Save/Generate setters, manual event setters, load/import | Runtime + local persistence | Setup fields after rebuild; save/utility message | Teach-like; store `dayFrameStore.ts:50-143`, persistence `:398-427` |
| Saved Setup with no Preview | Composite lifecycle state | Initial/reload/profile/import/clear or saved before generation | Until generation | Setup plus no Latest Preview; empty Preview if opened via failed generation | Teach → Plan prerequisite; tested broadly |
| Saved Setup with current Preview | Composite authored/generated state | Successful generation/regeneration | Runtime only for Preview | Latest Preview + full Preview without stale warning | Plan proposal; tests `DayFrameApp.test.tsx:522`, `:1477` |
| Saved Setup with stale Preview | Authoritative + Invalidated State | Any authored setter while Preview exists | Runtime until regeneration/clear/replacement | Stale warning; old proposal remains | Teach/Plan boundary; tests `:1451`, `:1477` |
| Replaced Setup | Replaced State; store | Profile load or valid backup import | Runtime + persistence; prior active aggregate lost | Setup rebuilt; replacement message; Preview absent | Utility → Teach; tests `:409`, `:814`, `:2417` |
| Restored Setup after reload | Reconstructed/Persisted State | Store reads/normalizes local storage; draft rebuilt | New runtime | Setup; Preview absent | Teach-like restoration; state test `dayFrameStore.test.ts:24` |
| Preview absent | Generated-state absence; store `preview=null` | Initial/reload/profile/import/clear | Until generation; implicitly persistent absence | No Latest Preview; empty Preview state after failed Generate | Pre-Plan / cleared; `createInitialDayFrameState.ts:37-52` |
| Generation blocked | Transient workflow state; `previewGuardrailMissingItems` | Generate/Regenerate prerequisite check fails | Runtime until save/navigation/success/replacement | Missing-item list in Preview | Plan entry blocked; tests `DayFrameApp.test.tsx:1184`, `:1200`, `:2190` |
| Generated Preview | Generated State; store | `generatePreview` creates current aggregate | Runtime only; not persisted | planning window, generated timestamp, day groups | Plan proposal; `dayFrameStore.ts:232-264`; tests |
| Current Preview | Derived lifecycle condition | `preview !== null && isStale === false` | Until authored mutation/replacement | No stale warning | Plan proposal; tested |
| Filtered Preview | Contextual representation, not separate generated authority | selected day/range passed to PreviewScreen | Runtime selection lifetime | subset of day groups/counts; compact selection | Plan context; tests `DayFrameApp.test.tsx:548-631` |
| Revised Preview | Generated/Replaced State | selected suggested fix yields `didRevise` and `revisedAt` | Runtime only; prior arrangement overwritten | Revised timestamp/action feedback/changed blocks | Plan proposal revision; tests `:1346`, `PreviewScreen.test.tsx:238` |
| Stale revised Preview | Generated + Invalidated State | revise a Preview already stale; store preserves `isStale` | Runtime until regenerate/replacement | stale warning plus revised data/metadata | Architecturally ambiguous Plan state; implementation-confirmed |
| Regenerated Preview | Generated/Replaced State | Generate from saved authority after prior Preview | Runtime only; old proposal lost | new generated timestamp; stale cleared; `revisedAt` absent unless later revised | Plan current proposal; tests `DayFrameApp.test.tsx:1477`, `:1691` |
| Cleared Preview | Replaced/absent state | profile load, import, clear, reload | Until generation | Latest Preview removed | Utility/state reset; tests `:814`, `:2417` |
| Preview action feedback | Transient/generated feedback inside Preview authority | revision result supplies feedback | Until next generation/replacement or later revision result | Preview header message | Plan feedback; `state/types.ts:31-41`; `PreviewScreen.test.tsx:159` |
| No selected date/range | Contextual State; DayFrameApp | initialized/clear selection | Runtime only | full Preview | Plan context |
| One-day selection | Contextual State; DayFrameApp | first compact day activation | Runtime; survives ordinary screen changes | selected day button; filtered Preview | Plan context; tests `:548`, `:591` |
| Multi-day selection | Contextual State; DayFrameApp | second distinct day activation | Runtime | range-start/middle/end; filtered Preview | Plan context; tests `:548`, `:614` |
| Calendar Day open | Contextual State; DayFrameApp | active date + manual-event draft nonnull | Runtime until Close; may survive screen/replacement handlers | Calendar Day/Day Details panel | Plan-context editor; test `:899` |
| New manual-event draft | Draft/Transient State; DayFrameApp | selected date with no first matching event; Add Another | Runtime only | blank/default event editor | Plan-context authoring |
| Existing manual-event edit | Draft/Transient State; DayFrameApp | selected date with matching event or Edit Event | Runtime only; copied from authority | populated editor | Plan-context authoring; test `:899` |
| Authoritative manual event | Authoritative/Persisted State; store | Save Event | Runtime + authored persistence/profile/backup | event list, Preview manual block | Teach/Plan boundary; tests `:899`, state tests |
| Event deletion pending | Transient confirmation; DayFrameApp | Delete Event | Runtime until Cancel/Confirm/Close | Confirm/Cancel controls | Interaction state |
| Focused Setup correction | Contextual State; DayFrameApp + DOM focus | fixed-time recommendation | Until generic navigation/edit/save clears target | matching input focused/scrolled | Plan → Teach context; tests `:1611`, `:1797` |
| Setup disclosure expanded/collapsed | Contextual local state; SetupScreen | initial defaults/toggles | Mounted SetupScreen only | section content shown/hidden | Interaction state; test `:785` |
| Repeated-friction disclosure | Native contextual state | `<summary>` activation | DOM node lifetime | occurrences expanded/collapsed | Plan detail; test rendering/grouping only |
| Setup deletion pending | Transient local state; SetupScreen | Delete draft object | Setup mount or Cancel/Confirm | inline confirmation | Interaction state; implementation inspection |
| Profile-name draft | Transient utility state; DayFrameApp | profile input edit | Runtime until save/other edit/unmount | profile input | Utility state |
| Saved profile | Persisted utility snapshot; store/profiles storage | Save profile | Across reload until delete/clear | profile list name/time | Utility snapshot, not history; tests `:409`, state `:690` |
| Imported/rejected backup state | Transient utility + replaced authored state | file selection/parse/validate | accepted data persisted; result message runtime | success/error | Utility state; tests `:2417`, `:2484` |
| Clear confirmation pending | Transient State; DayFrameApp | Clear Local Data | Runtime until Cancel/Confirm/reset | destructive question/buttons | Utility interaction; test `:2260` |
| Cleared initial state | Replaced State; store | Confirm Clear | Runtime initial authority; persistence keys removed | Setup + clear message; reconstructed default-cycle draft | Utility reset; tests `:2280`, state `dayFrameStore.test.ts:992` |
| Setup dirty/saved feedback | Derived + transient feedback | JSON comparison; save message | Runtime; recomputed/replaced | action-bar status | Draft relationship; `DayFrameApp.tsx:126`, `:1755-1788` |
| Utility success/error | Transient State; DayFrameApp | profile/backup/clear outcomes | Runtime until mutually exclusive reset/other action | shared message slot | Utility feedback |
| Live/accepted/execution/history/reflection/learning | No authority | No transitions found | Absent | None | **Not Found — Not Implemented** |

## State Authority Matrix

| State family | Authoritative owner | Writers | Readers / representations | Persistence owner | Clearing/replacement authority | Authority notes |
|---|---|---|---|---|---|---|
| Authored Setup | `dayFrameStore.state` | store setters, profile load, import, clear | DayFrameApp snapshot, Setup draft builder, generator, profiles/backups | `persistState` / localStorage | profile/import/clear | Single store authority; cloned snapshots prevent direct mutation |
| Setup draft | `DayFrameApp` React state | SetupScreen via `setDraft`; store-subscription effect rebuild | SetupScreen; dirty comparator; Save/Generate | None | app remount; authored dependency notification | Draft authority distinct from store |
| Current Preview | `dayFrameStore.state.preview` | generate, revise, stale marking, load/import/clear | PreviewScreen, Latest Preview, Calendar Day | None | generation/revision/profile/import/clear/reload | One current proposal; no version collection |
| Saved profiles | Store runtime + separate storage | save/delete/clear | persistent shell | `persistProfiles` | delete/clear | Snapshot utility authority separate from active Setup |
| App destination/selection/editor/focus | DayFrameApp React state | DayFrameApp handlers | shell, Setup/Preview props | None | handlers/app remount | Related states have separate reset paths |
| Setup disclosures/deletion confirmations | SetupScreen local state | SetupScreen handlers | SetupScreen render | None | Cancel/Confirm/unmount | Can survive store replacement if Setup does not unmount |
| Repeated-friction disclosure | Native `<details>` state | browser activation | native render | None | DOM replacement/unmount | Not represented in React/store |
| Derived preview summaries/day groups | render calculation | no independent writer | shell/Preview/Calendar Day | None | recomputation | Representations, not authority |
| Dirty state | render-derived comparison | no independent writer | Setup status | None | recomputation | Excludes manual events because they are outside SetupDraft |
| Stale state | property inside Preview authority | every authored setter; generation clears | Preview warning/logic | None | generation/Preview replacement | Invalidation is explicit within generated authority |
| Guardrail/messages | DayFrameApp React state | handlers | inline feedback | None | reset helpers/new outcome/remount | May persist independently of source data |
| Persisted authored data | localStorage serialized representation | `persistState` | new store construction | browser storage | clear/rewrite | Does not include Preview/UI state |

Store subscription cloning means UI readers receive snapshots rather than the mutable store object (`code/src/state/dayFrameStore.ts:38-48`, `:303-310`, `:525-558`). There is one store writer API but several DayFrameApp sequences call multiple setters in succession.

## State Transition Matrix

| Source → destination | Trigger / authority | Side effects | Preserved | Replaced/lost | Reversibility | Coverage |
|---|---|---|---|---|---|---|
| Persisted/default authored → synchronized draft | app mount/store dependency change; DayFrameApp effect | clones/normalizes records; may synthesize default draft cycle | store authority | prior draft | reconstructed, not undo | state/UI tests |
| Synchronized draft → unsaved draft | Setup edit; SetupScreen/parent | dirty becomes true | store, Preview | prior draft value | manual edit back possible | `DayFrameApp.test.tsx:136`, `:396` |
| Unsaved draft → saved authored | Save Setup; DayFrameApp/store | persistence writes; Preview stale; draft later rebuilt | selection/editor | prior authored aggregate | no direct undo; profile/backup/manual reconstruction | tests `:158-396`, `:1451` |
| Current/revised Preview → stale | any authored store setter | clone Preview with `isStale=true` | proposal result/metadata | currentness only | Regenerate clears; authored rollback alone does not auto-clear | tests `:1451` |
| Draft → authored → generated | Generate; compound DayFrameApp/store | save/persist, switch screen, validate, create Preview | in-bounds selection/editor | prior authored/Preview on success | no direct undo | tests `:522`, guardrails |
| Preview absent → generation blocked | Generate with missing items | authored already saved; screen Preview; missing state set | authored; Preview remains null | none generated | recover by Setup + retry | tests `:1184`, `:1200` |
| Preview current/stale → regeneration blocked | Regenerate with missing items | missing state set; existing Preview retained | stale/current Preview | nothing | recover Setup + retry | implementation + guardrail tests |
| Preview absent/current/stale/revised → generated/regenerated | successful Generate/Regenerate | result replacement; stale false; revised metadata reset | authored; in-bounds selection | prior proposal/version | irreversible except reconstruct externally | tests `:522`, `:1477` |
| Generated/full → filtered | compact day/range; DayFrameApp | selection/editor context changes | Preview authority | visible subset only | Open Full clears filter | tests `:548-631` |
| Filtered → full | Open Full | clears selected and pending range | Preview | filter | directly reversible by reselection | test `:631` |
| Generated/current → revised | proposal fix; store | result/action feedback/revisedAt replacement | generatedAt/range/currentness | prior arrangement | no undo/version | tests `:1346`, container tests |
| Stale → stale revised | fix on stale Preview; store permits | revised result/metadata, `isStale` preserved | stale flag/authored | prior stale arrangement | no undo; regenerate | implementation-confirmed |
| Preview → focused Setup context | Review fixed time; DayFrameApp/DOM | screen change, focus/scroll | Preview/range/draft | shell messages; Setup local remount state | generic return possible | tests `:1611`, `:1797` |
| Closed/day selection → event draft | compact day; DayFrameApp | active date, edit ID/draft copied/defaulted | Preview | previous unsaved event draft | selecting prior date reconstructs authority, not lost draft | test `:899` |
| Event draft → authored event → regenerated Preview | Save Event; app/store | persistence, editor normalization, generation | active date/selection | prior event/Preview | manual edit/delete only; no undo | test `:899` |
| Existing event → deletion pending | Delete Event; app | confirmation ID set | all domain state | none | Cancel direct | test partly |
| Deletion pending → deleted + regenerated | Confirm; app/store | event removed, editor reset, Preview replaced | active date/selection | event/prior Preview | no direct undo | test `:899` |
| Saved profile → active authored replacement | Load Profile; store/app | persistence, Preview null, Setup, selection clear | profiles | active authored/Preview/range selection | load another snapshot/manual restore | tests `:409`, `:814` |
| Backup input → rejected | invalid file; handler | error only | all domain/context | input reset | retry | test `:2484` |
| Backup input → accepted/replaced | valid file; store/app | authored persist, Preview null, Setup/selection clear | profiles | active authored/Preview | import another/profile/manual | test `:2417` |
| Active state → cleared initial | confirm clear; store/app | persistence removed, Setup/selection reset | some uncoordinated local editor/focus states | authored/profiles/Preview | no direct undo; external backup not direct | tests `:2280`, state tests |
| Runtime → reload/reconstruction | app/store remount | storage read/normalize; draft rebuilt; screen Setup | persisted authored/profiles | Preview/context/draft/messages | lost state unavailable | state test `dayFrameStore.test.ts:24` |

## Legal Transition Model

### Setup draft and authored authority

```text
persisted/default authored
        │ buildSetupDraft
        ▼
reconstructed draft
        ├──equal serialized state──> synchronized
        └──default cycle synthesized / field edit──> dirty
                                                    │
                         ┌──────────────────────────┴─────────────┐
                         │ Save                                  │ Generate
                         ▼                                       ▼
                  authored replaced                       authored replaced
                         │                                       │
                 Preview stale if present                  validate/generate

profile/import/clear/store dependency change ──> draft rebuilt/replaced
```

The synchronization direction is store → draft on dependency change, draft → store only on Save/Generate. It is not continuous bidirectional synchronization.

### Preview

```text
absent
  ├──Generate invalid──> blocked + absent
  └──Generate valid────> current generated
                           ├──select range──> filtered representation
                           ├──fix───────────> revised current
                           ├──authored set──> stale
                           │                   ├──fix──> stale revised
                           │                   └──Regenerate valid──> current regenerated
                           ├──Regenerate────> current regenerated
                           └──profile/import/clear/reload──> absent
```

Legality findings:

- Preview cannot be generated through the UI without saving; Generate always saves first.
- Regenerate does not use unsaved Setup draft; it reads store authority.
- stale Preview remains reviewable and revisable.
- a prior proposal cannot be restored after generation/revision replacement.
- no generated Preview can transition to accepted/active/retired through executable UI.

### Manual event

```text
closed
  └──select date──> new draft OR existing-event draft
                         ├──edit locally
                         ├──Close──> closed / draft lost
                         ├──select another date──> replaced draft
                         ├──Save──> authored event + regenerated Preview
                         └──Delete pending
                                ├──Cancel──> existing draft/event
                                └──Confirm──> deleted + reset draft + regenerated Preview
```

UI entry to manual-event authoring requires an existing Preview because the compact day strip is the only opening control. The store can hold manual events without Preview, but that is not a user-accessible authoring transition.

### Profile/import replacement

```text
active authored + optional Preview/context/draft
    ├──Load Profile──────────> replaced authored + Preview null + selection null + Setup
    ├──Import invalid────────> unchanged authority + error
    ├──Import valid──────────> replaced authored + Preview null + selection null + Setup
    └──Clear confirm─────────> initial authored + profiles empty + Preview null + Setup

Calendar editor / focus / Setup local confirmation: not comprehensively cleared
```

### Returning session

```text
runtime authored mutations ──persistState──> authored JSON
profiles mutations ──────────persistProfiles──> profile JSON

reload/new store
  ├──valid storage──> normalized authored + profiles
  ├──missing/malformed storage──> default authored + empty/validated profiles fallback
  └──all cases──> Preview null, screen Setup, draft reconstructed, context reset
```

## State Transition Legality

| Question | Executable answer | Evidence |
|---|---|---|
| Generate Preview without saving? | **No through UI.** Generate calls Save first. Store API can generate directly, but that is not user transition. | `DayFrameApp.tsx:257-268` |
| Revise while stale? | **Yes.** UI retains fix buttons and store carries `isStale` forward. | `dayFrameStore.ts:266-300`; `PreviewScreen.tsx:334-375` |
| Review stale Preview? | **Yes.** warning is additive; day content remains rendered. | `PreviewScreen.tsx:86-380` |
| Regenerate from unsaved draft? | **No.** `generatePreviewFromSavedState` reads store. | `DayFrameApp.tsx:253-255`, `:1076` |
| Load profile while Setup dirty? | **Yes.** persistent control has no dirty guard; subscription rebuilds draft. | `DayFrameApp.tsx:438-513`, `:142-151` |
| Author manual event without Preview through UI? | **No entry found.** Calendar Day opens only from compact Preview days. | `DayFrameApp.tsx:711-788`, `:279-336` |
| Event draft survive selecting another date? | **No.** click calls `openManualEventPanel` and replaces edit ID/draft. | `DayFrameApp.tsx:279-336` |
| Preview remain after profile/import? | **No.** store replacement sets `preview:null`. | `dayFrameStore.ts:174-230` |
| Restore previous proposal after replacement? | **No.** only one Preview authority/version. | `state/types.ts:50-61`; store generation/revision |
| Generated → accepted? | **Not Found.** | broad inspection |
| Accepted → Live? | **Not Found.** | broad inspection |
| Live → history/Learn? | **Not Found.** | broad inspection |

## State Invalidation Matrix

| Invalidation condition | Affected state | Implemented response | Retained/incompatible state | Classification / evidence |
|---|---|---|---|---|
| Save any authored Setup field/collection | Current Preview | `isStale=true`; proposal retained | all old generated content remains reviewable/revisable | Marked stale; `dayFrameStore.ts:50-143` |
| Save manual event | Current Preview | first stale via setter, then automatically regenerated | active date/editor retained | Automatically replaced; `DayFrameApp.tsx:338-397` |
| Delete manual event | Current Preview | stale then automatically regenerated | active date/editor reset | Automatically replaced |
| Save fixed-time correction | Current Preview | stale | focused target cleared; selection retained | Marked stale; tested |
| Preview Range change/save | Preview and possibly selection | Preview stale; selection not immediately cleared; generation later clears if out of bounds | selection may reference old Preview until generation | Deferred correction |
| Generate with selection out of bounds | Selected range | clear selection after generation | new Preview retained | Automatically cleared; `DayFrameApp.tsx:239-248` |
| Profile load/import | Preview + selection + prior authored/draft | Preview null; selection clear; draft rebuilt | Calendar editor/focus/local confirmations not explicitly coordinated | Destructive replacement with reachable orphan risk |
| Clear local data | all store authority/profile/Preview/selection | initial store; persistence removed; selection clear | Calendar editor/focus/Setup local confirmation not explicitly cleared | Destructive replacement |
| Reload | runtime-only state | lost/reset; authored reconstructed | none of Preview/context restored | State loss by boundary |
| Delete shift referenced by cycle | draft relationships | Setup delete handler updates related draft cycles | authoritative state unchanged until Save | Draft consistency transformation |
| Delete template | template + matching recurrence | both removed from draft | focused target cleared through DayFrameApp setDraft wrapper | Draft relationship correction |
| Incomplete generation input | generation transition | rejected by guardrail, missing-item state set | authored state already committed; old Preview if any retained | Rejected generated transition |
| Malformed persisted storage | restoration | loader catches and falls back to defaults | malformed data not exposed | Rejected restoration input; `dayFrameStore.ts:378-395`, `:432-451` |

## Persistence and Reconstruction Matrix

| State | Persisted representation | Restoration behavior | Reload classification |
|---|---|---|---|
| Scheduling preferences | Direct in authored JSON | restored/merged with defaults | Persisted + reconstructed |
| Preview Range | Direct in authored JSON | normalized/fallback dates | Persisted + reconstructed |
| Shifts | Direct in authored JSON | cloned/normalized | Persisted + reconstructed |
| Cycles/segments/sequences | Direct in authored JSON plus legacy first-cycle field | normalized; legacy supported | Persisted + reconstructed |
| Templates | Direct in authored JSON, including `externalResources` | normalized defaults | Persisted + reconstructed |
| Recurrences | Direct in authored JSON | restored; used to normalize templates | Persisted + reconstructed |
| Manual events | Direct in authored JSON | normalized/migrated | Persisted + reconstructed |
| Saved profiles | Separate profile JSON | validated and cloned | Persisted + restored |
| Preview/result | None | always null from persisted-state constructor | Lost; must regenerate |
| generatedAt/revisedAt/actionFeedback/isStale | None | absent with Preview | Lost |
| Setup draft/dirty state | None | rebuilt from authored; dirty recalculated | Reconstructed, unsaved changes lost |
| Screen | None | initializes Setup | Reset |
| Selected/pending range | None | initializes null | Lost/reset |
| Calendar Day/editor/edit/delete state | None | initializes null | Lost/reset |
| Focused template target | None | initializes null | Lost/reset |
| Setup/repeated disclosures | None | component/native defaults | Remounted/reset |
| Confirmations | None | defaults | Lost/reset |
| Profile input/messages/guardrails | None | defaults | Lost/reset |
| Holiday/day summaries/repeated friction | None | recalculated only after Preview regenerated | Derived/regenerated |

`persistState` deliberately serializes only authored fields (`code/src/state/dayFrameStore.ts:398-427`). Storage write failures are swallowed, so runtime authored authority may diverge from persistence without rendered feedback (`:425-429`). Malformed stored JSON is caught and treated as absent (`:378-395`); malformed profiles validate to an empty fallback (`:432-451`).

## Draft Synchronization Assessment

### Initialization and reconstruction

`setupDraft` is initialized from the current store snapshot and rebuilt whenever preferences, Preview Range, shifts, cycles, templates, or recurrences change (`code/src/ui/DayFrameApp.tsx:67-72`, `:142-151`). Manual events are not part of `SetupDraft` and do not participate in this effect (`SetupScreen.tsx:85-96`).

`buildSetupDraft` clones authored fields, pairs every template with a matching/default recurrence, normalizes recurrence, and creates a default draft cycle when authority has none (`SetupScreen.tsx:2308-2381`). Thus reconstruction is not always identity restoration.

### Dirty state

Dirty state is derived by JSON comparison between serialized draft authored fields and the corresponding store fields (`DayFrameApp.tsx:1755-1788`). It is not an independently stored flag. It covers preferences, range, shifts, cycles, templates, and recurrences; manual events are separately authoritative and excluded.

### Commit and preservation

- Save Setup and Generate commit the draft.
- ordinary Setup/Preview screen changes preserve parent draft.
- section disclosure preserves draft.
- profile load/import/clear replace store dependencies and consequently rebuild/overwrite the draft.
- reload loses unsaved draft and reconstructs from persisted authority.

### Synchronization direction and overwrite

Synchronization is bidirectional only through explicit stages: store → draft by effect, draft → store by Save/Generate. Any external store dependency change while the draft is dirty can overwrite unsaved draft state. Profile/import/clear are reachable examples; there is no dirty-state guard around their persistent controls.

### Initial/cleared mismatch

When authoritative `shiftCycles` is empty, reconstruction inserts a default draft cycle. The dirty comparator compares that draft cycle with the empty authority, so a freshly cleared/empty authority can produce a non-synchronized draft representation. No direct test asserts the resulting status label.

## Preview State Model

Preview is one replaceable aggregate with:

- result collections;
- captured range and planning window;
- `generatedAt`;
- optional `revisedAt`;
- optional action feedback;
- `isStale`.

Evidence: `code/src/state/types.ts:31-41`.

### Creation/currentness

Generation clones current authored inputs, computes a result, writes one Preview, and sets `isStale:false` (`dayFrameStore.ts:232-264`). It does not persist Preview.

### Revision

Revision replaces result and optional feedback, retains the original `generatedAt` and window, sets `revisedAt` only if a revision occurred, and preserves current stale state (`dayFrameStore.ts:266-300`). A revised state is metadata on the current aggregate, not a separate version.

### Filtering

Filtering is external contextual state. `selectedPreviewDayRange` is passed as visible bounds to PreviewScreen; the store Preview remains unchanged (`DayFrameApp.tsx:83-86`, `:1107-1115`).

### Invalidation/regeneration

All authored setters clone/mark Preview stale. Regeneration replaces it entirely with a new nonstale generated aggregate. The old result, revision timestamp, and feedback are not retained as history.

### Absent lifecycle states

There is no accepted flag, selected proposal ID, active-plan state, superseded relationship, retirement marker, completion state, archive, or proposal-version collection.

## Monthly Planner Precursor Assessment

| Monthly Planner state responsibility | Current state support | Classification | Evidence |
|---|---|---|---|
| Planning horizon | Persisted Preview Range + captured Preview range/window | **Confirmed** | `state/types.ts:15-41` |
| Generated monthly proposal | Preview can use custom/month ranges; one generated aggregate | **Partial** | `SetupScreen.tsx:271-415`; generation tests |
| Current proposal | One `state.preview` with current/stale flag | **Confirmed** | `state/types.ts:50-61` |
| Proposal review | full/filtered/day representations | **Confirmed** | `PreviewScreen.tsx:86-380` |
| Proposal filtering | external selected day/range state | **Confirmed** | `DayFrameApp.tsx:83-86`, `:279-306` |
| Proposal revision | in-place suggested-fix revision | **Confirmed** | `dayFrameStore.ts:266-300` |
| Proposal invalidation | explicit stale flag on authored mutation | **Confirmed** | `dayFrameStore.ts:50-143` |
| Proposal regeneration | full replacement from saved authored authority | **Confirmed** | `dayFrameStore.ts:232-264` |
| Proposal comparison | no coexisting versions or comparison state | **Not Implemented** | single Preview field |
| Selected proposal among versions | no proposal collection/ID | **Not Implemented** | state shape inspection |
| Accepted proposal | no acceptance state/transition | **Not Implemented** | broad inspection |
| Active monthly plan | no active-plan authority | **Not Implemented** | broad inspection |
| Superseded plan | old Preview overwritten; no relationship retained | **Not Implemented** | generation/revision replacement |
| Completed plan | no completion authority/transition | **Not Implemented** | broad inspection |
| Archived plan | no archive/history | **Not Implemented** | broad inspection |

Preview is therefore a proposal-state precursor, not a complete Monthly Planner lifecycle state model.

## Manual-Event State Model

### Coherent combinations

- active date + new default draft + no edit ID;
- active date + copied existing event draft + matching edit ID;
- delete confirmation ID referring to an event in the active-date list;
- committed event + regenerated Preview projection;
- Close with active date/draft/edit/confirmation all cleared.

### Automatic synchronization

Save updates the authoritative event collection, copies the committed values back into the local editor, and regenerates Preview if present. Delete removes the authoritative event, clears confirmation/edit ID, recreates the date draft, and regenerates.

### Replacement/loss

Selecting another compact date calls `openManualEventPanel` and replaces the draft/edit ID. Close discards it. Reload loses it. There is no dirty indicator for the event draft.

### Uncoordinated or contradictory combinations

- editing the draft Date changes `manualEventDraft.userDayDate` but not `activeManualEventDate`; headings/day counts remain on the active date until another selection (`DayFrameApp.tsx:788-805`, `:864-876`);
- profile/import/clear replaces event authority and Preview but does not explicitly clear active date/draft/edit/delete state;
- Open Full Preview clears selected range but not Calendar Day state;
- a profile/import/clear replacement can leave a draft copied from prior authority visible in Calendar Day even though `activePreviewDayDetails` becomes null.

These combinations are reachable from persistent shell controls. Their combined rendered outcomes lack direct tests.

## Context-State Assessment

| Context state | Owner | Preservation | Clearing/remount | Domain relationship |
|---|---|---|---|---|
| Selected day/range | DayFrameApp | ordinary Setup/Preview changes, saves, fixes | Open Full, profile/import/clear, out-of-bounds generation, reload | filters Preview; not lifecycle state |
| Pending range start | DayFrameApp | screen changes | selection completion/clear/reload | helps build selection |
| Active Calendar Day | DayFrameApp | screen changes, Save/Regenerate | Close/reload; not profile/import/clear | selects derived Preview detail/manual events |
| Manual-event draft/edit ID | DayFrameApp | screen changes, event Save | date switch, Close, reload; incompletely reset by replacement | temporary copy/new authored input |
| Focused template target | DayFrameApp | until cleared by handler | generic Setup/Preview, Save, draft change, day click, reload; not replacement handlers | contextual pointer into draft collection |
| Setup disclosure | SetupScreen | draft edits/collapse changes | Setup unmount/reload | visibility only |
| Setup delete confirmation | SetupScreen | store replacement if component stays mounted | cancel/confirm/Setup unmount | index pointer into mutable draft collection |
| Repeated-friction disclosure | native DOM | ordinary render if node retained | Preview DOM replacement/unmount/reload | visibility only |
| Clear confirmation | DayFrameApp | screen change only if reset helper not called | many navigation actions/cancel/confirm/reload | utility workflow state |

None of these states constitutes accepted Plan, Live, or Learn lifecycle state.

## Feedback-State Assessment

| Feedback state | Authority / trigger | Replacement/clear behavior | Persistence | Connection risks |
|---|---|---|---|---|
| Setup dirty | derived comparison | recomputes on draft/store changes | none | default-cycle reconstruction can yield dirty against empty authority |
| Setup saved | `setupSaveMessage` after Save | cleared by draft change/navigation/replacement | none | directly tied to last save |
| Preview stale | Preview authority after authored setter | cleared only by generation/replacement | none | can coexist with later proposal revision |
| Missing Setup guardrail | DayFrameApp after failed generation | cleared by save/success/navigation/profile/import/clear | none | authored data was already saved before failure |
| Suggested-fix feedback | Preview authority after revision | replaced by later revision/generation/clear | none | retained with stale Preview if authored state later changes |
| Profile success/error | DayFrameApp | mutually cleared by profile/input/navigation/utility handlers | none | Setup edits/Save do not universally clear profile load message |
| Backup success/error | DayFrameApp | mutually cleared by utility/navigation handlers | none | shared slot prioritizes one message |
| Clear confirmation/message | DayFrameApp | reset by many handlers/cancel/new utility action | none | confirmation may be cleared by unrelated navigation |

The utility region renders one prioritized message chain (`DayFrameApp.tsx:599-651`). Feedback values are independently stored, while handlers manually enforce mutual exclusion. A “Loaded profile” message can remain after subsequent Setup edits because the Setup draft wrapper does not clear `profileMessage` (`DayFrameApp.tsx:1054-1060`).

## Replacement and Deletion Assessment

| Operation | Semantic mechanism | Old state accessible? | Dependent-state treatment | History/retirement |
|---|---|---|---|---|
| Save Setup | field-by-field aggregate replacement | only through external profile/backup/manual reconstruction | Preview stale; draft rebuilt | no Setup version history |
| Generate/Regenerate | Preview aggregate replacement | no | selection retained if valid; feedback/revision reset | no superseded proposal state |
| Proposal revision | Preview result replacement in same aggregate | no | range/generated time/stale retained; `revisedAt` updated | no revision history |
| Delete draft object | removal from unsaved collection | cancel only before confirm; manual recreation after | some relationships corrected | no retirement |
| Delete manual event | authoritative removal + Preview replacement | no direct recovery | editor reset; Preview regenerated | no event history |
| Delete profile | snapshot removal | no direct recovery | active Setup unaffected | no profile tombstone/history |
| Load profile/import | active authored aggregate replacement | source snapshot/file may remain externally | Preview/selection clear; draft rebuilt; some local context retained | utility snapshot is not lifecycle history |
| Clear data | destructive reset/removal | only external backup can reconstruct | persistence/profile/Preview/selection clear | no retirement/history |
| Mark Preview stale | invalidation, not deletion/replacement | stale proposal remains accessible | later revision permitted; regeneration replaces | closest state to retirement, but no historical semantics |

No implemented state is retired into immutable history. States are edited, invalidated, deleted, replaced, omitted from persistence, or lost.

## Reversibility Assessment

| Transition | Executable reversal classification | Evidence |
|---|---|---|
| Draft field edit | Manual reversal before commit; no generic undo | controlled inputs |
| Delete request | Direct cancellation before commit | inline Cancel controls |
| Confirmed draft deletion | Manual recreation; no undo | Setup handlers |
| Save Setup | No direct undo; load profile/import backup may replace but are not undo | store/UI |
| Generate/Regenerate replacement | No undo/previous version | single Preview authority |
| Suggested-fix revision | No undo; regeneration may recompute from authored state but does not restore prior revised arrangement as a version | store revision |
| Manual-event Save | Edit again/delete; no prior version | Calendar Day |
| Manual-event Delete | Manual recreation only | Calendar Day |
| Profile load | Load another saved profile/manual reconstruction | profile workflow |
| Profile delete | No direct reversal | store delete |
| Backup import | Another import/profile/manual reconstruction | import workflow |
| Clear Local Data | No direct reversal; external backup import possible | clear workflow |
| Filter selection | Directly clear/reselect | Open Full/day clicks |
| Stale invalidation | Regeneration produces current state; no operation simply marks old Preview current | store |

## State History and Versioning Assessment

The implementation stores current-state metadata:

- authored records have creation/update timestamps;
- profiles have `savedAt` and contain a point-in-time authored snapshot;
- backups have `exportedAt`;
- Preview has `generatedAt`, optional `revisedAt`, friction timestamps, and action feedback.

These do not form version history:

- active Setup has no version collection or prior-value chain;
- only one Preview exists;
- revision overwrites result state;
- regeneration overwrites revision metadata;
- event edits overwrite the event while retaining only creation/update metadata;
- deleted items have no tombstone;
- profiles are named utility snapshots without accepted-plan/execution semantics;
- stale Preview is invalidated current runtime state, not archived history.

No immutable execution record, historical outcome, reflection, audit log, or learned conclusion was found.

## Teach State Assessment

**Confirmed — Authoritative/Persisted State:** preferences, shifts, cycles, templates, recurrences, manual events, and resource requirement/data form enduring authored authority. Setup draft provides editable staging, and persistence reconstructs it across sessions.

Teach state is distinguishable from Preview in the store shape and invalidation behavior. It is configuration-shaped in its user-facing grouping and includes Plan-scope Preview Range. Manual events are persistent Teach-like authority edited from Plan context. Profiles and backups can replace the entire authority. There is no Learn output state or transition capable of updating it.

Profiles are alternate authored snapshots, not simultaneous active Teach versions. Only one authored aggregate is active.

## Plan State Assessment

**Confirmed — Generated State:** Preview represents a deterministic current proposal with horizon, work/scheduled/unplaced/friction result, generated time, revision time, feedback, and stale validity.

Plan contextual state supports filtering and focused day review without copying proposal authority. Proposal revision and invalidation are explicit. Current proposal identity is implicit in the single `preview` field; it has no durable ID or version relationship.

Absent Plan lifecycle states:

- selected proposal among alternatives;
- accepted proposal;
- committed/active plan;
- superseded/retired plan;
- completed plan;
- archived plan.

Manual-event projection appears in Plan, while its authority persists with authored Setup.

## Live State Assessment

No executable state authority or user transition represents active plan, active commitment, started, paused, delayed, completed, interrupted, resumed, actual time, deviation, or execution Note.

Core scheduled-block status supports string values such as `completed`, `missed`, and `skipped`, but executable non-test UI transitions only create `planned` and proposal fixes can create `skipped` or `rescheduled` within Preview (`code/src/core/blocks/placeBlockCandidates.ts:183`; `code/src/core/friction/applySuggestedFix.ts:158`, `:390`, `:434`; `PreviewScreen.tsx:686-700`). Those are proposal revision states, not Live execution authority.

Current-day highlighting and Calendar Day remain contextual Preview representations.

**Not Found — Not Implemented.**

## Learn State Assessment

No state represents historical outcome, actual-versus-planned evidence, Reflection, provisional/confirmed/rejected insight, historically derived recommendation, or applied learning.

Repeated Friction Patterns is a render-derived grouping of current visible Preview friction and is neither persisted nor historical (`PreviewScreen.tsx:73-84`, `:521-567`).

**Not Found — Not Implemented.**

## Shared Utility State Assessment

Profiles and backups preserve authored Setup snapshots. They do not preserve Preview, selection, draft, or lifecycle history. Profiles are independently persisted and survive profile load/import; Clear removes them.

Utility replacement appropriately clears Preview because its source authority has changed. It also rebuilds Setup draft. However:

- a dirty draft can be overwritten without a guard;
- Calendar Day/editor state is not explicitly cleared;
- focused target is not explicitly cleared;
- Setup local confirmation indices can survive if Setup remains mounted;
- utility feedback can remain after subsequent authored edits.

External backup may restore authored state after destructive replacement, but it is not direct state undo or historical lifecycle state.

Persistence failures are ignored by the store, so runtime state remains authoritative even when the durable representation cannot be written. No persistence-error state is rendered.

## Cross-State Consistency Assessment

| Concept distinction | Executable semantics | Consistency finding |
|---|---|---|
| Dirty vs stale | dirty = draft differs from authored; stale = Preview invalidated by authored mutation | Clearly distinct authorities and representations |
| Absent vs cleared | absent is `preview:null`; cleared is a transition producing null | Same representation, transition history not retained |
| Revised vs regenerated | revised retains generated time/window and adds revision metadata; regenerated replaces with new generated state | Distinct current-state semantics; no version history |
| Saved vs persisted | save mutates runtime then attempts persistence; storage failures swallowed | Saved runtime state does not guarantee durable persistence |
| Selected vs active | selected range filters Preview; active date owns Calendar Day/editor | Separate states can diverge |
| Draft vs authoritative | Setup draft staged; store committed | Clear separation, except Generate implicitly commits |
| Generated vs accepted | generated exists; accepted absent | No semantic conflation in state shape, but lifecycle stops |
| Deleted vs replaced | collections delete objects; load/import/generate replace aggregates | Distinct mechanisms; no retirement |
| Current vs historical | current authored/Preview only; timestamps do not create history | Historical state absent |
| Stale vs retired | stale remains active/reviewable/revisable; no retirement state | Stale is invalidation only |

## Orphaned and Contradictory State Assessment

| Candidate combination | Executable status | Basis / correction |
|---|---|---|
| Calendar editor after profile load/import/clear | **Reachable orphaned contextual state** | replacement handlers clear Preview/selection but not active date/draft/edit/delete; panel condition uses date+draft (`DayFrameApp.tsx:788`) |
| Manual-event draft date differs from active Calendar Day | **Reachable contradictory context** | Date input changes draft only; heading/details use active date (`:788-805`, `:864-876`) |
| Focus target after profile/import/clear removes template | **Reachable stale contextual pointer** | replacement handlers do not clear `focusedTemplateField`; focus effect may have already run; next generic edit/nav clears it |
| Setup deletion confirmation after profile/import/clear | **Reachable index mismatch when Setup stays mounted** | confirmation is Setup-local index; store replacement rebuilds collection without resetting component state |
| Selected range outside regenerated Preview | **Prevented after successful generation** | bounds check clears selection (`DayFrameApp.tsx:239-248`) |
| Open Full Preview with Calendar Day still open | **Reachable mixed context** | Open Full clears selected range, not active Calendar editor |
| Feedback for loaded profile after later Setup edit | **Reachable disconnected feedback** | Setup draft change does not clear profile message |
| Suggested-fix feedback on stale Preview | **Reachable** | authored setter clones Preview including feedback and marks stale |
| Confirmation for manual event removed by replacement | **Reachable orphan risk** | event delete ID not cleared by profile/import/clear; new manual event list may not contain ID |
| Stale Preview with invalid regeneration prerequisites | **Reachable but recoverable** | authored deletion can stale Preview; Regenerate guardrail retains stale Preview; Setup correction remains available |
| Focus target after template draft deletion | **Automatically corrected in ordinary draft edit** | DayFrameApp `setDraft` wrapper clears focus (`DayFrameApp.tsx:1056-1060`) |
| Malformed storage as runtime authority | **Prevented/rejected** | parser/validator fallback |

“Orphaned” here refers only to executable state whose referenced authority has been replaced or removed. The user impact of these combinations is not inferred.

## Structural Findings

1. Store-authored, app-draft, generated Preview, contextual UI, and persisted representations are distinct state layers.
2. The store owns one active authored aggregate and one current Preview aggregate.
3. Setup draft synchronizes in explicit stages rather than continuously.
4. Store dependency notifications can replace a dirty draft.
5. empty authored cycles reconstruct into a nonempty default draft cycle.
6. Authored mutations invalidate Preview through stale marking.
7. stale Preview remains reviewable and revisable.
8. generation/regeneration/revision replace proposal state without version retention.
9. filtering is contextual state external to Preview authority.
10. manual-event state spans local draft, persistent authority, active date, edit identity, confirmation, and generated projection.
11. replacement utilities clear central domain state more comprehensively than related contextual/local state.
12. persistence stores authored Setup and profiles but omits generated/contextual/workflow state.
13. saved runtime state can diverge from persistence because write failures are ignored.
14. timestamps describe current state but do not create history.
15. Preview supports proposal-state responsibilities but no acceptance/active/retired/completed/archive states.
16. no Live or Learn state machine exists.

## Experiential Findings

These are observable consequences of executable state structure:

1. After a Setup save, the previous Preview remains visible with a stale warning rather than disappearing.
2. A stale proposal can be changed through a suggested fix and remains labeled stale.
3. A blocked Generate attempt leaves the Setup draft committed and persisted before the missing-item state appears.
4. Regenerate ignores unsaved Setup draft and rebuilds from saved authored authority.
5. Regeneration and suggested fixes replace the prior proposal arrangement without a recoverable in-app version.
6. Filtering changes visible Preview information without changing generated authority.
7. Manual-event Save/Delete changes authored and generated state while retaining selected-date editor context.
8. Selecting another date or closing Calendar Day loses an unsaved event draft.
9. Profile/import replacement removes the current proposal and selected range but can leave local editor/focus/confirmation state present.
10. Reload restores authored Setup and profiles but returns to Setup without Preview or prior working context.
11. A cleared empty store can immediately reconstruct a draft containing a default cycle.
12. A persistence write failure leaves runtime state changed with no visible persistence-error state.
13. Preview timestamps show generation/revision of the current proposal but cannot recover earlier states.
14. The final represented lifecycle condition is a current, revised, or stale proposal—not an accepted or executing plan.

Whether state meaning, currentness, loss, or replacement is understood requires observational research.

## Behavioral Invariants

1. `currentScreen` initializes to Setup and is not persisted.
2. authoritative authored state is cloned before exposure to readers.
3. Setup draft is parent-owned and reconstructed from authored dependencies.
4. Setup dirty state is derived, not stored.
5. Save and Generate commit the entire Setup draft aggregate.
6. all authored store setters mark an existing Preview stale.
7. Generate saves before guardrail validation.
8. successful generation creates a nonstale Preview and replaces any prior Preview.
9. revision retains generation metadata and stale flag while replacing result state.
10. filtering never mutates Preview authority.
11. Regenerate reads store authority rather than draft state.
12. manual-event Save/Delete persists authored events and automatically regenerates existing Preview.
13. profile load/import clear Preview and preserve saved profiles.
14. clear removes active and profile persistence.
15. persisted restoration always constructs Preview as null.
16. no previous Preview, execution, or Learn history is retained.

## Architectural Gaps

The approved lifecycle states and responsibilities without executable implementation are:

- proposal identity independent of one current Preview slot;
- multiple proposal versions;
- proposal comparison;
- selected proposal;
- accepted proposal;
- committed/active Monthly Plan;
- superseded or retired plan;
- completed plan;
- archived plan;
- active execution/day/commitment state;
- started, paused, delayed, interrupted, resumed, completed, or deviated execution;
- actual start/finish and execution Note state;
- immutable historical outcome;
- planned-versus-actual record;
- Reflection;
- provisional, confirmed, or rejected learning;
- recommendation derived from history;
- Learn output applied to Teach or Plan;
- full Teach → Plan → Live → Learn lifecycle state transitions;
- state history/audit semantics;
- direct undo for committed authored/generated transformations;
- durable workflow-context restoration.

These are absence findings, not proposed states.

## Coverage Assessment

### Directly tested

- initial/default and persisted authored state;
- draft editing/preservation and dirty/saved feedback;
- authored setters and persistence;
- Preview generation/current state;
- filtered selection/range state;
- Preview revision and action feedback;
- stale invalidation and regeneration;
- fixed focused target;
- manual-event CRUD and regenerated projection;
- profile snapshot/load/delete replacement;
- backup valid/rejected states;
- clear confirmation and cleared store/persistence;
- range guardrails/warnings and selection reset from profile replacement.

### Partially tested

- component-remount disclosure loss;
- out-of-bounds selection clearing after generation;
- returning-session UI state beyond store restoration;
- Calendar Day Close/Add Another;
- stale Preview revision;
- empty-authority/default-cycle draft dirty state;
- storage-write failure divergence;
- malformed profile fallback.

### Implementation-confirmed

- exact authority ownership and reset paths;
- persistence inclusion/exclusion;
- legal stale-revision transition;
- proposal replacement/no version history;
- reachable orphaned state combinations;
- absence of accepted, Live, historical, and Learn state.

### Observational research required

The implementation cannot establish:

- whether users distinguish draft, saved, current, stale, revised, and regenerated state;
- whether state loss/replacement is anticipated;
- whether stale-but-revisable semantics are understood;
- whether returning-session reconstruction is perceived as continuity;
- whether context/state mismatches are noticed;
- whether proposal metadata communicates sufficient lifecycle meaning.

### Verification run

The five directly relevant UI test files were executed for this audit:

```text
5 test files passed
75 tests passed
```

State persistence and reconstruction findings additionally cite inspected tests in `code/src/state/tests/dayFrameStore.test.ts` and executable store implementation.

## Open Questions

1. No direct test establishes the rendered dirty status immediately after Clear Local Data reconstructs a default draft cycle over empty cycle authority.
2. Stale Preview revision is legal by implementation but lacks a direct end-to-end UI test.
3. Calendar Day/editor, focused-target, and Setup-confirmation states after profile/import/clear replacement lack combined-state tests.
4. The exact rendered result of Open Full Preview while Calendar Day remains open is not directly tested.
5. Persistence write errors are swallowed; no executable signal establishes whether durable state matches runtime after failure.
6. A dirty Setup draft can be overwritten by profile/import/clear store notification, but no direct test begins replacement from dirty state.
7. Native `<details>` expansion persistence across Preview revision/replacement is browser/DOM dependent and untested.
8. Non-all-day manual-event drafts have no explicit application validation for blank times; resulting generated-state legality is not established end to end.
9. Core execution-like status literals exist, but no user-facing transition authority establishes whether any non-UI consumer treats them as lifecycle state.
10. A store may be externally constructed with an initial Preview even though persistence never restores one; the user-facing lifecycle meaning of that injected state is not expressed.

