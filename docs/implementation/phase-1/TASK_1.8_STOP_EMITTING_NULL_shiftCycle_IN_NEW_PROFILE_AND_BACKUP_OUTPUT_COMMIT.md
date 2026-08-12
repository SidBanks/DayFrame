# Implementation Task 1.8 — Stop Emitting Null shiftCycle in New Profile and Backup Output

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.8

**Task Name:** Stop Emitting Null `shiftCycle` in New Profile and Backup Output

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during
execution.

Record the execution outcome in a separate result artifact:

`TASK_1.8_STOP_EMITTING_NULL_SHIFT_CYCLE_PROFILE_BACKUP_OUTPUT_RESULT.md`

The result artifact should document:

- implementation completed;
- executable paths inspected;
- clone-helper callers inspected;
- files changed;
- profile output before and after;
- backup output before and after;
- legacy-reader behavior preserved;
- tests added or updated;
- validation performed and results;
- architectural result;
- deviations from the authorized task, if any;
- discoveries and deferred work;
- recommended next task;
- final completion determination.

If implementation reveals that omitting the null singular property would change a
supported consumer, validation contract, version contract, or unrelated clone
caller, stop the affected work and record the discrepancy rather than broadening
this task.

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

> **The task is complete when new profile and backup output no longer emits a
> meaningless singular `shiftCycle` property while every established legacy
> singular reader remains intact.**

If the saved artifact is incomplete or truncated, do not begin execution.

Record the artifact-integrity failure for project review.

---

# Purpose

Stop newly created saved profiles and Version 1 backups from emitting the redundant
property:

```text
shiftCycle: null
```

while preserving all established singular `shiftCycle` input compatibility.

Task 1.5 classified singular `shiftCycle` as a Transitional Compatibility
Structure.

Task 1.6 stopped new local-storage persistence from emitting a singular mirror.

Task 1.7 then established direct executable evidence that singular-only legacy
profiles and V1 backups remain readable and normalize into plural `shiftCycles`
authority.

Task 1.7 also established that current profile and backup writers do not emit a
meaningful singular mirror. Instead, their shared authored-data clone path
materializes the optional singular property as `null`.

That output carries no current authored authority and is not required to preserve
the singular legacy readers.

This task removes that redundant writer output without weakening reader
compatibility.

---

# Architectural Context

The current durable-data compatibility model is:

```text
Legacy input
    shiftCycle only
        ↓
compatibility reader
        ↓
shiftCycles authority
```

Current new output differs by boundary:

```text
Local storage
    shiftCycles

Saved profile
    shiftCycles
    shiftCycle: null

V1 backup
    shiftCycles
    shiftCycle: null
```

The desired staged convergence is:

```text
NEW OUTPUT

Local storage ─┐
Profile ───────┼──→ shiftCycles only
Backup ────────┘


LEGACY INPUT

singular shiftCycle
        ↓
reader compatibility retained
        ↓
shiftCycles authority
```

The compatibility boundary should remain directional:

> Read legacy representations without continuing to manufacture them in new
> durable output.

---

# Objective

Change newly created saved-profile and V1-backup output so the optional singular
`shiftCycle` property is omitted rather than serialized/materialized as `null`.

Preserve:

- singular-only profile input;
- singular-only V1 backup input;
- plural precedence;
- runtime singular compatibility;
- current format versions;
- scheduling behavior.

No singular reader is removed by this task.

---

# Architectural Alignment

This task supports Phase 1 objectives to:

- eliminate obsolete compatibility output;
- reduce duplicated representations;
- clarify authoritative state;
- simplify durable-data shapes;
- preserve forward migration paths;
- strengthen architectural consistency.

It reinforces:

- Architecture Governs Implementation;
- Preserve Deterministic State Ownership;
- Preserve Forward Migration Paths;
- Eliminate Structural Debt;
- Evidence Before Preference;
- Replacement Over Perpetuation;
- Local Simplicity, Global Coherence;
- Epistemic Integrity.

---

# Scope

## Shared Clone Boundary Inspection

Before modifying the shared authored-data clone helper identified by Task 1.7,
inspect all executable callers.

Determine:

- which current writers use it;
- whether any runtime transition uses it;
- whether any validator or comparison depends on the singular property being
  explicitly present;
- whether callers distinguish an absent property from `shiftCycle: null`;
- whether changing the helper would affect output beyond saved profiles and
  backups.

If the shared helper cannot be changed without affecting an unauthorized boundary,
do not broaden the task.

Use a narrower writer-specific change or stop for project review, depending on the
evidence.

---

## Saved Profile Output

Change newly created saved-profile output from the current equivalent of:

```json
{
  "shiftCycles": [],
  "shiftCycle": null
}
```

to:

```json
{
  "shiftCycles": []
}
```

with the actual existing plural cycle data preserved.

