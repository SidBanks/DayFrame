# Task 2.26 Result — Durable Source-Incarnation Data Model and Versioned Format Evolution

## 1. Executive Determination

DayFrame will represent each authored-source lifetime with a mandatory opaque `incarnationId` in the future authoritative active model. The serialized token is a canonical lowercase UUID v4. Active, profile, and backup surfaces evolve independently: Active V2 restores incarnation, Profile V2 deliberately omits active incarnation and instantiates fresh lifetimes, and Backup V2 is an explicit recovery artifact that preserves incarnation. Legacy active/V1 backup data establishes forward-only baseline incarnations through guarded conversion. No production format changed in this task.

## 2. Artifact Integrity

- Supplied artifact: `/home/sid/.codex/attachments/db21992b-ee0f-4dd7-bc42-5f49153ea0af/pasted-text.txt`
- Saved copy: `docs/implementation/phase-2/TASK_2.26_DEFINE_THE_DURABLE_SOURCE-INCARNATION_DATA_MODEL_AND_VERSIONED_FORMAT_EVOLUTION_CONTRACT.md`
- Both SHA-256: `fe1e59c428efa244438cb5749f3434d003d452b90478b4a36494543da919c7de`
- Size: 1,227 lines, 37,860 bytes.
- **Confirmed:** byte-identical, complete, correct final statement, and unchanged.

## 3. Evidence Reviewed

**Confirmed:** source types and nesting; Task 2.25 lifecycle transactions; active serializer/reader/key; active recovery protection; profile V1 envelope/normalizer/cloning; backup V1 envelope/parser/import; shared authored setup projection; current validation; default/seed behavior; `OccurrenceIdentity` V1; Tasks 2.24–2.25; and the Phase 1 durable-data ADR.

## 4. Current Durable-Surface Inventory

- Active local state serializes authored collections directly under `dayframe-store-v1`; Preview/profiles are excluded. It supports singular-cycle and other narrow legacy normalization.
- Saved profiles serialize a named collection whose entries contain cloned reusable authored setups.
- Backups serialize one portable authored setup and exclude Preview/profiles.
- All currently preserve readable IDs but none carries incarnation.

## 5. Current Versioning Inventory

- Active: key name implies V1, but payload has no envelope/version field—an **implicit Active V1** contract.
- Profiles: explicit collection `{app:"DayFrame", version:1}`; profile data has no independent subversion.
- Backup: explicit `{app:"DayFrame", version:1}` envelope.
- **Architectural determination:** these are independent version sequences; shared `DayFrameAuthoredSetup` does not couple them.

## 6. Lifetime-Bearing Source Inventory

Block template, block recurrence, manual calendar event, shift definition, shift cycle, cycle segment, and cycle sequence entry all require incarnation. Scheduling preferences and preview range are authored configuration but are not occurrence-generating source lifetimes under the adopted contract.

## 7. Source Scope Matrix

| Source kind | Source ID | Scope | Parent lifetime relevant? | Incarnation required? |
| --- | --- | --- | ---: | ---: |
| block template | `BlockTemplate.id` | template collection/kind | no | yes |
| block recurrence | `BlockRecurrence.id` | recurrence collection/kind | template lifetime participates in occurrence lineage, not ID scope | yes |
| manual event | `ManualCalendarEvent.id` | manual-event collection/kind | no | yes |
| shift definition | `ShiftDefinition.id` | shift-definition collection/kind | no | yes |
| shift cycle | `ShiftCycle.id` | cycle collection/kind | no | yes |
| cycle segment | `ShiftSegment.id` | cycle-local shared work-entry namespace | yes: full cycle lifetime | yes |
| sequence entry | `ShiftCycleSequenceDay.id` | cycle-local shared work-entry namespace | yes: full cycle lifetime | yes |

## 8. Source-Incarnation Definition

