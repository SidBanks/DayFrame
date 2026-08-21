# Task 2.16 — Establish Historical Authored-Ingress Validation, Activation, and Recovery Semantics

**Project:** DayFrame
**Phase:** Phase 2 — Authority and State Alignment
**Task ID:** 2.16
**Execution Type:** Investigation / Architectural Compatibility Decision
**Status:** Ready for execution

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before performing the investigation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution findings must be recorded separately in:

`TASK_2.16_ESTABLISH_HISTORICAL_AUTHORED_INGRESS_VALIDATION_ACTIVATION_AND_RECOVERY_SEMANTICS_RESULT.md`

This task is investigation and architectural decision only.

Do not modify:

* production code;
* tests;
* store behavior;
* durable formats;
* persistence keys;
* profile formats;
* backup formats;
* compatibility readers;
* migrations;
* UI;
* recovery workflows;
* architecture governance documents;
* checkpoints.

No implementation is authorized by this task.

If evidence reveals that one ingress surface requires an independent prerequisite decision before its policy can be established, record that dependency rather than inventing behavior.

---

# 2. Purpose

Task 2.15 established a complete semantic validation boundary for **new proposed current authored mutations**.

Current-authoring flow is now:

```
candidate authored snapshot
    ↓
validate
    ↓
valid
    → may become current runtime authority

invalid
    → rejected before any runtime,
      Preview, persistence,
      durability, or notification effect
```

Task 2.15 intentionally did not apply that policy to historical durable ingress.

DayFrame still has three major historical authored-data ingress surfaces:

1. active local-state rehydration;
2. saved-profile load;
3. backup import.

Those sources may contain DayFrame-produced authored data created before the current validation contract existed.

Such data may be:

* structurally readable;
* format-compatible;
* successfully normalized;
* yet semantically invalid or ambiguous under the current authored validator.

Task 2.16 must determine what DayFrame is allowed to do in that situation.

---

# 3. Governing Architectural Context

Phase 1 established that durable authored data written or exported by DayFrame is user data.

Historical representations must be handled through explicit:

* compatibility;
* migration;
* conversion;
* or non-destructive recovery.

In-memory normalization is not durable migration.

Unsupported or ambiguous durable data must not silently degrade into incomplete current state.

Task 2.15 added a pure semantic validator capable of reporting current authored validity without embedding ingress policy.

Task 2.16 determines how historical ingress boundaries consume those semantic facts.

---

# 4. Core Architectural Distinction

Task 2.16 must preserve:

```
validator
    ↓
semantic facts
```

separately from:

```
ingress boundary
    ↓
activation / preservation / recovery policy
```

The same snapshot may produce the same validation result at every boundary while requiring different operational handling.

For example:

```
active local checkpoint
    → startup authority problem

saved profile
    → selectable checkpoint problem

backup file
    → external recovery artifact problem
```

Do not collapse these into one generic invalid-data policy.

---

# 5. Objective

Determine:

1. whether the Task 2.15 validator should be reused at historical ingress;
2. at what point in each ingress pipeline validation should occur;
3. what classes of ingress failure must remain distinct;
4. what invalid historical authored data may activate;
5. when activation must be blocked;
6. what original source data must be preserved;
7. whether safe fallback is allowed;
8. whether fallback may be automatic;
9. what result/status semantics each boundary requires;
10. how partial activation must be treated;
11. what recovery authority belongs to workflows versus store/infrastructure;
12. whether valid-but-advisory historical data may activate;
13. how existing compatibility normalization interacts with semantic validation;
14. whether migration is required before activation for any class;
15. whether original durable bytes/objects must remain untouched after detection;
16. whether durability status may describe historical-ingress problems;
17. what next implementation sequence is dependency-correct.

---

# 6. Historical Ingress Surfaces

Task 2.16 must investigate separately:

## 6.1 Active Local-State Rehydration

Data from the active local persistence key during store construction.

## 6.2 Saved-Profile Load

A stored profile selected by the user and used to replace active authored state.

## 6.3 Backup Import

A user-supplied backup artifact parsed, validated, normalized, and used to replace active authored state.

Do not assume identical behavior across these surfaces.

---

# 7. Existing Ingress Pipeline Inventory

Trace the current executable pipeline for each surface.

At minimum identify:

* raw input source;
* format/version check;
* structural parse/validation;
* legacy compatibility normalization;
* authored normalization;
* cloning;
* active-state replacement;
* Preview clearing;
* persistence attempt;
* durability update;
* subscriber notification;
* result returned to caller.

Produce:

| Surface | Raw Input | Format Gate | Normalization | Activation Point | Persistence After Activation | Current Failure Result |
| ------- | --------- | ----------- | ------------- | ---------------- | ---------------------------- | ---------------------- |

---

# 8. Failure Classification Requirement

Task 2.16 must distinguish at least:

1. unavailable source;
2. unreadable/parse failure;
3. unsupported durable format/version;
4. structurally invalid data;
5. compatibility-normalizable historical data;
6. semantically invalid authored snapshot;
7. semantically ambiguous authored snapshot;
8. valid authored snapshot with advisories;
9. persistence failure after successful activation.

Do not collapse these into a single invalid status.

---

# 9. Parse Failure

Define parse failure as data that cannot be decoded into the expected raw durable container.

Determine current behavior for:

* malformed local JSON;
* malformed profile storage;
* malformed backup JSON.

Classify separately from semantic invalidity.

---

# 10. Unsupported Format / Version

Determine current behavior when durable format/version is recognized as unsupported.

Task 2.16 must preserve the Phase 1 rule that unsupported durable data is not equivalent to empty/default state.

Determine:

* whether activation is blocked;
* whether raw data remains preserved;
* whether conversion/recovery is required;
* whether existing result vocabulary is sufficient.

Do not redesign versioning.

---

# 11. Structural Invalidity

Define structural invalidity as input that parses but cannot satisfy the expected raw/normalized durable shape.

