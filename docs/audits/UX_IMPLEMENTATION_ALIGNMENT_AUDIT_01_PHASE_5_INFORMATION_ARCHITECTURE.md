# UX Implementation Alignment Audit 01

## Phase 5 — Information Architecture

**Normative source:** `docs/architecture/DayFrame_Interaction_Architecture_Specification.md`, Chapter VII — Information Architecture  
**Implementation scope:** `code/src/**`  
**Method:** Executable implementation and automated tests only  
**Audit date:** 2026-07-30

## Executive Findings

The implementation organizes visible information around two main aggregates:

1. **Authored Setup**, whose authoritative state consists of scheduling preferences, preview range, shift definitions, shift cycles, block templates, block recurrences, and manual events (`code/src/state/types.ts:50-74`).
2. **Preview**, a generated in-memory aggregate containing generated work blocks, all block candidates, scheduled blocks, unplaced candidates, friction points, planning metadata, revision feedback, and stale state (`code/src/state/types.ts:31-41`; `code/src/core/engine/generateSchedulePreview.ts:37-43`).

These aggregates are rendered through multiple synchronized representations. Authored information is primarily edited in Setup, with date-specific manual events edited in the shell’s Calendar Day panel. Preview appears as the full Preview screen, Latest Preview shell summary, selected Calendar Day projection, day visualizer, per-day lists, friction totals, and repeated-friction groupings. These are contextual projections of one current preview rather than independent preview owners.

The strongest Information Architecture alignments are:

- generated proposal, friction, and recommendations are co-located in Preview;
- recommendations are rendered next to their originating friction;
- templates and recurrences are grouped together;
- manual events remain visibly distinguishable from generated scheduled blocks;
- authored changes mark a generated preview stale, preserving the distinction between current understanding and an older proposal.

The principal divergences are:

- **Unplaced candidates** expose `BlockCandidate` information directly under the visible heading “Unplaced,” although Chapter VII identifies planning candidates as computational concepts that should remain internal (`code/src/ui/PreviewScreen.tsx:313-332`; `code/src/core/blocks/types.ts:104-127`).
- Setup presents implementation-shaped records—shifts, cycles, cycle segments, templates, and recurrences—as the primary information structure rather than consistently presenting routines, commitments, goals, plans, capacity, and outcomes.
- Proposal scope is authored under Setup while its generated representation appears in Preview and Latest Preview.
- The same preview-range warning list is rendered by both `DayFrameApp` and `PreviewScreen`, producing two synchronized representations in the same Preview environment (`code/src/ui/DayFrameApp.tsx:1096-1105`; `code/src/ui/PreviewScreen.tsx:105-114`).

The implementation contains no user-visible Goals, explicit Capacity, Allocations, Progress, historical outcomes, reflections, or historically derived recurring patterns. Repeated friction is derived only from the current visible Preview. Accordingly, Teach-like Setup has substantial information, Plan-like Preview has substantial proposal information, and Live/Learn have no information environment.

The dominant Information Architecture alignment problem is that visible information follows the current storage/generation structure more closely than the approved planning-concept hierarchy. The implementation makes shifts, cycles, templates, recurrence rules, candidates, and generated blocks primary concepts while several approved human planning concepts are absent.

## Information Object Inventory

“Authority” identifies the state or computation that controls the information. “Primary/supporting” describes its role in the current rendered environment, not its architectural importance in the normative model.

