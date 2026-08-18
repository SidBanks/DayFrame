# Task 1.25 — Establish Store-Level Durability Outcome Semantics — Result

**Project:** DayFrame  
**Phase:** Phase 1 — Architectural Foundation Alignment  
**Task ID:** 1.25  
**Status:** Complete  
**Execution type:** Investigation / architectural contract decision

---

# 1. Executive Determination

DayFrame should adopt a **session-first, explicitly checkpointed durability
contract**:

- a valid authored store mutation succeeds when its in-memory runtime transition is
  applied;
- durable persistence is a separate dimension of the result and must never be
  implied by runtime success;
- after persistence failure, the new runtime state remains authoritative for the
  current session;
- the prior stored representation is the **last known durable checkpoint** and
  recovery source, not a competing current authority;
- the store retains surface-level, non-domain durability status outside
  `DayFrameState`, so a failure remains observable after the initiating call;
- mutation results return the runtime snapshot plus the precise persistence outcome;
- existing state subscribers observe runtime truth only and receive no durability
  guarantee;
- the store owns persistence interpretation and retry execution; workflows own
  user communication and initiation of ordinary retry/recovery choices; and
- migrations use the same factual persistence outcomes but require separate durable
  migration evidence.

This is a hybrid of session-first continuation, explicit non-durable store status,
and operation-result durability. It preserves user work and current deterministic
store ownership without mixing storage transport state into domain/authored state.

No executable behavior was changed.

---

# 2. Artifact Integrity

The immutable Task 1.25 artifact was verified complete at 1,312 lines and ends with
the required completion sentence. Its SHA-256 is:

```text
e5122f7685620d1404d630a80da6f117fc303e435e6f30841d1627d8717f0e69
```

The saved artifact was byte-identical to the supplied attachment and remained
unchanged.

---

# 3. Evidence Reviewed

Reviewed:

- Task 1.23's complete persistence-failure boundary and divergence analysis;
- Task 1.24's helper outcome implementation and failure-injection tests;
- `DayFrameStore`, `DayFrameState`, and all current mutation return signatures;
- mutation → persistence → notification ordering;
- React subscription and workflow callers in `DayFrameApp`;
- profile-source and backup-source retention;
- independent active/profile clear helpers;
- no-storage and storage-accessor behavior; and
- the accepted durable-data ADR.

Current code confirms that mutations return `DayFrameState` (clear is typed `void`
despite returning a snapshot in implementation), subscribers receive only
`DayFrameState`, and callers use returned state only where immediate workflow logic
requires it. Task 1.24 outcomes are exported, factual, and currently ignored.

---

# 4. Current Store Contract

**Confirmed current behavior:**

```text
valid input
  → runtime state assigned
  → persistence outcome produced and ignored
  → runtime snapshot published
  → DayFrameState returned
```

A normal return currently proves runtime application and notification, but callers
often interpret it as durable success. No store state records the last persistence
outcome. Reload rehydrates the last durable checkpoint.

The store already owns runtime mutation, cloning, Preview invalidation, persistence
attempt ordering, and subscriber publication. Moving the commit decision to UI
would reverse the ownership consolidation established earlier in Phase 1.

---

# 5. Candidate Durability Models

## Model A — Transactional rollback

Rollback would keep runtime aligned with storage and let subscribers equate state
with durability. It would also immediately discard valid user work when storage is
unavailable, complicate restoration of Preview/UI context, and make DayFrame poorly
usable in a session-only environment. Source-backed profile load and backup import
make uniform rollback particularly artificial. Rejected as the default.

## Model B — Session-first continuation

Continuation preserves user work and matches current runtime behavior. Alone it is
insufficient: failures can outlive the initiating workflow and reload remains risky.
Adopted as the runtime-authority foundation, not as the complete model.

## Model C — Explicit pending/non-durable runtime state

Tracking divergence makes it persistent within the store session and supports
retry. Putting it in `DayFrameState` would mix storage infrastructure with authored
and derived state. Adopted only as **separate store-level durability status**.

## Model D — Operation-result-only durability

