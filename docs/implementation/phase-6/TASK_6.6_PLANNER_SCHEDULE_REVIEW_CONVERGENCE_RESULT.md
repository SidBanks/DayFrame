# Task 6.6 — Planner Schedule-Review Convergence Result

## 1. Executive Result

Complete. Planner now exposes Plan / Review Schedule as distinct product workflows while retaining the existing Preview scheduler and write paths.

## 2. Artifact Integrity

The supplied artifact and immutable project copy share SHA-256 `6c2a0dea425fd51db9ceb7e8b00523211c7d45e61eea9d5402ba36aafbabbb27`.

## 3. Task 6.5 Prerequisite Confirmation

Today remains unchanged, lazy, and execution-facing.

## 4. Initial Planner/Schedule Audit

Planner owned Plan/Schedule mode; Setup generated Preview; PreviewScreen rendered range/day geometry, unplaced candidates, friction/fixes, and Try/Accept; generation published HistoricalPlan. Preview was cleared by governed profile/restore/full-clear behavior.

## 5. Files Changed

PlannerSurface, DayFrameApp, SetupScreen, PreviewScreen, shared CSS, focused tests, result/checkpoint, and governance.

## 6. Original Planner IA

Plan / Schedule with Generate Preview and DayFrame Preview terminology.

## 7. Resulting Planner IA

Plan / Review Schedule with Generate Schedule, Refresh Schedule, schedule status, range, selected-day review, plan attention, and conflict resolution.

## 8. Internal Navigation

Existing `aria-pressed` buttons and singular Planner mode state are preserved.

## 9. Plan Mode Preservation

Goals, Measurement, Setup draft, Save Setup, and authored controls remain in Plan.

## 10. Review Schedule Placement

The existing schedule content remains a bounded eager Planner workflow.

## 11. Preview Terminology Decision

Internal Preview names remain; primary product copy uses Schedule and Review Schedule.

## 12. Generation Action

No schedule uses Generate Schedule; an existing schedule uses Refresh Schedule. Both invoke existing generation.

## 13. Fresh Schedule

Planner reports “Schedule is up to date.”

## 14. Stale Schedule

The old result stays visible with textual refresh guidance; regeneration remains explicit.

## 15. No-Schedule State

The empty state asks the user to generate a schedule for review.

## 16. HistoricalPlan Boundary

Review Schedule consumes Preview; HistoricalPlan remains frozen publication/history.

## 17. Planning Range

Existing arbitrary range metadata remains visible; no month authority is introduced.

## 18. Calendar Integration

Existing compact calendar/range selection remains, plus a native bounded date filter for one user-day.

## 19. Selected User-Day

Selecting the date filters existing Preview day groups without a second calendar authority.

## 20. Variable-Duration Presentation

The canonical per-date window callback remains wired for 21/27-hour and DST windows.

## 21. DayVisualizer Reuse

The corrected DayVisualizer remains the primary timeline.

## 22. Scheduled Occurrences

Generated scheduled geometry remains textual and visual.

## 23. Manual Events

Manual events remain separate planned geometry; authoring is unchanged.

## 24. Work

Generated work remains distinct.

## 25. Sleep

Sleep remains plan geometry without transition intelligence.

## 26. Plan Attention

Preview-provided unplaced items are grouped separately from friction.

## 27. Unplaced

Presented as “Plan attention — Unplaced”; never skipped.

## 28. Omitted

Not applicable: current live Preview does not expose canonical omitted items.

## 29. Blocked

Not applicable: current live Preview does not expose a separate canonical blocked collection.

## 30. Friction Placement

Conflict evidence remains within selected day details and repeated-pattern summaries.

## 31. Friction Copy

Primary headings use Needs attention / schedule conflicts.

## 32. Resolution Options

Existing deterministic suggested-fix controls are described as bounded resolution options.

## 33. Try Workflow

Existing `applySuggestedFixToPreview` remains non-authoritative and identity-bound.

## 34. Accept Workflow

Apply Planning Change uses the existing PlanDecision acceptance and recomputation path.

## 35. Cancel Workflow

