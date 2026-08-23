# DayFrame Architectural Decisions

This document records the foundational architectural decisions that define the DayFrame architecture.

Once accepted, these decisions remain in force until explicitly superseded by a future Architectural Decision Record (ADR).

The normative architectural definitions are contained in:

> **DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION.md (Version 1.0.0)**

This document records *why* the architecture is structured as it is.

---

# ADR-0001 — Architecture Governance

**Status:** Accepted

The DayFrame architecture is governed by two primary architectural documents:

* `ARCHITECTURE_CHARTER.md`
* `DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION.md`

The Architecture Charter establishes architectural governance.

The Complete Architecture Specification defines the canonical conceptual architecture.

Supporting documents shall remain consistent with these publications.

---

# ADR-0002 — Canonical Specification

**Status:** Accepted

DayFrame maintains a single canonical architecture specification.

The published specification is revised in place between architectural releases.

Published versions represent stable architectural milestones and may be archived for historical reference.

---

# ADR-0003 — Four Architectural Pillars

**Status:** Accepted

The architecture is organized into four primary responsibility boundaries:

* Teach
* Plan
* Live
* Learn

Each Architectural Pillar owns exactly one architectural responsibility.

---

# ADR-0004 — Four Information Transformations

**Status:** Accepted

Information progresses through four legal architectural transformations:

* Author
* Derive
* Record
* Analyze

Every Named Domain Object is produced through one of these transformations.

No additional transformations exist without an approved architectural revision.

---

# ADR-0005 — Domain Object Model

**Status:** Accepted

The architecture distinguishes between:

* Domain Object Categories
* Named Domain Objects

Every Named Domain Object belongs to exactly one Domain Object Category throughout its lifetime.

Named Domain Objects never change Domain Object Categories.

---

# ADR-0006 — Responsibility, Capability, and Workflow

**Status:** Accepted

The architecture explicitly separates:

* Responsibility
* Capability
* Workflow

These concepts correspond to:

* Architectural Pillars
* Architectural Services
* Architectural Engines

No architectural component may assume the responsibilities of another layer.

---

# ADR-0007 — Service Responsibility

**Status:** Accepted

Architectural Services are the exclusive producers of Named Domain Objects.

Each Architectural Service:

* performs one conceptual capability,
* produces one or more Named Domain Objects,
* belongs to one Architectural Pillar,
* preserves information provenance.

Services never coordinate workflows.

---

# ADR-0008 — Engine Responsibility

**Status:** Accepted

Architectural Engines coordinate workflows.

Engines:

* invoke Architectural Services,
* preserve workflow ordering,
* preserve information provenance,
* aggregate workflow results.

Architectural Engines never:

* implement business logic,
* produce Named Domain Objects,
* own persistence,
* own presentation.

---

# ADR-0009 — Information Provenance

**Status:** Accepted

Every significant Domain Object preserves sufficient provenance to reconstruct:

* originating information,
* transformations performed,
* producing Architectural Service,
* coordinating Architectural Engine.

Explainability depends upon preserved provenance.

---

# ADR-0010 — Historical Immutability

**Status:** Accepted

Historical Domain Objects represent observed reality.

Historical information is immutable.

Future planning and analysis may derive new information from history but shall never modify historical evidence.

---

# ADR-0011 — Deterministic Planning

**Status:** Accepted

Planning is deterministic.

Equivalent authored intent and historical evidence shall produce equivalent Derived Domain Objects.

Determinism is a foundational architectural requirement supporting reproducibility, testing, explainability, and user trust.

---

Future Architectural Decision Records shall extend or revise these decisions through the project's architectural governance process.

# ADR-1.22 Durable-Data Compatibility and Independent Format Versioning

