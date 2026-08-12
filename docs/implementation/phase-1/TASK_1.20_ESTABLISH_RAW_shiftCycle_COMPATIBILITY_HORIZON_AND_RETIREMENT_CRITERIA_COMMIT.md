# Implementation Task 1.20 — Establish Raw `shiftCycle` Compatibility Horizon and Retirement Criteria

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.20

**Task Name:** Establish Raw `shiftCycle` Compatibility Horizon and Retirement Criteria

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.20_ESTABLISH_RAW_SHIFT_CYCLE_COMPATIBILITY_HORIZON_RESULT.md`

The result artifact should document:

* investigation completed;
* remaining raw singular readers identified;
* supported historical formats identified;
* version and migration evidence inspected;
* user-data persistence implications;
* compatibility policy evidence found;
* release/history evidence found;
* retirement criteria candidates;
* architectural determination;
* uncertainty and unsupported assumptions;
* validation performed;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If executable or project-governance evidence is insufficient to justify retirement of any raw singular reader, do not invent a compatibility cutoff.

Record that retention remains required or unresolved.

---

# Pre-Execution Artifact Integrity Check

Before beginning execution, verify that this saved task artifact contains:

* this title and task metadata;
* Execution Artifact Rules;
* Purpose;
* Scope;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with the final sentence:

> **The task is complete when project evidence establishes whether the remaining raw singular `shiftCycle` readers have a defensible retirement horizon, what criteria would permit removal, or whether they must remain supported indefinitely for now.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Establish whether DayFrame has enough executable, historical, or governance evidence to define a retirement horizon for the remaining raw singular `shiftCycle` compatibility readers.

Tasks 1.5 through 1.19 established that singular `shiftCycle` no longer belongs in:

* current durable output;
* normalized authored data;
* runtime state;
* store mutation APIs;
* core scheduling collection APIs.

The only legitimate singular compatibility now remains at raw historical input boundaries:

* local persisted state;
* saved profile storage;
* Version 1 backup input.

Those readers are currently protected by direct compatibility tests.

This task determines whether those readers should:

* remain supported indefinitely for now;
* remain supported until an explicit future condition is met;
* be retired after a documented migration horizon;
* be removed because current project evidence proves the historical formats are no longer supportable or relevant.

No reader removal is authorized by this task.

---

# Architectural Context

The current representational model is now:

```text
RAW HISTORICAL INPUT
    shiftCycle accepted
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

The remaining singular readers are therefore pure compatibility boundaries.

They no longer participate in current authored, runtime, or scheduling authority.

The unresolved question is temporal rather than structural:

> **For how long should DayFrame continue accepting historical singular input?**

That answer must not be guessed from architectural cleanliness alone.

---

# Objective

Determine whether a defensible compatibility horizon exists for the remaining singular raw-data readers.

The task must investigate:

1. what historical data shapes are currently accepted;
2. when those shapes were produced;
3. whether current users may still possess them;
4. whether DayFrame performs automatic forward migration after successful reads;
5. whether every historical source converges to current plural output after use;
6. whether format/version metadata supports a retirement cutoff;
7. whether project governance already defines support or migration policy;
8. what evidence would be required before removal could be considered safe.

The task must conclude with one of:

* retain indefinitely for now;
* retain until explicit retirement criteria are satisfied;
* retirement horizon established;
* unresolved due to insufficient evidence.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

* preserve historical information safely;
* avoid indefinite compatibility debt without policy;
* avoid premature reader removal;
* clarify migration responsibility;
* establish explicit support boundaries;
* strengthen architectural governance;
* preserve epistemic integrity.

It reinforces:

* Architecture Governs Implementation;
* Historical Immutability;
* Preserve Forward Migration Paths;
* Evidence Before Preference;
* Epistemic Integrity;
* Explicit Authority;
* Architectural Traceability;
* Local Simplicity, Global Coherence.

---

