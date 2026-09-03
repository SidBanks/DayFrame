# Goal Structure / Decomposition Architecture Audit

## Status

Ready for audit.

## Phase

Post-Phase 7 Architectural Follow-Up

## Task Type

Read-only architecture and implementation-alignment audit investigating whether DayFrame's current Goal domain supports, approximates, or conflicts with structured/decomposed Goals, and determining what architectural boundaries must be resolved before Goal Demand, Allocation, and constructive Proposal safely operate over non-flat Goal structures.

This task must investigate executable implementation, existing tests, accepted architecture, and current Goal/Progress/history behavior.

This task must **not** design or implement the final Goal Structure model.

This task is read-only with respect to the existing repository.

**The required audit result artifact is the sole permitted repository write.**

---

## 1. Objective

Determine how DayFrame currently represents—or fails to represent—the decomposition of a desired outcome into subordinate outcomes, milestones, dependencies, and work performed in service of that outcome.

The audit must answer the central question:

> **Can DayFrame's existing Goal domain safely support structured Goals as required by the accepted Capacity and Goal Demand / Allocation architecture, or is a first-class Goal Structure / Decomposition architecture required before constructive Proposal can be specified?**

The audit must establish current executable truth before recommending architecture.

Do not infer support merely from generic Goal links, titles, descriptions, Commitment associations, or Progress mechanisms.

---

## 2. Architectural Context

DayFrame's accepted planning model now includes:

**Commitments + Constraints
→ Capacity
→ Goal Demand
→ Goal-Specific Feasibility
→ Competing Demand
→ Allocation
→ Proposal
→ User Decision
→ Accepted Allocation
→ Scheduled Goal Work
→ Execution
→ Progress
→ Summary**

The accepted Goal Demand and Allocation architecture establishes:

* Goal describes an outcome the user wants.
* Goal does not own time merely by existing.
* Goal Demand is a distinct planning-resource request made in service of one Goal.
* A Goal may have zero or multiple independent Demand lifetimes.
* Goal Priority is distinct from Commitment priority.
* Goal Demand and Progress are distinct.
* Existing Goal-linked Commitment work must not automatically satisfy Demand.
* Scheduled effort, executed effort, Demand satisfaction, and Progress remain distinct.
* Proposal is downstream of Goal Demand and Allocation.
* User authority is required before Goal-driven discretionary work becomes time-owning.

The new unresolved question is whether **Goal itself is necessarily flat**.

Examples:

```text
Goal: Earn Network+
  → Learn networking fundamentals
  → Complete course
  → Complete practice exams
  → Pass certification exam
```

Potentially distinct semantics include:

```text
Goal
  → Child Goal

Goal
  → Milestone

Goal
  → Dependency / Prerequisite

Goal
  → Commitment or Activity in service of Goal

Goal
  → Goal Demand
```

These relationships MUST NOT be assumed equivalent merely because they can be displayed hierarchically.

---

## 3. Audit Questions

The audit must answer at minimum:

1. Can one Goal currently reference another Goal?
2. Can a Goal currently have a parent?
3. Can a Goal currently have children?
4. Is any Goal hierarchy represented implicitly?
5. Are Goal links restricted to Commitment-like sources?
6. Can a Goal represent a milestone?
7. Does DayFrame have any independent milestone concept?
8. Does DayFrame represent prerequisite/dependency relationships among Goals?
9. Can Goal lifecycle affect another Goal?
10. Can Progress for one Goal affect another Goal?
11. Can Progress roll upward?
12. Can Progress roll downward?
13. Can Goal completion be derived from subordinate outcomes?
14. Can Goal archival/completion cascade?
15. Does Goal Priority currently support inheritance?
16. Can a child-like Goal have independent priority?
17. Does any current mechanism approximate Goal decomposition through Commitment links?
18. Does any current mechanism approximate decomposition through measurement definitions?
19. Does Summary imply a hierarchy not represented in the domain?
20. Does historical Goal provenance preserve relationships between Goals?
21. Could multiple current Goals represent decomposition manually without DayFrame knowing that relationship?
22. If so, what behavior is lost?
23. Could current Goal Demand architecture safely operate over such manually related Goals?
24. Could parent and child Goals independently produce Demand without double claiming Capacity?
25. Is any current mechanism capable of attributing child Demand to parent Demand?
26. Can existing Goal-linked Commitment attribution solve that problem?
27. Is Goal decomposition required for Proposal correctness, or only for UX?
28. What is the minimum semantic distinction required among Goal, Subgoal, Milestone, Dependency, Commitment/Activity, Demand, and Progress?
29. Does current implementation contain reusable primitives for those distinctions?
30. What architectural work must occur before constructive Proposal can safely reason over structured Goals?

---

## 4. Evidence Rules

Every implementation claim must be classified as:

### Confirmed

Directly established by production code and/or deterministic test coverage.

### Inferred

Strongly suggested by implementation structure but not directly proven.

### Not Found

No supporting implementation was located after reasonable repository search.

Do not infer behavior from:

* filenames;
* type names alone;
* comments alone;
* UI labels alone;
* unused/dead code;
* test fixture shape without production path;
* conceptual similarity.

For deterministic behavior claims, prefer executable tests where available.

Cite exact:

* file paths;
* symbols;
* relevant line ranges where practical;
* tests establishing behavior.

---

## 5. Required Repository Investigation

Trace the current Goal domain end-to-end.

At minimum investigate:

### Goal Model

Locate and inspect:

* Goal types/interfaces;
* Goal identity;
* Goal revision/lifetime semantics;
* Goal lifecycle;
* target date;
* description;
* measurement configuration;
* Goal links;
* Goal Priority if any;
* Goal metadata;
* serialization/persistence.

