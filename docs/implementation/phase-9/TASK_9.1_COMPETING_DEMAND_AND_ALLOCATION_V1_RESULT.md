# Task 9.1 — Competing Demand and Allocation V1 Result

**Status:** Complete  
**Date:** 2026-09-04

## 1. Executive Result

DayFrame now derives exact Competing Demand Sets and bounded, deterministic Allocation alternatives from Phase 8 Capacity, Demand Projection, Goal Priority, and Goal-Specific Feasibility. The result is provisional reasoning only.

## 2. Scope Delivered

Delivered competition components, singleton handling, a governed Allocation Policy V1, exact resource assignment and conservation, alternatives, ranking, explanations, provenance, freshness, lazy store orchestration, tests, and governance.

## 3. Governing Evidence

The Goal Demand/Allocation, Capacity, Commitment Composition, post-Phase-7 synthesis/strategy/roadmap, and Tasks 8.1–8.5 results governed the implementation.

## 4. Phase 8 Baseline

Task 8.5 supplied 110 files/1,025 tests and a 671,522 raw, 169,915 gzip, 53,187 largest-lazy, 854,356 total-byte bundle baseline.

## 5. Task 8.3 Demand/Priority Integration

Allocation consumes active projected demand and exact revisioned priority evidence without turning either into time ownership.

## 6. Task 8.5 Capacity/Feasibility Integration

Competition consumes Feasibility opportunities; Allocation selects those legal claims against the exact Capacity result and does not rerun either derivation.

## 7. Files Added

Added `competingDemand.ts`, `allocation.ts`, focused tests, eager/lazy Allocation surfaces, a reusable lazy-surface helper, the Task 9.1 specification copy, and this result.

## 8. Files Modified

Modified store composition/types, refactored the existing lazy Capacity façade through the shared helper, and updated architecture governance.

## 9. Competing Demand Definition

A set is a derived context of Demand Projections whose feasible claims form one overlap-connected component within one exact horizon.

## 10. Competition Input Contract

Inputs are an exact Capacity result, evaluation cutoff, and Demand/Feasibility/Priority tuples.

## 11. Competition Eligibility

Only horizon-compatible, eligible Feasibility results with at least one opportunity claim enter the competition graph; exclusions carry structured reasons.

## 12. Competition Graph

Vertices are Demand Projection semantic IDs. An edge exists only when two demands have half-open feasible slices with positive temporal overlap.

## 13. Competition Components

Connected components are derived deterministically, so transitive A–B–C competition forms one set even when A and C do not directly overlap.

## 14. Singleton / Non-Competing Behavior

Every eligible isolated demand receives a singleton set. Ineligible or claimless inputs remain explicitly noncompetitive.

## 15. Competing Set Identity

Identity includes policy, cutoff, Capacity fingerprint, exact members, claims, edges, dependency evidence, and horizon—not input order.

## 16. Competing Set Output

Outputs expose kind, members, exact claims and edges, references, horizon, qualifications, reasons, provenance, and dependency fingerprint.

## 17. Goal Priority Integration

Goal Priority affects Allocation ranking only; it never changes Feasibility or Capacity.

## 18. Priority Scope Handling

Each provisional partition resolves bounded user-day priority first and default priority second. Mixed horizons are never flattened to one priority value.

## 19. Same-Goal Multiple Demand Handling

Distinct Demand Projection semantic IDs remain distinct competitors even when they belong to the same Goal.

## 20. Allocation Definition

Allocation is derived, provisional assignment reasoning over exact compatible Capacity claims under a named policy.

## 21. Allocation Inputs

Allocation receives one Competing Demand Set, its exact Capacity result, and matching Demand/Feasibility/Priority inputs.

## 22. Allocation Policy V1

`goal-allocation` version 1 defines maximal alternatives, priority-aware ranking, deterministic technical ties, and a 32-alternative public bound.

## 23. Allocation Policy Identity

The policy ID/version and search/tie rules participate in dependency and result identity.

## 24. Policy Value Boundary

The fixed V1 rule is governed application policy, not inferred user preference or learned behavior.

## 25. Technical Tie-Break

Equal policy scores resolve by stable Demand semantic identity, never display order, array order, randomness, or Goal title.

## 26. Allocation Search Boundary

Search combines existing legal Opportunity Sets only; it does not invent placements, split rules, session sizes, or availability.

## 27. Exact Resource Claims

Every assignment references the exact Capacity interval and half-open slice supplied by Feasibility.

## 28. Session Partition Model

Selected opportunity slices become explicit provisional session partitions retaining Demand, opportunity, Capacity, time, day, and duration identity.

## 29. Capacity Conservation

Positive-overlap checks prevent any Capacity portion from being assigned twice inside one alternative.

## 30. Capacity Immutability

Allocation clones and references Capacity data; it never mutates the Capacity input or scheduling sources.

## 31. Requested / Assigned / Unmet Accounting

Each demand reports requested, attributed, assigned, remaining, and unmet minutes; V1 attribution is explicitly zero.

