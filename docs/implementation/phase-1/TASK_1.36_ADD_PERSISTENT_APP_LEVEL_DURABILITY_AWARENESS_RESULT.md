# Task 1.36 Result — Add Persistent App-Level Durability Awareness

## 1. Executive Result

Implementation completed. DayFrame now has one persistent shell-level durability-awareness surface driven by retained store truth. It independently represents active authored-state and saved-profile failures, survives workflow navigation, and disappears reactively when the relevant surface converges to durable.

## 2. Artifact Integrity

- Source artifact: `TASK_1.36_ADD_PERSISTENT_APP_LEVEL_DURABILITY_AWARENESS.md`
- Pre-execution SHA-256: `d8daa433d32cda36b8e156b0d506ee95acf3f870af7acfceb43056d8dc36d420`
- The supplied attachment and saved project specification matched byte-for-byte.
- All required sections and the required final completion sentence were present.
- Post-execution SHA-256 is unchanged: `d8daa433d32cda36b8e156b0d506ee95acf3f870af7acfceb43056d8dc36d420`.

## 3. Implementation Completed

Added retained durability state to `DayFrameApp`, initialized it from the active store, subscribed to retained-status changes, classified both surfaces through Task 1.34, and rendered only actionable failures through a small read-only awareness component.

## 4. Files Changed

- `code/src/ui/DayFrameApp.tsx`
- `code/src/ui/tests/DayFrameApp.test.tsx`
- This result artifact

No CSS, store, persistence, schema, migration, key, version, or `DayFrameState` file changed for Task 1.36.

## 5. Persistent Surface Placement

`PersistentDurabilityAwareness` renders once at the top of the stable `DayFrameApp` shell, before the shared header and screen-specific content. It remains mounted across Setup, Preview, profile, backup, and manual-event workflow changes.

## 6. Initial Durability Read

Component state initializes synchronously from `activeStore.getDurabilityStatus()`. It does not assume durable before the first read.

## 7. Subscription Integration

`DayFrameApp` consumes `subscribeDurability()` directly and updates only its local retained-status snapshot from notifications. This is the sole production durability-subscription consumer.

## 8. Subscription Lifecycle

The effect subscribes once per active injected/internal store, unsubscribes both state and durability listeners on cleanup, reinitializes from a replacement store, and subscribes to that replacement. Stable-store rerenders do not accumulate listeners.

## 9. Semantic Classification Consumption

`classifyStoreDurabilityStatus()` independently maps active and profile statuses. React presentation contains no raw retained-status switch or duplicated semantic map.

## 10. Unknown Suppression

`unknown` classifies to `internalNoOp` and produces no persistent entry.

## 11. Durable Suppression

`durable` classifies to `durableSuccess` and produces no persistent entry or global success indicator.

## 12. Active Retryable-Unavailable Awareness

Exact provisional copy: `Active setup is available for this session, but local storage is unavailable.`

## 13. Active Storage-Failure Awareness

Exact provisional copy: `Active setup is available for this session, but the durable save failed.`

## 14. Active Recovery-Required Awareness

Exact provisional copy: `Active setup is available for this session, but could not be prepared for durable storage. Ordinary retry is not currently available.`

## 15. Profile Retryable-Unavailable Awareness

Exact provisional copy: `Saved profiles are available for this session, but local storage is unavailable.`

## 16. Profile Storage-Failure Awareness

Exact provisional copy: `Saved profiles are available for this session, but the durable save failed.`

## 17. Profile Recovery-Required Awareness

Exact provisional copy: `Saved profiles are available for this session, but could not be prepared for durable storage. Ordinary retry is not currently available.`

## 18. Both-Surface Awareness

A shared container renders separate list entries for active setup and saved profiles. Mixed retryable/recovery states remain independently identifiable; no generic collapse occurs.

## 19. Cross-Navigation Persistence

The surface is independent of `currentScreen` and workflow-local message resets. Tests prove an active warning remains after navigation from Setup toward Preview.

