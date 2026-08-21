# Task 2.27A Result — Complete Active V2 Runtime Identity and Migration Contract Validation

## 1. Executive Result

Complete. Active V2 now has a statically mandatory, runtime-complete source-incarnation boundary; detailed migration outcomes and durability initialization are implemented; obsolete V1-era tests were deliberately converted; focused and complete repository validation pass.

## 2. Parent Task Completion Determination

Task 2.27 may now be accepted as complete without qualification. Task 2.27A preserves the historical fact that Task 2.27 originally ended `Not complete` and closes the recorded gaps.

## 3. Artifact Integrity

The supplied and saved Task 2.27A artifacts are byte-identical: 1,736 lines, 44,381 bytes, SHA-256 `6999a3893f9b3b195bfc46c4514efe91230bb730e4625cf1f6113f4e40e57ede`. A final `cmp` returned 0 and the hash remained unchanged. The Task 2.27 result was verified to contain its explicit `Not complete` determination.

## 4. Governing Evidence

Implementation followed Tasks 2.24–2.27, the Task 2.26 ADR, the incomplete Task 2.27 result, and existing Phase 1 durability/recovery semantics. No contradiction was found.

## 5. Initial Full-Suite Reproduction

Initial `npm test`: 29 files, 485 tests; 455 passed and 30 failed across `dayFrameStore.test.ts` (28) and `DayFrameApp.test.tsx` (2).

## 6. Initial Failure Classification

All 30 inherited failures were Task 2.27 expectation drift: 11 obsolete Active V1 key/payload assertions, 8 incarnation-free runtime equality assertions, 5 obsolete storage call-count assertions, 4 failure-injection mocks targeting the retired V1 key, and 2 V2-authority scenario/assertion issues. No unrelated failure was found.

### Initial Failure Disposition Matrix

| Failing test | Initial cause | Corrective action | Final status |
|---|---|---|---|
| singular-only cycle rewrite | V1 key expectation | assert V2 data and retained V1 | passed |
| stores manual events/profile | incarnation-free runtime | compare active identity and Profile V1 projection separately | passed |
| migrates legacy manual timestamps | incarnation-free runtime | compare projected legacy pattern | passed |
| stores authored scheduling data | V1 payload expectation | assert Active V2 data | passed |
| complete authored commit | V1 key/call count | assert V2 key, marker, and no V1 write | passed |
| repeating sequence persistence | V1 payload expectation | assert V2 data/nested identity | passed |
| singular-only Backup V1 import | incarnation-free runtime/V1 key | assert fresh runtime identity and V2 | passed |
| backup import clears Preview | V1 payload expectation | assert V2 data | passed |
| profile save/load/delete | incarnation-free runtime | distinguish runtime from Profile V1 | passed |
| singular-only Profile V1 load | incarnation-free runtime/V1 key | assert fresh runtime identity and V2 | passed |
| SuggestedFix persistence | V1 payload expectation | assert current V2 graph | passed |
| persistence helper success | V1 key expectation | assert V2 key | passed |
| profile-load active failure | failure mock targeted V1 | target V2 writer | passed |
| accessor-failure setup/manual semantics | incarnation-free runtime | compare authored projection | passed |
| retry latest active snapshot | obsolete call count | assert V2 and marker keys | passed |
| retry unavailable active snapshot | obsolete call count | assert V2 target | passed |
| retry active absence | obsolete removal count | assert both active keys and marker | passed |
| retained durability convergence/failure | failure mock targeted V1 | target V2 writer | passed |
| profile/backup active durability | failure mock targeted V1 | target V2 writer | passed |
| absence replaced by snapshot intent | failure mock targeted V1 | target V2 writer | passed |
| valid/advisory historical ingress | incarnation-free runtime/V2 precedence | project runtime and isolate migration scenarios | passed |
| recovery exact-byte preservation | incarnation-free runtime | compare projected historical pattern | passed |
| protected replacement | obsolete call count/V1 payload | assert verified V2 replacement | passed |
| protected abandonment | obsolete removal count | assert both keys and marker | passed |
| profile-prepared recovery promotion | V1 payload parse | read V2 envelope | passed |
| backup-prepared recovery promotion | V1 payload parse | read V2 envelope | passed |
| advisory Profile V1 load | incarnation-free runtime | compare pattern projection | passed |
| advisory Backup V1 import | incarnation-free runtime | compare pattern projection | passed |
| UI preserves seven V1 fields | expected no migration write | assert V2 migration and unchanged V1 | passed |
| UI preserves empty V1 collections | expected no migration write | assert V2 migration and unchanged emptiness | passed |

