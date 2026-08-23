# CURRENT_STATE.md

# Current State

## Phase 3 — Execution and History Semantic Foundation

**Status:** Phase 3 complete
**Current through:** Task 3.16
**Last reviewed:** 2026-08-22

DayFrame now has a published epistemic and domain boundary between planning and
reality. Preview and PlanDecision remain planning facts. The accepted Phase 3 V1
direction is an independent `ExecutionRecord` surface with immutable correction
revisions, derived current outcomes, lifetime-safe planned linkage, historical
snapshot context, explicit provenance, and unknown-by-default semantics.

Phase 3 now includes operative Preview planning and revisions; durable
HistoricalPlan publications; HistoricalPlan- and Preview-backed execution
reporting; IndexedDB ExecutionHistory with immutable correction/retraction chains;
categorical Outcome Summary reporting; asynchronous readiness; journaled
cross-storage restore; complete Backup V3; and terminal five-authority full clear.
Task 3.15C replaced scheduler-dependent durability checks with deterministic
completion observation, and Task 3.16 independently closed Phase 3 with a green
validation baseline. Historical metrics, adherence scoring, Goals, Progress,
streaks, and learning remain unimplemented and belong to future design work.

Canonical publication:
`docs/checkpoints/CHECKPOINT_Phase_3_COMPLETE.md`.

---

## Phase 2 — Authoritative State and Lifetime-Safe Planning Authority

**Status:** Complete with deferred release work
**Current through:** Task 2.40
**Last reviewed:** 2026-08-20

DayFrame now has explicit source incarnations, Active/Profile/Backup V2 lifetime semantics, lifetime-safe durable occurrence references, independently persisted PlanDecision V1 authority, deterministic replay, explicit Try → Accept, persistent accepted-choice visibility/removal, and decision-aware recommendations.

No Phase 2 correctness defect remains. Backup V3 is required before broader release because Setup Backup V2 does not include PlanDecision or Profile V2 authority. The next architecture-first direction is Phase 3 execution/history semantics; release-readiness work may prioritize Backup V3 first.

Canonical publication: `docs/checkpoints/CHECKPOINT_Phase_2_Complete.md`.

---

## Phase 1 — Architectural Foundation Alignment

**Status:** Complete
**Current through:** Task 1.39
**Last reviewed:** 2026-08-18

Phase 1 has completed the architectural-foundation alignment work required before
DayFrame moves into **Phase 2 — Authority and State Alignment**.

The completed Phase 1 work established canonical ownership for authored Setup and
Preview coordination, removed obsolete singular shift-cycle authority from current
runtime and scheduling pathways, adopted durable-data compatibility governance,
and built a complete session-first durability model spanning persistence outcomes,
retained durability state, user-visible failure awareness, explicit retry, and a
bounded recovery-required contract.

No additional durability implementation is currently required before proceeding
to the next architectural domain.

---

# Phase 1 Closure Focus (Historical)

At the Phase 1 checkpoint, DayFrame had completed **Phase 1 — Architectural Foundation Alignment** through
Task **1.39**.

The immediate project objective is now:

```text
Phase 1 review / checkpoint
        ↓
validated repository checkpoint
        ↓
Phase 2 — Authority and State Alignment
```

Phase 2 should begin with an investigation of:

```text
authoritative state objects
derived-state boundaries
invalidation ownership
replacement semantics
state-transition authority
```

rather than another durability implementation task.

---

# Phase 1 Executive Result

Phase 1 established four major architectural foundations.

## 1. Transaction and Workflow Ownership

Authored Setup now commits through one store-owned atomic transition:

```text
DayFrameApp.saveCurrentSetup
        ↓
commitAuthoredSetup
        ↓
one complete authored transition
        ↓
stale once
persist once
notify once
```

Preview coordination has one supported application path:

```text
DayFrameApp
    ↓
PreviewScreen
```

The obsolete alternate Preview container/path was removed.

---

## 2. Canonical Shift-Cycle Authority

Current DayFrame architecture uses:

```text
shiftCycles
```

through all current authored, runtime, store, and scheduling pathways.

The final boundary is:

```text
RAW HISTORICAL INPUT
    shiftCycle accepted
          ↓
boundary-specific validation / normalization
          ↓
NORMALIZED AUTHORED DATA
    shiftCycles only
          ↓
CURRENT RUNTIME
    shiftCycles only
          ↓
STORE / CORE SCHEDULING
    shiftCycles only
```

Singular `shiftCycle` survives only at raw historical-data ingress where older
repository-produced data may still require it.

---

## 3. Durable-Data Governance

DayFrame now has an accepted durable-data compatibility and independent
format-versioning policy:

`ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

DayFrame treats durable authored data it writes or exports as user data.

Historical representations must be handled through explicit:

* compatibility;
* migration;
* conversion;
* recovery;
* or explicit unsupported-format behavior;

rather than silent degradation.

Local persistence, profile storage, and backup formats are independently
versioned.

A durable format version represents a compatibility contract rather than a frozen
serialized layout.

In-memory normalization does not constitute completed migration.

Compatibility-reader retirement requires explicit architectural authorization and
surface-appropriate migration or recovery evidence.

---

## 4. Session-First Durability Architecture

Tasks 1.23–1.39 established a complete ordinary durability lifecycle:

```text
runtime mutation
    ↓
factual persistence outcome
    ↓
store-owned durability interpretation
    ↓
mutation-result observability
    ↓
retained durability status
    ↓
desired durable condition
    ↓
explicit store-owned retry
    ↓
reactive durability subscription
    ↓
shared semantic classification
    ↓
immediate workflow feedback
    ↓
persistent app-level awareness
    ↓
explicit user-triggered Retry
    ↓
recovery-required boundary
    ↓
session-loss risk communication
```

Runtime/domain success and durable success are no longer treated as the same fact.

---

# Architecture Status

| Area                                    | Status        |
| --------------------------------------- | ------------- |
| Architecture Specification              | ✅ Published   |
| Architecture Charter                    | ✅ Published   |
| Architectural Decisions                 | ✅ Published   |
| Canonical Terminology                   | ✅ Published   |
| Architecture Governance                 | ✅ Established |
| Durable-Data Compatibility ADR          | ✅ Accepted    |
| Phase 1 Foundation Alignment            | ✅ Complete    |
| Phase 2 — Authority and State Alignment | ⏭ Next        |

---

# Audit and Alignment Status

| Area                          | Status     |
| ----------------------------- | ---------- |
| Architecture Alignment Audit  | ✅ Complete |
| Architecture Audit Synthesis  | ✅ Complete |
| UX Audit                      | ✅ Complete |
| UX Audit Synthesis            | ✅ Complete |
| Alignment Strategy            | ✅ Complete |
| Implementation Roadmap        | ✅ Complete |
| Implementation Execution Plan | ✅ Complete |

---

# Implementation Status

| Area                                                        | Status     |
| ----------------------------------------------------------- | ---------- |
| Implementation Planning                                     | ✅ Complete |
| Tasks 1.1–1.4 — Initial ownership/obsolete-path alignment   | ✅ Complete |
| Tasks 1.5–1.20 — `shiftCycle` compatibility alignment       | ✅ Complete |
| Tasks 1.21–1.22 — Durable-data governance                   | ✅ Complete |
| Tasks 1.23–1.39 — Durability behavior and recovery boundary | ✅ Complete |
| Phase 1 — Architectural Foundation Alignment                | ✅ Complete |
| Phase 1 Project Review / Checkpoint                         | ⏳ Next     |
| Phase 2 — Authority and State Alignment                     | ⏭ Next     |

---

# Completed Phase 1 Sequence

## Tasks 1.1–1.4 — Initial Foundation Alignment

The first Phase 1 cluster:

* established the foundational ownership map;
* identified authored Setup transaction ownership as distributed;
* introduced one atomic store-owned authored Setup commit;
* investigated `PreviewScreenContainer`;
* classified it as obsolete;
* removed the obsolete Preview path;
* preserved supported `DayFrameApp → PreviewScreen` behavior.

The resulting authored Setup path is:

```text
DayFrameApp.saveCurrentSetup
        ↓
commitAuthoredSetup
        ↓
one store-owned authored transition
```

The resulting Preview coordination path is:

```text
DayFrameApp
    ↓
PreviewScreen
```

---

# Tasks 1.5–1.20 — Legacy `shiftCycle` Alignment

Tasks 1.5–1.20 completed a staged investigation and retirement of the old singular
shift-cycle representation from current architectural authority.

The work deliberately separated:

```text
historical compatibility
```

from:

```text
current architectural authority
```

rather than deleting singular support indiscriminately.

## Writer Alignment

Current local-storage, profile, and backup writers now emit plural:

```text
shiftCycles
```

only.

Historical readers continue accepting singular:

```text
shiftCycle
```

where repository-produced historical data requires it.

## Runtime Alignment

Removed:

* `DayFrameState.shiftCycle`;
* singular runtime mirror synthesis;
* singular store-initialization fallback;
* `setShiftCycle`.

Current runtime uses:

```text
DayFrameState.shiftCycles
```

only.

## Core Scheduling Alignment

Removed obsolete singular collection aliases from:

* `generateBlockCandidates`;
* `getActiveShiftSegment`;
* `generateCycleWorkBlocks`;
* `generateSchedulePreview`.

The supported scheduling path is now:

```text
DayFrameState.shiftCycles
        ↓
