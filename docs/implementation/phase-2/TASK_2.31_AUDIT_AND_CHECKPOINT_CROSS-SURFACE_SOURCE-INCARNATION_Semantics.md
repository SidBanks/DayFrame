# Task 2.31 — Audit and Checkpoint Cross-Surface Source-Incarnation Semantics

## Status

Ready for investigation and checkpoint.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Cross-surface architectural audit, evidence review, and checkpoint task.

Task 2.31 does not introduce new source-incarnation behavior.

It verifies that the source-incarnation system established across Tasks 2.24–2.30 is coherent, complete, non-contradictory, and safe enough for downstream durable occurrence references to depend upon.

No implementation changes are authorized unless the audit discovers a narrowly scoped correctness defect that must be fixed before the checkpoint can be truthfully created.

Any such defect must first be documented and, if non-trivial, assigned to a separate corrective task.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before investigation:

1. verify that the saved project copy exists;
2. verify that the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify completed result artifacts for Tasks 2.24 through 2.30;
6. do not modify this task specification during execution.

Execution findings must be recorded separately in:

`TASK_2.31_AUDIT_AND_CHECKPOINT_CROSS_SURFACE_SOURCE_INCARNATION_SEMANTICS_RESULT.md`

If the audit finds a correctness defect or architectural contradiction, do not silently repair the conclusion. Record it explicitly and determine whether checkpoint publication must be blocked.

---

# 2. Purpose

Tasks 2.24 through 2.30 established a layered source-lifetime architecture.

The sequence now includes:

* source-incarnation semantics;
* explicit source lifecycle-operation authority;
* durable format governance;
* mandatory active incarnation;
* Active V2;
* Profile V2;
* Profile V2 quarantine/recovery;
* Backup V2;
* historical V1 compatibility.

The resulting model is intentionally asymmetric across surfaces:

```text
Active V2
    → preserve same source lifetimes

Profile V2
    → preserve reusable pattern
    → instantiate fresh source lifetimes

Backup V1
    → no incarnation evidence
    → instantiate fresh source lifetimes

Backup V2
    → preserve exact source lifetimes
```

Task 2.31 must prove that these semantics remain consistent end to end and that no unsupported path accidentally:

* preserves a lifetime that should be fresh;
* rotates a lifetime that should be preserved;
* loses incarnation;
* fabricates historical continuity;
* permits V1 resurrection;
* bypasses protected recovery;
* couples durable surfaces incorrectly;
* allows scheduling behavior to depend on incarnation;
* permits current runtime sources without incarnation.

Only after this audit is clean should `DurableOccurrenceReference` be allowed to depend on source incarnation.

---

# 3. Governing Evidence

The audit must review and reconcile the completed work from:

* Task 2.24 — source-incarnation and lifetime-safe reference semantics;
* Task 2.25 — explicit source creation/update/deletion/replacement authority;
* Task 2.26 — durable source-incarnation data model and format evolution contract;
* Task 2.27 — Active V2 implementation;
* Task 2.27A — Active V2 completion and validation;
* Task 2.28 — Profile V2;
* Task 2.29 — Profile V2 recovery;
* Task 2.30 — Backup V2.

Also review:

* the source-incarnation ADR;
* the Phase 1 durable-data compatibility/versioning ADR;
* Active V2 implementation/tests;
* Profile V2 implementation/tests;
* Backup V1/V2 implementation/tests;
* active/profile durability and recovery infrastructure;
* lifecycle-operation code;
* current authored validators;
* occurrence identity implementation;
* scheduling-generation tests.

Do not rely only on task-result prose.

Executable evidence remains authoritative for actual behavior.

---

# 4. Architectural Objective

At the end of Task 2.31, DayFrame should be able to answer, for every supported transition:

> Is this the same source lifetime or a new source lifetime?

and justify that answer with executable evidence.

The audit must establish a complete lifecycle-transition model such as:

```text
Create
    → new lifetime

Update
    → same lifetime

Delete/Recreate
    → new lifetime

Restart / Active V2 rehydrate
    → same lifetime

Profile save
    → no active lifetime change

Profile activation
    → new lifetimes

Backup V1 import
    → new lifetimes

Backup V2 restore
    → same lifetimes

Active V1 migration
    → new forward baseline

Clear
    → current lifetimes retired

Protected-source recovery replacement
    → preserve current accepted lifetime graph

Protected-source abandonment
    → retire active authority

Persistence retry
    → same current lifetime graph
```