## 7. Files Changed

Task 2.27A changed `code/src/state/types.ts`, `dayFrameStore.ts`, `createInitialDayFrameState.ts`, `dayFrameBackup.test.ts`, `state/tests/dayFrameStore.test.ts`, `ui/tests/DayFrameApp.test.tsx`, and added `state/sourceIncarnationLifecycle.test.ts` plus `core/engine/tests/sourceIncarnationNonInterference.test.ts`. It completed and extended the Task 2.27 files `activeV2.ts`, `activeV2.test.ts`, and `activeV2Migration.test.ts`. Other dirty-worktree files predated this completion task and were preserved.

## 8. Mandatory Runtime Type Boundary

`RuntimeIncarnation` is now `IncarnatedSource`, not `Partial<IncarnatedSource>`. All seven active source aliases require branded `SourceIncarnationId` at compile time.

## 9. Legacy DTO Boundary

`DayFrameAuthoredPattern`, `PersistedDayFrameState`, Profile V1 data, and Backup V1 data use incarnation-free core source types. Store initialization accepts an explicit legacy/pattern input and instantiates active authority.

## 10. Fixture Migration

Current-runtime fixtures now enter through store instantiation or deterministic active builders. Historical validator/backup fixtures use `DayFrameAuthoredPattern` rather than weakening runtime types.

## 11. UUID Test Strategy

Tests use deterministic canonical lowercase UUID-v4 values with stable incrementing suffixes. Production validation was not weakened.

## 12. Runtime Completeness Invariant

Startup, V1 migration, V2 rehydration, Setup commit, snapshot setters, manual lifecycle operations, profile activation, backup import, recovery replacement, injected state, and defaults all produce complete validated active graphs.

## 13. Lifecycle Operation Integration

Setup transaction provenance remains authoritative. Update copies exact prior incarnation; create/replace use newly allocated candidate incarnation; delete removes authority. Snapshot setters are explicitly treated as fresh instantiation boundaries.

## 14. Seven-Source Lifecycle Matrix

| Source kind | Create fresh | Update preserves | Delete/recreate fresh | Replace fresh | Reorder preserves |
|---|---:|---:|---:|---:|---:|
| Block template | yes | yes | yes | yes | N/A |
| Block recurrence | yes | yes | yes | yes | N/A |
| Manual event | yes | yes | yes | yes | N/A |
| Shift definition | yes | yes | yes | yes | N/A |
| Shift cycle | yes | yes | yes | yes | N/A |
| Shift segment | yes | yes | yes | yes | yes |
| Sequence entry | yes | yes | yes | yes | yes |

## 15. Nested Reorder Semantics

Nested identity is keyed by lifecycle reference (`kind`, parent ID, source ID), never array position; update/reorder preserves the prior incarnation.

## 16. Parent Recreation Semantics

Cycle replacement/recreation allocates a new parent lifetime and freshly instantiates its nested segment/sequence lifetimes, even when readable IDs are reused.

## 17. Manual-Event Matrix

Direct tests cover create, update, replace, delete, and same-ID recreation. A Setup transaction regression was fixed so it no longer rotates manual-event identity outside its authority.

## 18. Migration Success Durability

Verified V1→V2 migration and valid V2 rehydration initialize retained active durability to `durable`.

## 19. Desired Durable Condition

The desired active condition remains `snapshot`; retry targets the adopted incarnation-bearing V2 graph and never V1.

## 20. Migration Outcome Model

`ActiveMigrationFailureDetail` distinguishes parse, validation, allocation, construction, serialization, write, reread, reread-validation, and verification failures outside `DayFrameState`.

## 21. Migration Failure Detail

Ingress recovery status retains only the latest factual subtype; no exception objects or history are persisted.

## 22. Parse Failure

Malformed V1 remains protected as `corruptJson` with `parseFailure` detail.

## 23. V1 Validation Failure

Semantically invalid V1 remains protected with validation evidence and `validationFailure` detail.

## 24. Allocation Failure

No V2 marker/runtime adoption occurs; V1 remains unchanged and retry can construct a fresh candidate.

## 25. Serialization Failure

The injectable serializer seam directly proves `serializationFailure` without conflating storage failure.

