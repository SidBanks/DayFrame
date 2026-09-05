# Task 9.2 — Constructive Proposal, ProposalDecision, and Accepted Allocation V1

**Status:** Ready for Codex
**Phase:** Phase 9 — Constructive Planning and Authorization
**Task Type:** Implementation / Proposed Action / User Decision Authority / Accepted Planning Authority / Persistence / History
**Primary Responsibility:** Establish Constructive Proposal V1, Proposal lifecycle/history, explicit ProposalDecision authority, modification and revalidation, and immutable Accepted Allocation V1 over Task 9.1 Allocation without yet realizing accepted authority into scheduled Goal work.

---

## 1. Objective

Implement the Phase 9 authority-transition increment:

1. **Constructive Proposal V1** as deterministic, explainable, derived, non-authoritative recommendation truth over Task 9.1 Allocation;
2. **Proposal Horizon V1** as an explicit bounded recommendation horizon independent of planning-data horizon and UI review scope;
3. **Proposal Scope V1** defining exact affected Demand portions, Capacity claims, user-days, options, and atomic bundle semantics;
4. **Proposal Option V1** with stable identity, ranked alternatives, exact Allocation lineage, productive-versus-overhead cost, reasons, assumptions, tradeoffs, and qualification;
5. **No-Proposal V1** as a first-class successful reasoned result distinct from error;
6. **Proposal lifecycle V1** including generated, shown where observable, accepted, rejected, ignored where observable, stale, expired, superseded, and inapplicable states;
7. **ProposalModificationCandidate V1** or equivalent bounded user-authored delta model;
8. **full current-input revalidation** before any acceptance;
9. **ProposalDecision V1** as explicit durable user decision evidence;
10. **Accepted Allocation V1** as immutable bounded resource authority created only by successful explicit acceptance of a current revalidated option/candidate;
11. **proposal/decision/accepted-allocation persistence, migration, backup, restore, history, and referential integrity**;
12. **strict separation from realization**, so no Task 9.2 acceptance creates scheduled Goal work, support activity, Buffer protection, execution subject, Preview occurrence, or Friction merely by existing.

At completion DayFrame must be able to answer:

> **What is DayFrame recommending from the current Allocation reasoning, what alternatives and tradeoffs exist, what exact option did the user accept/modify/reject, and what exact bounded Capacity/resource claim has the user now authorized?**

It must **not** yet answer by mutation:

> Put that accepted work onto the schedule.

That belongs to the next realization task.

---

## 2. Governing Architecture and Evidence

Before changing code, inspect repository copies of:

* `docs/architecture/CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_SPECIFICATION_RESULT.md`
* Constructive Proposal architecture audit
* `docs/architecture/GOAL_DEMAND_AND_ALLOCATION_ARCHITECTURE_SPECIFICATION_RESULT.md`
* Capacity specification
* Commitment Composition specification
* post-Phase-7 synthesis
* post-Phase-7 implementation-alignment strategy
* post-Phase-7 roadmap
* Task 8.1 RESULT
* Task 8.2 RESULT
* Task 8.3 RESULT
* Task 8.4 RESULT
* Task 8.5 RESULT
* Task 9.1 RESULT
* current planning provenance/freshness primitives
* Allocation types/query APIs
* Capacity interval identity
* Feasibility opportunity identity
* Goal Priority history
* Proposal-adjacent current UI/query code
* PlanDecision
* CompositeDecision
* persistence/database schema
* restore coordinator/participants
* runtime authority registry
* backup/version codecs
* publication/history models
* bundle policy.

The Constructive Proposal Architecture Specification is normative for:

* Proposal identity;
* context;
* horizon;
* scope;
* lifecycle;
* options;
* ranking;
* explanation;
* qualification;
* No-Proposal;
* acceptance;
* modification;
* rejection;
* ignore/expiry;
* ProposalDecision;
* Accepted Allocation;
* staleness;
* revalidation;
* supersession;
* history.

Task 9.1 is the executable Allocation baseline.

Do not reinterpret Preview, SuggestedFix, PlanDecision, or CompositeDecision as Proposal authority.

---

## 3. Starting Baseline

Task 9.1 established:

* deterministic Competing Demand Sets;
* exact overlap-based competition components;
* governed `goal-allocation` V1 policy;
* exact non-overlapping provisional Capacity claims;
* provisional session partitions;
* full / partial / unmet accounting;
* unallocated Capacity;
* bounded deterministic Allocation alternatives;
* one preferred policy-ranked Allocation alternative;
* Goal Priority integration;
* Allocation provenance/freshness;
* no Proposal;
* no acceptance;
* no scheduled Goal work;
* no persistence of derived Allocation.

Recorded Task 9.1 validation baseline:

* **111 test files passed**
* **1,032 tests passed**
* **0 failures**
* Prettier pass
* typecheck pass
* lint pass
* build pass
* bundle-policy pass
* `git diff --check` pass.

Recorded bundle:

* initial raw: **671,863 bytes**
* initial gzip: **169,998 bytes**
* largest lazy: **53,187 bytes**
* total: **867,085 bytes**

Initial gzip has only **2 bytes of hard-limit headroom**.

Treat eager bundle growth as effectively prohibited unless equivalent or greater safe headroom is first recovered.

---

## 4. Normative Planning Chain

Preserve:

```text
Demand Projection
+ Capacity
+ Feasibility
+ Goal Priority
+ Allocation Policy
        ↓
Competing Demand
        ↓
Allocation
        ↓
Constructive Proposal
        ↓
ProposalDecision
        ↓
Accepted Allocation
        ↓
future Realization
        ↓
future Scheduled Goal Work / Support / Buffer
```

Task 9.2 implements:

```text
Allocation
→ Proposal
→ user decision
→ Accepted Allocation
```

Task 9.2 must stop before:

```text
Accepted Allocation
→ scheduled reality
```

---

## 5. Epistemic Boundary

Preserve exactly:

```text
derived ≠ proposed ≠ accepted ≠ scheduled ≠ executed
```

Classify:

| Concept                | Epistemic class                     |
| ---------------------- | ----------------------------------- |
| Allocation             | Derived provisional reasoning       |
| Proposal               | Proposed action                     |
| Proposal Option        | Proposed action                     |
| No-Proposal            | Derived recommendation outcome      |
| Modification Candidate | User-authored candidate             |
| ProposalDecision       | Explicit user decision evidence     |
| Accepted Allocation    | Accepted bounded planning authority |
| Scheduled Goal Work    | Future scheduled reality            |
| Execution              | Historical executed truth           |

Displaying, ranking, storing, caching, or notifying a Proposal does not accept it.

Persisting an Allocation does not accept it.

A preferred Proposal option is not accepted authority.

---

## 6. Proposal Definition

Implement:

> **A Constructive Proposal is a deterministic, explainable, derived, non-authoritative recommendation containing a ranked bounded option set—or a typed No-Proposal result—for allocating current Capacity to eligible Goal Demand.**

Proposal may reference complete upstream reasoning.

Proposal must never create or mutate:

* Capacity;
* Demand;
* Goal Priority;
* Goal Structure;
* Feasibility;
* Composition;
* Allocation;
* scheduled time.

---

## 7. Proposal Context V1

The architecture defines one Proposal domain with typed contexts:

* `ordinary`
* `liveOpportunity`

Task 9.2 implements **ordinary context only**.

The type model should preserve a discriminated context seam for future Live use if doing so is low-cost and architecture-compatible.

Do not implement:

* Released Interval;
* Live Capacity;
* Live Opportunity;
* Found Time;
* live expiry semantics.

Those belong to Phase 10.

Do not create a second future Proposal type for Live.

---

## 8. Ordinary Proposal Horizon

Introduce explicit **Proposal Horizon V1**.

It must:

* be bounded;
* use canonical user-day semantics;
* be narrower than or equal to valid upstream Capacity / Demand / Allocation coverage;
* never silently expand to loaded planning data;
* never equal UI review scope merely by coincidence.

