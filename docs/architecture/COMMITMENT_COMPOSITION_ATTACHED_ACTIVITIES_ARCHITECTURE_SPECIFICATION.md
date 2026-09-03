# Commitment Composition / Attached Activities Architecture Specification

## Status

Ready for specification.

## Phase

Post-Phase 7 Architectural Follow-Up

## Task Type

Authoritative architecture-specification task defining DayFrame's Commitment Composition / Attached Activities domain following the completed Commitment Composition / Attached Activities Architecture Audit.

This task must convert the audit's established executable truth and identified semantic seams into a normative architecture for:

* Attached Activities;
* protective Buffers;
* parent/child Commitment composition;
* source-level attachment authority;
* occurrence-level pairing;
* parent-relative timing;
* inherited applicability;
* required/optional components;
* composite feasibility;
* Capacity footprint;
* Goal Demand overhead;
* Friction and Composition Failure;
* accepted composite decisions;
* historical provenance;
* execution;
* actual-duration variance;
* Found Time compatibility.

This task must **not** implement the architecture.

This task is read-only with respect to the existing repository.

**The required specification result artifact is the sole permitted repository write.**

---

## 1. Objective

Define the minimum authoritative Commitment Composition architecture required for DayFrame to represent real time-owning activities that are structurally tied to another Commitment without collapsing them into:

* anonymous buffers;
* independent recurring Commitments;
* placement preferences;
* Work-specific heuristics;
* execution sub-steps;
* generic workflow sequencing.

The central architectural question is:

> **How should DayFrame represent a parent Commitment together with required or optional attached time-owning activities so that occurrence pairing, recurrence/applicability, relative timing, movement, omission, composite feasibility, Capacity, Goal Demand, Friction, history, execution, and Proposal remain deterministic, explainable, and subordinate to explicit user authority?**

The resulting architecture must support cases such as:

```text
Commute to Work
→ Work
→ Commute Home
```

```text
Drive to Gym
→ Workout
→ Shower / Change
→ Drive Home
```

```text
Travel
→ Check-in
→ Medical Appointment
→ Pharmacy
```

without turning DayFrame into a general-purpose workflow engine.

---

## 2. Authoritative Audit Basis

Use the completed:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_AUDIT_RESULT.md`

as the primary executable-evidence basis.

The audit established:

* **CC3 — Relative / Reference Placement Primitives.**
* No first-class Commitment Composition exists.
* No first-class Attached Activity exists.
* `beforeWork` / `afterWork` are transient placement heuristics.
* Work-relative reference identity is not preserved after placement.
* Recurrence inheritance is not implemented.
* Parent movement coupling is not implemented.
* Parent omission coupling is not implemented.
* Required/optional attachment semantics are not implemented.
* Composite feasibility is not implemented.
* Composite Friction / Composition Failure is not implemented.
* PlanDecision targets one occurrence and cannot atomically resolve a composite.
* Buffers are numeric scheduling padding, not activities.
* Buffers reduce available geometry but have no independent identity, execution, Goal linkage, or historical activity provenance.
* Independent Commitments/manual events can visually simulate composition but drift semantically.
* Source incarnation and durable occurrence identity are strong reusable primitives.
* Canonical user-day and overnight placement logic are reusable.
* Execution can preserve reported actual duration for independent occurrences.
* Historical occurrences preserve individual occurrence truth but no attachment relationship.
* Required attachment overhead can make Goal work infeasible even when core Goal Demand duration fits available Capacity.
* Current Proposal inputs cannot express that composite footprint.
* Commitment Composition must therefore be normatively specified before constructive Proposal architecture.

The audit recommended:

> **Path A — Commitment Composition / Attached Activities Architecture Specification.**

Treat audit findings as evidence constraints, not as permission to preserve current heuristic behavior as architecture.

---

## 3. Existing Normative Architecture

The specification must remain consistent with accepted DayFrame architecture.

### Goal

A Goal describes a desired outcome.

### Goal Structure

Goal Structure represents relationships among outcomes and checkpoints.

Goal Structure MUST remain distinct from Commitment Composition.

### Commitment

A Commitment owns or constrains authorized time.

### Capacity

Capacity is the derived set of discretionary intervals remaining after applicable time-owning commitments, liabilities, constraints, buffers, accepted decisions, and availability policy are accounted for.

### Goal Demand

Goal Demand requests planning resources but does not own time.

### Goal-Specific Feasibility

Goal-Specific Feasibility determines whether Demand can use Capacity.

### Allocation

Allocation is provisional and non-authoritative.

### Proposal

Proposal is constructive recommendation.

### Accepted Allocation

Accepted Allocation is explicit user authority.

### Scheduled Goal Work

Scheduled Goal Work is time-owning realization of accepted Goal-directed planning authority.

### Friction

Friction is corrective and applies when authorized constraints cannot coexist.

### Execution

Execution records what actually occurred.

### History

Historical truth must remain interpretable even after current authored structure changes.

### Found Time

Found Time is newly available discretionary time discovered during execution because actual conditions diverged from the authorized plan.

Found Time must preserve planned-vs-actual provenance and must not rewrite earlier scheduling authority.

---

## 4. Required Epistemic Separation

The specification must distinguish at minimum:

* authored parent Commitment authority;
* authored Attached Activity authority;
* authored Attachment Relationship;
* authored Buffer policy;
* authored recurrence/applicability;
* derived parent occurrence;
* derived attached occurrence;
* derived parent-occurrence pairing;
* derived composite occurrence;
* derived composite footprint;
* derived composite feasibility;
* derived Capacity effect;
* derived Composition Failure;
* generated corrective recommendation;
* accepted composite decision;
* scheduled reality;
* historical planned occurrence;
* execution evidence;
* actual-duration variance;
* Found Time;
* learned tendency;
* suggested attachment;
* authored reusable attachment authority.

No derived or suggested attachment may silently become authored recurring time authority.

---

## 5. Normative Commitment Composition Definition

Define a concise normative definition for **Commitment Composition**.

The definition must establish that Commitment Composition represents the authored relationship by which one time-owning Commitment/activity is structurally dependent on another Commitment's existence or occurrence.

It must explicitly state what Commitment Composition is **not**.

At minimum distinguish it from:

* Goal Structure;
* generic task hierarchy;
* workflow sequencing;
* arbitrary dependency graph;
* recurrence;
* preferred placement;
* Work-relative heuristic;
* Buffer;
* scheduling gap;
* checklist;
* execution sub-step;
* grouping for display;
* Goal Demand;
* Proposal.

---

## 6. Attached Activity Definition

Define **Attached Activity** normatively.

The definition must resolve whether an Attached Activity is:

* a distinct Commitment subtype;
* a normal Commitment source participating in an Attachment Relationship;
* a relation-owned activity definition;
* another bounded model.

The audit identified this as an unresolved question.

The selected model must preserve:

* activity identity;
* time ownership;
* independent historical occurrence;
* execution capability where meaningful;
* relationship to parent;
* deterministic occurrence pairing;
* detachment/promotion possibilities;
* lifecycle provenance.

---

## 7. Buffer Definition

Define **Buffer** normatively.

At minimum:

> A Buffer protects time around a Commitment or composite occurrence without itself representing performed activity.

Determine whether Buffers remain:

* numeric fields on a Commitment;
* explicit authored Buffer records;
* relationship-scoped policies;
* some bounded combination.

The architecture must preserve:

**Buffer ≠ Attached Activity.**

A Buffer MUST NOT acquire execution identity merely because it reduces Capacity.

---

## 8. Attached Activity vs Buffer Decision Rule

Provide a normative decision rule.

Consider:

```text
30m commute before Work
```

versus:

```text
30m protected decompression before Work
```

The former is performed activity and may have:

* actual duration;
* execution;
* history;
* Found-Time variance.

The latter may simply reserve unavailable time.

Specify how DayFrame determines which semantic domain applies.

Do not rely solely on labels such as “commute” or “buffer.”

---

## 9. Attached Activity vs Independent Commitment

Define the boundary.

An Attached Activity may be independently meaningful as an activity while still deriving its applicability from a parent.

Determine what makes an activity attached rather than independent.

At minimum consider:

* lifecycle coupling;
* recurrence inheritance;
* occurrence pairing;
* relative timing;
* parent cancellation;
* requiredness;
* conditional applicability;
* composite feasibility.

---

## 10. Attached Activity vs Sub-step

Define **Sub-step** only if necessary.

Candidate distinction:

> A Sub-step is internal execution structure inside a Commitment but does not own a separate scheduled interval or independent occurrence.

Examples:

```text
Workout
  warmup
  lifting
  cooldown
