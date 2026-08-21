# Task 2.20 — Implement Store-Owned Active-Local Recovery Replacement and Abandonment

**Project:** DayFrame
**Phase:** Phase 2 — Authority and State Alignment
**Task ID:** 2.20
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

`TASK_2.20_IMPLEMENT_STORE_OWNED_ACTIVE_LOCAL_RECOVERY_REPLACEMENT_AND_ABANDONMENT_RESULT.md`

This task authorizes only the store/infrastructure implementation required to execute the recovery contract adopted by Task 2.19.

Do not expand this task into:

* user-facing recovery controls;
* confirmation dialogs;
* protected-checkpoint export;
* recovery artifact formats;
* profile-specific recovery commands;
* backup-specific recovery commands;
* automatic migration;
* repair/remapping;
* storage-event coordination;
* source incarnation;
* OccurrenceIdentity changes;
* PlanDecision;
* durable-format changes;
* governance updates.

If implementation cannot satisfy the Task 2.19 transaction contract without one of those broader changes, stop the affected work and record the blocker rather than broadening scope.

---

# 2. Purpose

Task 2.18 established safe active-local historical-ingress protection.

Task 2.19 established the authority contract for ending that protection.

The adopted recovery model contains exactly two explicit store-owned resolution commands:

1. **Replace the protected active checkpoint with the latest valid current session.**
2. **Abandon the protected active checkpoint and reset active runtime to safe defaults.**

Task 2.19 further established that:

* profile load and backup import may prepare/review current runtime but do not receive independent recovery authority;
* recovery is durability-first;
* protection remains active throughout every attempt;
* the protected source must be rechecked before destructive action;
* only `persisted` or `removed` may clear protection;
* failed attempts retain protection;
* ordinary durability retry remains blocked;
* explicit recovery intent supersedes accumulated guarded desired intent;
* replacement does not mutate runtime;
* successful abandonment resets active runtime only after removal succeeds;
* profiles remain independent;
* recovery completion is not migration or source-incarnation evidence.

Task 2.20 implements this contract.

---

# 3. Governing Recovery Model

The executable model must become:

```
recoveryRequired
    ↓
explicit store recovery command
    ↓
prove eligibility
    ↓
recheck protected durable source
    ↓
establish command-specific desired condition
    ↓
exactly one factual active write/removal
    ↓
failure
    → retain protection

success
    → reconcile durability
    → transition ingress status
    → disable guard
    → apply runtime reset only for abandonment
```

No other store operation may gain recovery authority.

---

# 4. Authorized Commands

Add two explicit store commands with naming equivalent to:

`replaceProtectedActiveCheckpointWithCurrentState()`

and:

`abandonProtectedActiveCheckpointAndReset()`

Exact naming may follow repository conventions, but command names must clearly communicate destructive recovery authority.

Do not use ambiguous names such as:

* `forceSave`;
* `forceRetry`;
* `recover`;
* `overrideProtection`.

---

# 5. Command Eligibility

Both commands are eligible only when current active-local ingress status is:

`recoveryRequired`

If called when ingress is:

* accepted;
* no source;
* healthy/non-actionable;

return an explicit no-op result:

`notAttempted: notRecoveryRequired`

or equivalent.

Perform no storage access, mutation, notification, or durability change.

---

# 6. ActiveLocalIngressStatus Must Become Mutable

Task 2.18 retained active-local ingress status but recovery could not transition it.

Task 2.20 must make that retained infrastructure state mutable inside the store.

It must remain outside:

* `DayFrameState`;
* profiles;
* backups;
* active durable payload.

Only dedicated ingress-state logic may change it.

---

# 7. Ingress Transition Ownership

The store exclusively owns ingress transitions.

Allowed transitions added by this task are:

```
recoveryRequired
    ↓ successful replacement
accepted
```

and:

```
recoveryRequired
    ↓ successful abandonment
noSource / explicitly abandoned
```

Failed or precondition-rejected recovery leaves ingress `recoveryRequired`.

Do not allow UI/workflows to assign ingress state.

---

# 8. Post-Abandonment No-Source Reason

Extend the no-source ingress representation only as necessary to distinguish:

* ordinary startup absence;
* explicit successful abandonment.

Use a narrow reason such as:

`resolvedByAbandonment`

or equivalent.

Do not introduce recovery history.

---

# 9. Protected Source Identity

Task 2.19 requires the store to prove immediately before destruction that it is still acting against the historical checkpoint originally classified.

Task 2.20 must retain enough private infrastructure information to perform this comparison.

For a readable protected source, this may be:

* exact raw string;
* or another representation that proves exact equality.

Prefer the simplest exact comparison compatible with current Web Storage behavior.

