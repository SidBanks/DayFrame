# Task 2.18 — Implement Active-Local Historical Ingress Safe Fallback and Checkpoint Protection

**Project:** DayFrame
**Phase:** Phase 2 — Authority and State Alignment
**Task ID:** 2.18
**Execution Type:** Bounded Implementation
**Status:** Ready for execution

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before performing implementation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution results must be recorded separately in:

`TASK_2.18_IMPLEMENT_ACTIVE_LOCAL_INGRESS_SAFE_FALLBACK_AND_CHECKPOINT_PROTECTION_RESULT.md`

This task authorizes a bounded active-local historical-ingress implementation.

Do not expand this task into:

* profile raw-record preservation redesign;
* backup conversion;
* source-incarnation implementation;
* PlanDecision;
* migration tooling;
* repair/remapping;
* destructive recovery workflows;
* broad recovery UX;
* new durable recovery artifact formats;
* durable checkpoint copies under new storage keys.

If exact checkpoint preservation and write protection cannot be implemented safely without a new durable surface, stop the affected work and record the blocker rather than inventing a new durable format.

---

# 2. Purpose

Task 2.15 established that newly proposed current authored mutations must validate before becoming runtime authority.

Task 2.16 established the historical authored-ingress contract.

Task 2.17 implemented that contract for:

* selected saved-profile load;
* backup import.

Those surfaces can reject invalid historical input while preserving an already-valid active runtime.

Active local-state startup is different.

At application construction, DayFrame may discover that the persisted active authored checkpoint is:

* parseable but semantically invalid;
* ambiguous;
* structurally invalid;
* corrupt;
* or otherwise unsafe to activate.

DayFrame must still construct a usable store.

Task 2.16 adopted:

```
invalid active checkpoint
    ↓
do not activate
    ↓
preserve exact checkpoint
    ↓
construct known-safe fallback runtime
    ↓
retain recovery-required ingress status
    ↓
block ordinary active writes and active retry
    ↓
await explicit recovery or abandonment
```

Task 2.18 implements the minimum infrastructure required to make that contract executable.

---

# 3. Governing Decisions

Task 2.16 adopted the following active-local policy:

1. supported historical representation is normalized before semantic validation;
2. valid normalized historical state may activate;
3. advisory-only state may activate;
4. invalid or ambiguous historical state may not activate;
5. corrupt/structurally invalid state may not activate;
6. invalid source data must remain preserved;
7. safe runtime fallback uses the known-valid authored defaults from `createInitialDayFrameState()`;
8. fallback must not be described as restored user data;
9. ordinary active persistence must not overwrite the protected checkpoint;
10. active durability retry must also respect the protection;
11. ingress/recovery status belongs outside `DayFrameState`;
12. ingress recovery is separate from durability;
13. active-local recovery condition must be queryable and subscribable;
14. explicit recovery/abandonment workflows remain separate future work;
15. no partial authored activation is allowed;
16. in-memory normalization/validation is not migration evidence.

Task 2.18 must implement only those minimum infrastructure behaviors.

---

# 4. Objective

Implement:

1. protected active-local read classification;
2. compatibility normalization before semantic validation;
3. semantic validation before activation;
4. known-safe runtime fallback when historical checkpoint cannot activate;
5. exact preservation of the original persisted active payload;
6. retained active-local ingress status outside `DayFrameState`;
7. a read accessor for that retained status;
8. a dedicated subscription for active-local ingress status;
9. active persistence write guard while recovery protection is active;
10. active retry guard while recovery protection is active;
11. valid-local activation regression preservation;
12. unavailable-storage/default startup preservation;
13. explicit separation from durability status;
14. no recovery/repair action yet.

---

# 5. Active Local Surface Only

Task 2.18 concerns only:

`dayframe-store-v1`

or the current exact active-state persistence key.

Do not alter:

* saved-profile ingress;
* backup ingress;
* profile collection format;
* backup format;
* profile validation results;
* backup validation results.

---

# 6. Existing Active Local Pipeline

Before implementation, confirm the actual current pipeline.

Conceptually Task 2.16 found:

```
get localStorage
    ↓
getItem(active key)
    ↓
JSON.parse
    ↓
createInitialDayFrameState / compatibility normalization
    ↓
optional injected state merge
    ↓
runtime authority
```

Current shortcomings include:

