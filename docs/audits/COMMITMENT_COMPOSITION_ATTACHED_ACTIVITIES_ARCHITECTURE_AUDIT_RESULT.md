# Commitment Composition / Attached Activities Architecture Audit Result

## 1. Executive Findings

DayFrame is **CC3 — Relative / Reference Placement Primitives**. It has strong source/occurrence identity, recurrence, buffers, Work-relative search windows, canonical user-day handling, unplaced candidates, Friction, single-occurrence PlanDecisions, immutable historical occurrence snapshots, and independent execution records. It does not have a parent/child Commitment relationship, Attached Activity identity, parent occurrence pairing, recurrence inheritance, lifecycle coupling, composite feasibility, composite Friction, or historical attachment provenance.

`beforeWork` and `afterWork` are placement heuristics against the first/last generated Work block for a user-day. The selected Work reference is not stored on the candidate or scheduled occurrence. Buffers are numeric padding that expands occupied intervals; they are neither activities nor executable historical facts. Independent Commitments and manual events can visually simulate composition but drift independently.

Composition changes the feasibility and Capacity cost of Goal work: 60 minutes of work plus required 30-minute travel cannot fit 75 minutes even though the core work can. Current Proposal inputs cannot express that composite liability. Normative Commitment Composition is therefore required before constructive Proposal: **Path A — Commitment Composition / Attached Activities Architecture Specification**.

## 2. Audit Scope and Method

The audit traced production types and paths for templates, recurrence, Work, manual events, candidate generation/placement, buffers, Friction, suggested fixes, PlanDecision, historical publication, Goal linkage, execution, persistence, and restore. Claims are **Confirmed** by production code/tests, **Inferred** where structure strongly indicates behavior, or **Not Found** after semantic search. No implementation, test, configuration, schema, or existing document was changed.

## 3. Commitment Authority Inventory

| Source Type | Authored? | Owns Time? | Generates Occurrences? | Movable? | Executable? | Parent Reference? | Composition Support? |
|---|---:|---:|---:|---:|---:|---:|---:|
| BlockTemplate + BlockRecurrence | Yes | Template authorizes intended duration; placed occurrence occupies time | Yes | Flexible occurrence via decision | Yes when historically published | No | Placement analogue only |
| Manual event | Yes | Yes at explicit interval | Preview occurrence | Edited as source, not composite | Yes | No | Independent analogue |
| Shift definition/cycle/segment/entry | Yes | Generates locked Work | Yes | Source edit/regeneration | Yes | Internal shift provenance, no Commitment parent | Work hierarchy, not composition |
| Generated Work block | Derived | Yes | It is occurrence | Locked in draft | Yes | Shift-source identity only | Reference anchor analogue |
| Block candidate | Derived | Not until placed; unresolved liability | It is projected occurrence | Placement engine | Historical states may be published | No | None |
| Scheduled block | Derived draft | Yes | No | Single target | Yes | No | None |

`BlockTemplate` owns duration, buffers, priority, placement and window preference; `BlockRecurrence` independently controls cadence (`code/src/core/blocks/types.ts:59-103`). No listed type contains parent/attachment fields.

## 4. Occurrence Model

**Confirmed.** Candidates and scheduled blocks preserve occurrence identity, optional Commitment navigation identity, source/template/recurrence, user-day/week, duration/absolute dates, buffers, and placement metadata (`code/src/core/blocks/types.ts:105-137,150-182`). They contain no parent occurrence ID, dependency/attachment ID, relationship type, pairing ID, or resolved relative-reference provenance. One occurrence cannot be structurally subordinate to another.

## 5. Work Model

Shift definitions specify start/end, weekdays, and midnight crossing. `generateWorkBlocks` emits a deterministic block per eligible start date, moves end to the next calendar day when necessary, and assigns user-day ownership from start under the configured boundary (`code/src/core/shifts/types.ts:7-40`; `generateWorkBlocks.ts:10-85`). More advanced cycle/segment/entry provenance feeds durable Work references, but it does not create Attached Activities. Work is a derived locked occurrence, not a composite parent.

## 6. Work-Relative Placement

**Confirmed.** `beforeWork` chooses the earliest-starting Work block on the candidate’s user-day and prefers a placement ending before it; `afterWork` chooses the latest-ending block and prefers after it (`code/src/core/blocks/placeBlockCandidates.ts:300-320,448-520`). The search may move the candidate elsewhere in the window around collisions. With no Work, non-Sleep candidates fall back to generic day geometry; Sleep returns no window; `requiresWorkAnchor` candidates are skipped when no Work exists (`placeBlockCandidates.ts:25-31,454-464,483-495`). These are heuristics/reference placement, not lifecycle-coupled attachment.

## 7. Parent Reference Resolution

Candidates bind to user-day, not a Work occurrence. Resolution deterministically sorts and picks first Work for `beforeWork`, last for `afterWork`. Two Work blocks therefore select opposite extremes, not a declared parent. No reference survives in `buildScheduledBlock` (`placeBlockCandidates.ts:182-221`). Parent deletion/regeneration simply changes geometry on a later preview; history cannot explain the former reference.

## 8. Buffer Model

