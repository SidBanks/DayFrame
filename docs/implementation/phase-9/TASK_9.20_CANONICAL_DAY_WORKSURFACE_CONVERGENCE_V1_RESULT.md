# Task 9.20 — Canonical Day Worksurface Convergence V1 RESULT

## 1. Executive Summary

Implemented one lazy G1 Day Worksurface for Calendar selection and the Today shortcut. It separates published schedules, current scheduling context, authored manual activity, and recorded outcomes. Existing execution commands own reports/corrections/withdrawals. Compatibility sources and editors remain. Final verification is recorded below; no persistence or authority owner changed.

## 2. Scope and Governing Constraints

Bounded product implementation under Tasks 9.17–9.19. No Summary convergence, historical recovery, Found Time, recurring Demand, Progress inference, schema changes, dependency additions, publication automation, commits, or pushes. G1 is consumed without changing its contract.

## 3. Pre-Task Repository State

HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Before edits, `/tmp/dayframe-920-baseline/` captured 949 tracked/untracked nonignored files, full contents, SHA-256 hashes, HEAD and exact dirty status. The tree already contained Tasks 9.9–9.19, first-class Sleep, and the dogfood PDF. Measured baseline: **149 files / 1,493 tests**, 51.70 s; bundle **617,423 raw / 161,583 gzip**, largest lazy 59,671, total 1,148,158. The task quotes 1,492 tests and 161,577 gzip; the measured input is one test and six gzip bytes higher. No normalization was attempted.

## 4. Task 9.17 / 9.18 / 9.19 Inputs Consumed

Consumed the 9.17 RESULT product hierarchy and reachability ledger, 9.18 RESULT navigation/compatibility foundation, 9.19 RESULT and canonical product-evidence ADR, plus G1/G2 source contracts. Relevant authorities remain canonical owner-day resolution, immutable HistoricalPlan publication, ExecutionHistory, first-class Sleep commands, accepted realized identities, and independent Progress. No skill or subagent was used.

## 5. Discovery Findings

Calendar previously embedded SelectedDayWorkspace with current Preview/manual/realized facts and contextual editors. Today separately queried current publication/execution. HistoricalPlanReportingSection was implemented but unmounted. Manual authoring is app-owned; Work/Commitment editors live in SetupScreen; Goal detail is GoalSection. Today provides generic and Sleep corrections/withdrawals, while SleepHistorySection also provides unplanned entry. Session Back stores destination/month context. Month uses roving grid focus; primary controls already target 44px. Day, reporting controls, and existing heavy editors preserve lazy boundaries. Discovery matrix and dispositions were written before product behavior changed.

## 6. Pre-Implementation Capability Matrix

Discovery recorded before product changes. Sources: MonthlyPlannerSurface/SelectedDayWorkspace, TodaySurface, HistoricalPlanReportingSection, ExecutionReportControl, SleepHistorySection, DayFrameApp, plannerNavigation, G1 builder and adapter.

| Capability | Calendar selected day | Today | Historical reporting | G1 | 9.20 target |
|---|---|---|---|---|---|
| Arbitrary day | Yes | No | Yes | Yes | G1 day |
| Current orientation | Canonical boundary | Canonical boundary | No | Canonical context | Same day shortcut |
| Work / Commitments | Current Preview | Published | Published | Both distinct | Agenda + separate current context |
| Goal work / Support / Protection | Realized facts | Published roles | Published targets | Distinct roles | Preserve roles; no buffer controls |
| Manual Events | Add/edit | Published if retained | Published target | Authored + publication separate | Reuse editor; no execution inference |
| First-class Sleep | No full day presentation | Published/report | Generic component not Sleep path | Planning/publication/actual | First-class card + Sleep commands |
| Published / Actual | Not full | Yes | Published/report | Yes | Published agenda + actual status |
| Report / correct / retract | Other review controls | Yes | Report/undo; correction elsewhere | Targets and record chains | Existing commands, refresh G1 |
| Protected history | Not inspected | Protection notice | Protection notice | Family-specific | Family-specific notice |
| Friction / attention | Corrective links | Published dispositions | Dispositions | Current friction + published | Existing review navigation |
| Source navigation | Editors | Planner | Limited | IDs, some exact targets | Reuse editor/Goal routes |

## 7. Existing Surface Disposition

REUSE: existing mutation commands, manual editor, Work/Commitment editors, Goal detail. ADAPT: session navigation, Month day activation. REPLACE WITH G1 CONSUMER: ordinary Calendar-selected day and Today destination. KEEP AS COMPATIBILITY: TodaySurface, SelectedDayWorkspace contextual authoring, historical reporting, Sleep history/unplanned entry. DEFER: full Sleep editor, historical recovery, G2 deep lineage, Summary convergence. Existing Month roving keyboard grid and shell Back are retained. Day view must be lazy; existing CSS supports responsive controls but needs scoped agenda rules and phone validation.

## 8. Day Worksurface Architecture

