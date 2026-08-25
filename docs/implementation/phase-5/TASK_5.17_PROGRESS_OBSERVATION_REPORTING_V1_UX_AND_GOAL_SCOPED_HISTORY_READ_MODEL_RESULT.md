# Task 5.17 Result — Progress Observation Reporting V1 UX and Goal-Scoped History Read Model

## 1. Executive Result

Complete. Planner selected-Goal detail now records, lists, corrects, and retracts absolute Manual Quantity observations through canonical authority.

## 2. Artifact Integrity

The immutable task copy matches the supplied artifact at SHA-256 `5a093b1ed701a181ab67627ead27fec8f65bd31ab79e2a43990db4731ab3c82d`.

## 3. Task 5.16 Prerequisite Confirmation

Confirmed and preserved unchanged in placement and semantics.

## 4. Initial Source Audit

Task 5.13–5.16 results, Observation ADR/domain/surface, Measurement/Goal components, subscriptions, decimal/timestamp rules, protection/durability, Backup V6/full clear, tests, focus/dialog, and responsive conventions were reviewed. Canonical create/correct/retract, definition/observation revision guards, exact epoch validation, future-time and same-time rejection, no-op, immutable revisions, and retracted heads satisfy all stop conditions.

## 5. Files Changed

Added the history query/test and reporting component; integrated store/types/Goal/App/CSS/tests; added immutable task copy, result, checkpoint, and governance updates.

## 6. Component Placement

`GoalProgressReportingSection` is a bounded sibling after Measurement and before commitments.

## 7. Application Boundary

React uses only `DayFrameStore`; no persistence adapter or raw storage access.

## 8. Goal-Scoped History Read Model

One synchronous derived query composes definition history and canonical Observation authority.

## 9. Read Model Contract

Returns readiness, current measurement status/definition, measurement periods, and logical record heads with corrected/action flags.

## 10. Read Model Ordering

Current period first; remaining periods newest revision first; records newest `observedAt`, then stable ID.

## 11. Logical Observation Rows

One current head per immutable lineage; superseded corrections are not peer rows.

## 12. Current/Prior Measurement Periods

Exact definition binding groups records into clearly labelled current/previous periods.

## 13. Measurement Context

Current target/unit is visible and read-only.

## 14. No-Measurement State

Directs users to set up Measurement; no record action.

## 15. Stopped-Measurement State

History remains; restart required for a new record.

## 16. Unsupported-Policy State

Reporting unavailable; records preserved without coercion.

## 17. Loading State

Explicit loading, distinct from no records.

## 18. Protected State

Recovery copy and no writes, distinct from no records.

## 19. Durability Failure

Session-only truth plus canonical retry.

## 20. Record Current/New Value

First active-period action says Current; after an active record it says New.

## 21. Record Form

Ephemeral current value and local observed date/time fields with explicit save/cancel.

## 22. Absolute-Value Semantics

Required “current total, not amount added” helper is visible.

## 23. Unit Context

Definition unit is visible and non-editable.

## 24. Target Context

Definition target is visible and non-editable.

## 25. observedAt Input

Native local datetime with millisecond precision converts explicitly to canonical UTC; `recordedAt` is system-owned.

## 26. Backdated Entry

Allowed when canonical epoch rules permit it.

## 27. Future-Time Behavior

Canonical rejection maps to a field-focused product error.

## 28. Definition Revision Guard

Opening captures original period/revision; later Measurement changes cannot silently rebind.

## 29. Record Save

`createProgressObservation` writes Observation authority only.

## 30. Same-Time Conflict

Explains different-time versus Correct Record intent and focuses time.

## 31. New Record vs Correction

Separate actions/forms teach new measurement versus wrong prior entry.

## 32. Correction Entry

Eligible active rows expose specifically labelled Correct Record actions.

## 33. Correction Form

Prepopulates current head value/time and exact period context.

## 34. Correction Value

Canonical unsigned decimal including zero.

## 35. Correction observedAt

Editable within exact epoch; cross-period movement maps to an explanatory error.

## 36. Correction Save

Canonical correction with expected observation revision.

## 37. Correction No-Op

Canonical no-op reported without a revision.

## 38. Observation Revision Conflict

Draft and captured revision remain; overwrite is rejected with review copy.

## 39. Retraction Entry

Active rows expose Remove Invalid Record, never Delete.

## 40. Retraction Confirmation

Accessible alert dialog explains current-evidence removal and preserved history.

## 41. Retraction Save