| Information object | Category / classification | Conceptual owner | Lifetime and authority | Primary representations | Role | Automated coverage |
|---|---|---|---|---|---|---|
| Authored Setup | Aggregate; authored | Teach-like Setup | Persistent; `DayFrameState` authored subset and `setupDraft` before save | Setup heading/copy, profile/backup copy, save status | Primary in Setup | `DayFrameApp.test.tsx:136-396`, `:409`, `:2297-2484` |
| Schedule Preferences | Domain concept; authored | Teach-like Setup | Persistent; `state.schedulingPreferences`; draft while editing | Setup global preference fields; cycle-segment override fields | Primary authored input | `DayFrameApp.test.tsx:158`, `:198` |
| Preview Range | Workflow/planning scope; authored | Plan concept rendered in Setup | Persistent; `state.previewRange`; draft while editing | Setup fields, Latest Preview Planning Range, Preview Planning Window | Primary scope / supporting metadata | `DayFrameApp.test.tsx:177`, `:853`, `:873`; `PreviewScreen.test.tsx:34` |
| Shift Definition | Domain/planning concept; authored | Teach-like Setup | Persistent; `state.shiftDefinitions` | Shift cards/editors; cycle segment selection; derived work blocks in Preview | Primary in Setup | `DayFrameApp.test.tsx:198`, `:1230` |
| Shift Cycle | Domain/planning concept; authored | Teach-like Setup | Persistent; `state.shiftCycles` | Cycle cards, modes, dates, segments, sequence; cycle-based range option; derived work days | Primary in Setup | `DayFrameApp.test.tsx:289`, `:326`, `:873` |
| Cycle Segment / sequence day | Domain structure; authored | Teach-like Setup | Persistent within cycle | Segment editor, shift selector, dates, notes, overrides; sequence-day selector | Supporting detail in Setup | `DayFrameApp.test.tsx:289`; broader behavior inspection |
| Block Template | Domain/planning concept; authored | Teach-like Setup | Persistent; `state.blockTemplates` | Template cards/editors; derived scheduled block; focused fixed-time field | Primary in Setup | `DayFrameApp.test.tsx:198`, `:1115`, `:1134`, `:1611`, `:2010` |
| Block Recurrence | Domain/planning concept; authored | Teach-like Setup | Persistent; `state.blockRecurrences` | Frequency/weekday/count editor; indirectly materialized in Preview | Primary/supporting in Setup | `DayFrameApp.test.tsx:198`, generation tests |
| Priority | Authored planning attribute | Teach-like Setup | Persistent within template; copied into candidate/scheduled block | Numeric Setup field; formatted scheduled/unplaced details | Supporting detail | `DayFrameApp.test.tsx:1115`; `PreviewScreen.test.tsx:238` |
| Timing and flexibility | Authored planning attributes | Teach-like Setup | Persistent within template | Placement type, preferred/fixed/custom time, duration, buffers, reschedule behavior | Supporting detail | `DayFrameApp.test.tsx:1115`, `:1691` |
| Resource requirement / External Resource | Authored supporting information | Teach-like Setup | `requiresResource` and `externalResources` persist within template; only the Boolean is editable in the UI | “Requires Resource” checkbox; no rendered external-resource collection or generated resource detail | Supporting detail, partially represented | `SetupScreen.tsx:2103-2129`; implementation inspection |
| Manual Event | Date-specific authored object | Plan-context shell panel | Persistent; `state.manualEvents` | Calendar Day editor/list, Preview Manual Events list, DayVisualizer projection | Primary for selected day; supporting in Preview | `DayFrameApp.test.tsx:899`; `PreviewScreen.test.tsx:68`, `:106` |
| Manual-event Notes | Authored attribute | Calendar Day panel | Persistent within manual event | Event textarea during edit; not rendered in Preview/day list | Supporting edit-only information | `DayFrameApp.test.tsx:899` stores input; no visible-output assertion |
| Saved Profile | Utility object / authored snapshot | Persistent shell utility | Persistent in separate profiles storage; `state.savedProfiles` | Profile list with name/saved time and load/delete controls | Primary utility information | `DayFrameApp.test.tsx:409`, `:814` |
| Backup | Utility transfer object | Persistent shell utility | Temporary exported/imported JSON; authored setup only | Export/import controls and status messages; native file selection | Supporting utility information | `DayFrameApp.test.tsx:2297`, `:2417`, `:2484` |
| Preview | Generated aggregate | Plan-like Preview | In-memory generated state; `state.preview`; not included in persisted authored storage, profiles, or backup | Full Preview, Latest Preview, Calendar Day, visualizer, summaries | Primary in Preview | `DayFrameApp.test.tsx:522-631`; `PreviewScreen.test.tsx:34-474` |
| Preview generation/revision metadata | Generated/workflow metadata | Plan-like Preview | Current preview lifetime; `range*`, planning window, `generatedAt`, `revisedAt` | Preview Summary; Latest Preview | Supporting proposal information | `PreviewScreen.test.tsx:34`, `:238`; `DayFrameApp.test.tsx:522` |
| Generated Work Block | Generated object | Plan-like Preview | Current preview result; generated from shifts/cycles | DayVisualizer, Preview Work list, Calendar Day Work list/count | Primary current-proposal information | `DayVisualizer.test.tsx:30-121`; `PreviewScreen.test.tsx:34`, `:260` |
| Scheduled Block | Generated object | Plan-like Preview | Current preview result; generated from templates/recurrences or manual events | DayVisualizer, Preview Scheduled/Manual lists, Calendar Day Generated/Manual counts/lists | Primary current-proposal information | `PreviewScreen.test.tsx:34`, `:68`, `:106`, `:199`, `:238`; `DayVisualizer.test.tsx` |
| Block Candidate | Computational generated object | Preview engine only | Temporary inside current preview result; `result.blockCandidates` | No direct complete UI representation | Hidden internal information | Core generation tests; no UI representation |
| Unplaced Candidate | Computational generated object made visible | Plan-like Preview | Current preview result; `result.unplacedCandidates` | Per-day “Unplaced” list with title and candidate details | Primary exception information | `PreviewScreen.test.tsx:34`, `:260`; core placement tests |
| Friction Point | Derived/generated planning information | Plan-like Preview | Current preview result; recomputed on generation/revision | Latest Preview headline/count/day marker; Preview totals; repeated group; day list; Calendar Day count/title | Primary recommendation context | `PreviewScreen.test.tsx:138`, `:260`, `:327`, `:350`, `:456`, `:474`; app tests |
| Repeated Friction Pattern | Derived presentation | Plan-like Preview | Render-derived from visible preview `dayGroups`; not stored | Repeated Friction Patterns summary/details | Supporting current-proposal analysis | `PreviewScreen.test.tsx:474` |
| Suggested Fix | Generated recommendation | Plan-like Preview | Current friction lifetime | Buttons beside individual friction and repeated occurrences | Primary decision-support information | `PreviewScreen.test.tsx:138`, `PreviewScreenContainer.test.tsx:49`, `:76` |
| Suggested-fix Feedback | Generated workflow information | Plan-like Preview | Current revised preview; `preview.actionFeedback` | Preview header message | Supporting result information | `PreviewScreen.test.tsx:159`; state tests |
| Friction severity/counts | Derived information | Plan-like Preview | Computed from visible nonignored friction | Preview Summary; Latest Preview label/count; Calendar Day count; day marker | Supporting status information | `PreviewScreen.test.tsx:327`, `:456`; `DayFrameApp.test.tsx:631` |
| Stale Preview state | Derived workflow information | Plan-like Preview | Preview lifetime; authored setters set `isStale` | Preview header warning | Primary validity information | `DayFrameApp.test.tsx:1451`, `:1477` |
| Preview-range Warning | Derived workflow information | Plan-like Preview | Recomputed from saved authored inputs; visible after preview exists | DayFrameApp Preview panel and PreviewScreen header | Supporting warning, duplicated synchronously | `previewRangeWarnings.test.ts:7-92`; `DayFrameApp.test.tsx:1524`; `PreviewScreen.test.tsx:177` |
| Generation Guardrail / missing item | Derived workflow information | Generate/Preview | Temporary parent UI state | Preview top panel missing-item list | Primary blocking information | `DayFrameApp.test.tsx:1184`, `:1200`, `:2190` |
| Selected Day/Range | Contextual information | Persistent shell / Plan context | App-mount lifetime; parent UI state | Compact day styles/ARIA, filtered Preview day groups, Calendar Day date | Primary local context | `DayFrameApp.test.tsx:548-631`, `:747`, `:814` |
| Calendar Day Details | Derived contextual projection | Persistent shell / Plan context | While active date/draft exist; derived from current preview | Work/generated/manual/friction counts and lists | Primary panel information | `DayFrameApp.test.tsx:899`; implementation inspection |
| Holiday | Derived external/static context | Plan-like Preview | Recomputed for visible preview range | Per-day holiday chips with name/type | Supporting date context | `PreviewScreen.test.tsx:429` |
| Downtime Day | Derived semantic state | Plan-like Preview | Per preview day with no work block | Work section empty state | Supporting current-situation information | `PreviewScreen.test.tsx:260` |
| Setup dirty/saved status | Derived workflow information | Setup | Screen/app lifetime; compares draft with store | Sticky Setup action bar | Supporting validity information | `DayFrameApp.test.tsx:396`, `:785` |
| Confirmation state | Temporary workflow information | Owning editor/utility | Component/app lifetime until cancel/confirm/unmount | Inline deletion and clear-data confirmation | Supporting safety information | `DayFrameApp.test.tsx:899`, `:2260`, `:2280`; Setup confirmations inspection |
| Utility message/error | Temporary utility information | Persistent shell utility | App-mount lifetime until reset/replacement | Profile, backup/import, and clear-data status region | Supporting utility information | `DayFrameApp.test.tsx:409`, `:2297-2484` |
| Current-day marker | Derived contextual information | Latest Preview | Computed from supplied/current time | Compact day `aria-current`, marker style | Supporting temporal context | `DayFrameApp.test.tsx:747` |