```

may or may not need separately scheduled time identity.

Determine whether Sub-step belongs in this architecture or should remain explicitly outside it.

Do not create an unnecessary execution-task subsystem.

---

## 11. Parent Commitment

Define the semantic role of **Parent Commitment**.

Determine whether “parent” is:

* a Commitment subtype;
* a contextual role created by Attachment Relationship;
* a UI term only.

Prefer keeping Commitment identity uniform unless architecture requires otherwise.

Parenthood MUST NOT automatically imply:

* Goal inheritance;
* priority inheritance;
* activity aggregation;
* recurrence mutation;
* execution aggregation.

---

## 12. Type Model

Evaluate at minimum:

### Model A — Separate Parent / Attached Commitment Types

### Model B — One Commitment Type + Typed Attachment Relationships

### Model C — Parent Source + Relation-Owned Activity Definitions

### Model D — Hybrid

Select one normative model.

Explain consequences for:

* identity;
* recurrence;
* authoring;
* detachment;
* source incarnation;
* history;
* execution;
* Goal links;
* persistence;
* future extensibility.

---

## 13. Attachment Relationship

Define a first-class **Attachment Relationship** if adopted.

Determine what it owns.

Potential semantics:

* relationship identity;
* relationship revision;
* parent source reference;
* attached source/activity reference;
* timing relation;
* applicability;
* requiredness;
* lifecycle coupling;
* occurrence pairing policy;
* movement policy;
* omission policy;
* conditionality;
* Goal-link policy;
* composite-footprint role;
* historical provenance.

Avoid creating a generic arbitrary dependency object.

---

## 14. Relationship Identity and Lifetime

Determine whether each Attachment Relationship requires:

* opaque never-reused ID;
* monotonic revision;
* createdAt;
* updatedAt;
* active/retired lifecycle;
* effectiveFrom/effectiveUntil;
* supersession.

Historical changes such as:

```text
Commute = 30m
```

later becoming:

```text
Commute = 20m
```

must not rewrite old plan interpretation.

Specify relationship-revision semantics.

---

## 15. Endpoint Identity

Specify what an Attachment Relationship references.

Potential endpoints:

### Source-Level Parent

The authored Commitment definition/pattern.

### Source-Level Attached Activity

The authored activity definition.

### Occurrence-Level Parent

The specific generated parent occurrence.

### Occurrence-Level Attached Activity

The derived paired attached occurrence.

Determine which identities are authored and which are derived.

Use source incarnation where necessary to prevent retargeting after delete/recreate.

---

## 16. Source-Level vs Occurrence-Level Authority

Resolve the distinction.

Example:

> “Every onsite Work occurrence has a commute.”

is source-level authority.

But:

> “This specific commute belongs to Tuesday's specific Work occurrence.”

is occurrence-level realization/provenance.

Specify the architectural transition:

```text
Source-level Attachment Authority
→ parent occurrence
→ paired attached occurrence
```

A source-level relationship alone must not make historical pairing ambiguous.

---

## 17. Occurrence Pairing

Define deterministic parent-occurrence pairing.

The architecture must answer:

* which parent occurrence creates which attached occurrence;
* how pairing identity is preserved;
* what happens with multiple same-day parent occurrences;
* what happens when the parent does not occur;
* what happens when occurrence identity changes under regeneration;
* how historical pairing is frozen.

Do not use first/last Work heuristics as the authoritative pairing model.

---

## 18. Multi-Occurrence Parent Days

Resolve split-shift and repeated-parent cases.

Example:

```text
Work A 06:00–10:00
Work B 14:00–18:00
```

with:

```text
Commute Before Work
Commute After Work
```

The architecture must determine how attached occurrences pair without ambiguity.

Evaluate whether one source-level attachment derives one component per qualifying parent occurrence.

Specify deterministic behavior.

---

## 19. Parent Applicability

Define when an attachment applies.

At minimum support consideration of:

* every parent occurrence;
* selected weekdays;
* selected cycle/segment;
* selected occurrence metadata;
* parent location/state;
* parent duration threshold;
* explicit occurrence exception;
* bounded date range.

Select the minimal architecture needed.

Avoid duplicating the entire recurrence language if applicability can derive from parent occurrence plus bounded conditions.

---

## 20. Recurrence Inheritance

Resolve whether Attached Activities own independent recurrence.

Evaluate:

### Model A — Independent Recurrence

### Model B — Full Parent Recurrence Inheritance

### Model C — Parent-Derived Applicability + Bounded Filters/Exceptions

### Model D — Hybrid

The architecture must prevent drift between parent and required attached activity.

Select one normative model.

---

## 21. Attached Activity Duration

Specify duration semantics.

Determine whether Attached Activity duration may be:

* fixed source duration;
* relative to parent metadata;
* occurrence-overridable;
* variable by applicability condition;
* estimated;
* historically frozen.

Preserve a distinction between:

* planned duration;
* accepted occurrence override;
* actual executed duration.

---

## 22. Relative Timing Rule

Define first-class parent-relative timing if required.

At minimum evaluate relations such as:

### EndsAtParentStart

```text
Commute ends when Work begins
```

### StartsAtParentEnd

```text
Commute Home starts when Work ends
```

### BeforeParentWithGap

```text
Preparation ends 10m before Appointment
```

### AfterParentWithGap

```text
Recovery begins 15m after Workout
```

### FixedOffsetFromParentStart

### FixedOffsetFromParentEnd

Select the minimal relation vocabulary.

Do not model these as mere preferred windows.

---

## 23. Exact Constraint vs Preference

Explicitly distinguish:

### Attachment Constraint

The attached activity's timing is structurally defined relative to the parent.

### Placement Preference

The activity merely prefers a region relative to the parent.

A required commute ending at Work start is materially different from “prefer before Work.”

Specify whether optional attachments may use preferences while required attachments use constraints, or whether requiredness and timing strictness remain separate dimensions.

---

## 24. Gap Semantics

Define gap behavior.

A gap may represent:

* protective non-activity Buffer;
* exact temporal separation;
* minimum separation;
* preferred separation.

Do not silently turn all gaps into buffers.

Determine how a relation like:

```text
Commute
10m buffer
Work
```

differs from:

```text
Commute
Work
```

with commute ending ten minutes early.

---

## 25. Before / After Work Compatibility

Determine the future role of existing `beforeWork` / `afterWork`.

Classify them as:

* retained generic placement preferences;
* deprecated for attachment use but still valid independently;
* internally reusable search primitives;
* convertible to authored attachment only through explicit user action.

They MUST NOT silently become attachment authority.

---

## 26. Required vs Optional Attachment

Define requiredness.

### Required Attachment

The parent composite is not fully realizable without the attached component.

### Optional Attachment

The parent may remain valid if the component is omitted/unplaced.

Determine whether more states are needed, such as:

* conditional-required;
* preferred;
* opportunistic.

Avoid using priority as a substitute for requiredness.

---

## 27. Parent Lifecycle Coupling

Specify what happens when a parent source is:

* archived;
* disabled;
* deleted/retired;
* replaced;
* reactivated.

Determine the current-state behavior of attached authority.

Historical relationships must remain resolvable.

---

## 28. Parent Occurrence Omission

Define occurrence-level omission behavior.

If a parent occurrence is omitted:

```text
Work omitted
```

what happens to:

```text
Commute to Work
Commute Home
```

For required attachments whose applicability depends solely on that occurrence, omission should not leave semantically orphaned scheduled activity unless an explicit independence rule exists.

Resolve this normatively.

---

## 29. Parent Cancellation

Distinguish:

* authored source removal;
* generated occurrence omission;
* real-world execution cancellation;
* post-publication cancellation.

Specify which layers affect:

* current schedule;
* attached occurrences;
* historical truth;
* execution.

Do not rewrite published history after the fact.

---

## 30. Parent Movement

Define movement coupling.

Example:

```text
Work moves from 08:00 to 09:00.
```

What happens to an attached commute with `EndsAtParentStart`?

Determine whether the attached activity:

* moves automatically as derived consequence;
* requires new Proposal/decision;
* becomes stale;
* creates Friction if movement violates another authority.

Distinguish authored parent-source edits from accepted single-occurrence moves.

---

## 31. Parent Duration Changes

Resolve:

```text
Appointment end changes from 14:00 to 14:30.
Travel Home starts at parent end.
```

The architecture must specify whether relational timing recomputes automatically while preserving the same attachment authority.

Historical published occurrences must retain old absolute plan and relation provenance.

---

## 32. Attached Occurrence Exceptions

Determine whether users may override a single attached occurrence.

Potential overrides:

* duration;
* omission;
* timing;
* applicability;
* detachment;
* alternative relation.

Specify whether an occurrence-level override changes:

* only the occurrence;
* future source authority;
* relationship authority.

Preserve accepted-choice provenance.

---

## 33. Detachment

Define **Detachment**.

An Attached Activity may sometimes become independent.

Example:

```text
Post-work walk
```

may stop depending on Work.

Determine whether detachment:

* retires the relationship while preserving activity identity;
* creates a new independent Commitment;
* requires source transformation.

Prefer preserving historical identity where semantically valid.

---

## 34. Promotion to Independent Commitment

Resolve whether an Attached Activity can become a normal independent Commitment without recreating history.

This decision depends on the selected type model.

Specify constraints.

---

## 35. Composite Commitment

Define **Composite Commitment** if retained.

Candidate:

> A Composite Commitment is the planning view of one parent Commitment authority plus all applicable required and optional attached activities for a given context.

Determine whether Composite Commitment is:

* persisted authority;
* derived view;
* conceptual term only.

Avoid introducing a second source of truth.

---

## 36. Composite Occurrence

Define **Composite Occurrence**.

Candidate:

> A Composite Occurrence is the deterministic occurrence-level composition consisting of one parent occurrence and its paired applicable attached occurrences.

Determine whether it has:

* its own derived identity;
* parent occurrence identity;
* component occurrence IDs;
* requiredness map;
* composite footprint;
* feasibility state;
* structural fingerprint.

It should not duplicate component occurrences.

---

## 37. Composite Identity

Determine whether a Composite Occurrence requires a durable derived identity.

Consider:

* Friction targeting;
* Proposal explanation;
* atomic decisions;
* historical publication;
* Summary aggregation.

If adopted, derive it deterministically from authoritative occurrence/relationship identities rather than random generation.

---

## 38. Composite Footprint

Define **Composite Footprint**.

The footprint must distinguish:

* parent activity intervals;
* attached activity intervals;
* protective Buffer intervals;
* unresolved required activity liability.

Do not flatten everything into one anonymous continuous envelope unless semantically justified.

The footprint is needed for Capacity and feasibility.

---

## 39. Time Ownership

Resolve how attached components affect time ownership.

A time-owning Attached Activity MUST occupy its own interval.

A Buffer MAY protect an interval without activity identity.

Determine whether the parent itself owns only its core interval or whether composite footprint is a separate derived availability claim.

Avoid double-counting parent + envelope.

---

## 40. Capacity Boundary

Use the accepted Capacity architecture.

Capacity must exclude:

* parent time-owning interval;
* time-owning Attached Activity intervals;
* relevant Buffers;
* unresolved required Commitment liabilities where applicable.

Determine how a partially unrealizable composite affects Capacity.

Example:

```text
Work 08:00–16:00
Required commute 07:30–08:00 cannot fit.
```

The 07:30–08:00 interval MUST NOT be advertised as clean discretionary Capacity merely because the commute failed to place.

Specify the liability boundary.

---

## 41. Composite Liability

Define **Composite Liability** or equivalent if necessary.

Candidate:

> A Composite Liability is the unresolved time requirement created when an authorized required attachment cannot currently be realized while its parent remains applicable.

Determine whether this should extend existing unresolved Commitment liability or be a composition-specific subtype.

Prefer reuse of accepted Capacity liability concepts where possible.

---

## 42. Composite Feasibility

Define deterministic **Composite Feasibility**.

It should answer whether:

* parent;
* required attached activities;
* required Buffers;
* relation constraints;

can all be realized together.

Composite Feasibility must not:

* allocate Goal Demand;
* create Proposal;
* silently move fixed authority;
* authorize omission.

Determine how optional attachments affect feasibility.

---

## 43. Feasibility Granularity

Determine whether feasibility is evaluated:

* during occurrence derivation;
* before individual placement;
* after candidate placement;
* as a transactional placement bundle.

Select the architectural boundary.

Avoid partial placement that leaves parent apparently valid while a required component fails without explicit state.

---

## 44. Partial Composite Realization

Define what happens when:

* parent is realizable;
* one optional attachment is not;
* one required attachment is not.

Distinguish:

* fully feasible;
* feasible with optional omission;
* composition-limited;
* infeasible;
* unknown/stale.

Do not overfit terminology if fewer states suffice.

---

## 45. Composition Failure

Define **Composition Failure** normatively if adopted.

Candidate:

> Composition Failure is the derived condition that an authorized required composition cannot currently be realized while preserving its declared structural timing and other authoritative constraints.

Distinguish it from:

* ordinary overlap Friction;
* unplaced flexible work;
* missing Work anchor;
* Goal Demand infeasibility;
* Proposal limitation.

---

## 46. Friction Boundary

Specify when Composition Failure becomes Friction.

Potential distinction:

### Pre-Authority / Derivation Failure

A proposed discretionary composite cannot fit → Feasibility limitation.

### Existing Authorized Composite Failure

A required attached activity for an already authorized parent cannot coexist with other authority → Friction.

Resolve the boundary consistently with:

**Proposal is constructive. Friction is corrective.**

---

## 47. Composite Friction

Determine whether Friction needs composition-specific kinds.

Potential examples:

* requiredAttachmentUnplaced;
* attachmentTimingViolation;
* parentMissingRequiredAttachment;
* pairedOccurrenceAmbiguous;
* compositeOverlap.

Do not mandate names unless necessary.

Define semantic requirements instead.

---

## 48. Suggested Fixes

Specify what future corrective recommendations may do.

Potential fixes:

* move parent + attachments atomically;
* move only flexible attachment where relation permits;
* omit optional attachment;
* change attachment duration;
* change Buffer;
* modify relation;
* detach activity;
* accept conflict.

Suggestions remain non-authoritative.

---

## 49. Atomic Composite Decisions

Determine how accepted decisions operate over composed occurrences.

Current `PlanDecision` is single-occurrence.

Evaluate:

### Model A — Extend PlanDecision to multi-target/composite target

### Model B — New CompositeDecision authority

### Model C — Transaction of coordinated PlanDecisions under one acceptance record

Select the normative authority boundary, not implementation details.

A move intended to preserve composition MUST NOT partially apply.

---

## 50. Decision Replay

Specify deterministic replay behavior for accepted composite decisions.

Replay must validate:

* parent occurrence identity;
* component occurrence identities;
* relation revisions;
* source incarnations;
* structural fingerprint;
* applicability.

Stale or structurally incompatible decisions must not silently partially replay.

---

## 51. Decision Scope

Determine possible decision scopes:

* one composite occurrence;
* bounded repeated composites;
* source-level relationship change;
* one component occurrence.

Distinguish accepted occurrence choice from authored reusable attachment authority.

Do not silently promote one accepted composite move into a recurring rule.

---

## 52. Goal Link Boundary

Resolve Goal provenance rules.

Attached Activities may or may not serve the same Goal as the parent.

Examples:

```text
Goal: Improve Fitness
Workout
Drive to Gym
Shower
```

The drive and shower are overhead around Goal-directed work but are not automatically outcome Progress.

Determine whether Goal links:

### Model A — Never inherit automatically

### Model B — Inherit service attribution only

### Model C — Explicit policy may propagate selected Goal association

Select normative semantics.

Preserve:

**Goal attribution ≠ Progress.**

---

## 53. Goal Demand Overhead Boundary

This is a required architecture decision.

Example:

```text
Workout Goal Demand: 60m
Required travel: 30m
```

Determine whether Goal Demand represents:

### Model A — Core Goal Work Only

Demand remains 60m; composition adds a 30m required Capacity footprint.

### Model B — Entire Composite Resource Requirement

Demand becomes 90m.

### Model C — Explicit Core + Overhead Accounting

Demand preserves 60m productive request while Feasibility/Allocation consume 90m composite resource footprint with 30m classified overhead.

### Model D — Another bounded model

Select one normative model.

The architecture must preserve the difference between:

* effort performed directly toward Goal;
* overhead required to make that work possible.

---

## 54. Goal Demand Conservation

Whatever model is selected must prevent:

* counting core work twice;
* counting attached overhead twice;
* turning travel into Goal Progress;
* claiming Capacity once for Demand and again anonymously for same attachment;
* hiding overhead from feasibility.

Define conservation semantics.

---

## 55. Goal-Specific Feasibility Boundary

Specify how Goal-Specific Feasibility evaluates Goal work requiring composition.

Example:

```text
Capacity: 75m
Workout core: 60m
Required travel: 30m
```

The result must be infeasible for that opportunity even though core duration alone fits.

Determine whether Feasibility receives:

* composite resource footprint;
* attachment requirements;
* pre-expanded component requirements;
* another normalized representation.

Prefer keeping Goal-Specific Feasibility from traversing arbitrary Commitment Composition itself if an upstream footprint can be supplied.

---

## 56. Allocation Boundary

Determine whether Allocation consumes:

* core Goal Demand quantity;
* composite required Capacity quantity;
* both productive and overhead classifications;
* component identities/provenance.

Allocation must remain able to compare Goals fairly without treating overhead as Progress or Goal effort.

Explicitly address:

```text
Goal A: 60m work + 30m overhead
Goal B: 60m work + 0m overhead
```

What resource amount competes for Capacity?

Do not change Goal Priority semantics.

---

## 57. Proposal Boundary

Proposal must not recommend Goal work whose required composite footprint cannot be realized.

Specify the handoff.

Candidate:

```text
Goal Demand
→ Goal-Specific Work Shape
→ Commitment Composition Footprint
→ Feasibility
→ Allocation
→ Proposal
```

or another sequence consistent with accepted architecture.

Proposal MUST NOT itself invent commute, prep, or cleanup time.

---

## 58. Existing Recurring Commitment Boundary

Distinguish attachments around:

### Existing Authored Commitment

```text
Work + commute
```

from:

### Proposed Goal Work

```text
Proposed workout + travel
```

The parent activity may be:

* already authored recurring authority;
* a proposed one-off Scheduled Goal Work occurrence;
* future recurring Goal pattern after explicit acceptance.

Specify how attachment authority applies across both.

---

## 59. Proposed Parent with Existing Attachment Pattern

Consider:

```text
Workout activity pattern has attached 15m travel each way.
```

When Proposal considers scheduling a workout, how does it learn the footprint?

Determine whether attachment relationships can belong to:

* reusable Commitment patterns;
* Goal-work activity patterns;
* both.

Do not collapse Proposal into authoring.

---

## 60. Accepted Allocation Boundary

When Proposal accepts Goal work with required attachments, determine what the accepted authority covers.

Potentially:

* core Goal work;
* required attached activity occurrences;
* required Buffers;
* composite placement.

Accepted authority must be sufficient to create all time-owning scheduled components without hidden engine-authored commitments.

---

## 61. Scheduled Goal Work

Determine whether required Attached Activities around Scheduled Goal Work are themselves:

* Scheduled Goal Work;
* Scheduled Support Activity;
* ordinary Scheduled Commitment occurrences;
* another distinct historical classification.

Preserve semantic distinction between productive Goal work and overhead.

Do not make travel itself satisfy Goal Demand unless separately authorized by Goal Demand semantics.

---

## 62. Buffer Accounting Around Goal Work

Resolve how Buffers around Goal work consume Capacity.

A Buffer may be required to make the scheduled activity viable while remaining non-activity.

Distinguish:

```text
60m workout + 10m recovery buffer
```

from:

```text
60m workout + 10m shower activity
```

Both consume Capacity differently in history/execution.

---

## 63. Parent Movement Under Proposal

If Proposal or accepted decision moves a parent proposed activity, required attachments must preserve relational semantics.

Specify whether feasibility is recomputed as a composite before presenting or accepting the move.

---

## 64. History

Define historical provenance required for composed occurrences.

At minimum preserve:

* parent source identity/incarnation;
* parent occurrence identity;
* Attached Activity source identity/incarnation;
* attached occurrence identity;
* Attachment Relationship ID/revision;
* requiredness;
* relation/timing rule;
* planned duration;
* Buffer contribution;
* composite identity/fingerprint if adopted;
* accepted decision provenance where decisive.

Do not require full source graph snapshots if exact revision references suffice.

---

## 65. Historical Restructuring

Resolve:

```text
Commute attached to Work
```

later changed to:

```text
No commute / remote Work
```

or:

```text
30m commute → 20m commute
```

Historical scheduled and executed occurrences must remain interpretable under the old relation.

Current structure must not rewrite old composite meaning.

---

## 66. Execution Model

Real Attached Activities should generally be independently executable if their actual performance matters.

Determine whether:

* parent has its own execution;
* each real attached activity has its own execution;
* Buffer has no execution;
* Composite Occurrence has derived aggregate execution view but no duplicate execution record.

Preserve one historical execution fact per actual activity occurrence.

---

## 67. Execution Coupling

Parent execution and attachment execution are not necessarily identical.

Examples:

* Work completed, commute skipped due remote arrangement.
* Workout completed, shower not logged.
* Appointment canceled, travel partially occurred.

Determine whether execution relationships may diverge from planned composition without rewriting plan authority.

History must preserve both:

* what was planned;
* what happened.

---

## 68. Actual Duration

Specify planned-vs-actual duration semantics for Attached Activities.

Actual duration may differ from planned duration.

Do not mutate the historical plan interval after execution.

Execution evidence should preserve variance.

---

## 69. Actual Start / End

The audit found current execution stores occurrence time plus reported duration but not necessarily exact actual end.

Determine whether Commitment Composition architecture requires exact actual start/end, or whether duration + occurredAt is sufficient.

This matters for:

* shifting later attached activities;
* Found Time;
* delay propagation;
* real-time Live planning.

If not resolvable yet, define the minimum provenance requirement and flag exact Live execution semantics as downstream.

---

## 70. Found Time

Define only the Commitment Composition boundary.

Examples:

```text
Planned commute: 30m
Actual commute: 15m
→ potential 15m Found Time
```

```text
Appointment ends 20m early
→ attached travel home may become possible earlier
```

Composition-aware Found Time must distinguish:

* activity ending early;
* Buffer being released;
* parent canceled;
* optional attachment omitted;
* required attachment completed early.

Found Time remains derived availability and must not rewrite the original schedule.

---

## 71. Found Time and Remaining Composite

If one component ends early but later required components remain, not all released time is necessarily discretionary.

Example:

```text
Appointment ends 20m early
Travel Home remains attached immediately after Appointment
```

Determine whether travel shifts earlier automatically or retains scheduled time.

The architecture must state which relational timing rules are based on:

* planned parent boundary;
* actual parent boundary;
* explicit Live rescheduling authority.

Do not leave this ambiguous if it affects Found Time calculation.

---

## 72. Planned-Relative vs Actual-Relative Attachments

Evaluate whether Attachment Relationships require a mode such as:

### Plan-Relative

Attachment timing derives from scheduled parent interval.

### Execution-Relative

Attachment timing may react to actual parent completion during Live execution.

### Hybrid / Explicit Policy

Select the minimal architecture needed.

Be cautious: actual-relative movement changes scheduled reality and may collide with other commitments.

No automatic Live movement may bypass user authority or conflict checks.

---

## 73. Live Rescheduling Boundary

If actual events shift a remaining attached activity, determine whether that is:

* automatic realization within already accepted relational authority;
* a new Proposal;
* a corrective Friction resolution;
* user decision.

Distinguish cases where relation authority already explicitly permits dynamic actual-relative timing.

---

## 74. Optional Attachment Execution

An optional attachment may be planned but skipped.

Skipping it may produce:

* unused Capacity;
* Found Time;
* no parent failure.

Specify how plan, execution, and Summary distinguish this from a required component failure.

---

## 75. Summary / Reporting

Define high-level reporting semantics.

Support future distinction among:

* core parent activity time;
* attached activity time;
* Buffer time;
* total composite footprint;
* planned vs actual duration;
* direct Goal work;
* support/overhead time.

Aggregate views MUST NOT double count:

* parent;
* components;
* composite envelope.

---

## 76. Direct vs Composite Views

Specify:

### Direct Activity View

Each real time-owning occurrence independently.

### Composite View

The total operational cost and structure of one parent occurrence.

Composite totals derive from component identities.

Do not create duplicate activity records for aggregate reporting.

---

## 77. Goal Reporting

Determine whether attached overhead may appear in Goal-related Summary.

Potential semantics:

* direct Goal work;
* supporting activity;
* operational overhead;
* unrelated activity.

Select an explicit attribution model or defer exact UI while preserving the semantic categories.

Overhead MUST NOT become Goal Progress by implication.

---

## 78. Buffer Reporting

Determine whether Buffers should appear in history/Summary as:

* invisible scheduling metadata;
* protected-time totals;
* optional analytical overhead;
* another derived view.

Because Buffers are not activities, do not represent them as executed time.

---

## 79. Persistence Authority

Determine what must be persisted as current authored authority.

Potentially:

* Attached Activity source;
* Attachment Relationship;
* relation revision;
* applicability;
* requiredness;
* relative timing;
* Buffer policy;
* Goal attribution policy;
* Goal-Demand overhead policy if separately authored.

Derived occurrence pairing and composite feasibility should generally remain reproducible.

---

## 80. Backup / Restore

Specify future requirements.

At minimum:

* versioned schema evolution;
* source-incarnation preservation;
* attachment relationship identity;
* endpoint validation;
* recurrence/applicability validation;
* no dangling required relationships;
* deterministic canonicalization;
* atomic restoration;
* compatibility with legacy independent Commitments;
* immutable historical relationship provenance.

Do not implement migrations.

---

## 81. Import / Replacement

Specify behavior when parent/child sources are replaced/imported.

Never retarget attachment by title.

Dangling current attachment authority must be rejected or explicitly resolved.

Current-state replacement must not rewrite historical composed occurrences.

---

## 82. Deletion and Retirement

Define relation/source retirement semantics.

Consider:

* retire Attachment Relationship;
* retire attached activity;
* retire parent;
* hard-delete unused unreferenced draft authority.

Historically used relationship authority must not be destructively erased.

---

## 83. Goal-Link Propagation

If explicit Goal service attribution propagation is allowed, define its scope.

For example:

```text
Workout serves Improve Fitness
Drive to Gym supports Workout
```

Potential output:

* Workout = direct Goal service.
* Drive = support/overhead associated with Goal context.
* Neither automatically creates Progress.

Do not use inherited Goal link as Demand satisfaction attribution without explicit accounting.

---

## 84. Suggested Attached Activities

Define epistemic handling for future suggestions such as:

> “You usually leave 25 minutes before this appointment. Add travel as an attached activity?”

Such suggestions are proposed authored structure.

Acceptance may create:

* new attached activity source;
* Attachment Relationship;
* applicability/timing rule.

Rejection creates nothing.

Repeated history may suggest, never silently establish.

---

## 85. Direct User Authoring

Users may create attachments directly without an engine suggestion.

Direct authoring and accepted suggestions become equivalent current authority after validation, while retaining distinct origin provenance.

---

## 86. Structural Modification

Specify changes such as:

* commute 30m → 20m;
* required → optional;
* parent-relative rule changes;
* applicability changes;
* Buffer added/removed;
* relation moved to another parent;
* child detached.

Material changes must revise/supersede relation authority and stale dependent derivations.

---

## 87. Staleness

Determine which changes stale:

* parent occurrence derivation;
* attached occurrence derivation;
* composite footprint;
* composite feasibility;
* Capacity;
* Friction;
* Goal-Specific Feasibility;
* Allocation;
* Proposal.

At minimum consider changes to:

* parent source revision/incarnation;
* Attached Activity revision/incarnation;
* Attachment Relationship revision;
* requiredness;
* relative timing;
* applicability;
* parent occurrence;
* PlanDecision;
* Buffer;
* Goal Demand;
* Capacity;
* actual execution state where Live decisions depend on it.

---

## 88. Composition Fingerprint

Determine whether a **Composition Fingerprint** is required.

If accepted, consider including:

* parent source/incarnation/revision;
* parent occurrence identity;
* relation IDs/revisions;
* attached source/incarnation/revision;
* applicability result;
* requiredness;
* relative timing rule;
* duration;
* Buffer rules;
* relevant occurrence decisions;
* user-day policy;
* algorithm version.

Exclude presentation metadata.

---

## 89. Determinism

Equivalent authoritative inputs must produce equivalent:

* applicable attachment set;
* parent-occurrence pairing;
* attached occurrence identity;
* relative placement;
* composite footprint;
* composite feasibility;
* liability;
* Friction;
* fingerprints;
* historical provenance.

Runtime insertion order, UI order, or incidental array order must not alter semantic output.

---

## 90. Canonical User-Day Semantics

Composition MUST use canonical DayFrame user-day semantics.

It must preserve:

* overnight Work;
* attachments before an overnight start;
* attachments after an overnight end;
* cross-midnight components;
* user-day ownership;
* calendar-date conversion.

Calendar midnight MUST NOT become an implicit attachment boundary.

---

## 91. Cross-User-Day Components

Determine whether an Attached Activity may belong to the parent occurrence even if its absolute time falls in an adjacent calendar date or user-day.

Example:

```text
Parent Work user-day: Monday
Work 22:00 Monday–06:00 Tuesday
Commute Home 06:00–06:30 Tuesday
```

Specify ownership/provenance semantics.

Do not force relation membership to match naive calendar date.

---

## 92. Ordering

Distinguish:

* structural attachment;
* temporal relation;
* display order;
* execution sequence;
* scheduler placement order.

A component may be attached without being a generic workflow predecessor/successor.

Do not create arbitrary DAG workflow execution semantics.

---

## 93. Scope Limitation

The architecture must explicitly reject expansion into generic workflow management.

Examples outside scope unless independently justified:

* arbitrary task dependencies;
* branching workflows;
* checklists;
* project task graphs;
* conditionally generated task chains;
* business process automation.

Commitment Composition is bounded to **time-owning operational components tied to a parent Commitment occurrence**.

---

## 94. Required Composition Models Assessment

Explicitly evaluate and select among:

### Attachment Source Model

* independent reusable source;
* relation-owned child source;
* hybrid.

### Applicability Model

* own recurrence;
* inherited recurrence;
* parent-derived applicability with filters;
* hybrid.

### Timing Model

* preferred placement;
* exact relative constraint;
* explicit constraint/preference dimension.

### Requiredness Model

* required/optional only;
* richer bounded taxonomy.

### Composite Authority Model

* derived composite;
* persisted composite;
* relationship authority only.

### Decision Model

* extended PlanDecision;
* separate CompositeDecision;
* coordinated transaction.

### Goal-Demand Overhead Model

* core-only Demand + external footprint;
* whole-composite Demand;
* core + explicit overhead footprint.

Select normative outcomes.

---

## 95. Required Normative Worked Examples

Resolve at least these examples fully.

### Example A — Required Commute Before Work

```text
Commute 30m
Work 08:00–16:00
```

Resolve source authority, occurrence pairing, relative timing, Capacity, history, execution.

### Example B — Required Commute After Work

Resolve relation to parent end.

### Example C — Work Canceled Before Publication

Resolve attached occurrence generation.

### Example D — Published Work Later Canceled

Preserve planned history and actual execution/cancellation truth.

### Example E — Split Shift

Two Work occurrences each derive their own applicable commute occurrences.

### Example F — Overnight Shift

```text
Commute 21:30–22:00
Work 22:00–06:00
Commute Home 06:00–06:30
```

Resolve user-day and pairing.

### Example G — Buffer vs Commute

Compare 30m protected Buffer with 30m attached commute.

### Example H — Required Attachment Cannot Fit

Parent fits; commute does not.

Resolve composite feasibility, liability, Capacity, Friction.

### Example I — Optional Attachment Cannot Fit

Parent remains valid.

### Example J — Parent Moves

Work shifts one hour later.

Resolve attached timing and accepted decision semantics.

### Example K — Parent Duration Changes

Appointment ends 30m later.

Resolve after-activity.

### Example L — Conditional Attachment

Commute only when Work occurrence is onsite.

### Example M — Detachment

Post-work walk becomes independent.

Preserve identity/history as appropriate.

### Example N — Goal Work + Required Travel

```text
Workout core: 60m
Travel: 15m each way
Capacity opportunity: 75m
```

Resolve Goal Demand/Capacity/Feasibility semantics.

### Example O — Goal Work + Buffer

```text
Workout core: 60m
Recovery Buffer: 10m
```

Distinguish from activity overhead.

### Example P — Accepted Goal Work

Proposal is accepted for core work plus required attachments.

Specify resulting scheduled authority.

### Example Q — Planned 30m Commute, Actual 20m

Resolve execution variance and Found-Time eligibility.

### Example R — Appointment Ends Early

Resolve planned-relative vs actual-relative travel behavior.

### Example S — Suggested Travel Attachment

DayFrame suggests recurring travel; user accepts only part.

Resolve authority/provenance.

### Example T — Historical Duration Change

Commute changes from 30m to 20m next month.

Old occurrences remain interpretable.

---

## 96. Required Invariants

Create a normative invariant set covering at minimum:

1. Time-owning Attached Activities reduce Capacity as activities.
2. Buffers remain non-activity protected time.
3. Relative placement preference is not Attachment authority.
4. Required attachment does not silently become independent if parent disappears.
5. Required attachment failure cannot be hidden as clean Capacity.
6. Parent movement preserves relational semantics or explicitly fails/stales.
7. Parent omission does not leave semantically orphaned required attachment.
8. Parent occurrence pairing is deterministic.
9. Multiple parent occurrences do not use first/last heuristics as authority.
10. Recurrence/applicability does not drift independently from required parent relation.
11. Attachment relation has stable identity/history.
12. Source recreation cannot silently retarget attachment.
13. Required/optional semantics are explicit.
14. Buffer semantics are distinct from attached activity semantics.
15. Composite footprint does not double count parent/components.
16. Composite feasibility considers required components.
17. Optional component failure does not automatically invalidate parent.
18. Composition Failure remains distinct from ordinary Friction.
19. Authorized composite infeasibility becomes corrective Friction where appropriate.
20. Composite decisions apply atomically.
21. One-off composite decisions do not silently modify recurring relationship authority.
22. Goal linkage does not silently propagate unless explicitly governed.
23. Goal Demand does not ignore required composite overhead.
24. Overhead does not silently become Goal Progress.
25. Feasibility considers the actual Capacity footprint required to realize Goal work.
26. Proposal does not invent attachments.
27. Proposal does not recommend infeasible composite work.
28. Suggested attachments require acceptance before becoming authored recurring authority.
29. Historical relation semantics survive restructuring.
30. Real activity execution is recorded once.
31. Composite reporting derives from component identities without duplication.
32. Buffer time is not reported as executed activity.
33. Planned and actual duration remain distinct.
34. Found Time preserves plan/actual provenance.
35. Found Time does not double count time still needed by remaining composite components.
36. Canonical user-day semantics are preserved.
37. Goal Structure remains separate from Commitment Composition.
38. Commitment Composition remains bounded and does not become generic workflow management.
39. Equivalent authoritative inputs produce equivalent composite outputs.
40. Stale composite derivations cannot drive current Proposal.

Add additional invariants where necessary.

---

## 97. Required Architecture Decisions

Create individually numbered normative decisions:

`CC-SPEC-01`, `CC-SPEC-02`, etc.

Each decision must contain:

* **Decision**
* **Normative Rule**
* **Reasoning**
* **Consequences**
* **Implementation Constraint**
* **Remaining Downstream Question**

At minimum create decisions for:

1. Commitment Composition definition.
2. Attached Activity definition.
3. Buffer definition.
4. Attached Activity vs Buffer.
5. type model.
6. Attachment Relationship.
7. relationship identity/lifecycle.
8. source-level vs occurrence-level authority.
9. occurrence pairing.
10. multi-occurrence parent behavior.
11. applicability.
12. recurrence inheritance.
13. duration.
14. relative timing rule.
15. exact constraint vs preference.
16. gap/Buffer semantics.
17. existing beforeWork/afterWork role.
18. required/optional semantics.
19. parent lifecycle.
20. omission/cancellation.
21. movement.
22. duration changes.
23. occurrence exceptions.
24. detachment/promotion.
25. Composite Commitment.
26. Composite Occurrence.
27. composite identity/fingerprint.
28. composite footprint.
29. time ownership.
30. Capacity/liability.
31. composite feasibility.
32. partial realization.
33. Composition Failure.
34. Friction boundary.
35. corrective fixes.
36. composite accepted decision.
37. replay/staleness.
38. Goal-link propagation.
39. Goal-Demand overhead.
40. Goal-Demand conservation.
41. Goal-Specific Feasibility boundary.
42. Allocation boundary.
43. Proposal boundary.
44. Accepted Allocation / Scheduled Goal Work.
45. historical provenance.
46. execution.
47. actual-duration variance.
48. Found Time.
49. planned-relative vs actual-relative timing.
50. Summary/reporting.
51. persistence/backup/restore.
52. deletion/retirement.
53. suggestions/user authority.
54. determinism/user-day semantics.
55. scope limitation.

---

## 98. Required Relationship Matrix

Produce:

| Relationship / Rule | Source | Target | Authored or Derived? | Own Identity? | Owns Time? | Affects Capacity? | Affects Feasibility? | Affects Lifecycle? | Historical Provenance Required? |
| ------------------- | ------ | ------ | -------------------- | ------------: | ---------: | ----------------: | -------------------: | -----------------: | ------------------------------: |

Include:

* Attachment Relationship;
* parent-occurrence pairing;
* relative timing;
* Buffer relation/policy;
* applicability;
* requiredness;
* Goal service attribution if accepted;
* composite membership.

---

## 99. Required Boundary Matrix

Produce:

| Concept | Own Identity? | Authored? | Own Lifecycle? | Owns Time? | Executable? | Parent-Coupled? | Reduces Capacity? | May Affect Goal Demand Feasibility? | Historical Provenance? |
| ------- | ------------: | --------: | -------------: | ---------: | ----------: | --------------: | ----------------: | ----------------------------------: | ---------------------: |

Include:

* Parent Commitment;
* Attached Activity;
* Buffer;
* Sub-step if retained;
* Attachment Relationship;
* Parent occurrence;
* Attached occurrence;
* Composite Occurrence;
* Composite Liability;
* Scheduled Goal Work;
* Execution.

---

## 100. Required Applicability Matrix

Produce:

| Scenario | Parent Occurs? | Applicability Condition | Attached Occurrence Generated? | Required? | Composite Effect |
| -------- | -------------: | ----------------------- | -----------------------------: | --------: | ---------------- |

Include:

* normal recurrence;
* parent absent;
* onsite-only;
* remote Work;
* weekday subset;
* split shift;
* occurrence exception;
* parent archived;
* relationship retired.

---

## 101. Required Timing Matrix

Produce:

| Timing Rule | Parent Reference | Constraint or Preference? | Gap Allowed? | Recomputes on Parent Move? | Historical Rule Preserved? |
| ----------- | ---------------- | ------------------------- | -----------: | -------------------------: | -------------------------: |

Include all accepted relative timing forms.

---

## 102. Required Lifecycle Matrix

Produce:

| Event | Parent Source | Parent Occurrence | Attachment Relationship | Attached Occurrence | Required Composite Result | Historical Result |
| ----- | ------------- | ----------------- | ----------------------- | ------------------- | ------------------------- | ----------------- |

Include:

* parent source archived;
* parent source recreated;
* parent occurrence omitted;
* parent occurrence moved;
* parent duration changed;
* relation retired;
* child detached;
* required child omitted;
* optional child omitted;
* published occurrence canceled in execution.

---

## 103. Required Capacity / Footprint Matrix

Produce:

| Scenario | Parent Activity | Attached Activity | Buffer | Composite Footprint | Capacity Effect | Liability if Unplaced |
| -------- | --------------: | ----------------: | -----: | ------------------: | --------------- | --------------------- |

Include:

* Work + two commutes;
* Work + Buffers;
* workout + travel;
* workout + recovery Buffer;
* parent with optional attachment;
* parent with required failed attachment.

---

## 104. Required Goal-Demand Overhead Matrix

Produce:

| Scenario | Core Goal Demand | Required Activity Overhead | Buffer Overhead | Resource Footprint for Feasibility | Demand Satisfaction Credit | Progress Credit |
| -------- | ---------------: | -------------------------: | --------------: | ---------------------------------: | -------------------------: | --------------: |

Include:

* workout + travel;
* study + setup activity;
* study + setup Buffer;
* Goal work with optional attachment;
* Found Time insufficient for composite;
* existing reusable attachment pattern.

The matrix must make explicit which quantities compete for Capacity and which satisfy Goal Demand.

---

## 105. Required Feasibility Matrix

Produce:

| Scenario | Core Fits? | Required Attachments Fit? | Optional Attachments Fit? | Composite State | Proposal Eligible? | Friction? |
| -------- | ---------: | ------------------------: | ------------------------: | --------------- | -----------------: | --------: |

Include:

* all fit;
* required fails;
* optional fails;
* parent fixed;
* proposed parent;
* overnight composite;
* stale attachment relation.

---

## 106. Required Decision Matrix

Produce:

| User Decision | Target | Atomic? | Changes Current Occurrence? | Changes Recurring Authority? | Requires Revalidation? | Historical Provenance |
| ------------- | ------ | ------: | --------------------------: | ---------------------------: | ---------------------: | --------------------- |

Include:

* move composite;
* omit parent;
* omit required attachment;
* omit optional attachment;
* resize attachment;
* detach;
* change Buffer;
* modify recurring relation;
* accept suggested attachment.

---

## 107. Required Execution Matrix

Produce:

| Planned State | Actual Parent | Actual Attachment | Buffer | Historical Plan Changed? | Execution Records | Found-Time Candidate? |
| ------------- | ------------- | ----------------- | ------ | -----------------------: | ----------------- | --------------------: |

Include:

* all as planned;
* attachment early;
* attachment late;
* parent early;
* parent canceled;
* optional attachment skipped;
* required attachment skipped;
* Buffer unused.

---

## 108. Required Authority Matrix

Produce:

| Concept | Authority Source | Epistemic Category | Persist Current? | Can Create Time Ownership? | Can Move Time? | Can Change Capacity? | User Acceptance Required? |
| ------- | ---------------- | ------------------ | ---------------: | -------------------------: | -------------: | -------------------: | ------------------------: |

Include all major composition concepts.

---

## 109. Required Transition Matrix

Produce:

| Transition | Input | Output | Automatic? | User Authority Required? | Creates/Changes Time Ownership? | Historical Freeze? |
| ---------- | ----- | ------ | ---------: | -----------------------: | ------------------------------: | -----------------: |

Include:

* parent source + attachment authority → paired occurrences;
* relation → relative placement;
* paired components → composite footprint;
* footprint → feasibility;
* failed required component → liability;
* authorized failure → Friction;
* fix suggestion → accepted composite decision;
* accepted Goal proposal → scheduled composite;
* scheduled occurrence → execution;
* execution variance → Found-Time candidate;
* suggestion → authored attachment.

---

## 110. Required Primitive Compatibility Matrix

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

* source IDs;
* source incarnation;
* BlockTemplate;
* BlockRecurrence;
* ManualEvent;
* shift Work blocks;
* BlockCandidate;
* ScheduledBlock;
* beforeWork/afterWork;
* bufferBeforeMinutes/bufferAfterMinutes;
* user-day boundary logic;
* placement engine;
* unplaced candidates;
* Friction;
* SuggestedFix;
* PlanDecision;
* durable occurrence references;
* historical occurrence;
* Goal Commitment links;
* execution records;
* backup/restore.

---

## 111. Required Consistency Checks

Explicitly test the final specification against at least:

1. Parent with no attachments.
2. Parent with one required before-attachment.
3. Parent with one required after-attachment.
4. Parent with required before and after.
5. Parent with optional attachment.
6. Parent absent.
7. Parent omitted.
8. Parent archived.
9. Parent moved.
10. Parent duration changed.
11. Parent removed/recreated.
12. Split-shift parent.
13. Overnight parent.
14. Attached activity crossing calendar midnight.
15. Relationship retired.
16. Attached activity detached.
17. Attached activity promoted independent.
18. Buffer-only parent.
19. Buffer + attached activity.
20. Required attachment cannot fit.
21. Optional attachment cannot fit.
22. Existing authorized composite becomes infeasible.
23. Proposed discretionary composite does not fit.
24. Goal work core fits but overhead does not.
25. Goal work with zero overhead.
26. Goal work with Buffer overhead.
27. Shared Goal context without Goal-link propagation.
28. Explicit support/Goal attribution if allowed.
29. Composite move accepted.
30. Composite move partially stale.
31. Parent omitted after historical publication.
32. Attached execution shorter than planned.
33. Attached execution longer than planned.
34. Parent finishes early.
35. Optional attachment skipped.
36. Required attachment skipped in execution.
37. Found Time derived from component variance.
38. Found Time still needed by later required component.
39. Suggested attachment rejected.
40. Suggested attachment modified and accepted.
41. Backup/restore of active composition.
42. Historical composition after current restructuring.
43. Flat independent Commitment remains unaffected.
44. `beforeWork` independent preference remains valid without becoming attachment.
45. Goal Structure remains semantically independent.
46. Proposal consumes composite feasibility without inventing composition.

Resolve contradictions before completion.

---

## 112. Implementation Constraints

A conforming future implementation must:

1. preserve independent Commitments;
2. keep composition optional;
3. preserve Goal Structure separation;
4. use explicit Attachment Relationship authority;
5. preserve relation identity/revision;
6. use incarnation-safe endpoints;
7. deterministically pair occurrences;
8. avoid first/last Work heuristic as attachment authority;
9. distinguish Attached Activity from Buffer;
10. distinguish Attached Activity from Sub-step;
11. distinguish requiredness from priority;
12. derive applicability from parent without recurrence drift;
13. preserve bounded exceptions;
14. preserve relational timing through parent changes;
15. keep Buffers non-executable;
16. give real Attached Activities unique occurrences;
17. compute composite footprint without double counting;
18. preserve unresolved required liability;
19. compute composite feasibility before treating parent bundle as fully realizable;
20. distinguish optional component failure from required failure;
21. distinguish Composition Failure from ordinary Friction;
22. create corrective Friction for already-authorized composition failures where appropriate;
23. support atomic composite decisions;
24. prevent partial stale decision replay;
25. prevent occurrence-level choices from silently changing recurring authority;
26. preserve Goal attribution boundaries;
27. preserve Goal Demand vs overhead distinction;
28. make Feasibility account for full required Capacity footprint;
29. prevent Proposal from recommending impossible composites;
30. preserve explicit acceptance before new recurring attachments become authority;
31. preserve historical relation provenance;
32. keep execution records unique per real activity;
33. preserve planned-vs-actual duration;
34. derive Found-Time candidates without rewriting plan;
35. prevent Found Time from double counting time needed by remaining components;
36. preserve canonical user-day semantics;
37. version persistence/backup/restore;
38. prevent source recreation from retargeting relations;
39. ensure deterministic canonicalization and fingerprints;
40. keep scope bounded to operational time composition rather than generic workflow management.

Do not implement these constraints during this task.

---

## 113. Downstream Open Questions

After resolving fundamental composition semantics, identify only genuinely downstream questions.

Potential downstream questions:

* exact UI for adding attached activities;
* visual representation in Planner;
* drag/drop composition editing;
* wording for required/optional;
* authoring defaults;
* detailed Friction copy;
* exact storage host;
* migration sequencing;
* performance/caching;
* native timer;
* Live execution controls;
* route-aware travel estimation;
* automatic commute-duration suggestions;
* travel provider integrations;
* advanced conditional applicability;
* Summary visualization;
* Proposal explanation presentation.

Do not leave fundamental questions about:

* identity;
* time ownership;
* requiredness;
* pairing;
* recurrence/applicability;
* relative timing;
* Capacity;
* Goal Demand overhead;
* feasibility;
* Friction;
* history;
* user authority;

unresolved by labeling them downstream.

---

## 114. Recommended Next-Step Gate

Select exactly one primary recommendation.

### Path A — Constructive Proposal Architecture Audit

Choose if Commitment Composition fundamentals are fully specified and no remaining upstream architectural seam prevents Proposal analysis.

### Path B — Goal Demand / Composite Footprint Reconciliation Audit

Choose only if the specification exposes a contradiction between Goal Demand accounting and required composition overhead that cannot be normatively resolved here.

### Path C — Capacity / Composite Liability Reconciliation Audit

Choose only if unresolved required Attachment liability conflicts with accepted Capacity architecture.

### Path D — Friction / Composite Decision Follow-Up Audit

Choose only if executable uncertainty around Friction or PlanDecision prevents normative closure.

### Path E — Execution / Found-Time Follow-Up Audit

Choose only if execution semantics must be resolved before Proposal architecture can be safely specified.

### Path F — Architecture Reconciliation

Choose if Commitment Composition cannot be made consistent with accepted Goal Structure, Capacity, Goal Demand, history, or user-authority architecture.

Explain the choice.

Do not begin the selected task.

Do not assign Phase 8.

Given the current architectural sequence, **Path A — Constructive Proposal Architecture Audit should be strongly considered if this specification successfully resolves composite footprint and Goal-Demand overhead semantics.**

---

## 115. Governance and Non-Goals

This specification must preserve:

1. **Commitments own authorized time.**
2. **Goals describe outcomes.**
3. **Goal Structure remains distinct from Commitment Composition.**
4. **Capacity remains derived.**
5. **Buffers may reduce Capacity without becoming activities.**
6. **Real Attached Activities remain distinguishable from Buffers.**
7. **Goal Demand remains a resource request, not time ownership.**
8. **Progress remains distinct from activity effort and overhead.**
9. **Allocation remains provisional.**
10. **Proposal remains constructive and non-authoritative.**
11. **Explicit acceptance precedes newly authored recurring time authority.**
12. **Friction remains corrective.**
13. **History remains immutable.**
14. **Execution records what happened rather than rewriting what was planned.**
15. **Found Time is derived from Live divergence and does not rewrite history.**
16. **Relative placement preference is not lifecycle coupling.**
17. **Current implementation remains evidence, not architecture merely because it exists.**
18. **No future implementation phase is established by this specification.**

This task must not:

* modify production code;
* modify tests;
* implement Attached Activities;
* implement Commitment Composition;
* add parent fields;
* add attachment fields;
* change buffers;
* change Work;
* change Sleep;
* change recurrence;
* change placement;
* change Capacity implementation;
* change Goal Demand implementation;
* change Allocation;
* implement Proposal;
* implement Found Time;
* change Friction implementation;
* change PlanDecision implementation;
* change execution implementation;
* change history implementation;
* change Summary;
* change persistence;
* change backup/restore;
* create migrations;
* change UI;
* implement travel estimation;
* implement timers;
* create generic workflows;
* modify existing architecture documents;
* modify existing audit documents;
* create Phase 8;
* assign work to another implementation phase.

This task is read-only with respect to the existing repository.

**The required specification result artifact is the sole permitted repository write.**

---

## 116. Required Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/architecture/COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_SPECIFICATION_RESULT.md`