Canonical retract with expected revision; no hard delete.

## 42. Retracted Record Presentation

Visible as “Removed from measurement,” with no correction/removal actions.

## 43. Record History Presentation

Compact stacked rows show quantity, unit, observed time, and status.

## 44. observedAt / recordedAt Copy

Observed time is primary; system knowledge time is not misrepresented or editable.

## 45. Corrected Status

Compact “Corrected” label, no revision jargon.

## 46. Measurement-Period Presentation

Target/unit context repeats only at bounded period headings.

## 47. Completed Goal Policy

Reporting remains available because lifecycle does not freeze evidence.

## 48. Archived Goal Policy

History is read-only until reactivation.

## 49. Goal Lifecycle Independence

No reciprocal mutations.

## 50. Measurement Stop/Restart Independence

Stop preserves records; restart creates a new reporting period.

## 51. Target/Unit Change Independence

No record conversion, copy, migration, or retargeting.

## 52. Goal Rename Boundary

Current Goal title is context only; record identity is unchanged.

## 53. Goal Activity Boundary

No Goal Activity input/authority changes.

## 54. ExecutionHistory Boundary

No import/mirroring.

## 55. HistoricalPlan Boundary

No publication.

## 56. Scheduler Boundary

No scheduler interaction.

## 57. Preview Boundary

No staleness mutation.

## 58. Setup Boundary

No Setup interaction.

## 59. Profile Boundary

No Profile ownership/replacement.

## 60. Summary Boundary

Unchanged; no reporting action or Progress UI.

## 61. Progress Projection Boundary

`queryGoalProgress` is not called and no derived value renders.

## 62. Accessibility

Semantic section/history headings, labels, descriptions, errors, statuses, dialog, and record-specific action names.

## 63. Keyboard Behavior

Native controls cover all workflows.

## 64. Focus Behavior

Value on open; invalid field on error; opener on cancel; Cancel in dialog; heading after success.

## 65. Responsive Behavior

Stacked card/list design with no table dependency.

## 66. Mobile Behavior

Value/unit, date/time, rows, and wrapping actions require no horizontal layout.

## 67. Information Density

Forms are ephemeral; one row per lineage; no raw revision timeline.

## 68. Query Performance

One bounded in-memory authority composition per refresh; no per-row query or polling.

## 69. Subscription/Stale Handling

Measurement and Observation subscriptions refresh synchronously; Goal change resets drafts, eliminating cross-Goal async risk.

## 70. Restore

Subscriptions rehydrate canonical records; drafts are not restored.

## 71. Full Clear

Goal selection removal unmounts reporting and clears drafts/history.

## 72. Backup V6 Boundary

Unchanged; no V7.

## 73. Bundle Comparison

698.32 kB / 172.89 kB gzip: +13.02/+2.89 kB from Task 5.16; below 750–800 kB threshold. Task 5.19 remains mandatory.

## 74. Tests Added/Changed

Four read-model tests and one full UI workflow test; established authority/integration suites remain green.

## 75. Focused Validation

History query, Observation surface, and Goal UI: 3 files/10 tests passed; Goal UI final rerun 1 file/4 tests passed.

## 76. Full Validation

Scoped Prettier, ESLint, typecheck, 81 files/872 tests, Vite build (108 modules), and `git diff --check` passed.

## 77. Manual Product Walkthrough

Not performed because no interactive browser/automation surface was available; no manual claim is made.

## 78. Governance Updates

Phase checkpoint, Current State, Roadmap, and Changelog advanced. No new ADR decision arose.

## 79. Deviations

Datetime includes seconds/milliseconds to avoid falsely placing a just-opened form before a newly started measurement period. Previous-period active evidence remains correctable/removable when canonical exact-epoch rules permit; archived Goals remain read-only.

## 80. Discoveries

The effective Observation query intentionally omits retracted heads, so the derived history query correctly composes raw canonical authority at the application boundary.

## 81. Deferred Work

Tasks 5.18/5.19 and historical Progress, bars, policies/units/conversion, pace/trend/forecast, Recommendations/adaptation/scores, and automatic completion.

## 82. Observation Workflow Matrix

| Intent                      | UI                       | Command | Result                   |
| --------------------------- | ------------------------ | ------- | ------------------------ |
| first/later/yesterday value | Record Current/New Value | create  | new exact-period lineage |
| correct value/time          | Correct Record           | correct | immutable new revision   |
| invalidate                  | Remove Invalid Record    | retract | preserved retracted head |
| after target change         | Record New Value         | create  | new-period lineage       |
| while stopped/archived      | none                     | none    | read-only truth          |

