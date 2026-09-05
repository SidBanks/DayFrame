# Task 9.2.2 — Realized Schedule Identity Foundation V1

**Status:** Ready for Codex
**Phase:** Phase 9 — Constructive Planning and Authorization
**Subphase:** Task 9.2 Architecture-Reopen Foundation
**Task Type:** Implementation / Scheduled Identity Foundation / Execution Subject Foundation / Publication Provenance / Compatibility / Regression
**Primary Responsibility:** Extend DayFrame’s scheduled-fact, schedule-origin, execution-subject, publication-history, and provenance contracts so future Accepted Allocation realization can create exact productive Goal work, support activity, and Buffer protection with stable accepted-allocation lineage, without actually realizing Accepted Allocations, mutating Preview behavior, creating execution, changing Progress, or introducing new planning authority.

---

## 1. Objective

Resolve the final architecture blocker preventing Task 9.3.

Task 9.2.1 now guarantees that complete Accepted Allocation V2 authority freezes:

* productive claims;
* support-activity claims;
* Buffer-protection claims;
* requiredness;
* exact intervals;
* canonical user-day;
* Goal/Demand lineage;
* component provenance;
* Proposal/ProposalDecision lineage;
* stable semantic claim identity.

However, downstream scheduled and historical identity surfaces still understand only the legacy schedule categories and origins.

Current architecture cannot yet faithfully represent:

```text id="8jx3lc"
Accepted Allocation
→ Scheduled Goal Work
→ Scheduled Support Activity
→ Realized Buffer Protection
```

with:

* distinct schedule roles;
* Accepted Allocation origin;
* stable execution subjects;
* publication lineage;
* historical identity;
* non-executable Buffer semantics.

Task 9.2.2 must establish those downstream identity contracts.

At completion DayFrame must be able to answer structurally:

> **If Task 9.3 realizes this complete Accepted Allocation, what exact scheduled object type will represent each productive, support, and Buffer claim; how will each subject retain immutable Accepted Allocation lineage; which subjects may later receive execution records; how will publication freeze their provenance; and how will old scheduled/history records remain readable?**

Task 9.2.2 must **not** perform realization.

---

## 2. Starting Architecture-Reopen State

Task 9.3 originally stopped because:

1. Accepted claims were productive-only;
2. Scheduled block types lacked accepted-allocation origins and productive/support/protection distinction;
3. execution subjects understood only legacy template/Work/manual identities;
4. publication/history understood only legacy origins.

Task 9.2.0 resolved the missing pre-scheduling Goal-Demand footprint architecture.

Task 9.2.1 implemented complete resource-footprint propagation through Accepted Allocation V2.

Task 9.2.2 now resolves items 2–4 only.

---

## 3. Governing Upstream Truth

Task 9.2.1 is normative for the accepted input boundary.

New complete Accepted Allocation V2 records contain exact:

```text id="2fgmh2"
productiveClaims[]
supportClaims[]
bufferClaims[]
```

with:

* deterministic identities;
* exact `[start,end)` geometry;
* canonical user-day;
* Capacity provenance;
* requiredness;
* Candidate Parent lineage;
* Goal/Demand/Projection lineage;
* component/source lineage;
* Proposal/ProposalDecision lineage.

Task 9.2.2 must consume these semantics conceptually.

Do not reinterpret them.

---

## 4. Core Architectural Principle

Preserve the authority chain:

```text id="xm8wm5"
Proposal
→ ProposalDecision
→ Accepted Allocation
→ Realization
→ Scheduled Reality
→ Execution
→ Progress
→ History
```

Task 9.2.2 defines the identities required for:

```text id="097a3i"
Scheduled Reality
Execution subject identity
Publication/history provenance
```

It does not perform the transition from Accepted Allocation to Scheduled Reality.

---

## 5. Required Semantic Separation

The architecture must distinguish:

### A. Scheduled Productive Goal Work

A real time-owning scheduled activity satisfying Goal Demand when executed/planned.

### B. Scheduled Support Activity

A real time-owning operational activity required by the accepted productive footprint.

### C. Realized Buffer Protection

A real time-protecting non-activity schedule fact.

These must remain distinct from:

* legacy generated template blocks;
* Work;
* manual events;
* Proposal;
* Accepted Allocation;
* Realization record;
* Execution;
* Progress.

---

## 6. No Realization

Task 9.2.2 must not:

* call realization;
* create scheduled Goal work from Accepted Allocation;
* create scheduled support from Accepted Allocation;
* create realized Buffer from Accepted Allocation;
* change Accepted Allocation status;
* regenerate Preview because of Accepted Allocation;
* create execution records;
* publish a plan;
* create Progress.

This task creates types/contracts/readers/validators only.

---

## 7. Scheduled Origin Model

Extend schedule origin/source identity with a first-class accepted-allocation origin.

Use a typed origin materially equivalent to:

```text id="7uaxh9"
acceptedAllocation
```

Do not overload:

* manual;
* template;
* generated;
* work;
* legacyUnknown.

The exact enum/type name may differ.

---

## 8. Schedule Role Model

Introduce or formalize a distinct schedule-role classification.

At minimum:

```text id="54op7q"
productiveGoalWork
supportActivity
bufferProtection
```

Equivalent naming is acceptable.

Role and origin are separate concepts.

For example:

```text id="j8pgdy"
origin = acceptedAllocation
role = productiveGoalWork
```

Do not encode role by guessing from origin.

---

## 9. Time Ownership

Define:

| Scheduled Role     | Owns/Protects Time | Activity? | Execution-Capable? |
| ------------------ | ------------------ | --------- | ------------------ |
| productiveGoalWork | owns               | Yes       | Yes                |
| supportActivity    | owns               | Yes       | Yes                |
| bufferProtection   | protects           | No        | No                 |

This distinction is mandatory.

---

## 10. Scheduled Goal Work Definition

Define a first-class scheduled identity materially equivalent to:

> Scheduled Goal Work — a realized, time-owning productive schedule fact created from one accepted productive resource claim.

It must be capable of retaining:

* scheduled subject ID;
* realization ID;
* Accepted Allocation ID;
* accepted claim ID;
* ProposalDecision ID;
* Proposal revision/option;
* Goal ID;
* Demand authority/projection lineage;
* exact start/end;
* canonical user-day;
* productive role;
* accepted-allocation origin;
* component/candidate lineage;
* publication provenance;
* execution-subject identity.

---

## 11. Scheduled Support Activity Definition

Define:

> Scheduled Support Activity — a realized, time-owning operational schedule fact created from one accepted support resource claim.

Retain:

* scheduled subject ID;
* realization ID;
* Accepted Allocation;
* accepted claim;
* supporting productive claim/Candidate Parent;
* source footprint component;
* Composition lineage where frozen;
* exact interval;
* canonical user-day;
* support role;
* accepted-allocation origin;
* execution-subject identity;
* publication provenance.

---

## 12. Realized Buffer Protection Definition

Define:

> Realized Buffer Protection — a realized schedule-protection fact created from an accepted Buffer claim.

Retain:

* protection ID;
* realization ID;
* Accepted Allocation;
* accepted Buffer claim;
* protected productive/support subject lineage;
* footprint component;
* exact interval;
* canonical user-day;
* Buffer role;
* accepted-allocation origin;
* publication provenance.

Buffer must not acquire an execution-subject identity.

---

## 13. Schedule Object Strategy

Inspect current schedule model and choose the smallest architecture-compatible representation.

Evaluate:

### Option A — Extend existing scheduled block type

Use a richer discriminated union.

### Option B — Introduce sibling scheduled Goal/support/protection types

Preserve legacy `DraftScheduledBlock` unchanged and create explicit realized planning facts.

### Option C — Define a common schedule-subject union over legacy and new types

Recommended if current consumers need one typed read surface.

Choose based on existing code boundaries.

Do not force Buffer into an activity block solely for convenience.

---

## 14. Buffer Must Not Be a Fake Block

If existing scheduled blocks imply:

* activity;
* movable work;
* executable subject;

do not represent Buffer by pretending it is a scheduled activity.

Use a distinct protective schedule fact or discriminated role that structurally prohibits execution.

---

## 15. Existing Schedule Compatibility

Legacy schedule sources must remain valid.

At minimum preserve behavior for:

* Work;
* generated/template blocks;
* Sleep where currently modeled;
* manual events;
* composition-generated attached activities;
* current Buffers/protection if already represented elsewhere.

Do not rewrite their identity semantics.

---

## 16. Common Scheduled Subject Identity

Define a stable semantic identifier for every realization-created scheduled subject.

Identity must be deterministic from immutable inputs such as:

* Realization ID;
* Accepted Allocation ID;
* accepted claim ID;
* schedule role.

Do not use:

* array position;
* Preview occurrence index;
* publication index;
* random execution-time IDs.

---

## 17. Accepted Claim Identity Preservation

The accepted claim ID must remain recoverable from the scheduled fact.

Do not replace accepted identity with only a scheduled block ID.

Required lineage:

```text id="wv3chf"
Accepted claim
→ realized scheduled subject
```

---

## 18. Realization Identity Seam

Task 9.2.2 must define the field/contract for future `realizationId`.

It may introduce the type and provenance field.

It must not create realization records.

Task 9.3 will supply the actual value.

---

## 19. Goal/Demand Lineage

Scheduled productive Goal work must retain exact Goal/Demand lineage.

Support and Buffer must retain the productive claim/Candidate Parent lineage they accompany.

Do not infer Goal association from titles/categories after realization.

---

## 20. Productive/Support Relationship

Scheduled support must be able to answer:

> Which accepted productive session does this support?

Use stable lineage.

Do not rely on interval adjacency alone.

---

## 21. Buffer Protection Relationship

Realized Buffer must be able to answer:

> What accepted productive/support component does this protect?

Preserve the explicit target relation from Task 9.2.1.

Do not infer protection target from geometry.

---

## 22. Canonical User-Day

Each realized subject/protection must retain the canonical user-day determined by accepted claim semantics.

Do not recompute identity using calendar midnight.

Task 9.3 may validate current policy applicability, but 9.2.2 defines the storage identity.

---

## 23. Cross-User-Day Compatibility

Support/Buffer may belong to adjacent canonical user-days relative to productive work.

Scheduled identities must support this without losing common Candidate Parent/Accepted Allocation lineage.

Do not force all components onto one user-day.

---

## 24. Exact Geometry

Scheduled Goal/support/protection identities retain exact accepted:

```text id="70lryc"
[start,end)
```

geometry.

Task 9.2.2 must not create any API that silently adjusts these intervals.

---

## 25. No Placement Semantics

New types must not imply they are BlockCandidates.

Accepted-allocation-origin scheduled facts are already authorized fixed geometry after realization.

They must never enter:

* flexible placement search;
* recurrence expansion;
* template placement policy.

---

## 26. Movability Semantics

Determine whether realized Goal/support subjects are structurally movable by corrective planning.

Important distinction:

* they are not autonomously movable by the scheduling engine;
* a future explicit PlanDecision may authorize movement if compatible with accepted lineage semantics.

Do not mark them generic `movable: true` if that allows hidden re-placement.

---

## 27. Corrective Decision Compatibility

Inspect `PlanDecision`.

Task 9.2.2 must determine whether current PlanDecision subject identity can safely target future realized Goal/support subjects.

If yes:

* extend its subject union/type only.

If no:

* define the smallest future-compatible subject identity seam;
* defer behavioral movement semantics to a later explicit task.

Do not implement correction behavior here.

---

## 28. CompositeDecision Compatibility

Do not route accepted-allocation realization through CompositeDecision.

CompositeDecision remains for actual composition relationships.

However, realized support may preserve Task 8.4 component lineage needed by future corrective evidence.

---

## 29. Friction Identity Compatibility

Future Friction must be able to reference realized Goal/support/Buffer identities.

Task 9.2.2 should extend relevant subject/ref unions if needed.

Do not derive new Friction in this task.

---

## 30. SuggestedFix Boundary

SuggestedFix remains corrective.

Do not create special Proposal-like behavior for accepted-allocation schedule subjects.

If current fix identity union must recognize new subjects, extend only the type contract.

---

## 31. Preview Identity Compatibility

Preview must eventually render realized schedule facts without becoming authoritative.

Task 9.2.2 may extend Preview-facing discriminated types/read models where necessary.

