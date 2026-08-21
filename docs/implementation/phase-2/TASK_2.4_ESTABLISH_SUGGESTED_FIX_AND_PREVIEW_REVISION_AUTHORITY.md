# Task 2.4 — Establish Suggested-Fix and Preview-Revision Authority

**Project:** DayFrame

**Phase:** Phase 2 — Authority and State Alignment

**Task ID:** 2.4

**Task Name:** Establish Suggested-Fix and Preview-Revision Authority

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation / Architectural Authority Decision

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning the investigation, verify that this task artifact is complete and record its integrity hash.

Record the investigation outcome in a separate result artifact:

`TASK_2.4_ESTABLISH_SUGGESTED_FIX_AND_PREVIEW_REVISION_AUTHORITY_RESULT.md`

The result artifact should document:

* current suggested-fix generation;
* current suggested-fix categories/actions;
* current production callers;
* current revision path;
* authored-state effects;
* derived-state effects;
* persistence effects;
* stale-preview behavior;
* regeneration behavior;
* exact reproducibility;
* current user-visible semantics;
* candidate authority models;
* stale-action candidate models;
* selected authority contract;
* future engine implications;
* required implementation invariants;
* recommended next task;
* validation;
* final completion determination.

This task is investigation and architectural decision only.

Do not modify production code, tests, state types, engine behavior, UI, persistence, durable formats, preview semantics, or architecture/governance documents.

If current evidence cannot establish intended product meaning for an accepted suggested fix, distinguish current executable behavior from the recommended authority contract rather than inventing historical intent.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Phase 2 Context;
* Governing Evidence;
* Objective;
* Suggested-Fix Inventory;
* Preview-Revision Audit;
* Authored-Intent Audit;
* Reproducibility Audit;
* Stale-Preview Audit;
* Candidate Authority Models;
* Candidate Stale-Action Models;
* Decision Standard;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame has an evidence-backed authority contract defining what an accepted suggested fix means, whether it changes authored intent or only derived preview state, how its effect can or cannot be regenerated, whether any replayable command/history is required, and how suggested-fix actions behave when the preview is stale before later engine or state-container refactoring is authorized.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the integrity discrepancy for project review.

---

# Purpose

Resolve the second major authority mismatch identified by Task 2.1.

Task 2.1 established:

```text
authoritative authored state
    → seven authored fields

derived state
    → preview and scheduling outputs
```

but also found that:

```text
applySuggestedFixToPreview()
    → revises derived Preview
    → leaves authored state unchanged
```

The resulting revised Preview may no longer be exactly regenerable from authoritative authored state.

That creates an unresolved authority question:

> **What does the user mean when they accept a suggested fix?**

Task 2.4 must answer that before later engine or state-model restructuring.

---

# Phase 2 Context

Phase 2 is aligning authoritative versus derived state.

Tasks 2.1–2.3 established that:

* active authored state is authoritative;
* Preview is normally derived and disposable;
* ordinary startup no longer injects hidden authored data;
* user-authored and derived state must not silently exchange authority.

Suggested-fix acceptance now represents the most important remaining case where the user performs an action against derived state and the result is not clearly represented in authoritative state.

---

# Governing Evidence

Use current executable behavior as the primary source.

Relevant principles include:

* authoritative versus derived state separation;
* deterministic planning;
* information provenance;
* explainability;
* explicit authority;
* regeneration from authoritative inputs;
* session-first runtime authority;
* architectural traceability;
* historical immutability where applicable.

Task 2.1 specifically found:

> Preview-only accepted fixes are neither durable nor reproducible from current authored state.

Task 2.4 must determine whether that is intentional disposable behavior or an authority defect.

---

# Objective

Determine:

1. what suggested fixes currently represent;
2. where they are generated;
3. which fix categories/actions exist;
4. what accepting each fix does;
5. whether any fix mutates authored state;
6. whether any fix persists;
7. whether the revised Preview is regenerable;
8. whether fix choice or parameters are retained anywhere;
9. whether regeneration discards accepted fixes;
10. whether fix application to stale Preview is currently allowed;
11. what product/UI language implies about permanence;
12. whether accepted fixes should be:

    * disposable Preview experiments;
    * authored changes;
    * replayable commands;
    * another explicit state class;
