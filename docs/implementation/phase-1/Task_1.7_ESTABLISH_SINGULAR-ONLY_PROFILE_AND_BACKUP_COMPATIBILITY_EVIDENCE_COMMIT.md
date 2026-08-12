# Implementation Task 1.7 — Establish Singular-Only Profile and Backup Compatibility Evidence

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.7

**Task Name:** Establish Singular-Only Profile and Backup Compatibility Evidence

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during
execution.

Record the execution outcome in a separate result artifact:

`TASK_1.7_ESTABLISH_SINGULAR_ONLY_PROFILE_BACKUP_COMPATIBILITY_EVIDENCE_RESULT.md`

The result artifact should document:

- investigation completed;
- compatibility paths traced;
- tests added or updated;
- exact legacy fixtures established;
- observed normalization behavior;
- validation performed and results;
- architectural determination;
- discrepancies from expected behavior;
- discoveries and deferred work;
- recommended next task;
- final completion determination.

If executable behavior contradicts the compatibility assumptions described by this
task, do not change production code to make the assumptions true.

Record the discrepancy and stop the affected work for project review.

---

# Pre-Execution Artifact Integrity Check

Before beginning implementation, verify that this saved task artifact contains:

- this title and task metadata;
- Execution Artifact Rules;
- Purpose;
- Scope;
- Explicit Non-Goals;
- Validation Requirements;
- Completion Criteria;
- Task Determination.

Confirm that the document ends with the final sentence:

> **The task is complete when direct executable evidence establishes what DayFrame
> currently guarantees for singular-only legacy profile and V1 backup data.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Establish direct executable compatibility evidence for legacy saved profiles and
Version 1 backups that contain singular `shiftCycle` without plural `shiftCycles`.

Task 1.5 established that singular `shiftCycle` remains a transitional
compatibility representation across multiple durable-data boundaries.

Task 1.6 safely stopped emitting the singular mirror into new local-storage
authored-state writes while retaining the legacy local-storage reader.

Profile and backup compatibility remain different boundaries.

Before changing their writers, validators, normalizers, or compatibility fields,
DayFrame should have explicit tests proving what the existing readers currently
accept and how accepted legacy data becomes current plural runtime authority.

This task establishes those guarantees.

---

# Architectural Context

The current staged compatibility model is:

```text
Legacy local storage
    shiftCycle only
        ↓
reader normalization
        ↓
shiftCycles authority
        ↓
future local writes plural-only
```

Task 1.6 established executable evidence for that path.

Profile and backup compatibility have not yet received equivalent direct
singular-only fixture coverage.

Task 1.5 found that existing profile and backup paths contain singular
compatibility behavior, but their precise reader guarantees should be locked down
before any writer-side cleanup is authorized.

The next question is therefore not:

> Can singular `shiftCycle` be removed?

It is:

> What do the existing profile and backup readers demonstrably guarantee for
> historical singular-only data?

---

# Objective

Create direct automated evidence for the existing compatibility behavior of:

1. a legacy saved profile containing singular `shiftCycle` without plural
   `shiftCycles`; and
2. a Version 1 backup containing singular `shiftCycle` without plural
   `shiftCycles`.

The tests should establish whether those inputs are accepted and, when accepted,
how they normalize into current plural `shiftCycles` authority.

This task should not change the intended production behavior.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

- preserve forward migration paths;
- make compatibility responsibilities explicit;
- reduce uncertainty before structural cleanup;
- clarify authoritative state representation;
- support eventual removal of transitional structures;
- strengthen deterministic state ownership;
- strengthen architectural traceability.

It reinforces:

- Architecture Governs Implementation;
- Executable Evidence;
- Evidence Before Preference;
- Preserve Deterministic State Ownership;
- Preserve Forward Migration Paths;
- Resolve Root Causes Before Symptoms;
- Epistemic Integrity;
- Local Simplicity, Global Coherence.

---

# Scope

## Profile Compatibility Evidence

Trace the current saved-profile path far enough to establish:

- the serialized profile representation;
- profile validation;
- profile normalization;
- profile loading;
- precedence between plural `shiftCycles` and singular `shiftCycle`;
- conversion of singular-only profile data into runtime plural authority.

Add a direct fixture representing the oldest/currently supported singular-only
profile shape evidenced by the existing implementation.

The fixture should omit plural `shiftCycles` rather than merely providing an empty
plural array unless executable compatibility behavior specifically requires the
latter.

---

## Backup Compatibility Evidence

Trace the current Version 1 backup path far enough to establish:

- V1 backup representation;
- backup validation;
- backup parsing/import;
- initial-state or import normalization;
- precedence between plural `shiftCycles` and singular `shiftCycle`;
- conversion of singular-only V1 backup data into runtime plural authority.

