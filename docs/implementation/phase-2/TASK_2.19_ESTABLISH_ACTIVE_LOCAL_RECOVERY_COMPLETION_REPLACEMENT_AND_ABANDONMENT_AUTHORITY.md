# Task 2.19 — Establish Active-Local Recovery Completion, Replacement, and Abandonment Authority

**Project:** DayFrame
**Phase:** Phase 2 — Authority and State Alignment
**Task ID:** 2.19
**Execution Type:** Investigation / Architectural Recovery Decision
**Status:** Ready for execution

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before performing the investigation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution findings must be recorded separately in:

`TASK_2.19_ESTABLISH_ACTIVE_LOCAL_RECOVERY_COMPLETION_REPLACEMENT_AND_ABANDONMENT_AUTHORITY_RESULT.md`

This task is investigation and architectural decision only.

Do not modify:

* production code;
* tests;
* store APIs;
* recovery UI;
* persistence formats;
* persistence keys;
* recovery storage surfaces;
* migration behavior;
* profile formats;
* backup formats;
* source incarnation;
* OccurrenceIdentity;
* PlanDecision;
* architecture governance documents;
* checkpoints.

No implementation is authorized by this task.

If evidence shows that recovery completion cannot be defined safely without a prerequisite migration, preservation, or durable-format decision, record that blocker instead of inventing behavior.

---

# 2. Purpose

Task 2.18 implemented active-local historical-ingress protection.

DayFrame can now:

* classify the persisted active checkpoint before activation;
* compatibility-normalize supported historical forms;
* semantically validate before activation;
* reject unsafe active history;
* construct a known-safe fallback runtime;
* preserve readable historical checkpoint bytes in place;
* conservatively protect unreadable/uncertain sources;
* retain recovery-required ingress status outside `DayFrameState`;
* block active persistence;
* block active retry;
* block protected active removal;
* keep runtime editing and Preview usable;
* keep profile persistence independent;
* communicate the protected state persistently.

Task 2.18 intentionally does **not** provide a way to end that recovery state.

Therefore a protected store can currently accumulate session runtime changes and desired durable intent while remaining unable to durably replace or remove the protected checkpoint.

Task 2.19 must establish the authority contract for ending active-local recovery safely.

---

# 3. Core Architectural Question

Task 2.19 must answer:

> What explicit action constitutes sufficient user/workflow authority for DayFrame to replace or abandon a protected active-local historical checkpoint, what source may become the replacement authority, and what evidence proves recovery completed successfully enough for ingress protection to clear?

This requires separating:

```
recovery choice
    ↓
durable resolution attempt
    ↓
durable outcome
    ↓
protection clearing
```

Do not treat initiating recovery as equivalent to completing recovery.

---

# 4. Governing Decisions

Tasks 2.16–2.18 established:

1. unsafe historical active state must not activate;
2. exact readable checkpoint data must be preserved;
3. safe fallback is temporary session authority, not recovered data;
4. ordinary active writes cannot overwrite the protected checkpoint;
5. ordinary retry cannot overwrite it;
6. ordinary active removal cannot destroy it;
7. runtime editing may continue;
8. profile persistence remains independent;
9. profile load and backup import may replace session runtime but do not implicitly complete recovery;
10. clear is not currently treated as abandonment;
11. ingress status is distinct from durability status;
12. desired durable condition may accumulate behind the guard;
13. no implicit recovery completion exists;
14. recovery must be explicit;
15. source preservation and user-data protection govern destructive resolution.

Task 2.19 defines the next contract without implementing it.

---

# 5. Objective

Determine:

1. what recovery completion means;
2. what explicit recovery actions are allowed;
3. which replacement sources are eligible;
4. whether current session runtime may be promoted to recovered durable authority;
5. whether a valid profile may be promoted;
6. whether a valid backup may be promoted;
7. whether direct abandonment/reset is allowed;
8. whether the protected raw checkpoint must be exportable or copied before destructive resolution;
9. how readable and unreadable-source cases differ;
10. how desired durable condition is reconciled;
11. how active durability status participates;
12. what happens when the recovery write/removal fails;
13. when ingress protection may clear;
14. whether recovery requires one atomic operation;
15. whether protection clearing must occur only after durable success;
16. how clear/reset relates to abandonment;
17. which layer owns recovery execution;
18. what store APIs a later implementation needs;
19. what minimum UI actions eventually follow;
20. what next implementation task is dependency-correct.

---

# 6. Recovery Completion Definition

Task 2.19 must define recovery completion precisely.

Candidate principle:

> Active-local recovery is complete only when the user has explicitly selected a resolution, DayFrame has successfully established that resolution durably on the active local surface, and the protected historical source no longer requires preservation under the previous recovery contract.

Assess and refine.

Do not equate:

* runtime replacement;
* profile load;
* backup import;
* session edits;
* retry request;

with completed recovery unless the active durable surface is successfully resolved.

---

# 7. Recovery Initiation Versus Completion

Separate:

## Recovery initiation

The user chooses what should replace or happen to the protected checkpoint.

## Recovery attempt

The store performs the authorized write/removal.

## Recovery completion

The requested durable condition is successfully established and ingress protection can safely clear.

## Recovery failure

The protected checkpoint remains protected and recovery-required state remains.

This distinction is mandatory.

---

# 8. Candidate Recovery Modes

Investigate at least:

1. replace with current session snapshot;
2. replace with a validated saved profile;
3. replace with a validated backup;
4. abandon protected checkpoint and reset to safe defaults;
5. preserve/export source before any destructive recovery;
6. explicit removal without replacement if appropriate.

Do not assume all modes should be supported immediately.

---

# 9. Current Session Snapshot Recovery

Task 2.18 allows runtime editing while writes are protected.

Therefore current session state may diverge significantly from the original safe fallback.

Determine whether a user may explicitly choose:

> Use my current session setup as the new saved active setup.

If adopted:

* current authored state must be semantically valid;
* the action must explicitly authorize overwriting the protected checkpoint;
* one direct active write should establish the complete snapshot;
* ordinary blocked-write semantics must be bypassed only for this authorized recovery attempt;
* protection clears only after successful persistence.

