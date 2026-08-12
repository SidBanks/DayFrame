# UX Implementation Alignment Audit 01

## Phase 4 — Navigation Architecture

**Normative source:** `docs/architecture/DayFrame_Interaction_Architecture_Specification.md`, Navigation Architecture  
**Specification location:** Chapter VIII in the current normative file; the audit brief identifies it as Chapter VII  
**Implementation scope:** `code/src/**`  
**Method:** Executable implementation and automated tests only  
**Audit date:** 2026-07-30

## Executive Findings

The current implementation uses component state rather than routes to provide navigation. `currentScreen` has two possible destinations—`"setup"` and `"preview"`—and initializes to Setup (`code/src/ui/DayFrameApp.tsx:38`, `:74`). A persistent shell surrounds both screens and contains the primary controls, data-administration utilities, compact preview navigation, and a selected-day editor (`code/src/ui/DayFrameApp.tsx:434-1047`).

The two persistent primary controls are not symmetric:

- **Setup** is pure global navigation. It changes `currentScreen`, clears a focused Setup target, and resets shell messages; it does not save or generate domain state (`code/src/ui/DayFrameApp.tsx:164-168`, `:676-692`).
- **Generate Preview** is a compound navigation and workflow action. It saves the full Setup draft, switches to Preview, validates prerequisites, and creates or replaces preview state (`code/src/ui/DayFrameApp.tsx:186-250`, `:257-268`, `:693-708`).

An existing Preview can be revisited unchanged through **Open Full Preview**, but only when a preview already exists and the conditional Latest Preview region is visible. That path also clears the selected day/range (`code/src/ui/DayFrameApp.tsx:176-184`, `:711-729`). Thus, entering Preview can mean creation/replacement, reuse with selection reset, or reuse with filtering and Calendar Day activation, depending on the control used.

Context preservation is strongest in three paths:

- unsaved Setup draft survives screen changes because the parent owns it;
- selected compact-preview day/range survives ordinary Setup/Preview changes;
- a fixed-time recommendation retains the template identity and focuses the exact Setup field.

Automated tests confirm these behaviors (`code/src/ui/tests/DayFrameApp.test.tsx:136`, `:591`, `:1611`, `:1797`).

The implemented lifecycle ends in Plan-like Preview. There is no Live or Learn destination, no Plan → Live navigation, no Live → Learn navigation, and no Summary Navigation Area. The normative Planner/Summary hierarchy is not represented as application destinations; instead, the persistent navigation exposes technical workflow labels—Setup and Generate Preview—alongside data utilities.

The dominant Navigation Architecture alignment problem is **compound and fragmented destination access**: Preview is both a destination and generated domain state, but the primary way to enter it creates or replaces that state, while reuse, filtering, contextual editing, and authored changes are distributed across conditional shell controls and Setup.

## Navigation-Control Inventory

