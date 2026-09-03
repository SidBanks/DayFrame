# Constructive Proposal Architecture Specification Result

## 1. Executive Specification

A Constructive Proposal is a deterministic, explainable, derived, non-authoritative recommendation containing a ranked bounded option set—or a typed No-Proposal result—for allocating current Capacity to eligible normalized Goal Demand. Only an explicit, current, revalidated user acceptance creates an Accepted Allocation; only realization of that authority creates scheduled Goal work, support activities, and Buffers. Ordinary and Live/Found-Time recommendations use one lifecycle. Direct authoring and spontaneous execution remain independent.

## 2. Architectural Context

This specification composes the accepted Capacity, Goal Demand/Allocation, Goal Structure, Commitment Composition, Friction, Execution, Progress, and History boundaries. It adopts the audit's CP3/CP4 and FT3 executable findings without treating current implementation as normative authority.

## 3. Normative Planning Chain

```text
Authored Goal truths → structural eligibility → projected/normalized Demand
+ derived Capacity + goal-specific/composite feasibility + Allocation Policy
→ provisional Allocation → Proposal → Accept / Modify / Reject
→ Accepted Allocation → scheduled productive/support/buffer facts
→ Execution → separate Progress/Summary/learning evidence
```

Live context prepends: published plan → divergence → Released Interval → subtract remaining liabilities → Live Capacity. Direct action bypasses Proposal and records direct/unplanned execution.

## 4. Epistemic Model

Authored truth, derived input, Allocation, Proposal, ProposalDecision, Accepted Allocation, scheduled reality, executed reality, Progress, historical evidence, learned tendency, and reusable preference are distinct versioned states. No transition is implicit across an authority boundary.

## 5. Constructive Proposal Definition

Proposal is derived and non-authoritative; references complete upstream reasoning; has bounded context, horizon, scope, options or No-Proposal; supports accept/modify/reject; and never creates Capacity, Demand, Priority, Structure, Composition, or time ownership.

## 6. Proposal as Epistemic Boundary

Engine reasoning ends at an actionable Proposal. User intent begins at ProposalDecision. `derived ≠ proposed ≠ accepted ≠ scheduled ≠ executed`; display, ranking, persistence, or notification cannot imply acceptance.

## 7. Proposal vs Preview

Preview projects already-authorized schedule facts. Proposal offers new discretionary allocation. Preview may display accepted proposal results but MUST NOT serve as Proposal identity, decision, or history.

## 8. Proposal vs Recurring Authority

Recurring Commitment realization consumes prior authority and requires no per-occurrence proposal. Promotion of a one-off proposal to recurrence is a separate explicit authoring act.

## 9. Proposal vs Friction

Proposal constructively offers new use of Capacity; Friction corrects incompatibility among authorized facts. Once accepted work owns time, later incompatibility belongs to Friction.

## 10. Proposal vs Allocation

Allocation is provisional resource reasoning. Proposal selects and explains user-facing options from it. Allocation neither records user choice nor owns time; Accepted Allocation does both within bounded scope.

## 11. Proposal Input Contract

Inputs MUST include typed context, Capacity identity/revision, eligible normalized Demand identities/revisions, Goal Priority authority, feasibility/composite footprints, Allocation and policy versions, current-time evaluation where relevant, and optional explicitly ranked guidance. Proposal may reference but never mutate them.

## 12. Input Completeness / Qualification

Every required input is `known`, `unknown`, `stale`, `inapplicable`, or `notRequired`. Missing decisive data produces qualified options only when safety is unaffected; otherwise a typed No-Proposal or error. Unknown is never silently defaulted into authority.

## 13. Proposal Context

Select one domain with typed contexts: `ordinary` and `liveOpportunity`. Live context adds Released Interval, Live Capacity, plan/divergence provenance, evaluation instant, and expiry; it does not change decision authority.

## 14. Proposal Horizon

Horizon is context-specific and explicit: ordinary is a bounded user-day/range; Live defaults to one current opportunity. It cannot exceed available input validity or silently inherit the planning-data horizon.

## 15. Planning Horizon vs Review Scope

Planning-data horizon, Proposal Horizon, and UI review scope are independent. Broad data may inform a narrow Proposal; neither option generation nor review expands merely because a month/year is loaded.

## 16. Proposal Scope

Scope declares affected Goal Demand portions, Capacity claims, user-day(s), occurrences/components, and one-off/bundle semantics. Default is bounded one-off; recurring scope requires separate explicit promotion.

## 17. Proposal Identity

Each Proposal has stable opaque ID, version, context, generated-at instant, input fingerprint, horizon/scope, lifecycle revision, and option IDs. Identity survives display/persistence; regeneration with materially changed inputs creates a new revision or successor.

## 18. Proposal Lifecycle

`generated → shown → accepted | rejected | ignored | stale | expired | superseded | inapplicable`; `modified` is a user-authored candidate requiring validation before acceptance. Terminal records are immutable; successors link backward.

## 19. Proposal Option

An option identifies Goal/Demand, productive duration, support/Buffer footprint, exact or bounded placement, Capacity claims, Allocation reference, reasons, assumptions, tradeoffs, exclusion context, qualification, and scope.

## 20. Proposal Cardinality

Select a deterministic ranked option set with one preferred option and zero or more alternatives. A Proposal may contain independent options or an explicitly atomic bundle; implicit bundles are forbidden.

## 21. Option Identity

Option ID is stable within Proposal revision and derived from semantic content plus Proposal identity. Modified options receive a distinct user-candidate identity linked to their source option.

## 22. Deterministic Generation / Ranking

Equivalent semantic inputs MUST yield equivalent eligibility, options, reason codes, and order. Ranking uses authoritative Allocation outputs/policy first, explicit preferences next, guidance lower, stable semantic tie-breakers last; never storage order.

## 23. Allocation Policy Boundary

Allocation Policy determines provisional distribution/ranking factors and is an authored/versioned input. Proposal explains its output; it cannot invent fairness, priority, fragmentation, deadline, or continuity policy.

## 24. Engine Heuristics

Heuristics may choose equivalent placement precision, presentation order after semantic equality, and deterministic tie-breaks. They MUST be named, versioned when outcome-relevant, and subordinate to user values.

## 25. Recommendation Explanation

Each option exposes structured reason codes, decisive inputs, why it fits, productive versus overhead cost, Capacity claim, priority/policy effects, assumptions, tradeoffs, and relevant excluded alternatives. Natural-language rendering is secondary.

## 26. Explanation Provenance

Explanations reference immutable/fingerprinted decision-time inputs and algorithm/policy versions. Historical explanation replays frozen evidence, never mutable current state.

## 27. Proposal Qualification

Qualification is `fullyQualified` or `qualified` with explicit limitations. Safety/authority-critical unknowns require abstention. Confidence is deterministic evidence quality, not probabilistic persuasion.

## 28. No-Proposal

No-Proposal is a successful reasoned result with context/horizon/fingerprint and codes such as noCapacity, noUnmetDemand, allSatisfied, noMinimumFit, compositionInfeasible, structurallyBlocked, policyAbstained, or incompleteInput.