# Scope

Investigate all remaining raw singular `shiftCycle` compatibility boundaries.

At minimum inspect:

* local persisted-state reader;
* profile-storage reader;
* V1 backup reader;
* relevant version fields;
* persistence keys;
* profile format version;
* backup format version;
* migration/normalization behavior;
* tests proving singular-only compatibility;
* historical release notes or changelog entries where available;
* architecture decisions;
* current-state documentation;
* roadmap/history documents relevant to when plural `shiftCycles` became authoritative;
* repository history if available and useful;
* any explicit compatibility/migration policy already encoded in project documentation.

Do not infer dates or support policies solely from filenames.

---

# Required Questions

## 1. Remaining Reader Inventory

Identify every raw reader that still accepts singular `shiftCycle`.

For each record:

* file/module;
* raw input shape;
* normalized output;
* associated version identifier;
* current compatibility test.

Confirm no other singular raw reader exists.

---

## 2. Historical Producer Identification

Determine what historical implementation or format produced singular `shiftCycle`.

For each boundary:

* local state;
* profiles;
* backups;

identify whether the producer version can be established from:

* source history;
* version fields;
* changelog;
* archived documentation;
* tests;
* migration code.

If the producer period cannot be established, record that uncertainty.

---

## 3. Current User Exposure

Determine whether a current user could still legitimately possess singular-only data.

Examples include:

* browser local storage surviving upgrades;
* saved profile storage created by older DayFrame builds;
* exported V1 backup files retained indefinitely by users.

Do not assume data has expired merely because the writer no longer emits it.

---

## 4. Migration Convergence

For each raw reader, determine what happens after legacy data is successfully read.

Establish whether:

```text
legacy singular input
      ↓
normalization
      ↓
plural authority
      ↓
future output plural-only
```

is guaranteed.

Distinguish:

* eager rewrite;
* rewrite on next authored mutation;
* rewrite on profile save;
* rewrite on backup re-export;
* no automatic rewrite.

This affects retirement feasibility.

---

## 5. Version Semantics

Inspect version metadata for:

* local persistence;
* profiles;
* backups.

Determine whether version values represent:

* schema identity;
* migration generation;
* app release;
* another concept.

Determine whether singular and plural shapes share the same version number.

If they do, identify whether a reader can distinguish historical singular data by version alone.

---

## 6. Existing Compatibility Policy

Search current project governance and architecture documentation for any rule describing:

* how long old data remains readable;
* supported backup versions;
* profile migration guarantees;
* persistence migration policy;
* release-based deprecation;
* user-data support expectations;
* backwards-compatibility commitments.

If no such policy exists, record that explicitly.

---

## 7. External Persistence Lifetime

Evaluate the practical lifetime of each historical data form.

### Local Storage

Can it survive indefinitely across app updates until browser/site data is cleared?

### Saved Profiles

Are profiles persisted separately and retained until explicit deletion?

### Backups

Can exported files exist indefinitely outside the application?

Do not use assumptions where repository evidence is required; distinguish executable facts from operational inference.

---

## 8. Retirement Risk

For each reader, identify what user-visible failure would occur if singular compatibility were removed while historical data still exists.

Examples:

* silent state loss;
* empty cycle list;
* failed profile load;
* rejected backup import;
* malformed migration.

Classify severity.

---

## 9. Retirement Detectability

Determine whether DayFrame has any way to know that singular historical data is no longer in circulation.

Possible evidence might include:

* telemetry;
* migration counters;
* schema version rollover;
* forced migration;
* expiration policy;
* unsupported-old-version policy;
* controlled data reset.

If none exists, record that.

---

## 10. Reader Removal Preconditions

Identify evidence-based preconditions that would need to be satisfied before a raw singular reader could be removed safely.

Potential criteria might include:

* introducing a new version boundary;
* retaining readers for N published versions;
* explicit migration on load;
* user-facing backup version policy;
* migration telemetry;
* one-time migration release;
* support cutoff documented in release notes;
* no remaining valid V1 singular format;
* project decision to support all V1 backups indefinitely.

Do not select criteria merely because they are common practice.

Derive them from DayFrame's actual constraints.

---

# Required Compatibility Horizon Report

Produce a table:

| Boundary       | Historical Producer Known? | Can Legacy Data Persist Indefinitely? | Auto-Converges to Plural? | Version Distinguishes Legacy? | Retirement Evidence Available? | Classification |
| -------------- | -------------------------: | ------------------------------------: | ------------------------: | ----------------------------: | -----------------------------: | -------------- |
| Local storage  |                            |                                       |                           |                               |                                |                |
| Saved profiles |                            |                                       |                           |                               |                                |                |
| V1 backups     |                            |                                       |                           |                               |                                |                |

---

# Classification Model

Classify each reader independently as one of:

* **Retain Indefinitely for Now**
* **Retain Until Explicit Criteria Are Met**
* **Retirement Horizon Established**
* **Safe to Retire**
* **Unresolved**

Different boundaries may receive different classifications.

---

# Compatibility Policy Analysis

If no current compatibility policy exists, identify that as a governance gap.

Do not create policy within this investigation.

Instead, determine whether the next task should be:

* an ADR defining durable-data compatibility policy;
* a migration-policy specification;
* a versioning decision;
* no action because indefinite retention is currently safest.

The distinction between architecture and governance should remain explicit.

---

# Reader-Specific Analysis

## Local Storage

Investigate:

* persisted key/version;
* singular-only fallback;
* rewrite behavior after load;
* whether old local state can persist until a user returns after a long absence;
* whether loss of the reader would risk silent data loss.

---

## Saved Profiles

Investigate:

* profile storage key/version;
* whether profiles persist separately from active setup;
* whether loading a legacy profile normalizes it;
* whether merely loading it rewrites stored profile data;
* whether legacy profiles remain singular until re-saved;
* whether profile deletion is user-controlled.

---

## V1 Backups

Investigate:

* backup version semantics;
* whether V1 singular and plural backups share a version;
* whether backup files can be imported years after export;
* whether import rewrites the original file;
* whether there is any documented version-support window.

Backup compatibility may require a different horizon from local state or profiles.

---

# Explicit Non-Goals

This task shall not:

* remove any singular reader;
* modify any reader;
* change normalization;
* change version numbers;
* introduce migration code;
* rewrite local storage;
* rewrite saved profiles;
* change backup files;
* tighten validators;
* change current writer behavior;
* create telemetry;
* define a compatibility cutoff without evidence;
* update support policy directly;
* introduce new format versions;
* modify runtime state;
* modify normalized authored data;
* modify core scheduling;
* address unrelated Phase 1 findings.

This task investigates compatibility lifetime only.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.5 — Establish Legacy `shiftCycle` Compatibility Boundary;
* Task 1.6 — Stop Writing Legacy `shiftCycle` Local-Storage Mirror;
* Task 1.7 — Establish Singular-Only Profile and Backup Compatibility Evidence;
* Task 1.8 — Stop Emitting Null `shiftCycle` in New Profile and Backup Output;
* Task 1.12 — Remove the Obsolete Runtime `shiftCycle` Mirror;
* Task 1.17 — Remove the Final Core Singular Scheduling Alias;
* Task 1.18 — Establish `DayFrameAuthoredSetup.shiftCycle` Compatibility Boundary;
* Task 1.19 — Remove the Obsolete `DayFrameAuthoredSetup.shiftCycle` Property.

These tasks establish that singular compatibility now exists only at raw durable-reader boundaries.

---

# Evidence Standards

Claims must derive from repository evidence wherever possible.

Preferred evidence includes:

* executable reader/writer behavior;
* migration tests;
* format/version definitions;
* current persistence behavior;
* project documentation;
* changelog/history;
* repository history;
* archived specifications.