| Control / interaction | Location and visibility | Source | Destination/result | State mutations and context | Navigation type | Classification | Evidence / tests |
|---|---|---|---|---|---|---|---|
| **Setup** | Persistent primary nav | Any screen | Setup screen | `currentScreen="setup"`; clears `focusedTemplateField` and shell messages; draft, preview, selected range, and Calendar Day state remain | Global navigation | Partially Implemented | `DayFrameApp.tsx:164-168`, `:676-692`; tests `DayFrameApp.test.tsx:70`, `:107`, `:591`, `:747` |
| **Generate Preview** | Persistent primary nav | Any screen | Preview screen with generated or guardrail state | Saves all Setup draft groups; changes screen; validates; creates/replaces preview; clears focus and utility messages; retains in-bounds selected range | Compound control | Compound Navigation and Action; Boundary Ambiguity | `DayFrameApp.tsx:186-268`, `:693-708`; tests `:136`, `:522`, `:1184`, `:1200` |
| **Open Full Preview** | Latest Preview; only when preview exists | Shell on Setup or Preview | Existing full Preview | Clears selected day/range; changes screen; no generation/domain change; clears focus/messages | Global/conditional navigation | Contextual Navigation | `DayFrameApp.tsx:176-184`, `:711-729`; tests `:631`, `:1451` |
| Compact day, first selection | Latest Preview; preview exists | Compact day strip | Filtered Preview + Calendar Day panel | Sets one-day range and pending start; changes screen; opens event draft for date; clears focus/messages; proposal unchanged | Local + contextual navigation | Contextual Navigation | `DayFrameApp.tsx:279-306`, `:752-783`; tests `:548`, `:591`, `:747` |
| Compact day, second distinct selection | Same | One-day selection pending | Filtered Preview range + Calendar Day for clicked date | Orders start/end, clears pending start, changes screen, opens clicked-date editor; proposal unchanged | Local + contextual navigation | Local Navigation with contextual panel | `DayFrameApp.tsx:282-305`; tests `:548`, `:614` |
| Compact day, same second selection | Same | Same day pending | Same one-day Preview + Calendar Day | Retains single-day range; keeps pending start; reopens/rebuilds date draft | Local navigation | Local Navigation | `DayFrameApp.tsx:292-296`; inspection only |
| **Regenerate Preview** | Preview top panel | Preview screen | Replaced Preview in same destination | Validates saved state and replaces preview result; no Setup save; retains in-bounds selection; clears stale status through generation | Workflow action | Workflow Action, Not Navigation | `DayFrameApp.tsx:253-255`, `:1073-1080`; tests `:1477`, `:1691` |
| **Save Setup** | Sticky Setup action bar | Setup | Remain in Setup | Persists draft collections and preview range; marks existing preview stale; clears focused target; reports saved | Action | Workflow Action, Not Navigation | `DayFrameApp.tsx:186-220`; `SetupScreen.tsx:166-170`; tests `:158-396`, `:1451` |
| **Expand All** | Setup action bar | Setup | Same Setup, all editors disclosed | Mutates five Setup-local disclosure states only | Local navigation/disclosure | Local Navigation | `SetupScreen.tsx:171-183`; test `:785` |
| **Collapse All** | Setup action bar | Setup | Same Setup, all editors hidden | Mutates five disclosure states only; draft retained | Local navigation/disclosure | Local Navigation | `SetupScreen.tsx:184-196`; test `:785` |
| Section **Expand/Collapse** | Each Setup section | Setup | Same section shown/hidden | Mutates one component-local disclosure state; draft retained | Disclosure | Local Navigation | `SetupScreen.tsx:207-215`, `:2267-2305`; test `:785` |
| Suggested proposal-only fix labels | Friction and repeated-friction areas; fix exists | Current friction occurrence | Revised Preview, same screen | Mutates preview only and `revisedAt`; retains screen/range; may change visible friction | Action | Workflow Action, Not Navigation | `PreviewScreen.tsx:171-185`, `:350-364`; `DayFrameApp.tsx:399-431`; tests `DayFrameApp.test.tsx:1346`, `PreviewScreenContainer.test.tsx:49`, `:76` |
| **Review fixed time** | Friction action when fix action is `changeFixedTime` | Specific friction/fix | Setup, matching fixed-time input | Preserves template ID in `focusedTemplateField`; changes screen; no domain mutation; selected range/preview remain; messages clear | Contextual navigation | Confirmed Contextual Navigation | `DayFrameApp.tsx:409-424`; tests `DayFrameApp.test.tsx:1611`, `:1797` |
| Repeated-friction `<summary>` | Repeated group; group exists | Preview | Expanded/collapsed occurrences | Native `<details>` state; no React/domain/navigation-state mutation | Disclosure | Local Navigation | `PreviewScreen.tsx:154-200`; test `PreviewScreen.test.tsx:474` |
| **Save Event** | Calendar Day panel | Selected date and draft | Same panel/Preview with regenerated proposal | Persists manual event, retains editor identity/draft, automatically regenerates if preview exists | Action with automatic result replacement | Workflow Action, Not Navigation | `DayFrameApp.tsx:338-377`, `:939-942`; test `DayFrameApp.test.tsx:899` |
| **Add Another Event** | Calendar Day panel | Panel open | Blank editor for same active date | Clears editing ID; replaces local draft with defaults; active date/range/preview remain | Local workflow transition | Local Navigation / workflow state | `DayFrameApp.tsx:943-959`; inspection only |
| **Close** | Calendar Day panel | Panel open | Shell remains; panel closes | Clears active date, event draft, editing ID, delete confirmation; selected preview day/range remains | Return/close path | Contextual Navigation | `DayFrameApp.tsx:960-970`; no direct named test |
| **Edit Event** | Existing-event list | Event exists in panel | Same panel populated with selected event | Sets editing ID and copies event into local draft; date/range/preview unchanged | Contextual local transition | Local Navigation | `DayFrameApp.tsx:987-1004`; test `DayFrameApp.test.tsx:899` |
| **Delete Event** | Existing-event list | Event exists | Inline confirmation mode | Sets `confirmingDeleteManualEventId`; no domain change | Confirmation action | Workflow Action, Not Navigation | `DayFrameApp.tsx:1027-1035`; test `:899` |
| **Confirm Delete Event** | Inline delete confirmation | Matching event pending | Same panel reset/rebuilt; proposal regenerated | Deletes domain event, clears confirmation/edit identity, rebuilds draft for active date, regenerates preview | Destructive action | Workflow Action, Not Navigation | `DayFrameApp.tsx:379-389`, `:1005-1015`; test `:899` |
| Delete-event **Cancel** | Inline confirmation | Matching event pending | Existing event/editor context | Clears only confirmation ID | Cancel action | Workflow Action, Not Navigation | `DayFrameApp.tsx:1016-1024`; inspection only |
| Setup entity **Delete** | Shift/cycle/segment/template editors | Corresponding editor open | Inline confirmation | Sets Setup-local confirmation state only | Confirmation action | Workflow Action, Not Navigation | `SetupScreen.tsx:118-126` and respective editor controls; implementation inspection |
| Setup entity confirm/cancel | Corresponding confirmation visible | Setup editor | Same editor with deletion or unchanged draft | Mutates draft on confirm; clears confirmation on cancel | Action | Workflow Action, Not Navigation | `SetupScreen.tsx:417-2253`; implementation inspection |
| **Save Current Setup as Profile** | Persistent profile region | Always | Same utility region, success/error state | Saves authored snapshot; utility messages change; no screen change | Action | Workflow Action, Not Navigation | `DayFrameApp.tsx:438-483`; test `DayFrameApp.test.tsx:409` |
| **Load Profile** | Persistent profile list | Saved profile exists | Setup | Replaces authored state; clears preview and day/range selection; changes screen; resets utility/guardrail state | Replacement workflow | Compound Navigation and Action | `DayFrameApp.tsx:495-513`; `dayFrameStore.ts:174-192`; tests `:409`, `:814` |
| **Delete Profile** | Persistent profile list | Saved profile exists | Same utility region | Removes saved snapshot; active setup/screen unchanged | Destructive action | Workflow Action, Not Navigation | `DayFrameApp.tsx:514-525`; test `:409` |
| **Export Setup Backup** | Persistent utility region | Always | Same utility region + browser download | Serializes/downloads authored state; messages reset/set; no navigation | Action | Workflow Action, Not Navigation | `DayFrameApp.tsx:531-548`; test `:2297` |
| **Import Setup Backup** | Persistent utility region | Always | Native hidden file chooser | Programmatically clicks file input; no app destination change yet | Workflow entry | Workflow Action, Not Navigation | `DayFrameApp.tsx:549-577`; tests `:2417`, `:2484` |
| Select valid backup file | Native file input | After import activation | Setup | Validates and replaces authored state; clears preview/selection; changes screen; reports success | Replacement workflow | Compound Navigation and Action | `DayFrameApp.tsx:578-592`, `:1591-1642`; test `:2417` |
| Select invalid backup file | Native file input | After import activation | Remain current app context | No authored replacement; shows error; input reset by handler | Recovery action | Workflow Action, Not Navigation | `DayFrameApp.tsx:1591-1642`; test `:2484` |
| **Clear Local Data** | Persistent utility region | Always | Inline destructive confirmation | Sets confirmation; resets other messages | Confirmation action | Workflow Action, Not Navigation | `DayFrameApp.tsx:558-573`; test `:2260` |
| Clear-data **Cancel** | Confirmation visible | Any screen | Same screen and utility region | Clears confirmation only | Cancel action | Workflow Action, Not Navigation | `DayFrameApp.tsx:625-633`; test `:2260` |
| **Confirm Clear Local Data** | Confirmation visible | Any screen | Setup | Clears persisted domain/profile data, selection and several UI states; changes screen | Destructive replacement transition | Compound Navigation and Action | `DayFrameApp.tsx:599-624`; `dayFrameStore.ts:205-211`; test `:2280` |
| Generation guardrail | After Generate with missing inputs | Preview | Blocked Preview with explanation | Generate has already saved draft and changed screen; no preview created; missing-item state set | Transient destination state | Partially Implemented recovery | `DayFrameApp.tsx:222-228`, `:1086-1095`; tests `:1184`, `:1200`, `:2190` |
| Stale-preview warning | Preview with `preview.isStale` | Preview | Same Preview | No navigation; explanatory state only | Status | Workflow Action, Not Navigation | `PreviewScreen.tsx:93-95`; tests `DayFrameApp.test.tsx:1451`, `:1477` |
| Range warning | Generated Preview with mismatch | Preview | Same Preview | No navigation; warning only | Status | Workflow Action, Not Navigation | `DayFrameApp.tsx:1096-1105`; tests `previewRangeWarnings.test.ts`, `DayFrameApp.test.tsx:1524` |
| Empty-preview guidance | Preview without result | Preview | Same Preview | No active control in the empty component; primary Generate remains in shell | Transient state | Partially Implemented recovery | `PreviewScreen.tsx:58-70`; test `PreviewScreen.test.tsx:15` |
| Unplaced candidate row | Preview day | Candidate exists | No destination | Read-only text; no link/button | Not navigation | Not Implemented contextual path | `PreviewScreen.tsx:313-332`; tests `PreviewScreen.test.tsx:34` |
| No-automatic-fix guidance | Friction without fix | Preview | No direct destination | Text instructs review Setup/regenerate; user must use global Setup independently | Guidance, not navigation | Partially Implemented | `PreviewScreen.tsx:188-191`, `:365-369`; inspection only |

