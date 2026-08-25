# Task 6.4 Result — Read-Only Today V1 Surface

## 1. Executive Result
Complete. Today is now an accessible, responsive, read-only canonical-query surface.
## 2. Artifact Integrity
Supplied and immutable copies match SHA-256 `5eb6fb43e52601e1123eeafba80c2f4a75ce8e29e091dc5192bb196e46d6dae4`.
## 3. Task 6.3 Prerequisite Confirmation
Confirmed complete; React consumes its model without domain reconstruction.
## 4. Initial Source Audit
Verified exact query shape, placeholder, navigation, clocks, subscriptions, lazy Summary pattern, focus/CSS conventions, and bundle guard.
## 5. Files Changed
TodaySurface, DayFrameApp, shared CSS, UI tests, result/checkpoint, and governance.
## 6. Component Placement
One bounded TodaySurface owns lifecycle and small semantic renderers.
## 7. Application Query Boundary
UI receives only `queryToday`, never raw authorities or projection helpers.
## 8. Query Lifecycle
Entry queries once; a monotonic generation accepts only the latest mounted response.
## 9. Evaluation Instant
The app clock is sampled once per entry or Refresh and passed as canonical ISO.
## 10. Refresh Decision
An accessible Refresh advances the cutoff and replaces the result through loading.
## 11. Automatic Time Progression Decision
No timer or polling exists; classifications remain as-of the displayed time.
## 12. User-Day Heading
Semantic H1 Today uses canonical `userDayDate` as secondary text.
## 13. User-Day Window
Exact endpoint dates and times are displayed textually.
## 14. Variable-Duration Presentation
Non-24-hour days show subtle exact duration/boundary-change copy; 21/27-hour fixtures pass.
## 15. Known-Empty State
Copy says the published plan contains no occurrences, never that the user is free.
## 16. Missing Plan
Copy says no published plan is available and offers navigation-only Open Planner.
## 17. HistoricalPlan Protection
A recovery alert replaces the plan without Preview fallback.
## 18. Execution Protection
Schedule remains visible while section/item copy says outcome evidence is unavailable.
## 19. All-Day Section
Explicit all-day items render first and never under Current.
## 20. All-Day Outcomes
Reported outcomes or Not reported remain neutral and orthogonal.
## 21. Legacy Timing-Unavailable Section
V1 items have a concise dedicated explanation and retain exact intervals.
## 22. Current Section
All canonical current items render without underway/in-progress wording.
## 23. Multiple Current
All overlapping current items render independently.
## 24. Next Section
The query-provided Next group renders unchanged.
## 25. Tied Next
Every tied item renders; UI chooses no primary occurrence.
## 26. Later Section
Remaining upcoming items render in canonical order.
## 27. Earlier/Elapsed Section
Elapsed items render in a lower-priority Earlier section.
## 28. Outcome Copy
Copy is Reported completed/partial/skipped, Not reported, or Outcome unavailable.
## 29. Frozen Titles/Times
Only query-provided frozen titles, categories, and intervals are used.
## 30. Cross-Midnight Presentation
Both endpoints include day/date/time, preventing midnight ambiguity.
## 31. Plan Attention
Exact unplaced, omitted, and blocked items render outside chronology.
## 32. Unplaced Presentation
Label is Unplaced with no skipped/capacity inference.
## 33. Omitted Presentation
Label is Omitted with no causal inference.
## 34. Blocked Presentation
Label is Blocked with no blame/friction inference.
## 35. Drill-Down Decision
Compact exact items were clearer than an added disclosure interaction.
## 36. Planner Handoff
Open Planner appears only for missing plan/attention and only navigates.
## 37. Loading State
Chunk and query loading use one coherent `Loading Today…` status.
## 38. Error State
Lazy failure uses the shared boundary; query/internal failure uses bounded alerts.
## 39. Stale Request Handling
Generation identity prevents older responses replacing newer ones.
## 40. Navigation Race
Unmount invalidates generation and unsubscribes before late completion.
## 41. Refresh Race
Newest generation wins and Refresh focus is restored after replacement.
## 42. Clear/Restore Race
Authority notifications re-query and prevent pre-change response resurrection.
## 43. Authority Subscription Strategy
Authority changes re-query at the existing cutoff; only Refresh advances time.
## 44. Same-Cutoff Authority Changes
Post-cutoff evidence stays excluded until a later Refresh.
## 45. Lazy Today Audit
Meaningful eager UI could not fit 117 gzip bytes; clean splitting reduced initial size.
## 46. Today Loading Architecture
Planner/bootstrap stay eager; Today presentation/query and Summary are lazy.
## 47. Preload Decision
Today preloads on nav focus/hover, never startup.
## 48. Bundle Comparison
Initial raw/gzip decreased 191/45 bytes; UI is 7,245 raw and query 4,890.
## 49. Accessibility
Semantic headings, textual intervals/outcomes, status/alert roles, nav state, and named Refresh are present.
## 50. Keyboard/Focus
Nav conventions remain; Refresh regains focus and items never steal it.
## 51. Responsive Behavior
Today header/action stack while chronology stays vertical.
## 52. Mobile Layout
One operational column; no horizontal timeline.
## 53. Desktop Layout
Readable vertical card/list hierarchy with aligned header action.
## 54. No-Visualizer Decision
DayVisualizer is unnecessary and was not imported.
## 55. Read-Only Boundary
No outcome/event/move/Goal/Progress/friction/replanning control exists.
## 56. Tests Added/Changed
Covered mixed/variable days, states, protection, refresh/focus, same-cutoff/stale/unmount, navigation/lazy/accessibility/copy/read-only boundaries.
## 57. Focused Validation
Five focused files passed 129 tests.
## 58. Full Validation
`npm test` passed 88 files / 919 tests; formatting, lint, typecheck, build, and diff checks passed.
## 59. Bundle Validation
Budgets pass: 682,515 raw, 169,838 gzip, 30,091 largest lazy, 724,751 total.
## 60. Manual Product Walkthrough
No interactive browser was available; jsdom covered stable/mixed, 21/27-hour, all-day, legacy, empty, missing/protected, and responsive structure. No visual walkthrough is claimed.
## 61. Governance Updates
Updated result, checkpoint, Current State, Roadmap, Changelog, and Task 5.19 decision.
## 62. ADR Determination
No new ADR; the loading decision now records Today as another justified lazy surface.
## 63. Deviations
None; explicit Refresh was selected from the preferred allowed models.
## 64. Discoveries
Lazy Today improves initial size despite adding UI, validating primary-surface splitting.
## 65. Deferred Work
Outcome writes, context, friction, replanning, tomorrow/history, Recommendations, Capacity, adaptation.
## 66. Today Structure Matrix
| Section | Source | Condition | Writes |
|---|---|---|---:|
| Heading/window | query | available | no |
| All day/legacy/current/next/later/earlier | canonical groups | non-empty | no |
| Attention | dispositions | non-empty | no |
## 67. State Matrix
| Plan | Execution | Presentation |
|---|---|---|
| available | available | chronology + outcomes |
| available | protected/unavailable | chronology + unavailable copy |
| known empty | available | published-empty message |
| missing/protected/loading/error | any | distinct unavailable/status/alert |
## 68. Timing Matrix
| Timing | Section |
|---|---|
| V2 allDay | All day |
| V2 timed current/next/later/elapsed | Current/Next/Later/Earlier |
| V1 | Timing unavailable |
## 69. Execution Copy Matrix
| Evidence | Copy |
|---|---|
| completed/partial/skipped | Reported … |
| notReported | Not reported |
| protected/unavailable | Outcome unavailable |
## 70. Attention Matrix
| Disposition | Label | Must not imply |
|---|---|---|
| unplaced | Unplaced | skipped/cause |
| omitted | Omitted | cause |
| blocked | Blocked | blame/capacity/friction |
## 71. Loading Matrix
| Concern | Decision |
|---|---|
| surface/query | lazy/lazy |
| fallback/preload | Loading Today… / focus+hover |
| lifecycle | entry + Refresh; no polling |
| stale guard | generation + unmount |
## 72. Accessibility Matrix
| Element | Result |
|---|---|
| headings/sections | semantic H1/H2 |
| window/outcomes | textual |
| Refresh | named + focus restored |
| loading/protection/error | status/alert |
| nav | aria-pressed |
## 73. Responsive Matrix
| Area | Desktop | Mobile |
|---|---|---|
| header | aligned | stacked |
| chronology/attention/legacy | vertical cards | vertical cards |
## 74. Bundle Matrix
| Metric | 6.3 | 6.4 | Delta |
|---|---:|---:|---:|
| Initial raw | 682,706 | 682,515 | -191 |
| Initial gzip | 169,883 | 169,838 | -45 |
| Today query/UI | 4,890/0 | 4,890/7,245 | 0/+7,245 |
| Summary/largest | 30,091 | 30,091 | 0 |
| Total | 717,687 | 724,751 | +7,064 |
## 75. Product-Boundary Matrix
| Capability | Result |
|---|---|
| read-only Today/day/timing/chronology/execution/legacy/attention | Implemented |
| canonical truth | Preserved |
| writes/context/friction/replanning/Recommendations/Capacity | Deferred/prohibited |
## 76. Epistemic Matrix
| Evidence | May say | Must not say |
|---|---|---|
| current | Current | underway |
| elapsed/no report | Earlier/Not reported | completed/skipped/missed |
| reported | Reported… | success/failure |
| all-day/legacy | All day/Timing unavailable | behavior/guess |
| empty/missing/protected | exact state | free/nothing/not reported |
| attention | disposition | cause/blame |
## 77. Architectural Invariant Assessment
All 82 invariants are satisfied: canonical-query-only, read-only, stale-safe, accessible/responsive, lazy, and budgeted.
## 78. Stop-Condition Assessment
None triggered; the model rendered without reinterpretation and lazy loading was clean.
## 79. Architectural Alignment Assessment
Aligned with Tasks 6.2–6.3C and temporal/timing/loading governance.
## 80. Task 6.5 Readiness
**Task 6.5 — Today Outcome Reporting Integration is authorized.**
## 81. Recommended Next Task
**Task 6.5 — Today Outcome Reporting Integration.**
## 82. Final Completion Determination
Task 6.4 is complete: Today makes current-day published and reported knowledge legible without judgment, hidden progression, or writes.
