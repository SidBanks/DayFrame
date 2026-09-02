# Capacity Semantic and Read-Model Architecture Audit

## 1. Executive Findings

This audit recommends the following precise contract:

> **Capacity is a deterministic, explainable, user-day-based set of planning intervals that remain eligible for discretionary allocation after all applicable time-owning Commitments, unresolved Commitment liabilities, mandatory constraints, protective buffers, accepted planning decisions, and general availability policy have been accounted for. Capacity describes resources; it does not express Goal demand, choose an allocation, recommend work, or authorize a schedule.**

The prior **C3 — Partially Implemented** classification remains correct. **Confirmed:** DayFrame has strong interval, user-day, Work, buffer, recurrence, decision-replay, and staleness primitives, but no coherent Capacity object or query. No contrary repository evidence was found.

Capacity cannot truthfully be a single duration. Its canonical form must preserve interval identity and user-day ownership. Totals, opening counts, longest-contiguous duration, fragmentation, and range summaries are derived views over those intervals.

The architecture must distinguish:

1. chronological free time;
2. geometric openings after occupied-time geometry;
3. general Capacity after universally applicable eligibility rules;
4. Goal-specific feasibility after applying a particular demand;
5. allocation and Proposal, which remain downstream.

“Feasible Opportunity” is useful as a generic result of applying any specified demand constraints to Capacity, but it should not become a separately persisted authority. “Allocatable Capacity” should be treated as a state/qualification of general Capacity, not a separate durable domain object.

Current Capacity should be a pure derived read model. Selective immutable snapshots may later be included in accepted-allocation or historical-plan provenance where they are needed to explain a decision. Capacity itself must not become durable authored authority.

The principal unresolved input boundary is unplaced time-owning Commitments. Their demanded time must not be advertised as Capacity. A Capacity read must either derive from a resolved commitment plan or explicitly return qualified/indeterminate coverage with the unresolved liabilities.

**Recommended next step: Path A — Capacity Architecture Specification.** Semantics, authority, temporal scope, provenance, staleness, and the downstream contract are sufficiently resolved to specify Capacity formally. Goal-demand design remains downstream and should not be folded into that specification.

## 2. Evidence and Prior Findings

### Intended truth

The complete architecture specification establishes that:

- the user is sole authority over intent and generated outputs remain advisory until accepted (`docs/architecture/DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`, lines 169–187);
- derived objects are deterministic, reproducible, and disposable, with Capacity Models explicitly included (`ibid.`, lines 372–392);
- all planning uses User Days (`ibid.`, lines 450–452);
- Commitments own time and precede allocation to Goals (`ibid.`, lines 456–474);
- Capacity is never authored and is always derived (`ibid.`, lines 508–514);
- provenance and transformation responsibility are required (`ibid.`, lines 207–218).

ADR-2.40 establishes source-lifetime-safe PlanDecision authority and the ordering authored authority → applicable decisions → heuristics; Try and recommendations remain non-authoritative (`docs/architecture/DECISIONS.md`, lines 384–393).

Dogfood Pass 01 establishes experienced truth: Capacity was not meaningfully visible, Commitments shape usable resources, off-day policy must not be silently selected, and meaningful attached activities must not be erased into anonymous buffers (`docs/audits/DAYFRAME_DOGFOOD_PASS_01_FINDINGS.md`, lines 297–351, 383–454, and 734–789).

### Implemented truth

The preceding audit found no Capacity entity, authority, persistence, aggregation, or UI. It identified only candidate-specific opening geometry (`docs/audits/CAPACITY_PROPOSAL_IMPLEMENTATION_ALIGNMENT_AUDIT.md`, sections 1–3). This audit verified the materially relevant code and found no contradiction.

**Confirmed:** `generateSchedulePreview` derives Work and candidates, replays decisions, places candidates, and detects Friction; Goals are not inputs (`code/src/core/engine/generateSchedulePreview.ts`, lines 33–251).

**Confirmed:** `placeBlockCandidates` computes private candidate-specific open windows and returns scheduled or unplaced candidates, not Capacity (`code/src/core/blocks/placeBlockCandidates.ts`, lines 12–68 and 380–664).

**Confirmed:** effective user-day preferences can vary by cycle segment (`code/src/core/cycles/resolveEffectiveSchedulePreferences.ts`, lines 6–42).

Evidence labels in this report use **Confirmed**, **Inferred**, and **Not Found** only for implementation findings. Architecture recommendations are explicitly identified as recommendations.

## 3. Recommended Capacity Definition

The provisional definition—“the derived planning resource remaining after Commitments and relevant constraints shape a planning period”—is directionally correct but incomplete. “Remaining” could be mistaken for subtraction from 24 hours, while “relevant constraints” does not identify whether they are universally applicable or demand-specific.

The recommended definition is:

> **Capacity is a deterministic, explainable collection of user-day-owned intervals eligible for discretionary allocation after DayFrame accounts for applicable time-owning Commitments, unresolved Commitment liabilities, mandatory constraints, protective buffers, accepted planning decisions, and general availability policy. Its duration and fragmentation are derived characteristics. Capacity remains descriptive and non-authoritative: it neither creates Goal demand nor chooses, recommends, or authorizes an allocation.**

Capacity explicitly is not:

- all clock time not occupied;
- a candidate's private placement search window;
- proof that a particular Goal demand fits;
- desired Goal effort;
- an allocation of time to a Goal;
- a Proposal or recommendation;
- a scheduled occurrence;
- a Friction or failure record.

The definition is intentionally neutral about which Goal deserves time and about future fatigue/recovery policy. Such policies may become general Capacity eligibility inputs only when explicitly authored or approved; otherwise they belong to Goal feasibility or allocation reasoning.

## 4. Time Ownership and Capacity Inputs

