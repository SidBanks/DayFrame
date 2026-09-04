# Task 8.2 — Goal Structure V1 Domain and Persistence

## Status

Ready for implementation.

## Phase

Phase 8 — Goal and Capacity Foundations

## Task Type

Domain-authority and persistence implementation task.

Task 8.2 is the first Phase 8 domain implementation built on the substrate established by Task 8.1.

Task 8.1 completed the Revisioned Planning Provenance and Freshness Foundation with:

* opaque planning-fact identity;
* distinct logical and revision identity;
* typed provenance/origin;
* dependency references;
* deterministic dependency fingerprints;
* Current / Stale / Unknown freshness;
* canonical user-day coverage;
* qualification;
* structured reason codes;
* exact historical revision resolution;
* bounded migration/validation;
* a thin internal `contributesTo` Goal-relationship evidence slice.

Task 8.1 deliberately did **not** create live Goal Structure authority, persistence participation, Goal Structure UI, or the broader Goal Structure domain. Existing scheduling and user-facing behavior remained unchanged, and the full repository passed 96 files / 987 tests.

Task 8.2 now consumes that foundation to implement the first bounded Goal Structure authority.

All durable Phase 8 Codex result artifacts belong in:

`/home/sid/Penn Digital Services/DayFrame/docs/implementation/phase-8/`

---

## 1. Primary Objective

Implement **Goal Structure V1** as a first-class, revisioned, persisted DayFrame domain.

Goal Structure must allow DayFrame to represent explicit structural relationships among Goals without conflating those relationships with:

* Goal Demand;
* Goal Priority;
* Commitments;
* scheduling;
* Progress;
* Goal service/provenance links;
* recommendations;
* inferred hierarchy.

The target relationship model is:

```text
Goal
├─ may relate structurally to another Goal
├─ may participate in Milestone structure where accepted architecture requires
└─ later produces/owns Goal Demand through a separate domain
```

Task 8.2 establishes structural authority.

It does not allocate time.

---

## 2. Governing Architecture

Before implementation, inspect the exact accepted Goal Structure architecture/specification and the Post-Phase-7 synthesis.

Do not reconstruct Goal Structure semantics from this task alone.

Also inspect:

* Task 8.1 result;
* Post-Phase-7 Implementation Alignment Strategy;
* Post-Phase-7 Implementation Roadmap;
* current Goal domain;
* current Goal-link/service-association implementation;
* Goal history;
* Goal persistence;
* backup/restore;
* Goal-related query/read models;
* Goal-related tests.

Where this task conflicts with the accepted Goal Structure specification, the accepted specification wins.

Report exact governing filenames used.

---

## 3. Roadmap Position

The governing roadmap places Goal Structure immediately after the shared foundation and before full Goal Demand projection:

```text
Planning provenance/freshness foundation
→ Goal Structure
→ Goal Demand Intent + Goal Priority
→ Demand Projection
```

Goal Structure establishes correct structural eligibility and accounting before Demand normalization.

Task 8.2 must leave the repository ready for Goal Demand/Priority work without beginning it.

---

## 4. Preserve Existing Goal Identity

Reuse the existing Goal identity/lifecycle wherever architecture permits.

Do not replace existing Goal UUIDs merely to make them use `PlanningFactId`.

If Task 8.1's planning identity primitives can safely reference existing Goal IDs through typed dependency/provenance adapters, do that.

Preserve:

* existing Goal IDs;
* existing Goal lifecycle semantics;
* existing Goal measurement definitions;
* existing Progress observations;
* existing Goal history;
* existing Commitment-to-Goal service links;
* existing Summary behavior.

Goal Structure is adjacent authority, not a replacement Goal model.

---

## 5. Structural Relationship Types

Implement the exact relationship kinds defined by the accepted Goal Structure specification.

The accepted post-Phase-7 architecture expects typed relationships including:

* `contains`;
* `contributesTo`;
* `dependsOn`.

Confirm exact names and semantics from the specification before coding.

Do not introduce generic:

```text
children[]
```

or:

```text
parentId
```

as the authoritative structural model if that would erase relationship semantics.

Each relationship kind must retain its own meaning.

---

## 6. Relationship Identity

Each structural relationship must have its own durable logical identity.

A relationship is not identified solely by:

```text
fromGoalId + toGoalId
```

because:

* its authority has a lifecycle;
* its revision history matters;
* relationships may be retired/replaced;
* historical consumers must resolve exact versions.

Use the Task 8.1 identity/revision substrate where appropriate.

---

## 7. Relationship Revision

Goal Structure relationships must be revisioned.

A relationship revision changes when semantically relevant relationship authority changes.

A revision must not change merely because:

* it is read;
* query ordering changes;
* UI state changes;
* unrelated Goals change;
* derived structural analysis reruns.

Reuse the Task 8.1 revision conventions rather than inventing a second revision system.

---

## 8. Relationship Endpoints

Every relationship must reference exact Goal identities.

Validate:

* source Goal exists where required;
* target Goal exists where required;
* source and target satisfy accepted lifecycle rules;
* self-relations are handled according to the accepted specification;
* unsupported endpoint types fail validation.

Do not silently create missing Goals.

---

## 9. Relationship Direction

Relationship direction must be explicit and deterministic.

For example, if architecture defines:

```text
Goal A contains Goal B
```

the persisted representation must not rely on UI ordering to infer which endpoint contains the other.

Likewise:

```text
Goal A contributesTo Goal B
```

must remain distinguishable from:

```text
Goal B contributesTo Goal A
```

where architecture treats them differently.

---

## 10. Relationship Semantics

Do not flatten structural relationships into one generic hierarchy.

At minimum preserve the architectural distinction that:

### `contains`

Expresses structural decomposition/containment.

### `contributesTo`

Expresses contribution without necessarily establishing containment.

### `dependsOn`

Expresses structural dependency/eligibility relationship.

Use the accepted specification for exact effects.

Do not invent scheduling consequences.

---

## 11. Cycle / Invalid-Graph Rules

Implement the Goal Structure specification's graph-validity rules.

At minimum determine and test:

* whether `contains` cycles are prohibited;
* whether dependency cycles are prohibited or separately classified;
* whether contribution cycles are valid, invalid, or non-hierarchical;
* whether mixed-edge cycles require validation;
* how invalid relationships fail.

Do not assume all relationship kinds share identical graph rules.

Fail explicitly rather than silently repairing a graph.

---

## 12. Structural Eligibility

Implement the minimum deterministic structural eligibility/query behavior required by the accepted Goal Structure architecture.

Goal Structure may affect whether a Goal is structurally eligible for future Demand reasoning.

Task 8.2 may expose this as an internal/query result.

It must not create Demand.

Eligibility must be explainable from exact structural facts.

---

## 13. Structural Status

Where required by architecture, distinguish:

* structurally active;
* structurally blocked;
* structurally incomplete;
* unavailable/unknown.

Use structured reasons where the accepted specification requires them.

Do not use scheduling/Friction terminology for structural conditions.

---

## 14. Goal Lifecycle Interaction

Define and implement exact behavior when a related Goal is:

* active;
* completed;
* archived;
* retired/deleted if supported;
* otherwise unavailable.

Use accepted Goal Structure semantics.

Do not automatically delete historical relationship authority merely because a current Goal changes lifecycle.

Current structural applicability and historical relationship truth are different concerns.

---

## 15. Milestones

Implement the Milestone authority required by the accepted Goal Structure specification.

First verify the specification's exact Milestone model.

A Milestone must remain distinct from:

* Goal;
* Commitment;
* scheduled event;
* Demand;
* Progress observation.

Do not invent time ownership for Milestones.

If the accepted specification defines Milestones as versioned Goal-structure authority, implement that bounded model.

---

## 16. Milestone Identity / Revision

Milestones must use durable identity and revision semantics consistent with Task 8.1.

Historical consumers must eventually be able to identify:

```text
Milestone M
revision M4
```

rather than resolving only the current Milestone.

---

## 17. Milestone Relationships

Implement only the structural relationships between Goals and Milestones explicitly defined by architecture.

Do not create a generalized arbitrary graph-node system merely because Goals and Milestones can both participate in structure.

Prefer typed relationships with explicit endpoint contracts.

---

## 18. Goal Service Links Remain Separate

Existing Goal-to-Commitment links must remain service/provenance association.

Do **not** migrate them into:

* `contains`;
* `contributesTo`;
* `dependsOn`;
* Milestone relationships;
* Demand.

A Commitment linked to a Goal does not prove a structural relationship among Goals.