`DayWorksurface.tsx` reads G1 once per owner/query-context/explicit refresh. `dayWorksurfacePresentation.ts` performs display ordering, role labels and exact retained relationship presentation. `DayOutcomeControl.tsx` is a separately lazy command UI. Session navigation owns selected owner and Back only. There is no persisted projection or UI authority.

## 9. G1 Consumption Contract

The public `querySelectedDayEvidence({ownerDay, asOf})` is the only selected-day evidence input. Components do not read Preview/history/execution stores separately or call Today. Availability is checked per family, including native Sleep status inside an available wrapper. Existing Goal source navigation is separate from evidence composition. No G2 query is introduced.

## 10. Owner-Day / As-Of Handling

The selected label is independent from `now().toISOString()`. Date formatting constructs a local display date only; that value never enters an evidence query. G1 receives the real injected evaluation clock on every refresh. Tests assert arbitrary June selection still uses the actual May evaluation instant.

## 11. Current-Day Resolution

Today calls `currentPlannerView`, which delegates to `resolveUserDayContainingInstant` with effective cycle preferences. The retained 06:00 segment-boundary regression proves 05:59 selects the previous owner and 06:01 selects the current one. No civil-date slice defines Today.

## 12. Navigation Integration

Added a session-only `day` destination carrying ownerDay. Calendar and Today call the same `openDay`. The Planner hierarchy remains Calendar / My Schedule / Goals / Review Plan, with Today a shortcut. No routing dependency or URL/native Back behavior was added.

## 13. Calendar Integration

Ordinary Month activation opens Day; arrows still move grid focus, Enter/Space activates. Month stays a browsing surface. “Calendar editing tools” explicitly opens the retained selected-day compatibility workspace; contextual editors remain available. Month does not render new reporting or provenance in its cells.

## 14. Today Shortcut Integration

Today resolves the current canonical label and opens the identical lazy DayWorksurface. It preserves the previously browsed Calendar month. TodaySurface source and its compatibility tests remain, but it is no longer the ordinary Today destination.

## 15. Back / Context Preservation

Navigation snapshots preserve destination, day owner and Calendar context. Calendar entry snapshots the selected cell while retaining the browsed month; Today does not replace that month. Explicit Back restores the prior context. The new integration test proves June 12 selection/back; browser touch flows repeat Day → Back and Today → Back at four widths.

## 16. Day Header

Header uses a human date plus Past day / Today / Future day. Unknown context says Selected day. Current boundaries are available in schedule detail, explicitly qualified as current; primary copy avoids owner/authority terminology. Compact phone header leaves the first agenda item visible.

## 17. Agenda Composition

Primary agenda favors the effective published schedule; absent publication, current/future days show qualified current scheduling. Past-day current context lives in disclosure. Authored manual activity is separate, as is unplanned actual activity. Published and authored representations are deliberately not merged by title/time.

## 18. Chronological Ordering

Rows sort by retained physical start, role and stable evidence key. All-day/untimed evidence remains explicitly classified. Cross-midnight ranges include dates and preserve owner labels in detail. Support/protection relationships use retained realization/claim references, never temporal adjacency.

## 19. Authority-Layer Presentation

Published schedule, current unpublished context, authored activity and actual outcome each have explicit treatment. Display labels are not a universal domain status enum. A protected family cannot become an empty list claim; a retracted report cannot become skipped.

## 20. Published / Unpublished Distinction

The effective publication is the primary schedule when present. “Schedule & outcome details” exposes current setup/accepted scheduling separately and explains that it may differ and does not reconstruct the past. No unsupported diff or “changed” claim is inferred.

## 21. Work Presentation

Work is a titled/time-bounded item. Published Work can report/correct/withdraw through its G1 target; current Work cannot. Source navigation opens My Schedule → Work Pattern. Internal occurrence IDs are not primary copy.

## 22. Commitment Presentation

Commitments retain their titles/times. Published report targets use existing execution commands. Exact contextual Commitment editing remains in Calendar editing tools; the new G1 card does not synthesize an editor target from a title or partially known source. No Commitment authoring owner changes.

## 23. Goal-Work Presentation

Published Goal work retains its snapshot title and frozen Goal title when supplied. Current realized work is labeled Goal work with accepted-plan context. View Goal uses the retained durable Goal ID. GoalSection accepts that initial identity and explicitly reports when it is missing from current Goals; it never searches by title.

## 24. Support Activity Presentation

Support is styled subordinate with a separate preparation/support role. Exact relationship references yield “Supports …” when the parent row is in the same evidence context. Unknown/unavailable parents do not cause guessed adjacency. Support is not labeled productive Goal work.

## 25. Protected Buffer Presentation

Protected time uses dashed, quieter cards and explicit non-activity copy. Every buffer role suppresses execution controls, including legacy accepted references. It remains visible to explain geometry.

## 26. First-Class Sleep Presentation

Sleep has separate current-planning and published cards, buffer context in detail, explicit actual intervals, missing-outcome state and skipped/withdrawn semantics. Native protected/invalid/contextIncomplete/searchIncomplete/infeasible states are translated individually. Guard-owner Sleep remains owner-labeled and only displays where its footprint intersects the selected window.

## 27. Manual Event Presentation

