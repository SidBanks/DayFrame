# Goal Demand and Allocation Architecture Specification Result

## 1. Executive Specification

This document is the authoritative DayFrame contract for Goal Demand, Goal-Specific Feasibility, Competing Demand, Allocation, and Accepted Allocation.

> **Goal Demand is a versioned planning-resource request, associated with one Goal, that expresses authorized resource-seeking intent without owning time. A deterministic Demand Projection interprets that intent for a bounded user-day-based horizon. Goal-Specific Feasibility evaluates the projection against immutable current allocatable Capacity. Allocation provisionally and explainably assigns compatible Capacity portions among competing projections under explicit priority and policy. Proposal presents constructive recommendations. Only explicit user acceptance creates Accepted Allocation authority from which time-owning Scheduled Goal Work may be derived.**

Key decisions:

- A Goal may have zero or multiple independent Demand lifetimes.
- Authored Demand Intent and Derived Demand Projection are separate epistemic objects.
- Goal priority is separate horizon-capable authored planning-priority authority, not a Commitment priority field.
- Feasibility enumerates compatible opportunity slices and preference annotations without choosing them.
- Allocation references exact Capacity portions and provisional session partitions, but concrete placement alternatives remain Proposal responsibility when they are allocation-equivalent.
- Partial satisfaction is permitted only where Demand Intent declares it meaningful and minimum satisfaction is met.
- Existing linked Commitments count toward Demand only through explicit, versioned satisfaction attribution; they never automatically imply Progress.
- Accepted Allocation records one-off or bounded-repeat authority. Acceptance of a reusable recurring pattern creates or revises a distinct authored scheduling pattern/Commitment authority.
- Rejection and learned tendencies never silently become reusable preference or priority.

The current implementation remains `GD5`, `GF4`, `AL4`, and `AA4`; this specification defines future architecture and makes no implementation change.

**Recommended next step: Path A — Constructive Proposal Architecture Audit.** Goal Demand and Allocation are now fully specified; Proposal identity, alternative presentation, acceptance mechanics, and compatibility with Preview/PlanDecision remain the next evidence question.

## 2. Architectural Context

The normative chain is:

```text
Goal + Authored Demand Intent
  → Demand Projection
Capacity → Goal-Specific Feasibility
  → Competing Demand Set
  → Allocation
  → Proposal
  → User Accept / Modify / Reject
  → Accepted Allocation or authored recurring pattern
  → Scheduled Goal Work
  → Friction when later infeasible
  → Execution → Progress → Summary
```

Capacity remains demand-neutral and immutable to every downstream consumer. Commitments retain precedence because they already own time. Allocation is deterministic reasoning, not authority. Proposal is constructive; Friction is corrective.

## 3. Epistemic Model

| Concept | Epistemic category | Authority meaning |
|---|---|---|
| Goal | Authored truth | Desired outcome identity/context; no time ownership |
| Demand Intent | Authored truth | Authorized request for DayFrame to seek resources |
| Demand Projection | Derived truth | Horizon-specific deterministic interpretation |
| Goal Priority | Authored planning truth | Relative discretionary importance within effective scope |
| Feasibility | Derived truth | Compatibility of one projection with Capacity |
| Competing Demand | Derived truth | Demands capable of claiming overlapping Capacity |
| Allocation Policy | Authored/fixed versioned planning rule | Governs distribution; never creates Goal priority |
| Allocation | Derived truth | Provisional Capacity assignment reasoning |
| Proposal | Proposed action | Constructive recommendation for decision |
| Accepted Allocation | Accepted decision | User authority for identified resource claim/scope |
| Scheduled Goal Work | Derived scheduled reality | Time-owning realization of accepted authority |
| Execution | Executed/historical truth | What occurred |

No derived object becomes authored or accepted truth merely by being persisted, cached, ranked first, or rendered in Preview.

## 4. Goal Boundary

A Goal describes an outcome the user wants and MUST NOT own time merely by existing. Goal owns identity, description, lifecycle, target date, measurement context, and exact provenance links. It may be referenced by planning-priority authority.

Requested effort, session constraints, Capacity references, allocations, Proposals, and accepted scheduling scope remain outside Goal. Goal priority does not belong directly in the core Goal record: it is planning-context authority that may vary by horizon without revising outcome identity.

## 5. Normative Goal Demand Definition

> **Goal Demand is an independently identified, versioned, user-authorized planning-resource request made in service of one Goal. It describes the amount, shape, horizon, and permitted satisfaction of resources DayFrame should seek, while remaining non-time-owning, non-allocated, unscheduled, and distinct from Progress until explicit user authority accepts an allocation or authors reusable scheduling intent.**

Goal Demand is not Goal identity, Commitment, Capacity, feasibility, priority, policy, Allocation, Proposal, Accepted Allocation, scheduled work, execution, or Progress.

## 6. Goal Demand Identity and Lifecycle

A Goal may have zero, one, or multiple concurrent Demand lifetimes. Each lifetime has opaque never-reused identity, parent Goal identity, monotonic revision, created/updated/effective timestamps, and lifecycle.

Lifecycle states are conceptually active, suspended, expired, completed/satisfied, and retired. Exact implementation labels are non-normative.

- Edits preserving purpose and horizon lineage revise the same Demand.
- A materially independent purpose, horizon stream, or replaced retired Demand creates a new lifetime.
- Suspension preserves identity/history and excludes current projection/allocation.
- Expiration ends applicability without deleting history.
- Goal completion suspends active Demand by default pending explicit policy; Goal archival makes it ineligible for new projection/allocation.
- A Demand may exist while ineligible because its Goal, horizon, inputs, or authority is inactive/protected.
- Historical identity and every revision survive current changes.

## 7. Authored Demand Intent

Authored Demand Intent contains only user-authorized resource-seeking facts: Goal association, requested amount/unit, horizon rule, hard session constraints, permitted splitting, cadence/count where applicable, optional/target/minimum semantics, allowable satisfaction by existing Commitments, and authority scope.

Defaults affecting meaning require explicit acceptance or a governed clearly disclosed default. Intent MUST NOT contain derived Capacity, chosen sessions, allocation result, inferred urgency, learned tendency, Proposal framing, or execution outcome.

## 8. Derived Demand Projection

A Demand Projection is a disposable deterministic interpretation of one active Demand revision for an exact evaluation horizon and policy version.

It may normalize units, enumerate horizon-relative requested quantities/session needs, account for explicitly attributed existing authorized work, and derive labelled pressure signals from target date or Progress under explicit policy. It MUST retain field-level lineage and MUST NOT invent requested effort.

Projection identity depends on Demand revision, Goal/lifecycle facts used, horizon, attribution state, Progress/target facts used, and projection-policy version. Any such change stales the projection. A decision-time projection may be frozen with Proposal/decision provenance; current projections are not independent authority.

## 9. Goal Demand Dimensions

| Dimension | Required / Optional / Excluded | Authored / Derived / Mixed | Semantic class | Provenance |
|---|---|---|---|---|
| Goal identity | Required | Authored reference | Identity | Goal/Demand revision |
| Requested effort | Required | Authored; normalized derived | Hard request | Value/unit/transform |
| Planning horizon | Required | Authored rule + derived exact bounds | Hard scope | User-day bounds/policy |
| Minimum useful session | Required unless indivisible exact session | Authored | Hard constraint | Intent revision |
| Preferred session duration | Optional | Authored | Preference | Intent revision |
| Maximum session duration | Optional | Authored | Hard constraint | Intent revision |
| Splittability/contiguity | Required | Authored | Hard constraint | Intent revision |
| Cadence/session count | Optional | Authored + projected | Constraint/preference as declared | Rule/projection |
| Earliest/latest useful time | Optional | Authored/projected | Hard constraint | User-day resolution |
| Time-of-day | Optional | Authored | Hard or preference explicitly | Intent classification |
| Workday/off-day compatibility | Optional | Authored | Hard or preference explicitly | Intent/policy |
| Work-relative timing | Optional | Authored + derived anchor | Hard or preference explicitly | Anchor provenance |
| Deadline relevance | Optional | Goal fact + policy-derived | Advisory pressure | Goal/policy/cutoff |
| Optional/target/minimum | Required semantic mode | Authored | Demand semantics | Intent revision |
| Minimum acceptable satisfaction | Optional | Authored | Allocation constraint | Intent revision |
| Maximum useful allocation | Optional | Authored | Allocation bound | Intent revision |
| Progress relationship | Optional | Explicit policy + derived | Projection input | Definition/observation/cutoff |
| Existing Commitment attribution | Optional | Authored mapping + derived coverage | Satisfaction accounting | Exact sources/policy |
| Goal priority | Excluded | Separate authority | Allocation input | Priority revision |
| Concrete proposed placement | Excluded | Proposal | Recommendation | Proposal provenance |

