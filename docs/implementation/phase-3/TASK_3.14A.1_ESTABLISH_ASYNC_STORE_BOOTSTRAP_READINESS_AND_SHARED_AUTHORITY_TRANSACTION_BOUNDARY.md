# Task 3.14A.1 — Establish Async Store Bootstrap Readiness and a Shared Authority Transaction Boundary

## Status

Ready for resumed implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded application-lifecycle, coordinated-authority bootstrap, centralized mutation-admission, runtime authority-transaction, and observable-state coherence implementation task.

Task 3.14A.1 previously stopped because DayFrame's consumers assumed that successful synchronous `createDayFrameStore()` construction implied immediately usable authority.

Task 3.14A.1.1 has now removed that prerequisite:

* stable `initializing | ready | protected` readiness vocabulary exists;
* `getReadiness()`, `subscribeReadiness()`, and `whenReady()` exist;
* DayFrameApp branches on readiness before deriving domain UI;
* initializing/protected shells exist;
* a non-authoritative bootstrap placeholder exists;
* ordinary UI tests use an explicit ready fixture;
* lifecycle/persistence tests have an explicit readiness-wait path;
* production remains transitionally immediate-ready until this task changes producer ownership.

Task 3.14A.1 now resumes its original purpose:

> Replace the transitional immediate-ready producer with a real coordinated asynchronous authority bootstrap, and establish one shared observable-authority transaction boundary across all current authority participants.

This task includes:

* real `initializing → ready | protected` producer lifecycle;
* coordinated five-participant bootstrap;
* removal of ExecutionHistory constructor self-initialization;
* removal of HistoricalPlan constructor self-initialization;
* coordinated Active ingress;
* coordinated Profiles ingress;
* coordinated PlanDecision ingress;
* ExecutionHistory initialization under coordinator ownership;
* HistoricalPlan initialization under coordinator ownership;
* candidate authority versus committed runtime authority;
* store-wide bootstrap protection;
* centralized mutation admission;
* shared authority transaction;
* runtime participant snapshots;
* exact runtime authority installation;
* authority transaction commit;
* authority transaction abort;
* deferred participant notifications;
* coherent notification flush;
* subscriber cross-read guarantees;
* pre-bootstrap recovery hook boundary;
* readiness-aware regression migration for remaining lifecycle tests.

It does **not** implement:

* durable restore journal;
* durable target staging;
* durable recovery staging;
* RestoreTransactionId;
* cross-storage roll-forward;
* cross-storage rollback;
* Backup V3;
* Backup V3 import/export;
* IndexedDB staging stores;
* new persistence schema;
* Progress;
* Goals;
* learning;
* domain-version changes.

---

# 1. Execution Artifact Rules

This resumed task artifact is immutable once execution begins.

Before implementation:

1. verify this resumed execution artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 3.14A.1.1 is complete;
6. review:

   * original Task 3.14A.1 result;
   * Task 3.14A.1.1 result;
   * current `dayFrameReadiness.ts`;
   * current `createDayFrameStore`;
   * current `DayFrameApp`;
   * ExecutionHistory initialization;
   * HistoricalPlan initialization;
   * PlanDecision ingress;
   * participant listener ownership;
   * remaining raw store lifecycle tests;
7. do not modify the immutable execution artifact during implementation.

Write execution findings separately to:

`docs/implementation/phase-3/TASK_3.14A.1_ESTABLISH_ASYNC_STORE_BOOTSTRAP_READINESS_AND_SHARED_AUTHORITY_TRANSACTION_BOUNDARY_RESULT.md`

The previous stopped result remains historical evidence and must not be overwritten.

If the resumed implementation reaches a new explicit stop condition, create a new result artifact recording it rather than weakening the authority-coherence contract.

---

# 2. Purpose

Task 3.14A requires startup restore recovery to occur before ordinary DayFrame authority becomes externally usable.

The producer currently remains:

```text
createDayFrameStore()
        ↓
load authority immediately
        ↓
readiness = ready
```

Task 3.14A.1.1 deliberately left that producer behavior unchanged while migrating consumers.

Task 3.14A.1 now changes the producer to:

```text
createDayFrameStore()
        ↓
stable store shell
        ↓
readiness = initializing
        ↓
coordinated authority bootstrap
        ↓
all required participant candidates established
        ↓
shared authority transaction
        ↓
exact coherent runtime install
        ↓
deferred notification flush
        ↓
readiness = ready
```

or:

```text
bootstrap cannot establish coherent authority
        ↓
readiness = protected
```

---

# 3. Governing Authority Principle

The central rule remains:

> **Store construction is not authority readiness.**

A synchronously returned store shell may exist while authority initialization is still underway.

No loaded subset of the user's authority becomes ordinary application authority merely because that subset was available sooner.

---

# 4. Governing Observable-State Principle

A coordinated authority install must satisfy:

```text
outside observer sees
    OLD coherent authority

or

    NEW coherent authority
```

Never:

```text
new Active
old Profiles
new PlanDecision
old ExecutionHistory
new HistoricalPlan
```

---

# 5. Governing Consumer Contract

Task 3.14A.1.1 established the consumer contract.

Do not redesign it.

Use the existing:

* `DayFrameReadiness`;
* `getReadiness()`;
* `subscribeReadiness()`;
* `whenReady()`;
* bootstrap placeholder;
* DayFrameApp loading/protected branches;
* ready-only test fixture;
* readiness wait helper.

This task changes producer timing underneath that stable contract.

---

# 6. Required Initial Producer Audit

Before modifying code, trace the current producer lifecycle for:

* Active;
* Profiles;
* PlanDecision;
* ExecutionHistory;
* HistoricalPlan;
* Preview rehydration;
* durability states;
* ingress states;
* subscribers.

For each participant, document:

1. where raw durable data is read;
2. when validation occurs;
3. when runtime state becomes externally visible;
4. whether initialization writes/migrates durability;
5. what protected/unavailable results exist;
6. what listener notifications currently fire.

---

# 7. Store Shell

`createDayFrameStore()` must remain synchronously callable.

Immediately after construction:

```text
store.getReadiness().status === "initializing"
```

unless an explicitly injected already-resolved test bootstrap path is used.

---

# 8. Bootstrap Placeholder

Use the Task 3.14A.1.1 canonical placeholder.

Do not replace it with:

* default demo setup;
* partially loaded Active;
* persisted Profiles;
* PlanDecision candidate;
* migrated ExecutionHistory;
* HistoricalPlan contents.

