# Task 1.38 — Establish Serialization-Failure Recovery Semantics and User Recovery Boundaries

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.38

**Task Name:** Establish Serialization-Failure Recovery Semantics and User Recovery Boundaries

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation / Architectural Contract Decision

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning the investigation, verify that this task artifact is complete and record its integrity hash.

Record the investigation outcome in a separate result artifact:

`TASK_1.38_ESTABLISH_SERIALIZATION_FAILURE_RECOVERY_SEMANTICS_AND_USER_RECOVERY_BOUNDARIES_RESULT.md`

The result artifact should document:

* serialization-failure producer inventory;
* active-state serialization boundary;
* profile serialization boundary;
* current runtime-valid-but-nonserializable possibilities;
* current test-only failure injection versus realistic production failure;
* recoverable versus non-recoverable information;
* current authored-state preservation obligations;
* recovery candidate models;
* edit-and-resave viability;
* export viability;
* profile checkpoint viability;
* backup checkpoint viability;
* reset viability and risks;
* active/profile recovery differences;
* recovery authority;
* recovery UI boundary;
* future-engine coupling assessment;
* minimum Phase 1 recovery obligation;
* deferred model-specific recovery work;
* validation;
* recommended next task;
* final completion determination.

This task is investigation only.

Do not modify production code, tests, UI, persistence helpers, retry behavior, durable formats, recovery actions, migrations, storage keys, versions, or `DayFrameState`.

If a recovery behavior cannot be justified from current executable evidence and adopted architecture, classify it as unresolved or deferred rather than inventing policy.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Architectural Context;
* Governing Evidence;
* Objective;
* Investigation Questions;
* Recovery Candidate Models;
* Future-Engine Coupling Assessment;
* Minimum Phase 1 Recovery Obligation;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame has an evidence-backed serialization-failure recovery contract defining what current information must be preserved, which recovery actions are safe or unsafe, how active-state and profile recovery differ, when edit-and-resave is sufficient, what must remain deferred until the authored-data architecture changes, and what minimum recovery behavior Phase 1 actually requires without prematurely designing model-specific repair.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the integrity discrepancy for project review.

---

# Purpose

Determine what DayFrame should mean by:

```text
recoveryRequired
```

when persistence fails because the current representation cannot be serialized.

Tasks 1.24–1.37 established a complete ordinary durability-retry path:

```text
persistence failure
    ↓
retained durability
    ↓
persistent awareness
    ↓
explicit Retry
    ↓
store-owned retry
```

That path intentionally stops at:

```text
serializationFailure
```

because unchanged retry may deterministically fail again.

Task 1.38 investigates what recovery should mean without prematurely coupling DayFrame to today's authored-data shape.

---

# Architectural Context

The current durability model distinguishes:

```text
unavailable
storageFailure
    → ordinary retry

serializationFailure
    → recovery required
```

The current UI correctly shows persistent recovery-required awareness and suppresses Retry.

What does not yet exist is an architectural answer to:

> What can the user safely do next?

This question must be answered before recovery controls are added.

---

# Governing Evidence

Task 1.28 established:

> Retry attempts again to establish the current desired durable condition.

It also established:

> Recovery chooses, repairs, reconstructs, or selects another representation because ordinary retry is insufficient.

Task 1.34 maps:

```text
serializationFailure
    → recoveryRequired
```

Task 1.36 exposes that state persistently.

Task 1.37 intentionally adds no retry control for it.

The durable-data ADR requires:

* non-destructive behavior;
* user-data preservation;
* explicit unsupported/failure handling;
* recovery continuity;
* deterministic ownership;
* no silent degradation.

---

# Important Scope Constraint

DayFrame's authored-data model is expected to change substantially during later architecture/engine alignment.

Therefore Task 1.38 must distinguish between:

## Stable Recovery Principles

Likely to survive future engine/model changes.

Examples:

* preserve current runtime intent;
* do not silently discard authored data;
* avoid blind retry;
* do not overwrite a known-good checkpoint without success;
* make recovery explicit;
* distinguish recovery sources from runtime authority.

## Model-Specific Repair Mechanics

Likely to become obsolete when the authored model changes.

Examples:

* identifying one current `shiftCycle`-related field;
* repairing a current block-template structure;
* building field-specific serialization diagnostics;
* adding current-schema-specific recovery editors.

