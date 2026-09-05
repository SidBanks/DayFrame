# Task 9.1 — Competing Demand and Allocation V1

**Status:** Ready for Codex
**Phase:** Phase 9 — Constructive Planning and Authorization
**Task Type:** Implementation / Derived Planning Truth / Competition Evaluation / Provisional Resource Assignment
**Primary Responsibility:** Establish deterministic Competing Demand and Allocation V1 over Phase 8 Demand Projection, Goal Priority, Goal-Specific Feasibility, and Capacity without creating Proposal, Accepted Allocation, scheduled Goal work, or any new time-owning authority.

---

## 1. Objective

Implement the first Phase 9 semantic increment:

1. **Competing Demand Set V1** as a deterministic derived evaluation context grouping active Demand Projections whose feasible opportunity claims overlap within an exact bounded horizon;
2. **competition graph / competition component derivation** from Goal-Specific Feasibility opportunity claims rather than Goal identity or requested effort alone;
3. **Allocation Policy V1** as an explicit versioned governed rule set sufficient for deterministic provisional resource distribution;
4. **Allocation V1** as explainable, non-authoritative assignment reasoning that references exact Capacity portions and provisional session partitions;
5. **full / permitted-partial / unsatisfied Allocation outcomes** respecting authored Demand semantics;
6. **Priority-aware scarce-resource distribution** using Task 8.3 Goal Priority authority without conflating Goal Priority with Commitment priority, urgency, requiredness, or hard scheduling authority;
7. **non-overlap guarantees** ensuring the same Capacity portion is never provisionally assigned more than once within one competing evaluation;
8. **deterministic bounded Allocation alternatives** where materially different valid resource distributions exist;
9. **Allocation provenance, identity, freshness, rationale, and unallocated-Capacity accounting** sufficient for the future Proposal layer;
10. **strict read-only behavior** with no schedule mutation, Capacity mutation, Proposal creation, Friction creation, persistence of derived Allocation authority, or acceptance transition.

At completion DayFrame must be able to answer:

> **Given this exact Capacity state, these exact Demand Projections, their Feasibility results, applicable Goal Priority authority, and this explicit Allocation Policy, how can scarce compatible Capacity be provisionally divided among the competing Demands, what remains unmet, and why?**

It must **not** yet answer:

> Which allocation should be presented to the user as a recommendation, how concrete placement variants should be framed, whether the user accepts the allocation, or what Goal work should become scheduled reality.

Those belong to the Proposal / Decision / Accepted Allocation increment.

---

## 2. Governing Architecture and Evidence

Before changing code, inspect repository copies of the authoritative artifacts.

At minimum inspect:

- `docs/architecture/GOAL_DEMAND_AND_ALLOCATION_ARCHITECTURE_SPECIFICATION_RESULT.md`
- `docs/architecture/CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md`
- `docs/architecture/COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_SPECIFICATION_RESULT.md`
- `docs/architecture/POST_PHASE_7_ARCHITECTURE_SYNTHESIS_RESULT.md`
- `docs/architecture/POST_PHASE_7_IMPLEMENTATION_ALIGNMENT_STRATEGY_RESULT.md`
- `docs/roadmap/POST_PHASE_7_IMPLEMENTATION_ROADMAP_RESULT.md`
- Task 8.1 RESULT
- Task 8.2 RESULT
- Task 8.3 RESULT
- Task 8.4 RESULT
- Task 8.5 RESULT
- current Goal Priority queries;
- Demand Projection queries;
- Capacity queries;
- Goal-Specific Feasibility evaluator;
- opportunity-set identity and enumeration behavior;
- current Preview/scheduling store boundaries;
- Friction;
- PlanDecision / CompositeDecision;
- publication/history;
- persistence/runtime authority registries;
- bundle policy.

The Goal Demand and Allocation Architecture Specification is normative for:

- Competing Demand;
- Allocation inputs;
- Allocation outputs;
- Goal Priority use;
- Allocation Policy;
- Allocation determinism;
- partial satisfaction;
- Allocation identity;
- Allocation staleness;
- Allocation alternatives;
- Proposal boundary;
- Accepted Allocation boundary.

Task 8.5 is the executable starting baseline.

Do not reinterpret current candidate sorting, schedule priority, or placement order as Goal Allocation policy.

---

## 3. Starting Baseline

Phase 8 has been completed and pushed.

Task 8.5 established:

- canonical demand-neutral Capacity;
- exact Capacity interval identity;
- one-user-day interval ownership;
- orthogonal freshness / coverage / integrity / liability / allocability qualifications;
- composition-aware occupied and protected-time accounting;
- conservative ordinary and Composite Liability handling;
- Goal-Specific Feasibility for exactly one Demand Projection;
- deterministic Feasible Opportunity slices;
- deterministic Opportunity Sets;
- indivisible and splittable Demand handling;
- minimum / maximum / preferred session semantics;
- session-count enforcement;
- authored partial-satisfaction semantics;
- no Goal Priority effect on single-Demand Feasibility;
- no Allocation;
- no Proposal;
- no scheduling mutation.

Recorded Task 8.5 baseline:

- **110 test files passed**
- **1,025 tests passed**
- **0 failed**
- Prettier pass
- typecheck pass
- lint pass
- build pass
- bundle hard-policy pass
- `git diff --check` pass.

Recorded production bundle:

- initial raw: **671,522 bytes**
- initial gzip: **169,915 bytes**
- largest lazy: **53,187 bytes**
- total: **854,356 bytes**

Initial gzip headroom is extremely small and total size already exceeds the architecture-review threshold.

Treat bundle growth as an active constraint.

---

## 4. Normative Planning Chain

Preserve:

```text
Goal
  ↓
Demand Intent
  ↓
Demand Projection
  ↓
Goal-Specific Feasibility
  ↓
Competing Demand Set
  ↓
Allocation
  ↓
future Proposal
  ↓
future user decision
  ↓
future Accepted Allocation
  ↓
future Scheduled Goal Work
```

And preserve independently:

```text
Commitments
  ↓
authorized scheduling
  ↓
Capacity
```

Allocation consumes Capacity.

Allocation does not alter how Capacity is produced.

---

## 5. Normative Competing Demand Definition

Implement:

> **A Competing Demand Set is a derived evaluation context containing active Demand Projections whose feasible opportunities may claim overlapping Capacity within one exact horizon.**

Competition is based on **possible claims to the same Capacity**, not merely:

- same Goal;
- same day;
- same requested duration;
- same priority;
- same horizon;
- same category.

Two Demands with provably disjoint feasible Capacity do not compete.

---

## 6. Normative Allocation Definition

Implement:

> **Allocation is deterministic, provisional, explainable assignment reasoning that references portions of current allocatable Capacity to compatible Goal Demand Projections within a Competing Demand Set under explicit Goal Priority and Allocation Policy, for construction of a Proposal. Allocation is derived, does not mutate Capacity, is not user authority, and does not create scheduled work.**

Allocation must remain distinct from:

- Demand;
- Feasibility;
- Proposal;
- Accepted Allocation;
- Commitment placement;
- scheduled reality;
- execution;
- Progress;
- Friction.

---

## 7. Epistemic Boundary

Use these classifications:

| Concept                   | Epistemic class                   |
| ------------------------- | --------------------------------- |
| Goal Priority             | Authored planning authority       |
| Demand Projection         | Derived truth                     |
| Capacity                  | Derived resource truth            |
| Goal-Specific Feasibility | Derived compatibility truth       |
| Competing Demand Set      | Derived competition context       |
| Allocation Policy         | Governed/versioned rule authority |
| Allocation                | Derived provisional reasoning     |
| Allocation Alternative    | Derived provisional reasoning     |
| Proposal                  | Future proposed action            |
| Accepted Allocation       | Future accepted authority         |
| Scheduled Goal Work       | Future scheduled reality          |

A derived Allocation does not become accepted because it:

- wins a deterministic ranking;
- is persisted in a cache;
- is displayed;
- satisfies all policy objectives;
- is the only feasible Allocation;
- was previously generated.

---

## 8. Competition Input Contract

Competing Demand derivation may consume only stable Phase 8 contracts.

At minimum:

- exact Capacity result/fingerprint;
- active applicable Demand Projections;
- exact Goal-Specific Feasibility results;
- exact evaluation horizon;
- exact Goal Priority authority needed by downstream Allocation;
- competition-policy/version;
- evaluation cutoff.

Do not bypass these contracts to inspect:

- Work;
- recurrence;
- Buffers;
- Composition relationships;
- raw schedule candidates;
- placement windows;
- scheduler internals.

---

## 9. Competition Eligibility

A Demand may enter competition only if its current planning inputs are sufficiently valid.

At minimum evaluate:

- Demand applicability;
- Demand freshness;
- structural eligibility;
- Feasibility freshness;
- Feasibility coverage;
- Capacity fingerprint compatibility;
- Feasibility result state;
- existence of at least one legally claimable Capacity opportunity.

Demand with no possible Capacity claim may remain in the overall evaluation report as unsatisfied/noncompetitive context but must not create false competition edges.

---

## 10. Competition Graph V1

Build competition from overlapping feasible claims.

Conceptually:

```text
Demand A ----\
              Capacity interval X
Demand B ----/
```

creates a competition relationship.

Where:

```text
Demand A → Capacity interval X
Demand B → Capacity interval Y
X ∩ Y = ∅
```

there is no competition edge.

The implementation may use:

- shared Capacity interval IDs;
- overlapping legal Capacity slices;
- opportunity-set claim envelopes where semantically exact;
- another bounded representation preserving actual possible overlap.

Do not infer competition merely from overlapping requested horizons.

---

## 11. Competition Components

Competing Demand Sets should normally correspond to connected components of the overlap graph.

Example:

```text
A competes with B
B competes with C
A does not directly overlap C
```

A/B/C still belong to one competition component because B links the resource contention.

A disjoint D may be evaluated independently.

Do not force every Demand in the horizon into one global competition set when resources are provably independent.

---

## 12. Single-Demand Component

A Demand with feasible Capacity but no competitor does not require scarcity resolution.

V1 may:

- emit a singleton Competing Demand Set for uniform downstream processing; or
- classify it as a non-competing Allocation context.

Choose one deterministic representation and document it.

The resulting Allocation may assign its legal Capacity according to Demand semantics, but Goal Priority must have no practical effect when no competition exists.

---

## 13. Competition Set Identity

Competing Demand Set identity must be deterministic.

Its semantic identity should include:

- competition-policy/version;
- exact Capacity fingerprint;
- exact horizon;
- exact Demand Projection identities/revisions;
- exact Feasibility result identities/fingerprints;
- overlap topology;
- evaluation cutoff where semantically required.

Do not use:

- array order;
- traversal order;
- UI order;
- random runtime IDs.

Equivalent semantic input must reproduce equivalent set identity.

---

## 14. Competition Set Output

Expose at minimum:

- Competing Set ID;
- horizon;
- Capacity fingerprint;
- Demand Projection refs;
- Feasibility refs;
- Goal refs;
- applicable Goal Priority refs;
- overlap edges/resource claims;
- connected-component membership;
- dependency fingerprint;
- freshness;
- coverage;
- structured reasons;
- provenance;
- evaluation policy/version.

The set owns no time.

---

## 15. Goal Priority Integration

Task 8.3 Goal Priority becomes a real Allocation input for the first time in Task 9.1.

Preserve:

```text
low < normal < high < critical
```

or the exact currently implemented order.

Goal Priority expresses **relative discretionary precedence**.

It does not mean:

- mandatory;
- Commitment-like;
- guaranteed hours;
- permission to displace existing Commitments;
- required Demand;
- urgency;
- deadline;
- Friction severity.

Do not reuse Commitment priority.

---

## 16. Priority Applicability

Use the current Task 8.3 priority-scope model.

V1 currently supports:

- default Goal Priority;
- bounded non-overlapping overrides.

Allocation must resolve the priority that actually applies to the Capacity claim/evaluation scope.

If one Demand horizon crosses multiple effective Priority scopes, do not silently choose:

- the highest;
- the lowest;
- the start-date priority;
- the current-date priority.

Instead use the smallest deterministic architecture-compatible approach, such as:

1. segmenting competition/allocation by exact priority-effective sub-horizon; or
2. another exact scope-preserving representation.

Document the V1 rule.

If current Priority APIs cannot safely support mixed-scope allocation, stop and report the bounded issue rather than flattening authority.

---

## 17. Same Goal / Multiple Demands

One Goal may have multiple concurrent Demand lifetimes.

Treat each Demand Projection as an independent resource request unless explicit architecture says otherwise.

They may:

- compete with other Goals;
- compete with each other if they claim overlapping Capacity;
- share the same Goal Priority because priority references the Goal.

Do not merge concurrent Demands merely because they reference one Goal.

Demand identity remains independent.

---

## 18. Allocation Inputs

Allocation must consume the accepted architecture inputs:

| Input                                      |                            Required |
| ------------------------------------------ | ----------------------------------: |
| current allocatable Capacity + fingerprint |                                 Yes |
| Demand Projections                         |                                 Yes |
| Feasibility results                        |                                 Yes |
| Goal Priority revisions                    |         Yes when competition exists |
| Allocation Policy/version                  |                                 Yes |
| evaluation horizon/cutoff                  |                                 Yes |
| stable tie-break rule/version              |                                 Yes |
| accepted reusable planning preferences     |                     Optional/future |
| target/Progress pressure                   | Optional only under explicit policy |
| learned tendency                           |            Optional/future advisory |

Task 9.1 should **not** activate optional advisory inputs unless already explicitly supported by Phase 8 authority.

---

## 19. Allocation Policy V1

Implement an explicit versioned **governed V1 Allocation Policy**.

The architecture allows Allocation Policy to govern:

- priority precedence;
- minimum viable satisfaction;
- fairness/balance;
- continuity;
- deadline-pressure treatment;
- diminishing returns;
- fragmentation avoidance;
- preservation of accepted patterns;
- optimization objective.

Task 9.1 must choose the **smallest coherent V1 policy** required to allocate current Phase 8 semantics.

Do not implement a broad user-configurable policy framework.

---

## 20. Allocation Policy V1 Minimum Requirements

The V1 policy must define at least:

1. how Goal Priority affects competing claims;
2. how Demand minimum satisfaction is protected;
3. how full versus partial satisfaction is compared;
4. how valid Capacity portions are selected without overlap;
5. how equivalent-priority ties are resolved;
6. how fragmentation is handled sufficiently to avoid invalid session shapes;
7. how unallocated Capacity is retained;
8. how deterministic alternatives are bounded.

The policy must not invent Goal Priority.

---

## 21. Allocation Policy Value Boundary

Do not silently encode major user-value assumptions such as:

- always maximize number of Goals touched;
- always fully satisfy one Goal before all others;
- always balance evenly;
- always favor deadlines;
- always favor shortest sessions;
- always maximize total hours regardless of priority.

If such a rule is necessary to make V1 deterministic, classify it explicitly as either:

- **governed technical policy**, where it only resolves equivalent semantic outcomes; or
- **user-value policy**, which requires existing authored/accepted authority.

Prefer a conservative V1 whose decisive value input is already-authored Goal Priority plus Demand minimum/partial semantics.

---

## 22. Recommended V1 Policy Shape

Unless repository evidence shows a contradiction, a coherent bounded default is:

1. honor hard Feasibility constraints;
2. honor Demand minimum-valid-satisfaction rules;
3. apply authored Goal Priority precedence;
4. never double-claim Capacity;
5. preserve valid session partitions;
6. prefer full satisfaction over permitted partial satisfaction within otherwise equivalent priority/policy state;
7. apply deterministic technical tie-break using stable semantic IDs;
8. preserve unclaimed Capacity rather than inventing additional Demand;
9. use deterministic fragmentation minimization only as a technical optimization when it does not override authored Priority or Demand semantics.

Codex must verify this against the accepted specification before implementing.

If another equally bounded policy maps repository semantics more cleanly, document it in the RESULT.

---

## 23. Policy Identity

Allocation Policy must have stable versioned identity, for example conceptually:

```text
{
  id: "goal-allocation",
  version: 1
}
```

Exact names are implementation details.

Policy identity participates in:

- Competing Set dependency context;
- Allocation identity;
- Allocation fingerprint;
- explanations;
- future Proposal provenance.

---

## 24. Technical Tie-Break V1

Tie-breaking must be deterministic and policy-versioned.

Use stable semantic identity.

Do not use:

- insertion order;
- store order;
- Goal title alphabetical order unless explicitly policy-authorized;
- array index;
- random IDs created during evaluation;
- UI sorting;
- current wall-clock timing.

A stable Goal ID / Demand ID / Capacity semantic identity ordering is acceptable as a technical tie-break if documented.

Tie-break must not masquerade as user preference.

---

## 25. Allocation Search Boundary

Allocation search must operate over feasible opportunities.

It must not rediscover Feasibility.

Do not independently ask:

- whether a session fits;
- whether a Demand is splittable;
- whether a fragment meets minimum duration;
- whether structural eligibility holds.

Those are Phase 8 responsibilities.

Allocation may combine/select only already-legal opportunity slices/sets.

---

## 26. Exact Resource Claims

Allocation must reference exact Capacity portions.

Quantity-only output such as:

```text
Goal A gets 120 minutes
```

is insufficient.

Allocation must be able to say conceptually:

```text
Demand A:
  Capacity interval C1: 09:00–10:00
  Capacity interval C4: 14:00–15:00
```

while remaining provisional.

Exact resource references are required to:

- prevent overlap;
- prove conservation;
- explain scarcity;
- support future Proposal construction.

---

## 27. Provisional Session Partitions

Group assigned Capacity portions into provisional session partitions.

Each partition must retain:

- Demand Projection ref;
- Capacity interval ref;
- exact bounds;
- duration;
- owning user-day;
- Feasibility Opportunity ref where applicable;
- session index/partition identity;
- hard-constraint provenance.

These partitions are not yet scheduled Goal work.

They own no accepted time.

---

## 28. Allocation vs Concrete Placement

Preserve the architecture distinction:

> Allocation identifies semantic resource portions and provisional session partitions. Proposal owns concrete constructive recommendation framing and placement alternatives when multiple placements are allocation-equivalent.

If Feasibility hard constraints make exact slice bounds semantically necessary, Allocation may retain them.

Do not add:

- UI recommendation language;
- “best time” copy;
- concrete placement ranking intended for user presentation;
- drag/drop Goal sessions.

---

## 29. Capacity Conservation

Within one Allocation alternative:

```text
one exact Capacity portion
→ at most one Demand claim
```

Never assign overlapping portions of Capacity to multiple Demands in the same alternative.

This must hold even when:

- Feasibility separately said both Demands could use the interval;
- Demands have the same Goal;
- Demands have equal Priority;
- one assignment is partial;
- multiple Opportunity Sets overlap.

---

## 30. Capacity Immutability

Allocation references Capacity.

It does not mutate it.

After Allocation:

- Capacity interval objects remain unchanged;
- Capacity fingerprints remain unchanged;
- Capacity summaries remain unchanged;
- no Capacity reservation state is written back.

Allocation owns provisional claim reasoning only.

---

## 31. Requested / Attributed / Assigned / Unmet Accounting

For each Demand, expose separately:

- requested effort;
- existing explicitly attributed satisfaction if Task 8.3 currently supplies it;
- remaining projected resource request;
- provisionally assigned amount;
- unmet amount.

Do not collapse them into one number.

If existing satisfaction attribution remains deferred in Task 8.3, report it as zero/not-applicable according to the current contract rather than inferring Goal-linked work.

---

## 32. Full Satisfaction

A Demand is provisionally fully satisfied only when:

- the assigned compatible portions meet the projected requested remaining effort;
- session shape remains valid;
- count/cadence semantics implemented by Feasibility remain valid;
- no Capacity overlap exists;
- relevant minimum/maximum rules remain valid.

Do not over-allocate beyond useful/requested bounds.

---

## 33. Partial Satisfaction

Partial Allocation is valid only when:

- Demand explicitly permits partial satisfaction;
- assigned amount meets explicit minimum acceptable satisfaction;
- all assigned sessions/fragments remain legal;
- session count semantics are valid;
- allocation policy permits that partial outcome.

If the minimum cannot be met:

```text
assigned = 0
```

for that Demand under that alternative.

Do not assign a token amount simply to “give every Goal something.”

---

## 34. Minimum Demand Semantics

For Demand whose semantics require a minimum:

- below-minimum assignment is invalid;
- scarcity does not convert required minimum into optional partial;
- inability to meet minimum is an unsatisfied Allocation fact.

It does not create Friction.

It does not promote the Demand to Commitment status.

---

## 35. Unmet Demand

Allocation must report exact unmet amount and reason.

Reasons may include:

- insufficient non-overlapping Capacity after higher-priority claims;
- minimum satisfaction impossible;
- all compatible opportunities consumed;
- valid opportunity exists only in another alternative;
- session-count constraints prevent remaining assignment;
- partial satisfaction disallowed.

Unmet Demand before acceptance is never Friction.

---

## 36. Unallocated Capacity

Allocation must report Capacity portions left unallocated within the evaluated scope.

Unallocated Capacity may remain because:

- no Demand can legally use it;
- all Demand is fully satisfied;
- remaining fragments violate session constraints;
- partial satisfaction is disallowed;
- policy leaves it unused.

