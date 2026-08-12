# UX Implementation Alignment Audit 01

## Phase 12 — Responsive and Platform Architecture

**Normative source:** `docs/architecture/DayFrame_Interaction_Architecture_Specification.md`, especially Chapter VI — Surface Architecture, Chapter VIII — Navigation Architecture, Chapter IX — Interaction Patterns, Chapter X — Visual Philosophy, Chapter XI — Accessibility, Chapter XII — Future Expansion, and the architectural principles governing platform independence, context preservation, visual clarity, progressive disclosure, and interaction consistency  
**Implementation scope:** `code/src/**`  
**Method:** Executable implementation, rendered structure, stylesheets, automated tests, and supported platform configuration only  
**Audit date:** 2026-07-31

## Executive Findings

DayFrame is a **Single-Platform Architecture with Partial Responsive Adaptation**.

The only confirmed implementation platform is a client-side browser application built with React and Vite (`code/package.json`; `code/index.html`; `code/src/main.tsx`). The repository contains no PWA manifest, service worker, install configuration, native mobile/desktop wrapper, platform-specific source tree, device integration, or alternate platform entry point. Browser `localStorage`, native file input, `Blob`/object-URL download, DOM anchors, and browser-native date/time/select controls define the current platform boundary.

Responsive behavior is entirely CSS-driven. No `window.innerWidth`, `matchMedia`, resize/orientation listener, ResizeObserver, user-agent/device detection, or viewport-specific render branch was found. React renders one component tree and one workflow model for every viewport. Crossing breakpoints does not intentionally remount components, change state ownership, omit controls, alter handlers, or change workflow meaning.

The stylesheet has three media conditions:

1. `prefers-color-scheme: dark` replaces semantic color variables.
2. `min-width: 980px` makes the shell header a two-column grid.
3. `max-width: 720px` reduces outer/card padding, stacks primary navigation, slightly narrows compact date buttons and the timeline label column, and reduces the timeline minimum height from 720px to 640px (`dayFrameUi.css:17-30`, `:982-1027`).

These rules preserve content. Setup, Generate/Preview, Latest Preview, compact dates, Calendar Day, profiles, backup/import/export, clear, friction review, suggested fixes, and every implemented form/editor remain rendered through the same JSX and DOM order. There is no mobile-only destination, collapsed utility drawer, alternate navigation, touch-specific workflow, or viewport-dependent information omission.

The strongest responsive foundations are flexible grid/flex containers, wrapping action rows and compact dates, `minmax`-based form/summary/day-group columns, zero minimum widths on key grid children, reduced narrow-screen padding, native controls, progressive Setup disclosure, and a max-width shell rather than a fixed-width page. The viewport meta tag uses `width=device-width, initial-scale=1.0` and does not disable zoom (`index.html:5`).

The dominant limitation is that component existence is preserved more strongly than practical responsive hierarchy. Profiles, backup, import/export, clear controls, workflow summary, navigation, Latest Preview, and Calendar Day remain in the persistent shell before destination content. At wide width the two shell columns divide utilities from workflow context; below 980px all of them become one long vertical sequence without DOM reordering. At narrow widths the same utility density precedes Setup/Preview, increasing vertical distance while keeping architectural hierarchy unchanged only semantically.

Setup reflows from auto-fit multi-column grids toward single-column editing as available width falls. It does not hide fields. Progressive disclosure limits simultaneous density, and action/checkbox rows wrap. However, the Setup action bar remains sticky at `top:12px`, each section header remains sticky at `top:94px`, and both retain z-index/backdrop layers at every width. Enlarged text, browser chrome, or a soft keyboard can reduce the remaining viewport and create overlapping persistent layers; no safe-area or soft-keyboard adaptation exists.

Preview content is mostly fluid and textual. Summary metrics and day subgroups auto-fit, messages/lists wrap, recommendation actions flex-wrap, and compact dates form a wrapped list rather than an overflow strip. Selection, range, today, and friction semantics survive wrapping. A visual range connector uses absolute pseudo-elements extending between adjacent buttons; when dates wrap onto new lines, that connector geometry can no longer express one continuous horizontal range, although button ARIA labels and pressed states preserve semantic selection.

