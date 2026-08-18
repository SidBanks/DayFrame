# Implementation Task 1.21 — Define Durable-Data Compatibility and Format-Versioning Policy

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.21

**Task Name:** Define Durable-Data Compatibility and Format-Versioning Policy

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation / Architectural Policy Analysis Only

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning investigation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.21_DEFINE_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING_POLICY_RESULT.md`

The result artifact should document:

* investigation completed;
* durable-data surfaces inspected;
* existing executable and documentary policy evidence;
* compatibility responsibilities by durable-data category;
* current version semantics;
* migration mechanisms and limitations;
* unsupported-format behavior;
* recovery expectations;
* compatibility-retirement evidence requirements;
* backup-specific compatibility analysis;
* recommended durable-data compatibility policy;
* recommended format-versioning policy;
* unresolved policy questions, if any;
* implementation consequences of the recommended policy;
* deviations from the authorized task, if any;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

Do not modify production code, tests, schemas, persistence keys, version numbers, validators, normalizers, migration behavior, or compatibility readers during this task.

If investigation reveals that a policy question cannot be resolved from current project evidence, record the ambiguity and provide bounded policy alternatives rather than silently selecting one.

The task result is a policy recommendation and architectural determination for project review. It does not itself authorize implementation changes or compatibility-reader removal.

---

# Purpose

Define a coherent DayFrame policy for durable-data compatibility, migration, format versioning, unsupported historical data, recovery, and eventual compatibility retirement.

Tasks 1.5 through 1.19 progressively isolated the legacy singular `shiftCycle` representation to raw historical-data ingress boundaries.

Task 1.20 then established that the remaining readers cannot be safely retired from current evidence because DayFrame has no explicit durable-data compatibility or format-versioning policy.

The remaining issue is therefore no longer primarily implementation cleanup.

It is architectural governance.

This task should answer:

> What compatibility promises does DayFrame make about durable data it has previously written or exported, how are durable formats versioned and migrated, and what evidence is required before support for an older representation may be withdrawn?

---

# Architectural Context

Current DayFrame shift-cycle compatibility has reached the following boundary:

```text
RAW HISTORICAL DATA
    shiftCycle
        |
        v
compatibility reader
        |
        v
validation / normalization
        |
        v
CURRENT NORMALIZED DATA
    shiftCycles
        |
        v
runtime / scheduling
    shiftCycles
