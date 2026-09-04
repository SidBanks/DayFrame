# Task 8.4 — Commitment Composition V1 Domain, Pairing, Footprint, and Persistence

**Status:** Ready for Codex
**Phase:** Phase 8 — Goal and Capacity Foundations
**Task Type:** Implementation / Domain Authority / Derived Planning Truth / Persistence / Scheduling Integration
**Primary Responsibility:** Establish first-class Commitment Composition authority and deterministic composition projection so future Capacity and Goal-Specific Feasibility can account for the complete operational footprint of Commitments without introducing Capacity, Allocation, Proposal, or Goal scheduling authority.

---

## 1. Objective

Implement the next bounded Phase 8 capability:

1. **Attachment Relationship V1** as first-class revisioned authority coupling an ordinary parent Commitment source to an ordinary child Commitment source used in an attached role;
2. **Attached Activity V1 behavior** using existing Commitment source identity rather than a new special activity type;
3. **relationship-scoped requiredness, applicability, timing, gap, Buffer, lifecycle, and bounded Goal-support policies**;
4. **deterministic parent-occurrence → attached-occurrence pairing**;
5. **derived Composite Commitment / Composite Occurrence identity and projection**;
6. **Composite Footprint V1** with classified parent, support-activity, Buffer, and unresolved-required-liability intervals;
7. **Composite Liability / Composition Failure V1** sufficient to protect future Capacity semantics and existing authorized schedule correctness;
8. **atomic CompositeDecision V1** where composition-aware occurrence changes require accepted coordinated authority;
9. **historical composition provenance and execution-subject integration**;
10. **persistence, migration, backup, restore, full-clear, compatibility, and regression coverage**.

This task must build directly on:

* Task 8.1 revision/provenance/freshness foundations;
* Task 8.2 Goal Structure authority;
* Task 8.3 Goal Demand/Priority/Projection authority;
* existing Commitment/source/incarnation identity;
* existing recurrence expansion;
* existing Work and cycle expansion;
* existing placement/opening geometry;
* existing source-local Buffer behavior;
* existing `beforeWork` / `afterWork` placement preferences;
* existing Preview, Friction, Suggested Fix, PlanDecision, publication, execution, and history systems;
* canonical variable-duration user-day semantics;
* current persistence/restore/backup architecture.

At completion DayFrame must be able to answer:

> **Given this exact parent Commitment occurrence and current Attachment Relationship authority, what support activities and protected Buffers apply, how are they paired and positioned relative to the parent, what complete operational footprint do they require, and is any required composition obligation unresolved?**

It must **not** yet answer:

> How much general allocatable Capacity exists, whether Goal Demand fits that Capacity, how competing Goals should divide it, or what Goal work DayFrame should propose.

Those belong downstream.

---

## 2. Governing Architecture and Evidence

Before changing code, inspect the current repository and use repository copies of the governing artifacts.

At minimum inspect:

* `docs/architecture/COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_SPECIFICATION_RESULT.md` or authoritative equivalent;
* `docs/audits/COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_AUDIT_RESULT.md`;
* `docs/architecture/POST_PHASE_7_ARCHITECTURE_SYNTHESIS_RESULT.md`;
* `docs/architecture/POST_PHASE_7_IMPLEMENTATION_ALIGNMENT_STRATEGY_RESULT.md`;
* `docs/roadmap/POST_PHASE_7_IMPLEMENTATION_ROADMAP_RESULT.md`;
* `docs/implementation/phase-8/TASK_8.1_REVISIONED_PLANNING_PROVENANCE_AND_FRESHNESS_FOUNDATION_RESULT.md`;
* `docs/implementation/phase-8/TASK_8.2_GOAL_STRUCTURE_V1_DOMAIN_AND_PERSISTENCE_RESULT.md`;
* `docs/implementation/phase-8/TASK_8.3_GOAL_DEMAND_PRIORITY_AND_PROJECTION_V1_RESULT.md`;
* current Commitment/source/incarnation models;
* recurrence types and expansion;
* candidate generation and placement;
* Work generation and Work-relative placement;
* Buffer representation and occupied-interval logic;
* manual event behavior where relevant;
* Friction and Suggested Fix infrastructure;
* PlanDecision authority and replay;
* historical publication;
* execution records;
* Goal service links;
* persistence/database schema;
* restore coordinator/participants/composition/translation;
* runtime/notification authority registries;
* full-clear behavior;
* profile behavior;
* backup/version compatibility;
* bundle governance;
* relevant tests.

If filenames differ, locate authoritative equivalents instead of creating duplicates.

The Commitment Composition / Attached Activities Architecture Specification is normative for composition semantics.

The Post-Phase-7 Implementation Roadmap is normative for sequencing and the requirement that Composition precede Capacity.

Task 8.3 is the executable starting baseline.

Do not reopen accepted architecture merely because implementation requires bounded V1 choices.

---

## 3. Starting Baseline

Task 8.3 established:

* durable revisioned Goal Demand authority;
* durable revisioned Goal Priority authority;
* deterministic Demand Projection;
* canonical bounded user-day projection horizons;
* Task 8.1 provenance/freshness/history integration;
* Task 8.2 structural-eligibility reuse;
* Backup V8;
* database schema version 8;
* explicit empty migration for older Goal-planning state;
* no Capacity;
* no Goal-Specific Feasibility;
* no Competing Demand;
* no Allocation;
* no Proposal;
* no Accepted Allocation;
* no Scheduled Goal Work;
* no scheduling effect from Goal planning authority.

Recorded Task 8.3 validation baseline:

* **104 test files passed**
* **1,003 tests passed**
* **0 failed**
* Prettier pass
* typecheck pass
* lint pass
* build pass
* bundle hard policy pass.

Recorded Task 8.3 initial bundle:

* raw: **677,971 bytes**
* gzip: **169,985 bytes**
* largest lazy: **53,187 bytes**
* total: **807,972 bytes**

Treat bundle headroom as a serious constraint. Do not introduce unnecessary eager framework or UI code.

---

## 4. Architectural Truth to Preserve

Preserve this authority and resource chain:

```text
Commitment source authority
        +
Attachment Relationship authority
        ↓
parent occurrence
        ↓
deterministic component pairing
        ↓
attached activity occurrences + Buffers
        ↓
Composite Occurrence
        ↓
Composite Footprint / Liability
        ↓
future Capacity
        ↓
future Goal-Specific Feasibility
        ↓
future Allocation
        ↓
future Proposal / explicit acceptance
```

For existing authorized Commitment scheduling:

```text
authorized parent
    +
required composition
        ↓
transactional composite realization
        ↓
scheduled parent + scheduled support activities + protected Buffers
        ↓
corrective Friction when required composition cannot remain valid
```

Composition must not become:

* Goal Structure;
* Goal Demand;
* Capacity;
* Allocation;
* Proposal;
* generic workflow sequencing;
* arbitrary task hierarchy.

---

## 5. Core Composition Definition

Implement Commitment Composition according to the accepted definition:

> **Commitment Composition is authored, versioned relationship authority through which real time-owning support activities and protected non-activity time derive applicability, pairing, and timing from a parent Commitment occurrence and are evaluated with it as one operational planning unit.**

The composition relationship is authority.

The Composite Commitment, Composite Occurrence, pairing, footprint, and liability projections are derived truth.

Do not persist a duplicate composite source as a second authority.

---

## 6. Commitment Source Model

Use the accepted **one Commitment type + typed Attachment Relationship** model.

A Commitment source may be:

* independent;
* parent;
* attached child;
* or, where valid, participate in multiple contextual roles under non-conflicting authority.

Do not create a special `AttachedActivity` source subtype merely to mark attachment.

The ordinary child Commitment source retains:

* durable source identity;
* incarnation identity;
* revision semantics;
* title/category metadata;
* planned duration;
* Goal links where independently authored;
* historical continuity;
* execution subject capability.

Attachment status comes from active relationship authority.

---

## 7. Attached Activity Semantics

An Attached Activity is a real activity.

