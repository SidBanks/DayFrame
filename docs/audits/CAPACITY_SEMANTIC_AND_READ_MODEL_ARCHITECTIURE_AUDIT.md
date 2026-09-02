# Capacity Follow-Up Audit 01 — Capacity Semantic and Read-Model Architecture Audit

## Status

Ready for audit.

## Phase

Post-Phase 7 Architectural Follow-Up

## Task Type

Read-only architecture-alignment audit, Capacity semantic-definition review, scheduler-to-Capacity boundary analysis, time-ownership inventory, free-time/opening/feasibility distinction, user-day and temporal-scope verification, Capacity read-model assessment, authority/persistence/staleness analysis, provenance review, Goal-allocation handoff definition, Friction-boundary analysis, historical-semantics assessment, implementation-primitive reuse evaluation, architecture-decision preparation, and next-step determination.

**Capacity Follow-Up Audit 01 does not authorize production implementation.**

The required audit artifact is the sole permitted repository write.

---

## 1. Objective

Determine what **Capacity** must mean in DayFrame and establish the architectural contract necessary to implement it without conflating Capacity with calendar free time, candidate-specific placement geometry, Goal demand, Proposal, or Friction.

The preceding Capacity and Proposal Implementation Alignment Audit established that the current implementation contains useful low-level scheduling geometry but no coherent Capacity domain model.

That audit classified Capacity as:

> **C3 — Partially Implemented**

Its central implementation finding was:

> Commitments shape time, but the implementation stops at candidate-specific opening geometry rather than materializing a coherent planning resource called Capacity.

This follow-up must therefore move beyond:

> Does Capacity exist?

and answer:

> **What does it mean for DayFrame to truthfully say that a user has Capacity?**

The audit must establish:

1. the semantic definition of Capacity;
2. what Capacity explicitly is not;
3. what owns or constrains time before Capacity is derived;
4. the distinction among chronological free time, geometric openings, feasible opportunities, usable Capacity, and allocatable Capacity;
5. the distinction between general Capacity and Goal-specific feasibility;
6. the dimensions and temporal scopes Capacity requires;
7. the relationship between Capacity and DayFrame user-day semantics;
8. the effect of buffers, relational constraints, priorities, accepted decisions, and off-day policy on Capacity;
9. the minimal truthful Capacity read-model contract;
10. Capacity authority, persistence, provenance, and staleness semantics;
11. the boundary from Capacity into Goal demand, allocation, and Proposal;
12. the boundary between Capacity and Friction;
13. the historical implications of Capacity;
14. which existing implementation primitives are semantically reusable;
15. and whether DayFrame is ready for formal Capacity specification or requires another targeted follow-up first.

Do not implement Capacity.

---

## 2. Architectural Context

The approved DayFrame product model is:

> **Commitments own time. Goals compete for Capacity. DayFrame proposes. The user decides. DayFrame schedules what the user has authorized.**

The intended constructive planning lifecycle is:

**Commitments + Constraints → Capacity Derivation → Capacity → Goal Demand / Allocation → Proposal → User Decision → Accepted Allocation → Schedule → Execution → Progress → Summary**

The preceding implementation-alignment audit established current implemented truth closer to:

**Authored Commitments → Candidate Generation → Candidate-Specific Opening Geometry → Automatic Placement → Generated Schedule Projection → Friction when infeasible**

The intended lifecycle therefore first breaks after:

**Commitments shape time → [missing coherent Capacity model]**

This audit must determine the correct architecture at that boundary before Goal-allocation or constructive-Proposal implementation proceeds.

The existence of this architectural follow-up does **not** establish a Phase 8.

Phase numbering and implementation-roadmap placement remain downstream governance decisions.

---

## 3. Authority and Evidence Model

Maintain DayFrame's established distinction among three forms of truth.

### 3.1 Intended Truth

Approved architecture, governance decisions, accepted product-model decisions, and canonical audit findings establish intended behavior.

Inspect at minimum:

