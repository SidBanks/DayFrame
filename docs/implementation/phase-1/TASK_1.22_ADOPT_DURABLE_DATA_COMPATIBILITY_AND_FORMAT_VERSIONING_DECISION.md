# Implementation Task 1.22 — Adopt the DayFrame Durable-Data Compatibility and Independent Format-Versioning Decision

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.22

**Task Name:** Adopt the DayFrame Durable-Data Compatibility and Independent Format-Versioning Decision

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Architectural Decision / Governance Adoption

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning execution, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_1.22_ADOPT_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING_DECISION_RESULT.md`

The primary architectural output of this task shall be a new ADR:

`ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

The task result should document:

* decision review completed;
* Task 1.21 recommendations reviewed;
* unresolved governance choices resolved;
* final adopted policy;
* deviations from the Task 1.21 recommendation, if any;
* ADR created;
* affected governance documents reviewed;
* implementation consequences identified;
* explicitly deferred implementation work;
* validation performed;
* final completion determination.

Do not modify production code, tests, schemas, persistence keys, version identifiers, validators, normalizers, migrations, compatibility readers, or user-visible behavior during this task.

The architectural decision may authorize future work conceptually, but it does not itself authorize executable implementation changes.

---

# Pre-Execution Artifact Integrity Check

Before beginning execution, verify that this saved task artifact contains:

* this title and task metadata;
* Execution Artifact Rules;
* Purpose;
* Governing Evidence;
* Decision Questions;
* Required ADR Content;
* Explicit Non-Goals;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with the final sentence:

> **The task is complete when DayFrame has an adopted ADR defining durable-data compatibility, migration, independent format versioning, unsupported-format behavior, recovery obligations, and compatibility-retirement authority without changing executable behavior.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Adopt an explicit architectural decision governing DayFrame durable-data compatibility and format versioning.

Task 1.20 established that the remaining raw singular `shiftCycle` readers could not be responsibly retired because DayFrame lacked an explicit compatibility policy.

Task 1.21 then investigated the broader durable-data problem and produced an evidence-backed policy recommendation covering:

* active local persistence;
* saved profiles;
* backup files;
* migration;
* versioning;
* recovery;
* unsupported historical data;
* compatibility directions;
* reader retirement.

Task 1.22 converts that recommendation into binding architecture after resolving the remaining governance choices.

The purpose is not to modify current durable formats.

The purpose is to establish the rules that future format and migration work must obey.

---

# Governing Evidence

Task 1.21 established the following recommended policy:

> DayFrame treats authored durable data it writes or exports as user data. Current
> releases read every explicitly supported historical format through narrow ingress
> adapters and normalize it to one current representation. Internal formats use
> bounded, observable, non-destructive migration; portable backups receive
> long-lived versioned import or conversion support. Unsupported or ambiguous data
> is preserved and rejected with recovery guidance, never silently degraded.
> Compatibility retires only through a reviewed version boundary and evidence
> appropriate to the surface.

Task 1.21 further established that:

* active local state, saved profiles, and backups have different lifecycle control;
* profiles deserve stronger protection than ordinary operational state;
* backups deserve the strongest compatibility commitment;
* migration is not complete merely because data normalizes in memory;
* current V1 identifiers do not identify exact schema generations;
* current DayFrame makes no general forward-compatibility promise;
* current DayFrame should not generally promise old releases can read new data;
* direct support for historical backup formats may retire only when a maintained recovery/conversion route exists;
* local/profile retirement requires evidence of durable migration rather than release age alone;
* unsupported historical data must never silently degrade into apparently valid incomplete state.

This task should treat Task 1.21 as the primary policy evidence base rather than rerunning its broad investigation.

---

# Objective

Review and formally adopt DayFrame's durable-data governance.

The final ADR must define:

1. durable-data categories and their compatibility strength;
2. compatibility directions;
3. migration requirements;
4. migration-completion criteria;
5. format-version semantics;
6. independent versioning of durable surfaces;
7. unsupported-format behavior;
8. recovery obligations;
9. compatibility-retirement criteria;
10. format-retirement authority;
11. backup-specific compatibility commitments;
12. treatment of pre-public-release durable data.