Determine existing handling for:

* local state;
* profiles;
* backup.

Do not automatically equate structural invalidity with semantic authored invalidity.

---

# 12. Compatibility-Normalizable Historical Data

Examples include historical singular `shiftCycle` representations.

These are expected supported historical forms.

Determine whether the correct conceptual pipeline remains:

```
historical raw representation
    ↓
compatibility normalization
    ↓
current authored representation
    ↓
semantic validation
```

Preferred bias: yes.

Confirm from evidence.

Do not run current semantic validation against obsolete raw shape before compatibility normalization.

---

# 13. Semantic Invalidity

After supported normalization, the Task 2.15 validator may report blocking issues.

Examples may include:

* duplicate source IDs;
* dangling recurrence/template references;
* dangling shift-definition references;
* containment mismatch;
* overlapping cycles;
* invalid sequence structure;
* malformed current authored relationships.

Determine how each historical ingress surface should respond.

---

# 14. Semantic Ambiguity

Some historical snapshots may be structurally valid but ambiguous.

Example:

```
duplicate template IDs
    +
recurrence references that ID
```

The system cannot know which template the recurrence historically meant.

Task 2.16 must determine whether such cases are:

* ordinary invalid state;
* distinct ambiguity requiring recovery;
* migration candidates;
* unrecoverable without user intervention.

Do not silently choose one referent.

---

# 15. Valid With Advisories

Task 2.15 allows valid authored state with nonblocking advisories such as unsupported declared recurrence frequencies.

Determine whether historical ingress containing only advisories may activate normally.

Likely yes.

If different handling is needed, justify it.

---

# 16. Active Local-State Rehydration Question

The central active-state question is:

> If the persisted active authored snapshot is readable and format-compatible but semantically invalid, what should DayFrame use as current runtime authority at startup?

Candidate models must be compared.

---

# 17. Active Model A — Activate Invalid Snapshot

Conceptually:

```
invalid historical checkpoint
    ↓
activate anyway
    ↓
current runtime begins invalid
```

Assess against Task 2.15's authority contract.

Likely misaligned.

---

# 18. Active Model B — Silently Fall Back To Defaults

Conceptually:

```
invalid historical checkpoint
    ↓
discard activation
    ↓
initialize defaults
    ↓
no explicit recovery state
```

Assess against durable-data preservation and epistemic integrity.

Likely unsafe if original user data becomes effectively hidden or overwritten.

---

# 19. Active Model C — Safe Runtime Fallback + Preserve Recovery Source

Conceptually:

```
invalid historical checkpoint
    ↓
do not activate it
    ↓
establish known-safe runtime fallback
    +
preserve original durable checkpoint
    +
retain/report recovery-required condition
```

Assess carefully.

This is likely a strong candidate but must be evidence-backed.

---

# 20. Active Model D — Block Store Construction

Conceptually:

```
invalid historical checkpoint
    ↓
createDayFrameStore throws / app cannot start
```

Assess:

* safety;
* recoverability;
* user access;
* operational robustness.

---

# 21. Required Active-State Matrix

Produce:

| Model                                     | Invalid Data Becomes Authority? | Original Data Preserved? | App Remains Usable? | Silent Loss Risk | Recovery-Friendly | Recommendation |
| ----------------------------------------- | ------------------------------: | -----------------------: | ------------------: | ---------------: | ----------------: | -------------- |
| activate invalid                          |                                 |                          |                     |                  |                   |                |
| silent defaults                           |                                 |                          |                     |                  |                   |                |
| safe fallback + preserved recovery source |                                 |                          |                     |                  |                   |                |
| block construction                        |                                 |                          |                     |                  |                   |                |

---

# 22. Active Fallback Authority

If safe fallback is adopted, determine what it may be.

Candidates include:

* `createInitialDayFrameState()` authored defaults;
* empty authored setup;
* another explicitly safe state.

The fallback must not be described as restored user state.

It is temporary/current safe runtime authority.

Do not implement.

---

# 23. Active Durable Preservation

If invalid local state does not activate, determine whether the original local-storage payload must remain byte-for-byte untouched until explicit recovery/migration.

Preferred bias: preserve.

Do not authorize automatic overwrite merely because fallback runtime initializes successfully.

---

# 24. Active Persistence Hazard

This is critical.

If runtime falls back to safe defaults while invalid historical local data remains preserved:

```
fallback runtime
    ↓
user performs ordinary mutation
    ↓
ordinary persistence may overwrite recovery source
```

Task 2.16 must explicitly address this hazard.

Determine whether:

* ordinary persistence should remain blocked until recovery choice;
* first user mutation may replace historical checkpoint;
* checkpoint should first be preserved elsewhere;
* another recovery contract is required.

Do not leave this unresolved if adopting safe fallback.

---

# 25. Active Recovery-State Representation

Determine whether the store requires retained infrastructure state representing historical-ingress recovery.

Possible conceptual states:

```
historicalIngress: healthy

historicalIngress: recoveryRequired
```

with surface/detail information.

Do not design exact code yet.

Determine whether current durability status is sufficient.

Likely not, because invalid ingress is not a failed write.

---

# 26. Durability Status Separation

Task 2.15 and Phase 1 established durability status as knowledge about persistence attempts.

Historical semantic invalidity is not:

* storageFailure;
* unavailable;
* serializationFailure.

Task 2.16 must explicitly determine whether a separate recovery/ingress status is required.

Do not overload durability semantics without strong evidence.

---

# 27. Saved-Profile Load Question

A profile remains a preserved durable checkpoint until selected.

If its normalized authored data fails semantic validation, determine what load should do.

Preferred conceptual principle:

> Invalid profile data must not replace current valid active authority.

Evaluate.

---

# 28. Profile Model A — Activate Invalid Profile

Assess and likely reject.

---

# 29. Profile Model B — Reject Load, Preserve Profile

