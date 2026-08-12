# UX Implementation Alignment Audit 01

## Phase 6 — Interaction Architecture

**Normative source:** `docs/architecture/DayFrame_Interaction_Architecture_Specification.md`, Chapter IX — Interaction Patterns  
**Implementation scope:** `code/src/**`  
**Method:** Executable implementation and automated tests only  
**Audit date:** 2026-07-30

## Executive Findings

The implementation provides a broad set of atomic interactions for:

- editing an unsaved authored Setup draft;
- creating and deleting draft shifts, cycles, segments, sequence entries, templates, recurrences, and resources;
- committing the complete Setup draft to authoritative authored state;
- creating and revising generated Preview state;
- creating, editing, and deleting persistent manual events;
- selecting proposal dates and disclosing contextual detail;
- saving, loading, deleting, exporting, importing, and clearing application data.

Three interaction-authority layers are implemented:

1. `SetupScreen` owns immediate transformation of the unsaved `setupDraft` through `setDraft`.
2. `DayFrameApp` owns interaction coordination, confirmation, context state, and compound transformations.
3. `dayFrameStore` owns authoritative authored, generated, profile, backup, and persistence mutations.

This division is explicit in executable behavior: Setup field changes alter the parent-owned draft but not persisted state; `saveCurrentSetup` writes each authored collection through store setters; generation creates a separate Preview aggregate; proposal fixes revise only Preview (`code/src/ui/DayFrameApp.tsx:67-72`, `:186-268`, `:399-431`; `code/src/state/dayFrameStore.ts:50-300`).

The strongest alignments with the approved interaction model are:

- recommendations remain optional and user-activated;
- friction messages precede suggested-fix controls;
- proposal-only recommendations do not silently rewrite enduring authored information;
- the fixed-time recommendation routes to the exact authored field without changing it;
- meaningful saves, generation failures, proposal revisions, imports, and destructive operations produce visible feedback;
- destructive deletion and clearing use inline confirmation;
- collapsible sections and conditionally revealed fields provide progressive interaction;
- editing is repeatable, and authored changes mark an existing proposal stale rather than merging states silently.

The principal boundary divergences are:

- **Generate Preview** is one atomic user interaction that saves every unsaved authored edit, changes environment, validates inputs, and creates or replaces generated proposal state (`code/src/ui/DayFrameApp.tsx:257-268`).
- Manual-event Save/Delete is owned by a Plan-context shell panel but transforms persistent authored information and automatically replaces Preview state (`code/src/ui/DayFrameApp.tsx:308-397`).
- Preview Range is edited as part of Setup draft even though it scopes Plan generation.
- Notes are captured only as metadata on manual planning events; they are not an execution-context capture interaction as defined by the normative model.
- Users predominantly manipulate implementation-shaped records and settings—shifts, cycles, segments, templates, recurrences, range sources—rather than direct Commitments, Goals, Routines, Reflections, or accepted Plans.

No Live or Learn interactions exist. There are no atomic interactions for beginning execution, completing, skipping or delaying during lived time, recording actuals/deviations, reflecting, confirming learned conclusions, or transforming history into future understanding.

The dominant Interaction Architecture issue is that implemented transformations are internally well separated between draft, authored, and generated authority, but their user-facing ownership is not consistently separated between Teach and Plan.

## Audit Model

This phase uses the following terms:

- **Interaction:** one user-initiated operation, such as changing a field, selecting a fix, saving, or confirming deletion.
- **Transformation:** the information created, changed, derived, replaced, or discarded by that operation.
- **Interaction Authority:** the component/environment that accepts the operation and the state owner that commits its transformation.
- **Interaction Boundary:** a transfer of responsibility between draft, authored, generated, contextual, or utility authority.
- **Interaction Outcome:** the rendered or state-level result after an operation completes.

A workflow is a sequence of interactions. This audit inventories the atomic interactions and transformations but does not evaluate end-to-end workflow efficiency.

## Interaction Inventory

Equivalent field-level operations are grouped where they share the same authority, transformation, boundary, and outcome.