No visible anchors, tabs, application links, routing controls, or browser-history controls were found. All application controls above are native buttons, form inputs, `<details>`, or a hidden file input.

## Destination Matrix

| Destination or context | Implementation type | Entry paths | Exit paths | Persistent identity | Context owned | Architectural classification | Evidence |
|---|---|---|---|---|---|---|---|
| Setup | Conditional top-level screen | Initial launch; Setup; fixed-time review; profile load; valid import; clear confirmation | Generate Preview; Open Full Preview if available; compact day selection | `currentScreen="setup"`, active nav style, Setup heading | Parent Setup draft; child disclosure/confirmation state | Partial Planner/Teach destination | `DayFrameApp.tsx:74`, `:1048-1063`; `SetupScreen.tsx:153-2254` |
| Preview | Conditional top-level screen | Generate; Open Full Preview; compact day/range selection | Setup; fixed-time review; profile/import/clear replacement | `currentScreen="preview"`, active Generate button, Preview headings | Store preview; parent selected range; child/native details state | Partial Planner/Plan destination | `DayFrameApp.tsx:1064-1115`; `PreviewScreen.tsx:58-380` |
| Latest Preview | Conditional persistent shell region | Appears automatically when preview exists | Removed when preview cleared; controls open/filter Preview | Heading and conditional render, not separate screen state | Derived preview summary and parent selection | Cross-destination Plan context; not global destination | `DayFrameApp.tsx:110-112`, `:711-786` |
| Calendar Day | Conditional persistent shell panel | Compact day click | Close; profile/import/clear do not explicitly clear its local state | Heading/date; no independent screen state | `activeManualEventDate`, draft, edit/confirm IDs | Contextual workspace with boundary ambiguity | `DayFrameApp.tsx:788-1043` |
| Fixed-time editor | Contextual focused location inside Setup | `Review fixed time` | Edit/save; Setup/Generate/open Preview clear focus | Programmatic focus/scroll and matching template ID | `focusedTemplateField` in parent | Confirmed contextual destination | `DayFrameApp.tsx:270-277`; `SetupScreen.tsx:135-151` |
| Profile/data region | Persistent utility region | Always present | No exit; interactions remain or route to Setup | Heading, not screen state | Profile name/messages and saved profiles | Architecturally Unowned utility region | `DayFrameApp.tsx:438-652` |
| Empty Preview | Transient Preview mode | Preview when state has no preview | Generate Preview; Setup | Preview screen plus empty heading | Preview absence | Transient state, not independent destination | `PreviewScreen.tsx:58-70` |
| Generation guardrail | Transient Preview mode | Failed Generate validation | Setup or Generate after correction | Inline missing-items message | `previewGuardrailMissingItems` | Transient blocked state | `DayFrameApp.tsx:222-228`, `:1086-1095` |
| Selected day/range | Local navigation context | Compact day clicks | Open Full Preview, profile/import/clear, out-of-bounds generation | `aria-pressed`, classes, filtered Preview | Parent selected/pending range | Local navigation state | `DayFrameApp.tsx:83-86`, `:181-184`, `:752-783` |
| Setup section | Local workspace/disclosure | Individual or all-section controls | Collapse or screen unmount | `aria-expanded`, visible content | SetupScreen local booleans | Local workspace, not primary destination | `SetupScreen.tsx:127-131`, `:2267-2305` |
| Repeated-friction occurrence set | Native disclosure context | `<summary>` activation | Activate again or Preview unmount/replacement | Browser-managed `<details>` state | DOM/native state | Local contextual detail | `PreviewScreen.tsx:154-200` |
| Confirmation mode | Inline transient mode | Delete/clear activation | Cancel/confirm or owning screen unmount | Conditional buttons/message | Parent or SetupScreen local IDs/booleans | Not a destination | `DayFrameApp.tsx:76`, `:101-103`; `SetupScreen.tsx:118-126` |

## Approved-Navigation Alignment Matrix