Conceptually:

```
selected profile
    ↓
normalize
    ↓
semantic validation fails
    ↓
active state unchanged
profile preserved
Preview unchanged
no active persistence
explicit recovery-required load result
```

Assess.

---

# 30. Profile Model C — Repair Automatically Then Activate

Assess against non-destructive preservation and ambiguous relationships.

Likely inappropriate without migration contract.

---

# 31. Required Profile Matrix

Produce:

| Model                  | Active State Safe? | Original Profile Preserved? | Silent Repair? | Recovery-Friendly | Recommendation |
| ---------------------- | -----------------: | --------------------------: | -------------: | ----------------: | -------------- |
| activate invalid       |                    |                             |                |                   |                |
| reject + preserve      |                    |                             |                |                   |                |
| auto-repair + activate |                    |                             |                |                   |                |

---

# 32. Profile Collection Integrity

A single invalid profile should not necessarily invalidate the entire profile collection.

Determine whether:

* each profile should be semantically validated independently at load time;
* collection loading should preserve invalid profiles as artifacts;
* profile listing can remain available.

Do not assume collection-wide rejection.

---

# 33. Profile Save Interaction

Task 2.15 ensures current active authority is valid.

Saving a new profile from current authority should therefore produce semantically valid profile data.

Determine whether profile save requires redundant semantic validation.

Likely not required for correctness if source is trusted valid current state, but consider defensive boundaries.

Do not implement.

---

# 34. Backup Import Question

Backups are external portable recovery artifacts.

Central question:

> If a backup is structurally and version compatible but semantically invalid under current authored rules, may any of it become active authority?

Preferred bias: no partial activation.

Assess.

---

# 35. Backup Model A — Activate Invalid Backup

Assess and likely reject.

---

# 36. Backup Model B — Reject Import, Preserve External Artifact

Conceptually:

```
backup parsed
    ↓
version/compatibility normalization
    ↓
semantic validation fails
    ↓
active state unchanged
Preview unchanged
no persistence
backup file remains external
explicit recovery/conversion result
```

Assess.

---

# 37. Backup Model C — Partial Import

Conceptually:

```
import valid subset
discard invalid subset
```

Assess against user-data preservation and provenance.

Likely reject.

---

# 38. Backup Model D — Automatic Repair/Migration

Assess only conceptually.

Could be valid later when an explicit deterministic migration exists.

Do not authorize generic repair.

---

# 39. Required Backup Matrix

Produce:

| Model                          | Active Authority Safe? | Backup Preserved? | Provenance Preserved? | Silent Loss Risk | Recommendation |
| ------------------------------ | ---------------------: | ----------------: | --------------------: | ---------------: | -------------- |
| activate invalid               |                        |                   |                       |                  |                |
| reject + preserve              |                        |                   |                       |                  |                |
| partial import                 |                        |                   |                       |                  |                |
| explicit migration then import |                        |                   |                       |                  |                |

---

# 40. Partial Activation Prohibition

Evaluate and likely adopt:

> Historical authored snapshots activate atomically or not at all.

Do not activate only:

* valid templates;
* valid cycles;
* valid manual events;

while dropping invalid parts.

Such behavior would manufacture an authored snapshot the user never supplied.

---

# 41. Semantic Validation Placement

Determine the correct pipeline ordering.

Likely:

```
raw input
    ↓
parse
    ↓
format/version compatibility
    ↓
historical representation normalization
    ↓
current authored snapshot
    ↓
semantic validation
    ↓
boundary-specific activation policy
```

Confirm separately for all three surfaces.

---

# 42. Validator Reuse

Task 2.16 should determine whether the exact Task 2.15 validator should be reused.

Preferred:

> yes — one semantic definition of current authored validity.

Boundary-specific wrappers may attach ingress metadata or policy.

Do not fork validity rules for historical data unless compatibility requires a version-specific semantic interpretation.

---

# 43. Historical Semantic Compatibility

Important distinction:

A historical snapshot may violate **today's current-authoring rules** because the rule itself did not exist when that data was produced.

Determine whether every current validation issue should block historical activation.

Potential categories:

## A. Invariant violation

Example:

* duplicate current IDs;
* ambiguous source reference.

## B. Newly strengthened semantic rule

Example:

* a validation rule introduced after historical data may have tolerated a state.

Task 2.16 must inspect whether historical semantic interpretation requires version-aware allowances.

Do not assume current validator is automatically authoritative over all historical eras.

---

# 44. Validator Compatibility Classification

For each Task 2.15 blocking rule, classify historical applicability:

* timeless invariant;
* current-authoring invariant only;
* historical compatibility concern;
* unknown.

Produce a matrix.

---

# 45. Required Historical Rule Matrix

At minimum:

| Validation Rule                    | Historical Data Could Contain It? | Safe To Activate? | Needs Migration/Recovery? | Current Validator Alone Sufficient? |
| ---------------------------------- | --------------------------------: | ----------------: | ------------------------: | ----------------------------------: |
| duplicate top-level IDs            |                                   |                   |                           |                                     |
| nested work-entry collision        |                                   |                   |                           |                                     |
| missing recurrence template        |                                   |                   |                           |                                     |
| missing shift-definition reference |                                   |                   |                           |                                     |
| cycle containment mismatch         |                                   |                   |                           |                                     |
| overlapping cycles                 |                                   |                   |                           |                                     |
| overlapping segments               |                                   |                   |                           |                                     |
| invalid sequence offsets           |                                   |                   |                           |                                     |
| invalid recurrence parameters      |                                   |                   |                           |                                     |
| invalid preference/range           |                                   |                   |                           |                                     |
| invalid manual event shape         |                                   |                   |                           |                                     |
| unsupported recurrence advisory    |                                   |                   |                           |                                     |

---

# 46. Duplicate Historical IDs

Task 2.11/2.12 established that ordinary earlier UI behavior could produce duplicate IDs.