Assess risks.

---

# 10. Session Snapshot Provenance

A session snapshot during recovery may have originated from:

* untouched safe fallback;
* user edits;
* loaded valid profile;
* imported valid backup;
* combinations of later edits.

Determine whether recovery needs to know this provenance before allowing replacement.

Possible policy:

> The explicit recovery action operates on current valid authored authority regardless of how it was reached.

Or provenance may matter.

Do not invent constraints without evidence.

---

# 11. Profile-Based Recovery

Task 2.18 allows valid profile load to replace session runtime but blocks automatic active persistence.

Determine whether explicit recovery should support:

> Replace the protected active checkpoint with this currently loaded / selected valid profile state.

Potential models:

## A. Load profile first, then choose "Save current session as recovered state."

## B. Dedicated "Recover using profile" operation validates the profile and writes it directly.

Compare:

* authority clarity;
* duplication;
* atomicity;
* workflow complexity;
* result semantics.

---

# 12. Backup-Based Recovery

Equivalent analysis for backup.

Possible models:

## A. Import backup into session, then explicitly promote current session.

## B. Dedicated "Recover using backup" operation.

Consider:

* backup validation already exists;
* external artifact remains intact;
* recovery should not require a second ambiguous transformation.

---

# 13. Direct Session Promotion Model

Assess whether one generic explicit command:

```
recoverActiveLocalFromCurrentState()
```

or equivalent

could cover:

* fallback edits;
* loaded profile state;
* imported backup state.

Advantages may include:

* one authority boundary;
* no duplicated source-specific durable write logic;
* current state already validated.

Risks may include loss of source-specific recovery provenance.

Assess.

---

# 14. Explicit Abandonment

Task 2.18 deliberately prevents ordinary clear from deleting the protected checkpoint.

Task 2.19 must determine whether the user may explicitly choose:

> Abandon the protected historical checkpoint.

Define what this means.

Possible durable target:

* active key absence;
* default snapshot written;
* another explicit state.

Preferred conceptual distinction:

```
abandon checkpoint
    ≠
recover checkpoint
```

Abandonment intentionally gives up preservation.

---

# 15. Abandonment Result

Determine what runtime should become after successful abandonment.

Possible choices:

## A. Keep current session runtime and remove protected key.

Then future ordinary writes can persist it.

## B. Reset runtime to initial defaults and remove key.

## C. Write current session state immediately.

These are materially different actions.

Do not conflate them.

---

# 16. Reset Versus Abandon

Existing `clearLocalData()` resets runtime and requests absence for both active and profile surfaces.

Recovery abandonment may need a narrower active-only meaning.

Determine whether reuse of `clearLocalData()` is appropriate.

Likely concerns:

* profile deletion is unrelated;
* current clear is broader than active checkpoint abandonment;
* recovery intent should be explicit.

Assess whether a separate recovery command is required.

---

# 17. Active-Only Abandonment

Consider a future command equivalent to:

```
abandonProtectedActiveCheckpoint()
```

that:

* explicitly authorizes active-key removal;
* does not delete profiles;
* defines runtime behavior separately.

Assess whether this is cleaner than overloading clear.

---

# 18. Readable Source Preservation Requirement

When the exact raw checkpoint is readable and preserved, determine whether destructive recovery may occur without first exporting/copying it.

Candidate policies:

## A. Explicit recovery choice alone is sufficient.

The user knowingly replaces/abandons it.

## B. DayFrame must offer export before destructive resolution, but export is optional.

## C. DayFrame must successfully preserve/export it before destructive resolution.

## D. DayFrame must copy it internally before overwrite.

Compare safety and implementation implications.

Do not assume mandatory backup creation unless architecture requires it.

---

# 19. Unreadable / Read-Failure Recovery

Task 2.18 conservatively protects the active key when storage access/read fails even though exact raw bytes were not captured.

Determine how explicit recovery works when DayFrame cannot prove the original bytes were preserved.

Possible principle:

> Explicit user authorization may permit replacement/removal despite preservation uncertainty, but the UI/result must state that the original source could not be read or exported.

Assess.

Do not claim preservation where none can be demonstrated.

---

# 20. Storage Still Unreadable At Recovery Time

If recovery is initiated but storage remains inaccessible/throwing:

* durable replacement/removal cannot complete;
* ingress protection must remain;
* runtime state remains;
* recovery result reports failure truthfully.

Do not clear protection merely because user authorized the operation.

---

# 21. Preservation Before Replacement

If a readable raw source is exportable, determine what "preserve" means.

Candidates:

* exact raw active payload download;
* DayFrame backup conversion;
* diagnostic recovery artifact;
* copy to profile.

These are not equivalent.

The exact raw checkpoint may not satisfy current backup schema.

Do not call raw export a normal backup unless converted explicitly.

---

# 22. Recovery Artifact Question

Determine whether a future raw-checkpoint export requires:

* no durable schema because it is a simple file download;
* a dedicated recovery artifact format;
* existing backup envelope;
* deferred design.

Task 2.19 must not implement or finalize a new format unless necessary to define recovery authority.

---

# 23. Minimum Preservation Obligation

The result must make an explicit determination:

### A. Explicit destructive consent is sufficient; pre-export is optional.

### B. Recoverable source must be exportable before destructive action, but export is optional.

### C. Successful preservation/export is mandatory before destructive replacement.

### D. Insufficient evidence.

Explain why.

---

# 24. Recovery Source Validation

Any source selected to become new active durable authority must satisfy the current Task 2.15 semantic validator.

For current session state this should already hold under store enforcement.

For profile/backup direct recovery, validate again at the recovery boundary if necessary.

Do not establish invalid current authority during recovery.

---

# 25. Advisory-Only Recovery Source

Valid state with advisories only should generally remain eligible for recovery if advisories are nonblocking.

Confirm.

Do not silently erase unsupported authored intent.

---

# 26. Recovery Atomicity

Define whether recovery should be one atomic store-owned operation.

Preferred conceptual flow:

```
user chooses recovery
    ↓
store identifies validated replacement target
    ↓
store performs exactly one active write/removal attempt
    ↓
success
    → reconcile infrastructure
    → clear protection
    → notify recovery status

failure
    → leave protection intact
```

Assess.

---

# 27. Store Ownership

Task 2.19 should determine ownership:

## Workflow/user

Chooses recovery mode and replacement source.

## Store

Owns:

* authorization execution boundary;
* source validation where required;
* active storage write/removal;
* desired-condition reconciliation;
* durability outcome interpretation;
* ingress-status transition;
* exact recovery result.

## Persistence helper

Reports factual attempt outcome only.

Adopt or revise.

---

# 28. Recovery Must Bypass Guard Deliberately

Normal active write/removal guard exists specifically to prevent accidental overwrite.

A recovery operation must not disable the guard globally.

Preferred:

> dedicated recovery operation invokes the underlying active persistence/removal helper through an explicitly authorized path.

Do not temporarily set ingress status healthy before writing.

Protection should clear only after success.

---

# 29. Recovery Write Failure

If replacement write returns:

* unavailable;
* storageFailure;
* serializationFailure;

determine result semantics.

Likely:

* recovery remains incomplete;
* ingress status stays recoveryRequired;
* protected source remains;
* runtime remains current session authority;
* durability status may update only if a real attempt occurred and existing semantics justify it.

But serialization failure may have special implications.

Define.

---

# 30. Recovery Removal Failure

For abandonment/removal:

* unavailable;
* storageFailure;

must leave protection intact.

Do not report abandonment as completed.

---

# 31. Serialization Failure During Recovery

If current replacement snapshot cannot serialize:

* old checkpoint must remain untouched;
* ingress protection remains;
* recovery result should indicate recovery-required/serialization problem;
* ordinary Retry may still remain guarded.

Determine whether the replacement choice can be retried after state change.

Do not blur with historical checkpoint validity.

---

# 32. Durability Status During Recovery Attempt

Task 2.18 kept durability distinct from ingress status.

A real recovery write/removal is a real persistence attempt.

Determine whether active durability status should update from that outcome.

Likely yes.

But ingress status must remain authoritative about unresolved protection until durable success.

---

# 33. Recovery Success

On successful replacement write:

* active durability becomes durable;
* desired condition should be `snapshot`;
* ingress status may become accepted/healthy;
* guard clears;
* subsequent ordinary active writes/retry work normally.

On successful abandonment removal:

* active durability becomes durable in the current existing "absence established" sense;
* desired condition becomes `absent` or is reconciled according to post-abandon runtime policy;
* ingress protection clears.

Define exact post-abandon desired condition.

---

# 34. Desired Durable Intent Problem

Task 2.18 permits desired intent to accumulate behind the guard:

* ordinary edits set `snapshot`;
* guarded clear sets `absent`;
* later edits may replace intent again.

Task 2.19 must define whether recovery should honor:

## Current retained desired condition

or:

## Explicit recovery command intent

Preferred bias:

> Explicit recovery command should be authoritative over incidental previously accumulated intent.

Assess.

Do not let a stale guarded clear unexpectedly determine a later recovery operation.

---

# 35. Recovery Command Intent

Each recovery operation should likely establish its own desired durable condition.

Examples:

```
replace with current session
    → snapshot

abandon/remove
    → absent
```

This intent should become authoritative as part of the recovery transaction.

Confirm.

---

# 36. Recovery Success And Runtime State

For "replace with current session":

* runtime state need not change;
* only durable/infrastructure state changes.

For profile/backup direct replacement:

* runtime may already equal selected source, or recovery may atomically replace it.

For abandonment:

* runtime behavior must be explicitly defined.

Separate each.

---

# 37. Recovery State Notification

Ingress subscribers should receive a status transition only after successful durable resolution.

Do not clear ingress status before the storage operation.

Possible:

```
recoveryRequired
    ↓
successful durable resolution
    ↓
accepted / noSource / resolved
```

Determine best post-recovery status.

---

# 38. Post-Recovery Status — Replacement

If a new snapshot is successfully written:

`accepted`

is likely appropriate because a valid active source now exists and matches current durable authority.

Determine whether advisories should be carried.

---

# 39. Post-Recovery Status — Abandonment

If key absence is successfully established:

`noSource`

may be the truthful status.

Determine reason field such as:

* explicitlyAbandoned;
* missing.

Avoid pretending the key was simply never present if that distinction matters.

---

# 40. State Subscriber Semantics — Session Promotion

If recovering from current session state without runtime mutation:

* do not notify ordinary state subscribers merely because durability/ingress infrastructure changed.

Ingress/durability channels handle their own transitions.

Confirm.

---

# 41. State Subscriber Semantics — Recovery With Replacement Source

If the recovery operation also replaces runtime state:

* one ordinary notification may be appropriate;
* avoid duplicate notification from separate load + recovery steps if recovery is atomic.

Assess candidate workflow models.

---

# 42. Durability Subscriber Semantics

A real recovery attempt may update active durability.

Use existing notification rules.

A successful recovery may also change ingress status.

These are separate channels and may both notify.

---

# 43. Retry After Failed Recovery

If explicit recovery attempt fails due to storage failure/unavailability:

* should normal `retryActivePersistence()` remain blocked?
* likely yes, because retry does not carry explicit recovery authority.

Possible future:

* retry the explicit recovery command itself;
* user activates recovery action again.

Determine.

Do not transform ordinary retry into recovery retry.

---

# 44. Recovery Attempt Repeatability

Explicit recovery command should be safely repeatable after transient failure.

For replacement:

* each activation makes one write attempt of current chosen target.

For abandonment:

* one removal attempt.

Do not replay unrelated workflow actions.

---

# 45. Source Freshness For Session Recovery

If the user chooses "Save current session as recovered state" and then edits again before retrying after failure:

What snapshot should next recovery attempt use?

Possible:

## A. Latest current session state.

## B. Original failed recovery snapshot.

Task 1.28 durability logic strongly favored latest current desired runtime intent.

Assess whether the same principle applies.

Likely yes.

---

