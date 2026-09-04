# Task 8.4 — Commitment Composition V1 Domain, Pairing, Footprint, and Persistence Result

**Status:** Complete  
**Date:** 2026-09-04  
**Phase:** Phase 8 — Goal and Capacity Foundations

## 1. Executive Result

Commitment Composition V1 is implemented. Revisioned Attachment Relationships connect ordinary Commitment sources; deterministic projection creates paired support occurrences, protected Buffer footprint, liabilities, and corrective Friction without creating Capacity or a duplicate composite authority.

## 2. Scope Delivered

The delivery covers authority, projection, scheduling, history, execution identity, IndexedDB schema 9, Backup V9, restore, full clear, migration, tests, governance, and bundle containment. No composition UI was added.

## 3. Governing Evidence Used

Implementation followed the repository Composition specification and audit, post-Phase-7 synthesis/strategy/roadmap, Tasks 8.1–8.3 results, current source/incarnation, scheduling, historical, execution, restore, and bundle contracts.

## 4. Task 8.1 Foundation Reuse

Relationships and decisions use opaque fact IDs, monotonic revisions, typed provenance, dependency references, canonical fingerprints, and exact historical lookup.

## 5. Task 8.2 Goal Structure Boundary

Goal Structure is unchanged and remains separate. Its surface is now lazily composed to retain production bundle headroom.

## 6. Task 8.3 Goal Demand Boundary

Demand and Priority authority and Demand Projection are unchanged. Composition supplies future resource-cost evidence but performs no feasibility calculation.

## 7. Existing Commitment Model Assessment

`BlockTemplate` plus source incarnation provides sufficient durable endpoint identity. No `AttachedActivity` subtype or duplicate Commitment source was necessary.

## 8. Existing Work/Buffer/Relative Placement Assessment

Existing source Buffers, Work-relative preferences, and placement geometry remain valid. Explicit Attachment authority is never inferred from Work order or placement preference.

## 9. Files Added

Added the composition domain/tests, composition state surface/tests, lazy composition surface, Backup V9/integration coverage, lazy Goal Structure boundary, and this result artifact.

## 10. Files Modified

Modified block/history types, historical validation/materialization/fingerprint, store APIs and scheduling, persistence/restore registries, full clear, backup UI integration, Friction typing, tests, `CURRENT_STATE.md`, and `CHANGELOG.md`.

## 11. Commitment Source Reuse

Parents and children are ordinary template sources. A child retains title, category, duration, source/incarnation identity, recurrence identity, and execution eligibility.

## 12. Attachment Relationship Model

`AttachmentRelationshipV1` records parent/child endpoints, slot/order, applicability, requiredness, timing, strictness, Buffer, bounded Goal support, lifecycle, timestamps, and provenance.

## 13. Relationship Identity / Revision

A stable logical fact ID owns contiguous immutable revisions. Semantic no-op edits do not manufacture revisions; exact old revisions remain queryable.

## 14. Endpoint / Incarnation Safety

Endpoints contain source ID and incarnation ID. Active self-links and dangling endpoints are rejected, so delete/recreate never silently retargets a relation.

## 15. Relationship Lifecycle

Create, revise, and retire operations are explicit. Retirement appends a revision and stops prospective derivation without destroying history.

## 16. Applicability V1

V1 supports half-open user-day intervals, weekdays, explicit included parent occurrence IDs, and explicit exclusions. Evaluation is deterministic.

## 17. Required / Optional Semantics

Required failure creates a failed composite and liability. Optional failure produces an explicit omission while preserving the feasible parent.

## 18. Timing Rules V1

V1 supports end-at-parent-start, start-at-parent-end, before/after with exact or minimum gap, and signed offsets from parent start/end anchored by component start/end.

## 19. Timing Strictness

Constraint versus preference is represented independently of requiredness. V1 places at the deterministic target; richer flexible preference search is deferred.

## 20. Gap / Buffer Semantics

Gap positions activity relative to the parent. Buffer protects non-activity time around the child. They remain distinct in authority and footprint.

## 21. Recurrence Boundary

An actively attached child’s independent recurrence is suppressed. Parent occurrence applicability drives attached derivation; recurrence is retained only for ordinary durable occurrence identity.

## 22. Attached Activity Model

The attached occurrence is a real `DraftScheduledBlock`, owns its activity interval, remains reportable, and carries pairing provenance.

## 23. Parent Lifecycle

Only active, scheduled parent occurrences derive components. Retiring or removing the parent source makes relationship validation fail closed.