| Approved navigation responsibility | Current implementation | Classification | Structural finding | Experiential consequence | Evidence |
|---|---|---|---|---|---|
| Planner Navigation Area containing Teach, Plan, Live | Setup and Preview provide Teach-like and Plan-like screens; no Live | Partially Implemented | No Planner destination or Live path; activities exposed as Setup/Generate | Implemented lifecycle terminates at proposal review | `DayFrameApp.tsx:38`, `:676-709`; broad `code/src/**` inspection |
| Summary Navigation Area containing Learn | No destination or navigation control | Not Implemented | No Summary/Learn route, state, or render branch | Historical reflection cannot be entered through implemented navigation | Broad `code/src/**` inspection |
| Navigation Area → Surface → Workspace hierarchy | Two screen branches, shell panels, Setup disclosures | Architectural Divergence | Hierarchy is screen/action/utility based rather than Planner/Summary and child Surfaces | Different navigation levels coexist in the persistent shell | `DayFrameApp.tsx:434-1115` |
| Surfaces presented as continuous lifecycle | Setup ↔ Preview paths exist; no Live/Learn | Partially Implemented | Teach/Plan continuity is partial; remaining lifecycle absent | User can iterate understanding/proposal but cannot navigate onward to execution/reflection | `DayFrameApp.tsx:164-179`, `:257-277` |
| Workspaces entered through parent Surface and exited to surrounding conversation | Setup disclosures and Preview contextual details stay within screens; Calendar Day is shell-owned | Partially Implemented | Most local workspaces are contextual, but ownership is distributed | Calendar Day can persist beside either screen rather than having one parent destination | `SetupScreen.tsx:2267-2305`; `DayFrameApp.tsx:788-1043` |
| Universal single-tap primary action | Buttons and day selection activate with one click | Partially Implemented | Single activation exists, but behavior is control-specific | One tap can navigate, mutate, or do both depending on label/path | JSX button handlers throughout `code/src/ui/**` |
| Long-press contextual actions | None found | Not Implemented | No long-press handlers or alternate contextual-action model | Contextual capabilities are exposed as visible buttons/disclosures instead | Broad event-handler search across `code/src/**` |
| Double-tap details | None found | Not Implemented | No double-click/tap handlers | Details use single-click day buttons and inline panels | `DayFrameApp.tsx:752-783`; broad event-handler search |
| Universal creation entry for authored planning objects | No shared creation entry | Not Implemented | Shift/cycle/template creation is section-local; manual event creation is day-local | Creation entry depends on object type and current environment | `SetupScreen.tsx:417-2253`; `DayFrameApp.tsx:788-970` |
| Context preservation | Draft, selection, and fixed-field identity are often retained | Partially Implemented / Confirmed for covered paths | Parent state preserves several contexts; disclosure/native detail state remounts | Some tasks resume precisely; other local position/detail must be reconstructed | `DayFrameApp.tsx:67-103`; tests `:136`, `:591`, `:1611` |
| Navigation reflects time: Planner future/present, Summary historical | Preview is future proposal; no historical area | Partially Implemented | Forward planning exists without temporal top-level navigation | Only future proposal destinations are available | `PreviewScreen.tsx:117-380`; absence inspection |
| Ownership boundaries | Fixed-time contextual path targets authored field; Plan scope/manual events cross regions | Boundary Ambiguity | Responsibilities span Setup, Preview, shell | Moving between planning tasks can entail screen change or shell editor activation depending on data type | `SetupScreen.tsx:271-415`; `DayFrameApp.tsx:270-397` |
| Navigation avoids internal architecture language | Visible labels use user-facing Setup/Preview/workflow concepts | Confirmed Alignment | No Engines, Services, algorithms, or domain-object destinations found | Navigation does not expose internal computation names | `DayFrameApp.tsx:654-709`; visible-string inspection |
| Platform-independent stable hierarchy | Same state/render model reflows through CSS | Partially Implemented | No alternate mobile hierarchy; approved Planner/Summary hierarchy is absent at all widths | Destination availability is structurally unchanged by viewport | `dayFrameUi.css:982-1027`; no responsive tests |

## Primary Navigation Assessment

### Persistent controls and active state

The semantic `<nav aria-label="App Sections">` contains two buttons. Both persist across Setup and Preview. `aria-pressed` and `.is-active` track `currentScreen`, so the current screen is represented programmatically and visually (`code/src/ui/DayFrameApp.tsx:676-709`; `dayFrameUi.css:149-189`).

### Setup/Preview asymmetry

**Structural finding:** Setup is a destination label bound to a pure screen transition. Generate Preview is an action label occupying the corresponding destination position, and its handler persists Setup state, validates, generates/replaces preview, and changes screen.

**Experiential consequence:** Activating the apparent Preview-side primary control cannot open an existing proposal unchanged. It runs generation first. The nested detail text explicitly states “Save this draft, generate, and open the preview,” so the state-changing portion is rendered before activation (`DayFrameApp.tsx:693-708`).

**Structural finding:** Existing Preview reuse is a separate, conditional **Open Full Preview** button inside Latest Preview.

**Experiential consequence:** Reuse is available only after preview state exists, and it clears the current selected day/range before opening the full result (`DayFrameApp.tsx:176-184`, `:711-729`; test `DayFrameApp.test.tsx:631`).

### Unfinished work

Parent-owned Setup draft survives ordinary screen changes (`DayFrameApp.tsx:67-72`; test `DayFrameApp.test.tsx:136`). However, Generate Preview saves that draft automatically, so leaving through the primary Preview control converts unfinished draft data into saved domain state. Setup navigation itself does not save.

SetupScreen local disclosure and confirmation states are lost when the conditional screen unmounts because they are initialized within `SetupScreen` (`SetupScreen.tsx:118-131`). The authored draft remains, but local working position is not represented in parent navigation state.

### Utility competition

Profiles, export/import, and Clear Local Data render before the navigation region inside the persistent shell header (`DayFrameApp.tsx:438-654`). They are outside the semantic primary `<nav>`, but they remain at the same shell persistence level and include replacement/destructive transitions. This is a structural hierarchy finding; perceived prominence or competition requires observational study.

## Setup Navigation Assessment

### Entry paths

| Entry | Objective and result | Preserved / cleared |
|---|---|---|
| Initial launch | Begin on Setup | Initializes draft from store; no preview selection/focus |
| **Setup** primary control | Open general Setup | Preserves draft, preview, selected range, Calendar Day state; clears focus and messages |
| **Review fixed time** | Open precise template field | Preserves preview/range; sets and focuses template/field; clears messages |
| **Load Profile** | Replace active authored setup | Rebuilds draft; clears preview and selected range; routes Setup; fixed focus is not explicitly set here |
| Valid backup import | Replace authored setup | Rebuilds draft; clears preview/range; routes Setup |
| Confirm Clear Local Data | Reset application data | Rebuilds draft from cleared state; clears preview/range and several messages; routes Setup |

Evidence: `DayFrameApp.tsx:64-184`, `:270-277`, `:495-509`, `:599-620`, `:1591-1642`; `dayFrameStore.ts:174-230`.

Generation guardrails do not automatically navigate back to Setup. They leave the user on Preview with missing-item text and the persistent Setup control available (`DayFrameApp.tsx:1086-1095`).

### Exit paths

- **Generate Preview** saves, validates, generates, and opens Preview.
- **Open Full Preview** opens an existing proposal unchanged but clears its selected filter; it exists only when Latest Preview is present.
- Compact day selection opens filtered Preview and Calendar Day.
- Profile/import/clear actions can route to Setup, so they are not exits when already there.

There is no explicit cancel/back action for abandoning an unsaved Setup draft. Generic Setup → Preview through Generate saves it. Opening an existing full Preview does not save it, and the draft remains in parent state; returning to Setup restores those unsaved values (`DayFrameApp.test.tsx:136`).

### Local navigation and remount

Expand All, Collapse All, and individual section toggles are local disclosure navigation. Draft changes survive collapse/reopen. Leaving Setup unmounts `SetupScreen`, so its disclosure and inline delete-confirmation state implicitly reset on return, while the parent draft survives.

## Preview Navigation Assessment

### Entry path distinctions