## 29. No-Proposal vs Error

Expected domain inability to recommend is No-Proposal. Invalid/corrupt input, unsupported versions, or engine failure is error. Stale/unknown input is typed qualification or No-Proposal unless invalid.

## 30. Proposal Acceptance

Acceptance names Proposal revision and option, is explicit, timestamped, actor-originated, current/revalidated, and creates a ProposalDecision plus bounded Accepted Allocation. It does not itself fabricate historical execution.

## 31. Proposal Modification

Modify creates a user-authored candidate delta against an option. Editable fields are bounded to placement, productive duration within Demand rules, optional supported components, and explicit bundle selection; changing Goal/Demand/context is direct authoring or a new Proposal.

## 32. Modification Revalidation

Before acceptance the full candidate MUST be rechecked against current Capacity, Demand, feasibility, composition, Allocation constraints, time, and conflicts. Original, delta, validation result, and final option are frozen.

## 33. Proposal Rejection

Users may reject an option or entire Proposal. Rejection is immutable decision evidence, creates no Capacity/Demand/time authority, and never becomes preference automatically.

## 34. Ignore / Expiry

No response is ignored/expired, never rejection. Expiry is deterministic from context validity/current time; ignored is an interaction fact only if observable. Neither implies preference.

## 35. Accepted Allocation

Accepted Allocation is the immutable bounded authorization record joining ProposalDecision, selected/revalidated option, claimed Capacity, satisfied Demand portion, productive/support footprint, and scope. It is the bridge to schedule realization.

## 36. Accepted Allocation Scope

Scope is one-off by default, lists exact resources and user-days, and cannot exceed Proposal scope. Partial acceptance creates only the explicitly selected subset.

## 37. Accepted Allocation vs PlanDecision / CompositeDecision

ProposalDecision records proposal response; Accepted Allocation records new bounded resource authority. PlanDecision corrects an occurrence; CompositeDecision governs an existing composite occurrence. They may share identity/replay patterns, not types or semantics.

## 38. Promotion to Recurring Authority

Promotion is a separate explicit Commitment/recurrence authoring transaction with preview of scope. An accepted one-off option cannot silently promote or serve as reusable recurring authority.

## 39. Scheduled Goal Work / Support / Buffers

Realization produces distinct productive Goal work, Scheduled Support Activities, and Buffers from accepted composite footprint. Only productive work satisfies Demand; support consumes Capacity; Buffer is non-execution protection.

## 40. Publication Boundary

Only successfully realized Accepted Allocation may enter Preview/schedule publication. Publication freezes accepted lineage and plan facts; Proposal shown/generated/rejected states never become scheduled occurrences.

## 41. Proposal Staleness

Any material input revision/fingerprint mismatch, conflicting acceptance, or Live time change marks actionable Proposal stale. Stale proposals cannot be accepted.

## 42. Proposal Expiration

Expiration is time-based invalidation. Ordinary expiry follows declared validity; Live expiry occurs when opportunity starts/shrinks/ends beyond option feasibility. Expiration preserves history but removes actionability.

## 43. Proposal Revalidation

Revalidation resolves current inputs, reruns deterministic feasibility/Allocation, and either confirms the same semantic option, creates a successor, or yields No-Proposal. It never mutates historical revision.

## 44. Proposal Supersession

A replacement links to its predecessor and states cause. Superseded options are non-actionable; accepting another competing claim may supersede affected proposals atomically.

## 45. Proposal Historical Provenance

Retain Proposal/context IDs, decisive input snapshots/fingerprints, options/order/reasons, shown state when known, decision/delta, Accepted Allocation, lifecycle transitions, and origin. Do not duplicate full schedule/execution truth.

## 46. Historical Snapshot Strategy

Select a hybrid decisive snapshot: immutable values needed to interpret the recommendation plus versioned references/fingerprints to larger upstream artifacts. Snapshot enough to explain without copying unrelated/private state.

## 47. Proposal History vs Schedule / Execution History

Proposal history answers what was recommended/decided and why; schedule history answers what owned time; execution history answers what happened. Link by IDs, never collapse or infer one from another.

## 48. Accepted Choice

An accepted ProposalDecision is a situational Accepted Choice. It is evidence, not reusable policy, preference, recurrence, or proof of execution.

## 49. Learned Guidance

Learned tendency is derived, confidence-qualified, traceable guidance below explicit preferences. It may affect ranking only; it cannot filter hard-eligible choices or authorize time.

## 50. Reusable Preference Promotion

Promotion requires a separate explicit user act defining scope, strength, and revocation. Repetition, acceptance, or rejection alone cannot promote guidance.

## 51. Direct User Authoring

Users may author Commitments, recurrences, manual events, or other valid authority without Proposal. Origin is `directAuthoring`; no synthetic proposal is created.

## 52. Direct Goal Scheduling

Direct one-off Goal scheduling creates bounded user authority with Goal/Demand attribution where supplied, distinct from Accepted Allocation. It undergoes normal feasibility/conflict handling, not retroactive Proposal generation.

## 53. Direct Spontaneous Goal Execution

Extend unplanned execution conceptually with explicit Goal/Demand provenance and origin `directSpontaneous`. It creates execution evidence only, not schedule or Proposal history.

## 54. Execution vs Progress

Execution records effort/outcome/time; Progress records measured outcome change. One may reference the other, but effort never automatically implies progress.

## 55. Proposal-to-Execution Provenance

Origins are `recurringAuthority`, `directScheduled`, `proposalAccepted`, `foundTimeProposalAccepted`, and `directSpontaneous`. Scheduled/execution facts retain origin/link when applicable without requiring Proposal for direct paths.

## 56. Found Time

Found Time is derived Live availability caused by divergence from the authorized plan. It is neither authored availability nor retrospective plan revision nor permission to schedule.

## 57. Found-Time Sources

Typed sources include cancellation, skip, early completion of Work/activity/attachment, optional-component release, explicit Buffer release, and validated manual availability assertion. Each preserves planned and actual facts.

## 58. Released Interval

Released Interval is the gross time interval suggested by divergence, with source, plan reference, actual evidence, user-day, and evaluation instant. It is not yet Capacity.

## 59. Live Capacity

Live Capacity is liability-aware current discretionary availability derived by clipping Released Interval to now/horizon and subtracting authorized facts, required remaining composition, buffers not released, and unresolved liabilities.

## 60. Found Time / Capacity Provenance

Live Capacity references Released Interval and ordinary Capacity derivation/policy. The same Capacity semantics apply; `foundTime` is provenance, not a different resource type.

## 61. Found-Time Proposal

Use ordinary Proposal with `liveOpportunity` context. Inputs, ranked options, explanation, decision, Accepted Allocation, and authority rules are identical; Live provenance/expiry are additional.

## 62. Found-Time Horizon

Default horizon is the single Live Capacity interval within its canonical user-day and before the next protected obligation. Cross-day bundling requires explicit ordinary context, not silent Live expansion.