| Atomic interaction | Initiating environment / authority | Information transformed | Transformation and outcome | Boundary | Classification | Evidence / tests |
|---|---|---|---|---|---|---|
| Edit global scheduling preference | Setup / `SetupScreen.setDraft` | `setupDraft.schedulingPreferences` | Replaces one draft value; dirty status becomes visible; authoritative state unchanged | None; draft only | Confirmed draft interaction | `SetupScreen.tsx:207-269`; `DayFrameApp.test.tsx:158` |
| Edit Preview Range source/preset/date | Setup / `SetupScreen.setDraft` | `setupDraft.previewRange` | Replaces draft range, sometimes derives dates from preset/cycles; authority unchanged until save | Plan information inside Setup draft | Boundary Ambiguity | `SetupScreen.tsx:271-415`; tests `DayFrameApp.test.tsx:177`, `:853`, `:873` |
| Add shift | Setup / `SetupScreen.setDraft` | Draft shift collection | Appends a default draft shift and exposes its editor | None; draft only | Partially aligned lightweight creation | `SetupScreen.tsx:417-466`; `DayFrameApp.test.tsx:198` |
| Edit shift identity/timing/workdays | Setup / `SetupScreen.setDraft` | One draft shift | Replaces attributes or weekday membership; visible field/card updates immediately | None; draft only | Confirmed management | `SetupScreen.tsx:541-682`; `DayFrameApp.test.tsx:198` |
| Request shift deletion | Setup / local confirmation state | Confirmation information only | Sets pending shift index; no authored/draft object removed | None | Protective interaction | `SetupScreen.tsx:118`, `:469-527`; inspection |
| Cancel shift deletion | Setup / local confirmation state | Confirmation information | Clears pending index; shift remains | None | Confirmed cancellation | `SetupScreen.tsx:486-527`; inspection |
| Confirm shift deletion | Setup / `setDraft` | Draft shifts and cycle references | Removes shift and updates affected cycle data in draft; authority unchanged until save | Draft relationship transformation | Confirmed destructive management | `SetupScreen.tsx:486-527`; `DayFrameApp.test.tsx:198` covers saved authored edit broadly |
| Add cycle | Setup / `setDraft` | Draft cycle collection | Appends default cycle and exposes editor | None; draft only | Partially aligned lightweight creation | `SetupScreen.tsx:688-737`; test `DayFrameApp.test.tsx:198` |
| Edit cycle type/name/dates | Setup / `setDraft` | One draft cycle | Replaces attributes; switching mode normalizes mode-specific information | None; draft only | Confirmed management | `SetupScreen.tsx:792-956`; tests `DayFrameApp.test.tsx:289`, `:873` |
| Request/cancel/confirm cycle deletion | Setup / local state + `setDraft` | Confirmation then cycle collection | Confirmation is reversible; confirm removes cycle and recalculates relevant range data | Draft transformation | Confirmed destructive management | `SetupScreen.tsx:749-791`; inspection/tests of saved cycle state |
| Add cycle segment | Setup / `setDraft` | Cycle segment collection | Appends default segment | None; draft only | Confirmed management | `SetupScreen.tsx:958-994`; inspection |
| Edit segment shift/dates/notes/overrides | Setup / `setDraft` | Segment and optional time preferences | Replaces selected segment attributes and override state | None; draft only | Confirmed rich management | `SetupScreen.tsx:1053-1332`; `DayFrameApp.test.tsx:198` |
| Request/cancel/confirm segment deletion | Setup / local state + `setDraft` | Confirmation then segment collection | Confirm removes segment; cancellation preserves it | Draft transformation | Confirmed protective management | `SetupScreen.tsx:995-1049`; inspection |
| Add/remove/edit sequence day | Setup / `setDraft` | Repeating sequence entries | Appends, removes, or changes day-offset shift association | None; draft only | Confirmed rich management | `SetupScreen.tsx:1340-1474`; test `DayFrameApp.test.tsx:289` |
| Add template/recurrence pair | Setup / `setDraft` | Draft template entry | Appends a default paired template and recurrence | None; draft only | Partially aligned lightweight creation | `SetupScreen.tsx:1483-1521`; `DayFrameApp.test.tsx:198` |
| Toggle template inclusion | Setup / `setDraft` | Template `enabled` | Immediately changes draft inclusion; visible “Not included in preview” state when disabled | None until save | Confirmed immediate feedback | `SetupScreen.tsx:1529-1575`; tests `DayFrameApp.test.tsx:2010`, `:2092` |
| Edit template planning attributes | Setup / `setDraft` | Title, category, placement, duration, buffers, priority, windows, fixed time, reschedule behavior, work dependency | Replaces draft attributes; conditional fields appear according to values | None; draft only | Confirmed rich/progressive management | `SetupScreen.tsx:1613-2128`; tests `DayFrameApp.test.tsx:1115`, `:1134`, `:1691` |
| Edit recurrence | Setup / `setDraft` | Paired recurrence | Replaces frequency, weekdays, or weekly count; conditional recurrence fields appear | None; draft only | Confirmed rich/progressive management | `SetupScreen.tsx:2130-2253`; `DayFrameApp.test.tsx:198` |
| Toggle resource requirement | Setup / `setDraft` | Template `requiresResource` flag | Replaces the draft Boolean; no interaction for authoring the `externalResources` collection is rendered | None; draft only | Partial supporting-data interaction | `SetupScreen.tsx:2103-2129`; implementation inspection |
| Request/cancel/confirm template deletion | Setup / local state + `setDraft` | Confirmation then paired template/recurrence | Confirm removes both from draft; cancellation preserves both | Draft relationship transformation | Confirmed protective management | `SetupScreen.tsx:1562-1610`; inspection |
| Expand/collapse one Setup section | Setup / local component state | Information visibility only | Hides/reveals fields; domain/draft information retained | None | Confirmed progressive interaction | `SetupScreen.tsx:2267-2305`; test `DayFrameApp.test.tsx:785` |
| Expand/collapse all Setup sections | Setup / local component state | Information visibility only | Changes five disclosure values; draft retained | None | Confirmed progressive interaction | `SetupScreen.tsx:166-196`; test `DayFrameApp.test.tsx:785` |
| Save Setup | Setup / `DayFrameApp` → store setters | All authored collections plus Preview validity | Persists draft as authority, marks existing Preview stale, clears focus, shows “Setup saved” | Draft → authored; authored → stale generated validity | Compound authored transformation | `DayFrameApp.tsx:186-220`; tests `DayFrameApp.test.tsx:158-396`, `:1451` |
| Open Setup | Shell / `DayFrameApp` | Context/message state only | Changes screen, clears focused target/messages; domain information unchanged | Environment only | Interaction with no information transformation | `DayFrameApp.tsx:164-168`; tests `:107`, `:591` |
| Generate Preview | Shell / `DayFrameApp` → store | Draft, authored state, guardrail state, Preview | Saves full draft, changes screen, validates, creates/replaces Preview or exposes missing items | Draft → authored → generated across Teach/Plan | Architectural Divergence / compound boundary | `DayFrameApp.tsx:222-268`; tests `:522`, `:1184`, `:1200` |
| Regenerate Preview | Preview / `DayFrameApp` → store | Current Preview | Recomputes from saved authored state and replaces Preview; stale clears on success | Authored → generated within Plan | Confirmed Plan transformation | `DayFrameApp.tsx:253-255`, `:1073-1080`; tests `:1477`, `:1691` |
| Open existing full Preview | Shell / `DayFrameApp` | Selection/context only | Clears selected filter and renders existing Preview unchanged | Representation boundary only | Read-only contextual interaction | `DayFrameApp.tsx:176-184`, `:723-729`; test `:631` |
| Select compact day/range | Shell / `DayFrameApp` | Selection and event-editor draft | Replaces visible-range selection, opens Preview and Calendar Day, copies existing event or creates local default draft; Preview unchanged | Preview → contextual projection/editor | Contextual interaction | `DayFrameApp.tsx:279-336`; tests `:548`, `:591`, `:614` |
| Change manual-event draft field | Calendar Day / `DayFrameApp` local state | Temporary event draft | Replaces title/date/all-day/time/notes; authoritative event/Preview unchanged | None; temporary draft | Confirmed editing | `DayFrameApp.tsx:849-937`; test `:899` |
| Select existing event for edit | Calendar Day / local state | Editing identity and draft | Copies authoritative event into temporary draft | Authored → editor projection | Confirmed contextual editing | `DayFrameApp.tsx:987-1004`; test `:899` |
| Reset editor for another event | Calendar Day / local state | Editing identity and draft | Clears identity and creates defaults for active date | None; temporary draft | Confirmed local creation | `DayFrameApp.tsx:943-959`; inspection |
| Close Calendar Day | Calendar Day / local state | Context/editor/confirmation state | Discards unsaved manual-event draft and closes panel; authored/Preview unchanged | Temporary context discarded | Confirmed cancel/close outcome | `DayFrameApp.tsx:960-970`; inspection |
| Save manual event | Calendar Day / `DayFrameApp` → store | Manual events and Preview | Creates/replaces persistent event; retains normalized editor copy; automatically regenerates Preview when present | Temporary draft → authored → generated | Boundary Ambiguity / compound transformation | `DayFrameApp.tsx:338-377`; test `DayFrameApp.test.tsx:899` |
| Request/cancel event deletion | Calendar Day / local state | Confirmation information | Sets/clears pending event ID; object unchanged | None | Confirmed protective interaction | `DayFrameApp.tsx:1005-1035`; test covers request/confirm at `:899` |
| Confirm event deletion | Calendar Day / `DayFrameApp` → store | Manual events and Preview | Removes persistent event, resets editor, automatically regenerates Preview | Authored → generated | Boundary Ambiguity / destructive compound transformation | `DayFrameApp.tsx:379-389`, `:1005-1015`; test `:899` |
| Apply proposal-only suggested fix | Preview / `PreviewScreen` → `DayFrameApp` → store | Preview scheduled/unplaced/friction data, revision metadata | Revises current Preview only; shows feedback/revised state; authored Setup unchanged | Generated → revised generated | Confirmed advisory Plan interaction | `PreviewScreen.tsx:171-185`, `:350-364`; `dayFrameStore.ts:266-300`; tests `PreviewScreenContainer.test.tsx:49`, `:76` |
| Select fixed-time recommendation | Preview / `DayFrameApp` | Focus context only | Opens Setup, retains template ID, focuses/scrolls matching field; no authored mutation | Plan recommendation → Teach editor | Confirmed contextual boundary | `DayFrameApp.tsx:409-424`; `SetupScreen.tsx:135-151`; tests `DayFrameApp.test.tsx:1611`, `:1797` |
| Expand/collapse repeated friction | Preview / native `<details>` | Information visibility only | Reveals dated occurrences and their fix controls; Preview unchanged | None | Confirmed progressive interaction | `PreviewScreen.tsx:154-200`; test `PreviewScreen.test.tsx:474` |
| Enter profile name | Shell utility / local state | Temporary profile-name input | Replaces local string; clears profile messages | None; temporary utility input | Confirmed utility interaction | `DayFrameApp.tsx:448-460`; test context `DayFrameApp.test.tsx:409` |
| Save current Setup as profile | Shell utility / `DayFrameApp` → store | Saved-profile collection | Validates name; creates/replaces named authored snapshot; shows success/error | Authored → persistent utility snapshot | Shared utility transformation | `DayFrameApp.tsx:462-482`; `dayFrameStore.ts:145-172`; test `:409` |
| Load profile | Shell utility / `DayFrameApp` → store | Active authored state, Preview, context | Replaces active authored state, clears Preview/selection, opens Setup, reports load | Utility snapshot → authored replacement | Compound utility/Teach boundary | `DayFrameApp.tsx:495-513`; `dayFrameStore.ts:174-192`; tests `:409`, `:814` |
| Delete profile | Shell utility / store | Saved-profile collection | Removes snapshot and reports deletion; no confirmation | Utility only | Shared utility transformation | `DayFrameApp.tsx:514-525`; `dayFrameStore.ts:194-203`; test `:409` |
| Export backup | Shell utility / store + browser API | Temporary backup/download | Clones authored setup, downloads JSON, reports success; Preview unchanged/excluded | Authored → external utility representation | Shared utility transformation | `DayFrameApp.tsx:531-548`; `dayFrameStore.ts:213-215`; test `:2297` |
| Start backup import | Shell utility / file-input ref | File-selection context | Programmatically activates hidden native file input; no domain change | App → platform chooser | Shared utility interaction | `DayFrameApp.tsx:549-578`; tests `:2417`, `:2484` |
| Import valid backup | Shell utility / handler → store | Active authored state, Preview, context | Validates and replaces authored state; preserves profiles; clears Preview/selection; opens Setup; reports success | External utility data → authored replacement | Compound utility/Teach boundary | `DayFrameApp.tsx:578-592`, `:1591-1642`; `dayFrameStore.ts:217-230`; test `:2417` |
| Import invalid backup | Shell utility / handler | Error message and file input | Discards invalid input, retains domain state, shows error | External input rejected | Confirmed validation feedback | `DayFrameApp.tsx:1591-1642`; test `:2484` |
| Request/cancel local-data clear | Shell utility / local state | Confirmation and messages | Opens/cancels inline confirmation; domain state retained until confirm | None | Confirmed protective interaction | `DayFrameApp.tsx:558-635`; test `:2260` |
| Confirm local-data clear | Shell utility / `DayFrameApp` → store | Authored state, profiles, Preview, selection, utility context | Replaces state with initial empty state, removes persistence, opens Setup, reports completion | Destructive cross-authority reset | Compound utility transformation | `DayFrameApp.tsx:599-624`; `dayFrameStore.ts:205-211`; test `:2280` |

