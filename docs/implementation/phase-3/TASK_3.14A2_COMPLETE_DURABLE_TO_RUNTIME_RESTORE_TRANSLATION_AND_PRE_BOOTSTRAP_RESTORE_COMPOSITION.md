# Task 3.14A.2 — Complete Durable-to-Runtime Restore Translation and Pre-Bootstrap Restore Composition

## Status

Ready for implementation.

## Phase

Phase 3 — Execution, History, Learning, and Outcome Feedback

## Task Type

Bounded restore-infrastructure amendment task.

Task 3.14A.2 completes the missing integration boundary identified by the resumed Task 3.14 stop result.

The accepted Task 3.14A infrastructure currently provides:

* durable restore journal;
* target/recovery staging;
* source fingerprints and recheck;
* atomic ExecutionHistory + HistoricalPlan IndexedDB replacement;
* exact localStorage replacement;
* anti-resurrection handling;
* roll-forward;
* rollback;
* startup recovery;
* shared runtime authority transaction.

However, its participant contract currently conflates two intentionally different representations:

```text
durable participant payload
        and
runtime authority target
```

This is invalid for the real participants, especially ExecutionHistory and HistoricalPlan.

Task 3.14A.2 must split that contract explicitly and establish a non-circular pre-bootstrap composition root for the real restore coordinator.

This task includes:

* separate durable and runtime payload types in restore participant contracts;
* participant-specific durable-to-runtime translation;
* Active translation;
* Profiles translation;
* PlanDecision translation;
* ExecutionHistory translation;
* HistoricalPlan translation;
* post-restore runtime-state normalization;
* restored durability-state semantics;
* restored ingress/protection semantics;
* coordinator integration;
* runtime install through translated targets;
* rollback runtime reconstruction;
* interrupted-startup reconstruction;
* concrete five-participant restore composition;
* non-circular pre-bootstrap coordinator registration;
* end-to-end real-participant live restore;
* end-to-end interrupted-startup recovery;
* regression coverage.

It does **not** implement:

* Backup V3 schema;
* Backup V3 export/import;
* new restore journal semantics;
* new staging stores;
* another transaction coordinator;
* domain-version changes;
* new persistence formats;
* Progress;
* Goals;
* learning;
* cross-tab locking.

---

# 1. Execution Artifact Rules

Before implementation:

1. Verify the immutable task artifact exists.
2. Verify the supplied artifact is complete.
3. Compare copies where available.
4. Record SHA-256.
5. Review:

   * resumed Task 3.14 stopped result;
   * Task 3.14A result;
   * Task 3.14A.1.2 result;
   * `restoreParticipants.ts`;
   * `restoreCoordinator.ts`;
   * runtime authority adapters;
   * store bootstrap composition.
6. Do not modify the task artifact during execution.

Create result:

`docs/implementation/phase-3/TASK_3.14A.2_COMPLETE_DURABLE_TO_RUNTIME_RESTORE_TRANSLATION_AND_PRE_BOOTSTRAP_COMPOSITION_RESULT.md`

---

# 2. Purpose

The current restore path effectively assumes:

```text
TDurable
    =
TRuntime
```

The real architecture requires:

```text
TDurable
    ↓
participant-specific translation
    ↓
TRuntime
```

where:

* `TDurable` is what staging, verification, and persistence operate on;
* `TRuntime` is what the live runtime adapter installs.

The durable representation and runtime representation describe the same authority, but they are not necessarily structurally identical.

---

# 3. Governing Principle

> **Backup/restored durable authority must never contain private runtime persistence state merely to satisfy runtime installation. Runtime state must be reconstructed from restored authority according to the participant's accepted semantics.**

The architecture must preserve the distinction between:

```text
portable/domain authority
        ↓
durable persistence representation
        ↓
private runtime representation
```

These layers may overlap structurally for simple participants, but they must not be assumed identical.

---

# 4. Participant Contract Split

Replace the single generic participant assumption with an explicit durable/runtime boundary.

Conceptually:

```ts
interface RestoreParticipantAdapter<TDurable, TRuntime> {
  id: RestoreParticipantId;

  validateDurablePayload(
    input: unknown
  ): Result<TDurable>;

  cloneDurablePayload(
    payload: TDurable
  ): TDurable;

  fingerprintDurablePayload(
    payload: TDurable
  ): string;

  captureCurrentDurableAuthority():
    Promise<TDurable>;

  captureSourceFingerprint():
    Promise<string>;

  recheckSourceFingerprint(
    expected: string
  ): Promise<Result>;

  writeDurableExact(
    payload: TDurable
  ): Promise<Result>;

  verifyDurableExact(
    payload: TDurable
  ): Promise<Result>;

  buildRuntimeTargetFromDurable(
    payload: TDurable
  ): Promise<Result<TRuntime>>;

  installRuntimeExact(
    target: TRuntime
  ): void;
}
```

Exact implementation names may differ.

The architectural requirement does not.

---

# 5. No Coordinator-Level Type Erasure

`restoreCoordinator.ts` must not pass a durable payload directly to a runtime adapter merely because both are represented as `unknown` or another broad type.

The coordinator must instead perform an explicit participant-specific translation:

```text
durable target
    ↓
participant.buildRuntimeTargetFromDurable(...)
    ↓
validated runtime target
    ↓
shared runtime authority transaction
    ↓
runtime.install(...)
```

Do not repair the existing mismatch with:

```ts
as unknown as RuntimeSnapshot
```

or equivalent unsafe casts.

---

# 6. Durable Translation Timing

Runtime translation must be deterministic from validated durable authority.