* the canonical Dogfood Pass 01 findings;
* the completed Capacity and Proposal Implementation Alignment Audit;
* the current complete architecture specification;
* `ARCHITECTURE_CHARTER.md`;
* `DECISIONS.md`;
* `CURRENT_STATE.md`;
* relevant alignment, roadmap, and architecture artifacts where necessary.

Locate authoritative artifacts rather than assuming their exact location beyond the known documentation structure.

### 3.2 Implemented Truth

Production code establishes what DayFrame currently does.

### 3.3 Experienced Truth

Dogfood Pass 01 establishes what was meaningfully observable during real product use.

In particular, Capacity was not meaningfully exposed as a product concept.

Do not reinterpret hidden placement calculations as adequate Capacity merely because they identify openings.

### 3.4 Evidence Classification

Classify substantive implementation findings as:

* **Confirmed**
* **Inferred**
* **Not Found**

For Confirmed findings, cite:

* file path;
* symbol/function/type/action/component;
* relevant line range where practical;
* runtime role;
* deterministic test evidence where applicable.

Do not infer semantics from terminology alone.

---

## 4. Established Findings to Verify, Not Re-Litigate

Treat the following conclusions from the preceding audit as established unless current repository evidence contradicts them:

1. No explicit Capacity entity exists.
2. No Capacity authority surface exists.
3. No Capacity query or command exists.
4. No Capacity persistence exists.
5. No Capacity UI exists.
6. No daily, weekly, or planning-range Capacity aggregation exists.
7. Goals do not consume Capacity.
8. Goals do not influence candidate generation or placement.
9. `placeBlockCandidates` calculates candidate-specific openings.
10. Those openings account for meaningful placement constraints.
11. Those openings are transient and private to placement.
12. Current opening calculations represent geometric scheduling availability rather than a reusable planning resource.
13. Summary is retrospective rather than a forward-looking Capacity surface.
14. Goals currently provide provenance to independently authored activity rather than scheduling demand.

Do not spend the audit reproducing the preceding report.

Verify a prior finding when it materially supports a new Capacity architecture decision.

If current evidence contradicts a prior finding, record the contradiction explicitly.

---

## 5. Capacity Semantic Definition

Evaluate this provisional definition:

> **Capacity is the derived planning resource remaining after Commitments and relevant constraints shape a planning period.**

Determine whether this definition is:

* sufficient;
* incomplete;
* overly broad;
* overly narrow;
* or incompatible with approved DayFrame architecture.

The final audit must recommend a precise semantic definition.

That definition must distinguish Capacity from:

* chronological free time;
* geometric openings;
* candidate feasibility;
* Goal-specific feasibility;
* Goal demand;
* allocation;
* Proposal;
* Friction.

Capacity must not become a generic synonym for "time not occupied."

---

## 6. Time Ownership and Capacity Inputs

Capacity cannot be defined until the system establishes what owns or constrains time before Capacity is derived.

Audit at minimum:

* Work;
* Sleep;
* manual events;
* fixed recurring Commitments;
* movable recurring Commitments;
* generated occurrences;
* buffers;
* relational placement constraints;
* accepted PlanDecisions;
* scheduling preferences;
* source-incarnation semantics;
* attached activities if any current representation exists.

Produce:

| Source | Authored or Derived | Owns Time? | Constrains Time? | Reduces Capacity? | Why? | Evidence |
| ------ | ------------------- | ---------: | ---------------: | ----------------: | ---- | -------- |

Explicitly distinguish:

> **owns time**

from:

> **affects where other things can be placed**

Do not assume those are equivalent.

Also determine whether the current implementation has a sufficiently coherent notion of Commitment to serve as a Capacity input boundary, or whether Capacity must consume several existing source families while preserving their provenance.

---

## 7. Free Time, Geometric Openings, Feasibility, and Capacity

Establish precise semantic boundaries among the following provisional concepts.

### 7.1 Chronological Free Time

Clock time not directly occupied by a time-owning source.

### 7.2 Geometric Opening

An interval remaining after relevant occupied intervals and scheduling geometry are applied.

### 7.3 Feasible Opportunity

An opening capable of satisfying a defined set of scheduling constraints.

### 7.4 Capacity

The derived planning resource DayFrame can expose before deciding which Goal should receive it.

