# ROADMAP.md

# DayFrame Roadmap

This roadmap describes the planned evolution of the DayFrame platform following the publication of the Version 1.0.0 architecture.

The roadmap is organized into major development phases rather than implementation tasks.

Individual implementation work is tracked separately.

---

# Current Phase

## Phase 1 — Architecture Publication

**Status:** Complete

### Objectives

* Publish the complete conceptual architecture.
* Establish architectural governance.
* Define canonical terminology.
* Freeze Version 1.0.0 of the architecture.

### Outcome

The DayFrame architecture is now the authoritative conceptual model for all future development.

---

# Phase 2 — Implementation Alignment

**Status:** Complete

### Goal

Bring the implementation into full compliance with the published architecture.

### Objectives

* Audit implementation against the Core Domain Model.
* Align Information Flow with the published architecture.
* Align Architectural Services.
* Align Architectural Engines.
* Verify Information Provenance throughout the system.
* Remove implementation concepts that conflict with the published architecture.
* Close architectural gaps identified during the implementation audit.

### Deliverables

* Architecture Alignment Report
* Updated implementation
* Complete architectural compliance

---

# Phase 3 — Execution Engine

**Status:** Complete through Task 3.16

### Goal

Expand DayFrame from deterministic planning into execution support.

### Objectives

* Execution tracking
* Live occurrence management
* Schedule execution workflow
* Improved friction handling
* Execution history refinement

### Deliverables

* Complete Live pillar implementation
* Durable execution model

### Accepted Task 3.1 boundary (Historical)

Execution uses independent `ExecutionRecord` authority with immutable correction
revisions and a derived current outcome. Planning does not prove execution, and
absence of a report remains unknown. Tasks 3.2–3.3 completed pure identity,
validation/projection, independent persistence, protected recovery, quarantine,
and store authority. Task 3.4 completed safe historical target/snapshot
materialization. At that point, minimal explicit reporting UI was next; Tasks
3.5–3.15C have since implemented and integrated the governed Phase 3 surfaces.

---

# Phase 4 — Historical Intelligence Foundation and Planner/Summary Product Architecture

**Status:** Complete through Task 4.11 with non-blocking deferred scope and residual debt

### Delivered boundary

* Deterministic, policy-versioned Historical Intelligence over HistoricalPlan and ExecutionHistory
* explicit plan coverage and frozen provenance
* Scheduling Realization and Scheduled Outcomes with separate denominators
* read-only Summary with explanation and drill-down
* canonical Planner (`Plan / Schedule`) and Summary product architecture
* preserved explicit generation, stale Schedule, friction, reporting, Backup V3, restore, and clear semantics

### Deferred beyond Phase 4

* Planned Allocation and historical comparisons/trends
* Capacity semantics
* Goals and Progress architecture
* Recommendations and learning/adaptation policy
* Planner Settings/Pattern Library, inline editing/drag-drop, autosave, router, and non-blocking polish

### Phase 4 implementation sequence

1. Task 4.2 — Historical Coverage and Completion Distribution Projection V1 — complete
2. Task 4.3 — Historical Intelligence Explanation, Drill-Down, and Bounded UI Integration — complete
3. Task 4.4 — Summary Experience, Historical Reporting, and Outcome-Surface UX Audit — complete
4. Task 4.5 — Clarify Planner/Preview Navigation, Outcome Scope, and Operational Reporting Responsibilities V1 — complete
5. Task 4.6 — Scheduling Realization Projection V1 — complete
6. Task 4.7 — Scheduling Realization explanation and bounded Summary integration audit — complete
7. Task 4.8 — Phase 4 Roadmap and Planner Convergence Readiness Review — complete; Determination A
8. Task 4.9 — Planner Convergence V1: Compose Plan and Schedule Under One Operational Destination — complete
9. Task 4.10 — Planner Convergence V1 Product Audit and Phase 4 Completion/Sequencing Review — complete; Planner V1 accepted with non-blocking UX debt
10. Task 4.11 — Phase 4 Closure Audit and Publication Checkpoint — complete; Determination B
11. Planned Allocation only after explicit semantic authorization in a future phase
12. Comparative/trend semantics and projections in a future phase
13. Goals architecture, then Progress, in a future phase
14. Recommendation policy and learning only after adequate evidence safeguards