generateSchedulePreview({ shiftCycles })
        ├── generateCycleWorkBlocks({ shiftCycles })
        └── generateBlockCandidates({ shiftCycles })

effective preference resolution
        └── getActiveShiftSegment({ shiftCycles })
```

## Normalized Authored Data

Removed obsolete:

```text
DayFrameAuthoredSetup.shiftCycle
```

`DayFrameAuthoredSetup` is plural-only.

---

# Task 1.20 — Compatibility Horizon

Task 1.20 established that no current evidence justifies retiring the remaining
raw singular readers.

The reader classifications are:

## Local Authored State

**Retain Until Explicit Criteria Are Met**

Legacy local state can converge to plural-only persistence, but migration remains
lazy and unobservable at the population level.

## Saved Profiles

**Retain Until Explicit Criteria Are Met**

Legacy profiles normalize in memory, but loading a profile does not rewrite the
source profile collection.

## V1 Backups

**Retain Indefinitely for Now**

Historical backup files are externally held and cannot be automatically rewritten
or globally detected.

No finite retirement horizon is currently defensible.

---

# Tasks 1.21–1.22 — Durable-Data Governance

Task 1.21 investigated DayFrame's durable-data compatibility and format-versioning
requirements.

Task 1.22 adopted the resulting policy through:

`ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

The adopted surface commitments are:

| Surface            | Commitment                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Active local state | Bounded backward compatibility with eager or durably observable migration before historical-reader retirement |
| Saved profiles     | Strong bounded compatibility, atomic migration, preservation of unconvertible entries, explicit recovery      |
| Backup files       | Long-lived versioned direct import plus continued conversion/recovery support before direct-reader retirement |

The ADR also establishes that:

* formats are independently versioned;
* incompatible semantic or representation changes require a new version or
  migration epoch;
* unsupported historical data must not silently degrade;
* pre-public-release repository-produced data receives the normal compatibility
  presumption unless explicitly excluded;
* compatibility retirement requires explicit architectural authorization.

---

# Existing V1 Compatibility

Existing V1 representations remain intentionally supported:

```text
dayframe-store-v1
    historical singular + current plural family

profile version 1
    historical singular + current plural family

backup version 1
    historical singular + current plural family
```

These V1 identifiers span multiple writer generations and therefore cannot
themselves distinguish singular from plural historical data.

Current writers remain plural-only.

---

# Tasks 1.23–1.27 — Persistence Outcomes and Retained Durability

This sequence established factual persistence reporting and store-owned durability
knowledge.

## Persistence Outcomes

Persistence helpers now distinguish factual outcomes including:

```text
persisted
removed
unavailable
storageFailure
serializationFailure
```

as applicable to the operation.

Runtime mutations remain session-first:

```text
valid runtime mutation
    ↓
runtime state applied
    ↓
persistence attempted
    ↓
durability outcome reported
```

A persistence failure does not roll back a valid runtime transition.

## Store Mutation Results

Persisting store operations expose their persistence result to the initiating
workflow.

Runtime/domain success and persistence success are therefore independently
observable.

## Retained Durability

The store retains per-surface durability outside `DayFrameState`.

Current durability vocabulary is:

```text
unknown
durable
unavailable
storageFailure
serializationFailure
```

for:

```text
activeState
profiles
```

`unknown` is not treated as failure.

Durability status is infrastructure truth, not domain state.

---

# Task 1.28 — Retry Semantics and Authority

Task 1.28 established the governing retry rule:

> Retry attempts again to establish the store's current desired durable condition.

Rejected models included:

* replaying the original failed mutation;
* replaying a last-failed snapshot;
* workflow command replay;
* persistence-operation queues.

The authoritative retry source is:

```text
current desired durable condition
```

with:

```text
snapshot
```

meaning the latest complete current representation, and:

```text
absent
```

meaning durable key absence after clear.

Retry initiation belongs to user/workflow interaction.

Retry execution and interpretation belong to the store.

---

# Task 1.29 — Desired Durable Condition

The store now privately retains per-surface desired durable condition:

```text
snapshot
absent
```

outside `DayFrameState`.

Ordinary persistence establishes:

```text
snapshot
```

intent.

Clear establishes:

```text
absent
```

intent.

This distinction allows failed clear operations to be retried safely without
mistaking reset runtime defaults for data that should be persisted.

---