# 46. Source Freshness For Profile Recovery

If recovery is explicitly tied to a selected profile, determine whether retry should:

* reuse that profile snapshot;
* use current runtime after it was loaded;
* require reselection.

Avoid stale hidden authority.

---

# 47. Source Freshness For Backup Recovery

Equivalent question for backup source.

External artifact may remain stable, but runtime may change after import.

Assess.

---

# 48. Generic Current-State Recovery Versus Source-Specific Recovery

Compare:

## Model A — Recover current session

Everything first becomes valid runtime authority, then user explicitly writes current state over protected checkpoint.

## Model B — Recover directly from profile/backup/current-state variants

Store gets source-specific commands.

Produce a decision matrix.

---

# 49. Required Recovery Model Matrix

| Model                             | One Store Authority Path | Preserves Source Provenance | Handles Session Edits | API Complexity | Retry Freshness | Recommendation |
| --------------------------------- | -----------------------: | --------------------------: | --------------------: | -------------: | --------------: | -------------- |
| current-session promotion only    |                          |                             |                       |                |                 |                |
| source-specific recovery commands |                          |                             |                       |                |                 |                |
| hybrid                            |                          |                             |                       |                |                 |                |

---

# 50. Recovery UI Implications

Do not design UI, but determine minimum eventual controls.

Likely candidates:

* Use current session as saved setup;
* Recover using profile;
* Recover using backup;
* Preserve/export protected checkpoint;
* Abandon protected checkpoint.

The architecture may choose fewer.

---

# 51. Recovery Confirmation

Destructive replacement/abandonment likely requires explicit confirmation.

Determine which actions need it.

At minimum abandonment almost certainly does.

Replacing a protected checkpoint with current session may also deserve clear confirmation.

Do not write copy.

---

# 52. Protected Source Export Authority

Determine whether export is:

* diagnostic/non-destructive action;
* recovery prerequisite;
* optional safety action.

If exact raw bytes are unavailable due to read failure, export may be impossible.

Result must account for that.

---

# 53. Existing Backup Export Is Not Raw Checkpoint Export

Current backup export serializes current runtime authored state.

During safe fallback recovery, that is **not** the protected historical checkpoint.

Therefore do not describe existing backup export as preserving the protected source.

This distinction is mandatory.

---

# 54. Recovery Provenance

A future recovery result may need to record:

* resolution mode;
* source kind;
* whether raw checkpoint was readable/preserved;
* persistence outcome;
* resulting ingress status.

Determine the minimum runtime result facts.

Do not persist recovery history yet.

---

# 55. Recovery Result Contract

Design the smallest truthful future discriminated result.

Candidate conceptual shape:

```
type ActiveLocalRecoveryResult =
  | {
      status: "resolved";
      resolution: "replaceSnapshot" | "abandon";
      persistence: ...
    }
  | {
      status: "notResolved";
      reason: ...;
      persistence?: ...
    }
  | {
      status: "notAttempted";
      reason: "notRecoveryRequired" | "invalidReplacement" | ...
    };
```

Refine.

Do not implement.

---

# 56. Recovery Result And Runtime State

Determine whether result should include `DayFrameState`.

For current-session promotion, no runtime change occurs.

For atomic source replacement recovery, it may.

Prefer result shapes that do not imply state transition where none occurred.

Separate commands may simplify typing.

---

# 57. Candidate API — Current Session Replacement

Potential:

`resolveActiveLocalRecoveryWithCurrentState()`

or:

`replaceProtectedActiveCheckpointWithCurrentState()`

Assess clarity.

The name should communicate destructive replacement authority.

---

# 58. Candidate API — Abandonment

Potential:

`abandonProtectedActiveCheckpoint()`

or equivalent.

Assess whether it should:

* remove key only;
* reset runtime;
* reconcile desired condition.

Define.

---

# 59. Candidate API — Direct Source Recovery

Potential profile/backup-specific methods are allowed conceptually but should not duplicate existing parsing/validation unnecessarily.

Assess.

---

# 60. API Authority Principle

Recovery APIs must be impossible to confuse with ordinary persistence retry.

Avoid names such as:

`forceRetry`

or:

`forceSave`

because they obscure source-preservation authority.

---

# 61. Abandonment Runtime Models

Compare at least:

## Model A — Remove protected key, keep current runtime

After successful removal:

* ingress protection clears;
* current runtime remains;
* next ordinary mutation can persist it;
* but runtime is not durable immediately.

## Model B — Remove key and reset runtime to defaults

After success:

* runtime and durable absence align;
* current session edits are discarded.

## Model C — Replace with current runtime instead of removal

This is actually recovery, not abandonment.

Assess.

---

# 62. Required Abandonment Matrix

| Model                   | Protected Checkpoint Removed | Current Session Preserved | Durable/Runtime Aligned Immediately | User-Loss Risk | Recommendation |
| ----------------------- | ---------------------------: | ------------------------: | ----------------------------------: | -------------: | -------------- |
| remove + keep runtime   |                              |                           |                                     |                |                |
| remove + reset runtime  |                              |                           |                                     |                |                |
| persist current runtime |                              |                           |                                     |                |                |

---

# 63. Existing Clear Relationship

Determine whether recovery abandonment should reuse internal active-removal helper but not the full `clearLocalData()` transaction.

Likely yes.

Profiles should remain independent unless user separately clears them.

---

# 64. Recovery From Safe Fallback Without Edits

If user simply wants to discard the invalid checkpoint and start over:

* abandonment + reset may be the clearest semantics.

If user has edited fallback and wants to keep those edits:

* current-session replacement is different.

This suggests separate actions.

Assess.

---

# 65. Explicit User Intent

Task 2.19 must identify the minimum explicit user intent necessary.

Examples:

> Replace the protected saved setup with my current session.

> Permanently discard the protected saved setup and reset active setup.

These are materially different and should not share ambiguous confirmation.

---

# 66. Protection Clearing Rule

Adopt or revise:

> Active-local ingress protection may clear only after a recovery operation has both explicit authority and successfully established its requested durable condition.

This is likely the core invariant.