Prefer a sequence that reduces the possibility of discovering an impossible runtime translation only after durable mutation:

```text
validate durable target
    ↓
prove prospective runtime translation is valid
    ↓
stage durable target
    ↓
source recheck
    ↓
commit durable target
    ↓
verify committed durable target
    ↓
construct/reconfirm runtime target
    ↓
coherent runtime install
```

The exact sequence may differ where the current restore coordinator requires it, but runtime installation must ultimately represent the authority that was actually durably committed.

---

# 7. Runtime Target Validation

Where an existing runtime surface has private-state validation, use it.

A runtime target must not be considered valid merely because infrastructure code constructed it.

Translation must fail before runtime installation if the resulting state is not accepted by the participant's existing runtime contract.

---

# 8. Active Durable Payload

Audit the exact current durable Active representation.

Preserve the authority that current persistence considers authoritative, including existing source incarnations where applicable.

Do not introduce runtime-only:

* mutation-admission state;
* transaction state;
* restore state;
* transient failure state;
* notification state.

Do not allocate new source incarnations during translation.

---

# 9. Active Runtime Translation

Construct the complete runtime representation expected by the Active participant from the restored durable authority.

The resulting runtime state must represent a successfully established restored authority rather than the runtime conditions that happened to exist before restore.

Preserve existing authored identity and semantics exactly.

---

# 10. Active Preview Rule

Task 3.14 later owns Backup V3's explicit Preview policy.

Task 3.14A.2 must therefore avoid hardcoding Backup V3-specific Preview behavior.

Audit the existing generic restore semantics and choose one of the following only if supported by the current architecture:

* preserve a caller-supplied derived-state policy;
* reconstruct a generic safe runtime state;
* leave Backup V3-specific Preview clearing to Task 3.14.

Do not silently install an unrelated stale Preview merely because it existed in the pre-restore runtime snapshot.

Document the chosen rule.

---

# 11. Profiles Durable Payload

Use the current Profiles V2 durable authority representation.

Profiles remain reusable authored patterns according to their existing semantics.

Do not reinterpret Profiles as Active source lifetimes.

Do not introduce runtime durability/protection state into the durable payload unless source inspection establishes that such data is itself authoritative persisted state.

---

# 12. Profiles Runtime Translation

Construct the complete Profiles runtime representation from the durable Profiles authority.

After successful restore, runtime state should represent settled durable authority.

Do not:

* allocate new profile IDs;
* alter existing profile IDs;
* retimestamp profiles;
* reinterpret profile semantics.

---

# 13. PlanDecision Durable Payload

Use the current PlanDecision persisted/domain authority.

Preserve exactly the fields that constitute PlanDecision authority, including existing:

* IDs;
* target references;
* decision timestamps;
* decision semantics.

Do not add private runtime persistence conditions to make the payload installable.

---

# 14. PlanDecision Runtime Translation

Reconstruct all private runtime fields required by the PlanDecision runtime adapter.

A successfully restored durable PlanDecision authority must not inherit unrelated pre-restore persistence failure or pending state.

Expected semantics should resemble:

```text
authority = restored decisions
durability = settled/durable
pending desired condition = none
ingress/protection = healthy
```

but implementation must use the exact states and terminology supported by current source.

Document the final mapping explicitly.

---

# 15. ExecutionHistory Durable Payload

ExecutionHistory's durable restore representation may contain the physical/domain authority required by the current combined persistence adapter, including:

* records;
* quarantine;
* metadata;
* anti-resurrection infrastructure state where required.

This remains the durable representation.

Do not expand it with private runtime queues merely to satisfy runtime installation.

---

# 16. ExecutionHistory Runtime Translation

Build the complete private runtime state required by the ExecutionHistory runtime authority adapter.

The resulting state must represent the successfully restored IndexedDB authority.

Based on the existing Task 3.14 stop finding, this includes concepts such as:

```text
records
quarantine
desired
pendingRecords
pendingQuarantineRemovals
durability
ingress
authorityMode
migrationStatus
protected evidence
```

Determine the exact current fields and legal values from source.

For a successfully restored durable authority, normalize the runtime representation to the existing equivalent of:

```text
records = restored records
quarantine = restored quarantine
desired = settled restored authority
pendingRecords = empty
pendingQuarantineRemovals = empty
durability = durable/settled
ingress = healthy
authorityMode = IndexedDB
migrationStatus = established/completed
protectedEvidence = none
```

Do not invent unsupported enum values.

---

# 17. ExecutionHistory Pending State

Do **not** restore old runtime persistence queues from a portable or durable restore payload.

A successful restore has just established the target records durably.

Therefore the corresponding runtime state must not claim that those same records are still waiting to be persisted.

The same applies to pending quarantine removals.

---

# 18. ExecutionHistory Migration State

After exact restored IndexedDB authority has been established:

* legacy migration must not remain pending merely because an old runtime snapshot once said so;
* IndexedDB authority must be recognized as established;
* anti-resurrection protection must remain effective.

Do not rerun legacy migration as a side effect of runtime translation.

---

# 19. ExecutionHistory Protection

A valid durable restore target should translate to interpretable runtime authority.

Do not inherit unrelated pre-restore protected evidence into the restored runtime state.

If the restored durable authority itself is invalid or cannot be interpreted, restore should fail at validation/translation rather than synthesizing healthy runtime authority.

---

# 20. ExecutionHistory Quarantine

Quarantine is authority.

Preserve it exactly according to existing ExecutionHistory semantics.

Runtime translation must not:

* discard quarantine;
* automatically accept quarantine;
* automatically repair quarantine;
* convert quarantine into ordinary records.

---