```

Current writers are plural-only.

Current normalized authored data is plural-only.

Current runtime state is plural-only.

Current store mutation APIs are plural-only.

Current core scheduling collection APIs are plural-only.

Singular `shiftCycle` remains only at three raw durable-data reader boundaries:

```text
local authored state
saved profiles
V1 backup files
```

Task 1.20 established that all three historical singular representations were genuinely produced by earlier DayFrame implementations.

It also established that their current identifiers do not distinguish singular-generation data from plural-generation data.

---

# Task 1.20 Governing Evidence

Task 1.20 determined:

## Local authored state

Historical data may remain under:

```text
dayframe-store-v1
```

Legacy singular data is normalized during startup.

The raw payload is not rewritten merely because it was read.

A later authored persistence operation rewrites it plural-only.

Migration is therefore lazy and action-dependent.

No migration marker proves convergence.

---

## Saved profiles

Historical profiles may remain under:

```text
dayframe-profiles-v1
```

Legacy singular data is normalized during profile-storage validation.

Loading a profile does not rewrite the source profile collection.

A later save/delete operation rewrites the normalized collection.

Migration is therefore partial and action-dependent.

No migration marker proves convergence.

---

## V1 backups

Historical user-held backup files may contain singular `shiftCycle`.

They use the same Version 1 envelope as current plural backups.

Import normalizes the data into current runtime state but does not modify the source file.

External backup files have no automatic convergence mechanism and cannot be centrally enumerated.

---

# Historical Producer Evidence

Repository history establishes that DayFrame itself produced the historical representations still accepted by the compatibility readers.

Task 1.20 identified, among other evidence:

```text
7e8ea7b
Complete unified setup workflow
2026-05-27
```

which produced singular cycle representations through local persistence, profiles, and Version 1 backups.

Later:

```text
37db89c
Add multiple manual cycle support
2026-06-11
```

introduced plural `shiftCycles` while retaining existing storage identifiers and Version 1 durable formats.

Therefore:

```text
V1 does not identify one exact cycle schema generation.
```

The compatibility readers protect real DayFrame-produced historical data.

---

# Objective

Investigate existing DayFrame durable-data behavior and documentation, then recommend an explicit policy governing:

1. durable-data compatibility responsibilities;
2. differences between internal persistence and user-held portable data;
3. format-version semantics;
4. migration expectations;
5. unsupported-format behavior;
6. recovery guarantees;
7. compatibility-reader retirement criteria;
8. backup longevity expectations;
9. evidence requirements for future compatibility changes.

The result should be sufficiently explicit that a subsequent architectural decision can adopt, reject, or modify the recommendation without requiring another broad compatibility investigation.

---

# Scope

## Included

Investigate and classify the compatibility responsibilities of:

* active local authored-state persistence;
* saved-profile persistence;
* exported/imported backup files;
* any existing format/version identifiers associated with those surfaces;
* existing validators and normalizers where they reveal compatibility semantics;
* existing migration/convergence behavior;
* existing user-visible recovery or failure behavior;
* historical producer evidence;
* current documentation concerning compatibility, persistence, backup, migration, recovery, or versioning;
* existing tests that establish compatibility expectations;
* existing project architectural principles relevant to durable-data governance.

Determine whether different durable-data categories warrant different compatibility promises.

Determine what a DayFrame durable-data version should mean.

Determine what conditions should trigger a new format version.

Determine what behavior should occur when data is valid historical DayFrame data but is no longer directly supported by the current format reader.

Determine what evidence should be required before compatibility can be retired.

---

# Explicit Non-Goals

This task shall not:

* modify production code;
* modify automated tests;
* modify persistence schemas;
* change persistence keys;
* increment profile or backup versions;
* introduce new storage envelopes;
* add migration markers;
* add telemetry;
* add migration code;
* add converters;
* remove compatibility readers;
* change validation behavior;
* change normalization behavior;
* change backup import/export behavior;
* change profile save/load behavior;
* change local persistence behavior;
* change runtime state;
* change scheduling;
* change Preview behavior;
* change user-visible error language;
* create an implementation plan for unrelated Phase 1 findings;
* resolve manual-event ownership;
* resolve feedback aggregation;
* resolve focus/continuity ownership;
* consolidate date conversion;
* resolve persistence-failure ownership beyond what is necessary to state durable-data policy requirements;
* resolve seeded-store purpose.

Any implementation opportunity discovered during investigation must be recorded rather than performed.

---

# Investigation Questions

## 1. Durable-Data Categories

Identify every current durable-data category relevant to the established compatibility problem.

At minimum distinguish:

```text
internal active persistence
saved reusable application data
user-exported portable backup data
```

Determine whether the architecture currently treats these categories differently.

Determine whether their user expectations and recovery roles provide evidence for different compatibility guarantees.

Do not assume they require identical policies merely because they currently share authored-data structures.

---

## 2. Ownership and Control

For each durable-data category, determine:

* who creates it;
* where it lives;
* whether DayFrame controls its lifecycle;
* whether DayFrame can enumerate existing instances;
* whether DayFrame can rewrite it automatically;
* whether users can retain copies outside DayFrame's control;
* whether the data is primarily operational state, reusable user configuration, or a recovery artifact.

Use these findings to determine the degree of compatibility responsibility DayFrame can practically manage.

---

## 3. Existing Compatibility Semantics

Trace current behavior for:

* current-format data;
* historical singular-format data;
* malformed data;
* unsupported version data, where applicable;
* missing optional fields;
* mixed singular/plural data where existing precedence behavior matters.

Distinguish:

```text
accepted historical data
invalid data
unsupported-version data
```

where the implementation currently makes such distinctions.

Do not infer a policy from permissive implementation alone.

---

## 4. Current Version Semantics

Investigate what the following identifiers currently mean in executable behavior:

```text
dayframe-store-v1
dayframe-profiles-v1
profile envelope version: 1
backup envelope version: 1
```

Determine whether any current documentation defines their semantics.

Determine whether they represent:

* exact schemas;
* broad container generations;
* migration epochs;
* API compatibility generations;
* or merely historical identifiers without an explicit contract.

Record discrepancies between identifier naming and actual behavior.

---

## 5. Definition of a Format Version

Recommend what a future DayFrame durable-data version should mean.

Evaluate whether a version should change when:

* a field is renamed;
* a field changes representation;
* a required field is added;
* an optional field is added;
* a field is removed;
* semantics change without shape changing;
* validation becomes stricter;
* normalization behavior changes;
* compatibility with older readers is broken;
* compatibility with older writers is broken.

The result should distinguish:

```text
schema evolution
compatible extension
migration-requiring change
breaking durable-format change
```

where useful.

---

## 6. Forward and Backward Compatibility

Determine what compatibility directions are relevant.

Examples include:

```text
new DayFrame reads old data
old DayFrame reads new data
current DayFrame reads future-version data
```

Recommend which directions DayFrame should promise, tolerate when possible, or explicitly reject.

Do not assume bidirectional compatibility is necessary.

Pay particular attention to whether preserving unknown future fields is currently possible or meaningful.

---

## 7. Migration Policy

For each durable-data category, evaluate when DayFrame should prefer:

* eager migration;
* lazy migration;
* read-time normalization;
* write-time convergence;
* explicit conversion;
* indefinite compatibility reading;
* explicit unsupported-format rejection.

Determine whether migration should be:

* atomic;
* durable;
* observable;
* retryable;
* recoverable after failure.

Determine whether a migration can be considered complete if only in-memory normalization occurred.

---

## 8. Migration Evidence

Recommend what evidence should be required before declaring a durable-data migration complete.

Consider:

* durable migration markers;
* schema/version identifiers;
* successful rewritten payloads;
* release circulation windows;
* explicit conversion completion;
* user acknowledgment;
* automated tests;
* telemetry, if ever appropriate;
* inability to enumerate external artifacts.

Separate evidence that proves:

```text
the migration code works
```

from evidence that proves:

```text
the affected data population has migrated.
```

---

## 9. Unsupported Historical Data

Recommend what DayFrame should do when it encounters authentic historical DayFrame data that the current release cannot safely interpret.

Evaluate at minimum:

* explicit rejection;
* read-only recovery;
* automatic conversion;
* standalone conversion utility;
* preserving the original data untouched;
* user guidance.

Establish whether silent degradation into incomplete but apparently valid current state should ever be permitted.

Task 1.20 identified silent loss of historical cycle data as a concrete risk.

---

## 10. Recovery Guarantees

Determine what recovery principles should govern failed parsing, validation, migration, or conversion.

Consider whether DayFrame should require:

* non-destructive failure;
* preservation of original input;
* clear error classification;
* retryability;
* export/conversion paths;
* rollback for in-place migration;
* avoidance of partial durable writes.

Do not implement these mechanisms.

Define only the recommended policy responsibilities.

---

## 11. Compatibility Retirement

Recommend the criteria that must be satisfied before a historical compatibility reader can be removed.

Distinguish between:

```text
internal local state
saved profiles
portable backups
```

because their populations and lifetimes differ.

Determine whether retirement may be justified by:

* version boundaries;
* completed migration;
* release age;
* explicit support windows;
* measurable reader non-use;
* availability of conversion tools;
* documented end-of-support policy;
* some combination of these.

Do not invent a calendar cutoff for existing V1 data.

---

## 12. Backup Compatibility

Investigate backup files as a distinct architectural category.

Determine whether the fact that DayFrame explicitly exports a file intended for later recovery creates a stronger compatibility responsibility than browser-local operational state.

Evaluate policy alternatives such as:

### Alternative A — Indefinite Import Compatibility

DayFrame continues importing every historically released backup format whenever technically feasible.

### Alternative B — Long-Lived Versioned Compatibility

DayFrame guarantees support for defined backup versions/windows and supplies conversion before retirement.

### Alternative C — Current-Version-Only Compatibility

DayFrame supports only currently documented formats and rejects older versions.

Assess each against:

* user expectations;
* data-loss risk;
* implementation burden;
* future architecture flexibility;
* external artifact lifetime;
* ability to migrate old files automatically;
* DayFrame's current product maturity.

Recommend a policy, but distinguish evidence from architectural judgment.

---

## 13. Profiles Versus Backups

Determine whether saved profiles should be governed like:

* internal application persistence;
* portable user data;
* or an intermediate category.

Profiles are user-authored reusable data but currently live inside application-controlled storage.

Assess whether their compatibility expectations should therefore differ from both active local state and exported backups.

---

## 14. New Version Introduction

Recommend when DayFrame should create a new durable format version rather than extending an existing one.

The result should address whether new versions should be introduced:

* before breaking readers;
* before removing legacy fields;
* when semantics materially change;
* when migration behavior becomes necessary;
* when forward compatibility cannot be maintained.

Determine whether local persistence, profiles, and backups require synchronized versions or may evolve independently.

---

## 15. Version Independence

Investigate whether these should remain independently versioned:

```text
active local persistence
profile storage
backup files
```

Determine whether coupling their version numbers would clarify architecture or create unnecessary coordination.

Do not change existing identifiers.

---

## 16. Project-Maturity Considerations

DayFrame is still under active architectural development.

Assess whether compatibility policy should distinguish:

* pre-release/internal development data;
* publicly released durable data;
* user-exported recovery artifacts.

Do not assume development status automatically eliminates compatibility responsibility.

Repository evidence already proves that earlier DayFrame code produced the historical formats under investigation.

The result should state what additional evidence would be needed to classify any historical format as disposable development-only data.

---

## 17. Architectural Principles

Evaluate the recommended policy against established DayFrame principles, including:

* Architecture Governs Implementation;
* Preserve Deterministic State Ownership;
* Resolve Root Causes Before Symptoms;
* Preserve Context;
* Local Simplicity, Global Coherence;
* Determinism Over Cleverness;
* Epistemic Integrity.

The policy should avoid both extremes:

```text
retain every historical implementation forever
```

and:

```text
remove compatibility merely because current code no longer writes it
```

Compatibility should be intentional, bounded where possible, and evidence-governed.

---

# Required Policy Matrix

The result must include a policy matrix covering at minimum:

| Durable Surface    | User Role | DayFrame Lifecycle Control | Recommended Compatibility Strength | Preferred Migration Strategy | Retirement Evidence Required | Unsupported-Format Behavior |
| ------------------ | --------- | -------------------------- | ---------------------------------- | ---------------------------- | ---------------------------- | --------------------------- |
| Active local state |           |                            |                                    |                              |                              |                             |
| Saved profiles     |           |                            |                                    |                              |                              |                             |
| Backup files       |           |                            |                                    |                              |                              |                             |

Do not fill the matrix from assumption before investigation.

---

# Required Versioning Matrix

The result must include a versioning matrix covering at minimum:

| Change Type                      | Same Version Potentially Valid? | New Version Recommended/Required? | Migration Implication | Reasoning |
| -------------------------------- | ------------------------------- | --------------------------------- | --------------------- | --------- |
| Add optional field               |                                 |                                   |                       |           |
| Add required field               |                                 |                                   |                       |           |
| Rename field                     |                                 |                                   |                       |           |
| Change field representation      |                                 |                                   |                       |           |
| Remove accepted historical field |                                 |                                   |                       |           |
| Change field semantics           |                                 |                                   |                       |           |
| Tighten validation               |                                 |                                   |                       |           |
| Break old-reader compatibility   |                                 |                                   |                       |           |

The matrix should represent the recommended policy rather than current accidental behavior.

---

# Required Compatibility Direction Matrix

The result must explicitly address:

| Direction                                          | Recommended Promise | Notes |
| -------------------------------------------------- | ------------------- | ----- |
| Current DayFrame reads historical supported data   |                     |       |
| Current DayFrame reads unsupported historical data |                     |       |
| Current DayFrame reads future-version data         |                     |       |
| Historical DayFrame reads current data             |                     |       |

This prevents the term "backward compatibility" from remaining ambiguous.

---

# Evidence Requirements

Every factual claim about current behavior must be grounded in:

* executable production paths;
* tests;
* repository history;
* current project documentation;
* or explicit task-result evidence.

Distinguish:

* **Confirmed** — directly supported by executable/documentary evidence;
* **Inferred** — strongly implied by current architecture but not explicitly guaranteed;
* **Recommended** — architectural policy proposed by this task;
* **Unresolved** — evidence insufficient to choose safely.

Do not present a recommendation as an existing project guarantee.

Do not infer support duration from commit age alone.

Do not infer user population from repository history.

Do not infer that an unread historical format is unused.

---

# Required Investigation Areas

At minimum inspect the current implementation and evidence surrounding:

* local persistence serialization and rehydration;
* `createInitialDayFrameState`;
* profile validation, cloning, save/load, and persistence;
* backup creation, validation, parsing, import, and export;
* raw singular compatibility readers;
* plural-precedence behavior;
* unsupported-version handling;
* malformed-data handling;
* persistence failure behavior where relevant;
* compatibility tests established by Tasks 1.6–1.20;
* current architecture documentation;
* current changelog/history;
* relevant task/result artifacts;
* repository history for durable-format producers and transitions.

Do not rely on filenames or comments alone.

---

# Behavioral Invariants During Investigation

Because this is investigation-only:

* current writers remain plural-only;
* current runtime remains plural-only;
* current normalized authored data remains plural-only;
* current core scheduling remains plural-only;
* all three historical singular readers remain intact;
* existing V1 compatibility remains intact;
* current storage keys remain unchanged;
* current format versions remain unchanged;
* current parsing/validation behavior remains unchanged;
* current migration/convergence behavior remains unchanged;
* scheduling output remains unchanged.

---

# Required Result Structure

The Task 1.21 result artifact should contain:

1. Executive Determination
2. Investigation Scope and Evidence
3. Durable-Data Surface Inventory
4. Existing Compatibility Behavior
5. Existing Version Semantics
6. Ownership and Lifecycle-Control Analysis
7. Migration and Convergence Analysis
8. Compatibility Direction Analysis
9. Unsupported-Format and Recovery Analysis
10. Backup Compatibility Analysis
11. Profile Compatibility Analysis
12. Compatibility-Retirement Analysis
13. Recommended Durable-Data Compatibility Policy
14. Recommended Format-Versioning Policy
15. Required Policy Matrix
16. Required Versioning Matrix
17. Required Compatibility Direction Matrix
18. Policy Consequences for Existing V1 Data
19. Potential Future Implementation Consequences
20. Unresolved Questions
21. Deviations
22. Discoveries and Deferred Work
23. Recommended Next Task
24. Validation Performed
25. Final Completion Determination

Additional sections may be added where evidence requires them.

---

# Decision Standard

The recommended policy should optimize for:

```text
user-data preservation
        +