| Buffer Primitive | Time Reserved? | Activity Identity? | Parent Identity? | Executable? | Historical? | Capacity Effect? |
|---|---:|---:|---:|---:|---:|---:|
| `bufferBeforeMinutes` | Yes, occupied-window padding | No | Only same block field | No | Not in HistoricalPlan snapshot | Reduces openings |
| `bufferAfterMinutes` | Yes, occupied-window padding | No | Only same block field | No | Not in HistoricalPlan snapshot | Reduces openings |

Buffers propagate template→candidate→scheduled block and expand collision/placement occupation (`blocks/types.ts:67-68,125-127,175-176`; `placeBlockCandidates.ts:561-588,677-715`; `code/src/core/friction/detectScheduleFriction.ts:323-347`). They have no independent ID, lifecycle, title, category, Goal link, execution subject, or occurrence.

## 9. Buffer vs Activity

Current buffers are **True Buffers** for scheduling, but not first-class authority records. Work-relative windows are **Generic Placement Constraints**. Neither is an Attached-Activity analogue with identity. DayFrame can encode 30 minutes of protected transition or a separate 30-minute commute Commitment, but cannot preserve “commute is a real activity attached to this parent” as distinct structured truth.

## 10. Parent-Relative Timing

Ending at Work start or starting at Work end is a preferred geometric result, not an exact durable constraint. Buffer fields can impose a gap during placement; collisions may move the flexible block. Arbitrary “15 minutes before parent,” exact end-to-start, and relation to any Commitment are **Not Found**. Matching absolute times does not create relation semantics.

## 11. Parent Movement

**Not Found.** PlanDecision moves one durable occurrence; manual/shift edits regenerate their own projections. No operation discovers related activities or moves a set atomically. A separately recurring simulated commute remains at its independently recomputed placement and may coincidentally follow new Work geometry on regeneration, without preserved coupling.

## 12. Parent Cancellation / Omission

**Not Found.** `omitOccurrence` targets one occurrence. Removing Work changes future anchor availability, but no commute identity is known to cancel. A `requiresWorkAnchor` candidate may be absent/skipped when Work is absent; this is conditional placement behavior, not causal omission or historical coupling.

## 13. Parent Duration Changes

Later preview uses the new Work end and may place an `afterWork` template relative to it. Once placed, the block stores absolute start/end only, so no relation is retained and no atomic update occurs. Historical publication freezes absolute plan state, not causal relation. True parent-end attachment is **Not Found**.

## 14. Conditional Attachment

Recurrence can vary by weekday/date and candidate `requiresWorkAnchor` can require some Work on the user-day. Shift cycles affect effective scheduling preferences. There is no condition on a specific parent occurrence, location, metadata, duration, or selected appointment. Users must author independent rules, which may drift.

## 15. Recurrence Inheritance

**Not Found.** A candidate exists because of its own `BlockRecurrence`; it does not derive cadence from another source. Subsets require separate recurrence bounds/weekdays. Per-occurrence duration may be changed by PlanDecision, but not as an attachment override. Independent recurrences can diverge from the intended parent.

## 16. Identity and Lifetime

Available primitives include source ID/incarnation, template recurrence identity, coordinate-based occurrence identity, candidate/scheduled IDs, durable occurrence references, historical snapshot identity, and PlanDecision target identity. They suit future parent-source and parent-occurrence references, but no attachment-definition ID, relationship lifecycle, or paired composite occurrence identity exists.

## 17. Source Incarnation

**Confirmed reusable.** Commitment navigation and durable references use source incarnations, and Goal links include incarnation. They prevent decisions/links from silently targeting a recreated source. A future relation would need incarnation-safe references for both endpoints and its own lifetime; current source incarnation alone cannot express coupling.

## 18. Composite Commitment Hypothesis

| Hypothesis | Current approximation |
|---|---|
| A Independent Commitments + Relative Placement | Strongest analogue; CC3, but no coupling |
| B Parent + child definitions | Not Found |
| C Parent occurrence + generated attached occurrences | Not Found |
| D Buffer extensions | True protected padding, wrong abstraction for activity |
| E No existing equivalent | True for lifecycle-coupled composition |

## 19. Time Ownership

Work and manual/scheduled blocks occupy explicit intervals. Buffers expand protected occupation but are not activities. A placed flexible candidate owns draft time; an unplaced candidate is unresolved intended liability, not occupied interval. Imported/manual fixed events constrain placement. Current implementation offers only two approximations for commute: independent time-owning block or anonymous buffer; it cannot represent both activity identity and parent coupling.

## 20. Capacity Impact

Placement and Friction distinguish an activity’s visible interval from buffer-expanded occupied interval, but Capacity has no attached-activity category. Separate commute blocks consume their own intervals; buffers protect equal geometry without title, execution, Goal, or historical activity provenance. Treating both identically loses activity identity, actual duration, Found-Time potential, and reporting; treating commute independently loses coupling.

## 21. Unplaced Attached Activity Liability

An independently modeled commute that cannot fit becomes an unplaced candidate and ordinary Friction, subject to its own priority. Nothing marks the Work composite infeasible, reserves the missing liability, or prevents publishing Work alone. A `requiresWorkAnchor` candidate addresses missing Work, not inability to place required surrounding activity. Required attachment liability is **Not Found**.

## 22. Composite Feasibility

**Not Found.** The scheduler places Work as occupied input and each template candidate separately. It never evaluates commute+Work+commute as one feasibility unit, rolls back a partial bundle, or reports envelope feasibility.