Do not cause Accepted Allocation to appear in Preview merely because it exists.

No realization = no new Preview scheduled facts.

---

## 32. Preview Source Classification

Future Preview should be able to distinguish:

* accepted productive Goal work;
* accepted support;
* accepted Buffer protection.

Do not flatten them into `manualEvent`.

---

## 33. Existing Preview Baseline

With no realization records/scheduled facts:

> Preview output after Task 9.2.2 must be behaviorally identical to pre-task Preview.

Add regression coverage.

---

## 34. Execution Subject Architecture

Extend execution subject identity so future execution records can target:

* Scheduled Goal Work;
* Scheduled Support Activity.

They must not target:

* Buffer protection;
* Proposal;
* Accepted Allocation;
* Realization record.

---

## 35. Execution Subject Discriminator

Use an explicit typed discriminator materially equivalent to:

```text id="kw9wcq"
scheduledGoalWork
scheduledSupportActivity
```

Do not encode both as generic manual blocks.

---

## 36. Execution Subject Stable Identity

Execution subject identity must survive:

* Preview regeneration;
* app restart;
* publication;
* historical-plan materialization.

Execution must not depend on ephemeral Preview IDs.

---

## 37. Execution Provenance

Future execution record should be able to retain/resolve:

```text id="so40cd"
Execution
→ scheduled subject
→ Realization
→ Accepted Allocation
→ ProposalDecision
→ Proposal
→ Allocation
→ Demand/Goal
```

Task 9.2.2 establishes type support only.

---

## 38. Buffer Execution Prohibition

Structurally prevent:

```text id="p5o7ef"
Buffer → ExecutionRecord
```

where practical.

At minimum validators must reject it.

Add tests.

---

## 39. Productive vs Support Execution Semantics

Both productive Goal work and support activity may later have execution truth.

But execution meaning differs:

* productive execution may provide evidence relevant to Goal progress;
* support execution provides operational history but no automatic Demand/Progress credit.

Task 9.2.2 must preserve the distinction.

Do not implement Progress mapping.

---

## 40. Progress Boundary

No schedule identity created here may imply:

* Goal completed;
* Demand satisfied historically;
* Progress incremented.

Scheduled ≠ executed ≠ Progress.

---

## 41. Publication Architecture

Extend Published Plan / HistoricalPlan provenance so future realized Accepted Allocation facts can be frozen exactly.

Published history must preserve:

* schedule role;
* accepted-allocation origin;
* scheduled subject/protection ID;
* realization ID;
* Accepted Allocation;
* accepted claim;
* ProposalDecision;
* Proposal/option;
* Goal/Demand;
* source component/Candidate Parent;
* exact interval/user-day.

---

## 42. Published Plan Immutability

Publication remains immutable schedule history.

A later change to:

* Goal;
* Demand;
* footprint spec;
* Proposal;
* Accepted Allocation;
* schedule;

must not mutate prior published history.

Freeze decisive provenance.

---

## 43. Publication Origin Model

Add explicit publication-origin classification for accepted-allocation realization.

Do not rely on:

* template;
* work;
* manual;
* legacyUnknown.

Legacy unknown remains only for historical data whose origin truly cannot be reconstructed.

---

## 44. Historical Schedule Role

Published history must preserve whether the realized fact was:

* productiveGoalWork;
* supportActivity;
* bufferProtection.

Do not collapse Buffer to activity.

---

## 45. Historical Buffer

Published Buffer history must be readable as protected schedule truth even though it is non-executable.

If HistoricalPlan currently only stores activity blocks, extend its domain carefully.

Do not invent execution fields for Buffer.

---

## 46. Publication Read Compatibility

Old publications must remain readable.

New readers must accept:

* legacy publication records;
* new accepted-allocation-origin records.

Do not rewrite historical bytes unnecessarily.

---

## 47. Publication Record Versioning

Determine whether publication record shape requires a new domain record version.

If decisive provenance fields change materially, prefer explicit versioning.

Do not reinterpret old records under new semantics.

---

## 48. HistoricalPlan Versioning

Inspect current HistoricalPlan schema/version conventions.

Possible approach:

```text id="ap3uyb"
HistoricalPlanEntryV2
```

with a discriminated origin/role.

Exact naming depends on repository conventions.

---

## 49. Legacy Publication Migration

Do not infer accepted-allocation origin for old records.

Older records retain:

* known legacy origin;
* `legacyUnknown` only where truly unknown.

No historical reconstruction from current Goal/Proposal state.

---

## 50. Persistence Ownership

Task 9.2.2 should avoid introducing new durable schedule instances unless necessary for schema/type migration.

The actual realization store/scheduled-fact persistence belongs to Task 9.3.

However, if publication or execution subject schemas are durable and must be extended now, version them safely.

---

## 51. Realization Store Boundary

Do not create the future realization authority store merely to satisfy typing.

Task 9.3 must decide the actual durable realization host.

Task 9.2.2 may define interfaces/types imported later.

---

## 52. Execution Persistence Compatibility

If ExecutionRecord schema uses a closed subject union, extend durable validators/versioning.

Old execution records remain readable.

No execution migration may invent new subjects.

---

## 53. Backup Impact

Task 9.2.1 established Backup V11.

Determine whether 9.2.2 changes any durable bytes immediately.

### If only future-facing types/readers change

Keep Backup V11.

### If publication/execution durable record formats change

Advance backup only if required by actual persisted shape.

Do not bump backup version merely for unused types.

---

## 54. Schema Impact

Task 9.2.1 retained IndexedDB schema 10.

Do not bump object-store schema unless:

* indexes/store structure change;
* currently persisted publication/execution records require store migration.

Tagged domain-record versioning alone does not necessarily require IndexedDB schema change.

Document decision.

---

## 55. Backup Downgrade Protection

If new publication/execution record versions can exist after this task, older backup export must refuse where downgrade would lose:

* schedule role;
* accepted-allocation provenance;
* new execution subject identity.

If no new durable records can yet be created, document no new downgrade condition.

---

## 56. Restore Validation

If validators change, ensure future new records validate:

* origin;
* schedule role;
* stable subject ID;
* realization ID where required;
* accepted lineage;
* Buffer non-executable constraint;
* exact interval geometry.

