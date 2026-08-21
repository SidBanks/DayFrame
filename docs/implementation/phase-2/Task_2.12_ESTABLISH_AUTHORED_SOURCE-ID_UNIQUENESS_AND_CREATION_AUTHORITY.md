# Task 2.12 — Establish Authored Source-ID Uniqueness and Creation Authority

**Project:** DayFrame
**Phase:** Phase 2 — Authority and State Alignment
**Task ID:** 2.12
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

`TASK_2.12_ESTABLISH_AUTHORED_SOURCE_ID_UNIQUENESS_AND_CREATION_AUTHORITY_RESULT.md`

This task is investigative.

Do not modify production code, tests, public types, persistence formats, architectural governance documents, checkpoints, or unrelated documentation.

No implementation is authorized by this task.

---

# 2. Purpose

Task 2.11 established that DayFrame currently has no explicit source-incarnation model and that Version 1 `OccurrenceIdentity` is not safe as a durable foreign key.

Task 2.11 also discovered a more immediate and independent defect:

* several authored-source IDs are generated from collection length;
* deleting a source can allow a later source to reuse that ID;
* deleting a non-final source can cause the next generated ID to collide with an existing source;
* duplicate authored IDs are generally tolerated rather than rejected.

This creates ambiguity even within current runtime authority.

Task 2.12 must determine the correct uniqueness contract and creation authority for authored-source IDs before DayFrame changes identifier generation.

The task must preserve the distinction:

```
source-ID uniqueness
    ≠
source-incarnation identity
```

Uniqueness prevents simultaneous or accidental aliasing.

Incarnation semantics determine whether a later source with the same historical identity is the same source lifetime.

Task 2.12 addresses only the first concern.

---

# 3. Governing Evidence

Use executable production behavior as the primary source.

Relevant evidence includes:

* Task 2.1 authoritative-state boundary;
* Task 2.10 explicit occurrence identity;
* Task 2.11 source-incarnation and reuse findings;
* Setup source creation/edit/delete workflows;
* manual-event creation/edit/delete workflows;
* `DayFrameState` and authored-source types;
* store setters;
* Setup commit behavior;
* local persistence normalization;
* profile normalization/load;
* backup normalization/import;
* cycle/segment validation;
* candidate generation;
* work generation;
* source lookup maps;
* direct tests for source creation/deletion/replacement.

Architecture and historical task artifacts may provide supporting context.

Do not infer uniqueness merely because IDs look unique.

---

# 4. Objective

Determine:

1. which authored-source IDs require uniqueness;
2. the scope of that uniqueness;
3. who owns creation of new IDs;
4. which current paths can create collisions;
5. which current paths accept duplicates;
6. whether duplicates are valid historical durable data or invalid-but-tolerated data;
7. whether new creation should prevent collisions without rewriting existing IDs;
8. whether store setters should enforce uniqueness;
9. whether normalization/import should reject, preserve, or explicitly classify duplicates;
10. whether profile and backup replacement need different treatment from interactive creation;
11. whether uniqueness can be implemented without a durable schema change;
12. what smallest implementation sequence should follow.

---

# 5. Core Architectural Question

Task 2.12 must answer:

> What uniqueness guarantee should DayFrame make for identity-bearing authored-source IDs, and which architectural boundary owns the creation of new IDs that satisfy that guarantee?

The answer must distinguish:

```
ID allocation
```

from:

```
source mutation
```

from:

```
validation
```

from:

```
durable compatibility
```

Do not automatically assign all four responsibilities to the same layer.

---

# 6. Sources In Scope

At minimum investigate:

* `ShiftDefinition.id`;
* `ShiftCycle.id`;
* `ShiftSegment.id`;
* `ShiftCycleSequenceDay.id`;
* `BlockTemplate.id`;
* `BlockRecurrence.id`;
* `ManualCalendarEvent.id`.

Also inspect related parent/source relationships needed to determine uniqueness scope.

Do not include profile IDs unless necessary as comparative evidence; profile IDs are not part of Task 2.10 occurrence identity.

---

# 7. Current Creation Authority

For each source, identify the current production creator.

Classify creation as owned by:

* UI component;
* application workflow;
* store;
* domain/core helper;
* imported durable source;
* caller-supplied object.

Produce:

| Source | Current creator | ID generated where? | Store validates? | Caller may supply ID? |
| ------ | --------------- | ------------------- | ---------------- | --------------------- |