The Alignment Strategy explicitly preserves existing Goal links while replacing their former planning interpretation with explicit future Demand semantics.

---

## 19. No Inferred Structure

Migration must not infer Goal Structure from:

* Goal titles;
* categories;
* Commitment links;
* shared measurements;
* execution history;
* Progress;
* existing schedule;
* creation order;
* UI grouping.

Existing users begin with no Goal Structure relationships unless explicit historical authority already exists.

Unknown structure means unknown/unset—not inferred.

---

## 20. Provenance

Every Goal Structure authority record must use or integrate with the Task 8.1 provenance foundation.

At minimum preserve:

* authored-authority role;
* exact relationship/Milestone identity;
* exact revision;
* origin;
* legacy qualification where relevant.

Do not let provenance metadata itself grant relationship authority.

---

## 21. Dependency References

Goal Structure-derived results must identify exact structural dependencies through Task 8.1 dependency references.

For example, a structural eligibility result should be able to identify the exact relationship revisions it depended upon.

Do not fingerprint the entire Goal store.

---

## 22. Dependency Fingerprints

Use Task 8.1 dependency fingerprinting for derived structural results where freshness matters.

Equivalent structural dependency sets must produce equivalent fingerprints.

Changing a relevant relationship revision must invalidate dependent structural evidence.

Unrelated Goal changes must not automatically invalidate every structural result.

---

## 23. Freshness

Use Task 8.1's typed freshness model for derived Goal Structure evidence where applicable.

Preserve:

```text
current
stale
unknown
```

Do not introduce a second incompatible freshness vocabulary without architectural reason.

Unknown decisive structural dependencies must fail conservatively.

---

## 24. Structured Reasons

Use or extend the bounded structured-reason pattern for Goal Structure.

Create only reason codes actually required by V1.

Potential categories may include:

* invalid relationship;
* structural cycle;
* missing endpoint;
* lifecycle-inapplicable endpoint;
* dependency blocked;
* incomplete structure.

Use exact architectural semantics.

Do not predefine Demand/Capacity/Proposal reasons.

---

## 25. Persistence Model

Goal Structure is now live authored authority and must participate in DayFrame persistence.

Persist at minimum:

* relationship logical identity;
* current revision;
* required authored relationship payload;
* retained revision/history data required by architecture;
* Milestone authority/history where implemented;
* provenance;
* lifecycle/applicability data required for exact restore.

Use versioned validation.

---

## 26. Persistence Location

Inspect current state organization before deciding whether Goal Structure belongs:

* inside the existing Goal state;
* in a sibling planning-authority collection;
* in another architecture-consistent bounded store.

Do not create a second unrelated application store merely for convenience.

The choice must support later Goal Demand and history without collapsing them into Goal Structure.

Report the implementation decision.

---

## 27. Migration

Add an explicit migration from existing persisted state.

Existing users should migrate to:

```text
existing Goals preserved
+
existing Goal links preserved
+
empty Goal Structure authority
```

unless exact prior structural authority can be proven.

Do not infer relationships.

Migration must be deterministic and idempotent according to existing migration conventions.

---

## 28. Protected Restore

Malformed Goal Structure persisted state must follow existing DayFrame protected-state/quarantine behavior.

Do not:

* partially accept malformed authority;
* silently delete invalid relationships and continue as if structure were complete;
* treat unsupported future versions as current.

Fail safely.

---

## 29. Backup Integration

Because Task 8.2 introduces live authored authority, register Goal Structure with the current backup system.

If this requires advancing Backup V6 to a new version, do so according to established version/migration conventions.

Requirements:

* export includes Goal Structure;
* restore preserves IDs/revisions;
* relationship history survives;
* Milestones survive;
* malformed backup data fails safely;
* older backups remain importable through migration/compatibility;
* no structure is inferred for older backups.

Do not alter profile semantics except as necessary to preserve complete authored setup if profiles currently snapshot Goal authority.

---

## 30. Profile Compatibility

Inspect whether saved profiles currently include Goals or Goal-adjacent authored state.

If Goal Structure must be included to prevent data loss when a profile is saved/loaded under current Phase 8 compatibility rules, extend profile serialization carefully.

Do not redesign profiles.

Do not retire them.

Do not create template/scenario semantics.

If profiles do not own Goals, document why no profile change is needed.

