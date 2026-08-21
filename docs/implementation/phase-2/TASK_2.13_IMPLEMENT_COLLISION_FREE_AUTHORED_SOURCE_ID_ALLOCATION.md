# Task 2.13 — Implement Collision-Free Authored Source-ID Allocation

**Project:** DayFrame
**Phase:** Phase 2 — Authority and State Alignment
**Task ID:** 2.13
**Execution Type:** Bounded Implementation
**Status:** Ready for execution

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before performing implementation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution results must be recorded in a separate result artifact:

`TASK_2.13_IMPLEMENT_COLLISION_FREE_AUTHORED_SOURCE_ID_ALLOCATION_RESULT.md`

Implementation must remain within the explicitly authorized scope.

Do not expand this task into store-level duplicate rejection, historical-ingress recovery, source-incarnation design, durable occurrence references, or PlanDecision behavior.

If collision-free allocation cannot be implemented without one of those broader changes, stop the affected work and record the dependency rather than broadening scope.

---

# 2. Purpose

Task 2.12 established that current DayFrame authored-source ID allocation can produce simultaneous active collisions after deletion because several creation paths use collection-length-derived identifiers.

Examples include patterns equivalent to:

```
shift_${length + 1}
cycle_${length + 1}
segment_${length + 1}
sequence_day_${length + 1}
template_${length + 1}
recurrence-derived numeric suffixes
```

Task 2.12 adopted the following architectural contract:

* newly authored source IDs must be unique within their current authoritative snapshot scope;
* allocation should be owned by a shared pure authored-source allocator;
* creating workflows invoke the allocator;
* readable prefixes may be preserved;
* collision-free allocation does not imply lifetime uniqueness;
* source incarnation remains separate;
* historical persisted/profile/backup duplicates require a separate compatibility/recovery task;
* store-level validation should be implemented separately.

Task 2.13 implements only the allocation portion of that contract.

---

# 3. Governing Decision

The implementation must preserve the Task 2.12 distinction:

```
active uniqueness
    ≠
historical incarnation
```

Task 2.13 guarantees:

> A newly created authored source does not duplicate an ID already occupied within its applicable current authored scope.

Task 2.13 does not guarantee:

* an ID has never existed before;
* an ID will never be reused historically;
* a restored source represents the same lifetime;
* occurrence identity is durable-reference safe.

---

# 4. Objective

Implement a shared pure allocator and route all supported interactive authored-source creation paths through it so that:

1. new shift-definition IDs do not collide with active shift-definition IDs;
2. new shift-cycle IDs do not collide with active shift-cycle IDs;
3. new segment IDs do not collide within the containing cycle work-entry namespace;
4. new sequence-entry IDs do not collide within that same cycle-local namespace;
5. new block-template IDs do not collide with active template IDs;
6. new recurrence IDs do not collide with active recurrence IDs;
7. new manual-event IDs do not collide with active manual-event IDs;
8. existing edits preserve existing IDs;
9. existing readable prefixes are preserved;
10. irregular or nonstandard existing IDs do not break allocation;
11. deletion of middle/final items does not create simultaneous duplicates;
12. no durable representation changes;
13. no store-level duplicate rejection is introduced;
14. no historical duplicate data is silently rewritten.

---

# 5. Sources In Scope

Task 2.13 covers interactive creation for:

* `ShiftDefinition`;
* `ShiftCycle`;
* `ShiftSegment`;
* `ShiftCycleSequenceDay`;
* `BlockTemplate`;
* `BlockRecurrence`;
* `ManualCalendarEvent`.

Do not expand to profile IDs or unrelated runtime/derived IDs.

---

# 6. Allocation Ownership

Create one shared pure authored-source allocation module or equivalently narrow helper boundary.

The allocator owns only:

* inspecting occupied IDs;
* choosing a candidate ID;
* ensuring that candidate is not occupied;
* returning the selected ID.

The allocator must not:

* mutate state;
* create domain objects;
* persist anything;
* validate relationships;
* define source incarnation;
* inspect local storage;
* know UI state;
* know store state except through explicit inputs.