Existing non-acceptance behavior remains; Refresh Schedule reconstructs canonical generated state. No new revert authority was added.

## 36. PlanDecision Boundary

An accepted option remains one bounded planning decision, not whole-plan acceptance.

## 37. Publication Preservation

Only existing schedule generation publishes HistoricalPlan; no acceptance/publication command was added.

## 38. Setup Staleness

Authored changes retain the schedule and mark it stale.

## 39. Goal Independence

Goal changes remain schedule-independent.

## 40. Measurement Independence

Measurement changes remain schedule-independent.

## 41. Today Outcome Independence

Execution reporting is excluded from Planner review and cannot stale Preview.

## 42. Profile Behavior

Existing profile replacement/Preview clearing behavior is preserved.

## 43. Restore Behavior

No Preview is synthesized from HistoricalPlan after restore.

## 44. Full-Clear Behavior

Existing full clear removes Preview, selection, friction, and Try state.

## 45. Selected-Day Lifecycle

Selection uses the existing range state; out-of-range regeneration/profile transitions clear it deterministically.

## 46. Focus

Navigation retains button focus; synchronous generation retains the renamed generation control while the result appears. No friction auto-focus occurs.

## 47. Accessibility

Selected subnav state, native date input, textual stale status, headings, and named Try/Apply controls remain keyboard accessible.

## 48. Responsive Behavior

Review controls stack through the existing mobile breakpoint.

## 49. Mobile

Date filter and schedule content require no horizontal desktop layout.

## 50. Desktop

Chronological range/day layout remains scan-friendly.

## 51. Planner/Today Distinction

Planner exposes planned geometry/friction; no outcome reporting or execution metadata is composed.

## 52. Planner/Summary Distinction

Planner remains prospective and mutable through existing planning decisions; Summary remains historical/read-only.

## 53. Component Reuse

PlannerSurface, PreviewScreen, compact calendar, DayVisualizer, and existing fix handlers are reused.

## 54. PreviewScreen Assessment

PreviewScreen remains an effective internally named schedule-review renderer; a rename/split would add churn without semantic gain.

## 55. App Composition

DayFrameApp retains authoritative/draft/generation ownership and passes the existing derived result down.

## 56. One-Write-Path Assessment

Setup, manual event, generation, suggested-fix Try, and PlanDecision Accept paths are unchanged and singular.

## 57. Loading Architecture

Planner and Review Schedule remain eager; Today/Summary stay lazy.

## 58. Schedule-Review Lazy Audit

No split was justified: recomposition stayed within budgets and avoided a new loading interaction.

## 59. Bundle Comparison

Initial raw +506, initial gzip +145, Today UI +20, and total JS +526. Query and Summary chunks are unchanged.

## 60. Tests Added/Changed

Terminology/navigation, selected-day filtering, plan-only boundary, stale/generation, friction, PreviewScreen, and existing app regressions were updated/added.

## 61. Focused Validation

Four files / 145 tests passed: Planner/ProductSurfaces, PreviewScreen, DayFrameApp, and DayVisualizer.

## 62. Full Validation

Prettier, ESLint, TypeScript and 88 files / 925 tests passed; build transformed 115 modules; diff check passed.

## 63. Bundle Validation

All fixed budgets passed with 4 gzip bytes of initial headroom.

## 64. Manual Product Walkthrough

A browser was unavailable; jsdom interaction coverage was used. No manual walkthrough is claimed.

## 65. Governance Updates

Result, checkpoint, CURRENT_STATE, ROADMAP, and CHANGELOG were updated.

## 66. ADR Determination

No ADR: this implements Task 6.1’s existing product model and changes terminology/composition only.

## 67. Deviations

Review Schedule remains eager. Omitted/blocked are not fabricated. The date filter is optional until selected so existing arbitrary-range review remains available.

## 68. Discoveries

Planner previously composed ExecutionHistory reporting inside PreviewScreen; Task 6.6 removed that composition to restore the governed Planner/Today boundary.

## 69. Deferred Work

Commitment authoring is Task 6.7; broader cross-surface friction/manual-event convergence remains Task 6.8.