The filename must contain `RESULT` because it is the durable Codex output produced by this specification task.

Do not substitute another filename or path.

The result must include, at minimum:

1. **Executive Specification**
2. **Architectural Context**
3. **Epistemic Model**
4. **Commitment Composition Definition**
5. **Attached Activity**
6. **Buffer**
7. **Attached Activity vs Buffer**
8. **Attached Activity vs Independent Commitment**
9. **Sub-step Boundary**
10. **Parent Commitment**
11. **Type Model**
12. **Attachment Relationship**
13. **Relationship Identity / Lifetime**
14. **Endpoint Identity**
15. **Source-Level vs Occurrence-Level Authority**
16. **Occurrence Pairing**
17. **Multi-Occurrence Parent Days**
18. **Applicability**
19. **Recurrence Inheritance**
20. **Duration**
21. **Relative Timing**
22. **Constraint vs Preference**
23. **Gap / Buffer Semantics**
24. **Existing Work-Relative Placement Compatibility**
25. **Required / Optional Attachment**
26. **Parent Lifecycle**
27. **Parent Omission / Cancellation**
28. **Parent Movement**
29. **Parent Duration Change**
30. **Occurrence Exceptions**
31. **Detachment / Promotion**
32. **Composite Commitment**
33. **Composite Occurrence**
34. **Composite Identity**
35. **Composite Footprint**
36. **Time Ownership**
37. **Capacity Boundary**
38. **Composite Liability**
39. **Composite Feasibility**
40. **Partial Composite Realization**
41. **Composition Failure**
42. **Friction Boundary**
43. **Composite Friction**
44. **Suggested Fixes**
45. **Atomic Composite Decisions**
46. **Decision Replay / Scope**
47. **Goal Link Boundary**
48. **Goal Demand Overhead**
49. **Goal Demand Conservation**
50. **Goal-Specific Feasibility Boundary**
51. **Allocation Boundary**
52. **Proposal Boundary**
53. **Existing Commitment vs Proposed Goal Work**
54. **Accepted Allocation / Scheduled Goal Work**
55. **Buffer Accounting Around Goal Work**
56. **Historical Provenance**
57. **Historical Restructuring**
58. **Execution**
59. **Actual Duration**
60. **Found Time**
61. **Planned-Relative vs Actual-Relative Attachments**
62. **Live Rescheduling Boundary**
63. **Summary / Reporting**
64. **Direct vs Composite Views**
65. **Goal Reporting**
66. **Buffer Reporting**
67. **Persistence**
68. **Backup / Restore**
69. **Import / Replacement**
70. **Deletion / Retirement**
71. **Goal-Link Propagation**
72. **Suggested Attached Activities**
73. **Direct User Authoring**
74. **Structural Modification**
75. **Staleness**
76. **Composition Fingerprint**
77. **Determinism**
78. **Canonical User-Day Semantics**
79. **Cross-User-Day Components**
80. **Ordering**
81. **Scope Limitation**
82. **Selected Composition Models**
83. **Normative Worked Examples**
84. **Commitment Composition Invariants**
85. **Architecture Decisions**
86. **Relationship Matrix**
87. **Boundary Matrix**
88. **Applicability Matrix**
89. **Timing Matrix**
90. **Lifecycle Matrix**
91. **Capacity / Footprint Matrix**
92. **Goal-Demand Overhead Matrix**
93. **Feasibility Matrix**
94. **Decision Matrix**
95. **Execution Matrix**
96. **Authority Matrix**
97. **Transition Matrix**
98. **Primitive Compatibility Matrix**
99. **Specification Consistency Checks**
100. **Implementation Constraints**
101. **Downstream Open Questions**
102. **Specification Conclusions**
103. **Recommended Next Step**
104. **Completion Statement**

