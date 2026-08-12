# Implementation Task

**Project:** DayFrame

**Phase:** Phase 1 — Architectural Foundation Alignment

**Task ID:** 1.2

**Task Name:** Establish Atomic Authored Setup Commit

**Version:** 1.0.0

**Status:** Ready

---

# Purpose

Replace the current UI-coordinated multi-step Setup save with one store-owned
authored Setup commit.

The task establishes a single authoritative transition for saving the complete
authored Setup payload while preserving all existing authored values, Preview
staleness behavior, persistence format, scheduling inputs, timestamps, navigation,
focus, feedback, and user-visible behavior.

This task is the first production implementation change in Phase 1.

---

# Architectural Context

Task 1.1 established that authored Setup values are authoritative within
`dayFrameStore`, while the transaction that commits those values is currently
coordinated by `DayFrameApp.saveCurrentSetup`.

One conceptual Setup save is currently implemented through six sequential store
mutations.

Each mutation independently:

- modifies authored state;
- marks an existing Preview stale;
- persists authored state;
- publishes a subscriber snapshot.

This creates distributed ownership of one authored transaction between
`DayFrameApp` and `dayFrameStore`.

Phase 1 requires foundational ownership to become explicit before higher-level
state, lifecycle, interaction, or UX alignment proceeds.

This task moves ownership of the complete authored Setup commit into the store
without changing the meaning of the transaction.

---

# Objective

Introduce one store operation that commits the complete authored Setup payload as
a single authoritative state transition, then route `DayFrameApp.saveCurrentSetup`
through that operation.

After completion:

> One user-level Setup save shall correspond to one complete store-level authored
> Setup transition.

---

# Architectural Alignment

This task supports:

## Phase 1 — Architectural Foundation Alignment

Specifically:

- clarify ownership boundaries;
- consolidate shared architectural responsibilities;
- reduce unnecessary coupling;
- simplify implementation pathways;
- strengthen architectural consistency.

## Alignment Strategy

This task reinforces:

- Architecture Governs Implementation;
- Preserve Deterministic State Ownership;
- Reduce Aggregate Coordination;
- Resolve Root Causes Before Symptoms;
- Preserve Context;
- Local Simplicity, Global Coherence;
- Determinism Over Cleverness.

## Task 1.1 Evidence

Task 1.1 determined that:

- authored values are coherently owned by `dayFrameStore`;
- complete authored Setup commit ownership is distributed;
- `DayFrameApp.saveCurrentSetup` performs six sequential mutations;
- each mutation independently persists, notifies, and stales Preview;
- an aggregate store commit is the smallest dependency-correct production seam.

---

# Scope

## Included

Implement a single store-level authored Setup commit covering the same authored
payload currently committed by `DayFrameApp.saveCurrentSetup`.

The aggregate operation must commit the existing authored Setup fields used by
that workflow, including the currently resolved forms of:

- schedule preferences;
- Preview range;
- shift definitions;
- shift cycles;
- block templates;
- block recurrences;

and any compatibility representation currently written as part of those existing
state transitions.

Route `DayFrameApp.saveCurrentSetup` through the new aggregate operation.

Update affected automated tests to verify the new transaction semantics.

---

# Explicit Non-Goals

This task shall not:

- change any authored Setup value or transformation;
- change Setup validation;
- change generation guardrails;
- change Preview generation;
- change Preview revision;
- change scheduling algorithms;
- change date or timezone behavior;
- change manual calendar-event behavior;
- change profile behavior;
- change backup/import/export behavior;
- change persistence keys;
- change persisted schema;
- remove the legacy singular `shiftCycle` compatibility field;
- change navigation;
- change focus behavior;
- change feedback language;
- redesign `DayFrameApp`;
- introduce Architectural Services;
- introduce Architectural Engines;
- reorganize files merely to reflect architectural terminology;
- modify `PreviewScreenContainer`.

Any adjacent opportunity discovered during implementation should be recorded for
future tasks rather than absorbed into Task 1.2.

---

# Dependencies

Requires completion of:

- Task 1.1 — Establish Foundational Ownership Baseline.

No other Phase 1 production task is required.

---

# Affected Systems

Expected primary implementation areas:

- `dayFrameStore`
- `DayFrameApp`
- associated store tests
- associated application workflow tests

Other files should change only when required to preserve existing contracts or test
coverage.

---

# Implementation Requirements

Introduce one store operation representing the complete authored Setup commit.

The exact name may follow existing repository conventions, but the operation should
represent the architectural responsibility rather than individual fields.

Conceptually:

```text
commitAuthoredSetup(authoredSetupPayload)
```

or equivalent.

The implementation must:

1. Receive the same fully resolved/transformed values currently supplied by
   `DayFrameApp.saveCurrentSetup`.
2. Clone incoming collections using the existing established clone mechanisms.
3. Update all affected authored fields before subscribers can observe the new
   snapshot.
4. Preserve all unaffected store state.
5. Mark an existing Preview stale exactly once.
6. Persist authored state exactly once.
7. Notify subscribers exactly once.
8. Preserve the existing persisted schema.
9. Preserve the compatibility `shiftCycle` representation currently required by
   persistence/migration behavior.
10. Preserve existing scheduling inputs exactly.

The task should remove the six-setter transaction from
`DayFrameApp.saveCurrentSetup`.

Existing narrow setters may remain when they continue to serve legitimate
independent mutation paths elsewhere.

This task does **not** require eliminating all field-level setters.