## 10. Hard Constraints vs Preferences

A **hard Demand constraint** defines when Capacity cannot satisfy Demand. A **Goal preference** distinguishes more desirable from less desirable hard-compatible opportunities.

| Expression | Classification |
|---|---|
| Minimum 60 minutes | Hard |
| Exact 60-minute session | Hard minimum and maximum |
| Evening preferred | Preference |
| Evening required | Hard |
| After Work preferred | Preference |
| After Work required | Hard |
| Weekday preferred | Preference |
| Weekday required | Hard |
| Split sessions allowed | Hard partition permission |
| Maximum session duration | Hard |

Feasibility filters only on hard constraints and annotates preference compatibility. Ranking preference tradeoffs belongs to Allocation policy or Proposal, not feasibility truth.

## 11. Demand Horizon

Requested effort is meaningful only within a bounded horizon resolved into exact canonical user-day windows. Supported architectural forms include exact user-day range, next N canonical user-days, user-week, bounded period ending by target date, work-cycle scope, or bounded session/count rule.

Calendar month is presentation shorthand resolved to component user-days. Partial horizon coverage MUST yield partial projection/feasibility and MUST NOT imply unmet demand outside observed coverage. Demand may span multiple Capacity queries only when their canonical coverage and common dependency identity can be composed without overlap or gaps.

## 12. Cadence and Frequency

Total effort states quantity; session count states partition count; cadence states distribution constraints/preferences; recurrence is time-owning pattern expansion only after appropriate acceptance.

Cadence may be authored as hard or preferred intent and projected onto exact user-day horizons. “Three sessions this week” remains recurring Demand, not Monday/Wednesday/Friday Commitment recurrence. Proposal chooses a concrete pattern; acceptance scope determines whether it is one-off, bounded repeat, or reusable recurrence authority.

## 13. Splittability and Contiguity

- Indivisible Demand requires one compatible contiguous opportunity.
- Splittable Demand declares minimum useful fragment, optional preferred/maximum fragment, total effort, and permitted session/count rules.
- Feasibility enumerates legal opportunity slices/sets.
- Allocation chooses provisional portions among feasible sets.
- Partial satisfaction is valid only when allowed and above minimum acceptable satisfaction.

Three 30-minute intervals MUST NOT satisfy a 90-minute contiguous Demand. They MAY satisfy a 90-minute splittable Demand only when 30-minute fragments and applicable cadence/count are permitted.

## 14. Optional vs Required Demand

Demand semantics may express aspirational maximum, target, or minimum acceptable satisfaction. “Required” means the user wants the allocator to treat the stated minimum as indivisible for a valid allocation; it does not make unmet discretionary Demand a Commitment or Friction.

If the minimum cannot be met, Allocation reports the Demand unsatisfied. No resource is silently assigned below the minimum.

## 15. Existing Commitment Satisfaction Accounting

Use **Model C with bounded Model D derivation**: explicit Demand-Satisfaction Attribution identifies which exact existing Commitment sources/occurrences may satisfy a Demand; a versioned deterministic policy calculates projected scheduled coverage.

Rules:

- A Goal link alone does not establish satisfaction.
- Attribution is explicit and Demand-specific.
- Current scheduled effort may reduce remaining projected Demand only under the declared policy/horizon.
- Unplaced/skipped/omitted work is classified explicitly, not assumed satisfied.
- Execution and Goal Progress remain separate.
- Attribution preserves exact source incarnation/occurrence and Demand revision.
- The same authorized effort MUST NOT be counted twice within one Demand projection or competing set.

## 16. Target Date and Derived Pressure

Target date is authored Goal context. A versioned projection/allocation policy MAY derive time remaining, pace pressure, or horizon urgency. These are advisory derived signals.

They may influence projection horizon, Allocation policy, or Proposal explanation only with provenance. They MUST NOT silently create requested effort, hard deadline authority, Goal priority, or Friction.

## 17. Progress and Demand Projection

Observed Progress and remaining outcome gap MAY influence Demand Projection only through an explicit versioned relationship policy accepted or clearly governed for that Demand. The projection records exact definition, observation, cutoff, and transform.

Progress changes MUST NOT automatically authorize more or less time. They may change a derived projection or pressure signal; that change stales dependent feasibility/allocation/Proposal. Scheduled or executed effort is not automatically outcome Progress.

## 18. Goal Priority

Goal Priority is separate authored planning-priority authority referencing a Goal and effective scope/horizon. It ranks discretionary outcome demands when Capacity is scarce.

It may vary over time/horizon without revising Goal identity. Changing it creates a planning-priority revision, not a Goal revision. With one competing Goal it does not change feasibility, though it remains explanatory context.

Derived urgency is a separate labelled signal and never mutates priority. Commitment priority continues to protect/order authorized obligations upstream of Capacity.

## 19. Goal Priority Semantics

Use a small ordered relative level system with stable total ordering semantics; exact labels/UI are non-normative. Levels express relative precedence among applicable Goal Demands, not guaranteed hours, mandatory status, or permission to displace Commitments.

Equivalent priority ties are resolved by Allocation policy and deterministic semantic identity. Horizon-specific overrides must declare scope and revision. Pairwise preferences or arbitrary numeric weights are not required for the first architecture contract.

## 20. Goal-Specific Feasibility

> **Goal-Specific Feasibility is a deterministic, non-authoritative evaluation of one explicit Demand Projection against current allocatable Capacity for an exact horizon, producing compatible opportunities, preference annotations, and unsatisfied-demand information without mutating Capacity, comparing Goals, allocating resources, recommending action, or scheduling work.**

Inputs: Demand Projection identity, current valid allocatable Capacity, exact horizon, and feasibility-policy version.

Outputs: compatible opportunity sets/slices, compatible duration, unsatisfied duration, session/contiguity results, hard incompatibility reasons, preference annotations, Capacity/Demand references, coverage, and dependency identity.

## 21. Feasible Opportunity Model

Feasibility returns zero or more **opportunity sets**. Each set references whole Capacity intervals or legal slices sufficient to demonstrate a possible Demand partition. It MAY return multiple alternatives and aggregate fit information.

It MUST NOT reserve, choose, rank across Goals, or convert an opportunity into scheduled placement. Slices express possible resource bounds, not chosen start times. When a hard relation requires exact temporal position to prove fit, the opportunity may include exact bounds without becoming Allocation or Proposal.

## 22. Feasibility Hardness and Preference

Feasibility MUST return only hard-compatible opportunities. It MAY attach deterministic preference annotations or scores whose policy and inputs are explicit. Such scores do not choose an opportunity and MUST NOT compare Goals.

Hard incompatibility reasons are exhaustive enough to explain no fit; soft preference misses remain compatible and are reported separately. Ranked cross-demand choice belongs to Allocation; user-facing framing belongs to Proposal.

## 23. Competing Demand Set

A Competing Demand Set is a derived evaluation context containing active Demand Projections whose feasible opportunities may claim overlapping Capacity within one exact horizon.

It includes Capacity fingerprint, projection identities/revisions, Goal priority revisions, feasibility results/policy, allocation-policy context, accepted reusable preferences if applicable, and evaluation cutoff. Demands with provably disjoint Capacity do not compete and MAY be evaluated independently. Competition groups may be connected components of overlapping opportunity claims rather than one global set.

## 24. Normative Allocation Definition

> **Allocation is deterministic, provisional, explainable assignment reasoning that references portions of current allocatable Capacity to compatible Goal Demand Projections within a Competing Demand Set under explicit Goal Priority and Allocation Policy, for construction of a Proposal. Allocation is derived, does not mutate Capacity, is not user authority, and does not create scheduled work.**

