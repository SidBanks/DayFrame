# Goal Structure Architecture Specification

## Status

Ready for specification.

## Phase

Post-Phase 7 Architectural Follow-Up

## Task Type

Authoritative architecture-specification task defining DayFrame's Goal Structure / Decomposition domain following the completed Goal Structure / Decomposition Architecture Audit.

This task must convert the audit's established executable truth and identified architectural seams into a normative Goal Structure contract.

This task must **not** implement the architecture.

This task is read-only with respect to the existing repository.

**The required specification result artifact is the sole permitted repository write.**

---

## 1. Objective

Define the minimum authoritative Goal Structure architecture required for DayFrame to represent relationships among desired outcomes without collapsing Goals into tasks, Commitments, milestones, dependencies, or generic project-management objects.

The specification must establish how structured Goals interact with:

* Goal identity and lifecycle;
* Subgoals;
* broader/parent outcomes;
* contribution relationships;
* dependencies and prerequisites;
* Milestones;
* Goal Demand;
* Demand Projection;
* Goal Priority;
* Progress;
* lifecycle state;
* historical provenance;
* Summary;
* execution/logging;
* Allocation;
* Proposal;
* Found Time / Live Opportunity.

The central architectural question is:

> **How should DayFrame represent structured relationships among desired outcomes so that Goal Demand, Progress, priority, lifecycle, historical provenance, Allocation, and Proposal remain deterministic, explainable, non-duplicative, and subordinate to explicit user authority?**

The specification must define only the structure required by DayFrame's planning model.

It must not turn DayFrame into a general-purpose project-management system.

---

## 2. Authoritative Audit Basis

Use the completed Goal Structure / Decomposition Architecture Audit as the primary executable-evidence basis.

The audit established:

* **GS4 — Flat Goal Domain with Indirect Analogues.**
* `GoalV1` is currently an independent, revisioned outcome.
* Goal-to-Goal relationships are not implemented.
* Parent/child Goal support is not implemented.
* Milestones are not first-class.
* Goal dependencies are not implemented.
* Progress roll-up is not implemented.
* Demand roll-up / structural attribution is not implemented.
* Goal Priority inheritance is neither implemented nor normatively defined.
* Historical Goal provenance preserves immediate Goal context but not structural relationships.
* Goal-linked Commitments are service/activity associations, not Subgoals.
* Measurements are Progress primitives, not Milestones.
* Scheduling dependencies are not Goal dependencies.
* A simple `parentGoalId` is insufficient.
* A generic tree is insufficient as a default architectural assumption.
* shared outcomes and dependency relationships may require graph-capable semantics.
* Goal Structure affects Demand / Allocation inputs.
* Constructive Proposal should preferably consume normalized, eligible, non-duplicative Demand rather than infer Goal structure itself.
* Goal Structure therefore requires normative specification before constructive Proposal architecture is specified.

The audit recommended:

> **Path A — Goal Structure Architecture Specification.**

Treat these findings as evidence constraints, not as permission to invent implementation.

---

## 3. Existing Normative Architecture

The specification must remain consistent with the accepted DayFrame architecture.

### Goal

A Goal describes a desired outcome.

A Goal does not own time merely by existing.

### Commitment

A Commitment owns or constrains authorized time.

### Capacity

Capacity is derived, demand-neutral, and non-authoritative.

### Goal Demand

Goal Demand is an independently identified, versioned planning-resource request made in service of one Goal.

Demand requests resources but does not own time.

### Goal-Specific Feasibility

Feasibility evaluates one Demand Projection against Capacity without allocating, recommending, or scheduling.

### Allocation

Allocation provisionally and deterministically distributes Capacity among competing Goal Demands.

Allocation is derived and non-authoritative.

### Proposal

Proposal is the constructive recommendation boundary.

### Accepted Allocation

Accepted Allocation records explicit user authority over Goal-driven resource use.

### Scheduled Goal Work

Scheduled Goal Work is the time-owning realization of accepted authority.

### Progress

Progress is outcome measurement.

Planning effort, scheduled effort, executed effort, and Progress remain distinct.

### History

Decision-time historical truth must not be reconstructed from mutable current state.

### Learning

Historical tendencies may inform recommendations but do not silently become authority.

---

## 4. Required Epistemic Separation

The specification must preserve explicit epistemic categories.

At minimum distinguish:

* authored Goal;
* authored Goal Structure relationship;
* authored Goal Priority;
* authored Goal Demand Intent;
* derived Demand Projection;
* derived structural eligibility;
* derived structural Demand normalization;
* derived Progress;
* derived structural Progress interpretation;
* derived Capacity;
* derived Feasibility;
* derived Allocation;
* proposed action;
* accepted decision;
* scheduled reality;
* execution evidence;
* historical analytical evidence;
* learned tendency;
* reusable authored preference.

No derived relationship, inferred decomposition, generated Subgoal, suggested Milestone, dependency suggestion, Progress inference, or learned pattern may silently become authored Goal Structure.

---

## 5. Normative Goal Structure Definition

Define a concise normative definition for **Goal Structure**.

The definition must establish that Goal Structure represents meaningful relationships among desired outcomes and outcome checkpoints.

It must explicitly state what Goal Structure is **not**.

At minimum distinguish it from:

* task hierarchy;
* Commitment hierarchy;
* recurrence;
* scheduling dependency;
* activity sequence;
* checklist;
* project-management work breakdown structure;
* Goal Demand;
* Goal Priority;
* Progress;
* Proposal;
* display grouping.

The specification must decide whether Goal Structure itself is an authored authority domain, a relationship authority domain associated with Goals, or another bounded model.

---

## 6. Goal Structure Responsibility Boundary

Define exactly what Goal Structure owns.

Candidate responsibilities include:

* relationship identity;
* relationship type;
* source Goal;
* target Goal or Milestone;
* relationship lifecycle;
* required/optional semantics;
* contribution semantics;
* dependency semantics;
* structural applicability;
* structural provenance;
* deterministic traversal;
* cycle policy;
* Demand-accounting policy references;
* Progress-contribution policy references;
* priority-scope semantics.

Determine which belong directly in Goal Structure and which belong in adjacent domains.

Do not create an all-purpose relationship record.

---

## 7. Goal Identity vs Structural Identity

Specify the relationship between:

* Goal identity;
* Goal revision;
* Goal lifetime;
* Goal Structure relationship identity;
* relationship revision;
* relationship effective lifetime.

The audit found Goal UUID identity and revisions but no distinct structural edge identity.

Decide whether a structural relationship requires:

* opaque never-reused identity;
* monotonic revision;
* created timestamp;
* updated timestamp;
* effective-from/effective-until semantics;
* retirement;
* supersession.

Historical restructuring must not rewrite old decision interpretation.

---

## 8. Goal Lifetime Semantics

Clarify whether current Goal identity is sufficient for future structural relationships or whether the architecture requires an explicit Goal lifetime/incarnation concept.

Consider:

* archived Goal reactivated;
* completed Goal reactivated;
* removed Goal;
* backup/restore;
* imported Goal;
* newly created Goal with similar title;
* relationship targeting an old revision;
* relationship history after structural edits.

Do not require a new Goal incarnation abstraction unless semantically necessary.

---

## 9. Structural Relationship Taxonomy

Specify the minimum typed relationship taxonomy.

The audit identified candidates:

### Containment / Parent–Child

A subordinate outcome is part of a broader outcome.

### Contribution

One outcome contributes toward another without necessarily being contained by it.

### Dependency / Prerequisite

One outcome affects another outcome's eligibility or actionability.