Do not expose protected raw bytes through the normal public ingress-status accessor.

---

# 10. Protected Source Identity Lifetime

Retain source comparison evidence only while ingress remains `recoveryRequired`.

After successful replacement or abandonment:

* release/reset protected-source comparison state;
* do not retain obsolete raw checkpoint data merely as history.

No durable recovery history is added.

---

# 11. Readable Source Recheck

Immediately before either destructive durable operation:

1. reacquire/read the active local-storage key through the appropriate protected read boundary;
2. compare the currently observed value with the originally protected source;
3. continue only if exact source equality is established.

If current source differs:

* do not write/remove;
* return `notAttempted: sourceChanged`;
* retain recovery protection;
* do not change desired condition or durability status;
* do not notify state/durability subscribers;
* refresh/reclassify ingress evidence only if Task 2.19 contract can be honored without inventing a new user decision.

Prefer preserving the original recovery status until a later explicit reclassification workflow if automatic refresh would silently change the recovery subject.

Document the chosen behavior.

---

# 12. Source Missing At Recheck

If the protected key existed/read successfully at startup but is missing at recovery recheck:

* treat this as `sourceChanged`, not successful abandonment;
* perform no recovery write/removal;
* retain protection pending renewed classification/decision.

Do not infer that external removal authorized recovery completion.

---

# 13. Source Unreadable At Recheck

If storage accessor or `getItem` fails:

* return `notAttempted: sourceUnreadable`;
* perform no write/removal;
* retain protection;
* preserve runtime;
* change no durability status because no persistence attempt occurred;
* notify no ordinary/durability subscriber.

Ingress notification is allowed only if retained ingress facts truthfully change.

---

# 14. Startup Read-Failure Recovery

If initial recovery status originated from a read failure and no exact protected raw value was captured, Task 2.19 requires a successful reread before destructive recovery.

Implement:

```
initial source unreadable
    ↓
recovery command
    ↓
reread succeeds
    ↓
do NOT immediately overwrite/remove
    ↓
classify newly observed source
    ↓
require renewed explicit decision
```

Therefore the first successful read after a protected read-failure condition returns `notAttempted: sourceChanged` or a similarly truthful refreshed-source result.

Do not destroy newly discovered bytes under stale consent.

---

# 15. No Compare-And-Swap Claim

Web Storage does not provide transactional compare-and-set.

Task 2.20 may perform:

```
read / compare
    ↓
immediate synchronous setItem/removeItem
```

This is best-effort source verification.

Do not claim multi-tab atomicity or lock-free race elimination.

Document the residual check/write race in the result artifact.

---

# 16. No Storage-Event Coordination

Do not add:

* `storage` event listeners;
* multi-tab locks;
* leader election;
* cross-tab recovery coordination.

Those remain deferred.

---

# 17. Replacement Command — Source

`replaceProtectedActiveCheckpointWithCurrentState()` uses the **latest current runtime authored state at invocation**.

It must not use:

* startup fallback snapshot cache;
* failed previous recovery snapshot;
* loaded profile source directly;
* imported backup object directly.

Project the current complete `DayFrameAuthoredSetup` from current runtime.

---

# 18. Replacement Validation

Immediately before source recheck/write:

* validate the latest current authored snapshot with `validateDayFrameAuthoredSetup`.

If blocking invalidity exists:

* return `notAttempted: invalidReplacement`;
* include the invalid validation result;
* perform no storage access beyond what ordering requires;
* preferably validate before source recheck so an invalid replacement causes no unnecessary durable read;
* retain ingress protection;
* leave desired condition and durability unchanged;
* do not notify.

Advisory-only validation remains eligible.

---

# 19. Replacement Advisories

If validation is valid with advisories:

* proceed;
* on success, transition ingress to accepted while preserving cloned advisories according to existing accepted status semantics;
* do not remove unsupported authored intent.

---

# 20. Replacement Transaction Ordering

Implement the adopted ordering:

```
verify recoveryRequired
    ↓
capture latest complete current authored snapshot
    ↓
validate
    ↓
re-read / compare protected source
    ↓
set desired active condition = snapshot
    ↓
perform exactly one factual active write
    ↓
interpret outcome
```

Do not clear protection before the write.

---

# 21. Replacement Write Path

Recovery replacement may bypass the ordinary ingress write guard **only inside the dedicated recovery command**.

Prefer one narrow private helper/path such as:

* guarded active persistence helper with explicit recovery authorization;
* or direct use of the existing factual persistence helper after all recovery preconditions pass.

Do not:

* disable the guard globally;
* temporarily mark ingress accepted;
* route through ordinary `retryActivePersistence()`.