**Architectural determination:** one immutable identifier for one continuous lifetime of one authored source within its defined scope. It has uniqueness only—no date, order, content, user, device, or causal meaning. ID/content/position equality never establishes incarnation equality.

## 9. Incarnation Token Requirements

Strong collision resistance across independent offline devices; no central coordination; immutable scalar; stable JSON representation; exact equality; portable restore; simple cloning; deterministic test injection; JavaScript-safe string; non-sensitive and non-semantic; generated only by authorized lifecycle/ingress boundaries.

## 10. Token Representation Decision

Use a branded string serialized as canonical lowercase RFC 4122 UUID v4 and allocated from a cryptographically strong random source. UUID v4 fits offline/cross-device collision requirements and avoids timestamps/content/device identity. Field concept: mandatory `incarnationId`; exact production type/name is governed by the ADR and may be implemented without semantic invention.

## 11. Allocation Authority

| Operation | Preserve incarnation | Allocate incarnation | Retire prior lifetime |
| --- | ---: | ---: | ---: |
| update | yes | no | no |
| create/default creation | no | yes | no |
| delete | no | no | yes |
| delete/recreate | no | yes for recreation | yes |
| replace | no | yes | yes |
| duplicate/copy | no | yes | no |
| profile activation | no | yes for entire graph | replaces current graph |
| active rehydration | yes | no | no |
| recovery restore | yes | no | replaces current graph |
| legacy import/conversion | no historical token | yes baseline | establishes boundary |

Task 2.25 operations own interactive allocation. Ingress mode owns restore/instantiate allocation.

## 12. Update Preservation

Explicit `update` preserves the exact incarnation even if every editable field changes. It is never content-derived or recomputed.

## 13. Creation Semantics

Every explicit create receives a fresh token, including default-derived, copied, identical, and historically reused-ID sources.

## 14. Delete/Recreate Semantics

`(X,A) → delete → create X` produces `(X,B)` with `B != A`. No tombstone is required to enforce this because Task 2.25 preserves the operations and creation always allocates.

## 15. Replacement Semantics

Explicit replacement retires the old lifetime and allocates a new one, including same-ID replacement. Ordinary update is never promoted to replacement by magnitude of change.

## 16. Nested Source Identity

Canonical nested lifetime identity contains parent cycle kind/ID/incarnation + nested kind/ID/incarnation. Parent ID alone is insufficient. Segment and sequence-entry kinds remain distinguishable while sharing the existing cycle-local ID namespace.

## 17. Parent Recreation Semantics

Recreating a cycle allocates a new cycle incarnation and all newly created nested children receive new independent incarnations. Both parent and child lifetime components must match a future reference, providing defense against accidental reuse of either token/component.

## 18. Active Durable Format Decision

Introduce an explicit **Active V2** envelope at a distinct V2 local-storage key. It contains mandatory incarnation on all seven source kinds and a surface/schema version. V2 writers may never omit it; ordinary normalization may never synthesize it. A distinct key permits verified V2 write/adoption while preserving the V1 checkpoint. Once valid V2 exists it is authoritative; V1 is recovery material, not silent fallback. No live key/version changed now.

## 19. Profile Durable Format Decision

Introduce independent **Profile Collection V2** with a reusable-pattern DTO that intentionally omits active incarnation. It retains readable IDs for internal relationships. It must not serialize active authoritative source types indiscriminately.

## 20. Profile Instantiation Semantics

Every activation allocates fresh incarnations for every top-level/nested profile source as one coherent active graph. Repeated activation of the same profile produces distinct lifetimes. No profile-contained active token is copied because Profile V2 contains none.

## 21. Backup Durable Format Decision

Introduce independent **Backup V2** with explicit `activeRecovery` purpose and mandatory incarnation on all sources. Export preserves active tokens; recovery import restores them. A reusable/fork artifact must be a separately declared operation/artifact, not an ambiguous reading of recovery payload.

## 22. Restore Versus Instantiate