## 63. Found Time / Goal Demand

Live Proposal consumes currently unmet, structurally eligible, normalized Demand. Found Time creates no Demand and cannot override minimum session, cadence, splittability, or priority.

## 64. Found Time / Commitment Composition

Feasibility uses the complete required footprint and remaining obligations. Productive core fitting is insufficient when travel/setup/recovery/support does not.

## 65. Found Time / Buffers

Only explicitly releasable/released Buffer time contributes to Released Interval. Buffer remains non-activity and produces no execution record; later protected buffers remain liabilities.

## 66. Required Failure / Liability

Skipped/failed required components remain liability until explicitly resolved. Their planned span is not automatically Capacity and must explain abstention.

## 67. Found Time / Actual Duration

Early completion requires credible actual end (actual start + duration or explicit end) against immutable planned timing. Uncertain evidence yields qualified/no opportunity, never optimistic release.

## 68. Found Time / Cancellation

Cancellation is an explicit execution/plan-divergence fact distinct from skip where intent matters. It preserves original plan, derives gross release, and still undergoes liability checks.

## 69. Manual Found-Time Declaration

“I have 45 minutes” creates an asserted Live Opportunity candidate, not Capacity. Validate interval, current time, user-day, overlaps, remaining liabilities, and data freshness; contradiction yields explanation and safe clipping/rejection.

## 70. Found-Time Acceptance

Acceptance creates one-off Accepted Allocation bounded by the still-current Live interval. It never creates recurrence.

## 71. Found-Time Modification

Modified duration/time/components are revalidated against the shrinking Live interval and current obligations using ordinary modification rules.

## 72. Found-Time Rejection

Rejection creates no authority, optionally retains reason, and does not label the Goal disliked or future opportunities unwanted.

## 73. Found-Time Expiration

Live proposals expire aggressively as time advances or usable duration falls below full footprint/minimum session. They remain historical evidence, not actionable.

## 74. Spontaneous Found-Time Use

Users may act directly. Record `directSpontaneous` Goal-linked execution plus optional Progress; do not fabricate Proposal, acceptance, Allocation, or schedule.

## 75. Provenance Origins

Origin is required and closed/versioned: recurring, direct scheduled, ordinary proposal accepted, Found-Time proposal accepted, corrective decision, direct spontaneous. Unknown legacy origin remains explicit `legacyUnknown`.

## 76. Learning Evidence

Learning consumes provenance-separated history. Proposed acceptance, rejection, ignored/expired, and spontaneous action are distinct observations. Derived tendency remains non-authoritative.

## 77. Proposal Persistence / Retention

Persist actionable proposals and all explicit decisions; retain decisive snapshots per policy. Generated-but-never-shown proposals may be ephemeral. Deletion must preserve referential integrity or tombstones for accepted schedule history.

## 78. Backup / Restore

Versioned Proposal, decisions, Accepted Allocations, lineage, reason codes, and origin records participate in validated atomic backup/restore. Unsupported versions fail closed; no regenerated IDs or inferred decisions.

## 79. Reason Codes / Explainability

Reason codes are stable structured enums with parameters and algorithm/policy versions; copy is localized rendering. Codes cover inclusion, ranking, exclusion, qualification, staleness, and No-Proposal.

## 80. Alternative Exclusion

For materially relevant eligible alternatives, record deterministic exclusion/rank reasons (capacity, minimum fit, structure, composition, policy, lower rank). Do not claim consideration of unprojected Demand.

## 81. Modification Boundary

Edits within source Goal/Demand and Proposal scope are modification; switching Goal, expanding horizon/scope, recurrence, or inventing new support facts is direct authoring/new Proposal.

## 82. Proposal Bundle Assessment

Bundles are allowed only when Allocation declares an atomic set and option records every claim/footprint. Otherwise options are independent; partial acceptance of atomic bundles is forbidden.

## 83. Scheduling Precision

Options may be exact-placement or bounded-window. Precision is explicit. Capacity claims include intervals; duration-only recommendations are non-actionable until placement/revalidation.

## 84. Placement After Acceptance

If option accepts a window, deterministic placement may occur during realization only within accepted bounds and must fail/return to user if no longer feasible. It cannot widen scope or substitute another Goal.

## 85. User Values / Authority Ordering

Hard authored constraints → accepted schedule authority → Capacity policy → Demand hard constraints → Goal Priority → Allocation Policy → explicit reusable preferences → Accepted Choice guidance → learned tendency → engine heuristics. Lower levels never override higher.

## 86. Deterministic Learning Inputs

Guidance input must be versioned, reproducible, bounded to evidence cutoff, and explainable. Nondeterministic models cannot supply authority or hidden rank changes.

## 87. LLM Boundary

An LLM may render explanations or summarize already-determined options. It MUST NOT create eligibility, Capacity, Demand, ranking, options, decisions, Accepted Allocation, or schedule authority; output is labeled and non-authoritative.

## 88. Current-Time Dependency

Current time is an explicit injected evaluation instant, never ambient hidden clock input in deterministic core. It affects Live clipping, validity, expiry, and feasible start.

## 89. Canonical User-Day

All contexts, Capacity claims, and histories use canonical piecewise user-day windows and frozen boundary provenance. Calendar midnight does not switch ownership by itself.

## 90. Cross-User-Day Proposal

Ordinary proposals may span explicitly bounded user-days with per-day claims. Live proposals default to one user-day; any crossing is explicit, composition-safe, and separately accepted.

## 91. Proposal Failure Taxonomy

Results are success(options), success(No-Proposal), stale, expired, inapplicable, incomplete/qualified, or error. Reasons distinguish resource absence, demand absence/satisfaction, structural/composite infeasibility, policy abstention, conflict, and invalid input.

## 92. Proposal / Friction Transition

Before acceptance, inability to fit/allocate is feasibility/No-Proposal. After Accepted Allocation is realized as time-owning work, later collision is Friction. Proposal history remains unchanged.

## 93. Post-Acceptance Revision / Cancellation

Changing/canceling accepted scheduled work uses ordinary schedule/Plan/Composite decision semantics and links to Accepted Allocation. It does not mutate or “reject” the historical Proposal.

## 94. Planner / Today / Summary Boundaries

Planner requests/reviews ordinary proposals and realizes accepted results; Today displays Live context, asks “what now?”, and records decisions/execution; Summary reports proposal/decision/execution outcomes without becoming planning authority.

## 95. Found-Time Notification Boundary

Detection may create a non-authoritative notification. Notification neither creates Proposal nor authority; opening it evaluates fresh Live context. Proactive policy and UX remain downstream.

## 96. Live Opportunity

Adopt a first-class derived context representing current bounded discretionary opportunity, sourced by Found Time or validated manual/current Capacity. It carries origin, interval, liabilities, evaluation instant, and validity.

## 97. Found Time vs Live Opportunity

Found Time is one provenance source (execution divergence). Live Opportunity is the general typed context used for current short-horizon Proposal; manual declarations may create Live Opportunity without falsely claiming Found Time.