`DayVisualizer` is the clearest viewport dependency. Its temporal model remains a fixed 24-hour vertical track with absolute percentage-positioned blocks. Narrow CSS changes only the hour-label column from 56px to 46px and track minimum height from 720px to 640px. Block lanes compress into the remaining width; most block text uses `overflow:hidden`, ellipsis, and `white-space:nowrap`; the track itself uses `overflow:hidden`. There is no horizontal scroll or alternate narrow timeline. Textual Preview lists preserve titles, times, source categories, and friction, but overlap lanes, duration geometry, and clipped user-day-boundary relationships remain visually compressed.

Touch reachability is structurally present because essential actions use native buttons/inputs and click handlers, with no hover-only essential information, drag, right-click, long-press, or precise timeline interaction. Compact date buttons declare minimum dimensions and action rows use gaps. No `pointer:coarse`, `hover:none`, touch-specific styles, target expansion, gesture handler, or platform-specific input layer exists; practical touch sizing requires rendered measurement.

Viewport change preserves React-owned current screen, Setup draft, dirty state, Preview, selection, Calendar Day/editor, focus target, disclosures, and confirmations because CSS changes do not replace the component tree. This is **Responsive Continuity at the state layer**. Scroll position, sticky obstruction, soft-keyboard effects, visual reading position, and focus visibility are not application-governed. Orientation and zoom produce layout-engine reflow only.

The application follows several platform conventions: system light/dark preference, native date/time/select/file controls, native button activation, browser download, and local storage. It does not use URL/history navigation, Back integration, deep links, safe-area insets, reduced-motion preference, print styles, install/offline caching, or platform resume logic. Reload restores authored Setup/profiles only; Preview and all interaction context are runtime-only.

Live and Learn platform architecture are absent with those lifecycle environments. No mobile execution surface, widget, notification, native calendar integration, history/reflection surface, or alternate platform workflow exists.

## Supported Platform Inventory

| Platform/capability | Executable evidence | Classification |
|---|---|---|
| Modern web browser | Vite scripts, HTML root/module entry, React DOM render | **Confirmed supported implementation** |
| Desktop browser | Same browser build; ≥980px layout branch | **Confirmed presentation condition**, not separate platform |
| Tablet/mobile browser | Viewport meta; ≤720px CSS; native controls | **Platform Partial**; render path exists, practical device use untested |
| Installed PWA | No manifest, service worker, install metadata | **Not Found — Not Implemented** |
| Offline cached application | No service worker/cache layer | **Not Found**; already-loaded runtime behavior is browser-dependent |
| Electron/desktop wrapper | No wrapper/config/platform entry | **Not Found** |
| Android/iOS wrapper/native app | No platform directory or dependency | **Not Found** |
| Wearable/widget | No implementation | **Not Found** |
| Local browser persistence | `localStorage` authored/profile keys | **Confirmed — Browser Dependency** |
| File interchange | native file input and JSON Blob download | **Confirmed — Browser/Platform Dependent** |

## Viewport and Document Configuration Assessment

`index.html` declares UTF-8, `lang="en"`, and `<meta name="viewport" content="width=device-width, initial-scale=1.0">`. No `maximum-scale`, `minimum-scale`, or `user-scalable=no` restriction exists. The root/body have no fixed page width; `.df-app` uses `min-height:100vh` and padding, while `.df-shell` is centered at `max-width:1180px` (`dayFrameUi.css:1-64`).

No global `overflow-x` suppression, minimum body width, orientation lock, viewport-unit width, or safe-area `env()` inset exists. Document-level horizontal overflow is therefore not intentionally hidden, but platform notches/browser chrome receive no explicit accommodation. `100vh` only establishes minimum page height; content can extend vertically.

## Breakpoint Inventory

| Condition | Changed selectors/properties | Architectural effect | Coverage |
|---|---|---|---|
| `prefers-color-scheme: dark` | root palette and `color-scheme` | Appearance only; content/meaning unchanged | **Implementation-Confirmed**, not tested |
| `min-width:980px` | shell header becomes `360px/420px` minimum two-column grid; workflow panel fills column | Utilities and workflow context appear side by side | **Responsive Reflow**, not tested |
| `max-width:720px` | smaller page/card padding/radii; nav one column; compact header rule; date minimum width/padding reduced; visualizer label column/height reduced | Same content vertically compressed/stacked | **Responsive Reflow**, not tested |

No container, orientation, pointer, hover-capability, reduced-motion, print, resolution/density, forced-colors, or contrast media query was found.

## Responsive Render-Tree Assessment

The render tree does not consult viewport or platform state. CSS changes layout only. Component order, semantic roles, controlled state, event handlers, form data, current screen, Preview authority, and conditional workflow content remain identical. There is no **Alternate Render Architecture** or runtime **Adaptive Layout**.