Manual events say authored activity, not an outcome. Add/Edit reuses the existing app editor via G1 event identity/incarnation. Published manual snapshots, if present, remain a separate retained publication with its own lawful reporting target. No duration becomes Progress or Found Time.

## 28. Actual Outcome Presentation

Missing actual says Outcome not recorded. Explicit statuses say Completed, Partially completed, or Didn’t do it. Multi-revision assertions say corrected report; withdrawal says Report withdrawn · outcome not recorded. Actual interval detail uses explicit time evidence only.

## 29. Outcome Reporting

Generic publication targets feed existing `buildExecutionReportInput` and `recordExecution`. Commands revalidate and may reject. Controls are available only after item disclosure and are not offered for future-day publications. No generic command or optimistic completion is introduced.

## 30. Outcome Correction

Existing record identity/current-head ID plus retained subject/snapshot feed `buildExecutionCorrectionInput` and `correctExecutionRecord`; Sleep uses its own correct command. Copy states that outcomes change while the published schedule stays unchanged.

## 31. Outcome Retraction

Withdrawal uses existing retraction commands and requires an inline confirmation. It explains that the outcome becomes unknown and is not a declaration of nonexecution. Focus returns to the reporting trigger or item detail button on close.

## 32. Sleep Outcome Reporting

Published Sleep uses `recordSleepExecution(reportPublished)` with the G1 target’s batch/snapshot identity; corrections and retractions use G1 record-chain IDs. Actual start and elapsed minutes are required for completed/partial Sleep; optional UTC offset handles explicit offset entry. Unplanned Sleep creation remains in the existing Summary Sleep history compatibility UI; selected-day unplanned actuals can be inspected/corrected/withdrawn.

## 33. Protected Evidence UX

Family-specific notices explain information cannot currently be read safely. Independent readable activity remains visible; protected publication/actual dependencies have no report controls. No recovery command is mounted.

## 34. Unknown / Unavailable UX

No publication, unavailable publication, missing actual, unavailable actual, and query error have different wording. Available Sleep wrappers are not assumed complete. Quiet empty copy requires readable planning, realized, manual, actual, publication and resolved/not-applicable Sleep with no rows.

## 35. Attention / Friction Presentation

Current G1 friction/unplaced records appear in Attention with Review schedule navigation; stale scheduling and infeasible Sleep also offer review. No new conflict engine, recommendation, Proposed schedule content, SuggestedFix acceptance or correction is performed automatically.

## 36. Progressive Disclosure

Schedule/current-source context, earlier publications and the day’s recorded-outcome list are disclosed. Individual cards open independently. Only one card detail is expanded across the worksurface. No universal Advanced Options control expands every item.

## 37. Item Detail Interaction

Inline detail uses a named button with aria-expanded, a Return to agenda button and focus restoration. No modal, drawer, focus trap, hover action or new dependency was needed. Details use the same evidence at every viewport.

## 38. Source Navigation

View Goal passes a durable ID; View Work Pattern uses the existing destination. Add/Edit Manual Event reuses retained targets and editor state. Calendar editing tools preserves other exact contextual source actions. Absent a sufficient new card route, editing is deferred to compatibility rather than guessed.

## 39. Goal Navigation

GoalSection accepts `initialGoalId`. Existing current Goal protection guards still apply. A removed/missing linked Goal shows a bounded message; frozen schedule evidence is unchanged. Browser validation exercised this retained-identity/missing-current-source path and Back.

## 40. Commitment Navigation

No direct Commitment title-search route was added. Calendar editing tools retains exact template/recurrence/incarnation routing and its tests. General Commitment consolidation remains outside this slice.

## 41. Sleep Navigation

A complete first-class Sleep authoring form is still not product-reachable. Existing legacy conversion and Sleep history remain; this task does not claim to solve general Sleep editing.

## 42. Work Navigation

View Work Pattern opens the existing My Schedule leaf. Day cards never edit Work occurrence geometry.

## 43. Past-Day Behavior

Past days lead with frozen publication and outcomes. Current setup/realized/Sleep evidence is behind a disclosure explicitly denying historical reconstruction. Missing publication does not manufacture a past schedule.

## 44. Current-Day Behavior

Current days use the same component and G1 contract. Published/current separation and actual actions remain explicit. Today adds no alternative semantic model.

## 45. Future-Day Behavior

Future days display planning/publication/manual evidence but suppress outcome entry. Source navigation and review remain available. No command’s admission semantics changed.

## 46. Empty-Day Behavior

The empty-day claim requires sufficient readable families and no activity. A known-empty publication instead has a specifically scoped “published schedule has no items” message. Unknown planning is never equated to an empty day.

## 47. No-Preview Behavior

No Preview yields a planning-unavailable notice, while manual/history/Sleep/actual evidence can still render. No generation prompt is required to inspect independent evidence. Tests include authored Dentist activity without Preview.

## 48. Stale-Preview Behavior

Stale Preview is labeled generated before the latest changes and offers review. It is never relabeled as published and never regenerated automatically.

## 49. Loading Behavior

