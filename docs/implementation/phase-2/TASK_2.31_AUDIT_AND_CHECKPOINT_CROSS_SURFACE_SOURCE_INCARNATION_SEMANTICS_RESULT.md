# Task 2.31 Result — Audit and Checkpoint Cross-Surface Source-Incarnation Semantics

## 1. Executive Determination

**Ready.** The audit found no correctness defect or architectural contradiction. Source lifetime is preserved or renewed consistently across all supported surfaces and transitions. The Phase 2 checkpoint was published. No production behavior or tests were changed.

## 2. Artifact Integrity

- Supplied artifact: `/home/sid/.codex/attachments/ebda858a-549d-4d92-b70f-c351e33b51c7/pasted-text.txt`
- Saved project copy: `docs/implementation/phase-2/TASK_2.31_AUDIT_AND_CHECKPOINT_CROSS-SURFACE_SOURCE-INCARNATION_Semantics.md`
- Both copies existed and were byte-identical.
- Size: 35,734 bytes; 1,554 lines.
- SHA-256: `3f7fdb7cb35a1ad9ae1728a86ec8a0cd5e1d2f0332c973350c8400d557e189ce`.
- The required title, rules, audit sections, validation requirements, completion criteria, task determination, and exact final completion statement were present.

## 3. Evidence Reviewed

Completed result artifacts for Tasks 2.24, 2.25, 2.26, 2.27, 2.27A, 2.28, 2.29, and 2.30 were present and reviewed. Executable evidence was reviewed independently in the active/profile/backup formats, store, validators, lifecycle transaction builder, migration/recovery paths, occurrence identity, engine, and their tests. The source-incarnation ADR and durable-data compatibility/versioning ADR were reconciled with implementation behavior.

## 4. Repository Baseline

- Branch: `main`.
- Worktree: dirty with cumulative, uncommitted Phase 2 implementation and documentation changes from preceding tasks; Task 2.31 added only this result and checkpoint.
- Pre-audit validation baseline from Task 2.30: 31 test files and 540 tests passing; lint, typecheck, build, and diff check passing.
- Current durable constants: Active V1 `dayframe-store-v1`; Active V2 `dayframe-active-v2`, version 2; Profile V1 `dayframe-profiles-v1`; Profile V2 `dayframe-profiles-v2`, version 2; Backup V1 version 1; Backup V2 version 2.

## 5. Source-Kind Inventory

Seven source kinds carry mandatory runtime incarnation: shift definition, shift cycle, shift segment, shift sequence entry, block template, block recurrence, and manual event.

## 6. Source-Scope Audit

Top-level source IDs are keyed by source kind and ID. Segment and sequence-entry IDs are scoped by parent shift-cycle ID. Incarnations are validated as globally unique across the active graph. Consequently, a lifetime-safe nested reference must incorporate the parent cycle's lifetime in addition to the nested identity.

## 7. Incarnation Type Audit

`SourceIncarnationId` is a branded string. Creation uses `crypto.randomUUID()`, and validation accepts only canonical lowercase UUID-v4 text. Current runtime source types require it; raw-boundary helper types use optional/unknown fields solely to validate or strip untrusted input.

## 8. Allocation Authority Audit

Allocation is centralized through `SourceIncarnationAllocator`/`createSourceIncarnationId` and injected into the store for deterministic tests. Allocation occurs only when the semantics require a new lifetime or a historical artifact lacks lifetime evidence.

## 9. Update Preservation Audit

Explicit setup lifecycle `update` operations copy the prior incarnation to the instantiated candidate. Manual-event update also preserves the prior incarnation. Direct tests cover all seven kinds.

## 10. Delete/Recreate Audit

Delete retires the current lifetime. Recreating the same source ID is represented as delete/create and receives a fresh incarnation. Manual and setup-source tests directly cover this rule.

## 11. Replacement Audit

Explicit replacement creates a fresh lifetime even when the authored ID is unchanged. Direct store tests cover setup sources and manual events.

## 12. Nested Parent-Recreation Audit