This produces strong semantic equivalence: resize cannot itself discard a draft, selection, editor, confirmation, or Preview. It also means no platform-specific composition resolves shell density, timeline compression, sticky obstruction, or touch input differences.

## Application Shell Assessment

The shell is capped at 1180px and uses a grid with 20px gaps. Its header contains a grid whose first DOM child is the profile/data utility section and whose second is the brand/workspace/nav/Latest Preview/Calendar Day workflow panel (`DayFrameApp.tsx:437-1045`).

At ≥980px the two children are side by side. Below 980px the grid defaults to one column, retaining utility-first DOM/visual order. Flex/grid descendants wrap and declare `min-width:0` in relevant panels, reducing intrinsic overflow. Nothing is hidden or moved into an alternate container. Long narrow documents can therefore contain the complete utility region before primary destination navigation and destination content.

**Confirmed — Content Preserved; hierarchy reflowed rather than adapted.**

## Primary Navigation Assessment

Primary navigation is two equal columns by default and one column below 720px. Buttons retain titles, explanatory detail, pressed state, handler, order, padding, and full width. Labels can wrap because no nowrap rule applies. Setup and Generate remain distinct, and Open Full Preview remains in Latest Preview when a proposal exists.

At widths 721–979px navigation stays two columns within a single-column shell; at ≤720px it stacks. No controls disappear. This is a clear **Responsive Reflow** with **Platform Equivalent** semantic outcome.

## Utility Region Assessment

Profile input, Save, profile rows, Load/Delete, Export/Import/Clear, file input, messages, and confirmation remain rendered at all widths. Action rows use flex-wrap and gaps. The shell/card padding reduces below 720px. No profile-name word-break, overflow-wrap, or explicit truncation rule exists; long unbroken names/timestamps can expand or wrap according to normal inline behavior and available break opportunities. Native file-control rendering varies by browser/OS.

The utility region is never demoted, collapsed, reordered, or conditionally hidden. At narrow widths it remains the first major shell content and can become a large vertical prelude to planning controls. Destructive styling and confirmation text persist.

## Setup Responsive Assessment

Setup sections use `.df-grid {grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}`. They naturally reduce column count and reach one column when the content area cannot fit two 220px tracks. Inputs use `width:100%`; field containers have `min-width:0`. Checkbox/action containers flex-wrap. Record cards use fluid width and reduce padding below 720px.

All schedule preferences, range, shift, cycle/segment/sequence, template, recurrence, and confirmation controls remain present when their disclosures/conditions are open. No responsive omission or alternate editing sequence exists. Progressive disclosure state is React-owned and unaffected by width.

The 220px minimum track, nested cards/fieldsets, long labels, and repeated action groups impose minimum practical density; very narrow effective viewports rely on grid shrinking to one column and native control sizing. The code has no horizontal scroll container or narrow-specific record treatment.

## Sticky Interface Assessment

Two persistent layers apply at every width:

- Setup action bar: `position:sticky; top:12px; z-index:4`.
- Each Setup section header: `position:sticky; top:94px; z-index:2`.

Both use translucent backgrounds/backdrop blur. No narrow/zoom override changes offsets or disables nesting. Wrapped action-bar content can become taller while section headers retain the fixed 94px offset, creating potential overlap or hidden focus/content under the first sticky layer. Browser chrome, display cutouts, soft keyboards, and safe-area insets are not included in offsets. No fixed-position region or nested scroll container exists; sticky behavior operates in the document scroll.

**Inferred — Viewport Dependency and overlap risk; rendered-browser measurement required.**

## Preview Responsive Assessment

Preview uses fluid vertical layout. Summary metrics use `repeat(auto-fit,minmax(180px,1fr))`; day subgroups use `minmax(220px,1fr)`; fix/action rows wrap; lists and warning text use ordinary wrapping. Day cards reduce padding below 720px. No Preview metadata, friction, unplaced candidate, recommendation, day, or empty state is hidden at a breakpoint.

Long Preview ranges create additional day cards and visualizers in the single document rather than virtualization or nested scrolling. Repeated friction remains native disclosure content. Responsive behavior preserves proposal meaning but may increase vertical density and reading distance.

## Compact Latest Preview Assessment

Compact dates live in a flex-wrap container, so they form a responsive wrapped list—not a fixed calendar grid or horizontal overflow strip. Buttons preserve DOM/chronological order and declare minimum sizes (`58×76px`, `52px` minimum width below 720px). Selection/current/friction information remains in accessible names and ARIA state.

