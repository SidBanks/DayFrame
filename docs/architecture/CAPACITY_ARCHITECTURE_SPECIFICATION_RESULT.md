# Capacity Architecture Specification Result

## 1. Executive Specification

This document is the authoritative DayFrame Capacity architecture contract.

> **Capacity is the deterministic, explainable collection of user-day-owned intervals eligible for discretionary allocation after DayFrame accounts for applicable time-owning Commitments, unresolved Commitment liabilities, mandatory constraints, protective buffers, accepted planning decisions, and explicit general availability policy. Duration and fragmentation are derived characteristics. Capacity is descriptive, derived, and non-authoritative: it does not create Goal demand, allocate resources, recommend action, authorize intent, or schedule work.**

Normative outcomes:

- The smallest Capacity unit is an interval owned by exactly one canonical DayFrame user-day.
- Interval topology is canonical; scalar totals are summaries only.
- Current Capacity is derived and disposable, never authored or independently persisted as authority.
- Result truth is expressed through orthogonal freshness, coverage, liability, allocability, and integrity qualifications.
- Unresolved time-owning Commitment demand cannot be double-claimed as allocatable Capacity.
- General Capacity is demand-neutral; Goal-specific feasibility is downstream.
- Historical Capacity context may be frozen only when another authoritative event needs it as provenance.
- Capacity remains distinct from allocation, Proposal, accepted decisions, scheduled work, execution, and Friction.

The specification is compatible with current scheduling primitives, but implementing it requires Capacity-specific interval identity, provenance, dependency-fingerprint, qualification, aggregation, and query composition.

**Recommended next step: Path B — Goal Demand and Allocation Architecture Audit.** Capacity is sufficiently specified; the principal remaining architectural uncertainty is how Goals express demand and compete over this contract before Proposal creation. This document does not begin that work or assign it to an implementation phase.

## 2. Architectural Context

DayFrame's approved lifecycle is:

```text
Commitments + Constraints
  → Capacity
  → Goal Demand
  → Allocation
  → Proposal
  → User Decision
  → Accepted Allocation
  → Scheduled Work
  → Execution
  → Progress
  → Summary
```

Capacity is derived truth downstream of authored scheduling authority, accepted decisions, and temporal interpretation. It is upstream of demand, allocation, recommendation, and user acceptance.

The user remains sole authority over intent. Deterministic derivation may describe resources but cannot promote those resources into proposed, accepted, scheduled, or executed truth. This follows the authored/derived/historical separation in `DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`, particularly lines 169–218 and 343–410.

Implementation compatibility was established by the preceding `CAPACITY_SEMANTIC_READ_MODEL_AUDIT.md`: current DayFrame has user-day, interval placement, Work, recurrence, buffer, PlanDecision, staleness, source-incarnation, and historical-publication primitives, but no Capacity model. The verified focused suite passed 8 test files and 234 tests with no failures.

## 3. Normative Capacity Definition

The definition in section 1 is normative and suitable for the DayFrame glossary.

The following words have binding meaning:

- **deterministic:** identical authoritative dependencies and derivation policy produce semantically identical results;
- **explainable:** every inclusion, exclusion, qualification, and change can be traced to authoritative dependencies and transformation rules;
- **eligible:** generally available for discretionary allocation before considering a particular Goal;
- **user-day-owned:** every interval is contained within and attributed to exactly one effective canonical user-day window;
- **non-authoritative:** Capacity cannot itself alter intent or scheduling state.

Capacity MUST NOT be treated as chronological free time, a placement helper result, Goal feasibility, demand, priority, allocation, Proposal, accepted choice, scheduled work, execution evidence, or Friction.

## 4. Capacity Terminology

| Term | Classification | Normative meaning |
|---|---|---|
| Chronological Free Time | Internal derivation concept | Time in a temporal envelope not directly occupied by a time-owning occurrence |
| Geometric Opening | Internal derivation concept | Interval remaining after occupied and protected exclusions are applied |
| Capacity | Canonical derived domain concept | Demand-neutral eligible discretionary planning interval set with qualifications and provenance |
| Feasible Opportunity | Derived evaluation concept | Portion of Capacity satisfying an explicit demand contract |
| Goal-Specific Feasibility | Derived evaluation concept | Determination of compatible opportunities for one Goal demand |
| Allocatable Capacity | Qualification/state | Capacity currently safe for allocation; not a separate entity or authority |
| Unresolved Commitment Liability | Canonical qualification/provenance concept | Authored time-owning demand whose required placement has not been resolved |

Candidate-specific placement openings are not a separate term in the public Capacity model. They are demand-specific scheduler calculations.

## 5. Authoritative Inputs

Capacity derivation consumes authoritative facts or deterministic occurrence projections of those facts. It MUST preserve the source family and lifetime provenance; it MUST NOT require a unified Commitment implementation.

| Input Class | Owns Time? | Constrains Time? | Authority Source | Capacity Effect | Required Provenance |
|---|---:|---:|---|---|---|
| Work definition/cycle | At pattern level | Yes | Active authored state | Generates occupied Work occurrences | Source IDs, incarnations, effective segment, relevant values |
| Generated Work occurrence | Yes | Yes | Deterministic projection | Subtracts occupied interval | Occurrence identity and generating sources |
| Sleep Commitment | Yes when authored as obligation | Yes | Active template/recurrence | Occupies resolved interval or creates liability | Template/recurrence lifetime and occurrence identity |
| Fixed recurring Commitment | Yes | Yes | Active template/recurrence | Subtracts resolved interval | Source and occurrence identity |
| Movable recurring Commitment | Yes as demanded duration | Yes | Active template/recurrence | Subtracts resolved placement or creates liability | Source, occurrence, demand bounds, placement result |
| Manual event | Yes | Yes | Active manual-event authority | Subtracts occupied interval | Event lifetime and occurrence/reference |
| Protective buffer | No | Yes | Authored Commitment constraint | Excludes protected interval | Owner, side, duration, effective interval |
| Relational mandatory rule | No | Yes | Authored constraint | Restricts applicable Commitment resolution or general eligibility | Rule identity and resolved anchor |
| General availability policy | No | Yes | Explicit user-approved policy | Includes/excludes openings generally | Policy identity/version and effective scope |
| Scheduling preference | No | Potentially | Active preferences | Temporal interpretation or heuristic placement; only mandatory/general rules alter Capacity eligibility | Effective preference source/value |
| Applicable PlanDecision | No independently | Yes | Accepted decision authority | Changes resolved occurrence reality before derivation | Decision ID, target lifetime, replay result |
| Source incarnation | No | Authority resolution | Active lifetime authority | Prevents stale sources/decisions from contributing | Incarnation IDs |
| User-day/cycle override | No | Temporal envelope | Effective scheduling authority | Defines interval ownership/window | Boundary, segment/cycle provenance |
| Planning range | No | Coverage | Query intent | Clips requested result and establishes completeness | Exact requested bounds |
| Unresolved Commitment demand | Yes as liability | Yes | Authored intent + failed/incomplete resolution | Qualifies or blocks affected allocability | Source/occurrence identity, duration, eligible scope, reason |