Restore: Active V2 rehydration and Backup V2 recovery; preserve. Instantiate: Profile V1/V2 activation, Backup V1 conversion, future import-as-fork, and ordinary defaults; allocate. Ingress authority—not payload equality—chooses the mode.

## 23. V1 Backup Compatibility

Continue direct V1 import under the long-lived backup compatibility contract. Validate/convert without modifying the file, then allocate baseline active incarnations. It cannot restore identity it never stored. Unknown versions are explicitly unsupported, not treated as V1.

## 24. Active Rehydration

Active V2 validates and restores exact tokens before activation. Reconstruction/cloning never rotates them. Missing incarnation in a claimed V2 payload is invalid rather than silently migrated.

## 25. Legacy Active Migration

Active V1 migration is eager before incarnation-bearing runtime adoption: preserve raw V1; parse/normalize/validate; allocate every source/nested baseline; construct/validate/serialize V2; atomically write distinct key; reread/validate; then adopt. The graph migrates as one unit.

## 26. Migration Baseline Semantics

The initial token identifies the current source lifetime as recognized from successful migration forward. It does not reconstruct or assert any pre-migration delete/recreate history. This is safe because no durable lifetime-dependent PlanDecision exists.

## 27. Migration Atomicity

No partial graph or success marker is allowed. Verified durable V2 is the commit point. Old raw V1 remains protected until that point and remains recovery material afterward until evidence-based retirement. Runtime adoption occurs after, never before, verified persistence.

## 28. Migration Failure Semantics

| Failure | Required behavior |
| --- | --- |
| parse failure | protect original; recovery required; no write |
| validation failure | protect original/issues; no activation/write |
| construction failure | preserve V1; no partial graph |
| allocation failure | preserve V1; migration pending/retryable |
| serialization failure | preserve V1; existing serialization-failure outcome |
| storage-access failure | preserve/protect source; unavailable outcome |
| durable-write failure | preserve V1; storage-failure outcome; incomplete migration |
| runtime adoption before write then write failure | forbidden ordering; implementation defect |
| V2 written then initialization failure | protect V2; explicit recovery; never overwrite/fall back silently |

Migration uses existing durability outcome semantics plus an explicit ingress migration-failure classification in the implementation task.

## 29. Profile Migration

Profile V1 remains readable and converts to incarnation-free V2 pattern data. No lifetime token is invented. Any collection rewrite is atomic and must preserve/quarantine unconvertible raw entries; current filtering behavior cannot be used as destructive migration authority. Profile and active migration need not be atomic together.

## 30. Backup Compatibility

- Old import: V1 converter + baseline instantiation.
- New export/import: V2 recovery + exact preservation.
- Source file: never rewritten.
- Unknown version: explicit preserved rejection/conversion guidance.
- Direct V1 reader retirement: only under the durable-data ADR's long-lived evidence/recovery criteria.

## 31. Independent Versioning Decision

| Durable surface | Current version | Incarnation-bearing version | Preserve lifetime? | Instantiate lifetime? | Migration required? |
| --- | --- | --- | ---: | ---: | ---: |
| active local | implicit V1/key | explicit Active V2/new key | V2 rehydrate yes | V1 baseline | yes, eager atomic |
| profiles | collection V1 | V2 pattern (intentionally incarnation-free) | no | every activation | collection conversion, independent |
| backup | envelope V1 | Backup V2 recovery | V2 restore yes | V1 baseline | read-time conversion only |

All three require independent identifiers. There is no shared version counter.

## 32. `DayFrameAuthoredSetup` Assessment

The current type conflates runtime active authority with profile/backup DTOs. Future runtime authoritative sources may carry mandatory incarnation, but profile patterns intentionally do not. Active, profile, and backup require distinct serialized types/projections. `DayFrameAuthoredSetup` may remain a runtime convenience but must stop being the universal durable representation.

## 33. Validation Contract

