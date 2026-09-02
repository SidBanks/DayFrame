# Capacity Follow-Up Specification 01 — Capacity Architecture Specification

## Status

Ready for specification.

## Phase

Post-Phase 7 Architectural Follow-Up

## Task Type

Authoritative architecture-specification task converting the accepted findings of the Capacity Semantic and Read-Model Architecture Audit into a formal DayFrame Capacity contract. This task must define Capacity's domain semantics, authority model, derivation boundary, canonical temporal representation, result and coverage states, unresolved-Commitment treatment, provenance requirements, dependency and staleness semantics, aggregation rules, downstream Goal-demand interface, Proposal and Friction boundaries, historical boundary, and implementation constraints. It may inspect the existing repository and run focused existing tests where necessary to verify compatibility, but it must not implement Capacity, redesign Goals, create allocation or Proposal behavior, modify production code, modify tests, or establish a future implementation phase.

The required specification result artifact is the sole permitted repository write.

---

## 1. Objective

Produce the authoritative architecture specification for **Capacity** in DayFrame.

The preceding Capacity Semantic and Read-Model Architecture Audit established that the implementation contains meaningful temporal and scheduling primitives but no coherent Capacity domain model.

It recommended:

> **Path A — Capacity Architecture Specification**

and established the following core definition:

> **Capacity is a deterministic, explainable collection of user-day-owned intervals eligible for discretionary allocation after DayFrame accounts for applicable time-owning Commitments, unresolved Commitment liabilities, mandatory constraints, protective buffers, accepted planning decisions, and general availability policy. Its duration and fragmentation are derived characteristics. Capacity remains descriptive and non-authoritative: it neither creates Goal demand nor chooses, recommends, or authorizes an allocation.**

This task must transform that architectural conclusion into a specification precise enough that a future implementation-alignment task can determine exactly:

* what Capacity is;
* what inputs Capacity consumes;
* what Capacity derivation is responsible for;
* what Capacity derivation must not do;
* what a Capacity result contains;
* what makes a Capacity result valid, qualified, partial, stale, protected, or otherwise non-allocatable;
* how unresolved authored demand affects Capacity;
* how Capacity preserves DayFrame user-day semantics;
* how Capacity remains deterministic and explainable;
* how downstream Goal-demand and allocation systems consume Capacity without interpreting scheduler internals;
* and how future implementation can be tested for architectural compliance.

The specification must resolve architecture-level ambiguity.

It must **not** implement the specification.

---

## 2. Architectural Context

The approved DayFrame planning model is:

> **Commitments own time. Goals compete for Capacity. DayFrame proposes. The user decides. DayFrame schedules what the user has authorized.**

The intended constructive planning lifecycle is:

**Commitments + Constraints → Capacity → Goal Demand → Allocation → Proposal → User Decision → Accepted Allocation → Scheduled Work → Execution → Progress → Summary**

Capacity occupies a specific epistemic position in that lifecycle.

It is:

* downstream from authored scheduling authority;
* downstream from accepted scheduling decisions;
* downstream from temporal interpretation;
* upstream from Goal-specific demand;
* upstream from allocation;
* upstream from Proposal;
* non-authoritative;
* derived;
* deterministic;
* explainable.

The architecture must preserve the following epistemic distinctions:

### Authored Truth

Facts and intent explicitly established by the user.

### Derived Truth

Deterministic conclusions calculated from authoritative state.

Capacity belongs here.

### Proposed Action

Engine-generated recommendations for using available Capacity.

Capacity does not belong here.

### Accepted Decision

User authorization of a proposed or manually selected planning action.

Capacity does not itself constitute acceptance.

### Scheduled Reality

Authorized activity placed into time.

### Executed Reality

What actually occurred.

Capacity must never silently cross from **derived truth** into **proposed action**, **accepted decision**, or **scheduled reality**.

---

## 3. Authoritative Inputs

Define the exact architectural classes of information from which current Capacity may be derived.

At minimum evaluate and specify the role of:

* Work;
* generated Work occurrences;
* Sleep where represented as time-owning intent;
* fixed recurring Commitments;
* movable recurring Commitments;
* manual events;
* buffers;
* relational constraints;
* effective scheduling preferences;
* accepted PlanDecisions;
* source incarnation;
* user-day boundary;
* cycle/segment overrides;
* general availability policy;
* planning-range boundaries;
* unresolved time-owning Commitment demand.

The specification must distinguish three input roles.

### 3.1 Time-Owning Inputs

These represent user-authorized demand for time.

### 3.2 Time-Constraining Inputs

These affect whether an interval may be offered for discretionary allocation without themselves becoming activities.

### 3.3 Temporal / Authority Inputs

These determine:

* which user-day an interval belongs to;
* which authored source lifetime is authoritative;
* which accepted decisions apply;
* which planning policies govern the derivation.

Produce a normative input matrix:

| Input Class | Owns Time? | Constrains Time? | Authority Source | Capacity Effect | Required Provenance |
| ----------- | ---------: | ---------------: | ---------------- | --------------- | ------------------- |

Do not require a unified Commitment implementation merely to make the specification conceptually cleaner.

