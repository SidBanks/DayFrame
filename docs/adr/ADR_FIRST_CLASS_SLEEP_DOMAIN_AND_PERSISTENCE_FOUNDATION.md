# ADR — First-Class Sleep Domain and Persistence Foundation

**Status:** Accepted for the Task 9.11 foundation; downstream scheduling implementation deferred

**Date:** 2026-09-17

## Decision

Task 9.10 selects a dedicated authored `SleepRequirementV1`, not a Commitment subtype. Authored exact duration, valid clock or Work-relative intent, explicit off-day fallback, applicability and protection belong to that source. Revisions retain one source incarnation; a future occurrence reference uses source lifetime, canonical owner day and slot zero, never geometry or revision.

Fixed, locked and explicitly accepted Commitment geometry constrains planning. Ordinary movable Commitment geometry will ultimately be resolved around foundational Work and required Sleep before Goal allocation. Capacity will consume dedicated Sleep resolution, not an ordinary unplaced Commitment liability. These rules narrowly supersede the older unconditional highest-Commitment-authority wording and the Capacity specification's Sleep Commitment row. No change to Goal acceptance/realization, immutable publication or execution authority is authorized here.

## Foundation boundary

Task 9.11 persists and validates authored intent only. Active envelope V3, profiles V3 and backup V13 extend the existing aggregate, restore participants and full-clear coordination. Existing physical active/profile storage keys and establishment markers remain stable; envelope versions carry the migration. There is one writer per aggregate, not a parallel Sleep store. Old envelopes translate deterministically with no configured Sleep. Unsupported/malformed new authority is protected.

Profiles preserve portable dated intent and revision values without live incarnations. Activation allocates a fresh incarnation. Full backup preserves live lifetimes and all revision records. Legacy Sleep Commitments are neither promoted nor retired. Conversion provenance/workflow is deferred to the explicit conversion task.

The new reference is not admitted to current PlanDecision, publication or execution schemas. Scheduling, Capacity, Friction, Suggested Fix, Today and historical semantics remain unchanged. Future scheduling activation requires the remaining Task 9.10 contracts and validation.

## Governance

Architecture version 1.0.1 records this narrow domain extension in the existing canonical specification file; its historical filename is retained to preserve links. Task 9.10 supplies the complete target contract. Task 9.11 explicitly authorizes this ADR and bounded implementation.

## Task 9.16 persistence extension — 2026-09-20

Explicit legacy conversion uses the existing authored aggregate. An aggregate with conversion lineage is written as **Active V4**, at the existing active storage key. It contains the new Sleep lifetime, the selected legacy recurrence’s inclusive end date (the day before cutover), and versioned `LegacySleepConversionV1` evidence. Its relationship validator rejects missing/wrong source lifetimes, reopened recurrence, missing converted requirement, and corrupted mapping evidence. Ordinary aggregates without conversion lineage remain Active V3. V2/V3 ingress stays structural and never infers conversion. Older readers protect unsupported V4; current readers protect unknown successor versions.

**Backup V14** preserves Active V3/V4, Profiles V3, and all existing authority collections. The product exports V14. V13 imports remain supported; V13 exports reject conversion-bearing aggregates. Restore validates the conversion relationship before existing coordinated restore. HistoricalPlan and Execution versions are unchanged by conversion.

**Profiles V3** retain portable Sleep revisions and the selected recurrence’s dated end. Live conversion IDs and incarnations are deliberately not projected into profiles; activation allocates fresh source lifetimes. Profile ingress rejects live conversion-lineage fields. Previously saved profiles remain unchanged. Deleting the converted Sleep lifetime marks its lineage as deleted in the same aggregate; the original conversion evidence remains, and cannot attach to a recreated lifetime. The selected retired legacy source is retained and cannot be reopened or rotated through a generic setup replacement. These are schema implementation details of the accepted explicit, prospective conversion contract, not a new scheduling authority.