Task 1.38 should prefer the first category and defer the second unless current evidence demonstrates immediate necessity.

---

# Objective

Determine:

1. what currently causes or can cause serialization failure;
2. whether realistic production state can reach it;
3. what runtime information remains available after failure;
4. what durable checkpoints may remain available;
5. whether ordinary user editing can repair the current state;
6. whether exporting the current state is viable when serialization itself fails;
7. whether profiles or backups can serve as recovery checkpoints;
8. whether reset is ever a safe recovery action;
9. how active-state recovery differs from profile recovery;
10. which layer owns recovery choices;
11. what minimum recovery behavior Phase 1 should provide;
12. what should be deferred until after the authored-data/engine redesign.

---

# Serialization Failure Producer Inventory

Inspect every current source of:

```text
serializationFailure
```

At minimum inspect:

* active-state persistence;
* profile persistence;
* any backup/export serialization path that uses related helpers;
* store mutation paths capable of producing the status;
* retry paths capable of transitioning into serialization failure;
* tests that manufacture serialization failure.

For each, record:

* serialization function used;
* input object;
* source of that object;
* whether runtime validation constrains its contents;
* whether normal production UI can create problematic values;
* whether only tests currently inject such values.

---

# Production Reachability Question

Determine whether `serializationFailure` is:

## A. Realistically reachable through supported production workflows

or:

## B. Primarily a defensive boundary for unexpected runtime/programming state

or:

## C. Both

Do not infer from the existence of the outcome type alone.

Trace actual authored-data creation paths.

This classification materially affects how much recovery UX Phase 1 should build.

---

# JSON Serialization Failure Analysis

Inspect current serialization mechanics.

Determine whether failures could arise from:

* circular references;
* `BigInt`;
* custom throwing `toJSON`;
* unsupported runtime values;
* accidental non-domain objects;
* other JavaScript serialization behavior.

Do not assume all theoretical JSON failures are reachable from current typed DayFrame data.

Separate:

```text
theoretically possible
```

from:

```text
supported production path can produce it
```

---

# Active-State Recovery Boundary

When active-state persistence returns:

```text
serializationFailure
```

determine what remains true.

Expected current model:

```text
runtime authored state
    = still authoritative for this session

last known durable active state
    = may remain intact

current runtime state
    = not durably established
```

Confirm from executable behavior.

Determine whether recovery should preserve both:

* current in-memory authored intent;
* prior durable checkpoint.

---

# Profile Recovery Boundary

When profile persistence serialization fails, determine:

```text
runtime savedProfiles
    = current session collection

durable profile collection
    = prior checkpoint may remain intact
```

Analyze save and delete separately if meaningful.

A profile save failure and delete failure may have different user-recovery implications even though both use the same collection writer.

---

# Existing Checkpoint Preservation

Determine what existing persistence behavior guarantees when serialization fails.

Specifically verify whether serialization occurs before durable replacement.

If yes:

```text
serialization fails
    ↓
setItem is never called
    ↓
existing durable checkpoint remains untouched
```

This is likely a critical recovery invariant.

Confirm with executable tests.

---

# Required Preservation Invariant

If supported by evidence, adopt:

> **Serialization failure must never destroy or overwrite the last successfully durable representation.**

This should become a recovery foundation.

If current implementation does not guarantee this, record it as a blocking discrepancy rather than designing recovery UI on top of unsafe behavior.

---

# Current Runtime Preservation

Confirm that valid runtime mutations remain applied despite serialization failure.

If so, adopt:

> **Recovery begins from a session in which the user's latest runtime intent may still be available even though the last durable checkpoint is older.**

This creates two potentially valuable representations:

```text
latest session intent
last durable checkpoint
```

Neither should be silently discarded.

---

# Candidate Recovery Model A — Edit and Persist Again

Model:

```text
serializationFailure
    ↓
user changes authored data
    ↓
ordinary mutation
    ↓
new serialization/persistence attempt
```

Investigate whether this is sufficient for recoverable current-state problems.

Benefits:

* already fits session-first architecture;
* no new retry command;
* latest intent remains authoritative;
* successful ordinary mutation naturally clears retained durability.

Risks:

* user may not know which field is problematic;
* not useful if failure arises from hidden/programming state;
* model-specific diagnostics may be required.

Classify viability.

---

# Candidate Recovery Model B — Export Current Runtime State