Allocation is distinct from Demand, feasibility, Proposal, Accepted Allocation, Commitment placement, scheduled reality, and Friction.

## 25. Allocation Inputs

| Input | Classification | Required? |
|---|---|---:|
| Current allocatable Capacity and fingerprint | Derived resource truth | Yes |
| Demand Projections | Derived from authored intent | Yes |
| Feasibility results | Derived | Yes |
| Goal Priority revisions | Authored planning authority | Yes where competition exists |
| Allocation Policy/version | Fixed governed or user-authored policy | Yes |
| Evaluation horizon/cutoff | Query context | Yes |
| Accepted reusable planning preferences | Authored authority | Optional |
| Target/Progress pressure | Derived advisory signal | Optional under policy |
| Learned tendency | Historical analytical evidence | Optional advisory only |
| Stable tie-break rule/version | Governed derivation policy | Yes |

Allocation MUST NOT inspect Work, recurrence, buffer, user-day, placement, or other scheduler internals bypassing Capacity/feasibility contracts.

## 26. Allocation Outputs

| Output | Status |
|---|---|
| Allocation identity and policy version | Required |
| Capacity/Competing Set fingerprints | Required |
| Goal and Demand Projection references | Required |
| Assigned Capacity interval portions | Required |
| Assigned duration and provisional session partition | Required |
| Full/partial/unsatisfied classification and unmet amount | Required |
| Unallocated Capacity references | Required for evaluated competing scope |
| Rationale, decisive constraints, priority/policy/tie-break explanation | Required |
| Provenance and freshness/applicability | Required |
| Alternative Allocation references | Optional |
| Concrete user-facing placement/recommendation text | Proposal responsibility |
| Accepted/scheduled/executed state | Excluded |

## 27. Allocation Granularity

Allocation uses a layered level: exact Capacity interval portions grouped into provisional session partitions and summarized by Demand/horizon. Quantity-only allocation is insufficient; concrete scheduled sessions are too authoritative.

Allocation portions establish non-overlap and resource accounting. If multiple exact placements within the same referenced portion satisfy identical constraints, changing among them does not change semantic Allocation and belongs to Proposal placement. A hard constraint that makes the exact slice semantically material remains part of Allocation identity.

## 28. Partial Satisfaction

Partial Allocation is valid only when Demand Intent permits it and the assigned amount/partition meets the minimum acceptable satisfaction and minimum useful fragment/cadence rules.

Allocation reports requested, attributed-existing, provisionally assigned, and unmet amounts separately. If minimum satisfaction cannot be met, assign zero to that Demand under that alternative. Unmet Demand before acceptance is an allocation fact, never Friction.

## 29. Allocation Policy

Allocation Policy is the explicit versioned rule set governing scarce-resource distribution. It may cover priority precedence, minimum viable satisfaction, fairness/balance, deadline-pressure treatment, continuity, diminishing returns, fragmentation avoidance, preservation of accepted patterns, and optimization objective.

Semantics affecting user values require authored or explicitly accepted policy. Technical deterministic tie-breaks may be fixed governed policy. Heuristics remain non-authoritative, versioned, and explainable. Policy identity participates in Allocation identity and provenance.

## 30. Priority, Policy, Heuristics, and Learning

| Input | Authority | Feasibility? | Allocation? | Proposal? | Automatic authority? |
|---|---|---:|---:|---:|---:|
| Goal Priority | Authored planning authority | No | Yes | Explain | No |
| Allocation Policy | Governed/authored rule authority | No | Yes | Explain | No |
| Engine heuristic | Derived versioned rule | Preference annotations only | Tie/optimization | Yes | No |
| Target/Progress pressure | Derived advisory | Only if hard policy explicitly says so | Yes under policy | Explain | No |
| Learned preference evidence | Analytical historical evidence | No | Optional advisory | Yes | No |
| Commitment priority | Authored obligation property | Upstream of Capacity | No | Context only | No |

Learned evidence may suggest a reusable preference; only explicit promotion creates authority.

## 31. Allocation Determinism

Semantically equivalent Capacity fingerprint, Projection identities/content, feasibility results/policy, Goal Priority authority, Allocation Policy/version, evaluation horizon/cutoff, accepted reusable preferences, applicable advisory signals, and tie-break version MUST produce equivalent Allocations.

Runtime insertion, array order, UI order, random IDs generated during evaluation, or storage enumeration MUST NOT decide results. Ties use stable semantic identities under a versioned rule.

## 32. Allocation Explainability

Allocation provenance MUST answer why each Demand received its amount, why another received less/none, why Capacity remained unused, and why a changed priority/target/progress fact changed the result.

Required explanation facts: Competing Set, Goal priorities, policy/version, feasibility alternatives, selected portions, unmet amounts, decisive hard/minimum constraints, advisory pressure, accepted reusable preference, and tie-break. Exhaustive search-tree logging is not required; decisive alternatives and rule applications are.

## 33. Allocation Identity and Staleness

Allocation is ephemeral/cacheable derived state. Its semantic identity includes Capacity fingerprint/policy, Competing Set, Demand Projections, feasibility-policy/results, Goal priorities, Allocation Policy, horizon/cutoff, accepted preferences, advisory signals used, and tie-break version.

Any material change stales the Allocation. A stale Allocation MUST NOT create a current Proposal or acceptance. It may be retained only as explicit historical Proposal/decision provenance. Current Allocation is never independently editable or authored authority.

## 34. Allocation Alternatives

Allocation MAY produce multiple valid, deterministically identified alternatives plus an optional policy-preferred alternative. Alternative generation belongs to Allocation/search because each is a different resource distribution. Ranking uses explicit policy.

Proposal selects or presents one or more alternatives and adds concrete recommendation framing/placement. Equivalent placement variants within one Allocation remain Proposal alternatives rather than separate Allocations unless they change material Capacity portions or Demand satisfaction.

## 35. Allocation vs Proposal

Allocation determines how Capacity could be provisionally distributed under policy. Proposal transforms identified Allocation reasoning into concrete constructive recommendation for user consideration.

The handoff includes Allocation identity, Demand/Capacity references, provisional assignments/session partitions, rationale, policy/version, unmet Demand, alternatives, and freshness. Proposal adds identity, concrete placement choices, user-facing explanation, validity horizon, and accept/modify/reject affordances.

## 36. Proposal Placement Boundary

Feasibility identifies legal opportunity bounds. Allocation assigns Capacity portions. Proposal selects concrete times when more than one placement realizes the same assignment.

Changing exact placement does not change Allocation when Goal, Demand, Capacity portion, duration, session partition, satisfaction, and policy consequences remain equivalent. It does change Proposal. Exact position belongs in Allocation only when it changes a hard Demand constraint, Capacity portion claim, competing-resource outcome, or satisfaction semantics.

## 37. Accepted Allocation

> **Accepted Allocation is versioned user-authored planning authority created by accepting or modifying a Proposal, or equivalent direct authoring, which authorizes identified Goal Demand to claim identified Capacity-derived planning resources at an explicit scope.**

It records Goal/Demand, Proposal/Allocation, Capacity context, accepted portions/duration/session pattern, scope, user delta, timestamp, provenance, supersession, and applicability. It is planning authority, not execution evidence.

## 38. Time-Ownership Transition

Accepted Allocation authorizes a resource claim; **Scheduled Goal Work is the derived time-owning realization**. This preserves accepted authority separately from generated occurrence geometry.

One-off Accepted Allocation derives one or more bounded occurrences. A recurring-pattern acceptance creates/revises a distinct authored scheduling pattern/Commitment authority, from which occurrences own time. Movement/cancellation changes accepted authority or uses an applicable bounded decision; execution remains historical evidence.

## 39. Accepted Allocation Scope

| Scope | Meaning | Architectural home |
|---|---|---|
| One-off | Named allocation/occurrence only | Accepted Allocation |
| Bounded repeating | Defined count/horizon and rule | Accepted Allocation if fully bounded |
| Recurring pattern | Open/reusable scheduling authority | Transition to authored pattern/Commitment authority |
| Preference | Guides later Proposals, schedules nothing | Separate reusable preference authority |

