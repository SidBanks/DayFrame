# Implementation Task 1.23 — Establish Persistence-Failure Authority and Durable-Write Failure Boundaries

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.23

**Task Name:** Establish Persistence-Failure Authority and Durable-Write Failure Boundaries

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation Only

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning investigation, verify that this task artifact is complete and record its integrity hash.

Record the investigation outcome in a separate result artifact:

`TASK_1.23_ESTABLISH_PERSISTENCE_FAILURE_AUTHORITY_AND_DURABLE_WRITE_FAILURE_BOUNDARIES_RESULT.md`

The result artifact should document:

* investigation completed;
* durable-write surfaces inventoried;
* persistence/read/write paths traced;
* failure behavior identified;
* swallowed or observable failures classified;
* in-memory versus durable-state divergence analyzed;
* current failure ownership identified;
* user-visible consequences identified;
* ADR alignment gaps identified;
* smallest implementation seams identified;
* validation performed;
* discrepancies or uncertainty;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

Do not modify production code, tests, persistence schemas, storage keys, error handling, user-visible messaging, migrations, validators, normalizers, or recovery behavior during this task.

If evidence is insufficient to assign persistence-failure authority safely, record the ambiguity rather than inventing an owner.

---

# Pre-Execution Artifact Integrity Check

Before beginning execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Governing Architectural Context;
* Scope;
* Required Questions;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when executable evidence establishes every durable-write failure boundary, current failure ownership, possible in-memory/durable divergence, user-data risk, and the smallest safe implementation seam required to align persistence behavior with the accepted durable-data ADR.**

If the saved task is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Establish authoritative ownership and behavioral boundaries for persistence failures across DayFrame's durable-data surfaces.

Earlier Phase 1 audits identified persistence-failure authority as unresolved.

Tasks 1.20–1.22 elevated that unresolved finding into a direct architectural alignment concern.

The accepted:

`ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

now requires durable-data operations and migrations to be:

* durable;
* observable;
* non-destructive;
* retryable where applicable;
* explicit about failure;
* incapable of treating failed persistence as successful migration.

Current implementation evidence already indicates that some local-state and profile persistence failures may be swallowed while runtime state continues advancing.

Task 1.23 investigates that behavior comprehensively before any implementation change is authorized.

---

# Governing Architectural Context

The accepted durable-data ADR establishes:

> A failed parse, migration, conversion, or durable write must not destroy the last
> known recoverable representation of user data.

It further establishes:

> In-memory normalization is not completed migration.

and:

> A persistence failure does not count as successful migration and must not produce
> a successful migration marker.

The ADR distinguishes three durable-data surfaces:

```text
active local state
saved profiles
backup files
```

Each surface has different lifecycle control and recovery responsibilities.

Task 1.23 must identify how current executable persistence behavior compares with those adopted requirements.

This task does not assume current implementation is incorrect merely because persistence helpers catch errors.

It must trace the full behavioral consequences.

---

# Objective

Determine:

1. every current durable read/write boundary;
2. every storage operation that can fail;
3. how failures are currently handled;
4. whether callers know persistence failed;
5. whether runtime state changes despite failed persistence;
6. whether later state can overwrite recoverable historical data;
7. whether user-visible workflows report success despite failed durable writes;
8. where failure authority currently resides;
9. where failure authority should conceptually reside under accepted architecture;
10. the smallest dependency-correct implementation seams for later alignment.

No fix is authorized by this investigation.

---

# Scope

Investigate all current durable-data persistence paths.

At minimum inspect:

## Active authored local state

* loading persisted state;
* parsing persisted JSON;
* normalization/rehydration;
* `persistState` or equivalent writer;
* all mutation paths that invoke persistence;
* Setup commits;
* manual-event changes;
* profile load/import replacement effects;
* Preview-related mutations only where they interact with authored persistence;
* local-storage availability and exception handling.

## Saved profiles

* loading profile storage;
* validation;
* `persistProfiles` or equivalent;
* save profile;
* delete profile;
* load profile where relevant;
* collection rewriting;
* profile persistence failure behavior.

## Backups

Backups are primarily external-file export/import rather than browser persistence.

Inspect:

* backup object creation;
* export/download boundary;
* import parse/validation;
* state replacement after import;
* browser file/download failure ownership if represented in executable code;
* whether backup generation and download success are distinguished.

Do not treat external file download as equivalent to local-storage persistence without evidence.

## Other durable writes

Repository-wide search for:

* `localStorage`;
* `setItem`;
* `removeItem`;
* durable browser APIs;
* storage wrappers;
* persistence helpers;
* profile storage keys;
* authored storage keys;
* any other user-authored durable storage.

Determine whether other current durable surfaces exist.

---

# Required Questions

## 1. Durable-Write Inventory

Identify every executable write to durable user-authored data.

For each record:

* function/module;
* durable surface;
* caller;
* input;
* side effects;
* return value;
* error handling;
* subscriber/UI consequences.

Produce a definitive inventory rather than relying only on known helper names.

---

## 2. Durable-Read Inventory

Identify every executable durable read relevant to current authored data.

Determine how failures are classified:

* unavailable storage;
* thrown storage exception;
* malformed JSON;
* invalid schema;
* unsupported version;
* partial valid data;
* other.

Record whether callers can distinguish these cases.

---

## 3. Local-State Write Behavior

Trace the current authored-state write path conceptually:

```text
store mutation
    ↓
