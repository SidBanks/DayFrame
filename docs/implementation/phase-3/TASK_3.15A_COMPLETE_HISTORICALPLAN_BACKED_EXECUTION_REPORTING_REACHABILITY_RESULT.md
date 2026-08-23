# Task 3.15A Result — HistoricalPlan-Backed Execution Reporting Reachability

## 1. Executive Result

P3-GAP-001 is closed. DayFrame now exposes a compact “Report from plan history” section inside the existing Preview/history surface. A user selects one published plan date, and eligible occurrences from the current effective HistoricalPlan day projection feed the existing `ExecutionReportControl`, reporting workflow, and ExecutionHistory authority.

Historical conversion uses only the stored durable reference, frozen occurrence fields, and published day context. It needs no current Active source, Profile, PlanDecision replay, or Preview. Full validation passes at 59 files / 765 tests and 88 transformed build modules.

## 2. Artifact Integrity

- Supplied artifact and project copy are byte-identical (`cmp` exit 0).
- SHA-256: `e8092decb7ef83e6f9bc4bc258321c51930905fcfb285c6b97d9b482c8f3dc46`
- Immutable copy: `docs/implementation/phase-3/TASK_3.15A_COMPLETE_HISTORICALPLAN_BACKED_EXECUTION_REPORTING_REACHABILITY.md`
- The execution artifact was not modified.

## 3. Governing P3-GAP-001

Task 3.15 found that reporting was reachable only through current Preview. This implementation adds the missing authoritative edge:

```text
HistoricalPlan current effective day occurrence
  -> HistoricalExecutionTarget
  -> existing ExecutionReportControl / executionReportingWorkflow
  -> ExecutionHistory
```

## 4. Initial Historical Reporting Audit

`getHistoricalPlanDay(date, asOf)` already returns current effective durable plus accepted-pending authority and distinguishes available, missing publication, protected, and unavailable states. HistoricalPlan snapshots contain exact reference, source family, title, category, and plan state; the enclosing day contains user-day date, boundary, and UTC offset. Together they exactly satisfy `ExecutionHistoricalSnapshot`.

Preview reporting already supports scheduled blocks, generated work blocks, unplaced candidates, applied omissions, and blocked placements. Existing subject lookup uses durable-reference equality; retracted subjects re-report through correction of the current retraction head. No schema prerequisite existed.

## 5. Files Changed

Production:

- `code/src/core/execution/historicalPlanExecutionTarget.ts`
- `code/src/ui/HistoricalPlanReportingSection.tsx`
- `code/src/ui/ExecutionReportControl.tsx`
- `code/src/ui/PreviewScreen.tsx`

Tests:

- `code/src/core/execution/tests/historicalPlanExecutionTarget.test.ts`
- `code/src/ui/tests/HistoricalPlanReportingSection.test.tsx`

Governance/checkpoint/result:

- `docs/architecture/CURRENT_STATE.md`
- `docs/architecture/DECISIONS.md`
- `docs/architecture/CHANGELOG.md`
- `docs/roadmap/ROADMAP.md`
- `docs/checkpoints/CHECKPOINT_Phase_3_HistoricalPlan_Backed_Execution_Reporting.md`
- this result

## 6. HistoricalPlan Query Boundary

The UI reuses `DayFrameStore.getHistoricalPlanDay()`. It performs one indexed/as-of day query, not a complete-ledger load and not a general analytics query.

## 7. Historical Reporting Window

The bounded selection model is one explicit published-plan date at a time. When Preview exists, its range end date initializes the selector; without Preview, the current date initializes it. Users may choose another date through the native date input. No new primary navigation or unbounded history browser was added.

## 8. Missing Coverage Semantics

`unavailableNoPublication` renders: “No published plan history is available for this day.” It exposes no reporting action.

## 9. Empty Published Day Semantics

An available day with zero occurrences renders: “No occurrences were published for this day.” This remains distinct from missing coverage.

## 10. Occurrence State Eligibility

| HistoricalPlan occurrence state | Reportable? | Reason |
| --- | ---: | --- |
| scheduled | Yes | Existing Preview scheduled/work reporting supports it |
| unplaced | Yes | Existing Preview unplaced reporting supports it |
| omitted | Yes | Existing applied-omission reporting supports it |
| blocked | Yes | Existing blocked-placement/unplaced reporting supports it |

All remain planned subjects, so existing `skipped` semantics apply without extension.

## 11. Historical Target Materialization

`materializeHistoricalPlanExecutionTarget()` is pure. It validates membership/reference, constructs the existing execution snapshot from frozen occurrence plus day context, validates that snapshot, clone-isolates output, and returns the existing `HistoricalExecutionTarget` type.

## 12. DurableOccurrenceReference Preservation

The exact validated stored reference is cloned into the target. No date/title/source-ID lookup or new occurrence identity is performed.

## 13. Frozen Snapshot Preservation

Stored source family, title, category, and plan are combined only with stored day date, boundary, and UTC offset. Current source names/categories/durations cannot change the historical target.