## 23. Friction

Friction derives current overlap and unplaced-candidate facts. Kinds are `conflict`, `unplaced`, and `workRequiredSkip`; affected IDs are independent block IDs (`code/src/core/friction/types.ts:39-66`; `detectScheduleFriction.ts:33-136`). It can report an attached-like independent activity overlapping another block, but cannot detect broken attachment, relation order/gap, child without parent, parent without required child, or composite infeasibility.

## 24. Friction vs Composition Failure

Ordinary Friction is implemented as overlap/unplaced facts. Composition Failure is **Not Found** because no composite authority exists. Current Friction may expose a symptom but cannot say the parent bundle is unrealizable, assign causal relation, or distinguish optional from required component failure.

## 25. Suggested Fixes

Suggested fixes target individual context blocks: move, skip, reduce duration, change priority/fixed time, convert to recovery, add resource, or accept conflict (`friction/types.ts:9-25`; `generateSuggestedFixes.ts:136-291`). They cannot move/omit a bundle atomically, alter relation/gap, detach/promote, or substitute buffer. Infrastructure is reusable for explanation/acceptance with a new composite target contract.

## 26. PlanDecision

`PlanDecisionV1` targets exactly one `DurableOccurrenceReference` and supports place, omit, duration, or priority (`code/src/core/decisions/planDecision.ts:27-60`). It cannot target a group, relationship, source, or composite transaction. Classification: **Reusable with Adaptation**—identity, provenance, acceptance, replay, and staleness patterns are useful, but atomic composite semantics require a distinct target/payload boundary.

## 27. Manual Events

Manual events can visually simulate exact commute/appointment timing and own time independently. Lost are parent relation, recurrence inheritance, move/cancel coupling, requiredness, conditional applicability, composite feasibility, relation provenance, and composite history.

## 28. Flexible Block Templates

Templates can separately recur and prefer before/after Work, carry buffers, become unplaced, and receive single-occurrence decisions. They require independent recurrence; parent absence may produce fallback placement or skip depending on category/`requiresWorkAnchor`; multiple Work blocks resolve first/last. Exact pairing is absent.

## 29. Work-Relative Sleep Analogue

Sleep uses special handling: beforeWork without Work yields no initial window; deferred Sleep candidates may propagate a prior Sleep anchor across user-days (`placeBlockCandidates.ts:35-60,141-279,454-457`). This is recurrence-driven independent Commitment/reference propagation, not attachment. It demonstrates reusable cross-boundary placement mechanics, not lifecycle coupling.

## 30. Generic Relative Placement Analogue

No generic before/after arbitrary Commitment reference, bounded relation gap, or same-occurrence pairing was found. Relative windows are enumerated categories centered on Work/Sleep/day/custom time. Current support is Work-specialized.

## 31. Ordering Semantics

Current primitives express absolute scheduling order and preferred search position. They do not express parent/child composition, execution sub-step order, durable relative constraint, or display order. “Before” describes placement preference only.

## 32. Optional vs Required Attachment

**Not Found.** Template priority/reschedule behavior and Friction severity are not attachment requiredness. Nothing makes parent realizability depend on a component or distinguishes required commute from optional walk.

## 33. Detachment / Promotion

Independent templates already have independent identity, but no relation exists to retire while preserving history. Simulated detachment requires editing/deleting unrelated sources. Future promotion could reuse source identity only if attachment activity is a first-class source; current infrastructure cannot demonstrate this transition.

## 34. Parent Source vs Parent Occurrence

Current source-level recurrence and occurrence-level durable references are both reusable. Work-relative placement binds neither: it consults derived Work geometry transiently. Source-level attachment alone would not prove which occurrence paired historically; occurrence derivation/pairing provenance is required.

## 35. Multi-Occurrence Parent Days

With split Work, beforeWork selects earliest start and afterWork latest end. There is no way to select the second shift, pair different commutes to each, or detect ambiguity. Multiple appointments/workouts have no generic reference path at all.

## 36. Overnight / User-Day Semantics

Work correctly crosses midnight and retains start-date/user-day ownership (`generateWorkBlocks.ts:62-80`). Placement uses canonical per-user-day windows and applies clock times before the boundary to the next calendar date (`placeBlockCandidates.ts:76-99,339-361,718-738`). Before/after Work windows can extend beyond nominal day geometry. This machinery is reusable and tested, but no tests establish attached pairing across boundaries.

## 37. Duration Semantics

Template duration is authored fixed minutes per source; `setOccurrenceDuration` may override a single occurrence through PlanDecision. Work duration derives from shift times. Historical plan freezes starts/ends. No attachment-specific usual duration, per-parent override, or relative-duration lifecycle exists.

## 38. Actual Duration / Execution

Execution can record user-asserted `occurredAt` and `durationMinutes`, distinct from scheduled plan (`code/src/core/execution/executionRecord.ts:65-111,173-217`). It does not store actual end separately, automatically measure duration, or know attachment relation. Thus planned 30m versus reported 20m is representable for an independently published commute, but not as composition-aware variance.

## 39. Found Time Interaction

Planned and reported duration could support a derived variance when both exist, but no Found-Time implementation or composition provenance connects freed minutes to a parent/composite. An appointment ending early cannot automatically shift an attached travel activity because actual end and coupling are missing. This requires explicit provenance and current-time authority beyond the audit.

