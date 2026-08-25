# Task 5.13 — Progress Observation V1 Architecture and Durable Authority — Result

## 1. Executive Result
Complete. DayFrame now has an eighth durable, revisioned measured-state evidence authority without a Progress projection or UI.
## 2. Artifact Integrity
The immutable task copy matches the supplied artifact: SHA-256 `b330c5edd7c8658e378cc7d18650a5dda51fb4f1c5b8dc96e79d1f9ab94f276b`.
## 3. Task 5.12 Prerequisite Confirmation
Exact definition revision lookup, epoch resolution, Goal integrity, durable compound-key storage, runtime transactions, and Backup V5 were present.
## 4. Initial Source Audit
The audit confirmed DB version 5, seven runtime/restore participants, and reusable protected collection patterns before implementation.
## 5. Files Changed
Added the observation domain/surface/tests, Backup V6, integration tests, DB schema/store/runtime/restore/UI backup wiring, an ADR, and minimal governance updates.
## 6. Domain Placement
Progress Observation sits between Measurement Definition semantics and future derived Progress.
## 7. Observation ID
`GoalProgressObservationId` is a branded UUID-v4 with cryptographic default and injectable allocator.
## 8. Observation Contract
V1 stores identity, revision, Goal, exact definition epoch, unit, value, observed/recorded times, status, and fingerprint.
## 9. Observation Lineage
One ID denotes one logical observation across all correction/retraction revisions.
## 10. Revision Model
Revision 1 creates; every material correction or retraction appends the next positive integer.
## 11. Immutable Records
Physical `[id, revision]` records are append-only; no hard-delete command exists.
## 12. Goal Binding
Every revision stores and validates an existing exact `goalId`.
## 13. Definition Binding
Every lineage permanently binds one `definitionId` and `definitionRevision`.
## 14. Unit Binding
Stored `unitId` must exactly equal the bound definition config; conversion is absent.
## 15. Value Semantics
Values are absolute measured quantities, not increments.
## 16. Decimal Reuse
The Task 5.12 canonical unsigned-decimal grammar is reused; zero and over-target values are valid.
## 17. observedAt
`observedAt` is the canonical instant at which the measured state was true.
## 18. recordedAt
`recordedAt` is injected system time when DayFrame learned or amended the evidence.
## 19. Backdating
Backdating is allowed only inside the exact bound active definition epoch.
## 20. Future-Date Rule
`observedAt > recordedAt` is rejected.
## 21. Epoch Compatibility
Create resolves the definition at `observedAt`; corrections may move time only within the original epoch.
## 22. Correction
Correction may replace value and/or observed time through an appended revision.
## 23. Correction Binding
Goal, definition ID/revision, and unit are invariant across correction.
## 24. observedAt Correction
Permitted within the same exact active epoch and rejected across its boundary.
## 25. No-Op
Identical correction returns `noOp` with no clock, write, revision, or notification.
## 26. Retraction
Retraction appends a `retracted` revision.
## 27. Retraction Semantics
The prior value/time/context are copied; status removes the lineage from effective evidence.
## 28. Repeated Retraction
Returns deterministic `noOp` and appends nothing.
## 29. Correction After Retraction
Rejected; no hidden unretraction exists.
## 30. Effective Head
The highest lineage revision visible at the cutoff is selected.
## 31. As-Of Knowledge
Revision visibility uses `recordedAt`; evidence chronology uses `observedAt`.
## 32. Duplicate/Same-Time Behavior
Independent duplicates are allowed except two effective active heads for the same Goal/epoch/`observedAt`, which are rejected.
## 33. Fingerprint
Semantic fingerprint includes version, status, exact definition binding, unit, value, and observed time; it excludes identity, revision, recorded time, and Goal ID.
## 34. Authority Envelope
`GoalProgressObservationAuthorityV1 { version: 1, observations: [...] }` is canonical.
## 35. Referential Integrity
Bootstrap and Backup V6 validate Goal existence, exact definition existence, Goal match, unit match, epoch, and lineage.
## 36. Unsupported Policy
Structurally valid records remain representable; ordinary authoring is limited to `manualQuantityTarget@1`.
## 37. Create Command
Create validates dependencies, time, value, supported active epoch, revision guard, and conflict before allocation/append.
## 38. Definition Revision Guard
The caller supplies `expectedDefinitionRevision`; mismatch rejects stale UI state.
## 39. Correct Command
Correction requires current active head and expected observation revision.
## 40. Retract Command
Retraction requires the current active head and preserves immutable context.
## 41. Queries
Exact revision, lineage history, effective head, Goal/definition heads, and latest candidate are exposed.
## 42. Clone Isolation
All authority, mutation, subscription, and query results are structured clones.
## 43. Persistence
Observations use the shared independent IndexedDB authority.
## 44. Database Upgrade
The physical DB version advanced additively from 5 to 6.
## 45. Physical Record Model
Compound key `[id, revision]` plus Goal, definition-revision, and observed-time indexes.
## 46. Bootstrap Ordering
Goals initialize first, Measurement Definitions next, and observations only after both can be trusted.
## 47. Readiness
Initializing, accepted, and protected ingress are explicit.
## 48. Protection
Read, structural, lineage, reference, epoch, unit, time, and same-time conflicts protect the whole authority.
## 49. Durability
Unknown, durable, pending, and storage-failure states follow existing authority semantics.
## 50. Mutation Admission
All commands use the centralized runtime-transaction admission boundary.
## 51. Runtime Snapshot
Snapshot captures live/desired authority, ingress, durability, and evidence history.
## 52. Exact Runtime Install
Install is clone-exact and has no clock, allocator, persistence, command, or direct-notification side effects.
## 53. Notification Scheduler
`progressObservations` is a shared ordered scheduler channel.
## 54. Runtime Participant Eight
Observation joins the generalized participant registry; no terminal count is encoded in the architecture.
## 55. Cross-Read Coherence
Goal, definitions, observations, and existing authorities commit/abort through one runtime transaction.
## 56. Full Clear
Observation history is an enumerable governed full-clear authority.
## 57. Anti-Resurrection
The durable store is cleared inside the replacement contract and restart reads canonical empty state.
## 58. Backup Evolution
The latest complete format is Backup V6.
## 59. Latest Backup Payload
V6 contains all eight authorities and complete immutable observation history, never derived Progress.
## 60. Legacy Translation
V5 and earlier whole-authority restores explicitly target empty observations.
## 61. Backup Protection
Protected observations block V6 export; non-empty observations block V5 export.
## 62. Restore Participant
Observation is a generic IndexedDB restore participant.
## 63. Restore Referential Validation
Canonical V6 import validates observations against target Goals and exact target definitions before mutation.
## 64. Restore Staging
Target and recovery payloads/fingerprints include participant eight.
## 65. Combined IndexedDB Replacement
ExecutionHistory, HistoricalPlan, Goals, definitions, and observations replace together.
## 66. Restore Commit
Durable replacement and verification include exact observation history.
## 67. Runtime Install
Translated accepted/durable observation state installs within the shared transaction.
## 68. Rollback
Recovery-side observation authority is restored exactly after injected failure.
## 69. Startup Recovery
The existing journal/stage recovery path automatically includes participant eight.
## 70. Restore Fingerprints
Participant and whole-restore fingerprints include complete observation revision history.
## 71. Goal Boundary
Observation commands never mutate Goal state.
## 72. Measurement Definition Boundary
Observation commands never mutate or retarget definitions.
## 73. Goal Activity Boundary
Goal Activity remains unchanged and is not observation evidence.
## 74. HistoricalPlan Boundary
HistoricalPlan schema and behavior are unchanged.
## 75. ExecutionHistory Boundary
No outcome is automatically converted into an observation.
## 76. Scheduler Boundary
Observation mutation has no scheduling effect.
## 77. Preview Boundary
Observation mutation does not stale Preview.
## 78. Profile Boundary
Profiles neither own nor replace observations.
## 79. Goal Lifecycle Boundary
Rename, complete, archive, and reactivate do not rewrite observation history.
## 80. Definition Revision Boundary
Target/unit revision, stop, and restart never migrate, convert, or retract old evidence.
## 81. Future Progress Compatibility
The authority supplies an effective exact epoch and latest active measured-state candidate without calculating Progress.
## 82. Tests Added/Changed
Added domain, surface, Backup V6, restore/full-clear fixture, and end-to-end roundtrip/legacy-clear/restart coverage.
## 83. Canonical Fixtures
Fixtures cover zero, over-target grammar, correction as-of, retraction, stale guards, same-time conflict, exact epochs, and empty legacy translation.
## 84. Property Invariants
Tests establish immutable revisions, permanent binding, status-based retraction, knowledge-time visibility, clone isolation, exact backup, and anti-resurrection.
## 85. Focused Validation
Focused observation/Backup/restore/runtime/full-clear suites passed: 8 files / 28 tests.
## 86. Full Validation
Clean canonical rerun: lint/typecheck passed; 78 files / 846 tests passed; build transformed 103 modules; `git diff --check` passed. The 672.18 kB main JS bundle advisory remains non-blocking.
## 87. Manual Validation
Manual Progress Observation workflow validation not applicable; no observation UI exists.
## 88. Governance Updates
Checkpoint, Current State, Roadmap, Changelog, and this result now identify Task 5.13 complete and Task 5.14 next.
## 89. ADR Determination
Created `ADR_PROGRESS_OBSERVATION_IDENTITY_REVISION_TIME_AND_DEFINITION_BINDING_MODEL.md` because evidence/time/revision semantics are enduring.
## 90. Deviations
The preferred explicit create binding was implemented as Goal + observed time resolution with an expected-definition-revision guard.
## 91. Discoveries
The existing generalized restore/runtime designs accepted an eighth participant through registry extension rather than a new stage.
## 92. Deferred Work
Progress ratios/percentages, UI, pace, on-track status, recommendations, adaptation, baselines, conversion, milestones, and integrations remain deferred/prohibited.
## 93. Observation Contract Matrix