Legacy records remain valid under legacy contracts.

---

## 57. Typed Origin, Not Stringly-Typed Metadata

Do not add arbitrary metadata such as:

```text id="g0qgvo"
source: "goal"
notes: "accepted allocation"
```

Use proper discriminated types.

---

## 58. One Semantic Owner Per Identity

Preserve:

* Accepted Allocation owns accepted authority;
* future Realization owns authority→schedule transition evidence;
* scheduled Goal/support/protection facts own/protect realized time;
* Execution owns actual activity evidence;
* Published Plan owns immutable publication history.

Do not duplicate ownership.

---

## 59. Provenance Freeze

Scheduled identity must preserve enough immutable accepted provenance that later source mutation/deletion cannot make realized/history records uninterpretable.

Reference live objects where safe, but freeze decisive IDs/revisions.

---

## 60. Accepted Allocation Version Compatibility

Complete realization will require:

```text id="h8934q"
AcceptedAllocationV2
footprintCompleteness = complete
```

Legacy:

```text id="sswjnt"
legacyProductiveOnly
```

must not be silently eligible for complete realization.

Task 9.2.2 types should preserve this future eligibility distinction.

Do not implement realization eligibility behavior beyond validators/helpers.

---

## 61. Schedule-Origin Eligibility

Only complete accepted authority may eventually produce accepted-allocation-origin schedule facts.

Do not allow constructors/helpers to accept incomplete legacy Accepted Allocation without explicit unsafe bypass.

Prefer types that make misuse difficult.

---

## 62. Constructor/Factory Strategy

If introducing construction helpers for future scheduled subjects:

* keep them pure;
* require full explicit lineage;
* require exact geometry;
* require correct role;
* validate Buffer non-execution;
* do not persist;
* do not install schedule facts.

These may be useful for 9.3 but must remain non-authoritative helpers.

---

## 63. No Public Partial Materialization API

Do not expose helpers that imply:

```text id="8yp4xj"
createSupportFromAcceptedAllocation()
```

as a standalone mutation.

Task 9.3 requires atomic full-footprint realization.

Any helper here must be a pure value constructor only.

---

## 64. Role-Origin Matrix

Implement/verify:

| Origin                 | Role               |                       Legal? |
| ---------------------- | ------------------ | ---------------------------: |
| acceptedAllocation     | productiveGoalWork |                          Yes |
| acceptedAllocation     | supportActivity    |                          Yes |
| acceptedAllocation     | bufferProtection   |                          Yes |
| acceptedAllocation     | generic/manual     |           No for realization |
| legacy template origin | productiveGoalWork | No implicit reinterpretation |
| manual origin          | supportActivity    | No implicit reinterpretation |
| work origin            | bufferProtection   |                           No |

Do not globally forbid future explicit authored support concepts; this matrix concerns accepted-allocation realization identity.

---

## 65. Execution Eligibility Matrix

| Scheduled Role     | Execution Subject? | Progress Automatically? |
| ------------------ | -----------------: | ----------------------: |
| productiveGoalWork |                Yes |                      No |
| supportActivity    |                Yes |                      No |
| bufferProtection   |                 No |                      No |

Mandatory.

---

## 66. Publication Matrix

| Scheduled Role     | Publishable? | Historical Identity? | Executable? |
| ------------------ | -----------: | -------------------: | ----------: |
| productiveGoalWork |          Yes |                  Yes |         Yes |
| supportActivity    |          Yes |                  Yes |         Yes |
| bufferProtection   |          Yes |                  Yes |          No |

---

## 67. Preview Matrix

| Role               | Visible in Preview after realization? | Owns/Protects Time? |
| ------------------ | ------------------------------------: | ------------------- |
| productiveGoalWork |                                   Yes | owns                |
| supportActivity    |                                   Yes | owns                |
| bufferProtection   |      Yes or represented as protection | protects            |

Task 9.2.2 may define the type support but not instantiate it.

---

## 68. Friction Matrix

Future Friction should be able to reference:

| Role               | Can Participate in Conflict? |
| ------------------ | ---------------------------: |
| productiveGoalWork |                          Yes |
| supportActivity    |                          Yes |
| bufferProtection   |            Yes as protection |

Do not derive Friction now.

---

## 69. Direct Authoring Boundary

Goal-linked authored Commitment remains distinct from realized Scheduled Goal Work.

Do not reinterpret:

```text id="lc9y07"
Goal link + Commitment
```

as accepted Goal allocation.

Directly authored events retain their existing origins.

---

## 70. Recurrence Boundary

No accepted-allocation-origin scheduled identity implies recurrence.

Each realized claim is one exact scheduled fact.

Do not attach BlockRecurrence/template recurrence metadata.

---

## 71. Template Boundary

Do not create synthetic BlockTemplate IDs for realized Goal work/support.

Accepted claims already supply exact identity and geometry.

---

## 72. Work Boundary

Do not model realized Goal work as shift-derived Work.

Work remains existing authored/generated shift truth.

---

## 73. Manual Event Boundary

Do not model realized Goal/support as manual events.

A user acceptance lineage is not direct manual schedule authoring.

---

## 74. Composition Boundary

Scheduled support may retain Task 8.4 Composition lineage.

It does not thereby become a Task 8.4 standalone attachment relationship mutation.

Preserve provenance without merging domains.

---

## 75. Buffer Boundary

Existing Task 8.4 realized/derived Buffer semantics and future accepted Goal Buffer must share compatible protective-time abstractions where possible.

Do not create two contradictory definitions of protected Capacity.

---

## 76. Capacity Compatibility

Once Task 9.3 creates these schedule facts:

* productive and support will occupy;
* Buffer will protect;
* Capacity will subtract them exactly once.

Task 9.2.2 must ensure schedule-role typing makes this distinction consumable.

Do not change Capacity now unless necessary for type exhaustiveness.

---

## 77. Feasibility Compatibility

No Feasibility behavior change is expected.

Feasibility continues consuming pre-scheduling projected footprints from Task 9.2.1.

Do not make it read scheduled realization types.

---

## 78. Proposal Compatibility

Proposal and Accepted Allocation remain unchanged except compile-time imports if necessary.