---

# 67. Recovery Attempt Without Protection

If recovery API is called on a healthy store:

* return notAttempted;
* do not write;
* do not remove.

Do not turn recovery into generic force-persist.

---

# 68. Recovery From `readFailure`

For unreadable source:

* protection exists;
* explicit replacement/removal may still be possible if storage becomes writable;
* no source export is possible unless later read succeeds.

Determine whether recovery should re-attempt reading before destructive action.

Possible safety improvement:

> On recovery initiation, attempt to read/capture source again before overwriting.

Assess.

---

# 69. Pre-Recovery Recheck

For readable preserved sources, the underlying key might have changed externally during the session.

Determine whether recovery should:

* assume the protected checkpoint is unchanged;
* compare current raw storage value to the originally observed value;
* re-read and require match before replacement.

This matters for external-tab/local-storage modification.

Assess complexity and risk.

---

# 70. Concurrent Storage Change

If the active key changes externally while recovery is protected:

* overwriting it may destroy newer data not observed at startup.

Task 2.19 must at least investigate whether recovery needs compare-before-replace semantics.

Do not assume single-writer environment unless evidence supports it.

---

# 71. Recovery Source Fingerprint

A simple in-memory hash/raw-string equality check could potentially detect change.

Do not design or implement unless needed.

Determine whether future recovery should prove it is replacing the same checkpoint it warned about.

---

# 72. Multi-Tab / External Writer Scope

Inspect whether DayFrame currently has:

* storage event handling;
* multi-tab coordination;
* external persistence writers.

If none, classify concurrent mutation risk as deferred or unsupported.

Do not build distributed locking.

---

# 73. Recovery Transaction Ordering

For replacement, preferred ordering may be:

```
validate replacement
    ↓
retain recovery protection
    ↓
establish desired snapshot intent
    ↓
perform write
    ↓
success
    → durability durable
    → ingress accepted
    → protection clears
```

For abandonment:

```
retain protection
    ↓
establish explicit absent intent
    ↓
perform removal
    ↓
success
    → durability durable
    → ingress noSource/resolved
    → protection clears
    → runtime policy applied atomically as defined
```

Assess.

---

# 74. Runtime Reset Ordering During Abandonment

If abandonment resets runtime, do not reset it **before** removal succeeds unless failure semantics explicitly preserve the user's session.

Possible safer order:

* attempt removal first;
* on success, reset runtime and clear protection atomically.

But persistence helper is synchronous today.

Determine contract.

---

# 75. Runtime Replacement Ordering During Source Recovery

If direct profile/backup recovery changes runtime and storage together:

* validate source first;
* decide whether runtime should replace before or after storage success.

Task 2.15 session-first semantics generally apply valid runtime mutations before persistence.

Recovery is different because the goal is durable resolution.

Assess whether recovery should be durability-first to avoid changing runtime when recovery fails.

This is an important architectural decision.

---

# 76. Recovery Session-First Versus Durability-First

Compare:

## Session-first recovery

Replace runtime, then persist. On failure:

* runtime changed;
* protection remains.

## Durability-first recovery

Persist chosen replacement first, then replace runtime only on success.

Advantages:

* recovery operation is atomic from user's perspective.

Risks:

* persistence helper may serialize state not yet current.

Compare.

---

# 77. Current-State Promotion Ordering

Current-state promotion has no runtime replacement, so durability-first is natural:

* current runtime already selected;
* write it;
* clear protection only on success.

This may favor generic current-state promotion over direct profile/backup recovery.

Note.

---

# 78. Recovery And Existing Runtime Replacement

Because Task 2.18 already permits loading profile/importing backup into session under protection, a simple product model may be:

1. load/import desired source into session;
2. review it;
3. explicitly choose "Use current session to replace protected saved setup."

Assess whether this provides useful user review before destructive action.

This may be architecturally preferable.

---

# 79. Recovery Preview Before Commit

If current-session promotion is adopted, user may generate Preview and inspect the recovered/session setup before overwriting historical checkpoint.

This is valuable and aligns with non-destructive principles.

Record as an architectural advantage, not a UI requirement.

---

# 80. Recovery And Profile Persistence

Saving session state as a profile before recovery may provide an additional user-created checkpoint.

Determine whether this can remain optional safety behavior.

Do not require it unless necessary.

---

# 81. Recovery And Existing Backup Export

Existing backup export can preserve **current session state** before destructive recovery.

It cannot preserve the protected raw source.

Distinguish those two preservation opportunities.

---

# 82. Raw Source Export Recommendation

Determine whether a later task should expose raw protected source export before abandonment.

This may be particularly valuable for readable corrupt/invalid state.

Do not implement.

---

# 83. Recovery From Corrupt JSON

No semantic authored snapshot exists.

Possible actions:

* export raw string if readable;
* abandon/reset;
* replace with current session/profile/backup.

No repair can be assumed.

Define eligible recovery modes.

---

# 84. Recovery From Semantic Invalidity

Because normalized invalid authored data and validator evidence exist, future repair tooling may be possible.

But Task 2.19 should determine whether replacement/abandonment can proceed before repair exists.

Likely yes, with explicit user choice.

---

# 85. Recovery From Ambiguity

Same.

Do not auto-resolve ambiguous historical data merely to complete recovery.

Explicit replacement can supersede it.

---

# 86. Recovery From Read Failure

No exact source may be exportable.

Explicit abandonment/replacement still may be the only recovery path.

Communicate preservation uncertainty in future UI.

---

# 87. Recovery Completion Evidence

Determine minimum facts proving completion:

For replacement:

* explicit recovery command;
* valid replacement authored snapshot;
* active write outcome = persisted;
* ingress status transitioned from recoveryRequired to accepted;
* guard disabled.

For abandonment:

* explicit abandonment command;
* active removal outcome = removed;
* ingress status transitioned appropriately;
* guard disabled;
* runtime reconciled according to adopted model.

---

# 88. Recovery Completion Is Not Migration Evidence

Even successful explicit replacement/abandonment does not imply:

* historical semantic migration completed;
* compatibility reader population migrated;
* old format retired.

