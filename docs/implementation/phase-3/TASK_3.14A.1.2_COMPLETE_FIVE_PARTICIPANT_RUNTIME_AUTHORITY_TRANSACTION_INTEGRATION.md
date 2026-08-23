Task 3.14A.1.2 — Complete Five-Participant Runtime Authority Transaction Integration

Status

Ready for implementation.

Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

Task Type

Bounded runtime-authority integration and transaction-completion task.

Purpose

Complete the unfinished integration boundary from Task 3.14A.1 by connecting all five DayFrame authority participants to the existing shared authority transaction and notification scheduler.

This task must establish the capability required by Task 3.14A:

A complete five-participant runtime authority state can be captured, replaced exactly, committed coherently, or restored exactly on abort without persistence, identity allocation, retimestamping, workflow side effects, domain events, or hybrid subscriber observation.

The five participants are:

Active

Profiles

PlanDecision

ExecutionHistory

HistoricalPlan

This task includes:

complete runtime snapshot adapters;

exact runtime-install adapters;

capability-scoped access to otherwise private participant state;

notification-scheduler integration;

five-participant transaction registration;

exact abort restoration;

coherent commit notification;

subscriber cross-read proof;

regression coverage.

It does not include:

restore journal;

RestoreTransactionId;

durable target/recovery staging;

IndexedDB restore stores;

cross-storage durable replacement;

roll-forward/rollback;

Backup V3;

persistence/domain version changes.

1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

verify the supplied artifact is complete;

verify the saved project copy is complete;

compare both copies when available;

record SHA-256 evidence;

review the stopped Resumed Task 3.14A result;

review the existing Task 3.14A.1 transaction/scheduler core;

audit all five live authority participants and their private runtime state;

audit current listener ownership and notification paths;

audit current exact runtime install/snapshot coverage;

do not modify this task artifact after execution begins.

Execution findings must be recorded separately in:

docs/implementation/phase-3/TASK_3.14A.1.2_COMPLETE_FIVE_PARTICIPANT_RUNTIME_AUTHORITY_TRANSACTION_INTEGRATION_RESULT.md

If complete private runtime state cannot be captured and restored without a broader participant redesign, stop and report the narrowest prerequisite rather than weakening abort correctness.

2. Existing Transaction-Core Audit

Confirm what already exists from Task 3.14A.1:

shared authority transaction core;

notification scheduler core;

centralized mutation admission;

readiness lifecycle;

pre-bootstrap hook;

generic transaction unit tests.

Document exactly what is generic-core-only versus actually integrated with live participants.

Do not claim five-participant integration merely because the generic core exists.

3. Governing Runtime Authority Principle

The central rule is:

A runtime authority transaction is complete only when every live authority participant can be captured, replaced exactly, restored exactly, and observed coherently through the same transaction boundary.

Generic transaction machinery is necessary but not sufficient.

4. Participant-State Audit

Before implementation, enumerate the complete runtime state owned by each participant.

For every participant identify:

Concern

Must be captured?

Current authority

Yes

Pending accepted state

If present

Durability state

If present

Ingress state

If present

Protection state

If present

Quarantine

If present

Migration/runtime markers

If required for exact restoration

Listener collections

No

Injected dependencies

No

Do not infer snapshot completeness from public getters alone.

The snapshot must contain enough private runtime state that abort can truthfully restore the participant to its exact pre-transaction runtime condition.

5. Capability-Scoped Adapter Boundary

Do not expose unrestricted public methods such as:

surface.installRuntimeExact(...)

to ordinary application consumers.

Prefer an internal capability:

interface RuntimeAuthorityAdapter<TSnapshot, TTarget> {
  captureRuntimeSnapshot(): TSnapshot;
  installRuntimeExact(target: TTarget): void;
  restoreRuntimeSnapshotExact(snapshot: TSnapshot): void;
}