---

## 31. Store Actions

Introduce the minimum explicit store/domain actions required to author Goal Structure.

Potential actions may include:

* create relationship;
* revise relationship;
* retire/remove relationship;
* create Milestone;
* revise Milestone;
* retire Milestone.

Use actual architecture and current store conventions.

Do not expose generic `setGoalStructure(any)` mutation.

Every mutation must preserve revision/history invariants.

---

## 32. Atomic Mutation

A Goal Structure mutation must be atomic.

Validation occurs before authority changes.

A failed relationship change must not leave:

* half-written current state;
* history without current authority;
* current authority without history;
* mismatched revision;
* partially updated endpoint indexes.

---

## 33. Revision History

Retain exact relationship and Milestone revisions according to accepted historical requirements.

At minimum future code must be able to resolve:

```text
relationship ID + revision
```

exactly.

Reuse Task 8.1 historical-resolution principles.

Do not silently compact away exact revisions required by downstream provenance.

---

## 34. Deletion / Retirement

Use the architecture's lifecycle semantics rather than destructive deletion where historical authority must remain referentially resolvable.

If user-facing deletion is not yet exposed, still establish correct domain behavior.

Historical records must not become dangling references merely because current structure is retired.

---

## 35. Query Boundary

Provide a bounded non-UI query/read boundary for Goal Structure.

At minimum future consumers should be able to obtain:

* current structural relationships for a Goal;
* exact relationship revision;
* relevant Milestones;
* structural eligibility/status where implemented;
* structured reasons;
* dependency references/fingerprint where applicable.

Do not require consumers to inspect raw persistence arrays.

---

## 36. Deterministic Ordering

Query results must use explicit deterministic ordering.

Do not rely on:

* object insertion order;
* storage order;
* incidental array order.

Choose stable ordering based on architecture-appropriate keys.

Ordering must not create semantic priority unless explicitly defined.

---

## 37. Goal Structure History Query

Provide exact historical resolution sufficient for future Demand Projection and historical explanation.

A consumer asking for relationship revision 2 must not receive revision 4.

Missing exact history must fail explicitly.

---

## 38. No Scheduling Effects

Goal Structure must not change:

* Work;
* Commitment candidate generation;
* placement;
* Preview;
* Friction;
* Suggested Fix;
* publication;
* Today;
* execution;
* Progress.

A newly authored `dependsOn` relationship does not itself reserve time.

A `contains` relationship does not itself schedule the child Goal.

A Milestone does not create a calendar event.

---

## 39. No Goal Demand

Task 8.2 must not implement Goal Demand.

Goal Structure may provide future eligibility inputs.

It must not create:

* effort requests;
* session durations;
* cadence;
* target allocation;
* Capacity claims.

Those belong downstream.

---

## 40. No Goal Priority

Task 8.2 must not introduce Goal Priority unless the accepted Goal Structure specification itself requires a narrowly structural ordering field distinct from planning priority.

Do not reuse:

* Commitment/template priority;
* Goal display order;
* relationship order;

as Goal Priority.

Goal Priority belongs to the subsequent Demand/Priority increment.

---

## 41. No Progress Inference

Do not infer structural completion or Milestone satisfaction merely from elapsed scheduled effort unless the accepted architecture explicitly defines such evidence.

Progress remains explicit outcome evidence.

Goal Structure may reference Goal lifecycle/Progress where architecture permits, but it must not silently manufacture Progress.

---

## 42. Minimal Internal Exposure

Task 8.2's primary deliverable is domain authority, persistence, history, and query support.

Minimal Goal-detail/Teach exposure is allowed only if:

* the roadmap/specification explicitly requires it for this increment;
* the authority lifecycle is complete;
* it does not begin broader Phase 8 UX work.

If UI exposure is not necessary to prove the domain, keep Task 8.2 non-UI and leave authoring surface work for a subsequent task.

Document the decision.

---

## 43. Task 8.1 Vertical Slice

Inspect `revisionedGoalRelationship.ts`.

Decide whether to:

* promote/adapt it into the real Goal Structure domain;
* reuse portions;
* retire the demonstration wrapper after equivalent production authority exists.

Do not leave two competing relationship models.

The Task 8.1 slice was intentionally temporary evidence.

---

## 44. Foundation Reuse

Prefer the Task 8.1 foundation for:

* IDs where appropriate;
* revisions;
* provenance;
* dependency references;
* fingerprints;
* freshness;
* coverage where needed;
* qualification;
* reasons;
* historical exact-resolution semantics.

If a foundation primitive proves insufficient, extend it minimally.

Do not fork equivalent Goal-Structure-specific primitives merely for convenience.

---

## 45. Foundation Regression

Task 8.1 invariants remain active.

At minimum preserve:

* identity/revision distinction;
* deterministic declared-dependency fingerprints;
* Current/Stale/Unknown;
* exact historical resolution;
* explicit legacy unknown;
* clock-free fingerprinting;
* restore identity stability;
* malformed-data failure;
* no authority from persistence/provenance alone.

Run Task 8.1 foundation tests.

---

## 46. Goal Structure Invariants

Implement and test at minimum:

### T82-INV-01

A Goal Structure relationship has durable logical identity distinct from revision identity.

### T82-INV-02

Relationship direction and kind are explicit authority.

### T82-INV-03

Different relationship kinds are not semantically interchangeable.

### T82-INV-04

Relationship revision changes only when declared semantic relationship authority changes.

### T82-INV-05

Historical relationship resolution is exact by ID and revision.

### T82-INV-06

Missing historical revision never resolves to current revision.

### T82-INV-07

Goal Structure is explicit authored authority and is never inferred from Goal links, schedule, Progress, or naming.

### T82-INV-08

Existing Goal service links remain distinct from structural relationships.

### T82-INV-09

Invalid structural graphs fail according to relationship-specific graph rules.

### T82-INV-10

Malformed persisted Goal Structure cannot silently become valid authority.

### T82-INV-11

Unsupported future persisted versions fail safely.

### T82-INV-12

Backup/restore preserves Goal Structure IDs and revisions.

### T82-INV-13

Older backups restore with no invented Goal Structure.

### T82-INV-14

Goal Structure does not own time.

### T82-INV-15

Goal Structure does not create Goal Demand.

### T82-INV-16

Goal Structure does not create Goal Priority.

### T82-INV-17

Goal Structure mutations are atomic.

### T82-INV-18

Retired structure remains historically resolvable where required.

### T82-INV-19

Derived structural evidence identifies only its declared dependencies.

### T82-INV-20

Relevant relationship revision changes make dependent structural evidence stale.

### T82-INV-21

Unrelated state changes do not make structural evidence stale.

### T82-INV-22

Milestones do not become Commitments or scheduled events merely by existing.

### T82-INV-23

Goal Structure does not infer Progress.

### T82-INV-24

Equivalent inputs produce deterministic structural query results.

### T82-INV-25

Existing scheduling output remains unchanged for equivalent authored scheduling state.

---

## 47. Domain Tests

Add focused Goal Structure tests covering at minimum:

* relationship creation;
* identity;
* revision;
* semantic no-op handling;
* relationship kinds;
* direction;
* endpoint validation;
* self-relation behavior;
* graph/cycle validation;
* lifecycle interaction;
* structural status/eligibility;
* deterministic ordering;
* exact historical resolution;
* retirement;
* malformed input;
* provenance;
* dependency fingerprint;
* freshness.

Use specification-specific examples.

---

## 48. Milestone Tests

If Milestones are part of Goal Structure V1, test:

* creation;
* identity/revision;
* Goal association;
* lifecycle;
* validation;
* history;
* persistence;
* backup/restore;
* no scheduling effect;
* no automatic Progress.

Do not omit Milestone tests merely because no UI exists.

---

## 49. Persistence Tests

Test:

* empty migration from existing state;
* new Goal Structure round-trip;
* malformed state;
* unsupported future version;
* revision history preservation;
* exact IDs after restore;
* no inferred structure;
* atomic failed mutation;
* deterministic serialization where required.

---

## 50. Backup Tests

Test:

* current backup export;
* current backup restore;
* older backup import;
* Goal Structure round-trip;
* Milestone round-trip where applicable;
* malformed structure rejection/protected behavior;
* no ID/revision regeneration.

If backup schema version advances, test its migration path explicitly.

---

## 51. Profile Tests

If profile serialization changes, add focused tests proving:

* save preserves Goal Structure;
* load restores exact authority;
* revisions/IDs survive;
* old profiles load with empty structure;
* no inferred relationships.

