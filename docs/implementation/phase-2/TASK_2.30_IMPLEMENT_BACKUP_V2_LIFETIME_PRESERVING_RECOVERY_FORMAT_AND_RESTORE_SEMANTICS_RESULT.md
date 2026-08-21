# Task 2.30 Result — Backup V2 Lifetime-Preserving Recovery

## 1. Executive Result

Completed. Current exports now emit independently versioned Backup V2 artifacts that preserve and restore exact active source lifetimes; Backup V1 remains a fresh-lifetime compatibility input.

## 2. Artifact Integrity

The supplied artifact and saved project copy (with the pre-existing `MPLEMENT` filename typo) are byte-identical. SHA-256: `29016209d674d4456bbabdfc64d33aac850938d127571d1e6eca451c4672e733` (43,396 bytes; 1,836 lines). The required final statement was present. Tasks 2.27, 2.27A, 2.28, and 2.29 have completed result artifacts.

## 3. Governing Decisions

Active V2 rehydrates the same lifetime, Profile V2 instantiates fresh lifetimes, Backup V1 instantiates fresh lifetimes, and Backup V2 restores the exact backed-up lifetime graph.

## 4. Evidence Reviewed

Reviewed the full task, source-incarnation ADR/result artifacts, Active/Profile V2 implementations, Backup V1 DTO/parser/import/UI, active recovery, durability/retry, scheduling, occurrence identity, and tests.

## 5. Current Backup V1 Inventory

Backup V1 was `app/version/exportedAt/data`, incarnation-free, plural-or-legacy-singular compatible, and the sole production writer. Import normalized it, allocated fresh lifetimes, cleared Preview, preserved profiles, and persisted Active V2.

## 6. Files Changed

