# Post-Phase-7 Architecture Synthesis Result

## 1. Executive Synthesis

DayFrame's accepted post-Phase-7 architecture forms one coherent planning system: authored life structure establishes constraints and intent; derived Capacity and Demand reasoning identify possibilities; Allocation and Proposal remain non-authoritative; explicit decisions create bounded authority; schedules own time; Execution and Progress record different historical truths; and learning remains subordinate guidance. Ordinary and Live planning share this model. Closure is **AS2 — Coherent With Minor Architectural Clarifications** because no new domain or authority seam is missing, while governance terminology/status and a few legacy naming collisions require later reconciliation.

## 2. Synthesis Scope and Sources

Normative sources inspected: `docs/architecture/CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md`, `GOAL_DEMAND_ALLOCATION_ARCHITECTURE_SPECIFICATION_RESULT.md`, the actual `GOAL_STRUCTURE_ARCHITECTURE_SPECIFICATION_RESULT.md`, `COMMITMENT_COMPOSITION_ATTACHED_ACTIVITIES_ARCHITECTURE_SPECIFICATION_RESULT.md`, `CONSTRUCTIVE_PROPOSAL_ARCHITECTURE_SPECIFICATION_RESULT.md`, `DECISIONS.md`, and `CURRENT_STATE.md`. Repository search found no files named `ARCHITECTURE_CHARTER.md` or `Implementation_Architecture_Synthesis.md`; their governance roles are referenced by `DECISIONS.md`, so absence is recorded rather than inferred. Later accepted specifications take precedence over earlier implementation/current-state descriptions.

## 3. Architectural Closure Classification

**AS2 — Coherent With Minor Architectural Clarifications.** Domain ownership, epistemic transitions, time ownership, ordinary/Live lifecycle, and history are closed. Remaining work is terminology/governance consolidation, physical implementation mapping, and UX—not a missing architecture domain. `CURRENT_STATE.md`'s earlier “Phase 8 Ready” statement is chronologically stale relative to these follow-ups and must not establish a new phase here.

## 4. Core Product Principles

The synthesis preserves Teach → Plan → Live → Learn; Commitments own time while Goals compete for Capacity; users define priorities and authorize intent; planning is deterministic/explainable; history is immutable; accessibility, continuity, and epistemic integrity are system properties; and authored, derived, proposed, accepted, scheduled, executed, and learned states never collapse.

## 5. Teach → Plan → Live → Learn

Teach owns explicit durable facts: Work patterns, Commitments/composition, Goals/structure/Demand/Priority, availability policy, and preferences. Plan derives Capacity, feasibility, competing Demand, Allocation, Proposal, and receives decisions. Live projects published authority, records execution/divergence, derives Live Opportunity, and supports direct action. Learn interprets immutable schedule/execution/Progress/decision evidence into non-authoritative guidance. A surface may display cross-domain facts without owning them.

## 6. Canonical Epistemic Model

`authored authority → derived truth → proposed action → accepted decision/authority → scheduled reality → executed reality/Progress evidence → immutable history → learned tendency → explicitly promoted preference`. Transitions require identity and provenance; no later state retroactively changes an earlier fact.

## 7. Canonical Authority Model

Hard authored constraints and active schedule authority outrank derived resources. Goal/Demand/Priority and Allocation Policy authorize inputs but not time. ProposalDecision creates Accepted Allocation only after validation. PlanDecision/CompositeDecision alter existing occurrence/composite authority. Direct authoring remains parallel. Learned evidence never authorizes.

## 8. Canonical Time-Ownership Model

Authored/scheduled Commitments, Work occurrences, real Attached Activities, realized Goal work/support, and accepted/manual scheduled facts own time. Buffers protect time without executing. Liabilities reserve against allocation until resolved. Capacity, Demand, feasibility, Allocation, Proposal, Released Interval, Live Opportunity, and execution evidence do not own time.

## 9. System-Level Domain Map

```text
User-Day/Work Pattern → Work occurrences ┐
Commitment + recurrence + composition ───┼→ time authority/liability → Capacity
Goal + Structure + Demand + Priority ────┘                         ↓
             eligibility/normalization → Feasibility → Competing Demand
             → Allocation → Proposal → ProposalDecision → Accepted Allocation
             → schedule realization → Preview → Published Plan
             → Execution + separate Progress → History/Summary → guidance
Published Plan + divergence → Released Interval → Live Capacity
             → Live Opportunity → same Proposal lifecycle or direct action
```

## 10. Commitment Architecture

Commitment is authored time-seeking/scheduling authority with identity, lifecycle, recurrence, and execution-capable occurrences. It may be independent, Goal-linked, or a composition component; Goal linkage never turns it into Demand satisfaction automatically.

## 11. Work Architecture

Work is a specialized structural Commitment source generated from Work Pattern/cycle authority. It participates in time ownership, Capacity subtraction, publication, execution, composition where allowed, and Friction without becoming a separate planning ontology.

## 12. Commitment Composition

Attachment Relationship connects parent and normal Commitment sources; paired component occurrences yield Composite Occurrence, Footprint, and Liability. Required components transact as a unit; real support activities execute, Buffers do not; only productive core satisfies Goal Demand.

## 13. Goal Architecture

Goal is authored desired-outcome authority. It may exist without Demand, Commitment, schedule, execution, or Progress. Links provide provenance/service association, not implicit resource request or completion.

## 14. Goal Structure

Goal Structure owns versioned containment, contribution, dependency, Subgoal, and Milestone relationships. It derives structural eligibility/accounting context upstream; it neither schedules nor creates Demand, Priority, Proposal, or Progress.

## 15. Goal Demand

Demand Intent is authored resource-seeking authority without time ownership. Demand Projection is bounded derived interpretation; normalization/deduplication uses explicit structure/accounting authority. Zero Demand is valid.

## 16. Goal Priority

Goal Priority is independent authored, horizon-capable planning value consumed by Allocation. It is not Commitment priority, derived urgency, learned tendency, or engine ordering.

## 17. Capacity

Capacity is deterministic, explainable, demand-neutral, liability-aware allocatable user-day interval truth. It is derived/disposable; interval identity and qualification are canonical, totals only summaries.

## 18. Capacity Consumption

Only time-owning/protective authority and unresolved liability subtract from general Capacity. Provisional claims do not mutate it; Allocation references portions, Accepted Allocation claims them, and schedule realization turns claims into time ownership. Equivalent overlapping facts are deduplicated by provenance.

