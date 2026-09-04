# Task 8.5 — Capacity V1 and Goal-Specific Feasibility V1

**Status:** Ready for Codex
**Phase:** Phase 8 — Goal and Capacity Foundations
**Task Type:** Implementation / Derived Planning Truth / Interval Read Model / Feasibility Evaluation
**Primary Responsibility:** Establish canonical demand-neutral Capacity and deterministic Goal-Specific Feasibility over Task 8.3 Demand Projection and Task 8.4 composition-aware Commitment resource truth, without implementing Goal competition, Allocation, Proposal, acceptance, or scheduled Goal work.

---

## 1. Objective

Implement the final major Phase 8 foundation increment:

1. **Capacity V1** as a deterministic, explainable, demand-neutral derived read model consisting of canonical user-day-owned allocatable planning intervals;
2. **Capacity qualification V1** covering freshness, coverage, integrity, liability, and allocability;
3. **Capacity provenance and stable semantic identity** sufficient for downstream reference and historical decision provenance;
4. **composition-aware Capacity derivation** consuming authorized scheduled activity, protected Buffer footprint, and unresolved Commitment / Composite Liability without double counting;
5. **Capacity aggregation V1** preserving interval topology while deriving bounded summaries;
6. **Goal-Specific Feasibility V1** applying exactly one Task 8.3 Demand Projection to current valid Capacity;
7. **Feasible Opportunity V1** as one or more deterministic legal Capacity slices/opportunity sets satisfying the Demand's implemented hard constraints;
8. **unmet / partially satisfiable Demand evaluation** without allocating Capacity;
9. **explicit non-interference boundaries** preventing Goal priority, competition, Allocation, Proposal, or scheduling authority from entering the domain.

At completion DayFrame must be able to answer:

> **What discretionary planning Capacity currently exists over this exact canonical user-day horizon, what qualifications or unresolved liabilities affect that Capacity, and can this one explicit Goal Demand Projection be satisfied by compatible portions of it?**

It must not answer:

> Which Goal deserves scarce Capacity, how Capacity should be divided among Goals, what schedule should be recommended, or what Goal work should be authorized.

Those begin in Phase 9.

---

## 2. Governing Architecture and Evidence

Before changing code, inspect repository copies of the governing artifacts.

At minimum inspect:

* `docs/architecture/CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md`
* `docs/audits/CAPACITY_SEMANTIC_AND_READ_MODEL_ARCHITECTURE_AUDIT_RESULT.md`
* `docs/architecture/GOAL_DEMAND_AND_ALLOCATION_ARCHITECTURE_SPECIFICATION_RESULT.md`
* `docs/architecture/COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_SPECIFICATION_RESULT.md`
* `docs/architecture/POST_PHASE_7_ARCHITECTURE_SYNTHESIS_RESULT.md`
* `docs/architecture/POST_PHASE_7_IMPLEMENTATION_ALIGNMENT_STRATEGY_RESULT.md`
* `docs/roadmap/POST_PHASE_7_IMPLEMENTATION_ROADMAP_RESULT.md`
* Task 8.1 RESULT
* Task 8.2 RESULT
* Task 8.3 RESULT
* Task 8.4 RESULT
* current canonical user-day utilities;
* effective schedule-preference resolution;
* Work/cycle occurrence generation;
* Commitment recurrence and placement;
* manual events;
* accepted PlanDecision replay;
* source/incarnation resolution;
* Buffer handling;
* Composition projection / footprint / liability;
* Friction;
* Preview;
* historical publication;
* current Goal Demand Projection;
* persistence/restore/readiness infrastructure;
* bundle governance.

The Capacity Architecture Specification is normative for Capacity.

The Goal Demand and Allocation Specification is normative for Goal-Specific Feasibility.

Task 8.3 is the executable Demand Projection baseline.

Task 8.4 is the executable composition-aware Commitment-resource baseline.

Do not reinterpret earlier placement helpers as Capacity merely because they already compute openings.

---

## 3. Starting Baseline

Task 8.4 established:

* revisioned Attachment Relationship authority;
* deterministic attached-occurrence pairing;
* attached support activities as real scheduled activity;
* protected relationship/source Buffer footprint;
* Composite Footprint;
* Composite Liability;
* composition-specific corrective Friction;
* CompositeDecision;
* composition historical provenance;
* Backup V9;
* IndexedDB schema 9;
* exact coexistence with existing scheduling behavior when Composition authority is empty.

Recorded Task 8.4 validation baseline:

* **107 test files passed**
* **1,013 tests passed**
* **0 failed**
* Prettier pass
* typecheck pass
* lint pass
* build pass
* bundle hard-policy pass.

Recorded Task 8.4 bundle:

* initial raw: **671,004 bytes**
* initial gzip: **169,758 bytes**
* largest lazy chunk: **53,187 bytes**
* total: **841,301 bytes**

The total bundle is already above the existing **825,000-byte architecture-review threshold**.

Task 8.5 must treat bundle architecture as an active engineering constraint.

---

## 4. Normative Capacity Definition

Implement Capacity according to the accepted definition:

> **Capacity is the deterministic, explainable collection of user-day-owned intervals eligible for discretionary allocation after DayFrame accounts for applicable time-owning Commitments, unresolved Commitment liabilities, mandatory constraints, protective Buffers, accepted planning decisions, and explicit general availability policy. Duration and fragmentation are derived characteristics. Capacity is descriptive, derived, and non-authoritative.**

Capacity must not be treated as:

* raw chronological free time;
* a candidate-specific placement search window;
* Goal feasibility;
* Goal Demand;
* Goal Priority;
* Allocation;
* Proposal;
* accepted planning authority;
* scheduled Goal work;
* execution evidence;
* Friction.

---

## 5. Canonical Capacity Unit

The canonical Capacity unit is:

> **one positive-duration interval owned by exactly one canonical DayFrame user-day.**

Every Capacity interval must contain at least:

* stable semantic Capacity interval ID;
* exact start instant;
* exact end instant;
* derived duration;
* owning canonical user-day label;
* exact owning user-day window;
* requested-query coverage relationship;
* derivation-policy identity/version;
* dependency identity/fingerprint;
* allocability qualification;
* provenance sufficient to explain inclusion and adjacent exclusion;
* freshness/applicability state.

Capacity intervals must never cross canonical user-day boundaries.

A continuous free opening crossing a DayFrame user-day boundary becomes two Capacity intervals.

Do not merge them merely because timestamps touch.

---

## 6. Capacity Identity

Capacity interval identity must be deterministic and semantic.

Identity should derive from material facts such as:

* owning user-day identity/window;
* exact interval boundaries;
* general eligibility semantics;
* derivation policy/version;
* authoritative dependency fingerprint.

It must not depend on:

* array index;
* iteration order;
* UI list order;
* random evaluation IDs;
* Goal identity;
* requested Goal Demand;
* calendar-month grouping;
* persistence enumeration.

Equivalent authoritative inputs must yield equivalent semantic Capacity identities.

A material source change may legitimately produce new interval identity.

---

## 7. Derived-Truth Boundary

Capacity is derived and disposable.

Do not persist current Capacity as authored authority.

Do not create a `Capacity` IndexedDB authority store merely because downstream consumers need stable references.

Capacity may be:

