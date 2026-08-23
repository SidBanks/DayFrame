# ADR — Backup V3 Is Complete Cross-Surface Domain Authority

**Status:** Accepted and implemented

**Date:** 2026-08-22

## Decision

Backup V3 is a portable domain-authority format, not a physical persistence dump. Its strict envelope contains storage-independent versioned representations of Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan. `exportedAt` is metadata and is excluded from semantic identity.

Canonical export is unavailable when a whole surface is protected and uninterpretable. Governed quarantine and accepted authority awaiting durability are included. Preview, summaries, durability state, migration residue, physical wrappers, and restore infrastructure are excluded.

V3 restore is exact five-surface replacement. Backup code converts validated domain data into participant durable targets and calls the single Task 3.14A coordinator. Task 3.14A owns staging, journal transitions, source recheck, durable commit, roll-forward, rollback, anti-resurrection, and coherent runtime installation.

## Consequences

V3 files may contain historical plans, outcomes, notes, and timestamps and can be materially larger than V1/V2. Complete in-memory JSON is accepted at current scale. V1/V2 behavior remains compatible. Physical storage migration does not itself require V4.