---

# 7. Pure Function Requirement

Prefer a deterministic API equivalent to:

```
allocateReadableSourceId({
    prefix,
    occupiedIds,
    preferredBase?
})
```

or a small set of source-specific wrappers built on one general allocator.

The exact API should fit repository conventions.

Given the same inputs, the allocator must return the same ID.

---

# 8. Readable Prefix Preservation

Preserve current readable source families where practical.

At minimum preserve conventions equivalent to:

* `shift_#`;
* `cycle_###` or current exact cycle formatting;
* `segment_#`;
* `sequence_day_#`;
* `template_#`;
* current recurrence prefix conventions;
* `manual_event_<timestamp-like-base>` where used.

Do not standardize unrelated naming conventions merely for consistency.

The allocator should respect each current source family's existing style.

---

# 9. Numeric Allocation Contract

For numeric-suffix source families, use the Task 2.12 adopted strategy:

> Determine the greatest recognized numeric suffix currently occupied for the relevant prefix/scope, then select a greater candidate and verify it is unoccupied.

Conceptually:

```
occupied:
    shift_1
    shift_3

new:
    shift_4
```

not:

```
shift_2
```

This reduces immediate historical reuse while guaranteeing active uniqueness.

It does not create lifetime uniqueness.

---

# 10. Collision Check Is Mandatory

Even after computing a preferred max-plus-one candidate, verify the final ID is not already occupied.

This protects against:

* irregular existing IDs;
* duplicate legacy inputs;
* unusual suffix formatting;
* caller-supplied objects;
* future prefix changes.

If occupied, increment or otherwise advance deterministically until unused.

---

# 11. Irregular Existing IDs

The allocator must safely handle collections such as:

```
template_1
template_custom
template_8
strange_external_id
```

Only recognized IDs belonging to the applicable readable family should affect numeric max selection.

All occupied IDs, recognized or not, must participate in final collision checking.

Do not reject irregular IDs.

Do not rename them.

---

# 12. Duplicate Existing IDs

Historical/current state may already contain duplicate IDs because Task 2.12 established that prior behavior permits them.

Task 2.13 must not repair those duplicates.

For allocation:

```
occupied IDs
    → treat as an occupied set
```

A new source must not choose any already-present duplicate value.

Task 2.13 does not make the pre-existing snapshot valid.

---

# 13. Shift Definition Allocation

Replace current length-derived shift-definition creation with collision-free shared allocation.

Preserve current prefix/style.

Mandatory regression examples include:

## Delete final then create

```
shift_1
shift_2
delete shift_2
create
```

The new source must not collide with any current source.

Whether the chosen value is `shift_2` or `shift_3` is governed by the adopted max-plus-one-over-current-recognized-suffix contract.

Under that contract, if only `shift_1` remains, the current maximum is 1, so `shift_2` is acceptable.

This is active uniqueness, not incarnation safety.

## Delete middle then create

```
shift_1
shift_2
shift_3
delete shift_2
create
```

The new ID must not be `shift_3`.

Expected readable behavior is likely:

```
shift_4
```

---

# 14. Shift Cycle Allocation

Replace current cycle allocation with collision-free shared allocation.

Preserve current zero-padding or exact display convention.

Example:

```
cycle_001
cycle_003
```

should allocate a collision-free higher numeric candidate according to current formatting rules.

Do not alter cycle semantics.

---

# 15. Segment Allocation

Segments require cycle-local allocation.

The occupied namespace must include both:

* segment IDs;
* sequence-entry IDs;

inside the same containing cycle, because Task 2.12 established a shared cycle-local work-entry namespace for V1 identity safety.

A new segment ID must not collide with either collection.

---

# 16. Sequence-Entry Allocation

Sequence entries use the same cycle-local occupied work-entry namespace as segments.

A new sequence-entry ID must not equal:

* an existing sequence-entry ID;
* an existing segment ID in the same cycle.

Do not alter sequence offset validation.

---

# 17. Cross-Cycle Reuse

