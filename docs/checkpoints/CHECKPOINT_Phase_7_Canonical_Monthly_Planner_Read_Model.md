# Checkpoint — Phase 7 Canonical Monthly Planner Read Model

**Date:** 2026-08-25

**Status:** Task 7.1 complete; Task 7.2 authorized

`queryMonthlyPlanner` is now the canonical pure Month projection. It validates explicit
inputs and returns a contiguous 35/42-cell civil grid using one effective M-01
display-week anchor, while every label retains independent canonical piecewise
user-day/week truth. It marks the canonical current user-day from an explicit instant.

Preview range and `isStale` mechanically preserve covered-fresh, covered-stale,
generated-empty, and uncovered states; readiness supplies protected/unavailable query
branches. Current Active Events retain explicit all-day/timed intent and exact
incarnation. Preview Work, Commitments/Sleep, friction, and unplaced evidence retain
one canonical owning `userDayDate`; exact Commitment lifetimes are revalidated without
retargeting recreated sources. Output ordering, overflow, identity, input-permutation
behavior, clone isolation, and indexed performance are deterministic.

HistoricalPlan, ExecutionHistory, Progress, Capacity, Allocation, Recommendations,
React/UI, schedule generation, writes, persistence, Backup, scheduler behavior, and
new dependencies remain excluded. No production chunk was added and Phase 6 bundle
sizes/guards remain unchanged.

Task 7.2 may now build the first accessible read-only Month shell and selected-day
Review workspace without redefining temporal, coverage, identity, or authority truth.