If current DayFrame must initially supply Capacity from several source families, define the architectural contract those families must satisfy.

---

## 4. Capacity Derivation Model

Specify the conceptual derivation pipeline.

The audit recommended a layered model broadly equivalent to:

**Authoritative temporal envelope
→ occupied time
→ protected time
→ geometric openings
→ general eligibility
→ unresolved-liability qualification
→ Capacity**

Refine this into a normative derivation contract.

The specification must determine:

1. what establishes the temporal envelope;
2. what subtracts occupied time;
3. what excludes protectively unavailable time;
4. how overlapping exclusions behave;
5. what general eligibility means;
6. when an opening becomes Capacity;
7. how unresolved authored demand affects the result;
8. whether derivation may produce partial Capacity;
9. how derivation behaves when required authoritative inputs are invalid or incomplete;
10. how planning-range clipping affects result truth.

The specification may allow an implementation to optimize or fuse computational stages.

It must nevertheless preserve the semantic distinctions necessary for:

* explanation;
* deterministic testing;
* downstream responsibility boundaries.

Do not prescribe a specific algorithm unless architectural correctness requires it.

---

## 5. Capacity Definition and Non-Definitions

Adopt, refine, or replace the audit's recommended definition.

The specification must contain one normative definition suitable for future inclusion in the DayFrame glossary and architecture documentation.

It must explicitly establish that Capacity is not synonymous with:

* chronological free time;
* geometric openings;
* candidate-specific placement openings;
* candidate feasibility;
* Goal-specific feasibility;
* Goal demand;
* Goal priority;
* allocation;
* Proposal;
* accepted choice;
* scheduled work;
* execution;
* Friction.

Define any necessary supporting terminology.

At minimum determine the architectural status of:

* **Chronological Free Time**
* **Geometric Opening**
* **Capacity**
* **Feasible Opportunity**
* **Goal-Specific Feasibility**
* **Allocatable Capacity**

For each, classify it as one of:

* canonical domain concept;
* derived evaluation concept;
* internal derivation concept;
* qualification/state;
* unnecessary terminology.

Do not create separate domain entities merely because terminology appeared in the audit.

---

## 6. Canonical Capacity Unit

Specify the smallest canonical unit of Capacity.

The audit recommended:

> **A Capacity interval owned by exactly one canonical DayFrame user-day.**

Evaluate and formalize this recommendation.

A canonical Capacity unit must preserve enough information to establish:

* exact start;
* exact end;
* duration;
* user-day ownership;
* planning-range coverage;
* derivation identity;
* provenance;
* eligibility/qualification;
* freshness.

Determine whether interval identity itself must be stable across equivalent derivations and, if so, what semantic facts may contribute to that identity.

Do not define a TypeScript interface.

Define the architecture-level contract that a future implementation schema must satisfy.

---

## 7. User-Day and Temporal Semantics

Capacity must use DayFrame temporal semantics rather than naïve calendar dates.

Specify normative behavior for:

* custom user-day boundaries;
* times before the boundary;
* overnight Work;
* Work spanning midnight;
* variable effective boundaries;
* cycle/segment boundary overrides;
* user-days whose effective duration is not exactly 24 hours;
* planning ranges beginning or ending inside a user-day;
* aggregation across multiple user-days.

Establish whether this audit conclusion becomes normative:

> **Every Capacity interval belongs to exactly one canonical user-day window resolved under the effective scheduling preferences for that user-day.**

Determine whether Capacity intervals may cross a user-day boundary.

If not, specify how an otherwise continuous opening spanning that boundary is represented.

Ensure the contract supports existing irregular and overnight scheduling behavior without reverting to calendar-day assumptions.

---

## 8. Occupied Time, Protected Time, and Buffers

Specify the distinction among:

### Occupied Time

Time owned by an authorized occurrence.

### Protected Time

Time intentionally unavailable for discretionary allocation but not itself represented as an activity.

### Capacity

Eligible discretionary planning resource remaining after applicable exclusions.

Define normative buffer behavior.

At minimum specify:

* before-buffers;
* after-buffers;
* overlapping buffers;
* overlapping buffer and occupied intervals;
* buffers extending across user-day boundaries;
* buffers extending beyond the requested planning range;
* provenance when multiple sources contribute to the same protected interval.

Preserve the distinction between:

> **This time is occupied by something.**

and:

> **This time is protected from allocation.**

Do not turn anonymous buffers into execution-bearing activities.

Also preserve a future architectural path for meaningful attached activities such as commuting without designing that feature here.

---

## 9. Unresolved Commitment Liability

This is the principal unresolved semantic boundary identified by the Capacity audit.

Define:

> **Unresolved Commitment Liability**

or an equivalent normative concept.

The specification must answer:

> **What may DayFrame truthfully report as Capacity when the user has already authorized time-owning demand that has not yet been successfully placed?**

Evaluate at minimum:

### Option A — Entire Affected User-Day Becomes Non-Allocatable

Safe but potentially overly conservative.

### Option B — Conservative Partial Capacity

Only intervals provably independent of the unresolved demand may remain allocatable.

### Option C — Capacity Returned with Explicit Liability Qualification

Intervals may be shown descriptively but cannot be treated as fully allocatable until the liability is resolved.