Do not add schedule identity into Proposal itself.

---

## 79. Realization Input/Output Contract Preparation

Define the future 9.3 mapping explicitly:

```text id="3jxgzu"
Accepted productive claim
→ Scheduled Goal Work

Accepted support claim
→ Scheduled Support Activity

Accepted Buffer claim
→ Realized Buffer Protection
```

Each mapping must be one-to-one by accepted claim identity unless existing Buffer-union architecture requires multiple lineage claims over one protective fact.

If Buffer union needs special identity semantics, document it now.

---

## 80. Buffer Union Identity

Task 9.2.1 permits compatible Buffer/Buffer overlap with unioned resource cost while preserving separate lineage.

Determine future realization identity:

### Preferred

Preserve each accepted Buffer claim as separate provenance-bearing protection fact even if their effective protected interval union overlaps.

Capacity may union protection intervals for calculation.

Do not erase accepted provenance by coalescing identities unless the architecture requires an explicit aggregate protection fact.

---

## 81. Duplicate Realization Prevention Seam

Scheduled identity derived from Accepted Allocation + claim identity should make duplicate realization detectable.

Task 9.3 will enforce idempotence.

Task 9.2.2 should ensure subject identity permits:

```text id="mh7ta0"
same accepted claim
→ same scheduled subject ID
```

---

## 82. Schedule Reader Compatibility

Any generic schedule reader should be able to consume new realized subjects without assuming every scheduled item has:

* template ID;
* recurrence;
* manual-event ID;
* Work source.

Refactor closed assumptions where necessary.

Do not alter runtime output without instances.

---

## 83. Exhaustive Switches

Audit exhaustive switches over:

* schedule source;
* block origin;
* execution subject;
* historical origin;
* publication entry type;
* Preview source;
* Friction subject.

Extend intentionally.

Do not add catch-all defaults merely to satisfy TypeScript.

---

## 84. Serialization

New domain identities must serialize deterministically.

Avoid:

* class instances;
* functions;
* Maps/Sets unless encoded explicitly;
* Date objects if current storage uses ISO strings.

Follow existing persisted conventions.

---

## 85. Equality

Define semantic equality for realization-created schedule facts.

Equivalent provenance + role + exact interval + accepted claim identity should compare equivalent.

Do not use display labels.

---

## 86. Validation

Add validators for new schedule/provenance concepts.

At minimum reject:

* Buffer marked executable;
* support marked productive;
* missing Accepted Allocation ID on accepted origin;
* missing accepted claim ID;
* nonpositive interval;
* mismatched role/claim type;
* missing realization ID when a realized fact is constructed;
* unsupported legacy origin/role combinations.

---

## 87. Legacy Readers

Old scheduled blocks/execution records/history must continue to validate.

No migration should manufacture new provenance for them.

---

## 88. Publication Snapshot Sufficiency

New publication entries must be interpretable even if later:

* Proposal store is cleared;
* Goal is deleted;
* footprint spec is revised/deleted.

Freeze the minimum decisive provenance required.

Do not require live lookup for historical meaning.

---

## 89. Execution Lookup Sufficiency

An execution record should be able to resolve its scheduled subject identity even after Preview regeneration.

It may depend on durable realization/schedule history introduced in 9.3, not ephemeral Preview state.

Design subject identity accordingly.

---

## 90. No New UI

No broad Planner/Month/Review UI changes.

If developer diagnostics/type labels change, keep them minimal.

---

## 91. Accessibility

Expected:

> No new interactive surface introduced.

If existing publication/history/read surfaces gain new labels, preserve semantic accessibility.

---

## 92. Bundle Discipline

Task 9.2.1 final bundle:

* initial raw: **649,909**
* initial gzip: **165,946**
* largest lazy: **53,187**
* total: **920,474**

Hard limits pass but gzip/total warning state remains active.

Requirements:

1. keep identity/provenance models lightweight;
2. avoid new eager UI imports;
3. reuse existing provenance primitives;
4. avoid duplicate type-to-label mapping in multiple chunks;
5. record before/after sizes;
6. pass hard limits.

---

## 93. Persistence/Version Discovery

Before changing durable schemas, inspect:

* executionRecord persistence;
* HistoricalPlan persistence;
* Published Plan schema;
* Backup V11;
* current IndexedDB stores/indexes.

Prefer domain record versioning over object-store schema bump when structurally sufficient.

---

## 94. Expected Database Schema

Task 9.2.1 baseline:

```text id="jf651i"
IndexedDB schema 10
```

Expected Task 9.2.2:

```text id="mt202j"
schema 10
```

unless actual persistent index/store requirements force a bump.

A schema bump must be justified in RESULT.

---

## 95. Expected Backup Version

Task 9.2.1 baseline:

```text id="yn7643"
Backup V11
```

Expected Task 9.2.2:

```text id="5bnz36"
Backup V11
```

if no newly creatable durable record shape requires preservation.

If execution/history record version changes are persistable immediately, determine whether V12 is required.

Do not bump speculatively.

---

## 96. Required Focused Tests — Schedule Identity

Add tests proving:

1. accepted-allocation origin exists;
2. productive/support/Buffer roles are distinct;
3. Scheduled Goal Work construction preserves lineage;
4. Scheduled Support construction preserves component lineage;
5. Buffer construction preserves protection lineage;
6. IDs are deterministic;
7. same accepted claim maps to same future subject identity;
8. geometry remains exact;
9. user-day remains exact;
10. no placement metadata is invented.

---

## 97. Required Focused Tests — Execution

Prove:

1. Goal work may be a valid execution subject;
2. support may be a valid execution subject;
3. Buffer is rejected as execution subject;
4. legacy execution subjects still work;
5. stable subject IDs survive serialization;
6. no execution record is created automatically.

---

## 98. Required Focused Tests — Publication

Prove:

1. publication models can encode productive Goal work;
2. publication models can encode support;
3. publication models can encode Buffer protection;
4. Accepted Allocation lineage survives;
5. ProposalDecision/Goal/Demand provenance survives;
6. roles survive serialize/deserialize;
7. legacy history still reads;
8. no old record is inferred as accepted-allocation origin.

---

## 99. Required Focused Tests — Preview/Friction Compatibility

Prove:

1. new identity types are consumable by generic schedule readers where required;
2. no realized instances means Preview output unchanged;
3. no new Friction appears;
4. no SuggestedFix behavior changes;
5. exhaustive switches handle future accepted-allocation subjects without unsafe defaults.

---

## 100. Required Focused Tests — Boundaries

Prove:

1. Accepted Allocation remains unscheduled;
2. no realization record created;
3. no new scheduled durable fact created from existing acceptance;
4. no Progress mutation;
5. no Capacity behavior change;
6. no recurrence;
7. no direct-authoring reinterpretation.

---

## 101. Full Regression

Keep green:

* Goal planning;
* Task 8.4 Composition;
* Capacity;
* Feasibility;
* Competition;
* Allocation;
* Proposal;
* ProposalDecision;
* Accepted Allocation V1/V2;
* Preview;
* schedule generation;
* Friction;
* SuggestedFix;
* PlanDecision;
* CompositeDecision;
* execution;
* publication;
* history;
* backup/restore;
* migration;
* DF-006.

---

## 102. Required Validation Commands

Run repository-supported equivalents:

```bash id="sry4kx"
npx prettier --check .
npm test -- --reporter=dot
npm run typecheck
npm run lint
npm run build
npm run check:bundle
git diff --check
```

Also run focused identity/execution/publication suites.

---

## 103. Architecture-Reopen Resolution

Task 9.2.2 begins with:

> **Architecture Reopen: Yes — final downstream identity repair**

At completion expected status:

```text id="2z9s5d"
Accepted-footprint blocker: resolved by 9.2.1
Scheduled identity blocker: resolved by 9.2.2
Execution identity blocker: resolved by 9.2.2
Publication-origin blocker: resolved by 9.2.2

Task 9.3 architecture reopen: CLOSED
```

Do not claim closed if any realized accepted claim still cannot be represented without overloading a legacy identity.

---

## 104. Stop / Reopen Conditions

Stop and report if:

* Buffer cannot be represented as protection without becoming a fake executable activity;
* execution identity fundamentally depends on ephemeral Preview IDs;
* publication cannot preserve immutable accepted lineage;
* ScheduledBlock architecture cannot represent fixed accepted geometry without routing through placement;
* new schedule role would force recurrence/template semantics;
* HistoricalPlan cannot represent non-activity protected facts;
* PlanDecision identity cannot safely distinguish accepted realized subjects from legacy blocks;
* old execution/history bytes would need reinterpretation;
* exact accepted claim identity cannot survive into scheduled identity;
* future idempotent realization cannot detect one-claim→one-subject correspondence.

Do not solve by:

* converting everything to manual events;
* treating Buffer as support activity;
* using labels/categories as role;
* creating synthetic templates;
* creating fake recurrence;
* dropping Accepted Allocation lineage;
* flattening support into productive work;
* storing provenance only in display strings.

---

## 105. Governance

Update:

* `CURRENT_STATE.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` if new durable decisions are required concerning:

* schedule role model;
* accepted-allocation origin;
* execution subject model;
* publication/history version.

Record that Task 9.3 architecture reopen is closed only if all completion criteria pass.

Do not rewrite Task 9.2.0 or 9.2.1 RESULT artifacts.

---

## 106. Repository Discipline

Before implementation:

1. inspect `git status`;
2. preserve cumulative Task 9.1/9.2/9.2.0/9.2.1 changes;
3. preserve unrelated work;
4. do not clean;
5. do not commit;
6. do not push unless explicitly instructed.

Report repository status.

---

## 107. Required RESULT Artifact

Create:

```text id="m5lvt0"
TASK_9.2.2_REALIZED_SCHEDULE_IDENTITY_FOUNDATION_V1_RESULT.md
```

Filename must contain **`RESULT`**.

Place it in the dedicated Phase 9 implementation-results folder.

---

## 108. Required RESULT Sections

The RESULT must include at minimum:

1. Executive Result
2. Architecture-Reopen Context
3. Starting Baseline
4. Governing Upstream Contract
5. Scope Delivered
6. Explicit Non-Goals
7. Schedule Origin Model
8. Schedule Role Model
9. Time-Ownership Semantics
10. Scheduled Goal Work Definition
11. Scheduled Support Definition
12. Realized Buffer Definition
13. Schedule Object Strategy
14. Buffer Representation
15. Legacy Schedule Compatibility
16. Scheduled Subject Identity
17. Accepted Claim Lineage
18. Realization Identity Seam
19. Goal/Demand Lineage
20. Productive/Support Relationship
21. Buffer Protection Relationship
22. User-Day Semantics
23. Cross-User-Day Compatibility
24. Geometry Semantics
25. Placement Boundary
26. Movability Semantics
27. PlanDecision Compatibility
28. CompositeDecision Boundary
29. Friction Identity Compatibility
30. SuggestedFix Boundary
31. Preview Identity Compatibility
32. Preview Source Classification
33. Preview Baseline Preservation
34. Execution Subject Model
35. Execution Discriminator
36. Execution Stable Identity
37. Execution Provenance
38. Buffer Execution Prohibition
39. Productive vs Support Execution
40. Progress Boundary
41. Publication Architecture
42. Published Plan Immutability
43. Publication Origin Model
44. Historical Role Model
45. Historical Buffer Representation
46. Publication Read Compatibility
47. Publication Record Version
48. HistoricalPlan Version Decision
49. Legacy Publication Migration
50. Persistence Ownership
51. Realization Store Boundary
52. Execution Persistence Compatibility
53. Backup Decision
54. Schema Decision
55. Downgrade Protection
56. Restore Validation
57. Typed-Origin Design
58. Semantic Ownership
59. Provenance Freeze
60. Accepted Allocation Version Compatibility
61. Schedule-Origin Eligibility
62. Constructors/Factories
63. No Partial Materialization API
64. Role-Origin Matrix
65. Execution Eligibility Matrix
66. Publication Matrix
67. Preview Matrix
68. Friction Matrix
69. Direct Authoring Boundary
70. Recurrence Boundary
71. Template Boundary
72. Work Boundary
73. Manual Event Boundary
74. Composition Boundary
75. Buffer Boundary
76. Capacity Compatibility
77. Feasibility Compatibility
78. Proposal Compatibility
79. Realization Mapping Contract
80. Buffer Union Identity
81. Duplicate Realization Prevention Seam
82. Schedule Reader Compatibility
83. Exhaustive Switch Audit
84. Serialization
85. Equality
86. Validation
87. Legacy Readers
88. Publication Snapshot Sufficiency
89. Execution Lookup Sufficiency
90. UI Boundary
91. Accessibility
92. Bundle Architecture Review
93. Persistence/Version Discovery
94. Schedule Identity Tests
95. Execution Tests
96. Publication Tests
97. Preview/Friction Tests
98. Boundary Tests
99. Full Regression
100. Validation Commands
101. V1 Design Decision Table
102. Boundary Matrix
103. Authority Transition Matrix
104. Provenance Matrix
105. Invariant Verification
106. Deviations
107. Governance Updates
108. Repository Status
109. Architecture Reopen Assessment
110. Task 9.3 Readiness
111. Recommended Next Task
112. Completion Statement

