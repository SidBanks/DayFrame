# Constructive Proposal Architecture Audit Result

## 1. Executive Findings

DayFrame is **CP3 overall, with CP4 as the only current recommendation producer**. It has deterministic candidate generation, placement, corrective alternatives, accepted occurrence decisions, replay, persistence, immutable schedule snapshots, and execution evidence. It has no first-class constructive Proposal, Capacity-to-Goal recommendation, Goal Allocation, or accept/modify/reject lifecycle for discretionary Goal work.

Found Time is **FT3 — Planned/Actual Primitives Without Found-Time Semantics**. Planned snapshots, skipped/completed/partial outcomes, and optional actual timestamps/durations could support some variance calculation, but no executable detector, remaining-liability subtraction, Live Capacity query, Goal matching, or Found-Time Proposal exists.

The architectural boundary is clear: Preview realizes existing authority; Friction corrects already-authorized conflicts; Proposal must mediate new derived recommendations and explicit bounded user authority. The upstream specifications are sufficient to proceed with **Path A — Constructive Proposal Architecture Specification**; Found Time should be a Live input/use case of that architecture.

## 2. Audit Scope and Method

This was a read-only semantic trace of production paths and focused tests. Claims use **Confirmed** for executed code/tests, **Inferred** for strongly implied seams, and **Not Found** after semantic search. Principal evidence: `src/core/engine/generateSchedulePreview.ts:33-248`, `src/core/engine/reviseSchedulePreview.ts:26-98`, `src/core/blocks/types.ts:59-190`, `src/core/blocks/generateBlockCandidates.ts`, `src/core/blocks/placeBlockCandidates.ts`, `src/core/friction/*`, `src/core/decisions/*`, `src/core/historicalPlan/materializePlanPublication.ts:29-154`, `src/core/execution/executionRecord.ts:65-121`, and `src/state/todayQuery.ts:17-80`.

## 3. Architectural Context

Accepted architecture places Capacity, normalized eligible Goal Demand, structural eligibility, composite feasibility, and Allocation upstream of Proposal. Proposal neither owns time nor creates those inputs. Commitments remain scheduling authority; Goals remain outcomes; user acceptance is required before Goal-driven discretionary work owns time.

## 4. Current Planning Entry Points

Confirmed flow: authored shifts, manual events, templates and recurrences enter `generateSchedulePreview`; recurrence expansion yields `BlockCandidate`; work/manual facts join deterministic placement; accepted `PlanDecision`s replay; Friction and fixes are derived; store `generatePreview` retains the projection and marks it stale after relevant authored changes; `reviseSchedulePreview` applies one corrective fix; publication rejects missing/stale/revised preview and materializes immutable occurrences. User authority enters through authored setup, manual events, recurrence patterns, and accepted occurrence decisions—not through generation.

## 5. Preview Semantics

Preview is a derived candidate schedule of already-authored authority, enriched with corrective diagnostics. It is not an offer of new Goal work and generation creates no new user-authored intent. Although it is provisional before publication, “provisional” is not equivalent to “Proposal.”

## 6. Automatic Placement

Flexible recurring placements are deterministic realizations of the user's previously authored Commitment/recurrence authority. Exact placement is heuristic and regenerable; it does not require acceptance per occurrence unless the user overrides it. Treating it as a new Proposal would erase the difference between prior authority and new discretionary allocation.

## 7. Planning Candidates

`BlockCandidate` is an authorized recurrence occurrence awaiting geometry; an unplaced candidate is that same obligation without a feasible placement. Preview scheduled blocks are placed projections. Suggested fixes are corrective options. Manual events and generated Work are authored/derived schedule facts. None means “work DayFrame thinks the user might choose.”

## 8. Candidate Semantics Matrix

| Candidate-Like Object | Source Authority | Already Authorized? | Time-Owned Yet? | Engine Chooses Placement? | Requires User Acceptance? | Proposal Analogue? |
|---|---|---:|---:|---:|---:|---:|
| `BlockCandidate` | Template + recurrence | Yes | Occurrence yes; exact time maybe no | Yes | No | No |
| Unplaced candidate | Same | Yes | Obligation, not interval | Attempted | Only to change/omit | No |
| Preview scheduled block | Authored occurrence/manual/work | Yes | Projected interval | Often | No | No |
| Generated Work block | Shift authority | Yes | Yes | Rule-derived | No | No |
| Manual event | Direct authoring | Yes | Yes | No | Already authored | No |
| Friction point | Derived conflict | N/A | N/A | No | No | Diagnostic only |
| `SuggestedFix` | Derived corrective option | No | No | Generates alternative | Yes to apply durably | Partial infrastructure |
| `PlanDecision` | User acceptance | Yes | Bounded occurrence override | Replayed | Already accepted | Decision analogue |
| Goal-linked occurrence | Commitment + explicit Goal link | Yes | Via Commitment | As above | No new Goal acceptance | No |

## 9. Goals in Planning

Confirmed: Goals link to Commitment source identities; publication freezes matching Goal snapshots (`materializePlanPublication.ts:139-154`); execution can then contribute to Goal Activity while Progress observations remain separate. Not Found: Goal influence on recurrence expansion, candidate creation/priority, placement, Friction, fix generation, or PlanDecision. Summary consumes history; it does not feed planning.

## 10. Goal Demand Executable Support

**Not Found.** Demand Intent/Projection, requested effort, useful session sizes, splittability, Goal timing, structural normalization, competing demand, and satisfaction attribution exist only in accepted architecture documents, not production planning types or paths.

## 11. Capacity Executable Support

**Not Found as a first-class read model.** Placement discovers geometric openings for authorized candidates, but it is not liability-aware, demand-neutral Capacity output and is not consumed by a Proposal path. Empty geometry must not be promoted to Capacity semantics.

## 12. Constructive Recommendation Search

Searches for proposal/recommendation/allocation/opportunity/free-time/capacity/next-action concepts found no production Capacity→Goal recommendation. “Candidate” denotes authorized recurrence geometry; “suggested” denotes Friction fixes; generic allocation wording concerns identifier/construction failure, not resource allocation.

## 13. Friction Suggested Fixes