* malformed JSON may collapse to defaults;
* some storage/read failures collapse to absence/default;
* no semantic validation gate;
* original payload may remain hidden but later be overwritten;
* some malformed nested structures may throw;
* no retained ingress status.

Document exact executable behavior before changing it.

---

# 7. Required Read Pipeline After Implementation

The active-local pipeline should conceptually become:

```
acquire storage
    ↓
read active key
    ↓
classify source availability
    ↓
if payload exists:
    preserve exact raw string
    ↓
    parse
    ↓
    compatibility normalize
    ↓
    derive complete DayFrameAuthoredSetup
    ↓
    validateDayFrameAuthoredSetup
    ↓
    classify ingress result
    ↓
    accepted
        → activate normalized authored state

    recoveryRequired
        → activate safe fallback
        → retain protected-source status
        → preserve raw key untouched
```

Do not perform an automatic active write during store construction.

---

# 8. Active Ingress Status

Introduce retained store infrastructure state outside `DayFrameState`.

Use the smallest discriminated model that truthfully distinguishes normal startup from protected recovery.

Conceptually:

```
type ActiveLocalIngressStatus =
  | { status: "healthy" | "none" ... }
  | {
      status: "recoveryRequired";
      reason: ...;
      sourcePreserved: true;
      activationBlocked: true;
      ...
    }
```

Exact naming should follow repository conventions.

Do not expose raw authored source data through the public status unless required.

---

# 9. Status Semantics

The retained status must distinguish at least:

## No persisted active source

Normal safe defaults because no checkpoint exists.

This is not recovery-required.

## Accepted persisted active source

Persisted source successfully parsed/normalized/validated and became authority.

No recovery-required state.

## Recovery-required persisted source

A payload existed but could not safely become authority.

Safe fallback is active and the original persisted source is protected.

---

# 10. Failure Categories

Where current executable evidence permits, preserve distinctions such as:

* corrupt/unreadable;
* structurally invalid;
* semantically invalid;
* ambiguous;
* unsupported format if representable.

Do not invent a false local format version because the current active payload is versionless.

If precise distinction cannot be established at the current reader boundary, use the smallest truthful category and retain diagnostic facts.

---

# 11. Storage Unavailable At Construction

Absence/unavailability of local storage is not the same as an invalid historical checkpoint.

If:

* storage does not exist;
* the key does not exist;

continue to construct from defaults under existing semantics.

Do not create recovery-required state merely because no checkpoint is available.

If storage access itself throws during read, classify according to the narrowest evidence-supported read-ingress semantics.

Do not reuse write durability status automatically.

---

# 12. Exact Raw Checkpoint Preservation

When a payload exists but cannot activate, preserve:

> the exact raw string returned by `getItem`.

Do not:

* rewrite it;
* pretty-print it;
* normalize it back into storage;
* replace it with fallback state;
* remove it.

The key's current bytes/string value must remain unchanged.

---

# 13. Preservation Authority

The existing local-storage key itself may serve as the preserved checkpoint for Task 2.18.

Do not create:

* recovery-copy key;
* backup key;
* migration key;
* new durable envelope.

Task 2.18 protects the existing source in place by blocking writes.

---

# 14. Safe Fallback Runtime

When activation is blocked, construct runtime authored authority from the known-valid authored defaults of:

`createInitialDayFrameState()`

Preserve separately loaded saved profiles according to current initialization behavior.

Safe fallback must contain:

* valid default scheduling preferences;
* valid default Preview range;
* empty/default active authored collections;
* null Preview unless another existing construction rule explicitly applies.

Do not copy partial authored values from the invalid source.

No partial activation.

---

# 15. Safe Fallback Is Not Recovery

The fallback runtime is temporary safe session authority.

It is not:

* migrated user data;
* repaired user data;
* restored user data;
* evidence that the historical checkpoint was successfully handled.

The ingress status must retain the recovery-required condition.

---

# 16. Injected Initial State Boundary

Task 2.16 classified injected `Partial<DayFrameState>` as a separate test/composition seam.

Do not automatically treat injected initial state as historical recovery data.

Determine the smallest implementation rule that preserves current tests/composition while preventing injected state from accidentally overwriting or disguising protected historical ingress.

Prefer to keep active-local recovery classification based on durable source facts before injected-state composition.

Document exact behavior.

---

# 17. Seeded Store Boundary

Preserve the current corrected seeded/demo-store semantics from earlier Phase 2 work.

Demo seed data must not:

* overwrite a protected invalid checkpoint;
* cause active persistence while the write guard is active;
* masquerade as recovered historical state.

If the default app seeded-store path would perform authoritative setter writes after safe fallback, those writes must be prevented from overwriting the protected checkpoint.

This is mandatory.

---

# 18. Active Write Guard

While active-local ingress status is recovery-required, ordinary active persistence must not write to the protected active key.

The guard must apply to every current path that would persist active authored state.

At minimum audit:

* `commitAuthoredSetup`;
* scheduling preferences setter;
* Preview range setter;
* shift definitions setter;
* shift cycles setter;
* templates setter;
* recurrences setter;
* manual events setter;
* valid profile load;
* valid backup import;
* demo/seed mutations;
* any other active persistence caller.

---

# 19. Runtime Mutation While Protected

Task 2.16 adopted the minimum policy:

> runtime may remain usable, but active durable writes are blocked.

Therefore valid current mutations may still become session runtime authority while recovery protection is active, unless implementation evidence proves this unsafe.

The result must distinguish:

```
runtime mutation applied
    +
active persistence intentionally blocked by ingress recovery
```

from:

```
storage unavailable/failure
```

Do not misclassify the guard as a storage failure.

---

# 20. Guarded Persistence Outcome

Current `PersistenceWriteOutcome` values describe actual persistence attempts.

A write blocked by ingress policy is **not**:

* `persisted`;
* `unavailable`;
* `storageFailure`;
* `serializationFailure`.

Do not fake one of those statuses.

Task 2.18 must determine the smallest truthful integration.

Possible options include:

## A. Store mutation result adds a policy-blocked persistence state.

## B. Current mutation result gains a separate ingress/write-protection fact.

## C. Store refuses runtime mutation entirely while protected.

Task 2.16 adopted session editing with blocked writes as the minimum policy, so C should not be chosen unless implementation evidence makes A/B impossible.

Use the smallest type-safe representation.

---

# 21. Durability Semantics During Guarded Mutation

A mutation whose active write is intentionally blocked must not falsely update active durability to:

* `storageFailure`;
* `unavailable`;
* `durable`.

The existing durability status alone may remain unchanged because no persistence attempt occurred.

Ingress status communicates why the current runtime is not being written.

Document exact semantics.

---

# 22. Desired Durable Condition During Protected Runtime Mutation

This requires explicit implementation care.

Current desired durable condition ordinarily changes to `snapshot` before/with active persistence.

During protected historical recovery, the original checkpoint must remain protected.

Do not let desired-condition metadata authorize `retryActivePersistence()` to overwrite it.

The simplest safe rule may be:

* current runtime mutation may conceptually desire a snapshot;
* active retry remains blocked by ingress protection regardless.

Or desired-condition handling may remain unchanged if the guard is authoritative.

Document the chosen behavior precisely.

---

# 23. Active Retry Guard

While active-local recovery protection is active:

`retryActivePersistence()`

must not write the current fallback/session snapshot over the historical checkpoint.

It must return an explicit non-attempt result.

Do not return:

* `alreadyDurable`;
* `unknown`;
* `serializationFailure`

unless those values truthfully describe the reason.

A new retry non-attempt reason such as:

`recoveryProtected`

or equivalent may be required.

Use the smallest discriminated extension.

---

# 24. Profile Persistence Independence

The active-local protection applies to the **active authored-state durable surface**.

It must not automatically block:

* profile collection persistence;
* profile save;
* profile delete.

Those use a separate durable surface.

However, saving a profile from safe fallback/session-only current state may have product/recovery implications.

Task 2.18 should preserve existing profile persistence unless direct evidence makes it unsafe.

Document the consequence for future recovery UX.

---

# 25. Profile Load As Recovery Is Not Implemented Yet

A valid profile load could eventually be an explicit recovery action.

Task 2.18 must not automatically interpret ordinary profile load as permission to overwrite the protected active checkpoint.

Therefore while recovery protection is active:

* profile load may replace runtime state if current behavior allows;
* its automatic active persistence must remain guarded.

Do not clear recovery-required status merely because runtime replacement occurred.

Recovery completion requires a separately authorized explicit action.

---

# 26. Backup Import As Recovery Is Not Implemented Yet

Same rule.

A valid backup import may change runtime authority but must not silently overwrite the protected local checkpoint while ingress recovery is active.

Do not clear recovery status automatically.