### Option D — Another Evidence-Backed Model

If superior.

Choose a normative architecture.

The chosen model must prevent:

> **double-claiming time that has already been promised to an authored Commitment.**

Specify:

* scope of the liability;
* whether it is user-day-specific;
* whether it may span a range;
* how duration is represented;
* whether source identity is required;
* whether liability affects total Capacity;
* whether liability affects allocatable status;
* how downstream Goal allocation must interpret it.

Do not redesign Friction.

---

## 10. General Eligibility Policy

Define what may transform a geometric opening into or out of general Capacity before a particular Goal is considered.

Distinguish:

### Mandatory General Constraints

Rules applicable to all discretionary allocation.

### General Availability Policy

Explicit user-approved policy governing when discretionary planning may occur.

### Demand-Specific Constraints

Requirements belonging to a particular Goal or future Goal-demand object.

The specification must prevent demand-specific preferences from silently reducing general Capacity.

Evaluate examples such as:

* user never wants discretionary work during a defined interval;
* preserve-routine off-day policy;
* adapt-to-off-days policy;
* a particular Goal prefers evenings;
* a particular Goal requires 90 contiguous minutes;
* a Commitment must occur after Work.

Determine which belong in Capacity derivation and which belong downstream.

Do not design the complete preference or off-day-policy system.

Define only the responsibility boundary.

---

## 11. General Capacity and Goal-Specific Feasibility

Formalize the separation established by the audit:

> **General Capacity is demand-neutral. Goal-specific feasibility applies an explicit demand contract to Capacity without redefining Capacity.**

Specify what downstream feasibility is permitted to do.

It may eventually evaluate properties such as:

* required duration;
* minimum contiguous duration;
* time-of-day compatibility;
* recurrence requirements;
* splittability;
* work-relative requirements;
* other explicit demand constraints.

It must not mutate Capacity.

Specify what a feasibility result conceptually returns.

For example:

**Capacity Interval + Demand → Compatible Opportunity / No Compatible Opportunity**

Do not design the final Goal-demand schema.

The specification should define only enough of the consumer contract to prevent future Goal architecture from bypassing or redefining Capacity.

---

## 12. Capacity Dimensions and Aggregation

Specify which Capacity properties are canonical and which are derived summaries.

At minimum address:

* interval start/end;
* interval duration;
* total Capacity duration;
* longest contiguous interval;
* interval count;
* fragmentation;
* user-day;
* workday/off-day context;
* user-week aggregation;
* arbitrary planning-range aggregation;
* calendar-month presentation.

Preserve:

> **Capacity is not truthfully reducible to a single duration.**

Specify aggregation rules.

At minimum:

1. scalar totals must never replace interval topology;
2. aggregation across user-days must preserve user-day ownership;
3. aggregation must not merge intervals across canonical user-day boundaries merely because their timestamps touch;
4. partial range coverage must remain visible;
5. qualified or unresolved Capacity must not be silently included in fully allocatable totals;
6. summaries must be derivable from canonical interval results.

Determine whether a formal fragmentation score belongs in the architecture.

Prefer the simplest representation that preserves truth.

---

## 13. Capacity Result States

Define a normative result-state model.

The audit identified the need to distinguish results such as:

* available;
* partial;
* qualified;
* protected;
* unresolved;
* stale;
* unavailable.

Do not adopt these names automatically.

Determine the minimum set of states or orthogonal qualifications required to represent Capacity without ambiguity.

Evaluate whether one enum is sufficient or whether the architecture needs separate dimensions such as:

### Freshness

* current;
* stale.

### Coverage

* complete;
* partial;
* unavailable.

### Allocability

* allocatable;
* qualified;
* blocked.

### Liability

* resolved;
* unresolved.

The specification should avoid a combinatorial state machine if orthogonal qualifications communicate the truth more cleanly.

For every chosen state or qualification define:

* semantic meaning;
* triggering condition;
* whether intervals may still be returned;
* whether totals may be calculated;
* whether downstream Goal allocation may consume the result;
* whether user-facing explanation is required.

---

## 14. Capacity Read-Model Contract

Define the minimum architecture-level information returned by a Capacity query.

Evaluate at minimum:

* query/planning-range identity;
* coverage boundaries;
* coverage completeness;
* canonical user-day identity;
* exact user-day window;
* Capacity interval identity;
* interval start/end;
* interval duration;
* derived user-day totals;
* longest contiguous interval;
* interval count;
* workday/off-day context where relevant;
* protected/excluded interval provenance;
* unresolved Commitment liabilities;
* authoritative dependency identity;
* accepted-decision dependencies;
* derivation policy/version;
* freshness;
* allocability/qualification state.

Produce:

| Information | Required / Optional / Excluded | Semantic Purpose | Authority / Derivation Source |
| ----------- | ------------------------------ | ---------------- | ----------------------------- |

Explicitly exclude information that belongs to:

* Goal demand;
* Goal ranking;
* Goal priority;
* allocation;
* Proposal;
* acceptance;
* execution.

Do not define implementation types.

---

## 15. Capacity Query Semantics

Specify the conceptual query contract for retrieving Capacity.