---

# 22. Replacement Success

When the factual write outcome is:

`persisted`

commit all recovery completion metadata synchronously:

* active desired durable condition = `snapshot`;
* active durability status = `durable`;
* ingress status = `accepted`;
* protection guard disabled because ingress is no longer recoveryRequired;
* protected-source comparison evidence cleared;
* runtime state unchanged;
* Preview unchanged.

Return:

`resolved: replaceWithCurrentState`

or equivalent with the exact persisted result and accepted ingress snapshot.

---

# 23. Replacement Success Notifications

Because runtime does not change:

* emit **no ordinary `DayFrameState` notification**.

Durability subscription:

* notify only if active durability value changes according to existing deduplication semantics.

Ingress subscription:

* notify exactly once for the `recoveryRequired → accepted` transition.

Do not send fake state notification merely to make UI rerender.

---

# 24. Replacement Storage Failure

If factual active write returns:

`storageFailure`

then:

* result = `notResolved`;
* resolution = replacement;
* active desired condition remains `snapshot`;
* active durability becomes `storageFailure`;
* ingress remains recoveryRequired;
* protected-source evidence remains;
* runtime unchanged;
* Preview unchanged;
* no ordinary state notification;
* ingress subscriber not notified unless recovery evidence itself changed;
* durability subscriber follows normal changed-status semantics.

---

# 25. Replacement Unavailable

Equivalent for:

`unavailable`

Ingress protection remains.

No ordinary retry authority is gained.

---

# 26. Replacement Serialization Failure

If serialization returns:

`serializationFailure`

before storage write:

* result = `notResolved`;
* desired condition = `snapshot`;
* active durability = `serializationFailure`;
* ingress remains recoveryRequired;
* historical checkpoint unchanged;
* runtime unchanged;
* Preview unchanged;
* no ordinary state notification;
* no ingress transition;
* durability notification according to existing status semantics.

No write must occur.

---

# 27. Repeated Replacement Attempt

After failure, ordinary retry stays blocked.

A later explicit replacement command:

* captures latest current runtime again;
* revalidates;
* rechecks protected source again;
* performs at most one new write.

Do not retain the previous failed replacement payload.

---

# 28. Abandonment Command Meaning

`abandonProtectedActiveCheckpointAndReset()` means:

> Permanently remove the protected active checkpoint and reset current active authored runtime to DayFrame's known-safe initial defaults.

It does **not**:

* preserve current session edits;
* clear profiles;
* invoke full `clearLocalData()`;
* save current runtime.

---

# 29. Abandonment Eligibility

Same as replacement:

* only recoveryRequired;
* otherwise `notAttempted: notRecoveryRequired`;
* no storage attempt;
* no state change.

---

# 30. Abandonment Transaction Ordering

Implement:

```
verify recoveryRequired
    ↓
re-read / compare protected source
    ↓
set desired active condition = absent
    ↓
perform exactly one factual active-key removal
    ↓
interpret outcome
    ↓
only if removed:
    reset active runtime
    reconcile infrastructure
    clear protection
    notify
```

Do not reset runtime before removal succeeds.

---

# 31. Abandonment Removal Path

Use the existing factual active-removal helper or a narrowly authorized recovery path.

Do not call:

`clearLocalData()`

because it:

* also clears profiles;
* currently has broader runtime semantics;
* is not the explicit recovery command.

---

# 32. Abandonment Success

On:

`removed`

perform one atomic observable transition:

* construct safe initial `DayFrameState`;
* preserve the current cloned `savedProfiles` collection;
* reset all seven active authored fields to initial defaults;
* `preview = null`;
* active desired durable condition = `absent`;
* active durability status = `durable`;
* ingress status = `noSource` with explicit-abandonment reason;
* clear protected-source comparison evidence;
* profile durability unchanged;
* profile desired condition unchanged.

Return:

`resolved: abandonAndReset`

with:

* removal outcome;
* new state snapshot;
* resulting ingress snapshot.

---

# 33. Abandonment State Notification

Successful abandonment changes runtime.

Emit exactly **one** ordinary `DayFrameState` notification after removal succeeds and the complete reset state has been committed.

No intermediate fallback/reset state may be observable.

---

# 34. Abandonment Durability Notification

Active durability notification follows existing deduplication semantics.

Profile durability remains untouched.

---

# 35. Abandonment Ingress Notification

Emit exactly one ingress notification for:

`recoveryRequired → noSource`

after durable removal succeeds and status commits.

---

# 36. Abandonment Failure

If removal returns:

* unavailable;
* storageFailure;

then:

* result = `notResolved`;
* desired active condition = `absent`;
* active durability reflects the actual outcome;
* runtime unchanged;
* Preview unchanged;
* saved profiles unchanged;
* ingress remains recoveryRequired;
* protected source evidence remains;
* no ordinary state notification;
* no ingress transition.

---

# 37. Abandonment Repeatability

After a failed removal, another explicit abandonment activation:

* rechecks source again;
* performs at most one removal attempt.

Ordinary retry does not replace this command.

---

# 38. Desired Durable Condition Authority

Task 2.19 established that explicit recovery intent supersedes accumulated guarded intent.

Implement:

Replacement command:
`desiredCondition = snapshot`

Abandonment command:
`desiredCondition = absent`

Set the command's desired condition only after preconditions/source recheck succeed and a real persistence attempt is about to occur.

If validation/source precondition fails and no durable attempt occurs, do not overwrite prior desired-condition truth unnecessarily.

Document precise ordering.

---

# 39. Desired Condition After Failed Attempt

Once a real replacement attempt begins and fails:

* retain `snapshot`.

Once a real abandonment attempt begins and fails:

* retain `absent`.

A later explicit command may supersede it.

Ordinary retry remains recovery-protected regardless.

---

# 40. Recovery Result Type

Add an explicit recovery result contract.

Prefer either one common discriminated union or two surface-command-specific result unions if that prevents impossible combinations.

Semantically the model must represent:

## Resolved replacement

* persisted;
* accepted ingress.

## Resolved abandonment

* removed;
* new state;
* no-source ingress.

## Not resolved

* operation was actually attempted;
* exact persistence/removal failure recorded.

## Not attempted

* no destructive operation occurred;
* explicit precondition reason.

---

# 41. Required Not-Attempted Reasons

At minimum represent:

* `notRecoveryRequired`;
* `invalidReplacement`;
* `sourceUnreadable`;
* `sourceChanged`.

Do not encode those as persistence failures.

---

# 42. Required Not-Resolved Reasons

For replacement:

* unavailable;
* storageFailure;
* serializationFailure.

For abandonment:

* unavailable;
* storageFailure.

If using exact persistence outcome rather than duplicating reason strings, keep the discriminant truthful and type-safe.

---

# 43. No Fake State On Replacement Success

Replacement success does not change runtime.

Do not include `state` merely for structural symmetry unless repository conventions strongly justify it.

The caller can use current store state.

Abandonment success may include state because runtime actually changed.

---

# 44. Recovery Result Clone Safety

Any returned:

* ingress status;
* validation result;
* state snapshot;

must preserve existing store clone/isolation semantics.

Do not expose mutable internal arrays or issue objects.

---

# 45. Mutable Ingress Subscription

Task 2.18's ingress subscription now becomes behaviorally active.

Implement notification deduplication analogous to durability:

* notify only when semantic ingress status changes.

Do not notify for failed recovery when status remains recoveryRequired unless retained recovery evidence changes materially and the public status actually changes.

---

# 46. Recovery Protection Helper

Prefer one private predicate:

`isActiveLocalRecoveryProtected()`

or equivalent based on current ingress state.

Do not create duplicate protection booleans that can diverge from ingress status.

Ingress state remains authoritative.

---

# 47. Guard Behavior After Replacement Success

Immediately after accepted ingress commits:

* ordinary active persistence works;
* active retry follows normal durability eligibility;
* active removal/clear follows normal existing semantics.

Direct tests required.

---

# 48. Guard Behavior After Abandonment Success

After no-source ingress commits:

* ordinary active persistence works on future current mutations;
* active retry behaves according to normal durability/desired semantics;
* clear works normally.

Direct tests required.

---

# 49. Ordinary Retry During Recovery

Preserve:

`retryActivePersistence() → notAttempted: recoveryProtected`

before, during, and after any failed explicit recovery attempt.

Do not teach ordinary retry to replay explicit recovery intent.

---

# 50. Ordinary Retry After Recovery Success

After protection clears:

* replacement success leaves active durability durable, so ordinary retry should normally be notAttempted/alreadyDurable;
* abandonment success likewise has durable absence.

Future ordinary mutation may create normal snapshot persistence state.

---

# 51. Profile Persistence Independence

Task 2.18 already allows profile save/delete while active recovery is protected.

Task 2.20 must preserve this.

Recovery commands do not:

* change profile desired condition;
* change profile durability;
* clear saved profiles.

---

# 52. Profile Load Under Protection

Preserve Task 2.18 behavior:

* valid profile load may replace current runtime;
* automatic active persistence remains blocked;
* ingress remains recoveryRequired.

Then replacement recovery naturally writes the latest current session.

Do not add profile-specific recovery authority.

---