# Task 1.30 — Persistence Accessor Failure Normalization

Throwing `globalThis.localStorage` access during writes/removals is normalized to:

```text
storageFailure
```

through the existing persistence outcome model.

This allows ordinary mutations and clear to complete their established
session-first path instead of allowing accessor exceptions to escape.

Read/hydration accessor behavior remains a separately deferred lifecycle concern.

---

# Task 1.31 — Explicit Store-Owned Retry

The store exposes explicit surface-specific retry:

```text
retryActivePersistence()
retryProfilePersistence()
```

Retry eligibility is:

| Durability Status      | Ordinary Retry |
| ---------------------- | -------------- |
| `storageFailure`       | Yes            |
| `unavailable`          | Yes            |
| `serializationFailure` | No             |
| `durable`              | No             |
| `unknown`              | No             |

Snapshot retry uses the latest complete current representation.

Absence retry repeats removal.

Retry:

* changes no `DayFrameState`;
* sends no ordinary state notification;
* updates only retained durability;
* returns an exact discriminated result.

---

# Task 1.32 — Workflow Durability Feedback Contract

Task 1.32 adopted:

```text
immediate contextual feedback
        +
persistent app-level durability awareness
```

Immediate mutation results answer:

> What happened during this operation?

Retained durability answers:

> Does this durable surface still need attention?

The investigation established a real need for a separate reactive durability
subscription because retry may change durability without changing
`DayFrameState`.

---

# Task 1.33 — Durability Subscription

`DayFrameStore` now exposes a separate retained-durability subscription.

Conceptually:

```text
getState()
subscribe()
    → runtime/domain truth

getDurabilityStatus()
subscribeDurability()
    → retained durability truth
```

A logical store operation emits at most one durability notification and emits none
when the final retained durability snapshot is unchanged.

Clear batches active/profile durability into one final notification.

Retry can produce a durability notification while ordinary `DayFrameState`
subscribers remain silent.

---

# Task 1.34 — Shared Durability Semantic Classification

A pure shared classification layer translates factual persistence/store outcomes
into workflow meaning.

Current semantic vocabulary is:

```text
durableSuccess
retryableUnavailable
retryableStorageFailure
recoveryRequired
internalNoOp
```

Key mappings include:

```text
unavailable
    → retryableUnavailable

storageFailure
    → retryableStorageFailure

serializationFailure
    → recoveryRequired

unknown
    → internalNoOp

alreadyDurable retry
    → durableSuccess
```

The classifier:

* contains no React;
* contains no product copy;
* performs no persistence;
* executes no retry;
* performs no store mutation.

Clear classification preserves aggregate and independent active/profile semantics.

---

# Task 1.35 — Immediate Workflow Durability Feedback

Every user-facing persisting workflow now consumes the shared semantic classifier.

Covered workflows include:

* Setup save;
* manual-event create/edit/delete;
* profile save;
* profile delete;
* profile load;
* backup import;
* clear local data.

Current workflow behavior can represent:

```text
runtime change succeeded
+
durability failed
```

without rolling back session state or falsely claiming durable success.

Immediate feedback remains workflow-local and may disappear with workflow
navigation.

---

# Task 1.36 — Persistent App-Level Durability Awareness

DayFrame now has one shell-level persistent durability-awareness surface.

It initializes from:

```text
getDurabilityStatus()
```

and updates through:

```text
subscribeDurability()
```

Active-state and profile durability are represented independently.

Persistent behavior is:

```text
unknown
    → silent

durable
    → silent

unavailable
    → persistent retryable awareness

storageFailure
    → persistent retryable awareness

serializationFailure
    → persistent recovery-required awareness
```

The surface survives in-app workflow navigation and clears automatically when the
retained durability surface converges to `durable`.

---

# Task 1.37 — Explicit User-Triggered Durability Retry

Persistent retryable awareness now exposes independent controls for:

```text
active state
profiles
```

Retry appears only for:

```text
retryableUnavailable
retryableStorageFailure
```

No Retry appears for:

```text
recoveryRequired
durableSuccess
internalNoOp
```

The controls invoke only:

```text
retryActivePersistence()
retryProfilePersistence()
```

They do not replay Setup saves, profile mutations, clear, or other originating
workflow commands.

Partial-clear failure can therefore be repaired through the correct store-owned
absence retry without exposing `snapshot | absent` to the UI.

---

# Task 1.38 — Serialization-Failure Recovery Boundary

Task 1.38 investigated what `recoveryRequired` should mean.

The principal finding was that no supported production UI path was found that
naturally creates unserializable authored data.

Current concrete serialization-failure tests deliberately inject invalid
programmatic runtime values.

