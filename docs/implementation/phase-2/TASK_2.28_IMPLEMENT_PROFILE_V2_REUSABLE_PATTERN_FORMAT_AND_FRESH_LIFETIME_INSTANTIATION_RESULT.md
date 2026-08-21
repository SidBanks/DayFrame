# Task 2.28 Result — Profile V2 Reusable Patterns and Fresh-Lifetime Instantiation

## 1. Executive Result

Completed. DayFrame now writes an independently versioned, incarnation-free Profile V2 collection and instantiates fresh active source lifetimes whenever a profile is loaded.

## 2. Artifact Integrity

The immutable task artifact was complete and ended with the required statement. SHA-256: `078f629442ac620194193bd6f98161cbc82bb9e231215464db2123037cef1d44` (50,957 bytes; 1,919 lines).

## 3. Governing Decisions

Profiles are reusable authored patterns, not active snapshots. Active V2, Profile V2, and Backup V1 remain independent durable formats.

## 4. Evidence Reviewed

Reviewed the task, Task 2.27A result, profile DTO/validation, store ingress/mutations, durability/retry, active projection/instantiation, UI consumers, tests, and durable-key references.

## 5. Current Profile V1 Inventory

The former authority was `dayframe-profiles-v1`, envelope version 1. It remains a historical reader/migration source only.

## 6. Files Changed

