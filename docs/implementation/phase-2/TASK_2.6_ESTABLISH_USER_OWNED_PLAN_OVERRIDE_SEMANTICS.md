# Task 2.6 — Establish User-Owned Plan Override Semantics

**Project:** DayFrame

**Phase:** Phase 2 — Authority and State Alignment

**Task ID:** 2.6

**Task Name:** Establish User-Owned Plan Override Semantics

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation / Architectural Authority Decision

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning the investigation, verify that this task artifact is complete and record its integrity hash.

Record the investigation outcome in a separate result artifact:

`TASK_2.6_ESTABLISH_USER_OWNED_PLAN_OVERRIDE_SEMANTICS_RESULT.md`

The result artifact should document:

* current planning-decision gap;
* candidate override identities;
* occurrence identity;
* scope;
* lifecycle;
* invalidation;
* conflict semantics;
* regeneration semantics;
* sequencing/order semantics;
* persistence/durability;
* profile/backup implications;
* clear/reset behavior;
* provenance;
* history/undo implications;
* engine-input implications;
* future Planner implications;
* selected authority contract;
* required implementation invariants;
* recommended next task;
* validation;
* final completion determination.

This task is investigation and architectural decision only.

Do not modify production code, tests, state types, store APIs, persistence, durable formats, profiles, backups, engine behavior, Preview behavior, or UI.

If evidence is insufficient to decide a specific representation, adopt semantic requirements and explicitly defer the concrete schema.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Phase 2 Context;
* Governing Evidence;
* Objective;
* Override Authority Question;
* Occurrence Identity;
* Scope;
* Invalidation;
* Conflict Semantics;
* Regeneration;
* Durability;
* Profile/Backup Boundaries;
* History/Undo;
* Candidate Models;
* Decision Standard;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame has an evidence-backed authority contract for user-owned plan overrides defining what an override targets, how it survives regeneration, how it responds to authored-state changes, how conflicting overrides resolve, what durability and provenance obligations apply, whether command/history state is required, and what smallest implementation boundary should represent accepted planning decisions without promoting derived Preview state to authority or mutating recurring authored intent incorrectly.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the integrity discrepancy for project review.

---

# Purpose

Define the missing authoritative planning-state class identified by Task 2.4.

Task 2.4 established:

```text
authored recurring intent
    ↓
derived preview
    ↓
user accepts occurrence-level fix
```

and determined that:

* the user decision should not silently mutate the recurring authored definition;
* the decision should not disappear on regeneration;
* the revised Preview itself should not become authoritative;
* accepted occurrence-level decisions require explicit user-owned planning authority.

Task 2.6 determines the semantics of that authority.

---

# Phase 2 Context

Task 2.1 established the current authoritative/derived state map.

Task 2.4 established a split fix model:

```text
definition-level recommendation
    → explicit authored edit

occurrence-level planning decision
    → user-owned plan override
```

Task 2.5 now prevents stale recommendations from being applied.

The next problem is therefore semantic, not defensive:

> **What is a user-owned plan override?**

---

# Governing Evidence

Use current executable behavior and accepted Phase 2 decisions.

Relevant architectural principles include:

* explicit authority;
* deterministic planning;
* explainability;
* information provenance;
* separation of authored and derived state;
* user-data preservation;
* forward migration safety;
* durable-data governance;
* session-first runtime authority.

Task 2.4 established:

> The schedule result remains derived, while accepted occurrence decisions should be explicit authoritative planning inputs.

Task 2.6 must make that model concrete enough to guide implementation.

---

# Objective

Determine:

1. what an override represents;
2. what object or occurrence it targets;
3. whether it targets generated identity, authored identity, or both;
4. how identity survives regeneration;
5. whether an override is single-occurrence or may have broader scope;
6. how it behaves if authored intent changes;
7. how multiple overrides interact;
8. whether ordering matters;
9. whether final-state representation is sufficient;
10. whether history/command sequence is required;
11. how the engine consumes overrides;
12. whether overrides are durable user data;
13. whether profiles capture them;
14. whether backups capture them;
15. what clear/reset does to them;
16. what provenance must survive;
17. what future Planner operations create/update/delete them;
18. what smallest implementation boundary should follow.

---

# Current Planning-Decision Gap