Explicit recovery workflow comes later.

---

# 27. Clear Local Data

`clearLocalData()` is an explicit destructive operation whose semantics request absence.

Task 2.16 identified it as a possible future abandonment mechanism but required explicit recovery-aware treatment.

Task 2.18 must decide the narrowest safe behavior.

Preferred minimum:

* do not silently reinterpret ordinary clear as automatic recovery;
* preserve existing explicit clear behavior only if its existing confirmation is strong enough to constitute intentional abandonment;
* otherwise guard active removal while recovery is protected and defer abandonment.

Inspect actual UI/contract before deciding.

Do not destroy the protected checkpoint accidentally.

---

# 28. Active Removal Guard

If clear/removal is not authorized as explicit abandonment in this task, the guard must also prevent:

`clearPersistedState()`

from removing the protected active key through ordinary pathways.

Profile-key removal remains separate.

Do not block profile removal unnecessarily.

---

# 29. Recovery Completion Is Out Of Scope

Task 2.18 does not implement:

* explicit replace protected checkpoint;
* abandon checkpoint;
* export protected raw payload;
* repair;
* migration;
* conversion.

Therefore ingress status normally remains recovery-required for the duration of the store instance once detected.

Do not invent implicit completion.

---

# 30. Retained Status Accessor

Add a store accessor equivalent to:

`getActiveLocalIngressStatus()`

or appropriately named broader ingress accessor.

It must return a safe snapshot rather than mutable store-owned references.

---

# 31. Ingress Subscription

Add a dedicated subscription equivalent to:

`subscribeActiveLocalIngress(...)`

or a narrow general ingress-status subscription if justified.

Do not overload:

* ordinary `DayFrameState` subscription;
* durability subscription.

Ingress is a distinct infrastructure dimension.

---

# 32. Subscription Notification Semantics

Notify ingress subscribers only when retained ingress status actually changes.

At construction there are no subscribers yet.

Later operations in Task 2.18 should generally not clear recovery status, so notification count may be low.

Design for future recovery-state transitions without creating fake notifications.

---

# 33. No Ordinary Notification For Infrastructure-Only Changes

If ingress status changes without `DayFrameState` changing, do not notify ordinary state subscribers.

Keep the same separation established for durability.

---

# 34. UI Persistent Awareness

Task 2.16 adopted persistent awareness for invalid active local checkpoint.

Task 2.18 may add the **minimum read-only persistent awareness** needed to expose the retained status if this is necessary to avoid a hidden recovery/write-blocking condition.

Preferred behavior:

* reuse the stable `DayFrameApp` shell;
* initialize from ingress-status accessor;
* subscribe to ingress status;
* present a clear read-only warning.

Do not add recovery buttons/actions.

If the task can remain truthful without UI because a separate task is preferable, document the decision. However, invisible write blocking is undesirable.

---

# 35. Minimum Product Communication

If persistent awareness is added, it must state at minimum:

* DayFrame could not safely use the saved active setup;
* a safe temporary session state is being used;
* the prior saved checkpoint is being preserved;
* ordinary active saving is temporarily blocked to protect it;
* reload/close may discard session-only fallback edits;
* explicit recovery/abandonment action is not yet available if that is true.

Do not claim the historical checkpoint can necessarily be repaired.

---

# 36. No Recovery Control

Do not add:

* Restore;
* Replace;
* Abandon;
* Reset;
* Export;
* Repair;
* Migrate.

Read-only awareness only.

---

# 37. Durability Awareness Interaction

Existing persistent durability awareness must remain conceptually distinct.

During active recovery protection:

* ingress warning explains protected historical source/write blocking;
* durability warning should not invent a failed persistence attempt merely because writes are guarded.

Avoid duplicate contradictory messages.

---

# 38. Construction Status — Healthy Persisted Data

Valid current persisted data:

* activates;
* ingress status is healthy/non-actionable;
* no ingress warning;
* ordinary persistence works normally.

---

# 39. Construction Status — Valid Legacy Data

Valid supported historical singular-cycle data:

* compatibility normalizes;
* semantic validation passes;
* activates;
* no recovery-required status solely because legacy representation was used.

Do not claim migration complete.

---

# 40. Construction Status — Advisory-Only Data

Valid authored state with advisories:

* activates;
* no recovery-required status;
* advisories need not receive persistent ingress warning unless current architecture already exposes them.

---

