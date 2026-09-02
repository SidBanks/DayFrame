# Phase 7 Audit 01 Result — Monthly Planner Primary Surface Architecture and Interaction Model

## 1. Executive Findings

**Outcome A — Monthly Planner Architecture Ready.** A true month calendar should become
Planner's dominant spatial/navigation surface, replacing `Plan` and `Review Schedule` as
permanent sibling modes after their responsibilities migrate. Selecting a civil date selects
that label's canonical user-day and opens a contextual workspace. The calendar is a pure,
non-durable projection: it does not publish, place, rank, report outcomes, or create a month
authority. Explicit Generate/Refresh continues to derive Preview over an independently authored
planning range.

The first implementation task should build a pure month read model and its invariant/property
tests. It should not yet replace the visible Planner.

## 2. Artifact Integrity

The supplied artifact and immutable repository copy both have SHA-256
`0bdf58538089282ff5be7ed86e66cdd5da7348cc443aaaa468289fa78e121982`.

## 3. Phase 6 Prerequisite Confirmation

Phase 6 is complete and publication-ready. Its checkpoint records real-browser desktop,
320/375/390/430 px, keyboard, accessibility-tree, slow-loading, workflow, and 22/24/26-hour
validation, plus 90 files/934 tests. Planner/Today/Summary ownership, exact contextual identity,
variable user-days, and lazy surface boundaries are sufficient prerequisites.

## 4. Files/Symbols Reviewed

Representative evidence: `DayFrameApp` (`plannerMode`, `selectedPreviewDayRange`,
`handleCompactPreviewDayClick`, contextual editor targets); `PlannerSurface`; `PreviewScreen`
(`buildDayGroups`, occurrence/friction actions); `SetupScreen`; `CommitmentSection`;
`DayVisualizer`; canonical user-day/user-week and effective-preference resolvers; Preview,
HistoricalPlan, Today, Summary, Goal, Progress, persistence, profile, restore, full-clear, tests,
bundle configuration, Phase 6 results/checkpoints, and the Month Planner design specification.

## 5. Current Planner Composition

Planner is the eager default and has two modes. `Plan` contains Goal and lazy setup/authoring;
`Review Schedule` contains range controls, generation, a compact date strip, selected-range
filtering, Events, planned geometry, unplaced evidence, and friction resolution. `DayFrameApp`
owns their transient navigation and shared Setup draft.

## 6. Current Plan Responsibilities

Plan owns Goal/measurement/progress authoring, Commitment inventory and draft editing, Work and
schedule preferences, planning range, advanced cycles/templates, profiles, Save Setup, and
Generate Schedule. These are valid Planner responsibilities but not a coherent permanent mode.

## 7. Current Review Schedule Responsibilities

Review owns Preview status and generation, selected-day/range inspection, Events, Work and
Commitment handoffs, variable-duration detail, unplaced attention, friction Try, and bounded
Apply Planning Change. It is already the main source of Month projection behavior.

## 8. Existing Calendar Architecture

The current compact Preview day strip is range-bound and status-oriented, not a semantic month
grid. It supports single/range selection and opens a selected-day Event panel. `PreviewScreen`
then renders all selected day groups. No current component supplies grid navigation, adjacent
month cells, display-week policy, roving focus, or month-level overflow.

## 9. Monthly Planner Product Hypothesis Assessment

Accepted. A month makes derived planning geometry spatially understandable and reduces mode
switching. It remains a presentation horizon: DayFrame's schedule horizon is arbitrary, user-day
ownership may cross midnight, and cycles/user-weeks may cross month edges.

## 10. Primary-Surface Determination

**Dominant Planner surface.** Do not add Month as a third permanent Planner mode. During staged
migration the old modes may coexist behind explicit fallback links, but the end state is Month +
contextual workspace.

## 11. Plan/Review Convergence Assessment

Convergence is feasible with unchanged authorities. Month absorbs date orientation, status, and
selection. The contextual workspace absorbs review detail and bounded authoring. Planner-level
controls expose Goals, planning range, preferences, Work, and advanced configuration without
pretending they belong to one selected day.

## 12. Contextual Workspace Architecture

Use one application-owned discriminated navigation state containing mode, selected user-day,
exact optional source target, and return focus token. It is non-durable and revalidated after
lazy load, restore, profile replacement, clear, or source mutation. It never becomes authority.