# 21. HistoricalPlan Durable Payload

Use the current HistoricalPlan durable/physical restore authority accepted by the persistence adapter.

The resumed Task 3.14 audit identified the physical shape as centered on:

```text
batches
days
```

Confirm the exact current contract.

Do not add runtime `pending`, `status`, protection, or notification fields to make this durable payload directly installable.

---

# 22. HistoricalPlan Runtime Translation

Reconstruct the complete private HistoricalPlan runtime state expected by its runtime adapter.

The resumed Task 3.14 audit identified runtime concepts including:

```text
status
pending
batchMetadata
protectedEvidence
```

Confirm exact current source.

A successfully restored durable ledger should produce the existing equivalent of:

```text
status = healthy/ready
pending = empty
batchMetadata = deterministically reconstructed
protectedEvidence = none
```

Use only states supported by the current implementation.

---

# 23. HistoricalPlan Pending Publications

Restored HistoricalPlan batches are already durable authority.

They must not become pending publications merely because the runtime representation contains a pending queue.

Translation must produce an empty settled pending-publication state unless current durable authority explicitly establishes otherwise.

---

# 24. HistoricalPlan Resident Metadata

If HistoricalPlan runtime requires derived resident metadata or caches:

* reconstruct them deterministically from restored durable authority;
* do not copy stale pre-restore cache state;
* do not publish anything to reconstruct them;
* do not allocate IDs;
* do not allocate timestamps.

---

# 25. HistoricalPlan Publication Safety

Durable-to-runtime translation and exact runtime installation must not:

* invoke the HistoricalPlan publication workflow;
* allocate publication batch IDs;
* allocate `publishedAt`;
* emit publication-accepted events;
* create new HistoricalPlan authority.

This is mandatory.

---

# 26. Rollback Runtime Translation

The same durable-to-runtime distinction applies to the recovery side.

Rollback must support:

```text
verified recovery durable payload
    ↓
exact durable rollback
    ↓
verify recovery authority
    ↓
build runtime target from recovery durable authority
    ↓
shared authority transaction
    ↓
install coherent recovered runtime authority
```

Do not assume the staged recovery durable payload is structurally identical to the captured private runtime snapshot.

---

# 27. Runtime Snapshots Remain Valid

Task 3.14A.1.2's complete runtime snapshots remain useful.

They serve a different purpose:

> exact in-memory abort of a live runtime authority transaction.

Durable recovery serves:

> reconstruction of runtime authority from verified durable recovery evidence.

Do not remove or weaken runtime snapshot abort merely because durable-to-runtime translation now exists.

---

# 28. Coordinator API Changes

Update coordinator and participant generic types so each participant carries an explicit durable type and runtime type.

The type system should make the distinction visible.

Avoid an architecture where everything becomes `unknown` at the coordinator boundary and correctness depends on runtime discipline alone.

---

# 29. Heterogeneous Participant Registry

The five participants do not share one payload shape.

Use a typed registry, discriminated map, or equivalent type-safe design.

Conceptually:

```ts
type RestoreParticipantMap = {
  active: RestoreParticipantAdapter<
    ActiveDurable,
    ActiveRuntime
  >;

  profiles: RestoreParticipantAdapter<
    ProfilesDurable,
    ProfilesRuntime
  >;

  planDecision: RestoreParticipantAdapter<
    PlanDecisionDurable,
    PlanDecisionRuntime
  >;

  executionHistory: RestoreParticipantAdapter<
    ExecutionHistoryDurable,
    ExecutionHistoryRuntime
  >;

  historicalPlan: RestoreParticipantAdapter<
    HistoricalPlanDurable,
    HistoricalPlanRuntime
  >;
};
```

Exact naming may follow current participant IDs.

---

# 30. Staging Remains Durable-Only

The Task 3.14A restore staging infrastructure must continue to stage durable participant payloads.

Do not stage private runtime snapshots as restore authority merely to simplify installation.

The durable evidence must remain independent of ephemeral runtime persistence conditions.

---

# 31. Journal Remains Runtime-Neutral

Do not add private runtime state to the restore journal.

Journal authority remains limited to infrastructure evidence such as:

* transaction identity;
* stage;
* mode;
* timestamps already defined by the restore protocol;
* fingerprints;
* recovery state.

No Backup V3 or runtime payload data belongs in the journal.

---

# 32. Source Fingerprints Remain Durable

Source recheck must continue to fingerprint durable authority.

Do not include transient runtime queues, notification state, or unrelated protection state in source fingerprints unless source inspection establishes that they are part of durable authority.

---

# 33. Pre-Bootstrap Composition Problem

The resumed Task 3.14 result identified a second blocker:

> the concrete real restore coordinator and real five participant adapters are not currently composed in a way that can execute interrupted restore recovery before ordinary bootstrap without circular dependence.

Task 3.14A.2 must resolve this.

---

# 34. Composition Objective

The intended dependency direction is:

```text
create persistence/storage dependencies
        ↓
construct participant capability shells
        ↓
construct restore participant adapters
        ↓
construct one restore coordinator
        ↓
make startup recovery available
        ↓
resolve interrupted durable restore if needed
        ↓
perform ordinary participant initialization
        ↓
publish ready authority
```

Exact implementation may vary if the current store architecture requires a different non-circular composition.

---

# 35. No Ready-Store Dependency

Construction of the restore coordinator must not require:

* the DayFrame store already being ready;
* Active authority already being externally usable;
* ExecutionHistory already being initialized;
* HistoricalPlan already being initialized;
* a completed ordinary bootstrap.

It may depend on pre-created capability shells and storage services that do not themselves commit ordinary authority during construction.

