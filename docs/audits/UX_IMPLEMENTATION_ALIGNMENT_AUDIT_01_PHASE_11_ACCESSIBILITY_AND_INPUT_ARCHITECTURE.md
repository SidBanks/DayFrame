# UX Implementation Alignment Audit 01

## Phase 11 — Accessibility and Input Architecture

**Normative source:** `docs/architecture/DayFrame_Interaction_Architecture_Specification.md`, especially Chapter XI — Accessibility, Chapter IX — Interaction Patterns, Chapter VIII — Navigation Architecture, Chapter X — Visual Philosophy, and the architectural responsibilities governing consistency, context preservation, progressive disclosure, feedback, and user agency  
**Implementation scope:** `code/src/**`  
**Method:** Executable implementation, rendered semantics, styles, and automated tests only  
**Audit date:** 2026-07-31

## Executive Findings

DayFrame has a **Strong Native Foundation with Partial Application Governance**.

The implementation receives substantial baseline accessibility from native HTML. Primary actions, navigation-like controls, list editing, recommendations, confirmations, and compact dates are `<button>` elements. Setup and Calendar Day use native text, number, date, time, checkbox, select, textarea, and file controls. Work-day and recurrence-day sets use `<fieldset>` and `<legend>`. Setup disclosures use buttons with `aria-expanded`/`aria-controls`; repeated friction uses native `<details>/<summary>`. These controls are normally Tab-reachable and Enter/Space-operable without pointer-specific code.

Application-owned semantics are strongest in four places:

1. Setup/Preview controls expose current state with `aria-pressed`.
2. Compact Preview date buttons expose full date names, selection/range position, friction, and today state through dynamic accessible names, `aria-pressed`, and `aria-current="date"` (`DayFrameApp.tsx:676-709`, `:752-783`; tests `DayFrameApp.test.tsx:548-631`, `:723-781`).
3. Setup disclosures expose state and controlled content IDs (`SetupScreen.tsx:2276-2304`).
4. Fixed-time recovery moves focus and scrolls to the exact matching input using a stable template ID (`SetupScreen.tsx:136-151`; tests `DayFrameApp.test.tsx:1611`, `:1797`).

Keyboard reachability is broad because meaningful operations use native controls and no essential pointer-only handlers, drag-and-drop, hover-only actions, custom gesture handlers, or canvas interactions were found. However, automated tests activate controls primarily with `fireEvent.click`/`change`; no Tab-order, Enter, Space, Escape, switch-control, voice-control, or screen-reader workflow tests were found. Most keyboard conclusions are therefore **Browser/Assistive-Technology Dependent Native Keyboard Operability**, not application-tested accessibility.

Focus continuity is the weakest accessibility system. Apart from fixed-time correction, no destination heading, guardrail, warning, status, Calendar Day editor, inline confirmation, revised Preview, replacement result, or restored opener receives application-managed focus. Closing Calendar Day does not restore focus to its day button. Collapsing/removing focused content, deleting a focused record, navigating between Setup and Preview, regenerating Preview, loading/importing/clearing authority, and replacing a focused recommendation all rely on browser focus fallback. Phase 10's orphaned Calendar Day context can consequently become an accessibility-context orphan as well as a state-context orphan.

Dynamic communication is visible only. No `aria-live`, `role="status"`, `role="alert"`, focus-to-message behavior, or error-description relationship was found. Dirty/saved state, Setup save, generation guardrails, staleness, range warnings, revision feedback, profile/import outcomes, and clear confirmation/results are inserted or changed in ordinary DOM nodes. They can be found by later navigation, but automatic assistive-technology announcement is not established.

Form semantics are mixed. Global and Calendar Day fields use explicit `<label for>`. Many repeated Setup editors render a visible `<label>` without `htmlFor` and give the adjacent control a generic `aria-label` such as “Name,” “Start Time,” or “Title.” Each control has a name, but the visible label is not programmatically associated and repeated accessible names do not include record identity. Fieldsets correctly group work days, recurrence, and recurrence weekdays; many other conditional groups are visual containers only. Application errors are not associated with affected inputs.

Nonvisual access to Preview is materially present. Preview metadata, day headings, work/generated/manual lists, unplaced candidates, friction text, fix buttons, timestamps, holidays, and stale state are textual. `DayVisualizer` is a labeled section whose positioned `<article>` blocks have kind, title, and time-range accessible names; the same day also has textual lists. Spatial lane, overlap, clipped-duration, and user-day-boundary relationships are not programmatically described, and the visualizer's hour labels are explicitly hidden (`DayVisualizer.tsx:41-103`).

Color is rarely the sole carrier of essential state. Success/error/stale/friction conditions have text; date selection/today/friction have ARIA state/name; block kind is in visualizer article names and textual section headings. Visual overlap and some timeline distinctions remain position/style dependent. Exact contrast compliance is not determined here; no computed-style measurement was performed.

Motion is limited to 120ms hover/focus-adjacent transitions and programmatic smooth scrolling for fixed-time correction. No keyframes, loading animation, or functional dependency on motion was found. No `prefers-reduced-motion` handling was found.