| Entry path | Generation | Setup save | Proposal behavior | Selection / Calendar Day |
|---|---|---|---|---|
| Generate Preview | Yes | Yes | Creates or replaces | Preserves selection if within saved bounds; does not itself open Calendar Day |
| Open Full Preview | No | No | Reuses existing | Clears day/range; existing Calendar Day state is not explicitly closed |
| Compact first-day selection | No | No | Reuses and filters | Sets one-day selection and opens Calendar Day |
| Compact second-day selection | No | No | Reuses and filters range | Sets ordered range and opens Calendar Day for clicked date |
| Regenerate Preview while present | Yes | No | Replaces from saved authored state | Retains in-bounds range and panel state |
| Manual-event save/delete | Yes, if preview exists | Event is persisted directly | Replaces automatically | Retains active date/editor context |

The control labels distinguish several outcomes: “Generate Preview,” “Open Full Preview,” and “Regenerate Preview” are explicit about generation/reuse at a high level. Compact day buttons describe selected date/range through accessible labels, but clicking also opens the event editor; that second outcome is not in the visible day label.

### Exit paths

Preview exits through:

- Setup primary navigation;
- fixed-time contextual recommendation;
- profile load;
- valid import;
- confirmed data clear.

No exit leads to Live, Learn, or Summary.

### Recovery paths

- stale Preview has a direct **Regenerate Preview** action in the same screen;
- range warnings are nonblocking and retain Preview;
- guardrail/missing prerequisites show itemized explanation but no field-specific link;
- empty Preview retains persistent Generate and Setup controls in the shell;
- unplaced candidates have no contextual destination;
- friction without an automatic fix provides textual guidance but no contextual link.

## Contextual Navigation Assessment

### Fixed-time recommendation

This is the most precise contextual path. It retains the selected friction’s related template ID, opens Setup, focuses the matching Fixed Start Time input, and calls `scrollIntoView` (`DayFrameApp.tsx:409-424`; `SetupScreen.tsx:135-151`). Tests verify both single- and multiple-template targeting (`DayFrameApp.test.tsx:1611`, `:1797`).

There is no dedicated return control to the originating friction. The existing Preview can be reopened via Latest Preview/Open Full Preview, which clears selected range, or regenerated through Generate Preview, which saves and replaces it. The test at `DayFrameApp.test.tsx:1691` demonstrates the longer edit → Save Setup → Open Full Preview → Regenerate path.

### Compact day and Calendar Day

A day click retains date identity in both selected-range and active-editor state, opens Preview, and populates the editor with the first matching event or a new draft (`DayFrameApp.tsx:279-336`). Existing-event **Edit Event** precisely copies that event into the editor. **Close** dismisses the editor but does not clear the selected range, so the same day button can predictably reopen it.

Changing the date field inside the editor changes `manualEventDraft.userDayDate` but not `activeManualEventDate` or the selected range until save/reopening behavior occurs (`DayFrameApp.tsx:864-876`). The editor’s heading and displayed day counts continue to use `activeManualEventDate`. No direct test covers this divergent date context before save.

### Friction occurrences

Repeated-friction disclosure keeps the user in Preview and lists dated occurrences. Selecting a proposal-only fix revises Preview in place. Selecting fixed-time review leaves Preview for the relevant authored field. The original friction may change or disappear after a proposal revision; there is no independent stored return location for an expanded occurrence.

### Guardrails and warnings

Guardrails enumerate missing setup items but do not target corresponding Setup sections. No-automatic-fix guidance says to review related Setup and regenerate without a direct link. Stale Preview has an in-context regeneration action. Unplaced candidates have no editing action. These distinctions are recorded as implemented navigation precision, not as conclusions about user comprehension.

## Context-Preservation Matrix

Legend: **P** preserved; **C** explicitly cleared; **R** replaced; **M** implicitly cleared by component remount; **U** untested/unclear; **N/A** not applicable.

| Transition | Setup draft | Preview | Day/range | Active editor | Focus target | Disclosure | Messages |
|---|---:|---:|---:|---:|---:|---:|---:|
| Initial → Setup | initialized | store value | initialized null | initialized null | null | defaults | defaults |
| Setup button from Preview | P | P | P | P | C | M/defaults on Setup mount | C |
| Generate Preview | saved/rebuilt | R | P if in bounds; C if out | P | C | M as Setup unmounts | utility C; guardrail set if needed |
| Open Full Preview | P | P | C | P | C | M if leaving Setup | C |
| Compact day → Preview | P | P | R to day/range | R/opened for date | C | M if leaving Setup | C |
| Calendar Day Close | P | P | P | C | P/null | P | P |
| Edit Event | P | P | P | R to event | P/null | P | P |
| Save Event | P | R if preview exists | P | P, updated | P/null | P | P |
| Delete Event confirm | P | R if preview exists | P | R to blank date draft | P/null | P | P |
| Review fixed time | P | P | P | P | R to template field | M/defaults on Setup mount | C |
| Save Setup | saved/rebuilt | P but stale | P | P | C | P | save message R |
| Regenerate Preview | P | R | P if in bounds | P | P/null | P | guardrail R |
| Load Profile | R | C | C | U/not explicitly reset | U/not explicitly reset | M/defaults | utility R |
| Valid import | R | C | C | U/not explicitly reset | U/not explicitly reset | M/defaults | utility R |
| Confirm clear data | R | C | C | U/not explicitly reset | U/not explicitly reset | M/defaults | clear message R |
| Invalid import | P | P | P | P | P | P | error R |
| Setup section collapse | P | P | P | P | P | C locally | P |

Related state is not always reset together. Profile load, import, and clear explicitly clear selected preview range but do not explicitly clear `activeManualEventDate`, `manualEventDraft`, `editingManualEventId`, or `focusedTemplateField` in the inspected handlers (`DayFrameApp.tsx:495-509`, `:599-620`, `:1591-1642`). The Calendar Day panel is gated by active date/draft rather than preview existence (`DayFrameApp.tsx:788`), so combined-state behavior remains untested.

## Navigation-State Ownership Map