### Milestone Membership

A checkpoint belongs to or evaluates progress toward a Goal.

Determine which relationships must be first-class.

Avoid redundant inverse relationships where one can be deterministically derived.

Explicitly distinguish:

* containment;
* contribution;
* dependency;
* inverse display relationships;
* derived blocking state.

---

## 10. Parent Goal

Define **Parent Goal** if retained as a normative concept.

Determine whether “Parent Goal” is:

* a distinct Goal type;
* an ordinary Goal participating in a containment relationship;
* a presentation term only.

Prefer preserving Goal identity semantics unless evidence requires a subtype.

Define what parenthood does and does not imply.

It MUST NOT automatically imply:

* priority inheritance;
* Demand aggregation;
* Progress aggregation;
* completion cascade;
* dependency;
* scheduling authority.

---

## 11. Subgoal

Define **Subgoal** normatively.

Candidate definition:

> A Subgoal is a Goal participating as the subordinate outcome in an explicit structural relationship to another Goal while retaining Goal identity and outcome semantics.

Determine whether this definition is sufficient.

Specify whether a Subgoal may independently have:

* lifecycle;
* target date;
* measurement policy;
* Progress;
* Goal Priority;
* Goal Demand;
* Commitment links;
* other structural relationships.

Specify what subordination itself changes.

Do not make Subgoal a Commitment.

---

## 12. Goal vs Subgoal Type Model

Decide whether Goal and Subgoal require separate persisted object types.

Evaluate:

### Model A — Separate Goal / Subgoal Types

### Model B — One Goal Type + Typed Structural Relationships

### Model C — Hybrid

Select one normative model.

Explain consequences for:

* identity;
* lifecycle;
* persistence;
* querying;
* historical provenance;
* Demand;
* Progress;
* UI;
* future extensibility.

---

## 13. Milestone Definition

Define **Milestone** normatively.

The audit established that current measurements are only partial analogues and Progress observations are the wrong abstraction.

A Milestone should represent a meaningful checkpoint or state in progress toward an outcome without automatically becoming an independently competing Goal.

Determine whether a Milestone:

* has independent identity;
* has lifecycle/state;
* belongs to one or more Goals;
* may have a target/evaluation rule;
* may depend on another Milestone or Goal;
* may gate Goal Demand;
* may contribute to Progress;
* may be completed explicitly;
* may be completed through evidence.

Do not turn every measurement threshold into a Milestone.

---

## 14. Milestone vs Subgoal

Establish the boundary.

Example:

```text
Goal: Earn Network+
  → Subgoal: Complete Network+ Course
  → Milestone: Score 80% on three practice exams
```

Determine what makes “Complete Network+ Course” an outcome and “Score 80%...” a checkpoint.

At minimum consider:

* independent outcome identity;
* independent Demand;
* independent Priority;
* independent Progress;
* independent lifecycle;
* structural contribution.

Provide a normative decision rule.

---

## 15. Milestone vs Measurement

Establish the relationship between Milestone and the existing measurement/Progress architecture.

Determine whether:

* measurement evidence may satisfy a Milestone;
* Milestone may reference measurement policy;
* Milestone may aggregate observations;
* milestone completion may be manually authored;
* measurement target attainment automatically changes Milestone state;
* such automatic transition requires explicit policy.

Preserve:

**Observation ≠ Milestone.**

**Measurement target ≠ Milestone unless explicitly modeled as one.**

---

## 16. Goal Dependency

Define Goal Dependency normatively.

At minimum distinguish:

### Hard Prerequisite

A downstream Goal/Demand is not eligible until prerequisite condition is satisfied.

### Advisory Dependency

A relationship informs Proposal or explanation but does not prohibit eligibility.

Determine whether both are required.

Define what state satisfies a dependency:

* Goal completion;
* Milestone completion;
* Progress threshold;
* explicit user override;
* other declared condition.

Do not infer dependency from containment.

---

## 17. Dependency vs Scheduling Dependency

Explicitly separate:

**Outcome Dependency**

“This outcome becomes eligible after another outcome/state.”

from:

**Scheduling Dependency**

“This time-owning activity must occur before/after another activity.”

Goal Structure MUST NOT become a replacement for Commitment placement constraints.

---

## 18. Derived Blocking State

Determine whether `blocked` should be persisted structural authority or derived from dependency evaluation.

Prefer deriving inverse/blocking state from authoritative dependency relationships unless a distinct authored meaning is required.

Define:

* blocked;
* eligible;
* conditionally eligible;
* unknown/incomplete evaluation;

as appropriate.

Do not reuse existing scheduling `blocked` semantics.

---

## 19. Containment vs Contribution

Resolve the distinction between:

### Containment

“This subordinate outcome is part of this broader outcome.”

### Contribution

“This outcome helps advance another outcome but is not necessarily structurally contained by it.”

Example:

```text
Build Portfolio
  contributes to
Build PDS

Build Portfolio
  contributes to
Improve Web Development Skills
```

Determine whether contribution permits multiple targets.

Determine whether containment permits multiple parents.

---

## 20. Tree vs Graph Model

Select the normative topology.

Evaluate at minimum:

### Model A — Strict Tree

Every Subgoal has one parent.

### Model B — General Directed Graph

Goals may have multiple structural parents/contributions.

### Model C — Hybrid

Containment is constrained while contribution/dependency are graph-capable.

The audit strongly cautioned against assuming a generic tree.

Choose the smallest model that preserves correct semantics.

---

## 21. Cycle Semantics

Define cycle rules separately for each structural relationship.

Examples:

```text
A contains B
B contains A
```

```text
A depends on B
B depends on A
```

```text
A contributes to B
B contributes to A
```

Determine which cycles are:

* invalid;
* permitted;
* permitted but non-aggregating;
* structurally meaningless.

Specify deterministic cycle detection requirements.

---

## 22. Required vs Optional Structural Children

Determine whether containment relationships need explicit semantics such as:

* required;
* optional;
* contributory;
* informational.

If parent completion or Demand accounting depends on child structure, requiredness must be explicit.

Do not infer requiredness merely because a relationship exists.

---

## 23. Goal Completion and Structure

Specify how Goal completion interacts with structure.

Evaluate:

### Explicit Completion Only

Parent completion remains user-authored regardless of children.

### Derived Completion Eligibility

Children/milestones may make a parent eligible for completion but not automatically complete it.

### Policy-Governed Automatic Completion

Explicitly configured structural policy may automatically complete a parent.

Select normative semantics.

Preserve user authority and historical provenance.

---

## 24. Child Completion

Specify what happens when a Subgoal completes.

Determine effects, if any, on:

* parent lifecycle;
* parent Progress;
* parent Demand;
* sibling eligibility;
* dependencies;
* Milestones;
* Proposal eligibility.

Do not allow completion to propagate merely because a child relationship exists.

---

## 25. Parent Completion

Specify what happens to active Subgoals and Demands when a broader Goal completes.

Potential semantics include:

* children remain independently active;
* children become structurally inactive;
* Demand is suspended;
* explicit policy determines behavior.

Avoid silent destructive cascades.

Historical relationships must remain preserved.

---

## 26. Archival and Reactivation

Specify structural behavior when:

* parent archived;
* child archived;
* dependency target archived;
* Milestone archived/retired;
* Goal reactivated.

Distinguish:

* lifecycle authority;
* current planning eligibility;
* historical preservation.

Archival must not erase historical structure.

---

## 27. Structural Eligibility

Define a derived **Structural Eligibility** concept if warranted.

It should answer whether a Goal/Demand is structurally eligible for current planning based on:

* Goal lifecycle;
* required dependencies;
* relevant Milestones;
* parent/child structural state;
* explicit overrides.

It must not:

* create Demand;
* allocate Capacity;
* rank Goals;
* schedule work.

Determine whether Structural Eligibility is required as an explicit derived read model or merely a defined evaluation stage.

---

## 28. Goal Demand Structural Boundary

Use the accepted Goal Demand architecture without silently rewriting it.

Goal Demand currently belongs to exactly one Goal.

Specify how Goal Structure affects Demand while preserving that rule where possible.

Determine whether Goal Structure should:

* normalize Demand before projection;
* qualify Demand eligibility;
* attribute Demand among related Goals;
* derive parent summaries;
* define containment of requested effort.

Do not make a parent Goal's existence automatically create Demand.

---

## 29. Parent / Child Demand Models

Resolve the ambiguity identified by the audit.

Evaluate:

### Model A — Independent Demand Only

Parent and child Demand are always additive.

### Model B — Child Demand Always Nested

Child Demand is always contained in parent Demand.

### Model C — Parent Demand Derived from Children

Parent cannot independently request resources.

### Model D — Explicit Demand Relationship Semantics

Demand relationship declares independent, included/nested, derived, or another bounded accounting mode.

Select the normative model.

The architecture must be able to distinguish:

```text
Parent: 5 hours
Child: 2 additional hours
Total: 7
```

from:

```text
Parent: 5 hours total
Child: 2 of those 5
Total: 5
```

without guessing.

---

## 30. Demand Contribution / Attribution

Define the exact architectural mechanism preventing structural Demand double counting.

Determine whether this belongs to:

* Goal Structure relationship;
* Goal Demand relationship;
* Demand Projection normalization policy;
* separate Demand Attribution authority.

Specify:

* identity;
* direction;
* amount/percentage if applicable;
* inclusion semantics;
* provenance;
* revision;
* horizon interaction;
* multiple-parent behavior.

Do not conflate this with existing Commitment satisfaction attribution.

---

## 31. Existing Commitment Satisfaction + Structured Demand

Resolve composition between:

**Goal-linked Commitment satisfaction attribution**

and:

**parent/child Demand accounting.**

Example:

```text
Parent Goal Demand: 5h total
Child Goal Demand: 2h included
Child linked Commitment satisfies: 1h
```

Determine where the one hour is credited and how DayFrame prevents it from being counted against both parent and child independently.

Preserve:

**Goal link alone does not establish Demand satisfaction.**

---

## 32. Demand Normalization

Define a deterministic structural Demand-normalization stage if required.

Candidate responsibility:

```text
Goal Structure
+ active Goal Demand Intent
+ Demand relationship/accounting authority
+ structural eligibility
→ normalized, eligible, non-duplicative Demand inputs
→ Demand Projection / Feasibility / Allocation
```

Determine whether normalization occurs:

* before Demand Projection;
* as part of Demand Projection;
* after Projection but before Competing Demand.

Select one boundary.

The result must preserve original Demand identities and provenance.

---

## 33. Demand Normalization Output

If a normalization stage is adopted, define its output sufficiently to support downstream architecture.

Potential fields/concepts:

* source Demand identity/revision;
* Goal identity;
* structural relationship provenance;
* requested amount;
* independently additive amount;
* included amount;
* credited amount;
* remaining amount;
* eligibility;
* exclusion reason;
* horizon;
* normalization-policy version;
* dependency fingerprint;
* structural fingerprint.

Do not define production TypeScript.

---

## 34. Demand Conservation

Establish invariants ensuring structural accounting does not create or destroy Demand unintentionally.

Examples:

* nested child Demand does not add to parent total;
* independent child Demand does add;
* shared child Demand is not multiplied by number of parents;
* attributed Commitment satisfaction is credited once;
* parent summaries do not become new competing Demand;
* derived parent Demand cannot coexist additively with its contributing child Demand unless explicitly authorized.

Define conservation semantics.

---

## 35. Shared Subgoal Demand

Resolve the multi-parent case.

Example:

```text
Build Portfolio
  contributes to Build PDS
  contributes to Improve Web Development Skills
```

If `Build Portfolio` has two hours of Demand, determine whether that Demand:

* exists once;
* exists once but contributes explanatory credit to both parents;
* is partitioned;
* can be explicitly duplicated only through separate Demand authority.

The architecture MUST prevent graph traversal from duplicating the same Demand merely because multiple paths reach it.

---

## 36. Goal Priority Structural Boundary

Use the accepted Goal Priority architecture:

* Goal Priority is separate authored planning authority;
* it ranks discretionary outcome Demand;
* it is distinct from Commitment priority;
* derived urgency does not mutate it.

Specify how Goal Structure affects Goal Priority.

Do not silently inherit priority.

---

## 37. Priority Models

Evaluate:

### Model A — No Inheritance

Every Goal Priority is independent.

### Model B — Automatic Parent Inheritance

Children inherit unless overridden.

### Model C — Explicit Scoped Propagation

Parent priority may apply to descendants only through explicit authored scope.

### Model D — Derived Structural Context

Parent priority remains separate but may be explanatory/advisory downstream without becoming child authority.

Select the normative model or bounded combination.

Address shared/multi-parent children.

---

## 38. Priority Conflict

Specify behavior when a shared Subgoal relates to parents with different priorities.

The architecture MUST NOT silently average, sum, maximize, or otherwise manufacture a new child priority without explicit semantics.

Determine whether:

* child owns its own priority;
* explicit propagated authority resolves scope;
* parent priorities remain contextual only.

Preserve explainability.

---

## 39. Progress Structural Boundary

Preserve existing Progress semantics as per-Goal outcome measurement.

Specify whether Goal Structure may derive higher-level Progress interpretation without mutating underlying observations.

Distinguish:

* child Progress;
* parent Progress;
* milestone state;
* contribution;
* completion;
* planning effort.

Do not make scheduled/executed effort automatically become Progress.

---

## 40. Progress Roll-Up Models

Evaluate:

### Model A — No Roll-Up

Every Goal Progress remains independent.

### Model B — Completion Roll-Up

Required child completion informs parent completion eligibility.

### Model C — Weighted Progress Roll-Up

Child Progress contributes numerically.

### Model D — Explicit Contribution Policy

Only explicitly configured relationships contribute, with defined measurement compatibility.

### Model E — Mixed

Different relationships/policies support different forms.

Select the normative architecture.

Avoid universal percentage averaging.

---

## 41. Measurement Compatibility

If Progress contribution is allowed, specify how incompatible measurement systems are handled.

Examples:

* percentage;
* count;
* dollars;
* body weight;
* hours;
* binary completion;
* manually observed quantity.

No automatic aggregation may occur across semantically incompatible units.

Determine whether parent Progress aggregation requires an explicit parent measurement/contribution policy.

---

## 42. Milestone Contribution to Progress

Specify whether Milestone completion:

* may be Progress evidence;
* may change parent Progress;
* may merely be displayed;
* may gate Demand/dependency;
* may contribute only through explicit policy.

Do not assume Milestone completion equals Goal completion.

---

## 43. Structural Progress Provenance

Any derived structural Progress must preserve:

* contributing Goal/Milestone identities;
* revisions;
* relationship identities/revisions;
* measurement definitions;
* observations;
* evaluation cutoff;
* aggregation/contribution policy version.

Current mutable structure must not rewrite historical Progress interpretation.

---

## 44. Ordering Semantics

Normatively distinguish:

* containment order;
* display order;
* priority order;
* dependency order;
* scheduling order.