The approved single-tap/long-press/double-tap interaction language is not implemented as gestures. Primary action is structurally represented by click/activation on explicit controls; long press and double tap are absent. This improves explicit keyboard access relative to hidden gesture-only context but remains an implementation-alignment divergence.

Live and Learn accessibility are absent because the underlying environments and transitions are absent. No Preview interaction is semantically presented as execution, historical outcome, or learned evidence.

## Accessibility Surface Inventory

| Surface | Semantic structure and entry | Keyboard/input path | Focus/announcement determination |
|---|---|---|---|
| Persistent shell | `<header>` containing profile/data utilities and workflow summary/nav | Native controls; utilities occur before planning navigation in DOM | No initial-focus owner; messages visible only |
| Primary navigation | `<nav aria-label="App Sections">`; two pressed buttons | Tab + native activation | Current state exposed; destination focus not moved |
| Setup | `<main>`, header, `h1`, toolbar, collapsible sections | Native form controls/buttons | Fixed-time target only intentional entry focus |
| Setup action bar | `role="toolbar" aria-label="Setup actions"` | Buttons in DOM order | Dirty/saved text visible only |
| Setup sections | Labeled `<section>` plus toggle button and hidden content | Native button; collapsed content `display:none` | State exposed; collapsing focused descendant has focus-loss risk |
| Preview shell | Screen wrapper, header, `h1`, Regenerate button, guardrails | Native button | Generate/navigation does not focus heading/error |
| Preview result | `<main>`, header, metadata sections, day sections/lists | Reading navigation + fix buttons/details | Replacement does not preserve reading/focus position explicitly |
| Latest Preview | Labeled `<section>`, metrics, date buttons | Native button traversal | Selection/current/friction exposed in names/states |
| Calendar Day/editor | Labeled `<section>`, heading, labeled form controls, action buttons/list | Native controls | Opening, editing, closing, save/delete lack focus entry/restoration |
| Repeated friction | Labeled section; native `<details>/<summary>` per pattern | Native disclosure behavior | Native expanded state; no announcement after proposal replacement |
| DayVisualizer | Labeled `<section>`, positioned labeled articles | Read-only; no interaction required | Time/kind/title exposed; spatial overlap not exposed |
| Profile/data utilities | Sections, labels, buttons, file input, inline messages/confirmation | Native controls/file chooser | Persistent region precedes main workflow in tab order; outcomes visible only |
| Inline confirmations | Ordinary `<div>`/fragments with confirm/cancel buttons | Keyboard reachable after sequential Tab | No dialog/group role, focus entry, Escape, containment, or restoration |

## Interactive-Control Inventory

| Family | Element/name source | State semantics | Keyboard/modality / coverage |
|---|---|---|---|
| Setup/Generate navigation | `<button>`; `aria-label` | `aria-pressed` current destination | **Native Keyboard Operability; Modality Equivalent**; state directly tested |
| Setup Save/Expand/Collapse | Text buttons in labeled toolbar | Individual disclosure state changes elsewhere | Native; click-tested, not keyboard-tested |
| Section disclosures | Text button name includes section/action | `aria-expanded`, `aria-controls`; controlled content hidden | **Application-Owned Accessibility**; ARIA directly tested |
| Setup fields | Native input/select/checkbox; explicit or `aria-label` names | Native value/checked/disabled | Native operability; many labels generic/repeated |
| Add/Edit/Delete | Text buttons | No expanded/editing state attributes | Native activation; pointer-like tests only |
| Confirm/Cancel | Text buttons | No dialog/group state | Native activation; no Escape handler |
| Compact dates | Button; dynamic full-date `aria-label` | `aria-pressed`, `aria-current`; range/friction in name | **Application Keyboard Operability through native button**; semantics tested |
| Open Full/Regenerate | Text buttons | No busy/current relationship | Native; click-tested |
| Suggested fixes | Text buttons from fix label | No description binding to friction message | Native; click-tested |
| Repeated friction | `<summary>` visible title/count | Native open state | Browser-dependent keyboard behavior |
| Manual-event controls | Native fields and text buttons | Conditional timed fields | Native; click/change tested |
| Profile controls | Explicit profile-name label and row text buttons | Row buttons repeat “Load Profile”/“Delete Profile” without profile name | Native, but repeated names are context-dependent |
| Backup import | Visible Import button activates hidden/native file input; input has `aria-label` | File type via `accept` | Browser-dependent file-picker access; change tested |
| Export/Clear | Text buttons; inline confirmation | No dialog/alert semantics | Native; click-tested |

No icon-only controls, links, custom role-buttons, drag handles, or pointer-only cards were found.

## Landmark and Document Structure Assessment

Setup and Preview result each use `<main>` and expose destination `h1` headings. The shell has an explicit primary `<nav>`, while utilities live in generic sections within the shell header. Calendar Day and compact Preview use `aria-labelledby`; Preview summary/day subsections are similarly labeled. This provides a useful semantic skeleton.