Deleting a cycle records deletion of the cycle, all segments, and all sequence entries. Creating a cycle records the same complete source set. If IDs are reused, created keys are excluded from inferred updates; therefore neither parent nor nested incarnations are preserved. Reorder without deletion is classified as update and preserves identity.

## 13. Active V2 Audit

The envelope is `{ app: "DayFrame", surface: "active", version: 2, data }`. Its data is a complete incarnation-bearing authored setup. Structural, semantic, canonical UUID, and graph-wide collision validation are enforced.

## 14. Active V2 Rehydration

Validated Active V2 data is cloned into runtime without allocation. Restart therefore preserves the exact lifetime graph.

## 15. Active V1 Migration

Active V1 has no trustworthy incarnation evidence. Successful migration normalizes and validates authored data, allocates a fresh incarnation for every source, writes and rereads Active V2, then establishes V2 authority. This is a new forward baseline, not reconstructed historical continuity.

## 16. V1 Resurrection Prevention

After the Active V2 authority marker is established, missing or invalid V2 does not silently fall back to V1. Protected fallback/recovery is used instead.

## 17. Active Durability

Migration preserves V1 until V2 write/reread/validation succeeds. Ordinary current mutation persists Active V2 only. Failed writes retain the runtime graph and desired durable snapshot for retry; retry serializes the same graph.

## 18. Active Protected Ingress

Unsupported version, corrupt JSON, invalid structure/semantics, and migration failures produce protected state. Ordinary writes are blocked. Replacement or abandonment is explicit and guarded by a source recheck.

## 19. Profile V2 Audit

The Profile V2 envelope is versioned and surface-tagged. Profile data is a reusable authored pattern and intentionally excludes all incarnation fields.

## 20. Profile Save

Saving projects the active setup to a pattern. It neither modifies nor claims to preserve an active lifetime.

## 21. Profile Activation

Each successful activation validates the stored pattern and instantiates fresh incarnations for all seven source kinds.

## 22. Repeated Profile Activation

Repeated activation creates a fresh complete graph each time. Direct tests compare all seven source kinds across activations.

## 23. Profile V1 Migration

Valid V1 profiles migrate to V2 reusable patterns without fabricating incarnation. Activation after migration allocates fresh lifetimes.

## 24. Profile Quarantine

Invalid individual profiles are quarantined non-destructively; valid entries remain usable. Quarantine does not convert invalid material into active authority.

## 25. Profile Protected Ingress

Malformed or unsupported Profile V2 authority is protected, blocks ordinary profile writes, and requires explicit recovery with source recheck.

## 26. Profile Empty/Clear Authority

An established empty Profile V2 set remains authoritative and does not resurrect V1. Explicit clear removes both current and historical profile storage/authority as designed.

## 27. Backup V1 Audit

Backup V1 contains authored pattern information but no source-incarnation evidence. Its historical reader remains supported.

## 28. Backup V1 Import

Every successful V1 import allocates fresh lifetimes for all seven source kinds. Repeated import therefore produces distinct lifetime graphs.

## 29. Backup V2 Audit

Backup V2 is `{ app: "DayFrame", surface: "backup", version: 2, data }` and contains the complete active incarnation graph. Validation rejects malformed, semantically invalid, noncanonical, or colliding graphs.

## 30. Backup V2 Export

Current export writes Backup V2 only and clones the exact active graph. Export has no lifetime effect.

## 31. Backup V2 Restore

Restore validates and clones the exact graph without invoking the allocator. Repeated restores preserve identical incarnations.

## 32. Backup V2 Failure Semantics

Parse, envelope, validation, persistence, and recovery-required failures do not partially mutate runtime state or durable intent. A successful retry continues to use the accepted graph rather than reallocating.

## 33. Cross-Surface Envelope Audit

Active, profiles, and backup all use explicit `app`, `surface`, and numeric `version` discrimination. Cross-surface envelopes and unsupported versions are rejected rather than interpreted as another surface.

## 34. Cross-Surface Lifetime Matrix