No implementation is authorized by adoption alone.

---

# Decision Questions

## 1. Durable-Data Principle

Decide whether DayFrame adopts the following foundational rule:

> Durable authored data written or exported by DayFrame is user data and must be
> preserved through explicit compatibility, migration, conversion, or
> non-destructive unsupported-format handling.

The decision should distinguish this from disposable caches or derived data.

---

## 2. Surface-Specific Compatibility Strength

Adopt or modify the Task 1.21 classifications for:

### Active Local State

Recommended:

* bounded backward-reading compatibility;
* eager, atomic, durable migration when versions change;
* observable migration completion;
* retirement only after migration evidence or an accepted recovery path.

### Saved Profiles

Recommended:

* stronger protection than ordinary active state;
* atomic collection migration;
* preservation of unconvertible entries;
* explicit recovery;
* bounded retirement only after successful migration evidence.

### Backup Files

Recommended:

* long-lived versioned backward import support;
* direct-reader retirement only after a maintained conversion/recovery route exists;
* existing V1 direct import retained for now.

The ADR should explicitly allow different compatibility horizons for different surfaces.

---

## 3. Backup Compatibility Commitment

Resolve the following policy choice.

### Proposed Decision

Adopt **Long-Lived Versioned Compatibility**:

> DayFrame does not promise direct import of every historical backup version
> forever, but DayFrame-produced backup artifacts must retain a supported recovery
> path. Before direct import support for a released backup version ends, DayFrame
> must provide a maintained converter, legacy importer, or designated recovery
> release capable of recovering that data non-destructively.

This is stronger than current-version-only support but more evolvable than permanent direct-reader support.

Confirm or modify this recommendation.

---

## 4. Backup Recovery Delivery Mechanism

Task 1.21 left the exact converter delivery mechanism unresolved.

The ADR should decide whether policy requires one specific mechanism or permits any of:

* in-application legacy import;
* standalone offline converter;
* maintained recovery release.

### Recommended Decision

Permit any of the three, provided the route is:

* maintained;
* documented;
* non-destructive;
* capable of producing a currently supported format or recoverable normalized data.

The policy should govern the recovery guarantee, not unnecessarily freeze the implementation mechanism.

---

## 5. Active Local-State Compatibility

Decide whether local operational state may eventually lose old readers after an explicit migration window.

### Recommended Decision

Yes, provided:

* a new format/version boundary exists;
* migration is eager or otherwise durably observable;
* migration is atomic and retryable;
* persistence failures do not count as success;
* an adopted support window has elapsed;
* skipped-installation recovery behavior exists;
* retirement is explicitly reviewed.

Release age alone is insufficient.

---

## 6. Saved-Profile Compatibility

Decide whether profiles are:

* internal operational state;
* portable recovery artifacts;
* or an intermediate user-data category.

### Recommended Decision

Adopt **Intermediate User-Authored Durable Data**.

Profiles should receive:

* stronger protection than active state;
* weaker indefinite guarantees than exported backups;
* atomic collection migration;
* preservation of entries that cannot migrate;
* explicit user-visible recovery.

---

## 7. Version Meaning

Adopt a definition of a durable format version.

### Recommended Decision

> A durable format version identifies a compatibility contract, not necessarily one
> frozen serialized layout.

The contract includes:

* required fields;
* optional fields;
* semantic meaning;
* validation expectations;
* normalization expectations;
* reader/writer relationship;
* supported migration/conversion paths;
* unsupported-version behavior.

Compatible extensions may remain within a version only when every promised reader remains safe and meaningful data is not silently lost.

---

## 8. Version-Increment Rule

Decide when a new version is required.

### Recommended Decision

A new version or explicit migration epoch is required before a change that:

* renames or removes a field incompatibly;
* changes a field representation incompatibly;
* changes field semantics materially;
* introduces a required field without deterministic historical meaning;
* tightens validation against data previously considered valid;
* requires migration to preserve meaning;
* breaks a supported reader.

Optional compatible extensions may remain within a version if reader safety and round-trip expectations remain satisfied.