---

## 109. Required V1 Design Decision Table

Include:

| Question                   | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| -------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| accepted schedule origin   |             |                     |                    |                     |
| schedule role model        |             |                     |                    |                     |
| Goal work representation   |             |                     |                    |                     |
| support representation     |             |                     |                    |                     |
| Buffer representation      |             |                     |                    |                     |
| scheduled subject identity |             |                     |                    |                     |
| accepted claim lineage     |             |                     |                    |                     |
| realization ID seam        |             |                     |                    |                     |
| movability                 |             |                     |                    |                     |
| PlanDecision subject       |             |                     |                    |                     |
| Friction subject           |             |                     |                    |                     |
| execution subject          |             |                     |                    |                     |
| Buffer execution rule      |             |                     |                    |                     |
| publication origin         |             |                     |                    |                     |
| historical role            |             |                     |                    |                     |
| publication record version |             |                     |                    |                     |
| execution record version   |             |                     |                    |                     |
| schema                     |             |                     |                    |                     |
| backup                     |             |                     |                    |                     |

---

## 110. Required Boundary Matrix

| Concept                  | Epistemic Class               |      Owns/Protects Time? |     Executable? |                        Durable After 9.2.2? |
| ------------------------ | ----------------------------- | -----------------------: | --------------: | ------------------------------------------: |
| Accepted Allocation      | Accepted authority            |              Claims only |              No |                                         Yes |
| Realization              | Future transition evidence    |                       No |              No |                                     Not yet |
| Scheduled Goal Work type | Scheduled reality contract    |                     Owns |             Yes | Type only unless existing tests instantiate |
| Scheduled Support type   | Scheduled reality contract    |                     Owns |             Yes | Type only unless existing tests instantiate |
| Realized Buffer type     | Scheduled protection contract |                 Protects |              No | Type only unless existing tests instantiate |
| Preview                  | Derived                       | No independent ownership |              No |                                  Disposable |
| Execution                | Historical evidence           |                       No | Evidence itself |                                    Existing |
| Published Plan           | Immutable schedule history    |               Historical |              No |                                    Existing |

---

## 111. Required Authority Transition Matrix

| Transition                             |               User Authority Required? |              Implemented in 9.2.2? |
| -------------------------------------- | -------------------------------------: | ---------------------------------: |
| Proposal → ProposalDecision            |                                    Yes |                           Existing |
| ProposalDecision → Accepted Allocation |                                    Yes |                           Existing |
| Accepted Allocation → Realization      |    No new authority; bounded automatic |                                 No |
| Realization → Scheduled Goal Work      |                       No new authority |                                 No |
| Realization → Scheduled Support        |                       No new authority |                                 No |
| Realization → Buffer Protection        |                       No new authority |                                 No |
| Scheduled subject → Execution          |                  Actual-world evidence | Existing future compatibility only |
| Schedule → Published Plan              | Existing explicit publication workflow |                 Compatibility only |
| Scheduled → Progress                   |                 No implicit transition |                                 No |

---

## 112. Required Provenance Matrix

For future realized facts verify retention of:

| Provenance          |        Goal Work |    Support |     Buffer | Publication |
| ------------------- | ---------------: | ---------: | ---------: | ----------: |
| Realization ID      |              Yes |        Yes |        Yes |         Yes |
| Accepted Allocation |              Yes |        Yes |        Yes |         Yes |
| Accepted claim      |              Yes |        Yes |        Yes |         Yes |
| ProposalDecision    |              Yes |        Yes |        Yes |         Yes |
| Proposal/option     |              Yes |        Yes |        Yes |         Yes |
| Goal                |              Yes | Via parent | Via target |         Yes |
| Demand              |              Yes | Via parent | Via target |         Yes |
| Candidate Parent    |              Yes |        Yes |        Yes |         Yes |
| footprint component | where applicable |        Yes |        Yes |         Yes |
| exact interval      |              Yes |        Yes |        Yes |         Yes |
| user-day            |              Yes |        Yes |        Yes |         Yes |
| schedule role       |              Yes |        Yes |        Yes |         Yes |

---

## 113. Required Invariants

Explicitly verify:

1. Accepted Allocation remains unscheduled authority.
2. No realization occurs.
3. accepted-allocation is a first-class schedule origin.
4. productive Goal work is distinct from support.
5. support is distinct from Buffer.
6. Buffer is non-activity.
7. Buffer is non-executable.
8. productive Goal work is execution-capable.
9. support is execution-capable.
10. schedule role is not inferred from display category.
11. accepted claim identity survives into future scheduled identity.
12. scheduled subject identity is deterministic.
13. same accepted claim maps to same future subject ID.
14. future realization can detect duplicates.
15. exact accepted geometry is preserved.
16. canonical user-day is preserved.
17. no recurrence metadata is invented.
18. no template identity is invented.
19. no manual-event identity is invented.
20. no Work identity is reused.
21. schedule readers can distinguish new roles.
22. Preview remains derived.
23. no accepted allocation appears in Preview without realization.
24. Preview baseline is unchanged.
25. Friction behavior is unchanged.
26. PlanDecision behavior is unchanged unless identity union extension is required.
27. CompositeDecision semantics are unchanged.
28. execution records can type future Goal/support subjects.
29. execution cannot target Buffer.
30. scheduling creates no Progress.
31. execution creates no automatic Progress under this task.
32. publication can preserve accepted lineage.
33. publication preserves schedule role.
34. historical Buffer remains non-executable.
35. legacy publication remains readable.
36. legacy execution remains readable.
37. old schedule sources remain readable.
38. no legacy record is reinterpreted as accepted allocation.
39. direct authoring remains separate.
40. Goal-linked Commitment remains distinct.
41. Task 8.4 Composition remains distinct.
42. Capacity semantics remain unchanged.
43. Feasibility semantics remain unchanged.
44. Proposal/Accepted Allocation semantics remain unchanged.
45. schema/backup versioning is evidence-driven.
46. no new durable realization store is created.
47. equivalent semantic inputs yield equivalent scheduled subject identities.
48. provenance does not depend on labels/titles.
49. realization mappings are one-to-one with accepted claims except documented Buffer union handling.
50. Task 9.3 can implement realization without adding a new schedule/execution/publication identity concept.