## 14. Preview/Historical Target Equivalence

HistoricalPlan publication is materialized from the Preview target and copies its reference/snapshot fields. The inverse conversion restores those same execution-subject semantics. Existing publication tests plus the new pure target tests prove the shared fields and all state forms.

## 15. Source Deletion

Historical conversion has no Active parameter or lookup. Tests materialize the frozen target solely from JSON-roundtripped durable plan authority, preserving the old incarnation.

## 16. Source Recreation

No current logical source can participate in conversion. The old stored incarnation is asserted after the simulated lifecycle/roundtrip; a recreated source cannot retarget it.

## 17. Restart Independence

The JSON/durable roundtrip test materializes from reconstructed HistoricalPlan day data alone. Production queries IndexedDB after bootstrap, so no Preview regeneration is required after restart.

## 18. Backup V3 Restore Independence

Backup V3 restores the same validated HistoricalPlan V1 batches. The JSON-roundtrip target test verifies the converter consumes that exact schema and retains reference/snapshot identity. Existing Backup V3 exact-restore/restart tests cover durable restoration; the new reporting path then uses the ordinary store query and append workflow.

## 19. Reporting Workflow Reuse

`ExecutionReportControl` now accepts either its established Preview selection inputs or an already validated historical target. Both branches converge before `buildExecutionReportInput()`, subject lookup, append/correction, persistence result mapping, undo, and retry.

## 20. Outcome Support

Completed, partial, skipped, optional actual time, optional duration, and optional note are unchanged.

## 21. Existing Report Detection

The shared control uses `findExecutionSubjectByPlannedReference()`. A current effective report displays its outcome and Undo rather than offering another first report. ExecutionHistory remains the final duplicate-subject safety boundary.

## 22. Retraction/Re-Report

If the existing subject projects unknown after retraction, submission calls `correctExecutionRecord()` against the retraction head using the original assertion subject/snapshot. Immutable revision semantics are unchanged.

## 23. Quarantine

Quarantined components are not returned by valid-subject lookup and never masquerade as an effective report. Existing Summary/history quarantine messaging remains. Valid historical reporting is not blocked merely by component quarantine.

## 24. HistoricalPlan Protection

Protected or unavailable day queries render a factual authority-unavailable message and no occurrence actions.

## 25. ExecutionHistory Protection

The shared reporting control checks ExecutionHistory ingress and suppresses mutation while recovery is required.

## 26. Readiness/Transaction Admission

The production section exists only in the ready `DayFrameApp` path. Report mutations still call the proxied store methods, so initialization, whole protection, and shared-authority transaction barriers remain centralized and unchanged.

## 27. UI Location

The new subsection is embedded beside Outcome Summary and Execution History in `PreviewScreen`, both with and without a current Preview. No navigation destination was added.

## 28. UI Selection Model

One native date input drives one current-effective-day query. Rows show stored title and planned timing/state, current report state, and the shared report action.

## 29. Missing/Empty UI

| Historical day condition | UI/query result | Reporting available? |
| --- | --- | ---: |
| missing publication | explicit no-history message | No |
| published empty | explicit zero-occurrence message | No |
| published with eligible occurrences | bounded occurrence list | Yes |
| protected/unavailable | stored-authority warning | No |

## 30. Report Form Reuse

The exact existing form and validation are reused. Preview reporting remains the original prop branch and its regression suite passes.

## 31. HistoricalPlan Immutability

Selection and reporting never call publication or mutation APIs. UI tests retain and compare the day exactly before/after report submission.

## 32. Summary Interaction

The submitted historical report appears naturally in `deriveOutcomeSummary()`; the test asserts one completed subject without Summary mutation.

## 33. Current Preview Coverage Non-Interference

The regression test reports a historical occurrence outside an empty current Preview and confirms coverage remains 0 eligible / 0 reported / 0 unreported. Matching still requires the same durable reference to exist in the current Preview.

## 34. Query Performance

One day is read through the existing date/as-of IndexedDB index. The multi-year ledger is never loaded for this UI.

## 35. Async UI Behavior

Loading is explicit. Promise rejection maps to unavailable, never empty. A monotonic request token prevents stale date-query results from overwriting newer selection.

## 36. Pending HistoricalPlan Authority

No durability filter was added. Existing `getHistoricalPlanDay()` merges accepted pending batches with durable candidates; in-session pending authority is reportable.

## 37. As-Of Determination

The query uses the current instant and the existing latest-publication projection. Users do not select publication revisions.

## 38. Identity Uniqueness

| Scenario | Expected source incarnation/reference |
| --- | --- |
| still in current Active | historical stored reference |
| source deleted | historical stored reference |
| logical source recreated | old historical incarnation |
| Backup V3 restored | exact restored historical reference |
| restart | exact durable historical reference |

Preview and history use the same reference; subject lookup and collection validation prevent parallel planned subjects.

## 39. Tests Added