# 41. Construction Status — Semantic Invalidity

A persisted payload that normalizes but fails Task 2.15 validator:

* does not activate;
* safe fallback activates;
* exact raw payload remains;
* recovery-required ingress status retained;
* active writes/retry guarded.

Direct test required.

---

# 42. Construction Status — Ambiguity

Representative duplicate-linked source state:

* same treatment as recovery-required invalidity;
* preserve validator evidence;
* if ambiguity classification is available, retain it.

Do not choose a referent.

---

# 43. Construction Status — Malformed JSON

Malformed active JSON:

* safe fallback;
* raw payload preserved;
* recovery/corrupt status retained;
* write guard active.

Do not silently behave exactly like key absence.

---

# 44. Construction Status — Structural Failure

If parse succeeds but normalization/shape handling cannot produce a safe complete authored setup:

* catch expected historical-ingress failure;
* safe fallback;
* preserve raw payload;
* retain structural/corrupt classification;
* do not throw where a safe fallback is possible.

Do not swallow unexpected programmer faults indiscriminately.

---

# 45. Storage Accessor Failure On Read

Task 1.30 deliberately left read accessor failure distinct.

Task 2.18 must determine whether a throwing `localStorage` accessor at construction can now be safely classified without a source payload.

Important distinction:

```
accessor failure
    ≠
invalid checkpoint
```

There may be no exact checkpoint available to preserve.

If normalizing this requires broader read-failure semantics, keep it narrowly classified and document it.

Do not pretend a protected source exists if it could not be read.

---

# 46. `getItem` Failure

Likewise distinguish:

* storage exists but `getItem` throws;
* payload read succeeds but content is invalid.

If no payload was obtained, source preservation cannot be claimed.

Use truthful status.

---

# 47. Read Failure Versus Recovery Protection

A read-access failure may justify safe defaults but may require write blocking because writing could overwrite an unreadable existing checkpoint.

Assess carefully.

Conservative bias:

> If DayFrame cannot establish that no checkpoint exists, do not overwrite the active key automatically.

If adopted, classify as protected/unreadable-source condition even without captured raw bytes.

Document preservation limits.

---

# 48. Exact Storage Byte Test

For invalid/corrupt source whose raw string is readable:

1. seed exact active-key string;
2. construct store;
3. verify fallback;
4. perform ordinary current mutation;
5. invoke active retry;
6. verify active-key string remains byte-for-byte identical.

This is a mandatory end-to-end protection test.

---

# 49. Profile Surface Byte Independence

While active write guard is enabled, profile save/delete should still be able to write the profile key if otherwise valid.

Add a direct test if practical.

This proves surface independence.

---

# 50. Mutation Result Under Write Guard

Production workflows need a truthful result when runtime mutation succeeds but persistence is policy-blocked.

Do not let existing workflow code report:

* durable success;
* storage unavailable;
* storage failure.

Introduce the minimum semantic signal required.

Possible conceptual result:

```
status: "applied"
state: ...
persistence:
    status: "blocked"
    reason: "activeLocalRecovery"
```

But do not alter `PersistenceWriteOutcome` if that would falsely classify a non-attempt as persistence.

A separate field may be better.

Choose based on current result architecture.

---

# 51. Durability Classifier Interaction

Task 1.34 durability classifier must not classify an ingress-policy block as a persistence failure.

Production callers must not pass blocked/no-attempt state into durability classification as though a write occurred.

Adapt narrowly.

---

# 52. Workflow Feedback Under Protected Mutation

If a user modifies Setup/manual events during protected fallback:

* runtime change applies for this session;
* active saving remains blocked;
* persistent ingress warning remains authoritative.

Immediate workflow feedback may say the change is session-only if needed.

Do not add broad UX.

---

# 53. Generate Preview During Protected Recovery

Generation derives from current runtime authority.

If runtime fallback/current session state is valid, Preview generation may continue.

Do not block scheduling merely because active persistence is protected unless existing generation requires persistence success.

A rejected authored mutation still follows Task 2.15.

---

# 54. Preview Staleness

Valid session mutation under active write guard still changes runtime authored authority.

Therefore existing Preview invalidation semantics remain.

Write protection affects durability, not derivation.

---

# 55. Store Initialization Merge

Audit `mergeInitialState` carefully.

Protected invalid durable input must not be partially merged into safe fallback.

Injected state behavior should remain intentional/test-scoped.

