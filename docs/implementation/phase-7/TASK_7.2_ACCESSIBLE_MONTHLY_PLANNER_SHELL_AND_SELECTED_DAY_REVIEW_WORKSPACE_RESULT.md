# Task 7.2 — Accessible Monthly Planner Shell and Selected-Day Review Workspace Result

## 1–10. Executive Result, Integrity, Prerequisite, Audit, and Shell

**Result: complete.** The immutable task artifact has SHA-256
`b58fc298f895f37d89c30156c696e2b9e3c73569183ba13411fe4430fbb50e3d`.
Task 7.1 was confirmed as the sole Month semantics owner before implementation. The
existing Planner shell, Plan/Review modes, lazy boundaries, CSS breakpoints, recovery
states, canonical time resolvers, and fixed bundle guards were audited. Files added are
the state adapter, Month surface/tests, this result, task artifact, and checkpoint;
Planner composition, CSS, governance, Task 7.1 selection projection, and regression
tests were changed. The header exposes month identity and previous/current/next actions.

## 11–21. Navigation, Grid, Focus, Labels, and State

The adapter snapshots an explicit evaluation instant and derives initial displayed and
selected labels from the canonical current user-day. Task 7.1 supplies weekday order,
35/42 geometry, adjacent labels, current/selected truth, and cell summaries. The UI is
an ARIA `grid` with seven `columnheader`s and button `gridcell`s, exactly one roving
tab stop, `aria-current=date`, `aria-selected`, and bounded date/coverage/evidence
names. Arrow, Home/End, PageUp/PageDown, Enter, and Space are implemented. Keyboard
cross-month movement preserves focus; header navigation preserves header focus.
Current and selected remain independent.

## 22–41. Coverage and Cell Evidence

Adjacent cells remain selectable and change the displayed month. Fresh, stale,
generated-empty, uncovered, protected, and unavailable states remain explicit. A
desktop cell shows at most three deterministic Task 7.1 tokens plus overflow; narrow
cells retain date, coverage/attention indicators, and accessible summaries. All-day
Event, timed Event, Work, Sleep, and Commitment evidence is read only. Needs-attention
and unplaced counts are exposed without implying recommendations, completion, free
time, or impossibility. Month status reports full/partial/no coverage and planning-range
context. Generation remains an existing Plan/Review workflow, never a Month side effect.

## 42–57. Selected-Day Workspace and Responsive Layout

The selected canonical user-day shows its civil heading, exact canonical start/end,
actual duration, boundary/week-start context, coverage/freshness, all-day evidence,
ordered planned occurrences, friction, and unplaced items. Empty and uncovered copy is
epistemically distinct. Desktop uses a grid/workspace split, tablet stacks both, and
narrow phones show the compact grid followed by readable detail. No horizontal page
overflow occurred at 320, 375, 390, 430, 1024, or 1440 px. One spatial cell still
represents each variable-duration user-day.

## 58–77. Composition, Loading, and State Lifecycle

`DayVisualizer` was rejected for Month because a compact agenda is clearer and much
smaller. Month is a discoverable third Planner mode; Plan remains the default during
this strangler step and Plan/Review remain functional. The Month surface and adapter
form a dedicated lazy chunk with truthful `Loading Planner…` Suspense UI. Invalid query
is an application recovery alert; protected/unavailable never renders fake cells.
Displayed, selected, focused, and evaluation state is ephemeral and non-persistent.
The evaluation instant is captured on entry and refreshed by the current-day action;
there is deliberately no timer. Authoritative profile/restore/clear changes requery
props, preventing retained occurrence projections.

## 78–92. Validation, QA, Governance, and Deviations

Focused adapter/Month/Planner/app suites passed. Full validation passed Prettier,
ESLint, TypeScript, 93 test files and 960 tests, production build, and bundle guards.
Production Chromium confirmed 35-cell geometry (42 is covered in automated query/UI
tests), one current/selected/tab-stop cell, zero Month write controls, lazy chunk load,
keyboard focus/selection, and no overflow at every required width. The accessibility
tree exposed one grid, seven headers, 35 named grid cells, selected-day heading, and
coverage text. Throttled 3G showed `Loading Planner…` and then the grid. Piecewise
long/short transition geometry and fixed week columns are covered deterministically by
Task 7.1 and component tests; the production fixture could not author a valid transition
setup and this browser limitation is recorded rather than reported as a false pass.

Bounded bundle remediation removed dormant execution-reporting composition from
`PreviewScreen`; production never supplied its optional reporting store, while Today
and Summary remain the reporting surfaces. The existing compact Preview calendar was
retained after regression evidence proved it was not an exact duplicate. No ADR was
needed: authority and temporal decisions are unchanged. Governance and the Phase 7
checkpoint are updated. Contextual writes, direct manipulation, background rollover,
URL state, and final Plan/Review retirement remain deferred.

## 93. Navigation Matrix

