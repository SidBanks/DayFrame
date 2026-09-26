# Task 9.18 — Planner / Summary Navigation Foundation V1 RESULT

## 1. Executive Summary

Implemented the bounded navigation foundation: Planner and Summary are the only primary destinations. Planner opens Calendar on the canonical current DayFrame day and exposes Calendar, My Schedule, Goals, and Review Plan. Today is a Planner shortcut to the retained published-authority surface. Existing semantic owners, command paths, persistence formats, and protection rules remain unchanged.

The full regression suite passes (146 files / 1,475 tests). Production touch/keyboard checks pass at 320, 390, 768, and 1,280 px. The initial gzip bundle remains below the unchanged 170,000-byte limit; final measurements are recorded in §60. This is a compatibility shell, not the final Day Worksurface or Summary convergence.

## 2. Scope and Governing Constraints

Task 9.18 and the accepted Task 9.17 product/authority contracts govern this slice. Changes are limited to UI navigation, mount ownership, presentation state, scoped responsive CSS, navigation regression tests, and this result. No schema, domain type, storage migration, command semantics, dependency, router, publication policy, or execution policy changed.

G1 selected-day evidence and G2 accepted-planning lineage are deferred. General HistoricalPlan recovery, full Sleep authoring, generic past reporting integration, recurring Demand, found time, and final mobile child redesign are not claimed. No commit or push was made.

## 3. Pre-Task Repository State