**Status:** Accepted
**Date:** 2026-08-13  
**ADR:** `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

DayFrame treats durable authored data it writes or exports as user data and preserves supported historical representations through explicit compatibility, migration, conversion, or non-destructive recovery paths.

Durable-data compatibility is governed by surface:

- active local state receives bounded backward compatibility with durable, observable migration requirements;
- saved profiles are intermediate user-authored durable data and receive stronger migration and recovery protection than active state;
- backup files receive long-lived versioned compatibility and must retain a supported recovery or conversion path before direct-reader support may retire.

Local persistence, profile storage, and backup formats are independently versioned. A durable format version represents a compatibility contract rather than a frozen serialized layout.

In-memory normalization does not constitute completed migration. Unsupported or ambiguous durable data must not silently degrade into incomplete current state, and compatibility readers protecting DayFrame-produced data may be retired only through an explicit architectural decision supported by appropriate migration or recovery evidence.

Existing V1 local, profile, and backup compatibility remains unchanged. The remaining raw singular `shiftCycle` readers remain supported.

**Evidence:** Tasks 1.20–1.22.

# ADR-1.39 — Session-First Durability Authority, Retry, and Recovery Boundary

**Status:** Accepted
**Date:** 2026-08-18
**Evidence:** Tasks 1.23–1.39

DayFrame separates current runtime authority from durable-storage state.

A valid runtime mutation becomes authoritative for the current session even when
durable persistence fails. Persistence failure does not roll back, suppress, or
reinterpret an otherwise valid domain transition.

The store owns interpretation of persistence outcomes and retains durability
knowledge independently from `DayFrameState`.

The current authority model distinguishes:

```text
DayFrameState
    = current runtime/domain truth

StoreDurabilityStatus
    = current knowledge of durable convergence

StoreDesiredDurableCondition
    = store-owned retry-routing intent

DurabilitySemanticCategory
    = workflow interpretation of durability state