Therefore duplicate historical data may be legitimate DayFrame-produced user data even if it is semantically ambiguous today.

Determine:

* whether it can activate safely;
* whether deterministic remapping is possible;
* whether user-assisted recovery is required;
* whether migration can preserve relationship provenance.

Do not silently remap.

---

# 47. Dangling Historical References

If historical state contains:

```
recurrence → missing template
```

or:

```
segment → missing shift definition
```

determine whether there is enough provenance to repair automatically.

Likely not.

Classify.

---

# 48. Overlap Historical Semantics

If current validator rejects cycle/segment overlaps but older DayFrame allowed them, determine whether:

* old state is genuinely semantically invalid;
* overlap was previously supported authored intent;
* current validation contract unintentionally changed compatibility.

This is a critical audit point.

Do not assume current validation rule is historically timeless.

---

# 49. Unsupported Recurrence Advisories

Historical snapshots containing `perShiftSegment` or `custom` should remain valid-with-advisory under current semantics if otherwise valid.

Determine whether such snapshots may activate.

Likely yes.

Do not turn advisories into recovery-required state.

---

# 50. Migration Versus Recovery

Task 2.16 must distinguish:

## Migration

A deterministic transformation from supported old representation/semantics to current representation without requiring uncertain interpretation.

## Recovery

A process needed when DayFrame cannot determine one correct transformation safely.

Examples of likely recovery cases:

* ambiguous duplicate IDs;
* dangling references with no clear target.

Do not use "migration" for uncertain repair.

---

# 51. Conversion

Backups may eventually support conversion tooling.

Determine whether conversion is conceptually distinct from in-place migration because the original portable artifact should remain unchanged.

Do not implement.

---

# 52. Recovery Source Preservation

Adopt or reject:

> The original historical durable source must remain available until a replacement has been explicitly and successfully established.

This applies differently:

* local payload;
* stored profile;
* external backup.

Clarify per surface.

---

# 53. Recovery Provenance

If future recovery creates a repaired/current snapshot, determine what provenance must be retained to explain:

* source surface;
* original format/version;
* validation issues;
* migration/conversion applied;
* whether user choice was involved.

Do not design full provenance schema.

Identify minimum architectural requirement.

---

# 54. Activation Evidence

Determine what fact proves historical ingress successfully became current authority.

Likely:

```
normalized
    +
semantically valid
    +
boundary policy authorizes activation
```

For migration cases:

```
migration completed
    +
migrated snapshot validates
    +
migration evidence retained where required
```

Define conceptually.

---

# 55. Active Rehydration Migration Evidence

Phase 1 ADR requires durable, observable migration evidence before historical readers retire.

Task 2.16 must ensure that semantic validation/activation does not get confused with completed migration.

Successful in-memory validation is not migration evidence.

---

# 56. Local Safe-Fallback Write Policy

If active local state cannot activate and safe fallback is adopted, resolve whether ordinary writes are allowed immediately.

Candidate models:

## A. Allow ordinary write and overwrite historical checkpoint

Simple but risks destroying recoverable user data.

## B. Block durable overwrite while recovery-required

Runtime may function but active writes do not replace preserved checkpoint.

## C. First preserve original checkpoint into a recovery artifact, then allow writes

Requires new durable behavior.

## D. Another evidence-supported policy.

This decision may become a prerequisite implementation seam.

---

# 57. Required Fallback Write Matrix

Produce:

| Policy                         | Protects Historical Data | User Can Continue Editing? | Persistence Complexity | Risk | Recommendation |
| ------------------------------ | -----------------------: | -------------------------: | ---------------------: | ---: | -------------- |
| overwrite on first write       |                          |                            |                        |      |                |
| block writes                   |                          |                            |                        |      |                |
| preserve checkpoint then write |                          |                            |                        |      |                |

---

# 58. Runtime Editing During Recovery

If safe fallback runtime is active:

* may user edit it?
* may Preview be generated?
* may profiles be saved?
* may backup be exported?

Task 2.16 should determine whether such actions are safe before historical source preservation is resolved.

Do not design UX.

---

# 59. Export During Recovery

Potentially useful recovery principle:

> Even if historical active state cannot become current authority, the original raw checkpoint should remain exportable/preservable.

Determine whether current architecture can support that later.

Do not implement.

---

# 60. Profile Load Rejection Result

Determine future result semantics for a semantically invalid profile.

Likely needs a discriminated result distinct from persistence:

```
loaded
notFound
invalid/recoveryRequired
persistence outcome after successful activation
```

Assess existing result type.

---

# 61. Backup Import Rejection Result

Likewise distinguish:

* parse invalid;
* unsupported version;
* semantic invalidity/recovery-required;
* valid import whose persistence later fails.

Do not collapse semantic invalidity into durability.

---

# 62. Active Construction Result Problem

`createDayFrameStore()` currently returns a store, not an initialization result.

If active historical rehydration can enter recovery-required state, determine how that fact becomes observable.

Candidate models:

* retained store ingress status;
* separate initialization result;
* store construction exception;
* callback/diagnostic channel.

Do not implement.

---

# 63. Historical Ingress Status

Assess whether DayFrame needs retained infrastructure state separate from:

* `DayFrameState`;
* durability status.

Conceptually it may represent:

* active local source healthy;
* active recovery required;
* profile selected source invalid;
* backup import invalid.

Determine which states must persist/react during the session.

---

# 64. Surface-Specific Versus Global Recovery State

A profile or backup import failure is immediate workflow-local information.

Active rehydration failure may require persistent app-level awareness.

Determine which recovery information belongs:

* retained store infrastructure;
* immediate workflow result;
* app-level persistent awareness.

Do not design UI.

---

# 65. Recovery And Durability Independence

Example:

```
invalid active checkpoint detected
    ↓
safe fallback runtime
```

Durability status may still be `unknown`.

That does not communicate the recovery problem.