runtime state changes
    ↓
persistState?
    ↓
notify?
```

Determine the exact order.

If persistence throws or fails internally:

* has runtime state already changed?
* does notification still occur?
* does the caller receive an error?
* does UI display success?
* will a reload revert to older durable state?
* can a later write overwrite the prior durable state?

Do not infer order from function names.

---

## 4. Atomic Setup Commit Failure

Task 1.2 established one atomic in-memory authored Setup commit.

Investigate its durable behavior separately.

Determine whether:

```text
commitAuthoredSetup
```

is atomic only in memory or also guarantees persistence success.

If persistence fails:

* is the committed runtime snapshot retained?
* is Preview staleness retained?
* are subscribers notified?
* does Save confirmation still occur?
* what durable state remains?

Record the current semantics without proposing a fix.

---

## 5. Narrow Setter Failure

Inspect remaining field-level authored setters.

Determine whether all use the same persistence path and therefore share identical failure semantics.

If not, classify differences.

---

## 6. Manual-Event Persistence

Trace manual-event CRUD persistence.

Determine whether current UI can report successful creation/update/deletion even when the durable write fails.

Determine whether Preview regeneration after an event edit can make the runtime experience look fully successful despite persistence failure.

This investigation should remain about persistence authority, not manual-event command ownership generally.

---

## 7. Profile Save Failure

Trace:

```text
saveProfile
    ↓
runtime savedProfiles mutation?
    ↓
persistProfiles?
    ↓
caller/UI feedback?
```

Determine the exact order.

If persistence fails:

* does the saved profile remain in memory?
* does UI report success?
* will it disappear after reload?
* is the prior durable profile collection preserved?
* can later operations rewrite the collection?

---

## 8. Profile Delete Failure

Trace deletion separately.

A failed profile deletion has different recovery implications from a failed save.

Determine whether:

* runtime collection removes the profile;
* persistence failure is visible;
* reload restores the deleted profile;
* UI reports deletion success incorrectly;
* the durable representation remains intact.

---

## 9. Profile Load

Loading a profile primarily reads saved profile data and writes active authored state.

Determine whether profile load can therefore involve **two durability authorities**:

```text
profile source storage
        ↓
normalized profile data
        ↓
active authored persistence
```

If active-state persistence fails after profile load:

* what runtime state remains?
* what durable source profile remains?
* is recovery possible?
* does UI report load success?

Do not conflate source profile persistence with active-state persistence.

---

## 10. Backup Import

Trace:

```text
backup parse/validation
    ↓
runtime authored replacement
    ↓