Determine whether any field can represent:

* parent Goal;
* child Goal;
* milestone;
* prerequisite;
* dependency;
* contribution relationship;
* decomposition ordering.

Do not assume generic identifiers are structural relationships without tracing their use.

---

## 6. Goal Creation and Mutation

Trace all Goal creation/update paths.

Determine:

* how Goals are created;
* how Goals are edited;
* how Goals are completed;
* how Goals are archived;
* how Goals are deleted/retired;
* whether Goal revisions are preserved;
* whether any mutation touches another Goal;
* whether lifecycle operations cascade;
* whether Goal relationships could survive replacement/import/profile operations.

Explicitly determine whether one Goal mutation can currently affect another Goal.

---

## 7. Goal Linking

Trace all Goal-link mechanisms.

Determine:

* what object types may link to Goal;
* direction of links;
* identity/incarnation safety;
* whether links are one-to-one or many-to-many;
* whether links express contribution, provenance, scheduling, Progress, or merely association;
* whether Goal-to-Goal links exist;
* whether links have semantic type;
* whether links have weighting;
* whether links have lifecycle;
* whether links can represent prerequisite relationships.

Produce:

| Link Mechanism | Source | Target | Semantic Meaning | Time Ownership? | Progress Meaning? | Structural Goal Relationship? |
| -------------- | ------ | ------ | ---------------- | --------------: | ----------------: | ----------------------------: |

---

## 8. Progress Model

Trace Goal Progress completely.

Determine:

* how Progress is calculated;
* measurement definitions;
* observations;
* evaluation cutoff;
* manual reporting;
* derived values;
* completion semantics;
* target semantics;
* historical provenance.

Then determine whether Progress supports:

* child-to-parent aggregation;
* weighted roll-up;
* milestone completion;
* prerequisite completion;
* contribution from multiple Goals;
* contribution from Commitments;
* contribution from execution.

Do not interpret generic measurements as decomposition unless the implementation explicitly establishes that semantic relationship.

---

## 9. Goal Completion

Determine what “completed Goal” currently means.

Trace:

* explicit completion;
* measurement-driven completion;
* lifecycle state;
* UI behavior;
* historical behavior;
* linked Commitment behavior;
* Summary behavior.

Answer:

> **Can DayFrame currently distinguish “this Goal is complete because I marked it complete” from “this Goal is complete because all required subordinate outcomes were achieved”?**

If subordinate completion is not represented, mark it **Not Found**.

---

## 10. Goal Hierarchy Search

Search specifically for possible hierarchy primitives.

Investigate terms and concepts including:

* parent;
* child;
* hierarchy;
* tree;
* subgoal;
* sub-goal;
* milestone;
* objective;
* dependency;
* prerequisite;
* prerequisiteGoal;
* dependsOn;
* blockedBy;
* contributesTo;
* partOf;
* parentId;
* goalId;
* goalIds;
* links;
* relatedGoals.

Do not stop at exact terminology. Trace semantically plausible relationships discovered through Goal code.

Report false positives explicitly when useful.

---

## 11. Milestone Semantics

Determine whether DayFrame currently has any concept that behaves as a milestone.

For this audit, use the working distinction:

> **A Milestone represents a meaningful state or checkpoint in progress toward an outcome but does not necessarily behave as an independently prioritized Goal competing for Capacity.**

Investigate whether existing:

* measurements;
* target values;
* Progress observations;
* Goal completion;
* linked Commitments;
* historical events;

could currently serve this semantic role.

Classify each as:

* Direct Milestone Support;
* Partial Analogue;
* Wrong Abstraction;
* Not Found.

Do not define the final Milestone architecture.

---

## 12. Subgoal Semantics

Use the working distinction:

> **A Subgoal is a subordinate desired outcome that may have its own lifecycle, Progress, Demand, and possibly Priority while contributing to a broader parent Goal.**

Determine whether current Goal primitives could represent this relationship without semantic ambiguity.

Investigate whether a parent/child relationship would need to carry additional semantics such as:

* required vs optional;
* contribution;
* ordering;
* completion dependency;
* Demand accounting;
* Progress aggregation.

Do not decide the final representation yet.

---

## 13. Dependency and Prerequisite Semantics

Determine whether current Goal or planning primitives support relationships such as:

```text
Complete Network+ coursework
  BEFORE
Take Network+ practice exams
```

or:

```text
Pass Network+
  BEFORE
Begin Security+
```

Distinguish:

### Structural Parent/Child

“This outcome is part of that outcome.”

from:

### Dependency

“This outcome must precede or enable another.”

from:

### Scheduling Dependency

“This activity must occur before another activity.”

Do not conflate Goal dependency with Commitment placement constraints.

---

## 14. Goal vs Activity Boundary

Investigate whether the current Goal model or UX encourages users to represent actions as Goals.

Examples:

```text
Goal: Earn Network+
```

versus:

```text
Study Network+ for 45 minutes
```

The latter may be:

* Commitment;
* scheduled Goal work;
* activity;
* execution;
* Goal Demand realization;

rather than Goal.

Determine whether current implementation provides enough semantic distinction to prevent Goal decomposition from becoming a task list.

Document where current UX or data structures blur this boundary.

---

## 15. Goal vs Commitment Boundary

Trace current Goal-to-Commitment relationships.

Determine whether users can currently simulate decomposition like:

```text
Goal: Earn Network+
  → Commitment: Study
  → Commitment: Practice Exam
```

If so, determine exactly what this achieves and what it does not.

Specifically test whether this provides:

* subordinate outcome identity;
* independent Progress;
* completion semantics;
* priority inheritance;
* dependency;
* Demand accounting;
* historical structure.

Do not treat “linked to Goal” as equivalent to “child of Goal.”

---

## 16. Goal vs Goal Demand Boundary

Use the accepted Goal Demand architecture as normative context.

Determine how structured Goals would affect:

```text
Parent Goal
  → Child Goal A
  → Child Goal B
```

where each may potentially have Demand.

Investigate whether current implementation provides any mechanism to distinguish:

### Independent Demand

Parent requests 5 hours and child requests 2 additional hours.

from:

### Nested Demand

Parent requests 5 total hours, of which child requests 2.

from:

### Derived Parent Demand

Parent has no independent Demand; its resource picture is aggregated from children.

from:

### Mixed Demand

Parent has some independent Demand plus child Demand.

Do not select a model yet.

Determine whether the existing architecture or implementation already constrains the choice.

---

## 17. Double-Demand Risk

This is a required audit area.

Consider:

```text
Goal: Earn Network+
  Demand: 5 hours this week

Child Goal: Complete Practice Exams
  Demand: 2 hours this week
```

Determine whether current or newly specified Goal Demand mechanisms can prevent DayFrame from treating this as seven hours when the user's intent was five total hours.

Investigate:

* Demand identity;
* Demand attribution;
* existing Commitment satisfaction attribution;
* Goal links;
* Progress;
* Capacity allocation.

Explicitly answer:

> **Does the existing Goal Demand and Allocation specification solve parent/child Demand accounting?**

If not, identify the exact missing semantic boundary.

Do not silently extend the specification during this audit.

---

## 18. Goal Priority and Structure

Investigate the implications of the accepted separate Goal Priority authority.

Potential structured case:

```text
Goal: Improve Career              Priority: High
  → Earn Network+                ?
  → Earn Security+               ?
  → Build Linux Skills           ?
```

Determine whether current implementation has any mechanism for:

* inherited priority;
* overridden priority;
* independent child priority;
* parent priority;
* sibling ranking.

Determine whether the Goal Demand/Allocation specification constrains inheritance.

Do not select a final inheritance model.

Explicitly identify risks of silently inheriting priority.

---

## 19. Lifecycle Propagation

Investigate structured lifecycle questions.

Examples:

* Parent completed while child remains active.
* All children completed while parent remains active.
* Parent archived.
* Child archived.
* Parent deleted/retired.
* Child Demand remains active.
* Parent target date changes.
* Child target date differs.

Determine what current implementation would do.

Where no relationship exists, state **Not Found** rather than inventing propagation.

Identify which lifecycle questions require future architecture.

---

## 20. Progress Roll-Up

Investigate whether Progress can or should conceptually roll through structured Goals.

Do not design the final algorithm.

Evaluate current primitives against possibilities such as:

### No Roll-Up

Each Goal owns independent Progress.

### Completion Roll-Up

Parent completion depends on required child completion.

### Weighted Progress Roll-Up

Children contribute weighted percentages.

### Measurement Roll-Up

Child measurements contribute to parent measurement.

### Mixed Model

Explicit contribution relationships determine aggregation.

Determine whether current implementation provides any evidence supporting one model.

Identify risks of automatically averaging child Progress.

---

## 21. Historical Goal Structure

Trace historical Goal provenance.

Determine whether historical records preserve:

* Goal identity;
* Goal revision;
* Goal title;
* Goal lifecycle;
* Goal links;
* Goal measurement context.

Then ask whether a future parent/child or dependency relationship would need decision-time preservation.

Example:

A historical Study occurrence contributed to:

```text
Practice Exams
  → Earn Network+
```

Later the user restructures Goals.

Should historical interpretation still preserve the old relationship?

Do not answer normatively unless accepted architecture already resolves it. Identify the provenance requirement and current capability.

---

## 22. Summary and Goal Activity

Trace current Summary / Goal Activity presentation.

Determine whether it:

* assumes flat Goals;
* groups activity by Goal;
* could accidentally double-count hierarchical activity;
* could show parent and child simultaneously;
* derives Progress independently;
* uses historical Goal provenance.

Identify any future risks if structured Goals are introduced.

Do not redesign Summary.

---

## 23. Execution and Logging

Trace how execution/history associates with Goals.

Determine whether executed work currently attaches:

* directly to Goal;
* through Commitment;
* through historical scheduled occurrence;
* through Progress observation;
* through some combination.

Consider future structured example:

```text
Earn Network+
  → Complete Practice Exams
      → Practice Exam Session
```

Determine whether existing provenance could preserve:

* activity performed;
* immediate Goal served;
* ancestor Goal context;
* Progress consequence.

Do not implement ancestor logging.

This audit should establish whether Goal Structure will require additional historical provenance.

---

## 24. Found Time Interaction

Found Time / Live Opportunity is not the primary subject of this audit, but structured Goals may affect future Found-Time Proposal behavior.

Consider:

```text
45 minutes of Found Time
```

and:

```text
Goal: Earn Network+
  → Child Goal: Complete Practice Exams
```

Determine whether a future Proposal engine would need to know:

* parent Goal;
* active child Goal;
* child Demand;
* parent Demand;
* priority scope;
* dependency state;
* milestone state;

to make a semantically correct recommendation.

Do not design Found Time.

Record any Goal Structure requirements that must exist before Found-Time proposals can safely reason over decomposed Goals.

---

## 25. Proposal Dependency

Determine whether constructive Proposal can safely be specified while Goal structure remains unresolved.

Explicitly evaluate:

### Case A — Flat Goals Are Architecturally Sufficient

Goal decomposition may be deferred without corrupting Proposal semantics.