---

## 9. Independent Versioning

Decide whether active local state, profiles, and backups should share synchronized format versions.

### Recommended Decision

No.

Adopt independent versioning for:

```text
local persistence
profile storage
backup files
```

because they differ in:

* lifecycle;
* user role;
* migration capability;
* retirement evidence;
* support horizon.

Shared authored substructures may later receive their own schema generation if executable need justifies it.

---

## 10. Compatibility Directions

Adopt explicit directional promises.

### Recommended Decision

#### Current DayFrame reads supported historical data

**Guaranteed for supported versions.**

#### Current DayFrame encounters retired/unsupported historical data

**Must not interpret silently.**

Preserve the original and route to explicit recovery, conversion, or rejection.

#### Current DayFrame reads unknown future versions

**No general guarantee.**

Explicitly reject unless that future format declares a safe compatibility range implemented by the current reader.

#### Historical DayFrame reads current data

**No general guarantee.**

Backward writer compatibility may be maintained deliberately for specific compatible extensions but is not a global promise.

---

## 11. Migration Definition

Decide what constitutes migration.

### Recommended Decision

In-memory normalization alone is **not migration completion**.

A durable migration must be:

* deterministic;
* atomic;
* durable;
* idempotent;
* retryable;
* observable;
* validated before replacement;
* non-destructive on failure.

The original must remain recoverable until the replacement is durably accepted.

---

## 12. Migration Evidence

Adopt the distinction between:

```text
migration implementation correctness
```

and:

```text
affected-data population migration
```

### Recommended Decision

Reader retirement based on migration requires evidence appropriate to the surface.

Tests prove migration code works.

They do not prove dormant user data has migrated.

Migration completion evidence may include durable markers, successful rewritten versions, adopted circulation windows, per-collection migration state, or explicit artifact conversion.

---

## 13. Unsupported-Format Behavior

Resolve whether DayFrame ever permits lossy fallback.

### Recommended Decision

No.

Authentic historical DayFrame data must never silently become incomplete but apparently valid current state.

Unsupported or ambiguous data must result in:

* preservation of original input;
* explicit classification;
* non-destructive rejection or conversion;
* recovery guidance.

---

## 14. Recovery Principle

Adopt a general recovery rule.

### Recommended Decision

> A failed parse, migration, conversion, or durable write must not destroy the last
> known recoverable representation of user data.

The policy should require appropriate mechanisms such as:

* copy-before-replace;
* atomic replacement;
* rollback;
* quarantine;
* retained original file;
* retryable conversion.

The ADR need not mandate one mechanism universally.

---

## 15. Raw-Download Recovery

Task 1.21 left unresolved whether unsupported local/profile data must always offer raw-download recovery.

### Recommended Decision

Do **not** mandate a specific raw-download UI universally.

Instead adopt:

> Unsupported durable data must have an appropriate recovery path proportional to
> the surface and available interpretation.

Possible recovery may include:

* preserving source storage;
* export of recoverable raw data;
* converter invocation;
* documented recovery release;
* manual restoration.

A later UX/implementation decision may choose raw download where useful.

---

## 16. Pre-Public-Release Durable Data

Resolve whether historical development-era data may be considered disposable.

### Recommended Decision

Do not treat it as disposable solely because it predates a formal public release.

A historical format may be excluded from durable-data support only when evidence establishes:

1. the producing build was not distributed or used with real user-authored data; and
2. an adopted policy explicitly classifies that development cohort as unsupported.

Absent such evidence, DayFrame-produced durable data receives the normal compatibility presumption.

---

## 17. Retirement Authority

Task 1.21 identified the need for a named approval authority.

### Recommended Decision

Compatibility retirement requires an explicit architectural decision under DayFrame governance.

The retirement decision must:

* identify the durable surface and versions affected;
* cite migration/conversion evidence;
* describe remaining uncertainty;
* establish unsupported-format/recovery behavior;
* confirm applicable support-window requirements;
* authorize the reader removal explicitly.

No implementation task may infer reader-retirement permission from code cleanliness or elapsed time.

---

## 18. Support-Window Duration