# 53. Backup Import Under Protection

Same:

* valid backup import may replace runtime;
* automatic active persistence remains blocked;
* recovery remains unresolved until current-session promotion succeeds.

---

# 54. Current Session Freshness

A replacement recovery call after profile load, backup import, or further edits must persist the latest runtime authored snapshot at **that invocation**.

Direct test required.

---

# 55. Preview Preservation — Replacement

Replacement success/failure does not modify Preview.

The current session was already selected and reviewable before recovery.

Assert:

* Preview object/presence unchanged;
* stale flag unchanged;
* timestamps unchanged.

---

# 56. Preview Reset — Abandonment

Successful abandonment resets runtime to initial state and must set:

`preview: null`

Failure leaves Preview exactly unchanged.

---

# 57. State Validation Before Replacement

Replacement must use the same semantic validator as Task 2.15.

Do not create:

* recovery-specific validation rules;
* weaker compatibility rules.

Current runtime must be valid current authority.

---

# 58. Advisory Preservation

Accepted advisories from the replacement validation result may be retained in the new accepted ingress status if Task 2.18 accepted status already supports them.

Do not persist advisories.

---

# 59. Raw Protected Source Remains Private

Do not add:

* raw payload getter;
* raw export API;
* UI raw text.

Task 2.20 may retain exact source identity privately solely for recheck.

Export remains later.

---

# 60. No Confirmation/UI

Do not add user-facing controls in Task 2.20.

The store API represents the execution authority contract, but production UI must not yet invoke it unless an existing non-UI integration requires it.

Task 2.21 will expose the commands.

Tests may invoke them directly.

---

# 61. No Automatic Recovery

Do not invoke recovery commands:

* during startup;
* after profile load;
* after backup import;
* after mutation;
* after storage becomes available;
* after retry;
* during navigation.

Only explicit later caller invocation may use them.

---

# 62. No Recovery On Successful Read Refresh

If protected read-failure source becomes readable during a recovery command:

* do not automatically replace/remove it;
* return a renewed-decision precondition result;
* retain protection.

No automatic second call.

---

# 63. SourceChanged Result Semantics

`sourceChanged` means the destructive authorization was obtained against stale source evidence.

The result should contain enough non-sensitive status information for a future UI to say that the saved source changed and must be reviewed again.

Do not expose raw source contents.

---

# 64. Reclassification Scope

If implementation can safely reclassify the newly observed source after sourceChanged without activating it:

* it may update retained recovery diagnostics;
* protection must remain;
* no automatic activation.

If doing so meaningfully expands complexity, leave status protected and return sourceChanged.

Document the choice.

---

# 65. Read-Failure Reclassification

Same principle.

A newly readable source may later be reclassified under an explicit future workflow.

Do not treat a fresh successful read as recovery completion.

---

# 66. Storage Acquisition Reuse

Reuse the existing protected storage acquisition/read boundaries where possible.

Do not create a second inconsistent classification for:

* unavailable;
* accessor failure;
* getItem failure.

Recovery preconditions should consume factual read results.

---

# 67. Persistence Helper Reuse

Recovery write/removal should reuse existing factual persistence helpers.

Do not duplicate:

* JSON serialization;
* `setItem`;
* `removeItem`;
* storage outcome mapping.

---

# 68. Persistence Write Outcome Preservation

Do not change the semantics of:

* persisted;
* unavailable;
* storageFailure;
* serializationFailure.

Recovery result wraps/interprets those facts.

---

# 69. Persistence Removal Outcome Preservation

Same for:

* removed;
* unavailable;
* storageFailure.

---

# 70. Durability Mapping Reuse

Reuse existing write/removal outcome → durability status mapping.

Do not invent recovery-specific durability statuses.

---

# 71. Durability Notification Ordering

On successful replacement:

1. persistence succeeds;
2. active durability becomes durable;
3. ingress becomes accepted;
4. notify each changed infrastructure channel according to existing semantics.

On abandonment success:

1. removal succeeds;
2. commit state reset + durability + ingress;
3. ordinary notification once;
4. infrastructure notifications as required.

Exact internal ordering may vary, but no subscriber may observe ingress resolved before durable success.

---

# 72. Failure Notification Ordering

On real failed attempt:

* durability may change;
* ingress remains recoveryRequired;
* state unchanged.

Therefore:

* no ordinary state notification;
* durability notification if status changed;
* no ingress notification unless public ingress data changed.

---

# 73. Successful Replacement Persistence Bytes

Direct test:

* seed protected raw active payload;
* mutate runtime while guarded;
* call replacement recovery;
* assert active key now contains current serialized authored runtime;
* assert it is not the original protected raw payload;
* assert exact expected current persistence shape;
* no Preview/profiles serialized.

