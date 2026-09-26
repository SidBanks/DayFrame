# ADR — Goal Structure Temporal Qualification and Owner Safety V1

**Status: Accepted for bounded implementation under Task 9.27.2; implementation not yet certified.**

## Acceptance authority and exact contract

The user's Task 9.27.2 architectural acceptance adopts `docs/architecture/GOAL_STRUCTURE_TEMPORAL_COMPATIBILITY_AND_OWNER_SAFETY_CONTRACT_V1_PROPOSED_RESULT.md`, SHA-256 `925cecfbd58938cd6a75920e280209a509d88b7f647f5d0db6c471423fac3581`, with the single-clock clarification below. The original PROPOSED artifact remains immutable; this separate adoption record does not rewrite its historical status.

References: Task 9.27 PARTIAL/BLOCKED RESULT and Task 9.27.1 COMPLETE proposal RESULT in `docs/implementation/phase-9/`. Task 9.26 remains accepted COMPLETE. Task 9.27 authoring remains blocked/pending its own continuation.

## Decision and limits

Adopt prospective temporal command validation, lossless supported legacy decoding with separate all-row temporal qualification, current-authority applicability, lossless Milestone metadata patches, and the bounded ordinary admission/epoch/lease/storage-boundary/quiescence mechanisms in the exact contract. Preserve all supported V1 Structure representations, database schema 11, complete backup V14, historical readers, and staging/journal formats. No migration, durable policy field, timestamp correction or reader retirement is authorized. Unsafe legacy evidence remains exactly preservable/exportable/restorable, but cannot activate invented planning semantics. Tightening durable ingress or needing a materially different protocol requires further review.

## Single-clock clarification

New planning orchestration captures one evaluation instant, passes it to the explicit canonical query, and purely maps the returned result into V1 without resampling. Only a direct legacy call to the goalId-only wrapper samples the owner clock once. Calling that wrapper from an already-qualified evaluation is not authorized as an adapter.

## Implementation and verification boundary

Only Task 9.27.2's RESULT can establish implementation completion, including permanent interleaving tests, native production planning/restore, mobile current-surface checks and unchanged hard bundle gates. This ADR does not certify implementation or Task 9.27's unimplemented authoring UI. No new lifecycle, schema, dependencies, global locking, historical reconstruction or recovery authority is adopted.