Scope is explicit and never inferred from repeated decisions. Expiry, cancellation, supersession, and source lifetime are required.

## 40. Modification Semantics

Modification preserves the immutable original Proposal, Allocation, Capacity context, and Demand context plus the exact user-authored delta and final accepted scope.

- A within-alternative placement/duration change may create Accepted Allocation directly if validity can be rechecked deterministically.
- A change of Goal, Demand, Capacity outside offered bounds, competition outcome, or recurrence scope requires new feasibility/allocation evaluation before acceptance.
- Historical records retain both proposed and accepted content; the Proposal is never rewritten.

## 41. Rejection Semantics

Rejection schedules nothing and changes neither Goal, Demand, Capacity, Goal Priority, nor Allocation Policy. It may be durable bounded decision evidence.

If retained, it includes Proposal/Allocation identity, Demand references, Capacity context/fingerprint, rejected scope/content, timestamp, and optional rationale. It MUST NOT automatically select an alternate, delete Demand, lower priority, or create reusable preference.

## 42. Reusable Preference Boundary

Accepted Allocation is authority for its explicit scope. Repeated accepted choices are historical evidence. A learned tendency is derived analysis. An explicitly promoted reusable preference is separate authored authority guiding future Allocation/Proposal. Goal Priority ranks outcomes; Allocation Policy governs distribution.

No transition among these occurs automatically. Promotion requires explicit user authority and preserves the evidence/suggestion that motivated it.

## 43. Recurring Demand vs Recurring Authority

- Recurring Demand is repeated non-time-owning resource request.
- Recurring Accepted Allocation is bounded repeated resource authority.
- Recurring scheduling pattern is reusable time-owning authored authority.
- Reusable preference guides future proposals without scheduling.

Recurring Demand never creates recurring Scheduled Goal Work. Only explicit bounded-repeat acceptance or pattern authoring crosses the authority boundary.

## 44. Goal Demand and Existing Commitments

Demand projection may report total requested, explicitly attributed existing authorized effort, remaining discretionary Demand, and attribution coverage.

For a three-hour Study Demand with two hours of attributed recurring Study Commitment, projection may request one remaining hour. The attribution must bind exact source lifetime/occurrences and policy. A generic Goal link alone is insufficient, and the two scheduled hours do not imply execution or Goal Progress.

## 45. Progress Boundary

- Demand satisfaction: requested resource covered provisionally or authoritatively.
- Allocated effort: Capacity provisionally assigned.
- Accepted effort: user-authorized resource claim.
- Scheduled effort: authorized work placed in time.
- Executed effort: observed outcome of scheduled activity.
- Goal Progress: outcome measurement under a Goal measurement policy.

Each may be evidence for another only through explicit versioned policy and provenance. None is automatically equivalent.

## 46. Friction Boundary

- insufficient Capacity for unaccepted Demand: feasibility fact;
- competing Demands: allocation problem;
- inability to construct a useful Proposal: Proposal limitation;
- accepted Goal Work later conflicting: corrective Friction;
- reusable accepted pattern failing to instantiate: potentially Friction;
- Goal behind schedule/Progress target: not automatically Friction.

Proposal remains constructive and Friction corrective.

## 47. Historical Provenance

At decision time the architecture must be able to freeze: Goal snapshot, Demand Intent/revision, Demand Projection, Goal Priority, relevant Capacity context, feasibility, Competing Set, Allocation Policy/version and Allocation, Proposal, accept/reject/modify result, Accepted Allocation scope, and user delta.

Scheduled occurrence, execution, and Progress provenance remain separately historical. References are permitted where immutable content-addressed facts remain resolvable; otherwise bounded facts must be frozen. Discarded search branches need not be persisted unless presented as a decision alternative.

## 48. Summary Boundary

| Fact | Category |
|---|---|
| Requested Goal effort | Authored Demand / derived projection with label |
| Feasible Demand | Derived compatibility |
| Allocated effort | Derived provisional reasoning |
| Accepted effort | Accepted planning authority |
| Scheduled effort | Plan/historical-plan fact |
| Executed effort | Execution evidence |
| Unmet Demand | Derived projection/allocation fact |
| Proposal acceptance/rejection | Decision history |
| Capacity utilization | Derived analysis over correctly scoped facts |
| Goal Progress | Derived outcome measurement |

Summary is read-only and MUST preserve category, coverage, cutoff, and provenance rather than collapsing these into a universal success score.

## 49. Existing Primitive Compatibility

| Specification Requirement | Existing Primitive | Reuse Classification | Future Requirement | Architectural Risk |
|---|---|---|---|---|
| Goal identity/lifecycle | `GoalV1`/surface | Directly Reusable | Demand reference/applicability | None if Goal remains time-neutral |
| Goal revisions | Goal authority | Directly Reusable | Historical Goal binding | Current revision not historical truth |
| Goal links | Exact incarnation links | Reusable with Adaptation | Explicit Demand satisfaction attribution | Link alone overclaims satisfaction |
| Measurement/Progress | Definition/observation/query | Reusable with Adaptation | Optional projection signals | Progress could be mistaken for effort |
| Source incarnation | Authored lifetimes | Directly Reusable | Demand/pattern attribution | Same-lifetime revisions also needed |
| Recurrence | Commitment recurrence | Conceptually Related but Wrong Abstraction | Project cadence only after proper authority | Demand is not recurrence authority |
| Block duration | Commitment demand | Reusable with Adaptation | Feasibility arithmetic | Commitment semantics too strong |
| Preferred windows | Commitment placement | Reusable with Adaptation | Hard/preference demand matching | Current enum mixes meaning |
| Work-relative placement | Candidate scheduling | Reusable with Adaptation | Opportunity compatibility | Raw Work bypass/off-day ambiguity |
| Open-window/fit | Candidate placement | Reusable with Adaptation | Pure feasibility | Chooses placement and lacks Capacity provenance |
| Candidate sorting | Commitment ordering | Not Reusable | New Allocation Policy | Wrong priority/authority |
| PlanDecision | Occurrence acceptance/replay | Conceptually Related but Wrong Abstraction | Accepted Allocation infrastructure patterns | Wrong target/scope/provenance |
| Suggested fixes/Friction | Corrective choices | Conceptually Related but Wrong Abstraction | Choice UI patterns only | Corrective not constructive |
| Preview | Generated scheduled Commitments | Conceptually Related but Wrong Abstraction | Proposed-item visualization with separation | Unaccepted work could publish as scheduled |
| Historical publication | Frozen plan provenance | Reusable with Adaptation | Freeze accepted Goal-work lineage | Must exclude unaccepted Proposal |
| Execution history | Outcome evidence | Directly Reusable | Link accepted/scheduled Goal work | Must not imply Progress |

Prior focused validation passed 12 files/137 tests, substantiating current primitives. No new executable claim required redundant testing.

## 50. Normative Worked Examples

### Example A — Active Goal Without Demand

An active “Learn Spanish” Goal has no Demand Intent. It produces no projection, consumes no Capacity, enters no Competing Set, and creates no Proposal.

### Example B — One Goal, Ample Capacity

Study requests two 60-minute sessions this user-week. Feasibility returns several opportunity sets; Allocation provisionally assigns two Capacity portions; Proposal chooses concrete placements. Time ownership begins only after acceptance.

### Example C — Fragmented Capacity

Three 30-minute intervals cannot satisfy one 90-minute contiguous Demand. Feasibility returns no compatible opportunity though total Capacity equals 90 minutes.

### Example D — Splittable Demand

A 120-minute Demand allowing two or more 30-minute fragments may be satisfied by two 60-minute or four 30-minute opportunities subject to cadence. Allocation selects a legal partition; Proposal selects concrete presentation/placement.

### Example E — Two Goals, Scarce Capacity

Study and Fitness each request two hours but share only three compatible hours. They form a Competing Set. Priority and Allocation Policy determine deterministic provisional alternatives; scarcity is not Friction.

### Example F — Target-Date Pressure

A near target date creates a labelled derived pressure signal under policy. It may influence Allocation and explanation but cannot alter authored priority or requested effort.