A source family may supply Capacity only if it can provide: authoritative lifetime identity, deterministic occurrence semantics, exact or bounded temporal demand, constraint/protection data, and sufficient provenance to reproduce its effect.

## 6. Capacity Derivation Model

The normative conceptual pipeline is:

```text
1. Resolve authoritative dependency snapshot and derivation-policy version
2. Resolve exact canonical user-day envelopes intersecting the query
3. Expand supported time-owning authored sources into occurrence demand
4. Apply accepted decisions and authoritative lifetime resolution
5. Resolve Commitment placements or record unresolved liabilities
6. Construct occupied intervals from resolved time-owning occurrences
7. Construct protected intervals from buffers and universal constraints
8. Union exclusions while retaining all contributing provenance
9. Complement exclusions within each canonical user-day envelope
10. Apply explicit general availability policy
11. Clip to requested coverage without losing partial-coverage truth
12. Attach liability, integrity, coverage, freshness, and allocability qualifications
13. Produce canonical Capacity intervals and derived summaries
```

Implementations MAY fuse computational stages but MUST preserve their semantic distinctions in tests and provenance.

Occupied and protected intervals are subtracted using half-open interval semantics `[start, end)` so touching boundaries do not overlap. Overlapping exclusions MUST be unioned for arithmetic while retaining every contributor for explanation.

An opening becomes Capacity only when it lies inside a resolved user-day envelope, is not occupied/protected, satisfies universal eligibility policy, belongs to supported complete coverage, and is accurately qualified for unresolved liabilities.

Invalid or protected authoritative dependencies MUST produce an integrity-protected or unavailable result, not empty Capacity. Query clipping MUST produce partial coverage when the requested interval omits part of a canonical user-day.

## 7. Canonical Capacity Unit

The smallest canonical unit is a **Capacity interval owned by exactly one canonical user-day**.

Each unit MUST establish:

- exact start and end instants;
- positive duration derived from those instants;
- owning user-day label and exact user-day window;
- requested coverage intersection;
- semantic interval identity;
- derivation/dependency identity;
- inclusion and adjacent exclusion provenance sufficient for explanation;
- current result qualifications and freshness.

Capacity intervals MUST NOT cross a canonical user-day boundary. A continuous eligible opening crossing a boundary is represented as two intervals, one per user-day, even when timestamps touch.

Interval identity MUST be stable across semantically equivalent derivations. Identity is based on owning user-day, exact boundaries, general eligibility semantics, dependency fingerprint, and derivation-policy version. It MUST NOT depend on array position, runtime allocation order, UI range label, or Goal identity. When a relevant fact changes, a new semantic identity is permitted and generally expected.

## 8. User-Day and Temporal Semantics

Every Capacity interval MUST belong to exactly one canonical user-day window resolved under the effective scheduling preferences for that user-day.

Normative rules:

1. Calendar midnight is not an implicit Capacity boundary.
2. Times before the effective boundary belong to the preceding user-day.
3. Overnight Work remains one time-owning occurrence with its established provenance even when it crosses midnight.
4. Capacity arithmetic uses exact instants and preserves the owning user-day attribution.
5. Cycle/segment boundary overrides determine the effective user-day window for each label.
6. User-day windows MAY be shorter or longer than 24 hours during boundary transitions or civil-time changes.
7. A query intersecting only part of a user-day MUST return partial coverage for that day.
8. Multi-day aggregation MUST retain component user-days and MUST NOT merge intervals across their boundaries.

Current primitives support custom boundaries, pre-boundary ownership, overnight Work, and 21/27-hour transitions (`core/time/userDay.ts`, effective schedule-preference resolution, and preview tests). A future Capacity implementation MUST use the canonical piecewise user-day window resolver rather than naïve date-plus-24-hours arithmetic where effective boundaries vary.

## 9. Occupied Time, Protected Time, and Buffers

- **Occupied Time** is time owned by an authorized occurrence.
- **Protected Time** is intentionally unavailable for discretionary allocation without itself being an activity.
- **Capacity** excludes both while retaining their semantic distinction.

Normative buffer rules:

1. A before-buffer protects the interval immediately preceding its owner; an after-buffer protects the interval immediately following it.
2. Buffers MAY cross user-day or query boundaries; derivation MUST include sufficient lookaround and clip only the reported result.
3. Overlapping buffers and occupied intervals are unioned once for duration arithmetic.
4. Every source contributing to a unioned exclusion remains present in provenance.
5. A buffer does not acquire activity identity, execution state, or historical outcome merely because it excludes Capacity.
6. Protected time MUST be explainable even when no visible scheduled activity occupies it.
7. A later meaningful attached activity such as commuting enters as occupied time with its own identity; it MUST NOT be flattened into anonymous buffer semantics.

## 10. Unresolved Commitment Liability

**Unresolved Commitment Liability** means user-authorized time-owning occurrence demand that has not been assigned a valid resolved interval under current authoritative constraints and decisions.

The normative model combines audit Options B and C: **scoped conservative Capacity with explicit liability qualification**.

Rules:

1. Every liability MUST identify its source lifetime, occurrence, demanded duration, eligible temporal scope if determinable, and unresolved reason.
2. Its default scope is every canonical user-day/range in which the Commitment could validly claim time.
3. Intervals provably outside that scope MAY remain fully allocatable.
4. Openings inside or intersecting that scope MAY be returned descriptively but MUST be marked qualified and MUST NOT contribute to fully allocatable totals.
5. If the eligible scope cannot be bounded safely, the affected user-day or requested range is non-allocatable.
6. Downstream Goal allocation MUST consume only fully allocatable intervals unless a future explicit user-authority workflow resolves the liability first.
7. The liability's demanded duration MUST be reported separately; it MUST NOT be guessed away, subtracted arbitrarily from unrelated intervals, or counted simultaneously as Capacity.
8. An unplaced authored Commitment may continue to produce Friction under existing semantics; the Capacity result references the liability without redefining Friction.

This model prevents double claiming while preserving truthful information about intervals known to be independent of the unresolved demand.

## 11. General Eligibility Policy

Only universally applicable rules may transform geometric openings into general Capacity.

- **Mandatory general constraints** apply to all discretionary allocation and MUST be enforced.
- **General availability policy** is explicit user-approved policy defining when discretionary planning may occur. It MAY include declared unavailable intervals or an explicitly selected off-day regime.
- **Demand-specific constraints** belong to Goal demand or feasibility and MUST NOT reduce general Capacity.

