# Goal Demand and Allocation Architecture Audit Result

## 1. Executive Findings

The current executable product implements Goals as independent, durable authored outcome records with lifecycle, measurement, exact Commitment links, and frozen historical provenance. It does **not** implement Goal Demand, Goal priority, Goal-specific Capacity feasibility, allocation among competing Goals, constructive Proposal, or Accepted Allocation.

Primary implementation classifications:

- **Goal Demand: GD5 — Not Implemented.** No Goal-owned resource request or scheduling effect exists.
- **Goal-Specific Feasibility: GF4 — Reusable Placement Primitives Only.** Duration/window/fit primitives exist but are coupled to Commitment candidates and mutate the planning outcome by selecting placement.
- **Allocation: AL4 — Analogous Commitment-Ordering Primitives Only.** Priority sorting and first-fit placement allocate temporal positions to already-authorized Commitments, not Capacity among Goal demands.
- **Accepted Allocation: AA4 — Conceptually Related Infrastructure Only.** PlanDecision supplies durable occurrence-level acceptance, provenance, lifetime safety, replay, and staleness, but cannot represent demand, Capacity assignment, competing context, rejection, or recurring allocation authority.

The exact current flow is:

```text
Goal → manual source link → independently authored Commitment/event
     → candidate/occurrence → automatic placement → generated Preview
     → historical plan with frozen Goal provenance → execution evidence
     → independently reported measurement Progress
```

The intended constructive flow first breaks immediately after Goal outcome intent: there is no distinct, authorized Goal Demand describing what resource the Goal requests from Capacity.

Recommended architecture:

- Goal and Goal Demand remain separate.
- Use **authored planning intent plus a deterministic derived demand projection**, with field-level provenance for any mixed inputs.
- Goal-specific feasibility evaluates demand against immutable Capacity without allocation.
- Allocation is deterministic, provisional assignment reasoning over compatible Capacity; it is neither user authority nor scheduled work.
- Proposal is the explicit constructive presentation boundary.
- Accepted Allocation is a distinct authority transition; only then may Goal-driven discretionary work become time-owning.

**Recommended next step: Path B — Goal Demand and Allocation Architecture Specification.** Both domains are sufficiently bounded and must be specified together to prevent resource-request semantics, competition policy, and provisional assignment from leaking into Goal, Capacity, or Proposal.

## 2. Architectural Context

The committed Capacity specification defines Capacity as demand-neutral derived resource and requires this chain:

```text
Capacity → Goal-Specific Feasibility → Competing Demand
         → Allocation Reasoning → Proposal → User Decision
```

The audit preserves:

- Commitments own time; Goals express outcomes.
- Capacity describes resource; Goal Demand requests resource.
- Feasibility tests compatibility; Allocation assigns provisionally.
- Proposal recommends; explicit user acceptance authorizes.
- Friction is corrective only after authored/accepted intent is infeasible.
- Progress, planned effort, scheduled effort, and execution are distinct.

Current implementation is evidence, not permission to collapse these categories.

## 3. Evidence and Authority Model

**Intended Truth:** `CAPACITY_ARCHITECTURE_SPECIFICATION_RESULT.md`, the complete architecture specification, ADR-2.40, and Dogfood Pass 01 establish user authority, derived-resource semantics, constructive Proposal, corrective Friction, and provenance requirements.

**Implemented Truth:** Production code and focused tests establish current Goal, placement, PlanDecision, history, and Progress behavior.

**Experienced Truth:** Dogfood showed Goals could be authored and linked, but scheduling remained user-driven; no meaningful Capacity/constructive Proposal allocation flow appeared.

Implementation findings use:

- **Confirmed:** executable path or deterministic tests;
- **Inferred:** strongly implied but not fully executed;
- **Not Found:** targeted semantic search found no capability.

No evidence contradicts the preceding Capacity or Capacity/Proposal audits.

## 4. Goal Domain Inventory

| Goal Capability | Current Primitive | Authority Type | Persisted? | Scheduling Effect? | Evidence | Classification |
|---|---|---|---:|---:|---|---|
| Identity/version/revision | `GoalV1` | Authored | Yes | No | `core/goals/goal.ts:4–37` | Confirmed |
| Title/description | `GoalV1` | Authored | Yes | No | `goal.ts:22–35` | Confirmed |
| Active/completed/archived lifecycle | `GoalStatus`, commands | Authored | Yes | No | `state/goalSurface.ts:169–187` | Confirmed |
| Target date | `targetDate` | Authored fact | Yes | No | `goal.ts:33` | Confirmed |
| Measurement reference | `measurementPolicy` compatibility field | Authored metadata | Yes | No | `goal.ts:34` | Confirmed |
| Current measurement definitions | Definition authority | Authored | Yes | No | `measurementDefinitionSurface.ts` | Confirmed |
| Progress observations | Observation authority | Recorded evidence | Yes | No | `progressObservationSurface.ts` | Confirmed |
| Derived Progress | Manual quantity projection | Derived | No | No | `core/progress/manualQuantityProgress.ts:131–255` | Confirmed |
| Commitment links | `GoalCommitmentLinkV1` | Authored relationship | Yes | No | `goal.ts:8–20`; `goalSurface.ts:189–219` | Confirmed |
| Link lifetime safety | `incarnationId` | Authority metadata | Yes | No | link validation/tests | Confirmed |
| Historical Goal provenance | occurrence `goals` snapshot | Historical plan provenance | Yes | No current placement effect | `materializePlanPublication.ts:139–181` | Confirmed |
| Summary/Goal Activity | Historical derived queries | Derived | No | No | historical intelligence | Confirmed |
| Goal priority | None | — | No | No | broad search | Not Found |
| Effort/resource request | None | — | No | No | broad search | Not Found |
| Cadence/session/timing demand | None | — | No | No | broad search | Not Found |