Investigate whether DayFrame can safely export the current in-memory authored representation after ordinary persistence serialization has failed.

Important question:

> If `JSON.stringify` cannot serialize the current state for local persistence, can the same state meaningfully be exported through existing backup machinery?

Do not assume yes.

Trace whether backup export ultimately relies on equivalent serialization.

If it would fail for the same reason, classify this model as unavailable without additional transformation.

---

# Candidate Recovery Model C — Preserve/Export Diagnostic Representation

Consider conceptually whether a future recovery path could preserve information in a more defensive representation than normal durable serialization.

Examples might include:

* diagnostic textual representation;
* field-path report;
* sanitized export.

Do **not** design or implement one.

Determine only whether the architecture should preserve room for such tooling.

---

# Candidate Recovery Model D — Revert to Last Durable Checkpoint

Potential recovery:

```text
current runtime non-durable state
    ↓
explicit user choice
    ↓
reload last known durable state
```

Investigate whether current architecture can actually read that checkpoint safely and whether doing so would overwrite newer session intent.

Risks are substantial.

Any future revert must be:

* explicit;
* non-destructive where possible;
* preceded by preservation/recovery opportunity for current runtime intent where feasible.

Do not recommend automatic rollback.

---

# Candidate Recovery Model E — Load Saved Profile

For active-state failure, a saved profile may provide a durable checkpoint.

Investigate whether profile load can serve as **one optional recovery source**.

Do not make the source profile authoritative automatically.

A profile is a user-selected recovery source, not retry input.

---

# Candidate Recovery Model F — Re-import Backup

For active-state failure, an external backup may provide a recovery source.

Investigate whether backup import is logically appropriate as an explicit recovery option.

Do not turn backup import into automatic recovery.

The backup may be older than current session intent.

---

# Candidate Recovery Model G — Reset

Investigate whether reset/clear should ever be presented as a serialization recovery option.

Risk:

```text
serialization problem
    ↓
user chooses reset
    ↓
latest session intent destroyed
```

This is potentially destructive.

Default stance should be conservative.

Do not recommend reset merely because it guarantees serializable defaults.

---

# Candidate Recovery Model H — Application Reload

Investigate what reload would do after serialization failure.

Likely:

```text
current session non-durable state
    ↓ reload
last durable checkpoint rehydrates
```

That may silently discard the latest session intent.

Therefore reload is not necessarily a recovery strategy; it may be data loss.

Document explicitly.

---

# Recovery Candidate Matrix

Produce a matrix:

| Recovery Candidate             | Preserves Current Session Intent | Uses Existing Durable Checkpoint | Works If Current State Cannot Serialize | Destructive Risk | Model Coupling | Recommendation |
| ------------------------------ | -------------------------------: | -------------------------------: | --------------------------------------: | ---------------: | -------------: | -------------- |
| Edit and persist again         |                                  |                                  |                                         |                  |                |                |
| Export current runtime         |                                  |                                  |                                         |                  |                |                |
| Diagnostic/sanitized export    |                                  |                                  |                                         |                  |                |                |
| Revert to durable active state |                                  |                                  |                                         |                  |                |                |
| Load profile                   |                                  |                                  |                                         |                  |                |                |
| Import backup                  |                                  |                                  |                                         |                  |                |                |
| Reset/clear                    |                                  |                                  |                                         |                  |                |                |
| Reload application             |                                  |                                  |                                         |                  |                |                |

---

# Recovery Authority

Determine ownership.

Preferred conceptual model:

```text
Store
    → reports durability facts
    → retains runtime truth
    → executes ordinary persistence/retry

Workflow / recovery surface
    → presents explicit recovery choices

User
    → chooses destructive or state-replacing recovery

Dedicated recovery operation
    → executes selected recovery through store-owned mutation boundary
```

Do not place recovery authority inside persistence helpers.

---

# Recovery Is Not Retry

Preserve the explicit distinction:

```text
Retry
    = same current desired condition, attempt again

Recovery
    = user intentionally changes/selects the representation
      or preservation strategy because current representation
      cannot simply be persisted unchanged
```

Task 1.38 should make this distinction normative.

---

# Recovery Is Not Rollback

Do not equate:

```text
recovery
```

with:

```text
restore previous durable state
```

Rollback may be one future recovery option but is potentially destructive to newer session intent.

---