Document hierarchy is not globally linear. The shell renders a profile-region `h2` before the brand `h1`; the brand `h1` coexists with destination `h1` headings; the Preview wrapper has `h1 “Preview”` and `PreviewScreen` adds `h1 “DayFrame Preview.”` Several inner sections use `h3` beneath day `h2` headings coherently, but utility and shell headings precede destination content. No skip link or explicit landmark for utilities was found.

**Confirmed — Semantic Integrity is locally strong; global heading and landmark architecture is partial.**

## Heading Architecture Assessment

| Area | Rendered pattern | Finding |
|---|---|---|
| Shell | Profile `h2`; brand `h1`; workspace `h2`; Latest Preview `h2` | DOM order begins below the top-level heading and includes repeated high-level identities |
| Setup | `h1 Setup`; section `h2`; record headings/classes vary | Destination clear; long editor has navigable section headings |
| Preview | wrapper `h1 Preview`; child `h1 DayFrame Preview`; summary/repeated/day `h2`; groups `h3` | Two destination-level headings; local section hierarchy coherent |
| Calendar Day | `h2 Add Event/Day Details`; group `h3` | Context named, but opening does not focus heading |
| Confirmations | Paragraph text/buttons, no heading | Target text visible; not a named dialog/region |

## Accessible Naming Matrix

| Control/region | Name source | Assessment |
|---|---|---|
| Primary nav | `aria-label` and visible title | Exact but hides descriptive span from name with `aria-hidden` |
| Compact date | Dynamic `aria-label` with full date, selected position, today, friction | **Confirmed — Semantic Integrity** |
| Setup section toggle | Visible “Section: Expand/Collapse” | Exact and state duplicated by `aria-expanded` |
| Global/range/manual fields | `<label htmlFor>` | **Error-independent Semantic Integrity** |
| Repeated Setup fields | Generic `aria-label`; adjacent unassociated visible label | Programmatic name exists; record context absent; visible-label association partial |
| Profile input/import file | Explicit label / `aria-label` | Named |
| Profile row actions | Visible “Load Profile” / “Delete Profile” repeated | Operable in list context, but names omit profile identity |
| Suggested fix | Generated visible label | Named, but no `aria-describedby` binding to owning friction |
| DayVisualizer | Section `aria-label`; block article `aria-label` | Kind/title/time exposed; overlap absent |
| Holiday region | `aria-label` including ISO date; holiday/type visible text | Named and textual |

## Form Label and Description Matrix

| Group | Native type / naming | Instructions, constraints, errors | Determination |
|---|---|---|---|
| Schedule preferences | time/select with explicit `for` labels | Section helper text not programmatically associated | Strong native baseline |
| Preview Range | select/date with explicit `for` labels | Conditional fields; no error association | Strong native baseline; description partial |
| Shift records | text/time/checkbox + work-day fieldset | Generic ARIA names; repeated record identity not included | **Semantic Integrity partial** |
| Cycles/segments/sequence | select/date/text/checkbox; mixed visual groups | Conditional content; segment labels generic; no described relationships | Native controls, incomplete grouping/context |
| Templates/recurrences | input/select/checkbox; recurrence fieldsets | Units appear in labels; generic repeated names; conditional fields | Keyboard-operable, programmatic record context partial |
| Manual event | explicit labels; checkbox; conditional time inputs | No required state; blank title becomes “Untitled Event”; no application errors | Strong naming; silent normalization |
| Profile name | explicit label | Blank-name error rendered separately, no `aria-invalid`/description | **Error Unassociated** |
| Backup import | labeled file input, `accept` | Parse/schema error rendered separately | **Error Unassociated** |

The implementation uses button handlers rather than HTML form submission. Enter submission behavior is therefore not provided; completion requires reaching and activating explicit Save buttons.

## Grouping and Relationship Assessment

Work Days, Recurrence, and recurrence Weekdays have fieldset/legend semantics (`SetupScreen.tsx:651-674`, `:2132-2203`). Setup actions have a labeled toolbar. Preview/day regions use heading relationships. Lists preserve collection semantics.

Schedule-preference pairs, range source/dates, cycle mode and conditional editors, segment settings, placement settings, manual all-day/timed controls, profile row actions, confirmation actions, and friction/fix relationships rely mainly on visual containment. No `role="group"` or description relationships bind recommendation buttons to their friction messages. Native `<details>` correctly owns its summary/content relationship.

## Keyboard Reachability Matrix

| Interaction | Tab | Enter | Space | Arrows | Escape | Completion |
|---|---:|---:|---:|---:|---:|---|
| Buttons/navigation/date/fixes | Native yes | Native activate | Native activate | No app behavior | No | Yes through native controls |
| Text/date/time/file inputs | Native yes | Input/browser-dependent | Text entry / checkbox toggle | Native field behavior | Browser-dependent | Yes; Save requires button traversal |
| Selects | Native yes | Native | Native | Native selection | Browser-dependent | Yes |
| Checkboxes | Native yes | Browser-dependent | Native toggle | No | No | Yes |
| Native details/summary | Native expected | Native expected | Native expected | Browser-dependent | No app behavior | Yes |
| Setup disclosure buttons | Native yes | Native | Native | No | No | Yes |
| Inline confirmations | Buttons reachable after insertion | Native | Native | No | **Not Implemented** | Yes after Tab traversal |
| Compact range | Each date is a button | Native | Native | **Not Implemented** | No cancel | Yes, but range requires sequential Tab/activation |
| Calendar Day | Native controls | Native control behavior | Native | Native per field | No close shortcut | Yes through Close button |