The condition is therefore primarily a defensive integrity boundary in the
current implementation.

The investigation nevertheless established stable recovery principles.

## Runtime Preservation

After serialization failure:

```text
latest session intent
    → remains active in memory
```

## Durable Checkpoint Preservation

Serialization occurs before durable replacement.

Therefore:

```text
serialization failure
    ↓
no successful durable write
    ↓
previous durable representation remains untouched
```

## Recovery Boundary

Ordinary unchanged Retry is inappropriate.

A later ordinary mutation that changes the representation may serialize
successfully and naturally restore durability.

Automatic rollback, reset, reload, or schema-specific repair is not adopted.

## Future-Model Deferral

Current-model-specific work intentionally deferred includes:

* field-level repair;
* entity-specific serialization diagnostics;
* shift/template/recurrence-specific repair UI;
* invalid-profile surgery;
* schema-specific recovery tooling.

Those areas are expected to couple strongly to the later authored-data and engine
redesign.

---

# Task 1.39 — Recovery-Required Session-Risk Communication

Persistent recovery-required awareness now explicitly communicates:

* current session changes remain available;
* those changes are not durably saved;
* ordinary Retry is unavailable;
* reloading DayFrame may discard those changes;
* closing DayFrame may discard those changes;
* older saved data may return.

No:

* recovery control;
* rollback;
* reset;
* backup-export promise;
* unload interception;
* navigation blocking;
* model-specific repair

was introduced.

Task 1.39 completed the minimum Phase 1 serialization-recovery obligation.

---

# Current Durability Architecture

The current operational durability path is:

```text
USER ACTION
    ↓
STORE-OWNED RUNTIME MUTATION
    ↓
CURRENT SESSION STATE APPLIED
    ↓
PERSISTENCE ATTEMPT
    ↓
FACTUAL OUTCOME
    ├── persisted / removed
    ├── unavailable
    ├── storageFailure
    └── serializationFailure
    ↓
RETAINED DURABILITY STATUS
    ↓
SHARED WORKFLOW SEMANTICS
    ├── durableSuccess
    ├── retryableUnavailable
    ├── retryableStorageFailure
    └── recoveryRequired
    ↓
IMMEDIATE CONTEXTUAL FEEDBACK
    +
PERSISTENT APP-LEVEL AWARENESS
    ↓
USER RETRY when eligible
    ↓
STORE-OWNED RETRY
    ↓
RETAINED STATUS CONVERGENCE
```

The current architecture deliberately separates:

```text
DayFrameState
    = current runtime/domain truth

StoreDurabilityStatus
    = current durability knowledge

StoreDesiredDurableCondition
    = retry-routing intent

DurabilitySemanticCategory
    = workflow interpretation
```

None is treated as interchangeable with the others.

---

# Session-First Authority

The current durability model follows:

> A valid runtime transition remains authoritative for the current session even if
> durable persistence fails.

Persistence failure therefore does not:

* roll back runtime state;
* suppress a valid mutation;
* reload older data;
* regenerate domain state;
* pretend the mutation itself failed.

Instead, DayFrame records and communicates the durability discrepancy.

---

# Retry Authority

The current retry rule is:

```text
current desired durable condition
    ↓
snapshot
    → persist latest current representation

absent
    → remove durable key
```

Retry does not preserve or replay historical failed commands.

This means newer runtime intent supersedes older failed persistence attempts.

---

# Recovery Boundary

Current ordinary retry covers:

```text
unavailable
storageFailure
```

Current recovery-required classification covers:

```text
serializationFailure
```

No model-specific recovery machinery is currently justified.

The minimum safety boundary is:

```text
preserve current runtime intent
preserve prior durable representation
communicate session-end risk
allow continued editing
never automatically discard or roll back
```

---

# Durable / Derived Data Boundary

The current durability work protects authored/recovery-relevant state rather than
treating all runtime data as durable authority.

This principle is expected to become more important during future engine
alignment:

```text
USER-AUTHORED / RECOVERY-RELEVANT STATE
    → preserve / migrate / recover

RECOMPUTABLE ENGINE OUTPUT
    → derived
    → invalidate / regenerate
```

The exact authored-data boundary remains a Phase 2 authority question.

---

# Existing V1 Reader Status

The remaining raw singular compatibility readers remain unchanged.

## Local State

**Retain Until Explicit Criteria Are Met**

## Saved Profiles

**Retain Until Explicit Criteria Are Met**

## V1 Backups

**Retain Indefinitely for Now**

The accepted durable-data ADR governs their future treatment.

No Task 1.23–1.39 durability work authorized reader retirement.