The placeholder remains non-authoritative.

---

# 9. Placeholder Persistence

No persistence path may serialize the placeholder.

Preserve and strengthen the existing `isBootstrapPlaceholderState()` protection where appropriate.

---

# 10. Bootstrap State Producer

Replace transitional immediate-ready behavior with a real lifecycle:

```text
initializing
    ↓
ready
```

or:

```text
initializing
    ↓
protected
```

No ordinary direct transition:

```text
protected → ready
```

unless an explicit future recovery/bootstrap retry path governs it.

---

# 11. `whenReady()`

Update from immediate resolved transitional behavior.

Requirements:

* one stable promise per store bootstrap;
* resolves `{ status: "ready" }` only after coherent authority commit;
* terminates with structured protected result if bootstrap becomes protected;
* multiple callers observe the same bootstrap outcome;
* no polling;
* no arbitrary timer.

---

# 12. Readiness Subscription

Real transitions now exist.

Subscribers must receive:

```text
initializing → ready
```

or:

```text
initializing → protected
```

exactly according to existing subscription conventions.

---

# 13. Bootstrap Coordinator

Create one coordinator responsible for initial authority establishment.

Preferred module:

`code/src/state/dayFrameBootstrap.ts`

or repository-equivalent.

It owns:

* pre-bootstrap hook;
* participant initialization;
* participant candidate collection;
* protection determination;
* coherent authority installation;
* readiness transition.

---

# 14. Required Participants

Exactly these five authority participants:

1. Active
2. Profiles
3. PlanDecision
4. ExecutionHistory
5. HistoricalPlan

Preview is derived/runtime state and is not an independent bootstrap authority participant.

---

# 15. Participant Identity

Stable internal identifiers are sufficient:

```text
active
profiles
planDecisions
executionHistory
historicalPlan
```

No UUIDs.

---

# 16. Bootstrap Participant Boundary

Introduce the smallest common boundary necessary.

Conceptually:

```ts
interface DayFrameBootstrapParticipant<Candidate, Snapshot> {
  id: DayFrameAuthorityParticipantId;

  initializeCandidate(): Promise<
    | { status: "ready"; candidate: Candidate }
    | { status: "protected"; reason: unknown }
  >;

  captureRuntimeSnapshot(): Snapshot;

  installRuntimeCandidateExact(candidate: Candidate): void;

  restoreRuntimeSnapshotExact(snapshot: Snapshot): void;
}
```

Exact shape should follow repository conventions.

Do not force unrelated participant details into one giant generic interface.

---

# 17. Candidate Authority

During initialization:

* participant may read;
* validate;
* migrate;
* quarantine;
* perform existing durability establishment as required;

but ordinary external runtime authority should not be announced independently.

The result supplied to the coordinator is a candidate for coherent installation.

---

# 18. Candidate Versus Raw Ingress

Raw storage bytes/rows are not candidates until existing domain validation/recovery rules accept them.

---

# 19. Active Initialization

Current synchronous Active ingress becomes a bootstrap candidate.

It may still read synchronously.

Do not install it into externally visible runtime state independently.

---

# 20. Active V2 Migration Semantics

Preserve all accepted Active V2/V1 migration and anti-resurrection behavior.

Do not redesign Active persistence.

---

# 21. Profiles Initialization

Current Profiles ingress becomes a bootstrap candidate.

Preserve:

* Profile V2 semantics;
* profile validation;
* IDs/incarnations;
* existing protection behavior.

---

# 22. PlanDecision Initialization

PlanDecision must stop independently establishing externally visible runtime authority during surface construction.

Its localStorage read/validation should produce a bootstrap candidate.

Preserve PlanDecision V1 semantics.

---

# 23. ExecutionHistory Self-Initialization Removal

Remove constructor-started:

```ts
void initializeExecutionHistory()
```

or equivalent.

ExecutionHistory initialization must be invoked exactly once by the bootstrap coordinator.

Mandatory.

---

# 24. ExecutionHistory Initialization Semantics

Preserve Task 3.13 exactly:

* IndexedDB-first authority;
* legacy migration eligibility;
* anti-resurrection;
* staged migration;
* quarantine;
* protection;
* current outcome semantics.

Only initialization ownership changes.

---

# 25. HistoricalPlan Self-Initialization Removal

Remove constructor-started:

```ts
void initialize()
```

or equivalent.

Coordinator invokes initialization exactly once.

---

# 26. HistoricalPlan Initialization Semantics

Preserve Task 3.12:

* IndexedDB authority;
* protection;
* pending durable publication semantics;
* indexed reads;
* publication identity.

No HistoricalPlan semantic change.

---

# 27. Direct Surface Construction

ExecutionHistory/HistoricalPlan direct tests currently rely on constructor self-start.

Provide explicit initialization API suitable for:

* bootstrap coordinator;
* direct lifecycle tests.

Example:

```ts
await executionHistory.initialize()
await historicalPlan.initialize()
```

Do not hide lifecycle behind constructor side effect.

---

# 28. Initialization Idempotence

Participant initialization should reject or safely return the same result on accidental duplicate invocation according to existing conventions.

Preferred:

> coordinator guarantees one invocation and surfaces expose stable initialization promise.

---

# 29. Bootstrap Ordering

Preferred:

```text
construct participant shells
        ↓
run pre-bootstrap hook
        ↓
collect synchronous candidates
        +
initialize async collection participants
        ↓
all required candidates ready?
        ↓
YES → authority transaction install
NO  → protected
```

---

# 30. Parallel Versus Sequential Initialization

ExecutionHistory and HistoricalPlan may initialize in parallel if:

* they do not depend on each other's runtime authority;
* their IndexedDB initialization/migration operations remain safe.

Audit.

Do not parallelize merely for speed if initialization ordering carries semantics.

---

# 31. Pre-Bootstrap Hook

Introduce the future restore-recovery insertion point now.

Conceptually:

```ts
preAuthorityBootstrap?: () => Promise<
  | { status: "continue" }
  | { status: "protected"; reason: ... }
>
```

Default implementation is no-op/continue.

No journal logic in this task.

---

# 32. Hook Ordering

The pre-bootstrap hook runs before ordinary participant authority is committed externally.

This is the critical capability 3.14A needs later.

---

# 33. Hook May Be Async

Store remains `initializing`.

---

# 34. Hook Protected Result

If future hook returns protected:

* normal bootstrap does not commit participant authority;
* store readiness becomes protected;
* ordinary mutation remains unavailable.

