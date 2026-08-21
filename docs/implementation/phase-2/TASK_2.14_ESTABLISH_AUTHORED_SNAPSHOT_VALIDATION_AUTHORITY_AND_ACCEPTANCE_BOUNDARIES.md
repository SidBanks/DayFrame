# Task 2.14 — Establish Authored-Snapshot Validation Authority and Acceptance Boundaries

**Project:** DayFrame
**Phase:** Phase 2 — Authority and State Alignment
**Task ID:** 2.14
**Execution Type:** Investigation / Architectural Authority Decision
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

Execution findings must be recorded in a separate result artifact:

`TASK_2.14_ESTABLISH_AUTHORED_SNAPSHOT_VALIDATION_AUTHORITY_AND_ACCEPTANCE_BOUNDARIES_RESULT.md`

This task is investigative.

Do not modify production code, tests, store APIs, public types, persistence formats, durable readers, architectural governance documents, checkpoints, or unrelated documentation.

No implementation is authorized by this task.

---

# 2. Purpose

Task 2.12 established the authored-source uniqueness contract.

Task 2.13 implemented collision-free ID allocation for all supported interactive identity-bearing source creation paths.

DayFrame can therefore no longer create ordinary interactive ID collisions through those supported workflows.

However, the store still accepts caller-supplied authored collections and complete authored snapshots without a unified uniqueness and relationship validation contract.

Current conceptual state:

```
interactive creation
    ↓
collision-free by construction
    ↓
draft / caller-supplied authored state
    ↓
store mutation boundary
    ↓
currently no complete shared authored-snapshot acceptance contract
```

At the same time, historical local state, saved profiles, and backups may contain duplicate or otherwise ambiguous source relationships because earlier DayFrame versions allowed such state.

Task 2.14 must determine:

* what constitutes a valid current authored snapshot;
* which relationships are authoritative invariants;
* which mutation boundaries must enforce those invariants;
* what rejection means for current-session authority;
* how validation differs between newly authored mutations and historical durable ingress;
* what result semantics a future implementation requires.

This task does not implement the validator.

---

# 3. Governing Decisions

Task 2.12 adopted:

> Newly authored source IDs must be unique within their applicable current authored-snapshot scope.

Task 2.12 also recommended that:

* a shared authored validator eventually enforce uniqueness and required source relationships;
* current-authoring/store mutation boundaries reject invalid new authoritative snapshots;
* historical local/profile/backup ingress receive separate compatibility-aware handling;
* historical duplicates must not be silently remapped.

Task 2.13 implemented only collision-free allocation.

Task 2.14 now establishes the acceptance contract needed before store validation can be implemented safely.

---

# 4. Core Architectural Distinction

Task 2.14 must preserve:

```
CURRENT AUTHORING / MUTATION
    ↓
candidate authoritative state
    ↓
validate
    ↓
accept or reject
```

as distinct from:

```
HISTORICAL DURABLE INGRESS
    ↓
potentially ambiguous DayFrame-produced data
    ↓
detect / classify
    ↓
compatibility or recovery decision
```

Do not apply one simplistic validation policy to both boundaries.

---

# 5. Objective

Determine:

1. what makes a complete authored snapshot valid;
2. which uniqueness rules are mandatory;
3. which source relationships are mandatory;
4. which apparent relationships are only UI conventions;
5. which current engine paths tolerate malformed state;
6. whether engine tolerance should influence authority validation;
7. which store mutations must validate;
8. whether validation should apply to complete resulting state rather than individual input arrays;
9. what rejection means;
10. whether invalid mutations return a result or throw;
11. whether rejected mutations notify subscribers;
12. whether rejected mutations persist;
13. whether rejected mutations change durability state;
14. whether Setup draft preflight should share the validator;
15. whether manual-event mutations should share it;
16. how local/profile/backup ingress remain separate;
17. what smallest implementation task should follow.

---

# 6. Authored Snapshot Under Investigation

Use the Task 2.1 authoritative boundary:

* `schedulingPreferences`;
* `previewRange`;
* `shiftDefinitions`;
* `shiftCycles`;
* `blockTemplates`;
* `blockRecurrences`;
* `manualEvents`.

Determine whether the future validator should operate on:

`DayFrameAuthoredSetup`

or another complete authored representation.

Do not add a new type unless an investigation finding proves the current authored boundary is insufficient.

