# Task 2.18 — Active-Local Ingress Safe Fallback and Checkpoint Protection — Result

## 1. Executive Result

Completed. DayFrame now classifies the active local checkpoint before activation, normalizes supported history before shared semantic validation, activates only valid/advisory data, and uses known-safe defaults when activation is unsafe. Unsafe/read-uncertain sources retain a queryable recovery-required status outside `DayFrameState`; every store-owned active write, retry, and removal is guarded so the historical checkpoint cannot be silently overwritten. Runtime editing and Preview remain usable, profile persistence remains independent, and a persistent read-only app warning explains session risk.

## 2. Artifact Integrity

The supplied task artifact and saved project copy were byte-identical before implementation: 40,677 bytes / 1,632 lines, SHA-256 `cc956b6f2a22ffc60f756b3a58918af184edbdf1d2abda5a5ff0bb90fa9d3ce8`. The specification remained unchanged.

## 3. Implementation Completed

Implemented protected active-local reading/classification, compatibility normalization and validation, safe fallback, retained ingress status/access/subscription, write/retry/removal guards, truthful blocked outcomes, durability integration, app awareness, and regression tests.

## 4. Files Changed

Task-specific files:

- `code/src/state/types.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/durabilitySemantics.ts`
- `code/src/state/durabilitySemantics.test.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- this result artifact

Earlier cumulative Phase 2 changes were preserved.

## 5. Prior Active-Local Pipeline

Previously, `getStorage`/`getItem`/JSON parse fed an unchecked cast into `createInitialDayFrameState`. Parse/get failures often collapsed to absence/defaults, accessor failures could throw, semantic invalidity could activate, nested malformed data could throw, and a later ordinary mutation could overwrite an unreadable/hidden checkpoint. No retained ingress status existed.

## 6. New Active-Local Pipeline

Storage acquisition → key read → source classification → exact raw string retained in place → JSON parse → shallow structural gate → existing compatibility normalization → complete authored snapshot extraction → `validateDayFrameAuthoredSetup` → accepted activation or protected safe fallback. Saved profiles load independently afterward; optional injected composition overlays the selected base without changing durable-source classification.

## 7. Read Classification

`ActiveLocalIngressStatus` distinguishes `noSource`, `accepted`, and `recoveryRequired`. Recovery reasons are `readFailure`, `corruptJson`, `structurallyInvalid`, or `invalidAuthoredState`. Status records whether a source was readable/preserved and carries cloned validator evidence where available. The active format remains versionless, so no unsupported-version fiction was added.

## 8. Missing-Key Semantics

Available storage with `getItem(activeKey) === null` produces safe defaults and `{ status: "noSource", reason: "missing" }`. It is not recovery-required and ordinary active writes remain enabled.

## 9. Unavailable-Storage Semantics

When `localStorage` does not exist, startup uses safe defaults and `{ status: "noSource", reason: "storageUnavailable" }`. There is no known checkpoint to protect; later persistence retains existing `unavailable` durability behavior.

## 10. Accessor / `getItem` Failure Semantics

A throwing storage accessor or `getItem` yields safe defaults plus recovery-required `readFailure`. Because no exact raw string was obtained, status truthfully reports `sourceReadable: false` and `sourcePreserved: false`; conservatively, active write/retry/removal protection is still enabled because DayFrame cannot establish that overwriting is safe. Profile collection reading separately falls back to its existing empty-list behavior rather than blocking store construction.

## 11. Malformed JSON Semantics

A readable raw string that cannot parse yields safe fallback, `corruptJson`, `sourceReadable/sourcePreserved: true`, and active protection. The exact key string is never rewritten or removed.

## 12. Structural Failure Semantics

Non-record roots, incompatible top-level collection/object shapes, and expected `TypeError`/`RangeError` failures during normalization/validation yield protected fallback with `structurallyInvalid`. Unexpected non-domain/programmer errors are rethrown rather than indiscriminately swallowed.

## 13. Compatibility Normalization

Existing singular `shiftCycle`, cycle defaults, Preview defaults, template normalization, and manual-event compatibility run before semantic validation. Valid singular-only history activates with accepted status and is not rewritten during construction. Compatibility readers remain active.

## 14. Semantic Validation Placement

The normalized `DayFrameState` is projected to one complete `DayFrameAuthoredSetup` and passed to the shared Task 2.15 validator immediately before it may become base runtime authority. No parallel validator was created.

## 15. Advisory Activation

Otherwise-valid persisted state with `perShiftSegment`/`custom` intent activates. Status is `accepted` with cloned advisories, no guard is enabled, and ordinary persistence continues normally.

## 16. Semantic Invalidity

Blocking validator results never activate. Runtime uses safe fallback, status is recovery-required `invalidAuthoredState` with validator evidence, and readable source bytes remain protected in place.

## 17. Ambiguity Handling

Duplicate linked referents are rejected by the shared validator and retained as `invalidAuthoredState` with duplicate-ID evidence. No referent is selected and no ambiguity taxonomy, remapping, repair, or partial activation was invented.

## 18. Safe Fallback Runtime

The pre-composition fallback is exactly `createInitialDayFrameState()`: default scheduling preferences (`03:00`, Saturday), default three-day Preview range (`2026-05-04` through `2026-05-06`), empty authored collections, empty saved profiles before independent profile loading, and `preview: null`. It is temporary session authority, not recovery or migration.

## 19. Saved-Profile Initialization Independence

Saved profiles continue to load through the existing separate profile surface and are merged into fallback/runtime exactly as before. Active protection does not freeze profile save/delete persistence. Existing raw-profile-loss limitations from Task 2.17 remain unchanged.

## 20. Injected Initial-State Semantics

Durable-source classification and protection occur first. An explicit injected `Partial<DayFrameState>` then overlays accepted or fallback base state under the existing composition semantics. It may provide session runtime values but cannot clear recovery status or bypass the write guard. This preserves the test/composition boundary without treating injected data as recovered history.

## 21. Seeded-Store Semantics

Seed/demo data follows the same explicit composition or setter behavior. When a protected checkpoint exists, seed setters may change session runtime but all active writes are blocked; seed data never masquerades as recovery or overwrites the checkpoint. Healthy seeded construction remains non-persisting unless an existing mutation later writes.

## 22. Exact Checkpoint Preservation

The existing active key is the only durable recovery source; no copy key or envelope was added. Tests seed an exact malformed string and prove equality after construction, a complete valid runtime commit, retry, Preview generation, profile/backup runtime replacement, and guarded clear.

## 23. Active Ingress Status Type

`ActiveLocalIngressStatus` is a narrow discriminated infrastructure union outside `DayFrameState`. It retains only classification, protection/readability facts, advisories, and optional validator issues—not a second normalized authored snapshot or public raw payload.

## 24. Ingress Status Accessor

`getActiveLocalIngressStatus()` returns a defensive snapshot. Advisory/issue arrays and objects are cloned; callers cannot mutate store-owned diagnostic state.

## 25. Ingress Subscription

`subscribeActiveLocalIngress` is a dedicated channel separate from state and durability subscriptions. Construction has no subscribers. Task 2.18 introduces no recovery-completion transition, so ordinary mutations correctly emit no ingress notifications; the API is prepared to notify only on a future actual status change.

## 26. Durability Separation

`PersistenceWriteOutcome` and retained durability statuses remain unchanged and continue to describe real attempts. Active policy protection is represented by the separate `ActivePersistenceOutcome` blocked variant. No attempted write means active durability is left unchanged; UI classification maps protection to `internalNoOp`, not failure or success.

## 27. Active Write Guard

All store-owned active snapshot writers route through one `persistActiveState` guard: complete Setup commit; preference/range/definition/cycle/template/recurrence/manual setters; valid profile load; valid backup import; and any seed setter use. Profile collection writes use their separate unguarded surface.

## 28. Guarded Runtime Mutation Semantics

A valid mutation still returns `status: "applied"`, changes cloned runtime authority, stales Preview normally, retains session notification behavior, and returns `persistence: { status: "blocked", reason: "activeLocalRecovery" }`. This is neither a persistence attempt nor failure. Workflow feedback states that the change applied for the session with no durability attempt; the persistent warning supplies the checkpoint reason and reload risk.

## 29. Desired Durable Condition Behavior

Ordinary protected mutations still set active desired condition to `snapshot`; guarded clear sets it to `absent`. The active recovery guard is authoritative and prevents either intent from being executed by automatic/ordinary retry. The status cannot clear in Task 2.18, so desired metadata cannot authorize overwrite. Future explicit recovery must deliberately reconcile intent before clearing protection.

## 30. Active Retry Guard

`retryActivePersistence()` checks ingress protection first and returns `{ status: "notAttempted", reason: "recoveryProtected" }`. It performs no write/removal, durability update, ingress change, or ordinary notification. Durability semantics classify it as `internalNoOp`.

## 31. Profile Persistence Independence

Profile save/delete continue to write `dayframe-profiles-v1` and update profile durability under active protection. Saving safe-fallback/session state as a profile is allowed under the existing contract; future recovery UX should explain provenance, but freezing the independent surface was not authorized.

## 32. Profile Load Under Protection

A valid profile may replace session runtime and returns `loaded`; its automatic active write returns the explicit blocked outcome. The original active key and recovery-required status remain unchanged. It is not implicitly treated as recovery completion.

## 33. Backup Import Under Protection

A valid backup similarly may replace session runtime and returns `imported` with a blocked active write. The protected key/status remain unchanged, and no explicit recovery authority is inferred.

## 34. Clear / Active Removal Semantics

Existing clear confirmation is not treated as authorized recovery abandonment in this task. `clearLocalData` resets session runtime and explicitly removes the profile key, but active-key removal is blocked and returned as `{ status: "blocked", reason: "activeLocalRecovery" }`. The aggregate is normally `partiallyCleared` when profiles are removed. Active durability remains unchanged; profile durability reflects removal. UI labels the unresolved active surface as a protected recovery checkpoint.

## 35. Preview Generation / Staleness Preservation

Preview generation continues from valid current session authority and never persists. Valid protected mutations still stale existing Preview exactly as healthy mutations do. The protection dimension affects durability only, not derivation or runtime notifications.

## 36. Persistent Awareness

`DayFrameApp` initializes from the ingress accessor, subscribes with cleanup, refreshes on injected-store replacement, and displays a labelled read-only region only for recovery-required status. It states that saved data was unsafe to activate, safe temporary state is in use, the checkpoint is preserved, active saving is blocked, session edits may be lost on reload/close, and no explicit recovery/abandonment action exists yet. No recovery control was added.

## 37. Workflow Feedback

Setup/manual-event/profile-load/backup-import active outcomes now use active-outcome classification. Blocked writes produce the existing truthful `internalNoOp` session message and are never passed to the real persistence classifier. Profile save/delete remain on the ordinary persistence classifier.

## 38. Healthy Persistence Regression

No-source and accepted stores continue to perform active writes/removals and retry normally. Tests prove advisory accepted state can persist, existing clear batching remains one durability notification, and the guard is conditional.

## 39. Durability Regression

All Phase 1 persistence-failure statuses, desired-condition behavior, retry eligibility, durable status retention, state/durability subscriptions, and runtime-first semantics remain green. New blocked/recovery-protected cases classify as non-attempts.

## 40. Compatibility Preservation

Profile/backup semantic validation from Task 2.17 remains intact. Singular active/profile/backup readers remain. Manual-event historical normalization and raw-profile collection behavior were not redesigned, and successful in-memory normalization is not marked as migration.

## 41. Durable Format Preservation

No persistence key, schema, envelope, version, profile/backup format, recovery-copy key, or additional durable surface changed. Ingress status and blocked outcomes are runtime metadata only.

## 42. OccurrenceIdentity / Source-Incarnation Preservation

OccurrenceIdentity remains V1. No source incarnation, authored-ID remapping, PlanDecision, durable occurrence reference, migration, conversion, or repair behavior was added.

## 43. Tests Added or Updated

Added 10 focused active-ingress store cases covering missing/unavailable, valid/advisory, semantic/ambiguous, corrupt/structural, get/read failure, exact end-to-end protection, profile independence and runtime replacement, and guarded clear. Updated the prior accessor expectation to safe classification. Added durability cases for blocked active outcomes/removal and protected retry. Added three UI tests for warning content/accessibility, healthy silence, session-only feedback/byte preservation, and replacement-store refresh.

## 44. Production Reference Audit

Audit found all active state writes now route through `persistActiveState`; active removal routes through `removeActiveState`; retry checks protection before direct write/remove. Profile writes remain independent. Production active mutation/load/import callers use `classifyActiveStoreMutationResult`; profile save/delete remain on `classifyStoreMutationResult`. Preview generation and ordinary state notification are not blocked.

## 45. Compatibility Assessment

Healthy and supported historical startup behavior is backward compatible. The intentional changes are that formerly hidden/unsafe source failures now produce safe fallback plus observable protection, and guarded active operations report policy non-attempt rather than overwriting source data. API additions are narrow and surface-specific.

## 46. Architectural Alignment Improvement

Active startup now has an explicit authority gate and separates four dimensions: durable source facts, compatibility normalization, runtime authored authority, and write durability. Safe session use no longer implies permission to destroy the historical checkpoint.

## 47. Deviations

None.

## 48. Discoveries and Deferred Work

Read failures without captured bytes cannot truthfully claim exact preservation, so status reports false while conservatively blocking writes. Active local data remains versionless. Desired `absent`/`snapshot` intent accumulates behind the guard and must be reconciled by future explicit recovery completion. Export, repair, replace, abandon, conversion, migration, profile raw-record preservation, and lossy manual-event normalization remain deferred.

## 49. Recommended Next Task

Define and implement explicit active-local recovery completion: export/preserve the protected source where possible, explicitly replace it with a validated profile/backup/session snapshot or abandon it, reconcile desired durable intent transactionally, clear ingress protection only after successful durable resolution, and provide recovery-aware controls without silent loss.

## 50. Validation

- Focused active-ingress cases: 10 passed.
- Focused full store suite: 110 tests passed.
- Durability-semantics suite: 31 tests passed.
- UI workflow/awareness suite: 89 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test -- --reporter=dot`: 26 files, 441 tests passed.
- `npm run build`: passed; 46 modules transformed.
- `git diff --check`: passed.
- Artifact SHA-256/immutability: confirmed in section 2.
- Profile/backup validation, durable formats/keys, governance, migration, source incarnation, OccurrenceIdentity, and PlanDecision remained unchanged.

## 51. Final Completion Determination

Task 2.18 is complete. DayFrame safely constructs around unsafe or unreadable active-local history, preserves readable checkpoints exactly, conservatively protects uncertain read failures, retains and exposes recovery truth outside authored/durability state, guards every ordinary active write/retry/removal, preserves independent profile/runtime/Preview behavior, communicates session risk accessibly, and introduces no unauthorized recovery action or durable format.