Do not invent filler Goal work merely to maximize utilization.

---

## 37. Disjoint Demand Optimization

Demands in different competition components may be allocated independently.

Their resulting claims may then be composed into a larger evaluation result because they are provably non-overlapping.

This avoids unnecessary global combinatorial search.

Preserve component identity in provenance.

---

## 38. Allocation Alternative

An Allocation Alternative is one complete internally non-overlapping provisional distribution for one Competing Demand Set.

It must include:

- deterministic alternative ID;
- Competing Set ID/fingerprint;
- Allocation Policy/version;
- Demand assignment records;
- exact Capacity portions;
- provisional session partitions;
- full/partial/unsatisfied classifications;
- unmet amounts;
- unallocated Capacity;
- decisive rationale;
- dependency fingerprint;
- freshness/applicability.

It remains derived.

---

## 39. Multiple Allocation Alternatives

Architecture permits multiple valid Allocation alternatives.

Task 9.1 should produce multiple alternatives only when they are **materially different resource distributions**.

Do not create separate Allocations solely because:

- Proposal could phrase them differently;
- visually different but allocation-equivalent placement exists;
- UI ordering changes.

A materially different assignment of Capacity among Demands is an Allocation alternative.

---

## 40. Preferred Allocation Alternative

The Allocation engine may identify one policy-preferred alternative.

This is still derived reasoning.

It is not:

- Proposal;
- user recommendation acceptance;
- authority;
- scheduled truth.

The preferred designation must trace to explicit policy.

---

## 41. Alternative Search Bound

Search must be deterministic and bounded.

Task 8.5 already caps Feasibility alternatives at 64.

Task 9.1 must establish an explicit V1 Allocation search bound to avoid combinatorial explosion.

The exact number is an implementation decision.

Requirements:

- deterministic;
- personal-scale;
- documented;
- sufficient to exercise real competition;
- independent of runtime speed race;
- no generic optimization library.

If the search bound truncates possible alternatives, report that explicitly in derived evaluation metadata.

Truncation must not be represented as proof that no other valid Allocation exists.

---

## 42. Search Strategy

Prefer a bounded deterministic strategy such as:

- competition-component decomposition;
- priority-group processing;
- legal Opportunity Set enumeration;
- branch-and-bound or bounded backtracking;
- deterministic pruning;
- canonical claim ordering.

Do not use:

- stochastic search;
- machine learning;
- uncontrolled recursion;
- opaque external optimizer;
- nondeterministic parallel race results.

---

## 43. Allocation Ranking

If alternatives are ranked, ranking must use explicit Allocation Policy.

Do not rank by hidden heuristics.

At minimum expose decisive comparison dimensions.

Examples may include:

- priority satisfaction;
- valid minimum satisfaction;
- full versus permitted partial satisfaction;
- total productive assigned effort;
- fragmentation where explicitly governed;
- technical tie-break.

Codex must document the exact V1 order.

---

## 44. Goal Priority Precedence

Changing Goal Priority may change Allocation when Demands actually compete.

Add a direct regression:

```text
Goal A priority high
Goal B priority low
same overlapping feasible Capacity

→ policy-consistent Allocation A

then swap priorities

→ policy-consistent Allocation B
```

This must not alter:

- Capacity;
- Feasibility;
- Demand Projection.

Only Allocation changes.

---

## 45. Equal-Priority Competition

Equal Priority must remain deterministic.

Use:

- Allocation Policy;
- hard Demand semantics;
- then governed technical tie-break.

Do not manufacture a hidden user ranking.

The RESULT must explain the exact tie behavior.

---

## 46. Priority Does Not Guarantee Satisfaction

High/Critical Goal Priority does not guarantee Capacity.

If:

- no feasible opportunity exists;
- minimum cannot be satisfied;
- Capacity is unavailable;
- hard constraints conflict;

Allocation must report unsatisfied Demand.

Priority cannot override Feasibility.

---

## 47. Priority Does Not Displace Commitments

Allocation sees only Capacity already downstream of authorized Commitments.

It may never:

- move Work;
- remove Sleep;
- ignore Buffer;
- override Composite Liability;
- reclaim occupied Capacity because a Goal is `critical`.

Goal Priority acts only among discretionary Goal Demands.

---

## 48. Derived Urgency Boundary

Task 8.3 did not activate target/Progress pressure as Allocation authority.

Task 9.1 must not invent it.

Do not derive urgency from:

- target date;
- Progress;
- age of Goal;
- days remaining.

unless current accepted architecture plus implemented explicit policy authority already supports it.

Default V1 should use Goal Priority + Demand semantics only.

---

## 49. Learned Preference Boundary

No learned tendency should affect Allocation in Task 9.1.

Learning remains future analytical evidence.

Do not infer from:

- prior accepted choices;
- repeated scheduling behavior;
- historical execution.

No promotion to policy occurs automatically.

---

## 50. Freshness

Allocation freshness must depend on all material inputs.

Expected dependencies include:

- Capacity fingerprint;
- Demand Projection identities/revisions/fingerprints;
- Feasibility result fingerprints/policy;
- Goal Priority revisions/scopes;
- Allocation Policy/version;
- competition-policy/version;
- evaluation horizon;
- deterministic tie-break version;
- any optional advisory input actually consumed.

Any material change must stale prior Allocation.

---

## 51. Allocation Staleness

A stale Allocation:

- may be displayed historically later;
- may be useful for explanation;
- must not be treated as current;
- must not feed a current Proposal;
- must not be accepted.

Task 9.1 does not implement Proposal acceptance.

Expose enough freshness data for Task 9.2 to reject stale inputs safely.

---

## 52. Allocation Identity

Allocation semantic identity must include all material reasoning inputs.

At minimum:

- Competing Demand Set identity;
- Capacity fingerprint;
- Demand Projection refs;
- Feasibility refs;
- Goal Priority refs;
- Allocation Policy/version;
- horizon/cutoff;
- tie-break version;
- selected exact Capacity portions;
- Demand satisfaction result.

Equivalent semantic inputs and policy must produce equivalent Allocation identity.

---

## 53. Explainability

Allocation must explain:

- why each Demand received its assigned amount;
- why another received less or none;
- which Capacity claim caused scarcity;
- which Goal Priority mattered;
- which Demand minimum prevented partial assignment;
- why Capacity remained unused;
- which tie-break was decisive;
- which policy version governed the result.

Do not persist exhaustive search trees.

Retain decisive evidence.

---

## 54. Structured Allocation Reasons

Use structured reason codes.

Potential classes include:

- higherPriorityClaim;
- equalPriorityTieBreak;
- insufficientNonOverlappingCapacity;
- minimumSatisfactionNotMet;
- partialSatisfactionApplied;
- partialSatisfactionDisallowed;
- opportunityConsumed;
- sessionConstraint;
- fullySatisfied;
- noCompatibleOpportunity;
- unallocatedNoEligibleDemand;
- searchBoundReached.

Exact names are implementation details.

Do not use rendered prose as the semantic model.

---

## 55. Allocation Provenance

Provenance must preserve exact links to:

- Capacity;
- Competing Set;
- Demand Projections;
- Goals;
- Priority revisions;
- Feasibility results;
- Allocation Policy;
- selected opportunity sets/slices;
- technical tie-break.