13. whether stale Preview actions should be rejected, disabled, regenerated, or otherwise handled;
14. what smallest implementation sequence follows.

---

# Required Code Inspection

At minimum inspect:

```text
generateSuggestedFixes
reviseSchedulePreview
applySuggestedFixToPreview
detectScheduleFriction
generateSchedulePreview
PreviewScreen
DayFrameApp
```

Also inspect:

* suggested-fix types;
* friction types;
* fix IDs;
* move/change-time action structures;
* UI button labels/copy;
* stale-preview UI behavior;
* tests covering suggested fixes and revision.

---

# Suggested-Fix Inventory

Inventory every current suggested-fix action/category.

For each, record:

| Fix Type / Action | Generated From | Parameters Retained | Current Effect | Authored Mutation? | Preview Mutation? | Persisted? |
| ----------------- | -------------- | ------------------- | -------------- | -----------------: | ----------------: | ---------: |

Do not group semantically distinct actions merely because the UI uses one button style.

---

# Current Suggested-Fix Generation

Trace:

```text
friction
    ↓
generateSuggestedFixes
    ↓
suggested fix objects
```

Determine:

* which derived objects they reference;
* whether they reference authored IDs;
* whether they encode a complete desired authored change;
* whether they encode only a derived placement move;
* whether they are deterministic from the friction state;
* whether order/IDs are stable.

---

# Suggested-Fix Object Authority

Explicitly classify suggested-fix objects as one of:

* derived recommendation;
* authored intent;
* command;
* workflow-local option;
* unresolved.

Task 2.1 strongly suggests derived recommendation, but confirm from production behavior.

---

# Preview Revision Audit

Trace:

```text
user accepts suggested fix
    ↓
DayFrameApp / PreviewScreen handler
    ↓
applySuggestedFixToPreview
    ↓
reviseSchedulePreview
    ↓
new preview result
```

For each fix path determine:

* whether it mutates authored state;
* whether it changes `scheduledBlocks`;
* whether it changes `unplacedCandidates`;
* whether it recomputes friction;
* whether it changes suggested fixes;
* whether it records fix identity;
* whether it records parameters;
* whether it records `revisedAt`;
* whether it preserves `generatedAt`;
* whether it changes `isStale`.

---

# Authored-Intent Audit

For every accepted fix, answer:

> Does DayFrame retain the user's intent anywhere outside the revised Preview?

Possible locations to inspect:

* authored setup;
* manual events;
* templates;
* recurrences;
* scheduling preferences;
* profiles;
* backups;
* action feedback;
* revision metadata;
* hidden command/history state.

Classify as:

* retained;
* partially retained;
* not retained.

---

# Fix Category Split

Task 2.1 found at least one behavioral split:

```text
most suggested fixes
    → revise preview only

changeFixedTime
    → navigate user to Setup
```

Confirm the exact split.

This may indicate that not all suggested fixes should share one authority model.

Determine whether the current fix vocabulary already distinguishes:

* preview-only proposal;
* authored-edit recommendation.

---

# Reproducibility Audit

For a generated preview:

```text
authored state A
    ↓
generate
    ↓
preview P
```

then:

```text
accept fix F
    ↓
revised preview P'
```

determine whether:

```text
generate(authored state A)
```

can produce `P'`.

If not, determine what additional information would be required:

* fix ID;
* block ID;
* target time;
* target date;
* ordering;
* sequence of fixes;
* previous preview state;
* other context.

---

# Multiple Fix Sequence Audit

Determine whether users can apply more than one fix sequentially.

If yes, investigate:

```text
P
  + F1
  → P1
  + F2
  → P2
```

Ask whether exact `P2` requires preserving:

* F1;
* F2;
* application order;
* intermediate state.

If order matters, record it.

Do not implement history.

---

# Regeneration Behavior

Trace what happens after:

```text
accepted preview fix
    ↓
Generate Preview again
```

Determine whether:

* the fix survives;
* the fix is recomputed independently;
* the original schedule returns;
* another deterministic schedule appears;
* revision metadata disappears.

This is central to authority classification.

---

# Navigation / Session Behavior

Determine what happens to revised Preview when:

* user navigates away and back;
* user edits Setup;
* user edits manual events;
* profile is loaded;
* backup is imported;
* clear occurs;
* application reloads.

Classify whether revision survives each.

---

# Durability Audit

