# Task 6.3 Result — Canonical Today Current-User-Day and Current-Plan Read Model

## 1. Executive Result

Complete. DayFrame exposes one deterministic, non-persisted `queryToday({ evaluationAsOf })` that composes canonical user-day, effective HistoricalPlan, and exact ExecutionHistory evidence without UI or writes.

## 2. Artifact Integrity

The supplied and immutable project copy match SHA-256 `ebdfed582493d1a996f3b2470098507542385707b2bcb30504030a6941858ee5`.

## 3. Original Blocker Closure

Both original blockers were mechanically closed before resumed implementation.

## 4. Task 6.3B Confirmation

The query reuses canonical piecewise `[start(D), start(D+1))` instant ownership.

## 5. Task 6.3C Confirmation

The query consumes explicit V2 all-day/timed provenance while preserving V1 as unavailable legacy.

## 6. Initial Source Audit

Canonical temporal resolution, latest-as-of HistoricalPlan selection, effective ExecutionHistory projection, exact reference identity, and independent protection states were all reusable; no stop condition triggered.

## 7. Files Changed

Added `core/today/buildTodayReadModel`, `state/todayQuery`, focused tests, store/type integration, result/checkpoint, and governance updates.

## 8. Module Placement

Pure classification lives in `core/today`; authority gathering and readiness mapping live in `state`.

## 9. Query Contract

The store exposes asynchronous `queryToday({ evaluationAsOf })`.

## 10. Query Time Semantics

One canonical UTC instant controls temporal ownership, plan cutoff, temporal classification, and execution knowledge cutoff.

## 11. Current User-Day Resolution

`resolveUserDayContainingInstant` supplies the unique containing canonical window.

## 12. Variable-Duration Behavior

The result retains actual start/end and duration; no 24-hour assumption exists.

## 13. User-Day Provenance

Date, start, end, duration, current/next boundaries, and effective `weekStartsOn` are returned.

## 14. HistoricalPlan Selection

The adapter calls the existing one-day latest-as-of selector exactly once.

## 15. Plan Authority

HistoricalPlan is the sole planned-occurrence source.

## 16. Published Empty

An empty effective publication returns `available` with plan coverage `knownEmpty` and empty collections.

## 17. Missing Plan

No effective publication returns `planUnavailable/noPublication`, never “free day.”

## 18. HistoricalPlan Protection

Protected evidence returns `historicalPlanProtected` without Preview fallback.

## 19. Occurrence Scope

Only scheduled occurrences enter all-day/timed/legacy collections; other dispositions remain attention evidence.

## 20. Plan Attention

Unplaced, omitted, and blocked arrays retain frozen occurrences without cause or blame inference.

## 21. Frozen Provenance

Exact reference, title, category, family, plan, Goals where present, version, timing, and interval are clone-preserved.

## 22. Timing Semantics

The adapter uses the canonical timing helper before pure classification.

## 23. V1 Legacy Handling

Scheduled V1 occurrences enter `timingUnavailableLegacy`, never timed or all-day.

## 24. All-Day Collection

Explicit V2 all-day items remain separate user-day context with orthogonal execution evidence.

## 25. Timed Collection

Only explicit V2 timed scheduled occurrences enter temporal classification.

## 26. Current Semantics

Current means exactly `start <= evaluationAsOf < end`.

## 27. Multiple Current

All overlaps are retained and deterministically ordered.

## 28. Next Semantics

Next contains the complete earliest future start tie group.

## 29. Later Semantics

Later contains remaining upcoming occurrences after the next tie.

## 30. Elapsed Semantics

Elapsed means `end <= evaluationAsOf` and implies no outcome.

## 31. Ordering

Timed order is start, end, canonical exact-reference key; other groups use reference then frozen title.

## 32. Cross-Boundary Occurrences

Exact frozen intervals are classified within their published day membership without reassignment.

## 33. Manual Events

Manual events enter only through frozen HistoricalPlan occurrences.

## 34. Work

Work enters only through frozen HistoricalPlan occurrences.

## 35. Sleep/Templates

Template/Sleep occurrences follow the same published-evidence rule.

## 36. Execution Overlay

The adapter filters one bulk authority snapshot and uses canonical effective-head projection.

## 37. Execution Cutoff