| Transition | Same lifetime | Fresh lifetime | No lifetime effect | Evidence |
| --- | ---: | ---: | ---: | --- |
| Create |  | ✓ |  | lifecycle/store tests |
| Update | ✓ |  |  | lifecycle/store tests |
| Replace |  | ✓ |  | lifecycle/store tests |
| Delete/recreate |  | ✓ |  | setup lifecycle and manual-event tests |
| Active V2 rehydrate | ✓ |  |  | Active V2 rehydration tests |
| Active V1 migration |  | ✓ |  | migration tests |
| Profile save |  |  | ✓ | Profile V2 projection tests |
| Profile activation |  | ✓ |  | profile activation tests |
| Backup V1 import |  | ✓ |  | backup import tests |
| Backup V2 export |  |  | ✓ | Backup V2 tests |
| Backup V2 restore | ✓ |  |  | Backup V2 tests |
| Persistence failure/retry | ✓ |  |  | durability/retry tests |
| Clear/abandon |  |  | retires authority | recovery/clear tests |

## 35. Seven-Source Transition Matrix

| Source kind | Create | Update | Delete/Recreate | Active rehydrate | Profile load | Backup V1 import | Backup V2 restore |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Shift definition | fresh | preserve | fresh | preserve | fresh | fresh | preserve |
| Shift cycle | fresh | preserve | fresh | preserve | fresh | fresh | preserve |
| Shift segment | fresh | preserve | fresh, including parent recreate | preserve | fresh | fresh | preserve |
| Shift sequence entry | fresh | preserve | fresh, including parent recreate | preserve | fresh | fresh | preserve |
| Block template | fresh | preserve | fresh | preserve | fresh | fresh | preserve |
| Block recurrence | fresh | preserve | fresh | preserve | fresh | fresh | preserve |
| Manual event | fresh | preserve | fresh | preserve | fresh | fresh | preserve |

## 36. Durable Surface Authority Matrix

| Surface | Version | Incarnation | Current writer | Reader | Semantics |
| --- | ---: | ---: | ---: | ---: | --- |
| Active local | 1 | absent | no | yes | historical input; fresh migration baseline |
| Active local | 2 | required | yes | yes | exact current lifetime graph |
| Profiles | 1 | absent | no | yes | historical reusable patterns |
| Profiles | 2 | absent by design | yes | yes | reusable patterns; fresh activation |
| Backup | 1 | absent | no | yes | historical import; fresh activation |
| Backup | 2 | required | yes | yes | exact lifetime-preserving recovery |

## 37. Writer Audit

Current active writes emit Active V2, profile writes emit Profile V2, and backup export emits Backup V2. No production writer emits V1. V1 construction helpers remain fixtures/compatibility utilities, not current store writers.

## 38. Reader Audit

Readers support current V2 plus governed V1 migration/import. V2 authority markers prevent V1 resurrection. Surface and version discrimination precede activation.

## 39. Validator Audit

Authored semantic validation precedes acceptance. Incarnation-bearing formats additionally validate canonical UUID-v4 values and graph-wide uniqueness. Profile validators require pattern semantics and exclude incarnation.

## 40. Clone/Snapshot Audit

Active/Backup V2 clone helpers retain incarnations exactly. Profile projection deliberately strips them. Profile/V1 activation instantiates instead of cloning lifetime identity.

## 41. Persistence Failure Audit

Persistence status is store-owned and outside `DayFrameState`. Failure preserves runtime authority and the desired durable snapshot. Retry does not rotate or regenerate accepted incarnation IDs.

## 42. Clear/Reset Audit

Active clear removes V2, V1, and authority markers and retires the prior graph. Profile clear removes V2, V1, and profile authority. These operations do not transfer lifetime identity between surfaces.

## 43. Recovery Replacement Audit

Active protected replacement accepts a validated complete candidate and preserves that accepted candidate graph while writing current authority. Profile replacement accepts patterns only and does not establish active lifetimes.

## 44. Recovery Abandonment Audit

Abandonment explicitly retires protected durable authority. It does not silently activate historical content or claim continuity.

## 45. Profile Recovery Independence