- `code/src/state/dayFrameProfiles.ts`
- `code/src/state/dayFrameProfiles.test.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/types.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- `code/src/ui/DayFrameApp.tsx`
- This result artifact

Earlier task changes in the worktree were preserved.

## 7. Profile V2 Version Contract

Profile V2 uses `app: "DayFrame"`, `surface: "profiles"`, and `version: 2`, independently of Active V2 and Backup V1.

## 8. Profile V2 Key / Authority Strategy

Current key: `dayframe-profiles-v2`. An establishment marker prevents V1 resurrection after clear/absence. Present V2 always has precedence.

## 9. Profile V2 DTO

The collection contains `profiles` and `quarantinedProfiles`. Valid records retain `id`, `name`, `savedAt`, and incarnation-free authored `data`.

## 10. Profile Pattern Boundary

`DayFrameAuthoredPattern` is the payload boundary. Active-only incarnations and preview are excluded.

## 11. Incarnation Exclusion

The writer projects active state to a pattern. V2 validation rejects incarnations on all lifetime-bearing source kinds, including nested cycle sources.

## 12. Profile Save Projection

Save uses the active-to-pattern projection and writes Profile V2 only.

## 13. Profile Save Semantics

Save changes the profile collection only; active authored values, active incarnations, and preview are preserved.

## 14. Profile Load Semantics

Load validates the pattern, creates a complete fresh active graph, clears preview, persists Active V2, notifies, and returns active persistence status.

## 15. Fresh-Lifetime Instantiation

Fresh incarnations are allocated for shift definitions, cycles, segments, sequence days, block templates, block recurrences, and manual events.

## 16. Repeated Activation

Repeated loads preserve authored IDs/relationships and allocate disjoint incarnation sets.

## 17. Same-Name Replacement

Same-name save preserves profile ID and position while replacing data and timestamp.

## 18. Profile Delete

Delete persists the complete V2 collection; deleting the last profile persists an authoritative empty collection.

## 19. Profile V1 Reader Preservation

V1 remains readable, including singular-only `shiftCycle` and historical active-like records containing incarnations.

## 20. V1→V2 Migration

Valid V1 records normalize to reusable patterns. Adoption occurs only after serialization, write, reread, validation, byte verification, and marker write.

## 21. Migration Ordering

Read V1 → convert/validate → serialize V2 → write → reread → validate → byte-verify → mark established → adopt.

## 22. Collection-Level Failure

Malformed JSON, invalid envelopes, duplicates, and unsupported versions protect the source and prevent partial adoption.

## 23. Entry-Level Invalidity

Invalid V1 entries do not invalidate valid siblings.

## 24. Invalid-Entry Preservation

Invalid entries are copied into `quarantinedProfiles` and retained by writes and retries.

## 25. Unsupported Version

A non-V2 version at the V2 key becomes recovery-required and cannot fall back to V1.

## 26. Profile V2 Validation

Validation checks envelope/version, arrays, unique IDs, metadata, plural cycle shape, incarnation exclusion, and pattern semantics.

## 27. Pattern Validation

The shared non-destructive authored-state validator remains authoritative.

## 28. Activation Validation

Patterns are validated again immediately before activation.

## 29. Allocation Failure

Returns `activationFailed`; active state, preview, subscribers, and durable active state remain unchanged.

## 30. Active Persistence Failure After Load

Instantiated runtime state remains authoritative and the returned outcome reports durability failure.

## 31. Profile Persistence Failure

Mutations retain existing serialization/storage/unavailable outcome semantics.

## 32. Profile Retry

Retry writes the complete Profile V2 snapshot including quarantine. Protected ingress is not overwritten.

## 33. Profile V1 Writer Retirement

No current save, delete, or retry writes V1.

## 34. V1 Resurrection Prevention

The establishment marker blocks fallback when V2 is intentionally absent; clear removes both keys.

## 35. Empty Collection Authority

Empty Profile V2 is valid authority and cannot resurrect V1.

## 36. Clear / Reset Interaction

Clear removes V2 and V1, establishes current-format absence, and clears quarantine/status.

## 37. V2 Authority Precedence

When V2 exists, V1 is never consulted.

## 38. Invalid V2 No-Fallback

Invalid V2 is recovery-required; a valid V1 sibling is not adopted.

## 39. Migration Durability

Migration succeeds only after durable reread validation and exact serialization verification.

## 40. Migration Failure Classification

Failures distinguish serialization, write, reread, reread validation, and verification.

## 41. Active/Profile Independence

Migration/save/delete/retry do not mutate active state. Activation intentionally replaces it.

## 42. `savedProfiles` Runtime Model

It remains the valid session pattern collection; ingress recovery status and quarantined raw entries remain store infrastructure state.

## 43. Profile Cloning

Profile collection and payload clones remain isolated.

## 44. Manual Events

Authored values/IDs persist; fresh manual-event incarnations are allocated on load.

## 45. Nested Source Patterns

Segment and sequence-day IDs/relationships persist without incarnations.

## 46. Preview Behavior

Save preserves preview; successful load clears it; failed activation preserves it.

## 47. Setup Draft Behavior

No setup-draft contract changed.

## 48. Profile/Backup Separation

Backup remains V1 and has no Profile V2 migration role.

## 49. Legacy Singular `shiftCycle`

V1 normalizes singular to plural; V2 requires plural.

## 50. Profile ID Semantics

Migration/activation preserve profile and source IDs; new IDs retain existing allocation.

## 51. Collection Ordering

Migration, retry, and replacement preserve ordering.

## 52. Timestamp Semantics

`savedAt` is preserved on migration and changes only on explicit save.

## 53. Epistemic Boundary

Only verified bytes become migrated authority; uncertainty remains recovery-required.

## 54. Activation Atomicity

Validation and full allocation precede commit/notification.

## 55. Save/Delete Atomicity

Existing runtime-first semantics remain, with complete desired collection and durability retained independently.

## 56. Desired Durable Condition

Save/delete select snapshot; clear selects absence; retry uses retained intent.

## 57. Profile Durability Subscription

The existing subscription is unchanged and reports V2 outcomes.

## 58. Tests Added or Updated

Covered V2 validation, incarnation rejection, quarantine, migration success/all failures, precedence, anti-resurrection, seven-kind activation, current-key failures/retry, and UI V1 rehydration.

## 59. Persistence Shape

New writes contain V2 metadata, reusable patterns, and quarantine; no preview or source incarnations.

## 60. Writer Audit

Current persistence uses only the V2 creator/key. V1 remains in reader/clear/tests and explicit compatibility utilities.

## 61. Type Boundary Audit

Added V2 DTO/conversion, profile ingress status, and activation-failure result. Pattern types remain incarnation-free.

## 62. Durable Surface Audit

See Matrix D.

## 63. Scheduling Non-Interference

No scheduling production code changed for this task; the complete suite remains green.

## 64. OccurrenceIdentity Preservation

Occurrence identity derivation is unchanged; fresh incarnations yield lifetime-safe identities after load.

## 65. Architectural Alignment Assessment

Aligned: profile meaning is explicit, versioned, incarnation-free, migration-safe, and separate from active authority.

## 66. Deviations

None. A store profile-ingress accessor/status is the smallest boundary needed to test protected outcomes; no recovery UI was added.

## 67. Discoveries and Deferred Work

User-facing inspection/export/removal of quarantined entries remains deferred.

## 68. Recommended Next Task

Define explicit recovery actions for protected/quarantined Profile V2 ingress without changing reusable-pattern semantics.

## 69. Focused Validation

`npm test -- --run src/state/dayFrameProfiles.test.ts src/state/tests/dayFrameStore.test.ts src/ui/tests/DayFrameApp.test.tsx`: 3 files, 247 tests passed.

## 70. Full Validation

Completed-tree results: lint, typecheck, full tests, build, and `git diff --check` pass; exact final counts are 31 files and 515 tests.

## 71. Final Completion Determination

Complete. V2 is the sole current writer/authority, V1 migration is verified and non-destructive, fresh lifetime identity is atomic on every load, and compatibility/durability behavior is protected.

## Matrix A — Profile Version Matrix

| Format | Current reader | Current writer | Incarnation stored? | Meaning |
| --- | ---: | ---: | ---: | --- |
| Profile V1 | Yes | No | Historical/mixed | Compatibility/migration source |
| Profile V2 | Yes | Yes | No | Current reusable-pattern authority |

## Matrix B — Activation Matrix

| Source kind | Pattern ID preserved? | Fresh active incarnation? | Relationship preserved? |
| --- | ---: | ---: | ---: |
| Shift definition | Yes | Yes | Yes |
| Shift cycle | Yes | Yes | Yes |
| Shift segment | Yes | Yes | Yes |
| Sequence day | Yes | Yes | Yes |
| Block template | Yes | Yes | Yes |
| Block recurrence | Yes | Yes | Yes |
| Manual event | Yes | Yes | Yes |

## Matrix C — Migration Failure Matrix

| Failure | V1 preserved? | V2 adopted? | Profile runtime changed? | Status |
| --- | ---: | ---: | ---: | --- |
| Serialization | Yes | No | No | `serializationFailure` |
| Write | Yes | No | No | `writeFailure` |
| Reread | Yes | No | No | `rereadFailure` |
| Reread validation | Yes | No | No | `rereadValidationFailure` |
| Byte verification | Yes | No | No | `verificationFailure` |

## Matrix D — Durable Surface Matrix

| Surface | Version | Incarnation? | Semantics |
| --- | ---: | ---: | --- |
| Active V2 | 2 | Yes | Active lifetime checkpoint |
| Profile V1 | 1 | Historical/mixed | Legacy input |
| Profile V2 | 2 | No | Reusable patterns |
| Backup V1 | 1 | No | Portable authored setup |

## Matrix E — Operation Independence Matrix

| Operation | Active authored state changes? | Active incarnation changes? | Profile collection changes? | Preview changes? |
| --- | ---: | ---: | ---: | ---: |
| Save profile | No | No | Yes | No |
| Load profile | Yes | Yes, all fresh | No | Cleared |
| Delete profile | No | No | Yes | No |
| Profile migration | No | No | Durable format only | No |
| Profile retry | No | No | No | No |