## 98. Direct “What Should I Do Now?”

Resolve current user-day and evaluation instant, derive/validate Live Opportunity, query eligible unmet Demand, run feasibility/Allocation, and return ordinary Proposal or No-Proposal. No action is scheduled without acceptance.

## 99. User-Declared Availability Validation

Assertions are inputs with provenance, not truth overrides. Intersect with canonical day, now, known authority, liabilities, and policy; explain clipping/conflict and require confirmation only for explicit override paths.

## 100. Accepted-Choice Guidance

Prior choices may influence rank below explicit preference/policy only when context similarity and evidence cutoff are deterministic and shown in explanation. They cannot eliminate eligible options or create authority.

## 101. Historical Tendency

Tendency is derived descriptive evidence with provenance, scope, confidence, and expiry. It ranks below Accepted Choice guidance and cannot be treated as preference.

## 102. Authority Ordering

The ordering in §85 is normative for eligibility, allocation, ranking, and placement. Conflicts fail closed at the higher-authority fact; explanations name the decisive level.

## 103. Selected Proposal Models

Context: one domain with `ordinary`/`liveOpportunity`. Cardinality: ranked preferred-plus-alternatives set, explicit atomic bundles. Horizon: context-specific bounded. Decision: ProposalDecision plus separate Accepted Allocation. Rejection: option and whole-Proposal. History: hybrid decisive snapshot. Found Time: ordinary Proposal with Live context. Live Opportunity: first-class derived context. Direct Goal execution: extend unplanned execution provenance, never retrospective occurrence.

## 104. Normative Worked Examples

- **A:** 19:00–20:00 Capacity + 45m Network+ yields a ranked option; accept creates one-off Accepted Allocation then scheduled work.
- **B:** Allocation compares two 45m Demands against 60m; Proposal explains preferred/alternative; neither owns time.
- **C:** Authored/resolved Goal Priority influences Allocation under policy, not Proposal invention.
- **D:** No minimum session fits → No-Proposal `noMinimumFit`.
- **E:** All satisfied → No-Proposal `allDemandSatisfied` despite Capacity.
- **F:** 60m workout + 30m travel exceeds 75m → exclude as `compositionInfeasible`.
- **G:** Explain 60m productive, 30m support, 90m Capacity cost; only 60m satisfies Demand.
- **H:** Recurring Commitment placement proceeds from prior authority without Proposal.
- **I:** 45m@19:00 changed to 30m@20:00 preserves original/delta, revalidates, then accepts.
- **J:** Rejection freezes decision/reason, creates no authority.
- **K:** No response expires/ignores; never becomes rejection.
- **L:** Capacity revision marks Proposal stale; successor/revalidation required.
- **M:** Direct Goal schedule records direct origin, no Proposal/Allocation fiction.
- **N:** Accepted/scheduled work later colliding enters Friction.
- **O:** Cancellation preserves plan, derives Released Interval, subtracts liabilities, then Live Capacity.
- **P:** Early Work preserves planned truth and derives only future usable interval.
- **Q:** Early commute protects next required component before Live Capacity.
- **R:** Released Buffer produces provenance but no execution record.
- **S:** Required skipped attachment remains liability; no automatic release.
- **T:** 45m Live Capacity + 30m minimum Network+ may yield Live option bounded to interval.
- **U:** 30m workout + 30m travel cannot fit 45m; exclude.
- **V:** Shrinking interval makes modification stale/infeasible; revalidate or No-Proposal.
- **W:** Reject Live option; retain optional rejection history, no authority.
- **X:** Direct Network+ action records Goal-linked `directSpontaneous` execution, no Proposal.
- **Y:** Repetition supplies evidence only, never automatic preference.
- **Z:** Similar Accepted Choice may rank lower-level guidance with explicit explanation.
- **AA:** After-midnight Found Time remains owned by canonical overnight user-day.
- **AB:** “45 minutes” is validated/clipped against obligations into Live Opportunity or explained refusal.
- **AC:** No useful option returns typed No-Proposal, not error.
- **AD:** Explanation renders deterministic inputs, policy, fit, costs, rank, exclusions, and assumptions.

## 105. Constructive Proposal Invariants

The normative set is: `CP-INV-01` Proposal derived/non-authoritative; `CP-INV-02` Preview not Proposal; `CP-INV-03` recurrence is prior authority; `CP-INV-04` `BlockCandidate` not discretionary Demand; `CP-INV-05` Proposal does not create Capacity; `CP-INV-06` Demand; `CP-INV-07` Priority; `CP-INV-08` Structure; `CP-INV-09` Composition; `CP-INV-10` Allocation is not acceptance; `CP-INV-11` Proposal distinct from Friction; `CP-INV-12` insufficient unaccepted Demand not Friction; `CP-INV-13` competing Demand is Allocation; `CP-INV-14` No-Proposal valid; `CP-INV-15` scope explicit/bounded; `CP-INV-16` horizon independent; `CP-INV-17` deterministic order; `CP-INV-18` heuristics not user values; `CP-INV-19` explanation traceable; `CP-INV-20` acceptance creates bounded authority; `CP-INV-21` one-off not recurrence; `CP-INV-22` modification preserves original/delta; `CP-INV-23` modification revalidated; `CP-INV-24` rejection no authority; `CP-INV-25` rejection no preference; `CP-INV-26` ignore not rejection; `CP-INV-27` stale not accepted; `CP-INV-28` superseded non-actionable; `CP-INV-29` Proposal history distinct; `CP-INV-30` mutable state cannot rewrite it; `CP-INV-31` Accepted Choice not Preference; `CP-INV-32` tendency non-authoritative; `CP-INV-33` direct authoring remains; `CP-INV-34` spontaneous action fabricates no Proposal; `CP-INV-35` execution does not imply Progress; `CP-INV-36` Found Time derived; `CP-INV-37` Released Interval not Capacity; `CP-INV-38` original plan preserved; `CP-INV-39` remaining liabilities subtracted; `CP-INV-40` same Proposal authority rules; `CP-INV-41` Live default one-off; `CP-INV-42` Found Time creates no Demand; `CP-INV-43` composition respected; `CP-INV-44` required unresolved time not free; `CP-INV-45` Buffer release no execution; `CP-INV-46` Live options expire; `CP-INV-47` direct Live action distinct; `CP-INV-48` repetition no authority; `CP-INV-49` canonical user-day; `CP-INV-50` no nondeterministic chatbot planning; `CP-INV-51` productive/overhead separate; `CP-INV-52` post-acceptance conflict is Friction; `CP-INV-53` Proposal history avoids fact duplication; `CP-INV-54` abstain on decisive unknowns; `CP-INV-55` direct authority outranks recommendation; `CP-INV-56` equivalent inputs yield equivalent reasoning.

## 106. Architecture Decisions

Each row contains the required Decision, Normative Rule, Reasoning, Consequences, Implementation Constraint, and Remaining Downstream Question.

