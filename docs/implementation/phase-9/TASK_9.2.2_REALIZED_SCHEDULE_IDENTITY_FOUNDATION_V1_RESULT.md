# Task 9.2.2 — Realized Schedule Identity Foundation V1 Result

**Status:** Complete  
**Date:** 2026-09-04  
**Phase:** Phase 9 — Constructive Planning and Authorization

## 1. Executive Result
DayFrame can now represent every complete Accepted Allocation V2 claim as an exact future scheduled activity or protection identity without realizing it.

## 2. Architecture-Reopen Context
Task 9.2.1 fixed accepted footprint fidelity; this task fixes the remaining schedule, execution-subject, and publication-provenance identities.

## 3. Starting Baseline
Baseline: 115 test files/1,054 tests; 649,909 initial raw, 165,946 gzip, 53,187 largest lazy, 920,474 total bytes.

## 4. Governing Upstream Contract
AcceptedAllocation V2 complete claims, requiredness, geometry, user-day, resource role, and provenance remain normative.

## 5. Scope Delivered
Delivered typed origin/roles, pure factories, durable references, execution eligibility, HistoricalPlan snapshot V3, readers, validators, and tests.

## 6. Explicit Non-Goals
No realization, schedule installation, execution record creation, Preview generation, publication action, Progress, recurrence, or new authority was added.

## 7. Schedule Origin Model
`acceptedAllocation` is a first-class typed source/origin, separate from template, Work, and manual identities.

## 8. Schedule Role Model
Roles are `productiveGoalWork`, `supportActivity`, and `bufferProtection`; role is not inferred from origin or labels.

## 9. Time-Ownership Semantics
Productive/support own activity time and are execution-eligible; Buffer protects time and is execution-prohibited.

## 10. Scheduled Goal Work Definition
`ScheduledGoalWorkV1` represents one accepted productive claim with exact immutable lineage and geometry.

## 11. Scheduled Support Definition
`ScheduledSupportActivityV1` represents one accepted support claim and retains its productive relationship and component source.

## 12. Realized Buffer Definition
`RealizedBufferProtectionV1` represents one accepted protection claim and retains its explicit productive/support target.

## 13. Schedule Object Strategy
Option C was selected: a common `ScheduleReadFactV1` union over unchanged legacy blocks and sibling realized facts.

## 14. Buffer Representation
Buffer is a distinct protective fact, never a fake activity block.

## 15. Legacy Schedule Compatibility
`DraftScheduledBlock` and existing source semantics remain unchanged and continue to validate/read normally.

## 16. Scheduled Subject Identity
The ID fingerprints realization ID, Accepted Allocation ID/revision, accepted claim ID, role, and policy.

## 17. Accepted Claim Lineage
Every realized fact and durable reference retains the accepted claim ID rather than replacing it.

## 18. Realization Identity Seam
Branded `RealizationId` is required by pure construction but no realization record/store exists yet.

## 19. Goal/Demand Lineage
Facts freeze Goal, Demand/revision, Demand Projection, opportunity, and Candidate Parent identifiers.

## 20. Productive/Support Relationship
Support claims explicitly name their productive claim; scheduled support freezes that relation.

## 21. Buffer Protection Relationship
Buffer claims explicitly name the productive or support claim/component they protect; no adjacency inference is used.

## 22. User-Day Semantics
The accepted canonical user-day is copied exactly into fact and reference identity.

## 23. Cross-User-Day Compatibility
Sibling facts may retain different adjacent user-days while sharing Accepted Allocation and Candidate Parent lineage.

## 24. Geometry Semantics
Factories copy exact accepted half-open bounds/duration and reject invalid or altered geometry.

## 25. Placement Boundary
Facts declare `fixedAcceptedGeometry`; they are not BlockCandidates and enter no placement search.

## 26. Movability Semantics
`autonomousMovability: prohibited`; future explicit corrective authority may define movement separately.

