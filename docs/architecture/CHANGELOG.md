# CHANGELOG.md

# Changelog

This document records significant architectural, planning, governance, and
implementation milestones for the DayFrame project.

Editorial changes, test-fixture maintenance, and documentation corrections that do
not materially affect architecture, implementation strategy, product behavior, or
project governance are omitted.

Historical task specifications and result artifacts remain the detailed execution
record.

---

# 2026-08-20 — Phase 2 Lifetime-Safe Planning Authority Complete

DayFrame completed Phase 2 through Task 2.40. The implementation now carries explicit source lifetimes across Active/Profile/Backup V2 boundaries, supports lifetime-safe durable occurrence references and independently persisted PlanDecision V1 authority, replays accepted intent deterministically, and provides explicit Try/Accept, persistent visibility/removal, and decision-aware recommendations.

Phase 2 closes with Backup V3 tracked as a prerequisite before broader release, not as an architectural closure blocker. The canonical evidence is `CHECKPOINT_Phase_2_Complete.md`.

---

# 2026-08-18 — Phase 1 Architectural Foundation Alignment Complete

DayFrame completed **Phase 1 — Architectural Foundation Alignment** through
Task **1.39**.

Phase 1 established foundational ownership, removed obsolete competing
representations and workflow paths, adopted durable-data compatibility governance,
and implemented a complete session-first durability model from factual persistence
outcomes through user-visible retry and recovery-risk communication.

The project is ready to proceed to:

**Phase 2 — Authority and State Alignment**

following Phase 1 review, documentation synchronization, checkpoint, and
publication.

## Architectural result

Phase 1 established clear separation among:

```text
runtime/domain truth
durability truth
durable intent
workflow semantics
derived scheduling output
```

The completed phase provides a stable foundation for later substantial authored
state and scheduling-engine alignment.

---

# 2026-08-18 — Durability Alignment Sequence Complete

Tasks 1.23–1.39 established DayFrame's current durability architecture.

## Added — Factual persistence outcomes

Persistence operations now report factual results rather than relying on implicit
success assumptions.

Current outcome vocabulary distinguishes, as applicable:

```text
persisted
removed
unavailable
storageFailure
serializationFailure
```

A valid runtime mutation remains authoritative for the current session even when
durable persistence fails.

Persistence failure therefore does not automatically roll back accepted runtime
state.

## Added — Mutation-level durability observability

Persisting store operations return their persistence result to the initiating
workflow.

Runtime success and durable success are now independently observable facts.

## Added — Retained durability state

The store now retains independent durability knowledge for:

```text
activeState
profiles
```

outside `DayFrameState`.

Current retained durability vocabulary is:

```text
unknown
durable
unavailable
storageFailure
serializationFailure
```

`unknown` represents absence of an established durability fact and is not treated
as failure.

## Added — Desired durable condition

The store privately retains the current intended durable condition for each
surface:

```text
snapshot
absent
```

Ordinary persistence establishes snapshot intent.

Clear establishes absence intent.

This distinction allows failed clear operations to be retried correctly without
persisting reset runtime defaults merely because runtime state is currently empty
or defaulted.

## Changed — Persistence accessor failures

Throwing `globalThis.localStorage` access during write/removal operations is now
normalized into the existing:

```text
storageFailure
```

outcome.

Valid runtime transitions continue through the established session-first path even
when storage acquisition itself fails.

Read/hydration accessor failure remains a separately deferred lifecycle concern.

## Added — Explicit store-owned retry

The store now exposes surface-specific explicit durability retry:

```text
retryActivePersistence()
retryProfilePersistence()
```

Retry is permitted for:

```text
unavailable
storageFailure
```

and is not blindly attempted for:

```text
serializationFailure
durable
unknown
```

Retry establishes the **current desired durable condition**, not a historical
failed operation.

For snapshot intent, retry persists the latest complete current representation.

For absence intent, retry repeats removal.

Retry changes no `DayFrameState` and sends no ordinary runtime-state notification.

## Added — Reactive durability subscription

DayFrameStore now exposes a dedicated retained-durability subscription separate
from the ordinary runtime-state subscription.

Conceptually:

```text
getState()
subscribe()
    → runtime/domain state

getDurabilityStatus()
subscribeDurability()
    → retained durability state
```

A logical store operation emits at most one durability notification and emits none
when its final retained durability snapshot is unchanged.

This allows explicit retry to update durability-aware UI without falsely implying a
runtime/domain-state transition.

## Added — Shared durability semantic classification