Initial/day-change loading says Loading this day, not empty. A manual refresh retains the prior readable projection until its successor settles; failure becomes a retryable error. Lazy component/reporting fallbacks are bounded.

## 50. Async Race Safety

Each request increments an identity; cleanup invalidates it. A result is rendered only for the current owner. A controlled A/B promise test resolves B first then A and proves B remains selected.

## 51. Error Behavior

Thrown queries, error and invalidQuery produce a bounded could-not-load message and Refresh day/Back paths. No stack, internal ID or counterfeit empty agenda is displayed.

## 52. Command Refresh Behavior

Accepted report/correction/withdrawal triggers G1 again with the current evaluation clock. The UI does not patch execution facts. Rejection preserves prior evidence and provides a review/retry message. IndexedDB pending persistence is described as background saving, not failure.

## 53. No-Optimistic-Authority Audit

Busy/disabled controls are transient presentation only. Outcome text comes exclusively from returned G1 actuals. Rejection regression verifies no false refresh/completion; real command tests verify exactly one refresh per accepted action.

## 54. G2 Usage Assessment

No G2 use was needed. Deep accepted lineage is deferred; retained G1 facts/Goal identities suffice for this bounded day view. No eager per-item provenance query exists.

## 55. Reporting-Parity Matrix

| Subject | Existing reporting path | G1 target? | Day action | Compatibility still needed? |
|---|---|---|---|---|
| Work | Today / historical / Review | Published generic | Report, correct, withdraw | Rare retry/legacy UI |
| Commitment | Today / historical / Review | Published generic | Report, correct, withdraw | Exact contextual editors |
| Goal work | Today / historical | Published generic | Report, correct, withdraw | Deep provenance deferred |
| Support | Today / historical | Published generic | Report, correct, withdraw | Same legacy qualification |
| Buffer | Prohibited | notReportable (also role guard) | None | Never invent reporting |
| First-class Sleep | Today / Sleep history | Published Sleep | Sleep report, correct, withdraw | Unplanned creation/history retained |
| Manual Event | Authored edit; separately published snapshot can report | Only publication, never authored row | Edit authored; publication target can report | Existing editor retained |

## 56. Day-Item Presentation Matrix

| Subject | Primary label | Time | Status | Outcome action | Detail | Source |
|---|---|---|---|---|---|---|
| Work | Work / frozen title | Full interval | Layer / actual | Published only | Frozen/actual | Work Pattern |
| Commitment | Title | Interval | Layer / actual | Published only | Plan/actual | Compatibility editor |
| Goal work | Frozen title or Goal work | Interval | Layer / actual | Published only | Accepted context | Durable Goal ID |
| Support | Preparation / support | Interval | Separate support | Published only | Exact relationship | Durable Goal ID |
| Buffer | Protected time | Interval | Not an activity | None | Protection relationship | Goal if retained |
| Sleep | Sleep | Sleep interval | Planning / published / actual | Sleep command only | Buffers / actual | Full editor deferred |
| Manual | Authored title | All-day or interval | Authored, not outcome | None on authored row | Owner/edit | Existing Event editor |
| Unplanned actual | Sleep or retained title | Explicit actual if known | Reported actual | Correct/withdraw | Actual/revisions | Existing Sleep history for creation |

## 57. Authority-Layer Matrix

| Evidence | Primary treatment | Detail | Action | Must not be presented as |
|---|---|---|---|---|
| Current planned | Qualified current schedule | Stale/current source | Review/source | Frozen publication |
| Published | Effective published agenda | Earlier versions | Canonical report target | Actual execution |
| Actual | Explicit outcome | Actual time/correction | Correct/withdraw | Progress |
| Manual | Authored activity | Existing edit | Edit/Add | Completed / Found Time |
| Support | Subordinate support role | Retained parent reference | Eligible published report | Productive work |
| Protection | Quiet protected-time card | Relationship | No execution | Activity |
| Sleep planning | Current Sleep | Buffers/status | Review | Published/actual Sleep |
| Published Sleep | Sleep in published agenda | Frozen buffers | Sleep report | Current requirement |
| Actual Sleep | Explicit actual | Interval/status | Sleep correct/withdraw | Planned duration |
| Protected | Family notice | Independent evidence remains | No dependent write | Empty |
| Unknown | Outcome not recorded | No inference | Report if lawful | Skipped |

## 58. Compatibility Matrix

| Existing surface | Capability | New parity | Still used? | Retirement eligible? |
|---|---|---|---|---|
| TodaySurface | Current published reporting | Ordinary workflow parity | Source/tests retained; normal shortcut replaced | No final deletion approval |
| SelectedDayWorkspace | Contextual authoring/settings | Agenda replaced; editors retained | Calendar editing tools | No |
| HistoricalPlanReportingSection | Arbitrary historical reporting | Ordinary G1 target path | Source/tests retained, still not globally mounted | No final deletion approval |
| Month detail | Current/manual/realized inspection | New ordinary Day route | Explicit compatibility workspace | No |
| ExecutionReportControl / Today controls | Reporting/retry variants | New command UI for ordinary day | Existing Review/compatibility paths | No |
| SleepHistorySection | Unplanned entry/history/correction | Published Day reporting and existing actual correction | Summary compatibility path unchanged | No |