Each applicable attached occurrence:

* has activity identity;
* owns its own time interval;
* reduces future Capacity as activity;
* may be executed independently;
* may carry planned-versus-actual evidence;
* remains historically distinguishable from the parent;
* does not become merely Buffer metadata.

Examples include:

* commute;
* travel;
* preparation requiring actual performed work;
* cleanup requiring performed work;
* other support activity with its own interval and execution meaning.

Do not classify based on label alone.

---

## 8. Buffer Semantics

A Buffer is protected **non-activity** time.

A Buffer:

* reduces future Capacity;
* owns no activity occurrence;
* has no execution subject;
* cannot be completed or skipped as an activity;
* does not provide Goal service by implication;
* does not create Progress;
* may be source-local or relationship-scoped;
* must be historically frozen when applied to published schedule truth.

Preserve existing source-local numeric Buffers.

Do not silently convert legacy Buffers into Attached Activities.

Do not create a global independent Buffer activity entity merely for composition.

---

## 9. Gap vs Buffer

Represent temporal separation and protected time as distinct semantics.

A gap may be:

* exact;
* minimum;
* preferred.

A gap does not consume Capacity merely because it exists.

A Buffer explicitly protects time.

For example:

```text
Commute ends 10 minutes before Work
```

does **not** automatically reserve those 10 minutes.

Only explicit Buffer authority protects them.

---

## 10. Attachment Relationship V1

Implement first-class revisioned Attachment Relationship authority.

Each relationship must contain or reference enough information for:

* durable relationship ID;
* positive monotonic revision;
* lifecycle/status;
* effective interval;
* exact parent source endpoint;
* exact parent incarnation;
* exact child source endpoint;
* exact child incarnation;
* compatible source-kind validation;
* component role / slot;
* deterministic display/structural order where required;
* applicability policy;
* requiredness;
* relative timing rule;
* timing strictness;
* gap policy;
* relationship-scoped Buffer policy where supported;
* pairing/movement/omission semantics;
* bounded Goal-support propagation policy where implemented;
* provenance;
* timestamps;
* supersession/retirement as required.

The relationship must remain deliberately limited to operational parent-linked time.

Do not make it a generic dependency edge.

---

## 11. Relationship Identity and Revision

Use Task 8.1 planning identity/revision conventions where appropriate.

Each relationship lifetime must have:

* opaque never-reused logical identity;
* revision 1 on creation;
* monotonic revisions;
* complete immutable historical records.

Semantic changes append a revision.

Semantic no-ops do not.

Reads, projection, ordering, schedule generation, or unrelated state do not advance revision.

Used relationship revisions must remain exactly resolvable after later modification or retirement.

A missing exact revision must return `notFound` or equivalent and must never alias current authority.

---

## 12. Endpoint Safety

Relationship endpoints must be incarnation-safe.

Do not target Commitments by:

* title;
* category;
* current display order;
* date;
* heuristic Work position;
* mutable name.

A relationship must not silently retarget when a source is deleted and recreated.

Source recreation with new identity/incarnation must require explicit relation update/new authority.

Dangling active required relationships are invalid current authority.

Historical relations remain resolvable.

---

## 13. Source-Level vs Occurrence-Level Semantics

Preserve the authority distinction:

```text
source-level Attachment Relationship
        ↓
qualifying parent occurrence
        ↓
derived exact occurrence pairing
```

The source relation is authored authority.

Occurrence pairing is derived provenance.

Do not create a second authored occurrence relationship simply because an occurrence was paired.

Occurrence-level exception/decision authority may later alter one derived pairing without rewriting source relation history.

---

## 14. Parent Occurrence Pairing

For each qualifying parent occurrence and active relation revision, derive at most one attached occurrence for each declared component slot.

Pairing identity must be deterministic from semantic identity such as:

* parent durable occurrence identity;
* relationship ID/revision;
* child source/incarnation;
* component slot;
* composition algorithm version.

Equivalent authority and equivalent parent occurrence must reproduce equivalent attached occurrence identity.

Runtime insertion order, array order, UI order, and random evaluation IDs must not affect pairing.

Parent absence produces no derived attached occurrence.

---

## 15. Multi-Occurrence Parent Handling

Every qualifying parent occurrence must be evaluated independently.

Do not collapse multiple parent occurrences on one user-day into first/last semantics.

Examples:

* split shifts;
* two appointments from the same source pattern;
* multiple qualifying Work occurrences.

Each applicable occurrence receives its own deterministic component pairing.

The existing first/last Work search heuristic must never establish Attachment authority.

---

## 16. Applicability V1

Implement the smallest coherent V1 applicability model consistent with the accepted specification.

The architecture supports:

* all parent occurrences;
* bounded date interval;
* weekday;
* cycle/segment/entry;
* declared parent metadata such as location/state;
* parent duration threshold;
* explicit occurrence include/exclude override.

Task 8.4 must implement enough applicability to make composition real and useful without introducing a generic predicate language.

At minimum support:

1. all qualifying parent occurrences;
2. bounded effective date interval;
3. canonical weekday applicability where compatible with existing user-day semantics;
4. explicit occurrence include/exclude exception if current occurrence identity infrastructure supports it cleanly.

Add Work/cycle/segment metadata applicability only where existing source provenance makes it bounded and safe.

Any unsupported forms must be explicitly deferred, not approximated.

Applicability conditions are conjunctive, deterministic, versioned, and explainable.

---

## 17. Recurrence Boundary

Attached recurrence is parent-derived.

A required child used solely as attached must not independently generate competing recurrence occurrences while attached.

The parent occurrence provides applicability.

Do not implement attachment by copying parent recurrence onto the child.

Do not allow independent recurrence plus attachment to silently generate duplicates.

Promotion/detachment to independent recurrence requires explicit authored authority.

Legacy independent recurrence remains valid for existing independent Commitments.

---

## 18. Required / Optional Semantics

V1 must support explicit:

* `required`;
* `optional`.

Required means:

> the parent composite is not fully realizable unless the applicable component is realized within its declared constraints.

Optional means:

> parent realization may remain valid if the component is omitted, but omission must remain explicit in derived state.

Priority must not stand in for requiredness.

Do not infer requiredness from:

* category;
* child priority;
* title;
* existing Buffer amount;
* timing relation.

---

## 19. Relative Timing V1

The accepted architecture defines:

* `endsAtParentStart`;
* `startsAtParentEnd`;
* `beforeParentWithGap`;
* `afterParentWithGap`;
* `offsetFromParentStart`;
* `offsetFromParentEnd`.

Implement the smallest coherent V1 subset that can cover ordinary before/after support composition while preserving the schema for the accepted vocabulary.

At minimum implement:

* exact end-at-parent-start;
* exact start-at-parent-end;
* before-parent with explicit gap;
* after-parent with explicit gap.

Implement start/end offsets where existing placement primitives make them straightforward without widening task risk.

For offset rules, anchoring semantics must be explicit.

Do not reuse `beforeWork` / `afterWork` as the authority representation.

They may be internal search helpers only.

---

## 20. Timing Strictness

Timing strictness is separate from requiredness.

V1 must distinguish:

* **constraint** — relation must be satisfied for the component to count as realized;
* **preference** — preferred geometry within explicitly permitted bounds.

Do not infer:

```text
required == exact
optional == flexible
```

A required activity may be flexible within its allowed window.

An optional activity may have exact timing.

If flexible preference-window semantics are too broad for V1, implement constraint timing first and explicitly defer the richer preference case rather than using ambiguous fields.

---

## 21. Planned Duration

The child Commitment source owns planned estimated activity duration.

Composition must reference that duration without copying it as an independent competing authority.

A source revision affecting duration must stale/recompute dependent composition.

If the implementation already supports bounded occurrence-duration override authority cleanly, support it through CompositeDecision.

Otherwise preserve the architectural seam and defer advanced duration variants.

Actual duration remains execution evidence, not planning-source mutation.

---

## 22. Parent Lifecycle

Current parent lifecycle controls current derivation.

