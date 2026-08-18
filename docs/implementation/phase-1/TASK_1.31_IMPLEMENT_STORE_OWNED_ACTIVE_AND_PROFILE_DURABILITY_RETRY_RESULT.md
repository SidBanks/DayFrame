# Task 1.31 — Implement Store-Owned Active and Profile Durability Retry — Result

**Project:** DayFrame  
**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task ID:** 1.31  
**Status:** Complete  
**Execution type:** Bounded implementation

---

# 1. Executive Result

The store now exposes explicit active and profile durability retry methods. Eligible
surfaces retry exactly once from their current desired condition: snapshot writes
use the latest complete runtime representation and absence uses the corresponding
removal helper. Retry updates only retained durability, preserves desired intent and
`DayFrameState`, notifies no ordinary subscribers, and returns an exact
discriminated result.

No UI, automatic retry, subscription, recovery, migration, or durable-format
behavior was added.

# 2. Artifact Integrity

The immutable attachment was verified complete at 1,817 lines and 39,383 bytes,
contains all required sections, and ends with the mandated sentence. The saved
specification is byte-identical and unchanged. SHA-256:

`a351de32d30d8433340601daf748a3a527f40e6c65fd885cb72e3833aa3dcd0d`

# 3. Implementation Completed

Added the retry result contract, two surface-specific store methods, status-based
eligibility, desired-condition routing, exact outcome retention, and focused tests.

# 4. Files Changed

- `code/src/state/types.ts`
- `code/src/state/dayFrameStore.ts`
- `code/src/state/tests/dayFrameStore.test.ts`
- this result artifact

No UI, format, migration, ADR, or governance file changed for Task 1.31.

# 5. Retry Result Contract

```ts
type DurabilityRetryResult =
  | { status: "attempted"; desiredCondition: "snapshot"; persistence: PersistenceWriteOutcome }
  | { status: "attempted"; desiredCondition: "absent"; persistence: PersistenceRemovalOutcome }
  | { status: "notAttempted"; reason: "unknown" | "alreadyDurable" | "serializationFailure" };
```

No `DayFrameState`, boolean collapse, raw exception, or new outcome category exists.

# 6. Retry Eligibility

| Retained status | Attempt |
| --- | --- |
| `storageFailure` | Yes, once |
| `unavailable` | Yes, once |
| `serializationFailure` | No |
| `durable` | No |
| `unknown` | No |

# 7. Active Retry API

`retryActivePersistence(): DurabilityRetryResult` belongs to `DayFrameStore`. It
selects active intent and updates only active retained durability.

# 8. Profile Retry API

`retryProfilePersistence(): DurabilityRetryResult` belongs to `DayFrameStore`. It
selects profile intent and updates only profile retained durability.

# 9. Snapshot Routing

Active snapshot routes to `persistState(state)`, whose writer extracts current
authored fields. Profile snapshot routes to `persistProfiles(state.savedProfiles)`.
No failed payload, action, parameter, or queue is retained or replayed.

# 10. Absence Routing

Active absence routes to `clearPersistedState()` and profile absence to
`clearPersistedProfiles()`. Retry never substitutes default state or an empty
profile envelope for key absence.

# 11. Active Snapshot Retry

Eligible active retry performs one complete current write, returns its exact write
outcome, maps that same outcome to active status, and leaves profile infrastructure
untouched.

# 12. Active Snapshot Freshness

A direct test performs multiple failed active mutations, then confirms retry writes
the latest scheduling preferences and Preview range rather than the first failed
snapshot.

# 13. Active Absence Retry

After failed active removal, active retry performs one active-key removal and zero
snapshot writes. Success maps active to durable while active intent remains absent.

# 14. Profile Snapshot Retry

Eligible profile retry writes the complete current `savedProfiles` collection once,
returns the exact outcome, and updates only profile status.

# 15. Profile Snapshot Freshness

A direct test fails two successive profile saves and confirms explicit retry writes
both current profiles, not only the first failed operation.

# 16. Profile Absence Retry

After failed profile removal, profile retry performs one profile-key removal and no
write. Success maps profiles to durable while intent remains absent.

# 17. Partial Clear Retry

Each failed clear surface retries independently. Retrying profiles does not touch
the already-durable active key; retrying active does not change profile
infrastructure. No aggregate clear-retry API exists.

# 18. Retry From `unknown`

Both methods return `notAttempted / unknown` immediately after construction, with
zero storage operations, status changes, intent changes, or notifications.

# 19. Retry From `durable`

Both methods return `notAttempted / alreadyDurable` after successful ordinary
persistence. No redundant storage operation occurs.

# 20. Retry From `serializationFailure`

Retry returns `notAttempted / serializationFailure`, performs no storage operation,
and preserves status and intent. Blind unchanged retry remains blocked.

