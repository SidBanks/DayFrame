# Constructive Proposal Architecture Specification

## Status

Ready for specification.

## Phase

Post-Phase 7 Architectural Follow-Up

## Task Type

Authoritative architecture-specification task defining DayFrame's Constructive Proposal domain following the completed Constructive Proposal Architecture Audit.

This task must convert the audit's established executable truth and accepted upstream architecture into a normative Proposal contract covering:

* ordinary constructive planning;
* Capacity-driven recommendation;
* Goal Demand / Allocation inputs;
* Goal Priority;
* Goal-Specific Feasibility;
* Commitment Composition footprint;
* Proposal identity and lifecycle;
* alternatives;
* explanation;
* acceptance;
* modification;
* rejection;
* Accepted Allocation;
* bounded scheduling authority;
* staleness;
* history;
* learning boundaries;
* Found Time / Live Opportunity;
* direct spontaneous Goal work.

This task must **not** implement the architecture.

This task is read-only with respect to the existing repository.

**The required specification result artifact is the sole permitted repository write.**

---

## 1. Objective

Define the authoritative architecture for DayFrame's constructive planning boundary.

The central question is:

> **How should DayFrame transform derived Capacity, eligible normalized Goal Demand, Goal Priority, Goal-Specific Feasibility, Commitment Composition footprint, Allocation Policy, historical guidance, and Live opportunity into deterministic, explainable, non-authoritative Proposals that become scheduled Goal work only through explicit bounded user authority?**

The specification must also resolve:

> **How should Found Time / Live Opportunity reuse the same Proposal lifecycle without becoming a separate authority system, while preserving the distinction between proposed-and-accepted Goal work and direct spontaneous user action?**

---

## 2. Authoritative Audit Basis

Use:

`/home/sid/Penn Digital Services/DayFrame/docs/audits/CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_AUDIT_RESULT.md`

as the primary executable-evidence basis.

The audit established:

* **CP3 overall, with CP4 as the only current recommendation producer.**
* No first-class constructive Proposal exists.
* Preview is not Proposal.
* `BlockCandidate` is prior-authority realization, not constructive recommendation.
* deterministic recurring placement does not require repeated user acceptance.
* SuggestedFix is corrective Friction machinery.
* `PlanDecision` is accepted occurrence-scoped override authority, not Proposal acceptance.
* constructive accept/modify/reject semantics are absent.
* rejected options are not preserved.
* Goal Demand does not feed planning executably.
* Goal Priority does not feed constructive planning.
* first-class Capacity does not feed planning.
* Goal Allocation is not implemented.
* decision-time Proposal reasoning is not preserved historically.
* no explicit No-Proposal result exists.
* planning/review scope is coupled to broader preview range.
* Found Time is **FT3 — Planned/Actual Primitives Without Found-Time Semantics**.
* execution provides partial planned-vs-actual evidence.
* no Found-Time detector exists.
* no Live Capacity exists.
* no unmet Goal Demand query against Found Time exists.
* no short-horizon Goal Proposal exists.
* direct unplanned execution exists but lacks first-class Goal-linked spontaneous-execution provenance.
* all upstream semantic blockers are now considered resolved normatively.
* Found Time should be handled as a Live Proposal input/use case, not an independent authority domain.

The audit recommended:

> **Path A — Constructive Proposal Architecture Specification.**

Treat these findings as evidence constraints.

---

## 3. Accepted Upstream Architecture

This specification must compose with the accepted architectural chain.

### Capacity

Capacity is deterministic, explainable, interval-based, liability-aware, demand-neutral, derived, and non-authoritative.

### Goal Structure

Goal Structure resolves:

* Goal relationships;
* dependencies;
* Structural Eligibility;
* Demand normalization/accounting context;
* Goal Priority structural scope;
* multi-path deduplication.

Proposal MUST NOT traverse Goal Structure to invent these semantics.

### Goal Demand / Allocation

Goal Demand is explicit resource-seeking intent.

Demand Projection produces horizon-specific planning demand.

Allocation is deterministic, provisional, explainable distribution reasoning across competing Demand.

Allocation is not user authority.

### Commitment Composition

Commitment Composition resolves:

* attached support activities;
* Buffers;
* Composite Footprint;
* Composite Feasibility;
* productive Goal work versus operational overhead;
* Composite Liability;
* Scheduled Support Activity;
* composition-aware execution and Found-Time protection.

Proposal MUST NOT invent operational overhead.

### Friction

Friction remains corrective.

### Execution

Execution records what actually happened.

### History

Historical decision interpretation must remain immutable.

---

## 4. Normative Planning Chain

The specification must establish a final normative chain consistent with:

```text
Authored Goals / Goal Structure / Goal Priority / Goal Demand
→ Structural Eligibility
→ Demand Projection
→ Demand Normalization
→ Capacity
→ Goal-Specific Feasibility
→ Commitment Composition Footprint
→ Competing Demand
→ Allocation
→ Constructive Proposal
→ User Accept / Modify / Reject
→ Accepted Allocation
→ Scheduled Goal Work + Scheduled Support Activity + Buffers
→ Execution
→ Progress / Summary / Learning Evidence
```

For Found Time:

```text
Published Plan
→ Execution Divergence
→ released interval
→ subtract remaining obligations / liabilities
→ Live Capacity / Found Time
→ eligible normalized unmet Goal Demand
→ composition-aware Feasibility
→ Allocation
→ Found-Time Proposal
→ User Accept / Modify / Reject
→ bounded one-off authority
→ scheduled work or direct execution
→ History
```

And separately:

```text
Found Time
→ user acts directly without Proposal
→ direct / unplanned Goal execution
→ historical evidence
```

---

## 5. Core Proposal Definition

Define **Constructive Proposal** normatively.

Candidate principle:

> **A Constructive Proposal is a deterministic, explainable, non-authoritative recommendation presenting one or more bounded ways the user could allocate currently available planning resources toward eligible Goal Demand.**

The final definition must establish that Proposal:

* is derived;
* is non-authoritative;
* references explicit upstream reasoning;
* contains one or more bounded options or an explicit No-Proposal result;
* may be accepted, modified, or rejected;
* does not own time before acceptance;
* does not create Goal Demand;
* does not create Capacity;
* does not alter Goal Priority;
* does not invent Goal Structure;
* does not invent Commitment Composition;
* is distinct from Preview;
* is distinct from Allocation;
* is distinct from Friction;
* is distinct from scheduled reality.

---

## 6. Proposal as Epistemic Boundary

Establish Proposal as the architectural boundary between:

### Engine Reasoning

What DayFrame calculates could be done.

and:

### User Intent

What the user authorizes.

The specification must preserve:

**Derived truth ≠ proposed action ≠ accepted decision ≠ scheduled reality ≠ executed reality.**

No generated recommendation becomes time-owning merely because it appears in UI.

---

## 7. Proposal vs Preview

Define the normative distinction.

### Preview

Projects existing authorized schedule state.

### Proposal

Recommends new discretionary allocation.

Preview may display Proposal output after acceptance only once that output becomes authorized scheduling state.

Proposal MUST NOT be represented merely as another automatically scheduled Preview block before acceptance.

---

## 8. Proposal vs Recurring Commitment Realization

Explicitly preserve:

> **Deterministic realization of prior recurring scheduling authority is not a new Proposal.**

A user who has already authored:

```text
Study Network+
3 times per week
preferred evening
```

does not need to accept every generated occurrence merely because DayFrame chooses exact placement.

Proposal applies when DayFrame is recommending **new discretionary use of Capacity**, not replaying previously authorized scheduling patterns.

---

## 9. Proposal vs Friction

Define the final normative distinction.

### Constructive Proposal

Answers:

> “How could available Capacity be used?”

### Friction

Answers:

> “How should already-authorized incompatible facts be repaired?”

The same recommendation infrastructure may share:

* IDs;
* explanations;
* alternative presentation;
* acceptance patterns;
* provenance patterns;

but Proposal and Friction MUST remain distinct domain concepts.

---

## 10. Proposal vs Allocation

Define the boundary.

### Allocation

Determines provisional resource distribution among competing Goal Demand.

### Proposal

Transforms selected feasible Allocation reasoning into concrete, user-reviewable recommendation options.

Allocation does not itself imply:

* exact placement;
* user intent;
* scheduling authority.

Proposal MUST preserve Allocation provenance.

---

## 11. Proposal Input Contract

Define the minimum authoritative/derived inputs Proposal may consume.

At minimum evaluate:

* Capacity result;
* Capacity freshness/coverage/liability state;
* normalized eligible Goal Demand;
* Goal Priority;
* Goal-Specific Feasibility;
* Commitment Composition footprint;
* productive work / overhead classification;
* Allocation result;
* Allocation Policy version;
* accepted-choice guidance;
* historical tendency;
* current time for Live contexts;
* Found-Time interval;
* planning horizon;
* recommendation scope.

Proposal MUST NOT mutate these inputs.

---

## 12. Upstream Completeness

Define what input states permit Proposal generation.

Examples:

* Capacity stale;
* Capacity partially covered;
* Demand stale;
* Structural Eligibility unknown;
* composition footprint unknown;
* Allocation unresolved;
* Goal Priority ambiguous;
* current time unavailable for Live Proposal.

Determine whether Proposal should:

* abstain;
* return limited options;
* return unknown;
* return explicit No-Proposal with reason.

Do not allow missing inputs to become silent assumptions.

---

## 13. Proposal Context

Define **Proposal Context** if useful.

Potential context kinds:

* ordinary planning;
* review-time planning;
* one-user-day planning;
* Found Time / Live Opportunity;
* user-invoked “what should I do?”;
* recommendation refresh after changed authority.

Determine whether context is a first-class identity-bearing input or simply typed metadata.

---

## 14. Proposal Horizon

Resolve the planning-range/review-scope seam.

Define a **Proposal Horizon** that is independent of broad planning-data availability.

Potential examples:

* one user-day;
* current Found-Time interval;
* tonight;
* bounded date range;
* one planning window.