Determine whether Goal Structure owns any display ordering at all.

Do not use:

* UUID sort;
* array insertion order;
* Commitment priority;
* dependency traversal;

as implicit user-facing ordering.

---

## 45. Suggested Decomposition

Define the authority boundary for engine-suggested Goal decomposition.

DayFrame may eventually suggest:

```text
Goal: Earn Network+
Possible decomposition:
  → Complete Course
  → Complete Practice Exams
  → Schedule Exam
```

Such suggestions are proposed structure, not authored Goal truth.

Determine what explicit acceptance must create:

* new Goals;
* relationships;
* Milestones;
* dependencies;
* some combination.

Preserve original suggestion provenance where historically relevant.

Do not design the suggestion algorithm.

---

## 46. Direct User Authoring

Distinguish engine-suggested decomposition from direct authoring.

The user must be able to explicitly establish structural authority without requiring a generated suggestion.

Specify whether direct authoring of a relationship is equivalent in authority to accepting a proposed relationship.

---

## 47. Structural Modification

Define how structural edits behave.

Examples:

* move Subgoal from one parent to another;
* add second contributing parent;
* change containment to contribution;
* remove dependency;
* change required child to optional;
* change Demand-accounting semantics.

Structural modification must:

* preserve old relationship history;
* create new current authority;
* stale dependent derived state;
* not rewrite past Proposal/Allocation/Progress interpretation.

---

## 48. Structural Removal

Determine whether removing a current relationship:

* retires the relationship;
* deletes it;
* supersedes it.

For historically relevant relationships, destructive deletion must not erase decision-time truth.

Specify current-state visibility separately from historical preservation.

---

## 49. Historical Goal Structure

Define what must be frozen or immutably resolvable when Goal Structure materially affects:

* Demand normalization;
* Goal Priority interpretation;
* dependency eligibility;
* Progress;
* Allocation;
* Proposal;
* Accepted Allocation;
* Scheduled Goal Work;
* Summary.

Determine whether history stores:

* relationship snapshots;
* immutable relationship revisions;
* ancestor/contributor paths;
* structural fingerprint;
* only the decisive relationships.

Avoid freezing an entire Goal graph for every occurrence unless necessary.

---

## 50. Historical Restructuring

Specify behavior when:

```text
A → B
```

was true at decision time, then later:

```text
C → B
```

becomes current structure.

Historical decisions made while `A → B` was authoritative must remain interpretable as such.

Current Summary may present current structure and historical structure differently, but labels must prevent confusion.

---

## 51. Execution and Logging

Execution remains evidence about actual performed activity.

Specify how structured Goal context should be preserved when executed work serves a Subgoal that contributes to broader Goals.

Example:

```text
Earn Network+
  → Complete Practice Exams
      → scheduled Practice Exam session
```

The execution record must not be duplicated for every ancestor.

Determine whether historical publication should preserve:

* immediate Goal served;
* structural relationship context;
* ancestor contribution context;
* decision-time structural fingerprint.

Progress effects remain governed separately.

---

## 52. Summary Semantics

Define high-level Summary requirements for structured Goals.

Summary must not double count:

* scheduled effort;
* execution;
* Demand;
* Progress;
* accepted allocations;

merely because one fact is reachable through multiple Goal paths.

Specify the distinction between:

* direct activity;
* contributed activity;
* aggregate parent view;
* unique system-wide totals.

Do not redesign Summary UI.

---

## 53. Goal Activity

Determine whether existing per-Goal Goal Activity semantics should remain direct/immediate or whether future structured Goal Activity may include descendants/contributors.

If aggregate views are allowed, require:

* explicit scope;
* deduplication by durable occurrence/execution identity;
* relationship provenance;
* historical/current-structure distinction.

Do not silently change existing direct Goal Activity meaning.

---

## 54. Allocation Boundary

Allocation must receive correct normalized Demand.

Specify what structural information Allocation itself needs.

Prefer that Allocation consume:

* normalized Demand identities;
* Goal identities;
* Goal Priority authority;
* eligibility;
* relevant provenance;

without traversing Goal Structure itself.

Determine whether any structural fact must remain visible to Allocation for explanation or policy.

---

## 55. Proposal Boundary

Proposal should remain constructive and should not have to infer Goal decomposition.

Specify the handoff.

Potential flow:

```text
Goal Structure
→ Structural Eligibility
→ Demand Normalization
→ Demand Projection
→ Feasibility
→ Competing Demand
→ Allocation
→ Proposal
```

Proposal may receive structural provenance for explanation.

It MUST NOT:

* create Subgoals silently;
* infer parent/child Demand accounting;
* invent priority inheritance;
* bypass dependencies;
* duplicate shared-child Demand.

---

## 56. Found Time / Live Opportunity Boundary

Specify only the Goal Structure dependency required for future Found-Time planning.

A future Found-Time system may ask:

> Which currently eligible unmet Goal Demand can use this newly available Capacity?

Goal Structure should provide normalized eligibility/accounting upstream.

Found-Time Proposal must not:

* choose a Subgoal solely because its parent exists;
* infer inherited priority;
* duplicate shared Demand;
* bypass prerequisite state;
* create new Goal Structure.

Do not specify Found Time itself.

---

## 57. Commitment Boundary

Goal Structure MUST remain distinct from Commitment Composition.

A Subgoal is an outcome.

An attached Commitment/activity is time-owning work.

Do not use Goal containment to represent:

```text
Work
  → Commute
```

or:

```text
Gym
  → Drive
  → Workout
  → Shower
```

Those belong to the separate Commitment Composition / Attached Activities architecture seam.

The upcoming Commitment Composition audit must remain independently warranted.

---

## 58. Goal vs Activity Decision Rule

Provide a normative decision rule distinguishing outcome from activity.

Example candidate:

> If the thing describes a state of the world or user that can be achieved, maintained, or evaluated independently of a particular scheduled occurrence, it may be a Goal/Subgoal. If it describes work performed at a time, it belongs to Commitment/Scheduled Goal Work/Execution rather than Goal Structure.

Refine as necessary.

Ensure recurring behavior does not automatically become a Goal.

---

## 59. Milestone vs Activity Decision Rule

Provide a similar boundary.

A Milestone is a checkpoint/state.

An activity is something done.

Example:

```text
Complete first practice exam
```

may be ambiguous.

Specify how DayFrame should distinguish:

* “take practice exam” activity;
* “first practice exam completed” milestone.

Do not rely solely on wording.

---

## 60. Determinism

Define deterministic requirements for Goal Structure.

Equivalent authoritative inputs must produce equivalent:

* structural graph;
* traversal;
* cycle validity;
* dependency eligibility;
* Demand normalization;
* structural fingerprints;
* Progress contribution;
* aggregate views.

Runtime insertion order, UI ordering, object enumeration, or random traversal must not affect semantic output.

---

## 61. Structural Fingerprint

Determine whether a structural fingerprint is required.

If adopted, define what materially contributes:

* Goal identities/revisions;
* active relationship identities/revisions;
* relationship types;
* requiredness;
* dependency state/policy;
* Demand-accounting authority;
* Progress-contribution policy;
* priority propagation authority;
* evaluation cutoff/horizon where relevant.

Avoid including irrelevant presentation state.

---

## 62. Staleness

Define what changes stale downstream derived state.

At minimum evaluate:

* Goal lifecycle;
* Goal revision;
* structural relationship revision;
* dependency satisfaction;
* Milestone state;
* Demand-accounting relationship;
* Goal Priority scope;
* Progress contribution;
* target/measurement state;
* structural policy version.