---

# 7. Validation Ownership Question

Task 2.14 must answer:

> Which layer owns the truth that a proposed authored snapshot is structurally and relationally valid enough to become current authority?

Candidate owners include:

* UI workflows;
* store mutation boundary;
* core/domain validation helper;
* persistence normalization;
* multiple layered boundaries with one shared semantic validator.

Distinguish:

* semantic validation logic;
* enforcement;
* presentation of failure.

---

# 8. Candidate Ownership Model A — UI-Only Validation

The creating/editing workflow validates before calling the store.

Assess:

* draft UX;
* correctness;
* bypass callers;
* direct store use;
* testability;
* future workflows.

Likely insufficient as the sole authority boundary.

---

# 9. Candidate Ownership Model B — Store-Owned Validation Logic

The store contains all validation logic.

Assess:

* central enforcement;
* coupling;
* reuse in Setup draft preflight;
* core/domain ownership.

---

# 10. Candidate Ownership Model C — Shared Pure Authored Validator + Store Enforcement

Conceptually:

```
candidate authored snapshot
    ↓
pure validateAuthoredSetup(...)
    ↓
validation result
    ↓
store decides accept/reject
```

Optional UI draft preflight may consume the same validator.

Assess this model carefully.

---

# 11. Required Ownership Matrix

Produce:

| Model                                     | Shared semantic truth | Protects direct store callers | Supports draft preflight | Historical-ingress separation | Complexity | Recommendation |
| ----------------------------------------- | --------------------: | ----------------------------: | -----------------------: | ----------------------------: | ---------: | -------------- |
| UI-only                                   |                       |                               |                          |                               |            |                |
| store-contained logic                     |                       |                               |                          |                               |            |                |
| shared pure validator + store enforcement |                       |                               |                          |                               |            |                |

---

# 12. Required ID Uniqueness Invariants

Confirm or revise Task 2.12 scopes.

At minimum investigate:

* `ShiftDefinition.id` unique within active `shiftDefinitions`;
* `ShiftCycle.id` unique within active `shiftCycles`;
* `BlockTemplate.id` unique within active `blockTemplates`;
* `BlockRecurrence.id` unique within active `blockRecurrences`;
* `ManualCalendarEvent.id` unique within active `manualEvents`;
* segment and sequence-entry IDs unique within one common cycle-local work-entry namespace.

Determine whether any additional identity-bearing collection requires uniqueness.

---

# 13. Shift Relationship Integrity

Inspect every authored relationship involving shift definitions.

At minimum:

```
segment.shiftDefinitionId
    → ShiftDefinition
```

and sequence-entry equivalents.

Determine:

* whether `null` is allowed;
* where it is allowed;
* whether every non-null reference must resolve exactly once;
* whether missing definitions currently fail, skip, or degrade;
* whether duplicate definitions make the reference ambiguous.

Adopt a current-authority validity rule where evidence supports it.

---

# 14. Cycle Containment Integrity

Investigate:

* `ShiftSegment.shiftCycleId`;
* containing `ShiftCycle.id`;
* sequence-entry containment;
* cycle mode.

Determine whether:

```
segment.shiftCycleId === containingCycle.id
```

must be an authoritative invariant.

If current runtime can tolerate mismatch, determine whether that tolerance is intentional compatibility behavior or malformed-state accommodation.

---

# 15. Segment / Sequence Mode Integrity

Inspect cycle semantics for:

* manual segments;
* repeating sequence entries;
* cycle mode/type discriminators.

Determine whether both arrays may legally contain authored data simultaneously even if only one is active.

Task 2.12 adopted a common ID namespace across both.

Task 2.14 must determine whether inactive-mode data is:

* valid preserved authored state;
* invalid;
* ignored legacy state;
* unresolved.

Do not delete inactive data without evidence.

---

# 16. Segment Range Integrity

Inspect current validation for:

* overlapping segment date ranges;
* segment ordering;
* missing start/end dates;
* invalid date ordering.

Determine which are current authored-state invariants versus generation-time tolerances.

---

# 17. Sequence Entry Integrity

Inspect current requirements for:

* day offsets;
* duplicate offsets;
* ordering;
* `shiftDefinitionId`;
* off-day/null entries.

Determine which rules belong in authored snapshot validation.

---

# 18. Template / Recurrence Relationship Integrity

Investigate:

```
BlockRecurrence.blockTemplateId
    → BlockTemplate
```

Determine:

* whether every recurrence must resolve exactly one template;
* whether templates may exist without recurrence;
* whether multiple recurrences may legally target one template;
* whether one recurrence per template is only a current UI convention;
* whether orphan recurrences are valid authored state.

Task 2.12 found one-recurrence-per-template is not a core invariant.

Preserve that distinction.

---

# 19. Template Existence Without Recurrence

Setup can create or synthesize recurrences, but current model may permit templates with no recurrence.

Determine whether such a template is:

* valid dormant authored state;
* invalid incomplete authored state;
* supported but generates no occurrence;
* handled by Setup fallback;
* another explicit classification.

Do not impose a stricter rule merely because UI normally pairs them.

---

# 20. Recurrence Frequency Integrity

Inspect currently supported and unsupported recurrence values.

Determine whether an authored recurrence using:

* `daily`;
* `weekly`;
* `specificWeekdays`;
* `timesPerUserWeek`;
* `perShiftSegment`;
* `custom`

is valid current authored state if the engine cannot execute all of them.

Distinguish:

```
type-declared
    ≠
supported executable recurrence
```

Task 2.14 must decide whether unsupported values should be prevented from becoming current authoritative state or remain valid authored intent that generation cannot yet handle.

This is potentially an architectural question; do not assume.

---

# 21. Recurrence Parameter Integrity

Inspect frequency-specific requirements:

* weekday arrays;
* `timesPerUserWeek` counts;
* start/end dates;
* template linkage;
* other recurrence fields.

Determine which malformed combinations current types permit.

Classify validation requirements.

---

# 22. Scheduling Preferences Integrity

Investigate whether authored scheduling preferences require validation beyond TypeScript shape.

Examples:

* valid time strings;
* valid week-start values;
* override structure;
* day-boundary semantics.

Determine whether Task 2.14's future validator should include them or whether existing parsing/type boundaries already guarantee validity.

Avoid expanding scope without evidence.

---

# 23. Preview Range Integrity

Task 2.1 classified `previewRange` as authored configuration with some materialized values.

Determine whether an authoritative snapshot validator should enforce:

* recognized source/preset;
* valid date strings;
* start <= end;
* cycle-source consistency.

Separate raw structural validity from values intentionally recalculated on commit.

---

# 24. Manual Event Integrity

Inspect current manual-event validation and workflow assumptions.

Determine required invariants for:

* unique ID;
* title or other required fields;
* valid date/time;
* start/end relationship;
* duration;
* movable/fixed semantics if relevant.

Do not treat UI form restrictions automatically as domain invariants.

---

# 25. Complete-Snapshot Validation Principle

Evaluate and, if supported, adopt:

> Store acceptance validation must evaluate the complete resulting authored snapshot, not only the array supplied to one setter.

Reason:

A mutation to one collection can invalidate references in another.

Example:

```
delete ShiftDefinition X
    ↓
existing segment still references X
```

A `setShiftDefinitions()` call cannot be judged solely by duplicate IDs in the new definitions array.

---

# 26. Narrow Setter Implications

Inventory current authored mutation APIs, including:

* scheduling preferences setter;
* preview range setter;
* shift definitions setter;
* shift cycles setter;
* block templates setter;
* block recurrences setter;
* manual events setter;
* atomic Setup commit;
* any other authored mutation path.

For each determine whether complete-snapshot validation is required.

---

# 27. Deletion Semantics

Validation creates a potentially important behavior change.

Example:

```
current:
    template T
    recurrence R → T

caller deletes T only
```

If complete validation rejects the mutation, deletion becomes impossible until relationship cleanup occurs atomically.

Determine whether that is desirable.

Possible models:

## A. Reject orphan-producing mutation.

Caller must submit a valid atomic resulting snapshot.

## B. Store automatically cascades dependent deletion.

This changes mutation authority and is likely out of scope.

## C. Permit temporary invalid state.

This weakens authoritative-state invariants.

Assess explicitly.

---

# 28. Atomic Relationship Changes

Task 2.14 must determine whether related mutations should eventually use existing atomic Setup commit or require additional store transactions.

Example:

```
delete template + delete recurrence
```

If narrow setter calls cannot perform this atomically under complete validation, assess:

* whether Setup already uses `commitAuthoredSetup`;
* whether direct narrow setters are compatibility/testing APIs;
* whether future API refinement is required.

Do not redesign APIs in this task.

---

# 29. Manual Event Independence

Manual events have no current authored cross-reference to templates/cycles.

Determine whether `setManualEvents()` can use a narrower validator or should still invoke the complete validator for consistency.

Prefer semantic correctness over unnecessary work.

---

# 30. Validation Result Requirements

A future pure validator must return enough information to state:

* valid/invalid;
* rule violated;
* affected source kind;
* affected ID/reference where safe;
* possibly multiple issues.

Do not design a large diagnostics framework unless required.

Compare candidate result shapes.

---

# 31. Candidate Result Model A — Boolean

```
true / false
```

Assess explainability and workflow usefulness.

Likely too weak.

---

# 32. Candidate Result Model B — First Validation Error

Conceptually:

```
{
  status: "invalid",
  issue: {
    kind: "duplicateId" | "missingReference" | ...
  }
}
```

Assess minimal implementation.

---

# 33. Candidate Result Model C — Complete Issue Collection

Conceptually:

```
{
  status: "invalid",
  issues: [...]
}
```

Assess:

* deterministic ordering;
* UI usefulness;
* implementation complexity;
* future ingress diagnostics.

---

# 34. Required Result-Model Matrix

Produce:

| Model            | Truthful | Useful to store caller | Useful for draft preflight | Useful for future recovery | Complexity | Recommendation |
| ---------------- | -------: | ---------------------: | -------------------------: | -------------------------: | ---------: | -------------- |
| boolean          |          |                        |                            |                            |            |                |
| first issue      |          |                        |                            |                            |            |                |
| issue collection |          |                        |                            |                            |            |                |

---

# 35. Deterministic Diagnostics

If multiple issues are returned, determine whether ordering must be deterministic.

Preferred bias:

1. stable rule order;
2. stable collection/source order;
3. stable ID/reference order.

This supports testing and explainability.

---

# 36. Store Rejection Contract

Determine the behavior of a future current-authoring mutation that fails validation.

Preferred conceptual flow:

```
caller proposes mutation
    ↓
derive candidate complete authored snapshot
    ↓
validate
    ↓
invalid
    ↓
state unchanged
preview unchanged
no persistence
no state notification
no durability change
explicit rejection result
```

Assess against current store API contracts.

---

# 37. Exception Versus Expected Rejection

Malformed caller-supplied authored state is potentially expected at an API boundary.

Determine whether rejection should:

* throw;
* return a discriminated mutation result;
* reuse an existing result structure;
* use another bounded contract.

Task 2.14 must decide before implementation.

---

# 38. Existing StoreMutationResult Interaction

Inspect current Phase 1 mutation result semantics.

Determine whether validation rejection can be represented by extending:

`StoreMutationResult`

or whether that type currently assumes runtime mutation succeeded and only persistence varies.

Do not overload durability outcomes with validation failure.

Validation and durability are separate dimensions.

---

# 39. Candidate Store Result Model

Assess a conceptual shape such as:

```
{
  status: "applied",
  state,
  persistence
}
```

versus:

```
{
  status: "rejected",
  reason: "invalidAuthoredState",
  validation
}
```

or another minimal discriminated contract.

Do not implement.

---

# 40. Runtime Authority On Rejection

Adopt or reject:

> A validation-rejected mutation does not become runtime/session authority.

This differs from persistence failure, where valid runtime mutation succeeds but durability may fail.

This distinction must be explicit.

---

# 41. Durability Separation

Validation failure occurs before persistence.

Therefore determine whether:

* no persistence attempt occurs;
* durability status remains unchanged;
* desired durable condition remains unchanged;
* durability subscribers receive no notification.

Likely yes; confirm architecturally.

---

# 42. Preview Preservation

If an authored mutation is rejected before state changes:

* existing Preview should remain unchanged;
* stale bit should remain unchanged;
* no regeneration occurs.

Confirm.

---

# 43. State Subscriber Semantics

Determine whether rejected mutations notify ordinary subscribers.

Preferred:

> no state change → no ordinary notification.

Confirm against store contract.

---

# 44. Workflow Feedback Boundary

Task 2.14 should identify which layer will eventually translate validation rejection for users.

Likely:

```
store / validator
    → semantic validation facts

workflow
    → contextual user feedback
```