Current executable meaning: a Goal is an authored desired outcome and context for links, measurement, Progress, and historical interpretation. It is scheduling-independent.

## 5. Current Goal-to-Schedule Flow

```text
User creates Goal
  → user links exact current source lifetime
  → source independently owns scheduling intent
  → recurrence/Work/manual-event occurrence is generated
  → scheduler places Commitment candidate without Goal input
  → fresh historical publication matches link to durable reference
  → frozen Goal ID/revision/title/status/policy is stored
  → execution outcome may reference the frozen occurrence
  → Progress remains based on separate measurement observations
```

At each transition:

- Goal creates time demand: **No**.
- Goal references independently authored time: **Yes**.
- Goal annotates history: **Yes**.
- Goal affects placement, priority, duration, recurrence, or Friction: **No**.
- Goal affects execution attribution: **Indirectly through frozen provenance**, not execution semantics.
- Goal affects Progress: identity/context only; observations and definitions supply measurement evidence.

This is Goal-linked Commitment scheduling, not Goal Demand.

## 6. Goal Demand Search

Production searches covered desired/target minutes, effort, session duration, cadence, frequency, splittability, urgency, time-to-target, allocation, requested sessions, Goal weight/priority, Capacity share, and resource request.

| Candidate Primitive | Goal-Owned? | Demand Semantics? | Scheduling Effect? | Authority | Evidence | Classification |
|---|---:|---:|---:|---|---|---|
| Goal target date | Yes | No; deadline fact only | No | Authored | `GoalV1.targetDate` | Confirmed metadata |
| Measurement target value | Yes through definition | Outcome target, not time demand | No | Authored definition | manual quantity policy | Confirmed non-demand |
| Progress percentage/comparison | Goal-related | No; retrospective derived state | No | Derived | `manualQuantityProgress.ts` | Confirmed non-demand |
| Goal link | Yes | No; provenance relationship | No | Authored | `GoalCommitmentLinkV1` | Confirmed non-demand |
| Block duration/frequency | No; Commitment-owned | Time demand for Commitment | Yes | Authored template/recurrence | block types | Analogous only |
| Block preferred window | No | Commitment placement preference | Yes | Authored | block types | Analogous only |
| Block priority | No | Commitment ordering | Yes | Authored | `PriorityLevel` | Analogous only |
| PlanDecision | No Goal binding | Accepted occurrence override | Yes on replay | Accepted authority | `planDecision.ts` | Related authority only |
| “allocationFailure” | No | Technical ID allocation | No planning meaning | Infrastructure | search results | False positive |
| Goal effort/cadence/priority/request | — | — | — | — | targeted search | Not Found |

## 7. Goal Demand Semantic Boundary

Goal Demand is the explicit planning-resource request made in service of one Goal. It remains non-time-owning and unscheduled until user authority accepts an allocation or creates reusable scheduling intent.

| Candidate Dimension | Recommended Architectural Owner | Why | Current Evidence | Open Question |
|---|---|---|---|---|
| Requested total effort in horizon | Core Goal Demand | Defines amount requested | Not Found | Units/time horizon |
| Minimum useful session | Core Goal Demand | Determines feasibility | Commitment duration analogous | Exact lower-bound semantics |
| Preferred session duration | Goal Preference | Desirability, not minimum | Preferred windows analogous | Ranking role |
| Maximum session duration | Optional Goal Demand | Bounds partitioning | Not Found | Required by which demand types |
| Contiguity | Core Goal Demand | Prevents summing fragments incorrectly | Placement fit analogous | Default behavior |
| Splittability | Core Goal Demand | Governs partitioning | Not Found | Allowed partition rules |
| Cadence/frequency | Optional Goal Demand | Distributes request across horizon | Recurrence analogous | Demand vs reusable intent |
| Target-date pressure | Derived demand input | May inform projection/explanation | Target date exists, no scheduling effect | Policy required |
| Earliest/latest useful timing | Optional Goal Demand | Defines compatibility | Custom windows analogous | User-day representation |
| Time-of-day | Goal Preference unless mandatory | Desirability differs from feasibility | Commitment preferred windows | Hard vs soft expression |
| User-day/workday/off-day compatibility | Optional demand/preference | Demand-specific eligibility | Work-relative placement analogous | Policy vocabulary |
| Work-relative timing | Goal Preference or explicit demand constraint | Depends on intended hardness | Current Commitment rules | Valid off-day behavior |
| Minimum/maximum allocation | Allocation Policy | Governs partial satisfaction | Not Found | User/system ownership |
| Optional vs required demand | Core Goal Demand | Defines unmet-demand interpretation | Not Found | Required does not imply time ownership |
| Completion/Progress relationship | Derived demand projection input | Outcome state may reduce request | Progress exists separately | Explicit policy/consent |
| Goal importance | Goal Priority | Competition value | Not Found | Priority scale/authority |
| Exact proposed sessions | Proposal Concern | Recommends concrete use | Preview places commitments only | Proposal design |

Goal Demand must not become a container for ranking, Proposal copy, acceptance, execution, or generic scheduler state.

## 8. Goal vs Goal Demand

The concepts must remain distinct:

> **Goal describes the outcome the user wants. Goal Demand describes planning resources requested in service of that outcome.**

Consequences:

- An active Goal may have no active demand and consumes no Capacity.
- A Goal may have multiple demand patterns for distinct horizons, modes, or purposes.
- Demand may be revised, suspended, expire, or be replaced without changing Goal identity.
- Goal archival/completion affects demand applicability through explicit policy; it does not rewrite historical demand.
- Derived demand projection may be regenerated from authored demand intent, but may not invent intent from Goal title, target date, or Progress alone.
- Historical demand identity/provenance must survive changes to the current Goal and current demand.

