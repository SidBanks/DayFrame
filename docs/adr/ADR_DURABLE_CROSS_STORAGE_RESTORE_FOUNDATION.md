# ADR — Durable Cross-Storage Restore Uses Verified Dual Staging and a Startup Journal

**Status:** Accepted and implemented

**Date:** 2026-08-22

**Task:** 3.14A

## Decision

Cross-storage authority replacement uses a strict localStorage metadata journal plus durable target and recovery staging. The shared IndexedDB database stores opaque staged payloads and performs ExecutionHistory/HistoricalPlan replacement atomically. LocalStorage authorities are written and reread individually. A persisted finite stage machine selects deterministic roll-forward, rollback, finalization, or protected recovery-required behavior at startup.

The requested target is preferred after verified IndexedDB target commit. Exact recovery is used only when forward completion cannot be proven. Invalid or missing evidence never triggers inference. Runtime switches only after durable verification and only through the shared five-participant authority transaction.

## Consequences

Restore is interruption-safe and format-neutral, but requires capacity for both sides and a participant adapter for every authority. Cleanup can be retried without affecting authority correctness. Backup V3 can now consume this boundary without owning transaction mechanics. Cross-tab locking and user recovery UI remain separate work.

## Task 3.14A.2 Amendment — Durable and Runtime Representations Are Distinct

Each participant adapter has separate durable and runtime generic types. Staging, fingerprints, source recheck, persistence, and verification operate only on durable payloads. Before mutation and again after durable convergence, participant-specific pure translation constructs a validated settled runtime target. The coordinator never passes a durable payload directly to a live runtime adapter.

The store composition root owns the one concrete coordinator used for startup and future live restore. During interrupted startup, recovery runs against constructed but externally unavailable runtime shells, followed by ordinary collection initialization from the converged durable authority. This avoids a ready-store dependency while preserving the shared runtime transaction for live atomic visibility.