If profile serialization does not change, record the evidence showing why.

---

## 52. Store Tests

If store actions are added, test:

* valid creation;
* valid revision;
* semantic no-op;
* invalid mutation rejection;
* history update;
* retirement;
* restore;
* atomicity;
* no unrelated scheduling-state mutation.

---

## 53. Scheduling Regression

Because Goal Structure must not affect scheduling yet, explicitly prove equivalence.

At minimum add or run a regression demonstrating:

```text
same authored scheduling state
+
different Goal Structure
→
same generated schedule
```

until a future accepted architecture explicitly introduces Goal-derived scheduling through Demand/Proposal.

This is a critical epistemic boundary.

---

## 54. Existing Goal Regression

Run current Goal/Progress/measurement/history tests.

Ensure:

* existing Goal creation still works;
* existing Goal links still work;
* Progress remains unchanged;
* Summary remains unchanged unless explicitly and minimally extended;
* historical Goal snapshots remain readable.

---

## 55. Existing Scheduling Regression Suites

Run suites covering:

* engine;
* Work/cycles;
* Commitment recurrence;
* placement;
* Preview;
* Friction;
* PlanDecision;
* publication;
* execution;
* Progress;
* Month;
* store;
* backup.

Task 8.2 must not cause schedule differences.

---

## 56. DF-006

DF-006 remains:

* RC7;
* BR5;
* S2;
* historical defect confirmed and bounded.

Task 8.2 is not a DF-006 repair.

If persistence/store changes touch relevant Work/Preview/Month state, run the named DF-006 REG-01–17 suite.

Otherwise preserve the continuous regression requirement without unrelated changes.

Do not claim DF-006 fixed.

---

## 57. Formatting / Static Validation

Inspect repository scripts and run applicable standard validation.

Expected commands include, where available:

```text
npm run format
npm test
npm run typecheck
npm run lint
npm run build
npm run check:bundle
```

Run the full test suite before completion unless genuinely impractical.

Report exact commands/results.

The Task 8.1 baseline was 96 files / 987 tests; the expected Task 8.2 total should be at least that baseline plus new tests unless repository changes legitimately alter counts.

---

## 58. Bundle Discipline

Task 8.1 recorded an existing initial-gzip warning 515 bytes above the warning threshold while hard bundle policy still passed.

Task 8.2 should not materially worsen initial bundle size for a primarily domain/persistence task.

If bundle size increases:

* report exact change;
* identify why;
* preserve lazy surface boundaries;
* do not pull Goal Structure UI into initial bundle merely to prove the domain.

Hard bundle policy must pass.

---

## 59. Performance

Goal Structure queries should operate on bounded structural data.

Avoid repeated whole-store scans where simple indexing or bounded adjacency structures are justified.

Do not prematurely build a generic graph database.

Graph validation should be deterministic and proportionate to expected personal-scale Goal counts.

Correctness first.

---

## 60. Accessibility

No new UI is required by default.

If minimal Goal Structure UI is introduced, it must support:

* keyboard operation;
* visible focus;
* accessible names;
* relationship kind communicated without color alone;
* validation/error announcement;
* understandable directionality.

Do not introduce inaccessible temporary authoring controls.

---

## 61. Diagnostics

Goal Structure should support future explanation of:

> Why is this Goal structurally blocked?

and:

> Which exact relationship caused this?

Internal/query evidence should therefore retain:

* relationship ID;
* relationship revision;
* relationship kind;
* endpoint IDs;
* structured reason;
* dependency fingerprint where relevant.

Do not rely solely on rendered prose.

---

## 62. Implementation Decisions

Record implementation decisions such as:

* relationship storage shape;
* adjacency/query representation;
* revision-history representation;
* graph-validation algorithm;
* Milestone representation;
* persistence version;
* backup version;
* profile participation;
* Task 8.1 slice promotion/retirement.

Do not create new architectural semantics.

---

## 63. Architecture Reopen Rule

Expected: **No architecture reopen.**

If implementation evidence contradicts the accepted Goal Structure specification:

1. stop the contradictory portion;
2. preserve working behavior;
3. identify exact architecture statement;
4. identify exact implementation evidence;
5. classify the contradiction;
6. recommend bounded reconciliation.

Do not silently weaken the architecture.

---

## 64. Governance Updates

