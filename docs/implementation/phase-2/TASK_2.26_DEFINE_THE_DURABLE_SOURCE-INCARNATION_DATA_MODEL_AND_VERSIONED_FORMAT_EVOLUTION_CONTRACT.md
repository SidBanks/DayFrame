# Task 2.26 — Define the Durable Source-Incarnation Data Model and Versioned Format Evolution Contract

## Status

Ready for investigation and architectural decision.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Architecture, durable-data governance, and migration-contract definition task.

This task defines the durable representation and compatibility contract required before source incarnation may be implemented.

It does **not** yet add incarnation fields to production authored sources, migrate stored data, change persistence writers, modify profiles/backups, or introduce durable occurrence references or PlanDecision persistence.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before investigation:

1. verify that the saved project copy of this task exists;
2. verify that the supplied execution artifact is complete;
3. compare the supplied artifact with the saved project copy when both are available;
4. record SHA-256 evidence for the immutable task artifact;
5. do not modify this task specification during execution.

Execution findings and architectural determinations must be recorded separately in:

`TASK_2.26_DEFINE_DURABLE_SOURCE_INCARNATION_DATA_MODEL_AND_VERSIONED_FORMAT_EVOLUTION_CONTRACT_RESULT.md`

If the investigation demonstrates that an existing governance decision prevents a defensible incarnation format from being specified, stop the affected determination and record the prerequisite rather than silently overriding established policy.

---

# 2. Purpose

Task 2.24 established the semantic requirement for source incarnation.

Task 2.25 established explicit lifecycle-operation authority so DayFrame can distinguish:

* creation;
* update/continuation;
* deletion;
* replacement;
* same-ID delete/recreate;

without inferring lifetime continuity from final snapshots.

The next architectural question is no longer:

> How do we know whether a source lifetime continued?

Task 2.25 answers that.

The next question is:

> How must source lifetime identity be represented, versioned, persisted, migrated, restored, instantiated, and validated so that future durable occurrence references can safely depend on it?

That question must be answered **before** incarnation fields are added to production data.

Task 2.26 defines that contract.

---

# 3. Governing Evidence

This task is governed by:

* Task 2.24 source-incarnation and lifetime-safe occurrence-reference findings;
* Task 2.25 explicit lifecycle-operation authority;
* the Phase 1 durable-data compatibility and format-versioning decision;
* current active-state persistence;
* current profile persistence;
* current backup export/import;
* current recovery/rehydration behavior;
* existing compatibility normalization;
* current authored-source type structure;
* current `OccurrenceIdentity` V1 contract.

Task 2.25 specifically established that:

* lifecycle provenance is transient;
* no incarnation is yet implemented;
* no persistence format changed;
* Setup transactions can distinguish same-ID delete/recreate;
* manual-event mutations now carry explicit lifecycle semantics;
* snapshot APIs remain lifecycle-ambiguous;
* profile, backup, recovery, initialization, and ordinary authoring remain distinct ingress authorities;
* the next task should define the durable source-identity model and independently versioned format evolution before adding source fields.

These findings are prerequisites, not suggestions.

---

# 4. Architectural Objective

Produce an implementation-ready durable-data contract for source incarnation.

At completion, DayFrame must have explicit architectural answers for:

1. which authored source kinds require incarnation;
2. where incarnation lives in the domain model;
3. what an incarnation value means;
4. what properties an incarnation token must possess;
5. whether incarnation is opaque or semantically structured;
6. when incarnation is allocated;
7. when incarnation is preserved;
8. when incarnation must change;
9. how active persistence represents incarnation;
10. how profiles represent incarnation;
11. how backups represent incarnation;
12. how legacy durable data without incarnation is migrated;
13. how migration behaves under failure;
14. how rehydration preserves established incarnation;
15. how profile activation instantiates new active lifetimes;
16. how backup recovery differs from ordinary import;
17. how current V1 backup data is interpreted;
18. how source references will eventually combine source ID and incarnation;
19. what version boundaries change;
20. what compatibility guarantees remain mandatory.