## 40. Execution Logging

Historical template, Work, and manual-event occurrences can each receive independent execution subjects/records. An Attached Activity could therefore be independently loggable if it had its own durable occurrence. Aggregate reporting must reference, not duplicate, records. Current execution has no composite/parent fields.

## 41. Goal Provenance

Goal links attach explicitly to Commitment source incarnations; publication freezes every matching Goal on each occurrence. Independent Drive, Workout, and Shower sources inherit nothing from one another. Whether attachments inherit Goal service is unresolved; current architecture requires explicit links and offers no propagation. Automatic inheritance would over-attribute overhead as outcome Progress/activity.

## 42. Goal Demand Interaction

The missing accounting seam is whether required attachment time is part of an accepted Goal-work allocation, overhead that additionally consumes Capacity, an independent Commitment, or protective buffer. Current Goal Demand/Structure architecture does not answer composition overhead. A 60m workout may require either 60m resource Demand plus 40m mandatory envelope or an explicitly accounted 100m composite; guessing risks overbooking or corrupting Progress.

## 43. Allocation / Proposal Interaction

Current Proposal-related primitives receive no composite footprint. With 75m Capacity, 60m workout Demand appears feasible despite 30m required travel. Composite feasibility must be resolved upstream or exposed to Feasibility/Proposal; otherwise constructive recommendations can be impossible.

## 44. Capacity Reservation

Current engine can reserve activity-only via a scheduled block, activity-plus-padding via buffers, or multiple independent activity intervals. It cannot preserve an entire composite envelope with differentiated component identities/requiredness. Which composite portions count against Goal allocation versus general Capacity requires specification.

## 45. Historical Publication

Historical snapshots preserve occurrence reference, source family, title, category, scheduled/unplaced/omitted/blocked plan state, absolute starts/ends, timing kind, and Goal snapshots (`code/src/core/historicalPlan/historicalPlan.ts:17-41,53-67`). They do not preserve parent, attachment/relation ID, relative rule/gap, requiredness, relation revision, composite acceptance, or paired parent occurrence. Current attachment provenance is **Not Found**.

## 46. Historical Restructuring

Existing source-incarnation and immutable occurrence snapshots are good foundations, but changing an independent commute template or Work definition cannot preserve a nonexistent old relation. Future history must bind relation revision and paired occurrence; current definitions alone would rewrite interpretation.

## 47. Summary / Reporting

Current history can list parent-like and commute-like occurrences separately and sum their durations as independent facts. It cannot aggregate a composite, label travel overhead versus buffer, deduplicate a parent envelope, or explain relation. Reported actual duration supports variance per occurrence, not composition-aware variance.

## 48. Direct Activity vs Composite View

Direct activity reporting is supported through unique occurrence/execution identities. Composite view is **Not Found** because no relationship key joins components. Future aggregation can reuse identities if relationship/paired-occurrence provenance is added and must avoid counting envelope plus components.

## 49. Persistence / Backup / Restore

Authored setup persists templates, recurrences, shifts/cycles/segments/entries, preferences, and manual events; modern backups include active authority, profiles, decisions, history, Goals, measurements, and execution, installed atomically through restore participants. Composition would affect authored source schemas, recurrence derivation, profile/backup versions, referential validation, fingerprints, and historical formats. No current format can preserve it.

## 50. Source Replacement

Editing a parent source regenerates later preview occurrences from current authority. Independent candidate placement may change geometrically but has no relation contract. Existing occurrence/replay logic can mark decisions stale/unapplied against changed sources, but cannot validate attachment continuity.

## 51. Deletion / Retirement

Source incarnation prevents stale Goal links/decisions from retargeting recreated sources. Current setup deletion removes current generation while historical occurrences and decisions remain durable references. No relationship retirement exists; future composition needs it to preserve old coupling without resurrecting children.

## 52. Structural Suggestions

No engine path was found that proposes new authored Commitment-like activities. Suggested fixes modify occurrence treatment, not create recurring sources. A future travel suggestion could reuse proposal/accepted-decision provenance patterns, but explicit acceptance must precede authored recurring time authority.

## 53. User Authority

Templates, recurrences, shifts, and manual events are user-authored; their occurrences are derived. Suggested fixes are non-authoritative until accepted as PlanDecisions. Generated Attached Activities would be proposed until acceptance creates an attachment source/relation; mere inference cannot reserve future time.

## 54. Determinism

Future composition necessarily requires stable relation identity, deterministic source-to-occurrence pairing, inherited applicability, relative timing, composite feasibility, atomic movement/omission, user-day mapping, Capacity footprint, and historical provenance. Existing sorting, canonical user-day, occurrence references, and replay patterns are reusable; algorithms remain unspecified.

## 55. Candidate Composition Vocabulary

| Concept | Classification |
|---|---|
| Commitment | Already First-Class |
| Attached Activity | Missing |
| Buffer | Partially Represented (numeric scheduling field) |
| Sub-step | Not Found; possibly unnecessary for scheduling composition |
| Attachment Relationship | Missing |
| Composite Commitment | Missing |
| Composite Occurrence | Missing |
| Relative Timing Rule | Partial Work-specific analogue |
| Composition Failure | Missing |

## 56. Current-System Flows