Confirmed: conflict/unplaced/work-required-skip inputs produce deterministic corrective actions such as move, skip, reduce duration, change priority/fixed time, recovery/resource/conflict handling (`friction/types.ts:9-98`). Options carry IDs, explanations/context, applicability classification, selection, and feedback. Accepted durable actions become occurrence-scoped `PlanDecision`s and replay. They do not create Goal Demand or allocate unused Capacity.

## 14. Proposal vs Friction

| Concern | Constructive Proposal | Corrective Friction | Current Implementation |
|---|---|---|---|
| Trigger | Available resource + unmet demand | Incompatible authorized facts | Friction only |
| Input authority | Derived inputs, no new authority | Existing authority | Existing schedule |
| Capacity relationship | Consumes Capacity | Conflict geometry | Openings only |
| Goal Demand relationship | Consumes it | None required | None |
| Existing conflict required? | No | Yes | Yes for recommendation |
| Suggest alternatives? | Usually | Yes | Corrective alternatives |
| User acceptance? | Before time ownership | Before durable fix | Fix acceptance only |
| Rejection? | Should be explicit evidence | Dismissal possible | Not persisted |
| Creates new scheduling intent? | On acceptance | Normally changes intent | Occurrence override |
| Modifies existing intent? | Optional user delta | Yes | Yes |
| Historical provenance? | Required | Partial decision provenance | Limited |

## 15. SuggestedFix Reuse

Deterministic generation and option presentation are **Reusable with Adaptation**. Identity is transient/contextual and ranking/explanation are Friction-specific. Target references, action vocabulary, application, acceptance, and applicability are **Conceptually Related but Wrong Abstraction** for constructive work. Modification lineage, rejection, and historical recommendation preservation are **Not Found**.

## 16. PlanDecision

`PlanDecisionV1` has UUID, durable occurrence target, `acceptedAt`, user/suggested-fix provenance, and four actions: place, omit, set duration, set priority (`planDecision.ts:27-48`). It persists, restores, replays, becomes applied/inapplicable/blocked as appropriate, and is user-visible as an accepted choice. It is general occurrence override authority, not general Proposal acceptance or Allocation.

## 17. PlanDecision Reuse Boundary

Stable decision identity, timestamp, durable target, validation, semantic equality, replay/applicability patterns, persistence, restore, and visible accepted choices are reusable with adaptation. Its occurrence-only target, corrective payloads, binary accepted existence, narrow provenance, and lack of proposal/options/delta/rejection/scope make the domain object unsafe to stretch into Proposal.

## 18. Accepted Choices

Accepted Choices show persisted user-approved occurrence decisions and replay state. They do not retain rejected options, original recommendation plus modification delta, decision-time Capacity/Demand, explanation, or reusable preference scope. They are sufficient authority for current overrides, not sufficient Proposal history.

## 19. Accepted Choice vs Learned Preference

Current decisions are particular accepted choices. No code promotes them, infers patterns, or applies historical tendency to new planning. Persistence is evidence, not learning or preference authority.

## 20. Proposal Acceptance

**Not Found** for constructive recommendations. Generation itself becomes current Preview without acceptance. Users can author Commitments/manual events or accept corrective occurrence decisions; neither is acceptance of Goal Allocation.

## 21. Proposal Modification

**Not Found.** Current fixes may change a schedule and decisions retain final payload plus suggested-fix action, but no object freezes an original constructive recommendation, user delta, and final accepted result.

## 22. Proposal Rejection

**Not Found.** Closing, ignoring, regeneration, and an unplaced candidate are not recorded rejection. No historical rejection evidence exists.

## 23. Direct User Authorization

Confirmed direct paths include Commitment/template plus recurrence authoring, manual events, and occurrence-scoped placement/omit/duration/priority decisions. Proposal must remain optional and must not monopolize authoring.

## 24. Direct Goal Work

Partially represented: a Goal Progress observation can directly record progress, and an `ExecutionRecord` can record an unplanned subject with title/category/user-day/duration. The unplanned execution subject has no Goal reference (`executionRecord.ts:65-110`), so one first-class fact cannot currently say “this unscheduled execution was Goal X work”; users can create separate evidence, but linkage is missing.

## 25. Spontaneous Execution Boundary

Current `subject.kind: "unplanned"` preserves that execution was not scheduled and does not fabricate a Proposal. It cannot distinguish spontaneous Goal work from unrelated unplanned activity in Goal Activity. Future proposed-and-accepted work needs distinct scheduling/proposal provenance.

## 26. Historical Publication Authority

Publication turns a fresh unrevised Preview into immutable day/occurrence snapshots and freezes source identity, plan state, timing provenance, and linked Goal revisions (`materializePlanPublication.ts:29-154`). Future proposed work must acquire accepted bounded authority before entering this pipeline; derived recommendation alone must not be publishable.

## 27. Proposal Historical Provenance

Current history preserves scheduled occurrence, source reference, timing, plan state, and Goal snapshot. It does not preserve Demand, Capacity, feasibility, Goal Priority, Allocation, composite footprint, options, reason, user delta, Proposal acceptance/rejection, or scope.

## 28. Proposal Provenance Matrix

| Decision-Time Fact | Current Primitive | Preserved Today? | Needed? | Historical Risk |
|---|---|---:|---:|---|
| Goal | Historical Goal snapshot | Yes for linked occurrence | Yes | Low/partial |
| Demand | None | No | Yes | Unexplainable need |
| Capacity | None | No | Yes | Unexplainable fit |
| Feasibility | Placement result only | No snapshot | Yes | Mutable recomputation |
| Goal Priority | None | No | Yes | Ranking opaque |
| Allocation | None | No | Yes | Choice origin lost |
| Composite footprint | None | No | Yes | Under-costed history |
| Proposed placement | Preview block | Not as proposal | Yes | Proposal/result conflated |
| Alternatives | SuggestedFix only, transient | No constructive | Yes | Choice set lost |
| Explanation | Friction copy | No constructive | Yes | Decision opaque |
| User delta | Final decision payload | Partial | Yes | Original lost |
| Acceptance | `acceptedAt` | Current decisions only | Yes | Wrong authority class |
| Rejection | None | No | Yes | Evidence lost |

## 29. Allocation Analogue Search