Restate the current mismatch:

```text
authoritative authored state A
    ↓
generate plan P
    ↓
user chooses occurrence-level change F
    ↓
preview-only P'
```

Current `P'` is:

* user-influenced;
* not persisted;
* not reproducible from `A`;
* discarded on regeneration;
* not represented as a separate authoritative object.

Task 2.6 must define:

```text
A + O
    ↓
generate
    ↓
P'
```

where:

```text
O = explicit user-owned plan override state
```

---

# Override Authority Question

Explicitly answer:

> What makes a plan override authoritative?

Candidate principle:

> An override becomes authoritative only through explicit user action selecting or confirming a plan-level decision.

It is not authoritative merely because the engine recommends it.

It is not derived merely because it references generated state.

Evaluate and adopt/refine this principle.

---

# Override Object Category

Determine whether a plan override is best understood as:

* authored domain object;
* derived domain object with user ownership;
* command;
* planning-layer authoritative object;
* configuration;
* exception;
* unresolved.

Task 2.4 suggests a separate planning-layer authority class.

Make the classification explicit.

---

# Occurrence Identity Problem

This is the central design problem.

An override such as:

```text
move this occurrence
skip this occurrence
reduce this occurrence
```

requires a stable target.

Investigate current generated identities for:

* scheduled blocks;
* block candidates;
* work blocks;
* manual-event projections;
* recurrence-derived occurrences.

Determine which IDs are:

* deterministic;
* authored-derived;
* date-scoped;
* planning-window-scoped;
* revision-scoped;
* unstable across regeneration.

---

# Candidate Occurrence Identity Model A — Generated Block ID

Model:

```text
override.target = scheduledBlock.id
```

Assess:

* stability across deterministic regeneration;
* behavior if range/window changes;
* behavior after recurrence/template edits;
* collision risk;
* semantic readability;
* migration safety.

Likely insufficient as sole durable identity unless guaranteed.

---

# Candidate Occurrence Identity Model B — Authored Source + Date/Occurrence Key

Model:

```text
templateId
recurrenceId
user-day/date
occurrence ordinal/key
```

Assess whether this is sufficient to identify one logical occurrence before placement.

Consider:

* multiple occurrences from one recurrence;
* times-per-user-week recurrence;
* cycle-based behavior;
* overnight user-day boundaries;
* DST/date semantics if relevant;
* shifted planning windows.

---

# Candidate Occurrence Identity Model C — Explicit Occurrence ID Generated Deterministically

Model:

```text
OccurrenceId = deterministic function(authoritative source + recurrence expansion context)
```

Assess whether Phase 2 should introduce a first-class occurrence identity later.

Do not implement it here.

---

# Candidate Occurrence Identity Model D — Override Targets Semantic Predicate

Model:

```text
source = template/recurrence
date/scope
semantic selector
```

rather than one concrete generated ID.

Assess ambiguity and complexity.

---

# Required Occurrence Identity Matrix

Produce:

| Identity Model              | Stable Across Regeneration | Stable Across Range Change | Survives Authored Edit | Human/Debug Explainability | Implementation Complexity | Recommendation |
| --------------------------- | -------------------------: | -------------------------: | ---------------------: | -------------------------: | ------------------------: | -------------- |
| generated block ID          |                            |                            |                        |                            |                           |                |
| authored source + date/key  |                            |                            |                        |                            |                           |                |
| deterministic occurrence ID |                            |                            |                        |                            |                           |                |
| semantic predicate          |                            |                            |                        |                            |                           |                |

---

# Scope Semantics

Determine valid override scopes.

At minimum distinguish:

## Single occurrence

Example:

```text
skip Tuesday's workout
```

## One user-day instance

Potentially equivalent to single occurrence depending on model.

## Date-specific override

Example:

```text
move this occurrence on 2026-08-21
```

## Range-limited override

Potential future use.

## Recurring definition change

This is **not** a plan override; it belongs to authored intent.

Make this separation normative.

---

# Current Fix Mapping

Map current automatic fix actions to likely override semantics:

| Current Fix         | Likely Override Meaning                         |
| ------------------- | ----------------------------------------------- |
| `moveBlock`         | occurrence placement override                   |
| `skipBlock`         | occurrence suppression/skip override            |
| `convertToRecovery` | occurrence semantic/category override           |
| `reduceDuration`    | occurrence duration override                    |
| `changePriority`    | occurrence priority override                    |
| `acceptConflict`    | occurrence/conflict acceptance override         |
| `changeFixedTime`   | authored edit recommendation, not plan override |

Assess whether each needs a distinct subtype or one generic override payload.

---

# Override Representation Models

## Model A — One Generic Override Type

Conceptually:

```text
PlanOverride {
  id
  occurrenceId
  action
  payload
}
```

Assess simplicity versus semantic weakness.

---

## Model B — Discriminated Override Union

Conceptually:

```text
MoveOccurrenceOverride
SkipOccurrenceOverride
DurationOverride
PriorityOverride
CategoryOverride
AcceptConflictOverride
```

Assess type clarity and validation.

---

## Model C — Final Desired Occurrence State

Conceptually:

```text
OccurrenceOverride {
  occurrenceId
  targetStart?
  duration?
  category?
  priority?
  skipped?
  acceptedConflicts?
}
```

Assess whether normalized final state avoids command-order dependence.

---

## Model D — Ordered Accepted Commands

Conceptually:

```text
AcceptedPlanCommand[]
```

Assess whether current semantics genuinely require sequence replay.

---

# Required Representation Matrix

Produce:

| Representation                    | Encodes Final State | Requires Order | Easy To Validate | Easy To Explain | Future Engine Fit | Recommendation |
| --------------------------------- | ------------------: | -------------: | ---------------: | --------------: | ----------------: | -------------- |
| generic action override           |                     |                |                  |                 |                   |                |
| discriminated override union      |                     |                |                  |                 |                   |                |
| normalized final occurrence state |                     |                |                  |                 |                   |                |
| ordered commands                  |                     |                |                  |                 |                   |                |

---

# Final-State Versus Command Semantics

Explicitly answer:

> Can DayFrame represent the final user decision without preserving how the user got there?

Examples:

```text
move to 18:00
then reduce duration
```

could become:

```text
start = 18:00
duration = 30
```

If final-state representation is sufficient, avoid command history.

If semantics depend on order, explain exactly where.

---

# Conflict Between Overrides

Determine behavior when two overrides affect the same occurrence.

Examples:

```text
skip + move
skip + duration
move + move
priority + priority
```

Candidate policies:

* last accepted wins;
* merge compatible fields;
* reject conflicting overrides;
* normalize into one final override object.

Assess which best supports determinism and explainability.

---

# Override Normalization

Consider whether multiple decisions should normalize to one canonical occurrence override.

Conceptually:

```text
accepted decisions
    ↓
normalize
    ↓
one final override state per occurrence
```

This may avoid dependence on historical ordering.

Do not implement.

---

# Invalidation By Authored Changes

This is critical.

Determine what happens if an override targets an occurrence derived from:

```text
template T
recurrence R
date D
```

and the user later edits:

* template duration;
* recurrence pattern;
* preferred window;
* enabled state;
* category;
* cycle assignment;
* scheduling preferences.

Possible outcomes:

* override remains valid;
* override becomes incompatible;
* override becomes orphaned;
* override requires confirmation;
* override auto-migrates.

Define policy categories.

---

# Candidate Invalidation Model A — Always Preserve

Override continues if the occurrence identity still resolves.

Assess risks.

---

# Candidate Invalidation Model B — Version-Bound Override

Override references a base authored revision/version and becomes stale after relevant authored changes.

Assess need for authored versioning.

---

# Candidate Invalidation Model C — Semantic Revalidation

On regeneration:

```text
override
    ↓
resolve occurrence
    ↓
validate compatibility
    ↓
apply / mark conflict / orphan
```

Assess likely fit.

---

# Candidate Invalidation Model D — Delete On Authored Change

Reject unless strongly justified.

Silent deletion would violate user-data preservation.

---

# Required Invalidation Matrix

Produce:

| Authored Change              | Override Still Applies? | Revalidation Needed? | User Confirmation Needed? | Never Silently Delete? |
| ---------------------------- | ----------------------: | -------------------: | ------------------------: | ---------------------: |
| title-only change            |                         |                      |                           |                        |
| duration change              |                         |                      |                           |                        |
| recurrence/date change       |                         |                      |                           |                        |
| disable template             |                         |                      |                           |                        |
| delete source template       |                         |                      |                           |                        |
| scheduling preference change |                         |                      |                           |                        |
| planning-window change       |                         |                      |                           |                        |