Two test files add pure state-matrix/lifecycle/roundtrip coverage and UI missing/empty/submission/immutability/Summary/coverage coverage.

## 40. Pure Materialization Tests

All four states materialize exact references and frozen snapshots; output is clone-isolated and requires no current authority.

## 41. Deleted/Recreated Source Tests

The durable-only conversion test explicitly preserves the old cycle incarnation across a JSON/restart/backup-shaped roundtrip. The function accepts no source collection, making deletion/recreation non-interference structural.

## 42. Restart Test

The reconstructed durable day is independently materialized after serialization. Existing IndexedDB surface restart tests prove the queried day reconstruction.

## 43. Backup Restore Test

Existing V3 tests prove exact HistoricalPlan restoration; the new JSON-schema roundtrip test proves restored plan data remains a valid reporting target. No backup-specific reporting branch exists.

## 44. Eligibility Matrix Tests

Scheduled, unplaced, omitted, and blocked are parameterized and all pass.

## 45. Duplicate/Retraction Tests

The unchanged shared control and existing ExecutionReportControl/ExecutionHistory tests cover duplicate prevention and correction of retracted subjects. Focused regressions pass.

## 46. Coverage/Summary Regressions

New UI tests prove categorical Summary inclusion and current-Preview coverage non-interference.

## 47. No Publication/Preview Side-Effect Tests

The historical section calls only `getHistoricalPlanDay`; the test asserts one query, unchanged day authority, and direct ExecutionHistory append. The pure converter has no store, generation, or publication dependency.

## 48. UI Tests

Missing/empty wording and full report submission are covered. The full `DayFrameApp` suite remains green.

## 49. Accessibility

The subsection uses a labelled section, semantic heading, labelled native date input, textual dates/states/outcomes, standard buttons/forms, and non-color-only protection text. Loading is politely announced without introducing ambiguous global status-role collisions.

## 50. No Persistence/Domain Version Audit

No storage key/store, HistoricalPlan V2, ExecutionHistory V2, occurrence-reference version, outcome, or historical-report identity was added. Date selection is React runtime state only.

## 51. Governance Updates

CURRENT_STATE, DECISIONS (ADR-3.15A), ROADMAP, and CHANGELOG now state precisely that HistoricalPlan-backed reporting reachability exists and explicitly disclaim metrics/adherence.

## 52. Checkpoint

Created `CHECKPOINT_Phase_3_HistoricalPlan_Backed_Execution_Reporting.md` with authority, eligibility, identity, lifecycle, UI, projection, and non-goal invariants.

## 53. Architectural Alignment Assessment

The implementation completes the missing edge without weakening authority boundaries: HistoricalPlan remains what was planned; ExecutionHistory remains what was observed. Current operative state is irrelevant to historical identity.

## 54. Deviations

The suggested “recent published plan days” list was narrowed to one date at a time. This uses the existing indexed day query, preserves bounded performance, clearly represents missing/empty authority, and avoids inventing ledger-discovery/analytics APIs.

Dedicated end-to-end restart and Backup V3 tests are composed from existing durable restore/restart tests plus a new exact JSON-roundtrip converter test rather than duplicating the large restore harness. The production path has no special restart/backup behavior.

## 55. Discoveries and Deferred Work

Historical metrics, adherence, range browsing, revision selection, and a broad history explorer remain deferred. HistoricalPlan protected-source recovery UI remains infrastructure/support scope. P3-GAP-002 full-clear settlement remains Task 3.15B.

## 56. P3-GAP-001 Closure Determination

**Closed.** HistoricalPlan is now a usable production source for execution reporting independently of current Preview and Active state.

## 57. Focused Validation

```text
npx vitest run \
  src/core/execution/tests/historicalPlanExecutionTarget.test.ts \
  src/ui/tests/HistoricalPlanReportingSection.test.tsx \
  src/ui/tests/executionReportingWorkflow.test.ts \
  src/core/execution/tests/executionSummary.test.ts \
  src/core/execution/tests/historicalExecutionTarget.test.ts

Test Files  5 passed (5)
Tests       29 passed (29)
```

Additional UI regression: 2 files / 109 tests passed.

## 58. Full Validation

| Command | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | 59 files / 765 tests passed |
| `npm run build` | Passed; 88 modules transformed |
| `git diff --check` | Passed |

Build warning: the 579.33 kB minified application chunk exceeds Vite's 500 kB advisory threshold. The previously observed fixed-delay ExecutionHistory test did not fail in this run.

## 59. Final Completion Determination

Task 3.15A is complete. Durable planned history remains actionable after Preview changes, source deletion/recreation, restart-shaped reconstruction, and Backup V3 exact restoration; exact identity and frozen context flow through the existing reporting/revision authority without plan mutation, republishing, Preview generation, coverage inflation, new persistence, new versions, or metric semantics.

Proceed to **Task 3.15B — Complete Five-Authority Full-Clear Settlement and Anti-Resurrection Verification**. Do not begin historical metrics.