One Goal MUST NOT be constrained to one lifetime demand object by architecture.

## 9. Goal Demand Authority and Provenance

Recommended authority model: **Model C — Authored Intent + Derived Demand Projection**, with Model D-style field-level provenance where explicit derived signals contribute.

Fully derived demand from sparse Goal metadata is unsafe. Fully authored concrete occurrences would force users to perform allocation manually and collapse Goal Demand toward Commitment authoring.

| Demand Fact | May Be Authored? | May Be Derived? | Requires Explicit User Authority Before Allocation? | Required Provenance |
|---|---:|---:|---:|---|
| Goal association | Yes | No | Yes | Goal/demand identities and revisions |
| Requested effort/horizon | Yes | Projection may normalize units | Yes | Authored value + transform |
| Minimum useful duration | Yes | Default may be proposed, not assumed authoritative | Yes | Source/default and acceptance |
| Splittability | Yes | No silent inference | Yes | Authored policy |
| Cadence/timing constraints | Yes | Concrete dates may be projected | Yes | Intent + calendar/user-day transform |
| Target date | Already authored on Goal | Pressure may be derived | Derived pressure remains advisory | Goal revision + policy version |
| Progress/remaining outcome | Observation authored; comparison derived | Yes | Cannot alone authorize time | Definition/observation/cutoff |
| Historical execution tendency | Historical evidence | Learned preference may be derived | Yes before reusable authority | Evidence range/model/policy |
| Goal priority | Yes | Heuristic rank may be derived separately | Authored priority required for authority | Source and version |
| Concrete demand projection | No | Yes | Projection may enter allocation; Proposal still requires acceptance | Demand dependencies/policy |

DayFrame may derive implications from facts, but may not infer how much time a Goal “deserves” as authority. Derived urgency and learned preference may inform explainable allocation/Proposal reasoning only.

## 10. Goal Priority

| Priority Concept | Exists? | Current Owner | Authority | Scheduling Effect | Suitable for Goal Allocation? | Evidence |
|---|---:|---|---|---|---:|---|
| Commitment priority | Yes | BlockTemplate/Candidate | Authored | Orders candidate placement | No direct reuse | `blocks/types.ts`; placement sort |
| Goal priority | No | None | — | None | Future explicit input | Targeted search |
| Decision/preference priority | Partial | PlanDecision outranks heuristic | Accepted/user authority | Overrides occurrence behavior | Only authority-order precedent | ADR-2.40/replay |
| Engine heuristic weight | Partial | Candidate sort rules | Derived policy | Tie/order behavior | Adaptation only | `compareBlockCandidates` |

Current Commitment priority is not a proxy for Goal importance. A linked Commitment retains its own protection/order even if Goal priority later differs. Goal priority belongs to competing discretionary demand; Commitment priority governs already-authorized obligations.

## 11. Target Date, Progress, and Urgency

**Confirmed:** Goal target date is stored and presented as context. It is absent from preview/candidate/placement inputs.

**Confirmed:** Progress uses measurement-definition and observation authority with an explicit evaluation cutoff. It derives quantity, ratio, percentage, and comparison but no urgency, remaining time demand, pace, or scheduling pressure.

**Not Found:** Any executable urgency, remaining-effort, required-pace, recommended-frequency, or scheduling-priority derivation.

Architectural roles:

- target date: authored Goal fact;
- Progress: derived Goal state from recorded observations;
- urgency/pace: possible versioned derived signal;
- demand projection: may consume an explicitly authorized planning policy plus Goal facts;
- allocation heuristic: may consider derived pressure without treating it as authored priority;
- Proposal explanation: should disclose target-date/Progress influence.

## 12. Capacity Consumer Boundary

| Potential Consumer Need | Available from Capacity Contract? | Would Current Code Bypass Capacity? | Risk | Required Future Boundary |
|---|---:|---:|---|---|
| Exact compatible intervals | Yes | Current placement reads raw occupancy | Duplicate/inconsistent availability | Feasibility consumes Capacity intervals |
| Duration/contiguity | Yes | Candidate fit computes privately | Conflates Capacity and demand | Pure feasibility evaluator |
| User-day ownership | Yes | Current candidates carry dates | Calendar/transition drift | Capacity is sole resource-time contract |
| Coverage/freshness/integrity | Yes | Current Goal code has none | Allocate uncertain resource | Gate all feasibility/allocation |
| Liability/allocability | Yes | Scheduler exposes unplaced separately | Double claiming | Consume only allocatable Capacity |
| Preferred/work-relative match | Capacity has exact facts; demand supplies requirement | Current helper reads Work directly | Consumer bypass | Match derived attributes/intervals without raw scheduler access |
| Source explanation | Capacity provenance supplies it | Goal code would otherwise inspect sources | Responsibility leak | Reference Capacity dependency/provenance |
| Goal ranking | No, correctly | No current code | Capacity contamination | Allocation inputs only |

No contradiction with the committed Capacity contract was found.

## 13. Goal-Specific Feasibility

Goal-Specific Feasibility is a deterministic, non-authoritative evaluation of one explicit Goal Demand against one current allocatable Capacity result. It may return compatible opportunity references, unsatisfied demand amount, and incompatibility reasons. It does not mutate Capacity, compare Goals, allocate, propose, or schedule.