## 59. Today Compatibility Assessment

Today capabilities: current boundary PARITY; effective publication/outcomes PARITY; generic and Sleep report/correct/withdraw PARITY; all-day/legacy timing retained; separate current/next/later grouping DEFERRED in favor of chronological agenda; execution persistence retry UI COMPATIBILITY REQUIRED elsewhere. TodaySurface is preserved and tested; no final deletion/retirement claim.

## 60. Selected-Day Workspace Compatibility Assessment

SelectedDayWorkspace remains the explicit Calendar editing-tools and contextual-authoring compatibility path. Exact Commitment editors, planning settings, Add Commitment, contextual Work editing and detailed corrective targeting are not recreated in G1 cards. Day agenda parity is achieved; full action/mobile/accessibility retirement parity is not claimed.

## 61. Historical Reporting Compatibility Assessment

HistoricalPlanReportingSection remains unchanged and its tests pass. G1 makes arbitrary-day target reporting product-reachable, including corrections/withdrawals; the old section remains available as a source component and is not newly mounted as an unbounded history list. Protected-history recovery remains absent.

## 62. Compatibility Retirement Assessment

No compatibility component was deleted. TodaySurface, SelectedDayWorkspace and HistoricalPlanReportingSection are classified NOT READY for final retirement: this slice does not prove every rare retry/editor/legacy accessibility capability redundant. Routing convergence is not deletion eligibility.

## 63. Product Vocabulary Audit

Primary terms are Day agenda, Published schedule, Current unpublished context, Goal work, Preparation / support, Protected time, Outcome not recorded and Report outcome. Plan is qualified as accepted plan or published schedule. No broad vocabulary redesign.

## 64. Architecture-Language Leakage Audit

Searched the three new UI files for canonical/truth/derived/realization/allocation/HistoricalPlan/ownerDay/incarnation/publication batch/authority. Matches are type names, source identifiers and retained-reference comparisons, not rendered diagnostic vocabulary. “Day” and “current setup” replace owner/authority terminology. Raw reference IDs are not displayed.

## 65. Visual Hierarchy

Time/title/status precede action/detail. Support is indented; protection is dashed and non-reportable. Phone-specific shell compaction was driven by screenshots: the initial version hid the first item below the viewport, then scoped spacing and heading changes exposed Sleep in the initial 320px frame.

## 66. Styling Changes

Only bounded day-workspace/day-mode CSS was added. Existing theme variables provide light/dark colors. Inputs constrain intrinsic width; text wraps; primary controls retain 44px height. No framework, global design replacement or dependency.

## 67. Accessibility Implementation

Semantic headings, buttons, selects, labels, status/alert text, aria-expanded and explicit focus return. Keyboard grid semantics remain. No color-only outcome states or modal focus lifecycle. Browser Tab checks show solid focus outlines on card buttons. Screen-reader certification was not performed.

## 68. Touch Interaction Assessment

Chromium touch dispatch exercised day opening, item disclosure, reporting, Back, Today and source navigation. Measured minimum new primary action height: 44 CSS px. No hover, right-click or double-click requirement.

## 69. 320px Validation

320px rendered checks passed: document/scroll width 320/320, agenda visible, detail/reporting reachable, Back restores Calendar, Today enters the same view. Screenshots: `/tmp/dayframe-920-320-{day,report,dense-detail,support,today}.png`; supplementary Sleep/protection/form captures also passed.

## 70. 390px Validation

390px rendered checks passed: document/scroll width 390/390, long labels wrap, detail/cancel controls remain reachable, and the same navigation workflow passes. Matching screenshots are under `/tmp/dayframe-920-390-*.png`.

## 71. 768px Validation

768px rendered checks passed: document/scroll width 768/768; agenda hierarchy and exact same G1 cards/actions remain. Support detail was visually inspected. No tablet-specific semantic branch.

## 72. 1280px Validation

1280px rendered checks passed: document/scroll width 1280/1280; selected-day context, disclosures, actions and Back remain usable. Same one-column agenda contract; a separate desktop timeline was intentionally not added.

## 73. Mobile Keyboard / Form Validation

Touched generic/Sleep forms scroll to confirmation and cancellation. Sleep completed reporting succeeded at 320px with viewport reduced to 360px height, then withdrawal succeeded. Numeric elapsed input uses inputMode=numeric. This is a reduced-viewport keyboard-obstruction check in headless Chromium, not a physical iOS/Android keyboard certification.

## 74. Mobile Acceptance Gate

PASS for implemented workflows: Calendar/Today/Back/source/report reachability; no overflow at 320/390/768/1280; 44px controls; independent disclosure; readable unknown/protected states; generic and Sleep outcomes; keyboard focus and reflow; canonical command refresh; unchanged publication. Unplanned Sleep creation and full source authoring remain explicitly retained compatibility workflows, not claimed retired. Native screen-reader/mobile-device certification remains unperformed.

## 75. Dense-Day Assessment