---

# 35. Bootstrap Failure

If any required participant cannot establish a safe candidate:

* do not commit the other four as ordinary authority;
* store enters protected;
* preserve participant-specific raw/recovery evidence;
* do not return ready.

---

# 36. Partial Candidate Retention

Participant internals may retain diagnostic/protected ingress evidence.

Do not expose candidate values as ordinary coherent authority.

---

# 37. Bootstrap Protection Reason

Define store-level reason vocabulary broad enough to identify:

* participant protected;
* participant unavailable if applicable;
* bootstrap transaction failure;
* pre-bootstrap hook protected.

Do not encode Backup V3-specific concepts.

---

# 38. Shared Authority Transaction

Implement one runtime/application authority transaction manager.

Preferred module:

`code/src/state/dayFrameAuthorityTransaction.ts`

This transaction governs **observable runtime authority**.

---

# 39. Distinguish Physical Transactions

Document explicitly:

```text
DayFrame authority transaction
    ≠ IndexedDB transaction
    ≠ localStorage write group
```

It coordinates what runtime observers can see.

---

# 40. Transaction Lifecycle

At minimum:

```text
inactive
    ↓ begin
active
    ↓ commit
inactive
```

or:

```text
active
    ↓ abort
aborting
    ↓ restored
inactive
```

---

# 41. No Nested Authority Transactions

Reject nested begin.

Mandatory test.

---

# 42. Transaction Kind

Internal descriptive kind may support:

* `bootstrap`;
* `restore`;
* `exactReplacement`.

No Backup V3-specific behavior.

---

# 43. Transaction Capability

Exact participant installation must not become an unrestricted public API.

Use internal capability/token/module boundary if useful.

---

# 44. Runtime Snapshot

At transaction begin, capture clone-isolated pre-transaction runtime state for all registered participants.

This enables truthful runtime abort.

---

# 45. Snapshot Contents — Active/Main State

Capture enough to restore exact pre-transaction runtime state, including:

* authored state;
* Preview if current runtime snapshot includes it;
* other main-state fields required for exact restoration.

---

# 46. Snapshot Contents — Profiles

Exact current Profiles runtime authority.

---

# 47. Snapshot Contents — PlanDecision

Exact current decisions plus relevant runtime/durability status needed for restoration.

---

# 48. Snapshot Contents — ExecutionHistory

Capture:

* valid current runtime history;
* quarantine;
* pending accepted mutations;
* durability state;
* protection/ingress state as necessary.

No domain reallocation.

---

# 49. Snapshot Contents — HistoricalPlan

Capture exact runtime/session authority required to restore:

* pending accepted publications;
* relevant cache/current runtime state;
* durability/protection state.

Do not require loading the entire multi-year ledger merely for a runtime transaction if current runtime doesn't hold it.

---

# 50. Snapshot Scope Discipline

Snapshot runtime authority, not whole durable storage.

Durable cross-storage rollback comes in resumed Task 3.14A.

---

# 51. Snapshot Clone Isolation

Mandatory.

Mutating participant state after capture must not mutate snapshot.

---

# 52. Exact Runtime Install — Active

Provide internal exact installation.

It:

* allocates no source IDs/incarnations;
* performs no persistence;
* emits no direct external notification during transaction;
* invokes no ordinary lifecycle workflow.

---

# 53. Exact Runtime Install — Profiles

Same.

No profile ID allocation.

---

# 54. Exact Runtime Install — PlanDecision

Same.

No decision creation/accept behavior.

---

# 55. Exact Runtime Install — ExecutionHistory

Install exact runtime authority.

Must not:

* create an execution record;
* assign IDs;
* retimestamp;
* perform ordinary persistence.

---

# 56. Exact Runtime Install — HistoricalPlan

Install exact runtime/session authority.

Must not:

* call `publish`;
* allocate batch IDs;
* allocate publication timestamps;
* emit a publication event.

---

# 57. Bootstrap Transaction

Initial coherent authority installation uses the same shared authority transaction.

This proves the mechanism before restore depends on it.

---

# 58. Bootstrap Runtime Snapshot

At first bootstrap, placeholder state is effectively pre-transaction main authority.

Abort/protection should leave the store in protected bootstrap state rather than pretending placeholder is ready authority.

---

# 59. Centralized Mutation Admission

Implement one store-level authority source for ordinary mutation admission.

Conceptual:

```ts
type DayFrameMutationAdmission =
  | { allowed: true }
  | {
      allowed: false;
      reason:
        | "initializing"
        | "protected"
        | "authorityTransactionActive";
    };
```

---

# 60. Admission Source Of Truth

Admission considers:

1. store readiness;
2. active authority transaction.

Do not derive independently in each participant.

---

# 61. Authored-State Mutation Coverage

Gate all externally reachable authored mutations.

Audit:

* setup setters;
* source create/update/delete;
* manual event mutations;
* shift/cycle edits;
* schedule preference edits;
* profile-driven Active replacement.

---

# 62. Profile Mutation Coverage

Gate:

* save;
* load;
* delete.

---

# 63. PlanDecision Mutation Coverage

Gate all externally reachable mutation/retry/recovery methods.

---

# 64. Preview Generation Coverage

Gate authoritative Preview generation.

Mandatory.

Otherwise HistoricalPlan could publish during a future restore transaction.

---

# 65. Try/Revision Coverage

Audit Try/revise actions.

If they mutate current runtime planning state, gate appropriately.

---

# 66. ExecutionHistory Mutation Coverage

Gate:

* report;
* correct;
* retract;
* re-report;
* retry;
* quarantine removal;
* recovery replacement/abandon.

---

# 67. HistoricalPlan Mutation Coverage

Gate:

* publish;
* persistence retry;
* recovery;
* clear.

---

# 68. Full Clear Coverage

Gate.

---

# 69. Backup V1/V2 Import Coverage

Gate existing mutations/imports.

No Backup V3.

---

# 70. Export Coverage

Read-only exports must not capture hybrid authority during active authority transaction.

Gate or defer them.

---

# 71. Direct Surface Escape Hatches

Task 3.14A.1.1 discovered composed surface methods can bypass main-store guards.

Integrate admission at the participant boundary/capability level.

Do not rely only on DayFrameStore wrapper actions.

---

# 72. Public Direct Surface APIs

Audit whether application code can retain a reference to PlanDecision/ExecutionHistory/HistoricalPlan surfaces and mutate them directly.

