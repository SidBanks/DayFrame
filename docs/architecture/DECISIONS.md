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