| Source | Authored or Derived | Owns Time? | Constrains Time? | Reduces Capacity? | Why? | Evidence |
|---|---|---:|---:|---:|---|---|
| Work pattern | Authored | Pattern-level | Yes | Yes after occurrence expansion | Work occurrences are obligations with exact intervals | `generateCycleWorkBlocks.ts`; preview lines 80–89 |
| Generated Work occurrence | Derived | Yes | Yes | Yes | Concrete occurrence of authored Work | `generateSchedulePreview.ts:80–89` |
| Manual event | Authored | Yes | Yes | Yes | Direct occupied calendar/user-day time | `generateSchedulePreview.ts:103–121` |
| Fixed recurring Commitment | Authored pattern / derived occurrence | Yes | Yes | Yes | Exact occurrence interval is owed | `placeBlockCandidates.ts:101–129` |
| Movable recurring Commitment | Authored pattern / derived occurrence | Yes, as demanded duration | Yes | Yes once resolved; liability before resolution | Flexibility changes location, not whether intent exists | `placeBlockCandidates.ts:25–53` |
| Sleep | Authored pattern / derived occurrence | Yes when intended as Commitment | Yes | Yes | Sleep demand is not discretionary free space | deferred Sleep logic, lines 141–179 |
| Protective buffer | Authored constraint | No | Yes | Yes for allocation eligibility | Reserves separation without becoming an activity | occupied-window expansion, lines 677–715 |
| Relational placement rule | Authored constraint/preference | No | Yes | Only if universal; otherwise affects feasibility | Narrows where a related occurrence can fit | search-window logic, lines 418–559 |
| Applicable PlanDecision | Accepted authored authority | Not independently | Yes | Yes through changed/omitted placement | Accepted occurrence authority changes derived reality | `replayPlanDecisions.ts:68–187` |
| Scheduling preference | Authored | No | Yes | Only where it defines general eligibility | Desirability must not automatically erase Capacity | block types and effective preferences |
| Source incarnation | Authored-lifetime metadata | No | Authority resolution | Indirectly | Prevents stale decisions from changing current derivation | `sourceIncarnation.ts`; replay tests |
| Goal | Authored | No | No | No | Expresses outcome, not occupied time | `goal.ts`; absent from preview input |
| Goal-linked authored activity | Authored Commitment with metadata link | Yes as Commitment | Yes | Yes | Link does not change time ownership | historical publication Goal provenance |

“Owns time” means the user has authorized an obligation or occurrence demand. “Constrains time” means a fact or rule changes where allocation may occur. Buffers and relational rules constrain without themselves becoming activities.

Current code has no unified Commitment authority. Capacity must initially consume several existing source families and preserve family-specific provenance. A future unified Commitment model may simplify the input boundary, but is not a prerequisite if the derivation contract explicitly enumerates supported families.

An unplaced movable Commitment is not Capacity. It is unresolved authored demand. Returning apparently available intervals without this qualification would double-claim time and violate epistemic integrity.

## 5. Free Time, Openings, Feasibility, and Capacity

The terminology should be refined as follows:

- **Chronological free time:** clock intervals not directly occupied by a concrete time-owning occurrence. Necessary as a geometric input, not a domain conclusion.
- **Geometric opening:** an interval left after concrete occupied intervals and protective buffers are subtracted from a temporal envelope. Necessary as a scheduler primitive.
- **Capacity:** geometric openings that are eligible under universally applicable planning constraints and policy, qualified by whether all time-owning Commitment demand has been resolved. Necessary as the downstream resource contract.
- **Feasible opportunity:** the result of testing Capacity against a specified demand contract. Useful terminology, but a derived evaluation result rather than separate authority.
- **Goal-specific feasibility:** feasible-opportunity evaluation for a particular Goal demand. Necessary and downstream of Capacity.
- **Allocatable Capacity:** Capacity whose coverage is sufficiently resolved and valid to be offered to allocation. Retain as a qualification/status, not a parallel model.

Required cases:

1. **10:00–14:00 gap:** Current DayFrame knows interval geometry only while placing a candidate. Before calling it Capacity, it must know the canonical user-day, buffers, unresolved commitment demand, applicable accepted decisions, general eligibility policy, and derivation freshness.
2. **30-minute buffers:** The chronological gap is four hours, but the geometric opening and maximum Capacity interval are 10:30–13:30, three hours. The buffers constrain allocation while remaining distinguishable from occupied activity.
3. **Three 30-minute fragments:** Ninety total free minutes is not a 90-minute opportunity. Capacity may retain all three intervals and total 90 minutes, but must expose longest contiguous duration of 30 minutes and fragmentation.
4. **Morning Capacity/evening demand:** The morning interval remains general Capacity. It is not feasible for an evening-only Goal demand. Capacity does not disappear because one demand cannot use it.
5. **Several 20-minute openings/45-minute demand:** Capacity preserves each interval. Goal-specific feasibility returns no matching opportunity; it must not sum non-contiguous fragments unless the later demand explicitly permits splitting.
6. **Relational demand:** An interval may remain general Capacity while being infeasible for before-Work or after-Work demand. A rule reduces general Capacity only when it is a universally applicable eligibility rule, not merely a property of one demand.
7. **Off-day policy:** Absence of Work changes raw openings. Preserve Routine may constrain those openings through authored routine policy; Adapt to Off Days may leave more allocatable Capacity. Until the user selects such policy, Capacity must not silently assume either interpretation.

## 6. Capacity Dimensions