Task 9.2 must not need to reverse-engineer why an Allocation exists.

---

## 56. Persistence Boundary

Competing Demand and Allocation are derived/read-model truth.

Expected V1:

- no IndexedDB authority store;
- no backup version change;
- no schema version change;
- no profile integration;
- no migration.

Do not persist Allocation merely because future Proposal will need provenance.

Future Proposal/decision history can freeze bounded exact Allocation provenance.

If a current runtime cache is added, it must be fingerprint-bound and disposable.

---

## 57. Allocation Policy Persistence Decision

Task 9.1 should prefer a **fixed governed versioned V1 Allocation Policy** rather than creating user-authored Allocation Policy authority unless repository evidence proves new user authority is required immediately.

A fixed governed policy:

- belongs in versioned code/domain semantics;
- participates in fingerprints;
- is explainable;
- does not require Backup V10.

If implementation instead introduces authored user-selectable policy, that becomes new persisted authority and requires full migration/backup design.

Do not introduce that casually.

---

## 58. Schema / Backup Baseline

Expected if policy remains governed/fixed:

```text
IndexedDB schema: 9
Backup: V9
```

No version bump for derived Competition/Allocation.

The RESULT must explicitly confirm this.

---

## 59. Store / Query Surface

Expose bounded query APIs.

At minimum:

### Competition

- derive competing context for exact horizon;
- derive competition components;
- resolve a Competing Set by semantic ID within a result;
- expose overlap claims/edges;
- expose dependencies/freshness/reasons.

### Allocation

- allocate one Competing Set;
- allocate all independent components in one bounded planning evaluation;
- resolve Allocation Alternative by semantic ID;
- expose assignment records;
- expose unallocated Capacity;
- expose rationale/provenance/fingerprint;
- expose freshness.

Do not expose raw internal search branches as public API.

---

## 60. Evaluation Input Assembly

Provide one bounded orchestration query that can assemble:

```text
Capacity
+ active Demand Projections
+ Goal-Specific Feasibility
+ Goal Priority
→ Competition
→ Allocation
```

for an exact horizon.

This orchestration must use public Phase 8 query contracts.

It must not duplicate their semantics.

---

## 61. No Schedule Mutation

Competition and Allocation queries must be pure with respect to scheduling.

They must not:

- regenerate Preview as a side effect;
- place Goal work;
- create Commitments;
- create Manual Events;
- move existing Commitments;
- create PlanDecision;
- create CompositeDecision;
- write Friction;
- publish history;
- create execution records.

---

## 62. Preview Boundary

Do not insert provisional Allocation into ordinary Preview as scheduled blocks.

Preview currently represents schedule truth/draft schedule truth.

Allocation remains planning reasoning.

If a future Proposal-preview representation is needed, that belongs in Task 9.2 or later.

---

## 63. Friction Boundary

Scarcity and unmet Goal Demand do not create Friction.

Preserve:

```text
before acceptance:
scarcity → Allocation fact

after accepted authority later becomes infeasible:
→ corrective Friction
```

Task 9.1 does not cross that line.

---

## 64. Proposal Boundary

Do not implement Proposal.

Task 9.1 must not:

- choose user-facing wording;
- create Proposal identity;
- define Proposal lifecycle;
- rank presentation choices for user consumption;
- expose Accept / Modify / Reject;
- render Proposal cards;
- create Proposal expiry;
- create No-Proposal objects.

Allocation is the internal constructive reasoning input to Proposal.

---

## 65. Accepted Allocation Boundary

Do not implement Accepted Allocation.

No Task 9.1 output may become accepted authority.

Do not:

- write accepted claim records;
- reserve Capacity durably;
- create time ownership;
- schedule Goal sessions.

Accepted Allocation begins only after an explicit future user decision.

---

## 66. PlanDecision Boundary

Existing PlanDecision concerns corrective occurrence-level scheduling choices.

Do not reuse it as Allocation acceptance merely because it already represents decisions.

Task 9.1 should not modify PlanDecision schema.

Future Proposal architecture may reuse infrastructure only after explicit boundary work.

---

## 67. CompositeDecision Boundary

CompositeDecision remains corrective/coordination authority for existing Commitment composition.

Do not use it to accept Goal Allocation.

No Task 9.1 change should reinterpret CompositeDecision.

---

## 68. Scheduled Goal Work Boundary

No scheduled Goal work exists in Task 9.1.

Provisional session partition:

```text
≠ scheduled block
≠ Commitment
≠ recurrence
≠ execution subject
```

Do not create any time-owning Goal artifact.

---

## 69. Progress Boundary

Allocation does not create Progress.

Do not infer Goal Progress from:

- requested effort;
- feasible effort;
- allocated effort;
- future preferred alternative.

Preserve:

```text
Demand
Allocation
Scheduling
Execution
Progress
```

as distinct stages.

---

## 70. Historical Seam

Task 9.1 should expose sufficient stable provenance for future Proposal/Accepted Allocation history to freeze:

- Competing Set ID/fingerprint;
- Capacity fingerprint;
- Demand Projection refs;
- Feasibility refs;
- Priority refs;
- Allocation Policy/version;
- Allocation alternative ID;
- exact Capacity claims;
- rationale;
- cutoff.

Do not persist historical Allocation independently now.

---

## 71. Determinism

Equivalent semantic inputs must produce equivalent:

- competition components;
- competition edges;
- Competing Set IDs;
- Allocation alternatives;
- exact resource claims;
- assignments;
- rankings;
- explanations;
- fingerprints.

Perturb:

- Goal insertion order;
- Demand insertion order;
- Capacity interval order;
- Feasibility result order;
- Opportunity Set order;
- Priority storage order.

Results must remain equivalent.

---

## 72. Non-Mutation

Add tests proving Competition/Allocation does not mutate:

- Capacity;
- Demand Projection;
- Feasibility results;
- Goal Priority authority;
- Preview;
- scheduling state.

Input deep equality before/after evaluation is preferred where practical.

---

## 73. Required Tests — Competition

Prove:

- overlapping feasible Capacity creates competition edge;
- disjoint feasible claims do not;
- connected overlap chain forms one component;
- disjoint groups form independent components;
- Demand with no feasible opportunities creates no false edge;
- same Goal with independent Demands may compete;
- competition identity deterministic;
- horizon mismatch fails protected;
- stale Feasibility prevents ordinary current competition;
- Priority change does not alter competition topology unless priority scope affects evaluation validity rather than claims.

---

## 74. Required Tests — Basic Allocation

Prove:

- one Demand receives legal compatible Capacity;
- two non-competing Demands can both be fully provisionally assigned;
- two competing Demands cannot receive overlapping Capacity;
- assigned slices reference exact Capacity;
- Capacity remains immutable;
- unallocated Capacity is reported;
- no scheduled Goal work appears.

---

## 75. Required Tests — Priority

Prove:

- higher Priority wins scarcity according to policy;
- swapping Priority swaps policy outcome where all else equivalent;
- equal Priority resolves deterministically;
- Critical Priority cannot use infeasible Capacity;
- Goal Priority does not displace Commitment-owned time;
- Commitment priority is not read by Allocation;
- Priority does not alter Feasibility.