* recomputed;
* cached ephemerally if explicitly freshness-bound;
* frozen later as bounded provenance inside Proposal / Accepted Allocation / historical decision truth.

Task 8.5 must not implement those later decision snapshots unless a minimal reusable serialization contract is required.

---

## 8. Capacity Query Scope

Support bounded Capacity queries over exact planning ranges composed from canonical user-days.

At minimum support:

* one canonical user-day;
* bounded multi-user-day range.

Derived aggregation may support:

* user-week;
* arbitrary planning range.

Calendar month remains presentation/query shorthand only.

Do not make month a competing Capacity identity.

Every query must expose:

* exact requested bounds;
* resolved component user-days;
* exact coverage;
* partial/unavailable portions;
* result fingerprint;
* policy version.

---

## 9. Canonical User-Day Semantics

Capacity must use existing canonical DayFrame user-day resolution.

Required rules:

1. calendar midnight is not an implicit Capacity boundary;
2. times before the effective user-day boundary belong to the preceding user-day;
3. effective boundaries may vary by cycle/segment;
4. user-days may be shorter or longer than 24 hours;
5. overnight Work remains one occurrence even if it crosses midnight;
6. Capacity arithmetic uses exact instants;
7. ownership remains one user-day per Capacity interval;
8. range clipping preserves partial-coverage truth;
9. multi-day aggregation retains user-day ownership;
10. touching intervals across user-day boundaries remain distinct.

Do not implement date-plus-24-hours assumptions.

---

## 10. Capacity Derivation Pipeline

Implement the semantic pipeline:

```text
1. Resolve authoritative dependency snapshot
2. Resolve exact canonical user-day windows
3. Resolve scheduled / time-owning occurrence truth
4. Apply accepted applicable decisions
5. Incorporate Task 8.4 attached activity occurrences
6. Construct occupied intervals
7. Construct protected Buffer intervals
8. Incorporate unresolved Commitment / Composite Liability scope
9. Union exclusions while retaining contributor provenance
10. Complement exclusions inside each user-day
11. Apply explicit general availability policy
12. Clip to requested coverage
13. qualify freshness / coverage / integrity / liability / allocability
14. emit canonical Capacity intervals
15. derive summaries from canonical intervals
```

Implementation may fuse computational passes.

Semantic distinctions must remain observable through types, reasons, provenance, and tests.

---

## 11. Occupied Time

Occupied Time is time owned by an authorized scheduled occurrence.

At minimum include relevant current scheduled truth from:

* generated Work occurrences;
* fixed recurring Commitments;
* placed movable Commitments;
* Sleep where represented as authorized Commitment;
* manual events;
* attached support activity occurrences from Task 8.4;
* accepted current occurrence changes from PlanDecision / CompositeDecision as applicable.

Do not subtract:

* Goals;
* Demand Projection;
* Goal Priority;
* optional unscheduled requests;
* Proposal-like ideas.

Occupied time must retain exact source-family provenance.

---

## 12. Protected Time

Protected Time is intentionally unavailable for discretionary allocation but is not activity.

At minimum include:

* source-local Buffer protection;
* relationship-scoped Task 8.4 Buffer protection;
* other existing mandatory universal non-activity exclusions that already carry explicit authority.

Protected intervals must retain:

* owner/source provenance;
* protection reason;
* interval;
* relevant revision/policy.

Buffers must remain distinguishable from activity.

Do not create execution identity for protected intervals.

---

## 13. Overlap / Union Arithmetic

Use half-open interval semantics:

```text
[start, end)
```

Touching boundaries do not overlap.

Overlapping:

* occupied intervals;
* protected intervals;
* occupied + protected intervals

must be unioned once for arithmetic.

All contributing provenance must remain available.

Do not double-subtract:

* attached activity plus Composite Footprint;
* source Buffer plus relationship Buffer when Task 8.4 has already normalized effective protection;
* parent activity plus composite envelope;
* overlapping Buffers.

Capacity duration is calculated from unioned exclusion geometry, not summed raw contributor durations.

---

## 14. Composition Integration

Task 8.4 now provides composition-aware resource truth.

Capacity must consume composition without recreating its logic.

At minimum:

* attached support activity occurrence → occupied time;
* protected composition Buffer → protected time;
* Composite Liability → unresolved Commitment liability qualification;
* Composite Footprint may serve as normalized resource input if it is the cleanest supported interface.

Do not:

* rerun relationship pairing independently;
* reinterpret required/optional;
* infer support activities;
* flatten Buffer into activity;
* count Composite Footprint in addition to its component ownership.

Use Task 8.4 query/read-model boundaries.

---

## 15. Unresolved Commitment Liability

Implement the accepted **scoped conservative Capacity** model.

Unresolved authored time-owning demand must not be advertised as fully allocatable Capacity.

Each liability must retain, where determinable:

* source lifetime;
* occurrence identity;
* required duration;
* eligible temporal scope;
* unresolved reason;
* relevant constraints;
* exact provenance;
* freshness.

Rules:

1. Capacity outside provably affected scope may remain allocatable.
2. Capacity inside/intersecting affected scope may remain descriptively visible.
3. Affected intervals must not contribute to fully allocatable totals.
4. If liability scope cannot safely be bounded, affected user-day/range becomes non-allocatable.
5. Liability duration must remain separately reported.
6. Do not arbitrarily subtract liability minutes from unrelated intervals.
7. Do not count the liability simultaneously as Capacity.
8. Existing corrective Friction remains separate.

Task 8.4 `Composite Liability` must enter this model.

Existing unplaced ordinary Commitment demand must also be assessed.

---

## 16. Liability Scope

Derive liability scope only from explicit current Commitment constraints.

Do not guess where an unresolved Commitment “probably” belongs.

Where the current scheduling model can provide a deterministic eligible window/range, use it.

Where scope is ambiguous:

* qualify conservatively;
* expose structured reason;
* do not advertise affected Capacity as fully allocatable.

If some unresolved existing Commitment family lacks sufficient bounded scope provenance, document the limitation and fail protected rather than silently treating the entire range as clean Capacity.

---

## 17. General Availability Policy V1

Capacity may apply only universally applicable availability policy.

Inspect existing authored scheduling preferences and determine which, if any, already constitute explicit general availability authority.

Do not infer a policy merely from:

* user behavior;
* Work presence;
* off-day status;
* Goal preferences;
* historical scheduling;
* existing candidate heuristics.

If no general-availability authority currently exists, implement a neutral V1 policy such as:

> every geometric opening is generally eligible unless explicit existing mandatory authority excludes it.

Give that policy a versioned governed identity.

Do not invent UI or silently select a philosophical off-day policy.

---

## 18. General vs Demand-Specific Rules

Capacity only applies rules that are universally applicable.

Examples:

### Capacity-level

* occupied Commitment;
* protected Buffer;
* explicit never-schedule-discretionary-time window;
* universally accepted availability rule.

### Goal-Specific Feasibility-level

* minimum useful session;
* indivisible 90-minute requirement;
* splittability;
* future evening-only Demand;
* future before/after-Work Goal condition;
* Goal cadence;
* Demand-specific preference.

Do not erase general Capacity because one Demand cannot use it.

---

## 19. Capacity Qualification Model