Confirm whether revised Preview or accepted fix intent is persisted in:

* active local storage;
* saved profiles;
* backups;
* any other durable surface.

Expected answer may be no, but confirm.

---

# Product-Copy Audit

Inspect visible copy around suggested fixes.

Record terms such as:

* Apply;
* Fix;
* Move;
* Resolve;
* Try;
* Suggestion;
* Recommendation;
* Change;
* Save.

Determine whether current language implies:

* temporary Preview experiment;
* permanent schedule change;
* authored change;
* unclear semantics.

Do not rewrite copy.

---

# User Expectation Risk

Assess whether current behavior can plausibly lead a user to believe:

```text
I fixed my schedule
```

when the system actually means:

```text
I temporarily changed this preview snapshot
```

This is a product/authority risk even if implementation is internally consistent.

---

# Stale-Preview Audit

Task 2.1 found that fix actions remain usable on stale Preview.

Trace:

```text
preview generated
    ↓
authored state changes
    ↓
preview.isStale = true
    ↓
suggested fix still available
    ↓
apply fix
```

Determine:

* whether store permits it;
* whether UI disables it;
* whether revision engine validates freshness;
* whether the result remains stale;
* whether friction/fixes are recalculated against old Preview only;
* whether authored changes are ignored by that revision.

---

# Stale-Fix Correctness Risk

Assess whether applying a fix to a stale Preview can create a revised schedule based on obsolete authored inputs.

If yes, classify as:

* safe disposable experiment;
* misleading;
* invalid authority transition;
* unresolved.

---

# Current Stale Warning

Inspect the current stale warning/copy.

Determine whether it communicates:

* the Preview is outdated;
* a new Preview should be generated;
* fix actions are still safe;
* fix actions should not be used.

Do not infer action policy from warning presence alone.

---

# Candidate Authority Model A — Disposable Preview Experiment

Model:

```text
suggested fix
    ↓
temporary experiment against current preview
    ↓
preview-only revision
    ↓
discarded on regeneration/replacement
```

Under this model:

* authored state remains unchanged;
* revised Preview is intentionally non-regenerable;
* UI must clearly communicate temporariness;
* stale Preview behavior must still be defined.

Assess fit with current behavior and future architecture.

---

# Candidate Authority Model B — Accepted Fix Becomes Authored Intent

Model:

```text
suggested fix
    ↓
user accepts
    ↓
translate into authored state change
    ↓
regenerate Preview
```

Under this model, fix acceptance is a domain mutation.

Assess whether current fix types can map cleanly to existing authored concepts.

For example:

* moving a flexible block may require changing preferred window/time;
* moving one occurrence may require an exception object that does not currently exist.

Do not assume current model can represent every accepted placement.

---

# Candidate Authority Model C — Replayable Revision Command

Model:

```text
authored state
    +
ordered accepted fix commands
    ↓
derived Preview
```

Fixes become durable or session-level replayable commands rather than authored field changes.

Assess:

* determinism;
* order dependence;
* provenance;
* durability;
* history requirements;
* future engine compatibility.

Do not implement command history.

---

# Candidate Authority Model D — Separate Plan Override / Allocation Object

Model:

```text
authored intent
    ↓
generated schedule
    ↓
user accepts specific allocation/placement override
    ↓
explicit planning-layer object
```

This could align with future architecture if a user can override one generated occurrence without changing the underlying commitment definition.

Assess conceptually.

Do not invent final future domain names unless supported by architecture.

---

# Candidate Authority Model E — Split By Fix Type

Model:

```text
some fixes
    → preview experiments

some fixes
    → authored edits

some fixes
    → future plan overrides
```

Assess whether current fix categories naturally demand different authority semantics.

This may be more realistic than forcing all fixes into one model.

---

# Required Authority Model Matrix

Produce:

| Model                         | Regenerable | Durable | Preserves User Intent | Fits Current Data Model | Fits Future Architecture | Complexity | Recommendation |
| ----------------------------- | ----------: | ------: | --------------------: | ----------------------: | -----------------------: | ---------: | -------------- |
| Disposable preview experiment |             |         |                       |                         |                          |            |                |
| Authored intent mutation      |             |         |                       |                         |                          |            |                |
| Replayable command            |             |         |                       |                         |                          |            |                |
| Explicit planning override    |             |         |                       |                         |                          |            |                |
| Split by fix type             |             |         |                       |                         |                          |            |                |

