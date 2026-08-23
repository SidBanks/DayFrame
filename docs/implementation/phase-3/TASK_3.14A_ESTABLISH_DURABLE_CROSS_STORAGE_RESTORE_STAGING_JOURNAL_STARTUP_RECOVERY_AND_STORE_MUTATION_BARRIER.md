# Task 3.14A — Establish Durable Cross-Storage Restore Staging, Journal, Startup Recovery, and Store Mutation Barrier

## Status

Ready for resumed implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded durable restore-transaction infrastructure implementation task.

Task 3.14A previously stopped because DayFrame lacked an application-level lifecycle capable of recovering an interrupted cross-storage authority transition before ordinary authority became visible.

That prerequisite is now satisfied by Task 3.14A.1:

* `createDayFrameStore()` remains synchronously constructible;
* store readiness now starts at `initializing`;
* all five authority participants initialize under coordinated bootstrap;
* a pre-bootstrap async hook exists;
* ordinary mutations are centrally gated;
* a shared runtime authority transaction exists;
* participant runtime snapshots and exact installs exist;
* notifications can be deferred and flushed coherently;
* subscriber callbacks can cross-read one coherent authority state.

Task 3.14A now resumes its original purpose:

> Establish the durable staging, restore journal, startup recovery, source-recheck, cross-storage commit, roll-forward, rollback, and cleanup machinery needed for safe complete-authority replacement.

This task includes:

* infrastructure-only restore transaction identity;
* versioned durable restore journal;
* early startup journal detection through the existing pre-bootstrap hook;
* durable target staging;
* durable recovery staging;
* localStorage staging;
* participant fingerprints;
* whole-target fingerprint;
* whole-recovery fingerprint;
* source recheck;
* exact cross-storage authority commit;
* one atomic IndexedDB replacement across ExecutionHistory and HistoricalPlan;
* exact localStorage replacement for Active, Profiles, and PlanDecision;
* ExecutionHistory anti-resurrection preservation;
* deterministic roll-forward;
* deterministic rollback;
* rollback verification;
* recovery-required protected state;
* interrupted-restore bootstrap recovery;
* staging cleanup;
* finalized-but-cleanup-pending recovery;
* explicit restore transaction status;
* regression coverage for failures and crash points.

It does **not** implement:

* Backup V3 schema;
* Backup V3 export;
* Backup V3 file validation;
* Backup V3 file import;
* user-facing restore UI;
* Progress;
* Goals;
* learning;
* Active/Profile/PlanDecision IndexedDB migration;
* domain-version changes.

---

# 1. Execution Artifact Rules

This resumed task artifact is immutable once execution begins.

Before implementation:

1. verify the supplied resumed artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 3.14A.1 is complete and accepted;
6. review:

   * original Task 3.14A stopped result;
   * Task 3.14A.1 result;
   * current pre-bootstrap hook;
   * current mutation-admission API;
   * current authority transaction API;
   * current exact participant runtime-install APIs;
   * current ExecutionHistory persistence/anti-resurrection implementation;
   * current HistoricalPlan persistence implementation;
   * current localStorage persistence for Active, Profiles, and PlanDecision;
7. do not modify the immutable execution artifact during implementation.

Write execution findings separately to:

`docs/implementation/phase-3/TASK_3.14A_RESUMED_ESTABLISH_DURABLE_CROSS_STORAGE_RESTORE_STAGING_JOURNAL_STARTUP_RECOVERY_AND_STORE_MUTATION_BARRIER_RESULT.md`

Preserve the earlier stopped Task 3.14A result as historical evidence.

---

# 2. Purpose

Backup V3 will eventually replace five authority surfaces spanning two storage engines:

```text
localStorage
    Active
    Profiles
    PlanDecision

IndexedDB
    ExecutionHistory
    HistoricalPlan
```

No browser primitive provides one native transaction across both engines.

Therefore DayFrame requires a durable **logical restore transaction**.

The required model is:

```text
validated target authority
        +
validated current recovery authority
        ↓
durable staging
        ↓
restore journal
        ↓
source recheck
        ↓
cross-storage commit
        ↓
verification
        ↓
coherent runtime install
        ↓
finalization
```

If interrupted:

```text
startup
    ↓
restore journal detected before ordinary bootstrap
    ↓
resume forward
or
verified rollback
or
protected recovery-required
```

---

# 3. Governing Restore Principle

> **No live authority mutation may occur until both the target authority and the current recovery authority have been durably staged and verified.**

And:

> **Every live cross-storage transition must be recoverable from durable evidence after restart.**

---

# 4. Domain Neutrality

Task 3.14A is infrastructure.

It must not know what Backup V3 means.

The restore coordinator receives already-validated participant payloads.

Participant/domain adapters remain responsible for:

* payload validation;
* semantic fingerprints;
* exact durable replacement;
* exact runtime replacement;
* source capture;
* source recheck.

---

# 5. Existing Application Primitives To Reuse

Task 3.14A.1 already provides:

* pre-bootstrap async hook;
* initializing/ready/protected readiness;
* centralized mutation admission;
* shared authority transaction;
* runtime participant snapshots;
* exact participant runtime installation;
* notification deferral/coherent flush.