A pure shared semantic layer now translates factual persistence and retry outcomes
into workflow meaning:

```text
durableSuccess
retryableUnavailable
retryableStorageFailure
recoveryRequired
internalNoOp
```

Notable classifications include:

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

Clear retains aggregate plus independent active/profile durability semantics.

The classifier contains no persistence behavior, React dependency, product copy,
or retry execution.

## Changed — Immediate workflow durability feedback

All current user-facing persisting workflows now consume the shared semantic
classification layer.

Covered workflows include:

* authored Setup save;
* manual-event create/edit/delete;
* profile save;
* profile delete;
* profile load;
* backup import;
* clear local data.

A runtime/session transition can now be represented as successful while its durable
persistence is accurately represented as unresolved.

Known persistence failure is no longer internally or visibly treated as durable
success.

## Added — Persistent app-level durability awareness

DayFrame now exposes one shell-level durability-awareness surface.

It initializes from:

```text
getDurabilityStatus()
```

and remains synchronized through:

```text
subscribeDurability()
```

The surface:

* independently represents active-state and profile durability;
* remains silent for `unknown`;
* remains silent for `durable`;
* persists known retryable/recovery-required failures across workflow navigation;
* automatically clears when retained durability converges.

Immediate workflow feedback remains separate and operation-specific.

## Added — Explicit user-triggered Retry

Persistent retryable durability awareness now exposes independent user controls
for active state and saved profiles.

Retry controls appear only for:

```text
retryableUnavailable
retryableStorageFailure
```

They do not appear for:

```text
recoveryRequired
durableSuccess
internalNoOp
```

Active retry invokes only:

```text
retryActivePersistence()
```

Profile retry invokes only:

```text
retryProfilePersistence()
```

Retry never replays Setup save, profile save/delete, clear, or another originating
workflow command.

Partial clear therefore retries the unresolved store-owned absence condition rather
than rerunning the aggregate clear workflow.

## Added — Serialization recovery boundary

Task 1.38 established that current `serializationFailure` behavior is primarily a
defensive integrity boundary.

No supported production UI path was found that naturally constructs unserializable
authored data.

The adopted minimum recovery boundary is:

```text
latest session intent
    → preserve

last successful durable representation
    → preserve

ordinary unchanged Retry
    → unavailable

automatic rollback/reset/reload
    → rejected

continued editing
    → allowed

later successful ordinary persistence
    → natural convergence
```

Current-model-specific repair, entity diagnostics, sanitized export, rollback
tooling, and other schema-specific recovery mechanisms remain intentionally
deferred until the authored-data architecture is sufficiently stable.

## Changed — Recovery-required communication

Persistent recovery-required awareness now explicitly communicates that:

* current changes remain available for the active session;
* those changes are not durably saved;
* ordinary Retry is unavailable;
* reloading or closing DayFrame may discard those session-only changes;
* an older saved representation may return.

No recovery button, rollback, reset, export promise, unload interception, or
model-specific repair behavior was introduced.

## Architectural determination

No additional durability implementation is required before DayFrame proceeds to
the next architectural-alignment domain.

The durability sequence is complete for the current Phase 1 boundary.

## Validation

Task 1.39 completed with:

* lint passed;
* type checking passed;
* 23 test files / 366 tests passed;
* production build passed;
* affected-scope diff validation passed.

---

# 2026-08-13 — Durable-Data Compatibility and Independent Versioning Governance Adopted

Tasks 1.20–1.22 established and adopted DayFrame's durable-data compatibility and
independent format-versioning policy.

## Added

Adopted:

`ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

DayFrame now treats durable authored data it writes or exports as user data.

Historical representations require explicit:

* compatibility;
* migration;
* conversion;
* recovery;
* or intentional unsupported-format handling;

rather than silent degradation.

## Established — Surface classifications

### Active local state

Adopted bounded backward compatibility with durable, observable, atomic migration
requirements before historical readers may retire.

### Saved profiles

Classified as intermediate user-authored durable data requiring stronger migration,
preservation, and recovery guarantees than ordinary operational state.

### Backup files

Adopted long-lived versioned direct-import support plus continued
recovery/conversion availability before historical direct readers may retire.

## Established — Independent format versioning

Local persistence, profile storage, and backup formats are independently
versioned.

A durable format version represents a compatibility contract rather than one
exact frozen serialized layout.

Incompatible semantic or representation changes require an appropriate new version
or migration epoch.

## Established — Migration semantics

In-memory normalization does not constitute completed durable migration.

Migration completion requires durable and observable evidence appropriate to the
surface.

## Established — Reader retirement governance

Compatibility readers protecting DayFrame-produced historical data may not be
removed merely because:

* current writers no longer emit that representation;
* significant time has passed;
* a newer version exists;
* current tests use only the newer representation.

Reader retirement requires explicit architectural authorization and
surface-appropriate migration/recovery evidence.

## Preserved

Existing V1 compatibility remains supported:

```text
dayframe-store-v1
    historical singular + current plural family

