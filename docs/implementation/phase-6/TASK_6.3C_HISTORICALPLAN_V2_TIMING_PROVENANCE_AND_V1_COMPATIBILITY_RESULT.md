# Task 6.3C Result — HistoricalPlan V2 Timing Provenance and V1 Compatibility

## 1. Executive Result

Complete. HistoricalPlan now freezes explicit all-day/timed intent in occurrence V2 while preserving V1 exactly as legacy timing-unavailable.

## 2. Artifact Integrity

The supplied and immutable project copy match SHA-256 `41afd909dfa87bda07a5caa6e79b756c7b72cae41eb876eafcc17e0491ced4a6`.

## 3. Task 6.3A/6.3B Prerequisite Confirmation

Both prerequisites were complete and green before this implementation; Task 6.3B temporal behavior was not changed.

## 4. ADR Confirmation

Implementation follows `ADR_HISTORICAL_PLAN_ALL_DAY_OCCURRENCE_PROVENANCE.md` without amendment.

## 5. Initial HistoricalPlan Audit

The occurrence snapshot was the only durable layer missing timing intent; enclosing day, batch, surface, IndexedDB, restore, and Backup V6 are structurally version-compatible.

## 6. Files Changed

Changed the HistoricalPlan domain, validator, fingerprint, materializer, execution/intelligence consumers, and focused tests; added result/checkpoint and governance updates.

## 7. V1 Preservation

`HistoricalPlannedOccurrenceSnapshotV1` and its exact accepted keys remain unchanged.

## 8. V2 Type

`HistoricalPlannedOccurrenceSnapshotV2` requires `version: 2` and a required timing value.

## 9. Timing Union

Timing is the closed union `{ kind: "allDay" } | { kind: "timed" }`.

## 10. Canonical Occurrence Union

`HistoricalPlannedOccurrenceSnapshot` is the canonical V1/V2 union used by enclosing authorities and readers.

## 11. Timing Coverage Helper

`historicalOccurrenceTimingSemantics` returns `unavailableLegacy` for V1 and explicit available kind for V2.

## 12. Publication Source Audit

All reportable families have authoritative semantics: manual scheduled blocks expose `isAllDay`; generated work and template occurrences are timed by domain definition; imported/rule blocks are excluded.

## 13. Manual All-Day Mapping

Manual `isAllDay === true` publishes V2 `allDay`.

## 14. Manual Timed Mapping

Manual scheduled blocks without the true marker publish V2 `timed`.

## 15. Work Mapping

Generated work selections publish V2 `timed`; no interval-based inference is used.

## 16. Sleep/Template Mapping

Scheduled, unplaced, blocked, and omitted template occurrences, including Sleep placement behavior, publish V2 `timed`.

## 17. Other Source Mapping

Imported-calendar and rule blocks remain outside HistoricalPlan publication.

## 18. Publication Materialization

The materializer constructs a required V2 timing fact alongside the unchanged frozen plan disposition and provenance.

## 19. New Publication Version

Every newly materialized occurrence is V2; day, batch, and surface versions remain unchanged.

## 20. Scheduled Interval Preservation

Scheduled `startsAt` and `endsAt` remain exact independent facts.

## 21. All-Day Geometry

All-day geometry remains the canonical user-day interval produced upstream by Task 6.3B.

## 22. Timed Geometry

Timed geometry is preserved verbatim and may equal an all-day interval.

## 23. Identical-Interval Distinction

Tests prove identical geometry can retain distinct `allDay` and `timed` meanings.

## 24. Legacy Semantics

V1 means timing provenance is unavailable, never timed-by-default.

## 25. Strict Validation

Validation dispatches on occurrence version and rejects extra, missing, malformed, and unsupported fields/versions.

## 26. V1 Validation

Valid V1 remains accepted; adding `timing` to V1 is rejected.

## 27. V2 Validation

V2 requires exactly one valid timing discriminator and rejects unknown timing keys/kinds.

## 28. Enclosing Day Validation

Day validation accepts canonical mixed V1/V2 occurrence arrays.

## 29. Enclosing Batch Validation

Batch validation accepts mixed occurrence versions without changing batch V1.

## 30. Surface Validation

HistoricalPlan surface initialization, publication, reconstruction, and export validate the union.

## 31. Version-Bump Decision