No application-defined keyboard handlers were found. There is no keyboard-inaccessible essential action in JSX, but practical completion and focus order remain browser/AT dependent and untested.

## Tab Order and DOM Order Assessment

DOM order begins with profile/data utilities, then brand/workspace/navigation/Latest Preview/Calendar Day, followed by the current Setup or Preview destination. Native tab order follows this source order. Persistent utilities can therefore precede the primary planning controls on every traversal. The sticky Setup action bar and sticky section headers remain in their DOM positions even though their visual position persists during scrolling.

Inline confirmations are inserted adjacent to their trigger, giving a locally sensible sequential Tab path, but focus stays on the trigger that may be removed. Collapsed Setup content uses `display:none`, so descendants leave the tab order. Calendar Day is placed in the shell before the main destination even when opened from a compact date; focus is not transferred to it.

## Focus Ownership Matrix

| Transition | Explicit owner/target | Result |
|---|---|---|
| Initial load | None | Browser default, normally document body |
| Setup/Preview navigation | None | Initiating button focus may persist if button remains; destination not focused |
| Generate/Regenerate | None | Trigger may remain or be removed/replaced; result/error not focused |
| Open Calendar Day | None | Date button retains focus; editor inserted elsewhere in DOM |
| Close Calendar Day | None | Close button is removed; no opener restoration |
| Event edit/save/delete | None | Insertion/replacement/removal relies on browser fallback |
| Inline confirmation | None | Trigger replaced; confirm/cancel not focused |
| Fixed-time correction | SetupScreen ref → exact input; scroll into view | **Focus Intentionally Moved**, directly tested |
| Suggested fix/revision | None | Trigger may disappear after Preview replacement; **Focus Loss Risk** |
| Profile load/import/clear | None | Focused controls/content may be removed; **Focus Orphaned/Loss Risk** |
| Invalid import | None | File/input focus browser-dependent; error not focused |

## Focus Entry, Exit, Restoration, and Replacement

Fixed-time correction is the only confirmed focus-entry implementation. It expands Templates, looks up the input ref by template ID, focuses it, and calls smooth `scrollIntoView`. There is no fallback focus if the ID is absent.

Initial Setup, Preview entry, blocked Generate, Calendar Day opening, manual Edit, invalid import, loaded/cleared Setup, and revised Preview do not move focus to a heading, relevant control, or message. Close, cancel, Save, Delete, section collapse, range clear, utility completion, and replacement do not restore focus. When the focused element survives, native browser focus may remain; when conditional rendering removes it, resulting focus is implementation/browser-dependent.

Phase 10 replacement risks carry directly into accessibility. Profile load/import/clear can leave Calendar Day state present while removing Preview/source authority, so focus and semantic context can remain attached to an editor whose governing aggregate changed. Preview replacement can remove a focused recommendation occurrence. Setup reconstruction can remove a focused record or change the record addressed by an index-based confirmation.

## Programmatic Focus Inventory

Only one `.focus()` and one `scrollIntoView` path were found: fixed-time correction in `SetupScreen.tsx:136-151`. It depends on the Templates disclosure being expanded and the matching ref being registered by stable template ID. Tests assert exact focus for single and multiple matching templates (`DayFrameApp.test.tsx:1688`, `:2007`).

No `autoFocus`, focus trap, focus restoration stack, roving tab index, destination `tabIndex=-1`, or other focus-management system was found. CSS explicitly styles `:focus-visible` for primary button families, compact date buttons, and `.df-field` inputs/selects/textareas. Native summaries, checkboxes outside `.df-field`, and the file input rely on browser focus indicators.

## Status and Alert Communication Matrix

| Change | DOM communication | ARIA/focus behavior | Classification |
|---|---|---|---|
| Dirty/saved/Setup saved | Replaced `<p>` text/style in toolbar | No live region or focus | **Status Visible Only** |
| Generate blocked | Inserted paragraph/list | No alert/live region, association, or focus | **Status Visible Only; Error Unassociated** |
| Preview stale | Conditional danger paragraph | No announcement/focus | **Status Visible Only** |
| Range warnings | Conditional paragraph/list | No announcement/description relation | **Status Visible Only** |
| Suggested fix result | Preview action-feedback paragraph | No live region; Preview may rerender trigger away | **Status Visible Only** |
| Profile success/error | Conditional paragraph | No status/alert role | **Status Visible Only** |
| Import success/error | Conditional paragraph | No status/alert role or file-input association | **Status Visible Only** |
| Clear confirmation/completion | Conditional ordinary container/paragraph | No dialog/alert/focus | **Status Visible Only** |
| Event save/delete | Updated lists/Preview | No explicit textual action status/live region | **Not Announced** |

No `aria-live`, `role="status"`, or `role="alert"` was found in `code/src/**`.

## Error Association and Recovery Assessment