| Dimension | Required? | Existing Primitive? | Capacity-Level or Goal-Specific? | Evidence / Reasoning |
|---|---:|---:|---|---|
| Interval start/end | Required | Yes | Capacity | Identity and contiguity cannot be reconstructed from totals |
| User-day identity | Required | Yes | Capacity | Canonical DayFrame temporal ownership |
| Interval identity | Required | Partial | Capacity | Needed for stable explanation and downstream reference; no Capacity ID exists |
| Total duration | Required derived summary | Yes arithmetic | Capacity presentation/aggregation | Useful but insufficient alone |
| Longest contiguous duration | Required derived summary | Derivable | Capacity | Prevents total-duration misrepresentation |
| Opening count | Required derived summary | Derivable | Capacity | Minimal fragmentation signal |
| Fragmentation | Required, structurally | Interval list | Capacity | Preserve topology; a complex score is not required |
| Time of day | Required as interval property | Yes | Capacity; preference matching downstream | Avoid premature labels when boundaries suffice |
| User-week | Optional aggregate | Yes | Aggregate presentation | Useful for allocation horizons; not canonical identity |
| Planning range | Required context | Yes | Capacity query/result | Defines coverage and clipping |
| Workday/off-day | Optional provenance/qualification | Derivable | Capacity context | Needed when policy depends on Work presence |
| Cycle/segment | Optional provenance | Yes | Explainability | Not a primary Capacity grouping |
| Constraint compatibility | General eligibility required; demand compatibility downstream | Partial | Split boundary | Capacity records universal exclusions; Goal evaluator applies demand constraints |
| Calendar month | Not canonical | UI range exists | Presentation only | Month may aggregate user-days without redefining them |
| Arbitrary range | Supported query scope | Planning windows exist | Aggregate | Must preserve component user-days and clipping |

Capacity cannot be truthfully represented by one number. The minimal canonical representation is an interval set plus coverage/qualification; all scalar metrics are projections.

## 7. General Capacity vs Goal-Specific Feasibility

The distinction should become an architectural invariant:

> **General Capacity is demand-neutral. Goal-specific feasibility applies one explicit Goal-demand contract to general Capacity without mutating it.**

For Tuesday's 90-minute evening interval:

- Goal A requiring 60 contiguous evening minutes is feasible.
- Goal B requiring 120 contiguous minutes is not feasible.
- Tuesday still has 90 minutes of general Capacity in both evaluations.

Capacity must expose interval boundaries, user-day identity, duration/contiguity, and applicable general qualifications so downstream demand evaluation does not reinterpret raw scheduler state. It must not expose Goal ranking, recommended share, or chosen placement.

Goal-independent time-of-day labels are optional presentation. Exact boundaries are authoritative derived facts; “evening-compatible” is a Goal-demand evaluation unless an explicit global policy defines evening as a general eligibility category.

## 8. Temporal and User-Day Semantics

Capacity's canonical temporal unit is the **Capacity interval owned by one canonical DayFrame user-day**. A user-day result is the primary grouping. User-week and planning-range results aggregate user-day results without merging across their boundaries or discarding fragmentation.

Scopes:

| Scope | Role |
|---|---|
| Occurrence | Input provenance, not Capacity scope |
| Capacity interval | Canonical resource unit |
| User-day / selected day | Canonical grouping/query result |
| User-week | Derived aggregate |
| Work cycle | Derived analytical grouping when useful |
| Planning/arbitrary range | Query coverage composed from user-days |
| Calendar month | Presentation range only |

**Confirmed:** Timestamps before a boundary belong to the prior user-day (`code/src/core/time/userDay.ts`, lines 35–72). **Confirmed:** placement accepts canonical user-day windows and supports variable effective boundaries (`placeBlockCandidates.ts`, lines 71–99; `resolveEffectiveSchedulePreferences.ts`, lines 32–42).

The statement “Capacity belongs to DayFrame user-days rather than naïve calendar dates” is necessary but should be refined:

> **Every Capacity interval belongs to exactly one canonical user-day window resolved under the effective scheduling preferences for that user-day; range aggregations retain that ownership even when the window crosses midnight or has variable duration.**

This covers overnight shifts, pre-boundary hours, cycle/segment overrides, and 21/27-hour boundary transitions. Planning-range clipping must identify partial coverage rather than presenting clipped totals as a complete user-day.

## 9. Buffers and Attached-Activity Boundary

Buffers reduce allocatable Capacity because the protected interval cannot be offered without violating an authored constraint. They do not own time and must remain distinguishable from occupied Commitments in provenance.

Semantic rules:

1. Expand each protected occurrence by applicable before/after buffers before calculating geometric openings.
2. Union overlapping protected intervals; never double-subtract overlapping buffers.
3. Attribute the exclusion to all contributing occurrence/buffer sources for explanation.
4. Preserve whether excluded time is occupied or protectively unavailable.
5. Do not create execution/history expectations for anonymous buffers.

If a commute later becomes a first-class attached activity, it should enter as time-owning activity with identity, meaning, and possible execution provenance. Capacity must accept that richer occupied-time input without flattening it back into anonymous buffer minutes. This audit does not decide the attached-activity model.

**Confirmed:** Current placement expands occupancy by `bufferBeforeMinutes` and `bufferAfterMinutes` (`placeBlockCandidates.ts`, lines 677–715). Dogfood evidence confirms large buffers can make placement infeasible and distinguishes commutes from buffers.

## 10. Priority Boundaries

- **Commitment priority:** Current implementation uses priority to order candidate placement. It can change which Commitment is placed first and therefore the residual interval pattern, but it does not make a Commitment cease owning time (`placeBlockCandidates.ts`, lines 18–23). Capacity should record the resolved authoritative result, not reinterpret priority as Goal importance.
- **Goal priority:** Not implemented and not part of Capacity. It belongs to later allocation reasoning.
- **Decision/preference priority:** Applicable PlanDecisions outrank heuristics by accepted architecture. General preferences may guide valid derivation, but desirability should not erase otherwise valid Capacity unless an authored rule explicitly establishes general ineligibility.

Commitment priority affects Capacity indirectly through deterministic conflict/placement resolution. It is not a Capacity dimension or a transferable priority for downstream Goals.

## 11. Capacity Read-Model Contract