---

# Validation Status

Current validated baseline after Task 1.39:

* `npm run lint` — passed
* `npm run typecheck` — passed
* `npm test` — passed
* `npm run build` — passed
* affected-scope `git diff --check` — passed

Current automated baseline:

**23 test files / 366 tests passing**

The current suite protects:

* historical singular local/profile/backup compatibility;
* plural current runtime/core authority;
* persistence outcomes;
* mutation-result semantics;
* retained durability;
* desired durable condition;
* storage-accessor normalization;
* store-owned retry;
* durability subscriptions;
* semantic classification;
* immediate workflow feedback;
* persistent cross-navigation awareness;
* explicit user-triggered Retry;
* partial-clear retry;
* recovery-required suppression of Retry;
* session-end risk communication.

Repository-wide `git diff --check` continues to identify pre-existing whitespace in
architecture documentation outside the executable task scopes. That cleanup should
be performed when those documents are intentionally edited rather than folded into
an unrelated implementation task.

---

# Phase 1 Completion Assessment

Phase 1 has completed the architectural foundation work currently required by the
accepted execution sequence.

Completed foundation areas include:

## Transaction Ownership

```text
Setup save
    ↓
one store-owned authored transaction
```

## Preview Coordination

```text
DayFrameApp
    ↓
PreviewScreen
```

## Shift-Cycle Authority

```text
historical raw input
    → normalization
    → shiftCycles-only current architecture
```

## Durable-Data Governance

```text
user data
    ↓
explicit compatibility/versioning policy
```

## Durability Authority

```text
runtime truth
≠
durability truth
≠
retry intent
≠
workflow semantics
```

## Failure / Retry / Recovery Boundary

```text
transient persistence failure
    → explicit Retry

representation failure
    → recoveryRequired
    → preserve + communicate
```

No additional Phase 1 durability implementation is required before proceeding.

---

# Remaining Architectural Findings

Earlier Phase 1 audits identified additional concerns including:

* manual-event command ownership;
* feedback aggregation;
* focus and continuity ownership;
* duplicated date-conversion helpers;
* seeded-store purpose.

Some of these findings may now be superseded or reframed by the completed Phase 1
architecture.

They should not automatically become implementation tasks.

Phase 2 should re-evaluate them through the broader authority/state model rather
than continuing the original finding list mechanically.

Persistence-failure authority is no longer an unresolved finding; Tasks 1.23–1.39
established that authority comprehensively.

---

# Phase 2 — Authority and State Alignment

## Status

**Next architectural domain**

Phase 2 should begin with investigation rather than mutation.

The first investigation should establish the current and intended boundaries for:

### Authoritative State

Which state objects represent primary truth?

### Derived State

Which values can always be recreated from authoritative inputs?

### Invalidation

Which layer decides that derived information is stale?

### Replacement

What exactly happens when authored state is replaced through:

* profile load;
* backup import;
* future recovery;
* other replacement operations?

### Ownership

Which layer is authorized to perform each transition?

---

# Recommended Phase 2 Opening Question

The next question is:

> **What current DayFrame state is authoritative, what is derived, and which layer
> owns invalidation and replacement of each?**

This investigation should precede substantial scheduling-engine restructuring.

The goal is to establish a stable state authority model before later engine work
changes the shape or volume of derived data.

---

# Why Phase 2 Precedes Engine Redesign

Future DayFrame architecture is expected to contain richer authored concepts and
significantly more derived scheduling information.

A likely conceptual boundary is:

```text
AUTHORED INTENT
    Commitments
    Goals
    Priorities
    Constraints
        ↓
SCHEDULING / ALLOCATION ENGINE
        ↓
DERIVED OUTPUT
    Schedule
    Capacity
    Allocations
    Recommendations
    Friction
    Projections
```

The exact implementation remains future work.

Phase 2 must establish the authority rules before those concepts are implemented.

The durability foundation created in Phase 1 should remain largely independent of
that engine transformation because it protects authoritative authored/recovery
state rather than current engine internals.

---

# Documentation Governance

The following rules remain active.

## Current-State Documentation

Current implementation documents describe the architecture as it exists now.

## Historical Documentation

Audits, task results, checkpoints, and archived documents preserve the state that
existed when they were created.

Historical references to removed structures remain valid historical evidence.

---

# Task Artifact Governance

Task specifications remain immutable once execution begins.

Execution outcomes are recorded separately:

```text
TASK_X.Y_NAME.md
TASK_X.Y_NAME_RESULT.md
```

Pre-execution artifact integrity must be verified before work begins.

A finding does not itself authorize implementation.

