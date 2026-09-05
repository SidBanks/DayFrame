# Task 9.2.0 — Goal-Demand Resource Footprint Association Architecture V1

**Status:** Ready for Codex
**Phase:** Phase 9 — Constructive Planning and Authorization
**Subphase:** Task 9.2 Architecture-Reopen Foundation
**Task Type:** Architecture Definition / Authored Planning Contract / Pre-Scheduling Resource Semantics
**Primary Responsibility:** Define the authoritative pre-scheduling contract that associates Goal Demand with reusable resource-footprint requirements so hypothetical Goal sessions can deterministically project productive work, required/optional support activity, and Buffer protection before any concrete scheduled parent exists, without reinterpreting Goal links, requiring a scheduled Commitment occurrence, or granting schedule authority.

---

## 1. Objective

Resolve the architecture blocker discovered during Task 9.2.1.

Current executable evidence establishes:

* Demand Projection carries Goal and Demand identity but no resource-footprint association;
* Goal Feasibility consumes Demand Projection plus demand-neutral Capacity and currently reasons only about productive geometry;
* Commitment Composition requires a concrete scheduled parent Commitment and template endpoint before deriving support and Buffer geometry;
* Goal links merely associate Goals with authored sources and do not define which linked source, if any, supplies the resource footprint for a Demand session;
* Allocation and Proposal therefore have no legitimate upstream support/Buffer footprint to propagate;
* continuing Task 9.2.1 would force Feasibility, Allocation, or Proposal to invent an unauthorized Goal-Demand ↔ Composition relationship.

Task 9.2.0 must define that missing relationship.

At completion the architecture must answer:

> **Before a Goal Demand session is scheduled, what authored resource-footprint definition applies to it, how does that definition project exact support and Buffer geometry around each hypothetical productive session, what authority and provenance does that projection carry, and how does the system resolve ambiguity when multiple possible source definitions exist?**

This task must not implement the contract.

It must produce a complete architecture specification suitable for implementation by Task 9.2.1.

---

## 2. Architecture-Reopen Context

Task 9.3 originally stopped because Accepted Allocation lacked sufficient productive/support/Buffer fidelity for safe realization.

Task 9.2.1 then stopped under explicit discovery classification **C**:

> No architecture currently connects Goal Demand to support/Buffer footprint before scheduling.

Therefore the blocker is not merely propagation.

The missing layer is:

```text
authored Goal/Demand intent
→ pre-scheduling resource-footprint association
→ projected candidate resource footprint
```

Only after this layer exists can the chain safely continue:

```text
Demand Projection
→ Goal-Specific Feasibility
→ Competition
→ Allocation
→ Proposal
→ Accepted Allocation
→ future Realization
```

---

## 3. Scope

Task 9.2.0 must define:

1. Goal-Demand resource-footprint association authority;
2. authored ownership of that association;
3. reusable versus demand-specific semantics;
4. source relationship to existing Commitment Composition;
5. parent-session identity before scheduling;
6. productive/support/Buffer role definitions;
7. required versus optional component semantics;
8. deterministic projection around arbitrary candidate sessions;
9. support/Buffer geometry rules;
10. candidate-footprint identity;
11. user-day semantics;
12. cross-user-day behavior;
13. revision/freshness/provenance;
14. multiple association/source handling;
15. Goal-link interaction;
16. Feasibility input/output contract implications;
17. Competition implications;
18. Allocation/Proposal downstream contract implications;
19. persistence/authorship implications;
20. migration and backward-compatibility semantics;
21. explicit non-goals and authority boundaries.

Do not implement code.

---

## 4. Governing Evidence

Inspect and reconcile:

* Goal architecture;
* Goal Structure specification;
* Goal Demand/Priority/Projection specification;
* Task 8.3 RESULT;
* Commitment Composition specification;
* Task 8.4 RESULT;
* Capacity specification;
* Task 8.5 RESULT;
* Goal Demand / Allocation specification;
* Task 9.1 RESULT;
* Constructive Proposal specification;
* Task 9.2 RESULT;
* Task 9.2.1 stop evidence;
* current Goal model;
* Goal link model;
* Demand authority/model;
* Demand Projection model;
* Commitment model;
* Block Template model;
* composition attachment relationships;
* parent/child composition projection;
* Buffer semantics;
* Goal Feasibility;
* Capacity;
* Allocation;
* Proposal;
* persistence/versioning conventions;
* architecture charter;
* decisions log;
* roadmap.

Use executable code as evidence of current truth.

Do not infer intended semantics from type names alone.

---

## 5. Architecture Question

Resolve the central question:

> **What explicit authored planning object or relationship tells DayFrame which resource-footprint requirements apply when satisfying a Goal Demand with a hypothetical session?**

The solution must not depend on:

* a concrete scheduled parent;
* Proposal inference;
* Allocation inference;
* title/category matching;
* arbitrary Goal-link selection;
* runtime UI order.

---

## 6. Required Conceptual Separation

The architecture must distinguish at least three concepts:

### A. Resource Footprint Specification

An authored or explicitly selected reusable definition describing what a Goal-Demand session requires around productive work.

### B. Projected Resource Footprint

A derived candidate-specific projection of that definition around one hypothetical productive session.

### C. Concrete Composition / Scheduled Realization

The eventual scheduled productive/support/Buffer reality after Accepted Allocation realization.

These must not be collapsed.

---