The result must be sufficiently precise that a later implementation task can add incarnation without inventing policy while coding.

---

# 5. Core Architectural Rule

The governing identity rule remains:

> Source ID identifies a logical authored-source name/reference within its defined scope. Source incarnation identifies one particular lifetime of that source identity.

Therefore:

**source ID equality does not imply lifetime equality.**

Future lifetime-safe source identity must conceptually include:

**source scope + source ID + source incarnation**

where source scope is determined by the relevant source kind.

For nested sources, parent scope remains part of identity where required.

The exact durable representation must be determined by this task.

---

# 6. Source Kinds in Scope

Determine the durable incarnation contract for every lifetime-bearing authored source identified by Tasks 2.24 and 2.25:

1. block templates;
2. block recurrences;
3. manual calendar events;
4. shift definitions;
5. shift cycles;
6. cycle segments;
7. cycle sequence entries.

Do not assume identical storage representation without examining the current type and persistence structure.

Document the source scope for each.

---

# 7. Required Initial Investigation

Before making architectural determinations, trace the current executable and durable representation of every source kind.

For each source kind, determine:

* current type definition;
* current source ID field;
* ID scope;
* nesting/parent relationship;
* active persistence representation;
* profile representation;
* backup representation;
* cloning behavior;
* normalization behavior;
* validation behavior;
* rehydration behavior;
* profile activation behavior;
* backup import behavior;
* recovery behavior;
* clear/reset behavior;
* initialization/default behavior;
* current legacy compatibility paths;
* any source synthesis/default creation behavior.

Also trace the current durable format/version declarations for:

* active authored data;
* saved profiles;
* backups.

Do not rely on filenames or comments alone.

---

# 8. Incarnation Semantic Definition

Define `source incarnation` precisely.

At minimum, the result must establish that an incarnation represents:

> One specific continuous lifetime of one authored source within its defined source-ID scope.

An incarnation must remain stable through ordinary updates to that source.

An incarnation must not be reused to represent a semantically new lifetime merely because:

* the source ID is reused;
* content is identical;
* the source occupies the same array position;
* the source was recreated from defaults;
* the source was recreated from copied values.

The result must define whether an incarnation has any meaning beyond uniqueness.

Prefer opaque semantics unless evidence requires structure.

---

# 9. Incarnation Token Requirements

Determine the requirements for the future incarnation value.

At minimum evaluate:

* uniqueness requirements;
* collision risk;
* determinism versus random allocation;
* offline generation;
* cross-device/import behavior;
* string versus structured representation;
* readability requirements;
* serialization stability;
* JavaScript/TypeScript safety;
* testability;
* clone behavior;
* equality behavior;
* future migration requirements.

The task may recommend an encoding such as UUID, ULID, random opaque token, or another scheme, but must justify the choice against DayFrame's actual requirements.

Do not implement the generator in this task.

---

# 10. Allocation Authority

Define exactly which lifecycle operations allocate a new incarnation.

The contract must account for:

* create;
* update;
* delete;
* delete/recreate;
* replace;
* duplicate/copy if introduced later;
* profile activation;
* active rehydration;
* backup recovery;
* V1 backup import/conversion;
* initialization/default creation.

Task 2.25's explicit lifecycle operations must be the future authoring authority for allocation.

Do not permit incarnation allocation based merely on snapshot comparison.

---

# 11. Update / Continuity Contract

Ordinary lifecycle-aware `update` must preserve incarnation.

This must remain true even when every editable field changes.

Continuity comes from the explicit operation authority established by Task 2.25.

The result must state that incarnation is not recomputed from content.

---

# 12. Creation Contract

Explicit creation must allocate a new incarnation.

This remains true when:

* the source ID has never existed before;
* the source ID existed and was deleted;
* the same ID is recreated in the same Setup draft;
* the new source has identical content to a retired source;
* the source is created from defaults.

