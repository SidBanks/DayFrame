# Task 2.1 — Establish the Authoritative and Derived State Boundary

**Project:** DayFrame

**Phase:** Phase 2 — Authority and State Alignment

**Task ID:** 2.1

**Task Name:** Establish the Authoritative and Derived State Boundary

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation / Architectural State Audit

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning the investigation, verify that this task artifact is complete and record its integrity hash.

Record the investigation outcome in a separate result artifact:

`TASK_2.1_ESTABLISH_AUTHORITATIVE_AND_DERIVED_STATE_BOUNDARY_RESULT.md`

The result artifact should document:

* authoritative state inventory;
* derived state inventory;
* persisted versus non-persisted state;
* authored versus generated state;
* runtime-only state;
* UI/workflow-local state;
* invalidation ownership;
* replacement ownership;
* regeneration paths;
* replacement semantics;
* stale-state semantics;
* profile-load semantics;
* backup-import semantics;
* clear/reset semantics;
* Preview ownership;
* scheduling-output ownership;
* state-cloning boundaries;
* persistence boundaries;
* current ambiguities;
* architectural mismatches;
* test evidence;
* recommended Phase 2 follow-up sequence;
* final completion determination.

This task is investigation only.

Do not modify production code, tests, schemas, store APIs, UI behavior, persistence behavior, engine logic, or architecture documents.

If evidence is incomplete, classify the finding as unresolved rather than inferring intended behavior from type names or comments alone.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Phase 2 Context;
* Governing Evidence;
* Objective;
* State Inventory Requirements;
* Authority Classification;
* Derived-State Classification;
* Invalidation Audit;
* Replacement Audit;
* Preview Audit;
* Persistence Audit;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame has an evidence-backed map of every significant current state object and field classified by authority, derivation, persistence, invalidation, replacement, and regeneration ownership, with ambiguities and architectural mismatches identified before any Phase 2 state or engine refactor is authorized.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the artifact-integrity discrepancy for project review.

---

# Purpose

Establish the current executable state-authority model before Phase 2 changes implementation.

Phase 1 established that runtime truth, durability truth, retry intent, and workflow semantics are separate concerns.

Phase 2 now needs to establish the next boundary:

```text
authoritative domain state
        ≠
derived domain state
        ≠
workflow-local state
        ≠
durability infrastructure state
```

The future scheduling-engine redesign must not begin until the project knows which current state is primary truth and which state can be invalidated and regenerated.

---

# Phase 2 Context

Phase 2 — Authority and State Alignment begins from a validated Phase 1 checkpoint.

The expected future architecture will contain richer authored information and substantially more derived planning output.

A likely conceptual direction is:

```text
AUTHORED INTENT
    commitments
    priorities
    goals
    constraints
        ↓
DERIVATION / SCHEDULING
        ↓
DERIVED OUTPUT
    schedules
    allocations
    capacity
    recommendations
    friction
    projections
```

Task 2.1 must not assume that future model already exists.

Its job is to document **current executable truth**.

---

# Governing Evidence

Use the current repository as the primary source.

Relevant architectural principles include:

* Architecture Governs Implementation;
* Deterministic Planning;
* Information Provenance;
* Explicit Authority;
* Session-First Runtime Authority;
* Separation of Authoritative and Derived State;
* User Data Preservation;
* Forward Migration Safety;
* Epistemic Integrity.

Phase 1 established:

```text
DayFrameState
    = current runtime/domain truth

StoreDurabilityStatus
    = durability knowledge

StoreDesiredDurableCondition
    = retry-routing intent

DurabilitySemanticCategory
    = workflow interpretation
```

Task 2.1 should preserve those distinctions and investigate the internal structure of runtime/domain truth itself.

---

# Objective

Determine, from executable evidence:

1. every significant state object currently held by DayFrame;
2. which state is authored/primary;
3. which state is derived;
4. which state is UI/workflow-local;
5. which state is persisted;
6. which state is recomputable;
7. which state may become stale;
8. who marks it stale;
9. who regenerates it;
10. which operations mutate current authority;
11. which operations replace current authority;
12. which state survives replacement;
13. which state is cleared on replacement;
14. whether current behavior aligns with the architecture;
15. what the smallest Phase 2 implementation sequence should be.