---

## 76. Required Tests — Minimum / Partial

Prove:

- full satisfaction when enough Capacity exists;
- permitted partial allocation meets explicit minimum;
- permitted partial below minimum assigns zero;
- disallowed partial assigns zero when full fit impossible;
- minimum Demand is not token-satisfied;
- unmet minutes exact;
- one Goal receiving partial cannot overlap another Goal's claim;
- remaining Capacity may serve another Demand.

---

## 77. Required Tests — Session Shape

Prove Allocation never combines Feasibility slices into an illegal session structure.

At minimum:

- indivisible Demand remains one legal partition;
- splittable Demand preserves minimum fragment;
- maximum duration remains respected;
- session count remains valid;
- Allocation does not invent a new slice not present in compatible Feasibility possibilities.

---

## 78. Required Tests — Alternatives

Prove:

- materially different resource distributions produce distinct deterministic Allocation alternatives;
- allocation-equivalent presentation variants do not;
- preferred alternative follows policy;
- alternative IDs deterministic;
- search bound deterministic;
- truncation metadata appears when bound is reached;
- no alternative double-claims Capacity internally.

---

## 79. Required Tests — Explanations

Prove rationale distinguishes at least:

- higher Priority claim;
- tie-break;
- minimum satisfaction failure;
- partial satisfaction;
- no compatible Capacity;
- Capacity left unused;
- search bound/truncation where applicable.

Reasons must reference decisive semantic inputs.

---

## 80. Required Tests — Freshness

Prove Allocation becomes stale/rederives when:

- Capacity fingerprint changes;
- Demand revision changes;
- Feasibility changes;
- Priority revision changes;
- Allocation Policy version changes;
- relevant horizon changes.

Prove unrelated Goal metadata does not stale Allocation when absent from dependencies.

---

## 81. Required Tests — Read-Only Boundary

Prove Competition/Allocation evaluation causes:

- no store authority revision;
- no persistence write;
- no Preview mutation;
- no Friction creation;
- no PlanDecision creation;
- no CompositeDecision creation;
- no publication;
- no execution;
- no Progress mutation.

---

## 82. Full Regression Preservation

Keep green all Phase 8 and pre-Phase-8 guarantees:

- canonical user-day;
- Work/cycles;
- Commitments;
- recurrence;
- Sleep;
- manual events;
- Buffers;
- Composition;
- Composite Liability;
- Friction;
- PlanDecision;
- CompositeDecision;
- Preview freshness;
- publication/history;
- execution;
- Progress;
- Goal Structure;
- Goal Demand/Priority;
- Capacity;
- one-Demand Feasibility;
- backup/restore;
- Month;
- Today;
- Summary;
- DF-006.

Task 9.1 may not weaken Phase 8 invariants.

---

## 83. Performance

Allocation introduces combinatorial risk.

Keep it bounded.

Prefer:

- competition components;
- indexed Capacity claims;
- bitset/set-style claim tracking where lightweight;
- deterministic bounded search;
- early rejection of overlapping claims;
- priority-group pruning;
- reusable immutable Feasibility results.

Do not import a generic optimization solver.

Measure representative multi-Goal cases if useful.

---

## 84. Bundle Architecture Review

Bundle review is mandatory.

Starting Task 8.5 baseline:

- raw: **671,522**
- gzip: **169,915**
- largest lazy: **53,187**
- total: **854,356**

Requirements:

1. keep competition/allocation domain and orchestration lazy where practical;
2. avoid new eager UI;
3. avoid solver/graph libraries;
4. inspect current lazy boundaries before adding imports;
5. record exact before/after deltas;
6. pass all hard limits.

Because gzip headroom is extremely small, any eager production growth requires explicit mitigation.

Do not obscure semantics solely for bundle accounting.

---

## 85. UI Boundary

Task 9.1 should remain non-UI.

Do not add broad:

- Goal Allocation screen;
- Proposal cards;
- Capacity claiming UI;
- accept/reject controls;
- schedule visualization of provisional Goal work.

Domain/query APIs and tests are sufficient.

State explicitly in RESULT:

> Task 9.1 intentionally introduces no user-facing Allocation authority or recommendation surface.

---

## 86. Accessibility

Expected:

> No new interactive accessibility surface introduced.

If a tiny diagnostic surface is unexpectedly required, it must:

- distinguish derived versus accepted state;
- not rely on color;
- expose priority/rationale semantics;
- remain keyboard accessible.

Prefer no UI.

---

## 87. Persistence / Migration

Expected:

- no new persistent authority;
- no DB schema bump;
- no Backup bump;
- no migration.

If fixed governed Allocation Policy is implemented in code, it is policy identity, not persisted user authority.

If repository evidence forces authored policy authority, stop and reassess scope rather than silently adding persistence.

---

## 88. Profiles

Profiles do not own:

- Competition;
- Allocation;
- Allocation alternatives.

Profile changes may change upstream authored scheduling and therefore derived Capacity/Allocation after recomputation.

Do not persist Allocation inside profiles.

---

## 89. Full-Clear

Derived Competition/Allocation need no durable clear participant.

If runtime memoization is introduced:

- reset/full-clear test helpers must clear it;
- no cached result survives semantic authority reset.

---

## 90. DF-006 Boundary

Task 9.1 must not reinterpret Work/cycle historical semantics.

Allocation consumes Capacity, not Work internals.

Keep DF-006 regressions green.

No new Work repair belongs here.

---

## 91. Governance

At completion:

- update `docs/architecture/CURRENT_STATE.md`;
- update `docs/architecture/CHANGELOG.md`;
- update `DECISIONS.md` only if a genuinely new durable architectural decision was necessary;
- do not rewrite accepted Goal Demand/Allocation specification;
- do not rewrite Capacity specification;
- do not rewrite roadmap;
- do not rewrite Phase 8 RESULT artifacts.

Expected:

> **Architecture Reopen Check: No**

unless executable evidence exposes a contradiction.

---

## 92. Repository Discipline

Phase 8 has been pushed.

Before implementation:

1. inspect `git status`;
2. confirm the pushed Phase 8 checkpoint baseline;
3. preserve any unrelated local user work;
4. identify Task 9.1 changes separately;
5. do not clean unrelated state;
6. do not commit;
7. do not push unless explicitly instructed.

At completion report:

- starting commit/checkpoint;
- files added;
- files modified;
- unrelated/pre-existing changes;
- whether commit occurred;
- whether push occurred.

Expected: no commit/push by Codex.

---

## 93. Validation Commands

Run repository-supported equivalents of:

```bash
npx prettier --check .
npm test -- --reporter=dot
npm run typecheck
npm run lint
npm run build
npm run check:bundle
git diff --check
```

Also run focused suites for:

- competition topology;
- disjoint components;
- priority handling;
- minimum/partial satisfaction;
- exact Capacity conservation;
- Allocation alternatives;
- determinism;
- freshness;
- Capacity immutability;
- scheduling non-interference;
- persistence non-interference;
- Goal Priority;
- Feasibility;
- Composition;
- Preview;
- Friction;
- publication;
- execution;
- Progress;
- DF-006.

Do not claim completion with a failing required gate.

---

## 94. Required Result Artifact

