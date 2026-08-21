# Task 2.17 — Non-Destructive Profile and Backup Ingress Validation — Result

## 1. Executive Result

Completed. Selected normalized profiles and normalized backups now pass through the shared authored-snapshot validator before they may replace current runtime authority. Valid and advisory-only sources retain existing activation and persistence behavior; blocking semantic failures return `recoveryRequired` without state, Preview, persistence, durability, desired-condition, or subscriber effects.

## 2. Artifact Integrity

The supplied task artifact and saved project copy were byte-identical before implementation. Both were 32,512 bytes / 1,346 lines with SHA-256 `41f02df3fc905f3b8fe6190f4c92973ab52c6be6f8fce5a96483b077279c0c0b`. The immutable specification was not modified.

## 3. Implementation Completed

Added explicit profile-load and backup-import unions, shared-validator gates immediately before activation, advisory propagation, atomic rejection, production caller branching, minimal workflow feedback, and direct regression coverage.

## 4. Files Changed

Task-specific files:

- `code/src/state/types.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- this result artifact

Earlier cumulative Phase 2 worktree changes were preserved.

## 5. Shared Validator Reuse

Both ingress paths call the existing pure `validateDayFrameAuthoredSetup`. No second validator or divergent historical validity definition was introduced.

## 6. Profile Validation Placement

`loadProfile` selects the already compatibility-normalized profile, clones its complete authored setup, validates that clone, and only then performs active replacement. Obsolete raw singular shapes remain normalized by the existing profile reader before this gate.

## 7. Backup Validation Placement

Backup parsing, app/version/envelope checks, structural checks, and compatibility normalization remain first. `importBackup` validates the normalized cloned authored setup immediately before replacement.

## 8. Ingress Semantic Classification

The smallest useful classification is represented directly by surface results: accepted profile data is `loaded`, accepted backup data is `imported`, and blocking semantic failure is `recoveryRequired`. Loaded/imported results carry advisories. Recovery-required results carry the invalid validator result. No broad active-local ingress framework was added.

## 9. Profile Load Result Contract

`ProfileLoadResult` is:

- `{ status: "loaded", state, persistence, advisories }`; or
- `{ status: "recoveryRequired", reason: "invalidAuthoredState", validation }`.

The existing missing-profile `RangeError` remains unchanged to avoid unrelated API redesign.

## 10. Profile Valid Load Semantics

A valid profile still replaces all seven authored fields, preserves saved profiles, clears Preview, retains active snapshot intent, attempts active persistence, updates active durability, notifies once, and returns cloned state plus persistence. The only additions are the `loaded` discriminant and advisory collection.

## 11. Profile Recovery-Required Semantics

Blocking profile validation returns before assignment, Preview clearing, desired-intent retention, persistence, durability updates, or notification. Current authority and the selected profile remain unchanged. The result has no fake persistence outcome.

## 12. Profile Advisory Semantics

Advisory-only profiles load normally. Tests cover `perShiftSegment`, prove the recurrence remains unchanged, and assert the returned `unsupportedRecurrenceFrequency` advisory.

## 13. Profile Persistence-Failure Separation

Valid activation followed by `unavailable`, `storageFailure`, or `serializationFailure` remains `status: "loaded"`; runtime authority changes for the session and the persistence outcome continues through existing durability semantics. Existing active-storage-failure tests were migrated to narrow the loaded result explicitly.

## 14. Profile Source Preservation

Semantic rejection does not delete, rewrite, normalize back into storage, filter, or replace the selected runtime profile. Store tests assert the profile collection remains equal to its pre-load value.

## 15. Profile Collection Preservation

For semantic-invalid profiles that survive current collection parsing, selection rejection preserves the entire in-memory collection. One profile's semantic failure does not mutate other profiles. Profile save and delete behavior remains unchanged; deletion remains explicitly available.

## 16. Profile Raw-Record Limitation

Current upstream `validateDayFrameProfilesStorage` filters records lacking string `id`/`name`/`savedAt` or object `data`, and `loadPersistedProfiles` collapses parse, envelope/version, normalization, or cloning exceptions to an empty collection. Task 2.17 cannot preserve or select records already discarded there without the prohibited raw-profile-collection redesign. Semantic-invalid but structurally/clonably accepted profiles do survive and are now rejected non-destructively. A later raw collection preservation task remains required.

## 17. Backup Import Result Contract

`BackupImportResult` is:

- `{ status: "imported", state, persistence, advisories }`; or
- `{ status: "recoveryRequired", reason: "invalidAuthoredState", validation }`.

Existing parser/version/structure failures remain typed thrown errors and are not mislabeled as semantic recovery results.

## 18. Backup Valid Import Semantics

A valid backup still replaces all seven authored fields, preserves profiles, clears Preview, retains active snapshot intent, persists, updates durability, notifies once, and returns cloned state/persistence. It now returns the `imported` discriminant and advisories.

## 19. Backup Recovery-Required Semantics

Blocking validation returns before any runtime or infrastructure mutation. Tests prove current state and Preview remain equal, persistence bytes are untouched, desired condition and durability remain equal, and neither subscriber channel fires.

## 20. Backup Advisory Semantics

Advisory-only backup import succeeds. Tests cover `custom`, preserve the authored recurrence unchanged, and assert the returned advisory.

## 21. Backup Persistence-Failure Separation

Valid activation followed by persistence failure remains `status: "imported"`. Runtime replacement stays authoritative for the session and existing durability/retry semantics apply. Existing persistence-failure tests now explicitly narrow imported results.

## 22. Backup Source Preservation

The store clones the normalized backup for validation/activation and never mutates the caller's object. A rejection test compares the serialized external artifact before and after and proves equality.

## 23. Parse / Version / Structure Distinction

Malformed JSON, wrong app/version, and envelope/structural errors remain in `parseDayFrameBackupJson`/`validateDayFrameBackup` and throw their existing specific errors before semantic validation. UI catch behavior remains distinct from a returned semantic rejection.

## 24. Compatibility-Normalization Preservation

Singular `shiftCycle` readers remain active for both profiles and backups. Existing direct store tests prove valid singular-only V1 data still normalizes and activates. No reader was retired and no migration completion was claimed.

## 25. Atomic Activation / No Partial Import

The validator receives the complete normalized snapshot. Any blocking issue rejects the entire load/import; no template, cycle, recurrence, event, or other valid subset is installed. Tests remove referenced shifts and use duplicate linked templates to prove rejection rather than subset activation.

## 26. Preview Preservation

Rejected ingress returns before Preview clearing. Store tests establish a Preview before rejection and compare the complete post-operation state to the pre-operation snapshot. Accepted ingress continues to clear Preview.

## 27. Persistence / Durability Preservation On Rejection

Rejection performs no `setItem`, retains the prior active storage bytes, and preserves both active/profile durability fields. Semantic rejection therefore cannot enter durability classification.

## 28. Subscriber Preservation On Rejection

Direct tests prove zero ordinary subscriber calls and zero durability subscriber calls for rejected profile and backup ingress.

## 29. Desired-Condition Preservation

Rejected load/import returns before `retainActiveSnapshotIntent`; tests compare the complete desired durable condition before and after.

## 30. Production Profile Caller Migration

`DayFrameApp` branches on `recoveryRequired` before navigation, Preview-selection clearing, success feedback, and durability classification. Loaded results retain existing success and persistence-feedback behavior.

## 31. Production Backup Caller Migration

The backup workflow continues to parse first, then branches on the store result. Recovery-required results receive semantic feedback and return before durability classification, success navigation, or workflow clearing. Imported results retain existing behavior.

## 32. Workflow Feedback

Profile feedback states that the profile was not loaded, current setup and profile were preserved, and recovery is required. Backup feedback states that import did not occur, current setup and file were preserved, and recovery/conversion is required. No repair controls or persistent recovery UI were added.

## 33. Manual-Event Normalization Limitation

`normalizeManualCalendarEvents` may discard non-record events or records missing required metadata before semantic validation; it also omits invalid optional times. Task 2.17 therefore does not claim preservation of malformed events already lost during compatibility normalization. Redesigning that boundary was explicitly excluded and remains deferred.

## 34. Historical-Ingress Scope Preservation

The implementation affects selected profile load and normalized backup import only. Profile save/delete, backup export, parse/version/structure handling, durability retry, durable formats, keys, and compatibility normalization remain unchanged.

## 35. Active-Local Exclusion

`loadPersistedState`, `createInitialDayFrameState`, `mergeInitialState`, store construction, local fallback behavior, and active persistence are unchanged. No ingress-status state, safe fallback, checkpoint copy, or active-write guard was introduced.

## 36. OccurrenceIdentity / Source-Incarnation Preservation

OccurrenceIdentity remains V1. No source-incarnation field, remapping, repair, PlanDecision behavior, or durable reference behavior was added.

## 37. Tests Added or Updated

Added six store tests covering profile/backup semantic rejection, ambiguous duplicate referents, advisory acceptance, byte/source preservation, Preview preservation, and all infrastructure side-effect exclusions. Added two UI tests covering truthful profile and backup recovery-required workflows. Existing valid legacy, valid current, and persistence-failure tests were migrated to exhaustively narrow result unions.

## 38. Production Reference Audit

Reference search found only `DayFrameApp` invoking production `loadProfile` and `importBackup`. Both branch before using success-only fields or calling `classifyStoreMutationResult`. Store validation occurs before both replacement assignments. No active-local path uses these result types, and no durable writer changed.

## 39. Compatibility Assessment

Valid current and legacy ingress behavior remains compatible apart from the intentional result discriminants. Advisory-only intent remains accepted. Parse/version/structural exceptions and durability outcomes remain distinct. Invalid selected data can no longer become current authority.

## 40. Deviations

None. Missing profile continues to throw rather than adding a broader `notFound` variant, which the task explicitly allowed as the smallest bounded migration.

## 41. Discoveries and Deferred Work

Upstream profile filtering/collection collapse and lossy manual-event compatibility normalization remain the two known non-destructive preservation limitations. Ambiguity is currently represented as broad `invalidAuthoredState` with complete validator evidence; a taxonomy was not invented. Active-local recovery/write protection remains the next separate seam.

## 42. Recommended Next Task

Implement active-local historical ingress detection with a safe runtime fallback, exact checkpoint preservation, retained ingress status outside `DayFrameState`, and an active-write/retry guard until explicit recovery or abandonment.

## 43. Validation

- Focused profile/backup module tests: 2 files, 11 tests passed (5 profile, 6 backup).
- Focused store suite: 1 file, 100 tests passed; 6 new ingress tests.
- Workflow suite: 1 file, 86 tests passed; 2 new recovery-required tests.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test -- --reporter=dot`: 26 files, 425 tests passed.
- `npm run build`: passed; 46 modules transformed.
- `git diff --check`: passed.
- Artifact SHA-256/immutability: confirmed in section 2.
- Active local rehydration, active write/retry policy, durable formats, governance, migration, source incarnation, OccurrenceIdentity, and PlanDecision remained unchanged.

## 44. Final Completion Determination

Task 2.17 is complete. Both selected-profile and backup ingress now use the shared semantic truth before atomic activation, explicitly preserve and reject blocking sources without runtime or infrastructure effects, retain valid/advisory and post-activation durability semantics, adapt all production callers, truthfully record upstream preservation limits, and stay within the authorized historical-ingress scope.