Generation guardrails list missing categories and retain committed input, but do not identify controls by ID, set `aria-invalid`, use `aria-describedby`, or move focus. Correction is keyboard-reachable through Setup navigation but memory/navigation dependent. Blank profile name retains the input and renders an error without association or focus. Invalid import retains active state and permits file retry, but the message is not associated with the file input or announced. Native date/time/number control constraints use browser behavior where attributes exist; there is no central error summary or application-owned validation focus.

**Confirmed — recovery is operationally keyboard-reachable, while error notification and field association are architecturally incomplete.**

## Confirmation Accessibility Assessment

Clear and Setup-record confirmations include visible consequence text plus native Confirm/Cancel buttons. Manual-event deletion replaces the Delete button with Confirm/Cancel controls adjacent to the event. Target identity is conveyed through nearby content or generic wording, not a dialog accessible name.

Confirmations have no `dialog`/`alertdialog` role, labeled group, focus transfer, focus containment, Escape cancellation, or opener restoration. Setup confirmation state partly targets collection indices; manual deletion targets stable ID. Collapsing/unmounting can silently dismiss local confirmations. They are not accessibility dead ends because Tab can reach their buttons, but continuity is browser-dependent.

## Disclosure Accessibility Assessment

Setup section toggles are native buttons with exact dynamic names, `aria-expanded`, and `aria-controls`. Collapsed content is `display:none` and `aria-hidden=true`, removing descendants from focus order. Expand All/Collapse All set all section booleans but do not expose a collective pressed/mixed state or announce completion. If focus is inside a section when another control collapses it, no focus restoration occurs.

Repeated friction uses native `<details>/<summary>`, providing a strong semantic baseline and native expanded state. Conditional form fields are inserted/removed based on selections but are not announced or focused.

## Compact Preview and Calendar Input Assessment

Compact dates are the strongest custom interaction. Each is a native button with a full-date accessible name. The name adds “selected day,” “selected range start/end/range,” “today,” and “has friction”; `aria-pressed` exposes inclusion and `aria-current="date"` exposes today. These semantics are directly tested.

Range selection uses successive activations rather than arrow-key calendar semantics. Each date occupies the normal Tab order; no roving index or application key handling exists. The first activation is exposed as a selected day, but the pending expectation that a second distinct date will form a range is not separately described. Opening Calendar Day inserts an editor but leaves focus on the date button; Close removes its own focused control without returning to that date.

## DayVisualizer Accessibility Assessment

`DayVisualizer` is DOM-based, not canvas/SVG. It is a labeled read-only section. Hour ticks/lines are `aria-hidden`; each positioned block is an `<article>` with an accessible name containing kind, title, and original time range. Blocks are generated in chronological start order with work before scheduled/manual ties. Preview also renders textual Work, Scheduled, Manual, Unplaced, and Friction sections.

Visual vertical position/height encode clipped placement and duration; horizontal lanes and styling encode overlap; these relations are not present in article names. The name does not state overlap, clipping at the user-day boundary, lane, or duration quantity. Textual lists provide title/time/source but not every spatial relationship. Thus basic schedule content has a nonvisual equivalent, while overlap and visual temporal topology have **Confirmed — Visual Dependency**.

## Friction and Recommendation Accessibility Assessment

Friction title/message and suggested fix labels are text in lists. Repeated patterns use native disclosures and occurrence date text. Recommendation controls are buttons and keyboard-reachable. Severity totals are textual in Preview summary, so severity is not solely color-coded; individual friction rows do not programmatically bind severity/message/fix as a named group.

Stale state is textual. Applying a fix replaces the proposal and inserts action feedback, but no live announcement or focus continuation exists; the activated fix may disappear. No-fix guidance is textual and keyboard-readable, though recovery is manual. Recommendation identity is preserved in handlers but not exposed as an accessible relationship.

## Color-Independent Meaning Matrix

| Meaning | Visual encoding | Nonvisual/textual equivalent | Finding |
|---|---|---|---|
| Dirty/saved/error/success | Color classes | Explicit message text | Color independent |
| Preview stale/warnings | Danger/warning color | Explicit text/list | Color independent |
| Selected date/range | Background/borders/shape | Dynamic name + `aria-pressed` | Color independent |
| Today | Dot/shadow | `aria-current` + “today” name | Color independent |
| Friction date | Danger border/marker | “has friction” in name | Color independent |
| Work/generated/manual kind | Distinct block colors | Article name kind + textual group/source | Largely color independent |
| Timeline overlap | Lane/outline/shadow | No overlap description | **Visual Dependency** |
| Disabled state | Native disabled styling/behavior where present | Native state | Browser-dependent |

## Contrast and Readability Evidence

The stylesheet defines light/dark semantic variables and uses explicit text colors. Muted, success, danger, selected, placeholder/browser, mixed `color-mix`, transparency, gradients, and backdrop-filter combinations require rendered computed-color measurement. No such measurement or accessibility tooling exists in the test suite. Therefore no WCAG contrast pass/fail claim is made.

Potential measurement-sensitive areas are muted text, active-nav detail text mixed with transparency, compact selected-day text, warning text created by `color-mix`, timeline blocks, and focus rings over gradient surfaces. The code does not itself establish failure.