No evidence required a day, batch, surface, database, or Backup envelope bump.

## 32. Fingerprint

Occurrence version and V2 timing kind participate in semantic fingerprints.

## 33. Fingerprint Ordering

Existing canonical ordering is retained; timing adds meaning without order dependence.

## 34. Clone

Clone helpers preserve V1 exactly and clone V2 timing explicitly.

## 35. Clone Isolation

Mutating a cloned V2 timing object cannot mutate the source.

## 36. JSON

JSON round-trip preserves V1 absence and V2 timing tags exactly.

## 37. IndexedDB

Mixed V1/V2 history survives durable publication, restart, cutoff query, and export.

## 38. Mixed History

One ledger may contain V1, V2 timed, and V2 all-day publications.

## 39. V1→V2 Republication

A later V2 publication adds timing knowledge only at its publication cutoff.

## 40. V2→V2 Timing Change

All-day↔timed changes are fingerprint-significant and append meaningful revisions.

## 41. Cutoff Semantics

Historical reads before and after republication return the exact authority effective at each cutoff.

## 42. Current Authored Independence

No current authored source is consulted to interpret stored V1.

## 43. Preview Independence

Preview supplies facts only while publishing; it cannot reinterpret persisted history.

## 44. Active Independence

Active state is not an input to timing coverage or historical reads.

## 45. Goal Independence

Frozen Goal provenance remains orthogonal to timing semantics.

## 46. ExecutionHistory Independence

Execution outcomes remain separate evidence and do not infer planned timing kind.

## 47. Backup V6 Validation

Backup V6 transitively validates strict mixed HistoricalPlan V1/V2 authority.

## 48. Backup V6 Export

Existing export carries V2 timing through the unchanged complete HistoricalPlan payload.

## 49. Backup V6 Import

Existing restore composition imports exact V1/V2 snapshots without normalization.

## 50. Backup Semantic Verification

HistoricalPlan fingerprints include timing, so loss/change is detected during semantic verification.

## 51. Backup Version Decision

Backup V6 remains sufficient; Backup V7 was not introduced.

## 52. Restore Translation

No translation backfills V1 or consults current authored state.

## 53. Restore Composition

The existing HistoricalPlan participant preserves the validated union atomically.

## 54. Full Clear

Existing full clear still clears both HistoricalPlan stores and runtime authority.

## 55. Protection/Quarantine

Malformed occurrence evidence follows existing protected-surface behavior.

## 56. Unknown Future Version

Unsupported occurrence versions fail strict validation and cannot silently degrade.

## 57. Historical Surface Reads

Readers receive the canonical union and can query explicit coverage without inference.

## 58. Today Readiness

Today can now distinguish legacy-unavailable, explicit all-day, and explicit timed history.

## 59. Historical Day-Window Boundary

Frozen day-boundary provenance remains unchanged and separate from occurrence timing intent.

## 60. Existing Historical Geometry

No existing record, interval, version, or fingerprint is rewritten in storage.

## 61. New Publication Geometry

New publications freeze upstream exact geometry plus explicit timing intent.

## 62. Persistence Boundary

No new store, key, migration, authority, or anti-resurrection mechanism was added.

## 63. Performance

The change adds constant-time discriminator handling and no new query or storage scan.

## 64. Tests Added/Changed

Added strict domain, timing helper, fingerprint, clone/JSON, source mapping, republication cutoff, IndexedDB mixed-history, and Backup V6 mixed-history coverage.

## 65. Property Invariants

V1 absence is stable; V2 timing is required; timing and geometry are independent; canonical cloning/serialization/persistence conserve the tag.

## 66. Focused Validation

Five focused files passed: 51 tests; typecheck and lint passed.

## 67. Full Validation

`npm test` passed 85 files and 901 tests; `npm run typecheck`, `npm run lint`, and `npm run build` passed.

## 68. Bundle Validation

`npm run check:bundle` passed: 682,220 initial raw (+686), 169,727 initial gzip (+226), 30,091 largest lazy (+0), and 712,311 total bytes (+686) versus the task baseline, against 685,000/170,000/100,000/750,000 budgets.

## 69. Manual Validation

No UI was authorized or changed, so no manual product walkthrough was required.

## 70. Governance Updates