## 83. History State Matrix

| State              | Presentation                 | Actions                        |
| ------------------ | ---------------------------- | ------------------------------ |
| no records         | neutral empty history        | record if active               |
| active             | value/observed time          | correct/remove                 |
| corrected          | active + Corrected           | correct/remove                 |
| retracted          | Removed from measurement     | none                           |
| prior period       | previous target/unit section | correct/remove unless archived |
| unsupported        | preserved/unavailable        | none                           |
| protected          | recovery                     | none                           |
| durability failure | session-only warning         | retry                          |

## 84. Correction/Retraction Matrix

| Record               | Correct? |  Remove? | Why                                         |
| -------------------- | -------: | -------: | ------------------------------------------- |
| active current/prior |      yes |      yes | canonical exact binding permits maintenance |
| corrected active     |      yes |      yes | current head remains active                 |
| retracted            |       no |       no | terminal presentation                       |
| stale revision       | rejected | rejected | no overwrite                                |

## 85. Measurement-Period Matrix

| Event              | Old records     | New records      | Reporting                 |
| ------------------ | --------------- | ---------------- | ------------------------- |
| start              | none            | current period   | enabled                   |
| target/unit change | previous period | new period       | enabled; no carry/convert |
| stop               | preserved       | none             | disabled                  |
| restart            | previous period | restarted period | enabled                   |

## 86. Read/Write Matrix

| Interaction                   | Reads                             | Writes                 |
| ----------------------------- | --------------------------------- | ---------------------- |
| view reporting/history        | Goal + definitions + observations | none                   |
| open record/correction/remove | derived model/UI                  | none                   |
| record                        | current definition guard          | Observation create     |
| save correction               | exact binding/head                | Observation correction |
| remove                        | exact head                        | Observation retraction |

## 87. Surface Boundary Matrix

| Surface                                                                                                                    | Effect               |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Planner / Plan                                                                                                             | reporting/history UI |
| Progress Observation                                                                                                       | canonical writes     |
| Goal-scoped history query                                                                                                  | derived read model   |
| Goal / Measurement Definition                                                                                              | read-only context    |
| Progress / Goal Activity / Setup / Schedule / Preview / HistoricalPlan / ExecutionHistory / Profiles / Summary / Backup V6 | none                 |

## 88. Accessibility Matrix

| Interaction       | Initial        | Failure              | Return         | Semantics            |
| ----------------- | -------------- | -------------------- | -------------- | -------------------- |
| record/correction | value          | value or time        | heading/opener | form + alerts/status |
| retraction        | Cancel         | dialog/alert         | heading/opener | alertdialog          |
| conflict          | draft retained | relevant alert/field | retry/cancel   | alert                |

## 89. Epistemic Matrix

| State                      | May say                           | Must not say                 |
| -------------------------- | --------------------------------- | ---------------------------- |
| none/zero/above/decreasing | no records / exact authored value | percentage/judgment          |
| corrected/retracted        | corrected/removed with history    | overwritten/deleted          |
| prior period               | prior target/unit evidence        | current evidence             |
| stopped/archived           | read-only reason                  | reporting available          |
| protected                  | recovery required                 | no records                   |
| same-time conflict         | record exists at time             | silently choose another time |

## 90. Product-Boundary Matrix

| Capability                                                                                    | Task 5.17           |
| --------------------------------------------------------------------------------------------- | ------------------- |
| Goal history, record, correction, retraction, periods                                         | Implemented         |
| Measurement config                                                                            | Preserved           |
| Summary Progress, percentage, bars, recommendations, pace/trend/forecast, bundle architecture | Deferred/Prohibited |
| Goal Activity conversion                                                                      | Prohibited          |

## 91. Architectural Invariant Assessment

Invariants 1–79 are Confirmed, Implemented, Preserved, Covered by test, or Prohibited exactly as specified. Invariants 80–81 are Deferred. Invariant 82 is Covered by canonical validation.

## 92. Stop-Condition Assessment

No stop condition triggered.

## 93. Architectural Alignment Assessment

Aligned: reporting remains Planner/Goal-scoped, Observation-only writes, and derived non-persisted history.

## 94. Recommended Next Task

**Task 5.18 — Summary Progress V1 Integration and Provenance.**

## 95. Final Completion Determination

Task 5.17 is complete, with manual browser walkthrough explicitly unperformed.