## 13. Selected User-Day Semantics

The selected cell label `D` resolves to the canonical half-open interval
`[start(D), start(D+1))` using effective piecewise preferences. Selection is a label, not
midnight-to-midnight elapsed time and not a persisted preference.

## 14. Month Grid vs User-Day Geometry

The grid is a civil-date index. It cannot truthfully encode 22/24/26-hour or boundary-transition
geometry in equal cells. The selected-day workspace resolves and states the exact window and
duration; `DayVisualizer` renders elapsed geometry.

## 15. User-Week Interaction

Canonical user-week calculations continue to resolve the effective `weekStartsOn` for the
relevant label. Month rows are visual rows only and never scheduling/user-week buckets.

## 16. Month Semantics

A displayed month is the set of civil labels whose year/month matches the heading plus optional
adjacent labels needed to fill complete visual rows. It is neither a fixed elapsed interval nor a
publication, capacity, allocation, or recurrence boundary.

## 17. Month Navigation

Previous/next month and a current-user-day affordance only change view/selection. Navigation may
leave Preview coverage without regenerating or marking Preview stale. Preserve the preferred
day-of-month where possible, clamping deterministically.

## 18. Planning Range Relationship

The authored inclusive planning range remains independent. Navigating Month never edits it.
Generate/Refresh shows the range it will use; a user must explicitly edit/save that range before
generating different coverage.

## 19. Month Read-Model Assessment

A new pure application read model is required, but it is an implementation slice rather than an
architecture prerequisite. It should project a bounded 35/42-cell grid plus selected-day detail,
coverage/status summaries, deterministic overflow, and exact interaction targets.

## 20. Read-Model Authority Sources

Active supplies authored setup, Events, temporal preferences, Goals, and exact current sources;
Preview supplies current derived planned geometry/friction; transient view state supplies month
and selection. HistoricalPlan, ExecutionHistory, Progress, and Today are not Month plan sources.

## 21. Preview Role

Preview remains the current derived schedule projection, fresh or stale, and supplies Work,
scheduled Commitments, unplaced candidates, and friction. Month may summarize it without cloning
its authority or silently regenerating it.

## 22. HistoricalPlan Boundary

HistoricalPlan remains immutable publication history and the effective frozen plan source for
Today/Summary. It must not backfill current Planner cells when Preview is absent or uncovered.

## 23. Today Boundary

Today remains current-user-day execution and outcome reporting over HistoricalPlan. Planner's
current-day affordance navigates; it does not import execution writes or Today's publication view.

## 24. Summary Boundary

Summary remains read-only historical interpretation. Goal progress/outcomes may not appear as
Month-cell schedule facts; contextual links may navigate to Summary.

## 25. Month Cell Information Architecture

Always show date and selection/current markers. Show compact deterministic indicators/counts for
covered Work, Commitments, Events/all-day Events, and attention. Show stale and uncovered at cell
scope. Reserve complete labels, times, provenance, and actions for the workspace.

## 26. Occurrence Density

Use a fixed visible token budget by breakpoint and aggregate overflow as `+N more`. Counts derive
from the full semantic collection, never from DOM clipping. Narrow phones use category/status
indicators rather than occurrence rows.

## 27. Cell Ordering

Order: all-day Events; timed Events; Work; scheduled Commitments; attention/status. Within a
class, sort by canonical start, then end, semantic kind, title, and exact stable identity. Input
order never decides output.

## 28. All-Day Presentation

All-day Event means the entire canonical user-day label and appears once in its owning cell with
an “All day” semantic label. Do not fabricate midnight endpoints or stretch it across civil dates.

## 29. Cross-Boundary Occurrences

Show an occurrence once under canonical owning `userDayDate`; selected detail may truthfully show
its clock dates and continuation. Do not split or duplicate authority across cells.

## 30. Work Presentation

Work is a composite projection from shifts/cycles and appears as read-only planned geometry.
Activation opens the composite Work configuration, never an occurrence-placement editor.

## 31. Sleep Presentation

Sleep remains a Commitment/template projection with truthful timing and may receive a visual
kind, but no new Sleep authority or transition-planning semantics. Activation targets its exact
authored source.