Every transition must be evidence-backed.

---

# 5. No New Architecture By Default

Task 2.31 is primarily an audit.

Do not:

* introduce new source-incarnation fields;
* change UUID semantics;
* add new durable formats;
* add new storage keys;
* redesign Active V2;
* redesign Profile V2;
* redesign Backup V2;
* add `DurableOccurrenceReference`;
* add PlanDecision;
* modify scheduling;
* modify `OccurrenceIdentity` V1.

If a defect is found, classify and isolate it.

---

# 6. Required Initial Repository State

Record before audit:

* `git status --short`;
* current branch;
* relevant uncommitted work;
* latest full test count;
* latest test-file count;
* lint/typecheck/build state;
* current durable keys/version constants.

If the worktree contains cumulative Phase 2 changes, distinguish them from Task 2.31 artifacts.

---

# 7. Source Kinds In Scope

Audit all seven lifetime-bearing source kinds:

1. shift definition;
2. shift cycle;
3. shift segment;
4. shift sequence entry;
5. block template;
6. block recurrence;
7. manual event.

For each, trace:

* creation;
* update;
* deletion;
* delete/recreate;
* replacement;
* active persistence;
* active rehydrate;
* profile save;
* profile activation;
* Backup V1 import;
* Backup V2 export/restore.

---

# 8. Source Scope Audit

Confirm current source-ID scope and lifetime scope for every source kind.

At minimum document:

| Source kind | Readable ID scope | Incarnation scope | Parent lifetime relevant? |
| ----------- | ----------------- | ----------------- | ------------------------- |

Pay particular attention to:

* segment scope;
* sequence-entry scope;
* parent cycle lifetime;
* nested reused IDs across recreated cycles.

---

# 9. Incarnation Type Audit

Confirm:

* current active runtime requires incarnation statically;
* incarnation uses accepted `SourceIncarnationId`;
* canonical lowercase UUID-v4 validation remains enforced;
* no optional current-runtime incarnation remains;
* no current-authority fallback generates incarnation silently.

Search production code for:

* optional incarnation access;
* nullish fallback;
* unsafe casts;
* arbitrary string construction.

---

# 10. Allocation Authority Audit

Trace every production source creation path.

Confirm that fresh incarnation is allocated only where appropriate and by the authoritative boundary.

Audit:

* Setup create;
* synthesized recurrence creation;
* cycle sequence creation;
* manual-event create;
* profile activation;
* Backup V1 import;
* Active V1 migration.

Confirm no Backup V2 restore allocates incarnation.

---

# 11. Update Preservation Audit

For each source kind, confirm ordinary update preserves exact incarnation.

Audit:

* top-level edits;
* nested edits;
* reorder;
* assignment changes;
* recurrence changes;
* manual-event update.

Confirm no incidental change rotates incarnation.

---

# 12. Delete/Recreate Audit

For each source kind where applicable, confirm:

```text
old ID X / incarnation A
delete
create ID X
→ incarnation B
A != B
```

Pay particular attention to same-draft Setup delete/recreate.

---

# 13. Replace Audit

Confirm explicit replacement semantics remain distinct from update.

Where replacement is supported:

* prior lifetime ends;
* replacement gets fresh incarnation.

If no production replacement exists for a source kind, document N/A rather than inferring.

---

# 14. Nested Parent-Recreation Audit

Confirm:

* recreated cycle gets new incarnation;
* recreated nested segment gets new incarnation;
* recreated sequence entry gets new incarnation;
* reused nested IDs do not imply continuity.

Document whether parent-cycle incarnation is sufficient to distinguish nested lineage even if a nested token collision were theoretically possible.

---

# 15. Active V2 Audit

Confirm Active V2 remains:

* current active durable authority;
* incarnation-bearing;
* plural-only;
* exact-lifetime rehydration surface.

Audit:

* key;
* marker;
* envelope;
* writer;
* reader;
* validation;
* retry;
* clear;
* protected ingress.

---

# 16. Active V2 Rehydration Audit

Prove:

* valid V2 restores exact incarnation;
* no allocator invoked;
* V1 is ignored once V2 authority exists;
* invalid V2 does not silently fall back;
* unsupported V2 does not silently fall back.