Classification examples:

| Rule | Layer |
|---|---|
| “Never schedule discretionary work in this interval” | General availability policy; Capacity input |
| Explicit Preserve Routine off-day policy | General policy; affects Capacity through resolved commitments/universal exclusions |
| Explicit Adapt to Off Days policy | General policy; permits different general opportunities |
| One Goal prefers evenings | Goal-specific feasibility |
| One Goal requires 90 contiguous minutes | Goal-specific feasibility |
| A Commitment must occur after Work | Commitment resolution constraint; not Goal feasibility |
| An unselected off-day philosophy | No authority; MUST NOT be inferred |

Preferences expressing desirability MUST NOT silently become universal exclusions. General policy requires explicit authority and versioned provenance.

## 12. General Capacity vs Goal-Specific Feasibility

General Capacity is demand-neutral. Goal-specific feasibility applies one explicit demand contract to Capacity without redefining or mutating Capacity.

A feasibility evaluator MAY filter or partition Capacity by required duration, minimum contiguity, time-of-day compatibility, recurrence, splittability, work-relative requirements, and other explicit demand properties. It conceptually returns compatible opportunities or no compatible opportunity, together with evaluated demand and Capacity identities.

The evaluator MUST NOT:

- modify Capacity intervals or provenance;
- convert incompatibility into zero general Capacity;
- inspect Work, recurrence, buffer, PlanDecision, incarnation, or user-day internals bypassing the Capacity contract;
- rank Goals, allocate intervals, propose actions, or authorize scheduling.

General Capacity may exist when no current Goal can use it.

## 13. Capacity Dimensions and Aggregation

Canonical properties are exact interval boundaries, duration, interval identity, owning user-day/window, qualifications, dependency identity, and provenance.

Derived summaries include:

- total eligible duration;
- fully allocatable duration;
- qualified duration;
- longest contiguous interval;
- interval count;
- user-day totals;
- user-week and arbitrary-range totals;
- workday/off-day context when relevant.

The interval list itself is the V1 fragmentation representation. No formal fragmentation score is required.

Aggregation rules:

1. Scalar totals MUST NOT replace interval topology.
2. User-day ownership MUST survive all aggregation.
3. Touching intervals across user-day boundaries MUST NOT merge.
4. Partial coverage MUST remain explicit at day and range levels.
5. Qualified, unresolved, stale, protected, or integrity-invalid intervals MUST NOT inflate fully allocatable totals.
6. Every summary MUST be reproducible from canonical interval results and qualifications.
7. Calendar month is a presentation/query range, never a competing temporal authority.

## 14. Capacity Result States

Capacity uses orthogonal qualifications rather than one combinatorial enum.

| Dimension | Values | Meaning and downstream rule |
|---|---|---|
| Freshness | `current`, `stale` | Current matches dependency/policy identity. Stale intervals MAY be displayed with explanation but MUST NOT be allocated. |
| Coverage | `complete`, `partial`, `unavailable` | Complete covers every requested canonical component; partial returns explicit covered/uncovered bounds; unavailable returns no claim of Capacity. |
| Integrity | `valid`, `protected`, `invalid` | Protected means authority cannot safely be read; invalid means contradictory/invalid inputs. Neither is allocatable. |
| Liability | `resolved`, `unresolved` | Unresolved identifies one or more scoped Commitment liabilities. Affected intervals are not fully allocatable. |
| Allocability | `allocatable`, `qualified`, `nonAllocatable` | Allocatable may be consumed downstream; qualified is descriptive with explicit conditions; nonAllocatable cannot be offered. |

Rules:

- Intervals MAY accompany `partial`, `stale`, or `qualified` results, but their coverage and restrictions MUST be explicit.
- Totals MAY always be calculated for returned intervals, but only current, valid, completely covered, liability-resolved, allocatable intervals contribute to an unqualified allocatable total.
- `unavailable`, `protected`, and `invalid` MUST NOT be represented as zero Capacity.
- Every non-current, non-complete, non-valid, unresolved, or non-allocatable result requires machine-readable reason provenance suitable for explanation.

## 15. Capacity Read-Model Contract

| Information | Required / Optional / Excluded | Semantic Purpose | Authority / Derivation Source |
|---|---|---|---|
| Query/range identity and exact requested bounds | Required | Reproduce request and clipping | Query intent |
| Component canonical user-days/windows | Required | Temporal ownership | Effective boundary derivation |
| Coverage bounds/completeness | Required | Prevent partial truth appearing complete | Query vs resolved envelopes |
| Capacity interval identity | Required | Stable reference | Semantic derivation identity |
| Interval start/end/duration | Required | Canonical resource topology | Interval derivation |
| User-day totals | Required derived summary | Day-level consumption | Canonical intervals |
| Fully allocatable/qualified totals | Required | Prevent inflated resource claims | Qualifications |
| Longest contiguous interval/count | Required | Minimal fragmentation truth | Canonical intervals |
| Workday/off-day context | Optional | Explain policy-dependent results | Work occurrence context |
| Occupied/protected/general-policy exclusion provenance | Required | Explain absence/change | Authoritative inputs and transforms |
| Unresolved liabilities | Required when present | Prevent double claim | Commitment resolution |
| Dependency fingerprint | Required | Freshness/reproducibility | Authoritative snapshot composition |
| Applicable decision dependencies | Required when present | Explain accepted authority effects | PlanDecision replay |
| Derivation-policy version | Required | Disambiguate semantic rules | Capacity derivation contract |
| Freshness/coverage/integrity/liability/allocability | Required | Truthful consumption | Result evaluation |
| Goal demand/ranking/priority | Excluded | Downstream demand/allocation | Not Capacity |
| Allocation or Proposal | Excluded | Downstream recommendation | Not Capacity |
| Acceptance/scheduled work | Excluded | User authority/planning result | Not Capacity |
| Execution outcome | Excluded | Historical reality | Not Capacity |

## 16. Capacity Query Semantics

A conceptual Capacity query MUST include exact requested temporal bounds or a resolvable canonical scope, the authoritative dependency context, and the Capacity derivation-policy version. Callers MUST NOT supply raw placement-candidate constraints unless those are explicit general policy.

Supported scopes:

- one canonical user-day;
- selected day, resolved to a user-day;
- user-week;
- current planning range;
- arbitrary instant range;
- calendar month as an arbitrary presentation range.

Rules:

1. User-day is the default temporal interpretation for day labels.
2. Non-aligned ranges return component user-days with partial coverage at the edges.
3. Each component user-day resolves its own effective preferences; a range may therefore contain different boundaries and durations.
4. Results MUST include canonical component user-days rather than only aggregate totals.
5. Protected/invalid dependencies yield protected/invalid integrity, not empty Capacity.
6. A stale retained result may be returned only as explicitly stale; a current query recomputes against current dependencies.
7. The query abstraction owns scheduler composition so consumers never call private occupied/open-window helpers.

## 17. Authority and Persistence

Current Capacity is:

- non-authoritative;
- deterministically derived;
- reproducible from its authoritative dependencies and policy version;
- disposable and replaceable;
- not independently editable;
- not a command surface;
- not independently backed up or restored as authored state.

Caching is an implementation optimization and MUST NOT confer authority.

Historical Capacity context MAY be frozen only when another authoritative event—such as a future accepted allocation, accepted Proposal, or governed plan publication—requires preservation of the resource context that informed it.

Such a snapshot:

- becomes immutable historical provenance of that event;
- does not become authored intent or current Capacity;
- does not update after later edits;
- cannot be replayed as authority by itself;
- MUST carry dependency and derivation-policy identity;
- SHOULD be bounded to decision-relevant user-days/intervals rather than every Capacity read.

## 18. Dependency Identity and Derivation Version

Every Capacity result MUST carry a semantic dependency fingerprint or equivalent identity covering all facts capable of changing that result:

- source IDs and incarnations;
- mutable scheduling values or their revisions/canonical fingerprints;
- expanded occurrence identities and relevant resolved values;
- applicable PlanDecision IDs and semantic content/replay status;
- effective scheduling preferences and user-day windows;
- query coverage;
- explicit general availability policy identity/version/content;
- unresolved-liability facts;
- Capacity derivation-policy version.

Source incarnation is required but insufficient: same-lifetime edits to duration, buffers, fixed time, recurrence, or preferences MUST change dependency identity.

No hashing technology is prescribed. Equivalent canonical inputs MUST yield equivalent dependency identity; irrelevant ordering, presentation state, and Goal selection MUST NOT affect it.

The derivation-policy version identifies the semantic rules used to interpret dependencies. A material change to inclusion, exclusion, liability, temporal, aggregation, or qualification rules MUST change this version even when authored data is unchanged.

## 19. Staleness and Invalidation

A retained Capacity result is stale when its dependency fingerprint or derivation-policy version no longer matches the current derivation context.

Invalidating changes include relevant shift definition, cycle, segment, recurrence, Commitment creation/deletion/recreation, duration, placement/fixed time, relational rule, manual event, buffer, user-day boundary, effective scheduling preference, applicable PlanDecision, source incarnation, general availability policy, query coverage, or Capacity-policy change.

Staleness is fundamentally **dependency-scoped**, then projected to affected intervals/user-days/ranges. It is neither inherently global nor merely UI-local.

Rules:

1. Only results depending on changed facts become stale.
2. If impact cannot be bounded safely, invalidate the containing requested range.
3. A stale result remains historical derived information and MUST NOT be allocated.
4. A new current query recomputes Capacity; it does not “unstale” the old object.
5. Durability-only retry that does not change semantic authority MUST NOT invalidate Capacity.
6. Preview's boolean staleness is a compatible workflow precedent, not the Capacity state model.

## 20. Provenance and Explainability

Minimum provenance categories are:

- temporal envelope and user-day-boundary resolution;
- occupied-time contributors;
- protected-time contributors and buffer side/duration;
- general-policy inclusions/exclusions;
- applicable accepted-decision effects;
- unresolved Commitment liabilities;
- unsupported, invalid, or protected dependencies;
- query clipping and uncovered bounds;
- source lifetime/revision or canonical mutable-state identity;
- dependency fingerprint and derivation-policy version;
- transformation stages responsible for inclusion/exclusion.

Current results MAY reference authoritative sources by durable identity plus the dependency snapshot. Facts needed to interpret the result after those sources change MUST be frozen in any historical context snapshot. A bare source ID is insufficient for historical explanation.

Provenance MUST enable answers to why an interval exists, why time is unavailable or merely protected, why allocability is qualified, and what changed between two derivations. UI design is outside this specification.

## 21. Capacity → Goal Demand Contract

Goal-demand feasibility may consume only:

- current valid Capacity interval identities;
- exact boundaries, duration, and owning user-day;
- coverage and allocability qualifications;
- contiguity/interval count and range context;
- demand-neutral general eligibility attributes;
- dependency and derivation identity for traceability.

It MUST NOT need Work-generation, recurrence, manual-event, buffer, PlanDecision, source-incarnation, or boundary-calculation internals.

Capacity MUST NOT supply Goal priority, ranking, recommended Goal, preferred allocation, Proposal content, inferred intent, or accepted schedule. Goal demand describes requested resource characteristics; it neither creates Capacity nor owns time until a later accepted allocation creates authorized planning intent.

## 22. Capacity → Allocation → Proposal Boundary

The normative downstream flow is:

```text
Capacity
  → Goal-Specific Feasibility
  → Competing Demand
  → Allocation Reasoning
  → Proposal
  → User Decision
```

Capacity does not compare Goal importance, resolve competition, choose shares, construct a schedule, or authorize work. Allocation MAY provisionally reference/partition Capacity but MUST NOT mutate it. Proposal MAY recommend an allocation, retaining Capacity and demand provenance. Only explicit user acceptance may create accepted allocation or scheduled discretionary intent.

Learned or historical preferences may inform future allocation/Proposal reasoning only as explicit derived evidence; they MUST NOT change current Capacity or impersonate present user choice.

## 23. Capacity vs Friction Boundary

| Case | Classification |
|---|---|
| User has little Capacity | Capacity fact |
| Capacity is fragmented | Capacity fact/summary |
| One Goal demand cannot fit | Goal-specific feasibility result |
| Several Goals collectively exceed Capacity | Allocation problem; not Friction before authority |
| Authored Commitment cannot be placed | Unresolved Commitment liability and existing corrective Friction |
| Accepted allocation later becomes infeasible | Friction requiring corrective decision |
| Capacity result is stale | Stale derived result; not Friction |
| Capacity cannot be fully determined due to liability | Qualified/unavailable Capacity plus liability; Friction may independently describe the unplaced Commitment |

Limited resources MUST NOT generate Friction by themselves. Friction begins when existing authored/accepted intent or an attempted authoritative plan cannot coexist and requires attention or recovery.

## 24. Historical and Summary Boundary

| Concept | Architectural category |
|---|---|
| Current available Capacity | Current derived state |
| Capacity offered during a Proposal | Derived Proposal provenance |
| Capacity referenced by accepted allocation | Frozen accepted-plan provenance |
| Allocated Capacity | Accepted planning fact once authorized |
| Capacity left unallocated at acceptance | Historical context derived at that event |
| Scheduled discretionary work | Authorized plan/historical-plan fact |
| Executed discretionary work | Execution history |
| Historical Capacity trends | Derived analytical projection over comparable frozen evidence |