Historical Intelligence remains derived from HistoricalPlan and ExecutionHistory.
Phase 4 begins with transparent counts, coverage, and provenance—not adherence,
composite scores, causal claims, or automatic planning changes.

Task 4.8 determined that the Historical Intelligence/Summary V1 is functionally
mature but the broader Phase 4 Learn promises remain open. Product coherence now
takes precedence over adding another metric: Task 4.9 will converge existing Setup
and Preview workflows composition-first under Planner while preserving all engine,
authority, persistence, Backup, and Summary semantics.

Task 4.9 completed that bounded composition: Planner now contains Plan/Schedule
modes while Summary remains independent. Task 4.10 must assess the resulting
product before Phase 4 closure or any renewed analytical expansion.

Task 4.10 accepted Planner V1 with non-blocking UX debt and determined that no
additional Phase 4 feature is needed. Phase 4 is not yet closed: Task 4.11 is the
single remaining closure/publication checkpoint. It will publish the retrospective
phase identity as Historical Intelligence Foundation and Planner/Summary Product
Architecture, preserve deferred analytical aspirations explicitly, and define the
design-first Phase 5 entry boundary.

Task 4.11 closed Phase 4 under its achieved retrospective identity. The original
comprehensive Learn aspirations are not claimed as delivered; they are explicitly
reclassified above. The next task is Task 5.1, a design-first architecture
definition for Goals, Progress, Recommendations, and Adaptive Planning boundaries.

---

# Phase 5 — Adaptive Planning

**Status:** Ready for design-first Task 5.1

### Goal

Improve planning quality through accumulated historical understanding while preserving deterministic behavior.

### Objectives

* Capacity refinement
* Improved planning heuristics
* Better recommendation generation
* Historical planning optimization

### Deliverables

* Higher-quality generated plans

### Entry task

**Task 5.1 — Phase 5 Architecture Definition: Goals, Progress, Recommendations,
and Adaptive Planning Boundaries.** Define semantics and safety before any
implementation. Descriptive intelligence must remain separate from prescriptive
policy; recommendations must be explainable, reversible, subordinate to
user-defined priorities, and unable to mutate schedules invisibly.
* More personalized planning assistance
* Improved long-term scheduling outcomes

---

# Phase 6 — Platform Maturity

**Status:** Future

### Goal

Expand DayFrame into a mature personal planning platform.

Potential areas include:

* Calendar integration
* External data synchronization
* Multi-device support
* Import and export
* Reporting
* Collaboration features
* API support
* Plugin architecture

Specific features will be evaluated through future Architectural Decision Records (ADRs).

---

# Long-Term Vision

DayFrame is intended to become an explainable planning system that helps users make better long-term decisions without reducing user agency.

The architecture will continue to prioritize:

* User Authority
* Deterministic Planning
* Explainability
* Information Provenance
* Epistemic Integrity
* Historical Immutability

Future capabilities should strengthen these principles rather than replace them.

---

# Architectural Governance

The published architecture defines the conceptual boundaries within which this roadmap evolves.

Implementation may change substantially over time.

Architectural changes shall occur only through approved Architectural Decision Records (ADRs).

Roadmap revisions shall preserve the architectural intent established by Version 1.0.0 unless intentionally superseded through the project's governance process.

---

# Phase 3 Progress-Derivation Sequence Update (Historical chronology)

Task 3.7 established the evidence-only reported outcome summary and explicitly
scoped current-Preview reporting boundary. At that time, historical
adherence/follow-through was not implementation-ready because no durable plan
denominator existed. HistoricalPlan now supplies durable plan authority and
historical reporting reachability, but metric policy remains deliberately
unimplemented. Goal progress, scalar completion percentages, streaks,
timing/duration adherence, and learning remain deferred.