---

# 17. Active V1 Migration Audit

Confirm V1 migration semantics:

```text
Active V1
    no incarnation
        ↓
migration
        ↓
fresh forward baseline
        ↓
Active V2
```

Confirm:

* baseline is not claimed as historical identity;
* V2 adoption occurs only after durable verification;
* retained V1 cannot later resurrect automatically.

---

# 18. Active V1 Resurrection Audit

Trace:

* migrate V1 → V2;
* clear;
* restart.

Confirm old V1 does not reappear.

Also trace:

* protected abandonment;
* restart.

Confirm abandoned state does not reappear.

---

# 19. Active Durability Audit

Confirm distinction remains intact:

## Migration

V2 runtime not adopted before durable verification.

## Ordinary current mutation

Runtime may advance while durability fails.

Audit retry semantics and desired durable condition.

---

# 20. Active Protected-Ingress Audit

Confirm:

* protected invalid/unknown V2 blocks ordinary overwrite;
* source recheck protects destructive recovery;
* Backup V2 restore does not bypass protected-active recovery;
* active recovery replacement/abandonment remains source-safe.

---

# 21. Profile V2 Audit

Confirm Profile V2 remains:

* current profile authority;
* independently versioned;
* incarnation-free;
* reusable pattern;
* plural-only;
* separate from Active V2.

---

# 22. Profile Save Audit

Confirm saving a profile:

* projects active authority to pattern;
* removes incarnation;
* does not rotate active incarnation;
* does not alter Preview;
* does not alter Active V2.

---

# 23. Profile Activation Audit

Confirm profile activation:

* validates pattern;
* allocates fresh incarnation for all seven source kinds;
* preserves readable IDs/relationships;
* replaces active authored state;
* clears Preview;
* persists Active V2.

---

# 24. Repeated Profile Activation Audit

Prove same profile loaded twice yields:

* equivalent pattern;
* disjoint incarnation sets.

Document direct evidence.

---

# 25. Profile V1 Migration Audit

Confirm:

* Profile V1 remains reader only;
* migration does not allocate active incarnation;
* Profile V2 remains incarnation-free;
* historical singular cycles normalize correctly;
* invalid entries are preserved non-destructively.

---

# 26. Profile Quarantine Audit

Confirm:

* quarantine is part of valid Profile V2 authority;
* valid profiles remain usable;
* save/delete/retry preserve quarantine;
* per-entry export/removal works;
* removal does not alter active state;
* whole-source protection is distinct from quarantine.

---

# 27. Profile Protected-Ingress Audit

Confirm:

* ordinary save/delete blocked;
* raw export available;
* source recheck works;
* replacement/abandonment require explicit authority;
* sourceChanged prevents stale destructive action;
* V1 never silently regains authority.

---

# 28. Profile Clear / Empty Authority Audit

Confirm:

* valid empty Profile V2 remains authoritative;
* retained V1 cannot resurrect;
* clear removes governed profile authority and remains restart-safe.

---

# 29. Backup V1 Audit

Confirm Backup V1 remains:

* supported reader;
* no production writer;
* incarnation-free;
* legacy singular compatible;
* fresh-lifetime import.

---

# 30. Backup V1 Import Audit

Prove repeated import of identical V1:

* preserves readable IDs;
* produces different incarnation sets;
* clears Preview;
* preserves profiles;
* persists Active V2.

---

# 31. Backup V2 Audit

Confirm Backup V2 remains:

* current production backup writer;
* independently versioned;
* incarnation-bearing;
* plural-only;
* exact-lifetime recovery artifact.

---

# 32. Backup V2 Export Audit

Confirm export:

* includes exact incarnation;
* is pure;
* excludes Preview;
* excludes profiles/quarantine;
* excludes durability/ingress state;
* excludes lifecycle operations;
* excludes PlanDecision.

---

# 33. Backup V2 Restore Audit

Prove:

* exact incarnation restored;
* no allocator used;
* repeated restore restores same incarnation;
* active state replaced;
* Preview cleared;
* profiles/quarantine preserved;
* Active V2 persisted.

---

# 34. Backup V2 Restore Failure Audit

Confirm before acceptance:

* parse failure;
* unsupported version;
* validation failure;
* incarnation failure;
* protected-active ingress;