Current authored state MUST NOT be used to rewrite or pretend to reconstruct past Capacity after relevant facts change. Every Capacity read need not be persisted. Only decision-relevant bounded context is eligible for snapshotting, and Summary remains a read-only consumer that must distinguish current, accepted, historical, and analytical truth.

## 25. Existing Primitive Compatibility

| Specification Requirement | Current Support | Future Requirement | Capacity Responsibility? | Evidence |
|---|---|---|---:|---|
| Custom user-day ownership | Existing primitive sufficient | Compose canonical windows | Yes | `core/time/userDay.ts` tests |
| Variable effective boundaries | Existing primitive sufficient | Reuse piecewise resolver | Yes | effective preferences/transition tests |
| Overnight Work | Existing primitive sufficient | Preserve provenance in exclusions | Yes | cycle/preview tests |
| Planning lookaround | Existing primitive requires adaptation | Separate compute envelope from reported coverage | Yes | preview expansion |
| Occupied interval construction | Existing primitive requires adaptation | Generalize beyond candidate scope and retain provenance | Yes | `placeBlockCandidates.ts:677–760` |
| Protected/buffer interval union | Existing primitive requires adaptation | Preserve occupied/protected distinction and contributors | Yes | buffer placement tests |
| Open-window complement | Existing primitive requires adaptation | User-day-wide, identity/provenance-bearing output | Yes | `placeBlockCandidates.ts:621–664` |
| Candidate feasibility | Existing placement primitive; unsuitable as model | Keep downstream demand-specific | No | `findBestAvailableStart` |
| Recurrence expansion | Existing primitive sufficient | Feed resolved Commitment demand | Yes at input boundary | candidate-generation tests |
| Work generation | Existing primitive sufficient | Feed occupied occurrences | Yes at input boundary | cycle Work tests |
| Manual events | Existing primitive sufficient | Feed occupied occurrences/all-day windows | Yes at input boundary | preview tests |
| PlanDecision replay | Existing primitive sufficient | Apply before Capacity; expose dependency | Yes | replay tests |
| Preview staleness | Existing primitive requires adaptation | Dependency-scoped qualifications | Yes | store staleness tests |
| Source incarnation | Existing primitive sufficient but incomplete | Add same-lifetime mutable-state fingerprint | Yes | incarnation tests |
| Capacity interval identity | No current support | New Capacity-specific primitive required | Yes | Prior audit |
| Qualification/coverage model | No current support | New Capacity-specific primitive required | Yes | Prior audit |
| Dependency fingerprint/policy version | Partial fingerprints elsewhere | New Capacity composition required | Yes | Authority patterns |
| Goal feasibility/ranking | Not implemented | Downstream responsibility — not Capacity | No | Goal absent from generation |
| Historical Capacity snapshot | Publication pattern exists | Adapt only at future authority transition | Boundary only | historical-plan publication |

## 26. Normative Semantic Examples

### Example A — Ordinary Workday

User-day is Tuesday 03:00–Wednesday 03:00. Work occupies 08:00–16:00, an appointment 17:00–18:00, and Sleep 22:30–Wednesday 06:30 (the portion through Wednesday 03:00 affects Tuesday). With no other exclusions, Tuesday Capacity MUST be separate intervals 06:30–08:00, 16:00–17:00, and 18:00–22:30. The total MUST NOT replace those intervals.

### Example B — Fragmented Capacity

Intervals 09:00–09:30, 10:30–11:00, and 13:00–13:30 MUST report 90 total minutes, three intervals, and a 30-minute longest contiguous interval. They MUST NOT be represented as one 90-minute opportunity.

### Example C — Goal-Specific Incompatibility

One 90-minute evening Capacity interval satisfies Goal A's 60-minute evening demand but not Goal B's 120-minute contiguous demand. General Capacity MUST remain 90 minutes in both evaluations; only feasibility differs.

### Example D — Overnight Shift

With a 03:00 boundary, Work Monday 22:00–Tuesday 06:00 is an overnight obligation with Monday source-day provenance. Capacity intervals MUST be split and owned according to exact canonical user-day windows, not midnight. Any eligible interval crossing Tuesday 03:00 becomes two Capacity units; calendar-date totals MUST NOT redefine ownership.

### Example E — Buffer Protection

Commitment A ends 10:00 with a 30-minute after-buffer; Commitment B begins 14:00 with a 30-minute before-buffer. Chronological free time is 10:00–14:00, but Capacity is at most 10:30–13:30. Provenance MUST label the excluded hour as protected rather than occupied.

### Example F — Unresolved Commitment Liability

A two-hour movable Commitment is unplaced, and the day has three raw openings totaling three hours. Openings inside the Commitment's eligible placement scope MAY be returned descriptively but MUST be qualified and excluded from fully allocatable totals. Provably independent openings MAY remain allocatable. If scope cannot be bounded, the user-day MUST be non-allocatable.

### Example G — Off-Day Policy Boundary

On an off-day, absence of Work creates geometric openings. If the user explicitly selected Preserve Routine, resolved routine constraints MAY reduce general Capacity; if Adapt to Off Days is selected, different openings MAY qualify. With no selected policy, DayFrame MUST NOT infer either. It reports only what current authoritative rules support and qualifies any unresolved dependency.

## 27. Capacity Invariants

1. **CAP-INV-01:** Capacity MUST be derived, never authored.
2. **CAP-INV-02:** Time-owning Commitments and universally applicable constraints MUST shape general Capacity.
3. **CAP-INV-03:** Capacity MUST NOT be equated with chronological free time.
4. **CAP-INV-04:** Capacity MUST NOT be equated with candidate-specific placement openings.
5. **CAP-INV-05:** Goals MUST NOT create Capacity merely by existing.
6. **CAP-INV-06:** Capacity MUST NOT decide which Goal receives time.
7. **CAP-INV-07:** General Capacity MAY exist when a particular or every current Goal cannot use it.
8. **CAP-INV-08:** Every Capacity interval MUST belong to exactly one effective canonical DayFrame user-day window.
9. **CAP-INV-09:** Identical authoritative dependencies and derivation-policy version MUST produce semantically identical Capacity.
10. **CAP-INV-10:** Every Capacity inclusion, exclusion, qualification, and change MUST be explainable from dependencies and rules.
11. **CAP-INV-11:** A relevant dependency or derivation-policy change MUST invalidate affected retained results.
12. **CAP-INV-12:** Capacity MUST remain distinct from Proposal and MUST NOT recommend action.
13. **CAP-INV-13:** Capacity MUST remain distinct from Friction; scarcity alone MUST NOT create Friction.
14. **CAP-INV-14:** Unresolved time-owning demand MUST NOT be simultaneously counted as fully allocatable Capacity.
15. **CAP-INV-15:** Protected time MUST remain distinguishable from occupied time.
16. **CAP-INV-16:** Partial, qualified, stale, protected, invalid, or unresolved results MUST NOT masquerade as complete allocatable Capacity.
17. **CAP-INV-17:** Aggregation MUST preserve canonical interval topology and user-day ownership.
18. **CAP-INV-18:** Touching intervals across user-day boundaries MUST remain distinct Capacity units.
19. **CAP-INV-19:** Downstream feasibility, allocation, and Proposal processing MUST NOT mutate Capacity.
20. **CAP-INV-20:** Current Capacity MUST NOT be reconstructed from a historical snapshot or vice versa.
21. **CAP-INV-21:** Historical Capacity context MUST remain immutable and non-authoritative for current planning.
22. **CAP-INV-22:** A result with unreadable or invalid required authority MUST report uncertainty, not zero Capacity.