# Recovery Is Not Clear

Likewise, clearing data is not inherently recovery.

It may be an emergency destructive option only if explicitly authorized later.

---

# Active Versus Profile Recovery

Determine whether the two surfaces require different recovery models.

Potential active-state sources:

* current runtime authored state;
* last durable active checkpoint;
* saved profile;
* external backup.

Potential profile sources:

* current runtime profile collection;
* last durable profile collection;
* possibly backups if backup format contains profile data — verify rather than assume.

Do not force one recovery model across both surfaces if evidence differs.

---

# Profile Collection Atomicity

Task 1.22 adopted strong profile preservation expectations.

Investigate whether a single serialization-invalid profile could prevent persistence of the whole profile collection.

If yes, determine the architectural implication:

```text
one problematic runtime profile
    ↓
entire collection non-durable
```

Potential future recovery might require isolating or removing one entry, but that would be model-specific.

Do not implement it here.

---

# Recovery Entry Point

Determine whether future recovery should live:

* inside persistent durability awareness;
* in a dedicated recovery panel/surface;
* in the originating workflow;
* another location.

Decision standard:

Recovery may be more complex and potentially destructive than Retry.

A dedicated recovery surface may therefore be preferable.

Do not implement the surface.

---

# Recovery Required Persistent Awareness

Task 1.36 already keeps `recoveryRequired` visible.

Task 1.38 should determine what future action that state should eventually expose.

Do not add the action now.

---

# Minimal Phase 1 Obligation

This is the most important decision in the task.

Determine whether Phase 1 actually needs to implement recovery mechanics now.

Possible classifications:

## Option A — Full Recovery Required In Phase 1

Only if realistic production serialization failure can occur and user data would otherwise be trapped.

## Option B — Minimal Safe Recovery Boundary

For example:

* persistent recovery-required awareness;
* no destructive automatic action;
* current session remains usable;
* existing checkpoint remains preserved;
* user can continue editing;
* model-specific recovery deferred.

## Option C — Recovery Implementation Deferred Entirely

Only if current production state cannot realistically reach serialization failure and existing defensive awareness is sufficient for architectural alignment.

Do not choose based on desire to finish quickly. Use evidence.

---

# Future-Engine Coupling Assessment

For every proposed recovery mechanism, classify coupling:

```text
Low coupling
    likely survives authored-model redesign

Medium coupling
    requires some adaptation

High coupling
    tightly tied to current shift/template/recurrence model
```

Examples likely to be low coupling:

* preserve last durable checkpoint;
* preserve current runtime state;
* explicit user consent before destructive recovery;
* edit-and-repersist;
* recovery versus retry distinction.

Examples likely to be high coupling:

* field-level repair for today's authored types;
* current-schema-specific validation UI;
* entity-specific serialization diagnostics.

Produce a table.

---

# Required Future-Coupling Matrix

| Recovery Principle/Mechanism | Coupling To Current Model | Likely Survives Engine Redesign? | Phase 1 Recommendation |
| ---------------------------- | ------------------------- | -------------------------------: | ---------------------- |
| Preserve runtime intent      |                           |                                  |                        |
| Preserve durable checkpoint  |                           |                                  |                        |
| Edit and persist again       |                           |                                  |                        |
| Generic recovery surface     |                           |                                  |                        |
| Field-specific repair        |                           |                                  |                        |
| Entity-specific diagnostics  |                           |                                  |                        |
| Profile isolation/removal    |                           |                                  |                        |
| Backup restore               |                           |                                  |                        |
| Reset                        |                           |                                  |                        |

---

# Engine-Redesign Boundary

Task 1.38 must explicitly answer:

> Which serialization-recovery work should intentionally wait until the future authored-data architecture is established?

This is required.

Do not leave the investigation with a generic “future work” statement.

Identify concrete classes of work that would be premature now.

---

# Derived-State Separation

Investigate whether serialization recovery must preserve only authored/recovery-relevant state rather than derived Preview/engine output.

Expected principle:

```text
authored intent
    → preserve/recover

recomputable Preview/schedule
    → regenerate
```

Confirm against current durable boundary.

This principle is likely important for future engine redesign.

---

# Backup Export Viability

Trace current backup export.

Determine:

* what object is serialized;
* whether it uses the same problematic runtime values;
* whether backup creation clones/transforms the authored setup first;
* whether serialization failure in local persistence implies backup export failure.