## 70. Planner Structure Matrix

| Planner area    | Purpose                         | Current/future status |
| --------------- | ------------------------------- | --------------------- |
| Plan            | authored intent                 | Preserved             |
| Review Schedule | generated plan review           | Implemented           |
| Setup           | current authored implementation | Preserved pending 6.7 |
| Goals           | authored intent                 | Preserved             |
| Calendar        | date navigation                 | Reused                |
| Plan attention  | unresolved plan states          | Unplaced available    |
| Friction        | deterministic conflict evidence | Reframed              |

## 71. Terminology Matrix

| Current term     | User-facing 6.6 treatment | Internal treatment     |
| ---------------- | ------------------------- | ---------------------- |
| Schedule         | Review Schedule workflow  | unchanged domain       |
| Preview          | Schedule/details          | unchanged types        |
| Generate Preview | Generate Schedule         | unchanged command      |
| stale Preview    | schedule needs refresh    | unchanged flag         |
| Friction Point   | Needs attention/conflict  | unchanged type         |
| Suggested Fix    | Resolution option         | unchanged type         |
| Try              | Try                       | unchanged              |
| Accept           | Apply Planning Change     | PlanDecision unchanged |
| Unplaced         | Plan attention — Unplaced | unchanged              |
| Setup            | Setup                     | preserved              |

## 72. Schedule-State Matrix

| State            | Presentation                        | Available action        |
| ---------------- | ----------------------------------- | ----------------------- |
| no schedule      | empty guidance                      | Generate Schedule       |
| fresh            | up to date                          | Refresh Schedule        |
| stale            | textual warning; old result visible | Refresh Schedule        |
| generation error | existing error/guardrail            | retry                   |
| profile cleared  | no schedule                         | Generate Schedule       |
| full clear       | no schedule                         | configure then generate |

## 73. Attention Matrix

| State    | Section                | May say                   | Must not say |
| -------- | ---------------------- | ------------------------- | ------------ |
| unplaced | Plan attention         | not placed                | skipped      |
| omitted  | unavailable in Preview | omitted only if canonical | failed       |
| blocked  | unavailable in Preview | blocked only if canonical | cause/blame  |
| friction | Needs attention        | conflict evidence         | user failure |

## 74. Friction/Resolution Matrix

| Condition       | Presentation              | Actions               | Authority effect       |
| --------------- | ------------------------- | --------------------- | ---------------------- |
| friction no fix | textual conflict          | review setup          | none                   |
| fix available   | resolution option         | Try                   | derived Preview only   |
| Try active      | explicit non-saved notice | Apply change          | none until apply       |
| Accept          | feedback                  | Apply Planning Change | canonical PlanDecision |
| Cancel          | do not accept/refresh     | Refresh               | no new authority       |

## 75. Surface-Boundary Matrix

| Concern             | Planner Review Schedule | Today                 | Summary                        |
| ------------------- | ----------------------- | --------------------- | ------------------------------ |
| plan geometry       | primary                 | published current day | historical aggregate only      |
| execution outcomes  | excluded                | primary/reportable    | historical analysis            |
| plan friction       | primary                 | excluded              | excluded                       |
| historical outcomes | excluded                | current overlay       | primary                        |
| schedule mutation   | bounded existing paths  | none                  | none                           |
| outcome reporting   | none                    | yes                   | existing history contexts only |

## 76. State-Ownership Matrix

| State            | Owner before       | Owner after        | Changed? |
| ---------------- | ------------------ | ------------------ | -------: |
| Setup draft      | DayFrameApp        | DayFrameApp        |       No |
| Preview/schedule | store/App          | store/App          |       No |
| planner mode     | DayFrameApp        | DayFrameApp        |       No |
| selected day     | DayFrameApp        | DayFrameApp        |       No |
| Try state        | store/App          | store/App          |       No |
| accepted fix     | PlanDecision       | PlanDecision       |       No |
| friction         | Preview derivation | Preview derivation |       No |

## 77. Loading Matrix