The repository was already substantially dirty at HEAD `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Tasks 9.9–9.17 core/state/UI work, architecture documents, untracked Sleep modules, task specifications/results, and the dogfood findings PDF were present before this task. A 932-file content/hash baseline and original Git status were captured in `/tmp/dayframe-918-baseline/` before implementation.

Baseline validation: 145 test files / 1,470 tests passed. Production build and bundle gate passed. Baseline metrics: initial raw 645,745; initial gzip 168,185; largest lazy chunk 59,671; total JavaScript 1,127,513 bytes. Task attribution uses the captured working tree, not a misleading comparison against HEAD alone.

## 4. Task 9.17 Inputs Consumed

Consumed `TASK_9.17_PLANNER_SUMMARY_PRODUCT_CONVERGENCE_MOBILE_UX_SPECIFICATION_V1_RESULT.md`, including its current reachability/component audit, Planner/Summary hierarchy, canonical day/as-of distinction, authority contracts, mobile constraints, compatibility retirement rules, G1/G2 projection dependencies, and implementation sequencing. The supplied 9.18 specification was checked against the actual shell, component mounts, queries, command handlers, tests, and bundle output.

Task 9.17 establishes that tested components and commands do not automatically constitute product reachability. This result therefore distinguishes preserved mounted workflows from already missing or command-only workflows.

## 5. Pre-Implementation Navigation Audit

Before: DayFrameApp exposed Planner, Today, and Summary as peer primary destinations. Planner exposed Month, Work Pattern, Commitment Library, Review Schedule, and a Goals/planning entry that used the Month/settings host. Profiles and data tools occupied a broadly visible support area. Setup, Month, Review, Preview, Today, and history had existing compatibility implementations; no URL router owned navigation.

Audit targets included DayFrameApp, PlannerSurface, MonthlyPlannerSurface, SetupScreen, GoalSection, GoalPlanningSection, PlanningReviewPanel, ScheduleReviewPanel, PreviewScreen, TodaySurface, and HistoricalIntelligenceSummary. The issue was competing navigation and mounts, not a need to rebuild domain behavior.

## 6. Pre-Implementation Reachability Audit

Reachable before implementation: monthly browsing and selected-day/manual commitment actions; Work Pattern and Commitment Library setup/save; Goal lifecycle/progress and constructive planning; readiness, Preview generation/revision, suggested fixes, decisions and publication; published current-day reporting/correction; history and Sleep actuals; legacy Sleep conversion; profiles, backup/import/export and clear utilities.

Already absent from a normal shell path: generic HistoricalPlanReportingSection for arbitrary past items, general HistoricalPlan recovery controls, a separate Pattern Library, full first-class Sleep create/edit/delete forms, and Goal Structure command-level features. These are not navigation regressions or newly implemented capabilities.

## 7. Pre-Implementation Navigation-State Ownership

Previously DayFrameApp owned primary and Planner mode separately, kept a preserved Month view, and MonthlyPlannerSurface owned its own selected date/month while notifying the parent. Review also owned an explicit planning range and setup drafts had their own input dates. The parent/Month duplication was presentation-state ownership, not competing domain authority.

Now the application has one selected-day/month navigation owner. Review range and authored form dates remain distinct because they have different purposes; a navigation date cannot silently redefine either.

## 8. Pre-Implementation Bundle State

Baseline `npm run build` and `npm run check:bundle` passed at 168,185 initial gzip bytes, leaving only 1,815 bytes below the hard limit. The initial bundle had little room for a new framework or additional eagerly imported feature modules. Existing production lazy boundaries were preserved and GoalSection was moved behind a lazy boundary.

## 9. Implementation Summary

Added `plannerNavigation.ts` for session navigation and canonical current-day resolution. DayFrameApp now composes the two-destination shell, one shared Calendar view, explicit Back, a collapsed Settings and data disclosure, direct Goals hosting, and Planner-hosted Today. PlannerSurface renders only the selected child and the relevant My Schedule subnavigation. MonthlyPlannerSurface accepts controlled view state while retaining its local fallback for standalone consumers.

Moved compact preview/range controls into Review Plan, updated navigation copy, retained command callbacks, and added scoped responsive/focus styling. GoalSection now loads lazily in production using the existing test-mode import convention. No semantic implementation was copied into the shell.

## 10. Primary Navigation Implementation

The App Sections navigation contains exactly two native buttons: Planner and Summary. Both expose `aria-pressed`; the selected destination also has a visible border, bold text, and underline. Planner restores the last Planner subsection when returning from Summary. A location heading identifies the active context, and Back appears when session history is available.

## 11. Planner Default-Destination Implementation

Initial destination is Planner / Calendar. Initial selected day is resolved through `resolveUserDayContainingInstant` using current authored shift cycles, default scheduling preferences, and the real instant. Displayed month is the month of that owner label. The default does not use the machine's midnight date as a substitute and does not generate or publish a schedule.

## 12. Planner Secondary Navigation

Planner modes has exactly Calendar, My Schedule, Goals, and Review Plan. My Schedule exposes Work Pattern and Commitments through a subordinate navigation group. Opening My Schedule chooses Work Pattern; returning from Summary preserves the actual previously selected leaf. Today remains a contextual shortcut, not a fifth primary or secondary destination. Calendar is selected while the retained current-day surface is active.

## 13. Calendar Compatibility Path

Calendar reuses MonthlyPlannerSurface, the existing monthly query and selected-day workspace. Month stepping, grid selection/keyboard behavior, Current DayFrame day, Add Commitment, contextual Work Pattern/Commitment Library links, planning review, and bounded editor/settings paths remain available. Contextual compatibility labels inside the child are retained where their meaning remains accurate.

The shell does not mount every feature below Calendar. Existing selected-day/editor composition is a transitional bounded child workflow, not a new aggregate Day implementation. G1 is required before replacement.

## 14. My Schedule Compatibility Path

My Schedule is an organizational parent over existing SetupScreen modes. It introduces no merged setup schema or new save behavior. Only the selected Work Pattern or Commitments content is mounted. Existing setup draft ownership stays in DayFrameApp so navigation does not discard or automatically save the draft.

## 15. Work Pattern Reachability

Planner → My Schedule → Work Pattern reaches the existing shifts, dated periods, rotations, off days, scheduling preferences, and Save Setup workflow. Existing section disclosures and focus behavior remain. Contextual Work Pattern links from Calendar/Review target the same mode and handlers, rather than a second implementation.

## 16. Commitment Reachability

Planner → My Schedule → Commitments reaches Commitment Library and its existing author/edit/delete/setup workflows. Calendar/manual commitment creation and editing continue through the existing bounded editor and commands. The library also retains LegacySleepConversionSection. Navigation never saves setup, converts Sleep, or edits an authored commitment.

## 17. Goals Reachability

Planner → Goals directly mounts the existing GoalSection and GoalPlanningSection instead of requiring Month Planning Settings. Existing Goal authoring, detail, archive/delete behavior, explicit measurement/progress recording, Demand/planning workflows, proposals and acceptance handlers remain the same.

The former Goals host was removed only after its replacement was wired. Goal detail remains compatibility-local state; this task does not promise deep links or restoration of every unsaved Goal editor after unmount. Goal Progress is not inferred from schedule placement or completion geometry.

## 18. Review Plan Reachability

Planner → Review Plan retains ScheduleReviewPanel, readiness, generation, PreviewScreen, planning decisions and correction paths. Compact preview, explicit review range controls, and associated actions now render in Review mode. Existing Open Review Plan actions retain their existing range-reset semantics; selecting the secondary Review Plan button does not silently reset that range.

Review row/day navigation synchronizes the Calendar navigation day where appropriate. Review range remains a separate explicit input, not a derivation from whatever date the user last browsed.

## 19. Summary Reachability

Summary remains HistoricalIntelligenceSummary, including existing historical plan/execution distinctions and SleepHistorySection. It is the second primary destination. Date filters and explicit refresh retain existing query behavior. No accepted-planning lineage summary, currentness heuristic, inferred progress, or aggregate semantic badge was added.

## 20. Today Transition

Today was removed from primary navigation and is reached through Planner's Today shortcut. The shortcut resolves the canonical current day at activation, updates Calendar context, and mounts the unchanged TodaySurface/query path. Today still evaluates evidence at the real instant; it is never called with fabricated historical time to simulate a selected past day.

The old Today component is TRANSITIONAL until G1 and Day convergence provide parity. The shortcut is not a promise that arbitrary selected-day published reporting is already unified.

## 21. Selected-Day Navigation Ownership

`usePlannerNavigation` owns `{ selectedLabel, displayedMonth }` for the application session. MonthlyPlannerSurface consumes that controlled view and sends changes back to the same owner. Its internal fallback only serves standalone uncontrolled consumers; it is not a second application selected-day owner. Grid keyboard focus remains local and is distinct from selection.

The selected label is presentation context only. It is not stored in Active state, localStorage, profiles, decisions, publication, execution history, or measurements.

## 22. Canonical Day Boundary Handling

`currentPlannerView` delegates to the existing canonical resolver and only formats its owner label into a month. Regression coverage uses a global midnight preference plus an effective cycle segment with a 06:00 boundary: 05:59 belongs to the previous owner day and 06:01 belongs to the new owner day. Both default entry and the Today jump are checked. Today evidence receives actual evaluation time, not the owner label disguised as an instant.

## 23. Supporting / Settings Utility Reachability

Settings and data is a native, initially closed disclosure outside ordinary primary navigation. Existing profile selection/save/load/delete, backup export/import, recovery-related existing protection controls, and clear-data actions remain reachable through the existing handlers. Active/profile durability and protection notices retain their visibility and meaning.

Opening the disclosure is UI state only. General HistoricalPlan export/recheck/abandon recovery was already unmounted and was not introduced or implicitly claimed here. Destructive actions retain their prior explicit controls.

## 24. Pattern Library Reachability

A repository search found no implemented standalone Pattern Library surface. Named profiles remain reachable under Settings and data; they are not relabeled as a Pattern Library or treated as equivalent semantics. A future Pattern Library product path is DEFERRED, with no loss of a previously reachable surface.

## 25. First-Class Sleep Reachability

Legacy Sleep conversion remains in My Schedule → Commitments. Existing Sleep corrective actions remain in Review Plan. Published Sleep reporting remains under Planner → Today; Sleep history, actual recording and correction remain in Summary. The underlying commands and first-class Sleep owners are unchanged.

General Sleep create/edit/delete commands do not yet have a complete ordinary authoring form. That existing product gap is DEFERRED, not repaired with a legacy commitment editor. Unreported Sleep remains unknown; navigation cannot infer an actual interval or completed Sleep.

## 26. Compatibility Mapping

| New Product Path | Current Implementation Reused | Authority Owner | Disposition | Future Task Dependency |
|---|---|---|---|---|
| Planner / Calendar | MonthlyPlannerSurface, selected-day workspace | Monthly query, authored/manual owners | TRANSITIONAL | G1 and Day convergence |
| Planner / My Schedule / Work Pattern | SetupScreen Work Pattern | Existing setup commands / Active authored state | RETAIN | Later My Schedule convergence |
| Planner / My Schedule / Commitments | SetupScreen Commitment Library | Existing commitment/setup commands | RETAIN | Later My Schedule convergence |
| Planner / Goals | GoalSection, GoalPlanningSection | Goal/progress/Demand/proposal/decision owners | RETAIN | Later Goals convergence |
| Planner / Review Plan | ScheduleReviewPanel, PreviewScreen | Readiness, Preview, SuggestedFix, decisions, explicit publication | RETAIN | Later Review convergence |
| Summary | HistoricalIntelligenceSummary, SleepHistorySection | HistoricalPlan, ExecutionHistory, Sleep history queries | TRANSITIONAL | G2 before new lineage claims |
| Planner / Today shortcut | TodaySurface | queryToday, frozen publication and execution commands | TRANSITIONAL | G1 and Day convergence |
| Settings and data | Existing profile/data controls | Existing profile/backup/protection commands | RETAIN | Supporting utility refinement |
| Commitments / legacy Sleep conversion | LegacySleepConversionSection | Existing conversion command | RETAIN | No shell prerequisite |
| Arbitrary past reporting replacement | Existing unmounted reporter plus future composition | Historical targets and reporting owners | BLOCKED BY NAMED GAP | G1 |
| Unified accepted-planning Summary | No equivalent complete current projection | Canonical lineage owners | BLOCKED BY NAMED GAP | G2 |

## 27. Dual-Path Governance

Contextual Calendar links to Work Pattern, Commitment Library, and Review Plan are RETAIN: they call the same navigation handlers and reused content as the new hierarchy. Calendar selected-day content and Today are TRANSITIONAL: they have different current evidence contracts, and G1 gates their eventual merger. Summary's existing operational Sleep history remains TRANSITIONAL pending later product convergence.

The old primary Today entry and old Month Goals host are removed; their implementations are retained behind the replacement paths. No duplicate Goal lifecycle, setup save, Preview engine, publication, execution, or Sleep conversion implementation was introduced. Unmounted recovery/reporting gaps are not disguised as alternate supported paths.

## 28. Before / After Navigation Map

```text
BEFORE
DayFrame
├── Planner
│   ├── Month / selected day / settings
│   ├── Work Pattern
│   ├── Commitment Library
│   ├── Goals and planning → Month/settings host
│   └── Review Schedule
├── Today
├── Summary
└── Supporting profile/data controls