Create a durable Phase 9 Markdown result artifact.

The filename must include **`RESULT`**.

Preferred filename:

```text
TASK_9.1_COMPETING_DEMAND_AND_ALLOCATION_V1_RESULT.md
```

Place it in the dedicated Phase 9 implementation-results folder, creating the Phase 9 folder only if repository conventions require it and it does not already exist.

The RESULT must include at minimum:

1. Executive Result
2. Scope Delivered
3. Governing Evidence
4. Phase 8 Baseline
5. Task 8.3 Demand/Priority Integration
6. Task 8.5 Capacity/Feasibility Integration
7. Files Added
8. Files Modified
9. Competing Demand Definition
10. Competition Input Contract
11. Competition Eligibility
12. Competition Graph
13. Competition Components
14. Singleton / Non-Competing Behavior
15. Competing Set Identity
16. Competing Set Output
17. Goal Priority Integration
18. Priority Scope Handling
19. Same-Goal Multiple Demand Handling
20. Allocation Definition
21. Allocation Inputs
22. Allocation Policy V1
23. Allocation Policy Identity
24. Policy Value Boundary
25. Technical Tie-Break
26. Allocation Search Boundary
27. Exact Resource Claims
28. Session Partition Model
29. Capacity Conservation
30. Capacity Immutability
31. Requested / Assigned / Unmet Accounting
32. Full Satisfaction
33. Partial Satisfaction
34. Minimum Satisfaction
35. Unmet Demand
36. Unallocated Capacity
37. Disjoint Component Composition
38. Allocation Alternative
39. Preferred Alternative
40. Search Bound
41. Search Strategy
42. Ranking
43. Equal-Priority Behavior
44. Priority Swap Behavior
45. Derived Urgency Boundary
46. Learning Boundary
47. Allocation Identity
48. Freshness
49. Explainability
50. Structured Reasons
51. Provenance
52. Persistence Decision
53. Schema / Backup Decision
54. Profile Compatibility
55. Store / Query Surface
56. Evaluation Orchestration
57. Scheduling Non-Interference
58. Preview Boundary
59. Friction Boundary
60. Proposal Boundary
61. Accepted Allocation Boundary
62. PlanDecision / CompositeDecision Boundary
63. Scheduled Goal Work Boundary
64. Progress Boundary
65. Historical Provenance Seam
66. Tests Added
67. Competition Tests
68. Priority Tests
69. Minimum / Partial Tests
70. Session Tests
71. Alternatives Tests
72. Determinism Tests
73. Freshness Tests
74. Read-Only Regression Tests
75. Full Regression Result
76. Validation Commands / Results
77. Bundle Architecture Review
78. Performance Notes
79. Accessibility Notes
80. Compatibility Notes
81. DF-006 Relationship
82. V1 Design Decision Table
83. Boundary Matrix
84. Invariant Verification
85. Implementation Decisions
86. Deviations
87. Architecture Reopen Check
88. Governance Updates
89. Repository Status
90. Completion Assessment
91. Recommended Next Task
92. Completion Statement

---

## 95. Required V1 Design Decision Table

Include:

| Question                    | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| --------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| competition host            |             |                     |                    |                     |
| competition edge definition |             |                     |                    |                     |
| component derivation        |             |                     |                    |                     |
| singleton handling          |             |                     |                    |                     |
| Competing Set identity      |             |                     |                    |                     |
| Priority scope resolution   |             |                     |                    |                     |
| same-Goal multiple Demands  |             |                     |                    |                     |
| Allocation Policy           |             |                     |                    |                     |
| policy identity/version     |             |                     |                    |                     |
| priority precedence         |             |                     |                    |                     |
| minimum satisfaction        |             |                     |                    |                     |
| partial satisfaction        |             |                     |                    |                     |
| tie-break                   |             |                     |                    |                     |
| exact Capacity claim model  |             |                     |                    |                     |
| session partition model     |             |                     |                    |                     |
| alternative generation      |             |                     |                    |                     |
| search bound                |             |                     |                    |                     |
| ranking                     |             |                     |                    |                     |
| fragmentation handling      |             |                     |                    |                     |
| unallocated Capacity        |             |                     |                    |                     |
| persistence/cache           |             |                     |                    |                     |
| Proposal handoff            |             |                     |                    |                     |
| UI exposure                 |             |                     |                    |                     |

Clearly mark:

- implemented;
- represented but not consumed;
- deferred.

---

## 96. Required Boundary Matrix

The RESULT must verify:

| Concept                       | Status after 9.1 | Authored / Derived          | Owns Time?              | May Change Schedule? |
| ----------------------------- | ---------------- | --------------------------- | ----------------------- | -------------------- |
| Goal                          | Existing         | Authored                    | No                      | No                   |
| Goal Priority                 | Existing         | Authored planning authority | No                      | No                   |
| Demand Intent                 | Existing         | Authored                    | No                      | No                   |
| Demand Projection             | Existing         | Derived                     | No                      | No                   |
| Capacity                      | Existing         | Derived                     | No                      | No                   |
| Feasibility                   | Existing         | Derived                     | No                      | No                   |
| Competing Demand Set          | New              | Derived                     | No                      | No                   |
| Allocation Policy             | New governed V1  | Governed rule authority     | No                      | No                   |
| Allocation                    | New              | Derived                     | No                      | No                   |
| Allocation Alternative        | New              | Derived                     | No                      | No                   |
| Provisional session partition | New              | Derived                     | No                      | No                   |
| Proposal                      | Future           | Proposed                    | No                      | No                   |
| ProposalDecision              | Future           | Decision                    | No independently        | Future               |
| Accepted Allocation           | Future           | Accepted authority          | Authorizes future claim | Future               |
| Scheduled Goal Work           | Future           | Scheduled reality           | Yes                     | Future               |
| Friction                      | Existing         | Derived corrective          | No                      | Corrective only      |
| Progress                      | Existing         | Observation/derived         | No                      | No automatic effect  |

---

## 97. Required Invariant Verification

Explicitly verify:

1. Goal still owns no time by existence.
2. Demand still requests resources without owning time.
3. Capacity remains demand-neutral.
4. Feasibility remains one-Demand compatibility truth.
5. Competition derives only from overlapping possible Capacity claims.
6. Disjoint Demands do not falsely compete.
7. Allocation is deterministic.
8. Allocation is provisional.
9. Allocation does not mutate Capacity.
10. Allocation does not mutate Feasibility.
11. Allocation does not become authority because policy prefers it.
12. Goal Priority remains distinct from Commitment priority.
13. Allocation Policy does not manufacture Goal Priority.
14. high Priority cannot override hard Feasibility.
15. Priority cannot displace Commitments.
16. same Capacity portion is not assigned twice in one alternative.
17. partial Allocation requires authored permission.
18. partial Allocation respects minimum thresholds.
19. invalid below-minimum partial assigns zero.
20. unmet Demand is not Friction.
21. unallocated Capacity remains visible.
22. same-Goal Demands remain independently identified.
23. exact resource claims remain provisional.
24. provisional session partitions are not scheduled work.
25. Allocation alternatives are materially different resource distributions.
26. allocation-equivalent Proposal placement variants remain downstream.
27. technical tie-break is deterministic and non-authoritative.
28. derived urgency does not silently become Priority.
29. learned history does not silently influence authority.
30. stale Allocation cannot feed current acceptance.
31. Proposal remains the constructive recommendation boundary.
32. no unaccepted Goal work appears in Preview as scheduled reality.
33. no Goal-driven time ownership exists before explicit future acceptance.
34. Demand / Allocation / scheduling / execution / Progress remain distinct.
35. equivalent semantic input yields equivalent Competition and Allocation.