| Field | Required | Correction mutable | Fingerprint |
|---|---:|---:|---:|
| version | yes | no | yes |
| id | yes | no | no |
| revision | yes | append-only | no |
| goalId | yes | no | no |
| definitionId/revision | yes | no | yes |
| unitId | yes | no | yes |
| value | yes | yes | yes |
| observedAt | yes | within epoch | yes |
| recordedAt | yes | new revision only | no |
| status | yes | via retraction | yes |
| fingerprint | yes | recomputed | n/a |

## 94. Command Matrix

| Command | Appends | Binding changes | Clock |
|---|---:|---:|---:|
| create | yes | establishes | yes |
| correction | yes | no | yes |
| correction no-op | no | no | no |
| retract | yes | no | yes |
| repeated retract | no | no | no |

## 95. Time Matrix

| Time | Meaning | Governs |
|---|---|---|
| observedAt | measured state time | chronology/epoch |
| recordedAt | knowledge time | revision visibility |
| effectiveFrom | definition epoch start | binding compatibility |
| evaluationAsOf | query cutoff | visible knowledge/evidence |

## 96. Definition Compatibility Matrix

| Condition | Valid |
|---|---:|
| exact active revision | yes |
| revision outside epoch / inactive / missing | no |
| unit or Goal mismatch | no |
| unsupported policy ordinary authoring | no |

