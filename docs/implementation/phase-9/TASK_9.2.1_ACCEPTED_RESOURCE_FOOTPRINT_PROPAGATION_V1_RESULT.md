# Task 9.2.1 — Accepted Resource Footprint Propagation V1 Result

**Status:** Complete  
**Date:** 2026-09-04  
**Phase:** Phase 9 — Constructive Planning and Authorization

## 1. Executive Result
DayFrame now carries explicit productive, support-activity, and Buffer-protection claims from Goal Planning through Feasibility, Competition, Allocation, Proposal, ProposalDecision, and complete Accepted Allocation authority.

## 2. Architecture-Reopen Finding
The former chain retained productive partitions only, so Task 9.3 could not realize accepted support and protection without inventing authority after acceptance.

## 3. Scope Delivered
Delivered footprint authoring, resolution, projection, propagation, acceptance, persistence, migration, validation, and downgrade protection; no realization was added.

## 4. Governing Evidence
Implementation follows Task 9.2.0 §102 and the Task 8.4, 8.5, 9.1, and 9.2 results.

## 5. Starting Baseline
Task 9.2 recorded 114 files/1,051 tests; bundle 647,952 raw, 165,487 gzip, 53,187 largest lazy, 895,026 total bytes.

## 6. Resource-Footprint Definition
`ProjectedResourceFootprintV1` groups one Candidate Parent's normalized claims, omitted optionals, role totals, union cost, dependencies, and provenance.

## 7. Productive Role
`productive` is Goal-serving activity, consumes Capacity, and alone satisfies Demand.

## 8. Support Role
`supportActivity` is user-performed operational activity; it consumes Capacity but supplies no Demand credit.

## 9. Buffer Role
`bufferProtection` protects Capacity, is non-activity, and never supplies Demand or execution credit.

## 10. Architecture Discovery Classification
Classification: new explicit association required. Goal links and scheduled Composition cannot authorize pre-scheduling Demand footprint.

## 11. Composition Source Contract
Support may retain a frozen Composition relationship/revision, endpoint incarnations, slot, and semantics fingerprint. Downstream layers never rerun Composition.

## 12. Buffer Source Contract
Buffer is explicitly authored, targets productive work or named support, and is never inferred as generic padding.

## 13. Resource Claim Model
Claims retain role, exact bounds/duration, canonical user-day, Capacity interval, requiredness, Candidate Parent, Goal/Demand/Projection, source, lineage, and provenance.

## 14. Resource Claim Identity
Stable IDs fingerprint policy, authority revisions, parent, role, geometry, Capacity owner, requiredness, and source.

## 15. Resource Footprint Model
Productive, support, and Buffer arrays stay distinct inside one atomic Candidate Parent package.

## 16. Resource Cost Summaries
Role totals are nominal sums; unioned resource minutes count compatible overlapping Buffer protection once.

## 17. Requiredness
Required components always project. Optional components project only when selected; omitted IDs remain explicit.

## 18. Productive Demand Attribution
Demand assignment and satisfaction continue to use productive duration only.

## 19. Capacity Cost Attribution
All roles consume or protect demand-neutral Capacity and retain its interval ID.

## 20. Allocation Input Changes
Feasible opportunities now reach Allocation with complete already-projected footprints.

## 21. Allocation Alternative Changes
Alternatives retain footprints, all claims, role totals, nominal cost, and unioned cost.

## 22. Competition Impact
Edges consider every claim, exposing support/protection contention previously hidden.

## 23. Allocation Conservation
Allocation selects complete packages and subtracts the complete exclusive footprint from remaining Capacity.

## 24. Buffer Overlap Semantics
Buffer/Buffer overlap is compatible and unioned; Buffer/activity overlap conflicts.

## 25. Support Legality
Support must fit allocatable Capacity and cannot overlap activity or protection inside its candidate.

## 26. Feasibility Reopen Assessment
Feasibility required a bounded reopen because productive geometry alone could not prove the whole package legal.

## 27. Feasibility Changes if Any
It consumes resolved association plus canonical resolver and fails closed for unresolved or unavailable required footprint.

## 28. Opportunity Model Changes
Each `FeasibleOpportunityV1` owns one complete `resourceFootprint` without reserving Capacity.