The store persists authored setup fields but deliberately omits preview from `PersistedDayFrameState` serialization (`code/src/state/createInitialDayFrameState.ts:7-18`; `code/src/state/dayFrameStore.ts:398-427`). Preview is copied in live snapshots but initializes as `null` from persisted authored state (`code/src/state/createInitialDayFrameState.ts:27-52`; `code/src/state/dayFrameStore.ts:525-558`).

## Information Ownership Matrix

| Information family | Conceptual owner | Authoritative source | Rendering environments | Contextual projections / duplicates | Ownership finding |
|---|---|---|---|---|---|
| Global preferences | Teach-like Setup | Store authored state / Setup draft | Setup | Segment overrides are related local authored information | Single owner; coherent locality |
| Work structure | Teach-like Setup | Shift definitions and cycles | Setup | Generated work blocks in Preview are consequences, not duplicate authored representations | Authored owner and generated projection are distinct |
| Repeatable life structure | Teach-like Setup | Templates and recurrences | Setup | Scheduled blocks and fixed-field return in Preview/Setup | Single authored owner; generated Plan projection |
| Proposal scope | Plan concept | Persisted preview range | Setup, Latest Preview, Preview Summary | Same dates represented as range input, compact range label, and planning window | Distributed rendering; owner/location mismatch |
| Manual events | Plan-context authored information | Store `manualEvents` | Shell Calendar Day, Preview, DayVisualizer | Editor/list and generated scheduled-block projections | Authored authority in store; representations synchronized after save |
| Current proposal | Plan-like Preview | Store `preview` in current app session | Preview, Latest Preview, Calendar Day | Summary, filtered day groups, timeline, counts | One authority, multiple synchronized contextual projections |
| Friction/recommendations | Plan-like Preview | Preview result friction points | Preview, Latest Preview, Calendar Day | Totals, markers, repeated grouping, occurrence detail | One authority; derived projections |
| Range warnings | Plan-like Preview | `getPreviewRangeWarnings` from saved inputs | Two locations in Preview environment | Identical warning list rendered by parent and child | Synchronized duplicate representation |
| Profiles | Shell utility | Separate profiles persistence | Persistent shell | Loaded data becomes active authored setup, but profile identity is not shown within Setup | Utility owner distinct from Teach data |
| Backup/import | Shell utility | Temporary backup JSON / validation result | Persistent shell | Imported authored data becomes Setup authority | Utility transfer representation |
| Setup status | Setup | Derived comparison/messages | Setup action bar | Shell utility messages are separate message system | Local owner |
| Historical information | Learn | No authoritative source | None | None | Not Implemented |