| Area            | Eager/lazy | Decision       |
| --------------- | ---------- | -------------- |
| Planner shell   | eager      | preserve       |
| Plan mode       | eager      | preserve       |
| Review Schedule | eager      | measured reuse |
| Today           | lazy       | preserve       |
| Summary         | lazy       | preserve       |

## 78. Accessibility Matrix

| Interaction               | Requirement                      |
| ------------------------- | -------------------------------- |
| Plan / Review Schedule    | `aria-pressed` selected state    |
| Generate/Refresh Schedule | named button                     |
| stale state               | text                             |
| calendar day              | keyboard-selectable controls     |
| selected day              | native bounded date input        |
| friction                  | headings/text                    |
| Try                       | named button                     |
| Accept                    | Apply Planning Change button     |
| Cancel                    | existing navigation/refresh path |

## 79. Responsive Matrix

| Area                       | Desktop        | Mobile                      |
| -------------------------- | -------------- | --------------------------- |
| Planner subnav             | two columns    | existing responsive buttons |
| generation/status          | inline/stacked | stacked                     |
| calendar                   | compact        | scroll-safe compact         |
| selected-day visualization | timeline       | single-column timeline      |
| attention                  | day detail     | stacked                     |
| friction/resolutions       | inline detail  | wrapping controls           |

## 80. Bundle Matrix

| Metric       |     6.5 |     6.6 | Delta |
| ------------ | ------: | ------: | ----: |
| Initial raw  | 682,538 | 683,044 |  +506 |
| Initial gzip | 169,851 | 169,996 |  +145 |
| Today query  |   4,890 |   4,890 |     0 |
| Today UI     |  11,262 |  11,282 |   +20 |
| Summary      |  30,091 |  30,091 |     0 |
| largest lazy |  30,091 |  30,091 |     0 |
| total JS     | 728,781 | 729,307 |  +526 |

## 81. Product-Boundary Matrix

| Capability               | Task 6.6                    |
| ------------------------ | --------------------------- |
| Planner Review Schedule  | Implemented                 |
| schedule generation      | Preserved/refined copy      |
| stale schedule handling  | Preserved                   |
| selected-day review      | Implemented                 |
| variable user-days       | Preserved                   |
| plan attention           | Implemented where canonical |
| friction                 | Reframed                    |
| deterministic resolution | Preserved                   |
| commitment convergence   | Deferred                    |
| Setup retirement         | Deferred                    |
| drag/drop                | Deferred                    |
| Today schedule writes    | Prohibited                  |
| Capacity                 | Prohibited                  |
| Recommendations          | Prohibited                  |

## 82. Epistemic Matrix

| Evidence/state       | DayFrame may say             | Must not say               |
| -------------------- | ---------------------------- | -------------------------- |
| scheduled occurrence | scheduled                    | completed                  |
| stale schedule       | generated before edits       | invalid plan               |
| unplaced             | not placed                   | skipped                    |
| omitted              | omitted                      | failed                     |
| blocked              | blocked                      | blame/cause                |
| friction             | conflict evidence            | user failure               |
| resolution option    | bounded deterministic change | intelligent recommendation |
| schedule opening     | temporal space               | Capacity                   |
| Goal edit            | Goal changed                 | schedule auto-changed      |
| Today outcome        | reported reality             | Planner changed            |

## 83. Architectural Invariant Assessment

All 87 invariants are Confirmed, Implemented, Preserved, Covered by test, Deferred, Prohibited, or Not applicable as required. No authority, algorithm, publication, persistence, Backup, dependency, direct manipulation, recommendation, capacity, or execution-semantic change exists.

## 84. Stop-Condition Assessment

No stop condition remained after composition audit and bundle optimization.

## 85. Architectural Alignment Assessment

The UI now expresses the established Planner/Today/Summary model without merging Preview and HistoricalPlan or duplicating state/write ownership.

## 86. Task 6.7 Readiness

Task 6.7 is authorized.

## 87. Recommended Next Task

Task 6.7 — Commitment Authoring Convergence.

## 88. Final Completion Determination

Task 6.6 is complete and green.