## Transformation Matrix

| Information authority | Created by | Modified by | Replaced by | Discarded by | Read-only interactions |
|---|---|---|---|---|---|
| Setup draft | App initialization/store subscription; add operations create contained draft objects | Every Setup field/toggle; section-independent editing | Store-authored changes rebuild it after Save/load/import/clear | App unmount; individual draft deletion; unsaved manual close does not affect it | Section disclosure |
| Persistent authored Setup | Initial state; Save; import/profile load | Save Setup; manual-event save/delete | Profile load, backup import, clear/reset | Clear local data | Setup/Preview rendering |
| Current Preview | Generate/regenerate/manual-event auto-generation | Suggested fix revision; stale marking | Generate, regenerate, manual-event save/delete | Profile load, import, clear; app reload because not persisted | Full/compact/day review, filtering, disclosures |
| Manual-event draft | Compact day selection/Add Another/Edit | Manual-event field changes; post-save normalization | Selecting another date/event; delete reset | Close; app unmount | Day heading/count review |
| Selected day/range | Compact day activation | Second day selection | Later day selection | Open Full; profile/import/clear; out-of-bounds generation | Preview filtering |
| Focus target | Fixed-time recommendation | None | Later fixed recommendation | generic screen changes, Save, compact-day selection | Focus/scroll consumes representation |
| Saved profiles | Profile Save | Save with same name replaces snapshot | Clear all profiles | Delete profile / Clear Local Data | Profile list |
| Backup input/output | Export or file selection | None | Next export/import | Browser/file-handler lifetime | Utility copy/explanation |
| Confirmation state | Delete/Clear request | None | Another request | Cancel/confirm/unmount/reset | Confirmation message review |
| Warning/feedback state | Validation, derivation, revision, utility outcome | Recomputed or replaced by subsequent operation | New operation message | navigation/reset handlers | Warning review |