| Information | Status | Why | Existing Source |
|---|---|---|---|
| Query/planning-range identity | Required | Defines requested coverage | Preview range/planning window |
| Coverage completeness | Required | Prevents partial or unresolved truth appearing complete | Must be added; analogous protected/coverage states exist |
| User-day label and exact window | Required | Canonical ownership and variable duration | user-day/cycle preference resolvers |
| Capacity interval identity | Required | Stable downstream reference and explanation | Must be added; derive from inputs/version |
| Interval start/end | Required | Preserves contiguity and time-of-day | Date interval primitives |
| Duration | Required, derivable | Convenient exact resource measure | Date arithmetic |
| Total duration by user-day/range | Optional projection | Useful summary, never canonical alone | Derivable |
| Longest contiguous interval | Required summary | Guards against fragmentation error | Derivable |
| Opening count | Required summary | Minimal fragmentation disclosure | Derivable |
| Detailed fragmentation score | Not required | Interval list is sufficient for V1 truth | None |
| Workday/off-day context | Optional | Explains policy-dependent eligibility | Work generation |
| Exclusion/dependency provenance | Required | Answers why Capacity exists or does not | Authored setup, decisions; needs projection |
| Unresolved Commitment liabilities | Required when present | Prevents double-claiming owed time | unplaced candidates |
| Authoritative-state fingerprint/revision set | Required | Freshness, reproducibility, identity | Incarnations and authority fingerprints; composition needed |
| Accepted-decision dependencies | Required | Decisions change derived availability | PlanDecision surface/replay |
| Derivation policy/version | Required | Makes semantic changes explainable | Must be introduced in specification |
| Stale/invalid/protected status | Required | Derived truth must declare invalidity | Preview staleness is reusable precedent |
| Goal compatibility | Not Capacity | Demand-specific evaluation | Future Goal demand layer |
| Goal demand | Not Capacity | Expresses desired outcome effort | Future layer |
| Allocation/ranking | Not Capacity | Chooses resource distribution | Future layer |
| Recommendation/acceptance | Not Capacity | Proposal and user-authority boundary | Future Proposal layer |

The read model should return exact intervals and explicit result status such as available, partial/qualified, unavailable/protected, or stale. Exact vocabulary belongs in specification. It must not contain recommended Goal IDs or scheduled proposed work.

## 12. Authority, Persistence, and Staleness

### Options

**Option A — Pure derived read model:** Best for current Capacity. It preserves deterministic/disposable derived semantics and avoids a second source of planning truth. Its limitation is that past Capacity cannot always be reconstructed after authored state changes.

**Option B — Persisted Capacity authority:** Reject. Persisting Capacity as authority would invert authored/generated separation, require complex synchronization, and allow stale derived output to masquerade as current truth.

**Option C — Derived current Capacity with selective historical snapshots:** Recommend as the complete lifecycle model. Current Capacity remains Option A. When an accepted allocation or historical plan requires explanation of the decision context, freeze only the relevant Capacity context as immutable provenance, not as continuing Capacity authority.

### Recommendation

Use **Option C**, with current reads governed by Option A semantics. This follows the architecture's treatment of derived objects as reproducible/disposable while preserving immutable historical explanation where reconstruction would be unreliable.

Capacity is invalidated by any change that can alter user-day windows, occupied intervals, unresolved demand, or general eligibility:

- shift definition or cycle/segment changes;
- recurrence enablement, frequency, or occurrence changes;
- Commitment creation, deletion/recreation, duration, placement type, fixed time, or relational rule changes;
- manual-event changes;
- buffer changes;
- user-day boundary or effective preference changes;
- accepted PlanDecision addition/removal/applicability changes;
- source-incarnation changes;
- derivation-policy version changes;
- off-day/general eligibility policy changes when introduced.

A preferred-window change invalidates the resolved commitment plan and therefore Capacity when it changes commitment placement. A purely Goal-specific preference does not invalidate general Capacity.

Capacity staleness should use dependency fingerprints rather than a single mutable flag as its semantic basis. Current Preview staleness is a useful orchestration precedent (`dayFrameStore.ts`, `markPreviewStale`, lines 3259–3267), but Capacity needs range-scoped dependency identity and protected/unresolved coverage states.

## 13. Capacity Provenance

To answer “Why do I have three hours of Capacity on Tuesday?”, the read model must be able to identify:

- the queried range and exact canonical user-day window;
- effective day-boundary and cycle/segment preference source;
- concrete occupied Work, Commitment, and manual-event occurrences;
- protective buffer exclusions distinct from occupied time;
- applicable accepted decisions and their target lifetimes;
- unresolved Commitment liabilities or excluded unsupported families;
- general eligibility policies applied;
- range clipping/coverage limits;
- authoritative input fingerprints or revision/incarnation set;
- Capacity derivation policy/version.

The primary Capacity payload need not duplicate every source object. It needs stable dependency/exclusion references sufficient to resolve an explanation against the same authoritative snapshot, plus frozen minimal facts wherever historical explanation must survive source changes.

Source incarnation is necessary but insufficient alone: it protects lifetime identity, while a dependency fingerprint must also capture mutable values within the same lifetime. Provenance must record transformation rules, not only inputs.

## 14. Capacity → Goal Demand → Allocation → Proposal Boundary

The downstream handoff is:

```text
Authoritative Commitments, constraints, decisions, and temporal policy
  → resolved commitment plan / explicit unresolved liabilities
  → Capacity derivation
  → Capacity intervals + coverage + provenance
  → Goal-demand feasibility
  → allocation among compatible demands
  → constructive Proposal
  → user decision
```

Capacity must expose exact user-day intervals, duration/contiguity, range coverage, general eligibility qualifications, unresolved liabilities, dependency identity, staleness, and derivation provenance. This lets later layers consume a stable semantic contract instead of calling private placement helpers or reinterpreting Work and buffers.

Capacity must not decide Goal deservingness, priority, effort, share, preferred action, Proposal winner, or acceptance. Goal demand may request duration, contiguity, recurrence, time-of-day, or other compatibility constraints later; allocation compares feasible demand; Proposal turns an allocation into an explainable recommendation.

No downstream layer may mutate Capacity. It may reference an interval, return compatibility, allocate part of it provisionally, or explain why a demand is infeasible.

## 15. Capacity vs Friction Boundary

Capacity is descriptive. Friction is a diagnosis that an authoritative or attempted plan requires attention or recovery.