Task 1.21 could not establish numeric support durations.

### Recommended Decision

Do not encode arbitrary numeric/calendar durations in this ADR.

Instead:

* require each future format/version decision to define its support window when relevant;
* require backup versions to receive an explicitly documented long-lived support period;
* require migration-based local/profile retirement to satisfy both policy and evidence;
* record numeric duration as a future product/governance decision where necessary.

This keeps the ADR durable while avoiding invented timeframes.

---

# Required ADR

Create:

`ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

The ADR should use the project's established ADR structure if one exists.

At minimum include:

1. Title
2. Status
3. Date
4. Context
5. Problem
6. Decision
7. Durable-Data Categories
8. Compatibility Direction
9. Migration Policy
10. Format-Version Definition
11. Version-Increment Rules
12. Independent Versioning
13. Unsupported-Format Behavior
14. Recovery Requirements
15. Backup Compatibility Commitment
16. Profile Compatibility Commitment
17. Local-State Compatibility Commitment
18. Retirement Criteria
19. Retirement Authority
20. Existing V1 Treatment
21. Consequences
22. Positive Consequences
23. Negative Consequences / Costs
24. Alternatives Considered
25. Deferred Decisions
26. Implementation Implications
27. Validation / Evidence Basis
28. Supersession / Revision Rules

Use existing DayFrame terminology and architectural principles.

---

# Required Adopted Policy Matrix

The ADR must include or reference a final adopted matrix:

| Durable Surface    | Classification | Compatibility Commitment | Migration Model | Retirement Basis | Unsupported-Format Rule |
| ------------------ | -------------- | ------------------------ | --------------- | ---------------- | ----------------------- |
| Active local state |                |                          |                 |                  |                         |
| Saved profiles     |                |                          |                 |                  |                         |
| Backup files       |                |                          |                 |                  |                         |

---

# Required Compatibility Direction Matrix

The ADR must include:

| Direction                                               | Adopted Policy |
| ------------------------------------------------------- | -------------- |
| Current DayFrame reads supported historical data        |                |
| Current DayFrame encounters unsupported historical data |                |
| Current DayFrame encounters future-version data         |                |
| Historical DayFrame reads current data                  |                |

---

# Required Versioning Rules

The ADR must state which changes:

* may remain within one durable version;
* require a new version;
* require migration/conversion;
* require explicit retirement review.

The Task 1.21 versioning matrix should be used as the evidence base.

Do not simply copy it without resolving wording into binding architectural language.

---

# Existing V1 Treatment

The ADR must explicitly state that adoption does **not** reinterpret existing V1 identifiers retroactively.

Existing current behavior remains:

```text
local dayframe-store-v1
    historical singular + current plural family

profiles version 1
    historical singular + current plural family

backup version 1
    historical singular + current plural family
```

Existing singular readers remain supported.

Existing V1 is treated as a legacy broad compatibility family.

No reader retirement or version increment occurs as part of this task.

---

# Explicit Non-Goals

This task shall not:

* modify production code;
* modify tests;
* change persistence keys;
* change local-storage payloads;
* change profile format;
* change backup format;
* increment any version;
* add a V2;
* add schema envelopes;
* add migrations;
* add migration markers;
* add telemetry;
* add converters;
* change validators;
* change normalizers;
* change error handling;
* change recovery UX;
* remove compatibility readers;
* modify `CURRENT_STATE.md`;
* modify `CHANGELOG.md`;
* create a Session Checkpoint unless separately authorized;
* implement persistence-failure handling;
* resolve unrelated Phase 1 findings.

This is governance adoption only.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.20 — Establish Raw `shiftCycle` Compatibility Horizon and Retirement Criteria;
* Task 1.21 — Define Durable-Data Compatibility and Format-Versioning Policy.

Task 1.20 established the lack of a defensible retirement horizon.

Task 1.21 established the evidence-backed recommended policy.

---

# Evidence Standards

The decision must distinguish:

* current executable fact;
* existing historical evidence;
* adopted architectural policy;
* deferred implementation;
* unresolved product/governance detail.

Do not rewrite current behavior as though it already satisfies the newly adopted policy.

For example:

```text
Current:
local storage may silently fall back after malformed data