The new incarnation distinguishes the new lifetime.

---

# 13. Delete/Recreate Contract

The Task 2.24/2.25 critical case must receive a direct durable semantic definition.

For:

**existing `(ID=X, incarnation=A)` → delete X → create X**

the resulting source must eventually be:

**`(ID=X, incarnation=B)`**

with:

**`B != A`**

The previous incarnation must never be silently transferred to the recreated source.

No tombstone requirement is implied by this rule.

---

# 14. Replacement Contract

Define incarnation semantics for explicit `replace`.

Unless evidence supports a different model, replacement should mean:

* prior lifetime ends;
* replacement source begins a new lifetime;
* replacement receives a new incarnation.

If replacement can occur while retaining the same source ID, incarnation must carry the distinction.

Do not conflate replacement with ordinary update.

---

# 15. Nested Source Contract

Define durable incarnation semantics for:

* cycle segments;
* cycle sequence entries.

Their lifetime identity must respect their established source scope.

Determine whether future durable identity is conceptually:

**cycle identity + nested source ID + nested incarnation**

or whether the parent cycle incarnation must also participate.

This is especially important because a deleted/recreated parent cycle can reuse the same cycle ID while representing a new lifetime.

The task must explicitly determine whether nested durable identity requires parent **ID only** or parent **lifetime identity**.

Do not leave this implicit.

---

# 16. Parent Recreation Semantics

Directly determine what happens to nested-source lifetime identity when a parent cycle is retired and recreated.

For example:

* Cycle `cycle_1`, incarnation A
* Segment `segment_1`, incarnation S1
* delete cycle
* recreate `cycle_1`, incarnation B
* create `segment_1`

The architecture must guarantee that the new segment cannot resolve as the old segment.

Determine whether this is guaranteed by:

* independent new segment incarnation;
* parent incarnation participation;
* both.

Document the canonical rule.

---

# 17. Active Durable Format

Define the next active authored-data format required to store source incarnation.

Determine:

* current active format/version;
* next required version;
* exact source fields added;
* whether every lifetime-bearing source requires incarnation;
* whether incarnation is mandatory in the new format;
* whether writers may emit missing incarnation;
* whether normalization may synthesize incarnation;
* whether the active storage key changes;
* whether versioning is envelope-based, schema-based, or currently implicit.

Follow the Phase 1 durable-data governance decision.

Do not modify the format in this task.

---

# 18. Profile Durable Format

Define how source incarnation participates in saved profiles.

This requires particular care because Task 2.24 distinguished **profile artifact identity** from **active source lifetime identity**.

Determine whether a saved profile stores:

* source incarnation from the active state;
* artifact-local source identity;
* source data without reusable active incarnation;
* another representation.

Then define what happens when the same profile is activated multiple times.

The contract must prevent repeated profile activation from accidentally resurrecting the same active source lifetime unless that is explicitly intended.

---

# 19. Profile Activation / Instantiation Contract

Task 2.24 established profile activation as **instantiation**, not restoration.

Therefore define how incarnation behaves when a profile becomes active.

The result must answer:

* whether profile-contained incarnation is copied;
* whether new active incarnation is allocated;
* whether all profile sources receive new active lifetimes;
* whether nested source lifetime relationships are regenerated coherently;
* whether repeated loading of the same profile produces distinct active lifetimes.

This must be explicit before implementation.

---

# 20. Backup Durable Format

Define how source incarnation participates in future backups.

Distinguish at least:

* portable user-authored export/import;
* recovery-grade restoration of the same active authoritative state.

Determine whether one backup format can safely support both semantics or whether metadata/operation context must distinguish them.

Do not assume current V1 backup behavior already provides recovery-grade lifetime semantics.

---

# 21. Restore Versus Instantiate

The result must formally distinguish:

## Restore

Re-establish the same previously durable authoritative lifetime identity.