Priority sorting, first-fit opening search, preferred windows, and SuggestedFix order are scheduling heuristics, not distribution of Capacity among competing Goal demands. No semantic Allocation analogue exists.

## 30. Priority Semantics

Executable priority belongs to Commitment/candidate occurrences and can be overridden by PlanDecision. Friction severity/order is diagnostic. Goal Priority is absent from production planning. Sorting machinery is reusable technically, but its values cannot stand in for Goal Priority policy.

## 31. Heuristics vs User-Value Authority

First available opening, fixed-before-flexible ordering, occurrence priority, work-relative/preferred windows, fit checks, and stable tie-breaks are engine heuristics. Only explicitly authored settings/priority carry user authority. Future Allocation policy must name its user-value basis rather than inheriting array or placement order.

## 32. Recommendation Explanation

Friction points explain the problem and SuggestedFix labels/actions communicate a local change; applicability/feedback can explain failure. No constructive output explains why a Goal was selected, its cost, alternatives, assumptions, or tradeoffs.

## 33. Recommendation Alternatives

Friction can expose multiple deterministic alternatives and user selection, but accepted history retains only the resulting decision/provenance category, not the entire alternative set. No constructive alternatives exist.

## 34. Proposal Cardinality

Current UI/data supports lists of Friction fixes and many independent occurrence decisions, but no atomic bundle, ranked Goal option set, or independent constructive Proposal set. Final cardinality requires specification.

## 35. Proposal Scope

PlanDecision is one durable occurrence; Preview/publication span a range; recurrence authoring can be open/bounded. No Proposal scope object distinguishes one-off, user-day, bounded set, or recurring authorization. Constructive acceptance must not default to recurrence.

## 36. Proposal Horizon

Existing horizons are preview range, cycle-derived inputs, user-day/week projections, monthly review, and publication range. There is no distinct recommendation horizon.

## 37. Planning Horizon vs Review Scope

Preview generation, Friction detection, review presentation, and publication selections are substantially driven by the requested range. Broader planning data can therefore enlarge review/conflict volume. A bounded Proposal horizon is not independently modeled.

## 38. Short-Horizon Proposal

**Not Found.** User-day queries and bounded preview dates exist, but there is no “now/next interval” constructive reasoning path.

## 39. Live / Today Surface

Today projects the canonical current user-day/current published plan and offers execution reporting. It does not reschedule during Live use, recompute availability, or surface Goal opportunities.

## 40. Current-Time Dependency

Today accepts `evaluationAsOf` and resolves the canonical user day; execution records use user-reported/recorded timestamps. Schedule generation consumes authored planning dates and explicit ranges, not a wall-clock “what can I do now?” dependency.

## 41. Execution Divergence

Execution supports completed, partial, skipped, correction, retraction, optional `occurredAt`, and optional actual duration. Omission is a pre-execution PlanDecision. There is no explicit canceled outcome or automatic early/late classification.

## 42. Planned vs Actual Comparison

The immutable snapshot has scheduled start/end and user evidence may have actual start/duration, so some comparison is computable externally. No production code computes planned-vs-actual duration/start/end, skip release, or buffer release.

## 43. Found-Time Detection

**Not Found** in model, query, Today, Summary, history, or recommendation paths. Searches for found/released/reclaimed/spare/unexpected availability and actual-vs-plan logic found no detector.

## 44. Found-Time Sources

Skip and shorter actual duration have partial evidence; cancellation is only approximable as skipped; Work/attached activity/buffer composition semantics are absent. Manual unplanned execution exists, but manual declaration of availability does not.

## 45. Found-Time Source Matrix

| Source | Planned Evidence | Actual Evidence | Difference Computable? | Remaining Obligations Known? | Live Capacity Today? | Proposal Path? |
|---|---|---|---:|---:|---:|---:|
| Parent/Commitment canceled | Scheduled snapshot | Skip only | Partial | No composition | No | No |
| Commitment skipped | Snapshot | Skipped outcome | Interval obvious, semantics absent | No | No | No |
| Activity early | Snapshot | Optional duration/time | Technically partial | No | No | No |
| Attached Activity early | No first-class component | No linked component | No | No | No | No |
| Buffer released | Timing may include buffer indirectly | No execution by design | No | No | No | No |
| Work ends early | Work snapshot | Optional actual duration | Technically partial | No | No | No |
| User declares availability | None | None | No | No | No | No |

## 46. Found Time vs Capacity

A future derivation must identify the released interval, clip it to current/future time and canonical user-day, subtract fixed/remaining composite obligations and unresolved liabilities, then invoke the Capacity read model. Current code supplies only fragments of planned and actual evidence.

## 47. Found Time and Commitment Composition

Current execution subjects target whole planned occurrences; no executable parent/attachment graph, required/optional component status, remaining composite liability, or net footprint exists. Thus an early appointment cannot safely release time while travel remains required.

## 48. Found Time and Buffers

Buffers exist on templates/candidates/blocks, but historical/execution semantics do not preserve an independently releasable buffer identity. Correctly, buffers do not receive fake activity execution records; a future composition/timing snapshot must distinguish planned buffer protection from early activity completion.

## 49. Found Time and Goal Demand

**Not Found.** There is no unmet-demand query, minimum useful session, splittability, cadence, structural eligibility, Goal Priority, or composite cost in executable planning.

## 50. Found Time and Goal Structure

Future Proposal should consume structurally eligible, normalized, deduplicated Demand plus reasons and Goal Priority from upstream. It must not traverse Goal graphs. Those outputs are specified but not executable.

## 51. Found Time and Composition Footprint

**Not Found.** A 30-minute workout with 60 minutes of travel cannot be rejected against a 45-minute opportunity because executable composite feasibility does not exist.

## 52. Found-Time Proposal

No current flow connects divergence → availability → Goal candidate → feasibility → recommendation → user decision. Closest primitives are immutable plan snapshots, actual-time evidence, deterministic option generation patterns, durable decisions, and one-off manual/occurrence authority.

## 53. Found-Time User Authority

Current automatic placement is valid only for prior recurring authority; it is not precedent for silently filling Found Time. Reusable acceptance patterns exist in SuggestedFix→PlanDecision, but new constructive semantics are required.

## 54. Spontaneous Found-Time Use