Determine whether Capacity may be requested for:

* one user-day;
* selected day;
* user-week;
* arbitrary range;
* planning range;
* calendar month.

Specify:

* required query inputs;
* default temporal interpretation;
* handling of ranges not aligned to user-day boundaries;
* handling of ranges containing different effective scheduling preferences;
* whether results must include canonical component user-days;
* how partial coverage is represented;
* how stale or invalid dependencies affect the response.

The query contract must not require the caller to understand private scheduler placement helpers.

Do not define API syntax.

---

## 16. Authority and Persistence Model

Formalize the audit recommendation:

> **Current Capacity is derived. Historical Capacity context may be selectively frozen when required to preserve the provenance of an accepted planning decision.**

Specify:

### Current Capacity

* non-authoritative;
* derived;
* deterministic;
* reproducible from authoritative dependencies;
* disposable;
* not independently editable;
* not independently backed up as authored state.

### Historical Capacity Context

Determine when a bounded immutable snapshot may eventually be appropriate.

Possible triggers include:

* accepted allocation;
* accepted Proposal;
* historical-plan publication;
* another explicit authority transition.

Do not finalize Proposal persistence architecture here.

Instead specify:

> **Capacity snapshots become historical evidence only when another authoritative event requires preservation of the Capacity context that informed it.**

Clarify that a historical Capacity snapshot:

* does not become current Capacity;
* does not become authored intent;
* does not update when current scheduling state changes;
* exists for provenance and historical interpretation.

---

## 17. Dependency Identity and Derivation Version

Capacity must be reproducible and explainable.

Define the architectural requirement for identifying the authoritative state from which a Capacity result was derived.

Evaluate the need for:

* source IDs;
* source incarnations;
* source revisions or equivalent mutable-state fingerprints;
* applicable PlanDecision identity;
* effective scheduling preferences;
* planning-range identity;
* user-day-boundary resolution;
* general eligibility policy identity;
* derivation-policy version.

The audit established:

> **Source incarnation is necessary but insufficient because it protects source lifetime while same-lifetime edits can still change Capacity.**

Formalize the concept of a Capacity dependency fingerprint or equivalent.

Do not prescribe hashing technology.

Specify what semantic changes must cause the dependency identity to change.

Also define the purpose of a derivation-policy version:

> identical authoritative data interpreted under materially different Capacity rules must not masquerade as the same derivation.

---

## 18. Staleness and Invalidation

Define when an existing Capacity result becomes stale.

At minimum address:

* shift-definition changes;
* cycle changes;
* segment changes;
* recurrence changes;
* Commitment creation;
* Commitment deletion;
* Commitment recreation;
* Commitment duration changes;
* fixed-time changes;
* relational-rule changes;
* manual-event changes;
* buffer changes;
* user-day-boundary changes;
* effective scheduling-preference changes;
* applicable PlanDecision changes;
* source-incarnation changes;
* general availability policy changes;
* Capacity derivation-policy changes.

Distinguish:

> **A dependency changed, therefore this result is stale.**

from:

> **A current query recomputed Capacity from the new dependencies.**

Determine whether staleness is fundamentally:

* global;
* planning-range-scoped;
* user-day-scoped;
* dependency-scoped.

Prefer the narrowest semantics that remain deterministic and truthful.

Current Preview staleness may be used as an implementation precedent but must not automatically define Capacity semantics.

---

## 19. Provenance and Explainability

Specify the information required to answer questions such as:

> **Why do I have three hours of Capacity on Tuesday?**

> **Why is this interval unavailable?**

> **Why did my Capacity change after I edited Work?**

> **Why is this time protected even though nothing appears scheduled there?**

> **Why can't this Capacity currently be allocated?**

Capacity provenance must be able to distinguish:

* occupied time;
* protected time;
* unresolved authored demand;
* general policy exclusion;
* user-day boundary effects;
* planning-range clipping;
* accepted-decision effects;
* source-lifetime changes;
* derivation-policy changes.

Define minimum provenance categories.

Determine what may be referenced versus what must be frozen into the result itself.

Do not design the user-facing explanation UI.

Preserve:

> **Derived truth must remain explainable from the authoritative facts and transformation rules that produced it.**

---

## 20. Capacity → Goal Demand Contract

Define the exact responsibility boundary between Capacity and future Goal demand.

Capacity should provide a stable planning-resource contract so Goal-demand logic does not need to inspect:

* Work-generation internals;
* recurrence-expansion internals;
* manual-event internals;
* buffer geometry;
* PlanDecision replay;
* source-incarnation mechanics;
* user-day-boundary calculations.

Specify the minimum information Goal-demand feasibility may consume.

Capacity must not provide:

* Goal priority;
* recommended Goal;
* preferred Goal allocation;
* Goal ranking;
* Proposal text;
* accepted schedule;
* inferred user intent.

Preserve:

> **Capacity describes what planning resources exist. Goal demand describes what a Goal would need from those resources.**

---

## 21. Capacity → Allocation → Proposal Boundary

Formalize the downstream architecture:

**Capacity
→ Goal-Specific Feasibility
→ Competing Demand
→ Allocation Reasoning
→ Proposal
→ User Decision**