### Example G — Existing Linked Commitment

A three-hour Study Demand explicitly attributes two scheduled hours from an existing Study Commitment. Projection requests one remaining hour. Goal link alone would not suffice; none of the scheduled time automatically becomes Progress.

### Example H — User Rejects Proposal

Rejecting Tuesday Study schedules nothing and changes no Demand, Capacity, priority, or policy. Bounded rejection provenance may remain.

### Example I — User Modifies Proposal

Changing proposed 90 minutes Tuesday to 60 Wednesday preserves original Proposal/Allocation and records the delta. If Wednesday was a validated offered alternative, acceptance creates bounded authority; otherwise re-evaluation is required.

### Example J — One-Off vs Recurring Acceptance

Accepting Tuesday authorizes Tuesday only. Accepting a bounded four-week pattern authorizes that scope. Creating an open recurring Study pattern transitions to separate authored scheduling authority. Repetition never escalates scope silently.

### Example K — Accepted Goal Work Becomes Infeasible

A Work change invalidates Capacity and conflicts with accepted Study work. Current Capacity describes the new resource state; the time-owning accepted work enters corrective Friction.

### Example L — Progress Changes Demand Projection

A new observation narrows remaining outcome gap under an explicitly configured projection policy. The derived Demand Projection may decrease and stale Allocation/Proposal, but authored Demand Intent and Goal Priority remain unchanged.

## 51. Goal Demand and Allocation Invariants

1. **GDA-INV-01:** A Goal MUST NOT own time merely by existing.
2. **GDA-INV-02:** Goal Demand MUST request resources without becoming scheduled work.
3. **GDA-INV-03:** Every Demand Projection MUST trace to authorized Demand Intent and explicit policy.
4. **GDA-INV-04:** Authored and derived Demand facts MUST retain field-level provenance.
5. **GDA-INV-05:** Target/Progress pressure MUST NOT silently become Goal Priority.
6. **GDA-INV-06:** Goal evaluation MUST NOT mutate general Capacity.
7. **GDA-INV-07:** Feasibility MUST NOT allocate, recommend, or schedule.
8. **GDA-INV-08:** Competing Demand scarcity MUST NOT itself create Friction.
9. **GDA-INV-09:** Allocation MUST be deterministic and provisional.
10. **GDA-INV-10:** Allocation MUST NOT mutate Capacity.
11. **GDA-INV-11:** Allocation MUST NOT become authority because it satisfies policy.
12. **GDA-INV-12:** Goal Priority and Commitment priority MUST remain distinct.
13. **GDA-INV-13:** Allocation Policy MUST NOT manufacture Goal Priority.
14. **GDA-INV-14:** Heuristics/learning MUST remain subordinate to authority.
15. **GDA-INV-15:** Proposal MUST remain the constructive recommendation boundary.
16. **GDA-INV-16:** Unaccepted Goal work MUST NOT appear as scheduled reality.
17. **GDA-INV-17:** Goal-driven time ownership MUST follow explicit user authority.
18. **GDA-INV-18:** One-off acceptance MUST NOT create recurring authority.
19. **GDA-INV-19:** Rejection MUST NOT create reusable preference automatically.
20. **GDA-INV-20:** Existing Goal-linked work MUST NOT be double-counted as Demand.
21. **GDA-INV-21:** Demand satisfaction, allocation, scheduling, execution, and Progress MUST remain distinct.
22. **GDA-INV-22:** Historical decision truth MUST NOT be reconstructed from mutable current state.
23. **GDA-INV-23:** A Demand lifetime MUST retain stable identity across revisions and never be reused after retirement.
24. **GDA-INV-24:** Partial Allocation MUST satisfy explicit Demand permission and minimum thresholds.
25. **GDA-INV-25:** Allocation MUST NOT assign overlapping Capacity portions more than once within a competing evaluation.
26. **GDA-INV-26:** Stale Allocation or Proposal MUST NOT be accepted without current revalidation.
27. **GDA-INV-27:** Concrete placement MUST remain downstream when it does not change semantic Allocation.
28. **GDA-INV-28:** A Goal link MUST NOT by itself establish Demand satisfaction.

## 52. Architecture Decisions

Each decision below is normative. “Downstream” identifies remaining Proposal or implementation detail, not an unresolved Goal Demand/Allocation fundamental.

### GDA-SPEC-01 — Goal / Goal Demand Separation
- **Decision:** Separate outcome identity from resource request.
- **Normative Rule:** Goal existence MUST NOT produce Demand.
- **Reasoning:** Goals do not own time.
- **Consequences:** Zero/multiple Demands per Goal.
- **Implementation Constraint:** No scheduling fields added implicitly to Goal.
- **Remaining Downstream Question:** None.

### GDA-SPEC-02 — Goal Demand Definition
- **Decision:** Adopt section 5.
- **Normative Rule:** Demand requests but does not own resources.
- **Reasoning:** Preserves user-authority transition.
- **Consequences:** Independent identity/authority needed.
- **Implementation Constraint:** No direct scheduled occurrences from Demand.
- **Remaining Downstream Question:** None.

### GDA-SPEC-03 — Goal Demand Identity and Lifecycle
- **Decision:** Opaque lifetime, revisions, concurrent Demands, explicit states.
- **Normative Rule:** Retired identity is never reused.
- **Reasoning:** Horizons/purposes vary independently.
- **Consequences:** History binds exact revisions.
- **Implementation Constraint:** Protected lifecycle transitions.
- **Remaining Downstream Question:** State labels.

### GDA-SPEC-04 — Authored Intent vs Derived Projection
- **Decision:** Separate authored intent and disposable horizon projection.
- **Normative Rule:** Projection MUST NOT invent effort.
- **Reasoning:** Interpretation is not authority.
- **Consequences:** Field lineage and policy version required.
- **Implementation Constraint:** Separate fingerprints/staleness.
- **Remaining Downstream Question:** Projection mechanics.

### GDA-SPEC-05 — Demand Dimensions
- **Decision:** Use section 9's bounded dimensions.
- **Normative Rule:** Priority/Proposal fields are excluded.
- **Reasoning:** Avoid all-purpose container.
- **Consequences:** Hardness and source explicit.
- **Implementation Constraint:** Validate coherent combinations.
- **Remaining Downstream Question:** Supported V1 subset.

### GDA-SPEC-06 — Hard Constraint vs Preference Boundary
- **Decision:** Hard filters; soft annotates desirability.
- **Normative Rule:** Preference miss MUST NOT imply infeasibility.
- **Reasoning:** Compatibility differs from ranking.
- **Consequences:** Feasibility output carries both separately.
- **Implementation Constraint:** Every timing rule declares hardness.
- **Remaining Downstream Question:** Preference scoring.

### GDA-SPEC-07 — Demand Horizon
- **Decision:** Every projection has bounded canonical user-day horizon.
- **Normative Rule:** Partial coverage remains explicit.
- **Reasoning:** Effort lacks meaning without period.
- **Consequences:** Month is presentation shorthand.
- **Implementation Constraint:** Exact user-day composition.
- **Remaining Downstream Question:** Default authoring choices.

### GDA-SPEC-08 — Cadence and Frequency
- **Decision:** Cadence remains Demand until authority transition.
- **Normative Rule:** It MUST NOT create recurrence automatically.
- **Reasoning:** Repeated request is not repeated authorization.
- **Consequences:** Proposal/acceptance chooses pattern.
- **Implementation Constraint:** Separate recurrence vocabulary.
- **Remaining Downstream Question:** Proposal cadence presentation.

### GDA-SPEC-09 — Splittability and Contiguity
- **Decision:** Intent declares partition permissions and fragment bounds.
- **Normative Rule:** Aggregate duration MUST NOT bypass contiguity.
- **Reasoning:** Preserves Capacity topology.
- **Consequences:** Opportunity sets required.
- **Implementation Constraint:** Deterministic partition validation.
- **Remaining Downstream Question:** Search optimization.

### GDA-SPEC-10 — Existing Commitment Satisfaction Accounting
- **Decision:** Explicit attribution plus versioned projection.
- **Normative Rule:** Goal link alone MUST NOT count.
- **Reasoning:** Prevents double scheduling and false Progress.
- **Consequences:** Total/attributed/remaining reported separately.
- **Implementation Constraint:** Bind exact source lifetimes/occurrences.
- **Remaining Downstream Question:** Attribution authoring UX.

