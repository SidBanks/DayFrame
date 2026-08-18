# Task 1.28 — Establish Store-Owned Durability Retry Semantics and Authority — Result

**Project:** DayFrame  
**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task ID:** 1.28  
**Status:** Complete  
**Execution type:** Investigation / architectural contract decision

---

# 1. Executive Determination

DayFrame adopts **current desired durable condition** as the retry authority.
Ordinary active-state and profile retry persists the latest complete runtime
representation, never an original action or historical failed snapshot. Clear is
different: its desired condition is absence, so retry must repeat removal rather
than persist the reset runtime defaults.

The store executes and interprets one retry attempt; a workflow or user initiates
ordinary retry. Retry changes no `DayFrameState`, sends no ordinary state
notification, updates only the affected retained durability status, and returns an
exact outcome to its initiator. No automatic retry is adopted.

Current retained status is sufficient to identify that a surface is non-durable,
but **insufficient to retry a failed clear safely** because it does not retain
whether the desired durable condition is a snapshot or absence. The smallest
missing representation is private, store-level per-surface desired-condition
metadata: `snapshot | absent`. It is infrastructure intent, not domain state,
history, or durable migration evidence.

`storageFailure` and `unavailable` are eligible for explicit retry.
`serializationFailure` is not blindly retried with unchanged data; it requires a
runtime change or recovery/diagnostic action. `unknown` and `durable` do not
represent a failed attempt and therefore are not retryable. A separate future
force-persist command would be different vocabulary and is not recommended now.

This task changed documentation only. No retry API or behavior was implemented.

---

# 2. Artifact Integrity

The immutable Task 1.28 attachment was verified complete at 1,662 lines and 39,727
bytes. It contains every required section and ends with the mandated completion
sentence. SHA-256:

```text
24baf7140612fcd73d485cd19c1e501001d01883280bf2db11542526b9d62aee
```

The saved project specification is byte-identical and has the same hash. It was
not modified.

---

# 3. Evidence Reviewed

**Confirmed executable evidence:**

- `code/src/state/dayFrameStore.ts` and `types.ts`;
- active and profile full-snapshot writers;
- independent active/profile removal helpers;
- mutation ordering and ordinary state notification behavior;
- retained durability implementation and tests;
- profile load and backup import behavior;
- production store callers in `DayFrameApp.tsx`; and
- the current 47-test store suite.

**Adopted architectural evidence:** Tasks 1.23–1.27 and
`ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

The conclusions below distinguish current facts from recommended future behavior.

---

# 4. Current Retry Capability

**Confirmed:** no explicit or automatic retry API exists. Later ordinary mutations
may incidentally converge storage because each authored write persists a complete
current snapshot. The store retains the latest status for two surfaces, but it
retains no failed payload, operation queue, operation name, or desired-condition
kind.

`persistState(state)` derives a complete authored representation from current
state. `persistProfiles(state.savedProfiles)` writes the complete current profile
collection. `clearLocalData()` resets runtime, removes both keys independently,
updates both retained statuses, notifies once, and returns both removal outcomes.

---

# 5. Retryable Surfaces

Only these current durable surfaces are in scope:

1. active authored-state local storage;
2. saved-profile collection local storage; and
3. the absence condition for either key after clear.

Backup download, Preview, scheduling, friction, suggested fixes, unsupported
versions, migration population convergence, and arbitrary browser operations are
not ordinary retry surfaces.

---

# 6. Candidate Retry Models

**Model A — original failed mutation:** rejected. It needs command history, can
reapply side effects or stale intent, and is unnecessary with complete writers.

**Model B — current full snapshot:** adopted for ordinary active/profile writes.
It preserves latest runtime intent without a queue, but alone mishandles clear.

**Model C — last failed snapshot:** rejected. It can overwrite subsequent runtime
edits and makes stale session intent authoritative.

**Model D — workflow replays original action:** rejected. It duplicates domain
mutation, timestamps, Preview effects, and notifications while distributing store
authority into UI workflows.

**Model E — current desired durable condition:** adopted as the general concept.
For ordinary state it means the latest complete snapshot; after clear it means key
absence. It retains intent kind, not historical payload.

---

# 7. Retry Decision Matrix

| Model | Preserves Latest Runtime Intent | Needs Mutation History | Handles Subsequent Edits | Handles Clear Correctly | Complexity | Store Ownership | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Original failed mutation | No | Yes | No; can replay stale intent | Only with queued clear operations | High | Store-local but history-heavy | Reject |
| Current full snapshot | Yes | No | Yes | No; could write defaults after clear | Low | Strong | Adopt for snapshot condition only |
| Last failed snapshot | No | Retains snapshot history | No | Only with extra operation kind | Medium | Strong but stale | Reject |
| Workflow replays action | Unreliable | Workflow must remember action | Can duplicate or overwrite | Repeats domain clear and notification | High/distributed | Weak | Reject |
| Current desired durable condition | Yes | No | Yes | Yes: distinguishes snapshot/absence | Moderate and bounded | Strong | **Adopt** |

---

# 8. Recommended Retry Contract

Normative flow:

```text
workflow/user requests retry for one surface
  → store checks retained status and desired-condition kind
  → if eligible, store derives the latest snapshot or selects removal
  → exactly one existing persistence/removal helper attempt
  → exact outcome updates only that surface's retained status
  → no DayFrameState assignment or state notification
  → attempt/not-attempted result returned