Specify which changes stale:

* Structural Eligibility;
* Demand Normalization;
* Demand Projection;
* Allocation;
* Proposal.

Do not conflate stale with invalid.

---

## 63. Persistence

Define persistence authority at the architectural level.

Determine what must be persisted as authored truth:

* Goals;
* structural relationships;
* Milestones if first-class;
* dependency authority;
* Demand-accounting authority;
* priority propagation authority;
* Progress-contribution authority.

Derived:

* traversal;
* eligibility;
* normalized Demand;
* aggregate Progress;
* structural summaries;

should generally remain reproducible unless frozen as historical provenance.

---

## 64. Backup / Restore

Specify requirements for future backup/restore compatibility.

At minimum require:

* schema/version evolution;
* referential validation;
* relationship identity preservation;
* no dangling structural authority;
* deterministic restoration;
* atomic installation of interdependent Goal/relationship authority;
* migration behavior;
* historical preservation.

Do not implement migration.

---

## 65. Import / Replacement

Specify behavior when Goal authority is replaced or imported.

Determine requirements for:

* structural referential integrity;
* relationship target availability;
* Milestone ownership;
* dependency targets;
* Demand references;
* historical records.

Current-state replacement must not mutate historical truth.

---

## 66. Relationship Validation

Define validation requirements.

At minimum consider:

* missing source/target;
* self-containment;
* containment cycles;
* dependency cycles;
* duplicate semantic edges;
* incompatible relationship types;
* retired Goal targets;
* multiple containment parents if prohibited;
* invalid Demand-accounting relationships;
* incompatible Progress contribution.

Validation must be deterministic and explainable.

---

## 67. Relationship Identity and Canonicalization

Define canonical ordering and semantic equality for structural relationships.

Storage order must not create meaning.

Equivalent relationship sets must canonicalize identically.

Do not use display order as canonical semantic identity unless explicitly authored.

---

## 68. Graph Traversal

If graph-capable semantics are selected, specify traversal responsibilities.

At minimum:

* ancestor discovery;
* descendant discovery;
* contributor discovery;
* dependency closure;
* cycle safety;
* deduplication;
* deterministic ordering;
* scope.

Traversal must not itself aggregate Demand or Progress unless the appropriate policy explicitly requests it.

---

## 69. Multi-Path Deduplication

Establish a general invariant:

> Reaching the same authoritative Goal, Demand, occurrence, execution record, or Progress evidence through multiple structural paths does not create multiple copies of that fact.

Specify identity-based deduplication requirements.

This applies especially to:

* shared Subgoals;
* contributed outcomes;
* Summary;
* Demand normalization;
* historical activity;
* Progress interpretation.

---

## 70. User-Facing Explainability

Define the minimum explanations required when structure changes planning behavior.

Examples:

* “This Goal is not currently eligible because prerequisite X is incomplete.”
* “Two hours of this child Goal's Demand are included in the parent's five-hour total.”
* “This Goal contributes to two broader Goals but its Demand is counted once.”
* “Parent priority did not change this child's priority.”
* “This milestone contributes to parent completion eligibility but not numeric Progress.”

Do not prescribe UI copy.

---

## 71. Structural Suggestions and Learning

Define how historical evidence may inform future decomposition suggestions.

Learning may suggest:

* a repeated activity might deserve a Subgoal;
* a repeated sequence might imply a dependency;
* recurring related outcomes might be grouped;
* a Milestone might be useful.

Such inference remains analytical evidence.

It MUST NOT automatically create:

* Goal;
* Subgoal;
* Milestone;
* relationship;
* dependency;
* Demand;
* Priority;
* reusable structural rule.

---

## 72. Normative Worked Examples

The specification must include at least the following fully resolved examples.

### Example A — Simple Parent / Child

```text
Earn Network+
  → Complete Course
```

Resolve identity, lifecycle, Demand, Progress, completion, and history.

### Example B — Multiple Required Children

```text
Earn Network+
  → Complete Course
  → Complete Practice Exams
  → Pass Exam
```

Resolve requiredness and parent completion semantics.

### Example C — Optional Child

A broader Goal contains an optional supporting outcome.

Show why optional does not become required completion authority.

### Example D — Milestone

```text
Earn Network+
  Milestone: Score 80% on three practice exams
```

Resolve Milestone vs measurement vs Goal.

### Example E — Dependency

```text
Complete Course
  BEFORE
Complete Practice Exams
```

Resolve eligibility without turning it into scheduling order.

### Example F — Independent Parent and Child Demand

```text
Parent: 5h
Child: 2h additional
Total: 7h
```

### Example G — Nested Demand

```text
Parent: 5h total
Child: 2h included
Total: 5h
```

### Example H — Nested Demand + Existing Commitment

```text
Parent: 5h total
Child: 2h included
Existing attributed child Commitment: 1h
```

Resolve remaining Demand without double counting.

### Example I — Shared Subgoal

```text
Build Portfolio
  contributes to Build PDS
  contributes to Improve Web Development Skills
```

Resolve Demand, Progress, history, and Summary deduplication.

### Example J — Priority

```text
Improve Career: High
  → Earn Network+: Medium
```

Resolve parent/child priority semantics.

### Example K — Different Parent Priorities

Shared child contributes to two parents with different priorities.

Resolve without manufactured priority.

### Example L — Child Completed

Resolve effects on parent completion, Progress, Demand, and dependencies.

### Example M — Parent Archived

Resolve child and Demand behavior.

### Example N — Historical Restructure

```text
A → B
```

later becomes:

```text
C → B
```

Preserve decision-time interpretation.

### Example O — Suggested Decomposition

DayFrame suggests three Subgoals.

Show epistemic state before and after acceptance.

### Example P — Found Time

45 minutes becomes newly available.

Show how structural eligibility and normalized Demand feed future Proposal without structure inference.

---

## 73. Required Invariants

Create a normative invariant set, at minimum covering:

1. Goal structure does not create time ownership.
2. Subgoal remains an outcome, not Commitment.
3. Milestone remains checkpoint/state, not activity.
4. Containment does not imply dependency.
5. Containment does not imply priority inheritance.
6. Containment does not imply Demand aggregation.
7. Containment does not imply Progress aggregation.
8. Containment does not imply completion cascade.
9. Parent and child Demand cannot silently double count.
10. Shared Subgoal Demand cannot duplicate by path.
11. Shared Progress evidence cannot duplicate by path.
12. Shared execution cannot duplicate by path.
13. Goal link to Commitment is not Subgoal relation.
14. Measurement observation is not Milestone.
15. Structural suggestions are not authored authority.
16. Structural edits do not rewrite historical decision truth.
17. Structural traversal does not create authority.
18. Dependency eligibility does not schedule work.
19. Goal Priority remains distinct from structure unless explicit scoped authority says otherwise.
20. Goal Demand remains distinct from Goal Structure.
21. Progress remains distinct from effort.
22. Proposal consumes resolved structural semantics rather than inventing them.
23. Found-Time reasoning uses the same resolved structural authority.
24. Goal Structure does not absorb Commitment Composition.
25. Multi-path traversal deduplicates by authoritative identity.
26. Equivalent authoritative structure produces equivalent derived interpretation.
27. Stale structural derivations cannot silently drive current Proposal.
28. Historical structural provenance remains interpretable after restructuring.

Add further invariants where necessary.

---

## 74. Required Architecture Decisions

Create individually numbered normative decisions:

`GS-SPEC-01`, `GS-SPEC-02`, etc.

Each decision must include:

* **Decision**
* **Normative Rule**
* **Reasoning**
* **Consequences**
* **Implementation Constraint**
* **Remaining Downstream Question**

At minimum create decisions for:

1. Goal Structure definition.
2. Goal vs Subgoal type model.
3. relationship identity/lifecycle.
4. containment.
5. contribution.
6. dependency.
7. Milestone.
8. Milestone vs measurement.
9. tree vs graph topology.
10. cycle policy.
11. required/optional child semantics.
12. completion semantics.
13. archival/reactivation.
14. Structural Eligibility.
15. Goal Demand structural boundary.
16. parent/child Demand model.
17. Demand attribution/accounting.
18. Demand normalization.
19. shared-child Demand.
20. existing Commitment satisfaction composition.
21. Goal Priority structural semantics.
22. multi-parent priority conflict.
23. Progress structural boundary.
24. Progress roll-up/contribution.
25. Milestone contribution.
26. historical structural provenance.
27. execution/logging.
28. Summary/Goal Activity deduplication.
29. Allocation boundary.
30. Proposal boundary.
31. Found-Time boundary.
32. Commitment Composition boundary.
33. suggested decomposition/user authority.
34. structural modification/removal.
35. determinism.
36. fingerprint/staleness.
37. persistence/backup/restore.
38. graph traversal/deduplication.

---

## 75. Required Relationship Matrix

Produce:

| Relationship | Source | Target | Authored or Derived? | Own Identity? | May Affect Demand? | May Affect Progress? | May Affect Eligibility? | May Affect Priority? | Historical Provenance Required? |
| ------------ | ------ | ------ | -------------------- | ------------: | -----------------: | -------------------: | ----------------------: | -------------------: | ------------------------------: |

Include every accepted relationship type.

---

## 76. Required Boundary Matrix

Produce:

| Concept | Outcome Identity? | Own Lifecycle? | Own Progress? | May Own Demand? | Owns Time? | Structural Authority? | May Gate Eligibility? | Historical Provenance? |
| ------- | ----------------: | -------------: | ------------: | --------------: | ---------: | --------------------: | --------------------: | ---------------------: |

At minimum include:

* Goal;
* Subgoal;
* Parent Goal;
* Milestone;
* structural relationship;
* Goal Priority;
* Goal Demand;
* Commitment;
* Scheduled Goal Work;
* Execution;
* Progress Observation;
* Proposal;
* Accepted Allocation.

---

## 77. Required Demand Accounting Matrix

Produce:

| Scenario | Raw Demand | Structural Relationship | Attributed Existing Work | Normalized Competing Demand | Why |
| -------- | ---------: | ----------------------- | -----------------------: | --------------------------: | --- |

Include at minimum:

* independent parent + child;
* nested child;
* derived parent;
* mixed parent/child;
* shared Subgoal;
* nested child + existing Commitment;
* inactive dependency;
* archived parent;
* optional child.

---

## 78. Required Priority Matrix

Produce:

| Scenario | Parent Priority | Child Priority | Structural Rule | Effective Allocation Input | Authority Source |
| -------- | --------------- | -------------- | --------------- | -------------------------- | ---------------- |

Include:

* no child priority;
* explicit child priority;
* explicit propagated scope if allowed;
* shared child with conflicting parents;
* derived urgency;
* learned preference.

---

## 79. Required Progress Matrix

Produce:

| Scenario | Child Evidence | Parent Measurement | Relationship Policy | Parent Progress Effect | Historical Provenance |
| -------- | -------------- | ------------------ | ------------------- | ---------------------- | --------------------- |

Include:

* no roll-up;
* required child completion;
* explicit compatible contribution;
* incompatible units;
* shared child;
* Milestone completion;
* execution without Progress observation.

---

## 80. Required Lifecycle Matrix

Produce:

| Event | Relationship State | Child State | Parent State | Demand Effect | Historical Effect |
| ----- | ------------------ | ----------- | ------------ | ------------- | ----------------- |

Include:

* child completed;
* parent completed;
* child archived;
* parent archived;
* relationship retired;
* Goal reactivated;
* dependency satisfied;
* dependency target archived.

---

## 81. Required Authority Matrix

Produce:

| Concept | Authority Source | Epistemic Category | Persist Current? | Can Change Demand? | Can Change Eligibility? | Can Change Schedule Directly? | User Acceptance Required? |
| ------- | ---------------- | ------------------ | ---------------: | -----------------: | ----------------------: | ----------------------------: | ------------------------: |

Include all major Goal Structure concepts.

---

## 82. Required Transition Matrix

Produce:

| Transition | Input | Output | Automatic? | User Authority Required? | Creates Time Ownership? | Historical Freeze? |
| ---------- | ----- | ------ | ---------: | -----------------------: | ----------------------: | -----------------: |

Include:

* Goal → structural relationship;
* suggested relationship → accepted structure;
* structure → Structural Eligibility;
* structure + Demand → normalized Demand;
* child completion → parent interpretation;
* dependency satisfaction → eligibility;
* relationship modification;
* relationship retirement;
* normalized Demand → Demand Projection;
* Allocation → Proposal;
* Proposal → Accepted Allocation;
* Accepted Allocation → Scheduled Goal Work.

---

## 83. Required Primitive Compatibility Matrix

Produce:

| Specification Requirement | Existing Primitive | Reuse Classification | Required Adaptation | Architectural Risk |
| ------------------------- | ------------------ | -------------------- | ------------------- | ------------------ |

Use:

* Directly Reusable
* Reusable with Adaptation
* Conceptually Related but Wrong Abstraction
* Not Reusable
* Not Found

At minimum evaluate:

* Goal identity;
* Goal revision;
* Goal lifecycle;
* Goal Commitment links;
* source incarnation;
* measurement definitions;
* Progress observations;
* Progress query;
* target date;
* Goal Priority specification;
* Goal Demand specification;
* Demand satisfaction attribution;
* historical Goal snapshots;
* execution history;
* Goal Activity;
* Summary;
* PlanDecision;
* persistence/backup/restore.

---

## 84. Required Consistency Checks

Explicitly test the completed specification against at least:

1. Goal with no structure.
2. Goal with one child.
3. Goal with multiple children.
4. Goal with optional child.
5. Child with multiple broader Goals.
6. Goal with dependency.
7. Dependency cycle.
8. Containment cycle.
9. Goal with Milestone but no child.
10. Goal with child but no Demand.
11. Parent Demand only.
12. Child Demand only.
13. Parent + child independent Demand.
14. Parent + child nested Demand.
15. Shared-child Demand.
16. Existing Commitment satisfying child Demand.
17. Parent and child with different priorities.
18. Shared child with conflicting parent priorities.
19. Parent and child with incompatible Progress units.
20. All required children completed.
21. Parent completed while child remains active.
22. Parent archived.
23. Child archived.
24. Historical restructure.
25. Suggested decomposition rejected.
26. Suggested decomposition modified before acceptance.
27. Found Time evaluated against structured Goals.
28. Proposal receives normalized Demand without traversing structure.
29. Summary aggregates descendants without duplicate execution.
30. Goal Structure coexists with future Commitment Composition without semantic overlap.

If any scenario exposes a contradiction, resolve it before declaring the specification complete.

---

## 85. Implementation Constraints

A conforming future implementation must:

1. preserve flat Goals as valid;
2. avoid requiring every Goal to participate in structure;
3. preserve Goal identity across structural edits;
4. use explicit structural relationship authority;
5. preserve relationship identity/history where relevant;
6. prevent containment/dependency cycles according to specified policy;
7. distinguish containment, contribution, and dependency;
8. distinguish Subgoal from Commitment;
9. distinguish Milestone from observation/activity;
10. prevent silent Demand aggregation;
11. prevent structural Demand double counting;
12. prevent shared-child duplication;
13. preserve explicit Goal Priority authority;
14. prevent silent priority inheritance;
15. preserve per-Goal Progress truth;
16. require explicit contribution policy for structural Progress effects;
17. preserve historical relationship provenance;
18. keep execution records unique;
19. deduplicate aggregate Summary/Goal Activity views;
20. resolve structural eligibility before downstream planning;
21. normalize Demand before Allocation receives it;
22. keep Allocation primarily structure-agnostic;
23. keep Proposal from inventing structure;
24. keep Found-Time reasoning subordinate to the same structure/Demand authority;
25. preserve Commitment Composition as a separate domain;
26. make structural derivations deterministic and explainable;
27. stale downstream derivations on material structural changes;
28. preserve backup/restore referential integrity;
29. preserve current-state vs historical-state separation;
30. require explicit acceptance for suggested structural authority.

Do not implement these constraints during this task.

---

## 86. Downstream Open Questions

After resolving all Goal Structure fundamentals, identify only genuinely downstream questions.

Potential examples:

* exact Goal Structure authoring UI;
* visualization style;
* tree/graph navigation;
* drag/drop behavior;
* suggested decomposition generation algorithm;
* initial Milestone UI;
* initial relationship labels;
* advanced Progress aggregation policies;
* display ordering;
* Proposal explanation depth;
* Found-Time presentation;
* implementation storage host;
* migration sequencing.

Do not leave fundamental Demand-accounting, authority, lifecycle, topology, dependency, or provenance questions unresolved merely by labeling them downstream.

---

## 87. Recommended Next-Step Gate

Select exactly one primary recommendation.

### Path A — Commitment Composition / Attached Activities Architecture Audit

Choose if Goal Structure is sufficiently specified and the remaining upstream seam before constructive Proposal is Commitment Composition.

### Path B — Goal Structure Targeted Implementation Audit

Choose if specification is complete but executable implementation sequencing requires additional repository investigation before another architecture domain.

### Path C — Goal Progress / Milestone Follow-Up Audit

Choose only if the specification cannot safely resolve Progress/Milestone boundaries from existing evidence and accepted architecture.

### Path D — Goal Demand Structural Accounting Follow-Up Audit

Choose only if parent/child Demand semantics remain blocked by unresolved executable evidence.

### Path E — Constructive Proposal Architecture Audit

Choose if Goal Structure is complete and Commitment Composition does not need to precede Proposal.

### Path F — Architecture Reconciliation

Choose if Goal Structure cannot be made consistent with accepted Capacity, Goal Demand, Progress, history, or authority architecture.

Explain the choice.

Do not begin the selected task.

Do not assign Phase 8.

Given the currently known architecture, **Path A should be strongly considered**, but the specification must select the path justified by its completed findings rather than treating that preference as predetermined.

---

## 88. Governance and Non-Goals

This task must preserve:

1. **Goals describe desired outcomes.**
2. **Goals do not own time merely by existing.**
3. **Commitments own authorized time.**
4. **Capacity remains derived and demand-neutral.**
5. **Goal Demand requests resources without owning time.**
6. **Allocation remains provisional and non-authoritative.**
7. **Proposal remains constructive.**
8. **Explicit user authority precedes Goal-driven time ownership.**
9. **Progress remains distinct from planning effort.**
10. **Goal Priority remains distinct from Commitment priority.**
11. **History remains immutable.**
12. **Generated structure does not become authored truth silently.**
13. **Structural traversal does not create authority.**
14. **Shared structural paths do not duplicate authoritative facts.**
15. **Goal Structure does not become Commitment Composition.**
16. **DayFrame does not become a general-purpose project-management system.**
17. **Implementation remains subordinate to accepted architecture.**
18. **No future implementation phase is established by this specification.**

This task must not:

* modify production code;
* modify tests;
* add Goal Structure implementation;
* add parent/child fields;
* add Milestone implementation;
* add dependency implementation;
* add Demand normalization implementation;
* add Goal Priority implementation;
* change Goal Demand implementation;
* change Capacity;
* change Allocation;
* implement Proposal;
* implement Found Time;
* implement Commitment Composition;
* change Progress implementation;
* change Summary;
* change execution/history;
* change persistence;
* change backup formats;
* change restore behavior;
* change UI;
* create migrations;
* modify existing architecture documents;
* modify existing audit documents;
* create Phase 8;
* assign work to Phase 8 or another future implementation phase.

This task is read-only with respect to the existing repository.

**The required specification result artifact is the sole permitted repository write.**

---

## 89. Required Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/architecture/GOAL_STRUCTURE_ARCHITECTURE_SPECIFICATION_RESULT.md`

The filename must contain `RESULT` because it is the durable Codex output produced by this specification task.

Do not substitute another filename or path.

The result must include, at minimum:

1. **Executive Specification**
2. **Architectural Context**
3. **Epistemic Model**
4. **Goal Structure Definition**
5. **Goal Structure Responsibility Boundary**
6. **Goal / Structural Identity**
7. **Goal Lifetime**
8. **Structural Relationship Taxonomy**
9. **Parent Goal**
10. **Subgoal**
11. **Goal vs Subgoal Type Model**
12. **Milestone**
13. **Milestone vs Subgoal**
14. **Milestone vs Measurement**
15. **Goal Dependency**
16. **Dependency vs Scheduling Dependency**
17. **Derived Blocking / Structural Eligibility**
18. **Containment vs Contribution**
19. **Tree vs Graph Model**
20. **Cycle Semantics**
21. **Required / Optional Children**
22. **Goal Completion**
23. **Child Completion**
24. **Parent Completion**
25. **Archival / Reactivation**
26. **Goal Demand Structural Boundary**
27. **Parent / Child Demand Model**
28. **Demand Contribution / Attribution**
29. **Existing Commitment Satisfaction Composition**
30. **Demand Normalization**
31. **Demand Normalization Output**
32. **Demand Conservation**
33. **Shared Subgoal Demand**
34. **Goal Priority Structural Boundary**
35. **Priority Model**
36. **Priority Conflict**
37. **Progress Structural Boundary**
38. **Progress Roll-Up / Contribution**
39. **Measurement Compatibility**
40. **Milestone Contribution**
41. **Structural Progress Provenance**
42. **Ordering Semantics**
43. **Suggested Decomposition**
44. **Direct User Authoring**
45. **Structural Modification / Removal**
46. **Historical Goal Structure**
47. **Historical Restructuring**
48. **Execution / Logging**
49. **Summary**
50. **Goal Activity**
51. **Allocation Boundary**
52. **Proposal Boundary**
53. **Found Time / Live Opportunity Boundary**
54. **Commitment Composition Boundary**
55. **Goal vs Activity Decision Rule**
56. **Milestone vs Activity Decision Rule**
57. **Determinism**
58. **Structural Fingerprint**
59. **Staleness**
60. **Persistence**
61. **Backup / Restore**
62. **Import / Replacement**
63. **Relationship Validation**
64. **Relationship Identity / Canonicalization**
65. **Graph Traversal**
66. **Multi-Path Deduplication**
67. **Explainability**
68. **Structural Suggestions / Learning**
69. **Normative Worked Examples**
70. **Goal Structure Invariants**
71. **Architecture Decisions**
72. **Relationship Matrix**
73. **Boundary Matrix**
74. **Demand Accounting Matrix**
75. **Priority Matrix**
76. **Progress Matrix**
77. **Lifecycle Matrix**
78. **Authority Matrix**
79. **Transition Matrix**
80. **Primitive Compatibility Matrix**
81. **Specification Consistency Checks**
82. **Implementation Constraints**
83. **Downstream Open Questions**
84. **Specification Conclusions**
85. **Recommended Next Step**
86. **Completion Statement**