---

# 8. Current ID Generation Algorithms

Record exact current algorithms.

Task 2.11 found representative patterns such as:

```
shift_${length + 1}

cycle_${nextIndex}

segment_${nextIndex}

sequence_day_${length + 1}

template_${length + 1}

rec_template_${nextIndex}

manual_event_${timestamp}
```

Confirm current production implementations.

For each algorithm determine:

* collision risk after deletion;
* collision risk after reordering;
* collision risk after import/profile replacement;
* collision risk under multiple rapid creations;
* whether current code scans for existing IDs;
* whether uniqueness is guaranteed by another invariant.

---

# 9. Interactive Creation Collision Analysis

For each interactive workflow, investigate:

```
current list
    ↓
delete one item
    ↓
add another item
```

Explicitly test/reason through:

## Delete final item

Does the next item reuse the deleted ID?

## Delete middle item

Can the next generated ID equal an ID still present later in the collection?

## Multiple rapid creations

Can timestamp-derived or state-derived ID generation produce duplicates?

Document current behavior separately from desired policy.

---

# 10. Required Uniqueness Scope

For each source determine whether uniqueness should be:

* global across all source kinds;
* global within one source type;
* unique within a parent;
* unique within one cycle;
* unique within one template;
* unique only within the active authored snapshot;
* unique across active/profile/backup durable history;
* another evidence-supported scope.

Do not choose global uniqueness when parent-scoped uniqueness is sufficient.

---

# 11. Shift Definition Uniqueness

Determine whether `ShiftDefinition.id` must be unique across:

* the active `shiftDefinitions` collection;
* all shift definitions in profiles/backups;
* historical deleted definitions;
* other source types.

Identify every lookup that assumes uniqueness.

---

# 12. Shift Cycle Uniqueness

Determine whether `ShiftCycle.id` must be unique across active cycles.

Assess effects on:

* effective preference lookup;
* work occurrence identity;
* profile/backup restoration;
* future durable references.

---

# 13. Segment and Sequence-Entry Uniqueness

Determine whether:

* manual segment IDs need only be unique within their containing cycle;
* sequence-entry IDs need only be unique within their containing cycle;
* Task 2.10 work identity already supplies containing cycle context.

If parent-scoped uniqueness is sufficient, state that explicitly.

Do not unnecessarily impose global identifiers.

---

# 14. Template Uniqueness

Determine whether `BlockTemplate.id` must be unique across active templates.

Inspect current `Map` behavior and recurrence linkage.

Task 2.11 found that duplicate template IDs can cause last-entry lookup authority.

Determine whether duplicates make authored authority ambiguous.

---

# 15. Recurrence Uniqueness

Determine whether `BlockRecurrence.id` must be:

* globally unique across recurrences;
* unique only within a template;
* unique as part of `(templateId, recurrenceId)`.

Task 2.10 occurrence identity includes both template ID and recurrence ID.

Use actual generation and lookup behavior.

---

# 16. Manual Event Uniqueness

Determine whether `ManualCalendarEvent.id` must be unique across active manual events.

Assess:

* edit lookup;
* delete filtering;
* projection IDs;
* Task 2.10 manual occurrence identity;
* import/profile/backup behavior.

---

# 17. Duplicate-State Semantics

Task 2.11 established that duplicate IDs can currently survive.

Task 2.12 must classify duplicate authored state.

Possible classifications:

## A. Valid supported state

Duplicates are intentionally meaningful.

## B. Invalid authored state that should be rejected going forward

Existing tolerance is an implementation gap.

## C. Ambiguous historical input requiring non-destructive compatibility handling

New creation should prevent duplicates, but old data cannot simply be discarded.

## D. Scope-dependent

Some duplicates are invalid globally while others are valid under parent scope.

Select per source where necessary.

---

# 18. Interactive Creation Versus Ingress

Explicitly distinguish:

```
new user-created source
    ↓
must satisfy current uniqueness contract
```

from:

```
historical persisted/profile/backup source
    ↓
may contain duplicate IDs under old behavior
```

The task must determine whether these boundaries should have different policies.

Do not assume that historical compatibility requires allowing new duplicates.

---

# 19. Creation Authority Candidate A — UI-Owned Collision-Free Allocation

The UI generates an ID by scanning current draft sources and selecting an unused value.

Assess:

* simplicity;
* consistency;
* multi-workflow duplication;
* testability;
* future non-UI callers;
* architecture ownership.

---

# 20. Creation Authority Candidate B — Store-Owned Allocation

The store exposes operations that allocate source IDs.

Assess:

* authority centralization;
* compatibility with draft-before-save Setup workflow;
* whether the store currently owns unsaved object creation;
* coupling to UI drafts;
* API expansion.

---

# 21. Creation Authority Candidate C — Shared Pure ID Allocator

A domain/shared helper accepts current IDs or source collection and returns a collision-free ID.

Conceptually:

```
allocateNextSourceId(existingIds, prefix)
```

or source-specific helpers.

Assess:

* deterministic behavior;
* UI/store reuse;
* preservation of current readable ID conventions;
* architectural ownership.

---

# 22. Creation Authority Candidate D — Random / UUID IDs

New authored sources receive collision-resistant identifiers independent of collection state.

Assess:

* strength;
* durable compatibility implications;
* future incarnation relationship;
* testing;
* readability;
* whether this prematurely solves part of source-incarnation design.

Do not assume UUIDs are preferred merely because they are unique.

---

# 23. Required Creation Authority Matrix

Produce:

| Model                 | Prevents active collisions | Central authority | Works with Setup draft | Durable format change? | Incarnation-safe? | Complexity | Recommendation |
| --------------------- | -------------------------: | ----------------: | ---------------------: | ---------------------: | ----------------: | ---------: | -------------- |
| UI scan               |                            |                   |                        |                        |                   |            |                |
| store allocation      |                            |                   |                        |                        |                   |            |                |
| shared pure allocator |                            |                   |                        |                        |                   |            |                |
| random/UUID           |                            |                   |                        |                        |                   |            |                |

“Incarnation-safe” must remain distinct from collision-safe.

---

# 24. Human-Readable ID Preservation

Current IDs are readable:

```
shift_1
cycle_001
template_2
```

Determine whether there is any architectural/product value in preserving readable IDs.

Consider:

* debugging;
* test fixtures;
* exported backups;
* user visibility;
* migration;
* future durable references.

Do not preserve readability merely because it exists today if it causes correctness problems.

---

# 25. Collision-Free Sequential Allocation

Assess a minimal algorithm such as:

```
existing IDs:
    shift_1
    shift_3

next new ID:
    shift_2
```

or:

```
next new ID:
    shift_4
```

Compare:

## First available gap

Pros:

* compact.

Cons:

* aggressively reuses historical IDs after deletion.

## Monotonic max-plus-one within active collection

Pros:

* avoids collision with current items.

Cons:

* can still reuse deleted highest IDs later and is not incarnation-safe.

## Random/generated unique key

Pros:

* avoids practical reuse.

Cons:

* changes identity style and may cross into incarnation design.

Task 2.12 must distinguish active uniqueness from lifetime uniqueness.

---

# 26. Recommended Bias

Prefer the smallest mechanism that guarantees the adopted **current-snapshot uniqueness scope** without falsely claiming lifetime uniqueness.

Do not use Task 2.12 to smuggle in source incarnation.

If max-plus-one or collision scanning is enough for current uniqueness, state that.

If not, explain why.

---

# 27. Store Validation Question

Determine whether store mutation boundaries should reject duplicate authored IDs.

Inspect:

* narrow setters;
* `commitAuthoredSetup`;
* profile load;
* backup import;
* initialization.

Possible policies:

## A. Store rejects duplicates from all callers.

## B. Interactive creation prevents duplicates, but store preserves current permissive replacement behavior.

## C. Store validates current authored mutation but ingress compatibility paths handle historical duplicates separately.

## D. Another source-specific policy.

Assess carefully.

---

# 28. Setup Draft Validation

Setup operates on an unsaved draft before atomic commit.

Determine whether duplicate IDs should be prevented:

* at object creation;
* before commit;
* both.

Do not introduce user-facing validation semantics unless justified.

Ideally, ordinary UI creation should never produce an invalid draft.

---

# 29. Manual-Event Workflow Validation

Manual events use a separate workflow.

Determine whether ID uniqueness should be guaranteed:

* at creation;
* before `setManualEvents`;
* by the store;
* through a shared allocator.

Assess timestamp collision realistically.

---

# 30. Persistence Normalization

Determine whether local persisted-state normalization currently validates uniqueness.

If not, determine whether future duplicate handling belongs to:

* parse validation;
* normalization;
* migration;
* runtime recovery;
* separate compatibility work.

Do not implement.

---

# 31. Profile Normalization

Determine how duplicate source IDs in saved profiles should eventually be treated.

Possible outcomes:

* preserve and warn;
* reject profile as invalid;
* normalize/remap;
* mark as recovery-required;
* unresolved pending durable compatibility task.

Task 2.12 should classify, not implement.

---

# 32. Backup Import

Backups are durable user recovery artifacts.

Task 2.12 must explicitly answer whether an imported backup containing duplicate IDs should eventually:

* be rejected non-destructively;
* be imported with ambiguity preserved;
* be converted/remapped;
* require recovery tooling.

Do not silently remap durable identifiers without provenance.

---

# 33. Existing Duplicate Durable Data

Task 2.11 established that older versions could produce duplicate IDs through ordinary UI behavior.

Therefore existing duplicate durable data may be DayFrame-produced user data.

Task 2.12 must respect the Phase 1 durable-data ADR.

Do not recommend destructive normalization merely to simplify current authority.

---

# 34. Duplicate Compatibility Boundary

Determine whether the future contract should be:

```
NEW AUTHORING
    duplicates prohibited

HISTORICAL INGRESS
    duplicates explicitly detected
    ↓
    preserve/recover/migrate according to durable policy
```

This is a likely model but must be evidence-backed.

---

# 35. No Silent Remapping Principle

Assess and, if appropriate, adopt:

> Historical identity-bearing IDs must not be silently rewritten during ordinary normalization solely to eliminate duplicates.

Reason:

* references between templates and recurrences;
* cycle/segment/definition relationships;
* future provenance;
* backup fidelity.

Any remapping would need a coordinated migration/recovery contract.

---

# 36. Source Relationship Integrity

Uniqueness alone is insufficient.

Investigate whether current linked-source references can become ambiguous when duplicates exist.

Examples:

```
recurrence.blockTemplateId
    → which template?

segment.shiftDefinitionId
    → which shift definition?
```

Determine lookup behavior and whether uniqueness is a prerequisite for referential integrity.

---

# 37. Duplicate Lookup Behavior

Document current map/find behavior for each linked source.

At minimum:

* template lookup;
* shift-definition lookup;
* cycle/segment lookup where applicable;
* manual-event edit/delete by ID.

Produce:

| Reference | Duplicate behavior | Authority consequence |
| --------- | ------------------ | --------------------- |

---

# 38. Replacement Operations

Profile load and backup import replace complete active authored state.

Determine whether uniqueness should be validated:

* before replacement;
* after normalization;
* or deferred as compatibility recovery.

Session-first authority and non-destructive behavior must remain respected.

---

# 39. Clear / Recreate

Task 2.11 found that clear forgets all retired IDs.

Task 2.12 must explicitly state:

> Preventing current active collisions after clear does not prevent historical ID reuse.

This is acceptable within Task 2.12 if source incarnation remains deferred.

Do not represent clear/recreate reuse as solved.

---

# 40. Profile / Backup Restoration

Likewise:

```
old ID returns through restore
    ≠
active duplicate
```

A restored snapshot may have unique IDs internally while still reusing IDs from an earlier lifetime.

That is a source-incarnation issue, not a uniqueness defect.

Preserve this distinction.

---

# 41. OccurrenceIdentity Implications

Determine how active source uniqueness improves Task 2.10 Version 1 identity.

Likely:

* removes simultaneous ambiguous referents;
* reduces runtime identity collisions;
* strengthens bounded lineage comparison;
* does not establish historical continuity;
* does not make V1 durable-ready.

State explicitly.

---

# 42. PlanDecision Implications

Determine whether current-snapshot uniqueness is a prerequisite for:

* PlanDecision investigation;
* session-only PlanDecision;
* durable PlanDecision.

Likely:

```
PlanDecision investigation
    → no implementation dependency

session-only PlanDecision
    → needs active uniqueness or strict validation

durable PlanDecision
    → needs uniqueness + incarnation/durable-reference contract
```

Confirm from evidence.

---

# 43. Source-Incarnation Deferral

Task 2.12 must not choose:

* incarnation token structure;
* source lifetime semantics;
* restoration semantics;
* OccurrenceIdentity Version 2.

Those remain later tasks.

However, the result should state how the uniqueness decision constrains or simplifies future incarnation work.