## Interaction Ownership Matrix

| Interaction family | Visible initiating owner | Transformation authority | Confirmation/cancellation owner | Completion feedback owner | Ownership assessment |
|---|---|---|---|---|---|
| Setup field editing | Setup | Parent `setupDraft` via `setDraft` | Not applicable | Setup dirty status | Coherent draft ownership |
| Setup collection creation/deletion | Setup section | Parent draft | SetupScreen local inline state | Updated card/empty state; dirty status | Coherent within Setup |
| Save Setup | Setup action bar | `DayFrameApp` coordinating store setters | No cancel/confirmation | Setup save/status; Preview later stale warning | Teach-like owner, but includes Plan range |
| Generate | Persistent shell primary control | `DayFrameApp` + store generator | Guardrail after attempted save/screen change | Preview/guardrail state | Crosses Teach/Plan in one interaction |
| Preview revision | Preview friction area | Store `applySuggestedFixToPreview` | User selects optional action; no separate confirmation | Preview action feedback/revised metadata | Coherent Plan ownership |
| Fixed-time authored change | Recommendation starts in Preview; edit occurs in Setup | Setup draft, later Save | User may leave without Save through existing Preview path | Focused field then dirty/save/stale states | Explicit contextual handoff |
| Manual-event CRUD | Shell Calendar Day panel | Store authored state plus generator | Inline event delete confirmation; Close discards local draft | Calendar Day/Preview regeneration | Mixed Plan-context and authored authority |
| Profile CRUD | Persistent utility region | Store profile authority | Profile delete has no confirmation | Shared utility message slot | Coherent utility ownership |
| Backup import/export | Persistent utility region | Store/validation/browser | Native chooser; invalid data rejected | Shared utility message slot | Coherent utility ownership |
| Clear local data | Persistent utility region | Store active and profile persistence | Inline utility confirmation | Shared utility success message + Setup | Coherent destructive utility ownership |
| Disclosure/selection | Owning screen/panel | Local/native UI state | Same owner | Immediate visible expansion/filtering | Coherent contextual authority |