explicit compatibility contracts
        +
architectural evolvability
        +
non-destructive failure
        +
evidence-based retirement
```

It should not optimize solely for minimizing compatibility code.

A compatibility reader that protects authentic historical user data may be architecturally correct even if its implementation appears obsolete in isolation.

Conversely, historical implementation details should not propagate into current runtime architecture merely because durable compatibility remains supported.

The desired boundary remains:

```text
historical representation
        ↓
narrow compatibility ingress
        ↓
normalization / migration
        ↓
current representation
```

---

# Policy Questions That Must Not Be Silently Assumed

The investigation must explicitly answer or classify as unresolved:

* Does DayFrame promise indefinite import of backups it has exported?
* Are saved profiles user data with stronger compatibility expectations than ordinary local state?
* Can internal local state ever be retired solely by release age?
* Must a format version uniquely identify a durable schema generation?
* Can compatible additions occur within one version?
* Must representation changes trigger a version increment?
* What constitutes completion of a migration?
* Is in-memory normalization sufficient to claim migration?
* What happens when durable migration persistence fails?
* Must unsupported data remain recoverable?
* Is explicit rejection preferable to lossy fallback?
* What evidence is sufficient to retire a reader for data DayFrame demonstrably produced?
* May different durable surfaces use different retirement horizons?
* Should backup conversion remain available after direct import support ends?

If current evidence cannot answer one of these, the result must say so.

---

# Validation Requirements

Because this task changes no executable behavior:

* run the relevant compatibility tests to verify the investigated baseline;
* run the repository standard validation sequence after producing the result artifact if required by current workflow;
* verify no production or test files changed;
* verify the immutable Task 1.21 artifact remains unchanged;
* record the artifact hash;
* distinguish pre-existing worktree changes from Task 1.21 documentation changes.

At minimum validate the suites covering:

* local persistence compatibility;
* profiles;
* backups.

The full validation sequence should remain:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

unless repository scripts have changed.

---

# Documentation Rules

During execution:

* do not modify `CURRENT_STATE.md`;
* do not modify `CHANGELOG.md`;
* do not create or modify an ADR;
* do not create a Session Checkpoint unless separately authorized;
* do not rewrite historical task/result artifacts;
* do not rewrite historical audit evidence;
* do not alter the Task 1.21 specification.

The Task 1.21 result is the sole required new project artifact.

After project review, the recommended policy may be promoted into a separately authorized architectural decision artifact.

---

# Completion Criteria

Task 1.21 is complete when:

* all relevant durable-data surfaces have been classified;
* their lifecycle and DayFrame control boundaries are understood;
* existing compatibility behavior is documented;
* existing version semantics are established;
* migration/convergence mechanisms are distinguished from actual population migration;
* compatibility directions are explicitly defined;
* unsupported-format and recovery responsibilities are analyzed;
* backup compatibility alternatives are evaluated;
* profile compatibility responsibility is classified;
* explicit compatibility-retirement criteria are recommended;
* a durable-data compatibility policy is recommended;
* a format-versioning policy is recommended;
* the required matrices are complete;
* recommendations are distinguished from current guarantees;
* unresolved questions remain explicit;
* no compatibility reader is removed;
* no executable behavior changes;
* required validation passes;
* the result is sufficient to support a subsequent architectural decision without repeating the broad investigation.

---

# Expected Outcome

Task 1.21 should transform the current question from:

> When can we delete these last three `shiftCycle` readers?

into:

> What durable-data contract does DayFrame intentionally provide, and under that contract what must be true before any historical reader may be retired?

The task should establish a reusable governance model that applies not only to `shiftCycle`, but to future changes in:

* schedules;
* commitments;
* goals;
* allocations;
* profiles;
* backups;
* execution/history data;
* and other durable DayFrame models.

The immediate singular compatibility problem should therefore become the first evidence case for a general DayFrame durable-data policy rather than a one-off exception.

---

# Task Determination

Task 1.21 is an architectural governance investigation.

It does not authorize a format change, migration, version increment, converter, or reader removal.

Its purpose is to establish the evidence and recommended rules by which those future decisions can be made deliberately.

The task is complete when DayFrame can state, with explicit separation between existing behavior and recommended policy, what compatibility it should promise for each durable-data category, what its format versions should mean, how migrations should be treated, and what evidence must exist before historical compatibility may be withdrawn.
