# Task 2.25 — Establish Explicit Source Creation, Update, Deletion, and Replacement Authority for Incarnation Preservation

## Status

Ready for implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Narrow architectural-alignment implementation task.

This task establishes explicit authored-source lifecycle-operation authority and preserves that operation provenance through the supported authoring workflows.

It does **not** implement source incarnation, durable occurrence references, PlanDecision persistence, or persistence-format migration.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution findings must be recorded separately in:

`TASK_2.25_ESTABLISH_EXPLICIT_SOURCE_CREATION_UPDATE_DELETION_AND_REPLACEMENT_AUTHORITY_FOR_INCARNATION_PRESERVATION_RESULT.md`

If implementation exposes a prerequisite outside the authorized scope, stop the affected work and record the blocker rather than broadening the task.

---

# 2. Purpose

Task 2.24 established that DayFrame cannot safely introduce durable source incarnation while authored-source lifetime continuity must still be inferred from final collection snapshots.

The critical executable hazard is the Setup draft.

A source can currently be deleted and another source created before the draft is committed. Because ID allocation considers the currently occupied draft IDs, an ID can potentially be reused during the same draft session. The final committed snapshot can therefore contain the same ID that existed before editing while representing either:

1. an ordinary edit of the original source; or
2. deletion of the original source followed by creation of a new source that reused its ID.

Those operations have different lifetime semantics.

A final-state comparison cannot reliably distinguish them.

Task 2.24 therefore established the governing rule:

> The semantic lifecycle operation, not a before/after snapshot diff or ID equality, determines source-lifetime continuity.

Before source incarnation can be implemented, DayFrame must have an explicit and enforceable answer to:

> What lifecycle operation occurred for this authored source?

Task 2.25 establishes that boundary.

---

# 3. Governing Evidence

This task is governed by the completed Task 2.24 investigation:

`docs/implementation/phase-2/TASK_2.24_ESTABLISH_SOURCE_INCARNATION_AND_LIFETIME_SAFE_OCCURRENCE_REFERENCE_SEMANTICS_RESULT.md`

Task 2.24 established, among other findings:

* ordinary edits preserve a source lifetime;
* creation begins a new lifetime;
* duplication begins a new lifetime;
* delete/recreate begins a new lifetime even when the same ID and content are reused;
* semantic replacement begins a new lifetime;
* active recovery restore may preserve an established lifetime;
* profile activation instantiates new active lifetimes;
* the Setup draft currently loses sufficient operation provenance to distinguish same-ID edit from delete/recreate;
* the store cannot reconstruct lifecycle provenance from final snapshots;
* manual-event UI already distinguishes create, edit, and delete at the workflow level, although the collection setter does not;
* authoring-operation identity is the immediate prerequisite to source-incarnation implementation.

Task 2.24 explicitly recommended the following first implementation stage:

> Establish explicit draft/source create-update-delete-replace authority and lifecycle provenance without persistence changes.

That recommendation defines this task.

---

# 4. Architectural Objective

After Task 2.25, every supported authored-source mutation workflow must carry enough explicit lifecycle information that DayFrame does not need to infer whether a source was:

* created;
* updated while preserving continuity;
* deleted;
* duplicated;
* replaced;
* restored through an explicitly recognized recovery path; or
* instantiated from a reusable artifact.

For ordinary interactive authoring, the system must be able to distinguish:

`edit existing X`

from:

`delete X → create new X`

even when the newly created source receives the same readable/runtime ID.

The lifecycle distinction must survive from the authoring interaction through the authoritative commit boundary.

This task establishes operation authority only.

It must not yet assign durable lifetime tokens.

---

# 5. Core Architectural Rule

The following rule is authoritative for this task:

> Source-lifetime continuity is determined by the authorized lifecycle operation, never inferred from source ID equality, content equality, array position, or final-state diffing.

Therefore:

* existing source + explicit update → continuation;
* existing source + ordinary field edit → continuation;
* new source + explicit create → new source lifetime;
* existing source + delete → source lifetime retired;
* delete X + create X → retirement followed by new source lifetime;
* duplicate X → new source lifetime;
* replace X with Y → retirement/new-source semantics unless a separately governed operation explicitly defines continuity;
* profile activation → instantiate;
* recovery restore → restore;
* arbitrary snapshot replacement → must not silently determine continuity.

Task 2.25 does not implement the lifetime token representing these outcomes.

It establishes the operation semantics needed to do so safely later.

---

# 6. Scope

This task must investigate and, where necessary, modify the supported authored-source mutation paths for:

1. block templates;
2. block recurrences;
3. manual calendar events;
4. shift definitions;
5. shift cycles;
6. cycle segments;
7. cycle sequence entries.

The task must account for both top-level and nested authored sources.

The implementation must identify the actual current production mutation paths rather than assuming behavior from names or task documentation.

---

# 7. Required Initial Investigation

Before modifying code, trace the current executable authoring path for every source type in scope.

For each source type, determine:

* where creation begins;
* where an existing source is selected for editing;
* where draft state is created;
* how edits are represented;
* how deletion is represented;
* whether duplication/copy exists;
* how IDs are allocated;
* whether an ID can be reused before commit;
* what reaches the store;
* whether the store receives operations or only snapshots;
* whether nested objects have independent lifecycle operations;
* whether any production caller bypasses the primary UI authoring workflow;
* whether profile load, backup import, recovery, clear, or initialization uses the same mutation API;
* whether tests directly construct snapshots in ways that must remain supported.

Do not assume that all source types require identical implementation mechanics.

Document material discoveries in the result artifact.

---

# 8. Required Lifecycle Operation Model

Establish an explicit internal lifecycle-operation vocabulary sufficient to represent the current and future incarnation-preservation contract.

The exact type names and representation may be selected during implementation, but the semantics must distinguish at least:

* `create`
* `update`
* `delete`
* `replace`

If duplication exists as a supported operation, it must either:

* be represented explicitly as `duplicate`; or
* enter the authoritative boundary as an unambiguous create of a new source.

Artifact-driven semantics such as:

* `restore`
* `instantiate`

must be recognized as architecturally distinct operations, but this task does not need to force them through the ordinary Setup editing protocol if doing so would expand scope unnecessarily.

The result must clearly document where those artifact semantics remain owned.

---

# 9. Operation Authority

Lifecycle operation classification must be established at the earliest boundary that actually knows what the user/system is doing.

The final store snapshot must not be treated as the primary source of operation truth.

The preferred authority model is:

**user/system intent → authoring workflow/domain mutation boundary → explicit lifecycle operation/provenance → authoritative store commit**

not:

**final snapshot → compare IDs/content → guess lifecycle operation**

If the current UI is the only boundary that knows the operation, the implementation must preserve that knowledge until an authoritative mutation boundary can validate or consume it.

Do not make presentation components the permanent owner of future incarnation allocation merely because they currently observe the operation.

---

# 10. Setup Draft Lifecycle Provenance

This is the principal implementation requirement.

The Setup workflow must retain sufficient lifecycle provenance while the draft is being edited.

The following sequence must remain distinguishable:

**committed source X → delete X from draft → create a new source → new source receives ID X → commit**

from:

**committed source X → edit X → commit**

The final collection snapshot may be structurally similar or even identical in identifying fields.

That must not erase the lifecycle distinction.

The implementation may use:

* draft-local lifecycle metadata;
* explicit operation records;
* stable draft identities;
* another narrowly scoped representation that preserves provenance.

Choose the smallest design that satisfies the architectural contract without prematurely implementing incarnation.

---

# 11. Draft-Local Identity

If draft-local identity is introduced, it must be clearly distinguished from:

* authored source ID;
* future durable source incarnation;
* runtime `OccurrenceIdentity`;
* future `DurableOccurrenceReference`;
* React rendering keys unless intentionally shared for a justified reason.

Draft-local identity must not accidentally become durable identity authority.