Do not duplicate these.

---

# 6. Restore Transaction Identity

Introduce infrastructure-only branded identity:

```ts
type RestoreTransactionId = Brand<string, "RestoreTransactionId">
```

Requirements:

* canonical lowercase UUID-v4;
* cryptographically strong default allocator;
* allocator injection;
* no domain meaning;
* not exportable as future Backup V3 content.

---

# 7. Restore Journal Version

Introduce:

```ts
RESTORE_JOURNAL_VERSION = 1
```

Independent from:

* Backup version;
* DB schema version;
* all domain versions.

---

# 8. Restore Journal Location

Use a small synchronous localStorage journal key so startup can detect interrupted restore before ordinary authority bootstrap commits.

Preferred conceptual key:

`dayframe-restore-journal-v1`

The journal contains metadata only.

---

# 9. Journal Shape

At minimum:

```ts
{
  app: "DayFrame",
  surface: "restore-journal",
  version: 1,
  transactionId,
  stage,
  mode,
  targetFingerprint,
  recoveryFingerprint,
  createdAt,
  updatedAt
}
```

Optional staging references may be included if needed.

Do not embed large participant payloads.

---

# 10. Journal Exact Validation

Strict exact-key validator.

Reject:

* unknown version;
* malformed transaction ID;
* unknown stage;
* unknown mode;
* invalid timestamps/fingerprints.

Malformed journal → protected recovery-required state.

No guessing.

---

# 11. Restore Modes

At minimum:

```text
ordinary
recoveryReplacement
```

Ordinary restore requires all participants settled and ready.

Recovery replacement may replace protected authority only under explicit source-recheck semantics.

---

# 12. Restore Stage Machine

Adopt an explicit finite stage machine.

Recommended:

```text
prepared
staged
indexedDbCommitted
localStorageCommitted
verified
finalized
```

Recovery stages:

```text
rollbackPrepared
rollbackIndexedDbCommitted
rollbackLocalStorageCommitted
rollbackVerified
recoveryRequired
```

Exact naming may vary, but every persisted stage must have one deterministic startup action.

---

# 13. No Stage Skipping

Journal transitions must follow a validated transition graph.

Invalid transition attempt → failure.

Persisted impossible stage combination → protected recovery-required.

---

# 14. IndexedDB Physical Schema Upgrade

Add restore infrastructure stores to the shared DayFrame durable database.

Likely:

* `restoreMetadata`;
* `restorePayloads`.

Increment the physical DB version explicitly.

Preserve all existing:

* HistoricalPlan data;
* ExecutionHistory data;
* authority metadata.

---

# 15. Restore Metadata Store

One record per active/staged restore transaction.

May contain:

* transaction ID;
* target/recovery participant manifest;
* whole fingerprints;
* staging metadata.

Do not duplicate the localStorage journal unnecessarily.

---

# 16. Restore Payload Store

Recommended key:

```text
[transactionId, side, participantId]
```

where:

* `side = "target" | "recovery"`;
* participant ID is opaque/stable.

Store structured-clone-safe participant payloads.

---

# 17. Required Participants

Use existing authority participant IDs:

* `active`;
* `profiles`;
* `planDecisions`;
* `executionHistory`;
* `historicalPlan`.

Infrastructure treats these as opaque participants.

---

# 18. Target Staging

Before live mutation:

1. validate target payloads through participant adapters;
2. clone payloads;
3. write all target payloads durably;
4. reread;
5. validate;
6. compare participant fingerprints;
7. compare whole target fingerprint.

Failure → no live mutation.

---

# 19. Recovery Staging

Capture exact current authority from all participants.

For ordinary restore, current runtime/durable authority should be settled.

Then:

1. capture recovery payloads;
2. validate;
3. clone;
4. durably stage;
5. reread;
6. compare fingerprints.

No live mutation before this succeeds.

---

# 20. Ordinary Restore Preconditions

Infrastructure should require participant readiness:

* ready;
* no pending durability where participant policy requires settlement;
* not protected;
* not busy;
* no active authority transaction;
* no active restore transaction.

Caller receives structured failure if precondition not met.

---

# 21. Recovery-Replacement Preconditions

A protected participant may be replaced only when:

* caller explicitly chooses recoveryReplacement;
* participant can capture/recheck protected source evidence;
* source recheck succeeds immediately before live mutation.

Do not treat protected replacement as ordinary restore.

---

# 22. Participant Restore Adapter

Define a narrow infrastructure-facing adapter.

Conceptually:

```ts
interface RestoreParticipantAdapter<T> {
  id: RestoreParticipantId;

  getReadiness(): RestoreParticipantReadiness;

  captureCurrentAuthority(): Promise<T>;

  validatePayload(payload: unknown): Result<T>;

  clonePayload(payload: T): T;

  fingerprint(payload: T): string;

  captureSourceFingerprint(): Promise<string>;

  recheckSourceFingerprint(expected: string): Promise<Result>;

  writeDurableTargetExact(payload: T): Promise<Result>;

  verifyDurableTarget(payload: T): Promise<Result>;

  installRuntimeExact(payload: T): void;
}
```