## Focus Visibility Assessment

Primary/nav/secondary/danger/fix buttons, field inputs/selects/textareas, and compact dates have explicit accent outlines with offset. No rule removes outlines globally. Other native focusable elements retain browser defaults. This is a meaningful foundation, but consistency across checkbox, summary, file input, and all browsers is **Browser/Assistive-Technology Dependent**.

## Touch and Pointer Assessment

All essential actions use click handlers on native controls. Browsers map mouse, touch, Enter, and Space activation to these elements. No hover-only disclosure, right-click, double-click, long-press, drag, pointer coordinate, or touch-specific essential action was found. Hover transforms are decorative. Compact date controls have CSS minimum sizes (`58×76px`, `52px` minimum width at narrow viewport), but no compliance claim is made without rendered measurement.

## Universal Interaction Language Assessment

| Approved interaction | Executable implementation | Classification |
|---|---|---|
| Single tap primary action | `onClick` on explicit native buttons | **Implemented / Modality Equivalent** through standard activation |
| Long press for context | No context-menu, pointer timer, or touch handler | **Not Found — absent** |
| Double tap for details | No `onDoubleClick` or gesture handler | **Not Found — absent** |

Explicit Edit/Delete/Open controls structurally replace hidden context/detail gestures for implemented workflows. Alignment with the specified gesture language is absent; essential outcomes remain available through explicit controls.

## Motion and Reduced-Motion Assessment

Buttons and compact dates use 120ms background/border/color/transform transitions, with a one-pixel hover lift. Fixed-time recovery uses `scrollIntoView({behavior: "smooth"})`. No keyframes, JavaScript animation loop, loading animation, or motion-dependent operation was found. No `prefers-reduced-motion` query was found. Motion is nonessential but cannot be application-reduced.

## Zoom, Text Scaling, and Reflow Foundations

Grid/flex layouts wrap and use responsive media queries. Inputs use inherited fonts; major columns use `minmax`; narrow navigation collapses to one column. These are positive reflow foundations.

The timeline has a fixed 720px/640px minimum height, absolute-positioned blocks, `overflow:hidden`, and ellipsis/nowrap for most block text. Text scaling can therefore clip visualizer labels or alter content density without changing block geometry. Sticky action/section bars may overlap content at enlarged zoom depending on viewport. The implementation provides textual lists outside the timeline, mitigating but not eliminating visualizer reflow dependency. Browser zoom behavior is untested.

## Cognitive Accessibility Assessment

Executable strengths include consistent native controls, visible labels, progressive disclosure, persistent Setup draft through navigation, explicit dirty/saved/stale states, destructive confirmation, text explanations, and focused fixed-time recovery. No interaction is time-limited.

Implementation-based risks include the long form and repeated generic names, utilities preceding planning in DOM/tab order, aggregate Save/Generate scope, blocked Generate after implicit Save, unannounced state changes, manual no-fix recovery, absent undo, and focus/context loss after replacement. Whether these produce cognitive difficulty requires observational research.

## Native Control Reliance Assessment

DayFrame relies on native button, input, select, checkbox, date, time, file, textarea, fieldset/legend, and details/summary behavior. This supplies most focusability, activation, value state, picker, grouping, and disclosure semantics. It does not supply aggregate focus movement, live status, error association, record-specific accessible names, replacement continuity, or lifecycle accessibility. Native controls make workflows locally operable; they do not constitute a complete accessibility architecture.

## Accessibility Continuity Scenarios

| Scenario | Keyboard/semantic path | Focus/announcement result | Determination |
|---|---|---|---|
| Initial Setup edit/Save | Tab through native controls; activate Save | Save result visible only; focus normally stays on Save | Reachable; unannounced |
| Generate success | Activate native nav button | Button/screen content changes; heading/result not focused/announced | **Focus Loss Risk; Status Visible Only** |
| Blocked Generate/correction | Activate Generate; guardrail inserted; navigate Setup/forms | Error not focused/announced/associated | Reachable but continuity partial |
| Preview review/Regenerate | Heading/list reading + native button | Replacement not announced; trigger may remain | Reachable; focus browser-dependent |
| Compact date/range | Tab to each date; Enter/Space successive dates | Selection semantics update; Calendar Day not focused | Strong state semantics; inefficient/unmanaged entry |
| Calendar Day event create | Date activation → traverse earlier DOM to editor controls → Save | Editor insertion/save not announced; no entry focus | Reachable; continuity partial |
| Event delete/cancel | Activate Delete → Tab to inserted buttons | Trigger removed; no focus transfer/Escape/restore | Reachable; **Focus Loss Risk** |
| Fixed-time correction | Fix button → exact Setup field focused | Target focus asserted; no status announcement | **Accessibility Continuity** exemplar |
| Suggested fix | Activate button | Preview changes; trigger may disappear; feedback visible only | **Focus Loss Risk** |
| Profile load from Preview | Native button in persistent shell | Preview removed; Setup not focused; editor context may survive | **Focus Orphaned risk** |
| Invalid import | File picker/input → invalid file | Error visible only; file input relationship absent | Retry reachable, unannounced |
| Valid import with Calendar Day | Native file input | Authority/Preview replaced; old editor can remain | **Accessibility context orphan** |
| Clear from Preview | Clear → Tab to inline Confirm → activate | Setup replaces Preview; completion not focused/announced | Reachable; restoration absent |
| Collapse focused Setup section | Activate Collapse All/section toggle from elsewhere | Focused descendant removed; no restoration | **Focus Loss Risk** |
| Delete focused Setup record | Inline confirmation + Confirm | Record/focused controls removed; no next focus | **Focus Loss Risk** |
| Replace focused friction | Activate fix/regenerate | Occurrence may be removed | **Focus Loss Risk** |
| DayVisualizer without vision | Read labeled articles and following textual lists | Basic kind/title/time available; overlap topology absent | **Modality Partial / Visual Dependency** |
| Utility workflows without pointer | Native buttons/input/file picker | Outcomes possible; picker/browser and focus continuity untested | Browser-dependent completion |

