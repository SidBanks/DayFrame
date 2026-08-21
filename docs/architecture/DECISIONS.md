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