## 32. Commitment Interaction

Activating a Commitment opens exact template + recurrence incarnations. Revalidate after lazy
load; missing/recreated sources produce stale-target guidance and never retarget.

## 33. Event Interaction

Activating an Event opens the singular manual-Event writer with exact identity/incarnation.
All-day/timed semantics and immediate durability stay unchanged.

## 34. Work Interaction

Activating Work opens Work configuration for the selected date's context. Editing changes the
shared Setup draft; Save Setup and later explicit generation remain distinct.

## 35. Friction Interaction

Attention opens bounded evidence and existing deterministic options. Try is non-durable; Apply
Planning Change is explicit and bounded; neither is a Recommendation.

## 36. Unplaced Interaction

Unplaced Commitments belong in a Month-level attention tray and, when a canonical candidate day
exists, selected-day detail. Never display “uncovered” or empty space as proof that placement is
possible.

## 37. Add Event

An empty or selected day offers Add Event prefilled with that user-day label through the existing
Event authority. Saving does not directly place a derived Commitment.

## 38. Add Commitment

Add Commitment opens contextual authoring over the existing Setup draft. A selected day may be
context, not an implicit fixed placement or recurrence rule.

## 39. Edit/Return Context

Capture selected label, displayed month, invoking target, and focus return token. On close, return
to the invoking cell/occurrence if valid, otherwise the selected cell, then the Month heading.

## 40. Direct Manipulation Boundary

No drag/drop, resize, direct occurrence placement, or implicit authored time mutation is
authorized. Future direct manipulation requires a separately governed intent-editing command.

## 41. Replanning Interaction

Authored changes make Preview stale by existing rules. Keep stale geometry visible and labeled;
the user explicitly refreshes. Month navigation and selection never stale Preview.

## 42. Stale Schedule Presentation

Show a Planner-level stale banner and per-covered-cell stale treatment. Do not erase geometry,
label it current, or confuse stale with uncovered/protected.

## 43. Generate/Refresh Placement

Place one prominent Planner-level action near Month heading/status, stating the authored planning
range. In contextual attention, link back to the same action rather than duplicating commands.

## 44. Contextual Workspace Modes

Required modes: month overview, review day, add/edit Commitment, add/edit Event, edit Work,
resolve friction, and Planner configuration. Goal detail, measurement, progress reporting,
planning range, preferences, profiles, and advanced setup are Planner-level contextual modes.

## 45. Desktop Architecture

Use a full month grid as the dominant column and a stable adjacent workspace (approximately
one-third width). Workspace mode changes must not remount the Month or lose roving focus.

## 46. Mobile Architecture

Adopt the minimal-indicator month grid plus selected-day agenda/workspace below it. This preserves
month orientation without horizontal scrolling or a dense desktop grid. Editors replace the
agenda region and provide an explicit Back to selected day action.

## 47. Mobile Density

At narrow widths show date, current/selected state, up to a small fixed set of category dots, and
attention/coverage semantics in the accessible name. Full occurrence lists appear below.

## 48. Accessibility Architecture

Implement the calendar as a labelled `grid` with weekday headers, rows, and date gridcells; one
roving-tabindex date control; distinct selected/current states; an announced heading/status; and
workspace regions with meaningful headings. Color is never the only signal.

## 49. Keyboard Calendar Model

Arrows move ±1/±7 days; Home/End move to visual row edge; Page Up/Down move a month while
preserving/clamping day; Ctrl/Meta+Page Up/Down may move a year; Enter/Space selects/opens the day.
Do not make every compact occurrence a tab stop; selected-day detail owns occurrence activation.

## 50. Focus Architecture

Month change focuses the corresponding date and announces the month. Opening a workspace focuses
its heading or first invalid field. Closing returns deterministically. Destructive confirmations
retain modal focus. Lazy failures leave a retryable focused region.

## 51. Lazy-Loading Assessment

Keep the Planner shell, Month navigation, read-model types/query, and recovery eager. Keep current
Plan authoring lazy and split heavy contextual editors/detail at stable workflow boundaries.
Preload on intent only; authority/revalidation stays outside lazy modules.

## 52. Bundle Architecture

