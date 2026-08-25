# ROADMAP.md

# DayFrame Roadmap

This roadmap describes the planned evolution of the DayFrame platform following the publication of the Version 1.0.0 architecture.

The roadmap is organized into major development phases rather than implementation tasks.

Individual implementation work is tracked separately.

## Phase 6 Current Execution Boundary (2026-08-24)

Task 6.3A accepted canonical piecewise user-day starts and versioned HistoricalPlan
all-day/timed provenance. Both bounded prerequisites are now complete:

```text
6.3B canonical variable-boundary windows and consumer remediation (complete)
        +
6.3C HistoricalPlan occurrence V2 timing provenance and compatibility (complete)
        ↓
6.3 canonical Today read model (complete)
        ↓
6.4 read-only Today V1 surface (complete)
        ↓
6.5 Today outcome reporting integration
```

The temporal partition is independent of future Sleep, Capacity, Goal, execution,
or transition-recommendation policy.

---

# Current Phase

## Phase 1 — Architecture Publication

**Status:** Complete

### Objectives

- Publish the complete conceptual architecture.
- Establish architectural governance.
- Define canonical terminology.
- Freeze Version 1.0.0 of the architecture.

### Outcome

The DayFrame architecture is now the authoritative conceptual model for all future development.

---

# Phase 2 — Implementation Alignment

**Status:** Complete

### Goal

Bring the implementation into full compliance with the published architecture.

### Objectives

- Audit implementation against the Core Domain Model.
- Align Information Flow with the published architecture.
- Align Architectural Services.
- Align Architectural Engines.
- Verify Information Provenance throughout the system.
- Remove implementation concepts that conflict with the published architecture.
- Close architectural gaps identified during the implementation audit.

### Deliverables

- Architecture Alignment Report
- Updated implementation
- Complete architectural compliance

---

# Phase 3 — Execution Engine

**Status:** Complete through Task 3.16

### Goal

Expand DayFrame from deterministic planning into execution support.

### Objectives

- Execution tracking
- Live occurrence management
- Schedule execution workflow
- Improved friction handling
- Execution history refinement

### Deliverables

- Complete Live pillar implementation
- Durable execution model

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

- Deterministic, policy-versioned Historical Intelligence over HistoricalPlan and ExecutionHistory
- explicit plan coverage and frozen provenance
- Scheduling Realization and Scheduled Outcomes with separate denominators
- read-only Summary with explanation and drill-down
- canonical Planner (`Plan / Schedule`) and Summary product architecture
- preserved explicit generation, stale Schedule, friction, reporting, Backup V3, restore, and clear semantics

### Deferred beyond Phase 4

- Planned Allocation and historical comparisons/trends
- Capacity semantics
- Goals and Progress architecture
- Recommendations and learning/adaptation policy
- Planner Settings/Pattern Library, inline editing/drag-drop, autosave, router, and non-blocking polish

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

**Status:** Complete through Task 5.19

### Goal

Improve planning quality through accumulated historical understanding while preserving deterministic behavior.

### Objectives

- Capacity refinement
- Improved planning heuristics
- Better recommendation generation
- Historical planning optimization

### Deliverables

- Higher-quality generated plans

### Entry task

**Task 5.1 — Phase 5 Architecture Definition: Goals, Progress, Recommendations,
and Adaptive Planning Boundaries.** Define semantics and safety before any
implementation. Descriptive intelligence must remain separate from prescriptive
policy; recommendations must be explainable, reversible, subordinate to
user-defined priorities, and unable to mutate schedules invisibly.

### Architecture sequence