Explicitly preserve this independence.

---

# 66. Current Validity After Historical Activation

Once a historical snapshot is successfully normalized, semantically validated, and activated, it becomes current authoritative state.

Subsequent ordinary mutations must use Task 2.15 validation.

Determine whether any special historical mode remains necessary afterward.

Ideally no, unless migration/recovery state requires it.

---

# 67. Profile Load Replacement Semantics

For a valid profile:

* full authored replacement;
* profiles preserved;
* Preview cleared;
* active persistence attempted.

Preserve.

For invalid profile:

* active authored state unchanged;
* Preview unchanged;
* profile collection preserved;
* no active persistence attempt.

Adopt or revise.

---

# 68. Backup Import Replacement Semantics

For valid backup:

* full authored replacement;
* profiles preserved;
* Preview cleared;
* active persistence attempted.

For semantically invalid backup:

* active state unchanged;
* Preview unchanged;
* no persistence;
* external backup untouched.

Adopt or revise.

---

# 69. Subscriber Semantics

If profile/backup ingress is rejected before activation:

* no ordinary state notification;
* no durability notification;
* no desired-condition change.

Likely aligned with Task 2.15 rejection.

Confirm.

Active store-construction recovery has different subscriber timing because subscribers do not yet exist.

---

# 70. Current Mutation Validator Reuse After Import

Successful profile/backup activation should yield a valid `DayFrameAuthoredSetup`.

Task 2.15 current mutation guarantees then apply normally.

---

# 71. Invalid Profile Deletion

If a stored profile is invalid, can the user delete it?

Likely yes, because profile collection mutation does not activate its authored snapshot.

Determine.

Do not make invalid profile preservation mean undeletable.

---

# 72. Invalid Profile Export / Preservation

Determine whether future recovery should allow preserving/exporting the original profile before deletion or repair.

Do not implement.

---

# 73. Invalid Backup Preservation

External backup already exists independently.

Import failure must not modify it.

Explicitly confirm.

---

# 74. Local Invalid Payload Preservation

Unlike backup, active local data may exist only inside browser storage.

Therefore preservation policy is more consequential.

Task 2.16 must treat this as the highest-risk surface.

---

# 75. Raw Versus Normalized Recovery Source

Determine which representation should be preserved for recovery:

* exact raw durable payload;
* normalized authored snapshot;
* both.

Preferred principle may be:

> preserve exact source artifact; normalized form may be diagnostic working data.

Assess.

---

# 76. No Silent Durable Rewrite

Adopt or reject:

> Merely reading, normalizing, or validating historical data must not rewrite the original durable source.

This is strongly aligned with Phase 1 policy.

---

# 77. Validation Advisory Persistence

Validation advisories are derived semantic facts.

Do not persist them into authored data.

If retained for recovery UI, they belong to infrastructure/workflow state.

---

# 78. Recovery Required Versus Unsupported

Distinguish:

```
recoveryRequired
    → supported format, but current semantic authority cannot be safely established
```

from:

```
unsupportedFormat
    → DayFrame does not currently support interpreting this format directly
```

Do not combine them if future actions differ.

---

# 79. Recovery Required Versus Corrupt

Likewise distinguish:

```
parse/structural corruption
```

from:

```
semantically invalid/ambiguous but inspectable authored data
```

The latter may support richer recovery.

---

# 80. Result Vocabulary

Assess a cross-surface semantic vocabulary such as:

* accepted;
* invalid;
* ambiguous;
* unsupported;
* corrupt;
* recoveryRequired.

Do not force one union onto all surfaces if operational contracts differ.

Prefer shared semantic classification plus surface-specific results.

---

# 81. Historical Ingress Semantic Classifier

Determine whether a pure classifier should translate:

* parse/version results;
* normalization result;
* authored validation result;

into shared ingress semantic categories.

Do not implement unless the investigation recommends it for later.

---

# 82. Boundary Ownership

Establish conceptual ownership:

## Parser / durable reader

Reports raw format facts.

## Compatibility normalizer

Produces supported current representation where deterministic.

## Authored validator

Reports semantic authored facts.

## Ingress policy owner

Decides activation/recovery for that surface.

## Workflow/UI

Presents and initiates recovery.

Determine likely ingress-policy owner per surface.

---

# 83. Store Ownership

For profile load and active rehydration, store likely owns activation.

For backup parsing/import workflow, responsibility may be split between backup module and store.

Map actual boundaries.

Do not assume.

---

# 84. Historical Local Recovery Authority

Determine whether recovery from invalid local state should be initiated by:

* store automatically;
* application workflow;
* user-facing recovery flow;
* migration subsystem.

Likely detection is automatic, recovery choice may not be.

Clarify.

---

# 85. Automatic Repair

No generic automatic repair should be adopted unless transformation is provably deterministic and lossless.

Examples potentially safe:

* known legacy field normalization already supported.

Examples unsafe:

* choosing among duplicate template referents.

State explicitly.

---

# 86. Migration Authorization

If a deterministic semantic migration is discovered, determine whether implementation may occur under current ADR or needs a dedicated migration task/ADR.

Do not implement.

---

# 87. Historical Rule Versioning

Some semantic validity rules may evolve.

Determine whether durable-format version alone is enough to identify historical semantic expectations.

If not, future semantic migration/version metadata may be required.

Do not create it now.

---

# 88. Existing User Exposure

Use repository history and durable writer history where useful to identify which invalid states DayFrame itself could have produced.

Focus particularly on:

* duplicate IDs;
* temporary relationship inconsistencies that could have been persisted;
* overlapping structures;
* unsupported recurrence forms.

Do not assume exposure is zero.

---

# 89. Historical Producer Evidence

For each major semantic-invalid class, classify:

* DayFrame demonstrably produced it;
* DayFrame could plausibly produce it;
* only malformed external/manual mutation can produce it;
* not found.

This should influence recovery obligations.

---