Range background connectors are absolute pseudo-elements that extend 9px beyond button edges. They assume horizontal adjacency. A wrapped range can split across rows, producing visually discontinuous or misleading connectors, while start/middle/end classes and accessible labels remain correct. There is no row-aware recomputation or horizontal scrolling.

## Calendar Day Responsive Assessment

Calendar Day remains in the shell workflow panel above destination content. Its form uses the same 220px auto-fit grid; summary day groups also auto-fit; action rows and event actions wrap. At narrow widths fields become sequential and remain native/full-width. Conditional timed fields remain present when needed.

No clipping rule targets Calendar Day. Its editor, existing-event list, confirmations, and Preview summary remain vertically cumulative. Because it follows Latest Preview and persistent utilities, narrow viewports place it within a long shell sequence. Phase 10/11 replacement and focus-context issues do not change at breakpoints.

## DayVisualizer Responsive Assessment

The visualizer keeps a 24-row temporal track with absolute-positioned blocks. Wide/default geometry uses a 56px label column and 720px minimum track height. At ≤720px it uses 46px and 640px. Temporal percentages, overlap lane calculation, and block content do not change (`DayVisualizer.tsx:37-103`; `dayFrameUi.css:520-631`, `:1021-1027`).

There is no horizontal overflow/scroll on the track; it uses `overflow:hidden`. As width narrows, overlap lanes divide the remaining width. Most blocks clip and ellipsize title/time on one line; blocks ≤75 minutes switch to normal wrapping/visible overflow within an absolutely sized block. Absolute geometry does not expand for enlarged text. Hour labels remain a fixed narrow column and are hidden from assistive technology.

The temporal model is preserved, not adapted. Textual Work/Scheduled/Manual lists below the visualizer preserve basic information when the geometric view is compressed, but not overlap/lane/boundary topology. This is **Confirmed — Content Compressed and Content Truncated**, with no responsive dead end because the visualizer is read-only.

## Horizontal Overflow Assessment

No explicit `overflow-x:auto` region exists. Flexible grids use `minmax(0,1fr)` or `min-width:0` in key areas, and action/date containers wrap. This reduces page expansion.

Known clipping is deliberate inside the visualizer: the track and blocks hide overflow, and text uses ellipsis/nowrap. Absolute range connectors extend outside date buttons but remain within a wrapping container without scroll behavior. Long unbroken user content (profile/event/template names), browser-native file controls, nested 220px grid tracks, and sticky children may still expand narrow documents; no global `overflow-wrap:anywhere` or word-break rule exists. Whether document-level horizontal overflow occurs requires rendered content testing.

## Vertical Density and Scroll Assessment

All content participates in one document scroll. There are no nested vertical scroll panes. Vertical extent can include the full utility shell, compact preview, Calendar Day editor, Setup records, repeated Preview days, and one 640/720px visualizer per visible day. Expanded long-range Preview therefore grows linearly with days.

Browser scroll position is not deliberately reset or preserved on screen navigation, generation, replacement, or resize. Fixed-time correction is the sole explicit scroll operation and uses smooth centering. Sticky layers persist during Setup scrolling. Responsive narrowing increases wrapping and therefore total document height without changing content order.

## Text Wrapping and Truncation Assessment

Most text, headings, labels, buttons, warnings, profile rows, lists, and timestamps use normal wrapping. No line clamp or general ellipsis applies. Visualizer blocks are the exception: `overflow:hidden`, `text-overflow:ellipsis`, and `white-space:nowrap`; compact blocks switch to wrapping/visible text. Absolute block height remains time-derived, so wrapped compact content can visually escape or overlap its geometry.

There is no global hyphenation or long-word breaking. Unbroken IDs/user-entered strings can create intrinsic expansion. Date buttons use short weekday/day-number text and fixed minimum dimensions; their accessible labels are not visually rendered.

## Zoom and Text Scaling Assessment

Zoom is not restricted. Fluid grids and wrapping support reflow as the effective viewport shrinks. Vulnerabilities are the fixed visualizer geometry, 46/56px hour column, absolute blocks, clipping/ellipsis, two sticky top offsets, fixed minimum grid tracks, and native controls whose rendered minimum size varies.

At enlarged font sizes the action bar and section headers can gain height without changing their sticky relationship; visualizer text can outgrow time-derived block rectangles; the utility-first shell and long Preview become taller. No source evidence establishes a responsive dead end, but practical 200% zoom/text-scaling equivalence is untested.