Disabled, archived, retired, or otherwise inactive parent authority must not generate new current attached occurrences.

Reactivation may resume current derivation under current valid relationship authority.

Parent lifecycle change must never erase:

* historical relationships;
* prior pairings;
* published history;
* execution history.

A replaced parent incarnation must not inherit attachment implicitly.

---

## 23. Parent Omission / Cancellation

Preserve pre-publication versus historical reality.

### Before publication

Omitting/removing a parent occurrence suppresses its occurrence-derived attachments unless a separate explicit decision has promoted a component independent.

No orphan required child should remain scheduled.

### After publication

Historical published parent and component facts remain frozen.

Real-world cancellation/skip is execution/historical evidence.

Do not rewrite published composition out of history.

---

## 24. Parent Movement

For composition-aware authorized scheduling, moving a parent before publication must recompute applicable component geometry as one composite operation.

If required composition cannot remain valid, the move must:

* fail;
* become stale/inapplicable;
* or produce explicit corrective failure,

rather than silently leaving components behind or moving them beyond granted authority.

Do not apply partial component movement.

---

## 25. Parent Duration Change

Boundary-anchored child geometry must recompute when the relevant parent boundary changes.

Examples:

* `startsAtParentEnd` depends on parent end;
* `endsAtParentStart` depends on parent start.

The relationship authority may remain the same while the derived composite fingerprint changes.

Published history must retain old absolute geometry and old decisive source/relation revisions.

---

## 26. Detachment / Promotion

Detachment is explicit authority.

It may:

* retire the Attachment Relationship prospectively; or
* create an occurrence-scoped exception where applicable.

If source semantics remain the same, child source identity may remain.

Promotion to independent recurrence must require explicit authored recurrence authority.

Do not automatically create recurrence because attachment fails or is retired.

---

## 27. Composite Commitment

Implement Composite Commitment only as a derived planning view.

It consists of:

* one parent source;
* current applicable relation authority;
* child sources;
* relationship metadata needed by consumers.

It is not persisted as a duplicate Commitment.

It must never create duplicate time ownership.

---

## 28. Composite Occurrence

Implement a derived Composite Occurrence representing:

* exact parent occurrence;
* applicable relationship revisions;
* deterministic attached occurrences;
* Buffers;
* requiredness map;
* applicable occurrence-level decisions;
* Composite Footprint;
* composition state;
* provenance;
* dependency fingerprint;
* freshness.

The composite references component occurrences.

It must not duplicate them.

---

## 29. Composite Identity

Provide stable deterministic composite identity suitable for future:

* Friction;
* Capacity diagnostics;
* Proposal;
* decisions;
* publication;
* Summary.

Use the parent durable occurrence identity plus composition algorithm version or equivalent accepted semantic identity.

Keep separate:

* durable composite ID;
* mutable composite fingerprint.

The fingerprint must change when materially relevant composition authority changes.

---

## 30. Composition Fingerprint

Include only material semantic dependencies.

Expected inputs include:

* parent source ID/incarnation/revision;
* parent occurrence identity;
* active relationship IDs/revisions;
* child source ID/incarnation/revision;
* applicability results;
* requiredness;
* timing/gap policy;
* planned duration;
* Buffers;
* decisive CompositeDecision where applicable;
* canonical user-day policy;
* composition algorithm version.

Exclude presentation metadata.

Equivalent semantic authority must yield equivalent fingerprint.

---

## 31. Composite Footprint

Implement Composite Footprint as a classified interval set.

It must distinguish:

* parent core activity interval;
* each attached support-activity interval;
* each protected Buffer interval;
* unresolved required liability/resource interval where determinable.

Do not flatten the composite into one envelope as the canonical representation.

An envelope may be derived for convenience only.

Footprint arithmetic must deduplicate identity/overlap correctly.

Do not compute:

```text
parent + child intervals + composite envelope
```

as total time.

The composite itself creates no extra time ownership.

---

## 32. Time Ownership

Preserve these semantics:

| Element              | Time meaning                                           |
| -------------------- | ------------------------------------------------------ |
| Parent activity      | Owns activity interval                                 |
| Attached activity    | Owns activity interval                                 |
| Buffer               | Protects non-activity interval                         |
| Gap without Buffer   | Does not own/protect time                              |
| Composite Footprint  | Derived union/classification only                      |
| Composite Commitment | Derived view only                                      |
| Composite Liability  | Unresolved accepted obligation, not duplicate activity |

No interval may be counted twice merely because it is visible through both direct and composite views.

---

## 33. Composite Feasibility Boundary

Task 8.4 may implement **composition-local transactional realizability** using existing schedule/placement geometry where necessary to prove required components can accompany an already-authorized parent.

This is **not Goal-Specific Feasibility**.

Composition-local evaluation may answer:

> Can this parent plus its required support activities and Buffers be realized together under the relation constraints?

It must not answer:

> Does Goal Demand fit general Capacity?

Do not create the future Capacity domain in this task.

Do not expose existing free/open windows as canonical Capacity authority.

---

## 34. Composition State V1

Represent at least:

* `fullyFeasible`;
* `feasibleWithoutOptional`;
* `requiredComponentFailure`;
* `unknown` / `stale`.

Equivalent labels are acceptable if semantics remain exact.

Optional omission must remain visible.

Required failure must never be reported as fully realizable.

Unknown/stale must fail protected rather than optimistic.

---

## 35. Composition Failure

Represent Composition Failure distinctly from:

* ordinary interval overlap;
* unplaced independent Commitment;
* missing `beforeWork`/`afterWork` heuristic anchor;
* structural Goal ineligibility;
* Goal Demand infeasibility;
* Allocation scarcity;
* Proposal limitation.

Composition Failure means an applicable required component cannot be realized under current accepted composition authority.

Use structured typed reasons.

---

## 36. Composite Liability

Implement the bounded Composite Liability needed to prevent required composition failure from disappearing as apparently free planning space.

It is not a separate authored authority domain.

It is derived unresolved Commitment liability associated with already-authorized parent/composite authority.

At minimum retain:

* composite ID/fingerprint;
* parent occurrence identity;
* failed component identity;
* relationship ID/revision;
* required resource shape where determinable;
* horizon/coverage;
* structured failure reason;
* relevant conflicts;
* provenance;
* freshness/applicability.

A required support failure must not silently become clean future Capacity while its parent remains authorized.

Actual future Capacity subtraction is Task 8.5 or later.

---

## 37. Friction Integration

For **already-authorized** Commitment composition:

* unresolved required Composition Failure may create corrective Friction;
* optional omission is advisory unless separately authoritative;
* Friction must carry enough composition identity to explain the parent/component/relation involved.

Do not turn composition into constructive Proposal.

For future unaccepted Goal work, composition failure remains future Feasibility limitation rather than Friction.

Preserve:

> Proposal is constructive; Friction is corrective.

---

## 38. Composite Friction Reasons

Add or extend structured reasons sufficient to distinguish composition-specific failure such as:

* required component unplaced;
* required timing violation;
* missing required component;
* ambiguous/invalid pairing;
* parent/component conflict;
* stale composition authority.

Exact code names are implementation details.

Do not collapse all composition failure into generic overlap if the cause is materially different.

---

## 39. Suggested Fix Boundary

Existing Suggested Fix infrastructure may be extended only as needed for composition-aware corrective paths.

Potential non-authoritative fixes include:

* move composite together;
* move flexible component within relation;
* omit optional component;
* adjust an occurrence within already permitted bounds;
* detach where explicitly proposed;
* revise relation/Buffer only through explicit new authority.

Do not silently modify recurring relationship authority.

A required component cannot simply be omitted and then reported as success unless explicit accepted authority changes requiredness/applicability for that occurrence or source.

---

## 40. CompositeDecision V1

Implement a distinct atomic CompositeDecision authority where a composition-aware accepted change must coordinate multiple occurrence deltas.

Do not overload independent `PlanDecision` semantics if its target and replay model cannot represent the composite atomically.

A CompositeDecision may target:

* one Composite Occurrence;
* or a bounded explicit repeated set if implementation can preserve exact authority safely.

At minimum support one-composite-occurrence scope.

It must preserve:

* decision ID/version;
* target composite ID/fingerprint;
* exact parent occurrence;
* affected attached occurrences;
* exact source/incarnation/revision refs;
* exact relationship revisions;
* accepted deltas;
* scope;
* timestamp;
* provenance;
* replay requirements.

Application is all-or-nothing.

---

## 41. CompositeDecision Replay

Replay must validate:

* parent occurrence identity;
* parent source/incarnation;
* child source/incarnation;
* relationship revisions;
* applicability;
* composition fingerprint;
* canonical user-day policy;
* relevant occurrence state.

Material mismatch returns stale/inapplicable.

No partial effect may survive failed replay.

Occurrence decisions must not silently revise recurring source or relationship authority.

---

## 42. Goal Service Boundary

Default attached activity Goal service must be **no automatic Goal inheritance**.

If implementing the accepted explicit support-propagation policy, keep it bounded:

* relation explicitly authorizes support context propagation;
* exact source Goal-link provenance is retained;
* child occurrence may be classified as `supportForGoal` or equivalent;
* this does not create a direct child Goal link;
* this does not satisfy Goal Demand by itself;
* this does not create Goal Progress.

If this policy is not necessary for coherent V1, preserve the field/schema seam and explicitly defer activation.

Do not infer from category/title.

---

## 43. Goal Demand Overhead Contract

Task 8.4 must establish the future handoff:

```text
Goal productive Demand
        +
Composition required support footprint
        ↓
future Goal-Specific Feasibility
```

Example:

```text
60m workout core
+ 30m required travel
= 90m Capacity cost

Demand credit remains 60m
Support overhead remains 30m
```

Task 8.4 does not calculate future Goal-Specific Feasibility.

It must provide a normalized enough footprint/resource-shape contract for that future consumer.

Required support activity and Buffer overhead must remain separately classified.

---

## 44. Conservation Rules

Explicitly enforce or prepare tests for:

1. a core activity minute satisfies core Demand at most once;
2. a support activity interval consumes time at most once;
3. a Buffer interval consumes protected time at most once;
4. composite footprint does not add an envelope atop components;
5. support overhead does not satisfy core Goal Demand by implication;
6. Buffer overhead never creates Progress;
7. Goal service propagation does not itself become Demand satisfaction;
8. direct and composite reporting cannot duplicate execution.

---

## 45. Existing Work-Relative Compatibility

Preserve `beforeWork` and `afterWork` as existing independent placement preferences.

They are not Attachment Relationship authority.

Do not automatically migrate them into attachments.

Do not infer:

```text
beforeWork template => attached to Work
afterWork template => attached to Work
```

Conversion would require explicit user authority in a future authoring/migration workflow.

Internal placement helpers may be reused for geometry only.

---

## 46. Existing Buffer Compatibility

Preserve current source-local Buffer behavior.

Do not reinterpret legacy Buffer amounts as:

* commute;
* preparation activity;
* execution subject;
* Goal work;
* attachment.

Composition may add relationship-scoped Buffer policy alongside source-local Buffers.

Define deterministic deduplication/interaction rules where both apply.

Document the V1 rule in the RESULT.

No legacy semantic inference is permitted.

---

## 47. Persistence Model

Persist authority, not disposable projections.

At minimum persist:

* complete Attachment Relationship revision history;
* accepted CompositeDecision authority/history if implemented as required;
* any new explicit relationship-scoped Buffer/applicability/Goal-support policies.

Do not persist as independent current authority:

* pairings;
* Composite Commitments;
* Composite Occurrences;
* Composite Footprints;
* composition-local feasibility;
* Composite Liability projections;

except where immutable publication/history must freeze decisive content.

Use sibling authority collection(s) consistent with Tasks 8.2/8.3.

Avoid bloating the eager store composition unnecessarily.

---

## 48. Database Migration

Task 8.3 left durable schema at version 8.

Advance schema version if required.

Migration must be additive, deterministic, and non-inferential.

Existing users must retain:

* Commitment sources;
* recurrence;
* Work/cycles;
* Buffers;
* Work-relative preferences;
* manual events;
* Goal links;
* Goal Structure;
* Goal Demand/Priority;
* Progress;
* history.

Older state must acquire explicit empty Composition authority.

Do not infer Attachment Relationships from:

* titles;
* categories;
* Work-relative windows;
* adjacency;
* Buffer values;
* Goal links;
* recurrence timing;
* generated occurrence positions;
* execution history.

Empty composition authority is correct when none was explicitly authored.

---

## 49. Backup / Restore

The current backup baseline is V8.

If new durable authority is added, advance to the next appropriate backup version, expected to be V9 unless repository conventions require otherwise.

The current backup format must preserve:

* all existing authorities;
* Goal Structure history;
* Goal Demand/Priority history;
* complete Attachment Relationship history;
* CompositeDecision history if applicable;
* exact source/incarnation endpoint references.

Restore must:

1. validate all endpoint references;
2. reject or quarantine dangling active required composition;
3. validate relationship revisions/history;
4. validate decision targets and refs;
5. atomically install interdependent sources and relationships;
6. participate in existing protected rollback.

Older backup import must produce explicit empty composition authority.

Do not infer relationships.

Lossy old-version export must be refused when live composition authority would be discarded.

---

## 50. Profile Compatibility

Inspect current profile ownership.

Expected behavior absent contrary repository evidence:

* profiles continue to own authored setup only;
* profiles do not own Commitment Composition authority if current Commitment sources themselves are outside profile ownership;
* profile load must not invent, delete, or retarget attachment relationships.

If Commitment source ownership complicates this assumption, document the exact existing semantics and preserve them without silently redefining profiles.

Do not use Task 8.4 to redesign profile architecture.

---

## 51. Store / Authority Surface

Expose explicit bounded operations.

At minimum include appropriate equivalents of:

### Relationship authority

* create Attachment Relationship;
* revise Attachment Relationship;
* retire Attachment Relationship;
* list current relationships by parent;
* list current relationships by child;
* resolve exact relationship revision;
* query applicable relationships for a parent occurrence;
* export/replace Composition authority;
* persistence retry/subscription where current patterns require it.

### Derived composition

* derive deterministic occurrence pairings;
* derive Composite Occurrence;
* derive Composite Footprint;
* derive composition state;
* query Composite Liability for authorized occurrences;
* resolve composition provenance/fingerprint.

### CompositeDecision

If included per architecture:

* create/apply accepted CompositeDecision;
* resolve exact decision;
* replay/revalidate decision;
* list bounded decisions for composite/source as required.

Do not add generic public `set(any)` mutation.

---

## 52. Mutation Atomicity

Relationship and CompositeDecision mutations must be atomic.

For authored relationship change:

1. validate endpoints;
2. validate incarnation compatibility;
3. construct candidate revision;
4. validate complete current composition authority;
5. reject cycles/invalid structures according to bounded composition rules;
6. persist only after candidate validity;
7. publish runtime state only after accepted durable transition according to existing store guarantees.

For CompositeDecision:

1. resolve exact composite;
2. validate fingerprint;
3. validate all affected components;
4. validate coordinated geometry;
5. apply all deltas or none.

Invalid mutation must leave runtime and durable authority unchanged.

---

## 53. Structural Validation

At minimum reject:

* nonexistent parent;
* nonexistent child;
* stale/wrong incarnation;
* parent == child;
* malformed relationship ID/revision;
* malformed lifecycle/effective range;
* incompatible endpoint source kind;
* duplicate active semantic relation/slot;
* conflicting component slot;
* invalid applicability;
* invalid requiredness;
* invalid timing rule;
* incoherent gap rule;
* invalid Buffer amount;
* unsupported source recurrence conflict while solely attached;
* dangling required relation;
* malformed decision target;
* decision referencing stale relation/composite;
* malformed persisted history.

Do not introduce generic workflow DAG semantics.