After successful implementation:

Update:

* `CURRENT_STATE.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` only if a genuine durable implementation decision warrants it.

Do not rewrite:

* architecture specifications;
* Alignment Strategy;
* Post-Phase-7 Roadmap.

If Phase 8 tracking/governance exists, update it only according to established convention.

---

## 65. Phase 8 Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/implementation/phase-8/TASK_8_2_GOAL_STRUCTURE_V1_DOMAIN_AND_PERSISTENCE_RESULT.md`

The filename must contain `RESULT`.

Do not place Task 8.2's result in `/docs/results`.

Do not create another Phase 8 result directory.

All subsequent Phase 8 durable Codex implementation results should continue using:

`/home/sid/Penn Digital Services/DayFrame/docs/implementation/phase-8/`

unless governance is explicitly changed later.

---

## 66. Result Artifact Contents

The Task 8.2 result must include:

1. Executive Result
2. Scope Delivered
3. Governing Evidence Used
4. Task 8.1 Foundation Reuse
5. Existing Goal Model Assessment
6. Files Added
7. Files Modified
8. Relationship Model
9. Relationship Kinds
10. Relationship Identity / Revision
11. Endpoint / Direction Semantics
12. Graph Validation
13. Structural Eligibility / Status
14. Goal Lifecycle Interaction
15. Milestone Model
16. Provenance / Dependency Integration
17. Freshness / Reason Integration
18. Persistence Model
19. Migration
20. Backup Integration
21. Profile Compatibility
22. Store Actions
23. Mutation Atomicity
24. Revision History
25. Retirement / Historical Resolution
26. Query Boundary
27. Task 8.1 Vertical Slice Disposition
28. Scheduling Boundary
29. Goal Demand Boundary
30. Goal Priority Boundary
31. Progress Boundary
32. Tests Added
33. Persistence / Backup Tests
34. Scheduling Regressions
35. Full Regression Results
36. Validation Commands / Results
37. Bundle Result
38. Performance Notes
39. Compatibility Notes
40. DF-006 Relationship
41. Implementation Decisions
42. Deviations
43. Architecture Reopen Check
44. Governance Updates
45. Repository Status
46. Completion Assessment
47. Recommended Next Task
48. Completion Statement

---

## 67. Repository Status Discipline

Before implementation:

1. inspect `git status`;
2. verify Sidney's latest pushed checkpoint or record pre-existing changes;
3. confirm Task 8.1 result exists in the Phase 8 directory;
4. inspect Task 8.1 implementation files.

During implementation:

* modify only Task 8.2-owned files and required shared foundation files;
* avoid unrelated cleanup;
* preserve current behavior.

After implementation:

1. inspect `git diff --stat`;
2. inspect all relevant diffs;
3. inspect `git status`;
4. verify all changes are attributable to Task 8.2 or required governance;
5. reopen the Task 8.2 result artifact;
6. verify its exact path and contents.

Do not commit or push unless separately authorized.

---

## 68. Completion Criteria

Task 8.2 is complete only when:

* [ ] accepted Goal Structure architecture was inspected;
* [ ] Task 8.1 foundation/result was inspected;
* [ ] current Goal model and Goal links were assessed;
* [ ] existing Goal IDs/lifecycle were preserved;
* [ ] Goal Structure is a first-class domain;
* [ ] exact relationship kinds match accepted architecture;
* [ ] relationship direction is explicit;
* [ ] relationship identity is durable;
* [ ] relationship revision is distinct from identity;
* [ ] semantic no-op revision behavior is correct;
* [ ] endpoint validation exists;
* [ ] self-relation behavior is explicit;
* [ ] relationship-specific graph/cycle rules are implemented;
* [ ] invalid graph mutation fails atomically;
* [ ] structural eligibility/status exists where required;
* [ ] Goal lifecycle interaction matches architecture;
* [ ] Milestones are implemented where required by Goal Structure V1;
* [ ] Milestones remain distinct from Goals/Commitments/Demand/Progress;
* [ ] provenance integrates with Task 8.1;
* [ ] structural dependencies integrate with Task 8.1;
* [ ] derived structural freshness is deterministic where applicable;
* [ ] structured Goal Structure reasons exist where required;
* [ ] live Goal Structure authority persists;
* [ ] migration preserves existing Goals;
* [ ] migration preserves existing Goal links;
* [ ] migration creates no inferred structure;
* [ ] malformed state fails safely;
* [ ] unsupported future versions fail safely;
* [ ] backup includes Goal Structure;
* [ ] older backups remain compatible;
* [ ] backup restore preserves IDs/revisions;
* [ ] profile compatibility was inspected and handled appropriately;
* [ ] store/domain mutations are explicit and atomic;
* [ ] exact revision history is retained;
* [ ] retirement preserves required historical resolution;
* [ ] bounded query/read API exists;
* [ ] deterministic query ordering exists;
* [ ] Task 8.1 demonstration relationship model was promoted/adapted/retired without leaving competing semantics;
* [ ] Goal Structure does not own time;
* [ ] Goal Structure does not create Goal Demand;
* [ ] Goal Structure does not create Goal Priority;
* [ ] Goal Structure does not infer Progress;
* [ ] Goal Structure does not alter scheduling output;
* [ ] invariants T82-INV-01 through T82-INV-25 are covered;
* [ ] Task 8.1 foundation tests remain green;
* [ ] Goal/Progress/history regressions remain green;
* [ ] scheduling regressions remain green;
* [ ] persistence/backup tests remain green;
* [ ] full suite passes;
* [ ] typecheck passes;
* [ ] lint passes;
* [ ] build passes;
* [ ] bundle hard policy passes;
* [ ] result artifact exists at the exact Phase 8 path;
* [ ] result artifact was reopened and verified;
* [ ] governance updates were completed;
* [ ] repository status was inspected;
* [ ] architecture reopen was explicitly assessed;
* [ ] recommended next task was identified;
* [ ] no Goal Demand implementation was started.

---

## 69. Completion Statement

End the Task 8.2 result artifact with exactly:

> **Task 8.2 — Goal Structure V1 Domain and Persistence complete.**
>
> DayFrame now has first-class revisioned Goal Structure authority built on the Phase 8 planning provenance and freshness foundation; structural relationships and Milestones use explicit typed semantics, durable identity, exact revision history, deterministic validation, provenance, dependency evidence, persistence, migration, backup compatibility, and bounded query access without conflating Goal Structure with Goal service links, Goal Demand, Goal Priority, Commitments, scheduling, Progress, or recommendations; existing Goals and historical Goal-linked behavior remain compatible; older persisted and backup state acquires no invented structural authority; malformed or unsupported structural state fails safely; exact historical relationship revisions remain resolvable after current structure changes; Goal Structure produces no time ownership or scheduling effects; existing deterministic scheduling, Preview, Friction, publication, execution, Progress, Month, Today, Summary, persistence, and backup behavior remains intact; DF-006 remains bounded historical regression/observability evidence rather than a speculative repair target; and the repository is ready for the next bounded Phase 8 Goal Demand/Priority implementation task without reopening accepted architecture.

The final Codex response must state:

> **Task:** Task 8.2 — Goal Structure V1 Domain and Persistence
>
> **Result artifact:** `/home/sid/Penn Digital Services/DayFrame/docs/implementation/phase-8/TASK_8_2_GOAL_STRUCTURE_V1_DOMAIN_AND_PERSISTENCE_RESULT.md`
>
> **Goal Structure:** Summarize the relationship, Milestone, lifecycle, graph-validation, persistence, history, and query capability actually implemented.
>
> **Task 8.1 foundation:** Explain how the provenance/freshness foundation was reused and what happened to the thin demonstration relationship slice.
>
> **Migration:** Explain how existing users, Goals, Goal links, persistence, backups, and profiles were handled without inferring structure.
>
> **Scheduling behavior:** Confirm whether equivalent authored scheduling state still produces equivalent schedules. Expected: Yes.
>
> **Goal Demand / Priority:** Confirm neither was implemented. Expected: Neither implemented.
>
> **User-facing behavior:** Report any Goal Structure exposure added. If none, state that the domain remains non-UI.
>
> **DF-006:** Confirm RC7 / BR5 / S2 and no speculative repair.
>
> **Validation:** Report exact focused/full test counts and format/typecheck/lint/build/bundle results.
>
> **Repository status:** Report Task 8.2-created/modified files and pre-existing changes.
>
> **Architecture reopen:** Yes or No.
>
> **Recommended next task:** Report the next bounded Phase 8 task without beginning it.