Updated the Phase 6 checkpoint, Current State, Roadmap, and Changelog.

## 71. ADR Determination

The accepted ADR was sufficient; no new enduring decision was needed.

## 72. Deviations

None. A mistyped bundle-script name was corrected to the repository’s canonical `check:bundle`; the canonical command passed.

## 73. Discoveries

HistoricalPlan’s enclosing formats were already occurrence-version tolerant through canonical validation, making an occurrence-only evolution sufficient.

## 74. Deferred Work

Today read-model/UI, Recommendation, Capacity, transition strategies, Goal reorientation, and adaptation remain outside scope.

## 75. Version Matrix

| Layer | Before | After | Decision |
|---|---:|---:|---|
| occurrence | V1 | V1 + V2 | V2 adds required timing |
| day/batch/surface | V1 | V1 | union-compatible |
| IndexedDB | existing | existing | no migration |
| Backup | V6 | V6 | no V7 |

## 76. Timing Matrix

| Snapshot | Coverage | Kind |
|---|---|---|
| V1 | unavailableLegacy | none |
| V2 allDay | available | allDay |
| V2 timed | available | timed |

## 77. Source Matrix

| Source | Published kind | Evidence |
|---|---|---|
| manual all-day | allDay | scheduled block `isAllDay` |
| manual timed | timed | scheduled block semantics |
| generated work | timed | work domain |
| template/Sleep | timed | template domain |
| imported/rule | excluded | publication filter |

## 78. Validation Matrix

| Input | Result |
|---|---|
| exact V1 | accept |
| V1 + timing | reject |
| exact V2 valid kind | accept |
| V2 missing/malformed/extra timing | reject |
| future version | reject/protect |

## 79. Fingerprint Matrix

| Pair | Equal? |
|---|---|
| V1 / V2 timed | no |
| V1 / V2 allDay | no |
| V2 timed / V2 allDay | no |
| reordered canonical provenance | yes |

## 80. Republication Matrix

| Earlier | Later | Before cutoff | After cutoff |
|---|---|---|---|
| V1 | V2 timed | unavailableLegacy | timed |
| V2 allDay | V2 timed | allDay | timed |
| V2 timed | V2 allDay | timed | allDay |

## 81. Persistence Matrix

| Boundary | V1 | V2 timing |
|---|---|---|
| clone/JSON | exact | exact |
| IndexedDB/restart | exact | exact |
| Backup V6/restore | exact | exact |
| full clear | cleared | cleared |

## 82. Read-Boundary Matrix

| Reader | Allowed | Forbidden |
|---|---|---|
| timing helper | stored version/tag | geometry inference |
| historical cutoff | effective publication | current Preview |
| future Today | explicit coverage/kind | authored backfill |

## 83. Product-Boundary Matrix

| Area | Result |
|---|---|
| HistoricalPlan | V2 provenance implemented |
| Today | readiness only; no query/UI |
| Planner/Summary | unchanged |
| temporal engine | Task 6.3B behavior untouched |

## 84. Epistemic Matrix

| Fact | Knowledge state |
|---|---|
| V1 timing | unavailableLegacy |
| V2 timing | available/frozen |
| current authored intent | irrelevant to old history |
| interval shape | geometry, not timing proof |

## 85. Architectural Invariant Assessment

Immutable history, strict versioning, provenance, read/write separation, restore determinism, and user authority remain satisfied.

## 86. Stop-Condition Assessment

No stop condition triggered: all reportable families had truthful source semantics and enclosing layers accepted occurrence-only versioning.

## 87. Architectural Alignment Assessment

Aligned with the architecture specification, accepted ADR, Tasks 6.3A/6.3B, and existing HistoricalPlan durability model.

## 88. Task 6.3 Resume Readiness

Yes—both original Task 6.3 blockers are mechanically resolved. The user-day blocker was resolved by Task 6.3B; explicit V2 timing, legacy distinction, reader coverage, and Backup/restore resolve the historical blocker. **Task 6.3 may resume.**

## 89. Recommended Next Task

**Resume Task 6.3 — Canonical Today Current-User-Day and Current-Plan Read Model.**

## 90. Final Completion Determination

Task 6.3C is complete and green. HistoricalPlan preserves occurrence meaning rather than guessing it later, and the original Task 6.3 prerequisites are satisfied.