Investigation and implementation remain separate where uncertainty warrants it.

Task-specific checkpoints are created only when explicitly authorized.

---

# Execution Model

Implementation continues according to:

```text
Investigate / Review
        ↓
Authorize
        ↓
Implement
        ↓
Validate
        ↓
Document
        ↓
Checkpoint
        ↓
Commit
```

Architecture governs implementation.

---

# Governing Principles

Implementation should preserve:

* Determinism
* Explainability
* Information Provenance
* Epistemic Integrity
* Explicit Authority
* Historical Immutability
* Architectural Traceability
* Continuous Validation
* Documentation Integrity
* Forward Migration Safety
* User Data Preservation
* Session-First Runtime Authority
* Separation of Authoritative and Derived State

When evidence is insufficient, DayFrame should preserve uncertainty rather than
invent certainty.

---

# Immediate Next Steps

1. Complete the Phase 1 project review.
2. Update governance documentation reflecting Tasks 1.23–1.39 where appropriate.
3. Create the Phase 1 / session checkpoint.
4. Resolve the known architecture-document whitespace while those files are
   intentionally in scope.
5. Commit and push the validated Phase 1 baseline.
6. Begin **Phase 2 — Authority and State Alignment** with an investigation of
   authoritative state, derived state, invalidation, and replacement ownership.
7. Do not extend the durability sequence unless a concrete future architectural
   dependency requires it.

---

# Canonical Documents

## Architecture

* `DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION.md`
* `ARCHITECTURE_CHARTER.md`
* `DECISIONS.md`
* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

## Audit

* `Implementation_Architecture_Audit.md`
* `Implementation_Architecture_Audit_Synthesis.md`
* `Implementation_UX_Audit.md`
* `Implementation_UX_Audit_Synthesis.md`

## Planning

* `Alignment_Strategy.md`
* `Implementation_Roadmap.md`
* `Implementation_Execution_Plan.md`

## Implementation

* Phase 1 Task Specifications
* Phase 1 Task Result Artifacts

## Governance

* `CURRENT_STATE.md`
* `CHANGELOG.md`
* Session Checkpoints
* Phase Checkpoints
* Architectural Decision Records

---

# Open Questions

## Phase 2 State Authority

Which current state structures own primary truth?

Which values are derived?

Which derived values should never be durable authority?

Who owns invalidation?

What constitutes replacement rather than mutation?

What must survive a replacement operation?

How should Preview and later scheduling-engine output relate to authored state?

---

## Future Durable Formats

Future authored-model changes may require:

* new local persistence versions;
* profile migration epochs;
* new backup versions;
* conversion tooling.

Those decisions remain governed by the accepted durable-data ADR and should be made
when the future authored model is sufficiently defined.

---

## Serialization Recovery

Current model-specific serialization repair remains intentionally deferred.

If future authored data makes representation failure realistically reachable,
DayFrame should revisit:

* diagnostics;
* defensive export;
* repair tooling;
* recovery surfaces;

against the then-current authored architecture.

---

# Phase 1 Determination (Historical)

DayFrame has completed Tasks **1.1 through 1.39** of
**Phase 1 — Architectural Foundation Alignment**.

The phase has produced coherent foundations for:

```text
transaction ownership
Preview coordination
canonical shift-cycle authority
durable-data governance
persistence outcome authority
retained durability
explicit retry
reactive durability observation
workflow durability semantics
persistent user awareness
recovery-required safety
```

The durability sequence is intentionally complete for now.

Current executable validation is:

```text
23 test files
366 tests passing
lint passing
typecheck passing
build passing
```

The current execution boundary is:

```text
PHASE 1
Architectural Foundation Alignment
        ↓
PROJECT REVIEW / CHECKPOINT
        ↓
PHASE 2
Authority and State Alignment
```

The next implementation work should not extend durability merely for additional
completeness.

The next task should establish **which DayFrame state is authoritative, which is
derived, and who owns invalidation and replacement** before substantial engine
restructuring begins.

---

# Phase 3 Progress-Derivation Boundary

ExecutionHistory V1 now supplies explicit categorical evidence, but DayFrame has
no production progress, adherence, completion-rate, Goal, streak, or learning
derivation. Current Preview Summary content remains planning/friction metadata.

The accepted Task 3.7 boundary is:

```text
ExecutionHistory -> reported-evidence categorical summary
fresh Preview + ExecutionHistory -> volatile current-Preview reporting coverage
durable historical plan ledger -> required for historical plan follow-through
explicit Goal domain -> required for Goal progress
```

Partial receives no arbitrary fractional credit. Not reported remains uncertainty.
No scalar completion/adherence score is authorized. Derived values are
non-authoritative and non-durable by default.