Do not over-generalize.

---

# 23. Combined IndexedDB Participant Adapter

ExecutionHistory and HistoricalPlan must be durably replaced together in one IndexedDB transaction.

Create one coordinated lower-level replacement path spanning all relevant stores.

---

# 24. ExecutionHistory IndexedDB Replacement

Exact replacement must preserve:

* every record;
* quarantine;
* authority metadata;
* anti-resurrection state expected by IndexedDB side.

No new IDs/timestamps.

No legacy migration.

---

# 25. HistoricalPlan IndexedDB Replacement

Exact replacement must preserve:

* batches;
* complete day publications;
* metadata;
* publication timestamps/IDs.

No publication event.

No dedup/publication workflow.

---

# 26. Atomic IndexedDB Replace

One transaction must:

* clear current ExecutionHistory live stores;
* write target ExecutionHistory;
* clear current HistoricalPlan live stores;
* write target HistoricalPlan;
* update required authority metadata.

All commit or none.

---

# 27. Atomic IndexedDB Recovery Replace

Rollback uses the same multi-store path with recovery payloads.

---

# 28. LocalStorage Staging Envelope

Stage the three localStorage participant payloads under one temporary restore-specific envelope.

Preferred conceptual key:

`dayframe-restore-local-stage-v1`

Contents:

* transaction ID;
* target payloads;
* recovery payloads;
* fingerprints.

Strict validation.

---

# 29. LocalStorage Stage Verification

Write → reread → validate → fingerprint compare.

Failure before live mutation → abort safely.

---

# 30. Source Fingerprints

Capture source fingerprint for each participant after recovery staging.

Immediately before first live mutation:

* reread current source;
* compare.

If any source changed:

```text
sourceChanged
```

Abort before live commit.

---

# 31. Active Source Recheck

Reread exact live Active V2 persistence source/marker state.

---

# 32. Profiles Source Recheck

Reread exact Profiles persistence source.

---

# 33. PlanDecision Source Recheck

Reread exact PlanDecision source.

---

# 34. ExecutionHistory Source Recheck

Include:

* IndexedDB authority records;
* quarantine/metadata;
* anti-resurrection infrastructure state.

---

# 35. HistoricalPlan Source Recheck

Include exact current durable ledger/metadata state.

---

# 36. Whole Target Fingerprint

Create deterministic combination of participant fingerprints:

```text
participant ID
+
participant semantic fingerprint
```

sorted by participant ID.

Do not include transaction ID or staging timestamp.

---

# 37. Whole Recovery Fingerprint

Same.

---

# 38. Journal Preparation

Before any live mutation:

1. allocate RestoreTransactionId;
2. create journal `prepared`;
3. write/reread/validate journal.

If journal cannot be established:

* stop;
* no staging/live changes necessary beyond safe cleanup.

---

# 39. Stage Ordering

Preferred:

```text
journal prepared
    ↓
target stage
    ↓
recovery stage
    ↓
source fingerprints captured
    ↓
journal staged
```

No live mutation before `staged`.

---

# 40. Mutation Admission

The Task 3.14A.1 central barrier becomes active for the whole restore transaction.

All ordinary mutations remain blocked.

---

# 41. Notification Barrier

Use the existing shared authority transaction only when runtime authority is switched.

Do not expose intermediate durable state through runtime notifications.

---

# 42. Commit Sequence

Recommended:

```text
1. begin restore/mutation barrier
2. create verified journal
3. stage target
4. stage recovery
5. source recheck
6. journal → staged
7. atomic IndexedDB target replacement
8. verify IndexedDB target
9. journal → indexedDbCommitted
10. localStorage target replacement
11. verify localStorage target
12. establish/verify ExecutionHistory anti-resurrection local marker state
13. journal → localStorageCommitted
14. verify all five durable target authorities
15. begin shared runtime authority transaction
16. install all five runtime targets exactly
17. commit/flush coherent runtime authority
18. journal → verified
19. journal → finalized
20. cleanup staging
21. clear journal
22. release restore barrier
```

Adjust only if repository evidence requires safer marker sequencing.

---

# 43. ExecutionHistory Anti-Resurrection Marker

Restore infrastructure must preserve established IndexedDB-first authority.

After target commit:

* legacy ExecutionHistory localStorage data must not become active;
* anti-resurrection marker must be valid;
* target IndexedDB history is authoritative.

Do not restore ExecutionHistory into legacy localStorage.

---

# 44. Legacy ExecutionHistory Key During Generic Restore

Because Task 3.14A is domain-neutral, participant adapter owns whether legacy migration evidence is:

* removed;
* retained diagnostically;
* ignored.

The final established authority must not permit resurrection.

---

# 45. IndexedDB Commit Failure

If atomic collection transaction fails:

* old IndexedDB authority remains;
* localStorage live authority has not yet changed;
* verify source still old/recovery;
* cleanup stage/journal if safe;
* return failure.

No rollback rewrite needed.

---

# 46. IndexedDB Verification Failure

If transaction committed but target verification fails:

* do not proceed to localStorage;
* restore IndexedDB from verified recovery staging;
* verify rollback;
* if rollback succeeds → old authority restored;
* if rollback fails → recoveryRequired.

---

# 47. LocalStorage Commit

Write live keys in deterministic order.

Recommended:

1. Active;
2. Profiles;
3. PlanDecision;
4. ExecutionHistory anti-resurrection infrastructure action.

Exact order may follow existing key dependencies.

---

# 48. Per-Key LocalStorage Verification

Every live key write:

* reread;
* validate;
* fingerprint compare.

A successful `setItem` alone is insufficient.

---

# 49. LocalStorage Mid-Commit Failure

At this point IndexedDB target is already committed.

Do not call restore successful.

Journal remains authoritative evidence.

Preferred recovery policy:

> roll forward from verified target staging.

---

# 50. Roll-Forward Policy

From `indexedDbCommitted` or partial localStorage commit:

1. validate journal;
2. validate target staging;
3. verify IndexedDB target;
4. apply/reapply all localStorage target writes idempotently;
5. verify;
6. establish anti-resurrection marker;
7. verify all five;
8. runtime coherent install;
9. finalize.

---

# 51. Why Roll Forward

Once:

* full target is durably staged;
* IndexedDB target already committed and verified;

the explicit requested target is the safest known coherent endpoint.

Avoid unnecessary second IndexedDB rewrite unless target staging is no longer trustworthy.

---

# 52. Rollback Policy

Rollback only when roll-forward cannot safely continue.

Requirements:

* recovery stage must validate;
* whole recovery fingerprint must match;
* restore both IndexedDB participants atomically;
* restore all localStorage participants;
* restore anti-resurrection infrastructure state;
* reread/verify all;
* restore runtime authority coherently.

---

# 53. Rollback Journal Stages

Persist rollback progress.

For example:

```text
rollbackPrepared
rollbackIndexedDbCommitted
rollbackLocalStorageCommitted
rollbackVerified
```

Startup must be able to resume rollback.

---

# 54. Rollback Success

Only after whole recovery authority reread/verification passes.

Then:

* restore runtime authority via shared authority transaction;
* clear staging/journal;
* release barrier.

---

# 55. Rollback Failure

Persist:

```text
recoveryRequired
```

Store bootstrap becomes protected.

Keep:

* journal;
* target staging;
* recovery staging.

Do not clear evidence.

---

# 56. Recovery-Required Semantics

Normal application remains unavailable.

Expose only:

* bootstrap protection/readiness;
* safe restore diagnostics;
* future recovery API hooks.

No recovery UI in this task.

---

# 57. Pre-Bootstrap Journal Hook

Use the Task 3.14A.1 pre-bootstrap hook.

At startup:

```text
journal absent
    → continue normal participant bootstrap

journal present
    → recover restore transaction
    ↓
    only after recovery completes
    continue normal bootstrap or install recovered state
```

---

# 58. Startup Recovery Must Precede Ordinary Authority Commit

Mandatory.

No participant can become externally ready first.

---

# 59. Startup `prepared`

No live mutation should have occurred.

If staging incomplete:

* verify current source unchanged;
* safely discard incomplete staging/journal.

If full staging exists and policy permits resume:

* source recheck;
* continue.

Choose deterministic rule and document.

---

# 60. Startup `staged`

No live mutation occurred.

Revalidate target/recovery stage.

Recheck source.

Resume target commit.

---

# 61. Startup `indexedDbCommitted`

Prefer roll forward.

Mandatory direct test.

---

# 62. Startup `localStorageCommitted`

Verify target across all five.

Repair remaining idempotent target writes if needed.

Then runtime install/finalize.

---

# 63. Startup `verified`

Target durable authority is coherent.

Install runtime if needed.

Finalize/cleanup only.

---

# 64. Startup `finalized`

If journal remains due cleanup failure:

* verify final target fingerprint;
* cleanup staging/journal;
* do not repeat restore.

---

# 65. Startup Rollback Stages

Resume rollback from exact persisted stage.

Never start a new heuristic recovery.

---

# 66. Invalid Journal

Malformed/unknown:

* store bootstrap protected;
* retain journal/staging;
* no ordinary authority commit.

---

# 67. Journal Without Staging

Protected recovery-required if live mutation may have happened.

If journal proves `prepared` and no live mutation could have happened, conservative safe cleanup may be allowed.

Document exact distinction.

---

# 68. Orphan Staging Without Journal

Orphan staging is not authority.

Default conservative policy:

* do not apply;
* if transaction ID is unreferenced and no journal exists, cleanup may occur after proving no active restore references it.

---

# 69. Restore Coordinator Status

Expose infrastructure status:

```text
idle
preparing
staging
committing
recovering
finalizing
recoveryRequired
```

Transient runtime state only.

---

# 70. Restore Result Union

At minimum:

* completed;
* busy;
* participantNotReady;
* participantProtected;
* invalidTarget;
* stagingFailed;
* sourceChanged;
* indexedDbCommitFailed;
* indexedDbVerificationFailed;
* localStorageCommitFailed;
* verificationFailed;
* rolledBack;
* rollbackFailed;
* recoveryRequired.