# 90. Required Producer Matrix

Produce:

| Invalidity                    | Historical Producer Evidence | User-Data Obligation | Recovery Priority |
| ----------------------------- | ---------------------------- | -------------------- | ----------------- |
| duplicate IDs                 |                              |                      |                   |
| dangling recurrence           |                              |                      |                   |
| dangling shift reference      |                              |                      |                   |
| overlapping cycles            |                              |                      |                   |
| invalid segment containment   |                              |                      |                   |
| sequence gaps                 |                              |                      |                   |
| invalid recurrence parameters |                              |                      |                   |
| invalid manual-event shape    |                              |                      |                   |

---

# 91. Data-Preservation Priority

Historical states demonstrably produced by prior DayFrame behavior receive stronger recovery obligations than arbitrary malformed injected data.

Determine how this influences future implementation sequencing.

---

# 92. Test Fixture Implications

Current tests may use invalid injected state as fixture convenience.

Do not confuse test-only constructibility with historical user exposure.

Classify separately.

---

# 93. Initialization Injection Boundary

Injected `Partial<DayFrameState>` remains a test/composition seam.

Task 2.16 must determine whether future historical-ingress logic should affect injected initial state.

Likely separate.

Do not conflate it with durable historical data.

---

# 94. Seeded Store Boundary

Review current seeded/demo initialization after Tasks 2.2–2.3.

Determine whether it participates in historical-ingress recovery.

Likely no if seeding is now appropriately bounded.

Document.

---

# 95. Recovery Completion

Define conceptually what ends recovery-required state.

Possible examples:

* valid migrated snapshot durably established;
* user selects a valid profile/backup and establishes it;
* explicit reset/abandon action after preservation;
* successful conversion.

Do not design UI.

---

# 96. Abandon / Reset Semantics

If the user chooses to abandon invalid historical local data and reset:

* must that be explicit?
* should clear semantics be reused?
* must original data be exportable/preserved first?

Investigate conceptually.

Do not implement.

---

# 97. Recovery And Clear

Existing `clearLocalData()` explicitly requests durable absence.

Determine whether it could eventually serve as an explicit abandonment action.

Do not change current behavior.

---

# 98. Recovery And Profiles

A valid profile may potentially provide recovery from invalid active local state.

Determine whether loading a valid profile could:

* replace safe fallback runtime;
* persist valid active state;
* thereby intentionally overwrite invalid active checkpoint.

Likely useful, but must be explicit because it destroys/replaces the prior active checkpoint.

---

# 99. Recovery And Backup Import

Likewise, a valid backup may provide recovery.

Determine whether successful import could explicitly replace invalid active checkpoint after user selection.

---

# 100. Recovery Replacement Authority

If a user explicitly chooses a valid recovery source, replacing invalid active local data may be justified.

Distinguish explicit replacement from automatic overwrite.

---

# 101. Historical Ingress Issue Presentation

Do not design product copy.

Determine only which semantic facts must be available for future presentation:

* affected surface;
* issue class;
* activation blocked;
* source preserved;
* recovery options available/unavailable.

---

# 102. Persistent Awareness

Active rehydration recovery may need persistent app-level awareness.

Profile/backup rejection may need only workflow-local feedback unless selected state affects broader session risk.

Determine conceptually.

Do not implement.

---

# 103. Reload / Close Risk

If safe fallback is running while invalid active checkpoint remains preserved, determine what reload does.

If detection repeats, fallback/recovery state should repeat deterministically.

If user edits only in memory while writes are blocked, reload may lose those edits.

This must be included in policy analysis.

---

# 104. Recovery Runtime Durability

If writes are blocked during active recovery, current fallback edits may be session-only.

This may require risk communication analogous to Phase 1 durability work.

Do not design copy, but record the consequence.

---

# 105. Required Surface Policy Matrix

Produce:

| Surface            | Semantic Invalidity Detected | May Activate? | Original Source Preserved? | Runtime Fallback? | Persistence Allowed? | Recovery Result Needed? |
| ------------------ | ---------------------------- | ------------: | -------------------------: | ----------------: | -------------------: | ----------------------: |
| active local state |                              |               |                            |                   |                      |                         |
| profile load       |                              |               |                            |                   |                      |                         |
| backup import      |                              |               |                            |                   |                      |                         |

---

# 106. Required Failure-Class Matrix

Produce:

| Failure Class                       | Local Rehydration | Profile Load | Backup Import |
| ----------------------------------- | ----------------- | ------------ | ------------- |
| unavailable                         |                   |              |               |
| parse failure                       |                   |              |               |
| unsupported version                 |                   |              |               |
| structural invalidity               |                   |              |               |
| compatibility-normalizable          |                   |              |               |
| semantic invalidity                 |                   |              |               |
| ambiguity                           |                   |              |               |
| advisory only                       |                   |              |               |
| post-activation persistence failure |                   |              |               |

---

# 107. Required Activation Matrix

Produce:

| Condition                                  | Activate Current Authored State? | Preserve Original? | Requires Explicit Recovery? |
| ------------------------------------------ | -------------------------------: | -----------------: | --------------------------: |
| valid current representation               |                                  |                    |                             |
| valid normalized historical representation |                                  |                    |                             |
| advisory-only                              |                                  |                    |                             |
| semantically invalid                       |                                  |                    |                             |
| ambiguous references                       |                                  |                    |                             |
| unsupported format                         |                                  |                    |                             |
| corrupt/unreadable                         |                                  |                    |                             |

---

# 108. Required Ownership Matrix

Produce:

| Responsibility                          | Local State      | Profile          | Backup           |
| --------------------------------------- | ---------------- | ---------------- | ---------------- |
| parse                                   |                  |                  |                  |
| version compatibility                   |                  |                  |                  |
| normalization                           |                  |                  |                  |
| semantic validation                     | shared validator | shared validator | shared validator |
| activation decision                     |                  |                  |                  |
| recovery initiation                     |                  |                  |                  |
| migration/conversion                    |                  |                  |                  |
| persistence after successful activation |                  |                  |                  |