---

# Required Production-Code Inventory

At minimum inspect:

* `DayFrameState`;
* initial state creation;
* store construction;
* all store mutation methods;
* authored Setup extraction;
* authored Setup commit;
* profile save/load/delete;
* backup create/import;
* Preview generation;
* Preview revision;
* Preview staleness;
* manual-event state;
* shift definitions;
* shift cycles;
* block templates;
* block recurrences;
* scheduling preferences;
* Preview range;
* generated schedule/Preview fields;
* friction points;
* suggested fixes;
* any execution/history-like state;
* UI screen/workflow state;
* durability infrastructure state.

Do not infer authority from naming alone.

---

# Required State Classification Scheme

Classify each significant state field/object using all applicable dimensions.

## Authority

One of:

* **Authoritative**
* **Derived**
* **Workflow-local**
* **Infrastructure**
* **Compatibility-only**
* **Unresolved**

## Persistence

One of:

* persisted;
* selectively persisted;
* not persisted;
* externalized only;
* unresolved.

## Regeneration

One of:

* user-authored/non-regenerable from current derived state;
* deterministic from authoritative inputs;
* reconstructible from external durable source;
* ephemeral;
* unresolved.

## Replacement Behavior

One of:

* preserved on authored replacement;
* replaced;
* cleared;
* recomputed;
* unresolved.

---

# Required State Inventory Table

Produce a table equivalent to:

| State Object / Field | Current Owner | Authority Class | Persisted? | Can Become Stale? | Invalidated By | Regenerated By | Replacement Behavior | Evidence |
| -------------------- | ------------- | --------------- | ---------: | ----------------: | -------------- | -------------- | -------------------- | -------- |

Include every significant field/object rather than only high-level categories.

---

# DayFrameState Audit

Inspect the full `DayFrameState` type and classify every top-level field.

Determine whether `DayFrameState` currently mixes:

```text
authored state
derived Preview state
durability state
workflow state
compatibility state
```

or whether those concerns are already separated.

Phase 1 established that durability is outside `DayFrameState`.

Task 2.1 should determine what other mixed authority remains.

---

# Authored State Audit

Identify the current complete authored state.

At minimum investigate whether the authoritative authored set includes:

* scheduling preferences;
* Preview range;
* shift definitions;
* shift cycles;
* block templates;
* block recurrences;
* manual calendar events.

Confirm rather than assume.

Determine whether any other current state is required to reconstruct authored intent.

---

# DayFrameAuthoredSetup Audit

Inspect `DayFrameAuthoredSetup`.

Determine:

* whether it represents the complete authoritative authored domain;
* whether any authoritative runtime fields are omitted;
* whether any derived fields are included;
* whether profiles/backups use it as the canonical replacement unit;
* whether it remains an accurate boundary for Phase 2.

Do not redesign the type.

---

# Preview State Audit

Inspect all Preview-related state.

At minimum identify:

* preview object/result;
* preview freshness/stale flag;
* generation inputs retained in Preview, if any;
* friction points;
* suggested fixes;
* scheduled blocks;
* unplaced candidates;
* generated work blocks;
* block candidates;
* manual-event representation inside Preview.

Determine which of these are:

```text
authoritative
derived
cached derived
workflow output
```

and who owns their lifecycle.

---

# Preview Authority Question

Explicitly answer:

> Is Preview current architectural authority, or is it a derived cache/snapshot that can always be discarded and regenerated from authored state?

Use executable behavior and tests.

Do not assume the architectural answer merely because it is named Preview.

---

# Stale-State Audit

Trace every path that marks Preview stale.

Determine:

* which store mutations mark it stale;
* whether all authored mutations do;
* whether replacement operations clear or stale it;
* whether any mutation fails to invalidate it;
* whether staleness means "known derived output no longer matches current authority";
* whether staleness is represented as explicit state, inferred state, or both.