Only records with `recordedAt <= evaluationAsOf` contribute.

## 38. Outcome Categories

Completed, partial, and skipped remain exact explicit outcomes.

## 39. Not Reported

No effective assertion returns `notReported`, never skipped or incomplete.

## 40. Correction

Corrections change the result only once their recorded time enters the cutoff.

## 41. Retraction

Effective retraction returns the exact occurrence to `notReported`.

## 42. Execution Protection

Protected execution returns `unavailableProtected`, not fabricated `notReported`.

## 43. Partial Availability

An available plan remains fully usable while execution is protected or unavailable.

## 44. Temporal/Execution Orthogonality

Temporal position and explicit outcome are separate fields, preserving mechanically odd combinations.

## 45. Republication

Existing HistoricalPlan cutoff selection exposes only the effective same-day publication.

## 46. Exact Identity

Execution matching uses a canonical key containing every exact durable-reference identity component.

## 47. Superseded Reports

Reports for references absent from the effective plan do not enter Today.

## 48. Timing Change Across Republication

V1/V2 and all-day/timed changes follow the effective publication cutoff without merging.

## 49. Publication In Flight

Only accepted HistoricalPlan state is queried; Preview is absent.

## 50. Active Dependency Boundary

Active contributes only shift cycles and default scheduling preferences to canonical day ownership.

## 51. Preview Independence

Preview is absent from both core and application query contracts.

## 52. Goal Independence

No current Goal query occurs; already-frozen provenance remains attached.

## 53. Measurement Independence

Measurement Definition is not queried.

## 54. Observation Independence

Progress Observation is not queried.

## 55. Progress Independence

Goal Progress is not queried.

## 56. Goal Activity Independence

Goal Activity is not queried.

## 57. Friction Boundary

No friction category or cause is inferred.

## 58. PlanDecision Boundary

PlanDecision is not read directly.

## 59. Query Status Model

Results distinguish available, plan unavailable, HistoricalPlan protected, invalid query, and independent execution coverage.

## 60. Known-Empty Model

Known empty remains an available model with publication provenance.

## 61. Legacy Timing Coverage

Legacy timing uncertainty is per occurrence and does not suppress the day.

## 62. Determinism

Explicit inputs, canonical cutoffs, and stable ordering produce deterministic results.

## 63. Clone Isolation

`structuredClone` isolates the returned model and nested evidence from authority inputs.

## 64. Input-Order Independence

Tests reverse plan and execution input orders without changing results.

## 65. Application Query Boundary

The store owns composition; future React consumers need only `queryToday`.

## 66. Query Performance

One HistoricalPlan day query and one in-memory ExecutionHistory snapshot/projection avoid N+1 authority calls.

## 67. Restore

Today is re-derived after restore and needs no participant.

## 68. Full Clear

Existing authority clear naturally yields plan unavailable; no Today clear exists.

## 69. Persistence Boundary

No Today store, key, cache, migration, or durable authority was introduced.

## 70. Backup Boundary

Backup V6 remains unchanged because Today is derived.

## 71. Protection/Error Boundary

Malformed query, missing/storage-unavailable plan, plan protection, and execution protection remain explicit.

## 72. Tests Added/Changed

Added 11 Today tests covering collections, boundaries, outcomes, correction/retraction, exact identity, ordering, cloning, known empty, statuses, partial protection, and store exposure.

## 73. Property Invariants

Explicit time, authority separation, timing honesty, exact identity, cutoff behavior, deterministic ordering, and clone isolation hold.

## 74. Focused Validation

Six focused files passed 78 tests; the two Today files passed 11 tests.

## 75. Full Validation

`npm test` passed 87 files / 912 tests; format checks, lint, typecheck, build, and `git diff --check` passed.

## 76. Bundle Validation

Budgets passed without threshold changes: 682,706 initial raw (+486), 169,883 initial gzip (+156), 30,091 largest lazy (+0), and 717,687 total (+5,376) versus the Task 6.3C baseline. Today is a 4.89 KB lazy chunk.

## 77. Manual Validation

Not applicable: no Today UI was authorized or changed.

## 78. Governance Updates

Updated result, Phase 6 checkpoint, Current State, Roadmap, and Changelog.

## 79. ADR Determination

Existing Task 6.3A ADRs were sufficient; no new ADR was needed.

