# Task 1.35 Result — Consume Durability Semantics in Immediate Persisting Workflows

## 1. Executive Result

Implementation completed. Every user-initiated persisting workflow now classifies its returned store result through the Task 1.34 shared semantic module and retains workflow-local durability feedback without changing session-first runtime behavior.

## 2. Artifact Integrity

- Source artifact: `TASK_1.35_CONSUME_DURABILITY_SEMANTICS_IN_IMMEDIATE_PERSISTING_WORKFLOWS.md`
- SHA-256 before implementation: `98d273840eadc7e0b8436f5c520f12a7a8ef3c272d038aa4484281f824663d9f`
- The saved project specification and supplied attachment matched byte-for-byte.
- All required sections and the required final completion sentence were present.
- The task specification remained immutable.

## 3. Production Caller Inventory

| Caller | Classification |
| --- | --- |
| `commitAuthoredSetup` from Setup save and Generate Preview | Updated; every result is classified, while Generate Preview continues to suppress transient Setup feedback during navigation. |
| `setManualEvents` from create/edit | Updated; result classification is retained locally. |
| `setManualEvents` from delete | Updated; result classification is retained locally. |
| `saveProfile` | Updated; runtime profile existence and durable save are distinguished. |
| `loadProfile` | Updated; session load and active-state durability are distinguished. |
| `deleteProfile` | Updated; runtime removal and profile-collection durability are distinguished. |
| `importBackup` | Updated; accepted runtime import and active-state durability are distinguished. |
| `clearLocalData` | Updated; aggregate plus active/profile surface classifications are retained. |
| Demo-store calls to `setShiftDefinitions`, `setShiftCycles`, `setBlockTemplates`, and `setBlockRecurrences` | Non-user-facing bootstrap seeding; intentionally unchanged. Retained store status remains authoritative for these calls. |
| `exportBackup`, `generatePreview`, `applySuggestedFixToPreview` | Out of scope because they do not return persisting mutation or clear results. |

## 4. Implementation Completed

Added small workflow-local semantic state, classified exact synchronous mutation results, adapted existing local message regions, and preserved all runtime transitions.

## 5. Files Changed

- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/SetupScreen.tsx`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- This result artifact

No store, persistence helper, schema, key, version, migration, or `DayFrameState` file changed for Task 1.35.

## 6. Workflow Semantic State

Setup, manual-event, and backup workflows retain `DurabilitySemanticCategory | null`. Profiles retain category plus operation/name context. Clear retains the complete `ClearDurabilitySemanticClassification`. These values describe only the initiating operation and are cleared by existing local workflow conventions.

## 7. Shared Classifier Consumption

All ordinary mutation workflows call `classifyStoreMutationResult`; clear calls `classifyClearLocalDataResult`. UI code does not switch on raw persistence outcome statuses or inspect storage/error details.

## 8. Setup Integration

Setup commits classify durable success, unavailable, storage failure, and serialization failure. The committed `result.state` remains the runtime result in every branch.

## 9. Setup Navigation/Closure

Setup and Generate Preview navigation are unchanged. Generate Preview still transitions immediately and does not retain a message that its existing navigation clears.

## 10. Manual-Event Integration

Create/edit/delete results are classified after `setManualEvents`; runtime event changes remain applied.

## 11. Manual-Event Closure/Preview Preservation

Editor state, delete confirmation closure, preview staleness, and regeneration behavior are unchanged.

## 12. Profile Save Integration

The runtime profile remains present after durability failure. Only `durableSuccess` renders the existing durable-save message.

## 13. Profile Delete Integration

Runtime deletion remains applied. Failed collection persistence is described as unresolved durability rather than a completed durable deletion.

## 14. Profile Load Integration

The selected profile remains loaded for the session. Feedback classifies the active-state persistence result and does not reinterpret source-profile durability.

## 15. Backup Import Integration

A valid backup remains applied in runtime while the returned active persistence result determines immediate durability feedback.

## 16. Backup Validation Separation

JSON parsing and backup validation errors remain in the existing error path and are not assigned durability semantics.

## 17. Clear Integration

Clear retains the shared aggregate, active-state, and profiles semantic classification.

## 18. Partial-Clear Semantics

Partial failure identifies the unresolved surface and whether its classification is unavailable or storage failure. It is not rendered as a fully durable clear.

## 19. Total-Durability-Failure Clear Semantics

Total failure identifies both unresolved surfaces while the runtime reset remains applied.

## 20. Domain Validation Separation

Profile-name, missing-profile, and backup input errors remain domain/input errors handled by their existing paths.

## 21. Durable Success Handling

Existing Setup, profile, backup-import, and clear success wording is preserved. Manual events now have local durable-success feedback in the already existing panel.

## 22. Retryable Unavailable Handling

Workflow state preserves `retryableUnavailable` distinctly and describes the runtime change as session-applied.

## 23. Retryable Storage-Failure Handling

Workflow state preserves `retryableStorageFailure` distinctly without inferring a browser or device cause.

## 24. Recovery-Required Handling

Serialization failure is retained as `recoveryRequired`; no retry or recovery action is introduced.

## 25. Product-Copy Determination

Visible wording changed only where existing success strings would assert a known false durable result. Provisional messages state that runtime changes apply for the session and identify the shared semantic class in plain language. Setup feedback also receives a failure visual tone when non-durable.

## 26. Runtime/Workflow Separation

Tests directly establish simultaneous runtime/domain success and failed workflow durability for Setup, manual events, profiles, backup import, and clear.

## 27. Retry Deferral

No retry API is called automatically and no retry control was added.

## 28. Persistent Durability Surface Deferral

No durability subscription consumer, app-level banner, header status, global warning, or persistent notification surface was added.

## 29. Tests Added or Updated

Nine focused test cases were added to `DayFrameApp.test.tsx`, covering three Setup failure classes, manual-event storage failure, profile save, profile load/delete, backup serialization failure, partial clear, and total clear failure. Existing tests continue to cover durable success for Setup, manual events, profiles, backup import, and clear.

Manual-event serialization failure was not manufactured by corrupting production fixture types; the shared classifier and other workflow recovery tests cover that semantic path safely.

## 30. Reference Validation

- All production persisting callers were inventoried.
- User workflows consume the shared classifiers.
- Unavailable and storage failure remain distinct.
- Clear retains aggregate and per-surface detail.
- No raw `localStorage` inspection was added to production UI.
- No automatic retry, retry control, recovery control, durability subscription consumer, or persistent global surface exists.

## 31. ADR Alignment Improvement

The UI now preserves failure transparency, session-first authority, retry/recovery separation, and epistemic integrity without changing durable-data ownership.

## 32. Deviations

None from authorized implementation scope.

## 33. Discoveries and Deferred Work

- Workflow-local messages intentionally do not survive navigation and can become stale after unrelated operations; retained store durability remains authoritative.
- Persistent cross-navigation awareness, retry initiation, and recovery presentation remain deferred.
- Repository-wide `git diff --check` reports pre-existing trailing whitespace in `docs/architecture/CURRENT_STATE.md` and `docs/architecture/DECISIONS.md`. Task 1.35 explicitly prohibits updating those files; the affected-scope diff check passes.

## 34. Recommended Next Task

Task 1.36 — Add Persistent App-Level Durability Awareness, initialized from `getDurabilityStatus()` and updated through `subscribeDurability()` while continuing to suppress unknown/non-actionable state.

## 35. Validation

- Focused UI/workflow test file: 1 file, 56 tests passed.
- Semantic/store regression set: 3 files, 174 tests passed (including the workflow file).
- Full test suite: 23 files, 348 tests passed.
- Tests added: 9.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed (43 modules transformed).
- Task-affected `git diff --check`: passed.
- Repository-wide `git diff --check`: reports only the explicitly deferred pre-existing architecture-document whitespace described above.
- Specification SHA-256 after implementation: `98d273840eadc7e0b8436f5c520f12a7a8ef3c272d038aa4484281f824663d9f`.

## 36. Final Completion Determination

Task 1.35 is complete. Every immediate user-facing persisting workflow consumes the shared durability classifier, distinguishes durable success from retryable and recovery-required failure in local workflow state, preserves session-first runtime and existing navigation/closure behavior, and introduces none of the prohibited persistent UI, retry, recovery, store, or durable-format changes.