If composition cycles are architecturally invalid, reject them deterministically. Do not permit parent-child chains to become unbounded workflow graphs merely because IDs can technically reference each other.

---

## 54. Query Boundary

Consumers must not inspect raw persistence arrays.

Provide deterministic bounded query APIs for:

* current relationship authority;
* exact historical relationship;
* applicable relationships for exact parent occurrence;
* deterministic pairings;
* composite projection;
* classified footprint;
* composition state/failure/liability;
* exact dependencies/fingerprint/freshness;
* accepted CompositeDecision where relevant.

Canonical ordering must use durable semantic identity.

Display order must remain separate from scheduler processing order and temporal relation.

---

## 55. Provenance / Freshness

Reuse Task 8.1 foundations.

Material dependencies should include, where applicable:

* parent source ID/incarnation/revision;
* child source ID/incarnation/revision;
* relationship ID/revision;
* parent occurrence;
* applicability result;
* timing/gap/Buffer policy;
* requiredness;
* occurrence decision;
* canonical user-day policy;
* composition algorithm version.

Unrelated Commitment changes must not stale an unaffected composite.

Unrelated Goal Demand changes must not stale an existing Commitment composite unless a derived Goal-work composition consumer explicitly used them—which Task 8.4 should generally not.

Stale current composition must not drive accepted current decisions.

Reason codes must remain bounded and structured.

---

## 56. Canonical User-Day Semantics

Composition expansion must use the canonical user-day system.

Required regressions include:

* attachment before an overnight parent;
* attachment after an overnight parent;
* attached activity crossing calendar midnight;
* parent and child occurring on different calendar dates;
* parent and child potentially carrying different reporting user-day labels while remaining in one composite;
* variable-duration user-day boundary behavior.

Composite membership follows pairing identity, not date equality.

Calendar midnight must not clip or re-parent an attachment.

---

## 57. Work / Cycle Semantics

Work-derived occurrences may serve as parents if existing source/occurrence identity provides an incarnation-safe endpoint model consistent with architecture.

Do not special-case Work using “first Work of day” or “last Work of day.”

Split shifts must remain distinct parent occurrences.

If current Work source architecture cannot safely host authored Attachment Relationship endpoints without architectural contradiction, stop and report that bounded issue rather than approximating authority through generated-block heuristics.

Do not rewrite Work/cycle architecture as part of this task.

---

## 58. Scheduling Integration

Unlike Tasks 8.2 and 8.3, Task 8.4 may intentionally affect generated scheduling **only where explicit Attachment Relationship authority exists**.

Required preservation contract:

```text
no Composition authority
=> byte-for-byte equivalent existing scheduling output
```

With explicit Composition authority:

* applicable child occurrences may be derived;
* required components must participate transactionally;
* optional components may be omitted with explicit state;
* Buffers must protect declared intervals;
* no duplicate independent recurrence may occur;
* parent omission must suppress attached occurrence derivation;
* parent movement must preserve/revalidate composition.

All existing users with empty composition authority must see unchanged scheduling semantics.

---

## 59. Preview Boundary

Preview may display derived attached activity occurrences if they are actual scheduled draft occurrences under explicit Commitment authority.

It must not display:

* Composite Commitment as duplicate scheduled activity;
* Buffer as performed activity;
* Composite Footprint as extra occurrence;
* future Capacity;
* Goal feasibility;
* Goal Allocation;
* Proposal.

If Preview must distinguish support activity or Buffer metadata for correctness, make the smallest safe model extension.

Avoid broad UI redesign.

---

## 60. Publication / Historical Plan Integration

When published composition is decisive, historical truth must preserve enough provenance to reconstruct why each interval existed.

At minimum freeze or immutably reference:

* parent source ID/incarnation/revision;
* parent occurrence;
* child source ID/incarnation/revision;
* attached occurrence;
* relationship ID/revision;
* applicability result;
* requiredness;
* timing/gap rule;
* planned duration;
* applied Buffer;
* composite ID/fingerprint;
* accepted CompositeDecision provenance where applicable.

Do not reconstruct historical attachment semantics from current relationship state.

---

## 61. Execution Integration

Each real activity must have exactly one execution subject.

Parent activity executes independently.

Attached activity executes independently.

Buffer has no execution subject.

Composite execution is derived aggregate reporting only.

Do not create duplicate execution records for:

* composite;
* footprint;
* Buffer.

Preserve planned and actual duration separately.

Do not implement Found Time in Task 8.4 beyond preserving the provenance needed by future Live work.

---

## 62. Progress Boundary

Composition must not create Goal Progress.

Support activity does not automatically count as productive Goal work.

Buffer never counts as Progress.

Parent or child Goal service remains governed by explicit Goal authority/policy.

Execution duration does not automatically become Goal Progress.

Preserve the Task 8.3 separation.

---

## 63. Demand Boundary

Task 8.4 may expose a future composition overhead/resource-shape contract.

It must not:

* mutate Demand Intent;
* revise Demand Projection;
* increase requested productive effort;
* treat support time as productive Demand;
* satisfy Demand automatically;
* implement Demand-satisfaction attribution.

Task 8.3 Demand remains authored productive resource-seeking intent.

Composition describes operational overhead.

---

## 64. Capacity Boundary

Do **not** implement the Capacity domain.

Task 8.4 may produce exactly the information Capacity will later require:

* activity intervals;
* protected Buffer intervals;
* unresolved required liabilities;
* classified footprint;
* provenance;
* coverage/freshness.

Do not:

* create canonical Capacity interval authority;
* compute general allocatable Capacity;
* expose opening windows as Capacity;
* perform Capacity policy qualification;
* deduplicate the entire schedule into Capacity output.

That is the next Phase 8 increment.

---

## 65. Goal-Specific Feasibility Boundary

Do **not** implement Goal-Specific Feasibility.

Composition-local feasibility is permitted only to determine whether required components can realize around a specific parent/composite under explicit Commitment authority.

Goal-Specific Feasibility later consumes:

```text
Demand Projection
+ composition resource shape
+ Capacity
```

Task 8.4 must stop before that join.

---

## 66. Allocation / Proposal Boundary

Do not implement:

* Competing Demand;
* Allocation Policy;
* Allocation;
* Goal competition;
* Proposal;
* ProposalDecision;
* Accepted Allocation;
* Scheduled Goal Work;
* Goal-work placement recommendation.

CompositeDecision is corrective/occurrence planning authority for already-authorized Commitment composition.

Do not confuse it with future ProposalDecision.

---

## 67. Friction Preservation

Existing independent Friction behavior must remain green.

Composition-specific Friction is allowed only for already-authorized composition failure.

Do not classify:

* optional omitted component;
* unaccepted Goal composition;
* future Goal Demand scarcity;
* absence of Composition authority

as Friction.

Preserve corrective semantics.

---

## 68. Legacy Migration Coexistence

The accepted roadmap explicitly requires coexistence with existing:

* source-local Buffers;
* relative placement;
* Work-relative windows.

Therefore:

1. retain existing semantics;
2. add explicit Composition authority beside them;
3. do not infer relations;
4. do not silently deprecate behavior at runtime;
5. document future migration/authoring opportunities without implementing speculative conversion.

Existing schedules without Attachment Relationships must remain valid.

---

## 69. V1 Design Decisions

Because the architecture leaves bounded implementation choices downstream, complete a V1 decision table in the RESULT covering at least:

| Question                      | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| ----------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| persistence host              |             |                     |                    |                     |
| relationship lifecycle        |             |                     |                    |                     |
| endpoint representation       |             |                     |                    |                     |
| component slot/order          |             |                     |                    |                     |
| applicability forms           |             |                     |                    |                     |
| required/optional             |             |                     |                    |                     |
| timing rules                  |             |                     |                    |                     |
| timing strictness             |             |                     |                    |                     |
| gap semantics                 |             |                     |                    |                     |
| relationship Buffer           |             |                     |                    |                     |
| recurrence suppression        |             |                     |                    |                     |
| occurrence pairing ID         |             |                     |                    |                     |
| composite ID/fingerprint      |             |                     |                    |                     |
| footprint representation      |             |                     |                    |                     |
| composition-local feasibility |             |                     |                    |                     |
| Composite Liability           |             |                     |                    |                     |
| CompositeDecision scope       |             |                     |                    |                     |
| Goal-support propagation      |             |                     |                    |                     |
| legacy Buffer interaction     |             |                     |                    |                     |
| Work-relative compatibility   |             |                     |                    |                     |