profile version 1
    historical singular + current plural family

backup version 1
    historical singular + current plural family
```

No historical reader was removed by the governance decision.

## Validation

Task 1.22 baseline:

* lint passed;
* type checking passed;
* 22 test files / 244 tests passed;
* production build passed.

---

# 2026-08-12 — Legacy `shiftCycle` Compatibility Alignment Complete

Tasks 1.5–1.20 completed the staged retirement of singular `shiftCycle` from
current architectural authority while preserving historical durable-data
compatibility.

## Changed — Current durable writers

Current local-storage, profile, and backup writers now emit:

```text
shiftCycles
```

only.

New output no longer emits singular mirrors or null singular compatibility fields.

## Removed — Obsolete store API

Removed:

```text
setShiftCycle
```

All current store mutation paths now use:

```text
setShiftCycles
```

## Removed — Runtime singular authority

Removed:

```text
DayFrameState.shiftCycle
```

along with:

* store-initialization singular fallback;
* initial-state singular mirror synthesis;
* snapshot/clone singular mirror synthesis.

Current runtime authority is:

```text
DayFrameState.shiftCycles
```

## Removed — Core singular scheduling aliases

Removed singular cycle collection aliases from:

* `generateBlockCandidates`;
* `getActiveShiftSegment`;
* `generateCycleWorkBlocks`;
* `generateSchedulePreview`.

Current scheduling collection vocabulary is plural-only:

```text
DayFrameState.shiftCycles
        ↓
generateSchedulePreview({ shiftCycles })
        ├── generateCycleWorkBlocks({ shiftCycles })
        └── generateBlockCandidates({ shiftCycles })

effective preference resolution
        └── getActiveShiftSegment({ shiftCycles })
```

## Removed — Normalized authored singular property

Removed:

```text
DayFrameAuthoredSetup.shiftCycle
```

Normalized authored data is plural-only.

## Preserved — Historical durable readers

Historical singular `shiftCycle` remains accepted only at raw ingress for:

* legacy local persisted state;
* legacy saved profiles;
* legacy V1 backups.

Those readers normalize historical data into plural current authority before it
enters normalized authored state/runtime scheduling.

## Established — Compatibility horizon

Task 1.20 determined that no defensible current retirement horizon exists for the
remaining readers.

Classifications:

| Reader                      | Classification                         |
| --------------------------- | -------------------------------------- |
| Legacy local authored state | Retain Until Explicit Criteria Are Met |
| Legacy saved profiles       | Retain Until Explicit Criteria Are Met |
| Singular V1 backups         | Retain Indefinitely for Now            |

The repository contains direct historical producer evidence for all three
representations.

## Architectural result

The final compatibility boundary is:

```text
RAW HISTORICAL INPUT
    shiftCycle permitted
          ↓
validation / normalization
          ↓
NORMALIZED AUTHORED DATA
    shiftCycles only
          ↓
CURRENT RUNTIME
    shiftCycles only
          ↓
CORE SCHEDULING
    shiftCycles only
```

Singular compatibility no longer competes with current architectural authority.

---

# Phase 1 Task 1.4 — Obsolete Preview Path Removed

## Changed

* Removed the obsolete `PreviewScreenContainer` application path after
  investigation established that it was not part of supported production Preview
  coordination.
* Preserved the supported application-level Preview path through:

```text
DayFrameApp
    ↓