all leave active state unchanged.

After valid acceptance with persistence failure:

* restored runtime remains authority;
* durability reports failure;
* retry persists exact restored graph.

---

# 35. Cross-Surface Envelope Audit

Confirm:

* Active V2 cannot be parsed as Profile V2;
* Active V2 cannot be parsed as Backup V2;
* Profile V2 cannot be parsed as Backup V2;
* Backup V2 cannot be parsed as Active V2.

Surface identity must remain meaningful.

---

# 36. Cross-Surface Lifetime Matrix

Produce a definitive matrix:

| Transition          | Same lifetime? | Fresh lifetime? | Evidence |
| ------------------- | -------------: | --------------: | -------- |
| Active V2 rehydrate |                |                 |          |
| Active V1 migrate   |                |                 |          |
| profile save        |                |                 |          |
| profile load        |                |                 |          |
| Profile V1 migrate  |                |                 |          |
| Backup V1 import    |                |                 |          |
| Backup V2 restore   |                |                 |          |
| update              |                |                 |          |
| delete/recreate     |                |                 |          |
| retry               |                |                 |          |
| clear/recreate      |                |                 |          |

This matrix is a primary deliverable.

---

# 37. Seven-Source Transition Matrix

Produce a matrix for all seven source kinds across:

* create;
* update;
* delete/recreate;
* Active V2 rehydrate;
* profile load;
* Backup V1 import;
* Backup V2 restore.

Each cell must indicate:

* preserve;
* fresh;
* N/A.

---

# 38. Durable Surface Authority Matrix

Produce:

| Surface | Version | Current writer | Historical reader | Incarnation | Authority meaning |
| ------- | ------: | -------------: | ----------------: | ----------: | ----------------- |

Cover:

* Active V1;
* Active V2;
* Profile V1;
* Profile V2;
* Backup V1;
* Backup V2.

---

# 39. Writer Audit

Search production writers.

Confirm:

* Active current writer → V2 only;
* Profile current writer → V2 only;
* Backup current export writer → V2 only.

Historical V1 writers must be absent from normal production flows.

Compatibility fixture creators may remain.

---

# 40. Reader Audit

Confirm historical readers remain supported according to governance:

* Active V1;
* Profile V1;
* Backup V1.

Document current compatibility boundaries.

---

# 41. Validator Audit

Confirm validators correctly distinguish:

* current incarnation-bearing active authority;
* incarnation-free reusable pattern;
* Backup V1;
* Backup V2;
* malformed incarnation;
* duplicate incarnation;
* surface mismatch;
* unsupported versions.

No generic validator should blur semantic surfaces.

---

# 42. Clone / Snapshot Audit

Confirm incarnation survives all current authority clone boundaries:

* store snapshots;
* active DTO cloning;
* Active V2 rehydrate;
* Backup V2 restore;
* mutation results.

Confirm profile pattern clones remain incarnation-free.

---

# 43. Persistence Failure Audit

Trace lifetime identity through:

* Active V2 write failure;
* Retry;
* Profile V2 write failure;
* profile Retry;
* Backup V2 restore + Active V2 write failure.

Confirm no retry rotates or re-instantiates identity accidentally.

---

# 44. Clear / Reset Audit

Trace:

```text
active lifetime graph
    ↓
clear
    ↓
empty current authority
    ↓
new source creation
    ↓
fresh incarnation
```

Confirm retained historical V1 material cannot resurrect.

---

# 45. Recovery Replacement Audit

Confirm active recovery replacement preserves current runtime incarnation rather than allocating fresh identity.

It is recovery of the accepted current graph, not profile-like instantiation.

---

# 46. Recovery Abandonment Audit

Confirm abandonment:

* retires active authority;
* does not retain hidden current incarnation;
* does not allow V1 resurrection;
* next creation gets fresh lifetime.

---

# 47. Profile Recovery Independence Audit

Confirm profile recovery operations never alter:

* active authored state;
* active incarnation;
* Preview;
* Active V2.

---

# 48. Backup/Profile Independence Audit

Confirm Backup V2 restore preserves Profile V2:

* valid profiles;
* quarantine;
* profile protection/durability where applicable.

No cross-surface coupling.

---

# 49. Scheduling Non-Interference Audit

Confirm source incarnation remains scheduling-neutral.

