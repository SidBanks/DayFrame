# Task 7.1 Result — Canonical Monthly Planner Read Model and Display-Week Projection

## 1. Executive Result

**Complete and ready for Task 7.2.** `queryMonthlyPlanner` is a pure, React-independent projection
that validates explicit inputs and returns a deterministic 35/42-cell civil grid, one M-01 display
week anchor, canonical user-day windows/current marker, Preview coverage/freshness, current Event
evidence, planned Work/Commitment/Sleep evidence, attention, exact non-retargeting targets, and a
richer selected-day projection. It writes nothing and introduces no dependency or UI.

## 2. Artifact Integrity

The supplied artifact and immutable project copy both have SHA-256
`9636bae93696e3d17d07f087e4d7c2f525a3a4b9d81993e5745acdb64b67e03f`.

## 3. Phase 7 Audit Prerequisite Confirmation

Phase 7 Audit 01 Outcome A governs. Month remains a projection; selected labels resolve canonical
piecewise user-days; visual weeks never govern user-week semantics; Preview remains generated plan
geometry; generation remains explicit.

## 4. Initial Source Audit

| Evidence | Existing canonical shape | Task 7.1 use/derivation |
| --- | --- | --- |
| Work | `generatedWorkBlocks`, exact `userDayDate`, occurrence identity | indexed once by owning label; composite target |
| Commitment/Sleep | `scheduledBlocks`, category, exact Task 6.10 navigation identity | indexed once; exact lifetime revalidated against current sources |
| Event/all-day | current `ActiveManualCalendarEvent`, `userDayDate`, `allDay`, incarnation | current authority projected independently; canonical geometry derived |
| Preview coverage | inclusive `rangeStartDate`/`rangeEndDate` | mechanically distinguishes covered-empty/uncovered |
| freshness | canonical `preview.isStale` | copied to covered-cell kind; not recomputed |
| friction | `affectedUserDayDate` or affected exact block IDs | one unambiguous owning cell; ambiguous multi-day issue Month-level only |
| unplaced | candidate `userDayDate` + exact Commitment identity | cell and Month-level; no guessed date |
| current user-day | canonical containing-instant resolver | explicit evaluation instant |
| boundaries/week start | effective preference and canonical window resolvers | query-local label cache |
| protected/unavailable | readiness above Active query | explicit whole-query result branch |

Preview scheduled manual blocks do not carry current Event incarnation, so Events are deliberately
projected from singular current Active Event authority and Preview manual blocks are excluded to
avoid duplication/retargeting. Preview grouping currently duplicates cross-boundary overlap for
Review display; Month instead uses authoritative `userDayDate` as required.

## 5. Files Changed

- `code/src/core/monthlyPlanner/queryMonthlyPlanner.ts`
- `code/src/core/monthlyPlanner/queryMonthlyPlanner.test.ts`
- immutable Task 7.1 copy, this result, Phase 7 checkpoint, and governance files

No existing production behavior module was changed.

## 6. Query Module Placement

The module lives under `core/monthlyPlanner`: pure domain/application projection beside canonical
time/Preview types, outside React and stores.

## 7. Query Contract

The bounded input accepts displayed month, optional selected visible label, explicit evaluation
instant, temporal preferences/cycles, planning-range metadata, current Preview, current Events,
current Commitment lifetime indexes, and optional availability. It rejects a whole-store input.

## 8. Input Validation

Strict local parsing rejects malformed/impossible months/dates, invalid instants, reversed ranges,
invalid Preview ranges, and selected labels outside the visible grid. JavaScript normalization is
never accepted as identity.

## 9. Displayed Month Identity

`YYYY-MM` is the machine identity; result also owns numeric year/month. No locale string defines it.

## 10. Selected Label

Selection is optional and must be one of the 35/42 visible core/adjacent labels. It is returned
unchanged; there is no silent clamp. Month-shift clamping is a separate pure helper.

## 11. Evaluation Instant

Required valid `Date`; copied into canonical resolver behavior and never defaulted with `new Date()`.

## 12. Display-Week Anchor

The effective `weekStartsOn` at M-01 is resolved once and returned explicitly.