1. Task 5.1 — Goals, Progress, Recommendations, and Adaptive Planning Boundaries — complete
2. Task 5.2 — Goal V1 Authority, Identity, Lifecycle, and Commitment-Link Semantics Definition — complete
3. Task 5.3 — Implement Goal V1 Durable Authority, Commitment Links, Historical Provenance, and Backup/Restore/Clear Integration — complete
4. Task 5.4 — Planner Goal V1 UX — complete
5. Task 5.5 — Goal-Linked Historical Evidence and Progress Readiness Audit — complete
6. Task 5.6 — Historical Goal-Link Provenance Coverage Semantics and Compatibility Remediation — complete
7. Task 5.7 — Goal Activity V1 Policy and Pure Projection — complete
8. Task 5.8 — Goal Activity Explanation, Drill-Down, and Summary Integration Audit — complete
9. Task 5.9 — Implement Goal Activity V1 Summary Integration and Evidence Drill-Down — complete
10. Task 5.10 — Progress V1 and Measurement-Policy Architecture Audit — complete
11. Task 5.11 — Measurement Definition V1 Architecture and Durable Authority Boundary — complete
12. Task 5.12 — Implement Measurement Definition V1 Durable Authority, Manual Quantity Policy Registry, and Backup V5 Integration — complete
13. Task 5.13 — Progress Observation V1 Architecture and Durable Authority — complete
14. Task 5.14 — Manual Quantity Progress V1 Policy and Pure Projection — complete
15. Task 5.15 — Progress Authoring and Summary Integration Readiness Audit — complete
16. Task 5.16 — Goal Measurement Configuration V1 UX — complete
17. Task 5.17 — Progress Observation Reporting V1 UX, including the Goal-scoped history read model — complete
18. Task 5.18 — Summary Progress V1 integration and provenance — complete
19. Task 5.19 — Phase 5 bundle architecture / code-splitting exit gate — complete; Phase 5 closed
20. Recommendation policy before RecommendationDecision
21. counterfactual and explicitly accepted adaptation only after prior audits

Phase 5 uses an independent authored Goal authority, derived policy-specific
Progress, ephemeral explainable Recommendations, and durable user decisions.
Summary explains and hands off; Planner decides and applies. Automatic adaptation,
machine learning, Capacity inference, and hidden optimization remain unauthorized.

- More personalized planning assistance
- Improved long-term scheduling outcomes

---

# Phase 6 — Platform Maturity

**Status:** Complete through Task 6.11; publication checkpoint created

### Goal

Expand DayFrame into a mature personal planning platform.

Potential areas include:

- Calendar integration
- External data synchronization
- Multi-device support
- Import and export
- Reporting
- Collaboration features
- API support
- Plugin architecture

Specific features will be evaluated through future Architectural Decision Records (ADRs).

### Phase 6 entry sequence

1. Task 6.1 — Monthly Planner and Daily Workspace Product-Convergence Audit — complete; Determination A
2. Task 6.2 — Planner / Today / Summary Surface and Application Boundary Foundation — complete
3. Task 6.3A — User-Day Boundary Transition and All-Day Publication Semantics Architecture Audit — complete
4. Task 6.3B — Canonical Piecewise User-Day Windows — complete
5. Task 6.3C — HistoricalPlan V2 Timing Provenance and V1 Compatibility — complete
6. Task 6.3 — Canonical Today Current-User-Day and Current-Plan Read Model — complete
7. Task 6.4 — Read-Only Today V1 Surface — complete
8. Task 6.5 — Today Outcome Reporting Integration — complete
9. Task 6.6 — Planner Schedule-Review Convergence — complete
10. Task 6.7 — Commitment Authoring Convergence — complete
11. Task 6.8 — Planner Contextual Event and Friction Workflow Convergence — complete
12. Task 6.9 — Phase 6 Surface-Convergence Gap Audit — complete; Outcome B
13. Task 6.10 — Planner Exact-Identity and Commitment Authoring Completion — complete
14. Task 6.11 — Phase 6 Cross-Surface Manual QA, Accessibility/Mobile Remediation, and Publication Checkpoint — complete; Outcome A

Task 6.1 establishes Planner / Today / Summary as the governed product direction.
Month is a horizon-flexible Planner presentation, Today is the canonical current
user-day, and Summary remains settled. Task 6.2 must introduce bounded surface and
application composition without changing production semantics, loading authority,
or canonical write paths. Subsequent Phase 6 task sequencing is recorded in the
Task 6.1 result and remains subject to task-level governance.