Document whether provided `initialState` can override fallback fields and whether that weakens production safety.

If necessary, scope the recovery guard to production persisted-source authority while allowing explicit injected composition.

Do not silently change test harness semantics unnecessarily.

---

# 56. Cloning

Retained ingress status must not expose mutable references to:

* validation issues;
* raw source representation if stored internally.

If raw payload is exposed at all, strings are immutable values; structured normalized diagnostics must be cloned as appropriate.

---

# 57. Raw Payload Retention In Memory

If exact raw payload is already preserved in local storage, storing an in-memory copy may help diagnostics.

Do not persist an additional copy.

Avoid exposing it to normal UI unless explicitly required.

---

# 58. Ingress Status Data Minimization

Retain only enough information for:

* protection policy;
* semantic classification;
* future recovery UI;
* testing.

Potential fields:

* status;
* reason/classification;
* sourceReadable/preserved;
* validation issues if available.

Do not retain unnecessary full normalized user data twice.

---

# 59. Recovery Status And Store Replacement

If `DayFrameApp` receives a replacement injected store prop:

* unsubscribe from old ingress subscription;
* initialize from replacement store status;
* subscribe to replacement.

Mirror the cleanup discipline established by durability awareness.

---

# 60. No Persistence Of Ingress Status

Ingress/recovery status is session infrastructure state.

Do not add it to:

* `DayFrameState`;
* active durable payload;
* profiles;
* backups.

The preserved historical checkpoint itself remains the durable evidence.

---

# 61. No Format Version Change

No change to active local durable schema/versioning.

The current active format remains whatever existing `dayframe-store-v1` contract provides.

Task 2.18 adds read-policy behavior, not format migration.

---

# 62. No Automatic Migration

Valid compatibility normalization remains in memory.

Do not automatically rewrite a legacy-but-valid checkpoint during construction.

Ordinary later writes continue current convergence semantics only when no recovery guard exists.

---

# 63. No Compatibility Reader Retirement

Keep singular `shiftCycle` and all currently authorized historical readers.

---

# 64. No Profile Raw-Collection Redesign

Task 2.17 identified upstream profile record loss.

Do not fix it here.

---

# 65. No Manual-Event Historical Normalization Redesign

Task 2.17 identified lossy historical manual-event normalization.

Do not fix it here.

---

# 66. No Source-Incarnation Change

OccurrenceIdentity remains V1.

Do not alter authored IDs or add incarnation tokens.

---

# 67. No PlanDecision

Do not add PlanDecision or durable occurrence references.

---

# 68. Required Reader Unit Tests

Add focused tests for active-local read classification.

At minimum:

1. no active key;
2. valid current persisted payload;
3. valid legacy singular-cycle payload;
4. advisory-only payload;
5. semantic-invalid payload;
6. ambiguous duplicate-linked payload;
7. malformed JSON;
8. representative structural-invalid payload;
9. storage unavailable;
10. accessor/getItem failure according to adopted contract.

---

# 69. Safe Fallback Test

For invalid readable checkpoint, assert resulting runtime authored state equals the known-valid safe fallback rather than:

* invalid source;
* partially normalized source;
* empty arbitrary object.

Saved profiles should follow their independent current initialization behavior.

---

# 70. Raw Preservation Test

Capture exact active key string before construction.

After fallback construction:

* string unchanged.

After current mutation:

* string unchanged.

After active retry:

* string unchanged.

After Preview generation:

* string unchanged.

---

# 71. Guarded Mutation Test

From protected fallback:

1. perform a valid authored mutation;
2. assert runtime state changes;
3. assert Preview invalidation behavior;
4. assert active key unchanged;
5. assert ingress recovery status remains;
6. assert no false persistence/durability classification.

---

# 72. Guarded Retry Test

From protected fallback:

* call `retryActivePersistence`;
* assert no storage write/removal;
* assert explicit non-attempt/protected result;
* assert checkpoint unchanged;
* assert ingress status unchanged;
* assert ordinary state subscribers not notified.

---

# 73. Profile Independence Test

While active checkpoint protection is enabled:

* save or delete profile;
* profile persistence behaves normally;
* active protected key remains unchanged.

Do not let active recovery freeze the entire application.

---

# 74. Profile Load Under Protection Test

If profile load is allowed during protected state:

* valid profile may replace runtime;
* automatic active persistence remains blocked;
* protected raw active key remains unchanged;
* recovery status remains active.