Expected future behavior:

**preserve incarnation.**

## Instantiate

Use an artifact as a template/baseline to create new active authoritative sources.

Expected future behavior:

**allocate new incarnation.**

Determine which current and future ingress paths belong to each category.

This distinction must not be inferred from identical payloads.

The operation/ingress authority must determine it.

---

# 22. Current V1 Backup Import

Determine how current V1 backups, which predate incarnation, should behave once incarnation exists.

At minimum consider:

* reject after format evolution;
* migrate/convert during import;
* instantiate new active lifetimes;
* another compatibility-preserving interpretation.

The contract must not pretend a legacy artifact can restore incarnation information that it never contained.

This is an epistemic-integrity requirement.

---

# 23. Active Rehydration

Define how current-format active persisted state rehydrates once incarnation exists.

Established incarnation must survive ordinary application restart.

Rehydration must not allocate new incarnation merely because objects are reconstructed in memory.

The durable representation must therefore contain enough information to restore the same lifetime identity.

---

# 24. Legacy Active-State Migration

Define the migration from the currently supported active durable format to the first incarnation-bearing format.

Legacy sources have no historical incarnation.

The migration must establish a defensible baseline identity for each currently active source.

Determine:

* when baseline incarnation is allocated;
* whether allocation occurs before runtime state becomes authoritative;
* whether every source is migrated atomically;
* whether nested sources are migrated atomically with parents;
* what happens if migration or serialization fails;
* whether legacy data remains recoverable;
* when the new format may overwrite the old checkpoint.

Do not implement migration.

---

# 25. Migration Epistemic Boundary

A migrated legacy source may receive a **baseline incarnation**, but DayFrame must not claim that this token reconstructs historical lifetimes that existed before migration.

The result must state the semantic boundary clearly.

For example:

> The first incarnation assigned during migration identifies the active source lifetime as recognized from the migration boundary forward; it does not reconstruct prior delete/recreate history.

Use wording consistent with the actual architectural determination.

---

# 26. Migration Atomicity

Define the required atomicity contract for durable format migration.

At minimum address:

* parsing old data;
* validation;
* normalization;
* incarnation allocation;
* construction of new-format state;
* serialization;
* durable write;
* runtime adoption;
* old-data preservation on failure.

The migration must not leave a partially incarnation-bearing authoritative graph.

Determine how this interacts with the Phase 1 persistence-failure authority and retry semantics.

---

# 27. Migration Failure

Define expected behavior when:

* legacy data parses but cannot migrate;
* incarnation generation fails;
* new-format serialization fails;
* local-storage access fails;
* durable write fails;
* runtime adoption succeeds but persistence fails;
* persistence succeeds but subsequent initialization fails.

Use existing durability semantics rather than inventing an unrelated failure system.

Identify any case that requires a later implementation task.

---

# 28. Profile Migration

Determine how existing saved profiles without incarnation evolve.

Because profile activation is instantiation, profile migration may not need to invent reusable active lifetime identity.

However, the profile artifact still needs a versioned durable representation consistent with future source identity semantics.

Determine:

* whether legacy profiles are migrated in place;
* whether they remain readable under compatibility normalization;
* whether incarnation-like metadata belongs in profile artifacts at all;
* whether profile format must version independently from active format.

Do not assume the answer.

---

# 29. Backup Migration / Compatibility

Determine how legacy backups remain supported after active incarnation is introduced.

The contract must address:

* old backup import;
* new backup export;
* new backup import;
* future recovery-grade restore;
* version rejection;
* conversion behavior.

Preserve the Phase 1 compatibility principle that durable evolution is deliberate and versioned.

---

# 30. Independent Format Versioning

Task 2.25 recommended **independently versioned active/profile/backup format evolution**.

Investigate whether current implementation already provides sufficient independent version boundaries.

If not, define what must change.

The result must explicitly determine whether:

* active state;
* profile collection/profile data;
* backup envelope;