---

# Orphaned Override Semantics

If the source occurrence no longer exists:

```text
override target missing
```

determine whether the override should:

* remain durable but inactive/orphaned;
* be user-visible for cleanup;
* be automatically removed;
* migrate to a replacement occurrence.

Preferred bias:

> do not silently delete user-owned planning decisions.

Assess against durable-data principles.

---

# Override Freshness / Validity State

Determine whether overrides need lifecycle states such as:

```text
active
conflicted
orphaned
needsReview
```

or whether validity can remain derived at generation time.

Avoid adding persisted status if it can be recomputed.

---

# Generation Contract

Define the future conceptual engine input:

```text
DayFrameAuthoredSetup
    +
PlanOverrides
    +
generation window/provenance
    ↓
generateSchedulePreview / future planning engine
```

Determine where overrides should enter:

* candidate generation;
* placement;
* post-placement adjustment;
* conflict resolution;
* another stage.

Do not modify the engine.

---

# Override Application Order

Determine whether overrides should be applied:

1. before placement;
2. during candidate generation;
3. during placement;
4. after base schedule generation;
5. per subtype.

Examples:

* skip may suppress candidate creation;
* duration may alter placement constraints;
* move may constrain placement target;
* priority may affect placement ordering;
* acceptConflict may affect friction classification.

This may mean overrides are not one post-processing layer.

Document semantic stage requirements.

---

# Deterministic Regeneration

Adopt or refine:

> Equivalent authored state + equivalent plan overrides + equivalent generation provenance must produce equivalent derived plan output.

This should extend deterministic planning.

Determine whether timestamps should remain provenance-only rather than semantic input where possible.

---

# Multiple Override Determinism

Define how equivalent override sets are ordered/canonicalized.

If final state is normalized per occurrence, engine semantics should not depend on array insertion order.

If order remains meaningful, justify it.

---

# Durability Classification

Explicitly determine:

> Are accepted plan overrides durable user data?

Task 2.4 strongly recommends yes.

Assess against:

* user expectation;
* regeneration;
* reload;
* clear;
* user-data preservation;
* recovery.

Likely classification:

**Authoritative planning data — durable.**

Confirm or reject.

---

# Durable Surface Question

Determine whether overrides should conceptually live:

## Option A — Inside active authored persistence

Pros:

* one active snapshot.

Cons:

* conflates recurring authored intent with plan-level decisions.

## Option B — Separate active planning surface

Pros:

* clearer lifecycle/versioning.

Cons:

* more durability complexity.

## Option C — Same envelope, separate explicit section

Pros:

* atomic active state.

Cons:

* format evolution required.

Do not select schema solely for convenience.

---

# Profiles

Explicitly determine whether saved profiles should include plan overrides.

Current profile semantics:

```text
named authored setup snapshot
```

Task 2.4 suggests occurrence overrides should not automatically enter profiles.

Likely recommendation:

```text
profiles
    → authored reusable setup only

plan overrides
    → active planning state
```

Assess.

---

# Backups

Current backup semantics are authored setup only.

Determine whether:

* existing setup backups remain authored-only;
* future complete-state backups need overrides;
* a new backup version/type may eventually be required.

Do not change formats.

---

# Clear Semantics

Determine whether:

```text
Clear Local Data
```

must clear plan overrides.

Likely yes if they are active local user data.

Also distinguish possible future:

```text
clear current plan overrides
```

from clearing all authored data.

Do not add commands/UI.

---

# Profile Load Semantics

If active plan overrides exist, loading a profile creates a key question:

```text
replace authored setup
    ↓
what happens to overrides tied to old authored occurrences?
```

Possible policies:

* clear all active overrides;
* preserve and revalidate;
* prompt later;
* profile load may optionally restore its own overrides if profiles ever include them.

Define preferred semantics.

---

# Backup Import Semantics

Same question:

* replace authored setup;
* preserve or clear/revalidate overrides?

Because backup import is full authored replacement, old overrides may target obsolete occurrences.

Determine policy.

---

# Clear / Replacement Matrix