The Proposal Horizon MUST NOT silently expand because Preview or planning data spans a month/year.

---

## 15. Review Scope

Distinguish:

### Planning Data Horizon

How much data the engine may inspect.

### Proposal Horizon

Where recommendation reasoning is allowed.

### Review Scope

How much Proposal output the user is currently asked to review.

These MUST NOT be conflated.

---

## 16. Proposal Scope

Define the scope of one Proposal.

Evaluate:

### One Opportunity

One Capacity interval.

### One User-Day

Multiple relevant opportunities.

### Bounded Planning Window

A small set of days.

### Found-Time Interval

One newly available Live interval.

Select allowed V1 scopes.

Avoid default open-ended proposal scope.

---

## 17. Proposal Identity

Define whether Proposal requires:

* opaque never-reused Proposal ID;
* createdAt;
* evaluation cutoff;
* context;
* horizon;
* status;
* source fingerprints;
* supersession.

Proposal identity MUST remain distinct from:

* Allocation ID;
* option ID;
* decision ID;
* Accepted Allocation ID;
* scheduled occurrence ID.

---

## 18. Proposal Lifecycle

Define a lifecycle covering at minimum:

* generated;
* presented/available;
* modified;
* accepted;
* rejected;
* stale;
* superseded;
* expired;
* inapplicable.

Determine whether all are persisted states or some are derived.

A Proposal must not remain silently actionable after material input changes.

---

## 19. Proposal Option

Define **Proposal Option**.

An option should represent one concrete candidate use of Capacity.

Potential content:

* Goal / Demand identity;
* productive duration;
* operational overhead;
* exact or bounded placement;
* Capacity claim;
* expected Demand satisfaction;
* Goal Priority context;
* explanation;
* assumptions;
* tradeoffs;
* feasibility provenance;
* Allocation provenance.

Determine whether a Proposal contains:

* one preferred option plus alternatives;
* ranked options;
* unranked alternatives;
* multiple independent recommendations.

---

## 20. Proposal Cardinality

Select the V1 cardinality model.

Evaluate:

### Model A — One Proposal = One Recommended Option

### Model B — One Proposal = Preferred Option + Alternatives

### Model C — One Proposal = Ranked Option Set

### Model D — Multiple Independent Proposals Per Horizon

Choose the smallest architecture that supports meaningful user choice without excessive complexity.

---

## 21. Proposal Option Identity

Determine whether every option needs stable identity.

This is required if:

* user accepts one among alternatives;
* user modifies an option;
* rejection preserves which option was rejected;
* history explains the choice set.

Specify deterministic or opaque identity requirements.

---

## 22. Deterministic Option Generation

Equivalent semantic inputs must produce equivalent option sets/order unless user-authored policy changes.

Define deterministic requirements for:

* option generation;
* tie-breaking;
* ranking;
* explanation;
* abstention.

Storage order, random generation, or LLM nondeterminism MUST NOT determine planning authority.

---

## 23. Proposal Ranking

Define the allowed ranking inputs.

Potential inputs:

* Goal Priority;
* Allocation result;
* Allocation Policy;
* feasibility quality;
* Capacity efficiency;
* target pressure;
* continuity;
* fragmentation avoidance;
* accepted-choice guidance;
* historical tendencies.

Proposal ranking MUST NOT silently introduce new user-value semantics.

---

## 24. Allocation Policy Boundary

Use accepted Allocation Policy architecture.

Proposal may communicate Allocation Policy effects but MUST NOT invent policy.

Examples:

* priority precedence;
* minimum useful satisfaction;
* fairness;
* continuity;
* target-date pressure;
* fragmentation avoidance.

Specify how policy provenance reaches Proposal explanation.

---

## 25. Engine Heuristics

Separate engine heuristics from user-value authority.

Examples of permissible heuristics may include:

* deterministic tie-break;
* earliest feasible slot;
* least fragmentation;
* stable ordering.

A heuristic may optimize within policy but MUST NOT masquerade as:

* Goal Priority;
* reusable preference;
* learned rule;
* user acceptance.

---

## 26. Recommendation Explanation

Define the minimum explanation contract.

For each recommended option, DayFrame should be able to explain:

* what it recommends;
* which Goal it serves;
* which Demand it satisfies;
* why it fits;
* how much Capacity it consumes;
* productive vs overhead time;
* which Priority/Policy influenced ranking;
* why alternatives were lower-ranked or excluded where useful;
* what assumptions or unknowns exist.

Do not prescribe exact UI copy.

---

## 27. Explanation Provenance

Every explanation must be traceable to deterministic inputs.

Avoid free-form explanation unsupported by architecture.

If language generation is used later, it must render structured reasons rather than invent reasons.

---

## 28. Proposal Confidence / Qualification

Determine whether Proposal requires explicit qualifications such as:

* complete;
* limited;
* uncertain;
* stale;
* partial coverage;
* liability affected.

Do not use probabilistic “confidence” unless meaningful.

Prefer deterministic qualification states where possible.

---

## 29. No-Proposal Result

Define a first-class **No-Proposal** outcome.

Potential reasons:

* no Capacity;
* no unmet eligible Demand;
* all Demand satisfied;
* no Demand fits;
* composition footprint infeasible;
* Allocation produces no worthwhile option;
* required input stale;
* required input unknown;
* horizon too small;
* user policy forbids recommendation;
* abstention due ambiguity.

No-Proposal MUST NOT automatically mean error.

---

## 30. No-Proposal Identity / History

Determine whether No-Proposal is:

* ephemeral result;
* persisted when user explicitly requested recommendation;
* historical reasoning evidence when important.

Avoid storing meaningless noise.

---

## 31. Proposal Acceptance

Define explicit Proposal acceptance.

Acceptance MUST:

* identify Proposal and option;
* verify current applicability;
* verify material dependencies/fingerprints;
* create bounded user authority;
* preserve acceptance timestamp;
* preserve accepted option;
* preserve original Proposal provenance.

Acceptance MUST NOT silently change recurring authoring unless scope explicitly says so.

---

## 32. Proposal Modification

Define modification semantics.

Example:

```text
Proposal:
Network+ 45m at 19:00

User:
30m at 20:00
```

The architecture must preserve:

* original Proposal;
* original option;
* user delta;
* modified candidate;
* revalidation result;
* final accepted authority.

Modification is not merely replacement.

---

## 33. Modification Revalidation

Material user changes may invalidate:

* Capacity fit;
* minimum session;
* composition footprint;
* Goal Demand satisfaction;
* competing Allocation assumptions.

Define when modification requires re-running:

* Feasibility;
* Allocation;
* Proposal ranking;
* only local validation.

User authority does not exempt modified plans from hard constraints.

---

## 34. Proposal Rejection

Define explicit rejection.

Rejection:

* creates no scheduling authority;
* does not mutate Goal Demand;
* does not mutate Goal Priority;
* does not mutate Capacity;
* does not automatically create reusable preference;
* may preserve historical evidence.

Determine whether user may reject:

* one option;
* entire Proposal;
* all proposals in current context.

---

## 35. Rejection Reason

Determine whether rejection reason is:

* optional;
* structured;
* free text;
* absent in V1.

If captured, it remains historical evidence and does not silently become policy.

---

## 36. Ignored / Expired Proposal

Distinguish:

* explicit rejection;
* user ignores Proposal;
* Proposal expires;
* Proposal becomes stale;
* Proposal is superseded.

Absence of acceptance MUST NOT be interpreted as explicit rejection.

---

## 37. Accepted Allocation

Define the transition from accepted Proposal to **Accepted Allocation**.

Accepted Allocation must record bounded user authority over:

* selected Goal Demand;
* Capacity claim;
* productive work;
* support overhead;
* placement/scope;
* decision provenance.

Clarify relationship to existing Goal Demand / Allocation specification.

---

## 38. Accepted Allocation Scope

Define possible scopes.

At minimum evaluate:

* one occurrence;
* one user-day;
* bounded repeat;
* explicit recurring pattern conversion.

Open recurring authority MUST require separate explicit authoring/acceptance.

One-off acceptance is the default for Found Time.

---

## 39. Accepted Allocation vs PlanDecision

Explicitly distinguish:

### Accepted Allocation

Authorizes new Goal-driven discretionary work.

### PlanDecision

Overrides an already-authorized occurrence.

### CompositeDecision

Coordinates accepted changes across composed occurrences.

These may share infrastructure but MUST NOT collapse into one semantic type.

---

## 40. Accepted Allocation vs Authored Commitment

Determine when Accepted Allocation remains one-off versus when user explicitly promotes it into reusable scheduling authority.

Repeated acceptance MUST NOT automatically create a Commitment.

---

## 41. Scheduled Goal Work

Define what acceptance produces.

At minimum:

* Scheduled Goal Work for productive activity;
* Scheduled Support Activity for required real overhead;
* Buffer protection for non-activity overhead.

These become scheduled authority only after acceptance.

---

## 42. Publication Boundary

Specify whether accepted Goal work must become part of Preview/current schedule before historical publication.

Recommendation alone MUST NOT be publishable as scheduled truth.

The flow should preserve:

```text
Proposal
→ acceptance
→ authorized scheduled representation
→ publication
```

---

## 43. Proposal Staleness

Define material dependencies.

At minimum:

* Capacity fingerprint;
* Goal Demand revision/projection;
* Structural Eligibility;
* Demand normalization;
* Goal Priority;
* Feasibility;
* Composition Footprint;
* Allocation;
* Proposal Horizon;
* current time for Live context;
* Found-Time interval;
* accepted competing work;
* user-day policy.

Material changes stale Proposal.

---

## 44. Proposal Expiration

Found-Time Proposal may become invalid simply because time passes.

Determine whether Proposal can carry:

* `validUntil`;
* latest acceptable start;
* interval expiry;
* current-time cutoff.

Ordinary planning Proposal may have different expiration semantics.

---

## 45. Proposal Revalidation

Define when acceptance can:

* revalidate automatically and proceed;
* require regeneration;
* become inapplicable;
* preserve original Proposal historically but create new current Proposal.