need independent version identifiers.

Avoid coupling unrelated durable surfaces merely because they currently share `DayFrameAuthoredSetup`.

---

# 31. `DayFrameAuthoredSetup` Boundary

Determine whether incarnation belongs directly in the existing authored source types and therefore naturally flows through `DayFrameAuthoredSetup`, or whether durable artifacts require distinct representations.

The result must distinguish:

* runtime authoritative authored model;
* active durable representation;
* profile artifact representation;
* backup artifact representation.

Do not assume one TypeScript shape should continue serving all four merely because it currently does.

---

# 32. Validation Contract

Define validation requirements for incarnation-bearing data.

At minimum consider:

* missing incarnation;
* empty incarnation;
* malformed incarnation;
* duplicate incarnation values;
* duplicate source IDs;
* nested scope collisions;
* same incarnation appearing on unrelated sources;
* unknown future format version;
* legacy format without incarnation.

Determine which conditions are invalid versus merely unusual.

Do not overstate uniqueness requirements beyond what the chosen token semantics require.

---

# 33. Clone / Snapshot Contract

Define clone behavior once incarnation exists.

Incarnation must survive:

* store snapshots;
* authored setup clones;
* profile clones where applicable;
* backup construction where applicable;
* preview source projection where applicable.

If incarnation is represented as an immutable scalar, state that explicitly.

No clone implementation changes are authorized here.

---

# 34. OccurrenceIdentity Relationship

`OccurrenceIdentity` V1 remains unchanged by this task.

Define its future relationship to incarnation without implementing that relationship.

Task 2.10 established runtime semantic occurrence equality.

Task 2.24 established that runtime identity alone is not safe as a durable foreign key.

The result should determine whether future durable occurrence targeting conceptually uses:

**OccurrenceIdentity coordinates + source incarnation**

or a separately constructed `DurableOccurrenceReference`.

Do not modify V1.

---

# 35. DurableOccurrenceReference Readiness

Define the minimum source-incarnation guarantees that must exist before `DurableOccurrenceReference` can safely be implemented.

At minimum, a durable occurrence reference must not resolve against a later source lifetime merely because the source ID and recurrence coordinates were reused.

This task should establish the prerequisite, not the reference implementation.

---

# 36. PlanDecision Boundary

No PlanDecision persistence is authorized.

However, the result must explain how the durable incarnation contract prepares the eventual decision-target boundary.

A future decision must be able to distinguish:

* the intended source lifetime;
* a later same-ID replacement;
* an occurrence within that lifetime.

Do not design full PlanDecision behavior unless necessary to establish the identity prerequisite.

---

# 37. Source Deletion

Determine whether durable incarnation requires tombstones.

The default expectation is **no** unless evidence demonstrates otherwise.

A deleted source may disappear from active authored state while durable references to its incarnation simply cease to resolve.

If future decision/history semantics require tombstones, defer that requirement to the appropriate task rather than introducing them here.

---

# 38. Source History

Do not introduce source-history persistence merely to support incarnation.

Incarnation distinguishes lifetimes; it does not require retaining all retired lifetimes.

Document whether any current requirement actually needs retired-source records.

If none exists, state that clearly.

---

# 39. Clear / Reset

Define incarnation semantics for clear/reset.

Clearing active authored data ends the currently active source graph.

Subsequent newly created/default sources must receive new lifetimes.

The architecture does not need to retain retired incarnation records merely to know they once existed.

---

# 40. Default / Seeded Sources

Audit current default/bootstrap source creation.

Determine whether default or seeded authored sources are:

* ordinary newly created active sources requiring incarnation;
* deterministic fixtures;
* demo-only data;
* another category.

This determination must respect the earlier Phase 2 seeded-store authority work.

Do not reintroduce unconditional authoritative demo seeding.

---

# 41. Determinism Boundary

Scheduling generation must remain deterministic for equivalent authoritative inputs.