```text
Shift authority → Work generation → locked Work block → preview
→ overlap Friction → HistoricalPlan occurrence → Execution

Template + independent recurrence → candidate → preferred-window placement
→ scheduled block OR unplaced candidate → Friction → HistoricalPlan → Execution

Manual event → fixed scheduled block → preview → Friction
→ HistoricalPlan → Execution
```

An attachment relation would need to enter before occurrence expansion/pairing and survive placement, Friction, publication, and execution. It does not exist in any current flow.

## 57. Intended Composition Boundary Flow

Conceptual and **not implemented**:

```text
Parent Commitment authority + Attached Activity authority + Attachment relationship
→ parent occurrence expansion → paired attached-occurrence derivation
→ composite feasibility/Capacity footprint
→ atomic scheduled composite OR Composition Failure/Friction
→ accepted resolution → historical relationship publication
→ independent component execution + deduplicated composite reporting
```

## 58. Current Support Classification

Primary: **CC3 — Relative / Reference Placement Primitives**.

| Area | Classification |
|---|---|
| Buffer Support | CC2-equivalent partial: numeric padding, no identity/history |
| Parent-Relative Timing | CC3: Work-specific transient geometry |
| Recurrence Inheritance | CC5: Not Found |
| Parent Movement Coupling | CC5: Not Found |
| Parent Omission Coupling | CC5: Not Found |
| Composite Feasibility | CC5: Not Found |
| Composite Friction | CC5: Not Found |
| Historical Attachment Provenance | CC5: Not Found |
| Execution of Attached Activities | CC4: independent occurrences can execute |
| Capacity Accounting | CC3: intervals/buffers work, composite meaning absent |
| Goal-Demand Overhead Accounting | CC5: Not Found |

## 59. Current-vs-Needed Matrix

| Concern | Current Behavior | Evidence | Classification | Needed Before Proposal? | Risk if Deferred |
|---|---|---|---|---|---|
| Parent/Child relation | None | block types | Not Found | Yes | No coupling |
| Attached identity | Independent source only | source/occurrence types | Missing | Yes | Lost provenance |
| Buffers | Numeric occupied padding | placement/friction | Partial | Boundary yes | Activity erased |
| Parent-relative timing | first/last Work heuristic | placement 448-520 | CC3 | Yes | Wrong pairing |
| Recurrence inheritance | Own recurrence only | generation 34-115 | Missing | Yes | Drift |
| Parent movement | One occurrence at a time | PlanDecision | Missing | Yes | Orphan child |
| Parent omission | One occurrence at a time | PlanDecision | Missing | Yes | Child remains |
| Composite feasibility | Separate placement | placement loop 25-53 | Missing | Yes | Impossible proposal |
| Friction | overlaps/unplaced | friction types | Partial | Yes | Hidden bundle failure |
| PlanDecision | Single occurrence | planDecision types | Adaptable | Yes | Non-atomic fix |
| Capacity | Occupied intervals/buffers | placement 677-715 | Partial | Yes | Wrong footprint |
| Goal Demand overhead | None | GDA/spec trace | Missing | Yes | Overbooking |
| History | Individual snapshot | HistoricalPlan | Partial | Yes | No attachment truth |
| Execution | Per occurrence + actual duration | executionRecord | Adaptable | Provenance yes | No composite variance |
| Found Time | No composition consumer | search | Missing | Later, boundary now | False availability |
| Summary | Independent facts | history projections | Partial | Rules later | Double count |

## 60. Primitive-Reuse Matrix

| Future Concern | Existing Primitive | Evidence | Reuse Classification | Required Adaptation | Risk |
|---|---|---|---|---|---|
| Source ID | template/shift/manual IDs | types | Directly Reusable | Relation endpoints | Collision |
| Source incarnation | incarnation refs | candidates/durable refs | Directly Reusable | Both endpoints | Retargeting |
| Recurrence | BlockRecurrence | `blocks/types.ts:95-103` | Reusable with Adaptation | Parent-derived applicability | Drift |
| Block candidate | projected template occurrence | types | Reusable with Adaptation | Pair/relation provenance | Orphaning |
| Generated Work | deterministic Work occurrence | shift generator | Reusable with Adaptation | Parent occurrence ref | Split ambiguity |
| Scheduled block | absolute interval | types | Reusable with Adaptation | Composite membership | Frozen relation loss |
| Manual event | fixed authored event | state paths | Conceptually Related but Wrong Abstraction | Explicit attachment | Independent lifecycle |
| Preferred windows | enum | `blocks/types.ts:28-34` | Conceptually Related but Wrong Abstraction | Exact relation type | Heuristic mistaken as authority |
| before/after Work | first/last search | placement 448-520 | Reusable with Adaptation | Preserve explicit pairing | Reference loss |
| User-day logic | canonical windows | placement 76-99 | Directly Reusable | Composite traversal | Midnight bugs |
| Placement engine | deterministic open-window search | placement 561-618 | Reusable with Adaptation | Composite feasibility | Partial placement |
| Unplaced candidates | liability representation | types 202-205 | Reusable with Adaptation | Composition Failure | Optionality confusion |
| Friction | overlap/unplaced | friction types | Reusable with Adaptation | Composite kinds | Symptom only |
| Suggested fixes | occurrence actions | friction types | Reusable with Adaptation | Atomic bundle targets | Partial fix |
| PlanDecision | durable accepted occurrence choice | decision model | Reusable with Adaptation | Composite transaction | Overloading |
| Goal links | source-incarnation association | Goal model | Reusable with Adaptation | Explicit propagation policy | Over-attribution |
| Historical occurrence | frozen occurrence | HistoricalPlan | Reusable with Adaptation | Relation/pair snapshot | Rewritten history |
| Execution history | unique subject + actual duration | executionRecord | Directly Reusable | Composite context | Duplication |
| Occupied intervals | buffer-expanded geometry | placement/friction | Directly Reusable | Typed component footprint | Meaning loss |
| Backup/restore | versioned atomic restore | restore composition | Reusable with Adaptation | Composition referential validation | Partial graph |