Rendering does not transfer authority. For example, Calendar Day counts and Latest Preview metrics are derived from `stateSnapshot.preview`; neither maintains a second proposal (`code/src/ui/DayFrameApp.tsx:110-125`). Similarly, generated scheduled blocks are consequences of template/recurrence authority, not editable duplicate templates.

## Representation Matrix

| Conceptual object | Representation count and locations | Synchronization | Authority | Contextual projection / conflict assessment |
|---|---|---|---|---|
| Authored Setup | 3 families: Setup editors; profile snapshots/list; backup utility copy | Store notifications rebuild Setup draft; profiles/backups are point-in-time copies | Active store authored state | Snapshots are intentionally separate; loaded/imported copy replaces authority |
| Preview | 4 principal environments: full Preview; Latest Preview; Calendar Day; DayVisualizer | All read the same current `stateSnapshot.preview`; visible-range filtering affects full Preview | Current in-memory store preview | Synchronized contextual projections |
| Preview range/window | 3: Setup range fields; Latest Preview range; Preview Summary planning window | Generated Preview captures saved range; Setup edits can make current Preview stale | Authored `previewRange` for next generation; preview-captured range for current proposal | Legitimate versioned difference signaled by stale state |
| Shift | 3: Setup shift editor; cycle shift references; generated work representation | Cycle references authored shift IDs; generation materializes work blocks | Store authored shifts/cycles | Related representations, not conceptual duplication |
| Template/routine proxy | 3: Setup template editor; scheduled block; unplaced candidate | Generated output copies selected attributes at generation | Store template/recurrence for future generation; preview copy for current proposal | Contextual generated projections |
| Manual event | 4: Calendar Day edit form; Calendar Day list; Preview Manual Events list; DayVisualizer block | Save updates store and regenerates preview if present | Store manual event | Synchronized after save; unsaved editor draft is intentionally temporary |
| Work block | 3: DayVisualizer; Preview Work list; Calendar Day Work list/count | Derived from same preview result/day grouping | Preview result | Synchronized visual, textual, and count projections |
| Generated scheduled block | 3: DayVisualizer; Preview Scheduled list; Calendar Day Generated list/count | Derived from same preview result | Preview result | Synchronized projections |
| Friction | 5: Latest Preview aggregate/markers; Preview aggregate counts; repeated patterns; per-day detail; Calendar Day count/title | All derived from current preview; ignored friction filtered from visible views | Preview friction points | Synchronized aggregates and contextual projections |
| Suggested fix | 2: repeated-friction occurrence; per-day friction occurrence | Both forward same friction/fix IDs to one handler | Preview friction point | Duplicated action representation for two contexts; no conflicting authority |
| Range warning | 2: parent Preview panel and child Preview header | Same `savedRangeWarnings` array supplied/rendered | Derived warnings function | Exact synchronized duplication within one environment |
| Holiday | 1 family: per-day chips | Recomputed during day grouping | Static holiday provider result | Contextual projection only |
| Profile | 1: shell list | Store subscription | Saved-profile storage | Single visible representation |
| Utility status | 1 shared slot with mutually exclusive message priority | Parent local state | Current message state | Multiple message types compete for one representation but do not conflict semantically |
| Selected day/range | 3: compact button state; filtered Preview; Calendar Day date | Parent state supplies all three | `selectedPreviewDayRange` plus `activeManualEventDate` | Related states can diverge because Calendar Day active date is separately owned |

### Conflicting or potentially divergent representations