Profile protection and recovery affect profile authority only. They do not rewrite the active graph or its durability status.

## 46. Backup/Profile Independence

Backup export/import is independent of saved profiles. Backup V2 represents active recovery; Profile V2 represents reusable pattern activation. Neither format is used as the other's reader or writer.

## 47. Scheduling Non-Interference

Engine tests instantiate semantically identical authored state with different incarnation graphs and assert equivalent scheduling output. Scheduling generation does not branch on incarnation.

## 48. OccurrenceIdentity V1 Audit

`OccurrenceIdentity` remains version 1 and contains no source incarnation. It is explicitly a runtime semantic identity, not a durable lifetime-safe reference. No Task 2.31 change was made to it.

## 49. Source Lifetime Equality Contract

Two source observations represent the same lifetime only when source kind, scoped authored source ID, and incarnation match. Nested sources additionally depend on the parent cycle lifetime. Matching authored IDs alone are insufficient.

## 50. Collision Audit

Allocation validates every generated ID; active/backup validators reject duplicate incarnations anywhere in the graph. Tests cover invalid UUIDs and collisions.

## 51. Incarnation Rotation Audit

Rotation occurs on create, replace, delete/recreate, Active V1 migration, Profile activation, Profile V1 activation, and Backup V1 import. No other current path intentionally rotates identity.

## 52. Incarnation Preservation Audit

Preservation occurs on explicit update, Active V2 rehydrate, Backup V2 export/restore, runtime persistence failure/retry, and non-lifecycle scheduling operations.

## 53. Optional Incarnation Audit

No current runtime source has optional incarnation. Optional/unknown occurrences are confined to untrusted validation shapes and projection helpers. Pattern/profile/V1 models omit incarnation intentionally because they make no active-lifetime claim.

## 54. Allocator Audit

| Call site | Why allocation occurs | Correct? |
| --- | --- | ---: |
| Default/seeded store construction from pattern | establish runtime lifetimes | yes |
| Active V1 migration | establish forward baseline | yes |
| Setup transaction candidate | give new/replaced sources IDs before updates are preserved | yes |
| Manual create/replace | establish a new event lifetime | yes |
| Profile activation | instantiate reusable pattern | yes |
| Profile V1 activation | instantiate historical pattern | yes |
| Backup V1 import | no historical lifetime evidence | yes |
| Snapshot compatibility setters | whole supplied surface is treated as fresh | yes, non-interactive boundary |
| Active V2 rehydrate | no call | yes |
| Backup V2 restore/retry | no call | yes |

## 55. Source-Operation Audit

Interactive setup commits carry explicit create/update/delete/replace provenance. Validation requires complete operation coverage and rejects contradictory or missing provenance. Manual events use a dedicated explicit lifecycle mutation API.

## 56. Snapshot Setter Audit

Low-level `setShiftDefinitions`, `setShiftCycles`, `setBlockTemplates`, `setBlockRecurrences`, and `setManualEvents` accept non-incarnated pattern snapshots and intentionally establish fresh lifetimes for the replaced surface. Reference search found no production UI caller; the setup UI uses `commitAuthoredSetupTransaction`, and manual workflows use explicit mutation. These setters remain a compatibility/test seam and must not become an interactive update authority.

## 57. Protected-State Audit

Protected state retains the raw source and reason, blocks ordinary conflicting writes, and exposes explicit recovery operations. Active and profile protections are surface-specific.

## 58. Unknown-Version Audit

Unknown current-surface versions are protected/rejected. They are not coerced, normalized as V1, or passed through another surface's parser.

## 59. Migration Baseline Epistemic Audit

After Active V1 migration, DayFrame may claim continuity only from the newly allocated V2 baseline forward. It cannot truthfully claim the incarnations existed before migration.

## 60. Profile Epistemic Audit

A profile identifies reusable authored structure, not an active source lifetime. Even if source IDs match, each activation is a new lifetime graph.

## 61. Backup Epistemic Audit

Backup V1 supports content recovery without lifetime continuity. Backup V2 supports exact continuity because it carries and validates the complete incarnation graph.