## 32. Full Satisfaction

A demand is full when assigned minutes satisfy its requested projected effort through a legal Opportunity Set.

## 33. Partial Satisfaction

Partial outcomes arise only from Feasibility-authorized partial Opportunity Sets and retain exact assigned and unmet totals.

## 34. Minimum Satisfaction

Minimum session, maximum session, session count, splitting, and partial thresholds remain Feasibility responsibilities and are not weakened by Allocation.

## 35. Unmet Demand

Unassigned requested minutes remain explicit, classified, and explained; Allocation never silently drops demand.

## 36. Unallocated Capacity

Each alternative reports the exact residual half-open portions after subtracting its selected claims.

## 37. Disjoint Component Composition

Independent components are allocated separately and returned in deterministic set order; no false cross-component scarcity is introduced.

## 38. Allocation Alternative

An alternative is one valid maximal, non-overlapping combination of legal Opportunity Sets with complete demand and residual-Capacity accounting.

## 39. Preferred Alternative

The highest policy-ranked alternative is marked preferred while all retained alternatives remain provisional.

## 40. Search Bound

V1 exposes at most 32 alternatives and bounds internal examination to 512 candidates; truncation is explicit.

## 41. Search Strategy

A deterministic depth-first enumeration explores sorted legal options, rejects overlap, retains maximal leaves, deduplicates semantic results, and ranks afterward.

## 42. Ranking

Ranking maximizes assigned minutes by exact critical/high/normal/low partition priority, then full count, partial count, total minutes, and fewer fragments.

## 43. Equal-Priority Behavior

Equal-priority scarcity uses the semantic-ID technical tie and yields deterministic results independent of input order.

## 44. Priority Swap Behavior

Swapping authored Goal priorities switches the preferred scarce-resource winner without changing Capacity or Feasibility.

## 45. Derived Urgency Boundary

No urgency, due-date pressure, lateness, or inferred importance is synthesized.

## 46. Learning Boundary

No history-derived score, adaptation, prediction, or learned ranking enters V1.

## 47. Allocation Identity

Result and alternative IDs hash normalized semantic content, dependencies, policy, set, and cutoff; input ordering is excluded.

## 48. Freshness

Freshness evaluates the declared dependency fingerprint against current Capacity, set, Demand, Feasibility, and Priority evidence and returns current, stale, or unknown.

## 49. Explainability

The result exposes policy ranking, selected opportunities, exact partitions, satisfaction, unmet demand, residual Capacity, and why a preferred loser lost.

## 50. Structured Reasons

Reasons distinguish ineligible/no-claim competition, insufficient compatible Capacity, higher-priority claims, and equal-priority technical ties.

## 51. Provenance

Competition and Allocation carry derived provenance plus exact Capacity, Demand, Goal, Feasibility, Priority, policy, and evaluation references.

## 52. Persistence Decision

Competing sets and Allocations are disposable read models and are not persisted.

## 53. Schema / Backup Decision

No authority was added; IndexedDB schema 9 and Backup V9 remain unchanged.

## 54. Profile Compatibility

Profiles contain no competition or Allocation result and require no migration.

## 55. Store / Query Surface

The lazy store façade exposes competition derivation, one/all-set Allocation, exact resolution, freshness evaluation, and end-to-end evaluation.

## 56. Evaluation Orchestration

One query composes Capacity, active exact-horizon Demand Projection, one-demand Feasibility, applicable priority histories, competition, and Allocation.

## 57. Scheduling Non-Interference

No commitment placement, Preview generation, schedule publication, or historical plan is created or changed.

## 58. Preview Boundary

Preview remains an upstream Capacity dependency only; Allocation cannot revise or accept it.

## 59. Friction Boundary

No Friction is created, cleared, reclassified, or used as a ranking input.

## 60. Proposal Boundary

No Proposal, recommendation presentation, or user-facing action is implemented.

## 61. Accepted Allocation Boundary

Preferred is not accepted authority. No acceptance lifecycle or durable Allocation exists.

## 62. PlanDecision / CompositeDecision Boundary

Existing decisions remain untouched and are neither reused nor overloaded as Allocation authorization.

## 63. Scheduled Goal Work Boundary

Provisional partitions do not create Commitment instances, occurrences, execution subjects, or scheduled Goal work.

## 64. Progress Boundary

No Progress observation, attribution, inference, or completion state changes.

## 65. Historical Provenance Seam

Exact IDs, revisions, cutoff, dependency fingerprints, and resolvers leave a future audit seam without prematurely publishing history.

## 66. Tests Added

Seven focused tests cover graph connectivity, disjoint singletons, priority, ties, conservation, same-Goal multiplicity, determinism, and freshness behavior.

## 67. Competition Tests

Tests prove exact overlap edges, transitive components, touching non-overlap, deterministic order, and singleton emission.

## 68. Priority Tests

Tests prove higher-priority preference, swap behavior, losing rationale, and equal-priority semantic tie-breaking.

## 69. Minimum / Partial Tests