Active V2/Backup V2: every incarnation required, canonical UUID v4, non-empty, and globally unique within the graph. Missing/malformed/duplicate is invalid; unrelated sources sharing a token is invalid. Existing source-ID/nested-scope validation remains. Profile V2 treats active-incarnation fields as misplaced. Historical V1 absence is valid only through its adapter. Unknown future version is unsupported. Structural validity and semantic resolution remain distinct.

## 34. Clone/Snapshot Contract

Incarnation is copied exactly as an immutable scalar through store snapshots, active clones, and Backup V2 construction. Profile projection omits it. Preview provenance may carry it later only through an authorized durable-reference task; this task changes no clone.

## 35. `OccurrenceIdentity` Relationship

V1 remains runtime-only and unchanged. Future durable targeting uses the separate, independently versioned `DurableOccurrenceReference` selected by Task 2.24, built from complete source lifetimes plus V1-equivalent canonical occurrence coordinates—not by extending or persisting V1 directly.

## 36. DurableOccurrenceReference Readiness

Prerequisites: mandatory active incarnation on all sources, operation-correct allocation, complete Active V2 migration, uniqueness validation, exact rehydration, nested parent lifetime, and explicit unsupported-version handling. Only then may reference types/resolution be implemented.

## 37. PlanDecision Readiness

The contract will let a decision distinguish intended lifetime, same-ID replacement, and coordinate. PlanDecision remains blocked until active incarnation and durable references are implemented/tested, followed by an independently governed decision format.

## 38. Deletion/Tombstone Assessment

**Not required.** Deletion removes active source authority; a retained reference simply fails to resolve. Restore may intentionally reintroduce a historical token through Backup V2.

## 39. History Assessment

No current requirement needs retired-source records or event sourcing. Incarnation distinguishes lifetime without persisting lifetime history. Future audit/history is separate.

## 40. Clear/Reset Semantics

Clear ends the active graph. No hidden token registry survives. Subsequent created/default sources allocate fresh tokens even when readable IDs repeat.

## 41. Default/Bootstrap Source Assessment

Default store construction currently yields empty authored collections; no unconditional demo sources are authoritative. Setup may synthesize draft defaults (notably a cycle) that become ordinary creates only on commit and therefore allocate then. Explicit example/test seeded stores are fixtures/scaffolding and must use an explicit incarnation-aware constructor after implementation.

## 42. Determinism Assessment

Random allocation is an authoring identity event, not planning derivation. Established tokens persist. Equivalent authoritative inputs therefore contain equal tokens and produce deterministic schedules/coordinates; tokens themselves must not influence placement or recurrence.

## 43. Equality Contract

- Same authored lifetime: same kind, scope/parent lifetime, source ID, and incarnation.
- Different lifetime: different incarnation regardless of ID/content.
- Runtime occurrence: current V1 equality.
- Future durable occurrence: full source lineage + canonical coordinate under a durable-reference version.

## 44. Security/Privacy Assessment

Opaque random UUID v4 contains no user, device, timestamp, account, or source-content information. It is not an authentication secret. Collision resistance is the material integrity property; telemetry/account coupling is prohibited.

## 45. Compatibility Assessment

| Input | New runtime behavior |
| --- | --- |
| old Active V1 | validate and atomically migrate baseline before activation |
| Active V2 | validate and restore exact incarnation |
| Profile V1 | convert reusable pattern; allocate on activation |
| Profile V2 | validate reusable pattern; allocate on activation |
| Backup V1 | convert and instantiate baseline |
| Backup V2 recovery | validate and restore exact incarnation |
| unknown future version | preserve/reject explicitly; never guess/default |

Existing data is never silently discarded; old data is not credited with absent identity; serialization/write failures never count as migration success; runtime/durability remain distinct; historical readers remain until governed retirement.

## 46. Required Governance Artifact