Do not assume current backup is a universal escape hatch.

---

# Profile Save As Recovery

For active-state serialization failure, determine whether:

```text
save current state as a profile
```

would likely fail through the same serialization issue.

If profile data contains the same authored representation, it may not be a viable escape route.

Verify.

---

# Recovery Diagnostics

Determine whether current persistence outcomes retain enough information to diagnose the source of serialization failure.

Likely:

```text
serializationFailure
```

contains no error detail.

If so, note that meaningful field-specific diagnosis would require a separately designed diagnostic contract.

Do not casually expose raw exceptions as the solution.

---

# Raw Exception Policy

Evaluate whether future recovery diagnostics need more than the current factual category.

Consider:

* privacy;
* internal implementation leakage;
* stability;
* actionable value;
* debugging usefulness.

Do not adopt raw exception exposure without a separate decision.

---

# Recovery Safety Principles

The result should determine whether the following become normative:

1. never automatically discard current runtime intent;
2. never automatically overwrite the last durable checkpoint with known-bad data;
3. never treat reload as harmless after known non-durable changes;
4. require explicit user action for destructive/state-replacing recovery;
5. preserve recovery sources independently;
6. ordinary successful mutation may resolve recovery-required state naturally;
7. model-specific repair should wait until the authored model stabilizes unless current production reachability demands it.

Evaluate each against evidence.

---

# Recovery Completion

Determine what should count as recovery completion.

Potential rule:

```text
user changes/selects representation
    ↓
ordinary persistence succeeds
    ↓
retained durability = durable
    ↓
recovery-required awareness disappears
```

This avoids a separate durable “recovered” status.

Assess whether a new recovery status is necessary.

Default preference: no new retained status unless evidence requires it.

---

# No New Durability Status

Task 1.38 should strongly prefer preserving:

```text
unknown
durable
unavailable
storageFailure
serializationFailure
```

Recovery is a workflow/process state, not necessarily a new durability fact.

Do not recommend:

```text
recovering
recovered
repairRequired
```

without evidence.

---

# User Communication Boundary

Determine semantic information future UI must communicate.

At minimum:

```text
current session changes remain active
they are not durably saved
ordinary Retry is unavailable
reloading may lose those session changes
```

if each statement is supported by evidence.

Do not draft final product copy.

---

# Reload Warning Question

Explicitly answer:

> Should DayFrame warn the user against reload/closing while active-state serialization failure is unresolved?

This is potentially important because session-first runtime changes may be lost.

Determine whether:

* persistent recovery-required awareness is sufficient;
* browser unload protection is warranted;
* unload protection would be premature or intrusive.

Do not implement unload behavior.

---

# Session-End Risk

Analyze:

```text
serializationFailure
    ↓
user closes app/tab
    ↓
latest runtime changes disappear
    ↓
last durable checkpoint returns next launch
```

If confirmed, classify this as a user-data risk that future recovery UX must communicate.

---

# Profile Session-End Risk

Likewise determine what happens to runtime profile changes that failed serialization when the session ends.

Do not assume active and profile behavior are identical.

---

# Investigation Questions

The result must answer all of the following:

1. What exact current code path produces `serializationFailure`?
2. Can supported production UI realistically create unserializable authored state?
3. Does serialization fail before durable writes occur?
4. Is the previous durable checkpoint preserved?
5. Is the latest runtime state preserved?
6. Can ordinary editing naturally recover the condition?
7. Can backup export preserve the current state?
8. Can profile save preserve active state?
9. Can profile load serve as recovery?
10. Can backup import serve as recovery?
11. Is reset safe?
12. Is reload dangerous?
13. Does profile recovery require different handling?
14. Is field-specific diagnosis currently possible?
15. Does Phase 1 need actual recovery controls?
16. What must wait for the future authored-model redesign?
17. What is the smallest dependency-correct next task?

---

# Required Recovery Decision Matrix

Produce:

| Condition                                    | Ordinary Retry? | Continue Session? | Ordinary Editing Potentially Resolves? | Explicit Recovery Needed? | Destructive Risk | Recommendation |
| -------------------------------------------- | --------------: | ----------------: | -------------------------------------: | ------------------------: | ---------------: | -------------- |
| Active serialization failure                 |                 |                   |                                        |                           |                  |                |
| Profile serialization failure                |                 |                   |                                        |                           |                  |                |
| Retry transitions into serialization failure |                 |                   |                                        |                           |                  |                |