| Primitive | Current Purpose | Feasibility-Reusable? | Semantic Risk | Evidence |
|---|---|---:|---|---|
| Duration fit | Candidate placement | With adaptation | Coupled to placement side effects | `findBestAvailableStart` |
| Open-window complement | Candidate placement | With adaptation | Private, candidate-scoped, lacks provenance | `placeBlockCandidates.ts:621–664` |
| Preferred/custom windows | Commitment placement | With adaptation | Hard/soft semantics may differ for Goal demand | search-window logic |
| Work-relative positioning | Commitment placement | With adaptation | Reads Work internals and unresolved off-day policy | placement tests |
| Recurrence expansion | Commitment occurrences | Conceptual adaptation | Demand cadence is not owned recurrence | candidate generation |
| First/best start selection | Placement | Unsuitable for feasibility core | Chooses placement rather than enumerating compatibility | `findBestAvailableStart` |
| Placed/unplaced result | Commitment schedule | Unsuitable as result model | Already mutates planning outcome | placement result |

GF4 is therefore appropriate: reusable arithmetic exists, not a feasibility lifecycle.

## 14. Competing Demand

**Not Found:** multiple discretionary Goal demands, fairness, proportional/weighted allocation, round-robin allocation, deadline competition, opportunity-cost reasoning, or user-selected Goal winners.

Current candidate sorting uses hard accepted placement first and Commitment priority/order, then places candidates sequentially. This is competition among previously authorized Commitment occurrences for geometric schedule positions. It is not allocation of demand-neutral Capacity among Goals.

The existing scheduler does not already perform Goal allocation.

## 15. Allocation Definition

Recommended minimum definition:

> **Allocation is deterministic, provisional, explainable assignment reasoning that references portions of current allocatable Capacity to one or more compatible Goal Demands for construction of a Proposal. Allocation is derived, does not mutate Capacity, is not user authority, and does not create scheduled work.**

An allocation must represent Goal and demand identity, Capacity interval identity, assigned duration/partition, unmet demand, competing-demand context, policy/version, input fingerprints, rationale, and provisional status.

It must not be equated with candidate placement, PlanDecision, scheduled block, or historical plan.

## 16. Allocation Granularity

Allocation may conceptually operate at:

- demand-within-horizon level;
- user-day interval partition;
- provisional session partition;
- multi-day distribution;
- competing-demand set.

The canonical allocation unit should reference a Goal Demand and one or more bounded Capacity interval portions. Exact scheduled instants may remain Proposal placement details unless required to explain feasibility; allocation must at least preserve enough interval reference to prove it does not over-assign Capacity.

One allocation result may satisfy demand fully, partially, or not at all. Unmet demand is explicit and non-Friction before acceptance.

## 17. Allocation Policy vs Goal Priority

- **Goal priority** expresses user-authorized relative importance among outcome demands.
- **Allocation policy** defines deterministic rules for resolving compatible competing demands—such as fairness, minimum satisfaction, deadline treatment, or whether partial allocation is useful.
- **Engine heuristics** are non-authoritative tie-break/ranking aids.
- **Commitment priority** orders/protects already-authored time demand and is upstream of Capacity.

Allocation policy may consume Goal priority but must not manufacture it. Learned behavior may produce an explainable heuristic or suggested preference, never silent authority.

## 18. Allocation Determinism and Explainability

Equivalent Capacity, Goal Demands, Goal priority authority, allocation policy/version, accepted reusable preferences, and evaluation horizon must produce semantically equivalent allocation reasoning.

Required provenance includes:

- Capacity dependency and derivation identity;
- every demand identity/revision and authored/derived field lineage;
- feasibility results considered;
- Goal priority source;
- allocation-policy version;
- competing set and evaluation cutoff;
- selected Capacity portions, assigned/unmet amounts, and rejection reasons;
- heuristic/learned evidence separately labelled.

Deterministic tie-breaks must use stable semantic identity, not array order or runtime insertion.

## 19. Allocation vs Proposal

Allocation answers: **How could compatible finite Capacity be partitioned among competing Goal Demands under a declared policy?**

Proposal answers: **What concrete constructive plan does DayFrame recommend that the user accept, modify, or reject?**

Allocation is internal derived reasoning and may expose alternatives. Proposal is the explicit user-facing advisory boundary. Proposal must preserve allocation provenance and add concrete presentation/placement choices, explanation, identity, validity horizon, and decision affordances.

Allocation does not become authority merely because it is optimal under policy.

## 20. Proposal vs Preview

Current Preview contains automatically placed occurrences derived from already-authored Commitments. It has no Goal Demand, Capacity allocation, Proposal identity, item acceptance/rejection, or accepted-allocation transition.

Preview may eventually visualize a Proposal, but it cannot contain unaccepted Goal-driven items in `scheduledBlocks` or publish them as historical scheduled truth without violating user authority. Proposed items require an epistemically distinct representation until acceptance.

## 21. Allocation vs PlanDecision

PlanDecision is durable accepted authority over one existing durable template occurrence: place, omit, change duration, or change priority. It does not bind a Goal Demand, Capacity interval, allocation set, competing context, Proposal, rejection, or recurring authority scope.

Reusable aspects: opaque ID, accepted timestamp, explicit provenance, source lifetime safety, validation, persistence, replay/applicability, blocked/stale results, and removal visibility.

PlanDecision cannot represent Allocation (derived) or Accepted Allocation (new Goal-driven authority) without material adaptation/new semantics. Reusing the type unchanged would misclassify both target and provenance.

## 22. Accepted Allocation Boundary

Accepted Allocation is user-authored planning authority created by explicit acceptance or modification of a Proposal or equivalent direct-authoring action. It records which Goal Demand was authorized to claim which Capacity, at what scope, under which Proposal/allocation provenance.

Minimum facts:

- accepted-allocation identity and version;
- Goal and demand identities/revisions;
- Proposal/allocation identity and considered Capacity snapshot/reference;
- accepted duration/session partition/timing scope;
- one-off versus reusable authority scope;
- accepted/rejected/modified timestamp and actor;
- supersession/removal semantics;
- source lifetimes and staleness/applicability;
- exact divergence from proposed content when modified.

It is authoritative planning intent but not execution evidence.

