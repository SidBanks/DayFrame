# Acceptance-to-Realization Lifecycle and Replacement Isolation V1 — RESULT

**Status: ACCEPTED for bounded implementation by Task 9.29.4. Implementation completion requires the separately reviewed Task 9.29.4 RESULT.**

## Authority and exact contract

The user's Task 9.29.4 architectural acceptance accepts the complete [Realization Lifecycle and Replacement Isolation Contract V1](../architecture/REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_CONTRACT_V1_PROPOSED_RESULT.md) at SHA-256 `611eb5c0b800c8e3d9d7a0254d4b807e0fe456e59ac1a5309cd07a53baa498c7`. The historical proposal remains immutable, including its PROPOSED marker.

This decision references [Task 9.29.3 RESULT](../implementation/phase-9/TASK_9.29.3_REALIZATION_LIFECYCLE_REPLACEMENT_ISOLATION_CONTRACT_RESOLUTION_V1_RESULT.md), the [original blocked 9.29 RESULT](../implementation/phase-9/TASK_9.29_PLANNER_REVIEW_SCHEDULE_WORKFLOW_CONVERGENCE_V1_RESULT.md) and [blocked authorized continuation RESULT](../implementation/phase-9/TASK_9.29_PLANNER_REVIEW_SCHEDULE_WORKFLOW_CONVERGENCE_V1_CONTINUATION_RESULT.md). Neither blocked execution is overwritten or promoted to complete.

## Accepted ordering

Accept one nonqueued Proposal common-write lease and one nonqueued realization execution lease. Overlapping commands reject busy; no joining, waiting queue or automatic replay. Explicitly authorize the adjacent Proposal common-writer safeguard demonstrated by the earlier acceptance-persistence diagnostics, including all shared writer aliases and exact desired-image retry. Preserve current Proposal decision/conflict and actual-time Structure policies.

Acceptance and realization remain separate durable transactions. Automatic handoff inherits the original acceptance lifetime before lazy loading/revalidation; release the Proposal lease before entering realization. Restored identical records cannot renew old intent. Fresh explicit retry has a new current origin.

Physical source admission is the new-write validity point. Preserve canonical current saved Work/manual/fixed/Sleep/Composition/realized occupancy, exact accepted geometry and complete-footprint atomicity. Post-admission authoring can require review without canceling committed facts. Leases survive native physical terminal, full-image/full-set verification, installation, protection classification and notifications. Lost acknowledgment is not cancellation; settled uncertainty remains protected, unresolved physical work remains nonquiescent.

Extend before-snapshot quiescence across Structure, HistoricalPlan, Proposal and realization. Keep existing private matching-epoch coordinator authority, journal/recovery permissions, full-clear aggregation and rollback. Generation-scope initialization/install/read/protection and preserve recognized non-enumerable result receipts through consumers. No UI-only isolation.

## Preservation and guarantee boundary

No migration, serialization/schema/version/dependency change, orphan repair, validator relaxation or expanded recovery authority is accepted. Preserve complete V2 versus legacy acceptance, Realization V1 role identities, schema 11, V14 and all supported readers, exact history, profile independence, independent Actual/Progress and Capacity semantics.

The guarantee covers one registered participating store/owner composition in one live realm. It excludes cross-tab, arbitrary raw writers, multiple active stores and global locking. The accepted publication FIFO/clock/certainty contract and Structure temporal policy remain unchanged.

## Completion and resumption

Implementation requires all 22 phase-selected contract cases plus adjacent Proposal and multi-role evidence, mandatory affected native/mobile workflows, unchanged hard bundle gates, and Task 9.29.4's reviewed RESULT. This ADR is acceptance, not evidence of a completed repair. Task 9.29 requires a separately authorized continuation with distinct input/RESULT paths and reconciliation of the bounded Review ledger.