Use orthogonal qualifications, not one giant state enum.

At minimum implement:

### Freshness

* `current`
* `stale`

### Coverage

* `complete`
* `partial`
* `unavailable`

### Integrity

* `valid`
* `protected`
* `invalid`

### Liability

* `resolved`
* `unresolved`

### Allocability

* `allocatable`
* `qualified`
* `nonAllocatable`

Equivalent exact names are acceptable if semantics remain clear.

A result may combine dimensions.

Example:

```text
freshness=current
coverage=complete
integrity=valid
liability=unresolved
allocability=qualified
```

Do not flatten that into one ambiguous `partial` or `warning` status.

---

## 20. Zero vs Unavailable

Preserve this critical distinction:

> **Zero Capacity is a valid derived result. Unavailable Capacity means DayFrame cannot safely make a Capacity claim.**

Do not represent:

* invalid authority;
* protected persistence;
* unresolved critical input corruption;
* unavailable coverage

as `0 minutes Capacity`.

Zero means the complete valid evaluated resource really contains no allocatable interval.

---

## 21. Capacity Reasons

Use bounded structured reason codes.

Capacity reasons should cover, as needed:

* occupied by authorized occurrence;
* protected by Buffer;
* unresolved ordinary Commitment liability;
* unresolved Composite Liability;
* incomplete coverage;
* stale dependency;
* invalid authoritative input;
* protected authority;
* unavailable canonical user-day resolution;
* general policy exclusion.

Do not store rendered UI prose as the semantic reason.

---

## 22. Capacity Provenance

Provenance must answer:

* why this interval exists;
* why adjacent time was excluded;
* whether exclusion was occupied or protected;
* why an interval is qualified/non-allocatable;
* what unresolved liability affects it;
* what changed between two derivations.

Retain exact source/revision/lifetime references wherever possible.

Do not require downstream Feasibility to inspect:

* Work generation internals;
* recurrence internals;
* raw Buffer models;
* source-incarnation machinery;
* boundary calculation internals.

Capacity becomes the resource abstraction boundary.

---

## 23. Dependency Fingerprint

Reuse Task 8.1 planning provenance/freshness primitives.

Material dependencies may include:

* effective scheduling preference / user-day boundary authority;
* Work/cycle definitions and revisions used;
* relevant Commitment source/incarnation/revisions;
* recurrence authority;
* manual-event authority;
* accepted PlanDecision state;
* Task 8.4 relationship/decision/composite footprint dependencies;
* Buffer authority;
* general availability policy;
* Capacity derivation policy version;
* requested query coverage.

Only material dependencies should participate.

Unrelated Goal changes must not stale Capacity.

Goal Demand/Priority must not stale general Capacity.

Unrelated Commitment changes outside requested coverage should not stale a bounded result unless they materially affect lookaround/boundary/liability scope.

---

## 24. Capacity Policy V1

Define a versioned Capacity derivation policy.

At minimum it governs:

* canonical exclusion arithmetic;
* protected/occupied classification;
* liability qualification behavior;
* default general eligibility behavior;
* interval identity;
* aggregation rules.

The policy must not contain:

* Goal priority;
* Allocation strategy;
* inferred urgency;
* Proposal ranking;
* learned preference;
* Goal Demand semantics.

Policy identity participates in result fingerprint.

---

## 25. Capacity Read Model

A bounded Capacity result should expose at minimum:

### Query

* query identity;
* requested start/end;
* exact covered bounds.

### Component User-Days

* user-day label;
* resolved user-day start/end;
* coverage completeness;
* qualifications.

### Capacity Intervals

* interval ID;
* start/end/duration;
* owning user-day;
* allocability;
* qualification reasons;
* dependency fingerprint;
* provenance.

### Liabilities

* liability IDs/references;
* demanded duration;
* scope;
* reason;
* provenance.

### Summaries

* total returned eligible duration;
* fully allocatable duration;
* qualified duration;
* longest contiguous allocatable interval;
* interval count;
* per-user-day totals.

Do not make scalar summaries canonical truth.

---

## 26. Capacity Aggregation

Aggregation must preserve topology.

Rules:

1. intervals remain canonical;
2. totals derive from intervals;
3. touching intervals across user-day boundaries do not merge;
4. qualified intervals do not inflate fully allocatable totals;
5. partial coverage remains explicit;
6. stale/non-valid intervals cannot count as current allocatable truth;
7. user-day ownership survives range summaries.

No fragmentation score is required in V1.

Interval count + longest contiguous duration + interval topology are sufficient.

---

## 27. Capacity Persistence

Capacity is not authored authority.

Do not add a durable current Capacity store unless repository evidence requires an explicitly ephemeral cache and the architecture permits it.

Expected V1:

* derive on query;
* optionally memoize/runtime cache with exact dependency fingerprint;
* persist no independent Capacity authority;
* advance neither DB schema nor backup version solely for derived Capacity.

If Task 8.5 introduces a genuinely new authored general-availability policy, then persistence/backup versioning may be necessary for that policy only.

Document the decision.

---

## 28. Backup / Restore

If no new authored authority is added:

* Backup V9 remains current;
* database schema 9 remains current;
* no new backup version is required merely for Capacity/Feasibility.

If explicit general availability authority is added:

* version backup/schema as required;
* preserve older migration as explicit neutral/default policy rather than inferred preference;
* prevent lossy downgrade where necessary.

Do not persist Feasibility results as authority.

---

## 29. Goal-Specific Feasibility Definition

Implement according to the accepted definition:

> **Goal-Specific Feasibility is a deterministic, non-authoritative evaluation of one explicit Demand Projection against current allocatable Capacity for an exact horizon, producing compatible opportunities, preference annotations, and unsatisfied-demand information without mutating Capacity, comparing Goals, allocating resources, recommending action, or scheduling work.**

Inputs:

* exact Demand Projection identity;
* exact current Capacity result/fingerprint;
* exact evaluation horizon;
* feasibility policy/version.

Outputs:

* compatible opportunity set(s);
* compatible duration;
* unsatisfied duration;
* session/contiguity result;
* hard incompatibility reasons;
* preference annotations where supported;
* exact Capacity interval references;
* exact Demand reference;
* coverage;
* dependency identity;
* freshness/applicability.

---

## 30. Feasibility Input Contract

Goal-Specific Feasibility may consume only the Capacity contract.

It must not bypass Capacity and inspect:

* Work definitions;
* cycle internals;
* recurrence internals;
* Buffer internals;
* PlanDecision internals;
* Composition relationship internals;
* raw occupied windows;
* source incarnation machinery;
* raw user-day calculations.

Similarly, it must consume the Task 8.3 Demand Projection contract rather than raw Demand storage.

This boundary is mandatory.

---

## 31. Feasibility Horizon

Feasibility evaluation requires exact horizon compatibility.

The Demand Projection horizon and Capacity coverage must be:

* identical;
* or compositionally compatible under an explicit deterministic clipping rule.

Do not silently evaluate Demand against incomplete Capacity coverage and report ordinary feasibility.

Partial coverage must produce explicit partial/qualified feasibility.

Missing required coverage must not become `not feasible` when the truth is `unknown/unavailable`.

---

## 32. Capacity Eligibility for Feasibility

Only Capacity intervals that are sufficiently:

* current;
* valid;
* covered;
* liability-resolved;
* allocatable

may be treated as fully usable Feasible Opportunity input.

Qualified intervals may be included descriptively if the result clearly marks them unusable for ordinary future Allocation.

V1 future Allocation must be able to consume only fully allocatable opportunity slices.

Do not let Feasibility “repair” qualified Capacity.

---

## 33. Demand Projection Integration

Task 8.3 V1 provides:

* explicit requested minutes;
* bounded canonical user-day horizon;
* indivisible or splittable session shape;
* minimum useful session;
* preferred/max duration where applicable;
* total/session-count cadence representation;
* minimum/target/optional satisfaction semantics;
* structural eligibility;
* applicability/freshness.

Consume those semantics directly.

Do not reinterpret raw Demand Intent.

Do not invent unsupported timing rules.

---

## 34. Structural Eligibility Boundary

Task 8.3 already projects structural eligibility.

Feasibility must respect it.

At minimum:

* `ineligible` → no ordinary feasible opportunity;
* `unknown` → protected/unknown result;
* `conditionallyEligible` → preserve conditionally eligible state;
* `eligible` → proceed to Capacity compatibility.

Do not re-run Goal Structure graph logic.

Structural eligibility is still not time feasibility.

---

## 35. V1 Hard Constraint Set

Feasibility V1 should implement exactly the Demand dimensions Task 8.3 actually supports.

At minimum:

* requested effort;
* indivisible exact session;
* splittable Demand;
* minimum useful fragment/session;
* optional preferred session duration where represented;
* optional maximum session duration where represented;
* session-count cadence where representation is sufficiently defined;
* minimum/target/optional satisfaction semantics.

Do not implement deferred timing preference/hard-window features from Task 8.3 by guessing.

---

## 36. Indivisible Demand

For indivisible Demand:

* one single fully allocatable contiguous Capacity opportunity must satisfy the required duration;
* multiple smaller intervals must not be summed;
* an opportunity slice may reference a subrange of a larger Capacity interval;
* slice identity must be deterministic.

Example:

```text
Demand: 90 contiguous minutes

Capacity:
09:00–09:30
12:00–12:30
18:00–18:30

Result:
90 total Capacity minutes
0 feasible opportunities
90 unsatisfied Demand minutes
```

General Capacity remains unchanged.

---

## 37. Splittable Demand

For splittable Demand:

* Capacity may be partitioned into legal fragments;
* each fragment must satisfy minimum useful duration;
* no fragment may exceed maximum if one exists;
* preferred duration may annotate desirability but must not make hard-compatible fragments infeasible;
* total assigned hypothetical opportunity duration may satisfy all or part of requested effort;
* session-count constraints must be respected where implemented.

Feasibility enumerates possible legal sets.

It does not choose one for allocation.

---

## 38. Feasible Opportunity

Implement Feasible Opportunity as derived evaluation data.

Each opportunity slice must reference:

* Capacity interval ID;
* exact slice start/end;
* duration;
* owning user-day;
* Capacity fingerprint;
* Demand Projection identity;
* feasibility policy version;
* hard-constraint compatibility;
* optional preference annotations.

Slices do not reserve Capacity.

They do not own time.

They are not scheduled blocks.

---

## 39. Opportunity Set

An Opportunity Set represents one legal way the Demand could be partitioned within Capacity.

It may contain:

* one slice for indivisible Demand;
* multiple slices for splittable Demand.

Each set must report:

* total compatible duration;
* session count;
* whether full Demand can be satisfied;
* whether only permitted partial satisfaction is possible;
* unmet amount;
* decisive constraints;
* deterministic identity.

V1 may bound enumeration to prevent combinatorial explosion.

Any enumeration limit must be explicit, deterministic, and non-authoritative.

---

## 40. Enumeration Strategy

Use the smallest deterministic bounded search sufficient for personal-scale V1.

Do not introduce a generic optimization solver.

Prefer:

* sorted Capacity intervals;
* deterministic legal slice generation;
* bounded partition enumeration;
* canonical tie/order rules;
* early pruning by requested duration/session constraints.

Do not rank alternatives by Goal importance.

Do not select an Allocation winner.

If multiple equivalent opportunity sets exist, deterministic output order is required.

---

## 41. Partial Satisfaction

Respect Task 8.3 Demand semantics.

If Demand does not permit partial satisfaction:

* below-full fit must not be labeled a valid partial success.

If Demand permits partial satisfaction:

* a partial opportunity set is valid only if it meets explicit minimum satisfaction;
* unmet amount remains explicit.

Feasibility may report:

* full;
* permitted partial;
* unsatisfied.

These are derived compatibility classifications.

They are not Allocation results.

---

## 42. Minimum / Target / Optional Demand

Preserve Task 8.3 semantics.

### Minimum

If the minimum requirement cannot be met, ordinary feasibility fails.

### Target

Feasibility may show:

* minimum satisfied;
* target fully satisfied;
* target partially satisfiable where permitted.

### Optional / Aspirational

Feasibility may report compatible opportunity without implying importance or mandatory claim.

Do not convert Demand semantic mode into Goal Priority.

---

## 43. Session Count

If Task 8.3 `sessionCount` semantics are sufficiently concrete:

* enforce the declared count in Opportunity Sets;
* do not turn count into recurrence;
* do not assign dates beyond what Capacity slices already possess;
* do not select which valid set should win downstream.

If current Task 8.3 count semantics are representational but insufficient for exact set enumeration, preserve them in result explanation and explicitly defer enforcement rather than inventing cadence meaning.

Document the decision.

---

## 44. Preference Boundary

Task 8.3 deferred timing preferences and timing hard constraints.

Therefore Task 8.5 must not invent them.

Feasibility V1 may support preference annotations only for Demand fields actually authored in V1.

Preferred session duration may be annotated if present.

Do not create:

* evening preference;
* weekday preference;
* Work-relative preference;
* learned preference.

Those require later explicit authority.

---

## 45. Feasibility Result States

Use an explicit result classification that preserves distinct causes.

At minimum distinguish:

* feasible;
* partiallyFeasible;
* infeasible;
* structurallyIneligible;
* conditionallyEligible;
* unknown;
* stale;
* unavailableCoverage.

Names may vary if semantics remain exact.

Do not collapse:

* no contiguous fit;
* no total duration;
* structurally ineligible;
* unavailable Capacity;
* stale Capacity

into one generic `notFeasible`.

---

## 46. Feasibility Reasons

Use structured reasons such as:

* insufficient total allocatable duration;
* insufficient contiguous duration;
* fragment below minimum;
* maximum session violation;
* session-count mismatch;
* partial satisfaction below minimum;
* structural ineligibility;
* conditional structural eligibility;
* stale Demand Projection;
* stale Capacity;
* incomplete Capacity coverage;
* unresolved Capacity liability;
* invalid/protected Capacity.

Do not render prose into the semantic model.

---

## 47. Demand-Neutrality Test

Add a critical invariant test:

```text
derive Capacity once

evaluate Goal A
evaluate Goal B

Capacity object / interval IDs / provenance / fingerprint remain unchanged
```

Goal-Specific Feasibility must never mutate or specialize Capacity.

---

## 48. No Competition