This example illustrates property shape only; do not change cycle contents.

---

## Backup Output

Change newly exported Version 1 backup output from the current equivalent of:

```json
{
  "shiftCycles": [],
  "shiftCycle": null
}
```

to:

```json
{
  "shiftCycles": []
}
```

with the actual existing plural cycle data preserved.

Do not change the backup version.

---

## Reader Preservation

Retain the direct compatibility evidence established by Task 1.7.

A singular-only profile must still be accepted.

A singular-only V1 backup must still be accepted.

The task should update writer assertions without weakening or modernizing the
literal legacy fixtures.

---

# Required Questions

## 1. Clone Helper Impact

Which executable paths consume the shared clone helper?

Would omission of an undefined/null singular property affect any path outside the
authorized profile and backup writer boundary?

Record the answer in the result.

---

## 2. Profile Output Contract

Does any current supported behavior require a newly saved profile to contain an
explicit:

```text
shiftCycle: null
```

rather than having the property absent?

If yes, stop and report the evidence.

If no, omit it from new output.

---

## 3. Backup Output Contract

Does Version 1 backup validation or import require the singular property to be
present when plural `shiftCycles` exists?

If yes, stop and report the evidence.

If no, omit it from new output while retaining V1 compatibility readers.

---

## 4. Reader Independence

Confirm that legacy profile and backup readers do not depend on modern writers
continuing to emit the singular property.

Reader compatibility and writer output should remain independently testable.

---

# Explicit Non-Goals

This task shall not:

- remove singular profile readers;
- remove singular backup readers;
- remove singular local-storage readers;
- change local-storage persistence;
- remove runtime `DayFrameState.shiftCycle`;
- remove `setShiftCycle`;
- remove core singular-input aliases;
- change plural `shiftCycles`;
- change scheduling behavior;
- change profile version;
- change backup version;
- introduce a new backup version;
- introduce a new profile version;
- tighten profile validation;
- tighten backup validation;
- change malformed-input policy;
- change normalization defaults;
- change plural precedence;
- define the final compatibility horizon;
- remove legacy test fixtures;
- modernize legacy fixtures through current serializers;
- refactor unrelated clone behavior;
- address unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

- Task 1.5 — Establish Legacy `shiftCycle` Compatibility Boundary;
- Task 1.6 — Stop Writing Legacy `shiftCycle` Local-Storage Mirror;
- Task 1.7 — Establish Singular-Only Profile and Backup Compatibility Evidence.

Task 1.7 provides the direct reader evidence required before modifying these
writers.

---

# Implementation Requirements

The implementation must:

1. inspect all executable callers of the relevant shared clone helper before
   changing it;
2. stop newly created profiles from materializing `shiftCycle: null`;
3. stop newly exported V1 backups from materializing `shiftCycle: null`;
4. preserve complete plural `shiftCycles` data;
5. preserve singular-only profile reader behavior;
6. preserve singular-only V1 backup reader behavior;
7. preserve plural precedence;
8. preserve runtime singular compatibility;
9. preserve profile and backup versions;
10. preserve scheduling behavior;
11. avoid unrelated clone-helper refactoring.

If changing the shared helper affects unauthorized output, choose the smallest
writer-specific implementation that satisfies this task without changing those
other boundaries.

---

# Behavioral Invariants

## Canonical Authority

Plural `shiftCycles` remains the current authored and scheduling authority.

---

## Legacy Profile Input

The Task 1.7 singular-only profile fixture must continue to load successfully and
normalize into plural authority.

---

## Legacy Backup Input

The Task 1.7 singular-only V1 backup fixture must continue to parse/import
successfully and normalize into plural authority.

---

## Local Storage

Task 1.6 behavior remains unchanged.

New local-storage authored writes remain plural-only.

Legacy singular-only local storage remains readable.

---

## Runtime Compatibility

Existing runtime `state.shiftCycle` behavior remains unchanged.

---

## Versions

Profile and backup format versions remain unchanged.

---

## Scheduling

No schedule-generation input or output changes.

---

# Validation Requirements

## Clone Caller Validation

Record all executable callers of the modified clone/helper boundary.

Confirm that the chosen implementation does not change unauthorized output or
runtime behavior.

---

## Profile Writer Validation

Update or add tests proving newly saved profiles contain:

```text
shiftCycles: [...]
```

and that the singular property is absent.

Prefer an explicit property-absence assertion rather than merely checking that its
value is falsy.

---

## Backup Writer Validation

Update or add tests proving newly exported V1 backups contain:

```text
shiftCycles: [...]
```

and that the singular property is absent.

Again, assert absence explicitly.

---

## Legacy Profile Reader Validation

Retain the Task 1.7 literal singular-only profile fixture.

Confirm it still:

```text
shiftCycle only
    ↓
profile reader / normalization
    ↓
shiftCycles authority
```