- Insufficient Capacity is not automatically Friction. It may simply be a resource fact.
- Goal demand exceeding Capacity before allocation/acceptance is not Friction; it is unmet or infeasible demand.
- Fragmentation is Capacity information, not itself Friction.
- An unplaced authored Commitment remains Friction or unresolved planning liability because authored time-owning intent could not be satisfied.
- An unaccepted Proposal that exceeds Capacity is an invalid/infeasible Proposal candidate, not user Friction.
- An accepted allocation or existing schedule made infeasible by changed authority may produce Friction.
- Unresolved conflicts affect Capacity derivation: affected coverage must be qualified or unavailable rather than counted optimistically.
- Capacity itself should never represent failure; its result envelope may report unavailable, partial, stale, protected, or unresolved derivation.

Current Friction types confirm the corrective trigger is conflict, unplaced, or work-required skip (`code/src/core/friction/types.ts`, lines 39–65). That machinery must remain downstream from or adjacent to Capacity, not become the Capacity model.

## 16. Capacity and Historical/Summary Semantics

Current Capacity is derived and need not be durably stored. Historical values have legitimate analytical value only when tied to an authoritative planning event:

- Capacity available when a Proposal was generated;
- Capacity context referenced by an accepted allocation;
- Capacity allocated and left unallocated at acceptance/publication;
- later execution relative to the accepted allocation;
- trends computed from comparable historical snapshots.

Recommendation:

- Do not attempt indefinite reconstruction from current authored state; source changes make it epistemically unsafe.
- Do not snapshot every Capacity read or UI render.
- Selectively freeze a minimal Capacity-context snapshot when a future Proposal is accepted or when a published historical plan must explain allocation authority.
- Historical snapshots are immutable evidence of the then-current derivation, not current Capacity.
- Summary may later derive trends from these snapshots, clearly separating available, allocated, unallocated, scheduled, and executed quantities.

This preserves provenance without giving old Capacity equal prominence or authority in current planning.

## 17. Existing Primitive Reuse Assessment

| Primitive | Current Purpose | Reuse Classification | Capacity Role | Risk / Limitation | Evidence |
|---|---|---|---|---|---|
| User-day calculation | Map instants to custom days | Directly Reusable | Temporal ownership | Base helper assumes one boundary; canonical window resolver needed for transitions | `userDay.ts:35–72` |
| Effective schedule preferences | Segment-aware boundary/week | Directly Reusable | Resolve each user-day context | Noon lookup is an established convention to preserve | `resolveEffectiveSchedulePreferences.ts` |
| Canonical user-day window | Variable-duration user-day | Directly Reusable | Exact Capacity envelope | Must expose coverage identity | preview pipeline |
| Planning-window expansion | Include spillover dependencies | Reusable with Adaptation | Derivation lookaround | Expansion is scheduler-specific and must not leak as reported Capacity | `generateSchedulePreview.ts:68–101,383+` |
| Occupied-window calculation | Candidate placement collision geometry | Reusable with Adaptation | Build exclusions | Private, candidate-scoped, loses provenance, does not union explicitly | `placeBlockCandidates.ts:677–715` |
| Open-window complement | Find candidate openings | Reusable with Adaptation | Core interval complement | Private and search-window-specific; returns no identity/provenance | lines 621–664 |
| Buffer expansion | Protect spacing | Reusable with Adaptation | General exclusions | Must distinguish occupied vs protected and union contributors | lines 677–715 |
| Candidate feasibility | Choose one placement | Not Suitable as Capacity model | Downstream feasibility reference | Demand-specific and collapses interval set to one start/null | lines 561–619 |
| Recurrence expansion | Create authored occurrences | Directly Reusable | Commitment demand inputs | Requires complete supported-family coverage | `generateBlockCandidates.ts` |
| Work generation | Expand shift authority | Directly Reusable | Occupied-time inputs | Preserve overnight/cycle provenance | `generateCycleWorkBlocks.ts` |
| Manual-event representation | Direct calendar obligations | Directly Reusable | Occupied-time inputs | All-day events need variable user-day windows | preview lines 254+ |
| Scheduling preferences | Placement desirability/boundaries | Reusable with Adaptation | General policy inputs where applicable | Must distinguish preference from mandatory Capacity exclusion | block types |
| PlanDecision replay | Apply accepted occurrence authority | Directly Reusable | Resolve current planning facts | Template-focused applicability and window scope | `replayPlanDecisions.ts` |
| Preview staleness | Invalidate derived schedule | Reusable with Adaptation | Lifecycle precedent | Boolean is insufficient for dependency/explanation contract | `dayFrameStore.ts:3259–3267` |
| Source incarnation | Protect source lifetimes | Directly Reusable | Dependency identity | Does not fingerprint same-lifetime edits | `sourceIncarnation.ts` |
| Historical publication | Freeze plan context | Reusable with Adaptation | Selective historical Capacity provenance | Current publication assumes generated schedule, not future Proposal acceptance | `materializePlanPublication.ts` |

## 18. Worked Semantic Examples

### Example 1 — Ordinary workday

User-day: 03:00 Tuesday–03:00 Wednesday. Work occupies 08:00–16:00; Sleep occupies 22:30–06:30 across the boundary; a fixed appointment occupies 17:00–18:00. After applicable buffers and resolved commitments, Capacity consists of exact remaining eligible intervals, for example 06:30–08:00, 16:00–17:00, and 18:00–22:30. Total duration may be shown, but the three intervals remain canonical. Capacity does not choose which Goal receives them.

### Example 2 — Off-day policy

No Work occurs Saturday. Under an explicitly selected Preserve Routine policy, Sleep and routine-related constraints retain ordinary timing, producing bounded daytime Capacity. Under Adapt to Off Days, those constraints may resolve differently and produce different intervals. Absence of Work alone creates geometric openings; authored policy determines which are general Capacity. Without selected policy, the result must declare the unresolved policy dependency rather than invent a preferred lifestyle.

### Example 3 — Overnight shift and user-day correctness