active authored persistence
```

Determine whether import success currently means:

* validation succeeded;
* runtime replacement succeeded;
* durable active-state persistence succeeded;
* or some combination.

If persistence fails after a valid backup is imported:

* is runtime state still replaced?
* is original backup still available externally?
* does UI report success?
* what happens after reload?

This is important under the ADR's recovery guarantees.

---

## 11. Backup Export

Determine what DayFrame currently considers a successful backup export.

Separate:

```text
backup data creation
```

from:

```text
browser file download initiation/completion
```

if the implementation exposes that distinction.

Determine current failure ownership.

If browser download success cannot be observed reliably, record that rather than inventing a stronger guarantee.

---

## 12. Storage Unavailability

Investigate behavior when browser storage is unavailable or throws.

Examples may include:

* privacy mode;
* storage quota;
* access restrictions;
* browser API absence;
* test-injected failures.

Do not speculate about browser causes beyond what implementation can observe.

Determine what executable code does when storage access itself fails.

---

## 13. Serialization Failure

Determine whether current durable values can cause `JSON.stringify` to throw.

If current state shapes make that practically impossible under supported types, classify that separately from storage-write failure.

Do not assume serialization cannot fail without inspecting inputs.

---

## 14. Failure Visibility

For each failure path determine which layers know about it:

```text
storage helper
store
DayFrameApp
screen/component
user
```

Produce a visibility map.

Example:

| Failure                    | Helper knows? | Store knows? | App knows? | User knows? |
| -------------------------- | ------------: | -----------: | ---------: | ----------: |
| local setItem exception    |               |              |            |             |
| profile setItem exception  |               |              |            |             |
| malformed local JSON       |               |              |            |             |
| unsupported backup version |               |              |            |             |

---

## 15. Failure Authority

Determine who currently decides:

* whether an error is swallowed;
* whether runtime mutation proceeds;
* whether UI success is shown;
* whether recovery is attempted;
* whether old durable data remains authoritative after failure.

Classify ownership as:

* coherent;
* distributed;
* ambiguous;
* absent.

---

## 16. In-Memory / Durable Divergence

Identify every path where:

```text
runtime state ≠ durable state
```

can result from a persistence failure.

For each determine:

* direction of divergence;
* whether user can detect it;
* whether reload reconciles it;
* whether reconciliation loses the user's latest changes;
* whether a later successful write converges state.

This is a core required output.

---

## 17. Last-Known-Recoverable Data

For each durable write path, determine what happens to the previously persisted representation if a write fails.

Distinguish:

* browser `setItem` failure before replacement;
* partial writes if possible/observable;
* collection rewrites;
* file exports.

Determine whether current behavior already preserves the old durable representation even though failure is hidden.

This distinction matters: swallowed errors and destructive writes are different problems.

---

## 18. UI Success Semantics

Inspect user-visible messages for:

* Save Setup;
* profile save;
* profile delete;
* profile load;
* backup import;
* backup export;
* manual-event operations where persistence occurs.

Determine whether current success messages mean:

```text
runtime transition succeeded
```

or:

```text
durable operation succeeded
```

or whether the distinction is currently undefined.

Do not change language.

---

## 19. Subscriber Semantics

Determine whether subscribers are notified after runtime mutation even when persistence fails.

If so, establish whether observers can know the snapshot is non-durable.

Determine whether any subscriber-triggered effect can further compound divergence.

---

## 20. Existing Tests

Inventory tests that explicitly exercise:

* unavailable localStorage;
* malformed JSON;
* `setItem` throwing;
* `removeItem` throwing;
* profile persistence failure;
* active persistence failure;
* UI failure messaging;
* backup import/export failures.

Distinguish:

* read failure tests;
* write failure tests;
* absence of coverage.

Do not treat absence of tests as proof of behavior beyond executable inspection.

---

## 21. ADR Alignment Assessment

Compare current behavior with accepted requirements from:

`ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

At minimum assess:

* observability;
* non-destructive failure;
* durable migration evidence;
* atomicity;
* retryability;
* explicit failure classification;
* preservation of last-known recoverable data.

For each requirement classify current implementation as:

* **Aligned**
* **Partially Aligned**
* **Not Aligned**
* **Not Applicable**
* **Unresolved**

Do not propose implementation merely to fill every gap.

---

## 22. Persistence Versus Migration

Separate ordinary authored writes from actual schema/data migration.

The ADR imposes stricter explicit semantics around migration completion.

Determine which current paths are:

* normal persistence;
* read-time normalization;
* write-time convergence;
* genuine migration if any;
* profile collection rewrite;
* backup conversion/import.

Avoid calling every persistence operation "migration."

---

## 23. Candidate Ownership Boundaries

Identify the smallest evidence-supported future ownership options.

Possible examples may include:

* persistence helpers returning explicit results;
* store mutation result contracts;
* a dedicated durable-write boundary;
* UI workflow handling of persistence outcomes;
* another existing abstraction.

Do **not** create a new service or abstraction because the ADR sounds like it needs one.

Evaluate actual current callers first.

---

## 24. Smallest Safe Implementation Seams

Identify candidate future tasks in dependency order.

Possible seams could include:

```text
make persistence failure observable
        ↓
define store mutation durable outcome
        ↓
align user feedback
        ↓
introduce migration-specific observability later
```

Do not assume this order.

Derive the smallest independently testable boundary from executable evidence.

---

# Required Persistence-Failure Boundary Report

Produce a table similar to:

| Durable Operation            | Current Owner | Runtime Changes Before Write? | Failure Propagates? | User Visible? | Durable Divergence Possible? | ADR Alignment | Candidate Seam |
| ---------------------------- | ------------- | ----------------------------: | ------------------: | ------------: | ---------------------------: | ------------- | -------------- |
| Authored-state persistence   |               |                               |                     |               |                              |               |                |
| Atomic Setup commit          |               |                               |                     |               |                              |               |                |
| Manual-event mutation        |               |                               |                     |               |                              |               |                |
| Profile save                 |               |                               |                     |               |                              |               |                |
| Profile delete               |               |                               |                     |               |                              |               |                |
| Profile load → active state  |               |                               |                     |               |                              |               |                |
| Backup import → active state |               |                               |                     |               |                              |               |                |
| Backup export/download       |               |                               |                     |               |                              |               |                |

Add rows for discovered durable operations.

---

# Required Failure Visibility Map

Produce:

| Failure Type                       | Helper | Store | App | User | Current Authority |
| ---------------------------------- | -----: | ----: | --: | ---: | ----------------- |
| Active storage read failure        |        |       |     |      |                   |
| Active storage write failure       |        |       |     |      |                   |
| Profile storage read failure       |        |       |     |      |                   |
| Profile storage write failure      |        |       |     |      |                   |
| Backup parse failure               |        |       |     |      |                   |
| Backup unsupported-version failure |        |       |     |      |                   |
| Backup download/export failure     |        |       |     |      |                   |

Use evidence rather than assumed desired ownership.

---

# Required Divergence Map

For every path capable of divergence, produce a trace:

```text
user action
    ↓
runtime transition
    ↓
durable write fails
    ↓
runtime state = ?
durable state = ?
UI feedback = ?
reload result = ?
recovery source = ?
```

This is mandatory for:

* Setup save;
* profile save;
* profile delete;
* profile load;
* backup import;
* manual-event save/delete if applicable.

---

# Classification Model

Classify persistence ownership concerns as one of:

* **Coherent Current Ownership**
* **Distributed Ownership**
* **Missing Failure Authority**
* **Hidden Failure Boundary**
* **Intentional Best-Effort Persistence**
* **Unresolved**

Classify ADR alignment independently.

Do not imply a bug solely from architectural non-alignment unless behavior clearly violates an accepted user-data guarantee.

---

# Explicit Non-Goals

This task shall not:

* change `persistState`;
* change `persistProfiles`;
* add return values;
* throw new errors;
* add result types;
* alter store mutation ordering;
* roll back state;
* change subscriber ordering;
* add retries;
* add migration markers;
* add transactions;
* add storage abstractions;
* add recovery mechanisms;
* change UI success/error language;
* change profile CRUD behavior;
* change backup import/export behavior;
* change manual-event behavior;
* modify storage keys;
* modify durable formats;
* increment versions;
* change validators or normalizers;
* remove compatibility readers;
* resolve persistence behavior by redesigning `DayFrameApp`;
* address unrelated Phase 1 findings.

This task is investigation only.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.22 — Adopt the DayFrame Durable-Data Compatibility and Independent Format-Versioning Decision.

