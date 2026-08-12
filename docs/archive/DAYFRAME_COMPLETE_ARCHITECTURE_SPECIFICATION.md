# DayFrame Complete Architecture Specification

**Version:** 0.2.0\
**Status:** Working Draft\
**Canonicality:** Normative where marked **Accepted**; provisional
elsewhere.

------------------------------------------------------------------------

# Document Status

This document is the canonical working architecture specification for
DayFrame.

It is intentionally incomplete. Completed sections are revised in-place
rather than recreated. Future work extends this document instead of
creating parallel drafts.

## Section Status

-   **Accepted** --- Composition and architectural revisions complete.
-   **Provisional** --- Written but expected to evolve.
-   **Planned** --- Reserved for future composition.

------------------------------------------------------------------------

# Revision Log

## Version 0.2.0

### Added

-   Derived Domain Objects
-   Occurrence hierarchy
-   Planning Candidate
-   Service Naming Principle

### Changed

-   Planning modeled as an information-transformation pipeline.
-   Services named after the architectural object they produce.
-   Work Generation Service renamed to Commitment Occurrence Service.
-   Candidate Generation Service replaced by Goal Occurrence Service and
    Planning Candidate Service.

------------------------------------------------------------------------

# Table of Contents

## Chapter I --- Philosophy *(Accepted)*

-   Internal Consistency
-   Epistemic Integrity
-   Determinism
-   Explainability
-   User Agency

## Chapter II --- Core Domain Model *(Provisional)*

-   Existing authored domain model retained.
-   Planned revisions:
    -   Authored Domain Objects
    -   Derived Domain Objects
    -   Occurrence
    -   Commitment Occurrence
    -   Goal Occurrence
    -   Planning Candidate
    -   Derived Object Invariants

## Chapter III --- System Lifecycle *(Provisional)*

Current lifecycle:

Teach → Authored Intent → Derived Domain Objects → Generated Plan →
Accepted Schedule → Live → Execution Events → Immutable History → Learn
→ Recommendations

Revision planned to explicitly incorporate derived planning objects.

## Chapter IV --- Architectural Pillars *(Accepted)*

Teach

Plan

Live

Learn

Architectural authority resides in Pillars.

## Chapter V --- Service Contracts *(Provisional)*

Accepted architectural decisions:

-   Engines coordinate Services.
-   Services own one capability.
-   Services own one architectural decision.
-   Services are named after the primary architectural object they
    produce.
-   Services transform architectural objects rather than execute
    algorithms.

## Chapter VI --- Planning Engine *(Provisional)*

Current accepted service sequence:

Capacity Service → Capacity Model

Commitment Occurrence Service → Commitment Occurrences

Goal Occurrence Service → Goal Occurrences

Planning Candidate Service → Planning Candidates

Placement Service → Generated Plan

Friction Analysis Service → Friction Report

Recommendation Proposal Service → Recommendation Proposals

Remaining service contracts will be revised into this structure.

## Chapters VII+ *(Planned)*

-   Live Engine
-   Learn Engine
-   Persistence
-   Versioning
-   Extension Model
-   Conformance
-   Appendices

------------------------------------------------------------------------

# Editorial Rules

1.  This document is the canonical working specification.
2.  Revisions modify this document in place.
3.  Milestone snapshots are archived separately.
4.  Terminology is defined once and referenced thereafter.
5.  Architectural decisions are recorded in CHANGELOG.md and
    DECISIONS.md.