## 7. Resource Footprint Specification Definition

Define a first-class concept materially equivalent to:

> **Goal-Demand Resource Footprint Specification** — explicit authored planning authority describing the nonproductive support and protection requirements that accompany a hypothetical productive session satisfying a Goal Demand, independent of any concrete scheduled occurrence.

Exact naming may differ.

The architecture must specify:

* identity;
* ownership;
* revision model;
* scope;
* applicability;
* component definitions;
* provenance;
* persistence;
* freshness participation.

---

## 8. Authorship Location

Determine where the association is authored.

Evaluate at minimum:

### Option A — Goal-level footprint association

A Goal defines a default reusable footprint.

### Option B — Demand-authority-level footprint association

A specific Goal Demand definition owns the footprint.

### Option C — separate reusable footprint definition referenced by Goal/Demand

A first-class reusable planning object is linked explicitly.

### Option D — explicit reference to an existing Commitment/template composition definition

A Goal Demand selects a reusable authored source whose composition contract is adapted pre-scheduling.

Architecture must choose or define a bounded combination.

Do not leave this implicit.

---

## 9. Reusable vs Demand-Specific Authority

Determine whether a footprint association is:

* reusable standing authoring;
* scoped to one Demand;
* scoped to one Demand Projection;
* selectable per session;
* inherited with explicit override.

Default architecture should minimize repeated authoring while preserving explicit authority.

No projection-time inference.

---

## 10. Goal Link Boundary

Current Goal links mean only that an authored source is associated with a Goal.

Do not reinterpret generic Goal linkage as:

> this Commitment defines the resource footprint for every Goal Demand session.

If Goal links may participate, define a **new explicit relationship role**.

For example conceptually:

```text
servesGoal
definesDemandFootprint
```

must remain distinct if both exist.

---

## 11. Multiple Linked Commitments

Resolve behavior when several Commitments are linked to the same Goal.

The architecture must define whether:

* none are automatically chosen;
* one may be explicitly designated;
* several represent selectable footprint variants;
* one is default and others explicit alternatives.

Do not use:

* creation order;
* alphabetical order;
* nearest title match;
* most recent edit

as semantic selection.

---

## 12. Multiple Footprint Specifications

If multiple valid footprint definitions can serve one Demand, define whether they are:

* mutually exclusive authored alternatives;
* Feasibility variants;
* Proposal options;
* user-selected before planning;
* disallowed in V1.

The downstream engine must not silently choose among semantically distinct authored requirements.

---

## 13. Parent-Session Identity Before Scheduling

Commitment Composition currently derives support around a concrete parent occurrence.

Task 9.2.0 must define an equivalent **hypothetical parent-session identity**.

It must be:

* derived;
* non-authoritative;
* deterministic;
* candidate-specific;
* tied to Demand Projection;
* tied to candidate productive interval.

Conceptually:

```text
Demand Session Candidate
= hypothetical parent anchor
```

It must not imply scheduled reality.

---

## 14. Candidate Parent Identity

Define deterministic identity inputs.

At minimum consider:

* Goal ID;
* Demand authority/revision;
* Demand Projection ID;
* candidate productive start/end;
* canonical user-day;
* footprint-spec ID/revision;
* feasibility policy/version.

Avoid:

* random IDs;
* array order;
* UI-generated temporary IDs.

---

## 15. Productive Component Semantics

The productive candidate remains the Demand-serving session.

The footprint specification must not redefine productive Demand itself.

Preserve:

```text
Demand defines productive requirement
Footprint specification defines associated nonproductive resource requirements
```

unless architecture evidence requires a tighter authored integration.

---

## 16. Support Component Definition

Define support components before scheduling.

Each component must specify enough to derive candidate geometry.

At minimum:

* component identity;
* support role;
* required/optional status;
* duration or duration rule;
* relative placement rule;
* relationship to productive candidate;
* source/revision;
* user-day behavior.

---

## 17. Buffer Component Definition

Define Buffer protection before scheduling.

Each Buffer definition must specify enough to derive:

* exact candidate interval;
* before/after/around relationship;
* duration/rule;
* requiredness if meaningful;
* protected role;
* source/revision;
* user-day behavior.

Buffer remains non-activity.

---

## 18. Relative Geometry

Define how support and Buffer geometry is projected around arbitrary productive candidate sessions.

Examples may include:

* immediately before;
* immediately after;
* fixed offset before;
* fixed offset after;
* surrounding protection;
* source-local relationship.

Do not use vague preferred windows where exact geometry is required for Feasibility.

---

## 19. Deterministic Geometry

For a given:

```text
footprint specification
+ candidate productive interval
+ canonical user-day context
```

the projected resource footprint must be deterministic.

Equivalent inputs produce equivalent:

* support intervals;
* Buffer intervals;
* component IDs;
* total cost.

---

## 20. Optional Component Semantics

Define optionality precisely.

Possible distinctions:

* required;
* optionalAvailable;
* optionalSelected;
* omitted.

Determine when selection happens:

* authored configuration;
* Proposal option construction;
* modification candidate;
* acceptance.

Do not allow Proposal to invent optional support.

---

## 21. Required Component Semantics

If a component is required:

```text
productive candidate feasible
only if
required component footprint is also feasible
```

This must become a downstream invariant.

---

## 22. Candidate Resource Footprint Definition

Define the derived object materially equivalent to:

```text
Projected Resource Footprint
{
  productiveClaim
  supportClaims[]
  bufferClaims[]
}
```

It must preserve:

* exact intervals;
* roles;
* user-day;
* requiredness;
* source component;
* parent candidate;
* provenance;
* footprint-spec revision.

---

## 23. Candidate Footprint Identity

Identity must be semantic and deterministic.

A material change to:

* productive geometry;
* support rule;
* Buffer rule;
* requiredness;
* source revision

must change identity/fingerprint.

---

## 24. Footprint Projection Purity

Projection must be pure.

It may not:

* reserve Capacity;
* create schedule authority;
* create Commitment occurrences;
* create Proposal authority;
* mutate Demand;
* mutate Goal.

It produces candidate resource facts only.

---

## 25. Relationship to Task 8.4 Composition

Resolve the architectural reuse boundary.

Preferred principle:

> Task 8.4 remains the canonical source of support/Buffer semantics where applicable, but hypothetical Goal-session projection uses a pre-scheduling specification rather than requiring a concrete scheduled Commitment occurrence.

Determine whether:

### A. Composition definitions can be generalized into reusable footprint specifications;

### B. Composition authored definitions can be referenced by a new adapter/projection contract;

### C. a new sibling resource-footprint specification is required.

Do not duplicate composition semantics unnecessarily.

---

## 26. No Scheduled Parent Requirement

The chosen architecture must explicitly remove the need for a concrete scheduled parent during Feasibility.

A hypothetical candidate session is sufficient for derived projection.

This must not create schedule truth.

---

## 27. No Fake Commitment Occurrence

Do not solve by generating temporary/fake Commitment occurrences solely so Composition can run.

That would contaminate:

* identity;
* schedule authority;
* history;
* Friction;
* execution semantics.

The architecture needs a pre-scheduling projection contract.

---

## 28. Cross-User-Day Behavior

Define behavior where support/Buffer:

* begins on prior calendar date;
* ends on next calendar date;
* crosses canonical user-day boundary.

Preserve exact DayFrame user-day semantics.

Each derived component must have unambiguous ownership/provenance.

---

## 29. Candidate Session Crossing Midnight

Do not split solely at calendar midnight.

Use canonical user-day boundaries.

If resource components cross the user-day boundary, define whether they:

* remain one component with interval ownership;
* split into derived per-user-day claims;
* make the candidate invalid.

Choose explicit V1 semantics.

---

## 30. Footprint Outside Planning Horizon

Define behavior when:

* productive session is within Feasibility horizon;
* required support or Buffer extends beyond currently loaded Capacity coverage.

Possible valid result:

* unknown/incomplete feasibility;
* candidate invalid for current bounded horizon;
* explicit expanded coverage requirement.

Do not silently clip footprint.

---

## 31. Planning Horizon Interaction

Distinguish:

* Demand Projection horizon;
* Capacity coverage;
* candidate productive interval;
* complete footprint extent.

Feasibility must have enough Capacity coverage for the entire required footprint.

Do not equate productive horizon with total resource coverage.

---

## 32. Source Revision

Footprint specification must have explicit revision semantics.

Changes to:

* support duration;
* relative placement;
* Buffer duration;
* requiredness;
* component set;
* source association

must produce a new revision.

---

## 33. Provenance

Projected claims must retain:

* source footprint spec ID/revision;
* Goal;
* Demand;
* Demand Projection;
* candidate parent identity;
* source Commitment/template/composition relationship if reused;
* policy/version;
* canonical user-day context.

---

## 34. Freshness

Changes to footprint-authoring authority must stale downstream derived reasoning.

At minimum:

```text
Footprint Spec
→ Demand Projection/resource association
→ Feasibility
→ Competition
→ Allocation
→ Proposal
```

Determine whether Demand Projection identity itself changes or merely acquires a dependency reference.

Document chosen boundary.

---

## 35. Demand Projection Contract

Define whether Demand Projection should include:

### Option A

Direct footprint-spec reference.

### Option B

Separate normalized planning input paired with Demand Projection.

### Option C

Embedded normalized footprint requirement.

Choose the model that preserves:

* Demand truth;
* authored footprint authority;
* clean revision/freshness.

Do not overburden Demand Projection if the concepts should remain siblings.

---

## 36. Demand Authority Boundary

Determine whether footprint is part of “what effort the Goal demands” or a separate “what resources each session requires.”

Preferred conceptual distinction:

```text
Demand = productive requirement
Footprint = resource cost of satisfying it
```

Preserve unless repository architecture provides stronger evidence otherwise.

---

## 37. Goal-Specific Feasibility Contract

Define future Feasibility input:

```text
Demand Projection
+ applicable Footprint Specification
+ Capacity
→ complete candidate opportunities
```

Feasibility remains:

* one Demand at a time;
* Priority-free;
* competition-free;
* non-reserving.

---

## 38. Feasibility Output

Future Feasible Opportunity must represent:

> one complete legal candidate resource footprint

not merely productive geometry.

It should retain:

* productive session;
* support claims;
* Buffer claims;
* total resource cost;
* lineage.

---

## 39. Feasibility Failure Semantics

Define reason classes such as:

* productive fit unavailable;
* required support unavailable;
* Buffer protection unavailable;
* incomplete Capacity coverage;
* footprint association unresolved;
* ambiguous footprint association.

Do not collapse these into generic “no fit.”

---

## 40. Competition Contract

Define future Competition semantics:

Two Demand candidates compete when their complete exclusive resource footprints contend for the same Capacity/protected resource.

Competition must therefore include hidden support/Buffer contention.

---

## 41. Allocation Contract

Define future Allocation input as complete Feasible Opportunities.

Allocation must:

* choose among already-legal complete footprints;
* conserve all resource claims;
* not rerun footprint projection;
* not rerun Composition.

---

## 42. Proposal Contract

Proposal must snapshot the complete selected Allocation footprint.

It must not:

* derive support;
* derive Buffer;
* infer source association.

---

## 43. Accepted Allocation Contract

Accepted Allocation ultimately freezes the exact complete footprint the user accepted.

Task 9.2.0 defines the upstream semantics required for that future repair.

Do not implement acceptance changes here.

---

## 44. Required vs Optional Acceptance

Define future authority semantics.

Required components:

```text
accepted productive claim
→ required support/protection included automatically as part of the offered atomic footprint
```

Optional components require explicit selection where user choice is meaningful.

Do not treat required support as a separate hidden post-acceptance expansion.

---

## 45. Atomicity Semantics

The Proposal should represent complete resource packages.

If productive work requires support and Buffer:

```text
accept = authorize the whole required footprint
```

This avoids widening authority after acceptance.

---

## 46. Multiple Footprint Variants

If the same Demand can legally use multiple footprint specifications, define where the choice becomes visible.

Potential architecture:

```text
Feasibility variants
→ Allocation alternatives
→ Proposal options
```

Only if variants are authored/equivalent enough to compare.

Do not hide a semantically meaningful user choice inside Feasibility ranking.

---

## 47. User Choice Boundary

If footprint choice changes the nature of the activity materially, require explicit user-visible choice.

If it is merely a derived mechanical implementation of already-authored intent, it may remain automatic.

Define test.

---

## 48. Footprint Specification Scope

Determine scope options:

* Goal-wide;
* Demand-definition-specific;
* Demand-category-specific;
* one-off override.

V1 should choose the smallest coherent model.

Avoid premature inheritance hierarchies.

---

## 49. Defaults

Do not invent a default support/Buffer footprint.

“No footprint specification” should mean one of:

### A. explicitly productive-only

or

### B. footprint unspecified/unknown

The architecture must distinguish these.

This is critical.

---

## 50. Productive-Only Explicit State

Provide explicit semantics equivalent to:

```text
resourceFootprint = productiveOnly
```

when the user/authored source truly requires no support or Buffer.

Do not infer productive-only from absence.

---

## 51. Unspecified State

Provide explicit semantics equivalent to:

```text
resourceFootprint = unspecified
```

when DayFrame lacks authority to know.

This must fail closed where complete resource legality is required.

---

## 52. Migration Semantics

Existing Goals/Demands currently have no footprint association.

Do not migrate all existing data to productive-only automatically unless architecture explicitly proves that is safe.

Preferred migration:

```text
existing association = unspecified
```

unless an exact explicit preexisting source supports inference.

---

## 53. Backward Compatibility

Existing productive-only planning behavior may need a compatibility path.

Architecture must decide whether:

### A. legacy Goals remain productive-only by compatibility rule;

or

### B. legacy Goals are footprint-unknown and cannot use full constructive planning until explicitly resolved.

Choose carefully.

Document user-impact tradeoff.

---

## 54. No Silent Historical Reinterpretation

Do not reinterpret past Accepted Allocations.

Task 9.2.0 should define only future architecture and migration semantics.

Existing Task 9.2 accepted history remains exactly what it was.

---

## 55. Authoring UX Boundary

Do not design detailed UI.

But architecture must identify what future authoring requires conceptually.

For example:

* choose resource-footprint specification;
* explicitly mark productive-only;
* select reusable composition source.

No screen design required.

---

## 56. Template Reuse

If an existing Commitment template can serve as the footprint source, define whether the system reuses:

* support component definitions;
* Buffer rules;
* durations;
* relative geometry.

Do not import unrelated Commitment recurrence/time-window semantics unless explicitly intended.

---

## 57. Recurrence Boundary

Footprint association does not imply recurrence.

A Goal Demand may reuse a resource-footprint specification across many hypothetical sessions without creating:

* Commitment recurrence;
* Goal recurrence beyond existing Demand semantics;
* automatic scheduling.

---

## 58. Commitment Authority Boundary

Referencing a Commitment/template as a footprint source does not mean:

* instantiate that Commitment;
* schedule it;
* inherit its full authoring authority;
* publish it.

Only explicitly selected footprint semantics may cross the boundary.

---

## 59. Composition Authority Boundary

Pre-scheduling footprint projection is derived planning reasoning.

Concrete Composition remains tied to scheduled/authorized reality.

Do not erase this distinction.

---

## 60. Buffer Authority Boundary

Projected Buffer is a candidate resource requirement.

It does not protect actual time until realization.

Preserve:

```text
projected Buffer ≠ realized protected Buffer
```

---

## 61. Support Authority Boundary

Projected support is candidate resource cost.

It does not become an execution-capable activity until realization.

Preserve:

```text
projected support ≠ scheduled support
```

---

## 62. Identity Across Stages

Define the lineage model:

```text
Footprint Specification Component
→ Projected Component
→ Allocated Component
→ Proposed Component
→ Accepted Component
→ future Realized Component
```

The identity need not remain literally identical at every stage, but lineage must remain exact.