## Touch and Coarse-Pointer Assessment

Essential interactions are native buttons, labels/checkboxes, inputs, selects, details, and file controls with click/change handlers. Hover effects are decorative. No drag, hover-only information, right-click, or precision interaction is required; the timeline is read-only. Compact dates have declared minimum CSS dimensions and an 8px gap; action/confirmation groups use 8–12px gaps; primary buttons use 10×14px padding.

No `pointer:coarse`, `hover:none`, touch-action, pointer-event adaptation, touch handler, or coarse-target override exists. Native pickers/soft keyboards provide platform behavior but vary. **Confirmed — Touch Reachable; Coarse-Pointer Partial.** No target-size conformance claim is made.

## Hover and Pointer-State Assessment

Buttons and compact dates use hover-only one-pixel translation/shadow. Cursor pointer is applied to button families/date/summary. Selected, current, conflict, disabled, and focus states do not depend on hover. No tooltip or essential content is hover-only. There are no active/pointer-down application states.

## Native Control Platform-Variance Assessment

Date, time, select, checkbox, file, details/summary, focus outline, and download interactions inherit browser/OS implementations. This supplies mobile pickers and platform conventions without custom code. It also means layout, keyboard presentation, file-source options, time/date formatting affordances, summary markers, focus appearance, and input dimensions may differ.

The implementation assumes `File`, `Blob`, `URL.createObjectURL`, DOM anchor download, and `localStorage` availability for complete utility behavior. Storage absence/failure is silently tolerated at runtime; export/download failures are not surfaced. No supported-browser matrix or polyfill layer was found.

## Browser Navigation and History Assessment

Setup, Preview, selection, and Calendar Day are React state, not URLs. No router, anchor destination, `history.pushState`, `popstate`, deep link, or browser/system Back integration exists. Back/swipe-back behavior is therefore browser-page navigation rather than in-app context reversal. Reload starts at Setup and discards runtime context.

This is **Confirmed — Browser Convention not integrated into application navigation**. It affects platform resume/navigation continuity but does not change with viewport.

## Reload and Resume Assessment

Reload/store recreation restores authored Setup and profiles from independent localStorage keys. Preview, screen, selected range/date, Calendar Day/editor, Setup draft beyond saved authority, focus target, disclosure state, confirmations, feedback, scroll, and focus are not persisted. A browser restart or mobile process eviction can therefore reconstruct authored data but not the current planning/review task.

Returning from the native file picker continues the same mounted async handler when the browser preserves the page; exact suspension/process behavior is platform-dependent. No visibility/page-lifecycle or resume listener exists.

## Orientation and Resize Continuity Assessment

No resize/orientation listener or component key depends on dimensions. Crossing 720/980px changes CSS only, so React state and DOM order persist. The visualizer does not recalculate its data/lane model from measured width; CSS narrows it. Focused elements remain the same DOM nodes unless unrelated workflow rendering changes.

Scroll position, sticky placement, visible context, and soft-keyboard interaction are browser/layout-engine outcomes. **Confirmed — Responsive Continuity for application state; visual/task continuity Browser/Platform Dependent.**

## Theme and Appearance Assessment

Light is declared by default; system dark preference swaps semantic CSS variables and sets `color-scheme:dark`, allowing native controls to follow the theme. No manual toggle or theme persistence exists. Theme changes affect appearance only, not state, content, DOM, or handler meaning. Gradients, `color-mix`, transparency, and backdrop filters depend on browser support; Phase 11 made no contrast certification.

## Reduced-Motion Platform Assessment

The application uses 120ms color/transform transitions and smooth scrolling for fixed-time correction. No `prefers-reduced-motion` condition exists. Functionality does not depend on motion, but system motion preference is not explicitly respected. This confirms Phase 11.

## Print and Export Presentation Assessment

No `@media print` or print-specific render path exists. Sticky controls, shell utilities, current disclosure visibility, and fixed timeline geometry therefore rely on browser print defaults. JSON backup export includes authored Setup only; it is data transfer, not a print/share presentation of Preview. Print quality is **Browser/Platform Dependent and untested**.

## Offline and Storage Platform Assessment

The application has no network client in audited source; schedule generation and UI behavior are local once assets load. However, no service worker/cache manifest establishes offline launch or asset availability. Persistence uses browser localStorage, subject to availability, quota, private-mode, origin, and eviction behavior. Profiles and authored state use separate keys; Preview is memory-only.

