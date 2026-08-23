# ADR — Historical Plan Ledger and Day-Publication Semantics

**Status:** Accepted; implementation pending collection storage foundation  
**Date:** 2026-08-21  
**Decision:** Task 3.9

## Context

ExecutionHistory cannot enumerate historical planned occurrences that never received a report. Preview is replaceable derived output, PlanDecision is current authority rather than history, and ExecutionRecord snapshots exist only for reported subjects. Rerunning current scheduling inputs would fabricate past denominators.

## Decision

DayFrame requires an independent HistoricalPlanSurface before implementing arbitrary historical reporting coverage or plan follow-through.

The surface will preserve append-only complete day publications grouped by one atomic fresh-Preview generation batch. Every fresh unrevised authoritative generation/regeneration is eligible; stale and Try-only Preview are excluded. Identical semantic day publications deduplicate. Later day publications supersede earlier operative authority for explicit `asOf` queries while preserving all revisions.

Each day publication freezes the complete requested-scope set of lifetime-safe planned occurrences and their scheduled/unplaced/omitted/blocked facts. Entries use DurableOccurrenceReference V1 plus a dedicated historical plan snapshot. They contain no runtime, SuggestedFix, PlanDecision, execution, or metric-policy IDs.

HistoricalPlan is independently versioned and durable. Missing or corrupt latest day authority is uncertainty and cannot silently fall back. No historical backfill is fabricated.

Because publication volume, indefinite retention, atomic batches, and range/as-of indexing exceed the bounded localStorage prototype, a transactional collection-storage foundation—preferably IndexedDB and shared with long-lived ExecutionHistory—is required before ledger implementation.

## Consequences

- Historical denominators become possible only after durable ledger coverage begins.
- Current Preview coverage remains independent and unchanged.
- Day-level completeness makes absence/removal meaningful and overlap resolution tractable.
- Publication history can later support retroactive execution context after source/decision loss.
- Backup V3 should wait for finalized Phase 3 durable surfaces and include the ledger.
- Full clear/export/recovery must include the independent ledger.
- Goal progress and learning remain separate future concerns.

## Alternatives Rejected

- Bare occurrence ledger: absence and removal are ambiguous.
- Whole arbitrary-range snapshots: excessive overlap duplication and difficult authority resolution.
- Persisted Preview objects: include transient/runtime presentation structures rather than governed facts.
- Publication at first report: misses never-reported denominator entries.
- Scheduler backfill: rewrites history from current mutable inputs.
- Day rollover/app exit: unreliable in a browser application.
- Immediate localStorage ledger: does not meet scale or transactional query requirements.

## Follow-up

Task 3.10 should establish the Phase 3 durable collection storage foundation, including migration, atomicity, indexes, recovery, retry, export, and compatibility boundaries, before implementing HistoricalPlan V1.