### 7.5 Goal-Specific Feasibility

Evaluation of Capacity against a particular Goal demand.

### 7.6 Allocatable Capacity

Capacity that can legitimately be offered to the Goal-demand/allocation layer.

Determine whether each concept is necessary and whether the terminology should be affirmed, refined, combined, or rejected.

Do not create unnecessary domain concepts merely to preserve this provisional vocabulary.

---

## 8. Required Capacity Cases

Analyze the following cases using current implementation semantics where possible and architectural reasoning where implementation stops.

### 8.1 Large Unconstrained Opening

**Commitment ends:** 10:00
**Next Commitment begins:** 14:00
**Chronological gap:** 4 hours

Determine:

* what current DayFrame knows;
* what the placement engine knows;
* what additional semantics are necessary before DayFrame can call the interval Capacity.

### 8.2 Buffers

**Commitment A ends:** 10:00
**After-buffer:** 30 minutes
**Commitment B begins:** 14:00
**Before-buffer:** 30 minutes

Determine whether chronological free time, geometric opening, and Capacity represent the same quantity.

### 8.3 Fragmentation

Available intervals:

* 09:00–09:30
* 10:30–11:00
* 13:00–13:30

There are 90 chronological free minutes.

Determine whether this necessarily means 90 minutes of usable Capacity.

### 8.4 Goal Compatibility

Assume general Capacity contains a 90-minute morning interval.

A future Goal demand requires or strongly prefers evening work.

Determine whether the morning interval remains:

* general Capacity;
* allocatable Capacity;
* Goal-incompatible Capacity;
* or merely free time.

### 8.5 Minimum Useful Duration

Several 20-minute openings exist.

A future demand requires 45 contiguous minutes.

Determine how Capacity should represent those intervals without prematurely designing Goal demand.

### 8.6 Relational Constraint

An opening exists geometrically but cannot satisfy a before-Work, after-Work, or comparable relational requirement.

Determine whether the interval remains general Capacity while being infeasible for that demand.

### 8.7 Off-Day Policy

Compare the Dogfood Pass 01 concepts:

* **Preserve Routine**
* **Adapt to Off Days**

Determine how absence of Work may change Capacity under each policy.

Do not design the final off-day-policy feature.

Establish only the Capacity boundary.

---

## 9. Capacity Dimensions

Determine whether Capacity can truthfully be represented as a single number.

Evaluate at minimum:

* total duration;
* contiguous duration;
* interval identity;
* number of openings;
* fragmentation;
* time-of-day;
* user-day;
* user-week;
* planning range;
* workday/off-day;
* constraint compatibility.

For every candidate dimension determine:

| Dimension | Required? | Existing Primitive? | Capacity-Level or Goal-Specific? | Evidence / Reasoning |
| --------- | --------: | ------------------: | -------------------------------- | -------------------- |

Do not add dimensions merely because they might someday be useful.

A Capacity dimension must have an architectural reason to exist.

---

## 10. General Capacity vs Goal-Specific Feasibility

Determine whether DayFrame should formally distinguish:

> **General Capacity** — usable planning resources available before considering a particular Goal.

from:

> **Goal-Specific Feasibility** — whether some portion of that Capacity can satisfy a particular Goal's demand.

Evaluate this example:

**General Capacity:** Tuesday contains one 90-minute evening interval.

**Goal A:** Requires 60 contiguous evening minutes.
**Result:** Feasible.

**Goal B:** Requires 120 contiguous minutes.
**Result:** Not feasible.

Determine whether this separation should become an architectural invariant.

Do not design the Goal-demand model.

Define only the Capacity contract that the later Goal-demand/allocation layer should consume.

---

## 11. Temporal Scope and User-Day Semantics

Evaluate Capacity at:

* occurrence;
* user-day;
* selected day;
* user-week;
* work cycle;
* planning range;
* calendar month;
* arbitrary range.

Determine which scopes are:

* canonical;
* aggregate;
* derived presentation;
* or unnecessary.

Capacity must preserve DayFrame's established temporal semantics.

Audit at minimum:

* user-day boundary;
* overnight Work;
* times before the user-day boundary;
* effective scheduling preferences;
* cycle/segment overrides;
* planning-range clipping.

Evaluate:

> **Capacity belongs to DayFrame user-days rather than naïve calendar dates.**

Determine whether this statement is sufficient for all currently supported shift patterns.

Aggregation must not destroy important interval or fragmentation information.

---

## 12. Buffers and Attached-Activity Boundary

Buffers already influence placement and therefore require explicit Capacity treatment.

Determine:

1. whether buffers reduce Capacity;
2. whether they instead restrict allocation;
3. whether before/after buffers should remain distinguishable from occupied Commitments;
4. how overlapping buffers should behave semantically;
5. whether anonymous protective buffers and meaningful activities should eventually have different Capacity semantics.

Dogfood Pass 01 identified that some apparent buffers may actually be real activities—for example, commuting before and after Work.

Do not design attached activities in this audit.

Define only the boundary a Capacity model must preserve if attached activities later become first-class.

---

## 13. Priority Boundaries

Keep three concepts distinct.

### Commitment Priority

How strongly existing time-owning intent is protected.

### Goal Priority

How competing Goals may later compete for Capacity.

### Decision / Preference Priority

How explicit user scheduling preferences may later resolve multiple valid planning choices.

Determine whether current Commitment priority:

* changes Capacity;
* changes placement order;
* changes protection semantics;
* changes feasibility;
* or has no direct Capacity meaning.

Do not introduce Goal Priority or Decision Priority.

Define the boundary only.

---

## 14. Capacity Read-Model Contract

Determine the minimum information required for DayFrame to represent Capacity truthfully.

Evaluate at minimum:

* planning-range identity;
* user-day identity;
* interval boundaries;
* total usable duration;
* contiguous-duration characteristics;
* fragmentation;
* relevant constraint/provenance information;
* authoritative-state identity or revision;
* accepted-decision dependencies;
* stale state;
* derivation/version information if architecturally necessary.

Do not create TypeScript interfaces or implementation schemas.

Produce:

| Information | Required / Optional / Not Required | Why | Existing Source |
| ----------- | ---------------------------------- | --- | --------------- |

Explicitly distinguish information belonging to:

* Capacity;
* presentation;
* Goal-specific feasibility;
* Goal demand;
* allocation;
* Proposal.

The Capacity read model must not become a hidden Proposal model.

---

## 15. Authority, Persistence, and Staleness

Evaluate three architectural options.

### Option A — Pure Derived Read Model

Current Capacity is deterministically recomputed from authoritative scheduling state whenever requested.

### Option B — Persisted Capacity Authority

Capacity itself becomes durable authoritative state.

### Option C — Derived Current Capacity with Selective Historical Snapshots

Current Capacity remains derived, while Capacity context relevant to accepted planning decisions may be frozen into historical provenance where necessary.

Evaluate each against:

* authored/generated/history separation;
* deterministic generation;
* immutable history;
* Preview staleness;
* source incarnation;
* PlanDecision replay;
* backup/restore;
* historical-plan publication;
* execution history.

Choose primarily from authority semantics rather than performance speculation.

Determine what invalidates Capacity.

At minimum evaluate:

* shift changes;
* cycle changes;
* recurrence changes;
* Commitment duration changes;
* manual-event changes;
* buffer changes;
* preferred-window changes;
* user-day-boundary changes;
* accepted PlanDecisions;
* Commitment deletion/recreation;
* source-incarnation changes.

Compare Capacity invalidation with current Preview-staleness semantics.

---

## 16. Capacity Provenance and Explainability

DayFrame should eventually be able to answer:

> **Why do I have three hours of Capacity on Tuesday?**

Determine what provenance is required to explain a Capacity result.

Evaluate dependencies on:

* planning range;
* user-day boundary;
* Work;
* Commitments;
* manual events;
* buffers;
* accepted decisions;
* scheduling preferences;
* exclusions;
* authoritative-state revisions;
* derivation version where necessary.

Do not design explanatory UI.

Define the architectural information requirement.

Preserve DayFrame's epistemic-integrity principle:

> **Derived truth should remain explainable from the authoritative facts that produced it.**

---

## 17. Capacity → Goal Demand → Allocation → Proposal Boundary

Define the downstream handoff:

**Commitments + Constraints → Capacity Derivation → Capacity Contract → Goal Demand → Allocation → Proposal**

Answer:

> **What must Capacity expose so that Goal demand, allocation, and Proposal do not need to reinterpret raw scheduler internals?**

Capacity must not decide:

* which Goal deserves time;
* which Goal has higher priority;
* how much time a Goal should receive;
* what the user should do;
* which Proposal should win;
* whether a Proposal should be accepted.

Preserve:

> **Capacity describes planning resources. Goals express desired outcomes. Allocation reasons about competing demand. Proposal recommends a use of Capacity. The user decides.**

---

## 18. Capacity vs Friction Boundary

Preserve:

> **Capacity describes planning-resource conditions. Friction describes incompatibility requiring attention or recovery.**

Determine:

* whether insufficient Capacity automatically constitutes Friction;
* whether future Goal demand exceeding Capacity is Friction before the user accepts an allocation;
* whether fragmentation is Capacity information rather than Friction;
* whether unplaced authored Commitments remain Friction;
* whether unresolved conflicts affect Capacity derivation;
* whether Capacity itself should ever represent failure.

Do not redesign Friction.

Establish only the semantic boundary.

---

## 19. Historical and Summary Semantics

Evaluate whether Capacity has durable analytical value.

Consider:

* Capacity available when a plan was proposed;
* Capacity allocated;
* Capacity left unallocated;
* execution relative to accepted allocation;
* historical Capacity trends.

Determine whether these values should eventually be:

* reconstructed from retained authoritative state;
* selectively snapshotted;
* durably historical;
* or not retained.

Do not redesign Summary.

Use this analysis to inform the Capacity authority/persistence decision.

Preserve:

> **Preserve provenance without preserving equal prominence.**

---

## 20. Existing Primitive Reuse Assessment

Audit at minimum:

* user-day calculations;
* planning-window expansion;
* occupied-window calculations;
* open-window complement;
* buffer expansion;
* candidate feasibility;
* recurrence expansion;
* Work generation;
* manual-event representation;
* scheduling preferences;
* PlanDecision replay;
* Preview staleness;
* source incarnation;
* historical-plan publication.

Classify each as:

* **Directly Reusable**
* **Reusable with Adaptation**
* **Not Suitable**

Produce:

| Primitive | Current Purpose | Reuse Classification | Capacity Role | Risk / Limitation | Evidence |
| --------- | --------------- | -------------------- | ------------- | ----------------- | -------- |

Semantic compatibility takes precedence over implementation convenience.

Do not recommend reuse merely because code already exists.

---

## 21. Required Worked Examples

Include at least five complete semantic examples:

1. ordinary workday;
2. off-day;
3. overnight-shift user-day;
4. fragmented availability;
5. buffered Commitments.

At least one example must demonstrate:

> **Chronological free time exists, but usable Capacity is lower.**

At least one must demonstrate:

> **General Capacity exists, but a particular Goal demand cannot use it.**

At least one must demonstrate:

> **Naïve calendar-date reasoning would produce an incorrect Capacity result, while user-day reasoning remains correct.**

The examples are architectural demonstrations.

Do not implement simulation code solely to produce them.

---

## 22. Capacity Invariants

Evaluate each invariant as:

* **Affirm**
* **Refine**
* **Reject**

### CAP-INV-01

**Capacity is derived rather than authored.**

### CAP-INV-02

**Commitments and relevant constraints shape Capacity.**

### CAP-INV-03

**Capacity is not synonymous with chronological free time.**

### CAP-INV-04

**Capacity is not synonymous with candidate-specific placement openings.**

### CAP-INV-05

**Goals do not create Capacity.**

### CAP-INV-06

**Capacity does not decide which Goal should receive time.**

### CAP-INV-07

**General Capacity can exist even when a particular Goal cannot use it.**

### CAP-INV-08

**Capacity respects DayFrame user-day semantics.**

### CAP-INV-09