Do not use implementation freedom to contradict accepted architecture.

---

## 70. Required Tests — Relationship Authority

Add focused tests proving:

* creation begins revision 1;
* semantic revision increments;
* semantic no-op does not;
* retirement preserves history;
* exact missing revision does not alias current;
* source recreation does not retarget relation;
* nonexistent endpoint rejected;
* wrong incarnation rejected;
* self-attachment rejected;
* duplicate semantic active slot rejected;
* invalid requiredness/timing/applicability rejected;
* malformed histories rejected;
* invalid mutation remains atomic.

---

## 71. Required Tests — Pairing

Prove:

* qualifying parent derives child;
* absent parent derives no child;
* equivalent authority regenerates equivalent occurrence identity;
* one relation slot yields at most one child per parent occurrence;
* two parent occurrences yield two independent pairings;
* split Work does not collapse to first/last heuristic;
* parent omission suppresses child;
* inactive parent produces no new child;
* retired relation produces no new child;
* unrelated authority order does not change pairing.

---

## 72. Required Tests — Timing / User-Day

Prove at minimum:

* `endsAtParentStart`;
* `startsAtParentEnd`;
* before/after gap behavior implemented in V1;
* overnight parent;
* child on preceding/following calendar date;
* canonical user-day crossing;
* parent duration change recomputes end-anchored child;
* parent movement recomputes pair;
* calendar midnight does not break composite identity.

---

## 73. Required Tests — Required / Optional

Prove:

* required component success → fully feasible;
* required component failure → requiredComponentFailure;
* optional component failure → feasibleWithoutOptional;
* required failure is not silently omitted;
* optional omission remains visible;
* requiredness does not imply timing exactness where flexible semantics exist;
* child priority does not substitute for requiredness.

---

## 74. Required Tests — Buffer / Footprint

Prove:

* Buffer protects time without activity occurrence;
* Buffer has no execution subject;
* gap without Buffer remains unprotected;
* attached activity and Buffer remain distinct with equal duration;
* parent + support footprint is unioned without duplicate composite time;
* overlapping classified intervals do not double count;
* existing source-local Buffer still behaves correctly;
* relationship-scoped Buffer interaction is deterministic;
* footprint exposes classifications for future Capacity.

---

## 75. Required Tests — Liability / Friction

Prove:

* unresolved required authorized component creates composition failure;
* required failure can produce composition-specific corrective Friction;
* optional failure does not automatically create Friction;
* no Composition authority leaves existing Friction byte-equivalent;
* liability preserves composite/component/relation provenance;
* stale composition does not produce optimistic clean state;
* required liability remains distinguishable for future Capacity.

---

## 76. Required Tests — CompositeDecision

If CompositeDecision is implemented as required by the accepted architecture, prove:

* coordinated parent/component delta applies atomically;
* one invalid component aborts entire decision;
* fingerprint mismatch rejects replay;
* stale relation rejects replay;
* wrong incarnation rejects replay;
* accepted occurrence decision does not revise source relationship;
* decision history remains exactly resolvable;
* independent PlanDecision behavior remains unchanged.

---

## 77. Required Tests — Persistence / Backup

Prove:

* restart preserves exact relationship history;
* restart preserves CompositeDecision history where applicable;
* malformed persisted authority enters safe protection;
* dangling required endpoint rejected;
* current backup round-trips exact IDs/revisions;
* older backup creates empty Composition authority;
* old-version lossy export refused when needed;
* restore participates atomically with Commitment sources;
* invalid relation prevents partial installation;
* full-clear removes composition authority;
* old current scheduling state survives migration unchanged.

---

## 78. Required Scheduling Regression

Add an explicit baseline equivalence test:

```text
same authored scheduling state
+ empty Composition authority

must produce byte-for-byte equivalent schedule/Preview/Friction output
to pre-8.4 behavior
```

Then add focused positive composition cases proving only explicit relationship authority changes scheduling.

This is a critical migration invariant.

---

## 79. Regression Preservation

Keep green:

* canonical user-day;
* variable-duration user-day;
* overnight Work;
* manual Work;
* repeating Work;
* split shifts;
* Commitment recurrence;
* relative Sleep;
* existing source Buffers;
* beforeWork/afterWork;
* candidate placement;
* Preview freshness;
* Friction/Fix;
* PlanDecision;
* publication;
* execution corrections/retractions;
* Progress;
* Goal Structure;
* Goal Demand/Priority/Projection;
* backup/restore;
* Month;
* Today;
* Summary;
* DF-006 REG protections.

A failure in a preserved capability blocks completion unless explicitly shown to be a required semantic correction within Task 8.4.

---

## 80. Persistence / Restore Registry Integration

Inspect every exhaustive durable-authority registration point.

Update as required:

* IndexedDB schema;
* runtime authority registry;
* notification/subscription registry;
* restore participants;
* restore staging;
* restore coordinator;
* composition/translation;
* protected-mode validation;
* durability retry;
* full-clear;
* backup validation/export/import;
* test reset helpers.

Do not leave Composition as partially registered durable state.

---

## 81. UI Boundary

Task 8.4 is primarily architecture implementation and engine integration.

Do not build broad Composition authoring UI.

Minimal existing-surface rendering is permitted only when necessary to preserve semantic correctness of scheduled attached occurrences or Buffer explanation.

Do not add:

* workflow-builder UI;
* Capacity UI;
* Goal feasibility UI;
* Proposal UI;
* generic dependency diagrams;
* broad Teach redesign.

If no authoring UI is necessary for coherent completion, leave authority non-UI and expose it through bounded store/domain commands and tests.

---

## 82. Accessibility

If no new user-facing surface is introduced, state so.

If minimal UI must be touched:

* support keyboard/focus;
* expose semantic activity vs Buffer distinction non-visually;
* do not rely on color for required/optional/failure;
* provide accessible names/status;
* retain mobile readability.

No inaccessible temporary authoring UI merely for demonstration.

---

## 83. Bundle / Performance Discipline

Task 8.3 left essentially no eager gzip headroom.

Treat bundle pressure as a blocking engineering constraint.

Before adding new eager code:

* inspect bundle composition;
* reuse existing lazy boundaries;
* keep composition projection/diagnostics lazy when possible;
* avoid broad new UI imports;
* avoid generic graph libraries;
* avoid runtime workflow engines;
* keep personal-scale deterministic maps/sets/interval operations;
* share lightweight Task 8.1 primitives rather than duplicating them.

If necessary, safely move existing non-critical feature code behind lazy boundaries without changing semantics, provided the change remains bounded and tested.

Do not hide semantic logic merely to manipulate bundle accounting.

Record before/after:

* raw initial bundle;
* gzip initial bundle;
* largest lazy chunk;
* total bundle;
* warning thresholds;
* hard thresholds;
* architecture-review thresholds.

A hard bundle failure blocks completion.

---

## 84. Performance

Composition must remain deterministic and bounded for personal-scale schedules.

Prefer:

* indexed relation lookup by parent;
* canonical source/incarnation keys;
* deterministic occurrence maps;
* interval-set operations;
* bounded applicability evaluation;
* incremental/lazy derived composite queries.

Do not implement an arbitrary graph engine or workflow executor.

Measure if required by existing bundle/performance governance.

---

## 85. Governance

At completion:

* update `docs/architecture/CURRENT_STATE.md`;
* update `docs/architecture/CHANGELOG.md`;
* update `docs/architecture/DECISIONS.md` only for a genuinely new durable decision outside already accepted architecture;
* do not rewrite accepted Commitment Composition specification;
* do not rewrite Goal Demand specification;
* do not rewrite roadmap;
* do not rewrite Tasks 8.1–8.3 results.