Boundary: 03:00. Monday's Work begins Monday 22:00 and ends Tuesday 06:00. Calendar-date subtraction might count Tuesday 03:00–06:00 as Tuesday morning occupancy and Monday as ending at midnight, splitting one planning reality. DayFrame correctly assigns the overnight occurrence and related exclusions to the canonical Monday user-day window. Monday Capacity is derived across 03:00 Monday–03:00 Tuesday with spillover handled by canonical window rules; any interval after 03:00 Tuesday belongs to Tuesday's user-day. Naïve date totals would therefore be wrong.

### Example 4 — Fragmented availability and Goal incompatibility

Capacity intervals are 09:00–09:30, 10:30–11:00, and 13:00–13:30. Total Capacity is 90 minutes, opening count is three, and longest contiguous duration is 30 minutes. A Goal demand requiring 45 contiguous minutes is infeasible. General Capacity still exists; the Goal cannot use it under that demand. No Friction exists merely because the demand is infeasible before allocation.

### Example 5 — Buffered Commitments

Commitment A ends 10:00 with a 30-minute after-buffer. Commitment B begins 14:00 with a 30-minute before-buffer. Chronological free time is four hours. The eligible Capacity interval is at most 10:30–13:30, or three hours, assuming no unresolved liabilities or other policy exclusions. The missing hour is protective exclusion, not occupied activity, and provenance must say so.

### Example 6 — Unplaced authored Commitment

A two-hour movable Commitment cannot be placed, while the raw day still contains several small openings totaling three hours. Those minutes must not be advertised as fully allocatable Capacity: the user has already authorized two hours of time-owning intent that remains unresolved. The result should be qualified or unavailable for affected coverage and reference that liability. Treating all three hours as Capacity would double-claim the day.

## 19. Invariant Evaluation

| Invariant | Decision | Reasoning | Evidence |
|---|---|---|---|
| CAP-INV-01 Capacity is derived | Affirm | Required by authored/derived separation | Architecture spec lines 508–514 |
| CAP-INV-02 Commitments and constraints shape Capacity | Refine | Only time-owning commitments and universally applicable constraints shape general Capacity; demand-specific constraints shape feasibility | Dogfood PM-02; placement code |
| CAP-INV-03 Not chronological free time | Affirm | Buffers, unresolved demand, policy, and topology matter | buffer/open-window implementation |
| CAP-INV-04 Not candidate-specific openings | Affirm | Candidate search already embeds demand and returns one placement | `findBestAvailableStart` |
| CAP-INV-05 Goals do not create Capacity | Affirm | Goals express outcomes and are absent from scheduling inputs | Goal model/preview API |
| CAP-INV-06 Capacity does not choose Goals | Affirm | Selection is allocation responsibility | approved lifecycle |
| CAP-INV-07 Capacity may exist when a Goal cannot use it | Affirm | Demand compatibility is downstream | semantic example 4 |
| CAP-INV-08 Respects user-day semantics | Refine | Each interval belongs to one exact effective canonical user-day window, including transitions | user-day and transition tests |
| CAP-INV-09 Deterministic for same inputs | Affirm | Required for reproducibility | architecture spec lines 179–185 |
| CAP-INV-10 Explainable from inputs | Affirm | Core epistemic requirement | architecture spec lines 207–218 |
| CAP-INV-11 Authority changes invalidate affected results | Refine | Invalidation is dependency- and range-scoped, including policy/version | Preview-staleness precedent |
| CAP-INV-12 Distinct from Proposal | Affirm | Resource description must not recommend or authorize | Dogfood PM-01 |
| CAP-INV-13 Distinct from Friction | Affirm | Resource fact differs from corrective diagnosis | Friction types |

## 20. Architecture Decisions

| Decision | Recommendation | Principal Reason | Remaining Question |
|---|---|---|---|
| AD-CAP-01 | Derived eligible user-day interval set | Prevents “free minutes” conflation | Exact supported input families for V1 |
| AD-CAP-02 | Layer free time → openings → Capacity → feasibility | Separates geometry from policy and demand | Names in public vocabulary |
| AD-CAP-03 | General Capacity is demand-neutral | Goals must not redefine shared resource truth | Future demand contract |
| AD-CAP-04 | Interval + user-day canonical; ranges aggregate | Preserves overnight and fragmentation truth | Default query horizon |
| AD-CAP-05 | Derived current model plus selective historical snapshots | Preserves authority and historical explanation | Snapshot trigger details |
| AD-CAP-06 | Dependency and transformation provenance required | Capacity must be explainable | Minimal fingerprint encoding |
| AD-CAP-07 | Dependency-scoped invalidation | Avoids stale derived truth | Cache invalidation implementation |
| AD-CAP-08 | Expose intervals, coverage, qualifications, provenance | Prevents downstream scheduler reinterpretation | Compatibility vocabulary |
| AD-CAP-09 | Capacity fact becomes Friction only after authoritative/attempted obligation conflict | Preserves descriptive/corrective boundary | Accepted-allocation transition |
| AD-CAP-10 | Snapshot only decision-relevant historical context | Avoids derived-state authority | Retention granularity |

### AD-CAP-01 — Capacity Definition

- **Recommendation:** Adopt the definition in section 3.
- **Evidence / Reasoning:** Approved architecture calls Capacity derived opportunity after Commitments; implementation proves totals alone lose geometry.
- **Alternatives Considered:** Blank calendar time (too broad); candidate openings (demand-specific); persisted budget (wrong authority).
- **Consequences:** V1 needs interval, coverage, qualification, and provenance semantics.
- **Unresolved Questions:** Which existing source families are supported in the first formal specification?

### AD-CAP-02 — Free-Time Boundary

- **Recommendation:** Preserve a layered derivation: chronological free time → geometric openings → general Capacity; apply demand constraints afterward to produce feasible opportunities.
- **Evidence / Reasoning:** Current open-window helper combines geometry and candidate constraints, demonstrating why the layers must be separated.
- **Alternatives Considered:** One universal “availability” concept (epistemically ambiguous); separate persisted objects for every stage (unnecessary authority).
- **Consequences:** Internal algorithms may fuse passes, but observable semantics and provenance must preserve the layers.
- **Unresolved Questions:** Whether “geometric opening” is public or internal terminology.