## 13. Weekday Columns

Seven locale-independent canonical weekdays rotate from the fixed anchor and retain stable indexes.

## 14. Grid Geometry

Civil noon dates avoid parsing/formatting ambiguity. Leading cells align M-01 to the display anchor;
trailing cells complete the last row. Labels are contiguous and unique.

## 15. 35-Cell Rule

If leading cells plus month length fit within 35 slots, return five rows. Four-row calendar geometry
still returns the governed minimum 35.

## 16. 42-Cell Rule

If the month needs more than 35 slots, return six rows/42 cells.

## 17. Adjacent Cells

Adjacent cells receive the same temporal, coverage, evidence, attention, and current-marker
projection. Membership is explicit `previous`/`next`.

## 18. Cell Identity

Canonical `YYYY-MM-DD`; no random or index identity.

## 19. Cell Month Membership

Each cell owns `membership` plus `isInDisplayedMonth` so UI will not rederive it.

## 20. Canonical User-Day Resolution

Every cell uses `resolveUserDayWindowForLabel`: `[start(D), start(D+1))` with effective piecewise
preferences. Query-local caching prevents repeated resolution.

## 21. Variable-Duration Metadata

Cells and selected day own cloned start/end, exact duration minutes, boundary, and effective week
start. No 24-hour rounding occurs.

## 22. Current User-Day Marker

`resolveUserDayContainingInstant` identifies the containing canonical label; a mandatory test proves
the previous label remains current before a 04:00 boundary.

## 23. Coverage Source

Preview's explicit inclusive label range proves generated coverage even with no occurrences.

## 24. Coverage Classification

Discriminated `coveredFresh`, `coveredStale`, and `uncovered` cell states; whole-query
`protected`/`unavailable` branches preserve authority readiness.

## 25. Freshness

Uses only `preview.isStale`. A stale covered cell remains covered and retains geometry.

## 26. Generated-Empty

Covered fresh/stale states own `generatedEmpty`, true only when projected planned occurrences,
friction, and unplaced evidence are all absent. It is never applied to uncovered cells.

## 27. Partial Coverage

Core displayed-month cells are counted independently. Mixed coverage returns `partialCoverage`.

## 28. Month-Level Status

Deterministic states: no coverage; partial; fully fresh; fully stale. Counts preserve mixed detail.

## 29. Work Projection

Preview Work is indexed by authoritative `userDayDate`, retains dates/title/stable occurrence key,
and exposes only `{kind: "work"}` composite context.

## 30. Commitment Projection

Non-manual scheduled blocks are indexed by `userDayDate` and retain exact Task 6.10 template and
recurrence identities. Missing exact identity keeps evidence but exposes an unavailable target.

## 31. Sleep Projection

Category `sleep` is a presentation kind over the same Commitment target; no authority is created.

## 32. Event Projection

Current Active Events supply exact ID/incarnation, owning label, all-day intent, and geometry.

## 33. All-Day Event

Explicit `allDay` produces semantic `allDayEvent` and canonical whole-user-day geometry once.

## 34. Timed Full-Day Event

A timed equal-clock interval remains `timedEvent` and spans to the next clock date; duration never
changes its semantic kind.

## 35. Cross-Boundary Ownership

Every occurrence is indexed only under authoritative `userDayDate`; no overlap-based duplication.

## 36. Friction Projection

Unresolved/non-ignored current Preview friction supplies deterministic severity/title/ID metadata.

## 37. Friction Ownership

Prefer explicit affected user-day. Otherwise assign only if every known participant resolves to one
label. Ambiguous multi-day issues remain in Month-level count without guessed cell ownership.

## 38. Unplaced Projection

Candidates already have canonical `userDayDate`, so visible candidates appear once at cell and
Month level with exact/source-unavailable metadata.

## 39. Month-Level Attention

Returns friction count (including ambiguous visible-participant issues), unplaced count, and stale
coverage fact. No severity ranking, Capacity, or Recommendation is inferred.

## 40. Cell Evidence Model

Owned semantic evidence holds stable ID, kind, title, cloned dates, and cloned target. Separate
friction/unplaced collections preserve richer attention detail.