## 24. Parent Omission / Cancellation

An omitted parent is absent from scheduled parent input, so no attached occurrence or orphan required component is derived.

## 25. Parent Movement

Geometry is recalculated from the current parent interval; pairing identity remains tied to the parent occurrence and relationship revision.

## 26. Parent Duration Change

End-relative geometry follows the changed end; start-relative geometry remains anchored to start. The composite fingerprint changes with parent geometry.

## 27. Occurrence Pairing

Each applicable relationship is paired to the exact parent occurrence. Ordered projection is by relationship order, slot, and ID.

## 28. Pairing Identity / Determinism

Pairing IDs hash policy version, parent occurrence ID, relationship ID/revision, child endpoint, and slot. Equivalent inputs produce equivalent IDs.

## 29. Composite Commitment

The composite is a derived view only. It is not persisted as a second source and owns no additional time.

## 30. Composite Occurrence

The projection contains state, attached occurrences, omissions, classified footprint, liabilities, dependencies, and derived provenance.

## 31. Composite Identity / Fingerprint

Composite identity derives from policy plus parent occurrence. Fingerprint covers parent geometry, current relations, source revision/duration/Buffer/recurrence semantics, and policy.

## 32. Composite Footprint

Footprint intervals are classified as `parentCore`, `supportActivity`, `buffer`, or `requiredLiability`; no enclosing envelope is counted.

## 33. Time-Ownership / Deduplication

Parent and attached activities own their intervals. Buffers protect but do not execute. Source-local and relationship Buffers combine by maximum per side, preventing double counting.

## 34. Composition State

States are `fullyFeasible`, `feasibleWithoutOptional`, `requiredComponentFailure`, and `stale`.

## 35. Composition Failure

Missing child, protected-footprint collision, and planning-window overflow fail required composition explicitly.

## 36. Composite Liability

Liability retains composite ID, relationship ID/revision, reason, required minutes, and expected interval for future resource accounting.

## 37. Friction Integration

Required liabilities emit critical, non-ignorable `compositionFailure` Friction associated with the parent occurrence.

## 38. Suggested Fix Disposition

No automatic fix is invented. Composition changes require authored relationship revision or accepted CompositeDecision authority.

## 39. CompositeDecision

`CompositeDecisionV1` is accepted revisioned authority for coordinated optional omission or occurrence-relative offset against an expected fingerprint.

## 40. Decision Replay / Atomicity

A fingerprint mismatch yields `stale` with zero attached occurrences; no subset of deltas is applied. Current matching deltas replay deterministically.

## 41. Goal Service Boundary

`goalSupport` is limited to none or support-for-parent-goal. It does not create Goal links or mutate Goal Structure.

## 42. Goal Demand Overhead Contract

Required activity, Buffer, and liability footprint are available to future feasibility. They neither create nor satisfy Goal Demand today.

## 43. Progress Boundary

Attached execution may provide its own ordinary evidence. Buffer and relationship existence never imply progress or credit.

## 44. Capacity Boundary

Capacity is not implemented. Footprint and liability are resource-description inputs only.

## 45. Goal-Specific Feasibility Boundary

No Goal feasibility verdict, scalar, or fit computation was introduced.

## 46. Allocation / Proposal Boundary

No Allocation, Proposal, Accepted Allocation, recommendation, or scheduled Goal work was introduced.

## 47. Historical Provenance

Historical V2 occurrence snapshots optionally freeze a compact tuple containing composite ID, parent occurrence ID, pairing ID, relationship ID, and exact relationship revision.

## 48. Execution Integration

Each attached block remains one ordinary durable template occurrence and therefore one execution subject. Composite and Buffer records create no duplicate execution.

## 49. Persistence Model

Relationship and decision revision histories share the `compositionAuthority` IndexedDB store with compound logical-ID/revision keys.

## 50. Migration

Database version 9 adds the store additively. Pre-V9 state and older backups receive explicit empty Composition authority; no relation is inferred.

## 51. Backup Integration

Backup V9 preserves exact Composition authority and validates active endpoints against backed-up template incarnations. V8 export refuses lossy non-empty Composition.

## 52. Profile Compatibility

Profiles remain authored setup snapshots and do not silently acquire or overwrite Composition authority.

## 53. Store / Query Surface

Store APIs expose create/revise/retire, accepted decisions, current relations, exact revision lookup, projection, export/replace/clear, status, retry, subscription, and runtime adapter.

## 54. Mutation Atomicity

Candidate authority is validated before one clear-plus-put IndexedDB mutation. Invalid endpoints and graphs leave runtime and durable authority unchanged.