Allocation consumes the already-validated Opportunity Set satisfaction contract; accounting tests preserve requested, assigned, remaining, and unmet quantities.

## 70. Session Tests

Tests verify exact selected session partitions and non-overlap with immutable Capacity inputs.

## 71. Alternatives Tests

Scarcity tests retain materially different valid alternatives and identify one preferred alternative.

## 72. Determinism Tests

Reordered input yields stable component/alternative semantics; dependency arrays are explicitly normalized before fingerprinting.

## 73. Freshness Tests

Tests verify current exact dependencies and stale results after dependency change.

## 74. Read-Only Regression Tests

The full existing suite passes, covering scheduling, Preview, decisions, persistence, backup, Progress, and UI boundaries.

## 75. Full Regression Result

All 111 test files and 1,032 tests pass with zero failures.

## 76. Validation Commands / Results

Prettier, `npm run typecheck`, `npm run lint`, `npm test -- --run`, `npm run build`, `npm run check:bundle`, and `git diff --check` pass.

## 77. Bundle Architecture Review

Allocation, competition, orchestration, and Capacity remain lazy. A shared proxy helper reduces duplicate eager façade code. Hard policy passes at 671,863 raw, 169,998 gzip, 53,187 largest lazy, and 867,085 total bytes.

## 78. Performance Notes

Search is explicitly bounded and component-local. Initial gzip has only 2 bytes of hard-limit headroom and total bytes exceed the architecture-review threshold, so further eager growth is unsafe.

## 79. Accessibility Notes

No UI or interaction changed; existing accessibility behavior is unaffected.

## 80. Compatibility Notes

Existing persisted data, Backup V9, profiles, public scheduling semantics, and Phase 8 callers remain compatible.

## 81. DF-006 Relationship

DF-006 user-day and work-publication protections remain upstream invariants; Task 9.1 neither changes work recurrence nor republishes schedules.

## 82. V1 Design Decision Table

| Decision                 | V1 choice                                    | Consequence                          |
| ------------------------ | -------------------------------------------- | ------------------------------------ |
| Competition basis        | Positive overlap of exact feasible claims    | Same day/Goal alone does not compete |
| Isolated eligible demand | Singleton set                                | Uniform downstream handling          |
| Priority use             | Allocation ranking only, per partition scope | Feasibility stays neutral            |
| Search                   | Deterministic bounded maximal combinations   | Explainable finite output            |
| Public alternative cap   | 32                                           | Explicit truncation beyond bound     |
| Tie-break                | Demand semantic ID                           | Stable technical ordering            |
| Persistence              | None                                         | Recompute from declared dependencies |
| Acceptance               | Future concern                               | Preferred remains provisional        |

## 83. Boundary Matrix

| Concern               | Read                   | Create/mutate   | V1 owner            |
| --------------------- | ---------------------- | --------------- | ------------------- |
| Capacity              | Yes                    | No              | Task 8.5            |
| Demand Projection     | Yes                    | No              | Task 8.3            |
| Goal Priority         | Yes                    | No              | Task 8.3            |
| Feasibility           | Yes                    | No              | Task 8.5            |
| Competing Demand      | Derive                 | Disposable only | Task 9.1            |
| Allocation            | Derive                 | Disposable only | Task 9.1            |
| Proposal / acceptance | No                     | No              | Future              |
| Schedule / Preview    | Indirect upstream only | No              | Existing scheduling |
| Friction / Progress   | No                     | No              | Existing domains    |

## 84. Invariant Verification

Exact horizons, half-open overlap, no double assignment, Capacity immutability, accounting conservation, scoped priority, deterministic identity, read-only orchestration, and authority separation are verified.

## 85. Implementation Decisions

Competition and Allocation remain separate pure modules; store orchestration is lazy; policy is fixed/versioned; set and alternative resolvers use semantic IDs.

## 86. Deviations

No material scope deviation. Tests exercise the authored partial/minimum boundary through legal Feasibility fixtures rather than adding another Feasibility combinator suite.

## 87. Architecture Reopen Check

Architecture did not reopen. All decisions fit the governing Phase 8/9 chain and preserve authority boundaries.

## 88. Governance Updates

This result, `CURRENT_STATE.md`, and `CHANGELOG.md` record completion, validation, bundle risk, and the next boundary.

## 89. Repository Status

Task changes remain uncommitted as requested; pre-existing Phase 8 working-tree changes were preserved.

## 90. Completion Assessment

Task 9.1 is complete: DayFrame can explain how exact scarce Capacity may be provisionally divided without claiming that any result is proposed, accepted, or scheduled.

## 91. Recommended Next Task

Proceed to a bounded Proposal and user-decision specification/implementation that consumes—not reinterprets—Allocation alternatives and preserves explicit acceptance authority.

## 92. Completion Statement

Competing Demand and Allocation V1 are implemented as deterministic, bounded, priority-aware, explainable, fresh-or-stale derived planning truth. They conserve exact Capacity and preserve all Proposal, acceptance, scheduling, Friction, Progress, persistence, and historical-publication boundaries.