Unplanned execution can preserve title, category, user-day, outcome, and duration; a separate Progress observation can preserve Goal progress. Missing: an explicit Goal-linked unplanned execution and “unexpected opportunity/direct choice” provenance.

## 55. Proposed vs Direct Execution

| Scenario | Proposal? | Accepted Allocation? | Scheduled? | Execution? | Provenance Needed |
|---|---:|---:|---:|---:|---|
| Recurring Commitment | No | No | Yes | Optional | Recurrence/source |
| Accepted constructive Proposal | Future yes | Future yes | Future yes | Optional | Proposal + decision |
| Modified Proposal | Future yes | Future yes | Future yes | Optional | Original + delta |
| Rejected Proposal | Future yes | No | No | No | Rejection/context |
| Direct spontaneous Goal work | No | No | No | Partially yes | Goal + direct/unplanned |
| Found-Time Proposal accepted | Future yes | Future yes | Future yes | Optional | Found interval + decision |
| Found-Time direct action | No | No | No | Partially yes | Found/direct + Goal |

## 56. Found Time as Learning Evidence

Current history cannot reliably distinguish scheduled Goal work, proposed-and-accepted work, and spontaneous Goal work because Proposal provenance is absent and unplanned execution lacks Goal linkage. Repeated behavior cannot yet be a clean learning dataset.

## 57. Reusable Preference Boundary

No reusable preference or inferred-rule mechanism exists. Future tendencies may guide proposals only after preserving evidence and explicit scope; they must never silently become scheduling authority.

## 58. Proposal and Accepted Choice Scope

Current accepted choices are occurrence-scoped. They do not express “similar situations” or recurring preference scope. This is a useful safe default but insufficient for future guidance.

## 59. Proposal and History

History can freeze accepted schedule outcome, occurrence source, Goal revision, and actual execution. It cannot freeze the decision-time Capacity/Demand/Priority/Allocation/options/proposal/delta chain.

## 60. Historical Reasoning Snapshot

Reusable patterns include immutable versioned snapshots, durable references, construction-time validation, and frozen Goal revisions. Specification must decide between full derived snapshots, fingerprints/references, and decisive evidence; current evidence does not force one model, but mutable recomputation is unacceptable.

## 61. Proposal Staleness

Preview has an explicit stale flag and publication rejects stale/revised previews; decision replay can become inapplicable/blocked. These are reusable patterns. No Proposal invalidation covers changes to Capacity, Demand, priority, structure, composition, time, Found interval, or competing acceptance.

## 62. Proposal Applicability

Current replay distinguishes applied and non-applied decision outcomes and SuggestedFix classification can reflect decision context. Proposal states stale, accepted, rejected, superseded, and no-longer-applicable are absent.

## 63. Proposal Identity

UUID PlanDecision IDs, deterministic candidate/fix IDs, durable occurrence references, and source incarnations are foundations. There is no Proposal ID, option ID with durable lifecycle, Allocation reference, or modification lineage.

## 64. Determinism

Generation, candidate ordering, placement, Friction, fix generation, and replay are deterministic under tested equivalent inputs. Future Proposal should retain canonical inputs/tie-breakers and avoid storage/array order as semantic ranking.

## 65. Proposal Ranking

Only candidate placement and corrective option ordering exist. Goal Priority, Allocation Policy, feasibility, target pressure, accepted-choice guidance, and diminishing returns are not executable; Friction order cannot substitute.

## 66. Allocation Policy Executable Support

**Not Found.** No user-authorized fairness, priority precedence, viable satisfaction, continuity, fragmentation, deadline, or diminishing-return policy distributes discretionary Capacity.

## 67. Recommendation Confidence / Explanation

Friction exposes local causes/actions and failure feedback, not confidence, assumptions, missing upstream information, or reasons to abstain. Constructive explanation/confidence is absent.

## 68. No-Proposal State

**Not Found.** Empty candidates/unplaced/error/stale states have other meanings. There is no explicit “no useful constructive recommendation” result distinguishing no Capacity, satisfied Demand, infeasibility, missing data, and abstention.

## 69. Proposal Failure vs Friction

No Capacity is a resource result; demand that cannot fit is feasibility; competing demands exceed Capacity is Allocation; no worthwhile option is a valid no-Proposal result; only incompatible already-authorized facts are Friction. Current code represents the last category and geometric placement failure, not the first four semantics.

## 70. Preview / Proposal / Schedule Truth Matrix

| Object | Derived? | Proposed? | Accepted? | Scheduled Authority? | Historical? | User Must Approve? |
|---|---:|---:|---:|---:|---:|---:|
| Authored Commitment | No | No | Yes/authored | Yes | Source may be | At authoring |
| `BlockCandidate` | Yes | No | Prior authority | Obligation, no exact slot | No | No |
| Preview scheduled block | Yes | No | Prior authority | Projected | No | No |
| `SuggestedFix` | Yes | Corrective only | No | No | No | To apply |
| `PlanDecision` | No, user record | No | Yes | Bounded override | Persisted; partial publication provenance | Already approved |
| Historical occurrence | Snapshot | No | Yes | Yes | Yes | No |
| Future constructive Proposal | N/A | Yes | No until decision | No | Should preserve lifecycle | Yes |

## 71. Current Proposal Support Classification

**CP3 — Recommendation / Acceptance Primitives Without Constructive Proposal, with CP4 as the only current recommendation producer.** The combined wording is justified because reusable decision/history infrastructure exists beyond Friction, while all actual recommendation production is corrective.

## 72. Found-Time Support Classification

**FT3 — Planned/Actual Primitives Without Found-Time Semantics.** Early-completion detection: partial data/no detector; cancellation release: no; skip release: data/no derivation; buffer release: no; Live Capacity: no; unmet Goal query: no; short-horizon feasibility/Allocation/Proposal: no; spontaneous Goal execution: partial; Found-Time provenance: no.

## 73. Current-vs-Needed Matrix