## 19. Liability

Liability is unresolved authorized time demand that prevents optimistic Capacity. Composite required failures, stale/unknown authoritative coverage, and protected future obligations remain liabilities until explicit resolution.

## 20. Goal-Specific Feasibility

Feasibility consumes immutable Capacity, normalized Demand, structural eligibility, and full Composite Footprint to enumerate compatible slices and qualifications. It does not rank competing Goals, allocate, propose, or authorize.

## 21. Competing Demand

A deterministic bounded set of eligible projections seeking overlapping Capacity, with normalization preventing multi-path/double claims. Competition is not Friction because the work is not yet authorized.

## 22. Allocation

Allocation provisionally distributes exact Capacity portions among feasible competing Demand under Goal Priority and explicit Allocation Policy. It is explainable, deterministic, non-authoritative, and immutable as reasoning input to Proposal.

## 23. Constructive Proposal

Proposal is the non-authoritative engine-reasoning/user-intent boundary: a ranked bounded option set or No-Proposal result referencing Capacity, Demand, feasibility, composition, Allocation, policy, and guidance.

## 24. ProposalDecision

ProposalDecision records explicit accept, modify-and-accept, option/proposal rejection, or lifecycle response against a versioned Proposal. Only current revalidated acceptance crosses into new authority.

## 25. Accepted Allocation

Accepted Allocation is immutable bounded resource authority linking the accepted option/delta to exact Capacity claims, Demand satisfaction, productive/support footprint, and scope. Default scope is one-off; recurrence requires separate authoring.

## 26. Schedule Realization

Realization atomically creates distinct Scheduled Goal Work, Scheduled Support Activity, and Buffer protection within Accepted Allocation bounds. Failure cannot substitute another Goal, widen scope, or partially hide required footprint.

## 27. Preview

Preview is disposable projection of existing authority and diagnostics. It may show realized accepted work but is neither Proposal nor acceptance; recurring placement in Preview realizes prior authority.

## 28. Published Plan

Published Plan is immutable schedule truth for a bounded range and frozen canonical user-day context. Later decisions/execution append evidence; they never rewrite the publication.

## 29. Execution

Execution records what happened to planned or direct/unplanned real activity, including outcome and actual timing. It may expose divergence but neither rewrites plan nor implies Progress.

## 30. Progress

Progress is explicit measured outcome evidence under Goal measurement policy/revision. Execution effort and Demand satisfaction attribution may contextualize it but cannot manufacture it.

## 31. History

History contains immutable, separately linked proposal/decision, published schedule, execution, and Progress records with decisive snapshots. Current mutable state cannot reinterpret historical meaning.

## 32. Accepted Choice

A situational accepted decision. It is evidence and authority only at its explicit scope—not recurrence, preference, execution, or reusable rule.

## 33. Reusable Preference

An authored, scoped, revocable rule created only by explicit promotion/authoring. It guides future reasoning below hard authority and policy.

## 34. Learned Guidance

Deterministic, provenance-bounded tendency derived from history. It may influence lower-level ranking but cannot filter higher-authority eligible choices or become preference automatically.

## 35. Friction

Friction diagnoses incompatibility among already-authorized facts. It begins only after time authority exists, not when unaccepted Demand exceeds Capacity or no option fits.

## 36. SuggestedFix

SuggestedFix is a corrective recommendation for Friction, with local actions/explanation. It is not Constructive Proposal, Allocation, or new Goal-work authority.

## 37. PlanDecision

PlanDecision is accepted occurrence-scoped correction/override authority with durable target and replay. It remains distinct from ProposalDecision and Accepted Allocation.

## 38. CompositeDecision

CompositeDecision changes/resolves an authorized composite occurrence/required components atomically. It does not accept a provisional Goal Allocation.

## 39. Found Time

Found Time is provenance for newly available Live time inferred from execution divergence. It preserves the original plan and creates no scheduling permission.

## 40. Released Interval

The gross interval exposed by cancellation, skip, early completion, explicit Buffer release, or validated assertion. It precedes liability subtraction and is not Capacity.

## 41. Live Capacity

Ordinary Capacity semantics evaluated at an explicit current instant over Released Interval/current availability after remaining schedule, components, buffers, and liabilities are protected.

## 42. Live Opportunity

A first-class derived short-horizon context containing Live Capacity, origin, user-day, evaluation instant, liabilities, and validity. Found Time is one source; validated manual availability is another.

## 43. Live Proposal

Ordinary Constructive Proposal with `liveOpportunity` context. It uses identical input, ranking, decision, Accepted Allocation, history, and authority rules, with narrower horizon and aggressive expiry.

## 44. Direct Live Action

The user may act without Proposal. Goal-linked direct/unplanned execution records `directSpontaneous` origin and optional separate Progress; no Proposal, Allocation, or schedule lineage is fabricated.

## 45. Canonical User-Day

All planning, Capacity, horizons, publication, execution, and Live facts use canonical piecewise user-day windows with frozen boundary provenance. Calendar midnight is not semantic day rollover.

## 46. Planning Data Horizon

The bounded range of data loaded/derived for planning context. It can be broader than Proposal, review, publication, or Live horizons and carries no authority.

## 47. Proposal Horizon

Explicit bounded interval/user-days within which options may claim Capacity. Ordinary is context-specific; Live defaults to one opportunity and cannot silently expand.

## 48. Review Scope

UI-visible subset chosen for comprehension. It neither changes planning truth nor inherits the broadest range; accessibility/performance require independent bounds.

## 49. Publication Range

The explicit range committed as immutable plan truth. It is independent of planning-data, Proposal, and review ranges but can contain realized accepted authority.

## 50. Determinism

Equivalent semantic inputs and explicit evaluation time yield equivalent eligibility, interval topology, feasibility, Allocation, option content/order, reason codes, replay, and historical interpretation. Stable semantic tie-breakers replace storage order.

## 51. Explainability

Every derived result exposes structured reason codes, decisive source identities/revisions, policy/algorithm versions, qualifications, exclusions, and productive/overhead accounting. Copy renders this graph; it is not the authority.

## 52. LLM / AI Boundary

An LLM may render or summarize deterministic results. It cannot create/alter Capacity, Demand, eligibility, priority, feasibility, Allocation, Proposal options/order, decisions, preferences, Progress, or time authority.