Do not design copy or UI.

---

# 45. Setup Draft Preflight

Determine whether Setup should run the same validator before calling the store.

Potential benefits:

* contextual errors before commit;
* avoids expected rejection;
* shared semantic truth.

But store enforcement must remain authoritative.

Adopt or reject this layered model.

---

# 46. Setup Atomic Commit

Task 2.13 preserves existing atomic authored Setup commit.

Determine whether `commitAuthoredSetup` should validate the complete resulting snapshot containing:

* six Setup-owned fields from the commit;
* current manual events preserved from store state.

This ensures full authored validity.

---

# 47. Narrow Setter Rejection

Determine whether every narrow authored setter should eventually return the same validation-aware mutation result.

If some setters are primarily tests/compatibility paths, note that.

Do not remove them yet.

---

# 48. Current UI Caller Impact

Inventory production callers that consume mutation results.

Determine which workflows would require adaptation if result types become discriminated between:

* applied;
* rejected.

Task 2.14 must identify blast radius before implementation.

---

# 49. Initialization Boundary

`createDayFrameStore` currently rehydrates durable state and may accept injected partial initial state.

Determine whether current-authoring validation should run during store construction.

Likely not under the same contract because:

* durable historical ingress needs compatibility handling;
* test/injected state may intentionally construct edge fixtures.

Classify separately.

---

# 50. Local Rehydration Boundary

Task 2.12 established local historical duplicates may exist.

Task 2.14 must state clearly:

> Current-authoring validation does not authorize rejecting or replacing legacy local state during rehydration.

A separate compatibility/recovery contract is required.

---

# 51. Profile Load Boundary

Likewise, profile load is durable historical ingress/replacement.

Determine whether a future validator may be used as a **detector** during profile load without applying the same direct store-rejection policy.

For example:

```
profile normalized
    ↓
authored validator detects ambiguity
    ↓
profile load does not activate
    ↓
profile preserved
    ↓
recovery result
```

This is conceptual only.

---

# 52. Backup Import Boundary

Same assessment for backup import.

Because backups are portable recovery artifacts, invalid/ambiguous source relations require non-destructive treatment.

Task 2.14 must not authorize silent repair or empty fallback.

---

# 53. Historical Validation Reuse

Determine whether the same pure authored validator should eventually be reused for:

* current mutation enforcement;
* local ingress detection;
* profile detection;
* backup detection.

Likely desirable because semantic invalidity should have one definition.

But enforcement responses differ by boundary.

This distinction is central.

---

# 54. Semantic Validator Versus Compatibility Policy

Adopt or reject this split:

```
pure authored validator
    → tells us facts about a snapshot

current mutation policy
    → reject invalid proposed authority

historical ingress policy
    → preserve + classify + recover
```

The validator reports truth.

Boundary policy decides what to do with it.

---

# 55. Unsupported Recurrence Question

This requires an explicit determination.

If `perShiftSegment` and `custom` are declared in authored types but current generation throws:

Possible classifications:

## A. Invalid current authored state

Current authority should reject them until implemented.

## B. Valid authored intent but unsupported generation state

Store may retain them, while generation reports unsupported capability.

## C. Compatibility-only historical state

New authoring should not produce them, but historical data may contain them.

Determine from current UI/types/history.

Do not conflate structural validity with engine support without evidence.

---

# 56. Disabled Sources

Investigate whether disabled templates/recurrences may contain relationships that would otherwise be invalid.

Question:

> Does disabling a source suspend referential-integrity requirements?

Preferred bias may be no—authoritative data should remain structurally coherent even when inactive—but evidence decides.

---

# 57. Legacy Normalization Effects

Historical raw data can normalize into current authored structures.

Determine whether normalization can produce:

* missing references;
* duplicate IDs;
* unsupported recurrence forms;
* other validator failures.

This informs the later compatibility task.

Do not change normalization.

---

# 58. Relationship Repair

Task 2.14 must not authorize automatic cascade/remapping/repair.

If invalid proposed current state is rejected, workflows remain responsible for creating a valid atomic transition.

Historical repair requires separate authorization.

---

# 59. Required Validation Rule Inventory

Produce a comprehensive candidate rule table:

| Rule | Current evidence | Current violation behavior | Adopt for current authority? | Historical ingress implications |
| ---- | ---------------- | -------------------------- | ---------------------------: | ------------------------------- |