## 41. Cell Token Model

`tokens` is an owned ordered semantic list. It contains no color, CSS, breakpoint, or React data.

## 42. Cell Ordering

All-day Events → timed Events → Work → Commitments/Sleep → attention; within class start, end,
kind, title, exact stable ID. Selected-day planned occurrences use the same truthful semantic order.

## 43. Overflow Foundation

`takeMonthlyPlannerTokens(tokens, N)` clones the first N and returns exact overflow. N is explicit;
no viewport policy exists.

## 44. Selected-Day Projection

Returns label/membership/current marker, full canonical geometry, coverage, occurrences, friction,
unplaced, exact targets, week-start difference, and adjacent boundary transition facts.

## 45. Selected-Day Ordering

Deterministic semantic order remains appropriate before Task 7.2 composes DayVisualizer/agenda
chronology; no compressed subset is used.

## 46. Week-Start Transition Metadata

Selected effective week start is compared to fixed M-01 anchor without rotating columns.

## 47. Boundary-Transition Metadata

Selected detail exposes previous/current/next boundary and exact difference flags, without advice.

## 48. Planning-Range Independence

Displayed Month may be anywhere. The query neither changes range nor generates; out-of-range
Preview cells remain uncovered.

## 49. Planning-Range Metadata

The authored range is validated, cloned, and returned only as explanatory context.

## 50. HistoricalPlan Exclusion

No input, import, or backfill path exists.

## 51. ExecutionHistory Exclusion

No input/import; outcome values cannot enter evidence.

## 52. Progress Exclusion

No Goal/Measurement/Observation/Progress input or import.

## 53. Capacity Exclusion

No free/available/overloaded field or arithmetic.

## 54. Recommendation Exclusion

Friction target/evidence is preserved without Recommendation vocabulary or ranking.

## 55. Protection/Availability

Explicit query branches return protected/unavailable before normal projection. Protected input never
becomes an empty Month.

## 56. Partial Authority Availability

Normal available projection may show current Events where Preview is null/uncovered. Active
readiness protection remains whole-query because temporal and exact Event authority cannot be
trusted independently at the current application boundary.

## 57. Query Result Union

`available`, `invalidQuery`, `protected`, and `unavailable` are explicit discriminants.

## 58. Exact Target Model

Commitment, Event, Work, friction, unplaced, and unavailable-evidence target variants are navigation
metadata only.

## 59. Commitment Incarnation Safety

Preview exact template/recurrence lifetime is compared with current source lifetime. Removed or
recreated source returns `staleSource` while preserving old IDs/incarnations; never retargets.

## 60. Event Incarnation Safety

Event evidence comes only from the current exact Active Event, not stale Preview manual geometry;
there is no logical-ID join capable of retargeting a recreation.

## 61. Work Target

Only composite Work context is exposed; no singular editable Work occurrence is invented.

## 62. Determinism

Explicit inputs, stable keys/sorts, canonical parsing, and no ambient clock produce equal models.

## 63. Stable Identity

Cell labels and source/occurrence identities form keys. Array index is never semantic identity.

## 64. Clone Isolation

Dates, arrays, evidence, nested targets, friction, and unplaced objects are owned. Mutation tests
prove sources and subsequent results are unchanged.

## 65. Input-Order Independence

Permutation tests prove current Event ordering; the same canonical sorting/indexing applies to each
evidence class.

## 66. Performance Architecture

Generate labels O(cells); build exact indexes/evidence maps O(sources + evidence); project cells
O(cells + visible evidence); selected detail uses indexed lookup. No cell scans a source array.

## 67. Temporal Resolver Reuse

A query-local Map caches label windows. It is discarded after each query and never durable.

## 68. Dense-Month Fixture

Focused fixtures combine Events, Work, Commitments, Sleep, friction, and unplaced evidence; ordering,
counts, attention, and exact targets are asserted without a brittle wall-clock benchmark.

## 69. Navigation Helpers

Pure previous/next month offset and clamped day projection support year/leap transitions. Jan 31 →
Feb 28/29 is deterministic.

## 70. View-State Persistence Boundary