---

# 44. Required Uniqueness Matrix

Produce:

| Source              | Required uniqueness scope | Current guarantee | Collision path exists? | Recommended enforcement boundary |
| ------------------- | ------------------------- | ----------------- | ---------------------: | -------------------------------- |
| ShiftDefinition     |                           |                   |                        |                                  |
| ShiftCycle          |                           |                   |                        |                                  |
| ShiftSegment        |                           |                   |                        |                                  |
| SequenceEntry       |                           |                   |                        |                                  |
| BlockTemplate       |                           |                   |                        |                                  |
| BlockRecurrence     |                           |                   |                        |                                  |
| ManualCalendarEvent |                           |                   |                        |                                  |

---

# 45. Required Lifecycle Separation Matrix

Produce:

| Scenario                                                 | Active uniqueness solves it? | Needs incarnation semantics? | Notes |
| -------------------------------------------------------- | ---------------------------: | ---------------------------: | ----- |
| two current templates with same ID                       |                              |                              |       |
| delete template then recreate same ID                    |                              |                              |       |
| profile restore of prior ID                              |                              |                              |       |
| backup restore of prior ID                               |                              |                              |       |
| clear then recreate old ID                               |                              |                              |       |
| duplicate recurrences in same snapshot                   |                              |                              |       |
| same unique IDs across two separate historical snapshots |                              |                              |       |

---

# 46. Required Ingress Policy Matrix

Produce:

| Boundary              | New duplicates should be allowed? | Historical duplicates may exist? | Recommended handling |
| --------------------- | --------------------------------: | -------------------------------: | -------------------- |
| Setup creation        |                                   |                                  |                      |
| Manual-event creation |                                   |                                  |                      |
| Store setter          |                                   |                                  |                      |
| Setup commit          |                                   |                                  |                      |
| local rehydration     |                                   |                                  |                      |
| profile load          |                                   |                                  |                      |
| backup import         |                                   |                                  |                      |

---

# 47. Candidate Implementation Sequence

If the uniqueness contract is sufficiently clear, recommend a staged sequence.

Potential example:

1. introduce shared collision-free ID allocation helpers;
2. route interactive creation through them;
3. add direct delete-middle/recreate regression tests;
4. add active-state uniqueness validation where justified;
5. separately investigate historical duplicate ingress/recovery;
6. preserve source-incarnation work for later.

Do not assume this sequence; derive it from findings.

---

# 48. Compatibility Assessment

Determine whether changing new-ID allocation alone requires:

* no durable format change;
* no migration;
* only behavior change for newly created items.

Likely yes, but verify.

If validation begins rejecting previously accepted arrays, that may create a compatibility boundary and must be treated separately.

---

# 49. Occurrence Identity Versioning

Determine whether merely preventing new duplicate IDs requires changing:

```
OCCURRENCE_IDENTITY_VERSION = 1
```

Expected answer is likely no, because equality semantics do not change.

But if ID allocation changes the semantic interpretation of V1 identity, explain why.

Do not change it.

---

# 50. Architectural Ownership

Determine the proper owner of:

## ID uniqueness policy

Potentially authored-domain/state contract.

## ID allocation

Potentially shared creation helper/workflow.

## duplicate validation

Potentially store/domain validation boundary.

## historical duplicate recovery

Durable-data compatibility/recovery boundary.

The result should avoid collapsing these into one owner.

---

# 51. Test Coverage Assessment

Audit current coverage for:

* create after delete;
* delete middle then create;
* duplicate source IDs;
* duplicate recurrence IDs;
* duplicate segment/sequence IDs;
* duplicate manual-event IDs;
* linked lookup ambiguity;
* profile/backup duplicate ingress;
* runtime occurrence collisions.

Identify gaps.

Do not add tests in this investigation.

---

# 52. Required Evidence Labels

Material conclusions should use:

* **Confirmed**
* **Inferred**
* **Not found**
* **Unresolved**
* **Recommended**
* **Deferred**

Do not convert a proposed uniqueness policy into a claim about current behavior.

---

# 53. Explicit Non-Goals

Task 2.12 shall not:

* change source ID generation;
* add allocation helpers;
* modify Setup creation;
* modify manual-event creation;
* reject duplicates;
* add validation;
* add source-incarnation fields;
* add UUIDs;
* change existing durable IDs;
* remap historical data;
* add migrations;
* change local-storage format;
* change profile format;
* change backup format;
* change compatibility readers;
* change occurrence identity;
* change `OCCURRENCE_IDENTITY_VERSION`;
* add PlanDecision;
* change scheduling behavior;
* change recurrence expansion;
* change UI behavior;
* update ADRs;
* update `CURRENT_STATE.md`;
* update `CHANGELOG.md`;
* create a checkpoint;
* perform unrelated cleanup.

Discovery does not authorize implementation.

---

# 54. Required Result Structure

The Task 2.12 result artifact must contain at least:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Sources In Scope
5. Current Creation Authority
6. Current ID Algorithms
7. Interactive Collision Analysis
8. Required Uniqueness Scope
9. Shift Definition Uniqueness
10. Shift Cycle Uniqueness
11. Segment / Sequence Uniqueness
12. Template Uniqueness
13. Recurrence Uniqueness
14. Manual Event Uniqueness
15. Duplicate-State Classification
16. Interactive Creation Versus Historical Ingress
17. Candidate Creation Authority Models
18. Creation Authority Matrix
19. Human-Readable ID Assessment
20. Collision-Free Sequential Allocation Assessment
21. Adopted Creation Authority Contract
22. Store Validation Assessment
23. Setup Draft Validation
24. Manual-Event Validation
25. Persistence Normalization Assessment
26. Profile Duplicate Handling
27. Backup Duplicate Handling
28. Historical Duplicate Compatibility
29. No-Silent-Remapping Determination
30. Source Relationship Integrity
31. Duplicate Lookup Behavior
32. Replacement Operation Semantics
33. Clear / Restore Distinction
34. OccurrenceIdentity Implications
35. PlanDecision Implications
36. Source-Incarnation Deferral
37. Uniqueness Matrix
38. Lifecycle Separation Matrix
39. Ingress Policy Matrix
40. Compatibility Assessment
41. Occurrence Identity Versioning
42. Architectural Ownership
43. Behavioral Invariants
44. Test Coverage Assessment
45. Architectural Alignment Assessment
46. Open Questions
47. Recommended Implementation Sequence
48. Recommended Next Task
49. Deviations
50. Discoveries and Deferred Work
51. Validation
52. Final Completion Determination

---

# 55. Validation Requirements

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
* test-file count;
* test count;
* build result;
* whether executable files changed;
* whether governance files changed.

If the worktree contains prior Phase 2 changes, distinguish them from Task 2.12 changes.

Reference searches must cover all supported production source-creation and duplicate-sensitive lookup paths.

---

# 56. Completion Criteria

Task 2.12 is complete only when:

* all identity-bearing authored sources are inventoried;
* current creation authority is established;
* current ID algorithms are documented;
* collision paths are established;
* required uniqueness scope is defined per source;
* duplicate authored state is classified;
* new interactive creation and historical ingress are explicitly separated;
* candidate creation-authority models are compared;
* one creation-authority contract is adopted or a blocker is identified;
* store-validation responsibilities are determined;
* historical duplicate handling is bounded by durable-data policy;
* no-silent-remapping requirements are determined;
* linked-source ambiguity is documented;
* active uniqueness versus source incarnation is explicitly separated;
* OccurrenceIdentity implications are established;
* PlanDecision dependencies are established;
* compatibility implications are established;
* required matrices are complete;
* test gaps are documented;
* a bounded implementation sequence is identified;
* no unauthorized implementation occurs;
* repository-standard validation passes;
* the immutable task artifact remains unchanged.

---

# 57. Task Determination

Task 2.12 is an architectural uniqueness and creation-authority investigation.

It exists because Task 2.11 established that DayFrame's current authored-source ID generation can produce both historical reuse and simultaneous active collisions.

This task does not attempt to solve source lifetime identity.

Its central question is:

> What identifiers must be unique within current authored authority, and which boundary is responsible for creating and validating identifiers that satisfy that contract?

The investigation must preserve the distinction:

```
active uniqueness
    ≠
historical incarnation
```

Preventing duplicate active IDs strengthens current authority and Version 1 runtime occurrence identity.

It does not make those identities durable-reference safe.

**Task 2.12 is complete when DayFrame has an evidence-backed authored-source ID uniqueness and creation-authority contract, has explicitly separated new-authoring guarantees from historical duplicate-data compatibility and source-incarnation semantics, and has made no unauthorized implementation change.**