---

# 36. Runtime Surface Shells

Audit PlanDecision, ExecutionHistory, and HistoricalPlan construction.

If necessary, separate:

```text
surface construction
```

from:

```text
surface authority initialization
```

so the capabilities required for restore composition exist before normal authority becomes externally usable.

Do not perform a broad surface rewrite if existing APIs already provide this separation.

---

# 37. Active and Profiles Runtime Capabilities

Provide whatever exact-install/runtime translation capabilities Active and Profiles require before normal store readiness.

These capability handles must not require the restored Active/Profile authority to already have been loaded.

---

# 38. Restore Coordinator Ownership

Establish one clear owner for the concrete restore coordinator.

Preferred unless source architecture demonstrates a better existing composition point:

> the DayFrame store composition root constructs or receives one coordinator and uses that same coordinator for startup recovery and later live restore.

Do not create independent restore coordinators for:

* startup;
* Backup V3;
* rollback;
* UI restore.

---

# 39. Future Backup V3 Access

Task 3.14 must be able to use the same concrete restore infrastructure established here.

Task 3.14A.2 should expose the narrow capability needed by future Backup V3 without implementing Backup V3 itself.

---

# 40. Startup Recovery Policy Audit

Determine which startup policy is actually safest and most aligned with the existing implementation.

Two valid models may exist.

### Model A — Recovery installs runtime before normal bootstrap

```text
startup
    ↓
journal recovery
    ↓
durable authority resolved
    ↓
runtime targets reconstructed
    ↓
runtime authority installed
    ↓
ordinary bootstrap recognizes established state
```

### Model B — Recovery resolves durable authority before normal bootstrap

```text
startup
    ↓
journal recovery
    ↓
durable authority resolved only
    ↓
ordinary participant bootstrap
    ↓
participants load final recovered durable authority
    ↓
runtime becomes ready once
```

Audit current Task 3.14A semantics and implementation.

Choose one coherent model.

Do not mix them accidentally.

---

# 41. Preferred Startup Model

Strongly consider Model B if it fits the existing architecture:

```text
pre-bootstrap recovery
    ↓
resolve durable authority only
    ↓
no externally usable runtime authority yet
    ↓
normal participant initialization reads recovered authority
    ↓
coordinated ready state
```

This naturally avoids circular pre-bootstrap runtime installation.

However, do not adopt it merely because it is simpler if Task 3.14A's correctness depends on runtime installation during recovery.

The result artifact must document the chosen policy and evidence.

---

# 42. Live Restore Policy

Live restore occurs after DayFrame authority is already usable.

Therefore live restore must:

```text
validated target
    ↓
stage
    ↓
source recheck
    ↓
durable replacement
    ↓
durable verification
    ↓
participant runtime translation
    ↓
shared five-participant runtime authority transaction
    ↓
coherent subscriber-visible target
```

This path is mandatory.

---

# 43. Startup and Live Paths May Differ

It is acceptable for interrupted startup recovery and live restore to use different runtime-establishment mechanisms if they converge on identical final authority.

For example:

```text
startup interrupted restore
    → resolve durable authority
    → bootstrap reads final durable authority

live restore
    → resolve durable authority
    → translate/install runtime immediately
```

If this design is chosen, prove both paths.

---

# 44. Normal Startup With No Journal

No regression.

With no restore journal/evidence requiring action:

* ordinary startup proceeds;
* no unnecessary durable writes occur;
* participants initialize once;
* readiness semantics remain unchanged.

---

# 45. Startup Forward-Recovery Test

Simulate a restart from a valid forward-recovery stage such as:

```text
indexedDbCommitted
```

with complete valid target staging.

Assert:

* target side is deterministically completed;
* all durable participants converge on target;
* runtime/bootstrap converges on target;
* store becomes ready only after coherent authority is established;
* no durable payload is passed directly to an incompatible runtime installer.

---

# 46. Startup Rollback-Recovery Test

Simulate a restart from a rollback stage.

Assert:

* exact recovery durable authority is restored;
* runtime authority is reconstructed from the verified recovery side;
* all five participants converge coherently;
* ordinary readiness resumes only when recovery is complete.

---

# 47. Startup Protected-Recovery Test

When journal/staging evidence cannot prove either target or recovery authority:

* do not guess;
* do not initialize ordinary usable authority over the unresolved state;
* preserve recovery-required protection;
* retain required evidence according to Task 3.14A semantics.

---

# 48. Live Five-Participant Restore Test

Use the real participant adapters rather than only generic fixture participants.

Establish:

```text
current authority A
target durable authority B
```

Run restore.

Assert final durable and runtime authority B for:

1. Active;
2. Profiles;
3. PlanDecision;
4. ExecutionHistory;
5. HistoricalPlan.

---

# 49. Live Restore Runtime Normalization

Explicitly prove the post-restore runtime condition.

At minimum, where supported by current surface semantics:

* ExecutionHistory pending record queue is empty;
* ExecutionHistory pending quarantine-removal queue is empty;
* ExecutionHistory durability is settled;
* ExecutionHistory authority mode reflects IndexedDB;
* ExecutionHistory migration state is established;
* ExecutionHistory quarantine is preserved;
* HistoricalPlan pending publication queue is empty;
* HistoricalPlan resident metadata reflects restored ledger;
* PlanDecision has no stale pre-restore persistence failure;
* valid restored participants do not inherit unrelated protected evidence.

---

# 50. Rollback Runtime Normalization

When rollback restores a previously settled durable authority, reconstruct a settled runtime representation of that authority.

Do not resurrect stale ephemeral queues from an earlier runtime session unless those queues are themselves proven durable authority.