Staleness MUST NOT silently apply outdated reasoning.

---

## 46. Proposal Supersession

A newly generated Proposal for the same context may supersede an old one.

Specify whether supersession:

* preserves old Proposal;
* prevents future acceptance;
* records lineage.

---

## 47. Proposal Historical Provenance

Define the minimum immutable decision-time provenance.

At minimum consider:

* Proposal ID;
* option IDs;
* Goal ID/revision;
* Demand ID/revision/projection;
* Structural Eligibility provenance;
* Capacity fingerprint;
* relevant Capacity intervals;
* Goal Priority authority;
* Feasibility result;
* Composite Footprint;
* Allocation result/policy;
* option ranking;
* explanations/reason codes;
* user delta;
* accept/reject;
* decision timestamp;
* scope.

Avoid freezing excessive mutable state if exact immutable references/fingerprints suffice.

---

## 48. Historical Snapshot Strategy

Evaluate:

### Model A — Full Decision-Time Snapshot

### Model B — Immutable References + Fingerprints

### Model C — Decisive Snapshot + Immutable References

Select a normative strategy.

It must prevent later mutable state from rewriting historical reasoning.

---

## 49. Proposal History vs Schedule History

Keep separate:

### Proposal History

What DayFrame recommended and what the user decided.

### Schedule History

What was authorized/published.

### Execution History

What actually happened.

A rejected Proposal may have Proposal history but no schedule history.

---

## 50. Accepted Choice

Define Proposal acceptance as an **Accepted Choice** at a specific scope.

Preserve:

> Accepted Choice ≠ reusable Preference.

One accepted Proposal records what the user chose then.

---

## 51. Learned Guidance

Define how history may eventually inform future Proposal.

Historical behavior may create **derived guidance**, not authority.

Examples:

* user often chooses Network+ during 30–60m Found Time;
* user rejects late-evening workout proposals;
* user frequently modifies 60m study proposals to 30m.

Derived guidance may affect explanation/ranking only under explicit architecture.

It MUST NOT:

* create Goal Priority;
* create Demand;
* create recurring schedule authority;
* create reusable preference silently.

---

## 52. Reusable Preference Promotion

If user wishes to turn repeated behavior into reusable policy, this requires explicit authored transition.

Examples:

> “Prefer Network+ during unexpected 30–60m opportunities.”

That is new preference authority, not merely accumulated history.

Do not specify the full learning engine.

---

## 53. Direct User Authoring

Proposal remains optional.

Users may directly:

* create Commitment;
* create manual event;
* author recurring pattern;
* directly schedule Goal work if supported;
* log unplanned execution.

The engine MUST NOT force Proposal mediation for intentional direct action.

---

## 54. Direct Goal Scheduling

Define whether a user may directly create one-off Goal work without engine recommendation.

If yes, it should create bounded accepted scheduling authority with provenance:

* `origin: directUserAuthoring`

rather than fabricated Proposal provenance.

Determine relationship to Accepted Allocation.

---

## 55. Direct Spontaneous Goal Execution

Define a first-class epistemic path for:

> “I just spent 45 minutes on Network+.”

without prior schedule or Proposal.

The resulting fact must preserve:

* Goal identity;
* direct/unplanned origin;
* actual timing/duration;
* execution evidence;
* optional Progress evidence linkage;
* no fabricated Proposal;
* no fabricated Accepted Allocation;
* no fabricated scheduled occurrence unless historical architecture explicitly introduces a retrospective execution occurrence.

Resolve the boundary.

---

## 56. Execution vs Progress

Preserve:

**Execution effort ≠ Goal Progress.**

Direct spontaneous Goal execution may:

* produce execution evidence;
* optionally support a Progress observation;
* not automatically update Progress unless measurement policy permits.

---

## 57. Proposal-to-Execution Provenance

Scheduled Goal work derived from accepted Proposal should preserve lineage:

```text
Proposal
→ Proposal Decision
→ Accepted Allocation
→ Scheduled Goal Work
→ Execution
```

Spontaneous action should preserve:

```text
Direct User Action
→ Execution
```

Do not fabricate missing intermediate states.

---

## 58. Found Time Definition

Adopt or refine:

> **Found Time is newly available discretionary time discovered during execution because actual conditions diverged from the currently authorized plan.**

Found Time is derived Live availability.

It is not:

* authored Capacity;
* Commitment;
* Goal;
* Demand;
* Accepted Allocation;
* Proposal;
* retroactive plan correction.

---

## 59. Found Time Source Events

Define which Live events may create a Found-Time candidate.

At minimum:

* Commitment canceled/skipped;
* activity completed early;
* Work completed early;
* Attached Activity completed early;
* optional attachment omitted;
* Buffer explicitly released;
* user directly declares unexpected availability.

Determine whether “required attachment skipped” immediately creates Found Time or instead remains liability until resolved.

---

## 60. Released Interval

Define **Released Interval** as an intermediate derived concept if useful.

Released Interval is the clock span potentially freed by divergence before remaining obligations/liabilities are subtracted.

Released Interval MUST NOT automatically equal Capacity.

---

## 61. Live Capacity

Define **Live Capacity** as the current-time evaluation of allocatable Capacity after execution divergence and remaining obligations are accounted for.

Potential pipeline:

```text
released interval
→ clip to now/future
→ subtract already executed time
→ subtract remaining scheduled obligations
→ subtract required composite components
→ subtract Buffers still applicable
→ subtract unresolved liabilities
→ apply availability policy
→ Live Capacity
```

Ensure compatibility with accepted Capacity specification.

---

## 62. Found Time as Capacity Provenance

Determine whether Found Time is:

* a special Capacity subtype;
* Capacity interval carrying origin provenance;
* Live context wrapping Capacity.

Prefer avoiding a second Capacity domain if provenance suffices.

---

## 63. Found-Time Proposal

Define Found-Time Proposal as an ordinary Constructive Proposal with:

* Live context;
* narrow Proposal Horizon;
* Found-Time/Live Capacity provenance;
* current-time validity;
* one-off default scope.

It MUST use the same:

* Goal Demand;
* Structural Eligibility;
* Goal Priority;
* Composition Footprint;
* Feasibility;
* Allocation;
* Proposal decision;
* user-authority rules.

---

## 64. Found-Time Horizon

Default Found-Time Proposal horizon should be the safe allocatable interval, not the entire day/week.

Determine whether it may inspect broader future obligations while recommending only within the Found-Time interval.

---

## 65. Found Time and Goal Demand

Only unmet, active, structurally eligible Demand may participate.

The system MUST respect:

* minimum useful session;
* maximum useful allocation;
* splittability;
* cadence;
* timing constraints;
* target-date policy;
* already satisfied/accepted work.

Found Time does not create Demand.

---

## 66. Found Time and Composition

Full required operational footprint must fit.

Example:

```text
Found Time: 45m
Workout core: 30m
Travel: 30m
```

No valid workout option exists even though core fits.

Proposal must explain the operational reason.

---

## 67. Found Time and Buffers

Released Buffer time may become candidate availability only if:

* its protection is no longer required;
* releasing it does not violate remaining composite constraints;
* user/Live policy permits release.

Buffer has no execution fact.

---

## 68. Found Time and Required Failure

If a required component is skipped or unresolved, its time MUST NOT automatically become Found Time.

Unresolved liability may continue protecting Capacity until:

* authority changes;
* component becomes impossible/irrelevant;
* user explicitly waives requirement;
* corrective decision resolves it.

---

## 69. Found Time and Actual Duration

Planned-vs-actual variance may create released time.

Preserve:

* planned interval;
* actual start;
* actual duration/end;
* divergence type;
* released interval;
* remaining obligations;
* resulting Live Capacity.

---

## 70. Found Time and Cancellation

Cancellation does not erase historical plan.

The plan remains:

> “This was scheduled.”

Execution/Live truth becomes:

> “This did not occur.”

Released time may then become Live Capacity if no remaining obligation blocks it.

---

## 71. Manual Found-Time Declaration

Determine whether user may state:

> “I unexpectedly have 45 minutes free.”

This should create a **Live availability assertion**, not automatically overwrite authoritative schedule facts.

The system must validate it against known obligations/liabilities and surface contradictions.

---

## 72. Found-Time Proposal Acceptance

Acceptance should normally create:

* bounded one-off Accepted Allocation;
* one-off Scheduled Goal Work;
* support activity / Buffer scope where applicable.

It MUST NOT silently create recurring Commitment authority.

---

## 73. Found-Time Proposal Modification

User may change:

* selected Goal;
* duration;
* start;
* option.

Modification must revalidate against shrinking Live Capacity and current time.

---

## 74. Found-Time Proposal Rejection

Rejection:

* leaves Found Time unused/available;
* creates no scheduling authority;
* may preserve Proposal history;
* does not become a negative preference automatically.

---

## 75. Found-Time Proposal Expiration

Because clock time passes, Found-Time Proposal should have strong validity semantics.

Specify:

* expiry at interval end;
* earliest/latest start;
* staleness when another obligation changes;
* supersession when Live Capacity changes.

---

## 76. Spontaneous Found-Time Use

Define:

```text
Found Time
→ user directly performs Goal work
→ execution evidence
```

without Proposal.

Preserve provenance:

* `origin: directFoundTimeAction` or equivalent semantic concept;
* Found-Time interval reference if known;
* Goal reference;
* no Proposal decision.

Do not require retroactive recommendation.

---

## 77. Planned vs Direct vs Found-Time Provenance

Define distinct origins for at minimum:

* recurring scheduled Commitment;
* manually authored scheduled event;
* accepted ordinary Proposal;
* accepted Found-Time Proposal;
* direct scheduled Goal work;
* spontaneous direct Goal work;
* spontaneous Found-Time Goal work;
* Friction-modified occurrence.

These origins may share downstream execution infrastructure.

---

## 78. Learning Evidence

Define what future learning may observe from Proposal lifecycle:

* option shown;
* accepted;
* modified;
* rejected;
* ignored/expired;
* direct alternative chosen;
* spontaneous Goal work.

Do not define a learning algorithm.