Produce:

| Operation            | Authored State            | Plan Overrides      | Recommendation |
| -------------------- | ------------------------- | ------------------- | -------------- |
| narrow authored edit | mutate                    | preserve/revalidate |                |
| setup commit         | mutate/replace six        | preserve/revalidate |                |
| manual event edit    | mutate                    | preserve/revalidate |                |
| profile load         | full authored replacement | ?                   |                |
| backup import        | full authored replacement | ?                   |                |
| clear                | reset                     | ?                   |                |
| regeneration         | preserve                  | preserve            |                |

---

# Provenance Requirements

Determine minimum provenance for an override.

Potential fields/semantics:

```text
overrideId
source occurrence identity
action kind
user accepted at
source recommendation/fix kind
source friction identity
base authored revision/version
target/result
```

Do not over-prescribe storage fields.

Classify:

* required semantic provenance;
* useful optional provenance;
* unnecessary historical detail.

---

# Explainability

Future DayFrame should be able to explain:

```text
Why is this block at 18:00?
```

with an answer equivalent to:

```text
The engine originally proposed another placement.
You accepted a move for this occurrence.
```

Determine what provenance must survive to support that.

---

# History / Undo

Explicitly answer:

> Does the override model require command history?

Possible answer:

```text
No, final normalized overrides are enough for current authority.
```

with future undo/audit deferred.

If yes, explain why final state cannot capture semantics.

Do not add history preemptively.

---

# Acceptance History Versus Current Authority

Distinguish:

```text
current plan override
```

from:

```text
historical record that user accepted recommendation X
```

The former may be required now; the latter may be future analytics/history.

Do not conflate them.

---

# Future Live / Learn Implications

Consider whether accepted plan decisions might later become:

* execution context;
* behavioral evidence;
* recommendation acceptance analytics.

Do not implement.

Determine only whether provenance should preserve future forward paths.

---

# User Edit Of Override

Future Planner may need:

* create override;
* modify override;
* remove override;
* revert to generated behavior.

Define conceptual authority:

```text
remove override
    → return occurrence to engine-derived behavior
```

This is distinct from deleting authored commitment intent.

---

# Manual Events

Determine whether manual events need plan overrides.

Manual events are already fixed authored occurrences.

Potential planning actions may still:

* accept conflict;
* move if authored semantics permit;
* be fixed/non-movable.

Do not assume all override types apply to every source.

---

# Work Blocks / Shift-Derived Occurrences

Determine whether plan overrides may target generated work blocks.

Current suggested fixes may treat work differently.

Assess whether:

* work blocks are anchored and should not receive generic move/skip overrides;
* any future override needs separate authorization.

---

# Accept Conflict Semantics

This is special.

`acceptConflict` does not change placement; it changes user acceptance of known friction.

Determine whether it belongs to:

* plan override;
* acknowledged-friction state;
* separate user decision object.

Assess whether treating it as one override subtype is semantically clean.

---

# Candidate Authority Model A — Unified PlanOverride Class

All occurrence-level accepted decisions belong to one discriminated class.

Assess simplicity.

---

# Candidate Authority Model B — Occurrence Overrides + Conflict Acknowledgements

Separate:

```text
OccurrenceOverride
AcknowledgedConflict
```

Assess whether `acceptConflict` has sufficiently different lifecycle/identity.

---

# Candidate Authority Model C — General Plan Decision Class

Conceptually:

```text
PlanDecision
    ├── occurrence override
    └── conflict acceptance
```

Assess future extensibility.

---

# Required Authority Model Matrix

Produce:

| Model                        | Handles Placement | Handles Semantic Changes | Handles Conflict Acceptance | Clear Authority | Future Extensibility | Recommendation |
| ---------------------------- | ----------------: | -----------------------: | --------------------------: | --------------: | -------------------: | -------------- |
| one PlanOverride union       |                   |                          |                             |                 |                      |                |
| overrides + acknowledgements |                   |                          |                             |                 |                      |                |
| generalized PlanDecision     |                   |                          |                             |                 |                      |                |

---

# Recommended Decision Bias

Prefer:

* explicit semantic authority;
* normalized final state over accidental command replay;
* durable user-owned planning decisions;
* regeneration from all authoritative inputs;
* no silent authored-definition mutation;
* no silent deletion after authored changes;
* no promotion of the full Preview snapshot to authority;
* no history unless current semantics require it.