```

These concepts are not interchangeable.

## Persistence Outcomes

Persistence operations report factual outcomes rather than inferred causes or
generic success/failure.

The current persistence model distinguishes, as applicable:

* successful persistence or removal;
* storage unavailability;
* storage failure;
* serialization failure.

A persistence failure may coexist with a successful runtime/domain transition.

## Retry Authority

Ordinary durability retry means:

> Attempt again to establish the store's current desired durable condition.

Retry does not replay the original user command, preserve a historical failed
mutation as authority, or restore a stale failed snapshot.

The current desired durable condition is store-owned and surface-specific:

* `snapshot` means the latest complete current runtime representation is
  authoritative for persistence;
* `absent` means durable key absence is authoritative following clear.

A newer runtime intent supersedes earlier failed persistence attempts.

The store exclusively owns:

* retry-source selection;
* desired-condition interpretation;
* persistence/removal execution;
* retained durability updates;
* retry-result construction.

User-facing workflows may explicitly initiate retry but do not implement retry
semantics.

## Retry Eligibility

Storage unavailability and storage failure are ordinary retryable conditions.

Serialization failure is not blindly retried with unchanged data and is classified
as requiring recovery-oriented handling.

Unknown durability does not establish a failed operation and is not ordinary
retry authority.

Already-durable state does not require another persistence attempt.

No automatic retry policy is adopted.

## Subscription Boundary

Runtime/domain-state observation and durability observation are separate concerns.

Ordinary `DayFrameState` subscribers are notified of runtime-state transitions.

Durability-only transitions, including retry convergence, do not produce false
runtime-state notifications.

Persistent durability consumers observe retained durability through the dedicated
durability observation boundary.

## User-Facing Durability Semantics

Persistence and retained-durability facts are translated through a shared semantic
boundary rather than independently reinterpreted by each workflow.

The current semantic classes distinguish:

* durable success;
* retryable storage unavailability;
* retryable storage failure;
* recovery-required representation failure;
* internal/non-actionable state.

Immediate workflow feedback describes the initiating operation.

Persistent app-level durability awareness describes unresolved retained durability
across workflow navigation.

These are complementary responsibilities rather than competing sources of truth.

## Recovery Boundary

Serialization failure preserves both:

* the latest accepted runtime/session intent; and
* the last successfully established durable representation.

DayFrame does not automatically roll back, reload, reset, discard, or replace
current runtime state because serialization failed.

Ordinary unchanged Retry is unavailable for this condition.

A later valid runtime mutation may naturally restore durability if the resulting
representation can be persisted successfully.

Until a model-specific recovery mechanism is architecturally justified, the
minimum recovery contract is:

* preserve current session intent;
* preserve the previous durable checkpoint;
* communicate that current changes are not durably saved;
* communicate that ordinary Retry is unavailable;
* communicate that reload or close may discard session-only changes and allow
  older saved data to return;
* allow continued session use;
* avoid destructive automatic recovery.

Model-specific repair, rollback, diagnostic export, and recovery tooling require
separate future architectural authorization.

## Architectural Consequence

Future authored-state, persistence, workflow, and scheduling-engine changes must
preserve the distinction between:

```text
runtime authority
durability knowledge
retry intent
workflow semantics
```

unless an explicit future architectural decision supersedes this model.

Changes to the shape of authored state or derived scheduling output do not by
themselves transfer durability authority into the scheduling engine or presentation
layer.

**Evidence:** Tasks 1.23–1.39.

# ADR-2.40 — Lifetime-Safe Accepted Planning Authority

**Status:** Accepted
**Date:** 2026-08-20

DayFrame identifies authored source lifetimes explicitly and stores one-off accepted planning intent as independent PlanDecision authority against DurableOccurrenceReference V1. Authored authority outranks applicable decisions; applicable decisions outrank heuristics; recommendations and Try remain non-authoritative until explicit Accept.

PlanDecision replay is deterministic, stale references never retarget recreated sources, accepted choices remain visible/removable, and recommendation derivation suppresses equivalent suggestions while explicitly labeling proposed revisions. Backup V3 remains required before broader release because Backup V2 is a Setup-only recovery artifact.

**Evidence:** Tasks 2.24–2.40 and `CHECKPOINT_Phase_2_Complete.md`.

# ADR-3.1 — ExecutionRecord and Completion-History Semantics

**Status:** Accepted
**Date:** 2026-08-21

DayFrame treats authored setup, Preview, and PlanDecision as planning knowledge,
not evidence of execution. Phase 3 will use an independent, versioned
`ExecutionRecord` surface: immutable outcome-record revisions plus a deterministic
current-outcome projection. Missing evidence remains unknown; V1 does not infer or
store `missed`. Planned linkage uses `DurableOccurrenceReference V1` together with
an immutable historical snapshot and an independent execution identity.

The complete decision and consequences are recorded in
`docs/adr/ADR_EXECUTION_RECORD_AND_COMPLETION_HISTORY_SEMANTICS.md` and
`docs/checkpoints/CHECKPOINT_Phase_3_Execution_History_Semantics.md`.

**Evidence:** Task 3.1.

# ADR-3.7 — Categorical Outcome Summaries Before Progress Scores

**Status:** Accepted
**Date:** 2026-08-21

DayFrame will first derive categorical reported-outcome summaries. V1 does not
assign fractional credit to Partial, treat Not reported as failure, or publish a
scalar completion/productivity/adherence score. “Progress” is reserved for an
explicit Goal domain; “plan follow-through” is the preferred term for a governed
comparison with actionable scheduled occurrences.

ExecutionHistory alone cannot reconstruct past planned occurrences that never
received a report. Current-Preview reporting coverage may be derived when clearly
labeled current and volatile; historical follow-through is blocked until a durable
historical plan denominator exists. All derived metrics are non-authoritative and
non-durable by default.

**Current applicability:** HistoricalPlan now provides the denominator authority,
but no historical metric or adherence policy has been authorized or implemented.

The full decision is recorded in
`docs/adr/ADR_PROGRESS_COMPLETION_AND_PLAN_FOLLOW_THROUGH_DERIVATION_SEMANTICS.md`.

**Evidence:** Task 3.7 and `CHECKPOINT_Phase_3_Progress_And_Adherence_Semantics.md`.

# ADR-3.9 — Historical Plan Ledger Uses Complete Day Publications

**Status:** Accepted and implemented by Tasks 3.11–3.12
**Date:** 2026-08-21

DayFrame requires durable historical plan authority before arbitrary historical
reporting coverage or plan follow-through can be truthful. V1 will preserve
append-only complete user-day publications grouped by atomic fresh authoritative
Preview generation batches. Stale and Try-only Preview are excluded; identical
day plans deduplicate; missing/corrupt authority remains uncertainty.

HistoricalPlan is independent of Active, Profiles, PlanDecision, and
ExecutionHistory. It freezes effective scheduled/unplaced/omitted/blocked plan
facts through DurableOccurrenceReference V1 but stores no metric policy. No
historical backfill is fabricated.

The volume and query model required transactional collection storage before ledger
implementation; that prerequisite and the ledger are now implemented. The full decision is recorded in
`docs/adr/ADR_HISTORICAL_PLAN_LEDGER_AND_DAY_PUBLICATION_SEMANTICS.md`.

**Evidence:** Task 3.9 and `CHECKPOINT_Phase_3_Historical_Plan_Ledger_Semantics.md`.

# ADR-3.10 — IndexedDB Durable Collection Storage Foundation

**Status:** Accepted and implemented
**Date:** 2026-08-21

DayFrame uses native IndexedDB for future long-lived transactional collections.
The infrastructure is domain-neutral, lazy, injected, additive-only during schema
upgrade, commit-aware, indexed, clone-isolated, and explicit about expected
failure. It allocates no domain data and owns no desired durable condition.

Current localStorage surfaces do not migrate in Task 3.10. No empty domain store
is reserved. ExecutionHistory migration is separately governed and requires an
anti-resurrection authority marker before Backup V3.

The full decision is recorded in
`docs/adr/ADR_INDEXEDDB_DURABLE_COLLECTION_STORAGE_FOUNDATION.md`.

**Evidence:** Task 3.10 and `CHECKPOINT_Phase_3_Durable_Collection_Storage_Foundation.md`.

# ADR-3.14A — Durable Restore Uses Dual Staging and a Startup Journal

**Status:** Accepted and implemented

**Date:** 2026-08-22

Five-authority replacement stages both requested target and exact recovery authority before live mutation. A strict localStorage journal and durable IndexedDB/local staging drive deterministic startup roll-forward, rollback, cleanup, or recovery-required protection. ExecutionHistory and HistoricalPlan replace atomically; local authorities and anti-resurrection state are reread/verified; runtime installs through the shared five-participant transaction.

**Evidence:** `ADR_DURABLE_CROSS_STORAGE_RESTORE_FOUNDATION.md` and Task 3.14A.

## ADR-3.14 — Backup V3 Represents Complete Domain Authority

**Status:** Accepted and implemented

**Date:** 2026-08-22

Backup V3 contains storage-independent Active V2, Profiles V2, PlanDecision V1, ExecutionHistory V1 including quarantine, and HistoricalPlan V1 publication history. It excludes derived, durability, migration, physical, and restore-infrastructure state. Exact replacement is delegated to Task 3.14A; V1/V2 compatibility is unchanged.

**Evidence:** `ADR_BACKUP_V3_COMPLETE_CROSS_SURFACE_AUTHORITY_RESTORE.md` and Task 3.14 resumed result.

## ADR-3.14A.2 — Restore Translates Durable Authority Into Settled Runtime Authority

**Status:** Accepted and implemented

**Date:** 2026-08-22

Restore staging and verification use participant durable representations only. Every participant explicitly translates verified durable authority into its private settled runtime target; the coordinator installs those targets through the shared five-participant transaction. One store-owned composition serves interrupted startup recovery and future live restore. Runtime translation is infrastructure and will not become Backup V3 content.

## ADR-3.15A — Historical Planned Authority Remains Actionable for Reporting

**Status:** Accepted and implemented

**Date:** 2026-08-22

Current effective HistoricalPlan V1 day projection is an execution-reporting source independent of current Active and Preview. Every stored scheduled, unplaced, omitted, or blocked occurrence is reportable because those are the same planned states supported by the existing Preview reporting workflow. Conversion reuses the exact stored `DurableOccurrenceReference`, frozen title/category/plan, and published user-day context; it creates only ExecutionHistory evidence.

Source deletion, source recreation, restart, and Backup V3 restore do not remove reportability. Missing publication remains distinct from a published empty day. Historical selection does not regenerate Preview, republish or mutate HistoricalPlan, create a new identity/version/storage surface, or imply adherence or progress semantics.

## ADR-3.15B — Full Clear Is a Settled Five-Authority Operation

**Status:** Accepted and implemented

**Date:** 2026-08-22

`clearLocalData()` is asynchronous and returns only after terminal outcomes exist for Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan. Its canonical `authorities` result enumerates all five; Preview is a separate derived-state guarantee. Five successes mean `cleared`, mixed successes/failures mean `partiallyCleared`, and zero successes mean `failed`. Compatibility flat fields and durability labels are derived from that canonical result.

ExecutionHistory clear establishes empty IndexedDB authority before legacy evidence is removed and retains the anti-resurrection marker. HistoricalPlan clear settles an empty ledger and supersedes pending publications. Clear uses the shared runtime-authority notification transaction, does not erase restore evidence, and creates neither planning publication nor execution evidence.
# Task 4.8 — Planner Convergence V1 Is the Next Product Boundary

The post-Task-4.7 product supports two independently useful enduring concepts:
Planner for forward-looking authored/operational work and Summary for read-only
historical interpretation. Summary V1 is sufficiently mature; another analytical
projection is not a prerequisite. Existing Setup and Preview capabilities can be
composed under Planner with Plan/Schedule subviews while preserving the shared
draft, explicit save/generate behavior, stale Preview visibility, PlanDecision,
HistoricalPlan, ExecutionHistory, Backup, restore, and clear semantics.

Phase 4 remains open because its broader Learn roadmap is not complete. Task 4.9
is authorized only as bounded composition-first Planner Convergence V1. Engine,
persistence, Settings/Pattern Library redesign, router, autosave, drag/drop, new
analytics, Goals, Progress, Recommendations, and learning remain deferred.