It may exist solely to preserve editing provenance through one draft lifecycle.

---

# 12. Creation Semantics

Every supported source creation workflow must be explicitly recognizable as creation.

Creation must not be inferred merely because an ID is absent from the currently committed collection.

A newly created source remains a creation even if:

* its generated ID matches a previously deleted source;
* its content matches a deleted source;
* it is created from copied/default values;
* it is created after another source was deleted in the same draft.

The future incarnation layer must be able to consume this fact without reconstructing history.

---

# 13. Update Semantics

An update represents continued identity of an existing authored source.

Ordinary supported edits must remain updates, including changes to relevant:

* names;
* times;
* durations;
* dates;
* ranges;
* priorities;
* recurrence configuration;
* shift assignments;
* scheduling configuration;
* nested configuration;
* enablement;
* ordering;
* other ordinary editable authored fields.

An update must not become replacement merely because many or all editable fields changed.

Continuity comes from the explicit editing operation.

---

# 14. Deletion Semantics

Deletion must explicitly retire the draft/source continuity represented by the deleted source.

Removing a source from the final collection is not, by itself, sufficient lifecycle provenance if another source can subsequently reuse its ID before commit.

The draft/workflow must retain enough information to know that deletion occurred until the authoritative commit completes or the draft is abandoned.

---

# 15. Delete/Recreate Semantics

Direct regression coverage is required for the Task 2.24 blocker.

At minimum, test:

1. begin with committed source X;
2. enter Setup;
3. delete X;
4. create a new source before committing;
5. allow the normal allocator to assign whatever ID current behavior dictates;
6. if X's ID is reused, verify the lifecycle model still records deletion + creation rather than update;
7. commit;
8. verify the authoritative boundary received or retained the correct lifecycle distinction.

Do not artificially prevent ID reuse merely to make this test pass unless independent evidence shows that ID reuse itself violates an existing contract.

The purpose of this task is to preserve operation truth even when IDs are reused.

---

# 16. Replacement Semantics

Establish an explicit semantic boundary for replacement.

Replacement means one authored source ceases to represent its prior lifetime and another source takes its place.

Do not classify ordinary edits as replacement based on content magnitude.

If no current UI exposes explicit replacement, the implementation may establish the type/authority semantics without adding new UI.

Arbitrary snapshot substitution must not silently claim update continuity.

---

# 17. Duplication / Copy Semantics

Audit whether any supported source duplication or copy behavior currently exists.

If it exists:

* it must be treated as creation of a new source;
* copied authored values must not imply lifecycle continuity;
* future incarnation assignment must be able to recognize it as a new lifetime.

If no such production workflow exists, document that finding rather than inventing one.

Do not add duplication UI solely for this task.

---

# 18. Manual-Event Workflow

Task 2.24 found that the manual-event UI already distinguishes creation from editing using workflow state.

Preserve that distinction through the authoritative mutation boundary.

Do not rely solely on `setManualEvents` receiving a final array to infer whether an event was created, edited, or deleted.

If the current collection setter remains necessary for compatibility/tests, define clearly whether it is:

* a low-level snapshot replacement boundary;
* an internal compatibility API;
* or an authorized lifecycle-aware mutation path.

Do not falsely attribute lifecycle semantics to a snapshot-only caller.

---

# 19. Shift Definition Semantics

Shift definitions must receive the same lifecycle guarantees.

Ordinary shift-definition edits preserve continuity.

Deletion followed by recreation is a new source lifetime regardless of ID reuse.

Any relationships from cycle entries to shift-definition IDs must remain behaviorally unchanged in this task.

Do not implement incarnation lineage yet.

---

# 20. Shift Cycle Semantics

Shift cycles are independently lifetime-bearing sources.

The task must distinguish:

* creation of a cycle;
* update of an existing cycle;
* deletion of a cycle;
* replacement/recreation of a cycle.

Ordinary changes to range, mode, sequence, segment configuration, or other supported cycle fields are updates when performed through an explicit edit.

---