---

# 51. Active Translation Tests

Prove:

* durable Active authority translates into valid runtime authority;
* IDs/incarnations are preserved;
* no identity allocation occurs;
* no Backup V3-specific behavior is introduced.

---

# 52. Profiles Translation Tests

Prove:

* exact profile authority is preserved;
* profile IDs are not allocated or changed;
* reusable profile semantics remain unchanged;
* translated runtime state is settled.

---

# 53. PlanDecision Translation Tests

Prove:

* decisions are preserved exactly;
* decision IDs and timestamps remain unchanged;
* no new decisions are emitted;
* restored runtime persistence state is settled.

---

# 54. ExecutionHistory Translation Test

Given valid durable authority containing records, quarantine, metadata, and required anti-resurrection evidence:

* build a valid runtime target;
* preserve records;
* preserve quarantine;
* establish the correct authority mode;
* establish the correct migration state;
* clear ephemeral pending mutation queues;
* establish settled durability;
* produce no new execution evidence.

---

# 55. HistoricalPlan Translation Test

Given valid durable HistoricalPlan batches/days:

* reconstruct valid runtime state;
* preserve exact historical authority;
* rebuild required resident metadata deterministically;
* leave pending publication empty;
* emit no publication;
* allocate no publication identity;
* allocate no publication timestamp.

---

# 56. Translation Must Be Pure With Respect to Persistence

`buildRuntimeTargetFromDurable` or equivalent must not itself persist.

Test or otherwise prove that translation does not write:

* localStorage;
* IndexedDB;
* restore journal;
* staging;
* anti-resurrection marker.

Durable mutation belongs to the restore commit path.

---

# 57. Translation Must Not Allocate Domain Identity

Translation must not call domain identity allocators.

Audit and test where practical.

This includes:

* Active source incarnation allocation;
* profile ID allocation;
* PlanDecision ID allocation;
* execution identity allocation;
* HistoricalPlan publication/batch identity allocation.

---

# 58. Translation Must Not Retimestamp Authority

Do not replace existing domain timestamps with current time.

No restore-time rewriting of:

* decision timestamps;
* execution timestamps;
* publication timestamps;
* historical dates;
* source incarnation identity metadata.

Infrastructure journal timestamps remain governed by Task 3.14A and are outside this rule.

---

# 59. Translation Must Not Emit Domain Events

Runtime translation/install must not masquerade as user/domain workflow.

It must not emit:

* execution-created events;
* PlanDecision events;
* HistoricalPlan publication events;
* workflow acceptance events;
* new domain authority.

Subscriber notification of exact runtime replacement is infrastructure behavior and remains governed by the shared scheduler.

---

# 60. Runtime Notification Boundary

Translation itself emits no subscriber notification.

Exact runtime installation occurs inside the existing shared authority transaction.

Participant notifications remain deferred through the scheduler and flush coherently according to Task 3.14A.1.2 semantics.

---

# 61. Cross-Read Coherence

Extend the existing generic cross-read proof to the real five-participant restore path.

A subscriber notified of final restored authority must not observe:

```text
new Active
old Profiles
new PlanDecision
old ExecutionHistory
new HistoricalPlan
```

or any equivalent hybrid.

The first externally visible post-restore observation must be coherent according to the existing runtime transaction contract.

---

# 62. Live Runtime Abort

Preserve Task 3.14A.1.2's exact runtime abort guarantee.

If one participant runtime install fails inside the shared transaction:

* restore the exact captured runtime snapshots;
* do not leave a partial in-memory target;
* preserve durable journal/recovery semantics appropriate to the already-completed durable stage;
* do not falsely report success.

---

# 63. Translation Failure Before Durable Mutation

If a target durable payload cannot produce a valid prospective runtime target, prefer failing before the first live durable mutation.

No live authority should change.

---

# 64. Translation Failure After Durable Commit

If translation unexpectedly fails after durable mutation despite prevalidation:

* do not report success;
* retain restart-visible journal evidence;
* follow existing deterministic Task 3.14A recovery policy;
* enter `recoveryRequired` if neither valid completion nor rollback can be proven.

Do not invent a heuristic side choice.

---

# 65. Deterministic Translation

For the same valid durable payload, translation must produce semantically equivalent runtime authority.

Translation must not depend on:

* wall-clock time;
* random IDs;
* mutation order outside the payload;
* stale pre-restore private runtime queues.

---

# 66. Anti-Resurrection

ExecutionHistory anti-resurrection remains durable infrastructure.

After restore and after restart:

* IndexedDB authority remains authoritative;
* legacy authority cannot resurrect deleted/replaced execution evidence;
* runtime translation does not weaken the marker.

Add regression coverage using the real restore path.

---

# 67. Invalid ExecutionHistory Target

If ExecutionHistory durable target fails existing validation:

* reject before runtime translation;
* do not synthesize a protected runtime target as though restore succeeded;
* follow existing restore failure semantics.

---

# 68. Invalid HistoricalPlan Target

If HistoricalPlan durable target fails existing validation:

* reject before runtime translation;
* do not publish or repair it;
* do not synthesize healthy runtime authority.

---

# 69. Concrete Restore Coordinator Integration

Create or expose the actual five-participant restore registry used by DayFrame.

Do not leave Task 3.14A.2 complete based only on:

* generic two-participant fixtures;
* isolated translation unit tests;
* coordinator tests with artificial participants.

At least one integration path must exercise the real participants.

---

# 70. Non-Circular Composition Test

Prove that DayFrame can construct the restore infrastructure before ordinary readiness without requiring the authority that recovery is intended to establish.