A result is the narrowest way to let an initiating workflow respond. Alone it loses
observability when the workflow ends and cannot support later global retry/status.
Adopted as one part of the hybrid contract.

## Model E — Workflow-controlled commit

Rejected. It distributes mutation authority back into workflows, requires them to
restore/retain state, and conflicts with the store-owned authored transition.

## Model F — Session-first + store durability status + operation result

This hybrid retains current runtime authority, exposes immediate outcomes, and
keeps unresolved durability knowledge at the store without contaminating domain
state. It permits deliberate retry and later feedback while avoiding rollback and a
generalized command framework. **Recommended.**

---

# 6. Decision Matrix

| Model | Runtime/Durable Consistency | User Work Preservation | Subscriber Simplicity | Retryability | Architectural Complexity | ADR Alignment | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Transactional rollback | Immediate consistency | Poor on failure | High: snapshots could imply durable | Moderate | High due rollback/context restoration | Partial: explicit, but can sacrifice recoverable work | Reject as default |
| Session-first continuation | Diverges explicitly only if result observed | High | Existing subscribers simple but durability ambiguous | Incidental later write | Low | Partial: preserves data but insufficient ongoing observability | Foundation only |
| Explicit pending/non-durable state | Explicit divergence | High | Lower if mixed into snapshots | High | High if placed in domain state | Strong if separated cleanly | Adopt outside `DayFrameState` |
| Operation-result-only durability | Explicit to caller only | High | High | Workflow-local | Low | Partial: observation can disappear | Adopt as immediate channel only |
| Workflow-controlled commit | Workflow-dependent | Variable | Variable | Workflow-dependent | High/distributed | Weak deterministic ownership | Reject |
| Hybrid session-first + store status + result | Explicit runtime/checkpoint relationship | High | Runtime subscription remains simple; durability is separate | High | Moderate and bounded | Strongest balance | **Adopt** |

---

# 7. Recommended Store-Level Durability Contract

The store owns two related but distinct facts:

1. **Runtime state:** the current authoritative state for this application session.
2. **Durability state by surface:** whether the current runtime representation for
   active authored state and profiles is known to match its last attempted durable
   operation.

The store applies a valid mutation once, attempts persistence once, publishes the
runtime snapshot once, records the surface outcome outside `DayFrameState`, and
returns a result containing both the state and outcome.

Normative mutation statement:

> **A successful authored store mutation guarantees that the requested runtime
> transition was applied and published. Durable persistence is guaranteed only when
> the mutation result reports `persisted` (or the relevant removal result reports
> `removed`); every other durability outcome means the current session state is not
> confirmed by that durable operation.**

Validation/domain errors may still throw before runtime application. The contract
does not turn all exceptions into durability outcomes.

---

# 8. Runtime Authority After Failure

Runtime continues and remains authoritative for current-session behavior after
`unavailable`, `storageFailure`, or `serializationFailure`. Subscribers continue to
receive it, Preview may be marked stale/regenerated, and subsequent mutations build
from it.

The store separately marks the affected durable surface non-durable. This is not a
second domain authority. It is infrastructure knowledge that the current runtime
snapshot lacks confirmed persistence.

Rollback remains available only for a future operation-specific decision where
continuation would itself be unsafe; it is not the ordinary authored-mutation rule.

---

# 9. Durable Checkpoint / Recovery-Source Semantics

After failed replacement, the old stored representation is the **last known durable
checkpoint**:

- it is the automatic fallback that reload currently restores;
- it is a recovery source;
- it is superseded in current-session intent by runtime state;
- it must not be described as the current runtime authority; and
- its existence does not make failure acceptable or complete the new mutation.

For profile load, the source profile is an additional durable recovery source. For
backup import, the external backup is an additional recovery source. These sources
reduce irrecoverability but do not convert failed active persistence into success.

Reload while non-durable means an **implicit return to the last durable checkpoint
and loss of unresolved session-only changes**. The architecture must communicate
that risk before reload when feasible. Preserving pending state across reload would
itself require another durable channel and is not required by this contract.

---

# 10. Mutation Result Semantics