---

# Suggested-Fix Meaning Decision

The investigation must explicitly answer:

> What does “accept/apply suggested fix” mean in DayFrame?

Do not leave this as merely “currently changes preview.”

The result should adopt one of:

* preview experiment;
* authored change;
* replayable command;
* planning override;
* split model;
* unresolved pending broader architecture.

If unresolved, identify the exact governance gap blocking a decision.

---

# Candidate Stale-Action Model A — Allow Revision Of Stale Preview

Current behavior.

Assess whether this is coherent under the chosen authority model.

---

# Candidate Stale-Action Model B — Disable / Reject Fixes When Stale

Model:

```text
preview stale
    ↓
fix actions unavailable
    ↓
generate fresh preview first
```

Assess simplicity and correctness.

---

# Candidate Stale-Action Model C — Automatically Regenerate Before Fix

Model:

```text
user selects stale fix
    ↓
regenerate from current authored state
    ↓
re-find/revalidate equivalent fix
    ↓
apply
```

Assess whether fix identity survives regeneration.

Likely complexity may be substantial.

---

# Candidate Stale-Action Model D — Ask User To Regenerate

UI keeps fix information visible but does not execute until fresh Preview exists.

Assess clarity versus implementation complexity.

---

# Required Stale-Action Matrix

Produce:

| Model                      | Uses Current Authored Inputs | Risk Of Applying Obsolete Fix | Complexity | User Clarity | Recommendation |
| -------------------------- | ---------------------------: | ----------------------------: | ---------: | -----------: | -------------- |
| Allow stale revision       |                              |                               |            |              |                |
| Disable/reject             |                              |                               |            |              |                |
| Auto-regenerate/revalidate |                              |                               |            |              |                |
| Ask user to regenerate     |                              |                               |            |              |                |

---

# Fix Identity Stability

If stale regeneration or command replay is considered, determine whether fix IDs are:

* stable across equivalent generation;
* generated dynamically;
* tied to friction IDs;
* tied to block IDs;
* timestamp-dependent.

Do not assume a fix can be located again after regeneration.

---

# Fix Parameter Completeness

For each fix type, determine whether the fix object contains enough information to replay itself against the same base schedule.

Possible required information:

```text
source block
target start
target end
date
candidate identity
friction identity
```

Record gaps.

---

# Provenance Requirements

Assess whether an accepted fix should preserve provenance such as:

```text
generated recommendation
    ↓
user accepted
    ↓
resulting plan change
```

This is likely relevant to the architecture's explainability requirement.

Do not implement provenance.

---

# Derived Versus Authored Boundary

Task 2.4 must explicitly state whether a revised Preview remains:

```text
derived state
```

or becomes some form of user-owned planning state.

If a revised Preview can contain user-selected placement decisions, classify whether calling the entire object merely “derived cache” remains accurate.

---

# Planning Authority Question

Explicitly answer:

> Is the generated/revised Preview merely a visualization of derivation, or is it currently functioning as an editable plan?

This question may be the architectural hinge.

Use current behavior and product copy.

---

# Future Planner / Summary Implications

Assess alignment with the future UX model where Planner includes:

* Review Schedule;
* Add Commitment;
* Edit Commitment;
* Resolve Friction.

A future “Resolve Friction” action may need to produce either:

* changed commitment intent;
* an explicit scheduling decision;
* or an accepted override.

Determine which current fix behavior best maps forward.

Do not redesign the UX.

---

# Durable-Data Implications

If the chosen authority model requires accepted fixes to survive reload/regeneration, determine whether they would become durable user data.

If so, note that future implementation must follow the durable-data ADR.

Do not add formats or migrations here.

---

# Profile / Backup Implications

If accepted fixes become authored or planning authority, determine conceptually whether profiles/backups should eventually capture them.

Do not change current formats.

This is a consequence analysis only.

---

# Execution / History Implications

Task 2.1 found no execution/history state.

Determine whether the chosen fix model actually requires:

* ordered command history;
* undo history;
* accepted recommendation log;
* none of the above.

Do not add history just because fixes exist.

---

# Recovery / Regeneration Implications

Assess whether chosen semantics preserve:

```text
authoritative state
    ↓
deterministic regeneration
```