| State | Owner / lifetime | Initialization | Main mutations and reset paths | Cross-screen / replacement persistence | Coverage |
|---|---|---|---|---|---|
| `currentScreen` | `DayFrameApp`; app mount | `"setup"` | Setup, Generate, Open Preview, day click, fixed-time, profile/import/clear | Persists until handler changes it; not persisted across reload | Tests `:70`, `:107`, `:747`, `:1611` |
| `setupDraft` | `DayFrameApp`; app mount | built from store | field edits; rebuilt when authored store collections change | Preserved across screen; replaced after save/profile/import/clear store notifications | Tests `:136-396`, `:814` |
| `selectedPreviewDayRange` | `DayFrameApp`; app mount | `null` | compact day clicks; Open Full/profile/import/clear; out-of-bounds generation | Preserved across ordinary screen changes | Tests `:548-631`, `:814` |
| `pendingPreviewRangeStartDate` | `DayFrameApp` | `null` | first/second day click; clear selection | Preserved across screen changes unless clear path | Tests indirectly `:548` |
| `activeManualEventDate` | `DayFrameApp` | `null` | day click/panel open; Close | Persists across Setup/Preview; not explicitly reset by profile/import/clear | Manual event test `:899`; combined reset untested |
| `manualEventDraft` | `DayFrameApp` | `null` | open panel, input edits, Add Another, Edit, Save, Close | Persists across screen; may outlive underlying replacement workflow | Test `:899`; Close/reset not direct |
| `editingManualEventId` | `DayFrameApp` | `null` | open existing, Add Another, Edit, Save, delete, Close | Persists across screen; replacement resets absent | Test `:899` |
| `confirmingDeleteManualEventId` | `DayFrameApp` | `null` | Delete, Cancel, confirm, Close | Persists across screen unless owning handler resets | Test confirm `:899`; cancel inspection |
| `focusedTemplateField` | `DayFrameApp` | `null` | fixed-time entry; generic Setup/Preview, Save, day click clear | Parent-owned, but purpose is consumed by mounted Setup effect | Tests `:1611`, `:1797` |
| Setup disclosure booleans | `SetupScreen`; screen mount | preferences/shifts open; others closed | individual/all toggles | Lost on screen unmount; draft independent | Test `:785` |
| Setup delete-confirmation state | `SetupScreen`; screen mount | null | entity delete/cancel/confirm | Lost on Setup unmount | Inspection only |
| Repeated-friction disclosure | Native `<details>` DOM | closed by browser default | summary activation | Lost when Preview remounts/result DOM changes | Render/group test `PreviewScreen.test.tsx:474`; disclosure persistence untested |
| Clear confirmation | `DayFrameApp` | false | Clear, Cancel, confirm, `resetShellMessages` | Can persist across screens unless reset by navigation | Test `:2260`, `:2280` |
| Profile/import/backup messages | `DayFrameApp` | empty | utility workflows and navigation resets | Cleared by many navigation/workflow handlers | Tests `:409`, `:2297-2484` |
| `previewGuardrailMissingItems` | `DayFrameApp` | empty | failed generation; save/navigation/replacement resets | Parent-owned across render until reset | Tests `:1184`, `:1200`, `:2190` |
| `preview.isStale` | Store domain state | from persisted/current preview | authored setters mark; generation clears | Persists across screen and storage with preview state | Tests `:1451`, `:1477` |
| Preview existence/result | Store domain state | store/persistence | generation/revision; profile/import/clear removal | Persists across screen; can persist across app reload through store persistence where saved | Broad preview tests; reload destination separate |

## Navigation Hierarchy Assessment

The executable hierarchy is:

```text
Persistent application shell
├── persistent data-management utility region
├── workspace identity
├── semantic primary nav
│   ├── Setup (destination)
│   └── Generate Preview (compound action + destination)
├── Latest Preview (conditional Plan summary/navigation)
│   ├── Open Full Preview
│   └── local day/range controls
├── Calendar Day (conditional contextual editor)
└── conditional main screen
    ├── Setup
    │   ├── sticky actions
    │   └── collapsible editor workspaces
    └── Preview
        ├── regenerate/guardrail/warnings
        ├── proposal summary
        ├── repeated-friction disclosure
        └── day groups and friction actions
```

Primary and contextual distinctions exist semantically: only Setup/Generate are inside `<nav>`, disclosures use `aria-expanded` or `<details>`, and confirmations are inline. However:

- a destination and a compound action occupy equivalent primary-nav positions;
- data utilities precede the primary nav in render order and persist at the same shell level;
- Latest Preview is both summary and navigation;
- Calendar Day is a shell panel rather than a child of Preview;
- destructive clear-data controls remain globally persistent rather than being a separate utility destination.

The approved Planner/Summary Navigation Area hierarchy is not represented by state, route, heading, or control.

## Lifecycle Navigation Map

```text
                       profile load / import / clear
                                  │
                                  ▼
Initial launch ───────────────> Setup (Teach-like)
                                  │  ▲
            save + generate       │  │ Review fixed time
                                  ▼  │
                           Preview (Plan-like)
                           ├── revise in place
                           ├── regenerate in place
                           ├── filter day/range
                           └── Calendar Day editor
                                  │
                                  X  no accept/Live destination

Approved continuation:
Preview/Plan ──> Live ──> Learn/Summary ──> Teach or Plan
                 absent     absent            absent
```

The implemented cycle supports repeated Setup ↔ Preview iteration. It terminates structurally at an unaccepted proposal because no further destination exists.

## Dead Ends and Recovery Assessment

| State | Visible explanation | Available next action | Precision / context | Test support | Finding |
|---|---|---|---|---|---|
| Missing generation prerequisites | “Finish setup…” plus missing-item list | Global Setup or retry Generate | Identifies data categories but no field/section target; failed Generate already moved to Preview | `DayFrameApp.test.tsx:1184`, `:1200`, `:2190` | Partial recovery |
| Empty Preview | Says generate to see blocks/friction | Persistent Generate or Setup | Destination/action available in shell; empty component has no direct button | `PreviewScreen.test.tsx:15` | Partial recovery |
| Stale Preview | Says Setup changed and generate new preview | In-context Regenerate Preview | Precise; retains old Preview until activation | `DayFrameApp.test.tsx:1451`, `:1477` | Confirmed recovery |
| Range mismatch | Itemized nonblocking warning | Regenerate or Setup manually | No direct source-field target; Preview remains usable | `previewRangeWarnings.test.ts`; `DayFrameApp.test.tsx:1524` | Partial recovery |
| Friction with proposal fix | Message plus labeled fix | Select fix | Precise occurrence and in-place revision | `PreviewScreen.test.tsx:138`; `PreviewScreenContainer.test.tsx:49` | Confirmed |
| Fixed-time friction | **Review fixed time** | Precise focused Setup field | Object identity retained; original Preview preserved | `DayFrameApp.test.tsx:1611`, `:1797` | Confirmed contextual recovery |
| Friction without automatic fix | Text says review related Setup and regenerate | Global Setup, manual rediscovery | No contextual target; original problem remains in stored Preview | Inspection only | Partial recovery |
| Unplaced candidate | “needs placement” and details | None on candidate | No contextual edit/recommendation path | `PreviewScreen.test.tsx:34` | Navigation dead end within candidate context |
| Invalid import | Error message | Retry Import or continue current context | No state replacement; current screen/data retained | `DayFrameApp.test.tsx:2484` | Confirmed recovery |
| Invalid/blank profile name | Error message | Edit name and retry | Same utility region retained | `DayFrameApp.test.tsx:409` | Confirmed recovery |
| Out-of-bounds selected range after generation | No separate message | Selection automatically clears | Full Preview remains; prior filter is removed | Handler inspection `DayFrameApp.tsx:239-248` | Automatic recovery; untested directly |
| Missing fixed template mapping | No navigation occurs; generic proposal fix handler runs if applicable | Depends on action behavior | Precise Setup destination unavailable | `DayFrameApp.tsx:415-431`; no direct test | Open Question |
| Open Calendar Day during profile/import/clear | No dedicated consistency message | Panel state may remain because local editor reset is absent | Underlying authored/preview data replaced while editor context is parent-local | No combined test | Open Question / boundary risk |
| Deleted/replaced authored data | Success message; routed Setup for replacement workflows | Continue in rebuilt Setup | Preview/range cleared; active editor reset incomplete | Tests `:814`, `:2280`, `:2417` | Partial recovery |