## 97. Revision Matrix

| State/cutoff | Effective evidence |
|---|---|
| active r1 / before r2 | r1 |
| corrected r2 / before r3 | r2 |
| retracted r3 / after r3 | none |

## 98. Authority Matrix

| Authority | Runtime | Backup V6 | Restore | Clear |
|---|---:|---:|---:|---:|
| Active, Profiles, PlanDecision | yes | yes | yes | yes |
| ExecutionHistory, HistoricalPlan | yes | yes | yes | yes |
| Goal, MeasurementDefinition | yes | yes | yes | yes |
| ProgressObservation | yes | yes | yes | yes |

## 99. Backup Matrix

| Version | Observation behavior |
|---|---|
| V1–V4 | supported existing chain; canonical empty target where whole restore applies |
| V5 | explicit empty observation target; export rejects non-empty observations |
| V6 | complete exact history |

## 100. Cross-Domain Matrix

| Event | Observation changes |
|---|---:|
| Goal rename/lifecycle | no |
| definition revise/stop/restart | no |
| profile load / schedule regenerate | no |

## 101. Protection Matrix

| State | Writes | Backup |
|---|---:|---:|
| initializing | no | no |
| ready/durable | yes | yes |
| protected | no | no |
| persistence failure | commands retain desired state; retry | no until resolved |
| restore active | no | no |

## 102. Product-Boundary Matrix

| Capability | Task 5.13 |
|---|---|
| durable authority/corrections/retractions/as-of/exact binding | Implemented |
| Backup/restore/full clear | Implemented |
| observation UI / Progress projection/UI | Prohibited |
| Recommendations/adaptation | Prohibited |

## 103. Architectural Invariant Assessment
All 85 required invariants are Confirmed, Implemented, Preserved, Covered by test, Deferred, or Prohibited as specified; none is a stop-condition violation. In particular, evidence is durable but not Progress, immutable binding/time history is reconstructible, older restores empty observations, cross-domain independence is preserved, and every excluded interpretation/product behavior remains absent.
## 104. Stop-Condition Assessment
No stop condition occurred: exact epoch binding, immutable correction history, two-time as-of resolution, deterministic same-time governance, referential validation, participant-eight coherence, Backup V6, and generic restore replacement were all feasible without Progress/UI/schema changes to history authorities.
## 105. Architectural Alignment Assessment
Aligned with the authority/derived-state separation, additive durable compatibility, explicit uncertainty, immutable historical evidence, centralized transactions, and Planner/Summary boundaries.
## 106. Recommended Next Task
**Task 5.14 — Manual Quantity Progress V1 Policy and Pure Projection.**
## 107. Final Completion Determination
Task 5.13 is complete: durable measured-state evidence is historically reproducible and fully integrated, while interpretation remains deliberately absent.
