# Task 3.8 — Reported Outcome Summary and Current-Preview Reporting Coverage Result

## 1. Executive Result

Completed. DayFrame now derives and presents categorical reported outcomes and explicitly current-Preview reporting coverage without percentages, scores, persistence, or historical denominator claims.

## 2. Artifact Integrity

The supplied and saved task artifacts were byte-identical. SHA-256: `546506327d1a6c4d6e1c80910074e987dafcc618cd7e7e7dd37a8650b7613a9b`.

## 3. Governing Task 3.7 Contract

Categorical evidence first; Not reported is uncertainty; Partial has no fractional credit; current-plan coverage is volatile; historical follow-through and Goal progress remain blocked.

## 4. Initial Summary/Derivation Audit

Preview Summary contained planning metadata/friction only. History projection and Task 3.4 materialization supplied the required pure boundaries; no store authority was needed.

## 5. Files Changed

- `code/src/core/execution/executionHistoryProjection.ts` (pure helper moved from UI)
- `code/src/core/execution/executionSummary.ts`
- `code/src/core/execution/tests/executionSummary.test.ts`
- `code/src/ui/ExecutionSummarySection.tsx`
- `code/src/ui/ExecutionHistoryPanel.tsx`
- `code/src/ui/ExecutionReportControl.tsx`
- `code/src/ui/PreviewScreen.tsx`
- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/dayFrameUi.css`
- `code/src/ui/tests/ExecutionSummarySection.test.tsx`
- existing presentation tests updated for the pure helper location
- this result artifact

## 6. Core Derivation Boundary

Pure functions accept records, explicit user-day range, authored setup, and Preview. They query no store and mutate no input.

## 7. OutcomeSummary Type

Counts Completed, Partial, Skipped, `knownNotReportedSubjects`, total subjects, and frozen source-family breakdowns.

## 8. Completed Count

One current Completed projection contributes once.

## 9. Partial Count

One current Partial projection contributes once with no weight.

## 10. Skipped Count

One current Skipped projection contributes once and is not labeled failure.

## 11. Known Not-Reported Count

Only known subjects whose current projection is unknown/retracted; never guessed historical absences.

## 12. Total-Subject Semantics

Exact sum of the four categorical buckets.

## 13. Current-Projection-Only Rule

Uses deterministic subject-chain projection.

## 14. Revision Independence

Each subject counts once regardless of revisions.

## 15. Correction/Reclassification

Correction moves the one subject between buckets on recomputation.

## 16. Retraction Semantics

Prior reported bucket decrements and known Not reported increments.

## 17. Re-Report Semantics

Known Not reported decrements and the restored outcome increments.

## 18. Date Scope

Optional inclusive start/end user-day dates with explicit invalid-range result.

## 19. Frozen User-Day Filtering

Filters latest assertion snapshot date, never `recordedAt` or current source date.

## 20. Week Limitation

No canonical week API; callers provide explicit dates.

## 21. Source-Family Breakdown Determination

Included in pure API by frozen template/work/manualEvent/unplanned family; omitted from minimal UI.

## 22. CurrentPlanReportingCoverage Type

Available counts or explicit unavailable reason: no Preview, stale, Try, or inconsistent plan context.

## 23. Coverage Meaning

Current reportable occurrences with a current reported assertion, not performance or follow-through.

## 24. Fresh Preview Requirement

Only fresh, unrevised Preview is eligible.

## 25. Stale Preview

Unavailable with regeneration copy.

## 26. Try Preview

Unavailable with accept/discard copy.

## 27. No Preview

Unavailable; never misleading 0/0.

## 28. Coverage Availability Result

Explicit discriminated union; no ambiguous null.

## 29. Eligible Occurrence Definition

Every in-range occurrence that safely materializes under Task 3.4.

## 30. Reportability Reuse

Calls `materializeHistoricalExecutionTarget` for scheduled, unplaced, decision, work, and manual representations.

## 31. Scheduled Coverage

Reportable template/manual scheduled blocks included.

## 32. Unplaced Coverage

Included when materializable.

## 33. Omitted Coverage

Applied omission decision included when materializable.

## 34. Blocked Coverage

Blocked placement decision/unplaced representation included once.

## 35. Work Coverage

Materializable generated work included.

## 36. Manual Coverage

Materializable scheduled manual event included.

## 37. Unplanned Exclusion

Never enumerated into current-plan coverage.

## 38. Unsupported-Family Exclusion

Imported/rule/synthetic non-reportable items are normal exclusions.

## 39. Durable-Reference Join

Pure lifetime-safe semantic equality joins current projections.

## 40. Deduplication

Set semantics by DurableOccurrenceReference prevent overlapping UI representations from double counting.

## 41. Retraction Coverage

Subject exists but current unknown projection counts unreported.

## 42. No-Subject Coverage

Counts unreported.

## 43. Coverage Invariants

Eligible equals reported plus unreported; each reference contributes exactly once.

## 44. Source-Lifetime Safety

Old incarnation evidence does not satisfy a new-lifetime occurrence.

## 45. Current-Preview Scope

Exactly the requested Preview user-day range and current reportable set.

## 46. Hidden Expansion/Clipping Audit

Materialized snapshot date is filtered inclusively against `rangeStartDate`/`rangeEndDate`; hidden buffer occurrences are excluded and overlapping occurrences deduplicate.

## 47. OutcomeSummary vs Coverage Separation

Distinct result types and headings; history counts are evidence-only while coverage is current-plan derived.

## 48. Summary UI Location

Separate execution/evidence section adjacent to Preview Summary, also present on the no-Preview workflow.

## 49. UI Scope Determination

Option B: Preview-range when available; clearly labeled all-history fallback when absent.

## 50. User-Facing Outcome Copy

Reported outcomes: Completed, Partial, Skipped, Not reported; withdrawn-subject explanation appears when relevant.

## 51. Coverage Copy

“Reports recorded for A of B reportable occurrences in this Preview.” No percentage.

## 52. Protected Ingress

Counts are suppressed; recovery-needed message replaces safe-empty zero.

## 53. Quarantine

Valid history summarizes; a factual note states some preserved history could not be included.

## 54. Full Clear

Outcome counts empty; fresh current occurrences become unreported.

## 55. Profile Activation

History summary remains under the explicit scope; coverage requires/recomputes from the new current Preview.

## 56. Backup V1

No metric persistence or history mutation; coverage follows current Preview.

## 57. Backup V2

Same.

## 58. PlanDecision Mutation

Outcome counts unchanged; regenerated current coverage recomputes.

## 59. Preview Regeneration

Coverage recomputes; evidence summary does not rewrite history.

## 60. History Persistence Failure

Runtime authority drives counts immediately; existing history/reporting surfaces retain durability feedback.

## 61. Accessibility

Semantic headings and description list, visible labels, factual live-status recovery notes, and no color-only meaning.

## 62. Responsive Layout

Auto-fitting count cards wrap on narrow screens; no wide chart/table.

## 63. Tests Added

Core derivation and UI suites added.

## 64. Outcome Summary Tests

Empty, categorical buckets, family buckets, total, and explicit invalid range.

## 65. Revision/Correction Tests

Correction/retraction chains prove current-only single counting; existing history UI tests cover re-report synchronization.

## 66. Date-Scope Tests

Inclusive frozen user-day range is exercised with later `recordedAt` values.

## 67. Coverage Tests

Scheduled template, work, manual, overlapping unplaced/omitted representations, reported/no-subject/retracted states, and invariant counts.

## 68. Stale/Try/No-Preview Tests

All explicit unavailable states directly covered.

## 69. Lifecycle Tests

Old/new lifetime mismatch and inconsistent missing-source context directly covered; existing Task 3.4 tests cover detailed family lifecycle behavior.

## 70. Deduplication Tests

Overlapping scheduled/unplaced/decision representation and shuffled runtime order directly covered.

## 71. Protection/Quarantine Tests

Protected UI suppression directly covered; quarantine behavior follows valid accessor plus factual count note.

## 72. Synchronization Tests

Summary subscribes to the same history authority used by report/correct/retract controls.

## 73. No-Percentage Tests

UI test asserts no `%`, adherence, success-rate, or Goal-progress copy.

## 74. Persistence Audit

No key, envelope, writer, desired condition, or durable summary state added.

## 75. Goal/Plan-Ledger Audit

No Goal domain or historical plan ledger added.

## 76. Learning Audit

No learning or scheduling adaptation.

## 77. Architectural Alignment Assessment

Aligned with Task 3.7: categorical truth, explicit scope, preserved uncertainty, and strict authority separation.

## 78. Deviations

None.

## 79. Discoveries and Deferred Work

Historical coverage/follow-through still needs a governed durable plan denominator. Family/category UI breakdowns, charts, Goals, and trends remain deferred.

## 80. Recommended Next Task

Task 3.9 — Audit and Define Historical Plan Ledger / PlannedOccurrence History Semantics.

## 81. Focused Validation

Four focused files / 32 tests passed: core summary, Summary UI, history UI, and Preview UI.

## 82. Full Validation

`npm run lint`, `npm run typecheck`, `npm test` (46 files / 663 tests), `npm run build` (64 modules), and `git diff --check` passed.

## 83. Final Completion Determination

Complete. Pure non-durable categorical and current-Preview derivations, truthful UI, lifecycle safety, uncertainty, synchronization, and validation are established without scalar metrics or durable-contract changes.

## Required Matrices

| Current subject outcome | Count bucket |
| --- | --- |
| Completed | completed |
| Partial | partial |
| Skipped | skipped |
| Not reported/retracted | knownNotReportedSubjects |

| Current plan state/family | Coverage eligible? | Why |
| --- | ---: | --- |
| Scheduled template | Yes | Materializable planned occurrence |
| Unplaced template | Yes | Reportable current occurrence |
| Omitted template | Yes | Materializable applied omission |
| Blocked template | Yes | Materializable blocked placement |
| Work | Yes | Lifetime-safe materialization |
| Manual | Yes | Lifetime-safe materialization |
| Unplanned | No | No current-plan denominator |
| Unsupported imported/synthetic | No | No defensible historical target |

| Current execution state | Reported? |
| --- | ---: |
| Completed | Yes |
| Partial | Yes |
| Skipped | Yes |
| Retracted/Not reported | No |
| No subject | No |

| Preview state | Coverage status |
| --- | --- |
| Fresh authoritative | Available |
| Missing | Unavailable: noPreview |
| Stale | Unavailable: stalePreview |
| Try/revised | Unavailable: tryPreview |
| Identity-inconsistent | Unavailable: inconsistentPlanContext |

| Transition | Outcome summary effect | Coverage effect |
| --- | --- | --- |
| Correction | Reclassifies one subject | Remains reported |
| Retraction | Moves to known Not reported | Becomes unreported |
| Re-report | Moves to current reported bucket | Becomes reported |
| Profile activation | History retained | Recomputed after current Preview |
| Backup V1/V2 | History retained | Recomputed after current Preview |
| PlanDecision change | No evidence change | Recomputed from regenerated Preview |
| Preview regeneration | Same scoped evidence authority | Recomputed current set |
| Full clear | Empty summary | Current eligible set all unreported |