It only resolves this store instance's protected active checkpoint.

---

# 89. Recovery Result Persistence

Do not persist recovery result/history unless separately authorized.

Current retained infrastructure status is enough for session awareness.

---

# 90. UI Awareness After Success

Persistent recovery warning should disappear only after ingress protection clears.

A transient success message may be useful later but is not architecturally required.

Determine minimum eventual behavior.

---

# 91. UI Awareness After Failure

Persistent recovery warning remains.

Immediate workflow feedback should report why resolution did not complete.

No false success.

---

# 92. Recovery Button Eligibility

Future recovery controls should render only when active ingress status is recoveryRequired.

Healthy stores should not expose force-recovery controls.

---

# 93. Readable Versus Unreadable UI Options

If raw checkpoint export becomes supported:

* readable preserved sources may offer export;
* unreadable sources cannot.

Architecture should expose enough status to enable correct controls.

---

# 94. Recovery Authorization Ownership

Normative candidate:

> The user-facing recovery workflow chooses a resolution. The DayFrame store exclusively validates the replacement source, executes the authorized active write/removal, reconciles desired durable condition and durability state, clears ingress protection only on durable success, and returns the exact result.

Assess and likely adopt.

---

# 95. Persistence Helper Ownership

Persistence helpers remain factual.

They must not decide:

* whether replacement is authorized;
* whether ingress status clears;
* whether user consent is sufficient.

---

# 96. Recovery And Validation Authority

The shared authored validator remains semantic source of truth.

Recovery workflow/store policy determines what to do with valid replacement.

Do not create recovery-specific semantic validity.

---

# 97. Recovery And Source Incarnation

Replacing/abandoning historical active source changes source-lifetime questions.

Task 2.19 must state:

* recovery completion does not solve source incarnation;
* restored IDs may still represent ambiguous historical lifetimes;
* OccurrenceIdentity remains runtime V1.

Do not alter incarnation.

---

# 98. Recovery And PlanDecision

Future durable PlanDecision must eventually understand recovery/replacement invalidation.

For now record:

* durable decisions cannot safely survive arbitrary source replacement without incarnation/revalidation semantics;
* Task 2.19 does not implement decisions.

---

# 99. Recovery And Profiles

Profiles remain user-authored durable checkpoints.

If current-session recovery uses state loaded from a profile, the source profile itself remains preserved.

No profile mutation is implied.

---

# 100. Recovery And Backups

External backup remains untouched even if its content becomes the chosen runtime/recovery source.

No conversion of the backup artifact is implied.

---

# 101. Current Safe Fallback Data

Explicitly assess whether replacing the checkpoint with untouched safe fallback defaults should be allowed.

That is technically current-session promotion but may effectively discard history.

Require explicit destructive confirmation.

---

# 102. Abandonment Confirmation Strength

Determine whether abandonment needs a stronger confirmation than normal clear.

Potential reason:

* protected checkpoint exists specifically because DayFrame could not safely interpret it;
* abandonment may permanently destroy the only copy.

Do not design exact UX.

---

# 103. Replacement Confirmation Strength

Likewise replacement should make clear that the protected saved checkpoint will be overwritten by the selected current session.

Determine whether one confirmation is enough.

---

# 104. Recovery Availability When Source Not Preserved

If `sourcePreserved: false` due to read failure, replacement may still overwrite unknown data.

This is a higher-risk action.

Determine whether:

* same confirmation is sufficient;
* stronger acknowledgement is required;
* recovery should first retry reading.

Do not leave risk classification unstated.

---

# 105. Required Recovery Mode Matrix

Produce:

| Recovery Mode                 | Replacement Source    | Changes Runtime? | Durable Operation | Can Resolve Readable Invalid Source? | Can Resolve Read Failure? | Destructive? | Recommendation |
| ----------------------------- | --------------------- | ---------------: | ----------------- | -----------------------------------: | ------------------------: | -----------: | -------------- |
| promote current session       | current valid runtime |               no | write             |                                      |                           |              |                |
| recover directly from profile | selected profile      |            maybe | write             |                                      |                           |              |                |
| recover directly from backup  | parsed backup         |            maybe | write             |                                      |                           |              |                |
| abandon/reset                 | none/defaults         |      yes/defined | remove            |                                      |                           |              |                |

---

# 106. Required Completion Matrix

| Attempt Outcome                  | Ingress Protection Clears? | Durability Update? | Runtime Change? | Next Action |
| -------------------------------- | -------------------------: | -----------------: | --------------: | ----------- |
| replacement persisted            |                            |                    |                 |             |
| replacement unavailable          |                            |                    |                 |             |
| replacement storageFailure       |                            |                    |                 |             |
| replacement serializationFailure |                            |                    |                 |             |
| abandonment removed              |                            |                    |                 |             |
| abandonment unavailable          |                            |                    |                 |             |
| abandonment storageFailure       |                            |                    |                 |             |
| not recovery-required            |                            |                    |                 |             |

---

# 107. Required Desired-Condition Matrix

| Recovery Action                   | Desired Condition During Attempt | On Success | On Failure |
| --------------------------------- | -------------------------------- | ---------- | ---------- |
| promote current session           |                                  |            |            |
| direct profile/backup replacement |                                  |            |            |
| abandon/remove                    |                                  |            |            |

---

# 108. Required Preservation Matrix

| Source Condition      | Exact Raw Captured? | Export Possible? | Destructive Recovery Allowed? | Required Warning/Consent Level |
| --------------------- | ------------------: | ---------------: | ----------------------------: | ------------------------------ |
| semantic invalidity   |                     |                  |                               |                                |
| corrupt JSON          |                     |                  |                               |                                |
| structural invalidity |                     |                  |                               |                                |
| read failure          |                     |                  |                               |                                |

---

# 109. Required Ownership Matrix

| Responsibility               | Owner |
| ---------------------------- | ----- |
| choose resolution            |       |
| validate replacement         |       |
| preserve/export source       |       |
| execute write/remove         |       |
| interpret persistence result |       |
| update durability status     |       |
| reconcile desired condition  |       |
| clear ingress protection     |       |
| update runtime if applicable |       |
| present confirmation         |       |
| present failure/success      |       |