At minimum include:

* top-level duplicate IDs;
* common cycle-local work-entry IDs;
* recurrence → template link;
* segment → shift definition link;
* sequence → shift definition link;
* segment → containing cycle consistency;
* segment date validity/overlap;
* sequence offset uniqueness;
* recurrence parameter validity;
* manual-event validity;
* scheduling preference validity if applicable;
* preview-range validity if applicable;
* unsupported recurrence state.

---

# 60. Severity / Classification

Determine whether validator issues require categories such as:

* invalid;
* unsupported;
* ambiguous;
* warning.

Do not create categories unless they change acceptance behavior.

Current-authority validation should ideally have a crisp acceptance threshold.

---

# 61. Warning-Only Conditions

Identify whether any conditions should be reportable but still accepted.

Examples might include:

* template without recurrence;
* recurrence disabled;
* unused shift definition.

Do not convert ordinary unused authored data into errors.

---

# 62. Referential Integrity Matrix

Produce:

| Source/reference            | Must resolve? | Cardinality | Null allowed? | Current behavior if broken | Recommended current-authority rule |
| --------------------------- | ------------: | ----------- | ------------: | -------------------------- | ---------------------------------- |
| recurrence → template       |               |             |               |                            |                                    |
| segment → shift definition  |               |             |               |                            |                                    |
| sequence → shift definition |               |             |               |                            |                                    |
| segment → containing cycle  |               |             |               |                            |                                    |

Add other discovered relationships.

---

# 63. Mutation Acceptance Matrix

Produce:

| Operation                  | Validate complete resulting authored snapshot? | Reject on invalid? | Persist on reject? | Notify on reject? |
| -------------------------- | ---------------------------------------------: | -----------------: | -----------------: | ----------------: |
| Setup commit               |                                                |                    |                    |                   |
| set scheduling preferences |                                                |                    |                    |                   |
| set preview range          |                                                |                    |                    |                   |
| set shift definitions      |                                                |                    |                    |                   |
| set shift cycles           |                                                |                    |                    |                   |
| set templates              |                                                |                    |                    |                   |
| set recurrences            |                                                |                    |                    |                   |
| set manual events          |                                                |                    |                    |                   |

---

# 64. Boundary Policy Matrix

Produce:

| Boundary                    | Use semantic validator? | Invalid snapshot may activate? | Preserve source data? | Policy owner |
| --------------------------- | ----------------------: | -----------------------------: | --------------------: | ------------ |
| Setup commit                |                         |                                |                       |              |
| narrow setter               |                         |                                |                       |              |
| local rehydration           |                         |                                |                       |              |
| profile load                |                         |                                |                       |              |
| backup import               |                         |                                |                       |              |
| injected test/initial state |                         |                                |                       |              |

---

# 65. Result Contract Matrix

Compare candidate future store result contracts.

At minimum:

| Model                                 | Separates runtime rejection from durability? | Existing caller impact | Explainability | Recommendation |
| ------------------------------------- | -------------------------------------------: | ---------------------: | -------------: | -------------- |
| throw                                 |                                              |                        |                |                |
| existing result + optional validation |                                              |                        |                |                |
| applied/rejected discriminated union  |                                              |                        |                |                |

---

# 66. Behavioral Invariants

The result should establish later implementation invariants.

Likely candidates include:

1. invalid proposed authored state never becomes current runtime authority;
2. validation occurs before Preview invalidation;
3. validation occurs before persistence;
4. rejected mutation leaves current state unchanged;
5. rejected mutation leaves Preview unchanged;
6. rejected mutation leaves durability state unchanged;
7. rejected mutation emits no ordinary or durability notification;
8. valid mutation retains existing session-first persistence semantics;
9. one pure validator defines semantic authored validity;
10. boundary policy—not validator logic—distinguishes current authoring from historical ingress;
11. historical invalid data is never silently repaired or discarded.

Adopt only evidence-supported invariants.

---

# 67. Required Future Test Contract

Do not add tests now.

Specify future implementation coverage for at least:

* duplicate shift definitions;
* duplicate cycles;
* common nested segment/sequence collision;
* duplicate templates;
* duplicate recurrences;
* duplicate manual events;
* missing template reference;
* missing shift-definition reference;
* mismatched cycle containment;
* invalid segment overlap;
* duplicate sequence offset;
* valid unused template;
* template without recurrence if permitted;
* unsupported recurrence classification;
* rejection no state mutation;
* rejection no Preview stale change;
* rejection no persistence;
* rejection no state subscriber notification;
* rejection no durability notification;
* valid mutation behavior unchanged;
* Setup preflight/store agreement;
* historical ingress detector reuse without mutation behavior.

---

# 68. Architectural Alignment Assessment

Assess the adopted contract against:

* explicit authority;
* deterministic planning;
* session-first runtime authority;
* information provenance;
* epistemic integrity;
* durable-data compatibility;
* user-data preservation;
* occurrence identity;
* future PlanDecision work.

Use:

* Aligned;
* Partially aligned;
* Misaligned;
* Unresolved.

---

# 69. PlanDecision Implications

Determine how authored snapshot validation affects future PlanDecision work.

At minimum:

* current active source references become non-ambiguous once validity is guaranteed;
* a PlanDecision should not be created against invalid current authority;
* source incarnation remains separately required for durable decisions;
* authored replacement/invalidation semantics remain later work.

Do not implement PlanDecision.

---

# 70. OccurrenceIdentity Implications

Task 2.10 V1 identity assumes its authored source components have meaningful current referents.

Current-snapshot validation should strengthen that guarantee.

Determine whether any validator finding would require changing `OCCURRENCE_IDENTITY_VERSION`.

Expected answer likely no.

Do not change it.

---

# 71. Source-Incarnation Boundary

Preserve Task 2.11:

```
valid unique current snapshot
    ≠
historical source-lifetime identity
```

Validation must not be described as making V1 occurrence identity durable-reference safe.

---

# 72. Compatibility Assessment

Task 2.14 must identify whether future current-mutation validation can be implemented without:

* durable schema changes;
* profile version changes;
* backup version changes;
* migrations.

Likely yes.

Historical ingress validation/recovery may later require new result/status behavior, but that is outside the immediate current-authoring implementation.

---

# 73. Recommended Implementation Staging

If the contract is sufficiently clear, recommend a bounded sequence.

Potential sequence:

1. add pure authored snapshot validator and deterministic issue model;
2. directly test validation semantics;
3. introduce validation-aware store mutation result;
4. enforce validation for current authored mutation APIs;
5. add Setup draft preflight using same validator where useful;
6. separately investigate/implement historical ingress classification and recovery.

Do not assume exact staging; derive it from findings.

---

# 74. Expected Next Task

Possible outcomes:

## If validator semantics and result contract are fully determined

> **Task 2.15 — Implement Pure Authored-Snapshot Validation and Current-Mutation Rejection**

## If store result semantics need their own decision

> **Task 2.15 — Establish Validation-Aware Store Mutation Result Semantics**

## If unsupported recurrence classification blocks validity

> **Task 2.15 — Resolve Unsupported Authored Recurrence Acceptance Semantics**

Task 2.14 decides the next seam.

---

# 75. Evidence Classification

Material findings must use:

* **Confirmed**
* **Inferred**
* **Not found**
* **Unresolved**
* **Recommended**
* **Deferred**

Do not present proposed validation rules as current executable facts.

---

# 76. Explicit Non-Goals

Task 2.14 shall not:

* implement validation;
* reject mutations;
* modify store result types;
* modify Setup;
* modify manual-event workflows;
* change source ID allocation;
* change persistence;
* change local rehydration;
* change profile load;
* change backup import;
* repair historical data;
* add migrations;
* add source incarnation;
* change occurrence identity;
* change occurrence identity version;
* add PlanDecision;
* change recurrence expansion;
* implement unsupported recurrence types;
* change Preview behavior;
* change durability semantics;
* update ADRs;
* update `CURRENT_STATE.md`;
* update `CHANGELOG.md`;
* create a checkpoint;
* perform unrelated cleanup.

Discovery does not authorize implementation.

---

# 77. Required Result Structure