**Capacity derivation is deterministic for the same authoritative inputs.**

### CAP-INV-10

**Capacity is explainable from its authoritative inputs.**

### CAP-INV-11

**Changes to authoritative scheduling state invalidate affected Capacity results.**

### CAP-INV-12

**Capacity remains distinct from Proposal.**

### CAP-INV-13

**Capacity remains distinct from Friction.**

Produce:

| Invariant | Affirm / Refine / Reject | Reasoning | Evidence |
| --------- | ------------------------ | --------- | -------- |

---

## 23. Required Architecture Decisions

Make an evidence-backed recommendation for every decision below.

Each decision must include:

* **Recommendation**
* **Evidence / Reasoning**
* **Alternatives Considered**
* **Consequences**
* **Unresolved Questions**, if any

### AD-CAP-01 — Capacity Definition

Define the semantic meaning of Capacity.

### AD-CAP-02 — Free-Time Boundary

Define the relationship among chronological free time, geometric openings, feasibility, and Capacity.

### AD-CAP-03 — Goal Boundary

Define general Capacity versus Goal-specific feasibility.

### AD-CAP-04 — Temporal Scope

Define Capacity's canonical temporal unit or units.

### AD-CAP-05 — Authority Model

Choose derived, persisted, or hybrid semantics.

### AD-CAP-06 — Provenance Requirement

Define minimum explainability provenance.

### AD-CAP-07 — Staleness Boundary

Define what invalidates Capacity.

### AD-CAP-08 — Downstream Handoff

Define what Capacity exposes to Goal demand, allocation, and Proposal.

### AD-CAP-09 — Friction Boundary

Define when a Capacity condition becomes Friction.

### AD-CAP-10 — Historical Boundary

Define when Capacity requires historical preservation.

Produce:

| Decision | Recommendation | Principal Reason | Remaining Question |
| -------- | -------------- | ---------------- | ------------------ |

---

## 24. Required Boundary Matrix

Produce:

| Concept                 | Owns Time? | Derived from Schedule State? | Describes Resource? | Expresses Demand? | Makes Recommendation? | Requires User Authority? |
| ----------------------- | ---------: | ---------------------------: | ------------------: | ----------------: | --------------------: | -----------------------: |
| Commitment              |            |                              |                     |                   |                       |                          |
| Chronological Free Time |            |                              |                     |                   |                       |                          |
| Geometric Opening       |            |                              |                     |                   |                       |                          |
| Capacity                |            |                              |                     |                   |                       |                          |
| Goal                    |            |                              |                     |                   |                       |                          |
| Goal Demand             |            |                              |                     |                   |                       |                          |
| Allocation              |            |                              |                     |                   |                       |                          |
| Proposal                |            |                              |                     |                   |                       |                          |
| Friction                |            |                              |                     |                   |                       |                          |

Use the completed matrix to verify that Capacity has not absorbed downstream responsibilities.

---

## 25. Test Coverage Assessment

Inspect deterministic coverage for Capacity prerequisites.

At minimum evaluate:

* user-day boundaries;
* overnight scheduling;
* occupied intervals;
* open-window calculation;
* buffers;
* candidate feasibility;
* recurrence;
* Work generation;
* manual events;
* preferred windows;
* work-relative placement;
* PlanDecision replay;
* Preview staleness;
* source incarnation.

Classify:

* well-covered prerequisites;
* weakly covered prerequisites;
* Capacity semantics necessarily untested because they do not yet exist;
* tests that encode assumptions incompatible with the recommended Capacity architecture.

Do not add or modify tests.

When deterministic architectural claims rely on existing behavior, cite supporting tests.

---

## 26. Governance and Architectural Constraints

Any recommended Capacity architecture must preserve:

1. **Determinism** — identical authoritative inputs produce identical Capacity.
2. **Authored/generated/history separation** — derived Capacity must not masquerade as authored truth.
3. **User-day semantics** — Capacity must respect DayFrame's user-day model.
4. **Overnight correctness** — overnight Work and irregular shifts remain first-class.
5. **Source incarnation** — replacement sources must not silently inherit stale authority.
6. **Accepted decision authority** — applicable PlanDecisions affect derived reality where appropriate.
7. **Epistemic integrity** — facts, derivations, recommendations, and accepted decisions remain distinguishable.
8. **Goal non-time-ownership** — Goals do not occupy time merely by existing.
9. **Proposal authority boundary** — Capacity must not silently become scheduled discretionary work.
10. **Friction distinction** — Capacity is descriptive; Friction is corrective.
11. **Immutable history** — later changes must not rewrite historical truth.
12. **Explainability** — Capacity must be traceable to the authoritative state that produced it.

If current implementation conflicts with a required invariant, document the conflict rather than silently adapting architecture to existing code.

---

## 27. Non-Goals

This audit must not:

* implement Capacity;
* add Capacity types;
* add Capacity state;
* add Capacity UI;
* implement Capacity aggregation;
* add Goal priority;
* design the complete Goal-demand model;
* implement Goal demand;
* implement allocation;
* implement Proposal;
* modify Friction;
* redesign Summary;
* implement off-day policy;
* implement attached activities;
* alter persistence;
* alter historical publication;
* introduce database or cloud infrastructure;
* optimize performance;
* establish or number a Phase 8;
* modify production code;
* modify tests;
* modify schemas;
* modify configuration;
* modify existing documentation;
* modify repository structure.

The required audit artifact is the sole permitted repository write.

---

## 28. Required Result Artifact