No two independent authoritative Preview copies are maintained. Confirmed divergence instead occurs at representation boundaries:

- Setup range can change while existing Preview retains its old captured range. The Preview is marked stale, so both versions remain visible with validity information rather than silently conflicting (`code/src/state/dayFrameStore.ts:50-143`; `code/src/ui/PreviewScreen.tsx:93-95`).
- The Calendar Day editor’s editable `userDayDate` can differ temporarily from `activeManualEventDate`, which continues to drive the panel heading and derived day details (`code/src/ui/DayFrameApp.tsx:788-805`, `:864-876`). No test covers that interim state.
- Profile/import/clear handlers replace authored data and clear Preview selection but do not explicitly clear the separate Calendar Day draft states. The possible resulting representation is untested.

## Information Hierarchy Assessment

This assessment records render order, headings, grouping, and disclosure. It does not infer visual attention or user comprehension.

### Persistent shell

Executable render order is:

1. Saved Setup Profiles and backup/local-data utilities;
2. DayFrame brand and Setup → Preview explanation;
3. current “Workspace” heading and explanatory copy;
4. Setup / Generate Preview primary controls;
5. conditional Latest Preview summary and compact days;
6. conditional Calendar Day details/editor;
7. conditional main Setup or Preview screen.

Evidence: `code/src/ui/DayFrameApp.tsx:434-1115`.

Structurally, utility information precedes current planning context. Current proposal information appears in the shell only after a Preview exists. The shell therefore establishes persistent application-data information before current situation or immediate planning information.

### Setup

Setup presents:

1. environment identity and aggregate explanation;
2. sticky Save/Expand/Collapse/status;
3. Schedule Preferences;
4. Preview Range;
5. Shifts;
6. Cycles;
7. Templates and Recurrences.

Preferences and Shifts are initially open; Preview Range, Cycles, and Templates are initially collapsed (`code/src/ui/SetupScreen.tsx:127-131`). Each section places helper text and disclosure before detailed fields. Within collection sections, named cards precede attributes and deletion confirmation.

The hierarchy follows authored data type and dependency rather than the normative order of current situation, commitments, capacity, goals, recommendations, history, and supporting detail.

### Preview

Generated Preview presents:

1. Preview identity, draft-review instruction, stale/action/range messages;
2. proposal Summary metadata and friction totals;
3. repeated friction patterns, when present;
4. chronological day cards;
5. within each day: heading/holiday, visualizer, Manual Events, Work, Scheduled, Unplaced, Friction.

Evidence: `code/src/ui/PreviewScreen.tsx:86-380`.

Current proposal metadata precedes current-day content. Recommendations appear after the originating friction within day cards and inside repeated-pattern occurrences. Historical insight is absent. Available capacity is not represented as an explicit information object; “Unplaced” and downtime indirectly expose placement/capacity consequences.

### Contextual workspaces

Calendar Day presents date identity, then day counts, Work/Generated/Friction lists, then the manual-event editor and existing-event list (`code/src/ui/DayFrameApp.tsx:788-1041`). It co-locates selected-date proposal context and authored event information. Notes remain visible only during editing.

Fixed-time contextual return presents the full Setup hierarchy but focuses and scrolls the relevant field, making that information the programmatic target without changing section ordering (`code/src/ui/SetupScreen.tsx:135-151`).

## Information Locality Assessment

| Relationship | Current locality | Finding | Evidence |
|---|---|---|---|
| Preview and friction | Friction totals, patterns, and day details all live in Preview; compact projection persists in shell | Confirmed locality with multiple contextual projections | `PreviewScreen.tsx:117-200`, `:334-375`; `DayFrameApp.tsx:711-785` |
| Recommendation and originating problem | Suggested-fix buttons render directly under friction message or dated repeated occurrence | Confirmed locality | `PreviewScreen.tsx:166-191`, `:345-370` |
| Stale warning and affected Preview | Warning is in Preview header above current proposal | Confirmed locality | `PreviewScreen.tsx:89-104` |
| Range warning and affected information | Warning appears twice in Preview; editable range resides in Setup | Explanation local to proposal, source input nonlocal | `DayFrameApp.tsx:1096-1105`; `PreviewScreen.tsx:105-114`; `SetupScreen.tsx:271-415` |
| Generation guardrail and missing inputs | Missing-item list is in Preview; corresponding editors are separated by Setup sections | Relationship described by category, not co-located with inputs | `DayFrameApp.tsx:1086-1095`; tests `DayFrameApp.test.tsx:1184`, `:1200` |
| Manual event and selected day | Editor, date heading, counts, and existing events share Calendar Day panel | Confirmed locality | `DayFrameApp.tsx:788-1041` |
| Manual event and proposal | Preview renders manual events in their day and separately from generated blocks | Confirmed contextual projection | `PreviewScreen.tsx:237-310`; tests `PreviewScreen.test.tsx:68`, `:106` |
| Template and recurrence | Same Setup section and paired draft entry | Confirmed locality | `SetupScreen.tsx:1483-2253`; `buildDraftEntries` at `:2327-2345` |
| Shift and cycle reference | Cycle segment editor selects from shift definitions; Shift editor is a separate preceding section | Related information cross-referenced within cycle | `SetupScreen.tsx:417-686`, `:688-1481` |
| Preview range and Preview | Input is in Setup; current captured range is in Latest Preview and Preview Summary | Distributed by authored versus generated lifetime | `SetupScreen.tsx:271-415`; `DayFrameApp.tsx:732-749`; `PreviewScreen.tsx:117-150` |
| Unplaced candidate and relevant authored source | Candidate details are in Preview; no linked template/source editor is rendered there | Generated exception separated from authored source | `PreviewScreen.tsx:313-332` |
| Profile and represented setup | Profile list shows name/time, not contained shifts/cycles/templates | Snapshot identity local; snapshot contents not presented | `DayFrameApp.tsx:438-529` |
| Utility message and utility action | Shared region directly follows profile/backup/clear controls | Confirmed locality | `DayFrameApp.tsx:531-651` |