Created `docs/adr/ADR_SOURCE_INCARNATION_AND_DURABLE_FORMAT_EVOLUTION.md` as an accepted decision building on—not modifying—the Phase 1 durable-data ADR. It contains semantics, representation, lifecycle, formats, restore/instantiate, migration, failure, validation, compatibility, and future-reference boundaries. Final ADR SHA-256: `e0b6ccce749353164322c735c3734edf231ae537bfc030000a06d893b5d744b4`.

## 47. Future Implementation Test Matrix

| Area | Required tests |
| --- | --- |
| authoring | new unique UUID; update exact preservation; delete/recreate/replace/copy changes; same-ID separation |
| nested | parent recreation changes parent and child lineage; child edit preserves; scope collision rejection |
| active V2 | required-field/UUID/duplicate validation; exact clone/rehydration; writer emits complete graph |
| migration | V1 baseline; atomic all-source/nested allocation; retry; parse/validation/allocation/serialization/access/write failures; V2 reread failure; V1 protection |
| profiles | V1/V2 read; no active token stored; repeated activation yields distinct coherent graphs; invalid entry preservation |
| backups | V1 baseline conversion; V2 export/restore exact preservation; repeated restore; unknown-version rejection; source file unchanged |
| boundaries | clear then create fresh; defaults allocate only on commit; V1 occurrence identity unchanged/no leakage |

## 48. Architectural Alignment Assessment

- Explicit authority: aligned through Task 2.25 operations and ingress modes.
- Epistemic integrity: aligned; legacy data establishes only a forward baseline.
- Durable governance: aligned; independent versions, atomic verified migration, preserved failures.
- Source/artifact separation: aligned; active/recovery carry identity, profiles are patterns.
- Determinism: aligned; identity does not drive scheduling.
- Compatibility: aligned; all V1 surfaces retain explicit routes.
- Implementation readiness: aligned; no policy remains to invent for first active implementation.

## 49. Deviations

None.

## 50. Discoveries and Deferred Work

Active V1 lacks an envelope despite its key name, so Active V2 requires a true envelope and distinct key for defensible atomic migration. Profile migration must not rely on filtering invalid entries; raw preservation/quarantine needs implementation attention. Backup's current user-facing recovery role supports V2 restore semantics, while V1 necessarily remains baseline instantiation. Concrete TypeScript DTOs, generator injection, ingress status unions, serializers, migrations, and UI recovery copy are deferred.

## 51. Recommended Next Task

Implement the first incarnation-bearing authoritative runtime model and Active V2 format/migration as one bounded change: source fields, UUID allocation from Task 2.25 operations, validation, explicit envelope/key, atomic guarded V1 migration, failure/retry/recovery, and direct tests. Keep Profile V2 and Backup V2 implementation in subsequent independent tasks unless implementation evidence proves an atomic dependency.

## 52. Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Full Vitest suite: 27 files, 481 tests passed.
- `npm run build`: passed; 46 modules transformed.
- `git diff --check`: passed after documentation creation.
- ADR path and SHA-256: verified in Section 46.
- Immutable task artifact: unchanged and byte-identical to the supplied artifact.
- Task-specific production/test changes: none.
- Task-specific durable-format/writer/migration changes: none.
- Earlier cumulative Phase 2 executable/test changes were present before Task 2.26 and preserved.

## 53. Final Completion Determination

Task 2.26 is complete. The accepted ADR and this result provide an explicit, independently versioned, implementation-ready contract for every source scope, token, lifecycle operation, active/profile/backup representation, restore/instantiate boundary, legacy baseline, atomic migration, failure, validation, compatibility, and future durable-reference prerequisite, without altering production durable data or implementing incarnation.

**Task 2.26 is complete when DayFrame has an explicit, versioned, implementation-ready durable source-incarnation contract covering every lifetime-bearing authored source, nested lifetime scope, incarnation allocation and preservation, active persistence, profile instantiation, backup restoration, legacy migration, failure atomicity, validation, and compatibility—without changing production durable formats or implementing incarnation, DurableOccurrenceReference, or PlanDecision persistence.**