### Case B — Goal Structure Is Needed but Proposal Can Remain Structure-Agnostic

Proposal consumes normalized Demand and does not need structural knowledge.

### Case C — Goal Structure Affects Demand / Allocation Inputs

Goal Structure must be specified before Proposal because it changes which Demand exists or competes.

### Case D — Goal Structure Directly Affects Proposal Reasoning

Proposal itself must understand decomposition, dependencies, milestones, or ancestor context.

Choose the best evidence-supported classification or combination.

---

## 26. Minimum Semantic Vocabulary

Determine whether the architecture needs distinct concepts for:

| Concept             | Working Meaning                                                  |
| ------------------- | ---------------------------------------------------------------- |
| Goal                | Desired outcome                                                  |
| Parent Goal         | Broader desired outcome containing subordinate outcome structure |
| Subgoal             | Independently meaningful subordinate outcome                     |
| Milestone           | Meaningful checkpoint/state toward an outcome                    |
| Dependency          | Outcome relationship constraining eligibility/order              |
| Commitment          | Time-owning authored obligation                                  |
| Activity            | Work performed in service of something                           |
| Goal Demand         | Planning-resource request                                        |
| Scheduled Goal Work | Time-owning realization after accepted authority                 |
| Progress            | Outcome measurement                                              |
| Execution           | Historical evidence of activity                                  |

For each classify:

* Already First-Class;
* Partially Represented;
* Wrong Existing Abstraction;
* Missing;
* Possibly Unnecessary.

Do not create final schemas.

---

## 27. Structural Relationship Taxonomy

Investigate which relationship semantics appear necessary.

Candidate relationships include:

### Parent / Child

Outcome containment.

### Contributes To

Outcome contributes to another without strict containment.

### Depends On

Outcome eligibility/completion depends on another.

### Blocks

Unmet outcome prevents another from becoming actionable.

### Milestone Of

Checkpoint belongs to an outcome.

### Served By

Commitment/activity contributes effort toward Goal.

### Demand For

Demand requests resources in service of Goal.

Determine which of these are already represented, approximated, absent, or potentially redundant.

Do not automatically accept every candidate into future architecture.

---

## 28. Tree vs Graph Risk

Investigate whether Goal Structure can safely be assumed to be a tree.

Examples:

```text
Improve Career
  → Earn Network+

Improve Technical Breadth
  → Earn Network+
```

or:

```text
Build PDS
  → Build Portfolio

Improve Web Development Skills
  → Build Portfolio
```

A subordinate outcome may plausibly contribute to multiple broader Goals.

Determine whether current Goal links or provenance primitives suggest graph-capable relationships.

Do not select the final model solely for implementation simplicity.

Identify:

* single-parent assumptions;
* multi-parent requirements;
* cycle risks;
* dependency cycles;
* identity implications.

---

## 29. Ordering Semantics

Determine whether decomposition implies ordering.

Example:

```text
Learn Fundamentals
→ Practice
→ Take Exam
```

A hierarchy does not necessarily mean sequence.

Distinguish:

* containment;
* display order;
* priority order;
* prerequisite order;
* scheduling order.

Determine whether any existing primitive conflates these.

---

## 30. User Authority

Structured Goal creation must preserve DayFrame's authority model.

Investigate whether any current mechanism automatically derives Goal-like objects.

Determine what current evidence exists for:

* user-authored Goals;
* engine-generated suggestions;
* generated scheduled work;
* accepted choices.

Future architectural concern:

> DayFrame may suggest decomposition, but suggested Subgoals or Milestones MUST NOT silently become authored Goal structure.

Determine whether existing acceptance infrastructure offers reusable patterns without assuming it is sufficient.

---

## 31. Determinism

Identify future deterministic requirements exposed by Goal Structure.

Potential examples:

* stable relationship identity;
* cycle detection;
* deterministic ancestor traversal;
* deterministic dependency evaluation;
* deterministic Progress aggregation;
* deterministic Demand accounting;
* deterministic priority resolution.

Do not specify algorithms.

Determine which requirements follow necessarily from accepted architecture.

---

## 32. Persistence and Backup Compatibility

Trace Goal persistence through:

* active store;
* local persistence;
* backups;
* profiles if Goals participate;
* import/export;
* validation;
* rehydration.

Determine what adding future structural relationships would affect.

Do not modify schemas.

Identify whether current persistence architecture is capable of preserving:

* stable relationship IDs;
* source lifetimes;
* revisions;
* historical relationships.

---

## 33. Source-Lifetime Safety

Determine whether existing Goal identity/revision/incarnation semantics are sufficient for structural relationships.

Example:

```text
Parent Goal A
  → Child Goal B
```

If B is retired and a later Goal receives a similar title or identifier, historical relationship must not silently retarget.

Investigate current Goal identity guarantees.

Compare with existing Commitment/Goal link incarnation safety where relevant.

---

## 34. Current-System Flow

Produce an evidence-grounded current Goal flow.

At minimum trace:

```text
Goal Authoring
→ Goal Persistence
→ Goal Links
→ Scheduled/Commitment Association
→ Historical Publication
→ Execution
→ Progress
→ Summary
```

Show where Goal-to-Goal structure would need to enter if it existed.

Do not draw the intended architecture as though implemented.

---

## 35. Intended Structured-Goal Flow

After documenting current executable truth, construct a **conceptual boundary flow only**, not a final design.

For example:

```text
Goal Structure
→ Active Goal / Subgoal Context
→ Demand Authority
→ Demand Projection
→ Capacity / Feasibility / Allocation
→ Proposal
→ Accepted Goal Work
→ Execution
→ Progress
→ Historical Goal Structure
```