## 61. Buffer-vs-Activity Matrix

| Property | Buffer | Attached Activity | Independent Commitment | Current Support |
|---|---|---|---|---|
| Own identity | No | Required | Yes | Activity attachment missing |
| Own time | Protected interval | Yes | Yes | Buffer + independent only |
| Own execution | No | Expected when meaningful | Yes | Independent only |
| Parent lifecycle coupling | Same block field | Required semantics | No | Missing |
| Goal linkage | No | Requires Specification | Explicit source link | No inheritance |
| Capacity reduction | Yes | Yes | Yes | Geometry supported |
| Historical provenance | Not separately | Required | Yes | Attachment missing |
| Relative timing | Padding | Parent-relative rule | Preference/absolute | Work heuristic only |
| Movability | Moves with same block envelope | Requires coupling | Independently | Missing |
| Can create Found Time | No activity variance | Potentially | Potentially | Actual duration exists only for activity |

## 62. Composition Failure Matrix

| Scenario | Current Result | Friction? | Unplaced? | Silent Failure? | Missing Semantic |
|---|---|---:|---:|---:|---|
| Parent fits, required before activity does not | Parent placed; independent child may fail | Ordinary | Child maybe | Composite failure silent | Required bundle |
| Parent omitted | Only parent omitted | No causal friction | Child independent | Yes | Omission coupling |
| Parent moves | Parent decision only | Maybe later overlap | No automatic child result | Yes | Atomic move |
| Parent duration extends | Later geometry may collide | Ordinary | Recomputed child maybe | Relation loss | End binding |
| Required after activity overlaps hard Commitment | Separate overlap/unplaced | Yes ordinary | Maybe | Requiredness silent | Composite Friction |
| Two parent occurrences | First/last heuristic | No ambiguity friction | No | Yes | Pair identity |
| No parent occurrence | fallback/skip depending fields | Sometimes workRequired path | Sometimes/absent | Semantics inconsistent with attachment | Required parent |
| Overnight parent | Work/user-day geometry supported | Ordinary only | Maybe | Pairing absent | Cross-boundary relation |

## 63. Goal-Demand Overhead Matrix

| Scenario | Goal Work Demand | Attached Activity Time | Capacity Required | Current System Can Express? | Missing Boundary |
|---|---:|---:|---:|---:|---|
| Workout + travel | 60m | 40m | 100m | As independent blocks only | Composite overhead/accounting |
| Study + setup | 45m | 5m | 50m | Buffer or independent block | Activity-vs-buffer authority |
| Fixed appointment + commute | N/A | 30m | Appointment interval + 30m | Separate event/block only | Attachment feasibility |
| Found Time 75m + work/travel | 60m | 30m | 90m; infeasible | No | Proposal footprint |

The audit does not decide whether overhead belongs inside Goal Demand or is a required Capacity envelope; it establishes that the distinction must be specified.

## 64. Worked Scenarios

### Scenario A — Commute Before Work
An independent beforeWork template can prefer the first Work block but stores no binding. True attachment: **Not Found**.

### Scenario B — Commute After Work
Regeneration may follow the new last Work end; existing placement/history remains absolute and unlinked.

### Scenario C — Work Canceled
No causal commute cancellation. `requiresWorkAnchor` can suppress a candidate, but not record parent omission coupling.

### Scenario D — Split Shift
BeforeWork chooses earliest Work. User cannot select which shift; pairing is ambiguous.

### Scenario E — Overnight Shift
Calendar/user-day geometry is supported, including cross-midnight Work. Relationship provenance is absent.

### Scenario F — Gym Composite
Four independent templates/events can occupy time; no single planning unit or atomic feasibility exists.

### Scenario G — Buffer vs Commute
Both can protect 30m, but buffer has no identity/execution/history; commute does. Attachment supplies the missing coupling.

### Scenario H — Attached Activity Conflict
An independent commute becomes ordinary overlap/unplaced Friction. Parent composite remains apparently valid.

### Scenario I — Parent Move
Only parent moves through its decision; simulated commute may be left behind until independent regeneration.

### Scenario J — Existing PlanDecision
Cannot atomically move Work and commute; target is one durable occurrence.

### Scenario K — Goal Work + Overhead
75m Capacity fits 60m core but not 90m bundle. Current Proposal inputs cannot know this.

### Scenario L — Found Time
Reported actual duration can show 15m variance for an independent occurrence, but no composition-aware Found-Time derivation exists.

### Scenario M — Conditional Attachment
Onsite-only commute needs independently duplicated recurrence/anchor heuristics; parent metadata condition is absent.

### Scenario N — Optional Attachment
No required/optional relation. Priority is not a substitute.