Current identity: **local-first browser runtime with browser-dependent persistence, not a confirmed offline-installable application**.

## Platform-Specific Accessibility Continuity

CSS breakpoints do not change headings, landmarks, label relationships, ARIA state, DOM/tab order, or native controls. Compact date semantics and textual Preview alternatives remain intact. This is semantic preservation.

Narrow/zoom conditions amplify Phase 11 gaps: utility-first tab/reading order becomes a longer vertical path, sticky layers can obscure focus, Calendar Day is farther from its opening date in document flow, visualizer labels/blocks compress, and dynamic feedback remains unannounced. Focus and scroll are not reconciled after resize or soft-keyboard changes.

## Workflow Equivalence Matrix

| Workflow | Wide viewport | Medium viewport | Narrow viewport | Platform dependency | Equivalent outcome / limitation |
|---|---|---|---|---|---|
| Setup edit/Save | Two-column shell; multi-column fields | Single shell; auto-fit fields | Stacked nav/mostly single-column fields | native inputs/soft keyboard | Same mutation; sticky/density practical behavior untested |
| Generate success | Nav and utilities may be side by side | Same controls stacked in shell | One-column nav; same Preview | browser scroll/focus | Same saved/generated authority |
| Blocked Generate | Guardrail in Preview | Same | Same, farther vertically from Setup fields | none beyond browser layout | Same partial commit/recovery |
| Preview review/Regenerate | Auto-fit metrics/day groups; 720px timeline | Same render; narrower lanes | Reduced padding/46px labels/640px timeline | layout/text rendering | Same data; visual timeline compressed |
| Compact day/range | Dates wrap as needed | More wrapping | Wrapped small buttons; range connectors can split rows | touch/button activation | Same semantic selection/outcome |
| Calendar Day CRUD | Form may use columns | Fewer columns | Sequential fields/actions | native date/time/soft keyboard | Same authored event/Preview regeneration |
| Friction/fix | Buttons/lists wrap | Same | Same; proposal replacement | native button/focus browser | Same proposal revision; focus continuity unchanged |
| Fixed-time correction | Focus + smooth centered scroll | Same | Same under smaller viewport/keyboard | browser smooth scroll | Same exact field target; visible position platform-dependent |
| Profile CRUD | Utility column | Full-width first shell region | Wrapped/stacked controls | localStorage | Same runtime result; density dominates early page |
| Import/export | Native file/download | Same | Mobile file-source/download conventions | strong browser/OS dependency | Intended JSON outcome; behavior not uniform/tested |
| Clear data | Inline confirmation wraps | Same | Same | localStorage removal | Same runtime reset; no Back/undo |

No workflow has a viewport-specific missing control or alternate state mutation in source. Practical overflow, touch, zoom, and soft-keyboard completion remain untested.

## Information-Preservation Matrix

| Information/action | Responsive result | Classification |
|---|---|---|
| Destination/nav/current state | Same buttons/headings/pressed state; nav stacks ≤720px | **Content Preserved / Responsive Reflow** |
| Setup draft/save status | Same state and text | Preserved; sticky position viewport-sensitive |
| Preview status/range/metadata | Auto-fit/wrapped | Preserved |
| Selected date/range/today/friction | Same buttons/ARIA; flex wraps | Semantically preserved; visual connector compressed |
| Work/generated/manual/unplaced/friction | Same textual sections | Preserved |
| Recommendations | Same wrapped buttons/messages | Preserved |
| Calendar Day controls | Auto-fit to sequential | Preserved |
| Profiles/data utilities | Same utility-first order | Preserved; narrow density increased |
| Destructive confirmation | Same inline text/buttons; wraps | Preserved |
| Timeline title/time | Absolute block text ellipsized/clipped | **Content Truncated visually; text list counterpart preserved** |
| Timeline overlap/topology | Lanes narrowed, no alternate description | **Content Compressed / Viewport Dependency** |

## Navigation Hierarchy Across Viewports

Wide visual hierarchy divides the shell into a utility column and workflow column. Medium/narrow hierarchy serializes both columns: utilities first, then brand/workspace/nav/Latest Preview/Calendar Day, then destination content. DOM and tab/reading order never change. At ≤720px the two primary nav buttons stack, but remain after utilities.

Thus responsive behavior preserves component existence and semantic primary navigation, while visual prominence and scroll distance change. Destructive utilities remain ahead of the planning destination at every width. There is no alternate compact navigation or hierarchy.

## Platform Architecture Alignment Matrix

