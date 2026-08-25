# Task 5.11 Result — Measurement Definition V1 Architecture and Durable Authority Boundary

## 1. Executive Determination
Measurement Definition V1 is architecture-complete and ready for one full durable-authority implementation slice. Progress and observations remain deferred.
## 2. Artifact Integrity
The immutable project copy matches the supplied artifact at SHA-256 `352b76015611bbed156b2e9fcd6ee1af95d8f3d4f0e389ed1e45cfd3253e13ba`.
## 3. Audit Scope
Defined identity, immutable revision/epoch semantics, policy/config, Goal/observation boundaries, persistence, protection, transactions, Backup, and sequencing.
## 4. Sources Reviewed
Tasks 5.1–5.3 and 5.10, Goal ADR/domain/surface, runtime transactions, restore composition, Backup V4, full clear, HistoricalPlan provenance, IndexedDB infrastructure, and ExecutionHistory correction patterns.
## 5. Current Goal Measurement Audit
Goal stores an optional validated `{id,version}` policy reference; Planner exposes no measurement workflow; HistoricalPlan freezes it; no policy registry/config/current Progress exists.
## 6. Measurement Definition Core Definition
Durable authored semantic authority describing how observations for one Goal are interpreted by one versioned policy during governed epochs. It never stores Progress.
## 7. Authority Decision
Choose independent `GoalMeasurementDefinition` authority. Embedding config in Goal would mix intent/history and make semantic revisions depend on unrelated Goal revisions.
## 8. Goal Relationship Cardinality
A Goal has zero or one V1 definition lineage, zero or one current active revision, and any number of retained historical revisions. Multiple dimensions are deferred.
## 9. Definition Identity
Opaque cryptographic stable ID, never semantic/title-derived or reused, preserved exactly through Backup/restore, with injectable allocation for tests.
## 10. Revision Model
Immutable append-like revision records, monotonic positive revision per lineage. Semantic edits never mutate prior records.
## 11. Definition vs Revision Identity
One ID represents the Goal's V1 measurement lineage; revision identifies exact semantics. Policy changes remain revisions. A new ID occurs only for first lineage creation after no historical lineage/full clear.
## 12. Measurement Epoch
Each revision begins an interval governed by that exact revision; its end is the next revision's `effectiveFrom`, or open-ended if latest.
## 13. Epoch Identity
Use `(definitionId, revision)`; no separate epoch ID or timestamp-only identity.
## 14. Effective-From Semantics
Required canonical ISO instant, equal to system-recorded save time in V1; no backdating. Per-lineage times strictly increase.
## 15. Observation Binding
Future observation binds `goalId`, `definitionId`, exact `definitionRevision`, `unitId`, `observedAt`, and value. Definition identity supplies policy semantics.
## 16. Observation Compatibility
Goal/definition/revision must exist, revision must be active at governed `observedAt`, and unit must match exactly. Corrections retain binding.
## 17. Canonical Definition Fields
`version,id,goalId,revision,status,policyRef,config,effectiveFrom,createdAt,fingerprint`; status is `active|inactive`. Config remains present on inactive boundary revisions.
## 18. Authority Envelope
`{version:1, definitions:[immutable revision records...]}` with deterministic order by Goal, ID, revision. Current indexes are derived.
## 19. Policy Reference
Exact `{id,version}`; implementation meaning never changes in place.
## 20. Policy Registry
Closed deterministic built-in registry validates/normalizes config, defines compatible observations, fingerprint inputs, and later Progress derivation.
## 21. Unknown Policy
Structurally valid unknown policies are preserved and resolve as unsupported; malformed envelope/config remains distinct and protects authority.
## 22. First Policy
`manualQuantityTarget@1`.
## 23. Manual Quantity Configuration
Exactly `{targetValue,unitId}`. Semantics are absolute, non-negative quantity increasing toward a positive target; no baseline, direction parameter, formulas, or conversion.
## 24. Target Value
Required positive canonical decimal string. Immutable within a revision; values above target are allowed.
## 25. Unit Identity
Stable built-in semantic ID, never a display label. Observation unit must equal it exactly.
## 26. Unit Registry
V1 bounded built-ins: `count`, `words`, `pages`, `miles`, `kilometers`, and `minutes`, each with stable label/precision guidance and no conversion.
## 27. Custom Units
Deferred, including custom count nouns, until identity, pluralization, compatibility, and migration semantics are defined.
## 28. Unit Conversion
Prohibited in V1; miles and kilometers are incompatible evidence.
## 29. Direction
`increaseTowardTarget` is fixed policy semantics, not authored config. Decrease/range maintenance require later policy versions/families.
## 30. Baseline
No baseline in the first policy; observations are absolute state values and implicit mathematical origin is zero.
## 31. Baseline Architecture Decision
Choose no-baseline V1. A future baseline-bearing policy must keep definition parameters distinct from observed evidence.
## 32. Over-Target Behavior
Preserve raw values and permit ratios above 1/percentages above 100; never clamp silently.
## 33. Numeric Representation
Canonical unsigned decimal strings: no exponent/sign/leading or insignificant trailing zeros, JSON-safe, exact for fingerprinting and later decimal arithmetic.
## 34. Precision
Reject empty, noncanonical, non-finite concepts; bound canonical strings to 100 characters for resource safety. Unit-owned display precision is not stored in definitions.
## 35. Definition Fingerprint
Canonical semantic fingerprint covers record version, status, policy ID/version, normalized config, and effective semantics; it excludes timestamps and identity.
## 36. Identity vs Semantic Fingerprint
Different lineages/revisions may share a fingerprint. Observations bind identity/revision; fingerprint verifies semantic equivalence/integrity.
## 37. Definition Editing
Planner may present “edit,” but every material save appends an immutable revision and starts an epoch.
## 38. No-Op Behavior
Normalized identical status/policy/config is accepted as no-op: no revision, clock allocation, persistence, or notification.
## 39. Policy Change
Appends an active revision/epoch under the same lineage; old observations remain with old semantics.
## 40. Target/Unit/Direction Change
Target/unit changes append revisions. Direction requires another policy/version and likewise appends. No old evidence conversion/reinterpretation.
## 41. Stop Measuring
Append an `inactive` revision copying last policy/config. It closes the active interval and makes current Progress `notDefined` while retaining history.
## 42. Restart Measurement
Append a new `active` revision, even with identical config; never reopen an old epoch.
## 43. Historical Definition Retention
Retain every revision indefinitely in V1; no normal hard delete or compaction.
## 44. Goal Lifecycle Interaction
Complete/archive/reactivate neither creates, stops, resets, deletes, nor reopens measurement revisions. Measurement commands remain explicit.
## 45. Goal Backup/Restore Relationship
Definitions reference stable Goal IDs. Whole restore validates every reference against target Goal authority and installs both coherently; profiles affect neither.
## 46. Observation Future Compatibility
Exact immutable revision identity and canonical unit/config allow an observation ledger without definition redesign.
## 47. Epoch End/Overlap
Next revision ends the prior interval; inactive revisions are non-measuring intervals. Strict monotonic times and one lineage prohibit overlap.
## 48. Current Definition Resolution
For Goal/time, choose the highest revision whose `effectiveFrom <= time`; return it only if active. Missing/inactive returns `notDefined`.
## 49. Historical Resolution
Uses retained definition authority alone; current Goal fields are not semantic inputs beyond Goal existence where required by current queries.
## 50. Goal measurementPolicyRef Boundary
Deprecate as compatibility metadata and make it non-operative once authority ships. MeasurementDefinition `policyRef` is the sole truth.
## 51. Goal Schema Consequence
No immediate Goal V2 in Task 5.12. Preserve the optional field for compatible restore/round-trip, block new UI authorship, and remove only in a later explicit migration.
## 52. HistoricalPlan Consequence
No Task 5.12 change. Existing frozen refs remain historical Goal metadata; manual quantity Progress does not consume them. Future activity policies may freeze definition identity separately.
## 53. Progress Query Compatibility
Future `{goalId,evaluationAsOf}` query deterministically resolves definition revision, compatible observations, registry policy, and derived result.
## 54. Persistence Class
Independent versioned durable protected IndexedDB authority.
## 55. Collection/Record Model
One physical record per immutable definition revision with a compound logical key; authority envelope is reconstructed and canonically sorted.
## 56. Append/Immutable Model
Normal commands only append revisions; exact restore/full clear are privileged replacement boundaries.
## 57. Protection
Read failure, invalid envelope/lineage, orphan Goal reference, overlap/order violation, or malformed known-policy config protects the whole authority. No partial trust.
## 58. Unknown Policy vs Corruption
Unknown structurally valid policy is unsupported, not corrupt. Known policy with invalid config or malformed generic JSON envelope is corrupt/protected.
## 59. Readiness
Ingress: initializing, accepted, protected. Durability: unknown, durable, pending, storageFailure, following Goal conventions.
## 60. Mutation Admission
All commands participate in centralized authority mutation admission and reject while shared transaction is active.
## 61. Runtime Snapshot/Transaction
Snapshot captures exact authority, desired state, ingress, and durability; exact install allocates/persists nothing and defers notification through the shared scheduler.
## 62. Participant Evolution
Measurement Definition becomes participant seven. ID unions, assertions, restore composition, and combined IndexedDB adapters must be extended without assuming seven is final.
## 63. Full Clear
Joins governed all-authority clear; removal failure is reported independently and runtime settles to explicit empty authority under established rules.
## 64. Backup Evolution
Ship Backup V5 (unless numbering advances first) containing complete definition revision history in the same task as persistence.
## 65. Legacy Translation
V4 and earlier translate to explicit empty definition authority. Never fabricate config from Goal refs or activity.
## 66. Definition/Observation Referential Integrity
Definitions require existing Goal; future observations require exact existing revision. Restore rejects/protects orphan relationships rather than dropping them.
## 67. Command Inventory
`createMeasurementDefinition`, `reviseMeasurementDefinition`, `stopMeasuringGoal`, `restartMeasurement`, and durability recovery; all revision-guarded.
## 68. Query Inventory
`getCurrentMeasurementDefinition(goalId,asOf?)`, `getMeasurementDefinitionRevision`, `listMeasurementDefinitionHistory(goalId)`, ingress/durability queries, and subscriptions.
## 69. Definition Invariant Assessment
All 61 required invariants are adopted: single authored authority, immutable non-overlapping epochs, exact observation binding, no conversion/fake migration/hard delete, complete durability boundaries, and no Progress implementation.
## 70. Definition Contract Matrix
| Field | Required | Ownership | Mutable | Revision significance |
| --- | ---: | --- | ---: | --- |
| version/id/goalId | Yes | system/relationship | No | lineage identity |
| revision | Yes | system | No | exact epoch |
| status | Yes | authored command | No | material |
| policyRef/config | Yes | authored + registry-normalized | No | material |
| effectiveFrom/createdAt | Yes | injected clock | No | boundary/audit |
| fingerprint | Yes | derived | No | semantic verification |
## 71. Manual Quantity Config Matrix
| Field | Required | Meaning | New epoch |
| --- | ---: | --- | ---: |
| targetValue | Yes | positive absolute target | Yes |
| unitId | Yes | exact built-in unit | Yes |
| baseline/direction/display precision/custom label | No | excluded/fixed/deferred | N/A |
## 72. Revision/Epoch Matrix
| Change | New revision/epoch | Old observations reinterpreted |
| --- | ---: | ---: |
| Target/unit/policy change | Yes | No |
| Direction/baseline model change | New policy revision + epoch | No |
| Normalized no-op | No | No |
| Stop/restart | Yes | No |
## 73. Lifecycle Matrix
| Event | Current definition | History |
| --- | --- | --- |
| Goal active/completed/archived/reactivated | Unchanged | Retained |
| Stop | New inactive revision | Retained |
| Restart | New active revision | Retained |
| Full clear | Empty | Removed by explicit destructive boundary |
## 74. Observation Compatibility Matrix
| Condition | Compatible | Reason |
| --- | ---: | --- |
| Exact active revision/time/unit | Yes | Exact semantics |
| Old revision after new epoch | No for new entry | Epoch mismatch |
| Different unit/unknown definition | No | Incompatible/missing semantics |
| Correction with same binding | Yes | Provenance preserved |
| Unsupported future policy | Preserved, not interpretable | Forward compatibility |
## 75. Goal Integration Matrix
| Concern | Decision |
| --- | --- |
| Relationship | Definition owns `goalId` |
| Current pointer | Derived, not stored on Goal |
| Existing policy ref | Deprecated non-operative metadata |
| Lifecycle/profile | Independent |
| Restore | Cross-authority referential validation |
## 76. Persistence Matrix
| Boundary | Decision |
| --- | --- |
| IndexedDB | One revision record each |
| Protection/readiness | Whole-authority governed |
| Mutation | Append-only normal commands |
| Runtime transaction | Full participant |
| Full clear | Full participant |
## 77. Backup Matrix
| Case | Decision |
| --- | --- |
| Latest export | All definition revisions |
| V5 restore | Exact IDs/config/history + Goal integrity |
| V4/older import | Explicit empty authority |
| Derived Progress | Never serialized |
## 78. Historical Context Matrix
| Source | Role |
| --- | --- |
| Definition revisions | Measurement semantics/epochs |
| Future observations | Goal-state evidence |
| HistoricalPlan | Goal Activity; unchanged for first policy |
| ExecutionHistory | Occurrence evidence; unchanged |
| Current Goal ref | No measurement authority |
## 79. Definition Location Alternatives
Independent authority is recommended: strongest history/identity and modest integration cost. Goal embedding and embedded sub-ledgers mix lifecycles and increase dual-authority risk.
## 80. Revision Alternatives
Immutable records are accepted. Mutable current records cannot reproduce old semantics; event sourcing is unnecessary.
## 81. Epoch Alternatives
Revision-implied epoch is accepted: exact binding with minimal identity. Separate epoch ID duplicates identity; timestamp alone is collision/order-prone.
## 82. Baseline Alternatives
No-baseline V1 is accepted for simplicity and semantic purity. Config baseline blurs evidence; baseline observation belongs to a later policy if needed.
## 83. Unit Alternatives
Built-in units only are accepted. Custom count labels and arbitrary units are deferred; neither conversion nor semantic ambiguity enters V1.
## 84. Risk Register
| Risk | Severity | Mitigation |
| --- | --- | --- |
| Dual Goal/definition truth | High | Goal ref non-operative |
| Edits reinterpret history/epoch overlap | High | immutable monotonic revisions |
| Observation binds only Goal/wrong unit | High | exact revision + unit validation |
| Unsupported policy seen as corruption | Medium | structural/semantic split |
| Backup drops history/orphan Goal | High | V5 exact restore + integrity checks |
| Baseline/conversion/formula complexity | Medium | excluded from first policy |
| Hard delete breaks evidence | High | no normal deletion |
## 85. Architecture Decision Set
All 35 required decisions are settled: independent authority, one lineage/Goal, opaque ID, immutable revisions, revision epochs, save-time effects, one effective revision, closed registry, manual absolute quantity config, decimal strings, built-in units, no baseline/conversion, append stop/restart, exact observation binding, deprecated Goal ref, unchanged HistoricalPlan, protected IndexedDB authority, participant seven, Backup V5, empty legacy translation, and Slice B.
## 86. Implementation Slice Determination
**Slice B — Full Durable Definition Authority.** Core, registry/validation/fingerprint, IndexedDB, commands/queries, readiness/protection, runtime transaction, full clear, Backup V5, restore, and tests ship together.
## 87. Backup Sequencing
Durable definitions must not ship without complete export/import/restore/full-clear. Backup V5 belongs in Task 5.12.
## 88. Planner UI Sequencing
Architecture → durable definition substrate → observation architecture/substrate → manual quantity projection → Planner/Summary UI.
## 89. Observation Sequencing
Task 5.12 implements no observations. Task 5.13 finalizes and implements the correction-capable observation authority against this exact binding contract.
## 90. ADR Determination
Created `ADR_GOAL_MEASUREMENT_DEFINITION_AUTHORITY_REVISION_EPOCH_AND_POLICY_MODEL.md` because the authority/epoch/policy boundary is enduring and settled.
## 91. Governance Updates
Updated Phase 5 checkpoint, CURRENT_STATE, ROADMAP, DECISIONS, CHANGELOG, and added the ADR/result.
## 92. Validation
Architecture-only validation: immutable hash verified and `git diff --check` passed. No tests/build run is claimed for Task 5.11.
## 93. Deviations
No production/test changes and no scope deviation. The design narrows Task 5.10's possible baseline/direction config into fixed no-baseline increase semantics for the first policy.
## 94. Stop-Condition Assessment
No unresolved stop condition: stable Goal IDs, immutable collection records, exact binding, monotonic epochs, structural/semantic validation, extensible participants, exact Backup, and canonical decimal storage are feasible in current architecture.
## 95. Recommended Task 5.12
**Task 5.12 — Implement Measurement Definition V1 Durable Authority, Manual Quantity Policy Registry, and Backup V5 Integration.**
## 96. Final Architecture Statement
Task 5.11 is complete with one implementation-ready authority that preserves what the user meant by measurement at every epoch without implementing observations or Progress.