If adopted behavior differs, test exact contract.

---

# 75. Backup Import Under Protection Test

Equivalent for valid backup import if allowed.

Do not implicitly complete recovery.

---

# 76. Clear Test

Directly test the adopted clear/removal policy under checkpoint protection.

The protected active checkpoint must not disappear accidentally.

Profile clear behavior should remain separately truthful.

---

# 77. Healthy Persistence Regression

For a store without recovery-required ingress:

* current mutation writes active state normally;
* retry behaves normally;
* clear behaves normally.

The guard must be conditional, not global.

---

# 78. Durability Regression

Healthy valid mutation + persistence failure retains all Phase 1 semantics.

Do not disturb existing durability statuses, retry eligibility, or notifications.

---

# 79. Advisory Activation Test

Persist a semantically valid setup with unsupported recurrence advisory.

Assert:

* source activates;
* no recovery guard;
* ordinary active writes remain enabled.

---

# 80. Legacy Activation Test

Persist valid singular-cycle legacy payload.

Assert:

* compatibility normalization;
* valid runtime activation;
* no recovery guard;
* no construction write;
* compatibility reader preserved.

---

# 81. Persistent Awareness Tests

If app-level awareness is implemented:

* healthy/no-source startup is silent;
* invalid checkpoint shows awareness;
* message survives in-app navigation;
* ordinary session mutations do not clear it;
* no recovery button exists;
* durability awareness remains separately correct;
* replacement store cleanup works.

---

# 82. Accessibility

Any persistent ingress warning should:

* be a labelled semantic region;
* communicate status textually;
* not rely on color;
* avoid aggressive repeated live-region announcements;
* contain no disabled/false recovery actions.

---

# 83. Production Reference Audit

After implementation audit every active persistence/removal path.

Confirm checkpoint protection covers:

* all active writes;
* active retry;
* active removal if applicable;
* profile-load active write;
* backup-import active write;
* seeded/demo active writes.

Confirm it does not incorrectly block:

* profile-key writes;
* Preview generation;
* state notifications for valid runtime mutations.

---

# 84. Expected Files To Change

Likely:

* `code/src/state/types.ts`;
* `code/src/state/dayFrameStore.ts`;
* perhaps a narrow active-ingress helper/module;
* store tests;
* possibly `code/src/ui/DayFrameApp.tsx`;
* UI tests if awareness is added.

Potential initialization helpers may change if necessary.

Do not expand beyond this set without executable evidence.

---

# 85. Store API Changes

Likely additions:

* ingress status type;
* ingress accessor;
* ingress subscription;
* guarded active retry result extension;
* possibly mutation result write-protection metadata.

Keep APIs narrow and surface-specific.

Do not introduce a generic infrastructure event bus.

---

# 86. Result Artifact — Exact Read-Failure Semantics

The result must explicitly document:

* missing key;
* unavailable storage;
* accessor failure;
* `getItem` failure;
* malformed JSON;
* semantic invalidity;

and how each differs.

This is mandatory because Task 2.16 found current read behavior inconsistent.

---

# 87. Result Artifact — Clear Semantics

The result must explicitly document whether `clearLocalData`:

* is blocked;
* partially clears profiles only;
* or is treated as explicit abandonment.

Do not leave this ambiguous.

---

# 88. Result Artifact — Runtime Mutation Semantics

The result must explicitly document what a valid mutation returns while active persistence is recovery-protected.

This must be distinguishable from a real persistence attempt/failure.

---

# 89. Result Artifact — Recovery Completion

State explicitly that Task 2.18 does not implement recovery completion.

If status can clear for any reason in the implementation, document exactly why and prove it does not silently discard the checkpoint.

---

# 90. Result Artifact — Safe Fallback

State exact safe fallback contents and how profiles/injected state interact with it.

---

# 91. Required Result Artifact Structure