| Action | Displayed month | Selected label | Authority |
| --- | --- | --- | --- |
| Previous/next | changes | clamps to same day number | unchanged |
| Core cell | unchanged | changes | unchanged |
| Adjacent cell | changes | changes | unchanged |
| Current day | changes if needed | changes | unchanged |
| Arrow | changes only across edge | unchanged until activation | unchanged |
| PageUp/PageDown | changes | changes to corresponding/clamped label | unchanged |

## 94. Coverage Presentation Matrix

| Coverage | Cell | Selected day | Implies free? |
| --- | --- | --- | --- |
| Fresh + items | tokens/count | current planned evidence | No |
| Fresh empty | generated-empty | no planned items in generated schedule | No |
| Stale | stale marker + retained tokens | older-setup warning + evidence | No |
| Uncovered | Not generated | no schedule coverage | No |
| Protected/unavailable | no grid, recovery alert | no fake detail | No |

## 95. Cell Evidence Matrix

| Evidence | Desktop | Mobile | Selected day |
| --- | --- | --- | --- |
| All-day/timed Event | ordered token | indicator/accessible summary | all-day or timed row |
| Work/Commitment/Sleep | ordered token | indicator/accessible summary | timed row |
| Needs attention/unplaced | count indicator | count indicator | full read-only list |

## 96. Selected-Day Matrix

| Case | Heading | Coverage | Temporal detail | Planned detail |
| --- | --- | --- | --- | --- |
| Ordinary | civil label | fresh/stale | exact window/duration | ordered evidence |
| Generated empty | civil label | generated | exact | explicit no-items copy |
| Uncovered | civil label | not generated | exact | no fake empty geometry |
| Stale | civil label | older setup | exact | retained evidence |
| Long/short transition | civil label | truthful | actual non-24h duration | canonical evidence |
| Week transition | civil label | truthful | effective week context | fixed display columns |

## 97–100. Keyboard, Focus, Responsive, and Loading Matrices

| Key | Result | Selection | Authority |
| --- | --- | --- | --- |
| Arrows | ±1/±7 focus | No | No |
| Home/End | visual row edge | No | No |
| PageUp/PageDown | adjacent month/corresponding focus | Yes | No |
| Enter/Space | select focus | Yes | No |

| Interaction | Focus result |
| --- | --- |
| Open Month | one roving selected-date tab stop |
| Header navigation | triggering control retained |
| Current action | action retained; grid tab stop moves current |
| Select/cross-month arrow | selected/focused cell |
| Protected | recovery alert, no fake grid |
| Lazy completion | activating navigation remains coherent |

| Width | Cell content | Layout | Detail placement |
| --- | --- | --- | --- |
| 320/375/390/430 | compact indicators | seven columns, no overflow | below grid |
| Tablet | full useful tokens | stacked | below grid |
| Desktop | up to three tokens + overflow | split | beside grid |

| Area | Loading | Authority duplication |
| --- | --- | --- |
| Planner shell | eager | No |
| Month + Task 7.1 adapter | lazy, `Loading Planner…` | No |
| Plan/Today/Summary | existing lazy boundaries | No |

## 101. Bundle Matrix

| Metric | 7.1 baseline | 7.2 final | Delta | Guard |
| --- | ---: | ---: | ---: | ---: |
| Initial raw | 648,706 | 630,499 | -18,207 | 685,000 |
| Initial gzip | 164,373 | 160,954 | -3,419 | 170,000 |
| Largest lazy | 51,445 | 51,479 | +34 | 100,000 |
| Total JS | 746,424 | 749,882 | +3,458 | 750,000 |

Month chunk: 21,602 raw / 6.65 kB gzip. All fixed guards pass; total headroom is
118 bytes.

## 102–104. Authority, Product Boundary, and Epistemic Matrices

| Source | Reads | Writes | Purpose |
| --- | ---: | ---: | --- |
| Active setup / Events | Yes | No | temporal and current Event truth |
| Preview / indirect PlanDecision | Yes | No | geometry and attention |
| HistoricalPlan / Execution / Progress | No | No | excluded |
| Month view state | ephemeral | no durable write | navigation |

| Capability | Result |
| --- | --- |
| Month, selection, keyboard, mobile, exact evidence | Implemented |
| Contextual writes, friction resolution, retirement | Deferred |
| Direct manipulation, Month authority, generation changes, outcomes/progress | Prohibited |

| State | May say | Must not say |
| --- | --- | --- |
| Items/empty | planned / no planned items | executed / free |
| Uncovered/stale | not generated / older setup | nothing planned / invalid |
| Protected | unavailable | empty |
| Event/unplaced/attention | all day / not placed / needs attention | midnight span / impossible / recommendation |
| Current | current DayFrame day | necessarily civil today |

## 105–110. Final Assessment

All architectural invariants hold: Month consumes Task 7.1; React does not rederive
canonical geometry; all navigation and selection are write-free; planning range,
Preview freshness, generation, persistence, HistoricalPlan, ExecutionHistory, and
Progress are unchanged; no dependency or authority was added. No stop condition fired:
all guards pass and existing Planner workflows remain reachable. Task 7.2 is therefore
architecturally aligned and complete. Task 7.3 is ready to define bounded contextual
authoring handoffs using the exact targets already projected by Task 7.1.