Task 8.5 evaluates one Demand at a time.

Do not implement:

* Competing Demand Set;
* overlap graph across Goals;
* scarce-resource contention;
* Goal Priority comparison;
* fairness;
* balance;
* tie-breaking across Goals.

Two individually feasible Goals may both reference the same Capacity interval in separate feasibility evaluations.

That is correct.

Competition begins later.

---

## 49. Goal Priority Boundary

Task 8.3 Goal Priority is intentionally not an input to single-Goal feasibility.

Do not consume it.

One Goal's priority does not alter:

* Capacity;
* structural eligibility;
* single-demand compatibility.

Priority becomes relevant only when Demands compete in Allocation.

Add regression proving changing Goal Priority does not change Capacity or one-demand Feasibility.

---

## 50. Allocation Boundary

Do not implement:

* provisional Capacity assignment;
* Capacity reservation;
* cross-demand non-overlap;
* Allocation Policy;
* fairness;
* priority precedence;
* preferred Allocation;
* unallocated Capacity after competition.

Feasible opportunities are possibilities, not assignments.

---

## 51. Proposal Boundary

Do not implement:

* concrete scheduling recommendation;
* Proposal;
* placement recommendation UI;
* alternative recommendation ranking;
* acceptance/rejection;
* Accepted Allocation;
* scheduled Goal work.

Exact opportunity slice boundaries may exist because compatibility sometimes requires them.

That does not make them a Proposal.

---

## 52. Friction Boundary

Limited resources do not create Friction.

Cases:

| Situation                                 | Classification                           |
| ----------------------------------------- | ---------------------------------------- |
| little Capacity                           | Capacity fact                            |
| fragmented Capacity                       | Capacity fact                            |
| one Goal Demand cannot fit                | Feasibility fact                         |
| several Goals exceed Capacity             | future Allocation problem                |
| unresolved authorized Commitment          | Liability + existing corrective Friction |
| accepted Goal allocation later infeasible | future corrective Friction               |
| stale Capacity                            | stale derived result                     |

Task 8.5 must not emit Friction because a Goal Demand lacks feasible Capacity.

---

## 53. Scheduling Non-Interference

Capacity and Feasibility are read models.

They must not modify scheduling.

Add regression proving:

```text
same authored scheduling state
+ Capacity query
+ Feasibility query

=> byte-for-byte unchanged scheduling / Preview / Friction output
```

No query may:

* place Commitment;
* move Commitment;
* revise Commitment;
* revise Demand;
* consume Capacity;
* create PlanDecision;
* create CompositeDecision.

---

## 54. Historical Boundary

Current Capacity is disposable.

Task 8.5 should provide enough stable serialization/reference structure that future Proposal / Accepted Allocation history may freeze:

* Capacity query identity;
* interval IDs/bounds;
* qualifications;
* dependency fingerprint;
* policy;
* relevant liability context;
* Feasibility identity;
* Demand Projection identity;
* selected opportunity references.

Do not implement historical Proposal snapshots yet.

---

## 55. Summary Boundary

Do not broadly expose Capacity through Summary unless a tiny existing read-only diagnostic seam is already appropriate.

Summary must eventually distinguish:

* current Capacity;
* qualified Capacity;
* feasible Demand;
* allocated effort;
* accepted effort;
* scheduled effort;
* executed effort.

Task 8.5 should keep those semantics available through query contracts.

No universal success score.

---

## 56. Store / Query Surface

Provide bounded query APIs.

At minimum:

### Capacity

* query Capacity for exact range;
* query Capacity for exact user-day;
* resolve canonical interval by semantic ID within a result where appropriate;
* expose qualifications;
* expose liabilities;
* expose provenance/fingerprint;
* derive summaries.

### Feasibility

* evaluate one Demand Projection against one current Capacity result;
* return deterministic Opportunity Sets;
* return exact unmet/partial/full classification;
* return reasons;
* return dependency fingerprint;
* return freshness/applicability.

Do not expose raw persistence arrays.

Do not require callers to reconstruct the Capacity pipeline manually.

---

## 57. Runtime / Memoization

Capacity/Feasibility may use bounded runtime memoization if useful.

Any memoization key must include all semantic dependencies.

A cache hit must be equivalent to fresh deterministic derivation.

Stale cache must never masquerade as current Capacity.

Do not persist cache as authored state.

---

## 58. General Availability Authority Decision

Before implementation, inspect whether an existing explicit general-discretionary-availability authority already exists.

Record one of:

### A. Existing Authority Reused

Identify exact authority, revision, scope, provenance.

### B. Neutral V1 Policy

No such authored authority exists, so Capacity V1 uses a governed neutral default that only excludes currently authorized occupied/protected/liability-constrained time.

### C. Bounded New Authority Required

Only choose this if implementation evidence proves Capacity cannot be coherent without a new explicit user-owned policy.

If C is required, stop and determine whether it is a small Task 8.5 prerequisite or architecture reopen.

Do not silently invent availability preference.

---

## 59. Persistence / Schema Decision

Expected result if no new authority is required:

```text
DB schema remains 9
Backup remains V9
Capacity is not persisted
Feasibility is not persisted
```

If schema/backup changes, RESULT must justify the exact authored authority that required it.

Derived read models alone are insufficient justification.

---

## 60. Required Tests — Capacity Geometry

Prove:

* empty user-day → one full Capacity interval under neutral policy;
* fixed Commitment subtracts occupied time;
* multiple Commitments yield expected openings;
* overlapping occupied intervals subtract once;
* protected Buffer subtracts once;
* overlapping Buffer + activity subtract once;
* attached support activity subtracts as occupied;
* Composite Footprint is not double-counted;
* gap without Buffer remains Capacity;
* touching `[start,end)` boundaries behave correctly;
* zero valid Capacity is distinct from unavailable.

---

## 61. Required Tests — User-Day

Prove:

* Capacity interval never crosses user-day boundary;
* overnight user-day;
* pre-boundary time ownership;
* variable boundary override;
* 21-hour transition;
* 27-hour transition;
* multi-day query preserves component user-days;
* continuous opening across boundary splits into two intervals;
* clipped partial day reports partial coverage;
* calendar midnight does not force Capacity split unless it is the actual user-day boundary.

---

## 62. Required Tests — Liability

Prove:

* unresolved ordinary movable Commitment does not become clean Capacity;
* bounded liability qualifies only affected scope;
* provably unrelated intervals remain allocatable;
* unbounded liability makes affected range non-allocatable;
* Task 8.4 Composite Liability qualifies affected Capacity;
* liability duration is reported separately;
* liability is not arbitrarily subtracted from unrelated interval;
* existing Friction remains separate;
* stale liability dependency invalidates current result.

---

## 63. Required Tests — Capacity Qualifications

Prove:

* current / stale;
* complete / partial / unavailable coverage;
* valid / protected / invalid integrity;
* resolved / unresolved liability;
* allocatable / qualified / nonAllocatable;
* only fully current/valid/complete/resolved/allocatable intervals contribute to fully allocatable total;
* unavailable does not equal zero.

---

## 64. Required Tests — Capacity Determinism

Perturb:

* source insertion order;
* exclusion order;
* relation order where semantically irrelevant;
* persistence enumeration order;
* query caller order.

Equivalent semantic state must produce equivalent:

* Capacity interval identities;
* bounds;
* fingerprint;
* summaries;
* qualifications.

---

## 65. Required Tests — Indivisible Feasibility

Prove:

* exact 60-minute Demand fits larger contiguous interval;
* exact slice is deterministic;
* fragmented equal total does not satisfy contiguous Demand;
* no sufficiently long interval returns correct reason;
* Capacity remains unchanged after evaluation.

---

## 66. Required Tests — Splittable Feasibility

Prove:

* legal fragments can satisfy total effort;
* below-minimum fragment ignored/rejected;
* maximum duration respected;
* multiple legal sets may be returned deterministically;
* partial allowed only when Demand says so;
* below minimum satisfaction does not count;
* unmet duration exact;
* opportunity sets do not reserve Capacity.

---

## 67. Required Tests — Structural State

Prove:

* eligible Demand evaluates normally;
* ineligible Demand produces structural result without Capacity mutation;
* conditionally eligible remains distinct;
* unknown fails protected;
* structural Goal changes stale/rederive Demand Projection as expected;
* Feasibility does not call Goal Structure directly.

---

## 68. Required Tests — Horizon / Coverage

Prove:

* matching Demand/Capacity horizons evaluate normally;
* partial Capacity coverage does not claim ordinary feasibility;
* unavailable Capacity returns unknown/unavailable rather than infeasible;
* slice references remain inside exact evaluated coverage;
* user-day ownership retained across multi-day opportunity sets.

---

## 69. Required Tests — Priority Boundary

Prove:

```text
same Demand
same Capacity
Priority low

and

same Demand
same Capacity
Priority critical
```

produce equivalent single-Goal Feasibility.

No Goal Priority input should be necessary for the evaluator.

---

## 70. Required Tests — Scheduling Non-Interference

Prove:

* Capacity query does not change Preview;
* Feasibility query does not change Preview;
* Capacity query does not create Friction;
* infeasible Goal Demand does not create Friction;
* no PlanDecision/CompositeDecision changes;
* no store authority revisions advance;
* no persistence mutation occurs from pure read-model evaluation.

---

## 71. Performance

Capacity will operate over interval topology and potentially many occurrences.

Keep V1 personal-scale and deterministic.

Prefer:

* sorted interval sweeps;
* interval union/complement;
* indexed provenance maps;
* bounded user-day iteration;
* composition queries rather than repeated relation traversal;
* bounded Feasibility partition search.

Avoid:

* general SAT/optimization libraries;
* graph frameworks;
* expensive eager UI imports;
* repeated complete schedule regeneration where a safe read-model adapter can consume already-derived authoritative schedule state.

Measure where appropriate.

---

## 72. Bundle Architecture Review

Because Task 8.4 exceeded the total architecture-review threshold, Task 8.5 must perform an explicit bundle review before completion.

The RESULT must report:

* starting Task 8.4 bundle;
* final initial raw;
* final initial gzip;
* largest lazy chunk;
* total;
* delta by metric;
* warning thresholds;
* hard thresholds;
* architecture-review threshold.

Inspect whether further lazy-boundary improvements are safely available.

Prefer Capacity/Feasibility domain/query code behind lazy import boundaries where compatible with current architecture.

A hard bundle failure blocks completion.

Do not sacrifice semantic correctness to reduce bundle numbers.

---

## 73. UI Boundary

Task 8.5 is primarily domain/read-model work.

Do not build broad Capacity or Goal-planning UI.

Minimal diagnostic/query exposure is permitted only if necessary to prove the read model.

Do not add:

* Allocation UI;
* Proposal UI;
* scheduling recommendation UI;
* draggable Goal sessions;
* priority comparison;
* Capacity calendar redesign.

If no UI is necessary, state that Task 8.5 remains intentionally non-UI.

---

## 74. Accessibility

If no UI is added:

> no new accessibility surface introduced.

If a tiny read-only surface is required:

* expose qualification/status non-visually;
* do not rely on color;
* distinguish unavailable vs zero;
* distinguish qualified vs allocatable;
* use semantic labels;
* preserve keyboard accessibility.

---

## 75. Migration

If no new authored authority is introduced, there is no new semantic migration.

Capacity derives from current existing authority.

Do not infer or persist Capacity during database open.

Do not backfill Capacity snapshots.

Do not create Goal Feasibility history.

If a new availability-policy authority is required, migration must use explicit neutral state, never inferred preferences.

---

## 76. Full-Clear

Pure derived Capacity/Feasibility require no new durable clear participant.

If runtime caches are introduced, full-clear/reset helpers must clear them.

Do not register derived read models as durable authorities.

---

## 77. Profiles

Profiles should not own Capacity or Feasibility.

Profile load may change scheduling authority and therefore cause new derived Capacity, but it must not:

* persist old Capacity;
* import Capacity;
* infer Goal Feasibility;
* store Capacity inside profile.

Document compatibility.

---

## 78. DF-006 Boundary

Preserve DF-006 as bounded regression/observability evidence.

Capacity must consume current Work/cycle truth without reinterpreting historical weekend/cycle semantics.

Do not repair Work generation as part of Capacity unless Task 8.5 directly exposes a new deterministic regression caused by current executable behavior.

Keep DF-006 protections green.

---

## 79. Governance

At completion:

* update `docs/architecture/CURRENT_STATE.md`;
* update `docs/architecture/CHANGELOG.md`;
* update `DECISIONS.md` only if a genuinely new durable architectural decision is discovered;
* do not rewrite accepted Capacity specification;
* do not rewrite Goal Demand specification;
* do not rewrite Composition specification;
* do not rewrite roadmap;
* do not rewrite Tasks 8.1–8.4 results.

Architecture Reopen Check should be:

> **No**

unless executable evidence exposes a real contradiction.

---

## 80. Repository Discipline

Before implementation:

1. inspect `git status`;
2. preserve all existing uncommitted Phase 8 work;
3. distinguish Task 8.5 changes from prior Task 8.1–8.4 work;
4. do not clean or overwrite unrelated work;
5. do not commit;
6. do not push unless explicitly instructed.

At completion report exact repository state.

---

## 81. Validation Commands

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

* Capacity geometry;
* user-day semantics;
* Buffer/activity exclusion;
* Composition integration;
* unresolved liability;
* qualifications;
* Capacity determinism;
* Demand Projection integration;
* indivisible Feasibility;
* splittable Feasibility;
* structural eligibility;
* partial coverage;
* Priority non-interference;
* scheduling non-interference;
* full store regression;
* Preview;
* Friction;
* publication;
* execution;
* Progress;
* Goal Structure;
* Goal Demand;
* Composition;
* DF-006.

Do not claim completion with a failing required gate.

---

## 82. Required Result Artifact

Create a durable Markdown result artifact in the dedicated Phase 8 results folder.

Filename must contain **`RESULT`**.

Preferred filename:

```text
TASK_8.5_CAPACITY_AND_GOAL_SPECIFIC_FEASIBILITY_V1_RESULT.md
```

The RESULT must contain at minimum:

1. Executive Result
2. Scope Delivered
3. Governing Evidence
4. Task 8.1 Foundation Reuse
5. Task 8.2 Structural Eligibility Boundary
6. Task 8.3 Demand Projection Integration
7. Task 8.4 Composition Integration
8. Existing Scheduling Read-Model Assessment
9. Files Added
10. Files Modified
11. Capacity Definition
12. Capacity Policy
13. Capacity Query Scope
14. Canonical Capacity Unit
15. Capacity Identity
16. User-Day Ownership
17. Occupied-Time Sources
18. Protected-Time Sources
19. Interval Union / Complement
20. Composition Footprint Integration
21. Composite Liability Integration
22. Ordinary Commitment Liability Integration
23. General Availability Policy Decision
24. Capacity Qualification Model
25. Freshness
26. Coverage
27. Integrity
28. Liability
29. Allocability
30. Zero vs Unavailable
31. Capacity Reasons
32. Capacity Provenance
33. Dependency Fingerprint
34. Capacity Read Model
35. Capacity Aggregation
36. Persistence Decision
37. Backup / Schema Decision
38. Profile Compatibility
39. Runtime / Cache Behavior
40. Store / Query Surface
41. Goal-Specific Feasibility Definition
42. Feasibility Policy
43. Capacity → Feasibility Contract
44. Demand Projection Consumption
45. Structural Eligibility
46. Horizon / Coverage Compatibility
47. Indivisible Demand
48. Splittable Demand
49. Minimum Useful Session
50. Maximum / Preferred Session
51. Minimum / Target / Optional
52. Session Count / Cadence Disposition
53. Feasible Opportunity
54. Opportunity Set
55. Enumeration Strategy
56. Partial Satisfaction
57. Feasibility States
58. Feasibility Reasons
59. Priority Boundary
60. Competition Boundary
61. Allocation Boundary
62. Proposal Boundary
63. Friction Boundary
64. Scheduling Non-Interference
65. Historical Provenance Seam
66. Summary Boundary
67. Tests Added
68. Capacity Geometry Tests
69. Liability Tests
70. Qualification Tests
71. Feasibility Tests
72. Determinism Tests
73. Scheduling Regressions
74. Full Regression Result
75. Validation Commands
76. Bundle Architecture Review
77. Performance Notes
78. Accessibility Notes
79. Compatibility Notes
80. DF-006 Relationship
81. V1 Design Decision Table
82. Boundary Matrix
83. Invariant Verification
84. Implementation Decisions
85. Deviations
86. Architecture Reopen Check
87. Governance Updates
88. Repository Status
89. Completion Assessment
90. Recommended Next Task
91. Completion Statement

---

## 83. Required V1 Decision Table

Include:

| Question                        | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| ------------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| Capacity derivation host        |             |                     |                    |                     |
| Capacity policy version         |             |                     |                    |                     |
| query scopes                    |             |                     |                    |                     |
| interval identity               |             |                     |                    |                     |
| user-day ownership              |             |                     |                    |                     |
| occupied sources                |             |                     |                    |                     |
| protected sources               |             |                     |                    |                     |
| ordinary liability scope        |             |                     |                    |                     |
| Composite Liability integration |             |                     |                    |                     |
| general availability policy     |             |                     |                    |                     |
| qualification representation    |             |                     |                    |                     |
| provenance depth                |             |                     |                    |                     |
| persistence/cache               |             |                     |                    |                     |
| aggregate summaries             |             |                     |                    |                     |
| Feasibility policy              |             |                     |                    |                     |
| indivisible Demand              |             |                     |                    |                     |
| splittable Demand               |             |                     |                    |                     |
| preferred duration              |             |                     |                    |                     |
| maximum duration                |             |                     |                    |                     |
| session count                   |             |                     |                    |                     |
| partial satisfaction            |             |                     |                    |                     |
| opportunity enumeration bound   |             |                     |                    |                     |
| preference annotations          |             |                     |                    |                     |
| UI exposure                     |             |                     |                    |                     |

Clearly distinguish:

* implemented;
* represented but not consumed;
* deferred.

---

## 84. Required Boundary Matrix

The RESULT must verify:

| Concept                   | Status after 8.5 | Authored / Derived        | Owns Time?              | May Change Scheduling? |
| ------------------------- | ---------------- | ------------------------- | ----------------------- | ---------------------- |
| Commitment                | Existing         | Authored → scheduled      | Yes                     | Yes                    |
| Attachment Relationship   | Existing         | Authored                  | No independently        | Yes via composition    |
| Buffer                    | Existing         | Authored constraint       | Protects                | Yes                    |
| Composite Liability       | Existing         | Derived obligation        | No duplicate ownership  | Corrective only        |
| Goal Demand Intent        | Existing         | Authored                  | No                      | No                     |
| Demand Projection         | Existing         | Derived                   | No                      | No                     |
| Goal Priority             | Existing         | Authored                  | No                      | No                     |
| Capacity                  | New              | Derived                   | No                      | No                     |
| Capacity Interval         | New              | Derived                   | No                      | No                     |
| Goal-Specific Feasibility | New              | Derived                   | No                      | No                     |
| Feasible Opportunity      | New              | Derived                   | No                      | No                     |
| Competing Demand          | Future           | Derived                   | No                      | No                     |
| Allocation                | Future           | Derived                   | No                      | No                     |
| Proposal                  | Future           | Proposed                  | No                      | No                     |
| Accepted Allocation       | Future           | Accepted                  | Authorizes future claim | Future                 |
| Scheduled Goal Work       | Future           | Scheduled derived reality | Yes                     | Future                 |
| Progress                  | Existing         | Observation / derived     | No                      | No automatic effect    |

---

## 85. Required Capacity Invariants

Explicitly verify:

1. Capacity is demand-neutral.
2. Capacity is derived, not authored.
3. Capacity interval topology is canonical; totals are summaries.
4. Every Capacity interval belongs to exactly one canonical user-day.
5. Calendar midnight is not an implicit boundary.
6. Occupied and protected time remain semantically distinct.
7. Overlap is subtracted once.
8. Buffers reduce Capacity without becoming activities.
9. Attached activities reduce Capacity as real activity.
10. Composite Footprint is not double-counted.
11. Required unresolved Commitment demand cannot be advertised as fully allocatable Capacity.
12. Liability scope is conservative and explicit.
13. Zero Capacity differs from unavailable Capacity.
14. Qualified Capacity does not inflate fully allocatable totals.
15. Goal Demand does not change Capacity.
16. Goal Priority does not change Capacity.
17. Capacity does not rank Goals.
18. Capacity does not recommend work.
19. Capacity does not mutate schedule.
20. Equivalent authority yields equivalent Capacity.

---

## 86. Required Feasibility Invariants

Explicitly verify:

1. Feasibility evaluates one Demand Projection at a time.
2. Feasibility consumes Capacity rather than scheduler internals.
3. Feasibility does not mutate Capacity.
4. Structural eligibility remains separate from time compatibility.
5. Infeasible Goal Demand does not reduce general Capacity.
6. Fragmented Capacity cannot satisfy indivisible Demand by summed total.
7. Splitting occurs only when Demand permits it.
8. Minimum useful fragment is respected.
9. Partial satisfaction occurs only when authorized.
10. Goal Priority does not affect single-Demand Feasibility.
11. Opportunity slices are not Capacity reservations.
12. Opportunity Sets are not Allocation.
13. Exact slice bounds do not make an opportunity a Proposal.
14. Feasibility does not create Friction.
15. Feasibility does not schedule Goal work.
16. Equivalent Demand + Capacity + policy yields equivalent Feasibility.