AFTER
DayFrame
├── Planner (default)
│   ├── Calendar (canonical current day on initial entry)
│   ├── My Schedule
│   │   ├── Work Pattern
│   │   └── Commitments
│   ├── Goals
│   ├── Review Plan
│   └── Today shortcut → retained current-day surface
├── Summary
└── Settings and data (supporting disclosure)
```

## 29. Capability Preservation Ledger

| Capability group | Preserved implementation / action | Parity evidence |
|---|---|---|
| Calendar | Browse/select/current day; manual commitment lifecycle; contextual setup/review | MonthlyPlannerSurface and DayFrameApp regression suites |
| Setup | Work/commitment editors, preferences, drafts, Save Setup | DayFrameApp existing setup/focus/save tests |
| Goals | Goal lifecycle/detail, explicit progress, Demand and constructive planning | Existing Goal tests; ConstructivePlanningWorkflow; new direct-entry test |
| Planning | Readiness, generation/revision, proposal/decision, suggested fixes, publication | Full engine/state/UI regression suite; unchanged command callbacks |
| Current execution | Published-item reports/corrections and protected/no-publication states | Existing Today tests and new protected navigation test |
| History | Historical intelligence, execution distinctions, Sleep actuals/correction | Existing history/Sleep suites; browser Summary reachability |
| Sleep transition | Explicit legacy conversion | Existing conversion suite and Commitments mount assertion |
| Data utilities | Profiles, backup/restore/export/clear, existing protection UI | Existing DayFrameApp utility tests; browser disclosure |

Capability preservation covers previously valid mounted workflows. It does not upgrade command-only or unmounted functionality into a parity claim. Full regression coverage exercises semantic actions; the disposable browser navigation pass intentionally does not publish, delete, or mutate user authority.

## 30. Reachability Ledger

| Capability | Before Path | After Path | Mobile Reachable? | Same Authority? | Status |
|---|---|---|---|---|---|
| Month and selected-day browsing | Planner / Month | Planner / Calendar | Yes | Yes | MOVED |
| Manual commitments | Month / selected day/editor | Calendar / selected day/editor | Yes | Yes | PRESERVED |
| Work and preferences | Planner / Work Pattern | Planner / My Schedule / Work Pattern | Yes | Yes | MOVED |
| Commitment library lifecycle | Planner / Commitment Library | Planner / My Schedule / Commitments | Yes | Yes | MOVED |
| Goal lifecycle/progress | Goals and planning / Month settings | Planner / Goals | Yes | Yes | MOVED |
| Demand/proposal/acceptance | Existing planning sections | Planner / Goals and existing Review links | Yes | Yes | MOVED |
| Generate/revise Preview | Review Schedule / compact controls | Planner / Review Plan | Yes | Yes | MOVED |
| Readiness/fixes/decisions/publication | Review Schedule | Planner / Review Plan | Yes | Yes | MOVED |
| Current published reporting/correction | Primary Today | Planner / Today | Yes | Yes | TRANSITIONAL |
| Historical intelligence | Primary Summary | Primary Summary | Yes | Yes | PRESERVED |
| Sleep actuals/history/correction | Today and Summary | Planner / Today and Summary | Yes | Yes | TRANSITIONAL |
| Legacy Sleep conversion | Commitment Library | My Schedule / Commitments | Yes | Yes | MOVED |
| Profiles / backup / restore / clear | Global support controls | Settings and data | Yes | Yes | MOVED |
| Existing active/profile protection | Existing shell banners/controls | Same protection plus utility host | Yes | Yes | PRESERVED |
| Generic arbitrary-past reporting | Component exists; no production mount | Still no production mount | No existing path | Unchanged | BLOCKED |
| General HistoricalPlan recovery | Commands; no shell workflow | Still no shell workflow | No existing path | Unchanged | DEFERRED |
| Complete Sleep authoring | Commands without complete form | Same gap | No existing path | Unchanged | DEFERRED |
| Goal Structure advanced commands | No complete ordinary surface | Same gap | No existing path | Unchanged | DEFERRED |
| Standalone Pattern Library | Not implemented | Not implemented | No | N/A | DEFERRED |
| Unified Day / accepted lineage Summary | G1/G2 absent | G1/G2 absent | Not yet | Unchanged | BLOCKED |
| Recurring Demand / found time | Missing product/semantic support | Same gap | Not yet | Unchanged | DEFERRED |

## 31. Navigation-State Ledger

| State | Owner | Lifetime | Persisted? | Domain Authority? | Consumers |
|---|---|---|---|---|---|
| Primary destination | usePlannerNavigation | App session | No | No | DayFrameApp shell |
| Planner secondary destination | Same hook, destination.planner | App session, retained across Summary | No | No | PlannerSurface / mounts |
| Selected DayFrame day | Same hook, calendarView.selectedLabel | App session | No | No | Calendar, context label, explicit day links |
| Visible calendar month | Same hook, calendarView.displayedMonth | App session | No | No | Controlled MonthlyPlannerSurface |
| My Schedule subsection | Same Planner mode: workPattern / commitmentLibrary | App session | No | No | My Schedule buttons / SetupScreen |
| Back entries | Same hook, destination + Calendar view snapshots | App session | No | No | Explicit Back |
| Grid keyboard focus | MonthlyPlannerSurface | Child mount | No | No | Grid accessibility |
| Utility disclosure | Native details element | Shell mount | No | No | Settings and data |
| Setup draft | Existing DayFrameApp draft | Existing app-session behavior | Only explicit existing save | Draft is not saved authority | Setup/editor surfaces |
| Review range | Existing explicit range state | Existing app-session behavior | No navigation write | No | Review / generation inputs |
| Goal editor/detail | Existing GoalSection local state | Existing child lifetime | Only explicit commands | Navigation state is not authority | Goal compatibility surface |

No URL serialization or browser history integration was added. Back is the visible application control, not a claim about native browser Back. Reload initializes the canonical current day.

## 32. Source-of-Truth Audit

| Shell area | Allowed ownership | Semantic source retained |
|---|---|---|
| usePlannerNavigation | Destination, selected label/month, session Back | Existing canonical day resolver |
| DayFrameApp shell | Mount selection, focus, utility grouping | Existing queries and command callbacks |
| PlannerSurface | Navigation presentation and selected child | Passed content; no evidence calculations |
| Controlled Month adapter | Presentation view changes | Existing monthly query / selected-day implementation |
| Scoped CSS | Layout, touch targets, focus indication | No semantic state |

The shell owns no capacity, feasibility, occurrence identity, readiness, accepted lineage, publication currentness, report eligibility, progress, Sleep actuals, or protected-history truth. No badge or derived summary was added that could become an accidental competing source of truth.

## 33. Authority Mutation Audit

Does merely navigating cause authoritative writes? **NO.** The new hook imports no persistence owner or command module. After real-store initialization, the regression test traverses destinations and the utility disclosure while spying on `Storage.setItem`, database mutation and 16 authority command entry points; none are invoked by navigation. Authored state, decisions, and execution remain equal.

| Owner | Navigation-triggered write |
|---|---|
| Active authored state | No |
| Profiles | No |
| PlanDecision | No |
| HistoricalPlan | No |
| ExecutionHistory | No |
| Progress / measurement persistence | No |
| Sleep conversion authority | No |

Initial repository bootstrap is existing behavior and is awaited before measuring navigation. Summary/Today query reads are allowed. Explicit Save, report, accept, publish, import, conversion and clear actions remain actions; they are not invoked by selecting a destination.

## 34. Preview Authority Check

Preview remains disposable derived output generated through existing explicit controls. Moving its host to Review Plan does not promote it to published or historical truth. Today continues to query authoritative publication, not Preview fallback. No navigation date changes generation range or automatically regenerates Preview.

## 35. Publication Authority Check

Publication remains the existing explicit eligibility-gated operation. Shell transitions do not create a publication, alter eligibility or replace retained snapshots. Published facts and current authored/derived planning remain distinct; no source/state/core file changed in this task.

## 36. Execution Authority Check

Execution reporting/correction retains the same published subject targets and command paths. Navigation cannot mark an occurrence complete, infer actual duration, or convert scheduled geometry into execution. Protected Today remains protected and exposes no illicit report controls in the new integration regression.

## 37. Historical Authority Check

Summary and Today retain frozen historical authority and fail-closed states. The shell does not turn protected history into an empty schedule. Missing publication, unknown outcomes, incomplete planning and protected evidence remain their existing distinct child states. Generic past reporting and general HistoricalPlan recovery remain named gaps rather than being approximated with current Preview or fake query time.

## 38. First-Class Sleep Authority Check

Sleep derivation, feasibility, capacity/planning integration, corrective authority, publication, actuals, historical reporting and legacy conversion modules are unchanged. Existing mounted Sleep workflows are reachable through their new parent paths. No commitment-shaped replacement, invented completion, implicit conversion or publication rewrite was added.

## 39. Lazy-Loading Architecture

Production retains lazy boundaries for SetupScreen, MonthlyPlannerSurface, ScheduleReviewPanel, PreviewScreen, TodaySurface, HistoricalIntelligenceSummary and GoalPlanningSection. GoalSection now also uses a dynamic import behind LazySurfaceBoundary and Suspense. Tests retain the repository's eager test-mode convention; the production browser pass exercises real lazy mounts.

The shell passes React content descriptions but mounts only the selected feature. Goal detail is not pulled eagerly into initial navigation. No domain code was duplicated to achieve the bundle reduction.

## 40. Lazy-Boundary Ledger

| Feature | Eager/Lazy Before | Eager/Lazy After | Reason | Bundle Effect | Semantic Risk |
|---|---|---|---|---|---|
| Navigation shell | Eager | Eager | Small presentation owner | Small shell addition | No semantic ownership |
| GoalSection | Eager | Lazy | Direct Goals destination need not burden initial shell | Main source of net initial gzip reduction; ~30.84 kB raw Goal chunk | Same component/handlers |
| GoalPlanningSection | Lazy | Lazy | Preserve planning boundary | No intentional boundary change | Unchanged |
| SetupScreen | Lazy | Lazy | Selected My Schedule leaf | Largest lazy chunk remains ~59.67 kB raw | Unchanged |
| MonthlyPlannerSurface | Lazy | Lazy | Calendar entry | Controlled view only | Query unchanged |
| ScheduleReviewPanel | Lazy | Lazy | Explicit Review entry | Existing boundary retained | Unchanged |
| PreviewScreen | Lazy | Lazy | Review compatibility | Existing boundary retained | Unchanged |
| TodaySurface | Lazy | Lazy | Planner shortcut | Existing boundary retained | Unchanged |
| HistoricalIntelligenceSummary | Lazy | Lazy | Summary entry | Existing boundary retained | Unchanged |

Only GoalSection's loading boundary changes. Shared chunk factoring is Vite's output, not evidence of a new semantic owner.

## 41. Loading / Error-State Handling

Existing LazySurfaceBoundary and explicit Suspense loading fallbacks distinguish feature loading and load failure from empty domain data; Goals now uses the same mechanism. No new optimistic empty-data placeholder was introduced. Existing readiness/unknown/incomplete/protection rendering is delegated to its current feature owner.

Browser checks observe genuine no-publication Today and empty history; regression coverage checks protected Today separately. Existing child tests cover error/protection cases. No forced production network-failure injection was performed, so error-path confidence is from retained boundary implementation and regression coverage rather than a claimed manual outage simulation.

## 42. Product Copy Changes

New/changed navigation labels are Planner, Summary, Calendar, My Schedule, Work Pattern, Commitments, Goals, Review Plan, Today, Back, Selected day, and Settings and data. Review Schedule navigation references become Review Plan. Location headings reflect the active destination.

Touched copy names destinations and actions without claiming inferred completion, authoritative Preview, zero capacity, or repaired history. Existing child terminology is retained where changing it would imply a broader feature redesign. No new empty attention card or implementation-status label was added.

## 43. Mobile Navigation Implementation

Primary controls use a two-column grid; Planner secondary controls use two columns on phones and four from 768 px. Navigation buttons and disclosure have a minimum 44 px target height; labels wrap, with reduced secondary padding so Commitments fits on a narrow phone. Context/date controls wrap without forcing document width.

Settings is collapsed by default. Only the selected feature and relevant My Schedule leaf render. Forms retain full content width. The new shell introduces no fixed/sticky overlay or hover-only action, and no desktop-only interaction is required to reach a destination.

## 44. Narrow-Phone Validation

At 320 × 900 px, touch navigation reached Calendar, Work Pattern, Commitments, Goals, Goal form, Review Plan, Summary, Today and Settings. Document width stayed 320 px and navigation targets were at least 44 px high. Visual inspection found a Commitments word break in the initial pass; reducing secondary-button inline padding resolved it and the production checks were repeated. Calendar and Review remain vertically scrollable compatibility surfaces; no final dense-child redesign is claimed.

## 45. Typical-Phone Validation

At 390 × 900 px, the same nine sampled states passed touch reachability, width and target checks. The Goal form opened and Cancel remained reachable without an authority save. Screenshot inspection confirmed a full-width form beneath the navigation, with native input focus retained. Physical-device virtual-keyboard behavior was not separately certified.

## 46. Tablet Validation

At 768 × 900 px, all sampled destinations passed. Planner secondary navigation becomes four columns; My Schedule leaf controls remain visible, and the existing Work Pattern form and Save Setup area use the available width. No alternative authority path is selected by the breakpoint.

## 47. Desktop Validation

At 1,280 × 900 px, all sampled destinations passed and Summary history/Sleep content remained reachable. The wider layout uses the same controls and queries. Keyboard Tab traversal and Enter activation were checked through the real browser, including focus transfer to the destination heading.

## 48. Mobile Validation Matrix

“Pass” denotes actual production-browser touch traversal and DOM width/target checks at the listed representative width, not every width in the range or every domain transaction.

| Capability | 320–360px | 390–430px | 768px | ≥1024px | Same Authority? |
|---|---|---|---|---|---|
| Planner | Pass (320) | Pass (390) | Pass | Pass (1280) | Yes |
| Summary | Pass | Pass | Pass | Pass | Yes |
| Calendar | Pass | Pass | Pass | Pass | Yes |
| My Schedule | Pass | Pass | Pass | Pass | Yes |
| Work Pattern | Pass | Pass | Pass | Pass | Yes |
| Commitments | Pass | Pass | Pass | Pass | Yes |
| Goals | Pass | Pass | Pass | Pass | Yes |
| Review Plan | Pass | Pass | Pass | Pass | Yes |
| Today/current-day path | Pass | Pass | Pass | Pass | Yes |
| Supporting/settings path | Pass | Pass | Pass | Pass | Yes |

Evidence: 36 samples/screenshots from `/tmp/dayframe-918-qa.mjs`, saved report `/tmp/dayframe-918-qa.json`, screenshots `/tmp/dayframe-918-{width}-{name}.png`. Chromium used a disposable `/tmp/dayframe-918-disposable-chromium` profile and local preview origin, not the actual dogfood browser database. These are local validation artifacts, not additional repository RESULT documents.

## 49. Touch Interaction Validation

CDP touch emulation was enabled and actual touchStart/touchEnd events activated visible control coordinates after scrolling into view. This verified the destinations, My Schedule leaves, Goal Add/Cancel, Today, Back and Settings disclosure. All sampled new navigation controls measured at least 44 px high. No right-click, hover, drag-only or precision pointer gesture is required for shell reachability.

## 50. Back-Navigation Validation

The visible Back button uses a session stack of destination and Calendar-view snapshots. Repeated selection of the same destination does not add duplicate history. Tests and browser checks browse to another month, jump Today, then Back to restore the prior selected label/month. Returning from Summary also preserves the last Planner leaf.

Native browser Back and URL deep links are not implemented; this app already used view state, and this task does not introduce a router. Back is destination-level, not an undo command or universal child-editor history.

## 51. Planner Context Preservation

The selected day and visible month survive Planner subsection changes and Summary round trips. Returning Planner preserves Review Plan or the selected My Schedule leaf rather than forcing Calendar. Existing setup drafts remain parent-owned; explicit commands retain their existing reset/commit rules.

Local child detail state, individual disclosure/scroll position, and all unsaved Goal form state are not globally serialized. Those existing compatibility limitations must be considered when later feature surfaces converge. Navigation selection never changes a planning horizon.

## 52. Accessibility Validation

Semantic nav groups have accessible names (App Sections, Planner modes, My Schedule). Native buttons expose pressed state and remain keyboard reachable. Bold/underline/border convey selection in addition to color. Tab traversal in Chromium showed visible solid outlines for Summary, Back, Settings, all Planner secondary buttons and Today; Enter on Summary activated it and focused the Summary location heading.

The focus effect only moves focus when it is in the navigation or body, preserving child editor focus. Existing setup/editor focus regressions pass. Calendar retains its existing grid keyboard behavior. Screen-reader and physical assistive-device certification were not performed; evidence is semantic DOM, browser keyboard checks and automated accessibility-oriented assertions.

## 53. Mobile Acceptance Gate

PASS for the bounded foundation. All required parent/leaf paths are touch reachable at the four representative sizes, no document-level horizontal overflow was found, new navigation targets are practical, and selected-child rendering plus collapsed utilities limits shell density. Existing forms retain their width and input focus. Explicit Back and selected-day restoration work.

Compatibility child pages still require vertical scrolling and later feature-level mobile convergence. No claim is made that this shell task completes every later mobile workflow redesign.

## 54. Architecture Acceptance Gate

PASS. Navigation owns presentation/session state only, uses the canonical day resolver, mounts existing feature implementations, and introduces no persisted shell model or competing authority. G1/G2 remain query/projection prerequisites rather than component heuristics. Lazy boundaries are preserved; Goal detail gains a boundary without domain duplication.

## 55. Capability-Parity Gate

PASS for previously valid reachable capabilities. Navigation and contextual links resolve to existing implementations; the full semantic regression suite passes. Removed entry points have working replacement paths. Existing command-only, unmounted and projection-blocked capabilities are explicitly identified in §§25–30 and are not misreported as newly available.

## 56. Bundle Gate

PASS. The hard initial-gzip threshold remains 170,000 bytes. No limit, measurement script, dependency or architecture guardrail was changed. Final byte counts and headroom are in §60. The aggregate-JavaScript architecture advisory remains relevant for subsequent slices; passing the initial gate is not permission for unbounded feature growth.

## 57. Focused Test Coverage

Focused command: `npm test -- --maxWorkers=2 src/ui/tests/NavigationFoundation.test.tsx src/ui/tests/DayFrameApp.test.tsx src/ui/tests/ConstructivePlanningWorkflow.test.tsx src/ui/tests/ProductSurfaces.test.tsx src/ui/tests/MonthlyPlannerSurface.test.tsx`.

Result: **5 files / 150 tests passed**. Five new integration tests cover exact hierarchy and direct feature mounts, effective non-midnight owner-day semantics, selected-day/month/Back preservation, post-bootstrap navigation without authority writes, and protected Today evidence. Existing assertions were adapted to the new entry paths while retaining semantic checks.

During implementation, obsolete selectors and fixture bootstrap/type issues were corrected; a focus-stealing issue was fixed by respecting active child controls. The existing explicit Open Review Plan range-reset behavior was preserved rather than weakening its test. Final focused log: `/tmp/dayframe-918-focused.log`.

## 58. Full Regression Results

Baseline: **145 files / 1,470 tests passed**, 63.67 seconds. Final: **146 files / 1,475 tests passed**, 53.35 seconds, using `npm test -- --maxWorkers=2` from `code/`. The timing difference is not a performance claim.

All existing engine/state/publication/execution/history/Sleep suites remain included. The only post-suite implementation adjustment was navigation CSS padding, followed by a new production build and complete browser pass. Logs: `/tmp/dayframe-918-baseline-tests.log` and `/tmp/dayframe-918-full-tests.log`.

## 59. Build Results

Validation from `code/`: `npm run format`, `npx prettier --check .`, `npm run lint`, `npm run build`, and `npm run check:bundle` passed. TypeScript checking is included by the build. `git diff --check` passed from the repository root. Final CSS adjustment was formatted/checked and rebuilt.

No dependency was added. Early commands mistakenly invoked from the repository root reported missing scripts and were rerun from `code/`; these are not final check failures. Loopback CDP access required sandbox escalation and then succeeded. An initial keyboard harness Enter event lacked carriage-return text; correcting the harness produced a passing native activation check without changing application behavior.

## 60. Bundle Results

| Metric (bytes) | Baseline | Final | Change |
|---|---:|---:|---:|
| Initial raw JavaScript | 645,745 | 615,328 | −30,417 |
| Initial gzip JavaScript | 168,185 | 161,183 | −7,002 |
| Largest lazy JavaScript chunk | 59,671 | 59,666 | −5 |
| Total JavaScript | 1,127,513 | 1,127,979 | +466 |
| Headroom below 170,000 initial gzip | 1,815 | **8,817** | +7,002 |

The final production build and unchanged policy script pass. The largest lazy chunk is SetupScreen. The final CSS adjustment changes emitted asset hashes and slightly changes compressed JavaScript references; the earlier pre-adjustment measurement was 161,197 bytes, while **161,183** is the final measured value. Initial gzip is below the 161,500 advisory as well as the hard cap. Total JavaScript remains above the 825,000 architecture-review threshold, as it was before this task; that warning is recorded, not suppressed. Final evidence: `/tmp/dayframe-918-final-bundle.log`.

## 61. Performance / Rendering Assessment

The initial bundle is smaller despite the new shell because GoalSection leaves the eager graph. Heavy surfaces remain selected/lazy; the shell does not render every feature or compute aggregate evidence. Existing broad DayFrameApp store subscriptions remain as before; this task adds no authority subscription to the navigation hook.

The browser pass demonstrates responsive interaction and successful lazy mounts, not a controlled performance benchmark or memory/CPU profile. No unsupported speedup claim is made. Aggregate JavaScript remains above its architecture advisory; future projections and feature replacements should preserve chunk boundaries and avoid duplicated semantics.

## 62. Repository Hygiene

Task-relative hashing identifies exactly nine modified pre-existing files, two new UI/test files and this one result. No core/state/schema/dependency file changed relative to the captured working tree. Pre-existing untracked files, architecture work, task documents and the dogfood PDF were preserved. The actual dogfood browser database was not opened or reset.

Formatting introduced no unrelated file drift. Temporary scripts/logs/screenshots are under `/tmp`; build output remains generated output. No commit, push, migration, destructive Git operation, or actual-profile mutation was performed. Final whitespace and result-structure checks passed.

## 63. Changed Files

| File | Task 9.18 change |
|---|---|
| `code/src/ui/DayFrameApp.tsx` | Two primary destinations; direct Goals; Planner Today; controlled day context; Back/focus; utility disclosure; Review controls; Goal lazy boundary |
| `code/src/ui/PlannerSurface.tsx` | Four secondary destinations, My Schedule leaves, selected-day context and Today shortcut; selected child mounting |
| `code/src/ui/MonthlyPlannerSurface.tsx` | Controlled navigation view with standalone fallback; Review Plan copy |
| `code/src/ui/PlanningReviewPanel.tsx` | Contextual Review Plan navigation copy |
| `code/src/ui/dayFrameUi.css` | Scoped responsive navigation, practical targets, focus/selected styling |
| `code/src/ui/plannerNavigation.ts` (new) | Session navigation owner, Back snapshots, canonical current-day adapter |
| `code/src/ui/tests/NavigationFoundation.test.tsx` (new) | Five integrated navigation/authority/day-boundary tests |
| `code/src/ui/tests/DayFrameApp.test.tsx` | Entry-path and hierarchy assertions adapted; existing semantic coverage retained |
| `code/src/ui/tests/ConstructivePlanningWorkflow.test.tsx` | New navigation entry paths |
| `code/src/ui/tests/ProductSurfaces.test.tsx` | New hierarchy and compatibility labels |
| `code/src/ui/tests/MonthlyPlannerSurface.test.tsx` | Review Plan navigation labels |
| `docs/implementation/phase-9/PHASE_9_TASK_9_18_PLANNER_SUMMARY_NAVIGATION_FOUNDATION_V1_RESULT.md` (new) | This required result |

## 64. Pre-Existing Dirty Files

The exact initial status inventory is reproduced below. These entries predate Task 9.18 and are not attributed wholesale to it. Where a listed UI file also appears in §63, only the baseline-relative navigation delta belongs to this task. All other captured files remain byte-for-byte unchanged, including the dogfood PDF.

```text
 M code/src/core/blocks/placeBlockCandidates.ts
 M code/src/core/blocks/types.ts
 M code/src/core/decisions/createPlanDecisionAcceptanceCandidate.ts
 M code/src/core/decisions/planDecision.ts
 M code/src/core/decisions/replayPlanDecisions.test.ts
 M code/src/core/decisions/replayPlanDecisions.ts
 M code/src/core/engine/generateSchedulePreview.ts
 M code/src/core/engine/reviseSchedulePreview.ts
 M code/src/core/engine/tests/generateSchedulePreview.test.ts
 M code/src/core/execution/executionRecord.ts
 M code/src/core/execution/executionSummary.ts
 M code/src/core/execution/historicalExecutionTarget.ts
 M code/src/core/friction/applySuggestedFix.ts
 M code/src/core/friction/types.ts
 M code/src/core/historicalIntelligence/completionDistribution.ts
 M code/src/core/historicalIntelligence/schedulingRealization.ts
 M code/src/core/historicalPlan/historicalPlan.ts
 M code/src/core/historicalPlan/historicalPlanFingerprint.ts
 M code/src/core/historicalPlan/historicalPlanValidation.ts
 M code/src/core/historicalPlan/materializePlanPublication.ts
 M code/src/core/occurrences/durableOccurrenceReference.ts
 M code/src/core/occurrences/occurrenceIdentity.ts
 M code/src/core/planning/acceptedAllocationRealization.ts
 M code/src/core/planning/allocation.ts
 M code/src/core/planning/capacity.ts
 M code/src/core/planning/competingDemand.ts
 M code/src/core/planning/goalFeasibility.ts
 M code/src/core/planning/proposal.ts
 M code/src/core/today/buildTodayReadModel.ts
 M code/src/state/activeV2.ts
 M code/src/state/activeV2Migration.test.ts
 M code/src/state/capacitySurface.ts
 M code/src/state/createInitialDayFrameState.ts
 M code/src/state/dayFrameBackup.ts
 M code/src/state/dayFrameBackupV3.ts
 M code/src/state/dayFrameProfiles.ts
 M code/src/state/dayFrameRestoreComposition.ts
 M code/src/state/dayFrameRestoreTranslation.ts
 M code/src/state/dayFrameStore.ts
 M code/src/state/executionHistorySurface.ts
 M code/src/state/historicalIntelligenceQuery.ts
 M code/src/state/historicalPlanSurface.test.ts
 M code/src/state/historicalPlanSurface.ts
 M code/src/state/lazyProposalSurface.ts
 M code/src/state/planDecisionSurface.ts
 M code/src/state/planningScopeQuery.test.ts
 M code/src/state/planningScopeQuery.ts
 M code/src/state/proposalSurface.ts
 M code/src/state/realizationSurface.ts
 M code/src/state/schedulePublication.test.ts
 M code/src/state/schedulePublication.ts
 M code/src/state/tests/dayFrameStore.test.ts
 M code/src/state/todayQuery.ts
 M code/src/state/types.ts
 M code/src/ui/DayFrameApp.tsx
 M code/src/ui/GoalSection.tsx
 M code/src/ui/HistoricalIntelligenceSummary.tsx
 M code/src/ui/HistoricalPlanReportingSection.tsx
 M code/src/ui/MonthlyPlannerSurface.tsx
 M code/src/ui/PlannerSurface.tsx
 M code/src/ui/PreviewScreen.tsx
 M code/src/ui/ScheduleReviewPanel.tsx
 M code/src/ui/SetupScreen.tsx
 M code/src/ui/TodaySurface.tsx
 M code/src/ui/acceptedDecisionPresentation.test.ts
 M code/src/ui/acceptedDecisionPresentation.ts
 M code/src/ui/plannerReviewPresentation.ts
 M code/src/ui/scheduleReviewReadiness.ts
 M code/src/ui/tests/DayFrameApp.test.tsx
 M code/src/ui/tests/HistoricalPlanReportingSection.test.tsx
 M code/src/ui/tests/PreviewScreen.test.tsx
 M code/src/ui/tests/ScheduleReviewPanel.test.tsx
 M code/src/ui/tests/TodaySurface.test.tsx
 M code/src/ui/tests/scheduleReviewReadiness.test.ts
 M docs/architecture/ARCHITECTURE_CHARTER.md
 M docs/architecture/CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md
 M docs/architecture/DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md
