# Checkpoint — Phase 4 Historical Intelligence Architecture

## Purpose

Phase 4 begins by interpreting historical evidence without creating new historical
truth. DayFrame must describe what its evidence supports before it evaluates
progress or recommends change.

## Authority Boundary

```text
HistoricalPlan   = what was planned
ExecutionHistory = what was observed
        ↓
Historical Intelligence = reproducible descriptive projection
```

Historical Intelligence is neither durable nor authoritative. Identical authority,
policy version, and resolved query produce identical results.

## V1 Query Semantics

V1 uses an inclusive frozen `userDayDate` range and explicit evaluation cutoff.
HistoricalPlan uses the latest effective publication at that cutoff. Execution
uses current effective evidence for window subjects. Rolling ranges are resolved
before projection; initial weekly, cycle, and historical execution-as-of modes are
deferred.

## Coverage and Evidence

Every result carries plan-day coverage. Execution-dependent results also disclose
scheduled eligible count, current observed outcome count, effective unknown count,
and not-reported count. Missing publication is unknown coverage; published-empty
is known zero demand. These are coverage/completeness facts, not statistical
confidence. Zero denominator is not applicable.

## V1 Denominators

- Completion distribution: scheduled occurrences.
- Current-outcome reporting coverage: scheduled occurrences.
- Scheduling realization: all published occurrence states.
- Planned allocation: scheduled intervals only.

Unplaced, blocked, and omitted remain explicit planning states and are not user
failure. They may enter scheduling-realization counts, not execution follow-through.

## V1 Outcomes

`completed`, `partial`, `skipped`, `unknown`, and `notReported` remain separate.
Partial has no invented fractional weight. Retraction yields effective unknown,
not skipped. No report is uncertainty, not missed execution.

## Explainability

Metric identity, policy version, resolved window/cutoff, eligible/observed/excluded
counts, plan and outcome coverage, breakdown, limitations, and contributing durable
references must be available for explanation and future drill-down.

## Boundaries

Frozen historical category and source-family values govern default grouping.
Identity joins remain incarnation-safe; intentional cross-lifetime grouping must
be an explicit analytical policy. Historical Intelligence does not query current
Active to reinterpret history, mutate Planner, create recommendations, or perform
automatic learning.

## First Slice

Task 4.2 — Implement Historical Coverage and Completion Distribution Projection
V1. It proves the architecture through pure counts, coverage, five categorical
states, zero-denominator behavior, and provenance. No persistence, Backup change,
score, trend, Goal, Progress, recommendation, or new UI breadth is included.