Create:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/CAPACITY_SEMANTIC_READ_MODEL_AUDIT.md`

The artifact must contain the complete audit.

Use these major sections:

1. **Executive Findings**
2. **Evidence and Prior Findings**
3. **Recommended Capacity Definition**
4. **Time Ownership and Capacity Inputs**
5. **Free Time, Openings, Feasibility, and Capacity**
6. **Capacity Dimensions**
7. **General Capacity vs Goal-Specific Feasibility**
8. **Temporal and User-Day Semantics**
9. **Buffers and Attached-Activity Boundary**
10. **Priority Boundaries**
11. **Capacity Read-Model Contract**
12. **Authority, Persistence, and Staleness**
13. **Capacity Provenance**
14. **Capacity → Goal Demand → Allocation → Proposal Boundary**
15. **Capacity vs Friction Boundary**
16. **Capacity and Historical/Summary Semantics**
17. **Existing Primitive Reuse Assessment**
18. **Worked Semantic Examples**
19. **Invariant Evaluation**
20. **Architecture Decisions**
21. **Boundary Matrix**
22. **Test Coverage Assessment**
23. **Implementation Constraints**
24. **Open Questions**
25. **Audit Conclusions**
26. **Recommended Next Step**
27. **Completion Statement**

This task is read-only with respect to the existing repository.

**The required audit artifact is the sole permitted repository write.**

After writing:

1. verify the file exists at the exact required path;
2. reopen and read the saved artifact;
3. verify the complete report was saved rather than a placeholder or partial result;
4. verify the required Completion Statement is present;
5. inspect repository status;
6. verify no other repository files were modified.

Do not merely print the completed findings in the task response.

The durable Markdown artifact is required.

---

## 29. Recommended Next-Step Gate

Select exactly one primary next step.

### Path A — Capacity Architecture Specification

Choose if Capacity semantics, authority, provenance, temporal scope, and downstream contract are sufficiently resolved for formal specification.

### Path B — Targeted Capacity Prototype Audit

Choose if an existing implementation primitive requires deeper executable investigation before Capacity architecture can be finalized.

### Path C — Goal Demand and Allocation Audit

Choose if the Capacity contract is sufficiently resolved and the next architectural unknown is how Goals express demand for and compete over Capacity.

### Path D — Architecture Reconciliation

Choose if the recommended Capacity model materially conflicts with approved DayFrame architecture and that conflict must be resolved first.

Explain the selection.

Do not begin the selected next step.

Do not assign the selected work to Phase 8 or any other implementation phase.

---

## 30. Validation

Because this is a read-only audit:

* do not modify tests;
* do not modify production code;
* do not alter configuration;
* do not alter build budgets;
* do not perform unrelated cleanup.

Run only focused existing tests necessary to substantiate deterministic claims.

Where available, validate existing behavior concerning:

* user-day boundaries;
* overnight placement;
* open-window calculations;
* buffers;
* candidate feasibility;
* PlanDecision replay;
* Preview staleness;
* source-incarnation semantics.

Record:

* test files run;
* test counts;
* pass/fail results;
* relevant coverage gaps.

After creating the required artifact, inspect repository status.

If any repository file other than the required artifact changes, stop and report the deviation.

---

## 31. Completion Criteria

The audit is complete only when:

* [ ] Intended, implemented, and experienced truth were kept distinct.
* [ ] Prior Capacity findings were verified where materially necessary.
* [ ] Contradictions with prior findings, if any, were explicitly recorded.
* [ ] A precise recommended Capacity definition was produced.
* [ ] Time-owning and time-constraining sources were distinguished.
* [ ] Chronological free time was distinguished from Capacity.
* [ ] Geometric openings were distinguished from Capacity.
* [ ] Feasible opportunity was distinguished from Capacity.
* [ ] General Capacity was distinguished from Goal-specific feasibility.
* [ ] Allocatable Capacity terminology was affirmed, refined, or rejected.
* [ ] Capacity dimensions were evaluated.
* [ ] Canonical temporal scope was established.
* [ ] User-day and overnight semantics were preserved.
* [ ] Buffer semantics were evaluated.
* [ ] The attached-activity boundary was documented without designing the feature.
* [ ] Commitment, Goal, and decision/preference priority concepts remained distinct.
* [ ] The minimum Capacity read-model contract was defined.
* [ ] Capacity authority semantics were decided.
* [ ] Capacity persistence semantics were decided.
* [ ] Capacity staleness dependencies were defined.
* [ ] Capacity provenance requirements were defined.
* [ ] The Capacity → Goal Demand boundary was defined.
* [ ] The Capacity → Allocation boundary was defined.
* [ ] The Capacity → Proposal boundary was defined.
* [ ] Capacity and Friction remained distinct.
* [ ] Historical/Summary implications were evaluated.
* [ ] Existing implementation primitives were classified for reuse.
* [ ] At least five worked semantic examples were included.
* [ ] At least one example demonstrated free time exceeding usable Capacity.
* [ ] At least one example demonstrated general Capacity that could not satisfy a particular Goal demand.
* [ ] At least one example demonstrated why user-day semantics matter.
* [ ] All thirteen Capacity invariants were evaluated.
* [ ] All ten architecture decisions were completed.
* [ ] The required boundary matrix was completed.
* [ ] Relevant existing test coverage was assessed.
* [ ] Implementation constraints were documented.
* [ ] Open Questions contain only genuinely unresolved downstream issues.
* [ ] Exactly one recommended next-step path was selected.
* [ ] No Phase 8 or other implementation-phase assignment was made.
* [ ] `CAPACITY_SEMANTIC_READ_MODEL_AUDIT.md` was written to the exact required path.
* [ ] The saved artifact was reopened and verified.
* [ ] Repository status was checked.
* [ ] The audit artifact was the sole repository write.
* [ ] The final task response states the exact artifact path.
* [ ] The final task response reports validation results.
* [ ] The final task response confirms whether any other repository files changed.

---

## 32. Final Completion Statement

End `CAPACITY_SEMANTIC_READ_MODEL_AUDIT.md` with exactly:

> **Capacity Semantic and Read-Model Architecture Audit complete.**
>
> The report establishes DayFrame's Capacity semantics, distinguishes Capacity from chronological free time, geometric openings, Goal-specific feasibility, Proposal, and Friction, defines the required authority, provenance, temporal, and read-model boundaries, evaluates existing implementation primitives for reuse, and identifies the appropriate next architectural step without modifying the implementation.

The final task response must state:

> **Saved artifact:** `/home/sid/Penn Digital Services/DayFrame/docs/audits/CAPACITY_SEMANTIC_READ_MODEL_AUDIT.md`
>
> **Repository modifications:** The required audit artifact was the sole repository write.
>
> **Validation:** Report the focused existing tests executed and their results.