| ID | Decision | Normative Rule | Reasoning | Consequences | Implementation Constraint | Remaining Downstream Question |
|---|---|---|---|---|---|---|
| CP-SPEC-01 | Definition | Derived explainable bounded recommendation | Preserve authority | New domain | No time ownership | UI wording |
| CP-SPEC-02 | Boundary | Acceptance is sole constructive authority crossing | Epistemic safety | Explicit transition | No implicit accept | Interaction gesture |
| CP-SPEC-03 | Preview | Separate objects/history | Existing authority differs | No reuse as identity | Links only | Display composition |
| CP-SPEC-04 | Recurrence | No repeated Proposal | Prior authority | Stable automation | Separate promotion | UX cue |
| CP-SPEC-05 | Friction | Separate corrective domain | Different trigger | Transition after schedule | Share patterns only | Combined screen |
| CP-SPEC-06 | Allocation | Provisional input, not choice | Derived reasoning | Accepted Allocation added | No direct scheduling | Algorithm detail |
| CP-SPEC-07 | Inputs | Typed versioned references/fingerprints | Reproducibility | Dependency graph | Fail closed | Physical APIs |
| CP-SPEC-08 | Completeness | Qualify or abstain on unknown | No invented truth | No-Proposal states | No silent defaults | Threshold copy |
| CP-SPEC-09 | Context | Ordinary + Live typed context | One authority model | Shared lifecycle | Exhaustive discriminator | UI routing |
| CP-SPEC-10 | Horizon | Explicit context-bounded | Prevent range leakage | Narrow Live | Never implicit | Default ordinary range |
| CP-SPEC-11 | Review scope | Independent of data/proposal horizon | Dogfood finding | Scalable review | Separate fields | UX defaults |
| CP-SPEC-12 | Scope | Explicit claims, default one-off | Bound authority | Partial acceptance clear | No silent expansion | Bundle UX |
| CP-SPEC-13 | Identity | Stable IDs + revisions + fingerprint | Lifecycle/history | Durable lineage | No regenerated IDs | ID format |
| CP-SPEC-14 | Lifecycle | Closed state machine | Avoid ambiguity | Terminal history | Validate transitions | Retention durations |
| CP-SPEC-15 | Option | Full work/cost/reason contract | Explain choice | Composition visible | No partial hidden cost | Card layout |
| CP-SPEC-16 | Cardinality | Ranked set; explicit bundles | Alternatives needed | Preferred + choices | Stable order | Display count |
| CP-SPEC-17 | Option identity | Stable within revision; delta lineage | Preserve modification | Auditable | Semantic identity | Hash scheme |
| CP-SPEC-18 | Ranking | Deterministic authority-ordered | Reproducibility | Explainable ranks | No array order | Policy formulas |
| CP-SPEC-19 | Explanation | Structured reasons + decisive evidence | Historical trust | Renderable | LLM cannot decide | Wording |
| CP-SPEC-20 | No-Proposal | Typed successful result | Abstention valid | Better diagnostics | Not generic error | Empty-state UX |
| CP-SPEC-21 | Acceptance | Explicit current option decision | User authority | Creates bounded bridge | Revalidate atomically | Confirmation UX |
| CP-SPEC-22 | Modification | Source option + bounded user delta | Preserve lineage | User flexibility | No Goal switch | Editor UX |
| CP-SPEC-23 | Revalidation | Full current dependency check | Avoid stale authority | Successor/No-Proposal | Atomic with accept | Latency handling |
| CP-SPEC-24 | Rejection | Option and Proposal levels | Evidence/no authority | Retained decision | No preference inference | Reason prompt |
| CP-SPEC-25 | Ignore/expiry | Distinct from rejection | Absence is not choice | Accurate evidence | Deterministic expiry | Visibility tracking |
| CP-SPEC-26 | Accepted Allocation | Separate immutable authority record | Allocation ≠ acceptance | Scheduling bridge | Exact claims | Storage host |
| CP-SPEC-27 | Accepted scope | Cannot exceed option, default one-off | Bound authority | Safe realization | Validate subset | Partial selection UX |
| CP-SPEC-28 | Decision types | ProposalDecision distinct from Plan/CompositeDecision | Different semantics | Shared infrastructure only | No union shortcut | Common envelope |
| CP-SPEC-29 | Recurrence promotion | Separate explicit authoring | Avoid hidden recurrence | One-off remains one-off | New transaction | Promotion UX |
| CP-SPEC-30 | Realization | Separate work/support/buffer facts | Accounting truth | Correct Demand/Progress | Atomic footprint | Failure recovery |
| CP-SPEC-31 | Publication | Only realized accepted authority publishes | Historical integrity | Proposal alone absent | Freeze lineage | Batch timing |
| CP-SPEC-32 | Staleness | Material dependency mismatch disables accept | Correctness | Revalidation path | Dependency fingerprints | Granularity |
| CP-SPEC-33 | Expiration | Explicit clock-based terminal state | Live safety | History retained | Inject clock | Durations |
| CP-SPEC-34 | Supersession | Linked successor disables predecessor | Avoid double accept | Clear lineage | Atomic competing claims | UI notification |
| CP-SPEC-35 | Provenance | Preserve context/options/decision/reasons | Explain history | Audit trail | Data minimization | Retention policy |
| CP-SPEC-36 | Snapshot | Hybrid decisive snapshot | Reproducible/minimal | References + values | Never current-state replay | Exact fields |
| CP-SPEC-37 | Accepted Choice | Situational evidence only | Choice ≠ rule | Safe learning | No auto promotion | Summary display |
| CP-SPEC-38 | Learning | Lower-ranked deterministic guidance | User values lead | Optional ranking effect | Evidence cutoff | Model design |
| CP-SPEC-39 | Preference promotion | Separate explicit scoped act | Prevent silent authority | Revocable rule | No inference-only promotion | UX |
| CP-SPEC-40 | Direct authoring | Always available | User primacy | No Proposal required | Record origin | Entry points |
| CP-SPEC-41 | Direct Goal schedule | Bounded direct authority | Proposal optional | Goal work scheduled | No fake Allocation | Authoring UI |
| CP-SPEC-42 | Spontaneous execution | Goal-linked unplanned direct origin | Record reality | No schedule fiction | Extend provenance | Capture UX |
| CP-SPEC-43 | Execution/Progress | Separate linked evidence | Effort ≠ outcome | Accurate measures | No auto progress | Suggested observation UX |
| CP-SPEC-44 | Found Time | Derived divergence availability | Preserve plan | Live input only | Never rewrite plan | Detection UX |
| CP-SPEC-45 | Released Interval | Gross divergence interval, not Capacity | Liabilities remain | Two-stage derivation | Typed provenance | Merge rules |
| CP-SPEC-46 | Live Capacity | Ordinary Capacity semantics clipped to now | One resource model | Safe opportunity | Liability-aware | Query caching |
| CP-SPEC-47 | Found provenance | Link plan, actual, release, Capacity | Explain derivation | Auditable | Immutable refs | Privacy retention |
| CP-SPEC-48 | Found Proposal | Ordinary Proposal + Live context | Same authority | Shared lifecycle | No separate domain | Surface layout |
| CP-SPEC-49 | Live horizon | One opportunity by default | Time sensitivity | Narrow options | No silent cross-day | Default expiry |
| CP-SPEC-50 | Found/Demand | Consume unmet normalized Demand | No invented work | Correct candidates | Query current Demand | Refresh cadence |
| CP-SPEC-51 | Found/composition | Full footprint required | Operational reality | Exclude false fits | Component-aware | Explanation detail |
| CP-SPEC-52 | Buffers | Explicit release; no execution | Buffer non-activity | Safe Capacity | Preserve identity | Release UX |
| CP-SPEC-53 | Liability | Required unresolved component blocks release | Safety | Abstention reasons | Fail closed | Resolution UI |
| CP-SPEC-54 | Cancellation | Explicit divergence distinct from skip | Semantics matter | Gross release source | Preserve original plan | Outcome vocabulary |
| CP-SPEC-55 | Early completion | Credible actual end required | Avoid optimistic time | Partial evidence allowed | Validate timestamps | Timer integration |
| CP-SPEC-56 | Manual availability | Assertion validated, not override | Protect authority | Clip/refuse explainably | Check all obligations | Confirmation UX |
| CP-SPEC-57 | Live decisions | Same accept/modify/reject | One lifecycle | One-off authority | Fresh atomic validation | Fast interaction |
| CP-SPEC-58 | Live expiry | Clock/opportunity invalidates | Short-lived truth | Non-actionable history | Inject evaluation time | Notification cleanup |
| CP-SPEC-59 | Direct Found use | Direct spontaneous provenance | User may bypass | No Proposal fiction | Goal link supported | Capture speed |
| CP-SPEC-60 | Origins | Closed explicit categories | Learning/history | Distinguishable paths | Legacy unknown explicit | Migration mapping |
| CP-SPEC-61 | Retention | Decisions and decisive reasoning retained | Historical explanation | Generated cache optional | Referential integrity | Policy duration |
| CP-SPEC-62 | Persistence | Versioned atomic backup/restore | Durable authority | Fail closed | No ID regeneration | Schema placement |
| CP-SPEC-63 | Reason codes | Structured stable codes | Determinism | Localized rendering | Version outcome logic | Taxonomy wording |
| CP-SPEC-64 | Failure taxonomy | No-Proposal/stale/expired/error distinct | Correct UX | Explicit results | Exhaustive unions | Telemetry |
| CP-SPEC-65 | Precision | Exact or bounded-window explicit | Acceptance clarity | Flexible realization | Claims recorded | Default precision |
| CP-SPEC-66 | Post-accept placement | Only within accepted bounds | No hidden choice | Can fail safely | No substitute Goal | Retry UX |
| CP-SPEC-67 | Authority order | Fixed hierarchy in §85 | User values | Explain decisive level | Lower never overrides | Policy configuration |
| CP-SPEC-68 | LLM | Rendering only | Deterministic authority | Safe assistance | No planning mutations | Provider choice |
| CP-SPEC-69 | User-day | Canonical piecewise semantics | Overnight correctness | Stable provenance | Freeze boundary | Display labels |
| CP-SPEC-70 | Live Opportunity | First-class derived context | Generalizes Found Time | Manual/current sources | Not authority | Notification policy |
| CP-SPEC-71 | Current time | Explicit injected dependency | Reproducibility | Live clipping/expiry | No ambient clock | Refresh interval |
| CP-SPEC-72 | Scope limitation | No Phase/implementation assignment | Task governance | Architecture only | No code/migrations | Roadmap sequencing |