| Concern | Current Behavior | Evidence | Class | Needed Before Spec? | Risk |
|---|---|---|---|---:|---|
| Proposal identity/options/explanation | None | Searches | Missing | Yes | No lifecycle |
| Acceptance | Occurrence decisions only | `planDecision.ts` | Adapt | Yes | Conflated authority |
| Modification/rejection | Final fix payload/no rejection | decisions | Missing | Yes | Evidence loss |
| Allocation/Demand/Capacity/Priority | None | engine trace | Missing | Inputs already specified | Wrong recommendation |
| Composite feasibility | None | type/search trace | Missing | Contract required | Impossible options |
| Historical provenance | Occurrence + Goal snapshot | publication | Partial | Yes | Mutable explanation |
| Staleness | Preview/replay analogue | engine/state | Adapt | Yes | Invalid acceptance |
| Direct authorization | Commitments/events/decisions | authored setup | Current | Preserve | Proposal monopoly |
| Friction reuse | Corrective options | friction paths | Adapt | Boundary required | Domain conflation |
| Found detection/Live Capacity/matching/Proposal | None | searches | Missing | Include as use case | Silent/free-time error |
| Spontaneous execution | Unplanned + separate Progress | execution/progress | Partial | Clarify | Fabricated lineage |
| Learning evidence | No scoped provenance | history | Missing | Boundary required | Behavior becomes authority |

## 74. Primitive-Reuse Matrix

| Future Concern | Existing Primitive | Evidence | Reuse | Required Adaptation | Risk |
|---|---|---|---|---|---|
| Candidate | `BlockCandidate`/unplaced | blocks/types | Wrong Abstraction | New demand candidate | Prior authority confused |
| Placement | `ScheduledBlock`, engine | placement tests | Reusable with Adaptation | Accept only authorized proposal output | Silent scheduling |
| Projection | Preview | engine/state | Reusable with Adaptation | Separate proposal state/horizon | Truth conflation |
| Correction | Friction/`SuggestedFix`/apply | friction tests | Wrong Abstraction | Share patterns, not types | Constructive/corrective blur |
| Decision | `PlanDecision`, replay, accepted choices | decision tests | Reusable with Adaptation | Proposal target/states/scope | Occurrence semantics stretched |
| Identity | Durable occurrence reference | occurrence code | Directly Reusable for scheduled target | Add proposal/allocation refs | Lost lineage |
| Goal provenance | Goal links/snapshots | publication | Directly Reusable partly | Demand/structure evidence | Goal reason absent |
| Historical schedule | Historical occurrence | publication | Directly Reusable | Proposal provenance companion | Recommendation lost |
| Actuals | Execution record/duration | execution tests | Directly Reusable partly | variance query + provenance | False Found Time |
| Direct authoring | Manual events | preview paths | Directly Reusable | Preserve bypass | Proposal required wrongly |
| Direct outcome | Progress observations | progress tests | Reusable with Adaptation | Link to direct execution | Double evidence |
| Ordering | Placement priority | placement tests | Wrong Abstraction for Allocation | New policy | Heuristic as value |
| Time ownership | User-day boundary logic | today/history | Directly Reusable | Apply to Live interval | Midnight error |
| Invalidation | Preview staleness | state/publication | Reusable with Adaptation | Proposal dependencies | Stale acceptance |
| Durability | Backup/restore | restore tests | Reusable with Adaptation | Add versioned records | Data loss |

## 75. Constructive-vs-Corrective Matrix

| Situation | Constructive? | Feasibility? | Allocation? | Friction? | Current Representation |
|---|---:|---:|---:|---:|---|
| Empty Capacity + unmet Demand | Yes | Yes | Maybe | No | None |
| One Goal fits | Yes | Yes | Trivial | No | None |
| Multiple Goals compete | Yes | Yes | Yes | No | None |
| Core fits, composition not | No valid option | Yes | No | No | None |
| No useful Goal fits | No-Proposal | Yes | Maybe | No | None |
| Accepted Goal work later collides | No | No | No | Yes | Would be Friction once scheduled |
| Existing Commitment overlap | No | No | No | Yes | Friction |
| Found Time appears | Yes | Yes | Maybe | No | None |
| Found Time too small | No-Proposal | Yes | No | No | None |

## 76. Decision Lifecycle Matrix

| State | Current Primitive | Future Meaning | Authority? | Persist? | Historical? |
|---|---|---|---:|---:|---:|
| Generated reasoning | Preview/fixes | Derived inputs/options | No | Maybe cache | Explainable snapshot |
| Proposal shown | None | Offer | No | Likely | Yes if decided |
| Modified | Final decision analogue | User delta | Not until accept | Yes | Yes |
| Accepted | `PlanDecision` analogue | Bounded authority | Yes | Yes | Yes |
| Rejected | None | Explicit no-authority decision | No | Yes | Yes |
| Stale | Preview stale | Revalidation required | No new | Yes/state | Yes |
| Superseded | None | Replaced proposal | No | Yes | Yes |
| Accepted Allocation | None | Authorized resource choice | Yes | Yes | Yes |
| Scheduled work | Preview/history analogue | Realized authority | Yes | Yes | Yes |
| Execution | Execution record | What happened | Evidence | Yes | Yes |

## 77. Found-Time Matrix

| Scenario | Divergence | Released Interval | Remaining Obligation | Live Capacity? | Goal Candidate? | Proposal? | Direct Action? |
|---|---|---|---|---:|---:|---:|---:|
| Meeting canceled | Cancel/skip | Planned span | Later facts | Future derivation | Future | Yes | Yes |
| Work early | Short actual | Actual end→planned end | Later facts | Future | Future | Yes | Yes |
| Errand early | Short actual | Partial | Travel/attachments | Future | Future | Yes | Yes |
| Commute early | Short actual | Partial | Next required component | Future | Future | Yes | Yes |
| Optional attachment skipped | Component skip | Its safe span | Parent/required parts | Future | Future | Yes | Yes |
| Required attachment skipped | Liability unresolved | Not automatically free | Required component | Usually no | No until resolved | Maybe | User may act, risk shown |
| Buffer released | Explicit release | Buffer span | Subsequent obligations | Future | Future | Yes | Yes |
| User declares 45m | Direct assertion | Declared/validated span | Schedule liabilities | Future | Future | Yes | Yes |

## 78. Provenance Matrix