```

Retry means: **attempt again to establish the store's current intended durable
condition**. It never means “repeat the user's last command.”

---

# 9. Active-State Retry Source

For `desiredCondition: "snapshot"`, the authoritative input is the active authored
fields in current runtime state at retry time. The existing `persistState(state)`
path is sufficient and intentionally excludes Preview and profiles. No failed
snapshot needs retention.

---

# 10. Profile Retry Source

For `desiredCondition: "snapshot"`, the authoritative input is the complete current
`state.savedProfiles` collection. This safely folds failed save/delete operations
and all later profile changes into one current representation. A per-profile queue
would preserve stale operations rather than current intent and is unnecessary.

---

# 11. Desired Durable Condition

The store must conceptually retain per surface:

```ts
type DesiredDurableCondition = "snapshot" | "absent";
```

Ordinary active/profile mutations set their affected surface to `snapshot` before
or with the persistence attempt. Clear sets both surfaces to `absent` before or
with their removal attempts. This metadata belongs beside `StoreDurabilityStatus`
in private store infrastructure state. It is not persisted, placed in
`DayFrameState`, exposed to state subscribers, or treated as migration evidence.

On new store construction, current runtime content alone does not establish a
retryable failed operation. Desired-condition metadata may initialize to snapshot
for internal completeness, but retry eligibility still requires a known retryable
failure; alternatively it may initialize as `unknown` until an operation. The next
implementation task should choose the smallest internal representation without
changing the decisions here.

---

# 12. Retry Versus Incidental Convergence

An ordinary mutation changes domain/runtime state, attempts persistence, notifies
state subscribers, and returns `{ state, persistence }`. It may incidentally replace
a failure status with `durable`.

Explicit retry makes no domain mutation and exists solely to re-attempt the current
desired durable condition. It updates durability knowledge, sends no ordinary state
notification, and returns a retry result. Both can establish current convergence;
only the ordinary mutation changes runtime truth.

---

# 13. Retry Result Contract

The smallest truthful future contract is a discriminated result:

```ts
type DurabilityRetryResult =
  | {
      status: "attempted";
      desiredCondition: "snapshot";
      persistence: PersistenceWriteOutcome;
    }
  | {
      status: "attempted";
      desiredCondition: "absent";
      persistence: PersistenceRemovalOutcome;
    }
  | {
      status: "notAttempted";
      reason: "unknown" | "alreadyDurable" | "serializationFailure";
    };