Rendered dense fixture: published Work, Sleep, three Commitments, twelve manual activities, and six lawful accepted productive/support/protection facts from the existing constructor fixture. There are 40 total rendered cards including collapsed current context and separately authored/published manual evidence. Default item disclosures stay closed. Fixture statuses and source-missing behavior are test inputs, not rewritten dogfood authority.

## 76. Large-History Assessment

The UI queries one owner and displays only that owner’s retained publication versions/actuals plus lawful intersecting current evidence. It performs no all-history export. The existing G1 long-data regression (500 manual events / 40 publications and indexed reads) remains in the full suite. Existing Sleep command internals may validate all retained publication references; the UI adds no new scan.

## 77. Performance Evidence

Final diagnostic browser run: dense opens 26.0–32.0 ms G1/fixture composition; ordinary Today opens 10.2–21.0 ms; generic action refresh 17.8 ms. Response-to-next-animation-frame: 0.3–12.5 ms (a frame proxy, not isolated React commit duration). Supplemental Sleep report/withdrawal measurements are in `/tmp/dayframe-920-supplement.json`. These local dev-browser measurements are not an SLO and include fixture instrumentation.

## 78. G1 Query Count Assessment

Main browser workflow recorded exactly nine G1 calls: four dense day opens, four Today opens, one accepted outcome refresh. Detail opening did not call G1 again. No per-item query fan-out. State changes/explicit refreshes legitimately request a new projection.

## 79. G2 Query Count Assessment

Instrumented G2 calls: zero. No eager Goal-per-item G2 path exists.

## 80. Boundary Regression

Product navigation regression retains the effective 06:00 segment boundary and previous-owner behavior before boundary rollover. Today calls canonical resolution, not a date slice.

## 81. Owner-Day / As-Of Regression

New Calendar integration regression opens an arbitrary future owner while asserting unchanged real asOf. Day-component race test makes the same assertion across two selections. Navigation does not alter planning range.

## 82. Async Race Regression

Controlled promise order, not timers: A starts, B starts, B resolves, A resolves. Heading and selected projection remain B. Cleanup invalidates requests on unmount.

## 83. Authority Mutation Regression

NavigationFoundation command spies cover setup, acceptance, realization, decisions, publication, execution, Progress/measurement, Sleep, conversion, profiles and generation; storage writes and retained records are checked. Today now exercises G1 Day. Additional Calendar test spies generation/publication. Rendering disclosure invokes no writer.

## 84. Historical Immutability Regression

Real store tests export publication before generic Work and Sleep commands and compare after report, correction and withdrawal. Actual statuses change through existing owners; exports remain equal. Browser Sleep workflow repeats the equality check.

## 85. Unknown / Nonexecution Regression

Presentation tests distinguish absent outcome, explicit nonexecution, corrected completion and withdrawn/unknown. They inspect rendered text rather than only types. Manual activity never becomes a completion badge.

## 86. Protected / Empty Regression

Protected and unavailable publication tests assert readable notices and absence of the empty-day claim. Native protected Sleep is also tested inside an available outer wrapper. Browser protected fixture retains independent evidence and no false empty state.

## 87. Reporting Regression

Generic Work and first-class Sleep reporting use canonical G1 targets with real stores. Rejected target admission retains prior actual state and does not issue a success refresh. Future-day target availability alone does not expose actions.

## 88. Correction / Retraction Regression

Correction uses current record head; withdrawal confirms and then refreshes. Both Work and Sleep show corrected completion and withdrawn/unknown. Frozen publication remains byte-equivalent through exported object equality.

## 89. Sleep Regression

Sleep planned/published/actual distinction, native protection, explicit skipped, required actual-time entry, correction and withdrawal are covered. Existing Sleep publication/execution/storage/history tests remain. Unplanned entry stays in Sleep history compatibility UI.

## 90. Manual Event Regression

A real manual event without Preview renders as authored activity and passes the exact G1 edit target. No execution writer is invoked. Browser long-label/manual fixture checks wrapping and separate authored/publication treatment.

## 91. Productive / Support / Protection Regression

Lawful accepted constructor fixtures produce productive work, support and buffers. Tests assert all roles, deterministic ordering, one open detail, and no buffer execution controls. Source navigation uses retained Goal ID.

## 92. Dense-Day Regression

The accepted-role fixture is automated; the larger mixed Work/Sleep/Commitment/manual/accepted fixture is rendered at four widths. All provenance remains closed by default and one card detail opens at a time. Browser evidence includes current-context disclosure and support styling.

## 93. Empty / No-Preview / Stale Regression

Distinct tests cover readable empty generated day, no Preview, stale Preview, protected history, unavailable history, query error and invalid query. Browser Today also exercises an out-of-range planning context without forcing generation.

## 94. Compatibility Regression

Existing Today, Month, HistoricalPlan reporting, execution, Sleep and app tests are retained. DayFrameApp compatibility tests now explicitly open Calendar editing tools where required; Today assertions now target the shared day heading/query. Navigation protection tests mock G1’s scoped protection, preserving the old guarantee. ConstructivePlanningWorkflow retains its accepted-role assertions after explicitly opening Calendar editing tools. No old regression test was deleted.