At minimum support:

* one canonical user-day;
* bounded user-day range.

Proposal Horizon is semantic recommendation scope.

---

## 9. Horizon Separation

Preserve distinction among:

1. **Planning-data horizon**
2. **Proposal Horizon**
3. **Review Scope**

Task 9.2 owns Proposal Horizon only.

Do not implement Review Scope broadly here.

If existing Preview range currently serves as planning-data coverage, Proposal may consume valid bounded subsets of that data but must not rename Preview range into Proposal Horizon authority.

---

## 10. Proposal Scope

Proposal scope must identify exactly what could be authorized.

At minimum include:

* Proposal context;
* exact horizon;
* affected Demand Projection IDs/revisions;
* exact Goal IDs;
* relevant Capacity interval claims;
* Allocation alternative refs;
* user-days;
* one-off versus explicit atomic bundle semantics.

Default scope is **one-off bounded authority**.

No recurring authority may be implied.

---

## 11. One-Off Default

An ordinary accepted Proposal creates bounded one-off Accepted Allocation authority only.

It must not silently create:

* Commitment recurrence;
* recurring Goal session pattern;
* reusable preference;
* future weekly schedule rule.

Promotion to recurrence is a separate explicit future authoring transaction.

---

## 12. Proposal Input Contract

Proposal generation must consume stable public contracts.

At minimum:

* exact Task 9.1 Allocation result;
* exact Allocation alternatives;
* Capacity identity/fingerprint;
* Demand Projection refs;
* Feasibility refs;
* Goal Priority refs;
* Allocation Policy/version;
* composition/support footprint references carried upstream;
* exact Proposal Horizon;
* evaluation instant where semantically relevant;
* proposal-generation policy/version.

Proposal must not bypass Allocation to redistribute scarce Capacity.

---

## 13. Input Qualification

Represent required input state explicitly.

At minimum:

* `known`
* `unknown`
* `stale`
* `inapplicable`
* `notRequired`

Equivalent exact names are acceptable.

Unknown decisive information must never be silently defaulted into acceptance-safe recommendation truth.

Where missing evidence is non-decisive, Proposal may be `qualified`.

Where decisive authority/safety evidence is unavailable, return No-Proposal or error as appropriate.

---

## 14. Proposal Generation Policy V1

Introduce versioned deterministic Proposal-generation policy.

It governs only:

* converting Allocation alternatives into user-decision options;
* option cardinality;
* semantic option ordering;
* proposal-level technical tie-breaks;
* option explanation structure;
* qualification;
* expiry/validity rules where applicable.

It must not invent:

* Goal Priority;
* fairness;
* Allocation ranking;
* Demand semantics;
* session legality.

Those remain upstream.

---

## 15. Proposal Identity

Each Proposal requires durable stable identity.

At minimum:

* opaque Proposal ID;
* positive revision;
* context;
* generated-at instant;
* Proposal Horizon;
* scope;
* upstream input fingerprint;
* lifecycle revision/state;
* option IDs;
* policy/version;
* provenance.

Material regeneration should create:

* a successor revision where identity semantics remain the same; or
* a new successor Proposal lifetime where appropriate.

Choose and document one bounded V1 lineage model.

Do not silently reuse IDs for materially unrelated recommendations.

---

## 16. Proposal Revision / Successor Semantics

Proposal history must preserve exact recommendations actually shown/decided.

A material current-input change must never rewrite old Proposal content.

Use explicit revision/successor lineage.

Record:

* predecessor;
* successor;
* reason for supersession where applicable.

Terminal historical Proposal records are immutable.

---

## 17. Proposal Lifecycle

Implement the closed lifecycle required by architecture:

```text
generated
→ shown
→ accepted | rejected | ignored | stale | expired | superseded | inapplicable
```

`modified` should not simply mutate the Proposal.

A modification creates a distinct user-authored candidate linked to the source option.

If `shown` cannot currently be observed reliably without UI, represent the lifecycle state but do not fabricate it.

Do not claim a Proposal was shown merely because generated.

---

## 18. Lifecycle Validation

Enforce legal transitions.

Examples:

* generated → accepted only through explicit decision/revalidation path;
* stale → accepted forbidden;
* expired → accepted forbidden;
* superseded → accepted forbidden;
* rejected → accepted forbidden;
* accepted → rejected forbidden;
* terminal records immutable.

Illegal transition must fail without partial durable mutation.

---

## 19. Proposal Option V1

Each option must identify:

* stable option ID;
* Proposal ID/revision;
* source Allocation alternative;
* affected Goal/Demand;
* productive duration;
* assigned session partitions;
* exact Capacity claims;
* support-activity footprint where known;
* Buffer footprint where known;
* total resource cost;
* Proposal scope;
* qualification;
* structured reasons;
* assumptions;
* tradeoffs;
* relevant exclusions;
* ranking evidence;
* provenance.

Productive work and overhead must remain distinct.

---

## 20. Option Identity

Option ID must be stable within a Proposal revision and derive from semantic content.

It must not depend on:

* array order;
* UI order;
* display label;
* random evaluation ID.

Equivalent Proposal revision + equivalent option semantics produce equivalent option identity.

Modified options receive a distinct candidate identity.

---

## 21. Proposal Cardinality

Produce:

* exactly one preferred option when Proposal is actionable and alternatives exist;
* zero or more alternatives;
* or No-Proposal.

Do not manufacture alternatives solely for visual variety.

Options should correspond to materially distinct Allocation/recommendation choices.

---

## 22. Explicit Bundles

A Proposal may contain:

* independent options; or
* an explicitly atomic bundle.

Implicit bundles are forbidden.

If one accepted recommendation requires multiple Demand allocations to stand together, represent this explicitly.

The user must be able to know whether acceptance applies to:

* one option;
* one subset;
* one atomic bundle.

---

## 23. Ranking

Proposal ranking must preserve authority order.

At minimum:

1. Task 9.1 Allocation preferred/ranking semantics;
2. explicit implemented preferences, if any;
3. future guidance only when explicitly available;
4. stable semantic tie-break.

Task 9.2 must not rerank Goals using invented priority/fairness policy.

Proposal explains Allocation ranking; it does not replace it.

---

## 24. Equivalent Placement Alternatives

Architecture allows Proposal to own concrete placement alternatives where multiple placements are Allocation-equivalent.

Task 9.2 may implement bounded equivalent-placement option expansion only if Task 9.1 Allocation resource claims and Capacity contracts make this semantically exact.

Do not rediscover Feasibility.

Do not generate placements outside accepted Allocation-compatible claims.

If no additional placement expansion is necessary for V1, use Allocation's exact provisional partitions directly and document that decision.

---

## 25. Recommendation Explanation

Each option must expose structured evidence for:

* why it is being recommended;
* what Goal/Demand it serves;
* productive effort;
* support overhead;
* Buffer overhead;
* Capacity claimed;
* Priority/policy effects inherited from Allocation;
* assumptions;
* tradeoffs;
* why alternatives ranked below it;
* limitations/qualification.

Natural-language copy is secondary.

The semantic explanation must be deterministic.

---

## 26. Explanation Provenance

Historical explanation must replay decision-time evidence.

Freeze sufficient decisive evidence so later changes to:

* Goal title;
* Priority;
* Demand;
* Capacity;
* Allocation Policy;
* Proposal-generation policy

do not reinterpret what was recommended at the time.

Do not duplicate unrelated upstream state.

Use hybrid snapshot + exact references/fingerprints.

---

## 27. Proposal Qualification

Implement at least:

* `fullyQualified`
* `qualified`

with explicit limitations.

Do not use probabilistic confidence.

Qualification describes evidence completeness/limitations.

Safety- or authority-critical unknowns require abstention rather than persuasion.

---

## 28. No-Proposal V1

No-Proposal is a successful domain result.

Support structured codes including applicable equivalents of:

* `noCapacity`
* `noUnmetDemand`
* `allSatisfied`
* `noMinimumFit`
* `compositionInfeasible`
* `structurallyBlocked`
* `policyAbstained`
* `incompleteInput`

Task 9.2 may add bounded codes discovered from executable Phase 8/9 contracts.

No-Proposal must retain:

* context;
* horizon;
* input fingerprint;
* reasons;
* decisive provenance;
* generated-at;
* policy/version.

---

## 29. No-Proposal vs Error

Use:

### No-Proposal

Expected valid domain state where no actionable recommendation should be made.

### Error

Invalid/corrupt input, unsupported version, referential-integrity failure, or engine failure.

Do not use exceptions for ordinary scarcity.

Do not use No-Proposal to conceal invalid persisted authority.

---

## 30. Proposal Staleness

A Proposal becomes stale when a material dependency changes.

At minimum consider:

* Capacity fingerprint;
* Demand Projection revision/fingerprint;
* Feasibility result;
* Goal Priority revision;
* Allocation result/fingerprint;
* Allocation Policy;
* Composition/resource footprint;
* Proposal Policy;
* Proposal Horizon validity;
* conflicting Accepted Allocation.

Stale Proposal remains history but loses actionability.

---

## 31. Proposal Expiration

Implement ordinary Proposal expiration only where the specification/current product provides a coherent deterministic validity rule.

If no ordinary temporal expiry authority currently exists beyond input staleness/horizon validity, represent expiry lifecycle semantics and use only explicit governed expiry.

Do not invent arbitrary “expires in 24 hours” behavior.

Live expiry is deferred.

---

## 32. Proposal Revalidation

Before acceptance, perform full revalidation.

Revalidation must resolve current:

* Capacity;
* Demand Projection;
* Feasibility;
* Goal Priority;
* Allocation;
* composition footprint/liability;
* Proposal Horizon;
* competing accepted claims;
* Proposal/Allocation policies.

Then:

1. confirm the same semantic option remains valid; or
2. create a successor Proposal/candidate path; or
3. return No-Proposal/inapplicable/stale.

Historical Proposal revision is never mutated.

---

## 33. Revalidation Atomicity

Acceptance and revalidation must be one protected transaction boundary.

Do not:

```text
check current
→ wait
→ persist acceptance blindly
```

without validating the exact decisive fingerprint at the authority transition.

The accepted record must identify exactly what was revalidated.

If current dependencies change during the transition, fail closed.

---

## 34. Proposal Modification

Implement bounded modification through a separate user-authored candidate.

Permitted V1 changes may include only architecture-supported fields:

* placement within still-valid allocated/feasible bounds;
* productive duration within Demand rules;
* selection/omission of optional supported components where permitted;
* explicit subset/bundle selection.

Do not allow modification to silently change:

* Goal;
* Demand identity;
* context;
* Proposal Horizon beyond original scope;
* Goal Priority;
* Allocation Policy.

Those require new authoring/recomputation.

---

## 35. Modification Candidate

A candidate must preserve:

* candidate ID;
* source Proposal;
* source option;
* exact user delta;
* created-at;
* actor origin;
* validation state;
* revalidated final semantic option;
* reasons;
* provenance.

Candidate identity is distinct from option identity.

---

## 36. Modification Revalidation

Before modify-and-accept:

* validate candidate bounds;
* rerun necessary Capacity/Feasibility/Allocation constraints;
* validate composition/support footprint;
* ensure no conflicting accepted claim;
* ensure Proposal scope is not exceeded;
* freeze original option;
* freeze delta;
* freeze validation result;
* freeze final accepted candidate.

Invalid modification creates no Accepted Allocation.

---

## 37. ProposalDecision V1

ProposalDecision is first-class durable user decision evidence.

It must record:

* durable Decision ID;
* Proposal ID/revision;
* option/candidate ID where applicable;
* decision type;
* timestamp;
* actor origin;
* current revalidation result where required;
* accepted subset/bundle scope;
* exact decisive fingerprints;
* lineage/provenance.

ProposalDecision is distinct from Accepted Allocation.

---

## 38. Decision Types

Support at minimum:

* `accept`
* `modifyAndAccept`
* `rejectOption`
* `rejectProposal`

Represent `ignore` only where interaction absence becomes an observable event.

Expiration is lifecycle state, not user rejection.

Do not interpret no action as reject.

---

## 39. Acceptance

Acceptance must be:

* explicit;
* user-originated;
* timestamped;
* Proposal-revision-specific;
* option/candidate-specific;
* current;
* fully revalidated;
* scope-bounded.

Acceptance creates:

1. immutable ProposalDecision;
2. immutable Accepted Allocation.

It does **not** create execution history.

---

## 40. Rejection

Rejection creates immutable decision evidence only.

It must not:

* reduce Capacity;
* revise Demand;
* change Goal Priority;
* create preference;
* create recurrence;
* create Progress;
* create Friction.

Option rejection and whole-Proposal rejection remain distinguishable.

---

## 41. Ignore

If the current application cannot reliably detect presentation/interaction absence, do not manufacture an `ignored` decision.

Lifecycle may support `ignored` for future use.

If implemented, ignore remains interaction evidence only.

It is not rejection or preference evidence.

---

## 42. Accepted Allocation Definition

Implement:

> **Accepted Allocation is the immutable bounded authorization record joining ProposalDecision, selected/revalidated option, exact Capacity claims, satisfied Demand portion, productive/support footprint, and explicit scope.**

Accepted Allocation is new planning authority.

It is the bridge to future schedule realization.

It is not yet scheduled reality.

---

## 43. Accepted Allocation Identity

Each Accepted Allocation requires:

* opaque durable ID;
* revision/version if architecture requires;
* ProposalDecision ID;
* Proposal ID/revision;
* source option/candidate;
* exact Capacity claims;
* Demand Projection references;
* Goal references;
* productive assignment;
* support footprint;
* Buffer footprint;
* scope;
* accepted-at;
* actor origin;
* decisive snapshots/fingerprints;
* provenance.

Accepted IDs are never reused.

---

## 44. Accepted Allocation Immutability

Accepted Allocation must be immutable historical authority.

Do not edit accepted claims in place.

Future changes must use:

* superseding/new authority;
* later corrective planning after realization;
* explicit cancellation/release architecture where defined.

Task 9.2 need not implement those later operations unless required for basic referential safety.

---

## 45. Accepted Scope

Default scope is one-off.

Accepted scope must list exact:

* user-days;
* Capacity resources;
* Demand portions;
* productive sessions;
* support components;
* Buffer requirements.

It may not exceed Proposal scope.

Partial acceptance creates only the explicitly accepted subset.

---

## 46. Partial Acceptance

Support partial acceptance only if the Proposal explicitly presents an independently acceptable subset and Allocation/Demand semantics permit it.

Do not split an atomic bundle during acceptance.

Do not silently shrink required support footprint.

Do not accept productive work without its required support/Buffer resource obligations.

---

## 47. Atomic Bundle Acceptance

For atomic bundles:

```text
all selected bundle claims accepted
or
none accepted
```

No partial accepted state may survive failure.

Persistence must preserve bundle atomicity.

---

## 48. Capacity Claim Authority

Accepted Allocation authorizes identified bounded resource claims.

It does not mutate the historical Capacity result.

Current future Capacity consumers may later account for Accepted Allocation through realization/authority projection.

Task 9.2 must not directly subtract accepted claims by pretending they are scheduled intervals.

The next realization task will convert authority into time-owning schedule facts.

---

## 49. Demand Satisfaction Authority Boundary

Accepted Allocation may record the Demand portion the user authorized.

It must not automatically mark Demand as executed, completed, or Progressed.

Distinguish:

* requested;
* allocated;
* accepted;
* scheduled;
* executed;
* Progress.

If current Demand lifecycle has no accepted-satisfaction accounting yet, preserve the accepted portion in Accepted Allocation and leave Demand mutation to later explicit architecture.

---