All ordinary public mutation entry points must honor admission.

---

# 73. Internal Bootstrap Bypass

Coordinator exact installation needs an internal authorized path.

Do not expose a public:

```ts
ignoreReadiness: true
```

flag.

---

# 74. Rejection Semantics

Where an existing API returns a result union:

* return explicit admission failure.

Where APIs are void:

* adopt the narrowest non-silent compatibility solution;
* update internal/action types if required.

Do not silently discard mutation.

---

# 75. UI Pre-Ready Barrier

DayFrameApp already prevents user-driven pre-ready mutations.

This task must additionally protect non-UI/programmatic paths.

---

# 76. Notification Boundary

Introduce one shared notification scheduler/barrier.

Participant listener sets may remain local.

The shared layer decides:

```text
notify now
or
defer until authority transaction commit
```

---

# 77. Notification Channels

At minimum coordinate:

* main/authored state;
* Profiles;
* PlanDecision;
* ExecutionHistory;
* HistoricalPlan;
* relevant durability/readiness channels.

---

# 78. Notification Registration

Each participant registers its channel with the scheduler.

No need to move listener ownership globally.

---

# 79. Normal Operation

When no authority transaction:

> existing immediate notification behavior remains.

Do not change ordinary semantics.

---

# 80. During Transaction

Participant state changes:

```text
mark channel dirty
do not call external listeners
```

---

# 81. Dirty Channel Dedup

Each channel flushes at most once per authority transaction.

---

# 82. Runtime Installation Before Flush

Every target participant state must be installed before the first external listener callback runs.

Mandatory.

---

# 83. Commit Notification Ordering

Recommended order:

1. main/authored state;
2. Profiles;
3. PlanDecision;
4. ExecutionHistory;
5. HistoricalPlan;
6. durability/status channels;
7. readiness transition last for bootstrap.

If actual dependency evidence supports a different order, document it.

---

# 84. Subscriber Cross-Reads

During any commit callback, subscriber may synchronously query every other authority participant.

All must already expose final coherent target state.

Mandatory test.

---

# 85. Mutation During Notification Flush

Keep mutation admission blocked through the entire flush.

Subscriber attempts to mutate must receive `authorityTransactionActive`.

This prevents notification interleaving.

---

# 86. Commit Completion

After final dirty-channel flush:

* close authority transaction;
* for bootstrap, transition readiness to ready;
* release ordinary mutation admission.

---

# 87. Bootstrap Readiness Ordering

`ready` must not be announced before final authority is installed.

Preferred:

```text
install all
flush authority channels
close transaction
set readiness ready
notify readiness
```

If readiness itself is part of transaction scheduler, ensure callbacks still see full final authority.

---

# 88. Abort

If exact runtime installation fails before commit:

1. restore all participant snapshots;
2. discard target dirty-channel set;
3. do not emit target-state notifications;
4. ensure restored old authority coherent;
5. end transaction.

For bootstrap failure:

* store enters protected rather than ready placeholder.

---

# 89. Abort Restoration Notifications

Ordinary bootstrap abort should not publish a false ready state.

For future non-bootstrap authority transactions, determine whether restored-old-state notification is necessary.

Preferred:

* if external notifications were fully deferred, no notification is necessary because observers never saw target.

---

# 90. Abort Failure

If runtime snapshot restoration itself fails:

* store becomes protected;
* mutation remains blocked;
* do not pretend old state restored.

This is runtime protection only.

---

# 91. Listener Exceptions

Listener callback exception must not roll back a successfully committed authority state.

Preserve existing listener-error conventions.

---

# 92. Participant Initialization Notifications

Initialization candidate creation should not fire externally visible runtime notifications before coherent bootstrap commit.

Refactor existing initialization notification behavior accordingly.

---

# 93. ExecutionHistory Initialization Notifications

Task 3.13 may currently notify subscribers after initialization.

During bootstrap, these must route through shared notification boundary or remain internal until exact candidate installation.

---

# 94. HistoricalPlan Initialization Notifications

Same.

---

# 95. PlanDecision Ingress Notifications

Do not externally notify before coherent bootstrap.

---

# 96. Profiles/Main Ingress Notifications

Same.

---

# 97. Read Semantics During Initializing

Consumers already obey readiness.

`getState()` continues returning bootstrap placeholder until coherent bootstrap commit.

Do not populate it incrementally with real Active.

---

# 98. Surface Read Semantics During Initializing

Direct diagnostic/internal participant reads may expose their own status as required for recovery/testing.

Ordinary store consumer domain reads remain unavailable via readiness contract.

---

# 99. Read Semantics During Protected

Store remains placeholder/protected for ordinary domain use.

Existing raw/protected recovery diagnostics remain accessible through governed APIs.

---

# 100. Preview Rehydration Determination

Audit current persisted Preview behavior.

If Preview is stored inside Active/main state:

* load it as part of candidate main state;
* do not expose before ready.

Do not change Preview freshness semantics.

---

# 101. Bootstrap Does Not Generate Preview

No.

---

# 102. Bootstrap Does Not Publish HistoricalPlan

No.

Loading existing HistoricalPlan is not publication.

---

# 103. Bootstrap Does Not Create ExecutionHistory

No new records.

---

# 104. Bootstrap Does Not Allocate Domain IDs

Task 3.14A.1 itself allocates none.

Existing authorized migration logic may still allocate where its accepted domain contract already requires it.

Document separately.

---

# 105. Bootstrap Does Not Retimestamp Domain Data

No.

---

# 106. DayFrameApp

The readiness wrapper from 3.14A.1.1 should now naturally render:

```text
Loading DayFrame…
```

during genuine async bootstrap.

No new UI architecture required.

---

# 107. Ready Transition UI

After coordinated commit:

* existing ready-only inner app mounts;
* drafts derive from actual coherent authority;
* ordinary behavior unchanged.

---

# 108. Protected UI

If bootstrap protects:

* existing factual protected shell remains;
* no ordinary controls mount.

---

# 109. Existing Ready Fixture

`createReadyDayFrameTestStore` must continue supporting initialization-independent tests.

Adapt its internals if necessary to inject resolved participants or await bootstrap.

Do not make it lie about readiness.

---

# 110. Ready Fixture Future-Safe Implementation

Preferred:

* construct store with already-resolved bootstrap participant adapters;
  or
* await real bootstrap internally if fixture itself can remain async without massive churn.

Audit which keeps test intent clearest.

---