---

# Required Behavioral Invariants

The result should establish later implementation invariants.

Likely candidates:

1. recommendations are derived until accepted;
2. accepted plan decisions become explicit authoritative planning data;
3. recurring authored definitions remain unchanged unless explicitly edited;
4. regeneration consumes plan decisions;
5. accepted decisions survive regeneration;
6. accepted decisions survive reload if durable;
7. invalid decisions are surfaced, not silently deleted;
8. replacement operations have explicit plan-decision semantics;
9. equivalent authority inputs produce equivalent plans;
10. removing a plan decision returns behavior to derivation.

---

# Required Later Test Contract

Do not add tests now.

Specify later tests for:

* stable occurrence identity;
* move override persistence;
* skip override persistence;
* duration/category/priority override behavior;
* conflict acknowledgement;
* regeneration;
* authored edit invalidation;
* orphan handling;
* deterministic override conflict resolution;
* reload;
* clear;
* profile load;
* backup import;
* profile exclusion/inclusion policy;
* provenance;
* no template mutation for occurrence decisions.

---

# Architectural Alignment Assessment

Assess the proposed contract against:

* authoritative/derived separation;
* deterministic planning;
* provenance;
* explainability;
* durable-data governance;
* user-data preservation;
* future Planner semantics;
* future engine architecture;
* implementation complexity.

Use:

* Aligned
* Partially aligned
* Misaligned
* Unresolved

---

# Required Investigation Labels

Every significant finding must use:

* **Confirmed**
* **Inferred**
* **Not found**
* **Unresolved**
* **Recommended**
* **Deferred**

Do not present speculative future schema as confirmed architecture.

---

# Explicit Non-Goals

Task 2.6 shall not:

* add plan override types;
* modify `DayFrameState`;
* modify `DayFrameAuthoredSetup`;
* modify persistence;
* change profiles;
* change backups;
* change clear behavior;
* change engine inputs;
* change placement;
* change suggested-fix behavior;
* change stale behavior;
* add command history;
* add undo;
* add provenance fields;
* add occurrence IDs;
* redesign Planner;
* implement future commitments/goals/allocations;
* update governance documents before review.

---

# Dependencies

Requires completion and acceptance of:

* Task 2.1 — Authoritative and Derived State Boundary;
* Task 2.4 — Suggested-Fix and Preview-Revision Authority;
* Task 2.5 — Stale Suggested-Fix Safety.

Task 2.2–2.3 startup authority alignment must remain preserved.

Governed by:

* Architecture Charter;
* Complete Architecture Specification;
* `DECISIONS.md`;
* durable-data ADR;
* Phase 1 checkpoint;
* current Phase 2 findings.

---

# Evidence Standards

Priority:

1. production executable code;
2. current generated identity algorithms;
3. current recurrence/placement semantics;
4. direct tests;
5. architecture/governance documents;
6. historical task results.

Future semantics may require recommendations beyond current code, but those must be labeled **Recommended** or **Deferred**.

---

# Required Code Inspection

At minimum inspect:

```text
ScheduledBlock
BlockCandidate
Shift/work block IDs
BlockRecurrence
BlockTemplate
ManualCalendarEvent
generateBlockCandidates
placeBlockCandidates
generateSchedulePreview
reviseSchedulePreview
generateSuggestedFixes
applySuggestedFix
DayFrameAuthoredSetup
profile/backup boundaries
clear/load/import semantics
```

Also inspect tests proving deterministic IDs and recurrence expansion where available.

---

# Required Result Artifact Structure