---

## 114. Completion Criteria

Task 9.2.2 is complete only when:

1. accepted-allocation schedule origin exists;
2. productive/support/Buffer schedule roles exist;
3. Goal Work has a valid future scheduled representation;
4. support has a valid future scheduled representation;
5. Buffer has a valid protection representation;
6. Buffer is structurally non-executable;
7. stable scheduled subject identity exists;
8. accepted claim lineage survives;
9. realization ID seam exists;
10. Goal/Demand lineage survives;
11. component lineage survives;
12. exact interval/user-day survive;
13. no placement/recurrence semantics are added;
14. execution subjects support Goal work;
15. execution subjects support support activity;
16. execution rejects Buffer;
17. publication can preserve all three roles;
18. publication can preserve Accepted Allocation lineage;
19. historical readers remain compatible;
20. legacy origins remain unchanged;
21. Preview readers can support future realized roles;
22. Preview output remains unchanged without realization;
23. Friction readers can support future realized subjects where required;
24. no new Friction behavior occurs;
25. no Accepted Allocation is realized;
26. no schedule mutation occurs from acceptance;
27. no execution occurs;
28. no Progress occurs;
29. no new recurrence occurs;
30. no synthetic template/manual/Work identity is used;
31. persistence/version decisions are explicit;
32. Backup/restore remains safe;
33. focused tests pass;
34. full regression passes;
35. typecheck passes;
36. lint passes;
37. build passes;
38. bundle hard limits pass;
39. `git diff --check` passes;
40. governance is updated;
41. RESULT exists;
42. Task 9.3 architecture reopen is explicitly assessed;
43. Task 9.3 can consume the new contracts without another downstream identity redesign.

---

## 115. Task 9.3 Readiness Requirement

The RESULT must explicitly answer:

> **Can Task 9.3 now atomically map every Accepted Allocation V2 productive/support/Buffer claim into a stable schedule/protection identity, expose productive/support subjects to execution, expose all roles to publication/history and Friction/Preview readers, and preserve exact accepted lineage without overloading legacy template/Work/manual identities?**

Expected answer:

> **Yes.**

If the answer is not unequivocally yes, Task 9.3 remains blocked.

---

## 116. Expected Next Task

If Task 9.2.2 completes successfully:

> **Task 9.3 — Accepted Allocation Realization V1**

Task 9.3 should then implement only:

```text id="8nvue2"
validate complete Accepted Allocation
→ atomically materialize exact scheduled/protection facts
→ persist realization
→ integrate current schedule/Capacity/Preview/Friction/publication
```

It should not need to invent:

* resource footprint;
* schedule roles;
* execution subject types;
* publication origins.

---

## 117. Architecture-Reopen Completion Statement

The RESULT must include a statement materially equivalent to:

> **Task 9.2.2 resolves the remaining scheduled-identity, execution-subject, and publication-provenance portions of the Task 9.3 architecture reopen. Complete Accepted Allocation V2 authority now has an exact downstream identity contract for productive Goal work, support activity, and Buffer protection. No realization has occurred. Task 9.3 is unblocked if all stated readiness criteria pass.**

---

## 118. Final Completion Statement

The Task 9.2.2 RESULT must end with a completion statement materially equivalent to:

> **Task 9.2.2 — Realized Schedule Identity Foundation V1 complete.**
>
> DayFrame now has explicit downstream identity contracts capable of representing the exact scheduled reality authorized by complete Accepted Allocation V2 records without overloading legacy schedule semantics: `acceptedAllocation` is a first-class schedule origin, productive Goal work, operational support activity, and Buffer protection remain distinct schedule roles, productive and support subjects own time and are execution-capable while Buffer protects time and is structurally non-executable, and every future realized subject preserves deterministic identity, exact accepted `[start,end)` geometry, canonical user-day, accepted claim identity, Realization seam, ProposalDecision/Proposal/Goal/Demand provenance, Candidate Parent lineage, and source-component evidence; realized accepted facts do not become BlockCandidates, templates, recurrences, Work, or manual events, and their exact geometry cannot be silently re-placed; execution identity can target stable Goal-work and support subjects across Preview regeneration, restart, publication, and history while rejecting Buffer and creating no automatic Progress semantics; Preview, Friction, SuggestedFix, PlanDecision, and generic schedule-reader type surfaces can distinguish the new roles without creating any realized instance or changing existing runtime behavior; publication and HistoricalPlan contracts can freeze accepted-allocation origin, schedule role, exact interval, scheduled subject/protection identity, Realization lineage, Accepted Allocation, accepted claim, ProposalDecision, Proposal, Goal/Demand, and component provenance while preserving all legacy schedule, execution, and publication records without historical inference; persistence, serialization, validation, record versioning, backup/restore compatibility, deterministic identity, exhaustive-switch handling, bundle limits, and regression coverage are preserved; no Accepted Allocation has been realized, no scheduled Goal work/support/Buffer has been created from acceptance, no execution has occurred, no Progress has been inferred, and no recurrence or new user authority has been introduced; the final downstream identity portion of the Task 9.3 architecture reopen is resolved, and Task 9.3 may now implement the atomic Accepted Allocation → scheduled reality transition without inventing any new schedule-role, execution-subject, or publication-origin architecture.