## 53. Persistence Classes

Authored authorities persist; accepted decisions/allocations persist; current derived views are disposable; publications/execution/Progress/explicit decisions are immutable history; derived historical guidance may be recomputed against a frozen cutoff. Backup preserves authority and referential lineage.

## 54. Identity Model

Each semantic domain owns opaque, versioned identity. References include lifetime/incarnation where recreation could retarget. IDs are linked across transitions, never reused between candidate, option, decision, occurrence, or evidence classes.

## 55. Revision Model

Mutable authored truth advances revision/lifetime; derived results fingerprint decisive revisions; proposals create successors; accepted/historical records are immutable. Semantic recreation is new identity unless a domain-defined revision applies.

## 56. Staleness Model

Material dependency change marks derived result stale; stale state may remain explainable but cannot create authority. Revalidation either confirms semantic equivalence, creates a successor, or returns a qualified/No-Proposal/error result.

## 57. Productive Work vs Overhead

Productive Goal work may satisfy Demand; real support activity consumes Capacity and executes; Buffer consumes/protects Capacity but never executes; neither support nor Buffer automatically creates Progress.

## 58. Direct Action

Direct Commitment/event/Goal scheduling and spontaneous execution remain valid. They record explicit origin and normal constraints without retroactively manufacturing Proposal or Accepted Allocation.

## 59. User Authority Boundaries

User authority is required to author Demand/Priority/preferences/time facts, accept new allocation, modify existing authority, promote recurrence/preference, and report execution/Progress. Engine display, inference, ranking, or repetition is never consent.

## 60. Ordinary Planning Lifecycle

```text
Teach facts → eligibility/Demand/Capacity → feasibility → competition
→ Allocation → Proposal/No-Proposal → explicit decision
→ Accepted Allocation → atomic schedule realization → Preview
→ publication → execution/Progress/history
```

## 61. Live Lifecycle

```text
Published Plan + execution divergence → Released Interval
→ liability-aware Live Capacity → Live Opportunity
→ same feasibility/Allocation/Proposal/decision lifecycle
→ bounded one-off schedule or direct action → execution/history
```

## 62. Corrective Lifecycle

```text
Authorized facts → Friction → SuggestedFix → explicit PlanDecision/CompositeDecision
→ deterministic replay → revised schedule/Preview → publication/history
```

Accepted Allocation remains historical source authority; later correction does not mutate the accepted Proposal.

## 63. Learning Lifecycle

```text
Proposal/direct choice/schedule/execution/Progress → immutable evidence
→ deterministic tendency → optional lower-level guidance
→ explicit user promotion → reusable Preference
```

No automatic promotion.

## 64. Domain Ownership Matrix

| Concepts | Owning Domain | Epistemic Class | Authority? | Time? | Persistence/History | Consumers |
|---|---|---|---:|---:|---|---|
| User-Day | Time | Authored policy + derived windows | Policy | Bounds | Freeze decisive window | All temporal domains |
| Work Pattern/occurrence | Work/Commitment | Authored/derived | Yes | Owns | Persist/publish | Capacity, Preview, Execution |
| Commitment/recurrence | Commitment | Authored | Yes | Seeks/owns when realized | Persist/publish | Placement, Capacity |
| Attachment/Buffer/composite/footprint/liability | Composition | Authored + derived | Relations yes | Own/protect/reserve | Persist decisive facts | Capacity, feasibility, Friction |
| Goal/Subgoal/Milestone/Structure | Goal Structure | Authored | Outcome/relationship | No | Persist/snapshot | Demand, Progress, Summary |
| Demand Intent/Projection/normalized Demand | Goal Demand | Authored/derived | Intent only | No | Intent persists; snapshots | Feasibility, Allocation |
| Goal Priority | Goal Planning | Authored | Ranking input | No | Persist/version | Allocation |
| Capacity/Live Capacity | Capacity | Derived | No | No | Disposable/decisive snapshot | Feasibility, Proposal |
| Released Interval/Live Opportunity | Live | Derived | No | No | Provenance if acted/shown | Capacity, Proposal |
| Feasibility/Competing Demand/Allocation | Allocation | Derived | No | Provisional claims | Decisive snapshots | Proposal |
| Proposal/option/No-Proposal | Proposal | Derived | No | No | Decision-linked history | Planner/Today |
| ProposalDecision/Accepted Allocation | Proposal Authority | Authored accepted | Yes | Claims bounded resource | Persist/history | Realization |
| Scheduled Goal/support/Buffer | Schedule | Accepted realization | Yes | Own/protect | Publish | Preview, Execution |
| Preview/Published Plan | Schedule projection/history | Derived/immutable | Projection/no; plan yes | Reflects | Disposable/immutable | Planner, Today |
| Execution/Progress | Execution/Goal Measurement | Historical evidence | Evidence | No new | Immutable | Summary, Learn |
| Friction/SuggestedFix/PlanDecision/CompositeDecision | Corrective Planning | Derived/accepted | Decisions yes | Change existing | Persist/history | Schedule |
| Accepted Choice/Preference/guidance | Decision/Preference/Learn | Historical/authored/derived | Preference only | No | Distinct classes | Proposal ranking |

## 65. Authority Transition Matrix

| Transition | Input | Output | Automatic? | User Authority? | History? |
|---|---|---|---:|---:|---:|
| Authored pattern→occurrence | Authored | Derived authorized occurrence | Yes | Prior | On publication |
| Facts→Capacity/Demand/feasibility/Allocation | Inputs | Derived reasoning | Yes | No new | If decisive |
| Allocation→Proposal | Derived | Proposed | Yes | No | If shown/decided |
| Proposal→Accepted Allocation | Current option | Accepted authority | No | Yes | Yes |
| Accepted Allocation→schedule | Authority | Time ownership | Bounded automatic | Already supplied | Yes |
| Preview→publication | Current projection | Immutable plan | Explicit workflow | Existing authority only | Yes |
| Plan→execution/Progress | Published target/user report | Evidence | No | Report/observe | Yes |
| Conflict→fix→decision | Authorized conflict | Corrective authority | Suggest yes; accept no | Yes | Yes |
| Divergence→Live Opportunity | Plan+actual+liability | Derived | Yes | No | If consequential |
| Live Proposal→one-off authority | Fresh option | Accepted Allocation | No | Yes | Yes |
| Direct action→schedule/execution | User action | Direct authority/evidence | No | Yes | Yes |
| Choice→preference | Historical choice | Scoped preference | No | Explicit | Yes |