## 28. Architecture Decisions

### CAP-SPEC-01 — Normative Capacity Definition

- **Decision:** Adopt section 3's definition.
- **Normative Rule:** Capacity MUST be a derived, demand-neutral, explainable user-day interval resource.
- **Reasoning:** It preserves resource truth without absorbing downstream authority.
- **Consequences:** Totals alone are non-conforming.
- **Implementation Constraint:** Provide intervals, qualifications, and provenance.
- **Remaining Downstream Question:** None for Capacity.

### CAP-SPEC-02 — Canonical Capacity Unit

- **Decision:** One interval owned by one canonical user-day.
- **Normative Rule:** No unit may cross a user-day boundary.
- **Reasoning:** Overnight and variable-boundary correctness require explicit ownership.
- **Consequences:** Touching cross-boundary intervals remain separate.
- **Implementation Constraint:** Use exact canonical windows.
- **Remaining Downstream Question:** Presentation grouping only.

### CAP-SPEC-03 — Derivation Pipeline

- **Decision:** Adopt the layered pipeline in section 6.
- **Normative Rule:** Optimizations MUST preserve stage semantics and provenance.
- **Reasoning:** Geometry, eligibility, and liability have different meanings.
- **Consequences:** Existing candidate helper cannot define Capacity wholesale.
- **Implementation Constraint:** Deterministic interval composition.
- **Remaining Downstream Question:** None.

### CAP-SPEC-04 — Time-Ownership Boundary

- **Decision:** Authorized obligation demand owns time; constraints only restrict it.
- **Normative Rule:** Flexible placement MUST NOT make authored demand discretionary.
- **Reasoning:** Prevents unplaced commitments from appearing free.
- **Consequences:** Unresolved demand becomes liability.
- **Implementation Constraint:** Enumerate supported source families and occurrence identities.
- **Remaining Downstream Question:** Future unified Commitment model.

### CAP-SPEC-05 — Protected-Time Boundary

- **Decision:** Protected and occupied intervals are arithmetically excluded but semantically distinct.
- **Normative Rule:** Buffers MUST NOT become activities or execution evidence.
- **Reasoning:** Explanation and future attached activities require the distinction.
- **Consequences:** Exclusion provenance carries kind and contributors.
- **Implementation Constraint:** Union intervals without discarding provenance.
- **Remaining Downstream Question:** Attached-activity architecture.

### CAP-SPEC-06 — Unresolved Commitment Liability

- **Decision:** Use scoped conservative qualification.
- **Normative Rule:** Affected openings MUST NOT enter fully allocatable totals; unbounded scope blocks affected coverage.
- **Reasoning:** Prevents double claiming without discarding provably independent Capacity.
- **Consequences:** Liability and allocability are orthogonal result dimensions.
- **Implementation Constraint:** Resolve or conservatively bound eligible claim scope.
- **Remaining Downstream Question:** User workflow for resolving liability.

### CAP-SPEC-07 — General Eligibility Boundary

- **Decision:** Only mandatory universal constraints and explicit general policy affect Capacity eligibility.
- **Normative Rule:** Demand-specific preferences MUST remain downstream.
- **Reasoning:** General Capacity must be demand-neutral.
- **Consequences:** Preference authority must be classified before use.
- **Implementation Constraint:** Record policy identity/version.
- **Remaining Downstream Question:** Future policy authoring UX.

### CAP-SPEC-08 — General Capacity vs Goal-Specific Feasibility

- **Decision:** Separate immutable Capacity from pure demand evaluation.
- **Normative Rule:** A feasibility result MUST reference, never redefine, Capacity.
- **Reasoning:** Different Goals can evaluate the same resource differently.
- **Consequences:** No Goal IDs in canonical Capacity.
- **Implementation Constraint:** Stable consumer contract.
- **Remaining Downstream Question:** Goal-demand schema.

### CAP-SPEC-09 — Temporal and User-Day Semantics

- **Decision:** Effective canonical user-day windows govern all interval ownership.
- **Normative Rule:** Midnight and fixed 24-hour assumptions are forbidden.
- **Reasoning:** Current product supports overnight and boundary transitions.
- **Consequences:** Range results are compositions of variable windows.
- **Implementation Constraint:** Reuse canonical piecewise resolver.
- **Remaining Downstream Question:** None.

### CAP-SPEC-10 — Aggregation Semantics

- **Decision:** Intervals are canonical; summaries are projections.
- **Normative Rule:** Aggregation MUST retain topology, qualifications, coverage, and user-day ownership.
- **Reasoning:** Ninety fragmented minutes are not one 90-minute opportunity.
- **Consequences:** No V1 fragmentation score is required.
- **Implementation Constraint:** Separate allocatable and qualified totals.
- **Remaining Downstream Question:** Presentation metrics.

### CAP-SPEC-11 — Result-State / Qualification Model

- **Decision:** Use orthogonal freshness, coverage, integrity, liability, and allocability.
- **Normative Rule:** Unavailable/protected/invalid MUST NOT mean zero.
- **Reasoning:** One enum creates ambiguous combinatorial states.
- **Consequences:** Consumers gate allocation explicitly.
- **Implementation Constraint:** Machine-readable reasons for non-ideal dimensions.
- **Remaining Downstream Question:** Exact implementation labels.

### CAP-SPEC-12 — Read-Model Contract

- **Decision:** Adopt section 15's minimum information set.
- **Normative Rule:** Capacity MUST expose resource truth and exclude downstream decisions.
- **Reasoning:** Consumers must not reinterpret scheduler internals.
- **Consequences:** A dedicated read model is required.
- **Implementation Constraint:** No Goal ranking, Proposal, or execution fields.
- **Remaining Downstream Question:** API shape.