---

# Required Ownership Map

Produce:

| Responsibility                       | Owner |
| ------------------------------------ | ----- |
| Detect serialization failure         |       |
| Retain durability status             |       |
| Preserve current runtime truth       |       |
| Preserve durable checkpoint          |       |
| Present recovery-required awareness  |       |
| Choose recovery action               |       |
| Execute state-changing recovery      |       |
| Persist repaired/replaced state      |       |
| Diagnose model-specific invalid data |       |
| Decide destructive reset             |       |

---

# Explicit Non-Goals

Task 1.38 shall not:

* implement recovery UI;
* add recovery buttons;
* add export controls;
* add repair controls;
* add reset controls;
* add reload protection;
* add before-unload prompts;
* change persistence outcomes;
* expose raw errors;
* change retry semantics;
* add automatic retry;
* change retained durability values;
* add recovery state to `DayFrameState`;
* alter durable payloads;
* change storage keys;
* increment format versions;
* modify migrations;
* change validators;
* change normalizers;
* remove compatibility readers;
* redesign the authored data model;
* redesign the scheduling engine;
* implement future architecture entities;
* perform field-specific repair;
* resolve unrelated Phase 1 findings.

---

# Dependencies

Requires completion and project acceptance of:

* Task 1.28 — retry versus recovery semantics;
* Task 1.31 — explicit store-owned retry;
* Task 1.34 — recovery-required semantic classification;
* Task 1.36 — persistent recovery-required awareness;
* Task 1.37 — user-triggered retry with recovery-required suppression.

Governed by:

* `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`.

---

# Evidence Standards

Use classifications:

* **Confirmed** — directly established in executable code/tests/history;
* **Inferred** — strongly implied by current implementation but not directly asserted;
* **Recommended** — architectural conclusion from evidence;
* **Deferred** — intentionally postponed;
* **Unresolved** — evidence insufficient.

Do not treat TypeScript type intent as proof that impossible runtime values cannot exist.

Likewise, do not treat theoretically possible JavaScript values as supported DayFrame user states without tracing a production path.

---

# Required Code Inspection

At minimum inspect:

* active persistence serialization;
* profile persistence serialization;
* authored setup extraction/cloning;
* current mutation input boundaries;
* profile creation paths;
* manual-event creation paths;
* backup creation/export;
* backup import;
* current serialization-failure tests;
* retry tests that transition to serialization failure;
* application workflows capable of reaching recovery-required state.

---

# Test Review

Inspect existing tests proving:

* serialization failure does not write;
* runtime mutation remains applied;
* retained status becomes serialization failure;
* Retry is blocked afterward;
* persistent awareness remains;
* Retry disappears.

Determine what is currently test-only versus production-reachable.

---

# Validation Requirements

This task is investigation only.

Do not modify executable files or tests.

Run targeted tests only where needed to confirm current behavior.

At minimum consider:

```text
src/state/tests/dayFrameStore.test.ts
src/state/durabilitySemantics.test.ts
src/ui/tests/DayFrameApp.test.tsx
```

Run repository-standard validation if required by current execution workflow:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Confirm:

* no executable file changed;
* Task 1.38 specification remained immutable;
* result artifact is separate;
* no recovery control was added;
* no persistence/retry semantics changed.

---

# Documentation Rules

During Task 1.38:

## Create

* `TASK_1.38_ESTABLISH_SERIALIZATION_FAILURE_RECOVERY_SEMANTICS_AND_USER_RECOVERY_BOUNDARIES_RESULT.md`

## Preserve

* Task 1.38 specification;
* Tasks 1.23–1.37 results;
* durable-data ADR;
* current architecture/governance documentation;
* checkpoints and historical artifacts.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* durable-data ADR;
* Session Checkpoint.

Those require project review.

Do not create a task-specific checkpoint.

---

# Required Result Artifact Structure