## 29. Opportunity Set Changes
Sets group complete legal opportunities; productive satisfaction semantics are unchanged.

## 30. Allocation Ranking Impact
Ranking remains deterministic; semantic identity now includes complete claims and costs.

## 31. Allocation Identity/Freshness
Spec/association revisions and selections flow into Feasibility and every downstream identity.

## 32. Allocation Explanation
Alternatives expose full role totals, union cost, assignments, claims, and remaining Capacity.

## 33. Proposal Option Changes
Options snapshot exact Allocation footprints, claims, role totals, nominal cost, and union total.

## 34. Removal of Zero-Support Assumption
Support/Buffer are no longer hard-coded zero; the old assumption appears only when both truly are absent.

## 35. Proposal Explanation
Rank/unmet-demand evidence remains while exact resource cost is inspectable in the option.

## 36. Proposal Qualification
Only complete legal alternatives become options; unresolved footprint abstains upstream.

## 37. ProposalDecision Snapshot
Decision retains accepted scope and decisive fingerprint; Accepted Allocation freezes the full option.

## 38. Accepted Allocation Changes
New acceptance creates `AcceptedAllocationV2` with `footprintCompleteness: complete`, exact footprints/claims/assignments, and totals.

## 39. Accepted Authority Meaning
A complete record means the user authorized precisely its productive/support/Buffer package.

## 40. Accepted Allocation Identity
The immutable record retains decision, proposal revision, option/candidate, Capacity fingerprint, and claim identities.

## 41. Legacy Accepted Allocation Handling
V1 records remain readable and V10→V11 translation labels them `legacyProductiveOnly`.

## 42. Legacy Upgrade/Revalidation
Legacy acceptance is never upgraded in place; completeness requires a newly accepted current Proposal.

## 43. No Silent Authority Expansion
Migration adds no claims and consults no current Composition or footprint definition.

## 44. New Acceptance Path
All newly accepted options persist version-2 complete authority.

## 45. Accepted Claim Conflict Handling
Acceptance checks every role claim against accepted authority, except compatible Buffer/Buffer overlap.

## 46. Atomic Bundle Semantics
Required claims remain in the productive package and cannot be removed independently.

## 47. Partial Acceptance
Atomic multi-assignment options are not partly accepted; upstream authored partial Demand satisfaction remains supported.

## 48. Modification Candidate Handling
Modifications select only in-scope claims, retain required claims, and rebuild retained footprint summaries without resurrecting omissions.

## 49. Proposal Revalidation
Acceptance requires a current Proposal; footprint dependency or option changes make it stale.

## 50. Freshness
Spec, association, selection, Capacity, and candidate geometry participate in fingerprints.

## 51. Provenance
Specs/associations are authored; projections are derived; decisions/accepted records are accepted authority.

## 52. Component Lineage
Component, spec, association, Composition relationship, Candidate Parent, Demand, Goal, and Projection survive acceptance.

## 53. Multi-Component Support
Variants support multiple uniquely identified support and Buffer components.

## 54. Shared Component Disposition
Components are per-session/single-owner; compatible Buffer geometry preserves separate lineage while unioning cost.

## 55. Cross-User-Day Footprint
Claims independently resolve user-day and may reach one adjacent day; one claim crossing a boundary is rejected.

## 56. Interval Semantics
All geometry is positive integer-minute, exact half-open `[start,end)`.

## 57. Persistence Model
Specs/associations use `goalPlanning`; complete acceptance uses `proposalAuthority`; no realization store was added.

## 58. Schema Decision
IndexedDB remains schema 10 per Task 9.2.0 §102: tagged records changed, object stores/indexes did not.

## 59. Record Versioning
Goal Planning is authority V2; complete Accepted Allocation is record V2; legacy accepted V1 stays distinguishable.

## 60. Backup Decision
Backup advances to V11 to preserve new authored and accepted footprint semantics exactly.

## 61. Backup Migration
V10→V11 preserves existing authority, adds empty footprint collections, and labels legacy acceptance without adding claims.

## 62. Downgrade Protection
V10 export refuses when specs/associations or complete AcceptedAllocation V2 would be lost.