Task 2.12 adopted cycle-local uniqueness for segment/sequence-entry IDs.

Therefore:

```
cycle A:
    segment_1

cycle B:
    segment_1
```

may remain valid if current typed identity and work identity include cycle context.

Do not impose global uniqueness for these nested source IDs.

---

# 18. Template Allocation

Replace current length-derived template ID allocation.

Use active `blockTemplates` IDs as the occupied scope.

Preserve readable `template_#` convention.

Deletion of a middle template followed by creation must not collide with a surviving later template.

---

# 19. Recurrence Allocation

Replace current interactive recurrence allocation so newly created recurrence IDs cannot collide with active `blockRecurrences`.

Task 2.12 adopted top-level recurrence-ID uniqueness across the active recurrence collection.

Do not rely solely on:

```
rec_${templateId}
```

or:

```
rec_template_${length + 1}
```

without checking all occupied recurrence IDs.

---

# 20. Default / Paired Recurrence Creation

If Setup creates a template and paired/default recurrence together:

1. allocate the template ID;
2. construct the preferred recurrence ID using current naming semantics if desired;
3. pass that preferred value through collision-free recurrence allocation;
4. ensure recurrence linkage uses the final allocated template ID.

Do not create a recurrence with a stale pre-allocation template reference.

---

# 21. Recurrence Naming Preservation

If the current product distinguishes recurrence naming styles—for example default recurrence based on template ID versus numeric paired recurrence—preserve that semantic/style distinction where practical.

The allocator may support a preferred candidate:

```
preferred = rec_template_4
```

and return it when unoccupied.

If occupied, choose a deterministic collision-free alternative.

Do not broaden into recurrence-ID redesign.

---

# 22. Manual Event Allocation

Current manual-event IDs use a timestamp-style base.

Preserve the existing readable/time-derived convention, but route it through collision checking.

Conceptually:

```
preferred:
    manual_event_2026-08-19T13:00:00.000Z

if unoccupied:
    use preferred

if occupied:
    derive deterministic unused variant
```

Possible variants may use a numeric suffix.

Do not switch to random UUIDs in this task.

---

# 23. Timestamp Collision

Add a direct test where two manual events are created with the same mocked creation timestamp.

Both events must receive distinct IDs.

Do not rely on real clock progression to prove uniqueness.

---

# 24. Manual Event Edit Preservation

Editing an existing manual event must preserve its ID.

Do not call new-ID allocation during edit.

Regression coverage must protect this.

---

# 25. Setup Edit Preservation

Editing any existing Setup-authored source must preserve its existing ID.

Task 2.13 affects only creation paths.

Do not allocate replacement IDs merely because an object is reconstructed immutably.

---

# 26. Delete Behavior Preservation

Deletion semantics remain unchanged.

Task 2.13 does not:

* retain tombstones;
* reserve deleted IDs;
* keep a historical allocation counter;
* persist allocation metadata.

Therefore a deleted highest suffix may later be reused if no active object retains it.

This is explicitly acceptable for Task 2.13.

---

# 27. Clear Behavior Preservation

After `clearLocalData`, subsequent new sources may begin again from low readable suffixes because there is no historical incarnation state.

This is intentional under Task 2.13.

Do not introduce lifetime ID reservation.

---

# 28. Profile / Backup Restoration Preservation

Profile load and backup import preserve supplied IDs.

Do not run newly loaded IDs through the allocator.

Those are ingress/replacement operations, not interactive source creation.

Historical duplicate handling remains deferred.

---

# 29. Initial Rehydration Preservation

Local-storage rehydration must preserve authored IDs exactly as current normalization requires.

Do not remap them through the allocator.

---

# 30. Store APIs

Do not add store-owned ID allocation APIs.

Do not modify store setters merely to allocate IDs.

Creating workflows call the shared pure allocator before committing their resulting objects.

---

# 31. Store Duplicate Rejection Deferred

Task 2.12 recommends future store validation of complete authored snapshots.

Task 2.13 must not implement:

* duplicate rejection;
* relationship validation;
* new store failure results;
* Setup commit validation results;
* historical-ingress validation.