Total JS has only 3,576 bytes of guard headroom. Month implementation must initially reuse React,
CSS, native date helpers, and existing modules with no runtime dependency. New contextual code
must replace or remain inside existing lazy chunks; do not duplicate old and new heavy surfaces
indefinitely.

## 53. Existing Component Reuse

Reuse behavior/query helpers and editors before visual containers: Preview grouping/friction,
Commitment and Event flows, Goal sections, Setup draft commands, loading/error boundaries, and
time display. `PlannerSurface`, compact strip, and monolithic `PreviewScreen` are migration
sources, not required final containers.

## 54. DayVisualizer Role

Retain it in selected-day Review as the truthful variable-duration geometry view. Do not render a
visualizer in each Month cell or use it as the calendar grid.

## 55. Projection Performance

Build one indexed projection per relevant authority revision, then derive 35/42 cells in linear
time over visible occurrences plus cells. Avoid per-cell full-array scans and repeated timezone
resolution during render. Memoization is an optimization, not semantic state.

## 56. Determinism

Explicit inputs include displayed month, selected label, now/cutoff, authored snapshot, Preview,
and temporal resolver. Stable comparators, fixed overflow, and explicit status precedence make
equal semantic inputs produce equal output.

## 57. Clone Isolation

The query returns newly owned read-model objects and arrays; consumers cannot mutate store or
Preview values. Tests must mutate outputs and prove subsequent queries/source snapshots unchanged.

## 58. Partial Availability

Each cell independently represents covered, uncovered, stale-covered, or protected/unavailable.
A partly covered month remains navigable and never collapses to one month-wide empty state.

## 59. Empty-Day Semantics

Generated empty means Preview covers the user-day and has no visible items/attention. It is not
free capacity, uncovered, unavailable, or evidence of execution.

## 60. Past-Date Semantics

Past Preview geometry is still a generated proposal, not proof of what happened. Month does not
merge HistoricalPlan or outcomes into it; offer Summary for settled evidence.

## 61. Future-Date Semantics

Future uncovered means “Not generated,” never “Available.” Covered geometry remains derived and
subject to staleness.

## 62. Current-Date Semantics

Resolve the current user-day label from the canonical instant resolver, not local civil midnight.
Use `aria-current="date"`; distinguish it visually and semantically from selection.

## 63. Month Heading Semantics

The heading names the displayed civil month/year. If selection is an adjacent-month cell, retain
the displayed heading until explicit/keyboard navigation changes the displayed month, and state
the selected full date separately.

## 64. Cross-Month Selection

Arrow movement across an edge changes the displayed month and preserves the newly focused and
selected label only when selection is explicitly activated. Selection and focus are distinct.

## 65. Adjacent-Month Cells

Show adjacent labels to complete visual rows, visibly de-emphasized but fully selectable and
truthful. They use the same read model/status rules; activation navigates the heading to their
month and selects them.

## 66. Week-Start Policy

For a displayed month `M`, resolve one **display-week anchor** from the effective `weekStartsOn`
at `M-01`. Use it for weekday columns and visual rows. This is presentation policy only; label it
in the read model and never pass row membership to scheduler/user-week logic.

## 67. Variable Week-Start Transition

If effective `weekStartsOn` changes within the month, keep columns stable under the month anchor,
surface a transition notice in contextual detail, and compute each selected label's canonical
user-week independently. Do not rotate columns mid-grid or guess a blended week.

## 68. Shift-Transition Context

The workspace may state effective boundary/week-start changes and exact day duration using
existing resolvers. It must not infer transition adaptation or advice.

## 69. Transition Recommendation Readiness

The attention/workspace insertion point can later host governed transition recommendations.
Current friction options remain separate; no transition policy is required for Month V1.

## 70. Capacity Readiness

Cells and selected-day summaries have a future derived-evidence slot, but “empty” cannot be used
as Capacity. A defined read model/policy is required first.

## 71. Planned Allocation Readiness

Selected-day/month summaries can later consume a defined allocation projection. No denominator,
target, or Goal weighting is inferred now.

## 72. Recommendation Readiness

The contextual workspace can host explainable proposals with explicit Try/Apply semantics after
their policy is governed. Friction resolution is not renamed Recommendation.

## 73. Pattern Library Boundary

Pattern reuse remains contextual to Add/Edit Commitment or advanced Planner configuration. It is
not a primary destination or Month-cell evidence.