# 21. Nested Segment Semantics

Cycle segments require independent lifecycle provenance.

Their identity cannot be reduced to array position.

An ordinary segment edit or reorder preserves lifecycle continuity.

Deleting a segment and adding another segment—even with the same nested ID—is deletion plus creation.

The lifecycle model must retain this distinction through the cycle/Setup commit.

---

# 22. Sequence-Entry Semantics

Sequence entries also require independent lifecycle provenance.

Assignment changes, day-offset changes, and reorder are ordinary updates when explicitly editing an existing entry.

Removal followed by re-addition is a new lifecycle operation.

Do not infer continuity from:

* array index;
* day offset;
* shift-definition assignment;
* reused nested ID;
* structurally identical content.

---

# 23. Nested ID Scope

Preserve the current validated nested ID scope established by Task 2.24.

Segment and sequence-entry IDs may be cycle-local and may share the current cycle-local namespace according to existing executable behavior.

This task must not globally redefine nested IDs.

Lifecycle provenance must work correctly under the existing scope.

---

# 24. ID Allocation

Do not redesign the existing readable/source ID allocator unless required to preserve current correctness.

In particular:

* source ID and lifecycle provenance remain separate concepts;
* ID reuse must not imply continuity;
* preventing ID reuse is not a substitute for lifecycle authority;
* future incarnation must remain necessary even if allocation later becomes more conservative.

Any allocator changes require explicit evidence and must be documented as a deviation if not directly necessary.

---

# 25. Store Boundary

The store must not infer lifecycle semantics by comparing the new authored setup against the previous one.

If store enforcement is added, it should validate explicit operation/provenance supplied by the authoring boundary rather than reconstructing intent.

The task must determine the narrowest appropriate store API change.

Possible outcomes include:

* extending commit input with lifecycle provenance;
* introducing a lifecycle-aware authored mutation input;
* adding an internal authoring transaction representation;
* another equivalent narrowly scoped mechanism.

Do not require a broad store rewrite.

---

# 26. Snapshot APIs

Audit existing snapshot-style setters and replacement APIs.

For each relevant API, classify it as one of:

1. lifecycle-aware authored mutation;
2. full authoritative replacement with explicit ingress semantics;
3. compatibility/test scaffolding;
4. unsafe/ambiguous path requiring restriction or adaptation.

Do not silently reinterpret arbitrary snapshot replacement as a sequence of lifecycle-preserving edits.

Preserve supported behavior unless this task explicitly demonstrates that a path violates the new authority contract.

---

# 27. Artifact Replacement Boundaries

Task 2.24 established:

* profile load → instantiate;
* future recovery-grade backup restore → restore;
* current V1 backup import → future baseline instantiation/conversion;
* active rehydration → restore established current-format identity once incarnation exists.

Task 2.25 must preserve these distinctions conceptually.

It does not implement their incarnation behavior.

If ordinary authoring-operation types are not appropriate for these replacement boundaries, keep them separate and document why.

Do not collapse profile load and backup restore into generic `replace`.

---

# 28. Initialization Boundary

Audit initialization and injected initial-state paths for lifecycle implications.

Do not attempt to assign lifecycle provenance retrospectively to test/injected snapshots unless necessary.

Document whether these paths are:

* bootstrap state;
* explicit authoritative replacement;
* test scaffolding;
* compatibility ingress.

No persistence migration is authorized.

---

# 29. Clear / Reset

Clear/reset retires current active source authority.

This task does not need tombstones or lifetime history.

Ensure that lifecycle-operation infrastructure introduced by this task does not leave stale draft provenance or operation metadata that could incorrectly apply to subsequently created sources.

---

# 30. Draft Cancellation / Abandonment

Lifecycle provenance created while editing a draft must not mutate committed source authority until the existing commit/save boundary is crossed.

If Setup edits are cancelled, abandoned, replaced by profile load/import/clear, or otherwise discarded under current behavior, draft lifecycle metadata must be discarded with them.

No durable mutation should result merely from recording draft provenance.