Task 1.22 makes persistence-failure visibility and non-destructive durable behavior binding architectural concerns.

Earlier relevant evidence includes:

* Task 1.1 — Foundational Ownership Baseline;
* Task 1.2 — Atomic Authored Setup Commit;
* Task 1.20 — Compatibility Horizon;
* Task 1.21 — Durable-Data Policy Investigation.

---

# Evidence Standards

Claims must derive from executable code and tests.

Preferred evidence includes:

* exact persistence helper implementation;
* store mutation ordering;
* return values;
* catch blocks;
* browser API calls;
* app workflow handlers;
* feedback state;
* tests with failing storage;
* reload/rehydration behavior.

Documentation supplies governing requirements but does not establish executable behavior.

Distinguish:

* **Confirmed**
* **Inferred**
* **Not Found**
* **Recommended Candidate**

Do not present candidate architecture as current behavior.

---

# Validation Requirements

This task must not modify production code or tests.

Confirm that:

* all durable reads/writes were searched;
* every persistence helper caller was traced;
* runtime/write ordering was established;
* profile CRUD persistence was traced;
* profile load and backup import were traced through active persistence;
* backup export failure semantics were inspected;
* failure visibility was mapped;
* divergence paths were established;
* last-known-recoverable-data behavior was inspected;
* success feedback semantics were inspected;
* subscriber behavior was inspected;
* current tests were inventoried;
* ADR alignment was assessed;
* candidate implementation seams were dependency-ordered;
* uncertainty was recorded instead of guessed.

Run relevant existing tests where useful.

Run the full repository validation sequence if current workflow requires it:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Verify no production or test file changed.

---

# Documentation Rules

During Task 1.23:

## Create

* `TASK_1.23_ESTABLISH_PERSISTENCE_FAILURE_AUTHORITY_AND_DURABLE_WRITE_FAILURE_BOUNDARIES_RESULT.md`

## Preserve

* Task 1.23 specification;
* durable-data ADR;
* Tasks 1.20–1.22 results;
* existing checkpoints;
* historical audits.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* ADR;
* Session Checkpoint.

Those updates require project review of Task 1.23 first.

Do not create a task-specific checkpoint.

---

# Completion Criteria

Task 1.23 is complete when:

* every durable write boundary has been inventoried;
* every relevant durable read boundary has been inventoried;
* write/mutation/notification ordering is established;
* local-state persistence failure behavior is established;
* atomic Setup commit durable semantics are established;
* profile save/delete/load failure behavior is established;
* backup import/export durability semantics are established;
* manual-event persistence consequences are established where applicable;
* storage-unavailability behavior is established;
* failure visibility across helper/store/app/user layers is mapped;
* all runtime/durable divergence paths are identified;
* last-known recoverable data behavior is established;
* user-visible success semantics are established;
* existing failure tests are inventoried;
* current implementation is assessed against the accepted ADR;
* persistence-failure authority is classified;
* the smallest safe implementation seams are identified;
* no executable behavior changes;
* required validation passes;
* the result artifact is sufficient to derive the next implementation task without repeating the broad investigation.

---

# Expected Outcome

Task 1.23 should transform the unresolved finding:

```text
persistence failures are swallowed
```

into a precise architectural map.

The desired result should answer:

```text
Which write failed?
Who knew?
What changed anyway?
What remained durable?
What did the user see?
What happens after reload?
What can recover the data?
Who should own the outcome?
```

The task may discover that current persistence is non-destructive but insufficiently observable.

It may discover more serious divergence.

It may discover different semantics for active state, profiles, and backups.

Any of those are valid outcomes.

The investigation should prevent us from applying one generic "error handling" solution to several different durability problems.

---

# Task Determination

Task 1.23 is a persistence-authority investigation.

It does not authorize error-handling or durability implementation changes.

It determines how current durable writes fail, who currently owns those failures, where runtime state can diverge from persisted state, how those behaviors align with the accepted durable-data architecture, and what the smallest dependency-correct implementation boundary should be.

**The task is complete when executable evidence establishes every durable-write failure boundary, current failure ownership, possible in-memory/durable divergence, user-data risk, and the smallest safe implementation seam required to align persistence behavior with the accepted durable-data ADR.**