---

# Invalidation Ownership

Produce an explicit map of:

| Authoritative Mutation / Replacement | Derived State Affected | Current Invalidator | Invalidates How? | Complete? | Evidence |
| ------------------------------------ | ---------------------- | ------------------- | ---------------- | --------- | -------- |

At minimum include:

* Setup commit;
* narrow authored setters;
* manual-event changes;
* profile load;
* backup import;
* clear local data;
* profile save/delete if they do or do not affect active state;
* Preview revision if relevant.

---

# Invalidation Correctness

Determine whether invalidation is:

* centralized;
* duplicated;
* distributed;
* implicit;
* partially missing.

Identify any current case where derived state can remain apparently current after its authoritative inputs change.

Do not repair it in Task 2.1.

---

# Preview Regeneration Audit

Trace:

```text
authored state
    ↓
generatePreview
    ↓
generateSchedulePreview
    ↓
derived Preview
```

Confirm which current runtime fields feed Preview generation.

Determine whether generation reads only authoritative authored state or also reads existing derived state.

---

# Preview Revision Audit

Inspect:

```text
reviseSchedulePreview
applySuggestedFixToPreview
```

or current equivalents.

Determine whether revision:

* modifies authoritative authored state;
* modifies only derived Preview;
* creates a temporary alternate derived result;
* persists anything;
* affects staleness.

This distinction is likely important for Phase 2.

---

# Suggested Fix Authority

Explicitly answer:

> Does accepting a suggested fix mutate authored intent, derived Preview, or both?

Trace production behavior.

Classify any mismatch between UI wording and actual authority.

---

# Manual Event Authority

Determine whether manual events are current authored authority.

Trace:

```text
manual-event create/edit/delete
    ↓
store state
    ↓
persistence
    ↓
Preview invalidation/regeneration
```

Determine whether manual events ever exist only inside Preview.

---

# Shift / Cycle Authority

Determine authority for:

* shift definitions;
* shift cycles;
* effective segment/preference resolution.

Separate authored objects from derived effective preferences and generated work blocks.

---

# Block Template / Recurrence Authority

Determine whether:

* block templates are authoritative authored definitions;
* recurrences are authoritative authored rules;
* block candidates are derived;
* scheduled blocks are derived;
* unplaced candidates are derived.

Confirm from current code.

---

# Scheduling Preferences Authority

Determine whether scheduling preferences are:

* authored;
* effective/derived;
* overridden per shift/cycle;
* stored directly or resolved dynamically.

Classify global and effective preferences separately.

---

# Preview Range Authority

Determine whether Preview range is:

* authored configuration;
* transient UI range;
* derived from cycles;
* persisted.

Trace how it participates in generation.

---

# Profile State Audit

Separate:

```text
savedProfiles collection
```

from:

```text
active authored state
```

Determine whether saved profiles are:

* authoritative current domain state;
* durable checkpoints;
* secondary authored artifacts;
* replacement sources;
* derived state.

Trace save/load/delete.

---

# Profile Load Replacement Semantics

Profile load is a core replacement path.

Explicitly determine:

* which active authored fields are replaced;
* which runtime fields are preserved;
* whether Preview is cleared or marked stale;
* whether manual events are replaced;
* whether saved profile collection is preserved;
* whether durability infrastructure is changed;
* whether workflow-local UI state is affected.

Produce a before/after ownership map.

---

# Backup Import Replacement Semantics

Perform the same analysis for backup import.

Determine:

* which authored state is replaced;
* which derived state is cleared;
* whether profiles are replaced or preserved;
* whether backup import affects durability only for active state;
* whether external backup remains independent.

---

# Clear Replacement Semantics

Clear/reset is another replacement path.

Determine:

* what runtime domain state becomes after clear;
* whether it is default authored state, empty authored state, or a special reset state;
* what Preview becomes;
* what saved profiles become;
* what durability intent becomes;
* what workflow state survives.

Separate runtime reset from durable removal.

---

# Store Initialization Semantics

Inspect store initialization.

Determine:

* which durable sources can seed authoritative state;
* normalization order;
* default fallback behavior;
* profile loading at startup if any;
* Preview initialization;
* durability initialization;
* whether startup performs replacement or construction.

---

# Seeded Store Purpose

Revisit the earlier Phase 1 finding concerning seeded-store purpose.

Determine from current production/test usage:

* whether seed data is product/demo behavior;
* test convenience;
* development-only behavior;
* fallback authoritative state;
* unresolved.

Do not remove it.

---

# UI / Workflow-Local State Audit

Inventory major UI-local states that may look like domain state but are not.

Examples may include:

* current screen;
* active editor;
* selected date;
* draft Setup state;
* confirmation state;
* immediate durability feedback;
* import/export messages;
* profile name draft.

Classify these explicitly as workflow-local where supported.

---

# Draft Versus Committed Authority

Setup likely contains a draft before Save Setup.

Determine:

```text
Setup draft
    vs
store-authored committed state
```

Which is authoritative for scheduling?

Which is authoritative for UI editing before save?

What happens when navigation occurs without save?

This is likely important for Phase 2.

---

# Replacement Versus Mutation

Define from current evidence:

## Mutation

Changes some portion of current authoritative state while preserving the rest.

## Replacement

Selects a complete alternate authored representation and replaces the current
authoritative authored set.

Investigate which current operations are truly replacement operations.

Likely candidates:

* profile load;
* backup import;
* clear/reset.

Confirm.

---

# Replacement Matrix

Produce:

| Operation | Mutation or Replacement? | Replaces Authored State? | Replaces Derived State? | Preserves Profiles? | Preserves Preview? | Persists Result? | Evidence |
| --------- | ------------------------ | -----------------------: | ----------------------: | ------------------: | -----------------: | ---------------: | -------- |

Include all major state-changing workflows.

---

# Clone / Snapshot Boundaries

Inspect clone helpers and snapshot creation.

Determine:

* which state is cloned for profiles;
* which state is cloned for backups;
* which state is cloned for mutation results;
* whether derived state is accidentally included;
* whether clone helpers define an authority boundary implicitly.

---

# Persistence Boundary Audit

Determine exactly what current local active persistence writes.

Classify persisted fields as:

* authoritative authored state;
* derived state;
* infrastructure state;
* compatibility metadata.

If any derived Preview data is persisted, flag it.

If Preview is intentionally not persisted, record that as evidence for derived classification.

---

# Backup Boundary Audit

Determine exactly what backup export includes.

Classify whether it contains:

* active authored state only;
* profiles;
* derived Preview;
* durability metadata;
* workflow state.

Do not assume.

---

# Profile Boundary Audit

Determine exactly what profile data contains.

Assess whether profiles capture:

* complete authored state;
* only a subset;
* any derived state;
* manual events;
* Preview range.

This is important to replacement semantics.

---

# Execution / History State Audit

Phase 1 audits previously found no durable execution history.

Reconfirm current state.

Determine whether any current state now represents:

* completion history;
* execution records;
* immutable historical observations;
* progress history.

If none exists, classify as not found rather than designing it.

---

# Derived State Classification

At minimum investigate whether the following are derived:

* Preview;
* generated work blocks;
* block candidates;
* scheduled blocks;
* unplaced candidates;
* friction points;
* suggested fixes;
* effective scheduling preferences;
* range warnings;
* capacity-like calculations if present.

For each, identify its authoritative inputs and producer.

---

# Derived-State Dependency Map

Produce a map equivalent to:

```text
AUTHORITATIVE INPUTS
    ↓
DERIVED OBJECT
    ↓
PRODUCER
    ↓
INVALIDATION CONDITION
```

This may be presented as a table or diagram.

---

# Architectural Alignment Assessment

For each major state boundary, classify:

* **Aligned**
* **Partially aligned**
* **Misaligned**
* **Unresolved**

Assess against the published architecture without redesigning implementation.

---

# Required Source-of-Truth Assessment

Produce an explicit section:

## Source of Truth — Authored State

What is the current authoritative authored representation?