or intentionally add another authoritative input class.

If another input class is required, identify it conceptually.

---

# Decision Standard

The preferred model should satisfy:

1. user action has one explicit authority meaning;
2. regenerated plans do not silently discard durable/user-owned intent;
3. disposable experiments are clearly disposable;
4. authored intent is not mutated indirectly without representable domain semantics;
5. stale Preview actions do not apply obsolete recommendations as though current;
6. future engine restructuring has a stable authority contract;
7. provenance/explainability remains possible;
8. durability obligations follow actual user-owned state;
9. complexity is not introduced without a real semantic need.

---

# Recommended Decision Bias

Do not force a current preview placement into existing authored fields merely to make it persistent.

A single occurrence move may not be equivalent to editing the underlying recurring commitment.

Likewise, do not call a user-accepted plan change purely “derived” if the user expects it to survive.

Where current domain concepts cannot represent the semantic distinction, prefer identifying the missing authority class over corrupting an existing one.

---

# Required Behavioral Invariants

The result should recommend later invariants based on the chosen model.

Potential examples:

* stale Preview cannot accept suggested fixes;
* accepted disposable experiment never mutates authored state;
* accepted durable fix must survive regeneration;
* user-owned placement override must have explicit representation;
* regeneration must preserve all authoritative planning inputs;
* suggested fixes remain recommendations until user acceptance.

Only adopt invariants justified by the decision.

---

# Required Later Test Contract

Do not add tests now.

Specify tests the eventual implementation must include.

At minimum consider:

* fix generation remains deterministic;
* fix acceptance authority is explicit;
* authored state changes only when contract says it should;
* regeneration behavior matches accepted-fix semantics;
* stale Preview behavior is protected;
* multiple sequential fixes behave deterministically;
* persistence/profile/backup semantics match chosen authority;
* no hidden command/history behavior exists.

---

# Architectural Alignment Assessment

Classify current behavior against:

* authoritative/derived separation;
* deterministic regeneration;
* provenance;
* persistence;
* stale-state safety;
* user expectation;
* future Planner semantics.

Use:

* Aligned
* Partially aligned
* Mismatched
* Unresolved

---

# Required Investigation Labels

Every significant conclusion must use:

* **Confirmed**
* **Inferred**
* **Not found**
* **Unresolved**
* **Recommended**
* **Deferred**

Do not conflate current behavior with recommended architecture.

---

# Explicit Non-Goals

Task 2.4 shall not:

* change suggested-fix code;
* change revision engine;
* disable fix buttons;
* change stale behavior;
* modify authored state;
* add plan overrides;
* add command history;
* add execution history;
* add undo;
* add provenance fields;
* change persistence;
* change profiles;
* change backups;
* change durable formats;
* change UI copy;
* redesign Planner;
* split state containers;
* refactor the engine;
* implement future commitments/goals/allocations;
* update governance documents before review.

---

# Dependencies

Requires completion and acceptance of:

* Task 2.1 — Establish the Authoritative and Derived State Boundary;
* Task 2.2 — Establish Seeded-Store Initialization Authority;
* Task 2.3 — Align Default Store Construction With the Adopted Seed Authority Contract.

Governed by:

* Architecture Charter;
* Complete Architecture Specification;
* `DECISIONS.md`;
* durable-data compatibility ADR;
* Phase 1 checkpoint;
* current Phase 2 findings.

---

# Evidence Standards

Priority:

1. production executable code;
2. direct tests;
3. current UI behavior;
4. type definitions;
5. architecture/governance documents;
6. historical task results.

Do not infer “temporary” from non-persistence alone.

Do not infer “permanent” from a button labeled Apply.

Trace actual lifecycle and user-facing semantics.

---

# Required Result Artifact Structure