Use existing tests and, if needed, add investigation-only comparison evidence.

Equivalent scheduling inputs with different incarnation must yield equivalent scheduling output.

No production scheduling change is authorized.

---

# 50. `OccurrenceIdentity` V1 Audit

Confirm:

* version remains 1;
* no incarnation field;
* same scheduling occurrence produces same V1 identity regardless of source incarnation;
* runtime identity remains non-durable.

This is critical before authorizing durable occurrence references.

---

# 51. DurableOccurrenceReference Readiness Question

Task 2.31 must answer:

> Is source-incarnation behavior now sufficiently stable, complete, and durable across all supported surfaces that a future DurableOccurrenceReference can safely depend on it?

Possible determinations:

* **Ready**
* **Ready with explicit constraints**
* **Not ready — corrective work required**

Do not implement the reference.

---

# 52. Source Lifetime Equality Contract

Reaffirm or revise only if evidence requires:

```text
same lifetime
    = same source scope
    + same readable source ID
    + same incarnation
```

For nested source durable lineage, confirm parent lifetime participation remains required.

---

# 53. Incarnation Collision Audit

Confirm global active-graph uniqueness remains validated.

Review tests for:

* same-kind duplicate;
* cross-kind duplicate;
* parent/nested duplicate;
* nested/nested duplicate.

No new collision registry required.

---

# 54. Incarnation Rotation Audit

Search production code for any path that regenerates incarnation during:

* rehydrate;
* retry;
* restore;
* profile save;
* export;
* clone.

Any such path is suspect and must be documented.

---

# 55. Incarnation Preservation Audit

Search for paths that copy prior incarnation during:

* create;
* profile activation;
* Backup V1 import;
* delete/recreate.

Any such path is suspect.

---

# 56. Optional Incarnation Audit

Search production code for:

* `incarnationId?`;
* `incarnationId ??`;
* conditional current serialization.

Confirm optional handling exists only at explicit historical/raw boundaries.

---

# 57. Allocator Audit

Search all allocator calls.

Classify each as:

* correct fresh-lifetime creation;
* migration baseline;
* profile instantiation;
* Backup V1 instantiation;
* test-only.

No allocator call should appear in:

* Active V2 rehydrate;
* Backup V2 restore;
* retry;
* clone;
* profile save.

---

# 58. Source-Operation Audit

Confirm Task 2.25 provenance remains the authority for ordinary lifecycle semantics.

No later task should have reintroduced snapshot inference.

---

# 59. Snapshot Setter Audit

Review retained low-level snapshot setters.

Confirm they:

* require complete incarnation-bearing current authority;
* do not claim lifecycle provenance;
* are not used by production interactive authoring to infer create/update semantics.

---

# 60. Protected-State Audit

Audit interaction of incarnation with protected states.

Confirm protected ingress never fabricates or silently rotates lifetime identity.

---

# 61. Unknown-Version Audit

For Active/Profile/Backup:

* unknown current-local versions are protected;
* unknown backup versions are rejected;
* no silent reinterpretation.

Document distinctions.

---

# 62. Migration Baseline Epistemic Audit

Reaffirm:

> Active V1 migration establishes a forward-safe lifetime baseline.

It does not reconstruct historic lifetime identity.

Likewise:

> Backup V1 import creates a fresh current lifetime.

Do not let later docs/UI imply otherwise.

---

# 63. Profile Epistemic Audit

Reaffirm:

> Profile V2 preserves pattern, not lifetime.

Confirm no runtime/profile DTO now accidentally stores incarnation.

---

# 64. Backup Epistemic Audit

Reaffirm:

> Backup V2 can truthfully claim lifetime continuity because it stores incarnation.

Confirm V1/V2 UI feedback does not blur this distinction.

---

# 65. Checkpoint Decision

If the audit is clean, create:

`docs/checkpoints/CHECKPOINT_Phase_2_Cross_Surface_Source_Incarnation_Semantics.md`

The checkpoint should summarize:

* governing architecture;
* source-lifetime definition;
* seven source kinds;
* lifecycle semantics;
* Active/Profile/Backup surface semantics;
* V1 compatibility;
* migration/restore/instantiate distinction;
* protected recovery;
* anti-resurrection;
* scheduling neutrality;
* `OccurrenceIdentity` separation;
* durable-reference readiness;
* validation baseline.