The Task 2.6 result should contain:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Current Planning-Decision Gap
5. Override Authority Classification
6. Current Generated Identity Inventory
7. Occurrence Identity Assessment
8. Occurrence Identity Model Matrix
9. Adopted Occurrence Identity Contract
10. Override Scope
11. Current Fix-to-Override Mapping
12. Candidate Override Representations
13. Override Representation Matrix
14. Adopted Override Representation Semantics
15. Final-State Versus Command Determination
16. Multiple-Override Conflict Semantics
17. Normalization Semantics
18. Authored-Change Invalidation
19. Invalidation Matrix
20. Orphaned Override Semantics
21. Override Validity/Freshness
22. Generation Integration
23. Override Application Stage
24. Deterministic Regeneration Contract
25. Durability Classification
26. Durable Surface Assessment
27. Profile Semantics
28. Backup Semantics
29. Clear Semantics
30. Profile Load Replacement Semantics
31. Backup Import Replacement Semantics
32. Replacement Matrix
33. Provenance Requirements
34. Explainability Requirements
35. History / Undo Determination
36. Current Authority Versus Historical Acceptance
37. Manual-Event Implications
38. Work/Shift Implications
39. Conflict-Acceptance Semantics
40. Candidate Authority Models
41. Authority Model Matrix
42. Adopted Plan-Decision Authority Contract
43. Required Behavioral Invariants
44. Required Later Test Contract
45. Architectural Alignment Assessment
46. Open Questions
47. Recommended Next Task
48. Deviations
49. Discoveries and Deferred Work
50. Validation
51. Final Completion Determination

---

# Expected Decision Outcomes

Several outcomes are possible.

## Outcome A — One Durable PlanOverride Union

All accepted occurrence-level decisions use one explicit discriminated authority class.

## Outcome B — Plan Decisions Split Into Overrides + Conflict Acknowledgements

Occurrence changes and conflict acceptance are separate authority classes.

## Outcome C — General PlanDecision Authority

A broader planning-decision class contains occurrence changes and acknowledgements as distinct subtypes.

## Outcome D — Identity Blocker

If stable occurrence identity cannot be defined safely yet, the next task may need to establish occurrence identity before override representation.

## Outcome E — Durable Surface Governance Blocker

If override durability cannot be placed without a new architectural decision, Task 2.6 should identify that blocker instead of inventing a storage model.

---

# Expected Follow-Up

Do not assume Task 2.7 is implementation.

Possible next tasks:

### If occurrence identity is the missing prerequisite

> **Task 2.7 — Establish Stable Generated-Occurrence Identity**

### If semantics are complete but representation needs design

> **Task 2.7 — Design User-Owned Plan Decision Representation and Lifecycle**

### If durability requires governance

> **Task 2.7 — Decide Active Plan-Decision Durable Surface and Versioning**

### If the model is sufficiently bounded

> **Task 2.7 — Introduce Plan Decision Authority Without Engine Behavior Change**

The investigation determines the next seam.

---

# Validation Requirements

This task is investigation only.

No executable/test file should change.

Run targeted tests only where needed to establish identity or recurrence behavior.

At minimum consider suites covering:

```text
generateSchedulePreview
generateBlockCandidates
placeBlockCandidates
reviseSchedulePreview
dayFrameStore
```

Then, if required by execution discipline:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Confirm:

* Task 2.6 specification remained immutable;
* only the separate result artifact was created;
* no governance document changed;
* no durable format changed.

---

# Completion Criteria

Task 2.6 is complete when:

* plan override authority is classified;
* occurrence identity options are assessed;
* one occurrence identity contract is adopted or an explicit blocker is found;
* valid override scopes are defined;
* current fix actions are mapped to future planning semantics;
* representation models are compared;
* final-state versus command semantics are decided;
* multiple-override conflicts are defined;
* normalization policy is established;
* authored-change invalidation is defined;
* orphan semantics are defined;
* regeneration integration is defined;
* durability classification is decided;
* profile/backup/clear/replacement implications are established;
* provenance requirements are defined;
* history/undo need is decided;
* conflict acceptance receives an explicit semantic home;
* required later invariants/tests are documented;
* no executable behavior changes;
* a dependency-correct next task is identified.

---

# Task Determination

Task 2.6 is an architectural investigation into user-owned planning authority.

It does not implement plan overrides.

Its purpose is to define the authoritative state that must exist between recurring authored intent and derived schedule output once the user makes a specific planning decision about a generated occurrence.

**The task is complete when DayFrame has an evidence-backed authority contract for user-owned plan overrides defining what an override targets, how it survives regeneration, how it responds to authored-state changes, how conflicting overrides resolve, what durability and provenance obligations apply, whether command/history state is required, and what smallest implementation boundary should represent accepted planning decisions without promoting derived Preview state to authority or mutating recurring authored intent incorrectly.**