---

## 87. Completion Criteria

Task 8.5 is complete only when:

1. Capacity exists as a first-class derived read model.
2. Capacity is interval-based rather than scalar-first.
3. every interval belongs to one canonical user-day.
4. interval identity is deterministic.
5. occupied scheduled activity is excluded.
6. protected Buffer time is excluded distinctly.
7. attached Task 8.4 support activity is counted correctly.
8. Composite Footprint is not double-counted.
9. Composite Liability qualifies affected Capacity.
10. unresolved ordinary Commitment liability is handled conservatively.
11. overlapping exclusions subtract once.
12. general availability policy is explicit and non-inferred.
13. freshness is represented.
14. coverage is represented.
15. integrity is represented.
16. liability is represented.
17. allocability is represented.
18. zero vs unavailable remains distinct.
19. provenance/explanation is sufficient.
20. summaries derive from canonical intervals.
21. Capacity is not independently persisted as authority.
22. Goal-Specific Feasibility exists.
23. Feasibility consumes Task 8.3 Demand Projection.
24. Feasibility consumes Capacity only through its public contract.
25. structural eligibility is respected.
26. indivisible Demand respects contiguity.
27. splittable Demand respects minimum fragment rules.
28. maximum/preferred duration semantics are correctly bounded where supported.
29. partial satisfaction follows authored Demand semantics.
30. Opportunity Sets are deterministic.
31. unmet duration is explicit.
32. Feasibility does not mutate Capacity.
33. Goal Priority has no effect on single-Demand Feasibility.
34. Competing Demand is not implemented.
35. Allocation is not implemented.
36. Proposal is not implemented.
37. Accepted Allocation is not implemented.
38. Scheduled Goal Work is not implemented.
39. Goal infeasibility does not create Friction.
40. Capacity/Feasibility queries do not mutate scheduling.
41. existing scheduling remains behaviorally unchanged.
42. required focused tests pass.
43. full regression passes.
44. Prettier/typecheck/lint/build pass.
45. bundle hard policy passes.
46. bundle architecture review is recorded.
47. `CURRENT_STATE.md` is updated.
48. `CHANGELOG.md` is updated.
49. Task 8.5 RESULT artifact exists with `RESULT` in filename.
50. architecture reopen is not required.

---

## 88. Stop / Reopen Conditions

Stop and report rather than improvising if evidence shows:

* current scheduling truth cannot be consumed without mutating schedule;
* unresolved ordinary Commitment scope cannot be represented safely enough for conservative qualification;
* canonical user-day utilities cannot produce exact bounded envelopes;
* Task 8.4 Composition Footprint cannot be consumed without double-counting;
* current attached support occurrences lack stable resource identity;
* valid Capacity requires inferring unapproved general availability policy;
* Demand Projection lacks enough semantics for deterministic Feasibility;
* Feasibility would need Goal Priority to determine compatibility;
* Capacity would need Goal-specific rules to exist;
* derived Capacity would require durable authored persistence;
* current scheduler internals must become the public Feasibility contract;
* an accepted Capacity or Goal Demand invariant must be violated.

Do not work around these by:

* treating openings as Capacity without qualification;
* inventing free-time heuristics;
* treating unresolved Commitment demand as free;
* flattening Buffer/activity semantics;
* summing fragmented time for indivisible Demand;
* using Goal Priority as fit logic;
* silently implementing Allocation.

---

## 89. Expected Next Roadmap Position

Successful Task 8.5 completes Phase 8's foundational resource model:

```text
Task 8.1 — provenance / revision / freshness
      ↓
Task 8.2 — Goal Structure
      ↓
Task 8.3 — Demand / Priority / Projection

Task 8.4 — Commitment Composition
      ↓
Task 8.5 — Capacity / Goal-Specific Feasibility
```

After Task 8.5 DayFrame should possess:

* structured Goal outcome authority;
* structured Goal resource demand;
* independent Goal Priority;
* composition-aware Commitment resource cost;
* canonical demand-neutral Capacity;
* one-Demand-at-a-time Feasibility.

The next semantic transition is no longer a foundation task.

It is:

> **Competing Demand + Allocation**

which begins Phase 9 constructive planning.

Do not begin Phase 9 in Task 8.5.

---

## 90. Phase 8 Completion Check

The RESULT must explicitly assess whether Task 8.5 closes the planned Phase 8 foundation.

Verify the roadmap's Phase 8 capability:

> **User can inspect whether structured Goal demand fits actual Capacity.**

Assess whether that statement is now technically true through domain/query APIs even if broad product UI remains intentionally deferred.

If yes, state:

> **Phase 8 foundation semantics complete; ready for Phase 9 constructive planning implementation.**

If not, identify the exact missing bounded foundation and do not casually begin Allocation.

---

## 91. Recommended Next Task

If all completion criteria pass and Phase 8 closes successfully, recommend:

> **Task 9.1 — Competing Demand and Allocation V1**

The next task should consume:

* Capacity;
* Goal-Specific Feasibility;
* Goal Priority;
* Demand Projection;
* future explicit Allocation Policy;

and produce deterministic provisional allocation reasoning without yet allowing that reasoning to schedule work.

Do not implement Task 9.1 here.

---

## 92. Final Completion Statement

The Task 8.5 RESULT must end with a completion statement materially equivalent to:

> **Task 8.5 — Capacity V1 and Goal-Specific Feasibility V1 complete.**
>
> DayFrame now derives canonical demand-neutral Capacity as deterministic, explainable user-day-owned interval truth downstream of current authorized Commitment scheduling, attached support activities, protected Buffers, accepted occurrence decisions, and unresolved Commitment / Composite Liability; Capacity retains exact topology, semantic interval identity, authoritative provenance, dependency fingerprints, and orthogonal freshness, coverage, integrity, liability, and allocability qualifications rather than collapsing resource truth into one scalar or treating unavailable state as zero; overlapping occupied and protected time is conservatively unioned without double counting, composition-aware support cost remains distinct from productive Goal demand, unresolved authorized time-owning liability is never advertised as clean discretionary Capacity, and scalar summaries remain reproducible views over canonical intervals; Goal-Specific Feasibility deterministically evaluates exactly one Task 8.3 Demand Projection against current valid Capacity over an exact bounded user-day horizon, producing legal Feasible Opportunity slices and Opportunity Sets, full/partial/unmet classifications, hard incompatibility reasons, and exact Demand/Capacity provenance while respecting structural eligibility, contiguity, splitting, session bounds, and authored partial-satisfaction semantics; Feasibility neither mutates Capacity nor compares Goals, consumes Goal Priority, allocates resources, recommends action, creates Friction, or schedules work; Capacity and Feasibility remain derived/non-authoritative and do not alter existing scheduling, Preview, decisions, publication, execution, or Progress; no new Capacity authority is inferred or persisted merely because the read model exists; all focused, regression, quality, and bundle gates pass; the Phase 8 Goal-and-Capacity foundation is complete; and the repository is ready to begin the next bounded Phase 9 Competing Demand and Allocation increment without reopening accepted architecture.