Operational inferences such as "backup files may exist indefinitely" should be clearly labeled as inference unless directly supported.

Do not convert uncertainty into policy.

---

# Validation Requirements

This task is investigative and should not modify production code or tests.

Confirm that:

* all remaining raw singular readers were inspected;
* current and historical writer behavior was traced;
* version semantics were inspected;
* convergence behavior was traced;
* compatibility tests were inspected;
* project governance was searched for existing policy;
* retirement risks were identified;
* detectability of remaining legacy data was assessed;
* retirement preconditions were identified;
* no reader or format changed;
* uncertainty was recorded explicitly.

Run relevant persistence/profile/backup tests if useful.

Run the repository standard validation sequence if required by project policy.

---

# Required Result

The result artifact should include:

1. compatibility horizon table;
2. remaining reader inventory;
3. historical producer evidence;
4. migration-convergence analysis;
5. version-semantics analysis;
6. current user-exposure analysis;
7. retirement-risk analysis;
8. retirement-detectability analysis;
9. existing-policy findings;
10. candidate retirement criteria;
11. classification for each reader;
12. recommended next task.

---

# Documentation Updates

At completion:

* preserve this Task 1.20 specification unchanged;
* create
  `TASK_1.20_ESTABLISH_RAW_SHIFT_CYCLE_COMPATIBILITY_HORIZON_RESULT.md`;
* update `CURRENT_STATE.md` only after project review;
* include Task 1.20 in the next Session Checkpoint;
* do not create a task-specific checkpoint unless separately authorized;
* do not update `CHANGELOG.md` solely for this investigation.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.20 is complete when:

* every remaining singular raw reader has been identified;
* the historical producer of each reader's data has been established where evidence permits;
* current user exposure to historical data has been assessed;
* migration convergence has been established;
* version semantics have been established;
* existing compatibility policy has been found or confirmed absent;
* retirement risk has been assessed;
* ability to detect remaining legacy data has been assessed;
* evidence-based retirement preconditions have been identified;
* each reader has been classified;
* no production behavior or tests have changed;
* required validation passes;
* the result artifact records uncertainty without inventing a cutoff.

---

# Risks

Primary risks include:

* treating architecture cleanup as sufficient reason to drop user-data compatibility;
* assuming old local data has expired;
* assuming backups have a finite lifetime;
* mistaking format version for release version;
* inventing an arbitrary support window;
* creating policy during an evidence-gathering task;
* conflating reader retention with current writer cleanliness.

The task should answer what can be justified, not what would be convenient.

---

# Deferred Work

This task does not resolve:

* actual raw reader retirement;
* final compatibility policy;
* new format versions;
* migration telemetry;
* validator permissiveness;
* seeded-store behavior;
* manual-event ownership;
* feedback aggregation;
* focus/continuity ownership;
* duplicated date conversions;
* persistence-failure authority.

Any compatibility-retirement work requires explicit authorization after this investigation.

---

# Expected Outcome

Task 1.20 should establish whether DayFrame can responsibly retire any remaining singular historical reader.

A valid outcome may be:

```text
No defensible retirement horizon exists yet.
Retain readers.
```

That is not a failure.

It means compatibility debt has been isolated, documented, and intentionally retained rather than removed based on assumption.

Another valid outcome may identify explicit preconditions for eventual retirement.

The investigation should prioritize preservation of user data over aesthetic completeness.

---

# Task Determination

Task 1.20 establishes the temporal compatibility boundary for the remaining raw singular `shiftCycle` readers.

It does not remove them.

It determines whether historical-reader retirement can be justified now, later under explicit criteria, or not at all with current evidence.

**The task is complete when project evidence establishes whether the remaining raw singular `shiftCycle` readers have a defensible retirement horizon, what criteria would permit removal, or whether they must remain supported indefinitely for now.**