## 23. When Goal Work Begins to Own Time

Goal and Goal Demand do not own time. Feasibility, Allocation, and Proposal are derived and advisory.

Goal-driven work begins to own time only at the explicit authority transition:

```text
User accepts or authors an allocation
  → Accepted Allocation / authorized reusable scheduling intent
  → derived scheduled occurrence(s)
```

Acceptance may authorize a one-off occurrence or a reusable pattern. The authority scope must be explicit before schedule generation. Merely rendering a proposed item at a time does not make it scheduled reality.

## 24. Recurring Goal Demand and Repeated Authority

Future architecture must distinguish:

1. recurring Goal Demand: repeated resource request, still non-time-owning;
2. one-off Proposal acceptance: authorizes only named occurrence/allocation;
3. recurring Proposal/pattern acceptance: explicitly authors reusable scheduling intent;
4. reusable preference acceptance: influences future proposals but does not itself schedule;
5. Commitment creation from accepted Goal plan: time-owning authored pattern.

Current recurrence and incarnation machinery is analogous for pattern expansion and lifetime safety, but it cannot determine which recurring authority the user granted. Repeated one-off acceptance must not silently become global authority.

## 25. Rejection and Modification Semantics

Rejection leaves Capacity, Goal, Goal Demand, and authored schedule unchanged. It may create bounded decision history tied to Proposal identity, content, dependencies, and timestamp. It must not silently lower Goal priority, disable demand, or establish a reusable preference.

Modification is a new authored decision over identified Proposal content. It must preserve original Proposal/allocation/Capacity/demand provenance, exact accepted differences, authority scope, timestamp, and resulting Accepted Allocation. Modifying 90 minutes to 60 minutes does not rewrite the original Proposal.

Learned patterns from rejection/modification remain derived evidence until explicitly accepted as reusable preference.

## 26. Goal Progress and Allocation

Progress measures outcome evidence under a measurement definition. Demand requests planning resource. Allocation provisionally assigns resource. Scheduled effort is plan truth. Execution records what happened.

None substitutes for another:

- Progress below target does not automatically authorize more time.
- Allocated/scheduled time is not Progress.
- Completed time does not automatically satisfy qualitative or quantity policy unless that measurement policy explicitly defines the relationship.
- Progress may inform an explainable derived demand projection or allocation heuristic only under a versioned policy with provenance.

## 27. Historical Provenance

When decision-time truth matters, preserve independently:

- Goal snapshot/revision;
- authored demand intent and derived demand projection;
- Capacity context/fingerprint and relevant interval snapshot;
- feasibility result;
- competing demand set and priorities;
- allocation policy/version and result;
- Proposal content/identity;
- accept/reject/modify decision and authority scope;
- scheduled occurrence provenance;
- execution evidence;
- Progress definition/observation cutoff.

Current mutable Goal, demand, or Capacity must never backfill or rewrite those facts. Existing historical Goal snapshots and PlanDecision provenance are strong precedents but incomplete for this lifecycle.

## 28. Summary and Learning Boundary

Summary may later present planned, proposed, allocated, accepted, scheduled, executed, and Progress evidence only with explicit labels and coverage. It remains read-only.

Learning may derive tendencies from historical choices and outcomes. Such information is analytical evidence, not Goal priority, demand, allocation policy, or current intent. It may inform Proposal explanation or suggest an authored preference; it may not silently change future allocation.

## 29. Existing Primitive Reuse Assessment

| Primitive | Current Purpose | Reuse Classification | Future Role | Risk / Limitation |
|---|---|---|---|---|
| Goal identity/revision/lifecycle | Authored outcomes | Directly Reusable | Goal reference/applicability | No demand fields |
| Goal links | Historical/source relationship | Reusable with Adaptation | Avoid double counting existing Commitment intent | Link is not demand |
| Measurement/Progress | Outcome interpretation | Reusable with Adaptation | Optional derived demand signal | Must not authorize effort |
| Capacity contract | Resource read model specification | Directly Reusable architecturally | Sole resource input | Not implemented yet |
| Block duration/windows | Commitment placement | Reusable with Adaptation | Demand/feasibility semantics | Commitment-owned hardness |
| Recurrence expansion | Commitment pattern occurrences | Reusable with Adaptation | Project authorized recurring demand/pattern | Demand recurrence differs from time ownership |
| Candidate priority sort | Place Commitments | Not Suitable for allocation | None directly | Wrong priority and authority |
| Open-window/duration fit | Place candidate | Reusable with Adaptation | Feasibility arithmetic | Selects placement and reads internals |
| PlanDecision | Accepted occurrence override | Reusable with Adaptation/infrastructure | Acceptance identity/replay precedent | Wrong target and scope |
| Suggested fixes/Friction | Corrective recommendation | Infrastructure only | Choice/provenance patterns | Corrective trigger |
| Preview | Generated Commitment schedule | Not Suitable as Proposal unchanged | Possible rendering host | Conflates proposed/scheduled |
| Source incarnation | Lifetime safety | Directly Reusable | Demand/accepted-source lifetime | Same-lifetime revisions still needed |
| Historical Goal provenance | Freeze relationship | Directly Reusable pattern | Decision-time Goal context | Does not capture demand/allocation |
| Historical plan/execution | Planned/executed evidence | Reusable with Adaptation | Accepted Goal-work history | Must exclude unaccepted Proposal |

## 30. Current vs Intended End-to-End Flow

Current:

```text
Goal → manual link → authored Commitment → candidate → placement
→ Preview scheduled block → historical publication → execution
→ separate Progress observation/projection
```

Intended:

```text
Goal + authored demand intent → derived Goal Demand
Capacity → Goal-Specific Feasibility
→ competing demand + Goal priority + allocation policy
→ provisional Allocation → constructive Proposal
→ user accept/modify/reject
→ Accepted Allocation or reusable authored pattern
→ scheduled Goal work → Friction if later infeasible
→ execution → Progress/Summary
```

**First exact break:** current Goal authority has no active Goal Demand relationship or resource-request projection. Existing Goal links point to already-authored time owners and therefore begin after the missing demand/allocation authority boundary.

## 31. Boundary Matrix

| Concept | Authored? | Derived? | Owns Time? | Describes Resource? | Expresses Demand? | Tests Compatibility? | Allocates? | Recommends? | Requires Acceptance to Schedule? |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Goal | Yes | No | No | No | Outcome only | No | No | No | No |
| Goal Demand intent | Yes | No | No | No | Yes | No | No | No | Before resulting work |
| Demand projection | No | Yes | No | No | Yes | No | No | No | Before resulting work |
| Capacity | No | Yes | No | Yes | No | No | No | No | No |
| Feasibility | No | Yes | No | References | Evaluates one | Yes | No | No | No |
| Goal priority | Yes | No | No | No | Competition importance | No | No | No | Authoring itself |
| Allocation policy | Authored/accepted | May include derived heuristics | No | No | No | No | Governs | No | Policy acceptance |
| Allocation | No | Yes | No | Assigns references | Resolves competing demand | Uses results | Yes provisionally | No | Yes |
| Proposal | No | Yes | No | References | Presents satisfaction | Uses results | References | Yes | Yes |
| Accepted Allocation | Yes through decision | Based on derived inputs | Authorizes claim | Records assigned resource | Resolves accepted demand | No | Yes authoritatively | No | Is acceptance result |
| Commitment | Yes | Occurrence derived | Yes | No | Obligation | No | No | No | Already authored |
| Scheduled Goal work | Authorized/derived occurrence | Yes | Yes | No | Realizes accepted demand | No | Consumes | No | Yes |
| Friction | No | Yes | No | No | No | No | No | Corrective | Corrective change only |
| Progress | Observation authored; interpretation derived | Yes | No | No | No | No | No | No | No |

## 32. Authority-Transition Matrix

| Transition | Input Category | Output Category | Authority Created? | User Action Required? | Historical Freeze Required? |
|---|---|---|---:|---:|---:|
| Goal creation | User intent | Authored Goal | Yes | Yes | Goal revisions persist |
| Demand-intent authoring | Goal + planning intent | Authored demand intent | Yes | Yes | Preserve revisions |
| Demand projection | Authored facts/policy | Derived Goal Demand | No | No | At Proposal/decision if material |
| Feasibility | Demand + Capacity | Derived compatibility | No | No | With decision provenance if used |
| Allocation reasoning | Compatible competing demands | Provisional allocation | No | No | With Proposal/decision if used |
| Proposal construction | Allocation alternatives | Proposed action | No | No to create; yes to act | Preserve exact proposed content at decision |
| Reject Proposal | Proposal | Rejection decision | Bounded decision authority/history | Yes | Yes |
| Modify Proposal | Proposal + user changes | Accepted Allocation | Yes | Yes | Original and delta |
| Accept Proposal | Proposal | Accepted Allocation | Yes | Yes | Yes |
| Create recurring pattern | Accepted recurring scope | Authored scheduling intent | Yes | Explicit scope acceptance | Yes |
| Schedule occurrence | Accepted authority/pattern | Derived scheduled work | No new intent | No repeated acceptance within scope | Historical plan |
| Friction recovery | Infeasible authored/accepted plan | Proposed correction/decision | On accept only | Yes | Decision provenance |
| Execution report | Scheduled target + observation | Historical evidence | Execution authority | Yes/report source | Immutable |
| Progress projection | Measurement evidence | Derived Progress | No | No | Provenance/cutoff |

## 33. Worked Scenarios

### Scenario A — One Goal, Enough Capacity

A Study demand requests two 60-minute sessions; Capacity exposes compatible intervals. Feasibility identifies them, Allocation references them provisionally, and Proposal recommends them. No time is owned until acceptance.

### Scenario B — Two Goals, Scarce Capacity

Study and Fitness both fit one interval. This is competing demand, not Friction. Goal priority and allocation policy produce explainable provisional alternatives; Proposal presents a recommendation for user decision.

### Scenario C — Partial Allocation

A demand requests 180 minutes and only 120 compatible minutes exist. Allocation may report 120 provisionally assigned and 60 unmet if policy permits partial satisfaction. It must not call the remaining 60 Friction or invent more Capacity.

### Scenario D — Active Goal Without Demand

The Goal remains visible and measurable but consumes no Capacity, produces no feasibility evaluation, and creates no Proposal.

### Scenario E — Target-Date Pressure

A near target date may produce a derived urgency signal under a versioned policy. That signal may influence allocation reasoning and must appear in explanation; it does not become authored Goal priority or authorize more time.

### Scenario F — User Rejects Proposal

Rejecting Tuesday Study leaves Capacity, demand, Goal, and schedule unchanged. The bounded rejection may be retained with exact Proposal provenance but must not silently suppress future demand or establish a preference.

### Scenario G — User Modifies Proposal

The user changes 90 minutes Tuesday to 60 minutes Wednesday. Acceptance creates authority for the exact modified allocation, preserving original Proposal, Capacity/demand inputs, and delta. Only resulting authorized work owns time.

### Scenario H — Recurring Accepted Pattern

Accepting “schedule Study twice weekly” must explicitly create recurring authority distinct from accepting one Tuesday occurrence. Current recurrence/incarnation machinery can expand and protect the resulting pattern but cannot infer that scope from repeated one-off choices.

### Scenario I — Accepted Goal Work Becomes Infeasible