| Scenario | Original Plan | Proposal | User Decision | Scheduled Authority | Execution | Must Preserve |
|---|---|---|---|---|---|---|
| Recurring Commitment | Recurrence | None | Authoring | Recurrence realization | Optional | Source/occurrence |
| Constructive accepted | Existing context | Yes | Accept | Bounded accepted work | Optional | Inputs/options/accept |
| Proposal modified | Context | Original | Delta + accept | Modified result | Optional | Original/delta/final |
| Proposal rejected | Context | Yes | Reject | None | None | Reason/scope/no authority |
| Found accepted | Published plan | Found option | Accept | One-off | Optional | Divergence/interval/decision |
| Found rejected | Published plan | Found option | Reject | None | None | Context/rejection |
| Spontaneous Goal work | Maybe plan context | None | Direct act | None | Unplanned | Goal/direct provenance |
| Friction fix accepted | Authorized plan | Corrective option | Accept | Occurrence override | Optional | Fix/decision/replay |
| Direct manual event | Authored | None | Authoring | Manual event | Optional | Direct source |

## 79. Proposal Input Matrix

| Input | Authored / Derived | Current Executable | Required? | Proposal May Mutate? |
|---|---|---|---:|---:|
| Capacity | Derived | No | Yes | No |
| Goal Demand | Authored intent + derived projection | No | Yes | No |
| Structural Eligibility | Derived | No | Yes | No |
| Normalized Demand | Derived | No | Yes | No |
| Goal Priority | Authored/structurally resolved | No planning use | Yes | No |
| Goal-Specific Feasibility | Derived | No | Yes | No |
| Composite Footprint | Derived from authored composition | No | Yes when applicable | No |
| Allocation | Derived | No | Yes | No |
| Accepted-choice guidance | Historical derived guidance | Decisions only, unused | Optional | No |
| Historical tendency | Derived | No | Optional | No |
| Current time | Evaluation input | Today only | Live yes | No |
| Found-Time interval | Derived Live | No | Found use case | No |

## 80. Worked Scenarios

- **A:** No; 19:00–20:00 and 45m Network+ Demand have no executable Capacity/Demand/Proposal path.
- **B:** No mechanism compares Network+ and Writing; placement priority is not Goal Allocation.
- **C:** Goal Priority does not affect executable planning.
- **D:** No composite footprint exists, so the engine cannot reject the 90m operational cost against 75m.
- **E:** Automatic Study placement is prior recurrence-authority realization, not Proposal.
- **F:** Collision fixes alter already-authorized blocks; therefore corrective Friction.
- **G:** Acceptance creates a durable occurrence-scoped `PlanDecision`, replayed into regeneration.
- **H:** Rejection/dismissal is not persisted.
- **I:** Closest analogue is SuggestedFix plus final PlanDecision, but original+delta is not retained.
- **J:** Preview stale/replay applicability patterns are reusable; no Proposal dependency revalidation exists.
- **K:** No explicit no-useful-recommendation state exists.
- **L:** A skipped meeting can be recorded, but no interval/Live Capacity derivation occurs.
- **M:** Planned and actual duration may exist; remaining required obligation and net Found Time cannot be computed.
- **N:** Work early actuals do not rewrite history, but no Live Capacity results.
- **O:** Network+ minimum-session matching is absent; no proposal.
- **P:** Composition-aware rejection is absent.
- **Q:** It needs a Proposal decision producing bounded one-off authority before schedule materialization; current PlanDecision is only an analogue.
- **R:** Rejection should preserve proposal/context without authority; nothing does today.
- **S:** Unplanned execution plus separate Progress can approximate it without fabricating Proposal, but explicit Goal linkage is missing.
- **T:** Records can accumulate, but cannot cleanly identify repeated spontaneous Goal choices or authorize a preference.
- **U:** Accepted choices are not inputs to future constructive reasoning.
- **V:** No independent tonight recommendation horizon; preview/review remains range-coupled.
- **W:** Canonical user-day logic can locate the overnight day and is reusable, but Found-Time logic is absent.
- **X:** Proposal ends at accepted bounded scheduling authority; a later collision is corrective Friction.

## 81. Candidate Invariant Assessment

| ID | Classification | Assessment |
|---|---|---|
| CP-CAND-INV-01 | Required; supported for current domains | Preview/fixes do not themselves become authored intent. |
| CP-CAND-INV-02 | Required; supported | Recurrence placement uses prior authority. |
| CP-CAND-INV-03 | Required; Not Applicable Yet | No Goal scheduling path exists. |
| CP-CAND-INV-04 | Requires Future Specification | Capacity absent. |
| CP-CAND-INV-05 | Requires Future Specification | Demand absent. |
| CP-CAND-INV-06 | Requires Future Specification | Structure outputs absent executably. |
| CP-CAND-INV-07 | Requires Future Specification | Composition absent. |
| CP-CAND-INV-08 | Required; supported in current Goal snapshots | No overhead is currently credited; future boundary needed. |
| CP-CAND-INV-09 | Requires Future Specification | Allocation absent. |
| CP-CAND-INV-10 | Required; occurrence analogue supported | New bounded authority semantics needed. |
| CP-CAND-INV-11 | Requires Future Specification | Original/delta absent. |
| CP-CAND-INV-12 | Requires Future Specification | Rejection absent. |
| CP-CAND-INV-13 | Required; current occurrence scope supports analogue | Proposal scope absent. |
| CP-CAND-INV-14 | Requires Future Specification | Preview stale is only analogue. |
| CP-CAND-INV-15 | Required; current implementation supports distinction | Only Friction recommends today. |
| CP-CAND-INV-16 | Required; Not Applicable Yet | Capacity/Demand absent. |
| CP-CAND-INV-17 | Required; Not Applicable Yet | Allocation absent. |
| CP-CAND-INV-18 | Requires Future Specification | No-Proposal absent. |
| CP-CAND-INV-19 | Requires Future Specification | Found Time absent; immutable plan supports principle. |
| CP-CAND-INV-20 | Requires Future Specification | No Found proposal. |
| CP-CAND-INV-21 | Requires Future Specification | Composition absent. |
| CP-CAND-INV-22 | Required; Not Applicable Yet | No autofill path exists. |
| CP-CAND-INV-23 | Required; partially supported | Unplanned execution exists; Goal link missing. |
| CP-CAND-INV-24 | Requires Future Specification | Scheduled vs unplanned exists; proposal lineage absent. |
| CP-CAND-INV-25 | Required; supported by non-learning | No silent promotion occurs. |
| CP-CAND-INV-26 | Requires Future Specification | Reasoning snapshots absent. |
| CP-CAND-INV-27 | Required; historical snapshot pattern supports | Proposal snapshot absent. |
| CP-CAND-INV-28 | Required; current engines supported | Proposal ranking not implemented. |
| CP-CAND-INV-29 | Required; supported only by semantic separation | Must be explicit in spec. |
| CP-CAND-INV-30 | Requires Future Specification | No Proposal scope. |
| CP-CAND-INV-31 | Violated by current range coupling as a future analogue | No independent horizon. |
| CP-CAND-INV-32 | Required; existing Friction supports destination | Constructive source absent. |
| CP-CAND-INV-33 | Requires Future Specification | Composition distinction absent. |
| CP-CAND-INV-34 | Required; user-day primitive supported | Found logic absent. |
| CP-CAND-INV-35 | Required; supported | Direct commitments/events/execution exist. |
| CP-CAND-INV-36 | Required; partially supported by deterministic corrective UX | Constructive explanation absent. |