## 107. Proposal State Matrix

| State | Source | Actionable? | Persist? | May Create Authority? | Historical Meaning |
|---|---|---:|---:|---:|---|
| generated/shown | Derived | Yes while valid | Shown/decision-linked | Only via accept | Offered reasoning |
| modified | User candidate | After validation | Yes | Via accept | Proposed delta |
| accepted | User | No repeat | Yes | Yes, bounded | Accepted Choice |
| rejected | User | No | Yes | No | Explicit refusal |
| ignored | Observed absence | No | Optional | No | No response |
| stale/superseded/expired/inapplicable | Derived lifecycle | No | Yes if shown/linked | No | Why unusable |
| No-Proposal | Derived result | No | Optional/decision context | No | Reasoned abstention |

## 108. Proposal Option Matrix

| Concern | Required Data | Authority Source | Derived? | Modifiable? | Freeze? |
|---|---|---|---:|---:|---:|
| Goal/Demand | IDs, revisions, amount | Goal/Demand | Yes selection | No switch; amount bounded | Yes |
| Productive duration | session/amount | Demand | Yes | Yes within rules | Yes |
| Overhead/Buffer | component footprint | Composition | Yes | Optional-only | Yes |
| Capacity claim/placement | intervals/precision | Capacity + Allocation | Yes | Within scope | Yes |
| Priority/Allocation | authority/policy refs | Goal/Policy | Yes | No | Yes |
| Explanation/assumptions/tradeoffs | reason graph | Derived inputs | Yes | No | Yes |

## 109. Proposal vs Friction Matrix

| Concern | Constructive Proposal | Corrective Friction |
|---|---|---|
| Trigger | Capacity + eligible Demand | Conflict among authorized facts |
| Input state | Non-authoritative possibilities | Existing authority |
| Existing authority required? | No for proposed work | Yes |
| Capacity role | Allocated provisionally | Constraint/context |
| Goal Demand role | Required | Incidental |
| Purpose | Add bounded useful work | Repair authority |
| Acceptance | Creates Accepted Allocation | Creates occurrence/composite correction |
| History | Proposal decision reasoning | Fix/decision provenance |
| Failure | No-Proposal/feasibility | Unresolved conflict |

## 110. Authority Matrix

| Concept | Category | Source | Owns Time? | Changes Capacity/Demand? | Acceptance? |
|---|---|---|---:|---:|---:|
| Capacity/Found Time/Live Opportunity | Derived resource/context | Engine + facts | No | Derives Capacity only | No |
| Goal Demand | Authored intent/projected | User + projection | No | Demand source | At authoring |
| Allocation/Proposal/Option | Derived reasoning | Engine/policy | No | No | No |
| ProposalDecision/Accepted Allocation | User decision/authority | User | Bounded claim | No upstream mutation | Yes |
| Scheduled Goal Work/Support/Buffer | Schedule authority | Accepted/direct authority | Yes | Consumes Capacity | Preceding authority |
| Friction fix | Corrective proposal | Engine | No | No | To apply |
| PlanDecision/CompositeDecision | Corrective authority | User | Alters existing | No | Yes |
| Direct Goal execution | Execution evidence | User | No retroactive | No | Direct act |

## 111. Decision Matrix