## 27. PlanDecision Compatibility
The durable target union/key supports accepted-allocation references; current replay does not move them without a realization host.

## 28. CompositeDecision Boundary
Accepted support preserves Composition source evidence but never routes through CompositeDecision.

## 29. Friction Identity Compatibility
Stable scheduled/protection IDs and common durable references are sufficient for future Friction targeting; no Friction is derived now.

## 30. SuggestedFix Boundary
SuggestedFix behavior and authority are unchanged.

## 31. Preview Identity Compatibility
Generic readers can discriminate accepted references, while Preview owns no new realized instances.

## 32. Preview Source Classification
Future Preview can distinguish all three schedule roles through explicit discriminators.

## 33. Preview Baseline Preservation
With no realization store or integration, Preview bytes and behavior remain unchanged.

## 34. Execution Subject Model
Planned execution subjects may now reference accepted Goal-work or support scheduled identities.

## 35. Execution Discriminator
`sourceKind: acceptedAllocation` plus schedule role differentiates realized subjects from legacy planned references.

## 36. Execution Stable Identity
Execution references contain stable scheduled subject, realization, allocation, and accepted claim IDs independent of Preview.

## 37. Execution Provenance
The reference resolves through future scheduled reality to Realization, Accepted Allocation, decision, Proposal, Demand, and Goal.

## 38. Buffer Execution Prohibition
Buffer reference conversion returns `prohibited`, and ExecutionRecord validation rejects Buffer planned subjects.

## 39. Productive vs Support Execution
Both are execution-capable but retain distinct roles; no shared Progress meaning is inferred.

## 40. Progress Boundary
Scheduled and execution identity changes create no automatic Demand or Progress evidence.

## 41. Publication Architecture
Historical snapshot V3 freezes the entire realized fact, durable reference, role, plan interval, display snapshot, and Goal evidence.

## 42. Published Plan Immutability
V3 embeds decisive IDs/revisions/source evidence and needs no live Proposal, Goal, or specification lookup.

## 43. Publication Origin Model
`acceptedAllocation` is an explicit HistoricalPlan source family.

## 44. Historical Role Model
V3 preserves productive, support, or Buffer role independently of title/category.

## 45. Historical Buffer Representation
Historical Buffer is publishable protected-time truth and explicitly not reportable as execution.

## 46. Publication Read Compatibility
HistoricalPlan readers validate and sort V1, V2, and V3 snapshots; old bytes are unchanged.

## 47. Publication Record Version
Accepted-allocation publication uses `HistoricalRealizedScheduleSnapshotV3`; V1/V2 meanings remain intact.

## 48. HistoricalPlan Version Decision
The collection/day/batch versions remain 1; the discriminated occurrence snapshot advances to 3.

## 49. Legacy Publication Migration
No legacy snapshot is relabeled or inferred as accepted-allocation origin.

## 50. Persistence Ownership
HistoricalPlan retains its existing ownership; realized scheduled facts remain type-only until Task 9.3.

## 51. Realization Store Boundary
No realization object store, persistence participant, or authority surface was created.

## 52. Execution Persistence Compatibility
ExecutionRecord V1 retains its version and accepts an additive typed planned-reference family; legacy records remain exact.

## 53. Backup Decision
Backup remains V11 because the product cannot yet create/persist realized facts; existing V11 already preserves tagged execution/history values.

## 54. Schema Decision
IndexedDB remains schema 10; no store or index topology changed.

## 55. Downgrade Protection
No new product-reachable durable records exist, so no new downgrade branch is required before Task 9.3.

## 56. Restore Validation
Existing restore invokes extended execution/HistoricalPlan validators; invalid roles, origins, geometry, identity, and Buffer execution fail.

## 57. Typed-Origin Design
Origin is a closed structured object, not string metadata or display text.

## 58. Semantic Ownership
Accepted Allocation owns authorization, future Realization owns transition, scheduled facts own/protect time, Execution owns evidence, and publication owns history.

