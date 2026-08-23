# ADR — IndexedDB Durable Collection Storage Foundation

**Status:** Accepted and implemented  
**Date:** 2026-08-21  
**Decision:** Task 3.10

## Context

Existing bounded DayFrame surfaces persist whole values synchronously in localStorage. HistoricalPlan requires indefinite collection growth, atomic multi-record publication, indexed day/as-of queries, and explicit upgrade/recovery behavior. Whole-value localStorage cannot meet that requirement safely.

## Decision

DayFrame adopts native IndexedDB as its domain-neutral durable collection foundation. The implementation provides lazy injected opening, explicit additive schemas, commit-aware atomic multi-store mutation primitives, indexed limited cursor queries, clone-safe reads/writes, connection/versionchange/blocked handling, database deletion, and normalized result errors.

No object store is reserved until a domain surface owns it. No current localStorage surface migrates in Task 3.10. `fake-indexeddb` is a development-only conformance harness and has no production bundle dependency.

Database schema versions remain distinct from domain and record versions. Domain surfaces retain validation, quarantine/protection, desired durable state, exact retry, semantic verification, export formats, and migration authority.

## Consequences

- HistoricalPlan can later use transactional batches and compound/latest indexes.
- Existing synchronous store workflows remain unchanged.
- A temporary mixed-storage period is explicit.
- ExecutionHistory should migrate after HistoricalPlan persistence and before Backup V3/broader release.
- Migration requires an anti-resurrection marker and verified atomic establishment.
- Full clear/export must eventually coordinate both substrates.
- No silent fallback, destructive upgrade, or automatic repair is permitted.

## Alternatives Rejected

- localStorage collection envelopes: synchronous whole-value scaling and no indexed/transactional collection semantics.
- A custom in-memory test fake: would not exercise IndexedDB transaction behavior.
- Dexie/idb production wrapper: unnecessary dependency for the bounded capability set.
- Immediate ExecutionHistory migration: unnecessary blast radius before a real collection consumer.
- Empty HistoricalPlan store reservation: schema side effect without domain ownership.

## Follow-up

Task 3.11 implements pure HistoricalPlan V1 domain semantics. Task 3.12 wires its stores/indexes and independent durability surface. ExecutionHistory migration and Backup V3 remain separately governed.
