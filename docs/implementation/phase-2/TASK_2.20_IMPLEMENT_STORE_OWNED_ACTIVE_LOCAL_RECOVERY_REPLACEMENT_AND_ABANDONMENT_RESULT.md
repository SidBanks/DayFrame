# Task 2.20 — Store-Owned Active-Local Recovery Replacement and Abandonment — Result

## 1. Executive Result

Completed. DayFrame now has two explicit store-owned recovery commands. One replaces a protected active checkpoint with the latest valid current session; the other removes it and resets active runtime only after successful removal. Both compare the current key to private startup evidence immediately before destruction, retain protection on every failure, and clear protection only after factual durable success. No UI recovery control or durable-format change was added.

## 2. Artifact Integrity

The supplied artifact and saved project copy were byte-identical before implementation: 42,542 bytes / 1,884 lines, SHA-256 `d987cb8026e9e61b20e02245b97d4f137a2063b9e66cf215ae5c40d63c0adad2`. The specification remained unchanged.

## 3. Implementation Completed

Implemented typed recovery results/APIs, mutable ingress infrastructure, private source evidence, source recheck, shared replacement validation, narrow factual write/removal execution, durability/desired-condition reconciliation, success transitions, abandonment reset, clone-safe results, notifications, and direct regression tests.

## 4. Files Changed

Task-specific files:

- `code/src/state/types.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- this result artifact

Earlier cumulative Phase 2 changes were preserved.

## 5. Recovery API Shape

`DayFrameStore` now exposes `replaceProtectedActiveCheckpointWithCurrentState()` and `abandonProtectedActiveCheckpointAndReset()`. The names make destructive authority explicit; no generic force/retry/recovery API was introduced.

## 6. Recovery Result Contract

Separate `ActiveLocalReplacementRecoveryResult` and `ActiveLocalAbandonmentRecoveryResult` unions prevent impossible write/removal combinations. They distinguish `resolved`, actually attempted `notResolved` with exact persistence fact, and `notAttempted` with `notRecoveryRequired`, `invalidReplacement`, `sourceUnreadable`, or `sourceChanged`. Only successful abandonment includes state because only it changes runtime.

## 7. Mutable Ingress Infrastructure

Store-retained ingress is now mutable but remains outside `DayFrameState` and all durable payloads. A private transition function owns changes and publishes cloned status snapshots. The existing ingress subscription becomes behaviorally active on successful recovery.

## 8. Protected Source Representation

For readable protected sources, the store privately retains the exact raw startup string. Exact JavaScript string equality against a fresh `getItem` result proves equality at the current Web Storage boundary. Raw bytes are not exposed publicly. Unreadable startup sources retain no invented evidence.

## 9. Recovery Eligibility

Both commands act only while current ingress is `recoveryRequired`. Healthy/no-source/accepted calls return `notAttempted/notRecoveryRequired` without storage access, mutation, status change, or notification.

## 10. Protected Source Recheck

Immediately before either factual operation, the store reacquires storage and reads the active key. A readable value must exactly equal private protected evidence. Validation occurs first for replacement, avoiding unnecessary storage reads for invalid current state.

## 11. Source Missing / Changed Semantics

A missing or different current value returns `notAttempted/sourceChanged`. No write/removal, desired-condition change, durability change, runtime change, or notification occurs. Current recovery diagnostics remain untouched, deliberately requiring a later renewed classification/decision rather than silently changing the recovery subject.

## 12. Source Unreadable Semantics

Missing storage access, throwing accessor, or throwing `getItem` at recheck returns `notAttempted/sourceUnreadable`. Protection/runtime/durability/desired condition remain unchanged and no subscriber is notified.

## 13. Initial Read-Failure Recheck

An initial `readFailure` has no protected raw evidence. If a later command can read a value, it returns `sourceChanged` and preserves the newly discovered value. It never destroys bytes using authority obtained while the source was unknown.

## 14. Residual Web Storage Race

Recheck followed by synchronous `setItem`/`removeItem` is best-effort. Web Storage has no compare-and-set; an external writer can race in the narrow interval. No multi-tab atomicity, storage event, or locking claim is made.

## 15. Replacement Source Freshness

Every replacement invocation projects a new complete authored snapshot from current runtime. No startup, profile, backup, or failed-attempt candidate is cached. Tests load/import a source, edit it again, and prove the latest session value is written.

## 16. Replacement Validation

The command invokes `validateDayFrameAuthoredSetup` on the projected current snapshot. Blocking invalidity returns clone-safe `notAttempted/invalidReplacement` before source read/write and without infrastructure mutation.

## 17. Replacement Advisories

Advisory-only current state is eligible. On success, cloned advisories populate the new accepted ingress status; no authored intent is removed and advisories are not persisted as metadata.

## 18. Replacement Transaction Ordering

Eligibility → latest snapshot → shared validation → exact source recheck → desired `snapshot` → one `persistState` call → retain outcome → on `persisted`, release evidence and transition ingress accepted.

## 19. Guard Bypass Boundary

The command directly invokes the existing factual `persistState` only after recovery preconditions. It does not toggle the ordinary guard, mark ingress healthy early, or route through retry. All other writers continue through `persistActiveState`.

## 20. Replacement Success

Only `persisted` resolves. Active durability becomes durable, desired condition is snapshot, ingress becomes accepted with validation advisories, evidence is released, and ordinary active persistence immediately resumes. Runtime and Preview remain byte/structure-equivalent snapshots.

## 21. Replacement Failure Semantics

`unavailable` and `storageFailure` return `notResolved` with exact outcome. Desired snapshot and factual active durability remain; ingress/evidence/runtime/Preview remain protected/unchanged. Later explicit invocation starts fresh.

## 22. Replacement Serialization Failure

`serializationFailure` performs no `setItem`, returns `notResolved`, retains original bytes/protection, desired snapshot, and durability serialization failure. Ordinary retry remains recovery-protected.

## 23. Replacement Desired Condition

Desired snapshot is set only after validation and source recheck succeed, immediately before the real attempt. Precondition rejection retains prior intent. Attempted failure retains snapshot; a later abandonment command may supersede it.

## 24. Replacement Durability Semantics

The existing write-outcome mapping is reused. Precondition failures fabricate no durability outcome. Real failures and success update only active durability; profile durability is untouched.

## 25. Replacement Notification Semantics

Success emits no state notification, a durability notification only if value changes, and exactly one ingress notification. Failed attempts emit only a changed durability notification. Precondition rejection emits none.

## 26. Abandonment Transaction Ordering

Eligibility → exact source recheck → desired `absent` → one `clearPersistedState` call → retain outcome → only on `removed`, build/reset state, release evidence, transition ingress, and notify state once.

## 27. Abandonment Removal Boundary

The command reuses only the factual active-key removal helper. It never calls `clearLocalData()` and never touches the profile key.

## 28. Abandonment Success

Only `removed` resolves. Active durability becomes durable, desired condition remains absent, ingress becomes no-source with `resolvedByAbandonment`, protection clears, and future ordinary mutations persist normally.

## 29. Abandonment Failure Semantics

`unavailable`/`storageFailure` return attempted `notResolved`. Runtime, Preview, profiles, ingress, evidence, and active bytes remain unchanged; desired absent and factual durability remain. No state/ingress notification occurs.

## 30. Abandonment Runtime Reset

Reset occurs only after successful removal. It uses `createInitialDayFrameState()`, yielding all initial active fields and `preview: null`; no intermediate reset is observable.

## 31. Saved-Profile Preservation

The current saved-profile collection is cloned into the reset state. Profile key, desired condition, and durability remain untouched on success and failure.

## 32. Abandonment Desired Condition

Desired absent is established after successful precheck and immediately before removal. Precondition rejection preserves prior intent; attempted failure retains absent; later explicit replacement may supersede it.

## 33. Abandonment Durability Semantics

Existing removal-outcome mapping is reused. `removed` maps to durable; unavailable/storage failure remain factual. No recovery-specific durability value was added.

## 34. Abandonment Notification Semantics

Success emits one state notification, one ingress transition, and a durability notification only on value change. Failure emits only changed durability. Precondition rejection emits none.

## 35. Ingress Status Transitions

Successful replacement transitions `recoveryRequired → accepted`. Successful abandonment transitions `recoveryRequired → noSource/resolvedByAbandonment`. No other operation gained transition authority; all failures retain recovery-required.

## 36. Protected Evidence Lifecycle

Exact source evidence exists privately only during readable recovery-required state. It remains across failures for repeat comparison and is cleared immediately after successful replacement/removal. It is never durable history.

## 37. Ordinary Retry Preservation

Ordinary active retry stays `notAttempted/recoveryProtected` before and after failed recovery. After successful resolution, durability is normally already durable and retry returns `alreadyDurable`.

## 38. Healthy-Store Behavior

Direct tests prove both APIs are storage-free no-ops on a healthy/no-source store and after resolution. They cannot act as force-save/remove commands.

## 39. Profile Persistence Independence

Recovery code changes no profile persistence path. Existing profile save/delete behavior remains independent under active protection and after resolution.

## 40. Profile Review-Then-Promote Path

A valid profile can replace protected-session runtime while its automatic active write remains blocked. Subsequent edits are included when the explicit current-session command succeeds. No profile recovery command exists.

## 41. Backup Review-Then-Promote Path

A valid backup follows the same tested import/review/edit/promotion flow. The external backup is unchanged and no backup-specific authority exists.

## 42. Preview Semantics

Replacement success/failure leaves current Preview, stale flag, timestamps, and content unchanged. Successful abandonment sets Preview null; failed abandonment leaves it unchanged.

## 43. Clear Semantics Preservation

Ordinary clear remains guarded during recovery and cannot remove the protected key. Once recovery succeeds, protection is disabled and existing clear behavior resumes. Abandonment is not coupled to full clear.

## 44. Seeded-Store Preservation

Injected/seeded current state still cannot write through protection automatically. It can become the explicit latest replacement source only when the new named store command is directly invoked. No startup or mutation invokes recovery.

## 45. Persistence / Format Preservation

Existing `persistState`, `clearPersistedState`, keys, active shape, profile/backup shapes, and outcome meanings are reused. No serialized ingress, evidence, result, reason, confirmation, field, version, or key was added.

## 46. Migration / Compatibility Preservation

Singular/current compatibility readers and all migration evidence remain unchanged. Resolving a checkpoint is not recorded as migration, repair, conversion, or reader-retirement evidence.

## 47. OccurrenceIdentity / Incarnation Preservation

OccurrenceIdentity remains V1. No incarnation token, authored-ID remap, source identity, PlanDecision, or durable decision behavior was added.

## 48. Tests Added or Updated

Added 16 focused cases to the store suite covering replacement success/advisories/invalidity/source change/unreadability/initial read failure/storage failure/unavailable/serialization failure/latest profile and backup sessions; abandonment success/failure/unavailable; profile preservation; notifications; post-success persistence; healthy/repeated no-ops. The focused store suite now contains 126 tests.

## 49. Production Reference Audit

All ordinary active writes still route through the existing guard; removal and retry remain guarded. Only the two named methods use factual helpers after recheck. Searches confirmed no generic recovery path, source-specific recovery command, raw getter/export, new key, or automatic invocation.

## 50. UI Non-Integration Confirmation

No production UI file changed. `DayFrameApp` still presents the Task 2.18 read-only warning and does not reference either command. Task 2.21 remains the presentation seam.

## 51. Architectural Alignment Improvement

Recovery authority is now executable without conflating runtime, durable truth, or historical-source knowledge. Explicit intent, source freshness, shared semantic validity, factual durability, status transition, and subscriber truth are separate ordered gates.

## 52. Deviations

None.

## 53. Discoveries and Deferred Work

The exact raw string is the simplest correct current identity because Web Storage returns strings; a digest would add collision/implementation complexity without reducing the need to retain/re-read raw data for future export. Source reclassification is deliberately deferred on mismatch. Multi-tab CAS/coordination, raw export, UI confirmation, direct source-specific recovery, source incarnation, repair/migration, and PlanDecision remain deferred.

## 54. Recommended Next Task

**Task 2.21 — Add Explicit Active-Local Recovery Controls and Confirmation.** Consume only the two store commands, expose readable/unreadable and source-changed feedback truthfully, and keep protected-source export separately scoped.

## 55. Validation

- Focused `dayFrameStore` suite: 126 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Full suite: 26 files, 457 tests passed.
- `npm run build`: passed; 46 modules transformed.
- `git diff --check`: passed.
- Task artifact SHA-256/immutability: confirmed above.
- UI recovery controls/raw export/new keys/formats/migration/incarnation/OccurrenceIdentity/PlanDecision/governance changes: none.

## 56. Final Completion Determination

Task 2.20 is complete. The store has explicit, source-rechecked, durability-first replacement and active-only abandonment transactions; only factual durable success clears protection; failures preserve evidence/runtime truth; unrelated profiles and current behavior remain intact; and presentation and broader architecture remain outside scope.