After writing:

1. verify the artifact exists at the exact required path;
2. reopen and read it;
3. verify every required major section is complete;
4. verify all sixteen normative worked examples are resolved;
5. verify the invariant set covers every required invariant area;
6. verify all required architecture decisions are present and individually numbered;
7. verify all required matrices are complete;
8. verify all thirty consistency checks are explicitly addressed;
9. verify exactly one next-step path is selected;
10. inspect repository status;
11. verify no repository file other than the required result artifact was modified.

Do not merely print the specification in Codex's response.

The durable result artifact is required.

---

## 90. Validation

This is an architecture-specification task.

Do not modify or add tests.

Existing audit evidence may be reused where sufficient, including the Goal Structure audit's focused validation:

* **15 test files passed**
* **87 tests passed**
* **0 failed**

Additional existing tests may be run only if needed to resolve a specific factual implementation question encountered during specification.

If additional tests are run, report:

* exact test files;
* test count;
* passed;
* failed;
* reason they were necessary.

The specification must not make new claims about executable behavior without evidence.

---

## 91. Completion Criteria

The specification is complete only when:

* [ ] Goal Structure has a normative definition.
* [ ] Goal Structure's responsibility boundary is explicit.
* [ ] Goal identity and structural relationship identity are separated.
* [ ] Goal lifetime requirements are resolved.
* [ ] Minimum relationship taxonomy is selected.
* [ ] Parent Goal semantics are defined.
* [ ] Subgoal semantics are defined.
* [ ] Goal vs Subgoal type model is selected.
* [ ] Milestone semantics are defined.
* [ ] Milestone vs Subgoal is resolved.
* [ ] Milestone vs Measurement is resolved.
* [ ] Goal Dependency semantics are defined.
* [ ] Dependency vs scheduling dependency is explicit.
* [ ] Structural Eligibility / derived blocking semantics are resolved.
* [ ] Containment vs contribution is resolved.
* [ ] Tree vs graph topology is selected.
* [ ] Cycle semantics are defined.
* [ ] Required/optional child semantics are defined.
* [ ] Parent completion semantics are defined.
* [ ] Child completion semantics are defined.
* [ ] Parent completion effects are defined.
* [ ] Archival/reactivation semantics are defined.
* [ ] Goal Demand structural boundary is defined.
* [ ] Parent/child Demand model is selected.
* [ ] Structural Demand attribution/accounting is defined.
* [ ] Existing Commitment satisfaction composition is resolved.
* [ ] Demand Normalization boundary is selected.
* [ ] Demand Normalization output is defined.
* [ ] Demand conservation rules are explicit.
* [ ] Shared Subgoal Demand is resolved.
* [ ] Goal Priority structural semantics are defined.
* [ ] Priority inheritance/propagation model is selected.
* [ ] Multi-parent priority conflict is resolved.
* [ ] Progress structural boundary is defined.
* [ ] Progress roll-up/contribution model is selected.
* [ ] Measurement compatibility is resolved.
* [ ] Milestone contribution is resolved.
* [ ] Structural Progress provenance is defined.
* [ ] Ordering semantics are separated.
* [ ] Suggested decomposition authority is defined.
* [ ] Direct structural authoring is defined.
* [ ] Structural modification/removal semantics are defined.
* [ ] Historical Goal Structure requirements are defined.
* [ ] Historical restructuring is resolved.
* [ ] Execution/logging structural provenance is defined.
* [ ] Summary deduplication semantics are defined.
* [ ] Goal Activity scope is defined.
* [ ] Allocation boundary is defined.
* [ ] Proposal boundary is defined.
* [ ] Found-Time boundary is defined.
* [ ] Commitment Composition boundary is preserved.
* [ ] Goal vs Activity decision rule is defined.
* [ ] Milestone vs Activity decision rule is defined.
* [ ] Determinism requirements are defined.
* [ ] Structural fingerprint is accepted or explicitly rejected.
* [ ] Staleness rules are defined.
* [ ] Persistence authority is defined.
* [ ] Backup/restore requirements are defined.
* [ ] Import/replacement requirements are defined.
* [ ] Relationship validation is defined.
* [ ] Relationship identity/canonicalization is defined.
* [ ] Graph traversal responsibilities are defined.
* [ ] Multi-path deduplication is defined.
* [ ] Explainability requirements are defined.
* [ ] Structural suggestion/learning boundary is defined.
* [ ] All sixteen normative worked examples are resolved.
* [ ] Normative Goal Structure invariants are complete.
* [ ] `GS-SPEC-*` decisions cover every required decision area.
* [ ] Relationship Matrix is complete.
* [ ] Boundary Matrix is complete.
* [ ] Demand Accounting Matrix is complete.
* [ ] Priority Matrix is complete.
* [ ] Progress Matrix is complete.
* [ ] Lifecycle Matrix is complete.
* [ ] Authority Matrix is complete.
* [ ] Transition Matrix is complete.
* [ ] Primitive Compatibility Matrix is complete.
* [ ] All thirty consistency checks are explicitly resolved.
* [ ] Implementation constraints are explicit.
* [ ] Only genuinely downstream questions remain open.
* [ ] Exactly one recommended next-step path is selected.
* [ ] No implementation was performed.
* [ ] No tests were modified.
* [ ] No existing architecture document was modified.
* [ ] No existing audit document was modified.
* [ ] No future implementation phase was established.
* [ ] `GOAL_STRUCTURE_ARCHITECTURE_SPECIFICATION_RESULT.md` was written at the exact required path.
* [ ] The result artifact was reopened and verified.
* [ ] Repository status was inspected.
* [ ] The required specification result artifact was the sole repository write.
* [ ] Codex reports the exact saved artifact path.
* [ ] Codex reports validation performed.
* [ ] Codex reports whether any other repository files changed.

---

## 92. Final Completion Statement

End `GOAL_STRUCTURE_ARCHITECTURE_SPECIFICATION_RESULT.md` with exactly:

> **Goal Structure Architecture Specification complete.**
>
> The specification establishes Goal Structure as an explicit, versioned authority over relationships among desired outcomes; defines Goal, Parent Goal, Subgoal, Milestone, containment, contribution, dependency, structural eligibility, lifecycle, topology, cycle rules, Demand accounting and normalization, Goal Priority scope, Progress contribution, historical provenance, execution and Summary deduplication, deterministic traversal, staleness, persistence, and user-authority boundaries; preserves the separation among outcomes, activities, Commitments, Goal Demand, Capacity, Allocation, Proposal, Accepted Allocation, Scheduled Goal Work, Execution, and Progress; prevents structural relationships from silently creating time ownership, Demand, priority, Progress, completion, or reusable authority; and identifies the appropriate next architectural step without modifying implementation or assigning the work to a future implementation phase.

The final Codex response must state:

> **Saved artifact:** `/home/sid/Penn Digital Services/DayFrame/docs/architecture/GOAL_STRUCTURE_ARCHITECTURE_SPECIFICATION_RESULT.md`
>
> **Repository modifications:** The required specification result artifact was the sole repository write.
>
> **Validation:** Report reused audit evidence and any additional existing tests executed.
>
> **Recommended next step:** Report the selected Path A, B, C, D, E, or F without beginning that work.