No boolean-only result.

---

# 71. Startup Recovery Result

At minimum:

* noRecoveryNeeded;
* resumedForward;
* rolledBack;
* finalizedCleanup;
* recoveryRequired.

---

# 72. Exact Runtime Installation

After durable target verifies, use the existing shared authority transaction:

```text
begin
install Active exact
install Profiles exact
install PlanDecision exact
install ExecutionHistory exact
install HistoricalPlan exact
commit coherent notifications
```

No ordinary workflows.

---

# 73. Runtime Install Failure

If exact runtime installation unexpectedly fails after durable target is already coherent:

* journal remains;
* store becomes protected;
* startup can reinstall target runtime next session.

Do not roll durable target back merely because a runtime callback failed unless authority install itself is inconsistent.

---

# 74. Notification Coherence

No subscriber sees a hybrid target.

Task 3.14A.1 already guarantees the runtime boundary; prove restore path uses it.

---

# 75. No Domain Allocation

Restore staging/commit must allocate no:

* source incarnation IDs;
* Profile IDs;
* PlanDecision IDs;
* ExecutionSubject IDs;
* ExecutionRecord IDs;
* HistoricalPlan batch IDs.

Only RestoreTransactionId and infrastructure timestamps may be new.

---

# 76. No Domain Retimestamp

Exact target/recovery payload timestamps preserved.

---

# 77. Physical DB Upgrade Preservation

If DB version bumps:

* HistoricalPlan unchanged;
* ExecutionHistory unchanged.

Mandatory.

---

# 78. Staging Clone Isolation

Caller mutation after `beginRestore(...)` cannot alter staged target.

---

# 79. Structured Clone Safety

Participant payload adapters guarantee structured-clone-safe values.

Infrastructure does not normalize domain values.

---

# 80. Staging Capacity Safety

No destructive mutation until all staging writes succeed and reread verify.

This is the fail-before-mutation quota guarantee.

---

# 81. Quota Failure

If quota exceeded during target/recovery stage:

* no live authority mutation;
* cleanup incomplete stage if safe;
* return stagingFailed/quota-specific diagnostic.

---

# 82. Journal Cleanup

After successful verified target authority:

* remove target staging;
* remove recovery staging;
* remove localStorage staging;
* remove restore metadata;
* remove journal.

---

# 83. Cleanup Ordering

Journal should be deleted last.

If staging is removed first and journal remains:

* startup must understand finalized cleanup stage.

---

# 84. Cleanup Failure

If final target is already verified:

* do not rollback good authority;
* leave `finalized` journal;
* startup performs cleanup only.

---

# 85. Privacy

Staging temporarily duplicates sensitive authority.

Do not log payloads.

Cleanup is required.

---

# 86. Logging

Only safe metadata:

* transaction ID if project logging permits;
* stage;
* participant ID;
* error code.

No raw authority.

---

# 87. Cross-Tab Determination

Task 3.14A.1 mutation barrier is in-process only.

Unless repository already has shared-tab locking:

* V1 restore remains single-active-tab supported;
* source recheck reduces stale-commit risk;
* IndexedDB physical transactions remain atomic;
* do not claim full cross-tab serialization.

---

# 88. Optional Browser Locks

Do not add Web Locks unless existing browser support policy and scope clearly justify it.

Not required.

---

# 89. Current Backup V1/V2

Existing backup import/export remains unchanged.

They may now be blocked by restore mutation admission while a restore transaction is active.

No V3.

---

# 90. No Backup V3 Schema

Do not add:

```text
version: 3
```

to backup dispatch.

---

# 91. No User Restore UI

None.

---

# 92. No New Domain Surface

Restore journal/staging are infrastructure only.

---

# 93. Test — RestoreTransactionId

Canonical UUID validation/allocation/injection.

---

# 94. Test — Journal Validation

Strict exact-key/version/stage validation.

---

# 95. Test — Valid Stage Transitions

Mandatory.

---

# 96. Test — Invalid Stage Transition

Rejected.

---

# 97. Test — Full Target Stage Before Mutation

Inject failure on final target participant stage.

Live authority unchanged.

Mandatory.

---

# 98. Test — Full Recovery Stage Before Mutation

Same.

---

# 99. Test — Staging Reread Verification

Mandatory.

---

# 100. Test — Clone Isolation

Mandatory.

---

# 101. Test — Source Recheck Success

Mandatory.

---

# 102. Test — SourceChanged

Mutation after recovery stage before commit aborts with no live target mutation.

Mandatory.

---

# 103. Test — Atomic IndexedDB Target Commit

ExecutionHistory + HistoricalPlan target both replaced.

---

# 104. Test — Atomic IndexedDB Abort

Failure in one leaves both old.

---

# 105. Test — IndexedDB Verification Failure

Rollback from recovery staging.

---

# 106. Test — LocalStorage Target Commit

All three exact.

---

# 107. Test — LocalStorage First Write Failure

Journal/recovery remains safe.

---

# 108. Test — LocalStorage Mid-Commit Failure

Mandatory.

---

# 109. Test — Roll Forward