Mark every non-implemented concept clearly.

Use this only to expose architectural seams.

---

## 36. Required Classification

Classify current DayFrame Goal Structure support using one primary result:

### GS1 — First-Class Structured Goals

Parent/child, milestone, dependency, lifecycle, Progress, and planning semantics are explicitly represented.

### GS2 — Partial Structured Goal Domain

Some first-class structural relationships exist, but major semantics are missing.

### GS3 — Relationship Primitives Without Structured Semantics

Generic links/identities exist that may be reusable, but Goal Structure itself is not represented.

### GS4 — Flat Goal Domain with Indirect Analogues

Goals are flat; Commitments/measurements/links provide limited decomposition-like behavior.

### GS5 — No Meaningful Goal Structure Support

No useful current structural support beyond independent Goals.

Also classify independently:

* **Milestones**
* **Goal Dependencies**
* **Progress Roll-Up**
* **Demand Roll-Up / Demand Attribution**
* **Priority Inheritance**
* **Historical Structure Provenance**

Use the same 1–5 scale where sensible, or define an explicit equivalent scale.

---

## 37. Required Current-vs-Needed Matrix

Produce:

| Concern                   | Current Behavior | Evidence | Classification | Needed Before Proposal? | Risk if Deferred |
| ------------------------- | ---------------- | -------- | -------------- | ----------------------- | ---------------- |
| Parent/Child Goals        |                  |          |                |                         |                  |
| Milestones                |                  |          |                |                         |                  |
| Dependencies              |                  |          |                |                         |                  |
| Progress Roll-Up          |                  |          |                |                         |                  |
| Demand Accounting         |                  |          |                |                         |                  |
| Goal Priority             |                  |          |                |                         |                  |
| Lifecycle Propagation     |                  |          |                |                         |                  |
| Historical Provenance     |                  |          |                |                         |                  |
| Summary                   |                  |          |                |                         |                  |
| Execution/Logging         |                  |          |                |                         |                  |
| Found-Time Goal Selection |                  |          |                |                         |                  |

---

## 38. Required Primitive-Reuse Matrix

Produce:

| Future Concern | Existing Primitive | Evidence | Reuse Classification | Required Adaptation | Risk |
| -------------- | ------------------ | -------- | -------------------- | ------------------- | ---- |

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
* Goal links;
* Commitment links;
* source incarnation;
* measurements;
* Progress;
* target date;
* Goal Priority architecture;
* Goal Demand architecture;
* PlanDecision;
* historical Goal provenance;
* execution history;
* Summary.

---

## 39. Required Double-Counting Matrix

Produce:

| Scenario                        | Could Current System Double Count? | Why | Existing Protection | Missing Protection |
| ------------------------------- | ---------------------------------: | --- | ------------------- | ------------------ |
| Parent + Child Demand           |                                    |     |                     |                    |
| Child + Linked Commitment       |                                    |     |                     |                    |
| Parent + Child Progress         |                                    |     |                     |                    |
| Parent + Child Scheduled Effort |                                    |     |                     |                    |
| Parent + Child Execution        |                                    |     |                     |                    |
| Multi-Parent Child Goal         |                                    |     |                     |                    |

This matrix must distinguish:

* Demand double counting;
* Capacity double claiming;
* Progress double counting;
* Summary double counting;
* historical attribution duplication.

---

## 40. Required Boundary Matrix

Produce:

| Concept              | Outcome Identity? | Own Lifecycle? | Own Progress? | May Own Demand? | Owns Time? | May Depend on Goal? | May Contribute to Goal? |
| -------------------- | ----------------: | -------------: | ------------: | --------------: | ---------: | ------------------: | ----------------------: |
| Goal                 |                   |                |               |                 |            |                     |                         |
| Subgoal              |                   |                |               |                 |            |                     |                         |
| Milestone            |                   |                |               |                 |            |                     |                         |
| Commitment           |                   |                |               |                 |            |                     |                         |
| Activity             |                   |                |               |                 |            |                     |                         |
| Goal Demand          |                   |                |               |                 |            |                     |                         |
| Scheduled Goal Work  |                   |                |               |                 |            |                     |                         |
| Progress Observation |                   |                |               |                 |            |                     |                         |

Where future semantics are unresolved, mark them **Requires Specification** rather than guessing.

---

## 41. Required Worked Scenarios

Evaluate at least these scenarios against current behavior and architectural requirements.

### Scenario A — Simple Parent / Child

```text
Earn Network+
  → Complete Course
```

Can current DayFrame represent the relationship?

### Scenario B — Multiple Children

```text
Earn Network+
  → Complete Course
  → Complete Practice Exams
  → Pass Exam
```

What does completion mean?

### Scenario C — Milestone

```text
Earn Network+
  Milestone: Score 80% on three practice exams
```

Is this Goal, measurement, milestone, or something else currently?

### Scenario D — Dependency

```text
Complete Course
  BEFORE
Complete Practice Exams
```

Can current architecture represent the dependency?

### Scenario E — Parent and Child Demand

```text
Earn Network+: 5 hours this week
Practice Exams: 2 hours this week
```

Can DayFrame know whether total Demand is five or seven hours?

### Scenario F — Child with Existing Commitment

```text
Practice Exams Demand: 2 hours
Practice Exam Commitment: 1 hour
```

Can the existing Demand-satisfaction model account correctly?

### Scenario G — Priority

```text
Improve Career: High
  → Earn Network+: ?
  → Linux Skills: ?
```

What does current architecture imply?

### Scenario H — Child Completed

```text
Complete Course: Completed
Earn Network+: Active
```

What changes?