---

## 63. Component Lineage

Define which IDs/revisions must survive downstream.

At minimum:

* footprint specification;
* component definition;
* projected component;
* candidate parent;
* Demand;
* Goal.

Future stages can add their own identities.

---

## 64. Shared Component Semantics

Determine whether one support component may support multiple productive sessions.

For V1, choose one of:

### A. prohibit sharing;

### B. allow only explicitly authored shared components;

### C. allow deterministic union where composition already defines it.

Do not leave ambiguous.

---

## 65. Overlapping Buffers

Define whether overlapping projected Buffers:

* union as one protected resource cost;
* remain separate provenance claims over one unioned interval;
* conflict.

Align with Capacity/Composition semantics.

---

## 66. Overlapping Support

Real support activities that overlap typically cannot both consume the same exclusive actor resource unless explicitly modeled as shared.

Define default V1 semantics.

---

## 67. Resource Dimension

Confirm whether V1 Capacity is effectively one exclusive time resource.

If multiple resource dimensions are not currently modeled, do not introduce them here.

Footprint claims should align with existing Capacity semantics.

---

## 68. Actor Assumption

Do not silently introduce “someone else performs support” semantics.

If support consumes the user's Capacity today, preserve that.

If architecture allows external/non-user support, explicitly type it or defer.

---

## 69. Duration Rules

Define whether support duration may be:

* fixed;
* proportional to productive duration;
* bounded formula;
* inherited from source definition.

V1 should support only already-architected deterministic rules.

Do not introduce arbitrary scripting.

---

## 70. Geometry Rules

Define allowable V1 geometry types.

Prefer a closed taxonomy.

For example:

* immediatelyBefore;
* immediatelyAfter;
* fixedOffsetBefore;
* fixedOffsetAfter;
* surroundingBuffer.

Exact taxonomy should derive from existing Composition architecture where possible.

---

## 71. Candidate Mutation

If a productive candidate moves, projected support/Buffer geometry must rederive deterministically.

Projected component identity should change only where semantics materially change.

---

## 72. Candidate Duration Change

If productive duration changes:

* proportional support may change;
* fixed support may not;
* Buffer may or may not.

Define dependency rules.

---

## 73. Minimum Session Semantics

If Demand has minimum session duration, footprint projection occurs only after a valid productive candidate exists.

Support duration must not count toward productive minimum.

---

## 74. Split Demand

For splittable Demand:

Each productive session candidate may receive its own footprint projection.

Define whether support applies:

* per session;
* once per user-day;
* once per Demand period;
* another explicit scope.

This is mandatory.

---

## 75. Per-Session vs Per-Demand Components

Footprint components must declare scope.

At minimum consider:

```text
perSession
perDemandOccurrence
```

Do not assume all support repeats per split session.

---

## 76. Reusable Setup Cost

If one setup supports multiple productive sessions, determine whether V1 supports that.

If not, explicitly defer.

Do not accidentally duplicate setup cost.

---

## 77. User-Day Attribution

Define attribution for:

* productive;
* support;
* Buffer.

Each component should use its actual interval and canonical user-day semantics.

Do not simply inherit productive user-day blindly.

---

## 78. Week/Period Boundaries

If support falls across Demand cadence/week boundary, define whether candidate remains legal.

Do not allow hidden period leakage.

---

## 79. Planning Coverage Expansion

Feasibility may need Capacity coverage beyond the productive candidate horizon.

Architecture must define bounded expansion needed to validate footprint.

Do not silently query unbounded time.

---

## 80. Unknown Footprint

If applicable footprint cannot be determined:

```text
Feasibility = unknown/incomplete
```

not:

```text
support = 0
buffer = 0
```

This is a central invariant.

---

## 81. No-Proposal Interaction

Downstream Proposal may return typed No-Proposal / incompleteInput if footprint authority is unresolved.

Task 9.2.0 should document this future behavior.

---

## 82. Explanation Requirements

Future Proposal explanations should be able to say:

* productive minutes;
* support minutes;
* Buffer minutes;
* total resource cost;
* footprint source;
* required/optional assumptions.

Architecture must preserve sufficient evidence.

---

## 83. Persistence Ownership

Determine where authored Footprint Specification lives.

Likely candidates:

* Goal-planning authority sibling store;
* existing Goal Demand authority store;
* composition/template authority store.

Choose based on semantic ownership, not convenience.

---

## 84. Persistence Requirement

If Footprint Specification is authored reusable authority, it is durable.

Projected Resource Footprint is derived and disposable.

Preserve:

```text
specification = authored durable authority
projection = derived disposable reasoning
```

---

## 85. Versioning

Define:

* specification version;
* component revision;
* migration semantics;
* dependency references.

Material authoring change creates a new revision or equivalent immutable history according to current architecture conventions.

---

## 86. Backup Semantics

Future implementation must back up authored footprint authority.

Task 9.2.0 should recommend expected backup impact but not implement it.

---

## 87. Restore Semantics

Future restore must validate:

* source IDs;
* component IDs;
* Goal/Demand associations;
* revision integrity;
* no malformed geometry rules.

---

## 88. Deletion Semantics

Define what happens when an authored footprint specification is removed while:

* Demand Projection depends on it;
* Proposal exists;
* Accepted Allocation already froze it.

Expected:

* new derived reasoning becomes stale/unknown;
* historical Proposal/Accepted Allocation remains interpretable via frozen decisive evidence.