| Decision | Input | Authority? | Scope | Revalidate? | Preference? | Provenance |
|---|---|---:|---|---:|---:|---|
| Accept option | Current option | Yes | Bounded | Yes | No | Proposal/option |
| Modify + accept | Delta | Yes | Bounded | Yes | No | Original/delta/final |
| Reject option/Proposal | Proposal | No | Decision only | No | No | Rejection |
| Ignore | None | No | None | No | No | Optional observation |
| Direct Goal schedule | User input | Yes | Explicit | Feasibility | No | Direct |
| Direct spontaneous execution | Actual event | No schedule | Execution | Validate evidence | No | Direct spontaneous |
| Accept/reject Found proposal | Live option | Accept only | One-off | Fresh | No | Live context |
| Promote recurring | Accepted/direct pattern | Yes | Explicit recurrence | Validate authoring | Explicit preference | Promotion act |

## 112. Provenance Matrix

| Scenario | Proposal History | Schedule History | Execution History | Goal/Demand | Distinct? |
|---|---|---|---|---|---:|
| Recurring Commitment | None | Recurrence realization | Optional | Goal link | Yes |
| Accepted/modified Proposal | Original/options/decision/delta | Accepted lineage | Optional | Frozen refs | Yes |
| Rejected Proposal | Rejection | None | None | Decision context | Yes |
| Direct scheduled Goal | None | Direct origin | Optional | Direct refs | Yes |
| Spontaneous Goal | None | None | Direct unplanned | Explicit refs | Yes |
| Found accepted/rejected/direct | Live context + decision when proposed | Only accepted | Optional/direct | Frozen refs | Yes |
| Friction fix | Corrective decision | Revised authority | Optional | Existing link | Yes |

## 113. Input Dependency Matrix

| Input | Identity/Revision? | Fingerprint? | Stales? | Historical Reference? |
|---|---:|---:|---:|---:|
| Capacity, Demand Projection, Eligibility, Priority, Feasibility, Composition, Allocation, Policy | Yes | Yes | Yes when material | Yes, decisive snapshot/ref |
| Current time | Evaluation instant | N/A | Live/time-validity | Yes |
| Found-Time interval | Yes | Yes | Yes | Yes |
| Accepted-choice guidance | Evidence cutoff/version | Yes | If rank/selection changes | Yes when decisive |

## 114. No-Proposal Matrix

| Condition | Valid No-Proposal? | Error? | Explain? | User Action? |
|---|---:|---:|---:|---:|
| No Capacity/no unmet Demand/all satisfied/no minimum fit/composition infeasible/dependencies blocked/policy abstention | Yes | No | Yes | Change inputs/direct action |
| Stale data | No actionable proposal | No | Yes | Refresh |
| Unknown decisive data | Yes `incompleteInput` | No | Yes | Complete data |
| Ambiguous Priority | Qualified/abstain per policy | No | Yes | Clarify priority |
| Invalid/corrupt input | No | Yes | Yes | Repair |

## 115. Found-Time Source Matrix

| Source | Planned Fact | Actual Fact | Released Interval | Liability Check | Live Capacity |
|---|---|---|---|---|---|
| Canceled meeting/skipped Commitment | Scheduled span | Explicit cancel/skip | Gross remaining span | Later/composite facts | Safe remainder |
| Early Work/activity/attachment | Planned timing | Credible actual end | Actual→planned end | Remaining components | Safe remainder |
| Optional component skipped | Component plan | Explicit skip | Component span | Parent/required parts | Safe remainder |
| Required component skipped | Required plan | Failure/skip | Candidate only | Unresolved liability blocks | None until resolved |
| Buffer release | Buffer identity/span | Explicit release | Buffer span | Next obligations | Safe remainder; no execution |
| Manual assertion | Known schedule | User interval claim | Validated/clipped span | All known liabilities | Safe intersection |

## 116. Found-Time Decision Matrix

| Scenario | Live Opportunity? | Proposal? | Acceptance | Direct Action? | Provenance |
|---|---:|---:|---|---:|---|
| 15m/45m | If safe | Only if useful option fits | One-off | Yes | Interval/source |
| Shrinking interval | Initially | Stale/expire/revalidate | Fresh only | Yes if safe | Revisions |
| Liability remains | No usable Capacity | No | None | User may override directly | Liability shown |
| No eligible Demand | Yes | No-Proposal | None | Yes | Reason |
| User rejects | Yes | Rejected | None | Still may act directly | Rejection distinct |
| User spontaneous | Maybe | Not required | None | Yes | Direct spontaneous |
| “What now?” | Derive/validate | Proposal or No-Proposal | Ordinary rules | Yes | Request + context |

## 117. Productive-vs-Overhead Matrix

| Scenario | Productive | Support | Buffer | Capacity Cost | Demand Satisfaction | Progress |
|---|---:|---:|---:|---:|---:|---:|
| Workout + travel | Workout | Travel | As defined | Full footprint | Workout only | Separate observation |
| Study + setup activity | Study | Setup | 0 | Both | Study only | Separate |
| Study + setup Buffer | Study | 0 | Setup protection | Study + Buffer | Study only | Separate |
| Found-Time workout | Workout | Travel | Defined | Full Live claim | Workout only | Separate |
| Recurring Goal work | Core occurrence | Components | Defined | Full | Core | Separate |
| Direct spontaneous Goal work | Actual work | Actual support if recorded | None fabricated | Actual evidence | Demand attribution separately | Separate |

## 118. Lifecycle Matrix

| Event | Proposal | Decision | Accepted Allocation | Scheduled Work | History |
|---|---|---|---|---|---|
| Generated | Active | None | None | None | Optional |
| Accepted/modified | Terminal accepted | Accept + optional delta | Created | Realized atomically | Freeze lineage |
| Rejected | Terminal rejected | Reject | None | None | Proposal decision |
| Stale/superseded/expired | Non-actionable | None | None | None | Transition |
| Accepted then conflict | Historical accepted | Existing | Existing | Enters Friction | Both histories |
| Canceled after accept | Historical accepted | Schedule cancellation | Retained | Revised/canceled | No proposal rewrite |
| Executed | Historical | Retained | Retained | Historical plan | Execution linked |

## 119. Transition Matrix

| Transition | Input | Output | Automatic? | User Authority? | Time Ownership? | Freeze? |
|---|---|---|---:|---:|---:|---:|
| Allocation→Proposal | Derived | Proposal | Yes | No | No | If shown/decided |
| Proposal→accept/modify/reject | Proposal/user act | Decision/candidate | No | Yes | Accept bridge only | Yes |
| Accepted Proposal→Accepted Allocation | Valid accept | Authority | Atomic | Yes | Claim | Yes |
| Accepted Allocation→schedule | Authority | Work/support/buffer | Yes/bounded | Already supplied | Yes | Publication |
| Schedule→execution | Actual report | Evidence | No | User/evidence | No new schedule | Yes |
| Divergence→Released Interval→Live Capacity | Plan+actual+liabilities | Derived context | Yes | No | No | Provenance |
| Live Capacity→Proposal | Inputs | Live Proposal | Yes | No | No | If shown/decided |
| Found Proposal→accept | Fresh option | One-off authority | No | Yes | Yes | Yes |
| Found Time→direct execution | User act | Unplanned Goal evidence | No | Direct act | No retroactive | Yes |
| Accepted Choice→preference | Explicit promotion | Scoped preference | No | Yes | Future guidance only | Yes |

