# Checkpoint — Phase 6 Canonical Today Read Model

**Date:** 2026-08-24

**Status:** Task 6.3 complete; Task 6.4 authorized

DayFrame now exposes one canonical, explicit-time `queryToday` application query. It derives the variable-duration current user-day, selects the effective HistoricalPlan publication, keeps V2 all-day/timed and V1 legacy timing distinct, classifies all current/next/later/elapsed timed occurrences, retains plan-attention evidence, and overlays exact cutoff-governed ExecutionHistory outcomes without behavioral inference.

The model is pure, clone-isolated, non-authoritative, non-persisted, and query-lazy. No Today UI, write, new authority, schema, migration, or Backup version was added. Task 6.4 may render this query read-only.