PreviewScreen
```

## Preserved

* Preview generation semantics;
* Preview revision behavior;
* friction detection;
* suggested fixes;
* scheduling behavior;
* application navigation.

---

# Phase 1 Task 1.2 — Atomic Authored Setup Commit

## Added

* Added one store-owned operation for committing the complete authored Setup
  payload.
* Added transaction-level coverage for cloning, state preservation, Preview
  staleness, persistence compatibility, and single-snapshot observation.

## Changed

* Replaced the UI-coordinated six-mutation Setup save with one authoritative store
  transition.
* Reduced each Setup save from six persistence writes and notifications to one of
  each without changing final authored state or supported user behavior.

## Preserved

* persistence keys and schema;
* historical compatibility;
* deterministic scheduling;
* profiles;
* backups;
* manual events;
* navigation;
* validation;
* generation behavior.

---

# Phase 1 Task 1.1 — Foundational Ownership Baseline

## Added

* Published the Phase 1 Foundational Ownership Map from executable production and
  test evidence.
* Recorded distributed, ambiguous, compatibility-only, and unresolved ownership
  relevant to the Setup → Preview workflow.
* Established the initial Phase 1 implementation boundary.

## Determined

* Established atomic authored Setup commit at the existing store boundary as the
  first dependency-correct production task.
* Preserved Preview generation and revision engines as coherent deterministic
  seams outside that first implementation change.

## Behavior

No production behavior changed.

---

# v1.1.0 — Implementation Planning Complete

## Added

* Completed the comprehensive Implementation Architecture Audit.
* Completed the comprehensive UX Implementation Audit.
* Published the **Implementation Architecture Audit Synthesis**.
* Published the **Implementation UX Audit Synthesis**.
* Published the **Alignment Strategy** as the normative implementation-alignment
  document.
* Published the first **Implementation Roadmap** defining the dependency-driven
  phased execution strategy.
* Published the **Implementation Execution Plan** defining operational discipline
  for sustained implementation.
* Established formal implementation governance, validation criteria,
  documentation workflow, checkpoint requirements, and execution sequencing.
* Established a repeatable engineering methodology spanning architecture, audit,
  synthesis, alignment, roadmap development, execution, validation,
  documentation, checkpoints, and publication.

## Changed

* Transitioned DayFrame from architectural design and implementation planning into
  sustained implementation.
* Refined project governance to distinguish:

  * Architecture Specification;
  * Architectural Decisions;
  * Implementation Audits;
  * Audit Syntheses;
  * Alignment Strategy;
  * Implementation Roadmap;
  * Implementation Execution Plan;
  * Project State Documentation;
  * Historical Documentation.
* Established **Phase 1 — Architectural Foundation Alignment** as the first active
  implementation phase.
* Clarified that implementation proceeds through small, independently verifiable
  tasks rather than broad feature-driven development.
* Established the standard implementation-session workflow:

```text
Review
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

* Established that implementation pauses rather than introducing unreviewed
  architectural assumptions when governing documentation does not provide
  sufficient direction.

## Governance

Established:

```text
Architecture
    ↓
Audit
    ↓
Synthesis
    ↓
Alignment
    ↓
Roadmap
    ↓
Execution
    ↓
Validation
    ↓
Publication
```

as the governing engineering progression.

Architectural correctness, rather than implementation effort or feature count,
remains the criterion for roadmap-phase completion.

---

# v1.0.0 — Architecture Publication

## Added

* Published the **DayFrame Complete Architecture Specification** as the normative
  architectural reference.
* Established the four Architectural Pillars:

  * Teach;
  * Plan;
  * Live;
  * Learn.
* Established the four Information Transformations:

  * Author;
  * Derive;
  * Record;
  * Analyze.
* Introduced the formal distinction between **Domain Object Categories** and
  **Named Domain Objects**.
* Defined the complete Core Domain Model.
* Established Architectural Services as the exclusive producers of Named Domain
  Objects.
* Established Architectural Engines as workflow coordinators.
* Introduced Information Provenance as a first-class architectural concept.
* Introduced Explainability as a foundational architectural principle.
* Published the canonical architectural glossary.
* Established architectural governance through the Architecture Charter and
  Architectural Decision Records.

## Changed

* Refined the planning lifecycle into a forward-only Information Flow.
* Simplified the transformation model from five transformations to four canonical
  transformations.
* Clarified the distinction among:

  * Responsibility;
  * Capability;
  * Workflow.
* Clarified the separation among:

  * Architectural Pillars;
  * Architectural Services;
  * Architectural Engines.
* Recognized **Derived Analytical Domain Objects** as a first-class architectural
  category.
* Clarified Recommendation Proposals as advisory Derived Domain Objects.
* Clarified Planning Insights as Derived Analytical Domain Objects.

## Documentation

* Published the DayFrame Complete Architecture Specification Version 1.0.0.
* Published the Architecture Charter.
* Established canonical architectural terminology.
* Established architecture governance for future revisions through ADRs.

---

Earlier architectural exploration and design work preceded publication of Version
1.0.0 and remains part of DayFrame's pre-publication project history.