Do not create the checkpoint if unresolved correctness defects remain.

---

# 66. Checkpoint Scope

The checkpoint is not a replacement for:

* ADRs;
* task results;
* full architecture specification.

It records the stable implementation milestone reached by Tasks 2.24–2.30.

---

# 67. Governance Updates

If existing repository practice requires it, update:

* `docs/architecture/CURRENT_STATE.md`;
* `docs/architecture/CHANGELOG.md`;
* `docs/architecture/DECISIONS.md`;

only to record the accepted checkpoint/status.

Do not revise architectural semantics unless the audit produced an approved correction.

---

# 68. Checkpoint Validation Baseline

The checkpoint must record exact final:

* test-file count;
* test count;
* lint status;
* typecheck status;
* build status;
* `git diff --check`.

Use the final completed-tree results.

---

# 69. No Publication If Failing

Do not publish a clean checkpoint if:

* full tests fail;
* a lifetime transition remains ambiguous;
* V1 resurrection remains possible;
* current writer audit finds V1 output;
* Backup V2 restore allocates identity;
* Profile V2 stores identity;
* current runtime allows missing incarnation;
* `OccurrenceIdentity` has become incarnation-coupled.

Instead recommend corrective work.

---

# 70. Required Evidence Classification

Use:

* **Confirmed**
* **Inferred**
* **Not found**
* **Mismatch**
* **Unresolved**
* **Ready**
* **Blocked**

For deterministic/lifetime claims, executable tests are preferred.

---

# 71. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.31_AUDIT_AND_CHECKPOINT_CROSS_SURFACE_SOURCE_INCARNATION_SEMANTICS_RESULT.md`

The result must include at least:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Repository Baseline
5. Source-Kind Inventory
6. Source-Scope Audit
7. Incarnation Type Audit
8. Allocation Authority Audit
9. Update Preservation Audit
10. Delete/Recreate Audit
11. Replacement Audit
12. Nested Parent-Recreation Audit
13. Active V2 Audit
14. Active V2 Rehydration
15. Active V1 Migration
16. V1 Resurrection Prevention
17. Active Durability
18. Active Protected Ingress
19. Profile V2 Audit
20. Profile Save
21. Profile Activation
22. Repeated Profile Activation
23. Profile V1 Migration
24. Profile Quarantine
25. Profile Protected Ingress
26. Profile Empty/Clear Authority
27. Backup V1 Audit
28. Backup V1 Import
29. Backup V2 Audit
30. Backup V2 Export
31. Backup V2 Restore
32. Backup V2 Failure Semantics
33. Cross-Surface Envelope Audit
34. Cross-Surface Lifetime Matrix
35. Seven-Source Transition Matrix
36. Durable Surface Authority Matrix
37. Writer Audit
38. Reader Audit
39. Validator Audit
40. Clone/Snapshot Audit
41. Persistence Failure Audit
42. Clear/Reset Audit
43. Recovery Replacement Audit
44. Recovery Abandonment Audit
45. Profile Recovery Independence
46. Backup/Profile Independence
47. Scheduling Non-Interference
48. OccurrenceIdentity V1 Audit
49. Source Lifetime Equality Contract
50. Collision Audit
51. Incarnation Rotation Audit
52. Incarnation Preservation Audit
53. Optional Incarnation Audit
54. Allocator Audit
55. Source-Operation Audit
56. Snapshot Setter Audit
57. Protected-State Audit
58. Unknown-Version Audit
59. Migration Baseline Epistemic Audit
60. Profile Epistemic Audit
61. Backup Epistemic Audit
62. DurableOccurrenceReference Readiness
63. Architectural Alignment Assessment
64. Correctness Defects, if any
65. Required Corrective Work, if any
66. Checkpoint Determination
67. Checkpoint Artifact
68. Governance Updates
69. Recommended Next Task
70. Deviations
71. Discoveries and Deferred Work
72. Validation
73. Final Completion Determination

---

# 72. Required Matrices

## A. Cross-Surface Lifetime Matrix

| Transition | Same lifetime | Fresh lifetime | No lifetime effect | Evidence |
| ---------- | ------------: | -------------: | -----------------: | -------- |

## B. Seven-Source Transition Matrix