### CAP-SPEC-13 — Query Semantics

- **Decision:** Support user-day and range queries composed from canonical component days.
- **Normative Rule:** Non-aligned edges MUST report partial coverage.
- **Reasoning:** Range convenience cannot redefine temporal truth.
- **Consequences:** Month/week are scopes, not new models.
- **Implementation Constraint:** Resolve per-day effective preferences.
- **Remaining Downstream Question:** Default UX horizon.

### CAP-SPEC-14 — Current Authority and Persistence

- **Decision:** Current Capacity is disposable derived state.
- **Normative Rule:** It MUST NOT be independently edited, backed up, or restored as authority.
- **Reasoning:** Persisted derivation would compete with authored truth.
- **Consequences:** Caching confers no authority.
- **Implementation Constraint:** Recompute or validate dependency identity.
- **Remaining Downstream Question:** Cache strategy.

### CAP-SPEC-15 — Historical Snapshot Boundary

- **Decision:** Snapshot bounded context only when another authoritative event requires it.
- **Normative Rule:** Historical snapshots MUST be immutable and MUST NOT become current Capacity.
- **Reasoning:** Past context cannot safely be reconstructed after edits.
- **Consequences:** Not every read is persisted.
- **Implementation Constraint:** Snapshot host is defined with future accepted authority.
- **Remaining Downstream Question:** Accepted-allocation/Proposal persistence design.

### CAP-SPEC-16 — Dependency Identity

- **Decision:** Require canonical semantic dependency fingerprints.
- **Normative Rule:** Every Capacity-affecting fact MUST contribute; irrelevant ordering MUST NOT.
- **Reasoning:** Incarnation alone misses same-lifetime edits.
- **Consequences:** Freshness can be verified deterministically.
- **Implementation Constraint:** Canonicalize dependency content without prescribing hashing.
- **Remaining Downstream Question:** Encoding technology.

### CAP-SPEC-17 — Derivation Policy Version

- **Decision:** Version Capacity interpretation independently of authored data.
- **Normative Rule:** Material rule changes MUST change the version.
- **Reasoning:** Same facts under different semantics are different derivations.
- **Consequences:** Historical explanation retains its policy identity.
- **Implementation Constraint:** Version participates in identity and provenance.
- **Remaining Downstream Question:** Version release governance.

### CAP-SPEC-18 — Staleness and Invalidation

- **Decision:** Staleness is dependency-scoped and projected to affected coverage.
- **Normative Rule:** Stale Capacity MUST NOT be allocated.
- **Reasoning:** Global invalidation is unnecessarily coarse; UI-only flags are insufficient.
- **Consequences:** Safe fallback invalidates the containing range when impact is unknown.
- **Implementation Constraint:** Compare fingerprints/policy versions.
- **Remaining Downstream Question:** Cache invalidation mechanics.

### CAP-SPEC-19 — Provenance and Explainability

- **Decision:** Require source, exclusion-kind, liability, temporal, decision, coverage, and transformation provenance.
- **Normative Rule:** Every inclusion/exclusion/qualification/change MUST be explainable.
- **Reasoning:** Epistemic integrity is an architectural value.
- **Consequences:** Union operations retain contributors.
- **Implementation Constraint:** Historical snapshots freeze facts needed after source mutation.
- **Remaining Downstream Question:** Explanation UI.

### CAP-SPEC-20 — Goal-Demand Handoff

- **Decision:** Goal demand consumes the stable resource contract in section 21.
- **Normative Rule:** It MUST NOT inspect scheduler internals or mutate Capacity.
- **Reasoning:** Preserves service responsibility.
- **Consequences:** Feasibility references Capacity identity.
- **Implementation Constraint:** Capacity exposes exact intervals and qualifications.
- **Remaining Downstream Question:** Demand semantics.

### CAP-SPEC-21 — Allocation and Proposal Boundary

- **Decision:** Allocation reasons over Capacity; Proposal recommends; user acceptance authorizes.
- **Normative Rule:** Capacity MUST NOT allocate, recommend, or schedule.
- **Reasoning:** User authority requires an explicit boundary.
- **Consequences:** Provisional partitions do not mutate Capacity.
- **Implementation Constraint:** Preserve Capacity/demand provenance downstream.
- **Remaining Downstream Question:** Allocation and Proposal models.

### CAP-SPEC-22 — Friction Boundary

- **Decision:** Scarcity/fragmentation are facts; Friction begins with incompatible authored/accepted intent.
- **Normative Rule:** Capacity derivation MUST NOT create Friction merely for limited resources.
- **Reasoning:** Capacity is descriptive and Friction corrective.
- **Consequences:** Infeasible Goal demand is a feasibility result before authority.
- **Implementation Constraint:** Liability may be referenced by, but is not replaced with, Friction.
- **Remaining Downstream Question:** Transition when future accepted allocation becomes infeasible.

## 29. Boundary Matrix

| Concept | Authored? | Derived? | Owns Time? | Describes Resource? | Expresses Demand? | Allocates Resource? | Recommends Action? | Requires User Acceptance Before Scheduling? |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Commitment | Yes | Occurrence derived | Yes | No | Obligation demand | No | No | Authored authority already required |
| Protected Time | Constraint authored; interval derived | Yes | No | Describes exclusion | No | No | No | No |
| Chronological Free Time | No | Yes | No | Raw remainder | No | No | No | No |
| Geometric Opening | No | Yes | No | Geometric resource candidate | No | No | No | No |
| Capacity | No | Yes | No | Yes | No | No | No | No |
| Goal | Yes | No | No | No | Outcome intent only | No | No | Goal authoring only |
| Goal Demand | Authored/approved future contract | May be projected | No | No | Yes | No | No | Before it creates scheduled intent |
| Feasible Opportunity | No | Yes | No | References compatible resource | Evaluates demand | No | No | No |
| Allocation | No until accepted | Yes/provisional | No | Assigns resource | Resolves demand | Yes provisionally | No | Yes |
| Proposal | No | Yes | No | References Capacity | Represents proposed satisfaction | References allocation | Yes | Yes |
| Accepted Allocation | Yes through acceptance | Based on derivation | Authorizes time claim | Records assigned resource | Resolves accepted demand | Yes | No | It is the acceptance result |
| Scheduled Work | Authorized | Placement derived | Yes | No | Realizes demand | Consumes allocation | No | Yes for discretionary Proposal work |
| Friction | No | Yes | No | No | No | No | Corrective alternatives may | Yes for corrective mutations |

The matrix contains no semantic leakage from Capacity into demand, allocation, recommendation, or authority.

## 30. Specification Consistency Checks