## 82. Architectural Risks

All 30 requested risks are material. Highest risks are: Preview-as-Proposal; recurrence placement treated as unaccepted intent; `SuggestedFix`/`PlanDecision` stretched into a general Proposal domain; automatic Goal scheduling from apparent openings; invented Demand/priority/structure authority; ignored composite overhead; Allocation treated as acceptance; lost original/rejected options; mutable historical explanation; array-order ranking; broad-range review leakage; freed-clock-time mislabeled Capacity; spontaneous action given fabricated Proposal lineage; midnight user-day errors; and a nondeterministic chatbot-like suggestion layer. These collapse epistemic states and user authority even when UI appears helpful.

## 83. Test Coverage Assessment

Executed exactly 19 files: `generateSchedulePreview.test.ts`, `reviseSchedulePreview.test.ts`, `generateBlockCandidates.test.ts`, `placeBlockCandidates.test.ts`, the three Friction tests (`detectScheduleFriction`, `generateSuggestedFixes`, `applySuggestedFix`), `planDecision.test.ts`, `replayPlanDecisions.test.ts`, `planDecisionSurface.test.ts`, `materializePlanPublication.test.ts`, `goalActivity.test.ts`, `executionRecord.test.ts`, `executionHistorySurface.test.ts`, `progressObservation.test.ts`, `progressObservationSurface.test.ts`, `dayFrameRestoreComposition.test.ts`, `todayQuery.test.ts`, and `previewRangeWarnings.test.ts`. Result: **19 files passed; 201 tests passed; 0 failed**.

They substantiate generation/placement, unplaced handling, correction, decision replay/persistence, range warning/staleness-related boundaries, publication and Goal snapshots, execution/progress evidence, restore, and Today query. No tests cover constructive Proposal identity/options/accept-modify-reject, Capacity→Goal reasoning, competing Goal Allocation, Proposal history, Found-Time detection, early-finish/cancellation release, Live Capacity, Found-Time matching/proposal, or explicitly Goal-linked spontaneous execution. Those absences are also confirmed by production-path search, not inferred from tests alone.

## 84. Current-System Flows

```text
Template + recurrence → BlockCandidate → deterministic placement
→ Preview scheduled block → publication → optional execution

Authorized schedule → Friction → SuggestedFix → user acceptance
→ PlanDecision → replay/regeneration → revised schedule

Goal → explicit Commitment link → scheduled occurrence
→ historical Goal snapshot → execution → Goal Activity
Progress observation remains separate

User acts directly → unplanned ExecutionRecord and/or Progress observation
(no constructive Proposal step; no first-class execution↔Goal link)
```

## 85. Intended Proposal Boundary Flow

Conceptual, not implemented:

```text
Capacity + eligible normalized Goal Demand + Goal Priority
+ Goal-Specific Feasibility + Composite Footprint + Allocation Policy
+ relevant accepted-choice guidance
→ Allocation → Proposal → user Accept / Modify / Reject
→ Accepted Allocation → bounded Scheduled Goal Work + support/buffers
→ Execution
```

## 86. Intended Found-Time Boundary Flow

Conceptual, not implemented:

```text
Published Plan → Execution Divergence → released interval
→ subtract remaining obligations/liabilities → Live Capacity
→ unmet eligible normalized Demand → composition-aware feasibility
→ Allocation → Found-Time Proposal → Accept / Modify / Reject
→ one-off authority → schedule/execution → history

Found Time → user acts without Proposal → direct/unplanned execution
→ historical evidence (never fabricated Proposal provenance)
```

## 87. Current Proposal Truth

DayFrame has Proposal-adjacent deterministic recommendation, decision, replay, snapshot, and persistence primitives, but no constructive Proposal object or lifecycle.

## 88. Preview Truth

Preview is a derived projection of existing authority plus diagnostics. It creates no new intent and is not Proposal.

## 89. Automatic Placement Truth

Automatic flexible recurrence placement realizes prior recurring authority; it does not require repeated acceptance.

## 90. Friction Recommendation Truth

SuggestedFix supplies corrective options, IDs, explanation, application, and an acceptance bridge. It neither identifies valuable new work nor allocates Capacity.

## 91. PlanDecision Truth

PlanDecision is durable, accepted, occurrence-scoped scheduling override authority. It is not a Proposal decision domain.

## 92. Acceptance / Modification / Rejection Truth

Explicit acceptance exists for corrective/occurrence decisions and direct authoring. Constructive acceptance, original-plus-delta modification, explicit rejection, and rejected-alternative history are absent.

## 93. Goal / Capacity / Allocation Truth

Goals contribute provenance through explicit Commitment links. Executable Goal Demand, Goal Priority planning, Capacity read model, competing-demand comparison, and Goal Allocation are absent.

## 94. Proposal History Truth

Current history freezes schedule/Goal/execution facts, not recommendation reasoning, option sets, user delta, or rejection.

## 95. Found-Time Truth

Found Time has no first-class object, query, detector, Today presentation, Summary projection, or recommendation path.

## 96. Execution Divergence Truth