Those need their own bounded task.

---

# 32. Setup Draft Behavior

Setup draft creation paths should now be collision-free by construction.

The allocator must work against the draft's current occupied IDs, not only committed store state.

This is one reason allocation belongs outside the store.

---

# 33. Atomic Setup Commit Preservation

The existing atomic `commitAuthoredSetup` behavior remains unchanged.

Task 2.13 changes the IDs selected while creating draft objects, not transaction ownership.

Preserve:

```
one commit
one persistence attempt
one notification
```

for Setup save.

---

# 34. Preview Invalidation Preservation

Creating new authored sources still affects preview dependencies through the existing commit/setter paths.

Do not alter staleness or regeneration behavior.

---

# 35. Runtime Occurrence Identity

Task 2.10 `OccurrenceIdentity` derives from authored IDs.

New collision-free allocation should naturally reduce simultaneous identity aliasing.

Do not modify:

* occurrence-identity structure;
* `OCCURRENCE_IDENTITY_VERSION`;
* occurrence constructors;
* recurrence slots;
* work identity.

---

# 36. No Source-Incarnation Claim

The result artifact must explicitly state:

> Collision-free allocation strengthens active uniqueness but does not establish source-incarnation identity or durable foreign-key safety.

A reused ID after deletion/clear remains possible.

---

# 37. Shared Allocator Placement

Place the allocator in a shared authored/domain/state utility location appropriate for production use by both:

* Setup creation workflows;
* manual-event creation workflow.

Avoid placing it under a UI-component-specific module.

The exact location should reflect dependency direction.

---

# 38. Source-Specific Wrappers

It is acceptable to expose narrow wrappers such as:

```
allocateShiftDefinitionId(...)
allocateShiftCycleId(...)
allocateTemplateId(...)
```

if they preserve formatting and reduce UI knowledge.

These wrappers should delegate to one collision-free primitive where practical.

Do not create a large identifier service.

---

# 39. Formatting Ownership

Source-specific formatting may live in:

* small wrappers/constants;
* the shared allocation module.

UI components should not manually reconstruct numeric suffix logic after Task 2.13.

A production reference audit must confirm no supported interactive creation path retains the old collision-prone algorithm.

---

# 40. Determinism

Given equal:

* source type/prefix;
* occupied IDs;
* preferred candidate/base;

allocation must return the same ID.

Do not use random values.

Time may still participate in the preferred manual-event base because that is existing semantics, but collision resolution itself must be deterministic.

---

# 41. Required Allocator Unit Tests

Add direct tests for the shared primitive/helpers.

At minimum cover:

1. empty occupied set;
2. normal sequential IDs;
3. missing interior suffix;
4. occupied max suffix;
5. irregular IDs;
6. duplicate occupied input values;
7. preferred candidate unoccupied;
8. preferred candidate occupied;
9. repeated collision fallback;
10. formatted/zero-padded IDs if applicable.

---

# 42. Required Shift Tests

Add or update Setup tests proving:

## Shift middle deletion

Create or establish:

```
shift_1
shift_2
shift_3
```

delete `shift_2`, then add a shift.

Assert no duplicate IDs.

Prefer asserting the adopted readable result where stable.

## Shift final deletion

Delete highest shift, create again.

Assert active uniqueness.

Do not characterize historical reuse as failure.

---

# 43. Required Cycle Tests

Cover middle/final deletion and recreation where current UI supports it.

Assert:

* no active duplicate cycle ID;
* formatting remains correct.

---

# 44. Required Segment Tests

Within one cycle:

* establish several segment IDs;
* delete a middle segment;
* create another;
* assert uniqueness.

Also create a sequence-entry ID occupying a candidate segment-style suffix where feasible and assert common work-entry namespace prevents collision.

---

# 45. Required Sequence Tests

Equivalent common-namespace coverage:

* existing segment;
* existing sequence entry;
* add sequence entry;
* no collision with either namespace.

Preserve existing offset validation tests.

---

# 46. Required Template Tests