## 120. Primitive Compatibility Matrix

| Requirement | Existing Primitive | Reuse | Adaptation | Risk |
|---|---|---|---|---|
| Proposal projection | Preview | Conceptually Related but Wrong Abstraction | Separate context/state | Authority conflation |
| Demand candidate | `BlockCandidate` | Wrong Abstraction | New option/input | Prior authority confused |
| Schedule realization | `ScheduledBlock` | Reusable with Adaptation | Accepted lineage | Silent scheduling |
| Recommendation UI | SuggestedFix/Friction | Reusable with Adaptation patterns | New semantics/reasons | Corrective conflation |
| Decision | `PlanDecision`/replay/choices | Reusable with Adaptation | New ProposalDecision/Accepted Allocation | Scope loss |
| Invalidation | Preview staleness | Reusable with Adaptation | Dependency graph/time | Stale acceptance |
| Identity | Durable occurrence refs | Directly Reusable for scheduled targets | Add proposal refs | Broken lineage |
| History | Historical occurrence/Goal snapshot/Activity | Reusable with Adaptation | Proposal snapshot | Mutable explanation |
| Actual/direct action | Execution/unplanned/Progress | Reusable with Adaptation | Goal/origin linkage | Fabricated schedule/progress |
| Direct schedule | Manual event | Reusable with Adaptation | Goal provenance | Proposal monopoly |
| Time boundary | User-day logic | Directly Reusable | Live evaluation | Midnight error |
| Durability | Backup/restore | Reusable with Adaptation | New versioned collections | Lost decisions |

## 121. Specification Consistency Checks

All sixty resolve as follows: 1 recurrence bypasses Proposal; 2 Preview stays separate; 3 one fitting Goal yields option; 4 competing Goals use Allocation; 5 Priority acts only through authority/policy; 6 no fit is No-Proposal; 7 satisfied Demand is No-Proposal; 8 full composition controls fit; 9 accept creates bounded authority; 10 modification preserves original/delta; 11 infeasible modification cannot accept; 12 rejection no authority; 13 ignore not rejection; 14 stale non-actionable; 15 successor supersedes; 16 expiry non-actionable; 17 direct schedule allowed; 18 spontaneous Goal execution direct; 19 later conflict is Friction; 20 later cancellation does not rewrite Proposal; 21 Proposal/schedule histories distinct; 22 rejection has no schedule history; 23 cancellation can source Released Interval; 24 early completion can source it; 25 attachment source retains component liabilities; 26 Buffer release no execution; 27 required skipped attachment blocks release; 28 too-small Found Time yields No-Proposal; 29 fitting Found Time may yield option; 30 composite nonfit excludes; 31 Live acceptance one-off; 32 Live modification revalidates; 33 Live rejection no authority; 34 Live expiry; 35 Live direct action distinct; 36 repetition evidence only; 37 Accepted Choice lower-level guidance; 38 no silent promotion; 39 overnight uses canonical day; 40 conflicting manual availability clips/refuses; 41 time advance stales/expires; 42 Capacity change stales; 43 Demand change stales; 44 Structure change stales when decisive; 45 Composition change stales; 46 competing acceptance supersedes/stales; 47 frozen evidence reproduces explanation; 48 equivalent inputs produce equivalent reasoning; 49 lower authority cannot override higher; 50 LLM cannot plan; 51 Allocation cannot schedule; 52 Proposal cannot mutate upstream; 53 direct authority outranks suggestion; 54 productive/overhead remain separate; 55 execution not Progress; 56 No-Proposal not error; 57 unknown decisive data abstains; 58 Live and ordinary share lifecycle; 59 backup/restore preserves IDs/lineage; 60 no hidden autonomous scheduling.

## 122. Implementation Constraints

Implementation MUST use versioned discriminated records; deterministic pure generation with injected time; canonical semantic ordering; explicit revisions/fingerprints; atomic accept/revalidate/claim/realize; immutable lifecycle and decisive snapshots; closed reason/origin/state taxonomies; one-off default; distinct productive/support/Buffer outputs; user-day-aware intervals; validated persistence/backup/restore; referential integrity/tombstones; no implicit acceptance, preference promotion, Progress, recurrence, or history rewrite; and no LLM authority. Existing Preview, Friction, PlanDecision, execution, or history types MUST NOT be broadened until compatibility mapping preserves their meanings.

## 123. Downstream Open Questions

Only presentation and implementation choices remain: cards/list and alternative count, explanation wording, notification policy, timer/Live controls, caching/performance, physical storage host, migration ordering, advanced guidance algorithms, promotion UX, LLM rendering provider, and Summary visualization. Authority, identity, lifecycle, scope, horizon, decisions, history, Found Time, and direct action are resolved here.

## 124. Specification Conclusions

The selected model is one deterministic Proposal domain with typed ordinary/Live contexts, ranked preferred-plus-alternative options, context-specific bounded horizons, ProposalDecision plus Accepted Allocation, option/proposal rejection, hybrid decisive snapshots, first-class Live Opportunity, and Goal-linked direct unplanned execution. Found Time is provenance into ordinary Live Capacity/Proposal—not authority. The architecture composes with every accepted upstream boundary without reopening it and is ready for post-Phase-7 synthesis.

## 125. Recommended Next Step

**Path A — Architecture Synthesis / Roadmap Reconciliation.** Constructive Proposal and Found-Time semantics now share one coherent authority model; reconcile the accepted post-Phase-7 specifications into an implementation-alignment roadmap. Do not begin that work or assign Phase 8 here.

## 126. Completion Statement

**Constructive Proposal Architecture Specification complete.**

The specification establishes Constructive Proposal as the deterministic, explainable, non-authoritative boundary between DayFrame's derived planning reasoning and explicit user intent; defines Proposal context, identity, horizon, scope, options, ranking, explanation, No-Proposal outcomes, acceptance, modification, rejection, staleness, supersession, Accepted Allocation, scheduled Goal work, historical reasoning provenance, Accepted Choice, direct user action, spontaneous Goal execution, and learning boundaries; integrates Capacity, normalized Goal Demand, Goal Priority, Goal-Specific Feasibility, Allocation, and Commitment Composition without allowing Proposal to create or rewrite those upstream truths; establishes Found Time as execution-derived Live availability that produces ordinary bounded Proposal opportunities only after remaining obligations and liabilities are protected; preserves the distinction among recurring-authority realization, Preview, Proposal, Friction, scheduled reality, execution, Progress, and historical evidence; prevents generated recommendations, repeated behavior, or nondeterministic explanation from silently becoming scheduling authority; and identifies the appropriate next architectural step without modifying implementation or assigning the work to a future implementation phase.