Record:

> **Architecture Reopen Check: No**

unless implementation evidence exposes a genuine contradiction.

---

## 86. Repository Discipline

Before implementation:

1. inspect `git status`;
2. preserve all uncommitted Phase 8 work from Tasks 8.1–8.3;
3. identify pre-existing changes;
4. do not clean or overwrite unrelated work;
5. do not commit or push unless explicitly instructed.

At completion report:

* files added;
* files modified;
* pre-existing uncommitted changes;
* Task 8.4-specific changes;
* whether a commit/push occurred.

Expected: no commit/push.

---

## 87. Validation Commands

Run repository-supported equivalents of:

```bash
npx prettier --check .
npm test -- --reporter=dot
npm run typecheck
npm run lint
npm run build
npm run check:bundle
```

Also run focused suites for:

* Attachment Relationship authority;
* pairing;
* canonical timing/user-day;
* required/optional behavior;
* Buffer/footprint accounting;
* Composition Failure/Liability;
* CompositeDecision;
* persistence/restart;
* backup/migration/restore;
* scheduling equivalence;
* Friction;
* execution/publication;
* Goal Demand non-interference;
* full-clear/store integration.

Do not claim completion with a failing required quality gate.

---

## 88. Required Result Artifact

Create a durable Markdown result artifact in the dedicated Phase 8 implementation-results folder.

The filename must contain **`RESULT`**.

Preferred filename:

```text
TASK_8.4_COMMITMENT_COMPOSITION_V1_DOMAIN_PAIRING_AND_FOOTPRINT_RESULT.md
```

The result must include at minimum:

1. Executive Result
2. Scope Delivered
3. Governing Evidence Used
4. Task 8.1 Foundation Reuse
5. Task 8.2 Goal Structure Boundary
6. Task 8.3 Goal Demand Boundary
7. Existing Commitment Model Assessment
8. Existing Work/Buffer/Relative Placement Assessment
9. Files Added
10. Files Modified
11. Commitment Source Reuse
12. Attachment Relationship Model
13. Relationship Identity / Revision
14. Endpoint / Incarnation Safety
15. Relationship Lifecycle
16. Applicability V1
17. Required / Optional Semantics
18. Timing Rules V1
19. Timing Strictness
20. Gap / Buffer Semantics
21. Recurrence Boundary
22. Attached Activity Model
23. Parent Lifecycle
24. Parent Omission / Cancellation
25. Parent Movement
26. Parent Duration Change
27. Occurrence Pairing
28. Pairing Identity / Determinism
29. Composite Commitment
30. Composite Occurrence
31. Composite Identity / Fingerprint
32. Composite Footprint
33. Time-Ownership / Deduplication
34. Composition State
35. Composition Failure
36. Composite Liability
37. Friction Integration
38. Suggested Fix Disposition
39. CompositeDecision
40. Decision Replay / Atomicity
41. Goal Service Boundary
42. Goal Demand Overhead Contract
43. Progress Boundary
44. Capacity Boundary
45. Goal-Specific Feasibility Boundary
46. Allocation / Proposal Boundary
47. Historical Provenance
48. Execution Integration
49. Persistence Model
50. Migration
51. Backup Integration
52. Profile Compatibility
53. Store / Query Surface
54. Mutation Atomicity
55. Full-Clear / Restore Integration
56. Legacy Buffer Compatibility
57. Work-Relative Compatibility
58. Scheduling Integration
59. Scheduling Baseline Equivalence
60. Tests Added
61. Persistence / Backup Tests
62. Composition Regression Tests
63. Full Regression Results
64. Validation Commands / Results
65. Bundle Result
66. Performance Notes
67. Accessibility Notes
68. Compatibility Notes
69. DF-006 Relationship
70. V1 Design Decision Table
71. Boundary Matrix
72. Invariant Verification
73. Implementation Decisions
74. Deviations
75. Architecture Reopen Check
76. Governance Updates
77. Repository Status
78. Completion Assessment
79. Recommended Next Task
80. Completion Statement

Add additional sections when implementation evidence warrants them.

---

## 89. Required V1 Decision Table

Include and complete:

| Question                      | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| ----------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| persistence host              |             |                     |                    |                     |
| relationship lifecycle        |             |                     |                    |                     |
| endpoint representation       |             |                     |                    |                     |
| component slot/order          |             |                     |                    |                     |
| applicability forms           |             |                     |                    |                     |
| required/optional             |             |                     |                    |                     |
| timing rules                  |             |                     |                    |                     |
| timing strictness             |             |                     |                    |                     |
| gap semantics                 |             |                     |                    |                     |
| relationship Buffer           |             |                     |                    |                     |
| recurrence suppression        |             |                     |                    |                     |
| occurrence pairing ID         |             |                     |                    |                     |
| composite ID/fingerprint      |             |                     |                    |                     |
| footprint representation      |             |                     |                    |                     |
| composition-local feasibility |             |                     |                    |                     |
| Composite Liability           |             |                     |                    |                     |
| CompositeDecision scope       |             |                     |                    |                     |
| Goal-support propagation      |             |                     |                    |                     |
| legacy Buffer interaction     |             |                     |                    |                     |
| Work-relative compatibility   |             |                     |                    |                     |

Distinguish clearly among:

* implemented;
* represented but not yet consumed;
* explicitly deferred.

---

## 90. Required Boundary Matrix

The RESULT must explicitly verify:

| Concept                      | Status after 8.4  | Authored / Derived                     | Owns / Protects Time?                    | May Affect Current Scheduling?  |
| ---------------------------- | ----------------- | -------------------------------------- | ---------------------------------------- | ------------------------------- |
| Commitment source            | Existing          | Authored                               | Owns through occurrences                 | Yes                             |
| Attachment Relationship      | New               | Authored                               | No independently                         | Yes, when explicit              |
| Parent occurrence            | Existing/extended | Derived scheduled                      | Owns activity time                       | Yes                             |
| Attached activity occurrence | New derived role  | Derived scheduled                      | Owns activity time                       | Yes                             |
| Buffer                       | Existing/extended | Authored policy → scheduled protection | Protects non-activity time               | Yes                             |
| Occurrence pairing           | New               | Derived                                | No additional ownership                  | Yes through derivation          |
| Composite Commitment         | New               | Derived view                           | No                                       | No extra ownership              |
| Composite Occurrence         | New               | Derived view                           | No extra ownership                       | Describes scheduled components  |
| Composite Footprint          | New               | Derived                                | No extra ownership                       | Resource description            |
| Composite Liability          | New               | Derived unresolved obligation          | Protects future accounting semantically  | No Capacity domain yet          |
| CompositeDecision            | New               | Accepted authority                     | Coordinates existing component authority | Yes when accepted               |
| Goal Demand                  | Existing          | Authored                               | No                                       | No                              |
| Demand Projection            | Existing          | Derived                                | No                                       | No                              |
| Capacity                     | Future            | Derived                                | No                                       | Not implemented                 |
| Goal Feasibility             | Future            | Derived                                | No                                       | Not implemented                 |
| Allocation                   | Future            | Derived                                | No                                       | Not implemented                 |
| Proposal                     | Future            | Proposed                               | No                                       | Not implemented                 |
| Progress                     | Existing          | Observation/derived                    | No                                       | No automatic composition credit |

Any contradiction must be treated as an architecture concern.

---

## 91. Required Invariant Verification

Explicitly verify all Task 8.4-relevant accepted invariants, including:

* time-owning attachments reduce resource availability as real activities;
* Buffers remain protected non-activity;
* placement preference is not Attachment authority;
* required attachment never silently becomes independent;
* failed required attachment must not later appear as clean Capacity;
* parent movement preserves relation or fails/stales;
* parent omission leaves no orphan required component;
* pairing is deterministic;
* first/last Work heuristics never establish pairing;
* applicability does not drift from parent recurrence;
* relationship identity/history is stable;
* source recreation never retargets attachment;
* requiredness is explicit;
* Buffer and activity remain semantically distinct;
* footprint does not double count envelope/components;
* composition-local feasibility includes required components;
* optional failure does not invalidate parent;
* Composition Failure differs from ordinary Friction;
* authorized required failure becomes corrective Friction/liability;
* composite decisions apply atomically;
* occurrence choices do not silently change recurring authority;
* Goal association propagates only through explicit policy;
* Goal Demand feasibility will include required overhead;
* overhead never becomes Progress by implication;
* Proposal remains unable to invent attachments;
* historical relation survives restructuring;
* each real activity executes once;
* composite reporting creates no duplicate execution;
* Buffer is never executed;
* planned and actual duration remain distinct;
* canonical user-day semantics apply;
* Goal Structure remains separate;
* Composition is not workflow management;
* equivalent authority yields equivalent composite output;
* stale composites cannot drive current accepted decisions;
* Composite view creates no additional time ownership;
* required support has future Capacity cost but no automatic Demand credit.

---

## 92. Completion Criteria

Task 8.4 is complete only when all of the following are true:

1. Attachment Relationship exists as first-class revisioned authority.
2. Ordinary Commitment sources can participate as attached activities without identity fork.
3. Relationship endpoints are incarnation-safe.
4. Relationship history is exact and immutable.
5. Required/optional semantics are explicit.
6. Bounded applicability is deterministic and versioned.
7. V1 parent-relative timing rules are explicit.
8. Timing strictness remains separate from requiredness.
9. Gaps and Buffers remain distinct.
10. Legacy Buffers retain their semantics.
11. Work-relative placement remains heuristic and is not inferred as attachment.
12. Attached recurrence derives from parent applicability rather than competing recurrence.
13. Parent occurrences deterministically derive attached occurrence pairings.
14. Split/multiple parent occurrences remain distinct.
15. Overnight/cross-date composition respects canonical user-day semantics.
16. Parent omission suppresses derived attached occurrences prospectively.
17. Parent movement/duration changes rederive composition correctly.
18. Composite Commitment is derived only.
19. Composite Occurrence is derived only.
20. Composite identity and fingerprint are deterministic.
21. Composite Footprint classifies core/support/Buffer/liability without double counting.
22. Real attached activities own activity intervals.
23. Buffers own no activity/execution identity.
24. Composition state distinguishes required failure from optional omission.
25. Composite Liability is available for unresolved authorized required composition.
26. Authorized required composition failure can be diagnosed through corrective Friction.
27. CompositeDecision is atomic where coordinated accepted occurrence changes are required.
28. Historical composition provenance remains resolvable.
29. Each activity has only one execution subject.
30. Goal-support semantics do not imply Demand satisfaction or Progress.
31. Goal Demand remains unchanged.
32. Capacity remains unimplemented.
33. Goal-Specific Feasibility remains unimplemented.
34. Allocation remains unimplemented.
35. Proposal/Accepted Allocation remain unimplemented.
36. Empty Composition authority preserves byte-for-byte existing scheduling behavior.
37. Explicit Composition authority affects scheduling only through declared relationships.
38. Migration invents no composition relationships.
39. Backup/restore preserves exact new authority.
40. Older backup import produces empty composition authority.
41. Lossy older export is prevented where necessary.
42. full-clear and protected restore include new authority.
43. required focused tests pass.
44. full regression suite passes.
45. Prettier/typecheck/lint/build pass.
46. bundle hard policy passes.
47. `CURRENT_STATE.md` and `CHANGELOG.md` are updated.
48. Task 8.4 RESULT artifact is created with `RESULT` in the filename.
49. V1 deferrals are explicit.
50. no accepted architecture contradiction remains unresolved.

---

## 93. Stop / Reopen Conditions

Stop and report rather than improvising if repository evidence shows:

* existing Commitment identity cannot safely support attached-role reuse;
* child recurrence cannot be suppressed/partitioned without changing accepted Commitment semantics;
* Work-derived occurrences lack a safe authoritative endpoint model for relationships;
* occurrence identity cannot support deterministic attachment pairing;
* source incarnation cannot be preserved across relation history;
* existing Buffers cannot coexist without semantic double counting;
* required composition cannot be represented without implementing Capacity prematurely;
* CompositeDecision cannot be atomic using existing decision infrastructure and requires a separately bounded prerequisite;
* historical publication cannot retain decisive relationship provenance;
* execution architecture would require duplicate activity records;
* canonical user-day semantics cannot represent cross-boundary attachments;
* explicit relationships necessarily change schedules for users with empty composition authority;
* an accepted Commitment Composition invariant must be violated.

Do not solve these by:

* title matching;
* first/last Work heuristics;
* copied recurrence;
* hidden Buffer conversion;
* generic workflow graphs;
* partial transaction writes;
* automatic Goal/Progress inference.

A genuine contradiction requires architecture reopen or a bounded prerequisite task.

---

## 94. Expected Next Roadmap Position

Successful Task 8.4 completes the **Commitment Composition** input required before trustworthy Capacity.

The next roadmap increment is:

> **Capacity + Goal-Specific Feasibility**

The likely next bounded task should begin the canonical Capacity domain using:

* authorized schedule facts;
* composition-aware occupied activity;
* protected Buffers;
* unresolved required Composite Liability;
* Task 8.3 Demand Projection;
* explicit availability policy;
* canonical interval identity/provenance/freshness.

Do not begin Capacity in Task 8.4.

---

## 95. Phase 8 Checkpoint Position

After Task 8.4, Phase 8 should have both major upstream branches required for Capacity:

```text
Task 8.1
  ├─ Task 8.2 Goal Structure
  │    └─ Task 8.3 Demand / Priority / Projection
  │
  └─ Task 8.4 Commitment Composition
             ↓
       Capacity / Feasibility
```

This is the architectural seam at which DayFrame should finally possess:

* trustworthy structured Goal-side resource demand; and
* trustworthy composition-aware Commitment-side resource cost.

Do not conflate either with Capacity itself.

---

## 96. Final Completion Statement

The Task 8.4 RESULT must end with a completion statement materially equivalent to:

> **Task 8.4 — Commitment Composition V1 Domain, Pairing, Footprint, and Persistence complete.**
>
> DayFrame now has first-class revisioned Commitment Composition authority connecting incarnation-safe parent Commitment sources to ordinary Commitment sources used as attached time-owning support activities and to explicit protected non-activity Buffer policy; Attachment Relationships preserve requiredness, bounded applicability, parent-relative timing, lifecycle, provenance, and exact history without converting placement preferences, legacy Buffers, independent recurrence, or Work heuristics into hidden coupling; qualifying parent occurrences deterministically derive exact attached-occurrence pairings and composition-aware scheduled geometry under canonical user-day semantics; Composite Commitment and Composite Occurrence remain derived views rather than duplicate sources of truth; Composite Footprint classifies parent core activity, support activity, protected Buffer time, and unresolved required liability without double counting; required composition failure remains distinct from optional omission and may produce corrective Friction and Composite Liability only for already-authorized scheduling; CompositeDecision provides atomic accepted authority for coordinated occurrence-level composition changes without silently revising recurring source authority; historical publication and execution preserve exact parent, child, relationship, pairing, planned, and decision provenance while each real activity is executed once and Buffers are never treated as performed activity; Goal Demand remains productive resource intent and composition overhead remains separately classified without automatic Demand satisfaction or Progress; legacy schedules with empty Composition authority remain behaviorally unchanged and older persisted/backup state acquires no invented attachment authority; persistence, migration, backup, restore, full-clear, compatibility, regression, and bundle gates remain protected; Capacity, Goal-Specific Feasibility, Competing Demand, Allocation, Proposal, Accepted Allocation, and Scheduled Goal Work remain outside this task; and the repository is ready to proceed to the next bounded Phase 8 Capacity and Goal-Specific Feasibility increment without reopening accepted architecture.