The Task 1.38 result should contain:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Serialization Failure Producer Inventory
5. Active-State Serialization Boundary
6. Profile Serialization Boundary
7. Production Reachability
8. Current Failure Injection Strategy
9. Runtime Preservation
10. Durable Checkpoint Preservation
11. Session-End Risk
12. Profile Session-End Risk
13. Candidate Recovery Models
14. Recovery Candidate Matrix
15. Edit-And-Repersist Viability
16. Current Runtime Export Viability
17. Diagnostic/Sanitized Export Viability
18. Last-Durable-State Reversion
19. Profile Recovery Sources
20. Backup Recovery Sources
21. Reset/Clear Risk
22. Reload Risk
23. Active Versus Profile Recovery
24. Profile Collection Atomicity
25. Recovery Authority
26. Recovery Entry-Point Recommendation
27. Recovery Completion Semantics
28. Recovery Safety Principles
29. Raw Diagnostic/Error Boundary
30. User Communication Requirements
31. Reload/Close Warning Determination
32. Future-Engine Coupling Assessment
33. Future-Coupling Matrix
34. Model-Specific Work To Defer
35. Minimum Phase 1 Recovery Obligation
36. Required Recovery Decision Matrix
37. Ownership Map
38. ADR Alignment
39. Unresolved Questions
40. Deviations
41. Discoveries and Deferred Work
42. Recommended Next Task
43. Validation
44. Final Completion Determination

---

# Expected Architectural Outcomes

Several outcomes are possible.

## Outcome A — Minimal Generic Recovery Is Needed Now

For example:

```text
serializationFailure
    ↓
persistent warning
    ↓
user continues editing
    ↓
ordinary successful mutation restores durability
```

with possibly a dedicated explanation that reload may lose current changes.

Model-specific repair remains deferred.

## Outcome B — Dedicated Generic Recovery Surface Needed

If current production paths can realistically trap valuable runtime data with no safe escape, Task 1.38 may recommend a small recovery surface before engine redesign.

## Outcome C — Recovery Mechanics Should Be Deferred

If serialization failure is currently a defensive/injected condition not realistically constructible through supported workflows, the correct Phase 1 result may be:

```text
keep defensive classification
keep persistent awareness
preserve checkpoint
do not build schema-specific recovery now
```

and return to higher-value architecture alignment.

The investigation must choose based on evidence.

---

# Expected Follow-Up

Do not assume Task 1.39 is a recovery implementation.

Task 1.38 must determine the next dependency-correct seam.

Possible next tasks include:

### If minimal communication is sufficient

> **Task 1.39 — Clarify Recovery-Required Session-Risk Communication**

### If generic recovery infrastructure is justified

> **Task 1.39 — Establish a Generic Non-Destructive Recovery Entry Point**

### If current serialization failure is effectively defensive only

> **Conclude the durability implementation sequence for Phase 1 and return to the next architectural-alignment domain.**

That third outcome is explicitly acceptable.

---

# Completion Criteria

Task 1.38 is complete when:

* every current serialization-failure producer is inventoried;
* production reachability is established or explicitly unresolved;
* active-state runtime preservation is established;
* profile runtime preservation is established;
* last durable checkpoint preservation is established or identified as a gap;
* session-end risk is documented;
* edit-and-repersist viability is determined;
* backup-export viability is determined;
* profile-save-as-recovery viability is determined;
* profile-load recovery value is determined;
* backup-import recovery value is determined;
* reset risk is determined;
* reload risk is determined;
* active/profile recovery differences are established;
* recovery authority is assigned;
* recovery entry-point requirements are determined;
* destructive actions require explicit authorization;
* recovery completion semantics are defined;
* model-specific diagnostic/repair work is classified for deferral or necessity;
* future-engine coupling is explicitly assessed;
* minimum Phase 1 recovery obligation is decided;
* no executable behavior changes;
* validation passes;
* a dependency-correct next task or durability-sequence stopping point is identified.

---

# Task Determination

Task 1.38 is an investigation into the boundary between durability retry and recovery.

It deliberately does not assume that today's authored-data structure deserves a detailed recovery system before the larger architecture and engine redesign.

Its purpose is to establish stable recovery principles, user-data preservation obligations, and the minimum safe Phase 1 recovery contract while identifying model-specific repair work that should wait for the future authored-data architecture.

**The task is complete when DayFrame has an evidence-backed serialization-failure recovery contract defining what current information must be preserved, which recovery actions are safe or unsafe, how active-state and profile recovery differ, when edit-and-resave is sufficient, what must remain deferred until the authored-data architecture changes, and what minimum recovery behavior Phase 1 actually requires without prematurely designing model-specific repair.**