## 66. Time Ownership Matrix

| Concept | Owns? | Protects? | Claims Capacity? | Provisional? | Authority Required? |
|---|---:|---:|---:|---:|---:|
| Work/Commitment/Attached Activity/scheduled Goal/support | Yes when scheduled | Yes | Consumes | No | Yes |
| Buffer | No activity ownership | Yes | Consumes | No | Yes via source/acceptance |
| Liability | No interval ownership yet | Reserves | Prevents claim | Derived | Underlying authority |
| Capacity/Released Interval/Live Opportunity | No | No | No | Derived | No |
| Allocation/Proposal option | No | No | References/claims provisionally | Yes | No |
| Accepted Allocation | Bridge, not occurrence | Reserves exact claim | Yes | No | Explicit acceptance |
| Preview/Execution/Progress | Reflects/no | No new | No | Preview derived | No new |

## 67. Persistence Matrix

| Concept | Authored Persistent | Accepted Persistent | Derived Disposable | Historical Immutable | Derived Historical |
|---|---:|---:|---:|---:|---:|
| Patterns, Commitments, composition, Goals, Demand, Priority, preferences | Yes | — | Projections | Revisions when decisive | — |
| Capacity/feasibility/competition/Allocation/Preview/Live Opportunity | — | — | Yes | Decisive snapshots only | Optional aggregates |
| Proposal/No-Proposal | — | Decision-linked | Cacheable | If shown/decided | Metrics optional |
| Decisions/Accepted Allocation | — | Yes | — | Yes | — |
| Published Plan/Execution/Progress | — | — | — | Yes | Summary projections |
| Learned guidance | — | — | Recomputable | Evidence cutoff | Yes |

## 68. Provenance Matrix

| Scenario | Authored | Derived | Decision | Schedule | Execution | Progress |
|---|---|---|---|---|---|---|
| Recurring Commitment | Source/recurrence | Candidate/placement | Prior authoring | Occurrence | Optional | Separate |
| Manual event | Direct event | Preview | Direct origin | Event | Optional | Separate |
| Accepted/modified Goal Proposal | Goal/Demand | Allocation/options | Accept + delta | Accepted lineage | Optional | Separate |
| Rejected Proposal | Goal/Demand | Options | Reject | None | None | None |
| Direct Goal schedule | Goal/user input | Feasibility | Direct | Direct origin | Optional | Separate |
| Friction fix | Existing facts | Friction/fix | Plan/CompositeDecision | Revised | Optional | Separate |
| Composed Commitment | Sources/relationship | Pairing/footprint | Composite if needed | Components/Buffer | Per activity | Core separate |
| Found Proposal | Plan/actual | Release/Live/option | Live accept/reject | Accepted only | Optional | Separate |
| Direct Found/spontaneous Goal work | Goal + user act | Maybe opportunity | Direct act | None | Direct spontaneous | Optional separate |

## 69. Priority Matrix

| Concept | Domain | Source | Influences | Cannot Override |
|---|---|---|---|---|
| Commitment priority | Scheduling | Authored/decision | Placement/Friction | Hard authority/Goal Priority meaning |
| Goal Priority | Goal planning | Authored | Allocation | Commitments/constraints |
| Allocation Policy | Allocation | Authored/versioned | Distribution/order | Hard constraints/Priority authority |
| Reusable preference | Preference | Authored | Lower ranking/placement | Above authority |
| Accepted Choice guidance | Learn | Derived evidence | Lower ranking | Preferences/policy |
| Learned tendency | Learn | Derived | Lowest semantic guidance | Any authored authority |
| Engine heuristic | Engine | Versioned | Equivalent tie-breaks | User values |
| Friction severity/order | Friction | Derived | Corrective triage | Planning priority |

## 70. Horizon Matrix

| Range | Purpose | Authority? | Consumers | Broader Than Review? | User-Day Semantics |
|---|---|---:|---|---:|---|
| Planning-data | Inputs/context | No | Planner engines | Yes | Canonical windows |
| Capacity/Demand Projection | Resource/request derivation | No | Feasibility | Yes | Per user-day |
| Proposal | Bounded options | No | Planner/Today | Usually no | Explicit claims |
| Live Opportunity | Current safe interval | No | Today | No | One canonical day default |
| Review Scope | Presentation | No | UI | N/A | Labels canonical |
| Publication | Immutable schedule batch | Existing authority | History/Today | Independent | Frozen windows |
| Summary/history | Interpretation | No new | Summary/Learn | Yes | Historical frozen context |

## 71. Decision Taxonomy Matrix

| Decision | New Authority? | Changes Existing? | Scope | Reusable? | Historical? |
|---|---:|---:|---|---:|---:|
| Direct authoring | Yes | Maybe authored revision | Declared | As authored | Yes |
| ProposalDecision accept | Yes via Accepted Allocation | No prior schedule | Bounded | Choice only | Yes |
| Proposal reject/ignore | No | No | Option/proposal | No | Reject yes; ignore optional |
| PlanDecision | No new domain; override | Yes occurrence | One occurrence | No | Yes |
| CompositeDecision | Same | Yes composite | Composite occurrence | No | Yes |
| Execution correction/retraction | Evidence only | Historical evidence chain | Subject | No | Yes |
| Progress observation/correction | Evidence only | Observation chain | Goal/policy | No | Yes |
| Preference promotion | Guidance authority | Creates/revises preference | Explicit scope | Yes | Yes |

## 72. Ordinary vs Live Matrix

| Concern | Ordinary | Live / Found-Time |
|---|---|---|
| Capacity | Bounded derived intervals | Same, clipped to now/release/liabilities |
| Horizon/time | Explicit user-day/range; time optional | One opportunity; injected current time |
| Demand/feasibility/Allocation | Normalized eligible; ordinary contracts | Same contracts, current unmet subset |
| Proposal/acceptance | Ranked options/No-Proposal; bounded | Same types; one-off default/fresh validation |
| Expiry | Declared validity | Aggressive interval/time expiry |
| Direct action | Direct schedule allowed | Direct spontaneous action allowed |
| History | Proposal/schedule/execution separate | Same plus divergence/release provenance |

## 73. Proposal vs Friction vs Preview Matrix