---

## 89. Relationship Deletion

Deleting Goal ↔ footprint association must not rewrite history.

It affects future planning only.

---

## 90. Footprint Change After Proposal

A material footprint revision must stale Proposal.

It must not mutate Proposal.

---

## 91. Footprint Change After Acceptance

A material footprint-authoring change must not mutate Accepted Allocation.

Future realization uses exactly the accepted frozen footprint once Task 9.2.1/9.3 exist.

If accepted footprint is legacy/incomplete, that remains a separate migration/revalidation problem.

---

## 92. No Retroactive Expansion

A newly added required support component cannot retroactively widen an already accepted allocation.

Future Proposal/acceptance must carry the new footprint.

---

## 93. Naming

Choose durable terminology.

Avoid ambiguous reuse of:

* Commitment;
* Composition;
* Attachment;

if the concept is pre-scheduling and Goal-Demand-specific.

Potential terminology:

* `DemandResourceProfile`
* `DemandResourceFootprintSpec`
* `GoalSessionFootprint`
* `PlanningCompositionSpec`

The specification must choose one canonical term and define it in the glossary.

---

## 94. Glossary Requirement

Define at minimum:

* Resource Footprint Specification;
* Footprint Component;
* Productive Candidate;
* Candidate Parent;
* Projected Resource Footprint;
* Productive Claim;
* Support Claim;
* Buffer Claim;
* Required Component;
* Optional Component;
* Footprint Association;
* Footprint Variant.

---

## 95. Architecture Decision Matrix

Evaluate at least:

| Question              | Option A             | Option B            | Option C                 | Chosen V1 | Rationale |
| --------------------- | -------------------- | ------------------- | ------------------------ | --------- | --------- |
| authority owner       | Goal                 | Demand              | separate spec            |           |           |
| association scope     | Goal-wide            | Demand-specific     | explicit reusable ref    |           |           |
| source reuse          | existing Composition | adapter             | new sibling model        |           |           |
| missing footprint     | productive-only      | unknown             | policy default           |           |           |
| multiple specs        | invalid              | selectable variants | priority order           |           |           |
| split-session support | per-session          | per-demand          | explicit component scope |           |           |
| shared support        | prohibited           | explicit only       | automatic union          |           |           |
| persistence host      | Goal store           | Demand store        | sibling footprint store  |           |           |

---

## 96. Required Data-Flow Diagram

Produce a normative flow materially equivalent to:

```text
Authored Goal
      ↓
Goal Demand Authority
      ↓
Footprint Association
      ↓
Resource Footprint Specification
      ↓
Demand Projection
      ↓
Productive Candidate Session
      ↓
Projected Resource Footprint
  ├─ productive claim
  ├─ support claim(s)
  └─ Buffer claim(s)
      ↓
Goal-Specific Feasibility
      ↓
Competition / Allocation
      ↓
Proposal
      ↓
Accepted Allocation
      ↓
future Realization
```

Mark authored vs derived vs accepted vs scheduled classes.

---

## 97. Required Epistemic Matrix

Include:

| Concept                      | Epistemic Class          | Durable? |      Owns Time? |                 User Authority? |
| ---------------------------- | ------------------------ | -------: | --------------: | ------------------------------: |
| Goal                         | Authored                 |      Yes |              No |                             Yes |
| Demand Authority             | Authored                 |      Yes |              No |                             Yes |
| Footprint Association        | Authored                 |      Yes |              No |                             Yes |
| Footprint Specification      | Authored                 |      Yes |              No |                             Yes |
| Demand Projection            | Derived                  |       No |              No |                              No |
| Productive Candidate         | Derived                  |       No |              No |                              No |
| Projected Resource Footprint | Derived                  |       No |              No |                              No |
| Feasibility                  | Derived                  |       No |              No |                              No |
| Allocation                   | Derived                  |       No |              No |                              No |
| Proposal                     | Proposed                 |  History |              No |                              No |
| Accepted Allocation          | Accepted authority       |      Yes | Claims resource |                             Yes |
| Realized schedule            | Future scheduled reality |      Yes |             Yes | Derived from accepted authority |

---

## 98. Required Association Matrix

Define behavior for:

| Situation                        | Required Outcome |
| -------------------------------- | ---------------- |
| no footprint spec                |                  |
| explicit productive-only         |                  |
| one valid footprint spec         |                  |
| multiple specs                   |                  |
| missing source revision          |                  |
| deleted source                   |                  |
| unsupported component rule       |                  |
| support crosses user-day         |                  |
| Buffer exceeds Capacity coverage |                  |
| optional component omitted       |                  |
| required component infeasible    |                  |
| split Demand                     |                  |

---

## 99. Required Invariants

Verify architecturally:

1. Goal links do not imply footprint association.
2. Footprint association is explicit.
3. missing footprint is not silently treated as zero unless explicitly authored productive-only.
4. Productive Demand remains distinct from resource overhead.
5. Footprint Specification is authored authority.
6. Projected Resource Footprint is derived.
7. projected footprint owns no time.
8. no scheduled parent is required to project footprint.
9. no fake Commitment occurrence is created.
10. support geometry is deterministic.
11. Buffer geometry is deterministic.
12. required components cannot be omitted.
13. optional components require explicit semantics.
14. cross-user-day behavior is deterministic.
15. complete footprint must fit for candidate Feasibility.
16. Feasibility remains one-Demand reasoning.
17. Capacity remains demand-neutral.
18. Allocation does not derive footprint.
19. Proposal does not derive footprint.
20. Accepted Allocation eventually freezes complete footprint.
21. footprint changes stale downstream reasoning.
22. accepted history is never retroactively widened.
23. recurrence is not implied.
24. Commitment scheduling is not implied.
25. projected support is not execution-capable.
26. projected Buffer is not execution-capable.
27. source/component provenance survives downstream.
28. semantic identity does not depend on order.
29. legacy data is not silently reinterpreted.
30. no implementation work occurs in Task 9.2.0.