| Source kind | Create | Update | Delete/Recreate | Active rehydrate | Profile load | Backup V1 import | Backup V2 restore |
| ----------- | ------ | ------ | --------------- | ---------------- | ------------ | ---------------- | ----------------- |

## C. Durable Surface Authority Matrix

| Surface | Version | Incarnation | Current writer | Reader | Semantics |
| ------- | ------: | ----------: | -------------: | -----: | --------- |

## D. Allocator Call Matrix

| Call site | Why allocation occurs | Correct? |
| --------- | --------------------- | -------: |

## E. Protected-Recovery Matrix

| Surface | Protected condition | Ordinary writes blocked? | Explicit recovery | Source recheck? |
| ------- | ------------------- | -----------------------: | ----------------- | --------------: |

## F. Epistemic Claim Matrix

| Operation/artifact | What DayFrame may truthfully claim about lifetime |
| ------------------ | ------------------------------------------------- |

---

# 73. Test Coverage Assessment

Audit direct coverage for:

* all seven source lifecycle kinds;
* Active V1 migration;
* Active V2 stable rehydrate;
* profile repeated activation;
* Backup V1 repeated import;
* Backup V2 repeated restore;
* parent/nested recreation;
* anti-resurrection;
* protected recovery;
* persistence failure/retry;
* scheduling non-interference;
* occurrence identity independence.

Identify any missing critical contract even if the full suite is green.

---

# 74. Investigation-Only Test Additions

Because this is an audit, do not add production behavior.

A narrowly scoped regression test may be added only if:

* existing behavior is already correct;
* the test proves a required invariant not otherwise covered;
* no architecture changes are needed.

Document every added test.

---

# 75. Reference Search Requirements

Search production code for at minimum:

* `incarnationId`;
* `SourceIncarnationId`;
* allocator function;
* Active V1 key;
* Active V2 key;
* Profile V1 key;
* Profile V2 key;
* Backup V1 creator;
* Backup V2 creator;
* `projectActiveToPattern`;
* active instantiation helpers;
* backup restore;
* profile load;
* active/profile Retry;
* clear;
* protected recovery actions.

---

# 76. Full Validation

Run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Record exact counts.

No checkpoint publication unless all required validation passes.

---

# 77. Architectural Alignment Assessment

Assess the completed source-incarnation system against:

* explicit authority;
* provenance;
* historical compatibility;
* deterministic planning;
* explainability;
* durable user-data preservation;
* recovery safety;
* surface separation;
* epistemic integrity.

Use:

* Aligned
* Partially aligned
* Misaligned
* Unresolved

---

# 78. DurableOccurrenceReference Readiness Criteria

The system may be declared **Ready** only if all are true:

1. current active sources always have incarnation;
2. source lifecycle operations are explicit;
3. same-ID recreation produces fresh incarnation;
4. Active V2 preserves same lifetimes;
5. Profile V2 creates fresh lifetimes;
6. Backup V1 creates fresh lifetimes;
7. Backup V2 preserves same lifetimes;
8. retries never rotate lifetime;
9. clear/abandon cannot resurrect V1;
10. protected recovery cannot silently overwrite;
11. parent/nested lifetime semantics are unambiguous;
12. validators enforce incarnation integrity;
13. current writers use only current versions;
14. `OccurrenceIdentity` remains separate and runtime-only;
15. scheduling remains incarnation-neutral.

If any fail, readiness is blocked.

---

# 79. Recommended Next Task If Ready

If the audit is clean and checkpointed, the next task should begin the durable-reference seam.

Recommended:

> **Task 2.32 — Define DurableOccurrenceReference V1 Semantics and Resolution Contract**

That task should be investigation/architecture-first.

It should define:

* reference shape;
* source-lifetime lineage;
* canonical occurrence coordinates;
* versioning;
* equality;
* resolution;
* source-missing/lifetime-mismatch/occurrence-missing outcomes;
* work occurrence lineage;
* conflict reference composition;
* relationship to `OccurrenceIdentity` V1;
* persistence readiness.

Do not implement PlanDecision yet.

---

# 80. Recommended Next Task If Blocked

If Task 2.31 finds a correctness defect, recommend the narrowest corrective task rather than beginning durable references.

Use a suffix if appropriate, such as:

`Task 2.31A — Correct <specific cross-surface defect>`

Do not hide corrective work inside 2.32.

---

# 81. Completion Criteria