## 63. Restore Validation
V11 validates references, roles, bounds, requiredness, IDs, footprint/scope/option equality, totals, and conflicts before restore.

## 64. Referential Integrity
Associations reference a Demand and exact spec revision/variant; accepted records reference valid decisions/options.

## 65. Proposal History Compatibility
Historical Proposal revisions remain readable and are not rewritten as complete.

## 66. Allocation Disposal Compatibility
Allocation remains disposable; Accepted Allocation independently freezes required resource bytes.

## 67. Schedule Boundary
No block, recurrence, occurrence, Preview, or PlanDecision is created or changed.

## 68. Execution Boundary
No execution subject/reporting behavior was introduced; Buffer stays non-executable.

## 69. Publication Boundary
HistoricalPlan materialization and publication provenance are unchanged.

## 70. Capacity Preservation
Capacity remains demand-neutral, derived, non-reserving, and non-persisted.

## 71. Feasibility Preservation
Feasibility remains a pure single-Demand query; its opportunity package is now complete.

## 72. Competition Preservation
Competition remains derived connected-component analysis and owns no decision.

## 73. Tests Added
Tests cover validation, deterministic projection, omitted optionals, missing support, propagation, persistence, migration, restore, and downgrade refusal.

## 74. Conservation Tests
Assertions verify role totals, nominal totals, and unioned resource minutes.

## 75. Proposal Tests
Tests prove nonzero support/Buffer propagation and absence of the false zero-cost assumption.

## 76. Accepted Allocation Tests
Integration proves exact V2 acceptance without schedule or Progress mutation.

## 77. Legacy Authority Tests
V1 acceptance translates to explicit legacy completeness with no inferred claims.

## 78. Acceptance Conflict Tests
Role-bearing claim conflicts retain only Buffer/Buffer compatibility.

## 79. Partial Acceptance Tests
Modification retains required claims and rejects out-of-scope geometry.

## 80. Revalidation Tests
Current/stale Proposal tests cover dependency mismatch before acceptance.

## 81. Determinism Tests
Equivalent projection and reordered Allocation inputs produce equal output.

## 82. Double-Counting Tests
Interval union merges overlaps while preserving nominal claims and lineage.

## 83. Demand Satisfaction Tests
Only productive minutes affect assigned/satisfied Demand totals.

## 84. Full Regression Result
115 test files and 1,054 tests pass with zero failures.

## 85. Validation Commands
Passed `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run check:bundle`, and `git diff --check`.

## 86. Bundle Architecture Review
New planning code remains lazy. Final: 649,909 initial raw, 165,946 initial gzip, 53,187 largest lazy, 920,474 total; hard limits pass with governed gzip/total warnings.

## 87. Performance Notes
Projection is bounded by existing opportunity caps and small authored component lists; no background scan exists.

## 88. Accessibility Notes
No new UI was introduced; the existing accessible Backup action now exports V11.

## 89. Compatibility Notes
GoalPlanning V1 migrates to V2 empty footprint; V7–V10 import remains; V11 is canonical export.

## 90. DF-006 Relationship
Cycle, workday, weekend, Preview, and publication semantics are unchanged; DF-006 stays closed.

## 91. V1 Design Decision Table
| Question | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| --- | --- | --- | --- | --- |
| footprint source | explicit spec + association | authored authority | no inference | defaults |
| productive claim | one per candidate | Demand/Feasibility | exact satisfaction | realization |
| support claim | real activity | Composition-compatible source | exact cost | flexible placement |
| Buffer claim | non-activity protection | Buffer authority | exact protection | realization |
| claim identity | semantic fingerprint | provenance | deterministic | external IDs |
| requiredness | required/selected optional | authored choice | fail-closed | proposal choice |
| composition seam | frozen snapshot | no fake parent | exact lineage | adapters |
| Feasibility | complete package | legality | catches hidden cost | search windows |
| competition | all claims | contention | catches hidden conflict | sharing |
| Allocation | carry, never project | boundary | conserves truth | optimization |
| cost union | half-open union | no double count | correct totals | dimensions |