Planned snapshots and user-reported outcomes/actual time exist; automatic comparison, cancellation semantics, and released-interval derivation do not.

## 97. Live Capacity Truth

Current availability cannot be recomputed safely from execution because liability/composition-aware Live Capacity is absent.

## 98. Spontaneous Goal Work Truth

Direct unplanned execution and separate Goal Progress can be recorded without inventing scheduling, but a single explicit Goal-linked spontaneous execution fact and its origin context are missing.

## 99. Proposal / Friction Boundary

The implementation does not presently conflate them because no constructive Proposal exists. The reuse hazard is high: constructive Proposal selects among possible new allocations; Friction repairs accepted schedule incompatibility.

## 100. Missing Constructive Proposal Semantics

Missing: identity, input snapshot/reference contract, options/cardinality/ranking, explanation/uncertainty, bounded horizon/scope, accept/modify/reject, accepted Allocation, conversion to one-off authority, staleness/applicability/supersession, no-Proposal reasons, historical reasoning, and learned-guidance boundary.

## 101. Missing Found-Time Semantics

Missing: divergence detector, cancellation, released interval, remaining-liability subtraction, buffer/component treatment, canonical Live Capacity, unmet-demand matching, composition-aware short-horizon feasibility/Allocation, Found-Time Proposal/decision/history, and explicit Goal-linked direct action.

## 102. Open Questions

The specification must resolve snapshot granularity, Proposal/option identity and cardinality, modification lineage, explicit rejection reason/scope, accepted-Allocation representation, one-off schedule authority, invalidation dependencies, bounded horizon separate from review, no-Proposal reason taxonomy, direct Goal execution linkage, and which accepted-choice evidence may guide—but never authorize—future proposals. These are Proposal design questions, not unresolved upstream semantic blockers.

## 103. Audit Conclusions

1. No first-class constructive Proposal exists.
2. Classification is CP3 overall, with CP4 as the sole recommendation producer.
3. Preview is not Proposal.
4. Generated recurring placement requires no new acceptance.
5. `BlockCandidate`s are authorized occurrence candidates, not constructive recommendations.
6. SuggestedFixes are not constructive Proposal.
7. Current recommendation production is Friction-only.
8. PlanDecision is occurrence override authority, not general Proposal acceptance.
9. Its identity, timestamp, target, validation, replay, applicability pattern, persistence, and visibility are reusable.
10. Constructive rejection is absent.
11. Constructive modification is absent.
12. Rejected alternatives are not preserved.
13. Goal Demand does not feed generation.
14. Goal Priority does not feed constructive planning.
15. First-class Capacity does not feed planning.
16. Executable Goal Allocation does not exist.
17. Competing Goal demands cannot be compared.
18. History cannot preserve decision-time Proposal reasoning.
19. Users can directly authorize Commitments, recurrences, manual events, and occurrence decisions.
20. Users can approximate direct Goal work with separate unplanned execution and Progress, but lack first-class linkage.
21. Found Time is not implemented.
22. Classification is FT3.
23. Early completion can be recorded but is not detected as opportunity.
24. Cancellation cannot release Capacity; skipped is only partial evidence.
25. Remaining composite obligations cannot be protected executably.
26. Live Capacity cannot be derived today.
27. Unmet Goal Demand cannot be queried against Found Time.
28. Short-horizon feasibility cannot run against Found Time.
29. A Found-Time Proposal cannot be generated.
30. It cannot be accepted as such.
31. It cannot be rejected as such.
32. Direct Found-Time Goal work is only partially distinct via unplanned execution plus separate Progress.
33. Repeated spontaneous choices may leave fragments of evidence but cannot become clean guidance—and do not become authority.
34. Future Proposal can safely consume resolved Goal Structure outputs if its contract forbids traversal.
35. It can safely consume resolved composite footprints once executable.
36. Productive work versus overhead needs explicit upstream output/provenance; current code cannot distinguish it.
37. Insufficient Capacity for unaccepted Demand is conceptually distinct from Friction; current code lacks the former.
38. No useful recommendation is not representable as a first-class state.
39. Planning/review/recommendation scope is not sufficiently independently bounded.
40. Directly reusable primitives: durable occurrence references, immutable occurrence/Goal snapshots, user-day logic, actual-time evidence, direct authoring.
41. Reusable with adaptation: deterministic option generation, placement after authority, decision IDs/timestamps, replay/applicability, persistence/restore, staleness patterns.
42. Wrong abstractions for Proposal: `BlockCandidate`, unplaced candidate, Friction/SuggestedFix actions, occurrence priority, and PlanDecision as-is.
43. No upstream semantic blocker remains; accepted Capacity, Demand/Allocation, Structure, and Composition contracts define the required inputs.
44. A Constructive Proposal Architecture Specification is warranted now.
45. The next architectural task should be Path A, with Found Time modeled as a Live Proposal input/use case rather than separate authority.

## 104. Recommended Next Step

**Path A — Constructive Proposal Architecture Specification.** Specify the first-class constructive lifecycle and include ordinary planning plus Found-Time/Live Opportunity as input contexts under the same authority boundary. Do not begin implementation, create a Phase 8, or split Found Time into an independent authority domain.

## 105. Completion Statement

**Constructive Proposal Architecture Audit complete.**

The audit establishes the current executable truth of DayFrame's constructive planning and recommendation machinery; distinguishes generated Preview state, recurring-authority realization, planning candidates, corrective Friction suggestions, accepted PlanDecisions, and historical schedule truth; determines whether Capacity, Goal Demand, Goal Priority, Goal-Specific Feasibility, Allocation, Commitment Composition footprints, Proposal identity, recommendation alternatives, acceptance, modification, rejection, staleness, and decision-time provenance are represented or absent; evaluates Found Time as execution-derived Live availability and determines whether cancellation, early completion, released Buffers, remaining composite obligations, Live Capacity, unmet Goal Demand, short-horizon feasibility, Found-Time Proposal, spontaneous Goal execution, and learning provenance are currently supported; identifies reusable primitives and wrong abstractions; determines whether a first-class Constructive Proposal architecture can now be specified without reopening accepted upstream architecture; and recommends the next architectural step without modifying implementation or assigning the work to a future implementation phase.