| Concern | Preview | Constructive Proposal | Friction |
|---|---|---|---|
| Purpose | Project authority | Offer new allocation | Diagnose/repair conflict |
| Input authority | Existing | Derived possibilities | Conflicting existing |
| Derived? | Yes | Yes | Yes |
| New work? | No | Yes | No |
| Corrects work? | Displays result | No | Yes |
| Acceptance? | No per regeneration | Before authority | Before durable fix |
| Owns time? | No, reflects | No | No |
| History | Publication source | Decision reasoning | Corrective decision |

## 74. Capacity Accounting Matrix

| Fact | Capacity Effect | Demand Effect | Time Ownership | Progress | Double-Count Control |
|---|---|---|---|---|---|
| Work/Commitment/Attached Activity | Subtract | Only explicit attribution | Owns | None automatic | Identity/provenance dedupe |
| Buffer | Subtract/protect | Overhead only | Protects | None | Composite footprint |
| Liability | Exclude/reserve | None | Underlying authority unresolved | None | Qualification |
| Productive Goal work | Subtract when scheduled | Satisfies attributed portion | Owns | Separate | Accepted claim IDs |
| Support activity | Subtract | No satisfaction | Owns | None automatic | Productive/support split |
| Accepted Allocation | Claims exact portion | Authorizes bounded satisfaction | Bridge | None | Claim uniqueness |
| Provisional Allocation | No mutation | Provisional assignment | None | None | Immutable Capacity refs |
| Found Time/Released Interval | No direct increase; source for recalculation | None | None | None | Liability-aware Live derivation |

## 75. Goal Accounting Matrix

| Concept | Outcome | Resource | Scheduling | Execution | Progress |
|---|---|---|---|---|---|
| Goal/Subgoal/Milestone | Desired result/structure | None alone | None | None | Explicit policy/observation |
| Goal Demand | Requested effort | Request | None | Satisfaction attribution only | None automatic |
| Linked Commitment | Service association | Capacity cost | Owns when scheduled | Activity | Link alone none |
| Accepted Allocation | Chosen Demand portion | Exact claim | Authorizes realization | None | None |
| Scheduled Goal work | Planned productive effort | Consumes | Owns | Target | No automatic outcome |
| Support activity | Operational overhead | Consumes | Owns | Executes | None automatic |
| Execution | What happened | Historical actual | Does not reschedule | Evidence | Does not imply |
| Progress Observation | Outcome evidence | None | None | May reference | Direct meaning |

## 76. History Matrix

| Fact | Immutable? | Source | Later Reinterpret? | Learning? | Authority? |
|---|---:|---|---:|---:|---:|
| Proposal/Accepted Choice/rejected Proposal | Yes once historical | Engine + decision | No | Yes, scoped | Accept only at scope |
| Published Plan | Yes | Schedule publication | No | Yes | Historical planned authority |
| Execution/direct spontaneous action | Append/correct/retract | User/evidence | Projection changes, records stay | Yes | Evidence only |
| Progress | Append/correct | Observation | Policy revision bounded | Yes | Outcome evidence |

## 77. Cross-Specification Seam Matrix

| Upstream → Downstream | Contract | Authority Crossing? | Ambiguity | Resolved? |
|---|---|---:|---|---:|
| Structure→Demand/Proposal | Eligibility, normalization, priority context | No | Proposal traversal | Yes: resolved outputs only |
| Capacity + Demand + Composition→Feasibility | Qualified intervals, projection, footprint | No | Core-only fit | Yes: full footprint |
| Feasibility + Priority + Policy→Allocation | Opportunity slices/order authority | No | Heuristic priority | Yes |
| Allocation + Capacity→Proposal | Provisional claims/options evidence | No | Allocation vs option | Yes |
| Proposal→ProposalDecision→Accepted Allocation | Versioned option/explicit acceptance | Yes at acceptance | PlanDecision reuse | Yes: distinct types |
| Accepted Allocation→schedule | Exact bounded productive/support/buffer claims | Realizes existing acceptance | Partial failure | Yes: atomic |
| Composition→scheduled support/Buffer | Component identities/timing | Existing authority | Buffer activity | Yes |
| Schedule→Preview→publication | Projection then immutable batch | No new authority | Preview mistaken proposal | Yes |
| Publication→execution→Progress | Frozen target, actual evidence, separate outcome | Evidence only | Effort=progress | Yes |
| Execution→Found Time→Live Capacity | Divergence, gross release, liability subtraction | No | Free time=Capacity | Yes |
| Live Capacity→Opportunity→Proposal | Typed Live context | No | Separate planning domain | Yes: same Proposal |
| Accepted Goal work→Friction | Time-owning schedule facts | Corrective decision later | Proposal persists | Yes |
| History→guidance→Proposal | Frozen evidence/cutoff | No | Hidden preference | Yes: low authority |

## 78. Duplicate-Concept Audit

Free time/openings are geometric/legacy analogues, not Capacity. Found Time (source), Released Interval (gross), Live Capacity (safe resource), and Live Opportunity (proposal context) are related distinct stages. `BlockCandidate` is authorized recurrence geometry, not Proposal Option. Accepted Choice is general situational evidence; ProposalDecision and PlanDecision are distinct decision kinds. Allocation is derived; Accepted Allocation authoritative. Goal Activity is derived historical interpretation, scheduled Goal work is plan truth, Execution is actual evidence. Buffer is protected time, not generic gap. Goal and Commitment priorities differ. Preference is authored; tendency learned. Manual event is a direct one-off schedule fact and may later converge structurally with one-off Commitment only through explicit architecture. HistoricalPlan is the implemented ledger name for Published Plan semantics. No duplicate identity should be shared.

## 79. Missing-Owner Audit

Every major concept has one semantic owner in §64. Physical stores/services for future Capacity, Demand, Allocation, Proposal, Accepted Allocation, composition, and Live records remain implementation decisions, not ownerless semantics. `CURRENT_STATE.md`/missing charter artifacts create governance-document ownership debt, not domain authority ambiguity.

## 80. Contradiction Audit

No genuine cross-specification contradiction was found. Time ownership, Goal/Commitment separation, Capacity, liability, Demand/Priority, composition, Proposal/Accepted Allocation, recurring/direct authority, Friction, Execution/Progress, Found Time, history, learning, user-day, and determinism align. Terminology mismatches: “candidate,” “allocation,” “accepted choice,” “free time,” and “historical plan” have narrower implementation uses; resolved by domain-qualified names. Scope distinctions resolve Work vs generic Commitment and manual event vs Commitment. Chronological supersession resolves older audit findings and `CURRENT_STATE.md`'s pre-follow-up roadmap statement.