### Scenario I — All Children Completed

Does the parent complete automatically?

### Scenario J — Multi-Parent Outcome

```text
Build Portfolio
  contributes to
Build PDS

Build Portfolio
  contributes to
Improve Web Development Skills
```

Would a tree be sufficient?

### Scenario K — Historical Restructure

A child Goal moves from one parent to another after six months.

What happens to old history?

### Scenario L — Found Time

DayFrame discovers 45 minutes of Found Time.

Which Goal/Subgoal Demand should be evaluated, and what structural information would Proposal need?

---

## 42. Invariants to Test Against

Do not adopt these automatically as final architecture. Test whether accepted architecture already requires them and identify any conflict.

### GS-CAND-INV-01

**A Goal hierarchy MUST NOT cause a Goal to own time merely because it has children.**

### GS-CAND-INV-02

**A Subgoal MUST NOT be treated as a Commitment merely because it contributes to a parent Goal.**

### GS-CAND-INV-03

**A Milestone MUST NOT automatically become an independently competing Goal Demand.**

### GS-CAND-INV-04

**Parent and child Demand MUST NOT silently double claim Capacity.**

### GS-CAND-INV-05

**Parent and child Progress MUST NOT silently double count outcome evidence.**

### GS-CAND-INV-06

**Goal Priority MUST NOT silently propagate through structure without explicit architectural semantics.**

### GS-CAND-INV-07

**Goal completion MUST NOT silently cascade without explicit relationship semantics.**

### GS-CAND-INV-08

**Containment MUST NOT imply prerequisite ordering.**

### GS-CAND-INV-09

**Display ordering MUST NOT imply priority or dependency.**

### GS-CAND-INV-10

**A Goal relationship MUST preserve stable identity and historical provenance.**

### GS-CAND-INV-11

**Engine-suggested decomposition MUST NOT silently become authored Goal structure.**

### GS-CAND-INV-12

**Goal Structure MUST NOT allow downstream consumers to bypass Goal Demand or Capacity authority boundaries.**

### GS-CAND-INV-13

**Historical Goal interpretation MUST NOT be rewritten by later structural edits where decision-time structure matters.**

### GS-CAND-INV-14

**A shared Subgoal MUST NOT cause its Demand, Progress, execution, or scheduled work to be duplicated merely because it contributes to multiple parent Goals.**

For each classify:

* Required by Existing Architecture
* Supported by Current Implementation
* Violated by Current Implementation
* Not Applicable Yet
* Requires Future Specification

---

## 43. Required Risks

Explicitly evaluate at least:

1. Treating Goal decomposition as a generic tree.
2. Treating every child as an independent Goal Demand.
3. Treating parent Demand as sum of children without authority.
4. Treating child Progress as parent Progress automatically.
5. Treating milestone as Goal.
6. Treating Goal as task.
7. Treating linked Commitment as Subgoal.
8. Treating hierarchy as prerequisite ordering.
9. Silently inheriting Goal Priority.
10. Silently cascading completion.
11. Losing historical structure after Goal reorganization.
12. Double counting a shared child under multiple parents.
13. Double counting existing Commitment effort and child Demand.
14. Allowing Proposal to choose a child outcome without respecting parent/child Demand semantics.
15. Letting Found-Time recommendations bypass structured Goal authority.
16. Overengineering Goal Structure into project-management software before required semantics are known.

---

## 44. Test Coverage Assessment

Identify current tests covering:

* Goal creation;
* Goal editing;
* Goal lifecycle;
* Goal completion;
* Goal archival;
* Goal links;
* source incarnation;
* measurement;
* Progress;
* target dates;
* historical Goal provenance;
* Goal Activity;
* Summary;
* execution/history;
* Commitment links.

Determine whether any test covers:

* Goal-to-Goal relationships;
* parent/child;
* milestones;
* dependencies;
* Progress roll-up;
* Demand roll-up;
* priority inheritance;
* structural historical provenance.

Run focused existing tests as needed.

Report:

* test files executed;
* total tests;
* pass/fail results;
* which claims each suite substantiates.

Do not create or modify tests.

---

## 45. Required Findings

The result artifact must clearly state:

### Current Executable Truth

What DayFrame actually supports today.

### Missing Structured-Goal Semantics

What is not represented.

### Reusable Primitives

What existing infrastructure could support future architecture.

### Wrong Abstractions

What existing concepts resemble Goal Structure but should not be reused semantically.

### Goal Demand Impact

Whether Goal Structure changes Demand identity/accounting/projection.

### Allocation Impact

Whether structured Goals affect competing-demand evaluation or priority.

### Proposal Impact

Whether Proposal can remain structure-agnostic.

### Progress Impact

Whether Progress architecture needs structural semantics.

### Historical Impact

What relationship provenance future history requires.

### Found-Time Impact

What structured information future Live/Found-Time Proposal may require.

---

## 46. Audit Conclusions

Answer explicitly:

1. Is current DayFrame's Goal domain flat?
2. Does it have meaningful decomposition support?
3. Is any existing mechanism sufficient for Subgoals?
4. Is any existing mechanism sufficient for Milestones?
5. Is any existing mechanism sufficient for Goal dependencies?
6. Can structured Goals be simulated today?
7. If yes, what semantics are lost?
8. Does the Goal Demand specification already solve parent/child Demand accounting?
9. Does Goal Priority architecture already solve inheritance?
10. Does current Progress architecture solve roll-up?
11. Does current history preserve structural provenance?
12. Would adding a simple `parentGoalId` be sufficient?
13. Is a tree sufficient?
14. Does Goal Structure need graph semantics?
15. Must Goal Structure be specified before constructive Proposal?
16. What is the smallest architectural surface that must be specified?
17. Which concerns can safely remain downstream?
18. What should the next architecture task be?