Create several templates, delete a middle one, create another.

Assert:

* new ID does not collide with surviving template;
* paired recurrence linkage remains correct;
* new recurrence ID is also unique.

---

# 47. Required Recurrence Tests

Directly cover recurrence-ID collision cases.

At minimum include:

* existing preferred recurrence ID already occupied;
* allocator chooses a safe alternative;
* recurrence retains correct `blockTemplateId`.

---

# 48. Required Manual-Event Tests

Cover:

1. ordinary create retains current ID style;
2. two creates with identical mocked timestamps receive distinct IDs;
3. edit preserves ID;
4. delete then create does not collide with currently remaining IDs.

---

# 49. Existing Historical Duplicate Fixtures

Do not rewrite test fixtures representing historical duplicate state unless the fixture is merely a normal interactive creation fixture now invalid under the new allocator.

Historical compatibility tests should continue to preserve historical IDs.

Task 2.13 does not change ingress semantics.

---

# 50. Test Philosophy

Tests should prove:

```
allocator prevents new collisions
```

not:

```
all authored state is now guaranteed duplicate-free
```

The second statement would be false until store/ingress validation work is completed.

---

# 51. Reference Audit

After implementation search for all supported production creation logic.

Confirm old algorithms such as:

```
collection.length + 1
rec_${templateId} without occupied check
raw manual_event_${timestamp} without occupied check
```

are no longer used as final authoritative ID allocation for interactive creation.

It is acceptable for helpers to use these as preferred bases before collision checking.

---

# 52. Production Files Likely To Change

Likely changes include:

* new shared authored-source ID allocation module;
* allocator unit tests;
* `SetupScreen.tsx`;
* `DayFrameApp.tsx`;
* relevant Setup/DayFrameApp tests.

Potential helper/type files may change only where required by imports or source-specific wrappers.

Do not broaden to store, persistence, profiles, backups, recurrence engine, or occurrence identity without compile necessity.

---

# 53. Persistence Boundary

No active persistence payload shape changes.

Only the string values assigned to newly created sources may differ in collision-prone scenarios.

Do not add:

* allocation counters;
* incarnation tokens;
* reserved ID lists;
* metadata.

---

# 54. Profile Boundary

No profile format or behavior changes.

Profiles save whatever accepted current authored IDs exist.

Task 2.13 does not validate historical profile uniqueness.

---

# 55. Backup Boundary

No backup format or behavior changes.

Backups preserve authored IDs exactly.

---

# 56. Compatibility

Task 2.13 is forward-authoring alignment.

Existing data remains readable under current ingress behavior.

No migration is required merely because future new objects use collision-free allocation.

Do not version durable formats.

---

# 57. Runtime ID Readability

Preserve test/debug readability wherever possible.

Examples may remain:

```
shift_4
cycle_004
template_4
```

This is convenience, not a permanent architecture guarantee.

---

# 58. Accessibility / UI

No user-facing accessibility or interaction redesign is authorized.

IDs are not user-facing fields.

Task 2.13 should not add duplicate-error UI because creation should avoid the problem by construction.

---

# 59. Failure Semantics

The allocator should have a total deterministic result for ordinary finite occupied sets.

Do not add normal UI error handling for ID exhaustion unless current ID space can realistically exhaust.

If a malformed prefix/configuration creates an impossible allocation state, use the narrowest developer-facing failure behavior consistent with project conventions.

Document any such behavior.

---

# 60. Explicit Non-Goals

Task 2.13 shall not:

* reject duplicate authored snapshots;
* add authored validation;
* change store result contracts;
* alter `commitAuthoredSetup` failure behavior;
* change local rehydration;
* change profile load;
* change backup import;
* repair historical duplicates;
* silently remap existing IDs;
* add source incarnation;
* add UUIDs;
* add tombstones;
* persist allocation history;
* change `OccurrenceIdentity`;
* change occurrence-identity version;
* add PlanDecision;
* change recurrence expansion;
* change scheduling behavior;
* change preview behavior;
* change friction/suggested-fix behavior;
* change durable formats;
* add migrations;
* update ADRs;
* update `CURRENT_STATE.md`;
* update `CHANGELOG.md`;
* create a checkpoint;
* perform unrelated cleanup.