### Scenario O — Historical Change
Historical occurrence retains old absolute duration, but not old attachment/rule/revision.

### Scenario P — Parent Removed and Recreated
Source incarnation can prevent stale direct references from retargeting, but no attachment currently references it. It is reusable protection.

## 65. Candidate Invariant Assessment

| Candidate | Existing Architecture | Current Implementation | Future Classification |
|---|---|---|---|
| CC-CAND-INV-01 time-owning attachment reduces Capacity as activity | Required | Not Applicable Yet | Requires Specification |
| CC-CAND-INV-02 Buffer not execution activity | Required | Supported | Required |
| CC-CAND-INV-03 failed coupling not independent Commitment | Required | Not Applicable Yet | Requires Specification |
| CC-CAND-INV-04 relative timing not silently absolute | Required | Current heuristic loses relation; no claimed attachment | Requires Specification |
| CC-CAND-INV-05 parent move not orphan required child | Required | Not Applicable Yet | Requires Specification |
| CC-CAND-INV-06 omission not leave required child | Required | Not Applicable Yet | Requires Specification |
| CC-CAND-INV-07 infeasibility not hidden as Capacity | Required | Not Applicable Yet | Requires Specification |
| CC-CAND-INV-08 stable relation/history | Required | Not Applicable Yet | Requires Specification |
| CC-CAND-INV-09 deterministic composite move | Required | Not Applicable Yet | Requires Specification |
| CC-CAND-INV-10 no duplicate derivation | Required | Not Applicable Yet | Requires Specification |
| CC-CAND-INV-11 no automatic Goal propagation | Required | Supported by absence | Requires Specification |
| CC-CAND-INV-12 Demand accounts required overhead | Required for Proposal correctness | Unsupported capability | Requires Specification |
| CC-CAND-INV-13 no execution duplication | Required | Unique records supported | Requires Specification for aggregate |
| CC-CAND-INV-14 Found Time preserves plan/actual | Required | Plan/actual primitives supported | Requires Specification |
| CC-CAND-INV-15 canonical user-day | Required | Supported | Required |
| CC-CAND-INV-16 separate from Goal Structure | Required | Supported | Required |
| CC-CAND-INV-17 suggestions require acceptance | Required | Acceptance pattern supported | Requires Specification |
| CC-CAND-INV-18 preference not attachment | Required | Behavior is preference, type does not claim attachment | Required |

## 66. Architectural Risks

1. Relative placement mistaken for attachment loses lifecycle truth.
2. Buffers as activities erase execution identity.
3. Activities as buffers erase actual duration and Goals.
4. Independent recurrence drifts.
5. Parent/child cadence diverges.
6. Parent move orphans child.
7. Parent omission leaves child.
8. Required failure looks optional/unplaced.
9. Composite envelope hides component identity.
10. Aggregate reporting duplicates execution.
11. Parent edits erase old relation meaning.
12. Multiple parents create ambiguous reference.
13. Midnight assumptions corrupt overnight pairing.
14. Goal Demand fits core but ignores overhead.
15. Proposal recommends infeasible work.
16. Found Time ignores component variance.
17. Automatic Goal-link propagation over-attributes.
18. Composition expands into generic workflow sequencing.
19. Single-target PlanDecision is overloaded without atomic authority.
20. Goal Structure and Commitment Composition are conflated.

## 67. Test Coverage Assessment

Executed from `code/`: 13 focused existing test files, **155 passed, 0 failed**.

| Test files | Claims substantiated |
|---|---|
| `src/core/shifts/__tests__/generateWorkBlocks.test.ts` | deterministic/overnight Work generation |
| `src/core/blocks/tests/generateBlockCandidates.test.ts`, `placeBlockCandidates.test.ts`, `validateBlockTemplate.test.ts` | recurrence, identities, buffers, Work-relative/canonical placement, unplaced behavior |
| `src/core/friction/tests/detectScheduleFriction.test.ts`, `generateSuggestedFixes.test.ts`, `applySuggestedFix.test.ts` | overlap/unplaced Friction and occurrence-centric fixes |
| `src/core/decisions/planDecision.test.ts`, `replayPlanDecisions.test.ts` | single-occurrence accepted decisions/replay |
| `src/core/historicalPlan/materializePlanPublication.test.ts` | frozen occurrence/Goal provenance |
| `src/core/execution/tests/executionRecord.test.ts`, `src/state/executionHistorySurface.test.ts` | unique execution subjects, correction, actual duration |
| `src/state/dayFrameRestoreComposition.test.ts` | atomic cross-surface restore |

No test covers parent/child Commitments, Attached Activities, first-class buffers, recurrence inheritance, movement/omission coupling, composite feasibility/Friction, historical attachment provenance, attached execution, or Goal-Demand overhead. Absence is not used alone as proof; production schemas/paths are also traced.

## 68. Current Executable Truth

DayFrame schedules independent Work, template/recurrence, and manual-event occurrences. Buffers expand occupied time; Work-relative preferences transiently use first/last Work geometry; candidates place individually or become unplaced; Friction detects overlaps/unplaced facts; PlanDecisions mutate one durable occurrence; history and execution preserve individual occurrence truth. No structural relationship couples activities.

## 69. Composition Analogues