| Principle | Evidence | Determination |
|---|---|---|
| Platform Respect | Native controls, system theme, viewport meta | **Confirmed Alignment**, limited to browser conventions |
| Platform Independence | Core scheduling/state not device-specific; UI relies on DOM/localStorage/file APIs | **Partially Implemented — Browser Dependency** |
| Stable interaction meaning | Same controls/handlers/state at all widths | **Confirmed Alignment** |
| Recognizable navigation | Same labeled nav; stacks narrow | **Confirmed Alignment** |
| Native accessibility | Native controls/semantics persist | **Partially Implemented**; Phase 11 governance gaps remain |
| Visual clarity through reflow | Flexible grids/wrapping; fixed visualizer/sticky risks | **Partially Implemented** |
| Future platforms extend model | No second platform implementation to evaluate | **Insufficient Evidence / Not Implemented** |
| Live/Learn platform support | No underlying lifecycle environments | **Not Implemented** |

## Structural Findings

1. **Confirmed — Single browser platform:** one React DOM entry and browser-only utilities.
2. **Confirmed — CSS-only Responsive Reflow:** viewport never changes render authority or workflow meaning.
3. **Confirmed — Content Preserved:** no breakpoint hides destinations, fields, utilities, or proposal information.
4. **Confirmed — Persistent shell hierarchy is not responsively reorganized:** utility-first DOM becomes a long narrow sequence.
5. **Confirmed — Setup uses strong fluid foundations:** auto-fit grids, wrapping, progressive disclosure, full-width controls.
6. **Confirmed — DayVisualizer has Viewport Dependency:** fixed vertical geometry, absolute lanes, clipping, and minimal narrow adaptation.
7. **Confirmed — Sticky interface is viewport-sensitive:** fixed offsets persist under wrap, zoom, and soft-keyboard constraints.
8. **Confirmed — Touch Reachable, Coarse-Pointer Partial:** no essential pointer-only action, no capability-specific adaptation.
9. **Confirmed — Responsive state continuity is strong:** CSS does not remount or reset React state.
10. **Confirmed — Platform/session continuity is partial:** localStorage restores authored data, not task context.

## Experiential Findings

- At widths below 980px, the utility and workflow shell columns become one vertical sequence without changing DOM order.
- At widths below 720px, navigation becomes one column and page/card padding decreases.
- Compact dates wrap onto additional rows; selected-range connector styling remains horizontally defined per button.
- Setup fields reduce column count while all controls remain available.
- Sticky Setup actions and section headers retain fixed top offsets at narrow widths.
- Every Preview day retains a 640px minimum timeline on narrow screens.
- Timeline lanes narrow with the container and block labels can ellipsize or clip.
- Orientation/resize preserves screen, draft, Preview, selection, editor, and disclosure state.
- Reload returns to Setup with persisted authored data but without Preview or interaction context.
- Mobile file selection, date/time pickers, downloads, storage, and focus rely on browser/OS behavior.

Whether these consequences support practical use on specific devices requires **Observational Research Required**.

## Behavioral Invariants

- Viewport size never changes React component selection or state mutation logic.
- No breakpoint removes an implemented destination or workflow control.
- DOM/reading/tab order remains utility-first across widths.
- Primary navigation stacks only below 720px.
- Shell becomes two columns only at 980px and above.
- Setup/summary/day-group grids auto-fit without viewport-specific JSX.
- Compact dates always wrap rather than horizontally scroll.
- DayVisualizer always uses a fixed 24-hour absolute-position model.
- Essential actions never require hover, drag, or gesture input.
- Theme follows system preference; motion preference is ignored.
- Browser history never represents in-app destination/context.
- Reload never restores Preview or shell interaction state.

## Architectural Gaps

- alternate/adaptive platform composition beyond CSS reflow;
- validated mobile/tablet/zoom/orientation behavior;
- coarse-pointer and soft-keyboard adaptation;
- safe-area/display-cutout handling;
- narrow/zoom-aware sticky-layer coordination;
- responsive timeline topology beyond compression;
- route/history/deep-link/Back continuity;
- PWA install, service-worker caching, and confirmed offline launch;
- reduced-motion and print presentation support;
- responsive/browser automation, device emulation, overflow, and visual-regression coverage;
- Live and Learn platform surfaces.

These are audit findings, not redesign recommendations.

## Cross-Phase Convergence