### AD-CAP-03 — Goal Boundary

- **Recommendation:** Make general Capacity demand-neutral; Goal-specific feasibility is a pure downstream evaluation.
- **Evidence / Reasoning:** Goals currently do not own time; one interval may satisfy one demand but not another.
- **Alternatives Considered:** Goal-labelled Capacity (conflates resource and demand); recompute Capacity per Goal (destroys shared truth).
- **Consequences:** Goal demand must consume rather than redefine Capacity.
- **Unresolved Questions:** Future Goal-demand dimensions.

### AD-CAP-04 — Temporal Scope

- **Recommendation:** Canonical Capacity units are intervals owned by exact user-day windows. User-day is the primary result; weeks and arbitrary ranges are aggregates.
- **Evidence / Reasoning:** DayFrame supports pre-boundary time, overnight Work, and variable boundary transitions.
- **Alternatives Considered:** Calendar-date buckets (incorrect); scalar weekly budgets (lose topology).
- **Consequences:** Aggregation may sum but must retain interval/user-day drill-down and partial coverage.
- **Unresolved Questions:** Default presentation horizon, not architecture.

### AD-CAP-05 — Authority Model

- **Recommendation:** Option C: pure derived current Capacity with selective immutable historical context snapshots.
- **Evidence / Reasoning:** Derived objects are disposable; historical explanation cannot safely rely on mutable current authority.
- **Alternatives Considered:** Option A alone (insufficient historical explanation); Option B (creates stale competing authority).
- **Consequences:** No Capacity CRUD or backup authority; future historical schemas may include bounded context.
- **Unresolved Questions:** Exact snapshot host and versioning belong with Proposal/accepted allocation design.

### AD-CAP-06 — Provenance Requirement

- **Recommendation:** Require range/user-day context, source dependencies, occupied/protected exclusions, decisions, unresolved liabilities, policy/version, and an authoritative-input fingerprint.
- **Evidence / Reasoning:** Source incarnation protects lifetime but not same-lifetime edits; derivation must be reproducible and explainable.
- **Alternatives Considered:** Totals only (unexplainable); full source duplication (excessive for current reads).
- **Consequences:** Capacity queries need a compositional dependency snapshot.
- **Unresolved Questions:** Canonical fingerprint encoding.

### AD-CAP-07 — Staleness Boundary

- **Recommendation:** Invalidate only ranges whose dependency fingerprint changes; expose stale/protected/unresolved status explicitly.
- **Evidence / Reasoning:** Current Preview boolean staleness works as workflow protection but lacks range/dependency precision.
- **Alternatives Considered:** Global invalidation (safe but coarse); silent recomputation without identity (hard to coordinate).
- **Consequences:** Caches are optional; semantic freshness is mandatory.
- **Unresolved Questions:** Cache strategy is implementation work.

### AD-CAP-08 — Downstream Handoff

- **Recommendation:** Expose exact intervals, duration/contiguity summaries, coverage and qualifications, user-day context, dependency identity, and provenance—never Goal rankings or recommended work.
- **Evidence / Reasoning:** These fields let downstream layers evaluate demand without reading scheduler internals.
- **Alternatives Considered:** Scalar minutes (insufficient); raw authored setup (leaks responsibility); candidate placements (already demand-specific).
- **Consequences:** Allocation and Proposal remain independently testable.
- **Unresolved Questions:** Future compatibility predicates belong to Goal demand.

### AD-CAP-09 — Friction Boundary

- **Recommendation:** Resource scarcity or fragmentation is not Friction by itself. Friction begins when authored/accepted intent or an attempted authoritative plan cannot coexist.
- **Evidence / Reasoning:** Current Friction is conflict/unplaced driven; pre-allocation demand remains advisory.
- **Alternatives Considered:** Treat all unmet demand as Friction (creates alarm before authority); encode failure in Capacity (conflates domains).
- **Consequences:** Feasibility may return “no match” without creating a FrictionPoint.
- **Unresolved Questions:** Exact moment an accepted future allocation becomes plan authority.

### AD-CAP-10 — Historical Boundary

- **Recommendation:** Preserve bounded Capacity context only when needed to explain an accepted allocation or published plan; do not store every derived read.
- **Evidence / Reasoning:** Immutable history and later source changes make selective snapshots valuable; persistent current Capacity is unnecessary.
- **Alternatives Considered:** Reconstruct all history (unsafe); snapshot every query (noise and storage authority confusion); retain none (weak explanation).
- **Consequences:** Summary can later analyze comparable snapshots without rewriting history.
- **Unresolved Questions:** Retention scope and schema await accepted-allocation architecture.

## 21. Boundary Matrix

| Concept | Owns Time? | Derived from Schedule State? | Describes Resource? | Expresses Demand? | Makes Recommendation? | Requires User Authority? |
|---|---:|---:|---:|---:|---:|---:|
| Commitment | Yes | Occurrences are derived | No | Yes, as obligation | No | Yes, when authored |
| Chronological Free Time | No | Yes | Raw clock remainder | No | No | No |
| Geometric Opening | No | Yes | Geometric interval | No | No | No |
| Capacity | No | Yes | Yes | No | No | No; policy inputs do |
| Goal | No | No | No | Outcome intent, not time demand by itself | No | Yes, when authored |
| Goal Demand | No until accepted allocation | May use context | No | Yes | No | Authored/approved demand contract |
| Allocation | Provisionally reserves resource | Uses Capacity | Assigns resource | Resolves competing demand | No | Not authoritative until accepted |
| Proposal | No | Yes | References resource | Represents proposed satisfaction | Yes | Yes before becoming intent |
| Friction | No | Yes | No | No | Recommends recovery actions | Yes for corrective change |

Capacity has not absorbed Goal demand, allocation, Proposal, or Friction responsibilities.

## 22. Test Coverage Assessment

Focused validation executed:

```text
npm test -- --run
  src/core/time/__tests__/userDay.test.ts
  src/core/blocks/tests/placeBlockCandidates.test.ts
  src/core/cycles/__tests__/generateCycleWorkBlocks.test.ts
  src/core/engine/tests/generateSchedulePreview.test.ts
  src/core/engine/tests/sourceIncarnationNonInterference.test.ts
  src/core/decisions/replayPlanDecisions.test.ts
  src/state/sourceIncarnationLifecycle.test.ts
  src/state/tests/dayFrameStore.test.ts
```

Result: **8 test files passed; 234 tests passed; 0 failed.**

Well-covered prerequisites:

- custom user-day boundaries and pre-boundary ownership;
- overnight Work and placement;
- variable 21/27-hour boundary transitions;
- fixed/flexible placement, occupied windows, buffers, preferred/custom windows, and work-relative placement;
- recurrence and off-day generation behavior;
- Work generation and manual-event inclusion;
- PlanDecision applicability, exact-placement blocking, staleness, and replay;
- Preview staleness after authored setup changes;
- source-incarnation lifecycle and scheduling non-interference.

Weakly covered prerequisites:

- occupied/open-window helpers are private and tested through placement outcomes rather than as provenance-preserving interval operations;
- no direct contract test covers unioned overlapping buffers with contributor attribution;
- unresolved Commitment liability is represented as unplaced output, but no Capacity consumer tests its downstream meaning;
- range-scoped dependency fingerprints do not exist.

Necessarily untested because Capacity does not exist:

- Capacity interval identity and aggregation;
- coverage/qualification states;
- demand-neutral eligibility;
- Capacity provenance and derivation version;
- selective historical snapshots;
- General Capacity versus Goal-specific feasibility.

No existing test is directly incompatible with the recommended architecture. Tests that encode candidate-specific placement must not be reinterpreted as Capacity tests. Off-day fallback tests describe current placement behavior, not approved general Capacity policy.

## 23. Implementation Constraints

Any later specification or implementation must preserve:

1. identical authoritative inputs and derivation version produce identical Capacity;
2. Capacity remains derived, disposable, and separate from authored authority;
3. every interval belongs to one exact effective user-day window;
4. overnight and variable-duration user-days remain first-class;
5. stale source lifetimes cannot inherit old decisions or provenance;
6. applicable accepted decisions affect the resolved planning facts;
7. facts, derivations, recommendations, and acceptance remain distinguishable;
8. Goal existence does not occupy time;
9. Capacity cannot silently become scheduled discretionary work;
10. Capacity conditions do not automatically become Friction;
11. historical snapshots are immutable and never redefine current Capacity;
12. every result remains explainable from authoritative dependencies;
13. unplaced time-owning Commitments cannot be counted optimistically as allocatable Capacity;
14. scalar aggregation cannot discard interval fragmentation or coverage qualification;
15. private candidate-placement helpers cannot become public Capacity semantics without adaptation.

## 24. Open Questions

Only downstream or specification-detail questions remain:

1. Which current source families form the formally supported Commitment input set for Capacity V1?
2. What exact result-state vocabulary should represent available, partial, protected, stale, and unresolved coverage?
3. Should unresolved Commitment liabilities make an entire user-day unavailable or permit explicitly conservative partial Capacity?
4. What canonical fingerprint format identifies the composed authoritative input snapshot?
5. Which general eligibility policies, if any beyond mandatory constraints, enter Capacity V1?
6. What public terminology should be used for geometric openings and feasible opportunities?
7. What Goal-demand dimensions will later consume Capacity?
8. At what future acceptance event should Capacity context be frozen historically?
9. What minimum historical context supports explanation without duplicating full authored authority?
10. How should Daylight Saving Time transitions be represented alongside already supported variable user-day boundaries?

These do not require an executable prototype before the semantic architecture is specified.

## 25. Audit Conclusions

Capacity is not a number left after subtracting appointments from a day. It is a derived, demand-neutral interval resource with canonical user-day ownership, explicit coverage, universal eligibility, unresolved-liability handling, dependency identity, and provenance.

Current DayFrame already supplies strong primitives for temporal windows, Work and recurrence expansion, manual occupied time, buffers, candidate placement, PlanDecision replay, staleness, source lifetimes, and historical publication. These primitives explain the C3 classification but do not collectively constitute Capacity: they are candidate-specific, private, provenance-lossy, or tied to generated Preview behavior.

The recommended architecture preserves the intended lifecycle:

```text
Commitments + mandatory constraints + accepted decisions
  → resolved planning facts / explicit liabilities
  → demand-neutral Capacity
  → Goal-specific feasibility
  → allocation
  → Proposal
  → user authority
```

No conflict with approved DayFrame architecture was found. The audit refines the broad phrase “available planning opportunity” into a contract that remains deterministic, explainable, overnight-correct, non-authoritative, and distinct from downstream planning decisions.

## 26. Recommended Next Step

**Path A — Capacity Architecture Specification.**

Capacity semantics, authority, provenance, canonical temporal scope, staleness, downstream handoff, Friction boundary, historical role, and primitive-reuse boundaries are sufficiently resolved for formal specification.

Path B is unnecessary because the focused tests and code traces establish the behavior and limitations of the relevant primitives. Path C is premature as the immediate artifact should formalize the resource contract Goal demand will consume. Path D is unnecessary because the recommendation aligns with the approved derived-object, user-authority, provenance, and user-day architecture.

The specification should resolve the remaining contract-detail questions in section 24 without implementing Capacity or beginning Goal-demand design. No implementation phase is assigned.

## 27. Completion Statement

> **Capacity Semantic and Read-Model Architecture Audit complete.**
>
> The report establishes DayFrame's Capacity semantics, distinguishes Capacity from chronological free time, geometric openings, Goal-specific feasibility, Proposal, and Friction, defines the required authority, provenance, temporal, and read-model boundaries, evaluates existing implementation primitives for reuse, and identifies the appropriate next architectural step without modifying the implementation.