Preserve enough provenance to make future inference epistemically honest.

---

## 79. Proposal Recommendation History

Determine what Proposal lifecycle events merit durable persistence.

Likely candidates:

* accepted;
* modified-and-accepted;
* explicitly rejected;
* possibly superseded Proposal that had user interaction.

Avoid storing every ephemeral generated option if never surfaced/acted upon unless needed for determinism/debugging.

Select a policy.

---

## 80. Proposal Persistence

Define current persistence requirements for:

* Proposal;
* Proposal option;
* Proposal decision;
* rejection;
* user delta;
* Accepted Allocation;
* supersession;
* reasoning provenance.

Distinguish transient derived cache from durable historical decision evidence.

---

## 81. Backup / Restore

Specify requirements for future backup/restore.

At minimum:

* versioned Proposal decisions;
* accepted/rejected history;
* proposal IDs where historical;
* option identities;
* Accepted Allocation;
* immutable references/fingerprints;
* direct spontaneous Goal execution provenance;
* Found-Time decision history;
* no dangling proposal/schedule references;
* deterministic restore.

Do not implement migrations.

---

## 82. Proposal Deletion / Retention

Determine whether historical accepted/rejected Proposal evidence can be deleted.

Preserve immutable planning/history principles.

Hard deletion should be limited to ephemeral never-decided Proposal cache where appropriate.

---

## 83. Proposal and Privacy / Data Minimization

Because recommendation history may become extensive, define minimal necessary durable reasoning provenance.

Avoid storing verbose generated explanations when structured reason codes/references suffice.

History must remain explainable without storing unnecessary transient data.

---

## 84. Proposal Reason Codes

Determine whether structured reason codes are required.

Potential categories:

* highestPriorityEligibleDemand;
* onlyFeasibleDemand;
* fitsFoundInterval;
* compositionOverheadExcludedOption;
* minimumSessionNotMet;
* competingDemandAllocationResult;
* continuityPreference;
* noCapacity;
* noEligibleDemand;
* staleInput.

Do not finalize exact labels unless necessary.

---

## 85. Proposal Alternative Exclusion

Proposal should be able to explain why seemingly relevant Goals did not appear.

Examples:

* dependency blocked;
* minimum session too large;
* insufficient Capacity;
* composition overhead does not fit;
* lower Allocation rank;
* Demand already satisfied;
* timing incompatible.

This improves epistemic integrity.

---

## 86. Proposal Modification Boundaries

Determine which user edits remain modifications of one Proposal option versus becoming direct authoring.

Example:

* 45m → 30m same Goal: likely modification.
* Network+ → Writing: perhaps selection of another option.
* arbitrary unrelated manual event: direct authoring.

Select bounded semantics.

---

## 87. Proposal Bundles

Evaluate whether one Proposal may recommend multiple activities together.

Example:

```text
Tonight:
Network+ 45m
Writing 30m
```

Do not assume bundle support is necessary in V1.

Assess whether Proposal should initially target one Capacity opportunity / one accepted allocation at a time.

Select the minimal model.

---

## 88. Proposal Scheduling Precision

Determine whether Proposal options specify:

* exact start/end;
* flexible bounded window;
* Capacity interval + duration;
* multiple feasible placements.

Accepted authority must be concrete enough to schedule deterministically.

---

## 89. Placement After Acceptance

Determine whether exact placement happens:

### Before Proposal

Proposal shows concrete placement.

### After Acceptance

Proposal offers resource allocation, then deterministic scheduler chooses placement.

### Hybrid

Proposal may show a proposed placement while acceptance authorizes a bounded placement scope.

Select normative behavior.

Ensure user knows what they are accepting.

---

## 90. Proposal and Scheduling Heuristics

If placement after acceptance is allowed within a bounded window, user acceptance may authorize deterministic scheduler choice inside that declared scope.

This is analogous to recurring Commitment placement but bounded to Accepted Allocation.

Specify exact authority boundary.

---

## 91. Proposal and Manual Override

User must remain able to:

* choose another option;
* modify time;
* modify duration within Demand constraints;
* decline;
* directly author something else.

Proposal is assistance, not control.

---

## 92. Proposal and User Values

The system must distinguish:

* explicit Goal Priority;
* explicit Allocation Policy;
* accepted reusable preference;
* historical guidance;
* engine heuristic.

Proposal explanation should expose the authority basis where relevant.

---

## 93. Proposal and Deterministic Learning Inputs

If historical guidance is used later, deterministic Proposal should receive an explicit versioned guidance input.

Do not allow hidden mutable model state to influence ranking without provenance.

---

## 94. Proposal and LLM Boundary

If natural-language AI assistance is ever used for explanation or decomposition, define that it MUST NOT directly determine:

* Capacity;
* Demand;
* Priority;
* Allocation;
* Proposal option ranking;
* scheduling authority.

The deterministic planning domain remains authoritative.

LLM output may render explanations or propose candidate structure subject to explicit acceptance.

---

## 95. Recommendation Horizon and Current Time

Ordinary planning Proposal may be date-based.

Found-Time Proposal is clock-sensitive.

Define current-time evaluation requirements separately.

Do not make historical replay depend on current clock.

---

## 96. User-Day Semantics

Proposal and Found Time MUST use canonical DayFrame user-day ownership.

An overnight worker's 01:00 Found Time may belong to the same user-day as the prior evening's Work.

Calendar midnight MUST NOT reset recommendation context.

---

## 97. Cross-User-Day Proposal

Determine whether a Proposal option may cross a user-day boundary.

If permitted, it must preserve:

* exact Capacity ownership;
* Demand horizon;
* composition user-day semantics.

V1 may restrict Proposal options to one user-day if justified.

Select a normative rule.

---

## 98. Proposal Failure Taxonomy

Define a bounded semantic distinction among:

* no Capacity;
* no eligible Demand;
* Demand infeasible;
* composition infeasible;
* Allocation produced no selected option;
* stale inputs;
* unknown inputs;
* policy abstention;
* internal error.

These MUST NOT all collapse into “No recommendations.”

---

## 99. Proposal vs Error

A valid No-Proposal result is not an error.

An error means deterministic reasoning could not complete correctly.

Specify this boundary.

---

## 100. Proposal vs Friction Transition

Define the exact transition:

```text
Proposal
→ accepted bounded authority
→ Scheduled Goal Work
```

After that point, if new facts make the accepted schedule incompatible:

```text
Scheduled Goal Work
→ conflict
→ Friction
```

The original Proposal may remain historical provenance but is no longer the active resolution mechanism.

---

## 101. Proposal Revision After Acceptance

Determine whether an accepted Proposal may be “edited” after acceptance or whether changing scheduled work becomes:

* PlanDecision;
* CompositeDecision;
* direct schedule edit;
* Friction resolution.

Prefer not to mutate historical Proposal decisions retroactively.

---

## 102. Proposal Cancellation After Acceptance

Cancellation of accepted scheduled Goal work is a schedule/execution event, not Proposal rejection.

Preserve the distinction.

---

## 103. Proposal Surface Boundary

Do not redesign UI, but define conceptual surface responsibilities.

Proposal must expose enough information for user authority:

* what;
* why;
* when;
* productive duration;
* overhead;
* Goal served;
* alternatives where relevant;
* accept;
* modify;
* reject.

Found-Time Proposal may be more compact due time sensitivity.

---

## 104. Proposal Interaction With Planner

Determine whether ordinary Proposal belongs conceptually in:

* Review Schedule;
* Month planning;
* dedicated recommendation panel;
* contextual Goal planning.

Do not prescribe final UI.

Establish only that Proposal is a planning construct, not Summary/history.

---

## 105. Proposal Interaction With Today / Live

Found-Time Proposal belongs to Live/Today context.

It may be triggered by:

* divergence;
* user request;
* newly detected Live Capacity.

Do not require proactive interruption behavior in this specification.

---

## 106. Proposal Interaction With Summary

Summary may later show:

* accepted proposals;
* rejected proposals;
* direct versus proposed execution;
* patterns.

Summary MUST NOT become an authority source merely because it displays historical trends.

---

## 107. Found-Time Notification Boundary

Determine whether detection automatically surfaces a Proposal or merely creates a Live opportunity.

Possible architecture:

```text
Found Time detected
→ Live Opportunity
→ recommendation requested/eligible
→ Proposal
```

This may be preferable to assuming every Found-Time event should produce an intrusive recommendation.

Select a normative boundary.

---

## 108. Live Opportunity

Define **Live Opportunity** if useful.

Candidate:

> A Live Opportunity is a bounded current Capacity context created or discovered during execution and eligible for optional constructive planning.

Found Time may be one origin of Live Opportunity.

Other origins may include:

* user manually requests “what can I do now?” during ordinary Capacity.

Determine whether this abstraction is useful or unnecessary.

---

## 109. Found Time vs Live Opportunity

If both terms are retained:

* Found Time describes provenance: availability created by divergence.
* Live Opportunity describes present planning context.

Clarify relationship.

Avoid redundant domains.

---

## 110. Direct “What Should I Do Now?” Request

A user may invoke Proposal even without Found Time.

Example:

> “I have 45 minutes. What should I work on?”

This may create a Live Opportunity from validated current Capacity.

Specify whether same short-horizon Proposal machinery applies.

---

## 111. User-Declared Availability Validation

If user says “I have 45 minutes,” DayFrame should not blindly ignore a known hard Commitment.

Determine whether user declaration:

* overrides schedule;
* asserts availability;
* triggers contradiction warning;
* requires explicit override.

Preserve user authority while keeping epistemic truth clear.

---

## 112. Proposal and Accepted-Choice Guidance

Define how previously accepted choices may inform future Proposal.

Accepted Choice may be included as:

* historical context;
* tie-break guidance;
* explanation.

It MUST NOT become reusable preference without explicit promotion.

Determine whether Proposal V1 should consume such guidance or merely preserve the future boundary.

---

## 113. Proposal and Historical Tendency

Historical tendency is lower authority than explicit Goal Priority/Policy.

Define ordering:

```text
Explicit authored authority
→ reusable accepted preferences
→ bounded accepted-choice guidance
→ historical tendencies
→ engine heuristics
```

Ensure compatibility with broader DayFrame authority ordering.

---

## 114. Authority Ordering

Produce a normative Proposal authority ordering incorporating:

1. hard user-authored constraints;
2. accepted scheduling authority;
3. Capacity/availability policy;
4. Goal Demand hard constraints;
5. Goal Priority;
6. Allocation Policy;
7. reusable explicit preferences;
8. accepted-choice guidance;
9. learned tendency;
10. engine heuristics.

Refine as necessary.

No lower level may silently override higher authority.

---

## 115. Required Proposal Models Assessment

Explicitly evaluate and select:

### Proposal Context Model

* ordinary + Live typed context;
* separate Proposal types;
* hybrid.

### Proposal Cardinality Model

* single option;
* preferred + alternatives;
* ranked option set;
* multiple independent proposals.

### Proposal Horizon Model

* one opportunity;
* user-day;
* bounded range;
* context-specific.

### Decision Model

* ProposalDecision;
* Accepted Allocation as decision;
* another bounded split.

### Rejection Model

* option rejection;
* proposal rejection;
* both.

### Historical Snapshot Model

* full snapshot;
* references/fingerprints;
* hybrid decisive snapshot.

### Found-Time Model

* Proposal subtype;
* ordinary Proposal + Live context;
* separate Found-Time Proposal domain.

### Live Opportunity Model

* first-class derived context;
* Found-Time-only context;
* unnecessary.

### Direct Goal Execution Model

* extend unplanned execution with Goal provenance;
* retrospective occurrence;
* another bounded model.

Select normative outcomes.

---

## 116. Required Normative Worked Examples

Resolve at least the following.

### Example A — One Goal, One Capacity Interval

```text
Capacity: 19:00–20:00
Network+ Demand: 45m
```

Resolve Proposal generation, option, acceptance, scheduling.

### Example B — Two Goals Compete

```text
Capacity: 60m
Network+: 45m
Writing: 45m
```

Resolve Allocation → Proposal boundary.

### Example C — Goal Priority

Network+ High; Writing Medium.

Explain authority source.

### Example D — No Goal Fits

Capacity exists but no Demand meets minimum session.

Return valid No-Proposal.

### Example E — All Demand Satisfied

No Proposal despite available Capacity.

### Example F — Core Fits, Composition Does Not

```text
Capacity: 75m
Workout core: 60m
Travel: 30m
```

Proposal excludes workout.

### Example G — Productive Work + Overhead

Proposal explains 60m Goal work requiring 90m Capacity.

### Example H — Recurring Commitment

Existing recurring Network+ Commitment is placed without Proposal acceptance.

### Example I — Constructive Proposal Modified

45m at 19:00 → user changes to 30m at 20:00.

Preserve original + delta + revalidation.

### Example J — Constructive Proposal Rejected

Preserve rejection without creating authority.

### Example K — Proposal Ignored

Distinguish expiration from rejection.

### Example L — Proposal Becomes Stale

Capacity changes before acceptance.

### Example M — User Directly Schedules Goal Work

No Proposal; preserve direct origin.

### Example N — Proposal Accepted Then Later Conflict

Transition to Friction.

### Example O — Meeting Canceled

Derive Released Interval then Live Capacity.

### Example P — Work Ends Early

Preserve planned schedule and derive candidate Found Time.

### Example Q — Commute Ends Early

Protect later required component before deriving Live Capacity.

### Example R — Buffer Released

No fake execution record.

### Example S — Required Attachment Skipped

Do not automatically count as Found Time while liability remains.

### Example T — Found Time + Network+

```text
Found Time: 45m
Network+ minimum session: 30m
```

Generate Live Proposal.

### Example U — Found Time + Workout Overhead

```text
Found Time: 45m
Workout core: 30m
Travel: 30m
```

No valid workout Proposal.

### Example V — Found-Time Proposal Modified

Time shrinks during decision.

Revalidate.

### Example W — Found-Time Proposal Rejected

No authority; preserve optional rejection history.

### Example X — Spontaneous Network+ Work

User directly studies during Found Time with no Proposal.

Preserve direct execution + Goal provenance.

### Example Y — Repeated Spontaneous Choices

Preserve evidence but no automatic preference.

### Example Z — Accepted-Choice Guidance

Previous similar choice influences future ranking only at allowed authority level.

### Example AA — Overnight Found Time

Found Time after midnight retains canonical user-day context.

### Example AB — User Says “I Have 45 Minutes”

Validate against known obligations and create Live Opportunity if coherent.

### Example AC — No Useful Recommendation

Return explicit reason, not error.

### Example AD — Proposal Explanation

Show deterministic reason chain without generated invention.

---

## 117. Required Invariants

Create a normative invariant set covering at minimum:

1. Proposal is derived and non-authoritative.
2. Preview is not Proposal.
3. recurring placement is prior-authority realization, not repeated Proposal.
4. `BlockCandidate` semantics are not reused as discretionary Goal recommendation.
5. Proposal does not create Capacity.
6. Proposal does not create Goal Demand.
7. Proposal does not create Goal Priority.
8. Proposal does not invent Goal Structure.
9. Proposal does not invent Commitment Composition.
10. Proposal consumes Allocation but Allocation is not acceptance.
11. Proposal is distinct from Friction.
12. insufficient unaccepted Demand is not Friction.
13. competing unaccepted Demands are Allocation, not Friction.
14. no useful recommendation is valid, not necessarily error.
15. Proposal scope is explicit and bounded.
16. Proposal Horizon is distinct from planning-data horizon.
17. Proposal ordering is deterministic.
18. engine heuristics do not masquerade as user-value authority.
19. Proposal explanation is traceable to deterministic reasoning.
20. Proposal acceptance creates explicit bounded authority.
21. accepted one-off Proposal does not create recurring authority.
22. modification preserves original + delta.
23. modified Proposal is revalidated.
24. rejection creates no scheduling authority.
25. rejection does not silently create preference.
26. ignoring Proposal is not rejection.
27. stale Proposal cannot be accepted without revalidation.
28. superseded Proposal cannot silently remain actionable.
29. Proposal history is distinct from schedule history.
30. current mutable state cannot rewrite historical Proposal reasoning.
31. Accepted Choice remains distinct from reusable Preference.
32. historical tendency remains non-authoritative.
33. direct user authoring remains available without Proposal.
34. spontaneous Goal execution does not fabricate Proposal.
35. execution does not automatically imply Progress.
36. Found Time remains derived availability.
37. Released Interval is not automatically Capacity.
38. Found Time preserves original plan history.
39. Found Time subtracts remaining obligations/liabilities.
40. Found-Time Proposal uses ordinary Proposal authority rules.
41. Found-Time Proposal defaults to bounded one-off scope.
42. Found Time does not create Goal Demand.
43. Found-Time Proposal respects composition footprint.
44. required unresolved attachment time is not Found Time.
45. Buffer release creates no execution record.
46. Found-Time Proposal may expire with clock time.
47. direct Found-Time action remains distinct from accepted Proposal.
48. repeated spontaneous choices do not become authority.
49. Live planning uses canonical user-day semantics.
50. Proposal does not become nondeterministic chatbot planning.
51. Proposal options preserve productive work vs overhead.
52. accepted Goal work later becoming incompatible transitions to Friction.
53. Proposal recommendation history does not duplicate scheduled/execution facts.
54. Proposal may abstain when inputs are incomplete/unknown.
55. direct user authority outranks recommendation.
56. equivalent semantic inputs yield equivalent Proposal reasoning.

Add more where necessary.

---

## 118. Required Architecture Decisions

Create individually numbered:

`CP-SPEC-01`, `CP-SPEC-02`, etc.

Each must contain:

* **Decision**
* **Normative Rule**
* **Reasoning**
* **Consequences**
* **Implementation Constraint**
* **Remaining Downstream Question**

At minimum cover:

1. Proposal definition.
2. epistemic boundary.
3. Proposal vs Preview.
4. Proposal vs recurring placement.
5. Proposal vs Friction.
6. Proposal vs Allocation.
7. input contract.
8. input completeness/qualification.
9. Proposal context.
10. Proposal Horizon.
11. Review Scope.
12. Proposal Scope.
13. Proposal identity.
14. lifecycle.
15. option model.
16. cardinality.
17. option identity.
18. deterministic ranking.
19. explanation.
20. No-Proposal.
21. acceptance.
22. modification.
23. modification revalidation.
24. rejection.
25. ignore/expiry distinction.
26. Accepted Allocation.
27. Accepted Allocation scope.
28. ProposalDecision vs PlanDecision/CompositeDecision.
29. promotion to recurring authority.
30. Scheduled Goal Work/support/Buffer creation.
31. publication boundary.
32. staleness.
33. expiration.
34. supersession.
35. historical provenance.
36. snapshot strategy.
37. Accepted Choice.
38. learning guidance.
39. reusable preference promotion.
40. direct user authoring.
41. direct Goal scheduling.
42. spontaneous Goal execution.
43. execution/Progress boundary.
44. Found Time definition.
45. Released Interval.
46. Live Capacity.
47. Found Time provenance.
48. Found-Time Proposal.
49. Found-Time Horizon.
50. Found Time / Goal Demand.
51. Found Time / composition.
52. Found Time / Buffers.
53. required failure / liability.
54. cancellation.
55. early completion.
56. manual availability declaration.
57. Found-Time acceptance/modification/rejection.
58. Found-Time expiry.
59. direct Found-Time execution.
60. proposal/live provenance categories.
61. proposal history retention.
62. persistence/backup/restore.
63. reason codes / explainability.
64. failure taxonomy.
65. Proposal placement precision.
66. placement after acceptance.
67. authority ordering.
68. LLM boundary.
69. user-day semantics.
70. Live Opportunity model.
71. current-time dependency.
72. scope limitation.

---

## 119. Required Proposal State Matrix

Produce:

| Proposal State | Derived or Authored? | Actionable? | Persist? | May Create Authority? | Historical Meaning |
| -------------- | -------------------- | ----------: | -------: | --------------------: | ------------------ |

Include:

* generated;
* shown;
* modified;
* accepted;
* rejected;
* ignored;
* stale;
* superseded;
* expired;
* inapplicable;
* No-Proposal.

---

## 120. Required Proposal Option Matrix

Produce:

| Option Concern | Required Data | Authority Source | Derived? | User Can Modify? | Historical Freeze? |
| -------------- | ------------- | ---------------- | -------: | ---------------: | -----------------: |

Include:

* Goal;
* Demand;
* productive duration;
* overhead;
* Capacity claim;
* placement;
* Priority;
* Allocation;
* explanation;
* assumptions;
* tradeoffs.

---

## 121. Required Proposal vs Friction Matrix

Produce:

| Concern                      | Constructive Proposal | Corrective Friction |
| ---------------------------- | --------------------- | ------------------- |
| Trigger                      |                       |                     |
| Input state                  |                       |                     |
| Existing authority required? |                       |                     |
| Capacity role                |                       |                     |
| Goal Demand role             |                       |                     |
| Recommendation purpose       |                       |                     |
| Acceptance effect            |                       |                     |
| Historical record            |                       |                     |
| Failure meaning              |                       |                     |

---

## 122. Required Authority Matrix

Produce:

| Concept | Epistemic Category | Authority Source | Owns Time? | May Change Capacity? | May Change Demand? | User Acceptance Required? |
| ------- | ------------------ | ---------------- | ---------: | -------------------: | -----------------: | ------------------------: |

Include:

* Capacity;
* Goal Demand;
* Allocation;
* Proposal;
* Proposal Option;
* ProposalDecision;
* Accepted Allocation;
* Scheduled Goal Work;
* Scheduled Support Activity;
* Buffer;
* Friction fix;
* PlanDecision;
* CompositeDecision;
* Found Time;
* Live Opportunity;
* direct Goal execution.

---

## 123. Required Decision Matrix

Produce:

| Decision | Input | Creates Authority? | Scope | Revalidation Required? | Reusable Preference? | Historical Provenance |
| -------- | ----- | -----------------: | ----- | ---------------------: | -------------------: | --------------------- |

Include:

* accept option;
* modify + accept;
* reject option;
* reject Proposal;
* ignore;
* direct Goal schedule;
* direct spontaneous execution;
* accept Found-Time Proposal;
* reject Found-Time Proposal;
* promote to recurring pattern.

---

## 124. Required Provenance Matrix

Produce:

| Scenario | Proposal History | Schedule History | Execution History | Goal / Demand Provenance | Must Remain Distinct? |
| -------- | ---------------- | ---------------- | ----------------- | ------------------------ | --------------------: |

Include:

* recurring Commitment;
* accepted Proposal;
* modified Proposal;
* rejected Proposal;
* direct scheduled Goal work;
* spontaneous Goal work;
* Found-Time accepted;
* Found-Time rejected;
* Found-Time direct action;
* Friction fix.

---

## 125. Required Input Dependency Matrix

Produce:

| Input | Identity / Revision Needed? | Fingerprint Needed? | Stales Proposal? | Historical Reference Needed? |
| ----- | --------------------------: | ------------------: | ---------------: | ---------------------------: |

Include:

* Capacity;
* Demand Projection;
* Structural Eligibility;
* Goal Priority;
* Feasibility;
* Composition Footprint;
* Allocation;
* Allocation Policy;
* current time;
* Found-Time interval;
* accepted-choice guidance.

---

## 126. Required No-Proposal Matrix

Produce:

| Condition | Valid No-Proposal? | Error? | Explanation Required? | User Action Possible? |
| --------- | -----------------: | -----: | --------------------: | --------------------: |

Include:

* no Capacity;
* no unmet Demand;
* all Demand satisfied;
* no minimum session fits;
* composition infeasible;
* Goal dependencies blocked;
* stale data;
* unknown data;
* ambiguous Priority;
* policy abstention.

---

## 127. Required Found-Time Source Matrix

Produce:

| Source | Planned Fact | Actual Fact | Released Interval | Liability Check | Live Capacity Result |
| ------ | ------------ | ----------- | ----------------- | --------------- | -------------------- |

Include:

* canceled meeting;
* skipped Commitment;
* early Work;
* early ordinary activity;
* early Attached Activity;
* optional component skipped;
* required component skipped;
* Buffer release;
* manual availability assertion.

---

## 128. Required Found-Time Decision Matrix

Produce:

| Scenario | Live Opportunity? | Proposal Generated? | Acceptance Scope | Direct Action Allowed? | Historical Provenance |
| -------- | ----------------: | ------------------: | ---------------- | ---------------------: | --------------------- |

Include:

* 15m Found Time;
* 45m Found Time;
* interval shrinking during decision;
* required liability remains;
* no eligible Goal Demand;
* user rejects;
* user acts spontaneously;
* user asks “what should I do now?”

---

## 129. Required Productive-vs-Overhead Matrix

Produce:

| Scenario | Productive Goal Work | Support Activity | Buffer | Capacity Cost | Demand Satisfaction | Progress |
| -------- | -------------------: | ---------------: | -----: | ------------: | ------------------: | -------: |

Include:

* workout + travel;
* study + setup activity;
* study + setup Buffer;
* Found-Time workout;
* recurring scheduled Goal work;
* direct spontaneous Goal work.

---

## 130. Required Lifecycle Matrix

Produce:

| Event | Proposal | Proposal Decision | Accepted Allocation | Scheduled Work | Historical Result |
| ----- | -------- | ----------------- | ------------------- | -------------- | ----------------- |

Include:

* generated;
* accepted;
* modified;
* rejected;
* stale;
* superseded;
* expired;
* accepted then conflict;
* canceled after acceptance;
* executed.

---

## 131. Required Transition Matrix

Produce:

| Transition | Input | Output | Automatic? | User Authority Required? | Creates Time Ownership? | Historical Freeze? |
| ---------- | ----- | ------ | ---------: | -----------------------: | ----------------------: | -----------------: |

Include:

* Allocation → Proposal;
* Proposal → acceptance;
* Proposal → modification;
* Proposal → rejection;
* accepted Proposal → Accepted Allocation;
* Accepted Allocation → Scheduled Goal Work;
* scheduled work → execution;
* execution divergence → Released Interval;
* Released Interval → Live Capacity;
* Live Capacity → Found-Time Proposal;
* Found-Time Proposal → acceptance;
* Found Time → direct execution;
* Accepted Choice → explicit reusable preference promotion.

---

## 132. Required Primitive Compatibility Matrix

Produce:

| Specification Requirement | Existing Primitive | Reuse Classification | Required Adaptation | Risk |
| ------------------------- | ------------------ | -------------------- | ------------------- | ---- |

Use:

* Directly Reusable
* Reusable with Adaptation
* Conceptually Related but Wrong Abstraction
* Not Reusable
* Not Found

At minimum evaluate:

* Preview;
* `BlockCandidate`;
* `ScheduledBlock`;
* `SuggestedFix`;
* Friction;
* `PlanDecision`;
* replay;
* accepted choices;
* preview staleness;
* durable occurrence references;
* historical occurrence;
* Goal snapshots;
* Goal Activity;
* execution record;
* unplanned execution;
* Progress observation;
* manual event;
* user-day logic;
* backup/restore.

---

## 133. Required Consistency Checks

Explicitly resolve at least:

1. recurring Commitment does not require Proposal.
2. Preview remains non-Proposal.
3. one Goal fits one Capacity interval.
4. two Goals compete.
5. Goal Priority influences Allocation/Proposal only through authority.
6. no Goal fits.
7. all Demand satisfied.
8. composition overhead prevents fit.
9. Proposal acceptance creates bounded authority.
10. Proposal modification preserves original/delta.
11. modified option becomes infeasible.
12. Proposal rejected.
13. Proposal ignored.
14. Proposal stale.
15. Proposal superseded.
16. Proposal expires.
17. direct user schedule without Proposal.
18. direct spontaneous Goal execution.
19. Proposal accepted then later Friction.
20. Proposal accepted then canceled.
21. Proposal history differs from schedule history.
22. rejected Proposal has no schedule history.
23. Found Time from cancellation.
24. Found Time from early completion.
25. Found Time from Attached Activity.
26. Buffer release.
27. required attachment skipped.
28. Found Time too small.
29. Found Time fits Goal.
30. core fits but composite does not.
31. Found-Time Proposal accepted.
32. Found-Time Proposal modified.
33. Found-Time Proposal rejected.
34. Found-Time Proposal expires.
35. Found-Time direct action.
36. repeated spontaneous action.
37. accepted-choice guidance.
38. no silent preference promotion.
39. overnight Found Time.
40. manually declared availability conflicts with known schedule.
41. current-time advance stales Live Proposal.
42. Capacity changes after Proposal.
43. Demand changes after Proposal.
44. Goal Structure changes after Proposal.
45. Composition changes after Proposal.
46. another Proposal accepted first.
47. Proposal explanation remains reproducible historically.
48. equivalent inputs produce equivalent ranking.
49. No-Proposal is not error.
50. internal failure is not No-Proposal.
51. Proposal cannot mutate Capacity/Demand/Priority.
52. LLM explanation cannot invent deterministic reason.
53. direct Goal execution does not fabricate Proposal.
54. execution does not automatically create Progress.
55. Proposal option preserves productive vs overhead.
56. planning horizon may be broad while Proposal horizon remains narrow.
57. Live Proposal is one-off by default.
58. accepted Proposal cannot silently become recurring pattern.
59. existing Friction fix remains corrective.
60. one-off accepted Goal work later becomes ordinary scheduled authority.

Resolve all contradictions before completion.

---

## 134. Implementation Constraints

A conforming future implementation must:

1. preserve Preview semantics;
2. preserve recurring-authority realization;
3. create a distinct Proposal domain;
4. preserve Proposal/Allocation distinction;
5. preserve Proposal/Friction distinction;
6. consume Capacity without mutating it;
7. consume normalized Demand without inventing it;
8. consume Goal Priority without manufacturing it;
9. consume Goal Structure outputs without graph traversal;
10. consume composition footprint without inventing overhead;
11. preserve productive work versus overhead;
12. support explicit Proposal identity;
13. support bounded Proposal Horizon;
14. separate planning-data horizon from review scope;
15. support deterministic option identity/order;
16. expose deterministic explanations;
17. represent No-Proposal explicitly;
18. support accept;
19. support modify;
20. support reject;
21. distinguish ignore/expiry from rejection;
22. preserve original Proposal + user delta;
23. revalidate modification;
24. prevent stale acceptance;
25. support supersession;
26. create bounded Accepted Allocation;
27. prevent one-off acceptance from becoming recurrence;
28. preserve direct user authoring;
29. preserve direct Goal scheduling;
30. preserve spontaneous Goal execution without fabricated lineage;
31. preserve Proposal history separately from schedule/execution history;
32. preserve immutable decision-time provenance;
33. preserve Accepted Choice vs reusable Preference;
34. prohibit silent learning authority;
35. support Found Time as derived Live input;
36. distinguish Released Interval from Live Capacity;
37. subtract remaining obligations/liabilities;
38. protect required composite components;
39. preserve Buffer semantics;
40. use ordinary Proposal lifecycle for Found Time;
41. use narrow Live horizon;
42. support Found-Time accept/modify/reject;
43. support Found-Time expiry;
44. preserve direct Found-Time action;
45. use canonical user-day semantics;
46. ensure deterministic replay/explanation;
47. preserve backup/restore;
48. prevent mutable current state from rewriting historical Proposal;
49. keep LLM output subordinate to deterministic planning;
50. avoid autonomous hidden scheduling.

Do not implement these constraints during this task.

---

## 135. Downstream Open Questions

After resolving Proposal fundamentals, leave only genuinely downstream questions, such as:

* Proposal UI presentation;
* cards versus list;
* number of alternatives shown;
* exact explanation wording;
* notifications;
* proactive Found-Time prompting;
* native timer;
* exact Live interaction controls;
* Proposal caching/performance;
* physical storage host;
* migration ordering;
* advanced learned guidance;
* preference-promotion UX;
* LLM explanation rendering;
* Summary visualization.

Do not defer fundamental questions about:

* Proposal authority;
* lifecycle;
* identity;
* scope;
* horizon;
* acceptance;
* modification;
* rejection;
* staleness;
* Accepted Allocation;
* history;
* Found Time;
* direct execution;
* user authority.

---

## 136. Recommended Next-Step Gate

Select exactly one primary recommendation.

### Path A — Architecture Synthesis / Roadmap Reconciliation

Choose if Constructive Proposal and Found-Time semantics are now sufficiently specified to reconcile all post-Phase-7 architecture into an implementation-alignment roadmap.

### Path B — Execution / Live Architecture Follow-Up Audit

Choose only if Proposal specification exposes an unresolved execution-state or current-time authority seam that blocks implementation sequencing.

### Path C — Historical Decision / Learning Follow-Up Audit

Choose only if proposal-history and accepted-choice semantics remain insufficiently resolved.

### Path D — Planning Horizon / Review Scope Architecture Follow-Up

Choose only if Proposal Horizon cannot be specified coherently without a separate normative scope model.

### Path E — Proposal Implementation-Alignment Audit

Choose if architecture is complete enough to audit the existing executable system directly against the full Proposal specification before broader roadmap reconciliation.

### Path F — Architecture Reconciliation

Choose if Proposal cannot be made consistent with accepted Capacity, Goal Demand / Allocation, Goal Structure, Commitment Composition, Friction, history, or user-authority architecture.

Do not begin the selected task.

Do not assign Phase 8.

Given the current architectural sequence, **Path A or Path E should be considered only after this specification demonstrates that ordinary Proposal and Found Time can share one coherent authority model.**

---

## 137. Governance and Non-Goals

This specification must preserve:

1. **Users define priorities; DayFrame builds schedules.**
2. **Commitments own authorized time.**
3. **Goals describe desired outcomes.**
4. **Capacity is derived and non-authoritative.**
5. **Goal Demand requests resources without owning time.**
6. **Goal Structure resolves outcome semantics upstream.**
7. **Commitment Composition resolves operational footprint upstream.**
8. **Allocation is provisional.**
9. **Proposal is constructive.**
10. **Friction is corrective.**
11. **Proposal is the epistemic boundary between engine reasoning and user intent.**
12. **Explicit user authority precedes discretionary Goal-driven time ownership.**
13. **Recurring authored authority does not require repeated Proposal acceptance.**
14. **Accepted Choice remains distinct from reusable Preference.**
15. **Rejected Proposal does not silently create preference.**
16. **Direct user action does not require Proposal.**
17. **Spontaneous action must not be rewritten as recommendation.**
18. **History remains immutable.**
19. **Execution records what happened.**
20. **Progress remains distinct from effort.**
21. **Found Time is derived Live availability.**
22. **Found Time does not rewrite historical plan.**
23. **Found Time uses ordinary Proposal authority boundaries.**
24. **Proposal remains deterministic, explainable, optional, and subordinate to user authority.**
25. **No hidden nondeterministic agent may create scheduling authority.**
26. **No future implementation phase is established by this specification.**

This task must not:

* implement Proposal;
* implement Found Time;
* implement Capacity;
* implement Goal Demand;
* implement Allocation;
* implement Goal Structure;
* implement Commitment Composition;
* change Friction;
* change SuggestedFix;
* change PlanDecision;
* change CompositeDecision;
* change Goals;
* change Progress;
* change execution;
* change Today;
* change Summary;
* change Preview;
* change placement;
* change scheduling;
* change persistence;
* change backup/restore;
* change UI;
* create migrations;
* create learning algorithms;
* create recommendation AI;
* add or modify tests;
* modify existing architecture documents;
* modify existing audit documents;
* create Phase 8;
* assign work to a future implementation phase.

This task is read-only with respect to the existing repository.

**The required specification result artifact is the sole permitted repository write.**

---

## 138. Required Result Artifact

Create exactly:

`/home/sid/Penn Digital Services/DayFrame/docs/architecture/CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_SPECIFICATION_RESULT.md`

The filename must contain `RESULT`.

Do not substitute another filename or path.

The result must include at minimum:

1. **Executive Specification**
2. **Architectural Context**
3. **Normative Planning Chain**
4. **Epistemic Model**
5. **Constructive Proposal Definition**
6. **Proposal as Epistemic Boundary**
7. **Proposal vs Preview**
8. **Proposal vs Recurring Authority**
9. **Proposal vs Friction**
10. **Proposal vs Allocation**
11. **Proposal Input Contract**
12. **Input Completeness / Qualification**
13. **Proposal Context**
14. **Proposal Horizon**
15. **Planning Horizon vs Review Scope**
16. **Proposal Scope**
17. **Proposal Identity**
18. **Proposal Lifecycle**
19. **Proposal Option**
20. **Proposal Cardinality**
21. **Option Identity**
22. **Deterministic Generation / Ranking**
23. **Allocation Policy Boundary**
24. **Engine Heuristics**
25. **Recommendation Explanation**
26. **Explanation Provenance**
27. **Proposal Qualification**
28. **No-Proposal**
29. **No-Proposal vs Error**
30. **Proposal Acceptance**
31. **Proposal Modification**
32. **Modification Revalidation**
33. **Proposal Rejection**
34. **Ignore / Expiry**
35. **Accepted Allocation**
36. **Accepted Allocation Scope**
37. **Accepted Allocation vs PlanDecision / CompositeDecision**
38. **Promotion to Recurring Authority**
39. **Scheduled Goal Work / Support / Buffers**
40. **Publication Boundary**
41. **Proposal Staleness**
42. **Proposal Expiration**
43. **Proposal Revalidation**
44. **Proposal Supersession**
45. **Proposal Historical Provenance**
46. **Historical Snapshot Strategy**
47. **Proposal History vs Schedule / Execution History**
48. **Accepted Choice**
49. **Learned Guidance**
50. **Reusable Preference Promotion**
51. **Direct User Authoring**
52. **Direct Goal Scheduling**
53. **Direct Spontaneous Goal Execution**
54. **Execution vs Progress**
55. **Proposal-to-Execution Provenance**
56. **Found Time**
57. **Found-Time Sources**
58. **Released Interval**
59. **Live Capacity**
60. **Found Time / Capacity Provenance**
61. **Found-Time Proposal**
62. **Found-Time Horizon**
63. **Found Time / Goal Demand**
64. **Found Time / Commitment Composition**
65. **Found Time / Buffers**
66. **Required Failure / Liability**
67. **Found Time / Actual Duration**
68. **Found Time / Cancellation**
69. **Manual Found-Time Declaration**
70. **Found-Time Acceptance**
71. **Found-Time Modification**
72. **Found-Time Rejection**
73. **Found-Time Expiration**
74. **Spontaneous Found-Time Use**
75. **Provenance Origins**
76. **Learning Evidence**
77. **Proposal Persistence / Retention**
78. **Backup / Restore**
79. **Reason Codes / Explainability**
80. **Alternative Exclusion**
81. **Modification Boundary**
82. **Proposal Bundle Assessment**
83. **Scheduling Precision**
84. **Placement After Acceptance**
85. **User Values / Authority Ordering**
86. **Deterministic Learning Inputs**
87. **LLM Boundary**
88. **Current-Time Dependency**
89. **Canonical User-Day**
90. **Cross-User-Day Proposal**
91. **Proposal Failure Taxonomy**
92. **Proposal / Friction Transition**
93. **Post-Acceptance Revision / Cancellation**
94. **Planner / Today / Summary Boundaries**
95. **Found-Time Notification Boundary**
96. **Live Opportunity**
97. **Found Time vs Live Opportunity**
98. **Direct “What Should I Do Now?”**
99. **User-Declared Availability Validation**
100. **Accepted-Choice Guidance**
101. **Historical Tendency**
102. **Authority Ordering**
103. **Selected Proposal Models**
104. **Normative Worked Examples**
105. **Constructive Proposal Invariants**
106. **Architecture Decisions**
107. **Proposal State Matrix**
108. **Proposal Option Matrix**
109. **Proposal vs Friction Matrix**
110. **Authority Matrix**
111. **Decision Matrix**
112. **Provenance Matrix**
113. **Input Dependency Matrix**
114. **No-Proposal Matrix**
115. **Found-Time Source Matrix**
116. **Found-Time Decision Matrix**
117. **Productive-vs-Overhead Matrix**
118. **Lifecycle Matrix**
119. **Transition Matrix**
120. **Primitive Compatibility Matrix**
121. **Specification Consistency Checks**
122. **Implementation Constraints**
123. **Downstream Open Questions**
124. **Specification Conclusions**
125. **Recommended Next Step**
126. **Completion Statement**