## 62. DurableOccurrenceReference Readiness

**Ready for a separate implementation task.** All seven source kinds have mandatory current identity, lifecycle transitions are explicit, durable surfaces have unambiguous preservation/freshness semantics, historical epistemic limits are enforced, and scheduling/OccurrenceIdentity remain separated. The future reference must include versioning, source kind, scoped source identity, incarnation, and parent lifetime information for nested sources.

## 63. Architectural Alignment Assessment

The implementation aligns with the source-incarnation ADR and durable-data versioning policy: current writers are V2-only, historical readers are retained, migration is non-destructive until verified, profiles instantiate rather than preserve, backups distinguish V1 recovery from V2 continuity, and protected ingress prevents lossy fallback.

## 64. Correctness Defects, if any

None found.

## 65. Required Corrective Work, if any

None required before checkpoint publication.

## 66. Checkpoint Determination

Published. All required evidence and full validation support a clean checkpoint.

## 67. Checkpoint Artifact

`docs/checkpoints/CHECKPOINT_Phase_2_Cross_Surface_Source_Incarnation_Semantics.md`

## 68. Governance Updates

The dedicated checkpoint is the only governance update. No architecture/current-state/changelog file required a status edit for this audit.

## 69. Recommended Next Task

Define the versioned `DurableOccurrenceReference` contract at the durable-reference seam, using the accepted source lifetime equality/scoping rules without changing `OccurrenceIdentity` V1 or plan-decision behavior.

## 70. Deviations

None. No production implementation, new architecture, durable format, storage key, scheduling behavior, or occurrence identity was changed. No investigation-only test was necessary because required invariants already had direct executable coverage.

## 71. Discoveries and Deferred Work

- The low-level snapshot setters remain callable and intentionally rotate a whole supplied surface; they should remain outside production interactive workflows.
- `OccurrenceIdentity` V1 is not durable and must not be persisted as if it proved source lifetime.
- The exact durable-reference schema, resolution behavior, stale-reference result semantics, and PlanDecision integration remain deferred.

### Protected-Recovery Matrix

| Surface | Protected condition | Ordinary writes blocked? | Explicit recovery | Source recheck? |
| --- | --- | ---: | --- | ---: |
| Active | corrupt/invalid/unsupported V2 or failed V1 migration | yes | replace or abandon | yes |
| Profiles | corrupt/invalid/unsupported V2 or failed V1 migration | yes | replace or abandon | yes |
| Profile entry | semantically invalid entry | entry quarantined | remove/replace through profile recovery | yes at protected boundary |
| Backup | invalid import artifact | import rejected; active writes unaffected | retry with valid artifact | validation on every attempt |

### Epistemic Claim Matrix

| Operation/artifact | What DayFrame may truthfully claim about lifetime |
| --- | --- |
| Active V2 | exact current source lifetimes |
| Active V1 migration | new V2 baseline from migration onward only |
| Profile V2 | reusable structure; no active lifetime claim |
| Profile activation | all newly instantiated lifetimes |
| Backup V1 | recovered structure with fresh lifetimes |
| Backup V2 | exact exported source lifetimes |
| Persistence retry | same accepted runtime lifetime graph |
| Matching source ID alone | no lifetime equality claim |

## 72. Validation

Final validation on 2026-08-20:

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test` — passed: 31 test files, 540 tests.
- `npm run build` — passed: TypeScript check and Vite production build; 48 modules transformed.
- `git diff --check` — passed.

## 73. Final Completion Determination

**Complete.** DayFrame now has an evidence-backed audit confirming coherent source-incarnation semantics across creation, update, replacement, deletion/recreation, migration, rehydration, profiles, backups, failure/retry, clear, protected recovery, and all seven source kinds. Current readers, writers, validators, allocation sites, scheduling neutrality, and `OccurrenceIdentity` V1 separation were audited; DurableOccurrenceReference readiness was affirmatively determined; the checkpoint was published; full validation passed; and no unauthorized architecture or behavior was introduced.