The recommended next task at that point was:

> **Task 3.8 — Implement Reported Outcome Summary and Current-Preview Reporting Coverage**

This task must remain pure/non-durable and categorical, preserve uncertainty, and
must not become a general Progress or performance-scoring feature.

## Historical Plan Ledger Prerequisite (Historical Task 3.9 state)

Task 3.9 adopted an append-only complete-day HistoricalPlan publication model but
found the current localStorage prototype unsuitable for its volume, atomicity, and
indexed query needs. Historical coverage/follow-through remains blocked until the
ledger exists; missing past plan history will not be reconstructed.

The recommended next task at that point was:

> **Task 3.10 — Audit and Implement Phase 3 Durable Collection Storage Foundation**

That task should establish transactional collection storage, migration and
compatibility boundaries, independent durability/recovery, indexed range/as-of
queries, export/full-clear integration, and a path for both ExecutionHistory and
the future HistoricalPlanSurface. Ledger domain implementation follows after the
storage foundation is accepted.

## Durable Collection Foundation Implemented

Task 3.10 established the native IndexedDB infrastructure without creating a
production domain store or migrating current localStorage authority. Atomic
multi-store mutations, additive schema upgrades, indexed bounded queries,
connection lifecycle, structured-clone isolation, and normalized storage failures
are now executable and tested.

The recommended next task at that point was:

> **Task 3.11 — Implement HistoricalPlan V1 Pure Domain, Day-Publication Semantics, and Effective-Plan Projection**

Persistence wiring follows the pure domain. ExecutionHistory migration and Backup
V3 remain later separately governed steps.

## Durable Restore Prerequisite Implemented

Task 3.14A established verified target/recovery staging, a strict restart journal, atomic ExecutionHistory/HistoricalPlan replacement, exact local authority replacement, anti-resurrection preservation, deterministic roll-forward/rollback, pre-bootstrap recovery, and coherent five-participant runtime installation.

The recommended next task at that point was:

> **Resume Task 3.14 — Define and Implement Backup V3 Across All Five Authorities**

Backup V3 must consume the restore coordinator and participant boundary; it must not recreate cross-storage transaction mechanics.

## Complete Backup V3 Implemented

Task 3.14 exports and restores all five current authority surfaces through Task 3.14A, with strict validation, canonical fingerprinting, protected/pending authority policy, Preview clearing, anti-resurrection, and V1/V2 compatibility.

The recommended next task at that point was:

> **Task 3.15 — Phase 3 Integration Audit, Architecture Alignment Review, and Completion Gap Assessment**

## HistoricalPlan-Backed Reporting Implemented

Task 3.15A closes P3-GAP-001 with a bounded production “Report from plan history” path. Current effective HistoricalPlan day occurrences now feed the existing execution reporting workflow from frozen durable authority and remain actionable independently of current Preview/Active state. Historical metrics remain deferred.

## Five-Authority Full Clear Implemented

Task 3.15B closes P3-GAP-002. Full clear now awaits and enumerates terminal outcomes for all five durable authorities, clears derived Preview, preserves ExecutionHistory anti-resurrection across restart, settles HistoricalPlan empty authority, and reports mixed failures truthfully. Task 3.15C completed the Phase 3 validation/governance cleanup; metrics remained deferred and Task 3.16 was next at that point.

## Phase 3 Closure Sequence

```text
3.15A HistoricalPlan-backed reporting      complete
3.15B five-authority full clear             complete
3.15C validation/governance stabilization   complete
3.16 Phase 3 closure audit                  complete
```

Task 3.16 closed Phase 3. Historical metrics, adherence scoring, Goals, and
Progress remain unimplemented. The next boundary is a design-first Task 4.1 —
Phase 4 Architecture Definition and Historical Metrics Semantics Audit; it should
define analytical policy before Phase 4 implementation.
