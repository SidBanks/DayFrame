# Task 5.12 Result — Measurement Definition V1 Durable Authority, Manual Quantity Policy Registry, and Backup V5 Integration

## 1. Executive Result
Implemented Measurement Definition V1 as DayFrame's seventh complete durable authority. Observations and Progress remain deferred.
## 2. Artifact Integrity
Immutable project copy matches SHA-256 `2f5043331da87537357f9d7a685711e8b3b85c6c7c42301b75899867cadfca56`.
## 3. Task 5.11 Prerequisite Confirmation
Stable Goal identity, additive IndexedDB, generalized transaction machinery, and complete restore boundaries support the accepted design without a prerequisite.
## 4. Initial Source Audit
Confirmed six runtime/restore participants, Backup V4 latest, DB version 4, stable Goal IDs, combined IndexedDB replacement, and extensible full clear.
## 5. Files Changed
Added measurement domain/surface/tests and Backup V5/tests; extended database, store/types, transactions, restore, clear, Settings export, durability reporting, fixtures, and governance.
## 6. Domain Placement
Canonical definitions live under `core/measurement`; durable orchestration lives in `state/measurementDefinitionSurface`.
## 7. Definition ID
Branded UUID-v4 identity with cryptographic default and injectable allocator.
## 8. Definition Contract
Exact V1 fields: version, ID, Goal ID, revision, active/inactive status, policy ref, config, effective/save timestamps, semantic fingerprint.
## 9. Authority Envelope
Versioned `{version:1, definitions:[...]}` with canonical lineage/revision ordering.
## 10. One-Lineage Rule
Validation and create commands reject a second definition ID for one Goal.
## 11. Revision Model
Positive contiguous revisions increment once per material command.
## 12. Immutable Records
Normal commands append physical records; only restore/replacement and clear replace authority.
## 13. Epoch Identity
Exact `(definitionId, revision)`.
## 14. Effective-From
Injected system save time, canonical ISO, equal to record creation time; no backdating input exists.
## 15. Epoch Resolution
Highest revision with `effectiveFrom <= asOf`; inactive returns not-defined; intervals are half-open.
## 16. Active/Inactive Status
Only governed statuses implemented; inactivity preserves config/history.
## 17. Policy Registry
Closed deterministic validation/support boundary with no Progress calculation.
## 18. Manual Quantity Policy
Implemented `manualQuantityTarget@1` with fixed increase-toward-target semantics.
## 19. Config Contract
Exactly `targetValue` and `unitId`; baseline/direction/labels/precision/formulas absent.
## 20. Decimal Representation
Canonical unsigned decimal string, maximum 100 characters.
## 21. Decimal Validation
Rejects signs, exponent, leading/trailing insignificant zeroes, trailing point, dot-leading values, zero target, and overlength input.
## 22. Unit Registry
Exactly count, words, pages, miles, kilometers, and minutes.
## 23. Unit Validation
Known-policy config rejects every other unit.
## 24. No Conversion
No conversion API or compatibility shortcut exists.
## 25. Custom-Unit Boundary
No custom unit or label was introduced.
## 26. Fingerprint
Deterministic semantic fingerprint covers version/status/policy/config and excludes identity/timestamps.
## 27. Goal Referential Integrity
Bootstrap/create/Backup V5 require referenced Goals; malformed/orphan authority is rejected or protected.
## 28. Goal Policy-Ref Boundary
Legacy Goal policy ref remains roundtrippable and non-operative; no definition is fabricated.
## 29. Create Command
Creates revision 1 only for an existing Goal with no lineage and supported valid config.
## 30. Revise Command
Appends an active revision for material supported config.
## 31. No-Op
Semantically identical active save allocates no ID, time, revision, or persistence.
## 32. Revision Guard
Every lineage mutation checks the current expected revision.
## 33. Stop Command
Appends an inactive revision; repeated stop rejects.
## 34. Restart Command
Appends a new active revision and never reopens history.
## 35. Queries
Current/as-of, exact revision, and ordered Goal history are deterministic.
## 36. Clone Isolation
All query, subscription, command, snapshot, and export outputs are cloned.
## 37. Persistence
Independent protected IndexedDB collection.
## 38. Database Upgrade
Physical database version advanced additively from 4 to 5.
## 39. Physical Record Model
One record per immutable revision, compound `[id,revision]` key, Goal index.
## 40. Readiness
Initializing/accepted/protected ingress integrated into bootstrap ordering after Goals.
## 41. Protection
Read failure or invalid/orphan/malformed authority protects instead of becoming empty.
## 42. Unknown Policy
Structurally JSON-safe unknown policies survive as unsupported; authoring unknown policies is rejected.
## 43. Durability
Unknown/durable/pending/storage-failure states and explicit retry follow Goal conventions.
## 44. Mutation Admission
Commands use the centralized runtime-transaction gate.
## 45. Runtime Snapshot
Captures authority, desired authority, ingress, and durability exactly.
## 46. Exact Runtime Install
Clone-only install with no persistence, allocation, clock, or command side effects.
## 47. Notification Scheduler
Added the measurementDefinitions shared notification channel.
## 48. Runtime Participant Seven
Registered Measurement Definitions as participant seven; generic authority transaction remains iterable.
## 49. Cross-Read Coherence
Shared deferred notification commit/abort includes the new participant.
## 50. Existing Participant Preservation
Existing participant capture/install semantics were unchanged.
## 51. Full Clear
Settles seven enumerable results and reports measurement-definition removal independently.
## 52. Anti-Resurrection
Clear empties runtime/desired/durable collection; restart reload verifies emptiness.
## 53. Backup V5
Latest Settings export is complete seven-authority Backup V5.
## 54. Backup V5 Definition Payload
Contains exact canonical authority and all immutable revisions; never derived Progress.
## 55. Legacy V1–V4 Compatibility
Existing readers/import entry points remain; complete V3/V4 restores explicitly target empty measurement authority.
## 56. Legacy Translation
V4→V5 helper produces canonical empty definitions; Goal refs never synthesize definitions.
## 57. Backup Protection
Protected definitions block complete V5 export; V3/V4 export rejects non-empty definitions.
## 58. Restore Participant
Added indexedDb measurementDefinitions adapter with source capture/recheck, validation, fingerprint, and runtime translation.
## 59. Restore Target Validation
Structural/semantic definition validation occurs before mutation.
## 60. Restore Goal Integrity
Backup V5 validation cross-checks every definition Goal against target Goals before coordinator mutation.
## 61. Restore Staging
Target/recovery staging and whole fingerprints enumerate seven participants.
## 62. Combined IndexedDB Replacement
Execution, HistoricalPlan, Goals, and Measurement Definitions replace/verify in one IndexedDB transaction.
## 63. Restore Commit
Definition durable target participates in the existing journaled commit.
## 64. Runtime Install
Definition settled snapshot installs through the shared transaction.
## 65. Rollback
Recovery-side definition payload is staged and exactly restored on rollback.
## 66. Startup Recovery
The generic seven-participant journal/staging recovery path includes definitions.
## 67. Restore Fingerprints
Definition history contributes to participant and whole-authority fingerprints.
## 68. HistoricalPlan Boundary
No schema, publication, fingerprint, or semantic change for Task 5.12.
## 69. ExecutionHistory Boundary
No schema, outcome, or correction change.
## 70. Goal Activity Boundary
Projection/query/UI remain unchanged and do not consume definitions.
## 71. Scheduler Boundary
Definitions never enter scheduling inputs.
## 72. Preview Staleness
Definition commands do not alter authored scheduling state or Preview.
## 73. Goal UI Boundary
No measurement controls were added.
## 74. Summary Boundary
No Progress or definition presentation was added.
## 75. Profile Boundary
Profiles neither own nor replace definitions.
## 76. Goal Lifecycle Boundary
Goal lifecycle commands do not mutate definitions.
## 77. Deprecated Goal Ref Regression
The legacy field remains ignored by definition creation/resolution/translation.
## 78. Tests Added/Changed
Added domain, surface, Backup V5 unit, and Backup V5 integration suites; updated restore/runtime/full-clear/Settings fixtures.
## 79. Canonical Fixtures
Covered active, revised, inactive/restarted, unsupported-policy, orphan, empty legacy, and persisted/reloaded histories.
## 80. Property Invariants
Tests cover canonical decimals, fingerprint identity independence, monotonic epochs, no-op, guards, one lineage, clone isolation, Goal integrity, persistence, restore, and clear.
## 81. Focused Validation
Passed 9 files / 190 tests.
## 82. Full Validation
Clean canonical rerun: lint/typecheck passed; 74 files / 839 tests passed; build transformed 100 modules; `git diff --check` passed. The 654.97 kB main JS bundle advisory remains non-blocking.
## 83. Manual Validation
Manual measurement workflow validation not applicable; no measurement UI exists.
## 84. Governance Updates
Updated Phase 5 checkpoint, CURRENT_STATE, ROADMAP, and CHANGELOG. No ADR refinement was required.
## 85. Deviations
Initial full run: 5 durability-classification expected objects omitted newly reported Goals/Measurement Definitions; expectations were corrected and the canonical suite rerun cleanly.
## 86. Discoveries
Physical schema version had to advance to 5 for additive store creation on existing databases; bootstrap was explicitly ordered Goal-first for referential validation.
## 87. Deferred Work
Observation authority, Progress derivation/UI, definition UI, custom units, conversion, baselines, other policies, Recommendations, and adaptation.
## 88. Definition Contract Matrix
| Concern | Result |
| --- | --- |
| Identity/revision/epoch | Branded ID; immutable contiguous revision |
| Status/time | Active/inactive; injected strict save time |
| Policy/config | Explicit ref; normalized registry config |
| Fingerprint | Semantic, identity/time independent |
## 89. Command Matrix
| Command | Result |
| --- | --- |
| Create | Revision 1 or governed rejection |
| Revise | New active revision / no-op / stale rejection |
| Stop | New inactive revision |
| Restart | New active revision |
## 90. Epoch Matrix
| Case | Result |
| --- | --- |
| Before first | notDefined |
| Active interval | exact revision |
| Inactive interval | notDefined |
| Equal/decreasing save time | rejected |
## 91. Policy Matrix
| Policy | Authoring | Restore/query |
| --- | --- | --- |
| manualQuantityTarget@1 valid | Supported | Supported |
| Known malformed | Rejected/protected | Invalid |
| Structurally valid future | Not authorable | Preserved unsupported |
## 92. Unit Matrix
| Unit class | Result |
| --- | --- |
| Six built-ins | Accepted exact identity |
| Unknown/custom | Rejected |
| Conversion | Prohibited |
## 93. Authority Matrix
| Boundary | Result |
| --- | --- |
| IndexedDB/readiness/protection | Implemented |
| Mutation/runtime/notifications | Implemented |
| Full clear/Backup/restore | Implemented |
| Progress persistence | Absent |
## 94. Goal Interaction Matrix
| Interaction | Result |
| --- | --- |
| Missing Goal | Reject/protect |
| Rename/lifecycle/profile | Definition unchanged |
| Legacy policy ref | Non-operative |
| Full clear/whole restore | Coherent authority settlement |
## 95. Backup Matrix
| Version | Definitions |
| --- | --- |
| V5 | Exact complete history |
| V4/V3 restore | Explicit empty |
| V4/V3 export with definitions | Rejected |
| Derived Progress | Never included |
## 96. Restore Matrix
| Phase | Result |
| --- | --- |
| Validate/stage/recheck | Seven participants |
| IndexedDB commit/verify | One combined transaction |
| Runtime install | Shared coherent transaction |
| Rollback/startup recovery | Exact staged recovery |
## 97. Protection Matrix
| State | Result |
| --- | --- |
| Read/malformed/orphan failure | Whole authority protected |
| Unknown policy | Preserved unsupported |
| Protected export | Blocked |
| Generic Goal Activity | Unaffected |
## 98. Cross-Surface Matrix
| Surface | Effect |
| --- | --- |
| Planner/Summary/Schedule | No new UI/behavior |
| Goal/Profiles | Independent |
| HistoricalPlan/ExecutionHistory/Goal Activity | Unchanged |
| Settings | Latest complete export V5 |
## 99. Legacy Compatibility Matrix
| Input | Result |
| --- | --- |
| Backup V4 | Goals preserved; definitions empty |
| Backup V3 | Goals/definitions empty |
| Legacy Goal policy ref | Preserved, no fabricated definition |
| Existing DB | Additive v5 store upgrade |
## 100. Product-Boundary Matrix
| Capability | Status |
| --- | --- |
| Durable measurement meaning | Implemented |
| Observation/Progress/UI | Deferred |
| Formula/conversion/custom unit | Prohibited V1 |
| Recommendation/adaptation/ML | Deferred/prohibited |
## 101. Architectural Invariant Assessment
All required invariants are implemented or covered: immutable exact epochs, bounded policy/numeric semantics, one source of truth, Goal integrity, complete seven-authority durability, and no Progress behavior.
## 102. Stop-Condition Assessment
No unresolved identity, epoch, policy, decimal, Goal-integrity, persistence, transaction, Backup, restore, protection, or reproducibility stop condition remains.
## 103. Architectural Alignment Assessment
Implementation matches the Task 5.11 ADR; only the necessary physical DB version and explicit Goal-first bootstrap ordering were implementation discoveries.
## 104. Recommended Next Task
**Task 5.13 — Progress Observation V1 Architecture and Durable Authority.**
## 105. Final Completion Determination
Task 5.12 is complete when the final validation recorded above is green: measurement meaning is durable before any measured value or Progress exists.