## Source of Truth — Derived Schedule

What is authoritative for current generated schedule display?

## Source of Truth — Durability

Already established by Phase 1; confirm interaction only.

## Source of Truth — Profiles

What do profiles own?

## Source of Truth — Workflow Drafts

What is authoritative before commit?

---

# Required Behavioral Invariants

Identify current invariants supported by tests.

Examples may include:

* authored edits mark Preview stale;
* generating Preview derives from current store-authored state;
* profile load replaces active authored state;
* backup import replaces active authored state;
* clear resets runtime;
* Preview can be regenerated deterministically;
* saved profiles do not become active until loaded.

Only include invariants directly supported by evidence.

---

# Partial / Disconnected Paths

Identify:

* fields written but not read;
* derived state retained after replacement unexpectedly;
* duplicated invalidation paths;
* alternate authority paths;
* stale compatibility seams;
* UI-local state accidentally treated as domain authority;
* domain state accidentally stored only in UI.

Do not fix them.

---

# Test Coverage Assessment

Identify tests covering:

* authored mutation;
* stale invalidation;
* generation;
* replacement;
* profile load;
* backup import;
* clear/reset;
* manual-event invalidation;
* Preview regeneration;
* draft/commit boundaries.

Classify important authority rules that currently lack direct tests.

---

# Required Investigation Labels

Every significant finding must be labeled:

* **Confirmed**
* **Inferred**
* **Not found**
* **Unresolved**
* **Recommended**

Do not present inferred architectural intent as confirmed implementation behavior.

---

# Recommended Follow-Up Sequencing

Task 2.1 must not simply end with “refactor state.”

It should recommend a dependency-correct sequence based on findings.

Possible categories may include:

1. authority type cleanup;
2. replacement-operation alignment;
3. invalidation centralization;
4. Preview derived-state isolation;
5. draft/committed-state separation;
6. engine input boundary cleanup.

Do not assume those exact tasks are required.

The investigation decides.

---

# Explicit Non-Goals

Task 2.1 shall not:

* modify production code;
* modify tests;
* modify state types;
* change store APIs;
* change Preview behavior;
* change scheduling behavior;
* change invalidation behavior;
* change profile behavior;
* change backup behavior;
* change clear/reset behavior;
* change persistence;
* change durable schemas;
* add new domain objects;
* implement Commitments;
* implement Goals;
* implement Priorities;
* implement Allocations;
* implement new engines;
* redesign Planner or Summary;
* migrate durable formats;
* remove compatibility readers;
* implement execution history;
* resolve UX presentation issues;
* update architecture documents before project review.

---

# Dependencies

Requires completion and publication of:

**Phase 1 — Architectural Foundation Alignment**

through Task 1.39 and its checkpoint.

Governed by:

* Architecture Charter;
* Complete Architecture Specification;
* DECISIONS;
* durable-data compatibility ADR;
* current Phase 1 checkpoint.

---

# Evidence Standards

Primary evidence priority:

1. production executable code;
2. direct tests;
3. current store/persistence behavior;
4. current UI production callers;
5. current governance documents;
6. historical audits/task results.

Comments and names are supporting evidence only.

A field called `preview` is not automatically derived.

A field called `savedProfiles` is not automatically authoritative.

Trace behavior.

---

# Required Code Inspection

At minimum inspect current files/symbols related to:

```text
DayFrameState
createInitialDayFrameState
createDayFrameStore
getAuthoredSetup
cloneDayFrameAuthoredSetup
commitAuthoredSetup
generatePreview
generateSchedulePreview
reviseSchedulePreview
applySuggestedFixToPreview
setManualEvents
saveProfile
loadProfile
deleteProfile
createDayFrameBackup
importBackup
clearLocalData
getDurabilityStatus
subscribeDurability
```

Also inspect all directly relevant tests.

---

# Validation Requirements

This is investigation only.

No executable file should change.

Run targeted tests only where needed to confirm behavior.

At minimum review or run suites covering:

```text
dayFrameStore
generateSchedulePreview
DayFrameApp
PreviewScreen
```