Incarnation itself need not be deterministic if it is opaque lifetime identity.

The result must distinguish:

* deterministic scheduling behavior;
* stable persisted lifetime identity;
* deterministic regeneration of occurrence coordinates;
* potentially nondeterministic creation of new incarnation tokens.

Do not require deterministic incarnation generation merely to preserve deterministic schedule output.

---

# 42. Equality Contract

Define the future equality rules.

At minimum:

## Same authored lifetime

Same source scope, source ID, and incarnation.

## Different authored lifetime

Different incarnation even if source ID/content are equal.

## Runtime occurrence equality

Remains governed by `OccurrenceIdentity` V1 for current runtime purposes.

## Future durable occurrence equality

Must incorporate lifetime-safe source identity.

Document these separately.

---

# 43. Security / Privacy Assessment

Determine whether the chosen incarnation representation introduces any meaningful privacy or security concern.

For example, avoid encoding:

* timestamps unnecessarily;
* user identifiers;
* device identifiers;
* account information;
* semantic source content.

Prefer opaque non-sensitive identity.

Do not add telemetry or account coupling.

---

# 44. Compatibility Requirements

The architectural contract must preserve DayFrame's established durable-data principles.

At minimum:

* existing durable data must not be silently discarded;
* unknown future versions must not be interpreted as known schemas;
* migration must be explicit;
* serialization failure must not masquerade as durable success;
* runtime authority and durability status remain distinct;
* old artifacts must not be credited with identity information they never stored;
* newly written incarnation-bearing data must have an explicit format contract.

---

# 45. Required Decision Artifact

If the investigation reaches a complete architectural determination, create an ADR or equivalent governance artifact under the repository's established architecture/ADR convention.

The decision artifact should define:

* source-incarnation semantics;
* token requirements;
* source scopes;
* allocation/preservation rules;
* active format evolution;
* profile semantics;
* backup semantics;
* restore versus instantiate;
* migration baseline semantics;
* migration atomicity;
* failure behavior;
* compatibility requirements;
* relationship to future durable occurrence references.

Do not modify the existing Phase 1 durable-data ADR unless a correction is genuinely required.

Prefer a new decision that builds upon it.

---

# 46. No Production Format Change

This task is complete at the architectural-contract level.

Do **not**:

* increment production durable format versions;
* modify serializers;
* modify persistence writers;
* migrate local storage;
* add incarnation to authored types;
* add incarnation to profiles;
* add incarnation to backups;
* generate incarnation at runtime;
* change profile load behavior;
* change backup import behavior.

Those belong to subsequent implementation tasks.

---

# 47. Required Test Assessment

Because this is primarily an architectural-definition task, production tests need not change unless investigation requires a narrowly scoped evidence test.

The result must nevertheless identify the tests required for future implementation, including at minimum:

* new-source incarnation allocation;
* update preservation;
* delete/recreate change;
* same-ID lifetime separation;
* nested parent recreation;
* active rehydration preservation;
* legacy active migration;
* migration failure;
* profile repeated-instantiation behavior;
* backup restore preservation;
* legacy backup conversion;
* serialization failure;
* unknown-version rejection;
* no incarnation leakage into `OccurrenceIdentity` V1.

Do not implement these future behavior tests unless production behavior is authorized.

---

# 48. Evidence Standard

Classify findings as:

* **Confirmed** — directly supported by executable code/tests or governing artifacts;
* **Architectural determination** — explicitly decided by this task;
* **Inferred** — strongly suggested but not directly established;
* **Not found** — searched for and absent;
* **Unresolved** — cannot be defensibly decided without another prerequisite.

For durable compatibility claims, prefer executable serializer/parser/version evidence over comments or names.

---

# 49. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.26_DEFINE_DURABLE_SOURCE_INCARNATION_DATA_MODEL_AND_VERSIONED_FORMAT_EVOLUTION_CONTRACT_RESULT.md`