Persisting mutations should return a narrow two-dimensional result rather than
`DayFrameState` alone:

```ts
type StoreMutationResult = {
  state: DayFrameState;
  persistence: PersistenceWriteOutcome;
};
```

Removal/clear uses its own result because it spans two keys. The result need not add
`runtimeStatus: "applied"`; a returned result means application succeeded, while
pre-application validation errors remain exceptions. This avoids redundant command
machinery.

All authored setters, Setup commit, manual-event mutation, profile save/delete/load,
and backup import should use the same core result concept. Their persistence surface
or recovery context differs, but the meaning of `state` plus factual outcome does
not.

The store also retains latest status per durable surface so later consumers can
query/subscribe to durability independently. Exact type/API naming is deferred to
implementation, but it must distinguish at least active state and profile storage.

---

# 11. Subscriber Contract

> **Receipt of a `DayFrameState` snapshot guarantees only the current cloned runtime
> truth for the session; it does not guarantee that the snapshot was durably
> persisted. Consumers requiring durability must use the mutation result or the
> store's separate durability-status channel.**

Existing state subscription should not be burdened with storage metadata. A
separate status accessor/subscription is warranted only for consumers that need
ongoing durability awareness. Adding that channel is an implementation consequence,
not executable work in Task 1.25.

---

# 12. Persistence Outcome Classification

All Task 1.24 distinctions should survive into the store result:

| Helper outcome | Store semantic class | Retry implication |
| --- | --- | --- |
| `persisted` | Durable checkpoint matches this attempted runtime snapshot | No retry pending for that surface |
| `unavailable` | Session-only mode for this attempt; no storage operation occurred | Retry when storage becomes available or user requests |
| `storageFailure` | Durable operation attempted and failed | Retry may be appropriate without changing runtime state |
| `serializationFailure` | Runtime snapshot could not be encoded; integrity/programming or unsupported-data condition | Do not blindly retry unchanged data; surface distinct diagnostic/recovery path |

The store may expose a higher-level `durable`/`nonDurable` convenience classification
in addition, but must not erase the underlying category needed for correct recovery.
Storage causes such as quota or privacy policy remain unknowable and must not be
invented.

---

# 13. Setup Commit Semantics

`commitAuthoredSetup` remains one atomic runtime transition. On persistence failure:

- the complete new Setup remains current for the session;
- Preview staleness remains part of that runtime transition;
- subscribers receive the new snapshot;
- the result reports `state` plus active persistence outcome;
- active durability status becomes non-durable; and
- the workflow owns truthful user feedback and may initiate retry through the
  store.

“Atomic” continues to mean one coherent in-memory commit and one full-snapshot
persistence attempt, not a transaction spanning memory and browser storage.

---

# 14. Narrow Setter Semantics

All authored field setters share the Setup durability contract because they write
the same complete active snapshot and affect the same authority. Their internal or
test-oriented use does not justify a different semantic model.

They should return `StoreMutationResult` when the contract is implemented. A later
cleanup may reassess whether each setter belongs in the public store API, but
durability should not differ while they exist.

---

# 15. Manual-Event Semantics

Manual-event save/update/delete is an ordinary authored mutation. Runtime continues
on failure, the active surface is marked non-durable, and the mutation result
reports the exact outcome.

Preview regeneration may continue from runtime truth but must not be treated as
evidence of durable success. Workflow feedback should eventually distinguish
“usable this session” from “saved for reload.” Manual-event command ownership beyond
this durability rule remains deferred.

---

# 16. Profile Save Semantics

On profile persistence failure, the newly saved/replaced profile remains visible in
runtime to preserve user work. Profile durability status becomes non-durable and the
result identifies the failure. The old stored collection remains the last durable
profile checkpoint.

Because profiles have a stronger durability promise, the workflow must not describe
the profile as durably saved and should offer retry/recovery once implemented. The
store retains enough surface status to prevent the failure from disappearing when
the immediate dialog/workflow ends.

---

# 17. Profile Delete Semantics

Runtime deletion remains applied after a failed durable deletion. The old durable
profile is a recovery checkpoint and will reappear on reload unless retry succeeds.
The result reports runtime success plus profile persistence failure.