## Information Lifetime Matrix

| Lifetime class | Implemented objects | Storage / reset behavior | Presentation alignment |
|---|---|---|---|
| Persistent authored | Preferences, preview range, shifts, cycles, templates, recurrences, manual events | Serialized to `DAYFRAME_STORAGE_KEY`; replaced by profile/import; cleared by Clear Local Data | Presented as editable Setup except manual events in Calendar Day |
| Persistent snapshot | Saved profiles | Separate profiles storage; survives active setup replacement; cleared with local data | Presented persistently in shell with saved time |
| Temporary transfer | Backup JSON | Exists during export/import; not retained as visible object | Presented through controls and completion/error messages |
| Unsaved authored | `setupDraft`, `manualEventDraft`, profile name | Component/app memory until save/reset/unmount | Dirty status exists for Setup; manual editor has no separate dirty indicator |
| Generated session state | Preview and all result objects | Store memory; omitted from persisted authored serialization, profile, and backup; cleared by profile/import/clear | Labeled Generated/Revised/Stale and “Latest Preview” |
| Derived contextual | summary counts, day groups, repeated friction, holidays, downtime, selected-day details | Recomputed from Preview/time/selection on render | Presented only when relevant source exists |
| Temporary workflow | confirmations, guardrail missing items, success/errors, focused field | Component/app state; cleared by handlers/remount | Inline near owning workflow, except shared utility message slot |
| Historical | None | No execution/history authority found | Not Implemented |

Preview lifetime is communicated in part: the UI calls it a draft, gives generated/revised timestamps, and states that Preview data is excluded from setup backup (`code/src/ui/DayFrameApp.tsx:647-650`, `:1068-1085`; `code/src/ui/PreviewScreen.tsx:89-150`). It is not persisted by `persistState` (`code/src/state/dayFrameStore.ts:398-427`).

Manual events are persisted as authored setup despite being edited in a Preview-context panel. Their presentation does not explicitly distinguish their persistent lifetime from proposal-only scheduled blocks beyond the “Manual event” label.

## Representation Boundary Assessment

### Authored Setup → generated Preview

Generation copies authored inputs into a new Preview result (`code/src/state/dayFrameStore.ts:232-264`). Generated blocks display human-readable titles, times, category/placement details, and priority rather than internal IDs. This preserves conceptual identity at the title/activity level.

The boundary is explicit when authored data later changes: the existing Preview is marked stale and remains separate (`code/src/state/dayFrameStore.ts:50-143`; `PreviewScreen.tsx:93-95`).

### Preview → Latest Preview

`buildCompactPreviewSummary` derives range, generation time, visible-day count, friction label, and per-day markers from the current Preview (`code/src/ui/DayFrameApp.tsx:110-112`, `:1123-1215`). This is a synchronized compact projection. It omits scheduled activity detail by design and does not maintain independent authority.

### Preview → Calendar Day

`buildPreviewDayDetails` derives Work, generated/manual blocks, and friction for `activeManualEventDate` (`code/src/ui/DayFrameApp.tsx:113-125`, `:1217-1295`). The panel combines this generated projection with authoritative manual-event editing. Generated and authored information retain separate list/count labels.

### Preview → day visualizer and lists

Each day group renders the same work and scheduled blocks spatially and textually. Manual-source scheduled blocks are filtered into a separate list, while generated sources are placed under Scheduled (`code/src/ui/PreviewScreen.tsx:230-310`). Tests confirm manual events remain separate (`PreviewScreen.test.tsx:68`, `:106`).

### Friction → repeated pattern

Repeated patterns are derived from visible day-group friction, grouped by severity, title, message, and suggested-fix signature (`code/src/ui/PreviewScreen.tsx:521-567`). Occurrence dates and original fix identities are retained. This is a current-proposal aggregation, not historical information.