---

## 98. Completion Criteria

Task 9.1 is complete only when:

1. Competing Demand Set exists as a first-class derived model.
2. Competition is based on overlapping feasible Capacity claims.
3. disjoint competition components are supported.
4. competition identity is deterministic.
5. exact horizon/fingerprint dependencies are retained.
6. Goal Priority enters Allocation for the first time.
7. Priority scope is handled without flattening authority.
8. same-Goal multiple Demands remain distinct.
9. Allocation Policy V1 is explicit and versioned.
10. Allocation Policy does not invent Goal Priority.
11. technical tie-break is deterministic.
12. Allocation consumes Feasibility rather than rediscovering it.
13. Allocation references exact Capacity portions.
14. provisional session partitions are represented.
15. one Capacity portion cannot be double-assigned.
16. Capacity remains immutable.
17. requested / assigned / unmet effort remains distinct.
18. full satisfaction is exact.
19. partial satisfaction requires authored permission.
20. minimum satisfaction is enforced.
21. invalid partial assigns zero.
22. unallocated Capacity is retained.
23. Allocation alternatives are deterministic.
24. alternative search is bounded.
25. search truncation is explicit.
26. preferred alternative follows explicit policy.
27. explanations identify decisive Priority/policy/constraint/tie-break evidence.
28. Allocation freshness depends on all material inputs.
29. stale Allocation is protected.
30. Competition and Allocation are unpersisted derived truth.
31. DB schema remains 9 unless a justified authored authority is introduced.
32. Backup remains V9 unless a justified authored authority is introduced.
33. no Proposal is implemented.
34. no Accepted Allocation is implemented.
35. no Scheduled Goal Work is implemented.
36. no Goal Allocation creates Friction.
37. no query mutates scheduling.
38. no query mutates Progress.
39. all focused tests pass.
40. full regression passes.
41. Prettier passes.
42. typecheck passes.
43. lint passes.
44. build passes.
45. bundle hard policy passes.
46. `git diff --check` passes.
47. bundle architecture review is recorded.
48. `CURRENT_STATE.md` is updated.
49. `CHANGELOG.md` is updated.
50. Task 9.1 RESULT exists with `RESULT` in the filename.
51. architecture reopen is not required.

---

## 99. Stop / Reopen Conditions

Stop and report rather than improvising if evidence shows:

- Feasibility opportunity claims cannot be compared for overlap without bypassing the Capacity contract;
- Priority scope cannot be resolved over mixed horizons without flattening authored authority;
- Allocation requires redefining Goal Priority;
- current Feasibility does not expose enough exact Capacity identity for non-overlap;
- legal provisional partitions cannot be represented without creating scheduled blocks;
- deterministic Allocation requires an unapproved user-value policy;
- exact Capacity claim semantics require Proposal placement semantics;
- Allocation cannot remain derived/unpersisted;
- a current Phase 8 invariant must be violated;
- bundle hard limits cannot be met without architectural distortion.

Do not solve these by:

- using Goal title ordering as hidden preference;
- assigning by array order;
- treating first Feasibility alternative as authoritative;
- converting Allocation into Commitment placement;
- reserving Capacity in state;
- generating Proposal inside Allocation;
- converting scarcity into Friction;
- ignoring mixed Priority scope;
- using stochastic optimization.

---

## 100. Expected Next Roadmap Position

Successful Task 9.1 completes:

```text
Capacity
+ Demand Projection
+ Feasibility
+ Goal Priority
+ Allocation Policy
        ↓
Competing Demand
        ↓
Allocation
```

The next roadmap increment is the authority transition:

> **Proposal / ProposalDecision / Accepted Allocation**

That increment may consume Task 9.1 Allocation alternatives and determine:

- what recommendations to present;
- Proposal identity/lifecycle;
- Proposal Horizon;
- ranking/presentation;
- No-Proposal semantics;
- accept / modify / reject / ignore / expiry;
- immutable accepted claim authority;
- freshness/revalidation.

Do not implement those here.

---

## 101. Phase 9 Position

Task 9.1 is the first Phase 9 implementation task.

Its job is to cross from:

```text
Can each Goal fit?
```

to:

```text
How could scarce Capacity be divided?
```

It must **not** yet cross to:

```text
What should DayFrame recommend?
```

or:

```text
What has the user authorized?
```

Phase 9 remains governed by:

> **Commitments own time. Goals compete for Capacity. DayFrame proposes. The user authorizes.**

Task 9.1 implements the **Goals compete for Capacity** clause.

---

## 102. Recommended Next Task

If Task 9.1 completes without architecture reopen, recommend the next bounded task according to the accepted Phase 9 roadmap.

Expected:

> **Task 9.2 — Proposal, ProposalDecision, and Accepted Allocation V1**

However, inspect the accepted Constructive Proposal architecture before fixing final 9.2 scope.

Do not begin Task 9.2 within this task.

---

## 103. Final Completion Statement

The Task 9.1 RESULT must end with a completion statement materially equivalent to:

> **Task 9.1 — Competing Demand and Allocation V1 complete.**
>
> DayFrame now derives deterministic Competing Demand Sets from active Demand Projections whose Goal-Specific Feasibility opportunities make overlapping claims on the same current Capacity, decomposing independent scarcity into bounded competition components while preserving exact Demand, Goal, Feasibility, Capacity, Priority, horizon, provenance, and freshness identity; Goal Priority now participates only in scarce discretionary Goal competition and remains distinct from Commitment priority, requiredness, urgency, and time-owning authority; a versioned governed Allocation Policy applies explicit priority precedence, Demand minimum and partial-satisfaction semantics, stable technical tie-breaking, bounded alternative search, and exact non-overlapping Capacity conservation without inventing user preference or bypassing Feasibility; Allocation deterministically produces provisional exact Capacity claims, legal session partitions, requested/assigned/unmet accounting, unallocated Capacity, materially distinct alternatives, policy-preferred reasoning, structured rationale, provenance, semantic identity, and staleness while leaving Capacity and all upstream planning truth immutable; no Capacity portion is provisionally assigned more than once within an Allocation alternative, invalid partial satisfaction receives zero rather than token allocation, and unmet scarce Demand remains an Allocation fact rather than Friction; Competing Demand and Allocation remain derived, disposable, non-authoritative, and non-scheduling, introduce no accepted claim or Goal work, do not alter Preview, publication, execution, Progress, PlanDecision, or CompositeDecision, and require no persistence/schema/backup change under the governed V1 policy; all focused, regression, quality, determinism, read-only, performance, and bundle gates pass; Proposal remains the first constructive recommendation boundary and Accepted Allocation remains the future user-authority transition; and the repository is ready to proceed to the next bounded Phase 9 Proposal / ProposalDecision / Accepted Allocation increment without reopening accepted architecture.