## Teach Accessibility Assessment

Teach is broadly keyboard-operable through native structured forms, headings, disclosures, labels, checkboxes, selects, and buttons. Draft/saved feedback is visible, destructive actions are confirmed, and entered Setup data survives ordinary navigation. Its limitations are generic repeated names, partial programmatic grouping, unassociated errors, no Save announcement, no focus management for dynamic collection addition/deletion/collapse, and no replacement protection/restoration for focused or dirty records.

**Determination: Confirmed — locally operable and semantically substantial, with partial application-owned continuity.**

## Plan Accessibility Assessment

Plan provides textual proposal metadata, day/list structure, stale/range/friction messages, fix buttons, compact date state semantics, and labeled visualizer articles. Preview can be read and operated without pointer. Limitations are two-level destination headings, unannounced generation/revision/staleness, no focus entry/restoration, sequential-Tab rather than calendar-key range navigation, visual-only overlap topology, and focus loss when recommendations/results are replaced.

**Determination: Confirmed — semantic and keyboard foundation present; focus, announcement, and temporal-relationship governance incomplete.**

## Live and Learn Accessibility Assessments

No active schedule, start/complete/skip/delay interaction, actual-time state, history, reflection, learned pattern, or corresponding accessible control/status exists.

**Not Found — Live Accessibility Not Implemented.**  
**Not Found — Learn Accessibility Not Implemented.**

Preview, friction grouping, generated/revised timestamps, and DayVisualizer remain proposal representations and are not mislabeled as accessible execution or learned evidence.

## Structural Findings

1. **Confirmed — Native Semantic Baseline:** nearly all executable actions use native controls.
2. **Confirmed — Native Keyboard Operability:** essential outcomes have nonpointer control paths; direct keyboard test evidence is sparse.
3. **Confirmed — Application-Owned Accessibility:** navigation/date/disclosure states and fixed-time focus are explicitly encoded.
4. **Confirmed — Focus continuity is not an aggregate responsibility:** one focus handoff exists; entry, restoration, replacement, and error focus are otherwise absent.
5. **Confirmed — Status Visible Only:** no live-region, alert, or focus announcement system exists.
6. **Confirmed — Error Unassociated:** guardrail/profile/import errors have no input relationship or invalid state.
7. **Confirmed — Semantic Integrity partial:** repeated fields and row actions have accessible names but limited record context.
8. **Confirmed — Modality Equivalent for primary controls:** no essential pointer-only handlers found.
9. **Confirmed — Visual Dependency partial:** timeline overlap/spatial topology lacks a programmatic equivalent.
10. **Confirmed — Accessibility continuity inherits Phase 10 aggregate replacement gaps.**

## Experiential Findings

- Selecting “Review fixed time” moves focus to the exact matching Setup input.
- Generating, blocking, revising, importing, loading, clearing, saving, and deleting change visible DOM without an application-owned announcement.
- Opening Calendar Day leaves focus on the date button rather than entering the newly inserted editor.
- Closing Calendar Day removes the Close button without restoring focus to the originating date.
- A day button communicates selection position, today, and friction through its accessible name and ARIA state.
- Applying a fix can remove the focused fix button when Preview is replaced.
- Collapsing a Setup section can remove a focused descendant from the document.
- Timeline block kind/title/time are exposed nonvisually, while overlap/lane geometry is not.
- Profile/import/clear can replace domain authority while the old Calendar Day editor remains rendered and operable.

Whether these consequences affect comprehension, efficiency, or successful assistive-technology use is **Observational Research Required**.

## Behavioral Invariants

- Essential user mutations are triggered by native controls, not arbitrary clickable containers.
- Compact date selection always updates both visual classes and programmatic pressed/name state.
- Today uses both accessible current state and visual styling.
- Collapsed Setup content uses `display:none` and leaves the tab order.
- Fixed-time correction focuses by stable template ID.
- No other transition intentionally moves or restores focus.
- Dynamic status/error text has no live-region/alert role.
- No app-level keyboard, gesture, drag, or Escape handling exists.
- Preview content always has textual structures in addition to visual timeline placement.
- Live and Learn expose no controls because their domain environments are absent.