The result must include at least:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Current Durable-Surface Inventory
5. Current Versioning Inventory
6. Lifetime-Bearing Source Inventory
7. Source Scope Matrix
8. Source-Incarnation Definition
9. Incarnation Token Requirements
10. Token Representation Decision
11. Allocation Authority
12. Update Preservation
13. Creation Semantics
14. Delete/Recreate Semantics
15. Replacement Semantics
16. Nested Source Identity
17. Parent Recreation Semantics
18. Active Durable Format Decision
19. Profile Durable Format Decision
20. Profile Instantiation Semantics
21. Backup Durable Format Decision
22. Restore Versus Instantiate
23. V1 Backup Compatibility
24. Active Rehydration
25. Legacy Active Migration
26. Migration Baseline Semantics
27. Migration Atomicity
28. Migration Failure Semantics
29. Profile Migration
30. Backup Compatibility
31. Independent Versioning Decision
32. `DayFrameAuthoredSetup` Assessment
33. Validation Contract
34. Clone/Snapshot Contract
35. `OccurrenceIdentity` Relationship
36. DurableOccurrenceReference Readiness
37. PlanDecision Readiness
38. Deletion/Tombstone Assessment
39. History Assessment
40. Clear/Reset Semantics
41. Default/Bootstrap Source Assessment
42. Determinism Assessment
43. Equality Contract
44. Security/Privacy Assessment
45. Compatibility Assessment
46. Required Governance Artifact
47. Future Implementation Test Matrix
48. Architectural Alignment Assessment
49. Deviations
50. Discoveries and Deferred Work
51. Recommended Next Task
52. Validation
53. Final Completion Determination

---

# 50. Required Matrices

The result must include at least the following explicit matrices.

## A. Source Scope Matrix

For every lifetime-bearing source:

| Source kind | Source ID | Scope | Parent lifetime relevant? | Incarnation required? |
| ----------- | --------- | ----- | ------------------------- | --------------------- |

## B. Lifecycle / Incarnation Matrix

| Operation                | Preserve incarnation | Allocate incarnation | Retire prior lifetime |
| ------------------------ | -------------------: | -------------------: | --------------------: |
| update                   |                      |                      |                       |
| create                   |                      |                      |                       |
| delete                   |                      |                      |                       |
| delete/recreate          |                      |                      |                       |
| replace                  |                      |                      |                       |
| profile activation       |                      |                      |                       |
| active rehydration       |                      |                      |                       |
| recovery restore         |                      |                      |                       |
| legacy import/conversion |                      |                      |                       |

Populate from architectural determinations.

## C. Durable Surface Matrix

| Durable surface | Current version | Incarnation-bearing version | Preserve lifetime? | Instantiate lifetime? | Migration required? |
| --------------- | --------------- | --------------------------- | -----------------: | --------------------: | ------------------: |

## D. Compatibility Matrix

Cover at minimum:

* old active → new runtime;
* new active → new runtime;
* old profile → new runtime;
* new profile → new runtime;
* V1 backup → new runtime;
* future incarnation backup → new runtime;
* unknown future version.

## E. Failure Matrix

Cover:

* parse failure;
* validation failure;
* migration construction failure;
* incarnation allocation failure;
* serialization failure;
* storage-access failure;
* durable-write failure.

---

# 51. Validation

Run repository-standard validation sufficient to demonstrate that the investigation/governance task did not accidentally alter executable behavior.

At minimum:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

If no executable files are changed, report that fact.

If an ADR or documentation artifact is added, verify its repository path and integrity.

Record exact final test-file/test-count results.

---

# 52. Completion Criteria

Task 2.26 is complete only when:

* every lifetime-bearing source kind has an explicit durable incarnation contract;
* source scope is defined;
* nested parent-lifetime semantics are defined;
* incarnation meaning is precise;
* token requirements and representation are decided;
* allocation and preservation rules are explicit;
* delete/recreate semantics are explicit;
* active durable format evolution is defined;
* profile representation and instantiation semantics are defined;
* backup representation and restore semantics are defined;
* V1 backup behavior is defined;
* active rehydration behavior is defined;
* legacy active migration semantics are defined;
* migration atomicity is defined;
* migration failure behavior is defined;
* independent active/profile/backup versioning is decided;
* validation rules are defined;
* compatibility behavior is defined;
* `OccurrenceIdentity` V1 remains unchanged;
* DurableOccurrenceReference remains unimplemented;
* PlanDecision persistence remains unimplemented;
* no production durable format is changed;
* a governance artifact is created if the determination is complete;
* future implementation tests are enumerated;
* repository validation passes;
* the result artifact is complete.

---

# 53. Explicit Non-Goals

Do **not**:

* add incarnation fields to production types;
* implement incarnation generation;
* choose implementation convenience over durable semantics;
* increment live format versions;
* write migrations;
* rewrite local storage;
* modify current persisted user data;
* modify profile payloads;
* modify backup payloads;
* implement recovery restoration changes;
* implement profile-instantiation changes;
* modify `OccurrenceIdentity` V1;
* implement `DurableOccurrenceReference`;
* persist PlanDecisions;
* implement PlanDecision replay;
* add tombstones;
* add durable source history;
* redesign readable source IDs;
* prohibit ID reuse as a substitute for incarnation;
* redesign Setup;
* redesign Preview;
* modify scheduling-engine semantics;
* conflate profile instantiation with recovery restoration.

---

# 54. Stop Conditions

Stop and report rather than inventing policy if:

* the Phase 1 durable-data governance contract is incompatible with the required incarnation evolution;
* current active persistence has no defensible version boundary for migration;
* profile artifacts cannot be distinguished from active-state restoration under current contracts;
* backup semantics are too ambiguous to decide restore versus instantiate safely;
* nested source scope cannot support lifetime-safe identity without revisiting Task 2.24 assumptions;
* an incarnation token cannot be represented without changing unrelated scheduling semantics;
* current compatibility behavior would require destructive migration;
* the required migration cannot satisfy existing durability-failure authority;
* implementation changes become necessary to answer a supposedly architectural question.

Recommend the narrowest prerequisite rather than broadening Task 2.26.

---

# 55. Recommended Follow-On Boundary

If Task 2.26 completes without exposing another prerequisite, the next task should implement the **first incarnation-bearing authoritative data model and active durable-format migration** according to the approved contract.

Profile and backup implementation may be combined with that task only if the approved governance decision demonstrates they must evolve atomically.

Otherwise, sequence the implementation by durable surface to keep migrations narrow and independently verifiable.

Do not begin DurableOccurrenceReference or PlanDecision persistence until incarnation-bearing source identity is implemented and migration-tested.

---

# 56. Task Determination

**Authorized:** investigation and architectural/governance determination of source-incarnation representation, source scope, lifecycle allocation semantics, active/profile/backup format evolution, restore-versus-instantiate behavior, migration semantics, failure semantics, validation, compatibility, and future implementation requirements.

**Not authorized:** production incarnation fields, token generation, persistence-format changes, migrations, durable occurrence references, PlanDecision persistence, scheduling changes, or source-history infrastructure.

The task should prefer explicit durable semantics over implementation convenience.

Where legacy artifacts lack sufficient information to establish historical identity, DayFrame must acknowledge that limitation and establish a forward-safe baseline rather than fabricate continuity.

---

# 57. Final Completion Statement

**Task 2.26 is complete when DayFrame has an explicit, versioned, implementation-ready durable source-incarnation contract covering every lifetime-bearing authored source, nested lifetime scope, incarnation allocation and preservation, active persistence, profile instantiation, backup restoration, legacy migration, failure atomicity, validation, and compatibility—without changing production durable formats or implementing incarnation, DurableOccurrenceReference, or PlanDecision persistence.**