### GDA-SPEC-11 — Target-Date and Progress Signals
- **Decision:** Permit derived advisory signals under explicit policy.
- **Normative Rule:** Signals MUST NOT change authored effort/priority.
- **Reasoning:** Useful context without silent authority.
- **Consequences:** Changes stale dependent projections.
- **Implementation Constraint:** Exact cutoff/provenance.
- **Remaining Downstream Question:** Policies offered.

### GDA-SPEC-12 — Goal Priority
- **Decision:** Separate authored horizon-capable planning-priority authority.
- **Normative Rule:** It MUST NOT reuse Commitment priority.
- **Reasoning:** Outcome importance differs from obligation protection.
- **Consequences:** Priority revision independently stales Allocation.
- **Implementation Constraint:** Stable ordered semantics.
- **Remaining Downstream Question:** UI labels.

### GDA-SPEC-13 — Goal-Specific Feasibility
- **Decision:** Adopt section 20's pure evaluator.
- **Normative Rule:** No mutation, competition, allocation, recommendation, or scheduling.
- **Reasoning:** Single-demand compatibility is distinct.
- **Consequences:** Capacity is sole resource input.
- **Implementation Constraint:** No raw scheduler bypass.
- **Remaining Downstream Question:** None.

### GDA-SPEC-14 — Feasible Opportunity Model
- **Decision:** Return legal Capacity slices/opportunity sets.
- **Normative Rule:** Opportunities MUST NOT reserve Capacity.
- **Reasoning:** Allocation needs topology and alternatives.
- **Consequences:** Aggregate fit alone insufficient.
- **Implementation Constraint:** Reference stable Capacity identities.
- **Remaining Downstream Question:** Enumeration limits.

### GDA-SPEC-15 — Competing Demand Set
- **Decision:** Group projections by overlapping feasible resource claims.
- **Normative Rule:** Disjoint Demands need not compete globally.
- **Reasoning:** Narrow competition is clearer/deterministic.
- **Consequences:** Connected evaluation groups.
- **Implementation Constraint:** Fingerprint set/horizon/cutoff.
- **Remaining Downstream Question:** Scaling strategy.

### GDA-SPEC-16 — Allocation Definition
- **Decision:** Adopt section 24.
- **Normative Rule:** Allocation remains derived/provisional.
- **Reasoning:** User authority belongs after Proposal.
- **Consequences:** No scheduled blocks from Allocation.
- **Implementation Constraint:** Immutable Capacity references.
- **Remaining Downstream Question:** None.

### GDA-SPEC-17 — Allocation Inputs
- **Decision:** Use declared contracts in section 25.
- **Normative Rule:** Raw scheduler internals are forbidden.
- **Reasoning:** Preserves Capacity responsibility.
- **Consequences:** Every advisory input labelled.
- **Implementation Constraint:** Validate freshness/coverage.
- **Remaining Downstream Question:** None.

### GDA-SPEC-18 — Allocation Output Contract
- **Decision:** Use exact portions, partitions, satisfaction, rationale, identity.
- **Normative Rule:** Accepted/executed states are excluded.
- **Reasoning:** Enough for Proposal without authority leakage.
- **Consequences:** Unallocated resource explicit.
- **Implementation Constraint:** Non-overlap conservation checks.
- **Remaining Downstream Question:** Serialization only if cached.

### GDA-SPEC-19 — Allocation Granularity
- **Decision:** Exact Capacity portions grouped as provisional sessions.
- **Normative Rule:** Equivalent exact placements remain Proposal variants.
- **Reasoning:** Quantity alone loses topology; sessions risk scheduling.
- **Consequences:** Material slice changes alter Allocation.
- **Implementation Constraint:** Define semantic equivalence.
- **Remaining Downstream Question:** Proposal placement identity.

### GDA-SPEC-20 — Partial Satisfaction
- **Decision:** Allow only with explicit permission/minimum compliance.
- **Normative Rule:** Below-minimum assignment is zero satisfaction.
- **Reasoning:** Avoid misleading partial plans.
- **Consequences:** Unmet Demand explicit, not Friction.
- **Implementation Constraint:** Conservation arithmetic.
- **Remaining Downstream Question:** None.

### GDA-SPEC-21 — Allocation Policy
- **Decision:** Explicit versioned distribution rule set.
- **Normative Rule:** Value judgments require authority/governance and provenance.
- **Reasoning:** Priority alone cannot resolve allocation.
- **Consequences:** Different policies may yield valid alternatives.
- **Implementation Constraint:** Policy participates in identity.
- **Remaining Downstream Question:** Initial policy catalog.

### GDA-SPEC-22 — Goal Priority vs Allocation Policy vs Heuristics
- **Decision:** Maintain three separate layers plus learned evidence.
- **Normative Rule:** None may silently become another.
- **Reasoning:** Preserves authority and explanation.
- **Consequences:** Field-level sources exposed.
- **Implementation Constraint:** No blended opaque score.
- **Remaining Downstream Question:** Proposal disclosure depth.

### GDA-SPEC-23 — Allocation Determinism
- **Decision:** Equivalent semantic inputs yield equivalent output.
- **Normative Rule:** Runtime/order randomness is forbidden.
- **Reasoning:** Reproducibility/trust.
- **Consequences:** Stable tie-break identity/version.
- **Implementation Constraint:** Canonical inputs/outputs.
- **Remaining Downstream Question:** None.

### GDA-SPEC-24 — Allocation Explainability
- **Decision:** Preserve decisive rules, alternatives, portions, and unmet reasons.
- **Normative Rule:** Each assignment/non-assignment MUST be explainable.
- **Reasoning:** Policy output is otherwise opaque.
- **Consequences:** No exhaustive search log required.
- **Implementation Constraint:** Structured rationale/provenance.
- **Remaining Downstream Question:** UI narrative.

### GDA-SPEC-25 — Allocation Identity and Staleness
- **Decision:** Content/fingerprint identity over every material input.
- **Normative Rule:** Stale Allocation MUST NOT be proposed/accepted as current.
- **Reasoning:** Allocation is context-dependent.
- **Consequences:** Historical copy only with decision provenance.
- **Implementation Constraint:** Dependency comparison/revalidation.
- **Remaining Downstream Question:** Cache mechanics.

### GDA-SPEC-26 — Allocation Alternatives
- **Decision:** Permit deterministically identified/ranked alternatives.
- **Normative Rule:** Placement-equivalent variants are not distinct Allocations.
- **Reasoning:** Resource distributions may genuinely differ.
- **Consequences:** Proposal may choose/present alternatives.
- **Implementation Constraint:** Explain ranking/equivalence.
- **Remaining Downstream Question:** Proposal selection UX.

### GDA-SPEC-27 — Allocation / Proposal Boundary
- **Decision:** Allocation distributes; Proposal recommends concretely.
- **Normative Rule:** Allocation MUST NOT expose itself as user authority.
- **Reasoning:** Constructive boundary remains explicit.
- **Consequences:** Formal handoff required.
- **Implementation Constraint:** Proposal references immutable Allocation.
- **Remaining Downstream Question:** Proposal schema.

### GDA-SPEC-28 — Placement Boundary
- **Decision:** Exact placement is Proposal responsibility unless allocation-material.
- **Normative Rule:** Equivalent placement changes MUST NOT change Allocation.
- **Reasoning:** Avoids recreating Preview scheduling as Allocation.
- **Consequences:** Feasibility bounds → portions → concrete Proposal.
- **Implementation Constraint:** Hard/material test required.
- **Remaining Downstream Question:** Proposal placement algorithm.

### GDA-SPEC-29 — Accepted Allocation Definition
- **Decision:** Adopt section 37's versioned accepted authority.
- **Normative Rule:** It MUST preserve Proposal/Allocation/Capacity/Demand lineage.
- **Reasoning:** Acceptance differs from recommendation.
- **Consequences:** New semantics beyond PlanDecision.
- **Implementation Constraint:** Explicit scope/applicability/supersession.
- **Remaining Downstream Question:** Persistence host.