| Prior phase finding | Phase 12 evidence | Determination |
|---|---|---|
| Phase 3: Setup/Preview plus persistent shared shell | Same tree at every width; two columns serialize below 980px | Confirmed; no viewport-specific Surface ownership |
| Phase 3/5: utility density competes with planning hierarchy | Utility region remains first in narrow DOM/visual order | Refined into responsive vertical-density finding |
| Phase 4: navigation is stable and centralized | Same pressed buttons/handlers; stacks ≤720px | Confirmed as strong Responsive Reflow |
| Phase 5/7: Setup is configuration-dense | 220px auto-fit grids and disclosure preserve all fields | Confirmed; content preserved, practical density untested |
| Phase 7: workflows complete through Setup/Preview | No responsive branch changes sequences or mutations | Confirmed semantic workflow equivalence |
| Phase 8/10: React context has distributed owners | CSS resize preserves those states without reconciliation | Refined: state continuity strong, visual/scroll continuity ungoverned |
| Phase 10: replacement partially reconciles shell context | Breakpoints do not mitigate Calendar Day/editor orphaning | Confirmed across viewport sizes |
| Phase 9/11: feedback is visible but unannounced | Same DOM messages wrap; no responsive status adaptation | Confirmed; content preserved, accessibility governance unchanged |
| Phase 11: compact dates have strong semantics | ARIA survives wrapping even when connector geometry splits | Confirmed semantic strength; visual range continuity partial |
| Phase 11: DayVisualizer has visual dependency | Fixed track/absolute lanes/ellipsis compress at narrow width | Confirmed as principal viewport dependency |
| Prior platform-independence principle | Scheduling core is portable, but current shell/persistence/file behavior is browser-only | Refined: platform-neutral domain structure, single implemented platform |

No Phase 12 evidence contradicts the inspected Phase 1–11 findings.

## Coverage Assessment

**Directly Tested:** no test explicitly sets viewport width, evaluates media queries, resizes/orients the document, emulates a device/pointer, measures overflow, checks theme/reduced motion, or runs visual/browser regression.

**Partially Tested:** semantic workflows, controls, state preservation, visualizer data, file export/import, and persistence are tested in jsdom at one unmeasured layout. These tests establish platform-independent handler outcomes, not responsive presentation.

**Implementation-Confirmed:** viewport metadata, breakpoint rules, CSS-only render architecture, wrapping/grid behavior, fixed visualizer geometry, sticky positions, browser APIs, absence of routing/wrappers/service worker/safe-area/input queries, and persistence scope.

**Browser/Platform Dependent:** actual layout, native pickers/file chooser, Blob download, localStorage availability, dark-mode rendering, sticky behavior, soft keyboard, focus/scroll after rotation, print, and browser Back behavior.

No Playwright, Cypress, browser device emulation, screenshot comparison, viewport test, touch/pointer test, or responsive accessibility test was found.

**Observational Research Required:** practical reachability, density, scrolling, range interpretation after wrap, timeline readability, touch operation, orientation, zoom, and task continuity on real browsers/devices.

## Open Questions

Executable inspection cannot establish:

- the browser/device/version support contract;
- actual narrow-width overflow with long localized or user-authored content;
- sticky overlap under mobile browser chrome, soft keyboards, and enlarged text;
- compact range visual interpretation across wrapped rows;
- minimum practical timeline width and overlap-lane readability;
- localStorage/download/file behavior in private modes and embedded browsers;
- print output and offline launch behavior;
- how future platforms would carry accepted, Live, or Learn authority.

## Final Architectural Determination

**Single-Platform Architecture with Partial Responsive Adaptation.**

DayFrame preserves one browser-based planning model through meaningful CSS reflow. Every implemented destination, workflow, control, state distinction, and textual information structure remains present across breakpoints; flexible grids, wrapping, progressive disclosure, native controls, and unchanged React ownership provide strong semantic and state continuity.

The architecture does not implement platform-specific workflows or a broadly governed adaptive composition. Persistent utility density and DOM hierarchy remain unchanged on narrow screens; sticky layers retain fixed offsets; DayVisualizer compresses a fixed desktop-like temporal geometry; touch, soft keyboard, orientation, zoom, safe areas, Back navigation, install/offline behavior, and browser variance are not explicitly governed or validated.

The current implementation is therefore mobile-browser reachable in structure, not confirmed platform-equivalent in practical operation. It is neither a viewport-fragile architecture—because content and controls are broadly preserved—nor a coherent multi-platform architecture. It is one browser platform with partial responsive presentation and substantial dependence on CSS/browser defaults.