Reusable analogues are Work-relative windows, `requiresWorkAnchor`, buffers, source incarnation, deterministic occurrence identity, recurrence expansion, canonical user-day windows, unplaced liability, Friction, accepted decision replay, historical snapshots, and actual-duration execution evidence. Independent templates/manual events can simulate appearance, not semantics.

## 70. Missing Composition Semantics

Missing are Attached Activity and relation identity/lifecycle, parent source/occurrence references, requiredness, exact relative timing/gaps, conditional applicability, recurrence inheritance, deterministic pairing, atomic movement/omission/duration response, composite feasibility, Composition Failure/Friction, Capacity/Demand overhead accounting, historical relation revisions, composite decisions, and aggregate reporting.

## 71. Capacity / Friction Impact

Current occupied geometry can account for separate activities or anonymous padding, but cannot say which is which or reserve unresolved required components. Friction reports symptoms, not composite failure. A parent can remain scheduled when a required surrounding activity fails, making apparent Capacity and feasibility misleading.

## 72. Goal Demand / Proposal Impact

Required attachments alter total Capacity needed to realize Goal work. Current Demand and Proposal layers lack a composite footprint/accounting contract, so Proposal may recommend work whose core duration fits but whose required envelope does not. Commitment Composition must be specified before Proposal; the later specification must decide the accounting boundary without changing Progress semantics.

## 73. History / Execution Impact

Occurrence and execution identity are reusable. Future publication must preserve attachment relation revision, parent occurrence pairing, requiredness, relative rule, and composite acceptance basis. Components should be independently executable where they are real activities; composite views must reference rather than duplicate execution.

## 74. Found-Time Impact

Execution can store planned snapshot plus user-reported duration, enabling potential variance. Missing are actual end precision, attachment relation, composite rescheduling, and authority for newly free time. Composition-aware Found Time must distinguish activity variance from buffer release and retain plan/actual provenance.

## 75. Open Questions

- Whether attachments are reusable child sources, relation-owned definitions, or both.
- Exact source-to-occurrence pairing and per-occurrence exceptions.
- Required/optional and conditional applicability semantics.
- Exact relative timing/gap constraints and composite feasibility policy.
- Whether overhead is included in Goal allocation or a separate mandatory envelope.
- Buffer identity/lifecycle needs versus retaining numeric padding.
- Atomic composite decision and Friction taxonomy.
- Goal-link propagation policy.
- Historical snapshot minimum and detachment/promotion semantics.

These are normative specification questions, not implementation details.

## 76. Audit Conclusions

1. **First-class Commitment Composition?** No.
2. **First-class Attached Activities?** No.
3. **First-class buffers?** Partial numeric fields, not independent authority.
4. **Buffers time-owning activities?** No; they protect occupied time.
5. **beforeWork/afterWork true attachment?** No; transient placement heuristics.
6. **Relative placement preserves parent identity?** No.
7. **Recurrence inherits from parent?** No.
8. **Parent movement moves child?** No.
9. **Parent omission omits child?** No.
10. **Required child failure makes composite infeasible?** No composite exists.
11. **Friction distinguishes composition failure?** No.
12. **PlanDecision atomically resolves composite?** No; one target.
13. **History preserves attachment?** No.
14. **Execution logs parent/attachment distinctly?** Independent occurrences yes; attachment meaning no.
15. **Capacity distinguishes activity overhead from buffer?** Geometry yes, semantics/history no.
16. **Goal Demand accounts for overhead?** No.
17. **Proposal knows composite feasibility?** No.
18. **Found Time needs composition-aware plan/actual?** Yes for correct component variance.
19. **Independent Commitments safely simulate composition?** Only visually/approximately.
20. **Lost semantics?** Pairing, lifecycle, recurrence, requiredness, atomic feasibility/decisions, accounting, provenance.
21. **Work/Sleep relative primitives reusable?** Yes, with adaptation; not as authority.
22. **Incarnation/occurrence identity reusable?** Yes.
23. **Composition required before constructive Proposal?** Yes.
24. **Smallest needed surface?** Attachment authority, pairing/applicability, relative timing, requiredness, composite footprint/feasibility, atomic lifecycle/decision, Friction, and history/execution provenance.
25. **Next task?** Path A — Commitment Composition / Attached Activities Architecture Specification.

## 77. Recommended Next Step

**Path A — Commitment Composition / Attached Activities Architecture Specification.**

Composition materially affects Capacity, required-liability visibility, Friction, Proposal feasibility, history, execution, and user authority. Current relative placement and buffer primitives remove the need for another executable follow-up audit, but cannot supply normative coupling. The next specification should remain bounded to attached time-owning activities and protective buffers rather than general workflow sequencing. This audit does not begin that work or establish a future implementation phase.

## 78. Completion Statement

> **Commitment Composition / Attached Activities Architecture Audit complete.**
>
> The audit establishes the current executable truth of DayFrame's Commitment and scheduling domains; determines whether attached time-owning activities, buffers, parent-relative timing, recurrence inheritance, movement and omission coupling, composite feasibility, Friction, PlanDecision behavior, Capacity accounting, Goal Demand overhead, historical attachment provenance, execution logging, and Found-Time implications are represented or absent; distinguishes reusable scheduling primitives from wrong abstractions; determines whether Commitment Composition must be normatively specified before constructive Proposal work can proceed; and recommends the next architectural step without modifying implementation or assigning the work to a future implementation phase.