The Task 2.18 result must contain at least:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Prior Active-Local Pipeline
6. New Active-Local Pipeline
7. Read Classification
8. Missing-Key Semantics
9. Unavailable-Storage Semantics
10. Accessor / `getItem` Failure Semantics
11. Malformed JSON Semantics
12. Structural Failure Semantics
13. Compatibility Normalization
14. Semantic Validation Placement
15. Advisory Activation
16. Semantic Invalidity
17. Ambiguity Handling
18. Safe Fallback Runtime
19. Saved-Profile Initialization Independence
20. Injected Initial-State Semantics
21. Seeded-Store Semantics
22. Exact Checkpoint Preservation
23. Active Ingress Status Type
24. Ingress Status Accessor
25. Ingress Subscription
26. Durability Separation
27. Active Write Guard
28. Guarded Runtime Mutation Semantics
29. Desired Durable Condition Behavior
30. Active Retry Guard
31. Profile Persistence Independence
32. Profile Load Under Protection
33. Backup Import Under Protection
34. Clear / Active Removal Semantics
35. Preview Generation / Staleness Preservation
36. Persistent Awareness
37. Workflow Feedback
38. Healthy Persistence Regression
39. Durability Regression
40. Compatibility Preservation
41. Durable Format Preservation
42. OccurrenceIdentity / Source-Incarnation Preservation
43. Tests Added or Updated
44. Production Reference Audit
45. Compatibility Assessment
46. Architectural Alignment Improvement
47. Deviations
48. Discoveries and Deferred Work
49. Recommended Next Task
50. Validation
51. Final Completion Determination

---

# 92. Validation Requirements

Run focused state/initialization tests first.

At minimum:

```
active local ingress/read tests
dayFrameStore tests
```

Then, if UI awareness changes:

```
DayFrameApp tests
```

Then repository-standard validation:

```
npm run lint
npm run typecheck
npm test
npm run build
```

Run:

```
git diff --check
```

Record:

* focused active-ingress test count;
* focused store test count;
* UI test count if applicable;
* full test-file count;
* full test count;
* tests added/updated;
* lint result;
* typecheck result;
* build result;
* diff-check result;
* task artifact SHA-256;
* specification immutability.

Confirm:

* profile/backup validation remains intact;
* no durable format changed;
* no recovery artifact/key added;
* no migration added;
* no source incarnation added;
* no OccurrenceIdentity version change;
* no PlanDecision behavior added;
* no governance documents changed.

---

# 93. Completion Criteria

Task 2.18 is complete only when:

* persisted active authored data is classified before activation;
* supported compatibility normalization occurs before semantic validation;
* valid current/legacy/advisory-only data still activates;
* semantic-invalid active data does not activate;
* malformed readable checkpoint data does not silently become ordinary defaults;
* safe fallback runtime is used when activation is blocked;
* exact readable raw checkpoint remains unchanged;
* recovery-required active ingress status exists outside `DayFrameState`;
* status is queryable;
* status is subscribable;
* ingress state remains distinct from durability;
* ordinary active writes cannot overwrite a protected checkpoint;
* active retry cannot overwrite a protected checkpoint;
* protected runtime mutations have truthful non-persistence semantics;
* profile durable surface remains independently writable;
* profile/backup runtime replacement does not implicitly complete recovery;
* clear/removal behavior under protection is explicitly safe;
* Preview generation and runtime authority continue to function where valid;
* healthy stores preserve all existing persistence/durability/retry behavior;
* no new durable recovery surface is introduced;
* no historical checkpoint is silently repaired/remapped;
* active-local recovery completion remains deferred;
* focused and full validation pass;
* immutable task artifact remains unchanged.

---

# 94. Task Determination

Task 2.18 is a bounded active-local historical-ingress safety implementation.

It exists because active local startup differs fundamentally from profile load and backup import.

Profile and backup ingress can reject unsafe historical data while preserving an already-valid current runtime.

Active local startup must instead answer two questions simultaneously:

> What safe runtime authority should DayFrame use if its saved active checkpoint cannot safely activate?

and:

> How does DayFrame remain usable without allowing that temporary runtime to overwrite the historical checkpoint that may still be recoverable?

Task 2.18 answers those questions with:

```
unsafe historical checkpoint
    ↓
no activation
    ↓
exact source preserved
    ↓
safe fallback runtime
    ↓
retained recovery status
    ↓
active-write and active-retry protection
```

It deliberately does not answer:

> How does the user repair, replace, export, migrate, or abandon the protected checkpoint?

Those actions require a later explicit recovery task.

**Task 2.18 is complete when DayFrame can construct a safe usable session from an invalid or unreadable active-local historical checkpoint without activating or overwriting that checkpoint, retains explicit ingress-recovery truth outside `DayFrameState`, blocks active persistence and retry while protection is required, preserves healthy-store behavior, and introduces no recovery action, migration, new durable recovery format, source-incarnation, or PlanDecision behavior.**