No displayed/selected/focus/overflow state, key, store, or Backup field exists.

## 71. Profile Boundary

The query consumes current post-profile inputs only; no profile identity/write/cache.

## 72. Restore Boundary

Restored current inputs naturally produce a fresh query; no model survives as authority.

## 73. Full-Clear Boundary

Cleared Preview/Events/sources naturally return a grid with uncovered cells and canonical temporal
truth. No ghost cache exists.

## 74. UI Independence

No React, DOM, locale formatter, browser global, or component import.

## 75. Runtime Dependency Assessment

No dependency or calendar library added.

## 76. Bundle Strategy

The unreferenced pure Task 7.1 module does not enter production chunks until Task 7.2 imports it.
No chunk was added; fixed Phase 6 sizes remain exact.

## 77. Reused/Extracted Existing Helpers

Reused canonical window/containing-instant/effective-preference/time parsing and canonical Preview
types. Review's overlap grouping was deliberately not extracted because it allows one occurrence in
multiple day groups, conflicting with Month's governed one-owner semantics.

## 78. Tests Added/Changed

One new focused file with 18 tests covers validation, protected branches, 35/42 geometry,
Sunday/Monday transitions, variable boundaries, before-boundary now, coverage states, all-day/timed
Events, Work/Commitment/Sleep, stale lifetime, friction/unplaced ownership, permutation/clones,
overflow, navigation, and range independence.

## 79. Focused Validation

PASS: 4 discovered files / 46 tests, including the new Month suite plus available canonical
user-day, source-incarnation, Preview/Commitment regression selections. Some requested path names
are colocated or named differently; Vitest executed the four matching repository files.

## 80. Full Validation

PASS: `npm run format`, lint, typecheck, 91 files/952 tests (25.52 s), Vite 8.0.10 build
with 118 transformed modules (330 ms), bundle check, and `git diff --check`.

## 81. Bundle Validation

No new production chunk. See Bundle Matrix.

## 82. Governance Updates

Updated Task result, Phase 7 checkpoint, `CURRENT_STATE.md`, `ROADMAP.md`, and `CHANGELOG.md`.

## 83. ADR Determination

No ADR. Task 7.1 implements Audit 01's existing Month/display-week/user-week decisions.

## 84. Deviations

Selected labels outside the visible grid are invalid rather than silently projected. Protected
Active readiness is a whole-query branch; current architecture does not expose independently trusted
temporal/Event authority under Active protection. Missing exact Commitment identity keeps evidence
but disables its target rather than dropping the occurrence.

## 85. Discoveries

Preview coverage is sufficient through its explicit range. Current Events must be sourced from Active
to retain incarnation/all-day semantics. Review overlap grouping is intentionally unsuitable for
Month one-owner projection.

## 86. Deferred Work

Visible Month, accessibility/keyboard/focus, Task 7.2 application adapter, lazy-loading placement,
browser QA, and UI token budgets remain deferred. DST/cycle resolver behavior remains covered by
canonical resolver suites; Task 7.1 adds transition-duration and before-boundary integration cases.

## 87. Query Contract Matrix

| Input | Required? | Meaning | May mutate authority? |
| --- | ---: | --- | ---: |
| displayed month | Yes | visual month identity | No |
| selected label | No | visible selected user-day | No |
| evaluation instant | Yes | canonical current day | No |
| temporal state | Yes | boundaries/week start | No |
| Preview | nullable | derived geometry/attention | No |
| current Events/sources | Yes | exact current context | No |
| planning range | Yes | explanatory authored context | No |
| availability | default available | protection branch | No |

## 88. Grid Geometry Matrix

| Scenario | Display anchor | First visible label | Cell count | Last visible label |
| --- | --- | --- | ---: | --- |
| Feb 2026 five-row | Sunday | 2026-02-01 | 35 | 2026-03-07 |
| Aug 2026 six-row | Sunday | 2026-07-26 | 42 | 2026-09-05 |
| Sunday-first | Sunday | anchor-derived | 35/42 | complete row |
| Monday-first | Monday | anchor-derived | 35/42 | complete row |
| year boundary | effective anchor | adjacent prior/next year | 35/42 | complete row |