The Task 2.14 result artifact must contain at least:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Current Authored Acceptance Boundary
5. Authored Snapshot Definition
6. Validation Ownership Assessment
7. Ownership Model Matrix
8. Adopted Validation Authority
9. ID Uniqueness Rules
10. Shift Relationship Integrity
11. Cycle Containment Integrity
12. Segment / Sequence Integrity
13. Template / Recurrence Relationship Integrity
14. Template-Without-Recurrence Determination
15. Recurrence Frequency Acceptance
16. Recurrence Parameter Integrity
17. Scheduling Preference Validation
18. Preview Range Validation
19. Manual Event Validation
20. Complete-Snapshot Validation Determination
21. Narrow Setter Implications
22. Deletion / Atomic Relationship Semantics
23. Validation Result Models
24. Result Model Matrix
25. Adopted Validation Result Contract
26. Store Rejection Semantics
27. Runtime Authority On Rejection
28. Persistence / Durability Behavior On Rejection
29. Preview Preservation
30. Subscriber Semantics
31. Workflow Feedback Boundary
32. Setup Draft Preflight
33. Setup Commit Semantics
34. Narrow Setter Semantics
35. Production Caller Impact
36. Initialization Boundary
37. Local Rehydration Boundary
38. Profile Load Boundary
39. Backup Import Boundary
40. Semantic Validator / Compatibility Policy Separation
41. Unsupported Recurrence Determination
42. Required Validation Rule Inventory
43. Referential Integrity Matrix
44. Mutation Acceptance Matrix
45. Boundary Policy Matrix
46. Result Contract Matrix
47. Behavioral Invariants
48. Required Future Test Contract
49. OccurrenceIdentity Implications
50. PlanDecision Implications
51. Source-Incarnation Boundary
52. Compatibility Assessment
53. Architectural Alignment Assessment
54. Open Questions
55. Recommended Implementation Sequence
56. Recommended Next Task
57. Deviations
58. Discoveries and Deferred Work
59. Validation
60. Final Completion Determination

Additional sections may be added where evidence requires them.

---

# 78. Validation Requirements

This task is investigation only.

No executable or test files should change.

At minimum run:

```
npm run lint
npm run typecheck
npm test
npm run build
```

Record:

* task artifact hash;
* task/result artifact integrity;
* full test-file count;
* full test count;
* build result;
* whether executable files changed;
* whether governance files changed.

Reference searches must cover:

* all current authored mutation APIs;
* all production callers;
* existing validators;
* source relationship lookups;
* cycle validation;
* recurrence validation;
* manual-event workflow validation;
* current store result semantics;
* local/profile/backup normalization and replacement boundaries.

If the worktree contains earlier Phase 2 changes, distinguish those from Task 2.14 work.

---

# 79. Completion Criteria

Task 2.14 is complete only when:

* the current authored acceptance boundary is mapped;
* one validation ownership model is adopted;
* complete authored validity rules are established or explicitly deferred;
* uniqueness rules are incorporated;
* source relationship invariants are established;
* template/recurrence semantics are established;
* cycle/segment/sequence invariants are established;
* manual-event validity is established;
* unsupported recurrence acceptance is explicitly determined;
* complete-snapshot versus narrow validation is decided;
* deletion/atomic relationship semantics are decided;
* one validation result model is adopted;
* future store rejection behavior is defined;
* state/Preview/persistence/durability/subscriber behavior on rejection is explicit;
* Setup preflight ownership is determined;
* current-authoring policy is separated from historical ingress policy;
* local/profile/backup boundaries are classified;
* required matrices are complete;
* future test requirements are defined;
* occurrence identity and PlanDecision implications are recorded;
* source incarnation remains explicitly separate;
* a bounded implementation sequence is identified;
* no unauthorized implementation occurs;
* repository-standard validation passes;
* immutable task artifact remains unchanged.

---

# 80. Task Determination

Task 2.14 is an architectural validation-authority investigation.

It exists because DayFrame can now prevent ordinary interactive ID collisions at creation time, but current store mutation boundaries do not yet have one explicit semantic contract for deciding whether a complete proposed authored snapshot is valid enough to become authority.

The core question is:

> What facts must be true before DayFrame accepts a proposed authored snapshot as current authoritative state, and which boundary is responsible for enforcing that truth?

The answer must preserve the distinction between:

```
rejecting newly proposed invalid authority
```

and:

```
non-destructively handling historical durable data
that may already violate the newer contract
```

Validation must report semantic truth.

Boundary policy must decide what to do with that truth.

**Task 2.14 is complete when DayFrame has an evidence-backed authored-snapshot validation and acceptance contract, has explicitly defined rejection behavior for current authored mutations, has separated that behavior from historical durable-ingress compatibility and recovery, and has made no unauthorized implementation change.**