# 111. Existing Fixture API Compatibility

Task 3.14A.1.1 deliberately moved many tests to the fixture.

Avoid another broad test rewrite unless necessary.

---

# 112. Lifecycle Tests

Remaining raw store-construction tests now exercise genuine:

```text
initializing → ready/protected
```

Use `waitForDayFrameStoreReady()` where test intent requires ready authority.

---

# 113. Raw Factory Audit

Revisit the remaining 173 raw calls identified by 3.14A.1.1.

Each should become one of:

* intentionally testing initialization state;
* explicitly awaiting readiness;
* migrated to ready fixture because lifecycle is irrelevant.

Do not retain an immediate-authority assumption accidentally.

---

# 114. Direct ExecutionHistory Tests

After self-initialization removal:

* explicit initialize call required where lifecycle tested;
* already-initialized fixture may be used where lifecycle irrelevant.

---

# 115. Direct HistoricalPlan Tests

Same.

---

# 116. No Arbitrary Sleeps

All lifecycle tests await initialization/readiness promises.

---

# 117. Initialization Failure Injection

Preserve/increase dependency injection seams so tests can hold:

* ExecutionHistory initialization pending;
* HistoricalPlan initialization pending;
* participant protected.

This directly proves no partial authority.

---

# 118. Bootstrap Test — Immediate Shell

Immediately after factory:

```text
readiness = initializing
getState() = bootstrap placeholder
```

Mandatory.

---

# 119. Bootstrap Test — Delayed ExecutionHistory

Active/Profiles/PlanDecision/HistoricalPlan may finish, but store remains:

```text
initializing
placeholder
```

until ExecutionHistory finishes.

---

# 120. Bootstrap Test — Delayed HistoricalPlan

Same.

---

# 121. Bootstrap Test — Both Collections Delayed

Same.

---

# 122. Bootstrap Test — One Protected Participant

Store transitions:

```text
initializing → protected
```

Never ready.

---

# 123. Bootstrap Test — Synchronous Participant Invalid

Same.

---

# 124. Bootstrap Test — Ready

All five candidates valid.

One coherent install.

One ready transition.

---

# 125. Bootstrap Test — No Participant-by-Participant State Exposure

Mandatory.

---

# 126. Bootstrap Test — `whenReady()`

Multiple callers observe same eventual ready outcome.

---

# 127. Bootstrap Test — Protected `whenReady()`

Terminates structurally.

No hanging promise.

---

# 128. Bootstrap Test — Readiness Subscription

Correct transition count.

---

# 129. Bootstrap Test — Participant Initializes Once

All five where initialization concept applies.

Mandatory.

---

# 130. Bootstrap Test — ExecutionHistory Migration

Legacy migration under coordinator still works and becomes visible only at coherent ready commit.

---

# 131. Bootstrap Test — ExecutionHistory Anti-Resurrection

Established IDB authority remains correct.

No fallback regression.

---

# 132. Bootstrap Test — HistoricalPlan Existing Ledger

Loads coherently with other participants.

---

# 133. Bootstrap Test — No HistoricalPlan Publication Event

Initialization does not publish.

---

# 134. Authority Transaction Test — Begin

* snapshot captured;
* ordinary mutation blocked;
* notifications deferred.

---

# 135. Authority Transaction Test — Install Five Participants

No external subscriber fires.

---

# 136. Authority Transaction Test — Cross-Read Before Commit

Internal state may be installed, but external listeners have not fired.

---

# 137. Authority Transaction Test — Commit

Every subscriber callback sees the complete target authority.

---

# 138. Authority Transaction Test — One Notification Per Dirty Channel

Mandatory.

---

# 139. Authority Transaction Test — Flush Order

Verify adopted deterministic order.

---

# 140. Authority Transaction Test — Mutation During Flush

Rejected.

---

# 141. Authority Transaction Test — Abort Before Notification

Pre-transaction state restored.

No target notification.

---

# 142. Authority Transaction Test — Snapshot Isolation

Mandatory.

---

# 143. Authority Transaction Test — Nested Begin

Rejected.

---

# 144. Authority Transaction Test — Exact Install No Persistence

Mandatory.

---

# 145. Authority Transaction Test — Exact Active Install No Incarnation Allocation

Mandatory.

---

# 146. Authority Transaction Test — Exact Profiles Install No IDs

Mandatory.

---

# 147. Authority Transaction Test — Exact PlanDecision Install No Decision Allocation

Mandatory.

---

# 148. Authority Transaction Test — Exact ExecutionHistory Install No Records

Mandatory.

---

# 149. Authority Transaction Test — Exact HistoricalPlan Install No Publication

Mandatory.

---

# 150. Notification Test — Main Subscriber Cross-Reads ExecutionHistory

Sees final target.

---

# 151. Notification Test — ExecutionHistory Subscriber Cross-Reads Main State

Sees final target.

---

# 152. Notification Test — HistoricalPlan Subscriber Cross-Reads PlanDecision

Sees final target.

---

# 153. Mutation Admission Test — Initializing

All ordinary mutations rejected.

---

# 154. Mutation Admission Test — Ready

Ordinary mutations work unchanged.

---

# 155. Mutation Admission Test — Protected

Rejected.

---

# 156. Mutation Admission Test — Transaction Active

Rejected.

---

# 157. Authored Mutation Test

Required.

---

# 158. Profile Mutation Test

Required.

---

# 159. PlanDecision Mutation Test

Required.

---

# 160. Preview Generation Test

Required.

---

# 161. Execution Report Test

Required.

---

# 162. Execution Correction/Retraction Test

Required.

---

# 163. HistoricalPlan Publication Test

Required.

---

# 164. Retry/Recovery Mutation Tests

Required where public.

---

# 165. Full Clear Test

Rejected during initialization/transaction/protected as governed.

---

# 166. Existing Backup V1/V2 Test

Import/export behavior after ready unchanged.

During active authority transaction, backup snapshot/import is blocked.

---

# 167. Existing Task 3.5 Regression

Reporting works after ready.

---

# 168. Existing Task 3.6 Regression

History correction works.

---

# 169. Existing Task 3.8 Regression

Outcome summary unchanged.

---

# 170. Existing Task 3.12 Regression

HistoricalPlan publication after ready unchanged.

---

# 171. Existing Task 3.13 Regression

Migration, anti-resurrection, IndexedDB execution persistence unchanged.

---

# 172. Existing DayFrameApp Regression

After ready, normal UI behavior remains unchanged.

