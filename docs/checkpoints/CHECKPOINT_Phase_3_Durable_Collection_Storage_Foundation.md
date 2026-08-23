# Phase 3 Durable Collection Storage Foundation Checkpoint

**Status:** Implemented and accepted  
**Date:** 2026-08-21  
**Scope:** Task 3.10

## Technology and Boundary

Native IndexedDB is the accepted scalable collection substrate. It provides transactional batches, object stores, indexes, cursors, structured clone, and explicit schema upgrades without adding production wrapper code. `fake-indexeddb` is development-only and tests the same request/transaction API.

The infrastructure lives under `src/infrastructure/storage` and knows no ExecutionRecord, HistoricalPlan, Preview, PlanDecision, React, or store authority. Import/construction has no database side effect. Future domain surfaces explicitly instantiate it with injected schema and factory.

`dayframe-durable-v1` is the recommended physical database identity and physical schema version begins at 1. Database version, domain surface version, and record version are independent.

## Schema and Upgrade Discipline

Schemas declaratively list domain-owned stores and indexes. Task 3.10 reserves no empty HistoricalPlan or ExecutionHistory store. Additive creation occurs only during `versionchange`; unknown stores/indexes are never dropped. Destructive recreation/reset is prohibited without a separately governed migration.

Physical schema upgrades and domain-data migrations are separate. Upgrade failure aborts the version transaction. Existing connections close on `versionchange`; blocked open/delete is observable rather than hanging silently.

## Transaction Semantics

High-level mutations (`put`, `putMany`, delete, deleteMany, clear, mixed multi-store `mutate`) issue all IndexedDB requests synchronously within one transaction and report success only after the transaction `complete` event. Any request failure/abort prevents partial commit. No arbitrary async callback API is exposed, avoiding transaction auto-close footguns.

The foundation allocates no IDs/timestamps and owns no desired durable condition. A domain surface retains exact desired state and retries the same caller-owned values/keys.

## Queries and Reads

Exact-key get, complete enumeration, and indexed cursor queries are supported. Index queries accept equality or IDBKeyRange, forward/reverse direction, compound keys, and explicit limits. Returned and stored values cross structured-clone boundaries and are isolated from caller mutation.

Future domain export owns canonical envelopes and deterministic ordering. Infrastructure provides complete enumeration but does not claim semantic verification: IndexedDB commit plus clone-safe reread proves physical durability only; domain validation/canonical equality proves semantic durability.

## Error Taxonomy

Expected failures return stable codes: unavailable, openFailed, upgradeBlocked, versionError, transactionAborted, constraintViolation, quotaExceeded, cloneFailure, readFailed, writeFailed, deleteFailed, and unknown. Browser exception names remain optional diagnostics, never domain status.

There is no silent localStorage fallback, eviction, repair, destructive reset, or retry mutation.

## Connection and Availability

Connections are opened lazily, shared per storage instance, explicitly closable, and reopened on demand. Another context's upgrade closes stale connections. Multi-tab domain synchronization is not provided; only safe database lifecycle is established.

Factory injection keeps imports safe when browser globals are absent. Storage availability is established by attempted open, not by property presence alone.

## Current Coexistence and Migration

Option A is adopted: Active V2, Profiles V2, PlanDecision V1, and ExecutionHistory V1 remain on localStorage. No current authority or synchronous workflow changed. The IndexedDB foundation has no production consumer yet.

Long term, ExecutionHistory should migrate after HistoricalPlan pure domain and persistence integration, and before Backup V3/broader release. Migration must use a durable authority marker/epoch so cleared or abandoned legacy localStorage data cannot resurrect after restart. Required sequence: validate legacy authority, atomically write collection representation plus establishment marker, verify domain semantics, then retire legacy reads under a separately authorized migration task.

## HistoricalPlan Readiness

The foundation supports future atomic PlanPublication batches across publication/day/metadata stores, day/as-of compound indexes, reverse latest queries, complete export, and explicit clear/delete. Task 3.10 creates no HistoricalPlan schema or records.

## Privacy and Logging

Infrastructure does not log record payloads. Encryption at rest, quota requests, persistence requests, recovery UI, archival, and database inspection tooling are deferred. Full product clear must eventually coordinate both localStorage and IndexedDB; no IndexedDB consumer exists yet.

## Invariants

1. Transaction success means committed, never merely request success.
2. Failed logical batches leave no partial durable state.
3. Caller owns durable keys, IDs, timestamps, desired condition, validation, and canonical equality.
4. Physical schema version is independent from domain versions.
5. Schema changes occur only in explicit versionchange upgrades.
6. Upgrades never silently drop/recreate data.
7. Expected storage failures are normalized and observable.
8. No silent fallback, trimming, repair, or domain interpretation.
9. Import/construction has no persistence side effect.
10. Migration requires anti-resurrection authority markers and semantic verification.

## Next Sequence

Task 3.11 should implement HistoricalPlan V1 as a pure domain model and effective-plan projection. Task 3.12 may then declare physical stores/indexes and wire persistence. ExecutionHistory migration follows under its own compatibility contract, before Backup V3.