---

## 100. Required Architecture Specification Artifact

Create a durable architecture artifact.

Filename must contain **`RESULT`**.

Preferred filename:

```text
TASK_9.2.0_GOAL_DEMAND_RESOURCE_FOOTPRINT_ASSOCIATION_ARCHITECTURE_V1_RESULT.md
```

Place it in the Phase 9 architecture/results folder.

It must be implementation-ready.

---

## 101. Required RESULT Sections

The RESULT must include at minimum:

1. Executive Summary
2. Architecture-Reopen Context
3. Blocking Evidence
4. Scope
5. Non-Goals
6. Governing Architecture
7. Current-System Gap
8. Canonical New Concept
9. Canonical Terminology
10. Footprint Specification Definition
11. Authorship Owner
12. Association Model
13. Reusable vs Demand-Specific Semantics
14. Goal Link Boundary
15. Multiple Linked Commitment Semantics
16. Multiple Footprint Specification Semantics
17. Candidate Parent Definition
18. Candidate Parent Identity
19. Productive Component
20. Support Component
21. Buffer Component
22. Requiredness
23. Optionality
24. Relative Geometry
25. Geometry Taxonomy
26. Deterministic Projection
27. Projected Resource Footprint
28. Projected Identity
29. Composition Reuse Boundary
30. No Scheduled Parent Rule
31. No Fake Commitment Rule
32. Cross-User-Day Semantics
33. Planning-Horizon Interaction
34. Coverage Requirements
35. Source Revision
36. Provenance
37. Freshness
38. Demand Projection Integration
39. Demand Authority Boundary
40. Feasibility Contract
41. Feasibility Output
42. Feasibility Failure Modes
43. Competition Contract
44. Allocation Contract
45. Proposal Contract
46. Accepted Allocation Contract
47. Required Acceptance Semantics
48. Optional Acceptance Semantics
49. Atomic Footprint Semantics
50. Multiple Variant Semantics
51. User Choice Boundary
52. Footprint Scope
53. Productive-Only State
54. Unspecified State
55. Migration Semantics
56. Legacy Compatibility
57. Template Reuse
58. Recurrence Boundary
59. Commitment Authority Boundary
60. Composition Authority Boundary
61. Buffer Authority Boundary
62. Support Authority Boundary
63. Identity Across Stages
64. Component Lineage
65. Shared Component Semantics
66. Overlapping Buffer Semantics
67. Overlapping Support Semantics
68. Resource Dimension
69. Actor Assumptions
70. Duration Rules
71. Geometry Rules
72. Candidate Move Behavior
73. Candidate Duration Behavior
74. Minimum Session Behavior
75. Split Demand Behavior
76. Component Scope
77. Reusable Setup Cost
78. User-Day Attribution
79. Period-Boundary Behavior
80. Unknown Footprint Handling
81. No-Proposal Interaction
82. Explanation Requirements
83. Persistence Ownership
84. Durability
85. Versioning
86. Backup Implications
87. Restore Implications
88. Deletion Semantics
89. Relationship Deletion
90. Proposal Staleness
91. Post-Acceptance Change
92. No Retroactive Expansion
93. Naming Decision
94. Glossary
95. Architecture Decision Matrix
96. Data-Flow Diagram
97. Epistemic Matrix
98. Association Matrix
99. Invariant Verification
100. Implementation Impact Map
101. Migration Strategy
102. Task 9.2.1 Implementation Contract
103. Task 9.2.2 Impact
104. Task 9.3 Impact
105. Architecture Reopen Resolution
106. Recommended Next Task
107. Completion Statement

---

## 102. Required Implementation Impact Map

The architecture must state exactly which later layers need implementation changes.

At minimum assess:

| Layer               | Expected Change   |
| ------------------- | ----------------- |
| Goal authoring      |                   |
| Demand authority    |                   |
| Demand Projection   |                   |
| Composition         |                   |
| Capacity            |                   |
| Goal Feasibility    |                   |
| Competition         |                   |
| Allocation          |                   |
| Proposal            |                   |
| ProposalDecision    |                   |
| Accepted Allocation |                   |
| Persistence         |                   |
| Backup              |                   |
| UI authoring        |                   |
| Scheduled blocks    | Deferred to 9.2.2 |
| Execution           | Deferred to 9.2.2 |
| HistoricalPlan      | Deferred to 9.2.2 |
| Realization         | Deferred to 9.3   |

---

## 103. Task 9.2.1 Implementation Contract

The RESULT must end with a concrete contract telling Task 9.2.1 exactly what to implement.

At minimum:

* canonical footprint-spec type;
* ownership/persistence;
* association type;
* candidate-parent identity;
* projection function contract;
* component geometry rules;
* requiredness;
* user-day behavior;
* Feasibility input/output changes;
* Competition input semantics;
* Allocation claim semantics;
* Proposal snapshot semantics;
* Accepted Allocation snapshot semantics;
* freshness dependencies;
* migration rules.