A Work edit invalidates relevant Capacity and conflicts with accepted Goal work. Capacity reports current resource truth; the already-authorized work becomes corrective Friction. Recovery requires a new user decision.

### Scenario J — Existing Goal-Linked Commitment

A linked recurring Study Commitment already owns time. Goal existence or a later demand projection must not count that same intended effort again. Demand projection needs explicit accounting/provenance for satisfied-by-existing-Commitment demand.

## 34. Invariant Assessment

| Invariant | Assessment | Reason |
|---|---|---|
| GD-INV-01 Goal does not own time merely by existing | Affirm | Current and intended architecture agree |
| GD-INV-02 Demand requests resources without scheduling | Affirm | Core boundary |
| GD-INV-03 Authored/derived demand provenance | Affirm | Required for epistemic integrity |
| GD-INV-04 Derived urgency is not authored priority | Affirm | Prevents silent authority |
| GD-INV-05 Capacity unchanged by evaluation | Affirm | Capacity is demand-neutral |
| GD-INV-06 Feasibility does not allocate | Affirm | Separate responsibility |
| GD-INV-07 Scarce competing demand is not Friction | Affirm | Pre-authority problem |
| GD-INV-08 Allocation provisional until authority | Affirm | User decision remains required |
| GD-INV-09 Allocation does not mutate Capacity | Affirm | Immutable derived input |
| GD-INV-10 Proposal presents constructive reasoning | Affirm | Explicit advisory boundary |
| GD-INV-11 Unaccepted Proposal is not scheduled | Affirm | User authority |
| GD-INV-12 Acceptance differs from recommendation | Affirm | Provenance/state distinction |
| GD-INV-13 Goal work owns time only after authority | Refine | Acceptance may create one-off allocation or reusable pattern; both scopes must be explicit |
| GD-INV-14 One-off choice not global preference | Affirm | No silent learning authority |
| GD-INV-15 Goal and Commitment priority differ | Affirm | Outcome competition vs obligation protection |
| GD-INV-16 Planning time and Progress differ | Affirm | Plan versus outcome evidence |
| GD-INV-17 Decision-time history not reconstructed | Affirm | Immutable provenance |
| GD-INV-18 Existing linked work not double-counted | Affirm | No duplicate intent |
| GD-INV-19 Demand projection must trace to authorized intent | Added/Affirm | Derived demand cannot invent deserved effort |
| GD-INV-20 Deterministic allocation requires explicit policy/version | Added/Affirm | Reproducibility |
| GD-INV-21 Rejection/modification preserves original Proposal | Added/Affirm | Decision provenance |
| GD-INV-22 Recurring authority scope must be explicit | Added/Affirm | Prevents scope escalation |
| GD-INV-23 Infeasible accepted work may create Friction; infeasible unaccepted demand may not | Added/Affirm | Authority boundary |

## 35. Architecture Questions

1. **Does Goal Demand currently exist?** No.
2. **Does Goal priority currently exist?** No.
3. **Current scheduling behavior?** Goal-linked Commitment scheduling, not Goal Demand.
4. **Minimum Goal/Demand distinction?** Outcome identity versus resource request.
5. **May Demand be authored/derived?** Authored intent plus deterministic projection; mixed facts require field provenance.
6. **Facts requiring authority?** Requested effort, hardness, splittability, cadence/timing constraints, reusable scope, and Goal priority.
7. **Safely derived metadata?** Normalized horizon, remaining measurement facts, target-date pressure, and historical tendencies—only as labelled advisory signals under policy.
8. **Goal-Specific Feasibility?** Pure compatibility evaluation of one Demand against immutable Capacity.
9. **Reusable placement primitives?** Duration/window/contiguity and relational arithmetic with adaptation; not placement side effects.
10. **Does candidate ordering constitute Allocation?** No; it orders pre-authorized Commitments.
11. **Minimum Allocation definition?** Provisional explainable assignment of Capacity portions to compatible competing Demands for Proposal construction.
12. **Is Allocation authoritative?** No.
13. **Allocation information?** Demand/Goal IDs, Capacity portions, assigned/unmet amounts, competing set, policy/version, rationale, fingerprints.
14. **Allocation/Proposal boundary?** Allocation reasons internally; Proposal presents a concrete recommendation.
15. **May Preview contain unaccepted Goal work as scheduled?** No.
16. **Can PlanDecision represent Accepted Allocation unchanged?** No; material adaptation/new authority is required.
17. **When does Goal work own time?** At explicit acceptance/direct authoring into one-off or reusable planning authority.
18. **Recurring scopes?** Recurring demand, one-off acceptance, recurring-pattern acceptance, and reusable preference.
19. **What must rejection preserve?** Exact Proposal/dependencies, scope, timestamp, and non-effects.
20. **What must modification preserve?** Original Proposal, accepted delta, dependencies, scope, and resulting authority.
21. **Goal vs Commitment priority?** Goal priority ranks discretionary outcomes; Commitment priority protects/orders obligations.
22. **Learned preference influence?** Labelled heuristic evidence only until explicitly authored.
23. **Accepted Goal work entering Friction?** When later authority/constraints make it infeasible.
24. **Historical facts to freeze?** Goal, Demand, Capacity, feasibility, competition, allocation, Proposal, decision, scheduled, execution, and relevant Progress provenance.
25. **First executable break?** No Goal Demand relationship/projection after Goal intent.
26. **Architecture next?** A joint Goal Demand and Allocation specification before Proposal or implementation sequencing.

## 36. Implementation Classifications

### Goal Demand — GD5: Not Implemented

No Goal-owned resource request, cadence, session, effort, preference, priority, projection, persistence, UI, or scheduling consumer exists. Commitment fields are not partial Goal Demand because they belong to already-authorized time owners.

### Goal-Specific Feasibility — GF4: Reusable Placement Primitives Only