| # | Check | Result |
|---:|---|---|
| 1 | Can Capacity exist without Goals? | **Yes.** It is demand-neutral. |
| 2 | Can a Goal exist without consuming Capacity? | **Yes.** Goal existence owns no time. |
| 3 | Can Capacity exist that no Goal can use? | **Yes.** Feasibility differs from resource existence. |
| 4 | Can free time exist without Capacity? | **Yes.** Protected, ineligible, or liability-affected time may be free but not allocatable. |
| 5 | Can protected time exist without occupation? | **Yes.** Buffers are normative examples. |
| 6 | Can fragmentation be represented truthfully? | **Yes.** Canonical intervals plus count/longest duration preserve it. |
| 7 | Can Capacity remain valid across midnight? | **Yes.** Exact instants remain valid; ownership follows user-day boundaries. |
| 8 | Can it distinguish different user-day boundaries? | **Yes.** Each component carries its exact effective window. |
| 9 | Can unresolved demand prevent double allocation? | **Yes.** Scoped liabilities qualify/block affected intervals and totals. |
| 10 | Can it be recomputed deterministically? | **Yes.** Dependency fingerprint and policy version define equivalence. |
| 11 | Can stale Capacity be recognized? | **Yes.** Freshness is orthogonal and fingerprint-based. |
| 12 | Can interval inclusion/exclusion be explained? | **Yes.** Required provenance covers all derivation stages. |
| 13 | Can Goal demand consume without scheduler internals? | **Yes.** Section 21 defines the stable handoff. |
| 14 | Can allocation reason without modifying Capacity? | **Yes.** Downstream objects reference immutable derived intervals. |
| 15 | Can Proposal recommend without Capacity becoming authority? | **Yes.** Proposal is separately derived and acceptance is explicit. |
| 16 | Can limited Capacity exist without Friction? | **Yes.** Scarcity is descriptive. |
| 17 | Can historical context stay immutable after edits? | **Yes.** Selective snapshots are immutable event provenance. |
| 18 | Can totals be calculated without destroying interval truth? | **Yes.** Totals are reproducible summaries, never replacements. |
| 19 | Can future attached activities remain meaningful? | **Yes.** They may enter as occupied activities rather than buffers. |
| 20 | Can this be implemented without promoting engine reasoning to intent? | **Yes.** Current Capacity is non-authoritative and downstream acceptance remains mandatory. |

All checks pass. No scenario requires weakening a Capacity invariant. Goal-demand, allocation, Proposal, attached-activity, and acceptance schema details are intentionally downstream rather than specification contradictions.

## 31. Implementation Constraints

A conforming future implementation MUST:

1. derive Capacity deterministically from explicit authoritative dependencies;
2. preserve authored, derived, accepted, scheduled, executed, and historical categories;
3. use canonical piecewise user-day windows rather than calendar dates or fixed 24-hour assumptions;
4. preserve overnight Work and irregular shift provenance;
5. reject stale source lifetimes and fingerprint same-lifetime mutable values;
6. apply relevant accepted PlanDecisions before resolving current Capacity;
7. distinguish occupied from protected exclusions;
8. union exclusions without losing contributors;
9. represent unresolved Commitment liabilities conservatively;
10. prevent qualified/partial/stale/invalid results from inflating allocatable totals;
11. expose exact intervals before scalar aggregates;
12. keep Goal identity, ranking, demand, allocation, Proposal, acceptance, execution, and Summary concerns out of the Capacity model;
13. provide dependency and derivation-policy identity;
14. support explicit explanation of inclusion, exclusion, qualification, and change;
15. treat caching as non-authoritative;
16. preserve immutable historical snapshots only at governed authority transitions;
17. avoid changing current placement behavior merely to introduce the read model;
18. reuse existing primitives only according to section 25's compatibility classification.

This specification does not authorize production types, selectors, commands, persistence, UI, tests, schema changes, or scheduling changes.

## 32. Downstream Open Questions

The following are genuinely downstream and do not leave Capacity architecture unresolved:

1. How does a Goal express duration, contiguity, cadence, splittability, timing, and work-relative demand?
2. Is Goal demand explicitly authored, deterministically derived from Goal configuration, or both with separate provenance?
3. How are Goal priority and user decision preferences represented without becoming Capacity inputs?
4. How does allocation compare compatible demands and preserve fairness/explainability?
5. What is Proposal identity, scope, rejection, modification, expiration, and provenance?
6. What exact acceptance event creates an Accepted Allocation?
7. When accepted allocation becomes infeasible, how does corrective Friction reference it?
8. Which authoritative event hosts a historical Capacity-context snapshot?
9. What bounded snapshot facts are required by Summary analytics?
10. How are attached activities modeled as time-owning sources?
11. What UI terminology exposes Capacity without implying recommendations?
12. What implementation sequence introduces the read model safely into the current scheduler?

## 33. Specification Conclusions

Capacity is now formally bounded as a deterministic, explainable, demand-neutral interval resource. It is neither blank calendar time nor candidate placement output. Its truth depends on exact user-day envelopes, resolved time-owning occurrences, protected intervals, accepted decisions, explicit general policy, authoritative dependency identity, and conservative handling of unresolved demand.

The orthogonal qualification model prevents absence, uncertainty, incompleteness, staleness, and non-allocability from collapsing into a misleading zero. The canonical interval unit and aggregation rules preserve fragmentation and overnight correctness. The consumer contract prevents future Goal demand from interpreting private scheduler internals, while the authority model prevents Capacity from becoming Proposal or scheduled intent.

No material conflict with accepted DayFrame architecture was found. Current primitives are compatible but insufficient without adaptation and new Capacity-specific composition.

## 34. Recommended Next Step

**Path B — Goal Demand and Allocation Architecture Audit.**

Capacity is fully specified. The principal architectural unknown is now how Goals express resource demand, how demand is evaluated against Capacity, and how competing compatible demands enter allocation reasoning before a Proposal is produced.

Path A is not primary because implementation sequencing before Goal-demand boundaries are understood risks shaping Capacity consumers around accidental assumptions. Path C is unnecessary because no unresolved executable behavior blocks the specification. Path D is unnecessary because no accepted-architecture conflict was found.

This recommendation does not begin the next audit and does not assign it to any implementation phase.

## 35. Completion Statement

> **Capacity Architecture Specification complete.**
>
> The specification establishes Capacity as a deterministic, explainable, user-day-based derived planning resource; defines its authoritative inputs, derivation model, temporal semantics, unresolved-Commitment treatment, result qualifications, read-model contract, dependency identity, staleness, provenance, aggregation, historical boundary, and downstream Goal-demand interface; preserves the authority boundaries separating Capacity from allocation, Proposal, Friction, and scheduled work; and identifies the appropriate next architectural step without modifying the implementation or assigning the work to a future implementation phase.
