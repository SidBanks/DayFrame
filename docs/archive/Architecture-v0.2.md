# DayFrame Architecture Specification --- v0.2 (Revision Plan)

## Chapter II

-   Add Authored vs Derived Domain Objects.
-   Add Occurrence, Commitment Occurrence, Goal Occurrence, Planning
    Candidate.
-   Add derived object invariants.
-   Update planning terminology.

## Chapter III

Clarify: Authored Intent → Derived Domain Objects → Generated Plan →
Reality → History → Learning

## Chapter V

-   Engines coordinate Services.
-   Services own one capability and one architectural decision.
-   Add Service Naming Principle.

## Chapter VI

Rename: - Work Generation Service → Commitment Occurrence Service -
Candidate Generation Service → Goal Occurrence Service - Add Planning
Candidate Service

Pipeline: Capacity Service → Capacity Model Commitment Occurrence
Service → Commitment Occurrences Goal Occurrence Service → Goal
Occurrences Planning Candidate Service → Planning Candidates Placement
Service → Generated Plan Friction Analysis Service → Friction Report
Recommendation Proposal Service → Recommendation Proposals