Task 6.2 establishes the bounded eager Planner, eager authority-free Today
foundation, and lazy Summary under one surface state without moving canonical state
or write ownership. Task 6.3 is the first task authorized to derive Today semantics;
it must remain a pure/application read model and must not build the Today UI.

Task 6.3 found that valid variable day boundaries lack a transition ownership rule
and that HistoricalPlan V1 drops all-day intent. The prerequisite audit must resolve
both semantics and compatibility/versioning before Task 6.3 resumes. Read-Only Today
V1 remains sequenced after the completed read model.

Tasks 6.3B and 6.3C now implement those decisions: canonical piecewise windows give
every instant one owner, while occurrence V2 freezes explicit timing and preserves
V1 as unavailable legacy across persistence and Backup V6. Task 6.3 may resume.

Task 6.3 now exposes the canonical read-only application query over those truths,
including explicit availability, deterministic temporal groups, plan attention,
and exact ExecutionHistory overlay. Task 6.4 may render that model without composing
raw authorities or adding writes.

Task 6.4 now renders that query as a lazy, responsive, read-only operational surface
with explicit Refresh, neutral evidence copy, protection states, stale safety, and
no hidden polling or writes. Task 6.5 may add bounded outcome reporting.

Task 6.5 now records, corrects, and retracts exact occurrence outcomes through the
existing append-only ExecutionHistory commands. Successful user writes advance the
local Today cutoff and re-query canonical truth; passive updates retain their fixed
cutoff. Today remains plan-read-only and lazy. Task 6.6 may begin.

Task 6.6 now presents Plan / Review Schedule as the Planner workflow, retaining
canonical Preview generation/publication, staleness, selected-day geometry,
unplaced attention, friction Try, and PlanDecision Apply semantics. Planner excludes
execution reporting and remains eager within fixed budgets. Task 6.7 may begin.

Task 6.7 now derives the flexible Commitment inventory from exact existing
template/recurrence identity and provides bounded draft-only Add/Edit/Remove.
Work configuration, events, Goals, Save Setup, staleness, and all historical and
execution authorities retain their singular paths. Plan authoring is lazy and
creates meaningful eager bundle headroom. Task 6.8 may begin.

Task 6.8 now reuses selected user-day context and exact occurrence provenance to
reach the singular Event, Commitment, and Work workflows from Review Schedule.
Event immediate writes, Commitment draft/save staleness, Try, and PlanDecision Apply
remain distinct. Task 6.9 may audit remaining convergence gaps.

Task 6.9 confirms coherent Planner / Today / Summary ownership and green baseline
validation, but selects Outcome B. Task 6.10 must close stale Commitment contextual
retargeting, incomplete parameterized recurrence authoring, the duplicate advanced
Block Template path, and related terminology debt without changing authorities or
bundle thresholds. Task 6.11 must then complete real-browser accessibility/mobile,
transition-day/all-day, and production lazy-loading validation before Phase 6 can
publish as complete. No architecture prerequisite or new ADR is required.

Task 6.10 now freezes exact template and recurrence incarnation provenance for
scheduled/unplaced contextual edits and revalidates it inside lazy Plan authoring.
The ordinary Commitment workflow fully supports daily, weekly, selected weekdays,
and times per user-week; unsupported recurrence remains preserved in advanced
fields. Duplicate advanced creation/removal is gone and directly related product
language is corrected. Task 6.11 may perform final browser/accessibility/mobile QA
and the Phase 6 publication checkpoint.

Task 6.11 validated the production build in Chromium across canonical surfaces,
keyboard/focus, accessibility tree, required mobile widths, slow lazy loading, and
variable-duration transition days. One bounded Generate Schedule focus defect was
fixed. Full tests and fixed bundle guards pass, the Phase 6 publication checkpoint
is recorded, and Phase 6 is complete. Phase 7 planning is next without a preselected
feature commitment.

---

# Long-Term Vision

DayFrame is intended to become an explainable planning system that helps users make better long-term decisions without reducing user agency.

The architecture will continue to prioritize:

- User Authority
- Deterministic Planning
- Explainability
- Information Provenance
- Epistemic Integrity
- Historical Immutability

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