## 26. Write Failure

V2 write failure yields `writeFailure`, no adoption, no success marker, and preserved V1.

## 27. Reread Failure

Post-write access failure protects uncertain V2 authority, blocks adoption, and records `rereadFailure`.

## 28. Reread Validation Failure

Malformed/invalid reread V2 is protected and classified `rereadValidationFailure`; V1 is not activated.

## 29. Verification Failure

A valid but changed reread graph is protected as `verificationFailure` and is not overwritten or adopted.

### Migration Failure Matrix

| Failure point | Runtime adopted? | V1 preserved? | V2 protected? | Failure subtype | Retry path |
|---|---:|---:|---:|---|---|
| V1 parse | no | yes | N/A | parseFailure | corrected source/restart |
| V1 validation | no | yes | N/A | validationFailure | recovery/replacement |
| allocation | no | yes | no partial V2 | allocationFailure | fresh startup attempt |
| construction | no | yes | no partial V2 | constructionFailure | corrected implementation/source |
| serialization | no | yes | no | serializationFailure | fresh startup attempt |
| write | no | yes | uncertain bytes guarded | writeFailure | recovery/restart |
| reread access | no | yes | yes | rereadFailure | protected recovery |
| reread validation | no | yes | yes | rereadValidationFailure | protected recovery |
| verification mismatch | no | yes | yes | verificationFailure | protected recovery |

## 30. Stable V2 Rehydration

A fresh store restores exact incarnation IDs, performs no allocation, does not remigrate V1, and reports durable accepted V2 authority.

## 31. V2-First Authority

Valid V2 outranks valid or malformed V1. Invalid or unsupported V2 is protected and never falls back to V1.

## 32. V2-Established Marker

`dayframe-active-v2-established=1` narrowly records that retained V1 is no longer eligible for automatic authority when V2 is intentionally absent.

## 33. V1 Resurrection Prevention

Migration→clear→restart and protected abandonment→restart remain empty; retained/historical V1 cannot remigrate.

## 34. Clear / Reset

Clear resets runtime, removes V2 and V1, establishes the marker, independently clears profiles, and retains coherent absence intent/durability.

## 35. Recovery Abandonment

Abandonment removes both active keys, establishes the marker, clears protected evidence, resets desired condition to absence, and survives restart.

## 36. Recovery Replacement

Replacement writes current incarnation-bearing V2, rereads and validates it, compares the accepted graph, and clears protection only after verification.

## 37. Recovery Source Recheck

Protected evidence retains its key. V1 recovery compares V1; V2 recovery compares V2. Irrelevant retained V1 mutations cannot invalidate V2 recovery.

## 38. Snapshot Isolation

Existing clone/result tests plus V2 tests protect store-owned IDs and nested data from returned snapshot mutation; active cloning preserves incarnation exactly.

## 39. Active V2 Persistence Shape

V2 contains only `{app,surface,version,data}` and incarnation-bearing authored data. It excludes Preview, profiles, durability, ingress, lifecycle records, and drafts.

## 40. Active V1 Writer Retirement

Production reference audit found no `setItem(DAYFRAME_STORAGE_KEY, …)`. V1 is read, preserved, or explicitly removed only.

## 41. Profile V1 Compatibility

Profile writes remain version 1 and use `projectActiveToPattern`; incarnation is intentionally absent.

## 42. Profile V1 Instantiation

Each activation validates the V1 pattern and allocates fresh active lifetimes; repeated activation does not fabricate continuity.

## 43. Backup V1 Compatibility

Backup export remains version 1, incarnation-free, and schema-compatible.

## 44. Backup V1 Instantiation

Import validates without mutating the artifact, instantiates fresh active lifetimes, and persists resulting current authority as V2.

## 45. Scheduling Non-Interference

Direct regression generates equivalent schedules from graphs differing only in incarnation and compares work blocks, candidates, placements, unplaced candidates, and friction.

## 46. OccurrenceIdentity Non-Interference

The same regression proves identical V1 occurrence identities, version 1, and no incarnation field.

## 47. Preview Preservation

The full UI/core suite preserves stale Preview, generation, friction, SuggestedFix, Try, and accepted-fix behavior.

## 48. Broad-Suite Failure Conversion

All 30 inherited failures have explicit dispositions in the matrix above; none were deleted or weakened to generic truthiness.

## 49. Storage Call-Count Conversion