## Structural Findings

1. **Partially Implemented:** two screen destinations support Teach-like and Plan-like activity, but Planner, Live, Summary, and Learn destinations are absent.
2. **Compound Navigation and Action:** Generate Preview is the persistent primary Preview-entry control and also saves, validates, generates, and replaces proposal state.
3. **Asymmetric navigation:** Setup opens directly; Preview reuse is conditional on existing preview state and uses a separate Open Full Preview path.
4. **Distributed Preview entry:** generation, reuse, filtering, regeneration, and automatic post-event replacement are distinct paths with different state effects.
5. **Shared Navigation Infrastructure:** compact Preview context persists across screens and enables local day/range movement.
6. **Boundary Ambiguity:** Calendar Day is shell-owned while editing Plan-context authored data; it can coexist with either screen.
7. **State ownership mismatch:** selected range and Calendar Day/editor state are related but independently owned/reset.
8. **Implicit remount reset:** Setup disclosure/confirmation and Preview native detail state are not represented in parent navigation state.
9. **No URL hierarchy:** destinations and context have no route, deep link, history, or browser-return representation.
10. **No universal creation or gesture language:** creation and details entry are object/environment specific.
11. **Architecturally Unowned:** profile/backup/clear utility region is persistently available but outside the Planner/Summary hierarchy.
12. **Lifecycle dead end:** no implemented path continues from proposal review to execution or reflection.

## Experiential Findings

Each finding below describes an observable consequence, not a subjective reaction.

1. **Generate replaces rather than merely enters.** Activating the primary Preview-side control saves the draft and regenerates; an existing proposal cannot remain unchanged through that path (`DayFrameApp.tsx:257-268`).
2. **Preview entry has multiple outcomes.** Generate replaces the proposal, Open Full reuses it but clears selection, and day selection reuses/filters it while opening Calendar Day (`DayFrameApp.tsx:176-184`, `:279-306`).
3. **Unsaved authored values survive screen movement.** Parent-owned draft state is retained; Generate converts it to saved state, whereas Open Full Preview does not (`DayFrameApp.test.tsx:136`).
4. **Focused recommendation context is precise.** Fixed-time review retains object identity and places keyboard focus on the matching field (`DayFrameApp.test.tsx:1611`, `:1797`).
5. **Returning to the original friction is indirect.** After focused Setup editing, reopening unchanged Preview requires Open Full Preview and loses its selected range; seeing changed results requires regeneration.
6. **Local Setup position resets on screen remount.** Draft values remain, but expanded sections and pending inline deletions return to component defaults.
7. **Closing Calendar Day retains the selected Preview filter.** The panel disappears while the day/range remains selected; selecting that day again reopens the panel.
8. **Manual-event save changes more than the panel data.** It persists authored data and automatically replaces an existing Preview while retaining panel context (`DayFrameApp.tsx:338-397`).
9. **Some recovery requires rediscovery.** Missing prerequisites and no-fix friction explain the needed category/action but do not navigate to the exact Setup section.
10. **Unplaced candidates have no local continuation.** They are visible as needing placement but expose no contextual control.
11. **Replacement workflows clear some but not all related context.** Profile/import/clear remove Preview and selection, but their handlers do not explicitly close Calendar Day/editor state.

Whether users notice, understand, or are hindered by these consequences requires observational research.

## Navigation Language Assessment

| Label | Communicated role | Implemented consequence disclosed by label/copy |
|---|---|---|
| **Setup** | Destination | Detail says edit shifts, cycle, templates, range; pure screen change |
| **Generate Preview** | Action producing destination state | Detail explicitly says save draft, generate, and open |
| **Regenerate Preview** | Replacement action in current destination | Clearly signals new generation; does not mention saved-state source |
| **Open Full Preview** | Destination/reuse | Signals opening existing Preview; does not state selection reset |
| **Latest Preview** | Existing-state context | Communicates reuse/current summary |
| **Calendar Day**, **Day Details**, **Add Event** | Context/panel task | Communicates date details and creation, not that day click also filters Preview |
| **Save Event** | Domain action | Does not state automatic Preview regeneration |
| **Edit Event**, **Add Another Event** | Local editor transitions | Accurately identify editor result |
| **Close** | Panel return | Clears editor but retains selected range; scope is not in label |
| **Review fixed time** | Contextual review destination | Communicates inspection rather than automatic mutation |
| Suggested fix labels | Proposal action | Specific behavior depends on label/action; revision remains in Preview except fixed-time review |
| **Expand All**, **Collapse All** | Local disclosure | Accurately describes no destination change |
| **Load Profile** | Replacement action | Surrounding copy says it replaces current active setup |
| **Import/Export Setup Backup** | Data transfer action | Scope “Setup” is named; shell support text says Preview is excluded |
| **Clear Local Data** | Destructive action | Confirmation states all locally saved DayFrame setup data |

The navigation mixes place names (“Setup”), generated-state actions (“Generate Preview”), reuse (“Open Full Preview”), local context (“Calendar Day”), and utilities within one persistent shell. Copy discloses several compound effects, but selection reset and automatic event-driven regeneration are not stated in their control labels.

## Browser, URL, and History Behavior

Broad inspection of executable `code/src/**` found:

- no router dependency or route declarations;
- no URL-derived screen or object state;
- no `history.pushState`, `replaceState`, or `popstate`;
- no application anchors or deep links;
- no native browser Back/Forward integration;
- no URL representation for Setup, Preview, selected date/range, Calendar Day, event, friction, or focused template.