### Profiles/backups → active Setup

Profiles and backups contain cloned authored setup, not Preview (`code/src/state/dayFrameStore.ts:145-230`, `:454-463`). Loading/import replaces active authority and causes Setup to rebuild. The profile list presents only snapshot identity/time, so the contents are not duplicated in the utility region.

## Information Completeness Assessment

### Teach-like Setup

**Substantial but partial information completeness.** Setup provides recurring work structure, repeatable activities, timing preferences, priority, flexibility, recurrence, and rescheduling behavior. Relationships are partly visible: cycles reference shifts; templates are paired with recurrences; generated Preview later demonstrates consequences.

Information absent from the approved visible planning concepts includes Goals and a distinct user-facing Commitment concept. “Templates” and “recurrences” serve part of routine/commitment information but remain implementation-shaped labels. Setup does not present explicit available capacity or the relationship between a commitment and capacity.

### Plan-like Preview

**Substantial but partial information completeness.** Preview provides a proposal, current planning window, work/activities, exceptions, friction, recommendation actions, generated/revised validity, and current range warnings. This is sufficient to inspect the generated result and act on many friction recommendations.

It does not provide:

- explicit available Capacity;
- Goals/opportunities against which the proposal is evaluated;
- general provenance/explanation for every placement;
- a user-facing relationship from an unplaced candidate back to its authored source;
- an accepted-plan state.

Friction messages provide localized relationship explanations. Suggested fixes preserve the originating friction context. The implementation does not expose raw IDs, engine coordination, optimization state, or internal provenance structures.

### Live

**Not Implemented.** There is no current-execution information set, accepted plan, completion/deviation information, or reality-as-it-unfolds representation. A current-day marker and day visualizer remain projections of generated Preview.

### Learn

**Not Implemented.** There is no historical authority or presentation for outcomes, reflection, planning effectiveness, historical recurring patterns, or learned recommendations. Repeated friction is current-proposal derived.

### Shared utilities

Profile, backup, import, and clearing information is sufficient to identify named snapshots and communicate success/error state. Profile contents are not summarized before load, and backup content is described only as authored Setup excluding Preview.

## Structural Findings

1. **Two authoritative aggregates:** authored Setup and current in-memory Preview organize most visible information.
2. **Single proposal authority, multiple projections:** full Preview, Latest Preview, Calendar Day, visualizer, summaries, and friction groupings are synchronized derived views.
3. **Authored/generated lifetime separation:** authored records persist; Preview does not persist through `persistState` and is excluded from profiles/backups.
4. **Configuration-shaped grouping:** Setup groups information by preferences, shifts, cycles, templates, and recurrence records.
5. **Computational concept exposure:** unplaced `BlockCandidate` data is directly represented as “Unplaced.”
6. **Partial mechanism hiding:** raw candidate list, allocation records, constraints, optimization state, internal IDs, and provenance structures remain hidden.
7. **Localized recommendation relationship:** suggested fixes are presented with their friction source.
8. **Distributed proposal scope:** Preview Range is authored in Setup and projected in Preview/Latest Preview.
9. **Synchronized warning duplication:** the same range warnings render twice in the generated Preview environment.
10. **Contextual manual-event duplication:** one authored event has editor, list, generated-block, and visual representations tied to one authority.
11. **No historical information layer:** no historical source, object, hierarchy, or representation exists.
12. **Normative hierarchy incompleteness:** current situation/proposal and recommendations exist; explicit capacity, goals, opportunities, and historical insight do not.
13. **Separate but related date states:** selected Preview range, active Calendar Day, and editable manual-event date can represent different dates.
14. **Utility-first shell order:** profile/data administration is rendered before current workspace and planning context.

## Experiential Findings

These are observable consequences of structure, not claims about cognition.

1. A generated Preview can be inspected at aggregate, day, timeline, and conflict levels without creating separate proposal copies.
2. The same manual event appears as editable authored data, a labeled Manual Event, a scheduled visual block, and selected-day counts after save.
3. Changing authored Setup leaves the previous proposal visible but labeled stale, so old and new information are not silently merged.
4. Preview-range warnings appear in two places in the same rendered Preview, producing repeated identical warning content.
5. Unplaced items are shown using candidate-derived attributes, while the corresponding authored template is not presented alongside them.
6. Notes entered for manual events are available on later edit but are absent from Preview lists and Calendar Day event summaries.
7. Profile entries show name and saved timestamp but do not display the snapshot’s authored contents before load.
8. Repeated-friction information changes with the currently visible Preview range because it is derived from visible day groups, not a persistent pattern record.
9. Compact Latest Preview omits activity detail while retaining range, recency, day count, and friction, so it functions as a reduced synchronized projection.
10. The Calendar Day heading/counts can remain based on `activeManualEventDate` while the editor’s date field is changed to another date before save.
11. Information for correcting a fixed-time conflict retains the associated template identity and is presented at the matching Setup field.