---

## 47. Recommended Next-Step Gate

Select exactly one primary recommendation.

### Path A — Goal Structure Architecture Specification

Choose if the audit establishes that structured Goals affect Goal Demand, Progress, priority, Proposal correctness, or historical provenance sufficiently to require a normative architecture before Proposal work.

### Path B — Minimal Goal Relationship Specification

Choose if only a narrow relationship layer is required and broader decomposition semantics can safely remain downstream.

### Path C — Goal Progress / Milestone Follow-Up Audit

Choose if parent/child semantics are sufficiently clear but Progress/milestone behavior remains executable uncertainty.

### Path D — Goal Demand Structural Accounting Follow-Up Audit

Choose if the principal unresolved issue is how current/new Demand accounting interacts with parent/child Goals and more executable evidence is required.

### Path E — Defer Goal Structure

Choose if current architecture can safely treat Goals as flat through Proposal and decomposition does not affect correctness.

### Path F — Architecture Reconciliation

Choose if Goal Structure requirements contradict accepted Capacity, Goal Demand, Progress, history, or authority architecture.

Explain the choice.

Do not begin the selected next step.

Do not assign Phase 8.

---

## 48. Governance and Constraints

This audit must preserve:

1. **Goals describe desired outcomes.**
2. **Goals do not own time merely by existing.**
3. **Commitments own authorized time.**
4. **Goal Demand requests Capacity without owning time.**
5. **Capacity remains demand-neutral.**
6. **Allocation remains provisional.**
7. **Proposal remains constructive and non-authoritative.**
8. **Explicit user authority precedes Goal-driven time ownership.**
9. **Progress remains distinct from planning effort.**
10. **Goal Priority remains distinct from Commitment priority.**
11. **History remains immutable.**
12. **Generated structure does not become authored truth silently.**
13. **One-off choices do not silently become reusable rules.**
14. **Structural relationships must not create hidden double counting.**
15. **Current implementation is evidence, not authority merely because it exists.**
16. **Intended truth, implemented truth, and experienced truth must remain distinguishable.**
17. **No future implementation phase is established by this audit.**

---

## 49. Non-Goals

This task must not:

* implement Goal Structure;
* add parent Goal fields;
* add child Goal fields;
* add milestones;
* add dependencies;
* add Goal Priority inheritance;
* change Goal Priority architecture;
* change Goal Demand;
* change Demand Projection;
* change Capacity;
* change Allocation;
* change Proposal;
* change Progress;
* change Goal completion;
* change Goal lifecycle;
* change Commitment linking;
* change execution/history;
* change Summary;
* change persistence;
* change backups;
* change profiles;
* change UI;
* add tree controls;
* add decomposition UI;
* implement Found Time;
* implement Commitment Composition;
* create production schemas;
* add or modify tests;
* modify existing architecture documents;
* modify existing audit documents;
* modify source code;
* restructure the repository;
* create Phase 8;
* assign work to Phase 8 or another implementation phase.

This task is read-only with respect to the existing repository.

**The required audit result artifact is the sole permitted repository write.**

---

## 50. Required Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/GOAL_STRUCTURE_DECOMPOSITION_ARCHITECTURE_AUDIT_RESULT.md`

The filename must contain `RESULT` because it is the durable Codex output produced by this audit.

Do not substitute another filename or path.

Use this major structure:

1. **Executive Findings**
2. **Audit Scope and Method**
3. **Current Goal Domain**
4. **Goal Identity and Lifecycle**
5. **Goal Mutation Paths**
6. **Goal Linking**
7. **Current Progress Model**
8. **Goal Completion**
9. **Goal Hierarchy Search**
10. **Milestone Support**
11. **Subgoal Support**
12. **Dependency / Prerequisite Support**
13. **Goal vs Activity**
14. **Goal vs Commitment**
15. **Goal vs Goal Demand**
16. **Double-Demand Risk**
17. **Goal Priority and Structure**
18. **Lifecycle Propagation**
19. **Progress Roll-Up**
20. **Historical Goal Structure**
21. **Summary / Goal Activity**
22. **Execution and Logging**
23. **Found Time Interaction**
24. **Proposal Dependency**
25. **Minimum Semantic Vocabulary**
26. **Structural Relationship Taxonomy**
27. **Tree vs Graph Assessment**
28. **Ordering Semantics**
29. **User Authority**
30. **Determinism Requirements**
31. **Persistence / Backup Compatibility**
32. **Source-Lifetime Safety**
33. **Current-System Flow**
34. **Intended Structured-Goal Boundary Flow**
35. **Current Support Classification**
36. **Current-vs-Needed Matrix**
37. **Primitive-Reuse Matrix**
38. **Double-Counting Matrix**
39. **Boundary Matrix**
40. **Worked Scenarios**
41. **Candidate Invariant Assessment**
42. **Architectural Risks**
43. **Test Coverage Assessment**
44. **Current Executable Truth**
45. **Missing Structured-Goal Semantics**
46. **Goal Demand / Allocation Impact**
47. **Progress / History Impact**
48. **Proposal / Found-Time Impact**
49. **Open Questions**
50. **Audit Conclusions**
51. **Recommended Next Step**
52. **Completion Statement**

After writing:

1. verify the artifact exists at the exact required path;
2. reopen and read it;
3. verify all required sections are complete;
4. verify all required matrices are complete;
5. verify all twelve worked scenarios are addressed;
6. verify all candidate invariants are classified;
7. verify all eighteen audit conclusion questions are answered;
8. verify the recommended next-step gate selects exactly one path;
9. inspect repository status;
10. verify no repository file other than the required result artifact was modified.