### GDA-SPEC-30 — Time-Ownership Transition
- **Decision:** Accepted Allocation authorizes; Scheduled Goal Work owns time.
- **Normative Rule:** No pre-acceptance Goal item is scheduled reality.
- **Reasoning:** Separates authority from derived occurrence.
- **Consequences:** History records both.
- **Implementation Constraint:** Preview must represent proposed items separately.
- **Remaining Downstream Question:** Proposal-to-schedule materializer.

### GDA-SPEC-31 — Accepted Allocation Scope
- **Decision:** One-off/bounded repeat remain Accepted Allocation; open recurrence becomes authored pattern; preference separate.
- **Normative Rule:** Scope MUST be explicit and non-escalating.
- **Reasoning:** Repetition is not consent.
- **Consequences:** Expiry/count/supersession required.
- **Implementation Constraint:** Scope-aware replay.
- **Remaining Downstream Question:** Maximum bounded-repeat horizon.

### GDA-SPEC-32 — Modification Semantics
- **Decision:** Preserve original plus delta; re-evaluate material changes.
- **Normative Rule:** Original Proposal MUST remain immutable.
- **Reasoning:** Historical decision truth.
- **Consequences:** Some modifications create new Allocation evaluation.
- **Implementation Constraint:** Define validation boundary.
- **Remaining Downstream Question:** Proposal interaction workflow.

### GDA-SPEC-33 — Rejection Semantics
- **Decision:** Optional durable bounded evidence with no planning side effect.
- **Normative Rule:** Rejection MUST NOT mutate Demand/priority/policy/preferences.
- **Reasoning:** One choice is not global intent.
- **Consequences:** Exact rejected context may be historical.
- **Implementation Constraint:** No automatic alternate scheduling.
- **Remaining Downstream Question:** Retention policy.

### GDA-SPEC-34 — Reusable Preference Boundary
- **Decision:** Learned tendency becomes authority only by explicit promotion.
- **Normative Rule:** Acceptance history MUST remain evidence until promoted.
- **Reasoning:** No silent learning authority.
- **Consequences:** Separate preference identity/provenance.
- **Implementation Constraint:** No hidden adaptive writes.
- **Remaining Downstream Question:** Preference architecture.

### GDA-SPEC-35 — Recurring Demand vs Recurring Authority
- **Decision:** Separate request, bounded acceptance, pattern authority, and preference.
- **Normative Rule:** Recurring Demand MUST NOT schedule.
- **Reasoning:** Cadence does not equal consent to recurrence.
- **Consequences:** Explicit transition at acceptance.
- **Implementation Constraint:** Source/lifetime identity per layer.
- **Remaining Downstream Question:** Pattern authoring transformation.

### GDA-SPEC-36 — Progress Boundary
- **Decision:** Keep Demand satisfaction, effort stages, and Progress distinct.
- **Normative Rule:** Cross-use requires explicit policy/provenance.
- **Reasoning:** Planning is not outcome.
- **Consequences:** No automatic Progress from time.
- **Implementation Constraint:** Separate metrics/labels.
- **Remaining Downstream Question:** Supported relationship policies.

### GDA-SPEC-37 — Friction Boundary
- **Decision:** Friction starts only after authored/accepted planning intent is infeasible.
- **Normative Rule:** Scarce Capacity/unmet Demand MUST NOT create Friction.
- **Reasoning:** Corrective versus constructive boundary.
- **Consequences:** Feasibility/allocation failure remains descriptive.
- **Implementation Constraint:** Authority-aware classification.
- **Remaining Downstream Question:** Accepted Allocation recovery UX.

### GDA-SPEC-38 — Historical Provenance
- **Decision:** Freeze bounded decision-time lineage, not every search branch.
- **Normative Rule:** Mutable current state MUST NOT rewrite past decisions.
- **Reasoning:** Immutable history.
- **Consequences:** Presented alternatives/decisions retain snapshots.
- **Implementation Constraint:** Immutable versioned references/content.
- **Remaining Downstream Question:** Schema placement with Proposal specification.

## 53. Boundary Matrix

| Concept | Authored? | Derived? | Owns Time? | Expresses Demand? | Tests Compatibility? | Allocates Capacity? | Recommends? | Creates Authority? | Historical Provenance? |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Goal | Yes | No | No | Outcome only | No | No | No | Yes, outcome | Yes |
| Demand Intent | Yes | No | No | Yes | No | No | No | Yes, request | Yes |
| Demand Projection | No | Yes | No | Yes | No | No | No | No | At decision if used |
| Goal Priority | Yes | No | No | Ranks demands | No | No | No | Yes, planning priority | Yes |
| Capacity | No | Yes | No | No | No | No | No | No | Context when needed |
| Feasibility | No | Yes | No | Evaluates one | Yes | No | No | No | At decision if used |
| Competing Set | No | Yes | No | Groups demand | No | No | No | No | At decision if used |
| Allocation Policy | Authored/governed | Rule authority | No | No | No | Governs | No | Yes as policy | Yes |
| Allocation | No | Yes | No | Resolves demand | Uses feasibility | Yes provisionally | No | No | With Proposal/decision |
| Proposal | No | Yes | No | Presents satisfaction | Uses results | References | Yes | No | Yes if decided |
| Accepted Allocation | User accepted | Based on derived | Authorizes claim | Resolves accepted demand | No | Yes authoritatively | No | Yes | Yes |
| Scheduling pattern | Yes | Occurrences derived | Yes through occurrences | Obligation | No | Consumes accepted claim | No | Yes | Yes |
| Scheduled Goal Work | Authorized/derived | Yes | Yes | Realizes demand | No | Consumes | No | No new authority | Yes |
| Friction | No | Yes | No | No | No | No | Corrective | On accepted fix only | Yes where decided |
| Progress | Observations authored; projection derived | Yes | No | No | No | No | No | Observation authority only | Yes |

## 54. Authority Matrix

| Concept | Authority Source | Epistemic Category | Persist Current? | Can Change Schedule Directly? | Needs User Acceptance? |
|---|---|---|---:|---:|---:|
| Goal | User | Authored | Yes | No | At authoring |
| Demand Intent | User | Authored | Yes | No | Yes |
| Demand Projection | Intent + policy | Derived | Cache only | No | No; Proposal later |
| Goal Priority | User | Authored planning | Yes | No | Yes |
| Target-Date Pressure | Goal + policy | Derived advisory | No/current cache | No | No |
| Progress Signal | Observations/definition + policy | Derived advisory | No/current cache | No | No |
| Capacity | Scheduling authority | Derived resource | No/current cache | No | No |
| Feasibility | Demand + Capacity | Derived evaluation | No/current cache | No | No |
| Allocation Policy | User/governance | Authored/governed rule | Yes/versioned | No | If user-valued policy |
| Allocation | Inputs + policy | Derived provisional | With Proposal only | No | No; Proposal action does |
| Learned Preference Evidence | History | Derived analytical | Historical analysis | No | Before promotion |
| Proposal | Allocation | Proposed action | Until decision/history | No | Yes |
| Accepted Allocation | User decision | Accepted authority | Yes | Authorizes derivation | Is acceptance result |

## 55. Transition Matrix

| Transition | Input State | Output State | Automatic? | User Authority Required? | Time Ownership Begins? | Historical Freeze? |
|---|---|---|---:|---:|---:|---:|
| Goal → Demand Intent | Authored Goal | Authored request | No | Yes | No | Revisions persist |
| Intent → Projection | Authorized intent | Derived horizon demand | Yes | No | No | If used in decision |
| Projection → Feasibility | Demand + Capacity | Compatibility | Yes | No | No | If used in decision |
| Feasibility → Competing Set | Opportunity overlaps | Evaluation context | Yes | No | No | If used in decision |
| Competing Set → Allocation | Set + priority/policy | Provisional assignments | Yes | No | No | With Proposal/decision |
| Allocation → Proposal | Allocation alternatives | Proposed action | Yes | No to create | No | If presented/decided |
| Proposal → Accept | Proposed action | Accepted Allocation | No | Yes | Authority begins; occurrence owns later | Yes |
| Proposal → Modify | Proposal + delta | Revalidated Accepted Allocation | No | Yes | Authority begins after validation | Yes |
| Proposal → Reject | Proposal | Rejection evidence | No | Yes | No | Optional/yes if retained |
| Accepted Allocation → Scheduled Goal Work | Accepted authority | Derived occurrence | Yes | No repeated acceptance within scope | Yes | Yes |
| Scheduled Goal Work → Friction | Infeasible authorized plan | Corrective diagnosis | Yes | Fix requires authority | Already owns | Preserve decisions |
| Scheduled Goal Work → Execution | Scheduled target + report | Execution evidence | No/recorded | Report authority | Already owns | Yes |
| Execution → Progress | Evidence + explicit policy | Derived Progress | Yes if policy exists | Policy/observation already authorized | No | Provenance/cutoff |