## 92. Boundary Matrix
| Boundary | Owns | Does not own |
| --- | --- | --- |
| Goal Planning | specs/associations | timed claims |
| Feasibility | legal complete candidates | competition |
| Competition | contention | decisions |
| Allocation | alternatives | footprint invention |
| Proposal | advisory snapshot | schedule mutation |
| Accepted Allocation | frozen authorization | realization |

## 93. Resource Propagation Matrix
| Layer | Productive | Support | Buffer | Lineage |
| --- | --- | --- | --- | --- |
| Feasibility | exact | exact | exact | complete |
| Allocation | exact | exact | exact | complete |
| Proposal | snapshot | snapshot | snapshot | complete |
| Decision scope | claimed | claimed | claimed | decisive |
| Accepted V2 | frozen | frozen | frozen | complete |

## 94. Invariant Verification
Only productive satisfies Demand; all claims fit Capacity; required survives; omissions stay omitted; acceptance matches scope/footprint/option; no realization occurs.

## 95. Implementation Decisions
V1 uses reusable specs, Demand association, closed relative geometry, per-session components, adjacent-day bound, Buffer-only compatibility, GoalPlanning V2, AcceptedAllocation V2, schema 10, Backup V11.

## 96. Deviations
No semantic deviation. Schema 10 is retained exactly as Task 9.2.0 §102 directs.

## 97. Architecture Reopen Assessment
The accepted-footprint portion is resolved; realization can later consume exact authority without recreating support/Buffer.

## 98. Governance Updates
CURRENT_STATE, DECISIONS, and CHANGELOG record the footprint contract, versioning, and remaining blocker.

## 99. Repository Status
The working tree includes cumulative uncommitted Phase 9 work plus this task; unrelated changes were preserved.

## 100. Completion Assessment
Implementation, compatibility, persistence, regression, and bundle gates pass.

## 101. Remaining Task 9.2.2 Blocker
Task 9.3 remains blocked on scheduled role, execution-subject, and publication-origin identity.

## 102. Recommended Next Task
Implement and validate Task 9.2.2, then resume Task 9.3.

Task 9.2.1 resolves the accepted-resource-footprint portion of the Task 9.3 architecture reopen. Task 9.3 remains intentionally blocked pending Task 9.2.2, which must establish realization-capable scheduled, execution, and publication identity contracts.

## 103. Completion Statement

**Task 9.2.1 — Accepted Resource Footprint Propagation V1 complete.**

DayFrame now carries the complete resource cost of Goal planning through the accepted-authority chain rather than preserving productive Capacity claims alone: productive Goal-work claims, real support-activity claims, and Buffer-protection claims remain distinct, deterministic, half-open, canonically user-day-owned resource facts with exact requiredness, component/source lineage, Capacity provenance, and stable semantic identity; existing Composition authority remains the source of support and protection semantics and is not re-derived inside Allocation or Proposal, while Goal-Specific Feasibility and Competing Demand are extended only where necessary so an opportunity cannot be considered fully legal or non-competing when its required support/protection footprint is infeasible or contends for the same resource; Allocation alternatives now conserve and explain the complete resource footprint, Proposal Options snapshot that exact footprint rather than hard-coding support and Buffer to zero, Proposal revalidation treats footprint changes as material, and all new acceptance paths conflict-check and freeze the exact productive/support/Buffer footprint the user actually authorized; only productive minutes contribute to Demand satisfaction, support remains Capacity-consuming operational overhead, Buffer remains non-activity protection, required components cannot disappear, omitted optional components cannot reappear, and overlapping resource claims are unioned or rejected according to existing Capacity/Composition semantics without double counting; legacy productive-only Accepted Allocations remain immutable and explicitly distinguishable and receive no inferred support or Buffer authority, preventing the repair from silently widening historical authorization; persistence, record versioning, Backup V11, migration, downgrade protection, restore, referential integrity, determinism, and regression behavior preserve exact authority semantics; no Scheduled Goal Work, Scheduled Support Activity, realized Buffer, execution subject, publication origin, recurrence, Progress, or schedule mutation is introduced; the accepted-resource-footprint portion of the Task 9.3 architecture reopen is resolved; Task 9.3 remains blocked only by Task 9.2.2's realization-capable scheduled/execution/publication identity foundation.