## Interaction Boundary Assessment

### Draft → authored boundary

Setup field operations transform only `setupDraft`. `saveCurrentSetup` performs the authority transfer by replacing all authored collections through store setters (`code/src/ui/DayFrameApp.tsx:186-220`). The dirty/saved message distinguishes unsaved from authoritative information (`code/src/ui/SetupScreen.tsx:133`, `:198-204`).

This boundary is generally coherent. It is crossed implicitly by Generate Preview because generation calls `saveCurrentSetup(false)` before validation/generation (`code/src/ui/DayFrameApp.tsx:257-268`).

### Authored → generated boundary

The store generator reads cloned authored inputs and writes a separate Preview result (`code/src/state/dayFrameStore.ts:232-264`). Authoring later marks Preview stale. Regeneration explicitly replaces Preview from saved state.

Manual-event Save/Delete crosses both boundaries in one operation: it directly changes authored events, then regenerates Preview when one exists (`code/src/ui/DayFrameApp.tsx:338-397`).

### Generated → revised-generated boundary

Suggested fixes receive friction and fix identities and call deterministic preview revision. The store replaces only Preview result/metadata (`code/src/state/dayFrameStore.ts:266-300`). Enduring authored information remains unchanged. This is the clearest implemented Plan interaction boundary.

`changeFixedTime` is explicitly excluded from silent proposal revision: it hands responsibility to the matching Setup field (`code/src/ui/DayFrameApp.tsx:415-424`).

### Utility → authored boundary

Profile load and backup import validate/clone snapshot data, replace the active authored aggregate, preserve profiles where applicable, and clear Preview (`code/src/state/dayFrameStore.ts:174-230`). Their completion environment is Setup. Clear Local Data replaces both authored and utility authorities.

### Representation-only interactions

Open Full Preview, compact filtering, section disclosure, repeated-friction disclosure, and Calendar Day review transform context or visibility without changing authored/generated information. They remain read-only with respect to domain authority.

## Interaction Outcome Assessment

| Interaction significance | Implemented observable outcome | Assessment |
|---|---|---|
| Draft field edit | Updated controlled field/card plus “Unsaved changes” | Confirmed immediate feedback |
| Setup save | “Setup saved”; dirty state clears; existing Preview becomes stale | Confirmed |
| Add draft object | New editor/card immediately appears | Confirmed |
| Destructive draft/event/data request | Inline confirmation before mutation | Confirmed for shift/cycle/segment/template/event/clear |
| Profile deletion | Profile disappears and deletion message appears; no confirmation | Immediate feedback present |
| Generation success | Preview, summary, days, generated time | Confirmed |
| Generation failure | Itemized missing Setup information | Confirmed |
| Suggested fix | Revised time/action feedback and changed Preview/friction | Confirmed |
| Fixed-time review | Correct field receives focus and scroll | Confirmed |
| Manual-event save/delete | Event representation and regenerated friction/proposal update | Confirmed |
| Profile save/load | Success message and updated profile/Setup state | Confirmed |
| Export/import | Download/success or error message | Confirmed |
| Clear data | Confirmation then success message/empty Setup state | Confirmed |
| Section/details disclosure | Content immediately shows/hides | Confirmed |