Capacity does not:

* compare Goal importance;
* resolve competing Goals;
* choose how much Capacity a Goal receives;
* construct a recommended schedule;
* authorize discretionary work.

Allocation may reason over Capacity.

Proposal may recommend a use of Capacity.

Only user acceptance may convert a Proposal into authorized planning intent.

Preserve:

> **DayFrame may learn what the user tends to choose without pretending it knows what the user chooses today.**

Do not design allocation or Proposal implementation.

---

## 22. Capacity vs Friction Boundary

Formalize:

> **Capacity is descriptive. Friction is corrective.**

Specify the classification of at least these cases:

1. User has little Capacity.
2. User has fragmented Capacity.
3. A Goal demand cannot fit available Capacity.
4. Several Goals collectively demand more than Capacity.
5. An authored Commitment cannot be placed.
6. An accepted allocation later becomes infeasible.
7. A Capacity result is stale.
8. Capacity cannot be fully determined because of unresolved Commitment liability.

Determine which are:

* Capacity facts;
* feasibility results;
* allocation problems;
* Friction;
* stale/invalid derivations.

Do not alter existing Friction implementation.

The specification must prevent future Capacity work from generating Friction merely because the user has limited discretionary resources.

---

## 23. Historical and Summary Boundary

Specify the architectural meaning of historical Capacity without redesigning Summary.

Evaluate future analytical concepts such as:

* available Capacity at planning time;
* Capacity offered for allocation;
* Capacity allocated;
* Capacity left unallocated;
* scheduled discretionary work;
* executed discretionary work;
* historical Capacity trends.

Define which are:

* current derived state;
* accepted-plan provenance;
* historical facts;
* analytical projections.

Preserve immutable history.

Do not assume current Capacity can safely reconstruct historical Capacity after authoritative scheduling state changes.

Do not require every Capacity read to be persisted.

---

## 24. Existing Primitive Compatibility

Use the completed Capacity audit's primitive-reuse findings as the baseline.

Verify only where necessary that the specification remains compatible with:

* user-day calculations;
* canonical user-day windows;
* effective scheduling preferences;
* planning-window expansion;
* occupied-window calculations;
* open-window complement;
* buffer expansion;
* candidate feasibility;
* recurrence expansion;
* Work generation;
* manual-event representation;
* PlanDecision replay;
* Preview staleness;
* source incarnation;
* historical-plan publication.

Classify any specification requirement that would require future implementation work as:

* **Existing primitive sufficient**
* **Existing primitive requires adaptation**
* **New Capacity-specific primitive required**
* **Downstream responsibility — not Capacity**

Produce:

| Specification Requirement | Current Support | Future Requirement | Capacity Responsibility? | Evidence |
| ------------------------- | --------------- | ------------------ | -----------------------: | -------- |

Do not change implementation.

---

## 25. Required Semantic Examples

The specification must contain normative examples demonstrating its rules.

Include at minimum:

### Example A — Ordinary Workday

Show occupied Commitments, protected buffers, and resulting Capacity intervals.

### Example B — Fragmented Capacity

Show why 90 total minutes across three 30-minute intervals is not equivalent to one 90-minute opportunity.

### Example C — Goal-Specific Incompatibility

Show general Capacity remaining valid when a particular Goal cannot use it.

### Example D — Overnight Shift

Show correct Capacity ownership using a non-midnight user-day boundary.

### Example E — Buffer Protection

Show chronological free time exceeding Capacity.

### Example F — Unresolved Commitment Liability

Show why raw openings cannot be advertised as fully allocatable Capacity when authorized Commitment demand remains unplaced.

### Example G — Off-Day Policy Boundary

Show how an explicitly selected general policy may affect Capacity while an unselected policy must not be silently invented.

Examples must demonstrate normative behavior rather than merely illustrate possibilities.

---

## 26. Capacity Invariants

The specification must establish a final normative Capacity invariant set.

Begin with the audit's evaluated invariants:

### CAP-INV-01

**Capacity is derived rather than authored.**

### CAP-INV-02

**Time-owning Commitments and universally applicable constraints shape general Capacity.**

### CAP-INV-03

**Capacity is not synonymous with chronological free time.**

### CAP-INV-04

**Capacity is not synonymous with candidate-specific placement openings.**

### CAP-INV-05

**Goals do not create Capacity.**

### CAP-INV-06

**Capacity does not decide which Goal receives time.**

### CAP-INV-07

**General Capacity can exist even when a particular Goal cannot use it.**

### CAP-INV-08

**Every Capacity interval belongs to an exact canonical DayFrame user-day window.**

### CAP-INV-09

**Capacity derivation is deterministic for identical authoritative dependencies and derivation policy.**

### CAP-INV-10

**Capacity is explainable from its authoritative dependencies and transformation rules.**

### CAP-INV-11

**Changes to relevant authoritative dependencies invalidate affected Capacity results.**

### CAP-INV-12

**Capacity remains distinct from Proposal.**

### CAP-INV-13

**Capacity remains distinct from Friction.**

Add or refine invariants where the specification resolves:

* unresolved Commitment liability;
* partial coverage;
* aggregation;
* historical snapshots;
* protected versus occupied time;
* downstream immutability.

