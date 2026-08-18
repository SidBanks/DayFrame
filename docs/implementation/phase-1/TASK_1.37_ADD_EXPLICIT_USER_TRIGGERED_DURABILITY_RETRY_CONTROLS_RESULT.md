# Task 1.37 Result — Add Explicit User-Triggered Durability Retry Controls

## 1. Executive Result

Implementation completed. The persistent app-level durability surface now exposes independent, accessible retry controls for retryable active-state and saved-profile failures. Each control invokes exactly one existing store-owned retry method, classifies its exact result through Task 1.34, and leaves persistent convergence to the retained-durability subscription.

## 2. Artifact Integrity

- Source artifact: `TASK_1.37_ADD_EXPLICIT_USER_TRIGGERED_DURABILITY_RETRY_CONTROLS.md`
- Pre-execution SHA-256: `31223e4ff5f90f7f1a66c1a826d9fb4b9165a44917256f058421be3556348999`
- Supplied attachment and saved project specification matched byte-for-byte.
- All required sections and the required final sentence were present.
- Post-execution hash is unchanged: `31223e4ff5f90f7f1a66c1a826d9fb4b9165a44917256f058421be3556348999`.

## 3. Implementation Completed

Extended Task 1.36’s single persistent surface with semantic eligibility, two surface-specific callbacks, dedicated store retry invocation, and shared retry-result classification. No local retained-status reconstruction was added.

## 4. Files Changed

- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- This result artifact

No store, persistence, CSS, schema, key, version, migration, or `DayFrameState` file changed for Task 1.37.

## 5. Retry Control Placement

Controls appear inside their corresponding persistent active/profile entries. No duplicate contextual controls or second retry panel was introduced.

## 6. Eligibility Semantics

`isRetryableDurabilitySemantic` admits only `retryableUnavailable` and `retryableStorageFailure`, using the classification already produced by `classifyStoreDurabilityStatus`. Recovery-required, durable-success, and internal-no-op states have no control.

## 7. Active Retry Integration

The active control invokes `retryActivePersistence()` exactly once per activation and never calls profile retry.

## 8. Profile Retry Integration

The profile control invokes `retryProfilePersistence()` exactly once per activation and never calls active retry.

## 9. Surface Independence

When both surfaces fail, both controls coexist. Tests prove successful active retry removes only active awareness while profile awareness/control remains and profile retry is not called.

## 10. Retry Result Classification

Both handlers pass the exact `DurabilityRetryResult` to `classifyDurabilityRetryResult()`. No raw result/status semantic switch exists in UI code.

## 11. Durable-Success Handling

No separate success state is retained. The store marks the surface durable, the durability subscription updates Task 1.36 state, and the warning/control disappear.

## 12. Retryable-Unavailable Handling

The distinct unavailable message remains visible and the applicable retry control remains enabled.

## 13. Retryable-Storage-Failure Handling

The storage-failure message remains visible and retryable. One click produces one attempt; no automatic second attempt occurs.

## 14. Recovery-Required Handling

Recovery awareness remains visible without Retry. A retry-to-serialization-failure transition reactively removes the control and adds no recovery action.

## 15. Already-Durable Handling

The shared classifier treats stale `alreadyDurable` results as benign durable success. In normal UI timing the subscription removes the control as soon as retained status becomes durable, so a brittle stale-DOM race test was not added.

## 16. Unknown/Internal-No-Op Handling

Unknown status remains suppressed. The shared classifier treats a stale unknown retry result as internal no-op; handlers add no error or repeat attempt.

## 17. Retry Subscription Interaction

Handlers do not hide or rewrite persistent entries. Existing `subscribeDurability()` notifications remain the sole convergence/update mechanism.

## 18. Active Snapshot Retry

A real active write failure followed by successful user retry persists the current store-owned snapshot and clears active awareness.

## 19. Profile Snapshot Retry

A real profile write failure followed by successful user retry persists the current profile collection and clears profile awareness.

## 20. Partial-Clear Active Retry

A partial clear with unresolved active removal exposes active Retry. Successful activation routes through the store’s retained `absent` intent and does not rerun clear.