Add a direct fixture representing a supported singular-only V1 backup.

The fixture should exercise the real import/parse/normalization path rather than
testing a helper in isolation when the supported boundary can be exercised
directly.

---

## Existing Behavior Only

Tests should encode behavior that the current implementation already supports.

If the current implementation does not actually support a singular-only profile or
V1 backup in the manner Task 1.5 suggested, do not modify production code merely to
make the new test pass.

That discrepancy is architectural evidence and must return for project review.

---

# Required Questions

## 1. Singular-Only Profile Acceptance

Does the current supported profile path accept a profile containing:

```text
shiftCycle: legacy cycle
shiftCycles: absent
```

If yes:

- where is it normalized?
- what runtime plural state results?
- does singular runtime compatibility remain present afterward?

If no, record the discrepancy.

---

## 2. Singular-Only V1 Backup Acceptance

Does the current supported V1 backup path accept a backup containing:

```text
shiftCycle: legacy cycle
shiftCycles: absent
```

If yes:

- where is it validated?
- where is it normalized?
- what runtime plural state results?

If no, record the discrepancy.

---

## 3. Plural Precedence

For each boundary, determine the existing behavior when both representations are
present.

Where current behavior establishes plural precedence, preserve or explicitly test
that guarantee if doing so is directly relevant and narrowly scoped.

Do not invent a new precedence policy.

---

## 4. Current Writer Shape

Observe and record what newly created profile and backup payloads currently emit.

Do not change those writers.

The result should establish whether current output contains:

- plural only;
- plural plus singular mirror;
- plural plus null/optional singular field;
- another existing representation.

This evidence will inform a later task.

---

# Expected Fixture Characteristics

Fixtures should be:

- explicit;
- minimal;
- representative of supported legacy input;
- independent of current writer output;
- resistant to accidental modernization.

A legacy fixture should not be generated by the current serializer if doing so
would prevent it from representing the historical singular-only shape.

Prefer a literal legacy-shaped fixture or equivalent explicit construction.

The tests should make it obvious that `shiftCycles` is absent from the legacy input.

---

# Explicit Non-Goals

This task shall not:

- remove singular `shiftCycle`;
- stop profile writers from emitting singular fields;
- stop backup writers from emitting singular fields;
- change profile format;
- change backup format;
- change profile version;
- change backup version;
- change validators;
- change normalizers;
- change import semantics;
- change profile load semantics;
- change runtime `DayFrameState.shiftCycle`;
- remove `setShiftCycle`;
- change core singular aliases;
- remove any singular reader;
- define the final compatibility horizon;
- introduce a migration framework;
- change local-storage behavior established by Task 1.6;
- change scheduling behavior;
- address unrelated Phase 1 findings.

Production changes should not be necessary for the expected outcome.

If they appear necessary, stop and report why.

---

# Dependencies

Requires completion and project acceptance of:

- Task 1.5 — Establish Legacy `shiftCycle` Compatibility Boundary;
- Task 1.6 — Stop Writing Legacy `shiftCycle` Local-Storage Mirror.

Task 1.5 established the transitional compatibility classification.

Task 1.6 established the staged writer-retirement model for local storage.

---

# Implementation Requirements

The task should:

1. trace the real profile compatibility path;
2. trace the real V1 backup compatibility path;
3. create direct singular-only legacy profile evidence;
4. create direct singular-only V1 backup evidence;
5. verify accepted legacy data becomes plural `shiftCycles` authority;
6. preserve existing singular compatibility behavior;
7. record current profile and backup writer shapes;
8. avoid production modifications unless a non-behavioral test-enablement change is
   genuinely unavoidable and separately justified.

If any production modification would change compatibility semantics, stop for
project review.

---

# Behavioral Invariants

## Scheduling Authority

Plural `shiftCycles` remains the current scheduling authority.

---

## Local Storage

Task 1.6 behavior remains unchanged:

- legacy singular-only local storage remains readable;
- new local-storage writes remain plural-only.

---

## Profiles

Existing profile save/load behavior remains unchanged.

This task adds evidence; it does not redefine the contract.

---

## Backups

Existing backup export/import behavior remains unchanged.

This task adds evidence; it does not redefine the contract.

---

## Runtime Compatibility

Existing runtime singular compatibility behavior remains unchanged.

---

## Scheduling

No schedule-generation input or output should change.

---

# Validation Requirements

## Profile Validation

Add direct automated coverage demonstrating the actual existing behavior for a
singular-only legacy profile.

When supported, prove at minimum:

```text
legacy profile
    shiftCycle: {...}
    shiftCycles: absent
        ↓
load / normalization
        ↓
runtime shiftCycles: [...]
```

The test should fail if the singular compatibility reader is accidentally removed.

---

## Backup Validation