## 20. Editor/Workflow Closure Persistence

Closing the manual-event editor removes its contextual panel but leaves the retained active-state warning visible.

## 21. Ordinary Convergence Clearing

Later successful Setup and profile mutations update retained store status through the existing subscription and automatically remove the corresponding warning.

## 22. Retry Convergence Clearing

A programmatic `retryActivePersistence()` success removes active awareness without a `DayFrameState` mutation or navigation.

## 23. Retry Failure-Category Transition

A programmatic retry transition from storage failure to unavailable updates the persistent copy to the current shared semantic class.

## 24. Immediate Feedback Coexistence

Task 1.35 feedback remains intact. Tests show immediate Setup/manual-event feedback and persistent active awareness simultaneously.

## 25. Product Copy

The surface heading is `Some changes are not durably saved`, with eyebrow `Local save status`. Surface-specific strings are listed in Sections 12–17. No unsupported cause or data-loss claim is made.

## 26. Accessibility

The labelled semantic `section` is discoverable as a named region. Surface identity and retryable/recovery distinction are textual rather than color-only. No aggressive live region was added, so unchanged warnings are not re-announced on unrelated rerenders.

## 27. Retry-Control Deferral

No retry button, callback, or UI invocation was introduced. Existing retry methods are exercised only by tests to prove subscription reactivity.

## 28. Recovery-Control Deferral

No recover, export, repair, reset, or other recovery action was added.

## 29. Desired-Condition Separation

Production UI neither imports nor reads desired durable condition and never renders `snapshot` or `absent`.

## 30. Tests Added or Updated

Nine tests were added/updated for Task 1.36, covering unknown/durable suppression, active and profile failures, both/mixed surfaces, active recovery-required state, cross-navigation and editor-closure persistence, ordinary convergence, retry convergence, retry category transition, immediate-feedback coexistence, absence of controls, and subscription/store-replacement cleanup.

## 31. Reference Validation

- `getDurabilityStatus()` is used for initial and replacement-store reads.
- `subscribeDurability()` has one app-level production consumer with cleanup.
- Active/profile statuses are independently classified through the shared module.
- Unknown and durable statuses are silent.
- Retryable and recovery-required failures are surface-specific.
- Immediate feedback remains.
- No desired condition, raw local-storage access, retry/recovery control, automatic retry, store API change, or durable-format change was introduced.

## 32. ADR Alignment Improvement

The implementation improves persistent failure transparency, cross-navigation discoverability, session/durability separation, reactive correctness, recovery readiness, and epistemic integrity.

## 33. Deviations

None from authorized scope.

## 34. Discoveries and Deferred Work

- Persistent awareness intentionally has no dismissal; it clears only when retained truth no longer requires attention.
- Retry initiation and recovery actions remain deferred.
- Repository-wide `git diff --check` continues to contain pre-existing trailing whitespace in architecture documents that this task explicitly prohibits updating; affected-scope diff validation passes.

## 35. Recommended Next Task

Task 1.37 — Add Explicit User-Triggered Durability Retry Controls, limited to retryable semantic categories and routed through the existing surface-specific store retry methods.

## 36. Validation

- Focused UI suite: 1 file, 65 tests passed.
- Semantic/store/UI regression set: 3 files, 183 tests passed.
- Full suite: 23 files, 357 tests passed.
- Task 1.36 tests added/updated: 9.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; 43 modules transformed.
- Affected-scope `git diff --check`: passed.
- Production consumer audit: one `DayFrameApp` consumer; no immediate-workflow duplicate subscription.

## 37. Final Completion Determination

Task 1.36 is complete. DayFrame exposes persistent app-level durability awareness initialized from `getDurabilityStatus()`, synchronized through `subscribeDurability()`, classified independently for active/profile surfaces through the shared semantic layer, silent for unknown/durable state, persistent across workflow navigation, and automatically cleared or updated after convergence. No retry execution, recovery action, automatic retry, store-policy change, or durable-format change was introduced.