---

# Behavioral Invariants

The following behavior must remain unchanged.

## Authored Authority

The final saved authored state must be identical to the state produced by the
previous six-setter sequence for equivalent input.

---

## Draft Semantics

Unsaved Setup draft behavior must remain unchanged.

The store becomes authoritative only when Save or the existing Generate workflow
commits the draft.

---

## Preview Staleness

If a Preview exists, saving changed authored Setup must leave it stale.

The transition should produce the same final stale state as before, but through one
authoritative mutation.

---

## Persistence

The persisted authored representation must remain schema-compatible with the
existing implementation.

No migration should be required.

---

## Scheduling

Equivalent saved authored Setup must continue producing equivalent scheduling
inputs and equivalent deterministic Preview results.

---

## Profiles and Backups

Existing profile and backup representations must remain compatible.

---

## UI Behavior

Save, Generate, dirty-state handling, focus, navigation, feedback, and visible Setup
behavior must remain functionally equivalent unless an existing test proves that an
intermediate store notification was intentionally user-visible.

---

# Validation Requirements

## Store-Level Validation

Add or update tests confirming that the aggregate authored Setup commit:

- updates the complete intended authored payload;
- clones mutable input collections appropriately;
- preserves unrelated state;
- marks an existing Preview stale;
- does not create a Preview when none exists;
- persists the same authored representation;
- retains compatibility behavior;
- notifies subscribers once for the complete transaction.

Where practical, explicitly assert the single-notification behavior because removal
of intermediate observable snapshots is a primary architectural outcome of this
task.

---

## Application-Level Validation

Update or add tests confirming that `DayFrameApp.saveCurrentSetup`:

- uses the aggregate authored commit;
- preserves unified Save behavior;
- preserves dirty-draft behavior;
- preserves Preview staleness;
- preserves preferences and range behavior;
- preserves shift/cycle/template/recurrence values;
- preserves Generate behavior after Setup commit.

Tests should validate behavior rather than implementation-call counts unless call
count directly represents the architectural contract being established.

---

## Regression Validation

Run the existing relevant suites covering:

- `dayFrameStore`;
- `DayFrameApp`;
- Preview generation;
- profiles;
- backup/import;
- persisted state normalization;
- Preview staleness and regeneration.

Then run the repository's standard full validation sequence.

---

## Architectural Validation

Confirm that after implementation:

```text
Before

DayFrameApp
    ├── setPreferences
    ├── setPreviewRange
    ├── setShiftDefinitions
    ├── setShiftCycles
    ├── setBlockTemplates
    └── setBlockRecurrences

Each operation:
    mutate → stale → persist → notify


After

DayFrameApp
    │
    └── commitAuthoredSetup
             │
             └── complete authored transition
                    → stale once
                    → persist once
                    → notify once
```

The resulting ownership should be easier to explain than the previous model.

---

# Documentation Updates

At task completion:

- update the Task 1.2 implementation record;
- update `CURRENT_STATE.md`;
- create a Session Checkpoint;
- update `CHANGELOG.md` only if this individual task represents a sufficiently
  significant project milestone;
- record any discovered future work without absorbing it into this task.

The Architecture Specification should not require modification unless implementation
reveals an actual architectural ambiguity.

---

# Completion Criteria

Task 1.2 is complete when:

- one store operation owns the complete authored Setup commit;
- `DayFrameApp.saveCurrentSetup` no longer coordinates six independent authored
  store mutations;
- all authored values remain behaviorally equivalent;
- existing Preview staleness semantics are preserved;
- Preview is staled exactly once per aggregate Setup commit;
- authored persistence occurs exactly once per aggregate Setup commit;
- subscribers observe only the completed authored Setup snapshot;
- scheduling inputs and outputs remain unchanged;
- profiles and backups remain compatible;
- required automated validation passes;
- documentation records the completed architectural improvement;
- the repository remains coherent and ready for Task 1.3.

---

# Risks

Primary risks include:

- accidentally changing clone semantics;
- omitting an authored field from the aggregate payload;
- altering compatibility `shiftCycle` serialization;
- changing Generate behavior that currently relies upon Setup commit ordering;
- unintentionally changing subscriber-driven draft reconstruction;
- weakening Preview invalidation.

These risks should be controlled through targeted behavioral tests before broader
refactoring proceeds.

---

# Deferred Discoveries

The following Task 1.1 findings remain explicitly outside Task 1.2:

- manual-event command ownership;
- feedback aggregation;
- focus/continuity ownership;
- duplicated date conversion helpers;
- legacy `shiftCycle` removal;
- `PreviewScreenContainer` status;
- persistence failure authority;
- seeded-store purpose.

These should be considered only after the aggregate Setup commit has been
implemented and validated.

---

# Expected Outcome

After Task 1.2, authored Setup values remain exactly as expressive as before, but
the meaning of a Setup save becomes architecturally explicit:

> Saving Setup is one authoritative domain transition.

This removes one instance of aggregate coordination from `DayFrameApp`, reduces
intermediate state exposure, and establishes a cleaner state boundary for subsequent
Phase 1 work without changing scheduling behavior.

---

# Task Determination

Task 1.2 establishes the first production architectural alignment of Phase 1.

It does not expand DayFrame capability.

It makes an existing conceptual operation correspond to one explicit implementation
operation.

The task is complete when a complete authored Setup save has one clearly defined
store-level owner and the resulting behavior remains otherwise equivalent to the
pre-task implementation.