Add direct automated coverage demonstrating the actual existing behavior for a
singular-only Version 1 backup.

When supported, prove at minimum:

```text
legacy V1 backup
    shiftCycle: {...}
    shiftCycles: absent
        ↓
parse / import / normalization
        ↓
runtime shiftCycles: [...]
```

The test should fail if the singular compatibility reader is accidentally removed.

---

## Writer Observation

Tests or result evidence should record the current output shape of newly saved
profiles and newly exported backups.

Do not change the output shape in this task.

---

## Regression Validation

Run relevant suites covering:

- profiles;
- backup parsing/export/import;
- initial-state normalization;
- store profile loading;
- store backup import;
- shift-cycle compatibility;
- local-storage persistence where relevant.

Then run the repository standard validation sequence:

- `npm run lint`
- `npm run typecheck`
- `npm test -- --run`
- `npm run build`

---

# Architectural Validation

At completion, DayFrame should have explicit evidence for three distinct durable
compatibility boundaries:

```text
LOCAL STORAGE

legacy shiftCycle
      ↓
normalize
      ↓
shiftCycles
      ↓
new writes plural-only


PROFILE

legacy shiftCycle
      ↓
existing reader
      ↓
shiftCycles


V1 BACKUP

legacy shiftCycle
      ↓
existing reader
      ↓
shiftCycles
```

The latter two paths are being documented and tested, not modified.

---

# Required Result

The result artifact should include a compatibility table:

| Boundary | Singular-only accepted? | Normalization owner | Resulting authority | Current writer shape |
|----------|-------------------------|---------------------|---------------------|----------------------|
| Local storage | Previously established | | `shiftCycles` | plural-only |
| Saved profile | | | | |
| V1 backup | | | | |

It should also identify whether executable evidence supports a subsequent
writer-cleanup task for:

- profiles;
- backups;
- both;
- neither.

Do not perform that cleanup in Task 1.7.

---

# Documentation Updates

At completion:

- preserve this Task 1.7 specification unchanged;
- create
  `TASK_1.7_ESTABLISH_SINGULAR_ONLY_PROFILE_BACKUP_COMPATIBILITY_EVIDENCE_RESULT.md`;
- update `CURRENT_STATE.md` only after project review;
- include Task 1.7 in the next Session Checkpoint;
- do not update `CHANGELOG.md` solely for compatibility-test additions.

Historical documentation should remain unchanged.

---

# Completion Criteria

Task 1.7 is complete when:

- the complete profile compatibility path has been traced;
- the complete V1 backup compatibility path has been traced;
- an explicit singular-only legacy profile fixture exists if current behavior
  supports that shape;
- an explicit singular-only V1 backup fixture exists if current behavior supports
  that shape;
- tests establish the actual normalization behavior of those fixtures;
- plural scheduling authority remains unchanged;
- current profile writer shape is recorded;
- current backup writer shape is recorded;
- no unauthorized production compatibility change has occurred;
- relevant tests pass;
- lint passes;
- type checking passes;
- the full automated suite passes;
- the production build passes;
- the result identifies the smallest evidence-supported next compatibility step.

If either expected singular-only path is not actually supported, Task 1.7 may still
complete as an investigation, provided the discrepancy is explicitly documented
and no production behavior was changed to conceal it.

---

# Risks

Primary risks include:

- accidentally generating legacy fixtures through modern serializers;
- testing helper behavior without exercising the supported boundary;
- mistaking optional/null singular output for singular-only compatibility;
- modifying production validators to satisfy an assumed compatibility contract;
- conflating profile, backup, and local-storage migration boundaries;
- turning an evidence task into writer cleanup.

The safest implementation adds evidence around existing behavior and stops when
existing behavior contradicts assumptions.

---

# Deferred Work

This task does not decide or implement:

- profile writer cleanup;
- backup writer cleanup;
- profile format changes;
- backup version changes;
- runtime singular compatibility removal;
- `setShiftCycle` removal;
- core singular-input removal;
- local-storage reader removal;
- profile reader removal;
- backup reader removal;
- final compatibility-horizon policy;
- unrelated Phase 1 ownership findings.

Those decisions require the evidence established here.

---

# Expected Outcome

Task 1.7 should turn inferred profile and backup compatibility into explicit
executable guarantees.

If both singular-only paths work as expected, DayFrame will have protected reader
compatibility before considering additional writer convergence.

If either path does not work, the project will discover that discrepancy before
changing its durable-data output.

Both outcomes improve architectural certainty.

---

# Task Determination

Task 1.7 establishes evidence; it does not retire another compatibility boundary.

It protects the historical readers that must be understood before new profile or
backup output can safely converge toward plural-only state.

**The task is complete when direct executable evidence establishes what DayFrame
currently guarantees for singular-only legacy profile and V1 backup data.**