After writing:

1. verify the artifact exists at the exact required path;
2. reopen and read it;
3. verify all required sections are complete;
4. verify all thirty normative worked examples are resolved;
5. verify all required invariants are complete;
6. verify every required `CP-SPEC-*` decision exists;
7. verify every required matrix is complete;
8. verify all sixty consistency checks are resolved;
9. verify ordinary Proposal and Found Time share one coherent authority model;
10. verify exactly one recommended next-step path is selected;
11. inspect repository status;
12. verify no repository file other than the required result artifact was modified.

Do not merely print the specification in Codex's response.

The durable specification artifact is required.

---

## 139. Validation

This is an architecture-specification task.

Do not add or modify tests.

The completed audit already validated current executable behavior with:

* **19 focused test files**
* **201 tests passed**
* **0 failed**

Reuse that evidence where sufficient.

Additional existing tests may be run only when needed to resolve a specific implementation fact.

If additional tests are run, report:

* exact files;
* total tests;
* passed;
* failed;
* reason.

Do not make unsupported executable claims.

---

## 140. Completion Criteria

The specification is complete only when:

* [ ] Constructive Proposal has a normative definition.
* [ ] Proposal is established as the engine-reasoning/user-authority boundary.
* [ ] Proposal vs Preview is explicit.
* [ ] Proposal vs recurring realization is explicit.
* [ ] Proposal vs Friction is explicit.
* [ ] Proposal vs Allocation is explicit.
* [ ] Proposal input contract is defined.
* [ ] incomplete/unknown input behavior is defined.
* [ ] Proposal Context is accepted or rejected.
* [ ] Proposal Horizon is defined.
* [ ] planning-data horizon, Proposal Horizon, and review scope are separated.
* [ ] Proposal Scope is defined.
* [ ] Proposal identity is defined.
* [ ] Proposal lifecycle is defined.
* [ ] Proposal Option is defined.
* [ ] Proposal cardinality model is selected.
* [ ] option identity is defined.
* [ ] deterministic ranking/generation is defined.
* [ ] Allocation Policy boundary is defined.
* [ ] engine heuristics are bounded.
* [ ] explanation contract is defined.
* [ ] explanation provenance is defined.
* [ ] Proposal qualification semantics are defined.
* [ ] No-Proposal is defined.
* [ ] No-Proposal vs error is resolved.
* [ ] Proposal acceptance is defined.
* [ ] Proposal modification is defined.
* [ ] modification revalidation is defined.
* [ ] Proposal rejection is defined.
* [ ] rejection vs ignore/expiry is explicit.
* [ ] Accepted Allocation is defined.
* [ ] Accepted Allocation scope is defined.
* [ ] Accepted Allocation vs PlanDecision/CompositeDecision is explicit.
* [ ] promotion to recurring authority is defined.
* [ ] Scheduled Goal Work/support/Buffer transition is defined.
* [ ] publication boundary is defined.
* [ ] Proposal staleness is defined.
* [ ] Proposal expiry is defined.
* [ ] Proposal revalidation is defined.
* [ ] Proposal supersession is defined.
* [ ] historical Proposal provenance is defined.
* [ ] snapshot strategy is selected.
* [ ] Proposal history is distinct from schedule/execution history.
* [ ] Accepted Choice semantics are defined.
* [ ] learned guidance boundary is defined.
* [ ] reusable preference promotion is explicit.
* [ ] direct authoring remains available.
* [ ] direct Goal scheduling is defined.
* [ ] spontaneous Goal execution is defined.
* [ ] execution vs Progress remains separate.
* [ ] Proposal-to-execution lineage is defined.
* [ ] Found Time is normatively defined.
* [ ] Found-Time source events are defined.
* [ ] Released Interval is accepted or rejected.
* [ ] Live Capacity boundary is defined.
* [ ] Found Time provenance relative to Capacity is defined.
* [ ] Found-Time Proposal uses ordinary Proposal lifecycle.
* [ ] Found-Time Horizon is defined.
* [ ] Found Time / Goal Demand boundary is defined.
* [ ] Found Time / composition boundary is defined.
* [ ] Found Time / Buffer boundary is defined.
* [ ] required unresolved liability is protected.
* [ ] actual-duration variance semantics are defined.
* [ ] cancellation semantics are defined.
* [ ] manual availability declaration is defined.
* [ ] Found-Time accept/modify/reject is defined.
* [ ] Found-Time expiry is defined.
* [ ] spontaneous Found-Time action is defined.
* [ ] provenance origin categories are defined.
* [ ] learning evidence is defined without creating authority.
* [ ] Proposal retention/persistence is defined.
* [ ] backup/restore requirements are defined.
* [ ] structured explanation/reasoning requirements are defined.
* [ ] option exclusion explanation is defined.
* [ ] modification vs direct-authoring boundary is resolved.
* [ ] bundle support is selected or explicitly deferred.
* [ ] scheduling precision is defined.
* [ ] placement-after-acceptance semantics are defined.
* [ ] user-value authority ordering is explicit.
* [ ] deterministic guidance boundary is defined.
* [ ] LLM boundary is defined.
* [ ] current-time dependency is defined.
* [ ] canonical user-day semantics are preserved.
* [ ] cross-user-day Proposal is resolved.
* [ ] Proposal failure taxonomy is defined.
* [ ] Proposal→Friction transition is defined.
* [ ] post-acceptance modification/cancellation is resolved.
* [ ] Planner/Today/Summary conceptual boundaries are defined.
* [ ] Found-Time notification boundary is resolved.
* [ ] Live Opportunity is accepted or rejected.
* [ ] Found Time vs Live Opportunity is resolved.
* [ ] “What should I do now?” path is defined.
* [ ] user-declared availability validation is defined.
* [ ] accepted-choice guidance boundary is defined.
* [ ] historical tendency authority is defined.
* [ ] final authority ordering is defined.
* [ ] all Proposal model selections are explicit.
* [ ] all thirty normative worked examples are resolved.
* [ ] invariant set is complete.
* [ ] `CP-SPEC-*` decisions cover all required areas.
* [ ] Proposal State Matrix is complete.
* [ ] Proposal Option Matrix is complete.
* [ ] Proposal vs Friction Matrix is complete.
* [ ] Authority Matrix is complete.
* [ ] Decision Matrix is complete.
* [ ] Provenance Matrix is complete.
* [ ] Input Dependency Matrix is complete.
* [ ] No-Proposal Matrix is complete.
* [ ] Found-Time Source Matrix is complete.
* [ ] Found-Time Decision Matrix is complete.
* [ ] Productive-vs-Overhead Matrix is complete.
* [ ] Lifecycle Matrix is complete.
* [ ] Transition Matrix is complete.
* [ ] Primitive Compatibility Matrix is complete.
* [ ] all sixty consistency checks are resolved.
* [ ] ordinary and Found-Time Proposal share one coherent authority model.
* [ ] implementation constraints are explicit.
* [ ] only genuinely downstream questions remain.
* [ ] exactly one recommended next-step path is selected.
* [ ] no implementation was performed.
* [ ] no tests were modified.
* [ ] no existing architecture document was modified.
* [ ] no existing audit document was modified.
* [ ] no future implementation phase was established.
* [ ] `CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_SPECIFICATION_RESULT.md` was written to the exact required path.
* [ ] artifact was reopened and verified.
* [ ] repository status was inspected.
* [ ] required result artifact was the sole repository write.
* [ ] Codex reports exact saved path.
* [ ] Codex reports validation.
* [ ] Codex reports whether other repository files changed.

---

## 141. Final Completion Statement

End `CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_SPECIFICATION_RESULT.md` with exactly:

> **Constructive Proposal Architecture Specification complete.**
>
> The specification establishes Constructive Proposal as the deterministic, explainable, non-authoritative boundary between DayFrame's derived planning reasoning and explicit user intent; defines Proposal context, identity, horizon, scope, options, ranking, explanation, No-Proposal outcomes, acceptance, modification, rejection, staleness, supersession, Accepted Allocation, scheduled Goal work, historical reasoning provenance, Accepted Choice, direct user action, spontaneous Goal execution, and learning boundaries; integrates Capacity, normalized Goal Demand, Goal Priority, Goal-Specific Feasibility, Allocation, and Commitment Composition without allowing Proposal to create or rewrite those upstream truths; establishes Found Time as execution-derived Live availability that produces ordinary bounded Proposal opportunities only after remaining obligations and liabilities are protected; preserves the distinction among recurring-authority realization, Preview, Proposal, Friction, scheduled reality, execution, Progress, and historical evidence; prevents generated recommendations, repeated behavior, or nondeterministic explanation from silently becoming scheduling authority; and identifies the appropriate next architectural step without modifying implementation or assigning the work to a future implementation phase.

The final Codex response must state:

> **Saved artifact:** `/home/sid/Penn Digital Services/DayFrame/docs/architecture/CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_SPECIFICATION_RESULT.md`
>
> **Repository modifications:** The required specification result artifact was the sole repository write.
>
> **Validation:** Report reused audit evidence and any additional existing tests executed.
>
> **Recommended next step:** Report the selected Path A, B, C, D, E, or F without beginning that work.