Feedback is implemented for all principal committed transformations. Some local draft operations rely on the changed control/card and shared dirty state rather than a per-operation message, which is proportional to their draft-only significance.

## Approved Interaction-Pattern Alignment

| Normative pattern | Current implementation | Classification | Evidence |
|---|---|---|---|
| Reinforce Teach/Plan/Live/Learn distinctions | Setup and Preview support Teach-like/Plan-like work; Generate/manual events blur them; Live/Learn absent | Partially Implemented / Architectural Divergence | `DayFrameApp.tsx:186-397`; two-screen state at `:38` |
| Direct manipulation of meaningful planning concepts | Users directly edit shifts/cycles/templates/recurrences/settings; manual events direct; no Goals/Reflections | Partially Implemented | `SetupScreen.tsx:207-2253`; `DayFrameApp.tsx:788-1043` |
| Avoid abstract settings/intermediary configuration | Schedule Preferences, Preview Range, cycle modes/segments, placement types, and recurrence configuration are prominent | Architectural Divergence | `SetupScreen.tsx:207-415`, `:688-2253` |
| Progressive interaction | Collapsible sections, conditional cycle/template/recurrence fields, repeated-friction details | Confirmed | `SetupScreen.tsx:127-131`, `:166-196`, `:2267-2305`; `PreviewScreen.tsx:154-200` |
| Capture before configuration | Add operations create defaults before detailed editing; manual day opens default event draft; no shared intent-first capture | Partially Implemented | Setup add handlers; `DayFrameApp.tsx:327-335` |
| Lightweight creation, rich management | Add creates editable draft records; detailed editors expose extensive attributes | Confirmed behavior, configuration framing remains | `SetupScreen.tsx:417-2253` |
| Explain before acting | Friction title/message is shown before fixes; missing/no-fix guidance exists; expected outcome not consistently explicit in UI | Partially Implemented | `PreviewScreen.tsx:154-200`, `:334-375` |
| Immediate feedback | Dirty/saved/stale/feedback/guardrail/utility states and visible transformations | Confirmed | `SetupScreen.tsx:133-205`; `PreviewScreen.tsx:93-114`; `DayFrameApp.tsx:599-651` |
| Preserve flow | Inline confirmation, in-place fixes, contextual focus, retained draft/selection | Confirmed in several paths; compound screen transitions interrupt others | `DayFrameApp.tsx:270-431`, `:788-1043`; tests `:136`, `:591`, `:1611` |
| Continuous, reversible editing | Draft fields freely revisable; deletes cancelable; existing Setup can be revisited; proposal fixes lack undo; no discard-all Setup action | Partially Implemented | Setup controlled inputs; deletion confirmations; `dayFrameStore.ts:266-300` |
| Notes capture execution context | Notes exist only in manual-event planning editor; selected date inherited, but title/time metadata requested; no execution context/Commitment/session | Architectural Divergence / Not Implemented as specified | `DayFrameApp.tsx:308-377`, `:849-937` |
| Recommendations advisory and optional | Fixes require user activation; no automatic selection; fixed-time change requires user edit | Confirmed | `PreviewScreen.tsx:171-191`, `:345-370`; `DayFrameApp.tsx:399-431` |
| Recommendations deterministic/explainable | Deterministic revision path is tested; friction message precedes action; reasoning/expected outcome varies by generated labels/messages | Partially Implemented | `PreviewScreenContainer.test.tsx:49`, `:76`; `PreviewScreen.tsx:166-191` |
| Equivalent interactions consistent across Surfaces | Inline deletion confirmations recur; controlled editing recurs; only Setup/Preview exist and object types use different CRUD patterns | Partially Implemented | Setup and Calendar Day deletion code |
| Platform adaptation without meaning change | Native controls and responsive reflow preserve handlers; no alternate modality implementation | Partially Implemented | `dayFrameUi.css:982-1027`; native JSX controls |

## Direct Manipulation and Configuration Boundary

Users manipulate visible records directly through controlled inputs and named cards. No raw IDs, allocation records, optimization state, or engine coordination controls are exposed.

However, the principal authored interaction vocabulary is:

- Day Boundary Start Time;
- Week Starts On;
- Preview Range Source and Preset;
- Shift Definition;
- Cycle Type, Segment, and Sequence Anchor;
- Placement Type;
- Buffer;
- Priority;
- Preferred Window;
- Reschedule Behavior;
- Recurrence Frequency.

Evidence: `code/src/ui/SetupScreen.tsx:207-415`, `:417-1481`, `:1483-2253`.

These interactions directly manipulate implementation-shaped configuration records. Templates and manual events represent recognizable activities, but the UI does not expose direct Commitment, Goal, Reflection, or accepted-Plan interactions.

## Capture and Rich-Management Assessment