```

It does not return `DayFrameState`, because retry neither changes nor publishes
state. Exact factual outcome categories must not be reduced to a boolean. The
initiating workflow can inspect this result immediately.

---

# 14. Retry From `unknown`

**Recommended:** do not attempt. `unknown` means no failed durable operation is
known for this store instance. Treating it as retry would blur recovery with a
generic “persist now” command. Return `notAttempted: unknown` without changing
status. Add a force-persist operation only if a distinct executable need emerges.

---

# 15. Retry From `durable`

**Recommended:** do not attempt. The surface is already known to match its current
desired condition. Return `notAttempted: alreadyDurable` and retain `durable`.
Repeated recovery requests therefore avoid unnecessary storage writes. A force
persist command, if ever justified, is separate from retry.

---

# 16. Storage-Unavailable Retry

`unavailable` is explicitly retryable by user/workflow request. One attempt uses the
existing helper and therefore rechecks availability at attempt time. Continued
absence returns `unavailable`; restored availability may yield `persisted` or
`removed` and `durable`. No polling, focus listener, timer, or automatic backoff is
adopted.

---

# 17. Storage-Failure Retry

`storageFailure` is ordinarily retryable from the current desired condition. The
store does not infer quota, browser policy, or cause. It makes one factual attempt,
retains the exact latest outcome, and returns it.

---

# 18. Serialization-Failure Retry

Blind retry of unchanged data is blocked. Serialization failure is materially
different from transport/storage availability and may reflect an invalid runtime
value or programming/integrity fault. A retry request returns
`notAttempted: serializationFailure`, leaves the retained status unchanged, and
directs future workflow policy toward data change, diagnosis, or recovery.

A later ordinary authored mutation that changes the current snapshot may attempt
normal persistence and can establish convergence. A future explicit recovery
operation could also define a repaired snapshot. Neither is a blind retry.

Removal has no serialization step, so clear retry never has this category.

---

# 19. Storage-Accessor Exception

**Confirmed:** `getStorage()` reads `globalThis.localStorage` outside helper
`try/catch`; an accessor exception propagates instead of producing an outcome.

**Recommended:** normalize accessor exceptions consistently for ordinary writes,
removals, and retries at the persistence-helper boundary, not only inside retry.
Retry should not invent a private exception classification that disagrees with
mutation behavior. Because normalization can alter mutation continuation and
notification semantics, it requires a separate bounded implementation decision or
an explicitly authorized prerequisite—not Task 1.28.

Until aligned, a future retry implementation must not claim that every attempt
returns a factual outcome.

---

# 20. Retry Initiation Authority

> **A workflow or user-facing recovery flow may initiate ordinary durability
> retry. The store executes it and interprets the persistence result.**

No current evidence justifies automatic retry immediately, on a timer, on focus,
or on a network-style reconnect event. Incidental convergence on a later ordinary
mutation remains current behavior, not automatic retry policy.

---

# 21. Retry Execution Authority

The store owns source selection, desired-condition interpretation, helper
invocation, retained-status update, and retry result construction. Persistence
helpers continue to report facts only. Workflows must not select snapshots, invoke
helpers directly, replay commands, or update durability status.

---

# 22. Retry API Shape Recommendation

Prefer explicit store methods:

```ts
retryActivePersistence(): DurabilityRetryResult;
retryProfilePersistence(): DurabilityRetryResult;
```

These names match the two present surfaces, keep call sites type-safe and readable,
and avoid a generic surface registry before one exists. Both may share a private
implementation helper. `retryDurability(surface)` is defensible but currently adds
abstraction without reducing policy complexity; desired condition still varies per
surface.

Do not add `retryClearLocalData()`: once desired-condition metadata exists, the two
surface-specific methods can correctly retry absence independently. A workflow may
invoke each unresolved surface and aggregate results if clear-specific UX later
requires it.

---

# 23. State-Subscriber Semantics

> **An explicit durability retry does not notify ordinary `DayFrameState`
> subscribers when runtime state does not change.**

The subscriber contract communicates runtime truth only. Fake reassignment or
notification would imply a domain transition, cause unnecessary renders, and blur
the infrastructure boundary. Retry must be idempotent with respect to runtime
state.

---

# 24. Durability-Subscription Determination

Retry creates a path where durability status can change without a state
notification, but that fact alone does not prove a reactive consumer exists. The
initiator receives the retry result and can synchronously call the existing
accessor. Therefore Task 1.29/1.30 should not add a durability subscription.

Add a separate durability subscription only when an actual global/reactive
consumer is authorized. Never overload the ordinary state subscription.

---

# 25. Active Retry Semantics

| Condition | Retry source | Operation | Runtime mutation | State notification | Status/result |
| --- | --- | --- | --- | --- | --- |
| Snapshot non-durable | Current authored runtime fields | `persistState(currentState)` once | No | No | Latest write outcome; success → `durable` |
| Cleared, removal failed | Desired condition `absent` | `clearPersistedState()` once | No | No | Latest removal outcome; success → `durable` |

No active retry reloads a checkpoint or source profile and no historical payload is
retained.

---

# 26. Profile Retry Semantics

| Condition | Retry source | Operation | Runtime mutation | State notification | Status/result |
| --- | --- | --- | --- | --- | --- |
| Collection non-durable | Current complete `savedProfiles` | `persistProfiles(currentProfiles)` once | No | No | Latest write outcome; success → `durable` |
| Cleared, removal failed | Desired condition `absent` | `clearPersistedProfiles()` once | No | No | Latest removal outcome; success → `durable` |

Failed saves, deletes, and subsequent profile edits need no per-profile queue.

---

# 27. Clear Retry Semantics

Clear retry is per unresolved surface and repeats removal for a surface whose
desired condition is `absent`. It must not persist default active state or an empty
profile collection because that changes the durable representation from key
absence to a present payload.

Re-removing both keys would be technically idempotent in ordinary localStorage but
is unnecessary and discards the independence represented by partial clear. The
recommended API retries only the requested surface. A successful removal updates
only that surface to `durable`; the other surface is untouched.

---

# 28. Clear Intent Sufficiency

> **No. The current retained durability model does not contain enough information
> to retry a failed clear safely.**

For example, `activeState: storageFailure` can follow either a failed snapshot write
or a failed removal. Runtime default values after clear do not prove absence intent:
the same values may exist through initialization or ordinary authored mutation.
`durable` likewise records success without distinguishing persisted payload from
successful absence.

The smallest missing fact is the per-surface current desired durable condition:
`snapshot | absent`. No failed payload, timestamp, mutation queue, or full operation
history is required.

---

# 29. Profile-Load Recovery Context

After profile load and failed active persistence, active retry persists the latest
current runtime authored snapshot. It does not reload the source profile, because
the user may have edited runtime state afterward. The profile remains a recovery
checkpoint that a separate recovery choice may select; it is not retry input.

---

# 30. Backup-Import Recovery Context

After backup import and failed active persistence, active retry persists the latest
current runtime authored snapshot. It does not re-validate or re-import the
original backup. The external backup remains a recovery source, not the authority
for retry after subsequent session changes.

---

# 31. Retry After Subsequent Runtime Changes

Retry always uses the latest current desired condition at retry time. If import
fails to persist and later Setup edits also fail, retry persists the post-edit
runtime snapshot. If a later clear establishes absence intent, retry removes the
key instead. Historical failure ordering has no authority over newer session
intent.

---

# 32. Retry Idempotence

Each eligible invocation performs exactly one write or removal attempt. Repeated
attempts do not mutate/reassign runtime state, regenerate Preview, change
timestamps, replay domain actions, or notify ordinary subscribers. They may change
retained durability status to reflect each latest outcome. Calls from `unknown`,
`durable`, or `serializationFailure` perform no storage operation.

A successful complete snapshot establishes current-surface durability regardless
of how many earlier writes failed. It makes no claim that intermediate snapshots
were durable.

---

# 33. Status Transition Matrix

Snapshot retry:

| Current Status | Retry Decision/Outcome | New Retained Status |
| --- | --- | --- |
| `storageFailure` | `persisted` | `durable` |
| `storageFailure` | `storageFailure` | `storageFailure` |
| `storageFailure` | `unavailable` | `unavailable` |
| `storageFailure` | `serializationFailure` | `serializationFailure` |
| `unavailable` | `persisted` | `durable` |
| `unavailable` | `unavailable` | `unavailable` |
| `unavailable` | `storageFailure` | `storageFailure` |
| `unavailable` | `serializationFailure` | `serializationFailure` |
| `serializationFailure` | Not attempted | `serializationFailure` |
| `durable` | Not attempted | `durable` |
| `unknown` | Not attempted | `unknown` |

Removal retry differs only in available outcomes:

| Current Status | Removal Outcome | New Retained Status |
| --- | --- | --- |
| `storageFailure` | `removed` | `durable` |
| `storageFailure` | `storageFailure` | `storageFailure` |
| `storageFailure` | `unavailable` | `unavailable` |
| `unavailable` | `removed` | `durable` |
| `unavailable` | `storageFailure` | `storageFailure` |
| `unavailable` | `unavailable` | `unavailable` |

Each transition affects only the retried surface. The newest factual attempt
replaces the prior status; no failure history is retained.

Required surface matrix:

| Surface/Condition | Retry Source | Retry Operation | Runtime Mutation? | State Notification? | Status Update | Result |
| --- | --- | --- | ---: | ---: | --- | --- |
| Active snapshot non-durable | Latest runtime authored fields | Full active write | No | No | Exact latest outcome | Attempt result |
| Profiles snapshot non-durable | Latest complete profile collection | Full profile write | No | No | Exact latest outcome | Attempt result |
| Active cleared-but-removal-failed | Retained `absent` condition | Active-key removal | No | No | Exact latest outcome | Attempt result |
| Profiles cleared-but-removal-failed | Retained `absent` condition | Profile-key removal | No | No | Exact latest outcome | Attempt result |
| `unavailable` | Current desired condition | One recheck/attempt | No | No | Exact latest outcome | Attempt result |
| `serializationFailure` | None until state/recovery changes | No blind attempt | No | No | Unchanged | Not-attempted result |

---

# 34. Recovery Versus Retry

**Retry** attempts to establish the same current desired durable condition again.
It does not choose new domain data.

**Recovery** chooses, repairs, or reconstructs a different state/source because the
current condition cannot or should not simply be retried. Storage failure and
unavailability ordinarily permit retry. Serialization failure, unsupported durable
format, invalid source data, and deliberate checkpoint restoration may require
recovery. Recovery remains workflow/architecture-specific and is not implemented.

---

# 35. Migration Retry Separation

Ordinary retry persists/removes a current store surface. Migration retry completes
a versioned transformation and must durably establish migration evidence under the
ADR. Ordinary `durable` status, including after retry, is not proof of migration,
population convergence, version adoption, or compatibility-reader retirement.
Migration initiation/execution remains at the migration subsystem/store migration
boundary.

---

# 36. Ownership Map

| Responsibility | Recommended Owner |
| --- | --- |
| Determine current retry source | Store |
| Execute active retry | Store |
| Execute profile retry | Store |
| Execute clear retry | Store, per surface using desired condition |
| Update retained durability status | Store |
| Initiate user-requested retry | Workflow/user-facing recovery flow |
| Decide automatic retry policy | Future architectural decision; none adopted |
| Interpret serialization failure | Store classifies; workflow/recovery policy responds |
| Choose recovery instead of retry | Workflow/user under recovery contract |
| Notify runtime-state subscribers | Store; no notification for retry-only change |
| Notify future durability consumers | Separate durability channel if later justified |
| Migration retry | Migration subsystem/store migration boundary |

Normative ownership statement:

> **Workflows/users initiate ordinary retry; the DayFrame store exclusively selects
> current retry input, executes the applicable helper, interprets the result,
> updates retained durability knowledge, and returns the exact outcome.**

Normative source statement:

> **After any failed attempts and subsequent runtime changes, the current desired
> durable condition is authoritative: the latest complete runtime snapshot for an
> ordinary surface, or key absence after clear.**

---

# 37. ADR Alignment

| ADR concern | Alignment |
| --- | --- |
| Session-first runtime authority | Latest runtime intent, not stale failures, drives retry |
| User-data preservation | No rollback or stale overwrite; last checkpoint remains until success |
| Non-destructive behavior | Retry neither mutates runtime nor replays actions |
| Deterministic store ownership | Store selects and executes the persistence/removal path |
| Explicit observability | Exact outcomes and retained statuses remain distinct facts |
| Retryability | Eligible failures receive one deliberate attempt from current intent |
| Recovery separation | Serialization/unsupported data are not mislabeled as transient retry |
| Migration evidence | Ordinary durable status cannot prove migration completion |
| Epistemic integrity | Unknown/durable are not falsely described as failed work; clear intent is represented explicitly |

The model avoids the ADR's principal risk here: overwriting newer user intent with
a historical snapshot merely because that snapshot failed earlier.

---

# 38. Implementation Consequences

The smallest safe sequence is staged:

1. retain private per-surface desired durable condition outside `DayFrameState`;
2. set `snapshot` for ordinary affected-surface writes and `absent` for clear;
3. directly test condition replacement, especially mutation-after-clear and
   clear-after-mutation;
4. normalize storage-accessor exceptions consistently in an explicitly authorized
   helper-boundary task before claiming total retry outcomes;
5. add the two surface-specific retry methods and discriminated result;
6. gate attempts to `storageFailure` and `unavailable`;
7. route snapshot/absence to exactly one existing helper;
8. update only affected retained status and do not call `notify()`; and
9. directly test source freshness, partial clear, transitions, no notifications,
   and no-op preconditions.

No persistence service, mutation queue, historical snapshot, domain-state field,
new durable schema, or subscription is justified.

---

# 39. Unresolved Questions

No question blocks the architectural contract.

The exact internal initialization shape for desired-condition metadata and whether
storage-accessor normalization is its own task or a prerequisite within the later
retry task remain bounded implementation-planning choices. Neither changes the
normative rule that retry requires a known eligible failure and the latest desired
condition.

Future UI placement, wording, aggregation of two clear-surface results, durability
subscription demand, automatic policy, telemetry, and recovery UX remain
unresolved because they lack an authorized consumer or requirements.

---

# 40. Deviations

No deviations. Only this separate result artifact was created. The immutable Task
1.28 specification, production code, tests, governance documents, ADR, and Tasks
1.23–1.27 artifacts were not modified.

---

# 41. Discoveries and Deferred Work

- Current snapshot persistence already supplies convergence for ordinary surfaces.
- Clear exposes a semantic distinction hidden by normalized durability status:
  `durable` can mean a payload exists or that absence was established.
- Desired-condition kind is sufficient; historical payload retention is not.
- Retry alone does not justify a reactive durability subscription.
- Serialization failure needs recovery-oriented handling, not repeated unchanged
  writes.
- Storage-accessor normalization remains a prerequisite for a fully total retry
  result contract.
- UI feedback, explicit recovery, automatic retry, read failures, migrations, and
  compatibility retirement remain deferred.

---

# 42. Recommended Next Task

**Implementation Task 1.29 — Retain Per-Surface Desired Durable Condition Outside
`DayFrameState`.**

This should add only the smallest private `snapshot | absent` representation,
update it from existing ordinary persistence and clear paths, preserve all current
results/notifications/UI behavior, and directly test intent replacement. It should
not yet add retry APIs, automatic behavior, UI, subscriptions, migration state, or
durable-format changes.

A following bounded task should normalize storage-accessor failures consistently
if not already authorized, then implement store-owned surface retry under this
contract.

---

# 43. Validation

Completed investigation validation:

```text
Artifact integrity
attachment and saved task: 1,662 lines, 39,727 bytes
SHA-256: 24baf7140612fcd73d485cd19c1e501001d01883280bf2db11542526b9d62aee
byte comparison: identical

Targeted store baseline
npm test -- src/state/tests/dayFrameStore.test.ts
Test Files  1 passed (1)
Tests      47 passed (47)

Reference audit
confirmed: no retry API, automatic retry, durability subscription, or UI durability consumer
confirmed: active/profile writers use complete current representations
confirmed: clear performs independent removals
confirmed: state subscriptions receive DayFrameState only
```

Repository-standard validation is recorded after final execution below.

```text
npm run lint
passed

npm run typecheck
passed

npm test
Test Files  22 passed (22)
Tests      268 passed (268)

npm run build
passed (TypeScript validation and Vite production build; 42 modules transformed)
```

---

# 44. Final Completion Determination

Task 1.28 is complete from an investigation and architectural-contract standpoint.
DayFrame now has an evidence-backed definition of retry source, eligibility,
execution and initiation authority, exact result/status behavior, subscriber
silence, active/profile/clear distinctions, recovery and migration boundaries, and
the smallest safe implementation seam. No executable behavior changed.