Whether these consequences improve or impair understanding requires observational research.

## Behavioral Invariants

1. Authored state consists of preferences, preview range, shifts, cycles, templates, recurrences, and manual events.
2. Authored store changes mark an existing Preview stale.
3. Persisted application state contains authored setup but not Preview.
4. Profiles and backups contain authored setup but not Preview.
5. Preview generation derives work blocks, candidates, scheduled blocks, unplaced candidates, and friction from current authored inputs.
6. Full Preview, Latest Preview, and Calendar Day read one current Preview authority.
7. Manual events remain visibly separate from generated scheduled blocks in Preview.
8. Friction summaries exclude ignored friction from visible counts/groups.
9. Repeated friction derives only from visible current-preview day groups.
10. Suggested fixes remain attached to their originating friction occurrence.
11. Preview Range is editable in Setup and represented as current proposal metadata after generation.
12. Generated/revised timestamps and stale state describe current Preview validity.
13. Holidays are derived only for visible preview dates.
14. Setup draft information survives disclosure changes and ordinary screen switching.
15. No historical outcome or reflection state supplies the UI.

## Architectural Gaps

Approved Information Architecture responsibilities without executable user-facing implementation include:

- Goals as a visible planning concept;
- explicit Capacity information;
- opportunities in relation to available capacity;
- historical outcomes;
- reflections;
- historical recurring patterns;
- historical planning effectiveness;
- Learn recommendations derived from lived evidence;
- current Live awareness based on an accepted plan;
- execution outcomes and deviations;
- provenance for historical records;
- comprehensive understandable provenance for generated placements;
- visible relationships between commitments and reduced capacity;
- visible relationships between historical interruptions and planning quality;
- an information hierarchy containing all seven normative levels;
- progressive information disclosure based on experience or demonstrated need beyond local section/details toggles.

Raw allocation records, scheduling constraints, optimization state, internal provenance structures, and engine coordination remain unexposed, consistent with the hidden-computation principle.

## Coverage Assessment

### Automated-test-supported findings

The UI test suite directly covers:

- Setup information group rendering and draft persistence;
- authored preferences, ranges, cycles, templates, recurrence, and selected attributes;
- Preview metadata and day groups;
- work, scheduled, manual, unplaced, friction, warnings, feedback, holidays, and downtime representations;
- manual-event separation and all-day formatting;
- visible-range filtering and friction counts;
- repeated-friction grouping;
- stale-state information;
- profile and backup scope;
- selected-day and Calendar Day information;
- utility messages and validation.

Core/state tests additionally cover generation result composition, placement/unplaced state, friction/fixes, manual-event normalization, persistence, backup validation, and profile snapshots.

The five UI files most directly supporting this audit were executed:

```text
5 test files passed
75 tests passed
```

### Executable-inspection-supported findings

Inspection establishes:

- authoritative state and lifetime;
- every rendering location and projection relationship;
- Preview omission from authored persistence/profile/backup;
- shell/Setup/Preview render hierarchy;
- the direct mapping from unplaced candidates to visible rows;
- hidden versus exposed computational fields;
- absence of Goals, Capacity, history, outcomes, and reflections;
- representation-boundary and local-state relationships.

### Observational-research questions

Executable evidence cannot establish:

- which information users perceive as primary;
- whether “template,” “cycle,” “recurrence,” “candidate,” or “friction” maps to users’ planning concepts;
- whether duplicated warnings are interpreted as one or multiple problems;
- whether contextual projections are recognized as the same Preview;
- whether visible information is sufficient for confident decisions;
- whether progressive disclosure matches experience or expertise;
- whether utility-first shell order changes perceived importance.

### Coverage limitations

- No test asserts manual-event notes in a non-editor representation.
- No test covers divergence between Calendar Day active date and edited event date.
- No test combines open Calendar Day information with profile/import/clear replacement.
- No test directly verifies Preview omission after a full application reload.
- No test asserts every Setup field or every formatted generated attribute.
- Automated tests cannot establish conceptual ownership or information comprehension.

## Open Questions

1. The Calendar Day editor permits its date field to diverge from the active day driving headings/counts. The pre-save relationship between those two representations is not tested.
2. Profile, import, and clear workflows do not explicitly clear all Calendar Day local information states. The resulting representation after replacement is untested.
3. Templates can require a resource and internally retain `externalResources`, but no user-facing interaction for authoring that collection or Preview representation of its attributes was found.
4. Manual-event notes persist but have no confirmed representation outside the edit textarea.
5. A core scheduled-block status supports values beyond `planned`, but no user-facing representation establishes whether those values are intended as hidden computation or future execution information.
6. Preview is not serialized by the current persistence function, but a store can be constructed with an initial Preview. The application-level meaning of externally supplied Preview lifetime is not user-visible.
7. The visible term “Unplaced” is backed directly by `BlockCandidate` data. Implementation confirms the representation but cannot establish whether users interpret it as a planning concept or computational structure.