## Architectural Gaps

- aggregate focus ownership, entry, restoration, and replacement handling;
- programmatic status and alert announcement;
- error-to-control association and invalid state;
- record-specific names for repeated editors and row actions;
- comprehensive programmatic grouping/descriptions;
- accessible timeline overlap and boundary relationships;
- explicit focus behavior for confirmations, dynamic collections, Calendar Day, and disclosure collapse;
- reduced-motion handling for transitions/smooth scroll;
- keyboard/AT automated coverage and automated accessibility analysis;
- Live and Learn accessibility, because those environments are not implemented.

These findings do not constitute a redesign roadmap or compliance determination.

## Cross-Phase Convergence

| Prior finding | Phase 11 evidence | Determination |
|---|---|---|
| Phase 3: shell utilities and workflow coexist persistently | Utilities precede nav/destination in DOM and tab order | Refined into persistent traversal interruption |
| Phase 4: navigation preserves context but is not lifecycle | Native pressed buttons change screen; no destination focus/announcement | Confirmed semantically, accessibility continuity partial |
| Phase 6: interactions use consistent explicit controls | Native buttons/fields dominate; no pointer-only cards/gestures | Confirmed as strong native keyboard foundation |
| Phase 6/7: Setup is dense and progressively disclosed | Accessible disclosure state exists; repeated fields have generic context | Refined: progressive disclosure strong, form relationships partial |
| Phase 7/9: fixed-time correction is strongest contextual recovery | Stable template ID drives exact focus and scroll | Confirmed as sole focus-continuity exemplar |
| Phase 7/10: Generate is compound and commits before guardrail | Guardrail appears after navigation/commit without focus or announcement | Refined into accessibility discontinuity |
| Phase 8: shell state is distributed | Focus/editor/confirmation ownership is likewise distributed | Confirmed; no aggregate accessibility coordinator |
| Phase 9: feedback is stronger than recovery | Feedback is textual but not announced or field-associated | Refined: visual feedback exceeds AT communication |
| Phase 10: profile/import/clear partially reconcile shell context | Calendar Day editor and possible focus survive authority replacement | Confirmed as orphaned accessibility context |
| Phases 8–10: authored/generated distinction remains explicit | Setup/Preview headings, stale text, proposal language, and block-kind names preserve distinction | Confirmed — Epistemically Aligned semantics |

No executable accessibility evidence contradicts the inspected Phase 1–10 findings.

## Coverage Assessment

**Directly Tested:** role/name discovery for major controls and headings; nav `aria-pressed`; Setup disclosure `aria-expanded`; compact-day names, `aria-pressed`, and `aria-current`; labeled fields; fixed-time focus; DayVisualizer label and block text; conditional visibility.

**Partially Tested:** nearly all workflows are exercised through `fireEvent.click`/`change`, which proves handler reachability by queried semantic controls but not actual Tab traversal, key activation, focus continuity, announcements, or AT behavior.

**Implementation-Confirmed:** native element types, label/fieldset structures, DOM/tab order, absence of pointer-specific handlers, absence of live regions, focus inventory, CSS focus styling, motion/reflow rules, visualizer semantics, and lifecycle absence.

**Browser/Assistive-Technology Dependent:** native Enter/Space/arrow/file-picker/details behavior, focus fallback after removal, browser validation announcements, screen-reader reading order, zoom/reflow, touch exploration, and actual computed accessibility tree.

No `userEvent.keyboard`, Tab traversal, Enter/Space/Escape tests, live-region assertions, axe integration, or screen-reader-specific tooling was found in the package/tests.

**Observational Research Required:** long-form traversal, label comprehension, timeline interpretation, focus perception, replacement recovery, and use with screen readers, switch control, voice input, magnification, or touch exploration.

## Open Questions

Executable inspection cannot establish:

- actual browser/screen-reader output and focus fallback across supported combinations;
- rendered contrast ratios for dynamic `color-mix`, gradients, dark mode, and browser-native controls;
- practical reflow at browser zoom/text-scaling settings;
- file-picker operation with specific assistive technologies;
- whether repeated generic names provide sufficient context in real screen-reader navigation;
- whether users recognize inserted status and replacement outcomes without announcements;
- accessibility of future Live and Learn environments.

## Final Architectural Determination

**Strong Native Foundation with Partial Application Governance.**

DayFrame currently possesses meaningful accessibility and input structure beyond accidental markup: native controls dominate, important regions and groups have semantics, custom compact dates expose rich accessible state, disclosures are programmatically represented, visible proposal information is largely textual, and fixed-time correction implements precise focus continuity.

It does not yet possess coherent aggregate accessibility governance. Focus is usually left to browser fallback; dynamic changes are visible but not announced; errors are not associated; repeated form controls lack full record context; inline confirmations and replacement transitions do not manage focus; and timeline overlap remains visually encoded. Accessibility therefore remains locally operable and semantically substantial while continuity across validation, replacement, recovery, and generated-state transitions is incomplete.

This is not a compliance certification. Exact standards conformance and real assistive-technology usability require criterion-specific measurement and user/tool testing beyond the executable evidence audited here.