## 74. Goal Reorientation Boundary

Goal authoring stays Planner-level and scheduling-independent. Future reorientation must be an
explicit authored change followed by stale Preview and explicit generation; Month never ranks.

## 75. Daily Workspace Relationship

Today remains the richer current-user-day execution workspace. Planner selected-day detail is
planning/review for any label. Shared visuals/read helpers may be reused without sharing write
authority.

## 76. Naming Determination

Primary destination remains **Planner**. Within it use **Month**, **Selected day**, **Planning
range**, **Generate schedule/Refresh schedule**, **Needs attention**, and product nouns. Keep
Preview and Setup as internal names where honest.

## 77. Implementation Slice Recommendation

Slice vertically: (1) pure Month read model/tests; (2) accessible read-only Month shell with
selected-day Review; (3) contextual authoring; (4) attention/configuration migration; (5) remove
old Plan/Review navigation and complete browser/bundle QA.

## 78. Migration Strategy

Use strangler migration inside Planner. First render Month behind a bounded internal integration,
reuse current Review/editor commands, then relocate each responsibility. Keep old modes reachable
until replacement parity is tested; remove duplicated presentation promptly to protect total JS.

## 79. Transitional UI Debt

Temporary old/new navigation, duplicate date selection, and dual Review composition are accepted
only with named removal slices. No duplicate command, draft, persistence, or authority is allowed.

## 80. Persistence Boundary

Displayed month, focus, selection, workspace mode, return token, overflow expansion, and editor
targets remain transient. Do not change state schema, IndexedDB, or Backup for view state.

## 81. Profile Boundary

Profile activation continues to replace governed authored setup. It invalidates stale contextual
targets and recomputes Month; it does not restore Month view state as authority.

## 82. Restore Boundary

Restore retains existing authority/version behavior, invalidates transient targets/query caches,
and chooses a safe current-user-day Month state. No Backup version change is justified.

## 83. Full-Clear Boundary

Full clear removes canonical data through the existing command and clears Month transient state,
targets, and caches. The resulting cells are uncovered, not generated-empty.

## 84. Protection/Error Boundary

Protected/unavailable sources remain distinct from absence and disable writes that require them.
The shell and navigation stay available; errors are actionable without exposing quarantined data.

## 85. Testing Architecture

Add pure query unit/property tests, component interaction/accessibility tests, application
navigation/identity/lifecycle tests, store invariants, responsive CSS assertions, and production
browser QA. Existing Phase 6 suites remain regression gates.

## 86. Canonical Fixtures

Required fixtures: ordinary 24-hour day; 22/26-hour DST days where supported; boundary increase
and decrease; before-boundary now; month/year edge; cycle wrap; Sunday/Monday transitions; 35/42
cell months; generated-empty/uncovered/stale/protected; dense collisions; all-day/cross-midnight;
exact current/recreated targets; restore/profile/full-clear.

## 87. Property Invariants

Assert contiguous canonical windows, one owning cell per occurrence, stable semantic output under
input permutation, fixed display columns, canonical user-week independence from rows, bounded
overflow, clone isolation, navigation purity, and no writes from selection.

## 88. Performance Assessment

Architecture is bounded and ready if projection indexes once and renders only one grid plus one
workspace. Establish a representative dense-month fixture and measurement before optimizing;
reject O(cells × all occurrences) implementations.

## 89. Bundle Assessment

Architecture is viable but bundle-constrained. Initial raw has 36,294 bytes headroom and gzip
5,627; total JS has only 3,576. No dependency is justified, and old/new heavy presentation cannot
ship together at completion. Bundle checks are a per-slice prerequisite.

## 90. Architecture Stop-Condition Assessment

No stop condition remains. The display-week anchor resolves the only potentially blocking Month
semantics without changing canonical user-week truth. Any implementation that needs direct
placement, auto-generation, persisted view state, or invented Capacity/Recommendation semantics
must stop for separate governance.

## 91. Architectural Alignment Assessment

The design preserves Planner/Today/Summary, Active/Preview/HistoricalPlan boundaries, exact
identity, canonical temporal ownership, explicit generation, and user-authored intent. It aligns
with the Month Planner product direction while rejecting authority claims in the older design
language that current architecture does not support.