Every invariant must be written normatively enough to support future tests.

---

## 27. Architecture Decisions

Produce explicit specification decisions for at least:

### CAP-SPEC-01 — Normative Capacity Definition

### CAP-SPEC-02 — Canonical Capacity Unit

### CAP-SPEC-03 — Derivation Pipeline

### CAP-SPEC-04 — Time-Ownership Boundary

### CAP-SPEC-05 — Protected-Time Boundary

### CAP-SPEC-06 — Unresolved Commitment Liability

### CAP-SPEC-07 — General Eligibility Boundary

### CAP-SPEC-08 — General Capacity vs Goal-Specific Feasibility

### CAP-SPEC-09 — Temporal and User-Day Semantics

### CAP-SPEC-10 — Aggregation Semantics

### CAP-SPEC-11 — Result-State / Qualification Model

### CAP-SPEC-12 — Read-Model Contract

### CAP-SPEC-13 — Query Semantics

### CAP-SPEC-14 — Current Authority and Persistence

### CAP-SPEC-15 — Historical Snapshot Boundary

### CAP-SPEC-16 — Dependency Identity

### CAP-SPEC-17 — Derivation Policy Version

### CAP-SPEC-18 — Staleness and Invalidation

### CAP-SPEC-19 — Provenance and Explainability

### CAP-SPEC-20 — Goal-Demand Handoff

### CAP-SPEC-21 — Allocation and Proposal Boundary

### CAP-SPEC-22 — Friction Boundary

For each decision provide:

* **Decision**
* **Normative Rule**
* **Reasoning**
* **Consequences**
* **Implementation Constraint**
* **Remaining Downstream Question**, if any

Do not leave an architecture decision unresolved merely because implementation details remain unknown.

---

## 28. Required Boundary Matrix

Produce a final normative matrix:

| Concept                 | Authored? | Derived? | Owns Time? | Describes Resource? | Expresses Demand? | Allocates Resource? | Recommends Action? | Requires User Acceptance Before Scheduling? |
| ----------------------- | --------: | -------: | ---------: | ------------------: | ----------------: | ------------------: | -----------------: | ------------------------------------------: |
| Commitment              |           |          |            |                     |                   |                     |                    |                                             |
| Protected Time          |           |          |            |                     |                   |                     |                    |                                             |
| Chronological Free Time |           |          |            |                     |                   |                     |                    |                                             |
| Geometric Opening       |           |          |            |                     |                   |                     |                    |                                             |
| Capacity                |           |          |            |                     |                   |                     |                    |                                             |
| Goal                    |           |          |            |                     |                   |                     |                    |                                             |
| Goal Demand             |           |          |            |                     |                   |                     |                    |                                             |
| Feasible Opportunity    |           |          |            |                     |                   |                     |                    |                                             |
| Allocation              |           |          |            |                     |                   |                     |                    |                                             |
| Proposal                |           |          |            |                     |                   |                     |                    |                                             |
| Accepted Allocation     |           |          |            |                     |                   |                     |                    |                                             |
| Scheduled Work          |           |          |            |                     |                   |                     |                    |                                             |
| Friction                |           |          |            |                     |                   |                     |                    |                                             |

Use the completed matrix as a consistency check against semantic leakage.

---

## 29. Specification Consistency Checks

Before completing the artifact, explicitly test the specification against these questions:

1. Can Capacity exist without any Goals?
2. Can a Goal exist without consuming Capacity?
3. Can Capacity exist that no current Goal can use?
4. Can chronological free time exist without being Capacity?
5. Can protected time exist without being occupied?
6. Can a Capacity result truthfully represent fragmentation?
7. Can Capacity remain valid across midnight?
8. Can Capacity distinguish two different user-day boundaries?
9. Can unresolved Commitment demand prevent double allocation?
10. Can Capacity be recomputed deterministically?
11. Can a stale Capacity result be recognized?
12. Can DayFrame explain why an interval is or is not Capacity?
13. Can Goal-demand logic consume Capacity without reading scheduler internals?
14. Can allocation reason over Capacity without modifying it?
15. Can Proposal recommend an allocation without Capacity becoming authoritative?
16. Can limited Capacity exist without generating Friction?
17. Can historical Capacity context remain immutable after current scheduling state changes?
18. Can Capacity totals be calculated without destroying interval truth?
19. Can the architecture support future attached activities without treating them as anonymous buffers?
20. Can the specification be implemented without silently promoting engine reasoning into user intent?

For every **No**, determine whether:

* the specification is incomplete;
* the scenario is intentionally unsupported;
* or the question belongs to a downstream architecture.

Do not complete the specification with unexplained contradictions.

---

## 30. Governance and Architectural Constraints

The Capacity specification must preserve:

1. **User Authority** — derived Capacity never becomes user intent.
2. **Determinism** — identical authoritative dependencies and derivation policy produce identical Capacity.
3. **Authored / Derived / Historical Separation** — Capacity remains derived current truth.
4. **User-Day Semantics** — calendar midnight does not become an implicit planning boundary.
5. **Overnight Correctness** — irregular and overnight schedules remain first-class.
6. **Source Incarnation** — stale source lifetimes cannot influence current Capacity.
7. **Accepted Decision Authority** — applicable PlanDecisions affect derived scheduling reality before Capacity is calculated where appropriate.
8. **Goal Non-Time-Ownership** — Goals do not consume time merely by existing.
9. **Proposal Boundary** — Capacity cannot silently create scheduled discretionary work.
10. **Friction Boundary** — resource scarcity alone is not corrective Friction.
11. **Immutable History** — historical Capacity context cannot be rewritten by later edits.
12. **Provenance** — Capacity remains explainable.
13. **No Double Claiming** — unresolved authored time demand cannot simultaneously appear as freely allocatable Capacity.
14. **Topology Preservation** — scalar totals cannot replace interval structure.
15. **Responsibility Separation** — Capacity does not absorb Goal demand, allocation, Proposal, execution, or Summary responsibilities.

If the current implementation cannot satisfy one of these constraints, document the future implementation requirement rather than weakening the architecture to match existing code.

---

## 31. Non-Goals

This specification task must not:

* implement Capacity;
* create Capacity TypeScript types;
* create Capacity state;
* create Capacity selectors;
* create Capacity commands;
* create Capacity UI;
* create Capacity tests;
* modify scheduling behavior;
* modify placement behavior;
* modify Work generation;
* modify recurrence;
* modify buffers;
* modify PlanDecision behavior;
* modify Friction;
* implement off-day policy;
* implement attached activities;
* implement Goal demand;
* define complete Goal priority semantics;
* implement Goal allocation;
* implement Proposal;
* implement accepted allocation;
* redesign Summary;
* alter historical publication;
* modify persistence;
* introduce cloud or database infrastructure;
* perform performance optimization;
* assign this work to Phase 8;
* define Phase 8;
* modify production code;
* modify tests;
* modify schemas;
* modify configuration;
* modify existing documentation;
* restructure the repository.

This task is read-only with respect to the existing repository.

**The required specification result artifact is the sole permitted repository write.**

---

## 32. Required Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/architecture/CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md`

The filename must contain `RESULT` because it is the durable Codex output produced by this specification task.

Do not substitute another filename or path.

The result artifact must contain the complete specification.

Use this major structure:

1. **Executive Specification**
2. **Architectural Context**
3. **Normative Capacity Definition**
4. **Capacity Terminology**
5. **Authoritative Inputs**
6. **Capacity Derivation Model**
7. **Canonical Capacity Unit**
8. **User-Day and Temporal Semantics**
9. **Occupied Time, Protected Time, and Buffers**
10. **Unresolved Commitment Liability**
11. **General Eligibility Policy**
12. **General Capacity vs Goal-Specific Feasibility**
13. **Capacity Dimensions and Aggregation**
14. **Capacity Result States**
15. **Capacity Read-Model Contract**
16. **Capacity Query Semantics**
17. **Authority and Persistence**
18. **Dependency Identity and Derivation Version**
19. **Staleness and Invalidation**
20. **Provenance and Explainability**
21. **Capacity → Goal Demand Contract**
22. **Capacity → Allocation → Proposal Boundary**
23. **Capacity vs Friction Boundary**
24. **Historical and Summary Boundary**
25. **Existing Primitive Compatibility**
26. **Normative Semantic Examples**
27. **Capacity Invariants**
28. **Architecture Decisions**
29. **Boundary Matrix**
30. **Specification Consistency Checks**
31. **Implementation Constraints**
32. **Downstream Open Questions**
33. **Specification Conclusions**
34. **Recommended Next Step**
35. **Completion Statement**

After writing the artifact:

1. verify the file exists at the exact required path;
2. reopen and read the saved artifact;
3. verify that the complete specification was saved;
4. verify that all required architecture decisions are present;
5. verify that all required invariants are present;
6. verify that the required boundary matrix is complete;
7. verify that the Completion Statement is exact;
8. inspect repository status;
9. verify that no repository file other than the required `RESULT` artifact was modified.

Do not merely print the specification in Codex's final response.

The durable `RESULT` artifact is required.

---

## 33. Validation

This is an architecture-specification task, not an implementation task.

Do not modify or add tests.

Run focused existing tests only when needed to substantiate claims about implementation compatibility.

At minimum, where relevant to specification decisions, verify existing behavior concerning:

* custom user-day boundaries;
* overnight scheduling;
* variable effective boundaries;
* Work generation;
* occupied-window behavior;
* buffer behavior;
* candidate feasibility;
* manual events;
* recurrence;
* PlanDecision replay;
* Preview staleness;
* source incarnation.

Record:

* test files executed;
* test counts;
* pass/fail results;
* implementation behaviors verified;
* relevant gaps.

If the prior Capacity audit's focused validation remains sufficient and no materially new implementation claim requires additional execution, Codex may cite and verify that evidence rather than running redundant broad test suites.

After creating the required result artifact, inspect repository status.

If any repository file other than:

`/home/sid/Penn Digital Services/DayFrame/docs/architecture/CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md`

has changed, stop and report the deviation.

---

## 34. Completion Criteria

This specification is complete only when:

* [ ] The normative definition of Capacity is explicit.
* [ ] Capacity's epistemic classification as derived truth is explicit.
* [ ] Capacity's authoritative inputs are defined.
* [ ] Time-owning, time-constraining, and temporal/authority inputs are distinguished.
* [ ] The Capacity derivation pipeline is specified.
* [ ] Chronological free time is distinguished from Capacity.
* [ ] Geometric openings are distinguished from Capacity.
* [ ] Feasible Opportunity terminology is classified.
* [ ] Allocatable Capacity terminology is classified.
* [ ] The canonical Capacity unit is defined.
* [ ] Capacity interval identity requirements are defined.
* [ ] User-day ownership is normative.
* [ ] Overnight behavior is normative.
* [ ] Variable user-day boundaries are addressed.
* [ ] Planning-range clipping is addressed.
* [ ] Occupied time and protected time are distinguished.
* [ ] Buffer semantics are specified.
* [ ] Overlapping exclusions are addressed.
* [ ] Unresolved Commitment Liability is normatively defined.
* [ ] Double-claiming prevention is explicit.
* [ ] General eligibility policy is distinguished from Goal-specific constraints.
* [ ] General Capacity is explicitly demand-neutral.
* [ ] Goal-specific feasibility is downstream.
* [ ] Capacity dimensions are defined.
* [ ] Aggregation semantics preserve interval topology.
* [ ] Partial/qualified Capacity cannot silently inflate allocatable totals.
* [ ] The result-state or qualification model is defined.
* [ ] The minimum Capacity read-model contract is defined.
* [ ] Capacity query semantics are defined.
* [ ] Current Capacity authority is defined.
* [ ] Current Capacity persistence semantics are defined.
* [ ] Historical Capacity snapshot semantics are defined.
* [ ] Dependency identity requirements are defined.
* [ ] Same-lifetime source changes are addressed.
* [ ] Derivation-policy versioning is addressed.
* [ ] Staleness and invalidation semantics are defined.
* [ ] Capacity provenance requirements are defined.
* [ ] The Goal-demand handoff is explicit.
* [ ] Goal-demand logic does not need to reinterpret scheduler internals.
* [ ] The allocation boundary is explicit.
* [ ] The Proposal boundary is explicit.
* [ ] The user-authority boundary remains intact.
* [ ] The Friction boundary is explicit.
* [ ] Historical/Summary semantics are bounded.
* [ ] Existing implementation primitives are classified for compatibility.
* [ ] All seven required normative examples are included.
* [ ] The final Capacity invariant set is normative and testable.
* [ ] All required `CAP-SPEC-*` architecture decisions are completed.
* [ ] The final boundary matrix is complete.
* [ ] All twenty consistency checks are answered.
* [ ] No unexplained architectural contradiction remains.
* [ ] Implementation constraints are explicit.
* [ ] Remaining questions are genuinely downstream rather than unresolved Capacity fundamentals.
* [ ] No Phase 8 assignment was made.
* [ ] No production implementation was performed.
* [ ] `CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md` was written to the exact required path.
* [ ] The saved result artifact was reopened and verified.
* [ ] Repository status was checked.
* [ ] The required `RESULT` artifact was the sole repository write.
* [ ] Codex's final response reports the exact result path.
* [ ] Codex's final response reports validation performed and results.
* [ ] Codex's final response confirms whether any other repository files changed.

---

## 35. Recommended Next-Step Gate

At the end of the specification, select exactly one primary next step.

### Path A — Capacity Implementation-Alignment Plan

Choose if Capacity is fully specified and the next uncertainty is how to introduce it safely into the current implementation.

### Path B — Goal Demand and Allocation Architecture Audit

Choose if Capacity is fully specified and Goal demand is now the principal architectural unknown that must be understood before implementation sequencing.

### Path C — Capacity Targeted Implementation Audit

Choose if specification exposed a specific executable implementation uncertainty that must be investigated before either planning or downstream architecture can continue.

### Path D — Architecture Reconciliation

Choose if the specification uncovered a material conflict with accepted DayFrame architecture that requires governance resolution.

Explain the selection.

Do not begin the selected next step.

Do not assign it to Phase 8 or another future implementation phase.

---

## 36. Final Completion Statement

End `CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md` with exactly:

> **Capacity Architecture Specification complete.**
>
> The specification establishes Capacity as a deterministic, explainable, user-day-based derived planning resource; defines its authoritative inputs, derivation model, temporal semantics, unresolved-Commitment treatment, result qualifications, read-model contract, dependency identity, staleness, provenance, aggregation, historical boundary, and downstream Goal-demand interface; preserves the authority boundaries separating Capacity from allocation, Proposal, Friction, and scheduled work; and identifies the appropriate next architectural step without modifying the implementation or assigning the work to a future implementation phase.

The final Codex response must state:

> **Saved artifact:** `/home/sid/Penn Digital Services/DayFrame/docs/architecture/CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md`
>
> **Repository modifications:** The required specification result artifact was the sole repository write.
>
> **Validation:** Report the focused existing tests or prior verified evidence used to substantiate implementation-compatibility claims and their results.
>
> **Recommended next step:** Report the selected Path A, B, C, or D without beginning that work.