After writing:

1. verify the artifact exists at the exact required path;
2. reopen and read it;
3. verify every required section is complete;
4. verify all twenty normative worked examples are resolved;
5. verify all required invariants are present;
6. verify every required `CC-SPEC-*` decision exists;
7. verify every required matrix is complete;
8. verify all forty-six consistency checks are explicitly resolved;
9. verify exactly one recommended next-step path is selected;
10. inspect repository status;
11. verify no repository file other than the required result artifact was modified.

Do not merely print the specification in Codex's response.

The durable specification artifact is required.

---

## 117. Validation

This is an architecture-specification task.

Do not add or modify tests.

The completed audit already validated current executable behavior with:

* **13 focused test files**
* **155 tests passed**
* **0 failed**

Reuse that evidence where sufficient.

Additional existing tests may be run only when needed to resolve a specific implementation fact encountered while specifying architecture.

If additional tests are run, report:

* exact test files;
* total tests;
* passed;
* failed;
* why they were necessary.

The specification must not make unsupported claims about current executable behavior.

---

## 118. Completion Criteria

The specification is complete only when:

* [ ] Commitment Composition has a normative definition.
* [ ] Attached Activity has a normative definition.
* [ ] Buffer has a normative definition.
* [ ] Attached Activity vs Buffer is resolved.
* [ ] Attached Activity vs Independent Commitment is resolved.
* [ ] Sub-step is either defined or explicitly excluded.
* [ ] Parent Commitment role is defined.
* [ ] Type model is selected.
* [ ] Attachment Relationship is defined.
* [ ] Relationship identity/lifecycle is defined.
* [ ] Endpoint identity is defined.
* [ ] Source-level vs occurrence-level authority is resolved.
* [ ] Parent-occurrence pairing is deterministic.
* [ ] Multi-occurrence parent behavior is resolved.
* [ ] Applicability semantics are defined.
* [ ] Recurrence inheritance model is selected.
* [ ] Duration semantics are defined.
* [ ] Relative timing vocabulary is selected.
* [ ] Constraint vs preference is resolved.
* [ ] Gap vs Buffer semantics are resolved.
* [ ] Existing beforeWork/afterWork future role is defined.
* [ ] Required/optional semantics are defined.
* [ ] Parent lifecycle semantics are defined.
* [ ] Parent omission/cancellation behavior is defined.
* [ ] Parent movement behavior is defined.
* [ ] Parent duration-change behavior is defined.
* [ ] Occurrence exception semantics are defined.
* [ ] Detachment/promotion is resolved.
* [ ] Composite Commitment is accepted, rejected, or defined as derived concept.
* [ ] Composite Occurrence is accepted or rejected.
* [ ] Composite identity is accepted or rejected.
* [ ] Composite Footprint is defined.
* [ ] Time ownership semantics are explicit.
* [ ] Capacity boundary is defined.
* [ ] Required composite liability is resolved.
* [ ] Composite Feasibility is defined.
* [ ] Partial realization semantics are defined.
* [ ] Composition Failure is accepted/rejected and defined.
* [ ] Friction boundary is explicit.
* [ ] Composite Friction requirements are defined.
* [ ] Suggested-fix semantics are bounded.
* [ ] Atomic composite decision authority is selected.
* [ ] Replay and staleness requirements are defined.
* [ ] Decision scope vs recurring authority is explicit.
* [ ] Goal-link propagation model is selected.
* [ ] Goal-Demand overhead model is selected.
* [ ] Goal-Demand conservation is explicit.
* [ ] Goal-Specific Feasibility handoff is defined.
* [ ] Allocation handoff is defined.
* [ ] Proposal handoff is defined.
* [ ] Existing recurring Commitment vs proposed Goal work is resolved.
* [ ] Accepted Allocation authority over attachments is resolved.
* [ ] Scheduled Goal Work/support activity classification is resolved.
* [ ] Buffer accounting around Goal work is resolved.
* [ ] Historical attachment provenance is defined.
* [ ] Historical restructuring is resolved.
* [ ] Execution semantics are defined.
* [ ] Planned-vs-actual duration semantics are defined.
* [ ] Actual-relative vs plan-relative behavior is resolved.
* [ ] Found-Time boundary is explicit.
* [ ] Remaining composite obligations are protected from false Found Time.
* [ ] Live rescheduling authority is bounded.
* [ ] Summary/reporting semantics are defined.
* [ ] Direct vs composite reporting is defined.
* [ ] Goal reporting boundaries are defined.
* [ ] Buffer reporting is defined.
* [ ] Persistence authority is defined.
* [ ] Backup/restore requirements are defined.
* [ ] Import/replacement requirements are defined.
* [ ] Deletion/retirement semantics are defined.
* [ ] Suggested attachment authority is defined.
* [ ] Direct authoring is defined.
* [ ] Structural modification semantics are defined.
* [ ] Staleness rules are defined.
* [ ] Composition fingerprint is accepted or explicitly rejected.
* [ ] Determinism requirements are defined.
* [ ] Canonical user-day semantics are preserved.
* [ ] Cross-user-day component ownership is resolved.
* [ ] Ordering semantics are separated.
* [ ] Scope is explicitly bounded against generic workflow management.
* [ ] Attachment source model is selected.
* [ ] Applicability model is selected.
* [ ] Timing model is selected.
* [ ] Requiredness model is selected.
* [ ] Composite authority model is selected.
* [ ] Decision model is selected.
* [ ] Goal-Demand overhead model is selected.
* [ ] All twenty normative worked examples are resolved.
* [ ] Normative invariant set is complete.
* [ ] `CC-SPEC-*` decisions cover every required decision area.
* [ ] Relationship Matrix is complete.
* [ ] Boundary Matrix is complete.
* [ ] Applicability Matrix is complete.
* [ ] Timing Matrix is complete.
* [ ] Lifecycle Matrix is complete.
* [ ] Capacity / Footprint Matrix is complete.
* [ ] Goal-Demand Overhead Matrix is complete.
* [ ] Feasibility Matrix is complete.
* [ ] Decision Matrix is complete.
* [ ] Execution Matrix is complete.
* [ ] Authority Matrix is complete.
* [ ] Transition Matrix is complete.
* [ ] Primitive Compatibility Matrix is complete.
* [ ] All forty-six consistency checks are resolved.
* [ ] Implementation constraints are explicit.
* [ ] Only genuinely downstream questions remain open.
* [ ] Exactly one recommended next-step path is selected.
* [ ] No implementation was performed.
* [ ] No tests were modified.
* [ ] No existing architecture document was modified.
* [ ] No existing audit document was modified.
* [ ] No future implementation phase was established.
* [ ] `COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_SPECIFICATION_RESULT.md` was written to the exact required path.
* [ ] The result artifact was reopened and verified.
* [ ] Repository status was inspected.
* [ ] The required specification result artifact was the sole repository write.
* [ ] Codex reports the exact artifact path.
* [ ] Codex reports validation performed.
* [ ] Codex reports whether any other repository files changed.