## 95. Focused Test Inventory

New `DayWorksurface.test.tsx`: 14 tests (controlled race; accepted roles/order/disclosure/focus; two history availability cases; two query failures; rejected report; Work mutation sequence; Sleep sequence; empty/no-preview/stale; future admission UI; manual identity; Goal identity; native Sleep protection). NavigationFoundation adds one Calendar/Back/asOf test and adapts Today expectations. Dedicated focused run: 2 files / 20 tests. Final expanded focused inventory includes 13 existing constructive-planning tests, giving 33 tests across three files. Existing changed test files: DayFrameApp, NavigationFoundation, ConstructivePlanningWorkflow.

## 96. Full Regression Results

PASS: `npm test -- --maxWorkers=2` — **150 files / 1,508 tests**, 64.00 s. Baseline 149 / 1,493; net +1 file / +15 tests. Dedicated final focused command: `npx vitest run src/ui/tests/ConstructivePlanningWorkflow.test.tsx src/ui/tests/DayWorksurface.test.tsx src/ui/tests/NavigationFoundation.test.tsx --maxWorkers=2` — **3 files / 33 tests**, 7.90 s. First broad run found one compatibility-entry expectation; it was updated to enter the retained tools path without removing role assertions. All final tests pass. Logs: `/tmp/dayframe-920-{full-tests,focused-final}.log`.

## 97. Build / Static Validation

PASS: `npm run format`; `npx prettier --check .`; `npm run lint`; `npm run typecheck`; `npm run build` (includes typecheck); `npm run check:bundle`; `git diff --check`. Logs use `/tmp/dayframe-920-{format,prettier,lint,types,build,bundle}.log`. Production smoke via `npm run preview -- --host 127.0.0.1 --port 4921` and `node /tmp/dayframe-920-qa.mjs --production` passed: shared Calendar/Today heading, correct no-Preview state, separate lazy Day/G1 chunks, width/scrollWidth 320/320. Evidence: `/tmp/dayframe-920-production.json`.

## 98. Bundle Results

| Metric | Pre-task | Final | Delta |
|---|---:|---:|---:|
| Initial raw JS | 617,423 | 617,972 | +549 |
| Initial gzip | 161,583 | **161,795** | **+212** |
| Largest lazy chunk | 59,671 | 59,671 | 0 |
| Total JS | 1,148,158 | 1,156,914 | +8,756 |
| Hard gzip headroom | 8,417 | **8,205** | -212 |

Hard gate **170,000 unchanged, PASS**. Existing initial-gzip advisory 161,500 and total architecture-review advisory 825,000 remain triggered; neither was raised/suppressed. Day, G1 and outcome controls remain lazy; the initial delta is bounded shell/navigation wiring. Compatibility source retention does not require eagerly shipping Today. Final production smoke confirms DayWorksurface and selectedDayEvidenceQuery load as distinct lazy resources.

## 99. Persistence Audit

No persistence reader/writer implementation changed. UI session navigation is ephemeral; reports call existing commands. Disposable Chromium profile: `/tmp/dayframe-920-browser`. Real dogfood state was not opened, cleared or repaired.

## 100. Schema Audit

No Active/Profile/Backup/HistoricalPlan/ExecutionHistory/PlanDecision/Sleep schema or version changed. All non-UI implementation files match the pre-task baseline.

## 101. Dependency Audit

No dependency or lockfile changed. Existing React, native controls, Vitest, Chromium/CDP and Vite suffice.

## 102. Repository Hygiene

Full pre-task source capture and task-relative hash audit distinguish this work from earlier dirty tasks. Temporary rendered-fixture entry files were copied to `/tmp/qa920.tsx` and `/tmp/qa920.html`, then removed from the repository before final static/build checks. QA script and screenshots remain in /tmp. No commit/push, reset/stash, history repair or dogfood normalization. Final task-relative audit: 14 files (9 modifications, 5 additions), zero baseline deletions, no unrelated content changes. The dogfood PDF hash is unchanged. Exact final status and changed-file inventory are in `/tmp/dayframe-920-final-status.txt` and `/tmp/dayframe-920-audit.json`.

## 103. Changed Files