## 59. Provenance Freeze
Facts freeze all decisive identifiers/revisions and source/component relationship evidence.

## 60. Accepted Allocation Version Compatibility
The factory requires `AcceptedAllocationV2` with complete footprint; legacy V1 cannot enter the safe construction API.

## 61. Schedule-Origin Eligibility
Only a claim found inside complete Accepted Allocation V2 can create an accepted-allocation-origin value.

## 62. Constructors/Factories
Pure non-persisting factories construct and validate single values for future atomic orchestration.

## 63. No Partial Materialization API
No public mutation installs an individual fact; Task 9.3 must orchestrate the full footprint atomically.

## 64. Role-Origin Matrix
Accepted origin permits the three explicit roles only; legacy sources receive no implicit reinterpretation.

## 65. Execution Eligibility Matrix
Productive: yes/no automatic Progress. Support: yes/no automatic Progress. Buffer: no/no Progress.

## 66. Publication Matrix
All three roles are publishable and historical; only productive/support are executable.

## 67. Preview Matrix
Future realized productive/support own and Buffer protects visible time; no instance is currently projected.

## 68. Friction Matrix
All roles have stable identities capable of future conflict references; Buffer participates as protection.

## 69. Direct Authoring Boundary
Goal-linked Commitment and direct authored events retain their existing origins.

## 70. Recurrence Boundary
Every realized identity declares `recurrence: none`.

## 71. Template Boundary
No synthetic BlockTemplate or recurrence identity is created.

## 72. Work Boundary
Realized Goal work is not shift-derived Work.

## 73. Manual Event Boundary
Accepted Goal/support identity is not modeled as a manual event.

## 74. Composition Boundary
Support may freeze Composition lineage without becoming new Composition authority.

## 75. Buffer Boundary
The protection role is compatible with Capacity protected-time semantics and distinct from activity.

## 76. Capacity Compatibility
Roles make future occupied versus protected treatment explicit; Capacity behavior is unchanged now.

## 77. Feasibility Compatibility
Feasibility still consumes pre-scheduling Task 9.2.1 footprints and imports no realized types.

## 78. Proposal Compatibility
Proposal/Accepted Allocation behavior is unchanged except explicit protected-target claim lineage validation.

## 79. Realization Mapping Contract
Productive→ScheduledGoalWork, support→ScheduledSupportActivity, Buffer→RealizedBufferProtection, one-to-one by claim.

## 80. Buffer Union Identity
Overlapping Buffer claims remain separate provenance-bearing protection facts; Capacity may union geometry later.

## 81. Duplicate Realization Prevention Seam
The same realization/allocation/claim/role deterministically yields the same subject ID.

## 82. Schedule Reader Compatibility
`ScheduleReadFactV1` and durable-reference branches avoid template/Work/manual assumptions.

## 83. Exhaustive Switch Audit
PlanDecision presentation/keys, Today readers, HistoricalPlan fingerprints/validation, execution summaries, and history labels gained explicit accepted branches.

## 84. Serialization
All contracts use structured plain values and canonical strings; JSON round-trip is exact.

## 85. Equality
Reference equality compares immutable origin, role, interval, user-day, and subject/claim identity, never labels.

## 86. Validation
Validators reject missing accepted lineage, invalid role/time/execution combinations, bad geometry, nondeterministic IDs, invalid references, and Buffer execution.

## 87. Legacy Readers
Legacy schedule, DurableOccurrenceReference, execution, and HistoricalPlan tests remain green without manufactured provenance.

## 88. Publication Snapshot Sufficiency
V3 remains interpretable after current Goal, Proposal, footprint, or source deletion.

## 89. Execution Lookup Sufficiency
Execution references use durable scheduled subject/claim identity, not ephemeral Preview IDs.

## 90. UI Boundary
No new screen, control, or broad product behavior was introduced.