---

# 31. Atomic Setup Commit

Preserve the existing atomic authored Setup commit semantics.

Task 2.25 must not regress the Phase 1 ownership rule that authored Setup changes are committed as one authoritative operation.

Lifecycle provenance may accompany that commit, but it must not cause partial domain commits as the user edits individual fields.

This task must not restore local store mirrors or per-field persistence.

---

# 32. Manual Event Commit Behavior

Preserve current manual-event user-visible behavior unless a narrowly scoped API adjustment is required.

Create/edit/delete should remain explicit workflow operations.

Do not fold manual events into the Setup form merely to unify lifecycle handling.

---

# 33. Persistence Boundary

No persistence-format change is authorized.

Do not add:

* incarnation fields;
* lifecycle-operation logs;
* draft identity;
* source-operation history;
* new active-state format versions;
* new profile fields;
* new backup fields;
* new local-storage keys.

Task 2.25 operation provenance is runtime/authoring infrastructure only.

Future tasks will determine which identity metadata becomes durable.

---

# 34. Runtime State Boundary

Do not add persistent lifecycle history to `DayFrameState`.

If lifecycle metadata is needed during editing or commit, keep it in the narrowest appropriate authoring/workflow representation.

The final current runtime authored state should remain behaviorally equivalent after commit.

This task establishes how the mutation happened, not a historical ledger of all mutations.

---

# 35. Preview Behavior

No Preview semantic changes are authorized.

Existing authored mutations must continue to:

* mark the Preview stale where currently required; or
* clear/regenerate it according to existing replacement workflows.

Lifecycle provenance must not itself introduce extra Preview invalidation.

---

# 36. Suggested-Fix Behavior

Do not modify suggested-fix generation, application, stale-preview rejection, Try behavior, or accepted-fix semantics.

Task 2.25 is below those planning layers.

---

# 37. OccurrenceIdentity Boundary

Do not modify `OccurrenceIdentity` V1.

Do not add incarnation to it.

Do not change its equality, generation, slot, source-kind, recurrence-coordinate, or work-coordinate semantics.

Task 2.10 remains authoritative for runtime occurrence identity.

---

# 38. DurableOccurrenceReference Boundary

Do not implement `DurableOccurrenceReference`.

Task 2.24 established its future semantics only.

No durable occurrence-reference types, constructors, resolvers, canonical keys, or persistence behavior are authorized here.

---

# 39. PlanDecision Boundary

Do not implement or persist PlanDecisions.

Do not add decision replay, decision storage, accepted-decision history, target resolution, or decision/source transactions.

This task is a prerequisite for those capabilities.

---

# 40. Source Incarnation Boundary

Do not implement source incarnation.

Specifically, do not add:

* incarnation fields;
* random lifetime tokens;
* UUID/ULID lifetime values;
* incarnation allocators;
* incarnation validation;
* incarnation persistence;
* incarnation migration;
* incarnation-aware profile behavior;
* incarnation-aware backup behavior.

Task 2.25 establishes the operation authority that future incarnation implementation will consume.

---

# 41. No Operation Log

Do not create a durable or long-lived mutation history.

The required lifecycle provenance may be transient and scoped to the current authoring transaction.

DayFrame does not need event sourcing to satisfy this task.

The objective is reliable classification of the current authoritative mutation, not reconstruction of all historical mutations.

---

# 42. Validation Requirements

Add direct tests sufficient to prove the lifecycle-operation contract.

At minimum, cover:

## Setup / Top-Level Sources

* creation is classified as creation;
* ordinary edit is classified as update;
* deletion is classified as deletion;
* delete then recreate with reused ID remains delete + create;
* substantial content change through explicit edit remains update;
* draft abandonment does not affect committed authority.

## Templates / Recurrences

* template create/edit/delete lifecycle distinction;
* recurrence create/edit/delete lifecycle distinction;
* template and recurrence provenance remain independently identifiable.

## Shift Definitions / Cycles

* shift-definition create/edit/delete distinction;
* cycle create/edit/delete distinction.