## 21. Partial-Clear Profile Retry

The inverse profile-removal failure is repaired through profile Retry without rerunning aggregate clear.

## 22. Same-Category Retry Failure

No extra local retry-result message was added. On same-category failure the accurate warning/control remain visible. This avoids stale duplicate truth while the one-click/one-write test proves the explicit attempt occurred.

## 23. Failure-Category Transition

A real retry transition from storage failure to unavailable updates persistent wording through the durability subscription and leaves Retry available.

## 24. Retry-to-Recovery Transition

A focused injected seam safely proves an exact retry result classified as recovery-required alongside retained serialization-failure notification; awareness changes and Retry disappears without corrupting production fixtures.

## 25. DayFrameState Subscriber Preservation

UI-triggered active retry was directly tested with an ordinary store subscriber. The subscriber received no notification.

## 26. No Workflow Replay

Tests prove active Retry does not call `commitAuthoredSetup`, profile Retry does not call `saveProfile`, and partial-clear Retry does not call `clearLocalData` again.

## 27. No Automatic Retry

The only production retry invocations are the two direct button handlers. No effect, subscription, startup, navigation, or workflow callback retries automatically.

## 28. Immediate Feedback Coexistence

Task 1.35 feedback remains intact. Setup/manual-event immediate failure feedback can coexist with the persistent retry-capable active warning.

## 29. Accessibility

Exact accessible button names are:

- `Retry active setup durability`
- `Retry saved profiles durability`

They are native enabled buttons, keyboard accessible, and distinguishable when both surfaces appear.

## 30. Product Copy

Only the two control labels above were added. Task 1.35/1.36 durability copy was otherwise preserved. No raw internal status/result identifiers are shown.

## 31. Recovery Deferral

No recovery, repair, export, reset, diagnostic, or read/hydration action was added.

## 32. Tests Added or Updated

Six focused tests were added and relevant Task 1.35/1.36 assertions were updated for the newly authorized controls. Coverage includes active/profile snapshot retry, independent dual-surface controls, both partial-clear directions, one-click/one-attempt failure, retry category transition, retry-to-recovery, state-subscriber silence, workflow non-replay, navigation persistence, eligibility, and accessible names.

## 33. Reference Validation

- Retry is present only for shared retryable semantics.
- Active/profile controls call only their corresponding store API.
- Exact retry results use the shared classifier.
- Persistent convergence remains subscription-driven.
- Partial clear uses store-owned retry routing without desired-condition exposure.
- No workflow replay, state notification, automatic retry, recovery control, local-storage inspection, store API change, or durable-format change was introduced.

## 34. ADR Alignment Improvement

The implementation completes explicit, non-destructive, user-controlled ordinary retry while preserving deterministic store ownership, surface separation, session/runtime authority, and epistemic integrity.

## 35. Deviations

None from authorized scope.

## 36. Discoveries and Deferred Work

- A separate retry-result message was unnecessary because retained awareness communicates every actionable result; durable success intentionally remains silent.
- Serialization-failure recovery behavior remains undefined and deferred.
- Repository-wide diff checking still includes pre-existing architecture-document whitespace outside authorized scope; affected-scope checking passes.

## 37. Recommended Next Task

Task 1.38 — Establish Serialization-Failure Recovery Semantics and User Recovery Boundaries.

## 38. Validation

- Focused UI suite: 1 file, 71 tests passed.
- Semantic/store/UI regression set: 3 files, 189 tests passed.
- Full suite: 23 files, 363 tests passed.
- Task 1.37 focused tests added: 6; prior assertions updated where retry became authorized.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; 43 modules transformed.
- Affected-scope `git diff --check`: passed.
- Production retry-call audit: exactly two UI call sites, both explicit handlers.

## 39. Final Completion Determination

Task 1.37 is complete. Persistent retryable active/profile awareness exposes explicit surface-specific user controls that invoke the existing store retry APIs, classify exact results through the shared semantic layer, rely on retained-status subscriptions for convergence, hide Retry for recovery-required/non-actionable states, preserve `DayFrameState` subscriber silence, and introduce no automatic retry or recovery behavior.