Creation interactions append default objects immediately rather than opening prerequisite dialogs:

- Add Shift creates a default shift draft;
- Add Cycle creates a default cycle;
- Add Segment/Sequence Day extends the current cycle;
- Add Template creates a paired template/recurrence;
- selecting a date creates a default manual-event draft.

This separates creation from later rich editing at the draft level. The new object is not authoritative until Save Setup, except manual events, which become authoritative through their own Save Event.

There is no shared capture interaction. Each information type has a separate creation control in its owning editor, and event capture includes date/time/title configuration before save. The implementation therefore partially realizes capture-before-configuration but does not provide the normative universal intent-first capture model.

## Recommendation Interaction Assessment

Friction information contains a title, explanatory message, severity, and zero or more suggested fixes (`code/src/core/friction/types.ts:29-45`). Preview renders the title and message before fix buttons (`code/src/ui/PreviewScreen.tsx:345-370`). Users retain authority because:

- no fix is applied on generation;
- each fix requires a selected friction ID and fix ID;
- no-fix cases remain advisory;
- fixed-time change routes to editable authored information;
- proposal-only fixes change only Preview.

The expected outcome is sometimes conveyed by the fix label and later action feedback. The UI does not render the underlying parameters or a standardized before/after outcome for every recommendation. Explanation is therefore confirmed at the observed-situation/message level and partial at reasoning/outcome level.

## Confirmation, Cancellation, and Reversibility

### Confirmed

- Shift, cycle, segment, template, manual-event, and clear-data deletion use inline request/confirm/cancel states.
- Cancel clears confirmation without transforming the target.
- Calendar Day Close discards its temporary draft without changing authoritative manual events.
- Invalid import is rejected without replacing authored information.
- Setup draft fields remain editable before and after save.
- Fixed-time review does not mutate the value automatically.

### Partial or absent

- Profile deletion is immediate and has no confirmation.
- Proposal-only suggested fixes have no implemented undo or cancel after application.
- Save Setup has no whole-draft undo.
- Generate Preview automatically saves the draft; no separate cancellation occurs between save and generation.
- Profile load/import replace active authored state without a confirmation step, though their labels/copy identify replacement.

The normative model requires reversibility “where appropriate”; implementation establishes the differences above but does not establish which operations the architecture deems to require reversal.

## Interaction Consistency Assessment

Equivalent interaction patterns that are consistent:

- controlled inputs immediately update a draft;
- collection deletion commonly uses inline confirmation;
- major persisted operations show inline status;
- proposal fixes use the same friction/fix identity handler whether selected from a day or repeated-friction occurrence;
- section and repeated-friction detail disclosure retain surrounding content.

Differences across object types:

- Setup objects use shared Setup save; manual events and profiles have object-specific save interactions.
- Setup object deletion confirms; profile deletion does not.
- authored templates are edited in Setup; authored manual events are edited in the shell’s Plan context.
- Add operations create draft objects, while profile Save immediately creates persistent snapshot data.
- only the fixed-time recommendation has a precise authored-field handoff; other no-fix/unplaced states provide text or no interaction.

These are structural consistency findings. Whether users experience them as consistent requires observational evidence.

## Structural Findings

1. Draft, authored, and generated information have distinct executable transformation authorities.
2. Setup field interactions transform only draft state until Save or Generate.
3. Save Setup transfers the entire draft aggregate to authored authority.
4. Generate Preview crosses draft, authored, environment, validation, and generated boundaries in one operation.
5. Suggested fixes generally transform only generated proposal state.
6. Fixed-time review transfers interaction authority from Plan to the exact Teach-like editor without mutation.
7. Manual-event CRUD is initiated in Plan context but transforms authored and generated state.
8. Preview Range is Plan-scope information transformed through Setup.
9. Utility operations are centralized in a persistent shell region and use store authority.
10. Inline confirmations protect most destructive authored/data operations, but not profile deletion.
11. Information disclosure is progressive and state-local.
12. Creation usually produces a default draft before rich management.
13. The interaction vocabulary is dominated by structured settings/domain records.
14. Live and Learn have no interaction authorities or transformations.
15. Notes do not implement the specified execution-context capture interaction.

## Experiential Findings

These are observable consequences of interaction structure:

1. A Setup field change is visible immediately but does not affect authoritative state until Save or Generate.
2. Activating Generate Preview commits all unsaved Setup edits before the proposal result or validation outcome appears.
3. Saving Setup after a prior generation leaves the old proposal visible but marks it stale.
4. Selecting most suggested fixes keeps the user in Preview and changes only the proposal.
5. Selecting Review fixed time changes environment but retains and focuses the relevant authored object.
6. Manual-event Save changes the persistent event and refreshes the proposal without a separate Regenerate interaction.
7. Closing Calendar Day discards its current unsaved draft while retaining authoritative events and Preview.
8. Cancelling a deletion leaves the target unchanged; confirming updates the draft or authority according to object type.
9. Invalid backup data produces an error without replacing current authored information.
10. Loading a profile or valid backup replaces the active authored aggregate and removes the current Preview.
11. Expanding advanced Setup fields does not transform the underlying draft.
12. Applying a proposal fix has no implemented undo interaction.