The adapter should only be obtainable by the store/bootstrap/authority-transaction infrastructure.

Ordinary surface APIs remain unchanged.

6. Active Runtime Adapter

Active must support:

clone-isolated complete runtime capture;

exact replacement;

exact abort restoration.

Exact installation must:

allocate no source incarnation;

perform no persistence;

regenerate nothing;

invoke no normal authored-state workflow;

emit only scheduler-governed notification.

Preview must be handled according to the existing main-state authority model.

Do not invent new Preview semantics.

7. Profiles Runtime Adapter

Profiles must support equivalent exact capture/install/restore.

It must not:

allocate Profile IDs;

invoke save/load/delete workflows;

persist;

alter timestamps;

independently notify listeners during a transaction.

8. PlanDecision Runtime Adapter

This is one of the known missing pieces.

Audit and capture all runtime state required for truthful restoration, including where applicable:

current decisions;

durability state;

ingress/protection state;

pending accepted mutations;

retry/recovery state.

Exact installation must not:

create a decision;

accept/reject a decision;

allocate identity;

persist;

retimestamp;

trigger normal PlanDecision domain behavior.

9. ExecutionHistory Runtime Adapter

This is especially important because a public history view may not represent its complete runtime condition.

Capture everything required for exact abort, including where present:

current valid execution authority;

quarantine;

pending accepted mutations;

durability state;

ingress/protection state;

migration-related runtime status required for exact restoration.

Do not capture injected IndexedDB dependencies or listeners as authority.

Exact install must not:

report an outcome;

correct/retract/re-report;

allocate an ExecutionRecord ID;

allocate an ExecutionSubject ID;

persist;

run migration;

retimestamp;

emit an execution domain event.

10. HistoricalPlan Runtime Adapter

Capture the complete runtime/session authority actually maintained by the surface, including where applicable:

loaded/current authority;

pending accepted publication state;

durability state;

ingress/protection state;

caches required for exact runtime restoration.

Do not load the entire durable historical ledger solely to manufacture a runtime snapshot if it is not normally resident in memory.

Exact install must not:

call publish;

allocate batch IDs;

allocate publication timestamps;

persist;

deduplicate through ordinary publication logic;

emit a publication event.

11. Clone Isolation

Every runtime snapshot must be isolated.

Required invariant:

snapshot participant
        ↓
mutate participant
        ↓
snapshot remains unchanged

And vice versa.

Use the repository's accepted cloning mechanisms.

12. Notification Scheduler Integration

Route all five participant notification paths through the existing shared scheduler.

Normal operation:

no authority transaction
    → existing immediate notification behavior

During authority transaction:

participant changes
    → mark participant channel dirty
    → no external callback

At commit:

all five final states already installed
    ↓
flush dirty channels

Do not replace participant listener ownership unless necessary.

13. Required Notification Channels

At minimum:

Active/main state;

Profiles;

PlanDecision;

ExecutionHistory;

HistoricalPlan.

If durability/status subscriptions are separately externally observable and can reveal hybrid transaction state, include them as governed channels as well.

14. Five-Participant Registration

The live DayFrame store must register all five real adapters with dayFrameAuthorityTransaction.

The generic transaction must no longer be proven only with test fixtures.

15. Transaction Begin

For a real five-participant transaction:

capture all five snapshots;

establish mutation admission;

enable notification deferral.

If any snapshot cannot be captured safely, transaction begin fails before participant mutation.

16. Exact Target Installation

Install all five targets while notifications remain deferred.

No participant may persist as a consequence.

No participant may invoke ordinary workflow behavior.

17. Commit Cross-Read Guarantee

Before the first external listener callback:

all five participant target states must already be installed.

Then prove combinations such as:

Active subscriber
    → reads PlanDecision target
    → reads ExecutionHistory target
    → reads HistoricalPlan target
    → reads Profiles target

and:

ExecutionHistory subscriber
    → reads Active target
    → reads Profiles target
    → reads PlanDecision target
    → reads HistoricalPlan target

All reads must observe the target authority.

18. Dirty-Channel Deduplication

A participant changed multiple times during one authority transaction should externally notify at most once at commit.

Preserve the deterministic flush order established by Task 3.14A.1.

19. Mutation During Flush

Mutation admission remains closed until the coherent flush finishes.

A subscriber attempting ordinary mutation during its commit callback must be rejected with the existing transaction-active admission result.

20. Exact Abort

Inject failure after some—but not all—participants have received target runtime state.

Abort must:

restore all five snapshots exactly;

discard target dirty notifications;

expose no hybrid state;

allocate nothing;

persist nothing.

Because external notifications were deferred, ordinary observers should never know the target was partially installed.

21. Abort Snapshot Completeness

This test is mandatory for the three previously missing surfaces.

Construct nontrivial pre-transaction runtime state containing relevant:

pending;

durability;

ingress;

quarantine/protection

conditions where supported.

Install different target state.

Abort.

Assert the entire prior runtime condition is restored—not merely public domain records.

22. Persistence Spy Tests

Exact install and abort must cause zero persistence writes.

Cover:

localStorage;

ExecutionHistory IndexedDB;

HistoricalPlan IndexedDB.

This is essential because Task 3.14A will control durable replacement separately.

23. Identity and Timestamp Tests

Exact install/abort must allocate no:

source incarnations;

Profile IDs;

PlanDecision IDs;

ExecutionSubject IDs;

ExecutionRecord IDs;

HistoricalPlan batch IDs.

Existing domain timestamps remain byte/semantic-equivalent.

24. Domain-Event Tests

Exact install must produce no:

execution report/correction/retraction event;

HistoricalPlan publication event;

PlanDecision workflow event;

authored lifecycle event beyond scheduler-governed state notification.

25. Normal Operation Regression

Outside an authority transaction, all five surfaces must retain their current notification and persistence behavior.

The scheduler must not accidentally turn normal operations into batched operations.

26. Bootstrap Regression

The existing coordinated bootstrap must continue to work.

Do not broaden this task into another bootstrap redesign.

27. Required Real-Participant Transaction Test

Add at least one integration test using the actual five participant adapters, not generic fake participants:

OLD:
Active A
Profiles A
PlanDecision A
ExecutionHistory A
HistoricalPlan A

begin

install:
Active B
Profiles B
PlanDecision B
ExecutionHistory B
HistoricalPlan B

commit

subscriber observations:
B / B / B / B / B

There must be no observable intermediate combination.

28. Required Real-Participant Abort Test

Using actual adapters:

capture OLD five-participant authority

install B into several participants

inject failure

abort

assert:
A / A / A / A / A

Also assert private runtime status required for truthful restoration.

29. Required Cross-Read Matrix

Test representative cross-reads from every participant notification channel.

Callback

Must see

Active

all five final targets

Profiles

all five final targets

PlanDecision

all five final targets

ExecutionHistory

all five final targets

HistoricalPlan

all five final targets

30. No Durable Restore Infrastructure

Do not add:

journal;

staging;

restore DB stores;

RestoreTransactionId;

source fingerprints;

roll-forward;

rollback.

Those belong to resumed Task 3.14A.

31. Documentation

Update the Task 3.14A.1 result/status truthfully.

The prior statement that the five-participant authority transaction was complete must be corrected to distinguish:

transaction core

from:

live five-participant transaction integration

Create a checkpoint if appropriate:

docs/checkpoints/CHECKPOINT_Phase_3_Five_Participant_Runtime_Authority_Transaction_Integration.md

32. Governance

Update CURRENT_STATE.md and DECISIONS.md only if needed to remove an inaccurate claim that complete live integration already existed.

Do not claim durable restore exists.

33. Required Result Artifact

Create:

docs/implementation/phase-3/TASK_3.14A.1.2_COMPLETE_FIVE_PARTICIPANT_RUNTIME_AUTHORITY_TRANSACTION_INTEGRATION_RESULT.md

It should document at minimum:

Executive Result

Artifact Integrity

Discovery From Resumed 3.14A

Existing Transaction-Core Audit

Participant Runtime-State Audit

Files Changed

Capability Boundary

Active Adapter

Profiles Adapter

PlanDecision Adapter

ExecutionHistory Adapter

HistoricalPlan Adapter

Snapshot Completeness

Clone Isolation

Exact Install Semantics

Exact Restore Semantics

Notification Scheduler Integration

Notification Channels

Five-Participant Registration

Mutation Admission Integration

Commit Ordering

Subscriber Cross-Read Guarantee

Dirty-Channel Deduplication

Mutation During Flush

Abort Restoration

Persistence Side-Effect Audit

Identity Allocation Audit

Timestamp Audit

Domain-Event Audit

Bootstrap Regression

Normal-Operation Regression

Real Five-Participant Commit Test

Real Five-Participant Abort Test

Cross-Read Matrix

No Restore Infrastructure Audit

Documentation/Governance Updates

Architectural Alignment

Deviations

Discoveries/Deferred Work

Resume 3.14A Recommendation

Focused Validation

Full Validation

Final Determination

34. Required Architectural Invariants

At completion, prove:

All five live authority participants are registered with the shared authority transaction.

All five expose capability-scoped complete runtime snapshot behavior.

All five support exact runtime target installation.

All five support exact runtime snapshot restoration.

Snapshot capture is clone-isolated.

Exact install performs no persistence.

Exact abort performs no persistence.

Exact install allocates no domain identity.

Exact abort allocates no domain identity.

Exact install retimestamps nothing.

PlanDecision private runtime state required for abort is preserved.

ExecutionHistory quarantine/pending/durability/ingress state required for abort is preserved.

HistoricalPlan pending/durability/ingress state required for abort is preserved.

All five notification paths participate in scheduler deferral.

No external participant listener fires during target installation.

Every target participant is installed before the first commit listener fires.

Every participant listener can cross-read coherent final authority.

Each dirty participant channel flushes at most once.

Mutation remains blocked through flush.

Partial target installation followed by abort restores exact five-participant prior runtime authority.

Abort leaks no target-state notifications.

Normal nontransactional participant behavior remains unchanged.

Coordinated bootstrap remains correct.

No restore journal/staging or Backup V3 is introduced.

35. Validation

Run focused tests for:

PlanDecision runtime adapter;

ExecutionHistory runtime adapter;

HistoricalPlan runtime adapter;

Active/Profile registration;

snapshot isolation;

exact install;

exact abort;

persistence spies;

identity/timestamp preservation;

notification scheduler routing;

five-participant commit;

five-participant abort;

cross-read coherence;

mutation during flush;

bootstrap regression.

Then run:

npm run lint
npm run typecheck
npm test
npm run build
git diff --check

Record exact test-file count, test count, and build module count.

36. Completion Criteria

Task 3.14A.1.2 is complete only when:

all five real authority participants are registered with the existing shared authority transaction;

Active and Profiles have complete runtime snapshot/exact-install/exact-restore adapters;

PlanDecision has a capability-scoped adapter covering every private runtime field required for truthful abort;

ExecutionHistory has a capability-scoped adapter covering current authority, quarantine, pending accepted mutations, durability, ingress/protection, and any migration runtime state required for exact restoration;

HistoricalPlan has a capability-scoped adapter covering current/session authority, pending accepted publication state, durability, ingress/protection, and any cache required for exact restoration;

all snapshots are clone-isolated;

exact installation performs no persistence;

exact abort performs no persistence;

exact install/abort allocate no domain identities;

exact install/abort retimestamp nothing;

exact install invokes no ordinary participant workflow or domain event;

