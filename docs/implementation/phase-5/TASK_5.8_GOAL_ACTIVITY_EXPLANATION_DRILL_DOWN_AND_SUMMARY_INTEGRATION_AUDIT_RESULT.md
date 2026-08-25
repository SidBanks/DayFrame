# Task 5.8 Result — Goal Activity Explanation, Drill-Down, and Summary Integration Audit

## 1. Executive Determination
**Ready for bounded Summary integration.** No prerequisite architecture or routing task is required.
## 2. Artifact Integrity
The immutable artifact matches the attachment at SHA-256 `7e398b815ff73d57abb99a8d710a1e782defc536b3409473d423a9f73f8d0ed8`.
## 3. Audit Scope
Read-only audit of placement, explanation, selection, coverage, distributions, drill-down, states, handoff, accessibility, responsive behavior, and sequencing.
## 4. Sources Reviewed
Tasks 5.4–5.7, Goal/Goal Activity contracts, Summary component/tests/styles, Planner/Summary navigation, GoalSection, and query/subscription boundaries.
## 5. Current Summary Reconstruction
**Confirmed:** one History panel owns a shared date range/current refresh cutoff, plan coverage, generic Planning realization, generic Execution outcomes/reporting coverage, and inserted category detail.
## 6. Goal Activity Integration Alternatives
Compared peer section, Goals section, Goal-specific detail mode, and new subnavigation. A bounded Goals composite section is strongest.
## 7. Recommended Summary Structure
Within History: shared range/plan coverage, Goal Activity selected-Goal composite, then unchanged generic Planning and Execution peers.
## 8. Goal Selector
Use one native select with placeholder “Choose a Goal” and lifecycle-labelled option groups; selection is explicit and ephemeral.
## 9. Active/Completed/Archived Goals
All are selectable; active first, completed second, archived third. Lifecycle affects ordering/context only.
## 10. Empty Goal State
Show “No Goals yet. Goals can be created in Planner.” with navigation-only “Open Planner.”
## 11. Current Goal Context
Show current title, lifecycle label, optional description, and optional target date; hide revision and opaque policy IDs.
## 12. Target Date
Display factual “Target date: …” only, with no overdue, pace, urgency, or success interpretation.
## 13. Goal Activity Naming
Retain **Goal Activity**; Goal History is too broad and Goal Evidence is less product-natural.
## 14. Explanation Copy
Canonical: “Goal Activity shows historical work explicitly linked to this Goal. It does not measure Goal completion.”
## 15. Planning Section
Nested under selected Goal and asks how intended supporting work appeared during planning.
## 16. Planning Category Copy
Scheduled received placement; unplaced remained without placement; omitted/blocked are frozen dispositions with no inferred reason.
## 17. Planning Denominator
Show “Linked intended occurrences: N”; never a percentage.
## 18. Execution Section
Nested beside/below Planning and asks what was reported for linked work that reached the schedule.
## 19. Execution Category Copy
Use Reported completed/partial/skipped, Unknown, and Not reported; partial has no fractional weight and skipped has no judgment.
## 20. Execution Denominator
Show “Linked scheduled occurrences: N”; never completion rate.
## 21. Three-Coverage Presentation
Use three compact labelled rows in one section-local evidence block, not cards or a combined indicator.
## 22. Plan Coverage
Reuse existing complete/incomplete/unavailable copy and missing-date disclosure.
## 23. Goal-Link Coverage
Explain whether Goal relationships were captured; disclose occurrence counts and legacy detail without percentage.
## 24. Reporting Coverage
Show reported/eligible counts for linked scheduled work; not-applicable when no linked scheduled occurrences exist.
## 25. Known-Zero State
Canonical: “No Goal-linked activity was recorded in this range.” only when Goal-link coverage proves known empty.
## 26. Legacy-History State
Canonical: “Some history predates Goal-link tracking, so Goal relationships are unavailable for those records.”
## 27. Missing-Plan State
Use existing plan-history unavailable/incomplete messaging; never conflate with legacy Goal-link coverage.
## 28. Published-Empty State
State that covered days contained no intended occurrences; this is known plan zero, not missing.
## 29. Protected Goal State
Suppress Goal selection/activity interpretation and say Goals need recovery; preserve unrelated generic Summary metrics where safe.
## 30. Protected HistoricalPlan State
Suppress Goal Activity and existing historical metrics because historical membership/planning authority is unavailable.
## 31. Protected ExecutionHistory State
Canonical: “Planning activity is available, but reported outcomes cannot be interpreted right now.” Keep Goal planning visible.
## 32. Mixed Legacy/New State
Show counts from known Goal-aware history, mark Goal-link coverage incomplete, and expose bounded legacy details.
## 33. Cold Start
Distinguish no Goals, no plan history, published empty, known no-linked activity, and no reports.
## 34. Evidence Drill-Down
Reuse category buttons with `aria-expanded`/`aria-controls` and inserted detail; only one Goal Activity detail category open at once.
## 35. Planning Drill-Down
Rows show occurrence title, date/time, category/source, planning disposition, and historical-label note when needed.
## 36. Execution Drill-Down
Rows show the same occurrence context plus outcome explanation; hide record IDs from primary detail.
## 37. Coverage/Legacy Detail
Use a disclosure listing affected dates and bounded occurrence labels/references; known-unlinked rows need only counts unless explanatory inspection is requested.
## 38. Provenance Detail Level
Show human evidence; retain batch IDs, revisions, exact references, and record IDs in data/test boundaries rather than primary UI.
## 39. Current-vs-Frozen Goal Labels
Current title is heading. Show “Goal at the time: …” only when the frozen title differs.
## 40. Multi-Goal Explanation
When useful: “One occurrence can support more than one Goal; activity is shown independently for each Goal.”
## 41. Shared Range/Cutoff
Goal Activity uses the exact submitted Summary range and the same single cutoff captured for all queries in that refresh.
## 42. Async/Stale Request Behavior
Extend the existing request-generation guard; Goal changes start a new request without changing cutoff and stale responses are discarded.
## 43. Loading/Error Isolation
Show Goal-section loading/error locally; do not erase already valid generic Planning/Execution results solely because Goal Activity fails.
## 44. Summary Density
Risk is moderate. One selector, compact context, three rows, two distributions, and collapsed detail fit existing card rhythm without an all-Goals dashboard.
## 45. Goal-Centric vs History-Centric Alternatives
Summary remains history-centric; selected-Goal detail is a bounded filtered view, not a new top-level Goal dashboard.
## 46. Duplication With Existing Metrics
Goal Activity reuses visual/category language but is explicitly scoped to frozen Goal-linked occurrences; generic metrics remain whole-history peers.
## 47. Summary Read-Only Boundary
No create/edit/link/lifecycle actions in Summary.
## 48. Planner Handoff Alternatives
Compared none, Planner navigation, Planner plus ephemeral selection, and router/deep-link prerequisite.
## 49. Handoff Decision
Choose **navigate to Planner / Plan** only. No deep selection or router is required in first UI.
## 50. Restore/Clear/Selection Behavior
Goal subscription refreshes options; preserve selected ID only if it still exists, otherwise clear selection and detail. V3/clear yields no-Goals state; V4 restores exact options.
## 51. Accessibility
Label selector, coverage group/rows, category counts, disclosures, alerts/status, lifecycle text, and handoff destination semantically.
## 52. Focus/Keyboard
Native select/buttons/details; keyboard-opened category moves focus to inserted detail; pointer activation does not steal focus; selection returns heading context.
## 53. Responsive/Mobile
Stack context, coverage rows, Planning, Execution, and detail vertically; category grids collapse using current responsive patterns; no table/horizontal scroll.
## 54. Visual/Copy Hierarchy
Goal Activity heading → current Goal context → scope sentence → coverage → Planning → Execution → detail. Muted evidence language avoids motivational emphasis.
## 55. Progress Boundary
No percent, bar, ring, trend arrow, success color aggregate, pace, on-track, or target judgment. Category colors must not form an overall grade.
## 56. Future Progress Compatibility
Future policy-specific Progress can be a distinct later section fed by separate semantics; Goal Activity need not change.
## 57. Recommendation Compatibility
Recommendations remain a separate future proposal surface and must not be embedded into Activity evidence rows.
## 58. Goal Activity Copy Matrix
| Context | Canonical copy |
|---|---|
| Scope | Historical work explicitly linked; not Goal completion |
| Known zero | No Goal-linked activity was recorded in this range |
| Legacy | Some history predates Goal-link tracking |
| Execution protected | Planning available; outcomes cannot be interpreted |
## 59. Goal Selection Matrix
| Goal state | Selector behavior |
|---|---|
| Active | Primary group |
| Completed | Secondary, inspectable |
| Archived | Tertiary, inspectable |
| Missing after refresh | Clear selection/detail |
## 60. Coverage UX Matrix
| Dimension | Presentation |
|---|---|
| Plan | Days published/missing |
| Goal-link | Occurrences observed/legacy unavailable |
| Reporting | Linked scheduled reports/eligible |
## 61. Distribution UX Matrix
| Distribution | Categories | Denominator |
|---|---|---|
| Planning | Scheduled/unplaced/omitted/blocked | Linked intended |
| Execution | Completed/partial/skipped/unknown/not reported | Linked scheduled |
## 62. Current-vs-Frozen UX Matrix
| Context | Display |
|---|---|
| Current Goal | Heading/status/target/description |
| Frozen same title | No duplicate label |
| Frozen different title | “Goal at the time” |
| Revisions/policy IDs | Hidden primary UI |
## 63. Cross-Surface Matrix
| Surface | Responsibility |
|---|---|
| Summary | Read/explain Goal Activity |
| Planner / Plan | Author Goal and links |
| Schedule | No Goal Activity controls |
## 64. Information Architecture Alternatives Matrix
| Alternative | Decision |
|---|---|
| Peer top-level metric | Reject: loses Goal composite context |
| Goals section | Select |
| Separate detail mode | Reject: navigation overhead |
| New subnavigation | Reject: broad redesign |
## 65. Handoff Alternatives Matrix
| Alternative | Decision |
|---|---|
| None | Reject |
| Planner / Plan navigation | Select |
| Planner with selected Goal | Defer |
| Router prerequisite | Reject |
## 66. Summary Density Matrix
| Element | Density control |
|---|---|
| Goal browsing | One select, no dashboard |
| Coverage | Three compact rows |
| Counts | Existing compact category grid |
| Evidence | Insert only selected detail |
## 67. Product-Boundary Matrix
| Capability | First integration |
|---|---|
| Goal Activity read/explain | Yes |
| Goal writes | No |
| Progress/score | No |
| Recommendations/adaptation | No |
## 68. Epistemic Integrity Matrix
| State | Must communicate |
|---|---|
| Known zero | Observed and none linked |
| Legacy unknown | Relationships not recorded |
| Missing plan | Historical authority absent |
| Not reported | Eligible occurrence has no current report |
## 69. Accessibility Assessment
**Supported:** existing semantic category/detail patterns are reusable; implementation must add labelled selection and section-local live states.
## 70. Responsive Assessment
**Supported with one constraint:** keep coverage as rows and evidence collapsed; three standalone cards or an all-Goals grid would be too dense on mobile.
## 71. Manual Walkthrough
Not claimed. Browser viewport inspection was unavailable; source, tests, and responsive-style audit support the conclusions but cannot establish final visual polish.
## 72. Implementation Readiness
**A — Ready for bounded Summary integration.** No unresolved architecture or product prerequisite exists.
## 73. Recommended Integration Shape
Add one bounded Goal Activity section to Summary with explicit Goal selector, current context, three compact coverage rows, nested Planning/Execution distributions, and inserted detail; leave generic sections unchanged.
## 74. Coverage Presentation Decision
**A — three compact rows** in one section-local evidence block.
## 75. Drill-Down Decision
**A — category buttons reuse the existing inserted-detail behavior.**
## 76. Current/Frozen Label Decision
Current title heads the section; show frozen title only when different, prefixed “Goal at the time.”
## 77. Legacy Copy Decision
“Some history predates Goal-link tracking, so Goal relationships are unavailable for those records.”
## 78. Known-Zero Copy Decision
“No Goal-linked activity was recorded in this range.”
## 79. Execution-Protection Copy Decision
“Planning activity is available, but reported outcomes cannot be interpreted right now.”
## 80. Architectural Invariant Assessment
All required invariants remain aligned: descriptive/non-persistent Activity, frozen membership, independent coverage, read-only Summary, authored Planner, and no score/Progress.
## 81. Stop-Condition Assessment
No stop condition remains: Summary can host the bounded composite without semantic collision, routing, writes, measurable policy, or broad redesign.
## 82. Governance Updates
Updated Phase 5 checkpoint, CURRENT_STATE, ROADMAP, DECISIONS, and CHANGELOG; no UI was marked implemented.
## 83. Validation
Audit-only validation: immutable hash verified and `git diff --check` passed. No test/build validation is claimed for this task.
## 84. Recommended Task 5.9
**Task 5.9 — Implement Goal Activity V1 Summary Integration and Evidence Drill-Down.**
## 85. Final Audit Statement
Task 5.8 is complete with one implementation-ready, accessible, responsive, read-only Summary model that explains Goal Activity without becoming Progress.