Incidental one-key counts were replaced with assertions for V2 key writes, no V1 current writes, marker establishment, two-key removal, and profile independence.

## 50. Runtime Shape Conversion

Tests now explicitly compare active graphs when lifetime matters and `projectActiveToPattern` when historical/profile/backup pattern semantics matter.

## 51. Current Validator

Active V2 validation requires every incarnation and then applies authored semantic validation. Legacy pattern validation remains incarnation-free and separate.

## 52. Duplicate Incarnation Validation

Tests protect same-kind, cross-kind, and parent/nested global uniqueness; distinct graphs pass.

## 53. UUID Validation

Lowercase UUID v4 passes; uppercase, wrong-version, malformed, and empty values fail.

## 54. Ordinary V2 Persistence Failure

Existing durability tests prove runtime advances, desired V2 snapshot is retained, V1 is not written, retry targets V2, and success converges to durable.

## 55. Migration Versus Mutation Durability

Migration does not adopt before verified durability; ordinary current mutation remains session authority after a persistence failure.

## 56. Migration Retry

Failed candidates never become authoritative. A later eligible startup constructs a complete fresh candidate; protected uncertain V2 uses explicit recovery rather than silent overwrite.

## 57. Complete-Graph Validation

Representative tests contain all seven source kinds and call global active-graph validation after initialization, transaction, migration, and rehydration paths.

## 58. Profile / Backup Independence

Migration does not write profiles or backups, and active failure does not corrupt their independent surfaces.

## 59. Reference Audit

Audited incarnation symbols, V1/V2 keys, marker, serializers/readers, migration detail, source constructors, Setup/manual lifecycle paths, profile/backup adapters, clear, recovery, and retry. Optional incarnation handling remains only in raw validation/projection mechanics, not current runtime types.

## 60. Type Boundary Audit

| Representation | Incarnation required? | Purpose |
|---|---:|---|
| Current runtime | yes | active source lifetime authority |
| Active V1 DTO | no | legacy migration/recovery input |
| Active V2 DTO | yes | current durable authority |
| Profile V1 DTO | no | reusable authored pattern |
| Backup V1 DTO | no | portable authored pattern |

## 61. Persistence Writer Audit

| Surface | Current writer | Incarnation stored? | Current authority semantics |
|---|---|---:|---|
| Active V1 | none | no | eligible legacy material only |
| Active V2 | store active persistence | yes | current active durable authority |
| Profile V1 | profile persistence | no | reusable pattern collection |
| Backup V1 | export serializer | no | portable pattern artifact |
| established marker | store migration/clear/recovery | N/A | prevents V1 resurrection |

## 62. Architectural Alignment Assessment

The implementation now matches Tasks 2.24–2.27: lifetime identity is mandatory and operation-driven, Active V2 is authoritative, legacy surfaces remain explicit and incarnation-free, and scheduling/OccurrenceIdentity remain unchanged.

## 63. Deviations

None.

## 64. Discoveries and Deferred Work

The completion matrix exposed one real defect: Setup transactions rotated manual-event incarnation outside their lifecycle authority. It was fixed. Profile V2, Backup V2, durable references, PlanDecision, tombstones, and history remain deferred.

## 65. Recommended Next Task

Task 2.28: independently versioned Profile V2 reusable-pattern format and fresh-lifetime instantiation contract. Backup V2 and durable occurrence references remain later boundaries.

## 66. Focused Validation

Focused contract/store/UI runs passed, including `activeV2.test.ts`, `activeV2Migration.test.ts`, `sourceIncarnationLifecycle.test.ts`, `dayFrameStore.test.ts`, `DayFrameApp.test.tsx`, backup tests, and `sourceIncarnationNonInterference.test.ts`. The final suite totals incorporate these tests.

## 67. Full Validation

- `npm test`: 31 files passed, 503 tests passed, 0 failed.
- `npm run lint`: passed.
- `npm run typecheck`: passed with mandatory runtime incarnation.
- `npm run build`: passed; Vite transformed 48 modules.
- `git diff --check`: passed.
- Immutable artifact final comparison/hash: passed.

## 68. Final Completion Determination

**Complete.** Task 2.27A satisfies its final completion statement, and Task 2.27 can consequently be accepted as complete. No Profile V2, Backup V2, DurableOccurrenceReference, PlanDecision, scheduling redesign, or UI expansion was introduced.