| File | Reason / semantic effect | User-visible? | Authority-affecting? |
|---|---|---|---|
| `code/src/ui/DayOutcomeControl.tsx` | Wire existing report/correct/retract owners with confirmation and refresh | Yes | Existing commands wired only; no owner change |
| `code/src/ui/DayWorksurface.tsx` | G1 async consumer, family notices, layered agenda and item disclosure | Yes | No |
| `code/src/ui/dayWorksurfacePresentation.ts` | Deterministic display-only G1 row mapping and role/reference labels | Yes | No |
| `code/src/ui/plannerNavigation.ts` | Session owner-day destination and deterministic Back context | Yes | No |
| `code/src/ui/tests/ConstructivePlanningWorkflow.test.tsx` | Retain accepted productive/support/protection assertions through explicit Calendar editing tools | No (test/document) | No |
| `code/src/ui/tests/DayWorksurface.test.tsx` | Fourteen product regressions including real immutable-publication commands | No (test/document) | No |
| `code/src/ui/tests/NavigationFoundation.test.tsx` | G1 Today/protection expectations and new Calendar/asOf/Back regression | No (test/document) | No |
| `docs/implementation/phase-9/PHASE_9_TASK_9_20_CANONICAL_DAY_WORKSURFACE_CONVERGENCE_V1_RESULT.md` | Required durable result and verification ledger | No (test/document) | No |
| `code/src/ui/DayFrameApp.tsx` | Mount shared lazy Day, wire existing editors/commands, retain Calendar tools | Yes | Existing commands wired only; no owner change |
| `code/src/ui/GoalSection.tsx` | Open exact retained Goal ID; message missing current source | Yes | No |
| `code/src/ui/MonthlyPlannerSurface.tsx` | Activate arbitrary day and expose explicit compatibility tools | Yes | No |
| `code/src/ui/PlannerSurface.tsx` | Render Day destination and scoped compact phone shell | Yes | No |
| `code/src/ui/dayFrameUi.css` | Scoped agenda, role, form, touch and compact-header styling | Yes | No |
| `code/src/ui/tests/DayFrameApp.test.tsx` | Preserve compatibility guarantees through explicit tools entry; adapt Today route | No (test/document) | No |

## 104. Pre-Existing Dirty Files

Exact pre-existing dirty inventory is `/tmp/dayframe-920-baseline/status.txt`; full contents and hashes are alongside it. Includes engine/state/Sleep/projection/UI changes, specifications/results and `DayFrame_Dogfood_Pass_02_Findings_Hydration.pdf`. These were preserved rather than folded into a claimed task diff.

## 105. Deferred Work

Deferred: deep G2 provenance, direct G1 Commitment edit-target routing, full Sleep editor, unplanned Sleep creation in Day, final compatibility retirement, native URL Back, separate desktop timeline, Summary/My Schedule/Goals/Review convergence and protected HistoricalPlan access. Direct Previous/Next Day controls were intentionally omitted; Calendar selection and Today already provide bounded navigation without date arithmetic.

## 106. Newly Discovered Risks

Initial mobile shell density needed correction. Pending IndexedDB persistence must not be called failure; fixed in the new control. Historical Goal identity may outlive current Goal sources; now explicitly messaged. G1 retains all versions for one owner and existing global Sleep-reference validation costs; no new performance promise. Current/accepted and published manual evidence can legitimately repeat a title in different layers.

## 107. Day Worksurface Parity Assessment

All 21 required questions after final verification: YES for arbitrary Calendar day; canonical Today; G1-only day composition; Work; Commitments; Goal work; distinct support; non-activity buffers; first-class Sleep layers; authored manual activity; current/published distinction; publication/actual distinction; missing-as-unknown; protected-as-protected; existing-command reporting; immutable publication under correction/withdrawal; no Preview; stale Preview; query errors; stale-response protection; and 320px primary workflow. This is bounded day-workflow parity, not a declaration that every compatibility editor/retry path can be deleted.

## 108. Today Retirement Readiness

NOT READY for final TodaySurface deletion. The shortcut is converged; source/tests remain for compatibility verification and rare current-day grouping/retry behavior. Future retirement needs a dedicated semantic/action/protection/mobile/accessibility/test audit.

## 109. Selected-Day Workspace Retirement Readiness

NOT READY. SelectedDayWorkspace still provides contextual source/editor/settings actions under Calendar editing tools. Removing it now would lose useful action paths.

## 110. Historical Reporting Retirement Readiness

NOT READY. G1 product reporting covers the ordinary arbitrary-day path, but deletion requires a focused legacy/rare-action accessibility and protection parity review. No recovery was added to force eligibility.

## 111. Summary Convergence Readiness

Day did not require G2. No new accepted-lineage or Progress ambiguity was introduced; titles/Goal current source remain separate from retained schedule identity. G2 remains suitable for an independently bounded accepted-planning Summary consumer; legal legacy-lineage uncertainty documented by 9.19 still applies.

## 112. Task 9.21 Dependency Assessment

Day convergence is complete and final gates pass. Compatibility surfaces remain; none is approved for deletion here. Protected History Access need not block an independent readable product slice, but protected data must stay protected. My Schedule/Goals/Review have working owners but incomplete product consolidation; Summary can consume G2 independently. Recommended smallest next task: bounded accepted-planning Summary slice, preserving iteration identity, no Progress inference, scoped legacy uncertainty, lazy G2 and the same 320/390/768/1280 workflow/keyboard/touch/overflow gate. Do not implement 9.21 in this change. Remaining initial-gzip headroom: 8,205 bytes (§98).

## 113. Completion Assessment

All applicable bounded implementation, mobile, accessibility, command, compatibility-preservation, regression, static, bundle and hygiene gates pass. Native device/screen-reader certification and the explicitly deferred compatibility/editor slices are not claimed. No architecture stop condition was encountered. No commit or push was performed.

Task 9.20 — Canonical Day Worksurface Convergence V1 is COMPLETE.