all five participant notification paths route through the shared scheduler;

target installation fires no external participant notification before commit;

every target participant is installed before the first external commit listener fires;

every participant listener can cross-read one coherent final five-surface target authority;

dirty participant channels flush at most once;

mutation remains blocked through notification flush;

partial target installation followed by abort restores exact five-participant prior runtime authority;

abort leaks no target-state notifications;

ordinary nontransactional participant behavior remains unchanged;

coordinated bootstrap remains correct;

full repository validation passes;

result artifact is complete;

no restore journal, durable staging, cross-storage recovery, Backup V3, persistence migration, or domain-version change is introduced.

37. Explicit Non-Goals

Do not:

add restore journal;

add RestoreTransactionId;

add restore staging stores;

add durable target/recovery staging;

add source fingerprints;

implement cross-storage commit;

implement roll-forward;

implement rollback;

implement Backup V3;

add Backup V3 dispatch;

migrate Active/Profile/PlanDecision storage;

change ExecutionHistory V1 semantics;

change HistoricalPlan V1 semantics;

change PlanDecision V1 semantics;

change domain versions;

add Progress;

add Goals;

add learning;

add cross-tab locking;

redesign the UI.

38. Stop Conditions

Stop rather than weakening the transaction contract if:

complete private runtime state cannot be captured without a broader participant redesign;

one participant cannot exact-install without persistence;

one participant's notification path cannot be scheduler-governed;

one participant cannot exact-restore pending/protection state;

subscriber cross-read coherence cannot be guaranteed;

abort cannot restore all five real participants exactly;

completing adapters requires a persistence/domain schema change.

Report the narrowest prerequisite.

39. Follow-On

If this task completes:

Resume Task 3.14A using the existing resumed artifact.

At that point the sequence is:

3.14A.1.1
Consumer readiness compatibility
        ✓

3.14A.1
Async bootstrap + transaction core
        ✓ foundation

3.14A.1.2
Five-participant runtime integration
        ↓

3.14A
Durable journal/staging/recovery
        ↓

3.14
Backup V3

40. Task Determination

Authorized: complete five-participant runtime snapshot/exact-install/exact-restore integration, capability-scoped access to private runtime state, notification-scheduler routing, live participant registration with the shared authority transaction, exact abort restoration, subscriber cross-read coherence, and direct regression coverage.

Not authorized: durable restore journal/staging/recovery, Backup V3, persistence migration, domain-version changes, Progress, Goals, learning, cross-tab coordination, or unrelated UI work.

The governing completion principle is:

A runtime authority transaction is only real when every authority participant participates. DayFrame must be able to capture one complete five-surface runtime truth, install another without workflow side effects, expose that new truth only after every participant is in place, and restore the original truth exactly if the transaction aborts.

41. Final Completion Statement

Task 3.14A.1.2 is complete when the existing shared authority-transaction and notification-scheduler cores are connected to all five real DayFrame authority participants through capability-scoped, clone-isolated, complete runtime snapshot, exact-install, and exact-restore adapters; when PlanDecision, ExecutionHistory, and HistoricalPlan preserve every private runtime authority, pending, durability, ingress, quarantine, migration, and protection field required for truthful abort; when Active and Profiles participate in the same real transaction; when exact installation and abort perform no persistence, allocate no domain identity, retimestamp nothing, and invoke no ordinary workflow or domain event; when all five participant notification paths defer through the shared scheduler during a transaction; when every target participant is installed before the first commit listener fires; when every participant callback can cross-read one coherent final five-surface authority; when dirty channels flush at most once while mutation remains blocked; when partial installation followed by abort restores the exact prior five-participant runtime authority without leaking target notifications; when ordinary nontransactional behavior and coordinated bootstrap remain unchanged; when full repository validation passes; and when no restore journal, durable staging, cross-storage commit/recovery, Backup V3, persistence migration, or domain-version change is introduced.