---

# 110. Required API Comparison Matrix

| API Model                       | Explicit Authority | Runtime Freshness | Source Provenance | Complexity | Recommendation |
| ------------------------------- | -----------------: | ----------------: | ----------------: | ---------: | -------------- |
| current-state promotion only    |                    |                   |                   |            |                |
| direct source-specific recovery |                    |                   |                   |            |                |
| hybrid                          |                    |                   |                   |            |                |

---

# 111. Behavioral Invariants

The result should establish future implementation invariants.

Candidate invariants include:

1. recovery begins only from `recoveryRequired`;
2. recovery requires explicit user/workflow authority;
3. normal retry never becomes recovery;
4. protection remains active throughout a recovery attempt;
5. replacement source must be semantically valid;
6. one recovery activation performs exactly one active write/removal attempt;
7. failed durable resolution never clears protection;
8. successful durable replacement clears protection only after `persisted`;
9. successful abandonment clears protection only after `removed`;
10. recovery write/removal outcomes update durability truthfully;
11. explicit recovery command establishes its own desired durable condition;
12. accumulated guarded intent does not silently override explicit recovery choice;
13. no source is silently repaired/remapped;
14. readable protected source remains available until successful destructive resolution;
15. recovery completion does not imply migration completion;
16. source incarnation remains unresolved.

Adopt only evidence-supported invariants.

---

# 112. Test Contract For Future Implementation

Do not add tests now.

Specify future direct tests for at least:

## Current Session Recovery

* healthy store not eligible;
* protected store eligible;
* valid current runtime persisted;
* protection clears only after success;
* persistence failure retains protection;
* serialization failure retains protection;
* exact checkpoint unchanged on failure;
* latest current state used on repeated attempt if adopted.

## Abandonment

* requires recovery state;
* active key removed exactly once;
* failure retains key/protection;
* profiles unaffected;
* runtime follows adopted abandonment model;
* desired condition reconciled;
* no accidental `clearLocalData` coupling.

## Profile/Backup Recovery

If source-specific recovery is adopted:

* source validates;
* success atomic;
* failure leaves protection;
* source artifact preserved.

## Infrastructure

* ingress subscribers notified only on successful status change;
* state notification semantics correct;
* durability notification semantics correct;
* ordinary retry remains blocked after failed recovery;
* normal persistence works after successful recovery.

## UI

* controls only in recovery state;
* confirmations;
* no false recovery success;
* readable/unreadable distinctions;
* warning clears only after durable success.

---

# 113. Architecture Alignment Assessment

Assess proposed contract against:

* explicit authority;
* user-data preservation;
* epistemic integrity;
* session-first runtime authority;
* durability truth;
* deterministic state transition;
* historical compatibility;
* information provenance;
* non-destructive recovery;
* source-incarnation separation.

Use:

* Aligned;
* Partially aligned;
* Misaligned;
* Unresolved.

---

# 114. Compatibility Assessment

Determine whether implementing recovery completion later requires:

* no durable format change;
* active-key overwrite/removal only;
* new raw-export format;
* new recovery metadata.

Prefer no format change for the core recovery transaction.

If source export needs a new artifact format, separate it.

---

# 115. Recovery Export Staging

Task 2.19 should decide whether raw-source export must precede core recovery implementation.

Possible sequencing:

## A. Core replacement/abandonment first; export later.

## B. Raw source export first because destructive resolution requires preservation option.

## C. Export and recovery together.

Determine dependency from preservation obligation.

---

# 116. Recommended Implementation Staging

If contract is clear, recommend bounded tasks.

Potential sequence:

1. implement store-owned current-session recovery and abandonment commands;
2. add exact result/status transitions and tests;
3. add minimal recovery controls/confirmation;
4. add raw protected-source export if required;
5. later extend source-specific recovery only if useful.

Or another evidence-supported sequence.

Do not assume.

---

# 117. Candidate Next Task

Possible outcomes:

## Outcome A — Current-Session Promotion + Abandonment Are Sufficient

> **Task 2.20 — Implement Store-Owned Active-Local Recovery Replacement and Abandonment**

## Outcome B — Raw Export Is Mandatory First

> **Task 2.20 — Implement Protected Active-Checkpoint Export**

## Outcome C — Result/transaction semantics need separate implementation first

> **Task 2.20 — Implement Active-Local Recovery Result and Transaction Infrastructure**

## Outcome D — Concurrent checkpoint verification blocks safe replacement

> **Task 2.20 — Establish Protected-Checkpoint Revalidation and Compare-Before-Replace Semantics**

Task 2.19 chooses the next seam.

---

# 118. Evidence Classification

Material findings must use:

* **Confirmed**
* **Inferred**
* **Not found**
* **Unresolved**
* **Recommended**
* **Deferred**

Clearly distinguish:

* current Task 2.18 behavior;
* adopted recovery authority;
* potential future UX;
* preservation recommendation.

---

# 119. Explicit Non-Goals

Task 2.19 shall not:

* add recovery methods;
* change active write guard;
* clear ingress protection;
* alter retry;
* alter clear;
* add buttons;
* add confirmation dialogs;
* add protected-source export;
* create recovery artifact format;
* overwrite/remove active checkpoint;
* change active local format;
* add migrations;
* repair historical authored data;
* remap IDs;
* modify profile/backup formats;
* change profile/backup validation;
* add source incarnation;
* change OccurrenceIdentity;
* add PlanDecision;
* update ADRs;
* update `CURRENT_STATE.md`;
* update `CHANGELOG.md`;
* create a checkpoint;
* perform unrelated cleanup.

Discovery does not authorize implementation.

---

# 120. Required Code Inspection

At minimum inspect:

* `ActiveLocalIngressStatus`;
* active ingress reader/classification;
* active write guard;
* active removal guard;
* `retryActivePersistence`;
* desired durable condition handling;
* `clearLocalData`;
* current active mutation result types;
* durability status handling;
* active persistence helpers;
* profile load under protection;
* backup import under protection;
* backup export behavior;
* profile save/load behavior;
* persistent recovery awareness;
* relevant tests;
* any storage-event or multi-tab behavior.