## 55. Full-Clear / Restore Integration

Composition is the eleventh coordinated authority participant. Restore stages, validates, writes, verifies, and installs it with protected recovery semantics.

## 56. Legacy Buffer Compatibility

Existing template Buffers retain their meaning. Effective per-side protection is the maximum of source-local and relationship-scoped policy.

## 57. Work-Relative Compatibility

Existing before/after-Work heuristics are unchanged and cannot establish attachment identity or pairing.

## 58. Scheduling Integration

Current scheduling filters independent child recurrences, runs the existing engine, projects explicit parent composition, appends real support blocks, and emits corrective Friction.

## 59. Scheduling Baseline Equivalence

With empty or not-yet-loaded Composition authority, recurrence filtering is an identity operation and post-processing adds nothing; the prior scheduling result is preserved.

## 60. Tests Added

Focused domain and surface tests cover validation, deterministic pairing, applicability, required/optional behavior, Buffer collision/deduplication, stale decisions, revisions, persistence, invalid authority, and freshness invalidation.

## 61. Persistence / Backup Tests

Backup V9 integration proves exact relationship history restore, V8 lossy-export refusal, and V8-to-V9 empty migration. Restore/full-clear suites cover the added participant/store.

## 62. Composition Regression Tests

Historical materialization/validation, schedule baseline behavior, Friction typing, store readiness, and all earlier backup versions run in the full suite.

## 63. Full Regression Results

`107` test files passed; `1,013` tests passed; `0` failed.

## 64. Validation Commands / Results

Focused Vitest: pass. Full `npm test`: pass. Prettier: pass. `npm run typecheck`: pass. `npm run lint`: pass. `npm run build`: pass. `npm run check:bundle`: pass.

## 65. Bundle Result

Initial JavaScript is 671,004 raw / 169,758 gzip bytes; largest lazy chunk is 53,187 bytes; total is 841,301 bytes. All hard limits pass. Initial headroom and total architecture-review warnings remain.

## 66. Performance Notes

Composition domain/surface and Goal Structure/Goal Planning surfaces are lazy. Projection is linear in applicable relationships plus occupied intervals, appropriate for current local personal-scale use. The 825,000-byte total review threshold was exceeded; the mitigation is strict lazy boundaries and a requirement to re-review before further production growth.

## 67. Accessibility Notes

No UI was added or altered for composition; existing accessible product surfaces remain the interaction boundary.

## 68. Compatibility Notes

Backups V1–V8 remain importable with empty Composition. Backup V9 is canonical. Existing schedules remain unchanged absent explicit authority.

## 69. DF-006 Relationship

This task does not reinterpret Work-cycle or weekend semantics. Explicit source incarnation and parent occurrence pairing avoid recurrence or first/last-Work heuristics implicated by DF-006 investigations.

## 70. V1 Design Decision Table

| Question                      | V1 Decision                     | Architectural Basis          | Why Sufficient Now       | Deferred Capability              |
| ----------------------------- | ------------------------------- | ---------------------------- | ------------------------ | -------------------------------- |
| persistence host              | IndexedDB revision collection   | long-lived authority         | atomic exact history     | remote sync                      |
| relationship lifecycle        | create/revise/retire            | immutable authority          | preserves history        | scheduled future edits           |
| endpoint representation       | template ID + incarnation       | source safety                | prevents retargeting     | Work/manual endpoints            |
| component slot/order          | explicit slot and integer order | deterministic pairing        | stable projection        | arbitrary workflow graph         |
| applicability forms           | date, weekday, include/exclude  | bounded V1                   | covers contextual use    | predicates                       |
| required/optional             | explicit per relation           | composition invariant        | distinguishes failure    | conditional rules                |
| timing rules                  | adjacency, gap, offset anchors  | accepted spec                | deterministic geometry   | rich windows                     |
| timing strictness             | represented separately          | semantic separation          | preserves intent         | flexible preference search       |
| gap semantics                 | exact/minimum placement target  | activity geometry            | distinct from Buffer     | preferred ranges                 |
| relationship Buffer           | per-side minutes                | protected time               | future cost visible      | richer setup/cleanup policy      |
| recurrence suppression        | active child suppressed         | parent-derived applicability | prevents duplication     | shared partial recurrence        |
| occurrence pairing ID         | canonical semantic hash         | deterministic identity       | split parents distinct   | persisted pairing authority      |
| composite ID/fingerprint      | derived hashes                  | no duplicate source          | freshness-safe decisions | cross-policy versions            |
| footprint representation      | classified intervals            | conservation                 | no envelope duplication  | capacity aggregation             |
| composition-local feasibility | four states                     | bounded correctness          | protects required work   | general feasibility              |
| Composite Liability           | typed derived obligation        | future accounting            | fail closed              | Capacity consumption model       |
| CompositeDecision scope       | optional omit/offset            | atomic accepted change       | no partial replay        | broader rescheduling transaction |
| Goal-support propagation      | represented policy only         | bounded Goal bridge          | no inferred credit       | Goal feasibility consumer        |
| legacy Buffer interaction     | max per side                    | no double count              | preserves protection     | additive named phases            |
| Work-relative compatibility   | unchanged heuristic             | authority separation         | no false pairing         | explicit Work endpoints          |