?? DayFrame_Dogfood_Pass_02_Findings_Hydration.pdf
?? code/src/core/engine/generatePlanningSchedule.ts
?? code/src/core/engine/tests/preMigrationCorrectness.test.ts
?? code/src/core/engine/tests/workRelativeFootprint.test.ts
?? code/src/core/occurrences/sleepOccurrenceReference.ts
?? code/src/core/planning/deriveFoundationalSchedule.ts
?? code/src/core/planning/foundationalPlanning.ts
?? code/src/core/planning/sleepPlanningIntegration.test.ts
?? code/src/core/sleep/
?? code/src/core/time/physicalOccupancy.ts
?? code/src/state/activeV3.ts
?? code/src/state/activeV4.ts
?? code/src/state/backupTransferSurface.ts
?? code/src/state/constructivePlanningWorkflow.ts
?? code/src/state/dayFrameBackupV13.ts
?? code/src/state/dayFrameBackupV14.ts
?? code/src/state/dayFrameProfilesV3.ts
?? code/src/state/legacySleepConversion.test.ts
?? code/src/state/publicationEligibility.ts
?? code/src/state/sleepCorrectiveIntegration.test.ts
?? code/src/state/sleepExecutionCommand.ts
?? code/src/state/sleepFoundation.test.ts
?? code/src/state/sleepHistoryQuery.ts
?? code/src/state/sleepPlanningIntegration.test.ts
?? code/src/state/sleepPublicationExecution.test.ts
?? code/src/state/sleepPublicationStorage.test.ts
?? code/src/state/sleepResolutionQuery.test.ts
?? code/src/ui/GoalPlanningSection.tsx
?? code/src/ui/LegacySleepConversionSection.tsx
?? code/src/ui/ScheduledGoalFacts.tsx
?? code/src/ui/SleepHistorySection.tsx
?? code/src/ui/planningResultCopy.ts
?? code/src/ui/tests/ConstructivePlanningWorkflow.test.tsx
?? code/src/ui/tests/LegacySleepConversionSection.test.tsx
?? code/src/ui/tests/SleepHistorySection.test.tsx
?? docs/adr/ADR_FIRST_CLASS_SLEEP_DOMAIN_AND_PERSISTENCE_FOUNDATION.md
?? docs/implementation/phase-9/TASK_9.10_FIRST_CLASS_SLEEP_ARCHITECTURE_SPECIFICATION.md
?? docs/implementation/phase-9/TASK_9.10_FIRST_CLASS_SLEEP_ARCHITECTURE_SPECIFICATION_RESULT.md
?? docs/implementation/phase-9/TASK_9.11_FIRST_CLASS_SLEEP_DOMAIN_AND_PERSISTANCE_FOUNDATION.md
?? docs/implementation/phase-9/TASK_9.11_FIRST_CLASS_SLEEP_DOMAIN_PERSISTENCE_FOUNDATION_RESULT.md
?? docs/implementation/phase-9/TASK_9.12_FIRST_CLASS_SLEEP_DERIVATION_AND_FEASIBILITY_FOUNDATION.md
?? docs/implementation/phase-9/TASK_9.12_FIRST_CLASS_SLEEP_DERIVATION_FEASIBILITY_FOUNDATION_RESULT.md
?? docs/implementation/phase-9/TASK_9.13_FIRST_CLASS_SLEEP_CAPACITY_AND_PLANNING_INTEGRATION_V1.md
?? docs/implementation/phase-9/TASK_9.13_FIRST_CLASS_SLEEP_CAPACITY_PLANNING_INTEGRATION_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.14_FIRST_CLASS_SLEEP_FRICTION_AND_CORRECTIVE_AUTHORITY_V1.md
?? docs/implementation/phase-9/TASK_9.14_FIRST_CLASS_SLEEP_FRICTION_CORRECTIVE_AUTHORITY_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.15_FIRST_CLASS_SLEEP_PUBLICATION_EXECUTION_AND_HISTORICAL_AUTHORITY_V1.md
?? docs/implementation/phase-9/TASK_9.15_FIRST_CLASS_SLEEP_PUBLICATION_EXECUTION_HISTORICAL_AUTHORITY_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.16_FIRST_CLASS_SLEEP_LEGACY_CONVERSION_AND_PRODUCT_TRANSITION_V1.md
?? docs/implementation/phase-9/TASK_9.16_FIRST_CLASS_SLEEP_LEGACY_CONVERSION_PRODUCT_TRANSITION_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.17_PLANNER_SUMMARY_PRODUCT_CONVERGENCE_MOBILE_UX_SPECIFICATION_V1_RESULT.md
?? docs/implementation/phase-9/TASK_9.17_Planner_SUMMARY_PRODUCT_CONVERGENCE_AND_MOBILE_UX_SPECIFICATION_V1.md
?? docs/implementation/phase-9/TASK_9.18_Planner_SUMMARY_NAVIGATION_FOUNDATION_V1.md
?? docs/implementation/phase-9/TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AND_WORKFLOW_AUDIT.md
?? docs/implementation/phase-9/TASK_9.8A_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md
?? docs/implementation/phase-9/TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_AND_PRE_MIGRATION_CONVERGENCE_V1.md
?? docs/implementation/phase-9/TASK_9.8B_CONSTRUCTIVE_PLANNING_REACHABILITY_PRE_MIGRATION_CONVERGENCE_RESULT.md
?? docs/implementation/phase-9/TASK_9.8C_POST_DOGFOOD_PRODUCT_REACHABILITY_AND_WORKFLOW_AUDIT.md
?? docs/implementation/phase-9/TASK_9.8C_POST_DOGFOOD_PRODUCT_REACHABILITY_AUDIT_RESULT.md
?? docs/implementation/phase-9/TASK_9.9_PRE_MIGRATION_CORRECTNESS_AND_AUTHORITY_CONVERGENCE_V1.md
?? docs/implementation/phase-9/TASK_9.9_PRE_MIGRATION_CORRECTNESS_AUTHORITY_CONVERGENCE_V1_RESULT.md
```

## 65. Deferred Convergence Work

Deferred: G1 selected-day evidence; G2 accepted-planning lineage; final Day Worksurface and accepted-planning Summary; full My Schedule/Goals/Review feature convergence; complete Sleep authoring; general HistoricalPlan recovery; mounted generic past reporting; Goal Structure product exposure; Pattern Library; recurring Demand and found time.

Also deferred: URL/deep-link serialization, native browser history routing, global restoration of child detail/draft/scroll state, physical-device keyboard certification and broader child-level mobile redesign. These do not alter the bounded shell completion criteria or justify removal of retained compatibility surfaces.

## 66. Newly Discovered Risks

No new semantic prerequisite or authority defect was discovered. Confirmed implementation constraints: GoalSection eager loading consumed scarce initial-bundle headroom; direct lazy hosting resolves that pressure for this slice. Navigation focus must not override editor focus. Small phone labels require restrained padding. Review range and selected-day context must remain separate.

Remaining risks are explicit compatibility limits: Today and Calendar still have different evidence contracts; Summary is not a G2 lineage view; child-local state is not globally restored; aggregate JavaScript remains large. No stop condition required semantic expansion, schema change, recovery fabrication or threshold relaxation.

## 67. Task 9.19 Dependency Assessment

1. **Is the two-destination shell stable enough to build upon?** Yes: hierarchy, canonical default, contextual entry points, Back and navigation-write isolation are implemented and tested.
2. **Are G1/G2 still the next blocking semantic projection gaps?** Yes. G1 must separate selected owner day from real as-of and compose authored/derived/realized/published evidence, Sleep, protection and subject-specific report eligibility. G2 must expose authoritative accepted-planning lineage/currentness without timestamp/title heuristics. Unknown evidence must stay unknown.
3. **Did 9.18 expose a new prerequisite?** No new prerequisite. General recovery and broader feature gaps remain previously named concerns; none was silently implemented here.
4. **Can the next task proceed without changing navigation again?** Yes. Add bounded canonical projections behind current feature/query boundaries; the Planner/Summary hierarchy need not change.
5. **Are compatibility paths too fragile?** No blocker for a projection slice. Keep Today, Calendar, Review and existing Summary until replacement parity is proven; do not confuse their distinct current evidence contracts.
6. **What mobile constraints carry forward?** 320 px reachability, at least 44 px new navigation targets, full-width forms, visible keyboard focus, no document overflow, selected-day preservation, progressive disclosure and identical authority across breakpoints. A new Day surface needs concise canonical evidence labels, not semantic inference in React.
7. **What bundle headroom remains?** See exact final measurement in §60. Preserve lazy loading and the unchanged 170,000-byte cap; aggregate size still deserves attention.

The repository is ready for the next bounded evidence-projection task. Its exact title/scope is not assumed, and it is not implemented by this task.

## 68. Completion Assessment

All applicable Task 9.18 completion criteria are satisfied: two primary destinations, required Planner paths, retained utilities and capabilities, canonical day handling, one session selected-day owner, no navigation-triggered authority writes, protected evidence, mobile/keyboard checks, preserved lazy architecture, passing regression/build/format/lint/bundle gates, accounted repository changes, and this single required result.

The completion claim is limited to the navigation foundation and explicitly excludes the named later convergence work.

Task 9.18 — Planner / Summary Navigation Foundation V1 is COMPLETE.