Task 2.31 is complete only when:

* all seven source kinds are traced across all relevant lifecycle/durable transitions;
* source scope is confirmed;
* allocation call sites are audited;
* update preservation is confirmed;
* same-ID recreation is confirmed fresh;
* nested parent-recreation semantics are confirmed;
* Active V2 behavior is confirmed;
* Active V1 migration semantics are confirmed;
* V1 resurrection prevention is confirmed;
* Profile V2 semantics are confirmed;
* Profile quarantine/recovery is confirmed;
* Backup V1 semantics are confirmed;
* Backup V2 semantics are confirmed;
* cross-surface envelopes remain isolated;
* current writers/readers are audited;
* validators are audited;
* persistence/retry semantics are audited;
* clear/recovery semantics are audited;
* scheduling non-interference is confirmed;
* `OccurrenceIdentity` V1 separation is confirmed;
* required matrices are complete;
* DurableOccurrenceReference readiness is explicitly determined;
* no unresolved correctness defect is hidden;
* checkpoint is created only if appropriate;
* governance docs are updated if required;
* full validation passes;
* result artifact is complete.

---

# 82. Explicit Non-Goals

Do **not**:

* implement DurableOccurrenceReference;
* modify `OccurrenceIdentity` V1;
* implement PlanDecision;
* persist PlanDecision;
* add new source incarnation semantics;
* add new durable versions;
* modify Profile V2 meaning;
* modify Backup V2 meaning;
* add Backup history;
* add source history;
* add tombstones;
* redesign scheduling;
* redesign Preview;
* redesign recovery UI;
* retire V1 readers;
* remove historical checkpoints;
* perform unrelated cleanup.

---

# 83. Stop Conditions

Stop checkpoint publication and report if:

* any current active source can exist without incarnation;
* any create path can inherit a retired incarnation;
* any update path rotates incarnation unexpectedly;
* Active V2 rehydrate allocates identity;
* Profile V2 stores identity;
* Profile activation preserves active incarnation;
* Backup V1 restores old lifetime rather than instantiating;
* Backup V2 allocates new lifetime;
* retained V1 can resurrect;
* current writers still emit V1;
* scheduling depends on incarnation;
* `OccurrenceIdentity` contains incarnation;
* protected recovery can overwrite without source-safe authority;
* nested lifetime semantics are ambiguous;
* full validation fails.

---

# 84. Checkpoint Final Statement

If ready, the checkpoint should be able to state:

> DayFrame source lifetime identity is now explicit, lifecycle-aware, durable across Active V2 rehydration and Backup V2 recovery, intentionally regenerated across Profile V2 activation and Backup V1 compatibility import, protected against silent historical resurrection or uncertain overwrite, independent from scheduling and OccurrenceIdentity V1, and sufficiently stable to support the next architectural layer: durable occurrence references.

Do not publish this statement unless the evidence supports it.

---

# 85. Task Determination

**Authorized:** cross-surface audit of source-incarnation semantics, lifecycle transitions, durable-version authority, migration, profile instantiation, backup restoration, recovery, validation, persistence, and scheduling neutrality; narrowly scoped evidence tests if necessary; creation of a Phase 2 cross-surface incarnation checkpoint if the audit passes.

**Not authorized:** new incarnation behavior, new durable schemas, DurableOccurrenceReference, PlanDecision, scheduling changes, source history, or unrelated refactors.

The governing question is:

> Can every current DayFrame operation answer "same lifetime or new lifetime?" consistently, durably, and truthfully?

---

# 86. Final Completion Statement

**Task 2.31 is complete when DayFrame has an evidence-backed cross-surface audit proving or disproving the consistency of source-incarnation semantics across creation, update, deletion/recreation, Active V1 migration, Active V2 rehydration, Profile V2 save/activation/recovery, Backup V1 import, Backup V2 restore, persistence failure/retry, clear, protected recovery, and all seven lifetime-bearing source kinds; current readers, writers, validators, allocator call sites, scheduling non-interference, and OccurrenceIdentity V1 separation have been audited; DurableOccurrenceReference readiness is explicitly determined; a Phase 2 source-incarnation checkpoint is published only if the evidence supports it; complete repository validation passes; and no DurableOccurrenceReference, PlanDecision, new durable format, or unrelated behavior is introduced.**