Whether these outcomes are anticipated or understood requires observational research.

## Behavioral Invariants

1. Setup controlled-field changes transform `setupDraft`, not store authority.
2. Save Setup writes all authored Setup collections through store setters.
3. Every authored store setter marks an existing Preview stale.
4. Generate Preview first saves the current draft.
5. Regenerate Preview reads saved authored state and does not save Setup draft.
6. Proposal-only fixes revise Preview without modifying authored Setup.
7. Fixed-time recommendations do not automatically change authored values.
8. Manual-event save/delete persists authored events and regenerates an existing Preview.
9. Opening/closing/filtering/disclosure interactions do not mutate domain authority.
10. Destructive Setup/event/clear interactions separate request from confirmation.
11. Profile load/import replace authored state and clear Preview.
12. Invalid import preserves current domain state.
13. Major committed operations produce rendered success, warning, error, or updated-result feedback.
14. Repeated-friction and per-day fixes invoke the same application authority.
15. No interaction creates execution history or reflective information.

## Architectural Gaps

Approved interaction responsibilities without executable implementation include:

- direct Goal creation/editing;
- direct Commitment interaction distinct from templates/manual events;
- direct Routine interaction under that planning concept;
- universal intent-first capture;
- plan acceptance;
- beginning execution;
- completing, skipping, delaying, or adjusting a commitment during execution;
- fast execution-context Notes tied automatically to time, Commitment, and planning session;
- recording actual start/finish, interruption, or deviation;
- Reflection creation/editing;
- historical review interactions;
- confirmation or rejection of learned conclusions;
- transformations from Learn into Teach or Plan;
- consistent cross-Surface selection/edit/completion behavior across all four Surfaces;
- standardized recommendation reasoning and expected-outcome presentation;
- implemented reversal of applied proposal fixes.

These are implementation absences, not recommendations.

## Coverage Assessment

### Automated-test-supported findings

The relevant UI tests cover:

- Setup draft editing and persistence;
- shift/cycle/template/recurrence transformations;
- Save Setup and dirty/saved state;
- generation success and guardrails;
- Preview regeneration and stale-state clearing;
- proposal fix application;
- fixed-time contextual handoff and focus;
- manual-event create/edit/delete and automatic proposal effects;
- disclosure and retained draft behavior;
- profile save/load/delete;
- backup export/import/invalid rejection;
- clear-data confirmation and completion;
- contextual selection and read-only Preview projections.

State/core tests additionally cover:

- store-setter authority and stale marking;
- profile/backup validation and cloning;
- deterministic generation;
- candidate placement;
- friction detection;
- suggested-fix revision.

### Executable-inspection-supported findings

Inspection establishes:

- every handler and state authority in the inventory;
- transformations not individually named in tests;
- confirmation/cancellation differences;
- draft versus authored versus generated boundaries;
- absence of undo, Live, Learn, Goals, Reflections, and execution Notes;
- direct/configuration interaction vocabulary;
- interaction consistency across rendered owners.

### Observational-research questions

Implementation cannot establish:

- whether users perceive an operation as direct manipulation or configuration;
- whether compound Generate behavior is anticipated;
- whether feedback is sufficient or proportional;
- whether creation feels lightweight;
- whether recommendation explanations are understood;
- whether interaction differences across object types feel consistent;
- whether preserved context supports uninterrupted planning.

### Coverage limitations

- No dedicated `SetupScreen.test.tsx` exists; Setup interactions are exercised through `DayFrameApp.test.tsx`.
- Individual add/delete/cancel operations for every Setup collection are not each covered by named tests.
- Add Another Event and Calendar Day Close lack direct named tests.
- Profile deletion confirmation is absent by implementation; no test compares its behavior with other deletion patterns.
- No test covers reversal because no proposal-fix undo interaction exists.
- No test covers Live or Learn interactions because no user-facing implementation was found.

## Open Questions

1. Some Setup add/remove interactions are implementation-confirmed but not individually asserted; their complete cross-reference effects require additional executable test evidence to classify beyond inspected behavior.
2. Manual-event Date can diverge from the active Calendar Day before Save. The resulting authority/context relationship is not tested.
3. Profile load, import, and clear do not explicitly reset every open Calendar Day editor state; combined transformation outcomes are untested.
4. Suggested-fix labels and feedback vary by generated action. Implementation does not provide one standardized field for reasoning and expected outcome, so completeness is action-dependent.
5. Templates expose a `Requires Resource` interaction, but no interaction for authoring the underlying `externalResources` collection is rendered.
6. The implementation distinguishes draft creation from Save, but it does not expose a separate formal “created” state; creation semantics are inferred from controlled draft behavior.
7. Core scheduled-block statuses include execution-like values, but no interaction authority reads or transforms them in the UI.