- `code/src/state/dayFrameBackup.ts`
- `code/src/state/dayFrameBackup.test.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/types.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- This result artifact

Earlier worktree changes were preserved.

## 7. Backup Semantic Definition

Backup V2 is a portable recovery checkpoint of complete active authored authority and source-lifetime identity—not a profile, Preview, history, or decision log.

## 8. Backup V2 Version Contract

Envelope: `app: "DayFrame"`, `surface: "backup"`, `version: 2`, `exportedAt`, and incarnation-bearing `data`. No local-storage backup key was introduced.

## 9. Backup V2 DTO

`DayFrameBackupV2` is distinct from Active V2, Profile V2, and Backup V1 while reusing the governed active authored graph type.

## 10. Backup Metadata

Only application identity, backup surface/version, and informational export timestamp are included.

## 11. Incarnation Inclusion

Exact incarnation is mandatory for shift definitions, cycles, segments, sequence entries, block templates, block recurrences, and manual events.

## 12. Nested Lifetime Preservation

Cycle, segment, and sequence-entry incarnations roundtrip exactly.

## 13. Export Projection

Production export clones the complete active authored graph directly into Backup V2. It does not use the incarnation-stripping profile/pattern projection.

## 14. Export Purity

Export performs no mutation, persistence, incarnation rotation, Preview/profile change, durability change, or notification.

## 15. Backup V2 Validation

Validation enforces backup surface/version, timestamp/data, plural cycles, canonical lowercase UUID-v4 incarnations, global uniqueness, authored semantics, references, IDs, and nested graph integrity. Missing/malformed/duplicate incarnations are rejected without repair.

## 16. Backup V1 Reader Preservation

V1 parsing/normalization remains, including singular `shiftCycle`, manual events, preview range, and preferences.

## 17. Backup V1 Writer Retirement

The store/UI production export calls `createDayFrameBackupV2`. The historical `createDayFrameBackup`/V1 creator remains only as an explicit compatibility/fixture utility.

## 18. Backup V1 Import Semantics

V1 is validated as an incarnation-free pattern and atomically instantiated through the allocator. Repeated imports produce disjoint lifetime sets.

## 19. Backup V2 Restore Semantics

V2 validates, clones exact IDs/incarnations, atomically replaces all active authored fields, clears Preview, preserves profiles/quarantine, and persists the same graph through Active V2.

## 20. Same-Lifetime Restoration

Direct tests prove every incarnation before export equals every incarnation after restore.

## 21. Complete-Graph Preservation

A representative graph exercises all seven lifetime-bearing source kinds and nested relationships.

## 22. Repeated V2 Restore

Restoring the same artifact repeatedly restores the same incarnation set each time.

## 23. Restore / Import Terminology

Results distinguish `restored` for V2 and `instantiatedFromLegacy` for V1. UI feedback states the semantic difference without exposing IDs.

## 24. Restore Atomicity

Dispatch, envelope validation, incarnation validation, authored validation, and complete cloning/instantiation precede session replacement. Rejection preserves active state, Preview, profiles, durability, and storage.

## 25. Session Authority

After valid acceptance, the restored/instantiated runtime graph is session authority even if Active V2 persistence fails.

## 26. Active Persistence Integration

Accepted imports select active snapshot intent and use the existing Active V2 writer. No Active V1 write occurs.

## 27. Durability Outcome

Success results contain the active persistence outcome; store durability tracks Active V2, not the user’s file.

## 28. Profile Independence

Saved profiles, Profile V2 storage, quarantine, profile ingress, and profile durability are untouched. Direct tests preserve valid profiles and raw quarantine.

## 29. Preview Semantics

Successful V1/V2 replacement clears Preview; rejected input leaves it unchanged.

## 30. Setup Draft Semantics

Existing store notification rebuilds the Setup draft after success. Unsaved draft is not part of the artifact.

## 31. Protected Active Ingress Assessment

Adopted defensible model B: backup import/restore is rejected with `activeLocalRecovery` until the existing protected-active workflow is explicitly resolved. This prevents the prior behavior where runtime changed while durable replacement was blocked.

## 32. Source-Recheck Integration

Not required because backup restore does not replace protected Active V2. Existing protected-source replacement retains its governed recheck action.

## 33. Legacy Singular `shiftCycle`

Backup V1 singular input remains normalized to plural runtime and persisted as Active V2 with fresh lifetime identity.

## 34. Plural-Only V2 Contract

Backup V2 validation rejects singular `shiftCycle`; the writer emits `shiftCycles` only.

## 35. Unsupported Version

Unknown versions return `rejected/unsupportedVersion` and cannot fall back to V1.

## 36. Corrupt Backup

Malformed JSON is classified as `parseFailure`; no store action occurs.

## 37. Failure Categories

Categories: parse, unsupported version, envelope, authored semantics, incarnation, V1 allocation, and protected active ingress.

## 38. Global Incarnation Uniqueness

Shared active-graph validation rejects same-kind, cross-kind, parent/nested, and nested duplicates.

## 39. Source Relationship Validation

Shared authored validation rejects broken recurrence/template, cycle/shift, duplicate readable-ID, and nested-scope relationships.

## 40. Backup Provenance

`exportedAt` is informational only and does not participate in lifetime identity.

## 41. Serializer Boundary

UI serializes the dedicated V2 DTO. It never serializes `DayFrameState` wholesale.

## 42. Clone / Input Isolation

Export, parse/validate, and restore clone their graphs. Mutating exported or imported caller objects cannot mutate either store.

## 43. Backup Result Types

Success is `restored` or `instantiatedFromLegacy` with state, advisories, and persistence. Expected failures are returned as `rejected` with a concise reason.

## 44. V1/V2 Dispatch

Dispatch occurs by version before semantics: V1 normalize/instantiate; V2 validate/restore; unknown reject.

## 45. No Automatic Backup Migration

V1 files are never rewritten. A later user export naturally creates V2 from current active authority.

## 46. Cross-Surface Envelope Validation

Active V2 and Profile V2 envelopes are rejected as backups. Surface identity is mandatory.

## 47. Infrastructure Exclusion

Backup V2 excludes Preview, saved profiles, quarantine, durability/ingress/desired-condition data, markers, lifecycle operations, tombstones, and history.

## 48. Scheduling Non-Interference

Direct export/restore/regenerate coverage proves identical scheduling output for identical generation inputs.

## 49. OccurrenceIdentity Preservation

Roundtrip preview output is identical and contains no `incarnationId`; OccurrenceIdentity V1 was not modified.

## 50. Lifetime Equality Roundtrip

Exact seven-kind incarnation arrays match before export, after first restore, after repeated restore, and after Active V2 retry.

## 51. Pattern Equality Roundtrip

Readable IDs, relationships, scheduling preferences/range, and authored values roundtrip exactly.

## 52. Saved-Profile Preservation

Valid profiles and quarantine survive V2 restore unchanged and are not embedded in the file.

## 53. Backup UI

Existing accessible export/file-input workflow now exports V2 and accepts V1/V2. Filename convention remains `dayframe-backup-YYYY-MM-DD.json`.

## 54. Import/Restore Feedback

UI distinguishes exact-lifetime V2 restore, fresh-lifetime legacy import, unsupported version, validation failure, protected active ingress, and active durability failure.

## 55. Active Persistence Failure After Restore

Direct test proves restored exact lifetimes remain runtime authority, Preview is cleared, durability reports storage failure, and no rollback occurs.

## 56. Active Retry After Restore

Retry writes the exact restored graph and does not allocate or emit Active V1.

## 57. V1 Allocation Failure

Direct test injects allocator failure and proves rejection before state mutation or persistence.

## 58. V2 No-Allocation Restore

Direct test injects an always-throwing allocator; valid V2 restore succeeds.

## 59. Tests Added or Updated

Updated legacy expectations and added V2 DTO/export, exact/repeated seven-kind restore, invalid incarnation, cross-surface/unknown rejection, clone isolation, profile/quarantine independence, protected ingress, V1 repeated/allocation failure, Active V2 failure/retry, UI V2 export/restore feedback, and scheduling/identity roundtrip tests.

## 60. Writer Audit

Production backup export: V2 only. Restore persistence: Active V2 only. Profile writer/recovery: unchanged. Backup V1: reader/fixture creator only.

## 61. Type Boundary Audit

| Representation | Incarnation required? | Meaning |
| --- | ---: | --- |
| Active runtime | Yes | Current lifetime authority |
| Active V2 | Yes | Local durable authority |
| Profile V2 | No | Reusable pattern |
| Backup V1 | No | Legacy portable pattern |
| Backup V2 | Yes | Lifetime-preserving recovery checkpoint |

## 62. Cross-Surface Semantics Audit

See Matrix B. No envelope is accepted under another surface’s meaning.

## 63. Architectural Alignment Assessment

Aligned. Backup V2 can truthfully claim lifetime continuity because it records and validates incarnation; Backup V1 cannot and continues to instantiate.

## 64. Deviations

No scope deviation. Protected Active ingress uses model B rather than adding a new backup-specific recovery action.

## 65. Discoveries and Deferred Work

No file-size limit was added because current browser `File.text()` and JSON parsing are already the bounded existing mechanism; broader resource governance lacks a product requirement. Backup management/encryption/history remain deferred.

## 66. Recommended Next Task

Task 2.31 — Audit and Checkpoint Cross-Surface Source-Incarnation Semantics.

## 67. Focused Validation

Backup DTO/store/UI focused run passed 3 files and 265 tests before final additions; all final additions are included in the full 540-test pass.

## 68. Full Validation

`npm run lint`, `npm run typecheck`, `npm test -- --run`, `npm run build`, and `git diff --check` pass. Full suite: 31 files, 540 tests.

## 69. Final Completion Determination

Complete. Backup V2 is the current exact-lifetime recovery artifact; V1 remains fresh-lifetime compatibility input; restore is atomic, clone-safe, profile-independent, durability-aware, and scheduling-neutral.

## Matrix A — Backup Version Matrix

| Version | Incarnation? | Reader | Writer | Semantics |
| --- | ---: | ---: | ---: | --- |
| V1 | No | Yes | No | Instantiate fresh active lifetimes |
| V2 | Yes | Yes | Yes | Restore exact active lifetimes |

## Matrix B — Cross-Surface Lifetime Matrix

| Surface | Incarnation? | Use | Lifetime behavior |
| --- | ---: | --- | --- |
| Active V2 | Yes | Local checkpoint | Rehydrate same lifetimes |
| Profile V2 | No | Reusable pattern | Instantiate fresh lifetimes |
| Backup V1 | No | Legacy portable input | Instantiate fresh lifetimes |
| Backup V2 | Yes | Recovery file | Restore same lifetimes |

## Matrix C — Restore Failure Matrix

| Failure | Active state mutated? | Preview changed? | Profiles changed? | Persistence attempted? |
| --- | ---: | ---: | ---: | ---: |
| Parse | No | No | No | No |
| Unsupported version | No | No | No | No |
| Envelope/authored/incarnation validation | No | No | No | No |
| V1 allocation | No | No | No | No |
| Protected active ingress | No | No | No | No |
| V2 Active write | Yes, restored | Cleared | No | Yes, failed/retryable |

## Matrix D — Source Lifetime Matrix

| Source kind | Backup V2 stores incarnation? | Restore exact? | Backup V1 allocates fresh? |
| --- | ---: | ---: | ---: |
| Shift definition | Yes | Yes | Yes |
| Shift cycle | Yes | Yes | Yes |
| Shift segment | Yes | Yes | Yes |
| Sequence entry | Yes | Yes | Yes |
| Block template | Yes | Yes | Yes |
| Block recurrence | Yes | Yes | Yes |
| Manual event | Yes | Yes | Yes |

## Matrix E — Operation Matrix

| Operation | Active state | Incarnation | Preview | Profiles |
| --- | --- | --- | --- | --- |
| Export V2 | Unchanged | Unchanged | Unchanged | Unchanged |
| Import V1 | Replaced | Fresh | Cleared | Preserved |
| Restore V2 | Replaced | Preserved from file | Cleared | Preserved |
| Rejected import | Unchanged | Unchanged | Unchanged | Unchanged |