Pending deletion need not be modeled as a per-profile command queue because the
profile writer persists the entire desired runtime collection. Surface-level
non-durable status plus the latest runtime collection is sufficient for retry. Save
and delete therefore share mechanics while retaining different user messaging and
recovery meaning.

---

# 18. Profile Load Semantics

Profile load has three separately reportable facts:

1. source profile selection/normalization succeeded;
2. active runtime replacement succeeded; and
3. active-state persistence produced its factual outcome.

A normal result means the first two succeeded and carries the third. On active
persistence failure, the loaded Setup remains authoritative for the session. The
source profile remains a durable recovery source; active storage remains the last
active checkpoint. The result must not imply that source recoverability equals
active durability.

No profile-storage status changes merely because active persistence failed during
load.

---

# 19. Backup Import Semantics

Backup import likewise distinguishes:

1. file read/validation (currently outside/at store boundary);
2. normalized runtime replacement; and
3. active-state persistence.

Validation failure remains an exception/no runtime transition. A returned mutation
result proves runtime replacement and reports durability separately. On persistence
failure, imported state remains current for the session; the external file remains
the recovery source; reload restores the prior active checkpoint.

The preserved file supports recovery but does not justify hidden failure or the word
“durably imported.”

---

# 20. Clear Aggregation Semantics

Clear remains a deliberate runtime reset even when durable removal is partial. A
rollback would repopulate sensitive/user-requested data in runtime and cannot make
two independent removals atomic. The store returns both removal outcomes and an
aggregate classification:

```ts
type ClearLocalDataResult = {
  state: DayFrameState;
  activeState: PersistenceRemovalOutcome;
  profiles: PersistenceRemovalOutcome;
  durability: "cleared" | "partiallyCleared" | "notCleared";
};
```

`cleared` requires both `removed`. `partiallyCleared` means exactly one was removed.
`notCleared` means neither was confirmed removed, including unavailable/failure
combinations. Exact underlying outcomes remain present.

## Required Clear Matrix

| Active Removal | Profile Removal | Runtime Clear State | Overall Durable Result | Recommended Meaning |
| --- | --- | --- | --- | --- |
| success | success | Fully reset | `cleared` | Both keys confirmed removed |
| success | failure or unavailable | Fully reset | `partiallyCleared` | Active removed; profiles remain/unconfirmed; recovery/retry required |
| failure or unavailable | success | Fully reset | `partiallyCleared` | Profiles removed; active remains/unconfirmed; recovery/retry required |
| failure | failure | Fully reset | `notCleared` | Neither removal confirmed; both exact failures retained |
| unavailable | unavailable | Fully reset for session | `notCleared` | Session-only clear; no durable removal occurred |
| unavailable | failure, or failure | unavailable | Fully reset | `notCleared` | Neither removal confirmed; distinguish exact reasons for guidance |

If both operations return `removed`, success means only that both synchronous API
calls returned, consistent with Task 1.24's precise contract.

---

# 21. Storage-Unavailable Semantics

`unavailable` is a distinct **session-only durability mode for the attempted
surface**, not durable success and not necessarily an application-fatal exception.
DayFrame remains usable with runtime authority, while the result/status must warn
that reload continuity is not established.

It belongs under the broad non-durable class but remains distinct from attempted
storage failure because retry timing and user explanation may differ.

---

# 22. Storage-Accessor Exception Semantics

Future helper work should catch failure to access `globalThis.localStorage` and
normalize it to `storageFailure`. The corresponding valid runtime mutation should
then follow the same session-first rule and be published once.

This intentionally changes today's exceptional/no-notification behavior to align
one storage access failure with other storage failures. It belongs in the future
store-contract implementation with regression tests, not as an isolated helper edit,
because notification semantics change.

Store construction/read behavior should classify accessor failure separately from
“no saved data” in later read/recovery work; this task's immediate contract concerns
mutation outcomes.

---

# 23. Serialization-Failure Semantics