## 80. Deviations

The initially eager query exceeded bundle limits; query-owned code was moved behind the application call boundary, preserving behavior and thresholds.

## 81. Discoveries

Lazy-loading the whole query avoided shared-chunk gzip fragmentation while retaining an eager typed store method.

## 82. Deferred Work

Today UI, writes, Goal/Progress context, friction, replanning, recommendations, capacity, and adaptation remain deferred.

## 83. Query Matrix

| Input | Required | Purpose |
|---|---:|---|
| evaluationAsOf | yes | temporal and knowledge cutoff |
| user-day/ranges/Goal/Preview | no | derived, bounded, or prohibited |

## 84. Today Status Matrix

| Plan | Execution | Result |
|---|---|---|
| available | available | available with outcomes/notReported |
| available | protected | available with unavailableProtected |
| known empty | available | available/knownEmpty |
| missing | any | planUnavailable |
| protected | any | historicalPlanProtected |
| malformed query | any | invalidQuery |

## 85. Timing Matrix

| Snapshot | State | Timed classification |
|---|---|---:|
| V1 | unavailableLegacy | no |
| V2 allDay | allDay | no |
| V2 timed | timed | yes |

## 86. Temporal Matrix

| Relation | Result |
|---|---|
| start <= now < end | current |
| start > now | upcoming |
| end <= now | elapsed |
| overlapping/tied starts | all current/complete next tie |

## 87. Execution Matrix

| Temporal | Evidence | Result |
|---|---|---|
| any | none/retraction | notReported |
| any | completed/partial/skipped | exact explicit outcome |
| any | protected | unavailableProtected |

## 88. Plan-Attention Matrix

| Disposition | Timeline | Attention | Inference |
|---|---:|---:|---|
| scheduled | timing-dependent | source collections | none |
| unplaced/omitted/blocked | no | exact separate arrays | none |

## 89. Republication Matrix

| Cutoff | Plan/timing | Execution linkage |
|---|---|---|
| before | earlier publication | exact earlier refs only |
| after | later publication | exact later refs only |
| visually similar new ref | later occurrence | old report excluded |

## 90. Provenance Matrix

| Provenance | Retained |
|---|---:|
| evaluation/day window/effective preferences | yes |
| batch ID/publishedAt/durability | yes |
| exact occurrence/frozen fields/version/timing/interval | yes |
| execution assertion/provenance | yes when effective |
| Preview identity | no |

## 91. Authority Matrix

| Source | Use |
|---|---|
| Active preferences | narrow temporal ownership |
| HistoricalPlan | current published plan |
| ExecutionHistory | explicit outcome evidence |
| Preview/PlanDecision/Goal/Measurement/Observation/Progress/Goal Activity | none |

## 92. Product-Boundary Matrix

| Capability | Result |
|---|---|
| current day/plan/timing/temporal groups/execution/attention | implemented |
| Today UI/writes/context/replanning | deferred |
| new authority/persistence | prohibited and absent |

## 93. Epistemic Matrix

| Evidence | May say | Must not say |
|---|---|---|
| overlap | scheduled now | underway |
| elapsed | elapsed | completed/skipped |
| no report | not reported | skipped |
| known empty | published plan empty | free day |
| missing/protected | unavailable/protected | nothing planned/not reported |

## 94. Architectural Invariant Assessment

All 85 required invariants are satisfied, including derived/non-authoritative status, explicit time, canonical ownership, sole plan/outcome authorities, epistemic separation, no UI/persistence, and bounded composition.

## 95. Stop-Condition Assessment

No stop condition triggered; every required semantic was expressible through existing canonical authorities and helpers.

## 96. Architectural Alignment Assessment

Aligned with the architecture specification, Task 6.2 surface boundary, Tasks 6.3A–C, and both governing ADRs.

## 97. Task 6.4 Readiness

The canonical query is complete and green. **Task 6.4 — Read-Only Today V1 Surface is authorized.**

## 98. Recommended Next Task

**Task 6.4 — Read-Only Today V1 Surface.**

## 99. Final Completion Determination

Task 6.3 is complete. Today now reports exactly the canonical current-user-day, effective published plan, frozen timing intent, and cutoff-governed execution evidence DayFrame knows—without converting time into behavior claims.