## 91. Accessibility
No interactive surface changed; existing labels gained a safe accepted-allocation family label only.

## 92. Bundle Architecture Review
Final: 655,722 initial raw, 167,447 gzip, 53,187 largest lazy, 927,513 total. Hard limits pass; existing headroom/total warnings remain governed.

## 93. Persistence/Version Discovery
Execution uses tagged V1 records; HistoricalPlan batches/days hold tagged snapshots; V11 serializes both; no new store/index is necessary.

## 94. Schedule Identity Tests
Tests prove origin/role separation, lineage, exact geometry/user-day, deterministic IDs, serialization, and no placement metadata.

## 95. Execution Tests
Tests prove productive/support eligibility, Buffer rejection, stable references, and legacy compatibility.

## 96. Publication Tests
Tests prove all-role V3 publication, accepted lineage preservation, validation, legacy reading, and Buffer non-reportability.

## 97. Preview/Friction Tests
Full Preview/Friction/SuggestedFix regressions pass; no realized instance or new Friction appears.

## 98. Boundary Tests
Pure construction only: no Accepted Allocation status, schedule, realization, Capacity, recurrence, execution, or Progress mutation occurs.

## 99. Full Regression
116 test files and 1,057 tests pass with zero failures.

## 100. Validation Commands
Passed Prettier check, typecheck, lint, focused/full tests, build, bundle check, and `git diff --check`.

## 101. V1 Design Decision Table
| Question | V1 Decision | Basis | Sufficient Now | Deferred |
| --- | --- | --- | --- | --- |
| accepted origin | typed acceptedAllocation | authority chain | no overload | other origins |
| roles | three-way union | time semantics | exhaustive | extensions |
| Goal work | sibling activity fact | exact claim | executable | realization |
| support | sibling activity fact | component lineage | executable | correction |
| Buffer | protection fact | non-activity | non-executable | aggregation |
| subject ID | semantic fingerprint | idempotence | deterministic | store keys |
| claim lineage | frozen ID/relation | acceptance fidelity | sufficient | none |
| realization seam | branded ID | transition owner | typed | durable record |
| movability | prohibited automatic | fixed geometry | safe | decisions |
| PlanDecision | durable ref seam | corrective boundary | distinguishable | replay |
| Friction | stable fact/reference | conflict identity | addressable | derivation |
| execution | planned accepted ref | stable subject | two roles | workflow UI |
| Buffer execution | structural rejection | non-activity | safe | none |
| publication origin | acceptedAllocation | immutable history | exact | none |
| historical role | explicit V3 | no inference | exact | analytics |
| publication version | snapshot V3 | changed meaning | compatible | none |
| execution version | V1 additive union | tagged subject | compatible | reassess in 9.3 |
| schema | 10 | no topology change | sufficient | 9.3 |
| backup | 11 | no reachable new durable fact | sufficient | 9.3 |

## 102. Boundary Matrix
| Concept | Class | Time | Executable | Durable after 9.2.2 |
| --- | --- | ---: | ---: | ---: |
| Accepted Allocation | accepted authority | claims | no | yes |
| Realization | future evidence | no | no | not yet |
| Goal Work type | scheduled contract | owns | yes | type only |
| Support type | scheduled contract | owns | yes | type only |
| Buffer type | protection contract | protects | no | type only |
| Preview | derived | no independent | no | disposable |
| Execution | evidence | no | evidence | existing |
| Published Plan | history | historical | no | existing |

## 103. Authority Transition Matrix
| Transition | Authority | Implemented? |
| --- | ---: | ---: |
| Proposal→Decision | user | existing |
| Decision→Accepted | user | existing |
| Accepted→Realization | bounded automatic | no |
| Realization→three facts | no new | no |
| activity→Execution | actual evidence | compatibility only |
| schedule→publication | existing workflow | compatibility only |
| scheduled→Progress | none implicit | no |