Run repository-standard validation if required by execution discipline:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Confirm:

* Task 2.1 specification remained immutable;
* no executable file changed;
* result artifact exists separately;
* architecture/governance docs remain unchanged pending review.

---

# Documentation Rules

During Task 2.1:

## Create

`TASK_2.1_ESTABLISH_AUTHORITATIVE_AND_DERIVED_STATE_BOUNDARY_RESULT.md`

## Preserve

* Task 2.1 specification;
* Phase 1 task/result history;
* Phase 1 checkpoint;
* current architecture/governance documents;
* ADRs;
* historical audits.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* Phase 1 checkpoint.

Those require project review after Task 2.1.

Do not create a task-specific checkpoint unless explicitly authorized.

---

# Required Result Artifact Structure

The Task 2.1 result should contain:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Complete State Inventory
5. DayFrameState Classification
6. Authoritative Authored State
7. DayFrameAuthoredSetup Assessment
8. Workflow-Local State
9. Draft Versus Committed Authority
10. Preview State Classification
11. Preview Generation Inputs
12. Preview Invalidation Ownership
13. Preview Revision Authority
14. Suggested-Fix Authority
15. Manual-Event Authority
16. Shift/Cycle Authority
17. Template/Recurrence Authority
18. Scheduling Preference Authority
19. Preview Range Authority
20. Profiles Authority
21. Profile Load Replacement Semantics
22. Backup Import Replacement Semantics
23. Clear/Reset Replacement Semantics
24. Store Initialization Semantics
25. Seeded-Store Purpose
26. Persistence Boundary
27. Profile Boundary
28. Backup Boundary
29. Clone/Snapshot Boundaries
30. Derived-State Inventory
31. Derived-State Dependency Map
32. Invalidation Matrix
33. Replacement Matrix
34. Source-of-Truth Assessment
35. Behavioral Invariants
36. Partial / Disconnected Paths
37. Execution / History Assessment
38. Test Coverage Assessment
39. Architectural Alignment Assessment
40. Open Questions
41. Recommended Phase 2 Follow-Up Sequence
42. Deviations
43. Discoveries and Deferred Work
44. Validation
45. Final Completion Determination

---

# Expected Architectural Result

Before Task 2.1:

```text
DayFrame has:
    authored state
    Preview state
    profile state
    workflow-local state
    durability infrastructure

but
their authority relationships are only partially explicit
```

After Task 2.1:

```text
EVERY SIGNIFICANT STATE OBJECT
    ↓
classified as:
    authoritative
    derived
    workflow-local
    infrastructure
    compatibility-only
    unresolved

and mapped to:
    owner
    persistence
    invalidator
    regenerator
    replacement semantics
```

Only after that map exists should Phase 2 authorize structural changes.

---

# Completion Criteria

Task 2.1 is complete when:

* every significant top-level runtime state field is classified;
* the complete current authored authority is identified;
* derived Preview/scheduling state is identified;
* workflow-local state is separated from domain authority;
* persistence boundaries are documented;
* profile and backup replacement semantics are established;
* clear/reset semantics are established;
* invalidation ownership is mapped;
* regeneration ownership is mapped;
* Preview revision authority is established;
* suggested-fix authority is established;
* manual-event authority is established;
* draft versus committed authority is established;
* source-of-truth boundaries are explicit;
* architectural mismatches are identified;
* coverage gaps are identified;
* no executable behavior changes;
* a dependency-correct Phase 2 follow-up sequence is recommended.

---

# Task Determination

Task 2.1 is the opening investigation for Phase 2 — Authority and State Alignment.

It does not redesign DayFrame state.

Its purpose is to establish the current executable authority model before the project changes authored-state structure, derived-state lifecycle, invalidation, replacement, or scheduling-engine boundaries.

**The task is complete when DayFrame has an evidence-backed map of every significant current state object and field classified by authority, derivation, persistence, invalidation, replacement, and regeneration ownership, with ambiguities and architectural mismatches identified before any Phase 2 state or engine refactor is authorized.**
