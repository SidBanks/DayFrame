# ADR — Historical Intelligence Uses Derived, Policy-Versioned Projections

**Status:** Accepted
**Date:** 2026-08-22
**Decision:** Task 4.1

## Context

Phase 3 established HistoricalPlan as durable planned-history authority and
ExecutionHistory as durable observed-history authority. Their stable occurrence
identity, frozen snapshots, revision semantics, and explicit missing-versus-empty
plan coverage are sufficient for descriptive analysis. They do not justify an
undefined adherence score, causal inference, Goal progress, or automatic learning.

## Decision

Historical Intelligence is a pure projection layer. Given HistoricalPlan,
ExecutionHistory, an explicit `HistoricalMetricPolicy V1` identity, and a resolved
query, it deterministically returns descriptive results with coverage,
provenance, exclusions, and limitations. Results are non-authoritative and
non-durable. A future disposable cache may be introduced only if deleting it loses
no truth. Backup V3, restore, and full clear gain no metric participant.

V1 analytical queries use an inclusive HistoricalPlan `userDayDate` range and an
explicit evaluation cutoff. The latest effective HistoricalPlan publication at
that cutoff supplies plan authority. Execution analysis initially uses current
effective evidence for subjects in the occurrence window; historical execution
as-of reconstruction is deferred and must be a distinct query mode if introduced.

Different questions use different denominators:

- completion distribution and current-outcome coverage use scheduled occurrences;
- scheduling realization uses all published scheduled/unplaced/omitted/blocked
  occurrences;
- planned allocation uses scheduled intervals and remains separate from actual
  time evidence.

Completion distribution keeps `completed`, `partial`, `skipped`, effective
`unknown` after retraction, and `notReported` distinct. Partial receives no
arbitrary weight. Unknown and no report are not failure. Unplaced, omitted, and
blocked are planner-state evidence, not user noncompliance.

Every result discloses plan-day coverage and, when execution evidence is involved,
current-outcome coverage. Missing plan days are unknown coverage; published-empty
days are known zero demand. Zero denominator is `notApplicable`, never 0%.
Distributions and counts precede percentages and composite scores.

## Consequences

- `HistoricalMetricPolicy V1` is explicit result identity even though it is not a
  durable authority surface.
- Explicit projections are preferred over a generic arbitrary metric engine.
- Frozen historical category and source-family fields govern default grouping.
  Incarnation-safe identity joins remain distinct from optional explicit logical
  regrouping.
- Corrections/retractions recompute results without rewriting historical evidence.
- Restored authority reproduces results; full clear naturally yields empty or
  not-applicable projections.
- Recommendations require a separate policy and cannot mutate Planner silently.
- Goals and Progress remain separately governed future domains.

## Deferred

Weekly/cycle aggregation, execution as-of views, comparisons, trends, consistency,
duration-weighted execution, composite scores, Goal/Progress semantics,
recommendations, automatic learning, friction analytics, and analytical-report
export remain future decisions.

## First Implementation

Task 4.2 should implement Historical Coverage and Completion Distribution
Projection V1 with explicit windows, scheduled eligibility, all five categorical
result states, coverage, zero-denominator behavior, deterministic provenance, and
no persistence or UI redesign.