---

# 61. Required Result Structure

The Task 2.13 result artifact must contain at least:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Shared Allocator Design
6. Allocation Ownership
7. Numeric Allocation Contract
8. Irregular-ID Handling
9. Duplicate-Occupied-Input Handling
10. Shift Definition Integration
11. Shift Cycle Integration
12. Segment Integration
13. Sequence-Entry Integration
14. Common Work-Entry Namespace
15. Template Integration
16. Recurrence Integration
17. Manual-Event Integration
18. Manual-Event Timestamp Collision Handling
19. Edit-ID Preservation
20. Delete / Recreate Semantics
21. Setup Draft Integration
22. Atomic Commit Preservation
23. Store Boundary Preservation
24. Persistence Preservation
25. Profile / Backup Preservation
26. OccurrenceIdentity Preservation
27. Source-Incarnation Boundary
28. Tests Added or Updated
29. Production Reference Audit
30. Compatibility Assessment
31. Architectural Alignment Improvement
32. Deviations
33. Discoveries and Deferred Work
34. Recommended Next Task
35. Validation
36. Final Completion Determination

---

# 62. Validation Requirements

Run focused allocator/UI tests first.

At minimum cover:

* allocator unit tests;
* Setup source creation;
* template/recurrence pairing;
* segment/sequence creation;
* manual-event creation/edit.

Then run repository-standard validation:

```
npm run lint
npm run typecheck
npm test
npm run build
```

Run:

```
git diff --check
```

for affected scope.

Record:

* allocator test count;
* Setup/UI focused test count;
* full test-file count;
* full test count;
* tests added/updated;
* lint result;
* typecheck result;
* build result;
* diff-check result;
* artifact hash;
* specification immutability.

Confirm:

* no governance document changed;
* no durable format changed;
* no store duplicate-rejection behavior was added;
* no source-incarnation behavior was added.

---

# 63. Completion Criteria

Task 2.13 is complete only when:

* one shared pure authored-source allocator exists;
* all supported interactive identity-bearing source creation paths use it;
* new shift IDs are collision-free;
* new cycle IDs are collision-free;
* new segment IDs are collision-free within the cycle-local work-entry namespace;
* new sequence-entry IDs are collision-free within that same namespace;
* new template IDs are collision-free;
* new recurrence IDs are collision-free;
* new manual-event IDs are collision-free even under identical creation timestamps;
* readable source-specific conventions are preserved;
* existing edits preserve IDs;
* middle-item deletion followed by creation cannot create simultaneous duplicates;
* final-item deletion semantics remain truthful and are not mislabeled as incarnation-safe;
* existing imported/rehydrated/profile/backup IDs are not rewritten;
* store APIs and validation behavior remain unchanged;
* persistence/profile/backup formats remain unchanged;
* occurrence identity remains Version 1 and unchanged;
* source incarnation remains explicitly unresolved;
* focused and full validation pass;
* the immutable specification remains unchanged.

---

# 64. Task Determination

Task 2.13 is a bounded authored-source creation-safety implementation.

It does not establish source lifetime identity.

Its purpose is to remove DayFrame's ability to create new simultaneous authored-ID collisions through ordinary interactive source creation while preserving current readable identifiers, draft-first Setup architecture, durable formats, and historical compatibility boundaries.

The implementation must make this statement true:

> Given the current occupied IDs in the applicable authored scope, every newly created source receives an unused ID.

It must not make this stronger and false statement:

> A newly created source receives an ID that has never represented any prior source.

That stronger guarantee belongs to future source-incarnation architecture.

**Task 2.13 is complete when DayFrame routes all supported interactive identity-bearing source creation through one shared pure collision-free allocator, prevents new active ID collisions without rewriting historical data or changing durable formats, preserves existing edit/runtime behavior, and introduces no source-incarnation, store-validation, or PlanDecision behavior.**