## Nested Work Sources

* segment edit preserves operation continuity;
* segment delete/recreate is distinguishable;
* sequence-entry edit preserves operation continuity;
* sequence-entry delete/recreate is distinguishable;
* reorder does not imply replacement.

## Manual Events

* create is distinguishable from edit;
* delete is explicit;
* same-ID replacement cannot masquerade as edit through the authoritative supported path.

## Store / Commit Boundary

* lifecycle provenance reaches or is validated by the authoritative commit boundary;
* the store does not infer delete/recreate as update solely because IDs match;
* no persistence shape changes occur;
* existing Preview invalidation behavior remains intact.

Use focused unit tests where possible and integration tests where the Setup draft lifecycle is the behavior under examination.

---

# 43. Regression Requirements

Existing behavior must remain green for:

* authored Setup editing;
* atomic Setup commit;
* manual-event editing;
* profile save/load;
* backup export/import;
* active persistence;
* recovery behavior;
* clear/reset;
* Preview generation;
* stale Preview handling;
* suggested fixes;
* occurrence identity;
* cycle generation;
* durability semantics.

Do not weaken existing assertions merely to accommodate the new operation representation.

---

# 44. Reference Audit

Before completion, search all production references to the affected mutation and commit APIs.

Confirm that no supported authoring path can:

* bypass required lifecycle provenance;
* accidentally classify arbitrary snapshot replacement as update;
* lose nested-source provenance;
* convert create into update through ID equality;
* convert delete/recreate into update through final-state comparison.

Document any intentionally retained low-level/test-only snapshot API.

---

# 45. Architectural Alignment Requirements

The implementation must improve alignment with the following principles.

## Explicit Authority

The authoring boundary explicitly knows what operation occurred.

## Epistemic Integrity

DayFrame does not claim lifetime continuity from evidence that cannot establish it.

## Deterministic Semantics

Equivalent explicit operations have equivalent lifecycle meaning independent of incidental IDs or array ordering.

## Separation of Concerns

Workflow operation provenance is distinct from:

* source ID;
* future incarnation;
* runtime occurrence identity;
* durable occurrence reference;
* persistence;
* Preview;
* PlanDecision.

## Compatibility Preservation

Current durable data remains readable and writable under the existing format.

---

# 46. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.25_ESTABLISH_EXPLICIT_SOURCE_CREATION_UPDATE_DELETION_AND_REPLACEMENT_AUTHORITY_FOR_INCARNATION_PRESERVATION_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Evidence Reviewed
4. Implementation Completed
5. Files Changed
6. Lifecycle Operation Model
7. Operation Authority
8. Setup Draft Provenance
9. Same-ID Delete/Recreate Behavior
10. Draft-Local Identity, if introduced
11. Template Semantics
12. Recurrence Semantics
13. Manual-Event Semantics
14. Shift-Definition Semantics
15. Shift-Cycle Semantics
16. Segment Semantics
17. Sequence-Entry Semantics
18. Replacement Semantics
19. Duplication/Copy Assessment
20. Store Enforcement Boundary
21. Snapshot API Assessment
22. Profile/Backup/Recovery Boundary Assessment
23. Initialization Assessment
24. Clear/Reset Behavior
25. Draft Abandonment Behavior
26. Persistence Boundary
27. Preview/Derived-State Preservation
28. OccurrenceIdentity Preservation
29. Source-Incarnation Boundary
30. Tests Added or Updated
31. Reference Audit
32. Architectural Alignment Assessment
33. Deviations
34. Discoveries and Deferred Work
35. Recommended Next Task
36. Validation
37. Final Completion Determination

The result must clearly distinguish:

* implemented behavior;
* confirmed existing behavior;
* architectural determination;
* deferred future behavior.

---

# 47. Validation Commands

Run the repository-standard validation appropriate to the current project.

At minimum:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Also run focused tests for every changed state/UI/authoring module before the full suite.

Record exact final test-file and test-count results in the result artifact.