**Evidence:** `CHECKPOINT_Phase_3_Progress_And_Adherence_Semantics.md`, Task 3.7.

## Historical Plan Authority Readiness (Historical; superseded by Tasks 3.11–3.12)

Task 3.9 determined that historical reporting denominators require an independent
HistoricalPlanSurface. Current Preview, PlanDecision, and ExecutionHistory cannot
reconstruct never-reported past planned occurrences.

The accepted V1 model is append-only complete user-day publications grouped by an
atomic fresh-Preview generation batch. Stale/Try Preview never publishes;
identical day plans deduplicate; later publications supersede operative day
authority without deleting revisions. Missing ledger coverage remains unknown.

At Task 3.9, implementation was not yet authorized because collection scale,
atomic batch writes, and indexed range/as-of queries exceeded the bounded
localStorage prototype.
The next prerequisite is a transactional Phase 3 collection storage foundation,
preferably IndexedDB and shared with long-lived ExecutionHistory.

**Evidence:** `CHECKPOINT_Phase_3_Historical_Plan_Ledger_Semantics.md`, Task 3.9.

## Durable Collection Storage Foundation (Historical Task 3.10 state)

Task 3.10 implemented a domain-neutral native IndexedDB infrastructure boundary
with additive schema upgrades, lazy/injected opening, commit-aware atomic
multi-store mutations, indexed bounded queries, structured-clone isolation,
connection/versionchange handling, and normalized expected failures.

At Task 3.10, no production object store or consumer existed yet. Active,
Profiles, PlanDecision, and ExecutionHistory remained on localStorage. The
transition was intentional:
HistoricalPlan pure domain comes next, then its IndexedDB persistence;
ExecutionHistory migration follows under a separate anti-resurrection contract
before Backup V3 and broader release.

**Evidence:** `CHECKPOINT_Phase_3_Durable_Collection_Storage_Foundation.md`, Task 3.10.

## Durable Cross-Storage Restore Foundation (Historical prerequisite chronology)

Task 3.14A provided an interruption-safe, domain-format-neutral authority replacement transaction across Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan. A strict startup journal, verified target/recovery staging, source recheck, atomic two-participant IndexedDB replacement, verified local writes, anti-resurrection preservation, deterministic roll-forward/rollback, and coherent runtime installation are executable. Store bootstrap recovery precedes ordinary authority initialization. Backup V3 was not yet implemented at this historical point; Task 3.14 subsequently completed it.

**Evidence:** `CHECKPOINT_Phase_3_Durable_Cross_Storage_Restore_Foundation.md`, Task 3.14A.

Task 3.14A.2 corrected the concrete restore seam: durable payloads no longer masquerade as private runtime snapshots. Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan each reconstruct settled runtime authority from verified durable evidence, and one store-owned coordinator is available before readiness for deterministic interrupted recovery. Backup V3 remained pending at that point and is now implemented by Task 3.14.

## Complete Backup V3

Task 3.14 provides strict complete-authority Backup V3 export/import across Active, Profiles, PlanDecision, ExecutionHistory quarantine/revisions, and HistoricalPlan. Standard UI export is V3; V1/V2 imports retain prior semantics. V3 is canonical, clone-isolated, JSON-safe, fingerprinted independently of `exportedAt`, blocks whole protected surfaces, includes accepted pending authority, clears Preview, and delegates transaction/recovery to Task 3.14A. No cloud, sync, metrics, Goals, or learning capability is implied.

## HistoricalPlan-Backed Execution Reporting Reachability

Task 3.15A makes current effective HistoricalPlan day authority a production reporting source. A bounded date-selected UI converts each stored scheduled, unplaced, omitted, or blocked occurrence directly into the existing historical execution target using its exact durable reference, frozen title/category/plan, and published user-day context. It does not consult current Active/Profile/Preview authority, publish or mutate HistoricalPlan, or introduce historical metrics. Preview-backed reporting remains unchanged and both paths converge on the existing ExecutionHistory workflow.

## Five-Authority Full Clear

Task 3.15B makes full clear an asynchronous terminal authority operation. Its canonical enumerable result covers Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan; Preview is separately guaranteed cleared. ExecutionHistory replaces established IndexedDB authority with verified empty established authority while retaining its anti-resurrection marker, and HistoricalPlan settles an empty ledger. Mixed terminal outcomes are partial; pending IndexedDB work is never reported as partial. Restore/authority transactions continue to block concurrent mutation. P3-GAP-002 is closed; Task 3.15C completed validation stabilization and governance reconciliation, leaving only Task 3.16 closure audit.