## 50. Productive / Support / Buffer Separation

Accepted Allocation must preserve separate:

* productive Goal work;
* support activity;
* Buffer protection.

Only productive work may eventually satisfy Goal Demand according to explicit attribution.

Support consumes resource.

Buffer protects resource.

Do not flatten all accepted minutes into Goal work.

---

## 51. Accepted Allocation vs PlanDecision

Do not reuse PlanDecision.

PlanDecision:

* corrects already-authorized occurrence planning.

ProposalDecision:

* records a constructive recommendation response.

Accepted Allocation:

* authorizes new bounded discretionary Goal resource claims.

Types and semantics must remain distinct.

---

## 52. Accepted Allocation vs CompositeDecision

Do not reuse CompositeDecision.

CompositeDecision coordinates an already-authorized composite occurrence.

Accepted Allocation may include required support footprint but creates a distinct new authority bridge.

Reuse primitives only where semantics align.

---

## 53. Recurrence Boundary

Accepted one-off Allocation is not recurrence.

Do not create:

* BlockTemplate recurrence;
* weekly Goal pattern;
* recurring Commitment authority.

Promotion to reusable recurrence requires a separate explicit authoring transaction.

Task 9.2 may preserve a future provenance seam but does not implement recurrence promotion.

---

## 54. Realization Boundary

Do **not** realize Accepted Allocation into schedule in Task 9.2.

Do not create:

* Scheduled Goal Work;
* scheduled support occurrence;
* Buffer interval;
* Commitment;
* manual event;
* Preview occurrence;
* execution subject.

Task 9.3 will own realization.

---

## 55. Preview Boundary

Preview may not display Proposal or Accepted Allocation as though scheduled.

At Task 9.2 completion:

```text
accepted ≠ scheduled
```

If a diagnostic/query surface exposes accepted-but-unrealized authority, it must be clearly typed as such.

Do not inject accepted Goal work into `scheduledBlocks`.

---

## 56. Friction Boundary

Before realization, Accepted Allocation is authority but not yet scheduled occurrence truth.

Do not automatically create ordinary schedule Friction unless the accepted-authority architecture explicitly defines pre-realization claim conflict diagnostics.

Expected V1:

* acceptance transaction prevents conflicting current claims;
* realization later fails closed if authority cannot be faithfully realized;
* post-realization incompatibility becomes Friction.

Do not treat rejected/no-Proposal outcomes as Friction.

---

## 57. Conflicting Acceptance

Acceptance must revalidate against existing accepted claims.

Two Accepted Allocations must not authorize overlapping exclusive Capacity portions unless explicit architecture permits shared semantics.

If accepting one option invalidates an outstanding Proposal:

* stale or supersede affected Proposal(s) atomically where applicable;
* preserve their history.

Do not allow double acceptance of the same exclusive Capacity.

---

## 58. Proposal Supersession

Support supersession when:

* regenerated Proposal replaces old recommendation;
* competing claim accepted elsewhere;
* materially changed current inputs yield successor.

Superseded Proposal remains historical and non-actionable.

Link predecessor/successor and reason.

---

## 59. Historical Proposal Provenance

Persist enough immutable Proposal evidence to answer:

* what was recommended;
* which options existed;
* which was preferred;
* what inputs/policies mattered;
* what the user selected;
* what modifications were made;
* what exact scope became accepted;
* what later superseded/staled the recommendation.

Do not duplicate full current scheduling state.

---

## 60. Decisive Snapshot Strategy

Use hybrid decisive snapshots.

Freeze exact values needed to interpret:

* Recommendation;
* Decision;
* Accepted Allocation.

Use versioned references/fingerprints for larger upstream artifacts.

At minimum preserve sufficient evidence for:

* Capacity claim interpretation;
* Demand meaning;
* Goal identity/context;
* Priority evidence;
* Allocation reasoning;
* support/Buffer footprint;
* Proposal ranking/explanation.

---

## 61. Proposal History vs Schedule History

Keep separate:

### Proposal history

What DayFrame recommended and what the user decided.

### Schedule history

What owned time after realization/publication.

### Execution history

What actually happened.

Link them by durable IDs.

Never infer one from another.

---

## 62. Accepted Choice Boundary

An accepted ProposalDecision is a situational **Accepted Choice**.

It may later become evidence for learning.

It does not automatically become:

* preference;
* Goal Priority;
* Allocation Policy;
* recurrence;
* proof of execution.

---

## 63. Learning Boundary

Do not implement learned tendency.

Do not derive reusable preference from:

* acceptance;
* rejection;
* repeated choice.

Preserve immutable history so Phase 10 can analyze it later.

---

## 64. Direct Authoring Boundary

Direct Commitment/manual-event authoring remains valid and independent.

Do not create synthetic Proposal history for direct authoring.

No Task 9.2 code should require every scheduling authority to originate from Proposal.

---

## 65. Direct Goal Scheduling Boundary

Do not implement direct one-off Goal scheduling in Task 9.2 unless already independently present.

If current product lacks it, preserve architecture seam only.

Do not retroactively manufacture ProposalDecision for direct actions.

---

## 66. Proposal Persistence

Unlike Allocation, Proposal lifecycle/history must be durable if generated recommendations are shown/decided or otherwise historically consequential.

Implement a durable Proposal authority/history host sufficient for:

* Proposal revisions/successors;
* options or decisive option snapshots;
* lifecycle;
* ProposalDecision;
* Accepted Allocation;
* referential integrity.

Choose the smallest coherent persistence layout.

Do not persist raw search trees or redundant entire Allocation graphs.

---

## 67. Database Schema

Task 9.1 baseline is schema 9.

Because Task 9.2 introduces durable new authority/history, advance schema version.

Expected:

```text
schema 10
```

unless repository conventions require another exact version.

Migration from schema 9 must create explicit empty Proposal/decision/accepted-allocation authority/history.

No Proposal may be inferred from:

* Preview;
* Goal links;
* Allocation;
* Friction;
* old decisions;
* published schedule.

---

## 68. Backup Version

Task 9.1 baseline is Backup V9.

Because Task 9.2 introduces durable user decision and Accepted Allocation authority, advance backup version.

Expected:

```text
Backup V10
```

unless repository conventions dictate otherwise.

V10 must preserve:

* Proposal identity/revision/history;
* lifecycle;
* options/decisive snapshots;
* ProposalDecision;
* modification candidate/accepted delta where durable;
* Accepted Allocation;
* exact references/fingerprints.

---

## 69. Older Backup Import

Older backups import with explicit empty Proposal-domain state.

Do not infer:

* accepted choice;
* rejected proposal;
* Proposal history;
* Accepted Allocation

from historical schedules or Goal links.

Absence of Proposal history is valid legacy truth.

---

## 70. Lossy Downgrade

Older-format export must refuse where it would discard live/historical:

* ProposalDecision;
* Accepted Allocation;
* Proposal lifecycle evidence required for interpretation.

Follow existing backup downgrade-protection conventions.

---

## 71. Restore Atomicity

Restore must validate and install the new interdependent authority atomically.

Validate:

* Proposal IDs/revisions;
* option IDs;
* successor/predecessor links;
* lifecycle transitions;
* ProposalDecision references;
* candidate references;
* Accepted Allocation references;
* Goal/Demand refs;
* exact Capacity claim snapshots;
* supported policy versions.

Invalid Proposal authority must not partially install.

Participate in protected restore/recovery semantics.

---

## 72. Referential Integrity

Reject malformed current authority including:

* Decision referencing missing Proposal;
* Decision referencing wrong Proposal revision;
* acceptance referencing missing option/candidate;
* Accepted Allocation without accepted ProposalDecision;
* Accepted Allocation scope exceeding Proposal scope;
* duplicate accepted exclusive claim identity;
* malformed lineage;
* illegal lifecycle transition;
* unknown policy version where interpretation is unsafe.

Historical tombstone/reference strategies may be used where upstream current objects no longer exist.

