# Implementation Task 1.4 — Remove Obsolete PreviewScreenContainer Path

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.4

**Task Name:** Remove Obsolete PreviewScreenContainer Path

**Version:** 1.0.0

**Status:** Ready

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, or overwrite this task document during execution.

Record the execution outcome in a separate result artifact:

`TASK_1.4_REMOVE_OBSOLETE_PREVIEW_SCREEN_CONTAINER_RESULT.md`

The result artifact should document:

- implementation completed;
- files changed or removed;
- documentation reviewed or updated;
- behavioral outcomes;
- validation performed and results;
- architectural result;
- deviations from the authorized task, if any;
- discoveries and deferred work;
- final completion determination.

If implementation reveals that the authorized removal cannot be completed safely
as written, do not expand the task or rewrite this specification.

Stop the affected work and record the discrepancy in the result artifact for
project review.

---

# Purpose

Remove `PreviewScreenContainer` and its dedicated test after Task 1.3 established
that the component is an obsolete implementation structure.

The removal eliminates an unreachable historical Preview adapter without replacing
it, changing supported Preview behavior, or modifying the current
`DayFrameApp` → `PreviewScreen` production path.

This task converts the architectural determination established by Task 1.3 into a
small, validated structural simplification.

---

# Architectural Context

Task 1.3 established from repository-wide executable evidence that
`PreviewScreenContainer`:

- is not reachable from the production application;
- is not reachable through an alternate application entry point;
- is not exported through a package or supported API;
- has no demonstrated compatibility responsibility;
- has no unique supported architectural behavior;
- is instantiated only by its dedicated automated tests;
- represents an earlier store-connected Preview adapter superseded by the current
  `DayFrameApp` → `PreviewScreen` workflow.

Task 1.3 therefore classified it as:

**Obsolete Implementation Structure**

Task 1.3 did not authorize deletion.

Task 1.4 performs that deletion within the bounded removal seam established by the
investigation.

---

# Objective

Remove the obsolete `PreviewScreenContainer` implementation path and its
test-only support while preserving the complete supported Preview workflow.

After completion:

> DayFrame shall have one supported application-level Preview coordination path:
> `DayFrameApp` → `PreviewScreen`.

No replacement implementation is required.

---

# Architectural Alignment

This task directly supports Phase 1 priorities to:

- eliminate obsolete architectural structures;
- reduce unnecessary implementation pathways;
- reduce architectural duplication;
- simplify implementation reasoning;
- clarify Preview ownership;
- strengthen architectural consistency.

It reinforces the Alignment Strategy principles:

- Architecture Governs Implementation;
- Resolve Root Causes Before Symptoms;
- Reduce Aggregate Complexity;
- Local Simplicity, Global Coherence;
- Evidence Before Preference;
- Architectural Traceability.

The task removes a structure only after executable evidence has established that
the structure no longer participates in supported behavior.

---

# Scope

## Production Removal

Delete:

- `code/src/ui/PreviewScreenContainer.tsx`

Remove any types or implementation details whose only executable owner is that
module and which disappear naturally with its deletion.

Do not move those responsibilities elsewhere unless required to preserve existing
supported production behavior.

---

## Test Removal

Delete:

- `code/src/ui/tests/PreviewScreenContainer.test.tsx`

These tests validate the obsolete adapter itself rather than the supported
production path.

Do not mechanically reproduce these tests against `DayFrameApp`.

Existing `DayFrameApp` and `PreviewScreen` coverage should remain authoritative for
supported Preview behavior.

If removal reveals a supported production behavior that lacks coverage, stop and
record the discrepancy rather than silently expanding this task.

---

## Documentation Reconciliation

Review active documentation that presents `PreviewScreenContainer` as part of the
current implementation.

Task 1.3 specifically identified:

- `docs/hydration/Phase_1_1_6_Hydration.md`

Determine whether each reference is:

- historical evidence that should remain unchanged;
- active/current-state documentation that should be corrected;
- archival material that should retain historical wording.

Preserve historical audit evidence.

Do not rewrite historical records merely because the implementation later changed.

Update only documentation whose responsibility is to describe the current
implementation and which would otherwise become factually stale after removal.

---

# Explicit Non-Goals

This task shall not:

- modify `PreviewScreen` behavior;
- redesign `DayFrameApp`;
- change the supported Preview workflow;
- introduce a replacement container;
- move the obsolete container's direct-action behavior into `DayFrameApp`;
- change `changeFixedTime` handling;
- change suggested-fix semantics;
- change Preview generation;
- change Preview revision;
- change store subscription architecture;
- adopt `useSyncExternalStore` in the primary application;
- change scheduling behavior;
- change date handling;
- change persistence;
- change navigation;
- change focus behavior;
- change feedback behavior;
- reorganize unrelated Preview files;
- address other Task 1.1 deferred findings.

In particular, the obsolete container's behavior of directly dispatching
`changeFixedTime` must **not** replace the supported `DayFrameApp` behavior that
navigates the user to Setup and focuses the relevant fixed-time field.

---

# Dependencies

Requires completion and project acceptance of:

- Task 1.3 — Resolve PreviewScreenContainer Architectural Status.

Task 1.3's classification of the component as an Obsolete Implementation Structure
is the authority for this removal.

---

# Implementation Requirements

The implementation should:

1. delete `PreviewScreenContainer.tsx`;
2. delete its dedicated test;
3. remove only references made invalid by those deletions;
4. preserve the supported `DayFrameApp` → `PreviewScreen` path unchanged;
5. preserve current fixed-time recommendation behavior;
6. preserve current ordinary suggested-fix behavior;
7. reconcile current-state documentation where required;
8. preserve historical audit and archival evidence according to documentation
   governance.

No replacement abstraction should be introduced.

---

# Behavioral Invariants

The following must remain unchanged.

## Production Preview Reachability

Preview remains reachable through the current supported application workflow.

---

## Preview Rendering

`PreviewScreen` continues to receive the same supported application inputs.

---

## Suggested Fixes

Ordinary proposal fixes continue through the current supported revision path.

---

## Fixed-Time Review

Resolvable `changeFixedTime` recommendations continue to navigate to Setup and
focus the relevant fixed-time field.

The obsolete container's direct-dispatch behavior must not be restored.

---

## Scheduling

Preview generation and scheduling outputs remain unchanged.

---

## State

Authored state, derived Preview state, profiles, backups, persistence, and manual
events remain unchanged.

---

# Validation Requirements

## Reference Validation

After removal, confirm repository-wide that:

- no executable import of `PreviewScreenContainer` remains;
- no executable reference to `PreviewScreenStore` remains if that type was local
  exclusively to the deleted module;
- no broken export or module reference remains.

---

## Targeted Validation

Run the supported Preview and application suites, including at minimum:

- `PreviewScreen`;
- `DayFrameApp`.

Confirm coverage still establishes:

- Preview rendering;
- Preview response to current application state;
- ordinary suggested-fix handling;
- fixed-time Setup navigation/focus behavior;
- Preview staleness and regeneration where currently covered.

---

## Full Validation

Run the repository's standard validation sequence:

- `npm run lint`
- `npm run typecheck`
- `npm test -- --run`
- `npm run build`

The expected test count may decrease because the four obsolete
`PreviewScreenContainer` tests are intentionally removed.

A reduced test count caused solely by deletion of those obsolete tests is not a
regression.

---

# Architectural Validation

Confirm that the implementation changes the Preview structure from:

```text
Supported path:

DayFrameApp
    ↓
PreviewScreen


Obsolete isolated path:

PreviewScreenContainer
    ↓
PreviewScreen
```

to:

```text
DayFrameApp
    ↓
PreviewScreen
```

There should be no replacement path introduced by this task.

The resulting implementation should contain fewer Preview coordination structures
while preserving the complete supported behavior.

---

# Documentation Updates

At completion:

- preserve this Task 1.4 specification unchanged;
- create
  `TASK_1.4_REMOVE_OBSOLETE_PREVIEW_SCREEN_CONTAINER_RESULT.md`;
- reconcile active/current-state references identified during implementation;
- preserve historical audit evidence unless documentation governance requires an
  annotation;
- update `CURRENT_STATE.md` after project review;
- include Task 1.4 in the next Session Checkpoint;
- do not update `CHANGELOG.md` solely for this removal unless it becomes part of a
  larger Phase 1 milestone.

---

# Completion Criteria

Task 1.4 is complete when:

- `PreviewScreenContainer.tsx` has been removed;
- its dedicated obsolete tests have been removed;
- no supported executable caller or export has been broken;
- no replacement adapter has been introduced;
- the supported `DayFrameApp` → `PreviewScreen` path remains behaviorally intact;
- fixed-time review retains its current Setup-navigation behavior;
- ordinary suggested-fix behavior remains intact;
- current-state documentation no longer incorrectly presents the removed container
  as active architecture;
- historical evidence has been preserved appropriately;
- lint passes;
- type checking passes;
- remaining automated tests pass;
- production build passes;
- the result artifact records the completed removal and any discoveries.

---

# Risks

Primary risks include:

- treating historical documentation as current documentation and rewriting evidence;
- accidentally removing a colocated type used elsewhere;
- reproducing obsolete tests unnecessarily against the current application;
- transferring obsolete direct-action behavior into the supported workflow;
- expanding a bounded deletion into a Preview architecture refactor.

These risks should be controlled by keeping the implementation deletion-oriented
and validating the existing supported path after removal.

---

# Deferred Work

This task does not resolve:

- whether `DayFrameApp` should eventually use `useSyncExternalStore`;
- manual-event command ownership;
- feedback aggregation;
- focus/continuity ownership;
- duplicated date conversions;
- legacy singular `shiftCycle` removal;
- persistence-failure authority;
- seeded-store purpose.

These remain separate Phase 1 findings and should be activated only through
dependency-correct task selection.

---

# Expected Outcome

After Task 1.4, DayFrame contains one fewer obsolete architectural path.

The supported Preview architecture becomes easier to describe:

```text
Application coordination
        ↓
DayFrameApp
        ↓
PreviewScreen
```

No capability is added.

No supported behavior is removed.

The implementation simply stops carrying an executable representation of an
earlier Preview coordination model that no longer belongs to the supported
application.

---

# Task Determination

Task 1.4 converts an evidence-backed obsolescence determination into a bounded
structural correction.

It is complete when `PreviewScreenContainer` and its isolated test path have been
removed, the supported Preview workflow remains validated, and no replacement
architecture has been introduced.