---

# 74. Failed Replacement Byte Preservation

For:

* unavailable where observable;
* storageFailure;
* serializationFailure;

assert original protected readable payload remains unchanged.

---

# 75. Successful Abandonment Byte State

After successful abandonment:

* active key absent;
* profile key untouched.

---

# 76. Failed Abandonment Byte Preservation

After failed removal:

* original active key unchanged;
* profiles unchanged.

---

# 77. Source Change Test

Simulate:

1. construct protected store from payload A;
2. externally replace active key with payload B;
3. invoke recovery command.

Assert:

* no write/removal;
* result `notAttempted: sourceChanged`;
* payload B remains;
* runtime unchanged;
* protection remains.

Cover both replacement and abandonment where practical.

---

# 78. Source Unreadable Test

Simulate protected store then make read access fail before recovery.

Assert:

* no write/removal;
* `sourceUnreadable`;
* protection remains;
* no durability mutation from the precondition failure.

---

# 79. Initial Read-Failure Test

Construct a store whose initial active read fails.

Later restore read access with an actual active payload.

First recovery command must:

* discover/re-read source;
* refuse destructive action under stale consent;
* return renewed/source-changed result;
* preserve payload.

---

# 80. Replacement Invalid-State Test

Although Task 2.15 normally prevents invalid current runtime, injected/composition tests may establish edge state.

Directly prove recovery validates latest snapshot and rejects invalid replacement without touching storage.

Do not corrupt production flows merely to manufacture the state.

---

# 81. Replacement Advisory Test

Current valid runtime with advisory-only recurrence:

* recovery succeeds;
* active key written;
* accepted ingress preserves advisory semantics.

---

# 82. Replacement Success Test

Directly assert:

* resolved;
* one write;
* state unchanged;
* Preview unchanged;
* desired snapshot;
* active durability durable;
* ingress accepted;
* ingress notification once;
* state notification zero;
* checkpoint protection disabled;
* subsequent ordinary mutation persists normally.

---

# 83. Replacement Storage-Failure Test

Assert:

* one attempted write;
* notResolved;
* ingress still recoveryRequired;
* state unchanged;
* Preview unchanged;
* desired snapshot;
* active durability storageFailure;
* ordinary retry still recoveryProtected.

---

# 84. Replacement Serialization-Failure Test

Assert:

* no `setItem`;
* notResolved;
* ingress remains protected;
* durability serializationFailure;
* desired snapshot;
* historical payload unchanged.

---

# 85. Replacement Unavailable Test

Assert exact outcome and retained protection.

---

# 86. Replacement Freshness Test

During protected session:

1. mutate runtime A;
2. perhaps load profile/import backup;
3. mutate again to runtime B;
4. call replacement.

Assert persisted snapshot corresponds to B.

No failed-snapshot caching.

---

# 87. Abandonment Success Test

Assert:

* one remove;
* result resolved;
* runtime reset once;
* Preview null;
* saved profiles preserved;
* active desired absent;
* active durability durable;
* ingress noSource/resolvedByAbandonment;
* exactly one state notification;
* exactly one ingress transition notification;
* profile durability unchanged;
* subsequent ordinary active mutation persists normally.

---

# 88. Abandonment Failure Test

Assert:

* one attempted remove;
* notResolved;
* runtime unchanged;
* Preview unchanged;
* profiles unchanged;
* desired absent;
* ingress protected;
* no state notification.

---

# 89. Abandonment Does Not Call Clear

Direct spy/reference test where practical:

* recovery abandonment must not invoke `clearLocalData()`;
* profile key remains untouched.

---

# 90. Healthy Store Ineligibility Tests

For accepted/no-source store:

* replacement returns notRecoveryRequired;
* abandonment returns notRecoveryRequired;
* no storage operation;
* no status changes.

---

# 91. Repeat After Success Tests

After successful replacement or abandonment:

* invoking either recovery command again returns notRecoveryRequired;
* no write/remove.

Recovery APIs do not become force operations.

---

# 92. Ordinary Retry After Failed Recovery Test

Failed explicit recovery:

`retryActivePersistence()`

still returns:

`notAttempted: recoveryProtected`

No active storage operation.

---

# 93. Profile Independence Regression

During recovery:

* profile save/delete still persist normally.

After recovery:

* unchanged.

---

# 94. Profile Load Review Path Regression

Protected store:

* load valid profile;
* runtime replaced;
* active persistence blocked;
* recovery replacement persists resulting current session successfully.

This establishes the review-then-promote architecture.

---

# 95. Backup Import Review Path Regression

Equivalent for backup.