---

# 109. Required Recovery-State Matrix

Produce:

| Recovery Fact              | Store Infrastructure? | Workflow-Local? | Persistent App Awareness? |
| -------------------------- | --------------------: | --------------: | ------------------------: |
| invalid local checkpoint   |                       |                 |                           |
| invalid selected profile   |                       |                 |                           |
| invalid backup import      |                       |                 |                           |
| unsupported format         |                       |                 |                           |
| ambiguous source relations |                       |                 |                           |

---

# 110. Behavioral Invariants

The result should establish later implementation invariants.

Candidate invariants include:

1. historical input is normalized before current semantic validation;
2. semantic invalidity never silently becomes current authority;
3. historical source data is preserved until explicit successful replacement/recovery;
4. no partial authored activation occurs;
5. advisories alone do not block activation;
6. semantic invalidity is distinct from durability failure;
7. semantic invalidity is distinct from unsupported format;
8. profile rejection leaves current state and profile source unchanged;
9. backup rejection leaves current state and external artifact unchanged;
10. local recovery never silently overwrites the invalid checkpoint;
11. successful explicit recovery establishes a valid complete authored snapshot;
12. in-memory validation is not migration evidence.

Adopt only evidence-supported invariants.

---

# 111. Required Future Test Contract

Do not add tests now.

Specify future tests for at least:

## Local

* valid current local state;
* valid legacy normalized local state;
* duplicate-ID semantic invalidity;
* ambiguous relationship invalidity;
* parse corruption;
* unsupported format if represented;
* no silent durable overwrite;
* deterministic fallback/recovery state;
* reload behavior.

## Profile

* valid load;
* valid legacy load;
* semantic-invalid profile rejected;
* active state unchanged;
* Preview unchanged;
* profile preserved;
* no active persistence;
* invalid one profile does not destroy collection.

## Backup

* valid import;
* valid legacy import;
* semantic-invalid backup rejected;
* active state unchanged;
* Preview unchanged;
* no persistence;
* backup artifact untouched;
* no partial import.

## Shared

* advisory-only data accepted;
* validator result reused consistently;
* ambiguity distinct from generic corruption;
* post-activation persistence failure remains durability, not ingress invalidity.

---

# 112. OccurrenceIdentity Implications

A semantically invalid historical authored snapshot must not generate authoritative occurrences merely to obtain V1 identity.

Successful historical activation yields a valid current authored source set, after which Task 2.10 identity semantics apply.

Source incarnation remains unresolved.

---

# 113. Source-Incarnation Implications

Historical replacement surfaces are one reason source incarnation matters.

Task 2.16 should record how:

* profile restoration;
* backup restoration;
* local historical migration

interact with future source-lifetime semantics.

Do not solve incarnation here.

---

# 114. PlanDecision Implications

Future durable PlanDecision will depend on:

* safe historical activation;
* source incarnation;
* durable occurrence references.

Task 2.16 should identify whether historical recovery must exist before durable PlanDecision migration can be safe.

Do not implement PlanDecision.

---

# 115. Compatibility Assessment

Determine whether historical semantic validation can be added later without changing durable schemas.

Detection likely can.

Recovery/migration may require:

* new metadata;
* version changes;
* recovery artifacts;
* status representations.

Do not assume implementation shape yet.

---

# 116. Recommended Implementation Staging

If the policy is sufficiently clear, recommend a dependency-correct sequence.

A plausible sequence may be:

1. introduce shared ingress semantic classification/result vocabulary;
2. implement non-destructive profile/backup semantic validation first;
3. implement local rehydration detection separately;
4. introduce active recovery-required infrastructure state;
5. define safe-fallback persistence protection;
6. add recovery workflows;
7. add deterministic migrations where justified.

Do not assume this exact order.

The investigation decides.

---

# 117. Why Local May Need Separate Implementation

Active local rehydration is more complex because store construction must still produce a usable runtime.

Profile and backup can reject activation while preserving existing current state.

Task 2.16 should determine whether local recovery deserves a separate task from profile/backup integration.

Likely yes.

---

# 118. Candidate Next Tasks

Possible outcomes include:

## Outcome A — Profile/Backup Policy Is Simple, Local Requires More Design

> **Task 2.17 — Implement Non-Destructive Semantic Validation for Profile Load and Backup Import**

followed by local recovery work.

## Outcome B — Shared Result Vocabulary Must Come First

> **Task 2.17 — Establish Historical-Ingress Result and Recovery-State Semantics**

## Outcome C — Local Fallback Preservation Is The Main Blocker

> **Task 2.17 — Establish Active Local Recovery Checkpoint Preservation and Write-Blocking Semantics**

## Outcome D — Deterministic Migration Is Required First

> **Task 2.17 — Define Historical Authored Semantic Migration Contract**

Task 2.16 determines the next seam.

---

# 119. Evidence Classification

Material conclusions must use:

* **Confirmed**
* **Inferred**
* **Not found**
* **Unresolved**
* **Recommended**
* **Deferred**

Distinguish clearly among:

* current executable behavior;
* adopted future ingress policy;
* migration obligation;
* recovery obligation.

---

# 120. Explicit Non-Goals

Task 2.16 shall not:

* wire validation into rehydration;
* wire validation into profile load;
* wire validation into backup import;
* change store construction;
* change profile result types;
* change backup result types;
* add recovery state;
* add recovery UI;
* block persistence;
* preserve checkpoints into a new key;
* add migrations;
* convert backups;
* remap IDs;
* repair relationships;
* alter durable formats;
* alter versions;
* alter compatibility readers;
* alter Task 2.15 current-mutation validation;
* change occurrence identity;
* add source incarnation;
* add PlanDecision;
* update ADRs;
* update `CURRENT_STATE.md`;
* update `CHANGELOG.md`;
* create a checkpoint;
* perform unrelated cleanup.