The Task 2.4 result should contain:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Suggested-Fix Inventory
5. Suggested-Fix Generation Semantics
6. Suggested-Fix Object Authority
7. Production Caller Inventory
8. Preview Revision Path
9. Authored-State Effects
10. Derived-State Effects
11. Persistence Effects
12. Fix Category Split
13. Reproducibility Assessment
14. Multiple-Fix Sequence Semantics
15. Regeneration Behavior
16. Navigation / Session Behavior
17. Product-Copy Assessment
18. User Expectation Risk
19. Stale-Preview Behavior
20. Stale-Fix Correctness Risk
21. Fix Identity Stability
22. Fix Parameter Completeness
23. Candidate Authority Models
24. Authority Model Matrix
25. Adopted Suggested-Fix Authority Contract
26. Candidate Stale-Action Models
27. Stale-Action Matrix
28. Adopted Stale-Preview Contract
29. Derived Versus User-Owned Planning State
30. Planning Authority Assessment
31. Provenance Implications
32. Durable-Data Implications
33. Profile / Backup Implications
34. Execution / History Implications
35. Future Engine / Planner Implications
36. Required Behavioral Invariants
37. Required Later Test Contract
38. Architectural Alignment Assessment
39. Open Questions
40. Recommended Next Task
41. Deviations
42. Discoveries and Deferred Work
43. Validation
44. Final Completion Determination

---

# Expected Decision Outcomes

Several outcomes are possible.

## Outcome A — Preview Fixes Are Explicitly Disposable Experiments

Then current non-durability may remain appropriate, but UI and stale behavior must align with that meaning.

## Outcome B — Accepted Fixes Must Become Authored Changes

Then only fixes representable in authored semantics can be accepted directly; others require different representation.

## Outcome C — Accepted Fixes Become Explicit Planning Overrides

Then Phase 2 has discovered a missing user-owned planning-state class that later architecture must represent.

## Outcome D — Split Model

Some fixes may map to authored edits while occurrence-specific placement changes become planning overrides or disposable experiments.

## Outcome E — Decision Blocked By Missing Planning Semantics

If current architecture does not yet define whether a plan is editable/user-owned, the result may identify a governance decision that must precede implementation.

---

# Expected Follow-Up

Do not assume Task 2.5 is immediately an implementation.

Possible next tasks include:

### If stale behavior is independently wrong and authority is otherwise settled

> **Task 2.5 — Prevent Suggested-Fix Application Against Stale Preview State**

### If a planning override class is required

> **Task 2.5 — Establish User-Owned Plan Override Semantics**

### If current fixes are disposable experiments

> **Task 2.5 — Align Preview Revision UX and State Semantics With Disposable Experiment Authority**

### If authored-vs-plan semantics remain unresolved

> **Task 2.5 — Establish Editable Plan Authority Before Suggested-Fix Refactoring**

The investigation determines the next seam.

---

# Validation Requirements

This task is investigation only.

No executable or test file should change.

Run targeted tests where needed to confirm behavior.

At minimum consider:

```text
src/core/friction
src/core/engine/tests
src/state/tests/dayFrameStore.test.ts
src/ui/tests/DayFrameApp.test.tsx
src/ui/tests/PreviewScreen.test.tsx
```

Then, if repository execution discipline requires:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Confirm:

* Task 2.4 specification remained immutable;
* only the separate result artifact was created;
* no governance document changed;
* no engine/UI/persistence behavior changed.

---

# Completion Criteria

Task 2.4 is complete when:

* every current suggested-fix type/action is inventoried;
* generation semantics are established;
* fix object authority is classified;
* production callers are identified;
* revision effects are traced;
* authored-state impact is established;
* derived-state impact is established;
* persistence behavior is established;
* regeneration behavior is established;
* exact reproducibility is assessed;
* multiple-fix sequencing is assessed;
* product copy/user expectation risk is assessed;
* stale-preview fix behavior is established;
* candidate authority models are compared;
* one authority contract is adopted or a blocking governance gap is explicitly identified;
* stale-preview behavior receives an explicit contract;
* durability/profile/backup/history implications are assessed;
* required later invariants/tests are defined;
* no executable behavior changes;
* a dependency-correct next task is identified.

---

# Task Determination

Task 2.4 is an investigation into the authority semantics of user-accepted suggested fixes and revised Preview state.

It does not implement a new fix model.

Its purpose is to determine whether an accepted fix is temporary derived experimentation, authored intent, replayable planning input, or another state class, and to define stale-preview action semantics before later engine/state refactoring.

**The task is complete when DayFrame has an evidence-backed authority contract defining what an accepted suggested fix means, whether it changes authored intent or only derived preview state, how its effect can or cannot be regenerated, whether any replayable command/history is required, and how suggested-fix actions behave when the preview is stale before later engine or state-container refactoring is authorized.**