`currentScreen` always initializes to `"setup"` on app mount (`DayFrameApp.tsx:74`). Domain state may reload through the store’s persistence, but current destination and local navigation context are component state, so executable initialization restores Setup rather than the prior screen. Chapter VIII is platform-independent and does not explicitly require URLs or browser history; these are implementation absence findings, not normative divergences by themselves.

## Keyboard, Focus, and Responsive Navigation Assessment

### Confirmed keyboard/focus behavior

- Navigation, actions, compact days, disclosures, and confirmations use native `<button>` semantics.
- Repeated friction uses native `<details>/<summary>`.
- The fixed-time contextual transition calls `.focus()` and `scrollIntoView` on the exact input (`SetupScreen.tsx:135-151`); focus is tested (`DayFrameApp.test.tsx:1611`, `:1797`).
- Buttons and form controls receive a visible `:focus-visible` outline; compact day buttons have a separate focus-visible rule (`dayFrameUi.css:131-141`, `:813-816`).
- Setup disclosure buttons expose `aria-controls` and `aria-expanded` (`SetupScreen.tsx:2282-2291`).

No executable custom Enter/Escape handling, form-submit navigation, focus restoration after Calendar Day close, focus placement after validation, or focus return after confirmation was found. No keyboard-specific navigation test was found beyond programmatic fixed-field focus.

### Responsive navigation

The React destination model does not change by viewport. CSS reflows the persistent two-column primary nav to one column below 720px, shrinks compact day controls, and changes shell layout at 980px (`dayFrameUi.css:982-1027`). No navigation region is hidden by a responsive rule in the inspected stylesheet.

Compact days wrap in a flex container (`dayFrameUi.css:779-805`), and general action groups wrap (`dayFrameUi.css:340-344`, `:976-980`). There is no alternate mobile menu or de facto mobile screen branch.

No automated viewport, overflow, or mobile keyboard-navigation test was found. Practical reachability and hierarchy perception at small sizes are therefore not confirmed.

## Behavioral Invariants

1. `currentScreen` has only Setup and Preview values and initializes to Setup.
2. The persistent primary nav always renders Setup and Generate Preview.
3. Setup changes screen without saving; Generate Preview saves and generates before/during screen change.
4. Existing Preview reuse is available only when preview state exists.
5. Open Full Preview clears local day/range filtering.
6. Compact day activation filters Preview and opens Calendar Day.
7. Setup draft survives ordinary screen changes.
8. Setup local disclosure state does not have parent/app lifetime.
9. Proposal-only fixes do not change destination.
10. Fixed-time review changes destination and focuses the matching authored field without automatic domain mutation.
11. Manual-event save/delete automatically regenerates an existing preview.
12. Profile load and valid backup import replace authored data, clear Preview/range, and route Setup.
13. Clear Local Data requires confirmation and completes at Setup.
14. Invalid import retains current application/domain context and shows an error.
15. No browser route or history entry represents navigation state.
16. No implemented destination continues from Preview to Live or Learn.

## Architectural Gaps

The following normative navigation responsibilities have no implemented equivalent:

- Planner as a primary Navigation Area;
- Summary as a primary Navigation Area;
- a Live Surface destination within Planner;
- a Learn Surface destination within Summary;
- Plan → Live, Live → Learn, and Learn → Teach/Plan lifecycle movement;
- navigation between Planner and Summary;
- universal creation for Commitments and Goals;
- universal long-press contextual-action behavior;
- universal double-tap detail behavior;
- a stable parent-Surface hierarchy for Calendar Day/manual-event context;
- contextual paths from unplaced candidates;
- precise field/section recovery from all generation guardrails and no-fix friction;
- navigation to historical information, planning effectiveness, trends, or long-term learning;
- entry to or return from an execution workspace.

URL routing, browser history, and deep links are absent, but the normative chapter does not expressly require those technologies.

## Coverage Assessment

### Directly supported by automated tests

The five relevant UI test files cover:

- initial destination and active navigation state;
- Setup/Preview transitions;
- automatic save/generation;
- draft preservation;
- compact day/range filtering and persistence;
- restoring full Preview;
- Calendar Day event create/edit/delete;
- fixed-field contextual return and focus;
- stale Preview and regeneration;
- generation guardrails and range warnings;
- profile load and selection reset;
- backup import and invalid-import recovery;
- clear-data confirmation/completion;
- proposal suggested fixes and repeated-friction actions.

The relevant suite was executed for this phase:

```text
5 test files passed
75 tests passed
```

### Supported by implementation inspection

Inspection establishes:

- complete state ownership and handler mutation paths;
- pure versus compound control behavior;
- render hierarchy and visibility conditions;
- remount-driven disclosure resets;
- lack of router, URL, history, gesture, and keyboard-event handlers;
- responsive CSS reflow;
- contextual paths without direct tests;
- absence of Live, Learn, Planner, and Summary destinations.

### Requiring observational user research

The following are not confirmed by tests or code:

- whether destination/action labels are understood;
- whether the persistent utility region competes perceptually with planning navigation;
- whether users recognize Open Full Preview as the unchanged-reuse path;
- whether context resets are noticed or costly;
- whether users understand that compact-day activation also opens event editing;
- whether responsive render order communicates the intended hierarchy;
- whether the absence of browser history conflicts with user expectations.

### Coverage limitations

- No test directly asserts Calendar Day Close or Add Another Event.
- No test combines an open Calendar Day editor with profile load, import, or clear.
- No test verifies Setup disclosure state after leaving and remounting the screen.
- No test directly asserts the no-automatic-fix or unplaced-candidate recovery path.
- No browser history, deep-link, keyboard-only, or viewport-specific test exists.
- Tests assert behavior, not architectural comprehension.

## Open Questions

1. Profile load, valid import, and clear-data completion do not explicitly clear Calendar Day/editor state. The combined visible state is untested.
2. Editing the Date field in the Calendar Day event draft can diverge from `activeManualEventDate` and the selected Preview range before save. No test establishes navigation/context behavior for that path.
3. A missing template mapping for a `changeFixedTime` recommendation does not produce the focused Setup transition; no direct test establishes the fallback’s visible result.
4. Setup draft values persist across screen changes while local disclosure and pending deletion state remount. The implemented distinction is clear, but its effect on task resumption is not observed.
5. Native `<details>` owns repeated-friction expansion state. Its persistence across in-place preview revisions is not tested.
6. Open Full Preview explicitly clears selected day/range but does not explicitly close Calendar Day. The combined full-range-plus-active-panel state is not directly tested.
7. Store persistence can restore domain data, but app mount always selects Setup. Reload behavior for an existing persisted Preview is not directly covered by the UI navigation tests.