Serialization failure remains distinct. It often indicates a violated supported
state invariant or programmer/data-integrity fault, so automatic retry of unchanged
state is inappropriate.

Runtime remains available for diagnosis/recovery rather than being silently rolled
back. The workflow should not present an ordinary transient-storage message. The
store result preserves `serializationFailure`; diagnostic logging/recovery details
remain a later policy/implementation concern.

---

# 24. Retry Authority

The persistence helper performs one factual attempt and never retries.

The store owns retry execution because it owns the current full runtime snapshot,
surface selection, cloning/serialization, persistence order, and status update. A
workflow or user-facing recovery flow initiates ordinary retry based on context;
the store executes it and returns/records the new outcome. A later successful full
write may intentionally converge all current runtime changes and clear that
surface's non-durable status.

Automatic retry policy, timing, backoff, and lifecycle triggers are deferred. A
later ordinary mutation's success may count as current-snapshot convergence, but it
is not retroactive evidence that each earlier operation individually persisted.

Migration retry belongs to the migration subsystem/store migration boundary under
its version/marker contract, not ordinary workflow retry.

---

# 25. Recovery Authority

The store owns factual recovery context it controls: current runtime state, surface
durability status, last known checkpoint identity/status, and retry operations. It
must not choose user-facing destructive recovery silently.

Workflow/recovery UX owns presenting options and obtaining user choice. Surface-
specific recovery may use:

- current runtime plus retry;
- last active/profile durable checkpoint;
- retained source profile; or
- retained external backup.

UI must not inspect browser storage directly or reinterpret helper outcomes. The
durable-data/migration subsystem owns version conversion and migration recovery,
which is distinct from ordinary write retry.

---

# 26. Migration Interaction

Migration may reuse Task 1.24 persistence outcomes and the store's semantic
classification. A migration write is not complete unless it reports success and
the required version/marker or equivalent durable evidence is confirmed.

Ordinary mutation success proves only one runtime transition. `persisted` proves
only one storage operation returned successfully for that snapshot. Neither proves
that dormant installations, profiles, or external artifacts migrated. Population
migration, version boundaries, idempotence, and recovery evidence remain governed
by the ADR and future migration tasks.

---

# 27. Ownership Map

| Responsibility | Recommended Owner |
| --- | --- |
| Observe browser persistence result | Existing persistence helper boundary |
| Interpret mutation durability | Store |
| Preserve runtime/domain authority | Store |
| Expose mutation result | Store mutation API |
| Retain current surface durability status | Store infrastructure state outside `DayFrameState` |
| Decide user message | Workflow/UI using store semantics |
| Initiate ordinary retry | Workflow/user recovery flow |
| Execute ordinary retry | Store |
| Perform migration retry | Migration subsystem/store migration boundary |
| Choose recovery path | Workflow/recovery UX within ADR policy |
| Aggregate clear result | Store |
| Preserve source profile recovery context | Store/profile boundary; workflow must not discard it on failed active persistence |
| Preserve backup recovery context | Import workflow/user-held source; store reports active durability separately |

---

# 28. ADR Alignment

| ADR concern | Contract alignment |
| --- | --- |
| Explicit failure observability | Operation result and retained surface status prevent hidden failure |
| Non-destructive behavior | Runtime work and last durable checkpoint are preserved; destructive recovery requires explicit choice |
| Last-known recoverable preservation | Stored checkpoint, source profile, and backup source are named recovery roles |
| Retryability | Store owns retry execution from current full snapshot; workflows initiate |
| Deterministic state ownership | Store remains sole runtime mutation authority; UI does not coordinate commit/rollback |
| Migration evidence separation | Ordinary result cannot claim population migration; marker/version evidence remains required |
| Recovery proportional to surface | Active checkpoint, profile source, backup source, and partial clear receive distinct semantics |
| Epistemic integrity | “Runtime applied” and “durably accepted” cannot be collapsed into one success claim |

The hybrid model aligns better than rollback by preserving user context, better than
session-first alone by retaining failure knowledge, and better than workflow commit
by preserving store ownership.

---

# 29. Implementation Consequences

Dependency-ordered consequences for separately authorized work:

1. Introduce narrow store mutation/clear result types based on Task 1.24 outcomes.
2. Capture each helper outcome in existing mutation paths without altering runtime
   assignment or state notification ordering.
3. Add store-owned durability status per active/profile surface outside
   `DayFrameState`, with an accessor and narrowly scoped status subscription if an
   ongoing consumer is required.
4. Normalize storage-accessor exceptions into the write outcome while preserving
   the newly adopted session-first notification contract.
5. Implement store-owned retry entry points using the latest full runtime snapshot
   and update surface status deterministically.
6. Aggregate the two clear results as specified while retaining exact outcomes.
7. Only then align Setup/manual-event/profile/import/clear workflow feedback and
   recovery choices.
8. Address read-failure/reload recovery and migration-specific evidence in separate
   tasks.

The smallest next implementation task should cover steps 1–2 only: mutation results
must expose helper outcomes before adding retained status or UI behavior. This keeps
the change independently testable and prevents broad store/UI redesign.

---

# 30. Unresolved Questions

- Exact naming and module placement of store result/status types.
- Whether ongoing durability status needs a separate subscription immediately or
  can begin with an accessor until a real consumer exists.
- Automatic retry triggers, timing, and backoff.
- User wording and recovery controls for each outcome.
- Whether the store should retain a serialized checkpoint copy in memory; current
  browser storage already serves as checkpoint but read failures complicate access.
- Diagnostic/error-detail retention for serialization failures without exposing raw
  browser exceptions as policy.
- Read-time storage-accessor failure and unsupported local/profile recovery.

These do not block the core mutation contract or the next bounded implementation
seam.

---

# 31. Deviations

None.

---

# 32. Discoveries and Deferred Work

- A two-dimensional result needs no redundant runtime-success discriminator when a
  returned result already means the transition applied.
- Surface-level status is sufficient for full-snapshot persistence; a queue of
  individual mutations is unnecessary for current retry semantics.
- Profile delete can remain session-first because the old durable profile is a
  checkpoint, but its recovery message differs from profile save.
- Clear is not an ordinary write and needs exact per-key plus aggregate outcomes.
- Storage-unavailable is a usable session mode, not success.
- UI feedback, retry implementation, global status display, recovery UX, read
  failure handling, migrations, and compatibility retirement remain deferred.

---

# 33. Recommended Next Task

**Implementation Task 1.26 — Expose Persistence Outcomes Through Store Mutation
Results.**

Scope should be limited to:

- a narrow `{ state, persistence }` result for authored/profile mutations that
  perform one durable write;
- a clear result containing both removal outcomes and the specified aggregate;
- capturing, returning, and testing Task 1.24 helper outcomes;
- preserving runtime assignment, one notification, snapshot content, UI behavior,
  retry absence, and all durable formats.

It should not yet add retained durability status, a new subscription, retry,
workflow feedback, recovery UX, or migration behavior. Those depend on the result
contract being executable first.

---

# 34. Validation

This task changes documentation only. Targeted baseline and repository-standard
validation results are recorded after execution.

```text
npm test -- src/state/tests/dayFrameStore.test.ts \
  src/state/dayFrameProfiles.test.ts \
  src/state/dayFrameBackup.test.ts
  3 files passed; 42 tests passed

npm run lint       passed
npm run typecheck  passed
npm test           22 files passed; 252 tests passed
npm run build      passed; 42 modules transformed
```

The immutable specification, Task 1.24 helper outcomes, production code, tests,
store signatures, subscribers, UI, formats, versions, validators, normalizers, and
compatibility readers were not modified.

---

# 35. Final Completion Determination

Task 1.25 is complete from an architectural-contract standpoint. It defines runtime
authority after failure, durable checkpoint semantics, two-dimensional mutation
results, a runtime-only subscriber guarantee, surface-level durability status
outside `DayFrameState`, retry/recovery ownership, clear aggregation, source-backed
profile/import behavior, accessor/serialization treatment, and migration separation.

The contract is sufficiently bounded to derive the next implementation task without
changing executable behavior in Task 1.25.