Do not erase historical Proposal meaning because current Goal/Demand was retired.

---

## 73. Store / Authority Surface

Provide explicit bounded commands.

At minimum:

### Proposal

* generate ordinary Proposal;
* persist/register Proposal where historically relevant;
* mark shown where genuinely observable;
* revalidate Proposal;
* supersede Proposal;
* resolve exact Proposal revision;
* list actionable Proposals;
* list bounded Proposal history.

### Decisions

* reject option;
* reject Proposal;
* create modification candidate;
* validate candidate;
* accept option;
* modify-and-accept candidate.

### Accepted Allocation

* resolve Accepted Allocation;
* list current accepted-but-unrealized allocations;
* resolve exact historical accepted authority.

Do not add generic mutation APIs.

---

## 74. Proposal Generation Purity

Proposal generation itself should be deterministic and side-effect-free.

Separate:

```text
derive Proposal candidate
```

from:

```text
record Proposal/lifecycle history
```

where architecture permits.

Do not create user authority from generation.

Persisting a generated Proposal may establish historical recommendation evidence, never acceptance.

---

## 75. Decision Transaction Atomicity

Acceptance transaction must atomically:

1. resolve Proposal revision;
2. verify lifecycle actionability;
3. revalidate current dependencies;
4. resolve option/candidate;
5. validate exact scope;
6. validate exclusive Capacity claims against current accepted authority;
7. create ProposalDecision;
8. create Accepted Allocation;
9. transition Proposal lifecycle to accepted;
10. supersede/stale affected outstanding competing Proposals where required;
11. durably commit all or none.

No partial accepted state is permitted.

---

## 76. Rejection Transaction

Rejection transaction must atomically:

* resolve Proposal/option;
* validate current decisionability;
* write immutable ProposalDecision;
* update appropriate Proposal lifecycle/option decision state;
* create no Accepted Allocation.

No upstream planning authority changes.

---

## 77. Modification Transaction

Modification creation must not itself accept.

Workflow:

```text
Proposal option
→ user delta candidate
→ validation/revalidation
→ explicit modify-and-accept
→ ProposalDecision
→ Accepted Allocation
```

Do not collapse modification entry into implicit acceptance.

---

## 78. Current-Time Injection

Proposal generation/revalidation/lifecycle logic that depends on time must use injected/resolved time.

Do not call wall clock unpredictably throughout domain code.

Equivalent inputs + equivalent injected time must yield equivalent outcome.

This is necessary for deterministic expiry/revalidation tests.

---

## 79. Proposal Freshness

Reuse Task 8.1 freshness semantics.

A Proposal dependency fingerprint should include material:

* Allocation ID/fingerprint;
* Capacity fingerprint;
* Demand Projection refs;
* Feasibility refs;
* Priority refs;
* Composition/support footprint;
* Proposal Horizon;
* Proposal policy;
* relevant current accepted claims;
* evaluation time only when outcome-relevant.

Unrelated state must not stale Proposal.

---

## 80. Accepted Allocation Freshness

Accepted Allocation is immutable authority, not disposable current derived truth.

Do not mark historical authority “stale” in the same sense as Proposal.

Instead future realization evaluates:

* applicability;
* current realizability;
* conflicts;
* whether accepted bounds remain satisfiable.

Task 9.2 should preserve the exact accepted evidence needed for Task 9.3.

---

## 81. No Hidden Realization

After successful acceptance:

```text
Proposal = accepted
Accepted Allocation = durable
Schedule = unchanged
```

This invariant must be tested directly.

The user has authorized the claim, but Task 9.3 has not realized it yet.

---

## 82. No Hidden Publication

Do not publish accepted-but-unrealized Goal work.

Publication remains schedule-history truth.

Proposal history and accepted-authority history are separate.

---

## 83. No Hidden Progress

ProposalDecision and Accepted Allocation do not create Goal Progress.

Accepted effort is not executed effort.

Executed effort is not automatically Progress.

---

## 84. No Hidden Preference

Acceptance and rejection do not mutate:

* Goal Priority;
* Demand;
* preference;
* policy;
* recurrence.

Later learning may use decision history as evidence only.

---

## 85. No Hidden Recurrence

A one-off accepted option cannot become reusable recurrence by:

* repeated acceptance;
* same Goal;
* same weekday;
* same chosen time.

Explicit promotion remains future authoring.

---

## 86. No-Proposal Persistence Decision

Determine whether every generated No-Proposal should persist or only historically consequential/shown results.

Use the accepted hybrid historical strategy.

At minimum any No-Proposal that is:

* shown;
* decision-adjacent;
* part of durable planning-history expectations

must retain enough decisive evidence to explain why no recommendation existed.

Do not create unbounded diagnostic history from every internal query.

Document V1 retention rule.

---

## 87. Proposal Retention

Avoid unbounded local history growth.

Choose a bounded architecture-compatible retention strategy for disposable generated-but-never-shown Proposal revisions while preserving all:

* shown;
* decided;
* accepted;
* rejected;
* superseded decision-linked;
* historically referenced

records.

Do not delete authority-bearing history.

---

## 88. UI Boundary

The roadmap permits minimum safe exposure after Proposal semantics are complete.

Task 9.2 should prioritize domain/authority completion.

A minimal Proposal interaction surface is permitted if necessary to prove:

* recommendation display;
* preferred + alternatives;
* accept;
* modify;
* reject;
* qualification;
* No-Proposal;
* accepted-but-not-yet-realized state.

Do not perform broad Planner redesign.

If existing architecture can validate the authority path through store/domain tests without UI, broad UI remains deferred.

Acceptance must **not** be exposed unless the exact atomic authority transaction is complete.

---

## 89. Accessibility

If Proposal UI is added, require:

* semantic option grouping;
* keyboard navigation;
* focus movement after decision;
* accessible preferred/alternative labels;
* qualification/status text;
* reasons available non-visually;
* confirmation/error association;
* no color-only distinction;
* modification controls with accessible labels;
* accepted status distinguishable from scheduled status.

If no UI is added, state so.

---

## 90. Bundle Architecture

Task 9.1 left only **2 gzip bytes** below the hard initial limit.

Task 9.2 must not add ordinary eager production weight without first recovering sufficient headroom.

Requirements:

1. inspect current eager import graph before implementation;
2. keep Proposal derivation/revalidation/history surfaces lazy where compatible;
3. avoid eager Proposal UI;
4. avoid large generic state-machine/history libraries;
5. reuse compact provenance primitives;
6. share lazy-surface infrastructure added by Task 9.1;
7. record bundle mitigation work separately from semantic implementation;
8. pass all hard limits.

If necessary, perform bounded semantics-preserving lazy refactoring before adding new production code.

Do not distort domain design merely to game bundle accounting.

---

## 91. Performance

Proposal generation consumes already-bounded Allocation alternatives.

Prefer:

* direct transformation;
* stable semantic maps;
* bounded option counts;
* decisive snapshot minimization;
* indexed actionable Proposal queries.

Acceptance/revalidation is correctness-critical, not throughput-critical.

No generic workflow/state-machine engine.

---

## 92. Required Tests — Proposal Generation

Prove:

* Allocation result creates deterministic Proposal;
* preferred Allocation maps to preferred Proposal option;
* materially distinct alternatives produce alternatives;
* option identity stable;
* input order does not affect result;
* Proposal does not mutate Allocation/Capacity;
* productive/support/Buffer costs remain distinct;
* explicit atomic bundle semantics preserved.

---

## 93. Required Tests — No-Proposal

Prove appropriate typed results for:

* no Capacity;
* no unmet Demand;
* all satisfied;
* no minimum fit;
* structurally blocked Demand;
* incomplete decisive input;
* policy abstention where applicable.

Prove No-Proposal differs from invalid-input error.

---

## 94. Required Tests — Horizon / Scope

Prove:

* one-day Proposal Horizon;
* bounded multi-day horizon;
* Proposal cannot exceed upstream coverage;
* Proposal scope cannot exceed Allocation claims;
* review/data range does not implicitly expand Proposal;
* one-off default;
* bundle scope explicit.

---

## 95. Required Tests — Lifecycle

Prove:

* generated Proposal actionable;
* shown only when explicitly recorded;
* accepted terminal;
* rejected terminal;
* stale non-actionable;
* expired non-actionable where implemented;
* superseded non-actionable;
* illegal transitions rejected;
* terminal history immutable.

---

## 96. Required Tests — Freshness / Revalidation

Prove Proposal stales/revalidation fails or creates successor after:

* Capacity change;
* Demand revision;
* Feasibility change;
* Priority revision;
* Allocation change;
* composition footprint change;
* accepted competing claim.

Prove unrelated metadata change does not stale Proposal.

---

## 97. Required Tests — Acceptance

Prove:

* explicit current option acceptance succeeds;
* acceptance creates exactly one ProposalDecision;
* acceptance creates exactly one Accepted Allocation;
* Accepted Allocation references exact Proposal/option;
* exact Capacity claims frozen;
* productive/support/Buffer footprint frozen;
* Proposal transitions to accepted;
* schedule remains byte-equivalent immediately afterward;
* no execution/Progress created.

---

## 98. Required Tests — Stale Acceptance

Prove stale Proposal cannot be accepted.

At minimum:

```text
generate Proposal
change decisive dependency
attempt accept
→ no ProposalDecision
→ no Accepted Allocation
→ Proposal remains historical/non-actionable
```

No partial durable authority.

---

## 99. Required Tests — Modification

Prove:

* candidate created without acceptance;
* legal placement/duration delta validates;
* illegal Goal/Demand switch rejected;
* out-of-scope claim rejected;
* current conflict rejected;
* modify-and-accept freezes source option + delta + final candidate;
* schedule still unchanged afterward.

---

## 100. Required Tests — Rejection

Prove:

* option rejection creates decision evidence only;
* Proposal rejection creates decision evidence only;
* rejection creates no Accepted Allocation;
* rejection does not alter Capacity/Demand/Priority;
* rejection does not create preference;
* rejected Proposal cannot later be accepted.

---

## 101. Required Tests — Accepted Scope / Conservation

Prove:

* Accepted Allocation cannot exceed Proposal scope;
* exact exclusive Capacity claims cannot be accepted twice;
* partial accepted subset only when explicitly offered/permitted;
* atomic bundle cannot be split;
* required support footprint cannot be omitted;
* accepted productive effort and overhead remain separately accounted.

---

## 102. Required Tests — Supersession

Prove:

* successor Proposal links predecessor;
* old Proposal remains immutable;
* acceptance of competing exclusive claim stales/supersedes affected outstanding Proposal;
* unaffected Proposal remains actionable;
* supersession does not erase history.

---

## 103. Required Tests — Persistence

Prove:

* restart preserves Proposal lifecycle/history;
* restart preserves ProposalDecision;
* restart preserves Accepted Allocation;
* exact historical Proposal revisions resolvable;
* exact option/candidate lineage retained;
* malformed references fail protected;
* invalid lifecycle history rejected;
* partial acceptance transaction never persists.

---

## 104. Required Tests — Backup / Migration

Prove:

* V10 exact round-trip;
* V9 → V10 imports explicit empty Proposal authority;
* malformed Proposal authority rejected;
* Accepted Allocation references validated;
* lossy V9 export refused where required;
* restore is atomic;
* full clear removes new authority/history;
* older backup history remains otherwise unchanged.

---

## 105. Required Tests — Boundary Preservation

Prove Proposal/decision/acceptance does not mutate:

* Capacity;
* Demand Projection;
* Goal Priority;
* Feasibility;
* Allocation;
* Commitment scheduling;
* Preview scheduled blocks;
* Friction;
* PlanDecision;
* CompositeDecision;
* execution;
* Progress.

---

## 106. Required Tests — Determinism

Perturb:

* Allocation alternative input order;
* option order;
* Goal order;
* Demand order;
* persistence enumeration order.

Equivalent semantics must yield equivalent:

* Proposal content;
* option IDs/order;
* No-Proposal reasons;
* fingerprints.

Time-sensitive behavior must be stable under identical injected time.

---

## 107. Full Regression Preservation

Keep green:

* canonical user-day;
* Work/cycles;
* Commitment recurrence;
* placement;
* Sleep;
* manual events;
* Buffers;
* Composition;
* CompositeDecision;
* Capacity;
* Feasibility;
* Competing Demand;
* Allocation;
* Friction;
* PlanDecision;
* Preview;
* publication;
* execution;
* Progress;
* Goal Structure;
* Goal Demand/Priority;
* backup/restore;
* Month;
* Today;
* Summary;
* DF-006.

---

## 108. Persistence Registration

Update every exhaustive durable-authority integration point as required:

* IndexedDB schema;
* runtime authority registry;
* notification/subscription registry;
* restore participants;
* staging;
* restore coordinator;
* protected recovery;
* full-clear;
* backup codecs;
* backup downgrade checks;
* test reset helpers.

Do not leave Proposal authority partially registered.

---

## 109. Governance

At completion:

* update `docs/architecture/CURRENT_STATE.md`;
* update `docs/architecture/CHANGELOG.md`;
* update `DECISIONS.md` only for a genuinely new unresolved implementation-level architectural decision;
* do not rewrite accepted Proposal specification;
* do not rewrite Goal Demand/Allocation specification;
* do not rewrite roadmap;
* do not rewrite completed Task RESULT artifacts.

Expected:

> **Architecture Reopen Check: No**

unless executable evidence produces a contradiction.

---

## 110. Repository Discipline

Phase 8 has been pushed.

Task 9.1 was reported uncommitted unless the user subsequently committed it.

Before implementation:

1. inspect `git status`;
2. identify current checkpoint;
3. preserve Task 9.1 and unrelated user work exactly as found;
4. do not assume Task 9.1 is committed;
5. do not clean unrelated files;
6. do not commit;
7. do not push unless explicitly instructed.

At completion report exact repository status.

---

## 111. Validation Commands

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

* Proposal generation;
* No-Proposal;
* horizon/scope;
* lifecycle;
* option identity;
* qualification;
* staleness;
* revalidation;
* modification;
* rejection;
* acceptance;
* double-claim prevention;
* persistence;
* Backup V10;
* restore;
* full clear;
* scheduling non-interference;
* Progress non-interference;
* Allocation regressions.

Do not claim completion with failing required gates.

---

## 112. Required Result Artifact

Create a durable Phase 9 RESULT artifact.

Filename must contain **`RESULT`**.

Preferred filename:

```text
TASK_9.2_CONSTRUCTIVE_PROPOSAL_DECISION_AND_ACCEPTED_ALLOCATION_V1_RESULT.md
```

Place it in the dedicated Phase 9 implementation-results folder.

The RESULT must include at minimum:

1. Executive Result
2. Scope Delivered
3. Governing Evidence
4. Task 9.1 Baseline
5. Proposal Definition
6. Epistemic Boundary
7. Ordinary Context V1
8. Proposal Horizon
9. Horizon Separation
10. Proposal Scope
11. One-Off Default
12. Input Contract
13. Input Qualification
14. Proposal Policy
15. Proposal Identity
16. Proposal Revision / Successor Model
17. Lifecycle
18. Lifecycle Validation
19. Option Model
20. Option Identity
21. Cardinality
22. Bundle Semantics
23. Ranking
24. Placement-Alternative Disposition
25. Explanation
26. Explanation Provenance
27. Qualification
28. No-Proposal
29. No-Proposal vs Error
30. Staleness
31. Expiration
32. Revalidation
33. Revalidation Atomicity
34. Modification
35. Modification Candidate
36. Modification Revalidation
37. ProposalDecision
38. Decision Types
39. Acceptance
40. Rejection
41. Ignore Disposition
42. Accepted Allocation Definition
43. Accepted Allocation Identity
44. Accepted Allocation Immutability
45. Accepted Scope
46. Partial Acceptance
47. Atomic Bundle Acceptance
48. Capacity Claim Authority
49. Demand Satisfaction Boundary
50. Productive / Support / Buffer Separation
51. PlanDecision Boundary
52. CompositeDecision Boundary
53. Recurrence Boundary
54. Realization Boundary
55. Preview Boundary
56. Friction Boundary
57. Conflicting Acceptance
58. Supersession
59. Historical Proposal Provenance
60. Decisive Snapshot Strategy
61. Proposal vs Schedule History
62. Accepted Choice Boundary
63. Learning Boundary
64. Direct Authoring Boundary
65. Direct Goal Scheduling Boundary
66. Persistence Model
67. Database Schema
68. Backup V10
69. Older Backup Migration
70. Lossy Downgrade Protection
71. Restore Atomicity
72. Referential Integrity
73. Store / Authority Surface
74. Proposal Generation Purity
75. Acceptance Transaction Atomicity
76. Rejection Transaction
77. Modification Transaction
78. Current-Time Injection
79. Proposal Freshness
80. Accepted Allocation Applicability Seam
81. No Hidden Realization
82. No Hidden Publication
83. No Hidden Progress
84. No Hidden Preference
85. No Hidden Recurrence
86. No-Proposal Retention
87. Proposal Retention
88. Tests Added
89. Proposal Tests
90. Lifecycle Tests
91. Revalidation Tests
92. Modification Tests
93. Rejection Tests
94. Acceptance Tests
95. Conservation Tests
96. Persistence Tests
97. Backup / Migration Tests
98. Boundary Tests
99. Determinism Tests
100. Full Regression Result
101. Validation Commands
102. Bundle Architecture Review
103. Performance Notes
104. Accessibility Notes
105. Compatibility Notes
106. DF-006 Relationship
107. V1 Design Decision Table
108. Boundary Matrix
109. Authority Transition Matrix
110. Invariant Verification
111. Implementation Decisions
112. Deviations
113. Architecture Reopen Check
114. Governance Updates
115. Repository Status
116. Completion Assessment
117. Recommended Next Task
118. Completion Statement

---

## 113. Required V1 Design Decision Table

Include:

| Question                        | V1 Decision | Architectural Basis | Why Sufficient Now | Deferred Capability |
| ------------------------------- | ----------- | ------------------- | ------------------ | ------------------- |
| Proposal persistence host       |             |                     |                    |                     |
| ordinary context representation |             |                     |                    |                     |
| Proposal Horizon                |             |                     |                    |                     |
| scope representation            |             |                     |                    |                     |
| Proposal identity               |             |                     |                    |                     |
| revision/successor model        |             |                     |                    |                     |
| lifecycle states                |             |                     |                    |                     |
| shown tracking                  |             |                     |                    |                     |
| option cardinality              |             |                     |                    |                     |
| bundle semantics                |             |                     |                    |                     |
| option identity                 |             |                     |                    |                     |
| ranking                         |             |                     |                    |                     |
| placement alternatives          |             |                     |                    |                     |
| explanation snapshot            |             |                     |                    |                     |
| qualification                   |             |                     |                    |                     |
| No-Proposal retention           |             |                     |                    |                     |
| expiration                      |             |                     |                    |                     |
| revalidation policy             |             |                     |                    |                     |
| modification fields             |             |                     |                    |                     |
| ProposalDecision types          |             |                     |                    |                     |
| Accepted Allocation identity    |             |                     |                    |                     |
| partial acceptance              |             |                     |                    |                     |
| accepted claim conflict model   |             |                     |                    |                     |
| persistence schema version      |             |                     |                    |                     |
| backup version                  |             |                     |                    |                     |
| Proposal retention              |             |                     |                    |                     |
| UI exposure                     |             |                     |                    |                     |

---

## 114. Required Boundary Matrix

Verify:

| Concept                      | Status after 9.2 | Epistemic Class                | Owns Time?                                       | Durable?                 |
| ---------------------------- | ---------------- | ------------------------------ | ------------------------------------------------ | ------------------------ |
| Capacity                     | Existing         | Derived truth                  | No                                               | No                       |
| Demand Projection            | Existing         | Derived truth                  | No                                               | No                       |
| Feasibility                  | Existing         | Derived truth                  | No                                               | No                       |
| Allocation                   | Existing         | Derived reasoning              | No                                               | No                       |
| Proposal                     | New              | Proposed action                | No                                               | Historical lifecycle yes |
| Proposal Option              | New              | Proposed action                | No                                               | Decisive history         |
| No-Proposal                  | New              | Derived recommendation outcome | No                                               | Per retention rule       |
| Modification Candidate       | New              | User-authored candidate        | No                                               | Decision-linked          |
| ProposalDecision             | New              | Explicit decision evidence     | No independently                                 | Yes                      |
| Accepted Allocation          | New              | Accepted planning authority    | Authorizes bounded claim, not scheduled interval | Yes                      |
| Scheduled Goal Work          | Future           | Scheduled reality              | Yes                                              | Future                   |
| Support Activity realization | Future           | Scheduled reality              | Yes                                              | Future                   |
| Buffer realization           | Future           | Protected scheduled reality    | Protects                                         | Future                   |
| Friction                     | Existing         | Derived corrective             | No                                               | Existing semantics       |
| Execution                    | Existing         | Historical                     | No new authority                                 | Yes                      |
| Progress                     | Existing         | Observation/derived            | No                                               | Yes                      |

---

## 115. Required Authority Transition Matrix

Verify:

| Transition                     |         Automatic? |             User Authority? |         Task 9.2? |
| ------------------------------ | -----------------: | --------------------------: | ----------------: |
| Allocation → Proposal          | Yes, deterministic |                          No |               Yes |
| Proposal → shown               | Only if observable |                          No |          Optional |
| Proposal → reject              |                 No |           Explicit decision |               Yes |
| Proposal → modify candidate    |                 No |         Explicit user delta |               Yes |
| Proposal → Accepted Allocation |                 No | Explicit current acceptance |               Yes |
| Accepted Allocation → schedule |          No in 9.2 |    Prior authority required | **No — Task 9.3** |
| Schedule → execution           |                 No |          execution evidence |                No |
| Acceptance → preference        |     Never implicit | Separate explicit promotion |                No |
| Acceptance → recurrence        |     Never implicit |          Separate authoring |                No |

---

## 116. Required Invariant Verification

Explicitly verify:

1. Proposal is non-authoritative.
2. Preferred does not mean accepted.
3. Proposal does not mutate Allocation.
4. Proposal does not mutate Capacity.
5. Proposal does not create schedule truth.
6. Proposal Horizon is explicit and bounded.
7. Review Scope remains separate.
8. Proposal scope cannot exceed valid upstream scope.
9. one-off is default.
10. recurrence never arises implicitly.
11. Proposal identity/history is stable.
12. lifecycle transitions are closed and validated.
13. historical revisions are immutable.
14. options have stable semantic identity.
15. bundles are explicit.
16. ranking follows upstream authority/policy.
17. Proposal does not invent fairness/Priority.
18. explanations retain decisive evidence.
19. No-Proposal is not error.
20. decisive unknown input causes abstention.
21. stale Proposal cannot be accepted.
22. expired Proposal cannot be accepted.
23. superseded Proposal cannot be accepted.
24. modification is distinct user candidate authority.
25. modification cannot switch Goal/Demand silently.
26. acceptance always revalidates.
27. acceptance is explicit and actor-originated.
28. ProposalDecision is distinct from Accepted Allocation.
29. Accepted Allocation is immutable.
30. Accepted Allocation scope cannot exceed Proposal scope.
31. exact accepted Capacity cannot be double-claimed.
32. atomic bundles accept all or none.
33. accepted productive/support/Buffer footprint remains distinct.
34. acceptance does not imply execution.
35. acceptance does not imply Progress.
36. acceptance does not imply preference.
37. acceptance does not imply recurrence.
38. rejection creates evidence but no resource authority.
39. no response is not rejection.
40. ProposalDecision remains distinct from PlanDecision.
41. Accepted Allocation remains distinct from CompositeDecision.
42. accepted-but-unrealized authority does not appear as scheduled Preview truth.
43. Proposal history remains separate from schedule history.
44. direct authoring does not fabricate Proposal history.
45. all authority-bearing persistence is exact and recoverable.
46. old backups infer no Proposal authority.
47. equivalent semantic inputs produce equivalent Proposal reasoning.
48. no hidden autonomous scheduling occurs.