## 92. Recommended Phase 7 Sequence

1. Pure Monthly Planner projection and display-week semantics.
2. Accessible read-only Month shell and selected-day Review workspace.
3. Contextual Commitment/Event/Work authoring with exact return context.
4. Friction, unplaced, Goals, planning range, preferences, and advanced configuration migration.
5. Remove Plan/Review split; browser/mobile/accessibility/performance/bundle publication audit.

## 93. Recommended First Implementation Task

**Task 7.1 — Canonical Monthly Planner Read Model and Display-Week Projection.** Build no writes
and minimal/no UI. Accept explicit inputs; return a 35/42-cell civil grid, selected canonical
window, display-week anchor, coverage/freshness, deterministic evidence summaries/overflow, and
exact targets. Prove temporal, authority, determinism, clone, and performance invariants.

## 94. Open Questions

Non-blocking product choices remain: final visual token budget, whether adjacent cells default to
six rows, desktop workspace width, and whether Goal configuration lives in a drawer or full
contextual panel. Resolve through implementation/QA without changing the governed semantics.

## 95. Final Audit Determination

## Outcome A — Monthly Planner Architecture Ready

The dominant Month surface, contextual workspace, pure read-model boundary, anchored display-week
policy, responsive/accessibility model, and constrained bundle path are sufficiently resolved.
Proceed with Task 7.1 above; do not begin with production interaction or authority changes.

## Responsibility Migration Matrix

| Responsibility | Current surface | Proposed Monthly Planner location | Authority unchanged? | Migration timing |
| --- | --- | --- | ---: | --- |
| Date/range orientation | Review strip | Month + planning-range control | Yes | Slice 2 |
| Schedule status/generation | Plan/Review | Month header | Yes | Slice 2 |
| Selected-day geometry | Review | Review-day workspace | Yes | Slice 2 |
| Commitment authoring | Plan | Contextual Add/Edit Commitment | Yes | Slice 3 |
| Event authoring | Review day | Contextual Add/Edit Event | Yes | Slice 3 |
| Work configuration | Plan handoff | Contextual Work | Yes | Slice 3 |
| Friction/Try/Apply | Review | Resolve-friction workspace | Yes | Slice 4 |
| Unplaced evidence | Review | Attention tray/workspace | Yes | Slice 4 |
| Goals/measurement/progress | Plan | Planner-level contextual workspace | Yes | Slice 4 |
| Preferences/range/profiles/advanced | Plan | Planner configuration | Yes | Slice 4 |
| Plan/Review mode navigation | Planner header | Removed after parity | N/A | Slice 5 |

## Month Cell Matrix

| Evidence type | Show in cell? | Representation | Interaction | Authority |
| --- | ---: | --- | --- | --- |
| date | Yes | number + full accessible label | select user-day | Civil label + canonical resolver |
| Work | Yes | compact token/count | open Work context | Preview projection |
| Commitment | Yes | compact token/count | exact edit | Preview → exact Active source |
| Sleep | If present | Commitment-kind token | exact edit | Preview → exact Active source |
| Event | Yes | compact token/count | exact edit | Active manual Event |
| all-day Event | Yes | first ordered token/indicator | exact edit | Active manual Event |
| Needs attention | Yes | status/count | resolve context | Preview friction |
| unplaced | Contextual | Month attention badge; day only when owned | inspect | Preview candidate |
| stale | Yes | stale label/treatment | Refresh handoff | Preview status |
| uncovered | Yes | Not generated | generation/range handoff | Preview coverage absence |
| Goal | No | workspace only | open Goal | Goal authority |
| outcome/progress | No | Today/Summary only | navigate surfaces | Execution/Progress projections |

## Authority Matrix

| Source | Month projection use | Selected-day use | Writes from Month? | Notes |
| --- | --- | --- | ---: | --- |
| Active setup | exact sources/preferences/range | editors/temporal context | Via existing contextual commands | Authored authority |
| Manual Events | Event cells | Add/Edit/Delete | Yes, existing writer | Singular Event authority |
| Goals/measurement | none in cells | Planner-level context | Existing Goal commands | Scheduling-independent |
| Preview | geometry/status/friction | review/Try | Generate/Refresh/Try paths only | Derived, ephemeral |
| PlanDecision | accepted-choice status | bounded Apply/remove | Existing commands | Not generic acceptance |
| HistoricalPlan | none | none | No | Today/Summary frozen history |
| ExecutionHistory | none | none | No | Today reporting/Summary evidence |
| Progress/Observations | none | Goal context only | Existing Goal reporting flow | Never schedule geometry |
| canonical time resolver | cell ownership/current label | exact window/duration/week | No | Pure derived truth |
| Month view state | displayed cells | selection/workspace | No durable write | Transient only |