---

# 96. Safe Fallback Replacement Test

Untouched fallback current state may be promoted if store API is invoked.

Assert it succeeds technically.

No UI confirmation is part of this task.

Document destructive implication for Task 2.21.

---

# 97. Clear Regression During Recovery

Preserve Task 2.18 clear behavior until explicit recovery succeeds.

Ordinary clear must not destroy protected active key.

After successful recovery, clear returns to normal healthy behavior.

---

# 98. Seeded Store Regression

Ensure default seeded/demo behavior cannot gain recovery authority.

If seeded runtime changes occur under protection:

* they remain blocked from persistence;
* explicit replacement still required.

After recovery, normal current behavior resumes.

---

# 99. No Durable Format Change

No new serialized fields.

Do not persist:

* ingress status;
* protected-source identity;
* recovery result;
* recovery reason;
* confirmation.

---

# 100. No New Persistence Key

Use existing active key only.

Do not add:

* recovery backup key;
* source hash key;
* abandonment marker key.

---

# 101. No Migration

Replacement/abandonment resolves this checkpoint.

Do not mark:

* migration evidence;
* compatibility completion;
* historical reader retirement.

---

# 102. No Raw Export

Do not implement protected-source download/export.

Task 2.19 recommends it later, but it is not prerequisite to the core transaction.

---

# 103. No Source-Incarnation Behavior

Do not:

* issue new incarnation tokens;
* modify source IDs;
* change occurrence identity.

Recovery may constitute a conceptual lifetime boundary, but it remains unrepresented.

---

# 104. No PlanDecision

No durable decisions/history.

---

# 105. Expected Files To Change

Likely:

* `code/src/state/types.ts`;
* `code/src/state/dayFrameStore.ts`;
* `code/src/state/tests/dayFrameStore.test.ts`;
* active ingress tests if separate.

Possibly a narrow private/shared recovery helper module if it meaningfully clarifies recheck logic.

Do not touch UI production files in Task 2.20.

---

# 106. Production UI Audit

Although UI is not changed, confirm:

* no production UI currently calls the new recovery commands;
* persistent recovery warning remains read-only;
* no accidental automatic recovery call exists.

Task 2.21 will authorize UI invocation.

---

# 107. Public Store Interface

Add the two recovery methods to the store public interface/type.

Keep them explicit and discoverable.

Do not add a generic:

`resolveRecovery(mode)`

unless implementation evidence shows that a generic discriminated command materially improves type safety without obscuring authority.

Preference remains two named methods.

---

# 108. Recovery Type Placement

Place recovery result/status types with the narrowest existing state/store infrastructure types.

Do not add them to domain scheduling types.

---

# 109. Result Artifact — Protected Source Representation

The result must explicitly document what private source identity is retained for compare-before-replace:

* exact raw string;
* digest;
* other.

Explain why it proves the required equality at the current boundary.

---

# 110. Result Artifact — Initial Read Failure

Document exact behavior when no original raw payload was captured and a later re-read succeeds.

The implementation must not overstate source continuity.

---

# 111. Result Artifact — Source Change

Document whether the store:

* leaves current recovery status untouched;
* or refreshes/reclassifies recovery evidence.

Either is acceptable only if explicit destructive authority is not silently carried forward.

---

# 112. Result Artifact — Desired Condition Ordering

Record when `snapshot`/`absent` becomes current during each command and what remains after precondition rejection versus attempted failure.

This must be precise.

---

# 113. Result Artifact — Notification Ordering

Record exact ordinary, durability, and ingress notification behavior for:

* replacement success;
* replacement failure;
* abandonment success;
* abandonment failure;
* precondition rejection.

---

# 114. Result Artifact — Residual Web Storage Race

Explicitly state that compare-then-write/remove is best-effort and Web Storage provides no CAS guarantee.

No false atomicity claim.

---

# 115. Required Result Artifact Structure