Mid-localStorage failure resumes to exact full target.

Mandatory.

---

# 110. Test — Idempotent Roll Forward

Reapplying already-written target keys succeeds.

---

# 111. Test — Rollback

Exact old five-surface authority restored.

---

# 112. Test — Rollback Verification

Mandatory.

---

# 113. Test — Rollback Failure

Store becomes protected/recoveryRequired.

---

# 114. Test — Crash At Prepared

Restart deterministic.

---

# 115. Test — Crash At Staged

Resume safely.

---

# 116. Test — Crash After IndexedDB Commit

Roll forward.

Mandatory.

---

# 117. Test — Crash Mid-localStorage Commit

Roll forward.

Mandatory.

---

# 118. Test — Crash After LocalStorage Commit

Verify/finalize.

---

# 119. Test — Crash After Verified

Cleanup only.

---

# 120. Test — Cleanup Failure

Target remains authority; restart cleans.

---

# 121. Test — Invalid Journal

Protected.

---

# 122. Test — Missing Stage Referenced By Journal

Protected according to stage semantics.

---

# 123. Test — Orphan Staging

Never becomes authority.

---

# 124. Test — Pre-Bootstrap Recovery Ordering

Journal recovery finishes before ordinary participant bootstrap commits.

Mandatory.

---

# 125. Test — Mutation Barrier Integration

All ordinary mutations rejected throughout active restore.

---

# 126. Test — Runtime Exact Target Install

All five final runtime authorities coherent.

---

# 127. Test — Subscriber Cross-Read

Restore commit subscribers see all target state.

---

# 128. Test — No HistoricalPlan Publish Event

Exact restore target install does not publish.

---

# 129. Test — No Execution Record Allocation

Exact restore does not create record.

---

# 130. Test — No Active Incarnation Allocation

Mandatory.

---

# 131. Test — No Profile/Decision Allocation

Mandatory.

---

# 132. Test — ExecutionHistory Anti-Resurrection

Target exact restore remains IndexedDB authoritative after restart.

Mandatory.

---

# 133. Test — HistoricalPlan Preservation During DB Upgrade

Mandatory.

---

# 134. Test — ExecutionHistory Preservation During DB Upgrade

Mandatory.

---

# 135. Test — Current Behavior With No Journal

Normal coordinated bootstrap unchanged.

---

# 136. Test — Restore Infrastructure Import Safety

No browser-global crash under injected test environment.

---

# 137. Test — fake-indexeddb

Dev-only.

---

# 138. No Backup V3 Regression

Static audit.

---

# 139. No Domain Version Regression

Static audit.

---

# 140. Architecture Checkpoint

If completed, create:

`docs/checkpoints/CHECKPOINT_Phase_3_Durable_Cross_Storage_Restore_Transaction_Foundation.md`

---

# 141. Checkpoint Contents

Include:

1. restore transaction identity;
2. journal;
3. stage machine;
4. target staging;
5. recovery staging;
6. source recheck;
7. combined IndexedDB commit;
8. localStorage commit;
9. roll-forward;
10. rollback;
11. startup recovery;
12. runtime authority transaction integration;
13. anti-resurrection;
14. cleanup;
15. single-tab limitation;
16. invariants;
17. Backup V3 prerequisite unlocked.

---

# 142. ADR

Create:

`ADR_DURABLE_CROSS_STORAGE_AUTHORITY_REPLACEMENT.md`

if project convention supports.

Document why logical journaling is required despite atomic IndexedDB transactions.

---

# 143. Governance Updates

Update:

* `CURRENT_STATE.md`;
* `DECISIONS.md`;
* `ROADMAP.md`;

if infrastructure is established.

Do not claim Backup V3 exists.

---

# 144. Expected Production Files

Likely:

* `code/src/infrastructure/restore/restoreIdentity.ts`;
* `code/src/infrastructure/restore/restoreJournal.ts`;
* `code/src/infrastructure/restore/restoreStaging.ts`;
* `code/src/infrastructure/restore/restoreCoordinator.ts`;
* `code/src/infrastructure/restore/restoreParticipants.ts`;
* DB schema upgrade;
* localStorage restore stage adapter;
* pre-bootstrap integration;
* tests.

Reuse Task 3.14A.1 authority transaction modules.

---