Do not merely print findings in Codex's response.

The durable audit result artifact is required.

---

## 51. Validation

Run focused existing tests only as needed to substantiate current executable behavior.

Prefer tests covering:

* Goal store/domain;
* Goal lifecycle;
* Goal links;
* source incarnation;
* measurement;
* Progress;
* historical Goal provenance;
* Summary / Goal Activity;
* execution/history;
* Commitment association.

Record:

* test files executed;
* total tests;
* passed;
* failed;
* relevant claims substantiated.

Do not add or modify tests.

If current implementation contains no Goal Structure tests, report that explicitly rather than treating absence of tests as proof of absence.

Repository search and production-code tracing remain required.

---

## 52. Completion Criteria

The audit is complete only when:

* [ ] Current Goal model is traced from production code.
* [ ] Goal creation and mutation paths are traced.
* [ ] Goal lifecycle is documented.
* [ ] Goal links are fully traced.
* [ ] Goal-to-Goal relationship support is classified.
* [ ] Parent/child support is classified.
* [ ] Milestone support is classified.
* [ ] Dependency support is classified.
* [ ] Goal vs Activity boundary is assessed.
* [ ] Goal vs Commitment boundary is assessed.
* [ ] Goal vs Goal Demand boundary is assessed.
* [ ] Progress model is traced.
* [ ] Goal completion behavior is traced.
* [ ] Progress roll-up support is classified.
* [ ] Lifecycle propagation support is classified.
* [ ] Goal Priority inheritance support is classified.
* [ ] Existing Commitment/Demand attribution is assessed against structured Goals.
* [ ] Parent/child Demand double-counting risk is explicitly assessed.
* [ ] Parent/child Progress double-counting risk is explicitly assessed.
* [ ] Shared-child/multi-parent double-counting risk is assessed.
* [ ] Historical Goal provenance is traced.
* [ ] Future structural provenance requirements are identified.
* [ ] Summary implications are assessed.
* [ ] Execution/logging implications are assessed.
* [ ] Found-Time implications are recorded.
* [ ] Proposal dependency is classified as Case A, B, C, D, or justified combination.
* [ ] Minimum semantic vocabulary is classified.
* [ ] Structural relationship taxonomy is assessed.
* [ ] Tree vs graph assumptions are evaluated.
* [ ] Ordering semantics are distinguished.
* [ ] User-authority implications are documented.
* [ ] Determinism requirements are documented.
* [ ] Persistence/backup compatibility is assessed.
* [ ] Source-lifetime safety is assessed.
* [ ] Current-system Goal flow is documented.
* [ ] Intended structured-goal boundary flow is documented without pretending it exists.
* [ ] Primary GS1–GS5 classification is assigned.
* [ ] Milestone support receives a classification.
* [ ] Goal Dependency support receives a classification.
* [ ] Progress Roll-Up receives a classification.
* [ ] Demand Roll-Up / Attribution receives a classification.
* [ ] Priority Inheritance receives a classification.
* [ ] Historical Structure Provenance receives a classification.
* [ ] Current-vs-Needed Matrix is complete.
* [ ] Primitive-Reuse Matrix is complete.
* [ ] Double-Counting Matrix is complete.
* [ ] Boundary Matrix is complete.
* [ ] All twelve worked scenarios are evaluated.
* [ ] All fourteen candidate invariants are classified.
* [ ] All required architectural risks are evaluated.
* [ ] Relevant existing tests are identified and executed as needed.
* [ ] Test results are recorded.
* [ ] All eighteen audit conclusion questions are explicitly answered.
* [ ] Exactly one recommended next-step path is selected.
* [ ] No implementation was performed.
* [ ] No existing documentation was modified.
* [ ] No future implementation phase was established.
* [ ] `GOAL_STRUCTURE_DECOMPOSITION_ARCHITECTURE_AUDIT_RESULT.md` was written to the exact required path.
* [ ] The artifact was reopened and verified.
* [ ] Repository status was inspected.
* [ ] The required audit result artifact was the sole repository write.
* [ ] Codex reports the exact saved artifact path.
* [ ] Codex reports validation performed and results.
* [ ] Codex reports whether any other repository files changed.

---

## 53. Final Completion Statement

End `GOAL_STRUCTURE_DECOMPOSITION_ARCHITECTURE_AUDIT_RESULT.md` with exactly:

> **Goal Structure / Decomposition Architecture Audit complete.**
>
> The audit establishes the current executable truth of DayFrame's Goal domain; determines whether parent/child Goals, Subgoals, Milestones, dependencies, Progress roll-up, Demand accounting, Goal Priority inheritance, lifecycle propagation, historical structural provenance, and structured Goal execution/logging are represented or absent; evaluates the risks of double counting, hierarchy assumptions, and semantic leakage across Goal, Commitment, Goal Demand, Progress, Allocation, Proposal, and Found Time; identifies reusable primitives and wrong abstractions; determines whether structured Goals must be architecturally specified before constructive Proposal work can proceed; and recommends the next architectural step without modifying implementation or assigning the work to a future implementation phase.

The final Codex response must state:

> **Saved artifact:** `/home/sid/Penn Digital Services/DayFrame/docs/audits/GOAL_STRUCTURE_DECOMPOSITION_ARCHITECTURE_AUDIT_RESULT.md`
>
> **Repository modifications:** The required audit result artifact was the sole repository write.
>
> **Validation:** Report focused existing tests executed, test counts, and results.
>
> **Recommended next step:** Report the selected Path A, B, C, D, E, or F without beginning that work.