## Temporal Matrix

| Case | Month-cell label | Canonical selected window | Expected behavior |
| --- | --- | --- | --- |
| ordinary day | D | `[start(D), start(D+1))`, normally 24h | one cell; detail states window |
| boundary increase | D | shorter/longer by consecutive starts | no gap/overlap; truthful duration |
| boundary decrease | D | longer/shorter by consecutive starts | no duplicated ownership |
| before-boundary current instant | prior label | containing canonical window | current marker on prior label |
| month boundary | owning civil label | may cross civil month | one owning cell; detail shows clocks |
| cycle wrap | label at wrap | piecewise effective starts | resolver governs, grid unchanged |
| DST if supported | D | actual 22/24/26-hour interval | detail/visualizer scales truthfully |

## Coverage Matrix

| Day state | Cell representation | Selected-day representation | User action |
| --- | --- | --- | --- |
| generated with items | tokens/counts | full derived review | inspect/edit intent |
| generated empty | Covered · No planned items | explicit known generated empty | Add intent or leave |
| uncovered | Not generated | no current Preview coverage | edit range / Generate |
| stale | stale tokens + label | stale geometry retained | Refresh explicitly |
| protected/unavailable | unavailable, not empty | guarded explanation | recovery path |
| friction | attention count | evidence/options | Try / Apply bounded change |
| unplaced | Month attention count | candidate detail if relevant | inspect/edit intent |

## Week-Start Matrix

| Scenario | Canonical user-week behavior | Month-grid behavior | Decision status |
| --- | --- | --- | --- |
| Sunday stable | Sunday-owned weeks | Sunday columns | Confirmed |
| Monday stable | Monday-owned weeks | Monday columns | Confirmed |
| Sunday → Monday within month | per-label effective weeks | Sunday month anchor; transition notice | Recommended |
| Monday → Sunday within month | per-label effective weeks | Monday month anchor; transition notice | Recommended |
| repeating-cycle wrap | resolver applies effective segment | fixed month anchor; rows non-authoritative | Confirmed |

## Interaction Matrix

| User activates | Expected contextual result | Direct schedule write? | Authority |
| --- | --- | ---: | --- |
| empty day | Review day + Add affordances | No | Selection/read model |
| Commitment occurrence | exact editor | No; authored draft only | Active exact source |
| Event | exact Event editor | No schedule write | Manual Event authority |
| Work | composite Work editor | No; authored draft only | Active shift/cycle |
| Needs attention | friction evidence/options | Try no; Apply bounded | Preview/PlanDecision |
| unplaced Commitment | candidate/source context | No | Preview + Active source |
| Generate/Refresh | explicit generation for saved range | Yes, canonical generation/publication | Preview/HistoricalPlan path |
| Today/current-day affordance | navigate/focus canonical current label | No | Canonical resolver |

## Responsive Matrix

| Width class | Month representation | Context workspace | Information density |
| --- | --- | --- | --- |
| narrow phone | 7-column date + indicator grid | stacked below / editor replacement | minimal dots/status |
| large phone | same grid, limited tokens if space | stacked below | low |
| tablet | full grid | below or side by orientation | medium |
| desktop | dominant full grid | persistent side panel | medium/high with fixed overflow |

## Accessibility Matrix

| Interaction | Keyboard behavior | Accessible semantics | Focus result |
| --- | --- | --- | --- |
| enter calendar | Tab once | labelled grid/current month | roving focused date |
| move day | arrows/Home/End | updated full date/status | destination date |
| select day | Enter/Space | `aria-selected` + announcement | workspace heading or retained cell by action |
| change month | Page Up/Down/buttons | live month heading | clamped corresponding date |
| activate occurrence | from selected-day list | button with kind/title/time | occurrence action/editor |
| open contextual editor | Enter/click | labelled region/dialog | heading/first field |
| return from editor | Escape/Back/Save | return announcement | invoking item/cell fallback |
| friction resolution | buttons, confirmation | evidence/options remain distinct | result/status then invoking context |