Use Task 2.18 executable behavior as primary evidence.

---

# 121. Required Result Artifact Structure

The Task 2.19 result must contain at least:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Current Protected-Recovery State
5. Recovery Completion Definition
6. Initiation / Attempt / Completion Distinction
7. Eligible Recovery Modes
8. Current-Session Recovery Assessment
9. Session Provenance Assessment
10. Profile-Based Recovery Assessment
11. Backup-Based Recovery Assessment
12. Generic Versus Source-Specific Recovery
13. Recovery Model Matrix
14. Explicit Abandonment
15. Reset Versus Abandonment
16. Abandonment Models
17. Abandonment Matrix
18. Readable Source Preservation Requirement
19. Unreadable Source Recovery
20. Minimum Preservation Obligation
21. Protected Source Export Assessment
22. Existing Backup Export Distinction
23. Recovery Source Validation
24. Advisory-Only Source Eligibility
25. Recovery Atomicity
26. Recovery Ownership
27. Guard Bypass Authority
28. Replacement Failure Semantics
29. Removal Failure Semantics
30. Serialization Failure Semantics
31. Durability During Recovery
32. Recovery Success Semantics
33. Desired Durable Condition Reconciliation
34. Desired-Condition Matrix
35. Runtime State On Recovery
36. Ingress Status Transition
37. State Subscriber Semantics
38. Durability Subscriber Semantics
39. Retry After Failed Recovery
40. Recovery Repeatability
41. Recovery Source Freshness
42. Recovery Result Contract
43. Candidate Store APIs
44. API Comparison Matrix
45. Recovery UI Authority
46. Confirmation Requirements
47. Readable / Unreadable Risk Distinction
48. Pre-Recovery Source Recheck
49. Concurrent Storage Change Assessment
50. Recovery Transaction Ordering
51. Session-First Versus Durability-First Recovery
52. Review-Before-Replace Assessment
53. Raw Source Export Recommendation
54. Recovery From Corrupt Data
55. Recovery From Semantic Invalidity
56. Recovery From Ambiguity
57. Recovery From Read Failure
58. Recovery Completion Evidence
59. Migration-Evidence Separation
60. Recovery Awareness On Success/Failure
61. Ownership Matrix
62. Recovery Mode Matrix
63. Completion Matrix
64. Preservation Matrix
65. Behavioral Invariants
66. Required Future Test Contract
67. OccurrenceIdentity Implications
68. Source-Incarnation Implications
69. PlanDecision Implications
70. Compatibility Assessment
71. Architectural Alignment Assessment
72. Open Questions
73. Recommended Implementation Sequence
74. Recommended Next Task
75. Deviations
76. Discoveries and Deferred Work
77. Validation
78. Final Completion Determination

Additional sections may be added where evidence requires them.

---

# 122. Validation Requirements

This task is investigation only.

No executable or test files should change.

Run:

```
npm run lint
npm run typecheck
npm test
npm run build
```

Record:

* task artifact SHA-256;
* artifact immutability;
* full test-file count;
* full test count;
* build result;
* whether executable files changed;
* whether governance files changed.

Reference searches must cover:

* every guarded active write/removal path;
* active retry;
* clear;
* profile/backup replacement under protection;
* current export behavior;
* recovery warning/UI;
* desired-condition state;
* durability state;
* storage/multi-tab handling.

If the worktree contains earlier Phase 2 implementation changes, distinguish them from Task 2.19 work.

---

# 123. Completion Criteria

Task 2.19 is complete only when:

* recovery completion is precisely defined;
* recovery initiation/attempt/completion are separated;
* eligible replacement sources are decided;
* current-session promotion is accepted or rejected explicitly;
* profile/backup recovery role is decided;
* one generic/source-specific recovery model is adopted;
* abandonment semantics are defined;
* runtime behavior after abandonment is defined;
* relationship to `clearLocalData()` is decided;
* preservation/export obligation is decided;
* readable versus unreadable-source recovery is defined;
* replacement source validation is explicit;
* recovery atomicity is decided;
* store/workflow/persistence ownership is explicit;
* guard bypass authority is explicit;
* recovery write/removal failure behavior is defined;
* serialization-failure behavior is defined;
* durability interaction is defined;
* desired durable condition reconciliation is defined;
* ingress protection clearing rule is explicit;
* subscriber semantics are defined;
* retry-after-failure behavior is defined;
* recovery source freshness is defined;
* result contract is defined;
* API shape is recommended;
* confirmation/UX authority is bounded;
* concurrent checkpoint-change risk is assessed;
* recovery transaction ordering is decided;
* recovery completion evidence is explicit;
* migration completion remains separate;
* required matrices are complete;
* future tests are specified;
* compatibility/incarnation/PlanDecision implications are recorded;
* a bounded next implementation task is identified;
* no unauthorized implementation occurs;
* repository-standard validation passes;
* immutable task artifact remains unchanged.

---

# 124. Task Determination

Task 2.19 is an active-local recovery authority investigation.

Task 2.18 established how DayFrame protects unsafe historical active data without losing session usability.

Task 2.19 must establish how DayFrame is ever allowed to stop protecting it.

The central rule under investigation is:

> Protection exists because ordinary application behavior does not carry sufficient authority to destroy or replace the historical checkpoint.

Therefore protection may end only through an explicit recovery action whose meaning is clear, whose replacement source is valid, whose durable operation succeeds, and whose result can truthfully establish that the previous recovery obligation has been resolved.

A recovery request is not recovery completion.

A runtime replacement is not recovery completion.

A failed persistence attempt is not recovery completion.

Only successful durable resolution under explicit authority may clear protection.

**Task 2.19 is complete when DayFrame has an evidence-backed contract for explicitly replacing or abandoning a protected active-local historical checkpoint, has defined preservation requirements, recovery transaction/result semantics, durability and desired-condition reconciliation, protection-clearing authority, and failure behavior, and has made no unauthorized implementation change.**