## 104. Provenance Matrix
Goal work, support, Buffer, and V3 publication retain Realization, Accepted Allocation/claim, decision, Proposal/option, Candidate Parent, interval, user-day, and role. Goal/Demand and component provenance are direct for productive and frozen through lineage for support/protection.

## 105. Invariant Verification
All 50 required invariants pass: roles/origins remain distinct; Buffer is protection/non-executable; IDs/geometry/user-day/lineage are exact; legacy is not reinterpreted; no realization, scheduling, recurrence, execution, Progress, or new store occurs.

## 106. Deviations
No semantic deviation. Historical occurrence snapshot V3 was chosen while batch/day/surface versions remain unchanged.

## 107. Governance Updates
CURRENT_STATE, DECISIONS, and CHANGELOG record the downstream contracts and architecture-reopen closure.

## 108. Repository Status
The working tree contains cumulative uncommitted Phase 9 work plus this task; unrelated changes were preserved.

## 109. Architecture Reopen Assessment
Accepted footprint: resolved by 9.2.1. Scheduled identity, execution identity, and publication origin: resolved by 9.2.2. Task 9.3 architecture reopen: closed.

## 110. Task 9.3 Readiness
Yes. Task 9.3 can atomically map every complete productive/support/Buffer claim to stable schedule/protection identity, expose activity roles to execution, expose all roles to publication/history/readers, and preserve exact lineage without legacy overload.

## 111. Recommended Next Task
Proceed with Task 9.3 — Accepted Allocation Realization V1.

Task 9.2.2 resolves the remaining scheduled-identity, execution-subject, and publication-provenance portions of the Task 9.3 architecture reopen. Complete Accepted Allocation V2 authority now has an exact downstream identity contract for productive Goal work, support activity, and Buffer protection. No realization has occurred. Task 9.3 is unblocked.

## 112. Completion Statement

**Task 9.2.2 — Realized Schedule Identity Foundation V1 complete.**

DayFrame now has explicit downstream identity contracts capable of representing the exact scheduled reality authorized by complete Accepted Allocation V2 records without overloading legacy schedule semantics: `acceptedAllocation` is a first-class schedule origin, productive Goal work, operational support activity, and Buffer protection remain distinct schedule roles, productive and support subjects own time and are execution-capable while Buffer protects time and is structurally non-executable, and every future realized subject preserves deterministic identity, exact accepted `[start,end)` geometry, canonical user-day, accepted claim identity, Realization seam, ProposalDecision/Proposal/Goal/Demand provenance, Candidate Parent lineage, and source-component evidence; realized accepted facts do not become BlockCandidates, templates, recurrences, Work, or manual events, and their exact geometry cannot be silently re-placed; execution identity can target stable Goal-work and support subjects across Preview regeneration, restart, publication, and history while rejecting Buffer and creating no automatic Progress semantics; Preview, Friction, SuggestedFix, PlanDecision, and generic schedule-reader type surfaces can distinguish the new roles without creating any realized instance or changing existing runtime behavior; publication and HistoricalPlan contracts can freeze accepted-allocation origin, schedule role, exact interval, scheduled subject/protection identity, Realization lineage, Accepted Allocation, accepted claim, ProposalDecision, Proposal, Goal/Demand, and component provenance while preserving all legacy schedule, execution, and publication records without historical inference; persistence, serialization, validation, record versioning, Backup V11/restore compatibility, deterministic identity, exhaustive-switch handling, bundle limits, and regression coverage are preserved; no Accepted Allocation has been realized, no scheduled Goal work/support/Buffer has been created from acceptance, no execution has occurred, no Progress has been inferred, and no recurrence or new user authority has been introduced; the final downstream identity portion of the Task 9.3 architecture reopen is resolved, and Task 9.3 may now implement the atomic Accepted Allocation → scheduled reality transition without inventing any new schedule-role, execution-subject, or publication-origin architecture.