Adopted policy:
unsupported or ambiguous durable data must fail non-destructively with recovery
```

The ADR should make clear that implementation alignment may still be required.

---

# Decision Review Standard

Before adopting the policy, evaluate it against:

* user-data preservation;
* architecture evolvability;
* implementation complexity;
* future migration burden;
* backup recovery expectations;
* deterministic state ownership;
* failure transparency;
* compatibility test burden;
* project maturity;
* Epistemic Integrity.

The adopted policy should be stable enough to govern future DayFrame durable models beyond the current `shiftCycle` example.

---

# Architectural Principles

The decision should explicitly align with:

* Architecture Governs Implementation
* Preserve Deterministic State Ownership
* Preserve Forward Migration Paths
* Resolve Root Causes Before Symptoms
* Preserve Context
* Local Simplicity, Global Coherence
* Determinism Over Cleverness
* Epistemic Integrity
* Historical Immutability
* Architectural Traceability
* User Data Preservation

---

# Documentation Updates

During this task:

## Create

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`
* `TASK_1.22_ADOPT_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING_DECISION_RESULT.md`

## Preserve

* Task 1.22 specification
* Task 1.21 result
* Task 1.20 result
* historical task/result artifacts
* historical audits/checkpoints

## Do Not Update Yet

* `CURRENT_STATE.md`
* `CHANGELOG.md`
* Session Checkpoint

Those should be updated only after project review accepts the ADR.

---

# Validation Requirements

Because this task changes only documentation/governance:

1. Verify the Task 1.22 artifact remained immutable.
2. Verify the ADR exists and is complete.
3. Verify the result artifact exists separately.
4. Verify no production/test file changed.
5. Review the ADR against Task 1.21 evidence.
6. Confirm all required decision questions are resolved or explicitly deferred.
7. Confirm existing V1 readers remain supported.
8. Confirm no implementation authorization is implied accidentally.

Run the repository standard validation sequence if current workflow requires it:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Record results.

---

# Completion Criteria

Task 1.22 is complete when:

* Task 1.21's recommendation has been reviewed;
* the project has adopted or explicitly modified its durable-data compatibility policy;
* active local state policy is defined;
* saved profile policy is defined;
* backup compatibility policy is defined;
* backup recovery continuity is defined;
* compatibility directions are defined;
* migration-completion semantics are defined;
* migration evidence requirements are defined;
* format-version semantics are defined;
* version-increment rules are defined;
* independent versioning is decided;
* unsupported-format behavior is defined;
* recovery principles are defined;
* pre-public-release data treatment is defined;
* reader-retirement authority is defined;
* numeric support windows are either decided or deliberately deferred;
* existing V1 treatment is explicit;
* an ADR records the adopted decision;
* no executable behavior changes;
* existing compatibility readers remain intact;
* validation passes;
* the result artifact records adoption and deferred implementation consequences.

---

# Expected Outcome

After Task 1.22, DayFrame should be able to state a binding architectural rule:

```text
Durable user data
      ↓
explicit versioned compatibility contract
      ↓
narrow historical reader / migration / conversion
      ↓
current normalized representation
      ↓
non-destructive recovery if unsupported
```

Future durable-data changes should no longer decide compatibility ad hoc.

Instead, a developer should be able to ask:

```text
What surface is changing?
What version contract applies?
Does this require a new version?
What migration is required?
What recovery promise applies?
What evidence permits retirement?
Who authorizes that retirement?
```

and derive the correct implementation sequence from the ADR.

The `shiftCycle` compatibility sequence should become the historical case that produced a reusable governance rule for future DayFrame evolution.

---

# Task Determination

Task 1.22 is an architectural decision task.

It adopts durable-data compatibility and format-versioning governance based on the evidence developed through Tasks 1.20 and 1.21.

It does not itself alter formats, migrations, readers, or executable behavior.

**The task is complete when DayFrame has an adopted ADR defining durable-data compatibility, migration, independent format versioning, unsupported-format behavior, recovery obligations, and compatibility-retirement authority without changing executable behavior.**