---

# 48. Completion Criteria

Task 2.25 is complete only when all of the following are true:

* supported authored-source creation is explicitly distinguishable from update;
* supported authored-source update explicitly preserves lifecycle continuity semantics;
* deletion is explicitly represented through the authoring transaction;
* delete/recreate remains distinguishable even when IDs are reused;
* replacement has an explicit semantic boundary;
* templates and recurrences retain independent provenance;
* shift definitions and cycles retain independent provenance;
* segments and sequence entries retain independent provenance;
* manual-event create/edit/delete semantics reach an authoritative boundary without snapshot inference;
* Setup retains lifecycle provenance until atomic commit;
* draft cancellation/abandonment discards uncommitted lifecycle provenance;
* store enforcement does not guess operation identity from final-state equality;
* current persistence formats remain unchanged;
* current profile and backup formats remain unchanged;
* Preview behavior remains unchanged;
* `OccurrenceIdentity` V1 remains unchanged;
* no source incarnation is implemented;
* no `DurableOccurrenceReference` is implemented;
* no PlanDecision persistence is implemented;
* focused and full validation pass;
* the required result artifact is complete.

---

# 49. Explicit Non-Goals

Do **not**:

* implement source incarnation;
* choose an incarnation token encoding;
* add UUID/ULID lifetime metadata;
* modify active durable format versions;
* migrate existing local data;
* modify profile format;
* modify backup format;
* implement restore-versus-instantiate incarnation behavior;
* implement `DurableOccurrenceReference`;
* modify `OccurrenceIdentity` V1;
* persist PlanDecisions;
* implement PlanDecision replay;
* add source tombstones;
* add durable source history;
* introduce event sourcing;
* prevent all ID reuse as a substitute for provenance;
* redesign the scheduling engine;
* redesign Preview;
* redesign Setup UX beyond what is necessary to preserve lifecycle provenance;
* add unsupported duplication/replacement UI;
* perform broad cleanup unrelated to lifecycle authority.

---

# 50. Stop Conditions

Stop and report rather than expanding scope if implementation demonstrates that:

* operation provenance cannot be preserved without changing durable formats;
* the current atomic Setup commit cannot carry lifecycle provenance without a broad ownership rewrite;
* an affected source lacks a defensible create/update/delete boundary;
* nested segment/sequence lifecycle cannot be distinguished under current authoring behavior;
* a production snapshot API fundamentally bypasses any enforceable operation boundary;
* preserving manual-event operation authority requires changing unrelated persistence semantics;
* the implementation would require introducing incarnation itself;
* a required change would alter profile/backup compatibility;
* a required change would alter scheduling-engine semantics.

A stop-condition finding should recommend the narrowest prerequisite task.

---

# 51. Recommended Follow-On Boundary

If Task 2.25 completes without exposing another prerequisite, the next task should move to the second stage established by Task 2.24:

> Define the durable source-identity data model and independently versioned active/profile/backup format evolution required for incarnation.

Do not assume that source fields should be added before that format/governance task establishes their durable representation and migration contract.

---

# 52. Task Determination

**Authorized:** narrow implementation of explicit authored-source lifecycle-operation authority and Setup/manual-event provenance sufficient to distinguish creation, continuation, deletion, and replacement without final-snapshot inference.

**Not authorized:** incarnation, durable identity, migration, durable occurrence references, PlanDecision persistence, engine redesign, or durable mutation history.

The implementation should prefer the smallest mechanism that makes the operation boundary explicit and testable while preserving current user-visible behavior.

---

# 53. Final Completion Statement

**Task 2.25 is complete when DayFrame explicitly preserves authored-source creation, update, deletion, and replacement authority through every supported authoring workflow and authoritative commit boundary—including same-ID delete/recreate and nested work sources—without inferring lifecycle continuity from final snapshots, while preserving existing persistence, Preview, occurrence-identity, profile, backup, recovery, and scheduling behavior and without implementing source incarnation, durable occurrence references, or PlanDecision persistence.**