The test must demonstrate:

```text
store/surface construction
    ↓
restore infrastructure available
    ↓
startup recovery decision
    ↓
authority initialization
    ↓
ready
```

without circular ready-state dependency.

---

# 71. One Coordinator Instance

Ensure one logical coordinator owns a restore transaction for a store instance.

Do not create competing coordinator state machines for the same authority.

---

# 72. No Double Participant Initialization

Interrupted recovery followed by normal bootstrap must not accidentally:

* initialize collection surfaces twice;
* replay migrations twice;
* publish historical data twice;
* emit duplicate readiness;
* overwrite recovered authority with stale pre-recovery snapshots.

Add focused coverage.

---

# 73. Durable Target vs Backup Domain Target

Task 3.14A.2 does not define Backup V3.

However, the architecture must leave a clean future path:

```text
Backup V3 domain participant data
    ↓
participant-specific validated durable target construction
    ↓
Task 3.14A restore coordinator
```

If a participant's exact physical durable payload is unsuitable as portable backup content, keep that conversion inside the future participant-specific Backup V3 adapter boundary.

Do not serialize physical implementation details merely because restore persistence uses them internally.

---

# 74. No Runtime State in Backup Contract

Document explicitly:

> **Restore runtime translation is an infrastructure concern. Backup V3 does not serialize private `TRuntime` state.**

This is one of the central outcomes of Task 3.14A.2.

---

# 75. Existing Restore Tests

Update existing Task 3.14A tests where necessary so they prove the corrected translation path rather than relying on durable/runtime shape coincidence.

Do not weaken existing:

* journal tests;
* staging tests;
* source-recheck tests;
* rollback tests;
* recoveryRequired tests;
* combined IndexedDB atomicity tests.

---

# 76. Compile-Time Contract Regression

Where practical, add a compile-time/type-level assertion that prevents direct durable-payload installation into an incompatible runtime adapter.

The type system should help prevent recurrence of the exact bug that stopped Task 3.14.

---

# 77. Unsafe Cast Audit

Audit restore infrastructure for casts equivalent to:

```ts
durablePayload as unknown as RuntimeSnapshot
```

Remove such casts from the real participant restore path.

If any broad cast remains for generic registry mechanics, document why it cannot cross the durable/runtime semantic boundary incorrectly and prove it with participant validation.

---

# 78. No New IndexedDB Stores

Task 3.14A.2 should not require a physical database schema upgrade.

If a new object store or DB version becomes necessary, stop and document why the existing Task 3.14A durable foundation is insufficient.

---

# 79. No New localStorage Keys

No new localStorage keys are expected.

If one becomes necessary for correctness, stop and document the requirement before introducing it.

---

# 80. No Backup V3 Implementation

Do not implement:

* V3 writer;
* V3 reader;
* V3 schema;
* V3 import dispatch;
* V3 export UI;
* V3 restore UI;
* V3 compatibility logic.

Task 3.14 remains responsible for Backup V3.

---

# 81. No Domain Version Change

Do not change domain versions merely to support runtime translation.

The task is an infrastructure seam correction.

---

# 82. No New User Workflow

Do not add UI or user-visible restore workflow.

No new buttons, dialogs, screens, or restore affordances are required.

---

# 83. Documentation Updates

Update the existing restore governance documentation only as necessary to make the corrected architecture truthful.

Review and update as appropriate:

* Task 3.14A checkpoint;
* Task 3.14A ADR;
* `CURRENT_STATE.md`;
* `DECISIONS.md`.

Clarify:

* durable payload and runtime target are distinct;
* runtime reconstruction is participant-specific;
* startup composition is non-circular;
* one restore coordinator serves the real five-participant authority boundary.

Do not claim Backup V3 exists.

---

# 84. Required Result Artifact

Create:

`docs/implementation/phase-3/TASK_3.14A.2_COMPLETE_DURABLE_TO_RUNTIME_RESTORE_TRANSLATION_AND_PRE_BOOTSTRAP_COMPOSITION_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Blocking Task 3.14 Discovery
4. Existing Restore Contract Audit
5. Files Changed
6. Durable vs Runtime Contract
7. Generic Type Split
8. Coordinator Changes
9. Active Durable Payload
10. Active Runtime Translation
11. Profiles Durable Payload
12. Profiles Runtime Translation
13. PlanDecision Durable Payload
14. PlanDecision Runtime Translation
15. ExecutionHistory Durable Payload
16. ExecutionHistory Runtime Translation
17. ExecutionHistory Settled-State Normalization
18. HistoricalPlan Durable Payload
19. HistoricalPlan Runtime Translation
20. HistoricalPlan Settled-State Normalization
21. Quarantine Preservation
22. Protection Semantics
23. Anti-Resurrection
24. Translation Validation
25. Translation Determinism
26. Translation Failure
27. Rollback Translation
28. Coordinator Runtime Install
29. Heterogeneous Participant Registry
30. Unsafe Cast Audit
31. Store Composition Root
32. Pre-Bootstrap Coordinator Construction
33. Startup Recovery Policy
34. Live Restore Policy
35. Startup Forward Recovery
36. Startup Rollback Recovery
37. Protected Startup Recovery
38. Runtime Notification
39. Persistence Side-Effect Audit
40. Identity Allocation Audit
41. Timestamp Audit
42. Domain-Event Audit
43. Tests Added
44. Translation Unit Tests
45. Live Five-Participant Restore Test
46. Interrupted Startup Test
47. Rollback Test
48. Cross-Read Test
49. Compile-Time Contract Test
50. Anti-Resurrection Regression
51. HistoricalPlan Regression
52. ExecutionHistory Regression
53. No Persistence Schema Change Audit
54. No Backup V3 Audit
55. Documentation Updates
56. Architectural Alignment
57. Deviations
58. Discoveries and Deferred Work
59. Resume Task 3.14 Recommendation
60. Focused Validation
61. Full Validation
62. Final Determination

---

# 85. Required Durable / Runtime Matrix

The result must include:

| Participant      | Durable representation | Runtime representation | Translation required? |
| ---------------- | ---------------------- | ---------------------- | --------------------: |
| Active           | determine from source  | determine from source  |                Yes/No |
| Profiles         | determine from source  | determine from source  |                Yes/No |
| PlanDecision     | determine from source  | determine from source  |                Yes/No |
| ExecutionHistory | determine from source  | determine from source  |                   Yes |
| HistoricalPlan   | determine from source  | determine from source  |                   Yes |

Do not fill this matrix from assumptions. Populate it from the implemented source.

---

# 86. Required Restored Runtime State Matrix

The result must include:

| Participant      | Pending after successful restore? | Durability/state            | Protection                    |
| ---------------- | --------------------------------: | --------------------------- | ----------------------------- |
| Active           |                         determine | determine                   | determine                     |
| Profiles         |                         determine | determine                   | determine                     |
| PlanDecision     |                         determine | determine                   | determine                     |
| ExecutionHistory |                       No expected | settled IndexedDB authority | healthy unless target invalid |
| HistoricalPlan   |                       No expected | settled durable ledger      | healthy unless target invalid |

Use actual implementation terminology.

---

# 87. Required Startup Recovery Matrix

The result must include:

| Journal/outcome                   | Durable action             | Runtime/bootstrap action  |
| --------------------------------- | -------------------------- | ------------------------- |
| no journal                        | none                       | normal bootstrap          |
| staged/pre-mutation               | existing Task 3.14A policy | documented                |
| forward stage                     | finish verified target     | documented                |
| rollback stage                    | finish verified recovery   | documented                |
| finalized                         | cleanup                    | documented                |
| recoveryRequired/invalid evidence | protect                    | no unsafe ready authority |

---

# 88. Required Live Restore Matrix

The result must include:

| Phase               | Durable authority           | Runtime authority               |
| ------------------- | --------------------------- | ------------------------------- |
| before restore      | source                      | source                          |
| staging             | source                      | source                          |
| source recheck      | source                      | source                          |
| durable commit      | transitioning under journal | source until coherent install   |
| durable verified    | target                      | source                          |
| runtime transaction | target                      | atomically transitioning        |
| complete            | target                      | target                          |
| runtime abort       | governed by journal         | exact captured runtime snapshot |
| durable rollback    | recovery                    | translated recovery runtime     |

Adjust wording if implementation establishes a more precise state model.

---

# 89. Required Architectural Invariants

Prove all of the following:

1. Durable and runtime restore payload types are explicitly distinct where their semantics differ.
2. Coordinator cannot directly install a durable payload into an incompatible runtime adapter.
3. Portable/domain authority never needs private runtime persistence state merely to restore.
4. ExecutionHistory durable authority can reconstruct complete valid restored runtime authority.
5. HistoricalPlan durable authority can reconstruct complete valid restored runtime authority.
6. Successful restore does not leave restored records/batches in pending persistence queues.
7. ExecutionHistory restored runtime reflects established IndexedDB authority.
8. ExecutionHistory anti-resurrection remains effective.
9. ExecutionHistory quarantine remains intact.
10. HistoricalPlan restored batches are not pending publications.
11. HistoricalPlan translation emits no publication workflow.
12. Translation allocates no domain IDs.
13. Translation retimestamps no domain authority.
14. Translation performs no persistence.
15. Durable rollback reconstructs runtime from durable recovery authority.
16. Runtime snapshots still provide exact live transaction abort.
17. The real coordinator can be composed before ordinary store readiness.
18. Interrupted startup recovery has no circular authority dependency.
19. One restore coordinator serves startup recovery and future live restore.
20. Normal startup with no journal remains unchanged.
21. Live restore uses the shared authority transaction for coherent runtime installation.
22. Subscriber cross-reads cannot observe a hybrid five-participant restored state.
23. No Backup V3 schema or import/export path is introduced.
24. No persistence schema change is introduced unless the task stops first.

---

# 90. Focused Validation

Run focused tests covering:

* participant contract typing;
* durable-to-runtime translation;
* runtime target validation;
* settled-state normalization;
* coordinator runtime installation;
* rollback translation;
* non-circular startup composition;
* no-journal startup;
* interrupted forward recovery;
* interrupted rollback recovery;
* protected recovery;
* real five-participant live restore;
* cross-read coherence;
* runtime abort;
* ExecutionHistory quarantine;
* ExecutionHistory anti-resurrection;
* HistoricalPlan no-publication behavior;
* no persistence during translation;
* no identity allocation;
* no domain retimestamping;
* no domain-event emission.

Record the exact focused commands and results.

---

# 91. Full Validation

After focused tests pass, run:

```text
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Record:

* lint result;
* typecheck result;
* exact test-file count;
* exact test count;
* build result;
* build module count if reported;
* `git diff --check` result.

Do not report historical validation from Task 3.14A as validation of Task 3.14A.2.

---

# 92. Stop Conditions

Stop before claiming completion if any of the following is true:

* one durable participant cannot deterministically reconstruct valid runtime authority;
* runtime reconstruction requires serializing ephemeral private state into durable/portable authority;
* successful restored runtime state cannot be normalized without changing domain semantics;
* ExecutionHistory cannot distinguish restored durable authority from pending persistence work;
* HistoricalPlan cannot distinguish restored durable batches from pending publication;
* coordinator construction before ordinary readiness requires a broader store architecture rewrite;
* startup recovery cannot avoid circular authority initialization;
* type-safe heterogeneous participant handling requires replacing the Task 3.14A restore foundation wholesale;
* fixing translation requires a new persistence schema;
* fixing translation requires a new domain schema;
* live five-participant restore cannot prove coherent subscriber-visible authority;
* interrupted startup cannot prove deterministic target/recovery convergence.

Do not paper over a stop condition with casts, duplicated coordinators, private runtime serialization, or weakened validation.

---

# 93. Explicit Non-Goals

Do not add:

* Backup V3;
* Backup V3 UI;
* restore UI;
* cloud backup;
* sync;
* cross-tab locking;
* browser locks;
* Progress;
* Goals;
* learning;
* recommendation logic;
* execution workflow changes;
* HistoricalPlan publication changes;
* scheduling-engine changes;
* Preview redesign;
* unrelated refactoring.

---

# 94. Architectural Alignment Assessment

The result must explicitly assess whether the final implementation preserves:

* domain authority versus infrastructure state separation;
* exact durable replacement semantics;
* interruption-safe recovery;
* runtime atomicity;
* deterministic identity;
* append-only/history semantics where applicable;
* anti-resurrection;
* quarantine;
* no accidental workflow replay;
* future Backup V3 portability.

If an implementation decision weakens one of these, document it as a deviation rather than silently accepting it.

---

# 95. Deviations

Document every deviation from this task artifact.

For each deviation state:

* what changed;
* why;
* whether it was required by current source;
* architectural consequence;
* whether follow-up is required.

“No deviations” is acceptable only if true.

---

# 96. Discoveries and Deferred Work

Record newly discovered issues separately from implementation failures.

Do not expand this task to solve unrelated discoveries.

Potential future work remains bounded by later Phase 3 tasks unless it directly blocks this prerequisite.

---

# 97. Resume Task 3.14 Recommendation

If Task 3.14A.2 completes successfully, the result should recommend:

> **Resume Task 3.14 — Define and Implement Backup V3 Across Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan.**

Task 3.14 should then be able to construct five validated participant targets and hand them to the existing restore infrastructure without:

* serializing private runtime state;
* duplicating restore mechanics;
* modifying the restore journal;
* inventing another transaction coordinator.

---

# 98. Expected Post-Task Architecture

The intended final architecture is:

```text
Current durable authority
        ↓
portable Backup V3 domain projection        [Task 3.14]
        ↓
strict complete validation                   [Task 3.14]
        ↓
five validated participant restore targets  [Task 3.14]
        ↓
Task 3.14A durable restore coordinator
        ↓
durable target staging
        ↓
source recheck
        ↓
verified five-surface durable replacement
        ↓
participant-specific durable→runtime translation
        ↓
shared five-participant runtime authority transaction
        ↓
coherent live authority
```

Interrupted startup remains:

```text
startup
        ↓
restore journal inspection
        ↓
deterministic target/recovery durable convergence
        ↓
non-circular runtime/bootstrap establishment
        ↓
ready authority
```

---

# 99. Task Determination

**Authorized:** explicit durable/runtime restore type separation, participant-specific deterministic durable-to-runtime translation, settled restored runtime normalization, coordinator integration, rollback runtime translation, one real pre-bootstrap restore composition root, startup recovery wiring, live five-participant restore/recovery tests, documentation correction, and comprehensive regression coverage.

**Not authorized:** Backup V3 schema/export/import, new restore journal semantics, new staging stores, new persistence/domain versions, cloud/sync, Progress, Goals, learning, cross-tab locking, or unrelated UI work.

The governing amendment principle is:

> **Durable authority and runtime authority are different representations of the same truth. Restore infrastructure must preserve that distinction: stage and verify the durable representation, reconstruct the runtime representation deterministically from the verified authority, and install it coherently without requiring portable backups to contain ephemeral runtime persistence state.**

---

# 100. Final Completion Statement

**Task 3.14A.2 is complete when DayFrame's restore infrastructure explicitly distinguishes each participant's durable/domain restore representation from its private runtime authority representation; when the coordinator can stage, persist, verify, and roll back durable payloads while invoking participant-specific deterministic durable-to-runtime translation before coherent live installation; when Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan each reconstruct valid restored runtime state without serializing ephemeral pending, durability, ingress, migration, notification, or protection state into portable authority; when successful ExecutionHistory restore produces established IndexedDB authority with preserved quarantine, no pending mutation queue, correct migration and anti-resurrection state, and valid settled runtime semantics; when successful HistoricalPlan restore produces the exact restored ledger with no pending publication queue, correct resident metadata, no unrelated protected evidence, and no publication event; when rollback reconstructs runtime from verified durable recovery authority while existing runtime snapshots continue to provide exact live transaction abort; when the concrete real restore coordinator and participant registry can be composed before ordinary store readiness without circular authority dependency; when interrupted startup recovery deterministically resolves target or recovery authority before ordinary authority becomes externally usable; when live restore installs translated targets through the shared five-participant authority transaction and subscribers cannot observe hybrid cross-surface state; when translation performs no persistence, domain allocation, retimestamping, publication, or other workflow side effects; when real-participant live restore, interrupted-startup recovery, rollback, anti-resurrection, quarantine, and cross-read tests pass; when the full repository validates; and when no Backup V3 schema, Backup V3 import/export, new restore stores, domain-version change, Progress, Goal, learning, sync, cross-tab locking, or unrelated feature is introduced.**