## Bundle Matrix

| Metric | Baseline | Guard | Phase 7 implication |
| --- | ---: | ---: | --- |
| Initial raw | 648,706 | 685,000 | 36,294 headroom; keep Month shell lean |
| Initial gzip | 164,373 | 170,000 | 5,627 headroom; reuse/no dependency |
| Largest lazy | 51,445 | 100,000 | contextual chunks have room |
| Total JS | 746,424 | 750,000 | only 3,576; replace/split, do not duplicate |

**Prerequisite determination:** no architecture prerequisite, but every implementation slice
must pass fixed guards; a new runtime calendar/date dependency or sustained duplicate surface is
blocked without an explicit bundle remediation.

## Future-Layer Matrix

| Future capability | Month insertion point | New read model? | New authored policy? | New authority? |
| --- | --- | ---: | ---: | ---: |
| Capacity | cell/day summary | Yes | Yes | Not necessarily |
| Planned Allocation | summary/workspace | Yes | Yes | Not necessarily |
| Recommendations | attention workspace | Yes | Yes | Decision authority may be needed |
| transition Sleep planning | transition context | Yes | Yes | Not for projection alone |
| Goal reorientation | Planner Goal context | Yes | Yes | Existing Goal + explicit planning change |
| Pattern Library | Commitment authoring | Possibly | Reuse policy | No generic Pattern authority assumed |
| richer Daily Workspace | Today / cross-link | Yes | Possibly | Preserve Today authorities |

## Architectural Invariant Assessment

| # | Invariant (abbreviated) | Classification |
| ---: | --- | --- |
| 1–12 | Surface/source roles; Work composite; Commitment projection; exact edit | Confirmed |
| 13 | stale targets never retarget | Confirmed |
| 14–20 | canonical ownership, variable days, grid/week/month/all-day/cross-boundary truth | Supported |
| 21–23 | uncovered, stale, protected remain distinct | Confirmed |
| 24–30 | transient selection; pure navigation; Event/Commitment/Work/friction boundaries | Recommended |
| 31–39 | resolution vs Recommendations; Try/Apply; explicit generation; no placement/execution/Summary writes | Confirmed |
| 40–44 | no ranking/Capacity/Allocation/adaptation; Pattern contextual | Confirmed |
| 45–50 | deterministic order/overflow/clones/mobile; accessibility first | Recommended |
| 51–59 | explicit focus; lazy authority; fixed bundles; no dependency/persistence/Backup change; lifecycle invalidation | Recommended |
| 60–65 | truthful past/future/current; out-of-coverage navigation; display-week policy/transition | Supported |
| 66–69 | future transition/Capacity/Recommendations/Daily growth boundaries | Deferred |
| 70–75 | incremental migration, removal parity, Phase 6 guarantees, bounded performance/bundles, stop rule | Recommended |

All 75 invariants are resolved at audit granularity. “Supported” means current architecture can
preserve the invariant but the new Month query/UI must prove it. “Recommended” is the binding
implementation design selected here. Deferred items are explicitly outside V1 and non-blocking.

## Validation Record

Validation ran from `code/` against the unchanged production implementation:

| Command | Exact result |
| --- | --- |
| `npm run lint` | PASS — ESLint exited 0 |
| `npm run typecheck` | PASS — `tsc --noEmit` exited 0 |
| `npm run test` | PASS — 90 files, 934 tests; 22.54 s |
| `npm run build` | PASS — Vite 8.0.10, 118 modules, 299 ms |
| `npm run check:bundle` | PASS — initial 648,706 raw / 164,373 gzip; largest lazy 51,445; total 746,424 bytes |
| `git diff --check` | PASS — no whitespace errors |

No production source, runtime dependency, persistence format, or bundle guard changed.

> **The Monthly Planner should make DayFrame's planning intelligence spatially understandable
> without turning scheduled geometry into user-authored truth.**

The calendar is navigation. The selected user-day is canonical time. The schedule is derived.
The sources remain authoritative. The user edits intent. DayFrame rebuilds the plan.