Discovery does not authorize implementation.

---

# 121. Required Code Inspection

At minimum inspect:

* active local-state load/normalization;
* `createDayFrameStore`;
* local persistence readers;
* profile storage load/normalization;
* profile load mutation;
* backup parsing/validation/normalization;
* backup import mutation;
* `validateDayFrameAuthoredSetup`;
* current persistence result types;
* current backup/profile result types;
* current compatibility readers;
* Phase 1 durability/retry state;
* production callers in `DayFrameApp`;
* relevant tests.

Search historical producer evidence where needed.

---

# 122. Required Result Artifact Structure

The Task 2.16 result must contain at least:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Current Historical Ingress Inventory
5. Existing Local Rehydration Pipeline
6. Existing Profile Load Pipeline
7. Existing Backup Import Pipeline
8. Failure Classification
9. Parse Failure Semantics
10. Unsupported Format Semantics
11. Structural Invalidity
12. Compatibility-Normalizable Data
13. Semantic Invalidity
14. Semantic Ambiguity
15. Advisory-Only Data
16. Semantic Validation Placement
17. Validator Reuse Determination
18. Historical Rule Compatibility Assessment
19. Historical Validation Rule Matrix
20. Historical Producer Evidence
21. Producer Matrix
22. Active Local-State Candidate Models
23. Active-State Model Matrix
24. Adopted Active Activation Policy
25. Active Safe-Fallback Determination
26. Active Source Preservation
27. Active Persistence Hazard
28. Active Fallback Write Models
29. Fallback Write Matrix
30. Active Recovery-State Requirement
31. Durability Separation
32. Profile Candidate Models
33. Profile Model Matrix
34. Adopted Profile Load Policy
35. Profile Collection Preservation
36. Backup Candidate Models
37. Backup Model Matrix
38. Adopted Backup Import Policy
39. Partial Activation Determination
40. Migration Versus Recovery
41. Conversion Boundary
42. Recovery Source Preservation
43. Raw Versus Normalized Recovery Source
44. Activation Evidence
45. Local Migration Evidence
46. Result Vocabulary Assessment
47. Active Construction Observability
48. Historical Ingress Status
49. Workflow-Local Versus Persistent Recovery State
50. Subscriber / Durability Semantics
51. Valid Activation Semantics
52. Profile Replacement Semantics
53. Backup Replacement Semantics
54. Invalid Profile Deletion / Preservation
55. Recovery Completion
56. Explicit Replacement / Abandonment Semantics
57. Recovery Via Profile / Backup
58. Surface Policy Matrix
59. Failure-Class Matrix
60. Activation Matrix
61. Ownership Matrix
62. Recovery-State Matrix
63. Behavioral Invariants
64. Required Future Test Contract
65. OccurrenceIdentity Implications
66. Source-Incarnation Implications
67. PlanDecision Implications
68. Compatibility Assessment
69. Architectural Alignment Assessment
70. Open Questions
71. Recommended Implementation Sequence
72. Recommended Next Task
73. Deviations
74. Discoveries and Deferred Work
75. Validation
76. Final Completion Determination

Additional sections may be added where evidence requires them.

---

# 123. Validation Requirements

This task is investigation only.

No executable or test files should change.

Run:

```
npm run lint
npm run typecheck
npm test
npm run build
```

Record:

* task artifact SHA-256;
* artifact immutability;
* test-file count;
* test count;
* build result;
* whether executable files changed;
* whether governance files changed.

Reference searches must cover:

* local historical ingress;
* profile historical ingress;
* backup ingress;
* compatibility normalization;
* semantic authored validation;
* current activation/replacement code;
* current result contracts;
* relevant production callers.

If the worktree contains prior Phase 2 implementation changes, distinguish those from Task 2.16 work.

---

# 124. Completion Criteria

Task 2.16 is complete only when:

* all three historical authored ingress pipelines are mapped;
* failure classes are explicitly separated;
* semantic validation placement is decided;
* reuse of the Task 2.15 validator is decided;
* historical applicability of current validation rules is assessed;
* historical producer evidence is recorded;
* active local-state activation policy is adopted;
* safe fallback behavior is adopted or rejected explicitly;
* preservation of invalid active data is decided;
* the fallback persistence hazard is resolved conceptually;
* profile invalid-data activation policy is adopted;
* backup invalid-data activation policy is adopted;
* atomic/no-partial-activation policy is decided;
* migration and recovery are distinguished;
* source preservation requirements are explicit;
* result/status vocabulary requirements are identified;
* durability remains separate from ingress recovery;
* recovery-state ownership is identified;
* required matrices are complete;
* future tests are specified;
* occurrence identity, incarnation, and PlanDecision implications are recorded;
* an implementation sequence is identified;
* no unauthorized implementation occurs;
* repository-standard validation passes;
* immutable task artifact remains unchanged.

---

# 125. Task Determination

Task 2.16 is a historical durable-ingress authority and recovery investigation.

It exists because DayFrame now has a strict current-authoring validity contract, while historical durable user data may legitimately predate that contract.

The central question is not:

> Does this historical snapshot pass today's validator?

The central question is:

> Given what DayFrame can truthfully determine about this historical snapshot, may it become current authority, must it remain preserved for recovery, or does it require deterministic migration or explicit user-assisted recovery before activation?

The validator reports semantic truth.

Compatibility determines whether historical representation is understood.

Ingress policy determines whether understood data may activate.

Recovery determines what happens when safe activation is not possible.

These responsibilities must remain separate.

**Task 2.16 is complete when DayFrame has an evidence-backed, surface-specific contract for validating, activating, preserving, and recovering historical authored data from active local state, saved profiles, and backups; has resolved the safe-fallback and persistence-preservation implications of invalid active checkpoints; and has made no unauthorized implementation change.**