---

## 119. Final Completion Statement

End `COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_SPECIFICATION_RESULT.md` with exactly:

> **Commitment Composition / Attached Activities Architecture Specification complete.**
>
> The specification establishes Commitment Composition as an explicit authority over parent-linked time-owning activities and protected non-activity time; defines Attached Activities, Buffers, Attachment Relationships, source and occurrence pairing, applicability, relative timing, requiredness, lifecycle coupling, composite occurrences, footprint, liability, feasibility, Composition Failure, Friction, composite decisions, Goal Demand overhead, historical provenance, execution variance, Found-Time boundaries, deterministic user-day behavior, persistence, and user-authority semantics; preserves the separation among Goals, Goal Structure, Commitments, Capacity, Goal Demand, Progress, Allocation, Proposal, Friction, scheduled reality, execution, and history; prevents relative placement heuristics, Buffers, or independent recurrence from masquerading as lifecycle-coupled composition; ensures required activity overhead is visible to Capacity and Proposal feasibility without becoming Goal Progress; and identifies the appropriate next architectural step without modifying implementation or assigning the work to a future implementation phase.

The final Codex response must state:

> **Saved artifact:** `/home/sid/Penn Digital Services/DayFrame/docs/architecture/COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_SPECIFICATION_RESULT.md`
>
> **Repository modifications:** The required specification result artifact was the sole repository write.
>
> **Validation:** Report reused audit evidence and any additional existing tests executed.
>
> **Recommended next step:** Report the selected Path A, B, C, D, E, or F without beginning that work.