# 145. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.14A_RESUMED_ESTABLISH_DURABLE_CROSS_STORAGE_RESTORE_STAGING_JOURNAL_STARTUP_RECOVERY_AND_STORE_MUTATION_BARRIER_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Prior Stop History
4. Task 3.14A.1 Prerequisite Confirmation
5. Initial Restore Infrastructure Audit
6. Files Changed
7. RestoreTransactionId
8. Journal Version
9. Journal Location
10. Journal Shape
11. Journal Validation
12. Restore Modes
13. Stage Machine
14. Stage Transition Validation
15. DB Schema Upgrade
16. Restore Metadata Store
17. Restore Payload Store
18. Target Staging
19. Recovery Staging
20. localStorage Staging
21. Participant Adapter Boundary
22. Target Fingerprints
23. Recovery Fingerprints
24. Whole Fingerprints
25. Source Recheck
26. Ordinary Restore Preconditions
27. Recovery Replacement Preconditions
28. Mutation Barrier Integration
29. Commit Sequence
30. Combined IndexedDB Replacement
31. HistoricalPlan Exact Durable Replacement
32. ExecutionHistory Exact Durable Replacement
33. Anti-Resurrection Preservation
34. localStorage Replacement
35. Per-Key Verification
36. IndexedDB Commit Failure
37. IndexedDB Verification Failure
38. localStorage Commit Failure
39. Roll-Forward Policy
40. Roll-Forward Implementation
41. Rollback Policy
42. Rollback Implementation
43. Rollback Verification
44. Rollback Failure
45. Recovery-Required State
46. Pre-Bootstrap Recovery Hook
47. prepared Recovery
48. staged Recovery
49. indexedDbCommitted Recovery
50. localStorageCommitted Recovery
51. verified Recovery
52. finalized Cleanup Recovery
53. Rollback-Stage Recovery
54. Invalid Journal
55. Missing Staging
56. Orphan Staging
57. Restore Coordinator Status
58. Restore Result Union
59. Startup Recovery Result
60. Runtime Authority Install
61. Subscriber Coherence
62. No Domain Allocation
63. No Retimestamp
64. Staging Capacity Safety
65. Cleanup
66. Cleanup Failure
67. Cross-Tab Determination
68. Tests Added
69. Identity/Journal Tests
70. Staging Tests
71. Source-Recheck Tests
72. IndexedDB Commit Tests
73. localStorage Commit Tests
74. Roll-Forward Tests
75. Rollback Tests
76. Crash/Restart Tests
77. Runtime/Notification Tests
78. Anti-Resurrection Tests
79. DB Upgrade Preservation Tests
80. No-Backup-V3 Audit
81. No-Domain-Version Audit
82. Checkpoint
83. ADR
84. Governance Updates
85. Architectural Alignment Assessment
86. Deviations
87. Discoveries and Deferred Work
88. Resume Task 3.14 Recommendation
89. Focused Validation
90. Full Validation
91. Final Completion Determination

---

# 146. Required Matrices

## A. Journal Stage Matrix

| Stage | Live authority changed? | Startup action |
| ----- | ----------------------: | -------------- |

## B. Failure Matrix

| Failure point | Target staged | Recovery staged | Live mutation | Action |
| ------------- | ------------: | --------------: | ------------: | ------ |

## C. Participant Matrix

| Participant | Storage | Target exact replace | Recovery exact replace |
| ----------- | ------- | -------------------: | ---------------------: |

## D. Crash Matrix

| Crash point | Restart result |
| ----------- | -------------- |

## E. Roll-Forward/Rollback Matrix

| State | Preferred action | Fallback |
| ----- | ---------------- | -------- |

---

# 147. Required Architectural Invariants

At minimum prove:

1. RestoreTransactionId is infrastructure-only.
2. Journal is durable before live mutation.
3. Target and recovery staging are both verified before live mutation.
4. Insufficient staging capacity fails before authority mutation.
5. Whole target/recovery fingerprints are deterministic.
6. Source recheck occurs immediately before first live mutation.
7. SourceChanged prevents target commit.
8. ExecutionHistory and HistoricalPlan replace atomically together.
9. HistoricalPlan exact durable replacement does not publish.
10. ExecutionHistory exact durable replacement does not create records.
11. LocalStorage participant writes are individually reread/verified.
12. Partial localStorage commit is always journal-recoverable.
13. Startup journal recovery runs before ordinary authority commit.
14. `indexedDbCommitted` recovery prefers roll forward.
15. Roll-forward uses only verified staged target.
16. Rollback uses only verified staged recovery.
17. Rollback success is reread/verified.
18. Rollback failure becomes durable recovery-required protection.
19. Invalid journal/staging never causes heuristic authority selection.
20. Final runtime installation uses shared authority transaction.
21. Subscriber callbacks see coherent restored authority.
22. No domain IDs or timestamps are reallocated.
23. ExecutionHistory anti-resurrection survives target and recovery replacement.
24. Existing HistoricalPlan/ExecutionHistory data survive DB schema upgrade.
25. Cleanup happens only after verified authority.
26. Cleanup failure does not roll back valid authority.
27. No Backup V3 schema/import/export exists yet.

---

# 148. Validation Requirements

Run focused tests for:

* restore identity;
* journal validation/stages;
* staging;
* source recheck;
* combined IndexedDB replacement;
* localStorage replacement;
* roll forward;
* rollback;
* rollback failure;
* startup recovery;
* cleanup recovery;
* runtime coherent install;
* anti-resurrection;
* DB upgrade preservation.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Full suite must pass.

Record exact:

* test-file count;
* test count;
* build module count.

---

# 149. Completion Criteria

Task 3.14A is complete only when:

* durable restore transaction identity exists;
* strict versioned localStorage restore journal exists;
* journal is checked through the pre-bootstrap hook before ordinary authority commit;
* target and recovery payloads for all five participants can be durably staged;
* all staged payloads reread/validate/fingerprint before live mutation;
* localStorage staging exists for Active/Profiles/PlanDecision;
* source fingerprints and recheck cover all five current authorities;
* no live mutation occurs before staging/recheck succeeds;
* ExecutionHistory and HistoricalPlan replace atomically in one IndexedDB transaction;
* localStorage target replacement is exact and individually verified;
* ExecutionHistory anti-resurrection is preserved;
* partial cross-storage commit is journal-recoverable;
* restart deterministically resumes forward or rollback;
* roll-forward is preferred once verified IndexedDB target commit exists and target staging is valid;
* rollback restores verified recovery authority exactly;
* rollback failure produces protected recovery-required state;
* startup recovery handles every valid journal stage;
* invalid journal/staging never triggers guessing;
* final runtime authority installation uses the shared authority transaction from 3.14A.1;
* subscribers see one coherent final authority;
* no domain IDs or timestamps are reallocated;
* staging cleanup occurs only after verified authority;
* cleanup failure is restart-cleanable without rollback;
* DB schema upgrade preserves HistoricalPlan and ExecutionHistory;
* no Backup V3 schema/import/export/UI, persistence migration, domain-version change, Progress, Goal, learning, or unrelated feature is introduced;
* complete validation passes;
* result artifact is complete.

---

# 150. Explicit Non-Goals

Do **not**:

* implement Backup V3;
* add backup version 3 dispatch;
* export complete backups;
* parse V3 files;
* add user-facing restore UI;
* migrate Active/Profile/PlanDecision to IndexedDB;
* change ExecutionHistory semantics;
* change HistoricalPlan semantics;
* change PlanDecision semantics;
* add Progress;
* add Goals;
* add learning;
* add cloud/sync;
* add encryption;
* add cross-tab locking;
* silently choose old/new authority after corruption;
* skip verification;
* perform unrelated UI work.

---

# 151. Stop Conditions

Stop and report if:

* target/recovery staging cannot be made fail-before-mutation;
* source recheck cannot cover one of the five authorities;
* ExecutionHistory + HistoricalPlan cannot be replaced in one IndexedDB transaction;
* anti-resurrection cannot be preserved during exact target/rollback replacement;
* localStorage partial commit cannot be made deterministically recoverable;
* startup journal recovery cannot run before ordinary authority commit despite 3.14A.1;
* roll-forward/rollback cannot be made deterministic from persisted stage evidence;
* runtime exact installation cannot consume durable recovery result coherently;
* DB schema upgrade threatens existing collection data;
* a new semantic/domain prerequisite is discovered.

Do not weaken recoverability or verification to proceed.

---

# 152. Follow-On Boundary

If resumed Task 3.14A completes successfully:

> **Resume Task 3.14 — Define and Implement Backup V3 Across Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan**

At that point Backup V3 should consume this infrastructure rather than inventing restore mechanics itself.

Task 3.14 will then implement:

* Backup V3 domain envelope;
* five-surface export;
* canonical validation;
* protected/quarantine export policy;
* exact restore-target construction;
* restore through the 3.14A coordinator;
* Preview clear;
* V1/V2 compatibility;
* complete roundtrip/restart regression coverage.

---

# 153. Task Determination

**Authorized:** durable restore identity, restore journal, staging, source fingerprints/recheck, cross-storage exact replacement, roll-forward, rollback, startup recovery, cleanup, anti-resurrection preservation, runtime authority-transaction integration, and regression coverage.

**Not authorized:** Backup V3 schema/export/import, user-facing backup behavior, domain semantic changes, Progress, Goals, learning, cloud/sync, cross-tab coordination, or unrelated persistence migration.

The governing resumed-task principle is:

> **DayFrame now knows how to delay readiness and how to switch runtime authority coherently. This task must make that switch durable across storage engines: both the requested new authority and the exact old authority must exist in verified staging before any live mutation occurs, every transition must leave a durable journal trail, and restart must always know whether to finish the new truth, restore the old truth, or stop in explicit protection.**

---

# 154. Final Completion Statement

**Task 3.14A is complete when DayFrame has a domain-format-neutral, interruption-safe cross-storage authority-replacement foundation that uses an infrastructure-only RestoreTransactionId, a strict startup-visible restore journal, verified target and recovery staging for all five authority participants, exact source fingerprints and pre-commit source recheck, one atomic IndexedDB replacement for ExecutionHistory and HistoricalPlan, exact verified localStorage replacement for Active, Profiles, and PlanDecision, preserved ExecutionHistory anti-resurrection semantics, deterministic persisted-stage roll-forward and rollback, verified recovery restoration, durable recovery-required protection when rollback cannot be proven, and cleanup semantics that never determine authority correctness; when the pre-bootstrap hook resolves interrupted transactions before ordinary authority commit; when successful durable target/recovery results are installed through the shared runtime authority transaction so subscribers observe one coherent authority; when no domain IDs or timestamps are regenerated; when existing collection data survives the physical database upgrade; when complete repository validation passes; and when no Backup V3 schema, export/import path, user-facing restore UI, domain-version change, Progress, Goal, learning, sync, cross-tab lock, or unrelated feature is introduced.**