## 81. Architectural Gap Audit

No missing domain exists across Teach → Plan → Live → Learn. Future implementation substrates and UX do not justify new semantic domains. The only gaps are governance consolidation, naming/mapping, and implementation alignment.

## 82. Architectural Principles Reassessment

Strengths: explicit epistemic/authority transitions, immutable history, deterministic qualified failure, composition-aware accounting, canonical user-day support, and one ordinary/Live model. External calibration is strong for non-9-to-5 and variable-duration work because user-day and Live horizons are explicit. Risks remain in vocabulary burden, accessible explanation density, state/persistence complexity, and ensuring continuity during migration. These are manageable implementation/UX risks if reason codes, progressive disclosure, atomic durability, and compatibility mapping are enforced.

## 83. Architectural Risk Register

| Risk | Architectural Mitigation | Remaining Risk | Dogfood Revisit? |
|---|---|---|---:|
| Domain/vocabulary overload | Ownership + matrices | User-facing language | Yes |
| Duplicate identities | Domain-specific opaque IDs | Migration/link bugs | Yes |
| Authority escalation/stale accept | Explicit transitions/revalidation | Atomic implementation | Yes |
| Capacity/effort double count | Claims, footprint, productive split | Projection defects | Yes |
| Provenance over/under-modeling | Hybrid decisive snapshots | Storage/privacy balance | Yes |
| Work/Commitment divergence | Work specialization | Legacy code seams | Yes |
| Manual event ambiguity | Direct-origin fact | Event/one-off convergence | Yes |
| Goal Activity/Execution ambiguity | Derived interpretation vs evidence | UI labeling | Yes |
| Choice/preference confusion | Explicit promotion | Nudging copy | Yes |
| Proposal/Friction conflation | Separate lifecycle | Shared UI patterns | Yes |
| Live/ordinary divergence | Typed context, shared domain | Separate code paths | Yes |
| User-day errors | Canonical windows/frozen provenance | DST/boundary testing | Yes |
| Broad-range performance | Independent horizons/review | Query scaling | Yes |
| Persistence migration | Versioning/atomic restore | Complexity | Yes |
| Learning/LLM hidden authority | Lowest rank/render-only | Leakage in product copy | Yes |
| Accessible UX complexity | Structured reasons/progressive display | Cognitive load | Yes |

## 84. End-to-End Worked Scenarios

- **A:** Doctor appointment authoring creates direct Commitment/event authority → Preview → publication → optional execution → immutable history.
- **B:** Recurring study authority → candidate → deterministic placement → Preview; no Proposal acceptance.
- **C:** “Earn Network+” without Demand remains a Goal and consumes no Capacity.
- **D:** 3h/week, minimum 30m Demand projects bounded sessions but schedules nothing.
- **E:** Work, Sleep/Commitments, components, Buffers, and liabilities subtract/deduplicate into qualified interval Capacity.
- **F:** Network+ and Writing feasible slices form competing Demand; Priority/Policy drive provisional Allocation.
- **G:** Allocation produces ranked Proposal; fresh acceptance creates bounded Accepted Allocation.
- **H:** User duration/time delta is frozen, fully revalidated, then accepted or rejected.
- **I:** Rejection persists proposal decision evidence; no schedule authority.
- **J:** Accepted Allocation atomically realizes Goal work/support/Buffer → Preview → publication.
- **K:** Travel is real support and Capacity cost; only productive core satisfies Demand; Buffer only protects.
- **L:** Later collision enters Friction without rewriting Proposal.
- **M:** SuggestedFix acceptance yields PlanDecision or CompositeDecision according to target scope.
- **N:** Completion with different actual duration appends Execution; plan remains immutable and may yield divergence.
- **O:** Execution effort does not auto-create Progress; an observation is separate.
- **P:** Canceled meeting preserves plan → Released Interval → liabilities subtracted → Live Capacity/Opportunity.
- **Q:** Current unmet Demand → feasibility/Allocation → Live Proposal → fresh one-off acceptance.
- **R:** 45m cannot fit 30m workout + 30m travel; exclude/No-Proposal, not Friction.
- **S:** Direct Network+ study records Goal-linked direct-spontaneous Execution; no fabricated Proposal/schedule.
- **T:** Repeated direct choices yield tendency evidence only.
- **U:** Explicit user promotion creates scoped reusable Preference.
- **V:** 01:30 opportunity remains in canonical overnight user-day.
- **W:** Year data may support planning while Proposal/review stays narrowly bounded.
- **X:** Capacity with no eligible fit returns explained No-Proposal.
- **Y:** Time advance expires Live Proposal; it cannot be accepted without successor/revalidation.
- **Z:** Direct Goal scheduling creates explicit bounded schedule authority and direct provenance without Proposal.

## 85. Synthesis Consistency Checks