# 21. Storage-Unavailable Retry

Unavailable is eligible. The existing helper rechecks availability; a direct test
restores storage and confirms active persistence and transition to durable.

# 22. Storage-Failure Retry

Storage failure is eligible. Continued failure remains storage failure; if storage
becomes absent, the latest outcome becomes unavailable. One call means one attempt.

# 23. Accessor-Failure Retry

Task 1.30 helpers are reused unchanged. A throwing storage accessor during eligible
retry returns attempted/storage failure, does not escape, preserves intent, updates
status, and sends no state notification.

# 24. Retained Durability Transitions

The exact Task 1.27 mappings are reused. Persisted/removed become durable; all
failure categories become their matching retained status. Latest attempted outcome
wins. A serialization failure arising during an eligible snapshot retry is retained
and blocks subsequent blind retry.

# 25. Desired-Condition Preservation

Retry never assigns desired condition. Snapshot remains snapshot and absent remains
absent across both successful and failed attempts.

# 26. Retry Result / Status Consistency

Each eligible method captures one helper outcome, uses it for both its returned
result and retained status mapping, and performs no verification write.

# 27. Runtime-State Preservation

Retry neither assigns nor clones back into store state. Direct before/after state
comparison confirms no authored, profile, Preview, timestamp, or identifier change.

# 28. Subscriber Preservation

Neither retry method calls `notify()`. Eligible successes, eligible failures, and
ineligible no-ops send zero ordinary `DayFrameState` notifications.

# 29. Surface Independence

Active retry preserves profile status and intent. Profile retry preserves active
status and intent. Surface-specific methods avoid a generic registry.

# 30. UI Preservation

No production UI invokes either method. Setup, profiles, manual events, backup,
clear, navigation, Preview, and current feedback remain unchanged.

# 31. Automatic-Retry Absence

No mutation, startup path, render, subscriber, timer, focus/storage event, or
lifecycle callback invokes retry. Retry occurs only through an explicit method call.

# 32. Tests Added or Updated

Ten focused tests were added, increasing `dayFrameStore.test.ts` from 67 to 77.
They cover active success/latest state, repeat failure/category transition,
unavailable recovery, active absence, profile latest collection, profile absence,
unknown/durable/serialization no-ops, serialization arising during retry, accessor
failure, exact call counts, state preservation, subscriber silence, desired intent,
and other-surface preservation.

# 33. Reference Validation

Confirmed both methods and result type exist; only unavailable/storage failure are
eligible; current data drives snapshot retry; absence drives removal; status mapping
uses the returned outcome; desired/runtime state remain unchanged; `notify()` is not
called; no production caller or automatic retry exists; and no subscription,
outcome category, domain field, durable format, migration, or compatibility change
exists.

# 34. ADR Alignment Improvement

The store now owns an explicit non-destructive retry primitive based on current
session intent. This improves retryability, deterministic ownership, protection
against stale overwrite, failure transparency, recovery readiness, and epistemic
integrity without claiming user communication, recovery, or migration completion.

# 35. Deviations

No deviations from authorized scope.

# 36. Discoveries and Deferred Work

- Existing complete writers eliminate mutation queues and failed-snapshot storage.
- Surface-specific methods naturally preserve partial-clear independence.
- A retry result plus synchronous status accessor remains sufficient without a
  durability subscription.
- Workflow feedback, initiation UX, serialization recovery, read/hydration
  recovery, automatic policy, migration, and compatibility work remain deferred.

# 37. Recommended Next Task

**Task 1.32 — Establish Workflow-Level Durability Feedback, Retry Initiation, and
Recovery Boundaries.** This should be an investigation before UI changes, deciding
contextual versus global feedback, subscription need, partial-clear communication,
and when serialization failure requires recovery instead of retry.

# 38. Validation

Focused validation:

```text
npm test -- src/state/tests/dayFrameStore.test.ts
Test Files  1 passed (1)
Tests      77 passed (77)

npx eslint src/state/types.ts src/state/dayFrameStore.ts \
  src/state/tests/dayFrameStore.test.ts
passed

npm run typecheck
passed
```

Repository-standard validation:

```text
npm run lint
passed

npm run typecheck
passed

npm test
Test Files  22 passed (22)
Tests      298 passed (298)

npm run build
passed (TypeScript validation and Vite production build; 42 modules transformed)

git diff --check -- affected files
passed
```

# 39. Final Completion Determination

Task 1.31 is complete from an implementation standpoint. The store exposes bounded
active/profile retry, attempts only eligible surfaces, routes current snapshot or
absence correctly, retains the exact outcome, returns an explicit result, and
preserves runtime, intent, subscribers, UI, formats, compatibility, and migration
behavior.