The Task 2.20 result must contain at least:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Recovery API Shape
6. Recovery Result Contract
7. Mutable Ingress Infrastructure
8. Protected Source Representation
9. Recovery Eligibility
10. Protected Source Recheck
11. Source Missing / Changed Semantics
12. Source Unreadable Semantics
13. Initial Read-Failure Recheck
14. Residual Web Storage Race
15. Replacement Source Freshness
16. Replacement Validation
17. Replacement Advisories
18. Replacement Transaction Ordering
19. Guard Bypass Boundary
20. Replacement Success
21. Replacement Failure Semantics
22. Replacement Serialization Failure
23. Replacement Desired Condition
24. Replacement Durability Semantics
25. Replacement Notification Semantics
26. Abandonment Transaction Ordering
27. Abandonment Removal Boundary
28. Abandonment Success
29. Abandonment Failure Semantics
30. Abandonment Runtime Reset
31. Saved-Profile Preservation
32. Abandonment Desired Condition
33. Abandonment Durability Semantics
34. Abandonment Notification Semantics
35. Ingress Status Transitions
36. Protected Evidence Lifecycle
37. Ordinary Retry Preservation
38. Healthy-Store Behavior
39. Profile Persistence Independence
40. Profile Review-Then-Promote Path
41. Backup Review-Then-Promote Path
42. Preview Semantics
43. Clear Semantics Preservation
44. Seeded-Store Preservation
45. Persistence / Format Preservation
46. Migration / Compatibility Preservation
47. OccurrenceIdentity / Incarnation Preservation
48. Tests Added or Updated
49. Production Reference Audit
50. UI Non-Integration Confirmation
51. Architectural Alignment Improvement
52. Deviations
53. Discoveries and Deferred Work
54. Recommended Next Task
55. Validation
56. Final Completion Determination

---

# 116. Validation Requirements

Run focused store/recovery tests first.

At minimum:

```
dayFrameStore recovery tests
active ingress tests
```

Then run affected regression suites for:

* profile load;
* backup import;
* durability/retry;
* clear;
* seeded store where applicable.

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

* recovery tests added;
* focused store test count;
* full test-file count;
* full test count;
* lint result;
* typecheck result;
* build result;
* diff-check result;
* task artifact SHA-256;
* specification immutability.

Confirm:

* no UI recovery control added;
* no raw export added;
* no new durable key/format;
* no migration;
* no source incarnation;
* no OccurrenceIdentity version change;
* no PlanDecision;
* no governance files changed.

---

# 117. Completion Criteria

Task 2.20 is complete only when:

* active ingress status can transition after recovery;
* protected source identity is retained privately for recovery recheck;
* both recovery commands exist;
* recovery commands are eligible only in recoveryRequired state;
* current-session replacement uses the latest runtime authored snapshot;
* current-session replacement uses shared authored validation;
* advisory-only current state is eligible;
* protected source is rechecked immediately before destruction;
* changed/missing source prevents recovery attempt;
* unreadable source prevents recovery attempt;
* an initially unreadable source cannot be destroyed on first later-readable attempt without renewed decision;
* replacement performs exactly one active write attempt;
* abandonment performs exactly one active removal attempt;
* guard bypass exists only inside the dedicated recovery path;
* protection remains active through every durable attempt;
* only `persisted` resolves replacement;
* only `removed` resolves abandonment;
* failed attempts retain recovery protection;
* replacement success does not mutate runtime/Preview;
* successful abandonment resets active runtime only after removal succeeds;
* successful abandonment preserves saved profiles;
* profile durable state remains independent;
* explicit recovery intent reconciles desired durable condition;
* real recovery attempts update durability truthfully;
* precondition failures do not fabricate durability outcomes;
* ordinary retry remains blocked after failed recovery;
* recovery APIs become no-op after successful resolution;
* successful replacement returns active persistence to normal;
* successful abandonment returns active persistence to normal;
* notification semantics match the Task 2.19 contract;
* no full `clearLocalData()` coupling exists;
* no source-specific profile/backup recovery command exists;
* no UI recovery control exists;
* no durable format/key/migration changes;
* focused and repository-standard validation pass;
* immutable task artifact remains unchanged.

---

# 118. Task Determination

Task 2.20 is a bounded store-owned recovery transaction implementation.

Task 2.18 made DayFrame capable of protecting unsafe historical active data.

Task 2.19 established what authority is sufficient to resolve that protection.

Task 2.20 implements the transaction boundary:

```
explicit recovery command
    ↓
current recovery eligibility
    ↓
valid replacement when applicable
    ↓
protected-source freshness recheck
    ↓
command-owned desired condition
    ↓
exactly one factual durable operation
    ↓
success
    → reconcile durability
    → transition ingress
    → clear protection

failure
    → retain protection
```

Replacement and abandonment remain separate because they express different destructive intent.

Ordinary persistence, Retry, Clear, profile load, and backup import must never acquire recovery authority implicitly.

Task 2.20 deliberately stops before presentation.

**Task 2.20 is complete when DayFrame has explicit store-owned commands for replacing a protected active checkpoint with the latest valid current session and for abandoning that checkpoint with an active-only reset; both commands recheck protected-source freshness, retain protection through the durable operation, clear protection only after factual durable success, reconcile desired and durability truth exactly, preserve all unrelated runtime/profile behavior, and introduce no recovery UI, export format, migration, source-incarnation, or PlanDecision behavior.**