---

## 117. Completion Criteria

Task 9.2 is complete only when:

1. Constructive Proposal exists as first-class proposed-action domain.
2. ordinary Proposal context exists.
3. Proposal Horizon is explicit.
4. Proposal scope is explicit.
5. default scope is bounded one-off.
6. Proposal generation consumes Task 9.1 Allocation.
7. Proposal generation does not redistribute Allocation.
8. Proposal policy is versioned.
9. Proposal identity is stable.
10. Proposal revision/successor lineage is durable.
11. lifecycle is explicit.
12. lifecycle transitions are validated.
13. Proposal Options have stable identity.
14. preferred + alternatives are deterministic.
15. bundles are explicit.
16. recommendation explanation is structured.
17. productive/support/Buffer cost remains distinct.
18. Proposal qualification is represented.
19. No-Proposal is first-class.
20. No-Proposal differs from error.
21. Proposal staleness is implemented.
22. ordinary expiration is handled only through explicit governed semantics.
23. Proposal revalidation exists.
24. revalidation does not rewrite history.
25. bounded modification candidate exists.
26. modification is revalidated before acceptance.
27. ProposalDecision is durable.
28. accept exists.
29. modify-and-accept exists.
30. option rejection exists.
31. Proposal rejection exists.
32. no-response is not rejection.
33. acceptance creates Accepted Allocation.
34. Accepted Allocation is immutable.
35. accepted scope is exact.
36. accepted scope cannot exceed Proposal.
37. exact exclusive claims cannot be double-accepted.
38. atomic bundles cannot partially accept.
39. acceptance freezes decisive evidence.
40. accepted productive/support/Buffer footprint remains separate.
41. Accepted Allocation remains distinct from schedule.
42. no Scheduled Goal Work is created.
43. Preview remains unchanged after acceptance.
44. no execution is created.
45. no Progress is created.
46. no preference is created.
47. no recurrence is created.
48. Proposal history is durable.
49. Decision history is durable.
50. Accepted Allocation history is durable.
51. DB schema advances appropriately, expected 10.
52. Backup advances appropriately, expected V10.
53. old backups import empty Proposal authority.
54. lossy downgrade is prevented.
55. restore is atomic.
56. referential integrity is validated.
57. full-clear includes new authority.
58. all focused tests pass.
59. full regression passes.
60. Prettier passes.
61. typecheck passes.
62. lint passes.
63. build passes.
64. bundle hard policy passes.
65. `git diff --check` passes.
66. bundle review is documented.
67. governance docs are updated.
68. RESULT artifact exists.
69. architecture reopen is not required.

---

## 118. Stop / Reopen Conditions

Stop and report rather than improvising if evidence shows:

* Task 9.1 Allocation lacks enough exact provenance to create acceptance-safe options;
* Proposal cannot preserve exact Capacity claims without re-running Allocation incorrectly;
* Proposal Horizon cannot be separated from current Preview/data range;
* acceptance cannot be made atomic with full revalidation;
* exact exclusive accepted claims cannot be protected from double acceptance;
* current persistence architecture cannot preserve immutable ProposalDecision + Accepted Allocation together;
* accepted support/Buffer footprint cannot be frozen without semantic loss;
* Proposal history cannot remain separate from schedule history;
* acceptance necessarily creates scheduled blocks in current architecture;
* current UI would expose acceptance before accepted authority is durably committed;
* bundle hard limits cannot be met without semantic distortion;
* an accepted Proposal specification invariant must be violated.

Do not solve these by:

* treating preferred Allocation as accepted;
* using PlanDecision as ProposalDecision;
* inserting accepted sessions directly into Preview;
* weakening revalidation;
* ignoring conflicting accepted claims;
* mutating old Proposal revisions;
* silently shrinking required footprint;
* inventing recurrence;
* interpreting rejection as preference.

---

## 119. Expected Next Roadmap Position

Successful Task 9.2 establishes:

```text
Allocation
→ Proposal
→ explicit user decision
→ Accepted Allocation
```

The next bounded task is:

> **Task 9.3 — Accepted Allocation Realization V1**

That task should atomically realize Accepted Allocation into:

* Scheduled Goal Work;
* required Scheduled Support Activities;
* Buffer protection;
* Preview/scheduling lineage;
* publication/history provenance;
* later corrective Friction when authorized work becomes infeasible.

Task 9.3 must consume Accepted Allocation without reinterpreting the user decision.

Do not implement realization here.

---

## 120. Phase 9 Position

After Task 9.2 DayFrame should be able to say:

```text
DayFrame reasoned.
DayFrame proposed.
The user decided.
The claim is now authorized.
```

But it must not yet claim:

```text
The authorized work is scheduled.
```

This distinction is intentional.

Task 9.2 implements the:

> **DayFrame proposes; the user authorizes**

portion of the product architecture.

Task 9.3 will implement:

> **DayFrame schedules what the user authorized.**

---

## 121. Recommended Next Task

If all Task 9.2 criteria pass:

> **Task 9.3 — Accepted Allocation Realization V1**

Before drafting 9.3, inspect the accepted Constructive Proposal specification's realization/publication requirements plus current Preview/publication/execution lineage.

Do not begin realization in this task.

---

## 122. Final Completion Statement

The Task 9.2 RESULT must end with a completion statement materially equivalent to:

> **Task 9.2 — Constructive Proposal, ProposalDecision, and Accepted Allocation V1 complete.**
>
> DayFrame now transforms current Task 9.1 Allocation reasoning into deterministic, explainable, bounded Constructive Proposals with explicit ordinary context, Proposal Horizon, scope, stable identity, immutable revision/successor lineage, preferred and alternative options, explicit atomic bundles, productive/support/Buffer cost separation, structured recommendation reasons, qualification, and first-class No-Proposal outcomes while preserving Allocation, Capacity, Demand, Goal Priority, Feasibility, Composition, and scheduling truth unchanged; Proposal lifecycle distinguishes generated, shown where observable, accepted, rejected, ignored where observable, stale, expired where explicitly governed, superseded, and inapplicable states without equating display or ranking with authority; user modification creates a separate bounded candidate and every acceptance path performs full current-input revalidation before crossing the authority boundary; explicit ProposalDecision records accept, modify-and-accept, option rejection, or Proposal rejection as immutable decision evidence, while rejection and absence of action create no Capacity, Demand, preference, recurrence, Friction, execution, or Progress authority; successful current acceptance atomically creates immutable Accepted Allocation authority containing exact Proposal/option lineage, bounded Capacity claims, Demand portion, productive Goal work, required support footprint, Buffer footprint, scope, actor, timestamp, decisive snapshots, and provenance while preventing double acceptance and preserving atomic bundle semantics; Proposal, decision, and accepted-authority history persist through schema and Backup V10 with protected migration, restore, downgrade, referential-integrity, and full-clear behavior; Accepted Allocation remains authorization rather than scheduled reality, so successful Task 9.2 acceptance leaves Preview and all scheduled blocks unchanged and creates no execution or Progress; recurring authority is never inferred; direct authoring remains independent; all focused, regression, determinism, persistence, history, bundle, and quality gates pass; and the repository is ready for the next bounded Phase 9 Accepted Allocation Realization increment without reopening accepted architecture.