Fit/window arithmetic exists, but it consumes Commitment candidates, reads raw scheduling internals, chooses placement, and returns placed/unplaced results. No Goal/Capacity evaluation exists.

### Allocation — AL4: Analogous Commitment-Ordering Primitives Only

The scheduler sorts and places authored Commitment demand. It has no Goals, Capacity contract, competing discretionary demands, allocation policy, provisional assignment model, or alternatives.

### Accepted Allocation — AA4: Conceptually Related Infrastructure Only

PlanDecision demonstrates explicit durable choice, provenance, applicability, replay, and lifetime safety. Its occurrence target and corrective workflow cannot encode Goal Demand, Capacity allocation, Proposal decision, rejection, or recurring scope without new semantics.

## 37. Test Coverage Assessment

Focused validation executed 12 existing test files: Goal surface, Goal Progress query/history, historical publication, Goal Activity, candidate generation/placement, PlanDecision replay/candidate mapping, preview generation, source-incarnation lifecycle, and execution history.

Result: **12 test files passed; 137 tests passed; 0 failed.**

| Architectural Concern | Existing Test Coverage | Strength | Gap | Deterministic Claim Supported? |
|---|---|---|---|---:|
| Goal CRUD/lifecycle/persistence | `goalSurface.test.ts` | Strong | No demand behavior by design | Yes |
| Exact links/incarnations | Goal/source lifecycle tests | Strong | No demand satisfaction accounting | Yes |
| Historical Goal provenance | materialization/Goal Activity tests | Strong | No Demand/allocation snapshots | Yes |
| Measurement/Progress | Progress query/history tests | Strong | No urgency/scheduling effects | Yes |
| Candidate generation/recurrence | block candidate tests | Strong | Commitment-only | Yes |
| Placement/duration/windows/priority | placement tests | Strong | Coupled to scheduling, not pure feasibility | Yes |
| Preview pipeline | preview tests | Strong | No proposed-vs-scheduled Goal items | Yes |
| PlanDecision replay | replay/candidate tests | Strong | Occurrence/corrective scope only | Yes |
| Friction/suggested fixes | covered through preview/decision suites | Moderate | Constructive Proposal absent | Yes for current behavior |
| Execution/history | execution surface tests | Strong | No Accepted Allocation lineage | Yes |
| Goal Demand | None | Absent | Entire architecture unimplemented | No |
| Competing demand/allocation | None | Absent | Entire architecture unimplemented | No |

## 38. Architectural Gaps and Risks

Material gaps:

- no Goal Demand identity, authority, projection, lifecycle, or provenance;
- no Goal priority or allocation policy;
- Capacity contract is specified but unimplemented;
- no pure Goal feasibility evaluator;
- no competing-demand set or provisional allocation;
- no constructive Proposal or Accepted Allocation authority;
- no rejection/modification/recurring-scope history.

Risks if existing primitives are reused without adaptation:

- treating Commitment fields as Goal Demand would make Goals own time too early;
- treating candidate sorting as allocation would substitute obligation priority for Goal importance;
- treating placement as feasibility would silently schedule advisory reasoning;
- placing unaccepted Goal items in Preview `scheduledBlocks` could publish them historically;
- treating PlanDecision as Accepted Allocation would lose demand/Capacity/Proposal provenance and scope;
- deriving deserved effort from target date or Progress would invent intent;
- counting linked existing Commitments plus new demand would double claim time;
- learning from one-off choices could silently create reusable authority.

## 39. Open Questions

Questions for the recommended specification:

1. What is the minimum authored Goal Demand intent and its lifecycle?
2. How are horizon, total effort, session constraints, cadence, and splittability normalized into a projection?
3. May one Goal have concurrent demands, and how are their identities/scopes distinguished?
4. How is existing Goal-linked Commitment effort credited against demand without asserting automatic Progress?
5. What Goal-priority authority and scale are appropriate?
6. Which allocation policies are user-authored versus fixed/versioned engine policy?
7. Must allocation select exact interval portions or only resource quantities/constraints before Proposal placement?
8. What partial-satisfaction and unmet-demand semantics are valid?
9. What stable identity/fingerprint covers a competing-demand evaluation?
10. What Accepted Allocation scopes and supersession rules are required?
11. What rejection record is durable without becoming preference authority?
12. Which historical snapshot owns decision-time Capacity/demand/allocation context?

These are specification questions, not reasons for another executable audit.

## 40. Recommended Next Step

**Path B — Goal Demand and Allocation Architecture Specification.**

The audit sufficiently resolves both conceptual domains and their boundary: Goal Demand is authorized resource intent with deterministic projection; feasibility is pure; Allocation is provisional deterministic assignment reasoning; Proposal is the constructive user-facing boundary; acceptance creates time-owning authority.

A joint specification is safer than specifying Demand alone because demand granularity, partial satisfaction, priority, policy, and allocation identity are mutually constraining. Path C is unnecessary because no narrower executable allocation exists to audit. Path D is premature because Proposal requires the Demand/Allocation contract first. Paths E and F are unsupported: no executable uncertainty or architecture contradiction blocks specification.

This recommendation does not begin the specification and does not assign work to an implementation phase.

## 41. Completion Statement

> **Goal Demand and Allocation Architecture Audit complete.**
>
> The audit traces DayFrame's current Goal, scheduling, priority, decision, historical, and progress behavior against the committed Capacity architecture; distinguishes Goal intent from Goal Demand, Goal-specific feasibility from allocation, allocation reasoning from constructive Proposal, and engine reasoning from user authority; identifies the exact current implementation boundaries, reusable primitives, architectural gaps, authority transitions, provenance requirements, and downstream questions; and recommends the appropriate next architectural step without modifying the implementation or assigning the work to a future implementation phase.