## 89. Temporal Matrix

| Case | Cell label | Canonical start/end | Current marker / ownership |
| --- | --- | --- | --- |
| ordinary | D | consecutive 04:00 starts | containing interval |
| boundary increase | D | 03:00 → next 06:00 (27h fixture) | D once |
| boundary decrease | D | consecutive starts, shortened truth | D once; canonical resolver regression |
| before-boundary now | 2026-08-09 | 04:00 → next 04:00 | 02:00 on Aug 10 marks Aug 9 |
| month boundary | authoritative label | may cross edge | one cell |
| cycle wrap | per-label effective resolver | query does not redefine | one cell |
| DST | actual resolver Dates/duration | no 24h rounding | canonical resolver regression |

## 90. Coverage Matrix

| State | Cell classification | Geometry visible? | Meaning |
| --- | --- | ---: | --- |
| fresh + items | `coveredFresh`, empty false | Yes | generated current plan |
| fresh empty | `coveredFresh`, empty true | No items | generated known empty |
| stale | `coveredStale` | Yes | older generated geometry |
| uncovered | `uncovered` | No Preview geometry | not generated |
| protected/unavailable | query branch | No normal model | truth unavailable |

## 91. Cell Evidence Matrix

| Evidence | Cell summary | Selected-day detail | Exact action target? |
| --- | --- | --- | ---: |
| all-day Event | token/count | full geometry/semantic kind | Yes |
| timed Event | token/count | full geometry | Yes |
| Work | token/count | full geometry | Composite |
| Commitment | token/count | full geometry | Yes/current or stale |
| Sleep | typed Commitment token/count | full geometry | Yes/current or stale |
| friction | attention/count | severity/ID | Yes |
| unplaced | count/detail | exact candidate/source | If exact source exists |

## 92. Exact Target Matrix

| Evidence source | Exact identity fields | Editable if current source missing? | Retarget? |
| --- | --- | ---: | ---: |
| Commitment | template/recurrence IDs + incarnations | No | No |
| Event | Event ID + incarnation | No stale target exists | No |
| Work | composite context | contextual | No singular target |
| friction | exact friction ID | only downstream-resolvable | No |
| unplaced | candidate + exact Commitment | only if current | No |

## 93. Week-Start Matrix

| Scenario | Display anchor | Selected canonical week start | Grid rotates? | Metadata |
| --- | --- | --- | ---: | --- |
| Sunday stable | Sunday | Sunday | No | differs false |
| Monday stable | Monday | Monday | No | differs false |
| Sunday → Monday | Sunday | Monday later | No | differs true |
| Monday → Sunday | Monday | Sunday later | No | differs true |
| repeating wrap | M-01 | per-label resolver | No | as applicable |

## 94. Ordering Matrix

| Class | Primary order | Secondary | Tie-break |
| --- | --- | --- | --- |
| all-day Events | class first, then start | end/title | exact ID |
| timed Events | start | end/title | exact ID |
| Work | start | end/title | occurrence ID |
| Commitments/Sleep | start | end/kind/title | exact occurrence/source ID |
| attention | domain severity/title | stable kind | exact ID |

## 95. Authority Matrix

| Source | Read? | Purpose | Written? |
| --- | ---: | --- | ---: |
| Active temporal/source context | Yes | time/exact lifetime | No |
| Manual Events | Yes | current Event truth | No |
| Preview | Yes | generated geometry/attention | No |
| PlanDecision | indirect only | already reflected in Preview | No |
| HistoricalPlan | No | excluded | No |
| ExecutionHistory | No | excluded | No |
| Progress | No | excluded | No |
| canonical resolvers | Yes | user-day/current/week truth | No |

## 96. Exclusion Matrix

| Capability/source | Included? | Reason |
| --- | ---: | --- |
| HistoricalPlan geometry | No | current Planner uses Preview |
| execution outcomes | No | Today |
| progress | No | Summary/Goal context |
| Capacity/Allocation | No | undefined |
| Recommendations | No | future policy |
| drag/drop | No | no direct authority |
| Month persistence | No | transient view state |