## 71. Boundary Matrix

| Concept                      | Status after 8.4 | Authored / Derived    | Owns / Protects Time?          | May Affect Current Scheduling? |
| ---------------------------- | ---------------- | --------------------- | ------------------------------ | ------------------------------ |
| Commitment source            | Existing         | Authored              | Owns through occurrences       | Yes                            |
| Attachment Relationship      | New              | Authored              | No independently               | Yes, explicit only             |
| Parent occurrence            | Extended         | Derived scheduled     | Owns activity                  | Yes                            |
| Attached activity occurrence | New role         | Derived scheduled     | Owns activity                  | Yes                            |
| Buffer                       | Extended         | Policy → protection   | Protects non-activity          | Yes                            |
| Occurrence pairing           | New              | Derived               | No                             | Through derivation             |
| Composite Commitment         | New              | Derived view          | No                             | No extra ownership             |
| Composite Occurrence         | New              | Derived view          | No extra ownership             | Describes components           |
| Composite Footprint          | New              | Derived               | Describes ownership/protection | Resource description           |
| Composite Liability          | New              | Derived obligation    | Protects future accounting     | Corrective Friction only       |
| CompositeDecision            | New              | Accepted authority    | Coordinates components         | Yes                            |
| Goal Demand / projection     | Existing         | Authored / derived    | No                             | No                             |
| Capacity / Goal feasibility  | Future           | Derived               | No                             | Not implemented                |
| Allocation / Proposal        | Future           | Derived / proposed    | No                             | Not implemented                |
| Progress                     | Existing         | Observation / derived | No                             | No automatic credit            |

## 72. Invariant Verification

Verified: real attachments own time; Buffers protect non-activity; gaps are not Buffers; preferences do not create authority; required children never fall back independently; failures yield liability/Friction; movement rederives; omission creates no orphan; pairing is deterministic and incarnation-safe; applicability follows parents; history is immutable; footprint has no envelope double count; optional failure preserves the parent; decisions are atomic and stale-safe; Goal support grants no Demand/Progress credit; each activity executes once; Buffers never execute; canonical user-day labels are retained; Goal Structure is separate; equivalent authority yields equivalent output; composite views add no ownership.

## 73. Implementation Decisions

V1 endpoints are template-only; occupied geometry includes effective Buffers; accepted siblings join occupancy immediately; minimum gaps choose the minimum deterministic placement; historical provenance uses a compact validated tuple to limit eager bundle cost.

## 74. Deviations

The result filename uses the task’s preferred Section 88 filename. Flexible search for timing preferences, special occurrence overrides, and non-template endpoints remain represented/deferred rather than approximated as new authority.

## 75. Architecture Reopen Check

No accepted contradiction was found. Ordinary source identity, recurrence identity, historical publication, and execution targeting support the bounded V1 without Capacity or duplicate execution.

## 76. Governance Updates

`CURRENT_STATE.md` records the new authority/resource boundary and `CHANGELOG.md` records implementation completion and validation.

## 77. Repository Status

Changes remain uncommitted as requested. Pre-existing Task 8.1–8.3 work and the unrelated corrected Goal Demand specification filename were preserved.

## 78. Completion Assessment

All Task 8.4 completion conditions are satisfied: domain, scheduling, persistence, migration, backup, history, execution identity, tests, governance, and hard quality gates are complete.

## 79. Recommended Next Task

Proceed to a bounded Capacity plus Goal-Specific Feasibility foundation consuming authorized schedule activity, protected Buffers, Composite Liability, and Task 8.3 Demand Projection. Re-review total bundle architecture before additional eager growth.

## 80. Completion Statement

**Task 8.4 — Commitment Composition V1 Domain, Pairing, Footprint, and Persistence complete.**