All seventy resolve normatively: `SC-01` Commitment owns time, Goal does not; `SC-02` Demand requests/no ownership; `SC-03` Capacity derived/non-authoritative; `SC-04` free clock time not automatically Capacity; `SC-05` Buffer protects/no execution; `SC-06` Attached Activity executes; `SC-07` support no automatic Demand satisfaction; `SC-08` support no Progress; `SC-09` Structure no scheduling; `SC-10` Structure no Proposal; `SC-11` Proposal consumes resolved structure; `SC-12` feasibility no allocation; `SC-13` Allocation no authority; `SC-14` Proposal no authority; `SC-15` acceptance bounded authority; `SC-16` no silent recurrence; `SC-17` realized schedule owns/protects; `SC-18` Preview projects authority; `SC-19` Preview not Proposal; `SC-20` recurrence placement not Proposal; `SC-21` Published Plan immutable; `SC-22` Execution no rewrite; `SC-23` Execution no automatic Progress; `SC-24` rejection no schedule; `SC-25` ignore not reject; `SC-26` direct action no fabricated Proposal; `SC-27` Found Time no rewrite; `SC-28` Released Interval not Capacity; `SC-29` Live Capacity subtracts liabilities; `SC-30` Live Opportunity no authority; `SC-31` Live Proposal ordinary semantics; `SC-32` Live accept one-off; `SC-33` required failure not free; `SC-34` Buffer release no Execution; `SC-35` post-accept conflict Friction; `SC-36` unaccepted competition not Friction; `SC-37` No-Proposal not Friction; `SC-38` No-Proposal not necessarily error; `SC-39` SuggestedFix not Proposal; `SC-40` PlanDecision not ProposalDecision; `SC-41` CompositeDecision not Accepted Allocation; `SC-42` Choice not Preference; `SC-43` tendency not authority; `SC-44` promotion explicit; `SC-45` Commitment Priority not Goal Priority; `SC-46` Goal Priority not derived urgency; `SC-47` heuristics not values; `SC-48` user-day not calendar day; `SC-49` broad data not broad review; `SC-50` Proposal Horizon explicit; `SC-51` Live time explicit; `SC-52` history independent of current state; `SC-53` identities domain-specific; `SC-54` stale state cannot authorize; `SC-55` deterministic tie-breaks; `SC-56` LLM no authority; `SC-57` direct Goal schedule possible; `SC-58` spontaneous execution possible; `SC-59` productive/overhead no double count; `SC-60` Allocation does not mutate Capacity; `SC-61` claims do not rewrite historical Capacity; `SC-62` Accepted Allocation distinct from schedule; `SC-63` cancellation not retroactive rejection; `SC-64` Goal link not satisfaction; `SC-65` scheduled not executed; `SC-66` execution not successful outcome; `SC-67` Summary no authority; `SC-68` guidance cannot eliminate higher-authority choices; `SC-69` ordinary/Live one model; `SC-70` every authoritative concept has one owner.

## 86. Synthesis Decisions

Each row includes Decision, Normative Reconciliation, Source Domains, Reasoning, System Consequence, Implementation-Reconciliation Consequence, and Remaining Question.

| ID | Decision | Normative Reconciliation | Sources | Reasoning | System Consequence | Implementation Reconciliation | Remaining Question |
|---|---|---|---|---|---|---|---|
| AS-SYNTH-01 | Epistemic model | Seven states + learning/promotion | All | Prevent conflation | Explicit transitions | Map current types | UI labels |
| AS-SYNTH-02 | Authority model | User crossing only | Governance/Proposal | User primacy | No implicit consent | Atomic commands | Gestures |
| AS-SYNTH-03 | Time ownership | Scheduled authority owns; Buffer protects | Capacity/Composition | Accounting integrity | Capacity safe | Interval ledger mapping | Storage |
| AS-SYNTH-04 | Commitment | Canonical time-seeking source | Core/Composition | One responsibility | Owns schedule intent | Normalize legacy forms | Event convergence |
| AS-SYNTH-05 | Work | Commitment specialization | Work/Capacity | Avoid parallel ontology | Same rules | Adapter strategy | UI terminology |
| AS-SYNTH-06 | Goal | Outcome authority only | Goals | Outcome/resource split | No implicit time | Preserve links | Product copy |
| AS-SYNTH-07 | Goal Structure | Own relationships/eligibility | Structure | Upstream semantics | Proposal consumes outputs | New models | Editing UX |
| AS-SYNTH-08 | Demand | Authored request + projection | Demand | Goal alone insufficient | No time ownership | New authority/read model | Storage |
| AS-SYNTH-09 | Goal Priority | Separate authored value | Demand/Structure | Not Commitment priority | Allocation input | New authority | UX |
| AS-SYNTH-10 | Capacity | Derived qualified intervals | Capacity | Demand-neutral resource | Disposable truth | Build read model | Caching |
| AS-SYNTH-11 | Liability | Reserves uncertain authority | Capacity/Composition | Fail-safe availability | Qualified Capacity | Explicit ledger | Resolution UX |
| AS-SYNTH-12 | Feasibility | Enumerates full-footprint fit | Demand/Composition | No allocation | Pure derived stage | New service | Performance |
| AS-SYNTH-13 | Competition | Overlapping eligible Demand set | Demand | Not Friction | Allocation input | Normalize/dedupe | Diagnostics |
| AS-SYNTH-14 | Allocation | Provisional policy distribution | Demand | Reasoning not choice | No authority | New engine | Policy UX |
| AS-SYNTH-15 | Proposal | Constructive epistemic boundary | Proposal | Separate recommendation | Options/No-Proposal | New domain | Presentation |
| AS-SYNTH-16 | ProposalDecision | Explicit proposal response | Proposal | Distinct target | Accept/reject history | New decision type | Storage host |
| AS-SYNTH-17 | Accepted Allocation | Bounded resource authority | Demand/Proposal | Acceptance bridge | Schedulable claims | New authority | Transaction design |
| AS-SYNTH-18 | Realization | Atomic work/support/buffer | Proposal/Composition | Full footprint | Time ownership | Integrate placement | Failure UX |
| AS-SYNTH-19 | Preview | Projection, never Proposal | Existing/Proposal | Prior authority | Disposable | Keep semantics | Composition display |
| AS-SYNTH-20 | Published Plan | Immutable range ledger | History | Denominator truth | Append-only | Extend lineage | Versioning |
| AS-SYNTH-21 | Execution | Actual evidence | Execution | Plan separate | Divergence source | Extend Goal/origin | Timer UX |
| AS-SYNTH-22 | Progress | Explicit outcome evidence | Goals | Effort ≠ progress | Separate records | Preserve measurement | Suggestions UX |
| AS-SYNTH-23 | History | Linked immutable ledgers | All | No reinterpretation | Explainable past | Hybrid snapshots | Retention |
| AS-SYNTH-24 | Accepted Choice | Situation-bound evidence | Decisions | Not preference | Guidance input only | Generalize view | Summary display |
| AS-SYNTH-25 | Preference | Explicit scoped authority | Preference | Promotion required | Reusable guidance | New/extend authority | UX |
| AS-SYNTH-26 | Learned guidance | Deterministic low-rank tendency | Learn | No hidden authority | Rank only | Evidence pipeline | Algorithm |
| AS-SYNTH-27 | Friction | Corrective authorized conflict | Friction | Not allocation | Post-authority lifecycle | Preserve current domain | Unified UI |
| AS-SYNTH-28 | SuggestedFix | Corrective option only | Friction | Narrow actions | No constructive reuse | Share patterns only | Copy |
| AS-SYNTH-29 | PlanDecision | Occurrence override | Decisions | Corrective scope | Existing authority changes | Preserve/reuse infrastructure | Envelope |
| AS-SYNTH-30 | CompositeDecision | Composite correction | Composition | Transactional components | Existing authority changes | New bounded type | UX |
| AS-SYNTH-31 | Found Time | Divergence provenance | Live/Execution | No plan rewrite | Live input | Detector needed | Notifications |
| AS-SYNTH-32 | Released Interval | Gross release, not Capacity | Live/Capacity | Liabilities remain | Two-stage derivation | New value type | Merge logic |
| AS-SYNTH-33 | Live Capacity | Capacity-at-now | Capacity/Live | One resource semantics | Safe interval | Current query | Refresh |
| AS-SYNTH-34 | Live Opportunity | First-class context | Live/Proposal | Generalize sources | Short-horizon planning | New context | Prompting |
| AS-SYNTH-35 | Direct spontaneous | Goal-linked unplanned origin | Execution | Reality without fiction | Evidence only | Extend execution | Capture UI |
| AS-SYNTH-36 | User-day | Canonical piecewise windows | Time | Non-9-to-5 | Universal ownership | Reuse implementation | DST tests |
| AS-SYNTH-37 | Horizons/scopes | Data, proposal, review, publication distinct | Capacity/Proposal/UI | Avoid range coupling | Explicit bounds | Query/API separation | Defaults |
| AS-SYNTH-38 | Determinism | Semantic equality/order | Governance/all engines | Reproducibility | Stable outcomes | Inject time/tie-breaks | Algorithms |
| AS-SYNTH-39 | Explainability | Structured decisive provenance | All derived domains | Trust/history | Reason graph | Shared taxonomy | Copy |
| AS-SYNTH-40 | LLM | Render only | Proposal/Governance | No nondeterministic authority | Safe augmentation | Boundary tests | Provider |
| AS-SYNTH-41 | Persistence | Authored/accepted/derived/history classes | Persistence/History | Correct durability | Clear backups | Migration plan later | Physical stores |
| AS-SYNTH-42 | Identity/revision | Domain IDs + lifetime/revision/fingerprint | All | No retargeting | Stable lineage | Compatibility map | ID formats |
| AS-SYNTH-43 | Staleness | Material dependency invalidates authority crossing | Derived domains | Safety | Revalidation | Dependency graph | Granularity |
| AS-SYNTH-44 | Productive/overhead | Core satisfies; support/Buffer cost only | Demand/Composition | No double count | Accurate accounting | Separate fields | Visualization |
| AS-SYNTH-45 | Direct paths | Author/schedule/execute without Proposal | Governance | User autonomy | Explicit origin | Preserve entry points | UX |
| AS-SYNTH-46 | Four-stage map | Teach facts, Plan reasons/authorizes, Live executes/adapts, Learn interprets | Charter/All | Product coherence | Surface/domain separation | Routing reconciliation | Copy |
| AS-SYNTH-47 | Proposal→Friction | Acceptance/realization is boundary | Proposal/Friction | Trigger clarity | Correct lifecycle | Link histories | Combined review |
| AS-SYNTH-48 | Learning loop | Evidence→guidance→explicit promotion | History/Learn | No silent preference | Safe adaptation | New projection | Controls |
| AS-SYNTH-49 | Dogfood handoff | Reconcile ledger next | Governance/Product | Architecture closed | Classification basis | No roadmap yet | Ledger source |
| AS-SYNTH-50 | Closure | AS2 | All | Minor governance clarifications only | Proceed to Dogfood | Update governance later | Exact consolidation order |