No unresolved “TBD” may remain on any field required for 9.2.1.

---

## 104. Architecture Reopen Resolution Criteria

Task 9.2.0 resolves the current architecture reopen only if it answers all of the following:

1. What authored object defines the footprint?
2. Who owns it?
3. How is it associated with Goal Demand?
4. How is productive-only represented explicitly?
5. How is unknown/unset represented?
6. How does candidate-session identity exist before scheduling?
7. How are support intervals derived?
8. How are Buffer intervals derived?
9. How are required and optional components represented?
10. How do split sessions work?
11. How do cross-user-day components work?
12. How are multiple footprint definitions resolved?
13. How does Task 8.4 Composition participate?
14. How does Feasibility consume the result?
15. How does Competition use complete footprint?
16. How does Allocation receive complete claims?
17. How does Proposal snapshot them?
18. How will Accepted Allocation freeze them?
19. How do revision/freshness/provenance work?
20. How are legacy Goals/Demands migrated?

If any remain unresolved, do not declare architecture complete.

---

## 105. Stop Conditions

Stop and report if the evidence shows:

* Task 8.4 Composition semantics cannot be reused without material redesign;
* Goal Demand architecture would need to be fundamentally rewritten;
* a complete footprint cannot be known until after actual scheduling;
* the same support component inherently requires global multi-Demand optimization before Feasibility;
* current user-day semantics cannot deterministically project cross-boundary support;
* existing Goal links are carrying undocumented authority that contradicts their accepted specification;
* no bounded V1 authorship model can represent the association without speculative policy.

Do not paper over unresolved architecture.

---

## 106. Governance

Because this is an architecture-definition task:

Update as appropriate:

* `CURRENT_STATE.md`;
* architecture reopen notes;
* `DECISIONS.md` for genuinely accepted new architecture decisions;
* `CHANGELOG.md`.

Do not implement production code.

Do not rewrite completed RESULT artifacts.

Do not rewrite roadmap except to record the bounded inserted prerequisite sequence if governance conventions require it.

---

## 107. Repository Discipline

Before work:

1. inspect `git status`;
2. preserve current Task 9.1/9.2 worktree exactly;
3. preserve the failed 9.2.1 no-change state;
4. do not clean;
5. do not modify production code;
6. do not commit;
7. do not push unless explicitly instructed.

---

## 108. Validation

Because this task is architecture-only, validate:

* Markdown formatting;
* internal terminology consistency;
* references to current executable evidence;
* no unresolved implementation-critical ambiguity;
* no contradiction with accepted architecture;
* `git diff --check` for documentation changes if applicable.

Do not claim test-suite changes.

---

## 109. Expected Next Sequence

If Task 9.2.0 completes successfully:

```text
Task 9.2.0
Goal-Demand Resource Footprint Association Architecture
        ↓
Task 9.2.1
Accepted Resource Footprint Propagation V1
        ↓
Task 9.2.2
Realized Schedule Identity Foundation V1
        ↓
Task 9.3
Accepted Allocation Realization V1
```

Do not skip 9.2.1 or 9.2.2.

---

## 110. Recommended Next Task

Expected next task:

> **Task 9.2.1 — Accepted Resource Footprint Propagation V1**

But only after this architecture artifact supplies a complete implementation contract.

---

## 111. Final Completion Statement

The Task 9.2.0 RESULT must end with a completion statement materially equivalent to:

> **Task 9.2.0 — Goal-Demand Resource Footprint Association Architecture V1 complete.**
>
> DayFrame now has a fully specified pre-scheduling architecture for associating Goal Demand with explicit resource-footprint authority before any concrete scheduled parent exists: productive Goal Demand remains distinct from its nonproductive resource cost, while a durable authored Resource Footprint Specification explicitly defines the support activities and Buffer protection that accompany hypothetical Demand-serving sessions; Goal links remain ordinary Goal associations and do not silently acquire footprint semantics, missing footprint authority remains distinguishable from an explicitly productive-only definition, and multiple possible sources or variants follow explicit deterministic selection rather than creation order or inference; hypothetical productive sessions act as derived candidate parents without becoming scheduled Commitments, and pure footprint projection deterministically produces exact productive, support, and Buffer claims with requiredness, component identity, canonical user-day behavior, source revision, and provenance across arbitrary candidate geometry, including bounded cross-user-day cases; required support and protection are part of complete candidate Feasibility, projected claims own no time and reserve no Capacity, Goal-Specific Feasibility remains single-Demand reasoning over demand-neutral Capacity, and future Competition/Allocation will operate on complete already-derived resource footprints rather than re-running Composition or inventing hidden resource cost; the architecture defines revision, freshness, persistence, migration, productive-only versus unspecified states, multiple-footprint behavior, split-session/component scope, Composition reuse, lineage across Projection → Feasibility → Allocation → Proposal → Accepted Allocation, and exact implementation contracts for downstream propagation; historical accepted authority is never retroactively widened and no schedule, execution, publication, recurrence, or Progress authority is introduced; the root Task 9.2 architecture reopen is resolved at the semantic layer, Task 9.2.1 is now authorized to implement complete resource-footprint propagation, and Tasks 9.2.2 and 9.3 remain intentionally blocked in sequence until that implementation succeeds.