---

# 173. App Loading Regression

With delayed bootstrap:

* only loading shell;
* no setup;
* no Preview controls;
* no Summary;
* no history.

---

# 174. App Protected Regression

Only protected shell.

---

# 175. Direct Surface API Regression

Explicit initialization replaces constructor-start but semantic operations remain unchanged after initialization.

---

# 176. Participant Durability Status

Moving initialization ownership must not erase:

* pending;
* failed;
* durable;
* protected

surface durability semantics.

---

# 177. Store Readiness Versus Durability

Prove:

```text
store ready
```

does not imply:

```text
every persistence status = durable
```

A surface with valid runtime authority and failed persistence may still permit ready if accepted architecture already allows that.

Audit participant initialization contracts carefully.

---

# 178. Bootstrap Critical Versus Non-Critical Durability Failure

Distinguish:

## Cannot establish interpretable runtime authority

→ protected bootstrap.

## Runtime authority established, persistence currently failed but existing semantics allow session authority

→ potentially ready with durability failure.

Do not conflate readiness with durability.

---

# 179. Participant Quarantine

ExecutionHistory quarantine does not automatically make store protected if its current architecture treats remaining valid authority as usable.

Preserve existing semantics.

---

# 180. HistoricalPlan Quarantine/Protection

Preserve existing distinction.

---

# 181. Pre-Bootstrap Hook Test

Injected async hook delays bootstrap.

Store remains initializing.

---

# 182. Pre-Bootstrap Hook Protected Test

Store becomes protected.

No participants committed externally.

---

# 183. Pre-Bootstrap Hook Default

No-op.

No restore infrastructure.

---

# 184. Future Restore Compatibility

The following must exist at completion for resumed 3.14A:

```text
pre-bootstrap hook
shared mutation admission
authority transaction begin/commit/abort
runtime participant snapshots
exact runtime participant install
notification defer/flush
```

That is the unlock condition.

---

# 185. No Durable Restore Journal

None.

---

# 186. No Restore Staging

None.

---

# 187. No RestoreTransactionId

None.

---

# 188. No IndexedDB Schema Upgrade

None expected.

If moving initialization ownership reveals a need for physical schema change, stop and report.

---

# 189. No Backup V3

None.

---

# 190. No Domain Schema Changes

No:

* Active V3;
* Profile V3;
* PlanDecision V2;
* ExecutionHistory V2;
* HistoricalPlan V2.

---

# 191. No Storage Migration

Active/Profiles/PlanDecision remain where they are.

---

# 192. No Cross-Tab Locking

Out of scope.

---

# 193. Architecture Checkpoint

If completed successfully, create:

`docs/checkpoints/CHECKPOINT_Phase_3_Async_Store_Bootstrap_And_Shared_Authority_Transaction.md`

---

# 194. Checkpoint Required Contents

At minimum:

1. synchronous store shell;
2. true async readiness;
3. placeholder authority;
4. five bootstrap participants;
5. candidate versus committed authority;
6. pre-bootstrap hook;
7. bootstrap protection;
8. mutation admission;
9. authority transaction;
10. runtime snapshots;
11. exact installs;
12. notification batching;
13. cross-read guarantee;
14. abort semantics;
15. consumer contract;
16. future restore integration;
17. invariants.

---

# 195. ADR

Create:

`ADR_ASYNC_STORE_BOOTSTRAP_AND_SHARED_OBSERVABLE_AUTHORITY_TRANSACTION.md`

if repository convention supports an ADR for this established architectural boundary.

Record:

* why synchronous factory remains;
* why authority readiness is async;
* why collection surfaces no longer self-start;
* why notification atomicity requires shared transaction;
* why this differs from storage transactions.

---

# 196. Governance Updates

Update as appropriate:

* `CURRENT_STATE.md`;
* `DECISIONS.md`;
* `ROADMAP.md`.

Be exact:

> coordinated store bootstrap and shared runtime authority transaction exist.

Do not claim restore journal or Backup V3 exists.

---

# 197. Expected Production Files

Likely:

* `code/src/state/dayFrameBootstrap.ts`;
* `code/src/state/dayFrameAuthorityTransaction.ts`;
* `code/src/state/dayFrameMutationAdmission.ts`;
* `code/src/state/dayFrameNotificationScheduler.ts`;
* `code/src/state/dayFrameReadiness.ts`;
* `code/src/state/dayFrameStore.ts`;
* PlanDecision surface integration;
* ExecutionHistory initialization/runtime-install integration;
* HistoricalPlan initialization/runtime-install integration;
* tests.

Minimize churn.

---

# 198. Required Result Artifact

Create/update the resumed completion result at:

`docs/implementation/phase-3/TASK_3.14A.1_ESTABLISH_ASYNC_STORE_BOOTSTRAP_READINESS_AND_SHARED_AUTHORITY_TRANSACTION_BOUNDARY_RESULT.md`

Do not delete or overwrite the previous stopped result if it occupies that exact path.

If necessary, preserve the stopped artifact under its existing immutable location and create:

`TASK_3.14A.1_RESUMED_ESTABLISH_ASYNC_STORE_BOOTSTRAP_READINESS_AND_SHARED_AUTHORITY_TRANSACTION_BOUNDARY_RESULT.md`

The final result must explicitly distinguish the original stopped execution from this resumed execution.

Include at least:

1. Executive Result
2. Artifact Integrity
3. Prior Stop History
4. Task 3.14A.1.1 Prerequisite Confirmation
5. Initial Producer Audit
6. Files Changed
7. Store Shell
8. Real Bootstrap State
9. Placeholder Semantics
10. whenReady
11. Readiness Subscription
12. Bootstrap Coordinator
13. Participant Registry
14. Pre-Bootstrap Hook
15. Active Candidate
16. Profiles Candidate
17. PlanDecision Candidate
18. ExecutionHistory Initialization Ownership
19. HistoricalPlan Initialization Ownership
20. Self-Initialization Removal
21. Direct Surface Initialization
22. Candidate vs Committed Authority
23. Bootstrap Ordering
24. Parallelism Determination
25. Bootstrap Failure
26. Store Protection
27. Authority Transaction
28. Transaction State
29. Runtime Snapshot
30. Active Snapshot/Exact Install
31. Profiles Snapshot/Exact Install
32. PlanDecision Snapshot/Exact Install
33. ExecutionHistory Snapshot/Exact Install
34. HistoricalPlan Snapshot/Exact Install
35. Bootstrap Transaction
36. Mutation Admission
37. Authored Mutation Coverage
38. Profile Mutation Coverage
39. PlanDecision Mutation Coverage
40. Preview/Try Mutation Coverage
41. ExecutionHistory Mutation Coverage
42. HistoricalPlan Mutation Coverage
43. Clear/Backup Coverage
44. Escape-Hatch Audit
45. Notification Scheduler
46. Notification Channels
47. Deferred Notifications
48. Dirty Channel Dedup
49. Commit Flush
50. Flush Ordering
51. Subscriber Cross-Reads
52. Mutation During Flush
53. Abort
54. Abort Failure
55. Listener Exception Policy
56. Pre-Ready Reads
57. Protected Reads
58. Preview Rehydration
59. DayFrameApp Integration
60. Ready Fixture Adaptation
61. Raw Factory Migration
62. Direct Surface Test Migration
63. Bootstrap Tests
64. Authority Transaction Tests
65. Notification Tests
66. Mutation Admission Tests
67. ExecutionHistory Regression
68. HistoricalPlan Regression
69. Reporting/History/Summary Regression
70. Readiness vs Durability
71. Quarantine/Protection Preservation
72. No Persistence Change Audit
73. No Restore Audit
74. No Backup V3 Audit
75. No Domain Version Audit
76. Checkpoint
77. ADR
78. Governance Updates
79. Architectural Alignment Assessment
80. Deviations
81. Discoveries and Deferred Work
82. Resume Task 3.14A Recommendation
83. Focused Validation
84. Full Validation
85. Final Completion Determination

---

# 199. Required Matrices

## A. Bootstrap Participant Matrix

| Participant | Old initialization | New initialization owner | Externally committed when |
| ----------- | ------------------ | ------------------------ | ------------------------- |

Cover all five participants.

## B. Readiness Matrix

| State | Domain UI | Domain mutations | Diagnostic/recovery reads |
| ----- | --------: | ---------------: | ------------------------: |

## C. Mutation Admission Matrix

| Readiness / transaction | Ordinary mutation |
| ----------------------- | ----------------: |

Cover:

* initializing;
* ready/inactive;
* ready/transaction active;
* protected.

## D. Notification Matrix

| Transaction state | Participant change | External notification |
| ----------------- | ------------------ | --------------------- |

## E. Authority Transaction Matrix

| Phase | Runtime state | Notifications | Ordinary mutation |
| ----- | ------------- | ------------- | ----------------: |

Cover:

* inactive;
* begin;
* install;
* commit/flush;
* abort.

## F. Participant Exact-Install Matrix

| Participant | Allocates IDs? | Persists? | Workflow side effects? | Direct notifications? |
| ----------- | -------------: | --------: | ---------------------: | --------------------: |

All should be `No` for exact transaction install.

---

# 200. Required Architectural Invariants

At minimum prove:

1. `createDayFrameStore()` returns synchronously while readiness starts `initializing`.
2. The store exposes only bootstrap placeholder main state until coherent bootstrap commit.
3. Active data never leaks incrementally into placeholder state.
4. Profiles do not become ordinary runtime authority before commit.
5. PlanDecision does not become ordinary authority independently.
6. ExecutionHistory no longer constructor-self-initializes.
7. HistoricalPlan no longer constructor-self-initializes.
8. Each collection surface initializes exactly once under coordinator ownership.
9. All five required participant candidates must be safely established before ready.
10. One protected participant prevents ready.
11. `whenReady()` represents the real bootstrap lifecycle.
12. A pre-bootstrap async hook exists before ordinary authority commit.
13. One shared authority transaction governs observable multi-surface runtime replacement.
14. Authority transaction and IndexedDB transaction are distinct concepts.
15. Authority transaction captures clone-isolated runtime snapshots.
16. Exact participant installs allocate no domain identity.
17. Exact participant installs perform no persistence.
18. HistoricalPlan exact install emits no publication event.
19. ExecutionHistory exact install creates no record.
20. Ordinary mutations are blocked while initializing.
21. Ordinary mutations are blocked while protected.
22. Ordinary mutations are blocked while authority transaction active.
23. Direct surface mutation paths cannot bypass admission.
24. Notifications defer during transaction.
25. Every final participant state is installed before any commit listener fires.
26. Subscriber callbacks may cross-read every participant and see one coherent state.
27. Each dirty notification channel flushes at most once.
28. Mutation remains blocked through notification flush.
29. Abort restores exact runtime snapshots.
30. Abort leaks no target-state notifications.
31. Runtime abort failure protects the store rather than guessing.
32. DayFrameApp loading/protected behavior from 3.14A.1.1 remains correct.
33. Existing ExecutionHistory migration/anti-resurrection semantics remain intact.
34. Existing HistoricalPlan publication/durability semantics remain intact.
35. Existing reporting/history/Summary behavior remains intact after ready.
36. No durable restore journal/staging exists yet.
37. No Backup V3 exists yet.
38. No domain/storage version changes are introduced.

---

# 201. Focused Validation Requirements

Run focused tests for:

* `dayFrameReadiness`;
* bootstrap coordinator;
* delayed participant initialization;
* participant protection;
* real `whenReady`;
* readiness subscription;
* ExecutionHistory explicit initialization;
* HistoricalPlan explicit initialization;
* participant initialization exactly once;
* authority transaction begin/commit/abort;
* runtime snapshot isolation;
* exact installs;
* centralized mutation admission;
* direct mutation bypass prevention;
* notification defer/flush;
* subscriber cross-read coherence;
* mutation during flush;
* pre-bootstrap hook;
* DayFrameApp loading/ready/protected behavior;
* existing ready fixture;
* ExecutionHistory migration/anti-resurrection;
* HistoricalPlan startup/publication;
* reporting/history/Summary.

---

# 202. Full Validation

Run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Full repository suite must pass.

Record exact:

* test-file count;
* test count;
* build module count;
* remaining raw `createDayFrameStore()` call count;
* direct ExecutionHistory initialization test count/path changes;
* direct HistoricalPlan initialization test count/path changes.

---

# 203. Completion Criteria

Task 3.14A.1 is complete only when:

* the transitional immediate-ready producer from Task 3.14A.1.1 is replaced with real asynchronous readiness;
* `createDayFrameStore()` remains a synchronous shell factory;
* initial readiness is `initializing`;
* main state remains the canonical bootstrap placeholder until coherent commit;
* all five authority participants initialize under one coordinator;
* Active, Profiles, and PlanDecision load as candidates rather than independently visible authority;
* ExecutionHistory no longer self-initializes in its constructor;
* HistoricalPlan no longer self-initializes in its constructor;
* direct collection tests can initialize surfaces explicitly;
* one pre-bootstrap async hook exists before participant authority commit;
* bootstrap commits all five participants coherently or enters protected state;
* `whenReady()` and readiness subscriptions reflect the real producer lifecycle;
* one shared runtime authority transaction exists;
* runtime snapshots are clone-isolated;
* exact runtime installs exist for all five participants;
* exact installs allocate no IDs, retimestamp nothing, persist nothing, and invoke no normal workflow side effects;
* one centralized mutation-admission boundary exists;
* authored/Profile/PlanDecision/Preview/ExecutionHistory/HistoricalPlan/clear/backup mutation entry points cannot bypass it;
* all participant external notifications defer during authority transaction;
* commit listeners see every participant already in final authority state;
* dirty channels flush once in deterministic order;
* ordinary mutation remains blocked through flush;
* abort restores exact prior runtime authority and emits no target-state notifications;
* abort failure protects rather than guesses;
* DayFrameApp readiness behavior remains correct;
* existing ExecutionHistory migration/anti-resurrection behavior remains correct;
* existing HistoricalPlan semantics remain correct;
* reporting/history/Summary remain correct after ready;
* no restore journal, staging, cross-storage recovery, Backup V3, persistence schema change, domain version change, Progress, Goal, or learning feature is introduced;
* complete validation passes;
* resumed result artifact is complete.

---

# 204. Explicit Non-Goals

Do **not**:

* implement durable restore journal;
* implement restore staging;
* implement RestoreTransactionId;
* implement cross-storage commit;
* implement durable roll-forward;
* implement durable rollback;
* add IndexedDB staging stores;
* implement Backup V3;
* add V3 dispatch;
* add backup UI;
* migrate Active/Profile/PlanDecision storage;
* modify ExecutionRecord semantics;
* modify HistoricalPlan domain semantics;
* modify PlanDecision semantics;
* add Progress;
* add Goals;
* add learning;
* add cross-tab locking;
* redesign DayFrame UI;
* replace the existing state-management architecture.

---

# 205. Stop Conditions

Stop and report if:

* Active/Profile/PlanDecision candidate loading cannot be separated from externally visible runtime authority without changing their accepted persistence semantics;
* ExecutionHistory constructor self-initialization cannot be removed without a broader domain API redesign;
* HistoricalPlan constructor self-initialization cannot be removed safely;
* a centralized mutation-admission capability cannot cover direct participant surface methods;
* runtime snapshots cannot capture enough exact participant state for truthful abort;
* exact runtime install requires modifying durable domain schemas;
* notification batching cannot guarantee subscriber cross-read coherence;
* an existing subscriber requires incremental bootstrap visibility as public behavior;
* async bootstrap introduces an unavoidable permanent race with existing persistence migration semantics;
* full-suite failures expose a new architectural prerequisite.

Do not weaken:

* placeholder truthfulness;
* coherent bootstrap;
* mutation admission;
* notification atomicity;
* abort correctness.

Recommend the narrowest prerequisite if another is genuinely required.

---

# 206. Follow-On Boundary

If this resumed Task 3.14A.1 completes successfully:

> **Resume Task 3.14A — Establish Durable Cross-Storage Restore Staging, Journal, Startup Recovery, and Store Mutation Barrier**

Task 3.14A will then use the new:

```text
pre-bootstrap hook
        +
true readiness gate
        +
central mutation admission
        +
authority transaction
        +
runtime snapshots
        +
exact participant installs
        +
notification barrier
```

to implement:

* durable RestoreTransactionId;
* startup-visible restore journal;
* target staging;
* recovery staging;
* localStorage staging;
* source recheck;
* atomic ExecutionHistory + HistoricalPlan replacement;
* localStorage replacement;
* restart roll-forward;
* verified rollback;
* recovery-required state;
* staging cleanup.

Only after 3.14A completes should Task 3.14 Backup V3 resume.

---

# 207. Task Determination

**Authorized:** real asynchronous store readiness, coordinated five-participant bootstrap, participant initialization ownership transfer, candidate-versus-committed authority, pre-bootstrap recovery hook, store-wide protected bootstrap, centralized mutation admission, shared runtime authority transaction, clone-isolated snapshots, exact runtime participant installation, notification deferral/coherent flush, abort semantics, consumer/test adaptation needed for the now-real lifecycle, and direct regression coverage.

**Not authorized:** durable restore infrastructure, Backup V3, storage migrations, domain-version changes, historical metrics, Progress, Goals, learning, cloud/sync, cross-tab coordination, or unrelated UI redesign.

The governing resumed-task principle is:

> **The consumer contract now knows that a store may exist before its authority is ready. This task must make that possibility real. DayFrame becomes ready only when every required authority participant can be established together, and any later multi-surface runtime authority replacement must be observed as a single coherent truth rather than a sequence of individually visible changes.**

---

# 208. Final Completion Statement

**Task 3.14A.1 is complete when DayFrame’s transitional immediate-ready producer has been replaced by a real coordinated asynchronous authority lifecycle in which `createDayFrameStore()` still returns a stable synchronous shell but readiness begins as `initializing`, the canonical non-authoritative placeholder remains externally visible until Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan have each established a safe candidate under one bootstrap coordinator, ExecutionHistory and HistoricalPlan no longer self-initialize from their constructors, one pre-bootstrap async recovery hook can run before ordinary authority commit, and all five participants are installed through one shared observable-authority transaction before readiness becomes `ready`; when the same transaction can capture clone-isolated runtime snapshots, perform exact side-effect-free participant installation, centrally reject ordinary mutations, defer every affected external notification, flush one coherent final authority whose subscribers can safely cross-read all other participants, and abort back to the exact prior runtime authority without leaking target notifications; when participant protection prevents a false ready state; when DayFrameApp and the migrated consumer/test contract from Task 3.14A.1.1 operate correctly against the real lifecycle; when existing ExecutionHistory migration/anti-resurrection, HistoricalPlan publication/durability, reporting, correction, Summary, and planning semantics remain intact; when complete repository validation passes; and when no durable restore journal, target/recovery staging, RestoreTransactionId, cross-storage recovery, Backup V3, persistence-schema change, domain-version change, Progress, Goal, learning, sync, or unrelated feature is introduced.**