## 56. Specification Consistency Checks

1. **Goal without Demand? Yes.** It consumes no Capacity.
2. **Multiple Demand lifetimes? Yes.** Independent identities/revisions are allowed.
3. **Demand without time ownership? Yes.** It is resource-seeking intent.
4. **Projection changes with stable intent? Yes.** Horizon, Capacity-independent target/Progress facts, or policy may change derived output.
5. **Target date influences planning without priority mutation? Yes.** Derived pressure is separate.
6. **Progress influences projection without authority? Yes.** Only under explicit versioned policy.
7. **Linked Commitment satisfies Demand without Progress? Yes.** Explicit attribution affects planning satisfaction only.
8. **Feasibility fails while Capacity stays unchanged? Yes.** Compatibility is demand-specific.
9. **Individually feasible demands collectively over-subscribe? Yes.** They form a Competing Set.
10. **Partial Allocation? Yes.** Only when permitted and above minimum.
11. **Leave Capacity unallocated? Yes.** Policy may do so and rationale is recorded.
12. **Deterministic but non-authoritative Allocation? Yes.** Reproducibility does not confer authority.
13. **Different policies produce different valid Allocations? Yes.** Policy identity distinguishes them.
14. **Proposal rejects an Allocation alternative without Capacity change? Yes.** Selection is downstream.
15. **Proposal placement changes with equivalent Allocation? Yes.** When material resource/satisfaction facts remain equal.
16. **Rejection evidence without preference? Yes.** Bounded decision history is separate.
17. **Modification preserves original Proposal? Yes.** Original plus delta are immutable.
18. **One-off remains one-off? Yes.** Scope cannot escalate silently.
19. **Recurring authority differs from recurring Demand? Yes.** Only explicit acceptance/pattern authoring schedules.
20. **Accepted Allocation authorizes without becoming execution? Yes.** It is planning authority.
21. **Accepted Goal Work later creates Friction? Yes.** When authoritative conditions conflict.
22. **Scheduled effort and Progress diverge? Yes.** Plan and outcome are distinct.
23. **Historical truth immutable after Goal edits? Yes.** Decision-time snapshots/revisions persist.
24. **Learned evidence influences recommendations without priority? Yes.** Advisory only until promotion.
25. **Downstream uses Capacity without scheduler internals? Yes.** Feasibility/Allocation consume the committed contract.
26. **Proceed to Proposal audit without reopening fundamentals? Yes.** Proposal-specific evidence remains; Demand/Allocation boundaries are complete.

No check exposes a specification defect. Remaining questions are Proposal or implementation concerns.

## 57. Implementation Constraints

A conforming implementation MUST:

1. preserve Goal/Demand identity separation and multiple Demand lifetimes;
2. keep authored Intent separate from disposable Projection;
3. retain field-level provenance and versioned projection policy;
4. resolve horizons through canonical user-days;
5. distinguish hard constraints from preferences;
6. preserve Capacity topology in feasibility opportunity sets;
7. prevent Goal-specific evaluation from mutating Capacity;
8. group only overlapping feasible claims into Competing Sets;
9. represent Goal Priority separately from Commitment priority and Allocation Policy;
10. prevent advisory pressure/learning from becoming authority;
11. conserve Capacity portions without overlap/double assignment;
12. apply explicit partial-satisfaction thresholds;
13. make Allocation deterministic, explainable, provisional, and stale-aware;
14. keep concrete allocation-equivalent placement in Proposal;
15. represent unaccepted Proposal items separately from scheduled reality;
16. create time ownership only after explicit acceptance/direct authoring;
17. distinguish one-off, bounded-repeat, recurring-pattern, and preference scope;
18. preserve original Proposal plus modification/rejection evidence;
19. count linked Commitment effort only through explicit attribution;
20. preserve Demand, planning, execution, and Progress distinctions;
21. freeze bounded decision-time provenance without persisting every search branch;
22. adapt existing primitives only according to section 49.

This specification authorizes no production type, schema, state, persistence, UI, scheduler, or test change.

## 58. Downstream Open Questions

The following are downstream and do not leave Goal Demand or Allocation semantics unresolved:

1. What Proposal identity, lifecycle, expiry, and staleness model is required?
2. How many Allocation alternatives should Proposal present?
3. How does Proposal generate and explain concrete placement variants?
4. Can existing Preview render proposed and scheduled items without semantic leakage?
5. Should Accepted Allocation be a new authority surface or a generalized decision family?
6. Which PlanDecision infrastructure can be shared without sharing its occurrence-only schema?
7. What persistence transaction binds Proposal decision, Accepted Allocation, and scheduled publication?
8. What rejection retention is proportionate?
9. What exact V1 Demand dimension subset and priority labels are implementable?
10. Which Allocation Policy is the initial governed default and which options require user selection?
11. What bounds constrain opportunity/alternative search?
12. What UI language distinguishes requested, feasible, allocated, proposed, accepted, and scheduled effort?

## 59. Specification Conclusions

Goal Demand and Allocation now have complete responsibility and authority boundaries. Goal Demand is independently identified authored resource-seeking intent interpreted through deterministic horizon projections. Feasibility tests hard compatibility against immutable Capacity. Competing Sets localize overlapping claims. Allocation assigns exact resource portions provisionally under separate Goal Priority and Allocation Policy, retaining partial satisfaction, alternatives, determinism, and explanation.

Proposal remains the first constructive recommendation. Accepted Allocation is the explicit planning-authority transition; Scheduled Goal Work is its time-owning realization. Recurring Demand, bounded acceptance, reusable patterns, and learned preferences remain separate. Existing Commitment attribution prevents double claiming without conflating planned effort with Progress.

No accepted architecture contradiction remains. Current implementation primitives are useful but require adaptation; none constitutes the new domains already.

## 60. Recommended Next Step

**Path A — Constructive Proposal Architecture Audit.**

Goal Demand, feasibility, competition, Allocation, and Accepted Allocation are fully specified. Proposal is now the principal unresolved boundary because repository evidence must determine how current Preview, Friction suggestions, PlanDecision acceptance, historical publication, and UI affordances can support constructive recommendations without treating them as scheduled truth.

Path B is premature because the existing Proposal-like pathways require a focused semantic/executable audit. Path C is unnecessary because Accepted Allocation authority is architecturally bounded; its implementation host can be resolved with Proposal evidence. Path D has no blocking executable uncertainty in Demand/Allocation. Path E is unsupported because no contradiction exists. Path F is premature until Proposal is audited/specified.

This recommendation does not begin the audit and does not assign work to any implementation phase.

## 61. Completion Statement

> **Goal Demand and Allocation Architecture Specification complete.**
>
> The specification establishes Goal Demand as a distinct planning-resource request in service of a Goal; defines its identity, lifecycle, authored intent, deterministic projection, constraints, preferences, horizon, cadence, priority, existing-Commitment accounting, and relationship to Progress; defines Goal-Specific Feasibility and Competing Demand; establishes Allocation as deterministic, provisional, explainable Capacity-assignment reasoning distinct from Proposal and user authority; defines partial satisfaction, allocation policy, priority boundaries, determinism, provenance, staleness, Accepted Allocation, recurring authority scope, rejection and modification semantics, historical boundaries, and the exact transition by which Goal-driven discretionary work becomes time-owning; and identifies the appropriate next architectural step without modifying the implementation or assigning the work to a future implementation phase.