Do not alter the fixture to include plural data.

---

## Legacy Backup Reader Validation

Retain the Task 1.7 literal singular-only V1 backup fixture.

Confirm it still:

```text
shiftCycle only
    ↓
backup reader / normalization
    ↓
shiftCycles authority
```

Do not alter the fixture to include plural data.

---

## Regression Validation

Run relevant suites covering:

- authored-data cloning;
- profiles;
- profile loading;
- backup export;
- backup parsing;
- backup import;
- initial-state normalization;
- store persistence;
- shift-cycle compatibility.

Then run:

- `npm run lint`
- `npm run typecheck`
- `npm test -- --run`
- `npm run build`

---

# Architectural Validation

Confirm the writer side changes from:

```text
Local storage
    shiftCycles

Profile
    shiftCycles
    shiftCycle: null

Backup
    shiftCycles
    shiftCycle: null
```

to:

```text
Local storage
    shiftCycles

Profile
    shiftCycles

Backup
    shiftCycles
```

while preserving:

```text
Legacy local storage shiftCycle ─┐
Legacy profile shiftCycle ───────┼──→ normalize → shiftCycles
Legacy V1 backup shiftCycle ─────┘
```

This task removes compatibility **output**, not compatibility **input**.

---

# Required Result

The result artifact should include:

| Boundary | Before new output | After new output | Legacy singular input retained? |
|----------|-------------------|------------------|---------------------------------|
| Local storage | `shiftCycles` | unchanged | Yes |
| Saved profile | `shiftCycles` + `shiftCycle: null` | | Yes |
| V1 backup | `shiftCycles` + `shiftCycle: null` | | Yes |

It should also report:

- the shared clone helper examined;
- all executable caller categories;
- whether the shared helper could be changed safely;
- whether a writer-specific implementation was required;
- any remaining singular writer boundary.

---

# Documentation Updates

At completion:

- preserve this Task 1.8 specification unchanged;
- create
  `TASK_1.8_STOP_EMITTING_NULL_SHIFT_CYCLE_PROFILE_BACKUP_OUTPUT_RESULT.md`;
- update `CURRENT_STATE.md` only after project review;
- include Task 1.8 in the next Session Checkpoint;
- do not update `CHANGELOG.md` solely for this compatibility cleanup.

Historical documentation remains unchanged.

---

# Completion Criteria

Task 1.8 is complete when:

- all relevant shared-clone callers have been inspected;
- newly saved profiles omit the singular `shiftCycle` property;
- newly exported V1 backups omit the singular `shiftCycle` property;
- plural `shiftCycles` remains complete and authoritative;
- the Task 1.7 singular-only profile fixture still passes;
- the Task 1.7 singular-only backup fixture still passes;
- local-storage compatibility remains unchanged;
- runtime singular compatibility remains unchanged;
- profile and backup versions remain unchanged;
- no unauthorized output boundary changes;
- no scheduling behavior changes;
- relevant automated tests pass;
- lint passes;
- type checking passes;
- the full suite passes;
- the production build passes;
- the result artifact records the resulting compatibility boundary.

---

# Risks

Primary risks include:

- changing a shared clone helper whose callers have different contracts;
- accidentally removing reader compatibility while cleaning writer output;
- confusing property absence with `null`;
- changing Version 1 validation requirements;
- altering legacy fixtures to match modern output;
- broadening a two-writer cleanup into runtime compatibility removal.

The task should remain focused on stopping meaningless new output while preserving
all established historical input paths.

---

# Deferred Work

This task does not resolve:

- runtime `DayFrameState.shiftCycle`;
- `setShiftCycle`;
- core singular aliases;
- singular local-storage reader retirement;
- singular profile reader retirement;
- singular backup reader retirement;
- final compatibility horizon;
- profile validation permissiveness;
- backup validation changes;
- format/version changes;
- unrelated Phase 1 ownership findings.

After Task 1.8, any further singular-compatibility removal must be separately
justified by executable evidence and an explicit compatibility policy.

---

# Expected Outcome

After Task 1.8, all three current durable writers should converge on the same
canonical representation:

```text
shiftCycles
```

while all established legacy singular readers remain available.

The migration model becomes:

```text
OLD DATA
singular shiftCycle
        ↓
accepted
        ↓
normalized
        ↓
plural authority


NEW DATA
plural shiftCycles only
```

DayFrame therefore continues supporting historical data without manufacturing new
durable representations of the legacy field.

---

# Task Determination

Task 1.8 removes redundant singular compatibility output from newly created
profiles and backups.

It does not remove legacy compatibility.

It advances the staged migration by making all current durable writers converge on
plural `shiftCycles` while historical singular readers remain protected by direct
executable evidence.

**The task is complete when new profile and backup output no longer emits a
meaningless singular `shiftCycle` property while every established legacy
singular reader remains intact.**