## 97. Performance Matrix

| Operation | Intended/actual complexity | Whole rescan per cell? |
| --- | --- | ---: |
| label generation | O(cells) | No |
| occurrence indexing | O(occurrences) | No |
| Event indexing | O(events) | No |
| friction indexing | O(friction + participant refs) | No |
| cell projection | O(cells + visible evidence sorting) | No |
| selected detail | indexed lookup | No |

## 98. Bundle Matrix

| Metric | Phase 6 baseline | Task 7.1 | Delta | Guard |
| --- | ---: | ---: | ---: | ---: |
| Initial raw | 648,706 | 648,706 | 0 | 685,000 |
| Initial gzip | 164,373 | 164,373 | 0 | 170,000 |
| Largest lazy | 51,445 | 51,445 | 0 | 100,000 |
| Total JS | 746,424 | 746,424 | 0 | 750,000 |

## 99. Product-Boundary Matrix

| Capability | Task 7.1 |
| --- | --- |
| pure model/display week/selected day/coverage | Implemented |
| exact targets | Metadata only |
| Month UI/navigation migration/editing | Prohibited |
| generation/persistence/history backfill | Prohibited |
| outcomes/progress/Capacity/Recommendations/direct manipulation | Prohibited |

## 100. Epistemic Matrix

| Evidence/state | Month may say | Must not say |
| --- | --- | --- |
| covered items | generated plan exists | executed |
| covered empty | no planned items in generated plan | free/available |
| uncovered | not generated | free |
| stale | older authored basis | invalid |
| protected | evidence unavailable | empty |
| all-day | authored all-day canonical user-day | civil-midnight event |
| unplaced | candidate not placed | insufficient Capacity |
| friction | deterministic attention | Recommendation |
| current marker | canonical interval contains now | necessarily civil today |
| recreated source | distinct current incarnation | same stale source |

## 101. Architectural Invariant Assessment

| Invariants | Classification |
| --- | --- |
| 1–12 purity/authority/source roles | Implemented and covered by test |
| 13–30 civil/canonical/display-week/grid semantics | Implemented and covered by test |
| 31–45 coverage/empty/stale/ownership/all-day/exact identity | Implemented and covered by test |
| 46–58 no title/time retarget; deterministic/clone isolation | Implemented and covered by test |
| 59–69 bounded projection/explicit instant/range/navigation purity | Implemented/preserved |
| 70–82 persistence/dependency/resolver/reuse boundaries | Preserved |
| 83–92 UI/direct manipulation/future policy exclusions | Prohibited and preserved |
| 93–99 future UI support/exact projection/indexing | Implemented |
| 100–103 full validation/fixed bundles | Confirmed |
| 104 no invented prerequisite | Confirmed |
| 105 Task 7.2 readiness | Confirmed |

## 102. Stop-Condition Assessment

No stop condition fired: Preview proves coverage; `userDayDate` proves one owner; exact source
incarnations survive; M-01 preferences resolve; HistoricalPlan is unnecessary; readiness branches
protect unavailable input; visual rows remain isolated; no dependency/store/scheduler change; bundle
guards remain green.

## 103. Architectural Alignment Assessment

Aligned with Audit 01 and Phase 6. The query projects current truth, preserves exact identity and
piecewise time, and leaves all writes and surface roles unchanged.

## 104. Task 7.2 Readiness

Ready. Task 7.2 can render an accessible read-only Month and selected-day Review without deriving
coverage, ownership, identity, display-week, current-day, or canonical-window semantics in React.

## 105. Recommended Next Task

**Task 7.2 — Accessible Monthly Planner Shell and Selected-Day Review Workspace.** Keep current
Plan/Review presentation reachable during strangler migration.

## 106. Final Completion Determination

Task 7.1 is complete: the model is pure, deterministic, clone-isolated, indexed, exact-identity
safe, temporally canonical, coverage-explicit, authority-bounded, UI-independent, dependency-free,
and within unchanged bundle guards.

> **Before the Monthly Planner becomes visible, DayFrame must be able to answer what every month
> cell means without asking the UI to invent the answer.**
