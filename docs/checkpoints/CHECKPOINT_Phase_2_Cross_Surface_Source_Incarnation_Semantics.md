# Phase 2 Cross-Surface Source-Incarnation Semantics Checkpoint

**Status:** Accepted  
**Date:** 2026-08-20  
**Scope:** Tasks 2.24–2.31

## Decision

DayFrame's source-incarnation foundation is coherent across active state, reusable profiles, backups, migration, recovery, and runtime scheduling. The system is ready for a subsequent task to introduce the durable occurrence-reference seam.

This checkpoint accepts the following lifetime model:

- create, replace, and delete/recreate establish fresh lifetimes;
- update and Active V2 rehydration preserve lifetimes;
- Active V1 migration establishes a fresh forward baseline without claiming historical continuity;
- Profile V2 stores reusable patterns and every activation creates fresh lifetimes;
- Backup V1 import creates fresh lifetimes;
- Backup V2 restores the exact validated lifetime graph;
- persistence failure and retry do not alter the current runtime lifetime graph;
- scheduling and `OccurrenceIdentity` V1 remain incarnation-neutral.

## Durable Surface Contract

| Surface | Version | Incarnation semantics |
| --- | ---: | --- |
| Active local | V1 | Historical reader only; migration allocates a fresh baseline |
| Active local | V2 | Current writer/reader; exact lifetime preservation |
| Saved profiles | V1 | Historical reader only; migrated as reusable patterns |
| Saved profiles | V2 | Current writer/reader; intentionally contains no incarnation |
| Backup | V1 | Historical import; activation allocates fresh lifetimes |
| Backup | V2 | Current export/import; exact lifetime preservation |

Current local keys are `dayframe-active-v2` and `dayframe-profiles-v2`; retained V1 keys are `dayframe-store-v1` and `dayframe-profiles-v1`. Backup envelopes are external artifacts and do not use a local-storage key.

## Source Model

All seven runtime source kinds require a canonical branded UUID-v4 incarnation:

- shift definition;
- shift cycle;
- shift segment, scoped by parent cycle;
- shift sequence entry, scoped by parent cycle;
- block template;
- block recurrence;
- manual event.

The active graph validator enforces canonical form and graph-wide uniqueness. A nested durable identity must include its parent cycle lifetime as well as its own source ID and incarnation.

## Recovery and Safety

Unsupported, malformed, or semantically invalid current-version active/profile input is protected rather than silently downgraded. Ordinary writes are blocked while protected authority exists. Explicit replacement/abandonment rechecks the protected source. Backup V2 validation failures leave runtime state, durability intent, and stored authority unchanged.

V1 data cannot resurrect after a V2 authority marker is established. Profile recovery and backup handling remain independent.

## Evidence Baseline

- 31 test files passed.
- 540 tests passed.
- lint passed.
- TypeScript typecheck passed.
- production build passed (48 modules transformed).
- `git diff --check` passed.
- no Task 2.31 production-code or test changes were required.

The detailed evidence, transition matrices, writer/reader audit, and readiness assessment are recorded in `TASK_2.31_AUDIT_AND_CHECKPOINT_CROSS_SURFACE_SOURCE_INCARNATION_SEMANTICS_RESULT.md`.

## Boundary of This Checkpoint

This checkpoint does not define or implement `DurableOccurrenceReference`, change `OccurrenceIdentity` V1, add PlanDecision behavior, or alter scheduling. Those remain downstream work.

## Final Statement

The cross-surface source-incarnation system is internally consistent, preserves and rotates lifetimes at the intended boundaries, prevents unsupported historical continuity claims, and is safe for a later durable occurrence-reference design to depend upon.