## 87. Dogfood Pass 01 Handoff

The next task receives this normative map and must classify every ledger finding as: resolved by accepted architecture; implementation-alignment gap; defect/bug candidate; UX/workflow issue; visual/polish issue; deferred enhancement; or bounded architectural follow-up required. It must distinguish Intended, Implemented, and Experienced Truth and may not treat an accepted specification as implemented. No individual finding is dispositioned here.

## 88. Governance Consequences

After Dogfood reconciliation, `ARCHITECTURE_CHARTER.md` and the canonical synthesis (currently not located) may need publication/restoration and incorporation of the authority/epistemic model; `DECISIONS.md` needs accepted ADR summaries and supersession links; `CURRENT_STATE.md` needs removal/reconciliation of stale “Phase 8 Ready” posture and current architectural state; `CHANGELOG.md` needs documentation milestones; `Implementation_Architecture_Synthesis.md`/alignment strategy need current domain mapping; and an Implementation Roadmap may later sequence verified gaps. None is modified now.

## 89. Synthesis Conclusions

The system has one owner for every major truth, one authority crossing for constructive allocation, one time-accounting model, one ordinary/Live Proposal model, and distinct corrective and learning lifecycles. No genuine contradiction or missing domain blocks product reconciliation. Terminology, governance chronology, implementation mapping, persistence placement, and accessible UX remain downstream. Closure is AS2.

## 90. Recommended Next Step

**Path A — Dogfood Pass 01 Findings Reconciliation.** Revisit the complete Dogfood ledger against this synthesized Intended Truth and classify implementation, defect, workflow, polish, enhancement, and any bounded architecture gaps. Do not begin that work, create a roadmap, or assign Phase 8 here.

## 91. Completion Statement

**Post-Phase-7 Architecture Synthesis complete.**

The synthesis reconciles DayFrame's accepted post-Phase-7 architecture into one coherent normative system model spanning Teach, Plan, Live, and Learn; establishes canonical epistemic, authority, time-ownership, persistence, identity, revision, staleness, provenance, determinism, and explainability boundaries; integrates Commitments, Work, Commitment Composition, Goals, Goal Structure, Goal Demand, Goal Priority, Capacity, Goal-Specific Feasibility, Competing Demand, Allocation, Constructive Proposal, ProposalDecision, Accepted Allocation, schedule realization, Preview, Published Plan, Execution, Progress, History, Accepted Choice, reusable Preference, learned guidance, Friction, Found Time, Released Interval, Live Capacity, Live Opportunity, and direct action without collapsing their semantic responsibilities; identifies and resolves or explicitly records cross-specification seams, duplicate concepts, missing ownership, contradictions, and remaining architectural risks; determines whether the architecture is sufficiently closed for Dogfood Pass 01 Findings Reconciliation; and recommends the next architectural/process step without modifying implementation, constructing an implementation roadmap, or assigning the work to a future implementation phase.
